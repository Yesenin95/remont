"use client";

import { useState } from "react";

interface Product {
  id: string;
  name: string;
  brand: string;
  model: string | null;
  price: number;
  cost: number;
  quantity: number;
  condition: string;
  status: string;
  category: { name: string };
}

interface Parts {
  id: string;
  name: string;
  brand: string;
  price: number;
  cost: number;
  quantity: number;
  sku: string | null;
  status: string;
  category: { name: string };
}

interface InventoryTableProps {
  initialProducts: Product[];
  initialParts: Parts[];
  userRole: string;
}

const PRODUCT_CONDITIONS: Record<string, string> = {
  NEW: "Новый",
  USED: "Б/у",
  REFURBISHED: "Восстановленный",
  FOR_PARTS: "На запчасти",
};

const PRODUCT_STATUSES: Record<string, string> = {
  AVAILABLE: "В наличии",
  SOLD: "Продан",
  RESERVED: "Забронирован",
  IN_REPAIR: "В ремонте",
};

const PART_STATUSES: Record<string, string> = {
  IN_STOCK: "В наличии",
  LOW_STOCK: "Мало",
  OUT_OF_STOCK: "Нет",
  ON_ORDER: "В заказе",
};

export default function InventoryTable({
  initialProducts,
  initialParts,
  userRole,
}: InventoryTableProps) {
  const [activeTab, setActiveTab] = useState<"products" | "parts">("products");
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [parts, setParts] = useState<Parts[]>(initialParts);
  const [showProductModal, setShowProductModal] = useState(false);
  const [showPartModal, setShowPartModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  const deleteProduct = async (id: string) => {
    if (!confirm("Вы уверены?")) return;
    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p.id !== id));
      }
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const deletePart = async (id: string) => {
    if (!confirm("Вы уверены?")) return;
    try {
      const res = await fetch(`/api/parts/${id}`, { method: "DELETE" });
      if (res.ok) {
        setParts((prev) => prev.filter((p) => p.id !== id));
      }
    } catch (error) {
      console.error("Error deleting part:", error);
    }
  };

  const canEdit = userRole === "OWNER";

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-4 border-b">
        <button
          onClick={() => setActiveTab("products")}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === "products"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Товары ({products.length})
        </button>
        <button
          onClick={() => setActiveTab("parts")}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === "parts"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Запчасти ({parts.length})
        </button>
      </div>

      {/* Add Button */}
      {canEdit && (
        <button
          onClick={() =>
            activeTab === "products"
              ? setShowProductModal(true)
              : setShowPartModal(true)
          }
          className="w-full py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
        >
          + Добавить {activeTab === "products" ? "товар" : "запчасть"}
        </button>
      )}

      {/* Products Table */}
      {activeTab === "products" && (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Название
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Бренд
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Состояние
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Статус
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Кол-во
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Цена
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Прибыль
                </th>
                {canEdit && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Действия
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">
                    <div className="font-medium">{product.name}</div>
                    {product.model && (
                      <div className="text-gray-500">{product.model}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {product.brand}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs rounded-full bg-gray-100">
                      {PRODUCT_CONDITIONS[product.condition]}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        product.status === "AVAILABLE"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {PRODUCT_STATUSES[product.status]}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {product.quantity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {product.price.toLocaleString()} ₽
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                    {(product.price - product.cost).toLocaleString()} ₽
                  </td>
                  {canEdit && (
                    <td className="px-6 py-4 whitespace-nowrap space-x-2">
                      <button
                        onClick={() => {
                          setEditingItem(product);
                          setShowProductModal(true);
                        }}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => deleteProduct(product.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        🗑️
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
          {products.length === 0 && (
            <div className="text-center py-12 text-gray-500">Нет товаров</div>
          )}
        </div>
      )}

      {/* Parts Table */}
      {activeTab === "parts" && (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Название
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Бренд
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Артикул
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Статус
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Кол-во
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Цена
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Прибыль
                </th>
                {canEdit && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Действия
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {parts.map((part) => (
                <tr key={part.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">
                    <div className="font-medium">{part.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {part.brand}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {part.sku || "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        part.status === "IN_STOCK"
                          ? "bg-green-100 text-green-800"
                          : part.status === "LOW_STOCK"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {PART_STATUSES[part.status]}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {part.quantity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {part.price.toLocaleString()} ₽
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                    {(part.price - part.cost).toLocaleString()} ₽
                  </td>
                  {canEdit && (
                    <td className="px-6 py-4 whitespace-nowrap space-x-2">
                      <button
                        onClick={() => {
                          setEditingItem(part);
                          setShowPartModal(true);
                        }}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => deletePart(part.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        🗑️
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
          {parts.length === 0 && (
            <div className="text-center py-12 text-gray-500">Нет запчастей</div>
          )}
        </div>
      )}

      {/* Modals would go here - simplified for brevity */}
      {showProductModal && (
        <ProductModal
          product={editingItem}
          onClose={() => {
            setShowProductModal(false);
            setEditingItem(null);
          }}
          onSave={(product) => {
            if (editingItem) {
              setProducts((prev) =>
                prev.map((p) => (p.id === editingItem.id ? product : p))
              );
            } else {
              setProducts((prev) => [...prev, product]);
            }
            setShowProductModal(false);
          }}
        />
      )}
    </div>
  );
}

function ProductModal({
  product,
  onClose,
  onSave,
}: {
  product?: Product;
  onClose: () => void;
  onSave: (product: Product) => void;
}) {
  const [formData, setFormData] = useState({
    name: product?.name || "",
    brand: product?.brand || "",
    model: product?.model || "",
    price: product?.price || 0,
    cost: product?.cost || 0,
    quantity: product?.quantity || 1,
    condition: product?.condition || "NEW",
    status: product?.status || "AVAILABLE",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // In real app, make API call here
    onSave(formData as unknown as Product);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6">
        <h3 className="text-xl font-bold mb-4">
          {product ? "Редактировать товар" : "Новый товар"}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Название"
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
            className="w-full px-4 py-2 border rounded-lg"
            required
          />
          <input
            type="text"
            placeholder="Бренд"
            value={formData.brand}
            onChange={(e) =>
              setFormData({ ...formData, brand: e.target.value })
            }
            className="w-full px-4 py-2 border rounded-lg"
            required
          />
          <input
            type="text"
            placeholder="Модель"
            value={formData.model}
            onChange={(e) =>
              setFormData({ ...formData, model: e.target.value })
            }
            className="w-full px-4 py-2 border rounded-lg"
          />
          <div className="grid grid-cols-2 gap-4">
            <input
              type="number"
              placeholder="Цена"
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: parseInt(e.target.value) })
              }
              className="w-full px-4 py-2 border rounded-lg"
              required
            />
            <input
              type="number"
              placeholder="Себестоимость"
              value={formData.cost}
              onChange={(e) =>
                setFormData({ ...formData, cost: parseInt(e.target.value) })
              }
              className="w-full px-4 py-2 border rounded-lg"
              required
            />
          </div>
          <input
            type="number"
            placeholder="Количество"
            value={formData.quantity}
            onChange={(e) =>
              setFormData({ ...formData, quantity: parseInt(e.target.value) })
            }
            className="w-full px-4 py-2 border rounded-lg"
            required
          />
          <select
            value={formData.condition}
            onChange={(e) =>
              setFormData({ ...formData, condition: e.target.value })
            }
            className="w-full px-4 py-2 border rounded-lg"
          >
            <option value="NEW">Новый</option>
            <option value="USED">Б/у</option>
            <option value="REFURBISHED">Восстановленный</option>
            <option value="FOR_PARTS">На запчасти</option>
          </select>
          <div className="flex gap-4">
            <button
              type="submit"
              className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Сохранить
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
            >
              Отмена
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
