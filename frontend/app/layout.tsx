import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Fang Meiheng',
  description: 'Digital profile — SDET & Quality Engineer',
};

const NAV_ITEMS = [
  { href: '/resume', label: 'Resume' },
  { href: '/ask-me', label: 'Ask me' },
  { href: '/play', label: 'Play' },
  { href: '/gallery', label: 'Gallery' },
];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-canvas text-ink font-body">
        <header className="border-b border-hairline">
          <nav className="max-w-3xl mx-auto flex gap-8 px-6 py-4 text-sm font-mono uppercase tracking-wide">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-sage hover:text-mint transition-colors"
              >
                {item.label}
              </a>
            ))}
          </nav>
        </header>
        <main className="max-w-3xl mx-auto px-6 py-12">{children}</main>
      </body>
    </html>
  );
}
