"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Проверяем авторизацию при загрузке
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.dispatchEvent(new Event("auth-change"));
    setIsLoggedIn(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    console.log("Login form submitted:", email);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      console.log("Login response status:", res.status);

      const data = await res.json();
      console.log("Login response data:", data);

      if (!res.ok) {
        throw new Error(data.error || "Ошибка авторизации");
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      console.log("Login successful, redirecting...");

      // Сообщаем другим компонентам об изменении авторизации
      window.dispatchEvent(new Event("auth-change"));
      
      // Используем router.push для редиректа
      setTimeout(() => {
        router.push("/dashboard");
      }, 100);
    } catch (err) {
      console.error("Login error:", err);
      setError(err instanceof Error ? err.message : "Ошибка входа");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4 bg-linear-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-xl">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">TechFix</h1>
          <p className="text-gray-600 mt-2">Панель сотрудника</p>
        </div>

        {/* Login Form Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Вход</h2>

          {/* Если уже вошёл */}
          {isLoggedIn && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl text-center">
              <p className="text-green-800 font-medium mb-3">Вы уже авторизованы</p>
              <div className="flex gap-3 justify-center">
                <a
                  href="/dashboard"
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                >
                  Перейти в кабинет
                </a>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                >
                  Выйти
                </button>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} autoComplete="off">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="master@techfix.ru"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-900 placeholder-gray-500"
                  required
                  autoComplete="email"
                  name="email"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Пароль
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-900 placeholder-gray-500"
                  required
                  minLength={6}
                  autoComplete="current-password"
                  name="current-password"
                  data-1p-ignore
                  data-bwignore
                />
              </div>
            </div>

            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
                {error}
              </div>
            )}

            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-xl text-sm">
              <p className="font-medium text-blue-900 mb-2">Тестовые аккаунты:</p>
              <div className="space-y-2 text-blue-800">
                <div>
                  <p className="text-xs font-semibold mb-1">🔧 Мастер:</p>
                  <p className="text-xs"><code className="bg-white px-2 py-0.5 rounded">master@techfix.ru</code></p>
                  <p className="text-xs"><code className="bg-white px-2 py-0.5 rounded">TechFix@Master2024!SecureKey#9</code></p>
                </div>
                <div>
                  <p className="text-xs font-semibold mb-1">👑 Владелец:</p>
                  <p className="text-xs"><code className="bg-white px-2 py-0.5 rounded">owner@techfix.ru</code></p>
                  <p className="text-xs"><code className="bg-white px-2 py-0.5 rounded">TechFix@Owner2024!SecureKey#7</code></p>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-6 py-3 px-4 bg-linear-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              {loading ? "Загрузка..." : "Войти"}
            </button>
          </form>

          {/* Register Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm mb-3">Нет аккаунта?</p>
            <Link
              href="/auth/register"
              className="inline-block px-6 py-2 bg-blue-100 text-blue-700 font-medium rounded-xl hover:bg-blue-200 transition-colors text-sm"
            >
              Зарегистрироваться
            </Link>
          </div>
        </div>

        {/* Back to home */}
        <div className="mt-6 text-center">
          <Link
            href="/"
            className="text-gray-600 hover:text-gray-900 text-sm font-medium"
          >
            ← Вернуться на главную
          </Link>
        </div>
      </div>
    </div>
  );
}
