/* ============================================================
   BATHINGSUIT THEME
   Built from the winter theme's decorative mount/unmount pattern.
   ============================================================ */


let bathingsuitBackground = null;
let bathingsuitHoverHandler = null;
let bathingsuitHoverLast = null;
let bathingsuitHoverAudio = null;
let bathingsuitIntroAudio = null;
let bathingsuitIntroTick = null;
let bathingsuitHoverUnlocked = false;
let bathingsuitIntroActive = false;

const BATHINGSUIT_FILES = [
    "01-brunette-leopard-swimsuit.svg",
    "01-redhead-black-green-floral-swimsuit.svg",
    "02-blonde-red-polka-dot-bow-swimsuit.svg",
    "02-redhead-red-one-piece-swimsuit.svg",
    "03-blonde-blue-polka-dot-two-piece-swimsuit.svg",
    "03-blonde-green-leaf-swimsuit.svg",
    "04-blonde-white-one-piece-swimsuit.svg",
    "04-brunette-black-purple-swimsuit.svg",
    "05-brunette-black-purple-swimsuit-pose-2.svg",
    "05-silver-haired-blue-one-piece-swimsuit.svg",
    "06-brunette-pink-one-piece-swimsuit.svg",
    "06-redhead-black-one-piece-swimsuit.svg",
    "07-blonde-red-plaid-two-piece-swimsuit.svg",
    "07-redhead-green-plaid-two-piece-swimsuit.svg",
    "08-blonde-purple-striped-swimsuit.svg",
    "08-brunette-blue-striped-swimsuit.svg"
];
const BATHINGSUIT_BOP_INDEXES = new Set([0, 2, 5, 8, 11, 14]);
const BATHINGSUIT_HOVER_SOUNDS = [
    "/sounds/winx/cartoon_music-arcade-game-positive-selection-bling-489760.mp3",
    "/sounds/winx/freesound_community-electricity-sound-6066.mp3",
    "/sounds/winx/freesound_community-match-sizzle-02-104778.mp3",
    "/sounds/winx/koiroylers-get-coin-351945.mp3"
];
const BATHINGSUIT_HOVER_VOLUME = 0.42;
const BATHINGSUIT_INTRO_SOURCES = [
    "/sounds/intros/alanajordan-dreamboat-394396-50s2.mp3",
    "/sounds/intros/alanajordan-dreamboat-394396-50s2"
];
const BATHINGSUIT_INTRO_CUTOFF = 40;
const BATHINGSUIT_INTRO_FADE_START = 35;
const BATHINGSUIT_INTRO_VOLUME = 0.34;

function bathingsuitRandom(min, max) { return Math.random() * (max - min) + min; }

function bathingsuitAssetCandidates(file) {
    return [
        "/svg/bathingsuit/{file}",
    "/svg/theme-bathingsuit/{file}",
    "/svg/{file}"
    ].map(path => path.replace('{file}', file));
}

function bathingsuitSetImageSource(img, file) {
    const candidates = bathingsuitAssetCandidates(file);
    let index = 0;
    const tryNext = () => {
        if (index >= candidates.length) { img.onerror = null; return; }
        img.src = candidates[index++];
    };
    img.onerror = tryNext;
    tryNext();
}

function bathingsuitLoadAudioFromCandidates(audio, candidates) {
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

function bathingsuitSetIntroBop(active) {
    bathingsuitIntroActive = active;
    if (!bathingsuitBackground) return;
    for (const item of bathingsuitBackground.querySelectorAll('.bathingsuit-intro-bop-target')) {
        item.classList.toggle('bathingsuit-intro-bop', active);
    }
}

function bathingsuitCreateItem(index, file, slot) {
    if (!bathingsuitBackground) return;
    const item = document.createElement('img');
    item.className = 'bathingsuit-item';
    item.alt = '';
    item.draggable = false;
    item.setAttribute('aria-hidden', 'true');
    bathingsuitSetImageSource(item, file);
    item.style.left = `${slot[0] + bathingsuitRandom(-1.6, 1.6)}%`;
    item.style.top = `${slot[1] + bathingsuitRandom(-1.8, 1.8)}%`;
    item.style.width = `${bathingsuitRandom(82, 128)}px`;
    item.style.setProperty('--bathingsuit-float-x', `${bathingsuitRandom(-14, 14)}px`);
    item.style.setProperty('--bathingsuit-float-y', `${bathingsuitRandom(-17, 17)}px`);
    item.style.setProperty('--bathingsuit-float-r', `${bathingsuitRandom(-8, 8)}deg`);
    item.style.setProperty('--bathingsuit-float-duration', `${bathingsuitRandom(5.9, 9.1)}s`);
    item.style.setProperty('--bathingsuit-float-delay', `${-bathingsuitRandom(0, 8)}s`);
    item.style.setProperty('--bathingsuit-bop-delay', `${-bathingsuitRandom(0, .7)}s`);
    if (BATHINGSUIT_BOP_INDEXES.has(index)) {
        item.classList.add('bathingsuit-intro-bop-target');
        if (bathingsuitIntroActive) item.classList.add('bathingsuit-intro-bop');
    }
    bathingsuitBackground.appendChild(item);
}

function bathingsuitCreateItems() {
    const slots = [[5, 15], [7, 28], [8, 45], [10, 63], [12, 83], [19, 22], [18, 42], [21, 90], [95, 15], [93, 28], [92, 46], [90, 64], [88, 84], [82, 20], [80, 40], [78, 90], [50, 92], [50, 16]].slice();
    const files = BATHINGSUIT_FILES.slice();
    files.forEach((file, index) => bathingsuitCreateItem(index, file, slots[index % slots.length]));
}

function bathingsuitCreateExtras() {
    if (!bathingsuitBackground) return;
    for (let i = 0; i < 28; i++) { const e = document.createElement('span'); e.className = 'bathingsuit-extra'; e.style.left = `${bathingsuitRandom(2, 98)}%`; e.style.bottom = `${bathingsuitRandom(-10, 22)}%`; const size = bathingsuitRandom(6, 18); e.style.width = `${size}px`; e.style.height = `${size}px`; e.style.setProperty('--bathingsuit-extra-x', `${bathingsuitRandom(-18, 18)}px`); e.style.setProperty('--bathingsuit-extra-duration', `${bathingsuitRandom(6.4, 12.8)}s`); e.style.setProperty('--bathingsuit-extra-delay', `${-bathingsuitRandom(0, 10)}s`); bathingsuitBackground.appendChild(e); }
}

function bathingsuitStopIntro({ unlockHover = false } = {}) {
    if (bathingsuitIntroTick !== null) { cancelAnimationFrame(bathingsuitIntroTick); bathingsuitIntroTick = null; }
    if (bathingsuitIntroAudio) {
        try { bathingsuitIntroAudio.pause(); bathingsuitIntroAudio.currentTime = 0; bathingsuitIntroAudio.removeAttribute('src'); bathingsuitIntroAudio.load(); } catch (_) {}
        bathingsuitIntroAudio = null;
    }
    bathingsuitSetIntroBop(false);
    if (unlockHover) bathingsuitHoverUnlocked = true;
}

async function bathingsuitStartIntro() {
    bathingsuitStopIntro();
    bathingsuitHoverUnlocked = false;
    bathingsuitSetIntroBop(true);
    const audio = new Audio();
    audio.preload = 'auto';
    audio.volume = BATHINGSUIT_INTRO_VOLUME;
    bathingsuitIntroAudio = audio;

    const finishIntro = () => {
        if (bathingsuitIntroAudio !== audio) return;
        try { audio.pause(); audio.volume = 0; } catch (_) {}
        bathingsuitIntroAudio = null;
        bathingsuitIntroTick = null;
        bathingsuitSetIntroBop(false);
        bathingsuitHoverUnlocked = true;
    };

    const updateIntro = () => {
        if (bathingsuitIntroAudio !== audio) return;
        const current = audio.currentTime || 0;
        if (current >= BATHINGSUIT_INTRO_CUTOFF) { finishIntro(); return; }
        if (current >= BATHINGSUIT_INTRO_FADE_START) {
            const progress = Math.min(1, (current - BATHINGSUIT_INTRO_FADE_START) / (BATHINGSUIT_INTRO_CUTOFF - BATHINGSUIT_INTRO_FADE_START));
            audio.volume = BATHINGSUIT_INTRO_VOLUME * (1 - progress);
        } else {
            audio.volume = BATHINGSUIT_INTRO_VOLUME;
        }
        bathingsuitIntroTick = requestAnimationFrame(updateIntro);
    };

    try {
        await bathingsuitLoadAudioFromCandidates(audio, BATHINGSUIT_INTRO_SOURCES);
        const p = audio.play();
        if (p && typeof p.then === 'function') {
            p.then(() => { if (bathingsuitIntroAudio === audio) bathingsuitIntroTick = requestAnimationFrame(updateIntro); })
             .catch(() => { if (bathingsuitIntroAudio === audio) bathingsuitStopIntro({ unlockHover: true }); });
        } else {
            bathingsuitIntroTick = requestAnimationFrame(updateIntro);
        }
    } catch (_) {
        if (bathingsuitIntroAudio === audio) bathingsuitStopIntro({ unlockHover: true });
    }
}

function bathingsuitStopHoverAudio() {
    if (bathingsuitHoverAudio) {
        try { bathingsuitHoverAudio.pause(); bathingsuitHoverAudio.currentTime = 0; bathingsuitHoverAudio.removeAttribute('src'); bathingsuitHoverAudio.load(); } catch (_) {}
        bathingsuitHoverAudio = null;
    }
}

function bathingsuitPlayHover() {
    if (!bathingsuitHoverUnlocked) return;
    bathingsuitStopHoverAudio();
    const audio = new Audio(BATHINGSUIT_HOVER_SOUNDS[Math.floor(Math.random() * BATHINGSUIT_HOVER_SOUNDS.length)]);
    bathingsuitHoverAudio = audio;
    audio.volume = BATHINGSUIT_HOVER_VOLUME;
    const p = audio.play();
    if (p && typeof p.catch === 'function') p.catch(() => {});
}

function bathingsuitAnimateHover(item) {
    if (!item || typeof item.animate !== 'function') return;
    if (item._bathingsuitHoverAnimation) { try { item._bathingsuitHoverAnimation.cancel(); } catch (_) {} }
    item._bathingsuitHoverAnimation = item.animate([
        { translate: '0 0', rotate: '0deg', scale: '1' },
        { translate: '0 -10px', rotate: '-8deg', scale: '1.10', offset: .34 },
        { translate: '0 -4px', rotate: '7deg', scale: '1.06', offset: .70 },
        { translate: '0 0', rotate: '0deg', scale: '1' }
    ], { duration: 540, easing: 'ease-out', fill: 'none' });
    item._bathingsuitHoverAnimation.addEventListener('finish', () => { item._bathingsuitHoverAnimation = null; }, { once: true });
}

function bathingsuitInstallHover() {
    bathingsuitHoverHandler = (event) => {
        if (!bathingsuitBackground) return;
        let hit = null;
        for (const item of bathingsuitBackground.querySelectorAll('.bathingsuit-item')) {
            const r = item.getBoundingClientRect();
            if (event.clientX >= r.left && event.clientX <= r.right && event.clientY >= r.top && event.clientY <= r.bottom) { hit = item; break; }
        }
        if (hit && hit !== bathingsuitHoverLast) { bathingsuitHoverLast = hit; bathingsuitAnimateHover(hit); bathingsuitPlayHover(); }
        else if (!hit) { bathingsuitHoverLast = null; }
    };
    document.addEventListener('mousemove', bathingsuitHoverHandler, { passive: true });
}

function bathingsuitRemoveHover() {
    if (bathingsuitHoverHandler) document.removeEventListener('mousemove', bathingsuitHoverHandler);
    bathingsuitHoverHandler = null;
    bathingsuitHoverLast = null;
    bathingsuitStopHoverAudio();
}

export function mount() {
    if (bathingsuitBackground) return;
    bathingsuitBackground = document.createElement('div');
    bathingsuitBackground.id = 'bathingsuit-background';
    bathingsuitBackground.setAttribute('aria-hidden', 'true');
    document.body.appendChild(bathingsuitBackground);
    bathingsuitCreateItems();
    bathingsuitCreateExtras();
    bathingsuitInstallHover();
    bathingsuitStartIntro();
}

export function unmount() {
    bathingsuitStopIntro();
    bathingsuitHoverUnlocked = false;
    bathingsuitRemoveHover();
    if (bathingsuitBackground) { bathingsuitBackground.remove(); bathingsuitBackground = null; }
}
