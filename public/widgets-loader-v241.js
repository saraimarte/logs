(() => {
'use strict';
if (window.__loggyWidgetsLoaderV241) return;
window.__loggyWidgetsLoaderV241 = true;

function applyEarlyThemeSoundPrefsV244(){
  let prefs={};try{prefs=JSON.parse(localStorage.getItem('loggy-sound-shortcuts-v239')||'{}')||{}}catch{}
  if(!prefs.introMuted&&!prefs.allMuted)return;
  try{if(customThemeIntroAudioV2){customThemeIntroAudioV2.pause();customThemeIntroAudioV2.currentTime=0}}catch{}
  try{document.querySelectorAll('[data-theme-hover-sound-enabled-v87]').forEach(el=>{try{stopThemeHoverAudioForItemV87(el,0)}catch{}})}catch{}
  try{const before=playCustomThemeIntroAudioV2;playCustomThemeIntroAudioV2=function(){if(JSON.parse(localStorage.getItem('loggy-sound-shortcuts-v239')||'{}').introMuted||JSON.parse(localStorage.getItem('loggy-sound-shortcuts-v239')||'{}').allMuted)return;return before.apply(this,arguments)}}catch{}
  try{const before=startThemeHoverAudioForItemV87;startThemeHoverAudioForItemV87=function(){let p={};try{p=JSON.parse(localStorage.getItem('loggy-sound-shortcuts-v239')||'{}')||{}}catch{};if(p.allMuted)return;return before.apply(this,arguments)}}catch{}
}
applyEarlyThemeSoundPrefsV244();

function loadWidgetRuntimeV241() {
  if (window.__loggyWidgetsV239 || document.querySelector('script[data-loggy-widgets-runtime-v241]')) return;
  const script = document.createElement('script');
  script.src = '/widgets-v239.js?v=245';
  script.async = true;
  script.dataset.loggyWidgetsRuntimeV241 = '1';
  script.addEventListener('load',()=>{
    window.dispatchEvent(new CustomEvent('loggy-widgets-ready-v243'));
    window.__loggyHydrateGlobalSettingsV243?.();
  },{once:true});
  document.body.appendChild(script);
}
window.__loggyLoadWidgetsRuntimeV241 = loadWidgetRuntimeV241;


// Settings must never depend on idle timing. If the navbar gear is clicked
// before the widget runtime has arrived, load it immediately and hydrate the
// same Settings modal as soon as the runtime is ready.
document.addEventListener('click', event => {
  if (!event.target?.closest?.('#open-global-daily-settings-nav-btn')) return;
  loadWidgetRuntimeV241();
  if (window.__loggyWidgetsV239) {
    setTimeout(() => window.__loggyHydrateGlobalSettingsV243?.(), 0);
  } else {
    window.addEventListener('loggy-widgets-ready-v243', () => {
      setTimeout(() => window.__loggyHydrateGlobalSettingsV243?.(), 0);
    }, { once: true });
  }
}, true);

function scheduleV241() {
  // Keep the expanded widget/component runtime out of Loggy's critical startup
  // path. Settings can still force-load it instantly from the click handler.
  if ('requestIdleCallback' in window) requestIdleCallback(loadWidgetRuntimeV241, { timeout: 1200 });
  else setTimeout(loadWidgetRuntimeV241, 220);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', scheduleV241, { once: true });
} else {
  scheduleV241();
}
})();
