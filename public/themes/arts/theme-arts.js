/* ============================================================
   ARTS
   Painter's studio / creative canvas theme.

   Decorative-only module.
   Uses the existing SVG assets from /public/svg/theme-arts.

   This module intentionally does NOT modify:
   - application layout
   - cursor logic
   - companion stages or movement
   - tabs/selectors
   - views
   - application event handlers
   ============================================================ */

let artsBackground = null;
let artsStylesheet = null;

const ARTS_SVGS = [
    { name: "Blue", file: "/svg/theme-arts/blue.svg", color: "#3478e5" },
    { name: "Charcoal", file: "/svg/theme-arts/charcoal.svg", color: "#343434" },
    { name: "Cobalt", file: "/svg/theme-arts/cobalt.svg", color: "#2457d6" },
    { name: "Crimson", file: "/svg/theme-arts/crimson.svg", color: "#c92f4b" },
    { name: "Dark Blue", file: "/svg/theme-arts/darkblue.svg", color: "#183b82" },
    { name: "Emerald", file: "/svg/theme-arts/emerald.svg", color: "#159a70" },
    { name: "Fuchsia", file: "/svg/theme-arts/fuchsia.svg", color: "#d53bc2" },
    { name: "Green", file: "/svg/theme-arts/green.svg", color: "#4f9d45" },
    { name: "Lavender", file: "/svg/theme-arts/lavender.svg", color: "#9a79d6" },
    { name: "Magenta", file: "/svg/theme-arts/magenta.svg", color: "#c82d91" },
    { name: "Mustard", file: "/svg/theme-arts/mustard.svg", color: "#d1a12b" },
    { name: "Navy", file: "/svg/theme-arts/navy.svg", color: "#25345f" },
    { name: "Olive", file: "/svg/theme-arts/olive.svg", color: "#778238" },
    { name: "Periwinkle", file: "/svg/theme-arts/periwinkle.svg", color: "#7186d8" },
    { name: "Pink", file: "/svg/theme-arts/pink.svg", color: "#e986a9" },
    { name: "Red", file: "/svg/theme-arts/red.svg", color: "#df4141" },
    { name: "Teal", file: "/svg/theme-arts/teal.svg", color: "#249b9a" },
    { name: "Yellow", file: "/svg/theme-arts/yellow.svg", color: "#e3bd32" }
];

function artsRandom(min, max) {
    return Math.random() * (max - min) + min;
}

function artsShuffle(items) {
    const copy = [...items];
    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
}

function addPaintObject(asset, position, index) {
    if (!artsBackground) return;

    const item = document.createElement("div");
    item.className = `arts-paint-item arts-depth-${index % 3 === 0 ? 2 : 1}`;
    item.setAttribute("aria-hidden", "true");

    item.style.left = `${position.x}%`;
    item.style.top = `${position.y}%`;
    item.style.setProperty("--arts-size", `${position.size}px`);
    item.style.setProperty("--arts-scale", `${position.scale}`);
    item.style.setProperty("--arts-rotate", `${position.rotate}deg`);
    item.style.setProperty("--arts-opacity", `${position.opacity}`);
    item.style.setProperty("--arts-duration", `${position.duration}s`);
    item.style.setProperty("--arts-delay", `${position.delay}s`);

    const img = document.createElement("img");
    img.className = "arts-paint-svg";
    img.src = asset.file;
    img.alt = "";
    img.draggable = false;
    img.setAttribute("aria-hidden", "true");

    /* If a project has a missing asset, remove only that decorative object.
       The rest of the application remains untouched. */
    img.addEventListener("error", () => item.remove(), { once: true });

    item.appendChild(img);
    artsBackground.appendChild(item);
}

function createPaintObjects() {
    if (!artsBackground) return;

    /*
       The application is centered and max-width constrained by template.css.
       Most paint objects therefore live in the outer visual gutters, with a
       handful around the upper/lower corners. This keeps titles, cards and
       text readable instead of putting art directly behind them.
    */
    const positions = [
        { x: 4.5,  y: 19, size: 128, scale: .86, rotate: -12, opacity: .88 },
        { x: 10,   y: 43, size: 104, scale: .78, rotate: 9,   opacity: .78 },
        { x: 5.5,  y: 70, size: 118, scale: .84, rotate: -7,  opacity: .82 },
        { x: 14,   y: 89, size: 96,  scale: .72, rotate: 11,  opacity: .72 },

        { x: 95.5, y: 18, size: 124, scale: .84, rotate: 12,  opacity: .84 },
        { x: 90,   y: 39, size: 106, scale: .76, rotate: -9,  opacity: .76 },
        { x: 95,   y: 64, size: 120, scale: .82, rotate: 7,   opacity: .82 },
        { x: 88,   y: 87, size: 100, scale: .74, rotate: -13, opacity: .72 },

        { x: 22,   y: 13, size: 76,  scale: .62, rotate: 7,   opacity: .50 },
        { x: 79,   y: 13, size: 78,  scale: .62, rotate: -6,  opacity: .50 },
        { x: 22,   y: 94, size: 78,  scale: .60, rotate: -8,  opacity: .50 },
        { x: 78,   y: 94, size: 80,  scale: .62, rotate: 9,   opacity: .50 },

        { x: 17,   y: 57, size: 66,  scale: .54, rotate: -14, opacity: .42 },
        { x: 83,   y: 57, size: 68,  scale: .54, rotate: 13,  opacity: .42 },
        { x: 31,   y: 19, size: 58,  scale: .48, rotate: 4,   opacity: .36 },
        { x: 69,   y: 19, size: 60,  scale: .48, rotate: -4,  opacity: .36 },
        { x: 31,   y: 84, size: 62,  scale: .48, rotate: -5,  opacity: .36 },
        { x: 69,   y: 84, size: 62,  scale: .48, rotate: 6,   opacity: .36 }
    ];

    const assets = artsShuffle(ARTS_SVGS);

    positions.forEach((position, index) => {
        const asset = assets[index % assets.length];
        const jitterX = index % 2 === 0 ? artsRandom(-1.2, 1.2) : artsRandom(-1.8, 1.8);
        const jitterY = artsRandom(-1.2, 1.2);

        addPaintObject(asset, {
            ...position,
            x: position.x + jitterX,
            y: position.y + jitterY,
            duration: artsRandom(7.5, 11.5),
            delay: -artsRandom(0, 9)
        }, index);
    });
}

function addStroke({ x, y, width, height, color, rotation, opacity, duration, delay }) {
    if (!artsBackground) return;

    const stroke = document.createElement("span");
    stroke.className = "arts-stroke";
    stroke.setAttribute("aria-hidden", "true");
    stroke.style.left = `${x}%`;
    stroke.style.top = `${y}%`;
    stroke.style.setProperty("--stroke-width", `${width}px`);
    stroke.style.setProperty("--stroke-height", `${height}px`);
    stroke.style.setProperty("--stroke-color", color);
    stroke.style.setProperty("--stroke-rotation", `${rotation}deg`);
    stroke.style.setProperty("--stroke-opacity", opacity);
    stroke.style.setProperty("--stroke-duration", `${duration}s`);
    stroke.style.animationDelay = `${delay}s`;
    artsBackground.appendChild(stroke);
}

function createPaintStrokes() {
    const strokes = [
        { x: 14, y: 29, width: 132, height: 7, color: "#df4141", rotation: -12, opacity: .18 },
        { x: 87, y: 30, width: 150, height: 8, color: "#2457d6", rotation: 9, opacity: .17 },
        { x: 11, y: 78, width: 145, height: 8, color: "#249b9a", rotation: 8, opacity: .16 },
        { x: 88, y: 76, width: 132, height: 7, color: "#e3bd32", rotation: -10, opacity: .19 },
        { x: 26, y: 10, width: 84, height: 5, color: "#d53bc2", rotation: 3, opacity: .12 },
        { x: 74, y: 91, width: 94, height: 6, color: "#4f9d45", rotation: -4, opacity: .12 }
    ];

    strokes.forEach((stroke, index) => addStroke({
        ...stroke,
        duration: 8 + index * .6,
        delay: -index * 1.1
    }));
}

function addDab({ x, y, size, color, rotation, opacity, duration, delay }) {
    if (!artsBackground) return;

    const dab = document.createElement("span");
    dab.className = "arts-dab";
    dab.setAttribute("aria-hidden", "true");
    dab.style.left = `${x}%`;
    dab.style.top = `${y}%`;
    dab.style.setProperty("--dab-size", `${size}px`);
    dab.style.setProperty("--dab-color", color);
    dab.style.setProperty("--dab-rotation", `${rotation}deg`);
    dab.style.setProperty("--dab-opacity", opacity);
    dab.style.setProperty("--dab-duration", `${duration}s`);
    dab.style.animationDelay = `${delay}s`;
    artsBackground.appendChild(dab);
}

function createPaintDabs() {
    const palette = [
        "#df4141", "#2457d6", "#249b9a", "#e3bd32",
        "#d53bc2", "#4f9d45", "#9a79d6", "#c92f4b"
    ];

    const dabs = [
        [8, 12, 14], [17, 24, 9], [7, 52, 12], [15, 65, 8],
        [24, 8, 10], [25, 91, 11], [38, 12, 7], [44, 92, 9],
        [56, 10, 8], [58, 91, 12], [70, 8, 9], [75, 93, 8],
        [84, 12, 12], [93, 29, 8], [92, 51, 13], [84, 72, 8],
        [93, 92, 11], [9, 91, 9]
    ];

    dabs.forEach(([x, y, size], index) => {
        addDab({
            x,
            y,
            size,
            color: palette[index % palette.length],
            rotation: artsRandom(-30, 30),
            opacity: artsRandom(.12, .25),
            duration: artsRandom(5.5, 8.5),
            delay: -artsRandom(0, 6)
        });
    });
}

function addTape(x, y, rotation, width = 76) {
    if (!artsBackground) return;

    const tape = document.createElement("span");
    tape.className = "arts-tape";
    tape.setAttribute("aria-hidden", "true");
    tape.style.left = `${x}%`;
    tape.style.top = `${y}%`;
    tape.style.setProperty("--tape-rotation", `${rotation}deg`);
    tape.style.setProperty("--tape-width", `${width}px`);
    tape.style.setProperty("--tape-height", `${Math.max(19, width * .27)}px`);
    artsBackground.appendChild(tape);
}

function createTapeDetails() {
    addTape(20, 31, -7, 68);
    addTape(80, 31, 6, 74);
    addTape(20, 77, 5, 70);
    addTape(80, 77, -6, 68);
}

function addSpeck(x, y, color, size, opacity, delay) {
    if (!artsBackground) return;

    const speck = document.createElement("span");
    speck.className = "arts-speck";
    speck.setAttribute("aria-hidden", "true");
    speck.style.left = `${x}%`;
    speck.style.top = `${y}%`;
    speck.style.setProperty("--speck-color", color);
    speck.style.setProperty("--speck-size", `${size}px`);
    speck.style.setProperty("--speck-opacity", opacity);
    speck.style.setProperty("--speck-duration", `${artsRandom(4, 8)}s`);
    speck.style.animationDelay = `${delay}s`;
    artsBackground.appendChild(speck);
}

function createSpecks() {
    const colors = ["#28231f", "#df4141", "#2457d6", "#249b9a", "#e3bd32"];

    for (let i = 0; i < 42; i++) {
        addSpeck(
            artsRandom(2, 98),
            artsRandom(4, 96),
            colors[i % colors.length],
            artsRandom(2, 4.5),
            artsRandom(.06, .16),
            -artsRandom(0, 7)
        );
    }
}

function createArtsBackground() {
    if (!artsBackground) return;

    createPaintStrokes();
    createTapeDetails();
    createPaintDabs();
    createSpecks();
    createPaintObjects();
}

function artsOriginalMount() {
    if (artsBackground) return;

    artsStylesheet = document.createElement("link");
    artsStylesheet.rel = "stylesheet";
    artsStylesheet.href = "/themes/theme-arts.css";
    artsStylesheet.dataset.theme = "arts";
    document.head.appendChild(artsStylesheet);

    artsBackground = document.createElement("div");
    artsBackground.id = "arts-background";
    artsBackground.setAttribute("aria-hidden", "true");
    document.body.appendChild(artsBackground);

    createArtsBackground();
}

function artsOriginalUnmount() {
    if (artsBackground) {
        artsBackground.remove();
        artsBackground = null;
    }

    if (artsStylesheet) {
        artsStylesheet.remove();
        artsStylesheet = null;
    }
}


/* ============================================================
   INTRO AUDIO ADDITION
   ============================================================ */
let artsIntroAudio = null;
let artsIntroFallback = null;
let artsIntroTimer = null;
const ARTS_INTRO_SRC = "/sounds/intros/grand_project-children-electro-swing-2_medium-178290.mp3";
const ARTS_INTRO_VOLUME = 0.28;
const ARTS_INTRO_END = 20;
const ARTS_INTRO_FADE_START = 15;
const ARTS_INTRO_FULL = false;
const ARTS_INTRO_FADE_END = false;

function artsClearIntroFallback() {
    if (!artsIntroFallback) return;
    window.removeEventListener("pointerdown", artsIntroFallback);
    window.removeEventListener("keydown", artsIntroFallback);
    artsIntroFallback = null;
}

function artsStopIntro() {
    if (artsIntroTimer) {
        clearInterval(artsIntroTimer);
        artsIntroTimer = null;
    }
    artsClearIntroFallback();
    document.body.classList.remove("theme-arts-intro-playing");
    if (artsIntroAudio) {
        try {
            artsIntroAudio.pause();
            artsIntroAudio.currentTime = 0;
        } catch (_) {}
    }
    artsIntroAudio = null;
}

function artsPlayIntro() {
    artsStopIntro();
    const audio = new Audio(ARTS_INTRO_SRC);
    artsIntroAudio = audio;
    audio.preload = "auto";
    audio.volume = ARTS_INTRO_VOLUME;

    audio.addEventListener("playing", () => {
        document.body.classList.add("theme-arts-intro-playing");
        artsClearIntroFallback();
    });

    audio.addEventListener("ended", () => {
        artsStopIntro();
    }, { once: true });

    audio.addEventListener("error", () => {
        artsStopIntro();
    }, { once: true });

    artsIntroTimer = setInterval(() => {
        if (artsIntroAudio !== audio) return;
        const t = audio.currentTime || 0;

        if (ARTS_INTRO_END != null) {
            if (ARTS_INTRO_FADE_START != null && t >= ARTS_INTRO_FADE_START) {
                const len = Math.max(.001, ARTS_INTRO_END - ARTS_INTRO_FADE_START);
                const p = Math.min(1, (t - ARTS_INTRO_FADE_START) / len);
                audio.volume = Math.max(0, ARTS_INTRO_VOLUME * (1 - p));
            }
            if (t >= ARTS_INTRO_END) {
                artsStopIntro();
            }
        } else if (ARTS_INTRO_FULL && ARTS_INTRO_FADE_END &&
                   Number.isFinite(audio.duration) && audio.duration > 0) {
            const remaining = audio.duration - t;
            if (remaining <= 3) {
                audio.volume = Math.max(0, ARTS_INTRO_VOLUME * (remaining / 3));
            }
        }
    }, 120);

    const p = audio.play();
    if (p && typeof p.catch === "function") {
        p.catch(() => {
            if (artsIntroFallback || artsIntroAudio !== audio) return;
            artsIntroFallback = () => {
                if (artsIntroAudio !== audio) return;
                const retry = audio.play();
                if (retry && typeof retry.catch === "function") retry.catch(() => {});
            };
            window.addEventListener("pointerdown", artsIntroFallback);
            window.addEventListener("keydown", artsIntroFallback);
        });
    }
}

export function mount() {
    artsOriginalMount();
    artsPlayIntro();
}

export function unmount() {
    artsStopIntro();
    artsOriginalUnmount();
}
