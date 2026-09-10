import type { Metadata } from 'next';
import { JetBrains_Mono } from 'next/font/google';
import './globals.css';

/*
 * Body type is Pretendard (variable, dynamic subset) so Korean and Latin share
 * one design instead of a Latin display face falling back to a system Gothic
 * mid-sentence. Mono is reserved for Latin/numeric metadata only.
 */
const PRETENDARD_CSS =
  'https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css';

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Ruo Lee — AI Engineer',
  description:
    'AI engineer building LLM agent platforms — execution runtime, orchestration, memory, and quality evaluation — with published research on RAG and LLM agents.',
};

/**
 * Resolves the theme before first paint so a dark-mode visitor never sees a
 * light flash. Explicit choice (localStorage) wins; otherwise follow the OS.
 */
const THEME_INIT = `(function(){try{var s=localStorage.getItem('theme');var d=window.matchMedia('(prefers-color-scheme: dark)').matches;var t=s==='dark'||s==='light'?s:(d?'dark':'light');document.documentElement.setAttribute('data-theme',t);}catch(e){}})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={jetbrainsMono.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT }} />
        <link rel="preconnect" href="https://cdn.jsdelivr.net" crossOrigin="anonymous" />
        <link rel="stylesheet" href={PRETENDARD_CSS} />
        {/* Serif, for what a project achieved and for the prose in its detail
            sheet — nowhere else. Weight 500 is all the emphasis needs, so no
            700 is fetched. Google serves the face as unicode-range subsets, so
            a page pulls only the slices its own characters need. */}
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* The rule warns about a font added to a single page; this is the root
            layout, so it is on every one. */}
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@400;500&display=swap"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
