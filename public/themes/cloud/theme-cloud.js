let themeContainer = null;
let themeStylesheet = null;
let cloudIntroAudio = null;
let cloudIntroFallbackHandler = null;
let activeBurstTimers = [];

const CLOUD_INTRO_SRC =
    '/sounds/intros/pumpkin_go_boo-three-random-tunes-girl-200030.mp3';
const CLOUD_INTRO_END = 10;
const CLOUD_INTRO_FADE_START = 8;
const CLOUD_INTRO_VOLUME = 0.28;
const CLOUD_POP_SRC = '/sounds/clouds/dragon-studio-pop-402324.mp3';
const CLOUD_POP_VOLUME = 0.34;

function rand(min, max) {
    return Math.random() * (max - min) + min;
}

function stopCloudIntro() {
    if (cloudIntroFallbackHandler) {
        document.removeEventListener('pointerdown', cloudIntroFallbackHandler);
        document.removeEventListener('keydown', cloudIntroFallbackHandler);
        cloudIntroFallbackHandler = null;
    }

    if (!cloudIntroAudio) return;

    try {
        cloudIntroAudio.pause();
        cloudIntroAudio.currentTime = 0;
        cloudIntroAudio.volume = CLOUD_INTRO_VOLUME;
    } catch (_) {}

    cloudIntroAudio = null;
}

function playCloudIntro() {
    stopCloudIntro();

    const audio = new Audio(CLOUD_INTRO_SRC);
    cloudIntroAudio = audio;
    audio.preload = 'auto';
    audio.volume = CLOUD_INTRO_VOLUME;
    audio.loop = false;

    const updateFade = () => {
        if (cloudIntroAudio !== audio) return;

        const t = audio.currentTime || 0;

        if (t >= CLOUD_INTRO_END) {
            audio.pause();
            audio.currentTime = CLOUD_INTRO_END;
            audio.volume = 0;
            return;
        }

        if (t >= CLOUD_INTRO_FADE_START) {
            const remaining = Math.max(0, CLOUD_INTRO_END - t);
            const fadeLength = CLOUD_INTRO_END - CLOUD_INTRO_FADE_START;

            audio.volume = CLOUD_INTRO_VOLUME * (remaining / fadeLength);
        }
    };

    audio.addEventListener('timeupdate', updateFade);

    const playNow = () => {
        if (cloudIntroAudio !== audio) return;

        const promise = audio.play();

        if (promise && typeof promise.catch === 'function') {
            promise.catch(() => {
                if (cloudIntroFallbackHandler) return;

                cloudIntroFallbackHandler = () => {
                    document.removeEventListener('pointerdown', cloudIntroFallbackHandler);
                    document.removeEventListener('keydown', cloudIntroFallbackHandler);

                    cloudIntroFallbackHandler = null;

                    if (cloudIntroAudio !== audio) return;

                    const retry = audio.play();
                    if (retry && typeof retry.catch === 'function') {
                        retry.catch(() => {});
                    }
                };

                document.addEventListener('pointerdown', cloudIntroFallbackHandler, { once: true });
                document.addEventListener('keydown', cloudIntroFallbackHandler, { once: true });
            });
        }
    };

    playNow();
}

function makeCloud(fill) {
    return `
        <div class="cloud-visual">
            <svg viewBox="0 0 240 100" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M25 72
                       C8 72 2 61 8 49
                       C13 39 24 35 35 38
                       C38 21 51 10 67 10
                       C82 10 94 19 98 33
                       C103 27 111 24 120 24
                       C137 24 149 36 150 51
                       C154 48 160 47 166 47
                       C181 47 192 58 192 72
                       Z"
                    fill="${fill}"
                />
            </svg>
        </div>
    `;
}

function scheduleTimer(fn, delay) {
    const id = setTimeout(() => {
        activeBurstTimers = activeBurstTimers.filter((timer) => timer !== id);
        fn();
    }, delay);
    activeBurstTimers.push(id);
}

function playCloudBurstSound() {
    const bursts = 4;
    for (let i = 0; i < bursts; i++) {
        scheduleTimer(() => {
            try {
                const audio = new Audio(CLOUD_POP_SRC);
                audio.preload = 'auto';
                audio.volume = CLOUD_POP_VOLUME;
                audio.playbackRate = rand(0.95, 1.08);
                audio.play().catch(() => {});
            } catch (_) {}
        }, i * 110);
    }
}

function createDroplets(cloud) {
    if (!themeContainer) return;

    const rect = cloud.getBoundingClientRect();
    const centerX = rect.left + rect.width * 0.46;
    const startY = rect.top + rect.height * 0.52;
    const count = Math.floor(rand(24, 36));
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight || 900;

    for (let i = 0; i < count; i++) {
        const drop = document.createElement('span');
        drop.className = 'cloud-water-drop';
        drop.setAttribute('aria-hidden', 'true');

        const size = rand(7, 13);
        const x = centerX + rand(-rect.width * 0.34, rect.width * 0.34);
        const y = startY + rand(-8, 12);
        const drift = rand(-48, 48);
        const fallDistance = Math.max(150, viewportHeight - y + rand(28, 80));
        const duration = rand(1.3, 2.2);

        drop.style.left = `${x}px`;
        drop.style.top = `${y}px`;
        drop.style.width = `${size}px`;
        drop.style.height = `${size * 1.5}px`;
        drop.style.setProperty('--drop-drift', `${drift}px`);
        drop.style.setProperty('--drop-fall', `${fallDistance}px`);
        drop.style.setProperty('--drop-duration', `${duration}s`);
        drop.style.setProperty('--drop-delay', `${rand(0, 0.18)}s`);

        themeContainer.appendChild(drop);

        scheduleTimer(() => drop.remove(), Math.ceil((duration + 0.45) * 1000));
    }
}

function burstCloud(cloud) {
    if (!cloud || cloud.dataset.bursting === 'true') return;

    cloud.dataset.bursting = 'true';
    cloud.classList.add('cloud-bursting');
    playCloudBurstSound();

    scheduleTimer(() => {
        if (!themeContainer || !cloud.isConnected) return;
        createDroplets(cloud);
        cloud.classList.add('cloud-popped');
    }, 360);

    scheduleTimer(() => {
        if (!cloud.isConnected) return;

        cloud.classList.remove('cloud-bursting', 'cloud-popped');

        const visual = cloud.querySelector('.cloud-visual');
        if (visual) {
            visual.style.opacity = '';
            visual.style.transform = '';
        }

        cloud.dataset.bursting = 'false';
    }, 2350);
}

function wireCloudInteractions() {
    if (!themeContainer) return;

    themeContainer.querySelectorAll('.cloud').forEach((cloud) => {
        cloud.addEventListener('mouseenter', () => burstCloud(cloud));
    });
}

export function mount() {
    if (themeContainer) return;

    playCloudIntro();

    themeStylesheet = document.createElement('link');
    themeStylesheet.rel = 'stylesheet';
    themeStylesheet.href = '/themes/theme-cloud.css';
    themeStylesheet.dataset.themeCloudModule = 'true';
    document.head.appendChild(themeStylesheet);

    themeContainer = document.createElement('div');
    themeContainer.id = 'cloud-background';
    themeContainer.setAttribute('aria-hidden', 'true');

    themeContainer.innerHTML = `
        <div class="cloud cloud-1">${makeCloud('rgba(255,255,255,0.90)')}</div>
        <div class="cloud cloud-2">${makeCloud('rgba(255,255,255,0.76)')}</div>
        <div class="cloud cloud-3">${makeCloud('rgba(255,255,255,0.84)')}</div>
    `;

    document.body.appendChild(themeContainer);
    wireCloudInteractions();
}

export function unmount() {
    stopCloudIntro();

    activeBurstTimers.forEach((id) => clearTimeout(id));
    activeBurstTimers = [];

    if (themeContainer) {
        themeContainer.remove();
        themeContainer = null;
    }

    if (themeStylesheet) {
        themeStylesheet.remove();
        themeStylesheet = null;
    }
}
