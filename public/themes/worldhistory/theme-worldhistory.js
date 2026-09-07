/* ============================================================
   WORLD HISTORY
   Decorative animated theme with inline SVGs and synthesized sounds.
   Does not touch cursor logic, companion positioning, or app structure.
   ============================================================ */

let themeBackground = null;
let themeStylesheet = null;
let themeAudio = null;
let themeMouseHandler = null;
let themeItems = [];
let lastGlobalSound = 0;

const THEME_ID = "worldhistory";
const THEME_SVGS = ["<svg viewBox=\"0 0 100 120\" xmlns=\"http://www.w3.org/2000/svg\"><circle cx=\"50\" cy=\"47\" r=\"35\" fill=\"#74a7b5\" stroke=\"currentColor\" stroke-width=\"4\"/><path d=\"M50 12 Q30 47 50 82 Q70 47 50 12 M16 47H84 M24 28Q50 39 76 28 M24 66Q50 55 76 66\" fill=\"none\" stroke=\"#e6d2a8\" stroke-width=\"3\"/><path d=\"M50 82V99 M30 104H70\" stroke=\"currentColor\" stroke-width=\"5\"/></svg>", "<svg viewBox=\"0 0 120 90\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M22 20 H99 Q110 20 104 32 V69 H30 V29 Q18 32 15 24 Q14 20 22 20Z\" fill=\"#ead5a9\" stroke=\"currentColor\" stroke-width=\"4\"/><path d=\"M40 38H88 M40 50H82 M40 62H75\" stroke=\"#9c7750\" stroke-width=\"3\"/></svg>", "<svg viewBox=\"0 0 90 120\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M20 18H70 M24 28H66 M30 28V92 M40 28V92 M50 28V92 M60 28V92 M24 92H66 M18 102H72\" stroke=\"currentColor\" stroke-width=\"6\" stroke-linecap=\"round\"/></svg>", "<svg viewBox=\"0 0 100 100\" xmlns=\"http://www.w3.org/2000/svg\"><circle cx=\"50\" cy=\"50\" r=\"40\" fill=\"#f0dfbd\" stroke=\"currentColor\" stroke-width=\"4\"/><path d=\"M65 32 L56 56 L35 69 L44 44Z\" fill=\"#a86147\"/><circle cx=\"50\" cy=\"50\" r=\"5\" fill=\"#5d7487\"/></svg>"];
const THEME_NOTES = [174.61, 220, 261.63, 329.63];
const SOUND_STYLE = "gong";

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
    haze.className = "theme-worldhistory-haze";
    themeBackground.appendChild(haze);

    const pattern = document.createElement("div");
    pattern.className = "theme-worldhistory-pattern";
    themeBackground.appendChild(pattern);

    const horizon = document.createElement("div");
    horizon.className = "theme-worldhistory-horizon";
    themeBackground.appendChild(horizon);
}

function addObject(svg, index, left, top, scale, rotate) {
    const item = document.createElement("div");
    item.className = "theme-worldhistory-item";
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
                obj.el.classList.remove("theme-worldhistory-react");
                void obj.el.offsetWidth;
                obj.el.classList.add("theme-worldhistory-react");
                playThemeSound(obj.note, index);
                setTimeout(() => obj.el.classList.remove("theme-worldhistory-react"), 520);
            }
        });
    };
    window.addEventListener("mousemove", themeMouseHandler, { passive:true });
}

export function mount() {
    if (themeBackground) return;

    themeStylesheet = document.createElement("link");
    themeStylesheet.rel = "stylesheet";
    themeStylesheet.href = "/themes/theme-worldhistory.css";
    themeStylesheet.dataset.theme = "worldhistory";
    document.head.appendChild(themeStylesheet);

    themeBackground = document.createElement("div");
    themeBackground.id = "worldhistory-background";
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
