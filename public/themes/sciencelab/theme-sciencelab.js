// UPDATE THIS NUMBER when you add more sound files!
const TOTAL_BUBBLE_SOUNDS = 3;

let scienceBackground = null;
let scienceStylesheet = null;
let activeAudio = null;
let activeSoundObject = null;
let fadeAnimation = null;

const SOUND_VOLUME = 0.28;
const FADE_DURATION = 450;

let scienceIntroAudio = null;
let scienceIntroFinished = true;
let scienceIntroFallback = null;

const SCIENCE_INTRO_SRC =
    "/sounds/intros/the_mountain-lab-experiment-131653.mp3";
const SCIENCE_INTRO_CUTOFF = 20;
const SCIENCE_INTRO_FADE_START = 15;
const SCIENCE_INTRO_VOLUME = 0.3;

function removeScienceIntroFallback() {
    if (!scienceIntroFallback) return;
    window.removeEventListener("pointerdown", scienceIntroFallback);
    window.removeEventListener("keydown", scienceIntroFallback);
    scienceIntroFallback = null;
}

function finishScienceIntro() {
    scienceIntroFinished = true;
    removeScienceIntroFallback();

    if (scienceIntroAudio) {
        try {
            scienceIntroAudio.pause();
            scienceIntroAudio.currentTime = 0;
            scienceIntroAudio.volume = SCIENCE_INTRO_VOLUME;
        } catch (_) {}
    }

    scienceIntroAudio = null;
}

function playScienceIntro() {
    finishScienceIntro();
    scienceIntroFinished = false;

    const audio = new Audio(SCIENCE_INTRO_SRC);
    scienceIntroAudio = audio;
    audio.preload = "auto";
    audio.volume = SCIENCE_INTRO_VOLUME;

    const updateFade = () => {
        if (scienceIntroAudio !== audio) return;

        const t = audio.currentTime || 0;

        if (t >= SCIENCE_INTRO_CUTOFF) {
            finishScienceIntro();
            return;
        }

        if (t >= SCIENCE_INTRO_FADE_START) {
            const progress = Math.min(
                1,
                (t - SCIENCE_INTRO_FADE_START) /
                (SCIENCE_INTRO_CUTOFF - SCIENCE_INTRO_FADE_START)
            );
            audio.volume = Math.max(
                0,
                SCIENCE_INTRO_VOLUME * (1 - progress)
            );
        } else {
            audio.volume = SCIENCE_INTRO_VOLUME;
        }
    };

    audio.addEventListener("timeupdate", updateFade);
    audio.addEventListener("ended", finishScienceIntro, { once: true });
    audio.addEventListener("error", finishScienceIntro, { once: true });
    audio.addEventListener("playing", removeScienceIntroFallback);

    const attempt = () => {
        if (scienceIntroAudio !== audio) return;
        const promise = audio.play();

        if (promise && typeof promise.catch === "function") {
            promise.catch(() => {
                if (scienceIntroFallback || scienceIntroAudio !== audio) return;

                scienceIntroFallback = () => {
                    if (scienceIntroAudio !== audio) return;
                    const retry = audio.play();
                    if (retry && typeof retry.catch === "function") {
                        retry.catch(() => {});
                    }
                };

                window.addEventListener("pointerdown", scienceIntroFallback);
                window.addEventListener("keydown", scienceIntroFallback);
            });
        }
    };

    attempt();
}

/* ============================================================
   SVGs
   ============================================================ */

const ERLENMEYER_FLASK = `
<svg viewBox="0 0 160 200" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <defs>
        <linearGradient id="scienceFlaskGlass_ID_PLACEHOLDER" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stop-color="#65e0d1" stop-opacity=".13"/>
            <stop offset=".48" stop-color="#8ab7ff" stop-opacity=".08"/>
            <stop offset="1" stop-color="#65e0d1" stop-opacity=".16"/>
        </linearGradient>
        <linearGradient id="scienceFlaskLiquid_ID_PLACEHOLDER" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stop-color="#8ab7ff" stop-opacity=".15"/>
            <stop offset="1" stop-color="#65e0d1" stop-opacity=".19"/>
        </linearGradient>
        <clipPath id="scienceFlaskClip_ID_PLACEHOLDER">
            <path d="M35 138 Q51 132 66 138 Q82 145 98 138 Q113 132 127 138 L135 160 Q140 172 131 177 Q126 180 118 180 L42 180 Q34 180 29 177 Q20 172 25 160 Z" />
        </clipPath>
    </defs>

    <path d="M60 44 L60 86 L25 160 Q20 172 29 177 Q34 180 42 180 L118 180 Q126 180 131 177 Q140 172 135 160 L100 86 L100 44 Z"
        fill="url(#scienceFlaskGlass_ID_PLACEHOLDER)"
        stroke="#65e0d1"
        stroke-opacity=".19"
        stroke-width="2.5"/>

    <path class="science-liquid"
        d="M35 138 Q51 132 66 138 Q82 145 98 138 Q113 132 127 138 L135 160 Q140 172 131 177 Q126 180 118 180 L42 180 Q34 180 29 177 Q20 172 25 160 Z"
        fill="url(#scienceFlaskLiquid_ID_PLACEHOLDER)"/>

    <path d="M35 138 Q51 132 66 138 Q82 145 98 138 Q113 132 127 138"
        fill="none"
        stroke="#65e0d1"
        stroke-opacity=".19"
        stroke-width="1.6"/>

    <path d="M60 44 L60 86 M100 44 L100 86"
        fill="none"
        stroke="#65e0d1"
        stroke-opacity=".15"
        stroke-width="2.5"/>

    <path d="M55 43 Q80 36 105 43 Q105 47 100 49 Q80 44 60 49 Q55 47 55 43 Z"
        fill="#65e0d1"
        fill-opacity=".08"
        stroke="#65e0d1"
        stroke-opacity=".18"
        stroke-width="1.7"/>

    <g fill="none"
       stroke="#65e0d1"
       stroke-opacity=".35"
       stroke-width="1.6"
       clip-path="url(#scienceFlaskClip_ID_PLACEHOLDER)">
        <circle class="sciencelab-bubble" cx="54" cy="165" r="4.5" style="--bubble-duration:3.2s"/>
        <circle class="sciencelab-bubble" cx="72" cy="170" r="3.5" style="--bubble-duration:2.7s"/>
        <circle class="sciencelab-bubble" cx="90" cy="160" r="5" style="--bubble-duration:3.8s"/>
        <circle class="sciencelab-bubble" cx="107" cy="172" r="3.2" style="--bubble-duration:3.1s"/>
        <circle class="sciencelab-bubble" cx="80" cy="168" r="4" style="--bubble-duration:2.5s"/>
    </g>
</svg>
`;

const ROUND_FLASK = `
<svg viewBox="0 0 180 210" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <defs>
        <radialGradient id="scienceRoundGlass_ID_PLACEHOLDER" cx=".30" cy=".20">
            <stop offset="0" stop-color="#65e0d1" stop-opacity=".15"/>
            <stop offset=".50" stop-color="#8ab7ff" stop-opacity=".07"/>
            <stop offset="1" stop-color="#65e0d1" stop-opacity=".15"/>
        </radialGradient>

        <clipPath id="scienceRoundClip_ID_PLACEHOLDER">
            <path d="M39 141 Q55 134 72 140 Q90 147 107 139 Q124 133 141 141 L146 143 C151 176 126 193 90 193 C54 193 29 176 34 143 Z" />
        </clipPath>
    </defs>

    <path d="M65 47 L65 90 C65 101 38 118 34 143 C29 176 54 193 90 193 C126 193 151 176 146 143 C142 118 115 101 115 90 L115 47 Z"
        fill="url(#scienceRoundGlass_ID_PLACEHOLDER)"
        stroke="#65e0d1"
        stroke-opacity=".18"
        stroke-width="2.5"/>

    <path class="science-liquid"
        d="M39 141 Q55 134 72 140 Q90 147 107 139 Q124 133 141 141 L146 143 C151 176 126 193 90 193 C54 193 29 176 34 143 Z"
        fill="#8ab7ff"
        fill-opacity=".13"/>

    <path d="M39 141 Q55 134 72 140 Q90 147 107 139 Q124 133 141 141"
        fill="none"
        stroke="#65e0d1"
        stroke-opacity=".20"
        stroke-width="1.7"/>

    <path d="M65 47 L65 90 M115 47 L115 90"
        fill="none"
        stroke="#65e0d1"
        stroke-opacity=".14"
        stroke-width="2.5"/>

    <path d="M60 46 Q90 39 120 46 L120 51 Q90 46 60 51 Z"
        fill="#65e0d1"
        fill-opacity=".08"
        stroke="#65e0d1"
        stroke-opacity=".18"
        stroke-width="1.7"/>

    <g fill="none"
       stroke="#65e0d1"
       stroke-opacity=".34"
       stroke-width="1.6"
       clip-path="url(#scienceRoundClip_ID_PLACEHOLDER)">
        <circle class="sciencelab-bubble" cx="62" cy="175" r="4" style="--bubble-duration:3.1s"/>
        <circle class="sciencelab-bubble" cx="81" cy="182" r="3.4" style="--bubble-duration:2.8s"/>
        <circle class="sciencelab-bubble" cx="103" cy="170" r="5" style="--bubble-duration:3.7s"/>
        <circle class="sciencelab-bubble" cx="120" cy="180" r="3.1" style="--bubble-duration:2.9s"/>
        <circle class="sciencelab-bubble" cx="90" cy="185" r="4.5" style="--bubble-duration:3.4s"/>
    </g>
</svg>
`;

const PETRI_DISH = `
<svg viewBox="0 0 220 150" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <defs>
        <radialGradient id="sciencePetriGlass_ID_PLACEHOLDER" cx=".30" cy=".20">
            <stop stop-color="#65e0d1" stop-opacity=".12"/>
            <stop offset="1" stop-color="#8ab7ff" stop-opacity=".08"/>
        </radialGradient>

        <clipPath id="sciencePetriClip_ID_PLACEHOLDER">
            <ellipse cx="110" cy="84" rx="72" ry="33" />
        </clipPath>
    </defs>

    <ellipse cx="110" cy="80" rx="91" ry="47"
        fill="url(#sciencePetriGlass_ID_PLACEHOLDER)"
        stroke="#65e0d1"
        stroke-opacity=".18"
        stroke-width="2.5"/>

    <ellipse class="science-liquid"
        cx="110"
        cy="84"
        rx="72"
        ry="33"
        fill="#8ab7ff"
        fill-opacity=".10"
        stroke="#65e0d1"
        stroke-opacity=".13"
        stroke-width="1.5"/>

    <g fill="#65e0d1"
       fill-opacity=".14"
       stroke="#65e0d1"
       stroke-opacity=".13"
       stroke-width="1">
        <circle cx="67" cy="75" r="6"/>
        <circle cx="84" cy="94" r="4"/>
        <circle cx="104" cy="67" r="7"/>
        <circle cx="129" cy="88" r="5"/>
        <circle cx="151" cy="72" r="3.5"/>
        <circle cx="119" cy="104" r="3"/>
        <circle cx="94" cy="83" r="2.5"/>
    </g>

    <g fill="none"
       stroke="#65e0d1"
       stroke-opacity=".35"
       stroke-width="1.5"
       clip-path="url(#sciencePetriClip_ID_PLACEHOLDER)">
        <circle class="sciencelab-bubble" cx="70" cy="105" r="3" style="--bubble-duration:2.5s"/>
        <circle class="sciencelab-bubble" cx="110" cy="100" r="4" style="--bubble-duration:3.1s"/>
        <circle class="sciencelab-bubble" cx="140" cy="110" r="3.5" style="--bubble-duration:2.8s"/>
    </g>

    <ellipse cx="110" cy="69" rx="91" ry="47"
        fill="none"
        stroke="#65e0d1"
        stroke-opacity=".16"
        stroke-width="3"/>

    <path d="M43 60 Q56 43 77 37"
        fill="none"
        stroke="#65e0d1"
        stroke-opacity=".10"
        stroke-width="4"
        stroke-linecap="round"/>
</svg>
`;

const MICROSCOPE = `
<svg viewBox="0 0 220 220" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <defs>
        <linearGradient id="scienceMicroscopeMetal_ID_PLACEHOLDER" x1="0" y1="0" x2="1" y2="1">
            <stop stop-color="#65e0d1" stop-opacity=".13"/>
            <stop offset=".50" stop-color="#8ab7ff" stop-opacity=".09"/>
            <stop offset="1" stop-color="#65e0d1" stop-opacity=".16"/>
        </linearGradient>
    </defs>

    <path d="M42 190 Q42 177 56 172 L163 172 Q178 174 181 190 Q181 198 171 198 L52 198 Q42 198 42 190 Z"
        fill="url(#scienceMicroscopeMetal_ID_PLACEHOLDER)"
        stroke="#65e0d1"
        stroke-opacity=".17"
        stroke-width="2.5"/>

    <path d="M72 174 Q65 140 72 112 Q78 85 102 70 Q117 61 130 68 L143 82 Q119 91 112 111 Q105 132 114 173"
        fill="none"
        stroke="url(#scienceMicroscopeMetal_ID_PLACEHOLDER)"
        stroke-width="17"
        stroke-linecap="round"/>

    <path d="M118 68 L106 35 Q104 29 110 27 L125 23 Q131 22 133 28 L142 61 Z"
        fill="url(#scienceMicroscopeMetal_ID_PLACEHOLDER)"
        stroke="#65e0d1"
        stroke-opacity=".16"
        stroke-width="2.5"/>

    <path d="M112 78 Q125 72 139 78 L153 91 L143 103 L126 95 L112 91 Z"
        fill="#65e0d1"
        fill-opacity=".11"
        stroke="#65e0d1"
        stroke-opacity=".16"
        stroke-width="2.5"/>

    <path d="M128 94 L119 116 L130 119 L139 99 Z"
        fill="#8ab7ff"
        fill-opacity=".09"
        stroke="#65e0d1"
        stroke-opacity=".15"
        stroke-width="1.7"/>

    <path d="M139 99 L139 122 L150 122 L151 104 Z"
        fill="#65e0d1"
        fill-opacity=".10"
        stroke="#65e0d1"
        stroke-opacity=".15"
        stroke-width="1.7"/>

    <rect x="68" y="118" width="86" height="13" rx="5"
        fill="#65e0d1"
        fill-opacity=".08"
        stroke="#65e0d1"
        stroke-opacity=".15"
        stroke-width="1.7"/>

    <circle cx="83" cy="92" r="15"
        fill="#65e0d1"
        fill-opacity=".07"
        stroke="#65e0d1"
        stroke-opacity=".15"
        stroke-width="2.5"/>

    <circle cx="83" cy="92" r="6"
        fill="#8ab7ff"
        fill-opacity=".09"/>
</svg>
`;

const CHEMISTRY_FLASK = `
<svg viewBox="0 0 180 210" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <defs>
        <linearGradient id="scienceChemGlass_ID_PLACEHOLDER" x1="0" y1="0" x2="1" y2="1">
            <stop stop-color="#65e0d1" stop-opacity=".12"/>
            <stop offset=".50" stop-color="#8ab7ff" stop-opacity=".07"/>
            <stop offset="1" stop-color="#65e0d1" stop-opacity=".15"/>
        </linearGradient>

        <clipPath id="scienceChemClip_ID_PLACEHOLDER">
            <path d="M38 143 Q54 136 70 142 Q88 148 106 141 Q124 134 142 143 L143 147 Q149 162 139 174 Q126 190 90 190 Q54 190 41 174 Q31 162 37 147 Z" />
        </clipPath>
    </defs>

    <path d="M66 43 L66 86 L37 147 Q31 162 41 174 Q54 190 90 190 Q126 190 139 174 Q149 162 143 147 L114 86 L114 43 Z"
        fill="url(#scienceChemGlass_ID_PLACEHOLDER)"
        stroke="#65e0d1"
        stroke-opacity=".18"
        stroke-width="2.5"/>

    <path class="science-liquid"
        d="M38 143 Q54 136 70 142 Q88 148 106 141 Q124 134 142 143 L143 147 Q149 162 139 174 Q126 190 90 190 Q54 190 41 174 Q31 162 37 147 Z"
        fill="#8ab7ff"
        fill-opacity=".12"/>

    <path d="M38 143 Q54 136 70 142 Q88 148 106 141 Q124 134 142 143"
        fill="none"
        stroke="#65e0d1"
        stroke-opacity=".20"
        stroke-width="1.7"/>

    <ellipse cx="90" cy="43" rx="27" ry="6"
        fill="#65e0d1"
        fill-opacity=".07"
        stroke="#65e0d1"
        stroke-opacity=".17"
        stroke-width="1.7"/>

    <g fill="none"
       stroke="#65e0d1"
       stroke-opacity=".34"
       stroke-width="1.6"
       clip-path="url(#scienceChemClip_ID_PLACEHOLDER)">
        <circle class="sciencelab-bubble" cx="59" cy="175" r="4" style="--bubble-duration:2.8s"/>
        <circle class="sciencelab-bubble" cx="76" cy="182" r="3.2" style="--bubble-duration:3.4s"/>
        <circle class="sciencelab-bubble" cx="94" cy="170" r="4.6" style="--bubble-duration:2.9s"/>
        <circle class="sciencelab-bubble" cx="111" cy="180" r="3.6" style="--bubble-duration:3.7s"/>
        <circle class="sciencelab-bubble" cx="85" cy="183" r="4" style="--bubble-duration:3.0s"/>
    </g>
</svg>
`;

const SCIENCE_CYLINDER = `
<svg viewBox="0 0 200 400" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
    <defs>
        <linearGradient id="cylinderLiquid_ID_PLACEHOLDER"
            x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"
                stop-color="#65e0d1"
                stop-opacity=".20"/>
            <stop offset="40%"
                stop-color="#8ab7ff"
                stop-opacity=".17"/>
            <stop offset="70%"
                stop-color="#65e0d1"
                stop-opacity=".22"/>
            <stop offset="100%"
                stop-color="#65e0d1"
                stop-opacity=".24"/>
        </linearGradient>

        <linearGradient id="cylinderGlass_ID_PLACEHOLDER"
            x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"
                stop-color="#ffffff"
                stop-opacity=".22"/>
            <stop offset="8%"
                stop-color="#ffffff"
                stop-opacity=".08"/>
            <stop offset="25%"
                stop-color="#ffffff"
                stop-opacity=".025"/>
            <stop offset="75%"
                stop-color="#ffffff"
                stop-opacity=".035"/>
            <stop offset="92%"
                stop-color="#ffffff"
                stop-opacity=".14"/>
            <stop offset="100%"
                stop-color="#ffffff"
                stop-opacity=".25"/>
        </linearGradient>

        <radialGradient id="cylinderBubble_ID_PLACEHOLDER"
            cx="35%" cy="35%" r="70%">
            <stop offset="0%"
                stop-color="#ffffff"
                stop-opacity=".75"/>
            <stop offset="30%"
                stop-color="#e0f7fa"
                stop-opacity=".45"/>
            <stop offset="70%"
                stop-color="#65e0d1"
                stop-opacity=".18"/>
            <stop offset="100%"
                stop-color="#65e0d1"
                stop-opacity="0"/>
        </radialGradient>

        <filter id="cylinderGlow_ID_PLACEHOLDER"
            x="-20%" y="-20%"
            width="140%" height="140%">
            <feGaussianBlur
                stdDeviation="2"
                result="blur"/>
            <feComposite
                in="SourceGraphic"
                in2="blur"
                operator="over"/>
        </filter>

        <clipPath id="cylinderClip_ID_PLACEHOLDER">
            <path d="
                M 70 200
                L 70 310
                A 30 30 0 0 0 130 310
                L 130 200
                Z
            "/>
        </clipPath>
    </defs>

    <!-- LIQUID -->
    <path
        d="
            M 70 200
            L 70 310
            A 30 30 0 0 0 130 310
            L 130 200
            Z
        "
        fill="url(#cylinderLiquid_ID_PLACEHOLDER)"
    />

    <!-- LIQUID SURFACE -->
    <ellipse
        cx="100"
        cy="200"
        rx="30"
        ry="10"
        fill="#65e0d1"
        opacity=".18"
        filter="url(#cylinderGlow_ID_PLACEHOLDER)"
    />

    <ellipse
        cx="100"
        cy="200"
        rx="29"
        ry="9"
        fill="url(#cylinderLiquid_ID_PLACEHOLDER)"
        opacity=".8"
    />

    <!-- BUBBLES -->
    <g
        clip-path="url(#cylinderClip_ID_PLACEHOLDER)"
        fill="url(#cylinderBubble_ID_PLACEHOLDER)"
    >
        <circle
            class="sciencelab-bubble"
            cx="95"
            cy="260"
            r="6"
            style="--bubble-duration:2.7s"
        />

        <circle
            class="sciencelab-bubble"
            cx="112"
            cy="235"
            r="4.5"
            style="--bubble-duration:3.1s"
        />

        <circle
            class="sciencelab-bubble"
            cx="82"
            cy="285"
            r="5"
            style="--bubble-duration:3.4s"
        />

        <circle
            class="sciencelab-bubble"
            cx="100"
            cy="322"
            r="3.5"
            style="--bubble-duration:2.9s"
        />

        <circle
            class="sciencelab-bubble"
            cx="90"
            cy="215"
            r="3.5"
            style="--bubble-duration:2.4s"
        />

        <circle
            class="sciencelab-bubble"
            cx="116"
            cy="275"
            r="2"
            style="--bubble-duration:3.6s"
        />

        <circle
            class="sciencelab-bubble"
            cx="88"
            cy="245"
            r="1.5"
            style="--bubble-duration:2.6s"
        />

        <circle
            class="sciencelab-bubble"
            cx="105"
            cy="203"
            r="2"
            style="--bubble-duration:3.2s"
        />
    </g>

    <!-- BUBBLE HIGHLIGHTS -->
    <g
        clip-path="url(#cylinderClip_ID_PLACEHOLDER)"
        fill="#ffffff"
        opacity=".45"
    >
        <circle cx="93" cy="258" r="1.5"/>
        <circle cx="110" cy="233" r="1"/>
        <circle cx="80" cy="283" r="1"/>
    </g>

    <!-- GLASS CYLINDER -->
    <path
        d="
            M 70 60
            L 70 310
            A 30 30 0 0 0 130 310
            L 130 60
        "
        fill="none"
        stroke="#65e0d1"
        stroke-width="2.5"
        stroke-linecap="round"
        opacity=".20"
    />

    <!-- GLASS SHADING -->
    <path
        d="
            M 70 60
            L 70 310
            A 30 30 0 0 0 130 310
            L 130 60
            Z
        "
        fill="url(#cylinderGlass_ID_PLACEHOLDER)"
        pointer-events="none"
    />

    <!-- TOP LIP -->
    <path
        d="M 66 60 C 66 54, 134 54, 134 60"
        fill="none"
        stroke="#65e0d1"
        stroke-width="3"
        opacity=".22"
    />

    <ellipse
        cx="100"
        cy="60"
        rx="30"
        ry="8"
        fill="none"
        stroke="#65e0d1"
        stroke-width="1.5"
        opacity=".20"
    />

    <!-- GLASS HIGHLIGHTS -->
    <path
        d="
            M 75 75
            L 75 305
            A 25 25 0 0 0 95 333
        "
        fill="none"
        stroke="#ffffff"
        stroke-width="1.5"
        stroke-linecap="round"
        opacity=".14"
    />

    <path
        d="M 78 85 L 78 180"
        fill="none"
        stroke="#ffffff"
        stroke-width=".75"
        stroke-linecap="round"
        opacity=".11"
    />

    <path
        d="
            M 125 75
            L 125 305
            A 25 25 0 0 1 115 327
        "
        fill="none"
        stroke="#ffffff"
        stroke-width="1"
        stroke-linecap="round"
        opacity=".10"
    />
</svg>
`;


/* ============================================================
   SOUND
   ============================================================ */

function cancelFade() {
    if (fadeAnimation !== null) {
        cancelAnimationFrame(fadeAnimation);
        fadeAnimation = null;
    }
}

function stopActiveSound() {
    cancelFade();

    if (activeAudio) {
        activeAudio.pause();
        activeAudio.currentTime = 0;
        activeAudio.volume = SOUND_VOLUME;
    }

    activeAudio = null;
    activeSoundObject = null;
}

function startObjectSound(object) {
    if (!scienceIntroFinished) return;
    if (activeSoundObject === object && activeAudio) {
        cancelFade();

        activeAudio.volume = SOUND_VOLUME;

        if (activeAudio.paused) {
            activeAudio.play().catch(() => {});
        }

        return;
    }

    stopActiveSound();

    activeSoundObject = object;

    const randomNum =
        Math.floor(Math.random() * TOTAL_BUBBLE_SOUNDS) + 1;

    const soundPath =
        `/sounds/science-bubble-${randomNum}.mp3`;

    const audio = new Audio(soundPath);

    audio.volume = SOUND_VOLUME;
    audio.loop = true;
    audio.preload = 'auto';

    activeAudio = audio;

    audio.play().catch(error => {
        console.warn('Science lab sound could not play:', error);
    });
}

function fadeOutActiveSound(object) {
    if (!activeAudio || activeSoundObject !== object) {
        return;
    }

    const audio = activeAudio;
    const startVolume = audio.volume;
    const startTime = performance.now();

    cancelFade();

    function fade() {
        if (activeAudio !== audio || activeSoundObject !== object) {
            return;
        }

        const elapsed = performance.now() - startTime;
        const progress = Math.min(
            elapsed / FADE_DURATION,
            1
        );

        const easedProgress =
            1 - Math.pow(1 - progress, 3);

        audio.volume =
            Math.max(
                0,
                startVolume * (1 - easedProgress)
            );

        if (progress < 1) {
            fadeAnimation =
                requestAnimationFrame(fade);
        } else {
            fadeAnimation = null;

            if (
                activeAudio === audio &&
                activeSoundObject === object
            ) {
                audio.pause();
                audio.currentTime = 0;
                audio.volume = SOUND_VOLUME;

                activeAudio = null;
                activeSoundObject = null;
            }
        }
    }

    fadeAnimation = requestAnimationFrame(fade);
}

function stopObjectSound(object) {
    if (
        activeSoundObject !== object ||
        !activeAudio
    ) {
        return;
    }

    fadeOutActiveSound(object);
}

/* ============================================================
   OBJECT CREATION
   ============================================================ */

let uniqueCounter = 0;
let bubbleEmitter = null;

function startBubbleEmitter(object) {
    if (!object.classList.contains('sciencelab-sound-object')) {
        return;
    }

    stopBubbleEmitter();

    function createHoverBubble() {
        const bubble = document.createElement('span');

        bubble.className = 'sciencelab-hover-bubble';

        const x = 38 + Math.random() * 24;
        const size = 4 + Math.random() * 5;

        bubble.style.left = `${x}%`;
        bubble.style.bottom = `${28 + Math.random() * 10}%`;
        bubble.style.width = `${size}px`;
        bubble.style.height = `${size}px`;

        bubble.style.setProperty(
            '--bubble-drift',
            `${-18 + Math.random() * 36}px`
        );

        bubble.style.setProperty(
            '--bubble-rise',
            `${55 + Math.random() * 45}px`
        );

        object.appendChild(bubble);

        setTimeout(() => {
            bubble.remove();
        }, 1800);
    }

    createHoverBubble();

    bubbleEmitter = setInterval(
        createHoverBubble,
        220
    );
}

function stopBubbleEmitter() {
    if (bubbleEmitter !== null) {
        clearInterval(bubbleEmitter);
        bubbleEmitter = null;
    }

    document
        .querySelectorAll('.sciencelab-hover-bubble')
        .forEach(bubble => bubble.remove());
}


function addScienceObject({
    className,
    svgTemplate,
    left,
    top,
    depth = 2,
    scale = 1,
    floatDuration = '6s',
    floatX = '7px',
    floatY = '-8px',
    rotationStart = '-2deg',
    rotationMid = '2deg',
    rotationEnd = '-1deg',
    sound = false
}) {
    const object = document.createElement('div');

    uniqueCounter++;

    object.className = [
        'sciencelab-item',
        className,
        `sciencelab-depth-${depth}`,
        'science-floating'
    ].join(' ');

    object.style.left = left;
    object.style.top = top;

    object.style.setProperty(
        '--float-duration',
        floatDuration
    );

    object.style.setProperty(
        '--float-x',
        floatX
    );

    object.style.setProperty(
        '--float-y',
        floatY
    );

    object.style.setProperty(
        '--rotation-start',
        rotationStart
    );

    object.style.setProperty(
        '--rotation-mid',
        rotationMid
    );

    object.style.setProperty(
        '--rotation-end',
        rotationEnd
    );

object.style.scale = String(scale * 1.18);

    if (sound) {
        object.classList.add(
            'sciencelab-sound-object'
        );
    }

    const svgStr =
        svgTemplate.replace(
            /_ID_PLACEHOLDER/g,
            `_${uniqueCounter}`
        );

    object.innerHTML = svgStr;

    const svg = object.querySelector('svg');

    if (svg) {
        const viewBox =
            svg.getAttribute('viewBox');

        if (viewBox) {
            const parts =
                viewBox.trim().split(/\s+/);

            const width =
                parseFloat(parts[2]);

            const height =
                parseFloat(parts[3]);

            if (
                Number.isFinite(width) &&
                Number.isFinite(height)
            ) {
                svg.setAttribute(
                    'width',
                    String(width)
                );

                svg.setAttribute(
                    'height',
                    String(height)
                );
            }
        }

        svg.style.pointerEvents =
            sound
                ? 'visiblePainted'
                : 'none';

        if (sound) {
           svg.addEventListener(
          'mouseenter',
          () => {
              startObjectSound(object);
              startBubbleEmitter(object);
          }
      );

      svg.addEventListener(
          'mouseleave',
          () => {
              stopObjectSound(object);
              stopBubbleEmitter();
          }
      );
        }
    }

    scienceBackground.appendChild(object);

    return object;
}

/* ============================================================
   PARTICLES
   ============================================================ */

function createParticles() {
    const particleCount = 45;

    for (
        let i = 0;
        i < particleCount;
        i++
    ) {
        const particle =
            document.createElement('div');

        particle.className =
            'sciencelab-particle';

        particle.style.left =
            `${Math.random() * 100}%`;

        particle.style.top =
            `${70 + Math.random() * 30}%`;

        particle.style.setProperty(
            '--particle-duration',
            `${13 + Math.random() * 14}s`
        );

        particle.style.setProperty(
            '--particle-drift',
            `${-55 + Math.random() * 110}px`
        );

        particle.style.animationDelay =
            `${-Math.random() * 18}s`;

        scienceBackground.appendChild(
            particle
        );
    }
}

/* ============================================================
   LIGHT BEAMS
   ============================================================ */

function createBeam(
    left,
    top,
    rotation,
    delay
) {
    const beam =
        document.createElement('div');

    beam.className =
        'sciencelab-beam';

    beam.style.left = left;
    beam.style.top = top;
    beam.style.width = '180px';

    beam.style.transform =
        `rotate(${rotation}deg)`;

    beam.style.animationDelay =
        delay;

    scienceBackground.appendChild(
        beam
    );
}

/* ============================================================
   MOUNT
   ============================================================ */

export function mount() {
    if (scienceBackground) {
        return;
    }

    scienceStylesheet =
        document.createElement('link');

    scienceStylesheet.rel =
        'stylesheet';

    scienceStylesheet.href =
        '/themes/theme-sciencelab.css';

    scienceStylesheet.dataset.theme =
        'sciencelab';

    document.head.appendChild(
        scienceStylesheet
    );

    scienceBackground =
        document.createElement('div');

    scienceBackground.id =
        'sciencelab-background';

    scienceBackground.style.pointerEvents =
        'none';

    document.body.appendChild(
        scienceBackground
    );

    const objects = [
        {
            className: 'science-flask',
            svgTemplate: ERLENMEYER_FLASK,
            left: '5%',
            top: '10%',
            depth: 2,
            scale: .35,
            floatDuration: '5.5s',
            floatX: '9px',
            floatY: '-12px',
            rotationStart: '-2deg',
            rotationMid: '2deg',
            rotationEnd: '-1deg',
            sound: true
        },

        {
            className: 'science-microscope',
            svgTemplate: MICROSCOPE,
            left: '23%',
            top: '7%',
            depth: 1,
            scale: .38,
            floatDuration: '7s',
            floatX: '-8px',
            floatY: '-9px',
            rotationStart: '1deg',
            rotationMid: '-2deg',
            rotationEnd: '1deg',
            sound: false
        },

        {
            className: 'science-chem-flask',
            svgTemplate: CHEMISTRY_FLASK,
            left: '46%',
            top: '9%',
            depth: 3,
            scale: .30,
            floatDuration: '5s',
            floatX: '8px',
            floatY: '-11px',
            rotationStart: '-1deg',
            rotationMid: '2deg',
            rotationEnd: '-2deg',
            sound: true
        },

        {
            className: 'science-round-flask',
            svgTemplate: ROUND_FLASK,
            left: '74%',
            top: '6%',
            depth: 2,
            scale: .33,
            floatDuration: '6.5s',
            floatX: '-9px',
            floatY: '-12px',
            rotationStart: '2deg',
            rotationMid: '-2deg',
            rotationEnd: '1deg',
            sound: true
        },

        {
            className: 'science-petri',
            svgTemplate: PETRI_DISH,
            left: '89%',
            top: '12%',
            depth: 1,
            scale: .28,
            floatDuration: '8s',
            floatX: '9px',
            floatY: '-7px',
            rotationStart: '-2deg',
            rotationMid: '2deg',
            rotationEnd: '-1deg',
            sound: true
        },

        {
            className: 'science-petri',
            svgTemplate: PETRI_DISH,
            left: '8%',
            top: '38%',
            depth: 1,
            scale: .32,
            floatDuration: '8.2s',
            floatX: '9px',
            floatY: '-7px',
            rotationStart: '-2deg',
            rotationMid: '2deg',
            rotationEnd: '-1deg',
            sound: true
        },

        {
            className: 'science-round-flask',
            svgTemplate: ROUND_FLASK,
            left: '26%',
            top: '35%',
            depth: 2,
            scale: .27,
            floatDuration: '5.8s',
            floatX: '-7px',
            floatY: '-10px',
            rotationStart: '1deg',
            rotationMid: '-2deg',
            rotationEnd: '1deg',
            sound: true
        },

        {
            className: 'science-microscope',
            svgTemplate: MICROSCOPE,
            left: '42%',
            top: '42%',
            depth: 1,
            scale: .36,
            floatDuration: '8.5s',
            floatX: '7px',
            floatY: '-8px',
            rotationStart: '0deg',
            rotationMid: '2deg',
            rotationEnd: '-1deg',
            sound: false
        },

        {
            className: 'science-flask',
            svgTemplate: ERLENMEYER_FLASK,
            left: '60%',
            top: '33%',
            depth: 2,
            scale: .30,
            floatDuration: '5.2s',
            floatX: '-8px',
            floatY: '-11px',
            rotationStart: '2deg',
            rotationMid: '-2deg',
            rotationEnd: '1deg',
            sound: true
        },

        {
            className: 'science-chem-flask',
            svgTemplate: CHEMISTRY_FLASK,
            left: '88%',
            top: '40%',
            depth: 3,
            scale: .33,
            floatDuration: '6.3s',
            floatX: '8px',
            floatY: '-10px',
            rotationStart: '-2deg',
            rotationMid: '2deg',
            rotationEnd: '-1deg',
            sound: true
        },

        {
            className: 'science-chem-flask',
            svgTemplate: CHEMISTRY_FLASK,
            left: '12%',
            top: '65%',
            depth: 3,
            scale: .29,
            floatDuration: '6s',
            floatX: '8px',
            floatY: '-10px',
            rotationStart: '-2deg',
            rotationMid: '2deg',
            rotationEnd: '-1deg',
            sound: true
        },

        {
            className: 'science-petri',
            svgTemplate: PETRI_DISH,
            left: '28%',
            top: '77%',
            depth: 2,
            scale: .31,
            floatDuration: '8.5s',
            floatX: '-8px',
            floatY: '-7px',
            rotationStart: '1deg',
            rotationMid: '-2deg',
            rotationEnd: '1deg',
            sound: true
        },

        {
            className: 'science-microscope',
            svgTemplate: MICROSCOPE,
            left: '53%',
            top: '73%',
            depth: 1,
            scale: .35,
            floatDuration: '7.5s',
            floatX: '8px',
            floatY: '-9px',
            rotationStart: '-1deg',
            rotationMid: '2deg',
            rotationEnd: '-1deg',
            sound: false
        },

        {
            className: 'science-round-flask',
            svgTemplate: ROUND_FLASK,
            left: '74%',
            top: '68%',
            depth: 2,
            scale: .32,
            floatDuration: '5.7s',
            floatX: '-9px',
            floatY: '-12px',
            rotationStart: '2deg',
            rotationMid: '-2deg',
            rotationEnd: '1deg',
            sound: true
        },

        {
            className: 'science-flask',
            svgTemplate: ERLENMEYER_FLASK,
            left: '91%',
            top: '81%',
            depth: 1,
            scale: .26,
            floatDuration: '8s',
            floatX: '7px',
            floatY: '-7px',
            rotationStart: '-1deg',
            rotationMid: '2deg',
            rotationEnd: '-1deg',
            sound: true
        },
           {
    className: 'science-cylinder',
    svgTemplate: SCIENCE_CYLINDER,
    left: '18%',
    top: '54%',
    depth: 2,
    scale: .20,
    floatDuration: '6.8s',
    floatX: '8px',
    floatY: '-10px',
    rotationStart: '-1deg',
    rotationMid: '2deg',
    rotationEnd: '-1deg',
    sound: true
},

        {
            className: 'science-petri',
            svgTemplate: PETRI_DISH,
            left: '3%',
            top: '88%',
            depth: 1,
            scale: .25,
            floatDuration: '7.1s',
            floatX: '5px',
            floatY: '-6px',
            rotationStart: '1deg',
            rotationMid: '-1deg',
            rotationEnd: '2deg',
            sound: true
        },

        {
            className: 'science-chem-flask',
            svgTemplate: CHEMISTRY_FLASK,
            left: '38%',
            top: '92%',
            depth: 2,
            scale: .30,
            floatDuration: '6.4s',
            floatX: '-8px',
            floatY: '-9px',
            rotationStart: '2deg',
            rotationMid: '-2deg',
            rotationEnd: '1deg',
            sound: true
        },

        {
            className: 'science-round-flask',
            svgTemplate: ROUND_FLASK,
            left: '62%',
            top: '89%',
            depth: 3,
            scale: .27,
            floatDuration: '5.5s',
            floatX: '8px',
            floatY: '-10px',
            rotationStart: '-2deg',
            rotationMid: '1deg',
            rotationEnd: '-1deg',
            sound: true
        },

        {
            className: 'science-microscope',
            svgTemplate: MICROSCOPE,
            left: '85%',
            top: '94%',
            depth: 2,
            scale: .28,
            floatDuration: '7.8s',
            floatX: '-7px',
            floatY: '-8px',
            rotationStart: '1deg',
            rotationMid: '-2deg',
            rotationEnd: '1deg',
            sound: false
        },

        {
            className: 'science-flask',
            svgTemplate: ERLENMEYER_FLASK,
            left: '48%',
            top: '22%',
            depth: 1,
            scale: .22,
            floatDuration: '5.1s',
            floatX: '6px',
            floatY: '-7px',
            rotationStart: '-1deg',
            rotationMid: '2deg',
            rotationEnd: '-1deg',
            sound: true
        },
    

{
    className: 'science-cylinder',
    svgTemplate: SCIENCE_CYLINDER,
    left: '79%',
    top: '53%',
    depth: 2,
    scale: .19,
    floatDuration: '6.2s',
    floatX: '7px',
    floatY: '-11px',
    rotationStart: '-2deg',
    rotationMid: '2deg',
    rotationEnd: '-1deg',
    sound: true
},

{
    className: 'science-cylinder',
    svgTemplate: SCIENCE_CYLINDER,
    left: '52%',
    top: '15%',
    depth: 1,
    scale: .17,
    floatDuration: '7.4s',
    floatX: '-7px',
    floatY: '-9px',
    rotationStart: '1deg',
    rotationMid: '-2deg',
    rotationEnd: '1deg',
    sound: true
}
    ];

    objects.forEach(config => {
        addScienceObject(config);
    });

    createParticles();

    createBeam(
        '12%',
        '24%',
        -7,
        '-2s'
    );

    createBeam(
        '57%',
        '62%',
        5,
        '-5s'
    );

    createBeam(
        '80%',
        '15%',
        12,
        '-1s'
    );

    createBeam(
        '30%',
        '80%',
        -10,
        '-3s'
    );

    playScienceIntro();
}

/* ============================================================
   UNMOUNT
   ============================================================ */
export function unmount() {
    finishScienceIntro();
    stopActiveSound();
    stopBubbleEmitter();
    if (scienceBackground) {
        scienceBackground.remove();
        scienceBackground = null;
    }

    if (scienceStylesheet) {
        scienceStylesheet.remove();
        scienceStylesheet = null;
    }
}