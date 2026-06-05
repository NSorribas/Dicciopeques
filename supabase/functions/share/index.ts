// DiccioPeques — Edge Function: OG Tag Preview
// Genera HTML con Open Graph tags para que las redes sociales
// muestren una preview al compartir un link a una palabra.
// URL: https://leivaafvepovjrkzntxr.supabase.co/functions/v1/share?word=petricor

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'

const SB_URL = Deno.env.get('SB_URL')!
const SB_ANON_KEY = Deno.env.get('SB_ANON_KEY')!

const APP_URL = 'https://nsorribas.github.io/Dicciopeques/'

serve(async (req) => {
  const url = new URL(req.url)
  const word = url.searchParams.get('word')

  // Si no hay palabra, redirigir a la app
  if (!word) {
    return new Response('', {
      status: 302,
      headers: { Location: APP_URL }
    })
  }

  // Buscar la palabra en Supabase
  let palabra = null
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
    return new Response('', {
      status: 302,
      headers: { Location: APP_URL }
    })
  }

  const title = `DiccioPeques \u2014 ${palabra.palabra}`
  const categoria = palabra.categoria || ''
  const definicion = palabra.definiciones && palabra.definiciones.length > 0
    ? palabra.definiciones[0].texto
    : ''
  const description = `${palabra.palabra} (${categoria}): ${definicion}`
  const shareUrl = `${APP_URL}#${encodeURIComponent(palabra.palabra)}`
  const iconUrl = `${APP_URL}assets/icons/icon-512x512.png`

  const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(title)}</title>

  <!-- Open Graph -->
  <meta property="og:type" content="article">
  <meta property="og:title" content="${escapeHtml(title)}">
  <meta property="og:description" content="${escapeHtml(description)}">
  <meta property="og:image" content="${iconUrl}">
  <meta property="og:url" content="${escapeHtml(shareUrl)}">
  <meta property="og:site_name" content="DiccioPeques">
  <meta property="og:locale" content="es_ES">

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary">
  <meta name="twitter:title" content="${escapeHtml(title)}">
  <meta name="twitter:description" content="${escapeHtml(description)}">
  <meta name="twitter:image" content="${iconUrl}">

  <!-- Redirigir al usuario real a la app -->
  <meta http-equiv="refresh" content="0;url=${escapeHtml(shareUrl)}">
</head>
<body>
  <p>Redirigiendo a <a href="${escapeHtml(shareUrl)}">${escapeHtml(title)}</a>...</p>
  <script>window.location.href = '${shareUrl}';</script>
</body>
</html>`

  return new Response(html, {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'public, max-age=3600'
    }
  })
})

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}
