// این فایل سرویس API سمت فرانت‌اند را تعریف می‌کند.
// وظیفه آن مدیریت تمام فراخوانی‌های HTTP به بک‌اند (http://localhost:3001/api) است.

// آدرس پایه API بک‌اند
// const API_BASE_URL = "http://localhost:3001/api";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// -----------------------------------------------------------------------------
// تعریف تایپ‌های داده (برای سازگاری با پاسخ‌های بک‌اند)
// -----------------------------------------------------------------------------

export interface Category {
  id: string;
  name: string;
  description: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  items?: Item[];
}

export interface Item {
  id: string;
  name: string;
  description: string | null;
  price: number;
  isWeighted?: boolean;
  pricingBaseGrams?: number | null;
  imageUrl: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  categoryId: string;
  category?: Category;
}

export interface Order {
  id: string;
  tableId: string;
  tableNumber: number;
  totalPrice: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  items?: OrderItem[];
  table?: Table;
}

export interface OrderItem {
  id: string;
  orderId: string;
  itemId: string;
  quantity: number;
  price: number;
  item?: Item;
}

export interface Table {
  id: string;
  number: number;
  capacity: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  details?: T[];
}

// ساختار ورودی کش برای نگهداری داده به همراه زمان ایجاد و زمان انقضا
interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

/**
 * کلاس ApiService
 * شامل متدهای مختلف برای تعامل با نقاط پایانی (Endpoints) بک‌اند.
 */
class ApiService {
  // کش درون‌حافظه‌ای برای انواع داده‌ها (فقط در عمر فعلی تب/صفحه معتبر است)
  private cache = new Map<string, CacheEntry<unknown>>();

  // کلیدهای ثابت برای انواع داده‌های اصلی
  private readonly CACHE_KEYS = {
    CATEGORIES: "categories",
    ITEMS: "items",
  } as const;

  // زمان انقضای پیش‌فرض کش: ۵ دقیقه
  private readonly DEFAULT_TTL = 5 * 60 * 1000;

  /**
   * خواندن از کش با درنظرگرفتن زمان انقضا
   */
  private getCache<T>(key: string): T | null {
    const entry = this.cache.get(key) as CacheEntry<T> | undefined;
    if (!entry) return null;

    const isExpired = Date.now() - entry.timestamp > entry.ttl;
    if (isExpired) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  /**
   * ذخیره در کش با TTL مشخص (یا TTL پیش‌فرض)
   */
  private setCache<T>(
    key: string,
    data: T,
    ttl: number = this.DEFAULT_TTL
  ): void {
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      ttl,
    };
    this.cache.set(key, entry);
  }

  /**
   * حذف یک کلید کش
   */
  private invalidateCache(key: string): void {
    this.cache.delete(key);
  }

  /**
   * حذف چند کلید کش مرتبط (مثلاً بعد از CRUD)
   */
  private invalidateCaches(keys: string[]): void {
    for (const key of keys) {
      this.cache.delete(key);
    }
  }

  /**
   * تابع کمکی برای ارسال درخواست‌های HTTP
   * @param endpoint - مسیر API (مانند /categories)
   * @param options - تنظیمات درخواست (مانند method, body, headers)
   * @returns پاسخ استاندارد API
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    // بازیابی توکن مدیر از localStorage (اگر وجود داشته باشد)
    const token =
      typeof window !== "undefined" ? localStorage.getItem("adminToken") : null;

    const headers: Record<string, string> = {
      ...((options.headers as Record<string, string>) || {}),
    };

    // افزودن هدر Authorization برای مسیرهای محافظت شده
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401 && typeof window !== "undefined") {
          localStorage.removeItem("adminToken");
          localStorage.removeItem("adminData");
          if (window.location.pathname.startsWith("/admin")) {
            window.location.href = "/admin/login";
          }
        }

        return {
          success: false,
          error: data.error || response.statusText,
          details: data.details,
        } as ApiResponse<T>;
      }

      return data;
    } catch (error) {
      console.error("API request failed:", error);
      // مدیریت خطاهای شبکه
      return {
        success: false,
        error: "Network or server connection error",
      } as ApiResponse<T>;
    }
  }

  // -----------------------------------------------------------------------------
  // متدهای مربوط به دسته‌بندی‌ها (Categories)
  // -----------------------------------------------------------------------------

  async getCategories(): Promise<ApiResponse<Category[]>> {
    // ابتدا تلاش برای خواندن از کش
    const cached = this.getCache<Category[]>(this.CACHE_KEYS.CATEGORIES);
    if (cached) {
      return { success: true, data: cached };
    }

    // در صورت نبودن یا منقضی شدن کش، درخواست به سرور
    const response = await this.request<Category[]>("/categories");
    if (response.success && response.data) {
      this.setCache(this.CACHE_KEYS.CATEGORIES, response.data);
    }
    return response;
  }

  async getCategory(id: string): Promise<ApiResponse<Category>> {
    return this.request<Category>(`/categories/${id}`);
  }

  async createCategory(data: {
    name: string;
    description?: string;
  }): Promise<ApiResponse<Category>> {
    const response = await this.request<Category>("/categories", {
      method: "POST",
      body: JSON.stringify(data),
    });
    // بعد از ایجاد، کش دسته‌بندی‌ها را اینولید می‌کنیم تا دفعه بعد داده جدید خوانده شود
    if (response.success) {
      this.invalidateCache(this.CACHE_KEYS.CATEGORIES);
    }
    return response;
  }

  async updateCategory(
    id: string,
    data: { name?: string; description?: string; isActive?: boolean }
  ): Promise<ApiResponse<Category>> {
    const response = await this.request<Category>(`/categories/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
    if (response.success) {
      this.invalidateCache(this.CACHE_KEYS.CATEGORIES);
    }
    return response;
  }

  async deleteCategory(id: string): Promise<ApiResponse<void>> {
    const response = await this.request<void>(`/categories/${id}`, {
      method: "DELETE",
    });
    if (response.success) {
      this.invalidateCache(this.CACHE_KEYS.CATEGORIES);
    }
    return response;
  }

  // -----------------------------------------------------------------------------
  // متدهای مربوط به آیتم‌ها (Items)
  // -----------------------------------------------------------------------------

  async getItems(): Promise<ApiResponse<Item[]>> {
    const cached = this.getCache<Item[]>(this.CACHE_KEYS.ITEMS);
    if (cached) {
      return { success: true, data: cached };
    }

    const response = await this.request<Item[]>("/items");
    if (response.success && response.data) {
      this.setCache(this.CACHE_KEYS.ITEMS, response.data);
    }
    return response;
  }

  async getItem(id: string): Promise<ApiResponse<Item>> {
    return this.request<Item>(`/items/${id}`);
  }

  async createItem(data: {
    name: string;
    description?: string;
    price: number;
    isWeighted?: boolean;
    pricingBaseGrams?: number;
    imageUrl?: string;
    categoryId: string;
  }): Promise<ApiResponse<Item>> {
    const response = await this.request<Item>("/items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (response.success) {
      this.invalidateCache(this.CACHE_KEYS.ITEMS);
    }
    return response;
  }

  async updateItem(
    id: string,
    data: {
      name?: string;
      description?: string;
      price?: number;
      isWeighted?: boolean;
      pricingBaseGrams?: number;
      imageUrl?: string;
      categoryId?: string;
      isActive?: boolean;
    }
  ): Promise<ApiResponse<Item>> {
    const response = await this.request<Item>(`/items/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (response.success) {
      this.invalidateCache(this.CACHE_KEYS.ITEMS);
    }
    return response;
  }

  async deleteItem(id: string): Promise<ApiResponse<void>> {
    const response = await this.request<void>(`/items/${id}`, {
      method: "DELETE",
    });
    if (response.success) {
      this.invalidateCache(this.CACHE_KEYS.ITEMS);
    }
    return response;
  }

  // -----------------------------------------------------------------------------
  // متدهای مربوط به سفارشات (Orders)
  // -----------------------------------------------------------------------------

  async getOrders(params?: {
    status?: string;
    tableNumber?: number;
  }): Promise<ApiResponse<Order[]>> {
    const queryParams = new URLSearchParams();
    if (params?.status) queryParams.append("status", params.status);
    if (params?.tableNumber)
      queryParams.append("tableNumber", params.tableNumber.toString());

    return this.request<Order[]>(`/orders?${queryParams.toString()}`);
  }

  async getOrder(id: string): Promise<ApiResponse<Order>> {
    return this.request<Order>(`/orders/${id}`);
  }

  async createOrder(data: {
    tableId: string;
    items: { itemId: string; quantity: number }[];
  }): Promise<ApiResponse<Order>> {
    return this.request<Order>("/orders", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateOrderStatus(
    id: string,
    status: string
  ): Promise<ApiResponse<Order>> {
    return this.request<Order>(`/orders/${id}/status`, {
      method: "PATCH", // استفاده از PATCH برای به‌روزرسانی جزئی
      body: JSON.stringify({ status }),
    });
  }

  // -----------------------------------------------------------------------------
  // متدهای مربوط به میزها (Tables)
  // -----------------------------------------------------------------------------

  async getTables(): Promise<ApiResponse<Table[]>> {
    return this.request<Table[]>("/tables");
  }

  async getTable(id: string): Promise<ApiResponse<Table>> {
    return this.request<Table>(`/tables/${id}`);
  }

  // -----------------------------------------------------------------------------
  // متدهای مربوط به احراز هویت (Auth)
  // -----------------------------------------------------------------------------

  async login(
    email: string,
    password: string
  ): Promise<
    ApiResponse<{ token: string; admin: { id: string; email: string } }>
  > {
    return this.request<{
      token: string;
      admin: { id: string; email: string };
    }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  }

  async uploadItemImage(file: File): Promise<ApiResponse<{ url: string }>> {
    const form = new FormData();
    form.append("file", file);
    return this.request<{ url: string }>(`/items/upload`, {
      method: "POST",
      body: form,
    });
  }
}

// ایجاد یک نمونه از سرویس API برای استفاده در سراسر فرانت‌اند
export const api = new ApiService();
