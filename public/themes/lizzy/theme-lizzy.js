/* ============================================================
   LIZZY THEME
   Built from the winter theme's decorative mount/unmount pattern.
   ============================================================ */

let lizzyBackground = null;
let lizzyHoverHandler = null;
let lizzyHoverLast = null;
let lizzyHoverAudio = null;
let lizzyIntroAudio = null;
let lizzyIntroTick = null;
let lizzyHoverUnlocked = false;
let lizzyIntroActive = false;

const LIZZY_FILES = [
    "ChatGPT Image Sep 4, 2026, 07_59_54 PM (1).png",
    "ChatGPT Image Sep 4, 2026, 07_59_55 PM (2).png",
    "ChatGPT Image Sep 4, 2026, 07_59_55 PM (3).png",
    "ChatGPT Image Sep 4, 2026, 07_59_56 PM (4).png",
    "ChatGPT Image Sep 4, 2026, 07_59_56 PM (5).png",
    "ChatGPT Image Sep 4, 2026, 07_59_57 PM (6).png",
    "ChatGPT Image Sep 4, 2026, 07_59_58 PM (7).png",
    "ChatGPT Image Sep 4, 2026, 07_59_59 PM (8).png",
    "ChatGPT Image Sep 4, 2026, 07_59_59 PM (9).png",
    "ChatGPT Image Sep 4, 2026, 08_00_01 PM (10).png",
    "ChatGPT Image Sep 4, 2026, 08_18_31 PM (1).png",
    "ChatGPT Image Sep 4, 2026, 08_18_31 PM (2).png",
    "ChatGPT Image Sep 4, 2026, 08_18_32 PM (3).png",
    "ChatGPT Image Sep 4, 2026, 08_18_32 PM (4).png",
    "ChatGPT Image Sep 4, 2026, 08_18_32 PM (5).png",
    "ChatGPT Image Sep 4, 2026, 08_18_33 PM (6).png"
];

const LIZZY_SLOTS = [
    [6, 14], [8, 28], [9, 44], [11, 61], [13, 78], [15, 90],
    [21, 20], [19, 39], [21, 59], [24, 91],
    [94, 14], [92, 28], [91, 44], [89, 61], [87, 78], [85, 90],
    [79, 19], [77, 39], [75, 59], [73, 91],
    [31, 92], [50, 94], [69, 92], [50, 16]
];

const LIZZY_BOP_INDEXES = new Set([0, 2, 5, 7, 10, 13]);
const LIZZY_HOVER_SOUNDS = [
    "/sounds/winx/cartoon_music-arcade-game-positive-selection-bling-489760.mp3",
    "/sounds/winx/freesound_community-electricity-sound-6066.mp3",
    "/sounds/winx/freesound_community-match-sizzle-02-104778.mp3",
    "/sounds/winx/koiroylers-get-coin-351945.mp3"
];
const LIZZY_HOVER_VOLUME = 0.42;
const LIZZY_INTRO_SOURCES = [
    "/sounds/intros/alexgrohl-pizza-party-the-pop-punk-470592.mp3",
    "/sounds/intros/alexgrohl-pizza-party-the-pop-punk-470592"
];
const LIZZY_INTRO_CUTOFF = 21;
const LIZZY_INTRO_FADE_START = 16;
const LIZZY_INTRO_VOLUME = 0.34;
const LIZZY_RENDER_COUNT = 12;

function lizzyRandom(min, max) {
    return Math.random() * (max - min) + min;
}

function lizzyShuffle(arr) {
    const copy = arr.slice();
    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
}

function lizzyAssetCandidates(file) {
    return [
        "/images/lizzy/{file}",
        "/images/theme-lizzy/{file}",
        "/png/lizzy/{file}",
        "/png/theme-lizzy/{file}",
        "/svg/lizzy/{file}",
        "/svg/theme-lizzy/{file}",
        "/images/{file}",
        "/svg/{file}",
        "/{file}"
    ].map(path => path.replace('{file}', file));
}

function lizzySetImageSource(img, file) {
    const candidates = lizzyAssetCandidates(file);
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

function lizzyLoadAudioFromCandidates(audio, candidates) {
    return new Promise((resolve, reject) => {
        let index = 0;
        const cleanup = () => {
            audio.removeEventListener('loadedmetadata', onLoaded);
            audio.removeEventListener('canplay', onLoaded);
            audio.removeEventListener('error', onError);
        };
        const onLoaded = () => {
            cleanup();
            resolve(audio);
        };
        const onError = () => {
            if (index >= candidates.length) {
                cleanup();
                reject(new Error('audio-not-found'));
                return;
            }
            audio.src = candidates[index++];
            audio.load();
        };
        audio.addEventListener('loadedmetadata', onLoaded);
        audio.addEventListener('canplay', onLoaded);
        audio.addEventListener('error', onError);
        onError();
    });
}

function lizzySetIntroBop(active) {
    lizzyIntroActive = active;
    if (!lizzyBackground) return;
    for (const item of lizzyBackground.querySelectorAll('.lizzy-intro-bop-target')) {
        item.classList.toggle('lizzy-intro-bop', active);
    }
}

function lizzyCreateItem(index, file, slot) {
    if (!lizzyBackground) return;

    const item = document.createElement('img');
    item.className = 'lizzy-item';
    item.alt = '';
    item.draggable = false;
    item.setAttribute('aria-hidden', 'true');
    lizzySetImageSource(item, file);

    item.style.left = `${slot[0] + lizzyRandom(-0.7, 0.7)}%`;
    item.style.top = `${slot[1] + lizzyRandom(-0.8, 0.8)}%`;
    item.style.width = `${lizzyRandom(122, 174)}px`;
    item.style.zIndex = String(index + 1);
    item.style.setProperty('--lizzy-float-x', `${lizzyRandom(-8, 8)}px`);
    item.style.setProperty('--lizzy-float-y', `${lizzyRandom(-9, 9)}px`);
    item.style.setProperty('--lizzy-float-r', `${lizzyRandom(-6, 6)}deg`);
    item.style.setProperty('--lizzy-float-duration', `${lizzyRandom(5.8, 8.8)}s`);
    item.style.setProperty('--lizzy-float-delay', `${-lizzyRandom(0, 8)}s`);
    item.style.setProperty('--lizzy-bop-delay', `${-lizzyRandom(0, 0.7)}s`);

    if (LIZZY_BOP_INDEXES.has(index)) {
        item.classList.add('lizzy-intro-bop-target');
        if (lizzyIntroActive) item.classList.add('lizzy-intro-bop');
    }

    lizzyBackground.appendChild(item);
}

function lizzyCreateItems() {
    const slots = lizzyShuffle(LIZZY_SLOTS);
    const files = lizzyShuffle(LIZZY_FILES);
    const renderCount = Math.min(LIZZY_RENDER_COUNT, slots.length, files.length);

    for (let i = 0; i < renderCount; i++) {
        lizzyCreateItem(i, files[i], slots[i]);
    }
}

function lizzyCreateExtras() {
    if (!lizzyBackground) return;

    for (let i = 0; i < 24; i++) {
        const star = document.createElement('span');
        star.className = 'lizzy-extra lizzy-star';
        star.style.left = `${lizzyRandom(3, 97)}%`;
        star.style.top = `${lizzyRandom(6, 94)}%`;
        star.style.setProperty('--lizzy-extra-duration', `${lizzyRandom(3.6, 6.8)}s`);
        star.style.setProperty('--lizzy-extra-delay', `${-lizzyRandom(0, 7)}s`);
        lizzyBackground.appendChild(star);
    }

    for (let i = 0; i < 10; i++) {
        const blob = document.createElement('span');
        blob.className = 'lizzy-extra lizzy-blob';
        blob.style.left = `${lizzyRandom(4, 96)}%`;
        blob.style.top = `${lizzyRandom(6, 94)}%`;
        blob.style.width = `${lizzyRandom(18, 42)}px`;
        blob.style.height = `${lizzyRandom(10, 26)}px`;
        blob.style.setProperty('--lizzy-extra-rot', `${lizzyRandom(-30, 30)}deg`);
        blob.style.setProperty('--lizzy-extra-duration', `${lizzyRandom(4.4, 8)}s`);
        blob.style.setProperty('--lizzy-extra-delay', `${-lizzyRandom(0, 7)}s`);
        lizzyBackground.appendChild(blob);
    }
}

function lizzyStopIntro({ unlockHover = false } = {}) {
    if (lizzyIntroTick !== null) {
        cancelAnimationFrame(lizzyIntroTick);
        lizzyIntroTick = null;
    }
    if (lizzyIntroAudio) {
        try {
            lizzyIntroAudio.pause();
            lizzyIntroAudio.currentTime = 0;
            lizzyIntroAudio.removeAttribute('src');
            lizzyIntroAudio.load();
        } catch (_) {}
        lizzyIntroAudio = null;
    }
    lizzySetIntroBop(false);
    if (unlockHover) lizzyHoverUnlocked = true;
}

async function lizzyStartIntro() {
    lizzyStopIntro();
    lizzyHoverUnlocked = false;
    lizzySetIntroBop(true);

    const audio = new Audio();
    audio.preload = 'auto';
    audio.volume = LIZZY_INTRO_VOLUME;
    lizzyIntroAudio = audio;

    const finishIntro = () => {
        if (lizzyIntroAudio !== audio) return;
        try {
            audio.pause();
            audio.volume = 0;
        } catch (_) {}
        lizzyIntroAudio = null;
        lizzyIntroTick = null;
        lizzySetIntroBop(false);
        lizzyHoverUnlocked = true;
    };

    const updateIntro = () => {
        if (lizzyIntroAudio !== audio) return;
        const current = audio.currentTime || 0;

        if (current >= LIZZY_INTRO_CUTOFF) {
            finishIntro();
            return;
        }

        if (current >= LIZZY_INTRO_FADE_START) {
            const progress = Math.min(1, (current - LIZZY_INTRO_FADE_START) / (LIZZY_INTRO_CUTOFF - LIZZY_INTRO_FADE_START));
            audio.volume = LIZZY_INTRO_VOLUME * (1 - progress);
        } else {
            audio.volume = LIZZY_INTRO_VOLUME;
        }

        lizzyIntroTick = requestAnimationFrame(updateIntro);
    };

    try {
        await lizzyLoadAudioFromCandidates(audio, LIZZY_INTRO_SOURCES);
        const p = audio.play();
        if (p && typeof p.then === 'function') {
            p.then(() => {
                if (lizzyIntroAudio === audio) {
                    lizzyIntroTick = requestAnimationFrame(updateIntro);
                }
            }).catch(() => {
                if (lizzyIntroAudio === audio) {
                    lizzyStopIntro({ unlockHover: true });
                }
            });
        } else {
            lizzyIntroTick = requestAnimationFrame(updateIntro);
        }
    } catch (_) {
        if (lizzyIntroAudio === audio) {
            lizzyStopIntro({ unlockHover: true });
        }
    }
}

function lizzyStopHoverAudio() {
    if (lizzyHoverAudio) {
        try {
            lizzyHoverAudio.pause();
            lizzyHoverAudio.currentTime = 0;
            lizzyHoverAudio.removeAttribute('src');
            lizzyHoverAudio.load();
        } catch (_) {}
        lizzyHoverAudio = null;
    }
}

function lizzyPlayHover() {
    if (!lizzyHoverUnlocked) return;
    lizzyStopHoverAudio();

    const audio = new Audio(LIZZY_HOVER_SOUNDS[Math.floor(Math.random() * LIZZY_HOVER_SOUNDS.length)]);
    lizzyHoverAudio = audio;
    audio.volume = LIZZY_HOVER_VOLUME;
    const p = audio.play();
    if (p && typeof p.catch === 'function') p.catch(() => {});
}

function lizzyAnimateHover(item) {
    if (!item || typeof item.animate !== 'function') return;
    if (item._lizzyHoverAnimation) {
        try { item._lizzyHoverAnimation.cancel(); } catch (_) {}
    }

    item._lizzyHoverAnimation = item.animate([
        { translate: '0 0', rotate: '0deg', scale: '1' },
        { translate: '0 -10px', rotate: '-8deg', scale: '1.10', offset: 0.34 },
        { translate: '0 -4px', rotate: '7deg', scale: '1.06', offset: 0.70 },
        { translate: '0 0', rotate: '0deg', scale: '1' }
    ], { duration: 540, easing: 'ease-out', fill: 'none' });

    item._lizzyHoverAnimation.addEventListener('finish', () => {
        item._lizzyHoverAnimation = null;
    }, { once: true });
}

function lizzyInstallHover() {
    lizzyHoverHandler = (event) => {
        if (!lizzyBackground) return;
        let hit = null;
        for (const item of lizzyBackground.querySelectorAll('.lizzy-item')) {
            const r = item.getBoundingClientRect();
            if (event.clientX >= r.left && event.clientX <= r.right && event.clientY >= r.top && event.clientY <= r.bottom) {
                hit = item;
                break;
            }
        }
        if (hit && hit !== lizzyHoverLast) {
            lizzyHoverLast = hit;
            lizzyAnimateHover(hit);
            lizzyPlayHover();
        } else if (!hit) {
            lizzyHoverLast = null;
        }
    };
    document.addEventListener('mousemove', lizzyHoverHandler, { passive: true });
}

function lizzyRemoveHover() {
    if (lizzyHoverHandler) document.removeEventListener('mousemove', lizzyHoverHandler);
    lizzyHoverHandler = null;
    lizzyHoverLast = null;
    lizzyStopHoverAudio();
}

export function mount() {
    if (lizzyBackground) return;
    lizzyBackground = document.createElement('div');
    lizzyBackground.id = 'lizzy-background';
    lizzyBackground.setAttribute('aria-hidden', 'true');
    document.body.appendChild(lizzyBackground);
    lizzyCreateItems();
    lizzyCreateExtras();
    lizzyInstallHover();
    lizzyStartIntro();
}

export function unmount() {
    lizzyStopIntro();
    lizzyHoverUnlocked = false;
    lizzyRemoveHover();
    if (lizzyBackground) {
        lizzyBackground.remove();
        lizzyBackground = null;
    }
}
