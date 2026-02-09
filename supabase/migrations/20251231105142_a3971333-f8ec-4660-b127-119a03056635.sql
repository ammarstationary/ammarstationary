-- Add images array column to cards table for multiple images
ALTER TABLE public.cards ADD COLUMN images text[] DEFAULT '{}';

-- Migrate existing single image to images array
UPDATE public.cards SET images = ARRAY[image] WHERE image IS NOT NULL AND image != '';