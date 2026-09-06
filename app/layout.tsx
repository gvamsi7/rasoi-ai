import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Rasoi AI — Smart Indian Recipes',
  description: 'Find practical Indian recipes using the ingredients you have, with protein, fiber and healthy-fat guidance.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" suppressHydrationWarning><body>{children}</body></html>;
}
