-- ============================================================
-- DiccioPeques - Migración: Restringir escritura a authenticated
-- Ejecutar en el SQL Editor del dashboard de Supabase
--
-- ANTES de ejecutar esto, verificar que:
-- 1. Ya creaste los usuarios en Authentication > Users
-- 2. Los usuarios pueden loguearse correctamente
-- 3. El admin.html funciona con auth
--
-- DESPUÉS de ejecutar esto:
-- - El diccionario público (index.html) sigue funcionando (lectura anon)
-- - El admin (admin.html) requiere login para escribir (authenticated)
-- - Nadie puede crear/modificar/eliminar palabras sin estar logueado
-- ============================================================

-- ============================================================
-- 1. ELIMINAR políticas de escritura para anon
-- ============================================================

-- Drop policies de escritura anon existentes
DROP POLICY IF EXISTS "Escritura anon palabras" ON palabras;
DROP POLICY IF EXISTS "Escritura anon definiciones" ON definiciones;
DROP POLICY IF EXISTS "Escritura anon sinonimos" ON sinonimos;

-- ============================================================
-- 2. CREAR políticas de escritura solo para authenticated
-- ============================================================

-- Palabras: INSERT, UPDATE, DELETE solo para usuarios autenticados
CREATE POLICY "Escritura authenticated palabras" ON palabras
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Definiciones: INSERT, UPDATE, DELETE solo para usuarios autenticados
CREATE POLICY "Escritura authenticated definiciones" ON definiciones
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Sinónimos: INSERT, UPDATE, DELETE solo para usuarios autenticados
CREATE POLICY "Escritura authenticated sinonimos" ON sinonimos
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- ============================================================
-- 3. REVOCAR permisos de escritura de anon
-- ============================================================

-- Quitar INSERT, UPDATE, DELETE de anon (dejar solo SELECT)
REVOKE INSERT, UPDATE, DELETE ON palabras FROM anon;
REVOKE INSERT, UPDATE, DELETE ON definiciones FROM anon;
REVOKE INSERT, UPDATE, DELETE ON sinonimos FROM anon;

-- Quitar permisos de secuencias de anon (no necesita crear IDs)
REVOKE USAGE, SELECT ON SEQUENCE palabras_id_seq FROM anon;
REVOKE USAGE, SELECT ON SEQUENCE definiciones_id_seq FROM anon;
REVOKE USAGE, SELECT ON SEQUENCE sinonimos_id_seq FROM anon;

-- ============================================================
-- VERIFICACIÓN: Ejecutar estas queries para confirmar
-- ============================================================
-- SELECT * FROM pg_policies WHERE schemaname = 'public' AND tablename IN ('palabras', 'definiciones', 'sinonimos');
-- Deberías ver:
--   - SELECT policies para anon y authenticated
--   - ALL policies SOLO para authenticated
--   - NO policies de escritura para anon
