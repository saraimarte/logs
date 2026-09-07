let root=null;let items=[];let mouse=null;let raf=null;


/* ============================================================
   BIKINIBOTTOM AUDIO
   - Intro stops at 0:20 and fades from 0:15-0:20.
   - Hover SFX are locked until the intro finishes.
   - Hover SFX are discovered from /sounds/bikinibottom/ when available.
   ============================================================ */
let themeIntroAudio = null;
let themeIntroFadeFrame = null;
let themeIntroFallback = null;
let themeIntroFinished = false;

let themeHoverAudio = null;
let themeHoverFadeFrame = null;
let themeHoverStopTimer = null;
let themeHoverSounds = [];
let themeHoverIndex = 0;
let themeAudioContext = null;

const THEME_INTRO_SRC = "/sounds/intros/alex-morgan-surf-rock-591326.mp3";
const THEME_INTRO_END = 20;
const THEME_INTRO_FADE_START = 15;
const THEME_INTRO_VOLUME = .30;
const THEME_SOUND_ROOT = "/sounds/bikinibottom/";

function setIntroDance(isPlaying) {
    if (!root) return;
    root.classList.toggle("bikinibottom-intro-playing", Boolean(isPlaying));
}

function clearIntroFallback() {
    if (!themeIntroFallback) return;
    ["pointerdown","pointerup","click","touchend","keydown","keyup"].forEach(type => {
        document.removeEventListener(type, themeIntroFallback);
    });
    themeIntroFallback = null;
}

function stopIntro() {
    clearIntroFallback();
    if (themeIntroFadeFrame) {
        cancelAnimationFrame(themeIntroFadeFrame);
        themeIntroFadeFrame = null;
    }
    setIntroDance(false);
    if (!themeIntroAudio) return;
    try {
        themeIntroAudio.pause();
        themeIntroAudio.currentTime = 0;
        themeIntroAudio.volume = THEME_INTRO_VOLUME;
    } catch (_) {}
    themeIntroAudio = null;
}

function playIntro() {
    if (!THEME_INTRO_SRC) {
        themeIntroFinished = true;
        return;
    }

    stopIntro();
    themeIntroFinished = false;

    const audio = new Audio();
    themeIntroAudio = audio;
    audio.src = THEME_INTRO_SRC;
    audio.preload = "auto";
    audio.autoplay = true;
    audio.playsInline = true;
    audio.loop = false;
    audio.volume = THEME_INTRO_VOLUME;
    audio.load();

    const finish = () => {
        if (themeIntroAudio !== audio) return;
        if (themeIntroFadeFrame) {
            cancelAnimationFrame(themeIntroFadeFrame);
            themeIntroFadeFrame = null;
        }
        setIntroDance(false);
        try {
            audio.pause();
            audio.currentTime = THEME_INTRO_END;
            audio.volume = 0;
        } catch (_) {}
        themeIntroFinished = true;
    };

    const fadeLoop = () => {
        if (themeIntroAudio !== audio) return;
        const t = audio.currentTime || 0;
        if (t >= THEME_INTRO_END) {
            finish();
            return;
        }
        if (t >= THEME_INTRO_FADE_START) {
            const remaining = Math.max(0, THEME_INTRO_END - t);
            const total = THEME_INTRO_END - THEME_INTRO_FADE_START;
            audio.volume = THEME_INTRO_VOLUME * (remaining / total);
        } else {
            audio.volume = THEME_INTRO_VOLUME;
        }
        themeIntroFadeFrame = requestAnimationFrame(fadeLoop);
    };

    audio.addEventListener("playing", () => {
        if (themeIntroAudio !== audio) return;
        setIntroDance(true);
        if (!themeIntroFadeFrame) themeIntroFadeFrame = requestAnimationFrame(fadeLoop);
    });
    audio.addEventListener("pause", () => {
        if (themeIntroAudio === audio) setIntroDance(false);
    });
    audio.addEventListener("error", () => {
        if (themeIntroAudio !== audio) return;
        setIntroDance(false);
        themeIntroFinished = true;
    }, { once:true });

    const attempt = () => {
        if (themeIntroAudio !== audio) return;
        const p = audio.play();
        if (p && typeof p.catch === "function") {
            p.catch(() => {
                if (themeIntroFallback) return;
                themeIntroFallback = () => {
                    const handler = themeIntroFallback;
                    ["pointerdown","pointerup","click","touchend","keydown","keyup"].forEach(type => {
                        document.removeEventListener(type, handler);
                    });
                    themeIntroFallback = null;
                    if (themeIntroAudio !== audio) return;
                    audio.volume = THEME_INTRO_VOLUME;
                    const retry = audio.play();
                    if (retry && typeof retry.catch === "function") retry.catch(() => {});
                };
                ["pointerdown","pointerup","click","touchend","keydown","keyup"].forEach(type => {
                    document.addEventListener(type, themeIntroFallback, { once:true });
                });
            });
        }
    };
    attempt();
}

async function discoverHoverSounds() {
    const found = [];

    try {
        const response = await fetch("/api/theme-bikinibottom-sounds", { cache:"no-store" });
        if (response.ok) {
            const data = await response.json();
            const files = Array.isArray(data) ? data : data.files;
            if (Array.isArray(files)) {
                files.map(String)
                    .filter(name => /\.(mp3|wav|ogg|m4a)$/i.test(name))
                    .forEach(name => found.push(THEME_SOUND_ROOT + encodeURIComponent(name.split("/").pop())));
            }
        }
    } catch (_) {}

    if (!found.length) {
        try {
            const response = await fetch(THEME_SOUND_ROOT, { cache:"no-store" });
            if (response.ok) {
                const html = await response.text();
                const doc = new DOMParser().parseFromString(html, "text/html");
                [...doc.querySelectorAll("a[href]")]
                    .map(a => a.getAttribute("href") || "")
                    .map(href => decodeURIComponent(href.split("?")[0].split("#")[0]))
                    .map(href => href.split("/").pop())
                    .filter(name => /\.(mp3|wav|ogg|m4a)$/i.test(name || ""))
                    .forEach(name => found.push(THEME_SOUND_ROOT + encodeURIComponent(name)));
            }
        } catch (_) {}
    }

    const merged = [...themeHoverSounds];
    found.forEach(src => { if (!merged.includes(src)) merged.push(src); });
    themeHoverSounds = merged;
}

function stopHoverImmediately() {
    if (themeHoverFadeFrame) {
        cancelAnimationFrame(themeHoverFadeFrame);
        themeHoverFadeFrame = null;
    }
    if (themeHoverStopTimer) {
        clearTimeout(themeHoverStopTimer);
        themeHoverStopTimer = null;
    }
    if (themeHoverAudio) {
        try {
            themeHoverAudio.pause();
            themeHoverAudio.currentTime = 0;
        } catch (_) {}
    }
    themeHoverAudio = null;
}

function fadeHover(duration = 260) {
    if (!themeHoverAudio) return;
    if (themeHoverFadeFrame) cancelAnimationFrame(themeHoverFadeFrame);
    if (themeHoverStopTimer) {
        clearTimeout(themeHoverStopTimer);
        themeHoverStopTimer = null;
    }

    const audio = themeHoverAudio;
    themeHoverAudio = null;
    const start = performance.now();
    const startVolume = Math.max(.001, audio.volume || .5);

    const step = now => {
        const p = Math.min(1, (now - start) / duration);
        try { audio.volume = startVolume * Math.pow(1-p, 1.6); } catch (_) {}
        if (p < 1) themeHoverFadeFrame = requestAnimationFrame(step);
        else {
            try { audio.pause(); audio.currentTime = 0; } catch (_) {}
            themeHoverFadeFrame = null;
        }
    };
    themeHoverFadeFrame = requestAnimationFrame(step);
}

function playSynthHover() {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    if (!themeAudioContext) themeAudioContext = new AudioCtx();
    if (themeAudioContext.state === "suspended") themeAudioContext.resume().catch(() => {});

    const ctx = themeAudioContext;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(580, now);
    osc.frequency.exponentialRampToValueAtTime(684.40, now + .18);
    gain.gain.setValueAtTime(.0001, now);
    gain.gain.exponentialRampToValueAtTime(.055, now + .01);
    gain.gain.exponentialRampToValueAtTime(.0001, now + .30);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + .32);
}

function playHoverSound() {
    if (!themeIntroFinished) return;

    if (!themeHoverSounds.length) {
        playSynthHover();
        return;
    }

    stopHoverImmediately();
    const src = themeHoverSounds[themeHoverIndex % themeHoverSounds.length];
    themeHoverIndex += 1;

    const audio = new Audio(src);
    audio.preload = "auto";
    audio.volume = .48;
    themeHoverAudio = audio;

    const p = audio.play();
    if (p && typeof p.catch === "function") {
        p.catch(() => {
            if (themeHoverAudio === audio) themeHoverAudio = null;
            playSynthHover();
        });
    }

    themeHoverStopTimer = setTimeout(() => {
        if (themeHoverAudio === audio) fadeHover(320);
    }, 1400);
}

const ASSET_ROOT="/svg/theme-bikinibottom/";
const ASSETS=[
    "01-yellow-fish.svg",
    "02-dancing-fish-lady.svg",
    "03-blue-fish-shirt.svg",
    "04-purple-news-fish.svg",
    "05-green-fish-floatie.svg",
    "06-brown-fish-pants.svg",
    "07-mermaid-fish.svg",
    "08-red-lobster.svg",
    "mr-crabs.svg",
    "patrick.svg",
    "spongebob.svg"
];
function rand(a,b){return Math.random()*(b-a)+a}
function shuffle(a){a=[...a];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
function slots(n){const xs=[8,31,69,92],rows=Math.ceil(n/xs.length),top=21,bottom=82,step=rows<=1?0:(bottom-top)/(rows-1),s=[];for(let r=0;r<rows;r++)for(let c=0;c<xs.length;c++)s.push({x:xs[c],y:top+r*step});return shuffle(s).slice(0,n)}
function backdrop(){for(const cls of ["water","rays","flowers","bubbles","sand"] ){const d=document.createElement("div");d.className=`theme-bikinibottom-${cls}`;root.appendChild(d)}const f=root.querySelector(".theme-bikinibottom-flowers");for(let i=0;i<9;i++){const s=document.createElement("span");s.className="theme-bikinibottom-sea-flower";s.style.left=`${rand(3,97)}%`;s.style.top=`${rand(8,80)}%`;s.style.setProperty("--sf-size",`${rand(40,105)}px`);s.style.setProperty("--sf-rot",`${rand(-22,22)}deg`);s.style.setProperty("--sf-delay",`${-rand(0,8)}s`);f.appendChild(s)}const b=root.querySelector(".theme-bikinibottom-bubbles");for(let i=0;i<30;i++){const s=document.createElement("span");s.className="theme-bikinibottom-bubble";s.style.left=`${rand(1,99)}%`;s.style.bottom=`${rand(-6,12)}%`;s.style.setProperty("--b-size",`${rand(3,10)}px`);s.style.setProperty("--b-drift",`${rand(-28,28)}px`);s.style.setProperty("--b-dur",`${rand(9,18)}s`);s.style.setProperty("--b-delay",`${-rand(0,16)}s`);b.appendChild(s)}}
function makeItems(){
    const files=shuffle(ASSETS),ss=slots(files.length);

    files.forEach((f,i)=>{
        const d=document.createElement("div");
        const wrap=document.createElement("div");
        const im=document.createElement("img");

        d.className="theme-bikinibottom-item";
        wrap.className="theme-bikinibottom-character-wrap";
        d.setAttribute("aria-hidden","true");

        im.src=ASSET_ROOT+encodeURIComponent(f);
        im.alt="";
        im.draggable=false;
        im.decoding="async";

        d.style.left=`${ss[i].x+rand(-2.2,2.2)}%`;
        d.style.top=`${ss[i].y+rand(-1.8,1.8)}%`;
        d.style.setProperty("--w",`${rand(112,165)}px`);
        d.style.setProperty("--s",rand(.88,.98).toFixed(2));
        d.style.setProperty("--r",`${rand(-7,7)}deg`);
        d.style.setProperty("--dx",`${rand(-14,14)}px`);
        d.style.setProperty("--dy",`${rand(-15,15)}px`);
        d.style.setProperty("--dur",`${rand(6.3,10.5)}s`);
        d.style.setProperty("--delay",`${-rand(0,9)}s`);

        if(i%3===0||i%5===0){
            d.classList.add("theme-bikinibottom-intro-dancer");
            d.style.setProperty("--dance-delay",`${-rand(0,.8)}s`);
            d.style.setProperty("--dance-height",`${rand(12,21)}px`);
            d.style.setProperty("--dance-duration",`${rand(.62,.86)}s`);
        }

        wrap.appendChild(im);
        d.appendChild(wrap);
        root.appendChild(d);

        items.push({el:d,last:0,hovered:false});
    });
}
function interact(){
    mouse=e=>{
        const x=e.clientX,y=e.clientY;

        if(raf)cancelAnimationFrame(raf);
        raf=requestAnimationFrame(()=>{
            if(root){
                root.style.setProperty("--px",`${x}px`);
                root.style.setProperty("--py",`${y}px`);
                root.style.setProperty("--parx",`${((x/Math.max(innerWidth,1))-.5)*14}px`);
                root.style.setProperty("--pary",`${((y/Math.max(innerHeight,1))-.5)*10}px`);
            }
            raf=null;
        });

        items.forEach(o=>{
            const r=o.el.getBoundingClientRect();
            const cx=r.left+r.width/2,cy=r.top+r.height/2;
            const inside=Math.hypot(cx-x,cy-y)<=98;

            if(inside&&!o.hovered){
                o.hovered=true;
                o.el.classList.add("theme-bikinibottom-hovered");
                playHoverSound();
            }else if(!inside&&o.hovered){
                o.hovered=false;
                o.el.classList.remove("theme-bikinibottom-hovered");
                fadeHover(240);
            }
        });
    };

    window.addEventListener("mousemove",mouse,{passive:true});
}
export function mount(){if(root)return;root=document.createElement("div");root.id="bikinibottom-background";root.setAttribute("aria-hidden","true");document.body.appendChild(root);discoverHoverSounds();playIntro();backdrop();makeItems();interact()}
export function unmount(){if(mouse)window.removeEventListener("mousemove",mouse);mouse=null;if(raf)cancelAnimationFrame(raf);raf=null;stopIntro();stopHoverImmediately();if(themeAudioContext){themeAudioContext.close().catch(()=>{});themeAudioContext=null}items=[];root?.remove();root=null}
