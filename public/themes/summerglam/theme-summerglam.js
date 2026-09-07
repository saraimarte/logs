/* ============================================================
   SUMMERGLAM THEME
   Built from the winter theme's decorative mount/unmount pattern.
   ============================================================ */

let summerglamBackground = null;
let summerglamHoverHandler = null;
let summerglamHoverLast = null;
let summerglamHoverAudio = null;
let summerglamIntroAudio = null;
let summerglamIntroTick = null;
let summerglamHoverUnlocked = false;
let summerglamIntroActive = false;

const SUMMERGLAM_SVG_POOL = [
    "blush-sequin-halter-top.svg",
    "coral-ombre-sparkle-mini-dress.svg",
    "denim-butterfly-mini-skirt.svg",
    "gold-chainmail-cowl-top.svg",
    "magenta-sequin-halter-top.svg",
    "mauve-beaded-cami-top.svg",
    "multicolor-sequin-skirt.svg",
    "orange-deep-v-sequin-mini-dress.svg",
    "orange-floral-heels.svg",
    "orange-sequin-halter-mini-dress.svg",
    "orange-sequin-wrap-skirt.svg",
    "pastel-floral-tie-skirt.svg",
    "pastel-pink-embroidered-bow-skirt.svg",
    "pink-embroidered-skirt.svg",
    "pink-floral-scallop-skirt.svg",
    "pink-fringe-sequin-skirt.svg",
    "pink-glitter-grapefruit-skirt.svg",
    "pink-halter-butterfly-corset.svg",
    "pink-orange-tie-sarong-skirt.svg",
    "pink-paillette-skirt.svg",
    "pink-peach-draped-shawl.svg",
    "pink-sequin-dress.svg",
    "pink-sequin-purse.svg",
    "pink-starfish-mini-dress.svg",
    "pink-tiered-glitter-babydoll-dress.svg",
    "plum-cutout-ruffle-dress.svg",
    "rose-chainmail-halter-dress.svg",
    "sunset-gradient-sarong-skirt.svg",
    "white-sequin-fringe-corset-top.svg",
    "white-to-pink-paillette-halter-dress.svg"
];

// Keep the same general amount of decorative SVGs on screen as before,
// but choose a fresh set from the full pool every time the theme mounts.
const SUMMERGLAM_ITEM_COUNT = 21;
const SUMMERGLAM_BOP_INDEXES = new Set([1, 4, 7, 10, 13, 16, 19]);
const SUMMERGLAM_HOVER_SOUNDS = [
    "/sounds/winx/cartoon_music-arcade-game-positive-selection-bling-489760.mp3",
    "/sounds/winx/freesound_community-electricity-sound-6066.mp3",
    "/sounds/winx/freesound_community-match-sizzle-02-104778.mp3",
    "/sounds/winx/koiroylers-get-coin-351945.mp3"
];
const SUMMERGLAM_HOVER_VOLUME = 0.42;
const SUMMERGLAM_INTRO_SOURCES = [
    "/sounds/intros/sigmamusicart-upbeat-anime-background-music-285658.mp3",
    "/sounds/intros/sigmamusicart-upbeat-anime-background-music-285658"
];
const SUMMERGLAM_INTRO_CUTOFF = 32;
const SUMMERGLAM_INTRO_FADE_START = 27;
const SUMMERGLAM_INTRO_VOLUME = 0.34;

function summerglamRandom(min, max) { return Math.random() * (max - min) + min; }

function summerglamAssetCandidates(file) {
    return [
    "/svg/summerglam/{file}",
    "/svg/theme-summerglam/{file}",
    "/svg/{file}"
].map(path => path.replace('{file}', file));
}

function summerglamSetImageSource(img, file) {
    const candidates = summerglamAssetCandidates(file);
    let index = 0;
    const tryNext = () => {
        if (index >= candidates.length) { img.onerror = null; return; }
        img.src = candidates[index++];
    };
    img.onerror = tryNext;
    tryNext();
}

function summerglamLoadAudioFromCandidates(audio, candidates) {
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

function summerglamSetIntroBop(active) {
    summerglamIntroActive = active;
    if (!summerglamBackground) return;
    for (const item of summerglamBackground.querySelectorAll('.summerglam-intro-bop-target')) {
        item.classList.toggle('summerglam-intro-bop', active);
    }
}

function summerglamCreateItem(index, file) {
    if (!summerglamBackground) return;
    const item = document.createElement('img');
    item.className = 'summerglam-item';
    item.alt = '';
    item.draggable = false;
    item.setAttribute('aria-hidden', 'true');
    summerglamSetImageSource(item, file);

    const slots = [[6, 14], [8, 28], [7, 46], [9, 64], [11, 82], [18, 20], [17, 38], [20, 58], [22, 88], [94, 13], [92, 27], [93, 45], [91, 63], [89, 82], [82, 18], [84, 38], [80, 58], [78, 88], [31, 90], [50, 92], [69, 90], [50, 16]];
    const slot = slots[index % slots.length];
    item.style.left = `${slot[0] + summerglamRandom(-1.6, 1.6)}%`;
    item.style.top = `${slot[1] + summerglamRandom(-1.8, 1.8)}%`;
    item.style.width = `${summerglamRandom(90, 150)}px`;
    item.style.setProperty('--summerglam-float-x', `${summerglamRandom(-14, 14)}px`);
    item.style.setProperty('--summerglam-float-y', `${summerglamRandom(-17, 17)}px`);
    item.style.setProperty('--summerglam-float-r', `${summerglamRandom(-8, 8)}deg`);
    item.style.setProperty('--summerglam-float-duration', `${summerglamRandom(5.6, 9.0)}s`);
    item.style.setProperty('--summerglam-float-delay', `${-summerglamRandom(0, 8)}s`);
    item.style.setProperty('--summerglam-bop-delay', `${-summerglamRandom(0, .7)}s`);
    if (SUMMERGLAM_BOP_INDEXES.has(index)) {
        item.classList.add('summerglam-intro-bop-target');
        if (summerglamIntroActive) item.classList.add('summerglam-intro-bop');
    }
    summerglamBackground.appendChild(item);
}

function summerglamShuffledSvgPool() {
    const files = [...SUMMERGLAM_SVG_POOL];
    for (let i = files.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [files[i], files[j]] = [files[j], files[i]];
    }
    return files;
}

function summerglamCreateItems() {
    const selectedFiles = summerglamShuffledSvgPool().slice(0, Math.min(SUMMERGLAM_ITEM_COUNT, SUMMERGLAM_SVG_POOL.length));
    selectedFiles.forEach((file, index) => summerglamCreateItem(index, file));
}

function summerglamCreateExtras() {
    if (!summerglamBackground) return;
    for (let i = 0; i < 16; i++) { const e = document.createElement('span'); e.className = 'summerglam-extra'; e.style.left = `${summerglamRandom(4,96)}%`; e.style.top = `${summerglamRandom(6,94)}%`; e.style.setProperty('--summerglam-extra-duration', `${summerglamRandom(3.0,6.2)}s`); e.style.setProperty('--summerglam-extra-delay', `${-summerglamRandom(0,6)}s`); summerglamBackground.appendChild(e);} 
}

function summerglamStopIntro({ unlockHover = false } = {}) {
    if (summerglamIntroTick !== null) { cancelAnimationFrame(summerglamIntroTick); summerglamIntroTick = null; }
    if (summerglamIntroAudio) {
        try { summerglamIntroAudio.pause(); summerglamIntroAudio.currentTime = 0; summerglamIntroAudio.removeAttribute('src'); summerglamIntroAudio.load(); } catch (_) {}
        summerglamIntroAudio = null;
    }
    summerglamSetIntroBop(false);
    if (unlockHover) summerglamHoverUnlocked = true;
}

async function summerglamStartIntro() {
    summerglamStopIntro();
    summerglamHoverUnlocked = false;
    summerglamSetIntroBop(true);
    const audio = new Audio();
    audio.preload = 'auto';
    audio.volume = SUMMERGLAM_INTRO_VOLUME;
    summerglamIntroAudio = audio;

    const finishIntro = () => {
        if (summerglamIntroAudio !== audio) return;
        try { audio.pause(); audio.volume = 0; } catch (_) {}
        summerglamIntroAudio = null;
        summerglamIntroTick = null;
        summerglamSetIntroBop(false);
        summerglamHoverUnlocked = true;
    };

    const updateIntro = () => {
        if (summerglamIntroAudio !== audio) return;
        const current = audio.currentTime || 0;
        if (current >= SUMMERGLAM_INTRO_CUTOFF) { finishIntro(); return; }
        if (current >= SUMMERGLAM_INTRO_FADE_START) {
            const progress = Math.min(1, (current - SUMMERGLAM_INTRO_FADE_START) / (SUMMERGLAM_INTRO_CUTOFF - SUMMERGLAM_INTRO_FADE_START));
            audio.volume = SUMMERGLAM_INTRO_VOLUME * (1 - progress);
        } else {
            audio.volume = SUMMERGLAM_INTRO_VOLUME;
        }
        summerglamIntroTick = requestAnimationFrame(updateIntro);
    };

    try {
        await summerglamLoadAudioFromCandidates(audio, SUMMERGLAM_INTRO_SOURCES);
        const p = audio.play();
        if (p && typeof p.then === 'function') {
            p.then(() => { if (summerglamIntroAudio === audio) summerglamIntroTick = requestAnimationFrame(updateIntro); }).catch(() => { if (summerglamIntroAudio === audio) summerglamStopIntro({ unlockHover: true }); });
        } else {
            summerglamIntroTick = requestAnimationFrame(updateIntro);
        }
    } catch (_) {
        if (summerglamIntroAudio === audio) summerglamStopIntro({ unlockHover: true });
    }
}

function summerglamStopHoverAudio() {
    if (summerglamHoverAudio) {
        try { summerglamHoverAudio.pause(); summerglamHoverAudio.currentTime = 0; summerglamHoverAudio.removeAttribute('src'); summerglamHoverAudio.load(); } catch (_) {}
        summerglamHoverAudio = null;
    }
}

async function summerglamPlayHover() {
    if (!summerglamHoverUnlocked) return;
    summerglamStopHoverAudio();
    const choice = Math.floor(Math.random() * SUMMERGLAM_HOVER_SOUNDS.length);
    const audio = new Audio(SUMMERGLAM_HOVER_SOUNDS[choice]);
    summerglamHoverAudio = audio;
    audio.preload = 'auto';
    audio.volume = SUMMERGLAM_HOVER_VOLUME;
    const p = audio.play();
    if (p && typeof p.catch === 'function') p.catch(() => {});
}

function summerglamAnimateHover(item) {
    if (!item || typeof item.animate !== 'function') return;
    if (item._summerglamHoverAnimation) { try { item._summerglamHoverAnimation.cancel(); } catch (_) {} }
    item._summerglamHoverAnimation = item.animate([
        { translate: '0 0', rotate: '0deg', scale: '1' },
        { translate: '0 -10px', rotate: '-8deg', scale: '1.10', offset: .34 },
        { translate: '0 -4px', rotate: '7deg', scale: '1.06', offset: .70 },
        { translate: '0 0', rotate: '0deg', scale: '1' }
    ], { duration: 540, easing: 'ease-out', fill: 'none' });
    item._summerglamHoverAnimation.addEventListener('finish', () => { item._summerglamHoverAnimation = null; }, { once: true });
}

function summerglamInstallHover() {
    summerglamHoverHandler = (event) => {
        if (!summerglamBackground) return;
        let hit = null;
        for (const item of summerglamBackground.querySelectorAll('.summerglam-item')) {
            const r = item.getBoundingClientRect();
            if (event.clientX >= r.left && event.clientX <= r.right && event.clientY >= r.top && event.clientY <= r.bottom) { hit = item; break; }
        }
        if (hit && hit !== summerglamHoverLast) { summerglamHoverLast = hit; summerglamAnimateHover(hit); summerglamPlayHover(); }
        else if (!hit) { summerglamHoverLast = null; }
    };
    document.addEventListener('mousemove', summerglamHoverHandler, { passive: true });
}

function summerglamRemoveHover() {
    if (summerglamHoverHandler) document.removeEventListener('mousemove', summerglamHoverHandler);
    summerglamHoverHandler = null;
    summerglamHoverLast = null;
    summerglamStopHoverAudio();
}

export function mount() {
    if (summerglamBackground) return;
    summerglamBackground = document.createElement('div');
    summerglamBackground.id = 'summerglam-background';
    summerglamBackground.setAttribute('aria-hidden', 'true');
    document.body.appendChild(summerglamBackground);
    summerglamCreateItems();
    summerglamCreateExtras();
    summerglamInstallHover();
    summerglamStartIntro();
}

export function unmount() {
    summerglamStopIntro();
    summerglamHoverUnlocked = false;
    summerglamRemoveHover();
    if (summerglamBackground) { summerglamBackground.remove(); summerglamBackground = null; }
}
