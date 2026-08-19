// =========================================================================
// SALMON RUN: INTEGRACIÓN CON NEXTENDO API Y SOPORTE MULTIIDIOMA
// =========================================================================

let salmonRotations = [];

// Textos de estado y apertura traducidos
const salmonTexts = {
    "es-MX": { closed: "¡Cerrado!", open: "¡Abiertos!", opensAt: "Abre: ", inTime: "en " },
    "es-ES": { closed: "¡Cerrado!", open: "¡Abierto!", opensAt: "Abre: ", inTime: "en " },
    en: { closed: "Closed!", open: "Open!", opensAt: "Opens: ", inTime: "in " },
    fr: { closed: "Fermé !", open: "Ouvert !", opensAt: "Ouvre : ", inTime: "dans " },
    pt: { closed: "Fechado!", open: "Aberto!", opensAt: "Abre: ", inTime: "em " },
    ru: { closed: "Закрыто!", open: "Открыто!", opensAt: "Открывается: ", inTime: "через " }
};

// Mapeo oficial de armas de Splatoon 2 a sus rutas locales de imágenes
const WEAPON_IMAGES = {
    "H-3 Nozzlenose": "armas/H-3 Nozzlenose.png",
    "Splat Brella": "armas/Splat Brella.png",
    "Octobrush": "armas/Octobrush.png",
    "E-liter 4K": "armas/E-liter 4K.png",
    "Luna Blaster": "armas/Luna Blaster.png",
    "L-3 Nozzlenose": "armas/L-3 Nozzlenose.png",
    "Dark Tetra Dualies": "armas/Dark Tetra Dualies.png",
    "Classic Squiffer": "armas/Classic Squiffer.png",
    ".52 Gal": "armas/52 Gal.png",
    "Flingza Roller": "armas/Flingza Roller.png",
    "Glooga Dualies": "armas/Glooga Dualies.png",
    "E-liter 4K Scope": "armas/E-liter 4K Scope.png",
    "Splattershot": "armas/Splattershot.png",
    "Bloblobber": "armas/Bloblobber.png",
    "Splat Roller": "armas/Splat Roller.png",
    "Tenta Brella": "armas/Tenta Brella.png",
    "Random": "armas/Random.png",
    "Splattershot Jr.": "armas/Splattershot Jr.png",
    "Carbon Roller": "armas/Carbon Roller.png",
    "Tri-Slosher": "armas/Tri-Slosher.png",
    "N-ZAP '85": "armas/N-ZAP '85.png",
    "Slosher": "armas/Slosher.png",
    "Rapid Blaster": "armas/Rapid Blaster.png",
    "Rapid Blaster Pro": "armas/Rapid Blaster Pro.png",
    "Jet Squelcher": "armas/Jet Squelcher.png",
    "Blaster": "armas/Blaster.png",
    "Splat Charger": "armas/Splat Charger.png",
    "Heavy Splatling": "armas/Heavy Splatling.png",
    "Splat Dualies": "armas/Splat Dualies.png",
    "Splash-o-matic": "armas/Splash-o-matic.png",
    "Aerospray MG": "armas/Aerospray MG.png",
    "Splattershot Pro": "armas/Splattershot Pro.png",
    ".96 Gal": "armas/96 Gal.png",
    "Clash Blaster": "armas/Clash Blaster.png",
    "Dynamo Roller": "armas/Dynamo Roller.png",
    "Splatterscope": "armas/Splatterscope.png",
    "Goo Tuber": "armas/Goo Tuber.png",
    "Mini Splatling": "armas/Mini Splatling.png",
    "Dapple Dualies": "armas/Dapple Dualies.png",
    "Sploosh-o-matic": "armas/Sploosh-o-matic.png",
    "Range Blaster": "armas/Range Blaster.png",
    "Inkbrush": "armas/Inkbrush.png",
    "Bamboozler 14 Mk I": "armas/Bamboozler 14 Mk I.png",
    "Sloshing Machine": "armas/Sloshing Machine.png",
    "Dualie Squelchers": "armas/Dualie Squelchers.png",
    "Squeezer": "armas/Squeezer.png",
    "Hydra Splatling": "armas/Hydra Splatling.png",
    "Undercover Brella": "armas/Undercover Brella.png",
    "Ballpoint Splatling": "armas/Ballpoint Splatling.png",
    "Explosher": "armas/Explosher.png",
    "Nautilus 47": "armas/Nautilus 47.png"
};

// Formateador que se adapta a la hora local del dispositivo del usuario
function formatSalmonDate(startSec, endSec) {
    const startDate = new Date(startSec * 1000);
    const endDate = new Date(endSec * 1000);

    const startDay = startDate.getDate();
    const startMonth = startDate.getMonth() + 1;
    const startHour = String(startDate.getHours()).padStart(2, '0') + ":00";

    const endDay = String(endDate.getDate()).padStart(2, '0');
    const endMonth = String(endDate.getMonth() + 1).padStart(2, '0');
    const endHour = String(endDate.getHours()).padStart(2, '0') + ":00";

    return `${startDay}/${startMonth} (${startHour}) a ${endDay}/${endMonth} (${endHour})`;
}

// Función auxiliar para formatear la cuenta regresiva (d, h, m, s)
function getCountdownParts(ms, u) {
    if (ms <= 0) return "0m 0s";
    let totalSeconds = Math.floor(ms / 1000);
    const days = Math.floor(totalSeconds / 86400);
    totalSeconds %= 86400;
    const hours = Math.floor(totalSeconds / 3600);
    totalSeconds %= 3600;
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    let res = "";
    if (days > 0) res += `${days}${u.d} `;
    if (days > 0 || hours > 0) res += `${hours}${u.h} `;
    res += `${minutes}${u.m} ${seconds}${u.s}`;
    return res;
}

// Control del sistema de abierto/cerrado
function setSalmonRunStatus(isOpen, openingTimeStr = "") {
    const openView = document.getElementById('salmon-open-view');
    const closedView = document.getElementById('salmon-closed-view');
    const badgeCurrent = document.getElementById('txt-salmon-current');
    const tiempoRestante = document.getElementById('salmon-restante');
    const timeEl = document.getElementById('salmon-time');

    const lang = typeof getLang === "function" ? getLang() : (document.getElementById('languageSelect') ? document.getElementById('languageSelect').value : 'es');
    const tLang = salmonTexts[lang] || salmonTexts.es;

    if (isOpen) {
        if (openView) openView.style.display = 'flex';
        if (closedView) closedView.style.display = 'none';
        if (badgeCurrent) {
            badgeCurrent.textContent = tLang.open;
            badgeCurrent.style.background = "repeating-linear-gradient(45deg, #2ecc71, #2ecc71 10px, #27ae60 10px, #27ae60 20px)";
        }
        if (tiempoRestante) tiempoRestante.style.display = 'block';
    } else {
        if (openView) openView.style.display = 'none';
        if (closedView) {
            closedView.style.display = 'block';
        }
        if (badgeCurrent) {
            badgeCurrent.textContent = tLang.closed;
            badgeCurrent.style.background = "repeating-linear-gradient(45deg, #e74c3c, #e74c3c 10px, #c0392b 10px, #c0392b 20px)";
        }
        if (tiempoRestante) tiempoRestante.style.display = 'none';
        
        if (timeEl && openingTimeStr) {
            timeEl.innerText = openingTimeStr;
        }
    }
}

// Obtener datos de la API de Nextendo
async function fetchSalmonData() {
    try {
        const response = await fetch("https://nextendo.network/api/splatoon2/rotation", { cache: "no-store" });
        if (!response.ok) throw new Error(`Error en la red: ${response.status}`);
        const data = await response.json();

        const rawList = data && (data.salmon_run || data.details || data.schedules);
        
        if (Array.isArray(rawList)) {
            salmonRotations = rawList.map(item => ({
                start: item.start_time,
                end: item.end_time,
                stage: {
                    id: item.stage ? item.stage.id : 5001,
                    name: item.stage ? item.stage.name : "",
                    image: item.stage ? item.stage.image : ""
                },
                weapons: (item.weapons || []).map(w => {
                    let name = typeof w === 'string' ? w : (w && w.name ? (w.name.en || w.name) : "");
                    if (!name || name.trim() === "") {
                        name = "Random";
                    }
                    return {
                        name: name,
                        image: WEAPON_IMAGES[name] || (w && w.image ? w.image : WEAPON_IMAGES["Random"])
                    };
                })
            }));
            updateSalmonRunDynamic();
        }
    } catch (error) {
        console.error("Error al obtener las rotaciones de Salmon Run:", error);
    }
}

function updateSalmonRunDynamic() {
    if (!salmonRotations || salmonRotations.length === 0) return;

    const nowSec = Date.now() / 1000;
    const nowMs = Date.now();

    const lang = typeof getLang === "function" ? getLang() : (document.getElementById('languageSelect') ? document.getElementById('languageSelect').value : 'es');
    const tLang = salmonTexts[lang] || salmonTexts.es;
    const t = (typeof translations !== "undefined" && translations[lang]) ? translations[lang] : translations.es;
    const u = t.units || { d: "d", h: "h", m: "m", s: "s" };

    // BÚSQUEDA INTELIGENTE RESTAURADA: Encuentra el evento activo o el próximo turno válido
    let currentIndex = salmonRotations.findIndex(ev => nowSec < ev.end);
    if (currentIndex === -1) currentIndex = 0;

    const currentEvent = salmonRotations[currentIndex];
    const nextEvents = salmonRotations.slice(currentIndex + 1);

    // Verificar si está abierto
    let isOpen = currentEvent && (nowSec >= currentEvent.start && nowSec < currentEvent.end);

    const subTimerEl = document.getElementById('salmon-sub-timer');

    if (!isOpen) {
        let openingTimeStr = currentEvent ? formatSalmonDate(currentEvent.start, currentEvent.end) : "";
        let timeUntilOpenStr = "";
        
        if (currentEvent) {
            const msUntilStart = (currentEvent.start * 1000) - nowMs;
            timeUntilOpenStr = getCountdownParts(msUntilStart > 0 ? msUntilStart : 0, u);
        }

        setSalmonRunStatus(false, openingTimeStr);

        if (currentEvent) {
            actualizarUIEventoActual(currentEvent, openingTimeStr, false);

            let timerContainer = subTimerEl;
            const closedView = document.getElementById('salmon-closed-view');
            
            if (!timerContainer && closedView) {
                timerContainer = document.createElement('div');
                timerContainer.id = 'salmon-sub-timer';
                timerContainer.style.cssText = "text-align: center; margin-top: 22px; font-size: 1.15rem;";
                closedView.appendChild(timerContainer);
            }

            if (timerContainer) {
                if (timeUntilOpenStr) {
                    timerContainer.innerHTML = `<span style="color: #f1c40f; font-weight: bold; text-shadow: 1px 1px 2px rgba(0,0,0,0.8);">${t.opensIn || tLang.inTime} ${timeUntilOpenStr}</span>`;
                    timerContainer.style.display = "block";
                } else {
                    timerContainer.style.display = "none";
                }
            }
        }
    } else {
        setSalmonRunStatus(true);

        if (subTimerEl) subTimerEl.style.display = "none";

        if (currentEvent) {
            let dateRangeStr = formatSalmonDate(currentEvent.start, currentEvent.end);
            actualizarUIEventoActual(currentEvent, dateRangeStr, true);

            const msLeft = (currentEvent.end * 1000) - nowMs;
            const restanteEl = document.getElementById('salmon-restante');
            
            if (restanteEl) {
                let remainingText = t.remainingLabel || "Restante: ";
                remainingText += getCountdownParts(msLeft, u);
                restanteEl.innerText = remainingText;
            }
        }
    }

    // Renderizar la lista del siguiente evento de forma limpia
    const nextList = document.getElementById('salmon-next-list');
    if (nextList) {
        nextList.innerHTML = nextEvents.slice(0, 1).map((ev) => {
            const dateRange = formatSalmonDate(ev.start, ev.end);
            const sName = typeof stageName === "function" ? stageName(ev.stage.id, ev.stage.name) : ev.stage.name;
            
            const msUntilStart = (ev.start * 1000) - nowMs;
            const timeUntilStr = tLang.inTime + getCountdownParts(msUntilStart > 0 ? msUntilStart : 0, u);

            const timeEl = document.getElementById('salmon-next-time');
            const restEl = document.getElementById('salmon-next-restante');
            if (timeEl) timeEl.textContent = dateRange;
            if (restEl) restEl.textContent = timeUntilStr;

            let wepsHtml = '';
            for (let w = 0; w < 4; w++) {
                let wep = (ev.weapons && ev.weapons[w]) ? ev.weapons[w] : { name: "Random", image: WEAPON_IMAGES["Random"] };
                let imgSrc = wep.image || WEAPON_IMAGES["Random"];
                wepsHtml += `
                    <div class="weapon-item">
                        <img src="${imgSrc}" alt="${wep.name}">
                    </div>
                `;
            }

            return `
                <div class="salmon-current-horizontal" style="margin-bottom: 0;">
                    <div class="salmon-current-map-container">
                        <img src="${ev.stage.image}" class="salmon-current-map-img map-img" alt="${sName}" onclick="openLightbox(this.src, '${sName}')">
                        <span class="map-name">${sName}</span>
                    </div>
                    <div class="salmon-current-info">
                        <p class="salmon-weapons-title" style="margin: 0 0 4px 0; font-size: 0.95rem; text-shadow: 1px 1px 2px rgba(0,0,0,0.8);">${t.weaponsLabel || "Armas disponibles"}</p>
                        <div class="salmon-weapons-row">
                            ${wepsHtml}
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }
}

// Función auxiliar unificada para inyectar mapa y armas
function actualizarUIEventoActual(eventData, dateText, isOpen) {
    const sName = typeof stageName === "function" ? stageName(eventData.stage.id, eventData.stage.name) : eventData.stage.name;

    const mapImg = document.getElementById('salmon-map-img');
    if (mapImg) {
        mapImg.src = eventData.stage.image;
        mapImg.alt = sName;
    }

    const mapName = document.getElementById('salmon-map-name');
    if (mapName) {
        mapName.innerText = sName;
    }

    const timeEl = document.getElementById('salmon-time');
    if (timeEl) {
        timeEl.innerText = dateText;
    }

    for (let w = 0; w < 4; w++) {
        const imgEl = document.getElementById(`salmon-w${w + 1}`);
        if (imgEl) {
            let weaponData = eventData.weapons && eventData.weapons[w];
            if (!weaponData) {
                weaponData = { name: "Random", image: WEAPON_IMAGES["Random"] };
            }
            imgEl.src = weaponData.image || WEAPON_IMAGES["Random"];
            imgEl.alt = weaponData.name;
            imgEl.style.display = "inline-block";
        }
    }
}

// =========================================================================
// INICIALIZACIÓN OPTIMIZADA Y EFICIENTE
// =========================================================================
document.addEventListener("DOMContentLoaded", () => {
    fetchSalmonData(); // Carga inicial al entrar
    
    setInterval(updateSalmonRunDynamic, 1000); // Reloj local en tiempo real
    
    // REDUCIDO: Consultar a la API cada 5 minutos en lugar de 30 para evitar desfases
    setInterval(fetchSalmonData, 5 * 60 * 1000); 

    // NUEVO: Si el usuario cambia de pestaña y regresa, actualiza los datos al instante
    document.addEventListener("visibilitychange", () => {
        if (document.visibilityState === "visible") {
            fetchSalmonData();
        }
    });

    const langSelect = document.getElementById('languageSelect');
    if (langSelect) {
        langSelect.addEventListener('change', () => {
            updateSalmonRunDynamic();
        });
    }
});