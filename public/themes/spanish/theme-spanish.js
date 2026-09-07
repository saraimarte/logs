/* ============================================================
   SPANISH
   Decorative animated theme using external SVG assets and synthesized sounds.
   Does not touch cursor logic, companion positioning, or app structure.
   ============================================================ */

let themeBackground = null;
let themeStylesheet = null;
let themeAudio = null;
let themeMouseHandler = null;
let themeItems = [];
let lastGlobalSound = 0;

let spanishIntroAudio = null;
let spanishIntroFinished = true;
let spanishIntroFallback = null;

const SPANISH_INTRO_SRC =
    "/sounds/intros/freesound_community-hola-82828.mp3";
const SPANISH_INTRO_VOLUME = 0.31;

function removeSpanishIntroFallback() {
    if (!spanishIntroFallback) return;
    window.removeEventListener("pointerdown", spanishIntroFallback);
    window.removeEventListener("keydown", spanishIntroFallback);
    spanishIntroFallback = null;
}

function finishSpanishIntro() {
    spanishIntroFinished = true;
    removeSpanishIntroFallback();

    if (spanishIntroAudio) {
        try {
            spanishIntroAudio.pause();
            spanishIntroAudio.currentTime = 0;
        } catch (_) {}
    }

    spanishIntroAudio = null;
}

function playSpanishIntro() {
    finishSpanishIntro();
    spanishIntroFinished = false;

    const audio = new Audio(SPANISH_INTRO_SRC);
    spanishIntroAudio = audio;
    audio.preload = "auto";
    audio.volume = SPANISH_INTRO_VOLUME;

    audio.addEventListener("ended", finishSpanishIntro, { once: true });
    audio.addEventListener("error", finishSpanishIntro, { once: true });
    audio.addEventListener("playing", removeSpanishIntroFallback);

    const attempt = () => {
        if (spanishIntroAudio !== audio) return;

        const promise = audio.play();
        if (promise && typeof promise.catch === "function") {
            promise.catch(() => {
                if (spanishIntroFallback || spanishIntroAudio !== audio) return;

                spanishIntroFallback = () => {
                    if (spanishIntroAudio !== audio) return;
                    const retry = audio.play();
                    if (retry && typeof retry.catch === "function") {
                        retry.catch(() => {});
                    }
                };

                window.addEventListener("pointerdown", spanishIntroFallback);
                window.addEventListener("keydown", spanishIntroFallback);
            });
        }
    };

    attempt();
}

const THEME_ID = "spanish";
const THEME_SVGS = [
    "/svg/theme-spanish/avocado.svg",
    "/svg/theme-spanish/bongos.svg",
    "/svg/theme-spanish/coffee_bag.svg",
    "/svg/theme-spanish/fish_platter.svg",
    "/svg/theme-spanish/guira_and_scraper.svg",
    "/svg/theme-spanish/maracas.svg",
    "/svg/theme-spanish/moka_pot.svg",
    "/svg/theme-spanish/molinillo.svg",
    "/svg/theme-spanish/soup_bowl.svg"
];
const THEME_NOTES = [196, 246.94, 293.66, 392];
const SOUND_STYLE = "pluck";

function rand(min, max) {
    return Math.random() * (max - min) + min;
}

function shuffle(array) {
    const copy = [...array];
    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
}

function buildSpreadAssetPool(total) {
    const pool = [];
    let previous = null;

    while (pool.length < total) {
        const cycle = shuffle(THEME_SVGS);
        if (previous && cycle.length > 1 && cycle[0] === previous) {
            const shift = cycle.findIndex((item) => item !== previous);
            if (shift > 0) {
                cycle.push(...cycle.splice(0, shift));
            }
        }
        cycle.forEach((item) => {
            if (pool.length < total) {
                pool.push(item);
                previous = item;
            }
        });
    }

    return pool;
}

function getAudio() {
    if (!themeAudio) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return null;
        themeAudio = new AudioCtx();
    }
    if (themeAudio.state === "suspended") {
        themeAudio.resume().catch(() => {});
    }
    return themeAudio;
}

function playThemeSound(freq, index) {
    if (!spanishIntroFinished) return;
    const ctx = getAudio();
    if (!ctx) return;

    const now = ctx.currentTime;
    const master = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    const osc = ctx.createOscillator();
    const osc2 = ctx.createOscillator();

    let type = "sine";
    let type2 = "triangle";
    let duration = .5;
    let volume = .12;
    let cutoff = 2800;

    switch (SOUND_STYLE) {
        case "piano":
            type = "triangle"; type2 = "sine"; duration = .85; volume = .15; cutoff = 3200; break;
        case "pluck":
            type = "triangle"; type2 = "sine"; duration = .62; volume = .14; cutoff = 2500; break;
        case "chime":
        case "bell":
        case "ding":
            type = "sine"; type2 = "sine"; duration = .8; volume = .13; cutoff = 5000; break;
        case "rumble":
            type = "sawtooth"; type2 = "triangle"; duration = .55; volume = .08; cutoff = 700; freq *= .5; break;
        case "chirp":
            type = "sine"; type2 = "triangle"; duration = .32; volume = .11; cutoff = 4200; break;
        case "bubble":
            type = "sine"; type2 = "sine"; duration = .34; volume = .10; cutoff = 3600; break;
        case "coin":
            type = "square"; type2 = "sine"; duration = .30; volume = .08; cutoff = 4100; break;
        case "digital":
        case "arcade":
            type = "square"; type2 = "triangle"; duration = .28; volume = .075; cutoff = 3900; break;
        case "gong":
            type = "sine"; type2 = "triangle"; duration = 1.0; volume = .11; cutoff = 1800; break;
        case "jazz":
        case "jive":
            type = "triangle"; type2 = "sine"; duration = .55; volume = .12; cutoff = 2600; break;
        case "page":
        case "soft":
            type = "sine"; type2 = "triangle"; duration = .42; volume = .07; cutoff = 1900; break;
        case "click":
        case "pop":
            type = "triangle"; type2 = "sine"; duration = .22; volume = .07; cutoff = 3000; break;
    }

    filter.type = "lowpass";
    filter.frequency.setValueAtTime(cutoff, now);
    filter.Q.setValueAtTime(.7, now);

    master.gain.setValueAtTime(.0001, now);
    master.gain.exponentialRampToValueAtTime(volume, now + .008);
    master.gain.exponentialRampToValueAtTime(.0001, now + duration);

    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);

    osc2.type = type2;
    osc2.frequency.setValueAtTime(freq * (SOUND_STYLE === "bell" || SOUND_STYLE === "chime" ? 2.01 : 1.5), now);

    const g2 = ctx.createGain();
    g2.gain.setValueAtTime(.32, now);
    g2.gain.exponentialRampToValueAtTime(.0001, now + Math.max(.18, duration * .7));

    osc.connect(filter);
    osc2.connect(g2);
    g2.connect(filter);
    filter.connect(master);
    master.connect(ctx.destination);

    if (SOUND_STYLE === "bubble") {
        osc.frequency.exponentialRampToValueAtTime(freq * 1.65, now + duration * .8);
    }
    if (SOUND_STYLE === "chirp") {
        osc.frequency.exponentialRampToValueAtTime(freq * 1.4, now + duration);
    }
    if (SOUND_STYLE === "digital" || SOUND_STYLE === "arcade") {
        osc.frequency.setValueAtTime(freq, now);
        osc.frequency.setValueAtTime(freq * 1.25, now + .08);
        osc.frequency.setValueAtTime(freq * .9, now + .16);
    }

    osc.start(now); osc2.start(now);
    osc.stop(now + duration + .05); osc2.stop(now + duration + .05);
}

function buildBackdrop() {
    const haze = document.createElement("div");
    haze.className = "theme-spanish-haze";
    themeBackground.appendChild(haze);

    const pattern = document.createElement("div");
    pattern.className = "theme-spanish-pattern";
    themeBackground.appendChild(pattern);

    const horizon = document.createElement("div");
    horizon.className = "theme-spanish-horizon";
    themeBackground.appendChild(horizon);
}

function addObject(svgPath, index, left, top, scale, rotate) {
    const item = document.createElement("div");
    item.className = "theme-spanish-item";
    item.style.left = left;
    item.style.top = top;
    item.style.setProperty("--item-scale", scale);
    item.style.setProperty("--item-rotate", rotate + "deg");
    item.style.setProperty("--item-delay", (-rand(0, 8)).toFixed(2) + "s");
    item.style.setProperty("--item-x", rand(-6,6).toFixed(1) + "px");
    item.style.setProperty("--item-y", rand(-5,5).toFixed(1) + "px");

    const img = document.createElement("img");
    img.className = "theme-spanish-svg";
    img.src = svgPath;
    img.alt = "";
    img.draggable = false;
    img.setAttribute("aria-hidden", "true");

    item.appendChild(img);
    item.setAttribute("aria-hidden", "true");
    themeBackground.appendChild(item);
    themeItems.push({ el:item, note:THEME_NOTES[index % THEME_NOTES.length], last:0 });
}

function createObjects() {
    const positions = [
        [7,25,.95,-8], [28,29,.86,5], [55,26,.90,-4], [88,30,.93,8],
        [10,49,.88,4], [38,53,.82,-5], [69,49,.86,5], [92,55,.90,-7],
        [16,71,.90,-6], [45,68,.84,4], [73,73,.86,-3],
        [7,89,.92,5], [32,84,.85,-4], [59,89,.87,3], [87,86,.93,-5]
    ].map((p) => [
        p[0] + rand(-2.4, 2.4),
        p[1] + rand(-2.4, 2.4),
        p[2] + rand(0.05, 0.14),
        p[3] + rand(-3, 3)
    ]);

    const assets = buildSpreadAssetPool(positions.length);
    const placements = [];
    const minDistance = 24;

    positions.forEach((p, i) => {
        let chosenIndex = i;

        for (let j = i; j < assets.length; j++) {
            const tooCloseToSame = placements.some((placed) =>
                placed.asset === assets[j] &&
                Math.hypot(placed.x - p[0], placed.y - p[1]) < minDistance
            );
            if (!tooCloseToSame) {
                chosenIndex = j;
                break;
            }
        }

        [assets[i], assets[chosenIndex]] = [assets[chosenIndex], assets[i]];
        placements.push({ x: p[0], y: p[1], asset: assets[i] });

        addObject(
            assets[i],
            i,
            p[0] + "%",
            p[1] + "%",
            p[2],
            p[3]
        );
    });
}

function startInteraction() {
    const radius = 68;
    themeMouseHandler = (event) => {
        const now = performance.now();
        themeItems.forEach((obj, index) => {
            const r = obj.el.getBoundingClientRect();
            const cx = r.left + r.width/2;
            const cy = r.top + r.height/2;
            if (Math.hypot(cx-event.clientX, cy-event.clientY) <= radius &&
                now - obj.last > 650 &&
                now - lastGlobalSound > 110) {
                obj.last = now;
                lastGlobalSound = now;
                obj.el.classList.remove("theme-spanish-react");
                void obj.el.offsetWidth;
                obj.el.classList.add("theme-spanish-react");
                playThemeSound(obj.note, index);
                setTimeout(() => obj.el.classList.remove("theme-spanish-react"), 520);
            }
        });
    };
    window.addEventListener("mousemove", themeMouseHandler, { passive:true });
}

export function mount() {
    if (themeBackground) return;

    themeStylesheet = document.createElement("link");
    themeStylesheet.rel = "stylesheet";
    themeStylesheet.href = "/themes/theme-spanish.css";
    themeStylesheet.dataset.theme = "spanish";
    document.head.appendChild(themeStylesheet);

    themeBackground = document.createElement("div");
    themeBackground.id = "spanish-background";
    themeBackground.setAttribute("aria-hidden", "true");
    document.body.appendChild(themeBackground);

    buildBackdrop();
    createObjects();
    startInteraction();
    playSpanishIntro();
}

export function unmount() {
    finishSpanishIntro();
    if (themeMouseHandler) {
        window.removeEventListener("mousemove", themeMouseHandler);
        themeMouseHandler = null;
    }
    themeItems = [];
    if (themeAudio) {
        themeAudio.close().catch(() => {});
        themeAudio = null;
    }
    if (themeBackground) {
        themeBackground.remove();
        themeBackground = null;
    }
    if (themeStylesheet) {
        themeStylesheet.remove();
        themeStylesheet = null;
    }
}
