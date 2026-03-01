// Общие типы для приложения

// Статусы заявок
export type RepairStatus = "PENDING" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";

// Статусы товаров
export type ProductCondition = "NEW" | "USED" | "REFURBISHED" | "FOR_PARTS";
export type ProductStatus = "AVAILABLE" | "SOLD" | "RESERVED" | "IN_REPAIR";

// Статусы запчастей
export type PartStatus = "IN_STOCK" | "LOW_STOCK" | "OUT_OF_STOCK" | "ON_ORDER";

// Стадии ремонта
export type RepairStage = "DIAGNOSTICS" | "REPAIR" | "READY" | "ISSUED";

// Типы устройств
export type DeviceType = "smartphone" | "tablet" | "laptop" | "pc" | "console" | "other";

// Состояние устройства
export type Condition = "excellent" | "good" | "fair" | "poor";

// Заявка на ремонт
export interface RepairRequestData {
  customerName: string;
  phone: string;
  deviceModel: string;
  problem: string;
  serviceId?: string;
  notes?: string;
}

// Товар
export interface ProductData {
  name: string;
  description?: string;
  price: number;
  cost: number;
  categoryId: string;
  brand: string;
  model?: string;
  condition: ProductCondition;
  quantity: number;
  images?: string[];
}

// Запчасть
export interface PartData {
  name: string;
  description?: string;
  price: number;
  cost: number;
  categoryId: string;
  brand: string;
  compatibleModels?: string;
  quantity: number;
  minQuantity?: number;
  supplier?: string;
  sku?: string;
}

// Категория
export interface CategoryData {
  name: string;
  description?: string;
}

// Сообщение
export interface MessageData {
  content: string;
  repairRequestId?: string;
}

// Фильтры для списка заявок
export interface RepairRequestFilters {
  status?: RepairStatus;
  assignedTo?: string;
  search?: string;
  page?: number;
  limit?: number;
}

// Фильтры для списка товаров
export interface ProductFilters {
  categoryId?: string;
  status?: ProductStatus;
  brand?: string;
  search?: string;
  page?: number;
  limit?: number;
}

// Фильтры для списка запчастей
export interface PartFilters {
  categoryId?: string;
  status?: PartStatus;
  brand?: string;
  search?: string;
  page?: number;
  limit?: number;
}
