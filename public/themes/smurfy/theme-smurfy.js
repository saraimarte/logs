/* ============================================================
   SMURFY THEME
   Built from the winter theme's decorative mount/unmount pattern.
   ============================================================ */

let smurfyBackground = null;
let smurfyHoverHandler = null;
let smurfyHoverLast = null;
let smurfyHoverAudio = null;
let smurfyIntroAudio = null;
let smurfyIntroTick = null;
let smurfyHoverUnlocked = false;
let smurfyIntroActive = false;

const SMURFY_FILES = [
    "01-red-hat-smurf-waving.svg",
"02-blonde-smurf-waving.svg",
"03-angry-smurf.svg",
"04-gift-smurf.svg",
"05-trumpet-smurf.svg",
"06-baking-smurf.svg",
"07-book-potion-smurf.svg",
"08-red-hat-smurf-walking.svg",
"09-blonde-smurf-thumbs-up.svg",
"10-gift-smurf-walking.svg",
"11-goofy-smurf-tongue-out.svg",
"12-painter-smurf.svg",
"13-papa-smurf-reading-book.svg",
"14-strongman-smurf-dumbbell.svg",
"15-doctor-smurf.svg",
"16-drummer-smurf.svg",
"17-carpenter-smurf.svg",
"18-baker-smurf-cake.svg"
];
const SMURFY_SLOTS = [[7, 14], [9, 31], [10, 49], [12, 67], [14, 86], [93, 14], [91, 31], [90, 49], [88, 67], [86, 86], [22, 20], [78, 20], [28, 91], [72, 91]];
const SMURFY_BOP_INDEXES = new Set([0, 2, 4, 7, 10, 13, 16]);
const SMURFY_HOVER_SOUNDS = [
    "/sounds/winx/cartoon_music-arcade-game-positive-selection-bling-489760.mp3",
"/sounds/winx/freesound_community-electricity-sound-6066.mp3",
"/sounds/winx/freesound_community-match-sizzle-02-104778.mp3",
"/sounds/winx/koiroylers-get-coin-351945.mp3"
];
const SMURFY_HOVER_VOLUME = 0.42;
const SMURFY_INTRO_SOURCES = [
    "/sounds/intros/deutsche-einheits-partei-deutsche-einheits-partei-das-lied-der-linken-513408.mp3",
"/sounds/intros/deutsche-einheits-partei-deutsche-einheits-partei-das-lied-der-linken-513408"
];
const SMURFY_INTRO_CUTOFF = 20;
const SMURFY_INTRO_FADE_START = 15;
const SMURFY_INTRO_VOLUME = 0.34;
const SMURFY_RENDER_COUNT = 14;

function smurfyRandom(min, max) { return Math.random() * (max - min) + min; }

function smurfyShuffle(arr) {
    const copy = arr.slice();
    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
}

function smurfyAssetCandidates(file) {
    return [
        "/svg/theme-smurfy/{file}",
    "/svg/smurfy/{file}",
    "/svg/{file}"
    ].map(path => path.replace('{file}', file));
}

function smurfySetImageSource(img, file) {
    const candidates = smurfyAssetCandidates(file);
    let index = 0;
    const tryNext = () => {
        if (index >= candidates.length) { img.onerror = null; return; }
        img.src = candidates[index++];
    };
    img.onerror = tryNext;
    tryNext();
}

function smurfyLoadAudioFromCandidates(audio, candidates) {
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

function smurfySetIntroBop(active) {
    smurfyIntroActive = active;
    if (!smurfyBackground) return;
    for (const item of smurfyBackground.querySelectorAll('.smurfy-intro-bop-target')) {
        item.classList.toggle('smurfy-intro-bop', active);
    }
}

function smurfyCreateItem(index, file, slot) {
    if (!smurfyBackground) return;
    const item = document.createElement('img');
    item.className = 'smurfy-item';
    item.alt = '';
    item.draggable = false;
    item.setAttribute('aria-hidden', 'true');
    smurfySetImageSource(item, file);
    item.style.left = `${slot[0] + smurfyRandom(-0.0, 0.0)}%`;
    item.style.top = `${slot[1] + smurfyRandom(-0.0, 0.0)}%`;
    item.style.width = `${smurfyRandom(84, 118)}px`;
    item.style.zIndex = String(index + 1);
    item.style.setProperty('--smurfy-float-x', `${smurfyRandom(-8, 8)}px`);
    item.style.setProperty('--smurfy-float-y', `${smurfyRandom(-10, 10)}px`);
    item.style.setProperty('--smurfy-float-r', `${smurfyRandom(-5, 5)}deg`);
    item.style.setProperty('--smurfy-float-duration', `${smurfyRandom(5.7, 8.8)}s`);
    item.style.setProperty('--smurfy-float-delay', `${-smurfyRandom(0, 8)}s`);
    item.style.setProperty('--smurfy-bop-delay', `${-smurfyRandom(0, 0.7)}s`);
    if (SMURFY_BOP_INDEXES.has(index)) {
        item.classList.add('smurfy-intro-bop-target');
        if (smurfyIntroActive) item.classList.add('smurfy-intro-bop');
    }
    smurfyBackground.appendChild(item);
}

function smurfyCreateItems() {
    const slots = SMURFY_SLOTS.slice();
const files = smurfyShuffle(SMURFY_FILES);
    const renderCount = Math.min(SMURFY_RENDER_COUNT, slots.length, files.length);
    for (let i = 0; i < renderCount; i++) {
        smurfyCreateItem(i, files[i], slots[i]);
    }
}

function smurfyCreateExtras() {
    if (!smurfyBackground) return;
    for (let i = 0; i < 24; i++) {
    const bubble = document.createElement('span');
    bubble.className = 'smurfy-extra smurfy-bubble';
    bubble.style.left = `${smurfyRandom(2, 98)}%`;
    bubble.style.bottom = `${smurfyRandom(-12, 22)}%`;
    const size = smurfyRandom(6, 18);
    bubble.style.width = `${size}px`;
    bubble.style.height = `${size}px`;
    bubble.style.setProperty('--smurfy-extra-x', `${smurfyRandom(-18, 18)}px`);
    bubble.style.setProperty('--smurfy-extra-duration', `${smurfyRandom(6.4, 12.8)}s`);
    bubble.style.setProperty('--smurfy-extra-delay', `${-smurfyRandom(0, 10)}s`);
    smurfyBackground.appendChild(bubble);
}
}

function smurfyStopIntro({ unlockHover = false } = {}) {
    if (smurfyIntroTick !== null) { cancelAnimationFrame(smurfyIntroTick); smurfyIntroTick = null; }
    if (smurfyIntroAudio) {
        try { smurfyIntroAudio.pause(); smurfyIntroAudio.currentTime = 0; smurfyIntroAudio.removeAttribute('src'); smurfyIntroAudio.load(); } catch (_) {}
        smurfyIntroAudio = null;
    }
    smurfySetIntroBop(false);
    if (unlockHover) smurfyHoverUnlocked = true;
}

async function smurfyStartIntro() {
    smurfyStopIntro();
    smurfyHoverUnlocked = false;
    smurfySetIntroBop(true);
    const audio = new Audio();
    audio.preload = 'auto';
    audio.volume = SMURFY_INTRO_VOLUME;
    smurfyIntroAudio = audio;

    const finishIntro = () => {
        if (smurfyIntroAudio !== audio) return;
        try { audio.pause(); audio.volume = 0; } catch (_) {}
        smurfyIntroAudio = null;
        smurfyIntroTick = null;
        smurfySetIntroBop(false);
        smurfyHoverUnlocked = true;
    };

    const updateIntro = () => {
        if (smurfyIntroAudio !== audio) return;
        const current = audio.currentTime || 0;
        if (current >= SMURFY_INTRO_CUTOFF) { finishIntro(); return; }
        if (current >= SMURFY_INTRO_FADE_START) {
            const progress = Math.min(1, (current - SMURFY_INTRO_FADE_START) / (SMURFY_INTRO_CUTOFF - SMURFY_INTRO_FADE_START));
            audio.volume = SMURFY_INTRO_VOLUME * (1 - progress);
        } else {
            audio.volume = SMURFY_INTRO_VOLUME;
        }
        smurfyIntroTick = requestAnimationFrame(updateIntro);
    };

    try {
        await smurfyLoadAudioFromCandidates(audio, SMURFY_INTRO_SOURCES);
        const p = audio.play();
        if (p && typeof p.then === 'function') {
            p.then(() => { if (smurfyIntroAudio === audio) smurfyIntroTick = requestAnimationFrame(updateIntro); })
             .catch(() => { if (smurfyIntroAudio === audio) smurfyStopIntro({ unlockHover: true }); });
        } else {
            smurfyIntroTick = requestAnimationFrame(updateIntro);
        }
    } catch (_) {
        if (smurfyIntroAudio === audio) smurfyStopIntro({ unlockHover: true });
    }
}

function smurfyStopHoverAudio() {
    if (smurfyHoverAudio) {
        try { smurfyHoverAudio.pause(); smurfyHoverAudio.currentTime = 0; smurfyHoverAudio.removeAttribute('src'); smurfyHoverAudio.load(); } catch (_) {}
        smurfyHoverAudio = null;
    }
}

function smurfyPlayHover() {
    if (!smurfyHoverUnlocked) return;
    smurfyStopHoverAudio();
    const audio = new Audio(SMURFY_HOVER_SOUNDS[Math.floor(Math.random() * SMURFY_HOVER_SOUNDS.length)]);
    smurfyHoverAudio = audio;
    audio.volume = SMURFY_HOVER_VOLUME;
    const p = audio.play();
    if (p && typeof p.catch === 'function') p.catch(() => {});
}

function smurfyAnimateHover(item) {
    if (!item || typeof item.animate !== 'function') return;
    if (item._smurfyHoverAnimation) { try { item._smurfyHoverAnimation.cancel(); } catch (_) {} }
    item._smurfyHoverAnimation = item.animate([
        { translate: '0 0', rotate: '0deg', scale: '1' },
        { translate: '0 -10px', rotate: '-8deg', scale: '1.10', offset: 0.34 },
        { translate: '0 -4px', rotate: '7deg', scale: '1.06', offset: 0.70 },
        { translate: '0 0', rotate: '0deg', scale: '1' }
    ], { duration: 540, easing: 'ease-out', fill: 'none' });
    item._smurfyHoverAnimation.addEventListener('finish', () => { item._smurfyHoverAnimation = null; }, { once: true });
}

function smurfyInstallHover() {
    smurfyHoverHandler = (event) => {
        if (!smurfyBackground) return;
        let hit = null;
        for (const item of smurfyBackground.querySelectorAll('.smurfy-item')) {
            const r = item.getBoundingClientRect();
            if (event.clientX >= r.left && event.clientX <= r.right && event.clientY >= r.top && event.clientY <= r.bottom) { hit = item; break; }
        }
        if (hit && hit !== smurfyHoverLast) { smurfyHoverLast = hit; smurfyAnimateHover(hit); smurfyPlayHover(); }
        else if (!hit) { smurfyHoverLast = null; }
    };
    document.addEventListener('mousemove', smurfyHoverHandler, { passive: true });
}

function smurfyRemoveHover() {
    if (smurfyHoverHandler) document.removeEventListener('mousemove', smurfyHoverHandler);
    smurfyHoverHandler = null;
    smurfyHoverLast = null;
    smurfyStopHoverAudio();
}

export function mount() {
    if (smurfyBackground) return;
    smurfyBackground = document.createElement('div');
    smurfyBackground.id = 'smurfy-background';
    smurfyBackground.setAttribute('aria-hidden', 'true');
    document.body.appendChild(smurfyBackground);
    smurfyCreateItems();
    smurfyCreateExtras();
    smurfyInstallHover();
    smurfyStartIntro();
}

export function unmount() {
    smurfyStopIntro();
    smurfyHoverUnlocked = false;
    smurfyRemoveHover();
    if (smurfyBackground) { smurfyBackground.remove(); smurfyBackground = null; }
}
