
/* ============================================================
   AQUARIUM THEME — ENHANCED
   - More animals visible immediately
   - Cursor contact makes an animal turn around in place
   - Lightweight animated water details
   - Does not touch app layout, cursor system, companions, or tabs
   ============================================================ */

let aquariumRoot = null;
let aquariumStylesheet = null;
let aquariumMouseHandler = null;
let aquariumResizeHandler = null;
let aquariumAnimals = [];

let aquariumHoverAudio = null;
let aquariumLastHoverSoundAt = 0;

let aquariumIntroAudio = null;
let aquariumIntroFinished = true;
let aquariumIntroFallback = null;

const AQUARIUM_INTRO_SRC =
    "/sounds/intros/dragon-studio-ocean-waves-376898.mp3";
const AQUARIUM_INTRO_VOLUME = 0.32;

function removeAquariumIntroFallback() {
    if (!aquariumIntroFallback) return;
    window.removeEventListener("pointerdown", aquariumIntroFallback);
    window.removeEventListener("keydown", aquariumIntroFallback);
    aquariumIntroFallback = null;
}

function finishAquariumIntro() {
    aquariumIntroFinished = true;
    removeAquariumIntroFallback();

    if (aquariumIntroAudio) {
        try {
            aquariumIntroAudio.pause();
            aquariumIntroAudio.currentTime = 0;
        } catch (_) {}
    }

    aquariumIntroAudio = null;
}

function playAquariumIntro() {
    finishAquariumIntro();
    aquariumIntroFinished = false;

    const audio = new Audio(AQUARIUM_INTRO_SRC);
    aquariumIntroAudio = audio;
    audio.preload = "auto";
    audio.volume = AQUARIUM_INTRO_VOLUME;

    audio.addEventListener("ended", finishAquariumIntro, { once: true });
    audio.addEventListener("error", finishAquariumIntro, { once: true });
    audio.addEventListener("playing", removeAquariumIntroFallback);

    const attempt = () => {
        if (aquariumIntroAudio !== audio) return;

        const promise = audio.play();
        if (promise && typeof promise.catch === "function") {
            promise.catch(() => {
                if (aquariumIntroFallback || aquariumIntroAudio !== audio) return;

                aquariumIntroFallback = () => {
                    if (aquariumIntroAudio !== audio) return;
                    const retry = audio.play();
                    if (retry && typeof retry.catch === "function") {
                        retry.catch(() => {});
                    }
                };

                window.addEventListener("pointerdown", aquariumIntroFallback);
                window.addEventListener("keydown", aquariumIntroFallback);
            });
        }
    };

    attempt();
}

const AQUARIUM_HOVER_SOUND =
    '/sounds/aquarium/freesound_community-bubbles-03-91268.mp3';
const AQUARIUM_HOVER_VOLUME = 0.34;
const AQUARIUM_HOVER_GLOBAL_COOLDOWN = 450;

const ASSET_ROOT = '/svg/theme-aquarium/';

let AQUARIUM_ASSETS = [];

const FALLBACK_ASSETS = [
    'angelfish1 (2).svg', 'dolphin2 (2).svg', 'hammerhead.svg', 'pufferfish.svg',
    'ray2 (2).svg', 'seahorse2 (2).svg', 'shark-1.svg', 'tropicalfish1 (2).svg',
    'turtle.svg', 'whale-1.svg', 'whale-2.svg', 'whale2 (2).svg', 'whaleshark1 (2).svg'
];

async function discoverAquariumAssets() {
    try {
        const response = await fetch('/api/theme-aquarium-assets', { cache: 'no-store' });
        if (response.ok) {
            const data = await response.json();
            const files = Array.isArray(data) ? data : data.files;
            if (Array.isArray(files)) {
                const svgFiles = files.map(String).filter(name => /\.svg$/i.test(name));
                if (svgFiles.length) {
                    return [...new Set(svgFiles.map(name => name.split('/').pop()))];
                }
            }
        }
    } catch (_) {}

    try {
        const response = await fetch(ASSET_ROOT, { cache: 'no-store' });
        if (!response.ok) throw new Error(`Asset directory returned ${response.status}`);
        const html = await response.text();
        const doc = new DOMParser().parseFromString(html, 'text/html');
        const files = [...doc.querySelectorAll('a[href]')]
            .map(a => a.getAttribute('href') || '')
            .map(href => decodeURIComponent(href.split('?')[0].split('#')[0]))
            .map(href => href.split('/').pop())
            .filter(name => /\.svg$/i.test(name));

        if (files.length) return [...new Set(files)];
    } catch (_) {}

    return FALLBACK_ASSETS.slice();
}

function classifyAsset(file) {
    const name = file.toLowerCase();

    if (/whale|shark|dolphin|hammerhead|orca|swordfish|marlin|tuna|barracuda|sailfish|narwhal|seal|penguin|large[-_]?fish|fish[-_]?large/.test(name)) {
        return 'swimmer';
    }

    return 'floater';
}

function shuffle(items) {
    const copy = items.slice();

    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }

    return copy;
}

function assetUrl(file) {
    return `${ASSET_ROOT}${encodeURIComponent(file)}`;
}

function stopAquariumHoverSound() {
    if (!aquariumHoverAudio) return;

    try {
        aquariumHoverAudio.pause();
        aquariumHoverAudio.currentTime = 0;
    } catch (_) {}

    aquariumHoverAudio = null;
}

function playAquariumHoverSound() {
    if (!aquariumIntroFinished) return;
    const now = performance.now();

    if (
        now - aquariumLastHoverSoundAt <
        AQUARIUM_HOVER_GLOBAL_COOLDOWN
    ) {
        return;
    }

    aquariumLastHoverSoundAt = now;

    // Keep the effect clean if the cursor crosses several animals quickly.
    stopAquariumHoverSound();

    const audio = new Audio();
    aquariumHoverAudio = audio;

    audio.src = AQUARIUM_HOVER_SOUND;
    audio.preload = 'auto';
    audio.volume = AQUARIUM_HOVER_VOLUME;
    audio.loop = false;

    audio.addEventListener(
        'ended',
        () => {
            if (aquariumHoverAudio === audio) {
                aquariumHoverAudio = null;
            }
        },
        { once: true }
    );

    const playPromise = audio.play();

    if (
        playPromise &&
        typeof playPromise.catch === 'function'
    ) {
        playPromise.catch(() => {
            if (aquariumHoverAudio === audio) {
                aquariumHoverAudio = null;
            }
        });
    }
}

function el(tag, className, parent) {
    const node = document.createElement(tag);

    if (className) node.className = className;
    if (parent) parent.appendChild(node);

    return node;
}

function createBackground() {
    const root = el('div', 'aquarium-background');
    root.id = 'aquarium-background';
    root.setAttribute('aria-hidden', 'true');

    el('div', 'aquarium-water-color', root);
    el('div', 'aquarium-water-glow', root);
    el('div', 'aquarium-water-rays', root);
    el('div', 'aquarium-water-caustics', root);
    el('div', 'aquarium-depth-haze', root);
    el('div', 'aquarium-bubbles', root);
    el('div', 'aquarium-plankton', root);
    el('div', 'aquarium-distant-school', root);
    el('div', 'aquarium-edge-kelp', root);
    el('div', 'aquarium-surface-sparkles', root);

    return root;
}

function createBackgroundBubbles(root) {
    const container = root.querySelector('.aquarium-bubbles');

    for (let i = 0; i < 24; i++) {
        const bubble = el('span', 'aquarium-background-bubble', container);
        const size = 3 + Math.random() * 7;

        bubble.style.left = `${Math.random() * 100}%`;
        bubble.style.bottom = `${-5 + Math.random() * 10}%`;
        bubble.style.width = `${size}px`;
        bubble.style.height = `${size}px`;
        bubble.style.setProperty('--drift', `${-28 + Math.random() * 56}px`);
        bubble.style.setProperty('--duration', `${11 + Math.random() * 12}s`);
        bubble.style.animationDelay = `${-Math.random() * 18}s`;
    }
}

function createPlankton(root) {
    const container = root.querySelector('.aquarium-plankton');

    for (let i = 0; i < 28; i++) {
        const dot = el('span', 'aquarium-plankton-dot', container);

        dot.style.left = `${4 + Math.random() * 92}%`;
        dot.style.top = `${8 + Math.random() * 84}%`;
        dot.style.setProperty('--plankton-size', `${1.5 + Math.random() * 2.8}px`);
        dot.style.setProperty('--plankton-duration', `${5 + Math.random() * 7}s`);
        dot.style.setProperty('--plankton-delay', `${-Math.random() * 8}s`);
        dot.style.setProperty('--plankton-x', `${-7 + Math.random() * 14}px`);
        dot.style.setProperty('--plankton-y', `${-9 + Math.random() * 18}px`);
    }
}

function createDistantSchool(root) {
    const container = root.querySelector('.aquarium-distant-school');

    for (let i = 0; i < 14; i++) {
        const fish = el('span', 'aquarium-school-fish', container);

        fish.style.top = `${14 + Math.random() * 52}%`;
        fish.style.left = `${-15 - Math.random() * 25}%`;
        fish.style.setProperty('--school-duration', `${27 + Math.random() * 18}s`);
        fish.style.setProperty('--school-delay', `${-Math.random() * 35}s`);
        fish.style.setProperty('--school-y', `${-15 + Math.random() * 30}px`);
        fish.style.transform = `scale(${0.65 + Math.random() * 0.55})`;
    }
}

function createEdgeKelp(root) {
    const container = root.querySelector('.aquarium-edge-kelp');

    const placements = [
        { side: 'left', x: 1 },
        { side: 'left', x: 3.2 },
        { side: 'left', x: 5.4 },
        { side: 'right', x: 94.6 },
        { side: 'right', x: 96.8 },
        { side: 'right', x: 99 }
    ];

    placements.forEach((entry, index) => {
        const blade = el('span', 'aquarium-kelp-blade', container);

        blade.style.left = `${entry.x}%`;
        blade.style.setProperty('--kelp-height', `${58 + Math.random() * 68}px`);
        blade.style.setProperty('--kelp-duration', `${4.5 + Math.random() * 3.8}s`);
        blade.style.setProperty('--kelp-delay', `${-index * 0.45}s`);
    });
}

function createSurfaceGlints(root) {
    const container = root.querySelector('.aquarium-surface-sparkles');

    for (let i = 0; i < 9; i++) {
        const glint = el('span', 'aquarium-surface-glint', container);

        glint.style.setProperty('--glint-top', `${5 + Math.random() * 18}%`);
        glint.style.setProperty('--glint-left', `${4 + Math.random() * 88}%`);
        glint.style.setProperty('--glint-width', `${38 + Math.random() * 90}px`);
        glint.style.setProperty('--glint-duration', `${4 + Math.random() * 5}s`);
        glint.style.setProperty('--glint-delay', `${-Math.random() * 6}s`);
    }
}

function sourceFacesLeft(file) {
    return /puffer|seahorse/i.test(file);
}

function updateFacing(record) {
    const { wrapper, file, direction } = record;
    const shouldFlip = sourceFacesLeft(file)
        ? direction === 'right'
        : direction === 'left';

    wrapper.classList.toggle('moves-left', direction === 'left');
    wrapper.classList.toggle('moves-right', direction === 'right');
    wrapper.classList.toggle('flip-for-direction', shouldFlip);
}

function createTravelAnimation(wrapper, durationMs, direction, startFraction = Math.random()) {
    const animation = wrapper.animate(
        [
            { transform: 'translate3d(-38vw, 0, 0)' },
            { transform: 'translate3d(138vw, 0, 0)' }
        ],
        {
            duration: durationMs,
            iterations: Infinity,
            easing: 'linear'
        }
    );

    animation.currentTime = durationMs * startFraction;

    if (direction === 'left') {
        animation.playbackRate = -1;

        // Keep reverse-moving animations away from the start boundary.
        if (animation.currentTime < 1000) {
            animation.currentTime = durationMs * 0.72;
        }
    }

    return animation;
}

function addAnimal(root, file, config) {
    const kind = classifyAsset(file);
    const specialPuffer = /puffer/i.test(file);
    const specialSeahorse = /seahorse/i.test(file);

    let className = 'aquarium-animal aquarium-traveling';

    if (specialPuffer) {
        className += ' aquarium-puffer';
    } else if (specialSeahorse) {
        className += ' aquarium-seahorses seahorse-tail-sway';
    } else if (kind === 'swimmer') {
        className += ' aquarium-swimmer';
    } else {
        className += ' aquarium-floater';
    }

    const wrapper = el('div', className, root);
    wrapper.style.top = config.top;
    wrapper.style.setProperty('--animal-scale', config.scale);
    wrapper.style.setProperty('--depth-z', config.depthZ);
    wrapper.dataset.asset = file;

    const img = document.createElement('img');
    img.src = assetUrl(file);
    img.alt = '';
    img.draggable = false;
    img.decoding = 'async';
    img.loading = 'eager';
    wrapper.appendChild(img);

    if (specialPuffer) {
        const emitter = el('span', 'puffer-bubble-emitter', wrapper);
        emitter.setAttribute('aria-hidden', 'true');

        for (let i = 0; i < 4; i++) {
            const bubble = el('span', 'puffer-bubble', emitter);
            bubble.style.setProperty('--bubble-delay', `${i * 1.1}s`);
            bubble.style.setProperty('--bubble-size', `${4 + (i % 3) * 2}px`);
            bubble.style.setProperty('--bubble-side', `${-10 - i * 3}px`);
        }
    }

    const record = {
        wrapper,
        img,
        file,
        direction: config.direction,
        durationMs: config.durationMs,
        animation: null,
        lastTurnAt: -Infinity
    };

    updateFacing(record);

    record.animation = createTravelAnimation(
        wrapper,
        config.durationMs,
        config.direction,
        config.startFraction
    );

    aquariumAnimals.push(record);

    return record;
}

function createAnimals(root) {
    const assets = shuffle(AQUARIUM_ASSETS);

    if (!assets.length) return;

    // More animals are intentionally present at startup. They are spread over
    // many lanes with staggered animation progress so the screen does not begin empty.
    const lanes = [
        { top: '4%',  direction: 'right', scale: '0.82', durationMs: 30000, depthZ: 7, startFraction: .14 },
        { top: '13%', direction: 'left',  scale: '0.62', durationMs: 34000, depthZ: 5, startFraction: .66 },
        { top: '22%', direction: 'right', scale: '0.72', durationMs: 27000, depthZ: 6, startFraction: .46 },
        { top: '31%', direction: 'left',  scale: '0.52', durationMs: 32000, depthZ: 4, startFraction: .24 },
        { top: '40%', direction: 'right', scale: '0.67', durationMs: 29000, depthZ: 5, startFraction: .73 },
        { top: '50%', direction: 'left',  scale: '0.46', durationMs: 26000, depthZ: 3, startFraction: .51 },
        { top: '59%', direction: 'right', scale: '0.50', durationMs: 31000, depthZ: 4, startFraction: .30 },
        { top: '68%', direction: 'left',  scale: '0.40', durationMs: 28000, depthZ: 3, startFraction: .82 },
        { top: '77%', direction: 'right', scale: '0.42', durationMs: 25000, depthZ: 2, startFraction: .60 },
        { top: '86%', direction: 'left',  scale: '0.38', durationMs: 30000, depthZ: 2, startFraction: .38 },
        { top: '93%', direction: 'right', scale: '0.34', durationMs: 33000, depthZ: 1, startFraction: .90 }
    ];

    lanes.forEach((lane, index) => {
        const file = assets[index % assets.length];

        addAnimal(root, file, lane);
    });
}

function reverseAnimal(record) {
    const now = performance.now();

    // Prevent repeated mousemove events from making the same animal vibrate
    // back and forth while the cursor is still inside its rectangle.
    if (now - record.lastTurnAt < 650) return;

    record.lastTurnAt = now;

    playAquariumHoverSound();

    record.direction = record.direction === 'left' ? 'right' : 'left';

    if (record.animation) {
        const speed = Math.max(0.001, Math.abs(record.animation.playbackRate || 1));
        record.animation.playbackRate = record.direction === 'right' ? speed : -speed;
        record.animation.play();
    }

    updateFacing(record);

    record.wrapper.classList.remove('aquarium-turning');
    void record.wrapper.offsetWidth;
    record.wrapper.classList.add('aquarium-turning');

    window.setTimeout(() => {
        if (record.wrapper) {
            record.wrapper.classList.remove('aquarium-turning');
        }
    }, 380);
}

function handleAquariumMouseMove(event) {
    if (!aquariumRoot) return;

    const x = event.clientX;
    const y = event.clientY;

    aquariumAnimals.forEach(record => {
        const rect = record.wrapper.getBoundingClientRect();

        // Slightly shrink the hit box so transparent SVG margins don't turn an
        // animal before the mouse visually reaches it.
        const padX = Math.min(18, rect.width * .12);
        const padY = Math.min(12, rect.height * .12);

        if (
            x >= rect.left + padX &&
            x <= rect.right - padX &&
            y >= rect.top + padY &&
            y <= rect.bottom - padY
        ) {
            reverseAnimal(record);
        }
    });
}

function refreshAnimations() {
    // Recreate travel animations after a viewport resize so vw-based endpoints
    // are recalculated by the browser without changing current direction.
    aquariumAnimals.forEach(record => {
        let fraction = .5;

        if (record.animation && record.animation.currentTime != null) {
            fraction = (record.animation.currentTime % record.durationMs) / record.durationMs;
            record.animation.cancel();
        }

        record.animation = createTravelAnimation(
            record.wrapper,
            record.durationMs,
            record.direction,
            fraction
        );
    });
}

export async function mount() {
    if (aquariumRoot) return;

    AQUARIUM_ASSETS = await discoverAquariumAssets();

    aquariumStylesheet = document.createElement('link');
    aquariumStylesheet.rel = 'stylesheet';
    aquariumStylesheet.href = new URL('./theme-aquarium.css', import.meta.url).href;
    aquariumStylesheet.dataset.theme = 'aquarium';
    document.head.appendChild(aquariumStylesheet);

    aquariumRoot = createBackground();
    document.body.appendChild(aquariumRoot);

    createBackgroundBubbles(aquariumRoot);
    createPlankton(aquariumRoot);
    createDistantSchool(aquariumRoot);
    createEdgeKelp(aquariumRoot);
    createSurfaceGlints(aquariumRoot);
    createAnimals(aquariumRoot);

    aquariumMouseHandler = handleAquariumMouseMove;
    document.addEventListener('mousemove', aquariumMouseHandler, { passive: true });

    aquariumResizeHandler = refreshAnimations;
    window.addEventListener('resize', aquariumResizeHandler, { passive: true });

    playAquariumIntro();
}

export function unmount() {
    finishAquariumIntro();
    stopAquariumHoverSound();

    if (aquariumMouseHandler) {
        document.removeEventListener('mousemove', aquariumMouseHandler);
        aquariumMouseHandler = null;
    }

    if (aquariumResizeHandler) {
        window.removeEventListener('resize', aquariumResizeHandler);
        aquariumResizeHandler = null;
    }

    aquariumAnimals.forEach(record => {
        try {
            record.animation?.cancel();
        } catch (_) {}
    });

    aquariumAnimals = [];

    if (aquariumRoot) {
        aquariumRoot.remove();
        aquariumRoot = null;
    }

    AQUARIUM_ASSETS = [];

    if (aquariumStylesheet) {
        aquariumStylesheet.remove();
        aquariumStylesheet = null;
    }
}
