"use client";

import { motion } from "framer-motion";
import { Coffee, Star } from "lucide-react";

/**
 * کامپوننت Hero
 * این کامپوننت بخش معرفی (Hero Section) صفحه اصلی را تشکیل می‌دهد.
 * منطق پیاده‌سازی:
 * 1. استفاده از `framer-motion` برای اعمال انیمیشن‌های جذاب در ورود عناصر (آیکون، عنوان، زیرعنوان).
 * 2. طراحی بصری با استفاده از Tailwind CSS و گرادیانت‌های رنگی گرم (قهوه‌ای/کهربایی).
 * 3. شامل یک نشانگر اسکرول متحرک برای راهنمایی کاربر به بخش منو.
 */
export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* الگوی پس‌زمینه */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-100 via-orange-50 to-yellow-50">
        <div
          className={`absolute inset-0 bg-[url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23fbbf24' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")] opacity-30`}
        ></div>
      </div>

      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        {/* انیمیشن آیکون قهوه */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 1, type: "spring" }}
          className="mb-8 flex justify-center"
        >
          <div className="bg-gradient-to-br from-amber-600 to-orange-600 p-6 rounded-full shadow-2xl">
            <Coffee className="w-16 h-16 text-white" />
          </div>
        </motion.div>

        {/* عنوان اصلی */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-amber-800 via-orange-700 to-red-700 bg-clip-text text-transparent mb-6"
        >
          فابیو کافه
        </motion.h1>

        {/* زیرعنوان */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-xl md:text-2xl text-amber-800 mb-8 font-medium"
        >
          تجربه طعم واقعی قهوه در فضایی گرم و صمیمی
        </motion.p>

        {/* ویژگی‌ها */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-wrap justify-center gap-4 mb-12"
        >
          {[
            { icon: Star, text: "بهترین دانه‌های قهوه" },
            { icon: Coffee, text: "طعم‌های منحصر به فرد" },
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
              className="bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg flex items-center gap-2"
            >
              <feature.icon className="w-5 h-5 text-amber-600" />
              <span className="text-amber-800 font-medium">{feature.text}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* نشانگر اسکرول */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-6 h-10 border-2 border-amber-600 rounded-full flex justify-center"
          >
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1 h-3 bg-amber-600 rounded-full mt-2"
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
