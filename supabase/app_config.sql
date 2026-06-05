-- Tabla para guardar configuración sensible de la app (tokens, etc.)
-- Solo accesible para usuarios autenticados (admins)
CREATE TABLE IF NOT EXISTS app_config (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Trigger para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_app_config_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_app_config_updated_at ON app_config;
CREATE TRIGGER trg_app_config_updated_at
    BEFORE UPDATE ON app_config
    FOR EACH ROW
    EXECUTE FUNCTION update_app_config_updated_at();

-- RLS: solo usuarios autenticados pueden leer; solo admins pueden escribir
ALTER TABLE app_config ENABLE ROW LEVEL SECURITY;

-- Los usuarios autenticados (admins) pueden leer la config
CREATE POLICY "Allow authenticated select" ON app_config
    FOR SELECT USING (auth.role() = 'authenticated');

-- Los usuarios autenticados pueden insertar
CREATE POLICY "Allow authenticated insert" ON app_config
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Los usuarios autenticados pueden actualizar
CREATE POLICY "Allow authenticated update" ON app_config
    FOR UPDATE USING (auth.role() = 'authenticated');

-- GRANTs necesarios para que el rol authenticated pueda acceder (requerido por Supabase REST API)
GRANT SELECT ON public.app_config TO authenticated;
GRANT INSERT ON public.app_config TO authenticated;
GRANT UPDATE ON public.app_config TO authenticated;

-- Insertar el token de GitHub (reemplazar por el token real)
-- INSERT INTO app_config (key, value, description) VALUES
-- ('github_token', 'TU_TOKEN_AQUI', 'Token de GitHub para disparar workflows desde el admin');
