/* ============================================================
   BEE THEME — BLANK-SCREEN FIX
   Self-contained bee SVGs, exact mount visibility, document-level
   hover detection, loops/dive flights, and alternating bee sounds.
   ============================================================ */

let beeRoot = null;
let beeRecords = [];
let mouseMoveHandler = null;
let resizeHandler = null;
let addedBodyClass = false;

let activeBuzz = null;
let activeBuzzFade = null;
let activeBuzzOwner = null;
let nextBuzzIndex = 0;

const HOVER_SOUNDS = [
    [
        "/sounds/bees/freesound_community-180526-bee-buzzing-away-isolated-event-toronto-94455.mp3",
        "/sounds/bee/freesound_community-180526-bee-buzzing-away-isolated-event-toronto-94455.mp3"
    ],
    [
        "/sounds/bees/257280 virtual_vibes-bee-close-up-464562.mp3",
        "/sounds/bee/257280 virtual_vibes-bee-close-up-464562.mp3"
    ]
];

const RAW_BEE_SVGS = [
    "<svg\n  id=\"beeSvg\"\n  xmlns=\"http://www.w3.org/2000/svg\"\n  viewBox=\"0 0 320 220\"\n  width=\"320\"\n  height=\"220\"\n>\n  <defs>\n    <radialGradient id=\"beeGold\" cx=\"35%\" cy=\"30%\" r=\"75%\">\n      <stop offset=\"0%\" stop-color=\"#fff7a6\"/>\n      <stop offset=\"35%\" stop-color=\"#ffd84d\"/>\n      <stop offset=\"75%\" stop-color=\"#f4b321\"/>\n      <stop offset=\"100%\" stop-color=\"#d8890d\"/>\n    </radialGradient>\n\n    <linearGradient id=\"beeDark\" x1=\"0%\" y1=\"0%\" x2=\"100%\" y2=\"100%\">\n      <stop offset=\"0%\" stop-color=\"#3b2d20\"/>\n      <stop offset=\"50%\" stop-color=\"#1e1711\"/>\n      <stop offset=\"100%\" stop-color=\"#090806\"/>\n    </linearGradient>\n\n    <radialGradient id=\"headFuzz\" cx=\"40%\" cy=\"35%\" r=\"70%\">\n      <stop offset=\"0%\" stop-color=\"#ffd95c\"/>\n      <stop offset=\"70%\" stop-color=\"#e6a61f\"/>\n      <stop offset=\"100%\" stop-color=\"#c07d10\"/>\n    </radialGradient>\n\n    <linearGradient id=\"wingFill\" x1=\"0%\" y1=\"0%\" x2=\"100%\" y2=\"100%\">\n      <stop offset=\"0%\" stop-color=\"#ffffff\" stop-opacity=\"0.9\"/>\n      <stop offset=\"55%\" stop-color=\"#daf6ff\" stop-opacity=\"0.55\"/>\n      <stop offset=\"100%\" stop-color=\"#9dd8e8\" stop-opacity=\"0.28\"/>\n    </linearGradient>\n\n    <radialGradient id=\"eyeFill\" cx=\"30%\" cy=\"30%\" r=\"75%\">\n      <stop offset=\"0%\" stop-color=\"#5e5340\"/>\n      <stop offset=\"45%\" stop-color=\"#1e1b17\"/>\n      <stop offset=\"100%\" stop-color=\"#040404\"/>\n    </radialGradient>\n\n    <filter id=\"softShadow\" x=\"-30%\" y=\"-30%\" width=\"160%\" height=\"180%\">\n      <feGaussianBlur stdDeviation=\"5\"/>\n    </filter>\n  </defs>\n\n  <ellipse\n    id=\"beeShadow\"\n    cx=\"165\"\n    cy=\"190\"\n    rx=\"68\"\n    ry=\"12\"\n    fill=\"#000000\"\n    opacity=\"0.16\"\n    filter=\"url(#softShadow)\"\n  />\n\n  <g id=\"bee\">\n    <g id=\"backWing\">\n      <path\n        d=\"\n          M158 84\n          C148 54 160 35 184 30\n          C214 24 247 41 257 67\n          C264 85 251 99 227 101\n          C201 103 178 96 158 84\n          Z\n        \"\n        fill=\"url(#wingFill)\"\n        stroke=\"#7ea7b1\"\n        stroke-width=\"3\"\n      />\n      <g fill=\"none\" stroke=\"#8eb7bf\" stroke-width=\"1.7\" opacity=\"0.7\">\n        <path d=\"M165 83 C188 70 218 58 247 66\"/>\n        <path d=\"M172 87 C196 82 218 82 237 89\"/>\n        <path d=\"M178 74 C189 58 199 45 211 34\"/>\n        <path d=\"M196 91 C208 76 220 64 235 54\"/>\n      </g>\n    </g>\n\n    <g\n      id=\"rearLegs\"\n      fill=\"none\"\n      stroke=\"#241b13\"\n      stroke-width=\"6\"\n      stroke-linecap=\"round\"\n      stroke-linejoin=\"round\"\n    >\n      <g id=\"rearLeg\">\n        <path d=\"M223 142 C234 155 245 168 254 184\"/>\n        <path d=\"M254 184 C258 190 265 192 272 190\"/>\n      </g>\n\n      <g id=\"middleLeg\">\n        <path d=\"M186 146 C189 162 193 176 198 191\"/>\n        <path d=\"M198 191 C201 198 207 202 214 202\"/>\n      </g>\n    </g>\n\n    <g id=\"abdomen\">\n      <path\n        d=\"\n          M150 93\n          C183 87 224 91 249 109\n          C273 126 279 152 269 169\n          C257 189 224 198 188 192\n          C155 187 128 167 124 143\n          C121 122 130 101 150 93\n          Z\n        \"\n        fill=\"url(#beeGold)\"\n        stroke=\"#332518\"\n        stroke-width=\"4\"\n      />\n\n      <path\n        d=\"\n          M160 94\n          C163 111 161 131 155 151\n          C150 166 142 179 133 188\n          C123 182 116 172 114 160\n          C118 132 133 105 160 94\n          Z\n        \"\n        fill=\"url(#beeDark)\"\n      />\n\n      <path\n        d=\"\n          M196 91\n          C198 108 198 128 192 149\n          C188 164 182 178 174 190\n          L193 193\n          C209 178 219 156 221 130\n          C221 115 218 102 213 94\n          Z\n        \"\n        fill=\"url(#beeDark)\"\n      />\n\n      <path\n        d=\"\n          M233 101\n          C236 114 235 130 230 147\n          C226 162 219 177 211 190\n          C228 190 244 185 255 176\n          C262 166 266 154 265 142\n          C262 124 252 110 233 101\n          Z\n        \"\n        fill=\"url(#beeDark)\"\n      />\n\n      <path\n        d=\"M145 106 C168 96 195 97 215 106\"\n        fill=\"none\"\n        stroke=\"#fff4a4\"\n        stroke-width=\"6\"\n        stroke-linecap=\"round\"\n        opacity=\"0.55\"\n      />\n\n      <g stroke=\"#7a5318\" stroke-width=\"2\" stroke-linecap=\"round\" opacity=\"0.55\">\n        <path d=\"M136 115 L127 109\"/>\n        <path d=\"M131 128 L120 126\"/>\n        <path d=\"M131 145 L119 147\"/>\n        <path d=\"M137 160 L126 166\"/>\n        <path d=\"M146 176 L139 185\"/>\n\n        <path d=\"M250 116 L260 111\"/>\n        <path d=\"M257 129 L268 128\"/>\n        <path d=\"M257 145 L268 147\"/>\n        <path d=\"M252 160 L263 168\"/>\n        <path d=\"M243 176 L250 185\"/>\n      </g>\n\n      <path\n        id=\"stinger\"\n        d=\"M269 145 L292 151 L270 159 Z\"\n        fill=\"#1a140f\"\n        stroke=\"#0c0907\"\n        stroke-width=\"2\"\n      />\n    </g>\n\n    <g id=\"thorax\">\n      <ellipse\n        cx=\"138\"\n        cy=\"136\"\n        rx=\"42\"\n        ry=\"36\"\n        fill=\"url(#beeDark)\"\n        stroke=\"#1a130f\"\n        stroke-width=\"4\"\n      />\n\n      <path\n        d=\"\n          M109 129\n          C111 110 125 101 140 101\n          C156 101 171 113 171 134\n          C171 152 158 164 141 165\n          C123 165 110 150 109 129\n          Z\n        \"\n        fill=\"url(#headFuzz)\"\n        opacity=\"0.95\"\n      />\n    </g>\n\n    <g id=\"frontWing\">\n      <path\n        d=\"\n          M145 91\n          C131 56 138 28 161 18\n          C191 5 233 17 251 43\n          C264 63 255 81 229 87\n          C201 93 170 95 145 91\n          Z\n        \"\n        fill=\"url(#wingFill)\"\n        stroke=\"#7ea7b1\"\n        stroke-width=\"3\"\n      />\n      <g fill=\"none\" stroke=\"#8eb7bf\" stroke-width=\"1.7\" opacity=\"0.72\">\n        <path d=\"M153 89 C180 71 211 54 242 50\"/>\n        <path d=\"M160 92 C189 87 215 88 237 77\"/>\n        <path d=\"M167 75 C181 56 192 38 203 21\"/>\n        <path d=\"M185 93 C204 75 221 61 242 49\"/>\n      </g>\n      <path\n        d=\"M164 42 C186 27 214 29 234 42\"\n        fill=\"none\"\n        stroke=\"#ffffff\"\n        stroke-width=\"4\"\n        stroke-linecap=\"round\"\n        opacity=\"0.5\"\n      />\n    </g>\n\n    <g id=\"head\">\n      <ellipse\n        cx=\"86\"\n        cy=\"132\"\n        rx=\"31\"\n        ry=\"28\"\n        fill=\"url(#beeDark)\"\n        stroke=\"#19120d\"\n        stroke-width=\"4\"\n      />\n\n      <path\n        d=\"\n          M65 131\n          C65 117 74 107 87 107\n          C100 107 109 117 109 131\n          C109 145 100 154 87 155\n          C74 154 65 145 65 131\n          Z\n        \"\n        fill=\"url(#headFuzz)\"\n      />\n\n      <g id=\"eye\">\n        <ellipse\n          cx=\"82\"\n          cy=\"127\"\n          rx=\"8\"\n          ry=\"11\"\n          fill=\"url(#eyeFill)\"\n          stroke=\"#050505\"\n          stroke-width=\"2\"\n        />\n        <ellipse cx=\"79\" cy=\"123\" rx=\"2.8\" ry=\"4\" fill=\"#ffffff\" opacity=\"0.88\" />\n      </g>\n\n      <path\n        id=\"mouth\"\n        d=\"M77 142 Q87 148 97 141\"\n        fill=\"none\"\n        stroke=\"#3a2619\"\n        stroke-width=\"3\"\n        stroke-linecap=\"round\"\n      />\n\n      <path\n        id=\"proboscis\"\n        d=\"M55 140 Q45 145 40 152\"\n        fill=\"none\"\n        stroke=\"#2b2018\"\n        stroke-width=\"3\"\n        stroke-linecap=\"round\"\n      />\n    </g>\n\n    <g\n      id=\"antennae\"\n      fill=\"none\"\n      stroke=\"#241b13\"\n      stroke-width=\"4\"\n      stroke-linecap=\"round\"\n    >\n      <g id=\"leftAntenna\">\n        <path d=\"M80 107 C72 90 61 82 49 79\"/>\n        <circle cx=\"47\" cy=\"78\" r=\"5\" fill=\"#241b13\" stroke=\"none\"/>\n      </g>\n      <g id=\"rightAntenna\">\n        <path d=\"M96 108 C96 88 105 74 116 67\"/>\n        <circle cx=\"119\" cy=\"65\" r=\"5\" fill=\"#241b13\" stroke=\"none\"/>\n      </g>\n    </g>\n\n    <g\n      id=\"frontLeg\"\n      fill=\"none\"\n      stroke=\"#241b13\"\n      stroke-width=\"6\"\n      stroke-linecap=\"round\"\n      stroke-linejoin=\"round\"\n    >\n      <path d=\"M122 146 C110 158 98 172 88 188\"/>\n      <path d=\"M88 188 C83 194 76 197 69 196\"/>\n    </g>\n  </g>\n</svg>",
    "<svg\n  id=\"animatedBee\"\n  xmlns=\"http://www.w3.org/2000/svg\"\n  viewBox=\"0 0 300 240\"\n  width=\"300\"\n  height=\"240\"\n>\n  <defs>\n    <!-- BODY GRADIENTS -->\n    <radialGradient id=\"beeYellow\" cx=\"35%\" cy=\"30%\" r=\"75%\">\n      <stop offset=\"0%\" stop-color=\"#fff58a\"/>\n      <stop offset=\"35%\" stop-color=\"#ffd83d\"/>\n      <stop offset=\"75%\" stop-color=\"#f5ad16\"/>\n      <stop offset=\"100%\" stop-color=\"#d77b08\"/>\n    </radialGradient>\n\n    <linearGradient id=\"beeBlack\" x1=\"0%\" y1=\"0%\" x2=\"100%\" y2=\"100%\">\n      <stop offset=\"0%\" stop-color=\"#40311e\"/>\n      <stop offset=\"45%\" stop-color=\"#211a13\"/>\n      <stop offset=\"100%\" stop-color=\"#090705\"/>\n    </linearGradient>\n\n    <!-- WING GRADIENT -->\n    <linearGradient id=\"wingGlass\" x1=\"0%\" y1=\"0%\" x2=\"100%\" y2=\"100%\">\n      <stop offset=\"0%\" stop-color=\"#ffffff\" stop-opacity=\".85\"/>\n      <stop offset=\"45%\" stop-color=\"#dff7ff\" stop-opacity=\".55\"/>\n      <stop offset=\"100%\" stop-color=\"#9ed9e8\" stop-opacity=\".35\"/>\n    </linearGradient>\n\n    <!-- EYE -->\n    <radialGradient id=\"eyeGradient\" cx=\"30%\" cy=\"25%\" r=\"70%\">\n      <stop offset=\"0%\" stop-color=\"#76684f\"/>\n      <stop offset=\"35%\" stop-color=\"#29251e\"/>\n      <stop offset=\"100%\" stop-color=\"#050505\"/>\n    </radialGradient>\n\n    <!-- SOFT SHADOW -->\n    <filter id=\"beeShadow\" x=\"-30%\" y=\"-30%\" width=\"160%\" height=\"180%\">\n      <feGaussianBlur stdDeviation=\"5\"/>\n    </filter>\n  </defs>\n\n  <!-- ======================= -->\n  <!-- SHADOW -->\n  <!-- ======================= -->\n\n  <ellipse\n    id=\"bee-shadow\"\n    cx=\"150\"\n    cy=\"205\"\n    rx=\"67\"\n    ry=\"13\"\n    fill=\"#000\"\n    opacity=\".16\"\n    filter=\"url(#beeShadow)\"\n  />\n\n  <!-- ======================= -->\n  <!-- ENTIRE BEE -->\n  <!-- Animate this group to make bee fly -->\n  <!-- ======================= -->\n\n  <g id=\"bee\">\n\n    <!-- ======================= -->\n    <!-- BACK LEGS -->\n    <!-- ======================= -->\n\n    <g\n      id=\"back-left-leg\"\n      fill=\"none\"\n      stroke=\"#261d14\"\n      stroke-width=\"6\"\n      stroke-linecap=\"round\"\n      stroke-linejoin=\"round\"\n    >\n      <path d=\"M118 154 C99 165 90 179 82 192\"/>\n      <path d=\"M82 192 C76 199 69 201 62 198\"/>\n    </g>\n\n    <g\n      id=\"back-right-leg\"\n      fill=\"none\"\n      stroke=\"#261d14\"\n      stroke-width=\"6\"\n      stroke-linecap=\"round\"\n      stroke-linejoin=\"round\"\n    >\n      <path d=\"M179 155 C197 166 207 178 218 192\"/>\n      <path d=\"M218 192 C224 198 232 201 239 197\"/>\n    </g>\n\n    <!-- ======================= -->\n    <!-- WINGS -->\n    <!-- Keep these groups separate -->\n    <!-- so CSS/JS can rotate them -->\n    <!-- ======================= -->\n\n    <g\n      id=\"left-wing\"\n      style=\"transform-box: fill-box; transform-origin: 90% 80%;\"\n    >\n      <path\n        d=\"\n          M136 102\n          C107 59 75 42 52 54\n          C31 65 38 94 65 109\n          C84 120 108 121 137 117\n          Z\n        \"\n        fill=\"url(#wingGlass)\"\n        stroke=\"#759ba4\"\n        stroke-width=\"3\"\n      />\n\n      <!-- wing veins -->\n      <g\n        fill=\"none\"\n        stroke=\"#86acb4\"\n        stroke-width=\"1.6\"\n        opacity=\".65\"\n      >\n        <path d=\"M132 109 C105 93 81 75 58 62\"/>\n        <path d=\"M117 113 C91 101 69 97 48 87\"/>\n        <path d=\"M101 96 C91 80 85 68 83 56\"/>\n        <path d=\"M79 101 C69 88 61 76 58 63\"/>\n      </g>\n\n      <path\n        d=\"M58 65 C74 55 92 63 105 74\"\n        fill=\"none\"\n        stroke=\"#fff\"\n        stroke-width=\"4\"\n        stroke-linecap=\"round\"\n        opacity=\".55\"\n      />\n    </g>\n\n    <g\n      id=\"right-wing\"\n      style=\"transform-box: fill-box; transform-origin: 10% 80%;\"\n    >\n      <path\n        d=\"\n          M165 102\n          C193 59 225 42 248 54\n          C269 65 262 94 235 109\n          C216 120 192 121 163 117\n          Z\n        \"\n        fill=\"url(#wingGlass)\"\n        stroke=\"#759ba4\"\n        stroke-width=\"3\"\n      />\n\n      <g\n        fill=\"none\"\n        stroke=\"#86acb4\"\n        stroke-width=\"1.6\"\n        opacity=\".65\"\n      >\n        <path d=\"M168 109 C195 93 219 75 242 62\"/>\n        <path d=\"M183 113 C209 101 231 97 252 87\"/>\n        <path d=\"M199 96 C209 80 215 68 217 56\"/>\n        <path d=\"M221 101 C231 88 239 76 242 63\"/>\n      </g>\n\n      <path\n        d=\"M242 65 C226 55 208 63 195 74\"\n        fill=\"none\"\n        stroke=\"#fff\"\n        stroke-width=\"4\"\n        stroke-linecap=\"round\"\n        opacity=\".55\"\n      />\n    </g>\n\n    <!-- ======================= -->\n    <!-- ABDOMEN -->\n    <!-- ======================= -->\n\n    <g id=\"abdomen\">\n      <ellipse\n        cx=\"150\"\n        cy=\"140\"\n        rx=\"61\"\n        ry=\"49\"\n        fill=\"url(#beeYellow)\"\n        stroke=\"#332517\"\n        stroke-width=\"4\"\n      />\n\n      <!-- black stripes -->\n      <path\n        d=\"\n          M105 108\n          C115 101 123 98 131 96\n          C126 111 126 128 130 142\n          C116 140 104 136 93 130\n          C95 120 99 113 105 108Z\n        \"\n        fill=\"url(#beeBlack)\"\n      />\n\n      <path\n        d=\"\n          M146 92\n          C156 91 167 93 177 97\n          C170 112 168 130 172 148\n          C159 145 146 144 134 144\n          C129 127 130 108 136 94\n          C139 93 143 92 146 92Z\n        \"\n        fill=\"url(#beeBlack)\"\n      />\n\n      <path\n        d=\"\n          M190 102\n          C203 110 212 122 211 139\n          C210 153 203 165 192 174\n          C184 167 177 157 173 146\n          C171 130 176 114 183 102\n          Z\n        \"\n        fill=\"url(#beeBlack)\"\n      />\n\n      <!-- abdomen highlight -->\n      <path\n        d=\"M113 110 C124 99 140 96 151 97\"\n        fill=\"none\"\n        stroke=\"#fff7a7\"\n        stroke-width=\"6\"\n        stroke-linecap=\"round\"\n        opacity=\".55\"\n      />\n\n      <!-- stinger -->\n      <path\n        id=\"stinger\"\n        d=\"M207 145 L229 151 L209 158 Z\"\n        fill=\"#282016\"\n        stroke=\"#16110d\"\n        stroke-width=\"2\"\n      />\n\n      <!-- fuzz -->\n      <g\n        stroke=\"#7a5319\"\n        stroke-width=\"2\"\n        stroke-linecap=\"round\"\n        opacity=\".6\"\n      >\n        <path d=\"M103 115 L94 108\"/>\n        <path d=\"M98 125 L88 121\"/>\n        <path d=\"M97 139 L86 139\"/>\n        <path d=\"M102 154 L92 159\"/>\n        <path d=\"M111 169 L104 178\"/>\n\n        <path d=\"M196 113 L206 106\"/>\n        <path d=\"M202 124 L213 121\"/>\n        <path d=\"M204 137 L216 137\"/>\n        <path d=\"M200 155 L210 161\"/>\n        <path d=\"M190 170 L198 180\"/>\n      </g>\n    </g>\n\n    <!-- ======================= -->\n    <!-- FRONT LEGS -->\n    <!-- ======================= -->\n\n    <g\n      id=\"front-left-leg\"\n      fill=\"none\"\n      stroke=\"#211910\"\n      stroke-width=\"6\"\n      stroke-linecap=\"round\"\n      stroke-linejoin=\"round\"\n    >\n      <path d=\"M116 139 C96 144 82 154 72 166\"/>\n      <path d=\"M72 166 C65 171 59 171 53 168\"/>\n    </g>\n\n    <g\n      id=\"front-right-leg\"\n      fill=\"none\"\n      stroke=\"#211910\"\n      stroke-width=\"6\"\n      stroke-linecap=\"round\"\n      stroke-linejoin=\"round\"\n    >\n      <path d=\"M184 139 C204 144 218 154 228 166\"/>\n      <path d=\"M228 166 C235 171 241 171 247 168\"/>\n    </g>\n\n    <!-- ======================= -->\n    <!-- HEAD -->\n    <!-- ======================= -->\n\n    <g id=\"bee-head\">\n\n      <!-- head shape -->\n      <ellipse\n        cx=\"150\"\n        cy=\"98\"\n        rx=\"45\"\n        ry=\"39\"\n        fill=\"url(#beeBlack)\"\n        stroke=\"#17110c\"\n        stroke-width=\"4\"\n      />\n\n      <!-- fuzzy golden face -->\n      <path\n        d=\"\n          M121 97\n          C121 78 133 67 150 67\n          C167 67 179 78 179 97\n          C179 112 167 124 150 125\n          C133 124 121 112 121 97Z\n        \"\n        fill=\"#e7a91e\"\n        opacity=\".95\"\n      />\n\n      <!-- tiny face fuzz -->\n      <g\n        stroke=\"#ffd94e\"\n        stroke-width=\"2\"\n        stroke-linecap=\"round\"\n        opacity=\".7\"\n      >\n        <path d=\"M131 80 L125 74\"/>\n        <path d=\"M141 74 L139 66\"/>\n        <path d=\"M151 73 L152 64\"/>\n        <path d=\"M162 75 L166 67\"/>\n        <path d=\"M170 82 L177 76\"/>\n\n        <path d=\"M127 103 L119 104\"/>\n        <path d=\"M132 114 L126 121\"/>\n        <path d=\"M143 120 L141 128\"/>\n        <path d=\"M158 120 L160 128\"/>\n        <path d=\"M169 113 L176 120\"/>\n        <path d=\"M174 102 L182 103\"/>\n      </g>\n\n      <!-- LEFT EYE -->\n      <g id=\"left-eye\">\n        <ellipse\n          cx=\"132\"\n          cy=\"94\"\n          rx=\"11\"\n          ry=\"15\"\n          fill=\"url(#eyeGradient)\"\n          stroke=\"#050505\"\n          stroke-width=\"2\"\n        />\n        <ellipse\n          cx=\"129\"\n          cy=\"89\"\n          rx=\"3.5\"\n          ry=\"5\"\n          fill=\"#fff\"\n          opacity=\".85\"\n        />\n        <circle\n          cx=\"135\"\n          cy=\"101\"\n          r=\"2\"\n          fill=\"#8b764d\"\n          opacity=\".5\"\n        />\n      </g>\n\n      <!-- RIGHT EYE -->\n      <g id=\"right-eye\">\n        <ellipse\n          cx=\"168\"\n          cy=\"94\"\n          rx=\"11\"\n          ry=\"15\"\n          fill=\"url(#eyeGradient)\"\n          stroke=\"#050505\"\n          stroke-width=\"2\"\n        />\n        <ellipse\n          cx=\"165\"\n          cy=\"89\"\n          rx=\"3.5\"\n          ry=\"5\"\n          fill=\"#fff\"\n          opacity=\".85\"\n        />\n        <circle\n          cx=\"171\"\n          cy=\"101\"\n          r=\"2\"\n          fill=\"#8b764d\"\n          opacity=\".5\"\n        />\n      </g>\n\n      <!-- mouth -->\n      <path\n        id=\"bee-mouth\"\n        d=\"M142 110 Q150 116 158 110\"\n        fill=\"none\"\n        stroke=\"#332016\"\n        stroke-width=\"3\"\n        stroke-linecap=\"round\"\n      />\n    </g>\n\n    <!-- ======================= -->\n    <!-- ANTENNAE -->\n    <!-- ======================= -->\n\n    <g\n      id=\"left-antenna\"\n      style=\"transform-box: fill-box; transform-origin: 100% 100%;\"\n    >\n      <path\n        d=\"M135 70 C126 53 113 45 103 43\"\n        fill=\"none\"\n        stroke=\"#241c14\"\n        stroke-width=\"4\"\n        stroke-linecap=\"round\"\n      />\n      <circle\n        cx=\"101\"\n        cy=\"42\"\n        r=\"6\"\n        fill=\"#2a2118\"\n      />\n    </g>\n\n    <g\n      id=\"right-antenna\"\n      style=\"transform-box: fill-box; transform-origin: 0% 100%;\"\n    >\n      <path\n        d=\"M165 70 C174 53 187 45 197 43\"\n        fill=\"none\"\n        stroke=\"#241c14\"\n        stroke-width=\"4\"\n        stroke-linecap=\"round\"\n      />\n      <circle\n        cx=\"199\"\n        cy=\"42\"\n        r=\"6\"\n        fill=\"#2a2118\"\n      />\n    </g>\n\n  </g>\n</svg>"
];

const PATTERNS = ["cruise", "loop", "figure8", "camera"];
const BEE_COUNT = 10;

function rand(min, max) {
    return Math.random() * (max - min) + min;
}

function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
}

function escapeRegExp(value) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function uniqueSvg(rawSvg, prefix) {
    const ids = [...rawSvg.matchAll(/id="([^"]+)"/g)].map(match => match[1]);
    let svg = rawSvg;

    ids.forEach(id => {
        const safe = escapeRegExp(id);
        const next = `${prefix}-${id}`;

        svg = svg
            .replace(new RegExp(`id="${safe}"`, "g"), `id="${next}"`)
            .replace(new RegExp(`url\\(#${safe}\\)`, "g"), `url(#${next})`);
    });

    return svg;
}

function createRoot() {
    const root = document.createElement("div");
    root.id = "bee-theme-background";
    root.className = "bee-theme-background";
    root.setAttribute("aria-hidden", "true");

    // Inline fallback styling means the theme is still visibly mounted even
    // if the external stylesheet is delayed or the body class was missing.
    Object.assign(root.style, {
        position: "fixed",
        inset: "0",
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        pointerEvents: "none",
        zIndex: "0",
        background:
            "radial-gradient(circle at 50% 5%, rgba(255,255,255,.78), transparent 23%), " +
            "linear-gradient(180deg,#fff8ce 0%,#f8e88e 48%,#efc54f 100%)"
    });

    const sky = document.createElement("div");
    sky.className = "bee-theme-sky";
    root.appendChild(sky);

    const honey = document.createElement("div");
    honey.className = "bee-theme-honeycomb";
    root.appendChild(honey);

    const pollen = document.createElement("div");
    pollen.className = "bee-theme-pollen";
    root.appendChild(pollen);

    const flowers = document.createElement("div");
    flowers.className = "bee-theme-flowers";
    // V290: the old flower layer depended entirely on theme-bees.css for its
    // size/position. On a cold load the JS can mount before that stylesheet is
    // parsed, so the bees (which have inline dimensions) appeared immediately
    // while every flower lived in a zero-sized/unpositioned layer until reload.
    // Give the layer a complete inline fallback so decorations are correct on
    // the very first paint too.
    Object.assign(flowers.style, {
        position: "absolute",
        left: "0",
        right: "0",
        bottom: "0",
        height: "23vh",
        pointerEvents: "none",
        overflow: "visible",
        zIndex: "2"
    });
    root.appendChild(flowers);

    const flight = document.createElement("div");
    flight.className = "bee-theme-flight-layer";
    Object.assign(flight.style, {
        position: "absolute",
        inset: "0",
        overflow: "visible",
        pointerEvents: "none",
        zIndex: "3"
    });
    root.appendChild(flight);

    return root;
}

function addPollen() {
    const layer = beeRoot.querySelector(".bee-theme-pollen");

    for (let i = 0; i < 34; i++) {
        const dot = document.createElement("span");
        dot.className = "bee-theme-pollen-dot";
        dot.style.left = `${rand(1, 99)}%`;
        dot.style.top = `${rand(4, 96)}%`;
        dot.style.setProperty("--size", `${rand(2, 7)}px`);
        dot.style.setProperty("--dx", `${rand(-20, 20)}px`);
        dot.style.setProperty("--dy", `${rand(-24, 24)}px`);
        dot.style.setProperty("--dur", `${rand(5, 9)}s`);
        dot.style.setProperty("--delay", `${-rand(0, 8)}s`);
        layer.appendChild(dot);
    }
}

function addFlowers() {
    const layer = beeRoot.querySelector(".bee-theme-flowers");
    if (!layer) return;
    const xs = [4, 13, 24, 36, 50, 64, 76, 88, 97];

    xs.forEach((x, i) => {
        const flower = document.createElement("span");
        flower.className = "bee-theme-flower";
        flower.dataset.beeFlowerV290 = "1";
        const scale = rand(.76, 1.2).toFixed(2);
        flower.style.left = `${x}%`;
        flower.style.setProperty("--scale", scale);
        flower.style.setProperty("--delay", `${-rand(0, 4)}s`);
        Object.assign(flower.style, {
            position: "absolute",
            bottom: "-8px",
            width: "64px",
            height: "116px",
            transform: `translateX(-50%) scale(${scale})`,
            transformOrigin: "50% 100%",
            pointerEvents: "none"
        });
        if (i % 2) flower.classList.add("is-pink");

        // V290: render a real SVG flower instead of relying on ::before/::after.
        // Pseudo-elements do not exist until the CSS arrives, which was the
        // reason flowers were missing on a cold load while the inline bee SVGs
        // were already visible. This SVG is the first-paint fallback and the CSS
        // continues to own the sway animation once it is available.
        const petal = i % 2 ? "#f6a8bd" : "#fffdf4";
        flower.innerHTML = `
          <svg viewBox="0 0 64 116" aria-hidden="true" focusable="false">
            <path d="M32 112 C31 88 33 63 32 38" fill="none" stroke="#5b9b31" stroke-width="5" stroke-linecap="round"/>
            <path d="M31 78 C22 71 17 72 13 79 C22 82 27 83 32 86" fill="#76b43f" opacity=".92"/>
            <path d="M33 67 C41 59 48 60 52 67 C45 71 39 73 33 75" fill="#76b43f" opacity=".92"/>
            <g transform="translate(32 27)">
              <ellipse cx="0" cy="-18" rx="8" ry="15" fill="${petal}"/>
              <ellipse cx="13" cy="-13" rx="8" ry="15" transform="rotate(45 13 -13)" fill="${petal}"/>
              <ellipse cx="18" cy="0" rx="8" ry="15" transform="rotate(90 18 0)" fill="${petal}"/>
              <ellipse cx="13" cy="13" rx="8" ry="15" transform="rotate(135 13 13)" fill="${petal}"/>
              <ellipse cx="0" cy="18" rx="8" ry="15" fill="${petal}"/>
              <ellipse cx="-13" cy="13" rx="8" ry="15" transform="rotate(45 -13 13)" fill="${petal}"/>
              <ellipse cx="-18" cy="0" rx="8" ry="15" transform="rotate(90 -18 0)" fill="${petal}"/>
              <ellipse cx="-13" cy="-13" rx="8" ry="15" transform="rotate(135 -13 -13)" fill="${petal}"/>
              <circle cx="0" cy="0" r="10" fill="#d69118"/>
              <circle cx="0" cy="0" r="5" fill="#70440d"/>
            </g>
          </svg>`;
        layer.appendChild(flower);
    });
}

function keyframesFor(record) {
    const y = record.y;
    const s = record.scale;

    if (record.pattern === "camera") {
        return [
            { transform: `translate3d(-18vw, ${clamp(y - 10, 8, 72)}vh, 0) rotate(-10deg) scale(${s * .72})` },
            { transform: `translate3d(22vw, ${clamp(y - 13, 8, 70)}vh, 0) rotate(-3deg) scale(${s * .88})`, offset: .25 },
            { transform: `translate3d(48vw, ${clamp(y - 2, 10, 80)}vh, 0) rotate(8deg) scale(${s * 1.42})`, offset: .48 },
            { transform: `translate3d(56vw, ${clamp(y + 5, 10, 84)}vh, 0) rotate(13deg) scale(${s * 1.95})`, offset: .58 },
            { transform: `translate3d(76vw, ${clamp(y + 2, 10, 84)}vh, 0) rotate(4deg) scale(${s * 1.05})`, offset: .74 },
            { transform: `translate3d(116vw, ${clamp(y - 7, 8, 74)}vh, 0) rotate(-2deg) scale(${s * .78})` }
        ];
    }

    if (record.pattern === "loop") {
        return [
            { transform: `translate3d(-16vw, ${y}vh, 0) rotate(0deg) scale(${s})` },
            { transform: `translate3d(20vw, ${clamp(y - 12, 8, 70)}vh, 0) rotate(-15deg) scale(${s})`, offset: .20 },
            { transform: `translate3d(39vw, ${clamp(y - 25, 7, 60)}vh, 0) rotate(-34deg) scale(${s * 1.06})`, offset: .34 },
            { transform: `translate3d(50vw, ${clamp(y + 1, 12, 82)}vh, 0) rotate(31deg) scale(${s * 1.14})`, offset: .48 },
            { transform: `translate3d(61vw, ${clamp(y - 24, 7, 62)}vh, 0) rotate(-31deg) scale(${s * 1.05})`, offset: .62 },
            { transform: `translate3d(82vw, ${clamp(y + 4, 12, 84)}vh, 0) rotate(10deg) scale(${s})`, offset: .80 },
            { transform: `translate3d(116vw, ${y}vh, 0) rotate(0deg) scale(${s * .95})` }
        ];
    }

    if (record.pattern === "figure8") {
        return [
            { transform: `translate3d(-16vw, ${y}vh, 0) rotate(-3deg) scale(${s})` },
            { transform: `translate3d(18vw, ${clamp(y - 15, 8, 70)}vh, 0) rotate(-12deg) scale(${s * 1.03})`, offset: .20 },
            { transform: `translate3d(38vw, ${clamp(y + 12, 12, 84)}vh, 0) rotate(11deg) scale(${s})`, offset: .38 },
            { transform: `translate3d(57vw, ${clamp(y - 13, 8, 72)}vh, 0) rotate(-10deg) scale(${s * 1.14})`, offset: .56 },
            { transform: `translate3d(76vw, ${clamp(y + 11, 12, 84)}vh, 0) rotate(10deg) scale(${s})`, offset: .74 },
            { transform: `translate3d(116vw, ${y}vh, 0) rotate(1deg) scale(${s})` }
        ];
    }

    return [
        { transform: `translate3d(-16vw, ${y}vh, 0) rotate(-3deg) scale(${s})` },
        { transform: `translate3d(20vw, ${clamp(y - 7, 8, 78)}vh, 0) rotate(4deg) scale(${s * 1.02})`, offset: .27 },
        { transform: `translate3d(50vw, ${clamp(y + 7, 10, 84)}vh, 0) rotate(-4deg) scale(${s * 1.16})`, offset: .52 },
        { transform: `translate3d(82vw, ${clamp(y - 5, 8, 80)}vh, 0) rotate(4deg) scale(${s})`, offset: .78 },
        { transform: `translate3d(116vw, ${y}vh, 0) rotate(0deg) scale(${s * .95})` }
    ];
}

function setFacing(record) {
    record.inner.style.setProperty("--bee-facing", record.direction > 0 ? "1" : "-1");
}

function startFlight(record, keepFraction = null) {
    try {
        record.animation?.cancel();
    } catch (_) {}

    // Visible static fallback before Web Animations starts.
    record.wrapper.style.transform =
        `translate3d(${rand(5, 88)}vw, ${record.y}vh, 0) scale(${record.scale})`;

    if (typeof record.wrapper.animate !== "function") return;

    record.animation = record.wrapper.animate(keyframesFor(record), {
        duration: record.duration,
        iterations: Infinity,
        easing: "linear"
    });

    record.animation.currentTime =
        keepFraction == null ? rand(0, record.duration) : keepFraction * record.duration;

    record.animation.playbackRate = record.direction;
    setFacing(record);
}

function reverseBee(record) {
    record.direction *= -1;
    setFacing(record);

    if (record.animation) {
        record.animation.playbackRate = record.direction;
        record.animation.play();
    }

    record.wrapper.classList.remove("bee-hit");
    void record.wrapper.offsetWidth;
    record.wrapper.classList.add("bee-hit");

    setTimeout(() => record.wrapper?.classList.remove("bee-hit"), 430);
}

function stopBuzz() {
    if (activeBuzzFade) {
        cancelAnimationFrame(activeBuzzFade);
        activeBuzzFade = null;
    }

    if (activeBuzz) {
        try {
            activeBuzz.pause();
            activeBuzz.currentTime = 0;
        } catch (_) {}
    }

    activeBuzz = null;
    activeBuzzOwner = null;
}

function fadeBuzz(duration = 420) {
    if (!activeBuzz) return;

    if (activeBuzzFade) {
        cancelAnimationFrame(activeBuzzFade);
        activeBuzzFade = null;
    }

    const audio = activeBuzz;
    activeBuzz = null;
    activeBuzzOwner = null;

    const startVolume = Math.max(.001, audio.volume || .72);
    const started = performance.now();

    const step = now => {
        const p = Math.min(1, (now - started) / duration);
        try {
            audio.volume = startVolume * Math.pow(1 - p, 1.55);
        } catch (_) {}

        if (p < 1) {
            activeBuzzFade = requestAnimationFrame(step);
        } else {
            try {
                audio.pause();
                audio.currentTime = 0;
            } catch (_) {}
            activeBuzzFade = null;
        }
    };

    activeBuzzFade = requestAnimationFrame(step);
}

function playBuzz(record) {
    stopBuzz();

    const candidates = HOVER_SOUNDS[nextBuzzIndex];
    nextBuzzIndex = (nextBuzzIndex + 1) % HOVER_SOUNDS.length;

    let candidateIndex = 0;
    let audio = null;

    function tryCandidate() {
        if (candidateIndex >= candidates.length) {
            if (activeBuzz === audio) {
                activeBuzz = null;
                activeBuzzOwner = null;
            }
            return;
        }

        audio = new Audio(candidates[candidateIndex++]);
        audio.preload = "auto";
        audio.volume = .72;

        activeBuzz = audio;
        activeBuzzOwner = record;

        audio.addEventListener("ended", () => {
            if (activeBuzz === audio) {
                activeBuzz = null;
                activeBuzzOwner = null;
            }
        }, { once: true });

        audio.addEventListener("error", () => {
            if (activeBuzz === audio) {
                tryCandidate();
            }
        }, { once: true });

        const p = audio.play();
        if (p && typeof p.catch === "function") {
            p.catch(() => {
                if (activeBuzz === audio) {
                    tryCandidate();
                }
            });
        }
    }

    tryCandidate();
}

function createBee(index) {
    const wrapper = document.createElement("div");
    wrapper.className = "bee-theme-bee";

    const inner = document.createElement("div");
    inner.className = "bee-theme-bee-inner";
    inner.innerHTML = uniqueSvg(
        RAW_BEE_SVGS[index % RAW_BEE_SVGS.length],
        `bee${index}${Math.floor(Math.random() * 1e7)}`
    );
    wrapper.appendChild(inner);

    const width = rand(132, 220);
    const record = {
        wrapper,
        inner,
        width,
        y: rand(12, 76),
        scale: rand(.66, 1.02),
        duration: rand(10500, 18500),
        direction: Math.random() < .5 ? 1 : -1,
        pattern: PATTERNS[index % PATTERNS.length],
        animation: null,
        inside: false
    };

    // Critical inline fallback dimensions/position: the bees cannot collapse
    // to 0x0 if CSS fails to arrive.
    Object.assign(wrapper.style, {
        position: "absolute",
        left: "0",
        top: "0",
        width: `${width}px`,
        height: `${Math.round(width * .74)}px`,
        pointerEvents: "none",
        willChange: "transform"
    });

    Object.assign(inner.style, {
        width: "100%",
        height: "100%"
    });

    const svg = inner.querySelector("svg");
    if (svg) {
        svg.style.width = "100%";
        svg.style.height = "100%";
        svg.style.overflow = "visible";
        svg.removeAttribute("width");
        svg.removeAttribute("height");
    }

    setFacing(record);
    return record;
}

function createBees() {
    const layer = beeRoot.querySelector(".bee-theme-flight-layer");

    for (let i = 0; i < BEE_COUNT; i++) {
        const record = createBee(i);
        beeRecords.push(record);
        layer.appendChild(record.wrapper);
        startFlight(record);
    }
}

function handleMouseMove(event) {
    const x = event.clientX;
    const y = event.clientY;

    beeRecords.forEach(record => {
        const rect = record.wrapper.getBoundingClientRect();

        // Shrink transparent SVG margins so the reaction matches the bee body.
        const px = Math.min(26, rect.width * .16);
        const py = Math.min(20, rect.height * .15);

        const inside =
            x >= rect.left + px &&
            x <= rect.right - px &&
            y >= rect.top + py &&
            y <= rect.bottom - py;

        if (inside && !record.inside) {
            record.inside = true;
            reverseBee(record);
            playBuzz(record);
        } else if (!inside && record.inside) {
            record.inside = false;
            if (activeBuzzOwner === record) fadeBuzz();
        }
    });
}

function refreshFlights() {
    beeRecords.forEach(record => {
        let fraction = null;

        if (record.animation && record.animation.currentTime != null) {
            fraction = (record.animation.currentTime % record.duration) / record.duration;
        }

        startFlight(record, fraction);
    });
}

function beesOriginalMount() {
    if (beeRoot) return;

    addedBodyClass = !document.body.classList.contains("theme-bees");
    document.body.classList.add("theme-bees");

    beeRoot = createRoot();
    document.body.appendChild(beeRoot);

    addPollen();
    addFlowers();
    createBees();

    mouseMoveHandler = handleMouseMove;
    document.addEventListener("mousemove", mouseMoveHandler, { passive: true });

    resizeHandler = refreshFlights;
    window.addEventListener("resize", resizeHandler, { passive: true });
}

function beesOriginalUnmount() {
    stopBuzz();

    if (mouseMoveHandler) {
        document.removeEventListener("mousemove", mouseMoveHandler);
        mouseMoveHandler = null;
    }

    if (resizeHandler) {
        window.removeEventListener("resize", resizeHandler);
        resizeHandler = null;
    }

    beeRecords.forEach(record => {
        try {
            record.animation?.cancel();
        } catch (_) {}
    });
    beeRecords = [];

    beeRoot?.remove();
    beeRoot = null;

    if (addedBodyClass) {
        document.body.classList.remove("theme-bees");
    }
    addedBodyClass = false;
}


/* ============================================================
   INTRO AUDIO ADDITION
   ============================================================ */
let beesIntroAudio = null;
let beesIntroFallback = null;
let beesIntroTimer = null;
const BEES_INTRO_SRC = "/sounds/intros/geoffharvey-busy-bees-158999.mp3";
const BEES_INTRO_VOLUME = 0.27;
const BEES_INTRO_END = null;
const BEES_INTRO_FADE_START = null;
const BEES_INTRO_FULL = true;
const BEES_INTRO_FADE_END = true;

function beesClearIntroFallback() {
    if (!beesIntroFallback) return;
    window.removeEventListener("pointerdown", beesIntroFallback);
    window.removeEventListener("keydown", beesIntroFallback);
    beesIntroFallback = null;
}

function beesStopIntro() {
    if (beesIntroTimer) {
        clearInterval(beesIntroTimer);
        beesIntroTimer = null;
    }
    beesClearIntroFallback();
    document.body.classList.remove("theme-bees-intro-playing");
    if (beesIntroAudio) {
        try {
            beesIntroAudio.pause();
            beesIntroAudio.currentTime = 0;
        } catch (_) {}
    }
    beesIntroAudio = null;
}

function beesPlayIntro() {
    beesStopIntro();
    const audio = new Audio(BEES_INTRO_SRC);
    beesIntroAudio = audio;
    audio.preload = "auto";
    audio.volume = BEES_INTRO_VOLUME;

    audio.addEventListener("playing", () => {
        document.body.classList.add("theme-bees-intro-playing");
        beesClearIntroFallback();
    });

    audio.addEventListener("ended", () => {
        beesStopIntro();
    }, { once: true });

    audio.addEventListener("error", () => {
        beesStopIntro();
    }, { once: true });

    beesIntroTimer = setInterval(() => {
        if (beesIntroAudio !== audio) return;
        const t = audio.currentTime || 0;

        if (BEES_INTRO_END != null) {
            if (BEES_INTRO_FADE_START != null && t >= BEES_INTRO_FADE_START) {
                const len = Math.max(.001, BEES_INTRO_END - BEES_INTRO_FADE_START);
                const p = Math.min(1, (t - BEES_INTRO_FADE_START) / len);
                audio.volume = Math.max(0, BEES_INTRO_VOLUME * (1 - p));
            }
            if (t >= BEES_INTRO_END) {
                beesStopIntro();
            }
        } else if (BEES_INTRO_FULL && BEES_INTRO_FADE_END &&
                   Number.isFinite(audio.duration) && audio.duration > 0) {
            const remaining = audio.duration - t;
            if (remaining <= 3) {
                audio.volume = Math.max(0, BEES_INTRO_VOLUME * (remaining / 3));
            }
        }
    }, 120);

    const p = audio.play();
    if (p && typeof p.catch === "function") {
        p.catch(() => {
            if (beesIntroFallback || beesIntroAudio !== audio) return;
            beesIntroFallback = () => {
                if (beesIntroAudio !== audio) return;
                const retry = audio.play();
                if (retry && typeof retry.catch === "function") retry.catch(() => {});
            };
            window.addEventListener("pointerdown", beesIntroFallback);
            window.addEventListener("keydown", beesIntroFallback);
        });
    }
}

export function mount() {
    beesOriginalMount();
    beesPlayIntro();
}

export function unmount() {
    beesStopIntro();
    beesOriginalUnmount();
}
