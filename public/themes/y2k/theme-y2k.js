/* ============================================================
   Y2K
   Real /svg/theme-y2k assets with randomized, non-overlapping
   decorative placement. App structure, cursor, companions, tabs,
   spacing, and component sizing are not modified.
   ============================================================ */

let themeBackground = null;
let themeStylesheet = null;
let themeAudio = null;
let themeMouseHandler = null;
let themeItems = [];
let lastGlobalSound = 0;
let themeIntroAudio = null;
let themeIntroFadeFrame = null;

const THEME_INTRO_SOUND = "/sounds/intros/yoshiyuki_tatsuya-blue-knot-578367.mp3";
const THEME_INTRO_END = 9.0;
const THEME_INTRO_FADE_START = 7.4;
const THEME_INTRO_VOLUME = 0.42;

const THEME_IMAGES = [
    { src: "/svg/theme-y2k/black_denim_shoulder_bag.svg", note: 440.00, width: 156, height: 132 },
    { src: "/svg/theme-y2k/black_floppy_disk.svg", note: 495.00, width: 126, height: 126 },
    { src: "/svg/theme-y2k/black_pink_star_bag.svg", note: 550.00, width: 150, height: 138 },
    { src: "/svg/theme-y2k/black_tribal_belt.svg", note: 605.00, width: 176, height: 86 },
    { src: "/svg/theme-y2k/blackberry_pink_phone.svg", note: 660.00, width: 112, height: 154 },
    { src: "/svg/theme-y2k/blue_alarm_clock.svg", note: 715.00, width: 132, height: 122 },
    { src: "/svg/theme-y2k/blue_sony_handycam.svg", note: 770.00, width: 150, height: 122 },
    { src: "/svg/theme-y2k/blue_star_shoulder_bag.svg", note: 825.00, width: 152, height: 134 },
    { src: "/svg/theme-y2k/bronze_alarm_clock.svg", note: 440.00, width: 132, height: 122 },
    { src: "/svg/theme-y2k/chrome_globe.svg", note: 495.00, width: 142, height: 142 },
    { src: "/svg/theme-y2k/chrome_star_trinket.svg", note: 550.00, width: 124, height: 124 },
    { src: "/svg/theme-y2k/clear_game_controller.svg", note: 605.00, width: 158, height: 116 },
    { src: "/svg/theme-y2k/cream_heart_belt.svg", note: 660.00, width: 176, height: 86 },
    { src: "/svg/theme-y2k/glass_anatomical_heart.svg", note: 715.00, width: 122, height: 148 },
    { src: "/svg/theme-y2k/green_snake_phone.svg", note: 770.00, width: 112, height: 154 },
    { src: "/svg/theme-y2k/heart_orb_charm.svg", note: 825.00, width: 118, height: 138 },
    { src: "/svg/theme-y2k/iridescent_shoulder_bag.svg", note: 440.00, width: 152, height: 134 },
    { src: "/svg/theme-y2k/pink_buckle_bag.svg", note: 495.00, width: 150, height: 136 },
    { src: "/svg/theme-y2k/pink_digital_camera.svg", note: 550.00, width: 136, height: 112 },
    { src: "/svg/theme-y2k/pink_sony_handycam.svg", note: 605.00, width: 150, height: 122 },
    { src: "/svg/theme-y2k/purple_glitter_camera.svg", note: 660.00, width: 138, height: 114 },
    { src: "/svg/theme-y2k/silver_boombox.svg", note: 715.00, width: 170, height: 108 },
    { src: "/svg/theme-y2k/silver_cd_boombox.svg", note: 770.00, width: 170, height: 108 },
    { src: "/svg/theme-y2k/silver_cybershot_camera.svg", note: 825.00, width: 142, height: 112 },
    { src: "/svg/theme-y2k/silver_disco_ball.svg", note: 440.00, width: 128, height: 128 },
    { src: "/svg/theme-y2k/silver_flip_phone.svg", note: 495.00, width: 106, height: 154 },
    { src: "/svg/theme-y2k/yellow_boombox.svg", note: 550.00, width: 170, height: 108 },
{ src: "/svg/theme-y2k/y2k-01-iridescent-heart.svg", note: 605.00, width: 128, height: 146 },
    { src: "/svg/theme-y2k/y2k-03-rainbow-ufo.svg", note: 660.00, width: 156, height: 110 },
    { src: "/svg/theme-y2k/y2k-04-pink-metallic-bow.svg", note: 715.00, width: 146, height: 118 },
    { src: "/svg/theme-y2k/y2k-05-glossy-cherries.svg", note: 770.00, width: 132, height: 126 },
    { src: "/svg/theme-y2k/y2k-06-holographic-star.svg", note: 825.00, width: 128, height: 128 },
    { src: "/svg/theme-y2k/y2k-07-iridescent-strawberry.svg", note: 440.00, width: 120, height: 140 },
    { src: "/svg/theme-y2k/y2k-08-pink-glass-heart.svg", note: 495.00, width: 126, height: 146 },
    { src: "/svg/theme-y2k/y2k-09-iridescent-flower.svg", note: 550.00, width: 136, height: 136 },
    { src: "/svg/theme-y2k/y2k-10-iridescent-star.svg", note: 605.00, width: 128, height: 128 },
    { src: "/svg/theme-y2k/y2k-11-cherries-pink-bow.svg", note: 660.00, width: 140, height: 126 },
    { src: "/svg/theme-y2k/y2k-12-pink-glass-heart.svg", note: 715.00, width: 126, height: 146 },
    { src: "/svg/theme-y2k/y2k-13-crystal-star.svg", note: 770.00, width: 128, height: 128 },
    { src: "/svg/theme-y2k/y2k-14-metallic-pink-bunny.svg", note: 825.00, width: 126, height: 150 },
    { src: "/svg/theme-y2k/y2k-15-rainbow-ufo.svg", note: 880.00, width: 156, height: 110 }
];

const TOTAL_OBJECT_COUNT = 33;

function rand(min, max) {
    return Math.random() * (max - min) + min;
}

function shuffle(array) {
    const copy = [...array];
    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
}


function stopIntroSong() {
    if (themeIntroFadeFrame) {
        cancelAnimationFrame(themeIntroFadeFrame);
        themeIntroFadeFrame = null;
    }

    if (themeIntroAudio) {
        try {
            themeIntroAudio.pause();
            themeIntroAudio.currentTime = 0;
        } catch (_) {}
        themeIntroAudio = null;
    }
}

function startIntroFadeLoop(audio) {
    const tick = () => {
        if (!themeIntroAudio || themeIntroAudio !== audio) return;

        const t = Number.isFinite(audio.currentTime) ? audio.currentTime : 0;

        if (t >= THEME_INTRO_END) {
            try {
                audio.volume = 0;
                audio.pause();
                audio.currentTime = 0;
            } catch (_) {}
            themeIntroAudio = null;
            themeIntroFadeFrame = null;
            return;
        }

        if (t >= THEME_INTRO_FADE_START) {
            const fadeLength = THEME_INTRO_END - THEME_INTRO_FADE_START;
            const progress = Math.min(1, Math.max(0, (t - THEME_INTRO_FADE_START) / fadeLength));
            try {
                audio.volume = THEME_INTRO_VOLUME * (1 - progress);
            } catch (_) {}
        }

        themeIntroFadeFrame = requestAnimationFrame(tick);
    };

    themeIntroFadeFrame = requestAnimationFrame(tick);
}

function playIntroSong() {
    stopIntroSong();

    try {
        const audio = new Audio(THEME_INTRO_SOUND);
        audio.preload = "auto";
        audio.loop = false;
        audio.volume = THEME_INTRO_VOLUME;
        themeIntroAudio = audio;

        audio.addEventListener("ended", () => {
            if (themeIntroAudio === audio) {
                themeIntroAudio = null;
            }
            if (themeIntroFadeFrame) {
                cancelAnimationFrame(themeIntroFadeFrame);
                themeIntroFadeFrame = null;
            }
        }, { once: true });

        const playPromise = audio.play();
        if (playPromise && typeof playPromise.then === "function") {
            playPromise
                .then(() => startIntroFadeLoop(audio))
                .catch(() => {
                    if (themeIntroAudio === audio) themeIntroAudio = null;
                });
        } else {
            startIntroFadeLoop(audio);
        }
    } catch (_) {
        themeIntroAudio = null;
    }
}

function getAudio() {
    if (!themeAudio) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return null;
        themeAudio = new AudioCtx();
    }
    if (themeAudio.state === "suspended") {
        themeAudio.resume().catch(() => {});
    }
    return themeAudio;
}

function playThemeSound(freq) {
    const ctx = getAudio();
    if (!ctx) return;

    const now = ctx.currentTime;
    const master = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();

    filter.type = "lowpass";
    filter.frequency.setValueAtTime(3600, now);
    filter.Q.setValueAtTime(0.7, now);

    master.gain.setValueAtTime(0.0001, now);
    master.gain.exponentialRampToValueAtTime(0.075, now + 0.006);
    master.gain.exponentialRampToValueAtTime(0.0001, now + 0.34);

    osc1.type = "square";
    osc1.frequency.setValueAtTime(freq, now);
    osc1.frequency.setValueAtTime(freq * 1.22, now + 0.07);
    osc1.frequency.setValueAtTime(freq * 0.92, now + 0.14);

    osc2.type = "triangle";
    osc2.frequency.setValueAtTime(freq * 1.5, now);

    const g2 = ctx.createGain();
    g2.gain.setValueAtTime(0.16, now);
    g2.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);

    osc1.connect(filter);
    osc2.connect(g2);
    g2.connect(filter);
    filter.connect(master);
    master.connect(ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.38);
    osc2.stop(now + 0.26);
}

function buildBackdrop() {
    const sheen = document.createElement("div");
    sheen.className = "theme-y2k-sheen";
    themeBackground.appendChild(sheen);

    const grid = document.createElement("div");
    grid.className = "theme-y2k-grid";
    themeBackground.appendChild(grid);

    const rings = document.createElement("div");
    rings.className = "theme-y2k-rings";
    themeBackground.appendChild(rings);

    const floor = document.createElement("div");
    floor.className = "theme-y2k-floor";
    themeBackground.appendChild(floor);
}

function addObject(asset, placement) {
    const item = document.createElement("div");
    item.className = "theme-y2k-item" +
        (placement.soft ? " theme-y2k-soft" : "") +
        (placement.emphasis ? " theme-y2k-emphasis" : "");

    item.style.left = placement.left;
    item.style.top = placement.top;
    item.style.setProperty("--item-scale", placement.scale);
    item.style.setProperty("--item-rotate", placement.rotate + "deg");
    item.style.setProperty("--item-delay", (-rand(0, 8)).toFixed(2) + "s");
    item.style.setProperty("--item-x", rand(-11, 11).toFixed(1) + "px");
    item.style.setProperty("--item-y", rand(-8, 8).toFixed(1) + "px");
    item.style.setProperty("--item-opacity", String(placement.opacity));
    item.style.width = asset.width + "px";
    item.style.height = asset.height + "px";
    item.setAttribute("aria-hidden", "true");

    const img = document.createElement("img");
    img.className = "theme-y2k-object-image";
    img.src = asset.src;
    img.alt = "";
    img.draggable = false;
    img.decoding = "async";
    img.addEventListener("error", () => item.remove(), { once: true });

    item.appendChild(img);
    themeBackground.appendChild(item);

    themeItems.push({ el: item, note: asset.note, last: 0 });
}

function overlaps(a, b, gap) {
    return !(
        a.right + gap <= b.left ||
        a.left >= b.right + gap ||
        a.bottom + gap <= b.top ||
        a.top >= b.bottom + gap
    );
}

function generatePlacements() {
    const vw = window.innerWidth || 1440;
    const vh = window.innerHeight || 900;
    const mobile = vw < 700;

    /*
     * Guaranteed visible slots.
     * These deliberately favor the left/right sides and bottom,
     * while keeping the title/header and busiest center clear.
     */
    const slots = [
        [7,22],[7,38],[7,54],[7,70],[7,84],
        [18,24],[18,46],[18,68],[18,84],

        [93,22],[93,38],[93,54],[93,70],[93,84],
        [82,24],[82,46],[82,68],[82,84],

        [27,24],[38,25],[62,25],[73,24],

        [25,82],[36,84],[48,83],[60,84],[72,82],

        [30,36],[70,36],[30,64],[70,64]
    ];

    const shuffled = shuffle(THEME_IMAGES);
    const selected = [];

    /*
     * Use every asset before repeating anything.
     * If there are more slots than unique assets, repeats are chosen
     * only after all unique images have had a chance to appear.
     */
    while (selected.length < slots.length) {
        const cycle = shuffle(THEME_IMAGES);
        for (const asset of cycle) {
            if (selected.length >= slots.length) break;
            selected.push(asset);
        }
    }

    return slots.map((slot, index) => {
        const asset = selected[index];
        const isInner = slot[0] >= 25 && slot[0] <= 75 && slot[1] >= 30 && slot[1] <= 68;

        const baseMin = mobile ? 0.78 : 0.92;
        const baseMax = mobile ? 0.96 : 1.16;
        const innerMin = mobile ? 0.64 : 0.76;
        const innerMax = mobile ? 0.80 : 0.92;

        return {
            asset,
            left: slot[0] + "%",
            top: slot[1] + "%",
            scale: Number(rand(
                isInner ? innerMin : baseMin,
                isInner ? innerMax : baseMax
            ).toFixed(3)),
            rotate: rand(-10, 10),
            opacity: isInner ? Number(rand(0.22, 0.32).toFixed(2)) : Number(rand(0.68, 0.86).toFixed(2)),
            soft: isInner,
            emphasis: !isInner
        };
    });
}

function createObjects() {
    generatePlacements().forEach((p) => addObject(p.asset, p));
}

function startInteraction() {
    const radius = 72;

    themeMouseHandler = (event) => {
        const now = performance.now();

        themeItems.forEach((obj) => {
            const r = obj.el.getBoundingClientRect();
            const cx = r.left + r.width / 2;
            const cy = r.top + r.height / 2;

            if (
                Math.hypot(cx - event.clientX, cy - event.clientY) <= radius &&
                now - obj.last > 650 &&
                now - lastGlobalSound > 110
            ) {
                obj.last = now;
                lastGlobalSound = now;

                obj.el.classList.remove("theme-y2k-react");
                void obj.el.offsetWidth;
                obj.el.classList.add("theme-y2k-react");
                playThemeSound(obj.note);

                setTimeout(() => obj.el.classList.remove("theme-y2k-react"), 520);
            }
        });
    };

    window.addEventListener("mousemove", themeMouseHandler, { passive: true });
}

export function mount() {
    if (themeBackground) return;

    themeStylesheet = document.createElement("link");
    themeStylesheet.rel = "stylesheet";
    themeStylesheet.href = "/themes/theme-y2k.css";
    themeStylesheet.dataset.theme = "y2k";
    document.head.appendChild(themeStylesheet);

    themeBackground = document.createElement("div");
    themeBackground.id = "y2k-background";
    themeBackground.setAttribute("aria-hidden", "true");
    document.body.appendChild(themeBackground);

    buildBackdrop();
    createObjects();
    startInteraction();
    playIntroSong();
}

export function unmount() {
    stopIntroSong();

    if (themeMouseHandler) {
        window.removeEventListener("mousemove", themeMouseHandler);
        themeMouseHandler = null;
    }

    themeItems = [];

    if (themeAudio) {
        themeAudio.close().catch(() => {});
        themeAudio = null;
    }

    if (themeBackground) {
        themeBackground.remove();
        themeBackground = null;
    }

    if (themeStylesheet) {
        themeStylesheet.remove();
        themeStylesheet = null;
    }
}
