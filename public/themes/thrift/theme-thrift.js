let themeBackground = null;
let themeStylesheet = null;
let themeAudio = null;
let themeMouseHandler = null;
let themeItems = [];
let lastGlobalSound = 0;

const THEME_SVGS = ["<svg viewBox=\"0 0 120 90\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M59 18 Q53 6 64 6 Q75 6 70 18 L61 30 L95 64 H26 L61 30\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/></svg>", "<svg viewBox=\"0 0 100 110\" xmlns=\"http://www.w3.org/2000/svg\"><rect x=\"20\" y=\"31\" width=\"60\" height=\"58\" rx=\"8\" fill=\"#d1a271\" stroke=\"currentColor\" stroke-width=\"4\"/><path d=\"M33 32 Q33 16 50 16 Q67 16 67 32\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"4\"/><circle cx=\"50\" cy=\"57\" r=\"10\" fill=\"#7da68d\"/></svg>", "<svg viewBox=\"0 0 120 110\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M30 20 L48 12 H72 L90 20 L103 45 L83 56 V96 H37 V56 L17 45Z\" fill=\"#f1ece3\" stroke=\"currentColor\" stroke-width=\"4\"/><path d=\"M48 12 Q60 26 72 12\" fill=\"none\" stroke=\"#b8865c\" stroke-width=\"4\"/></svg>", "<svg viewBox=\"0 0 100 100\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M16 49 L49 16 H86 V53 L53 86Z\" fill=\"#e9d2b7\" stroke=\"currentColor\" stroke-width=\"4\"/><circle cx=\"63\" cy=\"39\" r=\"5\" fill=\"#7da68d\"/></svg>"];
const THEME_NOTES = [220.0, 261.63, 329.63, 392.0];
const SOUND_STYLE = "cash";

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

function playThemeSound(freq) {
    const ctx = getAudio();
    if (!ctx) return;
    const now = ctx.currentTime;
    const master = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    const osc = ctx.createOscillator();
    const osc2 = ctx.createOscillator();

    let type = "sine";
    let type2 = "triangle";
    let duration = .45;
    let volume = .10;
    let cutoff = 2800;

    switch (SOUND_STYLE) {
        case "ding":
        case "clink":
        case "sparkle":
        case "shutter":
        case "chime":
            type = "sine"; type2 = "sine"; duration = .55; volume = .11; cutoff = 4600; break;
        case "engine":
        case "alarm":
            type = "sawtooth"; type2 = "triangle"; duration = .30; volume = .07; cutoff = 900; freq *= .6; break;
        case "flip":
        case "scratch":
        case "draft":
            type = "triangle"; type2 = "sine"; duration = .24; volume = .07; cutoff = 2200; break;
        case "cash":
        case "coin":
            type = "square"; type2 = "sine"; duration = .24; volume = .07; cutoff = 3800; break;
        case "arcade":
        case "digital":
        case "click":
        case "beep":
            type = "square"; type2 = "triangle"; duration = .22; volume = .065; cutoff = 3900; break;
        case "chirp":
        case "buzz":
        case "swish":
        case "pop":
        case "snip":
        case "tap":
            type = "triangle"; type2 = "sine"; duration = .28; volume = .075; cutoff = 2500; break;
        case "applause":
            type = "triangle"; type2 = "sine"; duration = .40; volume = .09; cutoff = 2200; break;
    }

    filter.type = "lowpass";
    filter.frequency.setValueAtTime(cutoff, now);
    master.gain.setValueAtTime(.0001, now);
    master.gain.exponentialRampToValueAtTime(volume, now + .008);
    master.gain.exponentialRampToValueAtTime(.0001, now + duration);

    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);
    osc2.type = type2;
    osc2.frequency.setValueAtTime(freq * 1.5, now);

    const g2 = ctx.createGain();
    g2.gain.setValueAtTime(.28, now);
    g2.gain.exponentialRampToValueAtTime(.0001, now + Math.max(.16, duration * .7));

    osc.connect(filter);
    osc2.connect(g2);
    g2.connect(filter);
    filter.connect(master);
    master.connect(ctx.destination);

    if (SOUND_STYLE === "chirp") {
        osc.frequency.exponentialRampToValueAtTime(freq * 1.35, now + duration);
    }
    if (SOUND_STYLE === "buzz") {
        osc.frequency.setValueAtTime(freq, now);
        osc.frequency.setValueAtTime(freq * 1.03, now + .03);
        osc.frequency.setValueAtTime(freq * .97, now + .06);
        osc.frequency.setValueAtTime(freq * 1.03, now + .09);
    }
    if (SOUND_STYLE === "arcade" || SOUND_STYLE === "digital" || SOUND_STYLE === "click" || SOUND_STYLE === "beep") {
        osc.frequency.setValueAtTime(freq, now);
        osc.frequency.setValueAtTime(freq * 1.22, now + .07);
        osc.frequency.setValueAtTime(freq * .92, now + .14);
    }

    osc.start(now);
    osc2.start(now);
    osc.stop(now + duration + .05);
    osc2.stop(now + duration + .05);
}

function buildBackdrop() {
    const haze = document.createElement("div");
    haze.className = "theme-thrift-haze";
    themeBackground.appendChild(haze);

    const pattern = document.createElement("div");
    pattern.className = "theme-thrift-pattern";
    themeBackground.appendChild(pattern);

    const horizon = document.createElement("div");
    horizon.className = "theme-thrift-horizon";
    themeBackground.appendChild(horizon);
}

function addObject(svg, i, left, top, scale, rotate) {
    const item = document.createElement("div");
    item.className = "theme-thrift-item";
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
    themeItems.push({ el:item, note:THEME_NOTES[i % THEME_NOTES.length], last:0 });
}

function createObjects() {
    const positions = [
        [8,22,.70,-8],[28,18,.58,5],[72,19,.61,-4],[92,28,.70,8],
        [11,50,.62,4],[88,52,.64,-5],
        [17,78,.65,-6],[38,84,.55,4],[64,81,.60,-3],[85,77,.66,6]
    ];
    positions.forEach((p, i) => {
        addObject(THEME_SVGS[i % THEME_SVGS.length], i, p[0] + "%", p[1] + "%", p[2], p[3]);
    });
}

function startInteraction() {
    const radius = 68;
    themeMouseHandler = (event) => {
        const now = performance.now();
        themeItems.forEach((obj) => {
            const r = obj.el.getBoundingClientRect();
            const cx = r.left + r.width / 2;
            const cy = r.top + r.height / 2;
            if (Math.hypot(cx - event.clientX, cy - event.clientY) <= radius &&
                now - obj.last > 650 &&
                now - lastGlobalSound > 110) {
                obj.last = now;
                lastGlobalSound = now;
                obj.el.classList.remove("theme-thrift-react");
                void obj.el.offsetWidth;
                obj.el.classList.add("theme-thrift-react");
                playThemeSound(obj.note);
                setTimeout(() => obj.el.classList.remove("theme-thrift-react"), 520);
            }
        });
    };
    window.addEventListener("mousemove", themeMouseHandler, { passive: true });
}

export function mount() {
    if (themeBackground) return;

    themeStylesheet = document.createElement("link");
    themeStylesheet.rel = "stylesheet";
    themeStylesheet.href = "/themes/theme-thrift.css";
    themeStylesheet.dataset.theme = "thrift";
    document.head.appendChild(themeStylesheet);

    themeBackground = document.createElement("div");
    themeBackground.id = "thrift-background";
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
