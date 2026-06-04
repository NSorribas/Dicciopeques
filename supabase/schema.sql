-- ============================================================
-- DiccioPeques - Schema para Supabase
-- Ejecutar en el SQL Editor del dashboard de Supabase
-- ============================================================

-- ============================================================
-- 1. CREAR TABLAS
-- ============================================================

-- Tabla principal de palabras
CREATE TABLE IF NOT EXISTS palabras (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    palabra TEXT NOT NULL,
    categoria TEXT NOT NULL,
    silabas TEXT,
    pronunciacion TEXT,
    origen TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(palabra)
);

-- Tabla de definiciones (relación 1:N con palabras)
CREATE TABLE IF NOT EXISTS definiciones (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    palabra_id BIGINT NOT NULL REFERENCES palabras(id) ON DELETE CASCADE,
    numero INTEGER NOT NULL,
    texto TEXT NOT NULL,
    ejemplo TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Tabla de sinónimos (relación 1:N con palabras)
CREATE TABLE IF NOT EXISTS sinonimos (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    palabra_id BIGINT NOT NULL REFERENCES palabras(id) ON DELETE CASCADE,
    sinonimo TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- 2. ÍNDICES para performance
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_palabras_letra ON palabras (LOWER(LEFT(palabra, 1)));
CREATE INDEX IF NOT EXISTS idx_palabras_categoria ON palabras (categoria);
CREATE INDEX IF NOT EXISTS idx_definiciones_palabra ON definiciones (palabra_id);
CREATE INDEX IF NOT EXISTS idx_sinonimos_palabra ON sinonimos (palabra_id);

-- ============================================================
-- 3. FUNCIÓN para actualizar updated_at automáticamente
-- ============================================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER palabras_updated_at
    BEFORE UPDATE ON palabras
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- 4. HABILITAR RLS (Row Level Security)
-- ============================================================

ALTER TABLE palabras ENABLE ROW LEVEL SECURITY;
ALTER TABLE definiciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE sinonimos ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- 5. POLÍTICAS RLS
-- ============================================================

-- Lectura pública (anon + authenticated pueden leer todo)
CREATE POLICY "Lectura pública palabras" ON palabras
    FOR SELECT USING (true);

CREATE POLICY "Lectura pública definiciones" ON definiciones
    FOR SELECT USING (true);

CREATE POLICY "Lectura pública sinonimos" ON sinonimos
    FOR SELECT USING (true);

-- Escritura solo para usuarios autenticados
-- (por ahora también permitimos anon para el PoC del admin)
-- TODO: Remover las políticas de escritura para anon cuando se implemente auth

CREATE POLICY "Escritura anon palabras" ON palabras
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Escritura anon definiciones" ON definiciones
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Escritura anon sinonimos" ON sinonimos
    FOR ALL USING (true) WITH CHECK (true);

-- ============================================================
-- 6. GRANTs explícitos (requerido por el cambio de May 2026)
-- ============================================================

-- Permisos para anon (lectura + escritura temporal para admin PoC)
GRANT SELECT, INSERT, UPDATE, DELETE ON palabras TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON definiciones TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON sinonimos TO anon;

-- Permisos para authenticated
GRANT SELECT, INSERT, UPDATE, DELETE ON palabras TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON definiciones TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON sinonimos TO authenticated;

-- Permisos sobre secuencias (necesario para INSERT con GENERATED ALWAYS AS IDENTITY)
GRANT USAGE, SELECT ON SEQUENCE palabras_id_seq TO anon;
GRANT USAGE, SELECT ON SEQUENCE palabras_id_seq TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE definiciones_id_seq TO anon;
GRANT USAGE, SELECT ON SEQUENCE definiciones_id_seq TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE sinonimos_id_seq TO anon;
GRANT USAGE, SELECT ON SEQUENCE sinonimos_id_seq TO authenticated;

-- ============================================================
-- 7. DATOS INICIALES (seed desde diccionario.json)
-- ============================================================
-- NOTA: Los datos se insertarán desde el panel admin o mediante
-- un script de seed separado para no duplicar datos.
