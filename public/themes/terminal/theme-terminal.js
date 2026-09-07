/* ============================================================
   TERMINAL THEME — ENHANCED BACKGROUND
   GPU-friendly animation + lightweight interaction.
   ============================================================ */

let terminalBackground = null;
let terminalPointerHandler = null;
let terminalClickHandler = null;
let terminalLastPointerFrame = 0;
let terminalFeedTimer = null;
let terminalConsoleNodes = [];

const TERMINAL_COMMANDS = [
    'boot sequence: OK',
    'loading workspace...',
    'mount /dev/notes',
    'sync cache --quiet',
    'indexing knowledge base',
    'render status: READY',
    'memory check: PASS',
    'session token refreshed',
    'watcher online',
    'checksum verified',
    'task queue: 03',
    'route /logs -> active',
    'scan modules...',
    'network latency: 18ms',
    'autosave enabled',
    'cursor service: ONLINE',
    'companion process: STABLE',
    'theme daemon: AMBER',
    'shell heartbeat: OK',
    'event stream connected'
];

const TERMINAL_CLICK_RESPONSES = [
    'COMMAND ACCEPTED',
    'PING 200 OK',
    'TRACE COMPLETE',
    'CACHE HIT',
    'PROCESS SPAWNED',
    'INPUT CAPTURED',
    'ROUTE RESOLVED',
    'SIGNAL RECEIVED',
    'STATUS: NOMINAL',
    'ACKNOWLEDGED'
];

function terminalRandom(min, max) {
    return Math.random() * (max - min) + min;
}

function terminalInt(min, max) {
    return Math.floor(terminalRandom(min, max + 1));
}

function createCrtOverlay() {
    if (!terminalBackground) return;

    const overlay = document.createElement('span');
    overlay.className = 'terminal-crt-overlay';
    overlay.setAttribute('aria-hidden', 'true');
    terminalBackground.appendChild(overlay);

    for (let i = 0; i < 3; i++) {
        const beam = document.createElement('span');
        beam.className = 'terminal-scan-beam';
        beam.setAttribute('aria-hidden', 'true');
        beam.style.setProperty('--scan-duration', `${terminalRandom(6.8, 11)}s`);
        beam.style.setProperty('--scan-delay', `${-(i * terminalRandom(2.0, 3.4))}s`);
        terminalBackground.appendChild(beam);
    }
}

function seedConsoleLines(container, count) {
    for (let i = 0; i < count; i++) {
        const line = document.createElement('span');
        line.className = 'terminal-console-line';
        line.textContent = TERMINAL_COMMANDS[terminalInt(0, TERMINAL_COMMANDS.length - 1)];
        line.style.animationDelay = `${i * .04}s`;
        container.appendChild(line);
    }
}

function createConsoles() {
    if (!terminalBackground) return;

    const layouts = [
        { left: 1.5, top: 13, width: 25, height: 82, rotate: -1.2, opacity: .38, size: 10 },
        { left: 74, top: 17, width: 24, height: 92, rotate: 1.0, opacity: .34, size: 10 },
        { left: 3, top: 69, width: 28, height: 88, rotate: .8, opacity: .26, size: 9 },
        { left: 69, top: 72, width: 29, height: 88, rotate: -1.1, opacity: .24, size: 9 }
    ];

    layouts.forEach((config, index) => {
        const consoleBox = document.createElement('section');
        consoleBox.className = 'terminal-console';
        consoleBox.setAttribute('aria-hidden', 'true');
        consoleBox.style.setProperty('--console-left', `${config.left}%`);
        consoleBox.style.setProperty('--console-top', `${config.top}%`);
        consoleBox.style.setProperty('--console-width', `${config.width}vw`);
        consoleBox.style.setProperty('--console-height', `${config.height}px`);
        consoleBox.style.setProperty('--console-rotate', `${config.rotate}deg`);
        consoleBox.style.setProperty('--console-opacity', config.opacity);
        consoleBox.style.setProperty('--console-font-size', `${config.size}px`);

        const header = document.createElement('div');
        header.className = 'terminal-console-header';
        header.innerHTML = `<span>tty0${index + 1} / session</span><span class="terminal-console-dots"><span></span><span></span><span></span></span>`;

        const lines = document.createElement('div');
        lines.className = 'terminal-console-lines';
        seedConsoleLines(lines, terminalInt(4, 7));

        consoleBox.appendChild(header);
        consoleBox.appendChild(lines);
        terminalBackground.appendChild(consoleBox);
        terminalConsoleNodes.push(lines);
    });
}

function startConsoleFeed() {
    if (terminalFeedTimer) clearInterval(terminalFeedTimer);

    terminalFeedTimer = setInterval(() => {
        if (!document.body.classList.contains('theme-terminal') || terminalConsoleNodes.length === 0) return;

        const consoleLines = terminalConsoleNodes[terminalInt(0, terminalConsoleNodes.length - 1)];
        const line = document.createElement('span');
        line.className = 'terminal-console-line';
        line.textContent = TERMINAL_COMMANDS[terminalInt(0, TERMINAL_COMMANDS.length - 1)];
        consoleLines.appendChild(line);

        while (consoleLines.children.length > 7) {
            consoleLines.firstElementChild?.remove();
        }
    }, 1700);
}

function createPrompts() {
    if (!terminalBackground) return;

    const prompts = [
        { left: 30, top: 13, size: 12, opacity: .42 },
        { left: 61, top: 26, size: 11, opacity: .34 },
        { left: 36, top: 53, size: 12, opacity: .30 },
        { left: 57, top: 76, size: 11, opacity: .32 },
        { left: 43, top: 91, size: 12, opacity: .28 }
    ];

    prompts.forEach((config, index) => {
        const prompt = document.createElement('span');
        prompt.className = 'terminal-prompt';
        prompt.textContent = index % 2 ? 'user@logs:~$' : 'sys@terminal:~$';
        prompt.setAttribute('aria-hidden', 'true');
        prompt.style.setProperty('--prompt-left', `${config.left}%`);
        prompt.style.setProperty('--prompt-top', `${config.top}%`);
        prompt.style.setProperty('--prompt-size', `${config.size}px`);
        prompt.style.setProperty('--prompt-opacity', config.opacity);
        prompt.style.setProperty('--prompt-duration', `${terminalRandom(3.2, 6.4)}s`);
        prompt.style.setProperty('--prompt-delay', `${-terminalRandom(0, 6)}s`);
        terminalBackground.appendChild(prompt);
    });
}

function createDataTraces() {
    if (!terminalBackground) return;

    for (let i = 0; i < 9; i++) {
        const trace = document.createElement('span');
        trace.className = 'terminal-trace';
        trace.setAttribute('aria-hidden', 'true');
        trace.style.setProperty('--trace-top', `${terminalRandom(10, 96)}%`);
        trace.style.setProperty('--trace-width', `${terminalRandom(14, 30)}vw`);
        trace.style.setProperty('--trace-duration', `${terminalRandom(8, 18)}s`);
        trace.style.setProperty('--trace-delay', `${-terminalRandom(0, 18)}s`);
        terminalBackground.appendChild(trace);
    }
}

function createStatusBlocks() {
    if (!terminalBackground) return;

    const blocks = [
        { left: 33, top: 19, width: 17, progress: 84 },
        { left: 54, top: 39, width: 18, progress: 62 },
        { left: 29, top: 65, width: 16, progress: 91 },
        { left: 55, top: 87, width: 18, progress: 73 }
    ];

    blocks.forEach((config, index) => {
        const block = document.createElement('span');
        block.className = 'terminal-status';
        block.setAttribute('aria-hidden', 'true');
        block.style.setProperty('--status-left', `${config.left}%`);
        block.style.setProperty('--status-top', `${config.top}%`);
        block.style.setProperty('--status-width', `${config.width}vw`);
        block.style.setProperty('--status-progress', `${config.progress}%`);
        block.style.setProperty('--status-duration', `${terminalRandom(2.8, 5.4)}s`);
        block.style.setProperty('--status-delay', `${-index * .7}s`);
        block.innerHTML = `<span>${['cpu load','index buffer','sync state','render queue'][index]}</span><span class="terminal-status-bar"></span>`;
        terminalBackground.appendChild(block);
    });
}

function createMouseGlow() {
    if (!terminalBackground) return;

    const glow = document.createElement('span');
    glow.className = 'terminal-mouse-glow';
    glow.setAttribute('aria-hidden', 'true');
    terminalBackground.appendChild(glow);
}

function bindPointerGlow() {
    terminalPointerHandler = (event) => {
        if (!document.body.classList.contains('theme-terminal')) return;
        if (terminalLastPointerFrame) return;

        terminalLastPointerFrame = requestAnimationFrame(() => {
            terminalLastPointerFrame = 0;
            document.body.style.setProperty('--terminal-mouse-x', `${event.clientX}px`);
            document.body.style.setProperty('--terminal-mouse-y', `${event.clientY}px`);
        });
    };

    window.addEventListener('pointermove', terminalPointerHandler, { passive: true });
}

function createClickResponse(x, y) {
    if (!terminalBackground) return;

    const ring = document.createElement('span');
    ring.className = 'terminal-click-ring';
    ring.setAttribute('aria-hidden', 'true');
    ring.style.setProperty('--click-x', `${x}px`);
    ring.style.setProperty('--click-y', `${y}px`);

    const response = document.createElement('span');
    response.className = 'terminal-click-response';
    response.setAttribute('aria-hidden', 'true');
    response.style.setProperty('--click-x', `${x}px`);
    response.style.setProperty('--click-y', `${y}px`);
    response.textContent = TERMINAL_CLICK_RESPONSES[terminalInt(0, TERMINAL_CLICK_RESPONSES.length - 1)];

    terminalBackground.appendChild(ring);
    terminalBackground.appendChild(response);

    setTimeout(() => ring.remove(), 800);
    setTimeout(() => response.remove(), 1100);
}

function bindClickResponses() {
    terminalClickHandler = (event) => {
        if (!document.body.classList.contains('theme-terminal')) return;
        createClickResponse(event.clientX, event.clientY);
    };

    window.addEventListener('pointerdown', terminalClickHandler, { passive: true });
}

function terminalOriginalMount() {
    if (terminalBackground) return;

    terminalBackground = document.createElement('div');
    terminalBackground.id = 'terminal-theme-background';
    terminalBackground.setAttribute('aria-hidden', 'true');
    document.body.appendChild(terminalBackground);

    createCrtOverlay();
    createConsoles();
    createPrompts();
    createDataTraces();
    createStatusBlocks();
    createMouseGlow();
    startConsoleFeed();
    bindPointerGlow();
    bindClickResponses();
}

function terminalOriginalUnmount() {
    if (terminalPointerHandler) {
        window.removeEventListener('pointermove', terminalPointerHandler);
        terminalPointerHandler = null;
    }

    if (terminalClickHandler) {
        window.removeEventListener('pointerdown', terminalClickHandler);
        terminalClickHandler = null;
    }

    if (terminalLastPointerFrame) {
        cancelAnimationFrame(terminalLastPointerFrame);
        terminalLastPointerFrame = 0;
    }

    if (terminalFeedTimer) {
        clearInterval(terminalFeedTimer);
        terminalFeedTimer = null;
    }

    terminalConsoleNodes = [];

    document.body.style.removeProperty('--terminal-mouse-x');
    document.body.style.removeProperty('--terminal-mouse-y');

    if (terminalBackground) {
        terminalBackground.remove();
        terminalBackground = null;
    }
}


/* ============================================================
   INTRO AUDIO ADDITION
   ============================================================ */
let terminalIntroAudio = null;
let terminalIntroFallback = null;
let terminalIntroTimer = null;
const TERMINAL_INTRO_SRC = "/sounds/intros/the_mountain-game-179496.mp3";
const TERMINAL_INTRO_VOLUME = 0.25;
const TERMINAL_INTRO_END = 23;
const TERMINAL_INTRO_FADE_START = 18;
const TERMINAL_INTRO_FULL = false;
const TERMINAL_INTRO_FADE_END = false;

function terminalClearIntroFallback() {
    if (!terminalIntroFallback) return;
    window.removeEventListener("pointerdown", terminalIntroFallback);
    window.removeEventListener("keydown", terminalIntroFallback);
    terminalIntroFallback = null;
}

function terminalStopIntro() {
    if (terminalIntroTimer) {
        clearInterval(terminalIntroTimer);
        terminalIntroTimer = null;
    }
    terminalClearIntroFallback();
    document.body.classList.remove("theme-terminal-intro-playing");
    if (terminalIntroAudio) {
        try {
            terminalIntroAudio.pause();
            terminalIntroAudio.currentTime = 0;
        } catch (_) {}
    }
    terminalIntroAudio = null;
}

function terminalPlayIntro() {
    terminalStopIntro();
    const audio = new Audio(TERMINAL_INTRO_SRC);
    terminalIntroAudio = audio;
    audio.preload = "auto";
    audio.volume = TERMINAL_INTRO_VOLUME;

    audio.addEventListener("playing", () => {
        document.body.classList.add("theme-terminal-intro-playing");
        terminalClearIntroFallback();
    });

    audio.addEventListener("ended", () => {
        terminalStopIntro();
    }, { once: true });

    audio.addEventListener("error", () => {
        terminalStopIntro();
    }, { once: true });

    terminalIntroTimer = setInterval(() => {
        if (terminalIntroAudio !== audio) return;
        const t = audio.currentTime || 0;

        if (TERMINAL_INTRO_END != null) {
            if (TERMINAL_INTRO_FADE_START != null && t >= TERMINAL_INTRO_FADE_START) {
                const len = Math.max(.001, TERMINAL_INTRO_END - TERMINAL_INTRO_FADE_START);
                const p = Math.min(1, (t - TERMINAL_INTRO_FADE_START) / len);
                audio.volume = Math.max(0, TERMINAL_INTRO_VOLUME * (1 - p));
            }
            if (t >= TERMINAL_INTRO_END) {
                terminalStopIntro();
            }
        } else if (TERMINAL_INTRO_FULL && TERMINAL_INTRO_FADE_END &&
                   Number.isFinite(audio.duration) && audio.duration > 0) {
            const remaining = audio.duration - t;
            if (remaining <= 3) {
                audio.volume = Math.max(0, TERMINAL_INTRO_VOLUME * (remaining / 3));
            }
        }
    }, 120);

    const p = audio.play();
    if (p && typeof p.catch === "function") {
        p.catch(() => {
            if (terminalIntroFallback || terminalIntroAudio !== audio) return;
            terminalIntroFallback = () => {
                if (terminalIntroAudio !== audio) return;
                const retry = audio.play();
                if (retry && typeof retry.catch === "function") retry.catch(() => {});
            };
            window.addEventListener("pointerdown", terminalIntroFallback);
            window.addEventListener("keydown", terminalIntroFallback);
        });
    }
}

export function mount() {
    terminalOriginalMount();
    terminalPlayIntro();
}

export function unmount() {
    terminalStopIntro();
    terminalOriginalUnmount();
}
