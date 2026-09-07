let themeBackground = null;
let themeStylesheet = null;
let themeAudio = null;
let themeMouseHandler = null;
let themeItems = [];
let lastGlobalSound = 0;

const THEME_SVGS = ["<svg viewBox=\"0 0 140 100\" xmlns=\"http://www.w3.org/2000/svg\"><rect x=\"15\" y=\"28\" width=\"110\" height=\"55\" rx=\"10\" fill=\"#57433b\" stroke=\"currentColor\" stroke-width=\"4\"/><rect x=\"38\" y=\"18\" width=\"27\" height=\"14\" rx=\"4\" fill=\"#879aa8\"/><circle cx=\"71\" cy=\"56\" r=\"20\" fill=\"#2b2624\" stroke=\"#879aa8\" stroke-width=\"4\"/><circle cx=\"71\" cy=\"56\" r=\"8\" fill=\"#d7e6ef\"/><circle cx=\"108\" cy=\"41\" r=\"5\" fill=\"#f3d56f\"/></svg>", "<svg viewBox=\"0 0 100 120\" xmlns=\"http://www.w3.org/2000/svg\"><rect x=\"18\" y=\"18\" width=\"64\" height=\"80\" rx=\"6\" fill=\"#f3efe7\" stroke=\"currentColor\" stroke-width=\"4\"/><path d=\"M26 71 L41 52 L53 63 L61 56 L74 71 V83 H26Z\" fill=\"#b97857\"/><circle cx=\"38\" cy=\"42\" r=\"6\" fill=\"#7f9ca5\"/></svg>", "<svg viewBox=\"0 0 100 130\" xmlns=\"http://www.w3.org/2000/svg\"><rect x=\"34\" y=\"16\" width=\"32\" height=\"26\" rx=\"6\" fill=\"#4f433d\" stroke=\"currentColor\" stroke-width=\"4\"/><circle cx=\"50\" cy=\"29\" r=\"8\" fill=\"#7f9ca5\"/><path d=\"M50 42V62 M50 62L28 114 M50 62L72 114 M50 62V114\" stroke=\"currentColor\" stroke-width=\"5\" stroke-linecap=\"round\"/></svg>", "<svg viewBox=\"0 0 100 100\" xmlns=\"http://www.w3.org/2000/svg\"><circle cx=\"50\" cy=\"50\" r=\"38\" fill=\"#2c2725\" stroke=\"currentColor\" stroke-width=\"4\"/><path d=\"M50 50 L28 41 L39 22 Q55 20 67 28 L72 49 L50 50Z\" fill=\"#7f9ca5\"/><path d=\"M50 50 L72 49 L78 67 Q68 81 49 78 L38 60 L50 50Z\" fill=\"#b97857\"/><path d=\"M50 50 L38 60 L22 57 Q17 40 28 28 L50 50Z\" fill=\"#d4b46a\"/></svg>"];
const THEME_NOTES = [392.0, 493.88, 659.25, 783.99];
const SOUND_STYLE = "shutter";

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
    haze.className = "theme-photography-haze";
    themeBackground.appendChild(haze);

    const pattern = document.createElement("div");
    pattern.className = "theme-photography-pattern";
    themeBackground.appendChild(pattern);

    const horizon = document.createElement("div");
    horizon.className = "theme-photography-horizon";
    themeBackground.appendChild(horizon);
}

function addObject(svg, i, left, top, scale, rotate) {
    const item = document.createElement("div");
    item.className = "theme-photography-item";
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
                obj.el.classList.remove("theme-photography-react");
                void obj.el.offsetWidth;
                obj.el.classList.add("theme-photography-react");
                playThemeSound(obj.note);
                setTimeout(() => obj.el.classList.remove("theme-photography-react"), 520);
            }
        });
    };
    window.addEventListener("mousemove", themeMouseHandler, { passive: true });
}

export function mount() {
    if (themeBackground) return;

    themeStylesheet = document.createElement("link");
    themeStylesheet.rel = "stylesheet";
    themeStylesheet.href = "/themes/theme-photography.css";
    themeStylesheet.dataset.theme = "photography";
    document.head.appendChild(themeStylesheet);

    themeBackground = document.createElement("div");
    themeBackground.id = "photography-background";
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
