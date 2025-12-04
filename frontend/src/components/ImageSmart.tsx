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
    if (!url || url.trim() === "") return "";

    // اگر لوکال، دیتا URL یا آپلود شده باشه
    if (
      url.startsWith("data:") ||
      url.startsWith("/public") ||
      url.startsWith("/images") ||
      url.startsWith("/uploads") ||
      url.startsWith("blob:") ||
      url.startsWith("http://localhost") ||
      url.startsWith("https://your-production-domain.com")
    ) {
      if (url.startsWith("/uploads")) {
        return `http://localhost:3001${url}`;
      }
      return url;
    }

    // پراکسی برای Unsplash و بقیه
    const encoded = encodeURIComponent(url);
    return `${PROXY_URL}${encoded}&w=1200&h=900&fit=cover&output=webp&q=${quality}&af&il`;
  };

  useEffect(() => {
    // We only perform state updates if the source changes or is null
    if (!src) {
      setImageSrc("");
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
      finalSrc = "";
    }

    // eslint-disable-next-line
    if (!finalSrc) {
      setImageSrc("");
      setLoading(false);
      setError(true);
      return;
    }
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
        relative overflow-hidden
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
        <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-100">
          {fallbackIcon === "coffee" && <Coffee className="w-12 h-12 mb-2" />}
          {fallbackIcon === "image-off" && (
            <ImageOff className="w-12 h-12 mb-2" />
          )}
          <span className="text-xs text-center">تصویر در دسترس نیست</span>
        </div>
      )}

      {/* تصویر اصلی */}
      {imageSrc && !error && (
        <Image
          src={imageSrc}
          alt={alt}
          width={width}
          height={height}
          fill={fill}
          priority={priority}
          quality={quality}
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
          placeholder={blurDataURL ? "blur" : placeholder || "empty"}
          blurDataURL={
            blurDataURL ||
            "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA50e6kgAAAABJRU5ErkJggg=="
          }
          className={`
            transition-all duration-500
            ${loading ? "opacity-0" : "opacity-100"}
            ${objectFitClasses[objectFit]}
            ${className}
          `}
          unoptimized
          onLoadingComplete={() => {
            setLoading(false);
            onLoad?.();
          }}
          onError={() => {
            setError(true);
            setLoading(false);
            onError?.();
          }}
        />
      )}
    </div>
  );
}
