// Типы ролей пользователей
export type UserRole = "USER" | "MASTER" | "OWNER";

// Константы ролей
export const ROLES = {
  USER: "USER" as UserRole,
  MASTER: "MASTER" as UserRole,
  OWNER: "OWNER" as UserRole,
} as const;

// Описание ролей
export const ROLE_DESCRIPTIONS: Record<UserRole, string> = {
  USER: "Клиент",
  MASTER: "Мастер",
  OWNER: "Владелец",
} as const;

// Права доступа для каждой роли
export const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  USER: ["view_services", "create_repair_request", "view_own_requests"],
  MASTER: [
    "view_all_requests",
    "update_request_status",
    "send_messages",
    "view_products",
    "view_parts",
    "view_inventory",
  ],
  OWNER: [
    "view_all_requests",
    "update_request_status",
    "send_messages",
    "view_products",
    "view_parts",
    "view_inventory",
    "create_product",
    "update_product",
    "delete_product",
    "create_part",
    "update_part",
    "delete_part",
    "create_category",
    "update_category",
    "delete_category",
    "manage_users",
  ],
} as const;

// Проверка наличия права у роли
export function hasPermission(role: UserRole, permission: string): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}

// Проверка, является ли пользователь мастером или владельцем
export function isStaff(role: UserRole): boolean {
  return role === ROLES.MASTER || role === ROLES.OWNER;
}

// Проверка, является ли пользователь владельцем
export function isOwner(role: UserRole): boolean {
  return role === ROLES.OWNER;
}
