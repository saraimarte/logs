/* ============================================================
   Y2K
   Decorative animated theme with inline SVGs and synthesized sounds.
   Does not touch cursor logic, companion positioning, or app structure.
   ============================================================ */

let themeBackground = null;
let themeStylesheet = null;
let themeAudio = null;
let themeMouseHandler = null;
let themeItems = [];
let lastGlobalSound = 0;

const THEME_ID = "y2k";
const THEME_SVGS = ["<svg viewBox=\"0 0 120 100\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M57 48 Q28 4 13 27 Q5 48 45 61 Q11 73 25 92 Q48 94 57 65Z\" fill=\"#f28cc7\" stroke=\"currentColor\" stroke-width=\"3\"/><path d=\"M63 48 Q92 4 107 27 Q115 48 75 61 Q109 73 95 92 Q72 94 63 65Z\" fill=\"#70dbe0\" stroke=\"currentColor\" stroke-width=\"3\"/><rect x=\"56\" y=\"38\" width=\"8\" height=\"38\" rx=\"4\" fill=\"#7c5791\"/></svg>", "<svg viewBox=\"0 0 100 100\" xmlns=\"http://www.w3.org/2000/svg\"><defs><linearGradient id=\"cdg\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"1\"><stop offset=\"0\" stop-color=\"#85f5ff\"/><stop offset=\".35\" stop-color=\"#ffc0ec\"/><stop offset=\".7\" stop-color=\"#d8c4ff\"/><stop offset=\"1\" stop-color=\"#a8fff1\"/></linearGradient></defs><circle cx=\"50\" cy=\"50\" r=\"40\" fill=\"url(#cdg)\" stroke=\"currentColor\" stroke-width=\"3\"/><circle cx=\"50\" cy=\"50\" r=\"11\" fill=\"#fff6ff\"/></svg>", "<svg viewBox=\"0 0 100 100\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M50 8 L61 36 L90 38 L68 56 L75 86 L50 69 L25 86 L32 56 L10 38 L39 36Z\" fill=\"#f3d55b\" stroke=\"currentColor\" stroke-width=\"4\"/></svg>", "<svg viewBox=\"0 0 100 100\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M50 88 C18 66 12 43 26 29 C38 17 49 25 50 37 C51 25 62 17 74 29 C88 43 82 66 50 88Z\" fill=\"#f38bc5\" stroke=\"#fff\" stroke-width=\"4\"/><circle cx=\"35\" cy=\"38\" r=\"7\" fill=\"#fff\" opacity=\".5\"/></svg>"];
const THEME_NOTES = [440, 554.37, 659.25, 880];
const SOUND_STYLE = "digital";

function rand(min, max) {
    return Math.random() * (max - min) + min;
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
    haze.className = "theme-y2k-haze";
    themeBackground.appendChild(haze);

    const pattern = document.createElement("div");
    pattern.className = "theme-y2k-pattern";
    themeBackground.appendChild(pattern);

    const horizon = document.createElement("div");
    horizon.className = "theme-y2k-horizon";
    themeBackground.appendChild(horizon);
}

function addObject(svg, index, left, top, scale, rotate) {
    const item = document.createElement("div");
    item.className = "theme-y2k-item";
    item.style.left = left;
    item.style.top = top;
    item.style.setProperty("--item-scale", scale);
    item.style.setProperty("--item-rotate", rotate + "deg");
    item.style.setProperty("--item-delay", (-rand(0, 8)).toFixed(2) + "s");
    item.style.setProperty("--item-x", rand(-10,10).toFixed(1) + "px");
    item.style.setProperty("--item-y", rand(-8,8).toFixed(1) + "px");
    item.innerHTML = svg;
    item.setAttribute("aria-hidden", "true");
    themeBackground.appendChild(item);
    themeItems.push({ el:item, note:THEME_NOTES[index % THEME_NOTES.length], last:0 });
}

function createObjects() {
    const positions = [
        [7,22,.72,-8],[28,18,.58,5],[72,20,.61,-4],[92,28,.70,8],
        [11,50,.62,4],[88,52,.64,-5],
        [17,78,.65,-6],[38,84,.55,4],[64,81,.60,-3],[85,77,.66,6]
    ];
    positions.forEach((p, i) => {
        addObject(
            THEME_SVGS[i % THEME_SVGS.length],
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
                obj.el.classList.remove("theme-y2k-react");
                void obj.el.offsetWidth;
                obj.el.classList.add("theme-y2k-react");
                playThemeSound(obj.note, index);
                setTimeout(() => obj.el.classList.remove("theme-y2k-react"), 520);
            }
        });
    };
    window.addEventListener("mousemove", themeMouseHandler, { passive:true });
}

export function mount() {
    if (themeBackground) return;

    themeStylesheet = document.createElement("link");
    themeStylesheet.rel = "stylesheet";
    themeStylesheet.href = "/themes/theme-y2k.css";
    themeStylesheet.dataset.theme = "y2k";
    document.head.appendChild(themeStylesheet);

    themeBackground = document.createElement("div");
    themeBackground.id = "y2k-background";
    themeBackground.setAttribute("aria-hidden", "true");
    document.body.appendChild(themeBackground);

    buildBackdrop();
    createObjects();
    startInteraction();
}

export function unmount() {
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
