-- Create storage bucket for property images
INSERT INTO storage.buckets (id, name, public)
VALUES ('property-images', 'property-images', true);

-- Allow authenticated users to upload to their own folder
CREATE POLICY "Property owners can upload images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'property-images' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow anyone to view property images (public bucket)
CREATE POLICY "Anyone can view property images"
ON storage.objects FOR SELECT
USING (bucket_id = 'property-images');

-- Allow owners to delete their own images
CREATE POLICY "Property owners can delete their images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'property-images' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow owners to update their own images
CREATE POLICY "Property owners can update their images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'property-images' AND auth.uid()::text = (storage.foldername(name))[1]);