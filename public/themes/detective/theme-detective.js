/* ============================================================
   DETECTIVE THEME
   Built from the winter theme mount/unmount structure.
   ============================================================ */

let detectiveBackground = null;
let detectiveHoverHandler = null;
let detectiveHoverLast = null;
let detectiveHoverAudio = null;
let detectiveIntroAudio = null;
let detectiveIntroTick = null;
let detectiveHoverUnlocked = false;
let detectiveIntroActive = false;

const DETECTIVE_FILES = [
    "theme-detective-01.svg",
    "theme-detective-02.svg",
    "theme-detective-03.svg",
    "theme-detective-04.svg",
    "theme-detective-05.svg",
    "theme-detective-06.svg",
    "theme-detective-07.svg",
    "theme-detective-08.svg",
    "theme-detective-09.svg",
    "theme-detective-11.svg",
    "theme-detective-12.svg",
    "theme-detective-14.svg",
    "theme-detective-15.svg",
    "theme-detective-17.svg"
];
const DETECTIVE_SLOTS = [{"x": 8, "y": 16, "min": 142, "max": 186}, {"x": 8, "y": 34, "min": 146, "max": 190}, {"x": 8, "y": 54, "min": 148, "max": 192}, {"x": 10, "y": 74, "min": 150, "max": 198}, {"x": 24, "y": 89, "min": 148, "max": 194}, {"x": 40, "y": 90, "min": 150, "max": 198}, {"x": 60, "y": 90, "min": 150, "max": 198}, {"x": 76, "y": 89, "min": 148, "max": 194}, {"x": 92, "y": 16, "min": 142, "max": 186}, {"x": 92, "y": 34, "min": 146, "max": 190}, {"x": 92, "y": 54, "min": 148, "max": 192}, {"x": 90, "y": 74, "min": 150, "max": 198}];
const DETECTIVE_RENDER_COUNT = 12;
const DETECTIVE_BOP_INDEXES = new Set([0, 2, 5, 8]);
const DETECTIVE_HOVER_SOUNDS = [];
const DETECTIVE_HOVER_VOLUME = 0.4;
const DETECTIVE_INTRO_SOURCES = [
    "/sounds/intros/echoes_of_lumen-quirky-music-584892.mp3"
];
const DETECTIVE_INTRO_FULL = true;
const DETECTIVE_INTRO_CUTOFF = null;
const DETECTIVE_INTRO_FADE_START = null;
const DETECTIVE_INTRO_VOLUME = 0.28;

function detectiveRandom(min, max) { return Math.random() * (max - min) + min; }

function detectiveShuffle(arr) {
    const copy = arr.slice();
    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
}

function detectiveAssetCandidates(file) {
    return [
        "/svg/theme-detective/{file}",
        "/svg/detective/{file}",
        "/svg/{file}"
    ].map(path => path.replace('{file}', file));
}

function detectiveSetImageSource(img, file) {
    const candidates = detectiveAssetCandidates(file);
    let index = 0;
    const tryNext = () => {
        if (index >= candidates.length) { img.onerror = null; return; }
        img.src = candidates[index++];
    };
    img.onerror = tryNext;
    tryNext();
}

function detectiveLoadAudioFromCandidates(audio, candidates) {
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

function detectiveSetIntroBop(active) {
    detectiveIntroActive = active;
    if (!detectiveBackground) return;
    for (const item of detectiveBackground.querySelectorAll('.detective-intro-bop-target')) {
        item.classList.toggle('detective-intro-bop', active);
    }
}

function detectiveCreateItem(index, file, slot) {
    if (!detectiveBackground) return;
    const item = document.createElement('img');
    item.className = 'detective-item';
    item.alt = '';
    item.draggable = false;
    item.setAttribute('aria-hidden', 'true');
    detectiveSetImageSource(item, file);
    item.style.left = `${slot.x + detectiveRandom(-0.45, 0.45)}%`;
    item.style.top = `${slot.y + detectiveRandom(-0.55, 0.55)}%`;
    item.style.width = `${detectiveRandom(slot.min, slot.max)}px`;
    item.style.zIndex = String(index + 1);
    item.style.setProperty('--detective-float-x', `${detectiveRandom(-5, 5)}px`);
    item.style.setProperty('--detective-float-y', `${detectiveRandom(-6, 6)}px`);
    item.style.setProperty('--detective-float-r', `${detectiveRandom(-3, 3)}deg`);
    item.style.setProperty('--detective-float-duration', `${detectiveRandom(5.8, 8.9)}s`);
    item.style.setProperty('--detective-float-delay', `${-detectiveRandom(0, 8)}s`);
    item.style.setProperty('--detective-bop-delay', `${-detectiveRandom(0, .7)}s`);
    if (DETECTIVE_BOP_INDEXES.has(index)) {
        item.classList.add('detective-intro-bop-target');
        if (detectiveIntroActive) item.classList.add('detective-intro-bop');
    }
    detectiveBackground.appendChild(item);
}

function detectiveCreateItems() {
    const slots = detectiveShuffle(DETECTIVE_SLOTS);
    const files = detectiveShuffle(DETECTIVE_FILES);
    const renderCount = Math.min(DETECTIVE_RENDER_COUNT, slots.length, files.length);
    for (let i = 0; i < renderCount; i++) { detectiveCreateItem(i, files[i], slots[i]); }
}

function detectiveCreateExtras() {
    if (!detectiveBackground) return;
    for (let i = 0; i < 20; i++) {
        const a = document.createElement('span');
        a.className = 'detective-extra detective-extra-a';
        a.style.left = `${detectiveRandom(3, 97)}%`;
        a.style.top = `${detectiveRandom(5, 95)}%`;
        a.style.setProperty('--detective-extra-duration', `${detectiveRandom(3.8, 7.2)}s`);
        a.style.setProperty('--detective-extra-delay', `${-detectiveRandom(0, 8)}s`);
        a.style.setProperty('--detective-extra-scale', detectiveRandom(.7, 1.3).toFixed(2));
        detectiveBackground.appendChild(a);
    }
    for (let i = 0; i < 10; i++) {
        const b = document.createElement('span');
        b.className = 'detective-extra detective-extra-b';
        b.style.left = `${detectiveRandom(4, 96)}%`;
        b.style.top = `${detectiveRandom(6, 94)}%`;
        b.style.setProperty('--detective-extra-duration', `${detectiveRandom(4.6, 8.8)}s`);
        b.style.setProperty('--detective-extra-delay', `${-detectiveRandom(0, 8)}s`);
        b.style.setProperty('--detective-extra-scale', detectiveRandom(.78, 1.32).toFixed(2));
        detectiveBackground.appendChild(b);
    }
}

function detectiveStopIntro({ unlockHover = false } = {}) {
    if (detectiveIntroTick !== null) { cancelAnimationFrame(detectiveIntroTick); detectiveIntroTick = null; }
    if (detectiveIntroAudio) {
        try { detectiveIntroAudio.pause(); detectiveIntroAudio.currentTime = 0; detectiveIntroAudio.removeAttribute('src'); detectiveIntroAudio.load(); } catch (_) {}
        detectiveIntroAudio = null;
    }
    detectiveSetIntroBop(false);
    if (unlockHover) detectiveHoverUnlocked = true;
}

async function detectiveStartIntro() {
    detectiveStopIntro();
    detectiveHoverUnlocked = false;
    detectiveSetIntroBop(true);
    const audio = new Audio();
    audio.preload = 'auto';
    audio.volume = DETECTIVE_INTRO_VOLUME;
    detectiveIntroAudio = audio;

    const finishIntro = () => {
        if (detectiveIntroAudio !== audio) return;
        try { audio.pause(); audio.volume = 0; } catch (_) {}
        detectiveIntroAudio = null;
        detectiveIntroTick = null;
        detectiveSetIntroBop(false);
        detectiveHoverUnlocked = true;
    };

    const updateIntro = () => {
        if (detectiveIntroAudio !== audio) return;
        const current = audio.currentTime || 0;
        if (!DETECTIVE_INTRO_FULL && DETECTIVE_INTRO_CUTOFF !== null && current >= DETECTIVE_INTRO_CUTOFF) { finishIntro(); return; }
        if (!DETECTIVE_INTRO_FULL && DETECTIVE_INTRO_FADE_START !== null && DETECTIVE_INTRO_CUTOFF !== null && current >= DETECTIVE_INTRO_FADE_START) {
            const progress = Math.min(1, (current - DETECTIVE_INTRO_FADE_START) / (DETECTIVE_INTRO_CUTOFF - DETECTIVE_INTRO_FADE_START));
            audio.volume = DETECTIVE_INTRO_VOLUME * (1 - progress);
        } else {
            audio.volume = DETECTIVE_INTRO_VOLUME;
        }
        detectiveIntroTick = requestAnimationFrame(updateIntro);
    };

    try {
        await detectiveLoadAudioFromCandidates(audio, DETECTIVE_INTRO_SOURCES);
        audio.addEventListener('ended', finishIntro, { once: true });
        const p = audio.play();
        if (p && typeof p.then === 'function') {
            p.then(() => { if (detectiveIntroAudio === audio) detectiveIntroTick = requestAnimationFrame(updateIntro); })
             .catch(() => { if (detectiveIntroAudio === audio) detectiveStopIntro({ unlockHover: true }); });
        } else {
            detectiveIntroTick = requestAnimationFrame(updateIntro);
        }
    } catch (_) {
        if (detectiveIntroAudio === audio) detectiveStopIntro({ unlockHover: true });
    }
}

function detectiveStopHoverAudio() {
    if (detectiveHoverAudio) {
        try { detectiveHoverAudio.pause(); detectiveHoverAudio.currentTime = 0; detectiveHoverAudio.removeAttribute('src'); detectiveHoverAudio.load(); } catch (_) {}
        detectiveHoverAudio = null;
    }
}

function detectivePlayHover() {
    if (!detectiveHoverUnlocked) return;
    if (!Array.isArray(DETECTIVE_HOVER_SOUNDS) || DETECTIVE_HOVER_SOUNDS.length === 0) return;
    detectiveStopHoverAudio();
    const audio = new Audio(DETECTIVE_HOVER_SOUNDS[Math.floor(Math.random() * DETECTIVE_HOVER_SOUNDS.length)]);
    detectiveHoverAudio = audio;
    audio.volume = DETECTIVE_HOVER_VOLUME;
    const p = audio.play();
    if (p && typeof p.catch === 'function') p.catch(() => {});
}

function detectiveAnimateHover(item) {
    if (!item || typeof item.animate !== 'function') return;
    if (item._detectiveHoverAnimation) { try { item._detectiveHoverAnimation.cancel(); } catch (_) {} }
    item._detectiveHoverAnimation = item.animate([
        { translate: '0 0', rotate: '0deg', scale: '1' },
        { translate: '0 -10px', rotate: '-7deg', scale: '1.10', offset: 0.34 },
        { translate: '0 -4px', rotate: '6deg', scale: '1.05', offset: 0.70 },
        { translate: '0 0', rotate: '0deg', scale: '1' }
    ], { duration: 530, easing: 'ease-out', fill: 'none' });
    item._detectiveHoverAnimation.addEventListener('finish', () => { item._detectiveHoverAnimation = null; }, { once: true });
}

function detectiveInstallHover() {
    detectiveHoverHandler = (event) => {
        if (!detectiveBackground) return;
        let hit = null;
        for (const item of detectiveBackground.querySelectorAll('.detective-item')) {
            const r = item.getBoundingClientRect();
            if (event.clientX >= r.left && event.clientX <= r.right && event.clientY >= r.top && event.clientY <= r.bottom) { hit = item; break; }
        }
        if (hit && hit !== detectiveHoverLast) { detectiveHoverLast = hit; detectiveAnimateHover(hit); detectivePlayHover(); }
        else if (!hit) { detectiveHoverLast = null; }
    };
    document.addEventListener('mousemove', detectiveHoverHandler, { passive: true });
}

function detectiveRemoveHover() {
    if (detectiveHoverHandler) document.removeEventListener('mousemove', detectiveHoverHandler);
    detectiveHoverHandler = null;
    detectiveHoverLast = null;
    detectiveStopHoverAudio();
}

export function mount() {
    if (detectiveBackground) return;
    detectiveBackground = document.createElement('div');
    detectiveBackground.id = 'detective-background';
    detectiveBackground.setAttribute('aria-hidden', 'true');
    document.body.appendChild(detectiveBackground);
    detectiveCreateItems();
    detectiveCreateExtras();
    detectiveInstallHover();
    detectiveStartIntro();
}

export function unmount() {
    detectiveStopIntro({ unlockHover: false });
    detectiveHoverUnlocked = false;
    detectiveRemoveHover();
    if (detectiveBackground) { detectiveBackground.remove(); detectiveBackground = null; }
}
