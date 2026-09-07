let goldRoot = null;
let goldHoverHandler = null;
let goldHoverLast = null;
let goldIntroAudio = null;
let goldIntroFadeFrame = null;
let goldIntroBopItems = [];

const GOLD_ASSETS = [
    "theme-gold-01.svg",
    "theme-gold-02.svg",
    "theme-gold-03.svg",
    "theme-gold-04.svg",
    "theme-gold-05.svg",
    "theme-gold-06.svg",
    "theme-gold-07.svg",
    "theme-gold-08.svg",
    "theme-gold-09.svg",
    "theme-gold-10.svg",
    "theme-gold-11.svg",
    "theme-gold-12.svg",
    "theme-gold-13.svg",
    "theme-gold-14.svg",
    "theme-gold-15.svg",
    "theme-gold-16.svg",
    "theme-gold-17.svg",
    "theme-gold-18.svg",
    "theme-gold-19.svg",
    "theme-gold-20.svg",
    "theme-gold-21.svg",
    "theme-gold-22.svg",
    "theme-gold-23.svg",
    "theme-gold-24.svg",
    "theme-gold-25.svg",
    "theme-gold-26.svg"
];

const GOLD_INTRO_SOUND = "/sounds/intros/grand_project-like-it_long-263118.mp3";
const GOLD_INTRO_START = 0;
const GOLD_INTRO_END = 20;
const GOLD_INTRO_FADE_START = 17;
const GOLD_INTRO_VOLUME = 0.50;

function goldRand(min, max) {
    return Math.random() * (max - min) + min;
}

function goldShuffle(items) {
    const copy = [...items];
    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
}

function goldClearIntroBop() {
    goldIntroBopItems.forEach((item) => {
        item.classList.remove("gold-intro-bop");
        item.style.removeProperty("--gold-bop-duration");
        item.style.removeProperty("--gold-bop-delay");
        item.style.removeProperty("--gold-bop-lift");
        item.style.removeProperty("--gold-bop-scale");
    });
    goldIntroBopItems = [];
}

function goldApplyIntroBop() {
    if (!goldRoot) return;

    goldClearIntroBop();
    const items = Array.from(goldRoot.querySelectorAll(".theme-gold-item"));
    const chosen = goldShuffle(items).slice(0, Math.min(8, items.length));

    chosen.forEach((item) => {
        item.classList.add("gold-intro-bop");
        item.style.setProperty("--gold-bop-duration", `${goldRand(0.60, 0.98).toFixed(2)}s`);
        item.style.setProperty("--gold-bop-delay", `${(-goldRand(0, 1.2)).toFixed(2)}s`);
        item.style.setProperty("--gold-bop-lift", `${goldRand(10, 19).toFixed(1)}px`);
        item.style.setProperty("--gold-bop-scale", goldRand(1.02, 1.08).toFixed(3));
    });

    goldIntroBopItems = chosen;
}

function goldStopIntro() {
    if (goldIntroFadeFrame !== null) {
        cancelAnimationFrame(goldIntroFadeFrame);
        goldIntroFadeFrame = null;
    }

    if (goldIntroAudio) {
        try {
            goldIntroAudio.pause();
            goldIntroAudio.currentTime = GOLD_INTRO_START;
        } catch (_) {}
        goldIntroAudio = null;
    }

    goldClearIntroBop();
}

function goldStartIntro() {
    goldStopIntro();
    goldApplyIntroBop();

    const audio = new Audio(GOLD_INTRO_SOUND);
    goldIntroAudio = audio;
    audio.preload = "auto";
    audio.volume = GOLD_INTRO_VOLUME;

    const applyStartTime = () => {
        if (goldIntroAudio !== audio) return;
        try {
            if (audio.currentTime < GOLD_INTRO_START || audio.currentTime > GOLD_INTRO_START + 0.75) {
                audio.currentTime = GOLD_INTRO_START;
            }
        } catch (_) {}
    };

    try { audio.currentTime = GOLD_INTRO_START; } catch (_) {}
    audio.addEventListener("loadedmetadata", applyStartTime, { once: true });

    const finishIntro = () => {
        if (goldIntroAudio !== audio) return;
        try {
            audio.pause();
            audio.currentTime = GOLD_INTRO_END;
            audio.volume = 0;
        } catch (_) {}
        goldIntroAudio = null;
        goldIntroFadeFrame = null;
        goldClearIntroBop();
    };

    const updateIntro = () => {
        if (goldIntroAudio !== audio) return;

        const current = audio.currentTime || 0;
        if (current >= GOLD_INTRO_END) {
            finishIntro();
            return;
        }

        if (current >= GOLD_INTRO_FADE_START) {
            const fadeProgress = Math.min(
                1,
                (current - GOLD_INTRO_FADE_START) /
                (GOLD_INTRO_END - GOLD_INTRO_FADE_START)
            );
            audio.volume = GOLD_INTRO_VOLUME * (1 - fadeProgress);
        } else {
            audio.volume = GOLD_INTRO_VOLUME;
        }

        goldIntroFadeFrame = requestAnimationFrame(updateIntro);
    };

    const playPromise = audio.play();
    if (playPromise && typeof playPromise.then === "function") {
        playPromise
            .then(() => {
                if (goldIntroAudio === audio) {
                    goldIntroFadeFrame = requestAnimationFrame(updateIntro);
                }
            })
            .catch(() => {
                if (goldIntroAudio === audio) goldStopIntro();
            });
    } else {
        goldIntroFadeFrame = requestAnimationFrame(updateIntro);
    }
}

function goldInstallHover() {
    if (goldHoverHandler) return;

    goldHoverHandler = (event) => {
        if (!goldRoot) return;

        let hit = null;
        for (const item of goldRoot.querySelectorAll(".theme-gold-item")) {
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

        if (hit && hit !== goldHoverLast) {
            goldHoverLast = hit;

            hit.classList.remove("gold-hover-react");
            void hit.offsetWidth;
            hit.classList.add("gold-hover-react");

            setTimeout(() => {
                hit.classList.remove("gold-hover-react");
            }, 560);
        } else if (!hit) {
            goldHoverLast = null;
        }
    };

    document.addEventListener("mousemove", goldHoverHandler, { passive: true });
}

function goldRemoveHover() {
    if (goldHoverHandler) {
        document.removeEventListener("mousemove", goldHoverHandler);
        goldHoverHandler = null;
    }
    goldHoverLast = null;
}

export function mount() {
    if (goldRoot) return;

    goldRoot = document.createElement("div");
    goldRoot.id = "gold-background";
    goldRoot.setAttribute("aria-hidden", "true");
    document.body.appendChild(goldRoot);

    const slots = goldShuffle([
        [5, 27], [13, 23], [87, 23], [95, 27],
        [6, 40], [15, 36], [85, 36], [94, 40],
        [6, 54], [17, 50], [83, 50], [94, 54],
        [6, 68], [16, 64], [84, 64], [94, 68],
        [5, 82], [14, 86], [86, 86], [95, 82],
        [28, 30], [72, 30], [26, 50], [74, 50],
        [30, 72], [70, 72], [50, 86], [38, 60],
        [62, 60], [50, 44]
    ]).slice(0, 26);

    GOLD_ASSETS.forEach((file, index) => {
        const [x, y] = slots[index];

        const item = document.createElement("div");
        item.className = "theme-gold-item";
        item.style.left = `${x + goldRand(-1.0, 1.0)}%`;
        item.style.top = `${y + goldRand(-0.9, 0.9)}%`;
        item.style.setProperty("--w", `${goldRand(110, 152)}px`);
        item.style.setProperty("--r", `${goldRand(-5, 5)}deg`);
        item.style.setProperty("--dx", `${goldRand(-6, 6)}px`);
        item.style.setProperty("--dy", `${goldRand(-9, 9)}px`);
        item.style.setProperty("--dur", `${goldRand(7.2, 10.2)}s`);
        item.style.setProperty("--delay", `${-goldRand(0, 8)}s`);

        const img = document.createElement("img");
        img.src = `/svg/theme-gold/${encodeURIComponent(file)}`;
        img.alt = "";
        img.draggable = false;
        img.decoding = "async";

        item.appendChild(img);
        goldRoot.appendChild(item);
    });

    goldInstallHover();
    goldStartIntro();
}

export function unmount() {
    goldRemoveHover();
    goldStopIntro();

    if (goldRoot) {
        goldRoot.remove();
        goldRoot = null;
    }
}
