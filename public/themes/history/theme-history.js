/* ============================================================
   HISTORY THEME
   Uses /svg/theme-history/history-10...history-18 assets.
   Large historical objects are randomized every reload.
   App layout, tabs, cursor, companions, spacing, and component
   sizes are preserved.
   ============================================================ */

let themeBackground = null;
let themeStylesheet = null;
let themeMouseHandler = null;
let themeItems = [];

let historyIntroAudio = null;
let historyIntroFallbackHandler = null;
let historyIntroFinished = false;
let historyIntroFadeFrame = null;

let historyHoverAudio = null;
let historyLastHoverSoundAt = 0;

const HISTORY_INTRO_SRC =
    "/sounds/intros/jakob_welik-wonderful-epic-music-collection-4-track-119-527046.mp3";
const HISTORY_INTRO_END = 30;
const HISTORY_INTRO_FADE_START = 25;
const HISTORY_INTRO_VOLUME = 0.30;

const HISTORY_HOVER_SOUNDS = [
    "/sounds/history/freesound_community-card-sounds-35956.mp3",
    "/sounds/history/freesound_community-papier-fouilles-23558.mp3"
];
const HISTORY_HOVER_VOLUME = 0.34;
const HISTORY_HOVER_GLOBAL_COOLDOWN = 220;

const THEME_IMAGES = [
    { src: "/svg/theme-history/history-10-colosseum.svg", width: 188, height: 150 },
    { src: "/svg/theme-history/history-11-classical-bust.svg", width: 154, height: 180 },
    { src: "/svg/theme-history/history-12-roman-temple.svg", width: 190, height: 154 },
    { src: "/svg/theme-history/history-13-marble-bust.svg", width: 156, height: 184 },
    { src: "/svg/theme-history/history-14-colosseum-angle.svg", width: 194, height: 154 },
    { src: "/svg/theme-history/history-15-broken-clock.svg", width: 154, height: 154 },
    { src: "/svg/theme-history/history-16-leaning-tower-pisa.svg", width: 144, height: 190 },
    { src: "/svg/theme-history/history-17-big-ben.svg", width: 140, height: 192 },
    { src: "/svg/theme-history/history-18-hourglass-clock.svg", width: 148, height: 172 }
];

const TOTAL_OBJECT_COUNT = 24;

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

function setHistoryIntroDancing(isPlaying) {
    if (!themeBackground) return;

    themeBackground.classList.toggle(
        "history-intro-playing",
        Boolean(isPlaying)
    );
}

function clearHistoryIntroFallback() {
    if (!historyIntroFallbackHandler) return;

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
            historyIntroFallbackHandler
        );
    });

    historyIntroFallbackHandler = null;
}

function stopHistoryIntro() {
    clearHistoryIntroFallback();

    if (historyIntroFadeFrame) {
        cancelAnimationFrame(historyIntroFadeFrame);
        historyIntroFadeFrame = null;
    }

    setHistoryIntroDancing(false);

    if (!historyIntroAudio) return;

    try {
        historyIntroAudio.pause();
        historyIntroAudio.currentTime = 0;
        historyIntroAudio.volume = HISTORY_INTRO_VOLUME;
    } catch (_) {}

    historyIntroAudio = null;
}

function playHistoryIntro() {
    stopHistoryIntro();
    historyIntroFinished = false;

    const audio = new Audio();
    historyIntroAudio = audio;

    audio.src = HISTORY_INTRO_SRC;
    audio.preload = "auto";
    audio.autoplay = true;
    audio.playsInline = true;
    audio.loop = false;
    audio.volume = HISTORY_INTRO_VOLUME;
    audio.load();

    const finishIntro = () => {
        if (historyIntroAudio !== audio) return;

        if (historyIntroFadeFrame) {
            cancelAnimationFrame(historyIntroFadeFrame);
            historyIntroFadeFrame = null;
        }

        setHistoryIntroDancing(false);

        try {
            audio.pause();
            audio.currentTime = HISTORY_INTRO_END;
            audio.volume = 0;
        } catch (_) {}

        historyIntroFinished = true;
    };

    const fadeLoop = () => {
        if (historyIntroAudio !== audio) return;

        const t = audio.currentTime || 0;

        if (t >= HISTORY_INTRO_END) {
            finishIntro();
            return;
        }

        if (t >= HISTORY_INTRO_FADE_START) {
            const remaining =
                Math.max(0, HISTORY_INTRO_END - t);

            const fadeLength =
                HISTORY_INTRO_END -
                HISTORY_INTRO_FADE_START;

            audio.volume =
                HISTORY_INTRO_VOLUME *
                (remaining / fadeLength);
        } else {
            audio.volume = HISTORY_INTRO_VOLUME;
        }

        historyIntroFadeFrame =
            requestAnimationFrame(fadeLoop);
    };

    audio.addEventListener(
        "playing",
        () => {
            if (historyIntroAudio !== audio) return;

            setHistoryIntroDancing(true);

            if (!historyIntroFadeFrame) {
                historyIntroFadeFrame =
                    requestAnimationFrame(fadeLoop);
            }
        }
    );

    audio.addEventListener(
        "pause",
        () => {
            if (historyIntroAudio === audio) {
                setHistoryIntroDancing(false);
            }
        }
    );

    audio.addEventListener(
        "error",
        () => {
            /*
             * If the intro file cannot load, do not permanently lock
             * the normal history hover sounds.
             */
            setHistoryIntroDancing(false);
            historyIntroFinished = true;
        },
        { once: true }
    );

    const tryPlay = () => {
        if (historyIntroAudio !== audio) return;

        const playPromise = audio.play();

        if (
            playPromise &&
            typeof playPromise.catch === "function"
        ) {
            playPromise.catch(() => {
                if (historyIntroFallbackHandler) return;

                historyIntroFallbackHandler = () => {
                    const handler =
                        historyIntroFallbackHandler;

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

                    historyIntroFallbackHandler = null;

                    if (historyIntroAudio !== audio) return;

                    audio.volume = HISTORY_INTRO_VOLUME;

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
                        historyIntroFallbackHandler,
                        { once: true }
                    );
                });
            });
        }
    };

    tryPlay();
}

function stopHistoryHoverSound() {
    if (!historyHoverAudio) return;

    try {
        historyHoverAudio.pause();
        historyHoverAudio.currentTime = 0;
    } catch (_) {}

    historyHoverAudio = null;
}

function playHistoryHoverSound() {
    /*
     * The visual hover reaction always works, but hover audio stays
     * locked until the intro music is finished.
     */
    if (!historyIntroFinished) return;

    const now = performance.now();

    if (
        now - historyLastHoverSoundAt <
        HISTORY_HOVER_GLOBAL_COOLDOWN
    ) {
        return;
    }

    historyLastHoverSoundAt = now;

    stopHistoryHoverSound();

    const audio = new Audio();
    historyHoverAudio = audio;

    audio.src =
        HISTORY_HOVER_SOUNDS[
            Math.floor(Math.random() * HISTORY_HOVER_SOUNDS.length)
        ];

    audio.preload = "auto";
    audio.volume = HISTORY_HOVER_VOLUME;
    audio.loop = false;

    audio.addEventListener(
        "ended",
        () => {
            if (historyHoverAudio === audio) {
                historyHoverAudio = null;
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
            if (historyHoverAudio === audio) {
                historyHoverAudio = null;
            }
        });
    }
}

function buildBackdrop() {
    const parchment = document.createElement("div");
    parchment.className = "theme-history-parchment";
    themeBackground.appendChild(parchment);

    const map = document.createElement("div");
    map.className = "theme-history-map";
    themeBackground.appendChild(map);

    const timeline = document.createElement("div");
    timeline.className = "theme-history-timeline";
    themeBackground.appendChild(timeline);

    const vignette = document.createElement("div");
    vignette.className = "theme-history-vignette";
    themeBackground.appendChild(vignette);
}

function addObject(asset, placement) {
    const item = document.createElement("div");
    item.className = "theme-history-item" + (placement.soft ? " theme-history-soft" : "");

    item.style.left = placement.left;
    item.style.top = placement.top;
    item.style.width = asset.width + "px";
    item.style.height = asset.height + "px";
    item.style.setProperty("--item-scale", placement.scale);
    item.style.setProperty("--item-rotate", placement.rotate + "deg");
    item.style.setProperty("--item-delay", (-rand(0, 8)).toFixed(2) + "s");
    item.style.setProperty("--item-x", rand(-10, 10).toFixed(1) + "px");
    item.style.setProperty("--item-y", rand(-8, 8).toFixed(1) + "px");
    item.style.setProperty("--item-opacity", placement.opacity);
    item.style.setProperty("--item-duration", rand(7.5, 10.5).toFixed(2) + "s");
    item.setAttribute("aria-hidden", "true");

    const img = document.createElement("img");
    img.className = "theme-history-object-image";
    img.src = asset.src;
    img.alt = "";
    img.draggable = false;
    img.decoding = "async";
    img.addEventListener("error", () => item.remove(), { once: true });

    item.appendChild(img);
    themeBackground.appendChild(item);

    const itemIndex = themeItems.length;

    if (
        itemIndex % 3 === 0 ||
        itemIndex % 8 === 0
    ) {
        item.classList.add("theme-history-intro-dancer");

        item.style.setProperty(
            "--history-dance-delay",
            (-rand(0, 0.9)).toFixed(2) + "s"
        );

        item.style.setProperty(
            "--history-dance-height",
            rand(10, 18).toFixed(1) + "px"
        );

        item.style.setProperty(
            "--history-dance-duration",
            rand(0.68, 0.92).toFixed(2) + "s"
        );
    }

    themeItems.push({ el: item, last: 0 });
}

function generatePlacements() {
    const mobile = (window.innerWidth || 1440) < 700;

    /*
     * Large fixed slots, shuffled every load.
     * The positions themselves vary slightly too, so every reload
     * looks different while keeping the busy center readable.
     */
    const slots = shuffle([
        [6,18,false],[7,34,false],[7,51,false],[7,69,false],[8,85,false],
        [18,24,false],[18,47,true],[18,74,false],

        [94,18,false],[93,34,false],[93,51,false],[93,69,false],[92,85,false],
        [82,24,false],[82,47,true],[82,74,false],

        [29,22,false],[43,23,false],[57,23,false],[71,22,false],

        [27,83,false],[42,85,false],[58,85,false],[73,83,false]
    ]);

    const pool = [];
    while (pool.length < TOTAL_OBJECT_COUNT) {
        const cycle = shuffle(THEME_IMAGES);
        for (const asset of cycle) {
            if (pool.length >= TOTAL_OBJECT_COUNT) break;
            pool.push(asset);
        }
    }

    return slots.slice(0, TOTAL_OBJECT_COUNT).map((slot, index) => {
        const soft = slot[2];
        const jitterX = rand(-2.8, 2.8);
        const jitterY = rand(-2.4, 2.4);

        const scale = mobile
            ? rand(soft ? 0.78 : 0.92, soft ? 0.96 : 1.12)
            : rand(soft ? 0.94 : 1.10, soft ? 1.10 : 1.34);

        return {
            asset: pool[index],
            left: (slot[0] + jitterX).toFixed(2) + "%",
            top: (slot[1] + jitterY).toFixed(2) + "%",
            scale: Number(scale.toFixed(3)),
            rotate: rand(-9, 9),
            opacity: soft ? Number(rand(0.40, 0.56).toFixed(2)) : Number(rand(0.78, 0.94).toFixed(2)),
            soft
        };
    });
}

function createObjects() {
    generatePlacements().forEach((placement) => addObject(placement.asset, placement));
}

function startInteraction() {
    const radius = 88;

    themeMouseHandler = (event) => {
        const now = performance.now();

        themeItems.forEach((obj) => {
            const r = obj.el.getBoundingClientRect();
            const cx = r.left + r.width / 2;
            const cy = r.top + r.height / 2;

            if (
                Math.hypot(cx - event.clientX, cy - event.clientY) <= radius &&
                now - obj.last > 580
            ) {
                obj.last = now;
                obj.el.classList.remove("theme-history-react");
                void obj.el.offsetWidth;
                obj.el.classList.add("theme-history-react");

                playHistoryHoverSound();

                setTimeout(
                    () => obj.el.classList.remove("theme-history-react"),
                    560
                );
            }
        });
    };

    window.addEventListener("mousemove", themeMouseHandler, { passive: true });
}

export function mount() {
    if (themeBackground) return;

    themeStylesheet = document.createElement("link");
    themeStylesheet.rel = "stylesheet";
    themeStylesheet.href = "/themes/theme-history.css";
    themeStylesheet.dataset.theme = "history";
    document.head.appendChild(themeStylesheet);

    themeBackground = document.createElement("div");
    themeBackground.id = "history-background";
    themeBackground.setAttribute("aria-hidden", "true");
    document.body.appendChild(themeBackground);

    historyIntroFinished = false;
    playHistoryIntro();

    buildBackdrop();
    createObjects();
    startInteraction();
}

export function unmount() {
    stopHistoryIntro();
    stopHistoryHoverSound();
    historyIntroFinished = false;

    if (themeMouseHandler) {
        window.removeEventListener("mousemove", themeMouseHandler);
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
