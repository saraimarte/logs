/* ============================================================
   HEALS THEME
   Built from the winter theme's decorative mount/unmount pattern.

   Assets:
   - heals-01.svg through heals-09.svg
   - Intro: /sounds/intros/u_wkowpo16oc-city-pulse-406877.mp3
   - Hover sounds: same four sounds used by the winter theme
   ============================================================ */

let healsBackground = null;
let healsHoverHandler = null;
let healsHoverLast = null;
let healsHoverAudio = null;
let healsIntroAudio = null;
let healsIntroFadeFrame = null;
let healsHoverUnlocked = false;
let healsIntroActive = false;

const HEALS_FILES = Array.from({ length: 9 }, (_, i) => `heals-${String(i + 1).padStart(2, "0")}.svg`);
const HEALS_BOP_INDEXES = new Set([0, 2, 5, 7]);

const HEALS_INTRO_SOUND = "/sounds/intros/u_wkowpo16oc-city-pulse-406877.mp3";
const HEALS_INTRO_END = 20;
const HEALS_INTRO_FADE_START = 17;
const HEALS_INTRO_VOLUME = 0.50;

const HEALS_HOVER_SOUNDS = [
    "/sounds/winx/cartoon_music-arcade-game-positive-selection-bling-489760.mp3",
    "/sounds/winx/freesound_community-electricity-sound-6066.mp3",
    "/sounds/winx/freesound_community-match-sizzle-02-104778.mp3",
    "/sounds/winx/koiroylers-get-coin-351945.mp3"
];

function healsRandom(min, max) {
    return Math.random() * (max - min) + min;
}

function healsAssetCandidates(file) {
    return [
        `/svg/heals/${file}`,
        `/svg/theme-heals/${file}`,
        `/svg/${file}`
    ];
}

function healsSetImageSource(img, file) {
    const candidates = healsAssetCandidates(file);
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

function healsSetIntroBop(active) {
    healsIntroActive = active;
    if (!healsBackground) return;
    for (const item of healsBackground.querySelectorAll(".heals-intro-bop-target")) {
        item.classList.toggle("heals-intro-bop", active);
    }
}

/* ============================================================
   HEEL DECORATIONS
   ============================================================ */

function createHeel(index) {
    if (!healsBackground) return;

    const heel = document.createElement("img");
    heel.className = "heals-item";
    heel.alt = "";
    heel.draggable = false;
    heel.setAttribute("aria-hidden", "true");
    healsSetImageSource(heel, HEALS_FILES[index % HEALS_FILES.length]);

    const slots = [
        { x: 8,  y: 18 }, { x: 22, y: 39 }, { x: 8,  y: 69 }, { x: 23, y: 86 },
        { x: 92, y: 17 }, { x: 79, y: 39 }, { x: 92, y: 68 }, { x: 78, y: 86 },
        { x: 50, y: 90 }
    ];
    const slot = slots[index % slots.length];

    heel.style.left = `${slot.x + healsRandom(-1.8, 1.8)}%`;
    heel.style.top = `${slot.y + healsRandom(-1.8, 1.8)}%`;
    heel.style.width = `${healsRandom(118, 178)}px`;
    heel.style.setProperty("--heals-float-x", `${healsRandom(-11, 11)}px`);
    heel.style.setProperty("--heals-float-y", `${healsRandom(-14, 14)}px`);
    heel.style.setProperty("--heals-float-r", `${healsRandom(-6, 6)}deg`);
    heel.style.setProperty("--heals-float-duration", `${healsRandom(6.2, 10.2)}s`);
    heel.style.setProperty("--heals-float-delay", `${-healsRandom(0, 8)}s`);
    heel.style.setProperty("--heals-bop-delay", `${-healsRandom(0, 0.6)}s`);

    if (HEALS_BOP_INDEXES.has(index)) {
        heel.classList.add("heals-intro-bop-target");
        if (healsIntroActive) heel.classList.add("heals-intro-bop");
    }

    healsBackground.appendChild(heel);
}

function createHeels() {
    for (let i = 0; i < HEALS_FILES.length; i++) createHeel(i);
}

function createRunwaySparkles() {
    if (!healsBackground) return;

    for (let i = 0; i < 18; i++) {
        const sparkle = document.createElement("span");
        sparkle.className = "heals-sparkle";
        sparkle.style.left = `${healsRandom(3, 97)}%`;
        sparkle.style.top = `${healsRandom(9, 96)}%`;
        sparkle.style.setProperty("--heals-sparkle-delay", `${-healsRandom(0, 7)}s`);
        sparkle.style.setProperty("--heals-sparkle-duration", `${healsRandom(3.4, 6.6)}s`);
        sparkle.style.setProperty("--heals-sparkle-scale", healsRandom(0.75, 1.45).toFixed(2));
        healsBackground.appendChild(sparkle);
    }
}

function createRunwayDots() {
    if (!healsBackground) return;
    for (let i = 0; i < 10; i++) {
        const dot = document.createElement("span");
        dot.className = "heals-runway-dot";
        dot.style.left = `${8 + i * 9.3}%`;
        dot.style.setProperty("--heals-dot-delay", `${-i * 0.18}s`);
        healsBackground.appendChild(dot);
    }
}

/* ============================================================
   INTRO AUDIO
   ============================================================ */

function healsStopIntro({ unlockHover = false } = {}) {
    if (healsIntroFadeFrame !== null) {
        cancelAnimationFrame(healsIntroFadeFrame);
        healsIntroFadeFrame = null;
    }

    if (healsIntroAudio) {
        try {
            healsIntroAudio.pause();
            healsIntroAudio.currentTime = 0;
        } catch (_) {}
        healsIntroAudio = null;
    }

    healsSetIntroBop(false);
    if (unlockHover) healsHoverUnlocked = true;
}

function healsStartIntro() {
    healsStopIntro();
    healsHoverUnlocked = false;
    healsSetIntroBop(true);

    const audio = new Audio(HEALS_INTRO_SOUND);
    healsIntroAudio = audio;
    audio.preload = "auto";
    audio.volume = HEALS_INTRO_VOLUME;

    const finishIntro = () => {
        if (healsIntroAudio !== audio) return;
        try {
            audio.pause();
            audio.currentTime = HEALS_INTRO_END;
            audio.volume = 0;
        } catch (_) {}
        healsIntroAudio = null;
        healsIntroFadeFrame = null;
        healsSetIntroBop(false);
        healsHoverUnlocked = true;
    };

    const updateIntro = () => {
        if (healsIntroAudio !== audio) return;

        const current = audio.currentTime || 0;
        if (current >= HEALS_INTRO_END) {
            finishIntro();
            return;
        }

        if (current >= HEALS_INTRO_FADE_START) {
            const progress = Math.min(1, (current - HEALS_INTRO_FADE_START) / (HEALS_INTRO_END - HEALS_INTRO_FADE_START));
            audio.volume = HEALS_INTRO_VOLUME * (1 - progress);
        } else {
            audio.volume = HEALS_INTRO_VOLUME;
        }

        healsIntroFadeFrame = requestAnimationFrame(updateIntro);
    };

    const playPromise = audio.play();
    if (playPromise && typeof playPromise.then === "function") {
        playPromise
            .then(() => {
                if (healsIntroAudio === audio) healsIntroFadeFrame = requestAnimationFrame(updateIntro);
            })
            .catch(() => {
                if (healsIntroAudio === audio) healsStopIntro({ unlockHover: true });
            });
    } else {
        healsIntroFadeFrame = requestAnimationFrame(updateIntro);
    }
}

/* ============================================================
   HOVER AUDIO / EFFECT
   ============================================================ */

function healsPlayHover() {
    if (!healsHoverUnlocked) return;

    if (healsHoverAudio) {
        try {
            healsHoverAudio.pause();
            healsHoverAudio.currentTime = 0;
        } catch (_) {}
    }

    const audio = new Audio(HEALS_HOVER_SOUNDS[Math.floor(Math.random() * HEALS_HOVER_SOUNDS.length)]);
    healsHoverAudio = audio;
    audio.volume = 0.40;
    const p = audio.play();
    if (p && typeof p.catch === "function") p.catch(() => {});
}

function healsInstallHover() {
    healsHoverHandler = (event) => {
        if (!healsBackground) return;

        let hit = null;
        for (const heel of healsBackground.querySelectorAll(".heals-item")) {
            const r = heel.getBoundingClientRect();
            if (event.clientX >= r.left && event.clientX <= r.right &&
                event.clientY >= r.top && event.clientY <= r.bottom) {
                hit = heel;
                break;
            }
        }

        if (hit && hit !== healsHoverLast) {
            healsHoverLast = hit;
            hit.classList.remove("heals-hover");
            void hit.offsetWidth;
            hit.classList.add("heals-hover");
            setTimeout(() => hit.classList.remove("heals-hover"), 560);
            healsPlayHover();
        } else if (!hit) {
            healsHoverLast = null;
        }
    };

    document.addEventListener("mousemove", healsHoverHandler, { passive: true });
}

function healsRemoveHover() {
    if (healsHoverHandler) document.removeEventListener("mousemove", healsHoverHandler);
    healsHoverHandler = null;
    healsHoverLast = null;

    if (healsHoverAudio) {
        try {
            healsHoverAudio.pause();
            healsHoverAudio.currentTime = 0;
        } catch (_) {}
        healsHoverAudio = null;
    }
}

/* ============================================================
   MOUNT / UNMOUNT
   ============================================================ */

export function mount() {
    if (healsBackground) return;

    healsBackground = document.createElement("div");
    healsBackground.id = "heals-background";
    healsBackground.setAttribute("aria-hidden", "true");
    document.body.appendChild(healsBackground);

    createHeels();
    createRunwaySparkles();
    createRunwayDots();
    healsInstallHover();
    healsStartIntro();
}

export function unmount() {
    healsStopIntro();
    healsHoverUnlocked = false;
    healsRemoveHover();

    if (healsBackground) {
        healsBackground.remove();
        healsBackground = null;
    }
}
