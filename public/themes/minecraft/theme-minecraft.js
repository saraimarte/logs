/* ============================================================
   MINECRAFT THEME
   Built from the winter theme mount/unmount structure.
   ============================================================ */

let minecraftBackground = null;
let minecraftHoverHandler = null;
let minecraftHoverLast = null;
let minecraftHoverAudio = null;
let minecraftIntroAudio = null;
let minecraftIntroTick = null;
let minecraftHoverUnlocked = false;
let minecraftIntroActive = false;

const MINECRAFT_FILES = [
    "minecraft-01.svg",
    "minecraft-02.svg",
    "minecraft-03.svg",
    "minecraft-04.svg",
    "minecraft-05.svg",
    "minecraft-06.svg",
    "minecraft-07.svg",
    "minecraft-08.svg",
    "minecraft-09.svg"
];
const MINECRAFT_SLOTS = [{"x": 10, "y": 43, "min": 96, "max": 126}, {"x": 24, "y": 54, "min": 96, "max": 126}, {"x": 40, "y": 66, "min": 100, "max": 130}, {"x": 57, "y": 57, "min": 98, "max": 128}, {"x": 73, "y": 47, "min": 96, "max": 126}, {"x": 89, "y": 58, "min": 96, "max": 126}, {"x": 17, "y": 83, "min": 102, "max": 134}, {"x": 50, "y": 87, "min": 104, "max": 136}, {"x": 83, "y": 82, "min": 102, "max": 134}];
const MINECRAFT_RENDER_COUNT = 9;
const MINECRAFT_BOP_INDEXES = new Set([0, 2, 5, 7]);
const MINECRAFT_HOVER_SOUNDS = [];
const MINECRAFT_HOVER_VOLUME = 0.4;
const MINECRAFT_INTRO_SOURCES = [
    "/sounds/intros/slimeyfox-hyperarcade-laserbyte-563844.mp3"
];
const MINECRAFT_INTRO_FULL = false;
const MINECRAFT_INTRO_CUTOFF = 35;
const MINECRAFT_INTRO_FADE_START = 30;
const MINECRAFT_INTRO_VOLUME = 0.3;

function minecraftRandom(min, max) { return Math.random() * (max - min) + min; }

function minecraftShuffle(arr) {
    const copy = arr.slice();
    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
}

function minecraftAssetCandidates(file) {
    return [
        "/svg/minecraft/{file}",
        "/svg/theme-minecraft/{file}",
        "/svg/{file}"
    ].map(path => path.replace('{file}', file));
}

function minecraftSetImageSource(img, file) {
    const candidates = minecraftAssetCandidates(file);
    let index = 0;
    const tryNext = () => {
        if (index >= candidates.length) { img.onerror = null; return; }
        img.src = candidates[index++];
    };
    img.onerror = tryNext;
    tryNext();
}

function minecraftLoadAudioFromCandidates(audio, candidates) {
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

function minecraftSetIntroBop(active) {
    minecraftIntroActive = active;
    if (!minecraftBackground) return;
    for (const item of minecraftBackground.querySelectorAll('.minecraft-intro-bop-target')) {
        item.classList.toggle('minecraft-intro-bop', active);
    }
}

function minecraftCreateItem(index, file, slot) {
    if (!minecraftBackground) return;
    const item = document.createElement('img');
    item.className = 'minecraft-item';
    item.alt = '';
    item.draggable = false;
    item.setAttribute('aria-hidden', 'true');
    minecraftSetImageSource(item, file);
    item.style.left = `${slot.x + minecraftRandom(-0.5, 0.5)}%`;
    item.style.top = `${slot.y + minecraftRandom(-0.4, 0.4)}%`;
    item.style.width = `${minecraftRandom(slot.min, slot.max)}px`;
    item.style.zIndex = String(index + 1);
    item.style.setProperty('--minecraft-float-x', `${minecraftRandom(-8, 8)}px`);
    item.style.setProperty('--minecraft-float-y', `${minecraftRandom(-4, 4)}px`);
    item.style.setProperty('--minecraft-float-r', `${minecraftRandom(-5, 5)}deg`);
    item.style.setProperty('--minecraft-float-duration', `${minecraftRandom(5.8, 8.9)}s`);
    item.style.setProperty('--minecraft-float-delay', `${-minecraftRandom(0, 8)}s`);
    item.style.setProperty('--minecraft-bop-delay', `${-minecraftRandom(0, .7)}s`);
    if (MINECRAFT_BOP_INDEXES.has(index)) {
        item.classList.add('minecraft-intro-bop-target');
        if (minecraftIntroActive) item.classList.add('minecraft-intro-bop');
    }
    minecraftBackground.appendChild(item);
}

function minecraftCreateItems() {
    const slots = minecraftShuffle(MINECRAFT_SLOTS);
    const files = minecraftShuffle(MINECRAFT_FILES);
    const renderCount = Math.min(MINECRAFT_RENDER_COUNT, slots.length, files.length);
    for (let i = 0; i < renderCount; i++) { minecraftCreateItem(i, files[i], slots[i]); }
}

function minecraftCreateExtras() {
    if (!minecraftBackground) return;
    for (let i = 0; i < 20; i++) {
        const a = document.createElement('span');
        a.className = 'minecraft-extra minecraft-extra-a';
        a.style.left = `${minecraftRandom(3, 97)}%`;
        a.style.top = `${minecraftRandom(5, 95)}%`;
        a.style.setProperty('--minecraft-extra-duration', `${minecraftRandom(3.8, 7.2)}s`);
        a.style.setProperty('--minecraft-extra-delay', `${-minecraftRandom(0, 8)}s`);
        a.style.setProperty('--minecraft-extra-scale', minecraftRandom(.7, 1.3).toFixed(2));
        minecraftBackground.appendChild(a);
    }
    for (let i = 0; i < 10; i++) {
        const b = document.createElement('span');
        b.className = 'minecraft-extra minecraft-extra-b';
        b.style.left = `${minecraftRandom(4, 96)}%`;
        b.style.top = `${minecraftRandom(6, 94)}%`;
        b.style.setProperty('--minecraft-extra-duration', `${minecraftRandom(4.6, 8.8)}s`);
        b.style.setProperty('--minecraft-extra-delay', `${-minecraftRandom(0, 8)}s`);
        b.style.setProperty('--minecraft-extra-scale', minecraftRandom(.78, 1.32).toFixed(2));
        minecraftBackground.appendChild(b);
    }
}

function minecraftStopIntro({ unlockHover = false } = {}) {
    if (minecraftIntroTick !== null) { cancelAnimationFrame(minecraftIntroTick); minecraftIntroTick = null; }
    if (minecraftIntroAudio) {
        try { minecraftIntroAudio.pause(); minecraftIntroAudio.currentTime = 0; minecraftIntroAudio.removeAttribute('src'); minecraftIntroAudio.load(); } catch (_) {}
        minecraftIntroAudio = null;
    }
    minecraftSetIntroBop(false);
    if (unlockHover) minecraftHoverUnlocked = true;
}

async function minecraftStartIntro() {
    minecraftStopIntro();
    minecraftHoverUnlocked = false;
    minecraftSetIntroBop(true);
    const audio = new Audio();
    audio.preload = 'auto';
    audio.volume = MINECRAFT_INTRO_VOLUME;
    minecraftIntroAudio = audio;

    const finishIntro = () => {
        if (minecraftIntroAudio !== audio) return;
        try { audio.pause(); audio.volume = 0; } catch (_) {}
        minecraftIntroAudio = null;
        minecraftIntroTick = null;
        minecraftSetIntroBop(false);
        minecraftHoverUnlocked = true;
    };

    const updateIntro = () => {
        if (minecraftIntroAudio !== audio) return;
        const current = audio.currentTime || 0;
        if (!MINECRAFT_INTRO_FULL && MINECRAFT_INTRO_CUTOFF !== null && current >= MINECRAFT_INTRO_CUTOFF) { finishIntro(); return; }
        if (!MINECRAFT_INTRO_FULL && MINECRAFT_INTRO_FADE_START !== null && MINECRAFT_INTRO_CUTOFF !== null && current >= MINECRAFT_INTRO_FADE_START) {
            const progress = Math.min(1, (current - MINECRAFT_INTRO_FADE_START) / (MINECRAFT_INTRO_CUTOFF - MINECRAFT_INTRO_FADE_START));
            audio.volume = MINECRAFT_INTRO_VOLUME * (1 - progress);
        } else {
            audio.volume = MINECRAFT_INTRO_VOLUME;
        }
        minecraftIntroTick = requestAnimationFrame(updateIntro);
    };

    try {
        await minecraftLoadAudioFromCandidates(audio, MINECRAFT_INTRO_SOURCES);
        audio.addEventListener('ended', finishIntro, { once: true });
        const p = audio.play();
        if (p && typeof p.then === 'function') {
            p.then(() => { if (minecraftIntroAudio === audio) minecraftIntroTick = requestAnimationFrame(updateIntro); })
             .catch(() => { if (minecraftIntroAudio === audio) minecraftStopIntro({ unlockHover: true }); });
        } else {
            minecraftIntroTick = requestAnimationFrame(updateIntro);
        }
    } catch (_) {
        if (minecraftIntroAudio === audio) minecraftStopIntro({ unlockHover: true });
    }
}

function minecraftStopHoverAudio() {
    if (minecraftHoverAudio) {
        try { minecraftHoverAudio.pause(); minecraftHoverAudio.currentTime = 0; minecraftHoverAudio.removeAttribute('src'); minecraftHoverAudio.load(); } catch (_) {}
        minecraftHoverAudio = null;
    }
}

function minecraftPlayHover() {
    if (!minecraftHoverUnlocked) return;
    if (!Array.isArray(MINECRAFT_HOVER_SOUNDS) || MINECRAFT_HOVER_SOUNDS.length === 0) return;
    minecraftStopHoverAudio();
    const audio = new Audio(MINECRAFT_HOVER_SOUNDS[Math.floor(Math.random() * MINECRAFT_HOVER_SOUNDS.length)]);
    minecraftHoverAudio = audio;
    audio.volume = MINECRAFT_HOVER_VOLUME;
    const p = audio.play();
    if (p && typeof p.catch === 'function') p.catch(() => {});
}

function minecraftAnimateHover(item) {
    if (!item || typeof item.animate !== 'function') return;
    if (item._minecraftHoverAnimation) { try { item._minecraftHoverAnimation.cancel(); } catch (_) {} }
    item._minecraftHoverAnimation = item.animate([
        { translate: '0 0', rotate: '0deg', scale: '1' },
        { translate: '0 -10px', rotate: '-7deg', scale: '1.10', offset: 0.34 },
        { translate: '0 -4px', rotate: '6deg', scale: '1.05', offset: 0.70 },
        { translate: '0 0', rotate: '0deg', scale: '1' }
    ], { duration: 530, easing: 'ease-out', fill: 'none' });
    item._minecraftHoverAnimation.addEventListener('finish', () => { item._minecraftHoverAnimation = null; }, { once: true });
}

function minecraftInstallHover() {
    minecraftHoverHandler = (event) => {
        if (!minecraftBackground) return;
        let hit = null;
        for (const item of minecraftBackground.querySelectorAll('.minecraft-item')) {
            const r = item.getBoundingClientRect();
            if (event.clientX >= r.left && event.clientX <= r.right && event.clientY >= r.top && event.clientY <= r.bottom) { hit = item; break; }
        }
        if (hit && hit !== minecraftHoverLast) { minecraftHoverLast = hit; minecraftAnimateHover(hit); minecraftPlayHover(); }
        else if (!hit) { minecraftHoverLast = null; }
    };
    document.addEventListener('mousemove', minecraftHoverHandler, { passive: true });
}

function minecraftRemoveHover() {
    if (minecraftHoverHandler) document.removeEventListener('mousemove', minecraftHoverHandler);
    minecraftHoverHandler = null;
    minecraftHoverLast = null;
    minecraftStopHoverAudio();
}

export function mount() {
    if (minecraftBackground) return;
    minecraftBackground = document.createElement('div');
    minecraftBackground.id = 'minecraft-background';
    minecraftBackground.setAttribute('aria-hidden', 'true');
    document.body.appendChild(minecraftBackground);
    minecraftCreateItems();
    minecraftCreateExtras();
    minecraftInstallHover();
    minecraftStartIntro();
}

export function unmount() {
    minecraftStopIntro({ unlockHover: false });
    minecraftHoverUnlocked = false;
    minecraftRemoveHover();
    if (minecraftBackground) { minecraftBackground.remove(); minecraftBackground = null; }
}
