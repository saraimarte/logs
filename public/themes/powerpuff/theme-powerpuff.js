/* ============================================================
   POWERPUFF THEME
   Built from the winter theme's decorative mount/unmount pattern.
   ============================================================ */

let powerpuffBackground = null;
let powerpuffHoverHandler = null;
let powerpuffHoverLast = null;
let powerpuffHoverAudio = null;
let powerpuffIntroAudio = null;
let powerpuffIntroTick = null;
let powerpuffHoverUnlocked = false;
let powerpuffIntroActive = false;

const POWERPUFF_FILES = [
    "powerpuff-01.svg",
    "powerpuff-02.svg",
    "powerpuff-03.svg",
    "powerpuff-04.svg",
    "powerpuff-05.svg",
    "powerpuff-06.svg",
    "powerpuff-07.svg",
    "powerpuff-08.svg",
    "powerpuff-09.svg",
    "powerpuff-10.svg",
    "powerpuff-11.svg",
    "powerpuff-12.svg",
    "powerpuff-13.svg",
    "powerpuff-14.svg",
    "powerpuff-15.svg",
    "powerpuff-16.svg",
    "powerpuff-17.svg",
    "powerpuff-18.svg"
];
const POWERPUFF_BOP_INDEXES = new Set([0, 2, 5, 8, 11, 14, 16]);
const POWERPUFF_HOVER_SOUNDS = [
    "/sounds/winx/cartoon_music-arcade-game-positive-selection-bling-489760.mp3",
    "/sounds/winx/freesound_community-electricity-sound-6066.mp3",
    "/sounds/winx/freesound_community-match-sizzle-02-104778.mp3",
    "/sounds/winx/koiroylers-get-coin-351945.mp3"
];
const POWERPUFF_HOVER_VOLUME = 0.42;
const POWERPUFF_INTRO_SOURCES = [
    "/sounds/intros/kulakovka-breakbeat-281145.mp3"
];
const POWERPUFF_INTRO_MODE = "cutoff";
const POWERPUFF_INTRO_CUTOFF = 20;
const POWERPUFF_INTRO_FADE_START = 15;
const POWERPUFF_INTRO_VOLUME = 0.3;
const POWERPUFF_INTRO_FADE_END = false;

function powerpuffRandom(min, max) {
    return Math.random() * (max - min) + min;
}

function powerpuffAssetCandidates(file) {
    return [
        "/svg/powerpuff/{file}",
        "/svg/theme-powerpuff/{file}",
        "/svg/{file}"
].map(path => path.replace('{file}', file));
}

function powerpuffSetImageSource(img, file) {
    const candidates = powerpuffAssetCandidates(file);
    let index = 0;
    const tryNext = () => {
        if (index >= candidates.length) {
            img.onerror = null;
            return;
        }
        img.src = candidates[index++];
    };
    img.onerror = tryNext;
    tryNext();
}

function powerpuffLoadAudioFromCandidates(audio, candidates) {
    return new Promise((resolve, reject) => {
        let index = 0;
        const cleanup = () => {
            audio.removeEventListener("loadedmetadata", onLoaded);
            audio.removeEventListener("canplay", onLoaded);
            audio.removeEventListener("error", onError);
        };
        const onLoaded = () => { cleanup(); resolve(audio); };
        const onError = () => {
            if (index >= candidates.length) { cleanup(); reject(new Error("audio-not-found")); return; }
            audio.src = candidates[index++];
            audio.load();
        };
        audio.addEventListener("loadedmetadata", onLoaded);
        audio.addEventListener("canplay", onLoaded);
        audio.addEventListener("error", onError);
        onError();
    });
}

function powerpuffSetIntroBop(active) {
    powerpuffIntroActive = active;
    if (!powerpuffBackground) return;
    for (const item of powerpuffBackground.querySelectorAll('.powerpuff-intro-bop-target')) {
        item.classList.toggle('powerpuff-intro-bop', active);
    }
}

function powerpuffCreateItem(index) {
    if (!powerpuffBackground) return;

    const item = document.createElement('img');
    item.className = 'powerpuff-item';
    item.alt = '';
    item.draggable = false;
    item.setAttribute('aria-hidden', 'true');
    powerpuffSetImageSource(item, POWERPUFF_FILES[index % POWERPUFF_FILES.length]);

    const slots = [[6, 14], [8, 28], [7, 46], [9, 64], [11, 82], [18, 21], [16, 39], [20, 58], [22, 88], [94, 13], [92, 27], [93, 45], [91, 63], [89, 82], [82, 18], [84, 38], [80, 58], [78, 88], [30, 90], [50, 92], [70, 90], [50, 16]];
    const slot = slots[index % slots.length];

    item.style.left = `${slot[0] + powerpuffRandom(-1.6, 1.6)}%`;
    item.style.top = `${slot[1] + powerpuffRandom(-1.8, 1.8)}%`;
    item.style.width = `${powerpuffRandom(95, 142)}px`;
    item.style.setProperty('--powerpuff-float-x', `${powerpuffRandom(-14, 14)}px`);
    item.style.setProperty('--powerpuff-float-y', `${powerpuffRandom(-17, 17)}px`);
    item.style.setProperty('--powerpuff-float-r', `${powerpuffRandom(-8, 8)}deg`);
    item.style.setProperty('--powerpuff-float-duration', `${powerpuffRandom(5.5, 8.8)}s`);
    item.style.setProperty('--powerpuff-float-delay', `${-powerpuffRandom(0, 8)}s`);
    item.style.setProperty('--powerpuff-bop-delay', `${-powerpuffRandom(0, 0.7)}s`);

    if (POWERPUFF_BOP_INDEXES.has(index)) {
        item.classList.add('powerpuff-intro-bop-target');
        if (powerpuffIntroActive) item.classList.add('powerpuff-intro-bop');
    }

    powerpuffBackground.appendChild(item);
}

function powerpuffCreateItems() {
    for (let i = 0; i < POWERPUFF_FILES.length; i++) powerpuffCreateItem(i);
}

function powerpuffCreateExtras() {
    if (!powerpuffBackground) return;

    if ("bubbles" === 'spots') {
        for (let i = 0; i < 24; i++) {
            const dot = document.createElement('span');
            dot.className = 'powerpuff-extra';
            dot.style.left = `${powerpuffRandom(3, 97)}%`;
            dot.style.top = `${powerpuffRandom(4, 96)}%`;
            const size = powerpuffRandom(8, 22);
            dot.style.width = `${size}px`;
            dot.style.height = `${size}px`;
            dot.style.setProperty('--powerpuff-extra-duration', `${powerpuffRandom(3.2, 6.5)}s`);
            dot.style.setProperty('--powerpuff-extra-delay', `${-powerpuffRandom(0, 6)}s`);
            powerpuffBackground.appendChild(dot);
        }
    } else if ("bubbles" === 'bubbles') {
        for (let i = 0; i < 22; i++) {
            const bubble = document.createElement('span');
            bubble.className = 'powerpuff-extra';
            bubble.style.left = `${powerpuffRandom(2, 98)}%`;
            bubble.style.bottom = `${powerpuffRandom(-10, 24)}%`;
            const size = powerpuffRandom(5, 16);
            bubble.style.width = `${size}px`;
            bubble.style.height = `${size}px`;
            bubble.style.setProperty('--powerpuff-extra-x', `${powerpuffRandom(-18, 18)}px`);
            bubble.style.setProperty('--powerpuff-extra-duration', `${powerpuffRandom(6.4, 12.8)}s`);
            bubble.style.setProperty('--powerpuff-extra-delay', `${-powerpuffRandom(0, 10)}s`);
            powerpuffBackground.appendChild(bubble);
        }
    } else if ("bubbles" === 'sparkles') {
        for (let i = 0; i < 18; i++) {
            const sparkle = document.createElement('span');
            sparkle.className = 'powerpuff-extra';
            sparkle.style.left = `${powerpuffRandom(4, 96)}%`;
            sparkle.style.top = `${powerpuffRandom(6, 94)}%`;
            sparkle.style.setProperty('--powerpuff-extra-duration', `${powerpuffRandom(3.0, 6.4)}s`);
            sparkle.style.setProperty('--powerpuff-extra-delay', `${-powerpuffRandom(0, 6)}s`);
            powerpuffBackground.appendChild(sparkle);
        }
    } else if ("bubbles" === 'hearts') {
        for (let i = 0; i < 18; i++) {
            const heart = document.createElement('span');
            heart.className = 'powerpuff-extra';
            heart.style.left = `${powerpuffRandom(4, 96)}%`;
            heart.style.top = `${powerpuffRandom(6, 94)}%`;
            heart.style.setProperty('--powerpuff-extra-duration', `${powerpuffRandom(4.0, 8.0)}s`);
            heart.style.setProperty('--powerpuff-extra-delay', `${-powerpuffRandom(0, 7)}s`);
            powerpuffBackground.appendChild(heart);
        }
    }
}

function powerpuffStopIntro({ unlockHover = false } = {}) {
    if (powerpuffIntroTick !== null) {
        cancelAnimationFrame(powerpuffIntroTick);
        powerpuffIntroTick = null;
    }

    if (powerpuffIntroAudio) {
        try {
            powerpuffIntroAudio.pause();
            powerpuffIntroAudio.currentTime = 0;
            powerpuffIntroAudio.removeAttribute('src');
            powerpuffIntroAudio.load();
        } catch (_) {}
        powerpuffIntroAudio = null;
    }

    powerpuffSetIntroBop(false);
    if (unlockHover) powerpuffHoverUnlocked = true;
}

async function powerpuffStartIntro() {
    powerpuffStopIntro();
    powerpuffHoverUnlocked = false;
    powerpuffSetIntroBop(true);

    const audio = new Audio();
    audio.preload = 'auto';
    audio.volume = POWERPUFF_INTRO_VOLUME;
    powerpuffIntroAudio = audio;

    const finishIntro = () => {
        if (powerpuffIntroAudio !== audio) return;
        try {
            audio.pause();
            audio.volume = 0;
        } catch (_) {}
        powerpuffIntroAudio = null;
        powerpuffIntroTick = null;
        powerpuffSetIntroBop(false);
        powerpuffHoverUnlocked = true;
    };

    const updateIntro = () => {
        if (powerpuffIntroAudio !== audio) return;
        const current = audio.currentTime || 0;

        if (POWERPUFF_INTRO_MODE === 'cutoff') {
            if (current >= POWERPUFF_INTRO_CUTOFF) {
                finishIntro();
                return;
            }
            if (POWERPUFF_INTRO_FADE_START !== null && current >= POWERPUFF_INTRO_FADE_START) {
                const progress = Math.min(1, (current - POWERPUFF_INTRO_FADE_START) / (POWERPUFF_INTRO_CUTOFF - POWERPUFF_INTRO_FADE_START));
                audio.volume = POWERPUFF_INTRO_VOLUME * (1 - progress);
            } else {
                audio.volume = POWERPUFF_INTRO_VOLUME;
            }
            powerpuffIntroTick = requestAnimationFrame(updateIntro);
        } else {
            if (POWERPUFF_INTRO_FADE_END) {
                const duration = Number.isFinite(audio.duration) ? audio.duration : null;
                if (duration && current >= Math.max(0, duration - 2)) {
                    const progress = Math.min(1, (current - (duration - 2)) / 2);
                    audio.volume = POWERPUFF_INTRO_VOLUME * (1 - progress);
                } else {
                    audio.volume = POWERPUFF_INTRO_VOLUME;
                }
                powerpuffIntroTick = requestAnimationFrame(updateIntro);
            }
        }
    };

    try {
        await powerpuffLoadAudioFromCandidates(audio, POWERPUFF_INTRO_SOURCES);
        if (POWERPUFF_INTRO_MODE === 'full') {
            audio.addEventListener('ended', finishIntro, { once: true });
        }
        const p = audio.play();
        if (p && typeof p.then === 'function') {
            p.then(() => {
                if (powerpuffIntroAudio !== audio) return;
                if (POWERPUFF_INTRO_MODE === 'cutoff' || POWERPUFF_INTRO_FADE_END) {
                    powerpuffIntroTick = requestAnimationFrame(updateIntro);
                }
            }).catch(() => {
                if (powerpuffIntroAudio === audio) powerpuffStopIntro({ unlockHover: true });
            });
        } else if (POWERPUFF_INTRO_MODE === 'cutoff' || POWERPUFF_INTRO_FADE_END) {
            powerpuffIntroTick = requestAnimationFrame(updateIntro);
        }
    } catch (_) {
        if (powerpuffIntroAudio === audio) powerpuffStopIntro({ unlockHover: true });
    }
}

function powerpuffStopHoverAudio() {
    if (powerpuffHoverAudio) {
        try {
            powerpuffHoverAudio.pause();
            powerpuffHoverAudio.currentTime = 0;
            powerpuffHoverAudio.removeAttribute('src');
            powerpuffHoverAudio.load();
        } catch (_) {}
        powerpuffHoverAudio = null;
    }
}

function powerpuffPlayHover() {
    if (!powerpuffHoverUnlocked) return;

    powerpuffStopHoverAudio();
    const audio = new Audio(POWERPUFF_HOVER_SOUNDS[Math.floor(Math.random() * POWERPUFF_HOVER_SOUNDS.length)]);
    powerpuffHoverAudio = audio;
    audio.volume = POWERPUFF_HOVER_VOLUME;
    const p = audio.play();
    if (p && typeof p.catch === 'function') p.catch(() => {});
}

function powerpuffAnimateHover(item) {
    if (!item || typeof item.animate !== 'function') return;
    if (item._powerpuffHoverAnimation) {
        try { item._powerpuffHoverAnimation.cancel(); } catch (_) {}
    }
    item._powerpuffHoverAnimation = item.animate([
        { translate: '0 0', rotate: '0deg', scale: '1' },
        { translate: '0 -10px', rotate: '-8deg', scale: '1.1', offset: 0.34 },
        { translate: '0 -4px', rotate: '7deg', scale: '1.06', offset: 0.70 },
        { translate: '0 0', rotate: '0deg', scale: '1' }
    ], { duration: 540, easing: 'ease-out', fill: 'none' });
    item._powerpuffHoverAnimation.addEventListener('finish', () => { item._powerpuffHoverAnimation = null; }, { once: true });
}

function powerpuffInstallHover() {
    powerpuffHoverHandler = (event) => {
        if (!powerpuffBackground) return;
        let hit = null;
        for (const item of powerpuffBackground.querySelectorAll('.powerpuff-item')) {
            const r = item.getBoundingClientRect();
            if (event.clientX >= r.left && event.clientX <= r.right && event.clientY >= r.top && event.clientY <= r.bottom) {
                hit = item; break;
            }
        }
        if (hit && hit !== powerpuffHoverLast) {
            powerpuffHoverLast = hit;
            powerpuffAnimateHover(hit);
            powerpuffPlayHover();
        } else if (!hit) {
            powerpuffHoverLast = null;
        }
    };
    document.addEventListener('mousemove', powerpuffHoverHandler, { passive: true });
}

function powerpuffRemoveHover() {
    if (powerpuffHoverHandler) document.removeEventListener('mousemove', powerpuffHoverHandler);
    powerpuffHoverHandler = null;
    powerpuffHoverLast = null;
    powerpuffStopHoverAudio();
}

export function mount() {
    if (powerpuffBackground) return;
    powerpuffBackground = document.createElement('div');
    powerpuffBackground.id = 'powerpuff-background';
    powerpuffBackground.setAttribute('aria-hidden', 'true');
    document.body.appendChild(powerpuffBackground);
    powerpuffCreateItems();
    powerpuffCreateExtras();
    powerpuffInstallHover();
    powerpuffStartIntro();
}

export function unmount() {
    powerpuffStopIntro();
    powerpuffHoverUnlocked = false;
    powerpuffRemoveHover();
    if (powerpuffBackground) {
        powerpuffBackground.remove();
        powerpuffBackground = null;
    }
}
