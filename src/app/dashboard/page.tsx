"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import { useRouter } from "next/navigation";

interface RepairRequest {
  id: string;
  customerName: string;
  phone: string;
  deviceModel: string;
  problem: string;
  status: string;
  service: {
    name: string;
    price: number;
  };
  createdAt: string;
}

interface User {
  id: string;
  email?: string | null;
  phone?: string | null;
  name?: string | null;
}

export default function DashboardPage() {
  const [repairs, setRepairs] = useState<RepairRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Проверяем авторизацию
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/auth");
      return;
    }

    // Получаем данные пользователя
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }

    fetch("/api/repairs")
      .then((res) => res.json())
      .then((data) => {
        setRepairs(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/auth");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "IN_PROGRESS":
        return "bg-blue-100 text-blue-800";
      case "COMPLETED":
        return "bg-green-100 text-green-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "PENDING":
        return "В ожидании";
      case "IN_PROGRESS":
        return "В ремонте";
      case "COMPLETED":
        return "Готов";
      case "CANCELLED":
        return "Отменён";
      default:
        return status;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 ml-0 lg:ml-72">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Профиль пользователя */}
          <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-linear-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {user?.name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || user?.phone?.charAt(1).toUpperCase()}
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-gray-900">
                  {user?.name || 'Пользователь'}
                </h2>
                {user?.email && (
                          <p className="text-black-600">{user.email}</p>
                )}
                {user?.phone && (
                  <p className="text-black-600">{user.phone}</p>
                )}
              </div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
              >
                Выйти
              </button>
            </div>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Мои заявки</h1>
            <p className="text-gray-600 mt-1">История обращений на ремонт</p>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
            </div>
          ) : repairs.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
              <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Нет заявок</h3>
              <p className="text-gray-600 mb-6">Вы ещё не оформляли ни одной заявки на ремонт</p>
              <a
                href="https://t.me/techfix_bot"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 py-3 bg-linear-to-r from-orange-500 to-red-600 text-white font-semibold rounded-full hover:from-orange-600 hover:to-red-700 transition-all"
              >
                Оформить заявку
              </a>
            </div>
          ) : (
            <div className="space-y-4">
              {repairs.map((repair) => (
                <div
                  key={repair.id}
                  className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(repair.status)}`}>
                          {getStatusText(repair.status)}
                        </span>
                        <span className="text-sm text-gray-500">
                          {new Date(repair.createdAt).toLocaleDateString("ru-RU")}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {repair.service.name}
                      </h3>
                      <p className="text-gray-600 mb-2">
                        Устройство: <span className="font-medium">{repair.deviceModel}</span>
                      </p>
                      <p className="text-gray-600">
                        Проблема: <span className="font-medium">{repair.problem}</span>
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-orange-500">
                        {repair.service.price} ₽
                      </p>
                      <p className="text-sm text-gray-500">
                        {repair.customerName}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
