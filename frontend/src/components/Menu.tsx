"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Plus, Coffee as CoffeeIcon } from "lucide-react";
import SmartImage from "./ImageSmart";

interface Category { id: string; name: string; items?: Item[]; }
interface Item {
  id: string;
  name: string;
  description: string | null;
  price: number;
  imageUrl: string | null;
  isActive: boolean;
}

export default function MenuBeautiful() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeTab, setActiveTab] = useState<string>("");
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
      if (data.length > 0) setActiveTab(data[0].id);
      
      // بارگذاری اولین دسته‌بندی
      if (data[0]) fetchItems(data[0].id);
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
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-24 h-24 bg-amber-600 rounded-full flex items-center justify-center shadow-2xl"
        >
          <CoffeeIcon className="w-12 h-12 text-white" />
        </motion.div>
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-yellow-50 py-16 px-4">
      <div className="max-w-7xl mx-auto">

        {/* هدر زیبا */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-7xl font-bold text-amber-900 mb-4">
            منوی فابیو کافه
          </h1>
          <p className="text-xl text-amber-700 font-medium">
            هر جرعه، یک تجربه
          </p>
          <div className="w-32 h-1 bg-gradient-to-r from-amber-600 to-orange-600 mx-auto mt-6 rounded-full" />
        </motion.div>

        {/* تب‌های لوکس */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          {categories.map((cat) => (
            <motion.button
              key={cat.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setActiveTab(cat.id);
                if (!cat.items) fetchItems(cat.id);
              }}
              className={`px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 shadow-lg ${
                activeTab === cat.id
                  ? "bg-amber-700 text-white shadow-amber-700/50"
                  : "bg-white/80 text-amber-800 hover:bg-amber-100 backdrop-blur-sm border border-amber-200"
              }`}
            >
              {cat.name}
            </motion.button>
          ))}
        </div>

        {/* کارت‌های آیتم */}
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
        >
          <AnimatePresence mode="popLayout">
            {categories.find(c => c.id === activeTab)?.items?.map((item, i) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9, y: 50 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: i * 0.1 }}
                className="group"
              >
                <div className={`relative overflow-hidden rounded-3xl shadow-xl transition-all duration-500 ${
                  !item.isActive ? "opacity-70" : "hover:shadow-2xl hover:-translate-y-3"
                } bg-white`}>
                  
                  {/* تصویر */}
                  <div className="relative h-64 overflow-hidden">
                    <SmartImage
                      src={item.imageUrl}
                      alt={item.name}
                      fill
                      objectFit="cover"
                      rounded="none"
                      className="transition-transform duration-700 group-hover:scale-110"
                    />

                    {/* افکت گرادیانت طلایی */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                    {/* لیبل تمام شد */}
                    {!item.isActive && (
                      <div className="absolute inset-0 flex items-center justify-center z-10">
                        <div className="bg-red-600/90 text-white px-8 py-4 rounded-full text-2xl font-bold shadow-2xl backdrop-blur-sm">
                          تمام شد
                        </div>
                      </div>
                    )}
                  </div>

                  {/* محتوا */}
                  <div className="p-6">
                    <h3 className="text-2xl font-bold text-amber-900 mb-2">
                      {item.name}
                    </h3>
                    
                    {item.description && (
                      <p className="text-amber-700 text-sm leading-relaxed mb-4 line-clamp-2">
                        {item.description}
                      </p>
                    )}

                    <div className="flex items-center justify-between mt-6">
                      <span className="text-3xl font-bold text-amber-800">
                        {item.price.toLocaleString("fa-IR")} ₺
                      </span>

                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => item.isActive && addToCart(item.id)}
                        disabled={!item.isActive}
                        className={`px-6 py-3 rounded-full font-bold text-lg transition-all flex items-center gap-2 ${
                          item.isActive
                            ? "bg-amber-600 hover:bg-amber-700 text-white shadow-lg"
                            : "bg-gray-300 text-gray-600 cursor-not-allowed"
                        }`}
                      >
                        <Plus className="w-5 h-5" />
                        {item.isActive ? "افزودن" : "ناموجود"}
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* سبد خرید شناور */}
        <AnimatePresence>
          {totalItems > 0 && (
            <motion.div
              initial={{ scale: 0, y: 100 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0, y: 100 }}
              className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50"
            >
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="bg-amber-700 text-white px-8 py-5 rounded-full shadow-2xl flex items-center gap-4 text-xl font-bold"
              >
                <ShoppingCart className="w-8 h-8" />
                <span>{totalItems} آیتم در سبد</span>
                <span className="bg-white/20 px-4 py-2 rounded-full text-lg">
                  مشاهده سبد
                </span>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}