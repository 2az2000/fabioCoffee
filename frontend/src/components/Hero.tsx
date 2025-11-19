"use client";

import { motion } from "framer-motion";
import { Coffee, ChevronDown } from "lucide-react";

/**
 * کامپوننت Hero – نسخه نهایی، لوکس، گرم و کاملاً موبایل‌محور
 * هدف: وقتی کاربر با موبایل وارد میشه، فوراً عاشق کافه بشه
 * ویژگی‌های کلیدی:
 * - طراحی اول موبایل (Mobile-First)
 * - انیمیشن‌های نرم و هوشمند (نه شلوغ)
 * - تایپوگرافی بزرگ، خوانا و جذاب
 * - پس‌زمینه گرم با بافت قهوه
 * - دکمه CTA با اسکرول نرم به بخش منو
 * - حس واقعی کافه لوکس ایرانی
 */
export default function Hero() {
  const scrollToMenu = () => {
    const menuSection = document.getElementById("menu-section");
    if (menuSection) {
      menuSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-amber-50 via-orange-50 to-amber-100">
      {/* بافت گرم و واقعی کافه (مثل دانه قهوه و بخار) */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,#7c2d12_0%,transparent_40%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,#92400e_0%,transparent_40%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#451a03_0%,transparent_30%)]" />
      </div>

      {/* بخار قهوه متحرک – حس زنده بودن کافه */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-32 h-32 bg-gradient-to-t from-transparent via-amber-200/10 to-transparent rounded-full blur-3xl"
            initial={{ y: "100vh", x: `${15 + i * 18}%`, scale: 0.8 }}
            animate={{ y: "-100vh", scale: 1.2 }}
            transition={{
              duration: 20 + i * 4,
              repeat: Infinity,
              ease: "linear",
              delay: i * 2,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 text-center px-6 py-20 max-w-4xl mx-auto">
        {/* لوگوی قهوه با افکت طلایی و درخشش */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 180, damping: 12, delay: 0.2 }}
          className="mb-10"
        >
          <div className="relative inline-block">
            {/* درخشش طلایی */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute -inset-4 bg-gradient-to-r from-amber-400 via-yellow-400 to-orange-400 rounded-full blur-3xl opacity-60"
            />
            {/* فنجان اصلی */}
            <div className="relative bg-gradient-to-br from-amber-700 via-amber-600 to-orange-700 p-8 rounded-full shadow-2xl ring-8 ring-amber-500/20">
              <Coffee className="w-20 h-20 sm:w-28 sm:h-28 text-white" strokeWidth={2} />
            </div>
          </div>
        </motion.div>

        {/* عنوان اصلی – بزرگ، جسور و طلایی */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.5 }}
        >
          <h1 className="text-6xl sm:text-7xl md:text-8xl font-black tracking-tighter mb-4">
            <span className="bg-gradient-to-r from-amber-900 via-amber-700 to-orange-800 bg-clip-text text-transparent drop-shadow-2xl">
              فابیو
            </span>
            <span className="block text-5xl sm:text-6xl md:text-7xl text-amber-900 mt-2 font-bold">
              کافه
            </span>
          </h1>
        </motion.div>

        {/* زیرعنوان – گرم و صمیمی */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.9 }}
          className="text-xl sm:text-2xl md:text-3xl text-amber-900 font-medium mb-16 max-w-2xl mx-auto leading-relaxed px-4"
        >
          هر جرعه، یک لحظه از آرامش و لذت
        </motion.p>

        {/* دکمه CTA – بزرگ، جذاب و کاملاً موبایل‌محور */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 1.3 }}
          className="mb-20"
        >
          <button
            onClick={scrollToMenu}
            className="group relative px-12 py-6 bg-gradient-to-r from-amber-700 to-orange-700 text-white font-bold text-xl sm:text-2xl rounded-3xl shadow-2xl hover:shadow-amber-600/50 transform hover:scale-105 active:scale-95 transition-all duration-300 overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-4">
              منوی امروز
              <motion.span
                animate={{ y: [0, 4, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <ChevronDown className="w-8 h-8" />
              </motion.span>
            </span>
            {/* افکت درخشش */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30"
              animate={{ x: [-100, 100] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            />
          </button>
        </motion.div>

        {/* نشانگر اسکرول ظریف */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <ChevronDown className="w-8 h-8 text-amber-800" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}







// import { motion } from "framer-motion";
// import { ChevronDown } from "lucide-react";

// /**
//  * Hero Minimal – نسخه نهایی، مینیمال، لوکس و کاملاً خاص
//  * الهام‌گرفته از برندهای لوکس جهانی مثل Aesop و Le Labo
//  * فقط با فضا، تایپوگرافی و یک خط طلایی حرف می‌زنه
//  * ۱۰۰٪ موبایل‌محور و خوانا در نور آفتاب
//  */
// export default function HeroMinimal() {
//   const scrollToMenu = () => {
//     document.getElementById("menu-section")?.scrollIntoView({ behavior: "smooth" });
//   };

//   return (
//     <section className="relative min-h-screen flex flex-col items-center justify-between bg-white overflow-hidden">
//       {/* خط طلایی بسیار نازک – امضای لوکس */}
//       <motion.div
//         initial={{ scaleX: 0 }}
//         animate={{ scaleX: 1 }}
//         transition={{ duration: 2, ease: "easeOut" }}
//         className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-amber-600 to-transparent"
//       />

//       <div className="flex-1 flex items-center justify-center px-8">
//         <div className="text-center">
//           {/* نام کافه – بزرگ، تمیز و مینیمال */}
//           <motion.div
//             initial={{ opacity: 0, y: 30 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 1.2, ease: "easeOut" }}
//           >
//             <h1 className="text-6xl sm:text-7xl md:text-8xl font-light tracking-tight text-gray-900">
//               فابیو
//             </h1>
//           </motion.div>

//           {/* زیرعنوان – فقط یک کلمه، ولی پرمعنا */}
//           <motion.p
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ delay: 0.8, duration: 1.5 }}
//             className="mt-6 text-2xl sm:text-3xl font-light text-gray-600 tracking-wider"
//           >
//             کافه
//           </motion.p>

//           {/* خط جداکننده ظریف */}
//           <motion.div
//             initial={{ width: 0 }}
//             animate={{ width: "120px" }}
//             transition={{ delay: 1.5, duration: 1.2 }}
//             className="mx-auto mt-12 h-px bg-gray-300"
//           />
//         </div>
//       </div>

//       {/* پایین صفحه – دعوت به حرکت */}
//       <motion.div
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         transition={{ delay: 2, duration: 1 }}
//         className="pb-16 px-8 text-center"
//       >
//         <p className="text-sm text-gray-500 tracking-widest uppercase mb-8">
//           کشف منو
//         </p>

//         {/* دکمه مینیمال – فقط یک دایره با فلش */}
//         <button
//           onClick={scrollToMenu}
//           className="group w-16 h-16 mx-auto rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-amber-600 hover:bg-amber-600 transition-all duration-500"
//         >
//           <motion.div
//             animate={{ y: [0, 8, 0] }}
//             transition={{ duration: 2, repeat: Infinity }}
//           >
//             <ChevronDown className="w-6 h-6 text-gray-600 group-hover:text-white transition-colors" />
//           </motion.div>
//         </button>
//       </motion.div>

//       {/* خط پایینی طلایی */}
//       <motion.div
//         initial={{ scaleX: 0 }}
//         animate={{ scaleX: 1 }}
//         transition={{ duration: 2, delay: 0.5, ease: "easeOut" }}
//         className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-amber-600 to-transparent"
//       />
//     </section>
//   );
// }





// import { motion } from "framer-motion";
// import { Coffee, ChevronDown, Sparkles } from "lucide-react";
// import { useEffect, useState } from "react";

// interface Bean {
//   x: number;
//   y: number;
//   rotate: number;
//   delay: number;
//   duration: number;
// }

// export default function HeroPerfect() {
//   const [coffeeBeans, setCoffeeBeans] = useState<Bean[]>([]);
//   const [mounted, setMounted] = useState(false);

//   const scrollToMenu = () => {
//     document.getElementById("menu-section")?.scrollIntoView({ behavior: "smooth" });
//   };

//   // فقط یک بار بعد از mount شدن در کلاینت اجرا میشه
//   useEffect(() => {
//     setMounted(true);

//     const width = window.innerWidth;
//     const height = window.innerHeight;

//     const beans: Bean[] = [...Array(14)].map(() => ({
//       x: Math.random() * width,
//       y: -100,
//       rotate: Math.random() * 720,
//       delay: Math.random() * 8,
//       duration: 18 + Math.random() * 25,
//     }));

//     setCoffeeBeans(beans);
//   }, []);

//   // تا وقتی mount نشده، فقط اسکلتون نشون بده
//   if (!mounted) {
//     return (
//       <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-amber-50 to-orange-50">
//         <div className="text-center">
//           <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto animate-pulse" />
//           <div className="mt-8 h-12 bg-gray-200 rounded w-64 mx-auto animate-pulse" />
//         </div>
//       </section>
//     );
//   }

//   return (
//     <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-amber-50 via-orange-50 to-amber-100">
//       {/* بافت کاغذ قدیمی */}
//       <div className="absolute inset-0 opacity-20">
//         <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%2392400e%22 fill-opacity=%220.08%22%3E%3Cpath d=%22M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] mix-blend-multiply" />
//       </div>

//       {/* دانه‌های قهوه – حالا ۱۰۰٪ پایدار و بدون خطا */}
//       <div className="absolute inset-0 pointer-events-none">
//         {coffeeBeans.map((bean, i) => (
//           <motion.div
//             key={i}
//             className="absolute w-3 h-4 bg-amber-900 rounded-full opacity-40 shadow-lg"
//             initial={{
//               x: bean.x,
//               y: bean.y,
//               rotate: bean.rotate,
//             }}
//             animate={{
//               y: window.innerHeight + 100,
//               rotate: bean.rotate + 1080,
//             }}
//             transition={{
//               duration: bean.duration,
//               repeat: Infinity,
//               ease: "linear",
//               delay: bean.delay,
//             }}
//           />
//         ))}
//       </div>

//       <div className="relative z-10 text-center px-6 py-20">
//         {/* لوگو */}
//         <motion.div
//           initial={{ scale: 0, rotate: -180 }}
//           animate={{ scale: 1, rotate: 0 }}
//           transition={{ type: "spring", stiffness: 120, damping: 12 }}
//           className="mb-12 relative inline-block"
//         >
//           <motion.div
//             animate={{ rotate: 360 }}
//             transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
//             className="absolute -inset-8 border-4 border-amber-600/20 rounded-full"
//           />
//           <div className="relative bg-white p-8 rounded-full shadow-2xl">
//             <Coffee className="w-20 h-20 sm:w-24 sm:h-24 text-amber-800" strokeWidth={2} />
//             <Sparkles className="absolute top-2 right-2 w-8 h-8 text-amber-600 animate-pulse" />
//           </div>
//         </motion.div>

//         {/* عنوان */}
//         <motion.div
//           initial={{ opacity: 0, y: 40 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 1.2, delay: 0.4 }}
//         >
//           <h1 className="text-6xl sm:text-7xl md:text-8xl font-bold text-amber-900 mb-4">
//             فابیو کافه
//           </h1>
//           <p className="text-2xl sm:text-3xl text-amber-700 font-medium tracking-wide">
//             طعم واقعی زندگی
//           </p>
//         </motion.div>

//         {/* ویژگی‌ها */}
//         <motion.div
//           initial={{ opacity: 0, y: 30 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.8, duration: 1 }}
//           className="flex flex-wrap justify-center gap-4 mt-16 mb-20"
//         >
//           {["دانه تازه", "بریستا حرفه‌ای", "فضای دنج", "طعم خاص"].map((item, i) => (
//             <motion.div
//               key={i}
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 1 + i * 0.15 }}
//               className="bg-white/90 backdrop-blur-sm px-6 py-4 rounded-2xl shadow-lg border border-amber-200"
//             >
//               <span className="text-amber-800 font-medium text-lg">{item}</span>
//             </motion.div>
//           ))}
//         </motion.div>

//         {/* دکمه CTA */}
//         <motion.button
//           initial={{ opacity: 0, scale: 0.9 }}
//           animate={{ opacity: 1, scale: 1 }}
//           transition={{ delay: 1.5, duration: 0.8 }}
//           onClick={scrollToMenu}
//           className="group relative px-12 py-6 bg-amber-700 hover:bg-amber-800 text-white font-bold text-xl rounded-2xl shadow-2xl hover:shadow-amber-700/50 transform hover:scale-105 transition-all duration-300"
//         >
//           <span className="flex items-center gap-3">
//             منو را ببینید
//             <ChevronDown className="w-7 h-7 group-hover:translate-y-1 transition-transform" />
//           </span>
//         </motion.button>
//       </div>

//       {/* نشانگر اسکرول */}
//       <motion.div
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         transition={{ delay: 2 }}
//         className="absolute bottom-10 left-1/2 -translate-x-1/2"
//       >
//         <motion.div
//           animate={{ y: [0, 12, 0] }}
//           transition={{ duration: 2, repeat: Infinity }}
//         >
//           <ChevronDown className="w-8 h-8 text-amber-700" />
//         </motion.div>
//       </motion.div>
//     </section>
//   );
// }






// import { motion } from "framer-motion";
// import { Coffee, ChevronDown } from "lucide-react";
// import { useState, useEffect } from "react";

// /**
//  * Hero Masterpiece – گرم‌ترین، زیبا‌ترین و کاربرپسند‌ترین Hero ممکن
//  * وقتی کاربر وارد میشه، فقط یه حس می‌گیره: "وای چقدر دوست دارم اینجا بشینم!"
//  */
// export default function HeroMasterpiece() {
//   const [mounted, setMounted] = useState(false);

//   useEffect(() => {
//     setMounted(true);
//   }, []);

//   const scrollToMenu = () => {
//     document.getElementById("menu-section")?.scrollIntoView({ behavior: "smooth" });
//   };

//   return (
//     <section className="relative min-h-screen bg-gradient-to-b from-amber-100 via-orange-50 to-yellow-50 overflow-hidden">
//       {/* نور طلایی از بالا – مثل وقتی در کافه باز میشه */}
//       <div className="absolute top-0 left-0 right-0 h-96 bg-gradient-to-b from-yellow-300/40 to-transparent blur-3xl" />

//       {/* دانه‌های قهوه که آروم می‌افتن – مثل بارون دانه قهوه! */}
//       <div className="absolute inset-0 pointer-events-none">
//         {[...Array(8)].map((_, i) => (
//           <motion.div
//             key={i}
//             className="absolute w-4 h-6 bg-amber-800 rounded-full opacity-40 shadow-2xl blur-sm"
//             initial={{ 
//               x: `${15 + i * 10}%`, 
//               y: -100,
//               rotate: 0
//             }}
//             animate={{ 
//               y: "120vh",
//               rotate: 720
//             }}
//             transition={{
//               duration: 20 + i * 4,
//               repeat: Infinity,
//               ease: "linear",
//               delay: i * 2.5,
//             }}
//           />
//         ))}
//       </div>

//       <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6">
//         {/* لوگوی بزرگ و گرم با سایه نرم */}
//         <motion.div
//           initial={{ scale: 0, y: -100, opacity: 0 }}
//           animate={{ scale: 1, y: 0, opacity: 1 }}
//           transition={{ duration: 1.5, type: "spring", stiffness: 100 }}
//           className="mb-8"
//         >
//           <div className="relative">
//             {/* سایه گرم و نرم */}
//             <div className="absolute -inset-4 bg-amber-600/30 blur-3xl rounded-full" />
            
//             <div className="relative bg-white p-10 rounded-full shadow-2xl border-8 border-amber-100">
//               <Coffee className="w-32 h-32 sm:w-40 sm:h-40 text-amber-800" strokeWidth={2.5} />
//             </div>
//           </div>
//         </motion.div>

//         {/* اسم کافه – بزرگ، گرم و دوست‌داشتنی */}
//         <motion.div
//           initial={{ opacity: 0, y: 50 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.8, duration: 1.2 }}
//           className="text-center"
//         >
//           <h1 className="text-6xl sm:text-7xl md:text-8xl font-bold text-amber-900 mb-4 tracking-tight">
//             فابیو کافه
//           </h1>
          
//           <p className="text-2xl sm:text-3xl text-amber-700 font-medium">
//             خوش آمدید 
//           </p>
//         </motion.div>

//         {/* کارت‌های گرم و دعوت‌کننده */}
//         <motion.div
//           initial={{ opacity: 0, y: 40 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 1.5, duration: 1 }}
//           className="flex flex-wrap justify-center gap-2 mt-16 mb-20"
//         >
//           {[
//             { text: "قهوه تازه", emoji: "coffee" },
//             { text: "فضای دنج", emoji: "sofa" },
//             { text: "خدمت عالی", emoji: "smiling face" },
//           ].map((item, i) => (
//             <motion.div
//               key={i}
//               whileHover={{ scale: 1.1, rotate: 5 }}
//               className="w-[90%] bg-white/95 backdrop-blur-lg px-8 py-6 rounded-3xl shadow-xl border-2 border-amber-200"
//             >
//               <span className="text-4xl mb-2 block text-left">{item.emoji}</span>
//               <p className="text-amber-800 font-semibold text-lg">{item.text}</p>
//             </motion.div>
//           ))}
//         </motion.div>

//         {/* دکمه بزرگ و فوق‌العاده کاربرپسند */}
//         <motion.div
//           initial={{ opacity: 0, scale: 0.8 }}
//           animate={{ opacity: 1, scale: 1 }}
//           transition={{ delay: 2, duration: 0.8 }}
//           className="mb-20"
//         >
//           <button
//             onClick={scrollToMenu}
//             className="group relative px-16 py-8 bg-gradient-to-r from-amber-600 to-orange-600 text-white font-bold text-2xl sm:text-3xl rounded-full shadow-2xl hover:shadow-amber-600/50 transform hover:scale-110 active:scale-95 transition-all duration-300 overflow-hidden"
//           >
//             <span className="relative z-10 flex items-center gap-4">
//               منوی امروز رو ببینید
//               <motion.span
//                 animate={{ y: [0, 5, 0] }}
//                 transition={{ duration: 1.5, repeat: Infinity }}
//               >
//                 <ChevronDown className="w-10 h-10" />
//               </motion.span>
//             </span>
            
//             {/* افکت درخشش */}
//             <motion.div
//               className="absolute inset-0 bg-white opacity-0 group-hover:opacity-30"
//               animate={{ x: [-100, 100] }}
//               transition={{ duration: 1.5, repeat: Infinity }}
//             />
//           </button>
//         </motion.div>

//         {/* فلش پایین – خیلی واضح و کاربرپسند */}
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ delay: 2.5 }}
//           className="absolute bottom-10 left-1/2 -translate-x-1/2"
//         >
//           <motion.div
//             animate={{ y: [0, 20, 0] }}
//             transition={{ duration: 2, repeat: Infinity }}
//             className="text-amber-700"
//           >
//             <ChevronDown className="w-12 h-12" />
//           </motion.div>
//         </motion.div>
//       </div>
//     </section>
//   );
// }