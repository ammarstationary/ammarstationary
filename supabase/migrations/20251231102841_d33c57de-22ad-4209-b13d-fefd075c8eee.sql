-- Create storage bucket for card images
INSERT INTO storage.buckets (id, name, public) VALUES ('card-images', 'card-images', true);

-- Allow public read access
CREATE POLICY "Card images are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'card-images');

-- Allow admins to upload images
CREATE POLICY "Admins can upload card images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'card-images' AND has_role(auth.uid(), 'admin'));

-- Allow admins to update images
CREATE POLICY "Admins can update card images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'card-images' AND has_role(auth.uid(), 'admin'));

-- Allow admins to delete images
CREATE POLICY "Admins can delete card images"
ON storage.objects FOR DELETE
USING (bucket_id = 'card-images' AND has_role(auth.uid(), 'admin'));