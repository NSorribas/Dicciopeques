// DiccioPeques — Edge Function: Dynamic OG PNG Image
// Always returns a PNG image for the given word
// URL: https://leivaafvepovjrkzntxr.supabase.co/functions/v1/og-image?word=petricor

import { ImageResponse } from 'https://deno.land/x/og_edge@0.0.4/mod.ts'

const SB_URL = Deno.env.get('SB_URL') ?? ''
const SB_ANON_KEY = Deno.env.get('SB_ANON_KEY') ?? ''

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

Deno.serve(async (req: Request) => {
  const url = new URL(req.url)
  const word = url.searchParams.get('word')?.trim()

  if (!word) {
    return new Response('Missing word parameter', { status: 400 })
  }

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
          'Content-Type': 'image/png',
        },
      }
    )
  } catch (error: any) {
    console.error('Error generating image:', error?.message || error)
    return Response.redirect('https://nsorribas.github.io/Dicciopeques/assets/icons/icon-512x512.png', 302)
  }
})
