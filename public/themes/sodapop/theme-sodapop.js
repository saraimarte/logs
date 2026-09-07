/* ============================================================
   SODAPOP THEME
   Built from the winter theme mount/unmount structure.
   ============================================================ */

let sodapopBackground = null;
let sodapopHoverHandler = null;
let sodapopHoverLast = null;
let sodapopHoverAudio = null;
let sodapopIntroAudio = null;
let sodapopIntroTick = null;
let sodapopHoverUnlocked = false;
let sodapopIntroActive = false;

const SODAPOP_FILES = [
    "theme-soda-01.svg",
    "theme-soda-02.svg",
    "theme-soda-03.svg",
    "theme-soda-04.svg",
    "theme-soda-05.svg",
    "theme-soda-06.svg",
    "theme-soda-07.svg",
    "theme-soda-08.svg",
    "theme-soda-09.svg"
];
const SODAPOP_SLOTS = [{"x": 10, "y": 15, "min": 142, "max": 178}, {"x": 50, "y": 14, "min": 144, "max": 182}, {"x": 90, "y": 15, "min": 142, "max": 178}, {"x": 8, "y": 44, "min": 148, "max": 188}, {"x": 92, "y": 44, "min": 148, "max": 188}, {"x": 18, "y": 86, "min": 154, "max": 196}, {"x": 41, "y": 89, "min": 156, "max": 200}, {"x": 64, "y": 89, "min": 156, "max": 200}, {"x": 86, "y": 86, "min": 154, "max": 196}];
const SODAPOP_RENDER_COUNT = 9;
const SODAPOP_BOP_INDEXES = new Set([0, 2, 4, 6]);
const SODAPOP_HOVER_SOUNDS = [
    "/sounds/winx/cartoon_music-arcade-game-positive-selection-bling-489760.mp3",
    "/sounds/winx/freesound_community-electricity-sound-6066.mp3",
    "/sounds/winx/freesound_community-match-sizzle-02-104778.mp3",
    "/sounds/winx/koiroylers-get-coin-351945.mp3"
];
const SODAPOP_HOVER_VOLUME = 0.42;
const SODAPOP_INTRO_SOURCES = [
    "/sounds/playlistsons-cherry-soda-kiss-580262-soda.mp3"
];
const SODAPOP_INTRO_FULL = false;
const SODAPOP_INTRO_CUTOFF = 40;
const SODAPOP_INTRO_FADE_START = 36;
const SODAPOP_INTRO_VOLUME = 0.42;

function sodapopRandom(min, max) { return Math.random() * (max - min) + min; }

function sodapopShuffle(arr) {
    const copy = arr.slice();
    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
}

function sodapopAssetCandidates(file) {
    return [
        "/svg/theme-soda/{file}",
        "/svg/sodapop/{file}",
        "/svg/theme-sodapop/{file}",
        "/svg/{file}"
    ].map(path => path.replace('{file}', file));
}

function sodapopSetImageSource(img, file) {
    const candidates = sodapopAssetCandidates(file);
    let index = 0;
    const tryNext = () => {
        if (index >= candidates.length) { img.onerror = null; return; }
        img.src = candidates[index++];
    };
    img.onerror = tryNext;
    tryNext();
}

function sodapopLoadAudioFromCandidates(audio, candidates) {
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

function sodapopSetIntroBop(active) {
    sodapopIntroActive = active;
    if (!sodapopBackground) return;
    for (const item of sodapopBackground.querySelectorAll('.sodapop-intro-bop-target')) {
        item.classList.toggle('sodapop-intro-bop', active);
    }
}

function sodapopCreateItem(index, file, slot) {
    if (!sodapopBackground) return;
    const item = document.createElement('img');
    item.className = 'sodapop-item';
    item.alt = '';
    item.draggable = false;
    item.setAttribute('aria-hidden', 'true');
    sodapopSetImageSource(item, file);
    item.style.left = `${slot.x + sodapopRandom(-0.45, 0.45)}%`;
    item.style.top = `${slot.y + sodapopRandom(-0.5, 0.5)}%`;
    item.style.width = `${sodapopRandom(slot.min, slot.max)}px`;
    item.style.zIndex = String(index + 1);
    item.style.setProperty('--sodapop-float-x', `${sodapopRandom(-5, 5)}px`);
    item.style.setProperty('--sodapop-float-y', `${sodapopRandom(-6, 6)}px`);
    item.style.setProperty('--sodapop-float-r', `${sodapopRandom(-3, 3)}deg`);
    item.style.setProperty('--sodapop-float-duration', `${sodapopRandom(5.8, 8.9)}s`);
    item.style.setProperty('--sodapop-float-delay', `${-sodapopRandom(0, 8)}s`);
    item.style.setProperty('--sodapop-bop-delay', `${-sodapopRandom(0, .7)}s`);
    if (SODAPOP_BOP_INDEXES.has(index)) {
        item.classList.add('sodapop-intro-bop-target');
        if (sodapopIntroActive) item.classList.add('sodapop-intro-bop');
    }
    sodapopBackground.appendChild(item);
}

function sodapopCreateItems() {
    const slots = sodapopShuffle(SODAPOP_SLOTS);
    const files = sodapopShuffle(SODAPOP_FILES);
    const renderCount = Math.min(SODAPOP_RENDER_COUNT, slots.length, files.length);
    for (let i = 0; i < renderCount; i++) { sodapopCreateItem(i, files[i], slots[i]); }
}

function sodapopCreateExtras() {
    if (!sodapopBackground) return;
    for (let i = 0; i < 20; i++) {
        const a = document.createElement('span');
        a.className = 'sodapop-extra sodapop-extra-a';
        a.style.left = `${sodapopRandom(3, 97)}%`;
        a.style.top = `${sodapopRandom(5, 95)}%`;
        a.style.setProperty('--sodapop-extra-duration', `${sodapopRandom(3.8, 7.2)}s`);
        a.style.setProperty('--sodapop-extra-delay', `${-sodapopRandom(0, 8)}s`);
        a.style.setProperty('--sodapop-extra-scale', sodapopRandom(.7, 1.3).toFixed(2));
        sodapopBackground.appendChild(a);
    }
    for (let i = 0; i < 10; i++) {
        const b = document.createElement('span');
        b.className = 'sodapop-extra sodapop-extra-b';
        b.style.left = `${sodapopRandom(4, 96)}%`;
        b.style.top = `${sodapopRandom(6, 94)}%`;
        b.style.setProperty('--sodapop-extra-duration', `${sodapopRandom(4.6, 8.8)}s`);
        b.style.setProperty('--sodapop-extra-delay', `${-sodapopRandom(0, 8)}s`);
        b.style.setProperty('--sodapop-extra-scale', sodapopRandom(.78, 1.32).toFixed(2));
        sodapopBackground.appendChild(b);
    }
}

function sodapopStopIntro({ unlockHover = false } = {}) {
    if (sodapopIntroTick !== null) { cancelAnimationFrame(sodapopIntroTick); sodapopIntroTick = null; }
    if (sodapopIntroAudio) {
        try { sodapopIntroAudio.pause(); sodapopIntroAudio.currentTime = 0; sodapopIntroAudio.removeAttribute('src'); sodapopIntroAudio.load(); } catch (_) {}
        sodapopIntroAudio = null;
    }
    sodapopSetIntroBop(false);
    if (unlockHover) sodapopHoverUnlocked = true;
}

async function sodapopStartIntro() {
    sodapopStopIntro();
    sodapopHoverUnlocked = false;
    sodapopSetIntroBop(true);
    const audio = new Audio();
    audio.preload = 'auto';
    audio.volume = SODAPOP_INTRO_VOLUME;
    sodapopIntroAudio = audio;

    const finishIntro = () => {
        if (sodapopIntroAudio !== audio) return;
        try { audio.pause(); audio.volume = 0; } catch (_) {}
        sodapopIntroAudio = null;
        sodapopIntroTick = null;
        sodapopSetIntroBop(false);
        sodapopHoverUnlocked = true;
    };

    const updateIntro = () => {
        if (sodapopIntroAudio !== audio) return;
        const current = audio.currentTime || 0;
        if (!SODAPOP_INTRO_FULL && SODAPOP_INTRO_CUTOFF !== null && current >= SODAPOP_INTRO_CUTOFF) { finishIntro(); return; }
        if (!SODAPOP_INTRO_FULL && SODAPOP_INTRO_FADE_START !== null && SODAPOP_INTRO_CUTOFF !== null && current >= SODAPOP_INTRO_FADE_START) {
            const progress = Math.min(1, (current - SODAPOP_INTRO_FADE_START) / (SODAPOP_INTRO_CUTOFF - SODAPOP_INTRO_FADE_START));
            audio.volume = SODAPOP_INTRO_VOLUME * (1 - progress);
        } else {
            audio.volume = SODAPOP_INTRO_VOLUME;
        }
        sodapopIntroTick = requestAnimationFrame(updateIntro);
    };

    try {
        await sodapopLoadAudioFromCandidates(audio, SODAPOP_INTRO_SOURCES);
        audio.addEventListener('ended', finishIntro, { once: true });
        const p = audio.play();
        if (p && typeof p.then === 'function') {
            p.then(() => { if (sodapopIntroAudio === audio) sodapopIntroTick = requestAnimationFrame(updateIntro); })
             .catch(() => { if (sodapopIntroAudio === audio) sodapopStopIntro({ unlockHover: true }); });
        } else {
            sodapopIntroTick = requestAnimationFrame(updateIntro);
        }
    } catch (_) {
        if (sodapopIntroAudio === audio) sodapopStopIntro({ unlockHover: true });
    }
}

function sodapopStopHoverAudio() {
    if (sodapopHoverAudio) {
        try { sodapopHoverAudio.pause(); sodapopHoverAudio.currentTime = 0; sodapopHoverAudio.removeAttribute('src'); sodapopHoverAudio.load(); } catch (_) {}
        sodapopHoverAudio = null;
    }
}

function sodapopPlayHover() {
    if (!sodapopHoverUnlocked) return;
    if (!Array.isArray(SODAPOP_HOVER_SOUNDS) || SODAPOP_HOVER_SOUNDS.length === 0) return;
    sodapopStopHoverAudio();
    const audio = new Audio(SODAPOP_HOVER_SOUNDS[Math.floor(Math.random() * SODAPOP_HOVER_SOUNDS.length)]);
    sodapopHoverAudio = audio;
    audio.volume = SODAPOP_HOVER_VOLUME;
    const p = audio.play();
    if (p && typeof p.catch === 'function') p.catch(() => {});
}

function sodapopAnimateHover(item) {
    if (!item || typeof item.animate !== 'function') return;
    if (item._sodapopHoverAnimation) { try { item._sodapopHoverAnimation.cancel(); } catch (_) {} }
    item._sodapopHoverAnimation = item.animate([
        { translate: '0 0', rotate: '0deg', scale: '1' },
        { translate: '0 -10px', rotate: '-7deg', scale: '1.10', offset: 0.34 },
        { translate: '0 -4px', rotate: '6deg', scale: '1.05', offset: 0.70 },
        { translate: '0 0', rotate: '0deg', scale: '1' }
    ], { duration: 530, easing: 'ease-out', fill: 'none' });
    item._sodapopHoverAnimation.addEventListener('finish', () => { item._sodapopHoverAnimation = null; }, { once: true });
}

function sodapopInstallHover() {
    sodapopHoverHandler = (event) => {
        if (!sodapopBackground) return;
        let hit = null;
        for (const item of sodapopBackground.querySelectorAll('.sodapop-item')) {
            const r = item.getBoundingClientRect();
            if (event.clientX >= r.left && event.clientX <= r.right && event.clientY >= r.top && event.clientY <= r.bottom) { hit = item; break; }
        }
        if (hit && hit !== sodapopHoverLast) { sodapopHoverLast = hit; sodapopAnimateHover(hit); sodapopPlayHover(); }
        else if (!hit) { sodapopHoverLast = null; }
    };
    document.addEventListener('mousemove', sodapopHoverHandler, { passive: true });
}

function sodapopRemoveHover() {
    if (sodapopHoverHandler) document.removeEventListener('mousemove', sodapopHoverHandler);
    sodapopHoverHandler = null;
    sodapopHoverLast = null;
    sodapopStopHoverAudio();
}

export function mount() {
    if (sodapopBackground) return;
    sodapopBackground = document.createElement('div');
    sodapopBackground.id = 'sodapop-background';
    sodapopBackground.setAttribute('aria-hidden', 'true');
    document.body.appendChild(sodapopBackground);
    sodapopCreateItems();
    sodapopCreateExtras();
    sodapopInstallHover();
    sodapopStartIntro();
}

export function unmount() {
    sodapopStopIntro({ unlockHover: false });
    sodapopHoverUnlocked = false;
    sodapopRemoveHover();
    if (sodapopBackground) { sodapopBackground.remove(); sodapopBackground = null; }
}
