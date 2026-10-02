import { NextResponse } from 'next/server';
import { checkBotId } from 'botid/server';
import { projects } from '@/data/projects';
import { publications } from '@/data/publications';
import { profile } from '@/data/profile';
import {
  MAX_JD_CHARS,
  MIN_JD_CHARS,
  type MatchError,
  type MatchResult,
  type MatchScore,
} from '@/lib/jdMatch';

/*
 * Scores every project against a pasted job posting with TypeSafe's Jev.
 *
 * Jev returns typed values, never prose, so the answer can only ever be a
 * ranking of projects that already exist — nothing about the career is written
 * here. The posting is not stored or logged.
 *
 * Project descriptions go in English whatever the posting's language: in the
 * Korean trial (2026-10) a Korean posting against English descriptions tracked
 * the all-English ranking most closely (ρ 0.97–1.0).
 */

export const runtime = 'nodejs';

const ENDPOINT = 'https://api.typesafe.ai/v1/systemone';
const LEVELS = [
  'Unrelated to the posting',
  'Tangentially related',
  'Relevant to some requirements',
  'Directly matches the core requirements',
];
const QUESTION = 'How relevant is `project` as evidence for the job posting in the state?';

// Asked in the same request, so it costs nothing extra: a pasted article or a
// line of chat would otherwise be ranked as if it were a posting.
const POSTING_KEY = '_is_job_posting';
const POSTING_MIN = 0.5;

// 4,000 characters is at most ~16 KB of UTF-8; anything far past that was not
// sent by the page.
const MAX_BODY_BYTES = 32_000;
const TIMEOUT_MS = 8000;

/*
 * Best effort: on serverless each instance keeps its own window, so this caps
 * a single client hammering one instance, not the total. The spend cap on the
 * TypeSafe console is what bounds the bill.
 */
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

function limited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear(); // never let the map itself grow without bound
  return recent.length > MAX_PER_WINDOW;
}

/*
 * A ceiling per instance per day, whoever is asking. Paired with the spend cap
 * on the TypeSafe console and the Vercel firewall rule, it keeps a scripted
 * loop from running up a bill even if it rotates addresses.
 */
const DAILY_CEILING = 300;
let day = '';
let dayCount = 0;

function overDailyCeiling(): boolean {
  const today = new Date().toISOString().slice(0, 10);
  if (today !== day) {
    day = today;
    dayCount = 0;
  }
  dayCount += 1;
  return dayCount > DAILY_CEILING;
}

/*
 * The same posting pasted twice (a reload, a second visitor from the same
 * team) is answered from memory. Keyed by a hash so the posting text itself is
 * never kept; entries expire after an hour.
 */
const CACHE_TTL_MS = 60 * 60_000;
const cache = new Map<string, { at: number; result: MatchResult }>();

async function hashOf(text: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return Buffer.from(digest).toString('hex');
}

/*
 * Only the page itself calls this. Browsers send Origin on every POST; a
 * mismatch is another site or a script borrowing the endpoint. (A script can
 * forge the header — this stops casual reuse, the limits stop the rest.)
 */
function sameOrigin(request: Request): boolean {
  const origin = request.headers.get('origin');
  const host = request.headers.get('x-forwarded-host') ?? request.headers.get('host');
  if (!origin || !host) return false;
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

const PUB_PREFIX = 'pub:';
const SKILL_PREFIX = 'skill:';
const SKILL_QUESTION = 'Does the job posting in the state ask for `skill`, by name or plainly?';
// Measured on the three trial postings (2026-10): skills named outright came
// back 0.62–0.98, unasked ones 0.21 or under. One near miss sits between —
// "SSE streaming" under "preferred" scored 0.41 for Streaming · Pub/Sub — and
// stays unmarked: a mark should mean the posting plainly asks for it.
const SKILL_MIN = 0.6;
const SKILLS = Object.values(profile.coreSkills).flatMap((g) => g.skills);

function describePub(p: (typeof publications)[number]): string {
  return `${p.title} — ${p.summary.en}`;
}

function describe(p: (typeof projects)[number]): string {
  const title = typeof p.title === 'string' ? p.title : p.title.en;
  return `${title} — ${p.shortDescription.en} [${p.techStack.join(', ')}]`;
}

/*
 * A key that is revoked or out of credit fails the same way on every call, so
 * once TypeSafe says so, stop asking for a while: visitors get the
 * "unavailable" line at once and the logs carry one line per pause instead of
 * one per click. The credit-exhausted status is not documented (401 is a bad
 * key), so 402 and 403 are treated the same.
 */
const PAUSE_MS = 10 * 60_000;
let pausedUntil = 0;

const fail = (error: MatchError, status: number) => NextResponse.json({ error }, { status });

type Answer = { type?: string; score?: number; confidence?: number; noul?: number };

export async function POST(request: Request) {
  const key = process.env.TYPESAFE_API_KEY;
  if (!key || Date.now() < pausedUntil) return fail('unavailable', 503);

  if (!sameOrigin(request)) return fail('invalid', 403);

  // Before anything that costs: a script that passed the Origin check by
  // forging it still has to pass BotID's challenge (always human in dev).
  if ((await checkBotId()).isBot) return fail('bot', 403);

  if (Number(request.headers.get('content-length') ?? 0) > MAX_BODY_BYTES) {
    return fail('too_long', 413);
  }

  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'local';
  if (limited(ip)) return fail('rate_limited', 429);

  let jd = '';
  try {
    const body = await request.json();
    jd = typeof body?.jd === 'string' ? body.jd.trim() : '';
  } catch {
    return fail('invalid', 400);
  }
  if (jd.length > MAX_JD_CHARS) return fail('too_long', 413);
  if (jd.length < MIN_JD_CHARS) return fail('too_short', 400);

  const hash = await hashOf(jd);
  const cached = cache.get(hash);
  if (cached && Date.now() - cached.at < CACHE_TTL_MS) {
    return NextResponse.json(cached.result);
  }

  if (overDailyCeiling()) return fail('unavailable', 503);

  /*
   * One request, one read of the posting: every project and paper is scored
   * against it, every skill is asked about, and the posting itself is checked.
   * Jev ingests the state once, so the extra questions cost next to nothing.
   */
  const questions: Record<string, unknown> = {};
  for (const p of projects) {
    questions[p.id] = {
      type: 'score',
      instructions: { project: describe(p), question: QUESTION },
      criteria: LEVELS,
    };
  }
  for (const pub of publications) {
    questions[PUB_PREFIX + pub.id] = {
      type: 'score',
      instructions: { project: describePub(pub), question: QUESTION },
      criteria: LEVELS,
    };
  }
  for (const skill of SKILLS) {
    questions[SKILL_PREFIX + skill] = {
      type: 'noul',
      instructions: { skill, question: SKILL_QUESTION },
    };
  }
  questions[POSTING_KEY] = {
    type: 'noul',
    instructions: 'Is the state a job posting or a description of a role to hire for?',
  };

  let answers: Record<string, Answer>;
  try {
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: 'jev-latest', state: { job_posting: jd }, questions }),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (res.status === 429) return fail('rate_limited', 429);
    if ([401, 402, 403].includes(res.status)) {
      pausedUntil = Date.now() + PAUSE_MS;
      console.error(`[match] TypeSafe refused the key (${res.status}); pausing for 10 min`);
      return fail('unavailable', 503);
    }
    if (!res.ok) return fail('upstream', 502);
    answers = ((await res.json()) as { answers?: Record<string, Answer> }).answers ?? {};
  } catch {
    // Timeout, network, or a body that is not JSON.
    return fail('upstream', 502);
  }

  // A reply missing any project is not a ranking we can show.
  if (projects.some((p) => typeof answers[p.id]?.score !== 'number')) {
    return fail('upstream', 502);
  }
  if ((answers[POSTING_KEY]?.noul ?? 1) < POSTING_MIN) return fail('not_posting', 422);

  const ranked = (items: { id: string; key: string }[]): MatchScore[] =>
    items
      .map(({ id, key }) => ({
        id,
        score: answers[key]?.score ?? 0,
        confidence: answers[key]?.confidence ?? 0,
      }))
      .sort((a, b) => b.score - a.score);

  const result: MatchResult = {
    matches: ranked(projects.map((p) => ({ id: p.id, key: p.id }))),
    research: ranked(publications.map((p) => ({ id: p.id, key: PUB_PREFIX + p.id }))),
    // A missing answer is not a yes.
    skills: SKILLS.filter((s) => (answers[SKILL_PREFIX + s]?.noul ?? 0) >= SKILL_MIN),
  };

  if (cache.size > 500) cache.clear();
  cache.set(hash, { at: Date.now(), result });
  return NextResponse.json(result);
}
