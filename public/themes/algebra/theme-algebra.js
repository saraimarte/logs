/* ============================================================
   ALGEBRA
   Decorative animated theme with inline SVGs and synthesized sounds.
   Does not touch cursor logic, companion positioning, or app structure.
   ============================================================ */

let themeBackground = null;
let themeStylesheet = null;
let themeAudio = null;
let themeMouseHandler = null;
let themeClickHandler = null;
let themeItems = [];
let lastGlobalSound = 0;
let themePointerFrame = null;

const THEME_ID = "algebra";
const THEME_SVGS = ["<svg viewBox=\"0 0 180 80\" xmlns=\"http://www.w3.org/2000/svg\"><text x=\"10\" y=\"52\" font-size=\"34\" font-family=\"monospace\" font-weight=\"700\" fill=\"currentColor\">2x + 5 = 17</text></svg>", "<svg viewBox=\"0 0 180 80\" xmlns=\"http://www.w3.org/2000/svg\"><text x=\"18\" y=\"52\" font-size=\"38\" font-family=\"serif\" font-style=\"italic\" font-weight=\"700\" fill=\"currentColor\">y = mx + b</text></svg>", "<svg viewBox=\"0 0 230 105\" xmlns=\"http://www.w3.org/2000/svg\"><text x=\"10\" y=\"40\" font-size=\"27\" font-family=\"serif\" fill=\"currentColor\">x =</text><text x=\"52\" y=\"36\" font-size=\"24\" font-family=\"serif\" fill=\"currentColor\">−b ± √(b²−4ac)</text><path d=\"M49 47H221\" stroke=\"currentColor\" stroke-width=\"2\"/><text x=\"117\" y=\"77\" font-size=\"25\" font-family=\"serif\" fill=\"currentColor\">2a</text></svg>", "<svg viewBox=\"0 0 205 80\" xmlns=\"http://www.w3.org/2000/svg\"><text x=\"8\" y=\"51\" font-size=\"30\" font-family=\"serif\" font-weight=\"700\" fill=\"currentColor\">(a+b)² = a²+2ab+b²</text></svg>", "<svg viewBox=\"0 0 220 105\" xmlns=\"http://www.w3.org/2000/svg\"><text x=\"12\" y=\"34\" font-size=\"25\" font-family=\"serif\" fill=\"currentColor\">m =</text><text x=\"60\" y=\"32\" font-size=\"24\" font-family=\"serif\" fill=\"currentColor\">y₂ − y₁</text><path d=\"M57 43H148\" stroke=\"currentColor\" stroke-width=\"2\"/><text x=\"62\" y=\"72\" font-size=\"24\" font-family=\"serif\" fill=\"currentColor\">x₂ − x₁</text></svg>", "<svg viewBox=\"0 0 195 82\" xmlns=\"http://www.w3.org/2000/svg\"><text x=\"10\" y=\"53\" font-size=\"32\" font-family=\"serif\" font-weight=\"700\" fill=\"currentColor\">xᵐ · xⁿ = xᵐ⁺ⁿ</text></svg>", "<svg viewBox=\"0 0 190 95\" xmlns=\"http://www.w3.org/2000/svg\"><text x=\"16\" y=\"36\" font-size=\"25\" font-family=\"monospace\" fill=\"currentColor\">3x + 2y = 12</text><text x=\"16\" y=\"70\" font-size=\"25\" font-family=\"monospace\" fill=\"currentColor\">x − y = 1</text></svg>", "<svg viewBox=\"0 0 190 82\" xmlns=\"http://www.w3.org/2000/svg\"><text x=\"10\" y=\"52\" font-size=\"31\" font-family=\"serif\" font-weight=\"700\" fill=\"currentColor\">a² − b² = (a−b)(a+b)</text></svg>", "<svg viewBox=\"0 0 125 115\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M16 98V15 M16 98H112\" stroke=\"currentColor\" stroke-width=\"4\"/><path d=\"M22 88 Q49 78 63 56 Q84 23 108 20\" fill=\"none\" stroke=\"#6688c8\" stroke-width=\"6\"/><circle cx=\"63\" cy=\"56\" r=\"5\" fill=\"#bd6e9c\"/></svg>", "<svg viewBox=\"0 0 200 82\" xmlns=\"http://www.w3.org/2000/svg\"><text x=\"12\" y=\"54\" font-size=\"31\" font-family=\"serif\" font-weight=\"700\" fill=\"currentColor\">|x| = √(x²)</text></svg>"];
const THEME_NOTES = [261.63, 311.13, 369.99, 440];
const SOUND_STYLE = "click";

function rand(min, max) {
    return Math.random() * (max - min) + min;
}

const ALGEBRA_BURST_SYMBOLS = ["x", "y", "±", "=", "√", "x²", "( )", "m"];

function updateAlgebraPointer(x, y) {
    if (!themeBackground) return;

    const parallaxX = ((x / Math.max(window.innerWidth, 1)) - 0.5) * 18;
    const parallaxY = ((y / Math.max(window.innerHeight, 1)) - 0.5) * 14;

    /*
     * Use exact viewport pixels for the spotlight center so the glow
     * tracks the pointer precisely.
     */
    themeBackground.style.setProperty("--alg-pointer-x", `${x}px`);
    themeBackground.style.setProperty("--alg-pointer-y", `${y}px`);
    themeBackground.style.setProperty("--alg-parallax-x", `${parallaxX}px`);
    themeBackground.style.setProperty("--alg-parallax-y", `${parallaxY}px`);
}

function createAlgebraBurst(x, y) {
    if (!themeBackground) return;

    for (let i = 0; i < 8; i++) {
        const symbol = document.createElement("span");
        symbol.className = "theme-algebra-burst-symbol";
        symbol.textContent =
            ALGEBRA_BURST_SYMBOLS[
                Math.floor(Math.random() * ALGEBRA_BURST_SYMBOLS.length)
            ];

        const angle = (Math.PI * 2 * i) / 8 + rand(-0.22, 0.22);
        const distance = rand(34, 66);

        symbol.style.left = `${x}px`;
        symbol.style.top = `${y}px`;
        symbol.style.setProperty("--burst-x", `${Math.cos(angle) * distance}px`);
        symbol.style.setProperty("--burst-y", `${Math.sin(angle) * distance}px`);
        symbol.style.setProperty("--burst-rotate", `${rand(-28, 28)}deg`);

        themeBackground.appendChild(symbol);
        setTimeout(() => symbol.remove(), 760);
    }
}

function createAlgebraRipple(x, y) {
    if (!themeBackground) return;

    const ripple = document.createElement("span");
    ripple.className = "theme-algebra-click-ripple";
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

function playThemeSound(freq, index) {
    const ctx = getAudio();
    if (!ctx) return;

    const now = ctx.currentTime;
    const master = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    const osc = ctx.createOscillator();
    const osc2 = ctx.createOscillator();

    let type = "sine";
    let type2 = "triangle";
    let duration = .5;
    let volume = .12;
    let cutoff = 2800;

    switch (SOUND_STYLE) {
        case "piano":
            type = "triangle"; type2 = "sine"; duration = .85; volume = .15; cutoff = 3200; break;
        case "pluck":
            type = "triangle"; type2 = "sine"; duration = .62; volume = .14; cutoff = 2500; break;
        case "chime":
        case "bell":
        case "ding":
            type = "sine"; type2 = "sine"; duration = .8; volume = .13; cutoff = 5000; break;
        case "rumble":
            type = "sawtooth"; type2 = "triangle"; duration = .55; volume = .08; cutoff = 700; freq *= .5; break;
        case "chirp":
            type = "sine"; type2 = "triangle"; duration = .32; volume = .11; cutoff = 4200; break;
        case "bubble":
            type = "sine"; type2 = "sine"; duration = .34; volume = .10; cutoff = 3600; break;
        case "coin":
            type = "square"; type2 = "sine"; duration = .30; volume = .08; cutoff = 4100; break;
        case "digital":
        case "arcade":
            type = "square"; type2 = "triangle"; duration = .28; volume = .075; cutoff = 3900; break;
        case "gong":
            type = "sine"; type2 = "triangle"; duration = 1.0; volume = .11; cutoff = 1800; break;
        case "jazz":
        case "jive":
            type = "triangle"; type2 = "sine"; duration = .55; volume = .12; cutoff = 2600; break;
        case "page":
        case "soft":
            type = "sine"; type2 = "triangle"; duration = .42; volume = .07; cutoff = 1900; break;
        case "click":
        case "pop":
            type = "triangle"; type2 = "sine"; duration = .22; volume = .07; cutoff = 3000; break;
    }

    filter.type = "lowpass";
    filter.frequency.setValueAtTime(cutoff, now);
    filter.Q.setValueAtTime(.7, now);

    master.gain.setValueAtTime(.0001, now);
    master.gain.exponentialRampToValueAtTime(volume, now + .008);
    master.gain.exponentialRampToValueAtTime(.0001, now + duration);

    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);

    osc2.type = type2;
    osc2.frequency.setValueAtTime(freq * (SOUND_STYLE === "bell" || SOUND_STYLE === "chime" ? 2.01 : 1.5), now);

    const g2 = ctx.createGain();
    g2.gain.setValueAtTime(.32, now);
    g2.gain.exponentialRampToValueAtTime(.0001, now + Math.max(.18, duration * .7));

    osc.connect(filter);
    osc2.connect(g2);
    g2.connect(filter);
    filter.connect(master);
    master.connect(ctx.destination);

    if (SOUND_STYLE === "bubble") {
        osc.frequency.exponentialRampToValueAtTime(freq * 1.65, now + duration * .8);
    }
    if (SOUND_STYLE === "chirp") {
        osc.frequency.exponentialRampToValueAtTime(freq * 1.4, now + duration);
    }
    if (SOUND_STYLE === "digital" || SOUND_STYLE === "arcade") {
        osc.frequency.setValueAtTime(freq, now);
        osc.frequency.setValueAtTime(freq * 1.25, now + .08);
        osc.frequency.setValueAtTime(freq * .9, now + .16);
    }

    osc.start(now); osc2.start(now);
    osc.stop(now + duration + .05); osc2.stop(now + duration + .05);
}

function buildBackdrop() {
    const haze = document.createElement("div");
    haze.className = "theme-algebra-haze";
    themeBackground.appendChild(haze);

    const spotlight = document.createElement("div");
    spotlight.className = "theme-algebra-spotlight";
    themeBackground.appendChild(spotlight);

    const pattern = document.createElement("div");
    pattern.className = "theme-algebra-pattern";
    themeBackground.appendChild(pattern);

    const axes = document.createElement("div");
    axes.className = "theme-algebra-axes";
    axes.innerHTML = `
        <span class="alg-axis alg-axis-x"></span>
        <span class="alg-axis alg-axis-y"></span>
        <span class="alg-line alg-line-a"></span>
        <span class="alg-line alg-line-b"></span>
        <span class="alg-intersection"></span>
    `;
    themeBackground.appendChild(axes);

    const operators = document.createElement("div");
    operators.className = "theme-algebra-operators";
    ["+", "−", "×", "÷", "=", "√", "±", "x²"].forEach((text, index) => {
        const op = document.createElement("span");
        op.textContent = text;
        op.style.setProperty("--op-index", String(index));
        operators.appendChild(op);
    });
    themeBackground.appendChild(operators);

    const cards = document.createElement("div");
    cards.className = "theme-algebra-mini-cards";
    ["x + 3", "2y", "x²", "a+b"].forEach((text, index) => {
        const card = document.createElement("span");
        card.textContent = text;
        card.style.setProperty("--card-index", String(index));
        cards.appendChild(card);
    });
    themeBackground.appendChild(cards);

    const horizon = document.createElement("div");
    horizon.className = "theme-algebra-horizon";
    themeBackground.appendChild(horizon);
}

function addObject(svg, index, left, top, scale, rotate) {
    const item = document.createElement("div");
    item.className = "theme-algebra-item";
    item.style.left = left;
    item.style.top = top;
    item.style.setProperty("--item-scale", scale);
    item.style.setProperty("--item-rotate", rotate + "deg");
    item.style.setProperty("--item-delay", (-rand(0, 8)).toFixed(2) + "s");
    item.style.setProperty("--item-x", rand(-10,10).toFixed(1) + "px");
    item.style.setProperty("--item-y", rand(-8,8).toFixed(1) + "px");
    item.innerHTML = svg;
    item.setAttribute("aria-hidden", "true");
    themeBackground.appendChild(item);
    themeItems.push({ el:item, note:THEME_NOTES[index % THEME_NOTES.length], last:0 });
}

function createObjects() {
    const positions = [
        [7,22,.72,-8],[28,18,.58,5],[72,20,.61,-4],[92,28,.70,8],
        [11,50,.62,4],[88,52,.64,-5],
        [17,78,.65,-6],[38,84,.55,4],[64,81,.60,-3],[85,77,.66,6]
    ];
    positions.forEach((p, i) => {
        addObject(
            THEME_SVGS[i % THEME_SVGS.length],
            i,
            p[0] + "%",
            p[1] + "%",
            p[2],
            p[3]
        );
    });
}

function startInteraction() {
    const radius = 94;

    themeMouseHandler = (event) => {
        const x = event.clientX;
        const y = event.clientY;

        if (themePointerFrame) {
            cancelAnimationFrame(themePointerFrame);
        }

        themePointerFrame = requestAnimationFrame(() => {
            updateAlgebraPointer(x, y);
            themePointerFrame = null;
        });

        const now = performance.now();

        themeItems.forEach((obj, index) => {
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

                obj.el.classList.remove("theme-algebra-react");
                void obj.el.offsetWidth;
                obj.el.classList.add("theme-algebra-react");

                createAlgebraBurst(cx, cy);
                playThemeSound(obj.note, index);

                setTimeout(
                    () => obj.el.classList.remove("theme-algebra-react"),
                    520
                );
            }
        });
    };

    themeClickHandler = (event) => {
        createAlgebraRipple(event.clientX, event.clientY);
    };

    window.addEventListener("mousemove", themeMouseHandler, { passive: true });
    window.addEventListener("pointerdown", themeClickHandler, { passive: true });
}

export function mount() {
    if (themeBackground) return;

    themeStylesheet = document.createElement("link");
    themeStylesheet.rel = "stylesheet";
    themeStylesheet.href = "/themes/theme-algebra.css";
    themeStylesheet.dataset.theme = "algebra";
    document.head.appendChild(themeStylesheet);

    themeBackground = document.createElement("div");
    themeBackground.id = "algebra-background";
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
