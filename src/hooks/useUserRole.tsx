import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export type AppRole = "admin" | "property_owner" | "tenant";

export const useUserRole = () => {
  const { user } = useAuth();
  const [role, setRole] = useState<AppRole | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRole = async () => {
      if (!user) {
        setRole(null);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .single();

      if (error) {
        console.error("Error fetching user role:", error);
        setRole("tenant"); // Default to tenant
      } else {
        setRole(data.role as AppRole);
      }
      setLoading(false);
    };

    fetchRole();
  }, [user]);

  const isPropertyOwner = role === "property_owner" || role === "admin";
  const isTenant = role === "tenant";
  const isAdmin = role === "admin";

  return { role, loading, isPropertyOwner, isTenant, isAdmin };
};
