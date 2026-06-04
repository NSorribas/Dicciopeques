-- Tabla para guardar suscripciones push de los usuarios de la PWA
CREATE TABLE IF NOT EXISTS push_subscriptions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    endpoint TEXT NOT NULL UNIQUE,
    p256dh TEXT NOT NULL,
    auth TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Índice por endpoint para búsquedas rápidas
CREATE INDEX IF NOT EXISTS idx_push_subscriptions_endpoint ON push_subscriptions(endpoint);

-- Trigger para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_push_subscriptions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_push_subscriptions_updated_at ON push_subscriptions;
CREATE TRIGGER trg_push_subscriptions_updated_at
    BEFORE UPDATE ON push_subscriptions
    FOR EACH ROW
    EXECUTE FUNCTION update_push_subscriptions_updated_at();

-- RLS: lectura y escritura para anon (necesario para que la PWA guarde suscripciones)
ALTER TABLE push_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous insert" ON push_subscriptions
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow anonymous delete" ON push_subscriptions
    FOR DELETE USING (true);

CREATE POLICY "Allow anonymous select" ON push_subscriptions
    FOR SELECT USING (true);

-- GRANTs necesarios para que el rol anon pueda acceder (requerido por Supabase REST API)
GRANT SELECT ON public.push_subscriptions TO anon;
GRANT INSERT ON public.push_subscriptions TO anon;
GRANT DELETE ON public.push_subscriptions TO anon;
GRANT SELECT ON public.push_subscriptions TO authenticated;
GRANT INSERT ON public.push_subscriptions TO authenticated;
GRANT DELETE ON public.push_subscriptions TO authenticated;
