/* ============================================================
   SKATING
   Uses all supplied /svg/theme-skating assets.
   App layout, spacing, cursor, companions, tabs, and component
   sizing remain untouched.
   ============================================================ */

let themeBackground = null;
let themeStylesheet = null;
let themeAudio = null;
let themeMouseHandler = null;
let themeItems = [];
let lastGlobalSound = 0;

let skatingIntroAudio = null;
let skatingIntroFallbackHandler = null;
let skatingIntroFinished = false;

const SKATING_INTRO_SRC =
    "/sounds/intros/audiogreen-punk-rock-287442.mp3";
const SKATING_INTRO_END = 43;
const SKATING_INTRO_FADE_START = 38;
const SKATING_INTRO_VOLUME = 0.30;

function stopSkatingIntro() {
    if (skatingIntroFallbackHandler) {
        [
            "pointerdown",
            "pointerup",
            "click",
            "touchend",
            "keydown",
            "keyup"
        ].forEach((eventName) => {
            document.removeEventListener(
                eventName,
                skatingIntroFallbackHandler
            );
        });

        skatingIntroFallbackHandler = null;
    }

    if (!skatingIntroAudio) return;

    try {
        skatingIntroAudio.pause();
        skatingIntroAudio.currentTime = 0;
        skatingIntroAudio.volume = SKATING_INTRO_VOLUME;
    } catch (_) {}

    skatingIntroAudio = null;
}

function playSkatingIntro() {
    stopSkatingIntro();
    skatingIntroFinished = false;

    const audio = new Audio(SKATING_INTRO_SRC);
    skatingIntroAudio = audio;

    audio.preload = "auto";
    audio.loop = false;
    audio.volume = SKATING_INTRO_VOLUME;

    const finishIntro = () => {
        if (skatingIntroAudio !== audio) return;

        try {
            audio.pause();
            audio.currentTime = SKATING_INTRO_END;
            audio.volume = 0;
        } catch (_) {}

        skatingIntroFinished = true;
    };

    const updateFade = () => {
        if (skatingIntroAudio !== audio) return;

        const t = audio.currentTime || 0;

        if (t >= SKATING_INTRO_END) {
            finishIntro();
            return;
        }

        if (t >= SKATING_INTRO_FADE_START) {
            const remaining =
                Math.max(0, SKATING_INTRO_END - t);

            const fadeLength =
                SKATING_INTRO_END -
                SKATING_INTRO_FADE_START;

            audio.volume =
                SKATING_INTRO_VOLUME *
                (remaining / fadeLength);
        }
    };

    audio.addEventListener("timeupdate", updateFade);

    audio.addEventListener(
        "error",
        () => {
            /*
             * If the file itself cannot load, do not permanently lock
             * skateboard hover sounds.
             */
            skatingIntroFinished = true;
        },
        { once: true }
    );

    const tryPlay = () => {
        if (skatingIntroAudio !== audio) return;

        const playPromise = audio.play();

        if (
            playPromise &&
            typeof playPromise.catch === "function"
        ) {
            playPromise.catch(() => {
                if (skatingIntroFallbackHandler) return;

                skatingIntroFallbackHandler = () => {
                    const handler =
                        skatingIntroFallbackHandler;

                    [
                        "pointerdown",
                        "pointerup",
                        "click",
                        "touchend",
                        "keydown",
                        "keyup"
                    ].forEach((eventName) => {
                        document.removeEventListener(
                            eventName,
                            handler
                        );
                    });

                    skatingIntroFallbackHandler = null;

                    if (skatingIntroAudio !== audio) return;

                    audio.volume = SKATING_INTRO_VOLUME;

                    const retry = audio.play();

                    if (
                        retry &&
                        typeof retry.catch === "function"
                    ) {
                        retry.catch(() => {});
                    }
                };

                [
                    "pointerdown",
                    "pointerup",
                    "click",
                    "touchend",
                    "keydown",
                    "keyup"
                ].forEach((eventName) => {
                    document.addEventListener(
                        eventName,
                        skatingIntroFallbackHandler,
                        { once: true }
                    );
                });
            });
        }
    };

    tryPlay();
}

const THEME_IMAGES = [
    { src: "/svg/theme-skating/skating-01-pastel-planet-skateboard.svg", width: 156, height: 104, note: 523.25 },
    { src: "/svg/theme-skating/skating-02-pixel-heart-skateboard.svg", width: 156, height: 104, note: 554.37 },
    { src: "/svg/theme-skating/skating-03-daisy-skateboard.svg", width: 156, height: 104, note: 587.33 },
    { src: "/svg/theme-skating/skating-04-fox-skateboard.svg", width: 156, height: 104, note: 622.25 },
    { src: "/svg/theme-skating/skating-05-strawberry-cherry-skateboard.svg", width: 156, height: 104, note: 659.25 },
    { src: "/svg/theme-skating/skating-06-ufo-skateboard.svg", width: 156, height: 104, note: 698.46 },
    { src: "/svg/theme-skating/skating-07-milkshake-skateboard.svg", width: 156, height: 104, note: 739.99 },
    { src: "/svg/theme-skating/skating-08-cute-doodle-skateboard.svg", width: 156, height: 104, note: 783.99 },
    { src: "/svg/theme-skating/skating-09-jellyfish-skateboard.svg", width: 156, height: 104, note: 830.61 }
];

const TOTAL_OBJECT_COUNT = 12;
const SKATING_SIZE_MULTIPLIER = 1.72;

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
    // Do not play skateboard hover sounds until the intro song is finished.
    if (!skatingIntroFinished) return;

    const ctx = getAudio();
    if (!ctx) return;

    const now = ctx.currentTime;
    const master = ctx.createGain();
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const g2 = ctx.createGain();

    filter.type = "lowpass";
    filter.frequency.setValueAtTime(3000, now);

    master.gain.setValueAtTime(0.0001, now);
    master.gain.exponentialRampToValueAtTime(0.07, now + 0.006);
    master.gain.exponentialRampToValueAtTime(0.0001, now + 0.34);

    osc1.type = "square";
    osc1.frequency.setValueAtTime(freq, now);
    osc1.frequency.exponentialRampToValueAtTime(freq * 1.08, now + 0.07);

    osc2.type = "triangle";
    osc2.frequency.setValueAtTime(freq * 1.5, now);

    g2.gain.setValueAtTime(0.11, now);
    g2.gain.exponentialRampToValueAtTime(0.0001, now + 0.16);

    osc1.connect(filter);
    osc2.connect(g2);
    g2.connect(filter);
    filter.connect(master);
    master.connect(ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.38);
    osc2.stop(now + 0.22);
}

function buildBackdrop() {
    const haze = document.createElement("div");
    haze.className = "theme-skating-haze";
    themeBackground.appendChild(haze);

    const grid = document.createElement("div");
    grid.className = "theme-skating-grid";
    themeBackground.appendChild(grid);

    const ramps = document.createElement("div");
    ramps.className = "theme-skating-ramps";
    themeBackground.appendChild(ramps);

    const ground = document.createElement("div");
    ground.className = "theme-skating-ground";
    themeBackground.appendChild(ground);
}

function addObject(asset, placement) {
    const item = document.createElement("div");
    item.className = "theme-skating-item" +
        (placement.soft ? " theme-skating-soft" : "") +
        (placement.emphasis ? " theme-skating-emphasis" : "");

    item.style.left = placement.left;
    item.style.top = placement.top;
    item.style.width = (asset.width * SKATING_SIZE_MULTIPLIER) + "px";
    item.style.height = (asset.height * SKATING_SIZE_MULTIPLIER) + "px";
    item.style.setProperty("--item-scale", placement.scale);
    item.style.setProperty("--item-rotate", placement.rotate + "deg");
    item.style.setProperty("--item-delay", (-rand(0, 8)).toFixed(2) + "s");
    item.style.setProperty("--item-x", rand(-12, 12).toFixed(1) + "px");
    item.style.setProperty("--item-y", rand(-7, 7).toFixed(1) + "px");
    item.style.setProperty("--item-opacity", String(placement.opacity));
    item.setAttribute("aria-hidden", "true");

    const img = document.createElement("img");
    img.className = "theme-skating-object-image";
    img.src = asset.src;
    img.alt = "";
    img.draggable = false;
    img.decoding = "async";
    img.addEventListener("error", () => item.remove(), { once: true });

    item.appendChild(img);
    themeBackground.appendChild(item);

    themeItems.push({ el: item, note: asset.note, last: 0 });
}

function overlaps(a, b, gap) {
    return !(
        a.right + gap <= b.left ||
        a.left >= b.right + gap ||
        a.bottom + gap <= b.top ||
        a.top >= b.bottom + gap
    );
}

function generatePlacements() {
    const mobile = (window.innerWidth || 1440) < 700;

    /*
     * Twelve large, evenly spread skateboard positions.
     * The title/header center remains open.
     */
    const slots = [
        [7, 20, "edge"], [29, 24, "upper"], [71, 24, "upper"], [93, 20, "edge"],
        [8, 46, "edge"], [31, 44, "inner"], [69, 44, "inner"], [92, 46, "edge"],
        [11, 73, "bottom"], [37, 72, "bottom"], [63, 72, "bottom"], [89, 73, "bottom"]
    ];

    const repeatsNeeded =
        Math.max(0, TOTAL_OBJECT_COUNT - THEME_IMAGES.length);
    const pool = shuffle(
        THEME_IMAGES.concat(
            shuffle(THEME_IMAGES).slice(0, repeatsNeeded)
        )
    );

    return pool.map((asset, index) => {
        const [x, y, type] = slots[index];
        const soft = false;

        let scaleMin = mobile ? 0.76 : 0.98;
        let scaleMax = mobile ? 0.96 : 1.22;

        if (type === "edge" || type === "bottom") {
            scaleMin += mobile ? 0.03 : 0.05;
            scaleMax += mobile ? 0.03 : 0.07;
        }

        return {
            asset,
            left: `${x + rand(-1.2, 1.2)}%`,
            top: `${y + rand(-1.0, 1.0)}%`,
            scale: Number(rand(scaleMin, scaleMax).toFixed(3)),
            rotate: rand(-9, 9),
            opacity: Number(rand(0.72, 0.92).toFixed(2)),
            soft,
            emphasis: type === "edge" || type === "bottom"
        };
    });
}

function createObjects() {
    generatePlacements().forEach((placement) => addObject(placement.asset, placement));
}

function startInteraction() {
    const radius = 72;

    themeMouseHandler = (event) => {
        const now = performance.now();

        themeItems.forEach((obj) => {
            const r = obj.el.getBoundingClientRect();
            const cx = r.left + r.width / 2;
            const cy = r.top + r.height / 2;

            if (
                Math.hypot(cx - event.clientX, cy - event.clientY) <= radius &&
                now - obj.last > 650 &&
                now - lastGlobalSound > 110
            ) {
                obj.last = now;
                lastGlobalSound = now;

                obj.el.classList.remove("theme-skating-react");
                void obj.el.offsetWidth;
                obj.el.classList.add("theme-skating-react");

                playThemeSound(obj.note);

                setTimeout(() => obj.el.classList.remove("theme-skating-react"), 520);
            }
        });
    };

    window.addEventListener("mousemove", themeMouseHandler, { passive: true });
}

export function mount() {
    if (themeBackground) return;

    skatingIntroFinished = false;
    playSkatingIntro();

    themeStylesheet = document.createElement("link");
    themeStylesheet.rel = "stylesheet";
    themeStylesheet.href = "/themes/theme-skating.css";
    themeStylesheet.dataset.theme = "skating";
    document.head.appendChild(themeStylesheet);

    themeBackground = document.createElement("div");
    themeBackground.id = "skating-background";
    themeBackground.setAttribute("aria-hidden", "true");
    document.body.appendChild(themeBackground);

    buildBackdrop();
    createObjects();
    startInteraction();
}

export function unmount() {
    stopSkatingIntro();
    skatingIntroFinished = false;

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
