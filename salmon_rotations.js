const salmonRotations = [
    {
        start: "2026-08-05T00:00:00.000000Z",
        end: "2026-08-06T12:00:00.000000Z",
        stage: { 
            es: "Bahía Deriva", 
            en: "Marooner's Bay", 
            it: "Pala Marina", 
            pt: "Baía Marooner" 
        },
        image: "salmon/S2_Stage_Marooner's_Bay.png",
        weapons: [
            { name: { es: "Ametrallógrafo", en: "Bamboozler 14 Mk I", it: "Splatling", pt: "Splatling" }, image: "armas/Spinner_Downpour_00.png" },
            { name: { es: "Aerógrafo pro", en: "Aerospray MG", it: "Aeropenna", pt: "Aerógrafo" }, image: "armas/Shooter_Blaze_00.png" },
            { name: { es: "Derramatic turbo", en: "Sloshing Machine", it: "Secidrink", pt: "Balde" }, image: "armas/Slosher_Washtub_00.png" },
            { name: { es: "Bambufusil 14-I", en: "Splat Charger", it: "Splatterscope", pt: "Carregador" }, image: "armas/Charger_Light_00.png" }
        ],
        gear: { name: { es: "Visor octoamazona", en: "Octoling Shades" }, image: "salmon/COP104.png" }
    },
    {
        start: "2026-08-06T18:00:00.000000Z",
        end: "2026-08-08T06:00:00.000000Z",
        stage: { 
            es: "Presa salmónida", 
            en: "Spawning Grounds", 
            it: "Avamposto Salmónid", 
            pt: "Posto Avançado" 
        },
        image: "salmon/S2_Stage_Spawning_Grounds.png",
        weapons: [
            { name: { es: "Derramatic centrífugo", en: "Sloshing Machine", it: "Lavatrice", pt: "Balde Centrífugo" }, image: "armas/Slosher_Launcher_00.png" },
            { name: { es: "Dinamorrodillo", en: "Dynamo Roller", it: "Rullo Dinamo", pt: "Rolo Pro" }, image: "armas/Roller_Heavy_00.png" },
            { name: { es: "Lanzatintas novato", en: "Splattershot Jr.", it: "Splattershot", pt: "Raciador" }, image: "armas/Shooter_First_00.png" },
            { name: { es: "Tintralladora", en: "Heavy Splatling", it: "Splatling", pt: "Splatling" }, image: "armas/Spinner_Standard_00.png" }
        ],
        gear: { name: { es: "Uniforme tienda discos", en: "Record Shop Uniform" }, image: "salmon/COP107.png" }
    },
    {
        start: "2026-08-08T12:00:00.000000Z",
        end: "2026-08-10T06:00:00.000000Z",
        stage: { 
            es: "Lanzadera Polaris", 
            en: "Ruins of Ark Polaris", 
            it: "Rovine di Ark Polaris", 
            pt: "Ruínas de Ark Polaris" 
        },
        image: "salmon/S2_Stage_Ruins_of_Ark_Polaris.png",
        weapons: [
            { name: { es: "Tintambor pesado", en: "Heavy Splatling", it: "Splatling", pt: "Splatling" }, image: "armas/Shooter_TripleMiddle_00.png" },
            { name: { es: "Paratintas", en: "Splat Brella", it: "Brella", pt: "Guarda-chuva" }, image: "armas/Umbrella_Normal_00.png" },
            { name: { es: "Brocha", en: "Inkbrush", it: "Calamar", pt: "Pincel" }, image: "armas/Roller_BrushNormal_00.png" },
            { name: { es: "Entintador 4K", en: "E-liter 4K", it: "Telesplatter", pt: "Carregador" }, image: "armas/Charger_Long_00.png" }
        ],
        gear: { name: { es: "Gorra mítica", en: "Mythical Cap" }, image: "salmon/COP105.png" }
    },
    {
        start: "2026-08-10T12:00:00.000000Z",
        end: "2026-08-12T00:00:00.000000Z",
        stage: { 
            es: "Ensenada Ahumada", 
            en: "Salmonid Smokeyard", 
            it: "Centrale di Smistamento", 
            pt: "Fumaça Salmónida" 
        },
        image: "salmon/S2_Stage_Salmonid_Smokeyard.png",
        weapons: [
            { name: { es: "Ultradevastador", en: "Blaster", it: "Blaster", pt: "Blaster" }, image: "armas/Shooter_BlasterShort_00.png" },
            { name: { es: "Tintambor ligero", en: "Mini Splatling", it: "Splatling", pt: "Splatling" }, image: "armas/Shooter_TripleQuick_00.png" },
            { name: { es: "Motatrónic dual negro", en: "Enperry Squelchers", it: "Repulsor", pt: "Dualies" }, image: "armas/Twins_Stepper_00.png" },
            { name: { es: "Kalarrapid α", en: "Splat Charger", it: "Caricatore", pt: "Carregador" }, image: "armas/Charger_Quick_00.png" }
        ],
        gear: { name: { es: "Aleta de buceo", en: "Dive Fins" }, image: "salmon/COP105(1).png" }
    },
    {
        start: "2026-08-12T06:00:00.000000Z",
        end: "2026-08-13T18:00:00.000000Z",
        stage: { 
            es: "Surgidero", 
            en: "Spawning Grounds", 
            it: "Diga di Salmonopei", 
            pt: "Fundição" 
        },
        image: "salmon/S2_Stage_Spawning_Grounds.png",
        weapons: [
            { name: { es: "Salpicadora 2000", en: "Splattershot Pro", it: "Splattershot Pro", pt: "Raciador Pro" }, image: "armas/Shooter_Gravity_00.png" },
            { name: { es: "Rodillo versátil", en: "Splat Roller", it: "Rullo", pt: "Rolo" }, image: "armas/Roller_Hunter_00.png" },
            { name: { es: "Fundidora 525 dual", en: "Dualie Squelchers", it: "Repulsor", pt: "Dualies" }, image: "armas/Twins_Gallon_00.png" },
            { name: { es: "Telentintador 4K", en: "E-liter 4K Scope", it: "Telesplatter", pt: "Carregador" }, image: "armas/Charger_LongScope_00.png" }
        ],
        gear: { name: { es: "Chaqueta de programador", en: "Coder Jacket" }, image: "salmon/COP108.png" }
    }
];

function formatCustomDate(dateStr, lang = 'es') {
    const date = new Date(dateStr);
    const options = { weekday: 'short', month: 'numeric', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true };
    return date.toLocaleDateString(lang === 'es' ? 'es-ES' : lang, options);
}

function updateSalmonRunDynamic() {
    if (typeof salmonRotations === 'undefined' || salmonRotations.length === 0) return;

    const now = new Date();
    let currentEvent = null;
    let nextEvents = [];

    for (let i = 0; i < salmonRotations.length; i++) {
        const start = new Date(salmonRotations[i].start);
        const end = new Date(salmonRotations[i].end);

        if (now >= start && now <= end) {
            currentEvent = salmonRotations[i];
            nextEvents = salmonRotations.slice(i + 1);
            break;
        } else if (now < start) {
            nextEvents = salmonRotations.slice(i);
            break;
        }
    }

    const lang = document.getElementById('languageSelect') ? document.getElementById('languageSelect').value : 'es';
    const t = (typeof translations !== 'undefined' && translations[lang]) ? translations[lang] : { inPrefix: 'en', remainingLabel: 'Restante: ' };
    const u = t.units || { d: 'd', h: 'h', m: 'm', s: 's' };

    if (currentEvent) {
        const mapImg = document.getElementById('salmon-map-img');
        if (mapImg) mapImg.src = currentEvent.image;
        
        const mapName = document.getElementById('salmon-map-name');
        if (mapName) mapName.innerText = (typeof currentEvent.stage === 'object') ? (currentEvent.stage[lang] || currentEvent.stage.es) : currentEvent.stage;
        
        const timeEl = document.getElementById('salmon-time');
        if (timeEl) timeEl.innerText = `${formatCustomDate(currentEvent.start, lang)} – ${formatCustomDate(currentEvent.end, lang)}`;

        for (let w = 0; w < 4; w++) {
            if (currentEvent.weapons[w]) {
                const imgEl = document.getElementById(`salmon-w${w + 1}`);
                if (imgEl) {
                    imgEl.src = currentEvent.weapons[w].image;
                    let wName = currentEvent.weapons[w].name;
                    imgEl.alt = (typeof wName === 'object') ? (wName[lang] || wName.es) : wName;
                }
            }
        }
        if (typeof setSalmonRunStatus === 'function') setSalmonRunStatus(true);
    } else {
        let openingTimeStr = nextEvents.length > 0 ? formatCustomDate(nextEvents[0].start, lang) : "";
        if (typeof setSalmonRunStatus === 'function') setSalmonRunStatus(false, openingTimeStr);
    }

    for (let i = 0; i < 3; i++) {
        const itemIdx = currentEvent ? i : i + 1;
        const nextItem = nextEvents[itemIdx];

        const timeEl = document.getElementById(`salmon-next-time-${i + 1}`);
        const imgEl = document.getElementById(`salmon-next-img-${i + 1}`);
        const cardContainer = timeEl ? timeEl.closest('div') : null;
        let nameEl = cardContainer ? cardContainer.querySelector('.salmon-next-map-name') : null;

        if (nextItem && cardContainer) {
            if (!nameEl) {
                nameEl = document.createElement('span');
                nameEl.className = 'salmon-next-map-name';
                nameEl.style.fontSize = '0.95rem';
                nameEl.style.color = '#ffd1b3';
                nameEl.style.fontWeight = 'bold';
                cardContainer.insertBefore(nameEl, timeEl);
            }
            nameEl.innerText = (typeof nextItem.stage === 'object') ? (nextItem.stage[lang] || nextItem.stage.es) : nextItem.stage;
            if (timeEl) timeEl.innerText = `${formatCustomDate(nextItem.start, lang)} – ${formatCustomDate(nextItem.end, lang)}`;

            if (imgEl) imgEl.src = nextItem.image;

            for (let w = 0; w < 4; w++) {
                if (nextItem.weapons[w]) {
                    const miniImg = document.getElementById(`salmon-nw${i + 1}-${w + 1}`);
                    if (miniImg) {
                        miniImg.src = nextItem.weapons[w].image;
                        let wName = nextItem.weapons[w].name;
                        miniImg.alt = (typeof wName === 'object') ? (wName[lang] || wName.es) : wName;
                    }
                }
            }
        } else if (nameEl) {
            nameEl.innerText = "";
        }
    }

    if (currentEvent) {
        const endTime = new Date(currentEvent.end).getTime();
        const diff = endTime - now.getTime();
        if (diff > 0) {
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const secs = Math.floor((diff % (1000 * 60)) / 1000);
            
            let remainingStr = t.remainingLabel || "Restante: ";
            if (days > 0) remainingStr += `${days}${u.d} `;
            remainingStr += `${hours}${u.h} ${mins}${u.m} ${secs}${u.s}`;
            
            const restanteEl = document.getElementById('salmon-restante');
            if (restanteEl) restanteEl.innerText = remainingStr;
        }
    }

    for (let i = 0; i < 3; i++) {
        const itemIdx = currentEvent ? i : i + 1;
        const nextItem = nextEvents[itemIdx];
        const cdEl = document.getElementById(`salmon-next-cd-${i + 1}`);

        if (nextItem && cdEl) {
            const startTime = new Date(nextItem.start).getTime();
            const diff = startTime - now.getTime();
            if (diff > 0) {
                const days = Math.floor(diff / (1000 * 60 * 60 * 24));
                const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                
                let cdStr = `${t.inPrefix} `;
                if (days > 0) cdStr += `${days}${u.d} `;
                cdStr += `${hours}${u.h} ${mins}${u.m}`;
                cdEl.innerText = cdStr;
            }
        }
    }
}

document.addEventListener("DOMContentLoaded", () => {
    updateSalmonRunDynamic();
    setInterval(updateSalmonRunDynamic, 1000);

    const langSelect = document.getElementById('languageSelect');
    if (langSelect) {
        langSelect.addEventListener('change', () => {
            updateSalmonRunDynamic();
        });
    }
});