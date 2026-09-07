/* ============================================================
   FLOWERHIP THEME
   Built from the winter theme's decorative mount/unmount pattern.

   Assets:
   - flowerhip-01.svg through flowerhip-18.svg
   - Intro: /sounds/intros/mmaudio-tin-kettle-parade-518503.mp3
   - Hover: the supplied Winx hover sounds
   ============================================================ */

let flowerhipBackground = null;
let flowerhipHoverHandler = null;
let flowerhipHoverLast = null;
let flowerhipHoverAudio = null;
let flowerhipIntroAudio = null;
let flowerhipIntroFadeFrame = null;
let flowerhipHoverUnlocked = false;
let flowerhipIntroActive = false;

const FLOWERHIP_FILES = Array.from({ length: 18 }, (_, i) => `flowerhip-${String(i + 1).padStart(2, "0")}.svg`);
const FLOWERHIP_BOP_INDEXES = new Set([1, 4, 6, 9, 12, 15]);
const FLOWERHIP_HOVER_SOUNDS = [
    "/sounds/winx/cartoon_music-arcade-game-positive-selection-bling-489760.mp3",
    "/sounds/winx/freesound_community-electricity-sound-6066.mp3",
    "/sounds/winx/freesound_community-match-sizzle-02-104778.mp3",
    "/sounds/winx/koiroylers-get-coin-351945.mp3"
];
const FLOWERHIP_INTRO_SOUNDS = [
    "/sounds/intros/mmaudio-tin-kettle-parade-518503.mp3",
    "/sounds/intros/mmaudio-tin-kettle-parade-518503"
];
const FLOWERHIP_INTRO_END = 20;
const FLOWERHIP_INTRO_FADE_START = 17;
const FLOWERHIP_INTRO_VOLUME = 0.48;

function flowerhipRandom(min, max) {
    return Math.random() * (max - min) + min;
}

function flowerhipAssetCandidates(file) {
    return [
        `/svg/flowerhip/${file}`,
        `/svg/theme-flowerhip/${file}`,
        `/svg/${file}`
    ];
}

function flowerhipSetImageSource(img, file) {
    const candidates = flowerhipAssetCandidates(file);
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

function flowerhipLoadAudioFromCandidates(audio, candidates) {
    return new Promise((resolve, reject) => {
        let index = 0;
        const cleanup = () => {
            audio.removeEventListener("loadedmetadata", onLoaded);
            audio.removeEventListener("canplay", onLoaded);
            audio.removeEventListener("error", onError);
        };
        const onLoaded = () => {
            cleanup();
            resolve(audio);
        };
        const onError = () => {
            if (index >= candidates.length) {
                cleanup();
                reject(new Error("audio-not-found"));
                return;
            }
            audio.src = candidates[index++];
            audio.load();
        };
        audio.addEventListener("loadedmetadata", onLoaded);
        audio.addEventListener("canplay", onLoaded);
        audio.addEventListener("error", onError);
        onError();
    });
}

function flowerhipSetIntroBop(active) {
    flowerhipIntroActive = active;
    if (!flowerhipBackground) return;
    for (const item of flowerhipBackground.querySelectorAll(".flowerhip-intro-bop-target")) {
        item.classList.toggle("flowerhip-intro-bop", active);
    }
}

/* ============================================================
   DECORATIONS
   ============================================================ */

function createFlowerhipItem(index) {
    if (!flowerhipBackground) return;

    const item = document.createElement("img");
    item.className = "flowerhip-item";
    item.alt = "";
    item.draggable = false;
    item.setAttribute("aria-hidden", "true");
    flowerhipSetImageSource(item, FLOWERHIP_FILES[index % FLOWERHIP_FILES.length]);

    const columns = [7, 18, 30, 44, 56, 70, 82, 93];
    const rows = [15, 31, 50, 69, 86];
    const grid = [
        { x: columns[0], y: rows[0] }, { x: columns[1], y: rows[1] }, { x: columns[0], y: rows[3] },
        { x: columns[2], y: rows[0] }, { x: columns[3], y: rows[1] }, { x: columns[2], y: rows[4] },
        { x: columns[5], y: rows[0] }, { x: columns[6], y: rows[1] }, { x: columns[7], y: rows[3] },
        { x: columns[4], y: rows[4] }, { x: columns[7], y: rows[0] }, { x: columns[6], y: rows[4] },
        { x: columns[1], y: rows[4] }, { x: columns[3], y: rows[3] }, { x: columns[5], y: rows[3] },
        { x: columns[4], y: rows[0] }, { x: columns[2], y: rows[2] }, { x: columns[5], y: rows[2] }
    ];
    const slot = grid[index % grid.length];

    item.style.left = `${slot.x + flowerhipRandom(-1.5, 1.5)}%`;
    item.style.top = `${slot.y + flowerhipRandom(-1.5, 1.5)}%`;
    item.style.width = `${flowerhipRandom(82, 132)}px`;
    item.style.setProperty("--flowerhip-float-x", `${flowerhipRandom(-12, 12)}px`);
    item.style.setProperty("--flowerhip-float-y", `${flowerhipRandom(-16, 16)}px`);
    item.style.setProperty("--flowerhip-float-r", `${flowerhipRandom(-10, 10)}deg`);
    item.style.setProperty("--flowerhip-float-duration", `${flowerhipRandom(5.7, 9.5)}s`);
    item.style.setProperty("--flowerhip-float-delay", `${-flowerhipRandom(0, 7)}s`);
    item.style.setProperty("--flowerhip-bop-delay", `${-flowerhipRandom(0, 0.65)}s`);

    if (FLOWERHIP_BOP_INDEXES.has(index)) {
        item.classList.add("flowerhip-intro-bop-target");
        if (flowerhipIntroActive) item.classList.add("flowerhip-intro-bop");
    }

    flowerhipBackground.appendChild(item);
}

function createFlowerhipItems() {
    for (let i = 0; i < FLOWERHIP_FILES.length; i++) createFlowerhipItem(i);
}

function createPetals() {
    if (!flowerhipBackground) return;

    for (let i = 0; i < 24; i++) {
        const petal = document.createElement("span");
        petal.className = "flowerhip-petal";
        petal.style.left = `${flowerhipRandom(2, 98)}%`;
        petal.style.top = `${flowerhipRandom(3, 96)}%`;
        petal.style.width = `${flowerhipRandom(7, 16)}px`;
        petal.style.height = `${flowerhipRandom(12, 22)}px`;
        petal.style.setProperty("--flowerhip-petal-x", `${flowerhipRandom(-18, 18)}px`);
        petal.style.setProperty("--flowerhip-petal-y", `${flowerhipRandom(-18, 18)}px`);
        petal.style.setProperty("--flowerhip-petal-r", `${flowerhipRandom(-28, 28)}deg`);
        petal.style.setProperty("--flowerhip-petal-duration", `${flowerhipRandom(4.8, 8.6)}s`);
        petal.style.setProperty("--flowerhip-petal-delay", `${-flowerhipRandom(0, 8)}s`);
        petal.style.setProperty("--flowerhip-petal-hue", `${flowerhipRandom(0, 360).toFixed(0)}deg`);
        flowerhipBackground.appendChild(petal);
    }
}

function createGlowDots() {
    if (!flowerhipBackground) return;

    for (let i = 0; i < 16; i++) {
        const dot = document.createElement("span");
        dot.className = "flowerhip-glow";
        dot.style.left = `${flowerhipRandom(4, 96)}%`;
        dot.style.top = `${flowerhipRandom(6, 92)}%`;
        dot.style.setProperty("--flowerhip-glow-duration", `${flowerhipRandom(3, 6)}s`);
        dot.style.setProperty("--flowerhip-glow-delay", `${-flowerhipRandom(0, 5)}s`);
        flowerhipBackground.appendChild(dot);
    }
}

/* ============================================================
   INTRO AUDIO
   ============================================================ */

function flowerhipStopIntro({ unlockHover = false } = {}) {
    if (flowerhipIntroFadeFrame !== null) {
        cancelAnimationFrame(flowerhipIntroFadeFrame);
        flowerhipIntroFadeFrame = null;
    }

    if (flowerhipIntroAudio) {
        try {
            flowerhipIntroAudio.pause();
            flowerhipIntroAudio.currentTime = 0;
            flowerhipIntroAudio.removeAttribute("src");
            flowerhipIntroAudio.load();
        } catch (_) {}
        flowerhipIntroAudio = null;
    }

    flowerhipSetIntroBop(false);
    if (unlockHover) flowerhipHoverUnlocked = true;
}

async function flowerhipStartIntro() {
    flowerhipStopIntro();
    flowerhipHoverUnlocked = false;
    flowerhipSetIntroBop(true);

    const audio = new Audio();
    audio.preload = "auto";
    audio.volume = FLOWERHIP_INTRO_VOLUME;
    flowerhipIntroAudio = audio;

    const finishIntro = () => {
        if (flowerhipIntroAudio !== audio) return;
        try {
            audio.pause();
            audio.currentTime = FLOWERHIP_INTRO_END;
            audio.volume = 0;
        } catch (_) {}
        flowerhipIntroAudio = null;
        flowerhipIntroFadeFrame = null;
        flowerhipSetIntroBop(false);
        flowerhipHoverUnlocked = true;
    };

    const updateIntro = () => {
        if (flowerhipIntroAudio !== audio) return;
        const current = audio.currentTime || 0;

        if (current >= FLOWERHIP_INTRO_END) {
            finishIntro();
            return;
        }

        if (current >= FLOWERHIP_INTRO_FADE_START) {
            const progress = Math.min(1, (current - FLOWERHIP_INTRO_FADE_START) / (FLOWERHIP_INTRO_END - FLOWERHIP_INTRO_FADE_START));
            audio.volume = FLOWERHIP_INTRO_VOLUME * (1 - progress);
        } else {
            audio.volume = FLOWERHIP_INTRO_VOLUME;
        }

        flowerhipIntroFadeFrame = requestAnimationFrame(updateIntro);
    };

    try {
        await flowerhipLoadAudioFromCandidates(audio, FLOWERHIP_INTRO_SOUNDS);
        const playPromise = audio.play();
        if (playPromise && typeof playPromise.then === "function") {
            playPromise
                .then(() => {
                    if (flowerhipIntroAudio === audio) flowerhipIntroFadeFrame = requestAnimationFrame(updateIntro);
                })
                .catch(() => {
                    if (flowerhipIntroAudio === audio) flowerhipStopIntro({ unlockHover: true });
                });
        } else {
            flowerhipIntroFadeFrame = requestAnimationFrame(updateIntro);
        }
    } catch (_) {
        if (flowerhipIntroAudio === audio) flowerhipStopIntro({ unlockHover: true });
    }
}

/* ============================================================
   HOVER AUDIO / ANIMATION
   ============================================================ */

function flowerhipStopHoverAudio() {
    if (flowerhipHoverAudio) {
        try {
            flowerhipHoverAudio.pause();
            flowerhipHoverAudio.currentTime = 0;
            flowerhipHoverAudio.removeAttribute("src");
            flowerhipHoverAudio.load();
        } catch (_) {}
        flowerhipHoverAudio = null;
    }
}

function flowerhipPlayHover() {
    if (!flowerhipHoverUnlocked) return;

    flowerhipStopHoverAudio();
    const audio = new Audio(FLOWERHIP_HOVER_SOUNDS[Math.floor(Math.random() * FLOWERHIP_HOVER_SOUNDS.length)]);
    flowerhipHoverAudio = audio;
    audio.volume = 0.38;
    const p = audio.play();
    if (p && typeof p.catch === "function") p.catch(() => {});
}

function flowerhipAnimateHover(item) {
    if (!item || typeof item.animate !== "function") return;

    if (item._flowerhipHoverAnimation) {
        try { item._flowerhipHoverAnimation.cancel(); } catch (_) {}
    }

    item._flowerhipHoverAnimation = item.animate(
        [
            { translate: "0 0", rotate: "0deg", scale: "1" },
            { translate: "0 -10px", rotate: "-8deg", scale: "1.09", offset: 0.34 },
            { translate: "0 -3px", rotate: "8deg", scale: "1.06", offset: 0.70 },
            { translate: "0 0", rotate: "0deg", scale: "1" }
        ],
        {
            duration: 540,
            easing: "ease-out",
            fill: "none"
        }
    );

    item._flowerhipHoverAnimation.addEventListener("finish", () => {
        item._flowerhipHoverAnimation = null;
    }, { once: true });
}

function flowerhipInstallHover() {
    flowerhipHoverHandler = (event) => {
        if (!flowerhipBackground) return;

        let hit = null;
        for (const item of flowerhipBackground.querySelectorAll(".flowerhip-item")) {
            const r = item.getBoundingClientRect();
            if (event.clientX >= r.left && event.clientX <= r.right &&
                event.clientY >= r.top && event.clientY <= r.bottom) {
                hit = item;
                break;
            }
        }

        if (hit && hit !== flowerhipHoverLast) {
            flowerhipHoverLast = hit;
            flowerhipAnimateHover(hit);
            flowerhipPlayHover();
        } else if (!hit) {
            flowerhipHoverLast = null;
        }
    };

    document.addEventListener("mousemove", flowerhipHoverHandler, { passive: true });
}

function flowerhipRemoveHover() {
    if (flowerhipHoverHandler) document.removeEventListener("mousemove", flowerhipHoverHandler);
    flowerhipHoverHandler = null;
    flowerhipHoverLast = null;
    flowerhipStopHoverAudio();
}

/* ============================================================
   MOUNT / UNMOUNT
   ============================================================ */

export function mount() {
    if (flowerhipBackground) return;

    flowerhipBackground = document.createElement("div");
    flowerhipBackground.id = "flowerhip-background";
    flowerhipBackground.setAttribute("aria-hidden", "true");
    document.body.appendChild(flowerhipBackground);

    createFlowerhipItems();
    createPetals();
    createGlowDots();
    flowerhipInstallHover();
    flowerhipStartIntro();
}

export function unmount() {
    flowerhipStopIntro();
    flowerhipHoverUnlocked = false;
    flowerhipRemoveHover();

    if (flowerhipBackground) {
        flowerhipBackground.remove();
        flowerhipBackground = null;
    }
}
