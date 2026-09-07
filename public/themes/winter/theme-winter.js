/* ============================================================
   WINTER THEME
   Decorative-only winter background.

   IMPORTANT:
   - Uses the existing snowflake SVGs in /public/svg/theme-winter.
   - Does NOT modify the application cursor, companion stages, tabs,
     selectors, modal logic, view structure, or application behavior.
   - Animation is CSS-driven after mount for smooth performance.
   ============================================================ */

let winterBackground = null;

const WINTER_SNOWFLAKES = [
    "/svg/theme-winter/snowflake1.svg",
    "/svg/theme-winter/snowflake2.svg",
    "/svg/theme-winter/snowflake3.svg",
    "/svg/theme-winter/snowflake4.svg",
    "/svg/theme-winter/snowflake5.svg",
    "/svg/theme-winter/snowflake6.svg",
    "/svg/theme-winter/snowflake7.svg",
    "/svg/theme-winter/snowflake8.svg",
    "/svg/theme-winter/snowflake9.svg"
];

function winterRandom(min, max) {
    return Math.random() * (max - min) + min;
}

function winterPick(array) {
    return array[Math.floor(Math.random() * array.length)];
}

/* ============================================================
   FALLING SNOW
   ============================================================ */

function createSnowflake(index) {
    if (!winterBackground) return;

    const flake = document.createElement("img");
    flake.className = "winter-snowflake winter-big-snowflake";
    flake.src = WINTER_SNOWFLAKES[index % WINTER_SNOWFLAKES.length];
    flake.alt = "";
    flake.draggable = false;
    flake.setAttribute("aria-hidden", "true");

    const slots = [
        {x:7,y:19},{x:20,y:39},{x:8,y:67},{x:21,y:84},
        {x:93,y:18},{x:80,y:39},{x:92,y:65},{x:79,y:84},
        {x:50,y:88}
    ];
    const slot = slots[index % slots.length];

    flake.style.left = `${slot.x + winterRandom(-2,2)}%`;
    flake.style.top = `${slot.y + winterRandom(-2,2)}%`;
    flake.style.width = `${winterRandom(125, 205)}px`;
    flake.style.height = "auto";
    flake.style.setProperty("--winter-float-x", `${winterRandom(-12,12)}px`);
    flake.style.setProperty("--winter-float-y", `${winterRandom(-16,16)}px`);
    flake.style.setProperty("--winter-float-r", `${winterRandom(-8,8)}deg`);
    flake.style.setProperty("--winter-float-duration", `${winterRandom(6.5,10.5)}s`);
    flake.style.setProperty("--winter-float-delay", `${-winterRandom(0,8)}s`);

    winterBackground.appendChild(flake);
}

function createSnowfall() {
    for (let i = 0; i < WINTER_SNOWFLAKES.length; i++) createSnowflake(i);
}

/* ============================================================
   ICICLES
   SVG decoration is generated here so it matches the crisp illustrated
   snowflake artwork instead of looking like a CSS rectangle overlay.
   ============================================================ */

function createIcicleSvg(uniqueId) {
    const ns = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(ns, "svg");
    svg.setAttribute("viewBox", "0 0 240 82");
    svg.setAttribute("aria-hidden", "true");
    svg.classList.add("winter-icicle-svg");

    svg.innerHTML = `
        <defs>
            <linearGradient id="winterIceFill-${uniqueId}" x1="0" y1="0" x2="0.8" y2="1">
                <stop offset="0" stop-color="#f9fdff"/>
                <stop offset="0.48" stop-color="#d8efff"/>
                <stop offset="1" stop-color="#9fccea"/>
            </linearGradient>
            <linearGradient id="winterIceShine-${uniqueId}" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0" stop-color="#ffffff" stop-opacity="0.92"/>
                <stop offset="1" stop-color="#c8e7fb" stop-opacity="0.18"/>
            </linearGradient>
        </defs>
        <path
            d="M0 0H240V14
               C226 14 220 18 216 27L208 49L199 23L190 67L178 30L168 44L159 19
               L149 55L137 25L126 76L114 31L103 52L92 21L82 61L70 28L60 46L50 19
               L39 57L28 25L18 43L9 19L0 26Z"
            fill="url(#winterIceFill-${uniqueId})"
            stroke="#74afd6"
            stroke-width="1.7"
            stroke-linejoin="round"
        />
        <path
            d="M7 8H229M31 16L38 44M72 15L79 48M116 15L123 61M164 15L169 35M201 15L205 39"
            fill="none"
            stroke="url(#winterIceShine-${uniqueId})"
            stroke-width="3.2"
            stroke-linecap="round"
            opacity="0.9"
        />
    `;

    return svg;
}

function addIcicleCluster({ side, edge, width, uniqueId }) {
    if (!winterBackground) return;

    const cluster = document.createElement("div");
    cluster.className = `winter-icicle-cluster winter-icicle-${edge} winter-icicle-${side}`;
    cluster.style.width = width;
    cluster.setAttribute("aria-hidden", "true");
    cluster.appendChild(createIcicleSvg(uniqueId));

    // Water droplets hang only beneath top icicles. Bottom clusters are kept
    // decorative and stationary so they never compete with roaming companions.
    if (edge === "top") {
        const dripPositions = [19, 44, 68, 87];
        dripPositions.forEach((position, dripIndex) => {
            const droplet = document.createElement("span");
            droplet.className = "winter-water-drop";
            droplet.style.left = `${position}%`;
            droplet.style.setProperty("--winter-drip-delay", `${-(dripIndex * 0.85 + winterRandom(0, 1.6))}s`);
            droplet.style.setProperty("--winter-drip-duration", `${winterRandom(2.6, 4.1)}s`);
            cluster.appendChild(droplet);
        });
    }

    winterBackground.appendChild(cluster);
}

function createIcicles() {
    // Corner-only placement keeps icicles away from titles and controls.
    addIcicleCluster({ side: "left",  edge: "top",    width: "min(220px, 22vw)", uniqueId: "tl" });
    addIcicleCluster({ side: "right", edge: "top",    width: "min(250px, 24vw)", uniqueId: "tr" });
    addIcicleCluster({ side: "left",  edge: "bottom", width: "min(155px, 16vw)", uniqueId: "bl" });
    addIcicleCluster({ side: "right", edge: "bottom", width: "min(175px, 18vw)", uniqueId: "br" });
}

/* ============================================================
   SMALL ICE SPARKLES
   ============================================================ */

function createSparkles() {
    if (!winterBackground) return;

    for (let i = 0; i < 16; i++) {
        const sparkle = document.createElement("span");
        sparkle.className = "winter-sparkle";
        sparkle.style.left = `${winterRandom(3, 97)}%`;
        sparkle.style.top = `${winterRandom(16, 96)}%`;
        sparkle.style.setProperty("--winter-sparkle-delay", `${-winterRandom(0, 7)}s`);
        sparkle.style.setProperty("--winter-sparkle-duration", `${winterRandom(3.8, 7)}s`);
        sparkle.style.setProperty("--winter-sparkle-scale", winterRandom(0.65, 1.35).toFixed(2));
        winterBackground.appendChild(sparkle);
    }
}

/* ============================================================
   MOUNT / UNMOUNT
   ============================================================ */


let winterHoverHandler = null;
let winterHoverLast = null;
let winterHoverAudio = null;
let winterIntroAudio = null;
let winterIntroFadeFrame = null;
let winterHoverUnlocked = false;

const WINTER_INTRO_SOUND = "/sounds/intros/the_mountain-winter-holiday-449478.mp3";
const WINTER_INTRO_END = 20;
const WINTER_INTRO_FADE_START = 17;
const WINTER_INTRO_VOLUME = 0.50;

const WINTER_HOVER_SOUNDS = [
    "/sounds/winx/cartoon_music-arcade-game-positive-selection-bling-489760.mp3",
    "/sounds/winx/freesound_community-electricity-sound-6066.mp3",
    "/sounds/winx/freesound_community-match-sizzle-02-104778.mp3",
    "/sounds/winx/koiroylers-get-coin-351945.mp3"
];

function winterStopIntro({ unlockHover = false } = {}) {
    if (winterIntroFadeFrame !== null) {
        cancelAnimationFrame(winterIntroFadeFrame);
        winterIntroFadeFrame = null;
    }

    if (winterIntroAudio) {
        try {
            winterIntroAudio.pause();
            winterIntroAudio.currentTime = 0;
        } catch (_) {}
        winterIntroAudio = null;
    }

    if (unlockHover) winterHoverUnlocked = true;
}

function winterStartIntro() {
    winterStopIntro();
    winterHoverUnlocked = false;

    const audio = new Audio(WINTER_INTRO_SOUND);
    winterIntroAudio = audio;
    audio.preload = "auto";
    audio.volume = WINTER_INTRO_VOLUME;

    const finishIntro = () => {
        if (winterIntroAudio !== audio) return;
        try {
            audio.pause();
            audio.currentTime = WINTER_INTRO_END;
            audio.volume = 0;
        } catch (_) {}
        winterIntroAudio = null;
        winterIntroFadeFrame = null;
        winterHoverUnlocked = true;
    };

    const updateIntro = () => {
        if (winterIntroAudio !== audio) return;

        const current = audio.currentTime || 0;
        if (current >= WINTER_INTRO_END) {
            finishIntro();
            return;
        }

        if (current >= WINTER_INTRO_FADE_START) {
            const fadeProgress = Math.min(
                1,
                (current - WINTER_INTRO_FADE_START) /
                (WINTER_INTRO_END - WINTER_INTRO_FADE_START)
            );
            audio.volume = WINTER_INTRO_VOLUME * (1 - fadeProgress);
        } else {
            audio.volume = WINTER_INTRO_VOLUME;
        }

        winterIntroFadeFrame = requestAnimationFrame(updateIntro);
    };

    const playPromise = audio.play();
    if (playPromise && typeof playPromise.then === "function") {
        playPromise
            .then(() => {
                if (winterIntroAudio === audio) {
                    winterIntroFadeFrame = requestAnimationFrame(updateIntro);
                }
            })
            .catch(() => {
                // If the browser blocks autoplay, do not leave hover audio locked forever.
                if (winterIntroAudio === audio) winterStopIntro({ unlockHover: true });
            });
    } else {
        winterIntroFadeFrame = requestAnimationFrame(updateIntro);
    }
}

function winterPlayHover() {
    if (!winterHoverUnlocked) return;

    if (winterHoverAudio) {
        try { winterHoverAudio.pause(); winterHoverAudio.currentTime = 0; } catch (_) {}
    }
    const audio = new Audio(WINTER_HOVER_SOUNDS[Math.floor(Math.random() * WINTER_HOVER_SOUNDS.length)]);
    winterHoverAudio = audio;
    audio.volume = .40;
    const p = audio.play();
    if (p && typeof p.catch === "function") p.catch(() => {});
}

function winterInstallHover() {
    winterHoverHandler = (event) => {
        if (!winterBackground) return;
        let hit = null;
        for (const flake of winterBackground.querySelectorAll(".winter-big-snowflake")) {
            const r = flake.getBoundingClientRect();
            if (event.clientX >= r.left && event.clientX <= r.right &&
                event.clientY >= r.top && event.clientY <= r.bottom) {
                hit = flake;
                break;
            }
        }
        if (hit && hit !== winterHoverLast) {
            winterHoverLast = hit;
            hit.classList.remove("winter-snowflake-hover");
            void hit.offsetWidth;
            hit.classList.add("winter-snowflake-hover");
            setTimeout(() => hit.classList.remove("winter-snowflake-hover"), 520);
            winterPlayHover();
        } else if (!hit) {
            winterHoverLast = null;
        }
    };
    document.addEventListener("mousemove", winterHoverHandler, { passive: true });
}

function winterRemoveHover() {
    if (winterHoverHandler) document.removeEventListener("mousemove", winterHoverHandler);
    winterHoverHandler = null;
    winterHoverLast = null;
    if (winterHoverAudio) {
        try { winterHoverAudio.pause(); winterHoverAudio.currentTime = 0; } catch (_) {}
        winterHoverAudio = null;
    }
}

export function mount() {
    if (winterBackground) return;

    winterStartIntro();

    winterBackground = document.createElement("div");
    winterBackground.id = "winter-background";
    winterBackground.setAttribute("aria-hidden", "true");
    document.body.appendChild(winterBackground);

    createSnowfall();
    createSparkles();
    winterInstallHover();
}

export function unmount() {
    winterStopIntro();
    winterHoverUnlocked = false;
    winterRemoveHover();
    if (winterBackground) {
        winterBackground.remove();
        winterBackground = null;
    }
}
