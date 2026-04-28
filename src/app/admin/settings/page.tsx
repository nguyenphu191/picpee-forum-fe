'use client';

import { Settings, Wrench, Bell, Shield, Database, Palette, Globe, Clock } from 'lucide-react';

const comingSoonFeatures = [
  {
    icon: <Globe className="w-5 h-5" />,
    title: 'Cài đặt chung',
    description: 'Tên diễn đàn, mô tả, logo, favicon, ngôn ngữ mặc định.',
  },
  {
    icon: <Shield className="w-5 h-5" />,
    title: 'Bảo mật & Xác thực',
    description: 'Giới hạn đăng nhập, 2FA bắt buộc, whitelist IP admin.',
  },
  {
    icon: <Bell className="w-5 h-5" />,
    title: 'Thông báo hệ thống',
    description: 'Email SMTP, thông báo đẩy, cấu hình template.',
  },
  {
    icon: <Palette className="w-5 h-5" />,
    title: 'Giao diện & Chủ đề',
    description: 'Màu sắc, font chữ, layout, dark mode mặc định.',
  },
  {
    icon: <Database className="w-5 h-5" />,
    title: 'Sao lưu & Dữ liệu',
    description: 'Lịch sao lưu tự động, xuất dữ liệu, dọn dẹp cache.',
  },
  {
    icon: <Wrench className="w-5 h-5" />,
    title: 'Bảo trì hệ thống',
    description: 'Bật/tắt chế độ bảo trì, thông báo downtime tới người dùng.',
  },
];

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black">Cài đặt hệ thống</h1>
          <p className="text-gray-500 font-medium mt-1">Cấu hình toàn diện các thông số diễn đàn.</p>
        </div>
        <span className="flex items-center gap-2 px-4 py-2 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 text-sm font-bold border border-amber-200 dark:border-amber-800">
          <Clock className="w-4 h-4" />
          Sắp ra mắt
        </span>
      </div>

      {/* Hero banner */}
      <div className="relative overflow-hidden p-10 rounded-3xl glass border border-white/20 shadow-sm text-center space-y-4">
        <div className="absolute inset-0 bg-linear-to-br from-primary-500/5 via-transparent to-purple-500/5 pointer-events-none" />
        <div className="relative">
          <div className="w-20 h-20 rounded-2xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mx-auto text-primary-600 dark:text-primary-400 shadow-inner">
            <Settings className="w-10 h-10" />
          </div>
          <h3 className="text-2xl font-black mt-5">Đang phát triển</h3>
          <p className="text-gray-500 max-w-md mx-auto mt-2">
            Trang cài đặt hệ thống đang được xây dựng và sẽ ra mắt trong bản cập nhật sắp tới. Dưới đây là các tính năng sẽ có.
          </p>
        </div>
      </div>

      {/* Feature grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {comingSoonFeatures.map((feature) => (
          <div
            key={feature.title}
            className="p-5 rounded-2xl glass border border-white/20 shadow-sm space-y-3 opacity-70 hover:opacity-90 transition-opacity"
          >
            <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-slate-800 flex items-center justify-center text-gray-400 dark:text-gray-500">
              {feature.icon}
            </div>
            <div>
              <h4 className="font-bold text-sm">{feature.title}</h4>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">{feature.description}</p>
            </div>
            <span className="inline-block px-2 py-0.5 rounded-full bg-gray-100 dark:bg-slate-800 text-gray-400 text-[10px] font-bold tracking-wide uppercase">
              Sắp có
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
