/* ============================================================
   SNOOPY THEME
   Built from the winter theme's decorative mount/unmount pattern.
   ============================================================ */

let snoopyBackground = null;
let snoopyHoverHandler = null;
let snoopyHoverLast = null;
let snoopyHoverAudio = null;
let snoopyIntroAudio = null;
let snoopyIntroTick = null;
let snoopyHoverUnlocked = false;
let snoopyIntroActive = false;

const SNOOPY_FILES = [
    "chef-snoopy-cupcake.svg",
    "sleeping-snoopy-woodstock.svg",
    "sleeping-snoopy.svg",
    "smiling-flower-character.svg",
    "smiling-flower-dog.svg",
    "snoopy-be-mine-heart.svg",
    "snoopy-blue-pom-poms.svg",
    "snoopy-cheer-pom-poms.svg",
    "snoopy-graduation.svg",
    "snoopy-heart-balloon.svg",
    "snoopy-love-envelope.svg",
    "snoopy-love-letter.svg",
    "snoopy-love-letters.svg",
    "snoopy-lying-down.svg",
    "snoopy-pink-bow-walk.svg",
    "snoopy-pink-bow.svg",
    "snoopy-pink-chair.svg",
    "snoopy-pink-envelope-sticker.svg",
    "snoopy-pink-guitar.svg",
    "snoopy-pink-ribbon-dance.svg",
    "snoopy-pink-scarf-walk.svg"
];
const SNOOPY_BOP_INDEXES = new Set([0, 3, 6, 9, 12, 15, 18]);
const SNOOPY_HOVER_SOUNDS = [
    "/sounds/snoopy/floraphonic-cute-character-wee-2-188161.mp3",
    "/sounds/snoopy/universfield-dont-touch-323641.mp3",
    "/sounds/snoopy/universfield-funny-no-no-03-276680.mp3",
    "/sounds/snoopy/universfield-woo-reaction-140506.mp3"
];
const SNOOPY_HOVER_VOLUME = 0.45;
const SNOOPY_INTRO_SOURCES = [
    "/sounds/intros/alex-morgan-cartoon-bouncy-chase-antics-578472.mp3",
    "/sounds/intros/alex-morgan-cartoon-bouncy-chase-antics-578472"
];
const SNOOPY_INTRO_CUTOFF = 25;
const SNOOPY_INTRO_FADE_START = 20;
const SNOOPY_INTRO_VOLUME = 0.34;

function snoopyRandom(min, max) { return Math.random() * (max - min) + min; }

function snoopyAssetCandidates(file) {
    return [
    "/svg/snoopy/{file}",
    "/svg/theme-snoopy/{file}",
    "/svg/{file}"
].map(path => path.replace('{file}', file));
}

function snoopySetImageSource(img, file) {
    const candidates = snoopyAssetCandidates(file);
    let index = 0;
    const tryNext = () => {
        if (index >= candidates.length) { img.onerror = null; return; }
        img.src = candidates[index++];
    };
    img.onerror = tryNext;
    tryNext();
}

function snoopyLoadAudioFromCandidates(audio, candidates) {
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

function snoopySetIntroBop(active) {
    snoopyIntroActive = active;
    if (!snoopyBackground) return;
    for (const item of snoopyBackground.querySelectorAll('.snoopy-intro-bop-target')) {
        item.classList.toggle('snoopy-intro-bop', active);
    }
}

function snoopyCreateItem(index, file, slot) {
    if (!snoopyBackground) return;
    const item = document.createElement('img');
    item.className = 'snoopy-item';
    item.alt = '';
    item.draggable = false;
    item.setAttribute('aria-hidden', 'true');
    snoopySetImageSource(item, file);
    item.style.left = `${slot[0] + snoopyRandom(-1.6, 1.6)}%`;
    item.style.top = `${slot[1] + snoopyRandom(-1.8, 1.8)}%`;
    item.style.width = `${snoopyRandom(92, 148)}px`;
    item.style.setProperty('--snoopy-float-x', `${snoopyRandom(-14, 14)}px`);
    item.style.setProperty('--snoopy-float-y', `${snoopyRandom(-17, 17)}px`);
    item.style.setProperty('--snoopy-float-r', `${snoopyRandom(-8, 8)}deg`);
    item.style.setProperty('--snoopy-float-duration', `${snoopyRandom(5.8, 9.0)}s`);
    item.style.setProperty('--snoopy-float-delay', `${-snoopyRandom(0, 8)}s`);
    item.style.setProperty('--snoopy-bop-delay', `${-snoopyRandom(0, .7)}s`);
    if (SNOOPY_BOP_INDEXES.has(index)) {
        item.classList.add('snoopy-intro-bop-target');
        if (snoopyIntroActive) item.classList.add('snoopy-intro-bop');
    }
    snoopyBackground.appendChild(item);
}


function snoopyCreateItems() {
    const slots = [[4, 13], [6, 24], [7, 36], [8, 50], [9, 64], [10, 78], [12, 90], [18, 18], [16, 32], [18, 48], [20, 66], [22, 90], [96, 12], [94, 24], [93, 38], [92, 52], [91, 68], [89, 84], [82, 18], [84, 36], [82, 58], [80, 88], [30, 91], [50, 93], [70, 91], [50, 15]].slice();
    const files = SNOOPY_FILES.slice();
    
    files.forEach((file, index) => snoopyCreateItem(index, file, slots[index % slots.length]));
}


function snoopyCreateExtras() {
    if (!snoopyBackground) return;
    for (let i = 0; i < 18; i++) { const e = document.createElement('span'); e.className = 'snoopy-extra'; e.style.left = `${snoopyRandom(4, 96)}%`; e.style.top = `${snoopyRandom(6, 94)}%`; e.style.setProperty('--snoopy-extra-duration', `${snoopyRandom(4.0, 8.0)}s`); e.style.setProperty('--snoopy-extra-delay', `${-snoopyRandom(0, 7)}s`); snoopyBackground.appendChild(e); }
}

function snoopyStopIntro({ unlockHover = false } = {}) {
    if (snoopyIntroTick !== null) { cancelAnimationFrame(snoopyIntroTick); snoopyIntroTick = null; }
    if (snoopyIntroAudio) {
        try { snoopyIntroAudio.pause(); snoopyIntroAudio.currentTime = 0; snoopyIntroAudio.removeAttribute('src'); snoopyIntroAudio.load(); } catch (_) {}
        snoopyIntroAudio = null;
    }
    snoopySetIntroBop(false);
    if (unlockHover) snoopyHoverUnlocked = true;
}

async function snoopyStartIntro() {
    snoopyStopIntro();
    snoopyHoverUnlocked = false;
    snoopySetIntroBop(true);
    const audio = new Audio();
    audio.preload = 'auto';
    audio.volume = SNOOPY_INTRO_VOLUME;
    snoopyIntroAudio = audio;

    const finishIntro = () => {
        if (snoopyIntroAudio !== audio) return;
        try { audio.pause(); audio.volume = 0; } catch (_) {}
        snoopyIntroAudio = null;
        snoopyIntroTick = null;
        snoopySetIntroBop(false);
        snoopyHoverUnlocked = true;
    };

    const updateIntro = () => {
        if (snoopyIntroAudio !== audio) return;
        const current = audio.currentTime || 0;
        if (current >= SNOOPY_INTRO_CUTOFF) { finishIntro(); return; }
        if (current >= SNOOPY_INTRO_FADE_START) {
            const progress = Math.min(1, (current - SNOOPY_INTRO_FADE_START) / (SNOOPY_INTRO_CUTOFF - SNOOPY_INTRO_FADE_START));
            audio.volume = SNOOPY_INTRO_VOLUME * (1 - progress);
        } else {
            audio.volume = SNOOPY_INTRO_VOLUME;
        }
        snoopyIntroTick = requestAnimationFrame(updateIntro);
    };

    try {
        await snoopyLoadAudioFromCandidates(audio, SNOOPY_INTRO_SOURCES);
        const p = audio.play();
        if (p && typeof p.then === 'function') {
            p.then(() => { if (snoopyIntroAudio === audio) snoopyIntroTick = requestAnimationFrame(updateIntro); })
             .catch(() => { if (snoopyIntroAudio === audio) snoopyStopIntro({ unlockHover: true }); });
        } else {
            snoopyIntroTick = requestAnimationFrame(updateIntro);
        }
    } catch (_) {
        if (snoopyIntroAudio === audio) snoopyStopIntro({ unlockHover: true });
    }
}

function snoopyStopHoverAudio() {
    if (snoopyHoverAudio) {
        try { snoopyHoverAudio.pause(); snoopyHoverAudio.currentTime = 0; snoopyHoverAudio.removeAttribute('src'); snoopyHoverAudio.load(); } catch (_) {}
        snoopyHoverAudio = null;
    }
}


function snoopyPlayHover() {
    if (!snoopyHoverUnlocked) return;
    snoopyStopHoverAudio();
    const audio = new Audio(SNOOPY_HOVER_SOUNDS[Math.floor(Math.random() * SNOOPY_HOVER_SOUNDS.length)]);
    snoopyHoverAudio = audio;
    audio.volume = SNOOPY_HOVER_VOLUME;
    const p = audio.play();
    if (p && typeof p.catch === 'function') p.catch(() => {});
}


function snoopyAnimateHover(item) {
    if (!item || typeof item.animate !== 'function') return;
    if (item._snoopyHoverAnimation) { try { item._snoopyHoverAnimation.cancel(); } catch (_) {} }
    item._snoopyHoverAnimation = item.animate([
        { translate: '0 0', rotate: '0deg', scale: '1' },
        { translate: '0 -10px', rotate: '-8deg', scale: '1.10', offset: .34 },
        { translate: '0 -4px', rotate: '7deg', scale: '1.06', offset: .70 },
        { translate: '0 0', rotate: '0deg', scale: '1' }
    ], { duration: 540, easing: 'ease-out', fill: 'none' });
    item._snoopyHoverAnimation.addEventListener('finish', () => { item._snoopyHoverAnimation = null; }, { once: true });
}

function snoopyInstallHover() {
    snoopyHoverHandler = (event) => {
        if (!snoopyBackground) return;
        let hit = null;
        for (const item of snoopyBackground.querySelectorAll('.snoopy-item')) {
            const r = item.getBoundingClientRect();
            if (event.clientX >= r.left && event.clientX <= r.right && event.clientY >= r.top && event.clientY <= r.bottom) { hit = item; break; }
        }
        if (hit && hit !== snoopyHoverLast) { snoopyHoverLast = hit; snoopyAnimateHover(hit); snoopyPlayHover(); }
        else if (!hit) { snoopyHoverLast = null; }
    };
    document.addEventListener('mousemove', snoopyHoverHandler, { passive: true });
}

function snoopyRemoveHover() {
    if (snoopyHoverHandler) document.removeEventListener('mousemove', snoopyHoverHandler);
    snoopyHoverHandler = null;
    snoopyHoverLast = null;
    snoopyStopHoverAudio();
}

export function mount() {
    if (snoopyBackground) return;
    snoopyBackground = document.createElement('div');
    snoopyBackground.id = 'snoopy-background';
    snoopyBackground.setAttribute('aria-hidden', 'true');
    document.body.appendChild(snoopyBackground);
    snoopyCreateItems();
    snoopyCreateExtras();
    snoopyInstallHover();
    snoopyStartIntro();
}

export function unmount() {
    snoopyStopIntro();
    snoopyHoverUnlocked = false;
    snoopyRemoveHover();
    if (snoopyBackground) { snoopyBackground.remove(); snoopyBackground = null; }
}
