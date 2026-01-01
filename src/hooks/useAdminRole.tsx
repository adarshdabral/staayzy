import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export type AdminRole = 
  | "super_admin"
  | "platform_admin"
  | "finance_admin"
  | "verification_admin"
  | "city_admin"
  | "service_marketplace_admin"
  | "community_moderator"
  | "support_admin";

const ROLE_HIERARCHY: Record<AdminRole, number> = {
  super_admin: 8,
  platform_admin: 7,
  finance_admin: 6,
  verification_admin: 5,
  city_admin: 4,
  service_marketplace_admin: 3,
  community_moderator: 2,
  support_admin: 1,
};

export const useAdminRole = () => {
  const { user } = useAuth();
  const [adminRole, setAdminRole] = useState<AdminRole | null>(null);
  const [assignedCity, setAssignedCity] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (!user) {
      setAdminRole(null);
      setIsAdmin(false);
      setLoading(false);
      return;
    }

    const fetchAdminRole = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("admin_roles")
        .select("admin_role, assigned_city")
        .eq("user_id", user.id)
        .order("admin_role")
        .limit(1);

      if (error) {
        console.error("Admin role fetch error:", error);
        setAdminRole(null);
        setIsAdmin(false);
      } else if (!data || data.length === 0) {
        setAdminRole(null);
        setIsAdmin(false);
      } else {
        // Get the highest role if user has multiple
        const highestRole = data.reduce((prev, curr) => {
          const prevLevel = ROLE_HIERARCHY[prev.admin_role as AdminRole] || 0;
          const currLevel = ROLE_HIERARCHY[curr.admin_role as AdminRole] || 0;
          return currLevel > prevLevel ? curr : prev;
        });
        
        setAdminRole(highestRole.admin_role as AdminRole);
        setAssignedCity(highestRole.assigned_city);
        setIsAdmin(true);
      }

      setLoading(false);
    };

    fetchAdminRole();
  }, [user]);

  const hasPermission = (requiredRole: AdminRole): boolean => {
    if (!adminRole) return false;
    return ROLE_HIERARCHY[adminRole] >= ROLE_HIERARCHY[requiredRole];
  };

  return {
    adminRole,
    assignedCity,
    loading,
    isAdmin,
    hasPermission,
    isSuperAdmin: adminRole === "super_admin",
    isPlatformAdmin: hasPermission("platform_admin"),
    isFinanceAdmin: hasPermission("finance_admin"),
    isVerificationAdmin: hasPermission("verification_admin"),
    isCityAdmin: hasPermission("city_admin"),
    isServiceMarketplaceAdmin: hasPermission("service_marketplace_admin"),
    isCommunityModerator: hasPermission("community_moderator"),
    isSupportAdmin: hasPermission("support_admin"),
  };
};
