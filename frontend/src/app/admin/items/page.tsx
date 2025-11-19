"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Coffee,
  Package,
  Edit2,
  Trash2,
  Save,
  X,
  Plus,
  AlertTriangle,
  Filter,
} from "lucide-react";
import { api, Item, Category } from "@/lib/api";
import SmartImage from "@/components/ImageSmart";

export default function ItemsPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [categories, setCategories] = useState<Record<string, Category>>({});
  const [categoriesList, setCategoriesList] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("all");
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [editForm, setEditForm] = useState({
    name: "",
    description: "",
    price: "",
    categoryId: "",
    imageUrl: "",
    isActive: true,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState({
    name: "",
    description: "",
    price: "",
    categoryId: "",
    imageUrl: "",
    isActive: true,
  });

  useEffect(() => {
    const load = async () => {
      try {
        const [itemsRes, categoriesRes] = await Promise.all([
          api.getItems(),
          api.getCategories(),
        ]);

        if (itemsRes.success && itemsRes.data) {
          setItems(itemsRes.data);
        }

        if (categoriesRes.success && categoriesRes.data) {
          const map: Record<string, Category> = {};
          for (const cat of categoriesRes.data) {
            map[cat.id] = cat;
          }
          setCategories(map);
          setCategoriesList(categoriesRes.data);
        }
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, []);

  // Filter items by selected category (show both active and inactive for admin)
  const filteredItems =
    selectedCategoryId === "all"
      ? items
      : items.filter((item) => item.categoryId === selectedCategoryId);

  // Open edit modal
  const handleEdit = (item: Item) => {
    setEditingItem(item);
    setEditForm({
      name: item.name,
      description: item.description || "",
      price: item.price.toString(),
      categoryId: item.categoryId,
      imageUrl: item.imageUrl || "",
      isActive: item.isActive,
    });
  };

  // Close edit modal
  const handleCloseModal = () => {
    setEditingItem(null);
    setEditForm({
      name: "",
      description: "",
      price: "",
      categoryId: "",
      imageUrl: "",
      isActive: true,
    });
  };

  // Save edited item
  const handleSave = async () => {
    if (!editingItem) return;

    setIsSaving(true);
    try {
      const res = await api.updateItem(editingItem.id, {
        ...editForm,
        price: parseFloat(editForm.price),
      });
      if (res.success && res.data) {
        setItems((prev) =>
          prev.map((item) => (item.id === editingItem.id ? res.data! : item))
        );
        handleCloseModal();
      }
    } finally {
      setIsSaving(false);
    }
  };

  // Delete item
  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      const res = await api.deleteItem(id);
      if (res.success) {
        setItems((prev) => prev.filter((item) => item.id !== id));
        setShowDeleteModal(null);
      }
    } finally {
      setDeletingId(null);
    }
  };

  // Add new item
  const handleAdd = async () => {
    if (!addForm.name.trim() || !addForm.price) return;

    setIsSaving(true);
    try {
      const res = await api.createItem({
        ...addForm,
        price: parseFloat(addForm.price),
      });
      if (res.success && res.data) {
        setItems((prev) => [res.data!, ...prev]);
        setShowAddModal(false);
        setAddForm({
          name: "",
          description: "",
          price: "",
          categoryId: "",
          imageUrl: "",
          isActive: true,
        });
      }
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Coffee className="w-12 h-12 text-amber-600 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-600">در حال بارگذاری آیتم ها...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">مدیریت آیتم‌ها</h1>
          <p className="text-gray-600 text-sm mt-1">
            مشاهده و مدیریت آیتم‌های ثبت‌شده
          </p>
        </div>
        <div className="flex items-center gap-3">
          {!isLoading && (
            <div className="text-sm bg-gray-100 px-4 py-2 rounded-lg text-gray-700">
              تعداد آیتم:{" "}
              <span className="font-semibold">{filteredItems.length}</span>
            </div>
          )}
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>افزودن آیتم</span>
          </button>
        </div>
      </div>

      {/* Category Filter */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">
            فیلتر بر اساس دسته‌بندی
          </h3>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategoryId("all")}
            className={`px-4 py-2 rounded-lg transition-colors ${
              selectedCategoryId === "all"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            همه دسته‌بندی‌ها
          </button>
          {categoriesList.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategoryId(category.id)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                selectedCategoryId === category.id
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredItems.map((item, index) => {
          const category = categories[item.categoryId];
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="group bg-white rounded-2xl shadow-sm hover:shadow-xl border border-gray-100 overflow-hidden transition-all duration-300 hover:-translate-y-1"
            >
              {/* Card Header */}
              <div className="relative h-32 bg-gradient-to-br from-amber-50 to-orange-50">
                <div className="absolute top-3 right-3 z-5">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      item.isActive ? "bg-green-500" : "bg-red-500"
                    } animate-pulse`}
                  />
                </div>
                <div className="flex items-center justify-center h-full">
                  {/* <div className="w-16 h-16 rounded-2xl bg-white shadow-lg flex items-center justify-center"> */}
                    {/* <Coffee className="w-8 h-8 text-amber-600" /> */}
                     <SmartImage
                            src={item.imageUrl}
                            alt={item.name}
                            fill
                            rounded="none"
                            objectFit="cover"
                            fallbackIcon="coffee"
                            loadingShimmer={true}
                            className={`transition-transform duration-300 ${
                              !item.isActive ? "" : "group-hover:scale-105"
                            }`}
                          />
                  {/* </div> */}
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {item.name}
                  </h3>
                  {category && (
                    <div className="flex items-center gap-1 mt-1">
                      <div className="w-2 h-2 rounded-full bg-gray-300" />
                      <p className="text-sm text-gray-500">{category.name}</p>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-xl font-bold text-gray-900">
                    {item.price.toLocaleString("fa-IR")}
                    <span className="text-sm font-normal text-gray-500 mr-1">
                      تومان
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    {item.imageUrl && (
                      <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                        <Package className="w-4 h-4 text-gray-600" />
                      </div>
                    )}
                  </div>
                </div>

                {item.description && (
                  <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                )}

                {/* Action Buttons */}
                <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                  <button
                    onClick={() => handleEdit(item)}
                    className="flex-1 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors flex items-center justify-center gap-2 text-sm font-medium"
                  >
                    <Edit2 className="w-4 h-4" />
                    ویرایش
                  </button>
                  <button
                    onClick={() => setShowDeleteModal(item.id)}
                    disabled={deletingId === item.id}
                    className="px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    title="حذف آیتم"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <Coffee className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">
            {selectedCategoryId === "all"
              ? "هیچ آیتمی ثبت نشده است."
              : "هیچ آیتمی در این دسته‌بندی وجود ندارد."}
          </p>
          <p className="text-gray-500 text-sm">
            {selectedCategoryId === "all"
              ? "پس از افزودن آیتم‌ها در بک‌اند، اینجا نمایش داده می‌شوند."
              : "دسته‌بندی دیگری را انتخاب کنید یا آیتم جدیدی اضافه کنید."}
          </p>
        </div>
      )}

      {/* Edit Modal */}
      {editingItem && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="
        bg-white w-full max-w-lg rounded-2xl shadow-xl
        flex flex-col max-h-[90vh]
      "
          >
            {/* Header */}
            <div className="p-5 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    ویرایش آیتم
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    اطلاعات آیتم را به‌روزرسانی کنید
                  </p>
                </div>

                <button
                  onClick={handleCloseModal}
                  className="p-2 rounded-lg hover:bg-gray-200 text-gray-500 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Body - Scrollable */}
            <div className="p-6 space-y-5 overflow-y-auto">
              {/* Name */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  نام آیتم *
                </label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) =>
                    setEditForm((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="نام آیتم را وارد کنید"
                  className="
              w-full px-3 py-2 rounded-lg border border-gray-300 
              focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition
            "
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  توضیحات
                </label>
                <textarea
                  value={editForm.description}
                  onChange={(e) =>
                    setEditForm((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  rows={3}
                  placeholder="توضیحات آیتم را وارد کنید"
                  className="
              w-full px-3 py-2 rounded-lg border border-gray-300 
              focus:ring-2 focus:ring-blue-500 transition resize-none
            "
                />
              </div>

              {/* Price */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  قیمت (تومان) *
                </label>
                <input
                  type="number"
                  value={editForm.price}
                  onChange={(e) =>
                    setEditForm((prev) => ({ ...prev, price: e.target.value }))
                  }
                  placeholder="مثلاً 85000"
                  className="
              w-full px-3 py-2 rounded-lg border border-gray-300 
              focus:ring-2 focus:ring-blue-500 transition
            "
                />
              </div>

              {/* Category */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  دسته‌بندی *
                </label>
                <select
                  value={editForm.categoryId}
                  onChange={(e) =>
                    setEditForm((prev) => ({
                      ...prev,
                      categoryId: e.target.value,
                    }))
                  }
                  className="
              w-full px-3 py-2 rounded-lg border border-gray-300
              focus:ring-2 focus:ring-blue-500 transition
            "
                >
                  <option value="">انتخاب دسته‌بندی</option>
                  {categoriesList.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Image URL */}
              {/* Image Upload */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  تصویر آیتم
                </label>

                <div className="flex items-center gap-4">
                  {/* Preview */}
                  {editForm.imageUrl ? (
                    <img
                      src={editForm.imageUrl}
                      alt="preview"
                      className="w-20 h-20 object-cover rounded-lg border"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-lg bg-gray-100 border flex items-center justify-center text-gray-400 text-sm">
                      بدون تصویر
                    </div>
                  )}

                  {/* Upload Button */}
                  <label
                    className="
        px-3 py-2 bg-blue-50 text-blue-600 border border-blue-200
        rounded-lg cursor-pointer hover:bg-blue-100 transition
      "
                  >
                    انتخاب فایل
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const files = e.target.files;
                        if (!files || files.length === 0) return;

                        const file = files[0];
                        const url = URL.createObjectURL(file);

                        setEditForm((prev) => ({
                          ...prev,
                          imageUrl: url,
                          file,
                        }));
                      }}
                    />
                  </label>
                </div>

                {/* OR Enter URL */}
                <input
                  type="text"
                  value={editForm.imageUrl}
                  onChange={(e) =>
                    setEditForm((prev) => ({
                      ...prev,
                      imageUrl: e.target.value,
                    }))
                  }
                  placeholder="آدرس تصویر (اختیاری)"
                  className="
      w-full px-3 py-2 rounded-lg border border-gray-300
      focus:ring-2 focus:ring-blue-500 transition
    "
                />
              </div>

              {/* Status */}
              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  id="isActiveEdit"
                  checked={editForm.isActive}
                  onChange={(e) =>
                    setEditForm((prev) => ({
                      ...prev,
                      isActive: e.target.checked,
                    }))
                  }
                  className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
                <label htmlFor="isActiveEdit" className="text-sm text-gray-700">
                  آیتم فعال باشد
                </label>
              </div>
            </div>

            {/* Footer */}
            <div className="p-5 border-t bg-gray-50 flex justify-end gap-3">
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition"
              >
                انصراف
              </button>

              <button
                onClick={handleSave}
                disabled={
                  isSaving ||
                  !editForm.name.trim() ||
                  !editForm.price ||
                  !editForm.categoryId
                }
                className="
            px-4 py-2 rounded-lg text-white bg-blue-600 
            hover:bg-blue-700 transition disabled:opacity-50
          "
              >
                {isSaving ? "در حال ذخیره..." : "ذخیره تغییرات"}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden"
          >
            <div className="p-6 text-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">حذف آیتم</h3>
              <p className="text-sm text-gray-600 mb-6">
                آیا از حذف این آیتم اطمینان دارید؟ این عملیات قابل بازگشت نیست.
              </p>
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={() => setShowDeleteModal(null)}
                  disabled={deletingId !== null}
                  className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
                >
                  انصراف
                </button>
                <button
                  onClick={() => handleDelete(showDeleteModal)}
                  disabled={deletingId !== null}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {deletingId ? (
                    <>
                      <div className="w-4 h-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      <span>در حال حذف...</span>
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4" />
                      <span>حذف</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Add Item Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="bg-white w-full max-w-lg rounded-2xl shadow-xl flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="p-5 border-b bg-gradient-to-r from-green-50 to-emerald-50">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    افزودن آیتم جدید
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    اطلاعات آیتم جدید را وارد کنید
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setAddForm({
                      name: "",
                      description: "",
                      price: "",
                      categoryId: "",
                      imageUrl: "",
                      file: null,
                      isActive: true,
                    });
                  }}
                  className="p-2 rounded-lg hover:bg-white/50 text-gray-500 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Body - Scrollable */}
            <div className="p-6 space-y-5 overflow-y-auto">
              {/* Name */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  نام آیتم *
                </label>
                <input
                  type="text"
                  value={addForm.name}
                  onChange={(e) =>
                    setAddForm((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="نام آیتم را وارد کنید"
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  توضیحات
                </label>
                <textarea
                  value={addForm.description || ""}
                  onChange={(e) =>
                    setAddForm((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  rows={3}
                  placeholder="توضیحات آیتم را وارد کنید"
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 transition resize-none"
                />
              </div>

              {/* Price */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  قیمت (تومان) *
                </label>
                <input
                  type="number"
                  value={addForm.price}
                  onChange={(e) =>
                    setAddForm((prev) => ({ ...prev, price: e.target.value }))
                  }
                  placeholder="مثلاً 85000"
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 transition"
                />
              </div>

              {/* Category */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  دسته‌بندی *
                </label>
                <select
                  value={addForm.categoryId}
                  onChange={(e) =>
                    setAddForm((prev) => ({
                      ...prev,
                      categoryId: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 transition"
                >
                  <option value="">انتخاب دسته‌بندی</option>
                  {categoriesList.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Image Upload + Preview */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-700">
                  تصویر آیتم
                </label>

                <div className="flex items-center gap-4">
                  {/* Preview */}
                  {addForm.imageUrl ? (
                    <img
                      src={addForm.imageUrl}
                      alt="پیش‌نمایش"
                      className="w-20 h-20 object-cover rounded-lg border shadow-sm"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-lg bg-gray-100 border-2 border-dashed flex items-center justify-center text-gray-400 text-xs">
                      بدون تصویر
                    </div>
                  )}

                  {/* Upload Button */}
                  <label className="px-4 py-2 bg-green-50 text-green-600 border border-green-200 rounded-lg cursor-pointer hover:bg-green-100 transition">
                    انتخاب فایل
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        const url = URL.createObjectURL(file);
                        setAddForm((prev) => ({
                          ...prev,
                          imageUrl: url,
                          file,
                        }));
                      }}
                    />
                  </label>
                </div>

                {/* OR Enter URL */}
                <input
                  type="text"
                  value={addForm.imageUrl}
                  onChange={(e) =>
                    setAddForm((prev) => ({
                      ...prev,
                      imageUrl: e.target.value,
                      file: null,
                    }))
                  }
                  placeholder="یا آدرس تصویر را وارد کنید (اختیاری)"
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 transition"
                />
              </div>

              {/* Status */}
              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  id="isActiveAdd"
                  checked={addForm.isActive}
                  onChange={(e) =>
                    setAddForm((prev) => ({
                      ...prev,
                      isActive: e.target.checked,
                    }))
                  }
                  className="w-4 h-4 text-green-600 rounded border-gray-300 focus:ring-green-500"
                />
                <label htmlFor="isActiveAdd" className="text-sm text-gray-700">
                  آیتم فعال باشد
                </label>
              </div>
            </div>

            {/* Footer */}
            <div className="p-5 border-t bg-gray-50 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setAddForm({
                    name: "",
                    description: "",
                    price: "",
                    categoryId: "",
                    imageUrl: "",
                    file: null,
                    isActive: true,
                  });
                }}
                disabled={isSaving}
                className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition disabled:opacity-50"
              >
                انصراف
              </button>

              <button
                onClick={handleAdd}
                disabled={
                  isSaving ||
                  !addForm.name.trim() ||
                  !addForm.price ||
                  !addForm.categoryId
                }
                className="px-4 py-2 rounded-lg text-white bg-green-600 hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSaving ? (
                  <>
                    <div className="w-4 h-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    <span>در حال ذخیره...</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    <span>ایجاد آیتم</span>
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
