import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactCompiler: true,
  /*
   * Chromium and its driver stay outside the bundle: the packed browser is a
   * binary the loader resolves at runtime, not something to trace into a chunk.
   */
  serverExternalPackages: ['@sparticuz/chromium', 'puppeteer-core'],
  /*
   * Externalising the code is only half of it — the browser itself is a brotli
   * payload under bin/ that nothing imports, so the tracer never sees it and
   * the lambda ships without a browser. Name it explicitly.
   */
  outputFileTracingIncludes: {
    '/api/export': ['./node_modules/@sparticuz/chromium/bin/**'],
  },
};

export default nextConfig;
