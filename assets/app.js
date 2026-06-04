// ============================================================
// CONFIGURACIÓN SUPABASE
// ============================================================
const SUPABASE_URL = 'https://leivaafvepovjrkzntxr.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxlaXZhYWZ2ZXBvdmpya3pudHhyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA1MjgxNTgsImV4cCI6MjA5NjEwNDE1OH0.a0OrAI9cxSFzOXJqbjfBDflNa7Ehxmn4t4MHQnHc2gk';

let supabaseClient = null;

// ============================================================
// ESTADO DE LA APP
// ============================================================
let DICCIONARIO = [];
let letraActiva = null;
let terminoBusqueda = "";
let tarjetaExpandida = null;
let ultimoResultadoKey = "";
let debounceTimer = null;
let filtroFavoritos = false;

const STORAGE_KEY_LETRA = "dicciopeques_letra";
const STORAGE_KEY_FAVS = "dicciopeques_favoritos";
const STORAGE_KEY_THEME = "dicciopeques_tema";
const ALFABETO = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

// ============================================================
// INICIALIZAR SUPABASE
// ============================================================
function initSupabase() {
    if (typeof supabase !== 'undefined' && supabase.createClient) {
        supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    } else {
        console.warn('Supabase JS no está cargado. Usando datos locales como fallback.');
    }
}

// ============================================================
// CARGA DE DATOS DESDE SUPABASE
// ============================================================
async function cargarDiccionario() {
    if (!supabaseClient) {
        await cargarDesdeJSON();
        return;
    }

    try {
        // Una sola consulta con joins (mismo patrón que admin.js)
        const { data: palabras, error } = await supabaseClient
            .from('palabras')
            .select('*, definiciones(*), sinonimos(*)')
            .order('palabra', { ascending: true });

        if (error) throw error;
        if (!palabras || palabras.length === 0) {
            await cargarDesdeJSON();
            return;
        }

        // Mapear al formato que usa la app
        DICCIONARIO = palabras.map(p => ({
            palabra: p.palabra,
            categoria: p.categoria,
            silabas: p.silabas || '',
            pronunciacion: p.pronunciacion || '',
            origen: p.origen || '',
            definiciones: (p.definiciones || [])
                .sort((a, b) => a.numero - b.numero)
                .map(d => ({ texto: d.texto, ejemplo: d.ejemplo || '' })),
            sinonimos: (p.sinonimos || []).map(s => s.sinonimo)
        }));

    } catch (error) {
        console.error('Error cargando desde Supabase:', error);
        await cargarDesdeJSON();
    }
}

// Fallback: cargar desde JSON local
async function cargarDesdeJSON() {
    try {
        const response = await fetch('assets/data/diccionario.json');
        if (!response.ok) throw new Error('No se pudo cargar el diccionario local');
        DICCIONARIO = await response.json();
    } catch (error) {
        console.error('Error cargando diccionario local:', error);
        DICCIONARIO = [];
    }
}

// ============================================================
// FUNCIONES AUXILIARES
// ============================================================
function normalizar(texto) {
    return texto.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function getLetraInicial(palabra) {
    return normalizar(palabra).charAt(0).toUpperCase();
}

function getLetrasDisponibles() {
    const letras = {};
    DICCIONARIO.forEach(p => {
        const letra = getLetraInicial(p.palabra);
        letras[letra] = (letras[letra] || 0) + 1;
    });
    return letras;
}

function getLetraGuardada() {
    const guardada = localStorage.getItem(STORAGE_KEY_LETRA);
    if (guardada && ALFABETO.includes(guardada)) {
        return guardada;
    }
    const disponibles = getLetrasDisponibles();
    const primera = ALFABETO.find(l => disponibles[l]);
    return primera || "A";
}

function guardarLetra(letra) {
    localStorage.setItem(STORAGE_KEY_LETRA, letra);
}

// ============================================================
// FILTRADO
// ============================================================
function filtrarPalabras() {
    return DICCIONARIO.filter(p => {
        // Filtro de favoritos
        if (filtroFavoritos && !esFavorito(p.palabra)) return false;

        if (!terminoBusqueda && letraActiva) {
            if (getLetraInicial(p.palabra) !== letraActiva) return false;
        }
        if (terminoBusqueda) {
            const q = normalizar(terminoBusqueda);
            const campos = [
                p.palabra, p.categoria,
                ...p.definiciones.map(d => d.texto),
                ...p.sinonimos, p.origen || ""
            ].map(c => normalizar(c));
            return campos.some(c => c.includes(q));
        }
        return true;
    });
}

function resaltar(texto, query) {
    if (!query) return texto;
    const q = query.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const regex = new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    return texto.replace(regex, '<mark style="background:var(--accent-dim);color:var(--accent);border-radius:3px;padding:0 2px;">$1</mark>');
}

// ============================================================
// RENDER: NAVEGACIÓN A-Z
// ============================================================
function renderAZNav() {
    const nav = document.getElementById("azNav");
    const disponibles = getLetrasDisponibles();

    nav.innerHTML = ALFABETO.map(letra => {
        const count = disponibles[letra] || 0;
        const isActive = letra === letraActiva;
        const isDisabled = count === 0;
        const classes = [
            "az-letter",
            isActive ? "active" : "",
            isDisabled ? "disabled" : ""
        ].filter(Boolean).join(" ");

        return `<button class="${classes}" data-letter="${letra}" ${isDisabled ? 'tabindex="-1"' : ''} role="tab" aria-selected="${isActive}" aria-label="Letra ${letra}${count ? ', ' + count + ' palabras' : ', sin palabras'}">
            ${letra}
            ${count > 0 ? `<span class="az-count" aria-hidden="true">${count}</span>` : ''}
        </button>`;
    }).join('');

    nav.querySelectorAll(".az-letter:not(.disabled)").forEach(btn => {
        btn.addEventListener("click", () => {
            letraActiva = btn.dataset.letter;
            guardarLetra(letraActiva);
            tarjetaExpandida = null;
            renderAZNav();
            renderLista();
        });
    });

    // Teclado: flechas izq/derecha para navegar letras
    nav.addEventListener('keydown', (e) => {
        const letrasActivas = [...nav.querySelectorAll('.az-letter:not(.disabled)')];
        const idx = letrasActivas.indexOf(document.activeElement);
        if (idx === -1) return;

        let nextIdx = -1;
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
            nextIdx = (idx + 1) % letrasActivas.length;
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
            nextIdx = (idx - 1 + letrasActivas.length) % letrasActivas.length;
        } else if (e.key === 'Home') {
            nextIdx = 0;
        } else if (e.key === 'End') {
            nextIdx = letrasActivas.length - 1;
        }

        if (nextIdx >= 0) {
            e.preventDefault();
            letrasActivas[nextIdx].focus();
            letrasActivas[nextIdx].click();
        }
    });
}

// ============================================================
// RENDER: LISTA DE PALABRAS
// ============================================================
function renderLista(forzar = false) {
    const lista = document.getElementById("wordList");
    const info = document.getElementById("resultsInfo");
    const resultados = filtrarPalabras();

    const nuevaKey = resultados.map(p => p.palabra).join("|") + "|" + terminoBusqueda + "|" + letraActiva + "|" + filtroFavoritos;
    const contenidoCambio = nuevaKey !== ultimoResultadoKey;
    ultimoResultadoKey = nuevaKey;

    if (filtroFavoritos) {
        info.innerHTML = `<i class="fas fa-star" style="color:var(--accent);margin-right:4px"></i> Mostrando <strong>${resultados.length}</strong> palabra${resultados.length !== 1 ? 's' : ''} favorita${resultados.length !== 1 ? 's' : ''}`;
    } else if (terminoBusqueda) {
        info.innerHTML = `<strong>${resultados.length}</strong> resultado${resultados.length !== 1 ? 's' : ''} para "${terminoBusqueda}"`;
    } else if (letraActiva) {
        info.innerHTML = `Mostrando <strong>${resultados.length}</strong> palabra${resultados.length !== 1 ? 's' : ''} que empiezan con <strong>${letraActiva}</strong>`;
    } else {
        info.innerHTML = `Mostrando las <strong>${resultados.length}</strong> palabras del diccionario`;
    }

    if (resultados.length === 0) {
        const mensaje = filtroFavoritos
            ? 'No tenés palabras favoritas todavía. Tocá la <i class="far fa-star" style="color:var(--accent)"></i> en cualquier palabra para guardarla.'
            : terminoBusqueda
            ? "No se encontraron palabras que coincidan con tu búsqueda."
            : `No hay palabras que empiecen con la letra <strong>${letraActiva}</strong>.`;
        lista.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-book-open"></i>
                <p>${mensaje}</p>
            </div>`;
        return;
    }

    if (contenidoCambio || forzar) {
        lista.innerHTML = resultados.map((p) => {
            const expandida = tarjetaExpandida === p.palabra;
            const catClass = `cat-${p.categoria}`;
            const fav = esFavorito(p.palabra);
            return `
            <article class="word-card ${expandida ? 'expanded' : ''}"
                data-palabra="${p.palabra}"
                role="listitem"
                tabindex="0"
                aria-expanded="${expandida}"
                aria-label="${p.palabra}, ${p.categoria}">
                <button class="word-fav ${fav ? 'favorited' : ''}" data-fav="${p.palabra}" aria-label="${fav ? 'Quitar de favoritos' : 'Agregar a favoritos'}" title="${fav ? 'Quitar de favoritos' : 'Agregar a favoritos'}">
                    <i class="${fav ? 'fas' : 'far'} fa-star"></i>
                </button>
                <div class="word-card-inner">
                    <div class="word-header">
                        <div class="word-main">
                            <h2 class="word-term">${resaltar(p.palabra, terminoBusqueda)}</h2>
                            <div class="word-meta">
                                <span class="word-category ${catClass}">${p.categoria}</span>
                                <span class="word-syllables">${p.silabas}</span>
                                ${p.pronunciacion ? `<span class="word-pronunciation">${p.pronunciacion}</span>` : ''}
                                <button class="word-speak" data-speak="${p.palabra}" aria-label="Escuchar ${p.palabra}" title="Escuchar pronunciación">
                                    <i class="fas fa-volume-high"></i>
                                </button>
                            </div>
                        </div>
                        <i class="fas fa-chevron-down word-expand-icon"></i>
                    </div>
                    <div class="word-detail">
                        <div class="word-detail-inner">
                            ${p.definiciones.map((d, di) => `
                                <div class="definition-block">
                                    <p class="def-text">
                                        ${p.definiciones.length > 1 ? `<span class="def-number">${di + 1}</span>` : ''}
                                        ${resaltar(d.texto, terminoBusqueda)}
                                    </p>
                                    ${d.ejemplo ? `<p class="def-example">${resaltar(d.ejemplo, terminoBusqueda)}</p>` : ''}
                                </div>
                            `).join('')}
                            ${p.sinonimos.length ? `
                                <div class="synonyms-block">
                                    <div class="synonyms-label">Sinónimos</div>
                                    ${p.sinonimos.map(s => `<button class="synonym-tag" data-synonym="${s}" aria-label="Buscar sinónimo: ${s}">${resaltar(s, terminoBusqueda)}</button>`).join('')}
                                </div>
                            ` : ''}
                            ${p.origen ? `
                                <div class="origin-block"><strong>Etimología:</strong> ${p.origen}</div>
                            ` : ''}
                        </div>
                    </div>
                </div>
            </article>`;
        }).join('');

        bindCardEvents();
        revealCards();
    } else {
        lista.querySelectorAll(".word-card").forEach(card => {
            const palabra = card.dataset.palabra;
            const debeExpandir = tarjetaExpandida === palabra;
            card.classList.toggle("expanded", debeExpandir);
            card.setAttribute("aria-expanded", debeExpandir);
        });
    }

    document.getElementById("totalWords").textContent = DICCIONARIO.length;
}

// ============================================================
// PRONUNCIACIÓN (Web Speech API)
// ============================================================
function hablarPalabra(palabra, btn) {
    if (!('speechSynthesis' in window)) return;

    // Cancelar si ya está hablando
    speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(palabra);
    utterance.lang = 'es-ES';
    utterance.rate = 0.85;

    // Intentar usar una voz local en español
    const voces = speechSynthesis.getVoices();
    const vozEs = voces.find(v => v.lang.startsWith('es') && v.localService)
               || voces.find(v => v.lang.startsWith('es'));
    if (vozEs) utterance.voice = vozEs;

    // Animación mientras habla
    if (btn) {
        btn.classList.add('speaking');
        utterance.onend = () => btn.classList.remove('speaking');
        utterance.onerror = () => btn.classList.remove('speaking');
    }

    speechSynthesis.speak(utterance);
}

// Cargar voces (algunos navegadores las cargan async)
if ('speechSynthesis' in window) {
    speechSynthesis.getVoices();
    speechSynthesis.onvoiceschanged = () => speechSynthesis.getVoices();
}

// ============================================================
// SCROLL REVEAL (Intersection Observer)
// ============================================================
let revealObserver = null;

function revealCards() {
    // Si el usuario prefiere reducir movimiento, mostrar todo de una
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        document.querySelectorAll('.word-card').forEach(c => c.classList.add('revealed'));
        return;
    }

    // Crear observer una sola vez
    if (!revealObserver) {
        revealObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry, i) => {
                if (entry.isIntersecting) {
                    // Stagger sutil: las cards visibles al mismo tiempo
                    // reciben un delay progresivo
                    const card = entry.target;
                    const delay = card.dataset.revealDelay || 0;
                    setTimeout(() => {
                        card.classList.add('revealed');
                    }, delay);
                    revealObserver.unobserve(card);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -40px 0px'
        });
    }

    const cards = document.querySelectorAll('.word-card:not(.revealed)');
    cards.forEach((card, i) => {
        // Stagger: máximo 60ms entre cards, resetea cada 8
        card.dataset.revealDelay = (i % 8) * 40;
        revealObserver.observe(card);
    });
}

// ============================================================
// EVENTOS DE TARJETAS
// ============================================================
function bindCardEvents() {
    const lista = document.getElementById("wordList");

    lista.querySelectorAll(".word-card").forEach(card => {
        // Click en estrella de favoritos
        const favBtn = card.querySelector('.word-fav');
        if (favBtn) {
            favBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const palabra = favBtn.dataset.fav;
                const ahoraEsFav = toggleFavorito(palabra);
                favBtn.classList.toggle('favorited', ahoraEsFav);
                favBtn.querySelector('i').className = ahoraEsFav ? 'fas fa-star' : 'far fa-star';
                favBtn.setAttribute('aria-label', ahoraEsFav ? 'Quitar de favoritos' : 'Agregar a favoritos');
                favBtn.setAttribute('title', ahoraEsFav ? 'Quitar de favoritos' : 'Agregar a favoritos');

                // Si estamos en filtro de favoritos y se quitó, re-renderizar
                if (filtroFavoritos && !ahoraEsFav) {
                    renderLista(true);
                }
            });
        }

        // Click en pronunciación
        const speakBtn = card.querySelector('.word-speak');
        if (speakBtn) {
            speakBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                hablarPalabra(speakBtn.dataset.speak, speakBtn);
            });
        }

        // Teclado: Enter/Space para expandir tarjeta
        card.addEventListener("keydown", (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                // No interceptar si el foco está en un botón interno
                if (e.target.closest('.word-fav') || e.target.closest('.word-speak') || e.target.closest('.synonym-tag')) return;
                e.preventDefault();
                card.click();
            }
        });

        card.addEventListener("click", (e) => {
            // Ignorar clicks en el botón de favoritos
            if (e.target.closest('.word-fav')) return;

            const synonymTag = e.target.closest(".synonym-tag");
            if (synonymTag) {
                e.stopPropagation();
                const syn = synonymTag.dataset.synonym;
                document.getElementById("searchInput").value = syn;
                terminoBusqueda = syn;
                document.getElementById("searchClear").classList.add("visible");
                tarjetaExpandida = null;
                renderLista(true);
                return;
            }

            const palabra = card.dataset.palabra;
            if (tarjetaExpandida === palabra) {
                tarjetaExpandida = null;
            } else {
                tarjetaExpandida = palabra;
            }
            lista.querySelectorAll(".word-card").forEach(c => {
                const esLaTarjeta = c.dataset.palabra === tarjetaExpandida;
                c.classList.toggle("expanded", esLaTarjeta);
                c.setAttribute("aria-expanded", esLaTarjeta);
            });
        });
    });
}

// ============================================================
// PALABRA DEL DÍA
// ============================================================
function renderPalabraDelDia() {
    if (DICCIONARIO.length === 0) return;
    const hoy = new Date();
    const indice = (hoy.getFullYear() * 366 + hoy.getMonth() * 31 + hoy.getDate()) % DICCIONARIO.length;
    const p = DICCIONARIO[indice];
    const letraInicial = p.palabra.charAt(0).toUpperCase();
    document.getElementById("wordOfDay").innerHTML = `
        <div class="wod-content">
            <div class="wod-label"><i class="fas fa-star"></i> Palabra del día</div>
            <h2 class="wod-term">${p.palabra}</h2>
            <p class="wod-def">${p.definiciones[0].texto}</p>
            <div class="wod-footer">
                <span class="word-category cat-${p.categoria}">${p.categoria}</span>
                ${p.pronunciacion ? `<span style="font-size:13px;color:var(--fg-muted)">${p.pronunciacion}</span>` : ''}
                <button class="wod-speak" data-speak="${p.palabra}" aria-label="Escuchar ${p.palabra}" title="Escuchar pronunciación">
                    <i class="fas fa-volume-high"></i>
                    <span class="wod-speak-text">Escuchar</span>
                </button>
            </div>
        </div>
        <div class="wod-letter" aria-hidden="true">${letraInicial}</div>
    `;
}

// ============================================================
// FAVORITOS
// ============================================================
function getFavoritos() {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY_FAVS)) || [];
    } catch { return []; }
}

function esFavorito(palabra) {
    return getFavoritos().includes(palabra);
}

function toggleFavorito(palabra) {
    let favs = getFavoritos();
    if (favs.includes(palabra)) {
        favs = favs.filter(f => f !== palabra);
    } else {
        favs.push(palabra);
    }
    localStorage.setItem(STORAGE_KEY_FAVS, JSON.stringify(favs));
    actualizarBadgeFavoritos();
    return favs.includes(palabra);
}

function actualizarBadgeFavoritos() {
    const badge = document.getElementById('fabFavBadge');
    const count = getFavoritos().length;
    if (badge) {
        badge.textContent = count;
        badge.classList.toggle('visible', count > 0);
    }
}

// ============================================================
// TEMA CLARO/OSCURO
// ============================================================
function getTema() {
    return localStorage.getItem(STORAGE_KEY_THEME) || 'dark';
}

function aplicarTema(tema) {
    document.body.classList.toggle('light-mode', tema === 'light');
    const icon = document.querySelector('#fabTheme i');
    if (icon) {
        icon.className = tema === 'light' ? 'fas fa-sun' : 'fas fa-moon';
    }
    localStorage.setItem(STORAGE_KEY_THEME, tema);
}

function toggleTema() {
    const temaActual = getTema();
    aplicarTema(temaActual === 'dark' ? 'light' : 'dark');
}

// ============================================================
// NOTIFICACIONES PUSH
// ============================================================
const VAPID_PUBLIC_KEY = 'BCbTcZ795C1qAvmM5-xafLOEwLrUlimJ02wON2E4xr3-X1P34xUuxDROtxx3yWt1jB8Q7ag6iZqYXV3fOkQwZBw';

function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

async function suscribirPush() {
    if (!('PushManager' in window) || !('serviceWorker' in navigator)) {
        mostrarToast('Tu navegador no soporta notificaciones push');
        return;
    }

    try {
        const registration = await navigator.serviceWorker.ready;

        // Verificar si ya está suscrito
        const existingSub = await registration.pushManager.getSubscription();
        if (existingSub) {
            // Ya suscrito, guardar en Supabase por si acaso
            await guardarSuscripcionEnSupabase(existingSub);
            mostrarToast('Ya estás suscrito a las notificaciones');
            return;
        }

        // Pedir permiso
        const permission = await Notification.requestPermission();
        if (permission !== 'granted') {
            mostrarToast('Necesitás permitir las notificaciones');
            return;
        }

        // Crear suscripción
        const subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
        });

        // Guardar en Supabase
        await guardarSuscripcionEnSupabase(subscription);
        mostrarToast('¡Listo! Recibirás la palabra del día a las 8 AM');
    } catch (error) {
        console.error('Error al suscribirse a push:', error);
        mostrarToast('No se pudo activar las notificaciones');
    }
}

async function guardarSuscripcionEnSupabase(subscription) {
    if (!supabaseClient) return;

    const subData = subscription.toJSON();
    const payload = {
        endpoint: subData.endpoint,
        p256dh: subData.keys.p256dh,
        auth: subData.keys.auth
    };

    // Upsert: si ya existe el endpoint, actualizar; si no, insertar
    const { error } = await supabaseClient
        .from('push_subscriptions')
        .upsert(payload, { onConflict: 'endpoint' });

    if (error) {
        console.error('Error guardando suscripción:', error);
    }
}

async function desuscribirPush() {
    if (!('serviceWorker' in navigator)) return;

    try {
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.getSubscription();
        if (subscription) {
            await subscription.unsubscribe();

            // Eliminar de Supabase
            if (supabaseClient) {
                await supabaseClient
                    .from('push_subscriptions')
                    .delete()
                    .eq('endpoint', subscription.endpoint);
            }
            mostrarToast('Notificaciones desactivadas');
            actualizarBotonNotificaciones();
        }
    } catch (error) {
        console.error('Error al desuscribirse:', error);
    }
}

function actualizarBotonNotificaciones() {
    const btn = document.getElementById('fabNotify');
    if (!btn) return;

    // Siempre mostrar el botón. Si no hay soporte push, se muestra
    // con icono de campana tachada y al click se explica cómo activarlo.
    if (!('PushManager' in window) || !('serviceWorker' in navigator)) {
        btn.classList.remove('subscribed');
        const icon = btn.querySelector('i');
        if (icon) icon.className = 'fas fa-bell-slash';
        btn.setAttribute('aria-label', 'Notificaciones no disponibles');
        btn.setAttribute('title', 'Notificaciones no disponibles');
        return;
    }

    navigator.serviceWorker.ready.then(reg => {
        return reg.pushManager.getSubscription();
    }).then(sub => {
        const suscrito = !!sub;
        btn.classList.toggle('subscribed', suscrito);
        const icon = btn.querySelector('i');
        if (icon) {
            icon.className = suscrito ? 'fas fa-bell' : 'fas fa-bell-slash';
        }
        btn.setAttribute('aria-label', suscrito ? 'Desactivar notificaciones' : 'Activar notificaciones');
        btn.setAttribute('title', suscrito ? 'Desactivar notificaciones' : 'Activar notificaciones');
    }).catch(() => {
        // Si falla (ej: SW no listo), mostrar como no disponible
        const icon = btn.querySelector('i');
        if (icon) icon.className = 'fas fa-bell-slash';
    });
}

function initNotificaciones() {
    const btn = document.getElementById('fabNotify');
    if (!btn) return;

    btn.addEventListener('click', async () => {
        // Cerrar menú FAB
        const menu = document.getElementById('fabMenu');
        const toggle = document.getElementById('fabToggle');
        menu.classList.remove('open');
        toggle.classList.remove('active');
        toggle.setAttribute('aria-expanded', 'false');

        // Si no hay soporte push, explicar que hay que instalar la app
        if (!('PushManager' in window) || !('serviceWorker' in navigator)) {
            const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
            if (isStandalone) {
                mostrarToast('Tu dispositivo no soporta notificaciones push');
            } else {
                mostrarToast('Instalá la app en tu pantalla de inicio para activar notificaciones', 4000);
            }
            return;
        }

        // Verificar si ya está suscrito
        try {
            const registration = await navigator.serviceWorker.ready;
            const subscription = await registration.pushManager.getSubscription();

            if (subscription) {
                await desuscribirPush();
            } else {
                await suscribirPush();
            }
            actualizarBotonNotificaciones();
        } catch (error) {
            console.error('Error en notificaciones:', error);
            mostrarToast('No se pudieron configurar las notificaciones');
        }
    });

    actualizarBotonNotificaciones();
}

// ============================================================
// TOAST (notificaciones en pantalla)
// ============================================================
function mostrarToast(mensaje, duracion = 3000) {
    let container = document.getElementById('appToastContainer');
    if (!container) {
        container = document.createElement('div');
        container.id = 'appToastContainer';
        container.className = 'app-toast-container';
        container.setAttribute('aria-live', 'polite');
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'app-toast';
    toast.textContent = mensaje;
    container.appendChild(toast);

    // Animar entrada
    requestAnimationFrame(() => toast.classList.add('visible'));

    setTimeout(() => {
        toast.classList.remove('visible');
        toast.addEventListener('transitionend', () => toast.remove());
    }, duracion);
}

// ============================================================
// PALABRA ALEATORIA
// ============================================================
function irAPalabraAleatoria() {
    if (DICCIONARIO.length === 0) return;
    const indice = Math.floor(Math.random() * DICCIONARIO.length);
    const palabra = DICCIONARIO[indice].palabra;

    // Limpiar búsqueda y filtro de favoritos
    const searchInput = document.getElementById("searchInput");
    searchInput.value = "";
    terminoBusqueda = "";
    document.getElementById("searchClear").classList.remove("visible");
    filtroFavoritos = false;
    document.getElementById('fabFavorites').classList.remove('active');

    // Ir a la letra de la palabra
    letraActiva = getLetraInicial(palabra);
    guardarLetra(letraActiva);
    tarjetaExpandida = palabra;
    renderAZNav();
    renderLista(true);

    // Scroll a la tarjeta y enfocar
    setTimeout(() => {
        const card = document.querySelector(`.word-card[data-palabra="${CSS.escape(palabra)}"]`);
        if (card) {
            card.scrollIntoView({ behavior: 'smooth', block: 'center' });
            card.focus();
            // Breve highlight
            card.style.boxShadow = '0 0 0 2px var(--accent), var(--card-shadow)';
            setTimeout(() => { card.style.boxShadow = ''; }, 1500);
        }
    }, 100);

}

// ============================================================
// FAB: FLOATING ACTION BUTTON
// ============================================================
function initFAB() {
    const toggle = document.getElementById('fabToggle');
    const menu = document.getElementById('fabMenu');

    // Agregar badges a los botones
    const fabFav = document.getElementById('fabFavorites');
    fabFav.style.position = 'relative';
    fabFav.innerHTML = '<i class="fas fa-star" aria-hidden="true"></i><span class="fab-badge" id="fabFavBadge" aria-hidden="true">0</span>';

    toggle.addEventListener('click', () => {
        const isOpen = menu.classList.toggle('open');
        toggle.classList.toggle('active', isOpen);
        toggle.setAttribute('aria-expanded', isOpen);
        // Si abrió, enfocar primer botón del menú
        if (isOpen) {
            menu.querySelector('.fab-action')?.focus();
        }
    });

    // Cerrar al hacer click fuera
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.fab-container')) {
            menu.classList.remove('open');
            toggle.classList.remove('active');
            toggle.setAttribute('aria-expanded', 'false');
        }
    });

    // Teclado: Escape cierra el menú, flechas navegan
    document.querySelector('.fab-container').addEventListener('keydown', (e) => {
        const actions = [...menu.querySelectorAll('.fab-action')];
        if (e.key === 'Escape') {
            menu.classList.remove('open');
            toggle.classList.remove('active');
            toggle.setAttribute('aria-expanded', 'false');
            toggle.focus();
            return;
        }
        if (!menu.classList.contains('open')) return;
        const idx = actions.indexOf(document.activeElement);
        if (e.key === 'ArrowUp') {
            e.preventDefault();
            const next = idx <= 0 ? actions.length - 1 : idx - 1;
            actions[next].focus();
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            const next = (idx + 1) % actions.length;
            actions[next].focus();
        } else if (e.key === 'Tab' && !e.shiftKey && idx === actions.length - 1) {
            // Cerrar al tabular fuera del menú
            menu.classList.remove('open');
            toggle.classList.remove('active');
            toggle.setAttribute('aria-expanded', 'false');
        }
    });

    // Favoritos
    fabFav.addEventListener('click', () => {
        filtroFavoritos = !filtroFavoritos;
        fabFav.classList.toggle('active', filtroFavoritos);
        tarjetaExpandida = null;
        renderLista(true);
        menu.classList.remove('open');
        toggle.classList.remove('active');
        toggle.setAttribute('aria-expanded', 'false');

        if (filtroFavoritos) {
            // Desactivar búsqueda y letra cuando filtramos favoritos
            const searchInput = document.getElementById("searchInput");
            searchInput.value = "";
            terminoBusqueda = "";
            document.getElementById("searchClear").classList.remove("visible");
            letraActiva = null;
            renderAZNav();
        }
    });

    // Random
    document.getElementById('fabRandom').addEventListener('click', () => {
        irAPalabraAleatoria();
        menu.classList.remove('open');
        toggle.classList.remove('active');
        toggle.setAttribute('aria-expanded', 'false');
    });

    // Tema
    document.getElementById('fabTheme').addEventListener('click', () => {
        toggleTema();
        menu.classList.remove('open');
        toggle.classList.remove('active');
        toggle.setAttribute('aria-expanded', 'false');
    });

    // Tips / Atajos de teclado
    document.getElementById('fabTips').addEventListener('click', () => {
        menu.classList.remove('open');
        toggle.classList.remove('active');
        toggle.setAttribute('aria-expanded', 'false');
        toggleShortcutsPanel(true);
    });

    actualizarBadgeFavoritos();
}

// ============================================================
// PANEL DE ATAJOS DE TECLADO
// ============================================================
function toggleShortcutsPanel(open) {
    const panel = document.getElementById('shortcutsPanel');
    const isOpen = panel.classList.contains('open');

    if (open === true || !isOpen) {
        panel.classList.add('open');
        panel.setAttribute('aria-hidden', 'false');
        // Enfocar el botón de cerrar
        document.getElementById('shortcutsClose').focus();
    } else {
        closeShortcutsPanel();
    }
}

function closeShortcutsPanel() {
    const panel = document.getElementById('shortcutsPanel');
    panel.classList.remove('open');
    panel.setAttribute('aria-hidden', 'true');
}

// ============================================================
// INICIALIZACIÓN
// ============================================================
document.addEventListener("DOMContentLoaded", async () => {
    // Aplicar tema guardado ANTES de que se pinte (evitar flash)
    aplicarTema(getTema());

    // Inicializar Supabase
    initSupabase();

    // Cargar datos
    await cargarDiccionario();

    // Ocultar splash con fade
    const splash = document.getElementById('splash');
    splash.style.opacity = '0';

    // Restaurar letra activa
    letraActiva = getLetraGuardada();

    // Renderizar (reemplaza los skeletons)
    renderPalabraDelDia();

    // Event listener para pronunciación de la WOD
    document.getElementById('wordOfDay').addEventListener('click', (e) => {
        const speakBtn = e.target.closest('.wod-speak');
        if (speakBtn) {
            e.stopPropagation();
            hablarPalabra(speakBtn.dataset.speak, speakBtn);
        }
    });

    renderAZNav();
    renderLista();

    // Inicializar FAB
    initFAB();

    // Inicializar notificaciones push
    initNotificaciones();

    // Panel de atajos: cerrar con X, click afuera, Escape
    document.getElementById('shortcutsClose').addEventListener('click', closeShortcutsPanel);
    document.addEventListener('click', (e) => {
        const panel = document.getElementById('shortcutsPanel');
        if (panel.classList.contains('open') && !e.target.closest('.shortcuts-panel') && !e.target.closest('#fabTips')) {
            closeShortcutsPanel();
        }
    });

    // Mostrar app con fade
    setTimeout(() => {
        splash.style.display = 'none';
        const appContainer = document.getElementById('appContainer');
        appContainer.style.transition = 'opacity 0.4s ease';
        appContainer.style.opacity = '1';
    }, 400);

    // Búsqueda con debounce
    const searchInput = document.getElementById("searchInput");
    const searchClear = document.getElementById("searchClear");

    searchInput.addEventListener("input", () => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            terminoBusqueda = searchInput.value.trim();
            searchClear.classList.toggle("visible", terminoBusqueda.length > 0);
            tarjetaExpandida = null;
            // Desactivar filtro de favoritos al buscar
            if (terminoBusqueda && filtroFavoritos) {
                filtroFavoritos = false;
                document.getElementById('fabFavorites').classList.remove('active');
            }
            if (terminoBusqueda) {
                document.querySelectorAll(".az-letter.active").forEach(el => el.classList.remove("active"));
            } else {
                renderAZNav();
            }
            renderLista();
        }, 150);
    });

    searchClear.addEventListener("click", () => {
        clearTimeout(debounceTimer);
        searchInput.value = "";
        terminoBusqueda = "";
        searchClear.classList.remove("visible");
        tarjetaExpandida = null;
        renderAZNav();
        renderLista(true);
        searchInput.focus();
    });

    // Atajos de teclado
    document.addEventListener("keydown", (e) => {
        // Si estamos en un input/textarea/select, no interceptar (salvo Escape)
        const inInput = ['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName);

        if (e.key === "/" && !inInput) {
            e.preventDefault();
            searchInput.focus();
        }
        if (e.key === "Escape") {
            // Cerrar panel de atajos si está abierto
            const shortcutsPanel = document.getElementById('shortcutsPanel');
            if (shortcutsPanel.classList.contains('open')) {
                closeShortcutsPanel();
                return;
            }
            if (document.activeElement === searchInput) {
                searchInput.blur();
            }
            // Cerrar FAB si está abierto
            const fabMenu = document.getElementById('fabMenu');
            const fabToggle = document.getElementById('fabToggle');
            if (fabMenu.classList.contains('open')) {
                fabMenu.classList.remove('open');
                fabToggle.classList.remove('active');
                fabToggle.setAttribute('aria-expanded', 'false');
                fabToggle.focus();
            }
        }
    });
});
