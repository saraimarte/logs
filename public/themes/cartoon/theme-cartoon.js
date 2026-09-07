
/* ============================================================
   CARTOON THEME
   Big random comic SVGs + hover enlargement + random SFX.
   ============================================================ */

let cartoonBackground = null;
let cartoonMusic = null;
let cartoonMusicFallbackHandler = null;
let cartoonHoverAudio = null;
let cartoonHoverToken = 0;
let cartoonIntroFinished = false;
let cartoonDanceStopTimer = null;

const CARTOON_ASSET_BASE = '/svg/theme-cartoon/';
const CARTOON_SOUND_BASE = '/sounds/cartoon/';

const CARTOON_SVGS = [
    'cartoon-01-wow.svg',
    'cartoon-02-gasp.svg',
    'cartoon-03-crash.svg',
    'cartoon-04-kaboom.svg',
    'cartoon-05-poof.svg',
    'cartoon-06-ouch.svg',
    'cartoon-07-pow.svg',
    'cartoon-08-crack.svg',
    'cartoon-09-zap.svg',
    'cartoon-10-vs-lightning.svg',
    'cartoon-11-zap-blue.svg',
    'cartoon-12-crush.svg',
    'cartoon-13-pop.svg',
    'cartoon-14-boom.svg',
    'cartoon-15-wham.svg',
    'cartoon-16-super.svg',
    'cartoon-17-wtf.svg',
    'cartoon-18-bam.svg',
    'cartoon-19-pow-red.svg',
    'cartoon-20-smoke-cloud.svg',
    'cartoon-21-knock-knock.svg',
    'cartoon-22-bang.svg',
    'cartoon-23-wham-blue.svg',
    'cartoon-24-poof-cloud.svg'
];

const CARTOON_HOVER_SOUNDS = [
    'floraphonic-cartoon-slap-2-189831.mp3',
    'floraphonic-punch-2-166695.mp3',
    'floraphonic-punch-3-166696.mp3',
    'floraphonic-punch-6-166699.mp3',
    'universfield-cartoon-explosion-567193.mp3'
];

const CARTOON_INTRO_MUSIC =
    `${CARTOON_SOUND_BASE}freesound_community-cartoon-music-81920.mp3`;

function rand(min, max) {
    return Math.random() * (max - min) + min;
}

function shuffle(items) {
    const copy = items.slice();

    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }

    return copy;
}

function setCartoonIntroDance(isPlaying) {
    if (!cartoonBackground) return;

    cartoonBackground.classList.toggle(
        'cartoon-intro-playing',
        Boolean(isPlaying)
    );
}

function stopHoverAudio() {
    if (!cartoonHoverAudio) return;

    try {
        cartoonHoverAudio.pause();
        cartoonHoverAudio.currentTime = 0;
    } catch (_) {}

    cartoonHoverAudio = null;
}

function playRandomHoverSound() {
    // Hover SFX are locked until the one-time intro music finishes.
    if (!cartoonIntroFinished) return;

    const token = ++cartoonHoverToken;
    stopHoverAudio();

    const file =
        CARTOON_HOVER_SOUNDS[
            Math.floor(Math.random() * CARTOON_HOVER_SOUNDS.length)
        ];

    const audio =
        new Audio(`${CARTOON_SOUND_BASE}${file}`);

    cartoonHoverAudio = audio;
    audio.preload = 'auto';
    audio.volume = 0.36;

    const promise = audio.play();

    if (promise && typeof promise.catch === 'function') {
        promise.catch(() => {});
    }

    audio.addEventListener(
        'ended',
        () => {
            if (
                token === cartoonHoverToken &&
                cartoonHoverAudio === audio
            ) {
                cartoonHoverAudio = null;
            }
        },
        { once: true }
    );
}

function playIntroMusicOnce() {
    if (cartoonMusic) return;

    const audio = new Audio(CARTOON_INTRO_MUSIC);
    cartoonMusic = audio;

    audio.preload = 'auto';
    audio.volume = 0.26;
    audio.loop = false;

    const clearDanceStopTimer = () => {
        if (!cartoonDanceStopTimer) return;

        clearTimeout(cartoonDanceStopTimer);
        cartoonDanceStopTimer = null;
    };

    const startDancingWindow = () => {
        if (!cartoonMusic || cartoonMusic !== audio) return;

        clearDanceStopTimer();
        setCartoonIntroDance(true);
    };

    const stopDancingWindow = () => {
        clearDanceStopTimer();
        setCartoonIntroDance(false);
    };

    const playNow = () => {
        if (!cartoonMusic || cartoonMusic !== audio) return;

        setCartoonIntroDance(true);

        const promise = audio.play();

        if (promise && typeof promise.catch === 'function') {
            promise.catch(() => {
                setCartoonIntroDance(false);

                // If the browser blocks the immediate play, try exactly once
                // on the next ordinary user interaction.
                if (cartoonMusicFallbackHandler) return;

                cartoonMusicFallbackHandler = () => {
                    document.removeEventListener(
                        'pointerdown',
                        cartoonMusicFallbackHandler
                    );

                    document.removeEventListener(
                        'keydown',
                        cartoonMusicFallbackHandler
                    );

                    const handler = cartoonMusicFallbackHandler;
                    cartoonMusicFallbackHandler = null;

                    if (
                        !cartoonMusic ||
                        cartoonMusic !== audio ||
                        !handler
                    ) {
                        return;
                    }

                    setCartoonIntroDance(true);

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
                    cartoonMusicFallbackHandler,
                    { once: true }
                );

                document.addEventListener(
                    'keydown',
                    cartoonMusicFallbackHandler,
                    { once: true }
                );
            });
        }
    };

    audio.addEventListener(
        'playing',
        () => {
            startDancingWindow();
        }
    );

    audio.addEventListener(
        'pause',
        () => {
            stopDancingWindow();
        }
    );

    playNow();

    audio.addEventListener(
        'ended',
        () => {
            // The intro is one-shot. Only after it finishes may hover SFX play.
            stopDancingWindow();
            cartoonIntroFinished = true;
        },
        { once: true }
    );

    audio.addEventListener(
        'error',
        () => {
            // If the intro file itself cannot load, do not permanently lock SFX.
            stopDancingWindow();
            cartoonIntroFinished = true;
        },
        { once: true }
    );
}

const CARTOON_ASPECT_RATIOS = {
    'cartoon-01-wow.svg': 317 / 225,
    'cartoon-02-gasp.svg': 294 / 134,
    'cartoon-03-crash.svg': 307 / 251,
    'cartoon-04-kaboom.svg': 293 / 239,
    'cartoon-05-poof.svg': 336 / 278,
    'cartoon-06-ouch.svg': 287 / 246,
    'cartoon-07-pow.svg': 283 / 228,
    'cartoon-08-crack.svg': 293 / 234,
    'cartoon-09-zap.svg': 304 / 268,
    'cartoon-10-vs-lightning.svg': 226 / 254,
    'cartoon-11-zap-blue.svg': 318 / 270,
    'cartoon-12-crush.svg': 311 / 246,
    'cartoon-13-pop.svg': 303 / 246,
    'cartoon-14-boom.svg': 336 / 227,
    'cartoon-15-wham.svg': 316 / 263,
    'cartoon-16-super.svg': 334 / 238,
    'cartoon-17-wtf.svg': 306 / 235,
    'cartoon-18-bam.svg': 322 / 296,
    'cartoon-19-pow-red.svg': 303 / 275,
    'cartoon-20-smoke-cloud.svg': 299 / 268,
    'cartoon-21-knock-knock.svg': 342 / 255,
    'cartoon-22-bang.svg': 309 / 243,
    'cartoon-23-wham-blue.svg': 320 / 261,
    'cartoon-24-poof-cloud.svg': 334 / 269
};

function getCartoonRatio(file) {
    return CARTOON_ASPECT_RATIOS[file] || 1.25;
}

function getLayoutBoxes() {
    /*
     * BIGGER RECTANGLE over the day-log area.
     *
     * 3 rows × 4 columns:
     * - much larger icons
     * - more space between icons
     * - starts higher so the first row of day numbers actually gets covered
     * - still avoids the top-left and top-right corners
     */
    return [
        /* FIRST / UPPER DAY-LOG ROW */
        { x: 0.03, y: 0.17, w: 0.20, h: 0.19, zone: 'upper' },
        { x: 0.27, y: 0.17, w: 0.20, h: 0.19, zone: 'upper' },
        { x: 0.51, y: 0.17, w: 0.20, h: 0.19, zone: 'upper' },
        { x: 0.75, y: 0.17, w: 0.20, h: 0.19, zone: 'upper' },

        /* SECOND / MIDDLE DAY-LOG ROW */
        { x: 0.03, y: 0.47, w: 0.20, h: 0.19, zone: 'middle' },
        { x: 0.27, y: 0.47, w: 0.20, h: 0.19, zone: 'middle' },
        { x: 0.51, y: 0.47, w: 0.20, h: 0.19, zone: 'middle' },
        { x: 0.75, y: 0.47, w: 0.20, h: 0.19, zone: 'middle' },

        /* THIRD / LOWER DAY-LOG ROW */
        { x: 0.03, y: 0.77, w: 0.20, h: 0.19, zone: 'lower' },
        { x: 0.27, y: 0.77, w: 0.20, h: 0.19, zone: 'lower' },
        { x: 0.51, y: 0.77, w: 0.20, h: 0.19, zone: 'lower' },
        { x: 0.75, y: 0.77, w: 0.20, h: 0.19, zone: 'lower' }
    ];
}

function getHardLogTitleNoGoRect() {
    const vw = Math.max(window.innerWidth || 0, 900);
    const vh = Math.max(window.innerHeight || 0, 700);

    /*
     * Smaller title-protection band than before so the FIRST row of day logs
     * can finally have artwork behind it. It still keeps the title clear.
     */
    const hardBand = {
        left: vw * 0.20,
        right: vw * 0.80,
        top: 0,
        bottom: Math.min(165, vh * 0.19)
    };

    const title =
        document.querySelector('#log-view > .log-header-container h1') ||
        document.querySelector('#log-view .log-header-container h1') ||
        document.querySelector('#log-view h1');

    if (!title) return hardBand;

    const rect = title.getBoundingClientRect();
    if (!rect.width || !rect.height) return hardBand;

    return {
        left: Math.min(hardBand.left, rect.left - 52),
        right: Math.max(hardBand.right, rect.right + 52),
        top: 0,
        bottom: Math.max(hardBand.bottom, rect.bottom + 26)
    };
}

function overlapsRect(a, b) {
    return !(
        a.right <= b.left ||
        a.left >= b.right ||
        a.bottom <= b.top ||
        a.top >= b.bottom
    );
}

function sizeForBox(box, ratio) {
    const vw = Math.max(window.innerWidth || 0, 900);
    const vh = Math.max(window.innerHeight || 0, 700);

    const boxW = box.w * vw;
    const boxH = box.h * vh;

    /*
     * WAY bigger sizing, but still with a little room for hover growth.
     */
    let width = Math.min(
        boxW * 1.18,
        boxH * 1.12 * ratio
    );

    if (ratio > 1.65) width *= 1.12;
    if (ratio < 1.0) width *= 0.98;
    if (box.zone === 'upper') width *= 1.06;
    if (box.zone === 'middle') width *= 1.04;
    if (box.zone === 'lower') width *= 1.02;

    return Math.max(220, Math.min(width, 450));
}

function positionInBox(box, widthPx, heightPx) {
    const vw = Math.max(window.innerWidth || 0, 900);
    const vh = Math.max(window.innerHeight || 0, 700);
    const noGo = getHardLogTitleNoGoRect();

    const boxX = box.x * vw;
    const boxY = box.y * vh;
    const boxW = box.w * vw;
    const boxH = box.h * vh;

    let x = boxX + (boxW - widthPx) / 2;
    let y = boxY + (boxH - heightPx) / 2;

    /*
     * Tiny jitter only, so the distribution stays like a rectangle.
     */
    const slackX = Math.max(0, boxW - widthPx);
    const slackY = Math.max(0, boxH - heightPx);
    const jitterX = Math.min(7, Math.max(1, slackX / 2));
    const jitterY = Math.min(7, Math.max(1, slackY / 2));

    x += rand(-jitterX, jitterX);
    y += rand(-jitterY, jitterY);

    x = Math.max(2, Math.min(vw - widthPx - 2, x));
    y = Math.max(2, Math.min(vh - heightPx - 2, y));

    const rect = {
        left: x,
        top: y,
        right: x + widthPx,
        bottom: y + heightPx
    };

    if (overlapsRect(rect, noGo)) {
        /*
         * If anything touches the title zone, place it immediately below
         * instead of shoving it too far down.
         */
        y = noGo.bottom + 10;
        x = Math.max(2, Math.min(vw - widthPx - 2, x));
        y = Math.max(2, Math.min(vh - heightPx - 2, y));
    }

    return { x, y };
}

function createCartoonIcons() {
    if (!cartoonBackground) return;

    /*
     * Slightly fewer icons so each one can stay larger and cleaner.
     */
    const selected = shuffle(CARTOON_SVGS).slice(0, 12);
    const boxes = shuffle(getLayoutBoxes());

    selected.forEach((file, index) => {
        const item = document.createElement('div');
        item.className = 'cartoon-theme-item';
        item.setAttribute('aria-hidden', 'true');

        const ratio = getCartoonRatio(file);
        const box = boxes[index];
        const widthPx = sizeForBox(box, ratio);
        const heightPx = widthPx / ratio;
        const position = positionInBox(box, widthPx, heightPx);

        item.style.left = `${position.x}px`;
        item.style.top = `${position.y}px`;
        item.style.zIndex = `${20 + index}`;

        item.style.setProperty(
            '--cartoon-width',
            `${widthPx}px`
        );

        item.style.setProperty(
            '--cartoon-ratio',
            `${ratio}`
        );

        item.style.setProperty(
            '--cartoon-rotate',
            `${rand(-6, 6)}deg`
        );

        item.style.setProperty(
            '--cartoon-hover-rotate',
            `${rand(-3, 3)}deg`
        );

        item.style.setProperty(
            '--cartoon-float-duration',
            `${rand(6.5, 9.5)}s`
        );

        item.style.setProperty(
            '--cartoon-float-delay',
            `${-rand(0, 8)}s`
        );

        item.style.setProperty(
            '--cartoon-drift-x',
            `${rand(-0.8, 0.8)}px`
        );

        item.style.setProperty(
            '--cartoon-drift-y',
            `${rand(-1.0, 1.0)}px`
        );

        const img = document.createElement('img');
        img.src = `${CARTOON_ASSET_BASE}${encodeURIComponent(file)}`;
        img.alt = '';
        img.draggable = false;
        img.decoding = 'async';

        const danceWrap = document.createElement('div');
        danceWrap.className = 'cartoon-dance-wrap';

        if (index % 3 === 0 || index % 5 === 0) {
            item.classList.add('cartoon-intro-dancer');

            danceWrap.style.setProperty(
                '--cartoon-dance-delay',
                `${-rand(0, 0.9)}s`
            );

            danceWrap.style.setProperty(
                '--cartoon-dance-height',
                `${rand(14, 24)}px`
            );

            danceWrap.style.setProperty(
                '--cartoon-dance-duration',
                `${rand(0.58, 0.82)}s`
            );
        }

        danceWrap.appendChild(img);
        item.appendChild(danceWrap);
        cartoonBackground.appendChild(item);

        item.addEventListener(
            'mouseenter',
            () => {
                item.classList.remove('cartoon-hit');
                void item.offsetWidth;
                item.classList.add('cartoon-hit');

                playRandomHoverSound();
            }
        );

        item.addEventListener(
            'mouseleave',
            () => {
                item.classList.remove('cartoon-hit');
            }
        );
    });
}

function createHalftones() {
    if (!cartoonBackground) return;

    const placements = [
        [7, 10], [78, 8], [12, 58], [72, 50], [38, 82]
    ];

    placements.forEach(([x, y], index) => {
        const el = document.createElement('span');
        el.className = 'cartoon-halftone';
        el.style.left = `${x}%`;
        el.style.top = `${y}%`;
        el.style.setProperty(
            '--halftone-size',
            `${rand(130, 220)}px`
        );
        el.style.setProperty(
            '--halftone-duration',
            `${rand(6, 10)}s`
        );
        el.style.setProperty(
            '--halftone-delay',
            `${-index * 1.1}s`
        );

        cartoonBackground.appendChild(el);
    });
}

function createSpeedLines() {
    if (!cartoonBackground) return;

    const placements = [
        [2, 24, 22, -8],
        [73, 31, 25, 7],
        [4, 70, 24, 6],
        [70, 76, 27, -7]
    ];

    placements.forEach(([x, y, width, rotate], index) => {
        const el = document.createElement('span');
        el.className = 'cartoon-speed-lines';
        el.style.left = `${x}%`;
        el.style.top = `${y}%`;
        el.style.setProperty('--line-width', `${width}vw`);
        el.style.setProperty('--line-rotate', `${rotate}deg`);
        el.style.setProperty(
            '--line-duration',
            `${rand(5.5, 8.5)}s`
        );
        el.style.setProperty(
            '--line-delay',
            `${-index * .8}s`
        );

        cartoonBackground.appendChild(el);
    });
}

function createStarbursts() {
    if (!cartoonBackground) return;

    const colors = [
        'rgba(255,213,79,.75)',
        'rgba(239,83,80,.55)',
        'rgba(66,165,245,.55)',
        'rgba(115,217,239,.55)'
    ];

    for (let i = 0; i < 10; i++) {
        const star = document.createElement('span');
        star.className = 'cartoon-starburst';

        star.style.left = `${rand(4, 92)}%`;
        star.style.top = `${rand(5, 92)}%`;
        star.style.setProperty(
            '--star-size',
            `${rand(26, 55)}px`
        );
        star.style.setProperty(
            '--star-color',
            colors[i % colors.length]
        );
        star.style.setProperty(
            '--star-duration',
            `${rand(4, 7)}s`
        );
        star.style.setProperty(
            '--star-delay',
            `${-rand(0, 6)}s`
        );

        cartoonBackground.appendChild(star);
    }
}

function createConfetti() {
    if (!cartoonBackground) return;

    const colors = [
        '#ef5350',
        '#ffd54f',
        '#42a5f5',
        '#73d9ef',
        '#333333'
    ];

    for (let i = 0; i < 24; i++) {
        const piece = document.createElement('span');
        piece.className = 'cartoon-confetti';

        piece.style.left = `${rand(2, 98)}%`;
        piece.style.top = `${rand(4, 96)}%`;
        piece.style.setProperty(
            '--confetti-size',
            `${rand(4, 9)}px`
        );
        piece.style.setProperty(
            '--confetti-color',
            colors[i % colors.length]
        );
        piece.style.setProperty(
            '--confetti-rotate',
            `${rand(-45, 45)}deg`
        );
        piece.style.setProperty(
            '--confetti-duration',
            `${rand(4.5, 7.5)}s`
        );
        piece.style.setProperty(
            '--confetti-delay',
            `${-rand(0, 7)}s`
        );
        piece.style.setProperty(
            '--confetti-x',
            `${rand(-6, 6)}px`
        );
        piece.style.setProperty(
            '--confetti-y',
            `${rand(-7, 7)}px`
        );

        cartoonBackground.appendChild(piece);
    }
}

export function mount() {
    if (cartoonBackground) return;

    cartoonIntroFinished = false;

    cartoonBackground = document.createElement('div');
    cartoonBackground.id = 'cartoon-theme-background';
    cartoonBackground.setAttribute('aria-hidden', 'true');

    document.body.appendChild(cartoonBackground);

    createHalftones();
    createSpeedLines();
    createStarbursts();
    createConfetti();
    createCartoonIcons();

    playIntroMusicOnce();
}

export function unmount() {
    cartoonHoverToken++;
    cartoonIntroFinished = false;
    setCartoonIntroDance(false);

    if (cartoonDanceStopTimer) {
        clearTimeout(cartoonDanceStopTimer);
        cartoonDanceStopTimer = null;
    }

    stopHoverAudio();

    if (cartoonMusicFallbackHandler) {
        document.removeEventListener(
            'pointerdown',
            cartoonMusicFallbackHandler
        );

        document.removeEventListener(
            'keydown',
            cartoonMusicFallbackHandler
        );

        cartoonMusicFallbackHandler = null;
    }

    if (cartoonMusic) {
        try {
            cartoonMusic.pause();
            cartoonMusic.currentTime = 0;
        } catch (_) {}

        cartoonMusic = null;
    }

    if (cartoonBackground) {
        cartoonBackground.remove();
        cartoonBackground = null;
    }
}
