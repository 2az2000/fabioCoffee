// این فایل صفحه اصلی (Home Page) برنامه است که برای نمایش منو به مشتریان استفاده می‌شود.

import Hero from "@/components/Hero"; // کامپوننت بخش معرفی (Hero Section)
import Menu from "@/components/Menu"; // کامپوننت نمایش منو و مدیریت سبد خرید

/**
 * کامپوننت Home
 * ساختار اصلی صفحه شامل بخش معرفی و منوی محصولات است.
 */
export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100">
      {/* بخش معرفی کافه */}
      {/* <Hero /> */}
      {/* بخش منو و سفارش‌گیری */}
      <Menu />
    </main>
  );
}
