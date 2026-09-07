/* ============================================================
   ZYX THEME
   Built from the winter theme's decorative mount/unmount pattern.
   ============================================================ */

let zyxBackground = null;
let zyxHoverHandler = null;
let zyxHoverLast = null;
let zyxHoverAudio = null;
let zyxIntroAudio = null;
let zyxIntroTick = null;
let zyxHoverUnlocked = false;
let zyxIntroActive = false;

const ZYX_FILES = [
    "01-green-olive-character.svg",
    "02-brown-meatball-character.svg",
    "03-worried-green-olive-character.svg",
    "04-yellow-olive-oil-can.svg",
    "05-cherry-martini-character.svg",
    "06-cherry-cheese-stack-character.svg",
    "07-iced-donut-character.svg",
    "08-noodle-ball-character.svg",
    "09-pink-candle-character.svg",
    "blue-candle.svg",
    "bow-tie-pasta.svg",
    "cocktail-glass.svg",
    "green-candle.svg",
    "lemon-character.svg",
    "sandwich-friends.svg",
    "shy-cracker.svg",
    "wine-bottle.svg",
    "wine-glass.svg"
];
const ZYX_BOP_INDEXES = new Set([1, 4, 7, 10, 13, 16]);
const ZYX_HOVER_SOUNDS = [
    "/sounds/winx/cartoon_music-arcade-game-positive-selection-bling-489760.mp3",
    "/sounds/winx/freesound_community-electricity-sound-6066.mp3",
    "/sounds/winx/freesound_community-match-sizzle-02-104778.mp3",
    "/sounds/winx/koiroylers-get-coin-351945.mp3"
];
const ZYX_HOVER_VOLUME = 0.42;
const ZYX_INTRO_SOURCES = [
    "/sounds/intros/alanajordan-bubblegum-love-375729.mp3",
    "/sounds/intros/alanajordan-bubblegum-love-375729"
];
const ZYX_INTRO_CUTOFF = 7;
const ZYX_INTRO_FADE_START = 5;
const ZYX_INTRO_VOLUME = 0.34;

function zyxRandom(min, max) { return Math.random() * (max - min) + min; }

function zyxAssetCandidates(file) {
    return [
    "/svg/zyx/{file}",
    "/svg/theme-zyx/{file}",
    "/svg/{file}"
].map(path => path.replace('{file}', file));
}

function zyxSetImageSource(img, file) {
    const candidates = zyxAssetCandidates(file);
    let index = 0;
    const tryNext = () => {
        if (index >= candidates.length) { img.onerror = null; return; }
        img.src = candidates[index++];
    };
    img.onerror = tryNext;
    tryNext();
}

function zyxLoadAudioFromCandidates(audio, candidates) {
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

function zyxSetIntroBop(active) {
    zyxIntroActive = active;
    if (!zyxBackground) return;
    for (const item of zyxBackground.querySelectorAll('.zyx-intro-bop-target')) {
        item.classList.toggle('zyx-intro-bop', active);
    }
}

function zyxCreateItem(index, file, slot) {
    if (!zyxBackground) return;
    const item = document.createElement('img');
    item.className = 'zyx-item';
    item.alt = '';
    item.draggable = false;
    item.setAttribute('aria-hidden', 'true');
    zyxSetImageSource(item, file);
    item.style.left = `${slot[0] + zyxRandom(-1.6, 1.6)}%`;
    item.style.top = `${slot[1] + zyxRandom(-1.8, 1.8)}%`;
    item.style.width = `${zyxRandom(90, 146)}px`;
    item.style.setProperty('--zyx-float-x', `${zyxRandom(-14, 14)}px`);
    item.style.setProperty('--zyx-float-y', `${zyxRandom(-17, 17)}px`);
    item.style.setProperty('--zyx-float-r', `${zyxRandom(-8, 8)}deg`);
    item.style.setProperty('--zyx-float-duration', `${zyxRandom(5.4, 8.6)}s`);
    item.style.setProperty('--zyx-float-delay', `${-zyxRandom(0, 8)}s`);
    item.style.setProperty('--zyx-bop-delay', `${-zyxRandom(0, .7)}s`);
    if (ZYX_BOP_INDEXES.has(index)) {
        item.classList.add('zyx-intro-bop-target');
        if (zyxIntroActive) item.classList.add('zyx-intro-bop');
    }
    zyxBackground.appendChild(item);
}


function zyxCreateItems() {
    const slots = [[5, 14], [7, 26], [8, 40], [9, 56], [10, 72], [12, 88], [18, 20], [17, 38], [19, 58], [22, 90], [95, 14], [93, 26], [92, 40], [91, 56], [90, 72], [88, 88], [82, 20], [80, 38], [78, 58], [76, 90], [30, 91], [50, 93], [70, 91], [50, 15]].slice();
    const files = ZYX_FILES.slice();
    for (let i = slots.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [slots[i], slots[j]] = [slots[j], slots[i]]; } for (let i = files.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [files[i], files[j]] = [files[j], files[i]]; }
    files.forEach((file, index) => zyxCreateItem(index, file, slots[index % slots.length]));
}


function zyxCreateExtras() {
    if (!zyxBackground) return;
    for (let i = 0; i < 20; i++) { const e = document.createElement('span'); e.className = 'zyx-extra'; e.style.left = `${zyxRandom(4, 96)}%`; e.style.top = `${zyxRandom(6, 94)}%`; const size = zyxRandom(6, 14); e.style.width = `${size}px`; e.style.height = `${size}px`; e.style.setProperty('--zyx-extra-duration', `${zyxRandom(3.2, 6.2)}s`); e.style.setProperty('--zyx-extra-delay', `${-zyxRandom(0, 6)}s`); zyxBackground.appendChild(e); }
}

function zyxStopIntro({ unlockHover = false } = {}) {
    if (zyxIntroTick !== null) { cancelAnimationFrame(zyxIntroTick); zyxIntroTick = null; }
    if (zyxIntroAudio) {
        try { zyxIntroAudio.pause(); zyxIntroAudio.currentTime = 0; zyxIntroAudio.removeAttribute('src'); zyxIntroAudio.load(); } catch (_) {}
        zyxIntroAudio = null;
    }
    zyxSetIntroBop(false);
    if (unlockHover) zyxHoverUnlocked = true;
}

async function zyxStartIntro() {
    zyxStopIntro();
    zyxHoverUnlocked = false;
    zyxSetIntroBop(true);
    const audio = new Audio();
    audio.preload = 'auto';
    audio.volume = ZYX_INTRO_VOLUME;
    zyxIntroAudio = audio;

    const finishIntro = () => {
        if (zyxIntroAudio !== audio) return;
        try { audio.pause(); audio.volume = 0; } catch (_) {}
        zyxIntroAudio = null;
        zyxIntroTick = null;
        zyxSetIntroBop(false);
        zyxHoverUnlocked = true;
    };

    const updateIntro = () => {
        if (zyxIntroAudio !== audio) return;
        const current = audio.currentTime || 0;
        if (current >= ZYX_INTRO_CUTOFF) { finishIntro(); return; }
        if (current >= ZYX_INTRO_FADE_START) {
            const progress = Math.min(1, (current - ZYX_INTRO_FADE_START) / (ZYX_INTRO_CUTOFF - ZYX_INTRO_FADE_START));
            audio.volume = ZYX_INTRO_VOLUME * (1 - progress);
        } else {
            audio.volume = ZYX_INTRO_VOLUME;
        }
        zyxIntroTick = requestAnimationFrame(updateIntro);
    };

    try {
        await zyxLoadAudioFromCandidates(audio, ZYX_INTRO_SOURCES);
        const p = audio.play();
        if (p && typeof p.then === 'function') {
            p.then(() => { if (zyxIntroAudio === audio) zyxIntroTick = requestAnimationFrame(updateIntro); })
             .catch(() => { if (zyxIntroAudio === audio) zyxStopIntro({ unlockHover: true }); });
        } else {
            zyxIntroTick = requestAnimationFrame(updateIntro);
        }
    } catch (_) {
        if (zyxIntroAudio === audio) zyxStopIntro({ unlockHover: true });
    }
}

function zyxStopHoverAudio() {
    if (zyxHoverAudio) {
        try { zyxHoverAudio.pause(); zyxHoverAudio.currentTime = 0; zyxHoverAudio.removeAttribute('src'); zyxHoverAudio.load(); } catch (_) {}
        zyxHoverAudio = null;
    }
}


function zyxPlayHover() {
    if (!zyxHoverUnlocked) return;
    zyxStopHoverAudio();
    const audio = new Audio(ZYX_HOVER_SOUNDS[Math.floor(Math.random() * ZYX_HOVER_SOUNDS.length)]);
    zyxHoverAudio = audio;
    audio.volume = ZYX_HOVER_VOLUME;
    const p = audio.play();
    if (p && typeof p.catch === 'function') p.catch(() => {});
}


function zyxAnimateHover(item) {
    if (!item || typeof item.animate !== 'function') return;
    if (item._zyxHoverAnimation) { try { item._zyxHoverAnimation.cancel(); } catch (_) {} }
    item._zyxHoverAnimation = item.animate([
        { translate: '0 0', rotate: '0deg', scale: '1' },
        { translate: '0 -10px', rotate: '-8deg', scale: '1.10', offset: .34 },
        { translate: '0 -4px', rotate: '7deg', scale: '1.06', offset: .70 },
        { translate: '0 0', rotate: '0deg', scale: '1' }
    ], { duration: 540, easing: 'ease-out', fill: 'none' });
    item._zyxHoverAnimation.addEventListener('finish', () => { item._zyxHoverAnimation = null; }, { once: true });
}

function zyxInstallHover() {
    zyxHoverHandler = (event) => {
        if (!zyxBackground) return;
        let hit = null;
        for (const item of zyxBackground.querySelectorAll('.zyx-item')) {
            const r = item.getBoundingClientRect();
            if (event.clientX >= r.left && event.clientX <= r.right && event.clientY >= r.top && event.clientY <= r.bottom) { hit = item; break; }
        }
        if (hit && hit !== zyxHoverLast) { zyxHoverLast = hit; zyxAnimateHover(hit); zyxPlayHover(); }
        else if (!hit) { zyxHoverLast = null; }
    };
    document.addEventListener('mousemove', zyxHoverHandler, { passive: true });
}

function zyxRemoveHover() {
    if (zyxHoverHandler) document.removeEventListener('mousemove', zyxHoverHandler);
    zyxHoverHandler = null;
    zyxHoverLast = null;
    zyxStopHoverAudio();
}

export function mount() {
    if (zyxBackground) return;
    zyxBackground = document.createElement('div');
    zyxBackground.id = 'zyx-background';
    zyxBackground.setAttribute('aria-hidden', 'true');
    document.body.appendChild(zyxBackground);
    zyxCreateItems();
    zyxCreateExtras();
    zyxInstallHover();
    zyxStartIntro();
}

export function unmount() {
    zyxStopIntro();
    zyxHoverUnlocked = false;
    zyxRemoveHover();
    if (zyxBackground) { zyxBackground.remove(); zyxBackground = null; }
}
