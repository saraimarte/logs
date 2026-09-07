/* ============================================================
   FINANCE
   Decorative animated theme with inline SVGs and synthesized sounds.
   Does not touch cursor logic, companion positioning, or app structure.
   ============================================================ */

let themeBackground = null;
let themeStylesheet = null;
let themeAudio = null;
let themeMouseHandler = null;
let themeItems = [];
let lastGlobalSound = 0;

const THEME_ID = "finance";
const THEME_SVGS = ["<svg viewBox=\"0 0 120 100\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M15 84V16 M15 84H108\" stroke=\"currentColor\" stroke-width=\"4\"/><path d=\"M24 72 L43 59 L58 65 L78 38 L101 24\" fill=\"none\" stroke=\"#52af78\" stroke-width=\"6\"/><path d=\"M91 24H101V34\" fill=\"none\" stroke=\"#52af78\" stroke-width=\"5\"/></svg>", "<svg viewBox=\"0 0 100 100\" xmlns=\"http://www.w3.org/2000/svg\"><circle cx=\"50\" cy=\"50\" r=\"39\" fill=\"#d8b55e\" stroke=\"currentColor\" stroke-width=\"4\"/><circle cx=\"50\" cy=\"50\" r=\"29\" fill=\"none\" stroke=\"#f6df9a\" stroke-width=\"3\"/><text x=\"35\" y=\"65\" font-size=\"42\" font-family=\"serif\" font-weight=\"700\" fill=\"#785d27\">$</text></svg>", "<svg viewBox=\"0 0 120 90\" xmlns=\"http://www.w3.org/2000/svg\"><rect x=\"15\" y=\"30\" width=\"90\" height=\"50\" rx=\"8\" fill=\"#8b5a3d\" stroke=\"currentColor\" stroke-width=\"4\"/><path d=\"M43 30V20H77V30 M15 52H105\" fill=\"none\" stroke=\"#d5ad62\" stroke-width=\"4\"/><rect x=\"55\" y=\"48\" width=\"12\" height=\"11\" rx=\"2\" fill=\"#d5ad62\"/></svg>", "<svg viewBox=\"0 0 90 120\" xmlns=\"http://www.w3.org/2000/svg\"><rect x=\"12\" y=\"8\" width=\"66\" height=\"104\" rx=\"9\" fill=\"#41554c\" stroke=\"currentColor\" stroke-width=\"4\"/><rect x=\"23\" y=\"20\" width=\"44\" height=\"22\" rx=\"4\" fill=\"#d7e7c8\"/><g fill=\"#d5ad62\"><circle cx=\"30\" cy=\"58\" r=\"6\"/><circle cx=\"45\" cy=\"58\" r=\"6\"/><circle cx=\"60\" cy=\"58\" r=\"6\"/><circle cx=\"30\" cy=\"76\" r=\"6\"/><circle cx=\"45\" cy=\"76\" r=\"6\"/><circle cx=\"60\" cy=\"76\" r=\"6\"/><circle cx=\"30\" cy=\"94\" r=\"6\"/><circle cx=\"45\" cy=\"94\" r=\"6\"/><circle cx=\"60\" cy=\"94\" r=\"6\"/></g></svg>"];
const THEME_NOTES = [293.66, 369.99, 440, 587.33];
const SOUND_STYLE = "coin";

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
    haze.className = "theme-finance-haze";
    themeBackground.appendChild(haze);

    const pattern = document.createElement("div");
    pattern.className = "theme-finance-pattern";
    themeBackground.appendChild(pattern);

    const horizon = document.createElement("div");
    horizon.className = "theme-finance-horizon";
    themeBackground.appendChild(horizon);
}

function addObject(svg, index, left, top, scale, rotate) {
    const item = document.createElement("div");
    item.className = "theme-finance-item";
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
                obj.el.classList.remove("theme-finance-react");
                void obj.el.offsetWidth;
                obj.el.classList.add("theme-finance-react");
                playThemeSound(obj.note, index);
                setTimeout(() => obj.el.classList.remove("theme-finance-react"), 520);
            }
        });
    };
    window.addEventListener("mousemove", themeMouseHandler, { passive:true });
}

export function mount() {
    if (themeBackground) return;

    themeStylesheet = document.createElement("link");
    themeStylesheet.rel = "stylesheet";
    themeStylesheet.href = "/themes/theme-finance.css";
    themeStylesheet.dataset.theme = "finance";
    document.head.appendChild(themeStylesheet);

    themeBackground = document.createElement("div");
    themeBackground.id = "finance-background";
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
