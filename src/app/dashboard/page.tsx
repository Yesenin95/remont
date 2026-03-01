"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { ROLES } from "@/types/roles";
import RepairRequestsTable from "@/components/dashboard/RepairRequestsTable";
import InventoryTable from "@/components/dashboard/InventoryTable";

const STAGE_LABELS: Record<string, string> = {
  DIAGNOSTICS: "Диагностика",
  REPAIR: "Ремонт",
  READY: "Готов к выдаче",
  ISSUED: "Выдан",
};

const STAGE_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  DIAGNOSTICS: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" },
  REPAIR: { bg: "bg-yellow-50", text: "text-yellow-700", border: "border-yellow-200" },
  READY: { bg: "bg-green-50", text: "text-green-700", border: "border-green-200" },
  ISSUED: { bg: "bg-gray-50", text: "text-gray-700", border: "border-gray-200" },
};

const STATUS_LABELS: Record<string, string> = {
  PENDING: "В ожидании",
  IN_PROGRESS: "В работе",
  COMPLETED: "Завершено",
  CANCELLED: "Отменено",
};

export default function DashboardPage() {
  const { user, loading, isLoggedIn, isMaster, isOwner, isStaff } = useAuth();
  const router = useRouter();
  const [repairs, setRepairs] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [parts, setParts] = useState<any[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"active" | "history" | "track">("active");
  const [trackNumber, setTrackNumber] = useState("");
  const [trackedRepair, setTrackedRepair] = useState<any>(null);
  const [trackError, setTrackError] = useState("");

  useEffect(() => {
    if (!loading && !isLoggedIn) {
      router.push("/auth");
    }
  }, [loading, isLoggedIn, router]);

  useEffect(() => {
    if (isLoggedIn) {
      fetchData();
    }
  }, [isLoggedIn]);

  const fetchData = async () => {
    try {
      let repairsUrl = "/api/repairs";
      
      // Если обычный пользователь - загружаем только его заявки по телефону
      if (!isMaster && !isOwner && user) {
        const storedUser = localStorage.getItem("user");
        const userData = storedUser ? JSON.parse(storedUser) : null;
        const phone = userData?.phone || user.email;
        repairsUrl = `/api/repairs?phone=${encodeURIComponent(phone)}`;
      }

      const [repairsRes, productsRes, partsRes] = await Promise.all([
        fetch(repairsUrl),
        fetch("/api/products"),
        fetch("/api/parts"),
      ]);

      if (repairsRes.ok) {
        const data = await repairsRes.json();
        setRepairs(data.repairs || []);
      }
      if (productsRes.ok) {
        const data = await productsRes.json();
        setProducts(data.products || []);
      }
      if (partsRes.ok) {
        const data = await partsRes.json();
        setParts(data.parts || []);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setDataLoading(false);
    }
  };

  const handleTrackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTrackError("");
    
    try {
      const res = await fetch(`/api/repairs/track/${trackNumber.trim()}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Заявка не найдена");
      }

      setTrackedRepair(data);
    } catch (err) {
      setTrackError(err instanceof Error ? err.message : "Заявка не найдена");
      setTrackedRepair(null);
    }
  };

  if (loading || dataLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <div className="absolute inset-0 border-4 border-blue-200 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
          </div>
          <p className="text-gray-600 font-medium">Загрузка...</p>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return null;
  }

  // Обычный пользователь - показывает личный кабинет
  if (!isStaff) {
    const userRepairs = repairs;
    const activeRepairs = userRepairs.filter((r) => r.status !== "COMPLETED" && r.status !== "CANCELLED");
    const historyRepairs = userRepairs.filter((r) => r.status === "COMPLETED" || r.status === "CANCELLED");

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-40">
          <div className="max-w-6xl mx-auto px-4 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Личный кабинет</h1>
                  <p className="text-sm text-gray-500">{user?.name || user?.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => router.push("/repair-request")}
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md text-sm font-medium"
                >
                  + Новая заявка
                </button>
                <button
                  onClick={() => {
                    localStorage.removeItem("token");
                    router.push("/");
                  }}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                >
                  Выйти
                </button>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-6xl mx-auto px-4 py-8">
          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Активных заявок</p>
                  <p className="text-2xl font-bold text-gray-900">{activeRepairs.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Завершено</p>
                  <p className="text-2xl font-bold text-gray-900">{historyRepairs.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Всего заявок</p>
                  <p className="text-2xl font-bold text-gray-900">{userRepairs.length}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-6 overflow-hidden">
            <div className="flex">
              <button
                onClick={() => setActiveTab("active")}
                className={`flex-1 px-6 py-4 font-medium transition-all relative ${
                  activeTab === "active"
                    ? "text-blue-600 bg-blue-50"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                }`}
              >
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Активные
                </span>
                {activeTab === "active" && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
                )}
              </button>
              <button
                onClick={() => setActiveTab("history")}
                className={`flex-1 px-6 py-4 font-medium transition-all relative ${
                  activeTab === "history"
                    ? "text-blue-600 bg-blue-50"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                }`}
              >
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  История
                </span>
                {activeTab === "history" && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
                )}
              </button>
              <button
                onClick={() => setActiveTab("track")}
                className={`flex-1 px-6 py-4 font-medium transition-all relative ${
                  activeTab === "track"
                    ? "text-blue-600 bg-blue-50"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                }`}
              >
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  Проверить статус
                </span>
                {activeTab === "track" && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
                )}
              </button>
            </div>
          </div>

          {/* Active Repairs */}
          {activeTab === "active" && (
            <div className="space-y-4">
              {activeRepairs.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
                  <div className="w-20 h-20 mx-auto mb-6 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Нет активных заявок</h3>
                  <p className="text-gray-500 mb-6">Создайте первую заявку на ремонт</p>
                  <button
                    onClick={() => router.push("/repair-request")}
                    className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg"
                  >
                    Создать заявку
                  </button>
                </div>
              ) : (
                activeRepairs.map((repair) => (
                  <RepairCard key={repair.id} repair={repair} />
                ))
              )}
            </div>
          )}

          {/* History */}
          {activeTab === "history" && (
            <div className="space-y-4">
              {historyRepairs.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
                  <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                    <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">История пуста</h3>
                  <p className="text-gray-500">Здесь будут отображаться завершённые заявки</p>
                </div>
              ) : (
                historyRepairs.map((repair) => (
                  <RepairCard key={repair.id} repair={repair} />
                ))
              )}
            </div>
          )}

          {/* Track by Number */}
          {activeTab === "track" && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <div className="text-center mb-8">
                <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Проверка статуса ремонта</h3>
                <p className="text-gray-500">Введите номер заявки для отслеживания статуса</p>
              </div>

              <form onSubmit={handleTrackSubmit} className="max-w-md mx-auto mb-6">
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={trackNumber}
                    onChange={(e) => setTrackNumber(e.target.value.toUpperCase())}
                    placeholder="R-XXXXX"
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-center font-mono font-medium"
                  />
                  <button
                    type="submit"
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md"
                  >
                    Найти
                  </button>
                </div>
              </form>

              {trackError && (
                <div className="max-w-md mx-auto p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-center">
                  {trackError}
                </div>
              )}

              {trackedRepair && (
                <div className="max-w-2xl mx-auto">
                  <RepairCard repair={trackedRepair} />
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    );
  }

  // Мастер или Владелец - показывают дашборд с заявками
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Панель управления
              </h1>
              <p className="text-gray-500 mt-1">
                {isOwner ? "Владелец" : "Мастер"} • {user?.name || user?.email}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  isOwner
                    ? "bg-purple-100 text-purple-800"
                    : "bg-blue-100 text-blue-800"
                }`}
              >
                {isOwner ? "Владелец" : "Мастер"}
              </span>
              <button
                onClick={() => {
                  localStorage.removeItem("token");
                  router.push("/");
                }}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Выйти
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow p-6">
            <div className="text-sm text-gray-500 mb-1">Заявок в работе</div>
            <div className="text-3xl font-bold text-blue-600">
              {repairs.filter((r) => r.status === "IN_PROGRESS").length}
            </div>
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <div className="text-sm text-gray-500 mb-1">Ожидают</div>
            <div className="text-3xl font-bold text-yellow-600">
              {repairs.filter((r) => r.status === "PENDING").length}
            </div>
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <div className="text-sm text-gray-500 mb-1">Товаров</div>
            <div className="text-3xl font-bold text-green-600">
              {products.filter((p) => p.status === "AVAILABLE").length}
            </div>
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <div className="text-sm text-gray-500 mb-1">Запчастей</div>
            <div className="text-3xl font-bold text-indigo-600">
              {parts.filter((p) => p.status === "IN_STOCK").length}
            </div>
          </div>
        </div>

        {/* Repair Requests */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Заявки</h2>
          <RepairRequestsTable
            initialRequests={repairs}
            userRole={user?.role || "USER"}
            userId={user?.id || ""}
          />
        </section>

        {/* Inventory - только для владельца */}
        {isOwner && (
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Инвентарь
            </h2>
            <InventoryTable
              initialProducts={products}
              initialParts={parts}
              userRole={user?.role || "USER"}
            />
          </section>
        )}
      </main>
    </div>
  );
}

// Компонент карточки заявки
function RepairCard({ repair }: { repair: any }) {
  const stageConfig = STAGE_COLORS[repair.repairStage] || STAGE_COLORS.DIAGNOSTICS;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
      <div className="p-6">
        {/* Header */}
        <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-xl font-mono font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-lg">
                  {repair.requestNumber}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${stageConfig.bg} ${stageConfig.text} ${stageConfig.border}`}>
                  {STAGE_LABELS[repair.repairStage]}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">{repair.deviceModel}</h3>
              <p className="text-gray-600 text-sm mt-1">{repair.problem}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500 mb-1">Принято</p>
            <p className="font-semibold text-gray-900">
              {new Date(repair.createdAt).toLocaleDateString("ru-RU", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
            {repair.isReadyForPickup && (
              <div className="mt-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                Готов к выдаче
              </div>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="relative">
            <div className="absolute top-0 left-0 right-0 h-2 bg-gray-100 rounded-full"></div>
            <div
              className="absolute top-0 left-0 h-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-500"
              style={{
                width: `${
                  repair.repairStage === "DIAGNOSTICS"
                    ? 25
                    : repair.repairStage === "REPAIR"
                    ? 50
                    : repair.repairStage === "READY"
                    ? 75
                    : 100
                }%`,
              }}
            ></div>
            <div className="relative flex justify-between">
              {Object.entries(STAGE_LABELS).map(([key, label], index) => {
                const stages = ["DIAGNOSTICS", "REPAIR", "READY", "ISSUED"];
                const currentIndex = stages.indexOf(repair.repairStage);
                const isActive = index <= currentIndex;

                return (
                  <div key={key} className="text-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-2 transition-all ${
                        isActive
                          ? "bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg"
                          : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      {isActive ? (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <span className="text-sm font-medium">{index + 1}</span>
                      )}
                    </div>
                    <p className={`text-xs font-medium ${isActive ? "text-blue-600" : "text-gray-400"}`}>
                      {label}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-xl mb-4">
          <div>
            <p className="text-xs text-gray-500 mb-1">Статус</p>
            <p className="font-medium text-gray-900">{STATUS_LABELS[repair.status]}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Телефон</p>
            <p className="font-medium text-gray-900">{repair.phone}</p>
          </div>
          {repair.pickupCode && (
            <div>
              <p className="text-xs text-gray-500 mb-1">Код получения</p>
              <p className="font-mono font-bold text-blue-600">{repair.pickupCode}</p>
            </div>
          )}
        </div>

        {/* Photos */}
        {repair.media && repair.media.length > 0 && (
          <div className="mb-4">
            <p className="text-sm font-medium text-gray-700 mb-3">Фотографии ({repair.media.length})</p>
            <div className="grid grid-cols-4 gap-2">
              {repair.media.map((url: string, i: number) => (
                <a
                  key={i}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="aspect-square bg-gray-100 rounded-lg overflow-hidden hover:ring-2 hover:ring-blue-500 transition-all"
                >
                  <img
                    src={url}
                    alt={`Photo ${i}`}
                    className="w-full h-full object-cover"
                  />
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-4 border-t border-gray-100">
          <a
            href="https://t.me/+79999999999"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md text-sm font-medium text-center flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.427-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
            </svg>
            Написать мастеру
          </a>
          <a
            href={`tel:${repair.phone}`}
            className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all text-sm font-medium text-center flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            Позвонить
          </a>
        </div>
      </div>
    </div>
  );
}
