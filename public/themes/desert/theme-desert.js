/* ============================================================
   DESERT SUNSET THEME
   Background-only theme module. It intentionally does not touch
   app structure, cursor picker, theme preview cards, companions,
   tabs, or modal internals.
   ============================================================ */

const BACKGROUND_ID = 'desert-background';
const STYLESHEET_ID = 'theme-desert-stylesheet';

const scene = `
  <div class="desert-sky-wash"></div>
  <div class="desert-sun-wrap" aria-hidden="true">
    <svg viewBox="0 0 180 180" role="presentation">
      <defs>
        <radialGradient id="desertSunFill" cx="42%" cy="36%" r="66%">
          <stop offset="0" stop-color="#ffe7a3"/>
          <stop offset="0.55" stop-color="#f2b95f"/>
          <stop offset="1" stop-color="#d99143"/>
        </radialGradient>
      </defs>
      <g class="desert-sun-rays" stroke="#d79a4e" stroke-width="4" stroke-linecap="round">
        <path d="M90 7v19"/><path d="M90 154v19"/><path d="M7 90h19"/><path d="M154 90h19"/>
        <path d="M31 31l14 14"/><path d="M135 135l14 14"/><path d="M149 31l-14 14"/><path d="M45 135l-14 14"/>
      </g>
      <circle cx="90" cy="90" r="45" fill="url(#desertSunFill)"/>
      <circle cx="76" cy="73" r="13" fill="#fff7d5" opacity=".18"/>
    </svg>
  </div>

  <div class="desert-cloud desert-cloud-a" aria-hidden="true">
    <svg viewBox="0 0 260 80"><path d="M17 61c22-20 38-18 55-8 14-26 54-28 73-3 19-18 50-12 60 9 17-5 33 1 40 13H9c1-4 4-8 8-11Z" fill="#fff3dc" opacity=".46"/></svg>
  </div>
  <div class="desert-cloud desert-cloud-b" aria-hidden="true">
    <svg viewBox="0 0 220 70"><path d="M12 55c18-16 35-15 48-6 13-22 45-25 64-4 17-14 42-10 51 7 15-3 26 2 32 12H5c1-4 3-6 7-9Z" fill="#f9dfc4" opacity=".34"/></svg>
  </div>

  <div class="desert-birds" aria-hidden="true">
    <svg viewBox="0 0 240 80">
      <g fill="none" stroke="#775742" stroke-width="2.2" stroke-linecap="round" opacity=".52">
        <path d="M25 32q8-8 16 0q8-8 16 0"/><path d="M91 19q7-6 14 0q7-6 14 0"/><path d="M167 41q9-8 18 0q9-8 18 0"/>
      </g>
    </svg>
  </div>

  <div class="desert-svg-layer desert-mountains-far" aria-hidden="true">
    <svg viewBox="0 0 1600 500" preserveAspectRatio="none">
      <defs>
        <linearGradient id="farMountainGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#b99a82"/><stop offset="1" stop-color="#a9846d"/>
        </linearGradient>
      </defs>
      <path d="M0 420L120 310L220 365L350 245L470 355L590 295L720 390L850 270L965 355L1090 300L1230 382L1360 260L1470 345L1600 290V500H0Z" fill="url(#farMountainGrad)"/>
      <path d="M350 245L470 355L415 327L365 284L320 314Z" fill="#d7c0aa" opacity=".35"/>
      <path d="M850 270L965 355L918 334L864 305L812 328Z" fill="#d9c3ad" opacity=".27"/>
      <path d="M1360 260L1470 345L1424 326L1368 291L1318 320Z" fill="#d8c1a7" opacity=".24"/>
    </svg>
  </div>

  <div class="desert-svg-layer desert-mountains-near" aria-hidden="true">
    <svg viewBox="0 0 1600 420" preserveAspectRatio="none">
      <defs>
        <linearGradient id="nearMountainGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#9c745b"/><stop offset="1" stop-color="#815f4c"/>
        </linearGradient>
      </defs>
      <path d="M0 370L175 275L300 335L475 210L630 330L770 255L930 350L1085 235L1240 345L1390 270L1600 365V420H0Z" fill="url(#nearMountainGrad)"/>
      <path d="M475 210L630 330L565 300L495 250L430 278Z" fill="#b58b6d" opacity=".48"/>
      <path d="M1085 235L1240 345L1175 318L1100 274L1036 297Z" fill="#ae8166" opacity=".42"/>
    </svg>
  </div>

  <div class="desert-heat-haze" aria-hidden="true"></div>

  <div class="desert-svg-layer desert-dune-back" aria-hidden="true">
    <svg viewBox="0 0 1600 320" preserveAspectRatio="none">
      <defs>
        <linearGradient id="duneBackGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#c8925d"/><stop offset="1" stop-color="#ae7449"/>
        </linearGradient>
      </defs>
      <path d="M0 170C220 95 400 108 585 145C780 184 930 102 1130 111C1320 119 1460 175 1600 205V320H0Z" fill="url(#duneBackGrad)"/>
      <path d="M0 225C245 157 460 170 670 205C900 243 1075 167 1280 171C1430 174 1525 206 1600 235V320H0Z" fill="#9d6d49" opacity=".28"/>
    </svg>
  </div>

  <div class="desert-camel" aria-hidden="true">
    <svg viewBox="0 0 360 220">
      <g class="camel-body">
        <path d="M72 108C82 78 111 65 148 67C174 68 193 80 210 96C224 109 239 117 258 120C270 122 277 130 271 141C263 154 235 159 207 159L108 157C82 156 65 143 67 125C68 118 70 112 72 108Z" fill="#80604a" stroke="#4e392f" stroke-width="4"/>
        <path d="M108 78C105 55 115 31 135 27C156 23 171 41 171 65C170 78 164 88 156 96L117 94Z" fill="#946f51" stroke="#4e392f" stroke-width="4"/>
        <path d="M207 111C220 88 225 64 227 46C228 29 239 19 252 22C266 25 267 39 260 53C253 66 249 81 251 104L248 124L217 125Z" fill="#916b4e" stroke="#4e392f" stroke-width="4"/>
        <path d="M247 29C260 19 281 21 295 29C303 34 306 42 299 48C292 54 279 51 270 48L252 48L243 39Z" fill="#896249" stroke="#4e392f" stroke-width="4"/>
        <path d="M291 32C307 30 321 36 328 45C328 53 316 58 303 54L291 48Z" fill="#73513f" stroke="#4e392f" stroke-width="4"/>
        <circle cx="282" cy="35" r="4" fill="#211d1a"/><circle cx="283" cy="34" r="1.2" fill="#fff2d1"/>
      </g>
      <g class="camel-leg camel-leg-a"><path d="M91 145C94 163 91 184 86 204H103C110 184 113 164 110 148Z" fill="#765540" stroke="#4e392f" stroke-width="4"/></g>
      <g class="camel-leg camel-leg-b"><path d="M119 149C121 170 124 188 121 205H138C142 184 140 164 137 151Z" fill="#8c654b" stroke="#4e392f" stroke-width="4"/></g>
      <g class="camel-leg camel-leg-b"><path d="M220 145C223 165 220 186 218 204H235C238 183 241 164 243 148Z" fill="#765540" stroke="#4e392f" stroke-width="4"/></g>
      <g class="camel-leg camel-leg-a"><path d="M246 146C250 168 251 187 249 204H266C268 182 266 163 263 146Z" fill="#8c654b" stroke="#4e392f" stroke-width="4"/></g>
      <path class="camel-tail" d="M77 116C57 108 43 96 37 83C33 74 26 73 22 79C18 87 26 99 39 108C51 117 64 123 79 128" fill="none" stroke="#604333" stroke-width="8" stroke-linecap="round"/>
    </svg>
  </div>

  <div class="desert-mid-plants desert-mid-plant-a">${plantSvg('small')}</div>
  <div class="desert-mid-plants desert-mid-plant-b">${plantSvg('small')}</div>
  <div class="desert-mid-plants desert-mid-rocks">${rocksSvg()}</div>

  <div class="desert-svg-layer desert-dune-mid" aria-hidden="true">
    <svg viewBox="0 0 1600 300" preserveAspectRatio="none">
      <defs><linearGradient id="duneMidGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#c9925c"/><stop offset="1" stop-color="#a86e45"/></linearGradient></defs>
      <path d="M0 155C240 102 470 83 675 121C875 158 1040 116 1228 132C1390 146 1515 181 1600 214V300H0Z" fill="url(#duneMidGrad)"/>
      <path d="M0 213C280 158 500 152 725 183C930 212 1100 184 1282 193C1435 201 1530 224 1600 247V300H0Z" fill="#8e6043" opacity=".23"/>
    </svg>
  </div>

  <div class="desert-foreground desert-cactus-left">${plantSvg('large')}</div>
  <div class="desert-foreground desert-barrel-left">${barrelSvg()}</div>
  <div class="desert-foreground desert-rock-right">${rocksSvg()}</div>
  <div class="desert-foreground desert-cactus-right">${plantSvg('medium')}</div>
  <div class="desert-foreground desert-dead-tree">${treeSvg()}</div>

  <div class="desert-svg-layer desert-dune-front" aria-hidden="true">
    <svg viewBox="0 0 1600 260" preserveAspectRatio="none">
      <defs><linearGradient id="duneFrontGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#bd8452"/><stop offset="1" stop-color="#8e5b3d"/></linearGradient></defs>
      <path d="M0 112C230 61 440 45 655 74C870 103 1045 74 1260 88C1420 99 1526 124 1600 150V260H0Z" fill="url(#duneFrontGrad)"/>
    </svg>
  </div>

  <div class="desert-tumbleweed" aria-hidden="true">
    <svg viewBox="0 0 100 100"><g fill="none" stroke="#75543c" stroke-width="3" opacity=".72"><circle cx="50" cy="50" r="29"/><path d="M20 42c26-13 45 2 60 25M28 71c16-24 34-40 54-39M35 22c4 25 20 44 42 56M18 56c24 4 42-5 64-25M50 18c-5 28 1 48 20 66"/></g></svg>
  </div>

  <div class="desert-sand-particles" aria-hidden="true">
    ${Array.from({length: 18}, (_,i)=>`<i style="--i:${i}"></i>`).join('')}
  </div>
`;

function plantSvg(size='medium') {
  const cls = `desert-plant-svg desert-plant-${size}`;
  return `<svg class="${cls}" viewBox="0 0 180 340" aria-hidden="true">
    <g stroke="#415039" stroke-width="3" stroke-linejoin="round">
      <path fill="#728858" d="M68 323V78C68 52 77 37 92 34C108 31 121 42 122 66V323Z"/>
      <path fill="#728858" d="M69 190C52 190 42 178 42 160V116C42 103 35 96 27 96C18 96 13 104 13 117V169C13 199 35 217 69 217Z"/>
      <path fill="#728858" d="M122 193C140 193 148 180 148 163V119C148 105 155 98 163 98C172 98 177 106 177 119V170C177 200 154 218 122 218Z"/>
    </g>
    <g fill="none" stroke="#95a57a" stroke-width="1.7" opacity=".65"><path d="M82 43v277"/><path d="M98 37v283"/><path d="M112 47v273"/></g>
  </svg>`;
}

function barrelSvg() {
  return `<svg viewBox="0 0 240 180" aria-hidden="true">
    <g stroke="#46523a" stroke-width="3"><path fill="#7f925e" d="M20 144V77c0-26 17-42 43-42h15c25 0 42 17 42 42v67Z"/><path fill="#708655" d="M105 144V67c0-31 20-50 49-50 30 0 51 20 51 50v77Z"/></g>
    <g fill="none" stroke="#a7b48c" stroke-width="2" opacity=".7"><path d="M39 48v94"/><path d="M61 36v108"/><path d="M84 42v100"/><path d="M128 31v112"/><path d="M154 20v123"/><path d="M180 29v113"/></g>
  </svg>`;
}

function rocksSvg() {
  return `<svg viewBox="0 0 230 120" aria-hidden="true"><path d="M8 93L44 66L63 39L108 49L131 31L174 49L213 82L193 105L38 105Z" fill="#8f6750" stroke="#5c4336" stroke-width="3" stroke-linejoin="round"/><path d="M44 66L63 39L108 49L92 75Z" fill="#aa8061"/><path d="M92 75L108 49L131 31L155 51L139 78Z" fill="#77513f"/><path d="M139 78L155 51L174 49L193 74L177 91Z" fill="#99684e"/></svg>`;
}

function treeSvg() {
  return `<svg viewBox="0 0 110 210" aria-hidden="true"><g fill="none" stroke="#57463a" stroke-linecap="round"><path d="M55 205V72" stroke-width="5"/><path d="M55 98L27 68M55 118L83 87M55 141L25 116M55 163L84 136M55 181L31 160" stroke-width="3"/><path d="M27 68L20 52M27 68L38 53M83 87L92 70M83 87L73 69M25 116L16 102M25 116L37 100M84 136L95 120M84 136L73 117" stroke-width="2.4"/></g></svg>`;
}

function ensureStylesheet() {
  if (document.getElementById(STYLESHEET_ID)) return;
  const link = document.createElement('link');
  link.id = STYLESHEET_ID;
  link.rel = 'stylesheet';
  link.href = '/themes/theme-desert.css';
  document.head.appendChild(link);
}

export function mount() {
  ensureStylesheet();
  if (document.getElementById(BACKGROUND_ID)) return;

  const background = document.createElement('div');
  background.id = BACKGROUND_ID;
  background.className = 'desert-background';
  background.setAttribute('aria-hidden', 'true');
  background.innerHTML = scene;
  document.body.insertBefore(background, document.body.firstChild);
}

export function unmount() {
  document.getElementById(BACKGROUND_ID)?.remove();
  document.getElementById(STYLESHEET_ID)?.remove();
}
