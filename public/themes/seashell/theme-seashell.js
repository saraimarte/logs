/* ============================================================
   SEASHELL THEME
   - Uses all supplied /svg/theme-seashell assets
   - Pearly/oceanic background
   - Decorative objects are randomized each reload
   - Gentle floating animation at rest
   - Hover proximity causes shimmer/bob animation + soft chime
   - App layout, cursor, companions, tabs, and structure preserved
   ============================================================ */

let themeBackground = null;
let themeStylesheet = null;
let themeMouseHandler = null;
let themeItems = [];
let themeAudio = null;
let lastGlobalSound = 0;

const THEME_IMAGES = [
    { src: "/svg/theme-seashell/seashell-01-iridescent-conch-shell.svg", width: 138, height: 132, note: 523.25 },
    { src: "/svg/theme-seashell/seashell-02-pearl-butterfly-shell.svg", width: 142, height: 138, note: 554.37 },
    { src: "/svg/theme-seashell/seashell-03-iridescent-nautilus-shell.svg", width: 142, height: 142, note: 587.33 },
    { src: "/svg/theme-seashell/seashell-04-pearl-conch-shell.svg", width: 138, height: 132, note: 622.25 },
    { src: "/svg/theme-seashell/seashell-05-pastel-starfish.svg", width: 132, height: 132, note: 659.25 },
    { src: "/svg/theme-seashell/seashell-06-iridescent-rain-cloud.svg", width: 144, height: 122, note: 698.46 },
    { src: "/svg/theme-seashell/seashell-07-iridescent-pearl-orb.svg", width: 128, height: 128, note: 739.99 },
    { src: "/svg/theme-seashell/seashell-08-pearl-jellyfish.svg", width: 140, height: 152, note: 783.99 },
    { src: "/svg/theme-seashell/seashell-09-scallop-shell-bow.svg", width: 142, height: 136, note: 830.61 },
    { src: "/svg/theme-seashell/seashell-10-purple-pearl-starfish.svg", width: 132, height: 132, note: 880.0 },
    { src: "/svg/theme-seashell/seashell-11-pink-pearl-heart.svg", width: 128, height: 126, note: 932.33 },
    { src: "/svg/theme-seashell/seashell-12-iridescent-butterfly-shell.svg", width: 142, height: 138, note: 987.77 },
    { src: "/svg/theme-seashell/seashell-13-pearl-conch-shell.svg", width: 138, height: 132, note: 1046.5 },
    { src: "/svg/theme-seashell/seashell-14-iridescent-orchid-flower.svg", width: 146, height: 146, note: 1108.73 },
    { src: "/svg/theme-seashell/seashell-15-purple-glass-starfish.svg", width: 132, height: 132, note: 1174.66 },
    { src: "/svg/theme-seashell/seashell-16-pearl-oyster-shell.svg", width: 146, height: 134, note: 1244.51 },
    { src: "/svg/theme-seashell/seashell-17-rose-quartz-heart.svg", width: 128, height: 126, note: 1318.51 },
    { src: "/svg/theme-seashell/seashell-18-opal-orb.svg", width: 128, height: 128, note: 1396.91 }
];

const TOTAL_OBJECT_COUNT = 44;

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

function getAudio() {
    if (!themeAudio) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return null;
        themeAudio = new AudioCtx();
    }
    if (themeAudio.state === 'suspended') {
        themeAudio.resume().catch(() => {});
    }
    return themeAudio;
}

function playThemeSound(freq) {
    const ctx = getAudio();
    if (!ctx) return;

    const now = ctx.currentTime;
    const master = ctx.createGain();
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const osc3 = ctx.createOscillator();
    const g2 = ctx.createGain();
    const g3 = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(3600, now);
    filter.Q.setValueAtTime(0.6, now);

    master.gain.setValueAtTime(0.0001, now);
    master.gain.exponentialRampToValueAtTime(0.065, now + 0.01);
    master.gain.exponentialRampToValueAtTime(0.0001, now + 0.68);

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(freq, now);
    osc1.frequency.exponentialRampToValueAtTime(freq * 1.03, now + 0.22);

    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(freq * 1.5, now);
    g2.gain.setValueAtTime(0.08, now);
    g2.gain.exponentialRampToValueAtTime(0.0001, now + 0.40);

    osc3.type = 'sine';
    osc3.frequency.setValueAtTime(freq * 2, now + 0.03);
    g3.gain.setValueAtTime(0.05, now);
    g3.gain.exponentialRampToValueAtTime(0.0001, now + 0.52);

    osc1.connect(filter);
    osc2.connect(g2); g2.connect(filter);
    osc3.connect(g3); g3.connect(filter);
    filter.connect(master); master.connect(ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc3.start(now + 0.03);
    osc1.stop(now + 0.70);
    osc2.stop(now + 0.42);
    osc3.stop(now + 0.56);
}

function buildBackdrop() {
    const glow = document.createElement('div');
    glow.className = 'theme-seashell-glow';
    themeBackground.appendChild(glow);

    const tides = document.createElement('div');
    tides.className = 'theme-seashell-tides';
    themeBackground.appendChild(tides);

    const pearls = document.createElement('div');
    pearls.className = 'theme-seashell-pearls';
    themeBackground.appendChild(pearls);

    const foam = document.createElement('div');
    foam.className = 'theme-seashell-foam';
    themeBackground.appendChild(foam);

    const shore = document.createElement('div');
    shore.className = 'theme-seashell-shore';
    themeBackground.appendChild(shore);
}

function addObject(asset, placement) {
    const item = document.createElement('div');
    item.className = 'theme-seashell-item' +
        (placement.soft ? ' theme-seashell-soft' : '') +
        (placement.emphasis ? ' theme-seashell-emphasis' : '');

    item.style.left = placement.left;
    item.style.top = placement.top;
    item.style.width = asset.width + 'px';
    item.style.height = asset.height + 'px';
    item.style.setProperty('--item-scale', placement.scale);
    item.style.setProperty('--item-rotate', placement.rotate + 'deg');
    item.style.setProperty('--item-delay', (-rand(0, 8)).toFixed(2) + 's');
    item.style.setProperty('--item-x', rand(-12, 12).toFixed(1) + 'px');
    item.style.setProperty('--item-y', rand(-9, 9).toFixed(1) + 'px');
    item.style.setProperty('--item-opacity', String(placement.opacity));
    item.style.setProperty('--item-duration', rand(7.2, 10.4).toFixed(2) + 's');
    item.setAttribute('aria-hidden', 'true');

    const img = document.createElement('img');
    img.className = 'theme-seashell-object-image';
    img.src = asset.src;
    img.alt = '';
    img.draggable = false;
    img.decoding = 'async';
    img.addEventListener('error', () => item.remove(), { once: true });

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
    const mobile = (window.innerWidth || 1440) < 700;

    /*
     * GUARANTEED DENSE PLACEMENT:
     * no collision-rejection loop, so we always get a full screen
     * instead of ending up with only 5–6 visible objects.
     */
    const slots = shuffle([
        [5,17,false],[6,29,false],[6,41,false],[6,53,false],[6,65,false],[6,78,false],[8,88,false],
        [15,22,false],[15,36,false],[15,50,false],[15,66,false],[16,82,false],

        [95,17,false],[94,29,false],[94,41,false],[94,53,false],[94,65,false],[94,78,false],[92,88,false],
        [85,22,false],[85,36,false],[85,50,false],[85,66,false],[84,82,false],

        [24,20,false],[35,22,false],[47,22,false],[59,22,false],[71,20,false],

        [21,84,false],[31,87,false],[42,84,false],[53,87,false],[64,84,false],[75,87,false],

        [24,34,true],[34,38,true],[66,38,true],[76,34,true],
        [24,58,true],[34,64,true],[66,64,true],[76,58,true],
        [44,34,true],[56,34,true],[44,69,true],[56,69,true]
    ]);

    const pool = [];
    while (pool.length < TOTAL_OBJECT_COUNT) {
        const cycle = shuffle(THEME_IMAGES);
        for (const asset of cycle) {
            if (pool.length >= TOTAL_OBJECT_COUNT) break;
            pool.push(asset);
        }
    }

    return slots.slice(0, TOTAL_OBJECT_COUNT).map((slot, index) => {
        const soft = slot[2];

        const scale = mobile
            ? rand(soft ? 0.66 : 0.82, soft ? 0.82 : 1.02)
            : rand(soft ? 0.78 : 0.98, soft ? 0.96 : 1.22);

        return {
            asset: pool[index],
            left: slot[0] + "%",
            top: slot[1] + "%",
            scale: Number(scale.toFixed(3)),
            rotate: rand(-14, 14),
            opacity: soft
                ? Number(rand(0.55, 0.72).toFixed(2))
                : Number(rand(0.88, 1.00).toFixed(2)),
            soft,
            emphasis: !soft
        };
    });
}

function createObjects() {
    generatePlacements().forEach((placement) => addObject(placement.asset, placement));
}

function startInteraction() {
    const radius = 76;

    themeMouseHandler = (event) => {
        const now = performance.now();

        themeItems.forEach((obj) => {
            const r = obj.el.getBoundingClientRect();
            const cx = r.left + r.width / 2;
            const cy = r.top + r.height / 2;

            if (
                Math.hypot(cx - event.clientX, cy - event.clientY) <= radius &&
                now - obj.last > 650 &&
                now - lastGlobalSound > 120
            ) {
                obj.last = now;
                lastGlobalSound = now;
                obj.el.classList.remove('theme-seashell-react');
                void obj.el.offsetWidth;
                obj.el.classList.add('theme-seashell-react');
                playThemeSound(obj.note);
                setTimeout(() => obj.el.classList.remove('theme-seashell-react'), 560);
            }
        });
    };

    window.addEventListener('mousemove', themeMouseHandler, { passive: true });
}

function seashellOriginalMount() {
    if (themeBackground) return;

    themeStylesheet = document.createElement('link');
    themeStylesheet.rel = 'stylesheet';
    themeStylesheet.href = '/themes/theme-seashell.css';
    themeStylesheet.dataset.theme = 'seashell';
    document.head.appendChild(themeStylesheet);

    themeBackground = document.createElement('div');
    themeBackground.id = 'seashell-background';
    themeBackground.setAttribute('aria-hidden', 'true');
    document.body.appendChild(themeBackground);

    buildBackdrop();
    createObjects();
    startInteraction();
}

function seashellOriginalUnmount() {
    if (themeMouseHandler) {
        window.removeEventListener('mousemove', themeMouseHandler);
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


/* ============================================================
   INTRO AUDIO ADDITION
   ============================================================ */
let seashellIntroAudio = null;
let seashellIntroFallback = null;
let seashellIntroTimer = null;
const SEASHELL_INTRO_SRC = "/sounds/intros/alexguz-surf-rock-155127.mp3";
const SEASHELL_INTRO_VOLUME = 0.3;
const SEASHELL_INTRO_END = 66;
const SEASHELL_INTRO_FADE_START = 60;
const SEASHELL_INTRO_FULL = false;
const SEASHELL_INTRO_FADE_END = false;

function seashellClearIntroFallback() {
    if (!seashellIntroFallback) return;
    window.removeEventListener("pointerdown", seashellIntroFallback);
    window.removeEventListener("keydown", seashellIntroFallback);
    seashellIntroFallback = null;
}

function seashellStopIntro() {
    if (seashellIntroTimer) {
        clearInterval(seashellIntroTimer);
        seashellIntroTimer = null;
    }
    seashellClearIntroFallback();
    document.body.classList.remove("theme-seashell-intro-playing");
    if (seashellIntroAudio) {
        try {
            seashellIntroAudio.pause();
            seashellIntroAudio.currentTime = 0;
        } catch (_) {}
    }
    seashellIntroAudio = null;
}

function seashellPlayIntro() {
    seashellStopIntro();
    const audio = new Audio(SEASHELL_INTRO_SRC);
    seashellIntroAudio = audio;
    audio.preload = "auto";
    audio.volume = SEASHELL_INTRO_VOLUME;

    audio.addEventListener("playing", () => {
        document.body.classList.add("theme-seashell-intro-playing");
        seashellClearIntroFallback();
    });

    audio.addEventListener("ended", () => {
        seashellStopIntro();
    }, { once: true });

    audio.addEventListener("error", () => {
        seashellStopIntro();
    }, { once: true });

    seashellIntroTimer = setInterval(() => {
        if (seashellIntroAudio !== audio) return;
        const t = audio.currentTime || 0;

        if (SEASHELL_INTRO_END != null) {
            if (SEASHELL_INTRO_FADE_START != null && t >= SEASHELL_INTRO_FADE_START) {
                const len = Math.max(.001, SEASHELL_INTRO_END - SEASHELL_INTRO_FADE_START);
                const p = Math.min(1, (t - SEASHELL_INTRO_FADE_START) / len);
                audio.volume = Math.max(0, SEASHELL_INTRO_VOLUME * (1 - p));
            }
            if (t >= SEASHELL_INTRO_END) {
                seashellStopIntro();
            }
        } else if (SEASHELL_INTRO_FULL && SEASHELL_INTRO_FADE_END &&
                   Number.isFinite(audio.duration) && audio.duration > 0) {
            const remaining = audio.duration - t;
            if (remaining <= 3) {
                audio.volume = Math.max(0, SEASHELL_INTRO_VOLUME * (remaining / 3));
            }
        }
    }, 120);

    const p = audio.play();
    if (p && typeof p.catch === "function") {
        p.catch(() => {
            if (seashellIntroFallback || seashellIntroAudio !== audio) return;
            seashellIntroFallback = () => {
                if (seashellIntroAudio !== audio) return;
                const retry = audio.play();
                if (retry && typeof retry.catch === "function") retry.catch(() => {});
            };
            window.addEventListener("pointerdown", seashellIntroFallback);
            window.addEventListener("keydown", seashellIntroFallback);
        });
    }
}

export function mount() {
    seashellOriginalMount();
    seashellPlayIntro();
}

export function unmount() {
    seashellStopIntro();
    seashellOriginalUnmount();
}
