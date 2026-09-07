/* ============================================================
   CANDY THEME
   Built from the winter theme's decorative mount/unmount pattern.
   ============================================================ */

let candyBackground = null;
let candyHoverHandler = null;
let candyHoverLast = null;
let candyHoverAudio = null;
let candyIntroAudio = null;
let candyIntroTick = null;
let candyHoverUnlocked = false;
let candyIntroActive = false;

const CANDY_FILES = [
    "amber-candy.svg",
"aqua-candy.svg",
"bright-green-candy.svg",
"brown-candy.svg",
"cola-brown-candy.svg",
"dark-blue-candy.svg",
"green-candy.svg",
"light-blue-candy.svg",
"lime-candy.svg",
"lime-pink-candy.svg",
"navy-blue-candy.svg",
"pale-lime-candy.svg",
"pale-yellow-candy.svg",
"pink-blue-candy.svg",
"pink-candy.svg",
"purple-candy.svg",
"red-candy.svg",
"rose-pink-candy.svg"
];
const CANDY_SLOTS = [[5, 14], [7, 26], [8, 40], [9, 56], [10, 72], [12, 88], [18, 20], [17, 38], [19, 58], [22, 90], [95, 14], [93, 26], [92, 40], [91, 56], [90, 72], [88, 88], [82, 20], [80, 38], [78, 58], [76, 90], [30, 91], [50, 93], [70, 91], [50, 15]];
const CANDY_BOP_INDEXES = new Set([0, 2, 5, 8, 11, 14, 17]);
const CANDY_HOVER_SOUNDS = [
    "/sounds/winx/cartoon_music-arcade-game-positive-selection-bling-489760.mp3",
"/sounds/winx/freesound_community-electricity-sound-6066.mp3",
"/sounds/winx/freesound_community-match-sizzle-02-104778.mp3",
"/sounds/winx/koiroylers-get-coin-351945.mp3"
];
const CANDY_HOVER_VOLUME = 0.42;
const CANDY_INTRO_SOURCES = [
    "/sounds/intros/tech_oasis-bubblegum-pop-sugar-rush-214886.mp3",
"/sounds/intros/tech_oasis-bubblegum-pop-sugar-rush-214886"
];
const CANDY_INTRO_CUTOFF = 25;
const CANDY_INTRO_FADE_START = 20;
const CANDY_INTRO_VOLUME = 0.34;
const CANDY_RENDER_COUNT = 18;

function candyRandom(min, max) { return Math.random() * (max - min) + min; }

function candyShuffle(arr) {
    const copy = arr.slice();
    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
}

function candyAssetCandidates(file) {
    return [
        "/svg/theme-candy/{file}",
    "/svg/candy/{file}",
    "/svg/{file}"
    ].map(path => path.replace('{file}', file));
}

function candySetImageSource(img, file) {
    const candidates = candyAssetCandidates(file);
    let index = 0;
    const tryNext = () => {
        if (index >= candidates.length) { img.onerror = null; return; }
        img.src = candidates[index++];
    };
    img.onerror = tryNext;
    tryNext();
}

function candyLoadAudioFromCandidates(audio, candidates) {
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

function candySetIntroBop(active) {
    candyIntroActive = active;
    if (!candyBackground) return;
    for (const item of candyBackground.querySelectorAll('.candy-intro-bop-target')) {
        item.classList.toggle('candy-intro-bop', active);
    }
}

function candyCreateItem(index, file, slot) {
    if (!candyBackground) return;
    const item = document.createElement('img');
    item.className = 'candy-item';
    item.alt = '';
    item.draggable = false;
    item.setAttribute('aria-hidden', 'true');
    candySetImageSource(item, file);
    item.style.left = `${slot[0] + candyRandom(-1.2, 1.2)}%`;
    item.style.top = `${slot[1] + candyRandom(-1.2, 1.2)}%`;
    item.style.width = `${candyRandom(84, 126)}px`;
    item.style.zIndex = String(index + 1);
    item.style.setProperty('--candy-float-x', `${candyRandom(-11, 11)}px`);
    item.style.setProperty('--candy-float-y', `${candyRandom(-13, 13)}px`);
    item.style.setProperty('--candy-float-r', `${candyRandom(-7, 7)}deg`);
    item.style.setProperty('--candy-float-duration', `${candyRandom(5.6, 8.8)}s`);
    item.style.setProperty('--candy-float-delay', `${-candyRandom(0, 8)}s`);
    item.style.setProperty('--candy-bop-delay', `${-candyRandom(0, 0.7)}s`);
    if (CANDY_BOP_INDEXES.has(index)) {
        item.classList.add('candy-intro-bop-target');
        if (candyIntroActive) item.classList.add('candy-intro-bop');
    }
    candyBackground.appendChild(item);
}

function candyCreateItems() {
    const slots = candyShuffle(CANDY_SLOTS);
const files = candyShuffle(CANDY_FILES);
    const renderCount = Math.min(CANDY_RENDER_COUNT, slots.length, files.length);
    for (let i = 0; i < renderCount; i++) {
        candyCreateItem(i, files[i], slots[i]);
    }
}

function candyCreateExtras() {
    if (!candyBackground) return;
    for (let i = 0; i < 26; i++) {
    const sprinkle = document.createElement('span');
    sprinkle.className = 'candy-extra candy-sprinkle';
    sprinkle.style.left = `${candyRandom(2, 98)}%`;
    sprinkle.style.top = `${candyRandom(6, 94)}%`;
    sprinkle.style.setProperty('--candy-extra-x', `${candyRandom(-16, 16)}px`);
    sprinkle.style.setProperty('--candy-extra-y', `${candyRandom(-10, 10)}px`);
    sprinkle.style.setProperty('--candy-extra-r', `${candyRandom(-55, 55)}deg`);
    sprinkle.style.setProperty('--candy-extra-duration', `${candyRandom(4.0, 7.2)}s`);
    sprinkle.style.setProperty('--candy-extra-delay', `${-candyRandom(0, 7)}s`);
    candyBackground.appendChild(sprinkle);
}
}

function candyStopIntro({ unlockHover = false } = {}) {
    if (candyIntroTick !== null) { cancelAnimationFrame(candyIntroTick); candyIntroTick = null; }
    if (candyIntroAudio) {
        try { candyIntroAudio.pause(); candyIntroAudio.currentTime = 0; candyIntroAudio.removeAttribute('src'); candyIntroAudio.load(); } catch (_) {}
        candyIntroAudio = null;
    }
    candySetIntroBop(false);
    if (unlockHover) candyHoverUnlocked = true;
}

async function candyStartIntro() {
    candyStopIntro();
    candyHoverUnlocked = false;
    candySetIntroBop(true);
    const audio = new Audio();
    audio.preload = 'auto';
    audio.volume = CANDY_INTRO_VOLUME;
    candyIntroAudio = audio;

    const finishIntro = () => {
        if (candyIntroAudio !== audio) return;
        try { audio.pause(); audio.volume = 0; } catch (_) {}
        candyIntroAudio = null;
        candyIntroTick = null;
        candySetIntroBop(false);
        candyHoverUnlocked = true;
    };

    const updateIntro = () => {
        if (candyIntroAudio !== audio) return;
        const current = audio.currentTime || 0;
        if (current >= CANDY_INTRO_CUTOFF) { finishIntro(); return; }
        if (current >= CANDY_INTRO_FADE_START) {
            const progress = Math.min(1, (current - CANDY_INTRO_FADE_START) / (CANDY_INTRO_CUTOFF - CANDY_INTRO_FADE_START));
            audio.volume = CANDY_INTRO_VOLUME * (1 - progress);
        } else {
            audio.volume = CANDY_INTRO_VOLUME;
        }
        candyIntroTick = requestAnimationFrame(updateIntro);
    };

    try {
        await candyLoadAudioFromCandidates(audio, CANDY_INTRO_SOURCES);
        const p = audio.play();
        if (p && typeof p.then === 'function') {
            p.then(() => { if (candyIntroAudio === audio) candyIntroTick = requestAnimationFrame(updateIntro); })
             .catch(() => { if (candyIntroAudio === audio) candyStopIntro({ unlockHover: true }); });
        } else {
            candyIntroTick = requestAnimationFrame(updateIntro);
        }
    } catch (_) {
        if (candyIntroAudio === audio) candyStopIntro({ unlockHover: true });
    }
}

function candyStopHoverAudio() {
    if (candyHoverAudio) {
        try { candyHoverAudio.pause(); candyHoverAudio.currentTime = 0; candyHoverAudio.removeAttribute('src'); candyHoverAudio.load(); } catch (_) {}
        candyHoverAudio = null;
    }
}

function candyPlayHover() {
    if (!candyHoverUnlocked) return;
    candyStopHoverAudio();
    const audio = new Audio(CANDY_HOVER_SOUNDS[Math.floor(Math.random() * CANDY_HOVER_SOUNDS.length)]);
    candyHoverAudio = audio;
    audio.volume = CANDY_HOVER_VOLUME;
    const p = audio.play();
    if (p && typeof p.catch === 'function') p.catch(() => {});
}

function candyAnimateHover(item) {
    if (!item || typeof item.animate !== 'function') return;
    if (item._candyHoverAnimation) { try { item._candyHoverAnimation.cancel(); } catch (_) {} }
    item._candyHoverAnimation = item.animate([
        { translate: '0 0', rotate: '0deg', scale: '1' },
        { translate: '0 -10px', rotate: '-8deg', scale: '1.10', offset: 0.34 },
        { translate: '0 -4px', rotate: '7deg', scale: '1.06', offset: 0.70 },
        { translate: '0 0', rotate: '0deg', scale: '1' }
    ], { duration: 540, easing: 'ease-out', fill: 'none' });
    item._candyHoverAnimation.addEventListener('finish', () => { item._candyHoverAnimation = null; }, { once: true });
}

function candyInstallHover() {
    candyHoverHandler = (event) => {
        if (!candyBackground) return;
        let hit = null;
        for (const item of candyBackground.querySelectorAll('.candy-item')) {
            const r = item.getBoundingClientRect();
            if (event.clientX >= r.left && event.clientX <= r.right && event.clientY >= r.top && event.clientY <= r.bottom) { hit = item; break; }
        }
        if (hit && hit !== candyHoverLast) { candyHoverLast = hit; candyAnimateHover(hit); candyPlayHover(); }
        else if (!hit) { candyHoverLast = null; }
    };
    document.addEventListener('mousemove', candyHoverHandler, { passive: true });
}

function candyRemoveHover() {
    if (candyHoverHandler) document.removeEventListener('mousemove', candyHoverHandler);
    candyHoverHandler = null;
    candyHoverLast = null;
    candyStopHoverAudio();
}

export function mount() {
    if (candyBackground) return;
    candyBackground = document.createElement('div');
    candyBackground.id = 'candy-background';
    candyBackground.setAttribute('aria-hidden', 'true');
    document.body.appendChild(candyBackground);
    candyCreateItems();
    candyCreateExtras();
    candyInstallHover();
    candyStartIntro();
}

export function unmount() {
    candyStopIntro();
    candyHoverUnlocked = false;
    candyRemoveHover();
    if (candyBackground) { candyBackground.remove(); candyBackground = null; }
}
