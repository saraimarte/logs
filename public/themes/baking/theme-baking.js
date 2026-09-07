
/* ============================================================
   BAKING THEME
   Built from the winter theme structure.
   Decorative only: no app layout or app logic changes.
   ============================================================ */

let bakingBackground = null;
let bakingHoverHandler = null;
let bakingHoverLast = null;
let bakingHoverAudio = null;
let bakingIntroAudio = null;
let bakingIntroTick = null;
let bakingHoverUnlocked = false;
let bakingIntroActive = false;

const BAKING_FILES = [
    "baking-10-cherry-tier-cake.svg",
    "baking-11-pink-ruffle-cake.svg",
    "baking-12-strawberry-cake-slice.svg",
    "baking-13-strawberry-cream-cake.svg",
    "baking-14-chocolate-heart-cake.svg",
    "baking-15-strawberry-cream-puff.svg",
    "baking-16-chocolate-strawberry-cake.svg",
    "baking-17-pink-bow-cake.svg",
    "baking-18-strawberry-cream-drink.svg",
    "blueberry-chocolate-drip-pastry.svg",
    "blueberry-cream-drip-pastry.svg",
    "cheddar-cheese-drip-pastry.svg",
    "cheese-glaze-pastry.svg",
    "cooking-37-strawberry-shortcake.svg",
    "cooking-38-strawberry-tart.svg",
    "cooking-39-strawberry-cake-slice.svg",
    "cooking-40-strawberry-layer-cake.svg",
    "cooking-41-heart-strawberry-mousse.svg",
    "cooking-42-strawberry-cream-puff.svg",
    "cooking-43-pink-bow-cake.svg",
    "cooking-44-happy-birthday-cake.svg",
    "cooking-45-berry-cheesecake.svg",
    "fig-cream-drip-pastry.svg",
    "mango-mint-drip-pastry.svg",
    "pineapple-custard-drip-pastry.svg",
    "raspberry-strawberry-drip-pastry.svg",
    "ube-blueberry-mint-pastry.svg"
];
const BAKING_SLOTS = [{"x": 7, "y": 18, "min": 100, "max": 136}, {"x": 8, "y": 38, "min": 104, "max": 142}, {"x": 10, "y": 58, "min": 106, "max": 146}, {"x": 12, "y": 79, "min": 108, "max": 150}, {"x": 22, "y": 90, "min": 110, "max": 152}, {"x": 40, "y": 90, "min": 110, "max": 152}, {"x": 58, "y": 90, "min": 110, "max": 152}, {"x": 76, "y": 90, "min": 110, "max": 152}, {"x": 88, "y": 79, "min": 108, "max": 150}, {"x": 90, "y": 58, "min": 106, "max": 146}, {"x": 92, "y": 38, "min": 104, "max": 142}, {"x": 93, "y": 18, "min": 100, "max": 136}, {"x": 28, "y": 14, "min": 96, "max": 128}, {"x": 50, "y": 14, "min": 96, "max": 128}, {"x": 72, "y": 14, "min": 96, "max": 128}];
const BAKING_RENDER_COUNT = 15;
const BAKING_BOP_INDEXES = new Set([0, 3, 6, 9, 12]);
const BAKING_HOVER_SOUNDS = [
    "/sounds/winx/cartoon_music-arcade-game-positive-selection-bling-489760.mp3",
    "/sounds/winx/freesound_community-electricity-sound-6066.mp3",
    "/sounds/winx/freesound_community-match-sizzle-02-104778.mp3",
    "/sounds/winx/koiroylers-get-coin-351945.mp3"
];
const BAKING_HOVER_VOLUME = 0.42;
const BAKING_INTRO_SOURCES = [
    "/sounds/intros/tatamusic-comedy-comedy-music-590375.mp3",
    "/sounds/intros/tatamusic-comedy-comedy-music-590375"
];
const BAKING_INTRO_FULL = false;
const BAKING_INTRO_CUTOFF = 20;
const BAKING_INTRO_FADE_START = 16;
const BAKING_INTRO_VOLUME = 0.3;

function bakingRandom(min, max) { return Math.random() * (max - min) + min; }

function bakingShuffle(arr) {
    const copy = arr.slice();
    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
}

function bakingAssetCandidates(file) {
    return [
        "/svg/baking/{file}",
        "/svg/theme-baking/{file}",
        "/svg/cooking/{file}",
        "/svg/{file}"
].map(path => path.replace('{file}', file));
}

function bakingSetImageSource(img, file) {
    const candidates = bakingAssetCandidates(file);
    let index = 0;
    const tryNext = () => {
        if (index >= candidates.length) { img.onerror = null; return; }
        img.src = candidates[index++];
    };
    img.onerror = tryNext;
    tryNext();
}

function bakingLoadAudioFromCandidates(audio, candidates) {
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

function bakingSetIntroBop(active) {
    bakingIntroActive = active;
    if (!bakingBackground) return;
    for (const item of bakingBackground.querySelectorAll('.baking-intro-bop-target')) {
        item.classList.toggle('baking-intro-bop', active);
    }
}

function bakingCreateItem(index, file, slot) {
    if (!bakingBackground) return;
    const item = document.createElement('img');
    item.className = 'baking-item';
    item.alt = '';
    item.draggable = false;
    item.setAttribute('aria-hidden', 'true');
    bakingSetImageSource(item, file);
    item.style.left = `${slot.x + bakingRandom(-0.75, 0.75)}%`;
    item.style.top = `${slot.y + bakingRandom(-0.85, 0.85)}%`;
    item.style.width = `${bakingRandom(slot.min, slot.max)}px`;
    item.style.zIndex = String(index + 1);
    item.style.setProperty('--baking-float-x', `${bakingRandom(-8, 8)}px`);
    item.style.setProperty('--baking-float-y', `${bakingRandom(-9, 9)}px`);
    item.style.setProperty('--baking-float-r', `${bakingRandom(-4, 4)}deg`);
    item.style.setProperty('--baking-float-duration', `${bakingRandom(6.0, 9.0)}s`);
    item.style.setProperty('--baking-float-delay', `${-bakingRandom(0, 8)}s`);
    item.style.setProperty('--baking-bop-delay', `${-bakingRandom(0, .7)}s`);
    if (BAKING_BOP_INDEXES.has(index)) {
        item.classList.add('baking-intro-bop-target');
        if (bakingIntroActive) item.classList.add('baking-intro-bop');
    }
    bakingBackground.appendChild(item);
}

function bakingCreateItems() {
    const slots = bakingShuffle(BAKING_SLOTS);
    const files = bakingShuffle(BAKING_FILES);
    const renderCount = Math.min(BAKING_RENDER_COUNT, slots.length, files.length);
    for (let i = 0; i < renderCount; i++) { bakingCreateItem(i, files[i], slots[i]); }
}

function bakingCreateExtras() {
    if (!bakingBackground) return;
    for (let i = 0; i < 16; i++) {
        const a = document.createElement('span');
        a.className = 'baking-extra baking-extra-a';
        a.style.left = `${bakingRandom(4, 96)}%`;
        a.style.top = `${bakingRandom(6, 94)}%`;
        a.style.setProperty('--baking-extra-duration', `${bakingRandom(4.2, 8.0)}s`);
        a.style.setProperty('--baking-extra-delay', `${-bakingRandom(0, 8)}s`);
        a.style.setProperty('--baking-extra-scale', bakingRandom(.72, 1.26).toFixed(2));
        bakingBackground.appendChild(a);
    }
    for (let i = 0; i < 10; i++) {
        const b = document.createElement('span');
        b.className = 'baking-extra baking-extra-b';
        b.style.left = `${bakingRandom(4, 96)}%`;
        b.style.top = `${bakingRandom(6, 94)}%`;
        b.style.setProperty('--baking-extra-duration', `${bakingRandom(5.0, 9.0)}s`);
        b.style.setProperty('--baking-extra-delay', `${-bakingRandom(0, 8)}s`);
        b.style.setProperty('--baking-extra-scale', bakingRandom(.78, 1.34).toFixed(2));
        bakingBackground.appendChild(b);
    }
}

function bakingStopIntro({ unlockHover = false } = {}) {
    if (bakingIntroTick !== null) { cancelAnimationFrame(bakingIntroTick); bakingIntroTick = null; }
    if (bakingIntroAudio) {
        try { bakingIntroAudio.pause(); bakingIntroAudio.currentTime = 0; bakingIntroAudio.removeAttribute('src'); bakingIntroAudio.load(); } catch (_) {}
        bakingIntroAudio = null;
    }
    bakingSetIntroBop(false);
    if (unlockHover) bakingHoverUnlocked = true;
}

async function bakingStartIntro() {
    bakingStopIntro();
    bakingHoverUnlocked = false;
    bakingSetIntroBop(true);
    const audio = new Audio();
    audio.preload = 'auto';
    audio.volume = BAKING_INTRO_VOLUME;
    bakingIntroAudio = audio;

    const finishIntro = () => {
        if (bakingIntroAudio !== audio) return;
        try { audio.pause(); audio.volume = 0; } catch (_) {}
        bakingIntroAudio = null;
        bakingIntroTick = null;
        bakingSetIntroBop(false);
        bakingHoverUnlocked = true;
    };

    const updateIntro = () => {
        if (bakingIntroAudio !== audio) return;
        const current = audio.currentTime || 0;
        if (!BAKING_INTRO_FULL && BAKING_INTRO_CUTOFF !== null && current >= BAKING_INTRO_CUTOFF) { finishIntro(); return; }
        if (!BAKING_INTRO_FULL && BAKING_INTRO_FADE_START !== null && BAKING_INTRO_CUTOFF !== null && current >= BAKING_INTRO_FADE_START) {
            const progress = Math.min(1, (current - BAKING_INTRO_FADE_START) / (BAKING_INTRO_CUTOFF - BAKING_INTRO_FADE_START));
            audio.volume = BAKING_INTRO_VOLUME * (1 - progress);
        } else {
            audio.volume = BAKING_INTRO_VOLUME;
        }
        bakingIntroTick = requestAnimationFrame(updateIntro);
    };

    try {
        await bakingLoadAudioFromCandidates(audio, BAKING_INTRO_SOURCES);
        const p = audio.play();
        if (p && typeof p.then === 'function') {
            p.then(() => { if (bakingIntroAudio === audio) bakingIntroTick = requestAnimationFrame(updateIntro); })
             .catch(() => { if (bakingIntroAudio === audio) bakingStopIntro({ unlockHover: true }); });
        } else {
            bakingIntroTick = requestAnimationFrame(updateIntro);
        }
    } catch (_) {
        if (bakingIntroAudio === audio) bakingStopIntro({ unlockHover: true });
    }
}

function bakingStopHoverAudio() {
    if (bakingHoverAudio) {
        try { bakingHoverAudio.pause(); bakingHoverAudio.currentTime = 0; bakingHoverAudio.removeAttribute('src'); bakingHoverAudio.load(); } catch (_) {}
        bakingHoverAudio = null;
    }
}

function bakingPlayHover() {
    if (!bakingHoverUnlocked) return;
    if (!Array.isArray(BAKING_HOVER_SOUNDS) || BAKING_HOVER_SOUNDS.length === 0) return;
    bakingStopHoverAudio();
    const audio = new Audio(BAKING_HOVER_SOUNDS[Math.floor(Math.random() * BAKING_HOVER_SOUNDS.length)]);
    bakingHoverAudio = audio;
    audio.volume = BAKING_HOVER_VOLUME;
    const p = audio.play();
    if (p && typeof p.catch === 'function') p.catch(() => {});
}

function bakingAnimateHover(item) {
    if (!item || typeof item.animate !== 'function') return;
    if (item._bakingHoverAnimation) { try { item._bakingHoverAnimation.cancel(); } catch (_) {} }
    item._bakingHoverAnimation = item.animate([
        { translate: '0 0', rotate: '0deg', scale: '1' },
        { translate: '0 -10px', rotate: '-7deg', scale: '1.09', offset: 0.34 },
        { translate: '0 -4px', rotate: '5deg', scale: '1.04', offset: 0.72 },
        { translate: '0 0', rotate: '0deg', scale: '1' }
    ], { duration: 520, easing: 'ease-out', fill: 'none' });
    item._bakingHoverAnimation.addEventListener('finish', () => { item._bakingHoverAnimation = null; }, { once: true });
}

function bakingInstallHover() {
    bakingHoverHandler = (event) => {
        if (!bakingBackground) return;
        let hit = null;
        for (const item of bakingBackground.querySelectorAll('.baking-item')) {
            const rect = item.getBoundingClientRect();
            if (event.clientX >= rect.left && event.clientX <= rect.right && event.clientY >= rect.top && event.clientY <= rect.bottom) { hit = item; break; }
        }
        if (hit && hit !== bakingHoverLast) {
            bakingHoverLast = hit;
            bakingAnimateHover(hit);
            bakingPlayHover();
        } else if (!hit) {
            bakingHoverLast = null;
        }
    };
    document.addEventListener('mousemove', bakingHoverHandler, { passive: true });
}

function bakingRemoveHover() {
    if (bakingHoverHandler) document.removeEventListener('mousemove', bakingHoverHandler);
    bakingHoverHandler = null;
    bakingHoverLast = null;
    bakingStopHoverAudio();
}

export function mount() {
    if (bakingBackground) return;
    bakingBackground = document.createElement('div');
    bakingBackground.id = 'baking-background';
    bakingBackground.setAttribute('aria-hidden', 'true');
    document.body.appendChild(bakingBackground);
    bakingCreateItems();
    bakingCreateExtras();
    bakingInstallHover();
    bakingStartIntro();
}

export function unmount() {
    bakingStopIntro();
    bakingHoverUnlocked = false;
    bakingRemoveHover();
    if (bakingBackground) { bakingBackground.remove(); bakingBackground = null; }
}
