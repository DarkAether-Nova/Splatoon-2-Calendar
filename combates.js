// =========================================================================
// CONFIGURACIÓN DE ROTACIÓN GLOBAL Y DATOS ONLINE (NEXTENDO API + CORSPROXY)
// =========================================================================

// Secuencia de modos competitivos y de liga por rotación
const rankedModesSequence = ["splatZones", "towerControl", "rainmaker", "clamBlitz"];

// Control de activación de Splatfest (true = activo / false = inactivo)
let isSplatfestActive = false; 

// Almacén global para las rotaciones obtenidas de la API
let onlineRotationsData = {
    turfWarRotations: [],
    rankedBattleRotations: [],
    leagueBattleRotations: [],
    splatfestRotations: []
};

// API rule.key (snake_case) -> clave de modo del sitio (camelCase, para traducciones)
const RULE_KEY_MAP = {
    turf_war: "turf",
    splat_zones: "splatZones",
    tower_control: "towerControl",
    rainmaker: "rainmaker",
    clam_blitz: "clamBlitz"
};

// Nombres OFICIALES de los escenarios (fuente: localizaciones Nintendo vía splatoon2.ink).
const STAGE_NAMES = {
  0: {en:"The Reef", "es-ES":"Barrio Congrio", "es-MX":"Barrio Congrio", fr:"Allées salées", ru:"Коралловый риф"},
  1: {en:"Musselforge Fitness", "es-ES":"Gimnasio Mejillón", "es-MX":"Gimnasio Mejillón", fr:"Gymnase Ancrage", ru:"Фитнес-центр «Мидия»"},
  2: {en:"Starfish Mainstage", "es-ES":"Auditorio Erizo", "es-MX":"Auditorio Erizo", fr:"Scène Sirène", ru:"Главная сцена «Морская звезда»"},
  3: {en:"Sturgeon Shipyard", "es-ES":"Astillero Beluga", "es-MX":"Astillero Beluga", fr:"Chantier Narval", ru:"Верфь «Осетр»"},
  4: {en:"Inkblot Art Academy", "es-ES":"Instituto Coralino", "es-MX":"Instituto Coralino", fr:"Institut Calam'arts", ru:"Художественная академия «Альт»"},
  5: {en:"Humpback Pump Track", "es-ES":"Tiburódromo", "es-MX":"Tiburódromo", fr:"Piste Méroule", ru:"Вейк-парк «Горбыль»"},
  6: {en:"Manta Maria", "es-ES":"Corbeta Corvina", "es-MX":"Corbeta Corvina", fr:"Manta Maria", ru:"Манта Мария"},
  7: {en:"Port Mackerel", "es-ES":"Puerto Jurel", "es-MX":"Puerto Jurel", fr:"Docks Haddock", ru:"Порт Макрель"},
  8: {en:"Moray Towers", "es-ES":"Torres Merluza", "es-MX":"Torres Merluza", fr:"Tours Girelle", ru:"Башни «Мурена»"},
  9: {en:"Snapper Canal", "es-ES":"Canal Cormorán", "es-MX":"Canal Cormorán", fr:"Canalamar", ru:"Канал Лютян"},
  10: {en:"Kelp Dome", "es-ES":"Jardín botánico", "es-MX":"Jardín botánico", fr:"Serre Goémon", ru:"Ламинариевый купол"},
  11: {en:"Blackbelly Skatepark", "es-ES":"Parque Lubina", "es-MX":"Parque Lubina", fr:"Skatepark Mako", ru:"Скейт-парк «Черная Брюшка»"},
  12: {en:"Shellendorf Institute", "es-ES":"Galería Raspa", "es-MX":"Galería Raspa", fr:"Galerie des abysses", ru:"Музей «Ракушкофф»"},
  13: {en:"MakoMart", "es-ES":"Ultramarinos Orca", "es-MX":"Ultramarinos Orca", fr:"Supermarché Cétacé", ru:"Гипермаркет «Акула»"},
  14: {en:"Walleye Warehouse", "es-ES":"Almacén Rodaballo", "es-MX":"Almacén Rodaballo", fr:"Encrepôt", ru:"Склад «Кефаль»"},
  15: {en:"Arowana Mall", "es-ES":"Plazuela del Calamar", "es-MX":"Plazuela del Calamar", fr:"Centre Arowana", ru:"Торговый центр «Арована»"},
  16: {en:"Camp Triggerfish", "es-ES":"Campamento Arowana", "es-MX":"Campamento Arowana", fr:"Hippo-Camping", ru:"Лагерь «Пиранья»"},
  17: {en:"Piranha Pit", "es-ES":"Cantera Tintorera", "es-MX":"Cantera Tintorera", fr:"Carrière Caviar", ru:"Карьер «Пиранья»"},
  18: {en:"Goby Arena", "es-ES":"Estadio Ajolote", "es-MX":"Estadio Ajolote", fr:"Stade Bernique", ru:"Арена «Бычок»"},
  19: {en:"New Albacore Hotel", "es-ES":"Gran Hotel Caviar", "es-MX":"Gran Hotel Caviar", fr:"Hôtel Atoll", ru:"Отель «Альбакор»"},
  20: {en:"Wahoo World", "es-ES":"Pirañalandia", "es-MX":"Pirañalandia", fr:"Parc Carapince", ru:"Парк аттракционов «Ваху»"},
  21: {en:"Ancho-V Games", "es-ES":"Estudios Esturión", "es-MX":"Estudios Esturión", fr:"Tentatec Studio", ru:"Студия «Анчоус»"},
  22: {en:"Skipper Pavilion", "es-ES":"Puerta del Gobio", "es-MX":"Puerta del Gobio", fr:"Lagune aux gobies", ru:"Павильон «Шкипер»"}
};
const SALMON_NAMES = {
  5000: {en:"Spawning Grounds", "es-ES":"Presa salmónida", "es-MX":"Presa salmónida", fr:"Barrage salmonoïde", ru:"Нерестилище"},
  5001: {en:"Marooner's Bay", "es-ES":"Bahía Deriva", "es-MX":"Bahía Deriva", fr:"Épave des braves", ru:"Бухта «Мародер»"},
  5002: {en:"Lost Outpost", "es-ES":"Caserón Salitre", "es-MX":"Caserón Salitre", fr:"Baraque barracuda", ru:"Забытый форпост"},
  5003: {en:"Salmonid Smokeyard", "es-ES":"Ensenada Ahumada", "es-MX":"Ensenada Ahumada", fr:"Fumoir Sans-Espoir", ru:"Коптильня"},
  5004: {en:"Ruins of Ark Polaris", "es-ES":"Lanzadera Polaris", "es-MX":"Lanzadera Polaris", fr:"Station Polaris", ru:"Руины «Арк Полярис»"}
};

// Couleur de la scrollbar de la modale selon le mode (comme les cartes).
const MODE_SB = {
    friendly:  { sb: "linear-gradient(180deg,#7bec5a,#28a744)", ff: "#0bb80b" }, // vert
    ranked:    { sb: "linear-gradient(180deg,#ffb03a,#ef7c10)", ff: "#ff6000" }, // orange
    league:    { sb: "linear-gradient(180deg,#ff5c9a,#d6246a)", ff: "#e6005c" }, // rose
    splatfest: { sb: "linear-gradient(180deg,#00d0c8,#7b2ff7)", ff: "#00d0c8" }, // cyan/violet
    salmon:    { sb: "linear-gradient(180deg,#ff7a1f,#e06612)", ff: "#e06612" }  // salmon
};

// Traducciones del footer (disclaimer + crédit + libellés autour des liens).
const FOOTER_I18N = {
    "es-MX": { disc: "Este sitio no está afiliado a Nintendo. Todos los nombres de productos, logotipos y marcas pertenecen a sus respectivos propietarios.", pre: "Calendario original de", mid: "alojado por", post: "diseño basado en" },
    "es-ES": { disc: "Este sitio no está afiliado a Nintendo. Todos los nombres de productos, logotipos y marcas pertenecen a sus respectivos propietarios.", pre: "Calendario original de", mid: "alojado por", post: "diseño basado en" },
    en: { disc: "This site is not affiliated with Nintendo. All product names, logos and brands are property of their respective owners.", pre: "Original calendar by", mid: "hosted by", post: "design based on" },
    fr: { disc: "Ce site n'est pas affilié à Nintendo. Tous les noms de produits, logos et marques appartiennent à leurs propriétaires respectifs.", pre: "Calendrier original par", mid: "hébergé par", post: "design repris de" },
    pt: { disc: "Este site não é afiliado à Nintendo. Todos os nomes de produtos, logotipos e marcas pertencem aos seus respectivos proprietários.", pre: "Calendário original de", mid: "hospedado por", post: "design baseado em" },
    ru: { disc: "Этот сайт не связан с Nintendo. Все названия продуктов, логотипы и бренды являются собственностью их соответствующих владельцев.", pre: "Оригинальный календарь от", mid: "хостинг от", post: "дизайн на основе" }
};

// Idioma actual del selector (es-MX / es-ES / en / fr / pt / ru).
function getLang() {
    const sel = document.getElementById("languageSelect");
    return sel ? sel.value : "es-MX";
}

// Nombre OFICIAL del escenario según el idioma; fallback: en -> nombre de la API.
function stageName(id, apiName) {
    const t = STAGE_NAMES[id] || SALMON_NAMES[id];
    if (!t) return apiName;
    const lang = getLang();
    return t[lang] || t["es-ES"] || t.en || apiName;
}

// Convierte UN slot de la API al objeto del sitio: mapas, regla REAL y horarios (UTC).
function mapSlot(rot) {
    const rk = (rot.rule && rot.rule.key) ? rot.rule.key : "turf_war";
    return {
        map1: { name: rot.stages[0].name, image: rot.stages[0].image, id: rot.stages[0].id },
        map2: { name: rot.stages[1].name, image: rot.stages[1].image, id: rot.stages[1].id },
        ruleKey: RULE_KEY_MAP[rk] || "turf",
        ruleName: (rot.rule && rot.rule.name) ? rot.rule.name : "Turf War",
        start: rot.start_time,   // unix segundos UTC
        end: rot.end_time        // unix segundos UTC
    };
}

// =========================================================================
// 1. CARGAR DATOS DESDE LA API DE NEXTENDO NETWORK (fetch DIRECTO — CORS activo)
// =========================================================================

let _fetching = false;
let _lastFetch = 0;

async function fetchOnlineRotations() {
    if (_fetching) return;              // evita fetch solapados
    _fetching = true;
    try {
        const response = await fetch("https://nextendo.network/api/splatoon2/rotation", { cache: "no-store" });
        if (!response.ok) throw new Error(`Error en la red: ${response.status} ${response.statusText}`);
        const data = await response.json();

        if (data.regular) onlineRotationsData.turfWarRotations = data.regular.map(mapSlot);
        if (data.ranked)  onlineRotationsData.rankedBattleRotations = data.ranked.map(mapSlot);
        if (data.league)  onlineRotationsData.leagueBattleRotations = data.league.map(mapSlot);

        if (data.splatfest) {
            isSplatfestActive = true;
            onlineRotationsData.splatfestRotations = data.splatfest.map(mapSlot);
        } else {
            isSplatfestActive = false;
        }

        _lastFetch = Date.now();
        refreshAllRotations();
    } catch (error) {
        console.error("Error al obtener las rotaciones desde la API:", error);
    } finally {
        _fetching = false;
    }
}


// =========================================================================
// 3. ACTUALIZAR ROTACIÓN DE CADA MODO EN PANTALLA PRINCIPAL
// =========================================================================

function updateModeRotation(rotationsArray, prefix, timerId) {
    if (!rotationsArray || rotationsArray.length === 0) return;

    const activeRotation = rotationsArray[0];
    const nextRotation = rotationsArray[1] || rotationsArray[0];

    const setMap = (imgId, nameId, map) => {
        const nm = stageName(map.id, map.name);   
        const img = document.getElementById(imgId);
        const name = document.getElementById(nameId);
        if (img) { img.src = map.image; img.alt = nm; }   
        if (name) name.innerText = nm;
    };
    setMap(`${prefix}-curr-map1`, `${prefix}-curr-name1`, activeRotation.map1);
    setMap(`${prefix}-curr-map2`, `${prefix}-curr-name2`, activeRotation.map2);
    setMap(`${prefix}-next-map1`, `${prefix}-next-name1`, nextRotation.map1);
    setMap(`${prefix}-next-map2`, `${prefix}-next-name2`, nextRotation.map2);

    updateCountdown(activeRotation.end * 1000, timerId);

    const longPrefix = timerId.replace("-timer", "");   
    const curTime = document.getElementById(`${longPrefix}-current-time`);
    if (curTime) curTime.innerText = formatHourRange(activeRotation.start, activeRotation.end);
    const nextRange = document.getElementById(`${longPrefix}-next-time-range`);
    if (nextRange) nextRange.innerText = formatHourRange(nextRotation.start, nextRotation.end);
}


// =========================================================================
// 4. CUENTA REGRESIVA TRADUCIDA
// =========================================================================

function updateCountdown(targetTime, timerElementId) {
    const timer = document.getElementById(timerElementId);
    if (!timer) return;

    const diff = targetTime - Date.now();
    if (diff <= 0) {
        timer.innerText = "...";
        return;
    }

    const selector = document.getElementById("languageSelect");
    const lang = selector ? selector.value : "es-MX";
    const t = translations[lang] || translations["es-MX"];
    const u = t.units || { d: "d", h: "h", m: "m", s: "s" };

    let totalSeconds = Math.floor(diff / 1000);
    const days = Math.floor(totalSeconds / 86400);
    totalSeconds %= 86400;
    const hours = Math.floor(totalSeconds / 3600);
    totalSeconds %= 3600;
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    if (days > 0) {
        timer.innerText = `${t.inPrefix} ${days}${u.d} ${hours}${u.h} ${minutes}${u.m}`;
    } else if (hours > 0) {
        timer.innerText = `${t.inPrefix} ${hours}${u.h} ${minutes}${u.m} ${seconds}${u.s}`;
    } else {
        timer.innerText = `${t.inPrefix} ${minutes}${u.m} ${seconds}${u.s}`;
    }
}


// =========================================================================
// 5. MODAL DE PRÓXIMAS ROTACIONES
// =========================================================================

function openUpcomingModal(mode) {
    const modal = document.getElementById("upcomingModal");
    const container = document.getElementById("modalListContainer");
    if (!modal || !container) return;

    const sbHost = document.getElementById("modalScrollContainer");
    const sb = MODE_SB[mode] || MODE_SB.friendly;
    if (sbHost) {
        sbHost.style.setProperty("--sb", sb.sb);
        sbHost.style.setProperty("--sb-ff", sb.ff);
    }

    const selector = document.getElementById("languageSelect");
    const lang = selector ? selector.value : "es-MX";
    const t = translations[lang] || translations["es-MX"];

    if (mode === "salmon") {
        const rotationsArray = typeof salmonRotations !== "undefined" ? salmonRotations : [];
        if (rotationsArray.length === 0) return;

        const totalToShow = Math.min(20, rotationsArray.length);
        let htmlContent = "";

        for (let i = 0; i < totalToShow; i++) {
            const ev = rotationsArray[i];
            const dateRange = typeof formatSalmonDate === "function" ? formatSalmonDate(ev.start, ev.end) : "";
            const sName = typeof stageName === "function" ? stageName(ev.stage.id, ev.stage.name) : ev.stage.name;
            const stageImg = ev.stage.image || "";

            let wepsHtml = '';
            for (let w = 0; w < 4; w++) {
                let wep = (ev.weapons && ev.weapons[w]) ? ev.weapons[w] : { name: "Random", image: "armas/Random.png" };
                let finalImg = wep.image || "armas/Random.png";
                wepsHtml += `
                    <div class="weapon-item" style="width: 68px !important; height: 68px !important; min-width: 68px !important; min-height: 68px !important; max-width: 68px !important; max-height: 68px !important; background: rgba(0,0,0,0.5); border-radius: 50% !important; padding: 6px; display: flex !important; align-items: center !important; justify-content: center !important; border: 2px solid rgba(255,255,255,0.15); overflow: hidden; box-sizing: border-box;">
                        <img src="${finalImg}" alt="${wep.name}" style="width: 100% !important; height: 100% !important; object-fit: contain !important; border: none !important; outline: none !important; background: transparent !important; filter: drop-shadow(2px 2px 2px rgba(0,0,0,0.8));">
                    </div>
                `;
            }

            // Nombre del mapa abajo de la imagen y fecha limpia arriba
            htmlContent += `
                <div class="modal-rotation-block" style="padding-bottom: 12px; margin-bottom: 15px; text-align: center; width: 100%; box-sizing: border-box;">
                    <div class="modal-time-slot" style="font-weight: bold; margin-bottom: 8px; color: #fce300; font-size: 1.0rem; font-family: var(--sb-ff, inherit);">
                        ${dateRange} ${i === 0 ? `(${t.current})` : ""}
                    </div>
                    <div style="display: flex; flex-direction: column; align-items: center; gap: 12px;">
                        <div class="modal-map-preview" style="text-align: center;">
                            ${stageImg ? `<img class="map-img" src="${stageImg}" alt="${sName}" style="width: 100%; max-width: 240px; aspect-ratio: 16/9; object-fit: cover; height: auto;">` : ''}
                            <div style="font-size: 1.1em; font-weight: bold; color: #fff; margin-top: 6px; margin-bottom: 4px;">${sName}</div>
                        </div>
                        <div style="display: flex; justify-content: center; gap: 8px; margin-bottom: 10px;">
                            ${wepsHtml}
                        </div>
                    </div>
                </div>
            `;
        }

        container.innerHTML = htmlContent;
        modal.style.display = "flex";
        return;
    }

    let rotationsArray = [];
    if (mode === "friendly") rotationsArray = onlineRotationsData.turfWarRotations;
    else if (mode === "ranked") rotationsArray = onlineRotationsData.rankedBattleRotations;
    else if (mode === "league") rotationsArray = onlineRotationsData.leagueBattleRotations;
    else if (mode === "splatfest") rotationsArray = onlineRotationsData.splatfestRotations;

    if (rotationsArray.length === 0) return;

    const totalToShow = Math.min(20, rotationsArray.length);
    let htmlContent = "";

    for (let i = 0; i < totalToShow; i++) {
        const rotation = rotationsArray[i];
        const slotStartTime = new Date(rotation.start * 1000);
        const slotEndTime = new Date(rotation.end * 1000);

        const timeString = `${formatDateHour(slotStartTime)} – ${formatDateHour(slotEndTime)}`;
        const ruleName = t.modes[rotation.ruleKey] || rotation.ruleName;
        
        const n1 = stageName(rotation.map1.id, rotation.map1.name);
        const n2 = stageName(rotation.map2.id, rotation.map2.name);

        htmlContent += `
            <div class="modal-rotation-block" style="padding-bottom: 12px; margin-bottom: 15px; text-align: center;">
                <div class="modal-time-slot" style="font-weight: bold; margin-bottom: 8px; color: #fce300; font-size: 1.0rem; font-family: var(--sb-ff, inherit);">
                    ${timeString} ${i === 0 ? `(${t.current})` : ""} - ${ruleName}
                </div>
                <div style="display: flex; flex-direction: column; align-items: center; gap: 12px;">
                    <div class="modal-map-preview" style="text-align: center;">
                        <img class="map-img" src="${rotation.map1.image}" alt="${n1}" style="width: 100%; max-width: 240px; aspect-ratio: 16/9; object-fit: cover; height: auto;">
                        <p style="font-size: 1.2em; font-weight: bold; margin-top: 4px; margin-bottom: 4px;">${n1}</p>
                    </div>
                    <div class="modal-map-preview" style="text-align: center;">
                        <img class="map-img" src="${rotation.map2.image}" alt="${n2}" style="width: 100%; max-width: 240px; aspect-ratio: 16/9; object-fit: cover; height: auto;">
                        <p style="font-size: 1.2em; font-weight: bold; margin-top: 4px; margin-bottom: 4px;">${n2}</p>
                    </div>
                </div>
            </div>
        `;
    }

    container.innerHTML = htmlContent;
    modal.style.display = "flex";
}
function closeUpcomingModal() {
    const modal = document.getElementById("upcomingModal");
    if (modal) {
        modal.style.display = "none";
    }
}

function formatDateHour(date) {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${month}/${day} ${hours}:${minutes}`;
}

function formatHm(d) {
    return d.getHours() + ":" + d.getMinutes().toString().padStart(2, '0');
}
function formatHourRange(startSec, endSec) {
    const s = new Date(startSec * 1000), e = new Date(endSec * 1000);
    return formatHm(s) + " – " + formatHm(e);
}

// =========================================================================
// 6. ACTUALIZAR TODOS LOS MODOS Y SUS NOMBRES TRADUCIDOS
// =========================================================================

function refreshAllRotations() {
    updateModeRotation(onlineRotationsData.turfWarRotations, "f", "friendly-timer");
    updateModeRotation(onlineRotationsData.rankedBattleRotations, "r", "ranked-timer");
    updateModeRotation(onlineRotationsData.leagueBattleRotations, "l", "league-timer");

    const sfClosedBanner = document.getElementById("splatfest-closed-banner");
    const sfContainer = document.getElementById("splatfest-container");

    if (isSplatfestActive && onlineRotationsData.splatfestRotations && onlineRotationsData.splatfestRotations.length > 0) {
        if (sfClosedBanner) sfClosedBanner.style.display = "none";
        if (sfContainer) sfContainer.style.display = "block";
        updateModeRotation(onlineRotationsData.splatfestRotations, "sf", "splatfest-timer");
    } else {
        if (sfClosedBanner) sfClosedBanner.style.display = "block";
        if (sfContainer) sfContainer.style.display = "none";
    }

    if (typeof updateSalmonRunDynamic === "function") {
        updateSalmonRunDynamic();
    }

    const selector = document.getElementById("languageSelect");
    const lang = selector ? selector.value : "es-MX";
    const t = translations[lang] || translations["es-MX"];

    const ranked = onlineRotationsData.rankedBattleRotations;
    const league = onlineRotationsData.leagueBattleRotations;
    const turf = onlineRotationsData.turfWarRotations; // <-- Obtenemos turf

    const setRule = (id, arr, idx) => {
        const el = document.getElementById(id);
        if (el && arr[idx]) el.innerText = t.modes[arr[idx].ruleKey] || arr[idx].ruleName;
    };
    
    setRule("ranked-current-rule", ranked, 0);
    setRule("ranked-next-rule", ranked, 1);
    setRule("league-current-rule", league, 0);
    setRule("league-next-rule", league, 1);

    // <-- Añadimos esto para que Territorial cargue al mismo tiempo que los demás
    const setTurfRule = (id, arr, idx) => {
        const el = document.getElementById(id);
        if (el && arr[idx]) el.innerText = t.modes.turf;
    };
    setTurfRule("friendly-current-rule", turf, 0);
    setTurfRule("friendly-next-rule", turf, 1);

    const nowSec = Date.now() / 1000;
    if (turf.length && (nowSec >= turf[0].end || Date.now() - _lastFetch > 5 * 60 * 1000)) {
        fetchOnlineRotations();
    }
}

// =========================================================================
// 7. SISTEMA DE TRADUCCIÓN E IDIOMA (ES-MX, ES-ES, EN, FR, PT, RU)
// =========================================================================

const translations = {
    "es-MX": {
        title: "NEXTENDO NETWORK / SPLATOON 2",
        turfTitle: "Combate amistoso",
        rankedTitle: "Combate competitivo",
        leagueTitle: "Combate de liga",
        splatfestTitle: "Splatfest",
        salmonTitle: "Salmon Run",
        moreInfo: "Salas disponibles",
        current: "Actual",
        next: "Próximos",
        inPrefix: "en",
        opensIn: "Abre en",
        remainingLabel: "Restante: ",
        units: { d: "d", h: "h", m: "m", s: "s" },
        statusOpen: "Abierto",
        statusClosed: "Cerrado",
        btnUpcoming: "⬆️​ Próximas Rotaciones",
        salmonUpcoming: "⬆️​ Próximas Rotaciones",
        weaponsLabel: "Armas disponibles",
        modalTitle: "Próximas Rotaciones",
        modalClose: "Cerrar",
        splatfestClosed: "Cerrado / Próximamente",
        modes: {
            turf: "Territorial",
            splatZones: "Pintazonas",
            towerControl: "Torreón",
            rainmaker: "Pez Dorado",
            clamBlitz: "Asalto Almeja",
            splatfestSolo: "Splatfest (Desafío)",
            splatfestTeam: "Splatfest (General)"
        }
    },
    "es-ES": {
        title: "NEXTENDO NETWORK / SPLATOON 2",
        turfTitle: "Amistoso",
        rankedTitle: "Competitivo",
        leagueTitle: "Torneo",
        splatfestTitle: "Splatfest",
        salmonTitle: "Salmon Run",
        moreInfo: "Salas disponibles",
        current: "Actual",
        next: "Próximo",
        inPrefix: "en",
        opensIn: "Abre en",
        remainingLabel: "Restante: ",
        units: { d: "d", h: "h", m: "m", s: "s" },
        statusOpen: "Abierto",
        statusClosed: "Cerrado",
        btnUpcoming: "⬆️​ Próximas Rotaciones",
        salmonUpcoming: "⬆️​ Próximas Rotaciones",
        weaponsLabel: "Armas asignadas",
        modalTitle: "Próximas Rotaciones",
        modalClose: "Cerrar",
        splatfestClosed: "Cerrado / Próximamente",
        modes: {
            turf: "Territorial",
            splatZones: "Pintazonas",
            towerControl: "Torre",
            rainmaker: "Pez Dorado",
            clamBlitz: "Asalto Almeja",
            splatfestSolo: "Splatfest (Desafío)",
            splatfestTeam: "Splatfest (General)"
        }
    },
    en: {
        title: "NEXTENDO NETWORK / SPLATOON 2",
        turfTitle: "Regular Battle",
        rankedTitle: "Ranked Battle",
        leagueTitle: "League Battle",
        splatfestTitle: "Splatfest",
        salmonTitle: "Salmon Run",
        moreInfo: "Rooms available",
        current: "Current",
        next: "Next",
        inPrefix: "in",
        opensIn: "Opens in",
        remainingLabel: "Remaining: ",
        units: { d: "d", h: "h", m: "m", s: "s" },
        statusOpen: "Open",
        statusClosed: "Closed",
        btnUpcoming: "⬆️​ Upcoming Rotations",
        salmonUpcoming: "⬆️​ Upcoming Rotations",
        weaponsLabel: "Assigned weapons",
        modalTitle: "Upcoming Rotations",
        modalClose: "Close",
        splatfestClosed: "Closed / Coming Soon",
        modes: {
            turf: "Turf War",
            splatZones: "Splat Zones",
            towerControl: "Tower Control",
            rainmaker: "Rainmaker",
            clamBlitz: "Clam Blitz",
            splatfestSolo: "Splatfest (Pro)",
            splatfestTeam: "Splatfest (Normal)"
        }
    },
    fr: {
        title: "NEXTENDO NETWORK / SPLATOON 2",
        turfTitle: "Match classique",
        rankedTitle: "Match pro",
        leagueTitle: "Match en ligue",
        splatfestTitle: "Splatfest",
        salmonTitle: "Salmon Run",
        moreInfo: "Salons disponibles",
        current: "Actuel",
        next: "Prochain",
        inPrefix: "dans",
        opensIn: "Ouvre dans",
        remainingLabel: "Restant : ",
        units: { d: "j", h: "h", m: "m", s: "s" },
        statusOpen: "Ouvert",
        statusClosed: "Fermé",
        btnUpcoming: "⬆️​ Prochaines rotations",
        salmonUpcoming: "⬆️​ Prochaines rotations",
        weaponsLabel: "Armes attribuées",
        modalTitle: "Prochaines rotations",
        modalClose: "Fermer",
        splatfestClosed: "Fermé / Bientôt disponible",
        modes: {
            turf: "Guerre de territoire",
            splatZones: "Zone de contrôle",
            towerControl: "Expédition risquée",
            rainmaker: "Mission Bazookarpe",
            clamBlitz: "Pluie de palourdes",
            splatfestSolo: "Splatfest (Défi)",
            splatfestTeam: "Splatfest (Ouvert)"
        }
    },
    pt: {
        title: "NEXTENDO NETWORK / SPLATOON 2",
        turfTitle: "Batalha regular",
        rankedTitle: "Batalha do ranking",
        leagueTitle: "Batalha de liga",
        splatfestTitle: "Splatfest",
        salmonTitle: "Salmon Run",
        moreInfo: "Salas disponíveis",
        current: "Atual",
        next: "Próximo",
        inPrefix: "em",
        opensIn: "Abre em",
        remainingLabel: "Restante: ",
        units: { d: "d", h: "h", m: "m", s: "s" },
        statusOpen: "Aberto",
        statusClosed: "Fechado",
        btnUpcoming: "⬆️​ Próximas rotações",
        salmonUpcoming: "⬆️​ Próximas rotações",
        weaponsLabel: "Armas atribuídas",
        modalTitle: "Próximas rotações",
        modalClose: "Fechar",
        splatfestClosed: "Fechado / Em breve",
        modes: {
            turf: "Batalha territorial",
            splatZones: "Mancha de tinta",
            towerControl: "Torre da disputa",
            rainmaker: "Pequeno peixe",
            clamBlitz: "Fechamento de conchas",
            splatfestSolo: "Splatfest (Desafio)",
            splatfestTeam: "Splatfest (Normal)"
        }
    },
    ru: {
        title: "NEXTENDO NETWORK / SPLATOON 2",
        turfTitle: "Бой за территории",
        rankedTitle: "Профессиональный бой",
        leagueTitle: "Командный бой",
        splatfestTitle: "Сплэтфест",
        salmonTitle: "Salmon Run",
        moreInfo: "Доступные комнаты",
        current: "Текущие",
        next: "Следующие",
        inPrefix: "через",
        opensIn: "Откроется через",
        remainingLabel: "Осталось: ",
        units: { d: "д", h: "ч", m: "м", s: "с" },
        statusOpen: "Открыто",
        statusClosed: "Закрыто",
        btnUpcoming: "⬆️​ Расписание наперед",
        salmonUpcoming: "⬆️​ Расписание наперед",
        weaponsLabel: "Табельное оружие",
        modalTitle: "Расписание наперед",
        modalClose: "Закрыть",
        splatfestClosed: "Закрыто / Скоро",
        modes: {
            turf: "Бой за территории",
            splatZones: "Бой за зоны",
            towerControl: "Бой за башни",
            rainmaker: "Удержание мегамозга",
            clamBlitz: "Футбольный матч с ракушками",
            splatfestSolo: "Сплэтфест (Вызов)",
            splatfestTeam: "Сплэтфест (Обычный)"
        }
    }
};

function changeLanguage() {
    const selector = document.getElementById("languageSelect");
    if (!selector) return;

    const lang = selector.value;
    try { localStorage.setItem("nextendo_lang", lang); } catch (e) { /* localStorage indisponible */ }
    const t = translations[lang] || translations["es-MX"];

    const mainTitle = document.getElementById("main-title");
    if (mainTitle) mainTitle.innerText = t.title;

    const turfTitle = document.getElementById("txt-turf-title");
    if (turfTitle) turfTitle.innerText = t.turfTitle;

    const rankedTitle = document.getElementById("txt-ranked-title");
    if (rankedTitle) rankedTitle.innerText = t.rankedTitle;

    const btnSalmonUpcoming = document.getElementById("txt-btn-upcoming-salmon");
    if (btnSalmonUpcoming) {
        btnSalmonUpcoming.innerText = t.salmonUpcoming;
    }

    const leagueTitle = document.getElementById("txt-league-title");
    if (leagueTitle) leagueTitle.innerText = t.leagueTitle;

    const splatfestTitle = document.getElementById("txt-splatfest-title");
    if (splatfestTitle) splatfestTitle.innerText = t.splatfestTitle;

    const salmonTitle = document.getElementById("txt-salmon-title");
    if (salmonTitle) salmonTitle.innerText = t.salmonTitle;

    const splatfestClosed = document.querySelector("#splatfest-closed-banner span");
    if (splatfestClosed) splatfestClosed.innerText = t.splatfestClosed;

    const salmonBadge = document.getElementById("salmon-status-badge");
    if (salmonBadge) {
        const currentText = salmonBadge.innerText.trim().toLowerCase();
        if (["abierto", "open", "ouvert", "aberto", "открыто"].includes(currentText)) {
            salmonBadge.innerText = t.statusOpen;
        } else {
            salmonBadge.innerText = t.statusClosed;
        }
    }

    const salmonCurTime = document.getElementById("salmon-current-time");
    if (salmonCurTime) salmonCurTime.innerText = t.current;
    
const salmonCurTag = document.getElementById("txt-salmon-current");
    if (salmonCurTag) {
        salmonCurTag.innerText = lang.startsWith("es") 
            ? "¡" + t.statusOpen + "!" 
            : t.statusOpen + "!";
    }

    ["txt-next", "txt-next2", "txt-next3", "txt-next4", "txt-salmon-next"].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.innerText = t.next;
    });

    ["txt-btn-upcoming-1", "txt-btn-upcoming-2", "txt-btn-upcoming-3", "txt-btn-upcoming-4"].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.innerText = t.btnUpcoming;
    });

    const modalTitle = document.getElementById("modal-upcoming-title");
    if (modalTitle) modalTitle.innerText = t.modalTitle;

    const modalClose = document.getElementById("txt-modal-close");
    if (modalClose) modalClose.innerText = t.modalClose;

    const weaponsLabel = document.getElementById("txt-weapons-label");
    if (weaponsLabel) weaponsLabel.innerText = t.weaponsLabel;

    const navMoreInfo = document.getElementById("nav-moreinfo");
    if (navMoreInfo) navMoreInfo.innerText = t.moreInfo;
    const navSplatfest = document.getElementById("nav-splatfest");
    if (navSplatfest) navSplatfest.innerText = t.splatfestTitle;

    const fi = FOOTER_I18N[lang] || FOOTER_I18N["es-MX"];
    const fDisc = document.querySelector(".nx-footer-disc");
    if (fDisc) fDisc.innerText = fi.disc;
    const fCredit = document.querySelector(".nx-footer-credit");
    if (fCredit) fCredit.innerHTML =
        fi.pre + ' <a href="https://github.com/darkaether-nova" target="_blank" rel="noopener">darkaether-nova</a>'
        + ' &nbsp;·&nbsp; ' + fi.mid + ' <strong>Nextendo&nbsp;Network</strong>'
        + ' &nbsp;·&nbsp; ' + fi.post + ' <a href="https://splatoon2.ink" target="_blank" rel="noopener">splatoon2.ink</a>';

    const langBtnLabel = document.getElementById("langBtnLabel");
    if (langBtnLabel) {
        const o = [...selector.options].find(o => o.value === lang);
        langBtnLabel.textContent = o ? o.text : lang;
    }
    document.querySelectorAll("#langMenu li[data-lang]").forEach(li =>
        li.setAttribute("aria-selected", li.dataset.lang === lang ? "true" : "false"));

    refreshAllRotations();
}


// =========================================================================
// LIGHTBOX (image en grand au clic sur une map)
// =========================================================================

function openImgLightbox(src, caption) {
    const box = document.getElementById("imgLightbox");
    const img = document.getElementById("imgLightboxImg");
    const cap = document.getElementById("imgLightboxCap");
    if (!box || !img) return;
    img.src = src;
    img.alt = caption || "";
    const deg = (Math.random() < 0.5 ? -1 : 1) * (1 + Math.random() * 1);
    img.style.transform = "rotate(" + deg.toFixed(1) + "deg)";
    if (cap) cap.innerText = caption || "";
    box.classList.add("open");
}

function closeImgLightbox() {
    const box = document.getElementById("imgLightbox");
    if (box) box.classList.remove("open");
}

// Idioma: localStorage sinon langue du NAVIGATEUR. es-MX / es-ES / en / fr / pt / ru.
function detectLanguage() {
    const supported = ["es-MX", "es-ES", "en", "fr", "pt", "ru"];
    try {
        const saved = localStorage.getItem("nextendo_lang");
        if (saved && supported.includes(saved)) return saved;
    } catch (e) { /* localStorage indisponible */ }
    
    const nav = (navigator.language || navigator.userLanguage || "en").toLowerCase();
    if (nav.startsWith("ru")) return "ru";
    if (nav.startsWith("es")) {
        return nav.includes("mx") || nav.includes("lat") || nav.includes("ar") || nav.includes("co") ? "es-MX" : "es-ES";
    }
    const shortNav = nav.slice(0, 2);
    return supported.includes(shortNav) ? shortNav : "en";
}

// =========================================================================
// INICIO Y EVENTOS
// =========================================================================

document.addEventListener("DOMContentLoaded", () => {
    const sel = document.getElementById("languageSelect");
    if (sel) sel.value = detectLanguage();

    changeLanguage();
    fetchOnlineRotations();
    setInterval(refreshAllRotations, 1000);

    window.addEventListener("click", (event) => {
        const modal = document.getElementById("upcomingModal");
        if (event.target === modal) closeUpcomingModal();
    });

    document.addEventListener("click", (event) => {
        const el = event.target;
        if (el && el.tagName === "IMG" && el.classList.contains("map-img") && el.getAttribute("src")) {
            openImgLightbox(el.src, el.alt || "");
        }
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") closeImgLightbox();
    });
});