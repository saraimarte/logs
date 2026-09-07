/* ============================================================
   PINKPANTHER THEME
   Built from the winter theme's decorative mount/unmount pattern.
   ============================================================ */

let pinkpantherBackground = null;
let pinkpantherHoverHandler = null;
let pinkpantherHoverLast = null;
let pinkpantherHoverAudio = null;
let pinkpantherIntroAudio = null;
let pinkpantherIntroTick = null;
let pinkpantherHoverUnlocked = false;
let pinkpantherIntroActive = false;

const PINKPANTHER_FILES = [
    "pink-panther-blushing-cheeks.svg",
"pink-panther-cake-wink.svg",
"pink-panther-crystal-ball.svg",
"pink-panther-cupcake-side.svg",
"pink-panther-diamond-surprised.svg",
"pink-panther-excited-speech.svg",
"pink-panther-flag.svg",
"pink-panther-flower-bouquet.svg",
"pink-panther-heart-book.svg",
"pink-panther-heart-speech-bubble.svg",
"pink-panther-holding-hearts.svg",
"pink-panther-ice-cream-cones.svg",
"pink-panther-magnifying-glass.svg",
"pink-panther-map-compass-aviator.svg",
"pink-panther-paint-palette.svg",
"pink-panther-puzzle-heart.svg",
"pink-panther-wink-heart.svg",
"pink-panther-wink-hearts.svg"
];
const PINKPANTHER_SLOTS = [[7, 14], [9, 32], [10, 50], [11, 68], [13, 87], [93, 14], [91, 32], [90, 50], [89, 68], [87, 87], [23, 20], [77, 20], [26, 91], [50, 94]];
const PINKPANTHER_BOP_INDEXES = new Set([0, 3, 6, 9, 12, 15]);
const PINKPANTHER_HOVER_SOUNDS = [
    "/sounds/winx/cartoon_music-arcade-game-positive-selection-bling-489760.mp3",
"/sounds/winx/freesound_community-electricity-sound-6066.mp3",
"/sounds/winx/freesound_community-match-sizzle-02-104778.mp3",
"/sounds/winx/koiroylers-get-coin-351945.mp3"
];
const PINKPANTHER_HOVER_VOLUME = 0.42;
const PINKPANTHER_INTRO_SOURCES = [
    "/sounds/intros/elijah_k-whats-going-on-272859.mp3",
"/sounds/intros/elijah_k-whats-going-on-272859"
];
const PINKPANTHER_INTRO_CUTOFF = 20;
const PINKPANTHER_INTRO_FADE_START = 15;
const PINKPANTHER_INTRO_VOLUME = 0.34;
const PINKPANTHER_RENDER_COUNT = 14;

function pinkpantherRandom(min, max) { return Math.random() * (max - min) + min; }

function pinkpantherShuffle(arr) {
    const copy = arr.slice();
    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
}

function pinkpantherAssetCandidates(file) {
    return [
        "/svg/theme-pinkpanther/{file}",
    "/svg/pinkpanther/{file}",
    "/svg/{file}"
    ].map(path => path.replace('{file}', file));
}

function pinkpantherSetImageSource(img, file) {
    const candidates = pinkpantherAssetCandidates(file);
    let index = 0;
    const tryNext = () => {
        if (index >= candidates.length) { img.onerror = null; return; }
        img.src = candidates[index++];
    };
    img.onerror = tryNext;
    tryNext();
}

function pinkpantherLoadAudioFromCandidates(audio, candidates) {
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

function pinkpantherSetIntroBop(active) {
    pinkpantherIntroActive = active;
    if (!pinkpantherBackground) return;
    for (const item of pinkpantherBackground.querySelectorAll('.pinkpanther-intro-bop-target')) {
        item.classList.toggle('pinkpanther-intro-bop', active);
    }
}

function pinkpantherCreateItem(index, file, slot) {
    if (!pinkpantherBackground) return;
    const item = document.createElement('img');
    item.className = 'pinkpanther-item';
    item.alt = '';
    item.draggable = false;
    item.setAttribute('aria-hidden', 'true');
    pinkpantherSetImageSource(item, file);
    item.style.left = `${slot[0] + pinkpantherRandom(-0.0, 0.0)}%`;
    item.style.top = `${slot[1] + pinkpantherRandom(-0.0, 0.0)}%`;
    item.style.width = `${pinkpantherRandom(84, 120)}px`;
    item.style.zIndex = String(index + 1);
    item.style.setProperty('--pinkpanther-float-x', `${pinkpantherRandom(-8, 8)}px`);
    item.style.setProperty('--pinkpanther-float-y', `${pinkpantherRandom(-10, 10)}px`);
    item.style.setProperty('--pinkpanther-float-r', `${pinkpantherRandom(-5, 5)}deg`);
    item.style.setProperty('--pinkpanther-float-duration', `${pinkpantherRandom(5.8, 9.2)}s`);
    item.style.setProperty('--pinkpanther-float-delay', `${-pinkpantherRandom(0, 8)}s`);
    item.style.setProperty('--pinkpanther-bop-delay', `${-pinkpantherRandom(0, 0.7)}s`);
    if (PINKPANTHER_BOP_INDEXES.has(index)) {
        item.classList.add('pinkpanther-intro-bop-target');
        if (pinkpantherIntroActive) item.classList.add('pinkpanther-intro-bop');
    }
    pinkpantherBackground.appendChild(item);
}

function pinkpantherCreateItems() {
    const slots = PINKPANTHER_SLOTS.slice();
const files = pinkpantherShuffle(PINKPANTHER_FILES);
    const renderCount = Math.min(PINKPANTHER_RENDER_COUNT, slots.length, files.length);
    for (let i = 0; i < renderCount; i++) {
        pinkpantherCreateItem(i, files[i], slots[i]);
    }
}

function pinkpantherCreateExtras() {
    if (!pinkpantherBackground) return;
    for (let i = 0; i < 18; i++) {
    const heart = document.createElement('span');
    heart.className = 'pinkpanther-extra pinkpanther-heart';
    heart.style.left = `${pinkpantherRandom(4, 96)}%`;
    heart.style.top = `${pinkpantherRandom(6, 94)}%`;
    heart.style.setProperty('--pinkpanther-extra-duration', `${pinkpantherRandom(4.0, 7.8)}s`);
    heart.style.setProperty('--pinkpanther-extra-delay', `${-pinkpantherRandom(0, 7)}s`);
    pinkpantherBackground.appendChild(heart);
}
}

function pinkpantherStopIntro({ unlockHover = false } = {}) {
    if (pinkpantherIntroTick !== null) { cancelAnimationFrame(pinkpantherIntroTick); pinkpantherIntroTick = null; }
    if (pinkpantherIntroAudio) {
        try { pinkpantherIntroAudio.pause(); pinkpantherIntroAudio.currentTime = 0; pinkpantherIntroAudio.removeAttribute('src'); pinkpantherIntroAudio.load(); } catch (_) {}
        pinkpantherIntroAudio = null;
    }
    pinkpantherSetIntroBop(false);
    if (unlockHover) pinkpantherHoverUnlocked = true;
}

async function pinkpantherStartIntro() {
    pinkpantherStopIntro();
    pinkpantherHoverUnlocked = false;
    pinkpantherSetIntroBop(true);
    const audio = new Audio();
    audio.preload = 'auto';
    audio.volume = PINKPANTHER_INTRO_VOLUME;
    pinkpantherIntroAudio = audio;

    const finishIntro = () => {
        if (pinkpantherIntroAudio !== audio) return;
        try { audio.pause(); audio.volume = 0; } catch (_) {}
        pinkpantherIntroAudio = null;
        pinkpantherIntroTick = null;
        pinkpantherSetIntroBop(false);
        pinkpantherHoverUnlocked = true;
    };

    const updateIntro = () => {
        if (pinkpantherIntroAudio !== audio) return;
        const current = audio.currentTime || 0;
        if (current >= PINKPANTHER_INTRO_CUTOFF) { finishIntro(); return; }
        if (current >= PINKPANTHER_INTRO_FADE_START) {
            const progress = Math.min(1, (current - PINKPANTHER_INTRO_FADE_START) / (PINKPANTHER_INTRO_CUTOFF - PINKPANTHER_INTRO_FADE_START));
            audio.volume = PINKPANTHER_INTRO_VOLUME * (1 - progress);
        } else {
            audio.volume = PINKPANTHER_INTRO_VOLUME;
        }
        pinkpantherIntroTick = requestAnimationFrame(updateIntro);
    };

    try {
        await pinkpantherLoadAudioFromCandidates(audio, PINKPANTHER_INTRO_SOURCES);
        const p = audio.play();
        if (p && typeof p.then === 'function') {
            p.then(() => { if (pinkpantherIntroAudio === audio) pinkpantherIntroTick = requestAnimationFrame(updateIntro); })
             .catch(() => { if (pinkpantherIntroAudio === audio) pinkpantherStopIntro({ unlockHover: true }); });
        } else {
            pinkpantherIntroTick = requestAnimationFrame(updateIntro);
        }
    } catch (_) {
        if (pinkpantherIntroAudio === audio) pinkpantherStopIntro({ unlockHover: true });
    }
}

function pinkpantherStopHoverAudio() {
    if (pinkpantherHoverAudio) {
        try { pinkpantherHoverAudio.pause(); pinkpantherHoverAudio.currentTime = 0; pinkpantherHoverAudio.removeAttribute('src'); pinkpantherHoverAudio.load(); } catch (_) {}
        pinkpantherHoverAudio = null;
    }
}

function pinkpantherPlayHover() {
    if (!pinkpantherHoverUnlocked) return;
    pinkpantherStopHoverAudio();
    const audio = new Audio(PINKPANTHER_HOVER_SOUNDS[Math.floor(Math.random() * PINKPANTHER_HOVER_SOUNDS.length)]);
    pinkpantherHoverAudio = audio;
    audio.volume = PINKPANTHER_HOVER_VOLUME;
    const p = audio.play();
    if (p && typeof p.catch === 'function') p.catch(() => {});
}

function pinkpantherAnimateHover(item) {
    if (!item || typeof item.animate !== 'function') return;
    if (item._pinkpantherHoverAnimation) { try { item._pinkpantherHoverAnimation.cancel(); } catch (_) {} }
    item._pinkpantherHoverAnimation = item.animate([
        { translate: '0 0', rotate: '0deg', scale: '1' },
        { translate: '0 -10px', rotate: '-8deg', scale: '1.10', offset: 0.34 },
        { translate: '0 -4px', rotate: '7deg', scale: '1.06', offset: 0.70 },
        { translate: '0 0', rotate: '0deg', scale: '1' }
    ], { duration: 540, easing: 'ease-out', fill: 'none' });
    item._pinkpantherHoverAnimation.addEventListener('finish', () => { item._pinkpantherHoverAnimation = null; }, { once: true });
}

function pinkpantherInstallHover() {
    pinkpantherHoverHandler = (event) => {
        if (!pinkpantherBackground) return;
        let hit = null;
        for (const item of pinkpantherBackground.querySelectorAll('.pinkpanther-item')) {
            const r = item.getBoundingClientRect();
            if (event.clientX >= r.left && event.clientX <= r.right && event.clientY >= r.top && event.clientY <= r.bottom) { hit = item; break; }
        }
        if (hit && hit !== pinkpantherHoverLast) { pinkpantherHoverLast = hit; pinkpantherAnimateHover(hit); pinkpantherPlayHover(); }
        else if (!hit) { pinkpantherHoverLast = null; }
    };
    document.addEventListener('mousemove', pinkpantherHoverHandler, { passive: true });
}

function pinkpantherRemoveHover() {
    if (pinkpantherHoverHandler) document.removeEventListener('mousemove', pinkpantherHoverHandler);
    pinkpantherHoverHandler = null;
    pinkpantherHoverLast = null;
    pinkpantherStopHoverAudio();
}

export function mount() {
    if (pinkpantherBackground) return;
    pinkpantherBackground = document.createElement('div');
    pinkpantherBackground.id = 'pinkpanther-background';
    pinkpantherBackground.setAttribute('aria-hidden', 'true');
    document.body.appendChild(pinkpantherBackground);
    pinkpantherCreateItems();
    pinkpantherCreateExtras();
    pinkpantherInstallHover();
    pinkpantherStartIntro();
}

export function unmount() {
    pinkpantherStopIntro();
    pinkpantherHoverUnlocked = false;
    pinkpantherRemoveHover();
    if (pinkpantherBackground) { pinkpantherBackground.remove(); pinkpantherBackground = null; }
}
