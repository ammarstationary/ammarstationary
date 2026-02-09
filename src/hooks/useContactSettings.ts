import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface ContactSetting {
  id: string;
  key: string;
  value: string;
  updated_at: string;
}

export function useContactSettings() {
  return useQuery({
    queryKey: ['contact_settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('contact_settings')
        .select('*');
      
      if (error) throw error;
      
      const settings: Record<string, string> = {};
      (data as ContactSetting[]).forEach(item => {
        settings[item.key] = item.value;
      });
      return settings;
    },
  });
}

export function useUpdateContactSetting() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ key, value }: { key: string; value: string }) => {
      const { data, error } = await supabase
        .from('contact_settings')
        .update({ value, updated_at: new Date().toISOString() })
        .eq('key', key)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contact_settings'] });
    },
  });
}
