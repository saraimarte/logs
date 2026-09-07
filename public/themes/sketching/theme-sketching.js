/* ============================================================
   SKETCHING THEME
   Large floating sketch figures + hover audio.
   ============================================================ */

let sketchingBackground = null;
let sketchingHoverAudio = null;
let sketchingFadeFrame = null;
let sketchingHoverToken = 0;

let sketchingIntroAudio = null;
let sketchingIntroFinished = true;
let sketchingIntroFallback = null;

const SKETCHING_INTRO_SRC =
    "/sounds/intros/floraphonic-pencil-foley-write-3-162852.mp3";
const SKETCHING_INTRO_VOLUME = 0.31;

function removeSketchingIntroFallback() {
    if (!sketchingIntroFallback) return;
    window.removeEventListener("pointerdown", sketchingIntroFallback);
    window.removeEventListener("keydown", sketchingIntroFallback);
    sketchingIntroFallback = null;
}

function finishSketchingIntro() {
    sketchingIntroFinished = true;
    removeSketchingIntroFallback();

    if (sketchingIntroAudio) {
        try {
            sketchingIntroAudio.pause();
            sketchingIntroAudio.currentTime = 0;
        } catch (_) {}
    }

    sketchingIntroAudio = null;
}

function playSketchingIntro() {
    finishSketchingIntro();
    sketchingIntroFinished = false;

    const audio = new Audio(SKETCHING_INTRO_SRC);
    sketchingIntroAudio = audio;
    audio.preload = "auto";
    audio.volume = SKETCHING_INTRO_VOLUME;

    audio.addEventListener("ended", finishSketchingIntro, { once: true });
    audio.addEventListener("error", finishSketchingIntro, { once: true });
    audio.addEventListener("playing", removeSketchingIntroFallback);

    const attempt = () => {
        if (sketchingIntroAudio !== audio) return;

        const promise = audio.play();
        if (promise && typeof promise.catch === "function") {
            promise.catch(() => {
                if (sketchingIntroFallback || sketchingIntroAudio !== audio) return;

                sketchingIntroFallback = () => {
                    if (sketchingIntroAudio !== audio) return;
                    const retry = audio.play();
                    if (retry && typeof retry.catch === "function") {
                        retry.catch(() => {});
                    }
                };

                window.addEventListener("pointerdown", sketchingIntroFallback);
                window.addEventListener("keydown", sketchingIntroFallback);
            });
        }
    };

    attempt();
}

const SKETCHING_FADE_SECONDS = 2.15;
const SKETCHING_AUDIO_VOLUME = 0.34;

const SKETCHING_SVGS = [
    '/svg/theme-sketching/sketching-01-standing-blazer-figure.svg',
    '/svg/theme-sketching/sketching-02-walking-hat-figure.svg',
    '/svg/theme-sketching/sketching-03-wide-leg-standing-figure.svg',
    '/svg/theme-sketching/sketching-04-seated-blazer-figure.svg',
    '/svg/theme-sketching/sketching-05-standing-coat-figure.svg',
    '/svg/theme-sketching/sketching-06-casual-bag-figure.svg',
    '/svg/theme-sketching/sketching-07-abstract-fashion-figure.svg',
    '/svg/theme-sketching/sketching-08-dress-hat-figure.svg',
    '/svg/theme-sketching/sketching-09-briefcase-figure.svg',
    '/svg/theme-sketching/sketching-10-ballgown-figure.svg',
    '/svg/theme-sketching/sketching-11-one-shoulder-gown-figure.svg',
    '/svg/theme-sketching/sketching-12-hat-gown-figure.svg',
    '/svg/theme-sketching/sketching-13-puff-sleeve-gown-figure.svg',
    '/svg/theme-sketching/sketching-14-ruched-gown-figure.svg',
    '/svg/theme-sketching/sketching-15-hat-mermaid-gown-figure.svg',
    '/svg/theme-sketching/sketching-16-flared-dress-hat-figure.svg',
    '/svg/theme-sketching/sketching-17-v-neck-gown-figure.svg',
    '/svg/theme-sketching/sketching-18-fitted-dress-hat-figure.svg'
];

const SKETCHING_AUDIO = [
    '/sounds/sketching/freesound_community-drawing-6236.mp3',
    '/sounds/sketching/freesound_community-drawing-8705.mp3',
    '/sounds/sketching/freesound_community-pencil-29272.mp3'
];

function sketchRandom(min, max) {
    return Math.random() * (max - min) + min;
}

function cancelSketchingFade() {
    if (sketchingFadeFrame) {
        cancelAnimationFrame(sketchingFadeFrame);
        sketchingFadeFrame = null;
    }
}

function stopSketchingAudioImmediately() {
    cancelSketchingFade();

    if (!sketchingHoverAudio) return;

    try {
        sketchingHoverAudio.pause();
        sketchingHoverAudio.currentTime = 0;
    } catch (_) {}

    sketchingHoverAudio = null;
}

function pickSketchingAudio() {
    return SKETCHING_AUDIO[Math.floor(Math.random() * SKETCHING_AUDIO.length)];
}

function fadeOutSketchingHoverSound() {
    if (!sketchingHoverAudio || sketchingHoverAudio.paused) return;

    cancelSketchingFade();

    const audio = sketchingHoverAudio;
    const startVolume = audio.volume;
    const startTime = performance.now();
    const durationMs = SKETCHING_FADE_SECONDS * 1000;

    const step = (now) => {
        if (sketchingHoverAudio !== audio) return;

        const progress = Math.min(1, (now - startTime) / durationMs);
        audio.volume = Math.max(0, startVolume * (1 - progress));

        if (progress < 1) {
            sketchingFadeFrame = requestAnimationFrame(step);
        } else {
            audio.pause();
            try { audio.currentTime = 0; } catch (_) {}
            if (sketchingHoverAudio === audio) sketchingHoverAudio = null;
            sketchingFadeFrame = null;
        }
    };

    sketchingFadeFrame = requestAnimationFrame(step);
}

function playSketchingHoverSound() {
    if (!sketchingIntroFinished) return;
    const token = ++sketchingHoverToken;
    cancelSketchingFade();
    stopSketchingAudioImmediately();

    const audio = new Audio(pickSketchingAudio());
    sketchingHoverAudio = audio;
    audio.preload = 'auto';
    audio.volume = SKETCHING_AUDIO_VOLUME;

    const begin = () => {
        if (token !== sketchingHoverToken || sketchingHoverAudio !== audio) return;

        try {
            audio.currentTime = 0;
        } catch (_) {}

        const playPromise = audio.play();
        if (playPromise && typeof playPromise.catch === 'function') {
            playPromise.catch(() => {
                // Browsers can block autoplay until the user has interacted normally.
            });
        }
    };

    if (audio.readyState >= 1) begin();
    else audio.addEventListener('loadedmetadata', begin, { once: true });

    audio.addEventListener('ended', () => {
        if (sketchingHoverAudio === audio) sketchingHoverAudio = null;
    }, { once: true });
}

function bindSketchingHover(item) {
    item.addEventListener('mouseenter', () => {
        playSketchingHoverSound();
    });

    item.addEventListener('mouseleave', () => {
        fadeOutSketchingHoverSound();
    });
}

function addSketchFigure(file, config) {
    if (!sketchingBackground) return;

    const item = document.createElement('div');
    item.className = `sketching-theme-item sketching-theme-depth-${config.depth || 1}`;
    item.setAttribute('aria-hidden', 'true');
    item.style.left = `${config.x}%`;
    item.style.top = `${config.y}%`;
    item.style.setProperty('--sketch-scale', config.scale ?? 1);
    item.style.setProperty('--sketch-rotate', `${config.rotate ?? 0}deg`);
    item.style.setProperty('--sketch-duration', `${config.duration ?? sketchRandom(9, 13)}s`);
    item.style.setProperty('--sketch-delay', `${config.delay ?? -sketchRandom(0, 10)}s`);
    item.style.setProperty('--sketch-drift-x', `${config.driftX ?? sketchRandom(-6, 6)}px`);
    item.style.setProperty('--sketch-drift-y', `${config.driftY ?? sketchRandom(-7, 7)}px`);

    const img = document.createElement('img');
    img.className = 'sketching-theme-svg';
    img.src = file;
    img.alt = '';
    img.draggable = false;
    img.setAttribute('aria-hidden', 'true');

    item.appendChild(img);
    sketchingBackground.appendChild(item);
    bindSketchingHover(item);
}

function createSketchFigures() {
    if (!sketchingBackground) return;

    // Keep the center and title regions readable. The large figures hug the sides.
    const layout = [
        { x: 6,  y: 24, scale: 1.02, rotate: -9 },
        { x: 94, y: 24, scale: 1.02, rotate: 9 },
        { x: 8,  y: 34, scale: 1.00, rotate: -7 },
        { x: 92, y: 34, scale: 0.99, rotate: 7 },
        { x: 6,  y: 45, scale: 1.04, rotate: -11 },
        { x: 94, y: 45, scale: 1.04, rotate: 11 },
        { x: 9,  y: 56, scale: 0.98, rotate: -6 },
        { x: 91, y: 56, scale: 0.98, rotate: 6 },
        { x: 5,  y: 66, scale: 1.06, rotate: -10 },
        { x: 95, y: 66, scale: 1.06, rotate: 10 },
        { x: 8,  y: 76, scale: 1.00, rotate: -8 },
        { x: 92, y: 76, scale: 1.00, rotate: 8 },
        { x: 6,  y: 85, scale: 1.08, rotate: -12 },
        { x: 94, y: 85, scale: 1.08, rotate: 12 },
        { x: 9,  y: 93, scale: 1.00, rotate: -9 },
        { x: 91, y: 93, scale: 1.00, rotate: 9 },
        { x: 4,  y: 98, scale: 1.08, rotate: -7 },
        { x: 96, y: 98, scale: 1.08, rotate: 7 }
    ];

    SKETCHING_SVGS.forEach((file, index) => {
        const base = layout[index];
        addSketchFigure(file, {
            ...base,
            x: base.x + sketchRandom(-0.7, 0.7),
            y: base.y + sketchRandom(-0.7, 0.7),
            duration: sketchRandom(9.2, 13.4),
            delay: -sketchRandom(0, 12),
            driftX: sketchRandom(-4.5, 4.5),
            driftY: sketchRandom(-5.2, 5.2)
        });
    });
}

function createSwatches() {
    if (!sketchingBackground) return;

    const swatches = [
        { left: 18, top: 18, width: 120, height: 78, rotate: -18, bg: 'rgba(220, 210, 196, 0.45)' },
        { left: 73, top: 17, width: 126, height: 82, rotate: 15, bg: 'rgba(234, 225, 214, 0.42)' },
        { left: 24, top: 48, width: 138, height: 88, rotate: 12, bg: 'rgba(229, 220, 209, 0.30)' },
        { left: 70, top: 50, width: 134, height: 86, rotate: -14, bg: 'rgba(238, 228, 217, 0.28)' },
        { left: 30, top: 82, width: 150, height: 94, rotate: -8, bg: 'rgba(223, 214, 203, 0.28)' },
        { left: 64, top: 83, width: 148, height: 96, rotate: 11, bg: 'rgba(239, 231, 221, 0.26)' }
    ];

    swatches.forEach((config) => {
        const swatch = document.createElement('span');
        swatch.className = 'sketching-theme-swatch';
        swatch.setAttribute('aria-hidden', 'true');
        swatch.style.left = `${config.left}%`;
        swatch.style.top = `${config.top}%`;
        swatch.style.setProperty('--swatch-width', `${config.width}px`);
        swatch.style.setProperty('--swatch-height', `${config.height}px`);
        swatch.style.setProperty('--swatch-rotate', `${config.rotate}deg`);
        swatch.style.setProperty('--swatch-bg', config.bg);
        sketchingBackground.appendChild(swatch);
    });
}

function createSketchStrokes() {
    if (!sketchingBackground) return;

    const positions = [
        [18, 27], [31, 39], [62, 28], [72, 38], [24, 58], [63, 60], [28, 73], [71, 74], [47, 88]
    ];

    positions.forEach(([x, y], index) => {
        const stroke = document.createElement('span');
        stroke.className = 'sketching-theme-stroke';
        stroke.setAttribute('aria-hidden', 'true');
        stroke.style.left = `${x}%`;
        stroke.style.top = `${y}%`;
        stroke.style.setProperty('--stroke-width', `${sketchRandom(72, 138)}px`);
        stroke.style.setProperty('--stroke-height', `${sketchRandom(20, 42)}px`);
        stroke.style.setProperty('--stroke-rotate', `${sketchRandom(-30, 30)}deg`);
        stroke.style.setProperty('--stroke-duration', `${sketchRandom(5.5, 9)}s`);
        stroke.style.setProperty('--stroke-delay', `${-(index * 0.4)}s`);
        stroke.style.setProperty('--stroke-drift-x', `${sketchRandom(-6, 6)}px`);
        stroke.style.setProperty('--stroke-drift-y', `${sketchRandom(-5, 5)}px`);
        sketchingBackground.appendChild(stroke);
    });
}

function createSketchSpecks() {
    if (!sketchingBackground) return;

    for (let i = 0; i < 34; i++) {
        const speck = document.createElement('span');
        speck.className = 'sketching-theme-speck';
        speck.setAttribute('aria-hidden', 'true');
        speck.style.left = `${sketchRandom(14, 86)}%`;
        speck.style.top = `${sketchRandom(18, 95)}%`;
        speck.style.setProperty('--speck-size', `${sketchRandom(2, 4.4)}px`);
        speck.style.setProperty('--speck-duration', `${sketchRandom(4.5, 8.5)}s`);
        speck.style.setProperty('--speck-delay', `${-sketchRandom(0, 8)}s`);
        sketchingBackground.appendChild(speck);
    }
}

function createRulersAndTape() {
    if (!sketchingBackground) return;

    const leftRuler = document.createElement('span');
    leftRuler.className = 'sketching-theme-ruler left';
    leftRuler.setAttribute('aria-hidden', 'true');
    sketchingBackground.appendChild(leftRuler);

    const rightRuler = document.createElement('span');
    rightRuler.className = 'sketching-theme-ruler right';
    rightRuler.setAttribute('aria-hidden', 'true');
    sketchingBackground.appendChild(rightRuler);

    [
        { left: 17, top: 7, width: 44, height: 16, rotate: -14 },
        { left: 75, top: 8, width: 48, height: 16, rotate: 12 },
        { left: 28, top: 93, width: 54, height: 16, rotate: -8 },
        { left: 61, top: 92, width: 54, height: 16, rotate: 8 }
    ].forEach((config) => {
        const tape = document.createElement('span');
        tape.className = 'sketching-theme-tape';
        tape.setAttribute('aria-hidden', 'true');
        tape.style.left = `${config.left}%`;
        tape.style.top = `${config.top}%`;
        tape.style.setProperty('--tape-width', `${config.width}px`);
        tape.style.setProperty('--tape-height', `${config.height}px`);
        tape.style.setProperty('--tape-rotate', `${config.rotate}deg`);
        sketchingBackground.appendChild(tape);
    });
}

export function mount() {
    if (sketchingBackground) return;

    sketchingBackground = document.createElement('div');
    sketchingBackground.id = 'sketching-theme-background';
    sketchingBackground.setAttribute('aria-hidden', 'true');
    document.body.appendChild(sketchingBackground);

    createSwatches();
    createSketchStrokes();
    createSketchSpecks();
    createRulersAndTape();
    createSketchFigures();
    playSketchingIntro();
}

export function unmount() {
    finishSketchingIntro();
    sketchingHoverToken++;
    stopSketchingAudioImmediately();

    if (sketchingBackground) {
        sketchingBackground.remove();
        sketchingBackground = null;
    }
}
