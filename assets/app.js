// ============================================================
// ESTADO DE LA APP
// ============================================================
let DICCIONARIO = [];
let letraActiva = null;
let terminoBusqueda = "";
let tarjetaExpandida = null;
let ultimoResultadoKey = "";
let debounceTimer = null;

const STORAGE_KEY_LETRA = "dicciopeques_letra";
const ALFABETO = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

// ============================================================
// CARGA DE DATOS
// ============================================================
async function cargarDiccionario() {
    try {
        const response = await fetch("assets/data/diccionario.json");
        if (!response.ok) throw new Error("No se pudo cargar el diccionario");
        DICCIONARIO = await response.json();
    } catch (error) {
        console.error("Error cargando diccionario:", error);
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
    // Por defecto, la primera letra que tenga palabras
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
        // Filtro por letra activa (solo si no hay búsqueda)
        if (!terminoBusqueda && letraActiva) {
            if (getLetraInicial(p.palabra) !== letraActiva) return false;
        }
        // Filtro por término de búsqueda
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

        return `<button class="${classes}" data-letter="${letra}" ${isDisabled ? 'tabindex="-1"' : ''} aria-label="Letra ${letra}${count ? ', ' + count + ' palabras' : ', sin palabras'}">
            ${letra}
            ${count > 0 ? `<span class="az-count">${count}</span>` : ''}
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
}

// ============================================================
// RENDER: LISTA DE PALABRAS
// ============================================================
function renderLista(forzar = false) {
    const lista = document.getElementById("wordList");
    const info = document.getElementById("resultsInfo");
    const resultados = filtrarPalabras();

    // Clave para detectar cambios reales
    const nuevaKey = resultados.map(p => p.palabra).join("|") + "|" + terminoBusqueda + "|" + letraActiva;
    const contenidoCambio = nuevaKey !== ultimoResultadoKey;
    ultimoResultadoKey = nuevaKey;

    // Info de resultados
    if (terminoBusqueda) {
        info.innerHTML = `<strong>${resultados.length}</strong> resultado${resultados.length !== 1 ? 's' : ''} para "${terminoBusqueda}"`;
    } else if (letraActiva) {
        info.innerHTML = `Mostrando <strong>${resultados.length}</strong> palabra${resultados.length !== 1 ? 's' : ''} que empiezan con <strong>${letraActiva}</strong>`;
    } else {
        info.innerHTML = `Mostrando las <strong>${resultados.length}</strong> palabras del diccionario`;
    }

    if (resultados.length === 0) {
        const mensaje = terminoBusqueda
            ? "No se encontraron palabras que coincidan con tu búsqueda."
            : `No hay palabras que empiecen con la letra <strong>${letraActiva}</strong>.`;
        lista.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-book-open"></i>
                <p>${mensaje}</p>
            </div>`;
        return;
    }

    // Solo reconstruir el DOM si el contenido realmente cambió
    if (contenidoCambio || forzar) {
        lista.innerHTML = resultados.map((p) => {
            const expandida = tarjetaExpandida === p.palabra;
            const catClass = `cat-${p.categoria}`;
            return `
            <article class="word-card ${expandida ? 'expanded' : ''}"
                data-palabra="${p.palabra}"
                role="listitem"
                aria-expanded="${expandida}">
                <div class="word-header">
                    <div class="word-main">
                        <h2 class="word-term">${resaltar(p.palabra, terminoBusqueda)}</h2>
                        <div class="word-meta">
                            <span class="word-category ${catClass}">${p.categoria}</span>
                            <span class="word-syllables">${p.silabas}</span>
                            <span class="word-pronunciation">${p.pronunciacion}</span>
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
                                ${p.sinonimos.map(s => `<span class="synonym-tag" data-synonym="${s}">${resaltar(s, terminoBusqueda)}</span>`).join('')}
                            </div>
                        ` : ''}
                        ${p.origen ? `
                            <div class="origin-block"><strong>Etimología:</strong> ${p.origen}</div>
                        ` : ''}
                    </div>
                </div>
            </article>`;
        }).join('');

        bindCardEvents();
    } else {
        // Solo actualizar expansión sin tocar el DOM completo
        lista.querySelectorAll(".word-card").forEach(card => {
            const palabra = card.dataset.palabra;
            const debeExpandir = tarjetaExpandida === palabra;
            card.classList.toggle("expanded", debeExpandir);
            card.setAttribute("aria-expanded", debeExpandir);
        });
    }

    // Estadísticas
    document.getElementById("totalWords").textContent = DICCIONARIO.length;
}

// ============================================================
// EVENTOS DE TARJETAS
// ============================================================
function bindCardEvents() {
    const lista = document.getElementById("wordList");

    lista.querySelectorAll(".word-card").forEach(card => {
        card.addEventListener("click", (e) => {
            const synonymTag = e.target.closest(".synonym-tag");
            if (synonymTag) {
                e.stopPropagation();
                const syn = synonymTag.dataset.synonym;
                document.getElementById("searchInput").value = syn;
                terminoBusqueda = syn;
                document.getElementById("searchClear").classList.add("visible");
                tarjetaExpandida = null;
                renderLista(true);
                mostrarToast(`Buscando: "${syn}"`);
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
    document.getElementById("wordOfDay").innerHTML = `
        <div class="wod-label"><i class="fas fa-star"></i> Palabra del día</div>
        <h2 class="wod-term">${p.palabra}</h2>
        <p class="wod-def">${p.definiciones[0].texto}</p>
        <div class="wod-footer">
            <span class="word-category cat-${p.categoria}">${p.categoria}</span>
            <span style="font-size:13px;color:var(--fg-muted)">${p.pronunciacion}</span>
        </div>
    `;
}

// ============================================================
// TOAST
// ============================================================
function mostrarToast(mensaje) {
    const container = document.getElementById("toastContainer");
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.innerHTML = `<i class="fas fa-search"></i> ${mensaje}`;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

// ============================================================
// INICIALIZACIÓN
// ============================================================
document.addEventListener("DOMContentLoaded", async () => {
    // Cargar datos
    await cargarDiccionario();

    // Restaurar letra activa
    letraActiva = getLetraGuardada();

    // Renderizar
    renderPalabraDelDia();
    renderAZNav();
    renderLista();

    // Búsqueda con debounce de 150ms
    const searchInput = document.getElementById("searchInput");
    const searchClear = document.getElementById("searchClear");

    searchInput.addEventListener("input", () => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            terminoBusqueda = searchInput.value.trim();
            searchClear.classList.toggle("visible", terminoBusqueda.length > 0);
            tarjetaExpandida = null;
            // Al buscar, actualizar la navegación A-Z (desactivar letra si hay búsqueda)
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
        if (e.key === "/" && document.activeElement !== searchInput) {
            e.preventDefault();
            searchInput.focus();
        }
        if (e.key === "Escape" && document.activeElement === searchInput) {
            searchInput.blur();
        }
    });
});
