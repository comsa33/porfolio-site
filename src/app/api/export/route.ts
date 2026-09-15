import type { NextRequest } from 'next/server';
import chromium from '@sparticuz/chromium';
import puppeteer, { type Browser } from 'puppeteer-core';
import { DOC_LABELS, type PresetId } from '@/data/exportSections';
import { portfolioData as data } from '@/data';

/*
 * The real PDF.
 *
 * Chromium opens the very page a reader sees at /export and prints it, so there
 * is one document and one stylesheet — nothing about the layout is reimplemented
 * here. What this buys over handing the reader the browser's own print dialog:
 * a file that simply downloads (which matters most on iOS, where that dialog is
 * a share sheet), a filename we control, and page numbers, which CSS cannot put
 * in a page margin because Chrome does not implement the @page margin boxes.
 */

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

/*
 * This is the one expensive thing the site can be asked to do: every call opens
 * a browser. Everything else here is static or a hairline of JavaScript, so a
 * scanner hammering this route is the only shape of traffic that turns into a
 * bill. Three guards, cheapest first.
 *
 * None of them is a substitute for a spend limit and a firewall rule, and the
 * rate limit in particular only knows about the instance it is running in —
 * serverless spreads requests across several. They stop the casual case: a bot
 * that found the URL, or a page somewhere hotlinking the PDF.
 */

/** Renders in flight in this instance. A browser each; two is plenty. */
const MAX_IN_FLIGHT = 2;
let inFlight = 0;

/** Per-address budget, in this instance, over a rolling minute. */
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 6;
const recent = new Map<string, number[]>();

function overBudget(ip: string, now: number) {
  const seen = (recent.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  seen.push(now);
  recent.set(ip, seen);
  // The map is per-instance and short-lived, but an instance that stays warm
  // under a scan should not grow one entry per address for ever.
  if (recent.size > 500) {
    for (const [key, times] of recent) {
      if (!times.length || now - times[times.length - 1] > WINDOW_MS) recent.delete(key);
    }
  }
  return seen.length > MAX_PER_WINDOW;
}

/** Hosts this route will point a browser at. */
function rendererOrigin(request: NextRequest) {
  const origin = request.nextUrl.origin;
  const { hostname } = new URL(origin);
  const ours =
    hostname === 'localhost' ||
    hostname === '127.0.0.1' ||
    hostname === 'po24lio.com' ||
    hostname.endsWith('.po24lio.com') ||
    hostname.endsWith('.vercel.app');
  // nextUrl.origin comes from the Host header. Vercel will not route a host it
  // does not know to this project, so this is belt and braces — but the failure
  // it prevents is pointing a headless browser at somebody else's site, and
  // that is worth a string comparison.
  return ours ? origin : null;
}

/** Did this come from the page, or from somewhere else entirely? */
function fromOurPage(request: NextRequest) {
  const site = request.headers.get('sec-fetch-site');
  if (site === 'same-origin' || site === 'same-site') return true;
  const referer = request.headers.get('referer');
  if (!referer) return false;
  try {
    return new URL(referer).host === request.headers.get('host');
  } catch {
    return false;
  }
}

/** Local development has a real Chrome; the lambda has the packed one. */
const LOCAL_CHROME = [
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Chromium.app/Contents/MacOS/Chromium',
  '/usr/bin/google-chrome',
];

async function launch(): Promise<Browser> {
  if (process.env.VERCEL) {
    return puppeteer.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath(),
      headless: true,
    });
  }

  const { existsSync } = await import('node:fs');
  const local = LOCAL_CHROME.find((p) => existsSync(p));
  if (!local) throw new Error('No local Chrome found to render with.');
  return puppeteer.launch({ executablePath: local, headless: true });
}

const stamp = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
};

/**
 * Puppeteer renders these into the page margin, in ITS own context: no page
 * styles reach them and, crucially, neither do the page's webfonts. The
 * lambda's Chromium ships no Korean face, so Korean here comes out blank —
 * which is why the running foot is Latin.
 */
const footer = (label: string) => `
  <div style="width:100%;padding:0 15mm;font-family:-apple-system,system-ui,sans-serif;
              font-size:7pt;color:#9c9c9c;display:flex;justify-content:space-between;">
    <span>${label}</span>
    <span><span class="pageNumber"></span> / <span class="totalPages"></span></span>
  </div>`;

export async function GET(request: NextRequest) {
  // The document is offered by the page; it is not a public endpoint that
  // renders a browserful of work for anyone who finds the URL.
  if (!fromOurPage(request)) {
    return Response.json({ error: 'not_from_the_page' }, { status: 403 });
  }

  const origin = rendererOrigin(request);
  if (!origin) return Response.json({ error: 'unknown_host' }, { status: 400 });

  const ip = (request.headers.get('x-forwarded-for') ?? '').split(',')[0].trim() || 'unknown';
  if (overBudget(ip, Date.now())) {
    return Response.json(
      { error: 'too_many_renders' },
      { status: 429, headers: { 'Retry-After': '60' } },
    );
  }

  if (inFlight >= MAX_IN_FLIGHT) {
    return Response.json({ error: 'busy' }, { status: 503, headers: { 'Retry-After': '5' } });
  }

  const params = request.nextUrl.searchParams;
  const lang: 'ko' | 'en' = params.get('lang') === 'en' ? 'en' : 'ko';
  const doc = (params.get('doc') ?? 'custom') as PresetId;
  const docLabel = DOC_LABELS[doc]?.[lang] ?? DOC_LABELS.custom[lang];
  const name = data.profile.name[lang];
  const filename = `${name}_${docLabel}_${stamp()}.pdf`.replace(/\s+/g, '');
  const footLabel = `${data.profile.name.en} — ${(DOC_LABELS[doc] ?? DOC_LABELS.custom).en}`;

  // inline: the browser opens it in its own viewer, which is the only preview
  // that is exactly the document — pagination included.
  const disposition = params.get('inline') === '1' ? 'inline' : 'attachment';

  // The page to print is the preview route, minus its own auto-print and
  // colophon: this PDF carries real page numbers in the margin instead.
  const target = new URL('/export', origin);
  params.forEach((value, key) => target.searchParams.set(key, value));
  target.searchParams.set('print', '0');
  target.searchParams.set('pdf', '1');

  let browser: Browser | undefined;
  inFlight++;
  try {
    browser = await launch();
    const page = await browser.newPage();
    // The document is printed on paper, not on whatever theme a reader keeps.
    await page.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: 'light' }]);
    await page.goto(target.toString(), { waitUntil: 'networkidle0', timeout: 45_000 });
    // Pagination shifts if a webfont lands after layout.
    await page.evaluate(() => document.fonts.ready);

    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      preferCSSPageSize: false,
      displayHeaderFooter: true,
      headerTemplate: '<span></span>',
      footerTemplate: footer(footLabel),
      margin: { top: '16mm', bottom: '17mm', left: '15mm', right: '15mm' },
    });

    return new Response(pdf as unknown as BodyInit, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `${disposition}; filename*=UTF-8''${encodeURIComponent(filename)}`,
        'Cache-Control': 'no-store',
      },
    });
  } catch (error) {
    console.error('[export] pdf render failed', error);
    return Response.json({ error: 'render_failed' }, { status: 500 });
  } finally {
    inFlight--;
    await browser?.close();
  }
}
