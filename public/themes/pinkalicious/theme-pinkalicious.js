/* ============================================================
   PINKALICIOUS THEME
   Built from the winter theme's decorative mount/unmount pattern.
   ============================================================ */

let pinkaliciousBackground = null;
let pinkaliciousHoverHandler = null;
let pinkaliciousHoverLast = null;
let pinkaliciousHoverAudio = null;
let pinkaliciousIntroAudio = null;
let pinkaliciousIntroTick = null;
let pinkaliciousHoverUnlocked = false;
let pinkaliciousIntroActive = false;

const PINKALICIOUS_FILES = [
    "theme-pinkalicious-01.svg",
    "theme-pinkalicious-02.svg",
    "theme-pinkalicious-03.svg",
    "theme-pinkalicious-04.svg",
    "theme-pinkalicious-05.svg",
    "theme-pinkalicious-06.svg",
    "theme-pinkalicious-07.svg",
    "theme-pinkalicious-08.svg",
    "theme-pinkalicious-09.svg",
    "theme-pinkalicious-10.svg",
    "theme-pinkalicious-11.svg",
    "theme-pinkalicious-12.svg",
    "theme-pinkalicious-13.svg",
    "theme-pinkalicious-14.svg",
    "theme-pinkalicious-15.svg",
    "theme-pinkalicious-16.svg",
    "theme-pinkalicious-17.svg",
    "theme-pinkalicious-18.svg"
];
const PINKALICIOUS_BOP_INDEXES = new Set([0, 3, 6, 9, 12, 15, 17]);
const PINKALICIOUS_HOVER_SOUNDS = [
    "/sounds/winx/cartoon_music-arcade-game-positive-selection-bling-489760.mp3",
    "/sounds/winx/freesound_community-electricity-sound-6066.mp3",
    "/sounds/winx/freesound_community-match-sizzle-02-104778.mp3",
    "/sounds/winx/koiroylers-get-coin-351945.mp3"
];
const PINKALICIOUS_HOVER_VOLUME = 0.42;
const PINKALICIOUS_INTRO_SOURCES = [
    "/sounds/intros/elijah_k-pink-287771.mp3",
    "/sounds/intros/elijah_k-pink-287771"
];
const PINKALICIOUS_INTRO_MODE = "cutoff";
const PINKALICIOUS_INTRO_CUTOFF = 12;
const PINKALICIOUS_INTRO_FADE_START = 10;
const PINKALICIOUS_INTRO_VOLUME = 0.3;
const PINKALICIOUS_INTRO_FADE_END = false;

function pinkaliciousRandom(min, max) {
    return Math.random() * (max - min) + min;
}

function pinkaliciousAssetCandidates(file) {
    return [
        "/svg/pinkalicious/{file}",
        "/svg/theme-pinkalicious/{file}",
        "/svg/{file}"
].map(path => path.replace('{file}', file));
}

function pinkaliciousSetImageSource(img, file) {
    const candidates = pinkaliciousAssetCandidates(file);
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

function pinkaliciousLoadAudioFromCandidates(audio, candidates) {
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

function pinkaliciousSetIntroBop(active) {
    pinkaliciousIntroActive = active;
    if (!pinkaliciousBackground) return;
    for (const item of pinkaliciousBackground.querySelectorAll('.pinkalicious-intro-bop-target')) {
        item.classList.toggle('pinkalicious-intro-bop', active);
    }
}

function pinkaliciousCreateItem(index) {
    if (!pinkaliciousBackground) return;

    const item = document.createElement('img');
    item.className = 'pinkalicious-item';
    item.alt = '';
    item.draggable = false;
    item.setAttribute('aria-hidden', 'true');
    pinkaliciousSetImageSource(item, PINKALICIOUS_FILES[index % PINKALICIOUS_FILES.length]);

    const slots = [[6, 14], [8, 28], [7, 46], [9, 64], [11, 82], [18, 21], [16, 39], [20, 58], [22, 88], [94, 13], [92, 27], [93, 45], [91, 63], [89, 82], [82, 18], [84, 38], [80, 58], [78, 88], [30, 90], [50, 92], [70, 90], [50, 16]];
    const slot = slots[index % slots.length];

    item.style.left = `${slot[0] + pinkaliciousRandom(-1.6, 1.6)}%`;
    item.style.top = `${slot[1] + pinkaliciousRandom(-1.8, 1.8)}%`;
    item.style.width = `${pinkaliciousRandom(96, 150)}px`;
    item.style.setProperty('--pinkalicious-float-x', `${pinkaliciousRandom(-14, 14)}px`);
    item.style.setProperty('--pinkalicious-float-y', `${pinkaliciousRandom(-17, 17)}px`);
    item.style.setProperty('--pinkalicious-float-r', `${pinkaliciousRandom(-8, 8)}deg`);
    item.style.setProperty('--pinkalicious-float-duration', `${pinkaliciousRandom(5.8, 9.1)}s`);
    item.style.setProperty('--pinkalicious-float-delay', `${-pinkaliciousRandom(0, 8)}s`);
    item.style.setProperty('--pinkalicious-bop-delay', `${-pinkaliciousRandom(0, 0.7)}s`);

    if (PINKALICIOUS_BOP_INDEXES.has(index)) {
        item.classList.add('pinkalicious-intro-bop-target');
        if (pinkaliciousIntroActive) item.classList.add('pinkalicious-intro-bop');
    }

    pinkaliciousBackground.appendChild(item);
}

function pinkaliciousCreateItems() {
    for (let i = 0; i < PINKALICIOUS_FILES.length; i++) pinkaliciousCreateItem(i);
}

function pinkaliciousCreateExtras() {
    if (!pinkaliciousBackground) return;

    if ("hearts" === 'spots') {
        for (let i = 0; i < 24; i++) {
            const dot = document.createElement('span');
            dot.className = 'pinkalicious-extra';
            dot.style.left = `${pinkaliciousRandom(3, 97)}%`;
            dot.style.top = `${pinkaliciousRandom(4, 96)}%`;
            const size = pinkaliciousRandom(8, 22);
            dot.style.width = `${size}px`;
            dot.style.height = `${size}px`;
            dot.style.setProperty('--pinkalicious-extra-duration', `${pinkaliciousRandom(3.2, 6.5)}s`);
            dot.style.setProperty('--pinkalicious-extra-delay', `${-pinkaliciousRandom(0, 6)}s`);
            pinkaliciousBackground.appendChild(dot);
        }
    } else if ("hearts" === 'bubbles') {
        for (let i = 0; i < 22; i++) {
            const bubble = document.createElement('span');
            bubble.className = 'pinkalicious-extra';
            bubble.style.left = `${pinkaliciousRandom(2, 98)}%`;
            bubble.style.bottom = `${pinkaliciousRandom(-10, 24)}%`;
            const size = pinkaliciousRandom(5, 16);
            bubble.style.width = `${size}px`;
            bubble.style.height = `${size}px`;
            bubble.style.setProperty('--pinkalicious-extra-x', `${pinkaliciousRandom(-18, 18)}px`);
            bubble.style.setProperty('--pinkalicious-extra-duration', `${pinkaliciousRandom(6.4, 12.8)}s`);
            bubble.style.setProperty('--pinkalicious-extra-delay', `${-pinkaliciousRandom(0, 10)}s`);
            pinkaliciousBackground.appendChild(bubble);
        }
    } else if ("hearts" === 'sparkles') {
        for (let i = 0; i < 18; i++) {
            const sparkle = document.createElement('span');
            sparkle.className = 'pinkalicious-extra';
            sparkle.style.left = `${pinkaliciousRandom(4, 96)}%`;
            sparkle.style.top = `${pinkaliciousRandom(6, 94)}%`;
            sparkle.style.setProperty('--pinkalicious-extra-duration', `${pinkaliciousRandom(3.0, 6.4)}s`);
            sparkle.style.setProperty('--pinkalicious-extra-delay', `${-pinkaliciousRandom(0, 6)}s`);
            pinkaliciousBackground.appendChild(sparkle);
        }
    } else if ("hearts" === 'hearts') {
        for (let i = 0; i < 18; i++) {
            const heart = document.createElement('span');
            heart.className = 'pinkalicious-extra';
            heart.style.left = `${pinkaliciousRandom(4, 96)}%`;
            heart.style.top = `${pinkaliciousRandom(6, 94)}%`;
            heart.style.setProperty('--pinkalicious-extra-duration', `${pinkaliciousRandom(4.0, 8.0)}s`);
            heart.style.setProperty('--pinkalicious-extra-delay', `${-pinkaliciousRandom(0, 7)}s`);
            pinkaliciousBackground.appendChild(heart);
        }
    }
}

function pinkaliciousStopIntro({ unlockHover = false } = {}) {
    if (pinkaliciousIntroTick !== null) {
        cancelAnimationFrame(pinkaliciousIntroTick);
        pinkaliciousIntroTick = null;
    }

    if (pinkaliciousIntroAudio) {
        try {
            pinkaliciousIntroAudio.pause();
            pinkaliciousIntroAudio.currentTime = 0;
            pinkaliciousIntroAudio.removeAttribute('src');
            pinkaliciousIntroAudio.load();
        } catch (_) {}
        pinkaliciousIntroAudio = null;
    }

    pinkaliciousSetIntroBop(false);
    if (unlockHover) pinkaliciousHoverUnlocked = true;
}

async function pinkaliciousStartIntro() {
    pinkaliciousStopIntro();
    pinkaliciousHoverUnlocked = false;
    pinkaliciousSetIntroBop(true);

    const audio = new Audio();
    audio.preload = 'auto';
    audio.volume = PINKALICIOUS_INTRO_VOLUME;
    pinkaliciousIntroAudio = audio;

    const finishIntro = () => {
        if (pinkaliciousIntroAudio !== audio) return;
        try {
            audio.pause();
            audio.volume = 0;
        } catch (_) {}
        pinkaliciousIntroAudio = null;
        pinkaliciousIntroTick = null;
        pinkaliciousSetIntroBop(false);
        pinkaliciousHoverUnlocked = true;
    };

    const updateIntro = () => {
        if (pinkaliciousIntroAudio !== audio) return;
        const current = audio.currentTime || 0;

        if (PINKALICIOUS_INTRO_MODE === 'cutoff') {
            if (current >= PINKALICIOUS_INTRO_CUTOFF) {
                finishIntro();
                return;
            }
            if (PINKALICIOUS_INTRO_FADE_START !== null && current >= PINKALICIOUS_INTRO_FADE_START) {
                const progress = Math.min(1, (current - PINKALICIOUS_INTRO_FADE_START) / (PINKALICIOUS_INTRO_CUTOFF - PINKALICIOUS_INTRO_FADE_START));
                audio.volume = PINKALICIOUS_INTRO_VOLUME * (1 - progress);
            } else {
                audio.volume = PINKALICIOUS_INTRO_VOLUME;
            }
            pinkaliciousIntroTick = requestAnimationFrame(updateIntro);
        } else {
            if (PINKALICIOUS_INTRO_FADE_END) {
                const duration = Number.isFinite(audio.duration) ? audio.duration : null;
                if (duration && current >= Math.max(0, duration - 2)) {
                    const progress = Math.min(1, (current - (duration - 2)) / 2);
                    audio.volume = PINKALICIOUS_INTRO_VOLUME * (1 - progress);
                } else {
                    audio.volume = PINKALICIOUS_INTRO_VOLUME;
                }
                pinkaliciousIntroTick = requestAnimationFrame(updateIntro);
            }
        }
    };

    try {
        await pinkaliciousLoadAudioFromCandidates(audio, PINKALICIOUS_INTRO_SOURCES);
        if (PINKALICIOUS_INTRO_MODE === 'full') {
            audio.addEventListener('ended', finishIntro, { once: true });
        }
        const p = audio.play();
        if (p && typeof p.then === 'function') {
            p.then(() => {
                if (pinkaliciousIntroAudio !== audio) return;
                if (PINKALICIOUS_INTRO_MODE === 'cutoff' || PINKALICIOUS_INTRO_FADE_END) {
                    pinkaliciousIntroTick = requestAnimationFrame(updateIntro);
                }
            }).catch(() => {
                if (pinkaliciousIntroAudio === audio) pinkaliciousStopIntro({ unlockHover: true });
            });
        } else if (PINKALICIOUS_INTRO_MODE === 'cutoff' || PINKALICIOUS_INTRO_FADE_END) {
            pinkaliciousIntroTick = requestAnimationFrame(updateIntro);
        }
    } catch (_) {
        if (pinkaliciousIntroAudio === audio) pinkaliciousStopIntro({ unlockHover: true });
    }
}

function pinkaliciousStopHoverAudio() {
    if (pinkaliciousHoverAudio) {
        try {
            pinkaliciousHoverAudio.pause();
            pinkaliciousHoverAudio.currentTime = 0;
            pinkaliciousHoverAudio.removeAttribute('src');
            pinkaliciousHoverAudio.load();
        } catch (_) {}
        pinkaliciousHoverAudio = null;
    }
}

function pinkaliciousPlayHover() {
    if (!pinkaliciousHoverUnlocked) return;

    pinkaliciousStopHoverAudio();
    const audio = new Audio(PINKALICIOUS_HOVER_SOUNDS[Math.floor(Math.random() * PINKALICIOUS_HOVER_SOUNDS.length)]);
    pinkaliciousHoverAudio = audio;
    audio.volume = PINKALICIOUS_HOVER_VOLUME;
    const p = audio.play();
    if (p && typeof p.catch === 'function') p.catch(() => {});
}

function pinkaliciousAnimateHover(item) {
    if (!item || typeof item.animate !== 'function') return;
    if (item._pinkaliciousHoverAnimation) {
        try { item._pinkaliciousHoverAnimation.cancel(); } catch (_) {}
    }
    item._pinkaliciousHoverAnimation = item.animate([
        { translate: '0 0', rotate: '0deg', scale: '1' },
        { translate: '0 -10px', rotate: '-8deg', scale: '1.1', offset: 0.34 },
        { translate: '0 -4px', rotate: '7deg', scale: '1.06', offset: 0.70 },
        { translate: '0 0', rotate: '0deg', scale: '1' }
    ], { duration: 540, easing: 'ease-out', fill: 'none' });
    item._pinkaliciousHoverAnimation.addEventListener('finish', () => { item._pinkaliciousHoverAnimation = null; }, { once: true });
}

function pinkaliciousInstallHover() {
    pinkaliciousHoverHandler = (event) => {
        if (!pinkaliciousBackground) return;
        let hit = null;
        for (const item of pinkaliciousBackground.querySelectorAll('.pinkalicious-item')) {
            const r = item.getBoundingClientRect();
            if (event.clientX >= r.left && event.clientX <= r.right && event.clientY >= r.top && event.clientY <= r.bottom) {
                hit = item; break;
            }
        }
        if (hit && hit !== pinkaliciousHoverLast) {
            pinkaliciousHoverLast = hit;
            pinkaliciousAnimateHover(hit);
            pinkaliciousPlayHover();
        } else if (!hit) {
            pinkaliciousHoverLast = null;
        }
    };
    document.addEventListener('mousemove', pinkaliciousHoverHandler, { passive: true });
}

function pinkaliciousRemoveHover() {
    if (pinkaliciousHoverHandler) document.removeEventListener('mousemove', pinkaliciousHoverHandler);
    pinkaliciousHoverHandler = null;
    pinkaliciousHoverLast = null;
    pinkaliciousStopHoverAudio();
}

export function mount() {
    if (pinkaliciousBackground) return;
    pinkaliciousBackground = document.createElement('div');
    pinkaliciousBackground.id = 'pinkalicious-background';
    pinkaliciousBackground.setAttribute('aria-hidden', 'true');
    document.body.appendChild(pinkaliciousBackground);
    pinkaliciousCreateItems();
    pinkaliciousCreateExtras();
    pinkaliciousInstallHover();
    pinkaliciousStartIntro();
}

export function unmount() {
    pinkaliciousStopIntro();
    pinkaliciousHoverUnlocked = false;
    pinkaliciousRemoveHover();
    if (pinkaliciousBackground) {
        pinkaliciousBackground.remove();
        pinkaliciousBackground = null;
    }
}
