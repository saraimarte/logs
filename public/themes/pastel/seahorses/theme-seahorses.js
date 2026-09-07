/* ============================================================
   SEAHORSES THEME
   Built from the winter theme's decorative mount/unmount pattern.

   Assets:
   - seahorses-01.svg through seahorses-09.svg
   - Intro: /sounds/intros/tunetank-summer-latin-dance-music-349693.mp3
   - Hover: /sounds/seahorses/freesound_community-water-gentle-movement-29278.mp3
            from 0:03 through 0:05
   ============================================================ */

let seahorsesBackground = null;
let seahorsesHoverHandler = null;
let seahorsesHoverLast = null;
let seahorsesHoverAudio = null;
let seahorsesHoverToken = 0;
let seahorsesIntroAudio = null;
let seahorsesIntroFadeFrame = null;
let seahorsesHoverUnlocked = false;
let seahorsesIntroActive = false;

const SEAHORSE_FILES = Array.from({ length: 9 }, (_, i) => `seahorses-${String(i + 1).padStart(2, "0")}.svg`);
const SEAHORSE_BOP_INDEXES = new Set([1, 3, 6, 8]);

const SEAHORSE_INTRO_SOUND = "/sounds/intros/tunetank-summer-latin-dance-music-349693.mp3";
const SEAHORSE_INTRO_END = 20;
const SEAHORSE_INTRO_FADE_START = 17;
const SEAHORSE_INTRO_VOLUME = 0.50;

const SEAHORSE_HOVER_SOUND = "/sounds/seahorses/freesound_community-water-gentle-movement-29278.mp3";
const SEAHORSE_HOVER_START = 3;
const SEAHORSE_HOVER_END = 5;

function seahorsesRandom(min, max) {
    return Math.random() * (max - min) + min;
}

function seahorsesAssetCandidates(file) {
    return [
        `/svg/seahorses/${file}`,
        `/svg/theme-seahorses/${file}`,
        `/svg/${file}`
    ];
}

function seahorsesSetImageSource(img, file) {
    const candidates = seahorsesAssetCandidates(file);
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

function seahorsesSetIntroBop(active) {
    seahorsesIntroActive = active;
    if (!seahorsesBackground) return;
    for (const item of seahorsesBackground.querySelectorAll(".seahorses-intro-bop-target")) {
        item.classList.toggle("seahorses-intro-bop", active);
    }
}

/* ============================================================
   SEAHORSE DECORATIONS
   ============================================================ */

function createSeahorse(index) {
    if (!seahorsesBackground) return;

    const seahorse = document.createElement("img");
    seahorse.className = "seahorses-item";
    seahorse.alt = "";
    seahorse.draggable = false;
    seahorse.setAttribute("aria-hidden", "true");
    seahorsesSetImageSource(seahorse, SEAHORSE_FILES[index % SEAHORSE_FILES.length]);

    const slots = [
        { x: 8,  y: 19 }, { x: 21, y: 40 }, { x: 8,  y: 67 }, { x: 22, y: 85 },
        { x: 92, y: 18 }, { x: 80, y: 40 }, { x: 92, y: 66 }, { x: 79, y: 85 },
        { x: 50, y: 90 }
    ];
    const slot = slots[index % slots.length];

    seahorse.style.left = `${slot.x + seahorsesRandom(-1.8, 1.8)}%`;
    seahorse.style.top = `${slot.y + seahorsesRandom(-1.8, 1.8)}%`;
    seahorse.style.width = `${seahorsesRandom(112, 174)}px`;
    seahorse.style.setProperty("--seahorses-swim-x", `${seahorsesRandom(-14, 14)}px`);
    seahorse.style.setProperty("--seahorses-swim-y", `${seahorsesRandom(-17, 17)}px`);
    seahorse.style.setProperty("--seahorses-swim-r", `${seahorsesRandom(-7, 7)}deg`);
    seahorse.style.setProperty("--seahorses-swim-duration", `${seahorsesRandom(6.4, 10.8)}s`);
    seahorse.style.setProperty("--seahorses-swim-delay", `${-seahorsesRandom(0, 8)}s`);
    seahorse.style.setProperty("--seahorses-bop-delay", `${-seahorsesRandom(0, 0.65)}s`);

    if (SEAHORSE_BOP_INDEXES.has(index)) {
        seahorse.classList.add("seahorses-intro-bop-target");
        if (seahorsesIntroActive) seahorse.classList.add("seahorses-intro-bop");
    }

    seahorsesBackground.appendChild(seahorse);
}

function createSeahorses() {
    for (let i = 0; i < SEAHORSE_FILES.length; i++) createSeahorse(i);
}

function createBubbles() {
    if (!seahorsesBackground) return;

    for (let i = 0; i < 22; i++) {
        const bubble = document.createElement("span");
        bubble.className = "seahorses-bubble";
        bubble.style.left = `${seahorsesRandom(2, 98)}%`;
        bubble.style.bottom = `${seahorsesRandom(-12, 32)}%`;
        bubble.style.width = `${seahorsesRandom(5, 15)}px`;
        bubble.style.height = bubble.style.width;
        bubble.style.setProperty("--seahorses-bubble-drift", `${seahorsesRandom(-22, 22)}px`);
        bubble.style.setProperty("--seahorses-bubble-duration", `${seahorsesRandom(7, 14)}s`);
        bubble.style.setProperty("--seahorses-bubble-delay", `${-seahorsesRandom(0, 12)}s`);
        seahorsesBackground.appendChild(bubble);
    }
}

function createWaterSparkles() {
    if (!seahorsesBackground) return;

    for (let i = 0; i < 14; i++) {
        const sparkle = document.createElement("span");
        sparkle.className = "seahorses-sparkle";
        sparkle.style.left = `${seahorsesRandom(3, 97)}%`;
        sparkle.style.top = `${seahorsesRandom(12, 94)}%`;
        sparkle.style.setProperty("--seahorses-sparkle-delay", `${-seahorsesRandom(0, 7)}s`);
        sparkle.style.setProperty("--seahorses-sparkle-duration", `${seahorsesRandom(3.7, 7.2)}s`);
        seahorsesBackground.appendChild(sparkle);
    }
}

/* ============================================================
   INTRO AUDIO
   ============================================================ */

function seahorsesStopIntro({ unlockHover = false } = {}) {
    if (seahorsesIntroFadeFrame !== null) {
        cancelAnimationFrame(seahorsesIntroFadeFrame);
        seahorsesIntroFadeFrame = null;
    }

    if (seahorsesIntroAudio) {
        try {
            seahorsesIntroAudio.pause();
            seahorsesIntroAudio.currentTime = 0;
        } catch (_) {}
        seahorsesIntroAudio = null;
    }

    seahorsesSetIntroBop(false);
    if (unlockHover) seahorsesHoverUnlocked = true;
}

function seahorsesStartIntro() {
    seahorsesStopIntro();
    seahorsesHoverUnlocked = false;
    seahorsesSetIntroBop(true);

    const audio = new Audio(SEAHORSE_INTRO_SOUND);
    seahorsesIntroAudio = audio;
    audio.preload = "auto";
    audio.volume = SEAHORSE_INTRO_VOLUME;

    const finishIntro = () => {
        if (seahorsesIntroAudio !== audio) return;
        try {
            audio.pause();
            audio.currentTime = SEAHORSE_INTRO_END;
            audio.volume = 0;
        } catch (_) {}
        seahorsesIntroAudio = null;
        seahorsesIntroFadeFrame = null;
        seahorsesSetIntroBop(false);
        seahorsesHoverUnlocked = true;
    };

    const updateIntro = () => {
        if (seahorsesIntroAudio !== audio) return;

        const current = audio.currentTime || 0;
        if (current >= SEAHORSE_INTRO_END) {
            finishIntro();
            return;
        }

        if (current >= SEAHORSE_INTRO_FADE_START) {
            const progress = Math.min(1, (current - SEAHORSE_INTRO_FADE_START) / (SEAHORSE_INTRO_END - SEAHORSE_INTRO_FADE_START));
            audio.volume = SEAHORSE_INTRO_VOLUME * (1 - progress);
        } else {
            audio.volume = SEAHORSE_INTRO_VOLUME;
        }

        seahorsesIntroFadeFrame = requestAnimationFrame(updateIntro);
    };

    const playPromise = audio.play();
    if (playPromise && typeof playPromise.then === "function") {
        playPromise
            .then(() => {
                if (seahorsesIntroAudio === audio) seahorsesIntroFadeFrame = requestAnimationFrame(updateIntro);
            })
            .catch(() => {
                if (seahorsesIntroAudio === audio) seahorsesStopIntro({ unlockHover: true });
            });
    } else {
        seahorsesIntroFadeFrame = requestAnimationFrame(updateIntro);
    }
}

/* ============================================================
   HOVER WATER CLIP: 0:03 TO 0:05
   ============================================================ */

function seahorsesStopHoverAudio() {
    seahorsesHoverToken += 1;
    if (seahorsesHoverAudio) {
        try {
            seahorsesHoverAudio.pause();
            seahorsesHoverAudio.removeAttribute("src");
            seahorsesHoverAudio.load();
        } catch (_) {}
        seahorsesHoverAudio = null;
    }
}

function seahorsesPlayHover() {
    if (!seahorsesHoverUnlocked) return;

    seahorsesStopHoverAudio();
    const token = seahorsesHoverToken;
    const audio = new Audio(SEAHORSE_HOVER_SOUND);
    seahorsesHoverAudio = audio;
    audio.preload = "auto";
    audio.volume = 0.42;

    const stopAtEnd = () => {
        if (seahorsesHoverAudio !== audio || token !== seahorsesHoverToken) return;
        if (audio.currentTime >= SEAHORSE_HOVER_END) {
            try { audio.pause(); } catch (_) {}
            audio.removeEventListener("timeupdate", stopAtEnd);
            if (seahorsesHoverAudio === audio) seahorsesHoverAudio = null;
        }
    };

    const begin = () => {
        if (token !== seahorsesHoverToken || seahorsesHoverAudio !== audio) return;
        try { audio.currentTime = SEAHORSE_HOVER_START; } catch (_) {}
        audio.addEventListener("timeupdate", stopAtEnd);
        const p = audio.play();
        if (p && typeof p.catch === "function") p.catch(() => {});
    };

    if (audio.readyState >= 1) begin();
    else audio.addEventListener("loadedmetadata", begin, { once: true });
}

function seahorsesAnimateHover(seahorse) {
    if (!seahorse || typeof seahorse.animate !== "function") return;

    /* Keep the normal swimming animation on `transform` untouched.
       Recreate the original hover hop/tilt/scale with the independent
       transform longhands so the effect is relative to the seahorse's
       exact current swimming position and cannot snap across the screen. */
    if (seahorse._seahorsesHoverAnimation) {
        try { seahorse._seahorsesHoverAnimation.cancel(); } catch (_) {}
    }

    seahorse._seahorsesHoverAnimation = seahorse.animate(
        [
            { translate: "0 0",   rotate: "0deg",  scale: "1" },
            { translate: "0 -9px", rotate: "-8deg", scale: "1.11", offset: 0.34 },
            { translate: "0 -3px", rotate: "7deg",  scale: "1.07", offset: 0.68 },
            { translate: "0 0",   rotate: "0deg",  scale: "1" }
        ],
        {
            duration: 540,
            easing: "ease-out",
            fill: "none"
        }
    );

    seahorse._seahorsesHoverAnimation.addEventListener("finish", () => {
        seahorse._seahorsesHoverAnimation = null;
    }, { once: true });
}

function seahorsesInstallHover() {
    seahorsesHoverHandler = (event) => {
        if (!seahorsesBackground) return;

        let hit = null;
        for (const seahorse of seahorsesBackground.querySelectorAll(".seahorses-item")) {
            const r = seahorse.getBoundingClientRect();
            if (event.clientX >= r.left && event.clientX <= r.right &&
                event.clientY >= r.top && event.clientY <= r.bottom) {
                hit = seahorse;
                break;
            }
        }

        if (hit && hit !== seahorsesHoverLast) {
            seahorsesHoverLast = hit;
            seahorsesAnimateHover(hit);
            seahorsesPlayHover();
        } else if (!hit) {
            seahorsesHoverLast = null;
        }
    };

    document.addEventListener("mousemove", seahorsesHoverHandler, { passive: true });
}

function seahorsesRemoveHover() {
    if (seahorsesHoverHandler) document.removeEventListener("mousemove", seahorsesHoverHandler);
    seahorsesHoverHandler = null;
    seahorsesHoverLast = null;
    seahorsesStopHoverAudio();
}

/* ============================================================
   MOUNT / UNMOUNT
   ============================================================ */

export function mount() {
    if (seahorsesBackground) return;

    seahorsesBackground = document.createElement("div");
    seahorsesBackground.id = "seahorses-background";
    seahorsesBackground.setAttribute("aria-hidden", "true");
    document.body.appendChild(seahorsesBackground);

    createSeahorses();
    createBubbles();
    createWaterSparkles();
    seahorsesInstallHover();
    seahorsesStartIntro();
}

export function unmount() {
    seahorsesStopIntro();
    seahorsesHoverUnlocked = false;
    seahorsesRemoveHover();

    if (seahorsesBackground) {
        seahorsesBackground.remove();
        seahorsesBackground = null;
    }
}
