import { NextRequest, NextResponse } from "next/server";
import { UserRole, ROLES } from "@/types/roles";

// Получение токена из запроса
export function getTokenFromRequest(request: NextRequest): string | null {
  const authHeader = request.headers.get("Authorization");
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.substring(7);
  }
  return request.cookies.get("token")?.value || null;
}

// Проверка авторизации (упрощённая - в реальности нужна валидация токена)
export async function getCurrentUser(request: NextRequest) {
  const token = getTokenFromRequest(request);
  if (!token) {
    return null;
  }

  try {
    // Здесь должна быть логика валидации токена
    // Для примера - декодируем данные из токена (в реальности используйте JWT)
    const res = await fetch(new URL("/api/auth/me", request.url), {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.ok) {
      const data = await res.json();
      return data.user;
    }
  } catch (error) {
    console.error("Error getting current user:", error);
  }

  return null;
}

// Проверка права доступа
export function hasPermission(role: UserRole, permission: string): boolean {
  const permissions: Record<UserRole, string[]> = {
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
  };

  return permissions[role]?.includes(permission) ?? false;
}

// Проверка, является ли пользователь мастером или владельцем
export function isStaff(role: UserRole): boolean {
  return role === ROLES.MASTER || role === ROLES.OWNER;
}

// Проверка, является ли пользователь владельцем
export function isOwner(role: UserRole): boolean {
  return role === ROLES.OWNER;
}

// Middleware для проверки авторизации
export function requireAuth(
  handler: (request: NextRequest, user: any) => Promise<NextResponse>
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return handler(request, user);
  };
}

// Middleware для проверки роли
export function requireRole(
  requiredRole: UserRole | UserRole[],
  handler: (request: NextRequest, user: any) => Promise<NextResponse>
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    if (!roles.includes(user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return handler(request, user);
  };
}

// Middleware для проверки права доступа
export function requirePermission(
  permission: string,
  handler: (request: NextRequest, user: any) => Promise<NextResponse>
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!hasPermission(user.role, permission)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return handler(request, user);
  };
}
