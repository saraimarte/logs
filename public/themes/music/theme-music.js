// ============================================================
// MUSIC THEME
// ============================================================
// Decorative musical notes + piano sounds.
// This file ONLY controls Music theme decorations.
// It does NOT modify the application's layout.
// ============================================================

let musicBackground = null;
let musicAnimationFrame = null;
let musicMouseHandler = null;
let musicPointerDownHandler = null;
let musicAudioContext = null;
let musicHoveredNote = null;
let musicClickHandler = null;
let musicLastTrailTime = 0;

const MUSIC_NOTES = [
    { name: "C4", frequency: 261.63, symbol: "♪" },
    { name: "D4", frequency: 293.66, symbol: "♫" },
    { name: "E4", frequency: 329.63, symbol: "♩" },
    { name: "F4", frequency: 349.23, symbol: "♪" },
    { name: "G4", frequency: 392.00, symbol: "♫" },
    { name: "A4", frequency: 440.00, symbol: "♩" },
    { name: "B4", frequency: 493.88, symbol: "♪" },
    { name: "C5", frequency: 523.25, symbol: "♫" },
    { name: "D5", frequency: 587.33, symbol: "♩" },
    { name: "E5", frequency: 659.25, symbol: "♪" },
    { name: "F5", frequency: 698.46, symbol: "♫" },
    { name: "G5", frequency: 783.99, symbol: "♩" }
];

const MUSIC_SYMBOLS = [
    "♪",
    "♫",
    "♩",
    "♬"
];

function getAudioContext() {
    if (musicAudioContext) {
        return musicAudioContext;
    }

    const AudioContextClass =
        window.AudioContext ||
        window.webkitAudioContext;

    if (!AudioContextClass) {
        return null;
    }

    musicAudioContext =
        new AudioContextClass();

    return musicAudioContext;
}

function unlockMusicAudio() {
    const context =
        getAudioContext();

    if (!context) {
        return;
    }

    if (context.state === "suspended") {
        context.resume().catch(() => {});
    }
}

function playPianoNote(frequency) {
    const context =
        getAudioContext();

    if (!context) {
        return;
    }

    if (context.state === "suspended") {
        context.resume().catch(() => {});
    }

    const now =
        context.currentTime;

    /*
     * Main piano tone.
     */
    const oscillator =
        context.createOscillator();

    const gain =
        context.createGain();

    oscillator.type =
        "triangle";

    oscillator.frequency.setValueAtTime(
        frequency,
        now
    );

    /*
     * Piano attack and decay.
     */
    gain.gain.setValueAtTime(
        0.0001,
        now
    );

    gain.gain.exponentialRampToValueAtTime(
        0.18,
        now + 0.015
    );

    gain.gain.exponentialRampToValueAtTime(
        0.065,
        now + 0.18
    );

    gain.gain.exponentialRampToValueAtTime(
        0.0001,
        now + 1.25
    );

    oscillator.connect(gain);
    gain.connect(context.destination);

    oscillator.start(now);
    oscillator.stop(
        now + 1.3
    );

    /*
     * Quiet second harmonic makes it sound less
     * like a plain electronic oscillator.
     */
    const harmonic =
        context.createOscillator();

    const harmonicGain =
        context.createGain();

    harmonic.type =
        "sine";

    harmonic.frequency.setValueAtTime(
        frequency * 2,
        now
    );

    harmonicGain.gain.setValueAtTime(
        0.025,
        now
    );

    harmonicGain.gain.exponentialRampToValueAtTime(
        0.0001,
        now + 0.65
    );

    harmonic.connect(
        harmonicGain
    );

    harmonicGain.connect(
        context.destination
    );

    harmonic.start(now);
    harmonic.stop(
        now + 0.7
    );
}

function createMusicNote(
    noteData,
    index
) {
    const note =
        document.createElement("span");

    note.className =
        "music-background-note";

    note.textContent =
        noteData.symbol;

    note.dataset.note =
        noteData.name;

    note.dataset.frequency =
        noteData.frequency;

    note.dataset.index =
        index;

    const size =
        24 +
        Math.random() * 22;

    const left =
        3 +
        Math.random() * 94;

    const top =
        5 +
        Math.random() * 88;

    const rotation =
        -15 +
        Math.random() * 30;

    const driftX =
        -12 +
        Math.random() * 24;

    const driftY =
        -10 +
        Math.random() * 20;

    note.style.left =
        `${left}%`;

    note.style.top =
        `${top}%`;

    note.style.fontSize =
        `${size}px`;

    note.style.setProperty(
        "--music-rotation",
        `${rotation}deg`
    );

    note.style.setProperty(
        "--music-drift-x",
        `${driftX}px`
    );

    note.style.setProperty(
        "--music-drift-y",
        `${driftY}px`
    );

    note.style.setProperty(
        "--music-note-delay",
        `${-(Math.random() * 8)}s`
    );

    note.style.setProperty(
        "--music-note-duration",
        `${7 + Math.random() * 5}s`
    );

    return note;
}

function createStaffLines() {
    const fragment =
        document.createDocumentFragment();

    /*
     * Three extremely subtle groups of staff lines.
     * They are decorative and cannot intercept clicks.
     */
    for (
        let group = 0;
        group < 3;
        group++
    ) {
        const staff =
            document.createElement("div");

        staff.className =
            "music-background-staff";

        staff.style.top =
            `${18 + group * 32}%`;

        staff.style.transform =
            `rotate(${
                -1.2 +
                Math.random() * 2.4
            }deg)`;

        fragment.appendChild(
            staff
        );
    }

    return fragment;
}

function createTrebleClefs() {
    const fragment =
        document.createDocumentFragment();

    for (
        let i = 0;
        i < 3;
        i++
    ) {
        const clef =
            document.createElement("span");

        clef.className =
            "music-background-clef";

        clef.textContent =
            "𝄞";

        clef.style.left =
            `${8 + Math.random() * 84}%`;

        clef.style.top =
            `${12 + Math.random() * 72}%`;

        clef.style.animationDelay =
            `${-(Math.random() * 8)}s`;

        fragment.appendChild(
            clef
        );
    }

    return fragment;
}


function createVinylRecords() {
    const fragment = document.createDocumentFragment();

    [
        { left: 5, top: 13, size: 82 },
        { left: 87, top: 34, size: 96 },
        { left: 10, top: 79, size: 74 },
        { left: 78, top: 88, size: 68 }
    ].forEach((config) => {
        const record = document.createElement("span");
        record.className = "music-background-record";
        record.style.left = `${config.left}%`;
        record.style.top = `${config.top}%`;
        record.style.setProperty("--record-size", `${config.size}px`);
        record.style.setProperty("--record-duration", `${18 + Math.random() * 18}s`);
        fragment.appendChild(record);
    });

    return fragment;
}

function createEqualizers() {
    const fragment = document.createDocumentFragment();

    [
        { left: 18, top: 19, rotate: -4 },
        { left: 72, top: 21, rotate: 3 },
        { left: 24, top: 64, rotate: 4 },
        { left: 68, top: 70, rotate: -3 }
    ].forEach((config, groupIndex) => {
        const eq = document.createElement("div");
        eq.className = "music-background-eq";
        eq.style.left = `${config.left}%`;
        eq.style.top = `${config.top}%`;
        eq.style.setProperty("--eq-rotate", `${config.rotate}deg`);

        for (let i = 0; i < 8; i++) {
            const bar = document.createElement("span");
            bar.style.setProperty("--eq-height", `${14 + Math.random() * 36}px`);
            bar.style.setProperty("--eq-duration", `${0.7 + Math.random() * 1.2}s`);
            bar.style.setProperty("--eq-delay", `${-(groupIndex * .2 + i * .1)}s`);
            eq.appendChild(bar);
        }

        fragment.appendChild(eq);
    });

    return fragment;
}

function createWaveforms() {
    const fragment = document.createDocumentFragment();

    [
        { left: 11, top: 41, width: 26, rotate: -3 },
        { left: 62, top: 48, width: 27, rotate: 4 },
        { left: 30, top: 84, width: 34, rotate: -2 }
    ].forEach((config) => {
        const wave = document.createElement("span");
        wave.className = "music-background-wave";
        wave.style.left = `${config.left}%`;
        wave.style.top = `${config.top}%`;
        wave.style.setProperty("--wave-width", `${config.width}vw`);
        wave.style.setProperty("--wave-rotate", `${config.rotate}deg`);
        fragment.appendChild(wave);
    });

    return fragment;
}

function createMusicGlints() {
    const fragment = document.createDocumentFragment();

    for (let i = 0; i < 30; i++) {
        const glint = document.createElement("span");
        glint.className = "music-background-glint";
        glint.style.left = `${3 + Math.random() * 94}%`;
        glint.style.top = `${6 + Math.random() * 88}%`;
        glint.style.setProperty("--glint-size", `${2 + Math.random() * 4}px`);
        glint.style.setProperty("--glint-duration", `${4 + Math.random() * 5}s`);
        glint.style.setProperty("--glint-delay", `${-(Math.random() * 8)}s`);
        fragment.appendChild(glint);
    }

    return fragment;
}

function createNoteTrail(x, y, count = 4) {
    if (!musicBackground) return;

    const symbols = ["♪", "♫", "♩", "♬"];

    for (let i = 0; i < count; i++) {
        const trail = document.createElement("span");
        trail.className = "music-note-trail";
        trail.textContent = symbols[Math.floor(Math.random() * symbols.length)];
        trail.style.setProperty("--trail-x", `${x + (Math.random() * 20 - 10)}px`);
        trail.style.setProperty("--trail-y", `${y + (Math.random() * 14 - 7)}px`);
        trail.style.setProperty("--trail-drift-x", `${Math.random() * 34 - 17}px`);
        trail.style.setProperty("--trail-rotate", `${Math.random() * 50 - 25}deg`);
        trail.style.setProperty("--trail-size", `${16 + Math.random() * 12}px`);

        musicBackground.appendChild(trail);

        window.setTimeout(() => {
            trail.remove();
        }, 1000);
    }
}

function playMusicChord() {
    const chord = [
        261.63,
        329.63,
        392.00
    ];

    chord.forEach((frequency, index) => {
        window.setTimeout(() => {
            playPianoNote(frequency);
        }, index * 48);
    });
}

function handleMusicClick(event) {
    if (
        isOverInteractiveUI(
            event.clientX,
            event.clientY
        )
    ) {
        return;
    }

    unlockMusicAudio();
    createNoteTrail(
        event.clientX,
        event.clientY,
        7
    );
    playMusicChord();
}

function animateMusicBackground() {
    if (!musicBackground) {
        return;
    }

    musicAnimationFrame =
        requestAnimationFrame(
            animateMusicBackground
        );
}

/*
 * Determines whether the mouse is over actual application
 * content. This prevents a note from sounding while the user
 * is hovering over a textbox, button, card, modal, etc.
 */
function isOverInteractiveUI(
    x,
    y
) {
    const element =
        document.elementFromPoint(
            x,
            y
        );

    if (!element) {
        return false;
    }

    /*
     * Explicitly interactive elements.
     */
    const interactive =
        element.closest(
            [
                "button",
                "a",
                "input",
                "textarea",
                "select",
                "[role='button']",
                "[contenteditable='true']",
                ".modal-box",
                ".modal-overlay",
                ".day-box",
                ".chip",
                ".resource-card",
                ".toolbox-item",
                ".side-nav",
                ".icon-btn"
            ].join(",")
        );

    return !!interactive;
}

function getHoveredMusicNote(
    x,
    y
) {
    if (!musicBackground) {
        return null;
    }

    /*
     * Never allow the decoration to interfere with
     * actual application controls.
     */
    if (
        isOverInteractiveUI(
            x,
            y
        )
    ) {
        return null;
    }

    const notes =
        musicBackground.querySelectorAll(
            ".music-background-note"
        );

    for (const note of notes) {
        const rect =
            note.getBoundingClientRect();

        const inside =
            x >= rect.left &&
            x <= rect.right &&
            y >= rect.top &&
            y <= rect.bottom;

        if (inside) {
            return note;
        }
    }

    return null;
}

function handleMusicMouseMove(
    event
) {
    if (musicBackground) {
        musicBackground.style.setProperty(
            "--music-mouse-x",
            `${event.clientX}px`
        );

        musicBackground.style.setProperty(
            "--music-mouse-y",
            `${event.clientY}px`
        );
    }

    const now = performance.now();
    if (
        now - musicLastTrailTime > 120 &&
        !isOverInteractiveUI(
            event.clientX,
            event.clientY
        )
    ) {
        musicLastTrailTime = now;

        if (Math.random() < 0.34) {
            createNoteTrail(
                event.clientX,
                event.clientY,
                1
            );
        }
    }

    const note =
        getHoveredMusicNote(
            event.clientX,
            event.clientY
        );

    /*
     * Don't repeatedly play the same note while the
     * cursor remains over it.
     */
    if (note === musicHoveredNote) {
        return;
    }

    /*
     * Cursor left the previous note.
     */
    if (musicHoveredNote) {
        musicHoveredNote.classList.remove(
            "music-note-playing"
        );
    }

    musicHoveredNote =
        note;

    if (!note) {
        return;
    }

    note.classList.add(
        "music-note-playing"
    );

    playPianoNote(
        Number(
            note.dataset.frequency
        )
    );

    window.setTimeout(
        () => {
            if (note) {
                note.classList.remove(
                    "music-note-playing"
                );
            }
        },
        500
    );
}

export function mount() {
    /*
     * Safety check against duplicate theme instances.
     */
    const existing =
        document.getElementById(
            "music-background"
        );

    if (existing) {
        existing.remove();
    }

    musicBackground =
        document.createElement("div");

    musicBackground.id =
        "music-background";

    musicBackground.setAttribute(
        "aria-hidden",
        "true"
    );

    /*
     * IMPORTANT:
     * This element is purely decorative.
     * It never receives pointer events.
     */
    musicBackground.style.pointerEvents =
        "none";

    /*
     * Add subtle sheet-music lines.
     */
    musicBackground.appendChild(
        createStaffLines()
    );

    /*
     * Add treble clefs.
     */
    musicBackground.appendChild(
        createTrebleClefs()
    );

    /*
     * Add richer background elements.
     */
    musicBackground.appendChild(
        createVinylRecords()
    );

    musicBackground.appendChild(
        createEqualizers()
    );

    musicBackground.appendChild(
        createWaveforms()
    );

    musicBackground.appendChild(
        createMusicGlints()
    );

    /*
     * Add floating notes.
     */
    for (
        let i = 0;
        i < 26;
        i++
    ) {
        const noteData =
            MUSIC_NOTES[
                Math.floor(
                    Math.random() *
                    MUSIC_NOTES.length
                )
            ];

        musicBackground.appendChild(
            createMusicNote(
                noteData,
                i
            )
        );
    }

    document.body.appendChild(
        musicBackground
    );

    /*
     * Mouse detection happens on the document instead of
     * the decorative notes themselves.
     *
     * Therefore the Music theme never blocks clicks.
     */
    musicMouseHandler =
        handleMusicMouseMove;

    document.addEventListener(
        "mousemove",
        musicMouseHandler,
        {
            passive: true
        }
    );

    musicClickHandler =
        handleMusicClick;

    document.addEventListener(
        "click",
        musicClickHandler,
        {
            passive: true
        }
    );

    /*
     * Browsers require a user gesture before Web Audio
     * can play sound.
     */
    musicPointerDownHandler =
        () => {
            unlockMusicAudio();
        };

    document.addEventListener(
        "pointerdown",
        musicPointerDownHandler,
        {
            once: true,
            passive: true
        }
    );

    /*
     * Start animation.
     */
    if (musicAnimationFrame) {
        cancelAnimationFrame(
            musicAnimationFrame
        );
    }

    musicAnimationFrame =
        requestAnimationFrame(
            animateMusicBackground
        );
}

export function unmount() {
    /*
     * Stop animation.
     */
    if (musicAnimationFrame) {
        cancelAnimationFrame(
            musicAnimationFrame
        );

        musicAnimationFrame =
            null;
    }

    /*
     * Remove mouse listener.
     */
    if (musicMouseHandler) {
        document.removeEventListener(
            "mousemove",
            musicMouseHandler
        );

        musicMouseHandler =
            null;
    }

    if (musicClickHandler) {
        document.removeEventListener(
            "click",
            musicClickHandler
        );

        musicClickHandler =
            null;
    }

    /*
     * Remove audio unlock listener.
     */
    if (musicPointerDownHandler) {
        document.removeEventListener(
            "pointerdown",
            musicPointerDownHandler
        );

        musicPointerDownHandler =
            null;
    }

    /*
     * Remove the decorative background.
     */
    if (musicBackground) {
        musicBackground.remove();

        musicBackground =
            null;
    }

    /*
     * Also remove an orphaned copy if one exists.
     */
    const orphan =
        document.getElementById(
            "music-background"
        );

    if (orphan) {
        orphan.remove();
    }

    musicHoveredNote =
        null;

    /*
     * Shut down audio when leaving the theme.
     */
    if (musicAudioContext) {
        musicAudioContext
            .close()
            .catch(() => {});

        musicAudioContext =
            null;
    }
}