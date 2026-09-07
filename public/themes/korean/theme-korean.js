/* ============================================================
   KOREAN
   Decorative Korean theme using real /svg/theme-korean assets.
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

const THEME_IMAGES = [
    { key: "bibimbap", src: "/svg/theme-korean/bibimbap.svg", note: 293.66, className: "theme-korean-bibimbap", width: 146, height: 146 },
    { key: "buldak-cup", src: "/svg/theme-korean/buldak_cup_noodles.svg", note: 329.63, className: "theme-korean-buldak-cup", width: 122, height: 152 },
    { key: "cheese-buldak", src: "/svg/theme-korean/cheese_buldak_package.svg", note: 349.23, className: "theme-korean-cheese-buldak", width: 142, height: 124 },
    { key: "cheese-tteokbokki", src: "/svg/theme-korean/cheese_tteokbokki.svg", note: 392.00, className: "theme-korean-cheese-tteokbokki", width: 148, height: 132 },
    { key: "finger-heart", src: "/svg/theme-korean/finger_heart.svg", note: 440.00, className: "theme-korean-finger-heart", width: 110, height: 138 },
    { key: "fish-pastry-bag", src: "/svg/theme-korean/fish_pastry_bag.svg", note: 493.88, className: "theme-korean-fish-pastry-bag", width: 126, height: 152 },
    { key: "fruit-sandwich", src: "/svg/theme-korean/fruit_sandwich.svg", note: 523.25, className: "theme-korean-fruit-sandwich", width: 126, height: 126 },
    { key: "gimbap-plate", src: "/svg/theme-korean/gimbap_plate.svg", note: 587.33, className: "theme-korean-gimbap-plate", width: 150, height: 122 },
    { key: "grapefruit-soju", src: "/svg/theme-korean/grapefruit_soju.svg", note: 659.25, className: "theme-korean-grapefruit-soju", width: 108, height: 150 },
    { key: "passport", src: "/svg/theme-korean/korean_passport.svg", note: 311.13, className: "theme-korean-passport", width: 122, height: 146 },
    { key: "matcha-drink", src: "/svg/theme-korean/matcha_drink.svg", note: 369.99, className: "theme-korean-matcha-drink", width: 108, height: 150 },
    { key: "onggi-kimchi", src: "/svg/theme-korean/onggi_kimchi_jar.svg", note: 415.30, className: "theme-korean-onggi-kimchi", width: 130, height: 148 },
    { key: "palace-sticker", src: "/svg/theme-korean/palace_sticker.svg", note: 466.16, className: "theme-korean-palace-sticker", width: 162, height: 136 },
    { key: "seoul-photo", src: "/svg/theme-korean/seoul_photo_print.svg", note: 554.37, className: "theme-korean-seoul-photo", width: 154, height: 120 },
    { key: "seoul-postcard", src: "/svg/theme-korean/seoul_vintage_postcard.svg", note: 622.25, className: "theme-korean-seoul-postcard", width: 154, height: 118 },
    { key: "seoul-wordmark", src: "/svg/theme-korean/seoul_wordmark.svg", note: 698.46, className: "theme-korean-seoul-wordmark", width: 172, height: 92 },
    { key: "t-money", src: "/svg/theme-korean/t_money_card.svg", note: 783.99, className: "theme-korean-tmoney", width: 138, height: 92 },
    { key: "tteokkochi", src: "/svg/theme-korean/tteokkochi_skewer.svg", note: 523.25, className: "theme-korean-tteokkochi", width: 104, height: 168 },
    { key: "taegukgi-plaque", src: "/svg/theme-korean/wooden_taegukgi_plaque.svg", note: 587.33, className: "theme-korean-taegukgi-plaque", width: 154, height: 120 }
];

const TOTAL_OBJECT_COUNT = 22;

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
    const ctx = getAudio();
    if (!ctx) return;

    const now = ctx.currentTime;
    const master = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();

    filter.type = "lowpass";
    filter.frequency.setValueAtTime(3900, now);
    filter.Q.setValueAtTime(0.7, now);

    master.gain.setValueAtTime(0.0001, now);
    master.gain.exponentialRampToValueAtTime(0.12, now + 0.008);
    master.gain.exponentialRampToValueAtTime(0.0001, now + 0.58);

    osc1.type = "sine";
    osc1.frequency.setValueAtTime(freq, now);
    osc1.frequency.exponentialRampToValueAtTime(freq * 1.08, now + 0.18);

    osc2.type = "triangle";
    osc2.frequency.setValueAtTime(freq * 1.5, now);

    const harmonicGain = ctx.createGain();
    harmonicGain.gain.setValueAtTime(0.18, now);
    harmonicGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.32);

    osc1.connect(filter);
    osc2.connect(harmonicGain);
    harmonicGain.connect(filter);
    filter.connect(master);
    master.connect(ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.66);
    osc2.stop(now + 0.40);
}

function buildBackdrop() {
    const haze = document.createElement("div");
    haze.className = "theme-korean-haze";
    themeBackground.appendChild(haze);

    const bands = document.createElement("div");
    bands.className = "theme-korean-bands";
    themeBackground.appendChild(bands);

    const pattern = document.createElement("div");
    pattern.className = "theme-korean-pattern";
    themeBackground.appendChild(pattern);

    const horizon = document.createElement("div");
    horizon.className = "theme-korean-horizon";
    themeBackground.appendChild(horizon);
}

function addObject(asset, placement) {
    const item = document.createElement("div");
    item.className = [
        "theme-korean-item",
        asset.className,
        placement.soft ? "theme-korean-soft" : "",
        placement.center ? "theme-korean-center" : "",
        placement.emphasis ? "theme-korean-emphasis" : ""
    ].filter(Boolean).join(" ");

    item.style.left = placement.left;
    item.style.top = placement.top;
    item.style.setProperty("--item-scale", placement.scale);
    item.style.setProperty("--item-rotate", placement.rotate + "deg");
    item.style.setProperty("--item-delay", (-rand(0, 8)).toFixed(2) + "s");
    item.style.setProperty("--item-x", rand(-11, 11).toFixed(1) + "px");
    item.style.setProperty("--item-y", rand(-8, 8).toFixed(1) + "px");
    item.style.setProperty("--item-opacity", String(placement.opacity ?? (placement.soft ? 0.28 : 0.72)));
    item.setAttribute("aria-hidden", "true");

    const img = document.createElement("img");
    img.className = "theme-korean-object-image";
    img.src = asset.src;
    img.alt = "";
    img.draggable = false;
    img.decoding = "async";
    img.addEventListener("error", () => item.remove(), { once: true });

    item.appendChild(img);
    themeBackground.appendChild(item);

    themeItems.push({
        el: item,
        note: placement.note ?? asset.note,
        last: 0
    });
}

function rectsOverlap(a, b, gap) {
    return !(
        a.right + gap <= b.left ||
        a.left >= b.right + gap ||
        a.bottom + gap <= b.top ||
        a.top >= b.bottom + gap
    );
}

function collides(rect, placed, gap) {
    return placed.some((p) => rectsOverlap(rect, p, gap));
}

function overlapsBlocked(rect, blocked, gap) {
    return blocked.some((z) => rectsOverlap(rect, z, gap));
}

function generatePlacements() {
    const viewportWidth = window.innerWidth || 1440;
    const viewportHeight = window.innerHeight || 900;
    const mobile = viewportWidth < 700;
    const placedRects = [];
    const placedAssets = [];
    const placements = [];

    const blockedZones = [
        { left: viewportWidth * 0.22, right: viewportWidth * 0.78, top: 0, bottom: viewportHeight * (mobile ? 0.17 : 0.19) },
        { left: viewportWidth * 0.32, right: viewportWidth * 0.68, top: viewportHeight * 0.36, bottom: viewportHeight * 0.58 }
    ];

    const edgeZones = [
        { xMin: 0.04, xMax: 0.24, yMin: 0.18, yMax: 0.84 },
        { xMin: 0.76, xMax: 0.96, yMin: 0.18, yMax: 0.84 },
        { xMin: 0.21, xMax: 0.79, yMin: 0.17, yMax: 0.29 },
        { xMin: 0.18, xMax: 0.82, yMin: 0.72, yMax: 0.87 }
    ];

    const centerZones = [
        { xMin: 0.28, xMax: 0.42, yMin: 0.29, yMax: 0.43 },
        { xMin: 0.58, xMax: 0.72, yMin: 0.29, yMax: 0.43 },
        { xMin: 0.28, xMax: 0.42, yMin: 0.59, yMax: 0.73 },
        { xMin: 0.58, xMax: 0.72, yMin: 0.59, yMax: 0.73 },
        { xMin: 0.43, xMax: 0.57, yMin: 0.22, yMax: 0.33 },
        { xMin: 0.43, xMax: 0.57, yMin: 0.66, yMax: 0.77 }
    ];

    const spreadAssets = buildSpreadAssetPool(TOTAL_OBJECT_COUNT);

    spreadAssets.forEach((asset, index) => {
        const center = index >= 12;
        const zoneSet = center ? centerZones : edgeZones;
        const zone = zoneSet[index % zoneSet.length];
        const gap = mobile ? (center ? 12 : 16) : (center ? 16 : 20);
        const scaleMin = mobile ? (center ? 0.60 : 0.70) : (center ? 0.72 : 0.84);
        const scaleMax = mobile ? (center ? 0.76 : 0.90) : (center ? 0.88 : 1.06);
        const opacity = center ? rand(0.24, 0.38) : rand(0.66, 0.86);

        let placed = false;
        for (let attempt = 0; attempt < 280 && !placed; attempt++) {
            const scale = rand(scaleMin, scaleMax);
            const width = asset.width * scale;
            const height = asset.height * scale;

            const minX = zone.xMin * viewportWidth + width / 2;
            const maxX = zone.xMax * viewportWidth - width / 2;
            const minY = zone.yMin * viewportHeight + height / 2;
            const maxY = zone.yMax * viewportHeight - height / 2;
            if (maxX <= minX || maxY <= minY) break;

            const leftPx = rand(minX, maxX);
            const topPx = rand(minY, maxY);
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
                Math.hypot(item.x - leftPx, item.y - topPx) < Math.min(viewportWidth, viewportHeight) * (center ? 0.20 : 0.24)
            );
            if (sameAssetTooClose) continue;

            placedRects.push(rect);
            placedAssets.push({ key: asset.key, x: leftPx, y: topPx });
            placements.push({
                asset,
                left: `${(leftPx / viewportWidth) * 100}%`,
                top: `${(topPx / viewportHeight) * 100}%`,
                scale: Number(scale.toFixed(3)),
                rotate: rand(-10, 10),
                opacity: Number(opacity.toFixed(2)),
                soft: center,
                center,
                emphasis: !center && index < 4
            });
            placed = true;
        }
    });

    return placements;
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
                obj.el.classList.remove("theme-korean-react");
                void obj.el.offsetWidth;
                obj.el.classList.add("theme-korean-react");
                playThemeSound(obj.note);
                setTimeout(() => obj.el.classList.remove("theme-korean-react"), 520);
            }
        });
    };
    window.addEventListener("mousemove", themeMouseHandler, { passive: true });
}

export function mount() {
    if (themeBackground) return;

    themeStylesheet = document.createElement("link");
    themeStylesheet.rel = "stylesheet";
    themeStylesheet.href = "/themes/theme-korean.css";
    themeStylesheet.dataset.theme = "korean";
    document.head.appendChild(themeStylesheet);

    themeBackground = document.createElement("div");
    themeBackground.id = "korean-background";
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
