-- Create promo_codes table for discount codes
CREATE TABLE public.promo_codes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  discount_percent INTEGER NOT NULL CHECK (discount_percent > 0 AND discount_percent <= 100),
  active BOOLEAN NOT NULL DEFAULT true,
  usage_limit INTEGER,
  usage_count INTEGER NOT NULL DEFAULT 0,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.promo_codes ENABLE ROW LEVEL SECURITY;

-- Public can read active promo codes (for validation)
CREATE POLICY "Anyone can validate promo codes"
ON public.promo_codes
FOR SELECT
USING (active = true AND (expires_at IS NULL OR expires_at > now()));

-- Admins can manage promo codes
CREATE POLICY "Admins can insert promo codes"
ON public.promo_codes
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update promo codes"
ON public.promo_codes
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete promo codes"
ON public.promo_codes
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Add promo_code field to booking_requests
ALTER TABLE public.booking_requests
ADD COLUMN promo_code TEXT,
ADD COLUMN discount_percent INTEGER DEFAULT 0,
ADD COLUMN final_price INTEGER;

-- Create trigger for updated_at
CREATE TRIGGER update_promo_codes_updated_at
BEFORE UPDATE ON public.promo_codes
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();