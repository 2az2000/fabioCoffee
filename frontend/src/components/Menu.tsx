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
  const [loading, setLoading] = useState(true); // وضعیت بارگذاری اولیه
  const [loadingItems, setLoadingItems] = useState<{[key: string]: boolean}>({}); // وضعیت بارگذاری آیتم‌های هر دسته‌بندی
  const [imageLoading, setImageLoading] = useState<{[key: string]: boolean}>({}); // وضعیت بارگذاری تصاویر
  const [selectedItem, setSelectedItem] = useState<Item | null>(null); // آیتم انتخاب شده برای نمایش جزئیات
  const [cart, setCart] = useState<{[key: string]: number}>({}); // سبد خرید: {itemId: quantity}

  // بارگذاری دسته‌بندی‌ها در زمان mount شدن
  useEffect(() => {
    fetchCategories();
  }, []);

  // تابع فراخوانی API برای دریافت دسته‌بندی‌ها
  const fetchCategories = async () => {
    try {
      const categoriesRes = await fetch('http://localhost:3001/api/categories');
      if (!categoriesRes.ok) throw new Error('خطا در دریافت دسته‌بندی‌ها');
      
      const { data: categories } = await categoriesRes.json();
      setCategories(categories);
    } catch (error) {
      console.error('خطا در دریافت دسته‌بندی‌ها:', error);
    } finally {
      setLoading(false);
    }
  };

  // تابع فراخوانی API برای دریافت آیتم‌های یک دسته‌بندی
  const fetchCategoryItems = async (categoryId: string) => {
    try {
      setLoadingItems(prev => ({ ...prev, [categoryId]: true }));
      
      const itemsRes = await fetch(`http://localhost:3001/api/items?categoryId=${categoryId}`);
      if (!itemsRes.ok) throw new Error('خطا در دریافت آیتم‌های منو');
      
      const { data: items } = await itemsRes.json();
      
      setCategories(prev => 
        prev.map(cat => 
          cat.id === categoryId ? { ...cat, items } : cat
        )
      );
    } catch (error) {
      console.error('خطا در دریافت آیتم‌های منو:', error);
    } finally {
      setLoadingItems(prev => ({ ...prev, [categoryId]: false }));
    }
  };

  // تابع مدیریت تغییر تب‌ها
  const handleTabChange = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    if (category && !category.items) {
      // Reset image loading states when changing tabs
      setImageLoading({});
      fetchCategoryItems(categoryId);
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
      <section className="min-h-screen py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="inline-block"
          >
            <Coffee className="w-12 h-12 text-amber-600" />
          </motion.div>
          <p className="mt-4 text-amber-800">در حال بارگذاری منو، لطفاً شکیبا باشید...</p>
        </div>
      </section>
    );
  }

  // نمایش پیام خالی
  if (categories.length === 0) {
    return (
      <section className="min-h-screen py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <Coffee className="w-16 h-16 mx-auto text-amber-600 mb-4" />
          <h3 className="text-xl font-medium text-amber-800">منوی خالی است</h3>
          <p className="text-amber-600 mt-2">در حال حاضر آیتمی برای نمایش وجود ندارد</p>
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
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            منوی کافه فابیو
          </h2>
          <p className="text-xl text-muted-foreground">
            بهترین نوشیدنی‌ها و دسرها را در فابیو کافه تجربه کنید
          </p>
        </motion.div>

        {/* نشان سبد خرید (Cart Badge) - در گوشه پایین سمت چپ */}
        <AnimatePresence>
          {getTotalItems() > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="fixed bottom-6 left-6 bg-primary text-primary-foreground p-3 rounded-full shadow-lg z-50 cursor-pointer hover:bg-primary/90 transition-colors"
              onClick={() => {
                // Add your cart modal or navigation logic here
                console.log('Open cart');
              }}
            >
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5" />
                <span className="font-bold">{getTotalItems()}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* تب‌های منو برای فیلتر دسته‌بندی‌ها */}
        <Tabs 
          defaultValue={categories[0]?.id} 
          className="w-full"
          onValueChange={handleTabChange}
        >
          <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-2 md:grid-cols-4 gap-2 mb-12 p-1.5 bg-muted rounded-xl">
            {categories.map((category) => (
              <TabsTrigger 
                key={category.id} 
                value={category.id}
                disabled={loadingItems[category.id]}
                className="data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-primary rounded-lg py-2 px-4 transition-all"
              >
                {loadingItems[category.id] ? (
                  <div className="flex items-center justify-center gap-2">
                    <motion.div 
                      className="w-3 h-3 rounded-full border-2 border-primary border-t-transparent"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                    <span>{category.name}</span>
                  </div>
                ) : (
                  category.name
                )}
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
                    <Card className="h-full hover:shadow-xl transition-all duration-300 cursor-pointer group overflow-hidden p-0">
                      <CardHeader className="p-0">
                        <div className="relative h-48 overflow-hidden rounded-t-lg">
                          {item.imageUrl ? (
                            <div className="relative h-full w-full">
                              {/* Placeholder while image is loading */}
                              {imageLoading[item.id] && (
                                <div className="absolute inset-0 bg-gradient-to-br from-amber-50 to-amber-100 animate-pulse flex items-center justify-center">
                                  <motion.div
                                    className="w-8 h-8 rounded-full border-4 border-amber-200 border-t-amber-600"
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                  />
                                </div>
                              )}
                              
                              {/* Actual Image */}
                              <Image
                                src={item.imageUrl || '/file.svg'}
                                alt={item.name}
                                fill
                                className={`object-cover group-hover:scale-105 transition-transform duration-300 ${imageLoading[item.id] ? 'opacity-0' : 'opacity-100'}`}
                                onLoadingComplete={() => {
                                  setImageLoading(prev => ({ ...prev, [item.id]: false }));
                                }}
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.onerror = null;
                                  target.src = '/file.svg';
                                  setImageLoading(prev => ({ ...prev, [item.id]: false }));
                                }}
                              />
                            </div>
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