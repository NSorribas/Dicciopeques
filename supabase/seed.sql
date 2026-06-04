-- ============================================================
-- DiccioPeques - Seed Data
-- Ejecutar DESPUÉS de schema.sql en el SQL Editor de Supabase
-- ============================================================

-- Palabra: alboroto
INSERT INTO palabras (palabra, categoria, silabas, pronunciacion, origen) VALUES ('alboroto', 'sustantivo', 'al-bo-ro-to', '/al.boˈɾo.to/', 'Del español alborotar, de origen onomatopéyico') ON CONFLICT (palabra) DO NOTHING;
INSERT INTO definiciones (palabra_id, numero, texto, ejemplo) VALUES ((SELECT id FROM palabras WHERE palabra = 'alboroto'), 1, 'Ruido, vocería o confusión de muchas personas.', 'El alboroto en la plaza despertó a todo el vecindario.');
INSERT INTO definiciones (palabra_id, numero, texto, ejemplo) VALUES ((SELECT id FROM palabras WHERE palabra = 'alboroto'), 2, 'Perturbación o alteración del orden público.', 'Varios detenidos por el alboroto en la manifestación.');
INSERT INTO sinonimos (palabra_id, sinonimo) VALUES ((SELECT id FROM palabras WHERE palabra = 'alboroto'), 'bullicio');
INSERT INTO sinonimos (palabra_id, sinonimo) VALUES ((SELECT id FROM palabras WHERE palabra = 'alboroto'), 'estrépito');
INSERT INTO sinonimos (palabra_id, sinonimo) VALUES ((SELECT id FROM palabras WHERE palabra = 'alboroto'), 'vocerío');
INSERT INTO sinonimos (palabra_id, sinonimo) VALUES ((SELECT id FROM palabras WHERE palabra = 'alboroto'), 'tumulto');
INSERT INTO sinonimos (palabra_id, sinonimo) VALUES ((SELECT id FROM palabras WHERE palabra = 'alboroto'), 'revuelo');

-- Palabra: atardecer
INSERT INTO palabras (palabra, categoria, silabas, pronunciacion, origen) VALUES ('atardecer', 'verbo', 'ar-ta-rde-cer', '/aɾ.taɾ.ðeˈθeɾ/', 'Del latín ad tardescere, ''hacerse tarde''') ON CONFLICT (palabra) DO NOTHING;
INSERT INTO definiciones (palabra_id, numero, texto, ejemplo) VALUES ((SELECT id FROM palabras WHERE palabra = 'atardecer'), 1, 'Dicho del día: ir acabándose, ir cayendo la tarde.', 'Nos sentamos en la terraza a atardecer.');
INSERT INTO definiciones (palabra_id, numero, texto, ejemplo) VALUES ((SELECT id FROM palabras WHERE palabra = 'atardecer'), 2, 'Llegar la tarde o el ocaso.', 'Atardecía cuando por fin llegamos al pueblo.');
INSERT INTO sinonimos (palabra_id, sinonimo) VALUES ((SELECT id FROM palabras WHERE palabra = 'atardecer'), 'ocasentar');
INSERT INTO sinonimos (palabra_id, sinonimo) VALUES ((SELECT id FROM palabras WHERE palabra = 'atardecer'), 'anochecer');
INSERT INTO sinonimos (palabra_id, sinonimo) VALUES ((SELECT id FROM palabras WHERE palabra = 'atardecer'), 'caer la tarde');

-- Palabra: melancolía
INSERT INTO palabras (palabra, categoria, silabas, pronunciacion, origen) VALUES ('melancolía', 'sustantivo', 'me-lan-co-lí-a', '/me.laŋ.koˈli.a/', 'Del griego melancholía, ''bilis negra''') ON CONFLICT (palabra) DO NOTHING;
INSERT INTO definiciones (palabra_id, numero, texto, ejemplo) VALUES ((SELECT id FROM palabras WHERE palabra = 'melancolía'), 1, 'Tristeza vaga, profunda y permanente, que no tiene causa concreta.', 'Una melancolía dulce la invadía al escuchar esa canción.');
INSERT INTO definiciones (palabra_id, numero, texto, ejemplo) VALUES ((SELECT id FROM palabras WHERE palabra = 'melancolía'), 2, 'En medicina antigua, uno de los cuatro humores del cuerpo.', 'La melancolía era considerada un exceso de bilis negra.');
INSERT INTO sinonimos (palabra_id, sinonimo) VALUES ((SELECT id FROM palabras WHERE palabra = 'melancolía'), 'tristeza');
INSERT INTO sinonimos (palabra_id, sinonimo) VALUES ((SELECT id FROM palabras WHERE palabra = 'melancolía'), 'nostalgia');
INSERT INTO sinonimos (palabra_id, sinonimo) VALUES ((SELECT id FROM palabras WHERE palabra = 'melancolía'), 'pena');
INSERT INTO sinonimos (palabra_id, sinonimo) VALUES ((SELECT id FROM palabras WHERE palabra = 'melancolía'), 'desconsuelo');
INSERT INTO sinonimos (palabra_id, sinonimo) VALUES ((SELECT id FROM palabras WHERE palabra = 'melancolía'), 'abatimiento');

-- Palabra: efímero
INSERT INTO palabras (palabra, categoria, silabas, pronunciacion, origen) VALUES ('efímero', 'adjetivo', 'e-fí-me-ro', '/eˈfi.me.ɾo/', 'Del griego ephemeros, ''que dura un día''') ON CONFLICT (palabra) DO NOTHING;
INSERT INTO definiciones (palabra_id, numero, texto, ejemplo) VALUES ((SELECT id FROM palabras WHERE palabra = 'efímero'), 1, 'Que dura muy poco tiempo, pasajero, transitorio.', 'La fama es efímera si no se cultiva con trabajo.');
INSERT INTO definiciones (palabra_id, numero, texto, ejemplo) VALUES ((SELECT id FROM palabras WHERE palabra = 'efímero'), 2, 'En biología, dicho de un organismo: que vive muy poco tiempo.', 'Las efímeras son insectos cuya vida adulta dura apenas horas.');
INSERT INTO sinonimos (palabra_id, sinonimo) VALUES ((SELECT id FROM palabras WHERE palabra = 'efímero'), 'pasajero');
INSERT INTO sinonimos (palabra_id, sinonimo) VALUES ((SELECT id FROM palabras WHERE palabra = 'efímero'), 'transitorio');
INSERT INTO sinonimos (palabra_id, sinonimo) VALUES ((SELECT id FROM palabras WHERE palabra = 'efímero'), 'fugaz');
INSERT INTO sinonimos (palabra_id, sinonimo) VALUES ((SELECT id FROM palabras WHERE palabra = 'efímero'), 'breve');
INSERT INTO sinonimos (palabra_id, sinonimo) VALUES ((SELECT id FROM palabras WHERE palabra = 'efímero'), 'temporal');

-- Palabra: vehemencia
INSERT INTO palabras (palabra, categoria, silabas, pronunciacion, origen) VALUES ('vehemencia', 'sustantivo', 've-he-men-cia', '/be.eˈmen.θja/', 'Del latín vehementia') ON CONFLICT (palabra) DO NOTHING;
INSERT INTO definiciones (palabra_id, numero, texto, ejemplo) VALUES ((SELECT id FROM palabras WHERE palabra = 'vehemencia'), 1, 'Cualidad de vehemente; impetuosidad, furor, violencia en el modo de actuar o hablar.', 'Defendió sus ideas con vehemencia ante el tribunal.');
INSERT INTO definiciones (palabra_id, numero, texto, ejemplo) VALUES ((SELECT id FROM palabras WHERE palabra = 'vehemencia'), 2, 'Intensidad grande de un sentimiento o pasión.', 'La vehemencia de su amor la conducía a decisiones temerarias.');
INSERT INTO sinonimos (palabra_id, sinonimo) VALUES ((SELECT id FROM palabras WHERE palabra = 'vehemencia'), 'impetuosidad');
INSERT INTO sinonimos (palabra_id, sinonimo) VALUES ((SELECT id FROM palabras WHERE palabra = 'vehemencia'), 'furia');
INSERT INTO sinonimos (palabra_id, sinonimo) VALUES ((SELECT id FROM palabras WHERE palabra = 'vehemencia'), 'ardor');
INSERT INTO sinonimos (palabra_id, sinonimo) VALUES ((SELECT id FROM palabras WHERE palabra = 'vehemencia'), 'pasión');
INSERT INTO sinonimos (palabra_id, sinonimo) VALUES ((SELECT id FROM palabras WHERE palabra = 'vehemencia'), 'ímpetu');

-- Palabra: desvelar
INSERT INTO palabras (palabra, categoria, silabas, pronunciacion, origen) VALUES ('desvelar', 'verbo', 'des-ve-lar', '/des.beˈlaɾ/', 'Del prefijo des- + velar, del latín vigilare') ON CONFLICT (palabra) DO NOTHING;
INSERT INTO definiciones (palabra_id, numero, texto, ejemplo) VALUES ((SELECT id FROM palabras WHERE palabra = 'desvelar'), 1, 'Quitar el sueño, impedir que alguien duerma.', 'La preocupación por el examen le desveló toda la noche.');
INSERT INTO definiciones (palabra_id, numero, texto, ejemplo) VALUES ((SELECT id FROM palabras WHERE palabra = 'desvelar'), 2, 'Descubrir o revelar algo oculto o secreto.', 'El informe desveló datos alarmantes sobre la contaminación.');
INSERT INTO sinonimos (palabra_id, sinonimo) VALUES ((SELECT id FROM palabras WHERE palabra = 'desvelar'), 'insomniar');
INSERT INTO sinonimos (palabra_id, sinonimo) VALUES ((SELECT id FROM palabras WHERE palabra = 'desvelar'), 'revelar');
INSERT INTO sinonimos (palabra_id, sinonimo) VALUES ((SELECT id FROM palabras WHERE palabra = 'desvelar'), 'descubrir');
INSERT INTO sinonimos (palabra_id, sinonimo) VALUES ((SELECT id FROM palabras WHERE palabra = 'desvelar'), 'destapar');

-- Palabra: serendipia
INSERT INTO palabras (palabra, categoria, silabas, pronunciacion, origen) VALUES ('serendipia', 'sustantivo', 'se-ren-di-pia', '/se.ɾenˈdi.pja/', 'Del inglés serendipity, acuñado por Horace Walpole en 1754, inspirado en un cuento persa') ON CONFLICT (palabra) DO NOTHING;
INSERT INTO definiciones (palabra_id, numero, texto, ejemplo) VALUES ((SELECT id FROM palabras WHERE palabra = 'serendipia'), 1, 'Hallazgo valioso que se produce de manera accidental o inesperada, mientras se buscaba otra cosa.', 'El descubrimiento de la penicilina fue una serendipia científica.');
INSERT INTO definiciones (palabra_id, numero, texto, ejemplo) VALUES ((SELECT id FROM palabras WHERE palabra = 'serendipia'), 2, 'Cualidad de hacer descubrimientos por accidente y sagacidad.', 'Su serendipia le llevó a encontrar la solución mientras paseaba.');
INSERT INTO sinonimos (palabra_id, sinonimo) VALUES ((SELECT id FROM palabras WHERE palabra = 'serendipia'), 'hallazgo');
INSERT INTO sinonimos (palabra_id, sinonimo) VALUES ((SELECT id FROM palabras WHERE palabra = 'serendipia'), 'descubrimiento casual');
INSERT INTO sinonimos (palabra_id, sinonimo) VALUES ((SELECT id FROM palabras WHERE palabra = 'serendipia'), 'casualidad afortunada');

-- Palabra: susurrar
INSERT INTO palabras (palabra, categoria, silabas, pronunciacion, origen) VALUES ('susurrar', 'verbo', 'su-su-rrar', '/su.suˈɾaɾ/', 'Del latín susurrare, onomatopéyico') ON CONFLICT (palabra) DO NOTHING;
INSERT INTO definiciones (palabra_id, numero, texto, ejemplo) VALUES ((SELECT id FROM palabras WHERE palabra = 'susurrar'), 1, 'Hablar en voz muy baja, de modo que solo se oiga un sonido suave y confuso.', 'Le susurró al oído que la amaba.');
INSERT INTO definiciones (palabra_id, numero, texto, ejemplo) VALUES ((SELECT id FROM palabras WHERE palabra = 'susurrar'), 2, 'Producir un sonido suave y continuado, como el viento entre las hojas.', 'La brisa susurraba entre los álamos del parque.');
INSERT INTO sinonimos (palabra_id, sinonimo) VALUES ((SELECT id FROM palabras WHERE palabra = 'susurrar'), 'cuchichear');
INSERT INTO sinonimos (palabra_id, sinonimo) VALUES ((SELECT id FROM palabras WHERE palabra = 'susurrar'), 'murmurar');
INSERT INTO sinonimos (palabra_id, sinonimo) VALUES ((SELECT id FROM palabras WHERE palabra = 'susurrar'), 'murmullar');

-- Palabra: petricor
INSERT INTO palabras (palabra, categoria, silabas, pronunciacion, origen) VALUES ('petricor', 'sustantivo', 'pe-tri-cor', '/pe.tɾiˈkoɾ/', 'Del griego petra (piedra) + ichor (líquido que fluía por las venas de los dioses), acuñado en 1964') ON CONFLICT (palabra) DO NOTHING;
INSERT INTO definiciones (palabra_id, numero, texto, ejemplo) VALUES ((SELECT id FROM palabras WHERE palabra = 'petricor'), 1, 'Olor terroso y agradable que se produce cuando llueve sobre suelo seco.', 'Tras la primera tormenta del otoño, el petricor inundó el jardín.');
INSERT INTO sinonimos (palabra_id, sinonimo) VALUES ((SELECT id FROM palabras WHERE palabra = 'petricor'), 'olor a tierra mojada');
INSERT INTO sinonimos (palabra_id, sinonimo) VALUES ((SELECT id FROM palabras WHERE palabra = 'petricor'), 'aroma pluvial');

-- Palabra: inefable
INSERT INTO palabras (palabra, categoria, silabas, pronunciacion, origen) VALUES ('inefable', 'adjetivo', 'i-ne-fa-ble', '/i.neˈfa.βle/', 'Del latín ineffabilis, ''que no se puede expresar con palabras''') ON CONFLICT (palabra) DO NOTHING;
INSERT INTO definiciones (palabra_id, numero, texto, ejemplo) VALUES ((SELECT id FROM palabras WHERE palabra = 'inefable'), 1, 'Que no se puede explicar o describir con palabras por su intensidad o naturaleza.', 'Sintió un gozo inefable al ver a su hija después de tantos años.');
INSERT INTO definiciones (palabra_id, numero, texto, ejemplo) VALUES ((SELECT id FROM palabras WHERE palabra = 'inefable'), 2, 'Que debe guardarse en silencio, por respeto o misterio.', 'El nombre de Dios era considerado inefable en la tradición hebrea.');
INSERT INTO sinonimos (palabra_id, sinonimo) VALUES ((SELECT id FROM palabras WHERE palabra = 'inefable'), 'inexpresable');
INSERT INTO sinonimos (palabra_id, sinonimo) VALUES ((SELECT id FROM palabras WHERE palabra = 'inefable'), 'indescriptible');
INSERT INTO sinonimos (palabra_id, sinonimo) VALUES ((SELECT id FROM palabras WHERE palabra = 'inefable'), 'indecible');

-- Palabra: luminiscencia
INSERT INTO palabras (palabra, categoria, silabas, pronunciacion, origen) VALUES ('luminiscencia', 'sustantivo', 'lu-mi-nis-cen-cia', '/lu.mi.nisˈθen.θja/', 'Del latín lumen (luz) + -escencia') ON CONFLICT (palabra) DO NOTHING;
INSERT INTO definiciones (palabra_id, numero, texto, ejemplo) VALUES ((SELECT id FROM palabras WHERE palabra = 'luminiscencia'), 1, 'Emisión de luz por un cuerpo que no está incandescente, producida por causas distintas a la temperatura elevada.', 'La luminiscencia de las luciérnagas ilumina el campo en verano.');
INSERT INTO definiciones (palabra_id, numero, texto, ejemplo) VALUES ((SELECT id FROM palabras WHERE palabra = 'luminiscencia'), 2, 'En sentido figurado, cualidad de brillar o destacar de forma especial.', 'La luminiscencia de su talento era evidente en cada obra.');
INSERT INTO sinonimos (palabra_id, sinonimo) VALUES ((SELECT id FROM palabras WHERE palabra = 'luminiscencia'), 'fosforescencia');
INSERT INTO sinonimos (palabra_id, sinonimo) VALUES ((SELECT id FROM palabras WHERE palabra = 'luminiscencia'), 'fluorescencia');
INSERT INTO sinonimos (palabra_id, sinonimo) VALUES ((SELECT id FROM palabras WHERE palabra = 'luminiscencia'), 'resplandor');
INSERT INTO sinonimos (palabra_id, sinonimo) VALUES ((SELECT id FROM palabras WHERE palabra = 'luminiscencia'), 'brillo');

-- Palabra: amanecer
INSERT INTO palabras (palabra, categoria, silabas, pronunciacion, origen) VALUES ('amanecer', 'verbo', 'a-ma-ne-cer', '/a.ma.neˈθeɾ/', 'Del latín ad manescere, ''hacerse mañana''') ON CONFLICT (palabra) DO NOTHING;
INSERT INTO definiciones (palabra_id, numero, texto, ejemplo) VALUES ((SELECT id FROM palabras WHERE palabra = 'amanecer'), 1, 'Llegar la mañana, empezar a aparecer la luz del sol.', 'Amaneció nublado pero luego salió el sol.');
INSERT INTO definiciones (palabra_id, numero, texto, ejemplo) VALUES ((SELECT id FROM palabras WHERE palabra = 'amanecer'), 2, 'Encontrarse en determinado estado al llegar la mañana.', 'Amaneció con fiebre y tuvo que quedarse en cama.');
INSERT INTO sinonimos (palabra_id, sinonimo) VALUES ((SELECT id FROM palabras WHERE palabra = 'amanecer'), 'alborear');
INSERT INTO sinonimos (palabra_id, sinonimo) VALUES ((SELECT id FROM palabras WHERE palabra = 'amanecer'), 'rayar el alba');
INSERT INTO sinonimos (palabra_id, sinonimo) VALUES ((SELECT id FROM palabras WHERE palabra = 'amanecer'), 'despuntar el día');

-- Palabra: recóndito
INSERT INTO palabras (palabra, categoria, silabas, pronunciacion, origen) VALUES ('recóndito', 'adjetivo', 're-cón-di-to', '/reˈkon.di.to/', 'Del latín reconditus, ''escondido, oculto''') ON CONFLICT (palabra) DO NOTHING;
INSERT INTO definiciones (palabra_id, numero, texto, ejemplo) VALUES ((SELECT id FROM palabras WHERE palabra = 'recóndito'), 1, 'Muy escondido, oculto o difícil de alcanzar.', 'En un rincón recóndito del bosque encontraron la cueva.');
INSERT INTO definiciones (palabra_id, numero, texto, ejemplo) VALUES ((SELECT id FROM palabras WHERE palabra = 'recóndito'), 2, 'Profundo, en sentido figurado, referido a pensamientos o sentimientos.', 'Guardaba en lo más recóndito de su memoria aquel verano.');
INSERT INTO sinonimos (palabra_id, sinonimo) VALUES ((SELECT id FROM palabras WHERE palabra = 'recóndito'), 'oculto');
INSERT INTO sinonimos (palabra_id, sinonimo) VALUES ((SELECT id FROM palabras WHERE palabra = 'recóndito'), 'escondido');
INSERT INTO sinonimos (palabra_id, sinonimo) VALUES ((SELECT id FROM palabras WHERE palabra = 'recóndito'), 'arcano');
INSERT INTO sinonimos (palabra_id, sinonimo) VALUES ((SELECT id FROM palabras WHERE palabra = 'recóndito'), 'profundo');
INSERT INTO sinonimos (palabra_id, sinonimo) VALUES ((SELECT id FROM palabras WHERE palabra = 'recóndito'), 'ignoto');

-- Palabra: ondular
INSERT INTO palabras (palabra, categoria, silabas, pronunciacion, origen) VALUES ('ondular', 'verbo', 'on-du-lar', '/on.duˈlaɾ/', 'Del latín undulare, derivado de unda (ola)') ON CONFLICT (palabra) DO NOTHING;
INSERT INTO definiciones (palabra_id, numero, texto, ejemplo) VALUES ((SELECT id FROM palabras WHERE palabra = 'ondular'), 1, 'Moverse formando ondulaciones, con movimiento semejante al de las olas.', 'La bandera ondulaba con el viento de la montaña.');
INSERT INTO definiciones (palabra_id, numero, texto, ejemplo) VALUES ((SELECT id FROM palabras WHERE palabra = 'ondular'), 2, 'Dar forma de onda a algo.', 'El peluquero le onduló el cabello con tenacillas.');
INSERT INTO sinonimos (palabra_id, sinonimo) VALUES ((SELECT id FROM palabras WHERE palabra = 'ondular'), 'ondear');
INSERT INTO sinonimos (palabra_id, sinonimo) VALUES ((SELECT id FROM palabras WHERE palabra = 'ondular'), 'flamear');
INSERT INTO sinonimos (palabra_id, sinonimo) VALUES ((SELECT id FROM palabras WHERE palabra = 'ondular'), 'culebrear');
INSERT INTO sinonimos (palabra_id, sinonimo) VALUES ((SELECT id FROM palabras WHERE palabra = 'ondular'), 'serpentear');

-- Palabra: perenne
INSERT INTO palabras (palabra, categoria, silabas, pronunciacion, origen) VALUES ('perenne', 'adjetivo', 'pe-ren-ne', '/peˈren.ne/', 'Del latín perennis, ''que dura todo el año''') ON CONFLICT (palabra) DO NOTHING;
INSERT INTO definiciones (palabra_id, numero, texto, ejemplo) VALUES ((SELECT id FROM palabras WHERE palabra = 'perenne'), 1, 'Que dura para siempre o por mucho tiempo, continuo, incesante.', 'El perenne debate entre la razón y la emoción.');
INSERT INTO definiciones (palabra_id, numero, texto, ejemplo) VALUES ((SELECT id FROM palabras WHERE palabra = 'perenne'), 2, 'En botánica, dicho de una planta: que vive más de dos años.', 'Los robles son árboles perennes que pueden vivir siglos.');
INSERT INTO sinonimos (palabra_id, sinonimo) VALUES ((SELECT id FROM palabras WHERE palabra = 'perenne'), 'eterno');
INSERT INTO sinonimos (palabra_id, sinonimo) VALUES ((SELECT id FROM palabras WHERE palabra = 'perenne'), 'constante');
INSERT INTO sinonimos (palabra_id, sinonimo) VALUES ((SELECT id FROM palabras WHERE palabra = 'perenne'), 'continuo');
INSERT INTO sinonimos (palabra_id, sinonimo) VALUES ((SELECT id FROM palabras WHERE palabra = 'perenne'), 'imperecedero');
INSERT INTO sinonimos (palabra_id, sinonimo) VALUES ((SELECT id FROM palabras WHERE palabra = 'perenne'), 'inagotable');

-- Palabra: madrugar
INSERT INTO palabras (palabra, categoria, silabas, pronunciacion, origen) VALUES ('madrugar', 'verbo', 'ma-dru-gar', '/ma.ðɾuˈɣaɾ/', 'De madrugada, del latín matutinus, ''relativo a la mañana''') ON CONFLICT (palabra) DO NOTHING;
INSERT INTO definiciones (palabra_id, numero, texto, ejemplo) VALUES ((SELECT id FROM palabras WHERE palabra = 'madrugar'), 1, 'Levantarse muy de mañana, antes de lo acostumbrado.', 'Madruga y verás el amanecer más hermoso del año.');
INSERT INTO definiciones (palabra_id, numero, texto, ejemplo) VALUES ((SELECT id FROM palabras WHERE palabra = 'madrugar'), 2, 'Llegar antes que otros a algo, anticiparse.', 'Madrugó en la fila para conseguir las entradas.');
INSERT INTO sinonimos (palabra_id, sinonimo) VALUES ((SELECT id FROM palabras WHERE palabra = 'madrugar'), 'levantarse temprano');
INSERT INTO sinonimos (palabra_id, sinonimo) VALUES ((SELECT id FROM palabras WHERE palabra = 'madrugar'), 'madronear');
INSERT INTO sinonimos (palabra_id, sinonimo) VALUES ((SELECT id FROM palabras WHERE palabra = 'madrugar'), 'anticiparse');

-- Palabra: azabache
INSERT INTO palabras (palabra, categoria, silabas, pronunciacion, origen) VALUES ('azabache', 'sustantivo', 'a-za-ba-che', '/a.θaˈβa.tʃe/', 'Del árabe as-sabach, ''piedra negra''') ON CONFLICT (palabra) DO NOTHING;
INSERT INTO definiciones (palabra_id, numero, texto, ejemplo) VALUES ((SELECT id FROM palabras WHERE palabra = 'azabache'), 1, 'Variedad de lignito negra, muy compacta y ligera, que admite buen pulimento. Se usa en joyería.', 'Llevaba un colgante de azabache heredado de su abuela.');
INSERT INTO definiciones (palabra_id, numero, texto, ejemplo) VALUES ((SELECT id FROM palabras WHERE palabra = 'azabache'), 2, 'De color negro intenso y brillante.', 'Sus ojos eran de un azabache profundo e insondable.');
INSERT INTO sinonimos (palabra_id, sinonimo) VALUES ((SELECT id FROM palabras WHERE palabra = 'azabache'), 'lignito');
INSERT INTO sinonimos (palabra_id, sinonimo) VALUES ((SELECT id FROM palabras WHERE palabra = 'azabache'), 'jet');
INSERT INTO sinonimos (palabra_id, sinonimo) VALUES ((SELECT id FROM palabras WHERE palabra = 'azabache'), 'negro intenso');
INSERT INTO sinonimos (palabra_id, sinonimo) VALUES ((SELECT id FROM palabras WHERE palabra = 'azabache'), 'ébano');

-- Palabra: sobremesa
INSERT INTO palabras (palabra, categoria, silabas, pronunciacion, origen) VALUES ('sobremesa', 'sustantivo', 'so-bre-me-sa', '/so.βɾeˈme.sa/', 'De sobre + mesa') ON CONFLICT (palabra) DO NOTHING;
INSERT INTO definiciones (palabra_id, numero, texto, ejemplo) VALUES ((SELECT id FROM palabras WHERE palabra = 'sobremesa'), 1, 'Tiempo que se está a la mesa después de haber comido, conversando.', 'La sobremesa se alargó con café y historias de la infancia.');
INSERT INTO definiciones (palabra_id, numero, texto, ejemplo) VALUES ((SELECT id FROM palabras WHERE palabra = 'sobremesa'), 2, 'Mueble que se coloca sobre la mesa para adornarla o protegerla.', 'Compró una sobremesa de tela bordada para el comedor.');
INSERT INTO sinonimos (palabra_id, sinonimo) VALUES ((SELECT id FROM palabras WHERE palabra = 'sobremesa'), 'sobremesa');
INSERT INTO sinonimos (palabra_id, sinonimo) VALUES ((SELECT id FROM palabras WHERE palabra = 'sobremesa'), 'tertulia');
INSERT INTO sinonimos (palabra_id, sinonimo) VALUES ((SELECT id FROM palabras WHERE palabra = 'sobremesa'), 'poscomida');
INSERT INTO sinonimos (palabra_id, sinonimo) VALUES ((SELECT id FROM palabras WHERE palabra = 'sobremesa'), 'conversación');

-- Palabra: quirúrgico
INSERT INTO palabras (palabra, categoria, silabas, pronunciacion, origen) VALUES ('quirúrgico', 'adjetivo', 'qui-rúr-gi-co', '/kiˈɾuɾ.xi.ko/', 'Del griego cheirurgiké, ''relativo a la cirugía''') ON CONFLICT (palabra) DO NOTHING;
INSERT INTO definiciones (palabra_id, numero, texto, ejemplo) VALUES ((SELECT id FROM palabras WHERE palabra = 'quirúrgico'), 1, 'Perteneciente o relativo a la cirugía.', 'El equipo quirúrgico estaba preparado para la intervención.');
INSERT INTO definiciones (palabra_id, numero, texto, ejemplo) VALUES ((SELECT id FROM palabras WHERE palabra = 'quirúrgico'), 2, 'En sentido figurado, preciso, exacto, sin margen de error.', 'Hizo un análisis quirúrgico del problema, sin dejar cabo suelto.');
INSERT INTO sinonimos (palabra_id, sinonimo) VALUES ((SELECT id FROM palabras WHERE palabra = 'quirúrgico'), 'operatorio');
INSERT INTO sinonimos (palabra_id, sinonimo) VALUES ((SELECT id FROM palabras WHERE palabra = 'quirúrgico'), 'preciso');
INSERT INTO sinonimos (palabra_id, sinonimo) VALUES ((SELECT id FROM palabras WHERE palabra = 'quirúrgico'), 'exacto');
INSERT INTO sinonimos (palabra_id, sinonimo) VALUES ((SELECT id FROM palabras WHERE palabra = 'quirúrgico'), 'clínico');

-- Palabra: deshacer
INSERT INTO palabras (palabra, categoria, silabas, pronunciacion, origen) VALUES ('deshacer', 'verbo', 'des-ha-cer', '/des.aˈθeɾ/', 'Del latín disfacere, ''deshacer, desbaratar''') ON CONFLICT (palabra) DO NOTHING;
INSERT INTO definiciones (palabra_id, numero, texto, ejemplo) VALUES ((SELECT id FROM palabras WHERE palabra = 'deshacer'), 1, 'Destruir, desbaratar o descomponer algo hecho.', 'Tuvo que deshacer el nudo con paciencia.');
INSERT INTO definiciones (palabra_id, numero, texto, ejemplo) VALUES ((SELECT id FROM palabras WHERE palabra = 'deshacer'), 2, 'Anular, revocar lo mandado o resuelto.', 'El juez decidió deshacer el contrato por falta de pruebas.');
INSERT INTO definiciones (palabra_id, numero, texto, ejemplo) VALUES ((SELECT id FROM palabras WHERE palabra = 'deshacer'), 3, 'Derretir o disolver algo sólido.', 'Deshizo el chocolate al baño maría para la tarta.');
INSERT INTO sinonimos (palabra_id, sinonimo) VALUES ((SELECT id FROM palabras WHERE palabra = 'deshacer'), 'desbaratar');
INSERT INTO sinonimos (palabra_id, sinonimo) VALUES ((SELECT id FROM palabras WHERE palabra = 'deshacer'), 'anular');
INSERT INTO sinonimos (palabra_id, sinonimo) VALUES ((SELECT id FROM palabras WHERE palabra = 'deshacer'), 'derretir');
INSERT INTO sinonimos (palabra_id, sinonimo) VALUES ((SELECT id FROM palabras WHERE palabra = 'deshacer'), 'desatar');
INSERT INTO sinonimos (palabra_id, sinonimo) VALUES ((SELECT id FROM palabras WHERE palabra = 'deshacer'), 'disolver');

-- Palabra: aurora
INSERT INTO palabras (palabra, categoria, silabas, pronunciacion, origen) VALUES ('aurora', 'sustantivo', 'au-ro-ra', '/auˈɾo.ɾa/', 'Del latín aurora, ''amanecer'', diosa romana del alba') ON CONFLICT (palabra) DO NOTHING;
INSERT INTO definiciones (palabra_id, numero, texto, ejemplo) VALUES ((SELECT id FROM palabras WHERE palabra = 'aurora'), 1, 'Luz que aparece en el horizonte antes de salir el sol.', 'La aurora pintaba el cielo de rosa y dorado.');
INSERT INTO definiciones (palabra_id, numero, texto, ejemplo) VALUES ((SELECT id FROM palabras WHERE palabra = 'aurora'), 2, 'Principio u origen de algo.', 'Aquel encuentro marcó el aurora de una larga amistad.');
INSERT INTO sinonimos (palabra_id, sinonimo) VALUES ((SELECT id FROM palabras WHERE palabra = 'aurora'), 'alba');
INSERT INTO sinonimos (palabra_id, sinonimo) VALUES ((SELECT id FROM palabras WHERE palabra = 'aurora'), 'amanecer');
INSERT INTO sinonimos (palabra_id, sinonimo) VALUES ((SELECT id FROM palabras WHERE palabra = 'aurora'), 'alborada');
INSERT INTO sinonimos (palabra_id, sinonimo) VALUES ((SELECT id FROM palabras WHERE palabra = 'aurora'), 'despertar');

-- Palabra: obstante
INSERT INTO palabras (palabra, categoria, silabas, pronunciacion, origen) VALUES ('obstante', 'adverbio', 'obs-tan-te', '/obˈstan.te/', 'Del latín obstantem, ''que se opone''') ON CONFLICT (palabra) DO NOTHING;
INSERT INTO definiciones (palabra_id, numero, texto, ejemplo) VALUES ((SELECT id FROM palabras WHERE palabra = 'obstante'), 1, 'Sin embargo, no obstante, con todo. Indica oposición o contraste respecto de lo dicho antes.', 'Hacía frío; obstante, salieron a caminar por la sierra.');
INSERT INTO sinonimos (palabra_id, sinonimo) VALUES ((SELECT id FROM palabras WHERE palabra = 'obstante'), 'sin embargo');
INSERT INTO sinonimos (palabra_id, sinonimo) VALUES ((SELECT id FROM palabras WHERE palabra = 'obstante'), 'no obstante');
INSERT INTO sinonimos (palabra_id, sinonimo) VALUES ((SELECT id FROM palabras WHERE palabra = 'obstante'), 'con todo');
INSERT INTO sinonimos (palabra_id, sinonimo) VALUES ((SELECT id FROM palabras WHERE palabra = 'obstante'), 'empero');

-- Palabra: pandereta
INSERT INTO palabras (palabra, categoria, silabas, pronunciacion, origen) VALUES ('pandereta', 'sustantivo', 'pan-de-re-ta', '/pan.deˈɾe.ta/', 'Del latín pandorium, instrumento musical') ON CONFLICT (palabra) DO NOTHING;
INSERT INTO definiciones (palabra_id, numero, texto, ejemplo) VALUES ((SELECT id FROM palabras WHERE palabra = 'pandereta'), 1, 'Instrumento musical de percusión, semejante a la pandereta pero con sonajas de metal.', 'En la fiesta gallega tocaban la pandereta y la gaita.');
INSERT INTO definiciones (palabra_id, numero, texto, ejemplo) VALUES ((SELECT id FROM palabras WHERE palabra = 'pandereta'), 2, 'En sentido figurado, cosa intrascendente o de poca importancia.', 'No me vengas con panderetas, quiero resultados serios.');
INSERT INTO sinonimos (palabra_id, sinonimo) VALUES ((SELECT id FROM palabras WHERE palabra = 'pandereta'), 'pandero');
INSERT INTO sinonimos (palabra_id, sinonimo) VALUES ((SELECT id FROM palabras WHERE palabra = 'pandereta'), 'tamboril');
INSERT INTO sinonimos (palabra_id, sinonimo) VALUES ((SELECT id FROM palabras WHERE palabra = 'pandereta'), 'instrumento de percusión');

-- Palabra: etéreos
INSERT INTO palabras (palabra, categoria, silabas, pronunciacion, origen) VALUES ('etéreos', 'adjetivo', 'e-té-re-os', '/eˈte.ɾe.os/', 'Del latín aetherius, ''del éter, celeste''') ON CONFLICT (palabra) DO NOTHING;
INSERT INTO definiciones (palabra_id, numero, texto, ejemplo) VALUES ((SELECT id FROM palabras WHERE palabra = 'etéreos'), 1, 'Muy sutil, delicado o ligero, como si no perteneciera al mundo material.', 'Las nubes formaban figuras etéreas en el cielo del atardecer.');
INSERT INTO definiciones (palabra_id, numero, texto, ejemplo) VALUES ((SELECT id FROM palabras WHERE palabra = 'etéreos'), 2, 'Perteneciente o relativo al éter, al cielo o a las regiones superiores del aire.', 'Los poetas románticos buscaban lo etéreo en sus versos.');
INSERT INTO sinonimos (palabra_id, sinonimo) VALUES ((SELECT id FROM palabras WHERE palabra = 'etéreos'), 'sutil');
INSERT INTO sinonimos (palabra_id, sinonimo) VALUES ((SELECT id FROM palabras WHERE palabra = 'etéreos'), 'aéreo');
INSERT INTO sinonimos (palabra_id, sinonimo) VALUES ((SELECT id FROM palabras WHERE palabra = 'etéreos'), 'incorpóreo');
INSERT INTO sinonimos (palabra_id, sinonimo) VALUES ((SELECT id FROM palabras WHERE palabra = 'etéreos'), 'celestial');
INSERT INTO sinonimos (palabra_id, sinonimo) VALUES ((SELECT id FROM palabras WHERE palabra = 'etéreos'), 'evanescente');

-- Palabra: encandilar
INSERT INTO palabras (palabra, categoria, silabas, pronunciacion, origen) VALUES ('encandilar', 'verbo', 'en-can-di-lar', '/eŋ.kan.diˈlaɾ/', 'De en- + cándila (vela, candil)') ON CONFLICT (palabra) DO NOTHING;
INSERT INTO definiciones (palabra_id, numero, texto, ejemplo) VALUES ((SELECT id FROM palabras WHERE palabra = 'encandilar'), 1, 'Deslumbrar con luz excesiva, cegar momentáneamente.', 'El sol le encandiló al salir del túnel.');
INSERT INTO definiciones (palabra_id, numero, texto, ejemplo) VALUES ((SELECT id FROM palabras WHERE palabra = 'encandilar'), 2, 'Enamorar o fascinar a alguien, hechizar.', 'La encandiló con sus palabras y su elegancia.');
INSERT INTO sinonimos (palabra_id, sinonimo) VALUES ((SELECT id FROM palabras WHERE palabra = 'encandilar'), 'deslumbrar');
INSERT INTO sinonimos (palabra_id, sinonimo) VALUES ((SELECT id FROM palabras WHERE palabra = 'encandilar'), 'cegar');
INSERT INTO sinonimos (palabra_id, sinonimo) VALUES ((SELECT id FROM palabras WHERE palabra = 'encandilar'), 'fascinar');
INSERT INTO sinonimos (palabra_id, sinonimo) VALUES ((SELECT id FROM palabras WHERE palabra = 'encandilar'), 'hechizar');
INSERT INTO sinonimos (palabra_id, sinonimo) VALUES ((SELECT id FROM palabras WHERE palabra = 'encandilar'), 'enamorar');

-- Palabra: noctámbulo
INSERT INTO palabras (palabra, categoria, silabas, pronunciacion, origen) VALUES ('noctámbulo', 'adjetivo', 'noc-tám-bu-lo', '/nokˈtam.bu.lo/', 'Del latín nocte + ambulare, ''caminar de noche''') ON CONFLICT (palabra) DO NOTHING;
INSERT INTO definiciones (palabra_id, numero, texto, ejemplo) VALUES ((SELECT id FROM palabras WHERE palabra = 'noctámbulo'), 1, 'Que tiene costumbre de velar o pasear de noche.', 'Era un noctámbulo empedernido: su mejor inspiración llegaba pasadas las dos.');
INSERT INTO definiciones (palabra_id, numero, texto, ejemplo) VALUES ((SELECT id FROM palabras WHERE palabra = 'noctámbulo'), 2, 'Dicho de un animal: activo durante la noche.', 'Los búhos son aves noctámbulas por excelencia.');
INSERT INTO sinonimos (palabra_id, sinonimo) VALUES ((SELECT id FROM palabras WHERE palabra = 'noctámbulo'), 'trasnochador');
INSERT INTO sinonimos (palabra_id, sinonimo) VALUES ((SELECT id FROM palabras WHERE palabra = 'noctámbulo'), 'nocturno');
INSERT INTO sinonimos (palabra_id, sinonimo) VALUES ((SELECT id FROM palabras WHERE palabra = 'noctámbulo'), 'velador');
INSERT INTO sinonimos (palabra_id, sinonimo) VALUES ((SELECT id FROM palabras WHERE palabra = 'noctámbulo'), 'ruiseñor');

-- Palabra: desasosiego
INSERT INTO palabras (palabra, categoria, silabas, pronunciacion, origen) VALUES ('desasosiego', 'sustantivo', 'de-sa-so-sie-go', '/des.a.soˈsje.ɣo/', 'De des- + sosiego') ON CONFLICT (palabra) DO NOTHING;
INSERT INTO definiciones (palabra_id, numero, texto, ejemplo) VALUES ((SELECT id FROM palabras WHERE palabra = 'desasosiego'), 1, 'Falta de sosiego, inquietud, desazón.', 'Un profundo desasosiego se apoderó de ella al leer la carta.');
INSERT INTO definiciones (palabra_id, numero, texto, ejemplo) VALUES ((SELECT id FROM palabras WHERE palabra = 'desasosiego'), 2, 'Estado de intranquilidad o perturbación del ánimo.', 'El desasosiego ciudadano crecía con cada nueva medida.');
INSERT INTO sinonimos (palabra_id, sinonimo) VALUES ((SELECT id FROM palabras WHERE palabra = 'desasosiego'), 'inquietud');
INSERT INTO sinonimos (palabra_id, sinonimo) VALUES ((SELECT id FROM palabras WHERE palabra = 'desasosiego'), 'desazón');
INSERT INTO sinonimos (palabra_id, sinonimo) VALUES ((SELECT id FROM palabras WHERE palabra = 'desasosiego'), 'ansiedad');
INSERT INTO sinonimos (palabra_id, sinonimo) VALUES ((SELECT id FROM palabras WHERE palabra = 'desasosiego'), 'desconcierto');
INSERT INTO sinonimos (palabra_id, sinonimo) VALUES ((SELECT id FROM palabras WHERE palabra = 'desasosiego'), 'intranquilidad');

-- Palabra: ojalá
INSERT INTO palabras (palabra, categoria, silabas, pronunciacion, origen) VALUES ('ojalá', 'expresion', 'o-ja-lá', '/o.xaˈla/', 'Del árabe andalusí law šá lláh, ''si Dios quiere''') ON CONFLICT (palabra) DO NOTHING;
INSERT INTO definiciones (palabra_id, numero, texto, ejemplo) VALUES ((SELECT id FROM palabras WHERE palabra = 'ojalá'), 1, 'Expresión que denota vivo deseo de que algo suceda o no suceda.', 'Ojalá llueva mañana y se llenen los embalses.');
INSERT INTO definiciones (palabra_id, numero, texto, ejemplo) VALUES ((SELECT id FROM palabras WHERE palabra = 'ojalá'), 2, 'Con subjuntivo: indica deseo irrealizable o improbable.', 'Ojalá pudiera volver atrás y cambiar esa decisión.');
INSERT INTO sinonimos (palabra_id, sinonimo) VALUES ((SELECT id FROM palabras WHERE palabra = 'ojalá'), 'Dios quiera');
INSERT INTO sinonimos (palabra_id, sinonimo) VALUES ((SELECT id FROM palabras WHERE palabra = 'ojalá'), 'ojalá que');
INSERT INTO sinonimos (palabra_id, sinonimo) VALUES ((SELECT id FROM palabras WHERE palabra = 'ojalá'), 'quién pudiera');

-- Palabra: traslúcida
INSERT INTO palabras (palabra, categoria, silabas, pronunciacion, origen) VALUES ('traslúcida', 'adjetivo', 'tras-lú-ci-da', '/tɾasˈlu.θi.ða/', 'Del latín translucere, ''traspasar la luz''') ON CONFLICT (palabra) DO NOTHING;
INSERT INTO definiciones (palabra_id, numero, texto, ejemplo) VALUES ((SELECT id FROM palabras WHERE palabra = 'traslúcida'), 1, 'Que deja pasar la luz de forma difusa, sin permitir ver con claridad los objetos al otro lado.', 'La cortina traslúcida dejaba entrar una luz suave y difusa.');
INSERT INTO definiciones (palabra_id, numero, texto, ejemplo) VALUES ((SELECT id FROM palabras WHERE palabra = 'traslúcida'), 2, 'En sentido figurado, claro, evidente, fácil de percibir.', 'Sus intenciones eran traslúcidas para todos menos para él.');
INSERT INTO sinonimos (palabra_id, sinonimo) VALUES ((SELECT id FROM palabras WHERE palabra = 'traslúcida'), 'translúcida');
INSERT INTO sinonimos (palabra_id, sinonimo) VALUES ((SELECT id FROM palabras WHERE palabra = 'traslúcida'), 'semitransparente');
INSERT INTO sinonimos (palabra_id, sinonimo) VALUES ((SELECT id FROM palabras WHERE palabra = 'traslúcida'), 'nítida');
INSERT INTO sinonimos (palabra_id, sinonimo) VALUES ((SELECT id FROM palabras WHERE palabra = 'traslúcida'), 'diáfana');

-- Palabra: albahaca
INSERT INTO palabras (palabra, categoria, silabas, pronunciacion, origen) VALUES ('albahaca', 'sustantivo', 'al-ba-ha-ca', '/al.baˈa.ka/', 'Del árabe al-habaqa, ''la albahaca''') ON CONFLICT (palabra) DO NOTHING;
INSERT INTO definiciones (palabra_id, numero, texto, ejemplo) VALUES ((SELECT id FROM palabras WHERE palabra = 'albahaca'), 1, 'Planta aromática anual de la familia de las labiadas, con hojas de suave perfume, usada en cocina y perfumería.', 'Preparó una salsa pesto con albahaca fresca del huerto.');
INSERT INTO definiciones (palabra_id, numero, texto, ejemplo) VALUES ((SELECT id FROM palabras WHERE palabra = 'albahaca'), 2, 'En algunas culturas, símbolo de amor y protección.', 'En la ventana siempre había una maceta de albahaca contra el mal de ojo.');
INSERT INTO sinonimos (palabra_id, sinonimo) VALUES ((SELECT id FROM palabras WHERE palabra = 'albahaca'), 'basílico');
INSERT INTO sinonimos (palabra_id, sinonimo) VALUES ((SELECT id FROM palabras WHERE palabra = 'albahaca'), 'hierba real');
INSERT INTO sinonimos (palabra_id, sinonimo) VALUES ((SELECT id FROM palabras WHERE palabra = 'albahaca'), 'hierba santa');

-- Palabra: menguar
INSERT INTO palabras (palabra, categoria, silabas, pronunciacion, origen) VALUES ('menguar', 'verbo', 'men-guar', '/menˈɣwaɾ/', 'Del latín minuere, ''disminuir''') ON CONFLICT (palabra) DO NOTHING;
INSERT INTO definiciones (palabra_id, numero, texto, ejemplo) VALUES ((SELECT id FROM palabras WHERE palabra = 'menguar'), 1, 'Ir disminuyendo o reduciéndose algo, ir perdiendo intensidad o cantidad.', 'La luna comenzó a menguar tras la noche de plenilunio.');
INSERT INTO definiciones (palabra_id, numero, texto, ejemplo) VALUES ((SELECT id FROM palabras WHERE palabra = 'menguar'), 2, 'Disminuir, mermar, hacer menor algo.', 'Nada podía menguar su entusiasmo por la música.');
INSERT INTO sinonimos (palabra_id, sinonimo) VALUES ((SELECT id FROM palabras WHERE palabra = 'menguar'), 'disminuir');
INSERT INTO sinonimos (palabra_id, sinonimo) VALUES ((SELECT id FROM palabras WHERE palabra = 'menguar'), 'decrecer');
INSERT INTO sinonimos (palabra_id, sinonimo) VALUES ((SELECT id FROM palabras WHERE palabra = 'menguar'), 'mermar');
INSERT INTO sinonimos (palabra_id, sinonimo) VALUES ((SELECT id FROM palabras WHERE palabra = 'menguar'), 'decaer');
INSERT INTO sinonimos (palabra_id, sinonimo) VALUES ((SELECT id FROM palabras WHERE palabra = 'menguar'), 'achicarse');

-- Palabra: hondonada
INSERT INTO palabras (palabra, categoria, silabas, pronunciacion, origen) VALUES ('hondonada', 'sustantivo', 'hon-do-na-da', '/on.doˈna.ða/', 'De hondo + -ada') ON CONFLICT (palabra) DO NOTHING;
INSERT INTO definiciones (palabra_id, numero, texto, ejemplo) VALUES ((SELECT id FROM palabras WHERE palabra = 'hondonada'), 1, 'Depresión del terreno, valle profundo entre montañas o colinas.', 'El pueblo se escondía en una hondonada verde y fértil.');
INSERT INTO definiciones (palabra_id, numero, texto, ejemplo) VALUES ((SELECT id FROM palabras WHERE palabra = 'hondonada'), 2, 'En sentido figurado, situación baja o desfavorable.', 'Tras la hondonada de la crisis, llegó la recuperación.');
INSERT INTO sinonimos (palabra_id, sinonimo) VALUES ((SELECT id FROM palabras WHERE palabra = 'hondonada'), 'valle');
INSERT INTO sinonimos (palabra_id, sinonimo) VALUES ((SELECT id FROM palabras WHERE palabra = 'hondonada'), 'depresión');
INSERT INTO sinonimos (palabra_id, sinonimo) VALUES ((SELECT id FROM palabras WHERE palabra = 'hondonada'), 'hoyada');
INSERT INTO sinonimos (palabra_id, sinonimo) VALUES ((SELECT id FROM palabras WHERE palabra = 'hondonada'), 'cañada');
INSERT INTO sinonimos (palabra_id, sinonimo) VALUES ((SELECT id FROM palabras WHERE palabra = 'hondonada'), 'cuenca');

-- Palabra: arrebol
INSERT INTO palabras (palabra, categoria, silabas, pronunciacion, origen) VALUES ('arrebol', 'sustantivo', 'a-rre-bol', '/a.reˈβol/', 'Del árabe ar-rummān, ''el granado'', por el color rojo') ON CONFLICT (palabra) DO NOTHING;
INSERT INTO definiciones (palabra_id, numero, texto, ejemplo) VALUES ((SELECT id FROM palabras WHERE palabra = 'arrebol'), 1, 'Color rojo vivo, especialmente el de las nubes iluminadas por el sol en el amanecer o el ocaso.', 'El arrebol del atardecer se reflejaba en el lago.');
INSERT INTO definiciones (palabra_id, numero, texto, ejemplo) VALUES ((SELECT id FROM palabras WHERE palabra = 'arrebol'), 2, 'Carmín o colorete para el rostro.', 'Se aplicó un toque de arrebol en las mejillas antes de salir.');
INSERT INTO sinonimos (palabra_id, sinonimo) VALUES ((SELECT id FROM palabras WHERE palabra = 'arrebol'), 'rubor');
INSERT INTO sinonimos (palabra_id, sinonimo) VALUES ((SELECT id FROM palabras WHERE palabra = 'arrebol'), 'carmín');
INSERT INTO sinonimos (palabra_id, sinonimo) VALUES ((SELECT id FROM palabras WHERE palabra = 'arrebol'), 'encendimiento');
INSERT INTO sinonimos (palabra_id, sinonimo) VALUES ((SELECT id FROM palabras WHERE palabra = 'arrebol'), 'rojizo');
INSERT INTO sinonimos (palabra_id, sinonimo) VALUES ((SELECT id FROM palabras WHERE palabra = 'arrebol'), 'coloradura');

-- Palabra: madrugada
INSERT INTO palabras (palabra, categoria, silabas, pronunciacion, origen) VALUES ('madrugada', 'sustantivo', 'ma-dru-ga-da', '/ma.ðɾuˈɣa.ða/', 'De madrugar, del latín matutinus') ON CONFLICT (palabra) DO NOTHING;
INSERT INTO definiciones (palabra_id, numero, texto, ejemplo) VALUES ((SELECT id FROM palabras WHERE palabra = 'madrugada'), 1, 'Primeras horas del día, desde que empieza a amanecer hasta que sale el sol.', 'Se levantó de madrugada para no perder el tren.');
INSERT INTO definiciones (palabra_id, numero, texto, ejemplo) VALUES ((SELECT id FROM palabras WHERE palabra = 'madrugada'), 2, 'Tiempo que transcurre desde la medianoche hasta el amanecer.', 'La madrugada es el momento más silencioso de la ciudad.');
INSERT INTO sinonimos (palabra_id, sinonimo) VALUES ((SELECT id FROM palabras WHERE palabra = 'madrugada'), 'alba');
INSERT INTO sinonimos (palabra_id, sinonimo) VALUES ((SELECT id FROM palabras WHERE palabra = 'madrugada'), 'amanecer');
INSERT INTO sinonimos (palabra_id, sinonimo) VALUES ((SELECT id FROM palabras WHERE palabra = 'madrugada'), 'primeras horas');
INSERT INTO sinonimos (palabra_id, sinonimo) VALUES ((SELECT id FROM palabras WHERE palabra = 'madrugada'), 'alborada');

-- Palabra: dichoso
INSERT INTO palabras (palabra, categoria, silabas, pronunciacion, origen) VALUES ('dichoso', 'adjetivo', 'di-cho-so', '/diˈtʃo.so/', 'Del latín dictiosus, ''feliz, afortunado''') ON CONFLICT (palabra) DO NOTHING;
INSERT INTO definiciones (palabra_id, numero, texto, ejemplo) VALUES ((SELECT id FROM palabras WHERE palabra = 'dichoso'), 1, 'Feliz, afortunado, que tiene dicha.', 'Era un dichoso que siempre encontraba motivos para sonreír.');
INSERT INTO definiciones (palabra_id, numero, texto, ejemplo) VALUES ((SELECT id FROM palabras WHERE palabra = 'dichoso'), 2, 'Irónicamente, molesto, fastidioso, maldito.', 'El dichoso coche se volvió a averiar en el peor momento.');
INSERT INTO sinonimos (palabra_id, sinonimo) VALUES ((SELECT id FROM palabras WHERE palabra = 'dichoso'), 'feliz');
INSERT INTO sinonimos (palabra_id, sinonimo) VALUES ((SELECT id FROM palabras WHERE palabra = 'dichoso'), 'afortunado');
INSERT INTO sinonimos (palabra_id, sinonimo) VALUES ((SELECT id FROM palabras WHERE palabra = 'dichoso'), 'bienaventurado');
INSERT INTO sinonimos (palabra_id, sinonimo) VALUES ((SELECT id FROM palabras WHERE palabra = 'dichoso'), 'maldito (irónico)');

-- Palabra: esparcir
INSERT INTO palabras (palabra, categoria, silabas, pronunciacion, origen) VALUES ('esparcir', 'verbo', 'es-par-cir', '/es.paɾˈθiɾ/', 'Del latín spargere, ''esparcir, derramar''') ON CONFLICT (palabra) DO NOTHING;
INSERT INTO definiciones (palabra_id, numero, texto, ejemplo) VALUES ((SELECT id FROM palabras WHERE palabra = 'esparcir'), 1, 'Derramar, extender o distribuir algo por diversas partes.', 'El viento esparció las semillas por todo el prado.');
INSERT INTO definiciones (palabra_id, numero, texto, ejemplo) VALUES ((SELECT id FROM palabras WHERE palabra = 'esparcir'), 2, 'Divertirse, recrearse, distraerse.', 'Los niños se esparcieron por el parque riendo y corriendo.');
INSERT INTO sinonimos (palabra_id, sinonimo) VALUES ((SELECT id FROM palabras WHERE palabra = 'esparcir'), 'derramar');
INSERT INTO sinonimos (palabra_id, sinonimo) VALUES ((SELECT id FROM palabras WHERE palabra = 'esparcir'), 'diseminar');
INSERT INTO sinonimos (palabra_id, sinonimo) VALUES ((SELECT id FROM palabras WHERE palabra = 'esparcir'), 'desparramar');
INSERT INTO sinonimos (palabra_id, sinonimo) VALUES ((SELECT id FROM palabras WHERE palabra = 'esparcir'), 'repartir');
INSERT INTO sinonimos (palabra_id, sinonimo) VALUES ((SELECT id FROM palabras WHERE palabra = 'esparcir'), 'expandir');

-- Palabra: candil
INSERT INTO palabras (palabra, categoria, silabas, pronunciacion, origen) VALUES ('candil', 'sustantivo', 'can-dil', '/kanˈdil/', 'Del árabe qandīl, ''lámpara'', del griego kandēlē') ON CONFLICT (palabra) DO NOTHING;
INSERT INTO definiciones (palabra_id, numero, texto, ejemplo) VALUES ((SELECT id FROM palabras WHERE palabra = 'candil'), 1, 'Lámpara portátil con aceite y mecha, usada antiguamente para alumbrar.', 'El anciano bajó al sótano con un candil tembloroso.');
INSERT INTO definiciones (palabra_id, numero, texto, ejemplo) VALUES ((SELECT id FROM palabras WHERE palabra = 'candil'), 2, 'En sentido figurado, persona o cosa que sirve de guía o luz.', 'Fue el candil que iluminó el camino de sus discípulos.');
INSERT INTO sinonimos (palabra_id, sinonimo) VALUES ((SELECT id FROM palabras WHERE palabra = 'candil'), 'lámpara');
INSERT INTO sinonimos (palabra_id, sinonimo) VALUES ((SELECT id FROM palabras WHERE palabra = 'candil'), 'linterna');
INSERT INTO sinonimos (palabra_id, sinonimo) VALUES ((SELECT id FROM palabras WHERE palabra = 'candil'), 'vela');
INSERT INTO sinonimos (palabra_id, sinonimo) VALUES ((SELECT id FROM palabras WHERE palabra = 'candil'), 'farol');
INSERT INTO sinonimos (palabra_id, sinonimo) VALUES ((SELECT id FROM palabras WHERE palabra = 'candil'), 'mechero');

-- Palabra: centellear
INSERT INTO palabras (palabra, categoria, silabas, pronunciacion, origen) VALUES ('centellear', 'verbo', 'cen-te-lle-ar', '/θen.te.ʎeˈaɾ/', 'De centella, del latín scintilla, ''chispa''') ON CONFLICT (palabra) DO NOTHING;
INSERT INTO definiciones (palabra_id, numero, texto, ejemplo) VALUES ((SELECT id FROM palabras WHERE palabra = 'centellear'), 1, 'Emitir centellas o destellos, brillar de manera intermitente.', 'Las estrellas centelleaban en la noche despejada del desierto.');
INSERT INTO definiciones (palabra_id, numero, texto, ejemplo) VALUES ((SELECT id FROM palabras WHERE palabra = 'centellear'), 2, 'En sentido figurado, mostrarse vivo y brillante, referido a los ojos o la mirada.', 'Sus ojos centelleaban de curiosidad ante cada descubrimiento.');
INSERT INTO sinonimos (palabra_id, sinonimo) VALUES ((SELECT id FROM palabras WHERE palabra = 'centellear'), 'destellar');
INSERT INTO sinonimos (palabra_id, sinonimo) VALUES ((SELECT id FROM palabras WHERE palabra = 'centellear'), 'brillar');
INSERT INTO sinonimos (palabra_id, sinonimo) VALUES ((SELECT id FROM palabras WHERE palabra = 'centellear'), 'relampaguear');
INSERT INTO sinonimos (palabra_id, sinonimo) VALUES ((SELECT id FROM palabras WHERE palabra = 'centellear'), 'chispear');
INSERT INTO sinonimos (palabra_id, sinonimo) VALUES ((SELECT id FROM palabras WHERE palabra = 'centellear'), 'fulgurar');

-- Palabra: conque
INSERT INTO palabras (palabra, categoria, silabas, pronunciacion, origen) VALUES ('conque', 'conjugacion', 'con-que', '/ˈkoŋ.ke/', 'De con + que') ON CONFLICT (palabra) DO NOTHING;
INSERT INTO definiciones (palabra_id, numero, texto, ejemplo) VALUES ((SELECT id FROM palabras WHERE palabra = 'conque'), 1, 'Conjunción que expresa consecuencia o causa, equivalente a ''así que'', ''de modo que''.', 'Llueve, conque no salgas sin paraguas.');
INSERT INTO definiciones (palabra_id, numero, texto, ejemplo) VALUES ((SELECT id FROM palabras WHERE palabra = 'conque'), 2, 'Interjección que expresa sorpresa o comprobación.', 'Conque era verdad lo que decían de ti.');
INSERT INTO sinonimos (palabra_id, sinonimo) VALUES ((SELECT id FROM palabras WHERE palabra = 'conque'), 'así que');
INSERT INTO sinonimos (palabra_id, sinonimo) VALUES ((SELECT id FROM palabras WHERE palabra = 'conque'), 'por tanto');
INSERT INTO sinonimos (palabra_id, sinonimo) VALUES ((SELECT id FROM palabras WHERE palabra = 'conque'), 'de modo que');
INSERT INTO sinonimos (palabra_id, sinonimo) VALUES ((SELECT id FROM palabras WHERE palabra = 'conque'), 'luego');

-- Palabra: luminaria
INSERT INTO palabras (palabra, categoria, silabas, pronunciacion, origen) VALUES ('luminaria', 'sustantivo', 'lu-mi-na-ria', '/lu.miˈna.ɾja/', 'Del latín luminaria, ''lumbrera, antorcha''') ON CONFLICT (palabra) DO NOTHING;
INSERT INTO definiciones (palabra_id, numero, texto, ejemplo) VALUES ((SELECT id FROM palabras WHERE palabra = 'luminaria'), 1, 'Luz que se pone en las calles y casas para festejar algo.', 'Encendieron luminarias para celebrar la victoria del equipo.');
INSERT INTO definiciones (palabra_id, numero, texto, ejemplo) VALUES ((SELECT id FROM palabras WHERE palabra = 'luminaria'), 2, 'Persona que destaca de forma eminente en una ciencia, arte o actividad.', 'Era una luminaria de la física teórica reconocida mundialmente.');
INSERT INTO sinonimos (palabra_id, sinonimo) VALUES ((SELECT id FROM palabras WHERE palabra = 'luminaria'), 'lumbrera');
INSERT INTO sinonimos (palabra_id, sinonimo) VALUES ((SELECT id FROM palabras WHERE palabra = 'luminaria'), 'antorcha');
INSERT INTO sinonimos (palabra_id, sinonimo) VALUES ((SELECT id FROM palabras WHERE palabra = 'luminaria'), 'farol');
INSERT INTO sinonimos (palabra_id, sinonimo) VALUES ((SELECT id FROM palabras WHERE palabra = 'luminaria'), 'emérito');
INSERT INTO sinonimos (palabra_id, sinonimo) VALUES ((SELECT id FROM palabras WHERE palabra = 'luminaria'), 'genio');

