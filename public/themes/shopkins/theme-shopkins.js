/* ============================================================
   SHOPKINS THEME
   Built from the winter theme's decorative mount/unmount pattern.
   ============================================================ */


let shopkinsBackground = null;
let shopkinsHoverHandler = null;
let shopkinsHoverLast = null;
let shopkinsHoverAudio = null;
let shopkinsIntroAudio = null;
let shopkinsIntroTick = null;
let shopkinsHoverUnlocked = false;
let shopkinsIntroActive = false;

const SHOPKINS_FILES = [
    "01-lemon.svg",
    "02-cherries.svg",
    "03-strawberry-basket.svg",
    "04-chocolate-bar.svg",
    "05-popcorn.svg",
    "06-cheese.svg",
    "07-cupcake.svg",
    "08-ice-cream-sundae.svg",
    "09-toast.svg",
    "10-cherry-sundae.svg",
    "13-blue-frosting-cupcake.svg",
    "14-green-jelly.svg",
    "18-ice-cream-bowl.svg",
    "07-cupcake.svg",
    "10-cherry-sundae.svg",
    "02-cherries.svg",
    "01-lemon.svg",
    "18-ice-cream-bowl.svg"
];
const SHOPKINS_BOP_INDEXES = new Set([0, 2, 4, 6, 9, 11]);
const SHOPKINS_HOVER_SOUNDS = [
    "/sounds/winx/cartoon_music-arcade-game-positive-selection-bling-489760.mp3",
    "/sounds/winx/freesound_community-electricity-sound-6066.mp3",
    "/sounds/winx/freesound_community-match-sizzle-02-104778.mp3",
    "/sounds/winx/koiroylers-get-coin-351945.mp3"
];
const SHOPKINS_HOVER_VOLUME = 0.42;
const SHOPKINS_INTRO_SOURCES = [
    "/sounds/intros/tech_oasis-bubblegum-pop-sugar-rush-214886.mp3",
    "/sounds/intros/tech_oasis-bubblegum-pop-sugar-rush-214886"
];
const SHOPKINS_INTRO_CUTOFF = 25;
const SHOPKINS_INTRO_FADE_START = 20;
const SHOPKINS_INTRO_VOLUME = 0.34;

function shopkinsRandom(min, max) { return Math.random() * (max - min) + min; }

function shopkinsAssetCandidates(file) {
    return [
        "/svg/shopkins/{file}",
    "/svg/theme-shopkins/{file}",
    "/svg/{file}"
    ].map(path => path.replace('{file}', file));
}

function shopkinsSetImageSource(img, file) {
    const candidates = shopkinsAssetCandidates(file);
    let index = 0;
    const tryNext = () => {
        if (index >= candidates.length) { img.onerror = null; return; }
        img.src = candidates[index++];
    };
    img.onerror = tryNext;
    tryNext();
}

function shopkinsLoadAudioFromCandidates(audio, candidates) {
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

function shopkinsSetIntroBop(active) {
    shopkinsIntroActive = active;
    if (!shopkinsBackground) return;
    for (const item of shopkinsBackground.querySelectorAll('.shopkins-intro-bop-target')) {
        item.classList.toggle('shopkins-intro-bop', active);
    }
}

function shopkinsCreateItem(index, file, slot) {
    if (!shopkinsBackground) return;
    const item = document.createElement('img');
    item.className = 'shopkins-item';
    item.alt = '';
    item.draggable = false;
    item.setAttribute('aria-hidden', 'true');
    shopkinsSetImageSource(item, file);
    item.style.left = `${slot[0] + shopkinsRandom(-1.6, 1.6)}%`;
    item.style.top = `${slot[1] + shopkinsRandom(-1.8, 1.8)}%`;
    item.style.width = `${shopkinsRandom(92, 148)}px`;
    item.style.setProperty('--shopkins-float-x', `${shopkinsRandom(-14, 14)}px`);
    item.style.setProperty('--shopkins-float-y', `${shopkinsRandom(-17, 17)}px`);
    item.style.setProperty('--shopkins-float-r', `${shopkinsRandom(-8, 8)}deg`);
    item.style.setProperty('--shopkins-float-duration', `${shopkinsRandom(5.6, 8.9)}s`);
    item.style.setProperty('--shopkins-float-delay', `${-shopkinsRandom(0, 8)}s`);
    item.style.setProperty('--shopkins-bop-delay', `${-shopkinsRandom(0, .7)}s`);
    if (SHOPKINS_BOP_INDEXES.has(index)) {
        item.classList.add('shopkins-intro-bop-target');
        if (shopkinsIntroActive) item.classList.add('shopkins-intro-bop');
    }
    shopkinsBackground.appendChild(item);
}

function shopkinsCreateItems() {
    const slots = [[4, 14], [6, 26], [8, 40], [9, 56], [10, 72], [12, 88], [18, 20], [17, 38], [19, 58], [22, 90], [95, 14], [93, 26], [92, 40], [91, 56], [90, 72], [88, 88], [82, 20], [80, 38], [78, 58], [76, 90], [30, 91], [50, 93], [70, 91], [50, 15], [86, 76], [84, 88], [72, 84], [66, 92], [94, 88]].slice();
    const files = SHOPKINS_FILES.slice();
    files.forEach((file, index) => shopkinsCreateItem(index, file, slots[index % slots.length]));
}

function shopkinsCreateExtras() {
    if (!shopkinsBackground) return;
    for (let i = 0; i < 28; i++) { const e = document.createElement('span'); e.className = 'shopkins-extra'; e.style.left = `${shopkinsRandom(2, 98)}%`; e.style.top = `${shopkinsRandom(6, 94)}%`; e.style.setProperty('--shopkins-extra-x', `${shopkinsRandom(-16, 16)}px`); e.style.setProperty('--shopkins-extra-y', `${shopkinsRandom(-10, 10)}px`); e.style.setProperty('--shopkins-extra-r', `${shopkinsRandom(-55, 55)}deg`); e.style.setProperty('--shopkins-extra-duration', `${shopkinsRandom(4.0, 7.2)}s`); e.style.setProperty('--shopkins-extra-delay', `${-shopkinsRandom(0, 7)}s`); shopkinsBackground.appendChild(e); }
}

function shopkinsStopIntro({ unlockHover = false } = {}) {
    if (shopkinsIntroTick !== null) { cancelAnimationFrame(shopkinsIntroTick); shopkinsIntroTick = null; }
    if (shopkinsIntroAudio) {
        try { shopkinsIntroAudio.pause(); shopkinsIntroAudio.currentTime = 0; shopkinsIntroAudio.removeAttribute('src'); shopkinsIntroAudio.load(); } catch (_) {}
        shopkinsIntroAudio = null;
    }
    shopkinsSetIntroBop(false);
    if (unlockHover) shopkinsHoverUnlocked = true;
}

async function shopkinsStartIntro() {
    shopkinsStopIntro();
    shopkinsHoverUnlocked = false;
    shopkinsSetIntroBop(true);
    const audio = new Audio();
    audio.preload = 'auto';
    audio.volume = SHOPKINS_INTRO_VOLUME;
    shopkinsIntroAudio = audio;

    const finishIntro = () => {
        if (shopkinsIntroAudio !== audio) return;
        try { audio.pause(); audio.volume = 0; } catch (_) {}
        shopkinsIntroAudio = null;
        shopkinsIntroTick = null;
        shopkinsSetIntroBop(false);
        shopkinsHoverUnlocked = true;
    };

    const updateIntro = () => {
        if (shopkinsIntroAudio !== audio) return;
        const current = audio.currentTime || 0;
        if (current >= SHOPKINS_INTRO_CUTOFF) { finishIntro(); return; }
        if (current >= SHOPKINS_INTRO_FADE_START) {
            const progress = Math.min(1, (current - SHOPKINS_INTRO_FADE_START) / (SHOPKINS_INTRO_CUTOFF - SHOPKINS_INTRO_FADE_START));
            audio.volume = SHOPKINS_INTRO_VOLUME * (1 - progress);
        } else {
            audio.volume = SHOPKINS_INTRO_VOLUME;
        }
        shopkinsIntroTick = requestAnimationFrame(updateIntro);
    };

    try {
        await shopkinsLoadAudioFromCandidates(audio, SHOPKINS_INTRO_SOURCES);
        const p = audio.play();
        if (p && typeof p.then === 'function') {
            p.then(() => { if (shopkinsIntroAudio === audio) shopkinsIntroTick = requestAnimationFrame(updateIntro); })
             .catch(() => { if (shopkinsIntroAudio === audio) shopkinsStopIntro({ unlockHover: true }); });
        } else {
            shopkinsIntroTick = requestAnimationFrame(updateIntro);
        }
    } catch (_) {
        if (shopkinsIntroAudio === audio) shopkinsStopIntro({ unlockHover: true });
    }
}

function shopkinsStopHoverAudio() {
    if (shopkinsHoverAudio) {
        try { shopkinsHoverAudio.pause(); shopkinsHoverAudio.currentTime = 0; shopkinsHoverAudio.removeAttribute('src'); shopkinsHoverAudio.load(); } catch (_) {}
        shopkinsHoverAudio = null;
    }
}

function shopkinsPlayHover() {
    if (!shopkinsHoverUnlocked) return;
    shopkinsStopHoverAudio();
    const audio = new Audio(SHOPKINS_HOVER_SOUNDS[Math.floor(Math.random() * SHOPKINS_HOVER_SOUNDS.length)]);
    shopkinsHoverAudio = audio;
    audio.volume = SHOPKINS_HOVER_VOLUME;
    const p = audio.play();
    if (p && typeof p.catch === 'function') p.catch(() => {});
}

function shopkinsAnimateHover(item) {
    if (!item || typeof item.animate !== 'function') return;
    if (item._shopkinsHoverAnimation) { try { item._shopkinsHoverAnimation.cancel(); } catch (_) {} }
    item._shopkinsHoverAnimation = item.animate([
        { translate: '0 0', rotate: '0deg', scale: '1' },
        { translate: '0 -10px', rotate: '-8deg', scale: '1.10', offset: .34 },
        { translate: '0 -4px', rotate: '7deg', scale: '1.06', offset: .70 },
        { translate: '0 0', rotate: '0deg', scale: '1' }
    ], { duration: 540, easing: 'ease-out', fill: 'none' });
    item._shopkinsHoverAnimation.addEventListener('finish', () => { item._shopkinsHoverAnimation = null; }, { once: true });
}

function shopkinsInstallHover() {
    shopkinsHoverHandler = (event) => {
        if (!shopkinsBackground) return;
        let hit = null;
        for (const item of shopkinsBackground.querySelectorAll('.shopkins-item')) {
            const r = item.getBoundingClientRect();
            if (event.clientX >= r.left && event.clientX <= r.right && event.clientY >= r.top && event.clientY <= r.bottom) { hit = item; break; }
        }
        if (hit && hit !== shopkinsHoverLast) { shopkinsHoverLast = hit; shopkinsAnimateHover(hit); shopkinsPlayHover(); }
        else if (!hit) { shopkinsHoverLast = null; }
    };
    document.addEventListener('mousemove', shopkinsHoverHandler, { passive: true });
}

function shopkinsRemoveHover() {
    if (shopkinsHoverHandler) document.removeEventListener('mousemove', shopkinsHoverHandler);
    shopkinsHoverHandler = null;
    shopkinsHoverLast = null;
    shopkinsStopHoverAudio();
}

export function mount() {
    if (shopkinsBackground) return;
    shopkinsBackground = document.createElement('div');
    shopkinsBackground.id = 'shopkins-background';
    shopkinsBackground.setAttribute('aria-hidden', 'true');
    document.body.appendChild(shopkinsBackground);
    shopkinsCreateItems();
    shopkinsCreateExtras();
    shopkinsInstallHover();
    shopkinsStartIntro();
}

export function unmount() {
    shopkinsStopIntro();
    shopkinsHoverUnlocked = false;
    shopkinsRemoveHover();
    if (shopkinsBackground) { shopkinsBackground.remove(); shopkinsBackground = null; }
}
