'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Plus, Minus } from 'lucide-react';
import { Item } from '@/lib/api';

interface ItemDetailProps {
  item: Item | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (item: Item, quantity: number) => void;
}

/**
 * کامپوننت ItemDetail
 * این کامپوننت جزئیات یک آیتم منو را به صورت مودال نمایش می‌دهد و امکان افزودن آن به سبد خرید را فراهم می‌کند.
 * منطق پیاده‌سازی:
 * 1. مدیریت وضعیت تعداد (Quantity) آیتم انتخاب شده.
 * 2. نمایش اطلاعات کامل آیتم شامل تصویر، توضیحات، قیمت و دسته‌بندی.
 * 3. استفاده از انیمیشن‌های `framer-motion` برای نمایش مودال.
 */
export default function ItemDetail({
  item, // آیتم منو
  isOpen, // وضعیت باز بودن مودال
  onClose, // تابع بستن مودال
  onAddToCart, // تابع افزودن به سبد خرید
}: ItemDetailProps) {
  const [quantity, setQuantity] = useState(1); // تعداد آیتم برای سفارش

  // بازنشانی تعداد به 1 هنگام باز شدن مودال
  useEffect(() => {
    if (isOpen) {
      setQuantity(1);
    }
  }, [isOpen]);

  if (!item) return null;

  // تابع افزودن آیتم به سبد خرید و بستن مودال
  const handleAddToCart = () => {
    onAddToCart(item, quantity);
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      onClick={onClose} // بستن با کلیک روی پس‌زمینه
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()} // جلوگیری از بسته شدن مودال با کلیک داخلی
      >
        <div className="relative">
          {/* نمایش تصویر آیتم */}
          {item.imageUrl ? (
            <img
              src={item.imageUrl}
              alt={item.name}
              className="w-full h-64 object-cover"
            />
          ) : (
            <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
              <span className="text-gray-500 text-lg">بدون تصویر</span>
            </div>
          )}
          {/* دکمه بستن */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
            aria-label="Close item details"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{item.name}</h2>
            <p className="text-gray-600 mb-4">{item.description}</p>
            <div className="flex items-center justify-between mb-6">
              {/* نمایش قیمت */}
              <span className="text-3xl font-bold text-amber-600">${item.price.toFixed(2)}</span>
              <span className="text-sm text-gray-500">
                دسته‌بندی: {item.category?.name || 'بدون دسته‌بندی'}
              </span>
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-4">تعداد</h3>
            <div className="flex items-center space-x-4 mb-6">
              {/* دکمه کاهش تعداد */}
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-2 border rounded-lg hover:bg-gray-50 transition-colors"
                aria-label="Decrease quantity"
              >
                <Minus className="w-5 h-5" />
              </button>
              <span className="text-xl font-semibold w-12 text-center">{quantity}</span>
              {/* دکمه افزایش تعداد */}
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="p-2 border rounded-lg hover:bg-gray-50 transition-colors"
                aria-label="Increase quantity"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>

            <div className="flex space-x-4">
              {/* دکمه افزودن به سبد خرید با نمایش قیمت کل */}
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-amber-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-amber-700 transition-colors"
              >
                افزودن به سبد خرید - ${(item.price * quantity).toFixed(2)}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}