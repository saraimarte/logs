/* ============================================================
   GARDEN
   Real /svg/theme-garden assets with randomized non-overlapping
   placement on each mount.
   - Preserves app structure and functionality
   - Preserves cursor system
   - Preserves companion positioning/movement
   - Parent filter/category containers remain transparent
   - Small buttons/cards use neutral hover states
   ============================================================ */

let themeBackground = null;
let themeStylesheet = null;
let themeAudio = null;
let themeMouseHandler = null;
let themeItems = [];
let lastGlobalSound = 0;

const THEME_IMAGES = [
    { src: "/svg/theme-garden/garden-01-mushrooms.svg", width: 148, height: 138, note: 523.25, className: "theme-garden-mushrooms-1" },
    { src: "/svg/theme-garden/garden-02-frog.svg", width: 136, height: 126, note: 587.33, className: "theme-garden-frog" },
    { src: "/svg/theme-garden/garden-03-tree.svg", width: 146, height: 188, note: 392.0, className: "theme-garden-tree" },
    { src: "/svg/theme-garden/garden-04-green-butterfly.svg", width: 124, height: 112, note: 783.99, className: "theme-garden-butterfly-green" },
    { src: "/svg/theme-garden/garden-05-mushrooms.svg", width: 144, height: 134, note: 554.37, className: "theme-garden-mushrooms-2" },
    { src: "/svg/theme-garden/garden-06-orange-butterfly.svg", width: 124, height: 112, note: 830.61, className: "theme-garden-butterfly-orange" },
    { src: "/svg/theme-garden/garden-07-pine-tree.svg", width: 144, height: 186, note: 369.99, className: "theme-garden-pine-tree" },
    { src: "/svg/theme-garden/garden-08-fawn.svg", width: 150, height: 134, note: 440.0, className: "theme-garden-fawn" },
    { src: "/svg/theme-garden/garden-09-ancient-tree.svg", width: 152, height: 192, note: 329.63, className: "theme-garden-ancient-tree" },
    { src: "/svg/theme-garden/garden-10-white-lily.svg", width: 126, height: 156, note: 659.25, className: "theme-garden-white-lily" },
    { src: "/svg/theme-garden/garden-11-burgundy-iris.svg", width: 122, height: 164, note: 622.25, className: "theme-garden-burgundy-iris" },
    { src: "/svg/theme-garden/garden-12-green-flower.svg", width: 126, height: 148, note: 698.46, className: "theme-garden-green-flower" },
    { src: "/svg/theme-garden/garden-13-golden-lily.svg", width: 126, height: 154, note: 739.99, className: "theme-garden-golden-lily" },
    { src: "/svg/theme-garden/garden-14-green-beetle.svg", width: 112, height: 108, note: 466.16, className: "theme-garden-beetle" },
    { src: "/svg/theme-garden/garden-15-white-orange-lily.svg", width: 126, height: 154, note: 659.25, className: "theme-garden-white-orange-lily" },
    { src: "/svg/theme-garden/garden-16-white-flower-branch.svg", width: 158, height: 144, note: 493.88, className: "theme-garden-flower-branch" },
    { src: "/svg/theme-garden/garden-17-winged-frog.svg", width: 142, height: 132, note: 523.25, className: "theme-garden-winged-frog" },
    { src: "/svg/theme-garden/garden-18-praying-mantis.svg", width: 112, height: 170, note: 415.3, className: "theme-garden-praying-mantis" }
];

const TOTAL_OBJECT_COUNT = 18;
const GARDEN_SIZE_MULTIPLIER = 1.55;

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
    const ctx = getAudio();
    if (!ctx) return;

    const now = ctx.currentTime;
    const master = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const harmonic = ctx.createGain();

    filter.type = "lowpass";
    filter.frequency.setValueAtTime(3200, now);
    filter.Q.setValueAtTime(0.75, now);

    master.gain.setValueAtTime(0.0001, now);
    master.gain.exponentialRampToValueAtTime(0.095, now + 0.01);
    master.gain.exponentialRampToValueAtTime(0.0001, now + 0.48);

    osc1.type = "sine";
    osc1.frequency.setValueAtTime(freq, now);
    osc1.frequency.exponentialRampToValueAtTime(freq * 1.07, now + 0.12);

    osc2.type = "triangle";
    osc2.frequency.setValueAtTime(freq * 1.98, now);

    harmonic.gain.setValueAtTime(0.16, now);
    harmonic.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);

    osc1.connect(filter);
    osc2.connect(harmonic);
    harmonic.connect(filter);
    filter.connect(master);
    master.connect(ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.52);
    osc2.stop(now + 0.26);
}

function buildBackdrop() {
    const skyGlow = document.createElement("div");
    skyGlow.className = "theme-garden-skyglow";
    themeBackground.appendChild(skyGlow);

    const dapple = document.createElement("div");
    dapple.className = "theme-garden-dapple";
    themeBackground.appendChild(dapple);

    const vines = document.createElement("div");
    vines.className = "theme-garden-vines";
    themeBackground.appendChild(vines);

    const meadow = document.createElement("div");
    meadow.className = "theme-garden-meadow";
    themeBackground.appendChild(meadow);
}

function addObject(asset, placement) {
    const item = document.createElement("div");
    item.className = [
        "theme-garden-item",
        asset.className,
        placement.soft ? "theme-garden-soft" : "",
        placement.emphasis ? "theme-garden-emphasis" : ""
    ].filter(Boolean).join(" ");

    item.style.left = placement.left;
    item.style.top = placement.top;
    item.style.width = (asset.width * GARDEN_SIZE_MULTIPLIER) + "px";
    item.style.height = (asset.height * GARDEN_SIZE_MULTIPLIER) + "px";
    item.style.setProperty("--item-scale", placement.scale);
    item.style.setProperty("--item-rotate", placement.rotate + "deg");
    item.style.setProperty("--item-delay", (-rand(0, 8)).toFixed(2) + "s");
    item.style.setProperty("--item-x", rand(-10, 10).toFixed(1) + "px");
    item.style.setProperty("--item-y", rand(-8, 8).toFixed(1) + "px");
    item.style.setProperty("--item-opacity", String(placement.opacity));
    item.setAttribute("aria-hidden", "true");

    const img = document.createElement("img");
    img.className = "theme-garden-object-image";
    img.src = asset.src;
    img.alt = "";
    img.draggable = false;
    img.decoding = "async";
    img.addEventListener("error", () => item.remove(), { once: true });

    item.appendChild(img);
    themeBackground.appendChild(item);

    themeItems.push({
        el: item,
        note: asset.note,
        last: 0
    });
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
     * Large, balanced garden positions. The center-top remains open for
     * the page title, but the rest of the screen gets much larger artwork.
     */
    const slots = [
        [7, 18, "edge"], [24, 22, "upper"], [76, 22, "upper"], [93, 18, "edge"],
        [7, 40, "edge"], [27, 39, "inner"], [50, 36, "inner"], [73, 39, "inner"], [93, 40, "edge"],
        [7, 63, "edge"], [28, 61, "inner"], [50, 63, "inner"], [72, 61, "inner"], [93, 63, "edge"],
        [10, 85, "bottom"], [36, 84, "bottom"], [64, 84, "bottom"], [90, 85, "bottom"]
    ];

    const pool = shuffle(THEME_IMAGES).slice(0, TOTAL_OBJECT_COUNT);

    return pool.map((asset, index) => {
        const [x, y, type] = slots[index];
        const soft = false;

        let scaleMin = mobile ? 0.72 : 0.98;
        let scaleMax = mobile ? 0.92 : 1.24;

        if (type === "edge" || type === "bottom") {
            scaleMin += mobile ? 0.03 : 0.06;
            scaleMax += mobile ? 0.03 : 0.08;
        }

        if (
            asset.className.includes("tree") ||
            asset.className.includes("lily") ||
            asset.className.includes("iris")
        ) {
            scaleMin *= 0.92;
            scaleMax *= 0.96;
        }

        return {
            asset,
            left: `${x + rand(-1.6, 1.6)}%`,
            top: `${y + rand(-1.2, 1.2)}%`,
            scale: Number(rand(scaleMin, scaleMax).toFixed(3)),
            rotate: rand(-10, 10),
            opacity: Number(rand(0.70, 0.92).toFixed(2)),
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

                obj.el.classList.remove("theme-garden-react");
                void obj.el.offsetWidth;
                obj.el.classList.add("theme-garden-react");

                playThemeSound(obj.note);

                setTimeout(() => obj.el.classList.remove("theme-garden-react"), 520);
            }
        });
    };

    window.addEventListener("mousemove", themeMouseHandler, { passive: true });
}

function gardenOriginalMount() {
    if (themeBackground) return;

    themeStylesheet = document.createElement("link");
    themeStylesheet.rel = "stylesheet";
    themeStylesheet.href = "/themes/theme-garden.css";
    themeStylesheet.dataset.theme = "garden";
    document.head.appendChild(themeStylesheet);

    themeBackground = document.createElement("div");
    themeBackground.id = "garden-background";
    themeBackground.setAttribute("aria-hidden", "true");
    document.body.appendChild(themeBackground);

    buildBackdrop();
    createObjects();
    startInteraction();
}

function gardenOriginalUnmount() {
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


/* ============================================================
   INTRO AUDIO ADDITION
   ============================================================ */
let gardenIntroAudio = null;
let gardenIntroFallback = null;
let gardenIntroTimer = null;
const GARDEN_INTRO_SRC = "/sounds/intros/nricardoaudiovisual-bambu-garden-zen-581742.mp3";
const GARDEN_INTRO_VOLUME = 0.29;
const GARDEN_INTRO_END = 53;
const GARDEN_INTRO_FADE_START = 47;
const GARDEN_INTRO_FULL = false;
const GARDEN_INTRO_FADE_END = false;

function gardenClearIntroFallback() {
    if (!gardenIntroFallback) return;
    window.removeEventListener("pointerdown", gardenIntroFallback);
    window.removeEventListener("keydown", gardenIntroFallback);
    gardenIntroFallback = null;
}

function gardenStopIntro() {
    if (gardenIntroTimer) {
        clearInterval(gardenIntroTimer);
        gardenIntroTimer = null;
    }
    gardenClearIntroFallback();
    document.body.classList.remove("theme-garden-intro-playing");
    if (gardenIntroAudio) {
        try {
            gardenIntroAudio.pause();
            gardenIntroAudio.currentTime = 0;
        } catch (_) {}
    }
    gardenIntroAudio = null;
}

function gardenPlayIntro() {
    gardenStopIntro();
    const audio = new Audio(GARDEN_INTRO_SRC);
    gardenIntroAudio = audio;
    audio.preload = "auto";
    audio.volume = GARDEN_INTRO_VOLUME;

    audio.addEventListener("playing", () => {
        document.body.classList.add("theme-garden-intro-playing");
        gardenClearIntroFallback();
    });

    audio.addEventListener("ended", () => {
        gardenStopIntro();
    }, { once: true });

    audio.addEventListener("error", () => {
        gardenStopIntro();
    }, { once: true });

    gardenIntroTimer = setInterval(() => {
        if (gardenIntroAudio !== audio) return;
        const t = audio.currentTime || 0;

        if (GARDEN_INTRO_END != null) {
            if (GARDEN_INTRO_FADE_START != null && t >= GARDEN_INTRO_FADE_START) {
                const len = Math.max(.001, GARDEN_INTRO_END - GARDEN_INTRO_FADE_START);
                const p = Math.min(1, (t - GARDEN_INTRO_FADE_START) / len);
                audio.volume = Math.max(0, GARDEN_INTRO_VOLUME * (1 - p));
            }
            if (t >= GARDEN_INTRO_END) {
                gardenStopIntro();
            }
        } else if (GARDEN_INTRO_FULL && GARDEN_INTRO_FADE_END &&
                   Number.isFinite(audio.duration) && audio.duration > 0) {
            const remaining = audio.duration - t;
            if (remaining <= 3) {
                audio.volume = Math.max(0, GARDEN_INTRO_VOLUME * (remaining / 3));
            }
        }
    }, 120);

    const p = audio.play();
    if (p && typeof p.catch === "function") {
        p.catch(() => {
            if (gardenIntroFallback || gardenIntroAudio !== audio) return;
            gardenIntroFallback = () => {
                if (gardenIntroAudio !== audio) return;
                const retry = audio.play();
                if (retry && typeof retry.catch === "function") retry.catch(() => {});
            };
            window.addEventListener("pointerdown", gardenIntroFallback);
            window.addEventListener("keydown", gardenIntroFallback);
        });
    }
}

export function mount() {
    gardenOriginalMount();
    gardenPlayIntro();
}

export function unmount() {
    gardenStopIntro();
    gardenOriginalUnmount();
}
