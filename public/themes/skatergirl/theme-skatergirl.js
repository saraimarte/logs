
/* ============================================================
   SKATERGIRL THEME
   - Large randomized skatergirl SVGs
   - Intro music plays up to 0:20 and fades out
   - Some SVGs dance while the intro plays
   - Hover sounds use the requested sounds from /sounds/winx
   - Hover sounds are blocked until the intro is done
   ============================================================ */

let skatergirlRoot = null;
let skatergirlItems = [];
let skatergirlAddedBodyClass = false;

let skatergirlIntroAudio = null;
let skatergirlIntroFinished = true;
let skatergirlIntroFallback = null;
let skatergirlIntroTimer = null;
let skatergirlHoverAudio = null;

const ASSET_ROOT = "/svg/theme-skatergirl/";
const SKATERGIRL_ASSETS = [
    "skatergirl-pose-01.svg",
    "skatergirl-pose-02.svg",
    "skatergirl-pose-03.svg",
    "skatergirl-pose-04.svg"
];

const INTRO_SRC = "/sounds/intros/octosound-sunny-california-185477.mp3";
const INTRO_CUTOFF = 20;
const INTRO_FADE_START = 15;
const INTRO_VOLUME = 0.33;

const HOVER_SOUNDS = [
    "/sounds/winx/cartoon_music-arcade-game-positive-selection-bling-489760.mp3",
    "/sounds/winx/freesound_community-electricity-sound-6066.mp3",
    "/sounds/winx/freesound_community-match-sizzle-02-104778.mp3",
    "/sounds/winx/koiroylers-get-coin-351945.mp3"
];

function rand(min, max) {
    return Math.random() * (max - min) + min;
}

function pickRandom(list) {
    return list[Math.floor(Math.random() * list.length)];
}

function removeIntroFallback() {
    if (!skatergirlIntroFallback) return;
    window.removeEventListener("pointerdown", skatergirlIntroFallback);
    window.removeEventListener("keydown", skatergirlIntroFallback);
    skatergirlIntroFallback = null;
}

function clearIntroTimer() {
    if (skatergirlIntroTimer) {
        clearInterval(skatergirlIntroTimer);
        skatergirlIntroTimer = null;
    }
}

function stopHoverAudio() {
    if (!skatergirlHoverAudio) return;
    try {
        skatergirlHoverAudio.pause();
        skatergirlHoverAudio.currentTime = 0;
    } catch (_) {}
    skatergirlHoverAudio = null;
}

function stopItemDancing() {
    skatergirlItems.forEach((item) => {
        item.classList.remove("theme-skatergirl-dancing");
    });
}

function startRandomItemDancing() {
    stopItemDancing();

    const shuffled = [...skatergirlItems].sort(() => Math.random() - 0.5);
    const dancers = shuffled.slice(0, Math.min(3, shuffled.length));

    dancers.forEach((item, index) => {
        item.classList.add("theme-skatergirl-dancing");
        item.style.setProperty("--dance-delay", `${index * 0.14}s`);
    });
}

function finishIntro() {
    skatergirlIntroFinished = true;
    clearIntroTimer();
    removeIntroFallback();
    stopItemDancing();

    if (skatergirlIntroAudio) {
        try {
            skatergirlIntroAudio.pause();
            skatergirlIntroAudio.currentTime = 0;
            skatergirlIntroAudio.volume = INTRO_VOLUME;
        } catch (_) {}
    }

    skatergirlIntroAudio = null;
}

function playIntro() {
    finishIntro();
    skatergirlIntroFinished = false;
    startRandomItemDancing();

    const audio = new Audio(INTRO_SRC);
    skatergirlIntroAudio = audio;
    audio.preload = "auto";
    audio.volume = INTRO_VOLUME;

    const updateFade = () => {
        if (skatergirlIntroAudio !== audio) return;

        const t = audio.currentTime || 0;

        if (t >= INTRO_CUTOFF) {
            finishIntro();
            return;
        }

        if (t >= INTRO_FADE_START) {
            const progress = Math.min(
                1,
                (t - INTRO_FADE_START) / (INTRO_CUTOFF - INTRO_FADE_START)
            );
            audio.volume = Math.max(0, INTRO_VOLUME * (1 - progress));
        } else {
            audio.volume = INTRO_VOLUME;
        }
    };

    clearIntroTimer();
    skatergirlIntroTimer = setInterval(updateFade, 120);

    audio.addEventListener("ended", finishIntro, { once: true });
    audio.addEventListener("error", finishIntro, { once: true });
    audio.addEventListener("playing", removeIntroFallback, { once: true });

    const attempt = () => {
        if (skatergirlIntroAudio !== audio) return;

        const promise = audio.play();
        if (promise && typeof promise.catch === "function") {
            promise.catch(() => {
                if (skatergirlIntroFallback || skatergirlIntroAudio !== audio) return;

                skatergirlIntroFallback = () => {
                    if (skatergirlIntroAudio !== audio) return;
                    const retry = audio.play();
                    if (retry && typeof retry.catch === "function") {
                        retry.catch(() => {});
                    }
                };

                window.addEventListener("pointerdown", skatergirlIntroFallback);
                window.addEventListener("keydown", skatergirlIntroFallback);
            });
        }
    };

    attempt();
}

function playHoverSound() {
    if (!skatergirlIntroFinished) return;

    stopHoverAudio();

    const audio = new Audio(pickRandom(HOVER_SOUNDS));
    skatergirlHoverAudio = audio;
    audio.preload = "auto";
    audio.volume = 0.42;

    audio.addEventListener("ended", () => {
        if (skatergirlHoverAudio === audio) {
            skatergirlHoverAudio = null;
        }
    }, { once: true });

    audio.addEventListener("error", () => {
        if (skatergirlHoverAudio === audio) {
            skatergirlHoverAudio = null;
        }
    }, { once: true });

    const promise = audio.play();
    if (promise && typeof promise.catch === "function") {
        promise.catch(() => {
            if (skatergirlHoverAudio === audio) {
                skatergirlHoverAudio = null;
            }
        });
    }
}

function createDecorations(root) {
    const glow = document.createElement("div");
    glow.className = "theme-skatergirl-glow";
    root.appendChild(glow);

    const stripes = document.createElement("div");
    stripes.className = "theme-skatergirl-stripes";
    root.appendChild(stripes);

    const dots = document.createElement("div");
    dots.className = "theme-skatergirl-dots";
    root.appendChild(dots);

    for (let i = 0; i < 22; i++) {
        const dot = document.createElement("span");
        dot.className = "theme-skatergirl-dot";
        dot.style.left = `${rand(2, 98)}%`;
        dot.style.top = `${rand(6, 94)}%`;
        dot.style.setProperty("--dot-size", `${rand(10, 34)}px`);
        dot.style.setProperty("--dot-delay", `${-rand(0, 8)}s`);
        dot.style.setProperty("--dot-duration", `${rand(5.5, 10.5)}s`);
        dot.style.setProperty("--dot-dx", `${rand(-16, 16)}px`);
        dot.style.setProperty("--dot-dy", `${rand(-20, 20)}px`);
        dots.appendChild(dot);
    }

    const floor = document.createElement("div");
    floor.className = "theme-skatergirl-floor";
    root.appendChild(floor);

    const sparkLayer = document.createElement("div");
    sparkLayer.className = "theme-skatergirl-spark-layer";
    root.appendChild(sparkLayer);
}

function makeSlots() {
    const slots = [
        { x: rand(14, 20), y: rand(27, 38), rotation: rand(-8, -2) },
        { x: rand(80, 86), y: rand(25, 37), rotation: rand(2, 8) },
        { x: rand(16, 23), y: rand(67, 79), rotation: rand(-6, 4) },
        { x: rand(77, 85), y: rand(66, 78), rotation: rand(-4, 8) }
    ];

    return slots.sort(() => Math.random() - 0.5);
}

function createSparkBurst(x, y) {
    if (!skatergirlRoot) return;

    const layer = skatergirlRoot.querySelector(".theme-skatergirl-spark-layer");
    if (!layer) return;

    for (let i = 0; i < 7; i++) {
        const spark = document.createElement("span");
        spark.className = "theme-skatergirl-spark";

        const angle = ((Math.PI * 2) / 7) * i + rand(-0.18, 0.18);
        const distance = rand(28, 58);

        spark.style.left = `${x}px`;
        spark.style.top = `${y}px`;
        spark.style.setProperty("--spark-x", `${Math.cos(angle) * distance}px`);
        spark.style.setProperty("--spark-y", `${Math.sin(angle) * distance}px`);
        spark.style.setProperty("--spark-size", `${rand(5, 12)}px`);

        layer.appendChild(spark);
        setTimeout(() => spark.remove(), 720);
    }
}

function createItems(root) {
    const layer = document.createElement("div");
    layer.className = "theme-skatergirl-items";
    root.appendChild(layer);

    const slots = makeSlots();

    SKATERGIRL_ASSETS.forEach((file, index) => {
        const slot = slots[index];
        const item = document.createElement("div");
        item.className = "theme-skatergirl-item";
        item.setAttribute("aria-hidden", "true");

        item.style.left = `${slot.x}%`;
        item.style.top = `${slot.y}%`;
        item.style.setProperty("--item-rotate", `${slot.rotation}deg`);
        item.style.setProperty("--item-scale", rand(0.98, 1.12).toFixed(2));
        item.style.setProperty("--item-float-x", `${rand(-10, 10)}px`);
        item.style.setProperty("--item-float-y", `${rand(-12, 12)}px`);
        item.style.setProperty("--item-duration", `${rand(6.2, 9.3)}s`);
        item.style.setProperty("--item-delay", `${-rand(0, 6)}s`);
        item.style.setProperty("--item-width", `${rand(240, 320)}px`);
        item.style.zIndex = String(10 + index);

        const img = document.createElement("img");
        img.src = `${ASSET_ROOT}${encodeURIComponent(file)}`;
        img.alt = "";
        img.draggable = false;
        img.decoding = "async";

        item.appendChild(img);

        item.addEventListener("mouseenter", (event) => {
            item.classList.remove("theme-skatergirl-pop");
            void item.offsetWidth;
            item.classList.add("theme-skatergirl-pop");

            playHoverSound();

            const rect = item.getBoundingClientRect();
            createSparkBurst(
                rect.left + rect.width / 2,
                rect.top + rect.height / 2
            );

            setTimeout(() => {
                item.classList.remove("theme-skatergirl-pop");
            }, 520);
        });

        layer.appendChild(item);
        skatergirlItems.push(item);
    });
}

export function mount() {
    if (skatergirlRoot) return;

    skatergirlAddedBodyClass = !document.body.classList.contains("theme-skatergirl");
    document.body.classList.add("theme-skatergirl");

    skatergirlRoot = document.createElement("div");
    skatergirlRoot.id = "skatergirl-background";
    skatergirlRoot.className = "theme-skatergirl-background";
    skatergirlRoot.setAttribute("aria-hidden", "true");

    document.body.appendChild(skatergirlRoot);

    createDecorations(skatergirlRoot);
    createItems(skatergirlRoot);
    playIntro();
}

export function unmount() {
    finishIntro();
    stopHoverAudio();
    skatergirlItems = [];

    if (skatergirlRoot) {
        skatergirlRoot.remove();
        skatergirlRoot = null;
    }

    if (skatergirlAddedBodyClass) {
        document.body.classList.remove("theme-skatergirl");
    }
    skatergirlAddedBodyClass = false;
}
