/* ============================================================
   CAREBEARS THEME
   Built from the winter theme mount/unmount structure.
   ============================================================ */

let carebearsBackground = null;
let carebearsHoverHandler = null;
let carebearsHoverLast = null;
let carebearsHoverAudio = null;
let carebearsIntroAudio = null;
let carebearsIntroTick = null;
let carebearsHoverUnlocked = false;
let carebearsIntroActive = false;

const CAREBEARS_FILES = [
    "carebears-01.svg",
    "carebears-02.svg",
    "carebears-03.svg",
    "carebears-04.svg",
    "carebears-05.svg",
    "carebears-06.svg",
    "carebears-07.svg",
    "carebears-08.svg",
    "carebears-09.svg",
    "carebears-10.svg",
    "carebears-11.svg",
    "carebears-12.svg",
    "carebears-13.svg",
    "carebears-14.svg",
    "carebears-15.svg",
    "carebears-16.svg",
    "carebears-17.svg",
    "carebears-18.svg"
];
const CAREBEARS_SLOTS = [{"x": 8, "y": 14}, {"x": 26, "y": 13}, {"x": 49, "y": 14}, {"x": 72, "y": 13}, {"x": 92, "y": 15}, {"x": 8, "y": 35}, {"x": 25, "y": 34}, {"x": 49, "y": 35}, {"x": 73, "y": 34}, {"x": 92, "y": 35}, {"x": 10, "y": 57}, {"x": 29, "y": 57}, {"x": 49, "y": 56}, {"x": 69, "y": 57}, {"x": 89, "y": 58}, {"x": 12, "y": 82}, {"x": 34, "y": 85}, {"x": 66, "y": 85}, {"x": 88, "y": 82}];
const CAREBEARS_RENDER_COUNT = 16;
const CAREBEARS_BOP_INDEXES = new Set([0, 3, 5, 8, 11, 14]);
const CAREBEARS_HOVER_SOUNDS = [
    "/sounds/winx/cartoon_music-arcade-game-positive-selection-bling-489760.mp3",
    "/sounds/winx/freesound_community-electricity-sound-6066.mp3",
    "/sounds/winx/freesound_community-match-sizzle-02-104778.mp3",
    "/sounds/winx/koiroylers-get-coin-351945.mp3"
];
const CAREBEARS_HOVER_VOLUME = 0.42;
const CAREBEARS_INTRO_SOURCES = [
    "/sounds/intros/slrathna-tuba-parade-585429.mp3"
];
const CAREBEARS_INTRO_FULL = false;
const CAREBEARS_INTRO_CUTOFF = 20;
const CAREBEARS_INTRO_FADE_START = 17;
const CAREBEARS_INTRO_VOLUME = 0.34;

function carebearsRandom(min, max) { return Math.random() * (max - min) + min; }

function carebearsShuffle(arr) {
    const copy = arr.slice();
    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
}

function carebearsAssetCandidates(file) {
    return [
        "/svg/carebears/{file}",
        "/svg/theme-carebears/{file}",
        "/svg/{file}"
    ].map(path => path.replace('{file}', file));
}

function carebearsSetImageSource(img, file) {
    const candidates = carebearsAssetCandidates(file);
    let index = 0;
    const tryNext = () => {
        if (index >= candidates.length) { img.onerror = null; return; }
        img.src = candidates[index++];
    };
    img.onerror = tryNext;
    tryNext();
}

function carebearsLoadAudioFromCandidates(audio, candidates) {
    return new Promise((resolve, reject) => {
        let index = 0;
        const cleanup = () => {
            audio.removeEventListener('loadedmetadata', onLoaded);
            audio.removeEventListener('canplay', onLoaded);
            audio.removeEventListener('error', onError);
            audio.removeEventListener('ended', onEnded);
        };
        const onLoaded = () => { cleanup(); resolve(audio); };
        const onEnded = () => { cleanup(); resolve(audio); };
        const onError = () => {
            if (index >= candidates.length) { cleanup(); reject(new Error('audio-not-found')); return; }
            audio.src = candidates[index++];
            audio.load();
        };
        audio.addEventListener('loadedmetadata', onLoaded);
        audio.addEventListener('canplay', onLoaded);
        audio.addEventListener('error', onError);
        audio.addEventListener('ended', onEnded);
        onError();
    });
}

function carebearsSetIntroBop(active) {
    carebearsIntroActive = active;
    if (!carebearsBackground) return;
    for (const item of carebearsBackground.querySelectorAll('.carebears-intro-bop-target')) {
        item.classList.toggle('carebears-intro-bop', active);
    }
}

function carebearsCreateItem(index, file, slot) {
    if (!carebearsBackground) return;
    const item = document.createElement('img');
    item.className = 'carebears-item';
    item.alt = '';
    item.draggable = false;
    item.setAttribute('aria-hidden', 'true');
    carebearsSetImageSource(item, file);
    item.style.left = `${slot.x + carebearsRandom(-0.8, 0.8)}%`;
    item.style.top = `${slot.y + carebearsRandom(-0.9, 0.9)}%`;
    item.style.width = `${carebearsRandom(84, 118)}px`;
    item.style.zIndex = String(index + 1);
    item.style.setProperty('--carebears-float-x', `${carebearsRandom(-8, 8)}px`);
    item.style.setProperty('--carebears-float-y', `${carebearsRandom(-9, 9)}px`);
    item.style.setProperty('--carebears-float-r', `${carebearsRandom(-5, 5)}deg`);
    item.style.setProperty('--carebears-float-duration', `${carebearsRandom(5.8, 8.9)}s`);
    item.style.setProperty('--carebears-float-delay', `${-carebearsRandom(0, 8)}s`);
    item.style.setProperty('--carebears-bop-delay', `${-carebearsRandom(0, .7)}s`);
    if (CAREBEARS_BOP_INDEXES.has(index)) {
        item.classList.add('carebears-intro-bop-target');
        if (carebearsIntroActive) item.classList.add('carebears-intro-bop');
    }
    carebearsBackground.appendChild(item);
}

function carebearsCreateItems() {
    const slots = carebearsShuffle(CAREBEARS_SLOTS);
    const files = carebearsShuffle(CAREBEARS_FILES);
    const renderCount = Math.min(CAREBEARS_RENDER_COUNT, slots.length, files.length);
    for (let i = 0; i < renderCount; i++) { carebearsCreateItem(i, files[i], slots[i]); }
}

function carebearsCreateExtras() {
    if (!carebearsBackground) return;
    for (let i = 0; i < 20; i++) {
        const a = document.createElement('span');
        a.className = 'carebears-extra carebears-extra-a';
        a.style.left = `${carebearsRandom(3, 97)}%`;
        a.style.top = `${carebearsRandom(5, 95)}%`;
        a.style.setProperty('--carebears-extra-duration', `${carebearsRandom(3.8, 7.2)}s`);
        a.style.setProperty('--carebears-extra-delay', `${-carebearsRandom(0, 8)}s`);
        a.style.setProperty('--carebears-extra-scale', carebearsRandom(.7, 1.3).toFixed(2));
        carebearsBackground.appendChild(a);
    }
    for (let i = 0; i < 10; i++) {
        const b = document.createElement('span');
        b.className = 'carebears-extra carebears-extra-b';
        b.style.left = `${carebearsRandom(4, 96)}%`;
        b.style.top = `${carebearsRandom(6, 94)}%`;
        b.style.setProperty('--carebears-extra-duration', `${carebearsRandom(4.6, 8.8)}s`);
        b.style.setProperty('--carebears-extra-delay', `${-carebearsRandom(0, 8)}s`);
        b.style.setProperty('--carebears-extra-scale', carebearsRandom(.78, 1.32).toFixed(2));
        carebearsBackground.appendChild(b);
    }
}

function carebearsStopIntro({ unlockHover = false } = {}) {
    if (carebearsIntroTick !== null) { cancelAnimationFrame(carebearsIntroTick); carebearsIntroTick = null; }
    if (carebearsIntroAudio) {
        try { carebearsIntroAudio.pause(); carebearsIntroAudio.currentTime = 0; carebearsIntroAudio.removeAttribute('src'); carebearsIntroAudio.load(); } catch (_) {}
        carebearsIntroAudio = null;
    }
    carebearsSetIntroBop(false);
    if (unlockHover) carebearsHoverUnlocked = true;
}

async function carebearsStartIntro() {
    carebearsStopIntro();
    carebearsHoverUnlocked = false;
    carebearsSetIntroBop(true);
    const audio = new Audio();
    audio.preload = 'auto';
    audio.volume = CAREBEARS_INTRO_VOLUME;
    carebearsIntroAudio = audio;

    const finishIntro = () => {
        if (carebearsIntroAudio !== audio) return;
        try { audio.pause(); audio.volume = 0; } catch (_) {}
        carebearsIntroAudio = null;
        carebearsIntroTick = null;
        carebearsSetIntroBop(false);
        carebearsHoverUnlocked = true;
    };

    const updateIntro = () => {
        if (carebearsIntroAudio !== audio) return;
        const current = audio.currentTime || 0;
        if (!CAREBEARS_INTRO_FULL && CAREBEARS_INTRO_CUTOFF !== null && current >= CAREBEARS_INTRO_CUTOFF) { finishIntro(); return; }
        if (!CAREBEARS_INTRO_FULL && CAREBEARS_INTRO_FADE_START !== null && CAREBEARS_INTRO_CUTOFF !== null && current >= CAREBEARS_INTRO_FADE_START) {
            const progress = Math.min(1, (current - CAREBEARS_INTRO_FADE_START) / (CAREBEARS_INTRO_CUTOFF - CAREBEARS_INTRO_FADE_START));
            audio.volume = CAREBEARS_INTRO_VOLUME * (1 - progress);
        } else {
            audio.volume = CAREBEARS_INTRO_VOLUME;
        }
        carebearsIntroTick = requestAnimationFrame(updateIntro);
    };

    try {
        await carebearsLoadAudioFromCandidates(audio, CAREBEARS_INTRO_SOURCES);
        audio.addEventListener('ended', finishIntro, { once: true });
        const p = audio.play();
        if (p && typeof p.then === 'function') {
            p.then(() => { if (carebearsIntroAudio === audio) carebearsIntroTick = requestAnimationFrame(updateIntro); })
             .catch(() => { if (carebearsIntroAudio === audio) carebearsStopIntro({ unlockHover: true }); });
        } else {
            carebearsIntroTick = requestAnimationFrame(updateIntro);
        }
    } catch (_) {
        if (carebearsIntroAudio === audio) carebearsStopIntro({ unlockHover: true });
    }
}

function carebearsStopHoverAudio() {
    if (carebearsHoverAudio) {
        try { carebearsHoverAudio.pause(); carebearsHoverAudio.currentTime = 0; carebearsHoverAudio.removeAttribute('src'); carebearsHoverAudio.load(); } catch (_) {}
        carebearsHoverAudio = null;
    }
}

function carebearsPlayHover() {
    if (!carebearsHoverUnlocked) return;
    if (!Array.isArray(CAREBEARS_HOVER_SOUNDS) || CAREBEARS_HOVER_SOUNDS.length === 0) return;
    carebearsStopHoverAudio();
    const audio = new Audio(CAREBEARS_HOVER_SOUNDS[Math.floor(Math.random() * CAREBEARS_HOVER_SOUNDS.length)]);
    carebearsHoverAudio = audio;
    audio.volume = CAREBEARS_HOVER_VOLUME;
    const p = audio.play();
    if (p && typeof p.catch === 'function') p.catch(() => {});
}

function carebearsAnimateHover(item) {
    if (!item || typeof item.animate !== 'function') return;
    if (item._carebearsHoverAnimation) { try { item._carebearsHoverAnimation.cancel(); } catch (_) {} }
    item._carebearsHoverAnimation = item.animate([
        { translate: '0 0', rotate: '0deg', scale: '1' },
        { translate: '0 -10px', rotate: '-7deg', scale: '1.10', offset: 0.34 },
        { translate: '0 -4px', rotate: '6deg', scale: '1.05', offset: 0.70 },
        { translate: '0 0', rotate: '0deg', scale: '1' }
    ], { duration: 530, easing: 'ease-out', fill: 'none' });
    item._carebearsHoverAnimation.addEventListener('finish', () => { item._carebearsHoverAnimation = null; }, { once: true });
}

function carebearsInstallHover() {
    carebearsHoverHandler = (event) => {
        if (!carebearsBackground) return;
        let hit = null;
        for (const item of carebearsBackground.querySelectorAll('.carebears-item')) {
            const r = item.getBoundingClientRect();
            if (event.clientX >= r.left && event.clientX <= r.right && event.clientY >= r.top && event.clientY <= r.bottom) { hit = item; break; }
        }
        if (hit && hit !== carebearsHoverLast) { carebearsHoverLast = hit; carebearsAnimateHover(hit); carebearsPlayHover(); }
        else if (!hit) { carebearsHoverLast = null; }
    };
    document.addEventListener('mousemove', carebearsHoverHandler, { passive: true });
}

function carebearsRemoveHover() {
    if (carebearsHoverHandler) document.removeEventListener('mousemove', carebearsHoverHandler);
    carebearsHoverHandler = null;
    carebearsHoverLast = null;
    carebearsStopHoverAudio();
}

export function mount() {
    if (carebearsBackground) return;
    carebearsBackground = document.createElement('div');
    carebearsBackground.id = 'carebears-background';
    carebearsBackground.setAttribute('aria-hidden', 'true');
    document.body.appendChild(carebearsBackground);
    carebearsCreateItems();
    carebearsCreateExtras();
    carebearsInstallHover();
    carebearsStartIntro();
}

export function unmount() {
    carebearsStopIntro({ unlockHover: false });
    carebearsHoverUnlocked = false;
    carebearsRemoveHover();
    if (carebearsBackground) { carebearsBackground.remove(); carebearsBackground = null; }
}
