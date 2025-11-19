'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Coffee, LogOut, LayoutDashboard, Package, ShoppingCart, Users } from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null); // null = در حال بررسی
  const [mounted, setMounted] = useState(false);

  // فقط یک بار بعد از mount شدن کلاینت اجرا بشه
  useEffect(() => {
    setMounted(true);

    const token = localStorage.getItem('adminToken');
    const authenticated = !!token;
    setIsAuthenticated(authenticated);

    // منطق ریدایرکت
    if (pathname === '/admin/login') {
      if (authenticated) {
        router.replace('/admin/dashboard');
      }
      return;
    }

    if (!authenticated) {
      router.replace('/admin/login');
    }
  }, [pathname, router]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminData');
    router.push('/admin/login');
  };

  // اگر هنوز mount نشده یا در حال بررسی احراز هویت هستیم
  if (!mounted || isAuthenticated === null) {
    // فقط محتوای اصلی رو نشون بده (بدون سایدبار)
    return (
      <div className="min-h-screen bg-gray-50">
        {children}
      </div>
    );
  }

  // اگر لاگین هستیم، فقط children رو نشون بده
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  // اگر احراز هویت نشده
  if (!isAuthenticated) {
    return null;
  }

  const menuItems = [
    { href: '/admin/dashboard', label: 'داشبورد', icon: LayoutDashboard },
    { href: '/admin/categories', label: 'دسته‌بندی‌ها', icon: Package },
    { href: '/admin/items', label: 'آیتم‌ها', icon: Coffee },
    { href: '/admin/orders', label: 'سفارشات', icon: ShoppingCart },
    { href: '/admin/tables', label: 'میزها', icon: Users },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* سایدبار - فقط در کلاینت رندر میشه */}
      <motion.div
        initial={{ x: 300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-64 bg-white shadow-xl fixed right-0 top-0 h-screen overflow-y-auto z-40"
      >
        <div className="p-6 border-b">
          <div className="flex items-center gap-3">
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
              const isActive = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                      isActive
                        ? "bg-amber-100 text-amber-700 font-medium shadow-sm"
                        : "text-gray-700 hover:bg-amber-50 hover:text-amber-600"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t bg-white">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 p-3 rounded-lg text-red-600 hover:bg-red-50 w-full transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>خروج</span>
          </button>
        </div>
      </motion.div>

      {/* محتوای اصلی */}
      <div className="mr-64 flex-1">
        <motion.main
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="p-8 min-h-screen"
        >
          {children}
        </motion.main>
      </div>
    </div>
  );
}