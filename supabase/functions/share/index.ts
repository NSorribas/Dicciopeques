// DiccioPeques — Edge Function: Dynamic OG Image + Tag Preview
// ?word=petricor         → crawlers: HTML with OG tags | users: 302 redirect
// ?word=petricor&img=1   → dynamic SVG image (1200x630)

const SB_URL = Deno.env.get('SB_URL') ?? ''
const SB_ANON_KEY = Deno.env.get('SB_ANON_KEY') ?? ''
const APP_URL = 'https://nsorribas.github.io/Dicciopeques/'
const FUNCTION_URL = 'https://leivaafvepovjrkzntxr.supabase.co/functions/v1/share'

// --- Crawler detection ---
const CRAWLER_SUBSTRINGS = [
  'facebookexternalhit', 'Facebot', 'facebookbot',
  'Twitterbot', 'twittercard',
  'linkedinbot', 'LinkedInApp',
  'WhatsApp', 'WhatsAppBot',
  'TelegramBot', 'telegram',
  'discordbot', 'Discord',
  'Slackbot', 'Slack-LinkExpanding',
  'Googlebot', 'bingbot',
  'opengraph', 'og-scraper',
  'validator', 'debugger',
  'bot', 'crawler', 'spider',
  'scrape', 'preview',
  'SkypeUriPreview', 'Pinterestbot', 'redditbot',
]

function isCrawler(userAgent: string): boolean {
  const ua = userAgent.toLowerCase()
  if (ua.includes('mozilla/') && !ua.includes('bot') && !ua.includes('crawler') && !ua.includes('spider')) {
    return false
  }
  return CRAWLER_SUBSTRINGS.some(p => ua.includes(p.toLowerCase()))
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

// --- Generate SVG image ---
function generateSVG(palabra: string, categoria: string, definicion: string): string {
  // Truncate for image
  const shortDef = definicion.length > 150
    ? definicion.substring(0, 147) + '...'
    : definicion

  // XML-escape text for SVG
  const esc = (s: string) => s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <radialGradient id="glow1" cx="20%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#d4a843" stop-opacity="0.08"/>
      <stop offset="100%" stop-color="#d4a843" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="glow2" cx="80%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#d4a843" stop-opacity="0.05"/>
      <stop offset="100%" stop-color="#d4a843" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <!-- Background -->
  <rect width="1200" height="630" fill="#0f0f1a"/>
  <rect width="1200" height="630" fill="url(#glow1)"/>
  <rect width="1200" height="630" fill="url(#glow2)"/>

  <!-- Logo mark -->
  <rect x="80" y="60" width="42" height="42" rx="10" fill="#d4a843"/>
  <text x="101" y="91" font-family="system-ui, sans-serif" font-size="22" font-weight="700" fill="#0f0f1a" text-anchor="middle">D</text>
  <text x="140" y="92" font-family="system-ui, sans-serif" font-size="22" font-weight="700" fill="#d4a843" letter-spacing="1">DiccioPeques</text>

  <!-- Accent line -->
  <rect x="80" y="130" width="60" height="4" rx="2" fill="#d4a843"/>

  <!-- The word -->
  <text x="80" y="220" font-family="system-ui, sans-serif" font-size="72" font-weight="700" fill="#f0f0f0">${esc(palabra)}</text>

  <!-- Category badge -->
  <rect x="80" y="245" width="${categoria.length * 13 + 40}" height="36" rx="18" fill="rgba(212,168,67,0.15)" stroke="rgba(212,168,67,0.3)" stroke-width="1"/>
  <text x="${80 + (categoria.length * 13 + 40) / 2}" y="269" font-family="system-ui, sans-serif" font-size="16" font-weight="600" fill="#d4a843" text-anchor="middle">${esc(categoria)}</text>

  <!-- Definition (wrapped) -->
  <text x="80" y="330" font-family="system-ui, sans-serif" font-size="26" font-weight="400" fill="#b0b0b0">
    <tspan x="80" dy="0">${esc(wrapText(shortDef, 55).line1)}</tspan>
    <tspan x="80" dy="40">${esc(wrapText(shortDef, 55).line2)}</tspan>
    <tspan x="80" dy="40">${esc(wrapText(shortDef, 55).line3)}</tspan>
  </text>

  <!-- Bottom decoration -->
  <rect x="80" y="560" width="40" height="3" rx="1.5" fill="#d4a843" opacity="0.4"/>
  <text x="136" y="566" font-family="system-ui, sans-serif" font-size="14" fill="#666">nsorribas.github.io/Dicciopeques</text>
</svg>`
}

// Simple text wrapper for SVG
function wrapText(text: string, maxChars: number): { line1: string; line2: string; line3: string } {
  if (text.length <= maxChars) {
    return { line1: text, line2: '', line3: '' }
  }
  // Try to break at space
  let break1 = text.lastIndexOf(' ', maxChars)
  if (break1 === -1) break1 = maxChars
  const line1 = text.substring(0, break1)
  const rest1 = text.substring(break1 + 1)

  if (rest1.length <= maxChars) {
    return { line1, line2: rest1, line3: '' }
  }
  let break2 = rest1.lastIndexOf(' ', maxChars)
  if (break2 === -1) break2 = maxChars
  const line2 = rest1.substring(0, break2)
  const line3 = rest1.substring(break2 + 1)

  return { line1, line2, line3 }
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
  const word = url.searchParams.get('word')
  const isImageRequest = url.searchParams.get('img') === '1'

  if (!word) {
    return Response.redirect(APP_URL, 302)
  }

  // Image request: generate dynamic SVG
  if (isImageRequest) {
    const palabra = await fetchWord(word)
    if (!palabra) return Response.redirect(APP_URL + 'assets/icons/icon-512x512.png', 302)

    const categoria = palabra.categoria || ''
    const definicion = (palabra.definiciones && palabra.definiciones.length > 0)
      ? palabra.definiciones[0].texto
      : ''

    const svg = generateSVG(palabra.palabra, categoria, definicion)
    return new Response(svg, {
      status: 200,
      headers: {
        'Content-Type': 'image/svg+xml; charset=utf-8',
        'Cache-Control': 'public, s-maxage=86400',
      },
    })
  }

  const shareUrl = APP_URL + '#' + encodeURIComponent(word)

  // Non-crawler: redirect to app
  const userAgent = req.headers.get('user-agent') || ''
  if (!isCrawler(userAgent)) {
    return Response.redirect(shareUrl, 302)
  }

  // Crawler: fetch word and serve OG HTML
  const palabra = await fetchWord(word)
  if (!palabra) return Response.redirect(APP_URL, 302)

  const title = 'DiccioPeques - ' + palabra.palabra
  const categoria = palabra.categoria || ''
  const definicion = (palabra.definiciones && palabra.definiciones.length > 0)
    ? palabra.definiciones[0].texto
    : ''
  const description = palabra.palabra + ' (' + categoria + '): ' + definicion
  const canonicalUrl = FUNCTION_URL + '?word=' + encodeURIComponent(palabra.palabra)
  const imageUrl = FUNCTION_URL + '?word=' + encodeURIComponent(palabra.palabra) + '&img=1'

  const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${esc(title)}</title>

  <meta property="og:type" content="article">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(description)}">
  <meta property="og:image" content="${imageUrl}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="${esc(title)}">
  <meta property="og:url" content="${esc(canonicalUrl)}">
  <meta property="og:site_name" content="DiccioPeques">
  <meta property="og:locale" content="es_ES">

  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${esc(title)}">
  <meta name="twitter:description" content="${esc(description)}">
  <meta name="twitter:image" content="${imageUrl}">
  <meta name="twitter:image:alt" content="${esc(title)}">
</head>
<body>
  <h1>${esc(palabra.palabra)}</h1>
  <p>${esc(description)}</p>
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
