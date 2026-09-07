/* ============================================================
   ELLO THEME
   Built from the winter theme's decorative mount/unmount pattern.
   ============================================================ */

let elloBackground = null;
let elloHoverHandler = null;
let elloHoverLast = null;
let elloHoverAudio = null;
let elloIntroAudio = null;
let elloIntroTick = null;
let elloHoverUnlocked = false;
let elloIntroActive = false;

const ELLO_FILES = [
    "theme-ello-01.svg",
    "theme-ello-02.svg",
    "theme-ello-03.svg",
    "theme-ello-04.svg",
    "theme-ello-05.svg",
    "theme-ello-06.svg",
    "theme-ello-07.svg",
    "theme-ello-08.svg",
    "theme-ello-09.svg",
    "theme-ello-10.svg",
    "theme-ello-11.svg",
    "theme-ello-12.svg"
];
const ELLO_SLOTS = [{"x": 9, "y": 18, "min": 172, "max": 202}, {"x": 10, "y": 42, "min": 168, "max": 198}, {"x": 12, "y": 69, "min": 166, "max": 194}, {"x": 25, "y": 89, "min": 172, "max": 204}, {"x": 42, "y": 90, "min": 176, "max": 208}, {"x": 59, "y": 90, "min": 176, "max": 208}, {"x": 76, "y": 89, "min": 172, "max": 204}, {"x": 89, "y": 18, "min": 172, "max": 202}, {"x": 90, "y": 42, "min": 168, "max": 198}, {"x": 88, "y": 69, "min": 166, "max": 194}];
const ELLO_BOP_INDEXES = new Set([0, 2, 5, 7]);
const ELLO_HOVER_SOUNDS = [
    "/sounds/winx/cartoon_music-arcade-game-positive-selection-bling-489760.mp3",
    "/sounds/winx/freesound_community-electricity-sound-6066.mp3",
    "/sounds/winx/freesound_community-match-sizzle-02-104778.mp3",
    "/sounds/winx/koiroylers-get-coin-351945.mp3"
];
const ELLO_HOVER_VOLUME = 0.4;
const ELLO_INTRO_SOURCES = [
    "/sounds/intros/jonasblakewood-rock-fun-573471.mp3",
    "/sounds/intros/jonasblakewood-rock-fun-573471"
];
const ELLO_INTRO_CUTOFF = 20;
const ELLO_INTRO_FADE_START = 17;
const ELLO_INTRO_VOLUME = 0.34;
const ELLO_RENDER_COUNT = 10;

function elloRandom(min, max) { return Math.random() * (max - min) + min; }

function elloShuffle(arr) {
    const copy = arr.slice();
    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
}

function elloAssetCandidates(file) {
    return [
        "/svg/theme-ello/{file}",
        "/svg/ello/{file}",
        "/svg/{file}"
    ].map(path => path.replace('{file}', file));
}

function elloSetImageSource(img, file) {
    const candidates = elloAssetCandidates(file);
    let index = 0;
    const tryNext = () => {
        if (index >= candidates.length) { img.onerror = null; return; }
        img.src = candidates[index++];
    };
    img.onerror = tryNext;
    tryNext();
}

function elloLoadAudioFromCandidates(audio, candidates) {
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

function elloSetIntroBop(active) {
    elloIntroActive = active;
    if (!elloBackground) return;
    for (const item of elloBackground.querySelectorAll('.ello-intro-bop-target')) {
        item.classList.toggle('ello-intro-bop', active);
    }
}

function elloCreateItem(index, file, slot) {
    if (!elloBackground) return;
    const item = document.createElement('img');
    item.className = 'ello-item';
    item.alt = '';
    item.draggable = false;
    item.setAttribute('aria-hidden', 'true');
    elloSetImageSource(item, file);
    item.style.left = `${slot.x + elloRandom(-0.65, 0.65)}%`;
    item.style.top = `${slot.y + elloRandom(-0.65, 0.65)}%`;
    item.style.width = `${elloRandom(slot.min, slot.max)}px`;
    item.style.zIndex = String(index + 1);
    item.style.setProperty('--ello-float-x', `${elloRandom(-6, 6)}px`);
    item.style.setProperty('--ello-float-y', `${elloRandom(-7, 7)}px`);
    item.style.setProperty('--ello-float-r', `${elloRandom(-4, 4)}deg`);
    item.style.setProperty('--ello-float-duration', `${elloRandom(5.8, 9.2)}s`);
    item.style.setProperty('--ello-float-delay', `${-elloRandom(0, 8)}s`);
    item.style.setProperty('--ello-bop-delay', `${-elloRandom(0, .7)}s`);
    if (ELLO_BOP_INDEXES.has(index)) {
        item.classList.add('ello-intro-bop-target');
        if (elloIntroActive) item.classList.add('ello-intro-bop');
    }
    elloBackground.appendChild(item);
}

function elloCreateItems() {
    const slots = elloShuffle(ELLO_SLOTS);
    const files = elloShuffle(ELLO_FILES);
    const renderCount = Math.min(ELLO_RENDER_COUNT, slots.length, files.length);
    for (let i = 0; i < renderCount; i++) {
        elloCreateItem(i, files[i], slots[i]);
    }
}

function elloCreateExtras() {
    if (!elloBackground) return;
    for (let i = 0; i < 20; i++) {
        const extra = document.createElement('span');
        extra.className = 'ello-extra ello-extra-a';
        extra.style.left = `${elloRandom(3, 97)}%`;
        extra.style.top = `${elloRandom(5, 95)}%`;
        extra.style.setProperty('--ello-extra-duration', `${elloRandom(3.6, 7.0)}s`);
        extra.style.setProperty('--ello-extra-delay', `${-elloRandom(0, 7)}s`);
        extra.style.setProperty('--ello-extra-scale', elloRandom(.7, 1.35).toFixed(2));
        elloBackground.appendChild(extra);
    }
    for (let i = 0; i < 10; i++) {
        const extra = document.createElement('span');
        extra.className = 'ello-extra ello-extra-b';
        extra.style.left = `${elloRandom(4, 96)}%`;
        extra.style.top = `${elloRandom(8, 92)}%`;
        extra.style.setProperty('--ello-extra-duration', `${elloRandom(5.2, 9.2)}s`);
        extra.style.setProperty('--ello-extra-delay', `${-elloRandom(0, 8)}s`);
        extra.style.setProperty('--ello-extra-scale', elloRandom(.78, 1.32).toFixed(2));
        elloBackground.appendChild(extra);
    }
}

function elloStopIntro({ unlockHover = false } = {}) {
    if (elloIntroTick !== null) { cancelAnimationFrame(elloIntroTick); elloIntroTick = null; }
    if (elloIntroAudio) {
        try { elloIntroAudio.pause(); elloIntroAudio.currentTime = 0; elloIntroAudio.removeAttribute('src'); elloIntroAudio.load(); } catch (_) {}
        elloIntroAudio = null;
    }
    elloSetIntroBop(false);
    if (unlockHover) elloHoverUnlocked = true;
}

async function elloStartIntro() {
    elloStopIntro();
    elloHoverUnlocked = false;
    elloSetIntroBop(true);
    const audio = new Audio();
    audio.preload = 'auto';
    audio.volume = ELLO_INTRO_VOLUME;
    elloIntroAudio = audio;

    const finishIntro = () => {
        if (elloIntroAudio !== audio) return;
        try { audio.pause(); audio.volume = 0; } catch (_) {}
        elloIntroAudio = null;
        elloIntroTick = null;
        elloSetIntroBop(false);
        elloHoverUnlocked = true;
    };

    const updateIntro = () => {
        if (elloIntroAudio !== audio) return;
        const current = audio.currentTime || 0;
        if (current >= ELLO_INTRO_CUTOFF) { finishIntro(); return; }
        if (current >= ELLO_INTRO_FADE_START) {
            const progress = Math.min(1, (current - ELLO_INTRO_FADE_START) / (ELLO_INTRO_CUTOFF - ELLO_INTRO_FADE_START));
            audio.volume = ELLO_INTRO_VOLUME * (1 - progress);
        } else {
            audio.volume = ELLO_INTRO_VOLUME;
        }
        elloIntroTick = requestAnimationFrame(updateIntro);
    };

    try {
        await elloLoadAudioFromCandidates(audio, ELLO_INTRO_SOURCES);
        const p = audio.play();
        if (p && typeof p.then === 'function') {
            p.then(() => { if (elloIntroAudio === audio) elloIntroTick = requestAnimationFrame(updateIntro); })
             .catch(() => { if (elloIntroAudio === audio) elloStopIntro({ unlockHover: true }); });
        } else {
            elloIntroTick = requestAnimationFrame(updateIntro);
        }
    } catch (_) {
        if (elloIntroAudio === audio) elloStopIntro({ unlockHover: true });
    }
}

function elloStopHoverAudio() {
    if (elloHoverAudio) {
        try { elloHoverAudio.pause(); elloHoverAudio.currentTime = 0; elloHoverAudio.removeAttribute('src'); elloHoverAudio.load(); } catch (_) {}
        elloHoverAudio = null;
    }
}

function elloPlayHover() {
    if (!elloHoverUnlocked) return;
    elloStopHoverAudio();
    const audio = new Audio(ELLO_HOVER_SOUNDS[Math.floor(Math.random() * ELLO_HOVER_SOUNDS.length)]);
    elloHoverAudio = audio;
    audio.volume = ELLO_HOVER_VOLUME;
    const p = audio.play();
    if (p && typeof p.catch === 'function') p.catch(() => {});
}

function elloAnimateHover(item) {
    if (!item || typeof item.animate !== 'function') return;
    if (item._elloHoverAnimation) { try { item._elloHoverAnimation.cancel(); } catch (_) {} }
    item._elloHoverAnimation = item.animate([
        { translate: '0 0', rotate: '0deg', scale: '1' },
        { translate: '0 -10px', rotate: '-7deg', scale: '1.10', offset: 0.34 },
        { translate: '0 -4px', rotate: '6deg', scale: '1.05', offset: 0.70 },
        { translate: '0 0', rotate: '0deg', scale: '1' }
    ], { duration: 530, easing: 'ease-out', fill: 'none' });
    item._elloHoverAnimation.addEventListener('finish', () => { item._elloHoverAnimation = null; }, { once: true });
}

function elloInstallHover() {
    elloHoverHandler = (event) => {
        if (!elloBackground) return;
        let hit = null;
        for (const item of elloBackground.querySelectorAll('.ello-item')) {
            const r = item.getBoundingClientRect();
            if (event.clientX >= r.left && event.clientX <= r.right && event.clientY >= r.top && event.clientY <= r.bottom) { hit = item; break; }
        }
        if (hit && hit !== elloHoverLast) { elloHoverLast = hit; elloAnimateHover(hit); elloPlayHover(); }
        else if (!hit) { elloHoverLast = null; }
    };
    document.addEventListener('mousemove', elloHoverHandler, { passive: true });
}

function elloRemoveHover() {
    if (elloHoverHandler) document.removeEventListener('mousemove', elloHoverHandler);
    elloHoverHandler = null;
    elloHoverLast = null;
    elloStopHoverAudio();
}

export function mount() {
    if (elloBackground) return;
    elloBackground = document.createElement('div');
    elloBackground.id = 'ello-background';
    elloBackground.setAttribute('aria-hidden', 'true');
    document.body.appendChild(elloBackground);
    elloCreateItems();
    elloCreateExtras();
    elloInstallHover();
    elloStartIntro();
}

export function unmount() {
    elloStopIntro();
    elloHoverUnlocked = false;
    elloRemoveHover();
    if (elloBackground) {
        elloBackground.remove();
        elloBackground = null;
    }
}
