'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, ShoppingCart } from 'lucide-react';
type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemoveItem: (itemId: string) => void;
  onCheckout: () => void;
}

/**
 * کامپوننت Cart
 * این کامپوننت سبد خرید را به صورت یک سایدبار متحرک نمایش می‌دهد.
 * منطق پیاده‌سازی:
 * 1. استفاده از `AnimatePresence` و `framer-motion` برای انیمیشن ورود/خروج سایدبار.
 * 2. محاسبه مجموع قیمت سفارش.
 * 3. ارائه توابع برای به‌روزرسانی تعداد آیتم‌ها و حذف آیتم از سبد خرید.
 */
export default function Cart({
  isOpen, // وضعیت باز بودن سبد خرید
  onClose, // تابع بستن سبد خرید
  cartItems, // لیست آیتم‌های موجود در سبد خرید
  onUpdateQuantity, // تابع به‌روزرسانی تعداد آیتم
  onRemoveItem, // تابع حذف آیتم
  onCheckout, // تابع نهایی کردن سفارش
}: CartProps) {
  // محاسبه مجموع قیمت کل سفارش
  const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* پس‌زمینه تیره (Overlay) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={onClose} // بستن با کلیک روی پس‌زمینه
          />
          
          {/* سایدبار سبد خرید */}
          <motion.div
            initial={{ x: '100%' }} // شروع از بیرون صفحه (راست)
            animate={{ x: 0 }} // حرکت به داخل
            exit={{ x: '100%' }} // حرکت به بیرون
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed right-0 top-0 h-full w-96 bg-white shadow-xl z-50 flex flex-col"
          >
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                  <ShoppingCart className="mr-2" />
                  سبد خرید
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  aria-label="Close cart" // رفع خطای دسترسی‌پذیری
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {cartItems.length === 0 ? (
                // نمایش پیام در صورت خالی بودن سبد خرید
                <div className="text-center text-gray-500 mt-8">
                  <ShoppingCart className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>سبد خرید شما خالی است</p>
                </div>
              ) : (
                // نمایش لیست آیتم‌های سبد خرید
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-gray-50 rounded-lg p-4"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{item.name}</h3>
                          <p className="text-sm text-gray-600">قیمت واحد: ${item.price.toFixed(2)}</p>
                        </div>
                        {/* دکمه حذف آیتم */}
                        <button
                          onClick={() => onRemoveItem(item.id)}
                          className="p-1 hover:bg-gray-200 rounded transition-colors"
                          aria-label={`Remove ${item.name}`} // رفع خطای دسترسی‌پذیری
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        {/* کنترل تعداد (افزایش/کاهش) */}
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                            className="p-1 hover:bg-gray-200 rounded transition-colors"
                            aria-label={`Decrease quantity of ${item.name}`} // رفع خطای دسترسی‌پذیری
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-8 text-center font-medium">{item.quantity}</span>
                          <button
                            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                            className="p-1 hover:bg-gray-200 rounded transition-colors"
                            aria-label={`Increase quantity of ${item.name}`} // رفع خطای دسترسی‌پذیری
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        {/* قیمت کل آیتم */}
                        <span className="font-semibold text-gray-900">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* بخش جمع کل و دکمه نهایی کردن سفارش */}
            {cartItems.length > 0 && (
              <div className="border-t p-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-semibold">جمع کل:</span>
                  <span className="text-2xl font-bold text-amber-600">${total.toFixed(2)}</span>
                </div>
                <button
                  onClick={onCheckout}
                  className="w-full bg-amber-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-amber-700 transition-colors"
                >
                  نهایی کردن سفارش
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
