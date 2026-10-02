import { initBotId } from 'botid/client/core';

/*
 * The one request on the site that spends money per call. BotID attaches an
 * invisible challenge to it, and /api/match turns away what fails — no
 * CAPTCHA, nothing a visitor sees.
 */
initBotId({
  protect: [{ path: '/api/match', method: 'POST' }],
});
