/* ============================================================
   GUITAR THEME
   Decorative-only animated guitar background.

   IMPORTANT:
   - Uses supplied SVGs in /public/svg/theme-guitar.
   - Does not alter cursor, companion, tab, selector, or app logic.
   - Background elements are pointer-events:none.
   ============================================================ */

let guitarBackground = null;
let guitarStylesheet = null;
let guitarHoverAudio = null;
let guitarFadeFrame = null;
let guitarFadeTimer = null;
let guitarHoverToken = 0;
let guitarIntroAudio = null;
let guitarIntroFadeFrame = null;
let guitarIntroStartHandler = null;
let guitarHoverSoundsEnabled = false;

const GUITAR_INTRO_SRC = '/sounds/intros/alanajordan-surf-rock-05-269645.mp3';
const GUITAR_INTRO_END_SECONDS = 30;
const GUITAR_INTRO_FADE_START_SECONDS = 27;
const GUITAR_INTRO_VOLUME = 0.55;

const GUITAR_AUDIO_BASE = '/sounds/guitar/';
const GUITAR_AUDIO = {
    favorite: `${GUITAR_AUDIO_BASE}openmindaudio-electric-blues-rock-music-electric-pilgrim-580050.mp3`,
    riff: `${GUITAR_AUDIO_BASE}monume-guitar-guitar-riff-547920.mp3`,
    jazz: `${GUITAR_AUDIO_BASE}surprising_media-guitar-jazz-327352.mp3`
};

const GUITAR_AUDIO_VOLUME = 0.42;
const GUITAR_FADE_SECONDS = 2.25;

const GUITAR_SVGS = [
    '/svg/theme-guitar/guitar01_butterscotch_telecaster.svg',
    '/svg/theme-guitar/guitar02_cherry_red_sg.svg',
    '/svg/theme-guitar/guitar03_sunburst_stratocaster.svg',
    '/svg/theme-guitar/guitar04_seafoam_offset.svg',
    '/svg/theme-guitar/guitar05_smoky_gray_prs.svg',
    '/svg/theme-guitar/guitar06_gold_semihollow.svg',
    '/svg/theme-guitar/guitar07_sunburst_acoustic.svg',
    '/svg/theme-guitar/guitar08_black_explorer.svg',
    '/svg/theme-guitar/guitar09_orange_hollowbody.svg',
    '/svg/theme-guitar/guitar10_red_jaguar.svg'
];

function guitarRandom(min, max) {
    return Math.random() * (max - min) + min;
}

function cancelGuitarFade() {
    if (guitarFadeTimer) {
        clearTimeout(guitarFadeTimer);
        guitarFadeTimer = null;
    }

    if (guitarFadeFrame) {
        cancelAnimationFrame(guitarFadeFrame);
        guitarFadeFrame = null;
    }
}

function stopGuitarAudioImmediately() {
    cancelGuitarFade();

    if (!guitarHoverAudio) return;

    try {
        guitarHoverAudio.pause();
        guitarHoverAudio.currentTime = 0;
    } catch (_) {}

    guitarHoverAudio = null;
}


function removeGuitarIntroStartListeners() {
    if (!guitarIntroStartHandler) return;

    document.removeEventListener('pointerdown', guitarIntroStartHandler, true);
    document.removeEventListener('keydown', guitarIntroStartHandler, true);
    guitarIntroStartHandler = null;
}

function finishGuitarIntro() {
    if (guitarIntroFadeFrame) {
        cancelAnimationFrame(guitarIntroFadeFrame);
        guitarIntroFadeFrame = null;
    }

    removeGuitarIntroStartListeners();

    const audio = guitarIntroAudio;
    guitarIntroAudio = null;

    if (audio) {
        try {
            audio.pause();
            audio.currentTime = 0;
            audio.removeAttribute('src');
            audio.load();
        } catch (_) {}
    }

    // Guitar SVG hover sounds are unlocked only after the 30-second intro
    // has finished (including its fade-out).
    guitarHoverSoundsEnabled = true;
}

function updateGuitarIntroFade() {
    const audio = guitarIntroAudio;
    if (!audio) return;

    const current = Number.isFinite(audio.currentTime) ? audio.currentTime : 0;

    if (current >= GUITAR_INTRO_END_SECONDS) {
        finishGuitarIntro();
        return;
    }

    if (current >= GUITAR_INTRO_FADE_START_SECONDS) {
        const fadeLength = GUITAR_INTRO_END_SECONDS - GUITAR_INTRO_FADE_START_SECONDS;
        const fadeProgress = Math.min(
            1,
            Math.max(0, (current - GUITAR_INTRO_FADE_START_SECONDS) / fadeLength)
        );
        audio.volume = GUITAR_INTRO_VOLUME * (1 - fadeProgress);
    } else {
        audio.volume = GUITAR_INTRO_VOLUME;
    }

    guitarIntroFadeFrame = requestAnimationFrame(updateGuitarIntroFade);
}

function startGuitarIntroPlayback() {
    if (!guitarIntroAudio) return;

    removeGuitarIntroStartListeners();

    const audio = guitarIntroAudio;
    audio.volume = GUITAR_INTRO_VOLUME;

    try { audio.currentTime = 0; } catch (_) {}

    const playPromise = audio.play();
    if (playPromise && typeof playPromise.then === 'function') {
        playPromise.then(() => {
            if (guitarIntroAudio !== audio) return;
            if (guitarIntroFadeFrame) cancelAnimationFrame(guitarIntroFadeFrame);
            guitarIntroFadeFrame = requestAnimationFrame(updateGuitarIntroFade);
        }).catch(() => {
            // Browsers can block autoplay. Keep hover sounds locked and start
            // the intro on the user's first normal pointer/key interaction.
            if (guitarIntroAudio !== audio) return;

            guitarIntroStartHandler = () => {
                if (guitarIntroAudio !== audio) return;
                startGuitarIntroPlayback();
            };

            document.addEventListener('pointerdown', guitarIntroStartHandler, true);
            document.addEventListener('keydown', guitarIntroStartHandler, true);
        });
    } else {
        // Fallback for older browsers whose Audio.play() does not return a Promise.
        if (guitarIntroFadeFrame) cancelAnimationFrame(guitarIntroFadeFrame);
        guitarIntroFadeFrame = requestAnimationFrame(updateGuitarIntroFade);
    }
}

function playGuitarIntro() {
    finishGuitarIntro();
    guitarHoverSoundsEnabled = false;

    const audio = new Audio(GUITAR_INTRO_SRC);
    guitarIntroAudio = audio;
    audio.preload = 'auto';
    audio.volume = GUITAR_INTRO_VOLUME;

    audio.addEventListener('ended', () => {
        if (guitarIntroAudio === audio) finishGuitarIntro();
    }, { once: true });

    audio.addEventListener('error', () => {
        // Do not leave the theme permanently muted if the intro file is missing.
        if (guitarIntroAudio === audio) finishGuitarIntro();
    }, { once: true });

    startGuitarIntroPlayback();
}

function stopGuitarIntroImmediately() {
    guitarHoverSoundsEnabled = false;

    if (guitarIntroFadeFrame) {
        cancelAnimationFrame(guitarIntroFadeFrame);
        guitarIntroFadeFrame = null;
    }

    removeGuitarIntroStartListeners();

    if (!guitarIntroAudio) return;

    try {
        guitarIntroAudio.pause();
        guitarIntroAudio.currentTime = 0;
        guitarIntroAudio.removeAttribute('src');
        guitarIntroAudio.load();
    } catch (_) {}

    guitarIntroAudio = null;
}

function pickGuitarAudioMoment(duration) {
    // The beginning of Electric Pilgrim is intentionally the most common sound.
    // 55%: beginning of favorite track
    // 15%: random later part of favorite track
    // 15%: random part of the guitar riff
    // 15%: random part of the jazz track
    const roll = Math.random();

    if (roll < 0.55) {
        return {
            src: GUITAR_AUDIO.favorite,
            start: 0
        };
    }

    let src;
    if (roll < 0.70) src = GUITAR_AUDIO.favorite;
    else if (roll < 0.85) src = GUITAR_AUDIO.riff;
    else src = GUITAR_AUDIO.jazz;

    // Leave enough room so the hover clip does not begin right at the file end.
    const safeDuration = Number.isFinite(duration) && duration > 8 ? duration : 0;
    const maxStart = Math.max(0, safeDuration - 7);

    return {
        src,
        start: maxStart > 0 ? guitarRandom(0, maxStart) : 0
    };
}

function getAudioDuration(src) {
    return new Promise((resolve) => {
        const probe = new Audio();
        probe.preload = 'metadata';
        probe.src = src;

        const finish = () => {
            const duration = Number.isFinite(probe.duration) ? probe.duration : 0;
            probe.removeAttribute('src');
            try { probe.load(); } catch (_) {}
            resolve(duration);
        };

        probe.addEventListener('loadedmetadata', finish, { once: true });
        probe.addEventListener('error', () => resolve(0), { once: true });
    });
}

async function playGuitarHoverSound() {
    if (!guitarHoverSoundsEnabled) return;

    const token = ++guitarHoverToken;
    cancelGuitarFade();

    // Pick the weighted track first, then obtain that track's duration only when
    // a random seek position is needed.
    const weighted = Math.random();
    let src;
    let forceStart = false;

    if (weighted < 0.55) {
        src = GUITAR_AUDIO.favorite;
        forceStart = true;
    } else if (weighted < 0.70) {
        src = GUITAR_AUDIO.favorite;
    } else if (weighted < 0.85) {
        src = GUITAR_AUDIO.riff;
    } else {
        src = GUITAR_AUDIO.jazz;
    }

    let start = 0;
    if (!forceStart) {
        const duration = await getAudioDuration(src);
        if (token !== guitarHoverToken) return;
        const maxStart = Math.max(0, duration - 7);
        start = maxStart > 0 ? guitarRandom(0, maxStart) : 0;
    }

    // Hovering a different guitar immediately replaces the previous excerpt.
    // There is no long fade delay between guitars.
    stopGuitarAudioImmediately();

    const audio = new Audio(src);
    guitarHoverAudio = audio;
    audio.preload = 'auto';
    audio.volume = GUITAR_AUDIO_VOLUME;

    const startPlayback = () => {
        if (token !== guitarHoverToken || guitarHoverAudio !== audio) return;

        try {
            if (start > 0 && Number.isFinite(audio.duration)) {
                audio.currentTime = Math.min(start, Math.max(0, audio.duration - 0.25));
            } else {
                audio.currentTime = 0;
            }
        } catch (_) {}

        const playPromise = audio.play();
        if (playPromise && typeof playPromise.catch === 'function') {
            playPromise.catch(() => {
                // A browser can block hover-triggered sound before the page has
                // received any normal user interaction. A later hover after a
                // click/key interaction will work without changing app behavior.
            });
        }
    };

    if (audio.readyState >= 1) startPlayback();
    else audio.addEventListener('loadedmetadata', startPlayback, { once: true });

    audio.addEventListener('ended', () => {
        if (guitarHoverAudio === audio) guitarHoverAudio = null;
    }, { once: true });
}

function fadeOutGuitarHoverSound() {
    if (!guitarHoverAudio || guitarHoverAudio.paused) return;

    cancelGuitarFade();

    const audio = guitarHoverAudio;
    const startVolume = audio.volume;
    const startTime = performance.now();
    const durationMs = GUITAR_FADE_SECONDS * 1000;

    const step = (now) => {
        if (guitarHoverAudio !== audio) return;

        const progress = Math.min(1, (now - startTime) / durationMs);
        audio.volume = Math.max(0, startVolume * (1 - progress));

        if (progress < 1) {
            guitarFadeFrame = requestAnimationFrame(step);
        } else {
            audio.pause();
            try { audio.currentTime = 0; } catch (_) {}
            if (guitarHoverAudio === audio) guitarHoverAudio = null;
            guitarFadeFrame = null;
        }
    };

    guitarFadeFrame = requestAnimationFrame(step);
}

function bindGuitarHoverSound(item) {
    item.addEventListener('mouseenter', () => {
        playGuitarHoverSound();
    });

    item.addEventListener('mouseleave', () => {
        fadeOutGuitarHoverSound();
    });
}

function addGuitar(file, config) {
    if (!guitarBackground) return;

    const item = document.createElement('div');
    item.className = `guitar-theme-item guitar-theme-depth-${config.depth || 1}`;
    item.setAttribute('aria-hidden', 'true');
    item.style.left = `${config.x}%`;
    item.style.top = `${config.y}%`;
    item.style.setProperty('--guitar-scale', config.scale ?? 1);
    item.style.setProperty('--guitar-rotate', `${config.rotate ?? 0}deg`);
    item.style.setProperty('--guitar-duration', `${config.duration ?? guitarRandom(8, 13)}s`);
    item.style.setProperty('--guitar-delay', `${config.delay ?? -guitarRandom(0, 10)}s`);
    item.style.setProperty('--guitar-drift-x', `${config.driftX ?? guitarRandom(-7, 7)}px`);
    item.style.setProperty('--guitar-drift-y', `${config.driftY ?? guitarRandom(-6, 6)}px`);

    const img = document.createElement('img');
    img.className = 'guitar-theme-svg';
    img.src = file;
    img.alt = '';
    img.draggable = false;
    img.setAttribute('aria-hidden', 'true');

    item.appendChild(img);
    guitarBackground.appendChild(item);
    bindGuitarHoverSound(item);
}

function createGuitars() {
    if (!guitarBackground) return;

    // Keep the title/header zone clear; guitars begin lower on the page.
    const layout = [
        { x: 6,  y: 29, scale: 1.06, rotate: -14, depth: 1 },
        { x: 94, y: 28, scale: 1.03, rotate: 15,  depth: 1 },
        { x: 20, y: 49, scale: 0.95, rotate: 9,   depth: 1 },
        { x: 80, y: 49, scale: 0.98, rotate: -9,  depth: 1 },
        { x: 4,  y: 68, scale: 1.12, rotate: -17, depth: 1 },
        { x: 96, y: 68, scale: 1.10, rotate: 17,  depth: 1 },
        { x: 29, y: 75, scale: 0.94, rotate: -6,  depth: 1 },
        { x: 71, y: 77, scale: 0.96, rotate: 7,   depth: 1 },
        { x: 12, y: 92, scale: 1.02, rotate: 11,  depth: 1 },
        { x: 88, y: 92, scale: 1.00, rotate: -11, depth: 1 }
    ];

    GUITAR_SVGS.forEach((file, index) => {
        const base = layout[index];
        addGuitar(file, {
            ...base,
            x: base.x + guitarRandom(-1.2, 1.2),
            y: base.y + guitarRandom(-1.0, 1.0),
            duration: guitarRandom(8.5, 12.5),
            delay: -guitarRandom(0, 10),
            driftX: guitarRandom(-5, 5),
            driftY: guitarRandom(-4, 4)
        });
    });
}

function createStringLines() {
    if (!guitarBackground) return;

    const lines = [
        { top: 22, left: 3, width: 22, rotate: -3 },
        { top: 39, left: 73, width: 24, rotate: 3 },
        { top: 59, left: 2, width: 18, rotate: 2 },
        { top: 84, left: 71, width: 26, rotate: -2 }
    ];

    lines.forEach((config, index) => {
        const line = document.createElement('span');
        line.className = 'guitar-theme-string-line';
        line.setAttribute('aria-hidden', 'true');
        line.style.top = `${config.top}%`;
        line.style.left = `${config.left}%`;
        line.style.width = `${config.width}%`;
        line.style.transform = `rotate(${config.rotate}deg)`;
        line.style.animationDelay = `${index * -1.1}s`;
        guitarBackground.appendChild(line);
    });
}

function createMusicSpecks() {
    if (!guitarBackground) return;

    for (let i = 0; i < 28; i++) {
        const speck = document.createElement('span');
        speck.className = 'guitar-theme-speck';
        speck.setAttribute('aria-hidden', 'true');
        speck.style.left = `${guitarRandom(2, 98)}%`;
        speck.style.top = `${guitarRandom(22, 96)}%`;
        speck.style.setProperty('--speck-size', `${guitarRandom(2, 4.5)}px`);
        speck.style.setProperty('--speck-duration', `${guitarRandom(4.5, 8)}s`);
        speck.style.setProperty('--speck-delay', `${-guitarRandom(0, 8)}s`);
        guitarBackground.appendChild(speck);
    }
}


function createMusicStaffs() {
    if (!guitarBackground) return;

    const staffs = [
        { left: -3, top: 18, width: 36, rotate: -5 },
        { left: 70, top: 31, width: 34, rotate: 4 },
        { left: -5, top: 63, width: 31, rotate: 3 },
        { left: 68, top: 82, width: 38, rotate: -4 }
    ];

    staffs.forEach((config) => {
        const staff = document.createElement('span');
        staff.className = 'guitar-theme-staff';
        staff.setAttribute('aria-hidden', 'true');
        staff.style.left = `${config.left}%`;
        staff.style.top = `${config.top}%`;
        staff.style.setProperty('--staff-width', `${config.width}vw`);
        staff.style.setProperty('--staff-rotate', `${config.rotate}deg`);
        guitarBackground.appendChild(staff);
    });
}

function createMusicNotes() {
    if (!guitarBackground) return;

    const symbols = ['♪', '♫', '♩', '♬'];
    const positions = [
        [13, 20], [33, 25], [61, 18], [88, 20],
        [9, 43], [42, 42], [64, 49], [91, 48],
        [16, 66], [38, 71], [62, 65], [84, 69],
        [23, 88], [48, 86], [76, 90], [94, 84]
    ];

    positions.forEach(([x, y], index) => {
        const note = document.createElement('span');
        note.className = 'guitar-theme-note';
        note.textContent = symbols[index % symbols.length];
        note.setAttribute('aria-hidden', 'true');
        note.style.left = `${x + guitarRandom(-2, 2)}%`;
        note.style.top = `${y + guitarRandom(-1.5, 1.5)}%`;
        note.style.setProperty('--note-size', `${guitarRandom(18, 34)}px`);
        note.style.setProperty('--note-rotate', `${guitarRandom(-20, 20)}deg`);
        note.style.setProperty('--note-duration', `${guitarRandom(5, 9)}s`);
        note.style.setProperty('--note-delay', `${-guitarRandom(0, 8)}s`);
        note.style.setProperty('--note-drift-x', `${guitarRandom(-7, 7)}px`);
        note.style.setProperty('--note-drift-y', `${guitarRandom(-8, 5)}px`);
        guitarBackground.appendChild(note);
    });
}

function createGuitarPicks() {
    if (!guitarBackground) return;

    const positions = [[26, 34], [73, 39], [33, 61], [76, 61], [52, 77], [6, 83], [94, 76]];
    positions.forEach(([x, y]) => {
        const pick = document.createElement('span');
        pick.className = 'guitar-theme-pick';
        pick.setAttribute('aria-hidden', 'true');
        pick.style.left = `${x}%`;
        pick.style.top = `${y}%`;
        pick.style.setProperty('--pick-size', `${guitarRandom(18, 31)}px`);
        pick.style.setProperty('--pick-rotate', `${guitarRandom(-35, 35)}deg`);
        guitarBackground.appendChild(pick);
    });
}

function createRecordsAndEqualizers() {
    if (!guitarBackground) return;

    [
        { left: 2, top: 12, size: 76 },
        { left: 88, top: 55, size: 92 },
        { left: 43, top: 91, size: 68 }
    ].forEach((config) => {
        const record = document.createElement('span');
        record.className = 'guitar-theme-record';
        record.setAttribute('aria-hidden', 'true');
        record.style.left = `${config.left}%`;
        record.style.top = `${config.top}%`;
        record.style.setProperty('--record-size', `${config.size}px`);
        record.style.setProperty('--record-duration', `${guitarRandom(18, 34)}s`);
        guitarBackground.appendChild(record);
    });

    [[36, 17], [58, 34], [45, 64], [67, 82]].forEach(([x, y], groupIndex) => {
        const eq = document.createElement('span');
        eq.className = 'guitar-theme-eq';
        eq.setAttribute('aria-hidden', 'true');
        eq.style.left = `${x}%`;
        eq.style.top = `${y}%`;

        for (let i = 0; i < 7; i++) {
            const bar = document.createElement('span');
            bar.style.setProperty('--bar-height', `${guitarRandom(12, 42)}px`);
            bar.style.setProperty('--bar-duration', `${guitarRandom(.7, 1.7)}s`);
            bar.style.setProperty('--bar-delay', `${-(groupIndex * .2 + i * .11)}s`);
            eq.appendChild(bar);
        }

        guitarBackground.appendChild(eq);
    });
}

export function mount() {
    if (guitarBackground) return;

    guitarStylesheet = document.createElement('link');
    guitarStylesheet.rel = 'stylesheet';
    guitarStylesheet.href = '/themes/theme-guitar.css';
    guitarStylesheet.dataset.theme = 'guitar';
    document.head.appendChild(guitarStylesheet);

    guitarBackground = document.createElement('div');
    guitarBackground.id = 'guitar-theme-background';
    guitarBackground.setAttribute('aria-hidden', 'true');
    document.body.appendChild(guitarBackground);

    createMusicStaffs();
    createMusicNotes();
    createGuitarPicks();
    createRecordsAndEqualizers();
    createStringLines();
    createMusicSpecks();
    createGuitars();
    playGuitarIntro();
}

export function unmount() {
    guitarHoverToken++;
    stopGuitarIntroImmediately();
    stopGuitarAudioImmediately();
    if (guitarBackground) {
        guitarBackground.remove();
        guitarBackground = null;
    }

    if (guitarStylesheet) {
        guitarStylesheet.remove();
        guitarStylesheet = null;
    }
}
