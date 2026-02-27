"use client";

import { useState } from "react";

// Базовые цены для популярных брендов (в рублях)
const BRAND_BASE_PRICES: Record<string, number> = {
  // Смартфоны
  "Apple iPhone": 15000,
  "Samsung Galaxy": 12000,
  "Xiaomi": 8000,
  "Huawei": 7000,
  "Google Pixel": 10000,
  "OnePlus": 9000,
  "Realme": 6000,
  "Oppo": 7000,
  "Vivo": 6500,
  "Nokia": 5000,
  "Sony": 8000,
  
  // Планшеты
  "iPad": 20000,
  "Samsung Tablet": 15000,
  "Xiaomi Pad": 12000,
  
  // Ноутбуки
  "MacBook": 45000,
  "ASUS": 25000,
  "Lenovo": 22000,
  "HP": 23000,
  "Dell": 24000,
  "Acer": 18000,
  "MSI": 30000,
  
  // Компьютеры
  "Custom PC": 20000,
  
  // Консоли
  "PlayStation": 25000,
  "Xbox": 22000,
  "Nintendo": 20000,
};

// Популярные модели с коэффициентами к базовой цене
const POPULAR_MODELS: Record<string, { multiplier: number; year: number }> = {
  // iPhone
  "iPhone 15 Pro Max": { multiplier: 1.8, year: 2023 },
  "iPhone 15 Pro": { multiplier: 1.6, year: 2023 },
  "iPhone 15": { multiplier: 1.4, year: 2023 },
  "iPhone 14 Pro Max": { multiplier: 1.5, year: 2022 },
  "iPhone 14 Pro": { multiplier: 1.35, year: 2022 },
  "iPhone 14": { multiplier: 1.2, year: 2022 },
  "iPhone 13 Pro Max": { multiplier: 1.25, year: 2021 },
  "iPhone 13 Pro": { multiplier: 1.15, year: 2021 },
  "iPhone 13": { multiplier: 1.0, year: 2021 },
  "iPhone 12 Pro Max": { multiplier: 1.1, year: 2020 },
  "iPhone 12 Pro": { multiplier: 0.95, year: 2020 },
  "iPhone 12": { multiplier: 0.8, year: 2020 },
  "iPhone 11 Pro Max": { multiplier: 0.9, year: 2019 },
  "iPhone 11 Pro": { multiplier: 0.75, year: 2019 },
  "iPhone 11": { multiplier: 0.6, year: 2019 },
  "iPhone XS Max": { multiplier: 0.7, year: 2018 },
  "iPhone XS": { multiplier: 0.55, year: 2018 },
  "iPhone XR": { multiplier: 0.5, year: 2018 },
  "iPhone X": { multiplier: 0.55, year: 2017 },
  "iPhone 8 Plus": { multiplier: 0.4, year: 2017 },
  "iPhone 8": { multiplier: 0.35, year: 2017 },
  "iPhone 7 Plus": { multiplier: 0.3, year: 2016 },
  "iPhone 7": { multiplier: 0.25, year: 2016 },
  
  // Samsung Galaxy S
  "Galaxy S24 Ultra": { multiplier: 1.7, year: 2024 },
  "Galaxy S24+": { multiplier: 1.5, year: 2024 },
  "Galaxy S24": { multiplier: 1.35, year: 2024 },
  "Galaxy S23 Ultra": { multiplier: 1.5, year: 2023 },
  "Galaxy S23+": { multiplier: 1.3, year: 2023 },
  "Galaxy S23": { multiplier: 1.15, year: 2023 },
  "Galaxy S22 Ultra": { multiplier: 1.25, year: 2022 },
  "Galaxy S22+": { multiplier: 1.1, year: 2022 },
  "Galaxy S22": { multiplier: 0.95, year: 2022 },
  "Galaxy S21 Ultra": { multiplier: 1.0, year: 2021 },
  "Galaxy S21+": { multiplier: 0.85, year: 2021 },
  "Galaxy S21": { multiplier: 0.7, year: 2021 },
  "Galaxy S20 Ultra": { multiplier: 0.8, year: 2020 },
  "Galaxy S20": { multiplier: 0.6, year: 2020 },
  "Galaxy Note 20 Ultra": { multiplier: 0.9, year: 2020 },
  "Galaxy Note 20": { multiplier: 0.7, year: 2020 },
  
  // Xiaomi
  "Xiaomi 14 Pro": { multiplier: 1.4, year: 2024 },
  "Xiaomi 14": { multiplier: 1.2, year: 2024 },
  "Xiaomi 13 Pro": { multiplier: 1.2, year: 2023 },
  "Xiaomi 13": { multiplier: 1.0, year: 2023 },
  "Xiaomi 12 Pro": { multiplier: 1.0, year: 2022 },
  "Xiaomi 12": { multiplier: 0.85, year: 2022 },
  "Xiaomi 11T Pro": { multiplier: 0.8, year: 2021 },
  "Xiaomi Mi 11": { multiplier: 0.75, year: 2021 },
  "Xiaomi Mi 10T Pro": { multiplier: 0.6, year: 2020 },
  "Redmi Note 13 Pro": { multiplier: 0.7, year: 2024 },
  "Redmi Note 12 Pro": { multiplier: 0.55, year: 2023 },
  "Redmi Note 11 Pro": { multiplier: 0.45, year: 2022 },
  "POCO X6 Pro": { multiplier: 0.75, year: 2024 },
  "POCO X5 Pro": { multiplier: 0.6, year: 2023 },
  "POCO F5 Pro": { multiplier: 0.8, year: 2023 },
  
  // MacBook
  "MacBook Pro 16 M3 Max": { multiplier: 2.2, year: 2023 },
  "MacBook Pro 14 M3 Pro": { multiplier: 2.0, year: 2023 },
  "MacBook Pro 16 M2 Max": { multiplier: 1.9, year: 2023 },
  "MacBook Pro 14 M2 Pro": { multiplier: 1.7, year: 2023 },
  "MacBook Pro 16 M1 Max": { multiplier: 1.6, year: 2021 },
  "MacBook Pro 14 M1 Pro": { multiplier: 1.45, year: 2021 },
  "MacBook Air 15 M2": { multiplier: 1.3, year: 2023 },
  "MacBook Air 13 M2": { multiplier: 1.2, year: 2022 },
  "MacBook Air 13 M1": { multiplier: 1.0, year: 2020 },
  "MacBook Pro 16 2019": { multiplier: 0.9, year: 2019 },
  "MacBook Pro 13 2020": { multiplier: 0.85, year: 2020 },
  
  // PlayStation
  "PlayStation 5 Slim": { multiplier: 1.1, year: 2023 },
  "PlayStation 5": { multiplier: 1.0, year: 2020 },
  "PlayStation 4 Pro": { multiplier: 0.45, year: 2016 },
  "PlayStation 4": { multiplier: 0.35, year: 2013 },
  
  // Xbox
  "Xbox Series X": { multiplier: 1.0, year: 2020 },
  "Xbox Series S": { multiplier: 0.65, year: 2020 },
  "Xbox One X": { multiplier: 0.4, year: 2017 },
  "Xbox One": { multiplier: 0.3, year: 2013 },
  
  // Nintendo
  "Nintendo Switch OLED": { multiplier: 1.1, year: 2021 },
  "Nintendo Switch": { multiplier: 0.9, year: 2017 },
  "Nintendo Switch Lite": { multiplier: 0.7, year: 2019 },
};

// Коэффициенты состояния
const CONDITION_MULTIPLIERS: Record<string, { multiplier: number; desc: string }> = {
  excellent: { multiplier: 1.15, desc: "Идеальное (без царапин, как новый)" },
  good: { multiplier: 0.95, desc: "Хорошее (минимальные следы использования)" },
  fair: { multiplier: 0.7, desc: "Среднее (видимые царапины, потёртости)" },
  poor: { multiplier: 0.45, desc: "Плохое (трещины, сколы, не работает часть функций)" },
};

// Коэффициенты комплектации
const ACCESSORIES_MULTIPLIER = {
  box: 1.05, // Коробка
  charger: 1.03, // Зарядное устройство
  documents: 1.02, // Документы
  case: 1.02, // Чехол
  check: 1.05, // Чек о покупке
};

// Коэффициенты памяти
const STORAGE_MULTIPLIERS: Record<string, number> = {
  "32GB": 0.8,
  "64GB": 1.0,
  "128GB": 1.15,
  "256GB": 1.3,
  "512GB": 1.5,
  "1TB": 1.7,
  "2TB": 2.0,
};

export default function EvaluatePage() {
  const [deviceType, setDeviceType] = useState("");
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [customModel, setCustomModel] = useState("");
  const [condition, setCondition] = useState("");
  const [storage, setStorage] = useState("");
  const [accessories, setAccessories] = useState({
    box: false,
    charger: false,
    documents: false,
    case: false,
    check: false,
  });
  const [description, setDescription] = useState("");
  const [photos, setPhotos] = useState<File[]>([]);
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [estimate, setEstimate] = useState<{
    min: number;
    max: number;
    average: number;
    breakdown: string[];
  } | null>(null);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setPhotos(files);

    // Создаём превью
    const previews = files.map((file) => URL.createObjectURL(file));
    setPhotoPreviews(previews);
  };

  const calculateEstimate = () => {
    const breakdown: string[] = [];
    
    // 1. Базовая цена по бренду
    let basePrice = BRAND_BASE_PRICES[brand] || 5000;
    breakdown.push(`Базовая цена (${brand}): ${basePrice.toLocaleString()} ₽`);

    // 2. Коэффициент популярной модели
    let modelMultiplier = 1;
    const foundModel = Object.entries(POPULAR_MODELS).find(([key]) => 
      model.toLowerCase().includes(key.toLowerCase()) ||
      key.toLowerCase().includes(model.toLowerCase())
    );
    
    if (foundModel) {
      modelMultiplier = foundModel[1].multiplier;
      const yearAdjustment = Math.max(0.85, 1 - (new Date().getFullYear() - foundModel[1].year) * 0.08);
      modelMultiplier *= yearAdjustment;
      breakdown.push(`Модель "${foundModel[0]}": ×${modelMultiplier.toFixed(2)}`);
    } else {
      // Для непопулярных моделей — коэффициент по году
      breakdown.push(`Модель не в базе — стандартный коэффициент`);
    }

    // 3. Коэффициент состояния
    const conditionMult = CONDITION_MULTIPLIERS[condition]?.multiplier || 0.7;
    breakdown.push(`Состояние: ×${conditionMult.toFixed(2)} (${CONDITION_MULTIPLIERS[condition]?.desc})`);

    // 4. Коэффициент памяти
    const storageMult = storage ? (STORAGE_MULTIPLIERS[storage] || 1) : 1;
    if (storage) {
      breakdown.push(`Память ${storage}: ×${storageMult.toFixed(2)}`);
    }

    // 5. Коэффициент комплектации
    let accessoriesMult = 1;
    if (accessories.box) { accessoriesMult += 0.05; breakdown.push("Коробка: +5%"); }
    if (accessories.charger) { accessoriesMult += 0.03; breakdown.push("Зарядное: +3%"); }
    if (accessories.documents) { accessoriesMult += 0.02; breakdown.push("Документы: +2%"); }
    if (accessories.case) { accessoriesMult += 0.02; breakdown.push("Чехол: +2%"); }
    if (accessories.check) { accessoriesMult += 0.05; breakdown.push("Чек: +5%"); }

    // 6. Расчёт итоговой цены
    let estimatedPrice = basePrice * modelMultiplier * conditionMult * storageMult * accessoriesMult;
    
    // 7. Корректировка по типу устройства (скупка дешевле продажи)
    const buybackCoefficient = 0.75; // Мы покупаем на 25% дешевле рыночной цены
    estimatedPrice *= buybackCoefficient;
    breakdown.push(`Коэффициент скупки: ×${buybackCoefficient.toFixed(2)} (мы покупаем, а не продаём)`);

    // 8. Формируем диапазон (±15% для точности)
    const minPrice = Math.floor(estimatedPrice * 0.85);
    const maxPrice = Math.floor(estimatedPrice * 1.15);
    const average = Math.floor(estimatedPrice);

    // Округляем до сотен
    const roundedMin = Math.floor(minPrice / 100) * 100;
    const roundedMax = Math.ceil(maxPrice / 100) * 100;
    const roundedAverage = Math.floor(average / 100) * 100;

    return {
      min: roundedMin,
      max: roundedMax,
      average: roundedAverage,
      breakdown,
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Имитация задержки анализа
    setTimeout(() => {
      const result = calculateEstimate();
      setEstimate(result);
      setLoading(false);
    }, 1500);
  };

  const resetForm = () => {
    setDeviceType("");
    setBrand("");
    setModel("");
    setCustomModel("");
    setCondition("");
    setStorage("");
    setAccessories({
      box: false,
      charger: false,
      documents: false,
      case: false,
      check: false,
    });
    setDescription("");
    setPhotos([]);
    setPhotoPreviews([]);
    setEstimate(null);
  };

  // Получаем список моделей для выбранного бренда
  const getModelSuggestions = () => {
    return Object.keys(POPULAR_MODELS).filter(key => 
      key.toLowerCase().includes(brand.toLowerCase())
    );
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Оценка техники
          </h1>
          <p className="text-lg text-gray-600">
            Заполните форму и получите предварительную оценку стоимости вашего устройства
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Device Type */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Тип устройства *
              </label>
              <select
                value={deviceType}
                onChange={(e) => setDeviceType(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-900"
                required
              >
                <option value="">Выберите тип</option>
                <option value="smartphone">Смартфон</option>
                <option value="tablet">Планшет</option>
                <option value="laptop">Ноутбук</option>
                <option value="pc">Компьютер</option>
                <option value="console">Игровая консоль</option>
                <option value="other">Другое</option>
              </select>
            </div>

            {/* Brand & Model */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Бренд *
                </label>
                <input
                  type="text"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  placeholder="Apple, Samsung, Xiaomi..."
                  list="brand-suggestions"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  required
                />
                <datalist id="brand-suggestions">
                  {Object.keys(BRAND_BASE_PRICES).map((b) => (
                    <option key={b} value={b} />
                  ))}
                </datalist>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Модель *
                </label>
                <input
                  type="text"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  placeholder="iPhone 13, Galaxy S22..."
                  list="model-suggestions"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  required
                />
                <datalist id="model-suggestions">
                  {getModelSuggestions().map((m) => (
                    <option key={m} value={m} />
                  ))}
                </datalist>
              </div>
            </div>

            {/* Condition */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Состояние устройства *
              </label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-900"
                required
              >
                <option value="">Выберите состояние</option>
                {Object.entries(CONDITION_MULTIPLIERS).map(([key, value]) => (
                  <option key={key} value={key}>
                    {value.desc}
                  </option>
                ))}
              </select>
            </div>

            {/* Storage */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Объём памяти
              </label>
              <select
                value={storage}
                onChange={(e) => setStorage(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-900"
              >
                <option value="">Не указано</option>
                {Object.keys(STORAGE_MULTIPLIERS).map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            {/* Accessories */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-3">
                Комплектация (увеличивает стоимость)
              </label>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {[
                  { key: "box", label: "📦 Коробка", value: "+5%" },
                  { key: "charger", label: "🔌 Зарядка", value: "+3%" },
                  { key: "documents", label: "📄 Документы", value: "+2%" },
                  { key: "case", label: "📱 Чехол", value: "+2%" },
                  { key: "check", label: "🧾 Чек", value: "+5%" },
                ].map((item) => (
                  <label
                    key={item.key}
                    className={`flex flex-col items-center justify-center p-3 border-2 rounded-xl cursor-pointer transition-all ${
                      accessories[item.key as keyof typeof accessories]
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={accessories[item.key as keyof typeof accessories]}
                      onChange={(e) =>
                        setAccessories({ ...accessories, [item.key]: e.target.checked })
                      }
                      className="w-4 h-4 text-blue-600 mb-1"
                    />
                    <span className="text-xs text-center">{item.label}</span>
                    <span className="text-xs text-blue-600 font-medium">{item.value}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Описание
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Укажите дополнительные детали: дефекты, срок использования, особенности..."
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-900 placeholder-gray-500 resize-none"
              />
            </div>

            {/* Photos */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Фотографии устройства
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handlePhotoChange}
                  className="hidden"
                  id="photo-upload"
                />
                <label htmlFor="photo-upload" className="cursor-pointer">
                  <svg className="w-12 h-12 mx-auto text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-gray-900 mb-2">
                    Нажмите для загрузки или перетащите фото
                  </p>
                  <p className="text-sm text-gray-600">
                    JPG, PNG до 5MB (максимум 5 фото)
                  </p>
                </label>
              </div>

              {/* Photo Previews */}
              {photoPreviews.length > 0 && (
                <div className="grid grid-cols-3 gap-4 mt-4">
                  {photoPreviews.map((preview, i) => (
                    <div key={i} className="aspect-square rounded-lg overflow-hidden border border-gray-200">
                      <img src={preview} alt={`Preview ${i}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-4 px-6 bg-linear-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-lg"
              >
                {loading ? "Оценка..." : "Получить оценку"}
              </button>
              {estimate && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-4 bg-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-300 transition-all"
                >
                  Сбросить
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Result */}
        {estimate && (
          <div className="space-y-6">
            <div className="bg-linear-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-xl p-8 text-center text-white">
              <h2 className="text-2xl font-bold mb-2">Предварительная оценка</h2>
              <p className="text-white/80 mb-6 text-sm">
                Стоимость выкупа вашего устройства
              </p>
              <div className="text-6xl font-bold mb-2">
                {estimate.average.toLocaleString()} ₽
              </div>
              <div className="text-xl text-white/90 mb-6">
                {estimate.min.toLocaleString()} - {estimate.max.toLocaleString()} ₽
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="https://t.me/+79879773047"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-8 py-3 bg-white text-blue-600 font-semibold rounded-full hover:bg-yellow-300 transition-colors"
                >
                  Сдать в сервис
                </a>
                <a
                  href="tel:+79991234567"
                  className="inline-block px-8 py-3 bg-blue-700 text-white font-semibold rounded-full hover:bg-blue-800 transition-colors"
                >
                  Позвонить
                </a>
              </div>
            </div>

            {/* Breakdown */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-900">
                📊 Как рассчитана стоимость
              </h3>
              <div className="space-y-2 text-sm">
                {estimate.breakdown.map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-gray-700">
                    <svg className="w-4 h-4 text-blue-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {item}
                  </div>
                ))}
              </div>
              <div className="mt-4 p-4 bg-yellow-50 border border-yellow-300 rounded-xl">
                <p className="text-sm text-yellow-900">
                  💡 <strong>Совет:</strong> Это цена выкупа. Если хотите продать дороже — разместите объявление в нашем Telegram-канале (комиссия 10%).
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
