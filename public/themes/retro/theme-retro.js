/* ============================================================
   RETRO ARCADE
   Decorative-only theme module.

   Uses /public/svg/theme-retro/pixel_object_01.svg through
   /public/svg/theme-retro/pixel_object_20.svg.

   IMPORTANT:
   - Does not alter application structure or layout.
   - Does not touch cursor logic or cursor picker elements.
   - Does not touch companion positioning or movement logic.
   - Does not change tabs, views, buttons, or modal behavior.
   ============================================================ */

let retroBackground = null;
let retroStylesheet = null;
let retroAudioContext = null;
let retroLastSoundAt = 0;

let retroIntroAudio = null;
let retroIntroFallbackHandler = null;
let retroIntroFinished = false;

const RETRO_INTRO_SRC =
    "/sounds/intros/slimeyfox-arcade-80s-era-481352.mp3";
const RETRO_INTRO_END = 39;
const RETRO_INTRO_FADE_START = 34;
const RETRO_INTRO_VOLUME = 0.30;

const RETRO_SOUND_COOLDOWN = 90;

function setRetroIntroDancing(isPlaying) {
    if (!retroBackground) return;

    retroBackground.classList.toggle(
        "retro-intro-playing",
        Boolean(isPlaying)
    );
}

function stopRetroIntro() {
    if (retroIntroFallbackHandler) {
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
                retroIntroFallbackHandler
            );
        });

        retroIntroFallbackHandler = null;
    }

    setRetroIntroDancing(false);

    if (!retroIntroAudio) return;

    try {
        retroIntroAudio.pause();
        retroIntroAudio.currentTime = 0;
        retroIntroAudio.volume = RETRO_INTRO_VOLUME;
    } catch (_) {}

    retroIntroAudio = null;
}

function playRetroIntro() {
    stopRetroIntro();
    retroIntroFinished = false;

    const audio = new Audio();
    retroIntroAudio = audio;

    audio.src = RETRO_INTRO_SRC;
    audio.preload = "auto";
    audio.autoplay = true;
    audio.playsInline = true;
    audio.loop = false;
    audio.volume = RETRO_INTRO_VOLUME;
    audio.load();

    const finishIntro = () => {
        if (retroIntroAudio !== audio) return;

        setRetroIntroDancing(false);

        try {
            audio.pause();
            audio.currentTime = RETRO_INTRO_END;
            audio.volume = 0;
        } catch (_) {}

        retroIntroFinished = true;
    };

    const updateFade = () => {
        if (retroIntroAudio !== audio) return;

        const t = audio.currentTime || 0;

        if (t >= RETRO_INTRO_END) {
            finishIntro();
            return;
        }

        if (t >= RETRO_INTRO_FADE_START) {
            const remaining =
                Math.max(0, RETRO_INTRO_END - t);

            const fadeLength =
                RETRO_INTRO_END -
                RETRO_INTRO_FADE_START;

            audio.volume =
                RETRO_INTRO_VOLUME *
                (remaining / fadeLength);
        }
    };

    audio.addEventListener("timeupdate", updateFade);

    audio.addEventListener(
        "playing",
        () => {
            if (retroIntroAudio === audio) {
                setRetroIntroDancing(true);
            }
        }
    );

    audio.addEventListener(
        "pause",
        () => {
            if (retroIntroAudio === audio) {
                setRetroIntroDancing(false);
            }
        }
    );

    audio.addEventListener(
        "error",
        () => {
            /*
             * If the intro file cannot load, do not permanently lock
             * the normal SVG hover sounds.
             */
            setRetroIntroDancing(false);
            retroIntroFinished = true;
        },
        { once: true }
    );

    const tryPlay = () => {
        if (retroIntroAudio !== audio) return;

        const playPromise = audio.play();

        if (
            playPromise &&
            typeof playPromise.catch === "function"
        ) {
            playPromise.catch(() => {
                if (retroIntroFallbackHandler) return;

                retroIntroFallbackHandler = () => {
                    const handler =
                        retroIntroFallbackHandler;

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

                    retroIntroFallbackHandler = null;

                    if (retroIntroAudio !== audio) return;

                    audio.volume = RETRO_INTRO_VOLUME;

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
                        retroIntroFallbackHandler,
                        { once: true }
                    );
                });
            });
        }
    };

    tryPlay();
}

function getRetroAudioContext() {
    if (!retroAudioContext) {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (!AudioContextClass) return null;
        retroAudioContext = new AudioContextClass();
    }
    return retroAudioContext;
}

function playRetroHoverSound(soundIndex = 0) {
    // Hover animations still work, but their sounds wait for the intro.
    if (!retroIntroFinished) return;

    const now = performance.now();
    if (now - retroLastSoundAt < RETRO_SOUND_COOLDOWN) return;
    retroLastSoundAt = now;

    const ctx = getRetroAudioContext();
    if (!ctx) return;
    if (ctx.state === 'suspended') ctx.resume().catch(() => {});

    const start = ctx.currentTime;
    const master = ctx.createGain();
    master.gain.setValueAtTime(0.0001, start);
    master.gain.exponentialRampToValueAtTime(0.16, start + 0.008);
    master.gain.exponentialRampToValueAtTime(0.0001, start + 0.20);
    master.connect(ctx.destination);

    const patterns = [
        [440, 660],
        [523.25, 784.88],
        [659.25, 987.77],
        [392, 587.33, 783.99],
        [783.99, 659.25],
        [329.63, 493.88, 659.25]
    ];
    const pattern = patterns[soundIndex % patterns.length];

    pattern.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const t = start + i * 0.045;
        osc.type = i % 2 === 0 ? 'square' : 'triangle';
        osc.frequency.setValueAtTime(freq, t);
        gain.gain.setValueAtTime(0.0001, t);
        gain.gain.exponentialRampToValueAtTime(0.72, t + 0.005);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.06);
        osc.connect(gain);
        gain.connect(master);
        osc.start(t);
        osc.stop(t + 0.07);
    });
}

const RETRO_OBJECTS = Array.from({ length: 20 }, (_, index) => {
    const number = String(index + 1).padStart(2, '0');
    return `/svg/theme-retro/pixel_object_${number}.svg`;
});

function retroRandom(min, max) {
    return Math.random() * (max - min) + min;
}

function retroShuffle(items) {
    const copy = [...items];
    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
}

function addRetroObject({ file, left, top, size, rotate, duration, delay, driftX, driftY, depth, soundIndex }) {
    if (!retroBackground || !file) return;

    const wrapper = document.createElement('div');
    wrapper.className = `retro-arcade-item retro-arcade-depth-${depth}`;
    wrapper.setAttribute('aria-hidden', 'true');
    wrapper.dataset.retroSound = String(soundIndex ?? 0);

    /*
     * A spread-out subset of the game characters dances while the
     * intro song is actually playing.
     */
    if ((soundIndex ?? 0) % 3 === 0 || (soundIndex ?? 0) % 7 === 0) {
        wrapper.classList.add("retro-intro-dancer");
        wrapper.style.setProperty(
            "--retro-dance-delay",
            `${-retroRandom(0, 0.9)}s`
        );
        wrapper.style.setProperty(
            "--retro-dance-height",
            `${retroRandom(10, 19)}px`
        );
        wrapper.style.setProperty(
            "--retro-dance-duration",
            `${retroRandom(0.62, 0.88)}s`
        );
    }

    wrapper.style.left = left;
    wrapper.style.top = top;
    wrapper.style.setProperty('--retro-size', `${size}px`);
    wrapper.style.setProperty('--retro-rotate', `${rotate}deg`);
    wrapper.style.setProperty('--retro-duration', `${duration}s`);
    wrapper.style.setProperty('--retro-delay', `${delay}s`);
    wrapper.style.setProperty('--retro-drift-x', `${driftX}px`);
    wrapper.style.setProperty('--retro-drift-y', `${driftY}px`);

    const img = document.createElement('img');
    img.className = 'retro-arcade-svg';
    img.src = file;
    img.alt = '';
    img.draggable = false;
    img.setAttribute('aria-hidden', 'true');

    wrapper.appendChild(img);

    wrapper.addEventListener('mouseenter', () => {
        wrapper.classList.add('retro-arcade-item-hovered');
        playRetroHoverSound(Number(wrapper.dataset.retroSound || 0));
    });
    wrapper.addEventListener('mouseleave', () => {
        wrapper.classList.remove('retro-arcade-item-hovered');
    });

    retroBackground.appendChild(wrapper);
}

function createRetroObjects() {
    if (!retroBackground) return;

    /*
     * Fixed layout zones keep the app title/header readable and avoid
     * clustering too many SVGs behind controls. Only decorative nodes are
     * positioned here. Application elements are never moved.
     */
    const positions = [
        { x: 7,  y: 20 }, { x: 24, y: 25 }, { x: 47, y: 20 }, { x: 70, y: 25 }, { x: 92, y: 20 },
        { x: 10, y: 43 }, { x: 31, y: 48 }, { x: 55, y: 41 }, { x: 80, y: 48 }, { x: 95, y: 43 },
        { x: 4,  y: 68 }, { x: 23, y: 63 }, { x: 46, y: 70 }, { x: 68, y: 63 }, { x: 90, y: 68 },
        { x: 13, y: 88 }, { x: 35, y: 84 }, { x: 58, y: 90 }, { x: 78, y: 84 }, { x: 95, y: 90 }
    ];

    const shuffled = retroShuffle(RETRO_OBJECTS);

    positions.forEach((position, index) => {
        addRetroObject({
            file: shuffled[index],
            left: `${position.x + retroRandom(-1.8, 1.8)}%`,
            top: `${position.y + retroRandom(-1.4, 1.4)}%`,
            size: retroRandom(62, 96),
            rotate: retroRandom(-5, 5),
            duration: retroRandom(5.5, 9),
            delay: -retroRandom(0, 8),
            driftX: retroRandom(-5, 5),
            driftY: retroRandom(-5, 5),
            depth: index % 3 === 0 ? 2 : 1,
            soundIndex: index
        });
    });
}

function createRetroStars() {
    if (!retroBackground) return;

    for (let i = 0; i < 28; i++) {
        const star = document.createElement('span');
        star.className = 'retro-arcade-star';
        star.setAttribute('aria-hidden', 'true');
        star.style.left = `${retroRandom(2, 98)}%`;
        star.style.top = `${retroRandom(8, 96)}%`;
        star.style.setProperty('--retro-star-delay', `${-retroRandom(0, 6)}s`);
        star.style.setProperty('--retro-star-duration', `${retroRandom(2.8, 5.2)}s`);
        retroBackground.appendChild(star);
    }
}

function createRetroGridLines() {
    if (!retroBackground) return;

    const grid = document.createElement('div');
    grid.className = 'retro-arcade-grid';
    grid.setAttribute('aria-hidden', 'true');
    retroBackground.appendChild(grid);
}

export function mount() {
    if (retroBackground) return;

    retroStylesheet = document.createElement('link');
    retroStylesheet.rel = 'stylesheet';
    retroStylesheet.href = '/themes/theme-retro.css';
    retroStylesheet.dataset.theme = 'retro';
    document.head.appendChild(retroStylesheet);

    retroBackground = document.createElement('div');
    retroBackground.id = 'retro-arcade-background';
    retroBackground.setAttribute('aria-hidden', 'true');
    document.body.appendChild(retroBackground);

    retroIntroFinished = false;
    playRetroIntro();

    createRetroGridLines();
    createRetroStars();
    createRetroObjects();
}

export function unmount() {
    stopRetroIntro();
    retroIntroFinished = false;

    if (retroBackground) {
        retroBackground.remove();
        retroBackground = null;
    }

    if (retroStylesheet) {
        retroStylesheet.remove();
        retroStylesheet = null;
    }

    if (retroAudioContext) {
        retroAudioContext.close().catch(() => {});
        retroAudioContext = null;
    }
    retroLastSoundAt = 0;
}
