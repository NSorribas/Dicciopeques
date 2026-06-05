// DiccioPeques — Edge Function: OG Share Router
// ?word=petricor             → bots: HTML with OG tags | humans: 302 redirect
// ?word=petricor&render=true → dynamic PNG image (1200x630)

import { ImageResponse } from 'https://deno.land/x/og_edge@0.0.4/mod.ts'

const SB_URL = Deno.env.get('SB_URL') ?? ''
const SB_ANON_KEY = Deno.env.get('SB_ANON_KEY') ?? ''
const APP_URL = 'https://nsorribas.github.io/Dicciopeques/'
const FUNCTION_URL = 'https://leivaafvepovjrkzntxr.supabase.co/functions/v1/og-image'

// --- Crawler detection ---
const BOT_PATTERN = /bot|crawler|spider|facebookexternalhit|facebot|facebookbot|twitterbot|linkedinbot|linkedinapp|whatsapp|telegram|discord|slack|pinterest|skype|reddit|opengraph|og-scraper|validator|debugger|scrape|preview|fetch/i

function isBot(userAgent: string): boolean {
  return BOT_PATTERN.test(userAgent)
}

// --- Fetch word from Supabase ---
async function fetchWord(word: string) {
  try {
    const res = await fetch(
      `${SB_URL}/rest/v1/palabras?palabra=eq.${encodeURIComponent(word)}&select=palabra,categoria,definiciones(numero,texto)&definiciones.order=numero.asc&limit=1`,
      {
        headers: {
          apikey: SB_ANON_KEY,
          Authorization: `Bearer ${SB_ANON_KEY}`
        }
      }
    )
    const data = await res.json()
    if (data && data.length > 0) return data[0]
  } catch (e) {
    console.error('Error fetching word:', e)
  }
  return null
}

// --- HTML escape ---
function esc(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

// --- Main handler ---
Deno.serve(async (req: Request) => {
  const url = new URL(req.url)
  const word = url.searchParams.get('word')?.trim()

  if (!word) {
    return Response.redirect(APP_URL, 302)
  }

  // Fetch word data (needed for all branches)
  const palabra = await fetchWord(word)

  const wordData = palabra || {
    palabra: word,
    categoria: '',
    definiciones: [{ texto: 'Palabra no encontrada en el diccionario.' }],
  }

  const categoria = wordData.categoria || ''
  const definicion = (wordData.definiciones && wordData.definiciones.length > 0)
    ? wordData.definiciones[0].texto
    : ''
  const shortDef = definicion.length > 200
    ? definicion.substring(0, 197) + '...'
    : definicion

  // ==========================================
  // BRANCH A: Render the actual PNG image
  // ==========================================
  const isImageRequest = url.searchParams.get('render') === 'true'

  if (isImageRequest) {
    try {
      return new ImageResponse(
        {
          type: 'div',
          props: {
            style: {
              width: '100%',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              backgroundColor: '#0f0f1a',
              padding: '90px',
              fontFamily: 'sans-serif',
            },
            children: [
              // Logo row
              {
                type: 'div',
                props: {
                  style: { display: 'flex', alignItems: 'center', marginBottom: '32px', gap: '14px' },
                  children: [
                    {
                      type: 'div',
                      props: {
                        style: {
                          width: '44px', height: '44px', backgroundColor: '#d4a843',
                          borderRadius: '10px', display: 'flex', alignItems: 'center',
                          justifyContent: 'center', color: '#0f0f1a', fontSize: '24px', fontWeight: 700,
                        },
                        children: 'D',
                      },
                    },
                    {
                      type: 'div',
                      props: {
                        style: { color: '#d4a843', fontSize: '24px', fontWeight: 700, letterSpacing: '1px' },
                        children: 'DiccioPeques',
                      },
                    },
                  ],
                },
              },
              // Accent line
              {
                type: 'div',
                props: {
                  style: { width: '60px', height: '4px', backgroundColor: '#d4a843', borderRadius: '2px', marginBottom: '32px' },
                },
              },
              // The word + category
              {
                type: 'div',
                props: {
                  style: { display: 'flex', alignItems: 'baseline', marginBottom: '16px', gap: '20px' },
                  children: [
                    {
                      type: 'div',
                      props: {
                        style: { fontSize: '72px', fontWeight: 700, color: '#f0f0f0', lineHeight: 1.1 },
                        children: wordData.palabra,
                      },
                    },
                    categoria ? {
                      type: 'div',
                      props: {
                        style: { fontSize: '26px', fontStyle: 'italic', color: '#d4a843' },
                        children: categoria + '.',
                      },
                    } : null,
                  ].filter(Boolean),
                },
              },
              // Divider
              {
                type: 'div',
                props: {
                  style: { width: '100%', height: '2px', backgroundColor: '#1e293b', marginBottom: '32px' },
                },
              },
              // Definition
              {
                type: 'div',
                props: {
                  style: { fontSize: '32px', lineHeight: 1.6, color: '#cbd5e1', maxWidth: '1020px', overflow: 'hidden' },
                  children: shortDef,
                },
              },
              // Footer branding
              {
                type: 'div',
                props: {
                  style: {
                    position: 'absolute', bottom: '50px', right: '90px',
                    fontSize: '20px', color: '#64748b', letterSpacing: '2px',
                    textTransform: 'uppercase' as const,
                  },
                  children: 'DiccioPeques',
                },
              },
            ],
          },
        },
        {
          width: 1200,
          height: 630,
          headers: {
            'Cache-Control': 'public, max-age=604800, s-maxage=604800, stale-while-revalidate=86400',
          },
        }
      )
    } catch (error: any) {
      console.error('Error generating image:', error?.message || error)
      return Response.redirect(APP_URL + 'assets/icons/icon-512x512.png', 302)
    }
  }

  // ==========================================
  // BRANCH B: Bot vs Human detection
  // ==========================================
  const userAgent = req.headers.get('user-agent') || ''
  const shareUrl = APP_URL + '#' + encodeURIComponent(word)
  const ogImageUrl = FUNCTION_URL + '?word=' + encodeURIComponent(wordData.palabra) + '&render=true'

  if (isBot(userAgent)) {
    // Return bare HTML with OG meta tags for the scraper
    const title = 'DiccioPeques - ' + wordData.palabra
    const description = wordData.palabra + (categoria ? ' (' + categoria + ')' : '') + ': ' + definicion

    const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <title>${esc(title)}</title>

  <meta property="og:type" content="article">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(description.substring(0, 200))}">
  <meta property="og:image" content="${ogImageUrl}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="${esc(title)}">
  <meta property="og:url" content="${esc(FUNCTION_URL + '?word=' + encodeURIComponent(wordData.palabra))}">
  <meta property="og:site_name" content="DiccioPeques">
  <meta property="og:locale" content="es_ES">

  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${esc(title)}">
  <meta name="twitter:description" content="${esc(description.substring(0, 200))}">
  <meta name="twitter:image" content="${ogImageUrl}">
</head>
<body>
  <h1>${esc(wordData.palabra)}</h1>
  <p>${esc(description)}</p>
</body>
</html>`

    return new Response(html, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, s-maxage=3600',
      },
    })
  }

  // Human visitor: redirect to GitHub Pages
  return Response.redirect(shareUrl, 302)
})
