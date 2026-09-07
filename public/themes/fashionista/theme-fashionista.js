/* ============================================================
   FASHIONISTA
   Elegant editorial-fashion theme.

   IMPORTANT:
   - Decorative layer only.
   - Uses the SVGs supplied in /public/svg/theme-fashionista.
   - Does NOT modify application layout, selector positioning,
     cursor logic, companion logic, tabs, or modal behavior.
   ============================================================ */

let fashionistaBackground = null;
let fashionistaStylesheet = null;
let fashionistaBackgroundSVG = null;
let fashionistaIntroAudio = null;
let fashionistaIntroFallbackHandler = null;
let fashionistaPointerHandler = null;
let fashionistaPointerFrame = null;
let fashionistaHoveredItem = null;
let uniqueCounter = 0;

const FASHIONISTA_INTRO_SRC =
    "/sounds/intros/mondamusic-fashion-fashion-show-vogue-512838.mp3";
const FASHIONISTA_INTRO_END = 39;
const FASHIONISTA_INTRO_FADE_START = 34;
const FASHIONISTA_INTRO_VOLUME = 0.30;

function stopFashionistaIntro() {
    if (fashionistaIntroFallbackHandler) {
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
                fashionistaIntroFallbackHandler
            );
        });

        fashionistaIntroFallbackHandler = null;
    }

    if (!fashionistaIntroAudio) return;

    try {
        fashionistaIntroAudio.pause();
        fashionistaIntroAudio.currentTime = 0;
        fashionistaIntroAudio.volume = FASHIONISTA_INTRO_VOLUME;
    } catch (_) {}

    fashionistaIntroAudio = null;
}

function playFashionistaIntro() {
    stopFashionistaIntro();

    const audio = new Audio(FASHIONISTA_INTRO_SRC);
    fashionistaIntroAudio = audio;

    audio.preload = "auto";
    audio.loop = false;
    audio.volume = FASHIONISTA_INTRO_VOLUME;

    const updateFade = () => {
        if (fashionistaIntroAudio !== audio) return;

        const t = audio.currentTime || 0;

        if (t >= FASHIONISTA_INTRO_END) {
            audio.pause();
            audio.currentTime = FASHIONISTA_INTRO_END;
            audio.volume = 0;
            return;
        }

        if (t >= FASHIONISTA_INTRO_FADE_START) {
            const remaining =
                Math.max(0, FASHIONISTA_INTRO_END - t);

            const fadeLength =
                FASHIONISTA_INTRO_END -
                FASHIONISTA_INTRO_FADE_START;

            audio.volume =
                FASHIONISTA_INTRO_VOLUME *
                (remaining / fadeLength);
        }
    };

    audio.addEventListener("timeupdate", updateFade);

    const tryPlay = () => {
        if (fashionistaIntroAudio !== audio) return;

        const playPromise = audio.play();

        if (
            playPromise &&
            typeof playPromise.catch === "function"
        ) {
            playPromise.catch(() => {
                if (fashionistaIntroFallbackHandler) return;

                fashionistaIntroFallbackHandler = () => {
                    const handler =
                        fashionistaIntroFallbackHandler;

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

                    fashionistaIntroFallbackHandler = null;

                    if (fashionistaIntroAudio !== audio) return;

                    audio.volume = FASHIONISTA_INTRO_VOLUME;

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
                        fashionistaIntroFallbackHandler,
                        { once: true }
                    );
                });
            });
        }
    };

    tryPlay();
}

/* ============================================================
   EXTERNAL FASHION SVG COLLECTION
   ============================================================ */

const FASHION_SVGS = {
    clocheHat: "/svg/theme-fashionista/hat1.svg",
    hat2: "/svg/theme-fashionista/hat2.svg",

    pump: "/svg/theme-fashionista/shoe5_pump.svg",
    loafer: "/svg/theme-fashionista/shoe2_loafers.svg",
    flats: "/svg/theme-fashionista/shoe1_flats.svg",
    heels: "/svg/theme-fashionista/shoe3_heels.svg",
    heelSandal: "/svg/theme-fashionista/shoe4_sandals.svg",

    handbag: "/svg/theme-fashionista/purse1.svg",
    clutch: "/svg/theme-fashionista/purse2.svg",
    purse3: "/svg/theme-fashionista/purse3.svg",
    bucketBag: "/svg/theme-fashionista/purse4_bucket.svg",

    tie: "/svg/theme-fashionista/scarf1_tie.svg",
    scarf2: "/svg/theme-fashionista/scarf2.svg",

    earrings: "/svg/theme-fashionista/earrings1.svg"
};

/*
 * Only objects that actually exist in the supplied folder are used.
 * This prevents broken-image placeholders from ever appearing.
 */
const FASHION_OBJECTS = [
    { type: "clocheHat",  file: FASHION_SVGS.clocheHat },
    { type: "hat2",       file: FASHION_SVGS.hat2 },
    { type: "pump",       file: FASHION_SVGS.pump },
    { type: "loafer",     file: FASHION_SVGS.loafer },
    { type: "flats",      file: FASHION_SVGS.flats },
    { type: "heels",      file: FASHION_SVGS.heels },
    { type: "heelSandal", file: FASHION_SVGS.heelSandal },
    { type: "handbag",    file: FASHION_SVGS.handbag },
    { type: "clutch",     file: FASHION_SVGS.clutch },
    { type: "purse3",      file: FASHION_SVGS.purse3 },
    { type: "bucketBag",  file: FASHION_SVGS.bucketBag },
    { type: "tie",         file: FASHION_SVGS.tie },
    { type: "scarf2",      file: FASHION_SVGS.scarf2 },
    { type: "earrings",    file: FASHION_SVGS.earrings }
];

/* ============================================================
   HELPERS
   ============================================================ */

function fashionRandom(min, max) {
    return Math.random() * (max - min) + min;
}

function fashionShuffle(array) {
    const copy = [...array];

    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }

    return copy;
}

/* ============================================================
   BACKGROUND SVG
   ============================================================ */

function createFashionBackgroundSVG() {
    if (!fashionistaBackground) return;

    fashionistaBackgroundSVG = document.createElement("img");
    fashionistaBackgroundSVG.className = "fashionista-background-svg";
    fashionistaBackgroundSVG.src = "/svg/theme-fashionista/fashionista-background.svg";
    fashionistaBackgroundSVG.alt = "";
    fashionistaBackgroundSVG.setAttribute("aria-hidden", "true");
    fashionistaBackgroundSVG.draggable = false;

    fashionistaBackground.appendChild(fashionistaBackgroundSVG);
}

/* ============================================================
   INTERACTIVE EDITORIAL BACKDROP
   ============================================================ */

function createInteractiveBackdrop() {
    if (!fashionistaBackground) return;

    const spotlight = document.createElement("div");
    spotlight.className = "fashionista-pointer-spotlight";
    fashionistaBackground.appendChild(spotlight);

    const runway = document.createElement("div");
    runway.className = "fashionista-runway";
    fashionistaBackground.appendChild(runway);

    const frame = document.createElement("div");
    frame.className = "fashionista-editorial-frame";
    fashionistaBackground.appendChild(frame);

    for (let i = 0; i < 4; i++) {
        const ring = document.createElement("span");
        ring.className =
            `fashionista-orbit fashionista-orbit-${i + 1}`;
        ring.style.setProperty(
            "--orbit-delay",
            `${-fashionRandom(0, 10)}s`
        );
        ring.style.setProperty(
            "--orbit-duration",
            `${fashionRandom(12, 20)}s`
        );
        fashionistaBackground.appendChild(ring);
    }

    for (let i = 0; i < 9; i++) {
        const stitch = document.createElement("span");
        stitch.className = "fashionista-stitch";
        stitch.style.left = `${fashionRandom(3, 97)}%`;
        stitch.style.top = `${fashionRandom(18, 95)}%`;
        stitch.style.setProperty(
            "--stitch-rotate",
            `${fashionRandom(-25, 25)}deg`
        );
        stitch.style.setProperty(
            "--stitch-delay",
            `${-fashionRandom(0, 8)}s`
        );
        fashionistaBackground.appendChild(stitch);
    }
}

function createFashionHoverBurst(item) {
    if (!fashionistaBackground || !item) return;

    const rect = item.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    for (let i = 0; i < 8; i++) {
        const sparkle = document.createElement("span");
        sparkle.className = "fashionista-hover-spark";

        const angle = (Math.PI * 2 * i) / 8 +
            fashionRandom(-0.20, 0.20);

        const distance = fashionRandom(34, 66);

        sparkle.style.left = `${centerX}px`;
        sparkle.style.top = `${centerY}px`;

        sparkle.style.setProperty(
            "--spark-x",
            `${Math.cos(angle) * distance}px`
        );

        sparkle.style.setProperty(
            "--spark-y",
            `${Math.sin(angle) * distance}px`
        );

        sparkle.style.setProperty(
            "--spark-size",
            `${fashionRandom(4, 8)}px`
        );

        fashionistaBackground.appendChild(sparkle);

        setTimeout(() => {
            sparkle.remove();
        }, 760);
    }
}

function setFashionHoveredItem(nextItem) {
    if (fashionistaHoveredItem === nextItem) return;

    if (fashionistaHoveredItem) {
        fashionistaHoveredItem.classList.remove(
            "fashionista-hovered"
        );
    }

    fashionistaHoveredItem = nextItem;

    if (fashionistaHoveredItem) {
        fashionistaHoveredItem.classList.remove(
            "fashionista-hover-pop"
        );

        void fashionistaHoveredItem.offsetWidth;

        fashionistaHoveredItem.classList.add(
            "fashionista-hovered",
            "fashionista-hover-pop"
        );

        createFashionHoverBurst(
            fashionistaHoveredItem
        );

        setTimeout(() => {
            if (fashionistaHoveredItem) {
                fashionistaHoveredItem.classList.remove(
                    "fashionista-hover-pop"
                );
            }
        }, 760);
    }
}

function findFashionItemAtPoint(x, y) {
    if (!fashionistaBackground) return null;

    const items =
        fashionistaBackground.querySelectorAll(
            ".fashionista-item"
        );

    let best = null;
    let bestDistance = Infinity;

    items.forEach((item) => {
        const rect = item.getBoundingClientRect();

        /*
         * Slightly generous hover box so the interaction feels natural
         * even around transparent parts of an SVG.
         */
        const padX = Math.min(16, rect.width * 0.08);
        const padY = Math.min(16, rect.height * 0.08);

        if (
            x < rect.left - padX ||
            x > rect.right + padX ||
            y < rect.top - padY ||
            y > rect.bottom + padY
        ) {
            return;
        }

        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const distance =
            Math.hypot(x - cx, y - cy);

        if (distance < bestDistance) {
            bestDistance = distance;
            best = item;
        }
    });

    return best;
}

function enableFashionistaInteractivity() {
    if (!fashionistaBackground) return;

    fashionistaPointerHandler = (event) => {
        if (!fashionistaBackground) return;

        const x = event.clientX;
        const y = event.clientY;

        if (fashionistaPointerFrame) {
            cancelAnimationFrame(fashionistaPointerFrame);
        }

        fashionistaPointerFrame =
            requestAnimationFrame(() => {
                if (!fashionistaBackground) return;

                const px =
                    (x / Math.max(window.innerWidth, 1)) * 100;
                const py =
                    (y / Math.max(window.innerHeight, 1)) * 100;

                fashionistaBackground.style.setProperty(
                    "--fashion-pointer-x",
                    `${px}%`
                );

                fashionistaBackground.style.setProperty(
                    "--fashion-pointer-y",
                    `${py}%`
                );

                const parallaxX =
                    ((x / Math.max(window.innerWidth, 1)) - 0.5) * 12;

                const parallaxY =
                    ((y / Math.max(window.innerHeight, 1)) - 0.5) * 8;

                fashionistaBackground.style.setProperty(
                    "--fashion-parallax-x",
                    `${parallaxX}px`
                );

                fashionistaBackground.style.setProperty(
                    "--fashion-parallax-y",
                    `${parallaxY}px`
                );

                setFashionHoveredItem(
                    findFashionItemAtPoint(x, y)
                );

                fashionistaPointerFrame = null;
            });
    };

    document.addEventListener(
        "pointermove",
        fashionistaPointerHandler,
        { passive: true }
    );
}

function disableFashionistaInteractivity() {
    if (fashionistaPointerHandler) {
        document.removeEventListener(
            "pointermove",
            fashionistaPointerHandler
        );
        fashionistaPointerHandler = null;
    }

    if (fashionistaPointerFrame) {
        cancelAnimationFrame(
            fashionistaPointerFrame
        );
        fashionistaPointerFrame = null;
    }

    setFashionHoveredItem(null);
}

/* ============================================================
   OBJECT CREATION
   ============================================================ */

function addFashionObject({
    type,
    file,
    left,
    top,
    scale = 1,
    depth = 1,
    rotate = 0,
    opacity = 0.20,
    duration = null,
    delay = null,
    driftX = null,
    driftY = null
}) {
    if (!fashionistaBackground || !file) return;

    uniqueCounter++;

    const object = document.createElement("div");

    object.className =
        `fashionista-item fashionista-depth-${depth} fashionista-${type}`;

    object.setAttribute("aria-hidden", "true");

    object.style.left = left;
    object.style.top = top;
    object.style.setProperty("--object-scale", scale);
    object.style.setProperty("--object-rotate", `${rotate}deg`);
    object.style.setProperty("--object-opacity", opacity);

    object.style.setProperty(
        "--fashion-duration",
        duration ?? `${fashionRandom(7.5, 12.5)}s`
    );

    object.style.setProperty(
        "--fashion-delay",
        delay ?? `${-fashionRandom(0, 9)}s`
    );

    object.style.setProperty(
        "--fashion-drift-x",
        driftX ?? `${fashionRandom(-12, 12)}px`
    );

    object.style.setProperty(
        "--fashion-drift-y",
        driftY ?? `${fashionRandom(-9, 9)}px`
    );

    const img = document.createElement("img");

    img.className = "fashionista-svg-object";
    img.src = file;
    img.alt = "";
    img.draggable = false;
    img.setAttribute("aria-hidden", "true");

    object.appendChild(img);

    fashionistaBackground.appendChild(object);
}

/* ============================================================
   RANDOMIZED OBJECT LAYOUT
   ============================================================ */

function createFashionObjects() {
    if (!fashionistaBackground) return;

    /*
     * Loose editorial distribution:
     * - The title/header area stays clear.
     * - The middle has a few spaced accents.
     * - The sides and especially the lower portion have more relaxed,
     *   slightly irregular placement.
     * - Positions are deliberately not a rigid grid.
     */
    const positions = [
        // Upper area, below page titles
        { x: 10, y: 24 },
        { x: 35, y: 27 },
        { x: 64, y: 24 },
        { x: 88, y: 29 },

        // Middle, intentionally sparse
        { x: 7,  y: 45 },
        { x: 30, y: 50 },
        { x: 73, y: 47 },
        { x: 94, y: 53 },

        // Lower half, looser distribution
        { x: 14, y: 65 },
        { x: 43, y: 61 },
        { x: 67, y: 66 },
        { x: 87, y: 70 },

        // Bottom area, more relaxed and varied
        { x: 5,  y: 84 },
        { x: 25, y: 76 },
        { x: 51, y: 87 },
        { x: 75, y: 80 },
        { x: 94, y: 91 }
    ];

    /*
     * Repeat the available SVGs naturally. Keeping the position map fixed
     * gives a consistent loose composition while allowing duplicate purses,
     * shoes, hats, etc. to appear at the same time.
     */
    const objects = [];
    for (let i = 0; i < positions.length; i++) {
        objects.push(FASHION_OBJECTS[i % FASHION_OBJECTS.length]);
    }

    const shuffledObjects = fashionShuffle(objects);

    shuffledObjects.forEach((item, index) => {
        const position = positions[index];

        let scale;

        if (item.type === "earrings") {
            scale = fashionRandom(0.58, 0.70);
        } else if (
            item.type === "pump" ||
            item.type === "heels" ||
            item.type === "flats" ||
            item.type === "heelSandal"
        ) {
            scale = fashionRandom(0.66, 0.80);
        } else if (
            item.type === "handbag" ||
            item.type === "clutch" ||
            item.type === "bucketBag" ||
            item.type === "purse3"
        ) {
            scale = fashionRandom(0.69, 0.84);
        } else if (item.type === "tie" || item.type === "scarf2") {
            scale = fashionRandom(0.62, 0.78);
        } else {
            scale = fashionRandom(0.72, 0.86);
        }

        /*
         * Tiny positional variation keeps the layout organic without making
         * objects drift into one another.
         */
        const jitterX = fashionRandom(-2.5, 2.5);
        const jitterY = fashionRandom(-2.0, 2.0);

        addFashionObject({
            type: item.type,
            file: item.file,
            left: `${position.x + jitterX}%`,
            top: `${position.y + jitterY}%`,
            scale,
            depth: 1,
            rotate: fashionRandom(-7, 7),
            opacity: 1,
            duration: `${fashionRandom(7.5, 10.5)}s`,
            delay: `${-fashionRandom(0, 10)}s`,
            driftX: `${fashionRandom(-4, 4)}px`,
            driftY: `${fashionRandom(-4, 4)}px`
        });
    });
}



/* ============================================================
   SOFT GLINTS
   ============================================================ */

function createGlints() {
    if (!fashionistaBackground) return;

    for (let i = 0; i < 16; i++) {
        const glint = document.createElement("span");

        glint.className = "fashionista-glint";

        glint.style.left = `${fashionRandom(4, 96)}%`;
        glint.style.top = `${fashionRandom(5, 95)}%`;

        glint.style.setProperty(
            "--glint-delay",
            `${-fashionRandom(0, 9)}s`
        );

        glint.style.setProperty(
            "--glint-duration",
            `${fashionRandom(5, 9)}s`
        );

        glint.style.setProperty(
            "--glint-scale",
            `${fashionRandom(0.55, 1.25)}`
        );

        fashionistaBackground.appendChild(glint);
    }
}

/* ============================================================
   EDITORIAL GOLD RULES
   ============================================================ */

function createEditorialRules() {
    if (!fashionistaBackground) return;

    const positions = [
        ["8%", "18%", "13%", "-7deg"],
        ["76%", "23%", "12%", "6deg"],
        ["10%", "78%", "15%", "5deg"],
        ["73%", "82%", "14%", "-5deg"]
    ];

    positions.forEach(([left, top, width, rotation], index) => {
        const rule = document.createElement("span");

        rule.className = "fashionista-rule";
        rule.style.left = left;
        rule.style.top = top;
        rule.style.width = width;
        rule.style.transform = `rotate(${rotation})`;
        rule.style.animationDelay = `${index * -1.4}s`;

        fashionistaBackground.appendChild(rule);
    });
}

/* ============================================================
   MOUNT
   ============================================================ */

export function mount() {
    if (fashionistaBackground) return;

    playFashionistaIntro();

    /*
     * Only the theme stylesheet is loaded here.
     * No application elements are moved or restyled structurally.
     */
    fashionistaStylesheet = document.createElement("link");
    fashionistaStylesheet.rel = "stylesheet";
    fashionistaStylesheet.href = "/themes/theme-fashionista.css";
    fashionistaStylesheet.dataset.theme = "fashionista";

    document.head.appendChild(fashionistaStylesheet);

    /*
     * Decorative layer only.
     *
     * It sits at the same background level used by Science Lab:
     * fixed, full viewport, pointer-events disabled, z-index 0.
     *
     * IMPORTANT: Do not add z-index or positioning rules to the
     * application's selector, cursor, companion, tabs, or views here.
     */
    fashionistaBackground = document.createElement("div");
    fashionistaBackground.id = "fashionista-background";
    fashionistaBackground.setAttribute("aria-hidden", "true");

    document.body.appendChild(fashionistaBackground);

    createFashionBackgroundSVG();
    createInteractiveBackdrop();
    createFashionObjects();
    createGlints();
    createEditorialRules();
    enableFashionistaInteractivity();
}

/* ============================================================
   UNMOUNT
   ============================================================ */

export function unmount() {
    stopFashionistaIntro();
    disableFashionistaInteractivity();

    if (fashionistaBackground) {
        fashionistaBackground.remove();
        fashionistaBackground = null;
    }

    if (fashionistaStylesheet) {
        fashionistaStylesheet.remove();
        fashionistaStylesheet = null;
    }

    fashionistaBackgroundSVG = null;
    uniqueCounter = 0;
}

