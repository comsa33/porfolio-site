import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactCompiler: true,
  /*
   * Chromium and its driver must stay outside the bundle: the packed browser is
   * a binary the loader has to resolve at runtime, not something to trace.
   */
  serverExternalPackages: ['@sparticuz/chromium', 'puppeteer-core'],
};

export default nextConfig;
