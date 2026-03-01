"use client";

import { useEffect, useState, useCallback } from "react";
import { UserRole, ROLES } from "@/types/roles";

interface User {
  id: string;
  email: string;
  name: string | null;
  role: UserRole;
}

interface UseAuthReturn {
  user: User | null;
  loading: boolean;
  isLoggedIn: boolean;
  isMaster: boolean;
  isOwner: boolean;
  isStaff: boolean;
  hasPermission: (permission: string) => boolean;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    // Берем данные из localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
      } catch (error) {
        console.error("Error parsing stored user:", error);
        setUser(null);
      }
    } else {
      setUser(null);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchUser();
    
    // Слушаем изменения авторизации
    const handleAuthChange = () => {
      fetchUser();
    };
    
    window.addEventListener("auth-change", handleAuthChange);
    return () => {
      window.removeEventListener("auth-change", handleAuthChange);
    };
  }, [fetchUser]);

  const isMaster = user?.role === ROLES.MASTER;
  const isOwner = user?.role === ROLES.OWNER;
  const isStaff = isMaster || isOwner;

  const hasPermission = useCallback(
    (permission: string): boolean => {
      if (!user) return false;

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

      return permissions[user.role]?.includes(permission) ?? false;
    },
    [user]
  );

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setUser(null);
    window.dispatchEvent(new Event("storage"));
  }, []);

  return {
    user,
    loading,
    isLoggedIn: !!user,
    isMaster,
    isOwner,
    isStaff,
    hasPermission,
    logout,
    refreshUser: fetchUser,
  };
}
