import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface BookingRequest {
  id: string;
  card_id: string | null;
  card_name: string;
  card_price: number;
  full_name: string;
  phone: string;
  email: string;
  quantity: number;
  message: string | null;
  status: string;
  promo_code: string | null;
  discount_percent: number | null;
  final_price: number | null;
  created_at: string;
  updated_at: string;
}

export function useBookingRequests() {
  return useQuery({
    queryKey: ['booking-requests'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('booking_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as BookingRequest[];
    },
  });
}

export function useCreateBookingRequest() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (request: {
      card_id?: string;
      card_name: string;
      card_price: number;
      full_name: string;
      phone: string;
      email: string;
      quantity: number;
      message?: string;
      promo_code?: string;
      discount_percent?: number;
      final_price?: number;
    }) => {
      const { data, error } = await supabase
        .from('booking_requests')
        .insert([request])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['booking-requests'] });
      toast({
        title: 'Booking Request Submitted!',
        description: 'Our team will contact you shortly.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

export function useUpdateBookingRequestStatus() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { data, error } = await supabase
        .from('booking_requests')
        .update({ status })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['booking-requests'] });
      toast({ title: 'Status updated' });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

export function useDeleteBookingRequest() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('booking_requests')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['booking-requests'] });
      toast({ title: 'Booking request deleted' });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}
