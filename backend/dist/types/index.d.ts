export interface Category {
    id: string;
    name: string;
    description: string | null;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    items?: Item[];
}
export interface Item {
    id: string;
    name: string;
    description: string | null;
    price: number | any;
    imageUrl: string | null;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    categoryId: string;
    category?: Category;
}
export interface Admin {
    id: string;
    email: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
}
import { Request } from 'express';
export interface AuthRequest extends Request {
    admin?: {
        id: string;
        email: string;
    };
}
export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
    details?: any[];
}
export interface LoginRequest {
    email: string;
    password: string;
}
export interface LoginResponse {
    token: string;
    admin: {
        id: string;
        email: string;
    };
}
export interface Order {
    id: string;
    tableId: string;
    tableNumber: number;
    totalPrice: number | any;
    status: string;
    createdAt: Date;
    updatedAt: Date;
    items?: OrderItem[];
    table?: Table;
}
export interface OrderItem {
    id: string;
    orderId: string;
    itemId: string;
    quantity: number;
    price: number | any;
    item?: Item;
}
export interface Table {
    id: string;
    number: number;
    capacity: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
//# sourceMappingURL=index.d.ts.map