// DiccioPeques — Edge Function: OG Tag Preview
// SIEMPRE devuelve HTML con OG tags (para crawlers y validadores)
// + meta refresh para redirigir usuarios reales a la app
// URL: https://leivaafvepovjrkzntxr.supabase.co/functions/v1/share?word=petricor

const SB_URL = Deno.env.get('SB_URL') ?? ''
const SB_ANON_KEY = Deno.env.get('SB_ANON_KEY') ?? ''

const APP_URL = 'https://nsorribas.github.io/Dicciopeques/'
const FUNCTION_URL = 'https://leivaafvepovjrkzntxr.supabase.co/functions/v1/share'

Deno.serve(async (req: Request) => {
  const url = new URL(req.url)
  const word = url.searchParams.get('word')

  // Si no hay palabra, redirigir a la app
  if (!word) {
    return Response.redirect(APP_URL, 302)
  }

  // Buscar la palabra en Supabase
  let palabra: { palabra: string; categoria: string; definiciones: { numero: number; texto: string }[] } | null = null
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
    if (data && data.length > 0) {
      palabra = data[0]
    }
  } catch (e) {
    console.error('Error fetching word:', e)
  }

  // Si no se encuentra, redirigir a la app
  if (!palabra) {
    return Response.redirect(APP_URL, 302)
  }

  const title = 'DiccioPeques - ' + palabra.palabra
  const categoria = palabra.categoria || ''
  const definicion = (palabra.definiciones && palabra.definiciones.length > 0)
    ? palabra.definiciones[0].texto
    : ''
  const description = palabra.palabra + ' (' + categoria + '): ' + definicion
  const canonicalUrl = FUNCTION_URL + '?word=' + encodeURIComponent(palabra.palabra)
  const shareUrl = APP_URL + '#' + encodeURIComponent(palabra.palabra)
  const iconUrl = APP_URL + 'assets/icons/icon-512x512.png'

  // SIEMPRE servir HTML con OG tags + meta refresh para redirigir
  const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${esc(title)}</title>

  <!-- Open Graph -->
  <meta property="og:type" content="article">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(description)}">
  <meta property="og:image" content="${iconUrl}">
  <meta property="og:image:width" content="512">
  <meta property="og:image:height" content="512">
  <meta property="og:image:alt" content="${esc(title)}">
  <meta property="og:url" content="${esc(canonicalUrl)}">
  <meta property="og:site_name" content="DiccioPeques">
  <meta property="og:locale" content="es_ES">

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary">
  <meta name="twitter:title" content="${esc(title)}">
  <meta name="twitter:description" content="${esc(description)}">
  <meta name="twitter:image" content="${iconUrl}">
  <meta name="twitter:image:alt" content="${esc(title)}">

  <!-- Redirigir al usuario real a la app (no usa JS, no lo bloquea CSP) -->
  <meta http-equiv="refresh" content="0;url=${esc(shareUrl)}">
  <link rel="canonical" href="${esc(canonicalUrl)}">
</head>
<body>
  <h1>${esc(palabra.palabra)}</h1>
  <p>${esc(description)}</p>
  <p><a href="${esc(shareUrl)}">Abrir en DiccioPeques</a></p>
</body>
</html>`

  return new Response(html, {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600'
    }
  })
})

function esc(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}
