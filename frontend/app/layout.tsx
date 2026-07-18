import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Profile',
  description: 'A digital profile',
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
      <body className="min-h-screen bg-white text-gray-900">
        <header className="border-b border-gray-100">
          <nav className="max-w-3xl mx-auto flex gap-8 px-6 py-4 text-sm">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="hover:text-gray-500 transition-colors"
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
