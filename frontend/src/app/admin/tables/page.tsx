'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, CheckCircle, XCircle } from 'lucide-react';
import { api, Table } from '@/lib/api';

/**
 * کامپوننت TablesPage
 * این صفحه در پنل مدیریت برای نمایش وضعیت میزهای کافه استفاده می‌شود.
 * منطق پیاده‌سازی:
 * 1. بازیابی لیست میزها از API بک‌اند (`/api/tables`).
 * 2. نمایش وضعیت فعال/غیرفعال بودن هر میز.
 * 3. استفاده از انیمیشن‌های `framer-motion` برای نمایش لیست.
 */
export default function TablesPage() {
  const [tables, setTables] = useState<Table[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // بارگذاری میزها در زمان mount شدن کامپوننت
  useEffect(() => {
    loadTables();
  }, []);

  // تابع فراخوانی API برای دریافت لیست میزها
  const loadTables = async () => {
    try {
      const response = await api.getTables();
      if (response.success) {
        setTables(response.data || []);
      }
    } catch (error) {
      console.error('Failed to load tables:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // نمایش وضعیت بارگذاری
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Users className="w-12 h-12 text-amber-600 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-600">در حال بارگذاری میزها...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">مدیریت میزها</h1>
        <div className="text-sm text-gray-600">
          تعداد کل میزها: {tables.length}
        </div>
      </div>

      {/* نمایش لیست میزها به صورت گرید */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {tables.map((table, index) => (
          <motion.div
            key={table.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`bg-white rounded-xl shadow-sm p-6 border-2 ${
              table.isActive ? 'border-green-200' : 'border-red-200'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                {/* آیکون وضعیت میز */}
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                  table.isActive ? 'bg-green-100' : 'bg-red-100'
                }`}>
                  <Users className={`w-6 h-6 ${
                    table.isActive ? 'text-green-600' : 'text-red-600'
                  }`} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">میز {table.number}</h3>
                  <p className="text-sm text-gray-600">ظرفیت: {table.capacity} نفر</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              {/* برچسب وضعیت فعال/غیرفعال */}
              <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${
                table.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {table.isActive ? (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    <span>فعال</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4" />
                    <span>غیرفعال</span>
                  </>
                )}
              </div>
              <span className="text-xs text-gray-500">
                آخرین به‌روزرسانی: {new Date(table.updatedAt).toLocaleDateString('fa-IR')}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* پیام در صورت خالی بودن لیست */}
      {tables.length === 0 && (
        <div className="text-center py-12">
          <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">میزی پیدا نشد</p>
          <p className="text-gray-500">میزها پس از اضافه شدن به سیستم در اینجا نمایش داده می‌شوند.</p>
        </div>
      )}
    </div>
  );
}