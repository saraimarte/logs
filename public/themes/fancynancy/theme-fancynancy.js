/* ============================================================
   FANCY NANCY THEME
   Decorative-only animated background using supplied SVG assets.

   IMPORTANT:
   - Uses assets in /public/svg/theme-fancynancy.
   - Does not alter cursor, companion, tab, selector, or app logic.
   - Decorative layer remains behind the application UI.
   ============================================================ */

let fancyNancyBackground = null;
let fancyNancyStylesheet = null;
let fancyNancyIntroAudio = null;
let fancyNancyIntroFallbackHandler = null;

const FANCY_NANCY_INTRO_SRC =
    '/sounds/intros/starostin-whimsical-awkward-comic-music-261166.mp3';
const FANCY_NANCY_INTRO_END = 35;
const FANCY_NANCY_INTRO_FADE_START = 30;
const FANCY_NANCY_INTRO_VOLUME = 0.28;

function stopFancyNancyIntro() {
    if (fancyNancyIntroFallbackHandler) {
        document.removeEventListener(
            'pointerdown',
            fancyNancyIntroFallbackHandler
        );
        document.removeEventListener(
            'keydown',
            fancyNancyIntroFallbackHandler
        );
        fancyNancyIntroFallbackHandler = null;
    }

    if (!fancyNancyIntroAudio) return;

    try {
        fancyNancyIntroAudio.pause();
        fancyNancyIntroAudio.currentTime = 0;
        fancyNancyIntroAudio.volume = FANCY_NANCY_INTRO_VOLUME;
    } catch (_) {}

    fancyNancyIntroAudio = null;
}

function playFancyNancyIntro() {
    stopFancyNancyIntro();

    const audio = new Audio(FANCY_NANCY_INTRO_SRC);
    fancyNancyIntroAudio = audio;

    audio.preload = 'auto';
    audio.volume = FANCY_NANCY_INTRO_VOLUME;
    audio.loop = false;

    const updateFade = () => {
        if (fancyNancyIntroAudio !== audio) return;

        const t = audio.currentTime || 0;

        if (t >= FANCY_NANCY_INTRO_END) {
            audio.pause();
            audio.currentTime = FANCY_NANCY_INTRO_END;
            audio.volume = 0;
            return;
        }

        if (t >= FANCY_NANCY_INTRO_FADE_START) {
            const remaining =
                Math.max(0, FANCY_NANCY_INTRO_END - t);
            const fadeLength =
                FANCY_NANCY_INTRO_END -
                FANCY_NANCY_INTRO_FADE_START;

            audio.volume =
                FANCY_NANCY_INTRO_VOLUME *
                (remaining / fadeLength);
        }
    };

    audio.addEventListener('timeupdate', updateFade);

    const playNow = () => {
        if (fancyNancyIntroAudio !== audio) return;

        const promise = audio.play();

        if (promise && typeof promise.catch === 'function') {
            promise.catch(() => {
                /*
                 * Browsers may block autoplay. If that happens, retry once
                 * on the next normal user interaction.
                 */
                if (fancyNancyIntroFallbackHandler) return;

                fancyNancyIntroFallbackHandler = () => {
                    document.removeEventListener(
                        'pointerdown',
                        fancyNancyIntroFallbackHandler
                    );
                    document.removeEventListener(
                        'keydown',
                        fancyNancyIntroFallbackHandler
                    );

                    fancyNancyIntroFallbackHandler = null;

                    if (fancyNancyIntroAudio !== audio) return;

                    const retry = audio.play();

                    if (
                        retry &&
                        typeof retry.catch === 'function'
                    ) {
                        retry.catch(() => {});
                    }
                };

                document.addEventListener(
                    'pointerdown',
                    fancyNancyIntroFallbackHandler,
                    { once: true }
                );

                document.addEventListener(
                    'keydown',
                    fancyNancyIntroFallbackHandler,
                    { once: true }
                );
            });
        }
    };

    playNow();
}

const FANCY_NANCY_SVGS = [
    '/svg/theme-fancynancy/artist-palette.svg',
    '/svg/theme-fancynancy/feather-duster.svg',
    '/svg/theme-fancynancy/feather-headband.svg',
    '/svg/theme-fancynancy/keytar.svg',
    '/svg/theme-fancynancy/magnifying-glass-binoculars.svg',
    '/svg/theme-fancynancy/parasol.svg',
    '/svg/theme-fancynancy/peacock-purse.svg',
    '/svg/theme-fancynancy/poodle.svg',
    '/svg/theme-fancynancy/teacup.svg'
];

function fancyRandom(min, max) {
    return Math.random() * (max - min) + min;
}

function addFancyObject(file, config) {
    if (!fancyNancyBackground) return;

    const item = document.createElement('div');
    item.className = `fancynancy-theme-item fancynancy-theme-depth-${config.depth || 1}`;
    item.setAttribute('aria-hidden', 'true');
    item.style.left = `${config.x}%`;
    item.style.top = `${config.y}%`;
    item.style.setProperty('--fancy-scale', config.scale ?? 1);
    item.style.setProperty('--fancy-rotate', `${config.rotate ?? 0}deg`);
    item.style.setProperty('--fancy-duration', `${config.duration ?? fancyRandom(8, 13)}s`);
    item.style.setProperty('--fancy-delay', `${config.delay ?? -fancyRandom(0, 9)}s`);
    item.style.setProperty('--fancy-drift-x', `${config.driftX ?? fancyRandom(-7, 7)}px`);
    item.style.setProperty('--fancy-drift-y', `${config.driftY ?? fancyRandom(-6, 6)}px`);

    const img = document.createElement('img');
    img.className = 'fancynancy-theme-svg';
    img.src = file;
    img.alt = '';
    img.draggable = false;
    img.setAttribute('aria-hidden', 'true');

    item.appendChild(img);
    fancyNancyBackground.appendChild(item);
}

function createFancyObjects() {
    if (!fancyNancyBackground) return;

    // Deliberately starts below the title zone and favors the outer edges so
    // decorations stay visible without competing with headings/components.
    const layout = [
        { x: 7,  y: 28, scale: 1.04, rotate: -12 },
        { x: 93, y: 27, scale: 1.03, rotate: 12 },
        { x: 17, y: 48, scale: 1.00, rotate: 8 },
        { x: 83, y: 49, scale: 1.02, rotate: -8 },
        { x: 5,  y: 68, scale: 1.10, rotate: -13 },
        { x: 95, y: 68, scale: 1.11, rotate: 13 },
        { x: 27, y: 78, scale: 1.00, rotate: -5 },
        { x: 73, y: 80, scale: 1.03, rotate: 6 },
        { x: 12, y: 93, scale: 1.06, rotate: 9 }
    ];

    FANCY_NANCY_SVGS.forEach((file, index) => {
        const base = layout[index];
        addFancyObject(file, {
            ...base,
            x: base.x + fancyRandom(-1.1, 1.1),
            y: base.y + fancyRandom(-1.0, 1.0),
            duration: fancyRandom(8.5, 12.5),
            delay: -fancyRandom(0, 9),
            driftX: fancyRandom(-5, 5),
            driftY: fancyRandom(-4, 4)
        });
    });
}

function createPearls() {
    if (!fancyNancyBackground) return;

    for (let i = 0; i < 34; i++) {
        const pearl = document.createElement('span');
        pearl.className = 'fancynancy-pearl';
        pearl.setAttribute('aria-hidden', 'true');
        pearl.style.left = `${fancyRandom(1, 99)}%`;
        pearl.style.top = `${fancyRandom(5, 98)}%`;
        pearl.style.setProperty('--pearl-size', `${fancyRandom(3, 8)}px`);
        pearl.style.setProperty('--pearl-duration', `${fancyRandom(3.5, 7.5)}s`);
        pearl.style.setProperty('--pearl-delay', `${-fancyRandom(0, 6)}s`);
        fancyNancyBackground.appendChild(pearl);
    }
}

function createSparkles() {
    if (!fancyNancyBackground) return;

    for (let i = 0; i < 22; i++) {
        const sparkle = document.createElement('span');
        sparkle.className = 'fancynancy-sparkle';
        sparkle.setAttribute('aria-hidden', 'true');
        sparkle.textContent = i % 3 === 0 ? '✦' : '✧';
        sparkle.style.left = `${fancyRandom(2, 98)}%`;
        sparkle.style.top = `${fancyRandom(8, 97)}%`;
        sparkle.style.setProperty('--sparkle-size', `${fancyRandom(10, 20)}px`);
        sparkle.style.setProperty('--sparkle-rotate', `${fancyRandom(-24, 24)}deg`);
        sparkle.style.setProperty('--sparkle-duration', `${fancyRandom(4, 8)}s`);
        sparkle.style.setProperty('--sparkle-delay', `${-fancyRandom(0, 7)}s`);
        fancyNancyBackground.appendChild(sparkle);
    }
}

function createBows() {
    if (!fancyNancyBackground) return;

    const positions = [
        [2.5, 17], [88, 16], [43, 36], [8, 57], [89, 59], [49, 88]
    ];

    positions.forEach(([x, y], index) => {
        const bow = document.createElement('span');
        bow.className = 'fancynancy-bow';
        bow.setAttribute('aria-hidden', 'true');
        bow.style.left = `${x}%`;
        bow.style.top = `${y}%`;
        bow.style.setProperty('--bow-scale', `${fancyRandom(.8, 1.25)}`);
        bow.style.setProperty('--bow-rotate', `${fancyRandom(-20, 20)}deg`);
        bow.style.animationDelay = `${index * -.8}s`;
        bow.innerHTML = '<i></i><b></b><em></em>';
        fancyNancyBackground.appendChild(bow);
    });
}

function createPolkaDots() {
    if (!fancyNancyBackground) return;

    for (let i = 0; i < 28; i++) {
        const dot = document.createElement('span');
        dot.className = 'fancynancy-dot';
        dot.setAttribute('aria-hidden', 'true');
        dot.style.left = `${fancyRandom(0, 100)}%`;
        dot.style.top = `${fancyRandom(8, 100)}%`;
        dot.style.setProperty('--dot-size', `${fancyRandom(5, 13)}px`);
        dot.style.setProperty('--dot-opacity', fancyRandom(.08, .19));
        fancyNancyBackground.appendChild(dot);
    }
}

function createRibbonSwirls() {
    if (!fancyNancyBackground) return;

    [
        { left: 2, top: 39, width: 19, rotate: -7 },
        { left: 78, top: 37, width: 19, rotate: 7 },
        { left: 2, top: 84, width: 20, rotate: 5 },
        { left: 77, top: 88, width: 21, rotate: -5 }
    ].forEach((config, index) => {
        const swirl = document.createElement('span');
        swirl.className = 'fancynancy-ribbon-swirl';
        swirl.setAttribute('aria-hidden', 'true');
        swirl.style.left = `${config.left}%`;
        swirl.style.top = `${config.top}%`;
        swirl.style.width = `${config.width}%`;
        swirl.style.transform = `rotate(${config.rotate}deg)`;
        swirl.style.animationDelay = `${index * -1.2}s`;
        fancyNancyBackground.appendChild(swirl);
    });
}

export function mount() {
    if (fancyNancyBackground) return;

    playFancyNancyIntro();

    fancyNancyStylesheet = document.createElement('link');
    fancyNancyStylesheet.rel = 'stylesheet';
    fancyNancyStylesheet.href = '/themes/theme-fancynancy.css';
    fancyNancyStylesheet.dataset.theme = 'fancynancy';
    document.head.appendChild(fancyNancyStylesheet);

    fancyNancyBackground = document.createElement('div');
    fancyNancyBackground.id = 'fancynancy-theme-background';
    fancyNancyBackground.setAttribute('aria-hidden', 'true');
    document.body.appendChild(fancyNancyBackground);

    createPolkaDots();
    createRibbonSwirls();
    createBows();
    createPearls();
    createSparkles();
    createFancyObjects();
}

export function unmount() {
    stopFancyNancyIntro();

    if (fancyNancyBackground) {
        fancyNancyBackground.remove();
        fancyNancyBackground = null;
    }

    if (fancyNancyStylesheet) {
        fancyNancyStylesheet.remove();
        fancyNancyStylesheet = null;
    }
}
