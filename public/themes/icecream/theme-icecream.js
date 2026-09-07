/* ============================================================
   ICECREAM THEME
   Built from the winter theme's decorative mount/unmount pattern.
   ============================================================ */

let icecreamBackground = null;
let icecreamHoverHandler = null;
let icecreamHoverLast = null;
let icecreamHoverAudio = null;
let icecreamIntroAudio = null;
let icecreamIntroTick = null;
let icecreamHoverUnlocked = false;
let icecreamIntroActive = false;

const ICECREAM_FILES = [
    "theme-icecream-01.svg",
    "theme-icecream-02.svg",
    "theme-icecream-03.svg",
    "theme-icecream-04.svg",
    "theme-icecream-05.svg",
    "theme-icecream-06.svg",
    "theme-icecream-07.svg",
    "theme-icecream-08.svg",
    "theme-icecream-09.svg",
    "theme-icecream-10.svg",
    "theme-icecream-11.svg",
    "theme-icecream-12.svg",
    "theme-icecream-13.svg",
    "theme-icecream-14.svg",
    "theme-icecream-15.svg",
    "theme-icecream-16.svg",
    "theme-icecream-17.svg",
    "theme-icecream-18.svg"
];
const ICECREAM_BOP_INDEXES = new Set([0, 2, 4, 7, 10, 13, 16]);
const ICECREAM_HOVER_SOUNDS = [
    "/sounds/winx/cartoon_music-arcade-game-positive-selection-bling-489760.mp3",
    "/sounds/winx/freesound_community-electricity-sound-6066.mp3",
    "/sounds/winx/freesound_community-match-sizzle-02-104778.mp3",
    "/sounds/winx/koiroylers-get-coin-351945.mp3"
];
const ICECREAM_HOVER_VOLUME = 0.42;
const ICECREAM_INTRO_SOURCES = [
    "/sounds/intros/kaazoom-sun-sea-and-surf-happy-ukulele-and-guitar-music-490360.mp3",
    "/sounds/intros/kaazoom-sun-sea-and-surf-happy-ukulele-and-guitar-music-490360"
];
const ICECREAM_INTRO_CUTOFF = 20;
const ICECREAM_INTRO_FADE_START = 15;
const ICECREAM_INTRO_VOLUME = 0.34;

function icecreamRandom(min, max) { return Math.random() * (max - min) + min; }

function icecreamAssetCandidates(file) {
    return [
    "/svg/icecream/{file}",
    "/svg/theme-icecream/{file}",
    "/svg/{file}"
].map(path => path.replace('{file}', file));
}

function icecreamSetImageSource(img, file) {
    const candidates = icecreamAssetCandidates(file);
    let index = 0;
    const tryNext = () => {
        if (index >= candidates.length) { img.onerror = null; return; }
        img.src = candidates[index++];
    };
    img.onerror = tryNext;
    tryNext();
}

function icecreamLoadAudioFromCandidates(audio, candidates) {
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

function icecreamSetIntroBop(active) {
    icecreamIntroActive = active;
    if (!icecreamBackground) return;
    for (const item of icecreamBackground.querySelectorAll('.icecream-intro-bop-target')) {
        item.classList.toggle('icecream-intro-bop', active);
    }
}

function icecreamCreateItem(index, file, slot) {
    if (!icecreamBackground) return;
    const item = document.createElement('img');
    item.className = 'icecream-item';
    item.alt = '';
    item.draggable = false;
    item.setAttribute('aria-hidden', 'true');
    icecreamSetImageSource(item, file);
    item.style.left = `${slot[0] + icecreamRandom(-1.6, 1.6)}%`;
    item.style.top = `${slot[1] + icecreamRandom(-1.8, 1.8)}%`;
    item.style.width = `${icecreamRandom(108, 162)}px`;
    item.style.setProperty('--icecream-float-x', `${icecreamRandom(-14, 14)}px`);
    item.style.setProperty('--icecream-float-y', `${icecreamRandom(-17, 17)}px`);
    item.style.setProperty('--icecream-float-r', `${icecreamRandom(-8, 8)}deg`);
    item.style.setProperty('--icecream-float-duration', `${icecreamRandom(6.0, 9.5)}s`);
    item.style.setProperty('--icecream-float-delay', `${-icecreamRandom(0, 8)}s`);
    item.style.setProperty('--icecream-bop-delay', `${-icecreamRandom(0, .7)}s`);
    if (ICECREAM_BOP_INDEXES.has(index)) {
        item.classList.add('icecream-intro-bop-target');
        if (icecreamIntroActive) item.classList.add('icecream-intro-bop');
    }
    icecreamBackground.appendChild(item);
}


function icecreamCreateItems() {
    const slots = [[5, 14], [7, 26], [8, 40], [9, 56], [10, 72], [12, 88], [18, 20], [17, 38], [19, 58], [22, 90], [95, 14], [93, 26], [92, 40], [91, 56], [90, 72], [88, 88], [82, 20], [80, 38], [78, 58], [76, 90], [30, 91], [50, 93], [70, 91], [50, 15]].slice();
    const files = ICECREAM_FILES.slice();
    
    files.forEach((file, index) => icecreamCreateItem(index, file, slots[index % slots.length]));
}


function icecreamCreateExtras() {
    if (!icecreamBackground) return;
    for (let i = 0; i < 26; i++) { const e = document.createElement('span'); e.className = 'icecream-extra'; e.style.left = `${icecreamRandom(2, 98)}%`; e.style.top = `${icecreamRandom(6, 94)}%`; e.style.setProperty('--icecream-extra-x', `${icecreamRandom(-16, 16)}px`); e.style.setProperty('--icecream-extra-y', `${icecreamRandom(-10, 10)}px`); e.style.setProperty('--icecream-extra-r', `${icecreamRandom(-45, 45)}deg`); e.style.setProperty('--icecream-extra-duration', `${icecreamRandom(4.0, 7.0)}s`); e.style.setProperty('--icecream-extra-delay', `${-icecreamRandom(0, 7)}s`); icecreamBackground.appendChild(e); }
}

function icecreamStopIntro({ unlockHover = false } = {}) {
    if (icecreamIntroTick !== null) { cancelAnimationFrame(icecreamIntroTick); icecreamIntroTick = null; }
    if (icecreamIntroAudio) {
        try { icecreamIntroAudio.pause(); icecreamIntroAudio.currentTime = 0; icecreamIntroAudio.removeAttribute('src'); icecreamIntroAudio.load(); } catch (_) {}
        icecreamIntroAudio = null;
    }
    icecreamSetIntroBop(false);
    if (unlockHover) icecreamHoverUnlocked = true;
}

async function icecreamStartIntro() {
    icecreamStopIntro();
    icecreamHoverUnlocked = false;
    icecreamSetIntroBop(true);
    const audio = new Audio();
    audio.preload = 'auto';
    audio.volume = ICECREAM_INTRO_VOLUME;
    icecreamIntroAudio = audio;

    const finishIntro = () => {
        if (icecreamIntroAudio !== audio) return;
        try { audio.pause(); audio.volume = 0; } catch (_) {}
        icecreamIntroAudio = null;
        icecreamIntroTick = null;
        icecreamSetIntroBop(false);
        icecreamHoverUnlocked = true;
    };

    const updateIntro = () => {
        if (icecreamIntroAudio !== audio) return;
        const current = audio.currentTime || 0;
        if (current >= ICECREAM_INTRO_CUTOFF) { finishIntro(); return; }
        if (current >= ICECREAM_INTRO_FADE_START) {
            const progress = Math.min(1, (current - ICECREAM_INTRO_FADE_START) / (ICECREAM_INTRO_CUTOFF - ICECREAM_INTRO_FADE_START));
            audio.volume = ICECREAM_INTRO_VOLUME * (1 - progress);
        } else {
            audio.volume = ICECREAM_INTRO_VOLUME;
        }
        icecreamIntroTick = requestAnimationFrame(updateIntro);
    };

    try {
        await icecreamLoadAudioFromCandidates(audio, ICECREAM_INTRO_SOURCES);
        const p = audio.play();
        if (p && typeof p.then === 'function') {
            p.then(() => { if (icecreamIntroAudio === audio) icecreamIntroTick = requestAnimationFrame(updateIntro); })
             .catch(() => { if (icecreamIntroAudio === audio) icecreamStopIntro({ unlockHover: true }); });
        } else {
            icecreamIntroTick = requestAnimationFrame(updateIntro);
        }
    } catch (_) {
        if (icecreamIntroAudio === audio) icecreamStopIntro({ unlockHover: true });
    }
}

function icecreamStopHoverAudio() {
    if (icecreamHoverAudio) {
        try { icecreamHoverAudio.pause(); icecreamHoverAudio.currentTime = 0; icecreamHoverAudio.removeAttribute('src'); icecreamHoverAudio.load(); } catch (_) {}
        icecreamHoverAudio = null;
    }
}


function icecreamPlayHover() {
    if (!icecreamHoverUnlocked) return;
    icecreamStopHoverAudio();
    const audio = new Audio(ICECREAM_HOVER_SOUNDS[Math.floor(Math.random() * ICECREAM_HOVER_SOUNDS.length)]);
    icecreamHoverAudio = audio;
    audio.volume = ICECREAM_HOVER_VOLUME;
    const p = audio.play();
    if (p && typeof p.catch === 'function') p.catch(() => {});
}


function icecreamAnimateHover(item) {
    if (!item || typeof item.animate !== 'function') return;
    if (item._icecreamHoverAnimation) { try { item._icecreamHoverAnimation.cancel(); } catch (_) {} }
    item._icecreamHoverAnimation = item.animate([
        { translate: '0 0', rotate: '0deg', scale: '1' },
        { translate: '0 -10px', rotate: '-8deg', scale: '1.10', offset: .34 },
        { translate: '0 -4px', rotate: '7deg', scale: '1.06', offset: .70 },
        { translate: '0 0', rotate: '0deg', scale: '1' }
    ], { duration: 540, easing: 'ease-out', fill: 'none' });
    item._icecreamHoverAnimation.addEventListener('finish', () => { item._icecreamHoverAnimation = null; }, { once: true });
}

function icecreamInstallHover() {
    icecreamHoverHandler = (event) => {
        if (!icecreamBackground) return;
        let hit = null;
        for (const item of icecreamBackground.querySelectorAll('.icecream-item')) {
            const r = item.getBoundingClientRect();
            if (event.clientX >= r.left && event.clientX <= r.right && event.clientY >= r.top && event.clientY <= r.bottom) { hit = item; break; }
        }
        if (hit && hit !== icecreamHoverLast) { icecreamHoverLast = hit; icecreamAnimateHover(hit); icecreamPlayHover(); }
        else if (!hit) { icecreamHoverLast = null; }
    };
    document.addEventListener('mousemove', icecreamHoverHandler, { passive: true });
}

function icecreamRemoveHover() {
    if (icecreamHoverHandler) document.removeEventListener('mousemove', icecreamHoverHandler);
    icecreamHoverHandler = null;
    icecreamHoverLast = null;
    icecreamStopHoverAudio();
}

export function mount() {
    if (icecreamBackground) return;
    icecreamBackground = document.createElement('div');
    icecreamBackground.id = 'icecream-background';
    icecreamBackground.setAttribute('aria-hidden', 'true');
    document.body.appendChild(icecreamBackground);
    icecreamCreateItems();
    icecreamCreateExtras();
    icecreamInstallHover();
    icecreamStartIntro();
}

export function unmount() {
    icecreamStopIntro();
    icecreamHoverUnlocked = false;
    icecreamRemoveHover();
    if (icecreamBackground) { icecreamBackground.remove(); icecreamBackground = null; }
}
