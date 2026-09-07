/* ============================================================
   SHORTCAKE THEME
   Built from the winter theme's decorative mount/unmount pattern.
   ============================================================ */

let shortcakeBackground = null;
let shortcakeHoverHandler = null;
let shortcakeHoverLast = null;
let shortcakeHoverAudio = null;
let shortcakeIntroAudio = null;
let shortcakeIntroTick = null;
let shortcakeHoverUnlocked = false;
let shortcakeIntroActive = false;

const SHORTCAKE_FILES = [
    "01-strawberry-shortcake.svg",
    "02-lemon-meringue.svg",
    "03-raspberry-torte.svg",
    "04-blueberry-muffin.svg",
    "05-plum-pudding.svg",
    "06-grape-jam.svg",
    "07-orange-blossom.svg",
    "08-grape-jam-alt.svg",
    "09-raspberry-torte-alt.svg",
    "10-lemon-meringue-alt.svg",
    "11-lavender-puppy.svg",
    "12-pink-kitten.svg",
    "13-golden-puppy.svg",
    "14-blueberry-muffin-book.svg",
    "15-plum-pudding-alt.svg",
    "16-strawberry-shortcake-alt.svg"
];
const SHORTCAKE_SLOTS = [{"x": 6, "y": 14, "min": 70, "max": 84}, {"x": 7, "y": 31, "min": 72, "max": 86}, {"x": 8, "y": 49, "min": 72, "max": 88}, {"x": 9, "y": 67, "min": 70, "max": 84}, {"x": 94, "y": 14, "min": 70, "max": 84}, {"x": 93, "y": 31, "min": 72, "max": 86}, {"x": 92, "y": 49, "min": 72, "max": 88}, {"x": 91, "y": 67, "min": 70, "max": 84}, {"x": 11, "y": 87, "min": 100, "max": 120}, {"x": 34, "y": 89, "min": 104, "max": 126}, {"x": 66, "y": 89, "min": 104, "max": 126}, {"x": 89, "y": 87, "min": 100, "max": 120}];
const SHORTCAKE_BOP_INDEXES = new Set([0, 2, 4, 7, 10]);
const SHORTCAKE_HOVER_SOUNDS = [
    "/sounds/winx/cartoon_music-arcade-game-positive-selection-bling-489760.mp3",
    "/sounds/winx/freesound_community-electricity-sound-6066.mp3",
    "/sounds/winx/freesound_community-match-sizzle-02-104778.mp3",
    "/sounds/winx/koiroylers-get-coin-351945.mp3"
];
const SHORTCAKE_HOVER_VOLUME = 0.4;
const SHORTCAKE_INTRO_SOURCES = [
    "/sounds/intros/crab_audio-lollipop-325345.mp3",
    "/sounds/intros/crab_audio-lollipop-325345"
];
const SHORTCAKE_INTRO_CUTOFF = 20;
const SHORTCAKE_INTRO_FADE_START = 17;
const SHORTCAKE_INTRO_VOLUME = 0.34;
const SHORTCAKE_RENDER_COUNT = 12;

function shortcakeRandom(min, max) { return Math.random() * (max - min) + min; }

function shortcakeShuffle(arr) {
    const copy = arr.slice();
    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
}

function shortcakeAssetCandidates(file) {
    return [
        "/svg/theme-shortcake/{file}",
        "/svg/shortcake/{file}",
        "/svg/{file}"
    ].map(path => path.replace('{file}', file));
}

function shortcakeSetImageSource(img, file) {
    const candidates = shortcakeAssetCandidates(file);
    let index = 0;
    const tryNext = () => {
        if (index >= candidates.length) { img.onerror = null; return; }
        img.src = candidates[index++];
    };
    img.onerror = tryNext;
    tryNext();
}

function shortcakeLoadAudioFromCandidates(audio, candidates) {
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

function shortcakeSetIntroBop(active) {
    shortcakeIntroActive = active;
    if (!shortcakeBackground) return;
    for (const item of shortcakeBackground.querySelectorAll('.shortcake-intro-bop-target')) {
        item.classList.toggle('shortcake-intro-bop', active);
    }
}

function shortcakeCreateItem(index, file, slot) {
    if (!shortcakeBackground) return;
    const item = document.createElement('img');
    item.className = 'shortcake-item';
    item.alt = '';
    item.draggable = false;
    item.setAttribute('aria-hidden', 'true');
    shortcakeSetImageSource(item, file);
    item.style.left = `${slot.x + shortcakeRandom(-0.8, 0.8)}%`;
    item.style.top = `${slot.y + shortcakeRandom(-0.8, 0.8)}%`;
    item.style.width = `${shortcakeRandom(slot.min, slot.max)}px`;
    item.style.zIndex = String(index + 1);
    item.style.setProperty('--shortcake-float-x', `${shortcakeRandom(-10, 10)}px`);
    item.style.setProperty('--shortcake-float-y', `${shortcakeRandom(-12, 12)}px`);
    item.style.setProperty('--shortcake-float-r', `${shortcakeRandom(-7, 7)}deg`);
    item.style.setProperty('--shortcake-float-duration', `${shortcakeRandom(5.8, 9.2)}s`);
    item.style.setProperty('--shortcake-float-delay', `${-shortcakeRandom(0, 8)}s`);
    item.style.setProperty('--shortcake-bop-delay', `${-shortcakeRandom(0, .7)}s`);
    if (SHORTCAKE_BOP_INDEXES.has(index)) {
        item.classList.add('shortcake-intro-bop-target');
        if (shortcakeIntroActive) item.classList.add('shortcake-intro-bop');
    }
    shortcakeBackground.appendChild(item);
}

function shortcakeCreateItems() {
    const slots = shortcakeShuffle(SHORTCAKE_SLOTS);
    const files = shortcakeShuffle(SHORTCAKE_FILES);
    const renderCount = Math.min(SHORTCAKE_RENDER_COUNT, slots.length, files.length);
    for (let i = 0; i < renderCount; i++) {
        shortcakeCreateItem(i, files[i], slots[i]);
    }
}

function shortcakeCreateExtras() {
    if (!shortcakeBackground) return;
    for (let i = 0; i < 20; i++) {
        const extra = document.createElement('span');
        extra.className = 'shortcake-extra shortcake-extra-a';
        extra.style.left = `${shortcakeRandom(3, 97)}%`;
        extra.style.top = `${shortcakeRandom(5, 95)}%`;
        extra.style.setProperty('--shortcake-extra-duration', `${shortcakeRandom(3.6, 7.0)}s`);
        extra.style.setProperty('--shortcake-extra-delay', `${-shortcakeRandom(0, 7)}s`);
        extra.style.setProperty('--shortcake-extra-scale', shortcakeRandom(.7, 1.35).toFixed(2));
        shortcakeBackground.appendChild(extra);
    }
    for (let i = 0; i < 10; i++) {
        const extra = document.createElement('span');
        extra.className = 'shortcake-extra shortcake-extra-b';
        extra.style.left = `${shortcakeRandom(4, 96)}%`;
        extra.style.top = `${shortcakeRandom(8, 92)}%`;
        extra.style.setProperty('--shortcake-extra-duration', `${shortcakeRandom(5.2, 9.2)}s`);
        extra.style.setProperty('--shortcake-extra-delay', `${-shortcakeRandom(0, 8)}s`);
        extra.style.setProperty('--shortcake-extra-scale', shortcakeRandom(.78, 1.32).toFixed(2));
        shortcakeBackground.appendChild(extra);
    }
}

function shortcakeStopIntro({ unlockHover = false } = {}) {
    if (shortcakeIntroTick !== null) { cancelAnimationFrame(shortcakeIntroTick); shortcakeIntroTick = null; }
    if (shortcakeIntroAudio) {
        try { shortcakeIntroAudio.pause(); shortcakeIntroAudio.currentTime = 0; shortcakeIntroAudio.removeAttribute('src'); shortcakeIntroAudio.load(); } catch (_) {}
        shortcakeIntroAudio = null;
    }
    shortcakeSetIntroBop(false);
    if (unlockHover) shortcakeHoverUnlocked = true;
}

async function shortcakeStartIntro() {
    shortcakeStopIntro();
    shortcakeHoverUnlocked = false;
    shortcakeSetIntroBop(true);
    const audio = new Audio();
    audio.preload = 'auto';
    audio.volume = SHORTCAKE_INTRO_VOLUME;
    shortcakeIntroAudio = audio;

    const finishIntro = () => {
        if (shortcakeIntroAudio !== audio) return;
        try { audio.pause(); audio.volume = 0; } catch (_) {}
        shortcakeIntroAudio = null;
        shortcakeIntroTick = null;
        shortcakeSetIntroBop(false);
        shortcakeHoverUnlocked = true;
    };

    const updateIntro = () => {
        if (shortcakeIntroAudio !== audio) return;
        const current = audio.currentTime || 0;
        if (current >= SHORTCAKE_INTRO_CUTOFF) { finishIntro(); return; }
        if (current >= SHORTCAKE_INTRO_FADE_START) {
            const progress = Math.min(1, (current - SHORTCAKE_INTRO_FADE_START) / (SHORTCAKE_INTRO_CUTOFF - SHORTCAKE_INTRO_FADE_START));
            audio.volume = SHORTCAKE_INTRO_VOLUME * (1 - progress);
        } else {
            audio.volume = SHORTCAKE_INTRO_VOLUME;
        }
        shortcakeIntroTick = requestAnimationFrame(updateIntro);
    };

    try {
        await shortcakeLoadAudioFromCandidates(audio, SHORTCAKE_INTRO_SOURCES);
        const p = audio.play();
        if (p && typeof p.then === 'function') {
            p.then(() => { if (shortcakeIntroAudio === audio) shortcakeIntroTick = requestAnimationFrame(updateIntro); })
             .catch(() => { if (shortcakeIntroAudio === audio) shortcakeStopIntro({ unlockHover: true }); });
        } else {
            shortcakeIntroTick = requestAnimationFrame(updateIntro);
        }
    } catch (_) {
        if (shortcakeIntroAudio === audio) shortcakeStopIntro({ unlockHover: true });
    }
}

function shortcakeStopHoverAudio() {
    if (shortcakeHoverAudio) {
        try { shortcakeHoverAudio.pause(); shortcakeHoverAudio.currentTime = 0; shortcakeHoverAudio.removeAttribute('src'); shortcakeHoverAudio.load(); } catch (_) {}
        shortcakeHoverAudio = null;
    }
}

function shortcakePlayHover() {
    if (!shortcakeHoverUnlocked) return;
    shortcakeStopHoverAudio();
    const audio = new Audio(SHORTCAKE_HOVER_SOUNDS[Math.floor(Math.random() * SHORTCAKE_HOVER_SOUNDS.length)]);
    shortcakeHoverAudio = audio;
    audio.volume = SHORTCAKE_HOVER_VOLUME;
    const p = audio.play();
    if (p && typeof p.catch === 'function') p.catch(() => {});
}

function shortcakeAnimateHover(item) {
    if (!item || typeof item.animate !== 'function') return;
    if (item._shortcakeHoverAnimation) { try { item._shortcakeHoverAnimation.cancel(); } catch (_) {} }
    item._shortcakeHoverAnimation = item.animate([
        { translate: '0 0', rotate: '0deg', scale: '1' },
        { translate: '0 -10px', rotate: '-7deg', scale: '1.10', offset: 0.34 },
        { translate: '0 -4px', rotate: '6deg', scale: '1.05', offset: 0.70 },
        { translate: '0 0', rotate: '0deg', scale: '1' }
    ], { duration: 530, easing: 'ease-out', fill: 'none' });
    item._shortcakeHoverAnimation.addEventListener('finish', () => { item._shortcakeHoverAnimation = null; }, { once: true });
}

function shortcakeInstallHover() {
    shortcakeHoverHandler = (event) => {
        if (!shortcakeBackground) return;
        let hit = null;
        for (const item of shortcakeBackground.querySelectorAll('.shortcake-item')) {
            const r = item.getBoundingClientRect();
            if (event.clientX >= r.left && event.clientX <= r.right && event.clientY >= r.top && event.clientY <= r.bottom) { hit = item; break; }
        }
        if (hit && hit !== shortcakeHoverLast) { shortcakeHoverLast = hit; shortcakeAnimateHover(hit); shortcakePlayHover(); }
        else if (!hit) { shortcakeHoverLast = null; }
    };
    document.addEventListener('mousemove', shortcakeHoverHandler, { passive: true });
}

function shortcakeRemoveHover() {
    if (shortcakeHoverHandler) document.removeEventListener('mousemove', shortcakeHoverHandler);
    shortcakeHoverHandler = null;
    shortcakeHoverLast = null;
    shortcakeStopHoverAudio();
}

export function mount() {
    if (shortcakeBackground) return;
    shortcakeBackground = document.createElement('div');
    shortcakeBackground.id = 'shortcake-background';
    shortcakeBackground.setAttribute('aria-hidden', 'true');
    document.body.appendChild(shortcakeBackground);
    shortcakeCreateItems();
    shortcakeCreateExtras();
    shortcakeInstallHover();
    shortcakeStartIntro();
}

export function unmount() {
    shortcakeStopIntro();
    shortcakeHoverUnlocked = false;
    shortcakeRemoveHover();
    if (shortcakeBackground) {
        shortcakeBackground.remove();
        shortcakeBackground = null;
    }
}
