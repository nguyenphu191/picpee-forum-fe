import Link from 'next/link';
import { FileText, Lock, Zap, MessageSquare, TrendingUp, Tag } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-zinc-800 bg-zinc-950 mt-16">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center">
                <Zap className="w-5 h-5 text-black" />
              </div>
              <span className="font-black text-zinc-100 text-xl tracking-tight">Picpee Forum</span>
            </div>
            <p className="text-sm text-zinc-500 leading-relaxed max-w-xs">
              Cộng đồng Freelance & Dịch vụ số 1 Việt Nam. Chia sẻ — Thảo luận — Kiếm tiền bền vững cùng hàng ngàn thành viên.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Hỗ trợ</h4>
            <ul className="space-y-3">
              <li><Link href="/terms" className="text-sm text-zinc-500 hover:text-emerald-400">Điều khoản</Link></li>
              <li><Link href="/policy" className="text-sm text-zinc-500 hover:text-emerald-400">Bảo mật</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Liên hệ</h4>
            <p className="text-sm text-zinc-500">
              Góp ý hoặc báo cáo vi phạm:<br/>
              <a href="mailto:support@picpee.vn" className="text-emerald-600 font-bold hover:text-emerald-500">support@picpee.vn</a>
            </p>
            <div className="flex gap-4 pt-2">
               {/* Social placeholders could go here */}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-zinc-800/60 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-zinc-600">
            Xây dựng với ❤️ tại Việt Nam — Picpee Forum v1.0
          </p>
          <div className="flex items-center gap-4 text-xs text-zinc-600">
            <Link href="/terms" className="hover:text-zinc-400 transition-colors">Điều khoản</Link>
            <span>·</span>
            <Link href="/policy" className="hover:text-zinc-400 transition-colors">Bảo mật</Link>
            <span>·</span>
            <a href="mailto:support@picpee.vn" className="hover:text-zinc-400 transition-colors">Liên hệ</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
