'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Coffee, Plus, ShoppingCart } from 'lucide-react';
import Image from 'next/image';

interface Category {
  id: string;
  name: string;
  description: string | null;
  items?: Item[];
}

interface Item {
  id: string;
  name: string;
  description: string | null;
  price: number;
  imageUrl: string | null;
  categoryId: string;
}

/**
 * کامپوننت Menu
 * این کامپوننت منوی اصلی کافه را نمایش می‌دهد و منطق مدیریت سبد خرید (Cart) را در خود جای داده است.
 * منطق پیاده‌سازی:
 * 1. مدیریت وضعیت دسته‌بندی‌ها، وضعیت بارگذاری، آیتم انتخاب شده برای جزئیات و محتوای سبد خرید.
 * 2. فراخوانی API برای دریافت دسته‌بندی‌ها و آیتم‌های فعال.
 * 3. استفاده از کامپوننت‌های Tabs برای فیلتر کردن آیتم‌ها بر اساس دسته‌بندی.
 * 4. نمایش آیتم‌ها در قالب Card با انیمیشن‌های `framer-motion`.
 * 5. مدیریت افزودن آیتم به سبد خرید.
 */
export default function Menu() {
  const [categories, setCategories] = useState<Category[]>([]); // لیست دسته‌بندی‌ها
  const [loading, setLoading] = useState(true); // وضعیت بارگذاری
  const [selectedItem, setSelectedItem] = useState<Item | null>(null); // آیتم انتخاب شده برای نمایش جزئیات
  const [cart, setCart] = useState<{[key: string]: number}>({}); // سبد خرید: {itemId: quantity}

  // بارگذاری دسته‌بندی‌ها در زمان mount شدن
  useEffect(() => {
    fetchCategories();
  }, []);

  // تابع فراخوانی API برای دریافت دسته‌بندی‌ها
  const fetchCategories = async () => {
    try {
      // توجه: در این پیاده‌سازی از fetch ساده استفاده شده است.
      // در یک پروژه کامل، بهتر است از سرویس `api.ts` استفاده شود.
      const response = await fetch('http://localhost:3001/api/categories');
      const data = await response.json();
      if (data.success) {
        setCategories(data.data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  // تابع افزودن یک آیتم به سبد خرید
  const addToCart = (itemId: string) => {
    setCart(prev => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + 1 // افزایش تعداد آیتم
    }));
  };

  // محاسبه تعداد کل آیتم‌های موجود در سبد خرید
  const getTotalItems = () => {
    return Object.values(cart).reduce((sum, count) => sum + count, 0);
  };

  // نمایش وضعیت بارگذاری
  if (loading) {
    return (
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="inline-block"
          >
            <Coffee className="w-12 h-12 text-amber-600" />
          </motion.div>
          <p className="mt-4 text-amber-800">در حال بارگذاری منو...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* هدر بخش منو */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-amber-900 mb-4">
            منوی ما
          </h2>
          <p className="text-xl text-amber-700">
            بهترین نوشیدنی‌ها و دسرها را در فابیو کافه تجربه کنید
          </p>
        </motion.div>

        {/* نشان سبد خرید (Cart Badge) - در گوشه بالا سمت راست */}
        <AnimatePresence>
          {getTotalItems() > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="fixed top-4 right-4 bg-amber-600 text-white p-3 rounded-full shadow-lg z-50"
            >
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5" />
                <span className="font-bold">{getTotalItems()}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* تب‌های منو برای فیلتر دسته‌بندی‌ها */}
        <Tabs defaultValue={categories[0]?.id} className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 lg:grid-cols-4 mb-8">
            {categories.map((category) => (
              <TabsTrigger key={category.id} value={category.id}>
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* محتوای هر تب (آیتم‌های دسته‌بندی) */}
          {categories.map((category) => (
            <TabsContent key={category.id} value={category.id}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {category.items?.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    {/* کارت نمایش آیتم */}
                    <Card className="h-full hover:shadow-xl transition-shadow duration-300 cursor-pointer group">
                      <CardHeader className="p-0">
                        <div className="relative h-48 overflow-hidden rounded-t-lg">
                          {item.imageUrl ? (
                            // نمایش تصویر آیتم
                            <Image
                              src={item.imageUrl}
                              alt={item.name}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            // نمایش جایگزین در صورت نبود تصویر
                            <div className="w-full h-full bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center">
                              <Coffee className="w-16 h-16 text-amber-600" />
                            </div>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent className="p-4">
                        <CardTitle className="text-xl font-bold text-amber-900 mb-2">
                          {item.name}
                        </CardTitle>
                        {item.description && (
                          <CardDescription className="text-amber-700 mb-3">
                            {item.description}
                          </CardDescription>
                        )}
                        <div className="flex items-center justify-between">
                          {/* نمایش قیمت به تومان با فرمت فارسی */}
                          <span className="text-2xl font-bold text-amber-800">
                            {item.price.toLocaleString('fa-IR')} تومان
                          </span>
                          {/* دکمه افزودن به سبد خرید */}
                          <Button
                            onClick={(e) => {
                              e.stopPropagation();
                              addToCart(item.id);
                            }}
                            size="sm"
                            className="bg-amber-600 hover:bg-amber-700"
                          >
                            <Plus className="w-4 h-4 ml-1" />
                            افزودن
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
}