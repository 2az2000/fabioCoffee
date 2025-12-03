"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Plus, Coffee, CoffeeIcon } from "lucide-react";
import SmartImage from "./ImageSmart";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface Category {
  id: string;
  name: string;
  items?: Item[];
}
interface Item {
  id: string;
  name: string;
  description: string | null;
  price: number;
  imageUrl: string | null;
  isActive: boolean;
  isWeighted?: boolean;
  pricingBaseGrams?: number | null;
}

export default function MenuPro() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [cart, setCart] = useState<{ [key: string]: number }>({});
  const [loading, setLoading] = useState(true);
  const [weightCalcItem, setWeightCalcItem] = useState<Item | null>(null);
  const [weightGrams, setWeightGrams] = useState<string>("");
  const [weightPrice, setWeightPrice] = useState<number>(0);

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
    const res = await fetch(
      `http://localhost:3001/api/items?categoryId=${catId}&active=true`
    );
    const { data } = await res.json();
    setCategories((prev) =>
      prev.map((cat) => (cat.id === catId ? { ...cat, items: data } : cat))
    );
  };

  const addToCart = (itemId: string) => {
    setCart((prev) => ({ ...prev, [itemId]: (prev[itemId] || 0) + 1 }));
  };

  const totalItems = Object.values(cart).reduce((a, b) => a + b, 0);

  const openWeightCalc = (item: Item) => {
    setWeightCalcItem(item);
    const base = item.pricingBaseGrams || 1000;
    setWeightGrams(String(base));
    setWeightPrice(Math.round((item.price * base) / base));
  };

  const computePrice = (item: Item, grams: number) => {
    const base = item.pricingBaseGrams || 1000;
    if (base <= 0) return 0;
    return (item.price * grams) / base;
  };

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

  const currentItems =
    categories.find((c) => c.id === activeCategory)?.items || [];

  return (
    <>
      <section className="min-h-screen bg-gradient-to-br from-fabio-green-400 via-fabio-green-700 to-fabio-green-500 py-16">
        <div className="max-w-5xl mx-auto">
          {/* هدر مینیمال و شیک */}
          <motion.div
            className="relative text-center mb-16 py-12 overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            {/* پس‌زمینه نور نرم */}
            <motion.div
              animate={{ opacity: [0.06, 0.14, 0.06] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 -z-10 pointer-events-none"
            >
              <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
                    w-96 h-96 bg-fabio-green-600/20 rounded-full blur-3xl"
              />
            </motion.div>

            {/* عنوان */}
            <motion.h1 className="text-6xl md:text-7xl lg:text-8xl font-bold fabio-logo tracking-tight">
              <motion.span
                initial={{ y: 70, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{
                  duration: 1.1,
                  delay: 0.3,
                  ease: [0.25, 0.1, 0.25, 1],
                }}
                className="inline-block text-white/85"
              >
                کافه
              </motion.span>{" "}
              <motion.span
                initial={{ y: 70, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{
                  duration: 1.1,
                  delay: 0.5,
                  ease: [0.25, 0.1, 0.25, 1],
                }}
                className="inline-block bg-gradient-to-r from-fabio-green-300 via-fabio-green-100 to-yellow-200 
                 bg-clip-text text-transparent font-black"
                style={{ textShadow: "0 4px 30px rgba(34, 197, 94, 0.25)" }}
              >
                فابیو
              </motion.span>
            </motion.h1>

            {/* خط زیر عنوان */}
            <div className="flex justify-center mt-8">
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{
                  duration: 1.4,
                  delay: 1.2,
                  ease: [0.4, 0, 0.2, 1],
                }}
                style={{ transformOrigin: "left" }}
                className="relative h-px w-48 bg-gradient-to-r from-transparent via-fabio-green-500 to-transparent"
              >
                {/* لایه درخشان متحرک روی خط */}
                <motion.div
                  className="absolute inset-0 h-px bg-fabio-green-400/80"
                  animate={{ x: ["-100%", "100%"] }}
                  transition={{
                    duration: 2.8,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />
              </motion.div>
            </div>

            {/* ساب‌تایتل */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 1.6, ease: "easeOut" }}
              className="mt-8 text-fabio-green-300/70 text-lg tracking-widest font-light uppercase"
              style={{ letterSpacing: "0.5em" }}
            >
              Espresso · Amore · Milano
            </motion.p>

            {/* ذرات معلق — مشخص، زیبا، پخش در بالا و اطراف متن */}
            {[...Array(40)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full pointer-events-none"
                style={{
                  width: Math.random() * 3 + 1.5 + "px",
                  height: Math.random() * 3 + 1.5 + "px",
                  background: i % 3 === 0 ? "#facc15" : "#94f9bb", // کمی طلایی هم قاطی شه
                  boxShadow:
                    i % 3 === 0 ? "0 0 12px #facc15" : "0 0 12px #94f9bb",
                  left: `${5 + i * 4.8}%`,
                  top: `${15 + Math.random() * 100}%`, // بیشتر در نیمه بالایی صفحه
                }}
                initial={{ opacity: 0, y: 100 }}
                animate={{
                  opacity: [0, 0.8, 0],
                  y: [-140, -280],
                  x: Math.sin(i) * (30 + i * 5),
                }}
                transition={{
                  duration: 14 + i * 0.8,
                  repeat: Infinity,
                  delay: i * 0.4,
                  ease: "linear",
                }}
              />
            ))}
          </motion.div>

          {/* دسته‌بندی‌ها — خطی، زیبا، سریع و حرفه‌ای */}
          <div className="w-full mb-6 overflow-x-auto px-1 pb-2">
            {/* Inner container centered on larger screens, starting on mobile */}
            {/* Scrollable Container */}
            <div className="flex mx-auto w-full sm:justify-center items-center gap-1 bg-fabio-green-400 backdrop-blur-sm rounded-full px-2 py-3 shadow-lg border border-none overflow-x-auto custom-scrollbar">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setActiveCategory(cat.id);
                    if (!cat.items) fetchItems(cat.id);
                  }}
                  className={`relative px-3 py-2 flex items-center justify-center text-xl rounded-full font-medium transition-all duration-300 whitespace-nowrap fabio-logo ${
                    activeCategory === cat.id
                      ? "text-black"
                      : "text-white hover:text-white"
                  }`}
                >
                  {activeCategory === cat.id && (
                    <motion.div
                      layoutId="activeCategory"
                      className="absolute inset-0 bg-gradient-to-r from-red-900 to-red-500 rounded-full -z-10"
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 30,
                      }}
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
                      "relative p-0 overflow-hidden transition-all duration-300 group bg-fabio-green-400 border-none",
                      "flex flex-row sm:flex-col", // Responsive Layout (Image on left, Content on right)
                      item.isActive
                        ? "hover:shadow-2xl hover:-translate-y-1"
                        : "opacity-75"
                    )}
                    onClick={() => item.isWeighted && openWeightCalc(item)}
                  >
                    {/* تصویر (Image) - Occupies 1/3 of space on mobile, full width on desktop */}
                    <div className="relative w-1/3 aspect-square sm:w-full overflow-hidden rounded-r-xl sm:rounded-t-xl sm:rounded-r-none">
                      <SmartImage
                        src={item.imageUrl}
                        alt={item.name}
                        rounded={"none"}
                        fill
                        objectFit="cover"
                        className="transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                      {/* لیبل تمام شد */}
                      {!item.isActive && (
                        <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                          <span className="text-white text-2xl font-bold tracking-wider fabio-logo">
                            تمام شد
                          </span>
                        </div>
                      )}
                    </div>

                    {/* محتوا (Content) - Occupies 2/3 of space on mobile, full width on desktop */}
                    <div className="w-2/3 sm:w-full flex flex-col justify-between p-4 sm:p-5">
                      {/* Header & Description */}
                      <div>
                        <h3
                          className="font-semibold text-3xl bg-gradient-to-r from-fabio-green-800 via-fabio-green-200 to-yellow-200 
                 bg-clip-text text-transparent mb-1 fabio-logo"
                        >
                          {item.name}
                        </h3>
                        {item.description && (
                          <p className="text-lg text-white line-clamp-2 mb-3 fabio-logo">
                            {item.description}
                          </p>
                        )}
                      </div>

                      {/* Footer (Price and Button) */}
                      <div className="flex items-center justify-between mt-auto pt-2 sm:pt-4">
                        <span className="text-xl font-bold text-black fabio-logo">
                          {item.isWeighted && item.pricingBaseGrams
                            ? `${item.price.toLocaleString("fa-IR")} تومان`
                            : `${item.price.toLocaleString("fa-IR")} تومان`}
                        </span>

                        {item.isWeighted && (
                          <span className="text-xs text-white">
                            قیمت پایه برای {item.pricingBaseGrams || 1000} گرم
                          </span>
                        )}
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

      {/* وزن-محور: دیالوگ محاسبه قیمت */}
      <Dialog
        open={!!weightCalcItem}
        onOpenChange={(open) => !open && setWeightCalcItem(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>محاسبه قیمت بر اساس گرم</DialogTitle>
            <DialogDescription>
              {weightCalcItem
                ? `${
                    weightCalcItem.name
                  } — قیمت پایه ${weightCalcItem.price.toLocaleString(
                    "fa-IR"
                  )} تومان برای ${weightCalcItem.pricingBaseGrams || 1000} گرم`
                : ""}
            </DialogDescription>
          </DialogHeader>
          {weightCalcItem && (
            <div className="space-y-4">
              <div>
                <label className="text-sm text-amber-900">مقدار (گرم)</label>
                <input
                  type="number"
                  value={weightGrams}
                  onChange={(e) => {
                    const g = parseInt(e.target.value || "0");
                    setWeightGrams(e.target.value);
                    setWeightPrice(
                      computePrice(weightCalcItem, isNaN(g) ? 0 : g)
                    );
                  }}
                  className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500"
                  placeholder="مثلاً 250"
                  min={1}
                />
              </div>
              <div className="text-lg font-bold text-amber-800">
                قیمت: {Math.round(weightPrice).toLocaleString("fa-IR")} تومان
              </div>
            </div>
          )}
          <DialogFooter>
            <DialogClose className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300">
              بستن
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
