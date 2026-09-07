
/* ============================================================
   FITNESS THEME
   - Uses all /svg/theme-fitness assets
   - SVGs are large and distributed differently on every mount
   - Avoids the day-log title area
   - Decorative layer stays behind the app UI
   - Continuous idle animation + stronger hover reaction
   - Meow sounds rotate without immediate repeats
   - Active sound fades out on leave and never overlaps
   ============================================================ */

let themeBackground = null;
let themeStylesheet = null;
let themeMouseHandler = null;
let themeWindowLeaveHandler = null;
let themeResizeHandler = null;
let themeItems = [];
let currentHoverKey = null;
let activeSound = null;
let soundBag = [];
let lastPlayedSound = null;
let soundRequestToken = 0;

let fitnessIntroAudio = null;
let fitnessIntroFinished = false;
let fitnessIntroFadeFrame = null;
let fitnessIntroFallbackHandler = null;

const FITNESS_INTRO_SRC =
    "/sounds/intros/vaitsez-hard-hard-trap-beat-582809.mp3";
const FITNESS_INTRO_END = 20;
const FITNESS_INTRO_FADE_START = 15;
const FITNESS_INTRO_VOLUME = 0.30;

const THEME_IMAGES = [
    { key: "fitness-01-orange-tabby-dumbbell", src: "/svg/theme-fitness/fitness-01-orange-tabby-dumbbell.svg", width: 239, height: 239 },
    { key: "fitness-02-hamster-headphones-weight-plate", src: "/svg/theme-fitness/fitness-02-hamster-headphones-weight-plate.svg", width: 224, height: 224 },
    { key: "fitness-03-kitten-barbell-belt", src: "/svg/theme-fitness/fitness-03-kitten-barbell-belt.svg", width: 242, height: 242 },
    { key: "fitness-04-gray-cat-headphones-barbell", src: "/svg/theme-fitness/fitness-04-gray-cat-headphones-barbell.svg", width: 244, height: 244 },
    { key: "fitness-05-kitten-barbell-lift", src: "/svg/theme-fitness/fitness-05-kitten-barbell-lift.svg", width: 239, height: 239 },
    { key: "fitness-06-hamster-cap-dumbbells", src: "/svg/theme-fitness/fitness-06-hamster-cap-dumbbells.svg", width: 224, height: 224 },
    { key: "fitness-07-muscular-gray-cat", src: "/svg/theme-fitness/fitness-07-muscular-gray-cat.svg", width: 234, height: 234 },
    { key: "fitness-08-mouse-striped-shirt-dumbbells", src: "/svg/theme-fitness/fitness-08-mouse-striped-shirt-dumbbells.svg", width: 216, height: 216 },
    { key: "fitness-09-kitten-cap-headphones-dumbbells", src: "/svg/theme-fitness/fitness-09-kitten-cap-headphones-dumbbells.svg", width: 237, height: 237 }
];

const SOUND_PATHS = [
    "/sounds/fitness/dragon-studio-cute-cat-meow-472372.mp3",
    "/sounds/fitness/sound_garage-cat-meow-7-fx-306186.mp3",
    "/sounds/fitness/sound_garage-cat-meow-8-fx-306184.mp3",
    "/sounds/fitness/sound_garage-cat-meow-9-fx-306185.mp3",
    "/sounds/fitness/46268990-funny-cat-meow-246012.mp3"
];

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


function clearFitnessIntroFallback() {
    if (!fitnessIntroFallbackHandler) return;

    [
        "pointerdown",
        "pointerup",
        "click",
        "touchend",
        "keydown",
        "keyup"
    ].forEach((eventName) => {
        document.removeEventListener(
            eventName,
            fitnessIntroFallbackHandler
        );
    });

    fitnessIntroFallbackHandler = null;
}

function stopFitnessIntro() {
    clearFitnessIntroFallback();

    if (fitnessIntroFadeFrame) {
        cancelAnimationFrame(fitnessIntroFadeFrame);
        fitnessIntroFadeFrame = null;
    }

    if (!fitnessIntroAudio) return;

    try {
        fitnessIntroAudio.pause();
        fitnessIntroAudio.currentTime = 0;
        fitnessIntroAudio.volume = FITNESS_INTRO_VOLUME;
    } catch (_) {}

    fitnessIntroAudio = null;
}

function playFitnessIntro() {
    stopFitnessIntro();

    /*
     * Keep cat hover sounds locked until the intro has either completed
     * or failed to load.
     */
    fitnessIntroFinished = false;

    /*
     * Defensive cleanup in case the theme is remounted while a cat sound
     * is still fading.
     */
    stopActiveSound(80);

    const audio = new Audio();
    fitnessIntroAudio = audio;

    audio.src = FITNESS_INTRO_SRC;
    audio.preload = "auto";
    audio.autoplay = true;
    audio.playsInline = true;
    audio.loop = false;
    audio.volume = FITNESS_INTRO_VOLUME;
    audio.load();

    const finishIntro = () => {
        if (fitnessIntroAudio !== audio) return;

        if (fitnessIntroFadeFrame) {
            cancelAnimationFrame(fitnessIntroFadeFrame);
            fitnessIntroFadeFrame = null;
        }

        try {
            audio.pause();
            audio.currentTime = FITNESS_INTRO_END;
            audio.volume = 0;
        } catch (_) {}

        fitnessIntroFinished = true;
    };

    const fadeLoop = () => {
        if (fitnessIntroAudio !== audio) return;

        const time = audio.currentTime || 0;

        if (time >= FITNESS_INTRO_END) {
            finishIntro();
            return;
        }

        if (time >= FITNESS_INTRO_FADE_START) {
            const fadeLength =
                FITNESS_INTRO_END - FITNESS_INTRO_FADE_START;
            const remaining =
                Math.max(0, FITNESS_INTRO_END - time);

            audio.volume =
                FITNESS_INTRO_VOLUME *
                (remaining / fadeLength);
        } else {
            audio.volume = FITNESS_INTRO_VOLUME;
        }

        fitnessIntroFadeFrame =
            requestAnimationFrame(fadeLoop);
    };

    audio.addEventListener("playing", () => {
        if (
            fitnessIntroAudio === audio &&
            !fitnessIntroFadeFrame
        ) {
            fitnessIntroFadeFrame =
                requestAnimationFrame(fadeLoop);
        }
    });

    /*
     * If the file is missing, do not permanently block the cat sounds.
     */
    audio.addEventListener(
        "error",
        () => {
            if (fitnessIntroAudio !== audio) return;

            if (fitnessIntroFadeFrame) {
                cancelAnimationFrame(fitnessIntroFadeFrame);
                fitnessIntroFadeFrame = null;
            }

            fitnessIntroFinished = true;
        },
        { once: true }
    );

    const tryPlay = () => {
        if (fitnessIntroAudio !== audio) return;

        const promise = audio.play();

        if (
            promise &&
            typeof promise.catch === "function"
        ) {
            promise.catch(() => {
                if (fitnessIntroFallbackHandler) return;

                /*
                 * Browser autoplay can be blocked. Retry on the user's
                 * first interaction, while keeping cat sounds locked.
                 */
                fitnessIntroFallbackHandler = () => {
                    const handler = fitnessIntroFallbackHandler;

                    [
                        "pointerdown",
                        "pointerup",
                        "click",
                        "touchend",
                        "keydown",
                        "keyup"
                    ].forEach((eventName) => {
                        document.removeEventListener(
                            eventName,
                            handler
                        );
                    });

                    fitnessIntroFallbackHandler = null;

                    if (fitnessIntroAudio !== audio) return;

                    audio.volume = FITNESS_INTRO_VOLUME;

                    const retry = audio.play();

                    if (
                        retry &&
                        typeof retry.catch === "function"
                    ) {
                        retry.catch(() => {});
                    }
                };

                [
                    "pointerdown",
                    "pointerup",
                    "click",
                    "touchend",
                    "keydown",
                    "keyup"
                ].forEach((eventName) => {
                    document.addEventListener(
                        eventName,
                        fitnessIntroFallbackHandler,
                        { once: true }
                    );
                });
            });
        }
    };

    tryPlay();
}

function refillSoundBag() {
    soundBag = shuffle(SOUND_PATHS);
    if (lastPlayedSound && soundBag.length > 1 && soundBag[0] === lastPlayedSound) {
        const altIndex = soundBag.findIndex((s) => s !== lastPlayedSound);
        if (altIndex > 0) {
            [soundBag[0], soundBag[altIndex]] = [soundBag[altIndex], soundBag[0]];
        }
    }
}

function getNextSoundPath() {
    if (!soundBag.length) refillSoundBag();
    const next = soundBag.shift();
    lastPlayedSound = next;
    return next;
}

function stopActiveSound(fadeMs = 260) {
    return new Promise((resolve) => {
        if (!activeSound || !activeSound.audio) {
            activeSound = null;
            resolve();
            return;
        }

        const entry = activeSound;
        const audio = entry.audio;
        const startVolume = typeof audio.volume === 'number' ? audio.volume : 0.48;
        const startedAt = performance.now();

        if (entry.fadeTimer) clearInterval(entry.fadeTimer);

        entry.fadeTimer = setInterval(() => {
            const elapsed = performance.now() - startedAt;
            const progress = Math.min(1, elapsed / fadeMs);
            try {
                audio.volume = Math.max(0, startVolume * (1 - progress));
            } catch (_) {}

            if (progress >= 1) {
                clearInterval(entry.fadeTimer);
                entry.fadeTimer = null;
                try {
                    audio.pause();
                    audio.currentTime = 0;
                } catch (_) {}
                if (activeSound === entry) activeSound = null;
                resolve();
            }
        }, 32);
    });
}

async function playRotatingSoundFor(itemKey) {
    /*
     * Visual hover reactions still happen during the intro, but cat
     * sounds are completely locked until the intro finishes.
     */
    if (!fitnessIntroFinished) return;

    const token = ++soundRequestToken;

    if (activeSound && activeSound.audio) {
        await stopActiveSound(120);
    }

    if (token !== soundRequestToken) return;

    const src = getNextSoundPath();

    try {
        const audio = new Audio(src);
        audio.preload = 'auto';
        audio.volume = 0.42;
        audio.loop = false;

        const entry = { key: itemKey, audio, fadeTimer: null };
        activeSound = entry;

        audio.addEventListener('ended', () => {
            if (activeSound === entry) activeSound = null;
        }, { once: true });

        audio.play().catch(() => {
            if (activeSound === entry) activeSound = null;
        });
    } catch (_) {
        activeSound = null;
    }
}

function buildBackdrop() {
    const layerClasses = [
        'theme-fitness-gradient',
        'theme-fitness-rays',
        'theme-fitness-rings',
        'theme-fitness-grid',
        'theme-fitness-track',
        'theme-fitness-floor',
        'theme-fitness-sparkles'
    ];

    layerClasses.forEach((className) => {
        const el = document.createElement('div');
        el.className = className;
        themeBackground.appendChild(el);
    });
}

function createObject(asset, slot) {
    const item = document.createElement('div');
    item.className = 'theme-fitness-item' + (slot.soft ? ' theme-fitness-soft' : ' theme-fitness-emphasis');
    item.dataset.itemKey = asset.key;
    item.style.left = slot.left;
    item.style.top = slot.top;
    item.style.width = asset.width + 'px';
    item.style.height = asset.height + 'px';
    item.style.setProperty('--item-scale', String(slot.scale));
    item.style.setProperty('--item-rotate', slot.rotate + 'deg');
    item.style.setProperty('--item-delay', (-rand(0, 8)).toFixed(2) + 's');
    item.style.setProperty('--item-x', rand(-14, 14).toFixed(1) + 'px');
    item.style.setProperty('--item-y', rand(-12, 12).toFixed(1) + 'px');
    item.style.setProperty('--item-duration', rand(5.8, 8.8).toFixed(2) + 's');
    item.style.setProperty('--item-opacity', slot.soft ? rand(0.44, 0.62).toFixed(2) : rand(0.92, 1.0).toFixed(2));
    item.setAttribute('aria-hidden', 'true');

    const img = document.createElement('img');
    img.className = 'theme-fitness-object-image';
    img.src = asset.src;
    img.alt = '';
    img.draggable = false;
    img.decoding = 'async';
    img.addEventListener('error', () => item.remove(), { once: true });

    item.appendChild(img);
    themeBackground.appendChild(item);
    themeItems.push({ key: asset.key, el: item, lastTrigger: 0 });
}

function getTitleSafeRect() {
    const fallbackWidth = window.innerWidth || 1440;
    const fallbackHeight = window.innerHeight || 900;

    const selectors = [
        '.log-header-container',
        '#current-date-title',
        '.view.active .log-header-container',
        '.view.active #current-date-title'
    ];

    for (const selector of selectors) {
        const node = document.querySelector(selector);
        if (!node) continue;

        const r = node.getBoundingClientRect();
        if (r.width > 20 && r.height > 12) {
            return {
                left: Math.max(0, r.left - 60),
                right: Math.min(fallbackWidth, r.right + 60),
                top: Math.max(0, r.top - 22),
                bottom: Math.min(fallbackHeight, r.bottom + 26)
            };
        }
    }

    return {
        left: fallbackWidth * 0.25,
        right: fallbackWidth * 0.75,
        top: 0,
        bottom: fallbackHeight * 0.18
    };
}

function rectsOverlap(a, b, gap = 0) {
    return !(
        a.right + gap <= b.left ||
        a.left >= b.right + gap ||
        a.bottom + gap <= b.top ||
        a.top >= b.bottom + gap
    );
}

function buildCandidateAnchors() {
    const mobile = (window.innerWidth || 1440) < 700;
    const cols = mobile ? [12, 37, 63, 88] : [10, 30, 50, 70, 90];
    const rows = mobile ? [16, 36, 58, 80] : [16, 35, 56, 78];
    const titleRect = getTitleSafeRect();
    const width = window.innerWidth || 1440;
    const height = window.innerHeight || 900;

    const anchors = [];

    rows.forEach((row) => {
        cols.forEach((col) => {
            const cx = width * (col / 100);
            const cy = height * (row / 100);

            if (
                cx >= titleRect.left - 40 &&
                cx <= titleRect.right + 40 &&
                cy >= titleRect.top - 10 &&
                cy <= titleRect.bottom + 22
            ) {
                return;
            }

            anchors.push({ left: col, top: row });
        });
    });

    return shuffle(anchors);
}

function generateSlotsForAssets(assets) {
    const mobile = (window.innerWidth || 1440) < 700;
    const viewportWidth = window.innerWidth || 1440;
    const viewportHeight = window.innerHeight || 900;
    const titleRect = getTitleSafeRect();
    const anchors = buildCandidateAnchors();
    const placed = [];
    const slots = [];

    assets.forEach((asset, index) => {
        const soft = index % 4 === 0;
        let picked = null;

        const isCat = /cat|kitten|tabby/i.test(asset.key);
        const catAnchors = anchors.filter((anchor) =>
            (anchor.left <= 30 || anchor.left >= 70) &&
            anchor.top >= 35
        );
        const candidateList = shuffle(
            isCat && catAnchors.length ? catAnchors : anchors
        );

        for (const anchor of candidateList) {
            const jitterX = mobile ? rand(-4.0, 4.0) : rand(-5.8, 5.8);
            const jitterY = mobile ? rand(-3.5, 3.5) : rand(-4.6, 4.6);
            const scale = mobile
                ? rand(0.90, soft ? 1.00 : 1.08)
                : rand(1.02, soft ? 1.12 : 1.22);

            const leftPct = anchor.left + jitterX;
            const topPct = anchor.top + jitterY;
            const width = asset.width * scale;
            const height = asset.height * scale;
            const cx = viewportWidth * (leftPct / 100);
            const cy = viewportHeight * (topPct / 100);

            const rect = {
                left: cx - width / 2,
                right: cx + width / 2,
                top: cy - height / 2,
                bottom: cy + height / 2
            };

            const margin = mobile ? 8 : 16;

            if (
                rect.left < margin ||
                rect.right > viewportWidth - margin ||
                rect.top < margin ||
                rect.bottom > viewportHeight - margin
            ) {
                continue;
            }

            if (rectsOverlap(rect, titleRect, 12)) continue;

            const intersectsPlaced = placed.some((other) => rectsOverlap(rect, other.rect, 18));
            if (intersectsPlaced) continue;

            picked = {
                left: leftPct.toFixed(2) + '%',
                top: topPct.toFixed(2) + '%',
                scale: Number(scale.toFixed(3)),
                rotate: rand(-8, 8),
                soft,
                rect
            };
            break;
        }

        if (!picked) {
            for (let attempt = 0; attempt < 240 && !picked; attempt++) {
                const scale = mobile
                    ? rand(0.88, soft ? 0.98 : 1.06)
                    : rand(0.98, soft ? 1.08 : 1.18);

                const width = asset.width * scale;
                const height = asset.height * scale;
                let cx;
                let cy;

                if (isCat) {
                    const sideLeft = Math.random() < 0.5;
                    const minCenterX = width / 2 + 10;
                    const maxCenterX = viewportWidth - width / 2 - 10;

                    const leftMax = Math.max(minCenterX, viewportWidth * 0.30);
                    const rightMin = Math.min(maxCenterX, viewportWidth * 0.70);

                    cx = sideLeft
                        ? rand(minCenterX, leftMax)
                        : rand(rightMin, maxCenterX);

                    const minCatY = Math.max(height / 2 + 10, viewportHeight * 0.42);
                    const maxCatY = viewportHeight - height / 2 - 10;
                    cy = rand(minCatY, maxCatY);
                } else {
                    cx = rand(width / 2 + 10, viewportWidth - width / 2 - 10);
                    cy = rand(height / 2 + 10, viewportHeight - height / 2 - 10);
                }

                const rect = {
                    left: cx - width / 2,
                    right: cx + width / 2,
                    top: cy - height / 2,
                    bottom: cy + height / 2
                };

                if (rectsOverlap(rect, titleRect, 12)) continue;
                if (placed.some((other) => rectsOverlap(rect, other.rect, 16))) continue;

                picked = {
                    left: ((cx / viewportWidth) * 100).toFixed(2) + '%',
                    top: ((cy / viewportHeight) * 100).toFixed(2) + '%',
                    scale: Number(scale.toFixed(3)),
                    rotate: rand(-8, 8),
                    soft,
                    rect
                };
            }
        }

        if (!picked) {
            const scale = mobile ? 0.95 : 1.04;
            picked = isCat ? {
                left: (index % 2 === 0 ? 12 : 88).toFixed(2) + '%',
                top: Math.min(84, 48 + (Math.floor(index / 2) * 10)).toFixed(2) + '%',
                scale: Number(scale.toFixed(3)),
                rotate: rand(-6, 6),
                soft,
                rect: { left: 0, top: 0, right: 0, bottom: 0 }
            } : {
                left: (10 + ((index % 3) * 34)).toFixed(2) + '%',
                top: (24 + (Math.floor(index / 3) * 22)).toFixed(2) + '%',
                scale: Number(scale.toFixed(3)),
                rotate: rand(-6, 6),
                soft,
                rect: { left: 0, top: 0, right: 0, bottom: 0 }
            };
        }

        placed.push(picked);
        slots.push(picked);
    });

    return slots;
}

function clearObjects() {
    themeItems.forEach((entry) => entry.el.remove());
    themeItems = [];
    currentHoverKey = null;
}

function createObjects() {
    const assets = shuffle(THEME_IMAGES);
    const slots = generateSlotsForAssets(assets);
    slots.forEach((slot, index) => createObject(assets[index], slot));
}

function rebuildObjects() {
    if (!themeBackground) return;
    clearObjects();
    createObjects();
}

function applyReactAnimation(item) {
    item.classList.remove('theme-fitness-react');
    void item.offsetWidth;
    item.classList.add('theme-fitness-react');
    setTimeout(() => item.classList.remove('theme-fitness-react'), 560);
}

function startInteraction() {
    const radius = 105;

    themeMouseHandler = (event) => {
        const now = performance.now();
        let nearest = null;
        let nearestDistance = Infinity;

        themeItems.forEach((obj) => {
            const r = obj.el.getBoundingClientRect();
            const cx = r.left + r.width / 2;
            const cy = r.top + r.height / 2;
            const distance = Math.hypot(cx - event.clientX, cy - event.clientY);
            if (distance <= radius && distance < nearestDistance) {
                nearest = obj;
                nearestDistance = distance;
            }
        });

        if (!nearest) {
            currentHoverKey = null;
            stopActiveSound(260);
            return;
        }

        if (currentHoverKey !== nearest.key) {
            currentHoverKey = nearest.key;
            applyReactAnimation(nearest.el);
            playRotatingSoundFor(nearest.key);
            nearest.lastTrigger = now;
            return;
        }

        if (now - nearest.lastTrigger > 900) {
            applyReactAnimation(nearest.el);
            nearest.lastTrigger = now;
        }
    };

    themeWindowLeaveHandler = () => {
        currentHoverKey = null;
        stopActiveSound(280);
    };

    themeResizeHandler = () => {
        rebuildObjects();
    };

    window.addEventListener('mousemove', themeMouseHandler, { passive: true });
    window.addEventListener('mouseleave', themeWindowLeaveHandler);
    window.addEventListener('resize', themeResizeHandler, { passive: true });
}

export function mount() {
    if (themeBackground) return;

    themeStylesheet = document.createElement('link');
    themeStylesheet.rel = 'stylesheet';
    themeStylesheet.href = '/themes/theme-fitness.css';
    themeStylesheet.dataset.theme = 'fitness';
    document.head.appendChild(themeStylesheet);

    themeBackground = document.createElement('div');
    themeBackground.id = 'fitness-background';
    themeBackground.setAttribute('aria-hidden', 'true');
    document.body.appendChild(themeBackground);

    playFitnessIntro();

    buildBackdrop();
    createObjects();
    startInteraction();
}

export function unmount() {
    stopFitnessIntro();
    fitnessIntroFinished = false;

    if (themeMouseHandler) {
        window.removeEventListener('mousemove', themeMouseHandler);
        themeMouseHandler = null;
    }
    if (themeWindowLeaveHandler) {
        window.removeEventListener('mouseleave', themeWindowLeaveHandler);
        themeWindowLeaveHandler = null;
    }
    if (themeResizeHandler) {
        window.removeEventListener('resize', themeResizeHandler);
        themeResizeHandler = null;
    }

    currentHoverKey = null;
    stopActiveSound(120);
    themeItems = [];
    soundBag = [];
    lastPlayedSound = null;
    soundRequestToken = 0;

    if (themeBackground) {
        themeBackground.remove();
        themeBackground = null;
    }
    if (themeStylesheet) {
        themeStylesheet.remove();
        themeStylesheet = null;
    }
}
