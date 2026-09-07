/* ============================================================
   BREAKINGBAD THEME — TECH / INTERACTIVE VERSION
   Inspired by the terminal and matrix themes while preserving
   the winter-theme mount/unmount structure.
   ============================================================ */

let breakingbadBackground = null;
let breakingbadHoverHandler = null;
let breakingbadPointerHandler = null;
let breakingbadClickHandler = null;
let breakingbadHoverLast = null;
let breakingbadHoverAudio = null;
let breakingbadIntroAudio = null;
let breakingbadIntroTick = null;
let breakingbadHoverUnlocked = false;
let breakingbadIntroActive = false;
let breakingbadPeriodicCells = [];
let breakingbadFormulaTags = [];
let breakingbadConsoleNodes = [];
let breakingbadGlitchInterval = null;
let breakingbadPulseInterval = null;
let breakingbadConsoleFeedTimer = null;
let breakingbadHoveredCell = null;
let breakingbadCursorGlow = null;
let breakingbadLastPointerFrame = 0;

const BREAKINGBAD_HOVER_SOUNDS = [
    "/sounds/winx/cartoon_music-arcade-game-positive-selection-bling-489760.mp3",
    "/sounds/winx/freesound_community-electricity-sound-6066.mp3",
    "/sounds/winx/freesound_community-match-sizzle-02-104778.mp3",
    "/sounds/winx/koiroylers-get-coin-351945.mp3"
];
const BREAKINGBAD_HOVER_VOLUME = 0.38;
const BREAKINGBAD_INTRO_SOURCES = [
    "/sounds/intros/paoloargento-chemical-attack-360513.mp3",
    "/sounds/intros/paoloargento-chemical-attack-360513"
];
const BREAKINGBAD_INTRO_CUTOFF = 30;
const BREAKINGBAD_INTRO_FADE_START = 24;
const BREAKINGBAD_INTRO_VOLUME = 0.34;
const BREAKINGBAD_BOP_INDEXES = new Set([0, 2, 4, 7, 10, 12]);
const BREAKINGBAD_DECOR_CARDS = [
    ['Br', '35', 'bromine'], ['Ba', '56', 'barium'], ['He', '2', 'helium'], ['C', '6', 'carbon'],
    ['Na', '11', 'sodium'], ['Cl', '17', 'chlorine'], ['O', '8', 'oxygen'], ['Ne', '10', 'neon'],
    ['Fe', '26', 'iron'], ['K', '19', 'potassium'], ['Cu', '29', 'copper'], ['Zn', '30', 'zinc'],
    ['P', '15', 'phosphorus'], ['Ag', '47', 'silver']
];
const BREAKINGBAD_SLOTS = [[8,18],[10,35],[12,53],[14,72],[17,88],[92,18],[90,35],[88,53],[86,72],[83,88],[28,16],[72,16],[28,92],[72,92]];
const BREAKINGBAD_FORMULAS = ['H₂O','CO₂','NaCl','NH₃','pH 7','Zn²⁺','CuSO₄','RXN','HCl','CH₄','C₆H₁₂O₆','H₂SO₄','LAB'];
const BREAKINGBAD_GLYPHS = ['H','He','Li','C','N','O','Na','Mg','Al','Si','P','S','Cl','K','Fe','Cu','Zn','Br','RXN','pH','NaCl','CO₂','NH₃','⚗','⌬'];
const BREAKINGBAD_CLICK_RESPONSES = [
    'reaction armed', 'sample locked', 'compound traced', 'spectrum live', 'analyzing...', 'catalyst ready'
];
const BREAKINGBAD_CONSOLE_LINES = [
    'scan sample --compound=unknown',
    'normalize beaker alpha',
    'render periodic.overlay --full',
    'stabilize reaction_temp -> 67C',
    'decode batch signature',
    'ionization sweep /grid/18x9',
    'crystalize solution.beta',
    'lab.camera track cursor',
    'flux monitor -> nominal',
    'archive synthesis.log',
    'bind catalyst: CuSO4',
    'hydrate vessel --pressure=low',
    'spectrometer pulse > online',
    'run isomer compare --fast'
];
const BREAKINGBAD_PERIODIC_DATA = [
    ['H',1,1,1],['He',2,18,1],
    ['Li',3,1,2],['Be',4,2,2],['B',5,13,2],['C',6,14,2],['N',7,15,2],['O',8,16,2],['F',9,17,2],['Ne',10,18,2],
    ['Na',11,1,3],['Mg',12,2,3],['Al',13,13,3],['Si',14,14,3],['P',15,15,3],['S',16,16,3],['Cl',17,17,3],['Ar',18,18,3],
    ['K',19,1,4],['Ca',20,2,4],['Sc',21,3,4],['Ti',22,4,4],['V',23,5,4],['Cr',24,6,4],['Mn',25,7,4],['Fe',26,8,4],['Co',27,9,4],['Ni',28,10,4],['Cu',29,11,4],['Zn',30,12,4],['Ga',31,13,4],['Ge',32,14,4],['As',33,15,4],['Se',34,16,4],['Br',35,17,4],['Kr',36,18,4],
    ['Rb',37,1,5],['Sr',38,2,5],['Y',39,3,5],['Zr',40,4,5],['Nb',41,5,5],['Mo',42,6,5],['Tc',43,7,5],['Ru',44,8,5],['Rh',45,9,5],['Pd',46,10,5],['Ag',47,11,5],['Cd',48,12,5],['In',49,13,5],['Sn',50,14,5],['Sb',51,15,5],['Te',52,16,5],['I',53,17,5],['Xe',54,18,5],
    ['Cs',55,1,6],['Ba',56,2,6],['La',57,3,6],['Hf',72,4,6],['Ta',73,5,6],['W',74,6,6],['Re',75,7,6],['Os',76,8,6],['Ir',77,9,6],['Pt',78,10,6],['Au',79,11,6],['Hg',80,12,6],['Tl',81,13,6],['Pb',82,14,6],['Bi',83,15,6],['Po',84,16,6],['At',85,17,6],['Rn',86,18,6],
    ['Fr',87,1,7],['Ra',88,2,7],['Ac',89,3,7],['Rf',104,4,7],['Db',105,5,7],['Sg',106,6,7],['Bh',107,7,7],['Hs',108,8,7],['Mt',109,9,7],['Ds',110,10,7],['Rg',111,11,7],['Cn',112,12,7],['Nh',113,13,7],['Fl',114,14,7],['Mc',115,15,7],['Lv',116,16,7],['Ts',117,17,7],['Og',118,18,7],
    ['Ce',58,4,8],['Pr',59,5,8],['Nd',60,6,8],['Pm',61,7,8],['Sm',62,8,8],['Eu',63,9,8],['Gd',64,10,8],['Tb',65,11,8],['Dy',66,12,8],['Ho',67,13,8],['Er',68,14,8],['Tm',69,15,8],['Yb',70,16,8],['Lu',71,17,8],
    ['Th',90,4,9],['Pa',91,5,9],['U',92,6,9],['Np',93,7,9],['Pu',94,8,9],['Am',95,9,9],['Cm',96,10,9],['Bk',97,11,9],['Cf',98,12,9],['Es',99,13,9],['Fm',100,14,9],['Md',101,15,9],['No',102,16,9],['Lr',103,17,9]
];

function breakingbadRandom(min, max) { return Math.random() * (max - min) + min; }
function breakingbadInt(min, max) { return Math.floor(breakingbadRandom(min, max + 1)); }
function breakingbadShuffle(arr) {
    const copy = arr.slice();
    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
}
function breakingbadLoadAudioFromCandidates(audio, candidates) {
    return new Promise((resolve, reject) => {
        let index = 0;
        const cleanup = () => {
            audio.removeEventListener('loadedmetadata', onLoaded);
            audio.removeEventListener('canplay', onLoaded);
            audio.removeEventListener('error', onError);
        };
        const onLoaded = () => { cleanup(); resolve(audio); };
        const onError = () => {
            if (index >= candidates.length) { cleanup(); reject(new Error('audio-not-found')); return; }
            audio.src = candidates[index++];
            audio.load();
        };
        audio.addEventListener('loadedmetadata', onLoaded);
        audio.addEventListener('canplay', onLoaded);
        audio.addEventListener('error', onError);
        onError();
    });
}
function breakingbadSetIntroBop(active) {
    breakingbadIntroActive = active;
    if (!breakingbadBackground) return;
    for (const item of breakingbadBackground.querySelectorAll('.breakingbad-intro-bop-target')) {
        item.classList.toggle('breakingbad-intro-bop', active);
    }
}
function breakingbadCellTone(column, row) {
    if (row >= 8) return 'rgba(130,255,213,.16)';
    if (column <= 2) return 'rgba(74,255,128,.17)';
    if (column >= 13) return 'rgba(113,237,255,.15)';
    return 'rgba(186,255,92,.12)';
}
function breakingbadBuildGlyphString(linesCount) {
    const lines = [];
    for (let i = 0; i < linesCount; i++) {
        lines.push(BREAKINGBAD_GLYPHS[breakingbadInt(0, BREAKINGBAD_GLYPHS.length - 1)]);
    }
    return lines.join('\n');
}

function breakingbadCreateGridOverlay() {
    const overlay = document.createElement('div');
    overlay.className = 'breakingbad-grid-overlay';
    breakingbadBackground.appendChild(overlay);

    for (let i = 0; i < 3; i++) {
        const beam = document.createElement('div');
        beam.className = 'breakingbad-scan-beam';
        beam.style.setProperty('--scan-duration', `${breakingbadRandom(7.2, 11.4)}s`);
        beam.style.setProperty('--scan-delay', `${-(i * breakingbadRandom(1.8, 3.1))}s`);
        breakingbadBackground.appendChild(beam);
    }

    for (let i = 0; i < 6; i++) {
        const band = document.createElement('div');
        band.className = 'breakingbad-glitch-band';
        band.style.setProperty('--band-top', `${breakingbadRandom(8, 92)}%`);
        band.style.setProperty('--band-height', `${breakingbadRandom(5, 12)}px`);
        band.style.setProperty('--band-duration', `${breakingbadRandom(4.2, 8.6)}s`);
        band.style.setProperty('--band-delay', `${-breakingbadRandom(0, 8)}s`);
        breakingbadBackground.appendChild(band);
    }
}

function breakingbadCreateCodeRain() {
    for (let i = 0; i < 14; i++) {
        const column = document.createElement('div');
        column.className = 'breakingbad-code-column';
        column.textContent = breakingbadBuildGlyphString(breakingbadInt(14, 34));
        column.style.setProperty('--bb-left', `${breakingbadRandom(-2, 100)}%`);
        column.style.setProperty('--bb-width', `${breakingbadRandom(16, 26)}px`);
        column.style.setProperty('--bb-font-size', `${breakingbadRandom(10, 15)}px`);
        column.style.setProperty('--bb-opacity', breakingbadRandom(.04, .12).toFixed(2));
        column.style.setProperty('--bb-duration', `${breakingbadRandom(10, 19)}s`);
        column.style.setProperty('--bb-delay', `${-breakingbadRandom(0, 18)}s`);
        column.style.setProperty('--bb-drift', `${breakingbadRandom(-30, 30)}px`);
        column.style.setProperty('--bb-blur', `${breakingbadRandom(.2, .8)}px`);
        breakingbadBackground.appendChild(column);
    }
}


function breakingbadCreateCursorGlow() {
    const glow = document.createElement('div');
    glow.className = 'breakingbad-cursor-glow';
    glow.setAttribute('aria-hidden', 'true');
    breakingbadBackground.appendChild(glow);
    breakingbadCursorGlow = glow;

    const reticle = document.createElement('div');
    reticle.className = 'breakingbad-cursor-reticle';
    reticle.setAttribute('aria-hidden', 'true');
    breakingbadBackground.appendChild(reticle);
}

function breakingbadCreatePeriodicTable() {
    const wrap = document.createElement('div');
    wrap.className = 'breakingbad-periodic-table';
    const label = document.createElement('div');
    label.className = 'breakingbad-periodic-label';
    label.textContent = 'PERIODIC TABLE';
    wrap.appendChild(label);
    const cells = [];
    for (const [sym, num, col, row] of BREAKINGBAD_PERIODIC_DATA) {
        const cell = document.createElement('div');
        cell.className = 'breakingbad-pt-cell';
        cell.style.gridColumn = String(col);
        cell.style.gridRow = String(row);
        cell.style.setProperty('--bb-cell-tint', breakingbadCellTone(col, row));
        cell.innerHTML = `<span class="pt-num">${num}</span><span class="pt-sym">${sym}</span>`;
        wrap.appendChild(cell);
        cells.push(cell);
    }
    breakingbadBackground.appendChild(wrap);
    breakingbadPeriodicCells = cells;
}


function breakingbadCreateFormulaTags() {
    const tagPositions = [[18,10],[40,9],[61,11],[82,9],[10,79],[88,79],[50,6],[49,88]];
    const tags = [];
    for (let i = 0; i < tagPositions.length; i++) {
        const tag = document.createElement('div');
        tag.className = 'breakingbad-formula';
        tag.textContent = BREAKINGBAD_FORMULAS[i % BREAKINGBAD_FORMULAS.length];
        tag.style.left = `${tagPositions[i][0]}%`;
        tag.style.top = `${tagPositions[i][1]}%`;
        tag.style.setProperty('--formula-delay', `${-breakingbadRandom(0, 6)}s`);
        tag.style.setProperty('--formula-duration', `${breakingbadRandom(5.5, 9.2)}s`);
        breakingbadBackground.appendChild(tag);
        tags.push(tag);
    }
    breakingbadFormulaTags = tags;
}

function breakingbadCreateDataPackets() {
    for (let i = 0; i < 8; i++) {
        const packet = document.createElement('div');
        packet.className = 'breakingbad-data-packet';
        packet.style.setProperty('--packet-top', `${breakingbadRandom(12, 92)}%`);
        packet.style.setProperty('--packet-width', `${breakingbadRandom(12, 28)}vw`);
        packet.style.setProperty('--packet-duration', `${breakingbadRandom(8, 16)}s`);
        packet.style.setProperty('--packet-delay', `${-breakingbadRandom(0, 18)}s`);
        breakingbadBackground.appendChild(packet);
    }
}

function breakingbadCreateCard(index, chem, slot) {
    const card = document.createElement('div');
    card.className = 'breakingbad-item';
    card.style.left = `${slot[0]}%`;
    card.style.top = `${slot[1]}%`;
    card.style.width = `${breakingbadRandom(72, 98)}px`;
    card.style.height = `${breakingbadRandom(84, 108)}px`;
    card.style.zIndex = String(index + 5);
    card.style.setProperty('--breakingbad-float-x', `${breakingbadRandom(-8, 8)}px`);
    card.style.setProperty('--breakingbad-float-y', `${breakingbadRandom(-10, 10)}px`);
    card.style.setProperty('--breakingbad-float-r', `${breakingbadRandom(-5, 5)}deg`);
    card.style.setProperty('--breakingbad-float-duration', `${breakingbadRandom(5.6, 8.8)}s`);
    card.style.setProperty('--breakingbad-float-delay', `${-breakingbadRandom(0, 8)}s`);
    card.style.setProperty('--breakingbad-bop-delay', `${-breakingbadRandom(0, 0.7)}s`);
    card.innerHTML = `<span class="bb-num">${chem[1]}</span><span class="bb-sym">${chem[0]}</span><span class="bb-name">${chem[2]}</span>`;
    if (BREAKINGBAD_BOP_INDEXES.has(index)) {
        card.classList.add('breakingbad-intro-bop-target');
        if (breakingbadIntroActive) card.classList.add('breakingbad-intro-bop');
    }
    breakingbadBackground.appendChild(card);
}
function breakingbadCreateItems() {
    const slots = BREAKINGBAD_SLOTS.slice();
    const chems = breakingbadShuffle(BREAKINGBAD_DECOR_CARDS);
    for (let i = 0; i < Math.min(14, slots.length, chems.length); i++) {
        breakingbadCreateCard(i, chems[i], slots[i]);
    }
}
function breakingbadCreateExtras() {
    for (let i = 0; i < 22; i++) {
        const spark = document.createElement('span');
        spark.className = 'breakingbad-extra breakingbad-spark';
        spark.style.left = `${breakingbadRandom(3, 97)}%`;
        spark.style.top = `${breakingbadRandom(6, 94)}%`;
        spark.style.setProperty('--breakingbad-extra-duration', `${breakingbadRandom(2.8, 5.8)}s`);
        spark.style.setProperty('--breakingbad-extra-delay', `${-breakingbadRandom(0, 7)}s`);
        breakingbadBackground.appendChild(spark);
    }
    for (let i = 0; i < 10; i++) {
        const vapor = document.createElement('span');
        vapor.className = 'breakingbad-extra breakingbad-vapor';
        vapor.style.left = `${breakingbadRandom(4, 96)}%`;
        vapor.style.bottom = `${breakingbadRandom(-10, 20)}%`;
        vapor.style.width = `${breakingbadRandom(80, 180)}px`;
        vapor.style.height = `${breakingbadRandom(60, 140)}px`;
        vapor.style.setProperty('--breakingbad-extra-x', `${breakingbadRandom(-24, 24)}px`);
        vapor.style.setProperty('--breakingbad-extra-duration', `${breakingbadRandom(7.8, 14.2)}s`);
        vapor.style.setProperty('--breakingbad-extra-delay', `${-breakingbadRandom(0, 9)}s`);
        breakingbadBackground.appendChild(vapor);
    }
}

function breakingbadStartAmbientFx() {
    breakingbadStopAmbientFx();
    breakingbadGlitchInterval = setInterval(() => {
        if (!breakingbadPeriodicCells.length) return;
        const picks = breakingbadShuffle(breakingbadPeriodicCells).slice(0, 10);
        picks.forEach(cell => cell.classList.add('breakingbad-glitch'));
        setTimeout(() => picks.forEach(cell => cell.classList.remove('breakingbad-glitch')), 520);
    }, 1800);

    breakingbadPulseInterval = setInterval(() => {
        if (breakingbadFormulaTags.length) {
            const tag = breakingbadFormulaTags[breakingbadInt(0, breakingbadFormulaTags.length - 1)];
            tag.classList.add('breakingbad-formula-hot');
            setTimeout(() => tag.classList.remove('breakingbad-formula-hot'), 900);
        }
    }, 2200);

}
function breakingbadStopAmbientFx() {
    if (breakingbadGlitchInterval) { clearInterval(breakingbadGlitchInterval); breakingbadGlitchInterval = null; }
    if (breakingbadPulseInterval) { clearInterval(breakingbadPulseInterval); breakingbadPulseInterval = null; }
}

function breakingbadStopIntro({ unlockHover = false } = {}) {
    if (breakingbadIntroTick !== null) {
        cancelAnimationFrame(breakingbadIntroTick);
        breakingbadIntroTick = null;
    }
    if (breakingbadIntroAudio) {
        try {
            breakingbadIntroAudio.pause();
            breakingbadIntroAudio.currentTime = 0;
            breakingbadIntroAudio.removeAttribute('src');
            breakingbadIntroAudio.load();
        } catch (_) {}
        breakingbadIntroAudio = null;
    }
    breakingbadSetIntroBop(false);
    document.body.classList.remove('theme-breakingbad-intro-playing');
    if (unlockHover) breakingbadHoverUnlocked = true;
}
async function breakingbadStartIntro() {
    breakingbadStopIntro();
    breakingbadHoverUnlocked = false;
    document.body.classList.add('theme-breakingbad-intro-playing');
    breakingbadSetIntroBop(true);
    const audio = new Audio();
    audio.preload = 'auto';
    audio.volume = BREAKINGBAD_INTRO_VOLUME;
    breakingbadIntroAudio = audio;

    const finishIntro = () => {
        if (breakingbadIntroAudio !== audio) return;
        try { audio.pause(); audio.volume = 0; } catch (_) {}
        breakingbadIntroAudio = null;
        breakingbadIntroTick = null;
        breakingbadSetIntroBop(false);
        breakingbadHoverUnlocked = true;
        document.body.classList.remove('theme-breakingbad-intro-playing');
    };

    const updateIntro = () => {
        if (breakingbadIntroAudio !== audio) return;
        const current = audio.currentTime || 0;
        if (current >= BREAKINGBAD_INTRO_CUTOFF) {
            finishIntro();
            return;
        }
        if (current >= BREAKINGBAD_INTRO_FADE_START) {
            const progress = Math.min(1, (current - BREAKINGBAD_INTRO_FADE_START) / (BREAKINGBAD_INTRO_CUTOFF - BREAKINGBAD_INTRO_FADE_START));
            audio.volume = BREAKINGBAD_INTRO_VOLUME * (1 - progress);
        } else {
            audio.volume = BREAKINGBAD_INTRO_VOLUME;
        }
        breakingbadIntroTick = requestAnimationFrame(updateIntro);
    };

    try {
        await breakingbadLoadAudioFromCandidates(audio, BREAKINGBAD_INTRO_SOURCES);
        const p = audio.play();
        if (p && typeof p.then === 'function') {
            p.then(() => {
                if (breakingbadIntroAudio === audio) breakingbadIntroTick = requestAnimationFrame(updateIntro);
            }).catch(() => {
                if (breakingbadIntroAudio === audio) breakingbadStopIntro({ unlockHover: true });
            });
        } else {
            breakingbadIntroTick = requestAnimationFrame(updateIntro);
        }
    } catch (_) {
        if (breakingbadIntroAudio === audio) breakingbadStopIntro({ unlockHover: true });
    }
}

function breakingbadStopHoverAudio() {
    if (breakingbadHoverAudio) {
        try {
            breakingbadHoverAudio.pause();
            breakingbadHoverAudio.currentTime = 0;
            breakingbadHoverAudio.removeAttribute('src');
            breakingbadHoverAudio.load();
        } catch (_) {}
        breakingbadHoverAudio = null;
    }
}
function breakingbadPlayHover() {
    if (!breakingbadHoverUnlocked) return;
    breakingbadStopHoverAudio();
    const audio = new Audio(BREAKINGBAD_HOVER_SOUNDS[breakingbadInt(0, BREAKINGBAD_HOVER_SOUNDS.length - 1)]);
    breakingbadHoverAudio = audio;
    audio.volume = BREAKINGBAD_HOVER_VOLUME;
    const p = audio.play();
    if (p && typeof p.catch === 'function') p.catch(() => {});
}
function breakingbadAnimateHover(item) {
    if (!item || typeof item.animate !== 'function') return;
    if (item._breakingbadHoverAnimation) {
        try { item._breakingbadHoverAnimation.cancel(); } catch (_) {}
    }
    item._breakingbadHoverAnimation = item.animate([
        { translate: '0 0', rotate: '0deg', scale: '1' },
        { translate: '0 -8px', rotate: '-5deg', scale: '1.06', offset: 0.34 },
        { translate: '0 -3px', rotate: '4deg', scale: '1.03', offset: 0.70 },
        { translate: '0 0', rotate: '0deg', scale: '1' }
    ], { duration: 480, easing: 'ease-out', fill: 'none' });
    item._breakingbadHoverAnimation.addEventListener('finish', () => { item._breakingbadHoverAnimation = null; }, { once: true });
}
function breakingbadPulseCell(cell) {
    if (!cell || typeof cell.animate !== 'function') return;
    if (cell._breakingbadCellAnim) {
        try { cell._breakingbadCellAnim.cancel(); } catch (_) {}
    }
    cell.classList.add('is-hot');
    cell._breakingbadCellAnim = cell.animate([
        { transform: 'scale(1)', opacity: .92 },
        { transform: 'scale(1.18)', opacity: 1, offset: 0.4 },
        { transform: 'scale(1.04)', opacity: .96, offset: 0.7 },
        { transform: 'scale(1)', opacity: .92 }
    ], { duration: 580, easing: 'ease-out', fill: 'none' });
    setTimeout(() => cell.classList.remove('is-hot'), 620);
}

function breakingbadCreateClickResponse(x, y) {
    if (!breakingbadBackground) return;

    const ring = document.createElement('span');
    ring.className = 'breakingbad-click-ring';
    ring.style.setProperty('--click-x', `${x}px`);
    ring.style.setProperty('--click-y', `${y}px`);
    breakingbadBackground.appendChild(ring);

    const response = document.createElement('span');
    response.className = 'breakingbad-click-response';
    response.style.setProperty('--click-x', `${x}px`);
    response.style.setProperty('--click-y', `${y}px`);
    response.textContent = BREAKINGBAD_CLICK_RESPONSES[breakingbadInt(0, BREAKINGBAD_CLICK_RESPONSES.length - 1)];
    breakingbadBackground.appendChild(response);

    const burst = document.createElement('div');
    burst.className = 'breakingbad-click-burst';
    burst.style.setProperty('--click-x', `${x}px`);
    burst.style.setProperty('--click-y', `${y}px`);
    const chars = breakingbadInt(7, 11);
    for (let i = 0; i < chars; i++) {
        const char = document.createElement('span');
        char.className = 'breakingbad-click-char';
        char.textContent = BREAKINGBAD_GLYPHS[breakingbadInt(0, BREAKINGBAD_GLYPHS.length - 1)];
        const angle = (Math.PI * 2 * i) / chars + breakingbadRandom(-.22, .22);
        const distance = breakingbadRandom(24, 64);
        char.style.setProperty('--burst-x', `${Math.cos(angle) * distance}px`);
        char.style.setProperty('--burst-y', `${Math.sin(angle) * distance}px`);
        char.style.animationDelay = `${breakingbadRandom(0, .08)}s`;
        burst.appendChild(char);
    }
    breakingbadBackground.appendChild(burst);

    if (breakingbadPeriodicCells.length) {
        const picks = breakingbadShuffle(breakingbadPeriodicCells).slice(0, 12);
        picks.forEach(cell => breakingbadPulseCell(cell));
    }

    setTimeout(() => ring.remove(), 820);
    setTimeout(() => response.remove(), 1120);
    setTimeout(() => burst.remove(), 900);
}

function breakingbadBindPointerEffects() {
    breakingbadPointerHandler = (event) => {
        if (!document.body.classList.contains('theme-breakingbad')) return;
        if (breakingbadLastPointerFrame) return;
        breakingbadLastPointerFrame = requestAnimationFrame(() => {
            breakingbadLastPointerFrame = 0;
            document.body.style.setProperty('--breakingbad-mouse-x', `${event.clientX}px`);
            document.body.style.setProperty('--breakingbad-mouse-y', `${event.clientY}px`);
            if (breakingbadCursorGlow) {
                breakingbadCursorGlow.style.left = `${event.clientX}px`;
                breakingbadCursorGlow.style.top = `${event.clientY}px`;
            }
        });
    };
    window.addEventListener('pointermove', breakingbadPointerHandler, { passive: true });
}
function breakingbadBindClickEffects() {
    breakingbadClickHandler = (event) => {
        if (!document.body.classList.contains('theme-breakingbad')) return;
        breakingbadCreateClickResponse(event.clientX, event.clientY);
    };
    window.addEventListener('pointerdown', breakingbadClickHandler, { passive: true });
}

function breakingbadInstallHover() {
    breakingbadHoverHandler = (event) => {
        if (!breakingbadBackground) return;

        let hit = null;
        for (const item of breakingbadBackground.querySelectorAll('.breakingbad-item')) {
            const r = item.getBoundingClientRect();
            if (event.clientX >= r.left && event.clientX <= r.right && event.clientY >= r.top && event.clientY <= r.bottom) {
                hit = item;
                break;
            }
        }
        if (hit && hit !== breakingbadHoverLast) {
            breakingbadHoverLast = hit;
            breakingbadAnimateHover(hit);
            breakingbadPlayHover();
        } else if (!hit) {
            breakingbadHoverLast = null;
        }

        let hoveredPt = null;
        for (const cell of breakingbadPeriodicCells) {
            const r = cell.getBoundingClientRect();
            if (event.clientX >= r.left && event.clientX <= r.right && event.clientY >= r.top && event.clientY <= r.bottom) {
                hoveredPt = cell;
                break;
            }
        }
        if (hoveredPt && hoveredPt !== breakingbadHoveredCell) {
            breakingbadHoveredCell = hoveredPt;
            breakingbadPulseCell(hoveredPt);
        } else if (!hoveredPt) {
            breakingbadHoveredCell = null;
        }
    };
    document.addEventListener('mousemove', breakingbadHoverHandler, { passive: true });
}

function breakingbadRemoveHandlers() {
    if (breakingbadHoverHandler) document.removeEventListener('mousemove', breakingbadHoverHandler);
    if (breakingbadPointerHandler) window.removeEventListener('pointermove', breakingbadPointerHandler);
    if (breakingbadClickHandler) window.removeEventListener('pointerdown', breakingbadClickHandler);
    if (breakingbadLastPointerFrame) {
        cancelAnimationFrame(breakingbadLastPointerFrame);
        breakingbadLastPointerFrame = 0;
    }
    breakingbadHoverHandler = null;
    breakingbadPointerHandler = null;
    breakingbadClickHandler = null;
    breakingbadHoverLast = null;
    breakingbadHoveredCell = null;
    breakingbadStopHoverAudio();
    document.body.style.removeProperty('--breakingbad-mouse-x');
    document.body.style.removeProperty('--breakingbad-mouse-y');
}

export function mount() {
    if (breakingbadBackground) return;
    breakingbadBackground = document.createElement('div');
    breakingbadBackground.id = 'breakingbad-background';
    breakingbadBackground.setAttribute('aria-hidden', 'true');
    document.body.appendChild(breakingbadBackground);

    breakingbadCreateGridOverlay();
    breakingbadCreateCodeRain();
    breakingbadCreateCursorGlow();
    breakingbadCreatePeriodicTable();
    breakingbadCreateFormulaTags();
    breakingbadCreateDataPackets();
    breakingbadCreateItems();
    breakingbadCreateExtras();
    breakingbadStartAmbientFx();
    breakingbadInstallHover();
    breakingbadBindPointerEffects();
    breakingbadBindClickEffects();
    breakingbadStartIntro();
}

export function unmount() {
    breakingbadStopIntro();
    breakingbadHoverUnlocked = false;
    breakingbadStopAmbientFx();
    breakingbadRemoveHandlers();
    breakingbadPeriodicCells = [];
    breakingbadFormulaTags = [];
    breakingbadCursorGlow = null;
    if (breakingbadBackground) {
        breakingbadBackground.remove();
        breakingbadBackground = null;
    }
}
