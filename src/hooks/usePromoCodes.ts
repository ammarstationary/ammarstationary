import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface PromoCode {
  id: string;
  code: string;
  discount_percent: number;
  active: boolean;
  usage_limit: number | null;
  usage_count: number;
  expires_at: string | null;
  created_at: string;
  updated_at: string;
}

export function useValidatePromoCode(code: string | null) {
  return useQuery({
    queryKey: ["promo-code", code],
    queryFn: async () => {
      if (!code || code.trim() === "") return null;
      
      const { data, error } = await supabase
        .from("promo_codes")
        .select("*")
        .eq("code", code.toUpperCase().trim())
        .eq("active", true)
        .single();

      if (error) {
        if (error.code === "PGRST116") {
          // No matching promo code found
          return null;
        }
        throw error;
      }

      // Check if usage limit is reached
      if (data.usage_limit !== null && data.usage_count >= data.usage_limit) {
        return null;
      }

      return data as PromoCode;
    },
    enabled: !!code && code.trim().length > 0,
    staleTime: 30000, // Cache for 30 seconds
  });
}
