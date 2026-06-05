<div align="center">

<img src="assets/icons/icon-192x192.png" alt="DiccioPeques" width="90" height="90">

# DiccioPeques

**Diccionario interactivo de palabras en español**

Un proyecto léxico web con definiciones, sinónimos, silabeo automático, pronunciación, compartir con imagen dinámica y notificaciones push diarias. Diseñado como una Progressive Web App moderna, rápida y accesible.

[![Deploy](https://img.shields.io/badge/deploy-GitHub%20Pages-blue?logo=github)](https://nsorribas.github.io/Dicciopeques/)
[![Backend](https://img.shields.io/badge/backend-Supabase-3ECF8E?logo=supabase)](https://supabase.com/)
[![PWA](https://img.shields.io/badge/PWA-Installable-purple?logo=pwa)](https://nsorribas.github.io/Dicciopeques/)

[Ver demo en vivo](https://nsorribas.github.io/Dicciopeques/)

</div>

---

## Características

### Diccionario

- **Búsqueda en tiempo real** — Filtra por palabra, definición o sinónimo con debounce y normalización de acentos
- **Navegación alfabética** — Barra A-Z con scroll a la letra seleccionada y soporte de teclado (flechas, Home, End)
- **Palabra del día** — Destacado automático que cambia diariamente con un algoritmo determinista basado en la fecha
- **Silabeo automático** — Algoritmo de separación silábica para español que maneja diptongos, hiatos, grupos consonánticos y letras mudas (qu, gu)
- **Pronunciación** — Síntesis de voz con Web Speech API, voz en español y velocidad reducida para claridad
- **Favoritos** — Guardado local con persistencia en `localStorage`
- **Palabra aleatoria** — Descubrí vocabulario nuevo con un solo toque
- **Tema oscuro / claro** — Toggle manual con detección de preferencia del sistema y persistencia

### Navegación y compartir

- **Hash routing** — Cada palabra tiene su propia URL (`#petricor`) que funciona con back/forward del navegador y se puede linkear directamente
- **Botón compartir** — Usa Web Share API en móviles y copia al portapapeles en desktop
- **Imagen OG dinámica** — Al compartir un link en redes sociales (Facebook, WhatsApp, Twitter/X), se genera automáticamente una imagen PNG personalizada con la palabra, categoría y definición, usando una Supabase Edge Function con `og_edge` ImageResponse
- **Redireccionamiento inteligente** — Los crawlers de redes reciben HTML con meta tags Open Graph y Twitter Card; los usuarios humanos son redirigidos directamente a la palabra en el diccionario

### PWA y notificaciones

- **Instalable** — Funciona como app nativa en iOS y Android con ícono, splash y pantalla completa
- **Notificaciones push** — Palabra del día automática a las 6:10 PM (hora Argentina) vía GitHub Actions + Web Push
- **Offline** — Service Worker con estrategia cache-first para assets y network-first para datos de Supabase
- **Acciones en notificación** — Botones "Ver palabra" y "Cerrar" directamente desde la notificación

### Panel de administración

- **CRUD completo** — Crear, editar y eliminar palabras con validación de duplicados en tiempo real
- **Eliminación con deshacer** — 10 segundos para cancelar, con barra de progreso visual
- **Importar / Exportar** — Soporte para JSON y XLSX con templates descargables
- **Sugerencia de sinónimos** — Integración con la API de Datamuse para sugerencias en español
- **Dashboard de estadísticas** — Panel lateral con métricas de categorías, totales y distribución
- **Notificaciones de prueba** — Envío manual de push desde el panel para verificar el sistema

### Accesibilidad

- Skip link para navegación por teclado
- Roles ARIA, `aria-live` para resultados dinámicos y `aria-label` en controles interactivos
- Focus trap en modales
- Contraste verificado en ambos temas

---

## Stack tecnológico

| Capa | Tecnología |
|------|-----------|
| Frontend | HTML, CSS, JavaScript vanilla |
| Backend / DB | [Supabase](https://supabase.com/) (PostgreSQL + Auth + REST API) |
| Edge Functions | [Supabase Edge Functions](https://supabase.com/docs/guides/functions) (Deno) — OG dinámico |
| Hosting | [GitHub Pages](https://pages.github.com/) |
| Push notifications | [Web Push](https://github.com/web-push-libs/web-push) + GitHub Actions |
| PWA | Service Worker, Web App Manifest, VAPID |
| OG images | [og_edge](https://github.com/supabase/og_edge) ImageResponse (Deno) |

Sin frameworks, sin bundlers, sin dependencias de runtime en el cliente. Solo la SDK de Supabase cargada desde CDN.

---

## Estructura del proyecto

```
Dicciopeques/
├── index.html                  # SPA principal del diccionario
├── admin.html                  # Panel de administración (requiere auth)
├── manifest.json               # Web App Manifest para PWA
├── sw.js                       # Service Worker (cache + push)
├── assets/
│   ├── app.js                  # Lógica del diccionario (búsqueda, FAB, favoritos, push, compartir)
│   ├── admin.js                # Lógica del panel admin (CRUD, import/export, stats)
│   ├── style.css               # Estilos del diccionario
│   ├── admin.css               # Estilos del panel admin
│   ├── favicon.svg             # Favicon SVG
│   ├── separator.png           # Separador decorativo
│   ├── data/
│   │   └── diccionario.json    # Fallback offline de palabras
│   └── icons/
│       ├── icon-192x192.png    # Ícono PWA 192px
│       ├── icon-512x512.png    # Ícono PWA 512px
│       ├── apple-touch-icon.png
│       ├── favicon-16x16.png
│       └── favicon-32x32.png
├── .github/
│   ├── workflows/
│   │   └── daily-word-push.yml # GitHub Actions: cron 8AM + manual
│   └── scripts/
│       └── send-push.js        # Script Node.js que envía las notificaciones push
└── supabase/
    ├── schema.sql              # Tablas principales + RLS + GRANTs
    ├── push_subscriptions.sql  # Tabla de suscripciones push + RLS + GRANTs
    ├── app_config.sql          # Tabla de configuración (tokens) + RLS
    ├── rls_auth_migration.sql  # Migración de políticas RLS
    ├── seed.sql                # Datos iniciales
    └── functions/
        └── og-image/
            └── index.ts        # Edge Function: OG dinámico + PNG generation
```

---

## Imágenes OG dinámicas

El sistema de compartir en redes sociales funciona con una Supabase Edge Function que tiene dos rutas con URLs limpias (sin query parameters, ya que Discord y X los eliminan):

| URL | Comportamiento |
|-----|---------------|
| `/og-image/render/{palabra}` | Devuelve PNG 1200x630 con la palabra, categoría y definición |
| `/og-image/{palabra}` | Bots: HTML con meta tags OG + Twitter Card · Humanos: 302 redirect al diccionario |

### Cómo funciona

1. El usuario toca "Compartir" en una palabra → se genera el link `https://...supabase.co/functions/v1/og-image/petricor`
2. Cuando un crawler de red social visita el link, recibe HTML con los meta tags Open Graph y Twitter Card, incluyendo `og:image` apuntando a `/og-image/render/petricor`
3. El crawler pide la imagen → la Edge Function genera un PNG dinámico con `og_edge` ImageResponse usando el diseño visual del diccionario (fondo oscuro, tipografía, branding)
4. Cuando un usuario real visita el link, es redirigido con 302 al diccionario con la palabra expandida: `nsorribas.github.io/Dicciopeques/#petricor`
5. Las imágenes PNG se cachean por 7 días en el CDN de Supabase

### Compatibilidad

| Plataforma | Imagen OG |
|------------|----------|
| Facebook | Funciona |
| WhatsApp | Funciona |
| Twitter / X | Funciona |
| Telegram | Funciona |
| Discord | No soporta imágenes dinámicas desde Edge Functions |

---

## Base de datos

El schema de Supabase consta de 4 tablas principales:

```
palabras                    definiciones                  sinonimos
├── id (PK, identity)      ├── id (PK, identity)         ├── id (PK, identity)
├── palabra (unique)        ├── palabra_id (FK → palabras) ├── palabra_id (FK → palabras)
├── categoria               ├── numero                    ├── sinonimo
├── silabas                 ├── texto
├── pronunciacion           ├── ejemplo
├── origen                  └── created_at
├── created_at
└── updated_at

push_subscriptions
├── id (PK, uuid)
├── endpoint (unique)
├── p256dh
├── auth
├── created_at
└── updated_at
```

Todas las tablas tienen Row Level Security (RLS) habilitado con políticas específicas para los roles `anon` y `authenticated`.

---

## Notificaciones push

El flujo completo de notificaciones funciona así:

1. **Suscripción** — El usuario activa la campanita en la PWA → el Service Worker registra la suscripción con VAPID → se guarda en `push_subscriptions` vía upsert
2. **Envío automático** — GitHub Actions ejecuta un cron a las 21:10 UTC (6:10 PM Argentina, horario off-peak) → `send-push.js` obtiene la palabra del día desde Supabase → envía push a todas las suscripciones → elimina las expiradas
3. **Envío manual** — Desde el panel admin se puede disparar un `workflow_dispatch` con mensaje personalizado
4. **Recepción** — El Service Worker muestra la notificación con acciones "Ver palabra" / "Cerrar"

Las claves VAPID se almacenan como secrets de GitHub y nunca se exponen al cliente.

---

## Configuración

### Variables de entorno (GitHub Secrets)

| Secret | Descripción |
|--------|-------------|
| `VAPID_PUBLIC_KEY` | Clave pública VAPID para push notifications |
| `VAPID_PRIVATE_KEY` | Clave privada VAPID |
| `VAPID_SUBJECT` | mailto: URL del emisor de push |
| `SUPABASE_URL` | URL del proyecto Supabase |
| `SUPABASE_ANON_KEY` | Clave anon de Supabase |

### Variables de entorno (Supabase Edge Function secrets)

| Secret | Descripción |
|--------|-------------|
| `SB_URL` | URL del proyecto Supabase (el prefijo `SUPABASE_` está reservado por Supabase) |
| `SB_ANON_KEY` | Clave anon de Supabase |

### Despliegue

1. Crear un proyecto en Supabase y ejecutar los scripts SQL de la carpeta `supabase/` en orden
2. Configurar las secrets en el repositorio de GitHub
3. Habilitar GitHub Pages apuntando a la rama `main`
4. Generar claves VAPID con `npx web-push generate-vapid-keys`
5. Deployar la Edge Function: `supabase functions deploy og-image --no-verify-jwt`
6. Configurar los secrets `SB_URL` y `SB_ANON_KEY` en el dashboard de Supabase (Edge Functions → Secrets)

> **Nota sobre tablas creadas con SQL:** Las tablas creadas desde el SQL Editor de Supabase (a diferencia del dashboard) no reciben GRANTs automáticos para los roles `anon` y `authenticated`. Es necesario ejecutar los GRANTs manualmente tal como están en los scripts de la carpeta `supabase/`.

---

## Atajos de teclado

| Tecla | Acción |
|-------|--------|
| `/` | Enfocar buscador |
| `Enter` / `Espacio` | Expandir tarjeta |
| `←` / `→` | Navegar letras |
| `Home` / `End` | Primera / última letra |
| `↑` / `↓` | Navegar opciones del FAB |
| `Esc` | Cerrar menú / salir |

---

## Licencia

Proyecto privado. Todos los derechos reservados.
