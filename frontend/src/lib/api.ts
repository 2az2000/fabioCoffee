// این فایل سرویس API سمت فرانت‌اند را تعریف می‌کند.
// وظیفه آن مدیریت تمام فراخوانی‌های HTTP به بک‌اند (http://localhost:3001/api) است.

// آدرس پایه API بک‌اند
const API_BASE_URL = 'http://localhost:3001/api';

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

// این فایل سرویس API سمت فرانت‌اند را تعریف می‌کند.
// وظیفه آن مدیریت تمام فراخوانی‌های HTTP به بک‌اند (http://localhost:3001/api) است.

// آدرس پایه API بک‌اند
// const API_BASE_URL = 'http://localhost:3001/api';

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

// ساختار استاندارد پاسخ API
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  details?: T[];
}

/**
 * کلاس ApiService
 * شامل متدهای مختلف برای تعامل با نقاط پایانی (Endpoints) بک‌اند.
 */
class ApiService {
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
    const token = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null;
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string> || {}),
    };

    // افزودن هدر Authorization برای مسیرهای محافظت شده
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        // در صورت خطای HTTP (مانند 401, 404, 500)
        // اگرچه خطا در اینجا throw می‌شود، اما ساختار ApiResponse را حفظ می‌کنیم تا مدیریت خطا در کامپوننت‌ها ساده‌تر باشد.
        return {
          success: false,
          error: data.error || response.statusText,
          details: data.details
        } as ApiResponse<T>;
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      // مدیریت خطاهای شبکه
      return {
        success: false,
        error: 'Network or server connection error'
      } as ApiResponse<T>;
    }
  }

  // -----------------------------------------------------------------------------
  // متدهای مربوط به دسته‌بندی‌ها (Categories)
  // -----------------------------------------------------------------------------

  async getCategories(): Promise<ApiResponse<Category[]>> {
    return this.request<Category[]>('/categories');
  }

  async getCategory(id: string): Promise<ApiResponse<Category>> {
    return this.request<Category>(`/categories/${id}`);
  }

  async createCategory(data: { name: string; description?: string }): Promise<ApiResponse<Category>> {
    return this.request<Category>('/categories', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateCategory(id: string, data: { name?: string; description?: string; isActive?: boolean }): Promise<ApiResponse<Category>> {
    return this.request<Category>(`/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteCategory(id: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/categories/${id}`, {
      method: 'DELETE',
    });
  }

  // -----------------------------------------------------------------------------
  // متدهای مربوط به آیتم‌ها (Items)
  // -----------------------------------------------------------------------------

  async getItems(): Promise<ApiResponse<Item[]>> {
    return this.request<Item[]>('/items');
  }

  async getItem(id: string): Promise<ApiResponse<Item>> {
    return this.request<Item>(`/items/${id}`);
  }

  async createItem(data: {
    name: string;
    description?: string;
    price: number;
    imageUrl?: string;
    categoryId: string;
  }): Promise<ApiResponse<Item>> {
    return this.request<Item>('/items', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateItem(id: string, data: {
    name?: string;
    description?: string;
    price?: number;
    imageUrl?: string;
    categoryId?: string;
    isActive?: boolean;
  }): Promise<ApiResponse<Item>> {
    return this.request<Item>(`/items/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteItem(id: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/items/${id}`, {
      method: 'DELETE',
    });
  }

  // -----------------------------------------------------------------------------
  // متدهای مربوط به سفارشات (Orders)
  // -----------------------------------------------------------------------------

  async getOrders(params?: { status?: string; tableNumber?: number }): Promise<ApiResponse<Order[]>> {
    const queryParams = new URLSearchParams();
    if (params?.status) queryParams.append('status', params.status);
    if (params?.tableNumber) queryParams.append('tableNumber', params.tableNumber.toString());
    
    return this.request<Order[]>(`/orders?${queryParams.toString()}`);
  }

  async getOrder(id: string): Promise<ApiResponse<Order>> {
    return this.request<Order>(`/orders/${id}`);
  }

  async createOrder(data: {
    tableId: string;
    items: { itemId: string; quantity: number }[];
  }): Promise<ApiResponse<Order>> {
    return this.request<Order>('/orders', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateOrderStatus(id: string, status: string): Promise<ApiResponse<Order>> {
    return this.request<Order>(`/orders/${id}/status`, {
      method: 'PATCH', // استفاده از PATCH برای به‌روزرسانی جزئی
      body: JSON.stringify({ status }),
    });
  }

  // -----------------------------------------------------------------------------
  // متدهای مربوط به میزها (Tables)
  // -----------------------------------------------------------------------------

  async getTables(): Promise<ApiResponse<Table[]>> {
    return this.request<Table[]>('/tables');
  }

  async getTable(id: string): Promise<ApiResponse<Table>> {
    return this.request<Table>(`/tables/${id}`);
  }

  // -----------------------------------------------------------------------------
  // متدهای مربوط به احراز هویت (Auth)
  // -----------------------------------------------------------------------------

  async login(email: string, password: string): Promise<ApiResponse<{ token: string; admin: { id: string; email: string } }>> {
    return this.request<{ token: string; admin: { id: string; email: string } }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }
}

// ایجاد یک نمونه از سرویس API برای استفاده در سراسر فرانت‌اند
export const api = new ApiService();