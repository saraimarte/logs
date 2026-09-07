/* ============================================================
   MIRACULOUS THEME
   Built from the winter theme's decorative mount/unmount pattern.
   ============================================================ */

let miraculousBackground = null;
let miraculousHoverHandler = null;
let miraculousHoverLast = null;
let miraculousHoverAudio = null;
let miraculousIntroAudio = null;
let miraculousIntroTick = null;
let miraculousHoverUnlocked = false;
let miraculousIntroActive = false;

const MIRACULOUS_FILES = [
    "21227cac-c36f-538a-b388-1891362f6b1c.svg",
    "7db7a1b8-4adb-5e6b-8132-1295d235f300.svg",
    "7f6d76cb-e436-5e06-97c3-2566eacc9adf.svg",
    "9e62195b-a842-5557-b13d-e0848a05f487.svg",
    "cae6537e-b130-556f-b8d3-8c872d1488d8.svg",
    "ebff9155-d81c-558f-9c22-77e6825b0c24.svg",
    "f602637d-00ed-528a-a4d6-0b6ec10adebe.svg",
    "fd9d9036-0866-503f-83bf-fa95d6d3340d.svg",
    "theme-miraculous-01.svg",
    "theme-miraculous-02.svg",
    "theme-miraculous-03.svg",
    "theme-miraculous-04.svg",
    "theme-miraculous-05.svg",
    "theme-miraculous-06.svg",
    "theme-miraculous-07.svg",
    "theme-miraculous-08.svg",
    "theme-miraculous-09.svg"
];
const MIRACULOUS_BOP_INDEXES = new Set([1, 4, 6, 9, 12, 15]);
const MIRACULOUS_HOVER_SOUNDS = [
    "/sounds/winx/cartoon_music-arcade-game-positive-selection-bling-489760.mp3",
    "/sounds/winx/freesound_community-electricity-sound-6066.mp3",
    "/sounds/winx/freesound_community-match-sizzle-02-104778.mp3",
    "/sounds/winx/koiroylers-get-coin-351945.mp3"
];
const MIRACULOUS_HOVER_VOLUME = 0.42;
const MIRACULOUS_INTRO_SOURCES = [
    "/sounds/intros/the_mountain-kid-action-375989the_mountain-kid-action-375989.mp3",
    "/sounds/intros/the_mountain-kid-action-375989.mp3"
];
const MIRACULOUS_INTRO_MODE = "full";
const MIRACULOUS_INTRO_CUTOFF = null;
const MIRACULOUS_INTRO_FADE_START = null;
const MIRACULOUS_INTRO_VOLUME = 0.3;
const MIRACULOUS_INTRO_FADE_END = false;

function miraculousRandom(min, max) {
    return Math.random() * (max - min) + min;
}

function miraculousAssetCandidates(file) {
    return [
        "/svg/miraculous/{file}",
        "/svg/theme-miraculous/{file}",
        "/svg/{file}"
].map(path => path.replace('{file}', file));
}

function miraculousSetImageSource(img, file) {
    const candidates = miraculousAssetCandidates(file);
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

function miraculousLoadAudioFromCandidates(audio, candidates) {
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

function miraculousSetIntroBop(active) {
    miraculousIntroActive = active;
    if (!miraculousBackground) return;
    for (const item of miraculousBackground.querySelectorAll('.miraculous-intro-bop-target')) {
        item.classList.toggle('miraculous-intro-bop', active);
    }
}

function miraculousCreateItem(index) {
    if (!miraculousBackground) return;

    const item = document.createElement('img');
    item.className = 'miraculous-item';
    item.alt = '';
    item.draggable = false;
    item.setAttribute('aria-hidden', 'true');
    miraculousSetImageSource(item, MIRACULOUS_FILES[index % MIRACULOUS_FILES.length]);

    const slots = [[6, 14], [8, 28], [7, 46], [9, 64], [11, 82], [18, 21], [16, 39], [20, 58], [22, 88], [94, 13], [92, 27], [93, 45], [91, 63], [89, 82], [82, 18], [84, 38], [80, 58], [78, 88], [30, 90], [50, 92], [70, 90], [50, 16]];
    const slot = slots[index % slots.length];

    item.style.left = `${slot[0] + miraculousRandom(-1.6, 1.6)}%`;
    item.style.top = `${slot[1] + miraculousRandom(-1.8, 1.8)}%`;
    item.style.width = `${miraculousRandom(110, 168)}px`;
    item.style.setProperty('--miraculous-float-x', `${miraculousRandom(-14, 14)}px`);
    item.style.setProperty('--miraculous-float-y', `${miraculousRandom(-17, 17)}px`);
    item.style.setProperty('--miraculous-float-r', `${miraculousRandom(-8, 8)}deg`);
    item.style.setProperty('--miraculous-float-duration', `${miraculousRandom(6.0, 9.8)}s`);
    item.style.setProperty('--miraculous-float-delay', `${-miraculousRandom(0, 8)}s`);
    item.style.setProperty('--miraculous-bop-delay', `${-miraculousRandom(0, 0.7)}s`);

    if (MIRACULOUS_BOP_INDEXES.has(index)) {
        item.classList.add('miraculous-intro-bop-target');
        if (miraculousIntroActive) item.classList.add('miraculous-intro-bop');
    }

    miraculousBackground.appendChild(item);
}

function miraculousCreateItems() {
    for (let i = 0; i < MIRACULOUS_FILES.length; i++) miraculousCreateItem(i);
}

function miraculousCreateExtras() {
    if (!miraculousBackground) return;

    if ("spots" === 'spots') {
        for (let i = 0; i < 24; i++) {
            const dot = document.createElement('span');
            dot.className = 'miraculous-extra';
            dot.style.left = `${miraculousRandom(3, 97)}%`;
            dot.style.top = `${miraculousRandom(4, 96)}%`;
            const size = miraculousRandom(8, 22);
            dot.style.width = `${size}px`;
            dot.style.height = `${size}px`;
            dot.style.setProperty('--miraculous-extra-duration', `${miraculousRandom(3.2, 6.5)}s`);
            dot.style.setProperty('--miraculous-extra-delay', `${-miraculousRandom(0, 6)}s`);
            miraculousBackground.appendChild(dot);
        }
    } else if ("spots" === 'bubbles') {
        for (let i = 0; i < 22; i++) {
            const bubble = document.createElement('span');
            bubble.className = 'miraculous-extra';
            bubble.style.left = `${miraculousRandom(2, 98)}%`;
            bubble.style.bottom = `${miraculousRandom(-10, 24)}%`;
            const size = miraculousRandom(5, 16);
            bubble.style.width = `${size}px`;
            bubble.style.height = `${size}px`;
            bubble.style.setProperty('--miraculous-extra-x', `${miraculousRandom(-18, 18)}px`);
            bubble.style.setProperty('--miraculous-extra-duration', `${miraculousRandom(6.4, 12.8)}s`);
            bubble.style.setProperty('--miraculous-extra-delay', `${-miraculousRandom(0, 10)}s`);
            miraculousBackground.appendChild(bubble);
        }
    } else if ("spots" === 'sparkles') {
        for (let i = 0; i < 18; i++) {
            const sparkle = document.createElement('span');
            sparkle.className = 'miraculous-extra';
            sparkle.style.left = `${miraculousRandom(4, 96)}%`;
            sparkle.style.top = `${miraculousRandom(6, 94)}%`;
            sparkle.style.setProperty('--miraculous-extra-duration', `${miraculousRandom(3.0, 6.4)}s`);
            sparkle.style.setProperty('--miraculous-extra-delay', `${-miraculousRandom(0, 6)}s`);
            miraculousBackground.appendChild(sparkle);
        }
    } else if ("spots" === 'hearts') {
        for (let i = 0; i < 18; i++) {
            const heart = document.createElement('span');
            heart.className = 'miraculous-extra';
            heart.style.left = `${miraculousRandom(4, 96)}%`;
            heart.style.top = `${miraculousRandom(6, 94)}%`;
            heart.style.setProperty('--miraculous-extra-duration', `${miraculousRandom(4.0, 8.0)}s`);
            heart.style.setProperty('--miraculous-extra-delay', `${-miraculousRandom(0, 7)}s`);
            miraculousBackground.appendChild(heart);
        }
    }
}

function miraculousStopIntro({ unlockHover = false } = {}) {
    if (miraculousIntroTick !== null) {
        cancelAnimationFrame(miraculousIntroTick);
        miraculousIntroTick = null;
    }

    if (miraculousIntroAudio) {
        try {
            miraculousIntroAudio.pause();
            miraculousIntroAudio.currentTime = 0;
            miraculousIntroAudio.removeAttribute('src');
            miraculousIntroAudio.load();
        } catch (_) {}
        miraculousIntroAudio = null;
    }

    miraculousSetIntroBop(false);
    if (unlockHover) miraculousHoverUnlocked = true;
}

async function miraculousStartIntro() {
    miraculousStopIntro();
    miraculousHoverUnlocked = false;
    miraculousSetIntroBop(true);

    const audio = new Audio();
    audio.preload = 'auto';
    audio.volume = MIRACULOUS_INTRO_VOLUME;
    miraculousIntroAudio = audio;

    const finishIntro = () => {
        if (miraculousIntroAudio !== audio) return;
        try {
            audio.pause();
            audio.volume = 0;
        } catch (_) {}
        miraculousIntroAudio = null;
        miraculousIntroTick = null;
        miraculousSetIntroBop(false);
        miraculousHoverUnlocked = true;
    };

    const updateIntro = () => {
        if (miraculousIntroAudio !== audio) return;
        const current = audio.currentTime || 0;

        if (MIRACULOUS_INTRO_MODE === 'cutoff') {
            if (current >= MIRACULOUS_INTRO_CUTOFF) {
                finishIntro();
                return;
            }
            if (MIRACULOUS_INTRO_FADE_START !== null && current >= MIRACULOUS_INTRO_FADE_START) {
                const progress = Math.min(1, (current - MIRACULOUS_INTRO_FADE_START) / (MIRACULOUS_INTRO_CUTOFF - MIRACULOUS_INTRO_FADE_START));
                audio.volume = MIRACULOUS_INTRO_VOLUME * (1 - progress);
            } else {
                audio.volume = MIRACULOUS_INTRO_VOLUME;
            }
            miraculousIntroTick = requestAnimationFrame(updateIntro);
        } else {
            if (MIRACULOUS_INTRO_FADE_END) {
                const duration = Number.isFinite(audio.duration) ? audio.duration : null;
                if (duration && current >= Math.max(0, duration - 2)) {
                    const progress = Math.min(1, (current - (duration - 2)) / 2);
                    audio.volume = MIRACULOUS_INTRO_VOLUME * (1 - progress);
                } else {
                    audio.volume = MIRACULOUS_INTRO_VOLUME;
                }
                miraculousIntroTick = requestAnimationFrame(updateIntro);
            }
        }
    };

    try {
        await miraculousLoadAudioFromCandidates(audio, MIRACULOUS_INTRO_SOURCES);
        if (MIRACULOUS_INTRO_MODE === 'full') {
            audio.addEventListener('ended', finishIntro, { once: true });
        }
        const p = audio.play();
        if (p && typeof p.then === 'function') {
            p.then(() => {
                if (miraculousIntroAudio !== audio) return;
                if (MIRACULOUS_INTRO_MODE === 'cutoff' || MIRACULOUS_INTRO_FADE_END) {
                    miraculousIntroTick = requestAnimationFrame(updateIntro);
                }
            }).catch(() => {
                if (miraculousIntroAudio === audio) miraculousStopIntro({ unlockHover: true });
            });
        } else if (MIRACULOUS_INTRO_MODE === 'cutoff' || MIRACULOUS_INTRO_FADE_END) {
            miraculousIntroTick = requestAnimationFrame(updateIntro);
        }
    } catch (_) {
        if (miraculousIntroAudio === audio) miraculousStopIntro({ unlockHover: true });
    }
}

function miraculousStopHoverAudio() {
    if (miraculousHoverAudio) {
        try {
            miraculousHoverAudio.pause();
            miraculousHoverAudio.currentTime = 0;
            miraculousHoverAudio.removeAttribute('src');
            miraculousHoverAudio.load();
        } catch (_) {}
        miraculousHoverAudio = null;
    }
}

function miraculousPlayHover() {
    if (!miraculousHoverUnlocked) return;

    miraculousStopHoverAudio();
    const audio = new Audio(MIRACULOUS_HOVER_SOUNDS[Math.floor(Math.random() * MIRACULOUS_HOVER_SOUNDS.length)]);
    miraculousHoverAudio = audio;
    audio.volume = MIRACULOUS_HOVER_VOLUME;
    const p = audio.play();
    if (p && typeof p.catch === 'function') p.catch(() => {});
}

function miraculousAnimateHover(item) {
    if (!item || typeof item.animate !== 'function') return;
    if (item._miraculousHoverAnimation) {
        try { item._miraculousHoverAnimation.cancel(); } catch (_) {}
    }
    item._miraculousHoverAnimation = item.animate([
        { translate: '0 0', rotate: '0deg', scale: '1' },
        { translate: '0 -10px', rotate: '-8deg', scale: '1.1', offset: 0.34 },
        { translate: '0 -4px', rotate: '7deg', scale: '1.06', offset: 0.70 },
        { translate: '0 0', rotate: '0deg', scale: '1' }
    ], { duration: 540, easing: 'ease-out', fill: 'none' });
    item._miraculousHoverAnimation.addEventListener('finish', () => { item._miraculousHoverAnimation = null; }, { once: true });
}

function miraculousInstallHover() {
    miraculousHoverHandler = (event) => {
        if (!miraculousBackground) return;
        let hit = null;
        for (const item of miraculousBackground.querySelectorAll('.miraculous-item')) {
            const r = item.getBoundingClientRect();
            if (event.clientX >= r.left && event.clientX <= r.right && event.clientY >= r.top && event.clientY <= r.bottom) {
                hit = item; break;
            }
        }
        if (hit && hit !== miraculousHoverLast) {
            miraculousHoverLast = hit;
            miraculousAnimateHover(hit);
            miraculousPlayHover();
        } else if (!hit) {
            miraculousHoverLast = null;
        }
    };
    document.addEventListener('mousemove', miraculousHoverHandler, { passive: true });
}

function miraculousRemoveHover() {
    if (miraculousHoverHandler) document.removeEventListener('mousemove', miraculousHoverHandler);
    miraculousHoverHandler = null;
    miraculousHoverLast = null;
    miraculousStopHoverAudio();
}

export function mount() {
    if (miraculousBackground) return;
    miraculousBackground = document.createElement('div');
    miraculousBackground.id = 'miraculous-background';
    miraculousBackground.setAttribute('aria-hidden', 'true');
    document.body.appendChild(miraculousBackground);
    miraculousCreateItems();
    miraculousCreateExtras();
    miraculousInstallHover();
    miraculousStartIntro();
}

export function unmount() {
    miraculousStopIntro();
    miraculousHoverUnlocked = false;
    miraculousRemoveHover();
    if (miraculousBackground) {
        miraculousBackground.remove();
        miraculousBackground = null;
    }
}
