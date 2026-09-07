/* ============================================================
   GLASSFOOD THEME
   Built from the winter theme's decorative mount/unmount pattern.
   ============================================================ */

let glassfoodBackground = null;
let glassfoodHoverHandler = null;
let glassfoodHoverLast = null;
let glassfoodHoverAudio = null;
let glassfoodIntroAudio = null;
let glassfoodIntroTick = null;
let glassfoodHoverUnlocked = false;
let glassfoodIntroActive = false;

const GLASSFOOD_RENDER_SEQUENCE = [
    "blue-glass-cherries.svg",
    "glass-pancakes-and-drink.svg",
    "glass-pomegranate.svg",
    "glassfood-01-green-dragon-fruit.svg",
    "glassfood-02-yellow-pear.svg",
    "glassfood-03-green-pomegranate.svg",
    "glassfood-04-pink-apple.svg",
    "glassfood-05-pink-jelly.svg",
    "glassfood-06-purple-strawberry.svg",
    "glassfood-07-golden-croissant.svg",
    "glassfood-08-blue-jelly-dessert.svg",
    "glassfood-09-red-pear.svg",
    "red-glass-strawberry.svg",
    "glassfood-05-pink-jelly.svg",
    "blue-glass-cherries.svg",
    "glassfood-06-purple-strawberry.svg",
    "glassfood-08-blue-jelly-dessert.svg"
];
const GLASSFOOD_BOP_INDEXES = new Set([1, 4, 7, 10, 14]);
const GLASSFOOD_HOVER_SOUNDS = [
    "/sounds/winx/cartoon_music-arcade-game-positive-selection-bling-489760.mp3",
    "/sounds/winx/freesound_community-electricity-sound-6066.mp3",
    "/sounds/winx/freesound_community-match-sizzle-02-104778.mp3",
    "/sounds/winx/koiroylers-get-coin-351945.mp3"
];
const GLASSFOOD_HOVER_VOLUME = 0.42;
const GLASSFOOD_INTRO_SOURCES = [
    "/sounds/intros/alex-morgan-celtic-591333.mp3"
];
const GLASSFOOD_INTRO_CUTOFF = 20;
const GLASSFOOD_INTRO_FADE_START = 15;
const GLASSFOOD_INTRO_VOLUME = 0.3;

function glassfoodRandom(min, max) { return Math.random() * (max - min) + min; }

function glassfoodAssetCandidates(file) {
    return [
    "/svg/glassfood/{file}",
    "/svg/theme-glassfood/{file}",
    "/svg/{file}"
].map(path => path.replace('{file}', file));
}

function glassfoodSetImageSource(img, file) {
    const candidates = glassfoodAssetCandidates(file);
    let index = 0;
    const tryNext = () => {
        if (index >= candidates.length) { img.onerror = null; return; }
        img.src = candidates[index++];
    };
    img.onerror = tryNext;
    tryNext();
}

function glassfoodLoadAudioFromCandidates(audio, candidates) {
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

function glassfoodSetIntroBop(active) {
    glassfoodIntroActive = active;
    if (!glassfoodBackground) return;
    for (const item of glassfoodBackground.querySelectorAll('.glassfood-intro-bop-target')) {
        item.classList.toggle('glassfood-intro-bop', active);
    }
}

function glassfoodCreateItem(index, file) {
    if (!glassfoodBackground) return;
    const item = document.createElement('img');
    item.className = 'glassfood-item';
    item.alt = '';
    item.draggable = false;
    item.setAttribute('aria-hidden', 'true');
    glassfoodSetImageSource(item, file);

    const slots = [[6, 14], [8, 28], [7, 46], [9, 64], [11, 82], [18, 20], [17, 38], [20, 58], [95, 12], [93, 25], [94, 40], [92, 55], [91, 70], [89, 84], [84, 17], [86, 32], [85, 50], [83, 68], [82, 86], [76, 82], [72, 90], [64, 92], [50, 16], [32, 90]];
    const slot = slots[index % slots.length];
    item.style.left = `${slot[0] + glassfoodRandom(-1.6, 1.6)}%`;
    item.style.top = `${slot[1] + glassfoodRandom(-1.8, 1.8)}%`;
    item.style.width = `${glassfoodRandom(118, 176)}px`;
    item.style.setProperty('--glassfood-float-x', `${glassfoodRandom(-14, 14)}px`);
    item.style.setProperty('--glassfood-float-y', `${glassfoodRandom(-17, 17)}px`);
    item.style.setProperty('--glassfood-float-r', `${glassfoodRandom(-8, 8)}deg`);
    item.style.setProperty('--glassfood-float-duration', `${glassfoodRandom(6.1, 10.4)}s`);
    item.style.setProperty('--glassfood-float-delay', `${-glassfoodRandom(0, 8)}s`);
    item.style.setProperty('--glassfood-bop-delay', `${-glassfoodRandom(0, .7)}s`);
    if (GLASSFOOD_BOP_INDEXES.has(index)) {
        item.classList.add('glassfood-intro-bop-target');
        if (glassfoodIntroActive) item.classList.add('glassfood-intro-bop');
    }
    glassfoodBackground.appendChild(item);
}

function glassfoodCreateItems() {
    GLASSFOOD_RENDER_SEQUENCE.forEach((file, index) => glassfoodCreateItem(index, file));
}

function glassfoodCreateExtras() {
    if (!glassfoodBackground) return;
    for (let i = 0; i < 16; i++) { const e = document.createElement('span'); e.className = 'glassfood-extra'; e.style.left = `${glassfoodRandom(4,96)}%`; e.style.top = `${glassfoodRandom(6,94)}%`; e.style.setProperty('--glassfood-extra-duration', `${glassfoodRandom(3.0,6.2)}s`); e.style.setProperty('--glassfood-extra-delay', `${-glassfoodRandom(0,6)}s`); glassfoodBackground.appendChild(e);} 
}

function glassfoodStopIntro({ unlockHover = false } = {}) {
    if (glassfoodIntroTick !== null) { cancelAnimationFrame(glassfoodIntroTick); glassfoodIntroTick = null; }
    if (glassfoodIntroAudio) {
        try { glassfoodIntroAudio.pause(); glassfoodIntroAudio.currentTime = 0; glassfoodIntroAudio.removeAttribute('src'); glassfoodIntroAudio.load(); } catch (_) {}
        glassfoodIntroAudio = null;
    }
    glassfoodSetIntroBop(false);
    if (unlockHover) glassfoodHoverUnlocked = true;
}

async function glassfoodStartIntro() {
    glassfoodStopIntro();
    glassfoodHoverUnlocked = false;
    glassfoodSetIntroBop(true);
    const audio = new Audio();
    audio.preload = 'auto';
    audio.volume = GLASSFOOD_INTRO_VOLUME;
    glassfoodIntroAudio = audio;

    const finishIntro = () => {
        if (glassfoodIntroAudio !== audio) return;
        try { audio.pause(); audio.volume = 0; } catch (_) {}
        glassfoodIntroAudio = null;
        glassfoodIntroTick = null;
        glassfoodSetIntroBop(false);
        glassfoodHoverUnlocked = true;
    };

    const updateIntro = () => {
        if (glassfoodIntroAudio !== audio) return;
        const current = audio.currentTime || 0;
        if (current >= GLASSFOOD_INTRO_CUTOFF) { finishIntro(); return; }
        if (current >= GLASSFOOD_INTRO_FADE_START) {
            const progress = Math.min(1, (current - GLASSFOOD_INTRO_FADE_START) / (GLASSFOOD_INTRO_CUTOFF - GLASSFOOD_INTRO_FADE_START));
            audio.volume = GLASSFOOD_INTRO_VOLUME * (1 - progress);
        } else {
            audio.volume = GLASSFOOD_INTRO_VOLUME;
        }
        glassfoodIntroTick = requestAnimationFrame(updateIntro);
    };

    try {
        await glassfoodLoadAudioFromCandidates(audio, GLASSFOOD_INTRO_SOURCES);
        const p = audio.play();
        if (p && typeof p.then === 'function') {
            p.then(() => { if (glassfoodIntroAudio === audio) glassfoodIntroTick = requestAnimationFrame(updateIntro); }).catch(() => { if (glassfoodIntroAudio === audio) glassfoodStopIntro({ unlockHover: true }); });
        } else {
            glassfoodIntroTick = requestAnimationFrame(updateIntro);
        }
    } catch (_) {
        if (glassfoodIntroAudio === audio) glassfoodStopIntro({ unlockHover: true });
    }
}

function glassfoodStopHoverAudio() {
    if (glassfoodHoverAudio) {
        try { glassfoodHoverAudio.pause(); glassfoodHoverAudio.currentTime = 0; glassfoodHoverAudio.removeAttribute('src'); glassfoodHoverAudio.load(); } catch (_) {}
        glassfoodHoverAudio = null;
    }
}

async function glassfoodPlayHover() {
    if (!glassfoodHoverUnlocked) return;
    glassfoodStopHoverAudio();
    const choice = Math.floor(Math.random() * GLASSFOOD_HOVER_SOUNDS.length);
    const audio = new Audio(GLASSFOOD_HOVER_SOUNDS[choice]);
    glassfoodHoverAudio = audio;
    audio.preload = 'auto';
    audio.volume = GLASSFOOD_HOVER_VOLUME;
    const p = audio.play();
    if (p && typeof p.catch === 'function') p.catch(() => {});
}

function glassfoodAnimateHover(item) {
    if (!item || typeof item.animate !== 'function') return;
    if (item._glassfoodHoverAnimation) { try { item._glassfoodHoverAnimation.cancel(); } catch (_) {} }
    item._glassfoodHoverAnimation = item.animate([
        { translate: '0 0', rotate: '0deg', scale: '1' },
        { translate: '0 -10px', rotate: '-8deg', scale: '1.10', offset: .34 },
        { translate: '0 -4px', rotate: '7deg', scale: '1.06', offset: .70 },
        { translate: '0 0', rotate: '0deg', scale: '1' }
    ], { duration: 540, easing: 'ease-out', fill: 'none' });
    item._glassfoodHoverAnimation.addEventListener('finish', () => { item._glassfoodHoverAnimation = null; }, { once: true });
}

function glassfoodInstallHover() {
    glassfoodHoverHandler = (event) => {
        if (!glassfoodBackground) return;
        let hit = null;
        for (const item of glassfoodBackground.querySelectorAll('.glassfood-item')) {
            const r = item.getBoundingClientRect();
            if (event.clientX >= r.left && event.clientX <= r.right && event.clientY >= r.top && event.clientY <= r.bottom) { hit = item; break; }
        }
        if (hit && hit !== glassfoodHoverLast) { glassfoodHoverLast = hit; glassfoodAnimateHover(hit); glassfoodPlayHover(); }
        else if (!hit) { glassfoodHoverLast = null; }
    };
    document.addEventListener('mousemove', glassfoodHoverHandler, { passive: true });
}

function glassfoodRemoveHover() {
    if (glassfoodHoverHandler) document.removeEventListener('mousemove', glassfoodHoverHandler);
    glassfoodHoverHandler = null;
    glassfoodHoverLast = null;
    glassfoodStopHoverAudio();
}

export function mount() {
    if (glassfoodBackground) return;
    glassfoodBackground = document.createElement('div');
    glassfoodBackground.id = 'glassfood-background';
    glassfoodBackground.setAttribute('aria-hidden', 'true');
    document.body.appendChild(glassfoodBackground);
    glassfoodCreateItems();
    glassfoodCreateExtras();
    glassfoodInstallHover();
    glassfoodStartIntro();
}

export function unmount() {
    glassfoodStopIntro();
    glassfoodHoverUnlocked = false;
    glassfoodRemoveHover();
    if (glassfoodBackground) { glassfoodBackground.remove(); glassfoodBackground = null; }
}
