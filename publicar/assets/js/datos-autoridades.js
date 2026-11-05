/* Contraste · datos de autoridades, noticias y coberturas comparadas.
   Base demostrativa con información real verificada. No se actualiza sola.
   d = fecha del hecho o de publicación (AAAA-MM-DD); fecha = texto visible con su precisión real. */
window.CONTRASTE_DATA = (function () {
    const P = [
    { id: 'desbordes', nombre: 'Mario Desbordes Jiménez', ini: 'MD', tipo: 'Alcaldes', cargoCorto: 'Alcalde de Santiago',
      cargo: 'Alcalde de Santiago', institucion: 'Municipalidad de Santiago', partido: 'Independiente (ex RN)', partidoF: 'Independiente',
      region: 'Región Metropolitana', periodo: '2024–2028', resumen: 'Ex ministro de Defensa. Electo en 2024 con 51,08%.',
      resena: 'Abogado y ex oficial de Carabineros. Fue subsecretario de Investigaciones (2010), diputado (2018–2020) y ministro de Defensa (2020). Electo alcalde de Santiago en 2024. Renunció a Renovación Nacional en marzo de 2026.',
      temas: ['Seguridad', 'Espacio público'], oficialFuente: 'BCN',
      partidoHist: [{ hasta: '2026-03-22', partido: 'Renovación Nacional' }, { desde: '2026-03-23', partido: 'Independiente' }],
      trayectoria: [{ cargo: 'Alcalde de Santiago', periodo: '2024–2028', actual: true }, { cargo: 'Ministro de Defensa Nacional', periodo: '2020' }, { cargo: 'Diputado', periodo: '2018–2020' }, { cargo: 'Subsecretario de Investigaciones', periodo: '2010' }], trayFuente: 'Reseña biográfica de la BCN', oficialUrl: 'https://www.bcn.cl/historiapolitica/resenas_parlamentarias/wiki/Mario_Guillermo_Desbordes_Jim%C3%A9nez',
      news: [
        { d: '2026-09-17', fecha: '17 sep 2026', medio: 'T13', tm: 'Nacional', tema: 'Seguridad', orig: false, titulo: 'Desbordes advierte que una posible causal de destitución en el reglamento de la Ley de Seguridad Municipal podría usarse políticamente', resumen: 'Valoró que el Gobierno abriera una mesa para corregir el reglamento, pero cuestionó exigencias que a su juicio no eran necesarias.', url: 'https://www.t13.cl/noticia/politica/desbordes-advierte-supuesta-causal-destitucion-reglamento-ley-seguridad-17-9-2026' },
        { d: '2026-09-15', fecha: '15 sep 2026', medio: 'El Dínamo', tm: 'Digital', tema: 'Política', orig: false, titulo: 'Desbordes critica a parlamentarios de su sector por frenar la agenda del Gobierno', resumen: 'En 24 Horas sostuvo que los proyectos contra las incivilidades están detenidos en el Congreso, tras los daños en edificios patrimoniales del 11 de septiembre.', url: 'https://www.eldinamo.cl/politica/2026/09/15/la-acida-critica-de-desbordes-a-la-derecha-harto-parlamentario-se-da-gustito-frenandole-la-agenda-al-gobierno' },
        { d: '2026-07-28', fecha: 'jul 2026', medio: 'Municipalidad de Santiago', tm: 'Oficial', tema: 'Seguridad', orig: false, titulo: 'Desbordes propone un protocolo nacional para coordinar municipios y seguridad privada', resumen: 'En el Seminario ASEVA 2026 planteó preparar el trabajo conjunto ante la Ley de Seguridad Municipal. Reiteró que no es partidario de crear policías municipales.', url: 'https://www.munistgo.cl/alcalde-desbordes-propone-coordinar-a-municipios-y-seguridad-privada-con-un-protocolo-nacional-de-seguridad/' },
        { d: '2026-04-16', fecha: '16 abr 2026', medio: 'BioBío Chile', tm: 'Nacional', tema: 'Política', orig: false, titulo: 'Desbordes anuncia que buscará ser reelegido como alcalde de Santiago', resumen: 'Dijo que busca otro período para terminar proyectos como la construcción de cuatro Cesfam.', url: 'https://www.biobiochile.cl/noticias/nacional/region-metropolitana/2026/04/16/el-desafio-es-enorme-mario-desbordes-anuncia-que-buscara-ser-reelegido-como-alcalde-de-santiago.shtml' },
        { d: '2026-03-23', fecha: '23 mar 2026', medio: 'Prensa Latina', tm: 'Internacional', tema: 'Política', orig: true, titulo: 'Alcalde de comuna chilena de Santiago renuncia a su partido', resumen: 'Dejó Renovación Nacional tras 26 años de militancia. Fuentes cercanas lo vinculan a discrepancias con la directiva.', url: 'https://www.prensa-latina.cu/2026/03/23/alcalde-de-comuna-chilena-de-santiago-renuncia-a-su-partido/' }
      ],
      vot: [
        { d: '2026-07-28', fecha: 'jul 2026', instancia: 'Gestión municipal', titulo: 'Propuesta de protocolo nacional de seguridad', detalle: 'Coordinación entre municipios, policías y seguridad privada ante la nueva Ley de Seguridad Municipal.', voto: 'Decisión', fuente: 'Municipalidad de Santiago', url: 'https://www.munistgo.cl/alcalde-desbordes-propone-coordinar-a-municipios-y-seguridad-privada-con-un-protocolo-nacional-de-seguridad/' },
        { d: '2024-12-06', fecha: 'dic 2024', instancia: 'Gestión municipal', titulo: 'Retiro de banderas del frontis municipal', detalle: 'Al asumir, el municipio retiró las banderas del pueblo mapuche y de la diversidad sexual del frontis, mientras el alcalde anunciaba la seguridad como prioridad.', voto: 'Decisión', fuente: 'El Ciudadano', url: 'https://www.elciudadano.com/chile/%f0%9f%94%b4videollego-el-lado-oscuro-mario-desbordes-saca-banderas-de-diversidades-y-pueblos-indigenas-del-frontis-del-municipio/12/06/' }
      ],
      fue: [
        { titulo: 'Reseña biográfica', fuente: 'Biblioteca del Congreso Nacional', estado: 'Revisado', url: 'https://www.bcn.cl/historiapolitica/resenas_parlamentarias/wiki/Mario_Guillermo_Desbordes_Jim%C3%A9nez' },
        { titulo: 'Sitio de la Municipalidad de Santiago', fuente: 'munistgo.cl', estado: 'Revisado', url: 'https://www.munistgo.cl' },
        { titulo: 'Resultados electorales', fuente: 'Servel', estado: 'Ver en portal', url: 'https://www.servel.cl' },
        { titulo: 'Audiencias de lobby', fuente: 'InfoLobby', estado: 'Ver en portal', url: 'https://www.infolobby.cl' },
        { titulo: 'Declaración de intereses y patrimonio', fuente: 'InfoProbidad', estado: 'Ver en portal', url: 'https://www.infoprobidad.cl' }
      ],
      conf: [
        { tema: 'Militancia', aFuente: 'Prensa de 2024', aDice: 'Renovación Nacional', bFuente: 'El Dínamo, sep 2026', bDice: 'Independiente', aclaraFuente: 'BCN', aclara: 'Renunció a RN a fines de marzo de 2026.', estado: 'Aclarado' },
        { tema: 'Lugar de nacimiento', aFuente: 'Wikipedia en inglés', aDice: 'Santiago', bFuente: 'BCN y Ex-Ante', bDice: 'Los Andes', aclaraFuente: 'BCN', aclara: 'La reseña oficial indica Los Andes, 15 de octubre de 1968.', estado: 'Aclarado' }
      ] },

    { id: 'tvodanovic', nombre: 'Tomás Vodanovic Escudero', ini: 'TV', tipo: 'Alcaldes', cargoCorto: 'Alcalde de Maipú',
      cargo: 'Alcalde de Maipú', institucion: 'Municipalidad de Maipú', partido: 'Frente Amplio', partidoF: 'Frente Amplio',
      region: 'Región Metropolitana', periodo: '2024–2028 (en el cargo desde 2021)', resumen: 'Sociólogo. Reelecto en 2024.',
      resena: 'Sociólogo. Asumió como alcalde de Maipú en junio de 2021 y fue reelecto en 2024. Su gestión ha puesto énfasis en la red de salud primaria, las obras de barrio y la persecución de casos de corrupción de administraciones anteriores.',
      temas: ['Obras', 'Probidad', 'Salud primaria'], trayectoria: [{ cargo: 'Alcalde de Maipú (reelecto)', periodo: '2024–2028', actual: true }, { cargo: 'Alcalde de Maipú', periodo: '2021–2024' }], trayFuente: 'Municipalidad de Maipú', oficialFuente: 'Municipalidad de Maipú', oficialUrl: 'https://www.municipalidadmaipu.cl/alcalde',
      news: [
        { d: '2026-08-13', fecha: '13 ago 2026', medio: 'La Voz de Maipú', tm: 'Local', tema: 'Obras', orig: true, titulo: 'Maipú alcanza 98% de luminarias LED tras recambio en Parque Judea', resumen: 'El municipio terminó el recambio de luminarias en Parque Judea.', url: 'https://lavozdemaipu.cl/maipu-finalizo-el-recambio-a-31-luminarias-led-en-parque-judea/' },
        { d: '2026-06-08', fecha: '8 jun 2026', medio: 'La Voz de Maipú', tm: 'Local', tema: 'Obras', orig: true, titulo: 'Avanzan obras de pavimentación en Maipú: alcalde Vodanovic anuncia nuevos proyectos en la comuna', resumen: 'El municipio comenzó a renovar las calles de la Villa El Abrazo, partiendo por calle Judea.', url: 'https://lavozdemaipu.cl/avanzan-proyectos-de-pavimentacion-en-maipu/' },
        { d: '2025-11-14', fecha: 'nov 2025', medio: 'La Tercera', tm: 'Nacional', tema: 'Política', orig: false, titulo: 'Vodanovic apoya a un candidato que compite contra su propio partido', resumen: 'Respaldó públicamente a Gustavo Gatica (cupo PC, distrito 8), que competía contra dos candidatas del Frente Amplio.', url: 'https://www.latercera.com/politica/noticia/vodanovic-el-alcalde-que-desafio-a-su-directiva-y-apoyo-a-un-candidato-que-compite-contra-el-fa/' },
        { d: '2025-03-05', fecha: '5 mar 2025', medio: 'X (cuenta del alcalde)', tm: 'Redes sociales', tema: 'Probidad', orig: false, titulo: 'Municipio presenta querella contra el diputado Joaquín Lavín León', resumen: 'Informó una querella por eventuales delitos de tráfico de influencias y fraude al fisco.', url: 'https://x.com/TomasVodanovic' }
      ],
      vot: [
        { d: '2026-08-13', fecha: 'ago 2026', instancia: 'Gestión municipal', titulo: 'Recambio de luminarias LED', detalle: 'La comuna llegó a 98% de luminarias LED.', voto: 'Decisión', fuente: 'La Voz de Maipú', url: 'https://lavozdemaipu.cl/maipu-finalizo-el-recambio-a-31-luminarias-led-en-parque-judea/' },
        { d: '2026-06-08', fecha: 'jun 2026', instancia: 'Gestión municipal', titulo: 'Plan de repavimentación', detalle: 'Inicio de obras en la Villa El Abrazo y anuncio de nuevos proyectos.', voto: 'Decisión', fuente: 'La Voz de Maipú', url: 'https://lavozdemaipu.cl/avanzan-proyectos-de-pavimentacion-en-maipu/' },
        { d: '2025-03-05', fecha: 'mar 2025', instancia: 'Acción judicial del municipio', titulo: 'Querella por tráfico de influencias y fraude al fisco', detalle: 'Presentada por la Municipalidad de Maipú contra el diputado Joaquín Lavín León.', voto: 'Decisión', fuente: 'X del alcalde', url: 'https://x.com/TomasVodanovic' }
      ],
      fue: [
        { titulo: 'Página del alcalde (reemplaza la ficha de la AChM, que ya no existe)', fuente: 'Municipalidad de Maipú', estado: 'Revisado', url: 'https://www.municipalidadmaipu.cl/alcalde', verificado: '2026-10-15' },
        { titulo: 'Resultados electorales', fuente: 'Servel', estado: 'Ver en portal', url: 'https://www.servel.cl' },
        { titulo: 'Audiencias de lobby', fuente: 'InfoLobby', estado: 'Ver en portal', url: 'https://www.infolobby.cl' },
        { titulo: 'Declaración de intereses y patrimonio', fuente: 'InfoProbidad', estado: 'Ver en portal', url: 'https://www.infoprobidad.cl' }
      ],
      conf: [
        { tema: 'Partido', aFuente: 'Chilevisión, 2021', aDice: 'Revolución Democrática (RD)', bFuente: 'La Tercera, 2025', bDice: 'Frente Amplio (FA)', aclaraFuente: 'La Tercera, mar 2024', aclara: 'RD y Convergencia Social aprobaron fusionarse en el partido único Frente Amplio. Ambas versiones eran correctas en su fecha.', estado: 'Aclarado' }
      ] },

    { id: 'orrego', nombre: 'Claudio Orrego', ini: 'CO', tipo: 'Gobernadores', cargoCorto: 'Gobernador Regional Metropolitano',
      cargo: 'Gobernador Regional Metropolitano de Santiago', institucion: 'Gobierno Regional Metropolitano', partido: 'Independiente (ex DC)', partidoF: 'Independiente',
      region: 'Región Metropolitana', periodo: '2025–2029 (en el cargo desde 2021)', resumen: 'Ex alcalde de Peñalolén y ex ministro.',
      resena: 'Fue alcalde de Peñalolén, ministro de Vivienda y Urbanismo, ministro de Bienes Nacionales e intendente de la Región Metropolitana. Gobernador regional desde 2021. Renunció a la Democracia Cristiana en octubre de 2022, tras 33 años de militancia.',
      temas: ['Presupuesto regional', 'Ciudad', 'Política'], trayectoria: [{ cargo: 'Gobernador Regional Metropolitano (reelecto)', periodo: '2025–2029', actual: true }, { cargo: 'Gobernador Regional Metropolitano', periodo: '2021–2025' }], oficialFuente: 'Subdere', oficialUrl: 'https://www.subdere.gov.cl/content/claudio-orrego',
      news: [
        { d: '2026-09-28', fecha: '28 sep 2026', medio: 'La Tercera', tm: 'Nacional', tema: 'Presupuesto', ev: 'recorte', orig: false, titulo: 'Orrego se convierte en “portavoz” de las críticas a recortes y proyectos pausados', resumen: 'Analiza su rol como voz crítica del Gobierno, su nueva unidad internacional en el Gore y su disputa con el ministro Poduje por el Parque Cerro Chena.', url: 'https://www.latercera.com/nacional/noticia/orrego-endurece-el-tono-contra-el-gobierno-y-se-convierte-en-portavoz-de-criticas-por-recortes-y-proyectos-pausados/', proyecto: '18702-05' },
        { d: '2026-09-26', fecha: '26 sep 2026', medio: 'Está Pasando', tm: 'Digital', tema: 'Presupuesto', ev: 'recorte', orig: true, titulo: 'Gobernador Orrego cuestiona recorte de entre 7% y 10% a regiones', resumen: 'Criticó el posible recorte para 2027 y la falta de continuidad del GAM, la ciclovía de la Alameda y el tren a Melipilla.', url: 'https://estapasando.cl/politica/gobernador-orrego-cuestiona-recorte-de-entre-7-y-10-a-regiones/', proyecto: '18702-05' },
        { d: '2026-09-26', fecha: '26 sep 2026', medio: 'El Diario Santiago', tm: 'Local', tema: 'Presupuesto', ev: 'recorte', orig: true, titulo: 'Orrego alerta por eventual recorte a gobiernos regionales y cuestiona postergación de obras', resumen: 'Advirtió por el efecto de un ajuste de hasta 10% en la continuidad de obras de infraestructura.', url: 'https://eldiariosantiago.cl/2026/09/26/orrego-recorte-gobiernos-regionales-presupuesto-2027/', proyecto: '18702-05' },
        { d: '2026-09-15', fecha: '15 sep 2026', medio: 'The Clinic', tm: 'Digital', tema: 'Política', orig: false, titulo: 'Orrego se rearma políticamente tras el fallo del Tricel', resumen: 'Tras la resolución del Tricel, se reunió con alcaldes en la sede del Gore y se reconcilió con Sichel, con quien tenía un quiebre.', url: 'https://www.theclinic.cl/2026/09/15/el-rearme-de-claudio-orrego-tras-sobrevivir-en-el-tricel-vuelve-a-tejer-redes-politicas-y-se-reconcilia-con-sichel' },
        { d: '2026-09-13', fecha: '13 sep 2026', medio: 'La Tercera', tm: 'Nacional', tema: 'Política', orig: true, titulo: 'Gobernador Claudio Orrego acusa operación política de Republicanos', resumen: 'Luego de que el Tricel rechazara destituirlo, acusó una operación política del Partido Republicano.', url: 'https://www.latercera.com/videos/noticia/gobernador-claudio-orrego-acusa-operacion-politica-de-republicanos/' },
        { d: '2026-09-03', fecha: '3 sep 2026', medio: 'Gobierno de Santiago', tm: 'Oficial', tema: 'Ciudad', orig: true, titulo: 'Gobernador Claudio Orrego participó del conversatorio “La ciudad en 30 años”', resumen: 'Compartió el encuentro con los alcaldes Vodanovic y Bellolio y llamó a traducir acuerdos en proyectos concretos.', url: 'https://www.gobiernosantiago.cl/2026/09/03/gobernador-claudio-orrego-participo-del-conversatorio-la-ciudad-en-30-anos/', tambien: ['tvodanovic', 'bellolio'] }
      ],
      vot: [
        { d: '2026-09-28', fecha: 'sep 2026', instancia: 'Gobierno Regional', titulo: 'Unidad de relaciones internacionales en el Gore', detalle: 'Lanzó una “mini Cancillería” dentro del Gobierno Regional.', voto: 'Decisión', fuente: 'La Tercera', url: 'https://www.latercera.com/nacional/noticia/orrego-endurece-el-tono-contra-el-gobierno-y-se-convierte-en-portavoz-de-criticas-por-recortes-y-proyectos-pausados/' },
        { d: '2026-09-12', fecha: 'sep 2026', instancia: 'Tribunal Calificador de Elecciones', titulo: 'Requerimiento de destitución rechazado', detalle: 'El Tricel rechazó la solicitud presentada por consejeros regionales UDI y republicanos.', voto: 'Hecho', fuente: 'La Tercera', url: 'https://www.latercera.com/videos/noticia/gobernador-claudio-orrego-acusa-operacion-politica-de-republicanos/' }
      ],
      fue: [
        { titulo: 'Ficha de autoridad regional', fuente: 'Subdere', estado: 'Revisado', url: 'https://www.subdere.gov.cl/content/claudio-orrego' },
        { titulo: 'Sitio del Gobierno de Santiago', fuente: 'gobiernosantiago.cl', estado: 'Revisado', url: 'https://www.gobiernosantiago.cl' },
        { titulo: 'Resultados electorales', fuente: 'Servel', estado: 'Ver en portal', url: 'https://www.servel.cl' },
        { titulo: 'Audiencias de lobby', fuente: 'InfoLobby', estado: 'Ver en portal', url: 'https://www.infolobby.cl' },
        { titulo: 'Declaración de intereses y patrimonio', fuente: 'InfoProbidad', estado: 'Ver en portal', url: 'https://www.infoprobidad.cl' }
      ],
      conf: [
        { tema: 'Militancia', aFuente: 'Sufragio.org, ago 2026', aDice: 'Militante DC', bFuente: 'The Clinic, sep 2026', bDice: 'Ex DC', aclaraFuente: 'CNN Chile y Emol, oct 2022', aclara: 'Renunció a la DC el 10 de octubre de 2022. La versión A está desactualizada.', estado: 'Aclarado' },
        { tema: 'Año del poema citado en su carta de renuncia', aFuente: 'The Clinic', aDice: '1972', bFuente: 'Chilevisión, Emol y CNN Chile', bDice: '1975', aclaraFuente: 'Sin documento original', aclara: 'Habría que revisar la carta original para confirmarlo.', estado: 'Sin resolver' }
      ] },

    { id: 'mundaca', nombre: 'Rodrigo Mundaca Cabrera', ini: 'RM', tipo: 'Gobernadores', cargoCorto: 'Gobernador Regional de Valparaíso',
      cargo: 'Gobernador Regional de Valparaíso', institucion: 'Gobierno Regional de Valparaíso', partido: 'Independiente (Modatima)', partidoF: 'Independiente',
      region: 'Valparaíso', periodo: '2025–2029 (en el cargo desde 2021)', resumen: 'Activista por el agua. Reelecto en 2024.',
      resena: 'Ingeniero agrícola y activista por el acceso al agua, vocero de Modatima. Primer gobernador electo de Valparaíso en 2021 y reelecto en 2024, en segunda vuelta frente a María José Hoffmann (UDI).',
      temas: ['Reconstrucción', 'Presupuesto regional', 'Agua'], trayectoria: [{ cargo: 'Gobernador Regional de Valparaíso (reelecto)', periodo: '2025–2029', actual: true }, { cargo: 'Gobernador Regional de Valparaíso', periodo: '2021–2025' }], oficialFuente: 'Subdere', oficialUrl: 'https://www.subdere.gov.cl/content/rodrigo-mundaca-cabrera',
      news: [
        { d: '2026-10-01', fecha: '1 oct 2026', medio: 'The Clinic', tm: 'Digital', tema: 'Política', orig: false, titulo: 'Mundaca cuestiona la idea de liderazgos “ordenadores” en la izquierda y el Presupuesto 2027', resumen: 'Habla de sus reuniones con el ministro Quiroz y de los ingresos propios del Gore por casinos.', url: 'https://www.theclinic.cl/2026/10/01/rodrigo-mundaca-gobernador-de-valparaiso-y-el-rol-de-bachelet-y-boric-en-la-izquierda-no-creo-en-liderazgos-politicos-disciplinadores/', proyecto: '18702-05' },
        { d: '2026-07-11', fecha: '11 jul 2026', medio: 'BioBío Chile', tm: 'Nacional', tema: 'Justicia', orig: true, titulo: 'Declaran en rebeldía a gobernador regional de Valparaíso, Rodrigo Mundaca, por ausentarse de audiencia', resumen: 'Ocurrió en una demanda por jactancia presentada por un abogado y columnista regional.', url: 'https://www.biobiochile.cl/noticias/nacional/region-de-valparaiso/2026/07/11/declaran-en-rebeldia-a-gobernador-regional-de-valparaiso-rodrigo-mundaca-por-ausentarse-de-audiencia.shtml' },
        { d: '2026-05-22', fecha: '22 may 2026', medio: 'The Clinic', tm: 'Digital', tema: 'Política', orig: false, titulo: 'Mundaca y un nuevo bloque de oposición con alcaldes y dirigentes', resumen: 'Describe un espacio con alcaldes, dirigentes y la senadora Campillai, con proyección electoral.', url: 'https://www.theclinic.cl/2026/05/22/rodrigo-mundaca-gobernador-de-valparaiso-y-nuevo-bloque-de-oposicion-esta-no-es-la-izquierda-radical/' },
        { d: '2026-02-13', fecha: '13 feb 2026', medio: 'Emol', tm: 'Nacional', tema: 'Reconstrucción', orig: true, titulo: 'Rodrigo Mundaca y reconstrucción en Valparaíso: “El Gobierno se retira sin haber cumplido”', resumen: 'Criticó la gestión del gobierno saliente en la reconstrucción tras el megaincendio de 2024.', url: 'https://www.emol.com/noticias/Nacional/2026/02/13/1191405/gobernador-valparaiso-gobierno-no-cumplio.html' }
      ],
      vot: [
        { d: '2026-10-01', fecha: '2026', instancia: 'Gobierno Regional', titulo: 'Reuniones con Hacienda por el Presupuesto 2027', detalle: 'Ha participado en reuniones con el ministro Jorge Quiroz en el marco de la discusión presupuestaria.', voto: 'Hecho', fuente: 'The Clinic', url: 'https://www.theclinic.cl/2026/10/01/rodrigo-mundaca-gobernador-de-valparaiso-y-el-rol-de-bachelet-y-boric-en-la-izquierda-no-creo-en-liderazgos-politicos-disciplinadores/' }
      ],
      fue: [
        { titulo: 'Ficha de autoridad regional', fuente: 'Subdere', estado: 'Revisado', url: 'https://www.subdere.gov.cl/content/rodrigo-mundaca-cabrera', verificado: '2026-10-15' },
        { titulo: 'Sitio del Gobierno Regional (no respondía al 15 oct 2026; se mantiene por ser el sitio oficial)', fuente: 'gorevalparaiso.cl', estado: 'Ver en portal', url: 'https://www.gorevalparaiso.cl' },
        { titulo: 'Resultados electorales', fuente: 'Servel', estado: 'Ver en portal', url: 'https://www.servel.cl' },
        { titulo: 'Audiencias de lobby', fuente: 'InfoLobby', estado: 'Ver en portal', url: 'https://www.infolobby.cl' },
        { titulo: 'Declaración de intereses y patrimonio', fuente: 'InfoProbidad', estado: 'Ver en portal', url: 'https://www.infoprobidad.cl' }
      ],
      conf: [
        { tema: 'Votación en la elección de 2021', aFuente: 'La Tercera, noche de la elección', aDice: '293.593 votos (43,67%)', bFuente: 'Wikipedia', bDice: '298.363 votos (43,71%)', aclaraFuente: 'Pendiente', aclara: 'La diferencia podría deberse a un conteo parcial. Falta confirmarlo en el Servel.', estado: 'Sin resolver' }
      ] },

    { id: 'arrau', nombre: 'Martín Arrau García-Huidobro', ini: 'MA', tipo: 'Ministros', cargoCorto: 'Ministro de Seguridad Pública',
      cargo: 'Ministro de Seguridad Pública', institucion: 'Ministerio de Seguridad Pública', partido: 'Partido Republicano', partidoF: 'Partido Republicano',
      region: 'Nacional', periodo: 'Desde el 19 de mayo de 2026', resumen: 'Antes ministro de Obras Públicas.',
      resena: 'Ingeniero civil industrial (UC). Fue convencional constituyente (2021–2022) y jefe de la campaña presidencial de José Antonio Kast. Ministro de Obras Públicas desde marzo de 2026, asumió Seguridad Pública en el primer cambio de gabinete.',
      temas: ['Seguridad', 'Crimen organizado', 'Presupuesto'], trayectoria: [{ cargo: 'Ministro de Seguridad Pública', periodo: 'Desde may 2026', actual: true }, { cargo: 'Ministro de Obras Públicas', periodo: 'mar–may 2026' }, { cargo: 'Convencional constituyente', periodo: '2021–2022' }], oficialFuente: 'Cámara de Diputadas y Diputados', oficialUrl: 'https://www.camara.cl/cms/2026/06/04/ministro-arrau-expone-ante-seguridad-ciudadana-ejes-legislativos-y-de-gestion/',
      news: [
        { d: '2026-10-12', fecha: '12 oct 2026', medio: 'Emol', tm: 'Nacional', tema: 'Presupuesto', orig: false, titulo: 'Arrau califica de “histórico” el presupuesto 2027 para las policías', resumen: 'También anticipó resguardos para eventos masivos de la semana y para el 18 de octubre.', url: 'https://www.emol.com/noticias/Nacional/2026/10/12/1213909/arrau-presupuesto-historico-despliegue-convocatorias.html', proyecto: '18702-05' },
        { d: '2026-10-07', fecha: '7 oct 2026', medio: 'Emol', tm: 'Nacional', tema: 'Seguridad', ev: 'ruf', orig: false, titulo: 'Senado aprueba las Reglas de Uso de la Fuerza', resumen: 'Tras la votación, Arrau dijo que la ley da rango legal a las reglas y entrega más claridad a las policías.', url: 'https://www.emol.com/noticias/Nacional/2026/10/07/1213556/senado-aprueba-ruf-despacha-ley.html', proyecto: '15805-07' },
        { d: '2026-06-04', fecha: '4 jun 2026', medio: 'Cámara de Diputadas y Diputados', tm: 'Oficial', tema: 'Seguridad', orig: true, titulo: 'Ministro Arrau expone ante Seguridad Ciudadana ejes legislativos y de gestión', resumen: 'Presentó siete ejes y anunció proyectos sobre retención migratoria, crimen organizado y un registro de vándalos.', url: 'https://www.camara.cl/cms/2026/06/04/ministro-arrau-expone-ante-seguridad-ciudadana-ejes-legislativos-y-de-gestion/' },
        { d: '2026-05-25', fecha: '25 may 2026', medio: 'Emol', tm: 'Nacional', tema: 'Seguridad', orig: true, titulo: 'Arrau afirma que actual política de seguridad promulgado por Boric “es suficiente”', resumen: 'Señaló que el ministerio trabajará sobre la Política Nacional de Seguridad vigente.', url: 'https://www.emol.com/noticias/Nacional/2026/05/25/1200917/ministro-arrau-seguridad-comite.html' },
        { d: '2026-05-20', fecha: '20 may 2026', medio: 'Chilevisión', tm: 'Nacional', tema: 'Gabinete', ev: 'gabinete', orig: true, titulo: 'Arrau agradeció “camino recorrido” por Steinert y prometió enfrentar “profundo problema de seguridad”', resumen: 'Sus primeras declaraciones como ministro: foco en víctimas, narcotráfico y crimen organizado.', url: 'https://www.chilevision.cl/noticias/nacional/arrau-agradecio-camino-recorrido-por-steinert-y-prometio-enfrentar-profundo-problema-de-seguridad/amp/' },
        { d: '2026-05-20', fecha: '20 may 2026', medio: 'El Dínamo', tm: 'Digital', tema: 'Gabinete', ev: 'gabinete', orig: false, titulo: 'Quién es Martín Arrau, el hombre de confianza de Kast en Seguridad', resumen: 'Repasa su trayectoria y una polémica anterior con socios de Colo Colo.', url: 'https://www.eldinamo.cl/politica/2026/05/20/martin-arrau-el-hombre-de-confianza-de-kast-que-buscara-fortalecer-el-ministerio-de-seguridad/' },
        { d: '2026-05-19', fecha: '19 may 2026', medio: 'The Clinic', tm: 'Digital', tema: 'Gabinete', ev: 'gabinete', orig: false, titulo: 'Arrau, la apuesta de Kast para mejorar la gestión en Seguridad', resumen: 'Recoge las reacciones del oficialismo y los reparos que existían a la gestión anterior.', url: 'https://theclinic.cl/2026/05/19/martin-arrau-la-apuesta-de-kast-para-mejorar-la-gestion-en-seguridad-tras-las-criticas-al-desempeno-de-steinert' }
      ],
      vot: [
        { d: '2026-06-04', fecha: 'jun 2026', instancia: 'Ministerio de Seguridad', titulo: 'Siete ejes de gestión y agenda legislativa', detalle: 'Presentados ante la Comisión de Seguridad Ciudadana de la Cámara.', voto: 'Decisión', fuente: 'Cámara de Diputadas y Diputados', url: 'https://www.camara.cl/cms/2026/06/04/ministro-arrau-expone-ante-seguridad-ciudadana-ejes-legislativos-y-de-gestion/' },
        { d: '2026-05-29', fecha: 'may 2026', instancia: 'Ministerio de Seguridad', titulo: 'Priorización de 25 proyectos de ley', detalle: 'Identificó 25 iniciativas en trámite para priorizar, en reunión con diputados.', voto: 'Decisión', fuente: 'The Clinic', url: 'https://www.theclinic.cl/2026/05/29/con-25-proyectos-prioritarios-los-detalles-de-la-reunion-del-ministro-arrau-con-diputados-y-su-intento-por-dar-vuelta-la-pagina-steinert/' },
        { d: '2026-05-25', fecha: 'may 2026', instancia: 'Ministerio de Seguridad', titulo: 'Mantener la Política Nacional de Seguridad vigente', detalle: 'Anunció que trabajará sobre el marco aprobado en el gobierno anterior.', voto: 'Decisión', fuente: 'Emol', url: 'https://www.emol.com/noticias/Nacional/2026/05/25/1200917/ministro-arrau-seguridad-comite.html' }
      ],
      fue: [
        { titulo: 'Exposición ante la Comisión de Seguridad Ciudadana', fuente: 'Cámara de Diputadas y Diputados', estado: 'Revisado', url: 'https://www.camara.cl/cms/2026/06/04/ministro-arrau-expone-ante-seguridad-ciudadana-ejes-legislativos-y-de-gestion/' },
        { titulo: 'Transparencia activa', fuente: 'Portal de Transparencia', estado: 'Ver en portal', url: 'https://www.portaltransparencia.cl' },
        { titulo: 'Audiencias de lobby', fuente: 'InfoLobby', estado: 'Ver en portal', url: 'https://www.infolobby.cl' },
        { titulo: 'Declaración de intereses y patrimonio', fuente: 'InfoProbidad', estado: 'Ver en portal', url: 'https://www.infoprobidad.cl' }
      ],
      conf: [
        { tema: 'Cargo en Ñuble', aFuente: 'T13', aDice: 'Intendente de la Región de Ñuble', bFuente: 'El Dínamo', bDice: 'Delegado presidencial para la instalación de Ñuble (2017)', aclaraFuente: 'Pendiente', aclara: 'Podrían ser cargos sucesivos. Falta una fuente oficial que lo confirme.', estado: 'Sin resolver' }
      ] },

    { id: 'poduje', nombre: 'Iván Poduje Capdeville', ini: 'IP', tipo: 'Ministros', cargoCorto: 'Ministro de Vivienda y Urbanismo',
      cargo: 'Ministro de Vivienda y Urbanismo', institucion: 'Ministerio de Vivienda y Urbanismo', partido: 'Información pendiente de verificación', partidoF: 'Sin verificar',
      region: 'Nacional', periodo: 'Desde el 11 de marzo de 2026', resumen: 'Arquitecto y urbanista.',
      resena: 'Arquitecto y urbanista, asesor de distintos gobiernos en desarrollo urbano. Encabeza la cartera en un período marcado por el déficit habitacional y la reconstrucción tras los incendios en la Región de Valparaíso.',
      temas: ['Vivienda', 'Reconstrucción', 'Presupuesto'], trayectoria: [{ cargo: 'Ministro de Vivienda y Urbanismo', periodo: 'Desde mar 2026', actual: true }], oficialFuente: 'Minvu', oficialUrl: 'https://www.minvu.gob.cl/noticia/ministro-poduje-encabeza-cuenta-publica-2026-anunciando-un-ministerio-en-terreno-como-enfoque-de-su-gestion/',
      news: [
        { d: '2026-09-29', fecha: '29 sep 2026', medio: 'Minvu', tm: 'Oficial', tema: 'Reconstrucción', orig: false, titulo: 'Poduje entrega viviendas en El Olivar y anuncia una entrega masiva en Viña del Mar', resumen: 'Entregó ocho viviendas y comprometió 220 llaves en octubre y otras 150 en noviembre.', url: 'https://www.minvu.gob.cl/noticia/ministro-ivan-poduje-entrega-viviendas-en-el-olivar-y-anuncia-entrega-masiva-de-casas-en-el-sector-vinamarino/' },
        { d: '2026-08-16', fecha: '16 ago 2026', medio: '24horas', tm: 'Nacional', tema: 'Presupuesto', orig: true, titulo: 'Ministro Poduje pide aumentar en 23,9% el presupuesto de Vivienda', resumen: 'Tras el pronunciamiento del Tribunal Constitucional, planteó priorizar reactivación y obras urbanas.', url: 'https://www.24horas.cl/actualidad/politica/ministro-poduje-pide-aumentar-en-23-9-el-presupuesto-de-vivienda' },
        { d: '2026-08-07', fecha: '7 ago 2026', medio: 'Minvu', tm: 'Oficial', tema: 'Vivienda', orig: false, titulo: 'Poduje presenta la Cuenta Pública 2026 del Minvu', resumen: 'Anunció un “ministerio en terreno” y la apertura del llamado 2026 del programa DS 27.', url: 'https://www.minvu.gob.cl/noticia/ministro-poduje-encabeza-cuenta-publica-2026-anunciando-un-ministerio-en-terreno-como-enfoque-de-su-gestion/' },
        { d: '2026-07-10', fecha: '10 jul 2026', medio: 'Cámara de Diputadas y Diputados', tm: 'Oficial', tema: 'Vivienda', orig: true, titulo: 'Vivienda: Presentan ejes de nueva política habitacional', resumen: 'Meta de 400 mil viviendas nuevas y 400 mil mejoradas, con la clase media como público prioritario.', url: 'https://www.camara.cl/cms/?p=97710' },
        { d: '2026-05-06', fecha: '6 may 2026', medio: 'The Clinic', tm: 'Digital', tema: 'Reconstrucción', orig: false, titulo: 'Senador Fidel Espinoza (PS) cuestiona el tono de Poduje y sus metas de reconstrucción', resumen: 'El presidente de la Comisión de Vivienda del Senado pidió más diálogo y dudó de que se cumplan los plazos.', url: 'https://www.theclinic.cl/2026/05/06/fidel-espinoza-ps-cuestiona-tono-de-poduje-y-expectativas-de-reconstruccion-anda-prometiendo-cosas-por-el-pais-que-no-va-a-poder-cumplir/', tambien: ['espinoza'] }
      ],
      vot: [
        { d: '2026-07-10', fecha: 'jul 2026', instancia: 'Minvu', titulo: 'Plan Integral de Vivienda y Urbanismo 2026–2030', detalle: 'Meta de 400 mil viviendas nuevas y 400 mil mejoramientos.', voto: 'Decisión', fuente: 'Cámara de Diputadas y Diputados', url: 'https://www.camara.cl/cms/?p=97710' },
        { d: '2026-08-16', fecha: 'ago 2026', instancia: 'Minvu', titulo: 'Solicitud de aumento presupuestario', detalle: 'Pidió un alza de 23,9% para Vivienda en el Presupuesto 2027.', voto: 'Decisión', fuente: '24horas', url: 'https://www.24horas.cl/actualidad/politica/ministro-poduje-pide-aumentar-en-23-9-el-presupuesto-de-vivienda' },
        { d: '2026-09-29', fecha: 'sep 2026', instancia: 'Minvu', titulo: 'Aceleración de la reconstrucción en Viña del Mar', detalle: 'Instruyó aumentar el ritmo para entregar 350 casas entre octubre y noviembre.', voto: 'Decisión', fuente: 'Minvu', url: 'https://www.minvu.gob.cl/noticia/ministro-ivan-poduje-entrega-viviendas-en-el-olivar-y-anuncia-entrega-masiva-de-casas-en-el-sector-vinamarino/' }
      ],
      fue: [
        { titulo: 'Noticias y cuenta pública del ministerio', fuente: 'Minvu', estado: 'Revisado', url: 'https://www.minvu.gob.cl/noticia/ministro-poduje-encabeza-cuenta-publica-2026-anunciando-un-ministerio-en-terreno-como-enfoque-de-su-gestion/' },
        { titulo: 'Transparencia activa', fuente: 'Portal de Transparencia', estado: 'Ver en portal', url: 'https://www.portaltransparencia.cl' },
        { titulo: 'Audiencias de lobby', fuente: 'InfoLobby', estado: 'Ver en portal', url: 'https://www.infolobby.cl' },
        { titulo: 'Declaración de intereses y patrimonio', fuente: 'InfoProbidad', estado: 'Ver en portal', url: 'https://www.infoprobidad.cl' }
      ],
      conf: [] },

    { id: 'toledo', nombre: 'Matías Toledo Herrera', ini: 'MT', tipo: 'Alcaldes', cargoCorto: 'Alcalde de Puente Alto',
      cargo: 'Alcalde de Puente Alto', institucion: 'Municipalidad de Puente Alto', partido: 'Independiente', partidoF: 'Independiente',
      region: 'Región Metropolitana', periodo: '2024–2028', resumen: 'Dirigente social. Electo como independiente.',
      resena: 'Activista y dirigente social. En 2023 fundó el Movimiento Recuperemos Puente Alto. Electo alcalde en 2024 como independiente, sucediendo a Germán Codina.',
      temas: ['Seguridad', 'Comercio ambulante', 'Política'], trayectoria: [{ cargo: 'Alcalde de Puente Alto', periodo: '2024–2028', actual: true }], oficialFuente: 'Municipalidad de Puente Alto', oficialUrl: 'https://www.mpuentealto.cl/matias-toledo-asume-como-alcalde-de-puente-alto-sigamos-construyendo-una-mejor-comuna/',
      news: [
        { d: '2026-05-13', fecha: '13 may 2026', medio: 'Radio U. de Chile', tm: 'Nacional', tema: 'Política', orig: true, titulo: 'Alcalde Matías Toledo descarta una futura militancia en el PDG tras reunión con Franco Parisi', resumen: 'Valoró el diálogo y llamó a dejar atrás divisiones entre alcaldes oficialistas y de oposición.', url: 'https://radio.uchile.cl/2026/05/13/alcalde-matias-toledo-descarta-una-futura-militancia-en-el-pdg-tras-reunion-con-franco-parisi/' },
        { d: '2026-03-16', fecha: '16 mar 2026', medio: 'T13', tm: 'Nacional', tema: 'Seguridad', orig: false, titulo: 'Se viraliza discusión del alcalde de Puente Alto con un hombre en situación de calle', resumen: 'El alcalde compartió un operativo para retirar rucos y evitar vertederos ilegales.', url: 'https://www.t13.cl/noticia/nacional/viral-discusion-alcalde-puentealto-matias-toledo-hombre-situacion-calle-16-3-2026' },
        { d: '2026-03-01', fecha: '1 mar 2026', medio: 'BioBío Chile', tm: 'Nacional', tema: 'Comercio ambulante', orig: true, titulo: 'Matías Toledo, alcalde de Puente Alto: “Tengo chaleco antibalas”', resumen: 'Entrevista sobre los operativos contra el comercio ambulante, las amenazas a alcaldes y el transporte.', url: 'https://www.biobiochile.cl/noticias/nacional/chile/2026/03/01/matias-toledo-alcalde-de-puente-alto-tengo-chaleco-antibalas.shtml' }
      ],
      vot: [
        { d: '2026-03-16', fecha: 'mar 2026', instancia: 'Gestión municipal', titulo: 'Operativos de seguridad en espacios públicos', detalle: 'Retiro de rucos y prevención de vertederos ilegales.', voto: 'Decisión', fuente: 'T13', url: 'https://www.t13.cl/noticia/nacional/viral-discusion-alcalde-puentealto-matias-toledo-hombre-situacion-calle-16-3-2026' },
        { d: '2024-12-06', fecha: 'dic 2024', instancia: 'Gestión municipal', titulo: 'Auditoría al municipio', detalle: 'Anunciada al asumir el cargo.', voto: 'Decisión', fuente: 'Municipalidad de Puente Alto', url: 'https://www.mpuentealto.cl/matias-toledo-asume-como-alcalde-de-puente-alto-sigamos-construyendo-una-mejor-comuna/' }
      ],
      fue: [
        { titulo: 'Asunción del alcalde', fuente: 'mpuentealto.cl', estado: 'Revisado', url: 'https://www.mpuentealto.cl/matias-toledo-asume-como-alcalde-de-puente-alto-sigamos-construyendo-una-mejor-comuna/' },
        { titulo: 'Resultados electorales', fuente: 'Servel', estado: 'Ver en portal', url: 'https://www.servel.cl' },
        { titulo: 'Audiencias de lobby', fuente: 'InfoLobby', estado: 'Ver en portal', url: 'https://www.infolobby.cl' },
        { titulo: 'Declaración de intereses y patrimonio', fuente: 'InfoProbidad', estado: 'Ver en portal', url: 'https://www.infoprobidad.cl' }
      ],
      conf: [
        { tema: 'Votación en la elección de 2024', aFuente: 'Chilevisión, noche de la elección', aDice: '50,76%', bFuente: 'Wikipedia', bDice: '51,53% (172.015 votos)', aclaraFuente: 'Pendiente', aclara: 'Chilevisión informó con el 5% de mesas escrutadas. Falta confirmar el resultado final en el Servel.', estado: 'Sin resolver' }
      ] },

    { id: 'bassaletti', nombre: 'Enrique Bassaletti Riess', ini: 'EB', tipo: 'Diputados', cargoCorto: 'Diputado por el Distrito 8',
      cargo: 'Diputado por el Distrito 8', institucion: 'Cámara de Diputadas y Diputados', partido: 'Independiente (bancada republicana)', partidoF: 'Independiente',
      region: 'Región Metropolitana', periodo: '2026–2030', resumen: 'General (r) de Carabineros.',
      resena: 'General (r) de Carabineros. Estudió en el Instituto Nacional e ingresó a la Escuela de Carabineros en 1987. Fue candidato a alcalde de Maipú en 2024. Integra las comisiones de Seguridad Ciudadana y de Derechos Humanos.',
      temas: ['Seguridad', 'Justicia', 'Probidad'], camaraId: '1190', trayectoria: [{ cargo: 'Diputado por el 8° Distrito', periodo: '2026–2030', actual: true }], oficialFuente: 'Cámara de Diputadas y Diputados', oficialUrl: 'https://www.camara.cl/diputados/detalle/biografia.aspx?prmid=1190',
      news: [
        { d: '2026-09-30', fecha: '30 sep 2026', medio: 'Infinita', tm: 'Nacional', tema: 'Seguridad', orig: false, titulo: 'Bassaletti cree que no prosperará un nuevo estado de excepción constitucional', resumen: 'Abordó seguridad pública, incentivos a Carabineros y la agenda legislativa.', url: 'https://www.infinita.cl/podcasts/entrevista-infinita/2026/09/30/diputado-bassaletti-creo-que-no-va-a-prosperar-un-nuevo-estado-de-excepcion-constitucional.html' },
        { d: '2026-08-27', fecha: 'ago 2026', medio: 'Contrapoder Chile', tm: 'Digital', tema: 'Probidad', orig: false, titulo: 'Medio reporta que ha recibido más de $33 millones en pensiones desde que asumió', resumen: 'Suma sus pensiones de retiro de Carabineros entre marzo y agosto de 2026, además de la dieta parlamentaria.', url: 'https://contrapoderchile.cl/en-solo-6-meses-enrique-bassaletti-ha-recibido-mas-de-33-millones-en-pension-desde-que-asumio-como-diputado-republicano/' },
        { d: '2026-08-25', fecha: '25 ago 2026', medio: 'La Tercera', tm: 'Nacional', tema: 'Seguridad', orig: false, titulo: 'Bassaletti defiende el equilibrio entre seguridad y libertades', resumen: 'Respondió a los cuestionamientos al estado de excepción propuesto en la reforma del Gobierno.', url: 'https://www.latercera.com/politica/noticia/enrique-bassaletti-nuestro-sector-apoya-absolutamente-el-concepto-de-libertad-pero-la-libertad-tambien-tiene-excepciones/' },
        { d: '2026-08-07', fecha: '7 ago 2026', medio: 'The Clinic', tm: 'Digital', tema: 'Seguridad', orig: false, titulo: 'La abstención de Bassaletti que postergó votar la derogación de la Ley Naín-Retamal', resumen: 'Su abstención en la Comisión de Seguridad impidió el acuerdo para votar el proyecto del PC.', url: 'https://www.theclinic.cl/2026/08/07/enrique-bassaletti-el-inesperado-aliado-de-la-oposicion-para-postergar-la-votacion-del-proyecto-pc-para-derogar-la-ley-nain-retamal/' },
        { d: '2026-07-04', fecha: '4 jul 2026', medio: 'BioBío Chile', tm: 'Nacional', tema: 'Justicia', orig: true, titulo: 'Bassaletti, diputado y general (r) de Carabineros por ley de indulto: Lo haría caso a caso', resumen: 'Dijo que apoyará la ley de indulto general, pero que prefiere una revisión caso a caso.', url: 'https://www.biobiochile.cl/noticias/nacional/chile/2026/07/04/bassaletti-diputado-y-general-r-de-carabineros-por-ley-de-indulto-lo-haria-caso-a-caso.shtml' }
      ],
      vot: [
        { d: '2026-08-05', fecha: '5 ago 2026', instancia: 'Sala de la Cámara · Sesión 52ª', titulo: 'Creación de comisión investigadora', detalle: 'Votación registrada en la ficha del diputado.', voto: 'A favor', fuente: 'Cámara de Diputadas y Diputados', url: 'https://camara.cl/diputados/detalle/votaciones_sala.aspx?prmId=1190' },
        { d: '2026-08-05', fecha: '5 ago 2026', instancia: 'Sala de la Cámara · Sesión 52ª', titulo: 'Resolución N° 36', detalle: 'Votación registrada en la ficha del diputado.', voto: 'Abstención', fuente: 'Cámara de Diputadas y Diputados', url: 'https://camara.cl/diputados/detalle/votaciones_sala.aspx?prmId=1190' },
        { d: '2026-08-06', fecha: 'ago 2026', instancia: 'Comisión de Seguridad Ciudadana', titulo: 'Poner en votación el proyecto que deroga la Ley Naín-Retamal', detalle: 'Su abstención dejó sin acuerdo la propuesta y la votación quedó postergada.', voto: 'Abstención', fuente: 'The Clinic', url: 'https://www.theclinic.cl/2026/08/07/enrique-bassaletti-el-inesperado-aliado-de-la-oposicion-para-postergar-la-votacion-del-proyecto-pc-para-derogar-la-ley-nain-retamal/' }
      ],
      fue: [
        { titulo: 'Ficha y reseña parlamentaria', fuente: 'Cámara de Diputadas y Diputados', estado: 'Revisado', url: 'https://www.camara.cl/diputados/detalle/biografia.aspx?prmid=1190' },
        { titulo: 'Votaciones en Sala', fuente: 'Cámara de Diputadas y Diputados', estado: 'Revisado', url: 'https://camara.cl/diputados/detalle/votaciones_sala.aspx?prmId=1190' },
        { titulo: 'Reseña biográfica', fuente: 'Biblioteca del Congreso Nacional', estado: 'Revisado', url: 'https://www.bcn.cl/historiapolitica/resenas_parlamentarias/wiki/Enrique_Alejandro_Bassaletti_Riess' },
        { titulo: 'Calificación de la elección de diputados 2025', fuente: 'Tribunal Calificador de Elecciones', estado: 'Revisado', url: 'https://tribunalcalificador.cl/wp-content/uploads/2026/02/2212-2025-calificacion-diputados.pdf' },
        { titulo: 'Audiencias de lobby', fuente: 'InfoLobby', estado: 'Ver en portal', url: 'https://www.infolobby.cl' }
      ],
      conf: [
        { tema: 'Militancia', aFuente: 'BioBío Chile y The Clinic', aDice: 'Diputado republicano', bFuente: 'Cámara y BCN', bDice: 'Independiente', aclaraFuente: 'Cámara de Diputadas y Diputados', aclara: 'Fue electo como independiente en un cupo republicano y forma parte del Comité Partido Republicano. No es militante.', estado: 'Aclarado' }
      ] },

    { id: 'pvodanovic', nombre: 'Paulina Vodanovic Rojas', ini: 'PV', tipo: 'Senadores', cargoCorto: 'Senadora por el Maule',
      cargo: 'Senadora por la 9ª Circunscripción (Maule)', institucion: 'Senado de Chile', partido: 'Partido Socialista', partidoF: 'Partido Socialista',
      region: 'Maule', periodo: '2026–2034 (senadora desde 2023)', resumen: 'Presidenta del PS desde 2022.',
      resena: 'Abogada de la Universidad de Chile. Presidenta del Partido Socialista desde 2022. Asumió como senadora en abril de 2023 para completar el período de Álvaro Elizalde y fue reelecta para 2026–2034.',
      temas: ['Hacienda', 'Seguridad', 'Género'], senadoKey: 'S:Vodanovic R., Paulina', trayectoria: [{ cargo: 'Senadora por la 9ª Circunscripción', periodo: '2026–2034', actual: true }, { cargo: 'Senadora por la 9ª Circunscripción (completó el período de Álvaro Elizalde)', periodo: '2023–2026' }], trayFuente: 'Reseña biográfica de la BCN', oficialFuente: 'Senado', oficialUrl: 'https://www.senado.cl/senadoras-y-senadores/listado-de-senadoras-y-senadores/paulina-vodanovic-rojas-sen',
      news: [
        { d: '2026-10-07', fecha: '7 oct 2026', medio: 'El Dínamo', tm: 'Digital', tema: 'Seguridad', ev: 'ruf', orig: false, titulo: 'Reglas de Uso de la Fuerza son despachadas a ley, con reserva de constitucionalidad del PS', resumen: 'Detalla cómo se reunieron los 29 votos y la reserva que anunció el Partido Socialista.', url: 'https://www.eldinamo.cl/politica/2026/10/07/con-reserva-de-constitucionalidad-reglas-de-uso-de-la-fuerza-son-despachadas-a-ley-por-el-senado/', proyecto: '15805-07' },
        { d: '2026-09-30', fecha: '30 sep 2026', medio: 'Emol', tm: 'Nacional', tema: 'Seguridad', orig: false, titulo: 'Vodanovic arremete contra Squella, Longton y Araya por la reforma de seguridad', resumen: 'En la Comisión de Constitución dijo que no participó en una propuesta presentada como consensuada.', url: 'https://www.emol.com/noticias/Nacional/2026/09/30/1212841/vodanovic-contra-senadores-por-seguridad.html' },
        { d: '2026-09-23', fecha: '23 sep 2026', medio: 'Partido Socialista', tm: 'Partido político', tema: 'Género', orig: true, titulo: 'Paulina Vodanovic: “No podemos esperar que cada veinte años aparezca una mujer extraordinaria”', resumen: 'Entrevista sobre representación femenina: 16 de los 50 integrantes del Senado son mujeres.', url: 'https://www.pschile.cl/paulina-vodanovic-no-podemos-esperar-que-cada-veinte-anos-aparezca-una-mujer-extraordinaria/' },
        { d: '2026-06-17', fecha: '17 jun 2026', medio: 'Diario Financiero', tm: 'Nacional', tema: 'Hacienda', ev: 'reforma', orig: false, titulo: 'Proyecto de reactivación supera su primera valla en el Senado', resumen: 'La Comisión de Hacienda aprobó la idea de legislar por 3 votos a 2.', url: 'https://www.df.cl/economia-y-politica/politica/proyecto-de-reactivacion-supera-su-primera-valla-en-el-senado-comision-de', proyecto: '18216-05' },
        { d: '2026-06-16', fecha: 'jun 2026', medio: 'Senado', tm: 'Oficial', tema: 'Hacienda', ev: 'reforma', orig: true, titulo: 'Proyecto de reconstrucción nacional avanza a la Sala del Senado', resumen: 'Registro oficial de la votación en la Comisión de Hacienda y los fundamentos de cada voto.', url: 'https://www.senado.cl/comunicaciones/noticias/proyecto-de-reconstruccion-nacional-avanza-la-sala-del-senado', proyecto: '18216-05' }
      ],
      vot: [
        { d: '2026-07-16', fecha: 'jul 2026', instancia: 'Sala del Senado', titulo: 'Megarreforma: rebaja del impuesto de primera categoría', detalle: 'Votación en particular de la rebaja gradual del 27% al 23% para grandes empresas.', voto: 'En contra', fuente: 'Emol', url: 'https://www.emol.com/noticias/Nacional/2026/07/16/1205820/votacion-senado-megarreforma-detalle-listado.html', proyecto: '18216-05' },
        { d: '2026-06-16', fecha: 'jun 2026', instancia: 'Comisión de Hacienda del Senado', titulo: 'Idea de legislar del proyecto de Reconstrucción Nacional', detalle: 'La comisión aprobó por 3 votos a 2.', voto: 'En contra', fuente: 'Senado', url: 'https://www.senado.cl/comunicaciones/noticias/proyecto-de-reconstruccion-nacional-avanza-la-sala-del-senado', proyecto: '18216-05' }
      ],
      fue: [
        { titulo: 'Ficha de senadora', fuente: 'Senado de Chile', estado: 'Revisado', url: 'https://www.senado.cl/senadoras-y-senadores/listado-de-senadoras-y-senadores/paulina-vodanovic-rojas-sen' },
        { titulo: 'Reseña biográfica', fuente: 'Biblioteca del Congreso Nacional', estado: 'Revisado', url: 'https://www.bcn.cl/historiapolitica/resenas_parlamentarias/wiki/Paulina_Vodanovic_Rojas' },
        { titulo: 'Tramitación, asistencia y votaciones', fuente: 'Senado (tramitación)', estado: 'Ver en portal', url: 'https://tramitacion.senado.cl/appsenado/index.php?mo=senadores&ac=fichasenador&id=1450' },
        { titulo: 'Audiencias de lobby', fuente: 'InfoLobby', estado: 'Ver en portal', url: 'https://www.infolobby.cl' }
      ],
      conf: [] },

    { id: 'walker', nombre: 'Matías Walker Prieto', ini: 'MW', tipo: 'Senadores', cargoCorto: 'Senador por Coquimbo',
      cargo: 'Senador por la 5ª Circunscripción (Coquimbo)', institucion: 'Senado de Chile', partido: 'Demócratas (según BCN y Senado)', partidoF: 'Demócratas',
      region: 'Coquimbo', periodo: '2022–2030', resumen: 'Ex DC, fundador de Demócratas.',
      resena: 'Abogado. Diputado entre 2010 y 2022 y senador desde 2022. Militó en la DC desde 1993, la presidió de forma interina en 2017 y renunció en 2022 para fundar el partido Demócratas. Fue vicepresidente del Senado entre 2024 y 2025.',
      temas: ['Seguridad', 'Política', 'Hacienda'], senadoKey: 'S:Walker P., Matías', trayectoria: [{ cargo: 'Senador por la 5ª Circunscripción', periodo: '2022–2030', actual: true }, { cargo: 'Vicepresidente del Senado', periodo: '2024–2025' }, { cargo: 'Diputado', periodo: '2010–2022' }], trayFuente: 'Reseña biográfica de la BCN', oficialFuente: 'Senado', oficialUrl: 'https://www.senado.cl/senadoras-y-senadores/listado-de-senadoras-y-senadores/matias-walker-prieto-sen',
      news: [
        { d: '2026-10-07', fecha: '7 oct 2026', medio: 'Mi Radio LS', tm: 'Local', tema: 'Seguridad', ev: 'ruf', orig: false, titulo: 'Así votaron los senadores de Coquimbo las Reglas del Uso de la Fuerza', resumen: 'Walker y Gahona votaron a favor; Daniel Núñez en contra.', url: 'https://www.miradiols.cl/2026/10/07/uno-en-contra-y-dos-a-favor-asi-votaron-los-senadores-regionales-las-reglas-del-uso-de-la-fuerza-ruf/', proyecto: '15805-07' },
        { d: '2026-09-06', fecha: '6 sep 2026', medio: 'La Tercera', tm: 'Nacional', tema: 'Política', orig: false, titulo: 'Walker reconoce que Demócratas y Amarillos no lograron representar al centro', resumen: 'A cuatro años del plebiscito, descarta que el 62% del Rechazo pueda transformarse en una alianza.', url: 'https://www.latercera.com/politica/noticia/matias-walker-hoy-es-imposible-formar-un-conglomerado-politico-con-el-62-del-rechazo/' },
        { d: '2026-08-25', fecha: '25 ago 2026', medio: 'Emol', tm: 'Nacional', tema: 'Seguridad', orig: false, titulo: 'Walker pide a Arrau acelerar 30 proyectos de seguridad', resumen: 'Propuso priorizarlos por sobre la reforma constitucional del Gobierno.', url: 'https://www.emol.com/noticias/Nacional/2026/08/25/1209506/walker-proyectos-seguridad.html' },
        { d: '2026-08-15', fecha: '15 ago 2026', medio: 'Emol', tm: 'Nacional', tema: 'Seguridad', orig: false, titulo: 'Walker y parlamentarios republicanos se enfrentan en X por la reforma de seguridad', resumen: 'La discusión giró en torno a la restricción de prestaciones de salud a condenados.', url: 'https://www.emol.com/noticias/Nacional/2026/08/15/1208599/cruce-walker-parlamentarios-republicanos-reforma.html' }
      ],
      vot: [
        { d: '2026-08-24', fecha: 'ago 2026', instancia: 'Gestión parlamentaria', titulo: 'Entrega de 30 proyectos de seguridad al ministro Arrau', detalle: 'Incluye régimen de penas para crimen organizado y reforma a la responsabilidad penal adolescente.', voto: 'Decisión', fuente: 'Emol', url: 'https://www.emol.com/noticias/Nacional/2026/08/25/1209506/walker-proyectos-seguridad.html' }
      ],
      fue: [
        { titulo: 'Ficha de senador', fuente: 'Senado de Chile', estado: 'Revisado', url: 'https://www.senado.cl/senadoras-y-senadores/listado-de-senadoras-y-senadores/matias-walker-prieto-sen' },
        { titulo: 'Reseña biográfica', fuente: 'Biblioteca del Congreso Nacional', estado: 'Revisado', url: 'https://www.bcn.cl/historiapolitica/resenas_parlamentarias/wiki/Mat%C3%ADas_Walker_Prieto' },
        { titulo: 'Tramitación, asistencia y votaciones', fuente: 'Senado (tramitación)', estado: 'Ver en portal', url: 'https://tramitacion.senado.cl/appsenado/index.php?mo=senadores&ac=fichasenador&id=1344' },
        { titulo: 'Audiencias de lobby', fuente: 'InfoLobby', estado: 'Ver en portal', url: 'https://www.infolobby.cl' }
      ],
      conf: [
        { tema: 'Militancia', aFuente: 'BCN, Senado y Emol (ago 2026)', aDice: 'Demócratas', bFuente: 'Wikipedia en español (oct 2026)', bDice: 'Independiente desde 2026', aclaraFuente: 'Pendiente', aclara: 'No encontramos una fuente oficial sobre una renuncia. Habría que revisar el registro de militantes del Servel.', estado: 'Sin resolver' }
      ] },

    /* ===== Autoridades incorporadas el 15 de octubre de 2026 ===== */
    { id: 'fries', nombre: 'Lorena Fries Monleón', ini: 'LF', tipo: 'Diputados', cargoCorto: 'Diputada por el Distrito 10',
      cargo: 'Diputada por el 10° Distrito (Región Metropolitana)', institucion: 'Cámara de Diputadas y Diputados', partido: 'Frente Amplio', partidoF: 'Frente Amplio',
      region: 'Región Metropolitana', periodo: '2026–2030 (diputada desde 2022)', resumen: 'Abogada. Primera directora del INDH.', camaraId: '1127', verificado: '2026-10-15',
      resena: 'Abogada especialista en derechos humanos. Fue la primera directora del Instituto Nacional de Derechos Humanos (2010–2016) y la primera subsecretaria de Derechos Humanos (2016–2018). Diputada por el 10° Distrito desde 2022 y reelecta para 2026–2030. Milita en el Frente Amplio desde julio de 2024; antes integró Convergencia Social.',
      temas: ['Derechos humanos', 'Seguridad', 'Migración'], oficialFuente: 'BCN', oficialUrl: 'https://www.bcn.cl/historiapolitica/resenas_parlamentarias/wiki/Lorena_Fries_Monle%C3%B3n',
      trayectoria: [
        { cargo: 'Diputada por el 10° Distrito', periodo: '2026–2030', actual: true },
        { cargo: 'Diputada por el 10° Distrito', periodo: '2022–2026' },
        { cargo: 'Subsecretaria de Derechos Humanos', periodo: '2016–2018' },
        { cargo: 'Directora del Instituto Nacional de Derechos Humanos', periodo: '2010–2016' }
      ], trayFuente: 'Reseña biográfica de la BCN',
      news: [
        { d: '2026-10-14', fecha: '14 oct 2026', medio: 'BioBío Chile', tm: 'Nacional', tema: 'Emergencias', orig: true, titulo: 'Diputada Lorena Fries (FA) oficia al Ejecutivo por consecuencias de sistemas frontales en la capital', resumen: 'Ofició al Ejecutivo y a organismos del Estado por las consecuencias de los sistemas frontales en la Región Metropolitana.', url: 'https://www.biobiochile.cl/noticias/nacional/region-metropolitana/2026/10/14/diputada-lorena-fries-fa-oficia-al-ejecutivo-por-consecuencias-de-sistemas-frontales-en-la-capital.shtml' },
        { d: '2026-08-13', fecha: '13 ago 2026', medio: 'El Mostrador', tm: 'Digital', tema: 'Seguridad', orig: true, titulo: 'Diputada Fries fija línea roja: acusa al Gobierno de usar reformas para esquivar al TC', resumen: 'Dijo que la oposición respaldará parte de la agenda contra el crimen organizado, pero que usar reformas constitucionales para evitar el control del Tribunal Constitucional es una «línea roja».', url: 'https://www.elmostrador.cl/noticias/pais/2026/08/13/diputada-fries-fija-linea-roja-acusa-al-gobierno-de-usar-reformas-para-esquivar-al-tc/' },
        { d: '2026-07-22', fecha: '22 jul 2026', medio: 'La Tercera', tm: 'Nacional', tema: 'Migración', orig: false, titulo: 'Fries presidirá la comisión investigadora sobre controles migratorios a menores', resumen: 'La comisión surgió de un informe de Contraloría sobre Migraciones, PDI y la Subsecretaría de la Niñez por niños haitianos que ingresaron en vuelos chárter.', url: 'https://www.latercera.com/politica/noticia/diputada-lorena-fries-presidira-la-comision-investigadora-sobre-controles-a-menores-migrantes-por-reunificacion-familiar/' },
        { d: '2026-07-02', fecha: '2 jul 2026', medio: 'Cooperativa', tm: 'Nacional', tema: 'Justicia', orig: true, titulo: 'Diputada Fries advierte que juzgar a menores como adultos vulnera tratados internacionales', resumen: 'Cuestionó las indicaciones del Gobierno a la Ley de Responsabilidad Penal Adolescente, anunciadas por el ministro Arrau.', url: 'https://www.cooperativa.cl/noticias/pais/politica/agenda-legislativa/diputada-fries-advierte-que-juzgar-a-menores-como-adultos-vulnera/2026-07-02/140945.html', tambien: ['arrau'] },
        { d: '2026-05-03', fecha: '3 may 2026', medio: 'BioBío Chile', tm: 'Nacional', tema: 'Hacienda', proyecto: '18216-05', orig: true, titulo: 'Lorena Fries: «Si se trata de reconstrucción, que separe el proyecto y se lo aprobamos en una semana»', resumen: 'Cuestionó que el proyecto dedique un espacio mínimo a la reconstrucción y planteó que, si se divide, el Frente Amplio podría votar a favor.', url: 'https://www.biobiochile.cl/noticias/nacional/chile/2026/05/03/lorena-fries-si-se-trata-de-reconstruccion-que-separe-el-proyecto-y-se-lo-aprobamos-en-una-semana.shtml' }
      ],
      vot: [],
      fue: [
        { titulo: 'Reseña biográfica parlamentaria', fuente: 'Biblioteca del Congreso Nacional', estado: 'Revisado', url: 'https://www.bcn.cl/historiapolitica/resenas_parlamentarias/wiki/Lorena_Fries_Monle%C3%B3n' },
        { titulo: 'Votaciones y militancia (datos abiertos)', fuente: 'Cámara de Diputadas y Diputados', estado: 'Revisado', url: 'https://opendata.camara.cl/camaradiputados/WServices/WSDiputado.asmx/retornarDiputado?prmDiputadoId=1127' },
        { titulo: 'Ficha de la diputada', fuente: 'Cámara de Diputadas y Diputados', estado: 'Ver en portal', url: 'https://www.camara.cl/diputados/detalle/biografia.aspx?prmid=1127' },
        { titulo: 'Audiencias de lobby', fuente: 'InfoLobby', estado: 'Ver en portal', url: 'https://www.infolobby.cl' }
      ],
      conf: [] },

    { id: 'jiles', nombre: 'Pamela Jiles Moreno', ini: 'PJ', tipo: 'Diputados', cargoCorto: 'Diputada por el Distrito 12',
      cargo: 'Diputada por el 12° Distrito (Región Metropolitana)', institucion: 'Cámara de Diputadas y Diputados', partido: 'Partido de la Gente', partidoF: 'Partido de la Gente',
      region: 'Región Metropolitana', periodo: '2026–2030 (diputada desde 2018)', resumen: 'Periodista. Tercer período como diputada.', camaraId: '1039', verificado: '2026-10-15',
      resena: 'Periodista y escritora. Trabajó en revistas como Análisis y Apsi y durante más de diez años en Informe Especial de TVN. Diputada por el 12° Distrito desde 2018, por tres períodos consecutivos. Militó en el Partido Comunista hasta 2006 y en el Partido Humanista; en agosto de 2025 se incorporó al Partido de la Gente.',
      temas: ['Hacienda', 'Política', 'Género'], oficialFuente: 'BCN', oficialUrl: 'https://www.bcn.cl/historiapolitica/resenas_parlamentarias/wiki/Pamela_Jiles_Moreno',
      trayectoria: [
        { cargo: 'Diputada por el 12° Distrito (Partido de la Gente)', periodo: '2026–2030', actual: true },
        { cargo: 'Diputada por el 12° Distrito', periodo: '2022–2026' },
        { cargo: 'Diputada por el 12° Distrito (Partido Humanista)', periodo: '2018–2022' }
      ], trayFuente: 'Reseña biográfica de la BCN',
      news: [
        { d: '2026-10-08', fecha: '8 oct 2026', medio: 'T13', tm: 'Nacional', tema: 'Política', orig: false, titulo: 'Jiles defiende a Bachelet ante dichos de Olivares y Kaiser', resumen: 'Cuestionó los dichos de Johannes Kaiser (PNL) y Javier Olivares (PDG) contra la expresidenta, aunque dijo tener «enormes diferencias» con ella.', url: 'https://www.t13.cl/noticia/politica/diputada-jiles-defiende-bachelet-dichos-olivares-kaiser-acuso-epidemia-maltrato-8-10-2026' },
        { d: '2026-07-21', fecha: '21 jul 2026', medio: 'El Dínamo', tm: 'Digital', tema: 'Hacienda', proyecto: '18216-05', orig: false, titulo: 'Jiles ratifica que el PDG llevará la megarreforma a comisión mixta', resumen: 'En el tercer trámite, respaldó la estrategia de su bancada de rechazar puntos del proyecto para llevarlos a comisión mixta.', url: 'https://www.eldinamo.cl/politica/2026/07/21/jiles-quiroz-podra-demostrarle-al-pais-que-tiene-corazon/' },
        { d: '2026-04-26', fecha: '26 abr 2026', medio: 'Emol', tm: 'Nacional', tema: 'Hacienda', proyecto: '18216-05', orig: false, titulo: 'Jiles condiciona el apoyo del PDG al proyecto de Reconstrucción', resumen: 'El PDG pidió que el proyecto incluya la rebaja del IVA en medicamentos y pañales.', url: 'https://www.emol.com/noticias/Nacional/2026/04/26/1198319/jiles-pdg-apoyo-proyecto-reconstruccion.html' },
        { d: '2026-03-11', fecha: '11 mar 2026', medio: 'T13', tm: 'Nacional', tema: 'Política', orig: true, titulo: 'Cámara de Diputados elige a Jorge Alessandri como presidente: se impuso a Pamela Jiles', resumen: 'Alessandri (UDI) obtuvo 78 votos y Jiles 75, pese al acuerdo previo que la daba como presidenta.', url: 'https://www.t13.cl/noticia/politica/camara-diputados-elige-jorge-alessandri-como-presidente-se-impone-ante-pamela-j-11-3-2026' },
        { d: '2026-03-10', fecha: '10 mar 2026', medio: 'El Mostrador', tm: 'Digital', tema: 'Política', orig: true, titulo: 'Futura oposición se queda con la Cámara: Jiles será presidenta y PDG se asegura dos períodos', resumen: 'Informó del acuerdo entre el oficialismo saliente, la DC y el PDG para que Jiles presidiera la Cámara en 2026.', url: 'https://www.elmostrador.cl/noticias/pais/2026/03/10/futura-oposicion-se-queda-con-la-camara-jiles-sera-presidenta-y-pdg-se-asegura-dos-periodos/' }
      ],
      vot: [],
      fue: [
        { titulo: 'Reseña biográfica parlamentaria', fuente: 'Biblioteca del Congreso Nacional', estado: 'Revisado', url: 'https://www.bcn.cl/historiapolitica/resenas_parlamentarias/wiki/Pamela_Jiles_Moreno' },
        { titulo: 'Votaciones y militancia (datos abiertos)', fuente: 'Cámara de Diputadas y Diputados', estado: 'Revisado', url: 'https://opendata.camara.cl/camaradiputados/WServices/WSDiputado.asmx/retornarDiputado?prmDiputadoId=1039' },
        { titulo: 'Ficha de la diputada', fuente: 'Cámara de Diputadas y Diputados', estado: 'Ver en portal', url: 'https://www.camara.cl/diputados/detalle/biografia.aspx?prmid=1039' },
        { titulo: 'Audiencias de lobby', fuente: 'InfoLobby', estado: 'Ver en portal', url: 'https://www.infolobby.cl' }
      ],
      conf: [
        { tema: 'Presidencia de la Cámara (marzo de 2026)', aFuente: 'El Mostrador, 10 mar 2026', aDice: 'Jiles sería presidenta de la Cámara en 2026', bFuente: 'T13, 11 mar 2026', bDice: 'La Cámara eligió a Jorge Alessandri (UDI) por 78 votos contra 75', aclaraFuente: 'T13, 11 mar 2026', aclara: 'La versión A describía un acuerdo previo a la votación. La elección del 11 de marzo la ganó Alessandri.', estado: 'Aclarado' },
        { tema: 'Militancia entre 2022 y 2026', aFuente: 'Datos abiertos de la Cámara', aDice: 'Partido Humanista durante todo el período 2022–2026', bFuente: 'Reseña de la BCN', bDice: 'Militó en el Partido Humanista hasta el 7 de febrero de 2022', aclaraFuente: 'Pendiente', aclara: 'Las dos fuentes oficiales no coinciden. Las votaciones de ese período muestran el partido que registra la Cámara.', estado: 'Sin resolver' }
      ] },

    { id: 'hassler', nombre: 'Irací Hassler Jacob', ini: 'IH', tipo: 'Diputados', cargoCorto: 'Diputada por el Distrito 10',
      cargo: 'Diputada por el 10° Distrito (Región Metropolitana)', institucion: 'Cámara de Diputadas y Diputados', partido: 'Partido Comunista', partidoF: 'Partido Comunista',
      region: 'Región Metropolitana', periodo: '2026–2030', resumen: 'Economista. Alcaldesa de Santiago 2021–2024.', camaraId: '1213', verificado: '2026-10-15',
      resena: 'Ingeniera comercial y economista, con magíster en Género y Cultura. Fue concejala de Santiago (2016–2021) y alcaldesa de la comuna (2021–2024). Diputada por el 10° Distrito para el período 2026–2030.',
      temas: ['Probidad', 'Hacienda', 'Género'], oficialFuente: 'BCN', oficialUrl: 'https://www.bcn.cl/historiapolitica/resenas_parlamentarias/wiki/Irac%C3%AD_Luiza_Hassler_Jacob',
      trayectoria: [
        { cargo: 'Diputada por el 10° Distrito', periodo: '2026–2030', actual: true },
        { cargo: 'Alcaldesa de Santiago', periodo: '2021–2024' },
        { cargo: 'Concejala de Santiago', periodo: '2016–2021' }
      ], trayFuente: 'Reseña biográfica de la BCN',
      news: [
        { d: '2026-10-06', fecha: '6 oct 2026', medio: 'El Dínamo', tm: 'Digital', tema: 'Probidad', orig: false, titulo: 'Hassler demanda al fisco y a Contraloría para anular el sumario por Sierra Bella', resumen: 'Sostiene que no hubo perjuicio para la Municipalidad de Santiago porque no se transfirieron recursos. La resolución de Contraloría no le aplicó sanciones.', url: 'https://www.eldinamo.cl/pais/2026/10/06/iraci-hassler-demanda-al-fisco-y-a-contraloria-para-anular-sumario-que-la-responsabiliza-por-fallida-compra-de-sierra-bella/' },
        { d: '2026-10-06', fecha: '6 oct 2026', medio: 'BioBío Chile', tm: 'Nacional', tema: 'Probidad', orig: true, titulo: 'Hassler presenta demanda para anular sumario de Contraloría que la responsabilizó por Sierra Bella', resumen: 'La exalcaldesa de Santiago interpuso la acción judicial representada por el abogado Leonardo Cofré.', url: 'https://www.biobiochile.cl/noticias/nacional/region-metropolitana/2026/10/06/hassler-presenta-demanda-para-anular-sumario-de-contraloria-que-la-responsabilizo-por-sierra-bella.shtml' },
        { d: '2026-09-29', fecha: '29 sep 2026', medio: 'Emol', tm: 'Nacional', tema: 'Política', orig: false, titulo: 'Diputadas llevan a Hassler a la Comisión de Ética por su trato a la ministra de la Mujer', resumen: 'Las diputadas Sara Concha y Francesca Muñoz (PSC) cuestionaron su actuación en una sesión de la Comisión de Mujeres y Equidad de Género.', url: 'https://www.emol.com/noticias/Nacional/2026/09/29/1212730/psc-hassler-comision-etica.html' },
        { d: '2026-07-10', fecha: '10 jul 2026', medio: 'El Mostrador', tm: 'Digital', tema: 'Hacienda', proyecto: '18216-05', orig: true, titulo: 'Diputada Hassler y críticas al PC por falta de colaboración: «Es Quiroz quien ha sido no dialogante»', resumen: 'Rechazó las críticas a su partido por su postura ante la megarreforma y sostuvo que el Gobierno no estuvo dispuesto a modificar aspectos centrales.', url: 'https://www.elmostrador.cl/noticias/pais/2026/07/10/diputada-hassler-y-criticas-al-pc-por-falta-de-colaboracion-es-quiroz-quien-ha-sido-no-dialogante/', tambien: ['quiroz'] },
        { d: '2026-06-08', fecha: '8 jun 2026', medio: 'T13', tm: 'Nacional', tema: 'Probidad', orig: true, titulo: 'Caso Sierra Bella: Diputada Hassler se querella por denuncia calumniosa contra alcalde Desbordes', resumen: 'Respondió a la querella por fraude que presentó la Municipalidad de Santiago. Su defensa sostiene que el caso fue sobreseído y que no hay hechos nuevos.', url: 'https://www.t13.cl/noticia/politica/diputada-hassler-se-querella-por-denuncia-calumniosa-contra-alcalde-desbordes-8-6-2026', tambien: ['desbordes'] }
      ],
      vot: [],
      fue: [
        { titulo: 'Reseña biográfica parlamentaria', fuente: 'Biblioteca del Congreso Nacional', estado: 'Revisado', url: 'https://www.bcn.cl/historiapolitica/resenas_parlamentarias/wiki/Irac%C3%AD_Luiza_Hassler_Jacob' },
        { titulo: 'Votaciones y militancia (datos abiertos)', fuente: 'Cámara de Diputadas y Diputados', estado: 'Revisado', url: 'https://opendata.camara.cl/camaradiputados/WServices/WSDiputado.asmx/retornarDiputado?prmDiputadoId=1213' },
        { titulo: 'Ficha de la diputada', fuente: 'Cámara de Diputadas y Diputados', estado: 'Ver en portal', url: 'https://www.camara.cl/diputados/detalle/biografia.aspx?prmid=1213' },
        { titulo: 'Declaración de intereses y patrimonio', fuente: 'InfoProbidad', estado: 'Ver en portal', url: 'https://www.infoprobidad.cl' }
      ],
      conf: [] },

    { id: 'schalper', nombre: 'Diego Schalper Sepúlveda', ini: 'DS', tipo: 'Diputados', cargoCorto: 'Diputado por el Distrito 11',
      cargo: 'Diputado por el 11° Distrito (Región Metropolitana) y jefe de la bancada de RN', institucion: 'Cámara de Diputadas y Diputados', partido: 'Renovación Nacional', partidoF: 'Renovación Nacional',
      region: 'Región Metropolitana', periodo: '2026–2030 (diputado desde 2018)', resumen: 'Abogado. Jefe de la bancada de RN.', camaraId: '1075', verificado: '2026-10-15',
      resena: 'Abogado y doctor en Derecho. Fue diputado por el 15° Distrito, en la Región de O’Higgins, entre 2018 y 2026, y fue electo por el 11° Distrito de la Región Metropolitana para 2026–2030. Encabeza la bancada de Renovación Nacional en la Cámara.',
      temas: ['Seguridad', 'Hacienda', 'Política'], oficialFuente: 'BCN', oficialUrl: 'https://www.bcn.cl/historiapolitica/resenas_parlamentarias/wiki/Diego_Ignacio_Schalper_Sep%C3%BAlveda',
      trayectoria: [
        { cargo: 'Diputado por el 11° Distrito', periodo: '2026–2030', actual: true },
        { cargo: 'Diputado por el 15° Distrito', periodo: '2022–2026' },
        { cargo: 'Diputado por el 15° Distrito', periodo: '2018–2022' }
      ], trayFuente: 'Reseña biográfica de la BCN',
      news: [
        { d: '2026-10-07', fecha: '7 oct 2026', medio: 'BioBío Chile', tm: 'Nacional', tema: 'Política', orig: true, titulo: 'Schalper (RN) ante eventual candidatura de Bachelet: «Yo no tengo ningún temor»', resumen: 'El jefe de bancada de RN se refirió a una eventual candidatura presidencial de Michelle Bachelet.', url: 'https://www.biobiochile.cl/noticias/nacional/chile/2026/10/07/schalper-rn-ante-eventual-candidatura-de-bachelet-yo-no-tengo-ningun-temor.shtml' },
        { d: '2026-09-29', fecha: '29 sep 2026', medio: 'T13', tm: 'Nacional', tema: 'Seguridad', orig: false, titulo: 'Schalper dice que el Gobierno retirará su reforma de seguridad', resumen: 'Afirmó que, según conversó con el ministro Arrau, el Ejecutivo retiraría la reforma que creaba un nuevo estado de excepción para presentarla con cambios.', url: 'https://www.t13.cl/noticia/politica/gobierno-cuenta-no-tiene-fuerza-diputado-schalper-dice-gobierno-retirara-reforma-seguridad-29-9-2026', tambien: ['arrau'] },
        { d: '2026-08-14', fecha: '14 ago 2026', medio: 'El Dínamo', tm: 'Digital', tema: 'Hacienda', proyecto: '18216-05', orig: false, titulo: 'Schalper valora el fallo del Tribunal Constitucional sobre la megarreforma', resumen: 'El TC mantuvo la mayor parte de la invariabilidad tributaria y declaró inconstitucional la restitución por RCA, según el medio.', url: 'https://www.eldinamo.cl/politica/2026/08/14/diego-schalper-rn-tras-fallo-del-tc-a-diferencia-de-marcel-el-ministro-quiroz-saco-adelante-su-reforma-tributaria-en-todos-sus-aspectos-centrales/' },
        { d: '2026-06-21', fecha: '21 jun 2026', medio: 'Emol', tm: 'Nacional', tema: 'Política', orig: false, titulo: 'Schalper anuncia que rechazará la acusación constitucional contra Grau', resumen: 'Dijo que su postura sería compartida por un grupo de diputados.', url: 'https://www.emol.com/noticias/Nacional/2026/06/21/1203450/schalper-rechazo-ac-ministro-grau.html' }
      ],
      vot: [],
      fue: [
        { titulo: 'Reseña biográfica parlamentaria', fuente: 'Biblioteca del Congreso Nacional', estado: 'Revisado', url: 'https://www.bcn.cl/historiapolitica/resenas_parlamentarias/wiki/Diego_Ignacio_Schalper_Sep%C3%BAlveda' },
        { titulo: 'Votaciones y militancia (datos abiertos)', fuente: 'Cámara de Diputadas y Diputados', estado: 'Revisado', url: 'https://opendata.camara.cl/camaradiputados/WServices/WSDiputado.asmx/retornarDiputado?prmDiputadoId=1075' },
        { titulo: 'Ficha del diputado', fuente: 'Cámara de Diputadas y Diputados', estado: 'Ver en portal', url: 'https://www.camara.cl/diputados/detalle/biografia.aspx?prmid=1075' },
        { titulo: 'Audiencias de lobby', fuente: 'InfoLobby', estado: 'Ver en portal', url: 'https://www.infolobby.cl' }
      ],
      conf: [] },

    { id: 'macaya', nombre: 'Javier Macaya Danús', ini: 'JM', tipo: 'Senadores', cargoCorto: 'Senador por O’Higgins',
      cargo: 'Senador por la 8ª Circunscripción (O’Higgins)', institucion: 'Senado de Chile', partido: 'Unión Demócrata Independiente', partidoF: 'Unión Demócrata Independiente',
      region: 'O’Higgins', periodo: '2022–2030', resumen: 'Abogado. Presidió la UDI entre 2020 y 2024.', senadoKey: 'S:Macaya D., Javier', verificado: '2026-10-15',
      resena: 'Abogado. Fue diputado por la Región de O’Higgins entre 2010 y 2022 y es senador desde 2022. Presidió la UDI entre diciembre de 2020 y julio de 2024. En 2026 preside la Comisión Especial Mixta de Presupuestos, que revisa el Presupuesto 2027.',
      temas: ['Presupuesto', 'Hacienda', 'Política'], oficialFuente: 'BCN', oficialUrl: 'https://www.bcn.cl/historiapolitica/resenas_parlamentarias/wiki/Javier_Ignacio_Macaya_Danus',
      trayectoria: [
        { cargo: 'Senador por la 8ª Circunscripción', periodo: '2022–2030', actual: true },
        { cargo: 'Presidente de la Unión Demócrata Independiente', periodo: '2020–2024' },
        { cargo: 'Diputado por el 15° Distrito', periodo: '2018–2022' },
        { cargo: 'Diputado por el Distrito N° 34', periodo: '2010–2018' }
      ], trayFuente: 'Reseña biográfica de la BCN',
      news: [
        { d: '2026-10-08', fecha: '8 oct 2026', medio: 'BioBío Chile', tm: 'Nacional', tema: 'Presupuesto', proyecto: '18702-05', orig: true, titulo: 'Macaya (UDI) apela a la empatía de Quiroz para Presupuesto 2027 entendiendo que «en Chile hay dolores»', resumen: 'Pidió al ministro de Hacienda considerar el impacto social durante la discusión del Presupuesto 2027.', url: 'https://www.biobiochile.cl/noticias/nacional/chile/2026/10/08/macaya-udi-apela-a-la-empatia-de-quiroz-para-presupuesto-2027-entendiendo-que-en-chile-hay-dolores.shtml', tambien: ['quiroz'] },
        { d: '2026-10-04', fecha: '4 oct 2026', medio: 'T13', tm: 'Nacional', tema: 'Presupuesto', proyecto: '18702-05', orig: false, titulo: 'Macaya, presidente de la comisión de Presupuesto, dice que aún no conoce los detalles del proyecto', resumen: 'Señaló que la comisión mixta revisará el fin del programa «Yo elijo mi PC».', url: 'https://www.t13.cl/noticia/politica/senador-macaya-soy-presidente-comision-presupuesto-no-conozco-detalles-4-10-2026' },
        { d: '2026-07-04', fecha: '4 jul 2026', medio: 'T13', tm: 'Nacional', tema: 'Política', orig: true, titulo: 'Javier Macaya marca distancia de Matthei: «En esas críticas no representa a la UDI»', resumen: 'Afirmó que las críticas de Evelyn Matthei al Gobierno son personales y que la UDI respalda al Ejecutivo.', url: 'https://www.t13.cl/noticia/politica/javier-macaya-marca-distancia-matthei-esas-criticas-no-representa-udi-4-7-2026' },
        { d: '2026-03-04', fecha: '4 mar 2026', medio: 'El Mostrador', tm: 'Digital', tema: 'Justicia', orig: true, titulo: 'Macaya inclina balanza a favor de ley que conmuta penas a reos mayores: su padre se beneficiaría', resumen: 'El Senado aprobó en general, por 23 votos contra 22, el proyecto sobre cumplimiento alternativo de penas para mayores de 75 años. El medio cuestiona su voto porque su padre cumple condena.', url: 'https://www.elmostrador.cl/noticias/pais/2026/03/04/macaya-inclina-balanza-a-favor-de-ley-que-conmuta-penas-a-mayores-de-75-su-padre-preso-tiene-73/' }
      ],
      vot: [
        { d: '2026-06-16', fecha: 'jun 2026', instancia: 'Comisión de Hacienda del Senado', titulo: 'Idea de legislar del proyecto de Reconstrucción Nacional', detalle: 'La comisión aprobó la idea de legislar por 3 votos a 2.', voto: 'A favor', fuente: 'Senado', url: 'https://www.senado.cl/comunicaciones/noticias/proyecto-de-reconstruccion-nacional-avanza-la-sala-del-senado', proyecto: '18216-05' }
      ],
      fue: [
        { titulo: 'Reseña biográfica parlamentaria', fuente: 'Biblioteca del Congreso Nacional', estado: 'Revisado', url: 'https://www.bcn.cl/historiapolitica/resenas_parlamentarias/wiki/Javier_Ignacio_Macaya_Danus' },
        { titulo: 'Ficha de senador', fuente: 'Senado de Chile', estado: 'Ver en portal', url: 'https://www.senado.cl/senadoras-y-senadores/listado-de-senadoras-y-senadores/javier-macaya-danus-sen' },
        { titulo: 'Audiencias de lobby', fuente: 'InfoLobby', estado: 'Ver en portal', url: 'https://www.infolobby.cl' }
      ],
      conf: [] },

    { id: 'espinoza', nombre: 'Fidel Espinoza Sandoval', ini: 'FE', tipo: 'Senadores', cargoCorto: 'Senador por Los Lagos',
      cargo: 'Senador por la 13ª Circunscripción (Los Lagos)', institucion: 'Senado de Chile', partido: 'Partido Socialista (militancia suspendida desde agosto de 2026)', partidoF: 'Partido Socialista',
      region: 'Los Lagos', periodo: '2022–2030', resumen: 'Profesor. Presidió la Cámara en 2017–2018.', senadoKey: 'S:Espinoza S., Fidel', verificado: '2026-10-15',
      resena: 'Profesor de Historia y Geografía. Fue diputado por la Región de Los Lagos entre 2002 y 2022 y presidente de la Cámara de Diputados entre 2017 y 2018. Senador desde 2022. En agosto de 2026 el Tribunal Supremo del PS suspendió su militancia de forma cautelar mientras se investiga un episodio denunciado como violencia intrafamiliar.',
      temas: ['Seguridad', 'Política', 'Vivienda'], oficialFuente: 'BCN', oficialUrl: 'https://www.bcn.cl/historiapolitica/resenas_parlamentarias/wiki/Fidel_Edgardo_Espinoza_Sandoval',
      trayectoria: [
        { cargo: 'Senador por la 13ª Circunscripción', periodo: '2022–2030', actual: true },
        { cargo: 'Presidente de la Cámara de Diputados', periodo: '2017–2018' },
        { cargo: 'Diputado por la Región de Los Lagos', periodo: '2002–2022' }
      ], trayFuente: 'Reseña biográfica de la BCN',
      news: [
        { d: '2026-10-09', fecha: '9 oct 2026', medio: 'BioBío Chile', tm: 'Nacional', tema: 'Seguridad', orig: true, titulo: 'Fidel Espinoza se desmarca del PS por reforma de seguridad y critica declaraciones «destempladas»', resumen: 'Se apartó del rechazo del Comité Central del PS a la reforma de seguridad del Gobierno.', url: 'https://www.biobiochile.cl/noticias/nacional/chile/2026/10/09/fidel-espinoza-se-desmarca-del-ps-por-reforma-de-seguridad-pese-a-advertencias-a-discolos.shtml' },
        { d: '2026-08-13', fecha: '13 ago 2026', medio: 'El Dínamo', tm: 'Digital', tema: 'Justicia', orig: true, titulo: 'Por investigación por VIF: Tribunal Supremo del PS suspende la militancia del senador Fidel Espinoza', resumen: 'El tribunal partidario calificó la medida como cautelar, temporal y revocable. La Fiscalía informó de un procedimiento por agresiones mutuas entre dos adultos, uno de ellos el senador.', url: 'https://www.eldinamo.cl/politica/2026/08/13/por-investigacion-por-vif-tribunal-supremo-del-ps-suspende-la-militancia-del-senador-fidel-espinoza/' },
        { d: '2026-06-29', fecha: '29 jun 2026', medio: 'Emol', tm: 'Nacional', tema: 'Política', orig: false, titulo: 'Espinoza critica que el Frente Amplio se defina como partido socialista', resumen: 'Respondió a una de las conclusiones del congreso del FA: definirse como un «partido socialista».', url: 'https://www.emol.com/noticias/Nacional/2026/06/29/1204187/ps-fa-socialismo-espinoza-congreso.html' },
        { d: '2026-02-08', fecha: '8 feb 2026', medio: 'BioBío Chile', tm: 'Nacional', tema: 'Política', orig: true, titulo: 'Espinoza (PS): «Ese mismo Senado que el FA quería eliminar evitará que Kast haga lo que quiera»', resumen: 'Hizo una evaluación crítica del gobierno de Gabriel Boric en seguridad, el proceso constituyente y el caso Convenios.', url: 'https://www.biobiochile.cl/noticias/nacional/chile/2026/02/08/espinoza-ps-ese-mismo-senado-que-el-fa-queria-eliminar-evitara-que-kast-haga-lo-que-quiera.shtml' }
      ],
      vot: [],
      fue: [
        { titulo: 'Reseña biográfica parlamentaria', fuente: 'Biblioteca del Congreso Nacional', estado: 'Revisado', url: 'https://www.bcn.cl/historiapolitica/resenas_parlamentarias/wiki/Fidel_Edgardo_Espinoza_Sandoval' },
        { titulo: 'Ficha de senador', fuente: 'Senado de Chile', estado: 'Ver en portal', url: 'https://www.senado.cl/senadoras-y-senadores/listado-de-senadoras-y-senadores/fidel-espinoza-sandoval-sen' },
        { titulo: 'Audiencias de lobby', fuente: 'InfoLobby', estado: 'Ver en portal', url: 'https://www.infolobby.cl' }
      ],
      conf: [
        { tema: 'Militancia', aFuente: 'Senado, nómina vigente (oct 2026)', aDice: 'Partido Socialista', bFuente: 'El Dínamo, 13 ago 2026', bDice: 'Militancia suspendida por el Tribunal Supremo del PS', aclaraFuente: 'El Dínamo, 13 ago 2026', aclara: 'La suspensión es cautelar, temporal y revocable mientras se investiga el caso. No equivale a una renuncia ni a una expulsión.', estado: 'Aclarado' }
      ] },

    { id: 'kaiser', nombre: 'Vanessa Kaiser Barents-Von Hohenhagen', ini: 'VK', tipo: 'Senadores', cargoCorto: 'Senadora por La Araucanía',
      cargo: 'Senadora por la 11ª Circunscripción (La Araucanía)', institucion: 'Senado de Chile', partido: 'Partido Nacional Libertario', partidoF: 'Partido Nacional Libertario',
      region: 'La Araucanía', periodo: '2026–2034', resumen: 'Doctora en Ciencia Política y Filosofía.', senadoKey: 'S:Kaiser B., Vanessa', verificado: '2026-10-15',
      resena: 'Periodista, doctora en Ciencia Política y en Filosofía por la Pontificia Universidad Católica. Académica y columnista. Militó en el Partido Republicano entre 2020 y 2021 y fue electa concejala de Las Condes en 2021, cargo al que renunció al año siguiente. Senadora por La Araucanía para el período 2026–2034, por el Partido Nacional Libertario.',
      temas: ['Seguridad', 'Justicia', 'Política'], oficialFuente: 'Senado', oficialUrl: 'https://www.senado.cl/senadoras-y-senadores/listado-de-senadoras-y-senadores/vanessa-kaiser-barents-sen',
      trayectoria: [
        { cargo: 'Senadora por la 11ª Circunscripción', periodo: '2026–2034', actual: true },
        { cargo: 'Concejala de Las Condes', periodo: '2021–2022' }
      ], trayFuente: 'Ficha del Senado',
      news: [
        { d: '2026-09-30', fecha: '30 sep 2026', medio: 'T13', tm: 'Nacional', tema: 'Justicia', orig: false, titulo: 'Kaiser acusa que el Senado se saltó el reglamento para no discutir su proyecto sobre denuncias falsas', resumen: 'Cuestionó el trámite dado a su proyecto que sanciona las denuncias falsas. La diputada Pamela Jiles la respaldó.', url: 'https://www.t13.cl/noticia/politica/senadora-kaiser-acusa-incumplimiento-del-reglamento-para-no-discutir-proyecto-30-9-2026', tambien: ['jiles'] },
        { d: '2026-08-19', fecha: '19 ago 2026', medio: 'T13', tm: 'Nacional', tema: 'Seguridad', orig: false, titulo: 'Kaiser rechaza la reforma de seguridad del Gobierno', resumen: 'Dijo no estar disponible para aprobar la reforma constitucional porque, a su juicio, no cambiará la realidad de la delincuencia.', url: 'https://www.t13.cl/noticia/politica/senadora-kaiser-rechaza-reforma-seguridad-19-8-2026' },
        { d: '2026-08-17', fecha: '17 ago 2026', medio: 'BioBío Chile', tm: 'Nacional', tema: 'Justicia', orig: true, titulo: 'Senadora Vanessa Kaiser (PNL) no afloja, desafía a Kast y le exige coraje para indultar a uniformados', resumen: 'Aumentó la presión sobre el Presidente Kast para que indulte a uniformados.', url: 'https://www.biobiochile.cl/noticias/nacional/chile/2026/08/17/senadora-vanessa-kaiser-desafia-a-kast-y-le-exige-coraje-indultos-a-uniformados.shtml' },
        { d: '2026-08-08', fecha: '8 ago 2026', medio: 'El Dínamo', tm: 'Digital', tema: 'Política', orig: true, titulo: 'Senadora Vanessa Kaiser: «Si este Gobierno quiere tener éxito, su piso mínimo es su 30%»', resumen: 'Destacó a los ministros Quiroz y Poduje y sostuvo que el error de Kast ha sido moderar su postura.', url: 'https://www.eldinamo.cl/politica/2026/08/08/senadora-vanessa-kaiser-si-este-gobierno-quiere-tener-exito-su-piso-minimo-es-su-30/' }
      ],
      vot: [],
      fue: [
        { titulo: 'Ficha y biografía de la senadora', fuente: 'Senado de Chile', estado: 'Revisado', url: 'https://www.senado.cl/senadoras-y-senadores/listado-de-senadoras-y-senadores/vanessa-kaiser-barents-sen' },
        { titulo: 'Audiencias de lobby', fuente: 'InfoLobby', estado: 'Ver en portal', url: 'https://www.infolobby.cl' },
        { titulo: 'Declaración de intereses y patrimonio', fuente: 'InfoProbidad', estado: 'Ver en portal', url: 'https://www.infoprobidad.cl' }
      ],
      conf: [] },

    { id: 'provoste', nombre: 'Yasna Provoste Campillay', ini: 'YP', tipo: 'Senadores', cargoCorto: 'Senadora por Atacama',
      cargo: 'Senadora por la 4ª Circunscripción (Atacama)', institucion: 'Senado de Chile', partido: 'Partido Demócrata Cristiano', partidoF: 'Partido Demócrata Cristiano',
      region: 'Atacama', periodo: '2026–2034 (senadora desde 2018)', resumen: 'Exministra de Educación. Presidió el Senado en 2021.', senadoKey: 'S:Provoste C., Yasna', verificado: '2026-10-15',
      resena: 'Profesora de Educación Física. Fue gobernadora de la Provincia de Huasco, intendenta de Atacama, ministra de Planificación (2004–2006) y de Educación (2006–2008), y diputada (2014–2018). Senadora desde 2018 y reelecta para 2026–2034. Presidió el Senado entre marzo y agosto de 2021. En 2026 preside la Cuarta Subcomisión Mixta de Presupuestos.',
      temas: ['Presupuesto', 'Educación', 'Regiones'], oficialFuente: 'BCN', oficialUrl: 'https://www.bcn.cl/historiapolitica/resenas_parlamentarias/wiki/Yasna_Provoste_Campillay',
      trayectoria: [
        { cargo: 'Senadora por la 4ª Circunscripción', periodo: '2026–2034', actual: true },
        { cargo: 'Senadora por la 4ª Circunscripción', periodo: '2018–2026' },
        { cargo: 'Presidenta del Senado', periodo: 'mar–ago 2021' },
        { cargo: 'Diputada por el Distrito N° 6', periodo: '2014–2018' },
        { cargo: 'Ministra de Educación', periodo: '2006–2008' },
        { cargo: 'Ministra de Planificación', periodo: '2004–2006' },
        { cargo: 'Intendenta de la Región de Atacama', periodo: '2001–2004' },
        { cargo: 'Gobernadora de la Provincia de Huasco', periodo: '1997–2001' }
      ], trayFuente: 'Reseña biográfica de la BCN',
      news: [
        { d: '2026-10-13', fecha: '13 oct 2026', medio: 'El Mostrador', tm: 'Digital', tema: 'Presupuesto', proyecto: '18702-05', orig: true, titulo: 'Provoste exige cambios al Presupuesto 2027: acusa falta de foco en empleo y recortes a regiones', resumen: 'Cuestionó la reducción de más de $200 mil millones en inversión regional y advirtió que seis regiones superan el 10% de desempleo.', url: 'https://www.elmostrador.cl/noticias/pais/2026/10/13/provoste-exige-cambios-al-presupuesto-2027-acusa-falta-de-foco-en-empleo-y-recortes-a-regiones/' },
        { d: '2026-10-06', fecha: '6 oct 2026', medio: 'El Mostrador', tm: 'Digital', tema: 'Presupuesto', proyecto: '18702-05', orig: true, titulo: 'Provoste (DC) se planta ante Hacienda: cuestiona recortes y anticipa pelea por los recursos sociales', resumen: 'Cuestionó que el Ejecutivo recorte programas sociales mientras pide autorización para endeudarse hasta por US$25 mil millones.', url: 'https://www.elmostrador.cl/noticias/pais/2026/10/06/provoste-dc-se-planta-ante-hacienda-cuestiona-recortes-y-anticipa-pelea-por-los-recursos-sociales/', tambien: ['quiroz'] },
        { d: '2026-09-06', fecha: '6 sep 2026', medio: 'The Clinic', tm: 'Digital', tema: 'Política', orig: false, titulo: 'Provoste: «Nos tenemos que sentar desde la DC hasta el PC a definir en qué estamos de acuerdo»', resumen: 'Respaldó una articulación amplia de las fuerzas progresistas, sin cerrarse a la fórmula de una nueva coalición.', url: 'https://www.theclinic.cl/2026/09/06/yasna-provoste-nos-tenemos-que-sentar-desde-la-dc-hasta-el-pc-a-definir-en-que-estamos-de-acuerdo-y-en-que-no' },
        { d: '2026-06-30', fecha: '30 jun 2026', medio: 'The Clinic', tm: 'Digital', tema: 'Política', orig: false, titulo: 'Provoste recuerda la acusación constitucional en su contra antes de la votación sobre Grau', resumen: 'Antes de que el Senado revisara la acusación contra el exministro Nicolás Grau, recordó la que la destituyó como ministra de Educación en 2008.', url: 'https://www.theclinic.cl/2026/06/30/uno-sabe-lo-que-es-vivir-una-acusacion-injusta-la-reflexion-de-la-senadora-provoste-en-la-previa-de-la-votacion-de-la-acusacion-constitucional-contra-grau/' }
      ],
      vot: [],
      fue: [
        { titulo: 'Reseña biográfica parlamentaria', fuente: 'Biblioteca del Congreso Nacional', estado: 'Revisado', url: 'https://www.bcn.cl/historiapolitica/resenas_parlamentarias/wiki/Yasna_Provoste_Campillay' },
        { titulo: 'Ficha de la senadora', fuente: 'Senado de Chile', estado: 'Ver en portal', url: 'https://www.senado.cl/senadoras-y-senadores/listado-de-senadoras-y-senadores/yasna-provoste-campillay-sen' },
        { titulo: 'Audiencias de lobby', fuente: 'InfoLobby', estado: 'Ver en portal', url: 'https://www.infolobby.cl' }
      ],
      conf: [] },

    { id: 'quiroz', nombre: 'Jorge Quiroz Castro', ini: 'JQ', tipo: 'Ministros', cargoCorto: 'Ministro de Hacienda',
      cargo: 'Ministro de Hacienda', institucion: 'Ministerio de Hacienda', partido: 'Información pendiente de verificación', partidoF: 'Sin verificar',
      region: 'Nacional', periodo: 'Desde el 11 de marzo de 2026', resumen: 'Economista. Ingresó el Presupuesto 2027.', verificado: '2026-10-15',
      resena: 'Economista. Asumió como ministro de Hacienda del Presidente José Antonio Kast en marzo de 2026. Encabezó la tramitación de la ley de Reconstrucción Nacional y Desarrollo Económico y Social, y el 30 de septiembre de 2026 ingresó al Congreso el proyecto de Ley de Presupuestos 2027.',
      temas: ['Presupuesto', 'Hacienda', 'Economía'], oficialFuente: 'Ministerio de Hacienda', oficialUrl: 'https://www.hacienda.cl/noticias-y-eventos/noticias/ministro-de-hacienda-jorge-quiroz-ingresa-proyecto-de-ley-de-presupuestos-2027',
      trayectoria: [ { cargo: 'Ministro de Hacienda', periodo: 'Desde mar 2026', actual: true } ], trayFuente: 'Gobierno de Chile y Ministerio de Hacienda',
      news: [
        { d: '2026-10-06', fecha: '6 oct 2026', medio: 'Ministerio de Hacienda', tm: 'Oficial', tema: 'Hacienda', proyecto: '18216-05', orig: false, titulo: 'Quiroz presenta el Estado de la Hacienda Pública 2026', resumen: 'Proyectó un crecimiento de 3,3% para 2027 y situó en esa semana la publicación de la ley de Reconstrucción Nacional.', url: 'https://www.hacienda.cl/noticias-y-eventos/noticias/ministro-jorge-quiroz-nuestro-compromiso-es-perseverar-en-esta-hoja-de-ruta' },
        { d: '2026-09-30', fecha: '30 sep 2026', medio: 'Ministerio de Hacienda', tm: 'Oficial', tema: 'Presupuesto', proyecto: '18702-05', ev: 'presupuesto2027', orig: true, titulo: 'Ministro de Hacienda, Jorge Quiroz, ingresa proyecto de Ley de Presupuestos 2027 al Congreso Nacional', resumen: 'El ministerio destaca el foco en empleo, inversión, seguridad y salud, dentro de la consolidación fiscal.', url: 'https://www.hacienda.cl/noticias-y-eventos/noticias/ministro-de-hacienda-jorge-quiroz-ingresa-proyecto-de-ley-de-presupuestos-2027' },
        { d: '2026-09-30', fecha: '30 sep 2026', medio: '24horas', tm: 'Nacional', tema: 'Presupuesto', proyecto: '18702-05', ev: 'presupuesto2027', orig: true, titulo: 'En un maletín con candados: Ministro Quiroz ingresa proyecto de Ley de Presupuesto 2027 al Congreso', resumen: 'Relata el ingreso del proyecto, recibido por la vicepresidenta de la Cámara, antes de la cadena nacional del Presidente Kast.', url: 'https://www.24horas.cl/actualidad/politica/en-un-maletin-con-candados-ministro-quiroz-ingresa-proyecto-de-ley-de-presupuesto-congreso' },
        { d: '2026-09-30', fecha: '30 sep 2026', medio: 'The Clinic', tm: 'Digital', tema: 'Presupuesto', proyecto: '18702-05', ev: 'presupuesto2027', orig: true, titulo: 'Quiroz ingresa proyecto de Presupuesto 2027 y confirma incremento del 1,5% en el gasto público', resumen: 'Destaca el alza de 1,5% del gasto y que es el primer presupuesto del gobierno de Kast.', url: 'https://www.theclinic.cl/2026/09/30/quiroz-ingresa-proyecto-de-presupuesto-2027-y-confirma-incremento-del-15-en-el-gasto-publico' },
        { d: '2026-09-29', fecha: '29 sep 2026', medio: 'Ministerio de Hacienda', tm: 'Oficial', tema: 'Hacienda', orig: false, titulo: 'Quiroz destaca proyecto que extiende apoyos a transportistas y pescadores y amplía el plazo del FOGAPE', resumen: 'El proyecto extiende hasta diciembre los apoyos por el mayor costo de los combustibles y amplía hasta 2028 el plazo para aportes al FOGAPE.', url: 'https://www.hacienda.cl/noticias-y-eventos/noticias/ministro-de-hacienda-destaca-proyecto-que-extiende-apoyos-a-transportistas-y' }
      ],
      vot: [
        { d: '2026-09-30', fecha: '30 sep 2026', instancia: 'Ministerio de Hacienda', titulo: 'Ingreso del proyecto de Ley de Presupuestos 2027', detalle: 'El proyecto propone un crecimiento del gasto de 1,5% respecto de la ejecución proyectada para 2026.', voto: 'Decisión', fuente: 'Ministerio de Hacienda y The Clinic', url: 'https://www.hacienda.cl/noticias-y-eventos/noticias/ministro-de-hacienda-jorge-quiroz-ingresa-proyecto-de-ley-de-presupuestos-2027', proyecto: '18702-05' }
      ],
      fue: [
        { titulo: 'Noticias del ministro', fuente: 'Ministerio de Hacienda', estado: 'Revisado', url: 'https://www.hacienda.cl/noticias-y-eventos/noticias/ministro-de-hacienda-jorge-quiroz-ingresa-proyecto-de-ley-de-presupuestos-2027' },
        { titulo: 'Transparencia activa', fuente: 'Portal de Transparencia', estado: 'Ver en portal', url: 'https://www.portaltransparencia.cl' },
        { titulo: 'Audiencias de lobby', fuente: 'InfoLobby', estado: 'Ver en portal', url: 'https://www.infolobby.cl' },
        { titulo: 'Declaración de intereses y patrimonio', fuente: 'InfoProbidad', estado: 'Ver en portal', url: 'https://www.infoprobidad.cl' }
      ],
      conf: [] },

    { id: 'bellolio', nombre: 'Jaime Bellolio Avaria', ini: 'JB', tipo: 'Alcaldes', cargoCorto: 'Alcalde de Providencia',
      cargo: 'Alcalde de Providencia', institucion: 'Municipalidad de Providencia', partido: 'Unión Demócrata Independiente', partidoF: 'Unión Demócrata Independiente',
      region: 'Región Metropolitana', periodo: '2024–2028', resumen: 'Exministro vocero. Electo en 2024.', verificado: '2026-10-15',
      resena: 'Ingeniero comercial de la Universidad Católica y magíster en Políticas Públicas de la Universidad de Chicago. Fue presidente de la FEUC, diputado por dos períodos desde 2014 y ministro secretario general de Gobierno desde julio de 2020, en el segundo gobierno de Sebastián Piñera. Fue electo alcalde de Providencia el 27 de octubre de 2024, sucediendo a Evelyn Matthei.',
      temas: ['Seguridad', 'Educación', 'Ciudad'], oficialFuente: 'Municipalidad de Providencia', oficialUrl: 'https://providencia.cl/provi/municipalidad/autoridades/jaime-bellolio-avaria',
      trayectoria: [
        { cargo: 'Alcalde de Providencia', periodo: '2024–2028', actual: true },
        { cargo: 'Ministro secretario general de Gobierno', periodo: 'Desde jul 2020' },
        { cargo: 'Diputado (dos períodos)', periodo: 'Desde 2014' }
      ], trayFuente: 'Municipalidad de Providencia',
      news: [
        { d: '2026-10-07', fecha: '7 oct 2026', medio: 'CNN Chile', tm: 'Nacional', tema: 'Educación', orig: false, titulo: 'Bellolio propone un plan de tutorías con inteligencia artificial tras el fin de «Yo elijo mi PC»', resumen: 'En una carta a El Mercurio cuestionó los argumentos del Gobierno para terminar el programa y planteó que «una herramienta por sí sola no enseña».', url: 'https://www.cnnchile.com/pais/una-herramienta-por-si-sola-no-ensena-alcalde-bellolio-udi-propone-plan-de-tuturias-con-inteligencia-artificial-tras-fin-del-programa-yo-elijo-mi-pc/' },
        { d: '2026-09-06', fecha: '6 sep 2026', medio: 'Cooperativa', tm: 'Nacional', tema: 'Política', orig: true, titulo: 'Jaime Bellolio: La trinchera política nos está llevando a olvidarnos de las urgencias de la calle', resumen: 'Rechazó la lógica de la «batalla cultural» planteada por Javier Milei en el Foro Madrid, celebrado en Santiago.', url: 'https://www.cooperativa.cl/noticias/pais/politica/udi/jaime-bellolio-la-trinchera-politica-nos-esta-llevando-a-olvidarnos-de/2026-09-06/162014.html' },
        { d: '2026-08-23', fecha: '23 ago 2026', medio: 'BioBío Chile', tm: 'Nacional', tema: 'Política', ev: 'acuerdos', orig: true, titulo: 'Vodanovic y Bellolio proponen 7 acuerdos nacionales para evitar que Chile «se reinicie» cada 4 años', resumen: 'Resume la columna conjunta de ambos alcaldes y los siete ámbitos que proponen.', url: 'https://www.biobiochile.cl/noticias/nacional/chile/2026/08/23/vodanovic-y-bellolio-proponen-7-acuerdos-nacionales-para-evitar-que-chile-se-reinicie-cada-4-anos.shtml', tambien: ['tvodanovic'] },
        { d: '2026-08-23', fecha: '23 ago 2026', medio: 'Emol', tm: 'Nacional', tema: 'Política', ev: 'acuerdos', orig: false, titulo: 'Alcaldes Vodanovic (FA) y Bellolio (UDI) proponen una agenda común de largo plazo', resumen: 'Reproduce la columna «Chile a treinta años: una invitación desde dos veredas distintas», publicada en El Mercurio.', url: 'https://www.emol.com/noticias/Nacional/2026/08/23/1209317/vodanovic-bellolio-carta.html', tambien: ['tvodanovic'] },
        { d: '2026-06-28', fecha: '28 jun 2026', medio: 'The Clinic', tm: 'Digital', tema: 'Política', orig: false, titulo: 'Bellolio critica a figuras republicanas por la «tesis de la superioridad moral»', resumen: 'Se mostró preocupado por el clima en el oficialismo tras las diferencias por la acusación constitucional contra Nicolás Grau.', url: 'https://www.theclinic.cl/2026/06/28/jaime-bellolio-udi-veo-a-figuras-del-partido-republicano-que-insisten-en-la-tesis-de-la-superioridad-moral-esa-logica-solo-hace-dano/' },
        { d: '2026-05-21', fecha: '21 may 2026', medio: 'La Tercera', tm: 'Nacional', tema: 'Seguridad', orig: false, titulo: 'Bellolio asegura que el Gobierno no tendrá «nuevas oportunidades» en seguridad', resumen: 'Defendió el nombramiento de Martín Arrau en Seguridad y pidió al Gobierno ampliar su relato a otras áreas.', url: 'https://www.latercera.com/nacional/noticia/bellolio-asegura-que-gobierno-no-tendra-nuevas-oportunidades-en-gestion-de-seguridad-y-pide-ampliar-el-relato-a-otras-areas/', tambien: ['arrau'] }
      ],
      vot: [
        { d: '2026-08-23', fecha: '23 ago 2026', instancia: 'Gestión municipal', titulo: 'Propuesta conjunta de siete acuerdos nacionales', detalle: 'Columna firmada con el alcalde de Maipú, Tomás Vodanovic, publicada en El Mercurio.', voto: 'Decisión', fuente: 'Emol', url: 'https://www.emol.com/noticias/Nacional/2026/08/23/1209317/vodanovic-bellolio-carta.html' }
      ],
      fue: [
        { titulo: 'Página del alcalde', fuente: 'Municipalidad de Providencia', estado: 'Revisado', url: 'https://providencia.cl/provi/municipalidad/autoridades/jaime-bellolio-avaria' },
        { titulo: 'Resultados electorales', fuente: 'Servel', estado: 'Ver en portal', url: 'https://www.servel.cl' },
        { titulo: 'Audiencias de lobby', fuente: 'InfoLobby', estado: 'Ver en portal', url: 'https://www.infolobby.cl' },
        { titulo: 'Declaración de intereses y patrimonio', fuente: 'InfoProbidad', estado: 'Ver en portal', url: 'https://www.infoprobidad.cl' }
      ],
      conf: [] }
  ];

  const E = {
    ruf: { titulo: 'El Senado despacha las Reglas de Uso de la Fuerza', fecha: '7 oct 2026', proyecto: '15805-07',
      items: [
        { medio: 'Emol', fecha: '7 oct 2026', orig: true, titulo: 'Senado aprueba Reglas de Uso de la Fuerza y proyecto queda en condiciones de ser ley', resumen: 'Destaca la abstención de Fidel Espinoza (PS) y las declaraciones del ministro Arrau.', url: 'https://www.emol.com/noticias/Nacional/2026/10/07/1213556/senado-aprueba-ruf-despacha-ley.html' },
        { medio: 'El Dínamo', fecha: '7 oct 2026', orig: false, titulo: 'RUF son despachadas a ley con reserva de constitucionalidad', resumen: 'Explica cómo se reunieron los votos y la reserva anunciada por el PS.', url: 'https://www.eldinamo.cl/politica/2026/10/07/con-reserva-de-constitucionalidad-reglas-de-uso-de-la-fuerza-son-despachadas-a-ley-por-el-senado/' },
        { medio: 'Cooperativa', fecha: '7 oct 2026', orig: true, titulo: 'Senado despachó las Reglas del Uso de la Fuerza y quedaron listas para ser ley', resumen: 'Se centra en lo que dice el texto sobre el uso de fuerza potencialmente letal.', url: 'https://www.cooperativa.cl/noticias/pais/politica/senado/senado-despacho-las-reglas-del-uso-de-la-fuerza-y-quedaron-listas-para/2026-10-07/204110.html' }
      ],
      coinc: ['El Senado aprobó el informe de la comisión mixta por 29 votos a favor, 15 en contra y 1 abstención.', 'El proyecto queda en condiciones de convertirse en ley.'],
      enfoques: [
        { medio: 'Emol', t: 'quién se abstuvo y la reacción del Gobierno.' },
        { medio: 'El Dínamo', t: 'la negociación de los votos y la postura del PS.' },
        { medio: 'Cooperativa', t: 'el contenido de la norma.' }
      ],
      compl: [
        { medio: 'Emol', t: 'la Cámara lo había aprobado horas antes por 111 a 23, con 5 abstenciones.' },
        { medio: 'El Dínamo', t: 'la moción sumó firmas de los senadores Iván Flores (DC) y Karim Bianchi (Ind.).' },
        { medio: 'Cooperativa', t: 'los casos en que procede la fuerza letal, como legítima defensa o protección de infraestructura crítica.' }
      ] },
    gabinete: { titulo: 'Martín Arrau asume como ministro de Seguridad Pública', fecha: '19–20 may 2026',
      items: [
        { medio: 'The Clinic', fecha: '19 may 2026', orig: false, titulo: 'Arrau, la apuesta de Kast para mejorar la gestión en Seguridad', resumen: 'Reacciones del oficialismo y reparos previos a la gestión de Steinert.', url: 'https://theclinic.cl/2026/05/19/martin-arrau-la-apuesta-de-kast-para-mejorar-la-gestion-en-seguridad-tras-las-criticas-al-desempeno-de-steinert' },
        { medio: 'El Dínamo', fecha: '20 may 2026', orig: false, titulo: 'Quién es Martín Arrau, el hombre de confianza de Kast en Seguridad', resumen: 'Perfil de su trayectoria política y profesional.', url: 'https://www.eldinamo.cl/politica/2026/05/20/martin-arrau-el-hombre-de-confianza-de-kast-que-buscara-fortalecer-el-ministerio-de-seguridad/' },
        { medio: 'Chilevisión', fecha: '20 may 2026', orig: true, titulo: 'Arrau agradeció “camino recorrido” por Steinert y prometió enfrentar “profundo problema de seguridad”', resumen: 'Sus primeras declaraciones en el cargo.', url: 'https://www.chilevision.cl/noticias/nacional/arrau-agradecio-camino-recorrido-por-steinert-y-prometio-enfrentar-profundo-problema-de-seguridad/amp/' }
      ],
      coinc: ['Arrau dejó Obras Públicas para reemplazar a Trinidad Steinert en Seguridad.', 'Ocurrió en el primer cambio de gabinete del presidente Kast.'],
      enfoques: [
        { medio: 'The Clinic', t: 'el contexto político y las reacciones.' },
        { medio: 'El Dínamo', t: 'quién es y de dónde viene.' },
        { medio: 'Chilevisión', t: 'lo que dijo al asumir.' }
      ],
      compl: [
        { medio: 'The Clinic', t: 'su paso por la Convención Constitucional (2021–2022).' },
        { medio: 'El Dínamo', t: 'una polémica anterior con socios de Colo Colo.' },
        { medio: 'Chilevisión', t: 'Louis de Grange queda como biministro de Transportes y Obras Públicas.' }
      ] },
    recorte: { titulo: 'Orrego y el posible recorte a los gobiernos regionales', fecha: '26–28 sep 2026',
      items: [
        { medio: 'El Diario Santiago', fecha: '26 sep 2026', orig: true, titulo: 'Orrego alerta por eventual recorte a gobiernos regionales y cuestiona postergación de obras', resumen: 'Pone el foco en la continuidad de las obras de infraestructura.', url: 'https://eldiariosantiago.cl/2026/09/26/orrego-recorte-gobiernos-regionales-presupuesto-2027/' },
        { medio: 'Está Pasando', fecha: '26 sep 2026', orig: true, titulo: 'Gobernador Orrego cuestiona recorte de entre 7% y 10% a regiones', resumen: 'Nombra los proyectos afectados en la región.', url: 'https://estapasando.cl/politica/gobernador-orrego-cuestiona-recorte-de-entre-7-y-10-a-regiones/' },
        { medio: 'La Tercera', fecha: '28 sep 2026', orig: false, titulo: 'Orrego se convierte en “portavoz” de las críticas a recortes y proyectos pausados', resumen: 'Analiza el papel político que está tomando el gobernador.', url: 'https://www.latercera.com/nacional/noticia/orrego-endurece-el-tono-contra-el-gobierno-y-se-convierte-en-portavoz-de-criticas-por-recortes-y-proyectos-pausados/' }
      ],
      coinc: ['Orrego cuestiona un posible recorte a los gobiernos regionales en el Presupuesto 2027.', 'Critica que se posterguen o pausen obras en la Región Metropolitana.'],
      enfoques: [
        { medio: 'El Diario Santiago', t: 'el efecto en la inversión regional.' },
        { medio: 'Está Pasando', t: 'los proyectos concretos en riesgo.' },
        { medio: 'La Tercera', t: 'su proyección política frente al Gobierno.' }
      ],
      compl: [
        { medio: 'Está Pasando', t: 'menciona el GAM, la ciclovía de la Alameda y el tren a Melipilla.' },
        { medio: 'La Tercera', t: 'su “mini Cancillería” y la disputa con el ministro Poduje por el Parque Cerro Chena.' }
      ] },
    reforma: { titulo: 'La megarreforma pasa la Comisión de Hacienda del Senado', fecha: 'jun 2026', proyecto: '18216-05',
      items: [
        { medio: 'Senado', fecha: 'jun 2026', orig: true, titulo: 'Proyecto de reconstrucción nacional avanza a la Sala del Senado', resumen: 'Registro oficial con los argumentos de cada integrante de la comisión.', url: 'https://www.senado.cl/comunicaciones/noticias/proyecto-de-reconstruccion-nacional-avanza-la-sala-del-senado' },
        { medio: 'Diario Financiero', fecha: '17 jun 2026', orig: false, titulo: 'Proyecto de reactivación supera su primera valla en el Senado', resumen: 'Lo presenta como un avance y anticipa la votación en Sala.', url: 'https://www.df.cl/economia-y-politica/politica/proyecto-de-reactivacion-supera-su-primera-valla-en-el-senado-comision-de' }
      ],
      coinc: ['La Comisión de Hacienda aprobó la idea de legislar por 3 votos a 2.', 'Votaron a favor Macaya, Gatica y Carter; en contra, Vodanovic y Cicardini.'],
      enfoques: [
        { medio: 'Senado', t: 'los fundamentos de cada voto.' },
        { medio: 'Diario Financiero', t: 'el avance del proyecto y los próximos pasos.' }
      ],
      compl: [
        { medio: 'Senado', t: 'Vodanovic pidió separar la discusión de la reconstrucción del resto del proyecto.' },
        { medio: 'Diario Financiero', t: 'Vodanovic pidió al Gobierno “sacar el pie del acelerador”.' }
      ] },
    acuerdos: { titulo: 'Los alcaldes Vodanovic y Bellolio proponen siete acuerdos nacionales', fecha: '23 ago 2026', verificado: '2026-10-15',
      items: [
        { medio: 'BioBío Chile', fecha: '23 ago 2026', orig: true, titulo: 'Vodanovic y Bellolio proponen 7 acuerdos nacionales para evitar que Chile «se reinicie» cada 4 años', resumen: 'Nota breve que resume la columna, enumera los siete ámbitos y explica el método propuesto.', url: 'https://www.biobiochile.cl/noticias/nacional/chile/2026/08/23/vodanovic-y-bellolio-proponen-7-acuerdos-nacionales-para-evitar-que-chile-se-reinicie-cada-4-anos.shtml' },
        { medio: 'Emol', fecha: '23 ago 2026', orig: false, titulo: 'Alcaldes Vodanovic (FA) y Bellolio (UDI) proponen una agenda común de largo plazo', resumen: 'Cita los pasajes centrales y reproduce íntegra la columna publicada en El Mercurio.', url: 'https://www.emol.com/noticias/Nacional/2026/08/23/1209317/vodanovic-bellolio-carta.html' }
      ],
      coinc: [
        'Tomás Vodanovic (FA), alcalde de Maipú, y Jaime Bellolio (UDI), alcalde de Providencia, publicaron una columna conjunta en El Mercurio el domingo 23 de agosto de 2026.',
        'Proponen acuerdos nacionales de largo plazo en siete ámbitos, con un horizonte de 30 años.',
        'Sostienen que el país no puede «reiniciarse» cada cuatro años.'
      ],
      enfoques: [
        { medio: 'BioBío Chile', t: 'el método: partir por un diagnóstico y metas comunes, y discutir después las políticas.' },
        { medio: 'Emol', t: 'el texto de la columna, con el desarrollo de cada uno de los siete objetivos.' }
      ],
      compl: [
        { medio: 'Emol', t: 'detalla cada objetivo; por ejemplo, la soledad no deseada de las personas mayores y la adaptación climática como gestión de riesgo.' },
        { medio: 'Emol', t: 'menciona los planes de infraestructura, de crimen organizado y la estrategia de hidrógeno verde como esfuerzos de gobiernos anteriores.' }
      ] },
    presupuesto2027: { titulo: 'El Gobierno ingresa el Presupuesto 2027 al Congreso', fecha: '30 sep 2026', proyecto: '18702-05', verificado: '2026-10-15',
      items: [
        { medio: 'Ministerio de Hacienda', fecha: '30 sep 2026', orig: true, titulo: 'Ministro de Hacienda, Jorge Quiroz, ingresa proyecto de Ley de Presupuestos 2027 al Congreso Nacional', resumen: 'Comunicado oficial: describe las prioridades del proyecto y cita al ministro.', url: 'https://www.hacienda.cl/noticias-y-eventos/noticias/ministro-de-hacienda-jorge-quiroz-ingresa-proyecto-de-ley-de-presupuestos-2027' },
        { medio: '24horas', fecha: '30 sep 2026', orig: true, titulo: 'En un maletín con candados: Ministro Quiroz ingresa proyecto de Ley de Presupuesto 2027 al Congreso', resumen: 'Relata el ingreso y lo sitúa antes de la cadena nacional del Presidente.', url: 'https://www.24horas.cl/actualidad/politica/en-un-maletin-con-candados-ministro-quiroz-ingresa-proyecto-de-ley-de-presupuesto-congreso' },
        { medio: 'The Clinic', fecha: '30 sep 2026', orig: true, titulo: 'Quiroz ingresa proyecto de Presupuesto 2027 y confirma incremento del 1,5% en el gasto público', resumen: 'Destaca la cifra de crecimiento del gasto y quién recibió el proyecto.', url: 'https://www.theclinic.cl/2026/09/30/quiroz-ingresa-proyecto-de-presupuesto-2027-y-confirma-incremento-del-15-en-el-gasto-publico' }
      ],
      coinc: [
        'El ministro de Hacienda, Jorge Quiroz, ingresó el proyecto de Ley de Presupuestos 2027 al Congreso el miércoles 30 de septiembre de 2026.',
        'Con el ingreso comienza la tramitación legislativa del proyecto.'
      ],
      enfoques: [
        { medio: 'Ministerio de Hacienda', t: 'las prioridades del proyecto (empleo, inversión, seguridad y salud) y la consolidación fiscal.' },
        { medio: '24horas', t: 'la escena del ingreso y la cadena nacional anunciada por el Presidente Kast.' },
        { medio: 'The Clinic', t: 'el alza de 1,5% del gasto público y que es el primer presupuesto del gobierno de Kast.' }
      ],
      compl: [
        { medio: 'Ministerio de Hacienda', t: 'el ministro ingresó el proyecto junto al director de Presupuestos, José Pablo Gómez.' },
        { medio: 'The Clinic', t: 'lo recibió la vicepresidenta de la Cámara, Ximena Ossandón, porque el presidente Jorge Alessandri estaba fuera del país.' },
        { medio: '24horas', t: 'la tramitación comienza en la Comisión Mixta de Presupuestos.' }
      ] }
  };

  /* Fotografías: recortadas en cuadrado y reducidas a 320 px, sin alterar la apariencia. */
  const C = 'Wikimedia Commons';
  const FOTOS = {
    desbordes: { src: 'assets/fotos/desbordes.webp', cred: 'Gobierno de Chile · CC BY 3.0 CL', fuente: C, url: 'https://commons.wikimedia.org/wiki/File:MARIO_DESBORDES_JIMENEZ.jpg' },
    tvodanovic: { src: 'assets/fotos/tvodanovic.webp', cred: 'Municipalidad de Maipú · CC BY 4.0', fuente: C, url: 'https://commons.wikimedia.org/wiki/File:Tom%C3%A1s_Vodanivic_-_2024.jpg' },
    orrego: { src: 'assets/fotos/orrego.webp', cred: 'Mediabanco Agencia · CC BY 2.0', fuente: C, url: 'https://commons.wikimedia.org/wiki/File:Claudio_Orrego_2021_(cropped).jpg' },
    mundaca: { src: 'assets/fotos/mundaca.webp', cred: 'Diego Grez · CC BY-SA 4.0', fuente: C, url: 'https://commons.wikimedia.org/wiki/File:Rodrigo_Mundaca_en_Valpara%C3%ADso_4_(cropped).jpg' },
    arrau: { src: 'assets/fotos/arrau.webp', cred: 'Gobierno de Chile · CC BY 3.0 CL', fuente: C, url: 'https://commons.wikimedia.org/wiki/File:Mart%C3%ADn_Arrau_ministro_(cropped).jpg' },
    poduje: { src: 'assets/fotos/poduje.webp', cred: 'Gobierno de Chile · CC BY 3.0 CL', fuente: C, url: 'https://commons.wikimedia.org/wiki/File:Iv%C3%A1n_Poduje,_Ministro_de_Vivienda_y_Urbanismo.jpg' },
    toledo: { src: 'assets/fotos/toledo.webp', cred: 'Gobierno de Chile · CC BY 3.0 CL', fuente: C, url: 'https://commons.wikimedia.org/wiki/File:Mat%C3%ADas_Toledo_(cropped).jpg' },
    bassaletti: { src: 'assets/fotos/bassaletti.webp', cred: 'Biblioteca del Congreso Nacional · CC BY-SA 3.0 CL', fuente: C, url: 'https://commons.wikimedia.org/wiki/File:Diputados_2026_Enrique_Alejandro_Bassaletti_Riess.jpg' },
    pvodanovic: { src: 'assets/fotos/pvodanovic.webp', cred: 'Biblioteca del Congreso Nacional · CC BY-SA 3.0 CL', fuente: C, url: 'https://commons.wikimedia.org/wiki/File:Senado_2026_Paulina_Vodanovic_Rojas.jpg' },
    walker: { src: 'assets/fotos/walker.webp', cred: 'Biblioteca del Congreso Nacional · CC BY-SA 3.0 CL', fuente: C, url: 'https://commons.wikimedia.org/wiki/File:Senador_Mat%C3%ADas_Walker_Prieto_(2022).jpg' },
    fries: { src: 'assets/fotos/fries.webp', cred: 'Biblioteca del Congreso Nacional · CC BY-SA 3.0 CL', fuente: C, url: 'https://commons.wikimedia.org/wiki/File:Lorena_Fries_Monle%C3%B3n.jpg' },
    jiles: { src: 'assets/fotos/jiles.webp', cred: 'Biblioteca del Congreso Nacional · CC BY-SA 3.0 CL', fuente: C, url: 'https://commons.wikimedia.org/wiki/File:Diputados_2026_Pamela_Jiles_Moreno.jpg' },
    hassler: { src: 'assets/fotos/hassler.webp', cred: 'Lula Oficial · CC BY-SA 2.0', fuente: C, url: 'https://commons.wikimedia.org/wiki/File:Irac%C3%AD_Hassler,_2024.jpg' },
    schalper: { src: 'assets/fotos/schalper.webp', cred: 'Biblioteca del Congreso Nacional · CC BY-SA 3.0 CL', fuente: C, url: 'https://commons.wikimedia.org/wiki/File:Diputados_2026_Diego_Ignacio_Schalper_Sep%C3%BAlveda.jpg' },
    macaya: { src: 'assets/fotos/macaya.webp', cred: 'Biblioteca del Congreso Nacional · CC BY-SA 3.0 CL', fuente: C, url: 'https://commons.wikimedia.org/wiki/File:Senador_Javier_Ignacio_Macaya_Danus.jpg' },
    espinoza: { src: 'assets/fotos/espinoza.webp', cred: 'Biblioteca del Congreso Nacional · CC BY-SA 3.0 CL', fuente: C, url: 'https://commons.wikimedia.org/wiki/File:Senador_Fidel_Espinoza_Sandoval_(2022).jpg' },
    kaiser: { src: 'assets/fotos/kaiser.webp', cred: 'Senado de Chile · CC BY 3.0', fuente: C, url: 'https://commons.wikimedia.org/wiki/File:Vanessa_Kaiser_Senadora_2026.jpg' },
    provoste: { src: 'assets/fotos/provoste.webp', cred: 'Biblioteca del Congreso Nacional · CC BY-SA 3.0 CL', fuente: C, url: 'https://commons.wikimedia.org/wiki/File:Senadora_Yasna_Provoste_Campillay_(2022).jpg' },
    quiroz: { src: 'assets/fotos/quiroz.webp', cred: 'Gobierno de Chile · CC BY 3.0 CL', fuente: C, url: 'https://commons.wikimedia.org/wiki/File:Jorge_Quiroz.jpg' },
    bellolio: { src: 'assets/fotos/bellolio.webp', cred: 'Municipalidad de Providencia · CC BY 3.0 CL', fuente: C, url: 'https://commons.wikimedia.org/wiki/File:Jaime_Bellolio_alcalde_2024_(cropped).png' }
  };
  return { P, E, FOTOS, corte: '2026-10-15', corteTexto: '15 de octubre de 2026', corteOriginal: '2026-10-14' };
})();
