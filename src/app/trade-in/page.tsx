"use client";

import Link from "next/link";

export default function TradeInPage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100">
      {/* Hero Section */}
      <section className="bg-linear-to-r from-blue-600 to-indigo-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Купить / Продать
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto">
            Б/у техника и новые компоненты по выгодным ценам.
            <br />
            Выгодный Trade-In — сдай старое, купи новое!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://t.me/+79879773047"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-full bg-white text-green-600 hover:bg-yellow-300 transition-colors"
            >
              Продать технику
            </a>
            <Link
              href="/evaluate"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-full border-2 border-white text-white hover:bg-white/20 transition-colors"
            >
              Оценить устройство
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900">
            Что мы покупаем и продаём
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Смартфоны",
                icon: "📱",
                desc: "iPhone, Samsung, Xiaomi и другие",
                buy: "от 1 000 ₽",
                sell: "от 3 000 ₽",
              },
              {
                title: "Планшеты",
                icon: "📟",
                desc: "iPad, Android планшеты",
                buy: "от 2 000 ₽",
                sell: "от 5 000 ₽",
              },
              {
                title: "Ноутбуки",
                icon: "💻",
                desc: "MacBook, Windows ноутбуки",
                buy: "от 5 000 ₽",
                sell: "от 15 000 ₽",
              },
              {
                title: "Комплектующие",
                icon: "🔧",
                desc: "Видеокарты, процессоры, ОЗУ",
                buy: "от 500 ₽",
                sell: "от 1 500 ₽",
              },
              {
                title: "Мониторы",
                icon: "🖥️",
                desc: "LCD, LED, игровые мониторы",
                buy: "от 1 000 ₽",
                sell: "от 4 000 ₽",
              },
              {
                title: "Техника Apple",
                icon: "🍎",
                desc: "Mac, iPad, Apple Watch, AirPods",
                buy: "от 2 000 ₽",
                sell: "от 8 000 ₽",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900">{item.title}</h3>
                <p className="text-gray-900 mb-4">{item.desc}</p>
                <div className="flex justify-between text-sm">
                  <span className="text-red-600">
                    <span className="font-medium">Скупка:</span> {item.buy}
                  </span>
                  <span className="text-green-600">
                    <span className="font-medium">Продажа:</span> {item.sell}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900">
            Как это работает
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {/* Sell */}
            <div className="bg-linear-to-br from-blue-50 to-indigo-50 rounded-2xl p-8">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Продать технику</h3>
              <ol className="space-y-4 text-gray-900">
                <li className="flex items-start gap-3">
                  <span className="shrink-0 w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-bold">1</span>
                  <span>Оставьте заявку через Telegram или на сайте</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="shrink-0 w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-bold">2</span>
                  <span>Получите предварительную оценку</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="shrink-0 w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-bold">3</span>
                  <span>Принесите устройство в сервис</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="shrink-0 w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-bold">4</span>
                  <span>Получите деньги сразу после проверки</span>
                </li>
              </ol>
              <a
                href="https://t.me/+79879773047"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 block w-full py-3 px-4 bg-blue-500 text-white font-semibold rounded-xl text-center hover:bg-blue-600 transition-colors"
              >
                Продать сейчас
              </a>
            </div>

            {/* Buy */}
            <div className="bg-linear-to-br from-indigo-50 to-purple-50 rounded-2xl p-8">
              <div className="w-16 h-16 bg-indigo-500 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Купить технику</h3>
              <ol className="space-y-4 text-gray-900">
                <li className="flex items-start gap-3">
                  <span className="shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">1</span>
                  <span>Выберите устройство в каталоге</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">2</span>
                  <span>Свяжитесь с нами для уточнения деталей</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">3</span>
                  <span>Проверьте устройство в сервисе</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">4</span>
                  <span>Получите гарантию и чек</span>
                </li>
              </ol>
              <a
                href="https://t.me/+79879773047"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 block w-full py-3 px-4 bg-indigo-500 text-white font-semibold rounded-xl text-center hover:bg-indigo-600 transition-colors"
              >
                Смотреть каталог
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900">
            Почему выгодно работать с нами
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              {
                icon: (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                ),
                title: "Честная цена",
                desc: "Оцениваем по рыночной стоимости",
              },
              {
                icon: (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                ),
                title: "Быстро",
                desc: "Оценка за 15 минут, выплата сразу",
              },
              {
                icon: (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                ),
                title: "Безопасно",
                desc: "Официальный договор и чек",
              },
              {
                icon: (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                ),
                title: "Trade-In",
                desc: "Обмен старого на новое с доплатой",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-6 shadow-lg text-center"
              >
                <div className="w-16 h-16 mx-auto mb-4 bg-linear-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {item.icon}
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-linear-to-r from-blue-600 to-indigo-600 rounded-3xl p-8 md:p-12 text-center text-white shadow-2xl">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Хотите продать технику?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Получите бесплатную оценку прямо сейчас
            </p>
            <Link
              href="/evaluate"
              className="inline-flex items-center px-8 py-4 text-lg font-semibold rounded-full bg-white text-blue-600 hover:bg-yellow-300 transition-colors"
            >
              Оценить устройство
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
