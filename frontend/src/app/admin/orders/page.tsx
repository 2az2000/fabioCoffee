"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ShoppingCart } from "lucide-react";
import { api, Order } from "@/lib/api";

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.getOrders();
        if (res.success && res.data) {
          setOrders(res.data);
        }
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <ShoppingCart className="w-12 h-12 text-amber-600 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-600">در حال بارگذاری سفارشها...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">مدیریت سفارشها</h1>
        <div className="text-sm text-gray-600">تعداد سفارش: {orders.length}</div>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-12">
          <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">سفارشی ثبت نشده است.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="min-w-full divide-y divide-gray-100">
            <div className="grid grid-cols-5 gap-4 px-6 py-3 bg-gray-50 text-xs font-medium text-gray-500">
              <span>کد سفارش</span>
              <span>میز</span>
              <span>وضعیت</span>
              <span>مبلغ کل</span>
              <span>تاریخ</span>
            </div>
            {orders.map((order, index) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
                className="grid grid-cols-5 gap-4 px-6 py-3 text-sm items-center"
              >
                <span className="font-mono text-xs text-gray-800">
                  #{order.id.substring(0, 8)}
                </span>
                <span className="text-gray-800">میز {order.tableNumber}</span>
                <span className="text-gray-700">{order.status}</span>
                <span className="text-gray-900 font-semibold">
                  {order.totalPrice.toLocaleString("fa-IR")} تومان
                </span>
                <span className="text-xs text-gray-500">
                  {new Date(order.createdAt).toLocaleString("fa-IR")}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

