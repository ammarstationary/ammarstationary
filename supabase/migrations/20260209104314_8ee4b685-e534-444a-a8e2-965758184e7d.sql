
-- Create contact_settings table for admin-editable contact page
CREATE TABLE public.contact_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text NOT NULL UNIQUE,
  value text NOT NULL,
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.contact_settings ENABLE ROW LEVEL SECURITY;

-- Anyone can read contact settings
CREATE POLICY "Contact settings are publicly readable"
  ON public.contact_settings FOR SELECT
  USING (true);

-- Admins can manage contact settings
CREATE POLICY "Admins can insert contact settings"
  ON public.contact_settings FOR INSERT
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update contact settings"
  ON public.contact_settings FOR UPDATE
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete contact settings"
  ON public.contact_settings FOR DELETE
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Insert default contact settings
INSERT INTO public.contact_settings (key, value) VALUES
  ('instagram_handle', '@scardingzindia'),
  ('instagram_url', 'https://instagram.com/scardingzindia'),
  ('email', 'scardingzindia@duck.com'),
  ('location', 'Based in India • In-person transactions only'),
  ('response_time', 'We typically respond within 24 hours');
