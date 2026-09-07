let themeBackground = null;
let themeStylesheet = null;
let themeAudio = null;
let themeMouseHandler = null;
let themeItems = [];
let lastGlobalSound = 0;

let triviaIntroAudio = null;
let triviaIntroFallbackHandler = null;
let triviaIntroFinished = false;
let triviaIntroFadeFrame = null;

let triviaHoverAudio = null;
let triviaLastHoverSoundAt = 0;

const TRIVIA_INTRO_SRC =
    "/sounds/intros/backgroundmusicmaster-quiz-master-382651.mp3";
const TRIVIA_INTRO_END = 43;
const TRIVIA_INTRO_FADE_START = 38;
const TRIVIA_INTRO_VOLUME = 0.30;

const TRIVIA_HOVER_SOUNDS = [
    "/sounds/history/freesound_community-card-sounds-35956.mp3",
    "/sounds/history/freesound_community-papier-fouilles-23558.mp3"
];
const TRIVIA_HOVER_VOLUME = 0.34;
const TRIVIA_HOVER_GLOBAL_COOLDOWN = 220;

const THEME_SVGS = ["<svg viewBox=\"0 0 100 120\" xmlns=\"http://www.w3.org/2000/svg\"><text x=\"28\" y=\"84\" font-size=\"82\" font-family=\"sans-serif\" font-weight=\"700\" fill=\"currentColor\">?</text></svg>", "<svg viewBox=\"0 0 100 130\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M50 14 Q78 18 78 48 Q78 64 64 77 H36 Q22 64 22 48 Q22 18 50 14Z\" fill=\"#ffe79a\" stroke=\"currentColor\" stroke-width=\"4\"/><rect x=\"38\" y=\"77\" width=\"24\" height=\"18\" rx=\"4\" fill=\"#b7bbd2\" stroke=\"currentColor\" stroke-width=\"4\"/><path d=\"M39 34 L47 50 H56 L47 67\" fill=\"none\" stroke=\"#e0ad58\" stroke-width=\"4\"/></svg>", "<svg viewBox=\"0 0 100 120\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M28 18 H72 V40 Q72 62 50 62 Q28 62 28 40Z\" fill=\"#e0ad58\" stroke=\"currentColor\" stroke-width=\"4\"/><path d=\"M28 24 H18 Q18 46 32 48 M72 24 H82 Q82 46 68 48\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"4\"/><path d=\"M50 62V86 M35 98H65\" stroke=\"currentColor\" stroke-width=\"5\"/></svg>", "<svg viewBox=\"0 0 110 90\" xmlns=\"http://www.w3.org/2000/svg\"><rect x=\"16\" y=\"16\" width=\"78\" height=\"58\" rx=\"8\" fill=\"#faf8f0\" stroke=\"currentColor\" stroke-width=\"4\"/><path d=\"M28 36H82 M28 52H65\" stroke=\"#8b6fd7\" stroke-width=\"4\" stroke-linecap=\"round\"/><circle cx=\"78\" cy=\"53\" r=\"7\" fill=\"#e0ad58\"/></svg>"];
const THEME_NOTES = [329.63, 392.0, 523.25, 659.25];
const SOUND_STYLE = "coin";

function rand(min, max) {
    return Math.random() * (max - min) + min;
}

function setTriviaIntroDancing(isPlaying) {
    if (!themeBackground) return;

    themeBackground.classList.toggle(
        "trivia-intro-playing",
        Boolean(isPlaying)
    );
}

function clearTriviaIntroFallback() {
    if (!triviaIntroFallbackHandler) return;

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
            triviaIntroFallbackHandler
        );
    });

    triviaIntroFallbackHandler = null;
}

function stopTriviaIntro() {
    clearTriviaIntroFallback();

    if (triviaIntroFadeFrame) {
        cancelAnimationFrame(triviaIntroFadeFrame);
        triviaIntroFadeFrame = null;
    }

    setTriviaIntroDancing(false);

    if (!triviaIntroAudio) return;

    try {
        triviaIntroAudio.pause();
        triviaIntroAudio.currentTime = 0;
        triviaIntroAudio.volume = TRIVIA_INTRO_VOLUME;
    } catch (_) {}

    triviaIntroAudio = null;
}

function playTriviaIntro() {
    stopTriviaIntro();
    triviaIntroFinished = false;

    const audio = new Audio();
    triviaIntroAudio = audio;

    audio.src = TRIVIA_INTRO_SRC;
    audio.preload = "auto";
    audio.autoplay = true;
    audio.playsInline = true;
    audio.loop = false;
    audio.volume = TRIVIA_INTRO_VOLUME;
    audio.load();

    const finishIntro = () => {
        if (triviaIntroAudio !== audio) return;

        if (triviaIntroFadeFrame) {
            cancelAnimationFrame(triviaIntroFadeFrame);
            triviaIntroFadeFrame = null;
        }

        setTriviaIntroDancing(false);

        try {
            audio.pause();
            audio.currentTime = TRIVIA_INTRO_END;
            audio.volume = 0;
        } catch (_) {}

        triviaIntroFinished = true;
    };

    const fadeLoop = () => {
        if (triviaIntroAudio !== audio) return;

        const t = audio.currentTime || 0;

        if (t >= TRIVIA_INTRO_END) {
            finishIntro();
            return;
        }

        if (t >= TRIVIA_INTRO_FADE_START) {
            const remaining =
                Math.max(0, TRIVIA_INTRO_END - t);

            const fadeLength =
                TRIVIA_INTRO_END -
                TRIVIA_INTRO_FADE_START;

            audio.volume =
                TRIVIA_INTRO_VOLUME *
                (remaining / fadeLength);
        } else {
            audio.volume = TRIVIA_INTRO_VOLUME;
        }

        triviaIntroFadeFrame =
            requestAnimationFrame(fadeLoop);
    };

    audio.addEventListener(
        "playing",
        () => {
            if (triviaIntroAudio !== audio) return;

            setTriviaIntroDancing(true);

            if (!triviaIntroFadeFrame) {
                triviaIntroFadeFrame =
                    requestAnimationFrame(fadeLoop);
            }
        }
    );

    audio.addEventListener(
        "pause",
        () => {
            if (triviaIntroAudio === audio) {
                setTriviaIntroDancing(false);
            }
        }
    );

    audio.addEventListener(
        "error",
        () => {
            setTriviaIntroDancing(false);
            triviaIntroFinished = true;
        },
        { once: true }
    );

    const tryPlay = () => {
        if (triviaIntroAudio !== audio) return;

        const playPromise = audio.play();

        if (
            playPromise &&
            typeof playPromise.catch === "function"
        ) {
            playPromise.catch(() => {
                if (triviaIntroFallbackHandler) return;

                triviaIntroFallbackHandler = () => {
                    const handler =
                        triviaIntroFallbackHandler;

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

                    triviaIntroFallbackHandler = null;

                    if (triviaIntroAudio !== audio) return;

                    audio.volume = TRIVIA_INTRO_VOLUME;

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
                        triviaIntroFallbackHandler,
                        { once: true }
                    );
                });
            });
        }
    };

    tryPlay();
}

function stopTriviaHoverSound() {
    if (!triviaHoverAudio) return;

    try {
        triviaHoverAudio.pause();
        triviaHoverAudio.currentTime = 0;
    } catch (_) {}

    triviaHoverAudio = null;
}

function playTriviaHoverSound() {
    /*
     * Visual hover reactions still work during the intro,
     * but their sounds wait until the intro is finished.
     */
    if (!triviaIntroFinished) return;

    const now = performance.now();

    if (
        now - triviaLastHoverSoundAt <
        TRIVIA_HOVER_GLOBAL_COOLDOWN
    ) {
        return;
    }

    triviaLastHoverSoundAt = now;

    stopTriviaHoverSound();

    const audio = new Audio();
    triviaHoverAudio = audio;

    audio.src =
        TRIVIA_HOVER_SOUNDS[
            Math.floor(Math.random() * TRIVIA_HOVER_SOUNDS.length)
        ];

    audio.preload = "auto";
    audio.volume = TRIVIA_HOVER_VOLUME;
    audio.loop = false;

    audio.addEventListener(
        "ended",
        () => {
            if (triviaHoverAudio === audio) {
                triviaHoverAudio = null;
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
            if (triviaHoverAudio === audio) {
                triviaHoverAudio = null;
            }
        });
    }
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
    const osc = ctx.createOscillator();
    const osc2 = ctx.createOscillator();

    let type = "sine";
    let type2 = "triangle";
    let duration = .45;
    let volume = .10;
    let cutoff = 2800;

    switch (SOUND_STYLE) {
        case "ding":
        case "clink":
        case "sparkle":
        case "shutter":
        case "chime":
            type = "sine"; type2 = "sine"; duration = .55; volume = .11; cutoff = 4600; break;
        case "engine":
        case "alarm":
            type = "sawtooth"; type2 = "triangle"; duration = .30; volume = .07; cutoff = 900; freq *= .6; break;
        case "flip":
        case "scratch":
        case "draft":
            type = "triangle"; type2 = "sine"; duration = .24; volume = .07; cutoff = 2200; break;
        case "cash":
        case "coin":
            type = "square"; type2 = "sine"; duration = .24; volume = .07; cutoff = 3800; break;
        case "arcade":
        case "digital":
        case "click":
        case "beep":
            type = "square"; type2 = "triangle"; duration = .22; volume = .065; cutoff = 3900; break;
        case "chirp":
        case "buzz":
        case "swish":
        case "pop":
        case "snip":
        case "tap":
            type = "triangle"; type2 = "sine"; duration = .28; volume = .075; cutoff = 2500; break;
        case "applause":
            type = "triangle"; type2 = "sine"; duration = .40; volume = .09; cutoff = 2200; break;
    }

    filter.type = "lowpass";
    filter.frequency.setValueAtTime(cutoff, now);
    master.gain.setValueAtTime(.0001, now);
    master.gain.exponentialRampToValueAtTime(volume, now + .008);
    master.gain.exponentialRampToValueAtTime(.0001, now + duration);

    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);
    osc2.type = type2;
    osc2.frequency.setValueAtTime(freq * 1.5, now);

    const g2 = ctx.createGain();
    g2.gain.setValueAtTime(.28, now);
    g2.gain.exponentialRampToValueAtTime(.0001, now + Math.max(.16, duration * .7));

    osc.connect(filter);
    osc2.connect(g2);
    g2.connect(filter);
    filter.connect(master);
    master.connect(ctx.destination);

    if (SOUND_STYLE === "chirp") {
        osc.frequency.exponentialRampToValueAtTime(freq * 1.35, now + duration);
    }
    if (SOUND_STYLE === "buzz") {
        osc.frequency.setValueAtTime(freq, now);
        osc.frequency.setValueAtTime(freq * 1.03, now + .03);
        osc.frequency.setValueAtTime(freq * .97, now + .06);
        osc.frequency.setValueAtTime(freq * 1.03, now + .09);
    }
    if (SOUND_STYLE === "arcade" || SOUND_STYLE === "digital" || SOUND_STYLE === "click" || SOUND_STYLE === "beep") {
        osc.frequency.setValueAtTime(freq, now);
        osc.frequency.setValueAtTime(freq * 1.22, now + .07);
        osc.frequency.setValueAtTime(freq * .92, now + .14);
    }

    osc.start(now);
    osc2.start(now);
    osc.stop(now + duration + .05);
    osc2.stop(now + duration + .05);
}

function buildBackdrop() {
    const haze = document.createElement("div");
    haze.className = "theme-trivia-haze";
    themeBackground.appendChild(haze);

    const beams = document.createElement("div");
    beams.className = "theme-trivia-beams";
    themeBackground.appendChild(beams);

    const pattern = document.createElement("div");
    pattern.className = "theme-trivia-pattern";
    themeBackground.appendChild(pattern);

    const rings = document.createElement("div");
    rings.className = "theme-trivia-rings";
    themeBackground.appendChild(rings);

    const cards = document.createElement("div");
    cards.className = "theme-trivia-answer-cards";
    themeBackground.appendChild(cards);

    ["A", "B", "C", "D"].forEach((label, index) => {
        const chip = document.createElement("span");
        chip.className = "theme-trivia-answer-chip";
        chip.textContent = label;
        chip.style.setProperty("--card-index", String(index));
        cards.appendChild(chip);
    });

    const sparkles = document.createElement("div");
    sparkles.className = "theme-trivia-sparkles";
    themeBackground.appendChild(sparkles);

    for (let i = 0; i < 12; i++) {
        const dot = document.createElement("span");
        dot.className = "theme-trivia-sparkle";
        dot.style.left = `${rand(4, 96)}%`;
        dot.style.top = `${rand(8, 92)}%`;
        dot.style.setProperty("--sparkle-size", `${rand(6, 13)}px`);
        dot.style.setProperty("--sparkle-delay", `${-rand(0, 8)}s`);
        dot.style.setProperty("--sparkle-duration", `${rand(3.8, 6.7)}s`);
        sparkles.appendChild(dot);
    }

    const horizon = document.createElement("div");
    horizon.className = "theme-trivia-horizon";
    themeBackground.appendChild(horizon);
}

function addObject(svg, i, left, top, scale, rotate) {
    const item = document.createElement("div");
    item.className = "theme-trivia-item";
    item.style.left = left;
    item.style.top = top;
    item.style.setProperty("--item-scale", scale);
    item.style.setProperty("--item-rotate", rotate + "deg");
    item.style.setProperty("--item-delay", (-rand(0, 8)).toFixed(2) + "s");
    item.style.setProperty("--item-x", rand(-10,10).toFixed(1) + "px");
    item.style.setProperty("--item-y", rand(-8,8).toFixed(1) + "px");
    item.innerHTML = svg;
    item.setAttribute("aria-hidden", "true");

    if (i % 3 === 0 || i % 5 === 0) {
        item.classList.add("theme-trivia-intro-dancer");
        item.style.setProperty("--dance-delay", `${-rand(0, 0.8)}s`);
        item.style.setProperty("--dance-height", `${rand(10, 18)}px`);
        item.style.setProperty("--dance-duration", `${rand(0.62, 0.86)}s`);
    }

    themeBackground.appendChild(item);
    themeItems.push({ el:item, note:THEME_NOTES[i % THEME_NOTES.length], last:0 });
}

function createObjects() {
    const positions = [
        [8,22,.70,-8],[28,18,.58,5],[72,19,.61,-4],[92,28,.70,8],
        [11,50,.62,4],[88,52,.64,-5],
        [17,78,.65,-6],[38,84,.55,4],[64,81,.60,-3],[85,77,.66,6]
    ];
    positions.forEach((p, i) => {
        addObject(THEME_SVGS[i % THEME_SVGS.length], i, p[0] + "%", p[1] + "%", p[2], p[3]);
    });
}

function startInteraction() {
    const radius = 68;
    themeMouseHandler = (event) => {
        const now = performance.now();
        themeItems.forEach((obj) => {
            const r = obj.el.getBoundingClientRect();
            const cx = r.left + r.width / 2;
            const cy = r.top + r.height / 2;
            if (Math.hypot(cx - event.clientX, cy - event.clientY) <= radius &&
                now - obj.last > 650 &&
                now - lastGlobalSound > 110) {
                obj.last = now;
                lastGlobalSound = now;
                obj.el.classList.remove("theme-trivia-react");
                void obj.el.offsetWidth;
                obj.el.classList.add("theme-trivia-react");

                playTriviaHoverSound();

                setTimeout(
                    () => obj.el.classList.remove("theme-trivia-react"),
                    520
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
    themeStylesheet.href = "/themes/theme-trivia.css";
    themeStylesheet.dataset.theme = "trivia";
    document.head.appendChild(themeStylesheet);

    themeBackground = document.createElement("div");
    themeBackground.id = "trivia-background";
    themeBackground.setAttribute("aria-hidden", "true");
    document.body.appendChild(themeBackground);

    triviaIntroFinished = false;
    playTriviaIntro();

    buildBackdrop();
    createObjects();
    startInteraction();
}

export function unmount() {
    stopTriviaIntro();
    stopTriviaHoverSound();
    triviaIntroFinished = false;

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
