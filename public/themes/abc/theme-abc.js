/* ============================================================
   ABC THEME
   - Uses /svg/theme-abc/abc-01-A.svg through abc-26-Z.svg
   - Red-themed animated alphabet background
   - Decorative letters are randomized on each reload
   - Letters gently animate while on screen
   - Letters react with a bigger wiggle/pop when hovered nearby
   - App structure, cursor system, companions, tabs, and layout
     are preserved
   ============================================================ */

let themeBackground = null;
let themeStylesheet = null;
let themeMouseHandler = null;
let themeItems = [];

let abcIntroAudio = null;
let abcIntroFallbackHandler = null;
let abcIntroFinished = false;
let abcIntroFadeFrame = null;

let abcHoverAudio = null;
let abcHoverStopTimer = null;
let abcLastHoverSoundAt = 0;

const ABC_INTRO_SRC =
    "/sounds/intros/leberch-mystery-quirky-355604.mp3";
const ABC_INTRO_END = 20;
const ABC_INTRO_FADE_START = 15;
const ABC_INTRO_VOLUME = 0.30;

const ABC_HOVER_SOUNDS = [
    {
        src: "/sounds/abc/freesound_community-papier-fouilles-23558.mp3",
        weight: 0.72
    },
    {
        src: "/sounds/abc/freesound_community-card-sounds-35956.mp3",
        weight: 0.28
    }
];
const ABC_HOVER_END = 1;
const ABC_HOVER_VOLUME = 0.34;
const ABC_HOVER_GLOBAL_COOLDOWN = 160;

const THEME_IMAGES = [
    { src: "/svg/theme-abc/abc-01-A.svg", width: 130, height: 130, note: 410.5 },
    { src: "/svg/theme-abc/abc-02-B.svg", width: 130, height: 130, note: 429.0 },
    { src: "/svg/theme-abc/abc-03-C.svg", width: 130, height: 130, note: 447.5 },
    { src: "/svg/theme-abc/abc-04-D.svg", width: 130, height: 130, note: 466.0 },
    { src: "/svg/theme-abc/abc-05-E.svg", width: 130, height: 130, note: 484.5 },
    { src: "/svg/theme-abc/abc-06-F.svg", width: 130, height: 130, note: 503.0 },
    { src: "/svg/theme-abc/abc-07-G.svg", width: 130, height: 130, note: 521.5 },
    { src: "/svg/theme-abc/abc-08-H.svg", width: 130, height: 130, note: 540.0 },
    { src: "/svg/theme-abc/abc-09-I.svg", width: 118, height: 130, note: 558.5 },
    { src: "/svg/theme-abc/abc-10-J.svg", width: 118, height: 130, note: 577.0 },
    { src: "/svg/theme-abc/abc-11-K.svg", width: 130, height: 130, note: 595.5 },
    { src: "/svg/theme-abc/abc-12-L.svg", width: 118, height: 130, note: 614.0 },
    { src: "/svg/theme-abc/abc-13-M.svg", width: 130, height: 130, note: 632.5 },
    { src: "/svg/theme-abc/abc-14-N.svg", width: 130, height: 130, note: 651.0 },
    { src: "/svg/theme-abc/abc-15-O.svg", width: 130, height: 130, note: 669.5 },
    { src: "/svg/theme-abc/abc-16-P.svg", width: 130, height: 130, note: 688.0 },
    { src: "/svg/theme-abc/abc-17-Q.svg", width: 130, height: 130, note: 706.5 },
    { src: "/svg/theme-abc/abc-18-R.svg", width: 130, height: 130, note: 725.0 },
    { src: "/svg/theme-abc/abc-19-S.svg", width: 130, height: 130, note: 743.5 },
    { src: "/svg/theme-abc/abc-20-T.svg", width: 130, height: 130, note: 762.0 },
    { src: "/svg/theme-abc/abc-21-U.svg", width: 130, height: 130, note: 780.5 },
    { src: "/svg/theme-abc/abc-22-V.svg", width: 130, height: 130, note: 799.0 },
    { src: "/svg/theme-abc/abc-23-W.svg", width: 130, height: 130, note: 817.5 },
    { src: "/svg/theme-abc/abc-24-X.svg", width: 130, height: 130, note: 836.0 },
    { src: "/svg/theme-abc/abc-25-Y.svg", width: 130, height: 130, note: 854.5 },
    { src: "/svg/theme-abc/abc-26-Z.svg", width: 130, height: 130, note: 873.0 }
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

function setAbcIntroDancing(isPlaying) {
    if (!themeBackground) return;

    themeBackground.classList.toggle(
        "abc-intro-playing",
        Boolean(isPlaying)
    );
}

function clearAbcIntroFallback() {
    if (!abcIntroFallbackHandler) return;

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
            abcIntroFallbackHandler
        );
    });

    abcIntroFallbackHandler = null;
}

function stopAbcIntro() {
    clearAbcIntroFallback();

    if (abcIntroFadeFrame) {
        cancelAnimationFrame(abcIntroFadeFrame);
        abcIntroFadeFrame = null;
    }

    setAbcIntroDancing(false);

    if (!abcIntroAudio) return;

    try {
        abcIntroAudio.pause();
        abcIntroAudio.currentTime = 0;
        abcIntroAudio.volume = ABC_INTRO_VOLUME;
    } catch (_) {}

    abcIntroAudio = null;
}

function playAbcIntro() {
    stopAbcIntro();
    abcIntroFinished = false;

    const audio = new Audio();
    abcIntroAudio = audio;

    audio.src = ABC_INTRO_SRC;
    audio.preload = "auto";
    audio.autoplay = true;
    audio.playsInline = true;
    audio.loop = false;
    audio.volume = ABC_INTRO_VOLUME;
    audio.load();

    const finishIntro = () => {
        if (abcIntroAudio !== audio) return;

        if (abcIntroFadeFrame) {
            cancelAnimationFrame(abcIntroFadeFrame);
            abcIntroFadeFrame = null;
        }

        setAbcIntroDancing(false);

        try {
            audio.pause();
            audio.currentTime = ABC_INTRO_END;
            audio.volume = 0;
        } catch (_) {}

        abcIntroFinished = true;
    };

    const fadeLoop = () => {
        if (abcIntroAudio !== audio) return;

        const t = audio.currentTime || 0;

        if (t >= ABC_INTRO_END) {
            finishIntro();
            return;
        }

        if (t >= ABC_INTRO_FADE_START) {
            const remaining =
                Math.max(0, ABC_INTRO_END - t);

            const fadeLength =
                ABC_INTRO_END - ABC_INTRO_FADE_START;

            audio.volume =
                ABC_INTRO_VOLUME *
                (remaining / fadeLength);
        } else {
            audio.volume = ABC_INTRO_VOLUME;
        }

        abcIntroFadeFrame =
            requestAnimationFrame(fadeLoop);
    };

    audio.addEventListener(
        "playing",
        () => {
            if (abcIntroAudio !== audio) return;

            setAbcIntroDancing(true);

            if (!abcIntroFadeFrame) {
                abcIntroFadeFrame =
                    requestAnimationFrame(fadeLoop);
            }
        }
    );

    audio.addEventListener(
        "pause",
        () => {
            if (abcIntroAudio === audio) {
                setAbcIntroDancing(false);
            }
        }
    );

    audio.addEventListener(
        "error",
        () => {
            /*
             * If the intro cannot load, do not leave hover audio
             * locked forever.
             */
            setAbcIntroDancing(false);
            abcIntroFinished = true;
        },
        { once: true }
    );

    const tryPlay = () => {
        if (abcIntroAudio !== audio) return;

        const playPromise = audio.play();

        if (
            playPromise &&
            typeof playPromise.catch === "function"
        ) {
            playPromise.catch(() => {
                if (abcIntroFallbackHandler) return;

                abcIntroFallbackHandler = () => {
                    const handler =
                        abcIntroFallbackHandler;

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

                    abcIntroFallbackHandler = null;

                    if (abcIntroAudio !== audio) return;

                    audio.volume = ABC_INTRO_VOLUME;

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
                        abcIntroFallbackHandler,
                        { once: true }
                    );
                });
            });
        }
    };

    tryPlay();
}

function stopAbcHoverSound() {
    if (abcHoverStopTimer) {
        clearTimeout(abcHoverStopTimer);
        abcHoverStopTimer = null;
    }

    if (!abcHoverAudio) return;

    try {
        abcHoverAudio.pause();
        abcHoverAudio.currentTime = 0;
    } catch (_) {}

    abcHoverAudio = null;
}

function pickAbcHoverSound() {
    const roll = Math.random();
    let total = 0;

    for (const sound of ABC_HOVER_SOUNDS) {
        total += sound.weight;

        if (roll <= total) {
            return sound.src;
        }
    }

    return ABC_HOVER_SOUNDS[0].src;
}

function playAbcHoverSound() {
    /*
     * The letter hover animation is always allowed, but this sound
     * stays completely silent until the initial song has finished.
     */
    if (!abcIntroFinished) return;

    const now = performance.now();

    if (
        now - abcLastHoverSoundAt <
        ABC_HOVER_GLOBAL_COOLDOWN
    ) {
        return;
    }

    abcLastHoverSoundAt = now;

    stopAbcHoverSound();

    const audio = new Audio();
    abcHoverAudio = audio;

    audio.src = pickAbcHoverSound();
    audio.preload = "auto";
    audio.volume = ABC_HOVER_VOLUME;
    audio.loop = false;

    const stopAtOneSecond = () => {
        if (abcHoverAudio !== audio) return;

        if ((audio.currentTime || 0) >= ABC_HOVER_END) {
            stopAbcHoverSound();
        }
    };

    audio.addEventListener(
        "timeupdate",
        stopAtOneSecond
    );

    audio.addEventListener(
        "ended",
        () => {
            if (abcHoverAudio === audio) {
                stopAbcHoverSound();
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
            if (abcHoverAudio === audio) {
                stopAbcHoverSound();
            }
        });
    }

    /*
     * Hard cutoff as a backup in case timeupdate fires late.
     */
    abcHoverStopTimer = setTimeout(
        () => {
            if (abcHoverAudio === audio) {
                stopAbcHoverSound();
            }
        },
        1000
    );
}

function buildBackdrop() {
    const wash = document.createElement("div");
    wash.className = "theme-abc-wash";
    themeBackground.appendChild(wash);

    const copybook = document.createElement("div");
    copybook.className = "theme-abc-copybook";
    themeBackground.appendChild(copybook);

    const alphabet = document.createElement("div");
    alphabet.className = "theme-abc-alphabet";
    themeBackground.appendChild(alphabet);

    const rings = document.createElement("div");
    rings.className = "theme-abc-rings";
    themeBackground.appendChild(rings);

    const footer = document.createElement("div");
    footer.className = "theme-abc-footer";
    themeBackground.appendChild(footer);
}

function addObject(asset, placement) {
    const item = document.createElement("div");
    item.className = "theme-abc-item" +
        (placement.soft ? " theme-abc-soft" : "") +
        (placement.emphasis ? " theme-abc-emphasis" : "");

    item.style.left = placement.left;
    item.style.top = placement.top;
    item.style.width = asset.width + "px";
    item.style.height = asset.height + "px";
    item.style.setProperty("--item-scale", placement.scale);
    item.style.setProperty("--item-rotate", placement.rotate + "deg");
    item.style.setProperty("--item-delay", (-rand(0, 7)).toFixed(2) + "s");
    item.style.setProperty("--item-x", rand(-12, 12).toFixed(1) + "px");
    item.style.setProperty("--item-y", rand(-10, 10).toFixed(1) + "px");
    item.style.setProperty("--item-opacity", String(placement.opacity));
    item.style.setProperty("--item-duration", rand(6.8, 9.4).toFixed(2) + "s");
    item.setAttribute("aria-hidden", "true");

    const img = document.createElement("img");
    img.className = "theme-abc-object-image";
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
        itemIndex % 7 === 0
    ) {
        item.classList.add("theme-abc-intro-dancer");

        item.style.setProperty(
            "--abc-dance-delay",
            (-rand(0, 0.8)).toFixed(2) + "s"
        );

        item.style.setProperty(
            "--abc-dance-height",
            rand(10, 18).toFixed(1) + "px"
        );

        item.style.setProperty(
            "--abc-dance-duration",
            rand(0.64, 0.88).toFixed(2) + "s"
        );
    }

    themeItems.push({ el: item, last: 0 });
}

function generatePlacements() {
    const mobile = (window.innerWidth || 1440) < 700;
    const slots = shuffle([
        [7, 20, false], [8, 34, false], [8, 49, false], [8, 64, false], [8, 80, false],
        [17, 25, false], [17, 44, true], [17, 70, false],
        [93, 20, false], [92, 34, false], [92, 49, false], [92, 64, false], [92, 80, false],
        [83, 25, false], [83, 44, true], [83, 70, false],
        [26, 22, false], [39, 23, false], [61, 23, false], [74, 22, false],
        [24, 82, false], [36, 84, false], [49, 83, false], [62, 84, false], [75, 82, false],
        [30, 37, true], [69, 37, true], [30, 61, true], [69, 61, true],
        [43, 68, true], [57, 68, true], [50, 31, true]
    ]);

    const selected = [];
    while (selected.length < TOTAL_OBJECT_COUNT) {
        const cycle = shuffle(THEME_IMAGES);
        for (const asset of cycle) {
            if (selected.length >= TOTAL_OBJECT_COUNT) break;
            selected.push(asset);
        }
    }

    return slots.slice(0, TOTAL_OBJECT_COUNT).map((slot, index) => {
        const soft = slot[2];
        const scale = mobile
            ? rand(soft ? 0.58 : 0.74, soft ? 0.76 : 0.95)
            : rand(soft ? 0.72 : 0.92, soft ? 0.90 : 1.18);

        return {
            asset: selected[index],
            left: slot[0] + "%",
            top: slot[1] + "%",
            scale: Number(scale.toFixed(3)),
            rotate: rand(-14, 14),
            opacity: soft ? Number(rand(0.18, 0.30).toFixed(2)) : Number(rand(0.68, 0.90).toFixed(2)),
            soft,
            emphasis: !soft
        };
    });
}

function createObjects() {
    generatePlacements().forEach((placement) => addObject(placement.asset, placement));
}

function startInteraction() {
    const radius = 74;

    themeMouseHandler = (event) => {
        const now = performance.now();

        themeItems.forEach((obj) => {
            const r = obj.el.getBoundingClientRect();
            const cx = r.left + r.width / 2;
            const cy = r.top + r.height / 2;

            if (
                Math.hypot(cx - event.clientX, cy - event.clientY) <= radius &&
                now - obj.last > 520
            ) {
                obj.last = now;
                obj.el.classList.remove("theme-abc-react");
                void obj.el.offsetWidth;
                obj.el.classList.add("theme-abc-react");

                playAbcHoverSound();

                setTimeout(
                    () => obj.el.classList.remove("theme-abc-react"),
                    540
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
    themeStylesheet.href = "/themes/theme-abc.css";
    themeStylesheet.dataset.theme = "abc";
    document.head.appendChild(themeStylesheet);

    themeBackground = document.createElement("div");
    themeBackground.id = "abc-background";
    themeBackground.setAttribute("aria-hidden", "true");
    document.body.appendChild(themeBackground);

    abcIntroFinished = false;
    playAbcIntro();

    buildBackdrop();
    createObjects();
    startInteraction();
}

export function unmount() {
    stopAbcIntro();
    stopAbcHoverSound();
    abcIntroFinished = false;

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
