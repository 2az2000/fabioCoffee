// components/SmartImage.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { ImageOff, Coffee } from "lucide-react";

interface SmartImageProps {
  src?: string | File | null;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  className?: string;
  containerClassName?: string;
  priority?: boolean;
  quality?: number;
  placeholder?: "blur" | "empty";
  blurDataURL?: string;
  rounded?: "none" | "sm" | "md" | "lg" | "xl" | "full";
  objectFit?: "cover" | "contain" | "fill";
  fallbackIcon?: "coffee" | "image-off" | "none";
  loadingShimmer?: boolean;
  onLoad?: () => void;
  onError?: () => void;
}

const PROXY_URL = "https://images.weserv.nl/?url=";
const FALLBACK_IMAGE = `
<svg width="100%" height="100%" viewBox="0 0 240 240" xmlns="http://www.w3.org/2000/svg" fill="none">
  <defs>
    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#DEB999"/>
      <stop offset="100%" stop-color="#BA9E74"/>
    </linearGradient>
  </defs>

  <rect width="240" height="240" fill="url(#gradient)" opacity="0.3"/>

  <!-- فنجان قهوه مینیمال -->
  <path d="M120 20C86.86 20 60 46.86 60 80v80c0 33.14 26.86 60 60 60h80c33.14 0 60-26.86 60-60V80c0-33.14-26.86-60-60-60H120z" 
        fill="#7B684E"/>
  
  <!-- بخار قهوه -->
  <path d="M80 160c-11.05 0-20 8.95-20 20s8.95 20 20 20h160c11.05 0 20-8.95 20-20s-8.95-20-20-20H80z" fill="#FFFFFF"/>
  <path d="M120 120c-11.05 0-20 8.95-20 20s8.95 20 20 20h160c11.05 0 20-8.95 20-20s-8.95-20-20-20H120z" fill="#FFFFFF"/>
  <path d="M120 80c-11.05 0-20 8.95-20 20s8.95 20 20 20h160c11.05 0 20-8.95 20-20s-8.95-20-20-20H120z" fill="#FFFFFF"/>

  <!-- دایره دور فنجان -->
  <circle cx="120" cy="120" r="60" fill="none" stroke="#FFFFFF" stroke-width="8"/>
  <path d="M120 160c-33.14 0-60-26.86-60-60v48c0 33.14 26.86 60 60 60h80c33.14 0 60-26.86 60-60V80c0-33.14-26.86-60-60-60" 
        stroke="#FFFFFF" stroke-width="4" fill="none"/>
</svg>
`.trim();
export default function SmartImage({
  src,
  alt,
  width,
  height,
  fill = false,
  className = "",
  containerClassName = "",
  priority = false,
  quality = 85,
  placeholder = "empty",
  blurDataURL,
  rounded = "lg",
  objectFit = "cover",
  fallbackIcon = "coffee",
  loadingShimmer = true,
  onLoad,
  onError,
}: SmartImageProps) {
  const [imageSrc, setImageSrc] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const objectUrlRef = useRef<string | null>(null);

  // تابع پراکسی + بهینه‌سازی برای ایران
  const getOptimizedUrl = (url: string): string => {
    if (!url || url.trim() === "") return FALLBACK_IMAGE;

    // اگر لوکال، دیتا URL یا آپلود شده باشه
    if (
      url.startsWith("data:") ||
      url.startsWith("/public") ||
      url.startsWith("/images") ||
      url.startsWith("blob:") ||
      url.startsWith("http://localhost") ||
      url.startsWith("https://your-production-domain.com")
    ) {
      return url;
    }

    // پراکسی برای Unsplash و بقیه
    const encoded = encodeURIComponent(url);
    return `${PROXY_URL}${encoded}&w=1200&h=900&fit=cover&output=webp&q=${quality}&af&il`;
  };

  useEffect(() => {
    // We only perform state updates if the source changes or is null
    if (!src) {
      // eslint-disable-next-line
      setImageSrc(FALLBACK_IMAGE);
      setLoading(false);
      setError(true);
      return;
    }

    let finalSrc = "";

    if (typeof src === "string") {
      finalSrc = getOptimizedUrl(src);
    } else if (src instanceof File) {
      // اگر فایل آپلود شده
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
      }
      const url = URL.createObjectURL(src);
      objectUrlRef.current = url;
      finalSrc = url;
    } else {
      finalSrc = FALLBACK_IMAGE;
    }

    // eslint-disable-next-line
    setImageSrc(finalSrc);
    setLoading(true);
    setError(false);
  }, [src]);

  // تمیز کردن حافظه
  useEffect(() => {
    return () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
      }
    };
  }, []);

  const roundedClasses = {
    none: "",
    sm: "rounded-sm",
    md: "rounded-md",
    lg: "rounded-lg",
    xl: "rounded-xl",
    full: "rounded-full",
  };

  const objectFitClasses = {
    cover: "object-cover",
    contain: "object-contain",
    fill: "object-fill",
  };

  return (
    <div
      className={`
        relative overflow-hidden bg-gray-100
        ${fill ? "w-full h-full" : ""}
        ${roundedClasses[rounded]}
        ${containerClassName}
      `}
    >
      {/* شیمر لودینگ */}
      {loading && loadingShimmer && (
        <div className="absolute inset-0 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 animate-pulse" />
      )}

      {/* آیکون لودینگ مرکزی */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            className="w-8 h-8 border-4 border-amber-200 border-t-amber-600 rounded-full"
          />
        </div>
      )}

      {/* خطا یا fallback */}
      {error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 text-gray-400">
          {fallbackIcon === "coffee" && <Coffee className="w-12 h-12 mb-2" />}
          {fallbackIcon === "image-off" && <ImageOff className="w-12 h-12 mb-2" />}
          <span className="text-xs text-center">تصویر در دسترس نیست</span>
        </div>
      )}

      {/* تصویر اصلی */}
      <Image
        src={imageSrc || FALLBACK_IMAGE}
        alt={error ? "" : alt}
        width={width}
        height={height}
        fill={fill}
        priority={priority}
        quality={quality}
        placeholder={blurDataURL ? "blur" : (placeholder || "empty")}
        blurDataURL={blurDataURL || "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA50e6kgAAAABJRU5ErkJggg=="}
        className={`
          transition-all duration-500
          ${loading ? "opacity-0" : "opacity-100"}
          ${error ? "opacity-0" : ""}
          ${objectFitClasses[objectFit]}
          ${className}
        `}
        onLoadingComplete={() => {
          setLoading(false);
          onLoad?.();
        }}
        onError={(e) => {
          setError(true);
          setLoading(false);
          // تلاش دوباره با fallback
          if (imageSrc !== FALLBACK_IMAGE) {
            setImageSrc(FALLBACK_IMAGE);
          }
          onError?.();
        }}
      />
    </div>
  );
}