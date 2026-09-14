(() => {
'use strict';
if (window.__loggyWidgetsV239) return;
window.__loggyWidgetsV239 = true;

const V = '245';
const IS_DASH = !!document.getElementById('dashboard-grid');
const IS_LOG = !!document.getElementById('grid-view');
// V240: widgets are log-page only. Dashboard must never initialize the widget runtime,
// even if an older cached dashboard shell still references this shared script.
if (IS_DASH && !IS_LOG) return;
const KEYS = {
  prefs: 'loggy-widget-prefs-v239',
  custom: 'loggy-custom-widgets-v239',
  shortcuts: 'loggy-shortcuts-v239',
  data: 'loggy-widget-data-v239',
  sound: 'loggy-sound-shortcuts-v239'
};
const GROUP_ORDER = ['Focus & Input','Practice & Capture','Math & Science','Custom'];
const openCleanups = new Map();
const pressedCodes = new Set();
let captureState = null;
let modalStamp = 0;
let lastTextTarget = null;
const modalVisibilityV239 = new WeakMap();
let widgetUiRuntimeReadyV241 = false;
let deferredEnhancementsScheduledV241 = false;

const esc = value => String(value ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[ch]));
const clamp = (n,min,max) => Math.max(min, Math.min(max, Number(n) || 0));
const safeJson = (key, fallback) => { try { const v = JSON.parse(localStorage.getItem(key)); return v ?? fallback; } catch { return fallback; } };
const saveJson = (key, value) => { try { localStorage.setItem(key, JSON.stringify(value)); } catch {} };
const uid = prefix => `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,8)}`;

function themeVar(name, fallback) {
  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return value || fallback;
}

function injectStyle() {
  if (document.getElementById('loggy-widgets-v239-style')) return;
  const style = document.createElement('style');
  style.id = 'loggy-widgets-v239-style';
  style.textContent = `
  :root{--loggy-widget-surface:var(--white,#fff);--loggy-widget-text:var(--black,#111);--loggy-widget-muted:var(--muted-text,#666);--loggy-widget-border:var(--custom-theme-border-color,#111);--loggy-widget-accent:var(--custom-theme-accent,var(--black,#111));--loggy-widget-track:var(--track-bg,#ececec);--loggy-widget-radius:var(--border-radius,14px)}
  #loggy-widget-stage-v239{position:fixed;inset:0;z-index:2147483450;pointer-events:none;overflow:visible}
  .loggy-floating-widget-v239{position:fixed;width:min(360px,calc(100vw - 20px));max-height:min(560px,calc(100vh - 20px));display:flex;flex-direction:column;background:var(--loggy-widget-surface);color:var(--loggy-widget-text);border:var(--thick-border,2px solid var(--loggy-widget-border));border-radius:var(--loggy-widget-radius);box-shadow:var(--custom-theme-shadow,8px 8px 0 rgba(0,0,0,.16));overflow:hidden;pointer-events:auto;isolation:isolate}
  .loggy-floating-widget-v239.is-dragging{user-select:none;cursor:grabbing}
  .loggy-widget-header-v239{min-height:48px;display:flex;align-items:center;gap:9px;padding:8px 10px 8px 12px;border-bottom:var(--thin-border,1px solid rgba(0,0,0,.18));cursor:grab;flex:0 0 auto;background:var(--loggy-widget-surface);color:inherit}
  .loggy-widget-header-v239>i{font-size:1.22rem}.loggy-widget-header-v239 strong{font-size:.95rem;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;flex:1}
  .loggy-widget-body-v239{padding:14px;overflow:auto;overscroll-behavior:contain;flex:1 1 auto}
  .loggy-widget-body-v239 button,.loggy-widget-body-v239 input,.loggy-widget-body-v239 select,.loggy-widget-body-v239 textarea,.loggy-widget-modal-v239 button,.loggy-widget-modal-v239 input,.loggy-widget-modal-v239 select,.loggy-widget-modal-v239 textarea{font:inherit;box-sizing:border-box}
  .loggy-widget-body-v239 button,.loggy-widget-modal-v239 button{min-height:36px;padding:7px 11px}
  .loggy-widget-body-v239 input,.loggy-widget-body-v239 select,.loggy-widget-body-v239 textarea,.loggy-widget-modal-v239 input,.loggy-widget-modal-v239 select,.loggy-widget-modal-v239 textarea{background:var(--white,#fff);color:var(--black,#111);border:var(--thin-border,1px solid #aaa);border-radius:calc(var(--loggy-widget-radius) * .65);padding:9px 10px;width:100%}
  .loggy-widget-body-v239 textarea,.loggy-widget-modal-v239 textarea{resize:vertical;min-height:84px}
  .loggy-widget-row-v239{display:flex;align-items:center;gap:8px}.loggy-widget-row-v239>*{min-width:0}.loggy-widget-grow-v239{flex:1}
  .loggy-widget-muted-v239{color:var(--loggy-widget-muted);font-size:.83rem;line-height:1.35}.loggy-widget-value-v239{font-size:1.8rem;font-weight:800;line-height:1}
  .loggy-widget-close-v239,.loggy-widget-icon-btn-v239{width:36px;min-width:36px;height:36px;padding:0!important;display:grid;place-items:center;border-radius:10px}
  .loggy-widget-actions-v239{display:flex;gap:8px;flex-wrap:wrap}.loggy-widget-actions-v239>button{flex:1 1 auto}
  .loggy-widget-progress-v239{height:9px;border-radius:999px;background:var(--loggy-widget-track);overflow:hidden}.loggy-widget-progress-v239>i{display:block;height:100%;width:0;background:var(--loggy-widget-accent);transition:width .2s linear}
  .loggy-pomodoro-time-v239{font-size:3.1rem;font-weight:900;text-align:center;letter-spacing:.02em;margin:8px 0}.loggy-pomodoro-mode-v239{text-align:center;font-weight:700;margin-bottom:8px}
  .loggy-counter-v239{display:grid;grid-template-columns:1fr 1.4fr 1fr;align-items:stretch;gap:10px;user-select:none;-webkit-user-select:none}.loggy-counter-v239 button{font-size:2rem;min-height:74px}.loggy-counter-v239 output{display:grid;place-items:center;font-size:2.4rem;font-weight:900;border:var(--thin-border,1px solid #aaa);border-radius:var(--loggy-widget-radius)}
  .loggy-keyboard-rows-v239{display:flex;flex-direction:column;gap:6px;margin-top:9px}.loggy-keyboard-row-v239{display:flex;justify-content:center;gap:5px}.loggy-keyboard-row-v239 button{min-width:28px;padding:6px 7px;flex:1}.loggy-keyboard-controls-v239 button{font-size:.78rem}
  .loggy-webcam-v239{width:100%;aspect-ratio:4/3;object-fit:cover;border-radius:calc(var(--loggy-widget-radius) * .75);background:var(--loggy-widget-track);transform:scaleX(-1);border:var(--thin-border,1px solid #aaa)}
  .loggy-tuner-note-v239{text-align:center;font-size:3rem;font-weight:900}.loggy-tuner-detail-v239{text-align:center}.loggy-beat-v239{height:14px;border-radius:999px;background:var(--loggy-widget-track);transition:transform .08s,background .08s}.loggy-beat-v239.hit{transform:scaleY(1.7);background:var(--loggy-widget-accent)}
  .loggy-latex-preview-v239{min-height:72px;padding:14px;border:var(--thin-border,1px solid #aaa);border-radius:var(--loggy-widget-radius);overflow:auto;font-size:1.25rem;text-align:center;background:var(--white,#fff);color:var(--black,#111)}
  .loggy-latex-preview-v239 math{font-size:1.2em}.loggy-graph-canvas-v239,.loggy-unit-canvas-v239{width:100%;height:auto;display:block;background:var(--white,#fff);border:var(--thin-border,1px solid #aaa);border-radius:var(--loggy-widget-radius)}
  .loggy-base-grid-v239{display:grid;grid-template-columns:84px 1fr;gap:7px;align-items:center}.loggy-base-grid-v239 label{font-weight:700}
  .loggy-matrix-wrap-v239{display:grid;grid-template-columns:1fr 1fr;gap:12px}.loggy-matrix-grid-v239{display:grid;gap:5px}.loggy-matrix-grid-v239 input{text-align:center;padding:7px}.loggy-matrix-title-v239{text-align:center;font-weight:800;margin-bottom:6px}.loggy-result-box-v239{margin-top:10px;padding:10px;border:var(--thin-border,1px solid #aaa);border-radius:var(--loggy-widget-radius);line-height:1.5}
  .loggy-global-context-v239{position:fixed;z-index:2147483490;min-width:176px;padding:6px;background:var(--white,#fff);color:var(--black,#111);border:var(--thick-border,2px solid #111);border-radius:12px;box-shadow:5px 5px 0 rgba(0,0,0,.14)}
  .loggy-global-context-v239 button{width:100%;display:flex;align-items:center;gap:9px;padding:9px 11px;border:0;background:transparent;color:inherit;border-radius:8px;text-align:left}.loggy-global-context-v239 button:hover{background:var(--track-bg,#eee)}
  .loggy-widget-modal-v239{z-index:2147483600!important}.loggy-widget-modal-box-v239{width:min(820px,calc(100vw - 28px))!important;max-width:820px!important;max-height:min(88vh,860px);overflow:auto;padding:20px!important}
  .loggy-widget-modal-head-v239{display:flex;align-items:flex-start;gap:12px}.loggy-widget-modal-head-v239>div{flex:1}.loggy-widget-modal-head-v239 h2{margin:0}.loggy-widget-modal-head-v239 p{margin:5px 0 0;color:var(--loggy-widget-muted)}
  .loggy-widget-tools-v239{display:flex;gap:8px;flex-wrap:wrap;margin:14px 0}.loggy-widget-tools-v239 button{display:flex;align-items:center;gap:7px}
  .loggy-widget-search-v239{position:relative;margin:12px 0}.loggy-widget-search-v239 i{position:absolute;left:11px;top:50%;transform:translateY(-50%);pointer-events:none}.loggy-widget-search-v239 input{padding-left:36px!important}
  .loggy-widget-catalog-v239{display:flex;flex-direction:column;gap:16px}.loggy-widget-group-v239>h3{margin:0 0 9px;font-size:.95rem;text-transform:uppercase;letter-spacing:.07em;color:var(--loggy-widget-muted)}
  .loggy-widget-grid-v239{display:grid;grid-template-columns:repeat(auto-fill,minmax(210px,1fr));gap:10px}.loggy-widget-catalog-card-v239{position:relative;display:flex;flex-direction:column;gap:9px;padding:12px;border:var(--thin-border,1px solid #aaa);border-radius:var(--loggy-widget-radius);background:var(--white,#fff);color:var(--black,#111);min-height:168px}.loggy-widget-catalog-card-v239.starred{border-width:2px}.loggy-widget-card-title-v239{display:flex;gap:8px;align-items:center;padding-right:30px}.loggy-widget-card-title-v239 i{font-size:1.15rem}.loggy-widget-card-preview-v239{min-height:54px;border-radius:10px;background:var(--track-bg,#eee);display:grid;place-items:center;padding:8px;overflow:hidden}.loggy-widget-card-desc-v239{font-size:.8rem;color:var(--loggy-widget-muted);line-height:1.35;flex:1}.loggy-widget-star-v239{position:absolute;right:7px;top:7px;width:32px!important;min-width:32px!important;max-width:32px!important;height:32px!important;min-height:32px!important;max-height:32px!important;flex:0 0 32px!important;padding:0!important;display:grid;place-items:center;overflow:visible!important}.loggy-widget-card-actions-v239{display:flex;gap:7px}.loggy-widget-card-actions-v239 button{flex:1}
  .loggy-shortcut-section-v239{margin-top:20px;padding-top:16px;border-top:var(--thin-border,1px solid #aaa)}.loggy-shortcut-section-v239 h3{margin:0 0 10px}.loggy-shortcut-subhead-v239{font-weight:800;margin:14px 0 7px}.loggy-shortcut-list-v239{display:flex;flex-direction:column;gap:7px}.loggy-shortcut-row-v239{display:grid;grid-template-columns:minmax(150px,1fr) auto;gap:10px;align-items:center;padding:8px 0;border-bottom:1px solid color-mix(in srgb,var(--black,#111) 12%,transparent)}.loggy-shortcut-copy-v239 strong{display:block}.loggy-shortcut-copy-v239 small{display:block;color:var(--loggy-widget-muted);margin-top:2px}.loggy-shortcut-capture-v239{min-width:130px;white-space:nowrap}.loggy-shortcut-capture-v239.capturing{outline:2px solid var(--loggy-widget-accent)}
  .loggy-settings-widgets-v239{margin-top:20px}.loggy-settings-widgets-v239>.field-label{display:block;margin-bottom:8px}.loggy-settings-widget-strip-v239{display:grid;grid-template-columns:repeat(auto-fill,minmax(190px,1fr));gap:8px;max-height:320px;overflow:auto;padding:2px}.loggy-settings-widget-card-v239{padding:10px;border:var(--thin-border,1px solid #aaa);border-radius:var(--loggy-widget-radius);background:var(--white,#fff);color:var(--black,#111);cursor:pointer;min-height:126px}.loggy-settings-widget-card-v239 header{display:flex;align-items:center;gap:7px;margin-bottom:7px;min-height:34px}.loggy-settings-widget-card-v239 header strong{flex:1;min-width:0}.loggy-settings-widget-card-v239 .preview{height:46px;border-radius:9px;background:var(--track-bg,#eee);display:grid;place-items:center;margin-bottom:7px;overflow:hidden}.loggy-settings-widget-card-v239 .loggy-shortcut-capture-v239{width:100%}
  .loggy-settings-widget-card-v239 .settings-star{width:32px!important;min-width:32px!important;max-width:32px!important;height:32px!important;min-height:32px!important;max-height:32px!important;flex:0 0 32px!important;padding:0!important;display:grid!important;place-items:center!important;overflow:visible!important}
  .loggy-settings-widget-search-v244{margin:9px 0 12px;position:relative}.loggy-settings-widget-search-v244 i{position:absolute;left:11px;top:50%;transform:translateY(-50%);pointer-events:none}.loggy-settings-widget-search-v244 input{padding-left:36px!important}
  .loggy-widget-empty-v244{padding:14px;border:var(--thin-border,1px solid #aaa);border-radius:var(--loggy-widget-radius);color:var(--loggy-widget-muted)}
  .loggy-dropdown-nested-item-v239.is-text-v242{border:0!important;padding:0!important;background:transparent!important;box-shadow:none!important}.loggy-inline-text-v244{min-height:74px;width:100%;padding:4px 0;border:0!important;outline:0;background:transparent!important;color:inherit;font:inherit;line-height:1.55;resize:vertical;box-shadow:none!important}.loggy-inline-text-v244:focus{outline:0!important;box-shadow:none!important}
  .custom-component-text,.custom-component-text .custom-component-content,.custom-user-text{border:0!important;box-shadow:none!important;background:transparent!important}
  .custom-card-grid.custom-card-style-thin-vertical-v244,.custom-card-grid.custom-card-style-thin-vertical{grid-template-columns:repeat(auto-fill,minmax(112px,1fr))!important}.custom-card-grid.custom-card-style-thin-vertical-v244 .custom-user-card,.custom-card-grid.custom-card-style-thin-vertical .custom-user-card{min-height:168px;border:var(--thin-border,1px solid var(--black,#111))!important;border-radius:12px!important;padding:14px 10px!important;text-align:center!important;display:flex!important;flex-direction:column!important;justify-content:center!important}
  .custom-polaroid-grid.custom-polaroid-layout-thin-vertical-v244,.custom-polaroid-grid.custom-polaroid-layout-thin-vertical{grid-template-columns:repeat(auto-fill,minmax(112px,1fr))!important}.custom-polaroid-grid.custom-polaroid-layout-thin-vertical-v244 .custom-user-polaroid,.custom-polaroid-grid.custom-polaroid-layout-thin-vertical .custom-user-polaroid{min-height:184px;border:var(--thin-border,1px solid var(--black,#111))!important;border-radius:12px!important}
  .loggy-alphabet-v244{display:flex;flex-direction:column;gap:18px}.loggy-alphabet-head-v244{display:flex;align-items:center;gap:12px}.loggy-alphabet-head-v244 h2{font-size:clamp(2rem,5vw,3.6rem);letter-spacing:.06em;margin:0;flex:1}.loggy-alphabet-filters-v244,.loggy-alphabet-practice-mode-v244{display:flex;gap:8px;flex-wrap:wrap;align-items:center}.loggy-alphabet-practice-mode-v244>span{font-weight:700;color:var(--muted-text,#666)}.loggy-alphabet-grid-v244{display:grid;grid-template-columns:repeat(auto-fill,minmax(104px,1fr));gap:16px}.loggy-letter-card-v244{min-height:160px;border:var(--thin-border,1px solid var(--black,#111));border-radius:12px;background:var(--white,#fff);color:var(--black,#111);display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:12px 8px;cursor:pointer;transition:transform .14s ease}.loggy-letter-card-v244:hover{transform:translateY(-3px)}.loggy-letter-symbol-v244{font-size:2.35rem;line-height:1.1}.loggy-letter-roman-v244{font-size:.9rem;margin-top:8px}.loggy-letter-example-v244{margin-top:8px;font-size:.9rem}.loggy-letter-example-v244 b,.loggy-letter-example-v244 strong{color:var(--custom-theme-accent,var(--black,#111))}.loggy-letter-note-v244{font-size:.75rem;color:var(--muted-text,#666)}.loggy-letter-card-v244.thin-vertical{min-height:178px;max-width:132px;width:100%;justify-self:center}.loggy-alphabet-empty-v244{padding:18px;border:var(--thin-border,1px dashed var(--black,#111));border-radius:12px;color:var(--muted-text,#666)}
  .loggy-study-action-v244{width:100%;min-height:62px!important;font-size:1.08rem!important;display:flex!important;align-items:center!important;justify-content:center!important;gap:10px!important;padding:12px 16px!important}.loggy-study-help-v244{position:relative;display:inline-grid;place-items:center;width:24px;height:24px;border:var(--thin-border,1px solid currentColor);border-radius:50%;font-size:.8rem}.loggy-study-help-v244 .custom-component-help-tooltip-v163{display:none}
  .loggy-learn-options-v244{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;margin-top:14px}.loggy-learn-options-v244 button{min-height:48px}.loggy-anki-answer-v244{padding:14px;border:var(--thin-border,1px solid #aaa);border-radius:12px;margin:12px 0}.loggy-anki-grades-v244{display:grid;grid-template-columns:repeat(4,1fr);gap:7px}
  .loggy-alphabet-edit-preview-v244{display:flex;align-items:center;gap:10px;font-size:1.6rem;margin:0 0 10px}.loggy-alphabet-edit-preview-v244 button{margin-left:auto}
  #phrases-library-view #kb-bulk-add-btn-v162,#phrases-library-view #kb-select-toggle-v163{display:none!important}

  .loggy-custom-widget-frame-v239{width:100%;height:300px;border:0;border-radius:10px;background:var(--white,#fff)}
  .loggy-kanban-v239{display:grid;grid-auto-flow:column;grid-auto-columns:minmax(230px,1fr);gap:12px;overflow:auto;padding-bottom:7px}.loggy-kanban-column-v239{border:var(--thin-border,1px solid #aaa);border-radius:var(--border-radius,12px);padding:10px;background:var(--white,#fff);min-height:180px}.loggy-kanban-column-head-v239{display:flex;align-items:center;gap:6px;margin-bottom:8px}.loggy-kanban-column-head-v239 strong{flex:1}.loggy-kanban-card-v239{padding:10px;margin:7px 0;border:var(--thin-border,1px solid #aaa);border-radius:10px;background:var(--white,#fff);cursor:grab}.loggy-kanban-card-v239.dragging{opacity:.5}.loggy-kanban-card-v239 small{display:block;color:var(--muted-text,#666);margin-top:5px}.loggy-kanban-card-v239 .tag{display:inline-block;margin-top:7px;padding:3px 7px;border:var(--thin-border,1px solid #aaa);border-radius:999px;font-size:.72rem}.loggy-kanban-drop-v239{min-height:100px}.loggy-dropdown-component-v239{border:var(--thin-border,1px solid #aaa);border-radius:var(--border-radius,12px);overflow:hidden}.loggy-dropdown-summary-v239{display:flex;align-items:center;gap:8px;padding:10px 12px;cursor:pointer;font-weight:800;list-style:none}.loggy-dropdown-summary-v239::-webkit-details-marker{display:none}.loggy-dropdown-inner-v239{padding:10px 12px 14px;border-top:var(--thin-border,1px solid #aaa)}.loggy-dropdown-nested-v239{display:flex;flex-direction:column;gap:10px}.loggy-dropdown-nested-item-v239{position:relative;border:var(--thin-border,1px dashed #aaa);border-radius:10px;padding:10px}.loggy-dropdown-add-v239{margin-top:10px}
  .loggy-form-stack-v239{display:flex;flex-direction:column;gap:11px}.loggy-form-stack-v239 label{font-weight:700}.loggy-form-actions-v239{display:flex;justify-content:flex-end;gap:8px;margin-top:4px}.loggy-widget-toast-v239{position:fixed;left:50%;bottom:22px;transform:translateX(-50%);z-index:2147483647;background:var(--black,#111);color:var(--white,#fff);border-radius:999px;padding:9px 14px;font-weight:700;box-shadow:0 5px 18px rgba(0,0,0,.22)}
  .loggy-settings-theme-heading-v239{display:block;margin:2px 0 8px;font-weight:800}
  #daily-settings-modal #global-shortcuts-section,#daily-settings-modal #virtual-keyboard-settings-section{display:none!important}
  .loggy-shortcut-major-v242{margin-top:18px;padding-top:14px;border-top:var(--thin-border,1px solid #aaa)}
  .loggy-shortcut-major-v242:first-of-type{margin-top:10px}
  .loggy-shortcut-major-v242>strong{display:block;margin-bottom:8px;font-size:.92rem;text-transform:uppercase;letter-spacing:.05em}
  .custom-tab-component.custom-component-text{border:0!important;background:transparent!important;box-shadow:none!important}.custom-tab-component.custom-component-text:not(.builder-component){padding-left:0!important;padding-right:0!important}.custom-tab-component.custom-component-text:not(.builder-component) .custom-user-text{border:0!important;border-radius:0!important;background:transparent!important;padding:0!important;box-shadow:none!important}
  .loggy-dropdown-nested-item-v239.is-text-v242{border:0!important;border-radius:0!important;padding:0!important;background:transparent!important}
  .loggy-dropdown-nested-item-v239.is-text-v242 .custom-user-text{border:0!important;border-radius:0!important;background:transparent!important;padding:2px 0!important;box-shadow:none!important}
  @media(max-width:640px){.loggy-widget-modal-box-v239{padding:14px!important}.loggy-widget-grid-v239{grid-template-columns:1fr}.loggy-shortcut-row-v239{grid-template-columns:1fr}.loggy-shortcut-capture-v239{width:100%}.loggy-matrix-wrap-v239{grid-template-columns:1fr}.loggy-floating-widget-v239{width:min(330px,calc(100vw - 16px))}}
  `;
  document.head.appendChild(style);
}

function toast(message) {
  document.querySelector('.loggy-widget-toast-v239')?.remove();
  const el = document.createElement('div');
  el.className = 'loggy-widget-toast-v239';
  el.textContent = message;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 1800);
}

function ensureWidgetUiRuntimeV241() {
  if (widgetUiRuntimeReadyV241) return;
  widgetUiRuntimeReadyV241 = true;
  injectStyle();
  installModalStackManager();
}

// -------- modal stacking -------------------------------------------------
function isVisibleModal(el) {
  if (!(el instanceof HTMLElement)) return false;
  if (!el.matches('.modal-overlay,.loggy-widget-modal-v239')) return false;
  if (el.classList.contains('hidden')) return false;
  const style = getComputedStyle(el);
  return style.display !== 'none' && style.visibility !== 'hidden';
}
function stampModal(el) {
  if (!el.dataset.loggyModalStampV239) el.dataset.loggyModalStampV239 = String(++modalStamp);
}
function syncModalStack() {
  const all = Array.from(document.querySelectorAll('.modal-overlay,.loggy-widget-modal-v239'));
  const visible = [];
  all.forEach(el => {
    const now = isVisibleModal(el);
    const was = modalVisibilityV239.get(el) === true;
    if (now && !was) {
      // A modal that has just reopened must become newer than every modal
      // already on screen, even if an older subsystem left a stale stamp.
      el.dataset.loggyModalStampV239 = String(++modalStamp);
    } else if (!now && was) {
      delete el.dataset.loggyModalStampV239;
    }
    modalVisibilityV239.set(el, now);
    if (now) { stampModal(el); visible.push(el); }
  });
  visible.sort((a,b) => Number(a.dataset.loggyModalStampV239||0) - Number(b.dataset.loggyModalStampV239||0));
  let normalIndex = 0, widgetIndex = 0;
  visible.forEach(el => {
    const isWidgetModal = el.classList.contains('loggy-widget-modal-v239');
    const zNum = isWidgetModal ? 2147483600 + (widgetIndex++) : 2147483300 + (normalIndex++);
    const z = String(Math.min(2147483647, zNum));
    if (el.style.getPropertyValue('z-index') !== z || el.style.getPropertyPriority('z-index') !== 'important') {
      el.style.setProperty('z-index', z, 'important');
    }
  });
}
function showModal(el) {
  if (!el) return;
  ensureWidgetUiRuntimeV241();
  el.dataset.loggyModalStampV239 = String(++modalStamp);
  el.classList.remove('hidden');
  document.body.appendChild(el);
  syncModalStack();
  requestAnimationFrame(syncModalStack);
}
function hideModal(el) { if (el) { el.classList.add('hidden'); delete el.dataset.loggyModalStampV239; syncModalStack(); } }
function installModalStackManager() {
  if (installModalStackManager.__v241Installed) return;
  installModalStackManager.__v241Installed = true;
  // V241: Do not observe every style/class mutation in the whole app. The old
  // observer ran during Loggy's boot and amplified normal rendering work.
  // Only child insertion/removal is watched; modal opens are synchronized by
  // the click/pointer hooks and by showModal().
  const obs = new MutationObserver(records => {
    if (records.some(r => r.type === 'childList')) queueMicrotask(syncModalStack);
  });
  obs.observe(document.body, {subtree:true,childList:true});
  document.addEventListener('pointerdown', () => queueMicrotask(syncModalStack), true);
  document.addEventListener('click', () => queueMicrotask(syncModalStack), true);
  syncModalStack();
}

// -------- settings / state ----------------------------------------------
function prefs() {
  const p = safeJson(KEYS.prefs, {});
  if (!p.positions || typeof p.positions !== 'object') p.positions = {};
  if (!Array.isArray(p.open)) p.open = [];
  if (!Array.isArray(p.stars)) p.stars = [];
  return p;
}
function setPrefs(p) { saveJson(KEYS.prefs, p); }
function widgetData() { return safeJson(KEYS.data, {}); }
function setWidgetData(data) { saveJson(KEYS.data, data); }
function customWidgets() { const c = safeJson(KEYS.custom, []); return Array.isArray(c) ? c : []; }
function saveCustomWidgets(c) { saveJson(KEYS.custom, c); }

const DEFAULT_SHORTCUTS = {
  'widget:keyboard':'Ctrl+K',
  'widget:pomodoro':'Ctrl+Alt+P',
  'widget:webcam':'Ctrl+Alt+C',
  'widget:tuner':'Ctrl+Alt+T',
  'widget:latex':'Ctrl+Alt+L',
  'widget:row-counter':'Ctrl+Alt+R',
  'widget:molar-mass':'Ctrl+Alt+M',
  'widget:graph':'Ctrl+Alt+G',
  'widget:base-converter':'Ctrl+Alt+B',
  'widget:matrix':'Ctrl+Alt+X',
  'widget:unit-circle':'Ctrl+Alt+U',
  'site:settings':'Shift+W',
  'site:search':'Ctrl+P',
  'site:developer':'Ctrl+Shift+D+M',
  'site:mute-intro':'Ctrl+Alt+I',
  'site:mute-all-sounds':'Ctrl+Alt+Shift+S',
  'site:primary-action':'Enter',
  'daily:recent':'Shift+L+D',
  'daily:new':'Ctrl+Period',
  'daily:left':'ArrowLeft',
  'daily:right':'ArrowRight',
  'daily:notes-link':'Backslash',
  'page:knowledge':'Alt+K',
  'page:quizzes':'Alt+Q',
  'knowledge:bulk-add':'Alt+Shift+A',
  'knowledge:bulk-delete':'Alt+Shift+X'
};
function shortcuts() { return {...DEFAULT_SHORTCUTS, ...safeJson(KEYS.shortcuts,{})}; }
function setShortcut(action, combo) { const raw = safeJson(KEYS.shortcuts,{}); raw[action] = combo; saveJson(KEYS.shortcuts,raw); renderAllShortcutUIs(); }

function displayCode(code) {
  if (code === 'Period') return '.';
  if (code === 'Comma') return ',';
  if (code === 'Space') return 'Space';
  if (code.startsWith('Key')) return code.slice(3);
  if (code.startsWith('Digit')) return code.slice(5);
  if (code.startsWith('Arrow')) return code.slice(5);
  return code.replace(/^Numpad/,'Num ');
}
function parseCombo(combo) {
  const tokens = String(combo||'').split('+').filter(Boolean);
  const mods = {ctrl:false,shift:false,alt:false,meta:false};
  const codes = [];
  tokens.forEach(token => {
    const t = token.toLowerCase();
    if (t === 'ctrl' || t === 'control') mods.ctrl = true;
    else if (t === 'shift') mods.shift = true;
    else if (t === 'alt' || t === 'option') mods.alt = true;
    else if (t === 'meta' || t === 'cmd' || t === 'command') mods.meta = true;
    else {
      if (token === '.') codes.push('Period');
      else if (/^[a-z]$/i.test(token)) codes.push(`Key${token.toUpperCase()}`);
      else if (/^[0-9]$/.test(token)) codes.push(`Digit${token}`);
      else codes.push(token);
    }
  });
  return {...mods,codes};
}
function displayCombo(combo) {
  const p = parseCombo(combo);
  return [p.ctrl?'Ctrl':'',p.alt?'Alt':'',p.shift?'Shift':'',p.meta?'⌘':'',...p.codes.map(displayCode)].filter(Boolean).join(' + ') || 'None';
}
function eventTypingTarget(target) { return target instanceof Element && !!target.closest('input,textarea,select,[contenteditable="true"],[role="textbox"]'); }
function comboSatisfied(parsed, event) {
  if (!!event.ctrlKey !== !!parsed.ctrl || !!event.shiftKey !== !!parsed.shift || !!event.altKey !== !!parsed.alt || !!event.metaKey !== !!parsed.meta) return false;
  return parsed.codes.length && parsed.codes.every(code => pressedCodes.has(code));
}

// -------- widget definitions --------------------------------------------
const ATOMIC_MASS = {
H:1.008,He:4.0026,Li:6.94,Be:9.0122,B:10.81,C:12.011,N:14.007,O:15.999,F:18.998,Ne:20.180,Na:22.990,Mg:24.305,Al:26.982,Si:28.085,P:30.974,S:32.06,Cl:35.45,Ar:39.948,K:39.098,Ca:40.078,Sc:44.956,Ti:47.867,V:50.942,Cr:51.996,Mn:54.938,Fe:55.845,Co:58.933,Ni:58.693,Cu:63.546,Zn:65.38,Ga:69.723,Ge:72.630,As:74.922,Se:78.971,Br:79.904,Kr:83.798,Rb:85.468,Sr:87.62,Y:88.906,Zr:91.224,Nb:92.906,Mo:95.95,Tc:98,Ru:101.07,Rh:102.91,Pd:106.42,Ag:107.87,Cd:112.41,In:114.82,Sn:118.71,Sb:121.76,Te:127.60,I:126.90,Xe:131.29,Cs:132.91,Ba:137.33,La:138.91,Ce:140.12,Pr:140.91,Nd:144.24,Pm:145,Sm:150.36,Eu:151.96,Gd:157.25,Tb:158.93,Dy:162.50,Ho:164.93,Er:167.26,Tm:168.93,Yb:173.05,Lu:174.97,Hf:178.49,Ta:180.95,W:183.84,Re:186.21,Os:190.23,Ir:192.22,Pt:195.08,Au:196.97,Hg:200.59,Tl:204.38,Pb:207.2,Bi:208.98,Po:209,At:210,Rn:222,Fr:223,Ra:226,Ac:227,Th:232.04,Pa:231.04,U:238.03,Np:237,Pu:244,Am:243,Cm:247,Bk:247,Cf:251,Es:252,Fm:257,Md:258,No:259,Lr:266,Rf:267,Db:268,Sg:269,Bh:270,Hs:269,Mt:278,Ds:281,Rg:282,Cn:285,Nh:286,Fl:289,Mc:290,Lv:293,Ts:294,Og:294
};

function parseFormulaMass(formula) {
  const s = String(formula||'').replace(/\s+/g,'');
  let i = 0;
  function number() { let start=i; while (/\d/.test(s[i]||'')) i++; return start===i ? 1 : Number(s.slice(start,i)); }
  function group(stop) {
    let total = 0;
    while (i < s.length && s[i] !== stop) {
      if (s[i] === '(') { i++; const inner = group(')'); if (s[i] !== ')') throw new Error('Missing )'); i++; total += inner * number(); continue; }
      const m = s.slice(i).match(/^[A-Z][a-z]?/); if (!m) throw new Error(`Unexpected “${s[i]}”`);
      const symbol = m[0]; i += symbol.length;
      if (!(symbol in ATOMIC_MASS)) throw new Error(`Unknown element ${symbol}`);
      total += ATOMIC_MASS[symbol] * number();
    }
    return total;
  }
  if (!s) return 0;
  const total = group(')');
  if (i !== s.length) throw new Error('Invalid formula');
  return total;
}

function latexToMathML(input) {
  const raw = String(input||'').trim();
  const greek = {alpha:'α',beta:'β',gamma:'γ',delta:'δ',theta:'θ',lambda:'λ',mu:'μ',pi:'π',rho:'ρ',sigma:'σ',phi:'φ',omega:'ω',Delta:'Δ',Sigma:'Σ',Omega:'Ω'};
  let i=0;
  function parse(stop='') {
    const out=[];
    while(i<raw.length && raw[i]!==stop){
      if(raw[i]==='{'){i++; const inner=parse('}'); if(raw[i]==='}')i++; out.push(`<mrow>${inner}</mrow>`); continue;}
      if(raw[i]==='\\'){
        i++; const m=raw.slice(i).match(/^[A-Za-z]+/); const cmd=m?m[0]:raw[i]||''; i+=cmd.length||1;
        if(cmd==='frac'){ while(raw[i]===' ')i++; if(raw[i]!=='{'){out.push('<mi>frac</mi>');continue;} i++; const a=parse('}');if(raw[i]==='}')i++; while(raw[i]===' ')i++; if(raw[i]!=='{'){out.push(`<mfrac><mrow>${a}</mrow><mrow></mrow></mfrac>`);continue;} i++;const b=parse('}');if(raw[i]==='}')i++;out.push(`<mfrac><mrow>${a}</mrow><mrow>${b}</mrow></mfrac>`);continue;}
        if(cmd==='sqrt'){while(raw[i]===' ')i++;if(raw[i]==='{'){i++;const a=parse('}');if(raw[i]==='}')i++;out.push(`<msqrt><mrow>${a}</mrow></msqrt>`);}else out.push('<msqrt><mrow></mrow></msqrt>');continue;}
        if(greek[cmd]){out.push(`<mi>${greek[cmd]}</mi>`);continue;}
        const ops={cdot:'·',times:'×',pm:'±',le:'≤',ge:'≥',neq:'≠',infty:'∞'}; if(ops[cmd]){out.push(`<mo>${ops[cmd]}</mo>`);continue;}
        out.push(`<mi>${esc(cmd)}</mi>`);continue;
      }
      if(raw[i]==='^'||raw[i]==='_'){
        const sup=raw[i]==='^';i++; let val=''; if(raw[i]==='{'){i++;val=parse('}');if(raw[i]==='}')i++;} else {const c=raw[i++]||'';val=/\d/.test(c)?`<mn>${c}</mn>`:`<mi>${esc(c)}</mi>`;}
        const base=out.pop()||'<mi></mi>';out.push(sup?`<msup>${base}<mrow>${val}</mrow></msup>`:`<msub>${base}<mrow>${val}</mrow></msub>`);continue;
      }
      const ch=raw[i++];
      if(/\d/.test(ch)){let n=ch;while(/\d|\./.test(raw[i]||''))n+=raw[i++];out.push(`<mn>${esc(n)}</mn>`);}
      else if(/[A-Za-z]/.test(ch)){out.push(`<mi>${esc(ch)}</mi>`);}
      else if(/\s/.test(ch)){out.push('<mspace width=".25em"/>');}
      else out.push(`<mo>${esc(ch)}</mo>`);
    }
    return out.join('');
  }
  return `<math xmlns="http://www.w3.org/1998/Math/MathML"><mrow>${parse()}</mrow></math>`;
}

function compileGraph(expr) {
  let s = String(expr||'').trim().toLowerCase();
  if (s.includes('=')) s = s.split('=').slice(1).join('=');
  if (!s || !/^[0-9a-z+\-*/^().,\s]+$/.test(s)) throw new Error('Use numbers, x, operators, and common math functions.');
  const words = s.match(/[a-z]+/g) || [];
  const allowed = new Set(['x','sin','cos','tan','sqrt','abs','log','ln','exp','pi','e','floor','ceil']);
  if (words.some(w=>!allowed.has(w))) throw new Error('Unsupported function.');
  s=s.replace(/\^/g,'**').replace(/\bpi\b/g,'Math.PI').replace(/\be\b/g,'Math.E').replace(/\bln\b/g,'Math.log');
  ['sin','cos','tan','sqrt','abs','log','exp','floor','ceil'].forEach(fn=>{s=s.replace(new RegExp(`\\b${fn}\\b`,'g'),`Math.${fn}`)});
  return Function('x',`"use strict"; return (${s});`);
}

function parseAngle(input) {
  let s=String(input||'').trim().toLowerCase().replace(/\s+/g,'');
  let degrees;
  if(s.endsWith('°')||(!s.includes('pi')&&!s.includes('π'))){degrees=Number(s.replace('°',''));}
  else{
    s=s.replace(/π/g,'pi');
    let sign=1;if(s.startsWith('-')){sign=-1;s=s.slice(1)} else if(s.startsWith('+')) s=s.slice(1);
    let coef=1;
    const before=s.split('pi')[0]; if(before) coef=before==='-'?-1:Number(before)||1;
    let den=1; const slash=s.indexOf('/'); if(slash>=0) den=Number(s.slice(slash+1))||1;
    degrees=sign*coef*180/den;
  }
  if(!Number.isFinite(degrees)) throw new Error('Try 120°, 2π/3, or -π/4.');
  return degrees;
}
const EXACT_TRIG = {
  0:['1','0','0'],30:['√3/2','1/2','√3/3'],45:['√2/2','√2/2','1'],60:['1/2','√3/2','√3'],90:['0','1','undefined'],120:['-1/2','√3/2','-√3'],135:['-√2/2','√2/2','-1'],150:['-√3/2','1/2','-√3/3'],180:['-1','0','0'],210:['-√3/2','-1/2','√3/3'],225:['-√2/2','-√2/2','1'],240:['-1/2','-√3/2','√3'],270:['0','-1','undefined'],300:['1/2','-√3/2','-√3'],315:['√2/2','-√2/2','-1'],330:['√3/2','-1/2','-√3/3']
};

const BUILTINS = [
  {id:'pomodoro',title:'Pomodoro Timer',icon:'ph-timer',group:'Focus & Input',desc:'A draggable focus timer with work/break modes and saved progress.',preview:'<strong>25:00</strong><small> Focus</small>',mount:mountPomodoro},
  {id:'keyboard',title:'Keyboard',icon:'ph-keyboard',group:'Focus & Input',desc:'A floating multilingual keyboard that types into the last field you used.',preview:'<span>Q W E R T Y</span>',mount:mountKeyboard},
  {id:'webcam',title:'Live Webcam Mirror',icon:'ph-video-camera',group:'Practice & Capture',desc:'A mirrored front-camera feed for checking movement, posture, and signing.',preview:'<i class="ph ph-video-camera" style="font-size:1.8rem"></i>',mount:mountWebcam},
  {id:'tuner',title:'Tuner & Metronome',icon:'ph-metronome',group:'Practice & Capture',desc:'Microphone pitch detection plus BPM, tap-tempo, and visual beat accents.',preview:'<strong>A4</strong><span> · 120 BPM</span>',mount:mountTuner},
  {id:'row-counter',title:'Digital Row Counter',icon:'ph-plus-minus',group:'Practice & Capture',desc:'A simple autosaving minus / count / plus counter.',preview:'<strong>− &nbsp; 42 &nbsp; +</strong>',mount:mountRowCounter},
  {id:'latex',title:'Live LaTeX Scratchpad',icon:'ph-function',group:'Math & Science',desc:'Type common LaTeX and preview the expression instantly.',preview:'<span>√x² + ½</span>',mount:mountLatex},
  {id:'molar-mass',title:'Molar Mass Calculator',icon:'ph-flask',group:'Math & Science',desc:'Parse chemical formulas, including parentheses, and calculate molar mass.',preview:'<strong>H₂O → 18.015</strong>',mount:mountMolarMass},
  {id:'graph',title:'Mini Graphing Canvas',icon:'ph-chart-line',group:'Math & Science',desc:'Plot a quick y=f(x) curve on a lightweight coordinate plane.',preview:'<span>y = sin(x)</span>',mount:mountGraph},
  {id:'base-converter',title:'Base Converter',icon:'ph-code',group:'Math & Science',desc:'Decimal, binary, and hexadecimal fields update each other in real time.',preview:'<strong>42 · 101010 · 2A</strong>',mount:mountBaseConverter},
  {id:'matrix',title:'Matrix Solver',icon:'ph-grid-nine',group:'Math & Science',desc:'Switch between 2×2 and 3×3 matrices for determinants and matrix products.',preview:'<span>[ A ] · [ B ]</span>',mount:mountMatrix},
  {id:'unit-circle',title:'Unit Circle Inspector',icon:'ph-circle',group:'Math & Science',desc:'Enter degrees or radians to inspect quadrant and exact common trig values.',preview:'<strong>120° → (−½, √3/2)</strong>',mount:mountUnitCircle}
];

function allDefinitions() {
  const custom = customWidgets().map(w => ({...w,group:'Custom',icon:w.icon||'ph-code-block',desc:w.desc||'Custom sandboxed widget.',preview:'<span>Custom Widget</span>',custom:true,mount:(body,ctx)=>mountCustom(body,ctx,w)}));
  return [...BUILTINS,...custom];
}
function defById(id) { return allDefinitions().find(d=>d.id===id); }

// -------- floating widget stage -----------------------------------------
function ensureStage() {
  let stage=document.getElementById('loggy-widget-stage-v239');
  if(!stage){stage=document.createElement('div');stage.id='loggy-widget-stage-v239';document.body.appendChild(stage)}
  return stage;
}
function defaultPosition(index=0){return {x:Math.max(10,window.innerWidth-380-(index%3)*28),y:70+(index%5)*34};}
function savePosition(id, shell) {
  const p=prefs(); const r=shell.getBoundingClientRect(); p.positions[id]={x:Math.round(r.left),y:Math.round(r.top)}; setPrefs(p);
}
function markOpen(id, open) { const p=prefs(); p.open=p.open.filter(x=>x!==id); if(open)p.open.push(id); setPrefs(p); }
function constrainShell(shell){const r=shell.getBoundingClientRect();const x=clamp(r.left,6,Math.max(6,innerWidth-r.width-6));const y=clamp(r.top,6,Math.max(6,innerHeight-r.height-6));shell.style.left=`${x}px`;shell.style.top=`${y}px`;}
function makeDraggable(shell, handle, instanceId) {
  let drag=null;
  handle.addEventListener('pointerdown',e=>{
    if(e.button!==0||e.target.closest('button,input,select,textarea,a'))return;
    const r=shell.getBoundingClientRect(); drag={id:e.pointerId,dx:e.clientX-r.left,dy:e.clientY-r.top}; handle.setPointerCapture(e.pointerId); shell.classList.add('is-dragging'); e.preventDefault();
  });
  handle.addEventListener('pointermove',e=>{if(!drag||drag.id!==e.pointerId)return;const left=clamp(e.clientX-drag.dx,6,Math.max(6,innerWidth-shell.offsetWidth-6));const top=clamp(e.clientY-drag.dy,6,Math.max(6,innerHeight-shell.offsetHeight-6));shell.style.left=`${left}px`;shell.style.top=`${top}px`;e.preventDefault();});
  const end=e=>{if(!drag||drag.id!==e.pointerId)return;drag=null;shell.classList.remove('is-dragging');savePosition(instanceId,shell)};
  handle.addEventListener('pointerup',end);handle.addEventListener('pointercancel',end);
}
function closeWidget(id) {
  const shell=document.querySelector(`.loggy-floating-widget-v239[data-widget-id="${CSS.escape(id)}"]`);
  try{openCleanups.get(id)?.()}catch{} openCleanups.delete(id); shell?.remove(); markOpen(id,false);
}
function launchWidget(id) {
  ensureWidgetUiRuntimeV241();
  const def=defById(id); if(!def)return;
  const existing=document.querySelector(`.loggy-floating-widget-v239[data-widget-id="${CSS.escape(id)}"]`);if(existing){existing.style.zIndex=String(2147482890);existing.animate?.([{transform:'scale(.97)'},{transform:'scale(1)'}],{duration:140});return}
  const stage=ensureStage(); const shell=document.createElement('section'); shell.className='loggy-floating-widget-v239';shell.dataset.widgetId=id;
  shell.innerHTML=`<header class="loggy-widget-header-v239"><i class="ph ${esc(def.icon||'ph-square')}"></i><strong>${esc(def.title)}</strong><button type="button" class="small-icon-btn loggy-widget-close-v239" title="Close widget" aria-label="Close widget"><i class="ph ph-x"></i></button></header><div class="loggy-widget-body-v239"></div>`;
  stage.appendChild(shell); const p=prefs(); const pos=p.positions[id]||defaultPosition(p.open.length); shell.style.left=`${pos.x}px`;shell.style.top=`${pos.y}px`;
  makeDraggable(shell,shell.querySelector('.loggy-widget-header-v239'),id);shell.querySelector('.loggy-widget-close-v239').onclick=()=>closeWidget(id);
  const cleanup=def.mount?.(shell.querySelector('.loggy-widget-body-v239'),{id,def,shell}); if(typeof cleanup==='function')openCleanups.set(id,cleanup);
  markOpen(id,true); requestAnimationFrame(()=>{constrainShell(shell);savePosition(id,shell)});
}
window.LoggyWidgets = {open:launchWidget,close:closeWidget,openCatalog:openWidgetCatalog};
window.addEventListener('resize',()=>document.querySelectorAll('.loggy-floating-widget-v239').forEach(constrainShell));

// -------- built in widget mounts ----------------------------------------
function mountPomodoro(body,ctx){
  const data=widgetData();const state=data.pomodoro||{mode:'focus',focus:25,break:5,remaining:25*60,running:false,endAt:0};data.pomodoro=state;setWidgetData(data);
  body.innerHTML=`<div class="loggy-pomodoro-mode-v239"></div><div class="loggy-pomodoro-time-v239">25:00</div><div class="loggy-widget-progress-v239"><i></i></div><div class="loggy-widget-row-v239" style="margin-top:11px"><label class="loggy-widget-grow-v239">Focus <input class="pomo-focus" type="number" min="1" max="180" value="${state.focus}"></label><label class="loggy-widget-grow-v239">Break <input class="pomo-break" type="number" min="1" max="90" value="${state.break}"></label></div><div class="loggy-widget-actions-v239" style="margin-top:10px"><button class="filter-tab pomo-start"><i class="ph ph-play"></i> Start</button><button class="filter-tab pomo-reset"><i class="ph ph-arrow-counter-clockwise"></i> Reset</button><button class="filter-tab pomo-mode"><i class="ph ph-arrows-left-right"></i> Switch</button></div>`;
  const persist=()=>{const d=widgetData();d.pomodoro=state;setWidgetData(d)};
  const render=()=>{let rem=state.remaining;if(state.running){rem=Math.max(0,Math.ceil((state.endAt-Date.now())/1000));if(rem<=0){state.running=false;state.mode=state.mode==='focus'?'break':'focus';state.remaining=(state.mode==='focus'?state.focus:state.break)*60;state.endAt=0;persist();try{new AudioContext().close()}catch{} toast(state.mode==='focus'?'Focus time':'Break time')}}state.remaining=rem;const m=Math.floor(rem/60),s=rem%60;body.querySelector('.loggy-pomodoro-time-v239').textContent=`${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;body.querySelector('.loggy-pomodoro-mode-v239').textContent=state.mode==='focus'?'Focus':'Break';body.querySelector('.pomo-start').innerHTML=state.running?'<i class="ph ph-pause"></i> Pause':'<i class="ph ph-play"></i> Start';const total=(state.mode==='focus'?state.focus:state.break)*60;body.querySelector('.loggy-widget-progress-v239 i').style.width=`${100*(1-rem/Math.max(1,total))}%`};
  body.querySelector('.pomo-start').onclick=()=>{if(state.running){state.remaining=Math.max(0,Math.ceil((state.endAt-Date.now())/1000));state.running=false;state.endAt=0}else{state.running=true;state.endAt=Date.now()+state.remaining*1000}persist();render()};
  body.querySelector('.pomo-reset').onclick=()=>{state.running=false;state.remaining=(state.mode==='focus'?state.focus:state.break)*60;state.endAt=0;persist();render()};
  body.querySelector('.pomo-mode').onclick=()=>{state.running=false;state.mode=state.mode==='focus'?'break':'focus';state.remaining=(state.mode==='focus'?state.focus:state.break)*60;state.endAt=0;persist();render()};
  body.querySelector('.pomo-focus').onchange=e=>{state.focus=clamp(e.target.value,1,180);if(state.mode==='focus'&&!state.running)state.remaining=state.focus*60;persist();render()};
  body.querySelector('.pomo-break').onchange=e=>{state.break=clamp(e.target.value,1,90);if(state.mode==='break'&&!state.running)state.remaining=state.break*60;persist();render()};
  const timer=setInterval(render,500);render();return()=>clearInterval(timer);
}

const KEY_LAYOUTS={
 English:[['q','w','e','r','t','y','u','i','o','p'],['a','s','d','f','g','h','j','k','l'],['z','x','c','v','b','n','m']],
 Spanish:[['q','w','e','r','t','y','u','i','o','p'],['a','s','d','f','g','h','j','k','l','ñ'],['z','x','c','v','b','n','m'],['á','é','í','ó','ú','ü','¿','¡']],
 Korean:[['ㅂ','ㅈ','ㄷ','ㄱ','ㅅ','ㅛ','ㅕ','ㅑ','ㅐ','ㅔ'],['ㅁ','ㄴ','ㅇ','ㄹ','ㅎ','ㅗ','ㅓ','ㅏ','ㅣ'],['ㅋ','ㅌ','ㅊ','ㅍ','ㅠ','ㅜ','ㅡ']]
};
function insertAtTarget(text){const t=lastTextTarget;if(!t||!document.contains(t)){toast('Click a text field first.');return}if(t instanceof HTMLInputElement||t instanceof HTMLTextAreaElement){const a=t.selectionStart??t.value.length,b=t.selectionEnd??a;t.setRangeText(text,a,b,'end');t.dispatchEvent(new Event('input',{bubbles:true}));t.focus()}else if(t.isContentEditable){t.focus();document.execCommand('insertText',false,text);t.dispatchEvent(new Event('input',{bubbles:true}))}}
function backspaceTarget(){const t=lastTextTarget;if(!t||!document.contains(t))return;if(t instanceof HTMLInputElement||t instanceof HTMLTextAreaElement){let a=t.selectionStart??t.value.length,b=t.selectionEnd??a;if(a===b&&a>0)a--;t.setRangeText('',a,b,'end');t.dispatchEvent(new Event('input',{bubbles:true}));t.focus()}else if(t.isContentEditable){t.focus();document.execCommand('delete',false)}}
function mountKeyboard(body){
  body.innerHTML=`<div class="loggy-widget-row-v239"><select class="kb-lang"><option>English</option><option>Korean</option><option>Spanish</option></select><span class="loggy-widget-muted-v239">Types into your last active field</span></div><div class="loggy-keyboard-rows-v239"></div>`;let shift=false;const host=body.querySelector('.loggy-keyboard-rows-v239');const lang=body.querySelector('.kb-lang');
  const render=()=>{host.innerHTML='';KEY_LAYOUTS[lang.value].forEach(row=>{const r=document.createElement('div');r.className='loggy-keyboard-row-v239';row.forEach(ch=>{const b=document.createElement('button');b.className='filter-tab';b.textContent=shift?ch.toLocaleUpperCase():ch;b.onpointerdown=e=>e.preventDefault();b.onclick=()=>insertAtTarget(b.textContent);r.appendChild(b)});host.appendChild(r)});const c=document.createElement('div');c.className='loggy-keyboard-row-v239 loggy-keyboard-controls-v239';[['Shift',()=>{shift=!shift;render()}],['Space',()=>insertAtTarget(' ')],['⌫',backspaceTarget],['Enter',()=>insertAtTarget('\n')]].forEach(([label,fn])=>{const b=document.createElement('button');b.className='filter-tab';b.textContent=label;b.onpointerdown=e=>e.preventDefault();b.onclick=fn;c.appendChild(b)});host.appendChild(c)};lang.onchange=render;render();
}
function mountWebcam(body){
  body.innerHTML=`<video class="loggy-webcam-v239" autoplay muted playsinline></video><div class="loggy-widget-actions-v239" style="margin-top:10px"><button class="filter-tab webcam-start"><i class="ph ph-camera"></i> Start Camera</button><button class="filter-tab webcam-stop"><i class="ph ph-stop"></i> Stop</button></div><p class="loggy-widget-muted-v239">Camera access only starts when you press Start Camera.</p>`;let stream=null;const video=body.querySelector('video');
  const stop=()=>{stream?.getTracks?.().forEach(t=>t.stop());stream=null;video.srcObject=null};body.querySelector('.webcam-start').onclick=async()=>{try{stop();stream=await navigator.mediaDevices.getUserMedia({video:{facingMode:'user'},audio:false});video.srcObject=stream}catch{toast('Camera permission was not available.')}};body.querySelector('.webcam-stop').onclick=stop;return stop;
}
function autocorrelate(buf,sampleRate){let size=buf.length,rms=0;for(const v of buf)rms+=v*v;rms=Math.sqrt(rms/size);if(rms<.01)return -1;let r1=0,r2=size-1,th=.2;for(let i=0;i<size/2;i++){if(Math.abs(buf[i])<th){r1=i;break}}for(let i=1;i<size/2;i++){if(Math.abs(buf[size-i])<th){r2=size-i;break}}buf=buf.slice(r1,r2);size=buf.length;const c=new Array(size).fill(0);for(let i=0;i<size;i++)for(let j=0;j<size-i;j++)c[i]+=buf[j]*buf[j+i];let d=0;while(c[d]>c[d+1])d++;let max=-1,pos=-1;for(let i=d;i<size;i++)if(c[i]>max){max=c[i];pos=i}if(pos<1)return -1;const x1=c[pos-1]||0,x2=c[pos],x3=c[pos+1]||0;const a=(x1+x3-2*x2)/2,b=(x3-x1)/2;const shift=a? -b/(2*a):0;return sampleRate/(pos+shift)}
function noteFromHz(hz){if(!(hz>0))return null;const midi=69+12*Math.log2(hz/440);const rounded=Math.round(midi);const names=['C','C♯','D','D♯','E','F','F♯','G','G♯','A','A♯','B'];return {name:names[(rounded%12+12)%12]+(Math.floor(rounded/12)-1),cents:Math.round((midi-rounded)*100)}}
function mountTuner(body){
  body.innerHTML=`<div class="set-size-picker"><button class="filter-tab active tuner-tab" data-tab="tuner">Tuner</button><button class="filter-tab tuner-tab" data-tab="metro">Metronome</button></div><div class="tuner-pane"><div class="loggy-tuner-note-v239">—</div><div class="loggy-tuner-detail-v239 loggy-widget-muted-v239">Press Start Tuner</div><div class="loggy-widget-actions-v239" style="margin-top:10px"><button class="filter-tab tuner-start">Start Tuner</button><button class="filter-tab tuner-stop">Stop</button></div></div><div class="metro-pane" hidden><div class="loggy-widget-row-v239"><button class="filter-tab bpm-minus">−</button><input class="bpm" type="number" min="30" max="300" value="120"><button class="filter-tab bpm-plus">+</button></div><div class="loggy-beat-v239" style="margin:12px 0"></div><div class="loggy-widget-actions-v239"><button class="filter-tab metro-start">Start</button><button class="filter-tab tap">Tap Tempo</button></div></div>`;
  let stream=null,ctxAudio=null,analyser=null,raf=0,metroTimer=0,metroOn=false,lastTaps=[];const note=body.querySelector('.loggy-tuner-note-v239'),detail=body.querySelector('.loggy-tuner-detail-v239');
  const stopTuner=()=>{cancelAnimationFrame(raf);raf=0;stream?.getTracks?.().forEach(t=>t.stop());stream=null;try{ctxAudio?.close()}catch{}ctxAudio=null;analyser=null};
  body.querySelector('.tuner-start').onclick=async()=>{try{stopTuner();stream=await navigator.mediaDevices.getUserMedia({audio:true});ctxAudio=new (window.AudioContext||window.webkitAudioContext)();const src=ctxAudio.createMediaStreamSource(stream);analyser=ctxAudio.createAnalyser();analyser.fftSize=2048;src.connect(analyser);const buf=new Float32Array(analyser.fftSize);const loop=()=>{analyser.getFloatTimeDomainData(buf);const hz=autocorrelate(buf,ctxAudio.sampleRate);const n=noteFromHz(hz);if(n){note.textContent=n.name;detail.textContent=`${hz.toFixed(1)} Hz · ${n.cents>0?'+':''}${n.cents} cents`}raf=requestAnimationFrame(loop)};loop()}catch{toast('Microphone permission was not available.')}};body.querySelector('.tuner-stop').onclick=stopTuner;
  const click=()=>{const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return;const ac=ctxAudio&&ctxAudio.state!=='closed'?ctxAudio:new AC();const o=ac.createOscillator(),g=ac.createGain();o.frequency.value=880;g.gain.setValueAtTime(.06,ac.currentTime);g.gain.exponentialRampToValueAtTime(.001,ac.currentTime+.06);o.connect(g);g.connect(ac.destination);o.start();o.stop(ac.currentTime+.07);const beat=body.querySelector('.loggy-beat-v239');beat.classList.add('hit');setTimeout(()=>beat.classList.remove('hit'),80)};
  const stopMetro=()=>{clearInterval(metroTimer);metroTimer=0;metroOn=false;body.querySelector('.metro-start').textContent='Start'};const startMetro=()=>{stopMetro();metroOn=true;body.querySelector('.metro-start').textContent='Stop';click();metroTimer=setInterval(click,60000/clamp(body.querySelector('.bpm').value,30,300))};body.querySelector('.metro-start').onclick=()=>metroOn?stopMetro():startMetro();body.querySelector('.bpm-minus').onclick=()=>{const i=body.querySelector('.bpm');i.value=clamp(+i.value-1,30,300);if(metroOn)startMetro()};body.querySelector('.bpm-plus').onclick=()=>{const i=body.querySelector('.bpm');i.value=clamp(+i.value+1,30,300);if(metroOn)startMetro()};body.querySelector('.tap').onclick=()=>{const now=performance.now();lastTaps=lastTaps.filter(t=>now-t<3000);lastTaps.push(now);if(lastTaps.length>=2){const gaps=lastTaps.slice(1).map((t,i)=>t-lastTaps[i]);body.querySelector('.bpm').value=Math.round(60000/(gaps.reduce((a,b)=>a+b,0)/gaps.length));if(metroOn)startMetro()}};
  body.querySelectorAll('.tuner-tab').forEach(b=>b.onclick=()=>{body.querySelectorAll('.tuner-tab').forEach(x=>x.classList.toggle('active',x===b));body.querySelector('.tuner-pane').hidden=b.dataset.tab!=='tuner';body.querySelector('.metro-pane').hidden=b.dataset.tab!=='metro'});return()=>{stopTuner();stopMetro()};
}
function mountRowCounter(body){const data=widgetData();let count=Number(data.rowCounter)||0;body.innerHTML=`<div class="loggy-counter-v239"><button class="filter-tab minus">−</button><output>${count}</output><button class="filter-tab plus">+</button></div>`;const save=()=>{const d=widgetData();d.rowCounter=count;setWidgetData(d);body.querySelector('output').value=count;body.querySelector('output').textContent=count};body.querySelector('.minus').onclick=()=>{count=Math.max(0,count-1);save()};body.querySelector('.plus').onclick=()=>{count++;save()}}
function mountLatex(body){body.innerHTML=`<textarea class="latex-input" placeholder="\\frac{1}{2} + \\sqrt{x^2}"></textarea><div class="loggy-latex-preview-v239" style="margin-top:9px"></div><p class="loggy-widget-muted-v239">Supports common fractions, roots, powers, subscripts, Greek letters, and operators.</p>`;const input=body.querySelector('textarea'),out=body.querySelector('.loggy-latex-preview-v239');const data=widgetData();input.value=data.latex||'\\frac{1}{2} + \\sqrt{x^2}';const render=()=>{out.innerHTML=latexToMathML(input.value);const d=widgetData();d.latex=input.value;setWidgetData(d)};input.oninput=render;render()}
function mountMolarMass(body){body.innerHTML=`<input class="formula" placeholder="H2O or Ca(OH)2" value="H2O"><div class="loggy-result-box-v239 result"></div>`;const i=body.querySelector('.formula'),r=body.querySelector('.result');const calc=()=>{try{const m=parseFormulaMass(i.value);r.innerHTML=m?`<strong>${m.toFixed(3)} g/mol</strong><br><span class="loggy-widget-muted-v239">Using standard atomic-weight values.</span>`:'Enter a formula.'}catch(e){r.textContent=e.message}};i.oninput=calc;calc()}
function drawGraph(canvas, fn){const rect=canvas.getBoundingClientRect(),dpr=devicePixelRatio||1,w=Math.max(280,Math.round(rect.width||320)),h=220;canvas.width=w*dpr;canvas.height=h*dpr;canvas.style.height=`${h}px`;const c=canvas.getContext('2d');c.scale(dpr,dpr);c.clearRect(0,0,w,h);const bg=themeVar('--white','#fff'),fg=themeVar('--black','#111'),muted=themeVar('--muted-text','#999'),accent=themeVar('--custom-theme-accent',fg);c.fillStyle=bg;c.fillRect(0,0,w,h);c.strokeStyle=muted;c.globalAlpha=.25;c.lineWidth=1;for(let x=0;x<=w;x+=w/10){c.beginPath();c.moveTo(x,0);c.lineTo(x,h);c.stroke()}for(let y=0;y<=h;y+=h/8){c.beginPath();c.moveTo(0,y);c.lineTo(w,y);c.stroke()}c.globalAlpha=.7;c.strokeStyle=fg;c.beginPath();c.moveTo(0,h/2);c.lineTo(w,h/2);c.moveTo(w/2,0);c.lineTo(w/2,h);c.stroke();c.globalAlpha=1;c.strokeStyle=accent;c.lineWidth=2;c.beginPath();let started=false;for(let px=0;px<w;px++){const x=(px/w)*20-10;let y;try{y=fn(x)}catch{y=NaN}const py=h/2-y*(h/16);if(!Number.isFinite(py)||py<-h*2||py>h*3){started=false;continue}if(!started){c.moveTo(px,py);started=true}else c.lineTo(px,py)}c.stroke()}
function mountGraph(body){body.innerHTML=`<input class="graph-expr" value="sin(x)" placeholder="y = x^2"><canvas class="loggy-graph-canvas-v239" width="320" height="220" style="margin-top:9px"></canvas><div class="loggy-widget-muted-v239 graph-error"></div>`;const i=body.querySelector('input'),canvas=body.querySelector('canvas'),err=body.querySelector('.graph-error');const render=()=>{try{drawGraph(canvas,compileGraph(i.value));err.textContent='Window: x −10…10, y −8…8'}catch(e){err.textContent=e.message}};i.oninput=render;render();const ro=new ResizeObserver(render);ro.observe(canvas);return()=>ro.disconnect()}
function mountBaseConverter(body){body.innerHTML=`<div class="loggy-base-grid-v239"><label>Decimal</label><input data-base="10"><label>Binary</label><input data-base="2"><label>Hex</label><input data-base="16"></div>`;const ins=[...body.querySelectorAll('input')];let busy=false;const update=source=>{if(busy)return;busy=true;const base=+source.dataset.base;const raw=source.value.trim();let n=raw?parseInt(raw,base):NaN;ins.forEach(i=>{if(i===source)return;if(!Number.isFinite(n))i.value='';else if(+i.dataset.base===10)i.value=String(n);else if(+i.dataset.base===2)i.value=n.toString(2);else i.value=n.toString(16).toUpperCase()});busy=false};ins.forEach(i=>i.oninput=()=>update(i));ins[0].value='42';update(ins[0])}
function determinant(m){if(m.length===2)return m[0][0]*m[1][1]-m[0][1]*m[1][0];return m[0][0]*(m[1][1]*m[2][2]-m[1][2]*m[2][1])-m[0][1]*(m[1][0]*m[2][2]-m[1][2]*m[2][0])+m[0][2]*(m[1][0]*m[2][1]-m[1][1]*m[2][0])}
function matMul(a,b){return a.map((row,i)=>b[0].map((_,j)=>row.reduce((sum,_,k)=>sum+a[i][k]*b[k][j],0)))}
function mountMatrix(body){body.innerHTML=`<div class="loggy-widget-row-v239"><label class="loggy-widget-grow-v239">Size <select class="matrix-size"><option value="2">2 × 2</option><option value="3">3 × 3</option></select></label></div><div class="loggy-matrix-wrap-v239" style="margin-top:10px"><div><div class="loggy-matrix-title-v239">A</div><div class="loggy-matrix-grid-v239 a"></div></div><div><div class="loggy-matrix-title-v239">B</div><div class="loggy-matrix-grid-v239 b"></div></div></div><div class="loggy-result-box-v239 result"></div>`;const size=body.querySelector('.matrix-size');const build=()=>{const n=+size.value;['a','b'].forEach(cls=>{const g=body.querySelector('.'+cls);g.innerHTML='';g.style.gridTemplateColumns=`repeat(${n},1fr)`;for(let i=0;i<n*n;i++){const x=document.createElement('input');x.type='number';x.value='';x.oninput=calc;g.appendChild(x)}});calc()};const read=cls=>{const n=+size.value,v=[...body.querySelectorAll('.'+cls+' input')].map(i=>Number(i.value)||0);return Array.from({length:n},(_,r)=>v.slice(r*n,r*n+n))};function calc(){if(!body.querySelector('.a input'))return;const a=read('a'),b=read('b'),prod=matMul(a,b);body.querySelector('.result').innerHTML=`<strong>det(A) = ${determinant(a)}</strong><br><strong>A · B</strong><br>${prod.map(r=>`[ ${r.join(' , ')} ]`).join('<br>')}`};size.onchange=build;build()}
function mountUnitCircle(body){body.innerHTML=`<input class="angle" value="120°" placeholder="120° or 2π/3"><canvas class="loggy-unit-canvas-v239" width="320" height="210" style="margin-top:9px"></canvas><div class="loggy-result-box-v239 result"></div>`;const input=body.querySelector('.angle'),canvas=body.querySelector('canvas'),result=body.querySelector('.result');const render=()=>{try{const deg=parseAngle(input.value);const norm=((deg%360)+360)%360;const rad=norm*Math.PI/180;const c=Math.cos(rad),s=Math.sin(rad);const exact=EXACT_TRIG[Math.round(norm)]&&Math.abs(norm-Math.round(norm))<1e-8?EXACT_TRIG[Math.round(norm)]:null;const q=norm===0||norm===90||norm===180||norm===270?'Axis':norm<90?'I':norm<180?'II':norm<270?'III':'IV';result.innerHTML=`<strong>${norm.toFixed(Number.isInteger(norm)?0:2)}° · Quadrant ${q}</strong><br>x / cos = ${exact?exact[0]:c.toFixed(4)}<br>y / sin = ${exact?exact[1]:s.toFixed(4)}<br>tan = ${exact?exact[2]:(Math.abs(c)<1e-10?'undefined':(s/c).toFixed(4))}`;const ctx=canvas.getContext('2d'),w=canvas.width,h=canvas.height,cx=w/2,cy=h/2,r=75;ctx.clearRect(0,0,w,h);ctx.fillStyle=themeVar('--white','#fff');ctx.fillRect(0,0,w,h);ctx.strokeStyle=themeVar('--muted-text','#999');ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(20,cy);ctx.lineTo(w-20,cy);ctx.moveTo(cx,15);ctx.lineTo(cx,h-15);ctx.stroke();ctx.strokeStyle=themeVar('--black','#111');ctx.beginPath();ctx.arc(cx,cy,r,0,Math.PI*2);ctx.stroke();const px=cx+r*c,py=cy-r*s;ctx.strokeStyle=themeVar('--custom-theme-accent',themeVar('--black','#111'));ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(px,py);ctx.stroke();ctx.fillStyle=ctx.strokeStyle;ctx.beginPath();ctx.arc(px,py,5,0,Math.PI*2);ctx.fill()}catch(e){result.textContent=e.message}};input.oninput=render;render()}

function customThemePayload(){const names=['--white','--black','--muted-text','--track-bg','--custom-theme-accent','--custom-theme-accent-text','--custom-theme-border-color','--border-radius','--thin-border','--thick-border'];const out={};const cs=getComputedStyle(document.documentElement);names.forEach(n=>out[n]=cs.getPropertyValue(n).trim());return out}
function customSrcdoc(code){const initial=customThemePayload();const varCss=Object.entries(initial).map(([k,v])=>v?`${k}:${v};`:'').join('');return `<!doctype html><html><head><meta charset="utf-8"><meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src data: blob:; media-src data: blob:; style-src 'unsafe-inline'; script-src 'unsafe-inline'; font-src data:;"><style>:root{${varCss}}html,body{margin:0;padding:0;background:transparent;color:var(--black,#111);font-family:system-ui,sans-serif}*{box-sizing:border-box}button,input,select,textarea{font:inherit}button{padding:7px 11px}</style></head><body>${code}<script>addEventListener('message',e=>{if(!e.data||e.data.type!=='loggy-theme-v239')return;for(const [k,v] of Object.entries(e.data.vars||{}))document.documentElement.style.setProperty(k,v)});<\/script></body></html>`}
function mountCustom(body,ctx,def){body.innerHTML=`<iframe class="loggy-custom-widget-frame-v239" sandbox="allow-scripts" title="${esc(def.title)}"></iframe>`;const frame=body.querySelector('iframe');frame.srcdoc=customSrcdoc(def.code||'');const send=()=>{try{frame.contentWindow?.postMessage({type:'loggy-theme-v239',vars:customThemePayload()},'*')}catch{}};frame.addEventListener('load',send);const obs=new MutationObserver(send);obs.observe(document.documentElement,{attributes:true,attributeFilter:['class','style']});return()=>obs.disconnect()}

// -------- catalog / custom widget code ----------------------------------
function starWidget(id){const p=prefs();p.stars=p.stars.includes(id)?p.stars.filter(x=>x!==id):[...p.stars,id];setPrefs(p);renderSettingsWidgets();document.querySelectorAll('[data-widget-shortcuts-v242]').forEach(renderWidgetShortcutRows)}
function previewFor(def){return def.preview||`<i class="ph ${esc(def.icon||'ph-square')}"></i>`}
function ensureCatalogModal(){let m=document.getElementById('loggy-widgets-modal-v239');if(m)return m;m=document.createElement('div');m.id='loggy-widgets-modal-v239';m.className='modal-overlay hidden loggy-widget-modal-v239';m.innerHTML=`<div class="modal-box loggy-widget-modal-box-v239"><div class="loggy-widget-modal-head-v239"><div><h2>Widgets</h2><p>Open, star, drag, and assign shortcuts to tools that stay above every tab—including Whiteboard.</p></div><button class="small-icon-btn widget-catalog-close" aria-label="Close"><i class="ph ph-x"></i></button></div><div class="loggy-widget-tools-v239"><button class="filter-tab copy-widget-prompt"><i class="ph ph-copy"></i> Copy Widget Prompt</button><button class="filter-tab paste-widget-code"><i class="ph ph-code-block"></i> Paste Widget Code</button></div><div class="loggy-widget-search-v239"><i class="ph ph-magnifying-glass"></i><input type="search" class="widget-catalog-search" placeholder="Search widgets…" autocomplete="off"></div><div class="loggy-widget-catalog-v239"></div></div>`;document.body.appendChild(m);m.querySelector('.widget-catalog-close').onclick=()=>hideModal(m);m.addEventListener('pointerdown',e=>{if(e.target===m)hideModal(m)});m.querySelector('.widget-catalog-search').oninput=renderWidgetCatalog;m.querySelector('.copy-widget-prompt').onclick=copyWidgetPrompt;m.querySelector('.paste-widget-code').onclick=openCustomWidgetEditor;return m}
function renderWidgetCatalog(){
  const m=document.getElementById('loggy-widgets-modal-v239');if(!m)return;
  const host=m.querySelector('.loggy-widget-catalog-v239'),q=m.querySelector('.widget-catalog-search')?.value.trim().toLowerCase()||'',p=prefs();host.innerHTML='';
  let defs=allDefinitions().filter(d=>!q||`${d.title} ${d.desc} ${d.group}`.toLowerCase().includes(q));const starred=defs.filter(d=>p.stars.includes(d.id));const unstarred=defs.filter(d=>!p.stars.includes(d.id));const groups=[];if(starred.length)groups.push(['Starred',starred]);GROUP_ORDER.forEach(g=>{const list=unstarred.filter(d=>d.group===g);if(list.length)groups.push([g,list])});
  groups.forEach(([name,list])=>{const sec=document.createElement('section');sec.className='loggy-widget-group-v239';sec.innerHTML=`<h3>${esc(name)}</h3><div class="loggy-widget-grid-v239"></div>`;const grid=sec.querySelector('div');list.forEach(def=>{const card=document.createElement('article');card.className=`loggy-widget-catalog-card-v239${p.stars.includes(def.id)?' starred':''}`;card.tabIndex=0;card.innerHTML=`<button class="small-icon-btn loggy-widget-star-v239" title="${p.stars.includes(def.id)?'Unstar':'Star'}"><i class="ph ${p.stars.includes(def.id)?'ph-star-fill':'ph-star'}"></i></button><div class="loggy-widget-card-title-v239"><i class="ph ${esc(def.icon||'ph-square')}"></i><strong>${esc(def.title)}</strong></div><div class="loggy-widget-card-preview-v239">${previewFor(def)}</div><div class="loggy-widget-card-desc-v239">${esc(def.desc||'')}</div>${def.custom?'<div class="loggy-widget-card-actions-v239"><button class="filter-tab delete-widget" title="Delete custom widget"><i class="ph ph-trash"></i> Delete</button></div>':''}`;const launch=()=>launchWidget(def.id);card.onclick=e=>{if(e.target.closest('.loggy-widget-star-v239,.delete-widget'))return;launch()};card.onkeydown=e=>{if((e.key==='Enter'||e.key===' ')&&!e.target.closest('button')){e.preventDefault();launch()}};card.querySelector('.loggy-widget-star-v239').onclick=e=>{e.stopPropagation();starWidget(def.id)};card.querySelector('.delete-widget')?.addEventListener('click',async e=>{e.stopPropagation();const ok=await appConfirm(`Delete “${def.title}”?`,'Delete Custom Widget');if(!ok)return;closeWidget(def.id);saveCustomWidgets(customWidgets().filter(x=>x.id!==def.id));const pp=prefs();pp.stars=pp.stars.filter(x=>x!==def.id);setPrefs(pp);renderWidgetCatalog();renderSettingsWidgets()});grid.appendChild(card)});host.appendChild(sec)});
  if(!groups.length)host.innerHTML='<div class="loggy-widget-muted-v239">No widgets match that search.</div>'
}
function openWidgetCatalog(){openSettingsAction();setTimeout(()=>{hydrateGlobalSettingsV243();document.querySelector('.loggy-settings-widget-search-v244 input')?.focus()},0)}
function widgetPrompt(){return `Create one self-contained Loggy floating widget that I can paste into Loggy's Custom Widget editor.\n\nOUTPUT: Return ONLY one HTML code block containing the widget body (HTML + optional <style> + optional <script>). Do not include explanations.\n\nRULES:\n- No external libraries, URLs, fonts, images, fetch/XHR/WebSocket, parent/top access, localStorage/sessionStorage, alerts, confirms, prompts, navigation, or popups.\n- The widget runs inside a sandboxed iframe with no same-origin access.\n- Make the UI compact, clean, responsive, and keyboard accessible. Every button must have comfortable padding.\n- Use these theme variables so old Loggy themes style it automatically: var(--white), var(--black), var(--muted-text), var(--track-bg), var(--custom-theme-accent), var(--custom-theme-accent-text), var(--custom-theme-border-color), var(--border-radius), var(--thin-border), var(--thick-border).\n- Prefer existing-looking controls: rounded cards, clear labels, strong contrast, no hard-coded page background when a theme variable works.\n- Do not attempt to close, move, resize, or control the parent widget shell; Loggy handles that.\n- Keep CPU use low: no tight loops or unnecessary animation frames.\n\nBuild the widget I describe after this line:\n[DESCRIBE MY WIDGET HERE]`;}
async function copyWidgetPrompt(){try{await navigator.clipboard.writeText(widgetPrompt());toast('Widget prompt copied.')}catch{const t=document.createElement('textarea');t.value=widgetPrompt();document.body.appendChild(t);t.select();document.execCommand('copy');t.remove();toast('Widget prompt copied.')}}
function stripFence(code){let s=String(code||'').trim();const m=s.match(/^```(?:html)?\s*([\s\S]*?)```$/i);if(m)s=m[1].trim();return s}
function openCustomWidgetEditor(){const m=ensureSimpleModal('loggy-custom-widget-editor-v239','Add Custom Widget');const body=m.querySelector('.loggy-simple-modal-content-v239');body.innerHTML=`<div class="loggy-form-stack-v239"><label>Widget name<input class="cw-name" placeholder="My Widget"></label><label>Paste the AI-generated widget code<textarea class="cw-code" rows="12" placeholder="<div>...</div>"></textarea></label><p class="loggy-widget-muted-v239">Custom code runs in a sandbox with network access disabled and cannot access Loggy's parent page or storage.</p><div class="loggy-form-actions-v239"><button class="filter-tab cw-cancel">Cancel</button><button class="filter-tab cw-save"><i class="ph ph-check"></i> Save Widget</button></div></div>`;body.querySelector('.cw-cancel').onclick=()=>hideModal(m);body.querySelector('.cw-save').onclick=()=>{const name=body.querySelector('.cw-name').value.trim(),code=stripFence(body.querySelector('.cw-code').value);if(!name||!code){toast('Add a name and widget code.');return}const list=customWidgets();list.push({id:uid('custom-widget'),title:name,code,icon:'ph-code-block'});saveCustomWidgets(list);hideModal(m);renderWidgetCatalog();renderSettingsWidgets();toast('Custom widget saved.')};showModal(m);requestAnimationFrame(()=>body.querySelector('.cw-name').focus())}

// -------- styled generic modal helpers ----------------------------------
function ensureSimpleModal(id,title){let m=document.getElementById(id);if(m){m.querySelector('h2').textContent=title;return m}m=document.createElement('div');m.id=id;m.className='modal-overlay hidden loggy-widget-modal-v239';m.innerHTML=`<div class="modal-box loggy-widget-modal-box-v239" style="max-width:560px!important"><div class="modal-header"><h2>${esc(title)}</h2><button class="small-icon-btn loggy-simple-close-v239"><i class="ph ph-x"></i></button></div><div class="loggy-simple-modal-content-v239"></div></div>`;document.body.appendChild(m);m.querySelector('.loggy-simple-close-v239').onclick=()=>hideModal(m);m.addEventListener('pointerdown',e=>{if(e.target===m)hideModal(m)});return m}
async function appConfirm(message,title='Confirm'){if(typeof showAppConfirm==='function'){try{return await showAppConfirm({title,message,confirmLabel:'Confirm'})}catch{}}return new Promise(resolve=>{const m=ensureSimpleModal('loggy-widget-confirm-v239',title),b=m.querySelector('.loggy-simple-modal-content-v239');b.innerHTML=`<p>${esc(message)}</p><div class="loggy-form-actions-v239"><button class="filter-tab no">Cancel</button><button class="filter-tab yes">Confirm</button></div>`;b.querySelector('.no').onclick=()=>{hideModal(m);resolve(false)};b.querySelector('.yes').onclick=()=>{hideModal(m);resolve(true)};showModal(m)})}

// -------- right-click anywhere ------------------------------------------
function appendWidgetsAction(menu){if(!menu||menu.querySelector('[data-loggy-widgets-action-v239]'))return;const b=document.createElement('button');b.type='button';b.dataset.loggyWidgetsActionV239='1';b.innerHTML='<i class="ph ph-squares-four"></i><span>Widgets</span>';b.addEventListener('pointerdown',e=>{if(e.button!==0)return;e.preventDefault();e.stopImmediatePropagation();menu.classList.add('hidden');if(menu.id==='custom-item-context-menu')menu.remove();openWidgetCatalog()},true);b.onclick=e=>{e.preventDefault();openWidgetCatalog()};menu.appendChild(b)}
function showGlobalContext(x,y){ensureWidgetUiRuntimeV241();document.querySelector('.loggy-global-context-v239')?.remove();const m=document.createElement('div');m.className='loggy-global-context-v239';m.innerHTML='<button type="button"><i class="ph ph-squares-four"></i><span>Widgets</span></button>';document.body.appendChild(m);const r=m.getBoundingClientRect();m.style.left=`${clamp(x,6,innerWidth-r.width-6)}px`;m.style.top=`${clamp(y,6,innerHeight-r.height-6)}px`;m.querySelector('button').onclick=()=>{m.remove();openWidgetCatalog()};const close=e=>{if(!m.contains(e.target)){m.remove();document.removeEventListener('pointerdown',close,true)}};setTimeout(()=>document.addEventListener('pointerdown',close,true),0)}
function installContextWidgets(){
  // V242: Widgets are opened only from Settings. Right-click anywhere must keep the page's normal context behavior.
  installContextWidgets.__v242Disabled = true;
}

// -------- shortcut manager ----------------------------------------------
const ACTION_META = {
  'site:settings':['Settings','Open global Settings.','Site Wide'],
  'site:search':['Search','Open Loggy search / command palette.','Site Wide'],
  'site:developer':['Developer Mode','Open Developer Mode.','Site Wide'],
  'site:mute-intro':['Intro Songs','Toggle all intro songs on/off.','Site Wide'],
  'site:mute-all-sounds':['Intro + Hover Sounds','Toggle intro songs and hover sounds together.','Site Wide'],
  'site:primary-action':['Primary Modal Action','Use the main Save / Create / Done / Add action in supported modals.','Site Wide'],
  'daily:recent':['Most Recent Day','Jump to the most recent saved Daily Log.','Daily Logs'],
  'daily:new':['New Day Tile','Jump to the + tile for creating a Daily Log.','Daily Logs'],
  'daily:left':['Previous Day / Page','Move to the previous day, or previous numbered-days page.','Daily Logs'],
  'daily:right':['Next Day / Page','Move to the next day, or next numbered-days page.','Daily Logs'],
  'daily:notes-link':['Insert Notes Link','Open the link-insert popup while editing Daily Log Notes.','Daily Logs'],
  'page:knowledge':['Open Knowledge Base','Open the Knowledge Base page.','Knowledge Base'],
  'knowledge:bulk-add':['Bulk Add Knowledge Base Items','Open the bulk-add importer.','Knowledge Base'],
  'knowledge:bulk-delete':['Bulk Delete Knowledge Base Items','Toggle multi-select delete mode.','Knowledge Base'],
  'page:quizzes':['Open Quizzes','Open the Quizzes page.','Quizzes']
};
function shortcutButton(action){const b=document.createElement('button');b.type='button';b.className='filter-tab loggy-shortcut-capture-v239';b.dataset.shortcutAction=action;b.textContent=displayCombo(shortcuts()[action]||'');b.onclick=()=>beginShortcutCapture(b,action);return b}
function cancelShortcutCaptureV244(){if(!captureState)return;const s=captureState;s.button.classList.remove('capturing');s.button.textContent=s.originalText||displayCombo(shortcuts()[s.action]||'');captureState=null}
function beginShortcutCapture(button,action){if(captureState)cancelShortcutCaptureV244();captureState={button,action,originalText:button.textContent,codes:new Set(),mods:{ctrl:false,alt:false,shift:false,meta:false}};button.classList.add('capturing');button.textContent='Press shortcut…'}
function finishShortcutCapture(){if(!captureState)return;const s=captureState;const parts=[];if(s.mods.ctrl)parts.push('Ctrl');if(s.mods.alt)parts.push('Alt');if(s.mods.shift)parts.push('Shift');if(s.mods.meta)parts.push('Meta');[...s.codes].forEach(c=>parts.push(c));const combo=parts.join('+');s.button.classList.remove('capturing');captureState=null;if(!combo){s.button.textContent=s.originalText||displayCombo(shortcuts()[s.action]||'');return;}setShortcut(s.action,combo);toast(`Shortcut set: ${displayCombo(combo)}`)}
function renderShortcutRows(host, filterGroup){host.innerHTML='';Object.entries(ACTION_META).filter(([,m])=>m[2]===filterGroup).forEach(([action,[title,desc]])=>{const row=document.createElement('div');row.className='loggy-shortcut-row-v239';row.innerHTML=`<div class="loggy-shortcut-copy-v239"><strong>${esc(title)}</strong><small>${esc(desc)}</small></div>`;row.appendChild(shortcutButton(action));host.appendChild(row)})}
function renderWidgetShortcutRows(host){host.innerHTML='';const p=prefs();allDefinitions().sort((a,b)=>(p.stars.includes(b.id)-p.stars.includes(a.id))||GROUP_ORDER.indexOf(a.group)-GROUP_ORDER.indexOf(b.group)||a.title.localeCompare(b.title)).forEach(def=>{const row=document.createElement('div');row.className='loggy-shortcut-row-v239';row.innerHTML=`<div class="loggy-shortcut-copy-v239"><strong>${esc(def.title)}</strong><small>${esc(def.group||'Widget')} widget</small></div>`;row.appendChild(shortcutButton(`widget:${def.id}`));host.appendChild(row)})}
function renderSettingsWidgets(){document.querySelectorAll('.loggy-settings-widgets-v239').forEach(section=>{const host=section.querySelector('.loggy-settings-widget-strip-v239');if(!host)return;const query=(section.querySelector('.loggy-settings-widget-search-v244 input')?.value||'').trim().toLowerCase();const p=prefs();host.innerHTML='';const defs=allDefinitions().filter(def=>!query||`${def.title} ${def.desc||''} ${def.group||''}`.toLowerCase().includes(query)).sort((a,b)=>(p.stars.includes(b.id)-p.stars.includes(a.id))||GROUP_ORDER.indexOf(a.group)-GROUP_ORDER.indexOf(b.group)||a.title.localeCompare(b.title));if(!defs.length){host.innerHTML='<div class="loggy-widget-empty-v244">No widgets match that search.</div>';return;}defs.forEach(def=>{const card=document.createElement('article');card.className='loggy-settings-widget-card-v239';card.tabIndex=0;card.setAttribute('role','button');card.setAttribute('aria-label',`Open ${def.title}`);card.innerHTML=`<header><i class="ph ${esc(def.icon)}"></i><strong>${esc(def.title)}</strong><button type="button" class="small-icon-btn settings-star" title="${p.stars.includes(def.id)?'Unstar':'Star'}" aria-label="${p.stars.includes(def.id)?'Unstar':'Star'} ${esc(def.title)}"><i class="ph ${p.stars.includes(def.id)?'ph-star-fill':'ph-star'}"></i></button></header><div class="preview">${previewFor(def)}</div>`;const launch=()=>launchWidget(def.id);card.addEventListener('click',e=>{if(e.target.closest('.settings-star'))return;launch()});card.addEventListener('keydown',e=>{if(e.target!==card)return;if(e.key==='Enter'||e.key===' '){e.preventDefault();launch()}});card.querySelector('.settings-star').onclick=e=>{e.preventDefault();e.stopPropagation();starWidget(def.id)};host.appendChild(card)})})}
function renderAllShortcutUIs(){document.querySelectorAll('[data-shortcut-group-v239]').forEach(host=>renderShortcutRows(host,host.dataset.shortcutGroupV239));document.querySelectorAll('[data-widget-shortcuts-v242]').forEach(renderWidgetShortcutRows);renderSettingsWidgets()}

function openSettingsAction(){
  if(IS_DASH){const b=document.getElementById('dashboard-theme-button');b?.click();setTimeout(()=>decorateDashboardSettings(),0);return}
  if(IS_LOG){try{openGlobalThemeSettings();return}catch{}document.getElementById('open-global-daily-settings-nav-btn')?.click();}
}
function openSearchAction(){if(IS_LOG){try{openGlobalCommandPalette();return}catch{}}const s=document.querySelector('input[type="search"]');if(s){s.focus();s.select?.()}else toast('Search is available inside a log page.')}
function openDeveloperAction(){if(IS_LOG){try{openDeveloperMode();return}catch{}}toast('Developer Mode is available inside a log page.')}
function jumpRecent(){if(!IS_LOG)return;try{jumpToMostRecentSavedLogDay();return}catch{}document.getElementById('open-daily-logs-nav-btn')?.click()}
function jumpNew(){if(!IS_LOG)return;const grid=document.getElementById('days-grid');if(!grid)return;let add=grid.querySelector('button.day-box[title="Add extra log day"],.daily-add-day-slot-v238 .day-box');if(!add){try{initGrid()}catch{}add=grid.querySelector('button.day-box[title="Add extra log day"],.daily-add-day-slot-v238 .day-box')}if(!add)return;const wrapper=add.closest('.daily-add-day-slot-v238')||add;if(getComputedStyle(wrapper).display==='none'&&typeof window.__setDailyPageV231==='function'){const next=Object.keys(window.db?.days||{}).map(Number).filter(Number.isFinite);const day=(next.length?Math.max(...next):0)+1;const layout=String(window.db?.settings?.dailyDayLayoutV228||'grid');const sizes={periodic:118,wave:40,arches:35,orbit:32,leaves:48,gems:48,shields:48,pyramid:36,snake:42};const size=sizes[layout]||42;try{window.__setDailyPageV231(Math.floor((day-1)/size),false)}catch{}}requestAnimationFrame(()=>{add.scrollIntoView({behavior:'smooth',block:'center',inline:'center'});add.focus({preventScroll:true})})}
function openPage(id){if(!IS_LOG)return;if(id==='knowledge')document.getElementById('open-phrases-btn')?.click();if(id==='quizzes')document.getElementById('open-quizzes-btn')?.click()}
function soundPrefs(){return {...{introMuted:false,allMuted:false},...safeJson(KEYS.sound,{})}}
function setSoundMode(kind){const s=soundPrefs();if(kind==='intro'){s.introMuted=!s.introMuted;if(!s.introMuted)s.allMuted=false;toast(s.introMuted?'Intro songs muted.':'Intro songs on.')}else{s.allMuted=!s.allMuted;s.introMuted=s.allMuted;toast(s.allMuted?'Intro + hover sounds muted.':'Intro + hover sounds on.')}saveJson(KEYS.sound,s);window.__loggyThemeSoundPrefsV244={...s};if(s.introMuted||s.allMuted){stopKnownThemeAudio();document.querySelectorAll('[data-theme-hover-sound-enabled-v87="true"]').forEach(el=>{try{stopThemeHoverAudioForItemV87(el,0)}catch{}})}}
function stopKnownThemeAudio(){
  try{if(customThemeIntroStopTimerV2){clearTimeout(customThemeIntroStopTimerV2);customThemeIntroStopTimerV2=null}}catch{}
  try{if(customThemeIntroFadeTimerV2){clearInterval(customThemeIntroFadeTimerV2);customThemeIntroFadeTimerV2=null}}catch{}
  try{if(customThemeIntroAudioV2){customThemeIntroAudioV2.pause();customThemeIntroAudioV2.currentTime=0}}catch{}
  try{dashboardSharedAudioV41?.pause?.()}catch{}
  try{customThemeHoverAudiosV10?.forEach?.(a=>{try{a.pause();a.currentTime=0}catch{}})}catch{}
  try{document.querySelectorAll('[data-theme-hover-sound-enabled-v87]').forEach(el=>{try{stopThemeHoverAudioForItemV87(el,0)}catch{const a=el._themeHoverAudioV87;try{a?.pause?.();if(a)a.currentTime=0}catch{}el._themeHoverAudioV87=null}})}catch{}
  try{document.querySelectorAll('audio[data-custom-theme-intro-playing="true"]').forEach(a=>{a.pause();a.currentTime=0})}catch{}
}
function visibleTopModalV242(){return Array.from(document.querySelectorAll('.modal-overlay:not(.hidden),.modal:not(.hidden),.overlay:not(.hidden)')).filter(el=>getComputedStyle(el).display!=='none').sort((a,b)=>(Number(getComputedStyle(a).zIndex)||0)-(Number(getComputedStyle(b).zIndex)||0)).pop()||null}
function triggerPrimaryActionV242(){const modal=visibleTopModalV242();if(!modal)return false;const target=modal.querySelector('[data-enter-submit="true"]:not([disabled]),.modal-primary-action-v163:not([disabled]),button[type="submit"]:not([disabled]),.primary-action:not([disabled])');if(!target)return false;target.click();return true}
function navigateDailyV242(delta){if(!IS_LOG)return false;const log=document.getElementById('log-view');if(log?.classList.contains('active')){try{goToAdjacentDay(delta);return true}catch{return false}}const grid=document.getElementById('grid-view');if(grid?.classList.contains('active')&&typeof window.__setDailyPageV231==='function'){const current=Number.isFinite(Number(window.__dailyPageIndexV231))?Number(window.__dailyPageIndexV231):0;try{window.__setDailyPageV231(current+delta,false);return true}catch{return false}}return false}
function openNotesLinkV242(){const notes=document.getElementById('log-notes');if(!notes)return false;const sel=window.getSelection?.();if(!sel?.rangeCount)return false;const range=sel.getRangeAt(0);const node=range.commonAncestorContainer.nodeType===1?range.commonAncestorContainer:range.commonAncestorContainer.parentElement;if(!node||!notes.contains(node))return false;try{openNotesLinkPopup(range.cloneRange());return true}catch{return false}}
function openKbBulkAddV244(){if(!IS_LOG)return false;const view=document.getElementById('phrases-library-view');if(!view?.classList.contains('active')){document.getElementById('open-phrases-btn')?.click();setTimeout(openKbBulkAddV244,0);return true;}const btn=document.getElementById('kb-bulk-add-btn-v162');if(btn){btn.click();return true;}toast('Bulk add is not available yet.');return false}
function toggleKbBulkDeleteV244(){if(!IS_LOG)return false;const view=document.getElementById('phrases-library-view');if(!view?.classList.contains('active')){document.getElementById('open-phrases-btn')?.click();setTimeout(toggleKbBulkDeleteV244,0);return true;}const btn=document.getElementById('kb-select-toggle-v163');if(btn){btn.click();return true;}toast('Bulk delete is not available yet.');return false}
function actionApplicableV242(action){if(action.startsWith('widget:'))return true;if(action==='knowledge:bulk-add'||action==='knowledge:bulk-delete')return !!document.getElementById('phrases-library-view')?.classList.contains('active');if(action==='site:primary-action')return !!visibleTopModalV242();if(action==='daily:left'||action==='daily:right')return !!(document.getElementById('log-view')?.classList.contains('active')||document.getElementById('grid-view')?.classList.contains('active'));if(action==='daily:notes-link')return !!document.getElementById('log-notes')?.contains(document.activeElement)||!!window.getSelection?.()?.anchorNode&&document.getElementById('log-notes')?.contains(window.getSelection().anchorNode.nodeType===1?window.getSelection().anchorNode:window.getSelection().anchorNode.parentElement);return true}
function runAction(action){if(action.startsWith('widget:'))return launchWidget(action.slice(7));if(action==='site:settings')return openSettingsAction();if(action==='site:search')return openSearchAction();if(action==='site:developer')return openDeveloperAction();if(action==='site:mute-intro')return setSoundMode('intro');if(action==='site:mute-all-sounds')return setSoundMode('all');if(action==='site:primary-action')return triggerPrimaryActionV242();if(action==='daily:recent')return jumpRecent();if(action==='daily:new')return jumpNew();if(action==='daily:left')return navigateDailyV242(-1);if(action==='daily:right')return navigateDailyV242(1);if(action==='daily:notes-link')return openNotesLinkV242();if(action==='page:knowledge')return openPage('knowledge');if(action==='page:quizzes')return openPage('quizzes');if(action==='knowledge:bulk-add')return openKbBulkAddV244();if(action==='knowledge:bulk-delete')return toggleKbBulkDeleteV244()}
const LEGACY_SHORTCUTS_V242={
  'widget:keyboard':'Ctrl+K','site:settings':'Shift+W','site:search':'Ctrl+P','site:developer':'Ctrl+Shift+D+M',
  'daily:recent':'Shift+L+D','daily:new':'Ctrl+Period','daily:left':'ArrowLeft','daily:right':'ArrowRight',
  'daily:notes-link':'Backslash','site:primary-action':'Enter'
};
const firedActions=new Set();
function installShortcutEngine(){
  if(installShortcutEngine.__v242Installed)return;installShortcutEngine.__v242Installed=true;
  document.addEventListener('pointerdown',e=>{if(captureState&&!e.target.closest?.('.loggy-shortcut-capture-v239'))cancelShortcutCaptureV244()},true);
  const down=e=>{
    if(captureState){e.preventDefault();e.stopImmediatePropagation();if(['ControlLeft','ControlRight'].includes(e.code))captureState.mods.ctrl=true;else if(['ShiftLeft','ShiftRight'].includes(e.code))captureState.mods.shift=true;else if(['AltLeft','AltRight'].includes(e.code))captureState.mods.alt=true;else if(['MetaLeft','MetaRight'].includes(e.code))captureState.mods.meta=true;else captureState.codes.add(e.code);captureState.mods.ctrl ||= e.ctrlKey;captureState.mods.shift ||= e.shiftKey;captureState.mods.alt ||= e.altKey;captureState.mods.meta ||= e.metaKey;captureState.button.textContent=[captureState.mods.ctrl?'Ctrl':'',captureState.mods.alt?'Alt':'',captureState.mods.shift?'Shift':'',captureState.mods.meta?'⌘':'',...[...captureState.codes].map(displayCode)].filter(Boolean).join(' + ')||'Press shortcut…';return}
    if(!['ControlLeft','ControlRight','ShiftLeft','ShiftRight','AltLeft','AltRight','MetaLeft','MetaRight'].includes(e.code))pressedCodes.add(e.code);
    const map=shortcuts();
    for(const [action,combo] of Object.entries(map)){if(!combo||!actionApplicableV242(action))continue;const parsed=parseCombo(combo);if(!comboSatisfied(parsed,e)||firedActions.has(action))continue;if(eventTypingTarget(e.target)&&!parsed.ctrl&&!parsed.alt&&!parsed.meta&&action!=='daily:notes-link'&&action!=='site:primary-action')continue;firedActions.add(action);e.preventDefault();e.stopImmediatePropagation();runAction(action);return}
    // Suppress legacy hard-coded shortcuts after the user remaps them, so the old template listeners cannot still fire.
    for(const [action,legacy] of Object.entries(LEGACY_SHORTCUTS_V242)){if((map[action]||'')===legacy||!actionApplicableV242(action))continue;const parsed=parseCombo(legacy);if(comboSatisfied(parsed,e)){e.preventDefault();e.stopImmediatePropagation();return}}
  };
  const up=e=>{if(captureState){e.preventDefault();e.stopImmediatePropagation();if(!['ControlLeft','ControlRight','ShiftLeft','ShiftRight','AltLeft','AltRight','MetaLeft','MetaRight'].includes(e.code)&&captureState.codes.size){finishShortcutCapture()}return}pressedCodes.delete(e.code);const map=shortcuts();for(const [action,combo] of Object.entries(map)){const p=parseCombo(combo);if(!p.codes.every(c=>pressedCodes.has(c)))firedActions.delete(action)}};
  // Window capture runs before the legacy document listeners, making remapping authoritative.
  window.addEventListener('keydown',down,true);window.addEventListener('keyup',up,true);
  window.addEventListener('blur',()=>{pressedCodes.clear();firedActions.clear();if(captureState)cancelShortcutCaptureV244()});
}

function installSoundGuards(){
  window.__loggyThemeSoundPrefsV244=soundPrefs();
  try{const before=playCustomThemeIntroAudioV2;playCustomThemeIntroAudioV2=function(){const s=soundPrefs();if(s.introMuted||s.allMuted)return;return before.apply(this,arguments)}}catch{}
  try{const before=startThemeHoverAudioForItemV87;startThemeHoverAudioForItemV87=function(){if(soundPrefs().allMuted)return;return before.apply(this,arguments)}}catch{}
  try{const before=playSingleThemeHoverSoundV10;playSingleThemeHoverSoundV10=function(){if(soundPrefs().allMuted)return;return before.apply(this,arguments)}}catch{}
  try{const before=playDashboardSharedAudioV41;playDashboardSharedAudioV41=function(){const s=soundPrefs();if(s.introMuted||s.allMuted)return;return before.apply(this,arguments)}}catch{}
  try{const before=playDashboardHoverSoundV42;playDashboardHoverSoundV42=function(){if(soundPrefs().allMuted)return;return before.apply(this,arguments)}}catch{}
}

// -------- Settings UI revamp --------------------------------------------
function settingsWidgetSection(){const sec=document.createElement('section');sec.className='modal-section loggy-settings-widgets-v239';sec.innerHTML=`<span class="field-label">Widgets</span><p class="loggy-widget-muted-v239">Click a widget card to open it. Star favorites to keep them at the top.</p><div class="theme-search-wrap loggy-settings-widget-search-v244"><i class="ph ph-magnifying-glass"></i><input class="theme-search-input" type="search" placeholder="Search widgets…" autocomplete="off" aria-label="Search widgets"></div><div class="loggy-settings-widget-strip-v239"></div><div class="loggy-widget-tools-v239"><button type="button" class="filter-tab copy-widget-prompt-settings"><i class="ph ph-copy"></i> Copy Widget Prompt</button><button type="button" class="filter-tab paste-widget-code-settings"><i class="ph ph-code-block"></i> Paste Widget Code</button></div>`;sec.querySelector('.loggy-settings-widget-search-v244 input').addEventListener('input',renderSettingsWidgets);sec.querySelector('.copy-widget-prompt-settings').onclick=copyWidgetPrompt;sec.querySelector('.paste-widget-code-settings').onclick=openCustomWidgetEditor;return sec}
function shortcutSection(){const sec=document.createElement('section');sec.className='modal-section loggy-shortcut-section-v239';sec.innerHTML=`<span class="field-label">Shortcuts</span><p class="loggy-widget-muted-v239">Click any shortcut box, then press the replacement keys.</p><div class="loggy-shortcut-major-v242"><strong>Site Wide Shortcuts</strong><div class="loggy-shortcut-list-v239" data-shortcut-group-v239="Site Wide"></div></div><div class="loggy-shortcut-major-v242"><strong>Shortcuts by Page</strong><div class="loggy-shortcut-subhead-v239">Daily Logs Page</div><div class="loggy-shortcut-list-v239" data-shortcut-group-v239="Daily Logs"></div><div class="loggy-shortcut-subhead-v239">Knowledge Base Page</div><div class="loggy-shortcut-list-v239" data-shortcut-group-v239="Knowledge Base"></div><div class="loggy-shortcut-subhead-v239">Quizzes Page</div><div class="loggy-shortcut-list-v239" data-shortcut-group-v239="Quizzes"></div></div><div class="loggy-shortcut-major-v242"><strong>Widget Shortcuts</strong><div class="loggy-shortcut-list-v239" data-widget-shortcuts-v242></div></div>`;return sec}
function enforceTabSettingsIconsV242(root=document){
  const globalBtn=root.querySelector?.('#open-global-daily-settings-nav-btn');if(globalBtn){globalBtn.title='Settings';globalBtn.setAttribute('aria-label','Settings');globalBtn.innerHTML='<i class="ph ph-gear-six"></i>'}
  [['#open-daily-settings-btn','Daily Logs settings'],['#open-settings-btn','Knowledge Base settings'],['#open-quiz-settings-v58','Quiz settings']].forEach(([sel,title])=>{const b=root.querySelector?.(sel)||document.querySelector(sel);if(b){b.title=title;b.setAttribute('aria-label',title);b.innerHTML='<i class="ph ph-sliders-horizontal"></i>'}});
  (root.querySelectorAll?.('.custom-tab-settings-btn')||[]).forEach(b=>{b.title='Tab settings';b.innerHTML='<i class="ph ph-sliders-horizontal"></i>'});
  (root.querySelectorAll?.('.custom-tab-edit-btn')||[]).forEach(b=>{b.title='Edit tab layout';b.innerHTML='<i class="ph ph-pencil-simple"></i>'});
}
function placeSettingsSectionsV242(modal){const box=modal?.querySelector('.modal-box');if(!box)return;let shortcuts=modal.querySelector('.loggy-shortcut-section-v239');let widgets=modal.querySelector('.loggy-settings-widgets-v239');if(!shortcuts){shortcuts=shortcutSection()}if(!widgets){widgets=settingsWidgetSection()}box.appendChild(widgets);box.appendChild(shortcuts)}
function decorateDashboardSettings(){}
function decorateLogSettings(){
  enforceTabSettingsIconsV242(document);
  const modal=document.getElementById('daily-settings-modal');if(!modal)return;const h=modal.querySelector('.modal-header h2');if(h&&/theme|daily view/i.test(h.textContent))h.textContent='Settings';modal.querySelector('#global-shortcuts-section')?.classList.add('hidden');modal.querySelector('#virtual-keyboard-settings-section')?.classList.add('hidden');placeSettingsSectionsV242(modal);renderAllShortcutUIs();
}
function hydrateGlobalSettingsV243(){
  if(!IS_LOG)return;
  ensureWidgetUiRuntimeV241();
  const modal=document.getElementById('daily-settings-modal');
  if(!modal)return;
  const h=modal.querySelector('.modal-header h2');
  if(h)h.textContent='Settings';
  decorateLogSettings();
}
window.__loggyHydrateGlobalSettingsV243=hydrateGlobalSettingsV243;
function installSettingsRevamp(){
  if (installSettingsRevamp.__v243Installed) return;
  installSettingsRevamp.__v243Installed = true;
  enforceTabSettingsIconsV242(document);

  // Put the real Shortcuts and Widgets sections into the SAME Settings modal
  // that already contains Theme, Companion and Mouse Pointer. Structure is
  // installed immediately; the heavier card previews are rendered only when
  // the navbar Settings gear is actually opened.
  const globalModal=document.getElementById('daily-settings-modal');
  if(globalModal)placeSettingsSectionsV242(globalModal);

  // The navbar Settings button was bound to the original opener before this
  // shared runtime loads. Listen to the button itself instead of replacing the
  // old function reference, so hydration always happens on the real click path.
  document.addEventListener('click',event=>{
    const button=event.target?.closest?.('#open-global-daily-settings-nav-btn');
    if(!button)return;
    setTimeout(hydrateGlobalSettingsV243,0);
  },true);

  // Custom tab views are rebuilt often. Patch their builder so their settings/edit icons never regress.
  try{const beforeBuild=buildCustomTabView;buildCustomTabView=function(){const view=beforeBuild.apply(this,arguments);enforceTabSettingsIconsV242(view);return view}}catch{}
  try{const beforeRenderOne=renderCustomTabView;renderCustomTabView=function(){const r=beforeRenderOne.apply(this,arguments);const id=arguments[0];enforceTabSettingsIconsV242(document.getElementById(`custom-tab-view-${id}`)||document);return r}}catch{}

  // If Settings was already opened before this lazy runtime arrived, hydrate it now.
  if(globalModal && !globalModal.classList.contains('hidden'))setTimeout(hydrateGlobalSettingsV243,0);
}

// -------- custom tab Kanban + Dropdown components -----------------------
function installCustomComponents(){
  if(!IS_LOG)return;
  try{
    if(!CUSTOM_COMPONENT_LIBRARY.some(d=>d.type==='kanbanV239'))CUSTOM_COMPONENT_LIBRARY.splice(Math.max(0,CUSTOM_COMPONENT_LIBRARY.findIndex(d=>d.type==='cards')+1),0,{type:'kanbanV239',label:'Kanban Board',icon:'ph-kanban'});
    if(!CUSTOM_COMPONENT_LIBRARY.some(d=>d.type==='dropdownV239'))CUSTOM_COMPONENT_LIBRARY.splice(Math.max(0,CUSTOM_COMPONENT_LIBRARY.findIndex(d=>d.type==='text')+1),0,{type:'dropdownV239',label:'Dropdown',icon:'ph-caret-circle-down'});
    try{CUSTOM_TITLE_BACKGROUND_TYPES.add('kanbanV239');CUSTOM_TITLE_BACKGROUND_TYPES.add('dropdownV239')}catch{}
    const beforeDefault=defaultCustomComponent;defaultCustomComponent=function(type){if(type==='kanbanV239')return{id:customId('component'),type,title:'Kanban Board',titleBackground:'none',columns:[{id:customId('kanban-col'),title:'To Do',cards:[]},{id:customId('kanban-col'),title:'Doing',cards:[]},{id:customId('kanban-col'),title:'Done',cards:[]}]};if(type==='dropdownV239')return{id:customId('component'),type,title:'Dropdown',titleBackground:'none',open:true,components:[]};return beforeDefault.apply(this,arguments)};
    const beforeRender=renderCustomComponentContent;renderCustomComponentContent=function(tab,component,content){if(component?.type==='kanbanV239')return renderKanban(tab,component,content);if(component?.type==='dropdownV239')return renderDropdown(tab,component,content);return beforeRender.apply(this,arguments)};
    const beforeEdit=editCustomComponent;editCustomComponent=async function(tabId,componentId){const tab=getCustomTab(tabId),component=tab?.components?.find(c=>c.id===componentId);if(component?.type==='kanbanV239'||component?.type==='dropdownV239'){const r=await showAppPrompt({title:component.type==='kanbanV239'?'Edit Kanban Board':'Edit Dropdown',label:'Title',value:component.title||'',submitLabel:'Save'});if(r!==null&&String(r).trim()){component.title=String(r).trim();saveDb();renderCustomTabView(tabId)}return}return beforeEdit.apply(this,arguments)};
    try{renderAllCustomTabViews();renderCustomTabNavigation()}catch{}
  }catch(e){console.warn('V239 custom components unavailable',e)}
}
function renderKanban(tab,component,content){component.columns=Array.isArray(component.columns)?component.columns:[];content.innerHTML=`<div class="custom-collection-header"><h2>${esc(component.title||'Kanban Board')}</h2><button type="button" class="small-icon-btn kb-add-col-v239"><i class="ph ph-plus"></i> Column</button></div><div class="loggy-kanban-v239"></div>`;const host=content.querySelector('.loggy-kanban-v239');component.columns.forEach(col=>{col.cards=Array.isArray(col.cards)?col.cards:[];const el=document.createElement('section');el.className='loggy-kanban-column-v239';el.dataset.columnId=col.id;el.innerHTML=`<div class="loggy-kanban-column-head-v239"><strong>${esc(col.title||'Column')}</strong><button type="button" class="small-icon-btn col-menu"><i class="ph ph-dots-three"></i></button></div><div class="loggy-kanban-drop-v239"></div><button type="button" class="small-icon-btn add-card"><i class="ph ph-plus"></i> Card</button>`;const drop=el.querySelector('.loggy-kanban-drop-v239');col.cards.forEach(card=>{const c=document.createElement('article');c.className='loggy-kanban-card-v239';c.draggable=true;c.dataset.cardId=card.id;c.innerHTML=`<strong>${esc(card.title||'Card')}</strong>${card.body?`<small>${esc(card.body)}</small>`:''}${card.label?`<span class="tag">${esc(card.label)}</span>`:''}`;c.ondragstart=e=>{e.dataTransfer.setData('text/loggy-kanban-card',JSON.stringify({from:col.id,id:card.id}));c.classList.add('dragging')};c.ondragend=()=>c.classList.remove('dragging');c.ondblclick=()=>editKanbanCard(tab,component,col,card);c.oncontextmenu=e=>{e.preventDefault();e.stopPropagation();showCustomItemContextMenu(e.clientX,e.clientY,[{label:'Edit card',icon:'ph-sliders-horizontal',action:()=>editKanbanCard(tab,component,col,card)},{label:'Delete card',icon:'ph-trash',danger:true,action:async()=>{if(!(await appConfirm(`Delete “${card.title||'this card'}”?`,'Delete Card')))return;col.cards=col.cards.filter(x=>x.id!==card.id);saveDb();renderCustomTabView(tab.id)}}])};drop.appendChild(c)});drop.ondragover=e=>{if(e.dataTransfer.types.includes('text/loggy-kanban-card'))e.preventDefault()};drop.ondrop=e=>{e.preventDefault();let info;try{info=JSON.parse(e.dataTransfer.getData('text/loggy-kanban-card'))}catch{return}const from=component.columns.find(x=>x.id===info.from),card=from?.cards.find(x=>x.id===info.id);if(!card)return;from.cards=from.cards.filter(x=>x.id!==info.id);col.cards.push(card);saveDb();renderCustomTabView(tab.id)};el.querySelector('.add-card').onclick=()=>editKanbanCard(tab,component,col,null);el.querySelector('.col-menu').onclick=e=>{const r=e.currentTarget.getBoundingClientRect();showCustomItemContextMenu(r.right,r.bottom,[{label:'Rename column',icon:'ph-sliders-horizontal',action:async()=>{const n=await showAppPrompt({title:'Rename Column',label:'Column title',value:col.title||'',submitLabel:'Save'});if(n!==null&&n.trim()){col.title=n.trim();saveDb();renderCustomTabView(tab.id)}}},{label:'Delete column',icon:'ph-trash',danger:true,action:async()=>{if(!(await appConfirm(`Delete “${col.title}” and its cards?`,'Delete Column')))return;component.columns=component.columns.filter(x=>x.id!==col.id);saveDb();renderCustomTabView(tab.id)}}])};host.appendChild(el)});content.querySelector('.kb-add-col-v239').onclick=async()=>{const n=await showAppPrompt({title:'Add Kanban Column',label:'Column title',submitLabel:'Add'});if(n!==null&&n.trim()){component.columns.push({id:customId('kanban-col'),title:n.trim(),cards:[]});saveDb();renderCustomTabView(tab.id)}}}
async function editKanbanCard(tab,component,col,card){const values=await showAppFormModal({title:card?'Edit Kanban Card':'Add Kanban Card',submitLabel:card?'Save':'Add',fields:[{name:'title',label:'Card title',value:card?.title||''},{name:'body',label:'Details',type:'textarea',value:card?.body||''},{name:'label',label:'Label / tag',value:card?.label||''}]});if(!values||!String(values.title||'').trim())return;if(card)Object.assign(card,{title:values.title.trim(),body:values.body||'',label:values.label||''});else col.cards.push({id:customId('kanban-card'),title:values.title.trim(),body:values.body||'',label:values.label||''});saveDb();renderCustomTabView(tab.id)}
function renderDropdown(tab,component,content){
  component.components=Array.isArray(component.components)?component.components:[];
  content.innerHTML=`<details class="loggy-dropdown-component-v239" ${component.open!==false?'open':''}><summary class="loggy-dropdown-summary-v239"><i class="ph ph-caret-right"></i><span>${esc(component.title||'Dropdown')}</span></summary><div class="loggy-dropdown-inner-v239"><div class="loggy-dropdown-nested-v239"></div><button type="button" class="small-icon-btn loggy-dropdown-add-v239"><i class="ph ph-plus"></i> Add Component</button></div></details>`;
  const details=content.querySelector('details');
  details.ontoggle=()=>{component.open=details.open;saveDb()};
  const host=content.querySelector('.loggy-dropdown-nested-v239');
  component.components.forEach((child,childIndex)=>{
    const wrap=document.createElement('section');
    wrap.className=`loggy-dropdown-nested-item-v239${child.type==='text'?' is-text-v242':''}`;
    wrap.dataset.componentId=child.id;
    if(child.type==='text'){
      const editor=document.createElement('textarea');
      editor.className='loggy-inline-text-v244';
      editor.value=String(child.text||'');
      editor.placeholder='Type text…';
      editor.setAttribute('aria-label','Dropdown text');
      let saveTimer=0;
      editor.addEventListener('input',()=>{
        child.text=editor.value;
        clearTimeout(saveTimer);
        saveTimer=setTimeout(()=>{try{saveDb()}catch{}},180);
      });
      editor.addEventListener('blur',()=>{clearTimeout(saveTimer);child.text=editor.value;try{saveDb()}catch{}});
      wrap.appendChild(editor);
    }else{
      const inner=document.createElement('div');
      wrap.appendChild(inner);
      if(child.type==='practiceCategoryV244'||child.type==='ankiReviewV244'){try{Object.defineProperty(child,'__nestedStudySourceV244',{value:component.components[childIndex-1]||null,configurable:true,enumerable:false,writable:true})}catch{}}
      try{renderCustomComponentContent(tab,child,inner)}catch(err){console.warn('Nested component render failed',child?.type,err);inner.textContent=getCustomComponentLabel?.(child)||child.type}
      wrap.ondblclick=e=>{if(e.target.closest('button,a,input,textarea,select,[contenteditable="true"]'))return;e.preventDefault();editNestedComponent(tab,component,child)};
    }
    wrap.oncontextmenu=e=>{
      e.preventDefault();e.stopPropagation();
      const items=[];
      if(child.type!=='text')items.push({label:'Edit component',icon:'ph-sliders-horizontal',action:()=>editNestedComponent(tab,component,child)});
      items.push({label:'Remove component',icon:'ph-trash',danger:true,action:()=>{component.components=component.components.filter(x=>x.id!==child.id);saveDb();renderCustomTabView(tab.id)}});
      showCustomItemContextMenu(e.clientX,e.clientY,items);
    };
    host.appendChild(wrap);
  });
  content.querySelector('.loggy-dropdown-add-v239').onclick=()=>openNestedPicker(tab,component)
}
function openNestedPicker(tab,parent){const m=ensureSimpleModal('loggy-nested-component-picker-v239','Add Component to Dropdown'),b=m.querySelector('.loggy-simple-modal-content-v239');b.innerHTML='<div class="loggy-widget-grid-v239"></div>';const grid=b.firstElementChild;CUSTOM_COMPONENT_LIBRARY.filter(d=>d.type!=='dropdownV239').forEach(def=>{const btn=document.createElement('button');btn.className='loggy-settings-widget-card-v239';btn.innerHTML=`<header><i class="ph ${esc(def.icon)}"></i><strong>${esc(def.label)}</strong></header>`;btn.onclick=()=>{const child=defaultCustomComponent(def.type);parent.components.push(child);saveDb();hideModal(m);renderCustomTabView(tab.id)};grid.appendChild(btn)});showModal(m)}
async function editNestedComponent(tab,parent,child){if(child.type==='kanbanV239'){const n=await showAppPrompt({title:'Edit Kanban Board',label:'Title',value:child.title||'',submitLabel:'Save'});if(n!==null&&n.trim())child.title=n.trim()}else if(child.type==='heading'){const n=await showAppPrompt({title:'Edit Heading',label:'Text',value:child.text||'',submitLabel:'Save'});if(n!==null&&n.trim())child.text=n.trim()}else if(child.type==='text'){const editor=document.querySelector(`.loggy-dropdown-nested-item-v239[data-component-id="${child.id}"] .loggy-inline-text-v244`);editor?.focus();return}else if(child.type==='search'){const n=await showAppPrompt({title:'Edit Search Bar',label:'Placeholder',value:child.placeholder||'',submitLabel:'Save'});if(n!==null)child.placeholder=n}else if(child.type==='spacer'){const n=await showAppPrompt({title:'Edit Spacer',label:'Height',value:String(child.height||36),type:'number',submitLabel:'Save'});if(n!==null)child.height=clamp(n,12,240)}else if('title'in child){const n=await showAppPrompt({title:'Edit Component',label:'Title',value:child.title||getCustomComponentLabel(child),submitLabel:'Save'});if(n!==null&&n.trim())child.title=n.trim()}saveDb();renderCustomTabView(tab.id)}

// -------- boot -----------------------------------------------------------
// -------- V244 Alphabet / study-action custom components ----------------
function safeAlphabetExampleV244(value){
  const raw=String(value||'');
  const escaped=esc(raw);
  return escaped
    .replace(/&lt;b&gt;([\s\S]*?)&lt;\/b&gt;/gi,'<b>$1</b>')
    .replace(/&lt;strong&gt;([\s\S]*?)&lt;\/strong&gt;/gi,'<strong>$1</strong>');
}
function alphabetSampleItemsV244(){
  return [
    {id:customId('letter'),character:'ㅏ',romanization:'a',paren:'ahh',example:'<b>a</b>fter',letterName:'a',category:'Vowels',audioUrl:'',audioData:'',notes:''},
    {id:customId('letter'),character:'ㅑ',romanization:'ya',paren:'ya',example:'<b>ya</b>aa',letterName:'ya',category:'Vowels',audioUrl:'',audioData:'',notes:''},
    {id:customId('letter'),character:'ㅓ',romanization:'eo',paren:'eo',example:'before (eo)',letterName:'eo',category:'Vowels',audioUrl:'',audioData:'',notes:''},
    {id:customId('letter'),character:'ㅕ',romanization:'yeo',paren:'yeo',example:'<b>yeo</b>',letterName:'yeo',category:'Vowels',audioUrl:'',audioData:'',notes:''}
  ];
}
function defaultAlphabetComponentV244(){
  return {id:customId('component'),type:'alphabetV244',title:'Alphabet',titleBackground:'none',activeCategory:'All',practiceMode:'sounds',cardStyle:'thin-vertical',items:alphabetSampleItemsV244()};
}
function previousStudyComponentV244(tab,component){
  if(component?.__nestedStudySourceV244)return component.__nestedStudySourceV244;
  const list=Array.isArray(tab?.components)?tab.components:[];
  const index=list.findIndex(x=>x.id===component.id);
  return index>0?list[index-1]:null;
}
function compatibleStudyItemsV244(component){
  if(!component)return [];
  if(component.type==='alphabetV244'){const active=String(component.activeCategory||'All');const source=(component.items||[]).filter(item=>active==='All'||String(item.category||'Other')===active);return source.map(item=>({id:item.id,front:item.character||item.romanization||'Letter',back:component.practiceMode==='names'?[item.letterName,item.romanization].filter(Boolean).join(' · '):[item.romanization,item.paren,item.example?.replace(/<\/?(?:b|strong)>/gi,'')].filter(Boolean).join(' · '),speak:item.audioData||item.audioUrl||'',raw:item})).filter(x=>x.front&&x.back)}
  if(component.type==='cards')return (component.items||[]).map(item=>({id:item.id,front:item.title||'Card',back:item.body||''})).filter(x=>x.front&&x.back);
  if(component.type==='vocabulary')return (component.items||[]).map(item=>({id:item.id,front:item.term||'Term',back:[item.meaning,item.note].filter(Boolean).join(' · ')})).filter(x=>x.front&&x.back);
  if(component.type==='polaroids')return (component.items||[]).map(item=>({id:item.id,front:item.caption||'Polaroid',back:item.caption||'Polaroid'})).filter(x=>x.front);
  return [];
}
function studyCompatibilityTextV244(){return 'Works when placed directly below Alphabet Cards, Cards, Vocabulary, or Polaroids. It studies the items from that immediately preceding component.'}
function showStudyHelpV244(title){
  const m=ensureSimpleModal('loggy-study-help-modal-v244',title);
  m.querySelector('.loggy-simple-modal-content-v239').innerHTML=`<p style="margin:0;line-height:1.55">${esc(studyCompatibilityTextV244())}</p>`;
  showModal(m);
}
function playAlphabetItemV244(item,mode='sounds'){
  const source=mode==='names'?(item.letterName||item.romanization||item.character):(item.audioData||item.audioUrl||'');
  if(mode!=='names' && source){
    try{const a=new Audio(source);a.play().catch(()=>{});return}catch{}
  }
  const text=mode==='names'?(item.letterName||item.romanization||item.character):(item.character||item.romanization);
  if(text&&'speechSynthesis' in window){try{speechSynthesis.cancel();speechSynthesis.speak(new SpeechSynthesisUtterance(text))}catch{}}
}
function openAlphabetItemEditorV244(tab,component,item=null){
  const editing=!!item;
  const current=item||{id:customId('letter'),character:'',romanization:'',paren:'',example:'',letterName:'',category:'',audioUrl:'',audioData:'',notes:''};
  const editTitle=editing?`Edit ${current.character||'Letter'}${current.romanization?` (${current.romanization})`:''}`:'Add Letter / Character';const m=ensureSimpleModal('loggy-alphabet-item-modal-v244',editTitle);
  const b=m.querySelector('.loggy-simple-modal-content-v239');
  b.innerHTML=`<div class="loggy-form-stack-v239">
    <div class="loggy-alphabet-edit-preview-v244"><strong class="letter-preview">${esc(current.character||'Aa')}</strong><span>${esc(current.romanization||'')}</span><button type="button" class="small-icon-btn preview-letter-sound" title="Preview sound"><i class="ph ph-speaker-high"></i></button></div>
    <label>Character / Letter<input class="al-character" value="${esc(current.character||'')}"></label>
    <label>Romanization<input class="al-roman" value="${esc(current.romanization||'')}"></label>
    <label>Letter name<input class="al-name" value="${esc(current.letterName||'')}"></label>
    <label>Example word<input class="al-example" value="${esc(current.example||'')}" placeholder="<b>a</b>fter"></label>
    <label>In parentheses<input class="al-paren" value="${esc(current.paren||'')}" placeholder="ahh"></label>
    <label>Category<input class="al-category" value="${esc(current.category||'')}" placeholder="Vowels"></label>
    <label>Audio URL<input class="al-audio-url" type="url" value="${esc(current.audioUrl||'')}" placeholder="https://…"></label>
    <label>Or upload audio<input class="al-audio-file" type="file" accept="audio/*"></label>
    <label>Notes<textarea class="al-notes" rows="4" placeholder="Write notes about this letter here…">${esc(current.notes||'')}</textarea></label>
    <div class="loggy-form-actions-v239"><button type="button" class="filter-tab al-cancel">Cancel</button><button type="button" class="filter-tab al-save"><i class="ph ph-check"></i> Save</button></div>
  </div>`;
  const preview=()=>{b.querySelector('.letter-preview').textContent=b.querySelector('.al-character').value||'Aa';b.querySelector('.loggy-alphabet-edit-preview-v244 span').textContent=b.querySelector('.al-roman').value||''};
  b.querySelector('.al-character').addEventListener('input',preview);b.querySelector('.al-roman').addEventListener('input',preview);
  b.querySelector('.preview-letter-sound').onclick=()=>playAlphabetItemV244({...current,character:b.querySelector('.al-character').value,romanization:b.querySelector('.al-roman').value,letterName:b.querySelector('.al-name').value,audioUrl:b.querySelector('.al-audio-url').value},component.practiceMode||'sounds');
  b.querySelector('.al-cancel').onclick=()=>hideModal(m);
  b.querySelector('.al-save').onclick=async()=>{
    const character=b.querySelector('.al-character').value.trim();
    if(!character){toast('Add the letter or character first.');return}
    let audioData=current.audioData||'';const file=b.querySelector('.al-audio-file').files?.[0];
    if(file){audioData=await new Promise(resolve=>{const r=new FileReader();r.onload=()=>resolve(String(r.result||''));r.onerror=()=>resolve('');r.readAsDataURL(file)})}
    Object.assign(current,{character,romanization:b.querySelector('.al-roman').value.trim(),letterName:b.querySelector('.al-name').value.trim(),example:b.querySelector('.al-example').value.trim(),paren:b.querySelector('.al-paren').value.trim(),category:b.querySelector('.al-category').value.trim()||'Other',audioUrl:b.querySelector('.al-audio-url').value.trim(),audioData,notes:b.querySelector('.al-notes').value});
    component.items=Array.isArray(component.items)?component.items:[];
    if(!editing)component.items.push(current);
    saveDb();hideModal(m);renderCustomTabView(tab.id)
  };
  showModal(m);requestAnimationFrame(()=>b.querySelector('.al-character').focus())
}
function renderAlphabetV244(tab,component,content){
  component.items=Array.isArray(component.items)?component.items:[];
  const categories=[...new Set(component.items.map(x=>String(x.category||'Other')).filter(Boolean))];
  const active=component.activeCategory&&component.activeCategory!=='All'&&categories.includes(component.activeCategory)?component.activeCategory:'All';
  component.activeCategory=active;
  const cardStyle=component.cardStyle==='normal'?'normal':'thin-vertical';component.cardStyle=cardStyle;
  content.innerHTML=`<div class="loggy-alphabet-v244"><div class="loggy-alphabet-head-v244"><h2>${esc(component.title||'Alphabet')}</h2><button type="button" class="small-icon-btn alphabet-add-v244" title="Add letter"><i class="ph ph-plus"></i></button></div><div class="loggy-alphabet-filters-v244"></div><div class="loggy-alphabet-practice-mode-v244"><span>Practice:</span><button type="button" class="filter-tab mode-sounds ${component.practiceMode!=='names'?'active':''}">Sounds</button><button type="button" class="filter-tab mode-names ${component.practiceMode==='names'?'active':''}">Letter Names</button>${customTabEditMode?`<select class="alphabet-card-style-v244"><option value="thin-vertical" ${cardStyle==='thin-vertical'?'selected':''}>Thin Border Vertical</option><option value="normal" ${cardStyle==='normal'?'selected':''}>Normal</option></select>`:''}</div><div class="loggy-alphabet-grid-v244"></div></div>`;
  const filters=content.querySelector('.loggy-alphabet-filters-v244');
  [...categories,'All'].forEach(cat=>{const btn=document.createElement('button');btn.type='button';btn.className=`filter-tab${cat===active?' active':''}`;btn.textContent=cat;btn.onclick=()=>{component.activeCategory=cat;saveDb();renderCustomTabView(tab.id)};filters.appendChild(btn)});
  content.querySelector('.mode-sounds').onclick=()=>{component.practiceMode='sounds';saveDb();renderCustomTabView(tab.id)};content.querySelector('.mode-names').onclick=()=>{component.practiceMode='names';saveDb();renderCustomTabView(tab.id)};
  content.querySelector('.alphabet-card-style-v244')?.addEventListener('change',e=>{component.cardStyle=e.target.value;saveDb();renderCustomTabView(tab.id)});
  content.querySelector('.alphabet-add-v244').onclick=()=>openAlphabetItemEditorV244(tab,component,null);
  const grid=content.querySelector('.loggy-alphabet-grid-v244');
  const shown=component.items.filter(item=>active==='All'||String(item.category||'Other')===active);
  if(!shown.length){grid.innerHTML='<div class="loggy-alphabet-empty-v244">No letters in this category yet.</div>';return}
  shown.forEach(item=>{const card=document.createElement('article');card.className=`loggy-letter-card-v244 custom-searchable-item${cardStyle==='thin-vertical'?' thin-vertical':''}`;card.dataset.searchText=`${item.character||''} ${item.romanization||''} ${item.example||''} ${item.category||''}`.toLowerCase();card.innerHTML=`<div class="loggy-letter-symbol-v244">${esc(item.character||'')}</div><div class="loggy-letter-roman-v244">${esc(item.romanization||'')}</div><div class="loggy-letter-example-v244">${safeAlphabetExampleV244(item.example||'')}${item.paren?` <span>(${esc(item.paren)})</span>`:''}</div>${item.notes?`<div class="loggy-letter-note-v244">${esc(item.notes)}</div>`:''}`;card.onclick=e=>{if(e.button===0)playAlphabetItemV244(item,component.practiceMode||'sounds')};card.oncontextmenu=e=>{e.preventDefault();e.stopPropagation();showCustomItemContextMenu(e.clientX,e.clientY,[{label:'Edit letter',icon:'ph-pencil-simple',action:()=>openAlphabetItemEditorV244(tab,component,item)},{label:'Delete letter',icon:'ph-trash',danger:true,action:async()=>{if(!(await showAppConfirm({title:'Delete Letter',message:`Delete “${item.character||'this letter'}”?`,confirmLabel:'Delete'})))return;component.items=component.items.filter(x=>x.id!==item.id);saveDb();renderCustomTabView(tab.id)}}])};grid.appendChild(card)})
}
function openPracticeLearnV244(tab,component,source){
  const items=compatibleStudyItemsV244(source);if(items.length<2){toast('Add at least two study items above this button.');return}
  const m=ensureSimpleModal('loggy-practice-learn-modal-v244',component.title||'Practice Category');const b=m.querySelector('.loggy-simple-modal-content-v239');let order=items.slice().sort(()=>Math.random()-.5),index=0,score=0;
  const render=()=>{if(index>=order.length){b.innerHTML=`<div style="text-align:center;padding:20px 0"><h3>Round complete</h3><p>${score} of ${order.length} correct.</p><button class="filter-tab learn-again-v244">Practice Again</button></div>`;b.querySelector('.learn-again-v244').onclick=()=>{order=items.slice().sort(()=>Math.random()-.5);index=0;score=0;render()};return}const current=order[index];const wrong=items.filter(x=>x.id!==current.id).sort(()=>Math.random()-.5).slice(0,3);const options=[current,...wrong].sort(()=>Math.random()-.5);b.innerHTML=`<div class="loggy-widget-muted-v239">${index+1} / ${order.length}</div><h3 style="font-size:1.6rem;margin:10px 0 16px">${esc(current.front)}</h3><div class="loggy-learn-options-v244"></div><div class="learn-feedback-v244" style="min-height:24px;margin-top:10px"></div>`;const host=b.querySelector('.loggy-learn-options-v244');options.forEach(opt=>{const btn=document.createElement('button');btn.className='filter-tab';btn.textContent=opt.back||opt.front;btn.onclick=()=>{const ok=opt.id===current.id;if(ok)score++;b.querySelector('.learn-feedback-v244').textContent=ok?'Correct':'Not quite';host.querySelectorAll('button').forEach(x=>x.disabled=true);setTimeout(()=>{index++;render()},450)};host.appendChild(btn)})};render();showModal(m)
}
function openAnkiReviewV244(tab,component,source){
  const items=compatibleStudyItemsV244(source);if(!items.length){toast('Add study items above this button first.');return}
  component.reviewState=component.reviewState&&typeof component.reviewState==='object'?component.reviewState:{};const now=Date.now();let due=items.filter(x=>!component.reviewState[x.id]||Number(component.reviewState[x.id].due||0)<=now);if(!due.length)due=items.slice(0,Math.min(10,items.length));let index=0;
  const m=ensureSimpleModal('loggy-anki-review-modal-v244',component.title||'Anki Review'),b=m.querySelector('.loggy-simple-modal-content-v239');
  const render=()=>{if(index>=due.length){b.innerHTML='<div style="text-align:center;padding:20px 0"><h3>Review complete</h3><p>You are caught up for this round.</p></div>';saveDb();return}const item=due[index];b.innerHTML=`<div class="loggy-widget-muted-v239">${index+1} / ${due.length}</div><h3 style="font-size:1.7rem;margin:12px 0">${esc(item.front)}</h3><button type="button" class="filter-tab loggy-study-action-v244 reveal-v244"><i class="ph ph-eye"></i> Show Answer</button><div class="answer-host-v244"></div>`;b.querySelector('.reveal-v244').onclick=()=>{const host=b.querySelector('.answer-host-v244');host.innerHTML=`<div class="loggy-anki-answer-v244">${esc(item.back||item.front)}</div><div class="loggy-anki-grades-v244"></div>`;const grades=[['Again',60_000,1],['Hard',86_400_000,1.4],['Good',259_200_000,2],['Easy',604_800_000,2.7]];const gh=host.querySelector('.loggy-anki-grades-v244');grades.forEach(([label,base,mult])=>{const btn=document.createElement('button');btn.className='filter-tab';btn.textContent=label;btn.onclick=()=>{const old=component.reviewState[item.id]||{};const interval=Math.max(base,Number(old.interval||base)*mult);component.reviewState[item.id]={due:Date.now()+interval,interval,last:Date.now(),grade:label};saveDb();index++;render()};gh.appendChild(btn)});b.querySelector('.reveal-v244').remove()}};render();showModal(m)
}
function renderStudyActionV244(tab,component,content,kind){
  const source=previousStudyComponentV244(tab,component);const compatible=compatibleStudyItemsV244(source);
  if(kind==='anki'){
    component.reviewState=component.reviewState&&typeof component.reviewState==='object'?component.reviewState:{};
    const now=Date.now();const due=compatible.filter(item=>!component.reviewState[item.id]||Number(component.reviewState[item.id].due||0)<=now).length;
    content.innerHTML=`<div style="text-align:center"><div style="display:flex;align-items:center;justify-content:center;gap:8px"><h2 style="margin:0"><i class="ph ph-brain"></i> ${esc(component.title||'Anki Review')}</h2><button type="button" class="small-icon-btn loggy-study-help-v244" title="What works with this?"><i class="ph ph-question"></i></button></div><p class="loggy-widget-muted-v239">${due} card${due===1?'':'s'} due now${compatible.length?` · ${compatible.length} total`:''}.</p><button type="button" class="filter-tab loggy-study-action-v244" ${compatible.length?'':'disabled'}><i class="ph ph-play"></i> Start Anki Review</button></div>${!source||!compatible.length?`<p class="loggy-widget-muted-v239" style="margin:7px 0 0;text-align:center">Place this directly under a compatible study component.</p>`:''}`;
  }else{
    content.innerHTML=`<div style="display:flex;gap:8px;align-items:center"><button type="button" class="filter-tab loggy-study-action-v244" ${compatible.length?'':'disabled'}><i class="ph ph-play"></i> ${esc(component.title||'Practice This Category')}</button><button type="button" class="small-icon-btn loggy-study-help-v244" title="What works with this?"><i class="ph ph-question"></i></button></div>${!source||!compatible.length?`<p class="loggy-widget-muted-v239" style="margin:7px 0 0">Place this directly under a compatible study component.</p>`:''}`;
  }
  content.querySelector('.loggy-study-help-v244').onclick=()=>showStudyHelpV244(kind==='anki'?'Anki Review':'Practice Category');
  content.querySelector('.loggy-study-action-v244').onclick=()=>kind==='anki'?openAnkiReviewV244(tab,component,source):openPracticeLearnV244(tab,component,source)
}

function enhanceCardsViewV244(tab,component,content){
  const style=['normal','thin-vertical'].includes(component.cardStyle)?component.cardStyle:'normal';component.cardStyle=style;
  const grid=content.querySelector('.custom-card-grid');if(grid){grid.classList.remove('custom-card-style-normal','custom-card-style-thin-vertical');grid.classList.add(`custom-card-style-${style}`)}
  if(!customTabEditMode)return;
  const header=content.querySelector('.custom-collection-header');if(!header||header.querySelector('.custom-card-style-select'))return;
  let actions=header.querySelector('.custom-polaroid-header-actions');if(!actions){actions=document.createElement('div');actions.className='custom-polaroid-header-actions';const add=header.querySelector('.add-custom-card');if(add){add.before(actions);actions.appendChild(add)}else header.appendChild(actions)}
  const select=document.createElement('select');select.className='custom-card-style-select';select.setAttribute('aria-label','Card style');select.innerHTML=`<option value="normal" ${style==='normal'?'selected':''}>Normal</option><option value="thin-vertical" ${style==='thin-vertical'?'selected':''}>Thin Border Vertical</option>`;select.onchange=()=>{component.cardStyle=select.value;saveDb();renderCustomTabView(tab.id)};actions.prepend(select)
}
function enhancePolaroidViewV244(tab,component,content,requested){
  const use=requested==='thin-vertical'?'thin-vertical':(['normal','vertical','horizontal'].includes(component.layout)?component.layout:'normal');
  if(requested==='thin-vertical')component.layout='thin-vertical';
  const grid=content.querySelector('.custom-polaroid-grid');if(grid){grid.classList.toggle('custom-polaroid-layout-thin-vertical',use==='thin-vertical')}
  const select=content.querySelector('.custom-polaroid-layout-select');if(select&&!select.querySelector('option[value="thin-vertical"]')){const o=document.createElement('option');o.value='thin-vertical';o.textContent='Thin Border Vertical';select.appendChild(o)}
  if(select)select.value=use;
}

function installLearningComponentsV244(){
  if(!IS_LOG||installLearningComponentsV244.__installed)return;installLearningComponentsV244.__installed=true;
  try{
    if(typeof renderCustomCards==='function'&&!renderCustomCards.__v244ViewWrapped){const oldCards=renderCustomCards;const wrappedCards=function(tab,component,content){const result=oldCards.apply(this,arguments);enhanceCardsViewV244(tab,component,content);return result};wrappedCards.__v244ViewWrapped=true;renderCustomCards=wrappedCards}
    if(typeof renderCustomPolaroids==='function'&&!renderCustomPolaroids.__v244ViewWrapped){const oldPolaroids=renderCustomPolaroids;const wrappedPolaroids=function(tab,component,content){const requested=component?.layout;const result=oldPolaroids.apply(this,arguments);enhancePolaroidViewV244(tab,component,content,requested);return result};wrappedPolaroids.__v244ViewWrapped=true;renderCustomPolaroids=wrappedPolaroids}
    const additions=[{type:'alphabetV244',label:'Alphabet Cards',icon:'ph-translate'},{type:'practiceCategoryV244',label:'Practice Category',icon:'ph-play-circle'},{type:'ankiReviewV244',label:'Anki Review',icon:'ph-brain'}];
    additions.forEach(def=>{if(!CUSTOM_COMPONENT_LIBRARY.some(x=>x.type===def.type))CUSTOM_COMPONENT_LIBRARY.splice(Math.max(0,CUSTOM_COMPONENT_LIBRARY.findIndex(x=>x.type==='vocabulary')+1),0,def)});
    try{CUSTOM_TITLE_BACKGROUND_TYPES.add('alphabetV244');CUSTOM_TITLE_BACKGROUND_TYPES.add('practiceCategoryV244');CUSTOM_TITLE_BACKGROUND_TYPES.add('ankiReviewV244')}catch{}
    const oldDefault=defaultCustomComponent;defaultCustomComponent=function(type){if(type==='alphabetV244')return defaultAlphabetComponentV244();if(type==='practiceCategoryV244')return{id:customId('component'),type,title:'Practice This Category',titleBackground:'none'};if(type==='ankiReviewV244')return{id:customId('component'),type,title:'Anki Review',titleBackground:'none',reviewState:{}};return oldDefault.apply(this,arguments)};
    const oldRender=renderCustomComponentContent;renderCustomComponentContent=function(tab,component,content){if(component?.type==='alphabetV244')return renderAlphabetV244(tab,component,content);if(component?.type==='practiceCategoryV244')return renderStudyActionV244(tab,component,content,'learn');if(component?.type==='ankiReviewV244')return renderStudyActionV244(tab,component,content,'anki');return oldRender.apply(this,arguments)};
    const oldEdit=editCustomComponent;editCustomComponent=async function(tabId,componentId){const tab=getCustomTab(tabId),component=tab?.components?.find(x=>x.id===componentId);if(component&&['alphabetV244','practiceCategoryV244','ankiReviewV244'].includes(component.type)){const title=await showAppPrompt({title:'Edit Component',label:'Title',value:component.title||'',submitLabel:'Save'});if(title!==null&&String(title).trim()){component.title=String(title).trim();saveDb();renderCustomTabView(tabId)}return}return oldEdit.apply(this,arguments)};
    if(typeof CUSTOM_TAB_TEMPLATES_V53!=='undefined'&&!CUSTOM_TAB_TEMPLATES_V53.some(x=>x.id==='alphabet')){CUSTOM_TAB_TEMPLATES_V53.push({id:'alphabet',name:'Alphabet',icon:'ph-translate',description:'Build a character/alphabet reference with sound cards, category practice, and spaced review.'});try{renderPrebuiltTabCardsV53(document.querySelector('.custom-tab-template-section-v53')||document)}catch{}try{renderBlueprintCardsV162()}catch{}}
    if(typeof buildPrebuiltTabComponentsV53==='function'&&!buildPrebuiltTabComponentsV53.__alphabetV244){const oldBuild=buildPrebuiltTabComponentsV53;const wrapped=function(templateId){if(templateId==='alphabet'){const alphabet=defaultAlphabetComponentV244();alphabet.title='Alphabet';const practice={id:customId('component'),type:'practiceCategoryV244',title:'Practice This Category',titleBackground:'none'};const anki={id:customId('component'),type:'ankiReviewV244',title:'Alphabet Anki Review',titleBackground:'none',reviewState:{}};return[alphabet,practice,anki]}return oldBuild.apply(this,arguments)};wrapped.__alphabetV244=true;buildPrebuiltTabComponentsV53=wrapped}
    try{renderAllCustomTabViews();renderCustomTabNavigation()}catch{}
  }catch(e){console.warn('V244 learning components unavailable',e)}
}



/* ============================================================
   V245 — custom-tab learning, Daily Logs component, AI Prompt Generator
   ============================================================ */
function studyFieldDefsV245(source){
  if(!source)return[];
  if(source.type==='alphabetV244')return[
    ['character','Character / letter','text'],['romanization','Romanization','text'],['letterName','Letter name','text'],['example','Example word','text'],['paren','In parentheses','text'],['notes','Notes','text'],['sound','Sound','audio'],['image','Image','image']
  ];
  if(source.type==='cards')return[['title','Card title','text'],['body','Card body','text'],['image','Image','image']];
  if(source.type==='vocabulary')return[['term','Word / phrase','text'],['meaning','Meaning / translation','text'],['note','Note','text'],['image','Image','image']];
  if(source.type==='polaroids')return[['caption','Caption','text'],['image','Image','image']];
  return[];
}
function stripHtmlV245(v){const d=document.createElement('div');d.innerHTML=String(v||'');return d.textContent||''}
function fieldValueV245(source,item,key){
  if(!item)return'';
  if(key==='sound')return item.audioData||item.audioUrl||'';
  if(key==='image')return item.image||item.imageUrl||item.media||item.photo||'';
  return stripHtmlV245(item[key]??'');
}
function compatibleStudyItemsV245(source,study){
  if(!source)return[];
  let raw=[];
  if(source.type==='alphabetV244'){
    const active=String(source.activeCategory||'All');
    raw=(source.items||[]).filter(item=>active==='All'||String(item.category||'Other')===active);
  }else if(['cards','vocabulary','polaroids'].includes(source.type)) raw=source.items||[];
  else return[];
  const defs=studyFieldDefsV245(source);
  const promptKey=study?.promptField||defs[0]?.[0]||'';
  const answerKey=study?.answerField||defs[1]?.[0]||defs[0]?.[0]||'';
  const promptDef=defs.find(x=>x[0]===promptKey)||defs[0];
  const answerDef=defs.find(x=>x[0]===answerKey)||defs[1]||defs[0];
  return raw.map((item,i)=>({
    id:item.id||`${source.id||source.type}-${i}`,
    prompt:fieldValueV245(source,item,promptDef?.[0]),answer:fieldValueV245(source,item,answerDef?.[0]),
    promptType:promptDef?.[2]||'text',answerType:answerDef?.[2]||'text',raw:item,source
  })).filter(x=>x.prompt||x.answer);
}
function renderStudyValueV245(value,type,cls=''){
  if(type==='image'&&value)return`<img class="loggy-study-media-v245 ${cls}" src="${esc(value)}" alt="Study image">`;
  if(type==='audio'&&value)return`<button type="button" class="small-icon-btn loggy-study-audio-v245 ${cls}" data-study-audio-v245="${esc(value)}" title="Play sound"><i class="ph ph-speaker-high"></i></button>`;
  return`<div class="loggy-study-text-v245 ${cls}">${esc(value||'')}</div>`;
}
function bindStudyAudioV245(root){root.querySelectorAll('[data-study-audio-v245]').forEach(b=>b.onclick=e=>{e.stopPropagation();try{new Audio(b.dataset.studyAudioV245).play().catch(()=>{})}catch{}})}
function sourceFieldsForStudyV245(tab,component){const source=previousStudyComponentV244(tab,component);return{source,defs:studyFieldDefsV245(source)}}
function openStudyConfigV245(tab,component){
  const {source,defs}=sourceFieldsForStudyV245(tab,component);
  const m=ensureSimpleModal('loggy-study-config-v245',component.type==='ankiReviewV244'?'Anki Review Settings':'Practice Settings');
  const b=m.querySelector('.loggy-simple-modal-content-v239');
  if(!source||!defs.length){b.innerHTML=`<p class="loggy-widget-muted-v239">Place this component directly below Alphabet Cards, Cards, Vocabulary, or Polaroids. Then Edit it again to choose what is shown as the question and answer.</p><div class="loggy-form-actions-v239"><button class="filter-tab close">Close</button></div>`;b.querySelector('.close').onclick=()=>hideModal(m);showModal(m);return}
  const opts=defs.map(([key,label])=>`<option value="${esc(key)}">${esc(label)}</option>`).join('');
  b.innerHTML=`<div class="loggy-form-stack-v239"><label>Title<input class="st-title" value="${esc(component.title||'')}"></label><label>Question / front field<select class="st-prompt">${opts}</select></label><label>Answer / back field<select class="st-answer">${opts}</select></label><p class="loggy-widget-muted-v239">Source: ${esc(source.title||getCustomComponentLabel?.(source)||source.type)}. Image fields are centered automatically in practice/review.</p><div class="loggy-form-actions-v239"><button class="filter-tab cancel">Cancel</button><button class="filter-tab save"><i class="ph ph-check"></i> Save</button></div></div>`;
  b.querySelector('.st-prompt').value=component.promptField||defs[0][0];b.querySelector('.st-answer').value=component.answerField||defs[1]?.[0]||defs[0][0];
  b.querySelector('.cancel').onclick=()=>hideModal(m);b.querySelector('.save').onclick=()=>{component.title=b.querySelector('.st-title').value.trim()||component.title;component.promptField=b.querySelector('.st-prompt').value;component.answerField=b.querySelector('.st-answer').value;saveDb();hideModal(m);renderCustomTabView(tab.id)};showModal(m)
}
function playAlphabetItemV245(item,mode='sounds'){
  const source=mode==='names'?(item.letterName||item.romanization||item.character):(item.audioData||item.audioUrl||'');
  if(mode!=='names'&&source){try{new Audio(source).play().catch(()=>{});return}catch{}}
  const text=mode==='names'?(item.letterName||item.romanization||item.character):(item.character||item.romanization);if(text&&'speechSynthesis'in window){try{speechSynthesis.cancel();speechSynthesis.speak(new SpeechSynthesisUtterance(text))}catch{}}
}
playAlphabetItemV244=playAlphabetItemV245;
openAlphabetItemEditorV244=function(tab,component,item=null){
  const editing=!!item,current=item||{id:customId('letter'),character:'',romanization:'',paren:'',example:'',letterName:'',category:'Other',audioUrl:'',audioData:'',notes:'',image:''};
  const categories=[...new Set((component.items||[]).map(x=>String(x.category||'Other')).filter(Boolean))];if(!categories.length)categories.push('Other');if(current.category&&!categories.includes(current.category))categories.push(current.category);
  const m=ensureSimpleModal('loggy-alphabet-item-modal-v244',editing?`Edit ${current.character||'Letter'}`:'Add Letter / Character'),b=m.querySelector('.loggy-simple-modal-content-v239');
  const categoryOptions=categories.map(c=>`<option value="${esc(c)}" ${c===current.category?'selected':''}>${esc(c)}</option>`).join('');
  b.innerHTML=`<div class="loggy-form-stack-v239"><div class="loggy-alphabet-edit-preview-v244"><strong class="letter-preview">${esc(current.character||'Aa')}</strong><span>${esc(current.romanization||'')}</span><button type="button" class="small-icon-btn preview-letter-sound" title="Preview sound"><i class="ph ph-speaker-high"></i></button></div><label>Character / Letter<input class="al-character" value="${esc(current.character||'')}"></label><label>Romanization<input class="al-roman" value="${esc(current.romanization||'')}"></label><label>Letter name<input class="al-name" value="${esc(current.letterName||'')}"></label><label>Example word<input class="al-example" value="${esc(current.example||'')}" placeholder="<b>a</b>fter"></label><label>In parentheses<input class="al-paren" value="${esc(current.paren||'')}" placeholder="ahh"></label><label>Category<select class="al-category">${categoryOptions}<option value="__add__">＋ Add new category…</option></select></label><label>Image URL (optional)<input class="al-image" type="url" value="${esc(current.image||'')}" placeholder="https://…"></label><label>Audio URL<input class="al-audio-url" type="url" value="${esc(current.audioUrl||'')}" placeholder="https://…"></label><label>Or upload audio<input class="al-audio-file" type="file" accept="audio/*"></label><label>Notes<textarea class="al-notes" rows="4">${esc(current.notes||'')}</textarea></label><div class="loggy-form-actions-v239"><button type="button" class="filter-tab al-cancel">Cancel</button><button type="button" class="filter-tab al-save"><i class="ph ph-check"></i> Save</button></div></div>`;
  const preview=()=>{b.querySelector('.letter-preview').textContent=b.querySelector('.al-character').value||'Aa';b.querySelector('.loggy-alphabet-edit-preview-v244 span').textContent=b.querySelector('.al-roman').value||''};b.querySelector('.al-character').oninput=preview;b.querySelector('.al-roman').oninput=preview;
  let lastCategory=current.category||categories[0];b.querySelector('.al-category').onchange=async e=>{if(e.target.value!=='__add__'){lastCategory=e.target.value;return}const v=await showAppPrompt({title:'Add Alphabet Category',label:'Category name',placeholder:'Vowels, Consonants…',submitLabel:'Add'});if(v&&v.trim()){const name=v.trim();if(![...e.target.options].some(o=>o.value===name)){const opt=document.createElement('option');opt.value=name;opt.textContent=name;e.target.insertBefore(opt,e.target.lastElementChild)}e.target.value=name;lastCategory=name}else e.target.value=lastCategory};
  b.querySelector('.preview-letter-sound').onclick=()=>playAlphabetItemV245({...current,character:b.querySelector('.al-character').value,romanization:b.querySelector('.al-roman').value,letterName:b.querySelector('.al-name').value,audioUrl:b.querySelector('.al-audio-url').value},'sounds');b.querySelector('.al-cancel').onclick=()=>hideModal(m);
  b.querySelector('.al-save').onclick=async()=>{const character=b.querySelector('.al-character').value.trim();if(!character){toast('Add the letter or character first.');return}let audioData=current.audioData||'';const file=b.querySelector('.al-audio-file').files?.[0];if(file)audioData=await new Promise(resolve=>{const r=new FileReader();r.onload=()=>resolve(String(r.result||''));r.onerror=()=>resolve('');r.readAsDataURL(file)});Object.assign(current,{character,romanization:b.querySelector('.al-roman').value.trim(),letterName:b.querySelector('.al-name').value.trim(),example:b.querySelector('.al-example').value.trim(),paren:b.querySelector('.al-paren').value.trim(),category:b.querySelector('.al-category').value||'Other',image:b.querySelector('.al-image').value.trim(),audioUrl:b.querySelector('.al-audio-url').value.trim(),audioData,notes:b.querySelector('.al-notes').value});component.items=Array.isArray(component.items)?component.items:[];if(!editing)component.items.push(current);saveDb();hideModal(m);renderCustomTabView(tab.id)};showModal(m);requestAnimationFrame(()=>b.querySelector('.al-character').focus())
};
renderAlphabetV244=function(tab,component,content){
  component.items=Array.isArray(component.items)?component.items:[];const categories=[...new Set(component.items.map(x=>String(x.category||'Other')).filter(Boolean))],active=component.activeCategory&&component.activeCategory!=='All'&&categories.includes(component.activeCategory)?component.activeCategory:'All';component.activeCategory=active;const cardStyle=component.cardStyle==='normal'?'normal':'thin-vertical';component.cardStyle=cardStyle;
  content.innerHTML=`<div class="loggy-alphabet-v244"><div class="loggy-alphabet-head-v244"><h2>${esc(component.title||'Alphabet')}</h2><button type="button" class="small-icon-btn alphabet-add-v244" title="Add letter"><i class="ph ph-plus"></i></button></div><div class="loggy-alphabet-filters-v244"></div>${customTabEditMode?`<div class="loggy-alphabet-edit-options-v245"><label>Card view <select class="alphabet-card-style-v244"><option value="thin-vertical" ${cardStyle==='thin-vertical'?'selected':''}>Thin Border Vertical</option><option value="normal" ${cardStyle==='normal'?'selected':''}>Normal</option></select></label></div>`:''}<div class="loggy-alphabet-grid-v244"></div></div>`;
  const filters=content.querySelector('.loggy-alphabet-filters-v244');[...categories,'All'].forEach(cat=>{const btn=document.createElement('button');btn.type='button';btn.className=`filter-tab${cat===active?' active':''}`;btn.textContent=cat;btn.onclick=()=>{component.activeCategory=cat;saveDb();renderCustomTabView(tab.id)};filters.appendChild(btn)});content.querySelector('.alphabet-card-style-v244')?.addEventListener('change',e=>{component.cardStyle=e.target.value;saveDb();renderCustomTabView(tab.id)});content.querySelector('.alphabet-add-v244').onclick=()=>openAlphabetItemEditorV244(tab,component,null);
  const grid=content.querySelector('.loggy-alphabet-grid-v244'),shown=component.items.filter(item=>active==='All'||String(item.category||'Other')===active);if(!shown.length){grid.innerHTML='<div class="loggy-alphabet-empty-v244">No letters in this category yet.</div>';return}shown.forEach(item=>{const card=document.createElement('article');card.className=`loggy-letter-card-v244 custom-searchable-item${cardStyle==='thin-vertical'?' thin-vertical':''}`;card.dataset.searchText=`${item.character||''} ${item.romanization||''} ${item.example||''} ${item.category||''}`.toLowerCase();card.innerHTML=`${item.image?`<img class="loggy-letter-image-v245" src="${esc(item.image)}" alt="">`:''}<div class="loggy-letter-symbol-v244">${esc(item.character||'')}</div><div class="loggy-letter-roman-v244">${esc(item.romanization||'')}</div><div class="loggy-letter-example-v244">${safeAlphabetExampleV244(item.example||'')}${item.paren?` <span>(${esc(item.paren)})</span>`:''}</div>${item.notes?`<div class="loggy-letter-note-v244">${esc(item.notes)}</div>`:''}`;card.onclick=e=>{if(e.button===0)playAlphabetItemV245(item,'sounds')};card.oncontextmenu=e=>{e.preventDefault();e.stopPropagation();showCustomItemContextMenu(e.clientX,e.clientY,[{label:'Edit letter',icon:'ph-pencil-simple',action:()=>openAlphabetItemEditorV244(tab,component,item)},{label:'Delete letter',icon:'ph-trash',danger:true,action:async()=>{if(!(await showAppConfirm({title:'Delete Letter',message:`Delete “${item.character||'this letter'}”?`,confirmLabel:'Delete'})))return;component.items=component.items.filter(x=>x.id!==item.id);saveDb();renderCustomTabView(tab.id)}}])};grid.appendChild(card)})
};
openPracticeLearnV244=function(tab,component,source){
  const items=compatibleStudyItemsV245(source,component);if(!items.length){toast('No study items are available from the component above.');return}const m=ensureSimpleModal('loggy-practice-learn-v244',component.title||'Practice'),b=m.querySelector('.loggy-simple-modal-content-v239');let order=items.slice().sort(()=>Math.random()-.5),index=0,score=0;
  const render=()=>{if(index>=order.length){b.innerHTML=`<div class="loggy-study-complete-v245"><h3>Round complete</h3><p>${score} of ${order.length} correct.</p><button class="filter-tab learn-again-v244">Practice Again</button></div>`;b.querySelector('.learn-again-v244').onclick=()=>{order=items.slice().sort(()=>Math.random()-.5);index=0;score=0;render()};return}const current=order[index],wrong=items.filter(x=>x.id!==current.id).sort(()=>Math.random()-.5).slice(0,3),options=[current,...wrong].sort(()=>Math.random()-.5);b.innerHTML=`<div class="loggy-study-counter-v245">${index+1} / ${order.length}</div><div class="loggy-study-question-v245">${renderStudyValueV245(current.prompt,current.promptType)}</div><div class="loggy-learn-options-v244"></div><div class="learn-feedback-v244"></div>`;const host=b.querySelector('.loggy-learn-options-v244');options.forEach((opt,i)=>{const btn=document.createElement('button');btn.className='filter-tab loggy-mcq-option-v245';btn.innerHTML=`${opt.source?.type==='alphabetV244'?`<span class="loggy-mcq-audio-slot-v245">${opt.raw?.audioData||opt.raw?.audioUrl?`<span class="small-icon-btn nested-audio-v245" role="button" tabindex="0" data-audio="${esc(opt.raw.audioData||opt.raw.audioUrl)}"><i class="ph ph-speaker-high"></i></span>`:''}</span>`:''}<strong>${String.fromCharCode(65+i)}</strong><span>${opt.answerType==='image'?`<img src="${esc(opt.answer)}" alt="Answer image">`:esc(opt.answer||opt.prompt)}</span>`;btn.addEventListener('click',e=>{if(e.target.closest('.nested-audio-v245'))return;const ok=opt.id===current.id;if(ok)score++;b.querySelector('.learn-feedback-v244').textContent=ok?'Correct':'Not quite';host.querySelectorAll(':scope > button').forEach(x=>x.disabled=true);setTimeout(()=>{index++;render()},420)});btn.querySelector('.nested-audio-v245')?.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();try{new Audio(e.currentTarget.dataset.audio).play().catch(()=>{})}catch{}});host.appendChild(btn)});bindStudyAudioV245(b)};render();showModal(m)
};
openAnkiReviewV244=function(tab,component,source){
  const items=compatibleStudyItemsV245(source,component);if(!items.length){toast('No review items are available from the component above.');return}component.reviewState=component.reviewState&&typeof component.reviewState==='object'?component.reviewState:{};let due=items.filter(item=>!component.reviewState[item.id]||Number(component.reviewState[item.id].due||0)<=Date.now());if(!due.length)due=items.slice();let index=0;const m=ensureSimpleModal('loggy-anki-review-v244',component.title||'Anki Review'),b=m.querySelector('.loggy-simple-modal-content-v239');
  const render=()=>{if(index>=due.length){b.innerHTML='<div class="loggy-study-complete-v245"><h3>Review complete</h3><p>You are caught up for this round.</p></div>';saveDb();return}const item=due[index];b.innerHTML=`<div class="loggy-study-counter-v245">${index+1} / ${due.length}</div><button type="button" class="loggy-anki-flashcard-v245" aria-label="Flip flashcard"><div class="front-v245">${renderStudyValueV245(item.prompt,item.promptType)}</div><div class="back-v245" hidden>${renderStudyValueV245(item.answer||item.prompt,item.answerType)}${item.source?.type==='alphabetV244'?`<button type="button" class="small-icon-btn alphabet-review-audio-v245"><i class="ph ph-speaker-high"></i></button>`:''}</div></button><div class="loggy-anki-grades-v245"><button class="filter-tab still-v245">Still Learning</button><button class="filter-tab got-v245">Got It</button></div>`;const card=b.querySelector('.loggy-anki-flashcard-v245'),front=card.querySelector('.front-v245'),back=card.querySelector('.back-v245');card.onclick=e=>{if(e.target.closest('.alphabet-review-audio-v245,.loggy-study-audio-v245'))return;const showing=!back.hidden;back.hidden=showing;front.hidden=!showing};card.querySelector('.alphabet-review-audio-v245')?.addEventListener('click',e=>{e.stopPropagation();playAlphabetItemV245(item.raw,'sounds')});const grade=(got)=>{const old=component.reviewState[item.id]||{};const oldInterval=Math.max(0,Number(old.interval||0));const interval=got?Math.max(86400000,oldInterval?oldInterval*2:86400000):Math.max(60000,Math.min(3600000,oldInterval||60000));component.reviewState[item.id]={due:Date.now()+interval,interval,last:Date.now(),grade:got?'Got It':'Still Learning'};saveDb();index++;render()};b.querySelector('.still-v245').onclick=()=>grade(false);b.querySelector('.got-v245').onclick=()=>grade(true);bindStudyAudioV245(b)};render();showModal(m)
};
renderStudyActionV244=function(tab,component,content,kind){
  const source=previousStudyComponentV244(tab,component),compatible=compatibleStudyItemsV245(source,component);if(kind==='anki'){component.reviewState=component.reviewState&&typeof component.reviewState==='object'?component.reviewState:{};const due=compatible.filter(item=>!component.reviewState[item.id]||Number(component.reviewState[item.id].due||0)<=Date.now()).length;content.innerHTML=`<div class="loggy-study-action-shell-v245"><h2><i class="ph ph-brain"></i> ${esc(component.title||'Anki Review')}</h2><p class="loggy-widget-muted-v239">${due} card${due===1?'':'s'} due now${compatible.length?` · ${compatible.length} total`:''}.</p><button type="button" class="filter-tab loggy-study-action-v244" ${compatible.length?'':'disabled'}><i class="ph ph-play"></i> Start Anki Review</button>${customTabEditMode?'<button type="button" class="filter-tab study-config-v245"><i class="ph ph-sliders-horizontal"></i> Configure Study Fields</button>':''}</div>`}else content.innerHTML=`<div class="loggy-study-action-shell-v245"><button type="button" class="filter-tab loggy-study-action-v244" ${compatible.length?'':'disabled'}><i class="ph ph-play"></i> ${esc(component.title||'Practice This Category')}</button>${customTabEditMode?'<button type="button" class="filter-tab study-config-v245"><i class="ph ph-sliders-horizontal"></i> Configure Study Fields</button>':''}</div>`;content.querySelector('.study-config-v245')?.addEventListener('click',()=>openStudyConfigV245(tab,component));content.querySelector('.loggy-study-action-v244')?.addEventListener('click',()=>kind==='anki'?openAnkiReviewV244(tab,component,source):openPracticeLearnV244(tab,component,source))
};

function defaultDailyLogsComponentV245(){return{id:customId('component'),type:'dailyLogsV245',title:'Daily Logs',titleBackground:'none',view:'default',layout:'grid',showEmpty:true}}
function dayHasContentV245(day){if(!day)return false;return !!(stripHtmlV245(day.notes||'').trim()||(day.phrases||[]).length||(day.tools||[]).length||day.video||day.video2||(day.resources||[]).length||(day.noteImages||[]).length||(day.noteAudios||[]).length)}
function currentLogDayNumberV245(){
  const keys=Object.keys(db.days||{}).map(Number).filter(Number.isFinite);const fallback=Math.max(1,...keys,1);
  if(!db.startDate)return fallback;const start=new Date(`${db.startDate}T12:00:00`);if(Number.isNaN(start.getTime()))return fallback;
  const now=new Date();const local=new Date(now.getFullYear(),now.getMonth(),now.getDate(),12);return Math.max(1,Math.floor((local-start)/86400000)+1)
}
const DAILY_COMPONENT_LAYOUTS_V245=[['grid','Grid'],['periodic','Periodic Table'],['compact','Compact'],['bubbles','Bubbles'],['pebbles','Pebbles'],['pills','Pills'],['dominoes','Dominoes'],['zigzag','Zigzag'],['wave','Wave'],['droplets','Droplets'],['petals','Petals'],['badges','Badges'],['clouds','Clouds'],['honeycomb','Honeycomb'],['arches','Arches'],['mosaic','Mosaic'],['tickets','Tickets'],['orbit','Orbit'],['clover','Clover'],['lanterns','Lanterns'],['leaves','Leaves'],['gems','Gems'],['shields','Shields'],['pyramid','Pyramid'],['snake','Snake']];
function renderDailyLogsComponentV245(tab,component,content){
  const nums=Object.keys(db.days||{}).map(Number).filter(Number.isFinite).sort((a,b)=>a-b),max=Math.max(0,...nums);component.view=component.view==='polaroid'?'polaroid':'default';if(!DAILY_COMPONENT_LAYOUTS_V245.some(x=>x[0]===component.layout))component.layout='grid';
  content.innerHTML=`<div class="loggy-component-head-v245"><h2>${esc(component.title||'Daily Logs')}</h2>${customTabEditMode?`<div class="loggy-component-inline-settings-v245"><label>View <select class="dlc-view-v245"><option value="default">Default</option><option value="polaroid">Polaroid</option></select></label><label>Numbered days layout <select class="dlc-layout-v245">${DAILY_COMPONENT_LAYOUTS_V245.map(([v,l])=>`<option value="${v}">${l}</option>`).join('')}</select></label></div>`:''}</div><div class="loggy-daily-component-grid-v245 view-${esc(component.view)} layout-${esc(component.layout)}"></div>`;
  const grid=content.querySelector('.loggy-daily-component-grid-v245');nums.forEach(n=>{const b=document.createElement('button');b.type='button';b.className=`day-box${dayHasContentV245(db.days[n])?' has-data':''}`;b.dataset.day=String(n);b.innerHTML=component.view==='polaroid'?`<span class="loggy-dlc-day-number-v245">${n}</span><span class="loggy-dlc-day-preview-v245">${esc(stripHtmlV245(db.days[n]?.notes||'').trim().slice(0,70)||((db.days[n]?.phrases||[]).slice(0,2).join(' · '))||'Daily Log')}</span>`:String(n);b.onclick=()=>openDayLog(n);grid.appendChild(b)});
  const plus=document.createElement('button');plus.type='button';plus.className='day-box loggy-daily-component-plus-v245';plus.innerHTML='<i class="ph ph-plus"></i>';plus.title='Add new day';plus.onclick=()=>{try{document.getElementById('open-daily-btn')?.click();setTimeout(()=>document.getElementById('add-new-day-card')?.click(),0)}catch{openDayLog(max+1)}};grid.appendChild(plus);
  const view=content.querySelector('.dlc-view-v245'),layout=content.querySelector('.dlc-layout-v245');if(view){view.value=component.view;view.onchange=()=>{component.view=view.value;saveDb();renderCustomTabView(tab.id)}}if(layout){layout.value=component.layout;layout.onchange=()=>{component.layout=layout.value;saveDb();renderCustomTabView(tab.id)}}
}
function defaultAiPromptComponentV245(){return{id:customId('component'),type:'aiPromptGeneratorV245',title:'AI Prompt Generator',titleBackground:'none',xType:'video',customX:'',sourceType:'daily',dayMode:'manual',selectedDays:[],randomCount:5,randomDaysV245:[],kbCategory:'all',kbTags:'',kbPlaceholder:'',kbMode:'all',kbCount:20,customSourceId:''}}
function learnedDayAvailableV245(n){return Array.isArray(db.days?.[n]?.phrases)&&db.days[n].phrases.length>0}
function promptDayUniverseV245(component){const keys=Object.keys(db.days||{}).map(Number).filter(Number.isFinite),selected=(component.selectedDays||[]).map(Number).filter(Number.isFinite),random=(component.randomDaysV245||[]).map(Number).filter(Number.isFinite),max=Math.max(1,currentLogDayNumberV245(),...keys,...selected,...random);return Array.from({length:max},(_,i)=>i+1)}
function availablePromptDaysV245(component){return promptDayUniverseV245(component).filter(learnedDayAvailableV245)}
function chooseRandomPromptDaysV245(component){const pool=availablePromptDaysV245(component).slice();for(let i=pool.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[pool[i],pool[j]]=[pool[j],pool[i]]}component.randomDaysV245=pool.slice(0,Math.max(1,Math.min(pool.length,Number(component.randomCount)||5))).sort((a,b)=>a-b);return component.randomDaysV245}
function promptDayNumbersV245(component){const available=availablePromptDaysV245(component),set=new Set(available),today=currentLogDayNumberV245();if(component.dayMode==='today')return set.has(today)?[today]:[];if(component.dayMode==='week')return available.filter(n=>n>=today-6&&n<=today);if(component.dayMode==='all')return available;if(component.dayMode==='random'){const current=(component.randomDaysV245||[]).map(Number).filter(n=>set.has(n));return current.length?current:chooseRandomPromptDaysV245(component)}return(component.selectedDays||[]).map(Number).filter(n=>set.has(n)).sort((a,b)=>a-b)}
function splitFilterValuesV245(v){return String(v||'').split(/[\n,]+/).map(x=>x.trim().replace(/^#/,'')).filter(Boolean)}
function kbPlaceholderTypesV245(){try{if(typeof ensurePlaceholderSettingsV56==='function')return [...new Set(ensurePlaceholderSettingsV56().map(String))]}catch{}return[...new Set((db.settings?.knowledgePlaceholdersV56||[]).map(String))]}
function kbCategoriesV245(){return[...new Set((db.settings?.categories||[]).map(c=>String(c?.name||c?.id||c||'')).filter(Boolean))]}
function kbItemMatchesPromptV245(id,component){const meta=db.phrase_meta?.[id]||{};if(component.kbCategory&&component.kbCategory!=='all'&&String(meta.type||'')!==String(component.kbCategory))return false;const wantedTags=splitFilterValuesV245(component.kbTags).map(x=>x.toLowerCase()),itemTags=(meta.tags||[]).map(x=>String(x).replace(/^#/,'').toLowerCase());if(wantedTags.length&&!wantedTags.every(t=>itemTags.includes(t)))return false;const ph=String(component.kbPlaceholder||'').trim().replace(/^\\+/,'').toLowerCase();if(ph){const hay=[id,...Object.values(meta.custom_fields||{}),...(meta.tags||[])].join(' ').toLowerCase();if(!hay.includes(`\\${ph}`)&&!hay.includes(`{${ph}}`)&&!itemTags.includes(ph))return false}return true}
function flattenCustomComponentValuesV245(value,out=[],seen=new WeakSet(),depth=0){if(depth>6||value==null)return out;if(typeof value==='string'){const t=stripHtmlV245(value).trim();if(t&&t.length<4000)out.push(t);return out}if(typeof value==='number'||typeof value==='boolean'){out.push(String(value));return out}if(typeof value!=='object')return out;if(seen.has(value))return out;seen.add(value);if(Array.isArray(value)){value.forEach(v=>flattenCustomComponentValuesV245(v,out,seen,depth+1));return out}for(const[k,v]of Object.entries(value)){if(['id','type','createdAt','updatedAt','image','imageUrl','audioData','audioUrl','media','url','href','reviewState'].includes(k))continue;flattenCustomComponentValuesV245(v,out,seen,depth+1)}return out}
function promptSourceItemsV245(tab,component){
  if(component.sourceType==='daily'){const days=promptDayNumbersV245(component),items=[];days.forEach(n=>(db.days?.[n]?.phrases||[]).forEach(id=>items.push(String(id))));return{label:`Items Learned from Days ${days.join(', ')||'none'}`,items:[...new Set(items)]}}
  if(component.sourceType==='kb'){let ids=(db.phrases||[]).filter(id=>kbItemMatchesPromptV245(id,component));const all=component.kbMode!=='some';if(!all)ids=ids.slice(0,Math.max(1,Number(component.kbCount)||20));const filters=[];if(component.kbCategory&&component.kbCategory!=='all')filters.push(`category ${component.kbCategory}`);if(splitFilterValuesV245(component.kbTags).length)filters.push(`tags ${splitFilterValuesV245(component.kbTags).join(', ')}`);if(component.kbPlaceholder)filters.push(`placeholder \\${String(component.kbPlaceholder).replace(/^\\+/,'')}`);return{label:`Knowledge Base${filters.length?' filtered by '+filters.join(' · '):''}`,items:ids}}
  const src=(tab.components||[]).find(x=>x.id===component.customSourceId);if(!src)return{label:'custom component',items:[]};let items=[];const defs=studyFieldDefsV245(src);if(defs.length){const study=compatibleStudyItemsV245(src,{promptField:defs[0]?.[0],answerField:defs[1]?.[0]||defs[0]?.[0]});items=study.flatMap(x=>[x.prompt,x.answer]).filter(Boolean)}else items=flattenCustomComponentValuesV245(src,[]);return{label:src.title||getCustomComponentLabel?.(src)||'custom component',items:[...new Set(items)]}
}
async function copyAiPromptV245(tab,component,output){const source=promptSourceItemsV245(tab,component),x=component.xType==='custom'?(component.customX||'creative learning activity'):component.xType;const prompt=`Create a ${x} using the following ${source.label}. Make the result useful for active practice and naturally incorporate every selected item when possible. Do not silently omit selected material; if something cannot fit naturally, list it at the end as material to review.\n\nItems:\n${source.items.map((v,i)=>`${i+1}. ${v}`).join('\n')||'(No matching items selected yet.)'}`;output.value=prompt;try{await navigator.clipboard.writeText(prompt);toast('Prompt copied.')}catch{toast('Prompt generated below.')}}
function renderAiPromptGeneratorV245(tab,component,content){
  component.dayMode=component.dayMode||'manual';component.kbMode=component.kbMode||'all';const universe=promptDayUniverseV245(component),activeDays=new Set(promptDayNumbersV245(component)),manualSelected=new Set((component.selectedDays||[]).map(Number));const categories=kbCategoriesV245(),placeholders=kbPlaceholderTypesV245();
  content.innerHTML=`<div class="loggy-component-head-v245"><h2>${esc(component.title||'AI Prompt Generator')}</h2></div>${customTabEditMode?`<div class="loggy-ai-config-v245"><label>Make <select class="ai-x-v245"><option value="video">Video</option><option value="image">Image</option><option value="short story">Short Story</option><option value="long story">Long Story</option><option value="song">Song</option><option value="poem">Poem</option><option value="passage">Passage</option><option value="worksheet">Worksheet</option><option value="word problems">Word Problems</option><option value="problems">Problems</option><option value="sentences">Sentences</option><option value="custom">Custom…</option></select></label><label class="ai-custom-x-wrap-v245">Custom output<input class="ai-custom-x-v245" value="${esc(component.customX||'')}"></label><label>Using <select class="ai-source-v245"><option value="daily">Items Learned in Daily Logs</option><option value="kb">Knowledge Base</option><option value="custom">Another component</option></select></label><div class="ai-daily-config-v245"><label>Random day count<input class="ai-random-count-v245" type="number" min="1" max="100" value="${Math.max(1,Number(component.randomCount)||5)}"></label></div><div class="ai-kb-config-v245"><label>Category<select class="ai-kb-category-v245"><option value="all">All categories</option>${categories.map(c=>`<option value="${esc(c)}">${esc(c)}</option>`).join('')}</select></label><label>Tags<input class="ai-kb-tags-v245" value="${esc(component.kbTags||'')}" placeholder="practice, important"></label><label>Placeholder<select class="ai-kb-placeholder-v245"><option value="">Any placeholder</option>${placeholders.map(v=>`<option value="${esc(v)}">\\${esc(v)}</option>`).join('')}</select></label><label>Amount<select class="ai-kb-mode-v245"><option value="all">All matching items</option><option value="some">Some matching items</option></select></label><label class="ai-kb-count-wrap-v245">Maximum items<input class="ai-kb-count-v245" type="number" min="1" max="500" value="${Math.max(1,Number(component.kbCount)||20)}"></label></div><label class="ai-custom-source-wrap-v245">Component<select class="ai-custom-source-v245">${(tab.components||[]).filter(x=>x.id!==component.id).map(c=>`<option value="${esc(c.id)}">${esc(c.title||getCustomComponentLabel?.(c)||c.type)}</option>`).join('')}</select></label></div>`:''}<div class="loggy-ai-days-v245 ${component.sourceType==='daily'?'':'hidden'}"><div class="loggy-ai-day-filters-v245"><button class="filter-tab" data-daymode="today">Today</button><button class="filter-tab" data-daymode="week">Last 7 Days</button><button class="filter-tab" data-daymode="all">All Days</button><button class="filter-tab" data-daymode="random">Random Days</button><button class="filter-tab" data-daymode="manual">Manual</button></div><div class="loggy-ai-day-grid-v245"></div></div><button type="button" class="filter-tab loggy-ai-generate-v245"><i class="ph ph-magic-wand"></i> Generate Prompt</button><textarea class="loggy-ai-output-v245" rows="8" placeholder="Your generated prompt will appear here…" readonly></textarea>`;
  const grid=content.querySelector('.loggy-ai-day-grid-v245');universe.forEach(n=>{const available=learnedDayAvailableV245(n),b=document.createElement('button');b.type='button';b.className=`day-box${available?' has-data':' unavailable-v245'}${activeDays.has(n)?' selected':''}`;b.textContent=n;b.disabled=!available;b.title=available?`Day ${n}`:`Day ${n} has no Items Learned`;b.onclick=()=>{component.dayMode='manual';if(manualSelected.has(n))manualSelected.delete(n);else manualSelected.add(n);component.selectedDays=[...manualSelected].filter(learnedDayAvailableV245).sort((a,b)=>a-b);saveDb();renderCustomTabView(tab.id)};grid.appendChild(b)});
  content.querySelectorAll('[data-daymode]').forEach(b=>{b.classList.toggle('active',component.dayMode===b.dataset.daymode);b.onclick=()=>{component.dayMode=b.dataset.daymode;if(component.dayMode==='random')chooseRandomPromptDaysV245(component);saveDb();renderCustomTabView(tab.id)}});
  if(customTabEditMode){const x=content.querySelector('.ai-x-v245'),source=content.querySelector('.ai-source-v245'),customX=content.querySelector('.ai-custom-x-v245'),randomCount=content.querySelector('.ai-random-count-v245'),kbCat=content.querySelector('.ai-kb-category-v245'),kbTags=content.querySelector('.ai-kb-tags-v245'),kbPh=content.querySelector('.ai-kb-placeholder-v245'),kbMode=content.querySelector('.ai-kb-mode-v245'),kbCount=content.querySelector('.ai-kb-count-v245'),cs=content.querySelector('.ai-custom-source-v245');x.value=component.xType||'video';source.value=component.sourceType||'daily';if(kbCat)kbCat.value=component.kbCategory||'all';if(kbPh)kbPh.value=component.kbPlaceholder||'';if(kbMode)kbMode.value=component.kbMode||'all';if(cs&&component.customSourceId)cs.value=component.customSourceId;const syncVisibility=()=>{content.querySelector('.ai-custom-x-wrap-v245')?.classList.toggle('hidden',x.value!=='custom');content.querySelector('.ai-daily-config-v245')?.classList.toggle('hidden',source.value!=='daily');content.querySelector('.ai-kb-config-v245')?.classList.toggle('hidden',source.value!=='kb');content.querySelector('.ai-custom-source-wrap-v245')?.classList.toggle('hidden',source.value!=='custom');content.querySelector('.ai-kb-count-wrap-v245')?.classList.toggle('hidden',kbMode?.value!=='some')};const sync=()=>{component.xType=x.value;component.customX=customX.value;component.sourceType=source.value;component.randomCount=Math.max(1,Number(randomCount.value)||5);component.kbCategory=kbCat?.value||'all';component.kbTags=kbTags?.value||'';component.kbPlaceholder=kbPh?.value||'';component.kbMode=kbMode?.value||'all';component.kbCount=Math.max(1,Number(kbCount?.value)||20);component.customSourceId=cs?.value||'';if(component.dayMode==='random')chooseRandomPromptDaysV245(component);saveDb();syncVisibility();renderCustomTabView(tab.id)};[x,source,kbCat,kbPh,kbMode,cs].filter(Boolean).forEach(el=>el.onchange=sync);[customX,randomCount,kbTags,kbCount].filter(Boolean).forEach(el=>el.onchange=sync);syncVisibility()}
  content.querySelector('.loggy-ai-generate-v245').onclick=()=>copyAiPromptV245(tab,component,content.querySelector('.loggy-ai-output-v245'))
}
function installAdvancedComponentsV245(){
  if(!IS_LOG||installAdvancedComponentsV245.__installed)return;installAdvancedComponentsV245.__installed=true;
  try{
    const defs=[{type:'dailyLogsV245',label:'Daily Logs',icon:'ph-calendar-dots'},{type:'aiPromptGeneratorV245',label:'AI Prompt Generator',icon:'ph-magic-wand'}];defs.forEach(d=>{if(!CUSTOM_COMPONENT_LIBRARY.some(x=>x.type===d.type))CUSTOM_COMPONENT_LIBRARY.push(d)});
    const oldDefault=defaultCustomComponent;defaultCustomComponent=function(type){if(type==='dailyLogsV245')return defaultDailyLogsComponentV245();if(type==='aiPromptGeneratorV245')return defaultAiPromptComponentV245();return oldDefault.apply(this,arguments)};
    const oldRender=renderCustomComponentContent;renderCustomComponentContent=function(tab,component,content){if(component?.type==='dailyLogsV245')return renderDailyLogsComponentV245(tab,component,content);if(component?.type==='aiPromptGeneratorV245')return renderAiPromptGeneratorV245(tab,component,content);return oldRender.apply(this,arguments)};
    const oldEdit=editCustomComponent;editCustomComponent=async function(tabId,componentId){const tab=getCustomTab(tabId),component=tab?.components?.find(x=>x.id===componentId);if(component&&['practiceCategoryV244','ankiReviewV244'].includes(component.type))return openStudyConfigV245(tab,component);return oldEdit.apply(this,arguments)};
    try{renderAllCustomTabViews()}catch{}
  }catch(e){console.warn('V245 custom components unavailable',e)}
}
function restoreOpenWidgetsV241(){
  const ids=prefs().open.slice();
  let index=0;
  const step=deadline=>{
    while(index<ids.length && (!deadline || deadline.timeRemaining()>4 || deadline.didTimeout)){
      const id=ids[index++];
      if(defById(id)) launchWidget(id); else markOpen(id,false);
      // Restore at most one potentially heavy widget per idle slice.
      break;
    }
    if(index<ids.length){
      if('requestIdleCallback' in window) requestIdleCallback(step,{timeout:1200});
      else setTimeout(()=>step(null),80);
    }
  };
  if(ids.length){
    if('requestIdleCallback' in window) requestIdleCallback(step,{timeout:1200});
    else setTimeout(()=>step(null),120);
  }
}
function trackTextTargets(){document.addEventListener('focusin',e=>{const t=e.target;if(t instanceof HTMLInputElement||t instanceof HTMLTextAreaElement||t?.isContentEditable)lastTextTarget=t},true)}
function scheduleDeferredEnhancementsV241(){
  if(deferredEnhancementsScheduledV241)return;
  deferredEnhancementsScheduledV241=true;
  const run=()=>{
    const work=()=>{
      try{installCustomComponents();installLearningComponentsV244();installAdvancedComponentsV245()}catch(e){console.warn('V245 deferred components unavailable',e)}
      try{restoreOpenWidgetsV241()}catch(e){console.warn('V241 widget restore unavailable',e)}
    };
    if('requestIdleCallback' in window) requestIdleCallback(work,{timeout:1500});
    else setTimeout(work,120);
  };
  if(document.readyState==='complete') setTimeout(run,0);
  else window.addEventListener('load',run,{once:true});
}
function init(){
  // V241 deliberately keeps initial log boot tiny. No widget DOM is rendered,
  // no full-page observers are installed, and no floating widget is restored
  // until the normal Loggy page has finished loading.
  trackTextTargets();
  installSoundGuards();
  installShortcutEngine();
  // V242: Widgets are launched from Settings only.
  installSettingsRevamp();
  scheduleDeferredEnhancementsV241();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
