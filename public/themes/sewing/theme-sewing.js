
let sewingRoot=null;
let sewingIntro=null;
let sewingTimer=null;
let sewingFallback=null;
const SEWING_ASSETS=["sewing-01-floral-dress-form.svg", "sewing-02-purple-thread-spool.svg", "sewing-03-blue-pin-cushion.svg", "sewing-04-dress-form-pink-measuring-tape.svg", "sewing-05-vintage-scissors.svg", "sewing-06-thimble-lace.svg", "sewing-07-buttons.svg", "sewing-08-floral-embroidery-hoop.svg", "sewing-09-pink-heart-pin-cushion.svg", "sewing-10-sewing-machine.svg", "sewing-11-yarn-basket.svg", "sewing-12-black-heels.svg", "sewing-13-handbags.svg", "sewing-14-leopard-heels.svg", "sewing-15-pink-handbag.svg", "sewing-16-pink-measuring-tape.svg", "sewing-17-pink-shopping-bags.svg", "sewing-18-scissors-ruler.svg"];
const SEWING_INTRO="/sounds/intros/jorisvermeer-cute-cartoon-music-590751.mp3";

function sr(a,b){return Math.random()*(b-a)+a}
function sewingStopIntro(){
    if(sewingTimer){clearInterval(sewingTimer);sewingTimer=null}
    if(sewingFallback){window.removeEventListener("pointerdown",sewingFallback);window.removeEventListener("keydown",sewingFallback);sewingFallback=null}
    if(sewingIntro){try{sewingIntro.pause();sewingIntro.currentTime=0}catch(_){}}
    sewingIntro=null;
}
function sewingPlayIntro(){
    sewingStopIntro();
    const a=new Audio(SEWING_INTRO); sewingIntro=a; a.volume=.29; a.preload="auto";
    sewingTimer=setInterval(()=>{
        if(sewingIntro!==a)return;
        const t=a.currentTime||0;
        if(t>=20)a.volume=Math.max(0,.29*(1-(t-20)/5));
        if(t>=25)sewingStopIntro();
    },120);
    const p=a.play();
    if(p&&p.catch)p.catch(()=>{
        sewingFallback=()=>{const q=a.play(); if(q&&q.catch)q.catch(()=>{})};
        window.addEventListener("pointerdown",sewingFallback,{once:true});
        window.addEventListener("keydown",sewingFallback,{once:true});
    });
}
function shuffle(a){a=[...a];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
export function mount(){
    if(sewingRoot)return;
    sewingRoot=document.createElement("div"); sewingRoot.id="sewing-background"; sewingRoot.setAttribute("aria-hidden","true");
    document.body.appendChild(sewingRoot);
    const files=shuffle(SEWING_ASSETS);
    const xs=[8,28,50,72,92], rows=4;
    files.forEach((f,i)=>{
        const d=document.createElement("div"); d.className="theme-sewing-item";
        const im=document.createElement("img"); im.src="/svg/theme-sewing/"+encodeURIComponent(f); im.alt=""; im.draggable=false;
        const row=Math.floor(i/5), col=i%5;
        d.style.left=`${xs[col]+sr(-2.5,2.5)}%`;
        d.style.top=`${18+row*22+sr(-2,2)}%`;
        d.style.setProperty("--sw",`${sr(145,220)}px`);
        d.style.setProperty("--rot",`${sr(-8,8)}deg`);
        d.style.setProperty("--dx",`${sr(-10,10)}px`);
        d.style.setProperty("--dy",`${sr(-14,14)}px`);
        d.style.setProperty("--dur",`${sr(6.5,10)}s`);
        d.style.setProperty("--delay",`${-sr(0,8)}s`);
        d.appendChild(im); sewingRoot.appendChild(d);
    });
    sewingPlayIntro();
}
export function unmount(){sewingStopIntro();sewingRoot?.remove();sewingRoot=null}
