/* ============================================================
   SUMMER THEME
   - Uses all supplied /svg/theme-summer assets
   - Tropical animated background
   - Decorative objects are randomized on each reload
   - Objects gently animate at rest and react on hover proximity
   - Preserves app structure, cursor, companions, tabs, and layout
   ============================================================ */

let themeBackground = null;
let themeStylesheet = null;
let themeMouseHandler = null;
let themeItems = [];

let summerIntroAudio = null;
let summerIntroFallbackHandler = null;
let summerIntroFinished = false;
let summerIntroFadeFrame = null;

let summerHoverAudio = null;
let summerLastHoverSoundAt = 0;

const SUMMER_INTRO_SRC =
    "/sounds/intros/vibemode-summer-vibe-summer-581790.mp3";
const SUMMER_INTRO_END = 39;
const SUMMER_INTRO_FADE_START = 34;
const SUMMER_INTRO_VOLUME = 0.30;

const SUMMER_HOVER_SOUNDS = [
    "/sounds/history/freesound_community-card-sounds-35956.mp3",
    "/sounds/history/freesound_community-papier-fouilles-23558.mp3"
];
const SUMMER_HOVER_VOLUME = 0.34;
const SUMMER_HOVER_GLOBAL_COOLDOWN = 220;

const THEME_IMAGES = [
    { src: "/svg/theme-summer/summer-01-pink-white-hibiscus.svg", width: 144, height: 144 },
    { src: "/svg/theme-summer/summer-02-blue-flower.svg", width: 136, height: 136 },
    { src: "/svg/theme-summer/summer-03-orange-hibiscus.svg", width: 146, height: 146 },
    { src: "/svg/theme-summer/summer-04-pale-pink-starfish.svg", width: 128, height: 128 },
    { src: "/svg/theme-summer/summer-05-pink-orange-starfish.svg", width: 130, height: 130 },
    { src: "/svg/theme-summer/summer-06-green-sea-turtle.svg", width: 156, height: 138 },
    { src: "/svg/theme-summer/summer-07-blue-sea-turtle.svg", width: 156, height: 138 },
    { src: "/svg/theme-summer/summer-08-yellow-spiral-sun.svg", width: 138, height: 138 },
    { src: "/svg/theme-summer/summer-09-pink-lily.svg", width: 140, height: 140 },
    { src: "/svg/theme-summer/summer-10-orange-lily.svg", width: 140, height: 140 },
    { src: "/svg/theme-summer/summer-11-blue-hibiscus.svg", width: 146, height: 146 },
    { src: "/svg/theme-summer/summer-12-orange-lily-2.svg", width: 142, height: 142 },
    { src: "/svg/theme-summer/summer-13-magenta-hibiscus.svg", width: 148, height: 148 },
    { src: "/svg/theme-summer/summer-14-coral-hibiscus.svg", width: 146, height: 146 },
    { src: "/svg/theme-summer/summer-15-pale-pink-hibiscus.svg", width: 144, height: 144 },
    { src: "/svg/theme-summer/summer-16-magenta-hibiscus-2.svg", width: 148, height: 148 },
    { src: "/svg/theme-summer/summer-17-coral-hibiscus-2.svg", width: 146, height: 146 },
    { src: "/svg/theme-summer/summer-18-pale-pink-hibiscus-2.svg", width: 144, height: 144 },
    { src: "/svg/theme-summer/summer-19-papaya-half.svg", width: 152, height: 142 },
    { src: "/svg/theme-summer/summer-20-orange-slice.svg", width: 140, height: 140 },
    { src: "/svg/theme-summer/summer-21-orange-hibiscus.svg", width: 148, height: 148 },
    { src: "/svg/theme-summer/summer-22-goldfish.svg", width: 150, height: 126 }
];

const TOTAL_OBJECT_COUNT = 32;

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

function setSummerIntroDancing(isPlaying) {
    if (!themeBackground) return;

    themeBackground.classList.toggle(
        "summer-intro-playing",
        Boolean(isPlaying)
    );
}

function clearSummerIntroFallback() {
    if (!summerIntroFallbackHandler) return;

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
            summerIntroFallbackHandler
        );
    });

    summerIntroFallbackHandler = null;
}

function stopSummerIntro() {
    clearSummerIntroFallback();

    if (summerIntroFadeFrame) {
        cancelAnimationFrame(summerIntroFadeFrame);
        summerIntroFadeFrame = null;
    }

    setSummerIntroDancing(false);

    if (!summerIntroAudio) return;

    try {
        summerIntroAudio.pause();
        summerIntroAudio.currentTime = 0;
        summerIntroAudio.volume = SUMMER_INTRO_VOLUME;
    } catch (_) {}

    summerIntroAudio = null;
}

function playSummerIntro() {
    stopSummerIntro();
    summerIntroFinished = false;

    const audio = new Audio();
    summerIntroAudio = audio;

    audio.src = SUMMER_INTRO_SRC;
    audio.preload = "auto";
    audio.autoplay = true;
    audio.playsInline = true;
    audio.loop = false;
    audio.volume = SUMMER_INTRO_VOLUME;
    audio.load();

    const finishIntro = () => {
        if (summerIntroAudio !== audio) return;

        if (summerIntroFadeFrame) {
            cancelAnimationFrame(summerIntroFadeFrame);
            summerIntroFadeFrame = null;
        }

        setSummerIntroDancing(false);

        try {
            audio.pause();
            audio.currentTime = SUMMER_INTRO_END;
            audio.volume = 0;
        } catch (_) {}

        summerIntroFinished = true;
    };

    const fadeLoop = () => {
        if (summerIntroAudio !== audio) return;

        const t = audio.currentTime || 0;

        if (t >= SUMMER_INTRO_END) {
            finishIntro();
            return;
        }

        if (t >= SUMMER_INTRO_FADE_START) {
            const remaining =
                Math.max(0, SUMMER_INTRO_END - t);

            const fadeLength =
                SUMMER_INTRO_END -
                SUMMER_INTRO_FADE_START;

            audio.volume =
                SUMMER_INTRO_VOLUME *
                (remaining / fadeLength);
        } else {
            audio.volume = SUMMER_INTRO_VOLUME;
        }

        summerIntroFadeFrame =
            requestAnimationFrame(fadeLoop);
    };

    audio.addEventListener(
        "playing",
        () => {
            if (summerIntroAudio !== audio) return;

            setSummerIntroDancing(true);

            if (!summerIntroFadeFrame) {
                summerIntroFadeFrame =
                    requestAnimationFrame(fadeLoop);
            }
        }
    );

    audio.addEventListener(
        "pause",
        () => {
            if (summerIntroAudio === audio) {
                setSummerIntroDancing(false);
            }
        }
    );

    audio.addEventListener(
        "error",
        () => {
            /*
             * If the intro cannot load, do not permanently lock
             * the normal SVG hover sounds.
             */
            setSummerIntroDancing(false);
            summerIntroFinished = true;
        },
        { once: true }
    );

    const tryPlay = () => {
        if (summerIntroAudio !== audio) return;

        const playPromise = audio.play();

        if (
            playPromise &&
            typeof playPromise.catch === "function"
        ) {
            playPromise.catch(() => {
                if (summerIntroFallbackHandler) return;

                summerIntroFallbackHandler = () => {
                    const handler =
                        summerIntroFallbackHandler;

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

                    summerIntroFallbackHandler = null;

                    if (summerIntroAudio !== audio) return;

                    audio.volume = SUMMER_INTRO_VOLUME;

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
                        summerIntroFallbackHandler,
                        { once: true }
                    );
                });
            });
        }
    };

    tryPlay();
}

function stopSummerHoverSound() {
    if (!summerHoverAudio) return;

    try {
        summerHoverAudio.pause();
        summerHoverAudio.currentTime = 0;
    } catch (_) {}

    summerHoverAudio = null;
}

function playSummerHoverSound() {
    /*
     * The hover animation always works, but its sound stays locked
     * until the intro song has completely finished.
     */
    if (!summerIntroFinished) return;

    const now = performance.now();

    if (
        now - summerLastHoverSoundAt <
        SUMMER_HOVER_GLOBAL_COOLDOWN
    ) {
        return;
    }

    summerLastHoverSoundAt = now;

    stopSummerHoverSound();

    const audio = new Audio();
    summerHoverAudio = audio;

    audio.src =
        SUMMER_HOVER_SOUNDS[
            Math.floor(Math.random() * SUMMER_HOVER_SOUNDS.length)
        ];

    audio.preload = "auto";
    audio.volume = SUMMER_HOVER_VOLUME;
    audio.loop = false;

    audio.addEventListener(
        "ended",
        () => {
            if (summerHoverAudio === audio) {
                summerHoverAudio = null;
            }
        },
        { once: true }
    );

    const playPromise = audio.play();

    if (
        playPromise &&
        typeof playPromise.catch === "function"
    ) {
        playPromise.catch(() => {
            if (summerHoverAudio === audio) {
                summerHoverAudio = null;
            }
        });
    }
}

function buildBackdrop() {
    const sky = document.createElement('div');
    sky.className = 'theme-summer-sky';
    themeBackground.appendChild(sky);

    const light = document.createElement('div');
    light.className = 'theme-summer-light';
    themeBackground.appendChild(light);

    const waves = document.createElement('div');
    waves.className = 'theme-summer-waves';
    themeBackground.appendChild(waves);

    const palmshadow = document.createElement('div');
    palmshadow.className = 'theme-summer-palmshadow';
    themeBackground.appendChild(palmshadow);

    const shore = document.createElement('div');
    shore.className = 'theme-summer-shore';
    themeBackground.appendChild(shore);
}

function addObject(asset, placement) {
    const item = document.createElement('div');
    item.className = 'theme-summer-item' +
        (placement.soft ? ' theme-summer-soft' : '') +
        (placement.emphasis ? ' theme-summer-emphasis' : '');

    item.style.left = placement.left;
    item.style.top = placement.top;
    item.style.width = asset.width + 'px';
    item.style.height = asset.height + 'px';
    item.style.setProperty('--item-scale', placement.scale);
    item.style.setProperty('--item-rotate', placement.rotate + 'deg');
    item.style.setProperty('--item-delay', (-rand(0, 8)).toFixed(2) + 's');
    item.style.setProperty('--item-x', rand(-14, 14).toFixed(1) + 'px');
    item.style.setProperty('--item-y', rand(-10, 10).toFixed(1) + 'px');
    item.style.setProperty('--item-opacity', String(placement.opacity));
    item.style.setProperty('--item-duration', rand(6.8, 9.8).toFixed(2) + 's');
    item.setAttribute('aria-hidden', 'true');

    const img = document.createElement('img');
    img.className = 'theme-summer-object-image';
    img.src = asset.src;
    img.alt = '';
    img.draggable = false;
    img.decoding = 'async';
    img.addEventListener('error', () => item.remove(), { once: true });

    item.appendChild(img);
    themeBackground.appendChild(item);

    const itemIndex = themeItems.length;

    if (
        itemIndex % 3 === 0 ||
        itemIndex % 8 === 0
    ) {
        item.classList.add("theme-summer-intro-dancer");

        item.style.setProperty(
            "--summer-dance-delay",
            (-rand(0, 0.9)).toFixed(2) + "s"
        );

        item.style.setProperty(
            "--summer-dance-height",
            rand(10, 18).toFixed(1) + "px"
        );

        item.style.setProperty(
            "--summer-dance-duration",
            rand(0.66, 0.92).toFixed(2) + "s"
        );
    }

    themeItems.push({ el: item, last: 0 });
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
    const vw = window.innerWidth || 1440;
    const vh = window.innerHeight || 900;
    const mobile = vw < 700;
    const placed = [];
    const placements = [];

    const blocked = [
        { left: vw * 0.22, right: vw * 0.78, top: 0, bottom: vh * (mobile ? 0.17 : 0.19) },
        { left: vw * 0.35, right: vw * 0.65, top: vh * 0.36, bottom: vh * 0.57 }
    ];

    const zones = [
        { xMin: 0.03, xMax: 0.20, yMin: 0.15, yMax: 0.38, type: 'edge' },
        { xMin: 0.03, xMax: 0.20, yMin: 0.40, yMax: 0.63, type: 'edge' },
        { xMin: 0.03, xMax: 0.20, yMin: 0.65, yMax: 0.89, type: 'edge' },
        { xMin: 0.80, xMax: 0.97, yMin: 0.15, yMax: 0.38, type: 'edge' },
        { xMin: 0.80, xMax: 0.97, yMin: 0.40, yMax: 0.63, type: 'edge' },
        { xMin: 0.80, xMax: 0.97, yMin: 0.65, yMax: 0.89, type: 'edge' },
        { xMin: 0.18, xMax: 0.35, yMin: 0.17, yMax: 0.31, type: 'upper' },
        { xMin: 0.36, xMax: 0.52, yMin: 0.18, yMax: 0.31, type: 'upper' },
        { xMin: 0.53, xMax: 0.69, yMin: 0.18, yMax: 0.31, type: 'upper' },
        { xMin: 0.70, xMax: 0.84, yMin: 0.17, yMax: 0.31, type: 'upper' },
        { xMin: 0.16, xMax: 0.33, yMin: 0.73, yMax: 0.90, type: 'bottom' },
        { xMin: 0.34, xMax: 0.50, yMin: 0.74, yMax: 0.90, type: 'bottom' },
        { xMin: 0.51, xMax: 0.67, yMin: 0.74, yMax: 0.90, type: 'bottom' },
        { xMin: 0.68, xMax: 0.84, yMin: 0.73, yMax: 0.89, type: 'bottom' },
        { xMin: 0.26, xMax: 0.41, yMin: 0.29, yMax: 0.42, type: 'inner' },
        { xMin: 0.58, xMax: 0.73, yMin: 0.29, yMax: 0.42, type: 'inner' },
        { xMin: 0.26, xMax: 0.41, yMin: 0.58, yMax: 0.71, type: 'inner' },
        { xMin: 0.58, xMax: 0.73, yMin: 0.58, yMax: 0.71, type: 'inner' }
    ];

    const repeatPool = shuffle(THEME_IMAGES).slice(0, Math.max(0, TOTAL_OBJECT_COUNT - THEME_IMAGES.length));
    const pool = shuffle(THEME_IMAGES.concat(repeatPool));

    pool.forEach((asset, index) => {
        const zone = zones[index % zones.length];
        const soft = zone.type === 'inner';

        let scaleMin = mobile ? (soft ? 0.50 : 0.64) : (soft ? 0.64 : 0.82);
        let scaleMax = mobile ? (soft ? 0.66 : 0.84) : (soft ? 0.80 : 1.02);

        if (zone.type === 'edge' || zone.type === 'bottom') {
            scaleMin += mobile ? 0.03 : 0.05;
            scaleMax += mobile ? 0.03 : 0.06;
        }

        const gap = mobile ? 8 : (soft ? 10 : 16);
        const opacity = soft ? rand(0.18, 0.30) : rand(0.64, 0.88);

        let accepted = false;
        for (let attempt = 0; attempt < 320 && !accepted; attempt++) {
            const scale = rand(scaleMin, scaleMax);
            const width = asset.width * scale;
            const height = asset.height * scale;

            const minX = zone.xMin * vw + width / 2;
            const maxX = zone.xMax * vw - width / 2;
            const minY = zone.yMin * vh + height / 2;
            const maxY = zone.yMax * vh - height / 2;

            if (maxX <= minX || maxY <= minY) break;

            const x = rand(minX, maxX);
            const y = rand(minY, maxY);

            const rect = {
                left: x - width / 2,
                right: x + width / 2,
                top: y - height / 2,
                bottom: y + height / 2,
                src: asset.src,
                cx: x,
                cy: y
            };

            if (blocked.some((b) => overlaps(rect, b, gap))) continue;
            if (placed.some((p) => overlaps(rect, p, gap))) continue;

            const sameAssetTooClose = placed.some((p) =>
                p.src === asset.src &&
                Math.hypot(p.cx - x, p.cy - y) < Math.min(vw, vh) * 0.28
            );
            if (sameAssetTooClose) continue;

            placed.push(rect);
            placements.push({
                asset,
                left: `${(x / vw) * 100}%`,
                top: `${(y / vh) * 100}%`,
                scale: Number(scale.toFixed(3)),
                rotate: rand(-12, 12),
                opacity: Number(opacity.toFixed(2)),
                soft,
                emphasis: !soft && (zone.type === 'edge' || zone.type === 'bottom')
            });
            accepted = true;
        }
    });

    return placements;
}

function createObjects() {
    generatePlacements().forEach((placement) => addObject(placement.asset, placement));
}

function startInteraction() {
    const radius = 76;
    themeMouseHandler = (event) => {
        const now = performance.now();
        themeItems.forEach((obj) => {
            const r = obj.el.getBoundingClientRect();
            const cx = r.left + r.width / 2;
            const cy = r.top + r.height / 2;

            if (Math.hypot(cx - event.clientX, cy - event.clientY) <= radius && now - obj.last > 560) {
                obj.last = now;
                obj.el.classList.remove('theme-summer-react');
                void obj.el.offsetWidth;
                obj.el.classList.add('theme-summer-react');

                playSummerHoverSound();

                setTimeout(
                    () => obj.el.classList.remove('theme-summer-react'),
                    560
                );
            }
        });
    };

    window.addEventListener('mousemove', themeMouseHandler, { passive: true });
}

export function mount() {
    if (themeBackground) return;

    themeStylesheet = document.createElement('link');
    themeStylesheet.rel = 'stylesheet';
    themeStylesheet.href = '/themes/theme-summer.css';
    themeStylesheet.dataset.theme = 'summer';
    document.head.appendChild(themeStylesheet);

    themeBackground = document.createElement('div');
    themeBackground.id = 'summer-background';
    themeBackground.setAttribute('aria-hidden', 'true');
    document.body.appendChild(themeBackground);

    summerIntroFinished = false;
    playSummerIntro();

    buildBackdrop();
    createObjects();
    startInteraction();
}

export function unmount() {
    stopSummerIntro();
    stopSummerHoverSound();
    summerIntroFinished = false;

    if (themeMouseHandler) {
        window.removeEventListener('mousemove', themeMouseHandler);
        themeMouseHandler = null;
    }

    themeItems = [];

    if (themeBackground) {
        themeBackground.remove();
        themeBackground = null;
    }

    if (themeStylesheet) {
        themeStylesheet.remove();
        themeStylesheet = null;
    }
}
