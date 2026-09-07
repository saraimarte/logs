
let themeRoot = null;
let themeItems = [];
let introAudio = null;
let hoverAudio = null;
let introPlaying = false;
let introFallbackHandler = null;
let introMonitorTimer = null;
let themeAddedBodyClass = false;

const THEME_NAME = "cutiepatootie";
const ASSET_ROOTS = [
    "/svg/theme-cutiepatootie/"
];
const ASSET_FILES = [
    "cutiepatootie-01.svg",
    "cutiepatootie-02.svg",
    "cutiepatootie-03.svg",
    "cutiepatootie-04.svg",
    "cutiepatootie-05.svg",
    "cutiepatootie-06.svg",
    "cutiepatootie-07.svg",
    "cutiepatootie-08.svg",
    "cutiepatootie-09.svg",
    "cutiepatootie-10.svg",
    "cutiepatootie-11.svg",
    "cutiepatootie-12.svg",
    "cutiepatootie-13.svg",
    "cutiepatootie-14.svg",
    "cutiepatootie-15.svg",
    "cutiepatootie-16.svg",
    "cutiepatootie-17.svg",
    "cutiepatootie-18.svg"
];
const HOVER_SOUNDS = [];
const HOVER_VOLUME = 0.4;
const INTRO_CONFIG = {
    "sources": [
        "/sounds/intros/ztmusic-shining-smile-melody-jpop-203898.mp3"
    ],
    "cutoff": 20,
    "fade_start": 15,
    "volume": 0.3
};

function rand(min, max) { return Math.random() * (max - min) + min; }

function shuffle(items) {
    const copy = [...items];
    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
}

function clearIntroFallback() {
    if (!introFallbackHandler) return;
    window.removeEventListener("pointerdown", introFallbackHandler);
    window.removeEventListener("keydown", introFallbackHandler);
    introFallbackHandler = null;
}

function clearIntroMonitor() {
    if (introMonitorTimer) {
        clearInterval(introMonitorTimer);
        introMonitorTimer = null;
    }
}

function stopHoverAudio() {
    if (!hoverAudio) return;
    try { hoverAudio.pause(); hoverAudio.currentTime = 0; } catch (_) {}
    hoverAudio = null;
}

function stopDancing() {
    themeItems.forEach((item) => item.classList.remove(`theme-${THEME_NAME}-dancing`));
}

function setRandomDancers() {
    stopDancing();
    if (!themeItems.length) return;
    const dancerCount = Math.max(1, Math.floor(themeItems.length * 0.35));
    shuffle(themeItems).slice(0, dancerCount).forEach((item, index) => {
        item.classList.add(`theme-${THEME_NAME}-dancing`);
        item.style.setProperty("--dance-delay", `${(index * 0.12).toFixed(2)}s`);
    });
}

function finishIntro() {
    introPlaying = false;
    clearIntroMonitor();
    clearIntroFallback();
    stopDancing();
    if (introAudio) {
        try { introAudio.pause(); introAudio.currentTime = 0; } catch (_) {}
    }
    introAudio = null;
}

function tryPlayIntroSource(index) {
    if (!INTRO_CONFIG || !INTRO_CONFIG.sources || index >= INTRO_CONFIG.sources.length) {
        finishIntro();
        return;
    }

    const audio = new Audio(INTRO_CONFIG.sources[index]);
    introAudio = audio;
    audio.preload = "auto";
    audio.volume = INTRO_CONFIG.volume ?? 0.3;

    const cutoff = INTRO_CONFIG.cutoff ?? null;
    const fadeStart = INTRO_CONFIG.fade_start ?? null;
    const full = !!INTRO_CONFIG.full;
    const fadeEnd = !!INTRO_CONFIG.fade_end;

    audio.addEventListener("playing", () => clearIntroFallback(), { once: true });
    audio.addEventListener("ended", () => finishIntro(), { once: true });
    audio.addEventListener("error", () => {
        if (introAudio === audio) {
            clearIntroMonitor();
            tryPlayIntroSource(index + 1);
        }
    }, { once: true });

    clearIntroMonitor();
    introMonitorTimer = setInterval(() => {
        if (introAudio !== audio) return;
        const t = audio.currentTime || 0;

        if (cutoff != null) {
            if (fadeStart != null && t >= fadeStart) {
                const progress = Math.min(1, (t - fadeStart) / Math.max(.001, cutoff - fadeStart));
                audio.volume = Math.max(0, (INTRO_CONFIG.volume ?? 0.3) * (1 - progress));
            }
            if (t >= cutoff) {
                finishIntro();
                return;
            }
        } else if (full && fadeEnd && audio.duration && Number.isFinite(audio.duration)) {
            const remaining = audio.duration - t;
            if (remaining <= 3.2) {
                audio.volume = Math.max(0, (INTRO_CONFIG.volume ?? 0.3) * (remaining / 3.2));
            }
        }
    }, 120);

    const p = audio.play();
    if (p && typeof p.catch === "function") {
        p.catch(() => {
            if (introFallbackHandler || introAudio !== audio) return;
            introFallbackHandler = () => {
                if (introAudio !== audio) return;
                const retry = audio.play();
                if (retry && typeof retry.catch === "function") retry.catch(() => {});
            };
            window.addEventListener("pointerdown", introFallbackHandler);
            window.addEventListener("keydown", introFallbackHandler);
        });
    }
}

function playIntro() {
    if (!INTRO_CONFIG || !INTRO_CONFIG.sources || !INTRO_CONFIG.sources.length) return;
    finishIntro();
    introPlaying = true;
    setRandomDancers();
    tryPlayIntroSource(0);
}

function playHoverSound() {
    if (introPlaying || !HOVER_SOUNDS.length) return;
    stopHoverAudio();

    const src = HOVER_SOUNDS[Math.floor(Math.random() * HOVER_SOUNDS.length)];
    const audio = new Audio(src);
    hoverAudio = audio;
    audio.preload = "auto";
    audio.volume = HOVER_VOLUME;

    audio.addEventListener("ended", () => { if (hoverAudio === audio) hoverAudio = null; }, { once: true });
    audio.addEventListener("error", () => { if (hoverAudio === audio) hoverAudio = null; }, { once: true });

    const p = audio.play();
    if (p && typeof p.catch === "function") {
        p.catch(() => { if (hoverAudio === audio) hoverAudio = null; });
    }
}

function makeSlots(count) {
    const columns = [10, 30, 50, 70, 90];
    const top = 18;
    const bottom = 84;
    const rows = Math.ceil(count / columns.length);
    const step = rows <= 1 ? 0 : (bottom - top) / (rows - 1);
    const slots = [];
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < columns.length; col++) {
            slots.push({ x: columns[col], y: top + row * step });
        }
    }
    return shuffle(slots).slice(0, count);
}

function createBurst(x, y) {
    if (!themeRoot) return;
    const layer = themeRoot.querySelector(`.theme-${THEME_NAME}-burst-layer`);
    if (!layer) return;
    for (let i = 0; i < 7; i++) {
        const spark = document.createElement("span");
        spark.className = `theme-${THEME_NAME}-burst`;
        const angle = ((Math.PI * 2) / 7) * i + rand(-0.18, 0.18);
        const distance = rand(28, 58);
        spark.style.left = `${x}px`;
        spark.style.top = `${y}px`;
        spark.style.setProperty("--burst-x", `${Math.cos(angle) * distance}px`);
        spark.style.setProperty("--burst-y", `${Math.sin(angle) * distance}px`);
        spark.style.setProperty("--burst-size", `${rand(5, 12)}px`);
        layer.appendChild(spark);
        setTimeout(() => spark.remove(), 760);
    }
}

function assignImageWithFallback(img, file) {
    let idx = 0;
    function loadNext() {
        if (idx >= ASSET_ROOTS.length) return;
        img.src = `${ASSET_ROOTS[idx]}${encodeURIComponent(file)}`;
        idx += 1;
    }
    img.addEventListener("error", loadNext);
    loadNext();
}

function createDecorations() {
    const glow = document.createElement("div");
    glow.className = `theme-${THEME_NAME}-glow`;
    themeRoot.appendChild(glow);

    const pattern = document.createElement("div");
    pattern.className = `theme-${THEME_NAME}-pattern`;
    themeRoot.appendChild(pattern);

    const dots = document.createElement("div");
    dots.className = `theme-${THEME_NAME}-dots`;
    themeRoot.appendChild(dots);

    for (let i = 0; i < 20; i++) {
        const dot = document.createElement("span");
        dot.className = `theme-${THEME_NAME}-dot`;
        dot.style.left = `${rand(2, 98)}%`;
        dot.style.top = `${rand(6, 94)}%`;
        dot.style.setProperty("--dot-size", `${rand(10, 34)}px`);
        dot.style.setProperty("--dot-delay", `${-rand(0, 7)}s`);
        dot.style.setProperty("--dot-duration", `${rand(5.5, 9.5)}s`);
        dot.style.setProperty("--dot-dx", `${rand(-18, 18)}px`);
        dot.style.setProperty("--dot-dy", `${rand(-20, 20)}px`);
        dots.appendChild(dot);
    }

    const floor = document.createElement("div");
    floor.className = `theme-${THEME_NAME}-floor`;
    themeRoot.appendChild(floor);

    const burstLayer = document.createElement("div");
    burstLayer.className = `theme-${THEME_NAME}-burst-layer`;
    themeRoot.appendChild(burstLayer);
}

function createItems() {
    const layer = document.createElement("div");
    layer.className = `theme-${THEME_NAME}-items`;
    themeRoot.appendChild(layer);

    const files = shuffle(ASSET_FILES);
    const slots = makeSlots(files.length);

    files.forEach((file, index) => {
        const slot = slots[index];
        const item = document.createElement("div");
        item.className = `theme-${THEME_NAME}-item`;
        item.setAttribute("aria-hidden", "true");
        item.style.left = `${slot.x + rand(-4, 4)}%`;
        item.style.top = `${slot.y + rand(-2.5, 2.5)}%`;
        item.style.setProperty("--item-width", `${rand(175, 260)}px`);
        item.style.setProperty("--item-rotate", `${rand(-8, 8)}deg`);
        item.style.setProperty("--item-scale", rand(0.94, 1.12).toFixed(2));
        item.style.setProperty("--item-float-x", `${rand(-10, 10)}px`);
        item.style.setProperty("--item-float-y", `${rand(-14, 14)}px`);
        item.style.setProperty("--item-duration", `${rand(6.2, 10.4)}s`);
        item.style.setProperty("--item-delay", `${-rand(0, 8)}s`);
        item.style.zIndex = String(10 + index);

        const img = document.createElement("img");
        img.alt = "";
        img.draggable = false;
        img.decoding = "async";
        assignImageWithFallback(img, file);

        item.appendChild(img);

        item.addEventListener("mouseenter", () => {
            item.classList.remove(`theme-${THEME_NAME}-pop`);
            void item.offsetWidth;
            item.classList.add(`theme-${THEME_NAME}-pop`);
            playHoverSound();
            const rect = item.getBoundingClientRect();
            createBurst(rect.left + rect.width / 2, rect.top + rect.height / 2);
            setTimeout(() => item.classList.remove(`theme-${THEME_NAME}-pop`), 540);
        });

        layer.appendChild(item);
        themeItems.push(item);
    });
}

export function mount() {
    if (themeRoot) return;
    themeAddedBodyClass = !document.body.classList.contains(`theme-${THEME_NAME}`);
    document.body.classList.add(`theme-${THEME_NAME}`);

    themeRoot = document.createElement("div");
    themeRoot.id = `${THEME_NAME}-background`;
    themeRoot.className = `theme-${THEME_NAME}-background`;
    themeRoot.setAttribute("aria-hidden", "true");
    document.body.appendChild(themeRoot);

    createDecorations();
    createItems();
    playIntro();
}

export function unmount() {
    finishIntro();
    stopHoverAudio();
    themeItems = [];
    if (themeRoot) {
        themeRoot.remove();
        themeRoot = null;
    }
    if (themeAddedBodyClass) {
        document.body.classList.remove(`theme-${THEME_NAME}`);
    }
    themeAddedBodyClass = false;
}
