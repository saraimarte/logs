/* ============================================================
   GIRLS THEME
   Built from the winter theme's decorative mount/unmount pattern.
   ============================================================ */

let girlsBackground = null;
let girlsHoverHandler = null;
let girlsHoverLast = null;
let girlsHoverAudio = null;
let girlsIntroAudio = null;
let girlsIntroTick = null;
let girlsHoverUnlocked = false;
let girlsIntroActive = false;

const GIRLS_FILES = [
    "theme-girls-01-black-tank-grey-skirt.svg",
"theme-girls-02-orange-top-denim-shorts.svg",
"theme-girls-03-blue-floral-top-flare-jeans.svg",
"theme-girls-04-floral-dress-martini.svg",
"theme-girls-05-curly-hair-pink-top-skirt.svg",
"theme-girls-06-argyle-vest-red-boots.svg",
"theme-girls-07-red-hair-leopard-skirt.svg",
"theme-girls-08-lilac-blouse-highwaist-trousers.svg",
"theme-girls-09-purple-kimono-green-romper.svg",
"theme-girls-10-sunglasses-red-top-camo-skirt.svg",
"theme-girls-11-brown-tank-blue-flare-jeans.svg"
];
const GIRLS_SLOTS = [[7, 22], [9, 42], [12, 62], [93, 22], [91, 42], [88, 62], [16, 86], [32, 91], [50, 94], [68, 91], [84, 86]];
const GIRLS_BOP_INDEXES = new Set([0, 2, 4, 7, 9]);
const GIRLS_HOVER_SOUNDS = [
    "/sounds/winx/cartoon_music-arcade-game-positive-selection-bling-489760.mp3",
"/sounds/winx/freesound_community-electricity-sound-6066.mp3",
"/sounds/winx/freesound_community-match-sizzle-02-104778.mp3",
"/sounds/winx/koiroylers-get-coin-351945.mp3"
];
const GIRLS_HOVER_VOLUME = 0.42;
const GIRLS_INTRO_SOURCES = [
    "/sounds/intros/remstunes-pretty-girls-465835.mp3",
"/sounds/intros/remstunes-pretty-girls-465835"
];
const GIRLS_INTRO_CUTOFF = 30;
const GIRLS_INTRO_FADE_START = 25;
const GIRLS_INTRO_VOLUME = 0.34;
const GIRLS_RENDER_COUNT = 11;

function girlsRandom(min, max) { return Math.random() * (max - min) + min; }

function girlsShuffle(arr) {
    const copy = arr.slice();
    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
}

function girlsAssetCandidates(file) {
    return [
        "/svg/theme-girls/{file}",
    "/svg/girls/{file}",
    "/svg/{file}"
    ].map(path => path.replace('{file}', file));
}

function girlsSetImageSource(img, file) {
    const candidates = girlsAssetCandidates(file);
    let index = 0;
    const tryNext = () => {
        if (index >= candidates.length) { img.onerror = null; return; }
        img.src = candidates[index++];
    };
    img.onerror = tryNext;
    tryNext();
}

function girlsLoadAudioFromCandidates(audio, candidates) {
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

function girlsSetIntroBop(active) {
    girlsIntroActive = active;
    if (!girlsBackground) return;
    for (const item of girlsBackground.querySelectorAll('.girls-intro-bop-target')) {
        item.classList.toggle('girls-intro-bop', active);
    }
}

function girlsCreateItem(index, file, slot) {
    if (!girlsBackground) return;
    const item = document.createElement('img');
    item.className = 'girls-item';
    item.alt = '';
    item.draggable = false;
    item.setAttribute('aria-hidden', 'true');
    girlsSetImageSource(item, file);
    item.style.left = `${slot[0] + girlsRandom(-0.0, 0.0)}%`;
    item.style.top = `${slot[1] + girlsRandom(-0.0, 0.0)}%`;
    item.style.width = `${girlsRandom(86, 118)}px`;
    item.style.zIndex = String(index + 1);
    item.style.setProperty('--girls-float-x', `${girlsRandom(-8, 8)}px`);
    item.style.setProperty('--girls-float-y', `${girlsRandom(-10, 10)}px`);
    item.style.setProperty('--girls-float-r', `${girlsRandom(-5, 5)}deg`);
    item.style.setProperty('--girls-float-duration', `${girlsRandom(5.7, 9.1)}s`);
    item.style.setProperty('--girls-float-delay', `${-girlsRandom(0, 8)}s`);
    item.style.setProperty('--girls-bop-delay', `${-girlsRandom(0, 0.7)}s`);
    if (GIRLS_BOP_INDEXES.has(index)) {
        item.classList.add('girls-intro-bop-target');
        if (girlsIntroActive) item.classList.add('girls-intro-bop');
    }
    girlsBackground.appendChild(item);
}

function girlsCreateItems() {
    const slots = GIRLS_SLOTS.slice();
const files = girlsShuffle(GIRLS_FILES);
    const renderCount = Math.min(GIRLS_RENDER_COUNT, slots.length, files.length);
    for (let i = 0; i < renderCount; i++) {
        girlsCreateItem(i, files[i], slots[i]);
    }
}

function girlsCreateExtras() {
    if (!girlsBackground) return;
    for (let i = 0; i < 20; i++) {
    const star = document.createElement('span');
    star.className = 'girls-extra girls-star';
    star.style.left = `${girlsRandom(3, 97)}%`;
    star.style.top = `${girlsRandom(6, 94)}%`;
    star.style.setProperty('--girls-extra-duration', `${girlsRandom(3.4, 6.8)}s`);
    star.style.setProperty('--girls-extra-delay', `${-girlsRandom(0, 7)}s`);
    girlsBackground.appendChild(star);
}
}

function girlsStopIntro({ unlockHover = false } = {}) {
    if (girlsIntroTick !== null) { cancelAnimationFrame(girlsIntroTick); girlsIntroTick = null; }
    if (girlsIntroAudio) {
        try { girlsIntroAudio.pause(); girlsIntroAudio.currentTime = 0; girlsIntroAudio.removeAttribute('src'); girlsIntroAudio.load(); } catch (_) {}
        girlsIntroAudio = null;
    }
    girlsSetIntroBop(false);
    if (unlockHover) girlsHoverUnlocked = true;
}

async function girlsStartIntro() {
    girlsStopIntro();
    girlsHoverUnlocked = false;
    girlsSetIntroBop(true);
    const audio = new Audio();
    audio.preload = 'auto';
    audio.volume = GIRLS_INTRO_VOLUME;
    girlsIntroAudio = audio;

    const finishIntro = () => {
        if (girlsIntroAudio !== audio) return;
        try { audio.pause(); audio.volume = 0; } catch (_) {}
        girlsIntroAudio = null;
        girlsIntroTick = null;
        girlsSetIntroBop(false);
        girlsHoverUnlocked = true;
    };

    const updateIntro = () => {
        if (girlsIntroAudio !== audio) return;
        const current = audio.currentTime || 0;
        if (current >= GIRLS_INTRO_CUTOFF) { finishIntro(); return; }
        if (current >= GIRLS_INTRO_FADE_START) {
            const progress = Math.min(1, (current - GIRLS_INTRO_FADE_START) / (GIRLS_INTRO_CUTOFF - GIRLS_INTRO_FADE_START));
            audio.volume = GIRLS_INTRO_VOLUME * (1 - progress);
        } else {
            audio.volume = GIRLS_INTRO_VOLUME;
        }
        girlsIntroTick = requestAnimationFrame(updateIntro);
    };

    try {
        await girlsLoadAudioFromCandidates(audio, GIRLS_INTRO_SOURCES);
        const p = audio.play();
        if (p && typeof p.then === 'function') {
            p.then(() => { if (girlsIntroAudio === audio) girlsIntroTick = requestAnimationFrame(updateIntro); })
             .catch(() => { if (girlsIntroAudio === audio) girlsStopIntro({ unlockHover: true }); });
        } else {
            girlsIntroTick = requestAnimationFrame(updateIntro);
        }
    } catch (_) {
        if (girlsIntroAudio === audio) girlsStopIntro({ unlockHover: true });
    }
}

function girlsStopHoverAudio() {
    if (girlsHoverAudio) {
        try { girlsHoverAudio.pause(); girlsHoverAudio.currentTime = 0; girlsHoverAudio.removeAttribute('src'); girlsHoverAudio.load(); } catch (_) {}
        girlsHoverAudio = null;
    }
}

function girlsPlayHover() {
    if (!girlsHoverUnlocked) return;
    girlsStopHoverAudio();
    const audio = new Audio(GIRLS_HOVER_SOUNDS[Math.floor(Math.random() * GIRLS_HOVER_SOUNDS.length)]);
    girlsHoverAudio = audio;
    audio.volume = GIRLS_HOVER_VOLUME;
    const p = audio.play();
    if (p && typeof p.catch === 'function') p.catch(() => {});
}

function girlsAnimateHover(item) {
    if (!item || typeof item.animate !== 'function') return;
    if (item._girlsHoverAnimation) { try { item._girlsHoverAnimation.cancel(); } catch (_) {} }
    item._girlsHoverAnimation = item.animate([
        { translate: '0 0', rotate: '0deg', scale: '1' },
        { translate: '0 -10px', rotate: '-8deg', scale: '1.10', offset: 0.34 },
        { translate: '0 -4px', rotate: '7deg', scale: '1.06', offset: 0.70 },
        { translate: '0 0', rotate: '0deg', scale: '1' }
    ], { duration: 540, easing: 'ease-out', fill: 'none' });
    item._girlsHoverAnimation.addEventListener('finish', () => { item._girlsHoverAnimation = null; }, { once: true });
}

function girlsInstallHover() {
    girlsHoverHandler = (event) => {
        if (!girlsBackground) return;
        let hit = null;
        for (const item of girlsBackground.querySelectorAll('.girls-item')) {
            const r = item.getBoundingClientRect();
            if (event.clientX >= r.left && event.clientX <= r.right && event.clientY >= r.top && event.clientY <= r.bottom) { hit = item; break; }
        }
        if (hit && hit !== girlsHoverLast) { girlsHoverLast = hit; girlsAnimateHover(hit); girlsPlayHover(); }
        else if (!hit) { girlsHoverLast = null; }
    };
    document.addEventListener('mousemove', girlsHoverHandler, { passive: true });
}

function girlsRemoveHover() {
    if (girlsHoverHandler) document.removeEventListener('mousemove', girlsHoverHandler);
    girlsHoverHandler = null;
    girlsHoverLast = null;
    girlsStopHoverAudio();
}

export function mount() {
    if (girlsBackground) return;
    girlsBackground = document.createElement('div');
    girlsBackground.id = 'girls-background';
    girlsBackground.setAttribute('aria-hidden', 'true');
    document.body.appendChild(girlsBackground);
    girlsCreateItems();
    girlsCreateExtras();
    girlsInstallHover();
    girlsStartIntro();
}

export function unmount() {
    girlsStopIntro();
    girlsHoverUnlocked = false;
    girlsRemoveHover();
    if (girlsBackground) { girlsBackground.remove(); girlsBackground = null; }
}
