// =========================================================================
// CONFIGURACIÓN DE ROTACIÓN GLOBAL Y DATOS ONLINE (NEXTENDO API + PROXY CORS)
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

// =========================================================================
// 1. CARGAR DATOS DESDE LA API DE NEXTENDO NETWORK USANDO PROXY CORS
// =========================================================================

async function fetchOnlineRotations() {
    try {
        // Usamos un proxy público de CORS para evitar el bloqueo del navegador en GitHub Pages
        const targetUrl = "https://nextendo.network/api/splatoon2/rotation";
        const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(targetUrl)}`;

        const response = await fetch(proxyUrl);
        
        if (!response.ok) {
            throw new Error(`Error en la red: ${response.statusText}`);
        }

        const data = await response.json();
        
        if (data.regular) {
            onlineRotationsData.turfWarRotations = data.regular.map(rot => ({
                map1: { name: rot.stages[0].name, image: rot.stages[0].image },
                map2: { name: rot.stages[1].name, image: rot.stages[1].image },
                rule: rot.rule || "turf"
            }));
        }

        if (data.ranked) {
            onlineRotationsData.rankedBattleRotations = data.ranked.map(rot => ({
                map1: { name: rot.stages[0].name, image: rot.stages[0].image },
                map2: { name: rot.stages[1].name, image: rot.stages[1].image },
                rule: rot.rule
            }));
        }

        if (data.league) {
            onlineRotationsData.leagueBattleRotations = data.league.map(rot => ({
                map1: { name: rot.stages[0].name, image: rot.stages[0].image },
                map2: { name: rot.stages[1].name, image: rot.stages[1].image },
                rule: rot.rule
            }));
        }
        
        if (data.splatfest) {
            isSplatfestActive = true;
            onlineRotationsData.splatfestRotations = data.splatfest.map(rot => ({
                map1: { name: rot.stages[0].name, image: rot.stages[0].image },
                map2: { name: rot.stages[1].name, image: rot.stages[1].image },
                rule: rot.rule
            }));
        } else {
            isSplatfestActive = false;
        }

        refreshAllRotations();

    } catch (error) {
        console.error("Error al obtener las rotaciones desde la API:", error);
    }
}


// =========================================================================
// 2. OBTENER BLOQUE ACTUAL Y TIEMPO DE INICIO DE ROTACIÓN (CADA 2 HORAS PARES)
// =========================================================================

function getCurrentSlotStartTime() {
    const now = new Date();
    const startTime = new Date(now);
    const hours = now.getHours();
    
    const currentEvenHour = hours - (hours % 2);
    startTime.setHours(currentEvenHour, 0, 0, 0);
    return startTime;
}

function getRotationSlot() {
    const now = Date.now();
    const anchorDate = new Date(2026, 0, 1, 0, 0, 0, 0).getTime();
    const elapsed = now - anchorDate;
    return Math.floor(elapsed / (2 * 60 * 60 * 1000));
}


// =========================================================================
// 3. ACTUALIZAR ROTACIÓN DE CADA MODO EN PANTALLA PRINCIPAL
// =========================================================================

function updateModeRotation(rotationsArray, prefix, timerId) {
    if (!rotationsArray || rotationsArray.length === 0) return;

    const slot = getRotationSlot();
    const currentIndex = Math.abs(slot) % rotationsArray.length;
    const nextIndex = (currentIndex + 1) % rotationsArray.length;

    const activeRotation = rotationsArray[currentIndex];
    const nextRotation = rotationsArray[nextIndex];

    const currMap1Img = document.getElementById(`${prefix}-curr-map1`);
    const currMap1Name = document.getElementById(`${prefix}-curr-name1`);
    if (currMap1Img) currMap1Img.src = activeRotation.map1.image;
    if (currMap1Name) currMap1Name.innerText = activeRotation.map1.name;

    const currMap2Img = document.getElementById(`${prefix}-curr-map2`);
    const currMap2Name = document.getElementById(`${prefix}-curr-name2`);
    if (currMap2Img) currMap2Img.src = activeRotation.map2.image;
    if (currMap2Name) currMap2Name.innerText = activeRotation.map2.name;

    const nextMap1Img = document.getElementById(`${prefix}-next-map1`);
    const nextMap1Name = document.getElementById(`${prefix}-next-name1`);
    if (nextMap1Img) nextMap1Img.src = nextRotation.map1.image;
    if (nextMap1Name) nextMap1Name.innerText = nextRotation.map1.name;

    const nextMap2Img = document.getElementById(`${prefix}-next-map2`);
    const nextMap2Name = document.getElementById(`${prefix}-next-name2`);
    if (nextMap2Img) nextMap2Img.src = nextRotation.map2.image;
    if (nextMap2Name) nextMap2Name.innerText = nextRotation.map2.name;

    const currentSlotStart = getCurrentSlotStartTime().getTime();
    const nextRotationTime = currentSlotStart + (2 * 60 * 60 * 1000);
    updateCountdown(nextRotationTime, timerId);
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

    const currentSlot = getRotationSlot();
    const currentSlotStart = getCurrentSlotStartTime();
    const totalToShow = Math.min(20, rotationsArray.length);
    let htmlContent = "";

    const selector = document.getElementById("languageSelect");
    const lang = selector ? selector.value : "es";
    const t = translations[lang] || translations.es;

    for (let i = 0; i < totalToShow; i++) {
        const slot = currentSlot + i;
        const rotIndex = Math.abs(slot) % rotationsArray.length;
        const rotation = rotationsArray[rotIndex];

        const slotStartTime = new Date(currentSlotStart.getTime() + (i * 2 * 60 * 60 * 1000));
        const slotEndTime = new Date(slotStartTime.getTime() + (2 * 60 * 60 * 1000));

        const timeString = `${formatDateHour(slotStartTime)} – ${formatDateHour(slotEndTime)}`;

        htmlContent += `
            <div class="modal-rotation-item">
                <div class="modal-time-slot">${timeString} ${i === 0 ? `(${t.current})` : ""}</div>
                <div class="modal-maps-row">
                    <div class="modal-map-preview">
                        <img src="${rotation.map1.image}" alt="${rotation.map1.name}">
                        <p>${rotation.map1.name}</p>
                    </div>
                    <div class="modal-map-preview">
                        <img src="${rotation.map2.image}" alt="${rotation.map2.name}">
                        <p>${rotation.map2.name}</p>
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
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'p.m.' : 'a.m.';
    hours = hours % 12;
    hours = hours ? hours : 12;
    return `${month}/${day} ${hours}:${minutes} ${ampm}`;
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

    const slot = getRotationSlot();
    const rankedCurrKey = rankedModesSequence[slot % rankedModesSequence.length];
    const rankedNextKey = rankedModesSequence[(slot + 1) % rankedModesSequence.length];

    const leagueCurrKey = rankedModesSequence[(slot + 1) % rankedModesSequence.length];
    const leagueNextKey = rankedModesSequence[(slot + 2) % rankedModesSequence.length];

    const elRankedCurr = document.getElementById("ranked-current-rule");
    if (elRankedCurr) elRankedCurr.innerText = t.modes[rankedCurrKey];

    const elRankedNext = document.getElementById("ranked-next-rule");
    if (elRankedNext) elRankedNext.innerText = t.modes[rankedNextKey];

    const elLeagueCurr = document.getElementById("league-current-rule");
    if (elLeagueCurr) elLeagueCurr.innerText = t.modes[leagueCurrKey];

    const elLeagueNext = document.getElementById("league-next-rule");
    if (elLeagueNext) elLeagueNext.innerText = t.modes[leagueNextKey];
}


// =========================================================================
// 7. SISTEMA DE TRADUCCIÓN E IDIOMA
// =========================================================================

const translations = {
    es: {
        title: "NEXTENDO NETWORK / SPLATOON 2",
        turfTitle: "Combate amistoso",
        rankedTitle: "Combate competitivo",
        leagueTitle: "Combate de liga",
        splatfestTitle: "Splatfest",
        salmonTitle: "Salmon Run",
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
    it: {
        title: "NEXTENDO NETWORK / SPLATOON 2",
        turfTitle: "Mischia mollusca",
        rankedTitle: "Partita pro",
        leagueTitle: "Partita a squadre",
        splatfestTitle: "Festival",
        salmonTitle: "Salmon Run",
        current: "Attuale",
        next: "Prossimo",
        inPrefix: "tra",
        remainingLabel: "Rimanente: ",
        units: { d: "g", h: "o", m: "m", s: "s" },
        statusOpen: "Aperto",
        statusClosed: "Chiuso",
        btnUpcoming: "⚙️ Prossimi scenari",
        weaponsLabel: "Armi fornite",
        modalTitle: "Prossime rotazioni",
        modalClose: "Chiudi",
        splatfestClosed: "Chiuso / In arrivo",
        modes: {
            turf: "Mischia mollusca",
            splatZones: "Zona splat",
            towerControl: "Torre mobile",
            rainmaker: "Splattonara",
            clamBlitz: "Splattonnara",
            splatfestSolo: "Festival (Sfida)",
            splatfestTeam: "Festival (Normale)"
        }
    },
    pt: {
        title: "NEXTENDO NETWORK / SPLATOON 2",
        turfTitle: "Batalha regular",
        rankedTitle: "Batalha do ranking",
        leagueTitle: "Batalha de liga",
        splatfestTitle: "Splatfest",
        salmonTitle: "Salmon Run",
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
        if (["abierto", "open", "aperto", "aberto"].includes(currentText)) {
            salmonBadge.innerText = t.statusOpen;
        } else {
            salmonBadge.innerText = t.statusClosed;
        }
    }

    ["friendly-current-time", "ranked-current-time", "league-current-time", "splatfest-current-time", "salmon-current-time", "txt-salmon-current"].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.innerText = t.current;
    });

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

    refreshAllRotations();
}


// =========================================================================
// INICIO Y EVENTOS
// =========================================================================

document.addEventListener("DOMContentLoaded", () => {
    changeLanguage();
    fetchOnlineRotations();
    setInterval(refreshAllRotations, 1000);

    window.addEventListener("click", (event) => {
        const modal = document.getElementById("upcomingModal");
        if (event.target === modal) {
            closeUpcomingModal();
        }
    });
});