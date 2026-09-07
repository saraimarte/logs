/* ============================================================
   FRENCH
   Decorative French theme using /svg/theme-french assets.
   - Preserves app structure and behavior
   - Preserves cursor system
   - Preserves companion positioning/movement
   - Uses decorative hover/proximity sounds only
   - Randomizes non-overlapping object placement on each reload
   ============================================================ */

let themeBackground = null;
let themeStylesheet = null;
let themeAudio = null;
let themeMouseHandler = null;
let themeItems = [];
let lastGlobalSound = 0;

let frenchIntroAudio = null;
let frenchIntroFinished = true;
let frenchIntroFallback = null;

const FRENCH_INTRO_SRC =
    "/sounds/intros/andriih-paris-french-music-568230.mp3";
const FRENCH_INTRO_CUTOFF = 20;
const FRENCH_INTRO_FADE_START = 15;
const FRENCH_INTRO_VOLUME = 0.3;

function removeFrenchIntroFallback() {
    if (!frenchIntroFallback) return;
    window.removeEventListener("pointerdown", frenchIntroFallback);
    window.removeEventListener("keydown", frenchIntroFallback);
    frenchIntroFallback = null;
}

function finishFrenchIntro() {
    frenchIntroFinished = true;
    removeFrenchIntroFallback();

    if (frenchIntroAudio) {
        try {
            frenchIntroAudio.pause();
            frenchIntroAudio.currentTime = 0;
            frenchIntroAudio.volume = FRENCH_INTRO_VOLUME;
        } catch (_) {}
    }

    frenchIntroAudio = null;
}

function playFrenchIntro() {
    finishFrenchIntro();
    frenchIntroFinished = false;

    const audio = new Audio(FRENCH_INTRO_SRC);
    frenchIntroAudio = audio;
    audio.preload = "auto";
    audio.volume = FRENCH_INTRO_VOLUME;

    const updateFade = () => {
        if (frenchIntroAudio !== audio) return;

        const t = audio.currentTime || 0;

        if (t >= FRENCH_INTRO_CUTOFF) {
            finishFrenchIntro();
            return;
        }

        if (t >= FRENCH_INTRO_FADE_START) {
            const progress = Math.min(
                1,
                (t - FRENCH_INTRO_FADE_START) /
                (FRENCH_INTRO_CUTOFF - FRENCH_INTRO_FADE_START)
            );
            audio.volume = Math.max(
                0,
                FRENCH_INTRO_VOLUME * (1 - progress)
            );
        } else {
            audio.volume = FRENCH_INTRO_VOLUME;
        }
    };

    audio.addEventListener("timeupdate", updateFade);
    audio.addEventListener("ended", finishFrenchIntro, { once: true });
    audio.addEventListener("error", finishFrenchIntro, { once: true });
    audio.addEventListener("playing", removeFrenchIntroFallback);

    const attempt = () => {
        if (frenchIntroAudio !== audio) return;
        const promise = audio.play();

        if (promise && typeof promise.catch === "function") {
            promise.catch(() => {
                if (frenchIntroFallback || frenchIntroAudio !== audio) return;

                frenchIntroFallback = () => {
                    if (frenchIntroAudio !== audio) return;
                    const retry = audio.play();
                    if (retry && typeof retry.catch === "function") {
                        retry.catch(() => {});
                    }
                };

                window.addEventListener("pointerdown", frenchIntroFallback);
                window.addEventListener("keydown", frenchIntroFallback);
            });
        }
    };

    attempt();
}

const THEME_IMAGES = [
    { key: "arc",      src: "/svg/theme-french/arc_de_triomphe.svg", note: 261.63, className: "theme-french-arc",      width: 218, height: 175 },
    { key: "baguette", src: "/svg/theme-french/baguette.svg",         note: 329.63, className: "theme-french-baguette", width: 224, height: 117  },
    { key: "pastry",   src: "/svg/theme-french/chocolate_pastry.svg", note: 392.00, className: "theme-french-pastry",   width: 165, height: 165 },
    { key: "tower",    src: "/svg/theme-french/eiffel_tower.svg",     note: 523.25, className: "theme-french-tower",    width: 185, height: 251 },
    { key: "coat",     src: "/svg/theme-french/fur_coat.svg",         note: 293.66, className: "theme-french-coat",     width: 196, height: 196 },
    { key: "rings",    src: "/svg/theme-french/gold_rings.svg",       note: 349.23, className: "theme-french-rings",    width: 150, height: 150 },
    { key: "ticket",   src: "/svg/theme-french/metro_ticket.svg",     note: 440.00, className: "theme-french-ticket",   width: 206, height: 132 },
    { key: "postcard", src: "/svg/theme-french/postcard.svg",         note: 587.33, className: "theme-french-postcard", width: 196, height: 152 }
];

const EDGE_COUNT = 10;
const CENTER_COUNT = 8;
const TOTAL_OBJECT_COUNT = EDGE_COUNT + CENTER_COUNT;

function rand(min, max) {
    return Math.random() * (max - min) + min;
}

function randInt(min, max) {
    return Math.floor(rand(min, max + 1));
}

function pickAsset(index) {
    return THEME_IMAGES[index % THEME_IMAGES.length];
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
    let previousKey = null;

    while (pool.length < total) {
        const cycle = shuffle(THEME_IMAGES);
        if (previousKey && cycle.length > 1 && cycle[0].key === previousKey) {
            const shift = cycle.findIndex((asset) => asset.key !== previousKey);
            if (shift > 0) {
                cycle.push(...cycle.splice(0, shift));
            }
        }
        cycle.forEach((asset) => {
            if (pool.length < total) {
                pool.push(asset);
                previousKey = asset.key;
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

function playThemeSound(freq) {
    if (!frenchIntroFinished) return;
    const ctx = getAudio();
    if (!ctx) return;

    const now = ctx.currentTime;
    const master = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();

    filter.type = "lowpass";
    filter.frequency.setValueAtTime(4200, now);
    filter.Q.setValueAtTime(0.7, now);

    master.gain.setValueAtTime(0.0001, now);
    master.gain.exponentialRampToValueAtTime(0.13, now + 0.008);
    master.gain.exponentialRampToValueAtTime(0.0001, now + 0.74);

    osc1.type = "sine";
    osc1.frequency.setValueAtTime(freq, now);

    osc2.type = "sine";
    osc2.frequency.setValueAtTime(freq * 2.01, now);

    const harmonicGain = ctx.createGain();
    harmonicGain.gain.setValueAtTime(0.22, now);
    harmonicGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.40);

    osc1.connect(filter);
    osc2.connect(harmonicGain);
    harmonicGain.connect(filter);
    filter.connect(master);
    master.connect(ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.78);
    osc2.stop(now + 0.44);
}

function buildBackdrop() {
    const haze = document.createElement("div");
    haze.className = "theme-french-haze";
    themeBackground.appendChild(haze);

    const ribbon = document.createElement("div");
    ribbon.className = "theme-french-ribbon";
    themeBackground.appendChild(ribbon);

    const pattern = document.createElement("div");
    pattern.className = "theme-french-pattern";
    themeBackground.appendChild(pattern);

    const horizon = document.createElement("div");
    horizon.className = "theme-french-horizon";
    themeBackground.appendChild(horizon);
}

function addObject(asset, placement) {
    const item = document.createElement("div");
    item.className = [
        "theme-french-item",
        asset.className,
        placement.soft ? "theme-french-soft" : "",
        placement.center ? "theme-french-center" : "",
        placement.emphasis ? "theme-french-emphasis" : ""
    ].filter(Boolean).join(" ");

    item.style.left = placement.left;
    item.style.top = placement.top;
    item.style.setProperty("--item-scale", placement.scale);
    item.style.setProperty("--item-rotate", placement.rotate + "deg");
    item.style.setProperty("--item-delay", (-rand(0, 8)).toFixed(2) + "s");
    item.style.setProperty("--item-x", rand(-11, 11).toFixed(1) + "px");
    item.style.setProperty("--item-y", rand(-8, 8).toFixed(1) + "px");
    item.style.setProperty("--item-opacity", String(placement.opacity ?? (placement.soft ? 0.34 : 0.76)));
    item.setAttribute("aria-hidden", "true");

    const img = document.createElement("img");
    img.className = "theme-french-object-image";
    img.src = asset.src;
    img.alt = "";
    img.draggable = false;
    img.decoding = "async";

    img.addEventListener("error", () => {
        item.remove();
    }, { once: true });

    item.appendChild(img);
    themeBackground.appendChild(item);

    themeItems.push({
        el: item,
        note: placement.note ?? asset.note,
        last: 0
    });
}

function collides(rect, placed, gap) {
    return placed.some((p) => {
        return !(
            rect.right + gap <= p.left ||
            rect.left >= p.right + gap ||
            rect.bottom + gap <= p.top ||
            rect.top >= p.bottom + gap
        );
    });
}

function overlapsBlocked(rect, blockedZones, gap) {
    return blockedZones.some((zone) => {
        return !(
            rect.right + gap <= zone.left ||
            rect.left >= zone.right + gap ||
            rect.bottom + gap <= zone.top ||
            rect.top >= zone.bottom + gap
        );
    });
}

function makePlacement(asset, options) {
    const viewportWidth = window.innerWidth || 1440;
    const viewportHeight = window.innerHeight || 900;

    const zone = options.zone || { xMin: 0.06, xMax: 0.94, yMin: 0.14, yMax: 0.88 };
    const scaleMin = options.scaleMin ?? 0.82;
    const scaleMax = options.scaleMax ?? 1.02;
    const opacity = options.opacity;
    const soft = !!options.soft;
    const center = !!options.center;
    const emphasis = !!options.emphasis;
    const gap = options.gap ?? 26;

    return {
        asset,
        viewportWidth,
        viewportHeight,
        zone,
        scaleMin,
        scaleMax,
        opacity,
        soft,
        center,
        emphasis,
        gap
    };
}

function generatePlacements() {
    const viewportWidth = window.innerWidth || 1440;
    const viewportHeight = window.innerHeight || 900;
    const mobile = viewportWidth < 700;
    const placedRects = [];
    const placedAssets = [];
    const placements = [];

    const blockedZones = [
        {
            left: viewportWidth * 0.24,
            right: viewportWidth * 0.76,
            top: 0,
            bottom: viewportHeight * (mobile ? 0.16 : 0.18)
        }
    ];

    const edgeZones = [
        { xMin: 0.05, xMax: 0.24, yMin: 0.16, yMax: 0.84 },
        { xMin: 0.76, xMax: 0.95, yMin: 0.16, yMax: 0.84 },
        { xMin: 0.22, xMax: 0.78, yMin: 0.16, yMax: 0.29 },
        { xMin: 0.18, xMax: 0.82, yMin: 0.72, yMax: 0.87 }
    ];

    const centerZones = [
        { xMin: 0.30, xMax: 0.45, yMin: 0.30, yMax: 0.66 },
        { xMin: 0.55, xMax: 0.70, yMin: 0.30, yMax: 0.66 },
        { xMin: 0.42, xMax: 0.58, yMin: 0.23, yMax: 0.35 },
        { xMin: 0.42, xMax: 0.58, yMin: 0.63, yMax: 0.76 }
    ];

    const spreadAssets = buildSpreadAssetPool(TOTAL_OBJECT_COUNT);
    const candidateConfigs = [];

    for (let i = 0; i < EDGE_COUNT; i++) {
        candidateConfigs.push(
            makePlacement(spreadAssets[i], {
                zone: edgeZones[i % edgeZones.length],
                scaleMin: mobile ? 0.78 : 0.90,
                scaleMax: mobile ? 0.98 : 1.12,
                opacity: rand(0.68, 0.86),
                emphasis: i < 4,
                gap: mobile ? 18 : 26
            })
        );
    }

    for (let i = 0; i < CENTER_COUNT; i++) {
        candidateConfigs.push(
            makePlacement(spreadAssets[EDGE_COUNT + i], {
                zone: centerZones[i % centerZones.length],
                scaleMin: mobile ? 0.68 : 0.80,
                scaleMax: mobile ? 0.84 : 0.96,
                opacity: rand(0.24, 0.38),
                soft: true,
                center: true,
                gap: mobile ? 16 : 22
            })
        );
    }

    candidateConfigs.forEach((config) => {
        const { asset, zone, scaleMin, scaleMax, soft, center, emphasis, gap, opacity } = config;
        let placed = false;

        for (let attempt = 0; attempt < 260 && !placed; attempt++) {
            const scale = rand(scaleMin, scaleMax);
            const width = asset.width * scale;
            const height = asset.height * scale;
            const leftPx = rand(zone.xMin * viewportWidth + width / 2, zone.xMax * viewportWidth - width / 2);
            const topPx = rand(zone.yMin * viewportHeight + height / 2, zone.yMax * viewportHeight - height / 2);
            const rect = {
                left: leftPx - width / 2,
                right: leftPx + width / 2,
                top: topPx - height / 2,
                bottom: topPx + height / 2
            };

            if (overlapsBlocked(rect, blockedZones, gap)) continue;
            if (collides(rect, placedRects, gap)) continue;

            const sameAssetTooClose = placedAssets.some((item) =>
                item.key === asset.key &&
                Math.hypot(item.x - leftPx, item.y - topPx) < Math.min(viewportWidth, viewportHeight) * (center ? 0.22 : 0.26)
            );
            if (sameAssetTooClose) continue;

            placedRects.push(rect);
            placedAssets.push({ key: asset.key, x: leftPx, y: topPx });
            placements.push({
                asset,
                left: `${(leftPx / viewportWidth) * 100}%`,
                top: `${(topPx / viewportHeight) * 100}%`,
                scale: Number(scale.toFixed(3)),
                rotate: rand(-12, 12),
                opacity: Number(opacity.toFixed(2)),
                soft,
                center,
                emphasis
            });
            placed = true;
        }
    });

    return placements;
}

function createObjects() {
    const placements = generatePlacements();
    placements.forEach((placement) => addObject(placement.asset, placement));
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

                obj.el.classList.remove("theme-french-react");
                void obj.el.offsetWidth;
                obj.el.classList.add("theme-french-react");

                playThemeSound(obj.note);

                setTimeout(() => {
                    obj.el.classList.remove("theme-french-react");
                }, 520);
            }
        });
    };

    window.addEventListener("mousemove", themeMouseHandler, { passive: true });
}

export function mount() {
    if (themeBackground) return;

    themeStylesheet = document.createElement("link");
    themeStylesheet.rel = "stylesheet";
    themeStylesheet.href = "/themes/theme-french.css";
    themeStylesheet.dataset.theme = "french";
    document.head.appendChild(themeStylesheet);

    themeBackground = document.createElement("div");
    themeBackground.id = "french-background";
    themeBackground.setAttribute("aria-hidden", "true");
    document.body.appendChild(themeBackground);

    buildBackdrop();
    createObjects();
    startInteraction();
    playFrenchIntro();
}

export function unmount() {
    finishFrenchIntro();
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
