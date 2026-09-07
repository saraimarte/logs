/* ============================================================
   AURORA THEME
   ============================================================ */

let auroraRoot = null;


/* ============================================================
   CREATE AURORA SVG
   ============================================================ */

function createAuroraSVG() {

    const SVG_NS = "http://www.w3.org/2000/svg";

    const svg = document.createElementNS(
        SVG_NS,
        "svg"
    );

    svg.setAttribute(
        "viewBox",
        "0 0 1600 1000"
    );

    svg.setAttribute(
        "preserveAspectRatio",
        "xMidYMid slice"
    );

    svg.setAttribute(
        "aria-hidden",
        "true"
    );


    /* ========================================================
       DEFINITIONS
       ======================================================== */

    const defs = document.createElementNS(
        SVG_NS,
        "defs"
    );


    /* Green */

    const green = document.createElementNS(
        SVG_NS,
        "linearGradient"
    );

    green.id = "aurora-green";

    green.setAttribute("x1", "0");
    green.setAttribute("y1", "0");
    green.setAttribute("x2", "1");
    green.setAttribute("y2", "0");

    green.innerHTML = `
        <stop
            offset="0%"
            stop-color="#20cfa0"
            stop-opacity="0"
        />

        <stop
            offset="18%"
            stop-color="#35e8b4"
            stop-opacity=".20"
        />

        <stop
            offset="36%"
            stop-color="#64ffd2"
            stop-opacity=".70"
        />

        <stop
            offset="50%"
            stop-color="#a2ffe4"
            stop-opacity=".90"
        />

        <stop
            offset="65%"
            stop-color="#47e8b9"
            stop-opacity=".60"
        />

        <stop
            offset="83%"
            stop-color="#20c39e"
            stop-opacity=".18"
        />

        <stop
            offset="100%"
            stop-color="#16a58a"
            stop-opacity="0"
        />
    `;

    defs.appendChild(green);


    /* Cyan */

    const cyan = document.createElementNS(
        SVG_NS,
        "linearGradient"
    );

    cyan.id = "aurora-cyan";

    cyan.setAttribute("x1", "0");
    cyan.setAttribute("y1", "0");
    cyan.setAttribute("x2", "1");
    cyan.setAttribute("y2", "0");

    cyan.innerHTML = `
        <stop
            offset="0%"
            stop-color="#2bc8ef"
            stop-opacity="0"
        />

        <stop
            offset="22%"
            stop-color="#3bdff5"
            stop-opacity=".15"
        />

        <stop
            offset="42%"
            stop-color="#89f7ff"
            stop-opacity=".55"
        />

        <stop
            offset="54%"
            stop-color="#c1ffff"
            stop-opacity=".68"
        />

        <stop
            offset="70%"
            stop-color="#4de4ef"
            stop-opacity=".40"
        />

        <stop
            offset="100%"
            stop-color="#1d9fc8"
            stop-opacity="0"
        />
    `;

    defs.appendChild(cyan);


    /* Purple */

    const purple = document.createElementNS(
        SVG_NS,
        "linearGradient"
    );

    purple.id = "aurora-purple";

    purple.setAttribute("x1", "0");
    purple.setAttribute("y1", "0");
    purple.setAttribute("x2", "1");
    purple.setAttribute("y2", "0");

    purple.innerHTML = `
        <stop
            offset="0%"
            stop-color="#7255e8"
            stop-opacity="0"
        />

        <stop
            offset="25%"
            stop-color="#9578ff"
            stop-opacity=".12"
        />

        <stop
            offset="48%"
            stop-color="#c69aff"
            stop-opacity=".38"
        />

        <stop
            offset="62%"
            stop-color="#dcb0ff"
            stop-opacity=".30"
        />

        <stop
            offset="82%"
            stop-color="#876aff"
            stop-opacity=".12"
        />

        <stop
            offset="100%"
            stop-color="#6449dc"
            stop-opacity="0"
        />
    `;

    defs.appendChild(purple);


    /* Large blur */

    const largeBlur = document.createElementNS(
        SVG_NS,
        "filter"
    );

    largeBlur.id = "aurora-large-blur";

    largeBlur.setAttribute("x", "-30%");
    largeBlur.setAttribute("y", "-50%");
    largeBlur.setAttribute("width", "160%");
    largeBlur.setAttribute("height", "200%");

    const largeBlurNode = document.createElementNS(
        SVG_NS,
        "feGaussianBlur"
    );

    largeBlurNode.setAttribute(
        "stdDeviation",
        "34"
    );

    largeBlur.appendChild(
        largeBlurNode
    );

    defs.appendChild(
        largeBlur
    );


    /* Medium blur */

    const mediumBlur = document.createElementNS(
        SVG_NS,
        "filter"
    );

    mediumBlur.id = "aurora-medium-blur";

    mediumBlur.setAttribute("x", "-25%");
    mediumBlur.setAttribute("y", "-40%");
    mediumBlur.setAttribute("width", "150%");
    mediumBlur.setAttribute("height", "180%");

    const mediumBlurNode = document.createElementNS(
        SVG_NS,
        "feGaussianBlur"
    );

    mediumBlurNode.setAttribute(
        "stdDeviation",
        "14"
    );

    mediumBlur.appendChild(
        mediumBlurNode
    );

    defs.appendChild(
        mediumBlur
    );


    /* Small glow */

    const glowBlur = document.createElementNS(
        SVG_NS,
        "filter"
    );

    glowBlur.id = "aurora-glow-blur";

    const glowBlurNode = document.createElementNS(
        SVG_NS,
        "feGaussianBlur"
    );

    glowBlurNode.setAttribute(
        "stdDeviation",
        "5"
    );

    glowBlur.appendChild(
        glowBlurNode
    );

    defs.appendChild(
        glowBlur
    );


    svg.appendChild(defs);


    /* ========================================================
       STARS
       ======================================================== */

    const stars = document.createElementNS(
        SVG_NS,
        "g"
    );

    stars.setAttribute(
        "opacity",
        ".38"
    );

    const starData = [
        [90, 110, 1.0],
        [174, 190, .65],
        [260, 90, .85],
        [347, 155, .60],
        [430, 72, .90],
        [520, 225, .60],
        [610, 115, .75],
        [700, 65, .90],
        [790, 175, .55],
        [875, 95, .75],
        [960, 235, .60],
        [1050, 72, .80],
        [1140, 155, .60],
        [1225, 92, .90],
        [1310, 215, .55],
        [1400, 120, .80],
        [1500, 185, .60],

        [55, 315, .55],
        [205, 355, .60],
        [370, 290, .50],
        [540, 345, .60],
        [690, 305, .50],
        [835, 365, .55],
        [995, 300, .50],
        [1150, 350, .60],
        [1320, 310, .50],
        [1480, 375, .55]
    ];

    starData.forEach(
        ([x, y, r]) => {

            const star =
                document.createElementNS(
                    SVG_NS,
                    "circle"
                );

            star.setAttribute(
                "cx",
                x
            );

            star.setAttribute(
                "cy",
                y
            );

            star.setAttribute(
                "r",
                r
            );

            star.setAttribute(
                "fill",
                "#dffcff"
            );

            stars.appendChild(star);
        }
    );

    svg.appendChild(stars);


    /* ========================================================
       CURTAIN 1
       ======================================================== */

    const curtain1 =
        document.createElementNS(
            SVG_NS,
            "path"
        );

    curtain1.setAttribute(
        "class",
        "aurora-curtain aurora-curtain-1"
    );

    curtain1.setAttribute(
        "d",
        `
            M -250 170

            C 20 45,
              190 70,
              390 235

            C 570 385,
              655 490,
              790 360

            C 925 225,
              1035 65,
              1190 170

            C 1370 290,
              1490 395,
              1850 150

            L 1850 525

            C 1510 605,
              1370 515,
              1190 385

            C 1030 270,
              925 440,
              790 570

            C 630 720,
              540 535,
              370 425

            C 175 300,
              15 415,
              -250 500

            Z
        `
    );

    curtain1.setAttribute(
        "fill",
        "url(#aurora-green)"
    );

    curtain1.setAttribute(
        "filter",
        "url(#aurora-large-blur)"
    );

    curtain1.setAttribute(
        "opacity",
        ".76"
    );

    svg.appendChild(curtain1);


    /* ========================================================
       CURTAIN 2
       ======================================================== */

    const curtain2 =
        document.createElementNS(
            SVG_NS,
            "path"
        );

    curtain2.setAttribute(
        "class",
        "aurora-curtain aurora-curtain-2"
    );

    curtain2.setAttribute(
        "d",
        `
            M -220 245

            C 80 115,
              245 260,
              470 350

            C 645 420,
              730 285,
              875 205

            C 1025 120,
              1135 260,
              1280 350

            C 1450 455,
              1580 350,
              1820 225

            L 1820 565

            C 1570 660,
              1430 565,
              1260 475

            C 1090 385,
              1000 310,
              855 425

            C 690 555,
              595 585,
              430 490

            C 240 380,
              80 495,
              -220 585

            Z
        `
    );

    curtain2.setAttribute(
        "fill",
        "url(#aurora-cyan)"
    );

    curtain2.setAttribute(
        "filter",
        "url(#aurora-large-blur)"
    );

    curtain2.setAttribute(
        "opacity",
        ".53"
    );

    svg.appendChild(curtain2);


    /* ========================================================
       CURTAIN 3
       ======================================================== */

    const curtain3 =
        document.createElementNS(
            SVG_NS,
            "path"
        );

    curtain3.setAttribute(
        "class",
        "aurora-curtain aurora-curtain-3"
    );

    curtain3.setAttribute(
        "d",
        `
            M -230 130

            C 80 265,
              245 50,
              470 195

            C 665 320,
              735 445,
              900 335

            C 1050 235,
              1165 95,
              1330 205

            C 1480 300,
              1580 235,
              1830 105

            L 1830 445

            C 1570 510,
              1450 465,
              1305 380

            C 1140 285,
              1050 405,
              900 505

            C 735 620,
              620 495,
              450 400

            C 240 285,
              95 420,
              -230 455

            Z
        `
    );

    curtain3.setAttribute(
        "fill",
        "url(#aurora-purple)"
    );

    curtain3.setAttribute(
        "filter",
        "url(#aurora-large-blur)"
    );

    curtain3.setAttribute(
        "opacity",
        ".30"
    );

    svg.appendChild(curtain3);


    /* ========================================================
       CURTAIN 4
       ======================================================== */

    const curtain4 =
        document.createElementNS(
            SVG_NS,
            "path"
        );

    curtain4.setAttribute(
        "class",
        "aurora-curtain aurora-curtain-4"
    );

    curtain4.setAttribute(
        "d",
        `
            M -220 290

            C 90 155,
              270 305,
              480 410

            C 655 495,
              760 415,
              890 295

            C 1015 180,
              1120 245,
              1275 345

            C 1450 460,
              1580 390,
              1820 275

            L 1820 550

            C 1570 635,
              1420 570,
              1260 470

            C 1090 370,
              1010 365,
              875 485

            C 700 635,
              570 590,
              410 505

            C 220 400,
              70 515,
              -220 575

            Z
        `
    );

    curtain4.setAttribute(
        "fill",
        "url(#aurora-green)"
    );

    curtain4.setAttribute(
        "filter",
        "url(#aurora-medium-blur)"
    );

    curtain4.setAttribute(
        "opacity",
        ".40"
    );

    svg.appendChild(curtain4);


    /* ========================================================
       INNER RIBBON 1
       ======================================================== */

    const ribbon1 =
        document.createElementNS(
            SVG_NS,
            "path"
        );

    ribbon1.setAttribute(
        "class",
        "aurora-ribbon aurora-ribbon-1"
    );

    ribbon1.setAttribute(
        "d",
        `
            M -100 270

            C 120 125,
              270 175,
              430 295

            C 590 415,
              690 465,
              815 345

            C 950 215,
              1050 120,
              1190 200

            C 1340 285,
              1470 385,
              1710 220
        `
    );

    ribbon1.setAttribute(
        "fill",
        "none"
    );

    ribbon1.setAttribute(
        "stroke",
        "url(#aurora-green)"
    );

    ribbon1.setAttribute(
        "stroke-width",
        "18"
    );

    ribbon1.setAttribute(
        "stroke-linecap",
        "round"
    );

    ribbon1.setAttribute(
        "filter",
        "url(#aurora-medium-blur)"
    );

    ribbon1.setAttribute(
        "opacity",
        ".72"
    );

    svg.appendChild(ribbon1);


    /* ========================================================
       INNER RIBBON 2
       ======================================================== */

    const ribbon2 =
        document.createElementNS(
            SVG_NS,
            "path"
        );

    ribbon2.setAttribute(
        "class",
        "aurora-ribbon aurora-ribbon-2"
    );

    ribbon2.setAttribute(
        "d",
        `
            M -100 335

            C 140 205,
              290 295,
              470 375

            C 650 455,
              730 385,
              890 265

            C 1040 150,
              1160 280,
              1320 370

            C 1480 460,
              1600 385,
              1710 315
        `
    );

    ribbon2.setAttribute(
        "fill",
        "none"
    );

    ribbon2.setAttribute(
        "stroke",
        "url(#aurora-cyan)"
    );

    ribbon2.setAttribute(
        "stroke-width",
        "11"
    );

    ribbon2.setAttribute(
        "stroke-linecap",
        "round"
    );

    ribbon2.setAttribute(
        "filter",
        "url(#aurora-glow-blur)"
    );

    ribbon2.setAttribute(
        "opacity",
        ".62"
    );

    svg.appendChild(ribbon2);


    /* ========================================================
       INNER RIBBON 3
       ======================================================== */

    const ribbon3 =
        document.createElementNS(
            SVG_NS,
            "path"
        );

    ribbon3.setAttribute(
        "class",
        "aurora-ribbon aurora-ribbon-3"
    );

    ribbon3.setAttribute(
        "d",
        `
            M -120 200

            C 120 295,
              240 115,
              460 225

            C 650 325,
              720 445,
              895 350

            C 1050 265,
              1160 130,
              1320 235

            C 1470 330,
              1580 295,
              1740 185
        `
    );

    ribbon3.setAttribute(
        "fill",
        "none"
    );

    ribbon3.setAttribute(
        "stroke",
        "url(#aurora-purple)"
    );

    ribbon3.setAttribute(
        "stroke-width",
        "14"
    );

    ribbon3.setAttribute(
        "stroke-linecap",
        "round"
    );

    ribbon3.setAttribute(
        "filter",
        "url(#aurora-medium-blur)"
    );

    ribbon3.setAttribute(
        "opacity",
        ".38"
    );

    svg.appendChild(ribbon3);


    /* ========================================================
       THIN HIGHLIGHT
       ======================================================== */

    const ribbon4 =
        document.createElementNS(
            SVG_NS,
            "path"
        );

    ribbon4.setAttribute(
        "class",
        "aurora-ribbon aurora-ribbon-4"
    );

    ribbon4.setAttribute(
        "d",
        `
            M -100 280

            C 130 140,
              270 195,
              440 310

            C 600 420,
              690 460,
              820 345

            C 950 230,
              1050 140,
              1195 215

            C 1350 295,
              1470 385,
              1710 230
        `
    );

    ribbon4.setAttribute(
        "fill",
        "none"
    );

    ribbon4.setAttribute(
        "stroke",
        "#c9fff1"
    );

    ribbon4.setAttribute(
        "stroke-width",
        "2.5"
    );

    ribbon4.setAttribute(
        "stroke-linecap",
        "round"
    );

    ribbon4.setAttribute(
        "filter",
        "url(#aurora-glow-blur)"
    );

    ribbon4.setAttribute(
        "opacity",
        ".35"
    );

    svg.appendChild(ribbon4);


    return svg;
}


/* ============================================================
   MOUNT
   ============================================================ */

function auroraOriginalMount() {

    const existing =
        document.getElementById(
            "aurora-background"
        );

    if (existing) {
        auroraRoot = existing;
        return;
    }


    auroraRoot =
        document.createElement(
            "div"
        );

    auroraRoot.id =
        "aurora-background";

    auroraRoot.setAttribute(
        "aria-hidden",
        "true"
    );


    const svg =
        createAuroraSVG();


    auroraRoot.appendChild(
        svg
    );


    /*
     * Put ONLY the background into the body.
     *
     * Do not touch:
     * - tabs
     * - views
     * - cursor
     * - cursor picker
     * - companions
     */

    document.body.appendChild(
        auroraRoot
    );
}


/* ============================================================
   UNMOUNT
   ============================================================ */

function auroraOriginalUnmount() {

    const existing =
        document.getElementById(
            "aurora-background"
        );

    if (existing) {
        existing.remove();
    }

    auroraRoot = null;
}

/* ============================================================
   INTRO AUDIO ADDITION
   ============================================================ */
let auroraIntroAudio = null;
let auroraIntroFallback = null;
let auroraIntroTimer = null;
const AURORA_INTRO_SRC = "/sounds/intros/white_records-odessa-bulgarish-background-funny-music-for-video-reggaeton-version-180420.mp3";
const AURORA_INTRO_VOLUME = 0.27;
const AURORA_INTRO_END = 20;
const AURORA_INTRO_FADE_START = 15;
const AURORA_INTRO_FULL = false;
const AURORA_INTRO_FADE_END = false;

function auroraClearIntroFallback() {
    if (!auroraIntroFallback) return;
    window.removeEventListener("pointerdown", auroraIntroFallback);
    window.removeEventListener("keydown", auroraIntroFallback);
    auroraIntroFallback = null;
}

function auroraStopIntro() {
    if (auroraIntroTimer) {
        clearInterval(auroraIntroTimer);
        auroraIntroTimer = null;
    }
    auroraClearIntroFallback();
    document.body.classList.remove("theme-aurora-intro-playing");
    if (auroraIntroAudio) {
        try {
            auroraIntroAudio.pause();
            auroraIntroAudio.currentTime = 0;
        } catch (_) {}
    }
    auroraIntroAudio = null;
}

function auroraPlayIntro() {
    auroraStopIntro();
    const audio = new Audio(AURORA_INTRO_SRC);
    auroraIntroAudio = audio;
    audio.preload = "auto";
    audio.volume = AURORA_INTRO_VOLUME;

    audio.addEventListener("playing", () => {
        document.body.classList.add("theme-aurora-intro-playing");
        auroraClearIntroFallback();
    });

    audio.addEventListener("ended", () => {
        auroraStopIntro();
    }, { once: true });

    audio.addEventListener("error", () => {
        auroraStopIntro();
    }, { once: true });

    auroraIntroTimer = setInterval(() => {
        if (auroraIntroAudio !== audio) return;
        const t = audio.currentTime || 0;

        if (AURORA_INTRO_END != null) {
            if (AURORA_INTRO_FADE_START != null && t >= AURORA_INTRO_FADE_START) {
                const len = Math.max(.001, AURORA_INTRO_END - AURORA_INTRO_FADE_START);
                const p = Math.min(1, (t - AURORA_INTRO_FADE_START) / len);
                audio.volume = Math.max(0, AURORA_INTRO_VOLUME * (1 - p));
            }
            if (t >= AURORA_INTRO_END) {
                auroraStopIntro();
            }
        } else if (AURORA_INTRO_FULL && AURORA_INTRO_FADE_END &&
                   Number.isFinite(audio.duration) && audio.duration > 0) {
            const remaining = audio.duration - t;
            if (remaining <= 3) {
                audio.volume = Math.max(0, AURORA_INTRO_VOLUME * (remaining / 3));
            }
        }
    }, 120);

    const p = audio.play();
    if (p && typeof p.catch === "function") {
        p.catch(() => {
            if (auroraIntroFallback || auroraIntroAudio !== audio) return;
            auroraIntroFallback = () => {
                if (auroraIntroAudio !== audio) return;
                const retry = audio.play();
                if (retry && typeof retry.catch === "function") retry.catch(() => {});
            };
            window.addEventListener("pointerdown", auroraIntroFallback);
            window.addEventListener("keydown", auroraIntroFallback);
        });
    }
}

export function mount() {
    auroraOriginalMount();
    auroraPlayIntro();
}

export function unmount() {
    auroraStopIntro();
    auroraOriginalUnmount();
}
