
let winxRoot = null;

const WINX_ASSETS = [
    "winx-character-01.svg",
    "winx-character-02.svg",
    "winx-character-03.svg",
    "winx-character-04.svg",
    "winx-character-05.svg",
    "winx-character-06.svg",
    "winx-character-07.svg",
    "winx-character-08.svg",
    "winx-character-09.svg",
    "winx-character-10.svg",
    "winx-character-11.svg",
    "winx-character-12.svg"
];

function winxRand(min, max) {
    return Math.random() * (max - min) + min;
}

function winxShuffle(items) {
    const copy = [...items];
    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
}



let winxHoverHandler = null;
let winxHoverLast = null;
let winxHoverAudio = null;
let winxIntroAudio = null;
let winxIntroStartHandler = null;
let winxHoverSoundsEnabled = false;
let winxIntroSourceIndex = 0;

// Same intro-audio flow used by the working Guitar theme.
// The first path is the normal public/sounds/intros path. The second is a
// fallback in case the file on disk was saved without the .mp3 extension.
const WINX_INTRO_SOURCES = [
    '/sounds/intros/emand_edroff-ethereal-reverse-crystal-swell-562157.mp3?winxIntro=20260903',
    '/sounds/intros/emand_edroff-ethereal-reverse-crystal-swell-562157?winxIntro=20260903'
];
const WINX_INTRO_VOLUME = 0.55;

function winxSetIntroBopping(active) {
    if (!winxRoot) return;
    winxRoot.classList.toggle('winx-intro-playing', !!active);
}

const WINX_HOVER_SOUNDS = [
    "/sounds/winx/cartoon_music-arcade-game-positive-selection-bling-489760.mp3",
    "/sounds/winx/freesound_community-electricity-sound-6066.mp3",
    "/sounds/winx/freesound_community-match-sizzle-02-104778.mp3",
    "/sounds/winx/koiroylers-get-coin-351945.mp3"
];

function winxRemoveIntroStartListeners() {
    if (!winxIntroStartHandler) return;

    document.removeEventListener('pointerdown', winxIntroStartHandler, true);
    document.removeEventListener('keydown', winxIntroStartHandler, true);
    winxIntroStartHandler = null;
}

function winxFinishIntro() {
    winxRemoveIntroStartListeners();
    winxSetIntroBopping(false);

    const audio = winxIntroAudio;
    winxIntroAudio = null;

    if (audio) {
        try {
            audio.pause();
            audio.currentTime = 0;
            audio.removeAttribute('src');
            audio.load();
        } catch (_) {}
    }

    // Winx SVG hover sounds unlock ONLY after the full intro reaches its end.
    winxHoverSoundsEnabled = true;
}

function winxTryNextIntroSource(previousAudio) {
    if (winxIntroAudio !== previousAudio) return;
    winxSetIntroBopping(false);

    try {
        previousAudio.pause();
        previousAudio.removeAttribute('src');
        previousAudio.load();
    } catch (_) {}

    winxIntroAudio = null;
    winxIntroSourceIndex += 1;

    if (winxIntroSourceIndex >= WINX_INTRO_SOURCES.length) {
        // If neither filename exists, do not leave hover sounds locked forever.
        winxHoverSoundsEnabled = true;
        return;
    }

    winxCreateAndStartIntroAudio();
}

function winxStartIntroPlayback() {
    if (!winxIntroAudio) return;

    winxRemoveIntroStartListeners();

    const audio = winxIntroAudio;
    audio.volume = WINX_INTRO_VOLUME;
    try { audio.currentTime = 0; } catch (_) {}

    const playPromise = audio.play();
    if (playPromise && typeof playPromise.then === 'function') {
        playPromise.then(() => {
            if (winxIntroAudio === audio && !audio.paused) {
                winxSetIntroBopping(true);
            }
        }).catch((error) => {
            winxSetIntroBopping(false);
            console.warn('[Winx intro] Playback was blocked; waiting for first click/key.', error);
            // Same autoplay fallback as Guitar: keep hover audio locked and
            // retry the intro on the user's first normal interaction.
            if (winxIntroAudio !== audio) return;

            winxIntroStartHandler = () => {
                if (winxIntroAudio !== audio) return;
                winxStartIntroPlayback();
            };

            document.addEventListener('pointerdown', winxIntroStartHandler, true);
            document.addEventListener('keydown', winxIntroStartHandler, true);
        });
    } else if (!audio.paused) {
        winxSetIntroBopping(true);
    }
}

function winxCreateAndStartIntroAudio() {
    const src = WINX_INTRO_SOURCES[winxIntroSourceIndex];
    const audio = new Audio(src);
    winxIntroAudio = audio;
    audio.preload = 'auto';
    audio.volume = WINX_INTRO_VOLUME;

    audio.addEventListener('ended', () => {
        if (winxIntroAudio === audio) winxFinishIntro();
    }, { once: true });

    audio.addEventListener('error', () => {
        console.warn('[Winx intro] Failed to load:', audio.currentSrc || src, 'media error:', audio.error);
        if (winxIntroAudio === audio) winxTryNextIntroSource(audio);
    }, { once: true });

    winxStartIntroPlayback();
}

function winxPlayIntro() {
    // This mirrors Guitar's reset -> lock hover -> create Audio -> play flow.
    winxStopIntroImmediately();
    winxHoverSoundsEnabled = false;
    winxIntroSourceIndex = 0;
    winxCreateAndStartIntroAudio();
}

function winxStopIntroImmediately() {
    winxHoverSoundsEnabled = false;
    winxSetIntroBopping(false);
    winxRemoveIntroStartListeners();

    if (!winxIntroAudio) return;

    try {
        winxIntroAudio.pause();
        winxIntroAudio.currentTime = 0;
        winxIntroAudio.removeAttribute('src');
        winxIntroAudio.load();
    } catch (_) {}

    winxIntroAudio = null;
}

function winxStopHoverAudio() {
    if (!winxHoverAudio) return;
    try {
        winxHoverAudio.pause();
        winxHoverAudio.currentTime = 0;
    } catch (_) {}
    winxHoverAudio = null;
}

function winxPlayHoverSound() {
    if (!winxHoverSoundsEnabled) return;

    winxStopHoverAudio();

    const src = WINX_HOVER_SOUNDS[
        Math.floor(Math.random() * WINX_HOVER_SOUNDS.length)
    ];

    const audio = new Audio(src);
    winxHoverAudio = audio;
    audio.preload = "auto";
    audio.volume = 0.42;

    audio.addEventListener("ended", () => {
        if (winxHoverAudio === audio) winxHoverAudio = null;
    }, { once: true });

    audio.addEventListener("error", () => {
        if (winxHoverAudio === audio) winxHoverAudio = null;
    }, { once: true });

    const p = audio.play();
    if (p && typeof p.catch === "function") {
        p.catch(() => {
            if (winxHoverAudio === audio) winxHoverAudio = null;
        });
    }
}

function winxInstallHover() {
    if (winxHoverHandler) return;

    winxHoverHandler = (event) => {
        if (!winxRoot) return;

        let hit = null;
        for (const item of winxRoot.querySelectorAll(".theme-winx-item")) {
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

        if (hit && hit !== winxHoverLast) {
            winxHoverLast = hit;

            hit.classList.remove("winx-hover-react");
            void hit.offsetWidth;
            hit.classList.add("winx-hover-react");

            winxPlayHoverSound();

            setTimeout(() => {
                hit.classList.remove("winx-hover-react");
            }, 560);
        } else if (!hit) {
            winxHoverLast = null;
        }
    };

    document.addEventListener("mousemove", winxHoverHandler, { passive: true });
}

function winxRemoveHover() {
    if (winxHoverHandler) {
        document.removeEventListener("mousemove", winxHoverHandler);
        winxHoverHandler = null;
    }
    winxHoverLast = null;
    winxStopHoverAudio();
}

export function mount() {
    if (winxRoot) return;

    winxRoot = document.createElement("div");
    winxRoot.id = "winx-background";
    winxRoot.setAttribute("aria-hidden", "true");
    document.body.appendChild(winxRoot);

    winxPlayIntro();

    // 12 dedicated slots with generous spacing. The first row starts low
    // enough that characters do not sit behind page titles.
    const slots = winxShuffle([
        [8, 31], [32, 32], [68, 32], [92, 31],
        [8, 57], [32, 58], [68, 58], [92, 57],
        [10, 83], [37, 83], [63, 83], [90, 83]
    ]);

    // Only some Winx characters bop during the intro. Pick five fresh
    // characters each time the theme mounts; everyone else keeps winxFloat.
    const introBoppers = new Set(
        winxShuffle(Array.from({ length: WINX_ASSETS.length }, (_, i) => i)).slice(0, 5)
    );

    WINX_ASSETS.forEach((file, index) => {
        const [x, y] = slots[index];

        const item = document.createElement("div");
        item.className = "theme-winx-item";
        if (introBoppers.has(index)) item.classList.add("winx-intro-bopper");
        item.style.left = `${x + winxRand(-1.0, 1.0)}%`;
        item.style.top = `${y + winxRand(-0.9, 0.9)}%`;
        item.style.setProperty("--w", `${winxRand(128, 165)}px`);
        item.style.setProperty("--r", `${winxRand(-5, 5)}deg`);
        item.style.setProperty("--dx", `${winxRand(-6, 6)}px`);
        item.style.setProperty("--dy", `${winxRand(-9, 9)}px`);
        item.style.setProperty("--dur", `${winxRand(7.2, 10.2)}s`);
        item.style.setProperty("--delay", `${-winxRand(0, 8)}s`);

        const img = document.createElement("img");
        img.src = `/svg/theme-winx/${encodeURIComponent(file)}`;
        img.alt = "";
        img.draggable = false;
        img.decoding = "async";

        item.appendChild(img);
        winxRoot.appendChild(item);
    });

    winxInstallHover();
}

export function unmount() {
    winxStopIntroImmediately();
    winxRemoveHover();
    if (winxRoot) {
        winxRoot.remove();
        winxRoot = null;
    }
}
