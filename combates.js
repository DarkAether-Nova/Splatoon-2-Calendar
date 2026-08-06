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
// pt-BR no existe en Splatoon 2 -> se cae al nombre en inglés.
const STAGE_NAMES = {
  0: {en:"The Reef", es:"Barrio Congrio", fr:"Allées salées"},
  1: {en:"Musselforge Fitness", es:"Gimnasio Mejillón", fr:"Gymnase Ancrage"},
  2: {en:"Starfish Mainstage", es:"Auditorio Erizo", fr:"Scène Sirène"},
  3: {en:"Sturgeon Shipyard", es:"Astillero Beluga", fr:"Chantier Narval"},
  4: {en:"Inkblot Art Academy", es:"Instituto Coralino", fr:"Institut Calam'arts"},
  5: {en:"Humpback Pump Track", es:"Tiburódromo", fr:"Piste Méroule"},
  6: {en:"Manta Maria", es:"Corbeta Corvina", fr:"Manta Maria"},
  7: {en:"Port Mackerel", es:"Puerto Jurel", fr:"Docks Haddock"},
  8: {en:"Moray Towers", es:"Torres Merluza", fr:"Tours Girelle"},
  9: {en:"Snapper Canal", es:"Canal Cormorán", fr:"Canalamar"},
  10: {en:"Kelp Dome", es:"Jardín botánico", fr:"Serre Goémon"},
  11: {en:"Blackbelly Skatepark", es:"Parque Lubina", fr:"Skatepark Mako"},
  12: {en:"Shellendorf Institute", es:"Galería Raspa", fr:"Galerie des abysses"},
  13: {en:"MakoMart", es:"Ultramarinos Orca", fr:"Supermarché Cétacé"},
  14: {en:"Walleye Warehouse", es:"Almacén Rodaballo", fr:"Encrepôt"},
  15: {en:"Arowana Mall", es:"Plazuela del Calamar", fr:"Centre Arowana"},
  16: {en:"Camp Triggerfish", es:"Campamento Arowana", fr:"Hippo-Camping"},
  17: {en:"Piranha Pit", es:"Cantera Tintorera", fr:"Carrière Caviar"},
  18: {en:"Goby Arena", es:"Estadio Ajolote", fr:"Stade Bernique"},
  19: {en:"New Albacore Hotel", es:"Gran Hotel Caviar", fr:"Hôtel Atoll"},
  20: {en:"Wahoo World", es:"Pirañalandia", fr:"Parc Carapince"},
  21: {en:"Ancho-V Games", es:"Estudios Esturión", fr:"Tentatec Studio"},
  22: {en:"Skipper Pavilion", es:"Puerta del Gobio", fr:"Lagune aux gobies"}
};
const SALMON_NAMES = {
  5000: {en:"Spawning Grounds", es:"Presa salmónida", fr:"Barrage salmonoïde"},
  5001: {en:"Marooner's Bay", es:"Bahía Deriva", fr:"Épave des braves"},
  5002: {en:"Lost Outpost", es:"Caserón Salitre", fr:"Baraque barracuda"},
  5003: {en:"Salmonid Smokeyard", es:"Ensenada Ahumada", fr:"Fumoir Sans-Espoir"},
  5004: {en:"Ruins of Ark Polaris", es:"Lanzadera Polaris", fr:"Station Polaris"}
};

// Couleur de la scrollbar de la modale selon le mode (comme les cartes).
const MODE_SB = {
    friendly:  { sb: "linear-gradient(180deg,#7bec5a,#28a744)", ff: "#3fca4f" }, // vert
    ranked:    { sb: "linear-gradient(180deg,#ffb03a,#ef7c10)", ff: "#ff9a2e" }, // orange
    league:    { sb: "linear-gradient(180deg,#ff5c9a,#d6246a)", ff: "#ff3d7f" }, // rose
    splatfest: { sb: "linear-gradient(180deg,#00d0c8,#7b2ff7)", ff: "#00d0c8" }  // cyan/violet
};

// Traductions du footer (disclaimer + crédit + libellés autour des liens).
const FOOTER_I18N = {
    es: { disc: "Este sitio no está afiliado a Nintendo. Todos los nombres de productos, logotipos y marcas pertenecen a sus respectivos propietarios.", pre: "Calendario original de", mid: "alojado por", post: "diseño basado en" },
    en: { disc: "This site is not affiliated with Nintendo. All product names, logos and brands are property of their respective owners.", pre: "Original calendar by", mid: "hosted by", post: "design based on" },
    fr: { disc: "Ce site n'est pas affilié à Nintendo. Tous les noms de produits, logos et marques appartiennent à leurs propriétaires respectifs.", pre: "Calendrier original par", mid: "hébergé par", post: "design repris de" },
    pt: { disc: "Este site não é afiliado à Nintendo. Todos os nomes de produtos, logotipos e marcas pertencem aos seus respectivos proprietários.", pre: "Calendário original de", mid: "hospedado por", post: "design baseado em" }
};

// Idioma actual del selector (es/en/fr/pt).
function getLang() {
    const sel = document.getElementById("languageSelect");
    return sel ? sel.value : "es";
}

// Nombre OFICIAL del escenario según el idioma; fallback: en -> nombre de la API.
function stageName(id, apiName) {
    const t = STAGE_NAMES[id] || SALMON_NAMES[id];
    if (!t) return apiName;
    const lang = getLang();
    return t[lang] || t.en || apiName;
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
        // La API ya envía Access-Control-Allow-Origin:* -> sin proxy tercero.
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
        // Fallo de red/servidor: conservamos los últimos datos válidos; el intervalo reintenta.
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

    // La API ya devuelve el slot ACTUAL en index 0, y los siguientes en orden.
    const activeRotation = rotationsArray[0];
    const nextRotation = rotationsArray[1] || rotationsArray[0];

    const setMap = (imgId, nameId, map) => {
        const nm = stageName(map.id, map.name);   // nombre OFICIAL según idioma
        const img = document.getElementById(imgId);
        const name = document.getElementById(nameId);
        if (img) { img.src = map.image; img.alt = nm; }   // alt = caption de la lightbox
        if (name) name.innerText = nm;
    };
    setMap(`${prefix}-curr-map1`, `${prefix}-curr-name1`, activeRotation.map1);
    setMap(`${prefix}-curr-map2`, `${prefix}-curr-name2`, activeRotation.map2);
    setMap(`${prefix}-next-map1`, `${prefix}-next-name1`, nextRotation.map1);
    setMap(`${prefix}-next-map2`, `${prefix}-next-name2`, nextRotation.map2);

    // Cuenta regresiva hasta el FIN del slot actual (unix UTC de la API).
    updateCountdown(activeRotation.end * 1000, timerId);

    // Plage horaire ABSOLUE en 24h : remplace "Actuel" (slot courant) + le range "suivant"
    // (ces deux éléments n'étaient jamais mis à jour -> heure figée identique partout).
    const longPrefix = timerId.replace("-timer", "");   // friendly / ranked / league / splatfest
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
    const lang = selector ? selector.value : "es";
    const t = translations[lang] || translations.es;
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

    let rotationsArray = [];
    if (mode === "friendly") rotationsArray = onlineRotationsData.turfWarRotations;
    else if (mode === "ranked") rotationsArray = onlineRotationsData.rankedBattleRotations;
    else if (mode === "league") rotationsArray = onlineRotationsData.leagueBattleRotations;
    else if (mode === "splatfest") rotationsArray = onlineRotationsData.splatfestRotations;

    if (rotationsArray.length === 0) return;

    // Couleur de la scrollbar selon le mode (vert/orange/rose…).
    const sbHost = document.getElementById("modalScrollContainer");
    const sb = MODE_SB[mode] || MODE_SB.friendly;
    if (sbHost) {
        sbHost.style.setProperty("--sb", sb.sb);
        sbHost.style.setProperty("--sb-ff", sb.ff);
    }

    const totalToShow = Math.min(20, rotationsArray.length);
    let htmlContent = "";

    const selector = document.getElementById("languageSelect");
    const lang = selector ? selector.value : "es";
    const t = translations[lang] || translations.es;

    for (let i = 0; i < totalToShow; i++) {
        const rotation = rotationsArray[i];
        const slotStartTime = new Date(rotation.start * 1000);
        const slotEndTime = new Date(rotation.end * 1000);

        const timeString = `${formatDateHour(slotStartTime)} – ${formatDateHour(slotEndTime)}`;
        const n1 = stageName(rotation.map1.id, rotation.map1.name);
        const n2 = stageName(rotation.map2.id, rotation.map2.name);

        htmlContent += `
            <div class="modal-rotation-item">
                <div class="modal-time-slot">${timeString} ${i === 0 ? `(${t.current})` : ""}</div>
                <div class="modal-maps-row">
                    <div class="modal-map-preview">
                        <img class="map-img" src="${rotation.map1.image}" alt="${n1}">
                        <p>${n1}</p>
                    </div>
                    <div class="modal-map-preview">
                        <img class="map-img" src="${rotation.map2.image}" alt="${n2}">
                        <p>${n2}</p>
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

// Plage horaire 24h façon splatoon2.ink. Heures non paddées ("0:00", "22:00"). Si la fin
// tombe un autre jour, on préfixe la date de fin (ex: "22:00 – 07/08 0:00").
function formatHm(d) {
    return d.getHours() + ":" + d.getMinutes().toString().padStart(2, '0');
}
function formatHourRange(startSec, endSec) {
    const s = new Date(startSec * 1000), e = new Date(endSec * 1000);
    let endStr = formatHm(e);
    if (s.getDate() !== e.getDate() || s.getMonth() !== e.getMonth() || s.getFullYear() !== e.getFullYear()) {
        endStr = String(e.getDate()).padStart(2, '0') + "/" + String(e.getMonth() + 1).padStart(2, '0') + " " + formatHm(e);
    }
    return formatHm(s) + " – " + endStr;
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
    const lang = selector ? selector.value : "es";
    const t = translations[lang] || translations.es;

    // Las REGLAS vienen de la API por slot (actual = index 0, próximo = index 1),
    // no de una secuencia fija. Traducimos por ruleKey; fallback al nombre de la API.
    const ranked = onlineRotationsData.rankedBattleRotations;
    const league = onlineRotationsData.leagueBattleRotations;
    const setRule = (id, arr, idx) => {
        const el = document.getElementById(id);
        if (el && arr[idx]) el.innerText = t.modes[arr[idx].ruleKey] || arr[idx].ruleName;
    };
    setRule("ranked-current-rule", ranked, 0);
    setRule("ranked-next-rule", ranked, 1);
    setRule("league-current-rule", league, 0);
    setRule("league-next-rule", league, 1);

    // Auto-refresco: cuando el slot actual ya terminó (o cada 5 min), pedimos la
    // ventana fresca a la API para no quedarnos con datos viejos.
    const turf = onlineRotationsData.turfWarRotations;
    const nowSec = Date.now() / 1000;
    if (turf.length && (nowSec >= turf[0].end || Date.now() - _lastFetch > 5 * 60 * 1000)) {
        fetchOnlineRotations();
    }
}


// =========================================================================
// 7. SISTEMA DE TRADUCCIÓN E IDIOMA (ES, EN, FR, PT)
// =========================================================================

const translations = {
    es: {
        title: "NEXTENDO NETWORK / SPLATOON 2",
        turfTitle: "Combate amistoso",
        rankedTitle: "Combate competitivo",
        leagueTitle: "Combate de liga",
        splatfestTitle: "Splatfest",
        salmonTitle: "Salmon Run",
        moreInfo: "Más información",
        current: "Actual",
        next: "Próximo",
        inPrefix: "en",
        remainingLabel: "Restante: ",
        units: { d: "d", h: "h", m: "m", s: "s" },
        statusOpen: "Abierto",
        statusClosed: "Cerrado",
        btnUpcoming: "⚙️ Próximos escenarios",
        weaponsLabel: "Armas disponibles",
        modalTitle: "Próximas Rotaciones",
        modalClose: "Cerrar",
        splatfestClosed: "Cerrado / Próximamente",
        modes: {
            turf: "Territorial",
            splatZones: "Pintazonas",
            towerControl: "Torreón",
            rainmaker: "Pez dorado",
            clamBlitz: "Pezpezuela",
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
        moreInfo: "More info",
        current: "Current",
        next: "Next",
        inPrefix: "in",
        remainingLabel: "Remaining: ",
        units: { d: "d", h: "h", m: "m", s: "s" },
        statusOpen: "Open",
        statusClosed: "Closed",
        btnUpcoming: "⚙️ All Upcoming Stages",
        weaponsLabel: "Supplied Weapons",
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
        moreInfo: "Plus d'infos",
        current: "Actuel",
        next: "Prochain",
        inPrefix: "dans",
        remainingLabel: "Restant : ",
        units: { d: "j", h: "h", m: "m", s: "s" },
        statusOpen: "Ouvert",
        statusClosed: "Fermé",
        btnUpcoming: "⚙️ Prochains terrains",
        weaponsLabel: "Armes fournies",
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
        moreInfo: "Mais informações",
        current: "Atual",
        next: "Próximo",
        inPrefix: "em",
        remainingLabel: "Restante: ",
        units: { d: "d", h: "h", m: "m", s: "s" },
        statusOpen: "Aberto",
        statusClosed: "Fechado",
        btnUpcoming: "⚙️ Próximos estágios",
        weaponsLabel: "Armas disponíveis",
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
    }
};

function changeLanguage() {
    const selector = document.getElementById("languageSelect");
    if (!selector) return;

    const lang = selector.value;
    try { localStorage.setItem("nextendo_lang", lang); } catch (e) { /* localStorage indisponible */ }
    const t = translations[lang] || translations.es;

    const mainTitle = document.getElementById("main-title");
    if (mainTitle) mainTitle.innerText = t.title;

    const turfTitle = document.getElementById("txt-turf-title");
    if (turfTitle) turfTitle.innerText = t.turfTitle;

    const rankedTitle = document.getElementById("txt-ranked-title");
    if (rankedTitle) rankedTitle.innerText = t.rankedTitle;

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
        if (["abierto", "open", "ouvert", "aberto"].includes(currentText)) {
            salmonBadge.innerText = t.statusOpen;
        } else {
            salmonBadge.innerText = t.statusClosed;
        }
    }

    // Les badges "current-time" des modes VS affichent désormais la PLAGE HORAIRE réelle
    // (posée par updateModeRotation), plus "Actuel".
    const salmonCurTime = document.getElementById("salmon-current-time");
    if (salmonCurTime) salmonCurTime.innerText = t.current;
    // Le badge du Salmon Run indique l'ouverture : "Ouvert!" (remplace "Actuel" + l'ancien badge vert).
    const salmonCurTag = document.getElementById("txt-salmon-current");
    if (salmonCurTag) salmonCurTag.innerText = t.statusOpen + "!";

    ["txt-next", "txt-next2", "txt-next3", "txt-next4", "txt-salmon-next"].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.innerText = t.next;
    });

    const friendlyCurrRule = document.getElementById("friendly-current-rule");
    if (friendlyCurrRule) friendlyCurrRule.innerText = t.modes.turf;

    const friendlyNextRule = document.getElementById("friendly-next-rule");
    if (friendlyNextRule) friendlyNextRule.innerText = t.modes.turf;

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

    // Boutons de navigation (haut-droite).
    const navMoreInfo = document.getElementById("nav-moreinfo");
    if (navMoreInfo) navMoreInfo.innerText = t.moreInfo;
    const navSplatfest = document.getElementById("nav-splatfest");
    if (navSplatfest) navSplatfest.innerText = t.splatfestTitle;

    // Footer traduit (disclaimer + crédit + libellés autour des liens ; les liens eux-mêmes fixes).
    const fi = FOOTER_I18N[lang] || FOOTER_I18N.en;
    const fDisc = document.querySelector(".nx-footer-disc");
    if (fDisc) fDisc.innerText = fi.disc;
    const fCredit = document.querySelector(".nx-footer-credit");
    if (fCredit) fCredit.innerHTML =
        fi.pre + ' <a href="https://github.com/darkaether-nova" target="_blank" rel="noopener">darkaether-nova</a>'
        + ' &nbsp;·&nbsp; ' + fi.mid + ' <strong>Nextendo&nbsp;Network</strong>'
        + ' &nbsp;·&nbsp; ' + fi.post + ' <a href="https://splatoon2.ink" target="_blank" rel="noopener">splatoon2.ink</a>';

    // Sélecteur de langue custom : refléter la langue active (libellé du bouton + item sélectionné).
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
    // Inclinaison aléatoire LÉGÈRE (±1 à 2°), comme une photo posée un peu de travers.
    const deg = (Math.random() < 0.5 ? -1 : 1) * (1 + Math.random() * 1);
    img.style.transform = "rotate(" + deg.toFixed(1) + "deg)";
    if (cap) cap.innerText = caption || "";
    box.classList.add("open");
}

function closeImgLightbox() {
    const box = document.getElementById("imgLightbox");
    if (box) box.classList.remove("open");
}

// Idioma: localStorage sinon langue du NAVIGATEUR (comme nextendo.network). es/en/fr/pt.
function detectLanguage() {
    const supported = ["es", "en", "fr", "pt"];
    try {
        const saved = localStorage.getItem("nextendo_lang");
        if (saved && supported.includes(saved)) return saved;
    } catch (e) { /* localStorage indisponible */ }
    const nav = (navigator.language || navigator.userLanguage || "en").slice(0, 2).toLowerCase();
    return supported.includes(nav) ? nav : "en";
}

// =========================================================================
// INICIO Y EVENTOS
// =========================================================================

document.addEventListener("DOMContentLoaded", () => {
    // 1) Langue auto selon le navigateur (avant le 1er rendu).
    const sel = document.getElementById("languageSelect");
    if (sel) sel.value = detectLanguage();

    changeLanguage();
    fetchOnlineRotations();
    setInterval(refreshAllRotations, 1000);

    // 2) Fermer la modale des rotations au clic hors zone.
    window.addEventListener("click", (event) => {
        const modal = document.getElementById("upcomingModal");
        if (event.target === modal) closeUpcomingModal();
    });

    // 3) Clic sur une map (.map-img) -> image en grand.
    document.addEventListener("click", (event) => {
        const el = event.target;
        if (el && el.tagName === "IMG" && el.classList.contains("map-img") && el.getAttribute("src")) {
            openImgLightbox(el.src, el.alt || "");
        }
    });

    // 4) Échap ferme la lightbox.
    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") closeImgLightbox();
    });
});