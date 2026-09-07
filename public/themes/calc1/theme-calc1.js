let themeBackground = null;
let themeStylesheet = null;
let themeAudio = null;
let themeMouseHandler = null;
let themeClickHandler = null;
let themeItems = [];
let lastGlobalSound = 0;
let themePointerFrame = null;

const THEME_SVGS = ["<svg viewBox=\"0 0 125 115\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M16 98V15 M16 98H112\" stroke=\"currentColor\" stroke-width=\"4\"/><path d=\"M22 88 Q47 78 61 57 Q80 28 108 22\" fill=\"none\" stroke=\"#6596d2\" stroke-width=\"6\"/><circle cx=\"61\" cy=\"57\" r=\"5\" fill=\"#7fc4a2\"/></svg>", "<svg viewBox=\"0 0 270 112\" xmlns=\"http://www.w3.org/2000/svg\"><text x=\"8\" y=\"37\" font-size=\"25\" font-family=\"serif\" font-style=\"italic\" fill=\"currentColor\">f′(x) = lim</text><text x=\"103\" y=\"55\" font-size=\"13\" font-family=\"serif\" fill=\"currentColor\">h→0</text><text x=\"143\" y=\"34\" font-size=\"23\" font-family=\"serif\" fill=\"currentColor\">f(x+h) − f(x)</text><path d=\"M140 45H262\" stroke=\"currentColor\" stroke-width=\"2\"/><text x=\"196\" y=\"74\" font-size=\"23\" font-family=\"serif\" fill=\"currentColor\">h</text></svg>", "<svg viewBox=\"0 0 220 102\" xmlns=\"http://www.w3.org/2000/svg\"><text x=\"8\" y=\"32\" font-size=\"24\" font-family=\"serif\" fill=\"currentColor\">Difference Quotient</text><text x=\"35\" y=\"60\" font-size=\"22\" font-family=\"serif\" fill=\"currentColor\">f(x+h) − f(x)</text><path d=\"M32 70H184\" stroke=\"currentColor\" stroke-width=\"2\"/><text x=\"102\" y=\"94\" font-size=\"22\" font-family=\"serif\" fill=\"currentColor\">h</text></svg>", "<svg viewBox=\"0 0 205 86\" xmlns=\"http://www.w3.org/2000/svg\"><text x=\"10\" y=\"53\" font-size=\"31\" font-family=\"serif\" font-weight=\"700\" fill=\"currentColor\">d/dx(xⁿ) = nxⁿ⁻¹</text></svg>", "<svg viewBox=\"0 0 180 92\" xmlns=\"http://www.w3.org/2000/svg\"><text x=\"10\" y=\"36\" font-size=\"24\" font-family=\"serif\" fill=\"currentColor\">lim</text><text x=\"8\" y=\"61\" font-size=\"13\" font-family=\"serif\" fill=\"currentColor\">x→a</text><text x=\"57\" y=\"49\" font-size=\"29\" font-family=\"serif\" font-style=\"italic\" fill=\"currentColor\">f(x) = L</text></svg>", "<svg viewBox=\"0 0 225 105\" xmlns=\"http://www.w3.org/2000/svg\"><text x=\"8\" y=\"34\" font-size=\"24\" font-family=\"serif\" fill=\"currentColor\">Average rate =</text><text x=\"44\" y=\"62\" font-size=\"21\" font-family=\"serif\" fill=\"currentColor\">f(b) − f(a)</text><path d=\"M40 70H165\" stroke=\"currentColor\" stroke-width=\"2\"/><text x=\"76\" y=\"94\" font-size=\"21\" font-family=\"serif\" fill=\"currentColor\">b − a</text></svg>", "<svg viewBox=\"0 0 205 86\" xmlns=\"http://www.w3.org/2000/svg\"><text x=\"10\" y=\"54\" font-size=\"31\" font-family=\"serif\" font-weight=\"700\" fill=\"currentColor\">f′(a) = tangent slope</text></svg>", "<svg viewBox=\"0 0 170 100\" xmlns=\"http://www.w3.org/2000/svg\"><text x=\"16\" y=\"37\" font-size=\"24\" font-family=\"serif\" fill=\"currentColor\">f′(x) = 3x² − 4</text><text x=\"16\" y=\"72\" font-size=\"22\" font-family=\"serif\" fill=\"currentColor\">f(x)=x³−4x+C</text></svg>", "<svg viewBox=\"0 0 125 115\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M14 98V16 M14 98H112\" stroke=\"currentColor\" stroke-width=\"4\"/><path d=\"M22 88 Q45 73 56 52 Q70 28 106 22\" fill=\"none\" stroke=\"#7fc4a2\" stroke-width=\"6\"/><path d=\"M35 73 L82 35\" stroke=\"#6596d2\" stroke-width=\"4\"/></svg>", "<svg viewBox=\"0 0 200 90\" xmlns=\"http://www.w3.org/2000/svg\"><text x=\"12\" y=\"52\" font-size=\"30\" font-family=\"serif\" font-weight=\"700\" fill=\"currentColor\">f continuous at x=a</text></svg>"];
const THEME_NOTES = [261.63, 311.13, 392.0, 493.88];
const SOUND_STYLE = "click";

function rand(min, max) {
    return Math.random() * (max - min) + min;
}

const CALC_BURST_SYMBOLS = ["f′", "Δx", "lim", "dy/dx", "h→0", "m"];

function updateCalcPointer(x, y) {
    if (!themeBackground) return;

    const parallaxX = ((x / Math.max(window.innerWidth, 1)) - 0.5) * 16;
    const parallaxY = ((y / Math.max(window.innerHeight, 1)) - 0.5) * 12;

    /*
     * Use exact viewport pixels for the spotlight center so the glow
     * sits directly under the pointer instead of being offset by the
     * enlarged decorative spotlight layer.
     */
    themeBackground.style.setProperty("--calc-pointer-x", `${x}px`);
    themeBackground.style.setProperty("--calc-pointer-y", `${y}px`);
    themeBackground.style.setProperty("--calc-parallax-x", `${parallaxX}px`);
    themeBackground.style.setProperty("--calc-parallax-y", `${parallaxY}px`);
}

function createCalcBurst(x, y) {
    if (!themeBackground) return;

    const count = 7;

    for (let i = 0; i < count; i++) {
        const symbol = document.createElement("span");
        symbol.className = "theme-calc1-burst-symbol";
        symbol.textContent =
            CALC_BURST_SYMBOLS[
                Math.floor(Math.random() * CALC_BURST_SYMBOLS.length)
            ];

        const angle = (Math.PI * 2 * i) / count + rand(-0.25, 0.25);
        const distance = rand(30, 62);

        symbol.style.left = `${x}px`;
        symbol.style.top = `${y}px`;
        symbol.style.setProperty("--burst-x", `${Math.cos(angle) * distance}px`);
        symbol.style.setProperty("--burst-y", `${Math.sin(angle) * distance}px`);
        symbol.style.setProperty("--burst-rotate", `${rand(-18, 18)}deg`);

        themeBackground.appendChild(symbol);

        setTimeout(() => symbol.remove(), 760);
    }
}

function createCalcRipple(x, y) {
    if (!themeBackground) return;

    const ripple = document.createElement("span");
    ripple.className = "theme-calc1-click-ripple";
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;

    themeBackground.appendChild(ripple);
    setTimeout(() => ripple.remove(), 820);
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
    const osc = ctx.createOscillator();
    const osc2 = ctx.createOscillator();

    let type = "sine";
    let type2 = "triangle";
    let duration = .45;
    let volume = .10;
    let cutoff = 2800;

    switch (SOUND_STYLE) {
        case "ding":
        case "clink":
        case "sparkle":
        case "shutter":
        case "chime":
            type = "sine"; type2 = "sine"; duration = .55; volume = .11; cutoff = 4600; break;
        case "engine":
        case "alarm":
            type = "sawtooth"; type2 = "triangle"; duration = .30; volume = .07; cutoff = 900; freq *= .6; break;
        case "flip":
        case "scratch":
        case "draft":
            type = "triangle"; type2 = "sine"; duration = .24; volume = .07; cutoff = 2200; break;
        case "cash":
        case "coin":
            type = "square"; type2 = "sine"; duration = .24; volume = .07; cutoff = 3800; break;
        case "arcade":
        case "digital":
        case "click":
        case "beep":
            type = "square"; type2 = "triangle"; duration = .22; volume = .065; cutoff = 3900; break;
        case "chirp":
        case "buzz":
        case "swish":
        case "pop":
        case "snip":
        case "tap":
            type = "triangle"; type2 = "sine"; duration = .28; volume = .075; cutoff = 2500; break;
        case "applause":
            type = "triangle"; type2 = "sine"; duration = .40; volume = .09; cutoff = 2200; break;
    }

    filter.type = "lowpass";
    filter.frequency.setValueAtTime(cutoff, now);
    master.gain.setValueAtTime(.0001, now);
    master.gain.exponentialRampToValueAtTime(volume, now + .008);
    master.gain.exponentialRampToValueAtTime(.0001, now + duration);

    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);
    osc2.type = type2;
    osc2.frequency.setValueAtTime(freq * 1.5, now);

    const g2 = ctx.createGain();
    g2.gain.setValueAtTime(.28, now);
    g2.gain.exponentialRampToValueAtTime(.0001, now + Math.max(.16, duration * .7));

    osc.connect(filter);
    osc2.connect(g2);
    g2.connect(filter);
    filter.connect(master);
    master.connect(ctx.destination);

    if (SOUND_STYLE === "chirp") {
        osc.frequency.exponentialRampToValueAtTime(freq * 1.35, now + duration);
    }
    if (SOUND_STYLE === "buzz") {
        osc.frequency.setValueAtTime(freq, now);
        osc.frequency.setValueAtTime(freq * 1.03, now + .03);
        osc.frequency.setValueAtTime(freq * .97, now + .06);
        osc.frequency.setValueAtTime(freq * 1.03, now + .09);
    }
    if (SOUND_STYLE === "arcade" || SOUND_STYLE === "digital" || SOUND_STYLE === "click" || SOUND_STYLE === "beep") {
        osc.frequency.setValueAtTime(freq, now);
        osc.frequency.setValueAtTime(freq * 1.22, now + .07);
        osc.frequency.setValueAtTime(freq * .92, now + .14);
    }

    osc.start(now);
    osc2.start(now);
    osc.stop(now + duration + .05);
    osc2.stop(now + duration + .05);
}

function buildBackdrop() {
    const haze = document.createElement("div");
    haze.className = "theme-calc1-haze";
    themeBackground.appendChild(haze);

    const spotlight = document.createElement("div");
    spotlight.className = "theme-calc1-spotlight";
    themeBackground.appendChild(spotlight);

    const pattern = document.createElement("div");
    pattern.className = "theme-calc1-pattern";
    themeBackground.appendChild(pattern);

    const curveScene = document.createElement("div");
    curveScene.className = "theme-calc1-curve-scene";
    curveScene.innerHTML = `
        <svg viewBox="0 0 720 260" aria-hidden="true">
            <path class="calc-curve" d="M20 218 C130 208 155 162 250 154 C350 146 405 54 535 78 C610 91 650 60 700 30"/>
            <path class="calc-tangent" d="M245 184 L455 85"/>
            <circle class="calc-point calc-point-a" cx="350" cy="128" r="7"/>
            <circle class="calc-point calc-point-b" cx="415" cy="103" r="5"/>
        </svg>
    `;
    themeBackground.appendChild(curveScene);

    const labels = document.createElement("div");
    labels.className = "theme-calc1-floating-labels";
    ["f(x)", "f′(x)", "Δx", "lim", "h→0"].forEach((text, index) => {
        const label = document.createElement("span");
        label.textContent = text;
        label.style.setProperty("--label-index", String(index));
        labels.appendChild(label);
    });
    themeBackground.appendChild(labels);

    const horizon = document.createElement("div");
    horizon.className = "theme-calc1-horizon";
    themeBackground.appendChild(horizon);
}

function addObject(svg, i, left, top, scale, rotate) {
    const item = document.createElement("div");
    item.className = "theme-calc1-item";
    item.style.left = left;
    item.style.top = top;
    item.style.setProperty("--item-scale", scale);
    item.style.setProperty("--item-rotate", rotate + "deg");
    item.style.setProperty("--item-delay", (-rand(0, 8)).toFixed(2) + "s");
    item.style.setProperty("--item-x", rand(-10,10).toFixed(1) + "px");
    item.style.setProperty("--item-y", rand(-8,8).toFixed(1) + "px");
    item.style.setProperty("--item-glow", rand(.14, .30).toFixed(2));
    item.innerHTML = svg;
    item.setAttribute("aria-hidden", "true");
    themeBackground.appendChild(item);
    themeItems.push({ el:item, note:THEME_NOTES[i % THEME_NOTES.length], last:0 });
}

function createObjects() {
    const positions = [
        [8,22,.70,-8],[28,18,.58,5],[72,19,.61,-4],[92,28,.70,8],
        [11,50,.62,4],[88,52,.64,-5],
        [17,78,.65,-6],[38,84,.55,4],[64,81,.60,-3],[85,77,.66,6]
    ];
    positions.forEach((p, i) => {
        addObject(THEME_SVGS[i % THEME_SVGS.length], i, p[0] + "%", p[1] + "%", p[2], p[3]);
    });
}

function startInteraction() {
    const radius = 92;

    themeMouseHandler = (event) => {
        const x = event.clientX;
        const y = event.clientY;

        if (themePointerFrame) {
            cancelAnimationFrame(themePointerFrame);
        }

        themePointerFrame = requestAnimationFrame(() => {
            updateCalcPointer(x, y);
            themePointerFrame = null;
        });

        const now = performance.now();

        themeItems.forEach((obj) => {
            const r = obj.el.getBoundingClientRect();
            const cx = r.left + r.width / 2;
            const cy = r.top + r.height / 2;

            if (
                Math.hypot(cx - x, cy - y) <= radius &&
                now - obj.last > 650 &&
                now - lastGlobalSound > 110
            ) {
                obj.last = now;
                lastGlobalSound = now;

                obj.el.classList.remove("theme-calc1-react");
                void obj.el.offsetWidth;
                obj.el.classList.add("theme-calc1-react");

                createCalcBurst(cx, cy);
                playThemeSound(obj.note);

                setTimeout(
                    () => obj.el.classList.remove("theme-calc1-react"),
                    520
                );
            }
        });
    };

    themeClickHandler = (event) => {
        createCalcRipple(event.clientX, event.clientY);
    };

    window.addEventListener("mousemove", themeMouseHandler, { passive: true });
    window.addEventListener("pointerdown", themeClickHandler, { passive: true });
}

export function mount() {
    if (themeBackground) return;

    themeStylesheet = document.createElement("link");
    themeStylesheet.rel = "stylesheet";
    themeStylesheet.href = "/themes/theme-calc1.css";
    themeStylesheet.dataset.theme = "calc1";
    document.head.appendChild(themeStylesheet);

    themeBackground = document.createElement("div");
    themeBackground.id = "calc1-background";
    themeBackground.setAttribute("aria-hidden", "true");
    document.body.appendChild(themeBackground);

    buildBackdrop();
    createObjects();
    startInteraction();
}

export function unmount() {
    if (themeMouseHandler) {
        window.removeEventListener("mousemove", themeMouseHandler);
        themeMouseHandler = null;
    }

    if (themeClickHandler) {
        window.removeEventListener("pointerdown", themeClickHandler);
        themeClickHandler = null;
    }

    if (themePointerFrame) {
        cancelAnimationFrame(themePointerFrame);
        themePointerFrame = null;
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
