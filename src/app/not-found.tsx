import Link from 'next/link';
import { Ghost, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen -mt-16 flex items-center justify-center p-4">
      <div className="max-w-md w-full p-8 rounded-[3rem] glass border border-zinc-200 dark:border-white/10 shadow-2xl text-center space-y-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

        <div className="relative z-10 w-32 h-32 rounded-3xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500 flex items-center justify-center mx-auto mb-8 shadow-inner animate-[bounce_8s_ease-in-out_infinite]">
          <Ghost className="w-16 h-16 animate-pulse" />
        </div>

        <div className="space-y-2 relative z-10">
           <h1 className="text-6xl font-black bg-linear-to-br from-zinc-900 to-zinc-500 dark:from-white dark:to-zinc-500 bg-clip-text text-transparent">404</h1>
           <h2 className="text-2xl font-black">Lạc đường rồi bạn ơi!</h2>
           <p className="text-zinc-500 dark:text-zinc-400 font-medium">Chủ đề hoặc trang bạn đang tìm kiếm không tồn tại, đã bị xoá hoặc chuyển đi nơi khác.</p>
        </div>

        <div className="pt-6 relative z-10">
           <Link href="/">
              <button className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl bg-primary-500 text-black font-black hover:bg-primary-400 hover:shadow-xl hover:shadow-primary-500/20 hover:-translate-y-1 transition-all active:scale-95">
                 <ArrowLeft className="w-5 h-5" />
                 Quay về Trang chủ
              </button>
           </Link>
        </div>
      </div>
    </div>
  );
}
