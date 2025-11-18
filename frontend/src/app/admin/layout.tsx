'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Coffee, LogOut, LayoutDashboard, Package, ShoppingCart, Users } from 'lucide-react';

/**
 * کامپوننت AdminLayout
 * این لایه برای صفحات پنل مدیریت استفاده می‌شود و شامل نوار کناری (Sidebar) و منطق احراز هویت سمت کلاینت است.
 * منطق پیاده‌سازی:
 * 1. بررسی وجود توکن `adminToken` در `localStorage`.
 * 2. در صورت عدم وجود توکن، کاربر به صفحه ورود هدایت می‌شود.
 * 3. مدیریت وضعیت بارگذاری (Loading) تا زمان بررسی توکن.
 */
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isLoading, setIsLoading] = useState(true); // وضعیت بارگذاری اولیه
  const router = useRouter(); // هوک مسیریابی Next.js

  // useEffect برای بررسی توکن در زمان بارگذاری کامپوننت
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      // اگر توکن وجود نداشت، به صفحه ورود هدایت کن
      router.push('/admin/login');
    } else {
      // اگر توکن وجود داشت، بارگذاری کامل شده است
      setIsLoading(false);
    }
  }, [router]);

  // تابع خروج از سیستم
  const handleLogout = () => {
    localStorage.removeItem('adminToken'); // حذف توکن
    localStorage.removeItem('adminData'); // حذف اطلاعات مدیر
    router.push('/admin/login'); // هدایت به صفحه ورود
  };

  // نمایش صفحه بارگذاری در حین بررسی توکن
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Coffee className="w-12 h-12 text-amber-600 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-600">در حال بارگذاری...</p>
        </div>
      </div>
    );
  }

  // تعریف آیتم‌های منوی نوار کناری
  const menuItems = [
    { href: '/admin/dashboard', label: 'داشبورد', icon: LayoutDashboard },
    { href: '/admin/categories', label: 'دسته‌بندی‌ها', icon: Package },
    { href: '/admin/items', label: 'آیتم‌ها', icon: Coffee },
    { href: '/admin/orders', label: 'سفارشات', icon: ShoppingCart },
    { href: '/admin/tables', label: 'میزها', icon: Users },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* نوار کناری (Sidebar) */}
      <motion.div
        initial={{ x: -250 }} // انیمیشن ورود از چپ
        animate={{ x: 0 }}
        className="w-64 bg-white shadow-lg"
      >
        <div className="p-6 border-b">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-amber-600 rounded-lg flex items-center justify-center">
              <Coffee className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">فابیو کافه</h1>
              <p className="text-sm text-gray-600">پنل مدیریت</p>
            </div>
          </div>
        </div>

        <nav className="p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="flex items-center space-x-3 p-3 rounded-lg text-gray-700 hover:bg-amber-50 hover:text-amber-600 transition-colors"
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* دکمه خروج */}
        <div className="absolute bottom-0 w-64 p-4 border-t">
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 p-3 rounded-lg text-red-600 hover:bg-red-50 w-full transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>خروج</span>
          </button>
        </div>
      </motion.div>

      {/* محتوای اصلی */}
      <div className="flex-1 overflow-auto">
        <motion.div
          initial={{ opacity: 0 }} // انیمیشن محو شدن
          animate={{ opacity: 1 }}
          className="p-8"
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
}