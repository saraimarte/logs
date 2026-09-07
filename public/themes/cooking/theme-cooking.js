
/* ============================================================
   COOKING THEME
   Built from the winter theme structure.
   Decorative only: no app layout or app logic changes.
   ============================================================ */

let cookingBackground = null;
let cookingHoverHandler = null;
let cookingHoverLast = null;
let cookingHoverAudio = null;
let cookingIntroAudio = null;
let cookingIntroTick = null;
let cookingHoverUnlocked = false;
let cookingIntroActive = false;

const COOKING_FILES = [
    "cooking-01-sashimi-bowl.svg",
    "cooking-02-udon-bowl.svg",
    "cooking-03-katsu-egg-bowl.svg",
    "cooking-04-teriyaki-chicken-rice.svg",
    "cooking-05-ramen-bowl.svg",
    "cooking-06-stir-fried-noodles.svg",
    "cooking-07-unagi-rice-bowl.svg",
    "cooking-08-japanese-curry-rice.svg",
    "cooking-09-fried-shrimp-plate.svg",
    "cooking-10-chips-guacamole.svg",
    "cooking-11-salmon-salad.svg",
    "cooking-12-cheesy-spicy-bowl.svg",
    "cooking-13-dumplings.svg",
    "cooking-14-ridged-potato-chips.svg",
    "cooking-15-avocado-toast-plate.svg",
    "cooking-16-spicy-rice-egg-bowl.svg",
    "cooking-17-egg-rice-bowl.svg",
    "cooking-18-ramen-bowl.svg",
    "cooking-19-avocado-toast.svg",
    "cooking-21-strawberry-yogurt-toast.svg",
    "cooking-23-chocolate-raspberry-toast.svg",
    "cooking-24-peanut-butter-banana-toast.svg",
    "cooking-26-ricotta-pistachio-toast.svg",
    "cooking-27-peanut-butter-strawberry-toast.svg",
    "cooking-34-salmon-roe-gunkan.svg",
    "cooking-36-salmon-roll.svg"
];
const COOKING_SLOTS = [{"x": 7, "y": 18, "min": 98, "max": 132}, {"x": 8, "y": 37, "min": 102, "max": 138}, {"x": 9, "y": 57, "min": 104, "max": 140}, {"x": 11, "y": 77, "min": 106, "max": 144}, {"x": 20, "y": 90, "min": 108, "max": 148}, {"x": 36, "y": 90, "min": 108, "max": 148}, {"x": 52, "y": 90, "min": 108, "max": 148}, {"x": 68, "y": 90, "min": 108, "max": 148}, {"x": 84, "y": 90, "min": 108, "max": 148}, {"x": 93, "y": 18, "min": 98, "max": 132}, {"x": 92, "y": 37, "min": 102, "max": 138}, {"x": 91, "y": 57, "min": 104, "max": 140}, {"x": 89, "y": 77, "min": 106, "max": 144}, {"x": 28, "y": 14, "min": 94, "max": 126}, {"x": 50, "y": 14, "min": 94, "max": 126}, {"x": 72, "y": 14, "min": 94, "max": 126}];
const COOKING_RENDER_COUNT = 16;
const COOKING_BOP_INDEXES = new Set([0, 2, 5, 8, 12]);
const COOKING_HOVER_SOUNDS = [
    "/sounds/winx/cartoon_music-arcade-game-positive-selection-bling-489760.mp3",
    "/sounds/winx/freesound_community-electricity-sound-6066.mp3",
    "/sounds/winx/freesound_community-match-sizzle-02-104778.mp3",
    "/sounds/winx/koiroylers-get-coin-351945.mp3"
];
const COOKING_HOVER_VOLUME = 0.42;
const COOKING_INTRO_SOURCES = [
    "/sounds/intros/alex-morgan-gypsy-jazz-sunny-cafe-556685.mp3",
    "/sounds/intros/alex-morgan-gypsy-jazz-sunny-cafe-556685"
];
const COOKING_INTRO_FULL = false;
const COOKING_INTRO_CUTOFF = 20;
const COOKING_INTRO_FADE_START = 16;
const COOKING_INTRO_VOLUME = 0.3;

function cookingRandom(min, max) { return Math.random() * (max - min) + min; }

function cookingShuffle(arr) {
    const copy = arr.slice();
    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
}

function cookingAssetCandidates(file) {
    return [
        "/svg/cooking/{file}",
        "/svg/theme-cooking/{file}",
        "/svg/{file}"
].map(path => path.replace('{file}', file));
}

function cookingSetImageSource(img, file) {
    const candidates = cookingAssetCandidates(file);
    let index = 0;
    const tryNext = () => {
        if (index >= candidates.length) { img.onerror = null; return; }
        img.src = candidates[index++];
    };
    img.onerror = tryNext;
    tryNext();
}

function cookingLoadAudioFromCandidates(audio, candidates) {
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

function cookingSetIntroBop(active) {
    cookingIntroActive = active;
    if (!cookingBackground) return;
    for (const item of cookingBackground.querySelectorAll('.cooking-intro-bop-target')) {
        item.classList.toggle('cooking-intro-bop', active);
    }
}

function cookingCreateItem(index, file, slot) {
    if (!cookingBackground) return;
    const item = document.createElement('img');
    item.className = 'cooking-item';
    item.alt = '';
    item.draggable = false;
    item.setAttribute('aria-hidden', 'true');
    cookingSetImageSource(item, file);
    item.style.left = `${slot.x + cookingRandom(-0.75, 0.75)}%`;
    item.style.top = `${slot.y + cookingRandom(-0.85, 0.85)}%`;
    item.style.width = `${cookingRandom(slot.min, slot.max)}px`;
    item.style.zIndex = String(index + 1);
    item.style.setProperty('--cooking-float-x', `${cookingRandom(-8, 8)}px`);
    item.style.setProperty('--cooking-float-y', `${cookingRandom(-9, 9)}px`);
    item.style.setProperty('--cooking-float-r', `${cookingRandom(-4, 4)}deg`);
    item.style.setProperty('--cooking-float-duration', `${cookingRandom(6.0, 9.0)}s`);
    item.style.setProperty('--cooking-float-delay', `${-cookingRandom(0, 8)}s`);
    item.style.setProperty('--cooking-bop-delay', `${-cookingRandom(0, .7)}s`);
    if (COOKING_BOP_INDEXES.has(index)) {
        item.classList.add('cooking-intro-bop-target');
        if (cookingIntroActive) item.classList.add('cooking-intro-bop');
    }
    cookingBackground.appendChild(item);
}

function cookingCreateItems() {
    const slots = cookingShuffle(COOKING_SLOTS);
    const files = cookingShuffle(COOKING_FILES);
    const renderCount = Math.min(COOKING_RENDER_COUNT, slots.length, files.length);
    for (let i = 0; i < renderCount; i++) { cookingCreateItem(i, files[i], slots[i]); }
}

function cookingCreateExtras() {
    if (!cookingBackground) return;
    for (let i = 0; i < 16; i++) {
        const a = document.createElement('span');
        a.className = 'cooking-extra cooking-extra-a';
        a.style.left = `${cookingRandom(4, 96)}%`;
        a.style.top = `${cookingRandom(6, 94)}%`;
        a.style.setProperty('--cooking-extra-duration', `${cookingRandom(4.2, 8.0)}s`);
        a.style.setProperty('--cooking-extra-delay', `${-cookingRandom(0, 8)}s`);
        a.style.setProperty('--cooking-extra-scale', cookingRandom(.72, 1.26).toFixed(2));
        cookingBackground.appendChild(a);
    }
    for (let i = 0; i < 10; i++) {
        const b = document.createElement('span');
        b.className = 'cooking-extra cooking-extra-b';
        b.style.left = `${cookingRandom(4, 96)}%`;
        b.style.top = `${cookingRandom(6, 94)}%`;
        b.style.setProperty('--cooking-extra-duration', `${cookingRandom(5.0, 9.0)}s`);
        b.style.setProperty('--cooking-extra-delay', `${-cookingRandom(0, 8)}s`);
        b.style.setProperty('--cooking-extra-scale', cookingRandom(.78, 1.34).toFixed(2));
        cookingBackground.appendChild(b);
    }
}

function cookingStopIntro({ unlockHover = false } = {}) {
    if (cookingIntroTick !== null) { cancelAnimationFrame(cookingIntroTick); cookingIntroTick = null; }
    if (cookingIntroAudio) {
        try { cookingIntroAudio.pause(); cookingIntroAudio.currentTime = 0; cookingIntroAudio.removeAttribute('src'); cookingIntroAudio.load(); } catch (_) {}
        cookingIntroAudio = null;
    }
    cookingSetIntroBop(false);
    if (unlockHover) cookingHoverUnlocked = true;
}

async function cookingStartIntro() {
    cookingStopIntro();
    cookingHoverUnlocked = false;
    cookingSetIntroBop(true);
    const audio = new Audio();
    audio.preload = 'auto';
    audio.volume = COOKING_INTRO_VOLUME;
    cookingIntroAudio = audio;

    const finishIntro = () => {
        if (cookingIntroAudio !== audio) return;
        try { audio.pause(); audio.volume = 0; } catch (_) {}
        cookingIntroAudio = null;
        cookingIntroTick = null;
        cookingSetIntroBop(false);
        cookingHoverUnlocked = true;
    };

    const updateIntro = () => {
        if (cookingIntroAudio !== audio) return;
        const current = audio.currentTime || 0;
        if (!COOKING_INTRO_FULL && COOKING_INTRO_CUTOFF !== null && current >= COOKING_INTRO_CUTOFF) { finishIntro(); return; }
        if (!COOKING_INTRO_FULL && COOKING_INTRO_FADE_START !== null && COOKING_INTRO_CUTOFF !== null && current >= COOKING_INTRO_FADE_START) {
            const progress = Math.min(1, (current - COOKING_INTRO_FADE_START) / (COOKING_INTRO_CUTOFF - COOKING_INTRO_FADE_START));
            audio.volume = COOKING_INTRO_VOLUME * (1 - progress);
        } else {
            audio.volume = COOKING_INTRO_VOLUME;
        }
        cookingIntroTick = requestAnimationFrame(updateIntro);
    };

    try {
        await cookingLoadAudioFromCandidates(audio, COOKING_INTRO_SOURCES);
        const p = audio.play();
        if (p && typeof p.then === 'function') {
            p.then(() => { if (cookingIntroAudio === audio) cookingIntroTick = requestAnimationFrame(updateIntro); })
             .catch(() => { if (cookingIntroAudio === audio) cookingStopIntro({ unlockHover: true }); });
        } else {
            cookingIntroTick = requestAnimationFrame(updateIntro);
        }
    } catch (_) {
        if (cookingIntroAudio === audio) cookingStopIntro({ unlockHover: true });
    }
}

function cookingStopHoverAudio() {
    if (cookingHoverAudio) {
        try { cookingHoverAudio.pause(); cookingHoverAudio.currentTime = 0; cookingHoverAudio.removeAttribute('src'); cookingHoverAudio.load(); } catch (_) {}
        cookingHoverAudio = null;
    }
}

function cookingPlayHover() {
    if (!cookingHoverUnlocked) return;
    if (!Array.isArray(COOKING_HOVER_SOUNDS) || COOKING_HOVER_SOUNDS.length === 0) return;
    cookingStopHoverAudio();
    const audio = new Audio(COOKING_HOVER_SOUNDS[Math.floor(Math.random() * COOKING_HOVER_SOUNDS.length)]);
    cookingHoverAudio = audio;
    audio.volume = COOKING_HOVER_VOLUME;
    const p = audio.play();
    if (p && typeof p.catch === 'function') p.catch(() => {});
}

function cookingAnimateHover(item) {
    if (!item || typeof item.animate !== 'function') return;
    if (item._cookingHoverAnimation) { try { item._cookingHoverAnimation.cancel(); } catch (_) {} }
    item._cookingHoverAnimation = item.animate([
        { translate: '0 0', rotate: '0deg', scale: '1' },
        { translate: '0 -10px', rotate: '-7deg', scale: '1.09', offset: 0.34 },
        { translate: '0 -4px', rotate: '5deg', scale: '1.04', offset: 0.72 },
        { translate: '0 0', rotate: '0deg', scale: '1' }
    ], { duration: 520, easing: 'ease-out', fill: 'none' });
    item._cookingHoverAnimation.addEventListener('finish', () => { item._cookingHoverAnimation = null; }, { once: true });
}

function cookingInstallHover() {
    cookingHoverHandler = (event) => {
        if (!cookingBackground) return;
        let hit = null;
        for (const item of cookingBackground.querySelectorAll('.cooking-item')) {
            const rect = item.getBoundingClientRect();
            if (event.clientX >= rect.left && event.clientX <= rect.right && event.clientY >= rect.top && event.clientY <= rect.bottom) { hit = item; break; }
        }
        if (hit && hit !== cookingHoverLast) {
            cookingHoverLast = hit;
            cookingAnimateHover(hit);
            cookingPlayHover();
        } else if (!hit) {
            cookingHoverLast = null;
        }
    };
    document.addEventListener('mousemove', cookingHoverHandler, { passive: true });
}

function cookingRemoveHover() {
    if (cookingHoverHandler) document.removeEventListener('mousemove', cookingHoverHandler);
    cookingHoverHandler = null;
    cookingHoverLast = null;
    cookingStopHoverAudio();
}

export function mount() {
    if (cookingBackground) return;
    cookingBackground = document.createElement('div');
    cookingBackground.id = 'cooking-background';
    cookingBackground.setAttribute('aria-hidden', 'true');
    document.body.appendChild(cookingBackground);
    cookingCreateItems();
    cookingCreateExtras();
    cookingInstallHover();
    cookingStartIntro();
}

export function unmount() {
    cookingStopIntro();
    cookingHoverUnlocked = false;
    cookingRemoveHover();
    if (cookingBackground) { cookingBackground.remove(); cookingBackground = null; }
}
