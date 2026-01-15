-- Supabase Storage Security Policies
-- Prevents SVG uploads and enforces safe image types
-- Run these in Supabase Dashboard > Storage > photos bucket > Policies

-- NOTE: These are Supabase Storage policies, not standard PostgreSQL RLS policies
-- They must be created in the Supabase Dashboard UI or via the Supabase management API

-- IMPORTANT: Apply these policies to the 'photos' storage bucket:

-- 1. File Type Restriction Policy
-- Name: "Block SVG uploads - XSS prevention"
-- Definition: Allowed file types
-- Allowed MIME types: image/jpeg, image/png, image/gif, image/webp
-- Block: image/svg+xml, text/svg, application/svg+xml

-- 2. File Size Limit
-- Max file size: 10MB (10485760 bytes)

-- 3. Authenticated Uploads Only
-- Ensure INSERT policy requires authentication:
-- CREATE POLICY "Authenticated users can upload photos"
-- ON storage.objects FOR INSERT
-- TO authenticated
-- WITH CHECK (
--   bucket_id = 'photos'
--   AND auth.uid()::text = (storage.foldername(name))[1]
-- );

-- 4. Public Read Access
-- Allow public to read photos (required for public photo gallery)
-- CREATE POLICY "Anyone can view photos"
-- ON storage.objects FOR SELECT
-- TO public
-- USING (bucket_id = 'photos');

-- =====================================================
-- MANUAL CONFIGURATION REQUIRED
-- =====================================================

-- Because Supabase Storage policies cannot be managed via standard SQL migrations,
-- you must apply these settings manually in the Supabase Dashboard:

-- 1. Navigate to: Dashboard > Storage > photos bucket
-- 2. Click "Policies" tab
-- 3. Verify/create the policies listed above
-- 4. Under bucket settings, set:
--    - Allowed MIME types: image/jpeg, image/png, image/gif, image/webp
--    - File size limit: 10MB
--    - Public bucket: Yes (for public photo gallery)

-- =====================================================
-- SECURITY RATIONALE
-- =====================================================

-- SVG files are XML-based and can contain:
-- - Embedded JavaScript via <script> tags
-- - Event handlers (onclick, onload, etc.)
-- - External resource loading via <use>, <image>, <foreignObject>
-- - Data exfiltration via DNS requests in href attributes

-- By blocking SVG uploads, we prevent stored XSS attacks where malicious
-- SVG files could execute arbitrary JavaScript in the context of our domain
-- when viewed by other users.

-- The client-side validation in PhotoSubmitForm.tsx provides the first layer
-- of defense, but this server-side enforcement is the critical security boundary.

-- =====================================================
-- VERIFICATION
-- =====================================================

-- After applying these policies, test that:
-- 1. Uploading JPG/PNG/GIF/WebP images succeeds
-- 2. Uploading SVG files is rejected with a policy violation error
-- 3. Files larger than 10MB are rejected
-- 4. Unauthenticated users cannot upload files
-- 5. Public users can view/download uploaded photos
