// ============================================================
// CONFIGURACIÓN SUPABASE
// ============================================================
const SUPABASE_URL = 'https://leivaafvepovjrkzntxr.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxlaXZhYWZ2ZXBvdmpya3pudHhyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA1MjgxNTgsImV4cCI6MjA5NjEwNDE1OH0.a0OrAI9cxSFzOXJqbjfBDflNa7Ehxmn4t4MHQnHc2gk';

let supabaseClient = null;
let todasLasPalabras = [];
let palabraEnEdicion = null;
let palabraAEliminar = null;
let eventListenersInitialized = false;

// ============================================================
// INICIALIZACIÓN CON AUTH
// ============================================================
document.addEventListener('DOMContentLoaded', async () => {
    if (typeof supabase !== 'undefined' && supabase.createClient) {
        supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    } else {
        ocultarSplash('Error: Supabase no disponible');
        return;
    }

    // Escuchar cambios de sesión (login, logout, token refresh)
    supabaseClient.auth.onAuthStateChange((event, session) => {
        if (event === 'SIGNED_IN' && session) {
            mostrarPanel(session.user);
        } else if (event === 'SIGNED_OUT') {
            mostrarLogin();
        }
    });

    // Verificar sesión existente
    try {
        const { data: { session }, error } = await supabaseClient.auth.getSession();
        if (error) throw error;

        // Simular tiempo mínimo de splash
        await new Promise(r => setTimeout(r, 800));

        if (session && session.user) {
            mostrarPanel(session.user);
        } else {
            mostrarLogin();
        }
    } catch (error) {
        console.error('Error verificando sesión:', error);
        await new Promise(r => setTimeout(r, 800));
        mostrarLogin();
    }
});

// ============================================================
// PANTALLAS: SPLASH / LOGIN / PANEL
// ============================================================
function ocultarSplash(mensaje) {
    const splash = document.getElementById('splash');
    splash.style.opacity = '0';
    setTimeout(() => {
        splash.style.display = 'none';
        if (mensaje) {
            document.getElementById('loginError').textContent = mensaje;
        }
    }, 400);
}

function mostrarLogin() {
    // Ocultar splash
    const splash = document.getElementById('splash');
    splash.style.opacity = '0';
    setTimeout(() => { splash.style.display = 'none'; }, 400);

    // Mostrar login, ocultar panel
    document.getElementById('loginScreen').style.display = 'flex';
    document.getElementById('adminPanel').style.display = 'none';
}

function mostrarPanel(user) {
    // Ocultar splash y login
    const splash = document.getElementById('splash');
    splash.style.opacity = '0';
    setTimeout(() => { splash.style.display = 'none'; }, 400);

    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('adminPanel').style.display = 'block';

    // Mostrar email del usuario
    document.getElementById('userEmail').textContent = user.email;

    // Inicializar el panel
    initEventListeners();
    cargarPalabras();
}

// ============================================================
// AUTH: LOGIN
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const loginError = document.getElementById('loginError');
    const loginSubmit = document.getElementById('loginSubmit');
    const togglePassword = document.getElementById('togglePassword');

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        loginError.textContent = '';

        const email = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPassword').value;

        if (!email || !password) {
            loginError.textContent = 'Completá email y contraseña.';
            return;
        }

        // Estado cargando
        loginSubmit.classList.add('loading');
        loginSubmit.disabled = true;

        try {
            const { data, error } = await supabaseClient.auth.signInWithPassword({
                email,
                password
            });

            if (error) {
                // Mensajes de error en español
                if (error.message.includes('Invalid login credentials')) {
                    loginError.textContent = 'Email o contraseña incorrectos.';
                } else if (error.message.includes('Email not confirmed')) {
                    loginError.textContent = 'Email no confirmado. Revisá tu casilla de correo.';
                } else if (error.message.includes('Too many requests')) {
                    loginError.textContent = 'Demasiados intentos. Esperá unos segundos y volvé a intentar.';
                } else {
                    loginError.textContent = 'Error al iniciar sesión: ' + error.message;
                }
                return;
            }

            // Login exitoso — onAuthStateChange se encarga de mostrar el panel
        } catch (err) {
            loginError.textContent = 'Error de conexión. Intentá de nuevo.';
            console.error('Error login:', err);
        } finally {
            loginSubmit.classList.remove('loading');
            loginSubmit.disabled = false;
        }
    });

    // Toggle password visibility
    togglePassword.addEventListener('click', () => {
        const input = document.getElementById('loginPassword');
        const icon = togglePassword.querySelector('i');
        if (input.type === 'password') {
            input.type = 'text';
            icon.classList.replace('fa-eye', 'fa-eye-slash');
        } else {
            input.type = 'password';
            icon.classList.replace('fa-eye-slash', 'fa-eye');
        }
    });
});

// ============================================================
// AUTH: LOGOUT
// ============================================================
async function logout() {
    try {
        await supabaseClient.auth.signOut();
        // onAuthStateChange se encarga de mostrar el login
    } catch (error) {
        console.error('Error al cerrar sesión:', error);
        mostrarToast('Error al cerrar sesión', 'error');
    }
}

// ============================================================
// CARGA DE DATOS
// ============================================================
async function cargarPalabras() {
    if (!supabaseClient) {
        mostrarToast('Error: No hay conexión con Supabase', 'error');
        return;
    }

    try {
        const { data: palabras, error } = await supabaseClient
            .from('palabras')
            .select('*, definiciones(*), sinonimos(*)')
            .order('palabra', { ascending: true });

        if (error) throw error;

        todasLasPalabras = (palabras || []).map(p => ({
            id: p.id,
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

        renderTabla();
        document.getElementById('totalCount').textContent = todasLasPalabras.length;

    } catch (error) {
        console.error('Error cargando palabras:', error);
        if (error.code === 'PGRST301' || error.message?.includes('JWT')) {
            mostrarToast('Sesión expirada. Ingresá de nuevo.', 'error');
            setTimeout(() => logout(), 1500);
        } else {
            mostrarToast('Error al cargar las palabras', 'error');
        }
    }
}

// ============================================================
// RENDER TABLA
// ============================================================
function renderTabla(filtro = '') {
    const tbody = document.getElementById('tablaBody');
    const q = filtro.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    const filtradas = filtro
        ? todasLasPalabras.filter(p => {
            const campos = [p.palabra, p.categoria, ...p.sinonimos, p.origen]
                .map(c => c.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""));
            return campos.some(c => c.includes(q));
        })
        : todasLasPalabras;

    if (filtradas.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" class="admin-table-empty">${
            filtro ? 'No se encontraron resultados' : 'No hay palabras cargadas'
        }</td></tr>`;
        return;
    }

    tbody.innerHTML = filtradas.map(p => `
        <tr data-id="${p.id}">
            <td class="admin-td-palabra">${escaparHTML(p.palabra)}</td>
            <td><span class="admin-td-categoria cat-${p.categoria}">${p.categoria}</span></td>
            <td class="admin-td-count">${escaparHTML(p.silabas) || '—'}</td>
            <td class="admin-td-count">${p.definiciones.length}</td>
            <td class="admin-td-sinonimos" title="${escaparHTML(p.sinonimos.join(', '))}">${escaparHTML(p.sinonimos.join(', ')) || '—'}</td>
            <td class="admin-td-actions">
                <button class="admin-btn admin-btn-icon edit" onclick="editarPalabra(${p.id})" title="Editar">
                    <i class="fas fa-pen"></i>
                </button>
                <button class="admin-btn admin-btn-icon delete" onclick="confirmarEliminar(${p.id})" title="Eliminar">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

function escaparHTML(texto) {
    const div = document.createElement('div');
    div.textContent = texto;
    return div.innerHTML;
}

// ============================================================
// CRUD: CREAR / EDITAR
// ============================================================
async function guardarPalabra(event) {
    event.preventDefault();

    const id = document.getElementById('formPalabraId').value;
    const palabra = document.getElementById('formPalabraTexto').value.trim();
    const categoria = document.getElementById('formCategoria').value;
    const silabas = document.getElementById('formSilabas').value.trim();
    const pronunciacion = document.getElementById('formPronunciacion').value.trim();
    const origen = document.getElementById('formOrigen').value.trim();
    const sinonimosRaw = document.getElementById('formSinonimos').value.trim();

    // Recoger definiciones del form
    const definiciones = [];
    document.querySelectorAll('.def-item').forEach((item, i) => {
        const texto = item.querySelector('.def-texto').value.trim();
        const ejemplo = item.querySelector('.def-ejemplo').value.trim();
        if (texto) {
            definiciones.push({ numero: i + 1, texto, ejemplo });
        }
    });

    if (!palabra || !categoria || definiciones.length === 0) {
        mostrarToast('Completá los campos obligatorios: palabra, categoría y al menos una definición', 'error');
        return;
    }

    const sinonimos = sinonimosRaw
        ? sinonimosRaw.split(',').map(s => s.trim()).filter(s => s)
        : [];

    try {
        if (id) {
            // ACTUALIZAR
            const { error: errPal } = await supabaseClient
                .from('palabras')
                .update({ palabra, categoria, silabas, pronunciacion, origen })
                .eq('id', id);
            if (errPal) throw errPal;

            // Borrar definiciones y sinónimos anteriores
            await supabaseClient.from('definiciones').delete().eq('palabra_id', id);
            await supabaseClient.from('sinonimos').delete().eq('palabra_id', id);

            // Insertar nuevas definiciones
            if (definiciones.length > 0) {
                const { error: errDef } = await supabaseClient
                    .from('definiciones')
                    .insert(definiciones.map(d => ({ palabra_id: id, ...d })));
                if (errDef) throw errDef;
            }

            // Insertar nuevos sinónimos
            if (sinonimos.length > 0) {
                const { error: errSin } = await supabaseClient
                    .from('sinonimos')
                    .insert(sinonimos.map(s => ({ palabra_id: id, sinonimo: s })));
                if (errSin) throw errSin;
            }

            mostrarToast(`"${palabra}" actualizada correctamente`, 'success');

        } else {
            // CREAR
            const { data: nueva, error: errPal } = await supabaseClient
                .from('palabras')
                .insert({ palabra, categoria, silabas, pronunciacion, origen })
                .select()
                .single();
            if (errPal) throw errPal;

            const nuevoId = nueva.id;

            // Insertar definiciones
            if (definiciones.length > 0) {
                const { error: errDef } = await supabaseClient
                    .from('definiciones')
                    .insert(definiciones.map(d => ({ palabra_id: nuevoId, ...d })));
                if (errDef) throw errDef;
            }

            // Insertar sinónimos
            if (sinonimos.length > 0) {
                const { error: errSin } = await supabaseClient
                    .from('sinonimos')
                    .insert(sinonimos.map(s => ({ palabra_id: nuevoId, sinonimo: s })));
                if (errSin) throw errSin;
            }

            mostrarToast(`"${palabra}" creada correctamente`, 'success');
        }

        cerrarModal();
        await cargarPalabras();

    } catch (error) {
        console.error('Error guardando:', error);
        if (error.code === 'PGRST301' || error.message?.includes('JWT')) {
            mostrarToast('Sesión expirada. Ingresá de nuevo.', 'error');
            setTimeout(() => logout(), 1500);
        } else {
            mostrarToast('Error al guardar: ' + (error.message || 'Error desconocido'), 'error');
        }
    }
}

// ============================================================
// CRUD: ELIMINAR
// ============================================================
function confirmarEliminar(id) {
    palabraAEliminar = id;
    const p = todasLasPalabras.find(x => x.id === id);
    document.getElementById('confirmText').innerHTML =
        `¿Estás seguro de que querés eliminar <strong>"${escaparHTML(p.palabra)}"</strong>? Esta acción no se puede deshacer.`;
    document.getElementById('modalConfirmar').classList.add('open');
}

async function eliminarPalabra() {
    if (!palabraAEliminar) return;

    try {
        // Las definiciones y sinónimos se eliminan en cascada (ON DELETE CASCADE)
        const { error } = await supabaseClient
            .from('palabras')
            .delete()
            .eq('id', palabraAEliminar);

        if (error) throw error;

        mostrarToast('Palabra eliminada correctamente', 'success');
        palabraAEliminar = null;
        document.getElementById('modalConfirmar').classList.remove('open');
        await cargarPalabras();

    } catch (error) {
        console.error('Error eliminando:', error);
        mostrarToast('Error al eliminar', 'error');
    }
}

// ============================================================
// EDITAR: Cargar datos en el form
// ============================================================
function editarPalabra(id) {
    const p = todasLasPalabras.find(x => x.id === id);
    if (!p) return;

    palabraEnEdicion = id;
    document.getElementById('formPalabraId').value = id;
    document.getElementById('formPalabraTexto').value = p.palabra;
    document.getElementById('formCategoria').value = p.categoria;
    document.getElementById('formSilabas').value = p.silabas;
    document.getElementById('formPronunciacion').value = p.pronunciacion;
    document.getElementById('formOrigen').value = p.origen;
    document.getElementById('formSinonimos').value = p.sinonimos.join(', ');

    // Cargar definiciones
    const container = document.getElementById('definicionesContainer');
    container.innerHTML = '';
    p.definiciones.forEach((d, i) => agregarDefBlock(i + 1, d.texto, d.ejemplo));

    document.getElementById('modalTitulo').textContent = `Editar: ${p.palabra}`;
    document.getElementById('modalPalabra').classList.add('open');
}

// ============================================================
// MODAL: NUEVA PALABRA
// ============================================================
function nuevaPalabra() {
    palabraEnEdicion = null;
    document.getElementById('formPalabra').reset();
    document.getElementById('formPalabraId').value = '';
    document.getElementById('definicionesContainer').innerHTML = '';
    agregarDefBlock(1);
    document.getElementById('modalTitulo').textContent = 'Nueva palabra';
    document.getElementById('modalPalabra').classList.add('open');
}

// ============================================================
// DEFINICIONES DINÁMICAS
// ============================================================
function agregarDefBlock(numero, texto = '', ejemplo = '') {
    const container = document.getElementById('definicionesContainer');
    const div = document.createElement('div');
    div.className = 'def-item';
    div.innerHTML = `
        <div class="def-item-header">
            <span class="def-item-num">Definición ${numero}</span>
            <button type="button" class="def-item-remove" onclick="this.closest('.def-item').remove(); renumerarDefs()">
                <i class="fas fa-times"></i>
            </button>
        </div>
        <div class="admin-form-group">
            <input type="text" class="def-texto" value="${escaparHTML(texto)}" placeholder="Texto de la definición" required>
        </div>
        <div class="admin-form-group">
            <input type="text" class="def-ejemplo" value="${escaparHTML(ejemplo)}" placeholder="Ejemplo de uso (opcional)">
        </div>
    `;
    container.appendChild(div);
}

function renumerarDefs() {
    document.querySelectorAll('.def-item').forEach((item, i) => {
        item.querySelector('.def-item-num').textContent = `Definición ${i + 1}`;
    });
}

// ============================================================
// MODAL: ABRIR / CERRAR
// ============================================================
function cerrarModal() {
    document.getElementById('modalPalabra').classList.remove('open');
    palabraEnEdicion = null;
    document.getElementById('synonymSuggestions').innerHTML = '';
}

// ============================================================
// SILABEO AUTOMÁTICO (español)
// ============================================================
// Algoritmo basado en posiciones de vocales — sin loops infinitos.
// 1. Se filtran caracteres no válidos (espacios, puntuación, etc.)
// 2. Se marcan las 'u' mudas en 'qu' y 'gu' antes de e/i
// 3. Se localizan todas las vocales
// 4. Se calculan los puntos de corte entre pares de vocales consecutivas
// 5. Se mapea de vuelta a los caracteres originales con acentos
function separarSilabas(palabra) {
    if (!palabra || palabra.length < 2) return palabra;

    // Solo mantener letras válidas del español (sin espacios, guiones, etc.)
    const original = palabra.replace(/[^a-zA-ZáéíóúüñÁÉÍÓÚÜÑ]/g, '');
    if (original.length < 2) return original;

    // Normalizar: minúsculas + quitar acentos para el análisis
    const norm = original.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    if (norm.length < 2) return original;

    const vocales = 'aeiou';
    const fuertes = 'aeo';
    const debiles = 'iu';
    const inseparables = ['bl','br','cl','cr','dr','fl','fr','gl','gr','pl','pr','tr','tl','rr','ch','ll'];

    function esVocal(c) { return vocales.includes(c); }
    function esFuerte(c) { return fuertes.includes(c); }
    function esDebil(c) { return debiles.includes(c); }

    // Pre-procesar: marcar 'u' muda en 'qu' y 'gu' antes de e/i
    // Reemplazamos por 'x' para que no se detecte como vocal
    let chars = norm.split('');
    for (let k = 0; k < chars.length; k++) {
        if (chars[k] === 'q' && k + 1 < chars.length && chars[k + 1] === 'u'
            && k + 2 < chars.length && (chars[k + 2] === 'e' || chars[k + 2] === 'i')) {
            chars[k + 1] = 'x'; // u muda en "qu"
        }
        if (chars[k] === 'g' && k + 1 < chars.length && chars[k + 1] === 'u'
            && k + 2 < chars.length && (chars[k + 2] === 'e' || chars[k + 2] === 'i')
            && original[k + 1] !== 'ü' && original[k + 1] !== 'Ü') {
            chars[k + 1] = 'x'; // u muda en "gu" (pero NO en "gü")
        }
    }
    const proc = chars.join('');

    // Encontrar posiciones de todas las vocales
    let vowelPos = [];
    for (let k = 0; k < proc.length; k++) {
        if (esVocal(proc[k])) vowelPos.push(k);
    }

    // Sin vocales o una sola → una sílaba
    if (vowelPos.length <= 1) return original;

    // Calcular puntos de corte entre pares de vocales consecutivas
    let breaks = new Set();

    for (let v = 0; v < vowelPos.length - 1; v++) {
        const p1 = vowelPos[v];
        const p2 = vowelPos[v + 1];
        const gap = p2 - p1 - 1; // consonantes entre las dos vocales

        if (gap === 0) {
            // Vocales adyacentes: ¿hiato o diptongo?
            const c1 = proc[p1], c2 = proc[p2];
            const f1 = esFuerte(c1), f2 = esFuerte(c2);
            const d1 = esDebil(c1), d2 = esDebil(c2);

            // Verificar acentos en la original para las débiles
            const o1 = original[p1], o2 = original[p2];
            const d1Acentuada = d1 && /[íúÍÚ]/.test(o1);
            const d2Acentuada = d2 && /[íúÍÚ]/.test(o2);

            // Hiato: fuerte+fuerte, o débil acentuada con fuerte
            if ((f1 && f2) || (f1 && d2Acentuada) || (f2 && d1Acentuada)) {
                breaks.add(p2); // corte antes de la segunda vocal
            }
            // Diptongo: no hay corte
        } else if (gap === 1) {
            // Una consonante entre vocales → inicia la próxima sílaba (CV-CV)
            breaks.add(p1 + 1);
        } else if (gap === 2) {
            const c1 = proc[p1 + 1], c2 = proc[p1 + 2];
            const par = c1 + c2;
            if (inseparables.includes(par)) {
                // Grupo inseparable va con la vocal siguiente: V-CV
                breaks.add(p1 + 1);
            } else {
                // Dividir: VC-CV
                breaks.add(p1 + 2);
            }
        } else {
            // 3+ consonantes: las últimas forman onset de la próxima sílaba
            const ult2 = proc.substring(p2 - 2, p2);
            if (inseparables.includes(ult2)) {
                breaks.add(p2 - 2); // las últimas 2 van con la vocal siguiente
            } else {
                breaks.add(p2 - 1); // la última va con la vocal siguiente
            }
        }
    }

    // Construir sílabas usando los puntos de corte
    const sortedBreaks = [...breaks].sort((a, b) => a - b);
    let silabas = [];
    let prev = 0;
    for (const b of sortedBreaks) {
        silabas.push(proc.substring(prev, b));
        prev = b;
    }
    silabas.push(proc.substring(prev));

    // Mapear de vuelta a caracteres originales (con acentos y ü)
    let result = [];
    let origIdx = 0;
    for (const sil of silabas) {
        let silabaOrig = '';
        for (let j = 0; j < sil.length; j++) {
            if (origIdx < original.length) {
                silabaOrig += original[origIdx];
                origIdx++;
            }
        }
        result.push(silabaOrig);
    }

    return result.join('-');
}

// Auto-completar sílabas al escribir la palabra
let silabasAutocompletadas = false;

function onPalabraInput() {
    const palabra = document.getElementById('formPalabraTexto').value.trim();
    const silabasInput = document.getElementById('formSilabas');

    // Solo auto-completar si el campo está vacío o fue auto-completado antes
    if (palabra.length >= 2 && (!silabasInput.value || silabasAutocompletadas)) {
        const separadas = separarSilabas(palabra);
        silabasInput.value = separadas;
        silabasAutocompletadas = true;
    }

    // Reset flag si el usuario borra la palabra
    if (!palabra) {
        silabasAutocompletadas = false;
    }
}

// ============================================================
// SUGERIR SINÓNIMOS (Datamuse API)
// ============================================================
async function sugerirSinonimos() {
    const palabra = document.getElementById('formPalabraTexto').value.trim();
    const container = document.getElementById('synonymSuggestions');

    if (!palabra) {
        container.innerHTML = '<span class="syn-suggest-hint">Escribí una palabra primero</span>';
        return;
    }

    container.innerHTML = '<span class="syn-suggest-loading"><i class="fas fa-circle-notch fa-spin"></i> Buscando...</span>';

    try {
        const response = await fetch(`https://api.datamuse.com/words?rel_syn=${encodeURIComponent(palabra)}&v=es&max=8`);
        if (!response.ok) throw new Error('Error en la API');
        const data = await response.json();

        if (data.length === 0) {
            container.innerHTML = '<span class="syn-suggest-hint">No se encontraron sinónimos</span>';
            return;
        }

        const sinonimosActuales = document.getElementById('formSinonimos').value
            .split(',').map(s => s.trim().toLowerCase()).filter(s => s);

        container.innerHTML = data.map(item => {
            const word = item.word;
            const yaAgregado = sinonimosActuales.includes(word.toLowerCase());
            return `<button type="button" class="syn-suggest-chip ${yaAgregado ? 'selected' : ''}"
                        data-synonym="${escaparHTML(word)}"
                        onclick="agregarSinonimoSugerido(this)">
                        ${escaparHTML(word)}
                        ${yaAgregado ? '<i class="fas fa-check"></i>' : '<i class="fas fa-plus"></i>'}
                    </button>`;
        }).join('');

    } catch (error) {
        console.error('Error buscando sinónimos:', error);
        container.innerHTML = '<span class="syn-suggest-hint">Error al buscar sinónimos. Intentá de nuevo.</span>';
    }
}

function agregarSinonimoSugerido(btn) {
    const sinonimo = btn.dataset.synonym;
    const input = document.getElementById('formSinonimos');
    const actuales = input.value.split(',').map(s => s.trim()).filter(s => s);

    if (actuales.map(s => s.toLowerCase()).includes(sinonimo.toLowerCase())) {
        // Ya está, lo quitamos
        const nuevos = actuales.filter(s => s.toLowerCase() !== sinonimo.toLowerCase());
        input.value = nuevos.join(', ');
        btn.classList.remove('selected');
        btn.innerHTML = `${escaparHTML(sinonimo)} <i class="fas fa-plus"></i>`;
        return;
    }

    // Agregar
    actuales.push(sinonimo);
    input.value = actuales.join(', ');
    btn.classList.add('selected');
    btn.innerHTML = `${escaparHTML(sinonimo)} <i class="fas fa-check"></i>`;
}

// ============================================================
// IMPORT / EXPORT: JSON
// ============================================================
async function importarJSON(file) {
    try {
        const text = await file.text();
        const datos = JSON.parse(text);

        if (!Array.isArray(datos)) {
            mostrarToast('El JSON debe ser un array de palabras', 'error');
            return;
        }

        let importadas = 0;
        let errores = 0;

        for (const p of datos) {
            try {
                if (!p.palabra || !p.categoria || !p.definiciones || p.definiciones.length === 0) {
                    errores++;
                    continue;
                }

                // Crear palabra
                const { data: nueva, error: errPal } = await supabaseClient
                    .from('palabras')
                    .insert({
                        palabra: p.palabra,
                        categoria: p.categoria,
                        silabas: p.silabas || '',
                        pronunciacion: p.pronunciacion || '',
                        origen: p.origen || ''
                    })
                    .select()
                    .single();

                if (errPal) {
                    if (errPal.code === '23505') {
                        // Palabra duplicada, saltar
                        continue;
                    }
                    throw errPal;
                }

                // Insertar definiciones
                const defs = p.definiciones.map((d, i) => ({
                    palabra_id: nueva.id,
                    numero: i + 1,
                    texto: d.texto,
                    ejemplo: d.ejemplo || ''
                }));
                await supabaseClient.from('definiciones').insert(defs);

                // Insertar sinónimos
                if (p.sinonimos && p.sinonimos.length > 0) {
                    const sins = p.sinonimos.map(s => ({
                        palabra_id: nueva.id,
                        sinonimo: s
                    }));
                    await supabaseClient.from('sinonimos').insert(sins);
                }

                importadas++;
            } catch (e) {
                errores++;
                console.error('Error importando palabra:', p.palabra, e);
            }
        }

        mostrarToast(`Importación completa: ${importadas} palabras importadas${errores > 0 ? `, ${errores} errores` : ''}`, importadas > 0 ? 'success' : 'error');
        await cargarPalabras();

    } catch (error) {
        console.error('Error parseando JSON:', error);
        mostrarToast('Error al leer el archivo JSON', 'error');
    }
}

async function exportarJSON() {
    const datos = todasLasPalabras.map(p => ({
        palabra: p.palabra,
        categoria: p.categoria,
        silabas: p.silabas,
        pronunciacion: p.pronunciacion,
        origen: p.origen,
        definiciones: p.definiciones,
        sinonimos: p.sinonimos
    }));

    const blob = new Blob([JSON.stringify(datos, null, 4)], { type: 'application/json' });
    descargarArchivo(blob, `dicciopeques_${fechaArchivo()}.json`);
    mostrarToast('JSON exportado correctamente', 'success');
}

function descargarTemplateJSON() {
    const template = [{
        palabra: "",
        categoria: "sustantivo",
        silabas: "",
        pronunciacion: "",
        origen: "",
        definiciones: [
            { texto: "", ejemplo: "" }
        ],
        sinonimos: [""]
    }];

    const blob = new Blob([JSON.stringify(template, null, 4)], { type: 'application/json' });
    descargarArchivo(blob, 'dicciopeques_template.json');
    mostrarToast('Template JSON descargado', 'success');
}

// ============================================================
// IMPORT / EXPORT: XLSX
// ============================================================
async function importarXLSX(file) {
    if (typeof XLSX === 'undefined') {
        mostrarToast('Error: Librería XLSX no cargada', 'error');
        return;
    }

    try {
        const data = await file.arrayBuffer();
        const workbook = XLSX.read(data, { type: 'array' });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(sheet);

        let importadas = 0;
        let errores = 0;

        for (const row of rows) {
            try {
                const palabra = (row.palabra || '').trim();
                const categoria = (row.categoria || '').trim().toLowerCase();
                if (!palabra || !categoria) { errores++; continue; }

                // Crear palabra
                const { data: nueva, error: errPal } = await supabaseClient
                    .from('palabras')
                    .insert({
                        palabra,
                        categoria,
                        silabas: (row.silabas || '').trim(),
                        pronunciacion: (row.pronunciacion || '').trim(),
                        origen: (row.origen || '').trim()
                    })
                    .select()
                    .single();

                if (errPal) {
                    if (errPal.code === '23505') continue;
                    throw errPal;
                }

                // Definiciones: columna "def1_texto", "def1_ejemplo", "def2_texto", etc.
                let defNum = 1;
                while (row[`def${defNum}_texto`]) {
                    const texto = (row[`def${defNum}_texto`] || '').trim();
                    const ejemplo = (row[`def${defNum}_ejemplo`] || '').trim();
                    if (texto) {
                        await supabaseClient.from('definiciones').insert({
                            palabra_id: nueva.id,
                            numero: defNum,
                            texto,
                            ejemplo
                        });
                    }
                    defNum++;
                }

                // Sinónimos: columna "sinonimos" separados por coma, o "sinonimo1", "sinonimo2", etc.
                let sinonimos = [];
                if (row.sinonimos) {
                    sinonimos = row.sinonimos.split(',').map(s => s.trim()).filter(s => s);
                } else {
                    let sinNum = 1;
                    while (row[`sinonimo${sinNum}`]) {
                        const s = (row[`sinonimo${sinNum}`] || '').trim();
                        if (s) sinonimos.push(s);
                        sinNum++;
                    }
                }

                if (sinonimos.length > 0) {
                    await supabaseClient.from('sinonimos').insert(
                        sinonimos.map(s => ({ palabra_id: nueva.id, sinonimo: s }))
                    );
                }

                importadas++;
            } catch (e) {
                errores++;
                console.error('Error importando fila:', e);
            }
        }

        mostrarToast(`Importación XLSX: ${importadas} palabras${errores > 0 ? `, ${errores} errores` : ''}`, importadas > 0 ? 'success' : 'error');
        await cargarPalabras();

    } catch (error) {
        console.error('Error leyendo XLSX:', error);
        mostrarToast('Error al leer el archivo XLSX', 'error');
    }
}

function exportarXLSX() {
    if (typeof XLSX === 'undefined') {
        mostrarToast('Error: Librería XLSX no cargada', 'error');
        return;
    }

    const rows = todasLasPalabras.map(p => {
        const row = {
            palabra: p.palabra,
            categoria: p.categoria,
            silabas: p.silabas,
            pronunciacion: p.pronunciacion,
            origen: p.origen
        };

        p.definiciones.forEach((d, i) => {
            row[`def${i + 1}_texto`] = d.texto;
            row[`def${i + 1}_ejemplo`] = d.ejemplo;
        });

        p.sinonimos.forEach((s, i) => {
            row[`sinonimo${i + 1}`] = s;
        });

        return row;
    });

    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Palabras');
    XLSX.writeFile(wb, `dicciopeques_${fechaArchivo()}.xlsx`);
    mostrarToast('XLSX exportado correctamente', 'success');
}

function descargarTemplateXLSX() {
    if (typeof XLSX === 'undefined') {
        mostrarToast('Error: Librería XLSX no cargada', 'error');
        return;
    }

    const template = [{
        palabra: 'ejemplo',
        categoria: 'sustantivo',
        silabas: 'ejem-plo',
        pronunciacion: '/eˈxem.plo/',
        origen: 'Del latín exemplum',
        def1_texto: 'Texto de la primera definición',
        def1_ejemplo: 'Ejemplo de uso',
        def2_texto: 'Texto de la segunda definición (opcional)',
        def2_ejemplo: 'Segundo ejemplo (opcional)',
        sinonimo1: 'modelo',
        sinonimo2: 'patrón'
    }];

    const ws = XLSX.utils.json_to_sheet(template);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Template');
    XLSX.writeFile(wb, 'dicciopeques_template.xlsx');
    mostrarToast('Template XLSX descargado', 'success');
}

// ============================================================
// UTILIDADES
// ============================================================
function descargarArchivo(blob, nombre) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = nombre;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function fechaArchivo() {
    const d = new Date();
    return `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;
}

function mostrarToast(mensaje, tipo = 'info') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `admin-toast ${tipo}`;

    const icono = tipo === 'success' ? 'fa-check-circle'
        : tipo === 'error' ? 'fa-exclamation-circle'
        : 'fa-info-circle';

    toast.innerHTML = `<i class="fas ${icono}"></i> ${mensaje}`;
    container.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(-10px)';
        toast.style.transition = 'all 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3500);
}

// ============================================================
// EVENT LISTENERS
// ============================================================
function initEventListeners() {
    if (eventListenersInitialized) return;
    eventListenersInitialized = true;

    // Logout
    document.getElementById('btnLogout').addEventListener('click', logout);

    // Nueva palabra
    document.getElementById('btnNueva').addEventListener('click', nuevaPalabra);

    // Guardar
    document.getElementById('formPalabra').addEventListener('submit', guardarPalabra);

    // Cancelar / cerrar modal
    document.getElementById('btnCancelar').addEventListener('click', cerrarModal);
    document.getElementById('modalClose').addEventListener('click', cerrarModal);
    document.getElementById('modalPalabra').addEventListener('click', (e) => {
        if (e.target === e.currentTarget) cerrarModal();
    });

    // Agregar definición
    document.getElementById('btnAgregarDef').addEventListener('click', () => {
        const count = document.querySelectorAll('.def-item').length;
        agregarDefBlock(count + 1);
    });

    // Auto-completar sílabas al escribir la palabra
    document.getElementById('formPalabraTexto').addEventListener('input', onPalabraInput);

    // Reset flag de sílabas auto cuando el usuario edita manualmente
    document.getElementById('formSilabas').addEventListener('input', () => {
        silabasAutocompletadas = false;
    });

    // Sugerir sinónimos
    document.getElementById('btnSugerirSinonimos').addEventListener('click', sugerirSinonimos);

    // Buscador
    document.getElementById('adminSearch').addEventListener('input', (e) => {
        renderTabla(e.target.value.trim());
    });

    // Eliminar
    document.getElementById('btnConfirmEliminar').addEventListener('click', eliminarPalabra);
    document.getElementById('btnConfirmCancelar').addEventListener('click', () => {
        palabraAEliminar = null;
        document.getElementById('modalConfirmar').classList.remove('open');
    });
    document.getElementById('confirmClose').addEventListener('click', () => {
        palabraAEliminar = null;
        document.getElementById('modalConfirmar').classList.remove('open');
    });
    document.getElementById('modalConfirmar').addEventListener('click', (e) => {
        if (e.target === e.currentTarget) {
            palabraAEliminar = null;
            e.currentTarget.classList.remove('open');
        }
    });

    // Dropdowns
    document.getElementById('btnImportar').addEventListener('click', (e) => {
        e.stopPropagation();
        document.getElementById('importMenu').parentElement.classList.toggle('open');
        document.getElementById('exportMenu').parentElement.classList.remove('open');
    });
    document.getElementById('btnExportar').addEventListener('click', (e) => {
        e.stopPropagation();
        document.getElementById('exportMenu').parentElement.classList.toggle('open');
        document.getElementById('importMenu').parentElement.classList.remove('open');
    });
    document.addEventListener('click', () => {
        document.querySelectorAll('.admin-dropdown').forEach(d => d.classList.remove('open'));
    });

    // Import JSON
    document.getElementById('btnImportJSON').addEventListener('click', () => {
        document.getElementById('fileInputJSON').click();
    });
    document.getElementById('fileInputJSON').addEventListener('change', (e) => {
        if (e.target.files[0]) {
            importarJSON(e.target.files[0]);
            e.target.value = '';
        }
    });

    // Import XLSX
    document.getElementById('btnImportXLSX').addEventListener('click', () => {
        document.getElementById('fileInputXLSX').click();
    });
    document.getElementById('fileInputXLSX').addEventListener('change', (e) => {
        if (e.target.files[0]) {
            importarXLSX(e.target.files[0]);
            e.target.value = '';
        }
    });

    // Export JSON
    document.getElementById('btnExportJSON').addEventListener('click', exportarJSON);

    // Export XLSX
    document.getElementById('btnExportXLSX').addEventListener('click', exportarXLSX);

    // Download templates
    document.getElementById('btnDownloadTemplateJSON').addEventListener('click', descargarTemplateJSON);
    document.getElementById('btnDownloadTemplateXLSX').addEventListener('click', descargarTemplateXLSX);

    // Atajos de teclado
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            cerrarModal();
            palabraAEliminar = null;
            document.getElementById('modalConfirmar').classList.remove('open');
        }
    });
}
