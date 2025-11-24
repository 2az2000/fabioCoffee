"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Plus } from "lucide-react";
import SmartImage from "./ImageSmart";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface Category { id: string; name: string; items?: Item[]; }
interface Item {
  id: string;
  name: string;
  description: string | null;
  price: number;
  imageUrl: string | null;
  isActive: boolean;
}

export default function MenuPro() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [cart, setCart] = useState<{ [key: string]: number }>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch("http://localhost:3001/api/categories");
      const { data } = await res.json();
      setCategories(data);
      if (data.length > 0) {
        setActiveCategory(data[0].id);
        fetchItems(data[0].id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchItems = async (catId: string) => {
    const res = await fetch(`http://localhost:3001/api/items?categoryId=${catId}`);
    const { data } = await res.json();
    setCategories(prev => prev.map(cat => 
      cat.id === catId ? { ...cat, items: data } : cat
    ));
  };

  const addToCart = (itemId: string) => {
    setCart(prev => ({ ...prev, [itemId]: (prev[itemId] || 0) + 1 }));
  };

  const totalItems = Object.values(cart).reduce((a, b) => a + b, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-amber-600 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  const currentItems = categories.find(c => c.id === activeCategory)?.items || [];

  return (
    <section className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 py-16">
      <div className="max-w-5xl mx-auto">

        {/* هدر مینیمال و شیک */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-6xl font-bold text-amber-900 mb-3">
            منو
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-amber-600 to-orange-600 mx-auto rounded-full" />
        </motion.div>

        {/* دسته‌بندی‌ها — خطی، زیبا، سریع و حرفه‌ای */}
        <div className="w-full mb-6 overflow-x-auto scrollbar-hide px-1 pb-2">
          {/* Inner container centered on larger screens, starting on mobile */}
          <div className="flex w-fit mx-auto sm:justify-center items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-2 py-2 shadow-lg border border-amber-200">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setActiveCategory(cat.id);
                  if (!cat.items) fetchItems(cat.id);
                }}
                className={`relative px-3 py-3 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap ${
                  activeCategory === cat.id
                    ? "text-white"
                    : "text-amber-800 hover:text-amber-900"
                }`}
              >
                {activeCategory === cat.id && (
                  <motion.div
                    layoutId="activeCategory"
                    className="absolute inset-0 bg-gradient-to-r from-amber-600 to-orange-600 rounded-full -z-10"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* لیست آیتم‌ها — ظریف، زیبا و حرفه‌ای */}
        <motion.div
          key={activeCategory}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4"
        >
          <AnimatePresence mode="popLayout">
            {currentItems.map((item, i) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.05 }}
                className="group"
              >
                {/*
                  Mobile: flex-row-reverse (Image right, Content left)
                  Desktop (sm+): flex-col (Image top, Content bottom - original look)
                */}
                <Card
                  className={cn(
                    "relative p-0 overflow-hidden transition-all duration-300 group",
                    "flex flex-row sm:flex-col", // Responsive Layout (Image on left, Content on right)
                    item.isActive
                      ? "hover:shadow-2xl hover:-translate-y-1"
                      : "opacity-75"
                  )}
                >
                  {/* تصویر (Image) - Occupies 1/3 of space on mobile, full width on desktop */}
                  <div className="relative w-1/3 aspect-square sm:w-full overflow-hidden rounded-r-xl sm:rounded-t-xl sm:rounded-r-none">
                    <SmartImage
                      src={item.imageUrl}
                      alt={item.name}
                      rounded={'none'}
                      fill
                      objectFit="cover"
                      className="transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                    
                    {/* لیبل تمام شد */}
                    {!item.isActive && (
                      <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                        <span className="text-white text-2xl font-bold tracking-wider">تمام شد</span>
                      </div>
                    )}
                  </div>

                  {/* محتوا (Content) - Occupies 2/3 of space on mobile, full width on desktop */}
                  <div className="w-2/3 sm:w-full flex flex-col justify-between p-4 sm:p-5">
                    
                    {/* Header & Description */}
                    <div>
                      <h3 className="font-semibold text-xl text-amber-900 mb-1">
                        {item.name}
                      </h3>
                      {item.description && (
                        <p className="text-sm text-amber-700 line-clamp-2 mb-3">
                          {item.description}
                        </p>
                      )}
                    </div>

                    {/* Footer (Price and Button) */}
                    <div className="flex items-center justify-between mt-auto pt-2 sm:pt-4">
                      <span className="text-xl font-bold text-amber-800">
                        {item.price.toLocaleString("fa-IR")} ₺
                      </span>

                      {/*
                      <button
                        onClick={() => item.isActive && addToCart(item.id)}
                        disabled={!item.isActive}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-1.5 ${
                          item.isActive
                            ? "bg-amber-600 hover:bg-amber-700 text-white shadow-md"
                            : "bg-gray-200 text-gray-500 cursor-not-allowed"
                        }`}
                      >
                        <Plus className="w-4 h-4" />
                        {item.isActive ? "افزودن" : "ناموجود"}
                      </button>
                      */}
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* سبد خرید شناور — کوچک، شیک و حرفه‌ای */}
        <AnimatePresence>
          {totalItems > 0 && (
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
            >
              <div className="bg-amber-700 text-white px-6 py-4 rounded-full shadow-2xl flex items-center gap-3 text-lg font-medium">
                <ShoppingCart className="w-6 h-6" />
                <span>{totalItems} آیتم</span>
                <span className="bg-white/20 px-4 py-1.5 rounded-full text-sm">
                  مشاهده سبد
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}