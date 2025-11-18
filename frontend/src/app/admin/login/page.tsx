'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Coffee, Lock, Mail } from 'lucide-react';
import { api } from '@/lib/api';

/**
 * کامپوننت AdminLogin
 * این صفحه برای ورود مدیران به پنل مدیریت استفاده می‌شود.
 * منطق پیاده‌سازی:
 * 1. مدیریت وضعیت‌های ایمیل، رمز عبور، بارگذاری و خطا با استفاده از `useState`.
 * 2. ارسال درخواست ورود به API بک‌اند (`/api/auth/login`) با استفاده از `api.login`.
 * 3. در صورت موفقیت، توکن و اطلاعات مدیر در `localStorage` ذخیره شده و کاربر به داشبورد هدایت می‌شود.
 * 4. استفاده از انیمیشن‌های `framer-motion` برای تجربه کاربری بهتر.
 */
export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  // تابع مدیریت ارسال فرم ورود
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // فراخوانی API ورود
      const response = await api.login(email, password);
      
      if (response.success && response.data?.token) {
        // ذخیره توکن و اطلاعات مدیر
        localStorage.setItem('adminToken', response.data.token);
        localStorage.setItem('adminData', JSON.stringify(response.data.admin));
        router.push('/admin/dashboard'); // هدایت به داشبورد
      } else {
        // نمایش خطای دریافتی از سرور
        setError(response.error || 'Login failed');
      }
    } catch (err) {
      // مدیریت خطاهای شبکه یا سرور
      setError('Invalid credentials or server error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md"
      >
        <div className="text-center mb-8">
          {/* آیکون کافه با انیمیشن */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="inline-flex items-center justify-center w-16 h-16 bg-amber-600 rounded-full mb-4"
          >
            <Coffee className="w-8 h-8 text-white" />
          </motion.div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">ورود مدیر</h1>
          <p className="text-gray-600">برای مدیریت کافه وارد شوید</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* نمایش پیام خطا */}
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg"
            >
              {error}
            </motion.div>
          )}

          <div className="space-y-4">
            {/* فیلد ایمیل */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                آدرس ایمیل
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="admin@fabiocafe.com"
                  required
                />
              </div>
            </div>

            {/* فیلد رمز عبور */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                رمز عبور
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>
          </div>

          {/* دکمه ورود */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isLoading}
            className="w-full bg-amber-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? 'در حال ورود...' : 'ورود'}
          </motion.button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            اعتبارنامه‌های دمو: admin@fabiocafe.com / admin123
          </p>
        </div>
      </motion.div>
    </div>
  );
}