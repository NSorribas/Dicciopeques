// ============================================================
// BASE DE DATOS
// ============================================================
const DICCIONARIO = [
    {
        palabra: "alboroto",
        categoria: "sustantivo",
        silabas: "al-bo-ro-to",
        pronunciacion: "/al.boˈɾo.to/",
        origen: "Del español alborotar, de origen onomatopéyico",
        definiciones: [
            { texto: "Ruido, vocería o confusión de muchas personas.", ejemplo: "El alboroto en la plaza despertó a todo el vecindario." },
            { texto: "Perturbación o alteración del orden público.", ejemplo: "Varios detenidos por el alboroto en la manifestación." }
        ],
        sinonimos: ["bullicio", "estrépito", "vocerío", "tumulto", "revuelo"]
    },
    {
        palabra: "atardecer",
        categoria: "verbo",
        silabas: "ar-ta-rde-cer",
        pronunciacion: "/aɾ.taɾ.ðeˈθeɾ/",
        origen: "Del latín ad tardescere, 'hacerse tarde'",
        definiciones: [
            { texto: "Dicho del día: ir acabándose, ir cayendo la tarde.", ejemplo: "Nos sentamos en la terraza a atardecer." },
            { texto: "Llegar la tarde o el ocaso.", ejemplo: "Atardecía cuando por fin llegamos al pueblo." }
        ],
        sinonimos: ["ocasentar", "anochecer", "caer la tarde"]
    },
    {
        palabra: "melancolía",
        categoria: "sustantivo",
        silabas: "me-lan-co-lí-a",
        pronunciacion: "/me.laŋ.koˈli.a/",
        origen: "Del griego melancholía, 'bilis negra'",
        definiciones: [
            { texto: "Tristeza vaga, profunda y permanente, que no tiene causa concreta.", ejemplo: "Una melancolía dulce la invadía al escuchar esa canción." },
            { texto: "En medicina antigua, uno de los cuatro humores del cuerpo.", ejemplo: "La melancolía era considerada un exceso de bilis negra." }
        ],
        sinonimos: ["tristeza", "nostalgia", "pena", "desconsuelo", "abatimiento"]
    },
    {
        palabra: "efímero",
        categoria: "adjetivo",
        silabas: "e-fí-me-ro",
        pronunciacion: "/eˈfi.me.ɾo/",
        origen: "Del griego ephemeros, 'que dura un día'",
        definiciones: [
            { texto: "Que dura muy poco tiempo, pasajero, transitorio.", ejemplo: "La fama es efímera si no se cultiva con trabajo." },
            { texto: "En biología, dicho de un organismo: que vive muy poco tiempo.", ejemplo: "Las efímeras son insectos cuya vida adulta dura apenas horas." }
        ],
        sinonimos: ["pasajero", "transitorio", "fugaz", "breve", "temporal"]
    },
    {
        palabra: "vehemencia",
        categoria: "sustantivo",
        silabas: "ve-he-men-cia",
        pronunciacion: "/be.eˈmen.θja/",
        origen: "Del latín vehementia",
        definiciones: [
            { texto: "Cualidad de vehemente; impetuosidad, furor, violencia en el modo de actuar o hablar.", ejemplo: "Defendió sus ideas con vehemencia ante el tribunal." },
            { texto: "Intensidad grande de un sentimiento o pasión.", ejemplo: "La vehemencia de su amor la conducía a decisiones temerarias." }
        ],
        sinonimos: ["impetuosidad", "furia", "ardor", "pasión", "ímpetu"]
    },
    {
        palabra: "desvelar",
        categoria: "verbo",
        silabas: "des-ve-lar",
        pronunciacion: "/des.beˈlaɾ/",
        origen: "Del prefijo des- + velar, del latín vigilare",
        definiciones: [
            { texto: "Quitar el sueño, impedir que alguien duerma.", ejemplo: "La preocupación por el examen le desveló toda la noche." },
            { texto: "Descubrir o revelar algo oculto o secreto.", ejemplo: "El informe desveló datos alarmantes sobre la contaminación." }
        ],
        sinonimos: ["insomniar", "revelar", "descubrir", "destapar"]
    },
    {
        palabra: "serendipia",
        categoria: "sustantivo",
        silabas: "se-ren-di-pia",
        pronunciacion: "/se.ɾenˈdi.pja/",
        origen: "Del inglés serendipity, acuñado por Horace Walpole en 1754, inspirado en un cuento persa",
        definiciones: [
            { texto: "Hallazgo valioso que se produce de manera accidental o inesperada, mientras se buscaba otra cosa.", ejemplo: "El descubrimiento de la penicilina fue una serendipia científica." },
            { texto: "Cualidad de hacer descubrimientos por accidente y sagacidad.", ejemplo: "Su serendipia le llevó a encontrar la solución mientras paseaba." }
        ],
        sinonimos: ["hallazgo", "descubrimiento casual", "casualidad afortunada"]
    },
    {
        palabra: "susurrar",
        categoria: "verbo",
        silabas: "su-su-rrar",
        pronunciacion: "/su.suˈɾaɾ/",
        origen: "Del latín susurrare, onomatopéyico",
        definiciones: [
            { texto: "Hablar en voz muy baja, de modo que solo se oiga un sonido suave y confuso.", ejemplo: "Le susurró al oído que la amaba." },
            { texto: "Producir un sonido suave y continuado, como el viento entre las hojas.", ejemplo: "La brisa susurraba entre los álamos del parque." }
        ],
        sinonimos: ["cuchichear", "murmurar", "murmullar"]
    },
    {
        palabra: "petricor",
        categoria: "sustantivo",
        silabas: "pe-tri-cor",
        pronunciacion: "/pe.tɾiˈkoɾ/",
        origen: "Del griego petra (piedra) + ichor (líquido que fluía por las venas de los dioses), acuñado en 1964",
        definiciones: [
            { texto: "Olor terroso y agradable que se produce cuando llueve sobre suelo seco.", ejemplo: "Tras la primera tormenta del otoño, el petricor inundó el jardín." }
        ],
        sinonimos: ["olor a tierra mojada", "aroma pluvial"]
    },
    {
        palabra: "inefable",
        categoria: "adjetivo",
        silabas: "i-ne-fa-ble",
        pronunciacion: "/i.neˈfa.βle/",
        origen: "Del latín ineffabilis, 'que no se puede expresar con palabras'",
        definiciones: [
            { texto: "Que no se puede explicar o describir con palabras por su intensidad o naturaleza.", ejemplo: "Sintió un gozo inefable al ver a su hija después de tantos años." },
            { texto: "Que debe guardarse en silencio, por respeto o misterio.", ejemplo: "El nombre de Dios era considerado inefable en la tradición hebrea." }
        ],
        sinonimos: ["inexpresable", "indescriptible", "indecible"]
    },
    {
        palabra: "luminiscencia",
        categoria: "sustantivo",
        silabas: "lu-mi-nis-cen-cia",
        pronunciacion: "/lu.mi.nisˈθen.θja/",
        origen: "Del latín lumen (luz) + -escencia",
        definiciones: [
            { texto: "Emisión de luz por un cuerpo que no está incandescente, producida por causas distintas a la temperatura elevada.", ejemplo: "La luminiscencia de las luciérnagas ilumina el campo en verano." },
            { texto: "En sentido figurado, cualidad de brillar o destacar de forma especial.", ejemplo: "La luminiscencia de su talento era evidente en cada obra." }
        ],
        sinonimos: ["fosforescencia", "fluorescencia", "resplandor", "brillo"]
    },
    {
        palabra: "amanecer",
        categoria: "verbo",
        silabas: "a-ma-ne-cer",
        pronunciacion: "/a.ma.neˈθeɾ/",
        origen: "Del latín ad manescere, 'hacerse mañana'",
        definiciones: [
            { texto: "Llegar la mañana, empezar a aparecer la luz del sol.", ejemplo: "Amaneció nublado pero luego salió el sol." },
            { texto: "Encontrarse en determinado estado al llegar la mañana.", ejemplo: "Amaneció con fiebre y tuvo que quedarse en cama." }
        ],
        sinonimos: ["alborear", "rayar el alba", "despuntar el día"]
    },
    {
        palabra: "recóndito",
        categoria: "adjetivo",
        silabas: "re-cón-di-to",
        pronunciacion: "/reˈkon.di.to/",
        origen: "Del latín reconditus, 'escondido, oculto'",
        definiciones: [
            { texto: "Muy escondido, oculto o difícil de alcanzar.", ejemplo: "En un rincón recóndito del bosque encontraron la cueva." },
            { texto: "Profundo, en sentido figurado, referido a pensamientos o sentimientos.", ejemplo: "Guardaba en lo más recóndito de su memoria aquel verano." }
        ],
        sinonimos: ["oculto", "escondido", "arcano", "profundo", "ignoto"]
    },
    {
        palabra: "ondular",
        categoria: "verbo",
        silabas: "on-du-lar",
        pronunciacion: "/on.duˈlaɾ/",
        origen: "Del latín undulare, derivado de unda (ola)",
        definiciones: [
            { texto: "Moverse formando ondulaciones, con movimiento semejante al de las olas.", ejemplo: "La bandera ondulaba con el viento de la montaña." },
            { texto: "Dar forma de onda a algo.", ejemplo: "El peluquero le onduló el cabello con tenacillas." }
        ],
        sinonimos: ["ondear", "flamear", "culebrear", "serpentear"]
    },
    {
        palabra: "perenne",
        categoria: "adjetivo",
        silabas: "pe-ren-ne",
        pronunciacion: "/peˈren.ne/",
        origen: "Del latín perennis, 'que dura todo el año'",
        definiciones: [
            { texto: "Que dura para siempre o por mucho tiempo, continuo, incesante.", ejemplo: "El perenne debate entre la razón y la emoción." },
            { texto: "En botánica, dicho de una planta: que vive más de dos años.", ejemplo: "Los robles son árboles perennes que pueden vivir siglos." }
        ],
        sinonimos: ["eterno", "constante", "continuo", "imperecedero", "inagotable"]
    },
    {
        palabra: "madrugar",
        categoria: "verbo",
        silabas: "ma-dru-gar",
        pronunciacion: "/ma.ðɾuˈɣaɾ/",
        origen: "De madrugada, del latín matutinus, 'relativo a la mañana'",
        definiciones: [
            { texto: "Levantarse muy de mañana, antes de lo acostumbrado.", ejemplo: "Madruga y verás el amanecer más hermoso del año." },
            { texto: "Llegar antes que otros a algo, anticiparse.", ejemplo: "Madrugó en la fila para conseguir las entradas." }
        ],
        sinonimos: ["levantarse temprano", "madronear", "anticiparse"]
    },
    {
        palabra: "azabache",
        categoria: "sustantivo",
        silabas: "a-za-ba-che",
        pronunciacion: "/a.θaˈβa.tʃe/",
        origen: "Del árabe as-sabach, 'piedra negra'",
        definiciones: [
            { texto: "Variedad de lignito negra, muy compacta y ligera, que admite buen pulimento. Se usa en joyería.", ejemplo: "Llevaba un colgante de azabache heredado de su abuela." },
            { texto: "De color negro intenso y brillante.", ejemplo: "Sus ojos eran de un azabache profundo e insondable." }
        ],
        sinonimos: ["lignito", "jet", "negro intenso", "ébano"]
    },
    {
        palabra: "sobremesa",
        categoria: "sustantivo",
        silabas: "so-bre-me-sa",
        pronunciacion: "/so.βɾeˈme.sa/",
        origen: "De sobre + mesa",
        definiciones: [
            { texto: "Tiempo que se está a la mesa después de haber comido, conversando.", ejemplo: "La sobremesa se alargó con café y historias de la infancia." },
            { texto: "Mueble que se coloca sobre la mesa para adornarla o protegerla.", ejemplo: "Compró una sobremesa de tela bordada para el comedor." }
        ],
        sinonimos: ["sobremesa", "tertulia", "poscomida", "conversación"]
    },
    {
        palabra: "quirúrgico",
        categoria: "adjetivo",
        silabas: "qui-rúr-gi-co",
        pronunciacion: "/kiˈɾuɾ.xi.ko/",
        origen: "Del griego cheirurgiké, 'relativo a la cirugía'",
        definiciones: [
            { texto: "Perteneciente o relativo a la cirugía.", ejemplo: "El equipo quirúrgico estaba preparado para la intervención." },
            { texto: "En sentido figurado, preciso, exacto, sin margen de error.", ejemplo: "Hizo un análisis quirúrgico del problema, sin dejar cabo suelto." }
        ],
        sinonimos: ["operatorio", "preciso", "exacto", "clínico"]
    },
    {
        palabra: "deshacer",
        categoria: "verbo",
        silabas: "des-ha-cer",
        pronunciacion: "/des.aˈθeɾ/",
        origen: "Del latín disfacere, 'deshacer, desbaratar'",
        definiciones: [
            { texto: "Destruir, desbaratar o descomponer algo hecho.", ejemplo: "Tuvo que deshacer el nudo con paciencia." },
            { texto: "Anular, revocar lo mandado o resuelto.", ejemplo: "El juez decidió deshacer el contrato por falta de pruebas." },
            { texto: "Derretir o disolver algo sólido.", ejemplo: "Deshizo el chocolate al baño maría para la tarta." }
        ],
        sinonimos: ["desbaratar", "anular", "derretir", "desatar", "disolver"]
    },
    {
        palabra: "aurora",
        categoria: "sustantivo",
        silabas: "au-ro-ra",
        pronunciacion: "/auˈɾo.ɾa/",
        origen: "Del latín aurora, 'amanecer', diosa romana del alba",
        definiciones: [
            { texto: "Luz que aparece en el horizonte antes de salir el sol.", ejemplo: "La aurora pintaba el cielo de rosa y dorado." },
            { texto: "Principio u origen de algo.", ejemplo: "Aquel encuentro marcó el aurora de una larga amistad." }
        ],
        sinonimos: ["alba", "amanecer", "alborada", "despertar"]
    },
    {
        palabra: "obstante",
        categoria: "adverbio",
        silabas: "obs-tan-te",
        pronunciacion: "/obˈstan.te/",
        origen: "Del latín obstantem, 'que se opone'",
        definiciones: [
            { texto: "Sin embargo, no obstante, con todo. Indica oposición o contraste respecto de lo dicho antes.", ejemplo: "Hacía frío; obstante, salieron a caminar por la sierra." }
        ],
        sinonimos: ["sin embargo", "no obstante", "con todo", "empero"]
    },
    {
        palabra: "pandereta",
        categoria: "sustantivo",
        silabas: "pan-de-re-ta",
        pronunciacion: "/pan.deˈɾe.ta/",
        origen: "Del latín pandorium, instrumento musical",
        definiciones: [
            { texto: "Instrumento musical de percusión, semejante a la pandereta pero con sonajas de metal.", ejemplo: "En la fiesta gallega tocaban la pandereta y la gaita." },
            { texto: "En sentido figurado, cosa intrascendente o de poca importancia.", ejemplo: "No me vengas con panderetas, quiero resultados serios." }
        ],
        sinonimos: ["pandero", "tamboril", "instrumento de percusión"]
    },
    {
        palabra: "etéreos",
        categoria: "adjetivo",
        silabas: "e-té-re-os",
        pronunciacion: "/eˈte.ɾe.os/",
        origen: "Del latín aetherius, 'del éter, celeste'",
        definiciones: [
            { texto: "Muy sutil, delicado o ligero, como si no perteneciera al mundo material.", ejemplo: "Las nubes formaban figuras etéreas en el cielo del atardecer." },
            { texto: "Perteneciente o relativo al éter, al cielo o a las regiones superiores del aire.", ejemplo: "Los poetas románticos buscaban lo etéreo en sus versos." }
        ],
        sinonimos: ["sutil", "aéreo", "incorpóreo", "celestial", "evanescente"]
    },
    {
        palabra: "encandilar",
        categoria: "verbo",
        silabas: "en-can-di-lar",
        pronunciacion: "/eŋ.kan.diˈlaɾ/",
        origen: "De en- + cándila (vela, candil)",
        definiciones: [
            { texto: "Deslumbrar con luz excesiva, cegar momentáneamente.", ejemplo: "El sol le encandiló al salir del túnel." },
            { texto: "Enamorar o fascinar a alguien, hechizar.", ejemplo: "La encandiló con sus palabras y su elegancia." }
        ],
        sinonimos: ["deslumbrar", "cegar", "fascinar", "hechizar", "enamorar"]
    },
    {
        palabra: "noctámbulo",
        categoria: "adjetivo",
        silabas: "noc-tám-bu-lo",
        pronunciacion: "/nokˈtam.bu.lo/",
        origen: "Del latín nocte + ambulare, 'caminar de noche'",
        definiciones: [
            { texto: "Que tiene costumbre de velar o pasear de noche.", ejemplo: "Era un noctámbulo empedernido: su mejor inspiración llegaba pasadas las dos." },
            { texto: "Dicho de un animal: activo durante la noche.", ejemplo: "Los búhos son aves noctámbulas por excelencia." }
        ],
        sinonimos: ["trasnochador", "nocturno", "velador", "ruiseñor"]
    },
    {
        palabra: "desasosiego",
        categoria: "sustantivo",
        silabas: "de-sa-so-sie-go",
        pronunciacion: "/des.a.soˈsje.ɣo/",
        origen: "De des- + sosiego",
        definiciones: [
            { texto: "Falta de sosiego, inquietud, desazón.", ejemplo: "Un profundo desasosiego se apoderó de ella al leer la carta." },
            { texto: "Estado de intranquilidad o perturbación del ánimo.", ejemplo: "El desasosiego ciudadano crecía con cada nueva medida." }
        ],
        sinonimos: ["inquietud", "desazón", "ansiedad", "desconcierto", "intranquilidad"]
    },
    {
        palabra: "ojalá",
        categoria: "expresion",
        silabas: "o-ja-lá",
        pronunciacion: "/o.xaˈla/",
        origen: "Del árabe andalusí law šá lláh, 'si Dios quiere'",
        definiciones: [
            { texto: "Expresión que denota vivo deseo de que algo suceda o no suceda.", ejemplo: "Ojalá llueva mañana y se llenen los embalses." },
            { texto: "Con subjuntivo: indica deseo irrealizable o improbable.", ejemplo: "Ojalá pudiera volver atrás y cambiar esa decisión." }
        ],
        sinonimos: ["Dios quiera", "ojalá que", "quién pudiera"]
    },
    {
        palabra: "traslúcida",
        categoria: "adjetivo",
        silabas: "tras-lú-ci-da",
        pronunciacion: "/tɾasˈlu.θi.ða/",
        origen: "Del latín translucere, 'traspasar la luz'",
        definiciones: [
            { texto: "Que deja pasar la luz de forma difusa, sin permitir ver con claridad los objetos al otro lado.", ejemplo: "La cortina traslúcida dejaba entrar una luz suave y difusa." },
            { texto: "En sentido figurado, claro, evidente, fácil de percibir.", ejemplo: "Sus intenciones eran traslúcidas para todos menos para él." }
        ],
        sinonimos: ["translúcida", "semitransparente", "nítida", "diáfana"]
    },
    {
        palabra: "albahaca",
        categoria: "sustantivo",
        silabas: "al-ba-ha-ca",
        pronunciacion: "/al.baˈa.ka/",
        origen: "Del árabe al-habaqa, 'la albahaca'",
        definiciones: [
            { texto: "Planta aromática anual de la familia de las labiadas, con hojas de suave perfume, usada en cocina y perfumería.", ejemplo: "Preparó una salsa pesto con albahaca fresca del huerto." },
            { texto: "En algunas culturas, símbolo de amor y protección.", ejemplo: "En la ventana siempre había una maceta de albahaca contra el mal de ojo." }
        ],
        sinonimos: ["basílico", "hierba real", "hierba santa"]
    },
    {
        palabra: "menguar",
        categoria: "verbo",
        silabas: "men-guar",
        pronunciacion: "/menˈɣwaɾ/",
        origen: "Del latín minuere, 'disminuir'",
        definiciones: [
            { texto: "Ir disminuyendo o reduciéndose algo, ir perdiendo intensidad o cantidad.", ejemplo: "La luna comenzó a menguar tras la noche de plenilunio." },
            { texto: "Disminuir, mermar, hacer menor algo.", ejemplo: "Nada podía menguar su entusiasmo por la música." }
        ],
        sinonimos: ["disminuir", "decrecer", "mermar", "decaer", "achicarse"]
    },
    {
        palabra: "hondonada",
        categoria: "sustantivo",
        silabas: "hon-do-na-da",
        pronunciacion: "/on.doˈna.ða/",
        origen: "De hondo + -ada",
        definiciones: [
            { texto: "Depresión del terreno, valle profundo entre montañas o colinas.", ejemplo: "El pueblo se escondía en una hondonada verde y fértil." },
            { texto: "En sentido figurado, situación baja o desfavorable.", ejemplo: "Tras la hondonada de la crisis, llegó la recuperación." }
        ],
        sinonimos: ["valle", "depresión", "hoyada", "cañada", "cuenca"]
    },
    {
        palabra: "arrebol",
        categoria: "sustantivo",
        silabas: "a-rre-bol",
        pronunciacion: "/a.reˈβol/",
        origen: "Del árabe ar-rummān, 'el granado', por el color rojo",
        definiciones: [
            { texto: "Color rojo vivo, especialmente el de las nubes iluminadas por el sol en el amanecer o el ocaso.", ejemplo: "El arrebol del atardecer se reflejaba en el lago." },
            { texto: "Carmín o colorete para el rostro.", ejemplo: "Se aplicó un toque de arrebol en las mejillas antes de salir." }
        ],
        sinonimos: ["rubor", "carmín", "encendimiento", "rojizo", "coloradura"]
    },
    {
        palabra: "madrugada",
        categoria: "sustantivo",
        silabas: "ma-dru-ga-da",
        pronunciacion: "/ma.ðɾuˈɣa.ða/",
        origen: "De madrugar, del latín matutinus",
        definiciones: [
            { texto: "Primeras horas del día, desde que empieza a amanecer hasta que sale el sol.", ejemplo: "Se levantó de madrugada para no perder el tren." },
            { texto: "Tiempo que transcurre desde la medianoche hasta el amanecer.", ejemplo: "La madrugada es el momento más silencioso de la ciudad." }
        ],
        sinonimos: ["alba", "amanecer", "primeras horas", "alborada"]
    },
    {
        palabra: "dichoso",
        categoria: "adjetivo",
        silabas: "di-cho-so",
        pronunciacion: "/diˈtʃo.so/",
        origen: "Del latín dictiosus, 'feliz, afortunado'",
        definiciones: [
            { texto: "Feliz, afortunado, que tiene dicha.", ejemplo: "Era un dichoso que siempre encontraba motivos para sonreír." },
            { texto: "Irónicamente, molesto, fastidioso, maldito.", ejemplo: "El dichoso coche se volvió a averiar en el peor momento." }
        ],
        sinonimos: ["feliz", "afortunado", "bienaventurado", "maldito (irónico)"]
    },
    {
        palabra: "esparcir",
        categoria: "verbo",
        silabas: "es-par-cir",
        pronunciacion: "/es.paɾˈθiɾ/",
        origen: "Del latín spargere, 'esparcir, derramar'",
        definiciones: [
            { texto: "Derramar, extender o distribuir algo por diversas partes.", ejemplo: "El viento esparció las semillas por todo el prado." },
            { texto: "Divertirse, recrearse, distraerse.", ejemplo: "Los niños se esparcieron por el parque riendo y corriendo." }
        ],
        sinonimos: ["derramar", "diseminar", "desparramar", "repartir", "expandir"]
    },
    {
        palabra: "candil",
        categoria: "sustantivo",
        silabas: "can-dil",
        pronunciacion: "/kanˈdil/",
        origen: "Del árabe qandīl, 'lámpara', del griego kandēlē",
        definiciones: [
            { texto: "Lámpara portátil con aceite y mecha, usada antiguamente para alumbrar.", ejemplo: "El anciano bajó al sótano con un candil tembloroso." },
            { texto: "En sentido figurado, persona o cosa que sirve de guía o luz.", ejemplo: "Fue el candil que iluminó el camino de sus discípulos." }
        ],
        sinonimos: ["lámpara", "linterna", "vela", "farol", "mechero"]
    },
    {
        palabra: "centellear",
        categoria: "verbo",
        silabas: "cen-te-lle-ar",
        pronunciacion: "/θen.te.ʎeˈaɾ/",
        origen: "De centella, del latín scintilla, 'chispa'",
        definiciones: [
            { texto: "Emitir centellas o destellos, brillar de manera intermitente.", ejemplo: "Las estrellas centelleaban en la noche despejada del desierto." },
            { texto: "En sentido figurado, mostrarse vivo y brillante, referido a los ojos o la mirada.", ejemplo: "Sus ojos centelleaban de curiosidad ante cada descubrimiento." }
        ],
        sinonimos: ["destellar", "brillar", "relampaguear", "chispear", "fulgurar"]
    },
    {
        palabra: "conque",
        categoria: "conjugacion",
        silabas: "con-que",
        pronunciacion: "/ˈkoŋ.ke/",
        origen: "De con + que",
        definiciones: [
            { texto: "Conjunción que expresa consecuencia o causa, equivalente a 'así que', 'de modo que'.", ejemplo: "Llueve, conque no salgas sin paraguas." },
            { texto: "Interjección que expresa sorpresa o comprobación.", ejemplo: "Conque era verdad lo que decían de ti." }
        ],
        sinonimos: ["así que", "por tanto", "de modo que", "luego"]
    },
    {
        palabra: "luminaria",
        categoria: "sustantivo",
        silabas: "lu-mi-na-ria",
        pronunciacion: "/lu.miˈna.ɾja/",
        origen: "Del latín luminaria, 'lumbrera, antorcha'",
        definiciones: [
            { texto: "Luz que se pone en las calles y casas para festejar algo.", ejemplo: "Encendieron luminarias para celebrar la victoria del equipo." },
            { texto: "Persona que destaca de forma eminente en una ciencia, arte o actividad.", ejemplo: "Era una luminaria de la física teórica reconocida mundialmente." }
        ],
        sinonimos: ["lumbrera", "antorcha", "farol", "emérito", "genio"]
    }
];

// ============================================================
// ESTADO DE LA APP
// ============================================================
let filtroActual = "todas";
let terminoBusqueda = "";
let tarjetaExpandida = null;
let ultimoResultadoKey = "";
let debounceTimer = null;

// ============================================================
// FUNCIONES
// ============================================================

function getCategorias() {
    const cats = {};
    DICCIONARIO.forEach(p => {
        cats[p.categoria] = (cats[p.categoria] || 0) + 1;
    });
    return cats;
}

function filtrarPalabras() {
    return DICCIONARIO.filter(p => {
        const coincideCategoria = filtroActual === "todas" || p.categoria === filtroActual;
        if (!coincideCategoria) return false;
        if (!terminoBusqueda) return true;
        const q = terminoBusqueda.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        const campos = [
            p.palabra, p.categoria,
            ...p.definiciones.map(d => d.texto),
            ...p.sinonimos, p.origen || ""
        ].map(c => c.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""));
        return campos.some(c => c.includes(q));
    });
}

function resaltar(texto, query) {
    if (!query) return texto;
    const normalized = texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const q = query.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const regex = new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    return texto.replace(regex, '<mark style="background:var(--accent-dim);color:var(--accent);border-radius:3px;padding:0 2px;">$1</mark>');
}

function renderFiltros() {
    const cats = getCategorias();
    const bar = document.getElementById("filtersBar");
    const categoriasOrdenadas = Object.entries(cats).sort((a, b) => b[1] - a[1]);

    let html = `<button class="filter-chip ${filtroActual === 'todas' ? 'active' : ''}" data-cat="todas">
        Todas <span class="chip-count">${DICCIONARIO.length}</span>
    </button>`;

    categoriasOrdenadas.forEach(([cat, count]) => {
        html += `<button class="filter-chip ${filtroActual === cat ? 'active' : ''}" data-cat="${cat}">
            ${cat} <span class="chip-count">${count}</span>
        </button>`;
    });

    bar.innerHTML = html;

    bar.querySelectorAll(".filter-chip").forEach(chip => {
        chip.addEventListener("click", () => {
            filtroActual = chip.dataset.cat;
            tarjetaExpandida = null;
            renderFiltros();
            renderLista();
        });
    });
}

// ============================================================
// NÚCLEO: renderLista
// ============================================================
function renderLista(forzar = false) {
    const lista = document.getElementById("wordList");
    const info = document.getElementById("resultsInfo");
    const resultados = filtrarPalabras();

    // Clave para detectar cambios reales
    const nuevaKey = resultados.map(p => p.palabra).join("|") + "|" + terminoBusqueda + "|" + filtroActual;
    const contenidoCambio = nuevaKey !== ultimoResultadoKey;
    ultimoResultadoKey = nuevaKey;

    // Info de resultados
    if (terminoBusqueda || filtroActual !== "todas") {
        info.innerHTML = `<strong>${resultados.length}</strong> resultado${resultados.length !== 1 ? 's' : ''} encontrado${resultados.length !== 1 ? 's' : ''}`;
    } else {
        info.innerHTML = `Mostrando las <strong>${resultados.length}</strong> palabras del diccionario`;
    }

    if (resultados.length === 0) {
        lista.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-book-open"></i>
                <p>No se encontraron palabras que coincidan con tu búsqueda.</p>
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
        // Solo actualizar expansión sin tocar el DOM
        lista.querySelectorAll(".word-card").forEach(card => {
            const palabra = card.dataset.palabra;
            const debeExpandir = tarjetaExpandida === palabra;
            card.classList.toggle("expanded", debeExpandir);
            card.setAttribute("aria-expanded", debeExpandir);
        });
    }

    // Estadísticas
    document.getElementById("totalWords").textContent = DICCIONARIO.length;
    document.getElementById("totalCats").textContent = Object.keys(getCategorias()).length;
}

// ============================================================
// Eventos de tarjetas
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

function renderPalabraDelDia() {
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
document.addEventListener("DOMContentLoaded", () => {
    renderPalabraDelDia();
    renderFiltros();
    renderLista();

    const searchInput = document.getElementById("searchInput");
    const searchClear = document.getElementById("searchClear");

    // Búsqueda con debounce de 150ms para evitar re-renders por cada tecla
    searchInput.addEventListener("input", () => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            terminoBusqueda = searchInput.value.trim();
            searchClear.classList.toggle("visible", terminoBusqueda.length > 0);
            tarjetaExpandida = null;
            renderLista();
        }, 150);
    });

    searchClear.addEventListener("click", () => {
        clearTimeout(debounceTimer);
        searchInput.value = "";
        terminoBusqueda = "";
        searchClear.classList.remove("visible");
        tarjetaExpandida = null;
        renderLista(true);
        searchInput.focus();
    });

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
