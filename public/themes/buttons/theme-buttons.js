/* ============================================================
   BUTTONS THEME
   Large floating button SVGs + hover button-press sound.
   ============================================================ */

let buttonsThemeBackground = null;
let buttonsHoverAudio = null;
let buttonsFadeFrame = null;
let buttonsHoverToken = 0;

const BUTTONS_AUDIO = '/sounds/buttons/dragon-studio-button-press-382713.mp3';
const BUTTONS_AUDIO_VOLUME = 0.33;
const BUTTONS_FADE_SECONDS = 1.9;

const BUTTONS_SVGS = [
    '/svg/theme-buttons/buttons-01-brown-striped.svg',
    '/svg/theme-buttons/buttons-02-pink-polka-dot.svg',
    '/svg/theme-buttons/buttons-03-pink-yellow-polka-dot.svg',
    '/svg/theme-buttons/buttons-04-cream-bunny.svg',
    '/svg/theme-buttons/buttons-05-yellow-star.svg',
    '/svg/theme-buttons/buttons-06-dark-brown-stitched.svg',
    '/svg/theme-buttons/buttons-07-pink-flower.svg',
    '/svg/theme-buttons/buttons-08-white-round.svg',
    '/svg/theme-buttons/buttons-09-wood-stitched.svg',
    '/svg/theme-buttons/buttons-10-wood-flower-stitched.svg',
    '/svg/theme-buttons/buttons-11-pink-heart.svg',
    '/svg/theme-buttons/buttons-12-pink-polka-dot-stitched.svg',
    '/svg/theme-buttons/buttons-13-cream-heart.svg',
    '/svg/theme-buttons/buttons-14-brown-polka-dot.svg',
    '/svg/theme-buttons/buttons-15-pink-yellow-polka-dot.svg',
    '/svg/theme-buttons/buttons-16-pink-plaid.svg',
    '/svg/theme-buttons/buttons-17-pink-white-flower.svg',
    '/svg/theme-buttons/buttons-18-pink-rose.svg',
    '/svg/theme-buttons/buttons-19-cream-round.svg',
    '/svg/theme-buttons/buttons-20-pink-white-flower.svg',
    '/svg/theme-buttons/buttons-21-tan-round.svg',
    '/svg/theme-buttons/buttons-22-pink-plaid.svg',
    '/svg/theme-buttons/buttons-23-dark-brown-round.svg',
    '/svg/theme-buttons/buttons-24-pink-star.svg',
    '/svg/theme-buttons/buttons-25-pink-round.svg',
    '/svg/theme-buttons/buttons-26-wood-pink-polka-dot.svg',
    '/svg/theme-buttons/buttons-27-cream-star.svg'
];

function buttonsRandom(min, max) {
    return Math.random() * (max - min) + min;
}

function cancelButtonsFade() {
    if (buttonsFadeFrame) {
        cancelAnimationFrame(buttonsFadeFrame);
        buttonsFadeFrame = null;
    }
}

function stopButtonsAudioImmediately() {
    cancelButtonsFade();

    if (!buttonsHoverAudio) return;

    try {
        buttonsHoverAudio.pause();
        buttonsHoverAudio.currentTime = 0;
    } catch (_) {}

    buttonsHoverAudio = null;
}

function fadeOutButtonsHoverSound() {
    if (!buttonsHoverAudio || buttonsHoverAudio.paused) return;

    cancelButtonsFade();

    const audio = buttonsHoverAudio;
    const startVolume = audio.volume;
    const startTime = performance.now();
    const durationMs = BUTTONS_FADE_SECONDS * 1000;

    const step = (now) => {
        if (buttonsHoverAudio !== audio) return;

        const progress = Math.min(1, (now - startTime) / durationMs);
        audio.volume = Math.max(0, startVolume * (1 - progress));

        if (progress < 1) {
            buttonsFadeFrame = requestAnimationFrame(step);
        } else {
            audio.pause();
            try { audio.currentTime = 0; } catch (_) {}
            if (buttonsHoverAudio === audio) buttonsHoverAudio = null;
            buttonsFadeFrame = null;
        }
    };

    buttonsFadeFrame = requestAnimationFrame(step);
}

function playButtonsHoverSound() {
    const token = ++buttonsHoverToken;
    cancelButtonsFade();
    stopButtonsAudioImmediately();

    const audio = new Audio(BUTTONS_AUDIO);
    buttonsHoverAudio = audio;
    audio.preload = 'auto';
    audio.volume = BUTTONS_AUDIO_VOLUME;

    const begin = () => {
        if (token !== buttonsHoverToken || buttonsHoverAudio !== audio) return;

        try {
            audio.currentTime = 0;
        } catch (_) {}

        const playPromise = audio.play();
        if (playPromise && typeof playPromise.catch === 'function') {
            playPromise.catch(() => {
                // Browser autoplay restrictions can block hover-triggered sound until a normal user interaction occurs.
            });
        }
    };

    if (audio.readyState >= 1) begin();
    else audio.addEventListener('loadedmetadata', begin, { once: true });

    audio.addEventListener('ended', () => {
        if (buttonsHoverAudio === audio) buttonsHoverAudio = null;
    }, { once: true });
}

function bindButtonsHover(item) {
    item.addEventListener('mouseenter', () => {
        playButtonsHoverSound();
    });

    item.addEventListener('mouseleave', () => {
        fadeOutButtonsHoverSound();
    });
}

function addButtonFigure(file, config) {
    if (!buttonsThemeBackground) return;

    const item = document.createElement('div');
    item.className = 'buttons-theme-item';
    item.setAttribute('aria-hidden', 'true');
    item.style.left = `${config.x}%`;
    item.style.top = `${config.y}%`;
    item.style.setProperty('--button-scale', config.scale ?? 1);
    item.style.setProperty('--button-rotate', `${config.rotate ?? 0}deg`);
    item.style.setProperty('--button-duration', `${config.duration ?? buttonsRandom(7.5, 12)}s`);
    item.style.setProperty('--button-delay', `${config.delay ?? -buttonsRandom(0, 10)}s`);
    item.style.setProperty('--button-drift-x', `${config.driftX ?? buttonsRandom(-8, 8)}px`);
    item.style.setProperty('--button-drift-y', `${config.driftY ?? buttonsRandom(-8, 8)}px`);

    const img = document.createElement('img');
    img.className = 'buttons-theme-svg';
    img.src = file;
    img.alt = '';
    img.draggable = false;
    img.setAttribute('aria-hidden', 'true');

    item.appendChild(img);
    buttonsThemeBackground.appendChild(item);
    bindButtonsHover(item);
}

function createButtonFigures() {
    if (!buttonsThemeBackground) return;

    // Keep the middle content mostly clear while making the background feel busy.
    const layout = [
        { x: 6,  y: 18, scale: 1.05, rotate: -12 },
        { x: 94, y: 17, scale: 1.04, rotate: 13 },
        { x: 17, y: 10, scale: 0.98, rotate: -6 },
        { x: 83, y: 10, scale: 0.98, rotate: 6 },
        { x: 4,  y: 31, scale: 1.12, rotate: -15 },
        { x: 96, y: 30, scale: 1.10, rotate: 15 },
        { x: 13, y: 25, scale: 0.92, rotate: -9 },
        { x: 87, y: 25, scale: 0.92, rotate: 9 },
        { x: 8,  y: 43, scale: 1.06, rotate: -11 },
        { x: 92, y: 43, scale: 1.06, rotate: 11 },
        { x: 19, y: 38, scale: 0.90, rotate: -5 },
        { x: 81, y: 39, scale: 0.90, rotate: 5 },
        { x: 5,  y: 56, scale: 1.14, rotate: -14 },
        { x: 95, y: 56, scale: 1.14, rotate: 14 },
        { x: 14, y: 52, scale: 0.92, rotate: -7 },
        { x: 86, y: 52, scale: 0.92, rotate: 7 },
        { x: 8,  y: 68, scale: 1.08, rotate: -10 },
        { x: 92, y: 68, scale: 1.08, rotate: 10 },
        { x: 19, y: 64, scale: 0.94, rotate: -6 },
        { x: 81, y: 64, scale: 0.94, rotate: 6 },
        { x: 4,  y: 80, scale: 1.12, rotate: -13 },
        { x: 96, y: 80, scale: 1.12, rotate: 13 },
        { x: 15, y: 76, scale: 0.96, rotate: -8 },
        { x: 85, y: 76, scale: 0.96, rotate: 8 },
        { x: 10, y: 92, scale: 1.02, rotate: -10 },
        { x: 90, y: 92, scale: 1.02, rotate: 10 },
        { x: 50, y: 97, scale: 0.98, rotate: 0 }
    ];

    BUTTONS_SVGS.forEach((file, index) => {
        const base = layout[index];
        addButtonFigure(file, {
            ...base,
            x: base.x + buttonsRandom(-0.8, 0.8),
            y: base.y + buttonsRandom(-0.8, 0.8),
            duration: buttonsRandom(8.4, 12.6),
            delay: -buttonsRandom(0, 10),
            driftX: buttonsRandom(-6, 6),
            driftY: buttonsRandom(-6, 6)
        });
    });
}

function createThreadLoops() {
    if (!buttonsThemeBackground) return;

    const threads = [
        { left: 14, top: 14, width: 20, height: 10, rotate: -12, color: 'rgba(177, 108, 134, 0.24)' },
        { left: 62, top: 16, width: 25, height: 12, rotate: 10, color: 'rgba(202, 146, 91, 0.24)' },
        { left: 24, top: 35, width: 20, height: 10, rotate: 18, color: 'rgba(144, 103, 121, 0.22)' },
        { left: 56, top: 39, width: 24, height: 11, rotate: -16, color: 'rgba(176, 122, 80, 0.22)' },
        { left: 25, top: 59, width: 24, height: 12, rotate: -8, color: 'rgba(177, 108, 134, 0.20)' },
        { left: 57, top: 65, width: 23, height: 11, rotate: 12, color: 'rgba(202, 146, 91, 0.20)' },
        { left: 27, top: 84, width: 22, height: 11, rotate: 11, color: 'rgba(144, 103, 121, 0.18)' },
        { left: 54, top: 86, width: 22, height: 10, rotate: -9, color: 'rgba(176, 122, 80, 0.18)' }
    ];

    threads.forEach((config, index) => {
        const el = document.createElement('span');
        el.className = 'buttons-theme-thread';
        el.setAttribute('aria-hidden', 'true');
        el.style.left = `${config.left}%`;
        el.style.top = `${config.top}%`;
        el.style.setProperty('--thread-width', `${config.width}vw`);
        el.style.setProperty('--thread-height', `${config.height}vw`);
        el.style.setProperty('--thread-rotate', `${config.rotate}deg`);
        el.style.setProperty('--thread-color', config.color);
        el.style.setProperty('--thread-duration', `${buttonsRandom(5.6, 8.8)}s`);
        el.style.setProperty('--thread-delay', `${-(index * 0.4)}s`);
        el.style.setProperty('--thread-drift-x', `${buttonsRandom(-7, 7)}px`);
        el.style.setProperty('--thread-drift-y', `${buttonsRandom(-5, 5)}px`);
        buttonsThemeBackground.appendChild(el);
    });
}

function createFabricPatches() {
    if (!buttonsThemeBackground) return;

    const patches = [
        [30, 16, 80, -10, 'linear-gradient(135deg, rgba(255,226,234,.58), rgba(255,243,205,.22))'],
        [69, 20, 86, 9, 'linear-gradient(135deg, rgba(255,241,214,.52), rgba(255,224,232,.20))'],
        [34, 47, 92, 15, 'repeating-linear-gradient(45deg, rgba(255,222,233,.48) 0 6px, rgba(255,241,245,.18) 6px 12px)'],
        [67, 52, 88, -12, 'repeating-linear-gradient(0deg, rgba(249,232,207,.46) 0 8px, rgba(255,248,236,.16) 8px 16px)'],
        [38, 78, 96, 8, 'linear-gradient(135deg, rgba(255,227,236,.38), rgba(250,236,213,.18))'],
        [61, 83, 92, -8, 'repeating-linear-gradient(90deg, rgba(247,229,206,.42) 0 8px, rgba(255,246,232,.14) 8px 16px)']
    ];

    patches.forEach(([x, y, size, rotate, bg]) => {
        const patch = document.createElement('span');
        patch.className = 'buttons-theme-patch';
        patch.setAttribute('aria-hidden', 'true');
        patch.style.left = `${x}%`;
        patch.style.top = `${y}%`;
        patch.style.setProperty('--patch-size', `${size}px`);
        patch.style.setProperty('--patch-rotate', `${rotate}deg`);
        patch.style.setProperty('--patch-bg', bg);
        buttonsThemeBackground.appendChild(patch);
    });
}

function createScatterDots() {
    if (!buttonsThemeBackground) return;

    const colors = [
        'rgba(223, 156, 183, 0.46)',
        'rgba(216, 177, 110, 0.44)',
        'rgba(247, 214, 175, 0.42)',
        'rgba(205, 150, 168, 0.40)'
    ];

    for (let i = 0; i < 54; i++) {
        const dot = document.createElement('span');
        dot.className = 'buttons-theme-scatter-dot';
        dot.setAttribute('aria-hidden', 'true');
        dot.style.left = `${buttonsRandom(3, 97)}%`;
        dot.style.top = `${buttonsRandom(6, 97)}%`;
        dot.style.setProperty('--dot-size', `${buttonsRandom(4, 10)}px`);
        dot.style.setProperty('--dot-bg', colors[i % colors.length]);
        dot.style.setProperty('--dot-duration', `${buttonsRandom(4.2, 7.4)}s`);
        dot.style.setProperty('--dot-delay', `${-buttonsRandom(0, 8)}s`);
        buttonsThemeBackground.appendChild(dot);
    }
}

function createSparklesAndRibbons() {
    if (!buttonsThemeBackground) return;

    const stars = ['✦', '✧', '•'];
    for (let i = 0; i < 18; i++) {
        const sp = document.createElement('span');
        sp.className = 'buttons-theme-sparkle';
        sp.textContent = stars[i % stars.length];
        sp.setAttribute('aria-hidden', 'true');
        sp.style.left = `${buttonsRandom(9, 91)}%`;
        sp.style.top = `${buttonsRandom(8, 95)}%`;
        sp.style.setProperty('--sparkle-size', `${buttonsRandom(14, 28)}px`);
        sp.style.setProperty('--sparkle-duration', `${buttonsRandom(4.6, 8.2)}s`);
        sp.style.setProperty('--sparkle-delay', `${-buttonsRandom(0, 8)}s`);
        sp.style.setProperty('--sparkle-drift-x', `${buttonsRandom(-6, 6)}px`);
        sp.style.setProperty('--sparkle-drift-y', `${buttonsRandom(-6, 6)}px`);
        buttonsThemeBackground.appendChild(sp);
    }

    [
        { left: 20, top: 28, width: 16, rotate: -8 },
        { left: 64, top: 33, width: 18, rotate: 6 },
        { left: 26, top: 71, width: 18, rotate: 7 },
        { left: 60, top: 76, width: 18, rotate: -6 }
    ].forEach((config) => {
        const ribbon = document.createElement('span');
        ribbon.className = 'buttons-theme-ribbon';
        ribbon.setAttribute('aria-hidden', 'true');
        ribbon.style.left = `${config.left}%`;
        ribbon.style.top = `${config.top}%`;
        ribbon.style.setProperty('--ribbon-width', `${config.width}vw`);
        ribbon.style.setProperty('--ribbon-rotate', `${config.rotate}deg`);
        buttonsThemeBackground.appendChild(ribbon);
    });
}

export function mount() {
    if (buttonsThemeBackground) return;

    buttonsThemeBackground = document.createElement('div');
    buttonsThemeBackground.id = 'buttons-theme-background';
    buttonsThemeBackground.setAttribute('aria-hidden', 'true');
    document.body.appendChild(buttonsThemeBackground);

    createFabricPatches();
    createThreadLoops();
    createScatterDots();
    createSparklesAndRibbons();
    createButtonFigures();
}

export function unmount() {
    buttonsHoverToken++;
    stopButtonsAudioImmediately();

    if (buttonsThemeBackground) {
        buttonsThemeBackground.remove();
        buttonsThemeBackground = null;
    }
}
