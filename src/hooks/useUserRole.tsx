import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export type AppRole = "admin" | "property_owner" | "tenant";

export const useUserRole = () => {
  const { user } = useAuth();
  const [role, setRole] = useState<AppRole | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setRole(null);
      setLoading(false);
      return;
    }

    const fetchRole = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .limit(1);

      if (error) {
        console.error("Role fetch error:", error);
        setRole(null);
      } else if (!data || data.length === 0) {
        setRole("tenant");
      } else {
        setRole(data[0].role as AppRole);
      }

      setLoading(false);
    };

    fetchRole();
  }, [user]);

  return {
    role,
    loading,
    isAdmin: role === "admin",
    isPropertyOwner: role === "property_owner" || role === "admin",
    isTenant: role === "tenant",
  };
};
