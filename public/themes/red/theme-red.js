let redRoot = null;
let redHoverHandler = null;
let redHoverLast = null;
let redIntroAudio = null;
let redIntroFadeFrame = null;
let redIntroBopItems = [];

const RED_ASSETS = [
    "theme-red-01.svg",
    "theme-red-02.svg",
    "theme-red-03.svg",
    "theme-red-04.svg",
    "theme-red-05.svg",
    "theme-red-06.svg",
    "theme-red-07.svg",
    "theme-red-08.svg",
    "theme-red-09.svg",
    "theme-red-10.svg",
    "theme-red-11.svg",
    "theme-red-12.svg",
    "theme-red-13.svg",
    "theme-red-14.svg",
    "theme-red-15.svg",
    "theme-red-16.svg",
    "theme-red-17.svg",
    "theme-red-18.svg",
    "theme-red-19.svg",
    "theme-red-20.svg",
    "theme-red-21.svg",
    "theme-red-22.svg",
    "theme-red-23.svg",
    "theme-red-24.svg",
    "theme-red-25.svg",
    "theme-red-26.svg",
    "theme-red-27.svg"
];

const RED_INTRO_SOUND = "/sounds/intros/lnplusmusic-cuban-latin-trap-beat-469610.mp3";
const RED_INTRO_START = 0;
const RED_INTRO_END = 20;
const RED_INTRO_FADE_START = 17;
const RED_INTRO_VOLUME = 0.50;

function redRand(min, max) {
    return Math.random() * (max - min) + min;
}

function redShuffle(items) {
    const copy = [...items];
    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
}

function redClearIntroBop() {
    redIntroBopItems.forEach((item) => {
        item.classList.remove("red-intro-bop");
        item.style.removeProperty("--red-bop-duration");
        item.style.removeProperty("--red-bop-delay");
        item.style.removeProperty("--red-bop-lift");
        item.style.removeProperty("--red-bop-scale");
    });
    redIntroBopItems = [];
}

function redApplyIntroBop() {
    if (!redRoot) return;

    redClearIntroBop();
    const items = Array.from(redRoot.querySelectorAll(".theme-red-item"));
    const chosen = redShuffle(items).slice(0, Math.min(9, items.length));

    chosen.forEach((item) => {
        item.classList.add("red-intro-bop");
        item.style.setProperty("--red-bop-duration", `${redRand(0.56, 0.92).toFixed(2)}s`);
        item.style.setProperty("--red-bop-delay", `${(-redRand(0, 1.2)).toFixed(2)}s`);
        item.style.setProperty("--red-bop-lift", `${redRand(12, 22).toFixed(1)}px`);
        item.style.setProperty("--red-bop-scale", redRand(1.03, 1.09).toFixed(3));
    });

    redIntroBopItems = chosen;
}

function redStopIntro() {
    if (redIntroFadeFrame !== null) {
        cancelAnimationFrame(redIntroFadeFrame);
        redIntroFadeFrame = null;
    }

    if (redIntroAudio) {
        try {
            redIntroAudio.pause();
            redIntroAudio.currentTime = RED_INTRO_START;
        } catch (_) {}
        redIntroAudio = null;
    }

    redClearIntroBop();
}

function redStartIntro() {
    redStopIntro();
    redApplyIntroBop();

    const audio = new Audio(RED_INTRO_SOUND);
    redIntroAudio = audio;
    audio.preload = "auto";
    audio.volume = RED_INTRO_VOLUME;

    const applyStartTime = () => {
        if (redIntroAudio !== audio) return;
        try {
            if (audio.currentTime < RED_INTRO_START || audio.currentTime > RED_INTRO_START + 0.75) {
                audio.currentTime = RED_INTRO_START;
            }
        } catch (_) {}
    };

    try { audio.currentTime = RED_INTRO_START; } catch (_) {}
    audio.addEventListener("loadedmetadata", applyStartTime, { once: true });

    const finishIntro = () => {
        if (redIntroAudio !== audio) return;
        try {
            audio.pause();
            audio.currentTime = RED_INTRO_END;
            audio.volume = 0;
        } catch (_) {}
        redIntroAudio = null;
        redIntroFadeFrame = null;
        redClearIntroBop();
    };

    const updateIntro = () => {
        if (redIntroAudio !== audio) return;

        const current = audio.currentTime || 0;
        if (current >= RED_INTRO_END) {
            finishIntro();
            return;
        }

        if (current >= RED_INTRO_FADE_START) {
            const fadeProgress = Math.min(
                1,
                (current - RED_INTRO_FADE_START) /
                (RED_INTRO_END - RED_INTRO_FADE_START)
            );
            audio.volume = RED_INTRO_VOLUME * (1 - fadeProgress);
        } else {
            audio.volume = RED_INTRO_VOLUME;
        }

        redIntroFadeFrame = requestAnimationFrame(updateIntro);
    };

    const playPromise = audio.play();
    if (playPromise && typeof playPromise.then === "function") {
        playPromise
            .then(() => {
                if (redIntroAudio === audio) {
                    redIntroFadeFrame = requestAnimationFrame(updateIntro);
                }
            })
            .catch(() => {
                if (redIntroAudio === audio) redStopIntro();
            });
    } else {
        redIntroFadeFrame = requestAnimationFrame(updateIntro);
    }
}

function redInstallHover() {
    if (redHoverHandler) return;

    redHoverHandler = (event) => {
        if (!redRoot) return;

        let hit = null;
        for (const item of redRoot.querySelectorAll(".theme-red-item")) {
            const rect = item.getBoundingClientRect();
            if (
                event.clientX >= rect.left &&
                event.clientX <= rect.right &&
                event.clientY >= rect.top &&
                event.clientY <= rect.bottom
            ) {
                hit = item;
                break;
            }
        }

        if (hit && hit !== redHoverLast) {
            redHoverLast = hit;

            hit.classList.remove("red-hover-react");
            void hit.offsetWidth;
            hit.classList.add("red-hover-react");

            setTimeout(() => {
                hit.classList.remove("red-hover-react");
            }, 560);
        } else if (!hit) {
            redHoverLast = null;
        }
    };

    document.addEventListener("mousemove", redHoverHandler, { passive: true });
}

function redRemoveHover() {
    if (redHoverHandler) {
        document.removeEventListener("mousemove", redHoverHandler);
        redHoverHandler = null;
    }
    redHoverLast = null;
}

export function mount() {
    if (redRoot) return;

    redRoot = document.createElement("div");
    redRoot.id = "red-background";
    redRoot.setAttribute("aria-hidden", "true");
    document.body.appendChild(redRoot);

    // Fill the outside edges first so the decorative SVGs frame the page.
    // Bottom and upper-right are intentionally denser; only the final few
    // assets are allowed to move inward toward the center.
    const perimeterSlots = redShuffle([
        // Upper-left / left edge
        [4, 18], [11, 24], [5, 34], [13, 43], [5, 54], [14, 63], [5, 72],

        // Upper-right corner + right edge (extra dense)
        [96, 12], [88, 17], [96, 25], [86, 30], [95, 39], [86, 45],
        [95, 55], [86, 62], [95, 70],

        // Bottom edge (extra dense from corner to corner)
        [5, 84], [14, 91], [25, 86], [37, 92], [50, 87], [63, 92],
        [75, 86], [86, 91], [96, 83]
    ]);

    const innerSlots = redShuffle([
        [24, 35], [76, 36], [27, 56], [73, 57], [34, 72], [67, 72],
        [50, 78], [38, 47], [62, 47], [50, 38]
    ]);

    const slots = [...perimeterSlots, ...innerSlots].slice(0, RED_ASSETS.length);

    RED_ASSETS.forEach((file, index) => {
        const [x, y] = slots[index];

        const item = document.createElement("div");
        item.className = "theme-red-item";
        item.style.left = `${x + redRand(-1.0, 1.0)}%`;
        item.style.top = `${y + redRand(-0.9, 0.9)}%`;
        if (file === "theme-red-05.svg") {
            item.style.setProperty("--w", `${redRand(74, 92)}px`);
        } else {
            item.style.setProperty("--w", `${redRand(104, 144)}px`);
        }
        item.style.setProperty("--r", `${redRand(-5, 5)}deg`);
        item.style.setProperty("--dx", `${redRand(-6, 6)}px`);
        item.style.setProperty("--dy", `${redRand(-9, 9)}px`);
        item.style.setProperty("--dur", `${redRand(7.2, 10.2)}s`);
        item.style.setProperty("--delay", `${-redRand(0, 8)}s`);

        const img = document.createElement("img");
        img.src = `/svg/theme-red/${encodeURIComponent(file)}`;
        img.alt = "";
        img.draggable = false;
        img.decoding = "async";

        item.appendChild(img);
        redRoot.appendChild(item);
    });

    redInstallHover();
    redStartIntro();
}

export function unmount() {
    redRemoveHover();
    redStopIntro();

    if (redRoot) {
        redRoot.remove();
        redRoot = null;
    }
}
