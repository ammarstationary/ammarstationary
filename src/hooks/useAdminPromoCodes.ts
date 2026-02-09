import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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

export interface PromoCodeInsert {
  code: string;
  discount_percent: number;
  active?: boolean;
  usage_limit?: number | null;
  expires_at?: string | null;
}

export function usePromoCodes() {
  return useQuery({
    queryKey: ['promo-codes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('promo_codes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as PromoCode[];
    },
  });
}

export function useCreatePromoCode() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (promoCode: PromoCodeInsert) => {
      const { data, error } = await supabase
        .from('promo_codes')
        .insert([{ ...promoCode, code: promoCode.code.toUpperCase().trim() }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['promo-codes'] });
      toast({ title: 'Promo code created successfully' });
    },
    onError: (error: any) => {
      toast({
        title: 'Error creating promo code',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

export function useUpdatePromoCode() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<PromoCode> & { id: string }) => {
      const { data, error } = await supabase
        .from('promo_codes')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['promo-codes'] });
      toast({ title: 'Promo code updated' });
    },
    onError: (error: any) => {
      toast({
        title: 'Error updating promo code',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

export function useDeletePromoCode() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('promo_codes')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['promo-codes'] });
      toast({ title: 'Promo code deleted' });
    },
    onError: (error: any) => {
      toast({
        title: 'Error deleting promo code',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}
