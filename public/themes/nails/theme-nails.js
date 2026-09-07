/* ============================================================
   NAIL ART STUDIO THEME
   Decorative-only theme module.
   The template remains the source of truth for layout, cursor,
   companions, tabs, controls, modals, and app behavior.
   ============================================================ */

const NAIL_ASSET_PATH = '/svg/theme-nails/';

const NAIL_ASSETS = [
    'nail-01-burgundy-gold-swirl.svg',
    'nail-02-orange-shell-star.svg',
    'nail-03-aqua-pink-dolphin.svg',
    'nail-04-blush-burgundy-flower.svg',
    'nail-05-pearl-blue-pink-flower.svg',
    'nail-06-orange-gold-rose.svg',
    'nail-07-lilac-butterfly.svg',
    'nail-08-burgundy-gold-bow.svg',
    'nail-09-amber-orchid.svg',
    'nail-10-amber-burgundy-flower.svg',
    'nail-11-pink-star.svg',
    'nail-12-burgundy-gold-frame.svg',
    'nail-13-blush-gold-frame.svg',
    'nail-14-gold-leaves.svg',
    'nail-15-yellow-pastel-flowers.svg',
    'nail-16-burgundy-flower.svg',
    'nail-17-yellow-red-star.svg',
    'nail-18-burgundy-double-flower.svg',
    'nail-19-burgundy-gold-vine.svg',
    'nail-20-red-gold-swirl.svg'
];

// Hand-positioned around the page so the title/header stays readable.
// Values are viewport percentages and remain decorative only.
const NAIL_LAYOUT = [
    { x: 5.5,  y: 18, s: 1.18, r: -18, d: 9.1, dx: 12,  dy: -14 },
    { x: 15,   y: 34, s: 1.02, r:  13, d: 8.4, dx: -9,  dy:  12 },
    { x: 5,    y: 55, s: 1.15, r: -8,  d: 10.2,dx: 11,  dy:  -9 },
    { x: 15,   y: 75, s: 0.98, r:  17, d: 7.7, dx: -8,  dy:  10 },
    { x: 7,    y: 91, s: 1.12, r: -13, d: 9.6, dx: 10,  dy: -10 },

    { x: 94,   y: 18, s: 1.14, r:  16, d: 8.8, dx: -12, dy: -12 },
    { x: 85,   y: 35, s: 1.00, r: -15, d: 9.4, dx: 9,   dy:  11 },
    { x: 95,   y: 54, s: 1.20, r:  9,  d: 7.9, dx: -10, dy: -9 },
    { x: 85,   y: 73, s: 1.04, r: -18, d: 10.5,dx: 8,   dy:  12 },
    { x: 94,   y: 90, s: 1.15, r:  13, d: 8.1, dx: -11, dy: -10 },

    { x: 27,   y: 93, s: 0.94, r: -10, d: 9.8, dx: 8,   dy: -10 },
    { x: 39,   y: 88, s: 1.06, r:  9,  d: 7.6, dx: -7,  dy:  10 },
    { x: 51,   y: 94, s: 1.12, r: -7,  d: 9.2, dx: 9,   dy: -8 },
    { x: 63,   y: 88, s: 1.00, r:  12, d: 8.6, dx: -9,  dy:  9 },
    { x: 75,   y: 94, s: 1.08, r: -12, d: 10.0,dx: 8,   dy: -10 },

    // Mid-page accents kept toward outer thirds.
    { x: 25,   y: 52, s: 0.90, r:  14, d: 8.3, dx: -7,  dy: -10 },
    { x: 75,   y: 53, s: 0.92, r: -14, d: 9.7, dx: 7,   dy:  10 },
    { x: 28,   y: 73, s: 0.88, r: -8,  d: 7.8, dx: 8,   dy: -8 },
    { x: 72,   y: 74, s: 0.90, r:  10, d: 9.0, dx: -8,  dy:  8 },
    { x: 50,   y: 84, s: 0.88, r: -5,  d: 10.3,dx: 6,   dy: -8 }
];

let mounted = false;
let root = null;
let nailsIntroAudio = null;
let nailsIntroFallbackHandler = null;

const NAILS_INTRO_SRC =
    '/sounds/intros/mado_lumn-inside-gold-powerful-vocal-dance-pop-560237.mp3';
const NAILS_INTRO_END = 30;
const NAILS_INTRO_FADE_START = 25;
const NAILS_INTRO_VOLUME = 0.30;

function stopNailsIntro() {
    if (nailsIntroFallbackHandler) {
        document.removeEventListener('pointerdown', nailsIntroFallbackHandler);
        document.removeEventListener('keydown', nailsIntroFallbackHandler);
        nailsIntroFallbackHandler = null;
    }

    if (!nailsIntroAudio) return;

    try {
        nailsIntroAudio.pause();
        nailsIntroAudio.currentTime = 0;
        nailsIntroAudio.volume = NAILS_INTRO_VOLUME;
    } catch (_) {}

    nailsIntroAudio = null;
}

function playNailsIntro() {
    stopNailsIntro();

    const audio = new Audio(NAILS_INTRO_SRC);
    nailsIntroAudio = audio;
    audio.preload = 'auto';
    audio.volume = NAILS_INTRO_VOLUME;
    audio.loop = false;

    const updateFade = () => {
        if (nailsIntroAudio !== audio) return;

        const t = audio.currentTime || 0;

        if (t >= NAILS_INTRO_END) {
            audio.pause();
            audio.currentTime = NAILS_INTRO_END;
            audio.volume = 0;
            return;
        }

        if (t >= NAILS_INTRO_FADE_START) {
            const remaining =
                Math.max(0, NAILS_INTRO_END - t);
            const fadeLength =
                NAILS_INTRO_END - NAILS_INTRO_FADE_START;

            audio.volume =
                NAILS_INTRO_VOLUME * (remaining / fadeLength);
        }
    };

    audio.addEventListener('timeupdate', updateFade);

    const playNow = () => {
        if (nailsIntroAudio !== audio) return;

        const promise = audio.play();

        if (promise && typeof promise.catch === 'function') {
            promise.catch(() => {
                if (nailsIntroFallbackHandler) return;

                nailsIntroFallbackHandler = () => {
                    document.removeEventListener(
                        'pointerdown',
                        nailsIntroFallbackHandler
                    );
                    document.removeEventListener(
                        'keydown',
                        nailsIntroFallbackHandler
                    );

                    nailsIntroFallbackHandler = null;

                    if (nailsIntroAudio !== audio) return;

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
                    nailsIntroFallbackHandler,
                    { once: true }
                );
                document.addEventListener(
                    'keydown',
                    nailsIntroFallbackHandler,
                    { once: true }
                );
            });
        }
    };

    playNow();
}

function el(tag, className) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    return node;
}

function createNail(asset, cfg, index) {
    const wrap = el('div', 'nails-art-item');
    wrap.style.left = `${cfg.x}%`;
    wrap.style.top = `${cfg.y}%`;
    wrap.style.setProperty('--nail-scale', cfg.s);
    wrap.style.setProperty('--nail-rotate', `${cfg.r}deg`);
    wrap.style.setProperty('--nail-duration', `${cfg.d}s`);
    wrap.style.setProperty('--nail-delay', `${-(index * 0.37).toFixed(2)}s`);
    wrap.style.setProperty('--nail-drift-x', `${cfg.dx}px`);
    wrap.style.setProperty('--nail-drift-y', `${cfg.dy}px`);

    const img = document.createElement('img');
    img.className = 'nails-art-svg';
    img.src = NAIL_ASSET_PATH + asset;
    img.alt = '';
    img.decoding = 'async';
    img.draggable = false;
    wrap.appendChild(img);
    return wrap;
}

function createSparkle(index) {
    const s = el('span', `nails-sparkle nails-sparkle-${index % 3}`);
    // Deterministic distribution. Keep the header center relatively open.
    const x = (11 + index * 17.37) % 92;
    let y = (12 + index * 23.11) % 86;
    if (y < 22 && x > 20 && x < 80) y += 20;
    s.style.left = `${x}%`;
    s.style.top = `${y}%`;
    s.style.setProperty('--sparkle-delay', `${-(index * 0.29).toFixed(2)}s`);
    s.style.setProperty('--sparkle-duration', `${3.2 + (index % 5) * 0.8}s`);
    return s;
}

function createPearl(index) {
    const p = el('span', 'nails-pearl');
    const x = (4 + index * 29.7) % 96;
    const y = 26 + ((index * 19.2) % 66);
    const size = 7 + (index % 4) * 3;
    p.style.left = `${x}%`;
    p.style.top = `${y}%`;
    p.style.width = `${size}px`;
    p.style.height = `${size}px`;
    p.style.setProperty('--pearl-delay', `${-(index * 0.41).toFixed(2)}s`);
    return p;
}


let nailsHoverMouseHandler = null;
let nailsHoverLast = null;
let nailsHoverSound = null;
const NAILS_HOVER_SOUNDS = [
    "/sounds/winx/cartoon_music-arcade-game-positive-selection-bling-489760.mp3",
    "/sounds/winx/freesound_community-electricity-sound-6066.mp3",
    "/sounds/winx/freesound_community-match-sizzle-02-104778.mp3",
    "/sounds/winx/koiroylers-get-coin-351945.mp3"
];

function nailsPlayHoverSound() {
    // Wait for the existing Nails intro to finish.
    if (nailsIntroAudio && !nailsIntroAudio.paused) return;
    if (nailsHoverSound) {
        try { nailsHoverSound.pause(); nailsHoverSound.currentTime = 0; } catch (_) {}
    }
    const audio = new Audio(NAILS_HOVER_SOUNDS[Math.floor(Math.random() * NAILS_HOVER_SOUNDS.length)]);
    nailsHoverSound = audio;
    audio.volume = .42;
    const p = audio.play();
    if (p && typeof p.catch === "function") p.catch(() => {});
}

function nailsInstallHover() {
    nailsHoverMouseHandler = (event) => {
        if (!root) return;
        let hit = null;
        for (const item of root.querySelectorAll(".nails-art-item")) {
            const r = item.getBoundingClientRect();
            if (event.clientX >= r.left && event.clientX <= r.right &&
                event.clientY >= r.top && event.clientY <= r.bottom) {
                hit = item;
                break;
            }
        }
        if (hit && hit !== nailsHoverLast) {
            nailsHoverLast = hit;
            hit.classList.remove("nails-hover-shake");
            void hit.offsetWidth;
            hit.classList.add("nails-hover-shake");
            setTimeout(() => hit.classList.remove("nails-hover-shake"), 460);
            nailsPlayHoverSound();
        } else if (!hit) {
            nailsHoverLast = null;
        }
    };
    document.addEventListener("mousemove", nailsHoverMouseHandler, { passive: true });
}

function nailsRemoveHover() {
    if (nailsHoverMouseHandler) {
        document.removeEventListener("mousemove", nailsHoverMouseHandler);
        nailsHoverMouseHandler = null;
    }
    nailsHoverLast = null;
    if (nailsHoverSound) {
        try { nailsHoverSound.pause(); nailsHoverSound.currentTime = 0; } catch (_) {}
        nailsHoverSound = null;
    }
}

export function mount() {
    if (mounted || !document.body.classList.contains('theme-nails')) return;
    mounted = true;

    playNailsIntro();

    root = el('div');
    root.id = 'nails-background';
    root.setAttribute('aria-hidden', 'true');

    const backdrop = el('div', 'nails-backdrop');
    root.appendChild(backdrop);

    const topTrim = el('div', 'nails-top-trim');
    root.appendChild(topTrim);

    const goldSweepA = el('div', 'nails-gold-sweep nails-gold-sweep-a');
    const goldSweepB = el('div', 'nails-gold-sweep nails-gold-sweep-b');
    root.append(goldSweepA, goldSweepB);

    NAIL_ASSETS.forEach((asset, index) => {
        root.appendChild(createNail(asset, NAIL_LAYOUT[index], index));
    });

    for (let i = 0; i < 28; i++) root.appendChild(createSparkle(i));
    for (let i = 0; i < 16; i++) root.appendChild(createPearl(i));

    document.body.prepend(root);
    nailsInstallHover();
}

export function unmount() {
    nailsRemoveHover();
    mounted = false;
    stopNailsIntro();
    if (root && root.parentNode) root.remove();
    root = null;
}
