import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Project Eakalaiva',
  description: 'Skill-tracking and opportunity platform for Tamil Nadu engineering students',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-manrope bg-background text-on-surface antialiased">
        {children}
      </body>
    </html>
  );
}
