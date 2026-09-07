/* ============================================================
   MATRIX THEME — ENHANCED BACKGROUND
   GPU-friendly CSS animation + very light interaction.
   ============================================================ */

let matrixBackground = null;
let matrixPointerHandler = null;
let matrixBurstHandler = null;
let matrixLastPointerFrame = 0;

const MATRIX_GLYPHS = '01アイウエオカキクケコサシスセソタチツテトナニヌネノZXCVBNM<>[]{}+-=*';

function matrixRandom(min, max) {
    return Math.random() * (max - min) + min;
}

function matrixInt(min, max) {
    return Math.floor(matrixRandom(min, max + 1));
}

function buildGlyphString(length) {
    let output = '';

    for (let i = 0; i < length; i++) {
        const char = MATRIX_GLYPHS[matrixInt(0, MATRIX_GLYPHS.length - 1)];
        output += char;
        if (i < length - 1) output += '\n';
    }

    return output;
}

function createCodeRain() {
    if (!matrixBackground) return;

    const columnCount = Math.max(20, Math.min(38, Math.floor(window.innerWidth / 42)));

    for (let i = 0; i < columnCount; i++) {
        const column = document.createElement('span');
        column.className = 'matrix-code-column';
        column.setAttribute('aria-hidden', 'true');
        column.textContent = buildGlyphString(matrixInt(14, 34));

        column.style.setProperty('--matrix-left', `${matrixRandom(-2, 100)}%`);
        column.style.setProperty('--matrix-width', `${matrixRandom(14, 24)}px`);
        column.style.setProperty('--matrix-font-size', `${matrixRandom(11, 17)}px`);
        column.style.setProperty('--matrix-opacity', matrixRandom(.20, .62).toFixed(2));
        column.style.setProperty('--matrix-duration', `${matrixRandom(8.5, 18)}s`);
        column.style.setProperty('--matrix-delay', `${-matrixRandom(0, 18)}s`);
        column.style.setProperty('--matrix-drift', `${matrixRandom(-30, 30)}px`);
        column.style.setProperty('--matrix-blur', `${matrixRandom(0, .55)}px`);
        column.style.setProperty('--matrix-flicker', `${matrixRandom(2.8, 6.5)}s`);
        column.style.setProperty('--matrix-flicker-delay', `${-matrixRandom(0, 7)}s`);

        matrixBackground.appendChild(column);
    }
}

function createScanlines() {
    if (!matrixBackground) return;

    for (let i = 0; i < 3; i++) {
        const scan = document.createElement('span');
        scan.className = 'matrix-scanline';
        scan.setAttribute('aria-hidden', 'true');
        scan.style.setProperty('--scan-duration', `${matrixRandom(5.8, 9.2)}s`);
        scan.style.setProperty('--scan-delay', `${-(i * matrixRandom(1.8, 3.2))}s`);
        matrixBackground.appendChild(scan);
    }
}

function createGlitchBands() {
    if (!matrixBackground) return;

    for (let i = 0; i < 7; i++) {
        const band = document.createElement('span');
        band.className = 'matrix-glitch-band';
        band.setAttribute('aria-hidden', 'true');
        band.style.setProperty('--band-top', `${matrixRandom(8, 94)}%`);
        band.style.setProperty('--band-height', `${matrixRandom(3, 11)}px`);
        band.style.setProperty('--band-duration', `${matrixRandom(4.5, 9)}s`);
        band.style.setProperty('--band-delay', `${-matrixRandom(0, 10)}s`);
        matrixBackground.appendChild(band);
    }
}

function createDataPackets() {
    if (!matrixBackground) return;

    for (let i = 0; i < 8; i++) {
        const packet = document.createElement('span');
        packet.className = 'matrix-data-packet';
        packet.setAttribute('aria-hidden', 'true');
        packet.style.setProperty('--packet-top', `${matrixRandom(12, 95)}%`);
        packet.style.setProperty('--packet-width', `${matrixRandom(12, 28)}vw`);
        packet.style.setProperty('--packet-duration', `${matrixRandom(8, 17)}s`);
        packet.style.setProperty('--packet-delay', `${-matrixRandom(0, 18)}s`);
        matrixBackground.appendChild(packet);
    }
}

function createMouseGlow() {
    if (!matrixBackground) return;

    const glow = document.createElement('span');
    glow.className = 'matrix-mouse-glow';
    glow.setAttribute('aria-hidden', 'true');
    matrixBackground.appendChild(glow);
}

function bindPointerGlow() {
    matrixPointerHandler = (event) => {
        if (!document.body.classList.contains('theme-matrix')) return;

        if (matrixLastPointerFrame) return;

        matrixLastPointerFrame = requestAnimationFrame(() => {
            matrixLastPointerFrame = 0;
            document.body.style.setProperty('--matrix-mouse-x', `${event.clientX}px`);
            document.body.style.setProperty('--matrix-mouse-y', `${event.clientY}px`);
        });
    };

    window.addEventListener('pointermove', matrixPointerHandler, { passive: true });
}

function createBurst(x, y) {
    if (!matrixBackground) return;

    const burst = document.createElement('span');
    burst.className = 'matrix-click-burst';
    burst.setAttribute('aria-hidden', 'true');
    burst.style.setProperty('--burst-x', `${x}px`);
    burst.style.setProperty('--burst-y', `${y}px`);

    const chars = matrixInt(7, 11);
    for (let i = 0; i < chars; i++) {
        const char = document.createElement('span');
        char.className = 'matrix-click-char';
        char.textContent = MATRIX_GLYPHS[matrixInt(0, MATRIX_GLYPHS.length - 1)];

        const angle = (Math.PI * 2 * i) / chars + matrixRandom(-.22, .22);
        const distance = matrixRandom(24, 62);
        char.style.setProperty('--burst-dx', `${Math.cos(angle) * distance}px`);
        char.style.setProperty('--burst-dy', `${Math.sin(angle) * distance}px`);
        char.style.animationDelay = `${matrixRandom(0, .08)}s`;
        burst.appendChild(char);
    }

    matrixBackground.appendChild(burst);
    setTimeout(() => burst.remove(), 1000);
}

function bindClickBursts() {
    matrixBurstHandler = (event) => {
        if (!document.body.classList.contains('theme-matrix')) return;
        createBurst(event.clientX, event.clientY);
    };

    window.addEventListener('pointerdown', matrixBurstHandler, { passive: true });
}

function matrixOriginalMount() {
    if (matrixBackground) return;

    matrixBackground = document.createElement('div');
    matrixBackground.id = 'matrix-theme-background';
    matrixBackground.setAttribute('aria-hidden', 'true');
    document.body.appendChild(matrixBackground);

    createCodeRain();
    createScanlines();
    createGlitchBands();
    createDataPackets();
    createMouseGlow();
    bindPointerGlow();
    bindClickBursts();
}

function matrixOriginalUnmount() {
    if (matrixPointerHandler) {
        window.removeEventListener('pointermove', matrixPointerHandler);
        matrixPointerHandler = null;
    }

    if (matrixBurstHandler) {
        window.removeEventListener('pointerdown', matrixBurstHandler);
        matrixBurstHandler = null;
    }

    if (matrixLastPointerFrame) {
        cancelAnimationFrame(matrixLastPointerFrame);
        matrixLastPointerFrame = 0;
    }

    document.body.style.removeProperty('--matrix-mouse-x');
    document.body.style.removeProperty('--matrix-mouse-y');

    if (matrixBackground) {
        matrixBackground.remove();
        matrixBackground = null;
    }
}


/* ============================================================
   INTRO AUDIO ADDITION
   ============================================================ */
let matrixIntroAudio = null;
let matrixIntroFallback = null;
let matrixIntroTimer = null;
const MATRIX_INTRO_SRC = "/sounds/intros/grand_project-protected-suspense-intrigue-407231.mp3";
const MATRIX_INTRO_VOLUME = 0.25;
const MATRIX_INTRO_END = 20;
const MATRIX_INTRO_FADE_START = 15;
const MATRIX_INTRO_FULL = false;
const MATRIX_INTRO_FADE_END = false;

function matrixClearIntroFallback() {
    if (!matrixIntroFallback) return;
    window.removeEventListener("pointerdown", matrixIntroFallback);
    window.removeEventListener("keydown", matrixIntroFallback);
    matrixIntroFallback = null;
}

function matrixStopIntro() {
    if (matrixIntroTimer) {
        clearInterval(matrixIntroTimer);
        matrixIntroTimer = null;
    }
    matrixClearIntroFallback();
    document.body.classList.remove("theme-matrix-intro-playing");
    if (matrixIntroAudio) {
        try {
            matrixIntroAudio.pause();
            matrixIntroAudio.currentTime = 0;
        } catch (_) {}
    }
    matrixIntroAudio = null;
}

function matrixPlayIntro() {
    matrixStopIntro();
    const audio = new Audio(MATRIX_INTRO_SRC);
    matrixIntroAudio = audio;
    audio.preload = "auto";
    audio.volume = MATRIX_INTRO_VOLUME;

    audio.addEventListener("playing", () => {
        document.body.classList.add("theme-matrix-intro-playing");
        matrixClearIntroFallback();
    });

    audio.addEventListener("ended", () => {
        matrixStopIntro();
    }, { once: true });

    audio.addEventListener("error", () => {
        matrixStopIntro();
    }, { once: true });

    matrixIntroTimer = setInterval(() => {
        if (matrixIntroAudio !== audio) return;
        const t = audio.currentTime || 0;

        if (MATRIX_INTRO_END != null) {
            if (MATRIX_INTRO_FADE_START != null && t >= MATRIX_INTRO_FADE_START) {
                const len = Math.max(.001, MATRIX_INTRO_END - MATRIX_INTRO_FADE_START);
                const p = Math.min(1, (t - MATRIX_INTRO_FADE_START) / len);
                audio.volume = Math.max(0, MATRIX_INTRO_VOLUME * (1 - p));
            }
            if (t >= MATRIX_INTRO_END) {
                matrixStopIntro();
            }
        } else if (MATRIX_INTRO_FULL && MATRIX_INTRO_FADE_END &&
                   Number.isFinite(audio.duration) && audio.duration > 0) {
            const remaining = audio.duration - t;
            if (remaining <= 3) {
                audio.volume = Math.max(0, MATRIX_INTRO_VOLUME * (remaining / 3));
            }
        }
    }, 120);

    const p = audio.play();
    if (p && typeof p.catch === "function") {
        p.catch(() => {
            if (matrixIntroFallback || matrixIntroAudio !== audio) return;
            matrixIntroFallback = () => {
                if (matrixIntroAudio !== audio) return;
                const retry = audio.play();
                if (retry && typeof retry.catch === "function") retry.catch(() => {});
            };
            window.addEventListener("pointerdown", matrixIntroFallback);
            window.addEventListener("keydown", matrixIntroFallback);
        });
    }
}

export function mount() {
    matrixOriginalMount();
    matrixPlayIntro();
}

export function unmount() {
    matrixStopIntro();
    matrixOriginalUnmount();
}
