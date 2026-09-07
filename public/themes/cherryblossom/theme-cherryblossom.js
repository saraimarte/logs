/* ============================================================
   CHERRY BLOSSOM
   Decorative spring theme.

   IMPORTANT:
   - Does not move or restructure application UI.
   - Does not touch cursor logic.
   - Does not touch companion positioning or animation.
   - Background is decorative and pointer-safe.
   ============================================================ */

let cherryBackground = null;
let cherryStylesheet = null;
let cherryAnimationFrame = null;
let cherryMouseHandler = null;
let cherryResizeHandler = null;
let cherryPetals = [];

const CHERRY_PETAL_COUNT = 46;

/* ============================================================
   HELPERS
   ============================================================ */

function cherryRandom(min, max) {
    return Math.random() * (max - min) + min;
}

function cherryClamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}

/* ============================================================
   BACKGROUND
   ============================================================ */

function createCherryBackground() {
    if (!cherryBackground) return;

    const wash = document.createElement('div');
    wash.className = 'cherry-sky-wash';
    cherryBackground.appendChild(wash);

    const distant = document.createElement('div');
    distant.className = 'cherry-distant-hills';
    cherryBackground.appendChild(distant);

    const groundMist = document.createElement('div');
    groundMist.className = 'cherry-ground-mist';
    cherryBackground.appendChild(groundMist);
}

/* ============================================================
   PETALS
   ============================================================ */

function createPetal(index) {
    const petal = document.createElement('span');
    petal.className = 'cherry-petal';

    const size = cherryRandom(8, 17);
    const startX = cherryRandom(-6, 106);
    const duration = cherryRandom(11, 23);
    const delay = -cherryRandom(0, duration);
    const sway = cherryRandom(28, 110) * (Math.random() > .5 ? 1 : -1);
    const rotate = cherryRandom(120, 520);

    petal.style.left = `${startX}vw`;
    petal.style.width = `${size}px`;
    petal.style.height = `${size * .72}px`;
    petal.style.setProperty('--petal-duration', `${duration}s`);
    petal.style.setProperty('--petal-delay', `${delay}s`);
    petal.style.setProperty('--petal-sway', `${sway}px`);
    petal.style.setProperty('--petal-rotate', `${rotate}deg`);
    petal.style.setProperty('--petal-opacity', cherryRandom(.44, .82).toFixed(2));
    petal.style.setProperty('--petal-scale', cherryRandom(.7, 1.15).toFixed(2));
    petal.dataset.index = index;

    cherryBackground.appendChild(petal);

    const state = {
        el: petal,
        gustX: 0,
        gustY: 0,
        gustRotate: 0,
        targetX: 0,
        targetY: 0,
        targetRotate: 0,
        activeUntil: 0
    };

    cherryPetals.push(state);
}

/* ============================================================
   WIND / HOVER INTERACTION
   ============================================================ */

function startWindInteraction() {
    const gustRadius = 74;

    cherryMouseHandler = (event) => {
        const now = performance.now();

        cherryPetals.forEach((petalState) => {
            const rect = petalState.el.getBoundingClientRect();
            const cx = rect.left + rect.width / 2;
            const cy = rect.top + rect.height / 2;

            const dx = cx - event.clientX;
            const dy = cy - event.clientY;
            const distance = Math.hypot(dx, dy);

            if (distance <= gustRadius) {
                const force = 1 - distance / gustRadius;
                const direction = dx >= 0 ? 1 : -1;

                petalState.targetX = direction * (38 + 92 * force);
                petalState.targetY = -8 - 20 * force;
                petalState.targetRotate = direction * (50 + 120 * force);
                petalState.activeUntil = now + 520;

                petalState.el.classList.add('cherry-petal-gust');
            }
        });
    };

    window.addEventListener('mousemove', cherryMouseHandler, { passive: true });

    function animateWind(now) {
        cherryPetals.forEach((petalState) => {
            if (now > petalState.activeUntil) {
                petalState.targetX *= .88;
                petalState.targetY *= .88;
                petalState.targetRotate *= .86;

                if (
                    Math.abs(petalState.targetX) < .3 &&
                    Math.abs(petalState.targetY) < .3 &&
                    Math.abs(petalState.targetRotate) < .5
                ) {
                    petalState.targetX = 0;
                    petalState.targetY = 0;
                    petalState.targetRotate = 0;
                    petalState.el.classList.remove('cherry-petal-gust');
                }
            }

            petalState.gustX += (petalState.targetX - petalState.gustX) * .12;
            petalState.gustY += (petalState.targetY - petalState.gustY) * .12;
            petalState.gustRotate += (petalState.targetRotate - petalState.gustRotate) * .12;

            petalState.el.style.setProperty('--gust-x', `${petalState.gustX}px`);
            petalState.el.style.setProperty('--gust-y', `${petalState.gustY}px`);
            petalState.el.style.setProperty('--gust-rotate', `${petalState.gustRotate}deg`);
        });

        cherryAnimationFrame = requestAnimationFrame(animateWind);
    }

    cherryAnimationFrame = requestAnimationFrame(animateWind);
}

/* ============================================================
   MOUNT
   ============================================================ */

function cherryblossomOriginalMount() {
    if (cherryBackground) return;

    cherryStylesheet = document.createElement('link');
    cherryStylesheet.rel = 'stylesheet';
    cherryStylesheet.href = '/themes/theme-cherryblossom.css';
    cherryStylesheet.dataset.theme = 'cherryblossom';
    document.head.appendChild(cherryStylesheet);

    cherryBackground = document.createElement('div');
    cherryBackground.id = 'cherryblossom-background';
    cherryBackground.setAttribute('aria-hidden', 'true');
    document.body.appendChild(cherryBackground);

    createCherryBackground();

    for (let i = 0; i < CHERRY_PETAL_COUNT; i++) {
        createPetal(i);
    }

    startWindInteraction();
}

/* ============================================================
   UNMOUNT
   ============================================================ */

function cherryblossomOriginalUnmount() {
    if (cherryMouseHandler) {
        window.removeEventListener('mousemove', cherryMouseHandler);
        cherryMouseHandler = null;
    }

    if (cherryResizeHandler) {
        window.removeEventListener('resize', cherryResizeHandler);
        cherryResizeHandler = null;
    }

    if (cherryAnimationFrame) {
        cancelAnimationFrame(cherryAnimationFrame);
        cherryAnimationFrame = null;
    }

    cherryPetals = [];

    if (cherryBackground) {
        cherryBackground.remove();
        cherryBackground = null;
    }

    if (cherryStylesheet) {
        cherryStylesheet.remove();
        cherryStylesheet = null;
    }
}


/* ============================================================
   INTRO AUDIO ADDITION
   ============================================================ */
let cherryblossomIntroAudio = null;
let cherryblossomIntroFallback = null;
let cherryblossomIntroTimer = null;
const CHERRYBLOSSOM_INTRO_SRC = "/sounds/intros/cinim-cinim-brainfluid-122844.mp3";
const CHERRYBLOSSOM_INTRO_VOLUME = 0.27;
const CHERRYBLOSSOM_INTRO_END = 20;
const CHERRYBLOSSOM_INTRO_FADE_START = 15;
const CHERRYBLOSSOM_INTRO_FULL = false;
const CHERRYBLOSSOM_INTRO_FADE_END = false;

function cherryblossomClearIntroFallback() {
    if (!cherryblossomIntroFallback) return;
    window.removeEventListener("pointerdown", cherryblossomIntroFallback);
    window.removeEventListener("keydown", cherryblossomIntroFallback);
    cherryblossomIntroFallback = null;
}

function cherryblossomStopIntro() {
    if (cherryblossomIntroTimer) {
        clearInterval(cherryblossomIntroTimer);
        cherryblossomIntroTimer = null;
    }
    cherryblossomClearIntroFallback();
    document.body.classList.remove("theme-cherryblossom-intro-playing");
    if (cherryblossomIntroAudio) {
        try {
            cherryblossomIntroAudio.pause();
            cherryblossomIntroAudio.currentTime = 0;
        } catch (_) {}
    }
    cherryblossomIntroAudio = null;
}

function cherryblossomPlayIntro() {
    cherryblossomStopIntro();
    const audio = new Audio(CHERRYBLOSSOM_INTRO_SRC);
    cherryblossomIntroAudio = audio;
    audio.preload = "auto";
    audio.volume = CHERRYBLOSSOM_INTRO_VOLUME;

    audio.addEventListener("playing", () => {
        document.body.classList.add("theme-cherryblossom-intro-playing");
        cherryblossomClearIntroFallback();
    });

    audio.addEventListener("ended", () => {
        cherryblossomStopIntro();
    }, { once: true });

    audio.addEventListener("error", () => {
        cherryblossomStopIntro();
    }, { once: true });

    cherryblossomIntroTimer = setInterval(() => {
        if (cherryblossomIntroAudio !== audio) return;
        const t = audio.currentTime || 0;

        if (CHERRYBLOSSOM_INTRO_END != null) {
            if (CHERRYBLOSSOM_INTRO_FADE_START != null && t >= CHERRYBLOSSOM_INTRO_FADE_START) {
                const len = Math.max(.001, CHERRYBLOSSOM_INTRO_END - CHERRYBLOSSOM_INTRO_FADE_START);
                const p = Math.min(1, (t - CHERRYBLOSSOM_INTRO_FADE_START) / len);
                audio.volume = Math.max(0, CHERRYBLOSSOM_INTRO_VOLUME * (1 - p));
            }
            if (t >= CHERRYBLOSSOM_INTRO_END) {
                cherryblossomStopIntro();
            }
        } else if (CHERRYBLOSSOM_INTRO_FULL && CHERRYBLOSSOM_INTRO_FADE_END &&
                   Number.isFinite(audio.duration) && audio.duration > 0) {
            const remaining = audio.duration - t;
            if (remaining <= 3) {
                audio.volume = Math.max(0, CHERRYBLOSSOM_INTRO_VOLUME * (remaining / 3));
            }
        }
    }, 120);

    const p = audio.play();
    if (p && typeof p.catch === "function") {
        p.catch(() => {
            if (cherryblossomIntroFallback || cherryblossomIntroAudio !== audio) return;
            cherryblossomIntroFallback = () => {
                if (cherryblossomIntroAudio !== audio) return;
                const retry = audio.play();
                if (retry && typeof retry.catch === "function") retry.catch(() => {});
            };
            window.addEventListener("pointerdown", cherryblossomIntroFallback);
            window.addEventListener("keydown", cherryblossomIntroFallback);
        });
    }
}

export function mount() {
    cherryblossomOriginalMount();
    cherryblossomPlayIntro();
}

export function unmount() {
    cherryblossomStopIntro();
    cherryblossomOriginalUnmount();
}
