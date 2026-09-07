let root=null;let items=[];let mouse=null;let raf=null;


/* ============================================================
   MONSTERHIGH AUDIO
   - Intro stops at 0:20 and fades from 0:15-0:20.
   - Hover SFX are locked until the intro finishes.
   - Hover SFX use the six Winx effects from /sounds/winx/.
   ============================================================ */
let themeIntroAudio = null;
let themeIntroFadeFrame = null;
let themeIntroFallback = null;
let themeIntroFinished = false;

let themeHoverAudio = null;
let themeHoverFadeFrame = null;
let themeHoverStopTimer = null;
let themeHoverSounds = [];
let lastThemeHoverSound = null;

const THEME_INTRO_SRC = "/sounds/intros/maksymmalko-halloween-spooky-music-418211.mp3";
const THEME_INTRO_END = 20;
const THEME_INTRO_FADE_START = 15;
const THEME_INTRO_VOLUME = .30;
const WINX_HOVER_SOUNDS = [
    "/sounds/winx/cartoon_music-arcade-game-positive-selection-bling-489760.mp3",
    "/sounds/winx/dragon-studio-ding-402325.mp3",
    "/sounds/winx/freesound_community-electricity-sound-6066.mp3",
    "/sounds/winx/freesound_community-match-sizzle-02-104778.mp3",
    "/sounds/winx/koiroylers-get-coin-351945.mp3",
    "/sounds/winx/olenchic-electric-155027.mp3"
];

function setIntroDance(isPlaying) {
    if (!root) return;
    root.classList.toggle("monsterhigh-intro-playing", Boolean(isPlaying));
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

function refillHoverSoundBag() {
    themeHoverSounds = shuffle(WINX_HOVER_SOUNDS);

    /*
     * If the last sound from the previous bag happens to be first in the
     * new bag, swap it so the same sound can never play twice in a row.
     */
    if (
        lastThemeHoverSound &&
        themeHoverSounds.length > 1 &&
        themeHoverSounds[0] === lastThemeHoverSound
    ) {
        const swapIndex = themeHoverSounds.findIndex(
            src => src !== lastThemeHoverSound
        );

        if (swapIndex > 0) {
            [
                themeHoverSounds[0],
                themeHoverSounds[swapIndex]
            ] = [
                themeHoverSounds[swapIndex],
                themeHoverSounds[0]
            ];
        }
    }
}

function getNextHoverSound() {
    if (!themeHoverSounds.length) {
        refillHoverSoundBag();
    }

    const src = themeHoverSounds.shift();
    lastThemeHoverSound = src;
    return src;
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

    if (themeHoverFadeFrame) {
        cancelAnimationFrame(themeHoverFadeFrame);
    }

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

        try {
            audio.volume = startVolume * Math.pow(1 - p, 1.6);
        } catch (_) {}

        if (p < 1) {
            themeHoverFadeFrame = requestAnimationFrame(step);
        } else {
            try {
                audio.pause();
                audio.currentTime = 0;
            } catch (_) {}

            themeHoverFadeFrame = null;
        }
    };

    themeHoverFadeFrame = requestAnimationFrame(step);
}

function playHoverSound() {
    /*
     * Keep hover sounds completely locked until the theme's intro music
     * has finished, exactly like before.
     */
    if (!themeIntroFinished) return;

    stopHoverImmediately();

    const src = getNextHoverSound();
    if (!src) return;

    const audio = new Audio(src);
    audio.preload = "auto";
    audio.volume = .48;
    themeHoverAudio = audio;

    audio.addEventListener("ended", () => {
        if (themeHoverAudio === audio) {
            themeHoverAudio = null;
        }
    }, { once: true });

    const playPromise = audio.play();

    if (
        playPromise &&
        typeof playPromise.catch === "function"
    ) {
        playPromise.catch(() => {
            if (themeHoverAudio === audio) {
                themeHoverAudio = null;
            }
        });
    }

    themeHoverStopTimer = setTimeout(() => {
        if (themeHoverAudio === audio) {
            fadeHover(320);
        }
    }, 1400);
}
const ASSET_ROOT="/svg/theme-monsterhigh/";
const ASSETS=[
    "01-brown-wolf-girl.svg",
    "02-pink-pigtails-girl.svg",
    "03-icy-blue-winter-girl.svg",
    "monsterhigh-character-04.svg",
    "monsterhigh-character-05.svg",
    "monsterhigh-character-06.svg",
    "monsterhigh-character-07.svg",
    "monsterhigh-character-08.svg",
    "monsterhigh-character-09.svg"
];
function rand(a,b){return Math.random()*(b-a)+a}
function shuffle(a){a=[...a];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
function slots(n){const cols=4,rows=Math.ceil(n/cols),xs=[8,32,68,92],top=rows>=5?14:17,bottom=rows>=5?88:84,step=rows<=1?0:(bottom-top)/(rows-1),s=[];for(let r=0;r<rows;r++)for(let c=0;c<cols;c++)s.push({x:xs[c],y:top+r*step});return shuffle(s).slice(0,n)}
function backdrop(){for(const cls of ["glow","pattern","accents","floor"]){const d=document.createElement("div");d.className=`theme-monsterhigh-${cls}`;root.appendChild(d)}const a=root.querySelector(".theme-monsterhigh-accents");for(let i=0;i<14;i++){const d=document.createElement("span");d.className="theme-monsterhigh-accent-dot";d.style.left=`${rand(2,98)}%`;d.style.top=`${rand(5,96)}%`;d.style.setProperty("--z",`${rand(8,28)}px`);d.style.setProperty("--dx",`${rand(-18,18)}px`);d.style.setProperty("--dy",`${rand(-20,20)}px`);d.style.setProperty("--dur",`${rand(4.5,8.5)}s`);d.style.setProperty("--delay",`${-rand(0,8)}s`);a.appendChild(d)}}
function burst(x,y){for(let i=0;i<7;i++){const s=document.createElement("span");s.className="theme-monsterhigh-burst";const ang=Math.PI*2*i/7+rand(-.22,.22),dist=rand(34,68);s.style.left=`${x}px`;s.style.top=`${y}px`;s.style.setProperty("--bx",`${Math.cos(ang)*dist}px`);s.style.setProperty("--by",`${Math.sin(ang)*dist}px`);s.style.setProperty("--bs",`${rand(5,11)}px`);root.appendChild(s);setTimeout(()=>s.remove(),720)}}
function makeItems(){const files=shuffle(ASSETS),ss=slots(files.length);files.forEach((f,i)=>{const d=document.createElement("div"),im=document.createElement("img");d.className="theme-monsterhigh-item";d.setAttribute("aria-hidden","true");im.src=ASSET_ROOT+encodeURIComponent(f);im.alt="";im.draggable=false;im.decoding="async";d.style.left=`${ss[i].x+rand(-4.2,4.2)}%`;d.style.top=`${ss[i].y+rand(-3,3)}%`;d.style.setProperty("--w",`${rand(185,285)}px`);d.style.setProperty("--s",rand(.92,1.14).toFixed(2));d.style.setProperty("--r",`${rand(-8,8)}deg`);d.style.setProperty("--dx",`${rand(-12,12)}px`);d.style.setProperty("--dy",`${rand(-14,14)}px`);d.style.setProperty("--dur",`${rand(6.5,10.5)}s`);d.style.setProperty("--delay",`${-rand(0,9)}s`);if(i%3===0||i%5===0){d.classList.add("theme-monsterhigh-intro-dancer");d.style.setProperty("--dance-delay",`${-rand(0,.8)}s`);d.style.setProperty("--dance-height",`${rand(12,20)}px`);d.style.setProperty("--dance-duration",`${rand(.62,.86)}s`)}d.appendChild(im);root.appendChild(d);items.push({el:d,last:0,hovered:false})})}
function interact(){mouse=e=>{const x=e.clientX,y=e.clientY;if(raf)cancelAnimationFrame(raf);raf=requestAnimationFrame(()=>{if(root){root.style.setProperty("--px",`${x}px`);root.style.setProperty("--py",`${y}px`);root.style.setProperty("--parx",`${((x/Math.max(innerWidth,1))-.5)*12}px`);root.style.setProperty("--pary",`${((y/Math.max(innerHeight,1))-.5)*9}px`)}raf=null});const now=performance.now();items.forEach(o=>{const r=o.el.getBoundingClientRect(),cx=r.left+r.width/2,cy=r.top+r.height/2;const inside=Math.hypot(cx-x,cy-y)<=92;if(inside&&!o.hovered){o.hovered=true;o.last=now;o.el.classList.remove("theme-monsterhigh-react");void o.el.offsetWidth;o.el.classList.add("theme-monsterhigh-react");burst(cx,cy);playHoverSound();setTimeout(()=>o.el?.classList.remove("theme-monsterhigh-react"),620)}else if(!inside&&o.hovered){o.hovered=false;fadeHover(240)}})};window.addEventListener("mousemove",mouse,{passive:true})}
export function mount(){if(root)return;root=document.createElement("div");root.id="monsterhigh-background";root.setAttribute("aria-hidden","true");document.body.appendChild(root);playIntro();backdrop();makeItems();interact()}
export function unmount(){if(mouse)window.removeEventListener("mousemove",mouse);mouse=null;if(raf)cancelAnimationFrame(raf);raf=null;stopIntro();stopHoverImmediately();themeHoverSounds=[];lastThemeHoverSound=null;items=[];root?.remove();root=null}
