import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Card {
  id: string;
  name: string;
  set_name: string;
  rarity: 'Common' | 'Uncommon' | 'Rare' | 'Ultra Rare' | 'Secret Rare' | 'Grail';
  condition: 'Mint' | 'Near Mint' | 'Excellent' | 'Good' | 'Played';
  price: number;
  image: string;
  images: string[];
  category_id: string | null;
  collector_notes: string | null;
  featured: boolean;
  available: boolean;
  created_at: string;
  updated_at: string;
  category?: { id: string; name: string } | null;
}

export interface CardInsert {
  name: string;
  set_name: string;
  rarity: Card['rarity'];
  condition: Card['condition'];
  price: number;
  image: string;
  images?: string[];
  category_id?: string | null;
  collector_notes?: string | null;
  featured?: boolean;
  available?: boolean;
}

export function useCards() {
  return useQuery({
    queryKey: ['cards'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cards')
        .select('*, category:categories(id, name)')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Card[];
    },
  });
}

export function useCard(id: string) {
  return useQuery({
    queryKey: ['cards', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cards')
        .select('*, category:categories(id, name)')
        .eq('id', id)
        .maybeSingle();
      
      if (error) throw error;
      return data as Card | null;
    },
    enabled: !!id,
  });
}

export function useCreateCard() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (card: CardInsert) => {
      const { data, error } = await supabase
        .from('cards')
        .insert(card)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cards'] });
    },
  });
}

export function useUpdateCard() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Card> & { id: string }) => {
      const { data, error } = await supabase
        .from('cards')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cards'] });
    },
  });
}

export function useDeleteCard() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('cards')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cards'] });
    },
  });
}
