/* ============================================================
   DIVA THEME
   Built from the winter-theme mount/unmount pattern.
   Decorative only: no layout, cursor, companion, or app logic changes.
   ============================================================ */

let divaBackground = null;
let divaHoverHandler = null;
let divaHoverLast = null;
let divaHoverAudio = null;
let divaIntroAudio = null;
let divaIntroFrame = null;
let divaHoverUnlocked = false;
let divaIntroActive = false;

const DIVA_FILES = [
    "aqua-sequin-hobo-bag.svg",
    "blue-beaded-floral-round-bag.svg",
    "blue-denim-studded-hobo-bag.svg",
    "blush-studded-halfmoon-bag.svg",
    "cream-beaded-drawstring-bag.svg",
    "cream-fringe-beaded-bag.svg",
    "gold-beaded-buckle-shoulder-bag.svg",
    "lavender-sequin-baguette-bag.svg",
    "pearl-shell-clutch-bag.svg",
    "pink-beaded-halo-bag.svg",
    "pink-disc-tote-bag.svg",
    "pink-rhinestone-shoulder-bag.svg",
    "pink-scale-top-handle-bag.svg",
    "rose-gold-sequin-bag.svg",
    "silver-sequin-pearl-bag.svg",
    "turquoise-starfish-chain-bag-2.svg",
    "turquoise-starfish-chain-bag.svg",
    "white-shell-shoulder-bag.svg"
];
const DIVA_SLOTS = [
    { x: 8,  y: 18, min: 92,  max: 118 },
    { x: 9,  y: 35, min: 96,  max: 122 },
    { x: 10, y: 54, min: 96,  max: 126 },
    { x: 12, y: 73, min: 100, max: 130 },
    { x: 19, y: 89, min: 104, max: 138 },
    { x: 38, y: 90, min: 110, max: 144 },
    { x: 62, y: 90, min: 110, max: 144 },
    { x: 81, y: 89, min: 104, max: 138 },
    { x: 88, y: 18, min: 92,  max: 118 },
    { x: 90, y: 35, min: 96,  max: 122 },
    { x: 89, y: 54, min: 96,  max: 126 },
    { x: 87, y: 73, min: 100, max: 130 }
];
const DIVA_RENDER_COUNT = 12;
const DIVA_BOP_INDEXES = new Set([0, 2, 5, 7, 10]);
const DIVA_HOVER_SOUNDS = [
    '/sounds/winx/cartoon_music-arcade-game-positive-selection-bling-489760.mp3',
    '/sounds/winx/freesound_community-electricity-sound-6066.mp3',
    '/sounds/winx/freesound_community-match-sizzle-02-104778.mp3',
    '/sounds/winx/koiroylers-get-coin-351945.mp3'
];
const DIVA_HOVER_VOLUME = 0.42;
const DIVA_INTRO_SOURCES = [
    '/sounds/intros/rockot-turn-it-up-195069.mp3',
    '/sounds/intros/rockot-turn-it-up-195069'
];
const DIVA_INTRO_CUTOFF = 20;
const DIVA_INTRO_FADE_START = 17;
const DIVA_INTRO_VOLUME = 0.34;

function divaRandom(min, max) { return Math.random() * (max - min) + min; }

function divaShuffle(arr) {
    const copy = arr.slice();
    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
}

function divaAssetCandidates(file) {
    return [
        `/svg/theme-diva/${file}`,
        `/svg/diva/${file}`,
        `/svg/${file}`
    ];
}

function divaSetImageSource(img, file) {
    const candidates = divaAssetCandidates(file);
    let index = 0;
    const tryNext = () => {
        if (index >= candidates.length) {
            img.onerror = null;
            return;
        }
        img.src = candidates[index++];
    };
    img.onerror = tryNext;
    tryNext();
}

function divaLoadAudioFromCandidates(audio, candidates) {
    return new Promise((resolve, reject) => {
        let index = 0;
        const cleanup = () => {
            audio.removeEventListener('loadedmetadata', onLoaded);
            audio.removeEventListener('canplay', onLoaded);
            audio.removeEventListener('error', onError);
        };
        const onLoaded = () => { cleanup(); resolve(audio); };
        const onError = () => {
            if (index >= candidates.length) { cleanup(); reject(new Error('audio-not-found')); return; }
            audio.src = candidates[index++];
            audio.load();
        };
        audio.addEventListener('loadedmetadata', onLoaded);
        audio.addEventListener('canplay', onLoaded);
        audio.addEventListener('error', onError);
        onError();
    });
}

function divaSetIntroBop(active) {
    divaIntroActive = active;
    if (!divaBackground) return;
    for (const item of divaBackground.querySelectorAll('.diva-intro-bop-target')) {
        item.classList.toggle('diva-intro-bop', active);
    }
}

function createDivaItem(index, file, slot) {
    if (!divaBackground) return;
    const item = document.createElement('img');
    item.className = 'diva-item';
    item.alt = '';
    item.draggable = false;
    item.setAttribute('aria-hidden', 'true');
    divaSetImageSource(item, file);

    item.style.left = `${slot.x + divaRandom(-0.6, 0.6)}%`;
    item.style.top = `${slot.y + divaRandom(-0.8, 0.8)}%`;
    item.style.width = `${divaRandom(slot.min, slot.max)}px`;
    item.style.zIndex = String(index + 1);
    item.style.setProperty('--diva-float-x', `${divaRandom(-7, 7)}px`);
    item.style.setProperty('--diva-float-y', `${divaRandom(-8, 8)}px`);
    item.style.setProperty('--diva-float-r', `${divaRandom(-5, 5)}deg`);
    item.style.setProperty('--diva-float-duration', `${divaRandom(6.1, 9.2)}s`);
    item.style.setProperty('--diva-float-delay', `${-divaRandom(0, 8)}s`);
    item.style.setProperty('--diva-bop-delay', `${-divaRandom(0, .7)}s`);

    if (DIVA_BOP_INDEXES.has(index)) {
        item.classList.add('diva-intro-bop-target');
        if (divaIntroActive) item.classList.add('diva-intro-bop');
    }

    divaBackground.appendChild(item);
}

function createDivaItems() {
    const slots = divaShuffle(DIVA_SLOTS);
    const files = divaShuffle(DIVA_FILES);
    const renderCount = Math.min(DIVA_RENDER_COUNT, slots.length, files.length);
    for (let i = 0; i < renderCount; i++) createDivaItem(i, files[i], slots[i]);
}

function createDivaSparkles() {
    if (!divaBackground) return;

    for (let i = 0; i < 18; i++) {
        const sparkle = document.createElement('span');
        sparkle.className = 'diva-sparkle';
        sparkle.style.left = `${divaRandom(4, 96)}%`;
        sparkle.style.top = `${divaRandom(6, 95)}%`;
        sparkle.style.setProperty('--diva-sparkle-delay', `${-divaRandom(0, 7)}s`);
        sparkle.style.setProperty('--diva-sparkle-duration', `${divaRandom(3.8, 6.8)}s`);
        sparkle.style.setProperty('--diva-sparkle-scale', divaRandom(0.65, 1.4).toFixed(2));
        divaBackground.appendChild(sparkle);
    }

    for (let i = 0; i < 10; i++) {
        const pearl = document.createElement('span');
        pearl.className = 'diva-pearl';
        pearl.style.left = `${divaRandom(5, 95)}%`;
        pearl.style.top = `${divaRandom(8, 92)}%`;
        pearl.style.setProperty('--diva-pearl-delay', `${-divaRandom(0, 8)}s`);
        pearl.style.setProperty('--diva-pearl-duration', `${divaRandom(5.3, 9.4)}s`);
        pearl.style.setProperty('--diva-pearl-scale', divaRandom(0.78, 1.32).toFixed(2));
        divaBackground.appendChild(pearl);
    }
}

function divaStopIntro({ unlockHover = false } = {}) {
    if (divaIntroFrame !== null) {
        cancelAnimationFrame(divaIntroFrame);
        divaIntroFrame = null;
    }

    if (divaIntroAudio) {
        try {
            divaIntroAudio.pause();
            divaIntroAudio.currentTime = 0;
            divaIntroAudio.removeAttribute('src');
            divaIntroAudio.load();
        } catch (_) {}
        divaIntroAudio = null;
    }

    divaSetIntroBop(false);
    if (unlockHover) divaHoverUnlocked = true;
}

async function divaStartIntro() {
    divaStopIntro();
    divaHoverUnlocked = false;
    divaSetIntroBop(true);

    const audio = new Audio();
    audio.preload = 'auto';
    audio.volume = DIVA_INTRO_VOLUME;
    divaIntroAudio = audio;

    const finishIntro = () => {
        if (divaIntroAudio !== audio) return;
        try { audio.pause(); audio.volume = 0; } catch (_) {}
        divaIntroAudio = null;
        divaIntroFrame = null;
        divaSetIntroBop(false);
        divaHoverUnlocked = true;
    };

    const updateIntro = () => {
        if (divaIntroAudio !== audio) return;
        const current = audio.currentTime || 0;
        if (current >= DIVA_INTRO_CUTOFF) { finishIntro(); return; }
        if (current >= DIVA_INTRO_FADE_START) {
            const progress = Math.min(1, (current - DIVA_INTRO_FADE_START) / (DIVA_INTRO_CUTOFF - DIVA_INTRO_FADE_START));
            audio.volume = DIVA_INTRO_VOLUME * (1 - progress);
        } else {
            audio.volume = DIVA_INTRO_VOLUME;
        }
        divaIntroFrame = requestAnimationFrame(updateIntro);
    };

    try {
        await divaLoadAudioFromCandidates(audio, DIVA_INTRO_SOURCES);
        const p = audio.play();
        if (p && typeof p.then === 'function') {
            p.then(() => {
                if (divaIntroAudio === audio) divaIntroFrame = requestAnimationFrame(updateIntro);
            }).catch(() => {
                if (divaIntroAudio === audio) divaStopIntro({ unlockHover: true });
            });
        } else {
            divaIntroFrame = requestAnimationFrame(updateIntro);
        }
    } catch (_) {
        if (divaIntroAudio === audio) divaStopIntro({ unlockHover: true });
    }
}

function divaStopHoverAudio() {
    if (divaHoverAudio) {
        try {
            divaHoverAudio.pause();
            divaHoverAudio.currentTime = 0;
            divaHoverAudio.removeAttribute('src');
            divaHoverAudio.load();
        } catch (_) {}
        divaHoverAudio = null;
    }
}

function divaPlayHover() {
    if (!divaHoverUnlocked) return;
    divaStopHoverAudio();
    const audio = new Audio(DIVA_HOVER_SOUNDS[Math.floor(Math.random() * DIVA_HOVER_SOUNDS.length)]);
    divaHoverAudio = audio;
    audio.volume = DIVA_HOVER_VOLUME;
    const p = audio.play();
    if (p && typeof p.catch === 'function') p.catch(() => {});
}

function divaAnimateHover(item) {
    if (!item || typeof item.animate !== 'function') return;
    if (item._divaHoverAnimation) {
        try { item._divaHoverAnimation.cancel(); } catch (_) {}
    }
    item._divaHoverAnimation = item.animate([
        { translate: '0 0', rotate: '0deg', scale: '1' },
        { translate: '0 -9px', rotate: '-6deg', scale: '1.08', offset: 0.34 },
        { translate: '0 -4px', rotate: '5deg', scale: '1.04', offset: 0.72 },
        { translate: '0 0', rotate: '0deg', scale: '1' }
    ], { duration: 520, easing: 'ease-out', fill: 'none' });
    item._divaHoverAnimation.addEventListener('finish', () => { item._divaHoverAnimation = null; }, { once: true });
}

function divaInstallHover() {
    divaHoverHandler = (event) => {
        if (!divaBackground) return;
        let hit = null;
        for (const item of divaBackground.querySelectorAll('.diva-item')) {
            const rect = item.getBoundingClientRect();
            if (event.clientX >= rect.left && event.clientX <= rect.right && event.clientY >= rect.top && event.clientY <= rect.bottom) {
                hit = item;
                break;
            }
        }
        if (hit && hit !== divaHoverLast) {
            divaHoverLast = hit;
            divaAnimateHover(hit);
            divaPlayHover();
        } else if (!hit) {
            divaHoverLast = null;
        }
    };
    document.addEventListener('mousemove', divaHoverHandler, { passive: true });
}

function divaRemoveHover() {
    if (divaHoverHandler) document.removeEventListener('mousemove', divaHoverHandler);
    divaHoverHandler = null;
    divaHoverLast = null;
    divaStopHoverAudio();
}

export function mount() {
    if (divaBackground) return;
    divaBackground = document.createElement('div');
    divaBackground.id = 'diva-background';
    divaBackground.setAttribute('aria-hidden', 'true');
    document.body.appendChild(divaBackground);
    createDivaItems();
    createDivaSparkles();
    divaInstallHover();
    divaStartIntro();
}

export function unmount() {
    divaStopIntro();
    divaHoverUnlocked = false;
    divaRemoveHover();
    if (divaBackground) {
        divaBackground.remove();
        divaBackground = null;
    }
}
