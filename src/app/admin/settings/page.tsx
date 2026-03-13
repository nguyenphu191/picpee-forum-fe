'use client';

import { Settings, ShieldAlert } from 'lucide-react';

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black">Cài đặt hệ thống</h1>
        <p className="text-gray-500 font-medium">Cấu hình các thông số diễn đàn (Sắp ra mắt).</p>
      </div>

      <div className="p-12 rounded-3xl glass border border-white/20 text-center space-y-4 shadow-sm">
        <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-gray-400">
           <Settings className="w-8 h-8 animate-spin-slow" />
        </div>
        <h3 className="text-xl font-bold">Đang phát triển</h3>
        <p className="text-gray-500">Tính năng này sẽ được ra mắt trong bản cập nhật tới để tối ưu toàn bộ trang.</p>
      </div>
    </div>
  );
}
