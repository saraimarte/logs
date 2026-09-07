/* ============================================================
   CLOWNS THEME
   Built from the winter theme's decorative mount/unmount pattern.
   ============================================================ */

let clownsBackground = null;
let clownsHoverHandler = null;
let clownsHoverLast = null;
let clownsHoverAudio = null;
let clownsIntroAudio = null;
let clownsIntroTick = null;
let clownsHoverUnlocked = false;
let clownsIntroActive = false;

const CLOWNS_FILES = [
    "theme-clown-01.svg",
    "theme-clown-02.svg",
    "theme-clown-03.svg",
    "theme-clown-04.svg",
    "theme-clown-05.svg",
    "theme-clown-06.svg",
    "theme-clown-07.svg",
    "theme-clown-08.svg",
    "theme-clown-09.svg",
    "clown-11.svg",
    "clown-12.svg",
    "clown-13.svg",
    "clown-14.svg",
    "clown-15.svg",
    "clown-16.svg",
    "clown-17.svg",
    "clown-18.svg",
    "clown-19.svg"
];
const CLOWNS_BOP_INDEXES = new Set([0, 2, 4, 7, 10, 13, 16]);
const CLOWNS_HOVER_SOUNDS = [
    "/sounds/clowns/freesound_community-evil-laugh-89423.mp3",
    "/sounds/clowns/freesound_community-evil-laugh-89423",
    "/sounds/clowns/universfield-mischievous-laugh-140131.mp3",
    "/sounds/clowns/universfield-mischievous-laugh-140131"
];
const CLOWNS_HOVER_VOLUME = 0.42;
const CLOWNS_INTRO_SOURCES = [
    "/sounds/intros/top_sue-dark-circus-480944.mp3",
    "/sounds/intros/top_sue-dark-circus-480944"
];
const CLOWNS_INTRO_CUTOFF = 41;
const CLOWNS_INTRO_FADE_START = 38;
const CLOWNS_INTRO_VOLUME = 0.52;

function clownsRandom(min, max) { return Math.random() * (max - min) + min; }

function clownsAssetCandidates(file) {
    return [
    "/svg/theme-clowns/{file}",
    "/svg/clowns/{file}",
    "/svg/theme-clown/{file}",
    "/svg/{file}"
].map(path => path.replace('{file}', file));
}

function clownsSetImageSource(img, file) {
    const candidates = clownsAssetCandidates(file);
    let index = 0;
    const tryNext = () => {
        if (index >= candidates.length) { img.onerror = null; return; }
        img.src = candidates[index++];
    };
    img.onerror = tryNext;
    tryNext();
}

function clownsLoadAudioFromCandidates(audio, candidates) {
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

function clownsSetIntroBop(active) {
    clownsIntroActive = active;
    if (!clownsBackground) return;
    for (const item of clownsBackground.querySelectorAll('.clowns-intro-bop-target')) {
        item.classList.toggle('clowns-intro-bop', active);
    }
}

function clownsCreateItem(index, file, slot) {
    if (!clownsBackground) return;
    const item = document.createElement('img');
    item.className = 'clowns-item';
    item.alt = '';
    item.draggable = false;
    item.setAttribute('aria-hidden', 'true');
    clownsSetImageSource(item, file);
    item.style.left = `${slot[0] + clownsRandom(-1.6, 1.6)}%`;
    item.style.top = `${slot[1] + clownsRandom(-1.8, 1.8)}%`;
    item.style.width = `${clownsRandom(118, 184)}px`;
    item.style.setProperty('--clowns-float-x', `${clownsRandom(-14, 14)}px`);
    item.style.setProperty('--clowns-float-y', `${clownsRandom(-17, 17)}px`);
    item.style.setProperty('--clowns-float-r', `${clownsRandom(-8, 8)}deg`);
    item.style.setProperty('--clowns-float-duration', `${clownsRandom(6.1, 10.1)}s`);
    item.style.setProperty('--clowns-float-delay', `${-clownsRandom(0, 8)}s`);
    item.style.setProperty('--clowns-bop-delay', `${-clownsRandom(0, .7)}s`);
    if (CLOWNS_BOP_INDEXES.has(index)) {
        item.classList.add('clowns-intro-bop-target');
        if (clownsIntroActive) item.classList.add('clowns-intro-bop');
    }
    clownsBackground.appendChild(item);
}


function clownsCreateItems() {
    const slots = [[4, 13], [6, 25], [7, 39], [8, 54], [9, 69], [10, 84], [18, 18], [17, 35], [19, 55], [21, 90], [96, 12], [94, 25], [93, 39], [92, 54], [91, 69], [89, 84], [82, 18], [80, 37], [78, 58], [76, 90]].slice();
    const files = CLOWNS_FILES.slice();
    
    files.forEach((file, index) => clownsCreateItem(index, file, slots[index % slots.length]));
}


function clownsCreateExtras() {
    if (!clownsBackground) return;
    for (let i = 0; i < 28; i++) { const e = document.createElement('span'); e.className = 'clowns-extra'; e.style.left = `${clownsRandom(2, 98)}%`; e.style.top = `${clownsRandom(4, 96)}%`; e.style.width = `${clownsRandom(8, 18)}px`; e.style.height = `${clownsRandom(4, 10)}px`; e.style.setProperty('--clowns-extra-x', `${clownsRandom(-20, 20)}px`); e.style.setProperty('--clowns-extra-y', `${clownsRandom(-16, 16)}px`); e.style.setProperty('--clowns-extra-r', `${clownsRandom(-35, 35)}deg`); e.style.setProperty('--clowns-extra-duration', `${clownsRandom(4.5, 8.5)}s`); e.style.setProperty('--clowns-extra-delay', `${-clownsRandom(0, 8)}s`); e.style.setProperty('--clowns-extra-hue', `${clownsRandom(0, 360).toFixed(0)}deg`); clownsBackground.appendChild(e); }
}

function clownsStopIntro({ unlockHover = false } = {}) {
    if (clownsIntroTick !== null) { cancelAnimationFrame(clownsIntroTick); clownsIntroTick = null; }
    if (clownsIntroAudio) {
        try { clownsIntroAudio.pause(); clownsIntroAudio.currentTime = 0; clownsIntroAudio.removeAttribute('src'); clownsIntroAudio.load(); } catch (_) {}
        clownsIntroAudio = null;
    }
    clownsSetIntroBop(false);
    if (unlockHover) clownsHoverUnlocked = true;
}

async function clownsStartIntro() {
    clownsStopIntro();
    clownsHoverUnlocked = false;
    clownsSetIntroBop(true);
    const audio = new Audio();
    audio.preload = 'auto';
    audio.volume = CLOWNS_INTRO_VOLUME;
    clownsIntroAudio = audio;

    const finishIntro = () => {
        if (clownsIntroAudio !== audio) return;
        try { audio.pause(); audio.volume = 0; } catch (_) {}
        clownsIntroAudio = null;
        clownsIntroTick = null;
        clownsSetIntroBop(false);
        clownsHoverUnlocked = true;
    };

    const updateIntro = () => {
        if (clownsIntroAudio !== audio) return;
        const current = audio.currentTime || 0;
        if (current >= CLOWNS_INTRO_CUTOFF) { finishIntro(); return; }
        if (current >= CLOWNS_INTRO_FADE_START) {
            const progress = Math.min(1, (current - CLOWNS_INTRO_FADE_START) / (CLOWNS_INTRO_CUTOFF - CLOWNS_INTRO_FADE_START));
            audio.volume = CLOWNS_INTRO_VOLUME * (1 - progress);
        } else {
            audio.volume = CLOWNS_INTRO_VOLUME;
        }
        clownsIntroTick = requestAnimationFrame(updateIntro);
    };

    try {
        await clownsLoadAudioFromCandidates(audio, CLOWNS_INTRO_SOURCES);
        const p = audio.play();
        if (p && typeof p.then === 'function') {
            p.then(() => { if (clownsIntroAudio === audio) clownsIntroTick = requestAnimationFrame(updateIntro); })
             .catch(() => { if (clownsIntroAudio === audio) clownsStopIntro({ unlockHover: true }); });
        } else {
            clownsIntroTick = requestAnimationFrame(updateIntro);
        }
    } catch (_) {
        if (clownsIntroAudio === audio) clownsStopIntro({ unlockHover: true });
    }
}

function clownsStopHoverAudio() {
    if (clownsHoverAudio) {
        try { clownsHoverAudio.pause(); clownsHoverAudio.currentTime = 0; clownsHoverAudio.removeAttribute('src'); clownsHoverAudio.load(); } catch (_) {}
        clownsHoverAudio = null;
    }
}


async function clownsPlayHover() {
    if (!clownsHoverUnlocked) return;
    clownsStopHoverAudio();
    const pairs = [[CLOWNS_HOVER_SOUNDS[0], CLOWNS_HOVER_SOUNDS[1]], [CLOWNS_HOVER_SOUNDS[2], CLOWNS_HOVER_SOUNDS[3]]];
    const pair = pairs[Math.floor(Math.random() * pairs.length)];
    const audio = new Audio();
    clownsHoverAudio = audio;
    audio.preload = 'auto';
    audio.volume = CLOWNS_HOVER_VOLUME;
    try {
        await clownsLoadAudioFromCandidates(audio, pair);
        const p = audio.play();
        if (p && typeof p.catch === 'function') p.catch(() => {});
    } catch (_) {
        if (clownsHoverAudio === audio) clownsHoverAudio = null;
    }
}


function clownsAnimateHover(item) {
    if (!item || typeof item.animate !== 'function') return;
    if (item._clownsHoverAnimation) { try { item._clownsHoverAnimation.cancel(); } catch (_) {} }
    item._clownsHoverAnimation = item.animate([
        { translate: '0 0', rotate: '0deg', scale: '1' },
        { translate: '0 -10px', rotate: '-8deg', scale: '1.10', offset: .34 },
        { translate: '0 -4px', rotate: '7deg', scale: '1.06', offset: .70 },
        { translate: '0 0', rotate: '0deg', scale: '1' }
    ], { duration: 540, easing: 'ease-out', fill: 'none' });
    item._clownsHoverAnimation.addEventListener('finish', () => { item._clownsHoverAnimation = null; }, { once: true });
}

function clownsInstallHover() {
    clownsHoverHandler = (event) => {
        if (!clownsBackground) return;
        let hit = null;
        for (const item of clownsBackground.querySelectorAll('.clowns-item')) {
            const r = item.getBoundingClientRect();
            if (event.clientX >= r.left && event.clientX <= r.right && event.clientY >= r.top && event.clientY <= r.bottom) { hit = item; break; }
        }
        if (hit && hit !== clownsHoverLast) { clownsHoverLast = hit; clownsAnimateHover(hit); clownsPlayHover(); }
        else if (!hit) { clownsHoverLast = null; }
    };
    document.addEventListener('mousemove', clownsHoverHandler, { passive: true });
}

function clownsRemoveHover() {
    if (clownsHoverHandler) document.removeEventListener('mousemove', clownsHoverHandler);
    clownsHoverHandler = null;
    clownsHoverLast = null;
    clownsStopHoverAudio();
}

export function mount() {
    if (clownsBackground) return;
    clownsBackground = document.createElement('div');
    clownsBackground.id = 'clowns-background';
    clownsBackground.setAttribute('aria-hidden', 'true');
    document.body.appendChild(clownsBackground);
    clownsCreateItems();
    clownsCreateExtras();
    clownsInstallHover();
    clownsStartIntro();
}

export function unmount() {
    clownsStopIntro();
    clownsHoverUnlocked = false;
    clownsRemoveHover();
    if (clownsBackground) { clownsBackground.remove(); clownsBackground = null; }
}
