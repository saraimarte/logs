const stars = [];
let layer = null;
let timer = null;
let introAudio = null;
let introFadeTimer = null;
let introFallbackHandler = null;

const INTRO_SRC = "/sounds/intros/benkirb-shine-11-268907.mp3";
const INTRO_END = 9;
const INTRO_FADE_START = 7.2;

function rand(min, max) {
    return Math.random() * (max - min) + min;
}

function createStar() {
    const s = document.createElement("span");
    s.className = "theme-star";

    const size = rand(1, 3.3);
    s.style.left = `${rand(0, 100)}%`;
    s.style.top = `${rand(0, 100)}%`;
    s.style.width = `${size}px`;
    s.style.height = `${size}px`;
    s.style.opacity = rand(0.25, 0.95).toFixed(2);
    s.style.setProperty("--star-delay", `${rand(-5, 0).toFixed(2)}s`);
    s.style.setProperty("--star-duration", `${rand(2.8, 6.8).toFixed(2)}s`);

    layer.appendChild(s);
    stars.push(s);
}

function createGlow(className) {
    const glow = document.createElement("div");
    glow.className = className;
    layer.appendChild(glow);
}

function createShootingStar(index) {
    const shoot = document.createElement("span");
    shoot.className = "theme-shooting-star";
    shoot.style.setProperty("--shoot-top", `${rand(6, 58).toFixed(1)}%`);
    shoot.style.setProperty("--shoot-left", `${rand(20, 86).toFixed(1)}%`);
    shoot.style.setProperty("--shoot-delay", `${(index * 4.3 + rand(0, 4)).toFixed(2)}s`);
    shoot.style.setProperty("--shoot-duration", `${rand(1.2, 1.8).toFixed(2)}s`);
    layer.appendChild(shoot);
}

function createConstellation() {
    const constellation = document.createElement("div");
    constellation.className = "theme-stars-constellation";
    constellation.innerHTML = `
        <span style="--cx:8%;--cy:58%"></span>
        <span style="--cx:18%;--cy:36%"></span>
        <span style="--cx:34%;--cy:49%"></span>
        <span style="--cx:51%;--cy:27%"></span>
        <span style="--cx:69%;--cy:43%"></span>
        <span style="--cx:83%;--cy:19%"></span>
    `;
    layer.appendChild(constellation);
}

function stopIntro() {
    if (introFadeTimer) {
        clearInterval(introFadeTimer);
        introFadeTimer = null;
    }

    if (introAudio) {
        try {
            introAudio.pause();
            introAudio.currentTime = 0;
        } catch (_) {}
        introAudio = null;
    }

    if (introFallbackHandler) {
        window.removeEventListener("pointerdown", introFallbackHandler);
        introFallbackHandler = null;
    }
}

function beginIntroPlayback() {
    if (!introAudio) return;

    try {
        introAudio.currentTime = 0;
        introAudio.volume = 0.40;

        const playPromise = introAudio.play();

        if (playPromise && typeof playPromise.catch === "function") {
            playPromise.catch(() => {
                if (!introFallbackHandler) {
                    introFallbackHandler = () => {
                        window.removeEventListener("pointerdown", introFallbackHandler);
                        introFallbackHandler = null;
                        if (!introAudio) return;

                        introAudio.currentTime = 0;
                        introAudio.volume = 0.40;
                        introAudio.play().catch(() => {});
                    };
                    window.addEventListener("pointerdown", introFallbackHandler, { once: true });
                }
            });
        }
    } catch (_) {}
}

function startIntroMusic() {
    stopIntro();

    try {
        introAudio = new Audio(INTRO_SRC);
        introAudio.preload = "auto";
        introAudio.loop = false;
        introAudio.volume = 0.40;

        introAudio.addEventListener("timeupdate", () => {
            if (!introAudio) return;

            const t = introAudio.currentTime;

            if (t >= INTRO_END) {
                stopIntro();
                return;
            }

            if (t >= INTRO_FADE_START && !introFadeTimer) {
                introFadeTimer = setInterval(() => {
                    if (!introAudio) {
                        clearInterval(introFadeTimer);
                        introFadeTimer = null;
                        return;
                    }

                    const remaining = Math.max(0, INTRO_END - introAudio.currentTime);
                    const fadeDuration = INTRO_END - INTRO_FADE_START;
                    introAudio.volume = Math.max(
                        0,
                        0.40 * (remaining / fadeDuration)
                    );

                    if (introAudio.currentTime >= INTRO_END || introAudio.volume <= 0.005) {
                        stopIntro();
                    }
                }, 40);
            }
        });

        beginIntroPlayback();
    } catch (_) {}
}

export function mount() {
    if (layer) return;

    layer = document.createElement("div");
    layer.className = "theme-effects-layer";
    layer.setAttribute("aria-hidden", "true");
    document.body.appendChild(layer);

    createGlow("theme-stars-nebula theme-stars-nebula-a");
    createGlow("theme-stars-nebula theme-stars-nebula-b");
    createGlow("theme-stars-nebula theme-stars-nebula-c");
    createGlow("theme-stars-horizon-glow");
    createGlow("theme-stars-moon-glow");
    createConstellation();

    for (let i = 0; i < 95; i++) {
        createStar();
    }

    for (let i = 0; i < 4; i++) {
        createShootingStar(i);
    }

    timer = setInterval(() => {
        stars.forEach((s) => {
            s.style.opacity = rand(0.20, 1).toFixed(2);
        });
    }, 950);

    startIntroMusic();
}

export function unmount() {
    clearInterval(timer);
    timer = null;

    stopIntro();

    layer?.remove();
    layer = null;
    stars.length = 0;
}
