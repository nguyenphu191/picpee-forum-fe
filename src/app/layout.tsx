import type { Metadata } from 'next';
import { Inter, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Providers from './providers';
import LeftNav from '@/components/layout/LeftNav';
import Footer from '@/components/layout/Footer';

const inter = Inter({ 
  subsets: ['latin', 'vietnamese'],
  variable: '--font-inter',
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin', 'vietnamese'],
  variable: '--font-plus-jakarta',
});

export const metadata: Metadata = {
  title: {
    default: 'Picpee Forum | Cộng đồng Freelance & Dịch vụ số 1 Việt Nam',
    template: '%s | Picpee Forum',
  },
  description: 'Diễn đàn thảo luận, chia sẻ kinh nghiệm và kiếm tiền cùng mô hình Share & Earn của nền tảng Picpee.',
  keywords: ['Forum', 'Freelance', 'Marketing', 'Kiếm tiền online', 'Picpee'],
  metadataBase: new URL('http://localhost:3000'),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" suppressHydrationWarning className={`${inter.variable} ${plusJakarta.variable}`}>
      <body className="min-h-screen bg-zinc-950 dark:bg-black transition-colors duration-300 emerald-glow font-sans">
        <Providers>
          <Navbar />
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-16">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Left Column - Fixed Width Navigation */}
              <aside className="hidden lg:block w-64 flex-shrink-0">
                <LeftNav />
              </aside>

              {/* Center & Right Column */}
              <main className="flex-1 py-8 overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  {children}
                </div>
              </main>
            </div>
          </div>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
