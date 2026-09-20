/* ============================================================
   V288 — TRUE BLACK/WHITE NEW-THEME DEFAULTS
   A brand-new Theme Builder theme must not inherit Loggy's historical purple
   starter palette. Mutate the historical default objects before the V257 blank
   factory is invoked so the controls and every preview all begin neutral.
   ============================================================ */
(() => {
  'use strict';
  const WHITE = '#ffffff';
  const BLACK = '#000000';

  try {
    if (typeof FEATURE_SUITE_DEFAULT_THEME === 'object' && FEATURE_SUITE_DEFAULT_THEME) {
      Object.assign(FEATURE_SUITE_DEFAULT_THEME, {
        background: WHITE,
        surface: WHITE,
        text: BLACK,
        border: BLACK,
        accent: WHITE,
        muted: '#666666',
        hoverColor: WHITE,
        hoverOpacity: 0,

        dashboardBackgroundV40: WHITE,
        dashboardCardV40: WHITE,
        dashboardTextV40: BLACK,
        dashboardAccentV40: WHITE,
        dashboardTitleColorV79: BLACK,
        dashboardIconColorV81: BLACK,
        dashboardLogIconColorV85: BLACK,
        dashboardLogIconBackgroundV107: WHITE,

        // V391: explicit Dashboard log-button + New Log button palettes.
        // Legacy V85/V107 fields remain compatibility fallbacks only.
        dashboardLogButtonBackgroundV391: WHITE,
        dashboardLogButtonTextColorV391: BLACK,
        dashboardLogButtonIconColorV391: BLACK,
        dashboardLogButtonBorderColorV391: BLACK,
        dashboardLogButtonHoverBackgroundV391: '#eeeeee',
        dashboardLogButtonHoverTextColorV391: BLACK,
        dashboardLogButtonHoverIconColorV391: BLACK,
        dashboardLogButtonHoverBorderColorV391: BLACK,
        dashboardNewLogButtonBackgroundV391: WHITE,
        dashboardNewLogButtonTextColorV391: BLACK,
        dashboardNewLogButtonIconColorV391: BLACK,
        dashboardNewLogButtonBorderColorV391: BLACK,
        dashboardNewLogButtonHoverBackgroundV391: '#eeeeee',
        dashboardNewLogButtonHoverTextColorV391: BLACK,
        dashboardNewLogButtonHoverIconColorV391: BLACK,
        dashboardNewLogButtonHoverBorderColorV391: BLACK,

        dashboardCreateLogIconHoverColorV320: BLACK,
        dashboardCreateLogIconHoverBackgroundV320: '#eeeeee',
        dashboardCreateLogCategoryBackgroundColorV321: WHITE,
        dashboardCreateLogCategoryTextColorV321: BLACK,
        dashboardCreateLogCategoryBorderColorV321: BLACK,
        dashboardCreateLogCategoryHoverBackgroundColorV321: '#eeeeee',
        dashboardCreateLogCategoryHoverTextColorV321: BLACK,
        dashboardCreateLogCategoryHoverBorderColorV321: BLACK,

        // V396: complete Create New Log modal palette. Normal interactive surfaces
        // default to the modal surface so they read as border-only until hover/selection.
        dashboardCreateLogOverlayColorV396: BLACK,
        dashboardCreateLogModalBackgroundColorV396: WHITE,
        dashboardCreateLogModalTextColorV396: BLACK,
        dashboardCreateLogModalBorderColorV396: BLACK,
        dashboardCreateLogTitleColorV396: BLACK,
        dashboardCreateLogLabelColorV396: BLACK,
        dashboardCreateLogInputBackgroundColorV396: WHITE,
        dashboardCreateLogInputTextColorV396: BLACK,
        dashboardCreateLogInputBorderColorV396: BLACK,
        dashboardCreateLogInputHoverBackgroundColorV396: WHITE,
        dashboardCreateLogInputHoverTextColorV396: BLACK,
        dashboardCreateLogInputHoverBorderColorV396: BLACK,
        dashboardCreateLogInputFocusBackgroundColorV396: WHITE,
        dashboardCreateLogInputFocusTextColorV396: BLACK,
        dashboardCreateLogInputFocusBorderColorV396: BLACK,
        dashboardCreateLogIconBackgroundColorV396: WHITE,
        dashboardCreateLogIconColorV396: BLACK,
        dashboardCreateLogIconBorderColorV396: BLACK,
        dashboardCreateLogIconHoverBackgroundColorV396: '#eeeeee',
        dashboardCreateLogIconHoverColorV396: BLACK,
        dashboardCreateLogIconHoverBorderColorV396: BLACK,
        dashboardCreateLogIconSelectedBackgroundColorV396: BLACK,
        dashboardCreateLogIconSelectedColorV396: WHITE,
        dashboardCreateLogIconSelectedBorderColorV396: BLACK,
        dashboardCreateLogButtonBackgroundColorV396: WHITE,
        dashboardCreateLogButtonTextColorV396: BLACK,
        dashboardCreateLogButtonIconColorV396: BLACK,
        dashboardCreateLogButtonBorderColorV396: BLACK,
        dashboardCreateLogButtonHoverBackgroundColorV396: BLACK,
        dashboardCreateLogButtonHoverTextColorV396: WHITE,
        dashboardCreateLogButtonHoverIconColorV396: WHITE,
        dashboardCreateLogButtonHoverBorderColorV396: BLACK,
        dashboardCreateLogCloseBackgroundColorV396: WHITE,
        dashboardCreateLogCloseIconColorV396: BLACK,
        dashboardCreateLogCloseBorderColorV396: BLACK,
        dashboardCreateLogCloseHoverBackgroundColorV396: '#eeeeee',
        dashboardCreateLogCloseHoverIconColorV396: BLACK,
        dashboardCreateLogCloseHoverBorderColorV396: BLACK,

        themeSettingsPlusIconColorV322: BLACK,
        themeSettingsPlusBackgroundColorV322: WHITE,
        themeSettingsPlusBorderColorV322: BLACK,
        themeSettingsPlusHoverIconColorV322: BLACK,
        themeSettingsPlusHoverBackgroundColorV322: '#eeeeee',
        themeSettingsPlusHoverBorderColorV322: BLACK,

        dashboardCategoryBackgroundColorV98: WHITE,
        dashboardCategoryTextColorV98: BLACK,
        dashboardCategoryHoverBackgroundColorV98: WHITE,
        dashboardCategoryHoverTextColorV98: BLACK,
        dashboardCategorySelectedBackgroundColorV98: WHITE,
        dashboardCategorySelectedTextColorV98: BLACK,
        dashboardCategoryBorderColorV98: BLACK,
        dashboardCategoryHoverBorderColorV98: BLACK,
        dashboardCategorySelectedBorderColorV98: BLACK,
        dashboardCategorySelectedColorV85: WHITE,
        dashboardCategoryHoverColorV85: WHITE,
        dashboardCategoryShadowSizeV98: 0,

        tabIconColor: BLACK,
        tabTitleColor: BLACK,
        backButtonColor: BLACK,
        tabNavBackgroundColor: WHITE,
        tabNavIndividualBackgroundColor: WHITE,
        dailyLogBackgroundColor: WHITE,
        contentBackdropColor: WHITE,

        settingsModalBackgroundColorV380: WHITE,
        settingsModalTextColorV380: BLACK,
        settingsModalBorderColorV380: BLACK,
        settingsModalOverlayColorV381: BLACK,
        settingsModalSectionBorderColorV381: BLACK,
        settingsModalMutedTextColorV381: '#666666',
        settingsModalIconColorV381: BLACK,
        settingsModalInputBackgroundColorV380: WHITE,
        settingsModalInputTextColorV380: BLACK,
        settingsModalInputBorderColorV380: BLACK,
        settingsModalCardBackgroundColorV380: WHITE,
        settingsModalCardTextColorV380: BLACK,
        settingsModalCardBorderColorV380: BLACK,
        settingsModalHoverBackgroundColorV380: '#eeeeee',
        settingsModalHoverTextColorV380: BLACK,
        settingsModalSelectedBackgroundColorV380: BLACK,
        settingsModalSelectedTextColorV380: WHITE,
        settingsModalSelectedBorderColorV380: BLACK,
        settingsModalButtonBackgroundColorV380: WHITE,
        settingsModalButtonTextColorV380: BLACK,
        settingsModalButtonBorderColorV380: BLACK,
        settingsWidgetBackgroundColorV380: WHITE,
        settingsWidgetTextColorV380: BLACK,
        settingsWidgetBorderColorV380: BLACK,

        // V394: readable Settings accessory/theme labels + Dashboard context menus.
        settingsCursorNameTextColorV394: BLACK,
        settingsCompanionNameTextColorV394: BLACK,
        settingsThemeNameTextColorV394: BLACK,
        settingsThemeNameHoverTextColorV394: BLACK,
        dashboardContextMenuBackgroundColorV394: WHITE,
        dashboardContextMenuTextColorV394: BLACK,
        dashboardContextMenuBorderColorV394: BLACK,
        dashboardContextMenuHoverBackgroundColorV394: '#eeeeee',
        dashboardContextMenuHoverTextColorV394: BLACK,

        kbCategoryBackgroundColor: WHITE,
        kbCategoryTextColor: BLACK,
        kbCategoryHoverBackgroundColor: WHITE,
        kbCategoryHoverTextColor: BLACK,
        kbCategoryFocusBackgroundColor: WHITE,
        kbCategoryFocusTextColor: BLACK,
        kbCategoryFocusBorderColor: BLACK,
        kbCategoryBorderColorV97: BLACK,
        kbCategoryHoverBorderColorV97: BLACK,
        kbCategoryShadowSizeV97: 0
      });
    }
  } catch {}

  // These objects are merged *after* FEATURE_SUITE_DEFAULT_THEME by the blank
  // theme factory, so neutralize their old lavender/purple defaults as well.
  try {
    if (typeof CUSTOM_THEME_ADVANCED_DEFAULTS_V10 === 'object' && CUSTOM_THEME_ADVANCED_DEFAULTS_V10) {
      CUSTOM_THEME_ADVANCED_DEFAULTS_V10.hoverColor = WHITE;
      CUSTOM_THEME_ADVANCED_DEFAULTS_V10.hoverOpacity = 0;
    }
  } catch {}
  try {
    if (typeof CUSTOM_THEME_V12_DEFAULTS === 'object' && CUSTOM_THEME_V12_DEFAULTS) {
      Object.assign(CUSTOM_THEME_V12_DEFAULTS, {
        kbCategoryBackgroundColor: WHITE,
        kbCategoryTextColor: BLACK,
        kbCategoryHoverBackgroundColor: WHITE,
        kbCategoryHoverTextColor: BLACK
      });
    }
  } catch {}
  try {
    if (typeof CUSTOM_THEME_V15_DEFAULTS === 'object' && CUSTOM_THEME_V15_DEFAULTS) {
      Object.assign(CUSTOM_THEME_V15_DEFAULTS, {
        kbCategoryFocusBackgroundColor: WHITE,
        kbCategoryFocusTextColor: BLACK,
        kbCategoryFocusBorderColor: BLACK
      });
    }
  } catch {}

  window.__loggyNeutralNewThemeDefaultsV288 = true;
})();

/* Loggy V250 — KB/Daily/Theme/Developer integration */
(() => {
  'use strict';
  if (window.__loggyExtrasV250) return;
  window.__loggyExtrasV250 = true;
  const $=(s,r=document)=>r?.querySelector?.(s)||null;
  const $$=(s,r=document)=>Array.from(r?.querySelectorAll?.(s)||[]);
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const hobby=()=>{try{const p=location.pathname.split('/').filter(Boolean);return decodeURIComponent(p[0]==='app'?(p[1]||'log'):(p.pop()||'log'));}catch{return'log'}};
  const save=()=>{try{return typeof saveDb==='function'?saveDb():undefined}catch(e){console.warn('V250 save',e)}};

  function addStyle(){if($('#loggy-v250-style'))return;const s=document.createElement('style');s.id='loggy-v250-style';s.textContent=`
  .v250-switch{display:inline-flex;align-items:center;gap:10px;cursor:pointer;user-select:none;-webkit-user-select:none}.v250-switch>input{position:absolute;opacity:0;pointer-events:none}.v250-switch-track{width:42px;height:24px;border-radius:999px;border:var(--thin-border,1px solid #bbb);background:var(--track-bg,#e9e9e9);position:relative;flex:none;transition:.15s}.v250-switch-track:after{content:'';position:absolute;width:18px;height:18px;left:2px;top:2px;border-radius:50%;background:var(--white,#fff);border:1px solid color-mix(in srgb,var(--black,#111) 18%,transparent);transition:.15s}.v250-switch>input:checked+.v250-switch-track{background:color-mix(in srgb,var(--accent,#222) 24%,var(--white,#fff));border-color:var(--accent,#222)}.v250-switch>input:checked+.v250-switch-track:after{transform:translateX(18px);background:var(--accent,#222)}
  .kb-hide-from-quizzes-row-v59.v250-toggle-row,.kb-enable-parts-row.v250-toggle-row,.daily-logs-setting-toggle-row.v250-toggle-row{display:flex!important;align-items:center!important;justify-content:flex-start!important;gap:10px!important;text-align:left!important}.v250-toggle-copy{display:flex!important;align-items:center!important;gap:0!important;order:1!important;flex:0 0 auto!important}.v250-toggle-copy strong,.v250-toggle-copy label,.v250-toggle-copy .field-label{font-size:1.1rem!important;font-weight:400!important;color:inherit!important;opacity:1!important;line-height:1.2!important;margin:0!important}.v250-toggle-row>.v250-switch{order:2!important;margin:0!important;flex:0 0 auto!important}.kb-hide-from-quizzes-row-v59.v250-toggle-row small{display:none!important}
  #add-item-modal .kb-enable-parts-row.v250-toggle-row,#add-item-modal .kb-hide-from-quizzes-row-v59.v250-toggle-row{width:100%!important;max-width:none!important;align-self:stretch!important;justify-content:flex-start!important;text-align:left!important;margin-left:0!important;margin-right:0!important;box-sizing:border-box!important}#add-item-modal .kb-enable-parts-row.v250-toggle-row>.v250-toggle-copy,#add-item-modal .kb-hide-from-quizzes-row-v59.v250-toggle-row>.v250-toggle-copy{order:1!important;flex:0 0 auto!important;margin:0!important}#add-item-modal .kb-enable-parts-row.v250-toggle-row>.v250-switch,#add-item-modal .kb-hide-from-quizzes-row-v59.v250-toggle-row>.v250-switch{order:2!important;flex:0 0 auto!important;margin:0!important}
  .kb-v250-field-kinds{display:flex;flex-wrap:wrap;gap:10px}.kb-v250-extra-panel{display:grid;gap:10px}.kb-v250-extra-panel.hidden{display:none!important}.kb-v250-live{padding:10px 12px;border:var(--thin-border);border-radius:10px;background:var(--track-bg,#fafafa);min-height:42px}.kb-v250-drop{border:1px dashed color-mix(in srgb,var(--black,#111) 35%,transparent);border-radius:12px;padding:18px;text-align:center;cursor:pointer;background:color-mix(in srgb,var(--white,#fff) 95%,var(--black,#111));display:grid;gap:5px}.kb-v250-drop.drag{outline:2px solid var(--accent,#222);outline-offset:2px}.kb-v250-attachment{display:flex;align-items:center;justify-content:space-between;gap:10px;border:var(--thin-border);border-radius:10px;padding:10px 12px}.kb-v250-attachment a{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:inherit}.kb-v250-date-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}.kb-v250-date-grid.single{grid-template-columns:1fr}.kb-v250-boolean-display{display:inline-flex;align-items:center;gap:8px;font-weight:700}.kb-v250-dot{width:10px;height:10px;border-radius:50%;background:#aaa}.kb-v250-boolean-display.on .kb-v250-dot{background:#2f9d59}.kb-v250-math{font-family:'Times New Roman',serif;font-size:1.08em;line-height:1.55;overflow:auto}.kb-v250-frac{display:inline-grid;grid-template-rows:auto auto;vertical-align:middle;text-align:center;line-height:1.05;margin:0 .15em}.kb-v250-frac>span:first-child{border-bottom:1px solid currentColor;padding:0 .15em}.kb-v250-sqrt{white-space:nowrap}.kb-v250-sup{vertical-align:super;font-size:.75em}.kb-v250-sub{vertical-align:sub;font-size:.75em}.kb-v250-math-display{display:block;text-align:center;padding:10px 12px;margin:6px 0;font-size:1.15em}
  #settings-modal #kb-polaroid-options-v163.v250-non-polaroid-hidden{display:none!important}
  .developer-mode-actions:empty{display:none!important}.v250-hide-plus{display:none!important}
  #grid-view.view.active #days-grid .daily-add-day-slot-v238.v251-hide-final-plus,#grid-view.view.active #days-grid .daily-add-day-slot-v238.v251-hide-final-plus>.day-box,#grid-view.view.active #days-grid>.day-box.v251-hide-final-plus,#grid-view.view.active #days-grid>.polaroid-card.v251-hide-final-plus{display:none!important;visibility:hidden!important;pointer-events:none!important}
  #grid-view.view.active #days-grid[data-final-active-page-v257="0"] .daily-add-day-slot-v238,#grid-view.view.active #days-grid[data-final-active-page-v257="0"]>.day-box[title="Add extra log day"],#grid-view.view.active #days-grid[data-final-active-page-v257="0"]>.polaroid-card[title="Add extra log day"]{display:none!important;visibility:hidden!important;pointer-events:none!important}
  #phrase-modal .kb-display-field{display:grid!important;grid-template-columns:minmax(130px,155px) minmax(0,1fr)!important;align-items:start!important;column-gap:16px!important;padding:9px 0!important;margin:0!important;border:0!important;border-radius:0!important;background:transparent!important;box-shadow:none!important;min-height:0!important;height:auto!important}#phrase-modal .kb-display-field+.kb-display-field{border-top:1px solid color-mix(in srgb,var(--black,#111) 10%,transparent)!important}#phrase-modal .kb-display-field .kb-item-field-label-row{margin:0!important;min-height:0!important;align-self:start!important}#phrase-modal .kb-display-field .field-label{font-size:1rem!important;font-weight:800!important;opacity:.72!important;line-height:1.25!important}#phrase-modal .kb-display-field .kb-display-text,#phrase-modal .kb-display-field .kb-v250-live{padding:0!important;margin:0!important;border:0!important;background:transparent!important;min-height:0!important;height:auto!important;line-height:1.35!important;align-self:start!important}#phrase-modal .kb-display-audio-btn{display:none!important}@media(max-width:620px){#phrase-modal .kb-display-field{grid-template-columns:1fr!important;row-gap:3px!important;padding:8px 0!important}}
  .custom-tab-component .custom-component-title-toggle-v245{position:static!important;width:30px!important;height:30px!important;min-width:30px!important;min-height:30px!important;padding:0!important;margin:0!important;border:0!important;border-radius:6px!important;box-shadow:none!important;background:transparent!important;font-size:16px!important;display:inline-grid!important;place-items:center!important}.custom-tab-component .custom-component-title-toggle-v245:hover{background:color-mix(in srgb,currentColor 8%,transparent)!important}.custom-tab-component .custom-component-title-toggle-v245 i{font-size:16px!important}
  #daily-log-collection-settings-modal .daily-collection-save{width:auto!important;min-width:0!important;min-height:42px!important;padding:10px 16px!important;display:inline-flex!important;align-items:center!important;justify-content:center!important;gap:7px!important}
  .daily-collection-grid{display:grid!important;grid-template-columns:repeat(auto-fit,minmax(190px,1fr))!important;grid-auto-rows:min-content!important;align-items:start!important;gap:12px!important}.daily-collection-card{height:auto!important;min-height:0!important;align-self:start!important;padding:12px!important}.daily-collection-card-body{height:auto!important;min-height:0!important;display:block!important}.daily-collection-card[data-daily-kind=audio]{min-height:0!important}.daily-collection-card[data-daily-kind=audio] .daily-collection-card-body{padding-top:6px!important}.daily-collection-audio{width:100%!important;height:34px!important;display:block!important}.daily-collection-text{margin:5px 0 0!important;min-height:0!important;white-space:pre-wrap!important}.daily-collection-knowledge{min-height:36px!important;height:auto!important}.daily-collection-image{height:auto!important;max-height:360px!important;object-fit:contain!important}.daily-collection-video{aspect-ratio:16/9!important;height:auto!important}.daily-collection-pdf{height:260px!important}
  /* V254: Daily Logs switches use a centered black knob that stays inside the track. */
  .daily-logs-setting-toggle-row .v250-switch-track{box-sizing:border-box!important;width:42px!important;height:24px!important}
  .daily-logs-setting-toggle-row .v250-switch-track:after{box-sizing:border-box!important;width:16px!important;height:16px!important;left:3px!important;top:3px!important;background:#111!important;border:0!important}
  .daily-logs-setting-toggle-row .v250-switch>input:checked+.v250-switch-track:after{transform:translateX(18px)!important;background:#111!important}
  /* V254: KB option selection is represented by an underline, never an icon-color swap. */
  #kb-field-create-modal-v221 .kb-field-pronunciation-v221,#kb-field-create-modal-v221 .kb-field-quiz-v221,#kb-field-create-modal-v221 .kb-field-editable-v221{color:inherit!important;border-bottom:2px solid transparent!important;border-radius:0!important;background:transparent!important;box-shadow:none!important}
  #kb-field-create-modal-v221 .kb-field-pronunciation-v221.selected,#kb-field-create-modal-v221 .kb-field-quiz-v221.selected,#kb-field-create-modal-v221 .kb-field-editable-v221.selected{color:inherit!important;border-bottom-color:currentColor!important;background:transparent!important;box-shadow:none!important}
  #kb-field-create-modal-v221 .kb-field-pronunciation-v221 i,#kb-field-create-modal-v221 .kb-field-quiz-v221 i,#kb-field-create-modal-v221 .kb-field-editable-v221 i{color:inherit!important;stroke:currentColor!important}
  #kb-field-create-modal-v221 .kb-clean-icon-option,#kb-field-create-modal .kb-clean-icon-option{color:inherit!important;border-bottom:2px solid transparent!important;border-radius:0!important;box-shadow:none!important}
  #kb-field-create-modal-v221 .kb-clean-icon-option,#kb-field-create-modal .kb-clean-icon-option{opacity:1!important;color:var(--black)!important;background:transparent!important;box-shadow:none!important;border-bottom:2px solid transparent!important}#kb-field-create-modal-v221 .kb-clean-icon-option i,#kb-field-create-modal .kb-clean-icon-option i{opacity:.58!important;color:inherit!important}#kb-field-create-modal-v221 .kb-clean-icon-option.selected,#kb-field-create-modal .kb-clean-icon-option.selected{color:var(--black)!important;opacity:1!important;border-bottom:2px solid var(--black)!important;background:transparent!important;box-shadow:none!important}#kb-field-create-modal-v221 .kb-clean-icon-option.selected i,#kb-field-create-modal .kb-clean-icon-option.selected i{opacity:.58!important;color:inherit!important}
  #kb-field-create-modal-v221 .kb-clean-icon-option i,#kb-field-create-modal .kb-clean-icon-option i{color:inherit!important;stroke:currentColor!important}
  /* V254: nested Dropdown components do not receive an extra wrapper card/border. */
  .custom-component-dropdownV239 .dropdown-child-borderless-v254,.custom-component-dropdownV239 .custom-component-content .custom-tab-component:not(.custom-component-dropdownV239),.custom-component-dropdownV239 .custom-component-content [class*="dropdown-child"],.custom-component-dropdownV239 .custom-component-content [class*="nested-component"]{border:0!important;outline:0!important;box-shadow:none!important;background:transparent!important;padding:0!important}
  .custom-component-dropdownV239 .custom-component-content{position:relative!important;user-select:none!important;-webkit-user-select:none!important}.custom-component-dropdownV239 .custom-component-content input,.custom-component-dropdownV239 .custom-component-content textarea,.custom-component-dropdownV239 .custom-component-content select,.custom-component-dropdownV239 .custom-component-content [contenteditable="true"]{user-select:text!important;-webkit-user-select:text!important}
  .custom-component-dropdownV239 .dropdown-add-plus-v254{float:right!important;clear:both!important;width:32px!important;height:32px!important;min-width:32px!important;min-height:32px!important;margin:10px 0 0 auto!important;padding:0!important;display:none!important;place-items:center!important;border-radius:8px!important}
  .custom-component-dropdownV239 .dropdown-add-plus-v254.dropdown-add-visible-v255{display:grid!important}
  .custom-component-dropdownV239 .dropdown-add-plus-v254 i{margin:0!important;font-size:17px!important}
  .custom-card-grid.custom-card-style-vertical{grid-template-columns:repeat(auto-fill,minmax(180px,220px))!important}.custom-card-style-vertical .custom-user-card{min-height:260px!important}
  .custom-card-grid.custom-card-style-horizontal{grid-template-columns:repeat(auto-fill,minmax(300px,1fr))!important}.custom-card-style-horizontal .custom-user-card{min-height:130px!important}
  .custom-card-grid.custom-card-style-square{grid-template-columns:repeat(auto-fill,minmax(190px,1fr))!important}.custom-card-style-square .custom-user-card{aspect-ratio:1/1!important;overflow:auto!important}
  .custom-card-grid.custom-card-style-compact{grid-template-columns:repeat(auto-fill,minmax(170px,1fr))!important}.custom-card-style-compact .custom-user-card{min-height:0!important;padding:10px!important}
  .custom-card-grid.custom-card-style-wide{grid-template-columns:repeat(auto-fill,minmax(360px,1fr))!important}.custom-card-style-wide .custom-user-card{min-height:150px!important}
  .custom-card-style-rounded .custom-user-card{border-radius:24px!important}.custom-card-style-borderless .custom-user-card{border:0!important;box-shadow:0 8px 22px rgba(0,0,0,.09)!important}.custom-card-style-index-card .custom-user-card{background-image:repeating-linear-gradient(to bottom,transparent 0,transparent 27px,color-mix(in srgb,currentColor 12%,transparent) 28px)!important}
  .custom-polaroid-grid.custom-polaroid-layout-square{grid-template-columns:repeat(auto-fill,minmax(210px,1fr))!important}.custom-polaroid-layout-square .custom-user-polaroid{aspect-ratio:1/1!important}.custom-polaroid-layout-square .custom-polaroid-media{aspect-ratio:1/1!important}
  .custom-polaroid-grid.custom-polaroid-layout-mini{grid-template-columns:repeat(auto-fill,minmax(145px,1fr))!important}.custom-polaroid-layout-mini .custom-user-polaroid{padding:8px!important}.custom-polaroid-grid.custom-polaroid-layout-wide{grid-template-columns:repeat(auto-fill,minmax(340px,1fr))!important}.custom-polaroid-layout-wide .custom-polaroid-media{aspect-ratio:16/9!important}.custom-polaroid-layout-rounded .custom-user-polaroid{border-radius:22px!important;overflow:hidden!important}.custom-polaroid-layout-borderless .custom-user-polaroid{border:0!important;box-shadow:0 8px 22px rgba(0,0,0,.09)!important}.custom-polaroid-layout-scrapbook .custom-user-polaroid:nth-child(odd){transform:rotate(-1.4deg)!important}.custom-polaroid-layout-scrapbook .custom-user-polaroid:nth-child(even){transform:rotate(1.4deg)!important}
  .custom-component-dropdownV239 .custom-component-content:after{content:'';display:block;clear:both}
  `;document.head.appendChild(s)}
  addStyle();

  function renderMathExpressionV250(raw){
    let t=esc(String(raw||''));
    const greek={alpha:'α',beta:'β',gamma:'γ',delta:'δ',epsilon:'ε',theta:'θ',lambda:'λ',mu:'μ',pi:'π',rho:'ρ',sigma:'σ',phi:'φ',omega:'ω',Delta:'Δ',Sigma:'Σ',Omega:'Ω'};
    t=t.replace(/\\(alpha|beta|gamma|delta|epsilon|theta|lambda|mu|pi|rho|sigma|phi|omega|Delta|Sigma|Omega)\b/g,(_,k)=>greek[k]||k);
    t=t.replace(/\\frac\{([^{}]*)\}\{([^{}]*)\}/g,'<span class="kb-v250-frac"><span>$1</span><span>$2</span></span>');
    t=t.replace(/\\sqrt\{([^{}]*)\}/g,'<span class="kb-v250-sqrt">√($1)</span>');
    t=t.replace(/\^\{([^{}]+)\}|\^([A-Za-z0-9+-]+)/g,(_,a,b)=>`<span class="kb-v250-sup">${a||b}</span>`);
    t=t.replace(/_\{([^{}]+)\}|_([A-Za-z0-9+-]+)/g,(_,a,b)=>`<span class="kb-v250-sub">${a||b}</span>`);
    t=t.replace(/\\(times|cdot|pm|leq|geq|neq|infty)\b/g,(_,k)=>({times:'×',cdot:'·',pm:'±',leq:'≤',geq:'≥',neq:'≠',infty:'∞'}[k]));
    return t;
  }
  function renderLatex(raw){
    const source=String(raw||'');
    if(!source)return '<span class="kb-v250-math"><span style="opacity:.55">Math preview</span></span>';
    // $$...$$ is a display equation. $...$ can be mixed with ordinary inline text.
    if(/^\s*\$\$[\s\S]*\$\$\s*$/.test(source)){
      const inner=source.trim().slice(2,-2);
      return `<div class="kb-v250-math kb-v250-math-display">${renderMathExpressionV250(inner)}</div>`;
    }
    if(source.includes('$')){
      const parts=source.split(/(\$\$[\s\S]*?\$\$|\$[^$\n]+\$)/g).filter(Boolean);
      return parts.map(part=>{
        if(part.startsWith('$$')&&part.endsWith('$$'))return `<div class="kb-v250-math kb-v250-math-display">${renderMathExpressionV250(part.slice(2,-2))}</div>`;
        if(part.startsWith('$')&&part.endsWith('$'))return `<span class="kb-v250-math">${renderMathExpressionV250(part.slice(1,-1))}</span>`;
        return `<span>${esc(part)}</span>`;
      }).join('');
    }
    return `<span class="kb-v250-math">${renderMathExpressionV250(source)}</span>`;
  }
  window.renderLoggyLatexV250=renderLatex;

  // 1) Polaroid settings only exist visually while Polaroid Grid is selected.
  function syncKbPolaroidConditional(){const box=$('#kb-polaroid-options-v163');if(!box)return;const isPolaroid=String(window.db?.settings?.libraryView||'list')==='polaroid';box.classList.toggle('v250-non-polaroid-hidden',!isPolaroid)}
  document.addEventListener('click',e=>{if(e.target.closest?.('.kb-view-btn,#open-settings-btn,#settings-btn,#settings-category-tabs'))requestAnimationFrame(syncKbPolaroidConditional)},true);
  document.addEventListener('change',e=>{if(e.target.closest?.('#settings-modal'))requestAnimationFrame(syncKbPolaroidConditional)},true);
  setTimeout(syncKbPolaroidConditional,0);

  // 2/3/7) convert requested checkboxes to app-styled switches; remove quiz helper copy.
  function toggleify(input,labelText){
    if(!input||input.dataset.v250Toggle)return;
    input.dataset.v250Toggle='1';
    const row=input.closest('label,.modal-section')||input.parentElement;if(!row)return;
    row.classList.add('v250-toggle-row');
    if(input.id==='add-item-enable-parts')row.classList.add('kb-enable-parts-row');
    let label=row.querySelector(`label[for="${CSS.escape(input.id||'')}"] ,.field-label,strong`);
    if(labelText&&label)label.textContent=labelText;
    if(String(input.id||'').includes('hide-from-quizzes')) row.querySelectorAll('small').forEach(x=>x.remove());
    const nestedLabel=row.tagName==='LABEL';
    const control=document.createElement(nestedLabel?'span':'label');
    control.className='v250-switch';control.setAttribute('aria-label',labelText||'Toggle');
    if(nestedLabel){control.tabIndex=0;control.setAttribute('role','switch');control.setAttribute('aria-checked',String(!!input.checked));}
    input.insertAdjacentElement('beforebegin',control);control.append(input);
    const track=document.createElement('span');track.className='v250-switch-track';control.append(track);
    if(nestedLabel){
      const toggle=()=>{input.checked=!input.checked;control.setAttribute('aria-checked',String(input.checked));input.dispatchEvent(new Event('change',{bubbles:true}))};
      control.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();toggle()});
      control.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();toggle()}});
      input.addEventListener('change',()=>control.setAttribute('aria-checked',String(input.checked)));
    }
    if(label&&label!==control&&!label.closest('.v250-toggle-copy')){const copy=document.createElement('div');copy.className='v250-toggle-copy';label.parentNode.insertBefore(copy,label);copy.append(label)}
  }
  function syncToggles(){toggleify($('#add-item-enable-parts'),'Enable Parts');toggleify($('#edit-item-enable-parts'),'Enable Parts');toggleify($('#kb-hide-from-quizzes-v59'),'Hide from quizzes');toggleify($('#edit-kb-hide-from-quizzes-v59'),'Hide from quizzes');toggleify($('#daily-logs-show-search-toggle'),'Hide Daily Logs Search');toggleify($('#daily-logs-hide-global-search-toggle'),'Hide Global Search')}
  setTimeout(syncToggles,100);
  try{const beforeAddFieldsV250=renderAddKnowledgeFields;renderAddKnowledgeFields=function(){const r=beforeAddFieldsV250.apply(this,arguments);requestAnimationFrame(syncToggles);return r}}catch{}
  try{const beforeEditFieldsV250=renderKnowledgeEditFields;renderKnowledgeEditFields=function(){const r=beforeEditFieldsV250.apply(this,arguments);requestAnimationFrame(syncToggles);return r}}catch{}
  try{const beforeDailySettingsV250=ensureDailyLogsSettingsModal;ensureDailyLogsSettingsModal=function(){const r=beforeDailySettingsV250.apply(this,arguments);requestAnimationFrame(syncToggles);return r}}catch{}
  document.addEventListener('click',e=>{if(e.target.closest?.('#add-item-modal,#phrase-modal,#daily-logs-local-settings-modal,#open-daily-settings-btn'))requestAnimationFrame(syncToggles)},true);

  // 4) Extend KB field model + editor with five additional kinds.
  const EXTRA_KINDS=new Set(['latex','attachment','numberFormat','dateTime','boolean']);
  function addKindButtons(modal){
    if(!modal)return;
    const safe=modal.id==='kb-field-safe-modal-v221';
    const host=modal.querySelector(safe?'.kb-field-kinds-v221':'#kb-field-create-kind .kb-field-modal-icons, #kb-field-create-kind')||modal.querySelector('.kb-field-modal-icons');
    if(!host)return;
    if(modal.dataset.v250Kinds==='1' && host.querySelector(safe?'[data-kind-v221=\"latex\"]':'[data-kind=\"latex\"]'))return;
    modal.dataset.v250Kinds='1';host.classList.add('kb-v250-field-kinds');
    const defs=[['latex','ph-function','LaTeX / Math'],['attachment','ph-paperclip','File Attachment'],['numberFormat','ph-currency-dollar','Number / Currency / Percent'],['dateTime','ph-calendar-dots','Date & Time / Date Range'],['boolean','ph-toggle-right','Boolean Toggle']];
    for(const [kind,icon,label] of defs){
      if(host.querySelector(safe?`[data-kind-v221=\"${kind}\"]`:`[data-kind=\"${kind}\"]`))continue;
      const b=document.createElement('button');b.type='button';b.className='kb-clean-icon-option';
      if(safe)b.dataset.kindV221=kind;else b.dataset.kind=kind;
      b.dataset.tip=label;b.title=label;b.setAttribute('aria-label',label);b.innerHTML=`<i class="ph ${icon}"></i>`;host.appendChild(b);
      b.addEventListener('click',()=>{
        if(safe&&modal.__kbFieldStateV221)modal.__kbFieldStateV221.kind=kind;
        if(!safe){try{pendingKnowledgeFieldKind=kind}catch{}try{window.pendingKnowledgeFieldKind=kind}catch{}}
        modal.querySelectorAll(safe?'[data-kind-v221]':'[data-kind]').forEach(x=>x.classList.toggle('selected',x===b));
        modal.dataset.v250Hydrated='';syncFieldExtras(modal);hydrateFieldExtras(modal);
      });
    }
    host.querySelectorAll(safe?'[data-kind-v221]':'[data-kind]').forEach(button=>{
      const value=safe?button.dataset.kindV221:button.dataset.kind;
      if(!EXTRA_KINDS.has(value)||button.dataset.v250KindBound==='1')return;
      button.dataset.v250KindBound='1';
      button.addEventListener('click',()=>{
        if(safe&&modal.__kbFieldStateV221)modal.__kbFieldStateV221.kind=value;
        if(!safe){try{pendingKnowledgeFieldKind=value}catch{}try{window.pendingKnowledgeFieldKind=value}catch{}}
        modal.dataset.v250Hydrated='';
        syncFieldExtras(modal);
        hydrateFieldExtras(modal);
      });
    });
    const panel=document.createElement('div');panel.className='modal-section kb-v250-extra-panel';panel.innerHTML=`
      <div class="kb-v250-number-options hidden" data-v250-panel="numberFormat"><span class="field-label">Number Formatting</span><div style="display:grid;grid-template-columns:1fr 1fr;gap:10px"><select data-v250-number-style><option value="number">Number</option><option value="currency">Currency</option><option value="percent">Percentage</option></select><input data-v250-decimals type="number" min="0" max="8" value="2" placeholder="Decimals"></div><input data-v250-symbol placeholder="Currency symbol (e.g. $, €, ¥)"></div>
      <div class="kb-v250-date-options hidden" data-v250-panel="dateTime"><span class="field-label">Default Date Mode</span><div class="set-size-picker"><button type="button" class="filter-tab" data-v250-date-mode="single">Single Date / Time</button><button type="button" class="filter-tab" data-v250-date-mode="range">Date Range</button></div></div>
      <div class="kb-v250-file-options hidden" data-v250-panel="attachment"><span class="field-label">Accepted Files</span><p class="progress-hint" style="margin:0">PDFs, CSV/data files, spreadsheets, text files, archives, and other raw attachments up to 60 MB.</p></div>
      <div class="kb-v250-latex-options hidden" data-v250-panel="latex"><span class="field-label">Math Field</span><p class="progress-hint" style="margin:0">Supports common LaTeX such as \frac{}, \sqrt{}, Greek symbols, superscripts, and subscripts.</p></div>
      <div class="kb-v250-bool-options hidden" data-v250-panel="boolean"><span class="field-label">Boolean Field</span><p class="progress-hint" style="margin:0">Stores a strict true/false status and renders as an on/off switch.</p></div>`;
    const saveBtn=modal.querySelector(safe?'.kb-field-save-v221':'#kb-field-create-save');saveBtn?.insertAdjacentElement('beforebegin',panel);
    panel.querySelectorAll('[data-v250-date-mode]').forEach(b=>b.onclick=()=>{panel.dataset.dateMode=b.dataset.v250DateMode;panel.querySelectorAll('[data-v250-date-mode]').forEach(x=>x.classList.toggle('active',x===b))});panel.querySelector('[data-v250-date-mode="single"]')?.click();
    // Snapshot the extended field configuration before the older save handler runs.
    // The legacy modal also saves when Enter is pressed in the name input, so that
    // path must snapshot/apply the V250 properties too.
    saveBtn?.addEventListener('pointerdown',()=>snapshotFieldExtras(modal),true);
    saveBtn?.addEventListener('click',()=>setTimeout(()=>applyFieldExtras(modal),0));
    const nameInput=modal.querySelector(safe?'.kb-field-name-v221':'#kb-field-create-name');
    nameInput?.addEventListener('keydown',e=>{
      if(e.key!=='Enter')return;
      snapshotFieldExtras(modal);
      setTimeout(()=>applyFieldExtras(modal),0);
    },true);
    const selectedKind=currentFieldKind(modal);
    modal.querySelectorAll(safe?'[data-kind-v221]':'[data-kind]').forEach(button=>{
      const value=safe?button.dataset.kindV221:button.dataset.kind;
      button.classList.toggle('selected',value===selectedKind);
    });
    syncFieldExtras(modal);
  }
  function currentFieldKind(modal){if(modal.id==='kb-field-safe-modal-v221')return modal.__kbFieldStateV221?.kind||'text';const sel=modal.querySelector('[data-kind].selected');if(sel?.dataset.kind)return sel.dataset.kind;try{return pendingKnowledgeFieldKind||'text'}catch{return window.pendingKnowledgeFieldKind||'text'}}
  function syncFieldExtras(modal){if(!modal)return;const kind=currentFieldKind(modal);modal.querySelectorAll('[data-v250-panel]').forEach(p=>p.classList.toggle('hidden',p.dataset.v250Panel!==kind));}
  function hydrateFieldExtras(modal){
    if(!modal)return;const kind=currentFieldKind(modal);let category='',editingId='';
    if(modal.id==='kb-field-safe-modal-v221'){category=String(modal.__kbFieldStateV221?.category||'');editingId=String(modal.__kbFieldStateV221?.editingId||'')}
    else{try{category=String(activeCategorySettingTab||'');editingId=String(editingKnowledgeFieldId||'')}catch{}}
    const token=`${category}|${editingId}|${kind}`;if(modal.dataset.v250Hydrated===token)return;modal.dataset.v250Hydrated=token;
    let field=null;try{field=getCategoryConfig(category)?.fields?.find(x=>String(x?.id||'')===editingId)||null}catch{}
    const panel=modal.querySelector('.kb-v250-extra-panel');if(!panel)return;
    const style=panel.querySelector('[data-v250-number-style]'),dec=panel.querySelector('[data-v250-decimals]'),symbol=panel.querySelector('[data-v250-symbol]');
    if(style)style.value=['number','currency','percent'].includes(field?.numberStyle)?field.numberStyle:'number';if(dec)dec.value=String(Math.max(0,Math.min(8,Number(field?.decimals??2))));if(symbol)symbol.value=String(field?.currencySymbol||'$');
    const dateMode=field?.dateMode==='range'?'range':'single';panel.dataset.dateMode=dateMode;panel.querySelectorAll('[data-v250-date-mode]').forEach(b=>b.classList.toggle('active',b.dataset.v250DateMode===dateMode));
  }
  function snapshotFieldExtras(modal){const kind=currentFieldKind(modal);const name=String(modal.querySelector(modal.id==='kb-field-safe-modal-v221'?'.kb-field-name-v221':'#kb-field-create-name')?.value||'').trim();let category='';try{category=modal.__kbFieldStateV221?.category||activeCategorySettingTab||''}catch{}const panel=modal.querySelector('.kb-v250-extra-panel');modal.__v250Snapshot={kind,name,category,editingId:modal.__kbFieldStateV221?.editingId||window.editingKnowledgeFieldId||'',numberStyle:panel?.querySelector('[data-v250-number-style]')?.value||'number',decimals:Number(panel?.querySelector('[data-v250-decimals]')?.value||2),symbol:panel?.querySelector('[data-v250-symbol]')?.value||'',dateMode:panel?.dataset.dateMode||'single'} }
  function applyFieldExtras(modal){const snap=modal.__v250Snapshot;if(!snap||!EXTRA_KINDS.has(snap.kind)||!snap.name)return;try{const cfg=getCategoryConfig(snap.category||activeCategorySettingTab);const f=cfg?.fields?.find(x=>String(x?.id||'')===String(snap.editingId||''))||cfg?.fields?.slice().reverse().find(x=>x?.name===snap.name&&x?.kind===snap.kind);if(!f)return;if(snap.kind==='numberFormat'){f.numberStyle=snap.numberStyle;f.decimals=Math.max(0,Math.min(8,snap.decimals||0));f.currencySymbol=snap.symbol||'$'}if(snap.kind==='dateTime')f.dateMode=snap.dateMode==='range'?'range':'single';save();renderSettings?.()}catch(e){console.warn('V250 field extras',e)}}
  function observeFieldModal(){['#kb-field-safe-modal-v221','#kb-field-create-modal'].forEach(sel=>{const m=$(sel);if(m){addKindButtons(m);syncFieldExtras(m);if(!m.classList.contains('hidden'))hydrateFieldExtras(m)}})}
  window.addEventListener('click',e=>{if(e.target.closest?.('#add-cat-field-btn,#settings-cat-fields-list,.kb-field-add-btn-v221,#settings-modal'))setTimeout(observeFieldModal,0)},true);
  document.addEventListener('click',e=>{if(e.target.closest?.('#settings-modal,#kb-field-safe-modal-v221,#kb-field-create-modal,.custom-context-menu,.context-menu'))setTimeout(observeFieldModal,0)},true);setTimeout(observeFieldModal,250);

  function parseAttachment(v){try{const o=JSON.parse(String(v||''));return o&&o.__loggyKbAttachmentV250?o:null}catch{return null}}
  function formatNumber(field,v){const n=Number(v);if(!Number.isFinite(n))return String(v||'');const d=Math.max(0,Math.min(8,Number(field?.decimals??2)));if(field?.numberStyle==='percent')return `${(n*100).toFixed(d)}%`;if(field?.numberStyle==='currency')return `${field?.currencySymbol||'$'}${n.toLocaleString(undefined,{minimumFractionDigits:d,maximumFractionDigits:d})}`;return n.toLocaleString(undefined,{minimumFractionDigits:d,maximumFractionDigits:d})}
  function newFieldInput(field,value='',mode='add'){const cls=mode==='edit'?'dynamic-edit-field':'dynamic-add-field',key=esc(field.name),safe=String(value??'');if(field.kind==='latex')return `<div class="modal-section mt-10 kb-item-field" data-field-id="${esc(field.id)}"><div class="kb-item-field-label-row"><span class="field-label">${esc(field.name)}</span></div><textarea class="${cls} kb-v250-latex-input" data-key="${key}" placeholder="\\frac{a}{b} + x^2">${esc(safe)}</textarea><div class="kb-v250-live kb-v250-latex-preview">${renderLatex(safe)}</div></div>`;
    if(field.kind==='attachment'){const a=parseAttachment(safe);return `<div class="modal-section mt-10 kb-item-field" data-field-id="${esc(field.id)}"><div class="kb-item-field-label-row"><span class="field-label">${esc(field.name)}</span></div><input type="hidden" class="${cls} kb-v250-attachment-value" data-key="${key}" value="${esc(safe)}"><div class="kb-v250-drop" tabindex="0"><i class="ph ph-file-arrow-up" style="font-size:24px"></i><strong>${a?esc(a.name):'Drop a file here or click to browse'}</strong><small>${a?'Click to replace':'PDF, CSV, spreadsheet, dataset, archive, or document'}</small></div><input type="file" class="kb-v250-attachment-file hidden"></div>`}
    if(field.kind==='numberFormat')return `<div class="modal-section mt-10 kb-item-field" data-field-id="${esc(field.id)}"><div class="kb-item-field-label-row"><span class="field-label">${esc(field.name)}</span></div><input type="number" step="any" inputmode="decimal" class="${cls} kb-v250-number" data-key="${key}" value="${esc(safe)}" placeholder="0"><div class="kb-v250-live kb-v250-number-preview">${esc(formatNumber(field,safe))}</div></div>`;
    if(field.kind==='dateTime'){let o={mode:field.dateMode==='range'?'range':'single',start:'',end:''};try{const p=JSON.parse(safe);if(p&&typeof p==='object')o={...o,...p};else if(safe)o.start=safe}catch{if(safe)o.start=safe}return `<div class="modal-section mt-10 kb-item-field" data-field-id="${esc(field.id)}"><div class="kb-item-field-label-row"><span class="field-label">${esc(field.name)}</span></div><input type="hidden" class="${cls} kb-v250-date-value" data-key="${key}" value="${esc(JSON.stringify(o))}"><div class="set-size-picker kb-v250-date-mode"><button type="button" class="filter-tab ${o.mode!=='range'?'active':''}" data-mode="single">Single</button><button type="button" class="filter-tab ${o.mode==='range'?'active':''}" data-mode="range">Range</button></div><div class="kb-v250-date-grid ${o.mode!=='range'?'single':''}"><input type="datetime-local" data-date-start value="${esc(o.start)}"><input type="datetime-local" data-date-end value="${esc(o.end)}" ${o.mode!=='range'?'style="display:none"':''}></div></div>`}
    if(field.kind==='boolean'){const on=String(safe)==='true'||safe===true;return `<div class="modal-section mt-10 kb-item-field" data-field-id="${esc(field.id)}"><div class="kb-item-field-label-row"><span class="field-label">${esc(field.name)}</span></div><input type="hidden" class="${cls} kb-v250-bool-value" data-key="${key}" value="${on?'true':'false'}"><label class="v250-switch"><input type="checkbox" class="kb-v250-bool-control" ${on?'checked':''}><span class="v250-switch-track"></span><span>${on?'On':'Off'}</span></label></div>`}
    return ''}
  try{const oldBuild=buildKnowledgeFieldInputHtml;buildKnowledgeFieldInputHtml=function(field,value='',mode='add'){return EXTRA_KINDS.has(field?.kind)?newFieldInput(field,value,mode):oldBuild.apply(this,arguments)}}catch{}
  try{const oldDisplay=buildKnowledgeFieldDisplayHtml;buildKnowledgeFieldDisplayHtml=function(field,value=''){if(!EXTRA_KINDS.has(field?.kind))return oldDisplay.apply(this,arguments);let content='';const safe=String(value??'');if(field.kind==='latex')content=`<div class="kb-v250-live">${renderLatex(safe)}</div>`;else if(field.kind==='attachment'){const a=parseAttachment(safe);content=a?`<div class="kb-v250-attachment"><a href="${esc(a.url||a.src||'#')}" target="_blank" rel="noopener"><i class="ph ph-paperclip"></i> ${esc(a.name||'Attachment')}</a><small>${a.size?Math.round(a.size/1024)+' KB':''}</small></div>`:'<div class="kb-display-empty">Not added</div>'}else if(field.kind==='numberFormat')content=`<div class="kb-display-text">${esc(formatNumber(field,safe))}</div>`;else if(field.kind==='dateTime'){let o;try{o=JSON.parse(safe)}catch{o={start:safe}};const fmt=x=>x?new Date(x).toLocaleString():'—';content=`<div class="kb-display-text">${esc(fmt(o?.start))}${o?.mode==='range'?` → ${esc(fmt(o?.end))}`:''}</div>`}else if(field.kind==='boolean'){const on=safe==='true';content=`<div class="kb-v250-boolean-display ${on?'on':''}"><span class="kb-v250-dot"></span>${on?'On':'Off'}</div>`}return `<div class="modal-section mt-10 kb-item-field kb-display-field"><div class="kb-item-field-label-row"><span class="field-label">${esc(field.name)}</span></div>${content}</div>`}}catch{}
  async function uploadAttachment(file){const q=new URLSearchParams({fileName:file.name||'attachment',mime:file.type||'application/octet-stream'});const r=await fetch(`/api/kb-attachment-raw/${encodeURIComponent(hobby())}?${q}`,{method:'POST',headers:{'Content-Type':'application/octet-stream'},body:file});const j=await r.json().catch(()=>null);if(!r.ok||!j?.attachment)throw new Error(j?.message||'Upload failed');return j.attachment}
  function bindExtraFields(container,category,mode,itemId){if(!container)return;const defs=typeof getKnowledgeFieldDefs==='function'?getKnowledgeFieldDefs(category):[];container.querySelectorAll('.kb-v250-latex-input').forEach(input=>{const preview=input.closest('.kb-item-field')?.querySelector('.kb-v250-latex-preview');input.addEventListener('input',()=>{if(preview)preview.innerHTML=renderLatex(input.value)})});container.querySelectorAll('.kb-v250-number').forEach(input=>{const f=defs.find(x=>x.name===input.dataset.key),preview=input.closest('.kb-item-field')?.querySelector('.kb-v250-number-preview');const sync=()=>{if(preview)preview.textContent=formatNumber(f,input.value)};input.addEventListener('input',sync);sync()});container.querySelectorAll('.kb-v250-bool-control').forEach(ch=>{const section=ch.closest('.kb-item-field'),hidden=$('.kb-v250-bool-value',section),text=ch.closest('.v250-switch')?.querySelector('span:last-child');const sync=()=>{hidden.value=ch.checked?'true':'false';if(text)text.textContent=ch.checked?'On':'Off';hidden.dispatchEvent(new Event('input',{bubbles:true}))};ch.addEventListener('change',sync)});container.querySelectorAll('.kb-v250-date-value').forEach(hidden=>{const section=hidden.closest('.kb-item-field'),start=$('[data-date-start]',section),end=$('[data-date-end]',section),grid=$('.kb-v250-date-grid',section),buttons=$$('[data-mode]',section);let parsed;try{parsed=JSON.parse(hidden.value)}catch{parsed={mode:'single'}};let m=parsed?.mode==='range'?'range':'single';const sync=()=>{hidden.value=JSON.stringify({mode:m,start:start.value||'',end:m==='range'?(end.value||''):''});hidden.dispatchEvent(new Event('input',{bubbles:true}))};buttons.forEach(b=>b.onclick=()=>{m=b.dataset.mode;buttons.forEach(x=>x.classList.toggle('active',x===b));end.style.display=m==='range'?'':'none';grid.classList.toggle('single',m!=='range');sync()});start.addEventListener('change',sync);end.addEventListener('change',sync)});container.querySelectorAll('.kb-v250-drop').forEach(drop=>{const section=drop.closest('.kb-item-field'),file=$('.kb-v250-attachment-file',section),hidden=$('.kb-v250-attachment-value',section);const pick=()=>{file.value='';file.click()};drop.onclick=pick;drop.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();pick()}};drop.ondragover=e=>{e.preventDefault();drop.classList.add('drag')};drop.ondragleave=()=>drop.classList.remove('drag');drop.ondrop=e=>{e.preventDefault();drop.classList.remove('drag');const f=e.dataTransfer?.files?.[0];if(f)handle(f)};file.onchange=()=>{const f=file.files?.[0];if(f)handle(f)};async function handle(f){drop.innerHTML='<i class="ph ph-spinner-gap"></i><strong>Saving file…</strong>';try{const previous=parseAttachment(hidden.value);const a=await uploadAttachment(f);hidden.value=JSON.stringify(a);hidden.dispatchEvent(new Event('input',{bubbles:true}));if(previous?.projectPath&&previous.projectPath!==a.projectPath)fetch(`/api/kb-attachment/${encodeURIComponent(hobby())}`,{method:'DELETE',headers:{'Content-Type':'application/json'},body:JSON.stringify(previous)}).catch(()=>null);drop.innerHTML=`<i class="ph ph-paperclip"></i><strong>${esc(a.name||f.name)}</strong><small>Saved in this Loggy project · click to replace</small>`}catch(e){drop.innerHTML='<i class="ph ph-warning"></i><strong>Could not save file</strong><small>Click to try again</small>'}}})}
  try{const oldBind=bindKnowledgeItemFieldBehavior;bindKnowledgeItemFieldBehavior=function(container,category,mode,itemId=null){const r=oldBind.apply(this,arguments);bindExtraFields(container,category,mode,itemId);return r}}catch{}

  // Ensure core migration keeps V250 field kinds across reloads.
  try{const oldNorm=normalizeKnowledgeField;normalizeKnowledgeField=function(field,index,config){const raw=String(field?.kind||'');if(!EXTRA_KINDS.has(raw))return oldNorm.apply(this,arguments);const n={...(typeof field==='object'?field:{}),id:field?.id||`kb-field-v250-${index}`,name:String(field?.name||`Field ${index+1}`),kind:raw,pronunciation:!!field?.pronunciation,ttsLang:String(field?.ttsLang||config?.ttsLang||'ko'),quiz:field?.quiz!==false,editable:!!field?.editable,options:[]};if(raw==='numberFormat'){n.numberStyle=['number','currency','percent'].includes(field?.numberStyle)?field.numberStyle:'number';n.decimals=Math.max(0,Math.min(8,Number(field?.decimals??2)));n.currencySymbol=String(field?.currencySymbol||'$').slice(0,6)}if(raw==='dateTime')n.dateMode=field?.dateMode==='range'?'range':'single';return n}}catch{}

  // V254: normalize nested Dropdown component chrome after every custom-tab render.
  function polishDropdownComponentsV254(scope=document){
    $$('.custom-component-dropdownV239',scope).forEach(drop=>{
      const content=$('.custom-component-content',drop)||drop;
      $$('[data-component-id]',content).forEach(child=>{if(child!==drop)child.classList.add('dropdown-child-borderless-v254')});
      $$('button',content).forEach(button=>{
        const text=String(button.textContent||'').replace(/\s+/g,' ').trim();
        const aria=String(button.getAttribute('aria-label')||button.title||'').trim();
        if(!/add component/i.test(`${text} ${aria}`))return;
        button.classList.add('dropdown-add-plus-v254');
        const editing=typeof customTabEditMode!=='undefined'&&!!customTabEditMode;
        button.classList.toggle('dropdown-add-visible-v255',editing);
        button.title='Add component';button.setAttribute('aria-label','Add component');
        if(!button.querySelector(':scope > i.ph-plus')||text)button.innerHTML='<i class="ph ph-plus" aria-hidden="true"></i>';
        content.appendChild(button);
      });
    });
  }
  try{
    const previousRenderCustomTabV254=renderCustomTabView;
    if(typeof previousRenderCustomTabV254==='function'&&!previousRenderCustomTabV254.__dropdownPolishV254){
      const wrapped=function(){const result=previousRenderCustomTabV254.apply(this,arguments);queueMicrotask(()=>polishDropdownComponentsV254());return result};
      wrapped.__dropdownPolishV254=true;renderCustomTabView=wrapped;
    }
  }catch{}
  document.addEventListener('click',event=>{if(event.target.closest?.('.custom-tab-nav-btn,.custom-tab-view,.custom-component-dropdownV239,[data-custom-component-type]'))requestAnimationFrame(()=>polishDropdownComponentsV254())},true);
  setTimeout(()=>polishDropdownComponentsV254(),300);

  // V266: reloads preserve the current top-level/custom/special tab.
  // Do not reset last-app-tab or delete Notebook/Whiteboard route state here;
  // template.js + the special-tab restore handlers are the single authority.

  // 6) Day-of-week prefix for every formatDate consumer.
  try{const oldFormat=formatDate;formatDate=function(dayNumber){try{const d=dateForDay(dayNumber);const days=['SUN','MON','TUE','WED','THUR','FRI','SAT'];return `${days[d.getDay()]} ${d.toLocaleDateString('en-US',{month:'long',day:'numeric',year:'numeric'})}`}catch{return oldFormat.apply(this,arguments)}}}catch{}

  // 8) V257 authoritative New Day (+) visibility.
  // Never infer this from a hand-maintained layout-size list again. Every paged
  // layout already exposes its real page state through daily-paged-layout-v231
  // and the Next button's disabled state, so this remains correct for current
  // and future paged geometries.
  function enforceFinalPlus(){
    const grid=$('#days-grid');if(!grid)return;
    const slot=grid.querySelector(':scope > .daily-add-day-slot-v238');
    const button=slot?.querySelector('[title="Add extra log day"]')||grid.querySelector(':scope > button.day-box[title="Add extra log day"],:scope > .polaroid-card[title="Add extra log day"]');
    const targets=[slot,button].filter((x,i,a)=>x&&a.indexOf(x)===i);
    const paged=grid.classList.contains('daily-paged-layout-v231');
    const next=document.querySelector('#daily-day-pager-v231 [data-page-step-v231="1"]');
    const finalPage=!paged||!next||next.disabled===true;
    grid.dataset.finalActivePageV257=finalPage?'1':'0';
    targets.forEach(node=>{
      node.classList.toggle('v257-hide-nonfinal-plus',!finalPage);
      if(!finalPage)node.setAttribute('aria-hidden','true');
      else if(!node.classList.contains('daily-page-hidden-v231'))node.removeAttribute('aria-hidden');
    });
  }
  if(typeof window.__setDailyPageV231==='function'){
    const orig=window.__setDailyPageV231;
    if(!orig.__finalPlusV257){
      const wrapped=function(){const r=orig.apply(this,arguments);requestAnimationFrame(enforceFinalPlus);return r};
      wrapped.__finalPlusV257=true;window.__setDailyPageV231=wrapped;
    }
  }
  const bindPlusStateObserverV257=()=>{
    const grid=$('#days-grid'),next=$('#daily-day-pager-v231 [data-page-step-v231="1"]');
    if(grid&&grid.dataset.plusObserverV257!=='1'){
      grid.dataset.plusObserverV257='1';
      new MutationObserver(enforceFinalPlus).observe(grid,{attributes:true,attributeFilter:['class'],childList:true,subtree:false});
    }
    if(next&&next.dataset.plusObserverV257!=='1'){
      next.dataset.plusObserverV257='1';
      new MutationObserver(enforceFinalPlus).observe(next,{attributes:true,attributeFilter:['disabled']});
    }
    enforceFinalPlus();
  };
  document.addEventListener('click',e=>{if(e.target.closest?.('#grid-view,.daily-day-layout-picker-v228,[data-page-step-v231]'))requestAnimationFrame(()=>{bindPlusStateObserverV257();enforceFinalPlus()})},true);
  setTimeout(bindPlusStateObserverV257,250);

  // 10) Developer Mode cleanup.
  function cleanDeveloper(){const b=$('#developer-jump-grid');b?.remove();const a=$('.developer-mode-actions');if(a&&!a.children.length)a.remove()}
  document.addEventListener('click',e=>{if(e.target.closest?.('#developer-mode-modal'))requestAnimationFrame(cleanDeveloper)},true);setTimeout(cleanDeveloper,100);

  // Preserve V248 removals even though V249 was based on a pre-V248 shared file.
  function removeOldLayouts(){['staircase','clock','spiral','constellation','diamonds','ribbons','fan'].forEach(v=>$$(`[data-daily-layout-v228="${v}"]`).forEach(b=>b.remove()));const cur=String(window.db?.settings?.dailyDayLayoutV228||'grid');if(['staircase','clock','spiral','constellation','diamonds','ribbons','fan'].includes(cur)){window.db.settings.dailyDayLayoutV228='grid';save()}}
  document.addEventListener('click',e=>{if(e.target.closest?.('#open-daily-settings-btn,.daily-day-layout-picker-v228'))requestAnimationFrame(removeOldLayouts)},true);setTimeout(removeOldLayouts,200);

  // V250 Notepad addon loading is integrated inside the V249 lazy loader in template-extras-5.js.
})();


/* ============================================================
   V318 — CLEAN THEME BUILDER
   (runtime lineage V307; V319 keeps Dashboard preview parity with the exact edited source theme)

   V307 — CLEAN THEME BUILDER
   One owner for editor UI, tabs, colors, backgrounds, audio, decorations,
   trinkets and real-site previews. Historical Theme Builder DOM/functions are
   intentionally not used by this subsystem.
   ============================================================ */
(() => {
  'use strict';

  const query = new URLSearchParams(location.search);
  const PREVIEW = query.get('theme-builder-preview-v307') === '1';

  // -------------------------------------------------------------------------
  // Real-site preview bridge. In preview documents this script never creates a
  // Theme Builder. It only receives a draft from the parent and applies it with
  // the same final runtime function used by the actual log pages.
  // -------------------------------------------------------------------------
  if (PREVIEW) {
    if (window.__loggyThemePreviewBridgeV307) return;
    window.__loggyThemePreviewBridgeV307 = true;

    // V414: Theme Builder preview is visual by default. Intro songs are auditioned
    // only by the Audio tab's Play button in the parent editor. This prevents an
    // iframe-owned intro from playing underneath/restarting beside the editor's
    // audition Audio object whenever any unrelated draft setting changes.
    function stopPreviewIframeIntroV414() {
      let audio = null;
      try { audio = customThemeIntroAudioV2 || null; } catch {}
      try {
        if (customThemeIntroStopTimerV2) clearTimeout(customThemeIntroStopTimerV2);
        if (customThemeIntroFadeTimerV2) clearInterval(customThemeIntroFadeTimerV2);
        if (typeof customThemeIntroFadeStartTimerV3 !== 'undefined' && customThemeIntroFadeStartTimerV3) clearTimeout(customThemeIntroFadeStartTimerV3);
        customThemeIntroStopTimerV2 = null;
        customThemeIntroFadeTimerV2 = null;
        if (typeof customThemeIntroFadeStartTimerV3 !== 'undefined') customThemeIntroFadeStartTimerV3 = null;
      } catch {}
      if (audio) {
        try { audio.pause(); } catch {}
        try { audio.currentTime = 0; } catch {}
        try { audio.removeAttribute?.('src'); } catch {}
        try { audio.src = ''; } catch {}
        try { audio.load?.(); } catch {}
      }
      try { if (customThemeIntroAudioV2 === audio) customThemeIntroAudioV2 = null; } catch {}
    }
    try {
      const playBeforeV414 = window.playCustomThemeIntroAudioV2 || (typeof playCustomThemeIntroAudioV2 === 'function' ? playCustomThemeIntroAudioV2 : null);
      if (typeof playBeforeV414 === 'function' && !playBeforeV414.__themeBuilderSilentPreviewV414) {
        const silentPlayV414 = function () { stopPreviewIframeIntroV414(); return null; };
        silentPlayV414.__themeBuilderSilentPreviewV414 = true;
        window.playCustomThemeIntroAudioV2 = silentPlayV414;
        try { playCustomThemeIntroAudioV2 = silentPlayV414; } catch {}
      }
    } catch {}
    window.addEventListener('message', event => {
      if (event.origin !== location.origin || event.data?.type !== 'loggy-theme-preview-stop-intro-v414') return;
      stopPreviewIframeIntroV414();
    });

    function installPreviewLayeringV309() {
      let style = document.getElementById('theme-builder-preview-layering-v309');
      if (!style) {
        style = document.createElement('style');
        style.id = 'theme-builder-preview-layering-v309';
        document.head.appendChild(style);
      }
      style.textContent = `
        html[data-theme-builder-preview-v307="true"] body { isolation: isolate !important; }
        html[data-theme-builder-preview-v307="true"] body > #custom-theme-code-background-v56,
        html[data-theme-builder-preview-v307="true"] body > .custom-theme-code-background-v56 { z-index: 0 !important; }
        /* V356: match the real log-page stacking order. Decorations must sit
           above the page shell for hit-testing; keeping the stage below .view
           made every hover animation impossible inside the iframe preview. */
        html[data-theme-builder-preview-v307="true"] body > .view { position: relative !important; z-index: 10 !important; }
        html[data-theme-builder-preview-v307="true"] body > #custom-theme-background-stage,
        html[data-theme-builder-preview-v307="true"] body > .custom-theme-background-stage {
          z-index: 12 !important;
          pointer-events: none !important;
        }
        html[data-theme-builder-preview-v307="true"] body > #custom-theme-background-stage > .custom-theme-background-svg,
        html[data-theme-builder-preview-v307="true"] body > .custom-theme-background-stage > .custom-theme-background-svg {
          pointer-events: auto !important;
        }
        html[data-theme-builder-preview-v307="true"] body > .side-nav { z-index: 20 !important; }
        html[data-theme-builder-preview-v307="true"] body > #companion-stage,
        html[data-theme-builder-preview-v307="true"] body > #companion-air-stage { z-index: 30 !important; }
      `;
    }
    installPreviewLayeringV309();

    // V317: preview navigation is owned by the real preview UI itself.
    // No parent-side navigation interception or synthetic clicks are installed.

    const copy = value => {
      try { return structuredClone(value); } catch {}
      try { return JSON.parse(JSON.stringify(value || {})); } catch { return { ...(value || {}) }; }
    };

    // V354: the preview iframe is intentionally reused for performance, but
    // theme applications must be serialized so a slow apply from the previously
    // edited theme can never finish after the newly selected theme and overwrite
    // it. Only the newest queued draft is applied next.
    let previewApplyRunningV354 = false;
    let previewPendingV354 = null;

    // V356: the real page runtime already owns hover behavior; this helper only
    // re-applies that behavior after an iframe draft swap and restores hit-testing
    // in case a late decoration rebuild replaced the artwork nodes.
    // V359: preview hover has its own compositor transform channel. Older
    // hover code rewrote the normal motion shell's `animation`, so Float/Bob/
    // Across Screen could immediately overwrite the hover animation. Using the
    // individual translate/scale/rotate properties on the artwork item keeps
    // hover completely independent from the theme's normal movement runtime.
    const PREVIEW_HOVER_IDS_V359 = new Set([
      'lift','bounce','wiggle','spin','pulse','float','tilt-lift','pop-wiggle',
      'squish','flip','jello','mini-orbit','side-nudge','double-hop','soft-shiver'
    ]);
    function previewHoverFramesV359(name) {
      switch (name) {
        case 'bounce': return [
          {translate:'0 0',scale:'1',offset:0},{translate:'0 -14px',scale:'1.08',offset:.36},
          {translate:'0 3px',scale:'.99',offset:.68},{translate:'0 -4px',scale:'1.04',offset:1}
        ];
        case 'wiggle': return [
          {rotate:'0deg',scale:'1',offset:0},{rotate:'-9deg',scale:'1.05',offset:.2},
          {rotate:'8deg',scale:'1.08',offset:.4},{rotate:'-6deg',scale:'1.07',offset:.6},
          {rotate:'4deg',scale:'1.05',offset:.8},{rotate:'0deg',scale:'1.03',offset:1}
        ];
        case 'spin': return [{rotate:'0deg',scale:'1'},{rotate:'360deg',scale:'1.06'}];
        case 'pulse': return [{scale:'1'},{scale:'1.17',offset:.5},{scale:'1.05'}];
        case 'float': return [{translate:'0 0',rotate:'0deg'},{translate:'5px -9px',rotate:'3deg',offset:.5},{translate:'-2px -5px',rotate:'-1deg'}];
        case 'tilt-lift': return [{translate:'0 0',rotate:'0deg',scale:'1'},{translate:'0 -10px',rotate:'-5deg',scale:'1.1'},{translate:'0 -6px',rotate:'2deg',scale:'1.06'}];
        case 'pop-wiggle': return [{scale:'1',rotate:'0deg'},{scale:'1.16',rotate:'-6deg',offset:.28},{scale:'1.08',rotate:'6deg',offset:.55},{scale:'1.05',rotate:'0deg'}];
        case 'squish': return [{scale:'1 1'},{scale:'1.16 .86',offset:.38},{scale:'.94 1.1',offset:.68},{scale:'1.04 1.04'}];
        case 'flip': return [{rotate:'0deg',scale:'1'},{rotate:'180deg',scale:'1.08',offset:.52},{rotate:'360deg',scale:'1.03'}];
        case 'jello': return [{rotate:'0deg',scale:'1'},{rotate:'-7deg',scale:'1.08 .94',offset:.22},{rotate:'6deg',scale:'.96 1.07',offset:.43},{rotate:'-4deg',scale:'1.04 .98',offset:.64},{rotate:'2deg',scale:'1.02',offset:.82},{rotate:'0deg',scale:'1.02'}];
        case 'mini-orbit': return [{translate:'0 0'},{translate:'7px -5px',offset:.25},{translate:'0 -9px',offset:.5},{translate:'-7px -5px',offset:.75},{translate:'0 0'}];
        case 'side-nudge': return [{translate:'0 0'},{translate:'10px 0',offset:.45},{translate:'-3px 0',offset:.72},{translate:'3px 0'}];
        case 'double-hop': return [{translate:'0 0',scale:'1'},{translate:'0 -11px',scale:'1.07',offset:.24},{translate:'0 0',scale:'1',offset:.46},{translate:'0 -7px',scale:'1.04',offset:.68},{translate:'0 -2px',scale:'1.02'}];
        case 'soft-shiver': return [{translate:'0 0',rotate:'0deg'},{translate:'-2px 0',rotate:'-2deg',offset:.2},{translate:'2px 0',rotate:'2deg',offset:.4},{translate:'-1px 0',rotate:'-1deg',offset:.6},{translate:'1px 0',rotate:'1deg',offset:.8},{translate:'0 0',rotate:'0deg'}];
        default: return [{translate:'0 0',scale:'1',rotate:'0deg'},{translate:'0 -11px',scale:'1.13',rotate:'-2deg',offset:.58},{translate:'0 -6px',scale:'1.07',rotate:'1deg'}];
      }
    }
    function previewHoverDurationV359(name) {
      if (name === 'float' || name === 'jello' || name === 'mini-orbit') return 700;
      if (name === 'spin' || name === 'flip' || name === 'double-hop') return 650;
      return 520;
    }
    function bindPreviewHoverItemV359(item, asset, draft) {
      if (!item) return;
      const override = String(asset?.hoverAnimationOverrideV82 || '').trim();
      let animation = '';
      if (override === 'none') animation = '';
      else if (PREVIEW_HOVER_IDS_V359.has(override)) animation = override;
      else if (draft?.svgHoverAnimationsEnabledV82) {
        const global = String(draft?.svgHoverAnimationV82 || 'lift').trim();
        animation = PREVIEW_HOVER_IDS_V359.has(global) ? global : 'lift';
      }
      item.dataset.previewHoverAnimationV359 = animation || 'none';
      item.style.setProperty('pointer-events','auto','important');
      if (item._previewHoverEnterV359) item.removeEventListener('pointerenter', item._previewHoverEnterV359);
      if (item._previewHoverLeaveV359) item.removeEventListener('pointerleave', item._previewHoverLeaveV359);
      if (item._previewHoverAnimV359) { try { item._previewHoverAnimV359.cancel(); } catch {} item._previewHoverAnimV359=null; }
      const reset = () => {
        try { item._previewHoverAnimV359?.cancel(); } catch {}
        item._previewHoverAnimV359 = null;
        item.style.removeProperty('translate');
        item.style.removeProperty('scale');
        item.style.removeProperty('rotate');
      };
      const enter = () => {
        if (!animation) return;
        reset();
        try {
          item._previewHoverAnimV359 = item.animate(previewHoverFramesV359(animation), {
            duration: previewHoverDurationV359(animation), easing:'cubic-bezier(.2,.75,.2,1)', fill:'forwards'
          });
        } catch {}
      };
      item.addEventListener('pointerenter', enter);
      item.addEventListener('pointerleave', reset);
      item._previewHoverEnterV359 = enter;
      item._previewHoverLeaveV359 = reset;
    }
    function refreshPreviewHoverV356(draft) {
      const stage = document.getElementById('custom-theme-background-stage');
      if (!stage) return;
      stage.style.setProperty('pointer-events', 'none', 'important');
      const assets = Array.isArray(draft?.backgroundSvgs) ? draft.backgroundSvgs : [];
      const visible = assets.filter(asset => asset?.hidden !== true && asset?.enabled !== false);
      stage.querySelectorAll(':scope > .custom-theme-background-svg').forEach((item, displayIndex) => {
        const sourceIndex = Number(item?.dataset?.svgIndex);
        const asset = Number.isFinite(sourceIndex) && assets[sourceIndex] ? assets[sourceIndex] : (visible[displayIndex % Math.max(1, visible.length)] || assets[displayIndex % Math.max(1, assets.length)] || {});
        bindPreviewHoverItemV359(item, asset, draft || {});
      });
      // Leave the old binder in place for hover sounds/legacy metadata, but the
      // V359 compositor animation above is the visual hover owner in previews.
      try {
        if (typeof applyThemeHoverBehaviorV87 === 'function') applyThemeHoverBehaviorV87(stage, draft || {});
        else if (typeof applyThemeHoverAnimationsV82 === 'function') applyThemeHoverAnimationsV82(stage, draft || {});
      } catch {}
      // Old binders may replace handlers/styles synchronously. Reassert V359
      // listeners after they finish without rebuilding any artwork.
      stage.querySelectorAll(':scope > .custom-theme-background-svg').forEach((item, displayIndex) => {
        const sourceIndex = Number(item?.dataset?.svgIndex);
        const asset = Number.isFinite(sourceIndex) && assets[sourceIndex] ? assets[sourceIndex] : (visible[displayIndex % Math.max(1, visible.length)] || assets[displayIndex % Math.max(1, assets.length)] || {});
        bindPreviewHoverItemV359(item, asset, draft || {});
      });
    }

    // V510 — live Theme Builder decoration preview authority.
    // The saved/apply runtime already honors hidden/uploaded decorations, but the
    // iframe preview could keep its previous stage until the editor was saved and
    // reopened. Reconcile the actual preview stage from the CURRENT draft after
    // every preview message so upload + visibility changes are immediate.
    function decorationHiddenV510(asset) {
      if (!asset || typeof asset !== 'object') return false;
      if (typeof asset.hiddenOnScreenV63 === 'boolean') return asset.hiddenOnScreenV63;
      if (typeof asset.showOnScreen === 'boolean') return asset.showOnScreen === false;
      if (typeof asset.visibleV63 === 'boolean') return asset.visibleV63 === false;
      if (typeof asset.visible === 'boolean') return asset.visible === false;
      if (typeof asset.enabled === 'boolean') return asset.enabled === false;
      return false;
    }

    function normalizedPreviewDecorationsV510(draft = {}) {
      return (Array.isArray(draft?.backgroundSvgs) ? draft.backgroundSvgs : []).map((asset, index) => {
        if (!asset || typeof asset !== 'object') return asset;
        const hidden = decorationHiddenV510(asset);
        return {
          ...asset,
          hiddenOnScreenV63: hidden,
          showOnScreen: !hidden,
          visibleV63: !hidden,
          visible: !hidden,
          placementIndexV405: Number.isFinite(Number(asset.placementIndexV405)) ? Number(asset.placementIndexV405) : index
        };
      });
    }

    function previewDecorationSignatureV510(draft = {}) {
      const list = normalizedPreviewDecorationsV510(draft);
      return JSON.stringify({
        preventOverlap: draft?.preventDecorationOverlapV367 === true,
        reduceOverlap: draft?.reduceDecorationOverlapV361 === true,
        allowOverlap: draft?.svgAllowOverlap === true,
        distribution: String(draft?.svgDistribution || 'random'),
        scale: Number(draft?.svgGlobalScale ?? 100),
        globalOpacity: Number(draft?.decorationsOpacityV117 ?? 100),
        placements: Array.isArray(draft?.resolvedDecorationPlacementsV405) ? draft.resolvedDecorationPlacementsV405 : [],
        assets: list.map((asset, index) => ({
          index,
          id: asset?.id || '',
          url: asset?.url || asset?.src || asset?.dataUrl || '',
          markup: asset?.markup || '',
          hidden: decorationHiddenV510(asset),
          alwaysShow: asset?.alwaysShowOnScreenV370 === true,
          opacity: asset?.opacityV109 ?? asset?.opacity ?? null,
          opacityOverride: asset?.opacityOverrideV326 === true,
          animation: asset?.animationOverride || draft?.svgDefaultAnimation || asset?.animation || '',
          x: draft?.resolvedDecorationPlacementsV405?.[asset?.placementIndexV405 ?? index]?.x ?? null,
          y: draft?.resolvedDecorationPlacementsV405?.[asset?.placementIndexV405 ?? index]?.y ?? null
        }))
      });
    }

    // V516: final live-preview asset reconciliation. The historical mount stack
    // has many wrappers and can occasionally finish a remount without creating a
    // wrapper/image for the newest uploaded URL-backed decoration. Saving/reopening
    // works because the next full load reconstructs it. In preview, create ONLY the
    // missing source-index nodes immediately; placement/overlap/motion remain owned
    // by the canonical runtimes that run right after this function.
    // V519: authoritative hide/show cleanup for Theme Builder preview.
    // Older decoration renderers can briefly recreate a decoration after the
    // editor has already marked it hidden. This pass removes only nodes that
    // correspond to CURRENTLY hidden assets and runs after every preview apply.
    function previewDecorationAssetKeyV519(asset = {}) {
      const raw = String(asset?.url || asset?.src || asset?.dataUrl || asset?.projectPath || asset?.path || '').trim();
      if (raw) {
        try {
          const u = new URL(raw, location.href);
          return `url:${decodeURIComponent(u.pathname).replace(/\\/g,'/').toLowerCase()}`;
        } catch {
          return `url:${raw.split('?')[0].split('#')[0].replace(/\\/g,'/').toLowerCase()}`;
        }
      }
      const markup = String(asset?.markup || '').replace(/\s+/g,' ').trim();
      if (markup) return `markup:${markup}`;
      return `name:${String(asset?.id || asset?.name || '').trim().toLowerCase()}`;
    }

    function previewDecorationNodeKeyV519(node) {
      if (!node) return '';
      const media = node.querySelector?.('img[src],object[data],image[href],image[xlink\:href]');
      const raw = String(media?.getAttribute?.('src') || media?.getAttribute?.('data') || media?.getAttribute?.('href') || media?.getAttribute?.('xlink:href') || '').trim();
      if (raw) {
        try {
          const u = new URL(raw, location.href);
          return `url:${decodeURIComponent(u.pathname).replace(/\\/g,'/').toLowerCase()}`;
        } catch {
          return `url:${raw.split('?')[0].split('#')[0].replace(/\\/g,'/').toLowerCase()}`;
        }
      }
      const shell = node.querySelector?.('.theme-svg-motion-shell,.theme-image-motion-shell-v36') || node;
      const markup = String(shell?.innerHTML || '').replace(/\s+/g,' ').trim();
      return markup ? `markup:${markup}` : '';
    }

    function removeHiddenPreviewDecorationsV519(draft = {}) {
      const stage = document.getElementById('custom-theme-background-stage');
      if (!stage) return stage;
      const all = normalizedPreviewDecorationsV510(draft);
      const hiddenKeys = new Set(all.filter(decorationHiddenV510).map(previewDecorationAssetKeyV519).filter(Boolean));
      if (!hiddenKeys.size) return stage;
      Array.from(stage.querySelectorAll(':scope > .custom-theme-background-svg')).forEach(node => {
        const nodeKey = previewDecorationNodeKeyV519(node);
        if (nodeKey && hiddenKeys.has(nodeKey)) { node.remove(); return; }
        const sourceIndex = Number(node?.dataset?.svgIndex);
        // Index matching is only used when the node has no media/markup key.
        // This avoids deleting the wrong item when legacy renderers renumber
        // visible-only decorations after an earlier item is hidden.
        if (!nodeKey && Number.isFinite(sourceIndex) && decorationHiddenV510(all[sourceIndex])) node.remove();
      });
      return stage;
    }
    window.__loggyRemoveHiddenPreviewDecorationsV519 = removeHiddenPreviewDecorationsV519;

    function ensurePreviewDecorationNodesV516(draft = {}) {
      const stage = document.getElementById('custom-theme-background-stage');
      if (!stage) return stage;
      const all = normalizedPreviewDecorationsV510(draft);
      const visibleEntries = all.map((asset,index)=>({asset,index})).filter(x=>x.asset && !decorationHiddenV510(x.asset));
      const wrappers = Array.from(stage.querySelectorAll(':scope > .custom-theme-background-svg'));
      // Historical renderers renumber visible-only assets, so source indices are
      // not reliable when earlier decorations are hidden. For immediate uploads,
      // only fill the missing TAIL nodes. This is exactly the failure mode here:
      // the newly uploaded decoration is appended to the draft but omitted from
      // the already-mounted preview stage.
      if (wrappers.length >= visibleEntries.length) return stage;
      for (const {asset,index} of visibleEntries.slice(wrappers.length)) {
        const item = document.createElement('div');
        const anim = String(asset?.animationOverride || draft?.svgDefaultAnimation || asset?.animation || 'float');
        item.className = `custom-theme-background-svg theme-svg-anim-${anim}`;
        item.dataset.svgIndex = String(index);
        item.dataset.previewImmediateUploadV516 = 'true';
        item.style.left = '50%';
        item.style.top = '50%';
        item.style.setProperty('--theme-svg-delay', `${(index % 13) * -0.41}s`);
        const shell = document.createElement('div');
        shell.className = 'theme-svg-motion-shell';
        const markup = String(asset?.markup || '').trim();
        if (markup) {
          shell.innerHTML = markup;
        } else {
          const src = String(asset?.url || asset?.src || asset?.dataUrl || '').trim();
          if (!src) continue;
          const img = document.createElement('img');
          img.className = 'theme-decoration-image-v36 theme-decoration-image-health-v494';
          img.alt = '';
          img.draggable = false;
          img.decoding = 'async';
          img.src = src;
          shell.appendChild(img);
        }
        item.appendChild(shell);
        stage.appendChild(item);
      }
      return stage;
    }
    window.__loggyEnsurePreviewDecorationNodesV516 = ensurePreviewDecorationNodesV516;

    function forcePreviewDecorationSceneV510(draft = {}) {
      const fullList = normalizedPreviewDecorationsV510(draft);
      const visible = fullList.filter(asset => asset && !decorationHiddenV510(asset));
      const signature = previewDecorationSignatureV510(draft);
      const stage = document.getElementById('custom-theme-background-stage');
      const currentCount = stage?.querySelectorAll?.(':scope > .custom-theme-background-svg')?.length || 0;
      if (stage?.dataset?.previewDecorationsV510 === signature && currentCount === visible.length) return stage;

      try { stage?.remove(); } catch {}
      if (!visible.length) return null;

      const previewTheme = {
        ...(draft || {}),
        backgroundSvgs: visible.map(asset => ({ ...asset }))
      };

      // Preserve original placement indices while passing only visible assets to
      // historical renderers. The V405/V407 placement runtime resolves them back
      // to the saved scene coordinates.
      try {
        const mounted = mountCustomThemeBackgroundSvgsV2?.(previewTheme);
        const next = document.getElementById('custom-theme-background-stage');
        if (next) next.dataset.previewDecorationsV510 = signature;
        ensurePreviewDecorationNodesV516(previewTheme);
        removeHiddenPreviewDecorationsV519(draft);
        // V513: use the same strict/reduce-overlap authority as the real applied
        // theme immediately after this preview remount. The old V510 path could
        // rebuild the stage after parity had already run, leaving overlap controls
        // visually stale until Save/reopen.
        // V515: the V510/V513 preview remount happens AFTER the normal theme
        // renderer. Re-apply the canonical distribution coordinates immediately
        // or this late remount falls back to the legacy fixed 8-position layout.
        try { window.__loggyApplyCanonicalPlacementV405?.(previewTheme); } catch {}
        try { window.__loggyApplyDecorationParityV513?.(previewTheme); } catch {}
        requestAnimationFrame(() => {
          ensurePreviewDecorationNodesV516(previewTheme);
          removeHiddenPreviewDecorationsV519(draft);
          try { window.__loggyApplyCanonicalPlacementV405?.(previewTheme); } catch {}
          try { window.__loggyApplyDecorationParityV513?.(previewTheme); } catch {}
          try { window.__loggyRepairDecorationImagesV494?.(previewTheme); } catch {}
        });
        return next || mounted || null;
      } catch (error) {
        console.warn('[Theme Preview V510] decoration reconcile failed', error);
        return null;
      }
    }

    function resetPreviewToDailyLogsV354() {
      try {
        const grid = document.getElementById('grid-view');
        if (!grid) return;
        if (typeof switchView === 'function') {
          switchView(grid);
        } else {
          document.querySelectorAll('body > .view').forEach(view => view.classList.remove('active'));
          grid.classList.add('active');
        }
      } catch {}
    }

    async function drainPreviewQueueV354() {
      if (previewApplyRunningV354) return;
      previewApplyRunningV354 = true;
      try {
        while (previewPendingV354) {
          const job = previewPendingV354;
          previewPendingV354 = null;
          if (job.resetView) resetPreviewToDailyLogsV354();
          try {
            // V414: applying visual preview updates must never auto-start the
            // intro song. The Audio tab's Play button is the single audition
            // owner, so changing a color/image/etc. cannot create a second song.
            stopPreviewIframeIntroV414();
            if (typeof applyCustomBuiltTheme === 'function') {
              const visualDraftV414 = copy(job.draft || {});
              visualDraftV414.introAudio = '';
              visualDraftV414.introAudioName = '';
              visualDraftV414.introAudioProjectPath = '';
              visualDraftV414.introAudioSourceThemeIdV364 = '';
              ['introAudioUrl','introSong','introMusic','song','music','introSongName','songName','musicName'].forEach(key => {
                if (Object.prototype.hasOwnProperty.call(visualDraftV414,key)) visualDraftV414[key] = '';
              });
              await Promise.resolve(applyCustomBuiltTheme(visualDraftV414));
              // V510: saved/apply already had the right decoration state; make the
              // live iframe obey that same draft immediately instead of waiting
              // for Save Theme / reopen to remount its artwork.
              forcePreviewDecorationSceneV510(job.draft || {});
              removeHiddenPreviewDecorationsV519(job.draft || {});
              stopPreviewIframeIntroV414();
            }
            // V363: the real Log page already gets the distinct V362 default
            // motions, but Theme Builder preview artwork can be rebuilt again at
            // the end of its iframe apply. Reassert the distinct-motion owner on
            // the final preview nodes before and after hover binding so the
            // preview shows the exact animation selected in Default Animation.
            try { window.__loggyApplyDefaultMotionsV363?.(job.draft || {}); } catch {}
            // Bind against the final iframe artwork immediately, then once more
            // on the next paint because some theme renderers replace their nodes
            // at the end of the same apply cycle. This does not rebuild the page.
            refreshPreviewHoverV356(job.draft || {});
            requestAnimationFrame(() => {
              // A few legacy theme layers can replace the stage at the tail end of
              // the same paint. Reconcile once more only if its signature/count no
              // longer matches the current draft; this is a verification pass, not
              // a polling/remount loop.
              forcePreviewDecorationSceneV510(job.draft || {});
              removeHiddenPreviewDecorationsV519(job.draft || {});
              try { window.__loggyApplyDefaultMotionsV363?.(job.draft || {}); } catch {}
              refreshPreviewHoverV356(job.draft || {});
            });
            setTimeout(() => { try { window.__loggyApplyDefaultMotionsV363?.(job.draft || {}); } catch {} }, 90);
          } catch (error) {
            console.warn('[Theme Preview V354] theme apply failed', error);
          }

          // If another theme/draft arrived while this one was applying, do not
          // expose this intermediate result. Loop immediately and let latest win.
          if (previewPendingV354) continue;

          if (job.resetView) resetPreviewToDailyLogsV354();
          requestAnimationFrame(() => {
            installPreviewLayeringV309();
            try {
              parent.postMessage({
                type: 'loggy-theme-preview-applied-v307',
                requestIdV354: job.requestId
              }, location.origin);
            } catch {}
          });
        }
      } finally {
        previewApplyRunningV354 = false;
        // A message can land between the final loop test and finally.
        if (previewPendingV354) queueMicrotask(drainPreviewQueueV354);
      }
    }

    window.addEventListener('message', event => {
      if (event.origin !== location.origin) return;
      if (event.data?.type === 'loggy-theme-preview-decoration-visibility-v519') {
        const visibilityDraftV519 = event.data.draft || {};
        try { window.__loggySetPreviewThemeV372?.(visibilityDraftV519); } catch {
          window.__loggyActivePreviewThemeV372 = copy(visibilityDraftV519);
        }
        // Hide must feel instantaneous: remove the matching live node first,
        // then reconcile the complete decoration scene from the same draft.
        removeHiddenPreviewDecorationsV519(visibilityDraftV519);
        forcePreviewDecorationSceneV510(visibilityDraftV519);
        removeHiddenPreviewDecorationsV519(visibilityDraftV519);
        requestAnimationFrame(() => {
          forcePreviewDecorationSceneV510(visibilityDraftV519);
          removeHiddenPreviewDecorationsV519(visibilityDraftV519);
          try { window.__loggyApplyCanonicalPlacementV405?.(visibilityDraftV519); } catch {}
          try { window.__loggyApplyDecorationParityV513?.(visibilityDraftV519); } catch {}
          refreshPreviewHoverV356(visibilityDraftV519);
        });
        return;
      }
      if (event.data?.type === 'loggy-theme-preview-decorations-v513') {
        const decorationDraftV513 = event.data.draft || {};
        try { window.__loggySetPreviewThemeV372?.(decorationDraftV513); } catch {
          window.__loggyActivePreviewThemeV372 = copy(decorationDraftV513);
        }
        forcePreviewDecorationSceneV510(decorationDraftV513);
        ensurePreviewDecorationNodesV516(decorationDraftV513);
        removeHiddenPreviewDecorationsV519(decorationDraftV513);
        try { window.__loggyApplyCanonicalPlacementV405?.(decorationDraftV513); } catch {}
        try { window.__loggyApplyDecorationParityV513?.(decorationDraftV513); } catch {}
        try { window.__loggyApplyDefaultMotionsV363?.(decorationDraftV513); } catch {}
        refreshPreviewHoverV356(decorationDraftV513);
        requestAnimationFrame(() => {
          forcePreviewDecorationSceneV510(decorationDraftV513);
          ensurePreviewDecorationNodesV516(decorationDraftV513);
          removeHiddenPreviewDecorationsV519(decorationDraftV513);
          try { window.__loggyApplyCanonicalPlacementV405?.(decorationDraftV513); } catch {}
          try { window.__loggyApplyDecorationParityV513?.(decorationDraftV513); } catch {}
          try { window.__loggyRepairDecorationImagesV494?.(decorationDraftV513); } catch {}
          refreshPreviewHoverV356(decorationDraftV513);
        });
        return;
      }
      if (event.data?.type !== 'loggy-theme-preview-apply-v307') return;
      const incomingDraftV372 = event.data.draft || {};
      try { window.__loggySetPreviewThemeV372?.(incomingDraftV372); } catch {
        window.__loggyActivePreviewThemeV372 = copy(incomingDraftV372);
      }
      previewPendingV354 = {
        draft: incomingDraftV372,
        resetView: event.data.resetViewV354 === true,
        requestId: Number(event.data.requestIdV354) || 0
      };
      drainPreviewQueueV354();
    });

    const ready = () => {
      try { parent.postMessage({ type: 'loggy-theme-preview-ready-v307' }, location.origin); } catch {}
    };
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => setTimeout(ready, 0), { once: true });
    else setTimeout(ready, 0);
    return;
  }

  if (window.__loggyThemeBuilderV307) return;
  window.__loggyThemeBuilderV307 = true;

  const STUDIO = query.get('dashboardThemeStudio') === '1' && query.get('studioV300') === '1';
  const studioAction = () => query.get('studioActionV300') === 'edit' ? 'edit' : 'create';
  const studioThemeId = () => String(query.get('studioThemeIdV300') || '');
  const studioSession = () => String(query.get('studioSessionV300') || '');
  const MODAL_ID = 'theme-builder-v307-modal';
  const STYLE_ID = 'theme-builder-v307-style';
  const SHARED_KEY = 'loggy-shared-themes-v40';
  const OVERRIDE_KEY = 'loggy-built-in-theme-overrides-v102';

  const TABS = [
    ['colors', 'Colors'], ['background', 'Background'], ['audio', 'Audio'],
    ['decorations', 'Decorations'], ['trinkets', 'Trinkets'], ['ai', 'Auto Theme']
  ];

  const ANIMATIONS = [
    ['float', 'Float'], ['bob', 'Bob Up & Down'], ['drift', 'Slow Drift'],
    ['travel', 'Travel Across'], ['fall', 'Fall / Rain'], ['spin', 'Slow Spin'],
    ['pulse', 'Pulse'], ['still', 'Still'], ['cross-screen', 'Across Screen'],
    ['gentle-sway', 'Gentle Sway'], ['breathe', 'Soft Breathe'], ['slow-rock', 'Slow Rock'],
    ['soft-glide', 'Soft Side Glide'], ['small-orbit', 'Small Orbit'], ['flutter', 'Light Flutter'],
    ['playful-wobble', 'Playful Wobble'], ['tiny-hop', 'Tiny Hop'],
    ['moody-wander-bounce', 'Moody Wander + Light Bounce'], ['travel-bounce', 'Travel + Light Bounce'],
    ['drift-sway', 'Drift + Sway'], ['orbit-pulse', 'Orbit + Pulse'], ['glide-bob', 'Glide + Bob'],
    ['float-twirl', 'Float + Soft Twirl'], ['zigzag-bounce', 'Zigzag + Bounce']
  ];

  const HOVER_ANIMATIONS = [
    ['lift', 'Lift & Pop'], ['bounce', 'Bounce'], ['wiggle', 'Wiggle'], ['spin', 'Quick Spin'],
    ['pulse', 'Pulse'], ['float', 'Soft Float'], ['tilt-lift', 'Tilt + Lift'],
    ['pop-wiggle', 'Pop + Wiggle'], ['squish', 'Soft Squish'], ['flip', 'Quick Flip'],
    ['jello', 'Jello Wobble'], ['mini-orbit', 'Mini Orbit'], ['side-nudge', 'Side Nudge'],
    ['double-hop', 'Double Hop'], ['soft-shiver', 'Soft Shiver']
  ];

  const DISTRIBUTIONS = [
    ['random', 'Organic scatter'], ['wide-random', 'Wide random scatter'],
    ['center-cluster', 'Loose center cluster'], ['corners', 'Corners & nearby edges'],
    ['side-fixed', 'Left & right edges'], ['side-random', 'Left & right edges · reshuffle'],
    ['top-bottom', 'Top & bottom edges'], ['all-edges-random', 'Random around all edges'],
    ['manual-fixed', 'Manual fixed positions · shuffle images']
  ];

  const FALLBACK_GRADIENTS = [
    ['Soft Dawn', 'linear-gradient(135deg,#fff5f0 0%,#f5efff 52%,#eef8ff 100%)'],
    ['Lavender Haze', 'linear-gradient(135deg,#eee8ff 0%,#f9f5ff 48%,#e8f1ff 100%)'],
    ['Peach Cream', 'linear-gradient(135deg,#fff0e5 0%,#fff9f3 52%,#ffe8ef 100%)'],
    ['Blue Mist', 'linear-gradient(135deg,#e7f4ff 0%,#f7fbff 55%,#ecebff 100%)'],
    ['Mint Cloud', 'linear-gradient(135deg,#e9fff5 0%,#f8fffb 48%,#e8f4ff 100%)'],
    ['Rose Milk', 'linear-gradient(135deg,#ffe8f0 0%,#fff7fa 55%,#f2eaff 100%)'],
    ['Midnight', 'linear-gradient(135deg,#111827 0%,#1f2937 55%,#312e81 100%)'],
    ['Plum Night', 'linear-gradient(135deg,#170f25 0%,#2b173d 54%,#4c1d52 100%)'],
    ['Ocean Night', 'linear-gradient(135deg,#071a2a 0%,#0d2b45 52%,#123c69 100%)'],
    ['Brown Sugar', 'linear-gradient(135deg,#2b1d18 0%,#503329 54%,#765244 100%)']
  ];

  const $ = (selector, root = document) => root?.querySelector?.(selector) || null;
  const $$ = (selector, root = document) => Array.from(root?.querySelectorAll?.(selector) || []);
  const clone = value => { try { return structuredClone(value); } catch {} try { return JSON.parse(JSON.stringify(value || {})); } catch { return { ...(value || {}) }; } };
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]));
  const attr = value => esc(value).replace(/`/g, '&#96;');
  const clamp = (value, min, max, fallback = min) => Math.max(min, Math.min(max, Number.isFinite(+value) ? +value : fallback));
  const isHex = value => /^#[0-9a-f]{6}$/i.test(String(value || '').trim());
  const safeHex = (value, fallback = '#ffffff') => isHex(value) ? String(value) : fallback;

  function hexToRgbV323(value) {
    const hex = safeHex(value, '#888888').slice(1);
    return [parseInt(hex.slice(0,2),16), parseInt(hex.slice(2,4),16), parseInt(hex.slice(4,6),16)];
  }
  function rgbToHexV323(rgb) {
    return '#' + rgb.map(value => Math.max(0, Math.min(255, Math.round(value))).toString(16).padStart(2,'0')).join('');
  }
  function mixColorV323(from, to, amount) {
    const a = hexToRgbV323(from), b = hexToRgbV323(to), t = Math.max(0, Math.min(1, Number(amount) || 0));
    return rgbToHexV323(a.map((value,index) => value + (b[index] - value) * t));
  }
  function luminanceV323(value) {
    const rgb = hexToRgbV323(value).map(channel => { const c = channel / 255; return c <= .03928 ? c / 12.92 : Math.pow((c + .055) / 1.055, 2.4); });
    return .2126 * rgb[0] + .7152 * rgb[1] + .0722 * rgb[2];
  }
  function readableOnV323(background) {
    return luminanceV323(background) > .42 ? '#171717' : '#f7f8fb';
  }
  function inferAppearanceV323(theme = {}) {
    const background = safeHex(theme?.background, '#ffffff');
    return luminanceV323(background) < .32 ? 'dark' : 'light';
  }
  function smartPaletteV323(seed, mode = 'light') {
    const main = safeHex(seed, '#8b6fd8');
    const dark = mode === 'dark';
    let accent = main;
    if (dark && luminanceV323(accent) < .16) accent = mixColorV323(accent, '#ffffff', .34);
    if (!dark && luminanceV323(accent) > .72) accent = mixColorV323(accent, '#000000', .28);
    const page = dark ? mixColorV323(main, '#000000', .80) : mixColorV323(main, '#ffffff', .94);
    const surface = dark ? mixColorV323(main, '#000000', .68) : mixColorV323(main, '#ffffff', .88);
    const surface2 = dark ? mixColorV323(main, '#000000', .54) : mixColorV323(main, '#ffffff', .78);
    const hover = dark ? mixColorV323(accent, '#000000', .32) : mixColorV323(accent, '#ffffff', .64);
    const selected = dark ? mixColorV323(accent, '#ffffff', .12) : mixColorV323(accent, '#000000', .16);
    const text = dark ? '#f7f8fb' : '#171717';
    const muted = dark ? mixColorV323(text, page, .30) : mixColorV323(text, page, .38);
    const border = dark ? mixColorV323(accent, '#ffffff', .28) : mixColorV323(accent, '#000000', .24);
    return { main, accent, page, surface, surface2, hover, selected, text, muted, border, dark };
  }
  function smartColorForFieldV323(key, label, palette) {
    const semantic = `${key} ${label || ''}`.toLowerCase();
    const hover = /hover/.test(semantic);
    const selected = /selected|active|focus/.test(semantic);
    const textLike = /text|title|icon|backbutton/.test(semantic);
    const borderLike = /border|outline/.test(semantic);
    const backgroundLike = /background|surface|card/.test(semantic);
    if (key === 'background' || key === 'dashboardBackgroundV40') return palette.page;
    if (key === 'surface' || key === 'dashboardCardV40') return palette.surface;
    if (key === 'text' || key === 'dashboardTextV40') return palette.text;
    if (key === 'muted') return palette.muted;
    if (key === 'accent' || key === 'dashboardAccentV40') return palette.accent;
    if (key === 'border') return palette.border;
    if (key === 'hoverColor') return palette.hover;
    if (/logiconbackground/.test(semantic)) return palette.surface2;
    if (/category/.test(semantic) && backgroundLike && !hover && !selected) return palette.surface2;
    if ((hover || selected) && textLike) return readableOnV323(hover ? palette.hover : palette.selected);
    if (textLike) return palette.text;
    if ((hover || selected) && borderLike) return palette.accent;
    if (borderLike) return palette.border;
    if (hover && backgroundLike) return palette.hover;
    if (selected && backgroundLike) return palette.selected;
    if (backgroundLike) return palette.surface;
    if (/accent|button/.test(semantic)) return palette.accent;
    if (/muted|secondary/.test(semantic)) return palette.muted;
    if (/color/.test(semantic)) return palette.accent;
    return palette.accent;
  }

  const state = {
    mode: 'idle', kind: 'new', themeId: '', sourceThemeId: '', draft: {}, original: {}, modal: null,
    touched: new Set(), dashboardOverlayKeys: new Set(), decorationsDirty: false, openToken: 0,
    previewReady: false, previewFrame: null, previewRaf: 0, previewResetViewV354: false,
    previewRequestV354: 0, previewAwaitingV354: 0, audioBundleCache: new Map(),
    aiJsonText: '', aiJsonAppliedV325: false, aiThemeMode: 'light', aiVariantsV376: { light:null, dark:null }, smartPaletteSeed: '#8b6fd8', smartPaletteMode: 'light', autoThemeTool: '',
    // V432: AI prompt behavior controls. Basic preserves the current restrained
    // builder behavior; Advanced may style deeper UI surfaces and richer scenes.
    aiBuilderDepthV432: 'basic', aiBackgroundFocusV479: 'standard', aiDecorationModeV432: 'decorations',
    // V400: decorations/media behavior and explicit manual control overrides are
    // shared across Light/Dark. Palette colors remain variant-specific.
    aiSharedDecorationsV400: null, aiSharedOverridesV400: Object.create(null),
    // V416: one authoritative intro-song selection + monotonic request token.
    // Async uploads/reuse fetches must never be able to overwrite a newer choice.
    introSourceRevisionV416: 0, introSelectionV416: { url:'', name:'', projectPath:'', sourceThemeId:'' }
  };

  // V493 — Prevent Decoration Overlap is placement-only. Preserve the exact
  // visible opacity of every decoration across the overlap remount/reflow.
  function decorationEffectiveOpacityFromDraftV493(asset) {
    const global = clamp(state.draft?.decorationsOpacityV117, 0, 100, 100) / 100;
    const own = clamp(asset?.opacityV109 ?? asset?.opacity, 0, 100, 100) / 100;
    return asset?.opacityOverrideV326 === true ? own : global;
  }
  function captureDecorationOpacityLockV493() {
    const modal = state.modal;
    const assets = Array.isArray(state.draft?.backgroundSvgs) ? state.draft.backgroundSvgs : [];
    const values = assets.map(asset => decorationEffectiveOpacityFromDraftV493(asset));
    if (modal) {
      modal.querySelectorAll('.theme-builder-live-art-item,.theme-builder-dashboard-art-item-v45,.theme-builder-dashboard-art-item-v40,.theme-builder-dashboard-art-item').forEach((item, displayIndex) => {
        let index = Number(item.dataset.svgIndex);
        if (!Number.isFinite(index) || index < 0 || index >= assets.length) index = displayIndex % Math.max(1, assets.length);
        const visible = Number.parseFloat(getComputedStyle(item).opacity);
        if (Number.isFinite(visible) && index >= 0 && index < values.length) values[index] = visible;
      });
    }
    window.__loggyDecorationOpacityLockV493 = { modal, values };
  }
  function clearDecorationOpacityLockV493() {
    const lock = window.__loggyDecorationOpacityLockV493;
    if (!lock || !state.modal || lock.modal === state.modal) delete window.__loggyDecorationOpacityLockV493;
  }

  // V376 — AI themes keep BOTH appearance variants inside one saved theme.
  // The runtime still receives only the selected variant, so existing theme code
  // does not need to understand the dual-version container.
  const AI_VARIANTS_KEY_V376 = 'themeBuilderAiVariantsV376';
  const AI_SELECTED_KEY_V376 = 'themeBuilderAiSelectedVariantV376';
  const AI_META_KEYS_V376 = new Set([
    AI_VARIANTS_KEY_V376, AI_SELECTED_KEY_V376,
    'themeBuilderAiJsonV364','themeBuilderAiUsedV364','themeBuilderAiModeV364','themeBuilderAutoToolV364'
  ]);

  function stripAiVariantMetaV376(theme = {}) {
    const out = clone(theme || {});
    AI_META_KEYS_V376.forEach(key => { try { delete out[key]; } catch {} });
    return out;
  }

  function normalizeStoredAiVariantsV376(theme = {}) {
    const raw = theme?.[AI_VARIANTS_KEY_V376];
    const out = { light:null, dark:null };
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return out;
    ['light','dark'].forEach(mode => {
      const value = raw?.[mode];
      if (value && typeof value === 'object' && !Array.isArray(value)) out[mode] = stripAiVariantMetaV376(value);
    });
    return out;
  }

  function hasAiVariantV376(mode) {
    const value = state.aiVariantsV376?.[mode];
    return !!(value && typeof value === 'object' && !Array.isArray(value));
  }

  function aiVariantCountV376() {
    return (hasAiVariantV376('light') ? 1 : 0) + (hasAiVariantV376('dark') ? 1 : 0);
  }

  function syncActiveAiVariantV376() {
    const mode = state.aiThemeMode === 'dark' ? 'dark' : 'light';
    if (!hasAiVariantV376(mode)) return;
    state.aiVariantsV376[mode] = stripAiVariantMetaV376(state.draft || {});
    // Decorations are one shared visual identity across both AI variants.
    if (Array.isArray(state.draft?.backgroundSvgs)) state.aiSharedDecorationsV400 = clone(state.draft.backgroundSvgs);
  }

  // V400 — manual non-palette overrides belong to the THEME, not to only the
  // currently visible appearance. This is what keeps choices such as page
  // backdrops, distribution, animation, opacity, audio behavior, radius, etc.
  // unchanged when the user flips between Light and Dark. Color pickers are
  // intentionally excluded so each appearance can retain its own contrast.
  function rememberAiSharedOverrideV400(key, value = state.draft?.[key]) {
    if (!key || !(aiVariantCountV376() > 0 || state.autoThemeTool === 'ai')) return;
    state.aiSharedOverridesV400 ||= Object.create(null);
    state.aiSharedOverridesV400[key] = clone(value);
  }
  function rememberAiSharedDecorationsV400() {
    if (!(aiVariantCountV376() > 0 || state.autoThemeTool === 'ai')) return;
    state.aiSharedDecorationsV400 = clone(Array.isArray(state.draft?.backgroundSvgs) ? state.draft.backgroundSvgs : []);
  }
  function applyAiSharedStateV400(theme = {}) {
    const out = theme;
    const shared = state.aiSharedOverridesV400 || {};
    for (const [key,value] of Object.entries(shared)) out[key] = clone(value);
    if (Array.isArray(state.aiSharedDecorationsV400)) out.backgroundSvgs = clone(state.aiSharedDecorationsV400);
    return out;
  }
  function propagateAiSharedStateToVariantsV400() {
    if (!(state.aiVariantsV376 && typeof state.aiVariantsV376 === 'object')) return;
    for (const mode of ['light','dark']) {
      const v = state.aiVariantsV376[mode];
      if (!v || typeof v !== 'object' || Array.isArray(v)) continue;
      applyAiSharedStateV400(v);
    }
  }


  // V496 — Heading Backdrop manual controls have one durable source of truth.
  // This survives AI Light/Dark snapshots and older preview/apply layers.
  function headingBackdropAuthorityV496(theme = state.draft || {}) {
    const saved = theme?.themeBuilderHeadingBackdropOverrideV496;
    const legacy = saved && typeof saved === 'object' && !Array.isArray(saved) ? saved : {};
    const own = key => Object.prototype.hasOwnProperty.call(theme || {}, key);
    // V504: the visible flat controls are the live source of truth. The saved
    // override object is fallback-only for old themes. Previously a stale
    // {enabled:false} object could silently turn the preview back off even while
    // the current Theme Builder toggle visibly said ON.
    return {
      enabled: own('headingBackgroundEnabledV429') ? theme.headingBackgroundEnabledV429 === true : legacy.enabled === true,
      color: safeHex(own('headingBackgroundColorV452') ? theme.headingBackgroundColorV452 : legacy.color, safeHex(theme?.contentBackdropColor, theme?.surface || '#ffffff')),
      opacity: clamp(own('headingBackgroundOpacityV452') ? theme.headingBackgroundOpacityV452 : legacy.opacity, 0, 100, 88),
      padding: clamp(own('headingBackgroundPaddingV429') ? theme.headingBackgroundPaddingV429 : legacy.padding, 0, 40, 10),
      radius: clamp(own('headingBackgroundRadiusV452') ? theme.headingBackgroundRadiusV452 : legacy.radius, 0, 40, Number(theme?.radius) || 10)
    };
  }
  function currentHeadingBackdropAuthorityV496(theme = state.draft || {}) {
    return {
      enabled: theme?.headingBackgroundEnabledV429 === true,
      color: safeHex(theme?.headingBackgroundColorV452, safeHex(theme?.contentBackdropColor, theme?.surface || '#ffffff')),
      opacity: clamp(theme?.headingBackgroundOpacityV452, 0, 100, 88),
      padding: clamp(theme?.headingBackgroundPaddingV429, 0, 40, 10),
      radius: clamp(theme?.headingBackgroundRadiusV452, 0, 40, Number(theme?.radius) || 10)
    };
  }
  function applyHeadingBackdropAuthorityV496(theme, authority = null) {
    if (!theme || typeof theme !== 'object') return theme;
    const a = authority || headingBackdropAuthorityV496(theme);
    theme.headingBackgroundEnabledV429 = a.enabled === true;
    theme.headingBackgroundColorV452 = safeHex(a.color, '#ffffff');
    theme.headingBackgroundOpacityV452 = clamp(a.opacity, 0, 100, 88);
    theme.headingBackgroundPaddingV429 = clamp(a.padding, 0, 40, 10);
    theme.headingBackgroundRadiusV452 = clamp(a.radius, 0, 40, Number(theme?.radius) || 10);
    theme.themeBuilderHeadingBackdropOverrideV496 = {
      enabled: theme.headingBackgroundEnabledV429,
      color: theme.headingBackgroundColorV452,
      opacity: theme.headingBackgroundOpacityV452,
      padding: theme.headingBackgroundPaddingV429,
      radius: theme.headingBackgroundRadiusV452
    };
    return theme;
  }
  function rememberHeadingBackdropAuthorityV496() {
    const a = applyHeadingBackdropAuthorityV496(state.draft || {}, currentHeadingBackdropAuthorityV496(state.draft || {}));
    for (const key of ['headingBackgroundEnabledV429','headingBackgroundColorV452','headingBackgroundOpacityV452','headingBackgroundPaddingV429','headingBackgroundRadiusV452','themeBuilderHeadingBackdropOverrideV496']) {
      rememberAiSharedOverrideV400(key, clone(a[key]));
    }
    propagateAiSharedStateToVariantsV400();
  }

  // V492 — Quiz Box Backdrop manual controls have one durable source of truth.
  // Keep this separate from AI variant snapshots so a stale Light/Dark value can
  // never replace what the user picked in the Theme Builder.
  function quizBackdropAuthorityV492(theme = state.draft || {}) {
    const saved = theme?.themeBuilderQuizBackdropOverrideV492;
    const src = saved && typeof saved === 'object' && !Array.isArray(saved) ? saved : theme;
    return {
      enabled: src.enabled ?? src.quizBackdropEnabledV456 === true,
      color: safeHex(src.color ?? src.quizBackdropColorV456, safeHex(theme?.quizBackdropColorV456, safeHex(theme?.contentBackdropColor, theme?.surface || '#ffffff'))),
      opacity: clamp(src.opacity ?? src.quizBackdropOpacityV456, 0, 100, 92),
      radius: clamp(src.radius ?? src.quizBackdropRadiusV456, 0, 40, Number(theme?.radius) || 10),
      padding: clamp(src.padding ?? src.quizBackdropPaddingV459, 0, 40, 16)
    };
  }
  function currentQuizBackdropAuthorityV492(theme = state.draft || {}) {
    return {
      enabled: theme?.quizBackdropEnabledV456 === true,
      color: safeHex(theme?.quizBackdropColorV456, safeHex(theme?.contentBackdropColor, theme?.surface || '#ffffff')),
      opacity: clamp(theme?.quizBackdropOpacityV456,0,100,92),
      radius: clamp(theme?.quizBackdropRadiusV456,0,40,Number(theme?.radius)||10),
      padding: clamp(theme?.quizBackdropPaddingV459,0,40,16)
    };
  }
  function applyQuizBackdropAuthorityV492(theme, authority = null) {
    if (!theme || typeof theme !== 'object') return theme;
    const a = authority || quizBackdropAuthorityV492(theme);
    theme.quizBackdropEnabledV456 = a.enabled === true;
    theme.quizBackdropColorV456 = safeHex(a.color, '#ffffff');
    theme.quizBackdropOpacityV456 = clamp(a.opacity,0,100,92);
    theme.quizBackdropRadiusV456 = clamp(a.radius,0,40,10);
    theme.quizBackdropPaddingV459 = clamp(a.padding,0,40,16);
    theme.themeBuilderQuizBackdropOverrideV492 = {
      enabled: theme.quizBackdropEnabledV456,
      color: theme.quizBackdropColorV456,
      opacity: theme.quizBackdropOpacityV456,
      radius: theme.quizBackdropRadiusV456,
      padding: theme.quizBackdropPaddingV459
    };
    return theme;
  }
  function rememberQuizBackdropAuthorityV492() {
    const a = applyQuizBackdropAuthorityV492(state.draft || {}, currentQuizBackdropAuthorityV492(state.draft || {}));
    rememberAiSharedOverrideV400('quizBackdropEnabledV456', a.quizBackdropEnabledV456);
    rememberAiSharedOverrideV400('quizBackdropColorV456', a.quizBackdropColorV456);
    rememberAiSharedOverrideV400('quizBackdropOpacityV456', a.quizBackdropOpacityV456);
    rememberAiSharedOverrideV400('quizBackdropRadiusV456', a.quizBackdropRadiusV456);
    rememberAiSharedOverrideV400('quizBackdropPaddingV459', a.quizBackdropPaddingV459);
    rememberAiSharedOverrideV400('themeBuilderQuizBackdropOverrideV492', a.themeBuilderQuizBackdropOverrideV492);
    propagateAiSharedStateToVariantsV400();
  }

  function toast(message) {
    try { if (typeof showFeatureToast === 'function') return showFeatureToast(message); } catch {}
    console.info('[Theme Builder V307]', message);
  }

  function titleFromKey(key) {
    return String(key || '').replace(/V\d+$/i, '').replace(/([a-z0-9])([A-Z])/g, '$1 $2').replace(/[_-]+/g, ' ').replace(/\b\w/g, c => c.toUpperCase()).trim();
  }

  function displayName(themeId, fallback = '') {
    try { const value = getThemeDisplayNameV30?.(themeId); if (value) return String(value); } catch {}
    return String(fallback || themeId || 'Theme').replace(/^theme-/, '').replace(/[-_]+/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  }

  function themeSlug(themeId) {
    let slug = '';
    try { slug = String(getBuiltInThemeNameV30?.(themeId) || '').trim(); } catch {}
    if (!slug) slug = String(themeId || '').replace(/^theme-/, '').trim();
    return slug.toLowerCase().replace(/[^a-z0-9._-]+/g, '-');
  }

  function readJsonStorage(key, fallback) {
    try { const parsed = JSON.parse(localStorage.getItem(key) || ''); return parsed ?? fallback; } catch { return fallback; }
  }
  function writeJsonStorage(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); return true; } catch { return false; }
  }

  const BACKGROUND_SOURCES_V311 = new Set(['theme-color','gradient','image','custom-code']);
  function inferBackgroundSourceV311(theme = {}) {
    const explicit = String(theme?.backgroundSourceV311 || '').trim();
    if (BACKGROUND_SOURCES_V311.has(explicit)) return explicit;
    const code = String(theme?.interactiveBackgroundCodeV56 || '').trim();
    const image = String(theme?.backgroundImage || '').trim();
    const gradient = String(theme?.backgroundGradientV56 || '').trim();
    const mode = String(theme?.backgroundModeV158 || '').trim();
    // Match the old runtime's effective priority when migrating an existing theme.
    if (code) return 'custom-code';
    if (mode === 'image' && image) return 'image';
    if (mode === 'gradient' && gradient) return 'gradient';
    if (mode === 'solid') return 'theme-color';
    if (image) return 'image';
    if (gradient) return 'gradient';
    return 'theme-color';
  }
  function canonicalBackgroundDraftV311(theme = {}) {
    const out = clone(theme || {});
    const source = inferBackgroundSourceV311(out);
    out.backgroundSourceV311 = source;
    // Exactly one creative background source reaches the runtime. This removes all
    // precedence guessing from both the real app and Theme Builder preview.
    if (source === 'gradient') {
      out.backgroundModeV158 = 'gradient';
      out.backgroundImage = '';
      out.backgroundImageName = '';
      out.backgroundImageProjectPath = '';
      out.interactiveBackgroundCodeV56 = '';
    } else if (source === 'image') {
      out.backgroundModeV158 = 'image';
      out.backgroundGradientV56 = '';
      out.backgroundGradientNameV56 = '';
      out.interactiveBackgroundCodeV56 = '';
    } else if (source === 'custom-code') {
      out.backgroundModeV158 = 'solid';
      out.backgroundGradientV56 = '';
      out.backgroundGradientNameV56 = '';
      out.backgroundImage = '';
      out.backgroundImageName = '';
      out.backgroundImageProjectPath = '';
    } else {
      out.backgroundModeV158 = 'solid';
      out.backgroundGradientV56 = '';
      out.backgroundGradientNameV56 = '';
      out.backgroundImage = '';
      out.backgroundImageName = '';
      out.backgroundImageProjectPath = '';
      out.interactiveBackgroundCodeV56 = '';
    }
    return out;
  }

  function inferPageBackdropsEnabledV312(theme = {}) {
    if (typeof theme?.pageBackdropsEnabledV312 === 'boolean') return theme.pageBackdropsEnabledV312;
    return theme?.dailyLogBackgroundEnabled === true || theme?.contentBackdropEnabled === true;
  }

  function inferShapeTypeEnabledV312() {
    // V326: Shape & Type is always available. The old "Use it" switch was
    // confusing and could silently reset the user's radius/shadow/font.
    return true;
  }

  function canonicalThemeDraftV312(theme = {}) {
    const out = canonicalBackgroundDraftV311(theme);
    applyHeadingBackdropAuthorityV496(out);
    applyQuizBackdropAuthorityV492(out);
    const useBackdrops = inferPageBackdropsEnabledV312(out);
    out.pageBackdropsEnabledV312 = useBackdrops;
    if (!useBackdrops) {
      out.dailyLogBackgroundEnabled = false;
      out.contentBackdropEnabled = false;
    }
    out.shapeTypeEnabledV312 = true;
    if (!Number.isFinite(Number(out.radius))) out.radius = 20;
    if (!Number.isFinite(Number(out.shadow))) out.shadow = 0;
    out.font = String(out.font || 'hand');
    return out;
  }

  function blankDraft() {
    let out = {};
    const names = [
      'FEATURE_SUITE_DEFAULT_THEME','CUSTOM_THEME_MEDIA_DEFAULTS_V3','CUSTOM_THEME_VISUAL_DEFAULTS_V4',
      'THEME_BUILDER_NAV_DEFAULTS_V6','CUSTOM_THEME_ADVANCED_DEFAULTS_V10','CUSTOM_THEME_V11_DEFAULTS',
      'CUSTOM_THEME_V12_DEFAULTS','CUSTOM_THEME_V13_DEFAULTS','CUSTOM_THEME_V15_DEFAULTS','CUSTOM_THEME_V19_DEFAULTS',
      'CUSTOM_THEME_V20_DEFAULTS','CUSTOM_THEME_V26_DEFAULTS','CUSTOM_THEME_ACCESSORY_DEFAULTS_V32'
    ];
    for (const name of names) {
      try { const value = eval(name); if (value && typeof value === 'object') out = { ...out, ...clone(value) }; } catch {}
    }
    try { const generated = window.__loggyMakeBlankThemeV257?.(); if (generated && typeof generated === 'object') out = { ...out, ...clone(generated) }; } catch {}

    const background = safeHex(out.background, '#ffffff');
    const surface = safeHex(out.surface, '#ffffff');
    const text = safeHex(out.text, '#111111');
    const accent = safeHex(out.accent, '#e9e9e9');
    return {
      ...out,
      name: 'My Custom Theme', background, surface, text, accent,
      border: safeHex(out.border, text), muted: safeHex(out.muted, '#666666'), hoverColor: safeHex(out.hoverColor, accent),
      tabIconColor: safeHex(out.tabIconColor, text), tabTitleColor: safeHex(out.tabTitleColor, text), backButtonColor: safeHex(out.backButtonColor, text),
      tabNavBackgroundColor: safeHex(out.tabNavBackgroundColor, surface), tabNavIndividualBackgroundColor: safeHex(out.tabNavIndividualBackgroundColor, surface),
      dailyLogBackgroundEnabled: !!out.dailyLogBackgroundEnabled,
      dailyLogBackgroundColor: safeHex(out.dailyLogBackgroundColor, surface),
      dailyLogBackgroundOpacity: clamp(out.dailyLogBackgroundOpacity, 0, 100, 92),
      contentBackdropEnabled: !!out.contentBackdropEnabled,
      contentBackdropColor: safeHex(out.contentBackdropColor, surface),
      contentBackdropOpacity: clamp(out.contentBackdropOpacity, 0, 100, 92),
      headingBackgroundEnabledV429: out.headingBackgroundEnabledV429 === true,
      headingBackgroundPaddingV429: clamp(out.headingBackgroundPaddingV429, 0, 40, 10),
      headingBackgroundColorV452: safeHex(out.headingBackgroundColorV452, safeHex(out.contentBackdropColor, surface)),
      headingBackgroundOpacityV452: clamp(out.headingBackgroundOpacityV452, 0, 100, clamp(out.contentBackdropOpacity, 0, 100, 88)),
      headingBackgroundRadiusV452: clamp(out.headingBackgroundRadiusV452, 0, 40, Number(out.radius) || 10),
      pageBackdropColorV452: safeHex(out.pageBackdropColorV452, safeHex(out.dailyLogBackgroundColor, safeHex(out.contentBackdropColor, surface))),
      pageBackdropOpacityV452: clamp(out.pageBackdropOpacityV452, 0, 100, clamp(out.dailyLogBackgroundOpacity, 0, 100, 92)),
      quizBackdropEnabledV456: out.quizBackdropEnabledV456 === true,
      quizBackdropColorV456: safeHex(out.quizBackdropColorV456, safeHex(out.contentBackdropColor, surface)),
      quizBackdropOpacityV456: clamp(out.quizBackdropOpacityV456, 0, 100, clamp(out.contentBackdropOpacity, 0, 100, 92)),
      quizBackdropRadiusV456: clamp(out.quizBackdropRadiusV456, 0, 40, Number(out.radius) || 10),
      quizBackdropPaddingV459: clamp(out.quizBackdropPaddingV459, 0, 40, 16),
      advancedUiEnabledV432: out.advancedUiEnabledV432 === true,
      advancedBorderStyleV432: ['solid','dashed','dotted','double'].includes(String(out.advancedBorderStyleV432)) ? String(out.advancedBorderStyleV432) : 'solid',
      advancedInputBorderStyleV432: ['solid','dashed','dotted','double'].includes(String(out.advancedInputBorderStyleV432)) ? String(out.advancedInputBorderStyleV432) : 'solid',
      advancedButtonBorderStyleV432: ['solid','dashed','dotted','double'].includes(String(out.advancedButtonBorderStyleV432)) ? String(out.advancedButtonBorderStyleV432) : 'solid',
      advancedBorderWidthV432: clamp(out.advancedBorderWidthV432, 1, 4, 1),
      advancedInputRadiusV432: clamp(out.advancedInputRadiusV432, 0, 28, Number(out.radius) || 10),
      advancedCardRadiusV432: clamp(out.advancedCardRadiusV432, 0, 28, Number(out.radius) || 10),
      advancedButtonRadiusV432: clamp(out.advancedButtonRadiusV432, 0, 28, Number(out.radius) || 10),
      aiDecorationsModeV432: String(out.aiDecorationsModeV432 || '') === 'none' ? 'none' : 'decorations',
      dashboardBackgroundV40: safeHex(out.dashboardBackgroundV40, background), dashboardCardV40: safeHex(out.dashboardCardV40, surface),
      dashboardTextV40: safeHex(out.dashboardTextV40, text), dashboardAccentV40: safeHex(out.dashboardAccentV40, accent),
      dashboardTitleColorV79: safeHex(out.dashboardTitleColorV79, text), dashboardIconColorV81: safeHex(out.dashboardIconColorV81, text),
      dashboardLogIconColorV85: safeHex(out.dashboardLogIconColorV85, text),
      dashboardLogIconBackgroundV107: safeHex(out.dashboardLogIconBackgroundV107, surface),
      dashboardLogButtonBackgroundV391: safeHex(out.dashboardLogButtonBackgroundV391, safeHex(out.dashboardLogIconBackgroundV107, surface)),
      dashboardLogButtonTextColorV391: safeHex(out.dashboardLogButtonIconColorV391, safeHex(out.dashboardLogIconColorV85, text)),
      dashboardLogButtonIconColorV391: safeHex(out.dashboardLogButtonIconColorV391, safeHex(out.dashboardLogIconColorV85, text)),
      dashboardLogButtonBorderColorV391: safeHex(out.dashboardLogButtonBorderColorV391, safeHex(out.border, text)),
      dashboardLogButtonHoverBackgroundV391: safeHex(out.dashboardLogButtonHoverBackgroundV391, safeHex(out.hoverColor, accent)),
      dashboardLogButtonHoverTextColorV391: safeHex(out.dashboardLogButtonHoverTextColorV391, safeHex(out.dashboardTextV40, text)),
      dashboardLogButtonHoverIconColorV391: safeHex(out.dashboardLogButtonHoverIconColorV391, safeHex(out.dashboardLogIconColorV85, text)),
      dashboardLogButtonHoverBorderColorV391: safeHex(out.dashboardLogButtonHoverBorderColorV391, safeHex(out.border, text)),
      dashboardNewLogButtonBackgroundV391: safeHex(out.dashboardLogButtonBackgroundV391, safeHex(out.dashboardLogIconBackgroundV107, surface)),
      dashboardNewLogButtonTextColorV391: safeHex(out.dashboardLogButtonIconColorV391, safeHex(out.dashboardLogIconColorV85, text)),
      dashboardNewLogButtonIconColorV391: safeHex(out.dashboardLogButtonIconColorV391, safeHex(out.dashboardLogIconColorV85, text)),
      dashboardNewLogButtonBorderColorV391: safeHex(out.dashboardLogButtonBorderColorV391, safeHex(out.border, text)),
      dashboardNewLogButtonHoverBackgroundV391: safeHex(out.dashboardLogButtonHoverBackgroundV391, safeHex(out.hoverColor, accent)),
      dashboardNewLogButtonHoverTextColorV391: safeHex(out.dashboardLogButtonHoverTextColorV391, safeHex(out.dashboardTextV40, text)),
      dashboardNewLogButtonHoverIconColorV391: safeHex(out.dashboardLogButtonHoverIconColorV391, safeHex(out.dashboardLogIconColorV85, text)),
      dashboardNewLogButtonHoverBorderColorV391: safeHex(out.dashboardLogButtonHoverBorderColorV391, safeHex(out.border, text)),
      dashboardCreateLogIconHoverColorV320: safeHex(out.dashboardCreateLogIconHoverColorV320, text),
      dashboardCreateLogIconHoverBackgroundV320: safeHex(out.dashboardCreateLogIconHoverBackgroundV320, '#eeeeee'),
      dashboardCreateLogCategoryBackgroundColorV321: safeHex(out.dashboardCreateLogCategoryBackgroundColorV321, surface),
      dashboardCreateLogCategoryTextColorV321: safeHex(out.dashboardCreateLogCategoryTextColorV321, text),
      dashboardCreateLogCategoryBorderColorV321: safeHex(out.dashboardCreateLogCategoryBorderColorV321, text),
      dashboardCreateLogCategoryHoverBackgroundColorV321: safeHex(out.dashboardCreateLogCategoryHoverBackgroundColorV321, '#eeeeee'),
      dashboardCreateLogCategoryHoverTextColorV321: safeHex(out.dashboardCreateLogCategoryHoverTextColorV321, text),
      dashboardCreateLogCategoryHoverBorderColorV321: safeHex(out.dashboardCreateLogCategoryHoverBorderColorV321, text),

      dashboardCreateLogOverlayColorV396: safeHex(out.dashboardCreateLogOverlayColorV396, background),
      dashboardCreateLogModalBackgroundColorV396: safeHex(out.dashboardCreateLogModalBackgroundColorV396, safeHex(out.settingsModalBackgroundColorV380, surface)),
      dashboardCreateLogModalTextColorV396: safeHex(out.dashboardCreateLogModalTextColorV396, safeHex(out.settingsModalTextColorV380, text)),
      dashboardCreateLogModalBorderColorV396: safeHex(out.dashboardCreateLogModalBorderColorV396, safeHex(out.settingsModalBorderColorV380, out.border || text)),
      dashboardCreateLogTitleColorV396: safeHex(out.dashboardCreateLogTitleColorV396, safeHex(out.dashboardCreateLogModalTextColorV396, text)),
      dashboardCreateLogLabelColorV396: safeHex(out.dashboardCreateLogLabelColorV396, safeHex(out.dashboardCreateLogModalTextColorV396, text)),
      dashboardCreateLogInputBackgroundColorV396: safeHex(out.dashboardCreateLogInputBackgroundColorV396, surface),
      dashboardCreateLogInputTextColorV396: safeHex(out.dashboardCreateLogInputTextColorV396, text),
      dashboardCreateLogInputBorderColorV396: safeHex(out.dashboardCreateLogInputBorderColorV396, out.border || text),
      dashboardCreateLogInputHoverBackgroundColorV396: safeHex(out.dashboardCreateLogInputHoverBackgroundColorV396, safeHex(out.dashboardCreateLogInputBackgroundColorV396, surface)),
      dashboardCreateLogInputHoverTextColorV396: safeHex(out.dashboardCreateLogInputHoverTextColorV396, safeHex(out.dashboardCreateLogInputTextColorV396, text)),
      dashboardCreateLogInputHoverBorderColorV396: safeHex(out.dashboardCreateLogInputHoverBorderColorV396, safeHex(out.hoverColor, out.border || text)),
      dashboardCreateLogInputFocusBackgroundColorV396: safeHex(out.dashboardCreateLogInputFocusBackgroundColorV396, safeHex(out.dashboardCreateLogInputBackgroundColorV396, surface)),
      dashboardCreateLogInputFocusTextColorV396: safeHex(out.dashboardCreateLogInputFocusTextColorV396, safeHex(out.dashboardCreateLogInputTextColorV396, text)),
      dashboardCreateLogInputFocusBorderColorV396: safeHex(out.dashboardCreateLogInputFocusBorderColorV396, safeHex(out.accent, out.border || text)),
      dashboardCreateLogIconBackgroundColorV396: safeHex(out.dashboardCreateLogIconBackgroundColorV396, safeHex(out.dashboardCreateLogModalBackgroundColorV396, surface)),
      dashboardCreateLogIconColorV396: safeHex(out.dashboardCreateLogIconColorV396, text),
      dashboardCreateLogIconBorderColorV396: safeHex(out.dashboardCreateLogIconBorderColorV396, out.border || text),
      dashboardCreateLogIconHoverBackgroundColorV396: safeHex(out.dashboardCreateLogIconHoverBackgroundColorV396, safeHex(out.dashboardCreateLogIconHoverBackgroundV320, out.hoverColor || accent)),
      dashboardCreateLogIconHoverColorV396: safeHex(out.dashboardCreateLogIconHoverColorV396, safeHex(out.dashboardCreateLogIconHoverColorV320, text)),
      dashboardCreateLogIconHoverBorderColorV396: safeHex(out.dashboardCreateLogIconHoverBorderColorV396, out.border || text),
      dashboardCreateLogIconSelectedBackgroundColorV396: safeHex(out.dashboardCreateLogIconSelectedBackgroundColorV396, accent),
      dashboardCreateLogIconSelectedColorV396: safeHex(out.dashboardCreateLogIconSelectedColorV396, text),
      dashboardCreateLogIconSelectedBorderColorV396: safeHex(out.dashboardCreateLogIconSelectedBorderColorV396, out.border || text),
      dashboardCreateLogButtonBackgroundColorV396: safeHex(out.dashboardCreateLogButtonBackgroundColorV396, safeHex(out.dashboardCreateLogModalBackgroundColorV396, surface)),
      dashboardCreateLogButtonTextColorV396: safeHex(out.dashboardCreateLogButtonTextColorV396, text),
      dashboardCreateLogButtonIconColorV396: safeHex(out.dashboardCreateLogButtonIconColorV396, safeHex(out.dashboardCreateLogButtonTextColorV396, text)),
      dashboardCreateLogButtonBorderColorV396: safeHex(out.dashboardCreateLogButtonBorderColorV396, out.border || text),
      dashboardCreateLogButtonHoverBackgroundColorV396: safeHex(out.dashboardCreateLogButtonHoverBackgroundColorV396, safeHex(out.hoverColor, accent)),
      dashboardCreateLogButtonHoverTextColorV396: safeHex(out.dashboardCreateLogButtonHoverTextColorV396, text),
      dashboardCreateLogButtonHoverIconColorV396: safeHex(out.dashboardCreateLogButtonHoverIconColorV396, safeHex(out.dashboardCreateLogButtonHoverTextColorV396, text)),
      dashboardCreateLogButtonHoverBorderColorV396: safeHex(out.dashboardCreateLogButtonHoverBorderColorV396, out.border || text),
      dashboardCreateLogCloseBackgroundColorV396: safeHex(out.dashboardCreateLogCloseBackgroundColorV396, safeHex(out.dashboardCreateLogModalBackgroundColorV396, surface)),
      dashboardCreateLogCloseIconColorV396: safeHex(out.dashboardCreateLogCloseIconColorV396, text),
      dashboardCreateLogCloseBorderColorV396: safeHex(out.dashboardCreateLogCloseBorderColorV396, out.border || text),
      dashboardCreateLogCloseHoverBackgroundColorV396: safeHex(out.dashboardCreateLogCloseHoverBackgroundColorV396, safeHex(out.hoverColor, surface)),
      dashboardCreateLogCloseHoverIconColorV396: safeHex(out.dashboardCreateLogCloseHoverIconColorV396, text),
      dashboardCreateLogCloseHoverBorderColorV396: safeHex(out.dashboardCreateLogCloseHoverBorderColorV396, out.border || text),

      themeSettingsPlusIconColorV322: safeHex(out.themeSettingsPlusIconColorV322, text),
      themeSettingsPlusBackgroundColorV322: safeHex(out.themeSettingsPlusBackgroundColorV322, surface),
      themeSettingsPlusBorderColorV322: safeHex(out.themeSettingsPlusBorderColorV322, out.border || text),
      themeSettingsPlusHoverIconColorV322: safeHex(out.themeSettingsPlusHoverIconColorV322, text),
      themeSettingsPlusHoverBackgroundColorV322: safeHex(out.themeSettingsPlusHoverBackgroundColorV322, out.hoverColor || accent),
      themeSettingsPlusHoverBorderColorV322: safeHex(out.themeSettingsPlusHoverBorderColorV322, out.border || text),
      settingsModalBackgroundColorV380: safeHex(out.settingsModalBackgroundColorV380, surface),
      settingsModalTextColorV380: safeHex(out.settingsModalTextColorV380, text),
      settingsModalBorderColorV380: safeHex(out.settingsModalBorderColorV380, out.border || text),
      settingsModalOverlayColorV381: safeHex(out.settingsModalOverlayColorV381, background),
      settingsModalSectionBorderColorV381: safeHex(out.settingsModalSectionBorderColorV381, out.border || text),
      settingsModalMutedTextColorV381: safeHex(out.settingsModalMutedTextColorV381, out.muted || text),
      settingsModalIconColorV381: safeHex(out.settingsModalIconColorV381, text),
      settingsModalInputBackgroundColorV380: safeHex(out.settingsModalInputBackgroundColorV380, surface),
      settingsModalInputTextColorV380: safeHex(out.settingsModalInputTextColorV380, text),
      settingsModalInputBorderColorV380: safeHex(out.settingsModalInputBorderColorV380, out.border || text),
      settingsModalCardBackgroundColorV380: safeHex(out.settingsModalCardBackgroundColorV380, surface),
      settingsModalCardTextColorV380: safeHex(out.settingsModalCardTextColorV380, text),
      settingsModalCardBorderColorV380: safeHex(out.settingsModalCardBorderColorV380, out.border || text),
      settingsModalHoverBackgroundColorV380: safeHex(out.settingsModalHoverBackgroundColorV380, out.hoverColor || accent),
      settingsModalHoverTextColorV380: safeHex(out.settingsModalHoverTextColorV380, text),
      settingsModalSelectedBackgroundColorV380: safeHex(out.settingsModalSelectedBackgroundColorV380, text),
      settingsModalSelectedTextColorV380: safeHex(out.settingsModalSelectedTextColorV380, surface),
      settingsModalSelectedBorderColorV380: safeHex(out.settingsModalSelectedBorderColorV380, out.border || text),
      settingsModalButtonBackgroundColorV380: safeHex(out.settingsModalButtonBackgroundColorV380, surface),
      settingsModalButtonTextColorV380: safeHex(out.settingsModalButtonTextColorV380, text),
      settingsModalButtonBorderColorV380: safeHex(out.settingsModalButtonBorderColorV380, out.border || text),
      settingsWidgetBackgroundColorV380: safeHex(out.settingsWidgetBackgroundColorV380, surface),
      settingsWidgetTextColorV380: safeHex(out.settingsWidgetTextColorV380, text),
      settingsWidgetBorderColorV380: safeHex(out.settingsWidgetBorderColorV380, out.border || text),
      settingsCursorNameTextColorV394: safeHex(out.settingsCursorNameTextColorV394, safeHex(out.settingsWidgetTextColorV380, text)),
      settingsCompanionNameTextColorV394: safeHex(out.settingsCompanionNameTextColorV394, safeHex(out.settingsWidgetTextColorV380, text)),
      settingsThemeNameTextColorV394: safeHex(out.settingsThemeNameTextColorV394, safeHex(out.settingsModalCardTextColorV380, text)),
      settingsThemeNameHoverTextColorV394: safeHex(out.settingsThemeNameHoverTextColorV394, safeHex(out.settingsModalHoverTextColorV380, text)),
      // Context-menu background is intentionally linked to Settings Modal Background.
      dashboardContextMenuBackgroundColorV394: safeHex(out.settingsModalBackgroundColorV380, surface),
      dashboardContextMenuTextColorV394: safeHex(out.dashboardContextMenuTextColorV394, safeHex(out.settingsModalTextColorV380, text)),
      dashboardContextMenuBorderColorV394: safeHex(out.dashboardContextMenuBorderColorV394, safeHex(out.settingsModalBorderColorV380, out.border || text)),
      dashboardContextMenuHoverBackgroundColorV394: safeHex(out.dashboardContextMenuHoverBackgroundColorV394, safeHex(out.settingsModalHoverBackgroundColorV380, out.hoverColor || accent)),
      dashboardContextMenuHoverTextColorV394: safeHex(out.dashboardContextMenuHoverTextColorV394, safeHex(out.settingsModalHoverTextColorV380, text)),
      kbCategoryBackgroundColor: safeHex(out.kbCategoryBackgroundColor, surface), kbCategoryTextColor: safeHex(out.kbCategoryTextColor, text),
      kbCategoryHoverBackgroundColor: safeHex(out.kbCategoryHoverBackgroundColor, accent), kbCategoryHoverTextColor: safeHex(out.kbCategoryHoverTextColor, text),
      radius: Number.isFinite(Number(out.radius)) ? clamp(out.radius, 0, 30, 20) : 20, shadow: Number.isFinite(Number(out.shadow)) ? clamp(out.shadow, 0, 12, 0) : 0, font: String(out.font || 'hand'),
      backgroundSourceV311: inferBackgroundSourceV311(out),
      backgroundModeV158: ['solid','gradient','image'].includes(String(out.backgroundModeV158)) ? String(out.backgroundModeV158) : 'solid',
      backgroundGradientV56: String(out.backgroundGradientV56 || ''), backgroundGradientNameV56: String(out.backgroundGradientNameV56 || ''),
      interactiveBackgroundCodeV56: String(out.interactiveBackgroundCodeV56 || ''), backgroundImage: String(out.backgroundImage || ''), backgroundImageName: String(out.backgroundImageName || ''),
      introAudio: String(out.introAudio || ''), introAudioName: String(out.introAudioName || ''), introAudioProjectPath: String(out.introAudioProjectPath || ''),
      introAudioSourceThemeIdV364: String(out.introAudioSourceThemeIdV364 || ''),
      hoverAudioSourceThemeIdV364: String(out.hoverAudioSourceThemeIdV364 || ''),
      themeBuilderAiJsonV364: String(out.themeBuilderAiJsonV364 || ''),
      themeBuilderAiUsedV364: out.themeBuilderAiUsedV364 === true,
      themeBuilderAiModeV364: String(out.themeBuilderAiModeV364 || '') === 'dark' ? 'dark' : 'light',
      themeBuilderAutoToolV364: ['ai','smart'].includes(String(out.themeBuilderAutoToolV364 || '')) ? String(out.themeBuilderAutoToolV364) : '',
      audioPlayMode: String(out.audioPlayMode || (out.introAudio ? 'segment' : 'full')) === 'segment' ? 'segment' : 'full',
      audioStart: String(out.audioStart || out.audioStartV3 || '00:00'), audioEnd: String(out.audioEnd || out.audioEndV3 || '00:20'),
      audioFade: out.audioFade !== false, audioVolume: clamp(out.audioVolume, 0, 100, 35),
      svgHoverSoundsEnabled: !!out.svgHoverSoundsEnabled,
      svgHoverSoundMode: String(out.svgHoverSoundMode || 'random') === 'mapped' ? 'mapped' : 'random',
      svgHoverSounds: Array.isArray(out.svgHoverSounds) ? clone(out.svgHoverSounds) : [],
      svgHoverSoundStopModeV87: String(out.svgHoverSoundStopModeV87 || 'immediate') === 'delay' ? 'delay' : 'immediate',
      svgHoverSoundStopDelayV87: clamp(out.svgHoverSoundStopDelayV87, .1, 10, .1),
      backgroundSvgs: Array.isArray(out.backgroundSvgs) ? clone(out.backgroundSvgs) : [],
      svgDefaultAnimation: String(out.svgDefaultAnimation || 'float'),
      svgDistribution: String(out.svgDistribution || 'random'),
      svgGlobalScale: clamp(out.svgGlobalScale, 50, 220, 100),
      decorationsOpacityV117: clamp(out.decorationsOpacityV117, 0, 100, 100),
      svgAllowOverlap: !!out.svgAllowOverlap,
      reduceDecorationOverlapV361: !!out.reduceDecorationOverlapV361,
      preventDecorationOverlapV367: !!out.preventDecorationOverlapV367,
      introSvgBounceEnabled: !!out.introSvgBounceEnabled,
      introSvgBopMode: String(out.introSvgBopMode || 'some') === 'all' ? 'all' : 'some',
      introSvgBopIntensityV369: clamp(out.introSvgBopIntensityV369, 25, 200, 100),
      decorationAnimationSpeedV369: clamp(out.decorationAnimationSpeedV369, 25, 200, 100),
      introMusicReactionsEnabledV154: !!out.introMusicReactionsEnabledV154,
      svgHoverAnimationsEnabledV82: !!out.svgHoverAnimationsEnabledV82,
      svgHoverAnimationV82: String(out.svgHoverAnimationV82 || 'lift'),
      manualPlacementSlotsV40: Array.isArray(out.manualPlacementSlotsV40) ? clone(out.manualPlacementSlotsV40) : [],
      useThemeCursor: !!out.useThemeCursor, themeCursorStyle: String(out.themeCursorStyle || 'default'),
      themeCursorTrailEnabledV161: !!out.themeCursorTrailEnabledV161,
      customCursorV161: out.customCursorV161 && typeof out.customCursorV161 === 'object' ? clone(out.customCursorV161) : null,
      customCursorLabelV161: String(out.customCursorLabelV161 || ''),
      customCursorModeIdV161: String(out.customCursorModeIdV161 || ''),
      useThemeCompanion: !!(out.useThemeCompanion || out.themeCompanionEnabledV163),
      themeCompanion: String(out.themeCompanion || out.themeCompanionStyleV163 || 'none')
    };
  }

  function builtInFallback(themeId) {
    try {
      const p = BUILT_IN_THEME_PREVIEWS?.[themeId];
      if (!Array.isArray(p) || p.length < 3) return {};
      const dark = !!p[3], ink = dark ? '#ffffff' : '#111111';
      return {
        background:p[0] || '#ffffff', surface:p[1] || '#ffffff', accent:p[2] || p[1] || '#eeeeee', text:ink, border:ink,
        muted: dark ? '#d1d5db' : '#666666', tabIconColor:ink, tabTitleColor:ink, backButtonColor:ink,
        dashboardBackgroundV40:p[0] || '#ffffff', dashboardCardV40:p[1] || '#ffffff', dashboardTextV40:ink,
        dashboardAccentV40:p[2] || p[1] || '#eeeeee', dashboardTitleColorV79:ink, dashboardIconColorV81:ink, dashboardLogIconColorV85:ink,
        dashboardLogButtonBackgroundV391:p[1] || '#ffffff', dashboardLogButtonTextColorV391:ink, dashboardLogButtonIconColorV391:ink, dashboardLogButtonBorderColorV391:ink,
        dashboardLogButtonHoverBackgroundV391:p[2] || p[1] || '#eeeeee', dashboardLogButtonHoverTextColorV391:ink, dashboardLogButtonHoverIconColorV391:ink, dashboardLogButtonHoverBorderColorV391:ink,
        dashboardNewLogButtonBackgroundV391:p[1] || '#ffffff', dashboardNewLogButtonTextColorV391:ink, dashboardNewLogButtonIconColorV391:ink, dashboardNewLogButtonBorderColorV391:ink,
        dashboardNewLogButtonHoverBackgroundV391:p[2] || p[1] || '#eeeeee', dashboardNewLogButtonHoverTextColorV391:ink, dashboardNewLogButtonHoverIconColorV391:ink, dashboardNewLogButtonHoverBorderColorV391:ink,
        dashboardCreateLogIconHoverColorV320:ink, dashboardCreateLogIconHoverBackgroundV320:'#eeeeee',
        dashboardCreateLogCategoryBackgroundColorV321:p[1] || '#ffffff', dashboardCreateLogCategoryTextColorV321:ink, dashboardCreateLogCategoryBorderColorV321:ink,
        dashboardCreateLogCategoryHoverBackgroundColorV321:p[2] || p[1] || '#eeeeee', dashboardCreateLogCategoryHoverTextColorV321:ink, dashboardCreateLogCategoryHoverBorderColorV321:ink,
        themeSettingsPlusIconColorV322:ink, themeSettingsPlusBackgroundColorV322:p[1] || '#ffffff', themeSettingsPlusBorderColorV322:ink,
        themeSettingsPlusHoverIconColorV322:ink, themeSettingsPlusHoverBackgroundColorV322:p[2] || p[1] || '#eeeeee', themeSettingsPlusHoverBorderColorV322:ink
      };
    } catch { return {}; }
  }

  function normalizeDecoration(asset, inherited = false) {
    if (!asset) return null;
    const item = typeof asset === 'string' ? { name:asset.split('/').pop() || 'Decoration', url:asset } : { ...asset };
    if (!item.url && !item.markup && (item.projectPath || item.path)) {
      let p = String(item.projectPath || item.path || '').replace(/\\/g, '/').replace(/^\.\//, '');
      const publicIndex = p.toLowerCase().lastIndexOf('/public/');
      if (publicIndex >= 0) p = p.slice(publicIndex + 8); else if (p.toLowerCase().startsWith('public/')) p = p.slice(7);
      if (p) item.url = '/' + p.split('/').filter(Boolean).map(part => { try { return encodeURIComponent(decodeURIComponent(part)); } catch { return encodeURIComponent(part); } }).join('/');
    }
    if (!item.url && !item.markup) return null;
    if (!item.name) item.name = String(item.url || 'Decoration').split('/').pop()?.split(/[?#]/)[0] || 'Decoration';
    item.opacityV109 = clamp(item.opacityV109 ?? item.opacity, 0, 100, 100);
    item.opacityOverrideV326 = typeof item.opacityOverrideV326 === 'boolean'
      ? item.opacityOverrideV326
      : Number(item.opacityV109) !== 100;
    item.animationOverride = String(item.animationOverride ?? '');
    item.hoverAnimationOverrideV82 = String(item.hoverAnimationOverrideV82 || '');
    item.bopModeV60 = ['auto','always','never'].includes(String(item.bopModeV60 || '').toLowerCase()) ? String(item.bopModeV60).toLowerCase() : (item.introBop === true ? 'always' : 'auto');
    item.crossDirectionV139 = String(item.crossDirectionV139 || '').toLowerCase() === 'left' ? 'left' : 'right';
    item.hiddenOnScreenV63 = item.hiddenOnScreenV63 === true || item.hidden === true;
    item.alwaysShowOnScreenV370 = item.alwaysShowOnScreenV370 === true;
    if (item.hiddenOnScreenV63) item.alwaysShowOnScreenV370 = false;
    if (inherited) item.inheritedBuiltInV307 = true;
    return item;
  }

  function decorationKey(asset) { return String(asset?.projectPath || asset?.url || asset?.markup || asset?.name || '').trim().toLowerCase(); }
  function mergeDecorations(...lists) {
    const out = [], by = new Map();
    for (const raw of lists.flat()) {
      const inherited = !!raw?.inheritedBuiltInV307 || !!raw?.inheritedBuiltInV306 || !!raw?.inheritedBuiltInV109 || !!raw?.inheritedBuiltInV30 || !!raw?.inheritedBuiltInV303;
      const item = normalizeDecoration(raw, inherited); if (!item) continue;
      const key = decorationKey(item); if (!key) continue;
      if (by.has(key)) out[by.get(key)] = { ...out[by.get(key)], ...item };
      else { by.set(key, out.length); out.push(item); }
    }
    return out;
  }

  function normalizeAudioItem(value, fallbackName = 'Audio') {
    if (!value) return null;
    if (typeof value === 'string') return value ? { name:fileName(value, fallbackName), url:value } : null;
    if (typeof value !== 'object') return null;
    const url = String(value.url || value.src || value.audio || value.href || value.path || '').trim();
    if (!url) return null;
    return { ...value, name:String(value.name || value.fileName || value.label || fileName(url, fallbackName)), url };
  }

  function fileName(url, fallback = 'File') {
    const raw = String(url || '').trim(); if (!raw) return fallback;
    try { return decodeURIComponent(raw.split(/[?#]/)[0].split('/').pop()) || fallback; } catch { return raw.split(/[?#]/)[0].split('/').pop() || fallback; }
  }
  function normalizedUrl(value) {
    const raw = String(value || '').trim(); if (!raw) return '';
    try { const u = new URL(raw, location.href); return `${u.pathname}${u.search}`.toLowerCase(); } catch { return raw.toLowerCase(); }
  }
  function mergeSounds(...lists) {
    const out = [], seen = new Set();
    for (const raw of lists.flat()) {
      const item = normalizeAudioItem(raw, 'Hover Sound'); if (!item) continue;
      const key = normalizedUrl(item.url); if (!key || seen.has(key)) continue;
      seen.add(key); out.push(item);
    }
    return out;
  }

  // V420 — SAVED INTRO AUDIO AUTHORITY
  // Theme records have several compatibility mirrors. Keep intro audio in one
  // tiny per-theme authority record so an older mirror can never resurrect a
  // replaced/removed song after Save.
  const INTRO_AUTHORITY_KEY_V420 = 'loggy-theme-intro-audio-v420';
  function readIntroAuthorityMapV420() {
    try {
      const value = JSON.parse(localStorage.getItem(INTRO_AUTHORITY_KEY_V420) || '{}');
      return value && typeof value === 'object' && !Array.isArray(value) ? value : {};
    } catch { return {}; }
  }
  function writeIntroAuthorityMapV420(map) {
    try { localStorage.setItem(INTRO_AUTHORITY_KEY_V420, JSON.stringify(map || {})); } catch {}
  }
  function audioAuthorityFromThemeV420(theme = {}, updatedAt = '') {
    return {
      introAudio:String(theme?.introAudio || ''),
      introAudioName:String(theme?.introAudioName || ''),
      introAudioProjectPath:String(theme?.introAudioProjectPath || ''),
      introAudioSourceThemeIdV364:String(theme?.introAudioSourceThemeIdV364 || ''),
      audioPlayMode:String(theme?.audioPlayMode || 'full') === 'segment' ? 'segment' : 'full',
      audioStart:String(theme?.audioStart ?? '00:00'),
      audioEnd:String(theme?.audioEnd ?? '00:20'),
      audioFade:theme?.audioFade !== false,
      audioVolume:clamp(theme?.audioVolume,0,100,35),
      // V423: an explicit removal must survive empty-string merges and server
      // re-hydration. Older V420 rows with an empty intro + timestamp are
      // automatically interpreted as a removal tombstone.
      introAudioRemovedV423:
        theme?.introAudioRemovedV423 === true ||
        (!String(theme?.introAudio || '').trim() &&
         !!String(theme?.introAudioUpdatedAtV420 || theme?.introAudioAuthorityV418 || '').trim()),
      updatedAt:String(updatedAt || theme?.introAudioUpdatedAtV420 || new Date().toISOString())
    };
  }
  function writeAudioAuthorityToThemeV420(theme, authority) {
    if (!theme || typeof theme !== 'object' || !authority) return theme;
    const a=authority;
    theme.introAudio=String(a.introAudio || '');
    theme.introAudioName=String(a.introAudioName || '');
    theme.introAudioProjectPath=String(a.introAudioProjectPath || '');
    theme.introAudioSourceThemeIdV364=String(a.introAudioSourceThemeIdV364 || '');
    theme.audioPlayMode=String(a.audioPlayMode || 'full') === 'segment' ? 'segment' : 'full';
    theme.audioStart=String(a.audioStart ?? '00:00');
    theme.audioEnd=String(a.audioEnd ?? '00:20');
    theme.audioFade=a.audioFade !== false;
    theme.audioVolume=clamp(a.audioVolume,0,100,35);
    theme.introAudioRemovedV423 =
      a.introAudioRemovedV423 === true ||
      (!String(a.introAudio || '').trim() && !!String(a.updatedAt || '').trim());
    theme.introAudioUpdatedAtV420=String(a.updatedAt || '');
    // Canonical empty introAudio means removed. Never let a legacy alias refill it.
    for (const key of ['introAudioUrl','introSong','introMusic','song','music','introSongName','songName','musicName']) theme[key]='';
    return theme;
  }
  function applySavedIntroAuthorityV420(themeId, theme) {
    const id=String(themeId || '');
    if (!id || !theme || typeof theme !== 'object') return theme;
    const a=readIntroAuthorityMapV420()[id];
    if (!a || typeof a !== 'object') return theme;
    const authTime=Date.parse(String(a.updatedAt || '')) || 0;
    const themeTime=Date.parse(String(theme.introAudioUpdatedAtV420 || '')) || 0;
    if (themeTime > authTime) return theme;
    return writeAudioAuthorityToThemeV420(theme,a);
  }

  function resolveImmediate(themeId, name = '') {
    const base = blankDraft();
    const finalize = payload => {
      if (payload?.draft) payload.draft = applySavedIntroAuthorityV420(themeId, payload.draft);
      return payload;
    };
    const shared = readJsonStorage(SHARED_KEY, []);
    const sharedEntry = Array.isArray(shared) ? shared.find(x => String(x?.id || '') === themeId) : null;
    if (sharedEntry?.theme) return finalize({ kind:'shared', sourceThemeId:sharedEntry.sourceThemeId || '', dashboardOverlayKeys:Object.keys(sharedEntry.theme || {}), draft:{ ...base, ...clone(sharedEntry.theme), name:sharedEntry.name || sharedEntry.theme.name || name || 'Custom Theme', backgroundSvgs:mergeDecorations(sharedEntry.theme.backgroundSvgs || []) } });
    try {
      const copyTheme = getThemeCopyV30?.(themeId);
      if (copyTheme?.theme) return finalize({ kind:'copy', sourceThemeId:copyTheme.sourceThemeId || '', dashboardOverlayKeys:Object.keys(copyTheme.theme || {}), draft:{ ...base, ...clone(copyTheme.theme), name:copyTheme.name || copyTheme.theme.name || name || 'Theme Copy', backgroundSvgs:mergeDecorations(copyTheme.theme.backgroundSvgs || []) } });
    } catch {}
    if (themeId === 'theme-custom-builder') {
      let custom = {}; try { custom = clone(getCustomThemeSettings?.() || db?.settings?.customTheme || {}); } catch {}
      return finalize({ kind:'custom', sourceThemeId:'', dashboardOverlayKeys:Object.keys(custom || {}), draft:{ ...base, ...custom, name:custom.name || name || 'Custom Theme', backgroundSvgs:mergeDecorations(custom.backgroundSvgs || []) } });
    }
    let override = null;
    try { override = getThemeOverrideV25?.(themeId) || null; } catch {}
    if (!override) {
      const map = readJsonStorage(OVERRIDE_KEY, {});
      override = map?.[themeId]?.theme || map?.[themeId] || null;
    }
    return finalize({ kind:'built-in', sourceThemeId:themeId, dashboardOverlayKeys:Object.keys(override || {}), draft:{ ...base, ...builtInFallback(themeId), ...(override ? clone(override) : {}), backgroundSvgs:mergeDecorations(override?.backgroundSvgs || []), name:override?.name || name || displayName(themeId) } });
  }

  function gradientPresets() {
    try {
      if (Array.isArray(THEME_GRADIENT_PRESETS_V56) && THEME_GRADIENT_PRESETS_V56.length) {
        return THEME_GRADIENT_PRESETS_V56.map(item => ({ name:String(item?.name || 'Gradient'), css:String(item?.css || '') })).filter(item => item.css);
      }
    } catch {}
    return FALLBACK_GRADIENTS.map(([name, css]) => ({ name, css }));
  }

  const CUSTOM_ANIMATION_REGISTRY_V326 = 'loggy-theme-custom-animations-v159';
  const CUSTOM_FONT_REGISTRY_V326 = 'loggy-theme-custom-fonts-v326';

  function registeredAnimationsV326() {
    let rows = [];
    try { rows = JSON.parse(localStorage.getItem(CUSTOM_ANIMATION_REGISTRY_V326) || '[]'); } catch {}
    const out = [...ANIMATIONS];
    const seen = new Set(out.map(([id]) => id));
    (Array.isArray(rows) ? rows : []).forEach(row => {
      const id = String(row?.id || ''), label = String(row?.label || id || 'Custom Animation');
      if (/^theme-motion-v159-[a-z0-9-]+$/.test(id) && !seen.has(id)) { out.push([id,label]); seen.add(id); }
    });
    return out;
  }

  function fontChoicesV326() {
    const labels = {
      hand:'Handwritten', clean:'Clean Sans', serif:'Book Serif', mono:'Monospace',
      rounded:'Soft Rounded', modern:'Modern Sans', humanist:'Humanist', geometric:'Geometric',
      friendly:'Friendly', soft:'Soft Casual', editorial:'Editorial Serif', book:'Book Serif',
      classic:'Classic Serif', luxury:'Elegant Serif', slab:'Slab Serif', typewriter:'Typewriter',
      code:'Clean Mono', terminal:'Terminal Mono', narrow:'Narrow Sans', bold:'Bold Display',
      school:'School Notes', script:'Casual Script', newspaper:'Newspaper', ui:'System UI',
      verdana:'Verdana', tahoma:'Tahoma', calibri:'Calibri', georgia:'Georgia',
      palatino:'Palatino', courier:'Courier'
    };
    const out = [], seen = new Set();
    const add = (id,label) => { id=String(id||''); if(!id || seen.has(id)) return; seen.add(id); out.push([id,String(label||labels[id]||titleFromKey(id))]); };
    Object.keys(labels).forEach(id => add(id, labels[id]));
    try { Object.keys(CUSTOM_THEME_FONT_STACKS || {}).forEach(id => add(id, labels[id])); } catch {}
    let rows=[]; try { rows=JSON.parse(localStorage.getItem(CUSTOM_FONT_REGISTRY_V326)||'[]'); } catch {}
    (Array.isArray(rows)?rows:[]).forEach(row=>add(row?.id,row?.label));
    return out;
  }

  function fontOptionsV326(value) {
    const selected=String(value||'hand');
    return fontChoicesV326().map(([id,label])=>`<option value="${attr(id)}"${selected===id?' selected':''}>${esc(label)}</option>`).join('');
  }

  function animationOptions(value, includeDefault = false) {
    const selected = String(value || '');
    return `${includeDefault ? `<option value="">Use default</option>` : ''}${registeredAnimationsV326().map(([id,label]) => `<option value="${attr(id)}"${selected===id?' selected':''}>${esc(label)}</option>`).join('')}`;
  }
  function hoverOptions(value, includeDefault = false) {
    const selected = String(value || '');
    return `${includeDefault ? `<option value=""${selected===''?' selected':''}>Use default</option><option value="none"${selected==='none'?' selected':''}>No hover animation</option>` : ''}${HOVER_ANIMATIONS.map(([id,label]) => `<option value="${attr(id)}"${selected===id?' selected':''}>${esc(label)}</option>`).join('')}`;
  }
  function distributionOptions(value) {
    const selected = String(value || 'random');
    return DISTRIBUTIONS.map(([id,label]) => `<option value="${attr(id)}"${selected===id?' selected':''}>${esc(label)}</option>`).join('');
  }

  function installStyle() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
      #${MODAL_ID}{position:fixed;inset:0;z-index:2147483640;background:rgba(0,0,0,.56);display:flex;align-items:center;justify-content:center;padding:16px;box-sizing:border-box;font-family:inherit;color:#171717}
      #${MODAL_ID}[hidden]{display:none!important} #${MODAL_ID} *{box-sizing:border-box}
      #${MODAL_ID} .tb307-shell{width:min(1540px,98vw);height:min(940px,97vh);background:#fff;border:2px solid #151515;border-radius:16px;box-shadow:10px 10px 0 rgba(0,0,0,.22);display:grid;grid-template-rows:auto auto minmax(0,1fr) auto;overflow:hidden}
      #${MODAL_ID} .tb307-head{display:flex;align-items:center;gap:10px;padding:13px 16px;border-bottom:1px solid #ddd;background:#fff}.tb307-head-copy{min-width:0;flex:1}
      #${MODAL_ID} h2{margin:0;font-size:1.55rem;color:#171717} #${MODAL_ID} .tb307-sub{margin:2px 0 0;color:#666;font-size:.88rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
      #${MODAL_ID} button{font:inherit} #${MODAL_ID} .tb307-head-action,#${MODAL_ID} .tb307-close,#${MODAL_ID} .tb307-small{border:1px solid #aaa;background:#fff;color:#171717;border-radius:9px;padding:7px 10px;cursor:pointer}
      #${MODAL_ID} .tb307-close{width:38px;height:38px;padding:0;font-size:1.35rem}
      #${MODAL_ID} .tb307-tabs{display:flex;gap:7px;padding:9px 13px;border-bottom:1px solid #ddd;background:#f7f7f7;overflow:auto}
      #${MODAL_ID} .tb307-tabs,#${MODAL_ID} .tb307-tab{user-select:none;-webkit-user-select:none}
      #${MODAL_ID} .tb307-tab{flex:0 0 auto;border:1px solid #b8b8b8;background:#fff;color:#222;border-radius:999px;padding:7px 14px;font-weight:800;cursor:pointer;user-select:none;-webkit-user-select:none}.tb307-tab.active{background:#171717!important;color:#fff!important;border-color:#171717!important}
      #${MODAL_ID} .tb307-main{display:grid;grid-template-columns:minmax(390px,.9fr) minmax(500px,1.1fr);min-height:0;overflow:hidden}.tb307-controls{overflow:auto;min-width:0;padding:15px;border-right:1px solid #ddd;background:#fbfbfb}.tb307-panel{display:none}.tb307-panel.active{display:block}
      #${MODAL_ID} .tb307-name{display:grid;gap:5px;margin-bottom:12px}.tb307-name span,.tb307-field>span{font-weight:800;color:#222}
      #${MODAL_ID} input[type=text],#${MODAL_ID} input[type=url],#${MODAL_ID} input[type=number],#${MODAL_ID} select,#${MODAL_ID} textarea{width:100%;border:1px solid #aaa;border-radius:9px;padding:8px 10px;background:#fff;color:#171717;font:inherit}
      #${MODAL_ID} textarea{min-height:86px;resize:vertical;font-family:ui-monospace,SFMono-Regular,Consolas,monospace;font-size:.82rem}
      #${MODAL_ID} .tb307-section{border:1px solid #d0d0d0;border-radius:12px;background:#fff;padding:12px;margin-bottom:11px;display:grid;gap:10px}.tb307-section h3{margin:0;font-size:1.06rem}.tb307-hint{color:#666;font-size:.84rem;line-height:1.35}.tb307-field{display:grid;gap:5px}.tb307-inline{display:grid;grid-template-columns:1fr 1fr;gap:9px}.tb307-three{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}
      #${MODAL_ID} .tb307-check{display:flex;align-items:center;gap:8px;color:#222;font-weight:700}.tb307-check input{width:18px;height:18px}.tb307-actions{display:flex;align-items:center;gap:7px;flex-wrap:wrap}.tb307-actions button{border:1px solid #aaa;background:#fff;border-radius:8px;padding:7px 10px;cursor:pointer;color:#171717}.tb307-actions button.danger{border-color:#d58;color:#821}
      #${MODAL_ID} .tb307-accordion{border:1px solid #c9c9c9;border-radius:11px;background:#fff;margin-bottom:9px;overflow:hidden}.tb307-accordion summary{list-style:none;display:flex;align-items:center;justify-content:space-between;padding:11px 13px;cursor:pointer;font-weight:850;user-select:none;-webkit-user-select:none;-webkit-tap-highlight-color:transparent}.tb307-accordion summary::-webkit-details-marker{display:none}.tb307-accordion summary:after{content:'+';font-size:1.2rem;font-weight:400}.tb307-accordion[open] summary:after{content:'−'}.tb307-accordion-body{border-top:1px solid #e5e5e5;padding:10px;display:grid;gap:8px;user-select:none;-webkit-user-select:none}.tb307-accordion-body input[type=text],.tb307-accordion-body input[type=number],.tb307-accordion-body textarea{user-select:text;-webkit-user-select:text}.tb307-accordion summary:focus{outline:none}.tb307-accordion summary:focus-visible{box-shadow:inset 0 0 0 2px #171717}
      #${MODAL_ID} .tb307-color-row{display:grid;grid-template-columns:minmax(0,1fr) 42px 94px;gap:7px;align-items:center}.tb307-color-row label{min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.tb307-color-row input[type=color]{width:42px;height:34px;padding:2px;border:1px solid #aaa;border-radius:7px;background:#fff}.tb307-color-row input[type=text]{padding:7px;font-family:ui-monospace,SFMono-Regular,Consolas,monospace;font-size:.8rem}
      #${MODAL_ID} .tb307-gradient-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(98px,1fr));gap:7px;max-height:210px;overflow:auto}.tb307-gradient{height:62px;border:2px solid transparent;border-radius:10px;cursor:pointer;position:relative;overflow:hidden;background:#eee}.tb307-gradient.selected{border-color:#111}.tb307-gradient span{position:absolute;left:5px;right:5px;bottom:5px;background:rgba(255,255,255,.82);color:#111;border-radius:6px;padding:2px 4px;font-size:.66rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
      #${MODAL_ID} .tb311-bg-source-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}#${MODAL_ID} .tb311-bg-source{display:flex;align-items:flex-start;gap:9px;text-align:left;border:1px solid #c9c9c9;border-radius:12px;background:#fff;padding:10px;cursor:pointer;color:#171717}#${MODAL_ID} .tb311-bg-source:hover{border-color:#777}#${MODAL_ID} .tb311-bg-source.active{border:2px solid #171717;padding:9px;background:#f7f7f7}#${MODAL_ID} .tb311-bg-switch{width:34px;height:20px;border-radius:999px;background:#d6d6d6;position:relative;flex:0 0 auto;margin-top:1px}#${MODAL_ID} .tb311-bg-switch::after{content:'';position:absolute;width:14px;height:14px;left:3px;top:3px;border-radius:50%;background:#fff;box-shadow:0 1px 2px rgba(0,0,0,.2);transition:transform .15s}#${MODAL_ID} .tb311-bg-source.active .tb311-bg-switch{background:#171717}#${MODAL_ID} .tb311-bg-source.active .tb311-bg-switch::after{transform:translateX(14px)}#${MODAL_ID} .tb311-bg-source-copy{display:grid;gap:2px;min-width:0}#${MODAL_ID} .tb311-bg-source-copy strong{font-size:.92rem}#${MODAL_ID} .tb311-bg-source-copy small{font-size:.72rem;color:#666;line-height:1.2}#${MODAL_ID} .tb311-active-bg{border:1px solid #d8d8d8;border-radius:12px;background:#fafafa;padding:10px;display:grid;gap:9px}
      #${MODAL_ID} .tb312-use-toggle{display:flex;align-items:center;gap:10px;cursor:pointer;user-select:none;-webkit-user-select:none;padding:2px 0}#${MODAL_ID} .tb312-use-toggle>input{position:absolute;opacity:0;pointer-events:none}#${MODAL_ID} .tb312-switch-track{width:42px;height:24px;border-radius:999px;border:1px solid #aaa;background:#ddd;position:relative;flex:0 0 auto;transition:.15s}#${MODAL_ID} .tb312-switch-track::after{content:'';position:absolute;width:18px;height:18px;left:2px;top:2px;border-radius:50%;background:#fff;border:1px solid rgba(0,0,0,.12);box-shadow:0 1px 2px rgba(0,0,0,.12);transition:transform .15s}#${MODAL_ID} .tb312-use-toggle>input:checked+.tb312-switch-track{background:#171717;border-color:#171717}#${MODAL_ID} .tb312-use-toggle>input:checked+.tb312-switch-track::after{transform:translateX(18px)}#${MODAL_ID} .tb312-use-copy{display:grid;gap:1px;min-width:0}#${MODAL_ID} .tb312-use-copy strong{font-size:.9rem}#${MODAL_ID} .tb312-use-copy small{color:#666;font-size:.74rem;line-height:1.2}#${MODAL_ID} .tb312-subsettings{display:grid;gap:9px;border-top:1px solid #ececec;padding-top:9px;margin-top:2px}
      #${MODAL_ID} .tb315-cursor-emoji{display:grid;place-items:center;width:100%;height:100%;font-size:2rem;line-height:1}#${MODAL_ID} .tb315-trinket-gallery.is-disabled{opacity:.42;filter:saturate(.7)}#${MODAL_ID} .tb315-trinket-gallery.is-disabled .tb307-trinket{cursor:default}
      #${MODAL_ID} .tb324-auto-choice{border:1px solid #d4d4d4;border-radius:12px;background:#fff;padding:11px;display:grid;gap:10px;margin-bottom:10px}#${MODAL_ID} .tb324-auto-choice.is-active{border-color:#171717;box-shadow:inset 0 0 0 1px #171717}#${MODAL_ID} .tb324-auto-choice-body{display:grid;gap:11px;border-top:1px solid #ececec;padding-top:11px}#${MODAL_ID} .tb324-auto-choice .tb312-use-toggle{padding:0}#${MODAL_ID} .tb312-ai-steps{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:7px}#${MODAL_ID} .tb312-ai-step{border:1px solid #ddd;border-radius:10px;padding:9px;background:#fafafa;display:grid;gap:3px}#${MODAL_ID} .tb312-ai-step strong{font-size:.86rem}#${MODAL_ID} .tb312-ai-step small{font-size:.74rem;color:#666;line-height:1.3}#${MODAL_ID} .tb312-ai-json{min-height:260px!important}#${MODAL_ID} .tb312-ai-status{min-height:20px;font-size:.82rem;font-weight:750;color:#555}#${MODAL_ID} .tb325-ai-apply-row{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:10px;align-items:center}#${MODAL_ID} .tb325-ai-apply{min-width:150px;min-height:42px;border:1px solid #171717;border-radius:9px;background:#171717;color:#fff;font:inherit;font-weight:850;cursor:pointer}#${MODAL_ID} .tb325-ai-apply:disabled{opacity:.42;cursor:not-allowed}#${MODAL_ID} .tb316-toggle-settings{display:grid;gap:9px;padding:10px 0 0 46px;border-top:1px solid #eee;margin-top:2px}#${MODAL_ID} .tb316-auto-theme{gap:12px}#${MODAL_ID} .tb312-ai-step small{display:block;margin-top:5px;color:#666;line-height:1.35;font-weight:500}#${MODAL_ID} .tb316-copy-prompt{width:100%;min-height:42px;border:1px solid #171717;border-radius:9px;background:#171717;color:#fff;font:inherit;font-weight:850;cursor:pointer}#${MODAL_ID} .tb316-copy-prompt{transition:transform .15s ease,box-shadow .15s ease,background .15s ease,color .15s ease}#${MODAL_ID} .tb316-copy-prompt:hover{transform:translateY(-2px);background:#fff;color:#171717;box-shadow:0 4px 0 #171717,0 8px 18px rgba(0,0,0,.12)}#${MODAL_ID} .tb316-copy-prompt:active{transform:translateY(0);box-shadow:0 2px 0 #171717}#${MODAL_ID} .tb316-ai-paste{display:grid;gap:7px;padding-top:2px}#${MODAL_ID} .tb316-ai-paste-head{display:flex;align-items:center;justify-content:space-between;gap:8px}#${MODAL_ID} .tb323-mode-row{display:flex;gap:7px;align-items:center;flex-wrap:wrap}#${MODAL_ID} .tb323-mode-row>strong{margin-right:auto}#${MODAL_ID} .tb323-mode-btn{border:1px solid #aaa;background:#fff;color:#171717;border-radius:999px;padding:7px 13px;font-weight:800;cursor:pointer;user-select:none;-webkit-user-select:none}#${MODAL_ID} .tb323-mode-btn.active{background:#171717;color:#fff;border-color:#171717}#${MODAL_ID} .tb432-ai-options{display:grid;gap:10px;padding:11px;border:1px solid #e2e2e2;border-radius:11px;background:#fafafa}#${MODAL_ID} .tb432-ai-option-row{display:grid;grid-template-columns:minmax(120px,.6fr) minmax(0,1fr);gap:12px;align-items:center}#${MODAL_ID} .tb432-ai-option-label{display:grid;gap:2px}#${MODAL_ID} .tb432-ai-option-label strong{font-size:.86rem}#${MODAL_ID} .tb432-ai-option-label small{font-size:.72rem;color:#666;line-height:1.3}#${MODAL_ID} .tb432-ai-segments{display:flex;gap:7px;justify-content:flex-end;flex-wrap:wrap}#${MODAL_ID} .tb432-ai-segment{border:1px solid #aaa;background:#fff;color:#171717;border-radius:999px;padding:7px 12px;font:inherit;font-size:.8rem;font-weight:850;cursor:pointer}#${MODAL_ID} .tb432-ai-segment.active{background:#171717;color:#fff;border-color:#171717}@media(max-width:720px){#${MODAL_ID} .tb432-ai-option-row{grid-template-columns:1fr}#${MODAL_ID} .tb432-ai-segments{justify-content:flex-start}}#${MODAL_ID} .tb323-smart-grid{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:9px;align-items:end}#${MODAL_ID} .tb323-smart-seed{display:grid;grid-template-columns:minmax(0,1fr) 46px 104px;gap:7px;align-items:center}#${MODAL_ID} .tb323-smart-seed>span{font-weight:800}#${MODAL_ID} .tb323-smart-seed input[type=color]{width:46px;height:38px;padding:2px;border:1px solid #aaa;border-radius:8px;background:#fff}#${MODAL_ID} .tb323-smart-seed input[type=text]{font-family:ui-monospace,SFMono-Regular,Consolas,monospace}#${MODAL_ID} .tb323-swatches{display:grid;grid-template-columns:repeat(7,1fr);height:22px;border:1px solid #ccc;border-radius:999px;overflow:hidden}#${MODAL_ID} .tb323-swatches span{min-width:0}
      #${MODAL_ID} .tb307-range-row{display:grid;grid-template-columns:34px minmax(0,1fr) 48px 34px;gap:6px;align-items:center}.tb307-range-row button{width:34px;height:34px;border:1px solid #aaa;border-radius:8px;background:#fff;cursor:pointer;font-weight:900}.tb307-range-value{text-align:center;font-weight:800;color:#333}
      #${MODAL_ID} .tb307-sound-list{display:grid;gap:7px}.tb307-sound{display:grid;grid-template-columns:minmax(0,1fr) auto auto;gap:7px;align-items:center;border:1px solid #ddd;border-radius:9px;padding:7px}.tb307-sound-name{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.tb307-sound button{border:1px solid #aaa;background:#fff;border-radius:7px;padding:5px 8px;cursor:pointer}
      #${MODAL_ID} .tb307-deco-grid{display:grid;grid-template-columns:1fr;gap:9px}.tb307-deco-card{border:1px solid #c9c9c9;border-radius:12px;background:#fff;overflow:hidden}.tb307-deco-head{display:grid;grid-template-columns:70px minmax(0,1fr) auto;gap:9px;align-items:center;padding:8px}.tb307-deco-art{width:70px;height:70px;display:grid;place-items:center;overflow:hidden;border-radius:8px;background:linear-gradient(45deg,#f0f0f0 25%,#fff 25%,#fff 50%,#f0f0f0 50%,#f0f0f0 75%,#fff 75%);background-size:14px 14px}.tb307-deco-art img,.tb307-deco-art svg{max-width:64px;max-height:64px}.tb307-deco-name{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-weight:800}.tb307-deco-card details{border-top:1px solid #e5e5e5}.tb307-deco-card details summary{padding:8px 10px;cursor:pointer;font-weight:800;user-select:none;-webkit-user-select:none}.tb307-deco-head,.tb307-deco-name,.tb307-deco-card details summary *{user-select:none;-webkit-user-select:none}.tb307-deco-options{padding:0 10px 10px;display:grid;gap:8px}.tb307-direction{display:flex;gap:6px}.tb307-direction button{flex:1;border:1px solid #aaa;border-radius:8px;background:#fff;padding:7px;cursor:pointer}.tb307-direction button.selected{background:#171717;color:#fff;border-color:#171717}
      #${MODAL_ID} .tb307-trinket-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(112px,1fr));gap:8px;max-height:320px;overflow:auto;align-items:stretch}.tb307-trinket{border:1px solid #ccc;border-radius:10px;background:#fff;min-height:124px;padding:9px 8px 10px;display:grid;grid-template-rows:52px minmax(38px,auto);align-items:center;justify-items:center;gap:7px;cursor:pointer;color:#222;text-align:center;overflow:hidden}.tb307-trinket.selected{border:2px solid #171717;background:#eee}.tb307-trinket-art{height:52px;display:grid;place-items:center;font-size:28px;overflow:visible}.tb307-trinket-art svg{width:46px!important;height:46px!important;max-width:46px;max-height:46px;display:block}.tb307-trinket-art img{width:46px;height:46px;max-width:46px;max-height:46px;object-fit:contain;display:block}.tb314-cursor-art>span{display:grid;place-items:center;width:46px;height:46px;line-height:1}.tb307-trinket>span:last-child{display:flex;align-items:flex-start;justify-content:center;width:100%;min-height:38px;line-height:1.15;font-size:.88rem;white-space:normal;overflow-wrap:anywhere;word-break:normal;padding:0 2px}
      #${MODAL_ID} .tb307-preview{min-width:0;min-height:0;display:flex;align-items:flex-start;justify-content:center;overflow:hidden;background:transparent;padding:0;gap:0}.tb307-preview-stage{position:relative;overflow:hidden;border:0;border-radius:0;background:transparent;min-width:0;min-height:0;flex:0 0 auto}.tb307-frame-wrap{position:absolute;inset:0;overflow:hidden;background:transparent}.tb307-frame{position:absolute;left:0;top:0;width:1280px;height:760px;border:0;transform-origin:0 0;background:transparent}.tb307-preview-loading{position:absolute;inset:0;display:grid;place-items:center;background:rgba(245,245,245,.88);z-index:3;font-weight:800;color:#555;pointer-events:none}.tb307-preview-loading[hidden]{display:none}
      #${MODAL_ID} .tb307-foot{display:flex;align-items:center;gap:10px;padding:10px 14px;border-top:1px solid #ddd;background:#fff}.tb307-status{flex:1;color:#666;font-size:.86rem}.tb307-save{border:1px solid #171717;background:#171717;color:#fff;border-radius:9px;padding:8px 16px;font-weight:850;cursor:pointer}.tb307-save:disabled{opacity:.55}.tb307-empty{border:1px dashed #bbb;border-radius:10px;padding:22px;text-align:center;color:#666;background:#fafafa}
      @media(max-width:900px){#${MODAL_ID}{padding:6px}#${MODAL_ID} .tb307-shell{height:98vh;width:99vw}.tb307-main{grid-template-columns:1fr!important}.tb307-preview{display:none!important}.tb307-controls{border-right:0!important}}
    `;
    document.head.appendChild(style);
  }

  function ensureModal() {
    let modal = document.getElementById(MODAL_ID);
    if (modal) return modal;
    installStyle();
    modal = document.createElement('div');
    modal.id = MODAL_ID; modal.hidden = true;
    modal.innerHTML = `
      <div class="tb307-shell" role="dialog" aria-modal="true" aria-label="Theme Builder">
        <div class="tb307-head">
          <div class="tb307-head-copy"><h2>Theme Builder</h2></div>
          <button type="button" class="tb307-close" data-action="close" aria-label="Close">×</button>
        </div>
        <div class="tb307-tabs">${TABS.map(([id,label],i) => `<button type="button" class="tb307-tab${i===0?' active':''}" data-tab="${id}">${label}</button>`).join('')}</div>
        <div class="tb307-main">
          <div class="tb307-controls">
            ${TABS.map(([id],i) => `<div class="tb307-panel${i===0?' active':''}" data-panel="${id}"></div>`).join('')}
          </div>
          <div class="tb307-preview">
            <div class="tb307-preview-stage"><div class="tb307-frame-wrap"><iframe class="tb307-frame" title="Theme preview"></iframe></div><div class="tb307-preview-loading">Loading actual site preview…</div></div>
          </div>
        </div>
        <div class="tb307-foot"><span class="tb307-status"></span><button type="button" class="tb307-save">Save Theme</button></div>
      </div>`;
    document.body.appendChild(modal);
    modal.addEventListener('click', handleClick);
    modal.addEventListener('input', handleInput);
    modal.addEventListener('change', handleInput);
    modal.querySelector('.tb307-save')?.addEventListener('click', saveCurrent);
    return modal;
  }

  function colorGroup(key) {
    const k = String(key || '').toLowerCase();
    if (k.includes('dashboard') || k.includes('settingsmodal') || k.includes('settingswidget') || k.includes('settingscursor') || k.includes('settingscompanion') || k.includes('settingstheme')) return 'dashboard';
    if (k.includes('kb') || k.includes('knowledge')) return 'knowledge';
    if (k.includes('themesettingsplus')) return 'themeSettings';
    if (k.includes('category')) return 'categories';
    if (k.includes('tab') || k.includes('nav') || k.includes('backbutton') || k.includes('title')) return 'navigation';
    if (k.includes('daily') || k.includes('log')) return 'daily';
    if (['background','surface','text','border','accent','muted','hovercolor'].includes(k)) return 'main';
    return 'other';
  }

  function colorKeys() {
    const hiddenLegacyV391 = new Set(['dashboardLogIconColorV85','dashboardLogIconBackgroundV107','dashboardLogButtonTextColorV391','dashboardNewLogButtonTextColorV391','dashboardCreateLogIconHoverColorV320','dashboardCreateLogIconHoverBackgroundV320','dashboardCreateLogCloseBackgroundColorV396','dashboardCreateLogCloseHoverBackgroundColorV396']);
    const all = Object.entries(state.draft).filter(([key,value]) => isHex(value) && !hiddenLegacyV391.has(key)).map(([key]) => key);
    const priority = ['background','surface','text','border','accent','muted','hoverColor'];
    return all.sort((a,b) => {
      const ai = priority.indexOf(a), bi = priority.indexOf(b);
      if (ai !== bi) return (ai < 0 ? 999 : ai) - (bi < 0 ? 999 : bi);
      return titleFromKey(a).localeCompare(titleFromKey(b));
    });
  }

  function colorRow(key, label = titleFromKey(key)) {
    const customLabelsV320 = {
      dashboardLogButtonBackgroundV391: 'Log Button Background',
      dashboardLogButtonTextColorV391: 'Log Button Text',
      dashboardLogButtonIconColorV391: 'Log Button Icon',
      dashboardLogButtonBorderColorV391: 'Log Button Border',
      dashboardLogButtonHoverBackgroundV391: 'Log Button Hover Background',
      dashboardLogButtonHoverTextColorV391: 'Log Button Hover Text',
      dashboardLogButtonHoverIconColorV391: 'Log Button Hover Icon',
      dashboardLogButtonHoverBorderColorV391: 'Log Button Hover Border',
      dashboardNewLogButtonBackgroundV391: 'New Log Button Background (linked to Log Button)',
      dashboardNewLogButtonTextColorV391: 'New Log Button Text',
      dashboardNewLogButtonIconColorV391: 'New Log Button Plus Icon (linked to Log Button)',
      dashboardNewLogButtonBorderColorV391: 'New Log Button Border (linked to Log Button)',
      dashboardNewLogButtonHoverBackgroundV391: 'New Log Button Hover Background (linked to Log Button)',
      dashboardNewLogButtonHoverTextColorV391: 'New Log Button Hover Text (linked to Log Button)',
      dashboardNewLogButtonHoverIconColorV391: 'New Log Button Hover Plus Icon (linked to Log Button)',
      dashboardNewLogButtonHoverBorderColorV391: 'New Log Button Hover Border (linked to Log Button)',
      dashboardCreateLogIconHoverColorV320: 'Create Log Icon Hover Color',
      dashboardCreateLogIconHoverBackgroundV320: 'Create Log Icon Hover Background',
      dashboardCreateLogCategoryBackgroundColorV321: 'Create Log Category Background',
      dashboardCreateLogCategoryTextColorV321: 'Create Log Category Text',
      dashboardCreateLogCategoryBorderColorV321: 'Create Log Category Border',
      dashboardCreateLogCategoryHoverBackgroundColorV321: 'Create Log Category Hover Background',
      dashboardCreateLogCategoryHoverTextColorV321: 'Create Log Category Hover Text',
      dashboardCreateLogCategoryHoverBorderColorV321: 'Create Log Category Hover Border',
      dashboardCreateLogOverlayColorV396: 'Create Log Overlay Tint',
      dashboardCreateLogModalBackgroundColorV396: 'Create Log Modal Background (linked to Settings)',
      dashboardCreateLogModalTextColorV396: 'Create Log Modal Text (linked to Settings)',
      dashboardCreateLogModalBorderColorV396: 'Create Log Modal Border (linked to Settings)',
      dashboardCreateLogTitleColorV396: 'Create Log Title Text',
      dashboardCreateLogLabelColorV396: 'Create Log Field Labels',
      dashboardCreateLogInputBackgroundColorV396: 'Create Log Input Background (linked to Settings)',
      dashboardCreateLogInputTextColorV396: 'Create Log Name + Icon Search Text/Placeholder (shared; linked to Settings)',
      dashboardCreateLogInputBorderColorV396: 'Create Log Input Border (linked to Settings)',
      dashboardCreateLogInputHoverBackgroundColorV396: 'Create Log Input Hover Background',
      dashboardCreateLogInputHoverTextColorV396: 'Create Log Name + Icon Search Hover Text (shared)',
      dashboardCreateLogInputHoverBorderColorV396: 'Create Log Input Hover Border',
      dashboardCreateLogInputFocusBackgroundColorV396: 'Create Log Input Focus Background',
      dashboardCreateLogInputFocusTextColorV396: 'Create Log Name + Icon Search Focus Text (shared)',
      dashboardCreateLogInputFocusBorderColorV396: 'Create Log Input Focus Border',
      dashboardCreateLogIconBackgroundColorV396: 'Create Log Icon Background',
      dashboardCreateLogIconColorV396: 'Create Log Icon Color',
      dashboardCreateLogIconBorderColorV396: 'Create Log Icon Border',
      dashboardCreateLogIconHoverBackgroundColorV396: 'Create Log Icon Hover Background',
      dashboardCreateLogIconHoverColorV396: 'Create Log Icon Hover Color',
      dashboardCreateLogIconHoverBorderColorV396: 'Create Log Icon Hover Border',
      dashboardCreateLogIconSelectedBackgroundColorV396: 'Create Log Icon Selected Background',
      dashboardCreateLogIconSelectedColorV396: 'Create Log Icon Selected Color',
      dashboardCreateLogIconSelectedBorderColorV396: 'Create Log Icon Selected Border',
      dashboardCreateLogButtonBackgroundColorV396: 'Create Page Button Background',
      dashboardCreateLogButtonTextColorV396: 'Create Page Button Text',
      dashboardCreateLogButtonIconColorV396: 'Create Page Button Icon',
      dashboardCreateLogButtonBorderColorV396: 'Create Page Button Border',
      dashboardCreateLogButtonHoverBackgroundColorV396: 'Create Page Button Hover Background',
      dashboardCreateLogButtonHoverTextColorV396: 'Create Page Button Hover Text',
      dashboardCreateLogButtonHoverIconColorV396: 'Create Page Button Hover Icon',
      dashboardCreateLogButtonHoverBorderColorV396: 'Create Page Button Hover Border',
      dashboardCreateLogCloseBackgroundColorV396: 'Create Log Close Background',
      dashboardCreateLogCloseIconColorV396: 'Create Log Close X Color',
      dashboardCreateLogCloseBorderColorV396: 'Create Log Close Border',
      dashboardCreateLogCloseHoverBackgroundColorV396: 'Create Log Close Hover Background',
      dashboardCreateLogCloseHoverIconColorV396: 'Create Log Close Hover X Color',
      dashboardCreateLogCloseHoverBorderColorV396: 'Create Log Close Hover Border',
      themeSettingsPlusIconColorV322: 'Plus Icon Color',
      themeSettingsPlusBackgroundColorV322: 'Plus Background',
      themeSettingsPlusBorderColorV322: 'Plus Border',
      themeSettingsPlusHoverIconColorV322: 'Plus Hover Icon Color',
      themeSettingsPlusHoverBackgroundColorV322: 'Plus Hover Background',
      themeSettingsPlusHoverBorderColorV322: 'Plus Hover Border',
      settingsModalBackgroundColorV380: 'Settings Modal Background',
      settingsModalTextColorV380: 'Settings Modal Text',
      settingsModalBorderColorV380: 'Settings Modal Border',
      settingsModalOverlayColorV381: 'Settings Overlay Tint',
      settingsModalSectionBorderColorV381: 'Settings Section Dividers',
      settingsModalMutedTextColorV381: 'Settings Muted Text',
      settingsModalIconColorV381: 'Settings Icons',
      settingsModalInputBackgroundColorV380: 'Settings Input Background',
      settingsModalInputTextColorV380: 'Settings Input Text',
      settingsModalInputBorderColorV380: 'Settings Input Border',
      settingsModalCardBackgroundColorV380: 'Settings Cards Background',
      settingsModalCardTextColorV380: 'Settings Cards Text',
      settingsModalCardBorderColorV380: 'Settings Cards Border',
      settingsModalHoverBackgroundColorV380: 'Settings Hover Background',
      settingsModalHoverTextColorV380: 'Settings Hover Text',
      settingsModalSelectedBackgroundColorV380: 'Settings Selected Background',
      settingsModalSelectedTextColorV380: 'Settings Selected Text',
      settingsModalSelectedBorderColorV380: 'Settings Selected Border',
      settingsModalButtonBackgroundColorV380: 'Settings Button Background',
      settingsModalButtonTextColorV380: 'Settings Button Text',
      settingsModalButtonBorderColorV380: 'Settings Button Border',
      settingsWidgetBackgroundColorV380: 'Log Settings Widget Background',
      settingsWidgetTextColorV380: 'Log Settings Widget Text',
      settingsWidgetBorderColorV380: 'Log Settings Widget Border',
      settingsCursorNameTextColorV394: 'Cursor Name Text',
      settingsCompanionNameTextColorV394: 'Companion Name Text',
      settingsThemeNameTextColorV394: 'Theme Name Text',
      settingsThemeNameHoverTextColorV394: 'Theme Name Hover Text',
      dashboardContextMenuBackgroundColorV394: 'Right-click Menu Background (linked to Settings)',
      dashboardContextMenuTextColorV394: 'Right-click Menu Text',
      dashboardContextMenuBorderColorV394: 'Right-click Menu Border',
      dashboardContextMenuHoverBackgroundColorV394: 'Right-click Menu Hover Background',
      dashboardContextMenuHoverTextColorV394: 'Right-click Menu Hover Text'
    };
    label = customLabelsV320[key] || label;
    const value = safeHex(state.draft[key], '#ffffff');
    return `<div class="tb307-color-row" data-color-key="${attr(key)}"><label title="${attr(label)}">${esc(label)}</label><input type="color" value="${value}" data-color-picker="${attr(key)}"><input type="text" value="${value}" maxlength="7" data-color-text="${attr(key)}"></div>`;
  }

  function renderSmartPaletteV323() {
    const palette = smartPaletteV323(state.smartPaletteSeed, state.smartPaletteMode);
    return `<div class="tb307-section tb323-smart-palette">
      <h3>Smart Theme</h3>
      <p class="tb307-hint">Choose one base color and appearance. Loggy fills coordinated Theme Builder colors automatically.</p>
      <div class="tb323-smart-grid">
        <label class="tb323-smart-seed"><span>Base Color</span><input type="color" data-smart-palette-picker value="${attr(state.smartPaletteSeed)}"><input type="text" data-smart-palette-text maxlength="7" value="${attr(state.smartPaletteSeed)}" spellcheck="false"></label>
        <div class="tb323-mode-row"><button type="button" class="tb323-mode-btn${state.smartPaletteMode==='light'?' active':''}" data-action="smart-palette-mode" data-value="light">Light</button><button type="button" class="tb323-mode-btn${state.smartPaletteMode==='dark'?' active':''}" data-action="smart-palette-mode" data-value="dark">Dark</button></div>
      </div>
      <div class="tb323-swatches" aria-hidden="true">${[palette.page,palette.surface,palette.surface2,palette.border,palette.hover,palette.accent,palette.selected].map(color=>`<span style="background:${attr(color)}"></span>`).join('')}</div>
    </div>`;
  }

  function applySmartPaletteV323(seed = state.smartPaletteSeed, mode = state.smartPaletteMode) {
    const normalized = safeHex(seed, state.smartPaletteSeed || '#8b6fd8');
    state.smartPaletteSeed = normalized;
    state.smartPaletteMode = mode === 'dark' ? 'dark' : 'light';
    const palette = smartPaletteV323(normalized, state.smartPaletteMode);
    for (const key of colorKeys()) {
      const next = smartColorForFieldV323(key, titleFromKey(key), palette);
      if (!isHex(next)) continue;
      state.draft[key] = next;
      markTouched(key);
      const row = $(`[data-color-key="${CSS.escape(key)}"]`, state.modal);
      const picker = row?.querySelector('[data-color-picker]');
      const text = row?.querySelector('[data-color-text]');
      if (picker && document.activeElement !== picker) picker.value = next;
      if (text && document.activeElement !== text) text.value = next;
    }
    // Explicit backdrop fields are not always included in colorKeys on older themes.
    ['dailyLogBackgroundColor','contentBackdropColor'].forEach(key => {
      if (Object.prototype.hasOwnProperty.call(state.draft,key)) { state.draft[key] = palette.surface; markTouched(key); }
    });
    // If the user is already using a generated gradient, keep that background type but recolor it.
    if (inferBackgroundSourceV311(state.draft) === 'gradient') {
      state.draft.backgroundGradientNameV56 = state.smartPaletteMode === 'dark' ? 'Smart Dark Gradient' : 'Smart Light Gradient';
      state.draft.backgroundGradientV56 = `linear-gradient(135deg,${palette.page} 0%,${palette.surface} 48%,${palette.surface2} 100%)`;
      markTouched('backgroundGradientNameV56'); markTouched('backgroundGradientV56');
    }
    const smartPicker = $('[data-smart-palette-picker]', state.modal);
    const smartText = $('[data-smart-palette-text]', state.modal);
    if (smartPicker && document.activeElement !== smartPicker) smartPicker.value = normalized;
    if (smartText && document.activeElement !== smartText) smartText.value = normalized;
    const swatches = $$('.tb323-swatches span', state.modal);
    [palette.page,palette.surface,palette.surface2,palette.border,palette.hover,palette.accent,palette.selected].forEach((color,index) => { if (swatches[index]) swatches[index].style.background = color; });
    $$('[data-action="smart-palette-mode"]', state.modal).forEach(button => button.classList.toggle('active', button.dataset.value === state.smartPaletteMode));
    renderBackground(); schedulePreview();
    setStatus(`Smart Theme applied · ${state.smartPaletteMode === 'dark' ? 'Dark' : 'Light'}`);
  }

  function renderColors() {
    const panel = $('[data-panel="colors"]', state.modal); if (!panel) return;
    const groups = { main:[], navigation:[], daily:[], dashboard:[], themeSettings:[], knowledge:[], categories:[], other:[] };
    for (const key of colorKeys()) groups[colorGroup(key)].push(key);
    const labels = { main:'Main Colors', navigation:'Navigation & Page Titles', daily:'Daily Log Colors', dashboard:'Dashboard Colors', themeSettings:'Theme Settings Plus Button', knowledge:'Knowledge Base Colors', categories:'Category Colors', other:'Other Colors' };
    panel.innerHTML = `
      <label class="tb307-name"><span>Theme Name</span><input type="text" maxlength="48" data-theme-key="name" value="${attr(state.draft.name || '')}"></label>
      ${Object.entries(groups).filter(([,keys]) => keys.length).map(([id,keys], index) => `
        <details class="tb307-accordion"${index===0?' open':''}><summary>${labels[id]}</summary><div class="tb307-accordion-body">${keys.map(key => colorRow(key)).join('')}</div></details>
      `).join('')}`;
  }

  function sliderField(key, label, min, max, step = 1, suffix = '') {
    const value = clamp(state.draft[key], min, max, min);
    return `<label class="tb307-field"><span>${esc(label)} · <strong data-output-for="${attr(key)}">${value}${esc(suffix)}</strong></span><input type="range" min="${min}" max="${max}" step="${step}" value="${value}" data-number-key="${attr(key)}" data-output-suffix="${attr(suffix)}"></label>`;
  }

  function toggleRowV312(key, label, description = '') {
    return `<label class="tb312-use-toggle"><input type="checkbox" data-bool-key="${attr(key)}"><span class="tb312-switch-track" aria-hidden="true"></span><span class="tb312-use-copy"><strong>${esc(label)}</strong>${description ? `<small>${esc(description)}</small>` : ''}</span></label>`;
  }

  function renderBackground() {
    const panel = $('[data-panel="background"]', state.modal); if (!panel) return;
    const gradients = gradientPresets();
    const currentGradient = String(state.draft.backgroundGradientV56 || '');
    const source = inferBackgroundSourceV311(state.draft);
    state.draft.backgroundSourceV311 = source;
    const useBackdrops = inferPageBackdropsEnabledV312(state.draft);
    const useShape = inferShapeTypeEnabledV312(state.draft);
    state.draft.pageBackdropsEnabledV312 = useBackdrops;
    state.draft.shapeTypeEnabledV312 = useShape;
    const dailyBackdrop = state.draft.dailyLogBackgroundEnabled === true;
    const contentBackdrop = state.draft.contentBackdropEnabled === true;
    const headingBackdropV429 = state.draft.headingBackgroundEnabledV429 === true;
    const sourceCard = (id, title, description) => `<button type="button" class="tb311-bg-source${source===id?' active':''}" data-action="background-source" data-source="${attr(id)}" aria-pressed="${source===id?'true':'false'}"><span class="tb311-bg-switch" aria-hidden="true"></span><span class="tb311-bg-source-copy"><strong>${esc(title)}</strong><small>${esc(description)}</small></span></button>`;

    let activeControls = '';
    if (source === 'theme-color') {
      activeControls = `<div class="tb311-active-bg"><strong>Theme Color Background</strong><p class="tb307-hint">Uses the theme's Page Background color. No image, gradient, or custom code is allowed to override it.</p>${colorRow('background','Page Background Color')}</div>`;
    } else if (source === 'gradient') {
      activeControls = `<div class="tb311-active-bg"><strong>Gradient / Background Option</strong><p class="tb307-hint">Choose one preset or enter your own gradient CSS. Only this gradient is sent to the preview/runtime.</p><div class="tb307-gradient-grid">${gradients.map((preset,index) => `<button type="button" class="tb307-gradient${preset.css===currentGradient?' selected':''}" data-action="gradient-preset" data-gradient-index="${index}" style="background:${attr(preset.css)}" title="${attr(preset.name)}"><span>${esc(preset.name)}</span></button>`).join('')}</div><label class="tb307-field"><span>Gradient Name</span><input type="text" data-theme-key="backgroundGradientNameV56" placeholder="Soft Dawn"></label><label class="tb307-field"><span>Custom Gradient CSS</span><textarea data-theme-key="backgroundGradientV56" placeholder="linear-gradient(135deg,#ffffff,#eeeeee)"></textarea></label></div>`;
    } else if (source === 'image') {
      activeControls = `<div class="tb311-active-bg"><strong>Background Image</strong><p class="tb307-hint">The selected image becomes the only creative background source.</p><div class="tb307-actions"><button type="button" data-action="choose-background">Choose Image</button><button type="button" data-action="clear-background">Remove Image</button><span class="tb307-hint tb307-background-name"></span><input type="file" accept="image/*" data-file="background" hidden></div></div>`;
    } else {
      activeControls = `<div class="tb311-active-bg"><strong>Custom Background Code</strong><p class="tb307-hint">Uses one sandboxed self-contained HTML background. Image and gradient sources are disabled while this type is active.</p><div class="tb307-actions"><button type="button" data-action="copy-background-prompt">Copy Background Prompt</button><button type="button" data-action="clear-background-code">Clear Code</button></div><label class="tb307-field"><span>Interactive Background HTML</span><textarea data-theme-key="interactiveBackgroundCodeV56" rows="10" placeholder="Paste self-contained HTML here…"></textarea></label></div>`;
    }

    panel.innerHTML = `
      <div class="tb307-section">
        <h3>Background Type</h3>
        <p class="tb307-hint">Choose exactly one. Turning one type on turns the other background types off for both the preview and the saved theme, so there is no background priority conflict.</p>
        <div class="tb311-bg-source-grid">
          ${sourceCard('theme-color','Theme Color','Use the normal Page Background color from this theme.')}
          ${sourceCard('gradient','Gradient / Option','Use a preset or custom CSS gradient.')}
          ${sourceCard('image','Background Image','Use one uploaded image as the page background.')}
          ${sourceCard('custom-code','Custom Background Code','Use your self-contained interactive HTML background.')}
        </div>
        ${activeControls}
      </div>

      <details class="tb307-accordion tb312-background-group"${useBackdrops?' open':''}>
        <summary>Page Backdrops</summary>
        <div class="tb307-accordion-body">
          ${toggleRowV312('pageBackdropsEnabledV312','Use it','Adds one shared backdrop style inside Log pages only. Dashboard never uses a page backdrop.')}
          ${useBackdrops ? `<div class="tb312-subsettings">
            ${colorRow('pageBackdropColorV452', 'Backdrop color')}
            ${sliderField('pageBackdropOpacityV452', 'Backdrop opacity', 0, 100, 1, '%')}
            ${toggleRowV312('dailyLogBackgroundEnabled','Daily Logs','Use this backdrop on Daily Logs.')}
            ${toggleRowV312('contentBackdropEnabled','Other Log Pages','Use this same backdrop on Knowledge, Quizzes, Toolbox, custom tabs, and other pages inside a Log.')}
          </div>` : ''}
        </div>
      </details>

      <details class="tb307-accordion tb312-background-group"${state.draft.quizBackdropEnabledV456===true?' open':''}>
        <summary>Quiz Box Backdrop</summary>
        <div class="tb307-section">
          ${toggleRowV312('quizBackdropEnabledV456','Use Quiz Box Backdrop','Style the quiz box/card independently. The QUIZZES page title still follows Heading Backdrop.')}
          ${state.draft.quizBackdropEnabledV456===true ? `<div class="tb312-subsettings">
            ${colorRow('quizBackdropColorV456', 'Quiz Box Color')}
            ${sliderField('quizBackdropOpacityV456', 'Quiz Box Opacity', 0, 100, 1, '%')}
            ${sliderField('quizBackdropRadiusV456', 'Quiz Box Roundness', 0, 40, 1, 'px')}
            ${sliderField('quizBackdropPaddingV459', 'Quiz Box Padding', 0, 40, 1, 'px')}
          </div>` : ''}
        </div>
      </details>

      <details class="tb307-accordion tb312-background-group"${headingBackdropV429?' open':''}>
        <summary>Heading Backdrop</summary>
        <div class="tb307-accordion-body">
          ${toggleRowV312('headingBackgroundEnabledV429','Use Heading Backdrop','Adds a readable background behind main Log-page titles and section headings such as Items Learned, Log Notes, Video Logs, Knowledge Base, Quizzes, Ready to Review, and custom-tab titles.')}
          ${headingBackdropV429 ? `<div class="tb312-subsettings">
            ${colorRow('headingBackgroundColorV452', 'Heading Backdrop Color')}
            ${sliderField('headingBackgroundOpacityV452', 'Heading Backdrop Opacity', 0, 100, 1, '%')}
            ${sliderField('headingBackgroundPaddingV429', 'Heading Backdrop Padding', 0, 40, 1, 'px')}
            ${sliderField('headingBackgroundRadiusV452', 'Heading Backdrop Roundness', 0, 40, 1, 'px')}
          </div>` : ''}
        </div>
      </details>

      <details class="tb307-accordion tb312-background-group">
        <summary>Shape & Type</summary>
        <div class="tb307-accordion-body">
          <div class="tb312-subsettings">
            <div class="tb307-inline">${sliderField('radius','Corner Radius',0,30,1,'px')}${sliderField('shadow','Shadow Size',0,12,1,'px')}</div>
            <label class="tb307-field"><span>Font Style</span><select data-theme-key="font">${fontOptionsV326(state.draft.font)}</select></label>
          </div>
        </div>
      </details>`;
    syncSimpleControls(panel);
    const name = $('.tb307-background-name', panel);
    if (name) name.textContent = state.draft.backgroundImageName || (state.draft.backgroundImage ? fileName(state.draft.backgroundImage, 'Background selected') : 'No background image selected');
  }

  function availableThemeOptions() {
    const current = state.themeId;
    const output = [], seen = new Set();
    const add = (id, name) => {
      id = String(id || '').trim(); if (!id || id === 'default' || id === current || seen.has(id)) return;
      seen.add(id); output.push({ id, name:String(name || displayName(id)) });
    };
    try { Array.from(dailyThemeSelect?.options || []).forEach(option => add(option.value, option.textContent?.trim())); } catch {}
    try { Object.keys(BUILT_IN_THEME_PREVIEWS || {}).forEach(id => add(id, displayName(id))); } catch {}
    try { (readJsonStorage(SHARED_KEY, []) || []).forEach(item => add(item?.id, item?.name || item?.theme?.name)); } catch {}
    try { (db?.settings?.themeCopiesV30 || []).forEach(item => add(item?.id, item?.name || item?.theme?.name)); } catch {}
    return output.sort((a,b) => a.name.localeCompare(b.name));
  }

  function exactAudioBundle(theme) {
    if (!theme || typeof theme !== 'object') return { introAudio:null, hoverSounds:[] };
    // V416: once a theme has the canonical introAudio field, even an empty
    // string is authoritative. Do not resurrect an old song from legacy aliases
    // after Remove/replacement has intentionally cleared the canonical source.
    const hasCanonicalIntroV416 = Object.prototype.hasOwnProperty.call(theme,'introAudio');
    const introRaw = hasCanonicalIntroV416
      ? theme.introAudio
      : (theme.introAudioUrl || theme.introSong || theme.introMusic || theme.song || theme.music || '');
    const introAudio = normalizeAudioItem(typeof introRaw === 'object' ? introRaw : { url:introRaw, name:hasCanonicalIntroV416 ? (theme.introAudioName || '') : (theme.introAudioName || theme.introSongName || theme.songName || theme.musicName || '') }, 'Intro Audio');
    const hover = [];
    [theme.svgHoverSounds, theme.hoverSounds, theme.hoverAudio, theme.hoverSfx, theme.soundEffects].forEach(source => {
      (Array.isArray(source) ? source : (source ? [source] : [])).forEach(item => { const normalized = normalizeAudioItem(item, 'Hover Sound'); if (normalized) hover.push(normalized); });
    });
    (Array.isArray(theme.backgroundSvgs) ? theme.backgroundSvgs : []).forEach(asset => {
      const mapped = normalizeAudioItem({ url:asset?.hoverSoundUrl || asset?.hoverAudioUrl || '', name:asset?.hoverSoundName || '' }, 'Hover Sound');
      if (mapped) hover.push(mapped);
    });
    return { introAudio, hoverSounds:mergeSounds(hover) };
  }

  function savedThemeRecord(themeId) {
    const id = String(themeId || ''); if (!id) return { theme:null, authoritative:false };
    if (id === 'theme-custom-builder') { try { const theme = getCustomThemeSettings?.(); if (theme) return { theme, authoritative:true }; } catch {} }
    // V416: shared custom-theme records are the canonical saved source. A
    // themeCopiesV30 mirror can lag one save behind and must not win audio reuse.
    const shared = readJsonStorage(SHARED_KEY, []); const entry = Array.isArray(shared) ? shared.find(item => String(item?.id || '') === id) : null;
    if (entry?.theme) return { theme:entry.theme, authoritative:true };
    try { const copy = getThemeCopyV30?.(id); if (copy?.theme) return { theme:copy.theme, authoritative:true }; } catch {}
    try { const override = getThemeOverrideV25?.(id); if (override && typeof override === 'object') return { theme:override, authoritative:true }; } catch {}
    const map = readJsonStorage(OVERRIDE_KEY, {}); const override = map?.[id]?.theme || map?.[id];
    if (override && typeof override === 'object') return { theme:override, authoritative:true };
    return { theme:null, authoritative:false };
  }

  async function configuredAudioBundle(themeId) {
    const id = String(themeId || ''); if (!id) return { introAudio:null, hoverSounds:[] };
    if (state.audioBundleCache.has(id)) return state.audioBundleCache.get(id);
    const promise = (async () => {
      const saved = savedThemeRecord(id); if (saved.authoritative) return exactAudioBundle(saved.theme);
      const slug = themeSlug(id); if (!slug) return { introAudio:null, hoverSounds:[] };
      try {
        const response = await fetch(`/api/built-in-theme-audio-config/${encodeURIComponent(slug)}`, { cache:'no-store' });
        if (!response.ok) return { introAudio:null, hoverSounds:[] };
        const data = await response.json().catch(() => ({}));
        return { introAudio:normalizeAudioItem(data?.introAudio, 'Intro Audio'), hoverSounds:mergeSounds(data?.hoverSounds || []) };
      } catch { return { introAudio:null, hoverSounds:[] }; }
    })();
    state.audioBundleCache.set(id, promise);
    try { return await promise; } catch { state.audioBundleCache.delete(id); return { introAudio:null, hoverSounds:[] }; }
  }

  function soundRows() {
    const list = Array.isArray(state.draft.svgHoverSounds) ? state.draft.svgHoverSounds : [];
    if (!list.length) return `<div class="tb307-empty">No hover sounds yet.</div>`;
    return `<div class="tb307-sound-list">${list.map((sound,index) => {
      const item = normalizeAudioItem(sound, `Hover Sound ${index+1}`) || { name:`Hover Sound ${index+1}`, url:'' };
      return `<div class="tb307-sound"><span class="tb307-sound-name" title="${attr(item.name)}">${esc(item.name)}</span><button type="button" data-action="play-sound" data-sound-index="${index}">Play</button><button type="button" data-action="remove-sound" data-sound-index="${index}">Remove</button></div>`;
    }).join('')}</div>`;
  }

  let introReuseOptionsRequestV413 = 0;
  async function refreshIntroReuseOptionsV413(panel) {
    const select = $('[data-action-select="reuse-intro"]', panel || state.modal);
    if (!select) return;
    const requestId = ++introReuseOptionsRequestV413;
    const selectedId = String(state.draft.introAudioSourceThemeIdV364 || '');
    const candidates = availableThemeOptions();
    select.disabled = true;
    select.innerHTML = '<option value="">Loading themes with intro songs…</option>';
    const rows = await Promise.all(candidates.map(async item => {
      try {
        const bundle = await configuredAudioBundle(item.id);
        return bundle?.introAudio?.url ? item : null;
      } catch { return null; }
    }));
    if (requestId !== introReuseOptionsRequestV413 || !select.isConnected) return;
    const themesWithSongs = rows.filter(Boolean).sort((a,b) => a.name.localeCompare(b.name));
    select.innerHTML = `<option value="">${themesWithSongs.length ? 'Select a theme…' : 'No other themes have intro songs'}</option>${themesWithSongs.map(item=>`<option value="${attr(item.id)}">${esc(item.name)}</option>`).join('')}`;
    if (selectedId && themesWithSongs.some(item => String(item.id) === selectedId)) select.value = selectedId;
    select.disabled = themesWithSongs.length === 0;
  }

  function renderAudio() {
    const panel = $('[data-panel="audio"]', state.modal); if (!panel) return;
    const themes = availableThemeOptions();
    const introRemovedV423 = state.draft.introAudioRemovedV423 === true;
    const introName = introRemovedV423
      ? 'No intro song'
      : (state.draft.introAudioName || (state.draft.introAudio ? fileName(state.draft.introAudio, 'Intro Audio') : 'No intro song'));
    const hoverSoundsEnabled = !!state.draft.svgHoverSoundsEnabled;
    panel.innerHTML = `
      <div class="tb307-section">
        <h3>Intro Song</h3><p class="tb307-hint">Upload a song or reuse the configured intro song from another theme.</p>
        <div class="tb307-actions"><button type="button" data-action="choose-audio">Choose Song</button><button type="button" data-action="clear-audio">Remove</button><button type="button" data-action="play-intro">Play</button><span class="tb307-hint">${esc(introName)}</span><input type="file" accept="audio/*" data-file="audio" hidden></div>
        <label class="tb307-field"><span>Reuse song from theme</span><select data-action-select="reuse-intro"><option value="">Loading themes with intro songs…</option></select></label>
        <label class="tb307-field"><span>Playback</span><select data-theme-key="audioPlayMode"><option value="full">Play Full Audio</option><option value="segment">Use Start & End</option></select></label>
        ${String(state.draft.audioPlayMode||'full')==='segment' ? `<div class="tb307-inline" data-audio-segment-fields-v364><label class="tb307-field"><span>Start</span><input type="text" data-theme-key="audioStart" placeholder="00:00"></label><label class="tb307-field"><span>End</span><input type="text" data-theme-key="audioEnd" placeholder="00:20"></label></div>` : ''}
        <label class="tb307-check"><input type="checkbox" data-bool-key="audioFade"> Fade out at the end</label>
        ${sliderField('audioVolume','Audio Volume',0,100,1,'%')}
      </div>
      <div class="tb307-section">
        <h3>Decoration Hover Sounds</h3>
        ${toggleRowV312('svgHoverSoundsEnabled','Enable Decoration Hover Sounds','Play sound effects when decorations are hovered.')}
        ${hoverSoundsEnabled ? `<div class="tb316-toggle-settings">
          <label class="tb307-field"><span>Sound Assignment</span><select data-theme-key="svgHoverSoundMode"><option value="random">Random sound</option><option value="mapped">Mapped per decoration</option></select></label>
          <div class="tb307-actions"><button type="button" data-action="choose-hover-sounds">Add Sounds</button><input type="file" accept="audio/*" multiple data-file="hover-sounds" hidden></div>
          <label class="tb307-field"><span>Reuse hover sounds from theme</span><select data-action-select="reuse-hover"><option value="">Select a theme…</option>${themes.map(item=>`<option value="${attr(item.id)}"${String(state.draft.hoverAudioSourceThemeIdV364||'')===String(item.id)?' selected':''}>${esc(item.name)}</option>`).join('')}</select></label>
          ${soundRows()}
          <div class="tb307-inline"><label class="tb307-field"><span>Stop Hover Sound</span><select data-theme-key="svgHoverSoundStopModeV87"><option value="immediate">Immediately</option><option value="delay">After a delay</option></select></label><label class="tb307-field"><span>Stop Delay (seconds)</span><input type="number" min="0.1" max="10" step="0.1" data-number-key="svgHoverSoundStopDelayV87"></label></div>
        </div>` : ''}
      </div>`;
    syncSimpleControls(panel);
    refreshIntroReuseOptionsV413(panel);
  }

  function safeMarkup(markup) {
    const src = String(markup || '').trim(); if (!src.toLowerCase().startsWith('<svg')) return '';
    try {
      const doc = new DOMParser().parseFromString(src, 'image/svg+xml'); const svg = doc.documentElement;
      if (!svg || svg.nodeName.toLowerCase() !== 'svg') return '';
      svg.querySelectorAll('script,foreignObject,iframe,object,embed').forEach(node => node.remove());
      svg.querySelectorAll('*').forEach(node => Array.from(node.attributes || []).forEach(a => { if (/^on/i.test(a.name) || /javascript:/i.test(a.value)) node.removeAttribute(a.name); }));
      return new XMLSerializer().serializeToString(svg);
    } catch { return ''; }
  }

  function decorationVisual(item) {
    const markup = safeMarkup(item?.markup); if (markup) return markup;
    const url = String(item?.url || ''); if (!url) return '<span>✦</span>';
    return `<img src="${attr(url)}" alt="">`;
  }

  function effectiveDecorationAnimation(asset) {
    return String(asset?.animationOverride || state.draft.svgDefaultAnimation || asset?.animation || 'float');
  }

  function ensureManualSlots() {
    const count = (state.draft.backgroundSvgs || []).length;
    const source = Array.isArray(state.draft.manualPlacementSlotsV40) ? state.draft.manualPlacementSlotsV40 : [];
    const next = [];
    for (let index=0; index<count; index++) {
      const raw = source[index] || {};
      const angle = (index / Math.max(1,count)) * Math.PI * 2;
      next.push({ x:clamp(raw.x,3,97,50 + Math.cos(angle)*32), y:clamp(raw.y,4,96,50 + Math.sin(angle)*32) });
    }
    state.draft.manualPlacementSlotsV40 = next;
  }

  function decorationCard(asset, index) {
    const animation = effectiveDecorationAnimation(asset);
    const mapped = String(state.draft.svgHoverSoundMode || 'random') === 'mapped';
    const sounds = Array.isArray(state.draft.svgHoverSounds) ? state.draft.svgHoverSounds : [];
    const soundValue = String(asset?.hoverSoundUrl || '');
    const manual = state.draft.svgDistribution === 'manual-fixed';
    const slot = (state.draft.manualPlacementSlotsV40 || [])[index] || { x:50, y:50 };
    return `<div class="tb307-deco-card" data-decoration-index="${index}">
      <div class="tb307-deco-head"><div class="tb307-deco-art">${decorationVisual(asset)}</div><div><div class="tb307-deco-name" title="${attr(asset?.name || `Decoration ${index+1}`)}">${esc(asset?.name || `Decoration ${index+1}`)}</div><div class="tb307-hint">${esc(registeredAnimationsV326().find(([id])=>id===animation)?.[1] || titleFromKey(animation))}</div></div><div style="display:flex;align-items:center;gap:6px"><button type="button" class="tb307-small" data-action="download-decoration-v429" data-index="${index}" title="Download this decoration" aria-label="Download this decoration"><i class="ph ph-download-simple"></i></button><button type="button" class="tb307-small" data-action="remove-decoration" data-index="${index}">Remove</button></div></div>
      <details><summary>Customize</summary><div class="tb307-deco-options">
        <label class="tb307-check"><input type="checkbox" data-deco-hidden="${index}"${asset?.hiddenOnScreenV63===true?' checked':''}> Don't show on screen</label>
        <label class="tb307-check"><input type="checkbox" data-deco-always-show="${index}"${asset?.alwaysShowOnScreenV370===true?' checked':''}${asset?.hiddenOnScreenV63===true?' disabled':''}> Always show on screen</label>
        <label class="tb307-check"><input type="checkbox" data-deco-opacity-override="${index}"${asset?.opacityOverrideV326===true?' checked':''}> Override global opacity</label>
        ${asset?.opacityOverrideV326===true
          ? `<label class="tb307-field"><span>Opacity · <strong data-deco-opacity-output="${index}">${clamp(asset?.opacityV109,0,100,100)}%</strong></span><input type="range" min="0" max="100" step="1" value="${clamp(asset?.opacityV109,0,100,100)}" data-deco-opacity="${index}"></label>`
          : `<small class="tb307-hint">Using global opacity · ${clamp(state.draft.decorationsOpacityV117,0,100,100)}%</small>`}
        <label class="tb307-field"><span>Animation</span><select data-deco-animation="${index}"><option value=""${!asset?.animationOverride?' selected':''}>Use Default · ${esc(registeredAnimationsV326().find(([id])=>id===state.draft.svgDefaultAnimation)?.[1] || titleFromKey(state.draft.svgDefaultAnimation))}</option>${registeredAnimationsV326().map(([id,label])=>`<option value="${id}"${asset?.animationOverride===id?' selected':''}>${esc(label)}</option>`).join('')}</select></label>
        ${animation === 'cross-screen' ? `<div class="tb307-field"><span>Artwork faces</span><div class="tb307-direction"><button type="button" data-action="direction" data-index="${index}" data-direction="left" class="${asset?.crossDirectionV139==='left'?'selected':''}">L</button><button type="button" data-action="direction" data-index="${index}" data-direction="right" class="${asset?.crossDirectionV139!=='left'?'selected':''}">R</button></div><small class="tb307-hint">Choose the direction the original artwork naturally faces. Across Screen flips it automatically when needed.</small></div>` : ''}
        <label class="tb307-field"><span>Bop with Intro Song</span><select data-deco-bop="${index}"><option value="auto"${asset?.bopModeV60==='auto'?' selected':''}>Follow global setting</option><option value="always"${asset?.bopModeV60==='always'?' selected':''}>Prioritize bop</option><option value="never"${asset?.bopModeV60==='never'?' selected':''}>Never bop</option></select></label>
        <label class="tb307-field"><span>Hover Animation</span><select data-deco-hover="${index}">${hoverOptions(asset?.hoverAnimationOverrideV82 || '', true)}</select></label>
        ${mapped ? `<label class="tb307-field"><span>Hover Sound</span><select data-deco-sound="${index}"><option value="">None / automatic</option>${sounds.map(sound=>{const item=normalizeAudioItem(sound,'Hover Sound'); return item?`<option value="${attr(item.url)}"${soundValue===item.url?' selected':''}>${esc(item.name)}</option>`:''}).join('')}</select></label>` : ''}
        ${manual ? `<div class="tb307-inline"><label class="tb307-field"><span>Manual Slot X</span><input type="number" min="3" max="97" step="1" value="${clamp(slot.x,3,97,50)}" data-slot-index="${index}" data-slot-axis="x"></label><label class="tb307-field"><span>Manual Slot Y</span><input type="number" min="4" max="96" step="1" value="${clamp(slot.y,4,96,50)}" data-slot-index="${index}" data-slot-axis="y"></label></div>` : ''}
      </div></details>
    </div>`;
  }

  function renderDecorations() {
    const panel = $('[data-panel="decorations"]', state.modal); if (!panel) return;
    ensureManualSlots();
    const list = Array.isArray(state.draft.backgroundSvgs) ? state.draft.backgroundSvgs : [];
    panel.innerHTML = `
      <div class="tb307-section">
        <h3>Decoration Motion & Layout</h3>
        <div class="tb307-actions"><button type="button" data-action="choose-decoration">Add Decorations</button><input type="file" accept="image/*,.svg" multiple data-file="decorations" hidden></div>
        <label class="tb307-field"><span>Default Animation</span><select data-theme-key="svgDefaultAnimation">${animationOptions(state.draft.svgDefaultAnimation)}</select></label>
        ${!['still','theme-custom-animation'].includes(state.draft.svgDefaultAnimation) ? sliderField('decorationAnimationSpeedV369','Animation Speed',25,200,5,'%') : ''}
        <label class="tb307-field"><span>Distribution</span><select data-theme-key="svgDistribution">${distributionOptions(state.draft.svgDistribution)}</select></label>
        <div class="tb307-field"><span>Decoration Size</span><div class="tb307-range-row"><button type="button" data-action="scale-step" data-delta="-10">−</button><input type="range" min="50" max="220" step="5" value="${clamp(state.draft.svgGlobalScale,50,220,100)}" data-number-key="svgGlobalScale"><span class="tb307-range-value" data-output-for="svgGlobalScale">${clamp(state.draft.svgGlobalScale,50,220,100)}%</span><button type="button" data-action="scale-step" data-delta="10">+</button></div></div>
        ${sliderField('decorationsOpacityV117','Decoration Opacity',0,100,1,'%')}
        <label class="tb307-check"><input type="checkbox" data-bool-key="svgAllowOverlap"> Allow decorations to overlap</label>
        <label class="tb307-check"><input type="checkbox" data-bool-key="reduceDecorationOverlapV361"> Reduce decoration overlap</label>
        <label class="tb307-check"><input type="checkbox" data-bool-key="preventDecorationOverlapV367"> Prevent decoration overlap</label>
      </div>
      <div class="tb307-section">
        <h3>Intro Song Reactions</h3>
        ${toggleRowV312('introSvgBounceEnabled','Decorations React/Bop With Intro Song','Animate decorations in time with the intro song.')}
        ${state.draft.introSvgBounceEnabled ? `<div class="tb316-toggle-settings">
          <label class="tb307-field"><span>How many decorations bop?</span><select data-theme-key="introSvgBopMode"><option value="some">Balanced subset</option><option value="all">More decorations (still balanced)</option></select></label>
          ${sliderField('introSvgBopIntensityV369','Bop Intensity',25,200,5,'%')}
        </div>` : ''}
        ${toggleRowV312('introMusicReactionsEnabledV154','Enable Extra Intro-Music Visual Reactions','Add the extra music-reactive visual effects.')}
      </div>
      <div class="tb307-section">
        <h3>Hover Animations</h3>
        ${toggleRowV312('svgHoverAnimationsEnabledV82','Animate Decorations When Hovered','Play a decoration animation when the pointer moves over it.')}
        ${state.draft.svgHoverAnimationsEnabledV82 ? `<div class="tb316-toggle-settings">
          <label class="tb307-field"><span>Default Hover Animation</span><select data-theme-key="svgHoverAnimationV82">${hoverOptions(state.draft.svgHoverAnimationV82, false)}</select></label>
        </div>` : ''}
      </div>
      <div class="tb307-section"><div style="display:flex;align-items:center;justify-content:space-between;gap:10px"><h3 style="margin:0">Decorations · ${list.length}</h3>${list.length ? `<button type="button" class="tb307-small" data-action="download-all-decorations-v429" title="Download all decorations" aria-label="Download all decorations"><i class="ph ph-download-simple"></i> All</button>` : ''}</div>${list.length ? `<div class="tb307-deco-grid">${list.map(decorationCard).join('')}</div>` : `<div class="tb307-empty">This theme has no decorations yet. Use Add Decorations above.</div>`}</div>`;
    syncSimpleControls(panel);
  }

  // V429 — decoration export helpers.
  function safeDownloadNameV429(value, fallback = 'decoration.svg') {
    let name = String(value || fallback).split(/[?#]/)[0].split('/').pop() || fallback;
    try { name = decodeURIComponent(name); } catch {}
    name = name.replace(/[\\/:*?"<>|]+/g, '-').replace(/\s+/g, ' ').trim() || fallback;
    return name;
  }

  function extensionFromTypeV429(type = '') {
    const t = String(type || '').toLowerCase();
    if (t.includes('svg')) return '.svg';
    if (t.includes('png')) return '.png';
    if (t.includes('jpeg') || t.includes('jpg')) return '.jpg';
    if (t.includes('webp')) return '.webp';
    if (t.includes('gif')) return '.gif';
    return '';
  }

  async function decorationBlobV429(asset) {
    const item = normalizeDecoration(asset);
    if (!item) throw new Error('Decoration is unavailable.');
    if (String(item.markup || '').trim()) {
      const markup = String(item.markup).trim();
      return { blob:new Blob([markup], { type:'image/svg+xml;charset=utf-8' }), preferredName:safeDownloadNameV429(item.name || 'decoration.svg','decoration.svg') };
    }
    const src = String(item.url || '').trim();
    if (!src) throw new Error('Decoration has no downloadable source.');
    const response = await fetch(src, { cache:'no-store' });
    if (!response.ok) throw new Error(`Download failed (${response.status}).`);
    const blob = await response.blob();
    return { blob, preferredName:safeDownloadNameV429(item.name || src, `decoration${extensionFromTypeV429(blob.type) || '.svg'}`) };
  }

  async function downloadDecorationV429(asset, index = 0) {
    const { blob, preferredName } = await decorationBlobV429(asset);
    let name = preferredName;
    if (!/\.[a-z0-9]{2,5}$/i.test(name)) name += extensionFromTypeV429(blob.type) || '.svg';
    if (!name) name = `decoration-${index + 1}.svg`;
    const href = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = href;
    anchor.download = name;
    anchor.style.display = 'none';
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    setTimeout(() => URL.revokeObjectURL(href), 2500);
  }

  function crc32V429(bytes) {
    let crc = 0xffffffff;
    for (let i = 0; i < bytes.length; i++) {
      crc ^= bytes[i];
      for (let bit = 0; bit < 8; bit++) crc = (crc >>> 1) ^ (0xedb88320 & -(crc & 1));
    }
    return (crc ^ 0xffffffff) >>> 0;
  }

  function zipDateTimeV429(date = new Date()) {
    const year = Math.max(1980, date.getFullYear());
    const time = ((date.getHours() & 31) << 11) | ((date.getMinutes() & 63) << 5) | ((Math.floor(date.getSeconds() / 2)) & 31);
    const day = ((year - 1980) << 9) | (((date.getMonth() + 1) & 15) << 5) | (date.getDate() & 31);
    return { time, day };
  }

  function u16V429(value) {
    const b = new Uint8Array(2);
    new DataView(b.buffer).setUint16(0, value, true);
    return b;
  }

  function u32V429(value) {
    const b = new Uint8Array(4);
    new DataView(b.buffer).setUint32(0, value >>> 0, true);
    return b;
  }

  async function buildDecorationZipV429(files) {
    const encoder = new TextEncoder();
    const localParts = [];
    const centralParts = [];
    let offset = 0;
    const stamp = zipDateTimeV429();

    for (const file of files) {
      const nameBytes = encoder.encode(file.name);
      const data = new Uint8Array(await file.blob.arrayBuffer());
      const crc = crc32V429(data);

      const local = [
        u32V429(0x04034b50),
        u16V429(20),
        u16V429(0x0800),
        u16V429(0),
        u16V429(stamp.time),
        u16V429(stamp.day),
        u32V429(crc),
        u32V429(data.length),
        u32V429(data.length),
        u16V429(nameBytes.length),
        u16V429(0),
        nameBytes,
        data
      ];
      localParts.push(...local);

      const central = [
        u32V429(0x02014b50),
        u16V429(20),
        u16V429(20),
        u16V429(0x0800),
        u16V429(0),
        u16V429(stamp.time),
        u16V429(stamp.day),
        u32V429(crc),
        u32V429(data.length),
        u32V429(data.length),
        u16V429(nameBytes.length),
        u16V429(0),
        u16V429(0),
        u16V429(0),
        u16V429(0),
        u32V429(0),
        u32V429(offset),
        nameBytes
      ];
      centralParts.push(...central);

      offset += 30 + nameBytes.length + data.length;
    }

    const centralSize = centralParts.reduce((sum, part) => sum + part.byteLength, 0);
    const end = [
      u32V429(0x06054b50),
      u16V429(0),
      u16V429(0),
      u16V429(files.length),
      u16V429(files.length),
      u32V429(centralSize),
      u32V429(offset),
      u16V429(0)
    ];

    return new Blob([...localParts, ...centralParts, ...end], { type:'application/zip' });
  }

  async function downloadAllDecorationsV429() {
    const list = Array.isArray(state.draft.backgroundSvgs) ? state.draft.backgroundSvgs : [];
    if (!list.length) { setStatus('No decorations to download.'); return; }

    const files = [];
    for (let index = 0; index < list.length; index++) {
      try {
        const { blob, preferredName } = await decorationBlobV429(list[index]);
        let name = preferredName || `decoration-${index + 1}`;
        if (!/\.[a-z0-9]{2,5}$/i.test(name)) name += extensionFromTypeV429(blob.type) || '.svg';
        files.push({ name, blob });
      } catch (error) {
        console.warn('[Theme Builder V429] Decoration download failed:', error);
      }
    }

    if (!files.length) { setStatus('Could not download any decorations.'); return; }

    const zip = await buildDecorationZipV429(files);
    const href = URL.createObjectURL(zip);
    const anchor = document.createElement('a');
    anchor.href = href;
    anchor.download = `${slugV326(state.draft.name || 'theme')}-decorations.zip`;
    anchor.style.display = 'none';
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    setTimeout(() => URL.revokeObjectURL(href), 5000);
    setStatus(`Downloaded ${files.length} decoration${files.length === 1 ? '' : 's'} as one ZIP.`);
  }

  function optionValue(option) { return typeof option === 'string' ? option : String(option?.id || option?.value || option?.key || ''); }
  function optionLabel(option) { return typeof option === 'string' ? titleFromKey(option) : String(option?.name || option?.label || optionValue(option)); }
  function optionVisual(option) {
    if (typeof option === 'object' && option) {
      if (option.previewSvg || option.svg || option.markup) return safeMarkup(option.previewSvg || option.svg || option.markup) || esc(option.icon || '✦');
      if (option.preview || option.url || option.image) return `<img src="${attr(option.preview || option.url || option.image)}" alt="">`;
      if (option.icon) return `<span>${esc(option.icon)}</span>`;
    }
    return '<span>✦</span>';
  }

  // V315: render cursor previews exactly like the real Mouse Pointer picker.
  // CURSOR_OPTIONS is trusted application-owned data, so its inline SVG can be
  // rendered directly. FX cursors use their emoji and default/none always gets
  // a visible mouse glyph instead of a blank generic preview.
  function cursorVisualV315(option) {
    const id = optionValue(option);
    const fxEmoji = { sparkle:'✨', sparkles:'✨', hearts:'💖', bubbles:'🫧' }[id];
    if (fxEmoji) return `<span class="tb315-cursor-emoji" aria-hidden="true">${fxEmoji}</span>`;
    if (!option || typeof option !== 'object') return '<span class="tb315-cursor-emoji" aria-hidden="true">🖱️</span>';
    if (option.kind === 'image' && option.svg) return String(option.svg);
    if (option.kind === 'fx') return `<span class="tb315-cursor-emoji" aria-hidden="true">${esc(option.emoji || '✨')}</span>`;
    if (option.svg) return String(option.svg);
    if (option.emoji) return `<span class="tb315-cursor-emoji" aria-hidden="true">${esc(option.emoji)}</span>`;
    return '<span class="tb315-cursor-emoji" aria-hidden="true">🖱️</span>';
  }

  function getCursorOptions() {
    try { if (Array.isArray(CURSOR_OPTIONS)) return CURSOR_OPTIONS; } catch {}
    try { if (Array.isArray(THEME_CURSOR_OPTIONS_V32)) return THEME_CURSOR_OPTIONS_V32; } catch {}
    return ['default'];
  }
  function getCompanionOptions() {
    try { if (Array.isArray(COMPANIONS)) return COMPANIONS; } catch {}
    try { if (Array.isArray(COMPANION_OPTIONS)) return COMPANION_OPTIONS; } catch {}
    return ['none'];
  }

  function renderTrinkets() {
    const panel = $('[data-panel="trinkets"]', state.modal); if (!panel) return;
    const panelScrollV452 = panel.scrollTop;
    const galleriesV452 = Array.from(panel.querySelectorAll('.tb307-trinket-grid')).map(el => el.scrollTop);
    const cursorEnabled = !!state.draft.useThemeCursor;
    const companionEnabled = !!state.draft.useThemeCompanion;
    const cursorValue = String(state.draft.themeCursorStyle || 'default');
    const companionValue = String(state.draft.themeCompanion || 'none');
    const cursorOptions = getCursorOptions(), companionOptions = getCompanionOptions();
    panel.innerHTML = `
      <div class="tb307-section">
        <h3>Cursors</h3>
        ${toggleRowV312('useThemeCursor','Enable Cursor','Use the selected cursor with this theme.')}
        <div class="tb307-trinket-grid tb315-trinket-gallery${cursorEnabled?'':' is-disabled'}">${cursorOptions.map(option=>{const id=optionValue(option)||'default';return `<button type="button" class="tb307-trinket${cursorValue===id?' selected':''}" data-action="select-cursor" data-value="${attr(id)}" aria-disabled="${cursorEnabled?'false':'true'}"${cursorEnabled?'':' disabled'}><span class="tb307-trinket-art tb314-cursor-art">${cursorVisualV315(option)}</span><span>${esc(optionLabel(option)||'Default')}</span></button>`}).join('')}</div>
      </div>
      <div class="tb307-section">
        <h3>Companions</h3>
        ${toggleRowV312('useThemeCompanion','Enable Companion','Use the selected companion with this theme.')}
        <div class="tb307-trinket-grid tb315-trinket-gallery${companionEnabled?'':' is-disabled'}">${companionOptions.map(option=>{const id=optionValue(option)||'none';return `<button type="button" class="tb307-trinket${companionValue===id?' selected':''}" data-action="select-companion" data-value="${attr(id)}" aria-disabled="${companionEnabled?'false':'true'}"${companionEnabled?'':' disabled'}><span class="tb307-trinket-art">${optionVisual(option)}</span><span>${esc(optionLabel(option)||'None')}</span></button>`}).join('')}</div>
      </div>`;
    syncSimpleControls(panel);
    requestAnimationFrame(() => {
      panel.scrollTop = panelScrollV452;
      Array.from(panel.querySelectorAll('.tb307-trinket-grid')).forEach((el,index) => {
        if (Number.isFinite(galleriesV452[index])) el.scrollTop = galleriesV452[index];
      });
    });
  }

  function autoThemeToggleV324(tool, label, description) {
    const checked = state.autoThemeTool === tool;
    return `<label class="tb312-use-toggle"><input type="checkbox" data-auto-theme-tool="${attr(tool)}"${checked?' checked':''}><span class="tb312-switch-track" aria-hidden="true"></span><span class="tb312-use-copy"><strong>${esc(label)}</strong><small>${esc(description)}</small></span></label>`;
  }

  function renderAI() {
    const panel = $('[data-panel="ai"]', state.modal); if (!panel) return;
    const smartOpen = state.autoThemeTool === 'smart';
    const aiOpen = state.autoThemeTool === 'ai';
    const parsedBundle = parseAiThemeBundleV376(state.aiJsonText);
    const lightReady = !!parsedBundle?.variants?.light || hasAiVariantV376('light');
    const darkReady = !!parsedBundle?.variants?.dark || hasAiVariantV376('dark');
    const selectedReady = state.aiThemeMode === 'dark' ? darkReady : lightReady;
    const versionSummary = lightReady && darkReady
      ? 'Both Light and Dark versions are available and will be saved together with this theme.'
      : lightReady || darkReady
        ? `Only the ${lightReady ? 'Light' : 'Dark'} version is available right now. The new AI prompt generates both.`
        : 'The AI prompt generates BOTH Light and Dark versions in one JSON bundle.';
    panel.innerHTML = `
      <div class="tb324-auto-choice${smartOpen?' is-active':''}">
        ${autoThemeToggleV324('smart','Smart Theme','Build a coordinated theme automatically from one base color.')}
        ${smartOpen ? `<div class="tb324-auto-choice-body">${renderSmartPaletteV323()}</div>` : ''}
      </div>
      <div class="tb324-auto-choice${aiOpen?' is-active':''}">
        ${autoThemeToggleV324('ai','AI Theme Builder','Generate matching Light + Dark versions from the same visual references, then switch between them anytime.')}
        ${aiOpen ? `<div class="tb324-auto-choice-body">
          <div class="tb323-mode-row"><strong>Theme Version</strong><button type="button" class="tb323-mode-btn${state.aiThemeMode==='light'?' active':''}" data-action="ai-theme-mode" data-value="light">Light</button><button type="button" class="tb323-mode-btn${state.aiThemeMode==='dark'?' active':''}" data-action="ai-theme-mode" data-value="dark">Dark</button></div>
          <small class="tb307-hint">${esc(versionSummary)} Click Light or Dark to preview a saved version immediately, then use Save Theme to make that version active.</small>
          <div class="tb432-ai-options">
            <div class="tb432-ai-option-row">
              <div class="tb432-ai-option-label"><strong>AI Styling</strong><small>${state.aiBuilderDepthV432==='advanced'?'Advanced builds a stronger material/style language across cards, inputs, buttons, borders, surfaces, and motion while keeping the layout usable.':'Basic uses Loggy’s normal theme controls to create a polished, coordinated palette, surfaces, typography, radii, shadows, states, and background without redesigning the UI materials.'}</small></div>
              <div class="tb432-ai-segments"><button type="button" class="tb432-ai-segment${state.aiBuilderDepthV432==='basic'?' active':''}" data-action="ai-builder-depth-v432" data-value="basic">Basic</button><button type="button" class="tb432-ai-segment${state.aiBuilderDepthV432==='advanced'?' active':''}" data-action="ai-builder-depth-v432" data-value="advanced">Advanced</button></div>
            </div>
            <div class="tb432-ai-option-row">
              <div class="tb432-ai-option-label"><strong>Background Focus</strong><small>${state.aiBackgroundFocusV479==='enhanced'?'Enhanced asks the AI to spend extra design effort on the page scene/background, including richer ambient detail when it fits the references.':'Standard keeps the background polished and supportive instead of making it a major visual focus.'}</small></div>
              <div class="tb432-ai-segments"><button type="button" class="tb432-ai-segment${state.aiBackgroundFocusV479==='standard'?' active':''}" data-action="ai-background-focus-v479" data-value="standard">Standard</button><button type="button" class="tb432-ai-segment${state.aiBackgroundFocusV479==='enhanced'?' active':''}" data-action="ai-background-focus-v479" data-value="enhanced">Enhanced</button></div>
            </div>
          </div>
          <div class="tb312-ai-steps">
            <div class="tb312-ai-step"><strong>1 · Copy Prompt</strong><small>Copy one prompt and add your visual references.</small></div>
            <div class="tb312-ai-step"><strong>2 · Generate Both</strong><small>AI returns one JSON bundle containing a complete Light version and a complete Dark version.</small></div>
            <div class="tb312-ai-step"><strong>3 · Paste + Apply</strong><small>Paste the bundle once. Choose Light or Dark, preview it, then save. The other version stays attached to this theme.</small></div>
          </div>
          <button type="button" class="tb316-copy-prompt" data-action="copy-ai-prompt">Copy Prompt</button>
          <div class="tb316-ai-paste">
            <div class="tb316-ai-paste-head"><strong>Paste Light + Dark Theme JSON</strong><button type="button" class="tb307-small" data-action="clear-ai-json">Clear Paste</button></div>
            <textarea class="tb312-ai-json" data-ai-json spellcheck="false" placeholder="Paste the dual Light + Dark theme JSON bundle here">${esc(state.aiJsonText || '')}</textarea>
            <div class="tb325-ai-apply-row"><div class="tb312-ai-status" data-ai-status>${esc(aiJsonStatusV325())}</div><button type="button" class="tb325-ai-apply" data-action="apply-ai-theme"${selectedReady?'':' disabled'}>Apply ${state.aiThemeMode==='dark'?'Dark':'Light'} Version</button></div>
          </div>
        </div>` : ''}
      </div>`;
  }

  function syncSimpleControls(root) {
    if (!root) return;
    $$('[data-theme-key]', root).forEach(el => {
      const key = el.dataset.themeKey; if (!key) return;
      const value = state.draft[key];
      if (document.activeElement !== el && el.value !== String(value ?? '')) el.value = String(value ?? '');
    });
    $$('[data-number-key]', root).forEach(el => {
      const key = el.dataset.numberKey; if (!key) return;
      const value = Number(state.draft[key]); if (Number.isFinite(value) && document.activeElement !== el) el.value = String(value);
      const output = $(`[data-output-for="${CSS.escape(key)}"]`, root) || $(`[data-output-for="${CSS.escape(key)}"]`, state.modal);
      if (output) output.textContent = `${Number.isFinite(value) ? value : el.value}${el.dataset.outputSuffix || (key === 'svgGlobalScale' ? '%' : '')}`;
    });
    $$('[data-bool-key]', root).forEach(el => { const key = el.dataset.boolKey; if (key) el.checked = !!state.draft[key]; });
  }

  function renderAllControls() {
    if (!state.modal) return;
    const nameInput = $('[data-theme-key="name"]', state.modal); if (nameInput && document.activeElement !== nameInput) nameInput.value = String(state.draft.name || '');
    renderColors(); renderBackground(); renderAudio(); renderDecorations(); renderTrinkets(); renderAI();
    selectTab($('.tb307-tab.active', state.modal)?.dataset.tab || 'colors', false);
    schedulePreview();
  }

  function selectTab(tab, focus = true) {
    if (!state.modal) return;
    const target = TABS.some(([id]) => id === tab) ? tab : 'colors';
    $$('.tb307-tab', state.modal).forEach(button => button.classList.toggle('active', button.dataset.tab === target));
    $$('.tb307-panel', state.modal).forEach(panel => panel.classList.toggle('active', panel.dataset.panel === target));
    if (focus) $('.tb307-controls', state.modal)?.scrollTo({ top:0, behavior:'instant' });
  }

  function setStatus(message) { const el = $('.tb307-status', state.modal); if (el) el.textContent = String(message || ''); }

  function previewUrl() { return `/theme-studio-host?theme-builder-preview-v307=1&studioUrgentV300=1`; }

  function fitPreviewFrame() {
    const preview = $('.tb307-preview', state.modal), stage = $('.tb307-preview-stage', state.modal), frame = state.previewFrame;
    if (!preview || !stage || !frame) return;
    const availableWidth = Math.max(1, preview.clientWidth);
    const availableHeight = Math.max(1, preview.clientHeight);
    const scale = Math.min(availableWidth / 1280, availableHeight / 760, 1);
    const fittedWidth = Math.max(1, Math.floor(1280 * scale));
    const fittedHeight = Math.max(1, Math.floor(760 * scale));
    stage.style.width = `${fittedWidth}px`;
    stage.style.height = `${fittedHeight}px`;
    frame.style.transform = `scale(${scale})`;
    frame.style.left = '0px';
    frame.style.top = '0px';
  }

  function ensurePreviewFrame() {
    if (!state.modal) return null;
    const frame = $('.tb307-frame', state.modal); if (!frame) return null;
    state.previewFrame = frame;
    if (!frame.getAttribute('src')) {
      state.previewReady = false;
      const loading = $('.tb307-preview-loading', state.modal); if (loading) { loading.hidden = false; loading.textContent = 'Loading actual site preview…'; }
      frame.src = previewUrl();
    }
    fitPreviewFrame();
    return frame;
  }

  // V405 — ONE canonical decoration placement contract for Preview, Log and Dashboard.
  // Save exact percentage coordinates with the theme so no page/runtime is allowed
  // to independently reroll or reinterpret the selected distribution.
  // V410 — the saved placement map is generated by the SAME placement engine
  // used by the real Log page (buildThemePlacementPointsV26 + V245 stable seed).
  // The prior V405 helper reimplemented the legacy mode names with simplified
  // geometry. That was the Dashboard/Log mismatch: e.g. Log `side-random` is
  // normalized to V26 `random-edges-safe`, while V405 put items left/right only.
  function decorationPlacementSeedV410(theme = {}) {
    const text=[theme?.name||'',theme?.svgDistribution||'',...(theme?.backgroundSvgs||[]).map(a=>a?.id||a?.name||a?.projectPath||a?.url||'')].join('|');
    let h=2166136261;
    for(let i=0;i<text.length;i++){h^=text.charCodeAt(i);h=Math.imul(h,16777619)}
    return Math.abs(h>>>0)%100000;
  }
  function computeDecorationPlacementsV405(theme = {}, count = 0) {
    const mode=String(theme?.svgDistribution||'random');
    const slots=Array.isArray(theme?.manualPlacementSlotsV40)?theme.manualPlacementSlotsV40:[];
    if(mode==='manual-fixed'){
      return Array.from({length:count},(_,i)=>{
        const p=slots[i]||{x:50,y:50};
        return{x:Number.isFinite(Number(p.x))?Number(p.x):50,y:Number.isFinite(Number(p.y))?Number(p.y):50};
      });
    }
    try{
      if(typeof buildThemePlacementPointsV26==='function'){
        const points=buildThemePlacementPointsV26(mode,count,{
          seed:decorationPlacementSeedV410(theme),
          allowOverlap:!!theme?.svgAllowOverlap,
          svgGlobalScale:theme?.svgGlobalScale
        });
        if(Array.isArray(points)&&points.length>=count){
          return points.slice(0,count).map(p=>({x:+Number(p?.x??50).toFixed(6),y:+Number(p?.y??50).toFixed(6)}));
        }
      }
    }catch{}
    // Safe fallback only for an unexpectedly unavailable legacy engine. This is
    // deliberately ordinary scatter, never a mode-specific Dashboard algorithm.
    const out=[],seed=decorationPlacementSeedV410(theme);
    const rand=(i,salt)=>{const raw=Math.sin((seed*.913+i*17.171+salt*31.337)*12.9898)*43758.5453123;return raw-Math.floor(raw)};
    for(let i=0;i<count;i++)out.push({x:+(9+rand(i,227)*82).toFixed(6),y:+(15+rand(i,229)*74).toFixed(6)});
    return out;
  }
  function stampDecorationLayoutV405(theme = {}) {
    if (!theme || typeof theme !== 'object') return theme;
    const list = Array.isArray(theme.backgroundSvgs) ? theme.backgroundSvgs : [];
    theme.backgroundSvgs = list.map((asset,index)=>asset&&typeof asset==='object'?{...asset,placementIndexV405:index}:asset);
    theme.resolvedDecorationPlacementsV405 = computeDecorationPlacementsV405(theme, theme.backgroundSvgs.length);
    theme.decorationPlacementEngineV410 = 'log-v26';
    return theme;
  }
  window.__loggyStampDecorationLayoutV405 = stampDecorationLayoutV405;

  function previewDraft() {
    const draft = canonicalThemeDraftV312(state.draft);
    draft.backgroundSvgs = (draft.backgroundSvgs || []).map(item => {
      const copyItem = clone(item); delete copyItem.inheritedBuiltInV307; delete copyItem.inheritedBuiltInV306; delete copyItem.inheritedBuiltInV303; delete copyItem.inheritedBuiltInV109; delete copyItem.inheritedBuiltInV30; return copyItem;
    });
    stampDecorationLayoutV405(draft);

    // V319: Dashboard preview must start from the exact source theme when editing
    // a built-in or source-backed duplicate. The old preview injected the whole
    // Builder draft as a standalone shared theme, so blank/fallback values erased
    // the source Dashboard's native CSS, background and measured colors.
    const sourceThemeId = String(state.kind === 'built-in' ? state.themeId : state.sourceThemeId || '').trim();
    if (sourceThemeId) {
      let dashboardTheme = clone(draft);
      if (state.kind === 'built-in') {
        const keys = new Set([...(state.dashboardOverlayKeys || []), ...(state.touched || [])]);
        const backgroundKeys = [
          'backgroundSourceV311','backgroundModeV158','background','surface','text','accent','border','muted',
          'backgroundGradientV56','backgroundGradientNameV56','backgroundImage','backgroundImageName','backgroundImageProjectPath',
          'interactiveBackgroundCodeV56','dashboardBackgroundV40','dashboardCardV40','dashboardTextV40','dashboardAccentV40'
        ];
        if (backgroundKeys.some(key => keys.has(key))) backgroundKeys.forEach(key => keys.add(key));
        const decorationKeysV326 = ['backgroundSvgs','svgDefaultAnimation','svgDistribution','svgGlobalScale','decorationsOpacityV117','svgAllowOverlap','reduceDecorationOverlapV361','preventDecorationOverlapV367','manualPlacementSlotsV40','resolvedDecorationPlacementsV405','decorationPlacementEngineV410'];
        if (state.decorationsDirty || decorationKeysV326.some(key => keys.has(key))) {
          decorationKeysV326.forEach(key => keys.add(key));
        }
        dashboardTheme = {};
        for (const key of keys) if (Object.prototype.hasOwnProperty.call(draft, key)) dashboardTheme[key] = clone(draft[key]);
      }
      draft.__themeBuilderSourceThemeIdV319 = sourceThemeId;
      draft.__themeBuilderDashboardThemeV319 = dashboardTheme;
    }
    return draft;
  }

  function pushPreview() {
    const frame = ensurePreviewFrame(); if (!frame?.contentWindow || !state.previewReady) return;
    try {
      const requestId = ++state.previewRequestV354;
      state.previewAwaitingV354 = requestId;
      const resetView = state.previewResetViewV354 === true;
      state.previewResetViewV354 = false;
      frame.contentWindow.postMessage({
        type:'loggy-theme-preview-apply-v307',
        draft:previewDraft(),
        resetViewV354: resetView,
        requestIdV354: requestId
      }, location.origin);
      const loading = $('.tb307-preview-loading', state.modal);
      if (loading) { loading.hidden = false; loading.textContent = resetView ? 'Loading selected theme…' : 'Updating preview…'; }
    } catch {}
  }

  function pushDecorationVisibilityPreviewV519(index) {
    const frame = ensurePreviewFrame();
    if (!frame?.contentWindow || !state.previewReady) return;
    try {
      frame.contentWindow.postMessage({
        type:'loggy-theme-preview-decoration-visibility-v519',
        index:Number(index),
        draft:previewDraft()
      }, location.origin);
    } catch {}
  }

  function pushDecorationPreviewV513() {
    const frame = ensurePreviewFrame();
    if (!frame?.contentWindow || !state.previewReady) return;
    try {
      frame.contentWindow.postMessage({
        type:'loggy-theme-preview-decorations-v513',
        draft:previewDraft()
      }, location.origin);
    } catch {}
  }

  function schedulePreview() {
    if (state.previewRaf) cancelAnimationFrame(state.previewRaf);
    state.previewRaf = requestAnimationFrame(() => { state.previewRaf = 0; ensurePreviewFrame(); pushPreview(); });
  }

  window.addEventListener('message', event => {
    if (event.origin !== location.origin || !state.modal || state.modal.hidden) return;
    const frame = state.previewFrame || $('.tb307-frame', state.modal);
    if (!frame || event.source !== frame.contentWindow) return;
    if (event.data?.type === 'loggy-theme-preview-ready-v307' || event.data?.type === 'loggy-dashboard-theme-preview-ready-v307') {
      state.previewReady = true; pushPreview(); return;
    }
    if (event.data?.type === 'loggy-theme-preview-applied-v307' || event.data?.type === 'loggy-dashboard-theme-preview-applied-v307') {
      const requestId = Number(event.data?.requestIdV354) || 0;
      if (requestId && requestId !== state.previewAwaitingV354) return;
      const loading = $('.tb307-preview-loading', state.modal); if (loading) loading.hidden = true;
    }
  });
  window.addEventListener('resize', () => { if (state.modal && !state.modal.hidden) fitPreviewFrame(); });

  function backgroundPrompt() {
    const d = state.draft;
    return `Create one self-contained HTML document for a polished, fun, interactive full-screen BACKGROUND for a theme called "${d.name || 'Custom Theme'}".\n\nTheme palette:\n- page background: ${d.background || '#ffffff'}\n- card/surface: ${d.surface || '#ffffff'}\n- text: ${d.text || '#111111'}\n- muted text: ${d.muted || '#666666'}\n- accent: ${d.accent || '#888888'}\n- border: ${d.border || '#111111'}\n\nIMPORTANT CONTEXT:\nThe app already has separate foreground decoration images/SVGs placed and animated on top. DO NOT recreate, trace, draw, or substitute those decoration images. The background must complement them, not compete with them.\n\nRequirements:\n- Output ONLY the HTML code. No markdown fences and no explanation.\n- It runs inside a sandboxed full-screen iframe BEHIND the app.\n- Use only inline HTML, CSS, SVG/canvas, and JavaScript.\n- No external URLs, libraries, fonts, images, audio, fetches, imports, or network requests.\n- Fill the entire viewport and resize responsively with no scrollbars.\n- Make it visually rich, not one flat color: use layered gradients, soft lighting/glows, subtle texture, abstract patterns, or lightweight canvas effects that match the palette.\n- Add gentle pointer movement/click interaction, but keep motion calm enough that app text above stays readable.\n- Do not add buttons, menus, labels, paragraphs, logos, or app-like UI.\n- Avoid large text and avoid putting all important visuals in the center because app cards may cover it.\n- Prefer lightweight requestAnimationFrame/CSS animation and clean up excessive particles.\n- Match the theme name and palette rather than generating a generic background.`;
  }

  function slugV326(value) {
    return String(value || 'theme').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'').slice(0,52) || 'theme';
  }

  function sanitizeCustomFontV326(raw, themeName) {
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return null;
    let stack=String(raw.stack || '').trim().slice(0,240);
    if (!stack || /[<>{};\n\r]/.test(stack) || /(?:url|@import|expression)\s*\(/i.test(stack)) return null;
    const label=String(raw.label || themeName || 'Custom Font').trim().slice(0,80) || 'Custom Font';
    const supplied=String(raw.id || '').trim();
    const id=/^theme-font-v326-[a-z0-9-]+$/.test(supplied) ? supplied : `theme-font-v326-${slugV326(label)}`;
    return {id,label,stack};
  }

  function registerCustomFontV326(theme, themeName) {
    const font=sanitizeCustomFontV326(theme?.customFontV326, themeName);
    if (!font) return theme;
    let rows=[]; try { rows=JSON.parse(localStorage.getItem(CUSTOM_FONT_REGISTRY_V326)||'[]'); } catch {}
    if (!Array.isArray(rows)) rows=[];
    const index=rows.findIndex(row=>String(row?.id||'')===font.id);
    if (index>=0) rows[index]=font; else rows.push(font);
    try { localStorage.setItem(CUSTOM_FONT_REGISTRY_V326,JSON.stringify(rows.slice(-80))); } catch {}
    try { CUSTOM_THEME_FONT_STACKS[font.id]=font.stack; } catch {}
    theme.customFontV326=font;
    theme.font=font.id;
    return theme;
  }

  function registerCustomAnimationV326(theme, themeName) {
    if (!theme?.customAnimationV159 || typeof theme.customAnimationV159 !== 'object') return theme;
    try {
      const registered=window.__loggyCustomAnimationV159?.register?.(theme,themeName);
      if (registered && typeof registered === 'object') return registered;
    } catch {}
    const raw=theme.customAnimationV159;
    const frames=Array.isArray(raw.keyframes)?raw.keyframes.slice(0,12):[];
    if (frames.length<2) return theme;
    const clampN=(v,min,max,f)=>{v=Number(v);return Number.isFinite(v)?Math.max(min,Math.min(max,v)):f};
    const spec={
      duration:clampN(raw.duration,1.2,40,6.8),
      timing:['linear','ease','ease-in','ease-out','ease-in-out'].includes(String(raw.timing))?String(raw.timing):'ease-in-out',
      direction:['normal','alternate','reverse','alternate-reverse'].includes(String(raw.direction))?String(raw.direction):'alternate',
      keyframes:frames.map((frame,index)=>({
        offset:clampN(frame?.offset,0,1,index/Math.max(1,frames.length-1)),
        x:clampN(frame?.x,-160,160,0),y:clampN(frame?.y,-160,160,0),
        rotate:clampN(frame?.rotate,-180,180,0),scale:clampN(frame?.scale,.45,1.8,1),
        opacity:clampN(frame?.opacity,.15,1,1)
      })).sort((a,b)=>a.offset-b.offset)
    };
    spec.keyframes[0].offset=0; spec.keyframes[spec.keyframes.length-1].offset=1;
    const label=String(themeName||theme.name||'Custom Theme').trim().slice(0,80)||'Custom Theme';
    const id=`theme-motion-v159-${slugV326(label)}`;
    let rows=[];try{rows=JSON.parse(localStorage.getItem(CUSTOM_ANIMATION_REGISTRY_V326)||'[]')}catch{}
    if(!Array.isArray(rows))rows=[];
    const entry={id,label,spec,updatedAt:new Date().toISOString()};
    const at=rows.findIndex(row=>String(row?.id||'')===id); if(at>=0)rows[at]=entry;else rows.push(entry);
    try{localStorage.setItem(CUSTOM_ANIMATION_REGISTRY_V326,JSON.stringify(rows.slice(-120)))}catch{}
    theme.customAnimationV159=spec; theme.customAnimationModeIdV159=id; theme.customAnimationLabelV159=label;
    if(String(theme.svgDefaultAnimation||'')==='theme-custom-animation')theme.svgDefaultAnimation=id;
    if(Array.isArray(theme.backgroundSvgs))theme.backgroundSvgs=theme.backgroundSvgs.map(asset=>{
      const a={...(asset||{})};
      if(String(a.animationOverride||'')==='theme-custom-animation')a.animationOverride=id;
      if(String(a.animation||'')==='theme-custom-animation')a.animation=id;
      return a;
    });
    return theme;
  }

  // V391: AI-generated Dashboard button colors are corrected for readability
  // before they are previewed/saved. Manual color choices remain fully user-controlled.
  function hexRgbV391(value) {
    const hex = String(value || '').trim();
    if (!/^#[0-9a-f]{6}$/i.test(hex)) return null;
    return [parseInt(hex.slice(1,3),16), parseInt(hex.slice(3,5),16), parseInt(hex.slice(5,7),16)];
  }
  function relativeLumV391(value) {
    const rgb = hexRgbV391(value); if (!rgb) return null;
    const c = rgb.map(v => { v /= 255; return v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4; });
    return .2126*c[0] + .7152*c[1] + .0722*c[2];
  }
  function contrastV391(a,b) {
    const x=relativeLumV391(a), y=relativeLumV391(b); if(x==null||y==null)return 1;
    const hi=Math.max(x,y), lo=Math.min(x,y); return (hi+.05)/(lo+.05);
  }
  function readableAgainstV391(bg, requested, candidates = []) {
    const choices=[requested,...candidates,'#111111','#000000','#ffffff','#f7f7f7'].filter(isHex);
    let best=choices[0]||'#111111', score=contrastV391(bg,best);
    for(const color of choices.slice(1)){const next=contrastV391(bg,color);if(next>score){best=color;score=next}}
    return contrastV391(bg,requested)>=4.5 ? requested : best;
  }
  function visibleAgainstV391(bg, requested, fallback) {
    if(isHex(requested) && contrastV391(bg,requested)>=3) return requested;
    return readableAgainstV391(bg, fallback || requested, []);
  }
  function ensureAiDashboardButtonContrastV391(theme) {
    if(!theme||typeof theme!=='object'||Array.isArray(theme))return theme;
    const pageText=safeHex(theme.dashboardTextV40,safeHex(theme.text,'#111111'));
    const surface=safeHex(theme.dashboardCardV40,safeHex(theme.surface,'#ffffff'));
    const hover=safeHex(theme.hoverColor,safeHex(theme.dashboardAccentV40,safeHex(theme.accent,'#eeeeee')));
    const border=safeHex(theme.border,pageText);
    const legacyBg=safeHex(theme.dashboardLogIconBackgroundV107,surface);
    const legacyIcon=safeHex(theme.dashboardLogIconColorV85,pageText);

    const normalize=(prefix, fallbackBg, fallbackHoverBg, fallbackIcon)=>{
      const bgKey=`${prefix}BackgroundV391`, textKey=`${prefix}TextColorV391`, iconKey=`${prefix}IconColorV391`, borderKey=`${prefix}BorderColorV391`;
      const hbgKey=`${prefix}HoverBackgroundV391`, htextKey=`${prefix}HoverTextColorV391`, hiconKey=`${prefix}HoverIconColorV391`, hborderKey=`${prefix}HoverBorderColorV391`;
      const bg=safeHex(theme[bgKey],fallbackBg), hbg=safeHex(theme[hbgKey],fallbackHoverBg);
      theme[bgKey]=bg;
      theme[iconKey]=readableAgainstV391(bg,safeHex(theme[iconKey],fallbackIcon),[pageText,legacyIcon]);
      theme[textKey]=theme[iconKey];
      theme[borderKey]=visibleAgainstV391(bg,safeHex(theme[borderKey],border),theme[iconKey]);
      theme[hbgKey]=hbg;
      theme[htextKey]=readableAgainstV391(hbg,safeHex(theme[htextKey],pageText),[pageText,theme[textKey]]);
      theme[hiconKey]=readableAgainstV391(hbg,safeHex(theme[hiconKey],fallbackIcon),[theme[htextKey],pageText]);
      theme[hborderKey]=visibleAgainstV391(hbg,safeHex(theme[hborderKey],border),theme[htextKey]);
    };
    normalize('dashboardLogButton',legacyBg,hover,legacyIcon);
    normalize('dashboardNewLogButton',legacyBg,hover,legacyIcon);

    // V400: + New Log is not a second design. It is the SAME component style
    // as an ordinary Log circle in both normal AND hover states.
    theme.dashboardNewLogButtonBackgroundV391=theme.dashboardLogButtonBackgroundV391;
    theme.dashboardNewLogButtonIconColorV391=theme.dashboardLogButtonIconColorV391;
    theme.dashboardNewLogButtonTextColorV391=theme.dashboardLogButtonIconColorV391;
    theme.dashboardNewLogButtonBorderColorV391=theme.dashboardLogButtonBorderColorV391;
    theme.dashboardNewLogButtonHoverBackgroundV391=theme.dashboardLogButtonHoverBackgroundV391;
    theme.dashboardNewLogButtonHoverTextColorV391=theme.dashboardLogButtonHoverTextColorV391;
    theme.dashboardNewLogButtonHoverIconColorV391=theme.dashboardLogButtonHoverIconColorV391;
    theme.dashboardNewLogButtonHoverBorderColorV391=theme.dashboardLogButtonHoverBorderColorV391;
    return theme;
  }

  // V397: Dark AI variants may inherit white defaults from blankDraft when a
  // newer modal field is missing. Resolve those defaults to a real dark surface
  // before contrast normalization so every modal shell stays dark in Dark mode.
  function darkSurfaceV397(value, candidates = []) {
    const pool=[value,...candidates].filter(isHex);
    for(const c of pool){ const l=relativeLumV391(c); if(l!=null && l<=.22) return c; }
    const base=hexRgbV391(pool[0]||'#1b1b1b')||[27,27,27];
    let factor=.72, out='#1b1b1b';
    for(let i=0;i<8;i++){
      const rgb=base.map(v=>Math.max(0,Math.min(255,Math.round(v*factor))));
      out='#'+rgb.map(v=>v.toString(16).padStart(2,'0')).join('');
      if(relativeLumV391(out)<=.22) return out;
      factor*=.72;
    }
    return out;
  }

  // V394: generated Settings labels/context-menu colors are also contrast-safe.
  function ensureAiSettingsContrastV394(theme, mode = '') {
    if(!theme||typeof theme!=='object'||Array.isArray(theme))return theme;
    if(mode==='dark'){
      theme.settingsModalBackgroundColorV380=darkSurfaceV397(theme.settingsModalBackgroundColorV380,[theme.surface,theme.dashboardCardV40,theme.dashboardBackgroundV40,theme.background]);
      theme.settingsModalInputBackgroundColorV380=darkSurfaceV397(theme.settingsModalInputBackgroundColorV380,[theme.settingsModalBackgroundColorV380,theme.surface]);
      theme.settingsModalCardBackgroundColorV380=darkSurfaceV397(theme.settingsModalCardBackgroundColorV380,[theme.settingsModalBackgroundColorV380,theme.surface]);
      theme.settingsWidgetBackgroundColorV380=darkSurfaceV397(theme.settingsWidgetBackgroundColorV380,[theme.settingsModalBackgroundColorV380,theme.surface]);
    }
    const modalBg=safeHex(theme.settingsModalBackgroundColorV380,safeHex(theme.surface,'#ffffff'));
    theme.settingsModalTextColorV380=readableAgainstV391(modalBg,safeHex(theme.settingsModalTextColorV380,safeHex(theme.text,'#111111')),[theme.text,'#f7f7f7','#ffffff','#111111']);
    const modalText=theme.settingsModalTextColorV380;
    theme.settingsModalBorderColorV380=visibleAgainstV391(modalBg,safeHex(theme.settingsModalBorderColorV380,safeHex(theme.border,modalText)),modalText);
    const modalBorder=theme.settingsModalBorderColorV380;
    const widgetBg=safeHex(theme.settingsWidgetBackgroundColorV380,modalBg);
    const cardBg=safeHex(theme.settingsModalCardBackgroundColorV380,modalBg);
    theme.settingsModalInputTextColorV380=readableAgainstV391(safeHex(theme.settingsModalInputBackgroundColorV380,modalBg),safeHex(theme.settingsModalInputTextColorV380,modalText),[modalText,'#ffffff','#111111']);
    theme.settingsModalCardTextColorV380=readableAgainstV391(cardBg,safeHex(theme.settingsModalCardTextColorV380,modalText),[modalText,'#ffffff','#111111']);
    theme.settingsWidgetTextColorV380=readableAgainstV391(widgetBg,safeHex(theme.settingsWidgetTextColorV380,modalText),[modalText,'#ffffff','#111111']);
    const hoverBg=safeHex(theme.settingsModalHoverBackgroundColorV380,safeHex(theme.hoverColor,safeHex(theme.accent,cardBg)));
    theme.settingsCursorNameTextColorV394=readableAgainstV391(widgetBg,safeHex(theme.settingsCursorNameTextColorV394,modalText),[modalText,'#111111','#ffffff']);
    theme.settingsCompanionNameTextColorV394=readableAgainstV391(widgetBg,safeHex(theme.settingsCompanionNameTextColorV394,modalText),[modalText,'#111111','#ffffff']);
    theme.settingsThemeNameTextColorV394=readableAgainstV391(cardBg,safeHex(theme.settingsThemeNameTextColorV394,modalText),[modalText,'#111111','#ffffff']);
    theme.settingsThemeNameHoverTextColorV394=readableAgainstV391(hoverBg,safeHex(theme.settingsThemeNameHoverTextColorV394,modalText),[modalText,theme.settingsThemeNameTextColorV394,'#111111','#ffffff']);
    // Right-click menu surface is deliberately identical to the Settings modal surface.
    theme.dashboardContextMenuBackgroundColorV394=modalBg;
    theme.dashboardContextMenuTextColorV394=readableAgainstV391(modalBg,safeHex(theme.dashboardContextMenuTextColorV394,modalText),[modalText,'#111111','#ffffff']);
    theme.dashboardContextMenuBorderColorV394=visibleAgainstV391(modalBg,safeHex(theme.dashboardContextMenuBorderColorV394,modalBorder),theme.dashboardContextMenuTextColorV394);
    theme.dashboardContextMenuHoverBackgroundColorV394=safeHex(theme.dashboardContextMenuHoverBackgroundColorV394,hoverBg);
    theme.dashboardContextMenuHoverTextColorV394=readableAgainstV391(theme.dashboardContextMenuHoverBackgroundColorV394,safeHex(theme.dashboardContextMenuHoverTextColorV394,modalText),[theme.dashboardContextMenuTextColorV394,modalText,'#111111','#ffffff']);
    return theme;
  }

  // V398: Create New Log is a Dashboard sibling of Settings, so its neutral
  // shell/input states deliberately inherit the SAME Settings palette. This removes
  // the old failure mode where a Dark theme had dark Settings but a pale Create Log
  // modal. Interactive hover/selected states still get explicit, contrast-safe colors.
  function ensureAiCreateLogModalContrastV396(theme, mode = '') {
    if(!theme||typeof theme!=='object'||Array.isArray(theme))return theme;

    // Settings normalization runs immediately before this function. Treat those
    // resolved Settings colors as authoritative for the Create New Log neutral states.
    const modalBg=safeHex(theme.settingsModalBackgroundColorV380,safeHex(theme.surface,'#ffffff'));
    const modalText=readableAgainstV391(modalBg,safeHex(theme.settingsModalTextColorV380,safeHex(theme.text,'#111111')),[theme.text,'#111111','#ffffff']);
    const modalBorder=visibleAgainstV391(modalBg,safeHex(theme.settingsModalBorderColorV380,safeHex(theme.border,modalText)),modalText);
    const inputBg=safeHex(theme.settingsModalInputBackgroundColorV380,modalBg);
    const inputText=readableAgainstV391(inputBg,safeHex(theme.settingsModalInputTextColorV380,modalText),[modalText,'#111111','#ffffff']);
    const inputBorder=visibleAgainstV391(inputBg,safeHex(theme.settingsModalInputBorderColorV380,modalBorder),inputText);
    const hoverBg=safeHex(theme.settingsModalHoverBackgroundColorV380,safeHex(theme.hoverColor,safeHex(theme.accent,modalBg)));
    const hoverText=readableAgainstV391(hoverBg,safeHex(theme.settingsModalHoverTextColorV380,modalText),[modalText,'#111111','#ffffff']);
    const selectedBg=safeHex(theme.settingsModalSelectedBackgroundColorV380,safeHex(theme.accent,hoverBg));
    const selectedText=readableAgainstV391(selectedBg,safeHex(theme.settingsModalSelectedTextColorV380,modalText),[modalText,'#111111','#ffffff']);
    const selectedBorder=visibleAgainstV391(selectedBg,safeHex(theme.settingsModalSelectedBorderColorV380,modalBorder),selectedText);
    const settingsButtonBg=safeHex(theme.settingsModalButtonBackgroundColorV380,hoverBg);
    const settingsButtonText=readableAgainstV391(settingsButtonBg,safeHex(theme.settingsModalButtonTextColorV380,modalText),[modalText,'#111111','#ffffff']);
    const settingsButtonBorder=visibleAgainstV391(settingsButtonBg,safeHex(theme.settingsModalButtonBorderColorV380,modalBorder),settingsButtonText);

    theme.dashboardCreateLogOverlayColorV396=safeHex(theme.settingsModalOverlayColorV381,safeHex(theme.dashboardBackgroundV40,safeHex(theme.background,'#000000')));
    theme.dashboardCreateLogModalBackgroundColorV396=modalBg;
    theme.dashboardCreateLogModalTextColorV396=modalText;
    theme.dashboardCreateLogModalBorderColorV396=modalBorder;
    theme.dashboardCreateLogTitleColorV396=modalText;
    theme.dashboardCreateLogLabelColorV396=modalText;

    // Normal inputs match Settings inputs exactly.
    theme.dashboardCreateLogInputBackgroundColorV396=inputBg;
    theme.dashboardCreateLogInputTextColorV396=inputText;
    theme.dashboardCreateLogInputBorderColorV396=modalBorder;
    theme.dashboardCreateLogInputHoverBackgroundColorV396=hoverBg;
    theme.dashboardCreateLogInputHoverTextColorV396=hoverText;
    theme.dashboardCreateLogInputHoverBorderColorV396=visibleAgainstV391(hoverBg,safeHex(theme.settingsModalSelectedBorderColorV380,modalBorder),hoverText);
    theme.dashboardCreateLogInputFocusBackgroundColorV396=inputBg;
    theme.dashboardCreateLogInputFocusTextColorV396=inputText;
    theme.dashboardCreateLogInputFocusBorderColorV396=selectedBorder;

    // Normal icon choices intentionally blend into the modal (border-only appearance).
    theme.dashboardCreateLogIconBackgroundColorV396=modalBg;
    theme.dashboardCreateLogIconColorV396=readableAgainstV391(modalBg,safeHex(theme.settingsModalIconColorV381,modalText),[modalText,'#111111','#ffffff']);
    theme.dashboardCreateLogIconBorderColorV396=visibleAgainstV391(modalBg,modalBorder,theme.dashboardCreateLogIconColorV396);
    theme.dashboardCreateLogIconHoverBackgroundColorV396=hoverBg;
    theme.dashboardCreateLogIconHoverColorV396=hoverText;
    theme.dashboardCreateLogIconHoverBorderColorV396=visibleAgainstV391(hoverBg,selectedBorder,hoverText);
    theme.dashboardCreateLogIconSelectedBackgroundColorV396=selectedBg;
    theme.dashboardCreateLogIconSelectedColorV396=selectedText;
    theme.dashboardCreateLogIconSelectedBorderColorV396=selectedBorder;

    // Create Page is border-only at rest, then uses the Settings button palette on hover.
    theme.dashboardCreateLogButtonBackgroundColorV396=modalBg;
    theme.dashboardCreateLogButtonTextColorV396=readableAgainstV391(modalBg,modalText,[theme.settingsModalIconColorV381,'#111111','#ffffff']);
    theme.dashboardCreateLogButtonIconColorV396=theme.dashboardCreateLogButtonTextColorV396;
    theme.dashboardCreateLogButtonBorderColorV396=visibleAgainstV391(modalBg,modalBorder,theme.dashboardCreateLogButtonTextColorV396);
    theme.dashboardCreateLogButtonHoverBackgroundColorV396=settingsButtonBg;
    theme.dashboardCreateLogButtonHoverTextColorV396=settingsButtonText;
    theme.dashboardCreateLogButtonHoverIconColorV396=settingsButtonText;
    theme.dashboardCreateLogButtonHoverBorderColorV396=settingsButtonBorder;

    // The close X is permanently transparent; only glyph/border colors matter.
    theme.dashboardCreateLogCloseBackgroundColorV396=modalBg;
    theme.dashboardCreateLogCloseHoverBackgroundColorV396=modalBg;
    theme.dashboardCreateLogCloseIconColorV396=modalText;
    theme.dashboardCreateLogCloseHoverIconColorV396=modalText;
    theme.dashboardCreateLogCloseBorderColorV396=modalBorder;
    theme.dashboardCreateLogCloseHoverBorderColorV396=modalBorder;
    return theme;
  }

  function aiThemePrompt() {
    const d = canonicalThemeDraftV312(state.draft);
    const colorFields = colorKeys().map(key => `- ${key}: ${d[key]}`).join('\n');
    const animations=registeredAnimationsV326().map(([id,label])=>`- ${id}: ${label}`).join('\n');
    const fonts=fontChoicesV326().map(([id,label])=>`- ${id}: ${label}`).join('\n');
    const advancedV432 = state.aiBuilderDepthV432 === 'advanced';
    const enhancedBackgroundV479 = state.aiBackgroundFocusV479 === 'enhanced';
    const modeRulesV432 = advancedV432 ? `AI BUILDER MODE — ADVANCED:
- Advanced is the expressive UI mode. Build a coherent material/style language across the existing Loggy interface while preserving layout, readability, and usability.
- Set advancedUiEnabledV432:true in BOTH variants.
- REQUIRED advanced UI fields in BOTH variants: advancedBorderStyleV432, advancedInputBorderStyleV432, advancedButtonBorderStyleV432 = solid | dashed | dotted | double; advancedBorderWidthV432 = 1–4; advancedInputRadiusV432 / advancedCardRadiusV432 / advancedButtonRadiusV432 = 0–28.
- Style Log-page inputs/search boxes, cards, content boxes, buttons, modal surfaces, and category chips so they share a reference-supported material language. Examples include scrapbook/cut-paper edges, terminal/tech linework, lab/HUD framing, stitched stationery, glossy plastic, index-card edges, or another treatment genuinely supported by the references.
- Be materially creative when the references support it: backgrounds and surfaces may feel like felt, handmade paper, watercolor paper, cardstock, cork, linen, canvas, soft fabric, recycled paper, newsprint, frosted plastic, brushed metal, glass, or other tactile media. Build these looks with lightweight gradients/patterns/inline SVG/CSS texture rather than external assets.
- IMPORTANT: advancedBorderStyleV432 / advancedInputBorderStyleV432 / advancedButtonBorderStyleV432 and the advanced radius fields are LOG-PAGE-ONLY controls. Do not use them to reshape Dashboard controls. Dashboard Log-page tiles and the New Log tile must remain perfect circles.
- Use the normal color/radius/shadow/font system together with the advanced fields. Do not redesign page layout or make controls harder to use.
- IMPORTANT: Advanced does NOT automatically mean a complex background. Follow the separate BACKGROUND FOCUS setting below.` : `AI BUILDER MODE — BASIC:
- Basic creates a polished, coordinated theme using Loggy’s normal Theme Builder controls without materially redesigning component construction.
- Build a complete palette and state system: page/background colors, surfaces, text, borders, hover/selected states, Dashboard controls, modal colors, typography, normal radius, and normal shadow.
- Keep cards, inputs, buttons, search boxes, and modal surfaces structurally familiar to Loggy; visual identity should come from the references through color, type, normal radii/shadows, background treatment, and any reference-supported decorative accents.
- Set advancedUiEnabledV432:false in BOTH variants.
- Do not depend on advanced border/radius fields for the design.
- IMPORTANT: Basic can still have an Enhanced background when BACKGROUND FOCUS says so; Standard Basic is the restrained behavior used before this option existed.`;
    const backgroundRulesV479 = enhancedBackgroundV479 ? `BACKGROUND FOCUS — ENHANCED:
- Spend extra design effort on the PAGE BACKGROUND / ambient scene in BOTH variants.
- Make the background visibly reference-specific instead of a generic gradient: use layered tonal depth, broad ambient shapes, texture/pattern language, light/shadow structure, atmospheric motifs, grid/scanline/paper/water/glass/sky/etc. cues when supported by the references.
- TACTILE MATERIALS ARE ENCOURAGED when they fit the references: felt/fuzzy fibers, handmade or torn paper, parchment, scrapbook cardstock, linen/canvas weave, cork, watercolor wash, fabric, grainy print/newsprint, frosted glass, brushed metal, or similarly tactile surfaces. Make the texture visible enough to give character without hurting legibility.
- In Basic mode, keep the implementation within normal safe theme background controls whenever possible: a richer backgroundGradientV56 and coordinated backdrop colors can do most of the work. interactiveBackgroundCodeV56 is allowed only when the reference identity genuinely needs motion/ambient behavior and it remains lightweight.
- In Advanced mode, a richer self-contained interactiveBackgroundCodeV56 scene is encouraged when supported by the references: subtle CSS/SVG/canvas motion, pointer-reactive ambience, scan sweeps, drifting marks, particles, light sweeps, or other reference-specific effects.
- Keep every background effect behind the UI, pointer-safe, performant, readable, and respectful of prefers-reduced-motion.` : `BACKGROUND FOCUS — STANDARD:
- Keep the background polished, reference-derived, and supportive rather than making it the main visual event.
- Use a strong solid/gradient background and coordinated backdrop colors, but avoid unnecessary ambient layers or interactive scenes.
- A Standard background does NOT have to look flat. It may use subtle tactile material texture such as paper grain, felt fibers, linen weave, cardstock speckle, soft watercolor mottling, cork-like flecks, or another reference-supported surface, as long as it stays lightweight and readable.
- In Basic mode this is the original restrained Basic behavior.
- In Advanced mode, the UI materials may still be expressive, but the background itself should remain comparatively simple.
- Do not create interactiveBackgroundCodeV56 unless the references clearly require it.`;
    return `Create ONE complete Loggy AI theme bundle inspired by the visual references I provide. The bundle MUST contain TWO coordinated, fully usable versions of the SAME theme: one LIGHT and one DARK.

${modeRulesV432}

${backgroundRulesV479}

VISUAL ACCENTS:
- If the references genuinely support small decorative accents, you may include a restrained coordinated set. This is automatic, not a separate user-selected mode.
- Background Focus controls how much visual effort goes into the page background itself.
- Keep Light and Dark variants coordinated in accent identity and placement behavior.

DUAL-VERSION REQUIREMENT — MANDATORY:
- Generate BOTH versions in the same response. Do not ask me to choose Light or Dark first.
- The Light and Dark versions must clearly be the same design identity: same theme name, mood, visual era, materials, overall accent family, layout philosophy, decoration distribution, and motion personality.
- Adapt backgrounds, surfaces, text, borders, hover/selected states, dashboard colors, Settings-modal colors, widget colors, and cursor colors so each version has intentional contrast. Every settingsModal*V380 and settingsWidget*V380 color field must be present in BOTH variants.
- LIGHT must be genuinely light, but LIGHT DOES NOT MEAN PURE WHITE. Do NOT reflexively use #FFFFFF or a nearly-white page just because this is the Light variant. Derive the Light background family from the actual references first. It may use cream, parchment, oat, sand, butter, blush, peach, dusty rose, pale sage, soft mint, powder blue, sky, light teal, warm beige, pale gray, tinted neutrals, or other reference-supported light colors and gradients.
- Give the Light variant a designed atmosphere, not a blank canvas. When supported by the references, use tinted surfaces, layered light neutrals, soft gradients, gentle tonal contrast, subtle texture, and restrained decorative patterning so the Light version feels intentional and visually rich rather than sterile white with one accent color.
- DARK must be genuinely dark. Use a true dark page/background system such as charcoal, graphite, ink-black, midnight navy, blackened teal, forest-black, espresso, dark brown, oxblood, slate, or a dark reference-derived gradient with readable light text. Dark cards on a light page do NOT count. EVERY modal shell in the Dark variant must also be dark, especially settingsModalBackgroundColorV380 and dashboardCreateLogModalBackgroundColorV396. Never put a white/cream/light modal on the Dark variant.
- Both versions must be COMPLETE Theme Builder configurations, not partial palettes.

PALETTE SELECTION + DARK-VARIANT COLOR DIVERSITY — CRITICAL:
- Derive the hue family from the ACTUAL visual references before choosing theme colors. Internally identify the references' dominant neutrals, dominant chromatic colors, secondary colors, and small accent colors by visual weight.
- PURPLE HAS NO SPECIAL PRIORITY. Do NOT default the Dark variant to purple, violet, lavender, lilac, mauve, magenta, or plum just because the requested theme is dark, moody, dreamy, feminine, vintage, magical, or aesthetic.
- Use a purple-family Dark palette ONLY when purple/violet/plum is genuinely a dominant or clearly important recurring color in the references. A tiny purple object, shadow, flower, glow, or isolated accent is NOT enough reason to make the whole Dark theme purple.
- If the references contain stronger non-purple colors, prefer those. Examples: blue/cyan references can become midnight navy or ink blue; green references can become forest/olive/blackened teal; warm beige/gold references can become espresso/umber/bronze-black; red/pink references can become oxblood/burgundy/blackened rose; orange/rust references can become burnt umber/rust-black; mostly monochrome references should become graphite/charcoal/ink rather than invented purple.
- If several color families are present, choose the one with the strongest visual presence or the one that best supports the foreground subjects. Do not automatically choose the most stereotypically 'dark-theme' hue.
- If the references do not contain a clear chromatic direction, default to a NEUTRAL dark base such as charcoal, graphite, black, espresso, or slate with a restrained reference-derived accent. Do NOT invent purple as the fallback.
- Keep Light and Dark recognizably the same identity by carrying the SAME reference-derived accent family across variants whenever practical. Change value/saturation for contrast rather than arbitrarily changing the Dark hue family to purple.
- Before outputting JSON, explicitly sanity-check internally: "Would I still have chosen this purple family if purple were removed from my generic idea of a dark aesthetic?" If the answer is no, choose a reference-supported non-purple palette instead.

PERSISTENT SWITCHING:
Loggy stores both variants under one theme. I can apply Light now, save the theme, reopen it later, switch to Dark, preview it, and save again without regenerating the AI theme. Therefore each variant must be independently complete.

VISUAL REFERENCE RULES:
- Analyze all references together for palette, mood, softness, era, contrast, materials, lighting and atmosphere. Color choice must be evidence-led: weight colors by how much of the references they actually occupy and how often they recur, not by generic aesthetic associations.
- For the LIGHT variant specifically, identify at least one light reference-derived base family before choosing the page background. Pure white is only appropriate when the references themselves strongly support a crisp white/minimal look. Otherwise prefer a tinted light base that belongs to the reference palette.
- When references contain multiple colors, do not collapse them into purple unless purple is truly one of the strongest recurring families. Preserve distinctive non-purple identity when the references support blue, green, teal, brown, gold, red, rust, pink, orange, monochrome, or another family.
- Make the background/UI help my foreground references and decorations pop instead of competing with them.
- References are inspiration only. Do not embed, trace, redraw, or recreate their main subjects as SVGs.
- Background pattern language is separate from foreground decorations and is still allowed when appropriate: sparse dots, tiny stars, checker accents, scallop bands, soft stripes, small floral marks, paper grain, stitched/doodle marks, wave lines, scanlines, grids, formulas, or other lightweight reference-supported motifs that stay behind the UI.
- Treat BACKGROUND MATERIAL as a first-class design choice, not only color. When appropriate, deliberately choose a tactile surface (for example felt, textured paper, fibrous stationery, canvas/linen, cork, watercolor stock, or printed grain) and carry that material identity coherently through Light and Dark variants. Do not default every theme to a smooth digital gradient.
- Do NOT add visual noise just to make a theme busy. Every pattern, scene element, or decoration must support the shared Light/Dark identity and preserve readability.

NAME — REQUIRED:
- Invent ONE short polished theme name.
- Use the EXACT SAME theme name in the outer bundle name, variants.light.name, variants.dark.name, and both customCursorLabelV161 values.

SUPPORTED COLOR FIELDS — EVERY FIELD REQUIRED IN BOTH VARIANTS AS #RRGGBB:
${colorFields}

BACKGROUND + PAGE BACKDROPS — CHOOSE INTENTIONALLY IN BOTH:
- backgroundSourceV311: theme-color | gradient | image | custom-code
- backgroundModeV158: solid | gradient | image
- backgroundGradientNameV56 / backgroundGradientV56
- backgroundImage: empty unless I explicitly supplied a usable image file/path
- interactiveBackgroundCodeV56 may contain one self-contained inline HTML/CSS/canvas/SVG/JS background. No external URLs, fetches, imports, fonts, images, audio, or libraries.
- V432 Advanced UI fields: advancedUiEnabledV432, advancedBorderStyleV432, advancedInputBorderStyleV432, advancedButtonBorderStyleV432, advancedBorderWidthV432, advancedInputRadiusV432, advancedCardRadiusV432, advancedButtonRadiusV432. Follow AI BUILDER MODE and BACKGROUND FOCUS exactly.
- pageBackdropsEnabledV312: true | false. THIS CONTROLS LOG-PAGE BACKDROPS ONLY. It must NEVER create a Dashboard backdrop.
- pageBackdropColorV452 / pageBackdropOpacityV452 define ONE shared Log-page backdrop style.
- dailyLogBackgroundEnabled and contentBackdropEnabled independently choose where that shared backdrop appears. Never create a Dashboard backdrop.
- quizBackdropEnabledV456: true | false. When true, the quiz CONTENT BOX/CARD uses quizBackdropColorV456 / quizBackdropOpacityV456 / quizBackdropRadiusV456 / quizBackdropPaddingV459. Never apply these values to the QUIZZES/QUIZ page title or the whole quiz page; titles follow Heading Backdrop.
- quizBackdropColorV456: #RRGGBB. quizBackdropOpacityV456: 0–100. quizBackdropRadiusV456: 0–40. quizBackdropPaddingV459: 0–40.
- headingBackgroundEnabledV429 MUST be false in AI output. The user may manually turn Heading Backdrop on later; AI must NEVER auto-enable it.
- headingBackgroundColorV452 / headingBackgroundOpacityV452 define the Heading Backdrop independently from Page Backdrops.
- headingBackgroundPaddingV429: 0–40. Pick a sensible padding value (normally 6–14) in BOTH variants even though headingBackgroundEnabledV429 stays false.
- headingBackgroundRadiusV452: 0–40. Pick intentional heading-background roundness in BOTH variants.
- settingsModalBackgroundColorV380 / settingsModalTextColorV380 / settingsModalBorderColorV380
- settingsModalOverlayColorV381 / settingsModalSectionBorderColorV381 / settingsModalMutedTextColorV381 / settingsModalIconColorV381
- settingsModalInputBackgroundColorV380 / settingsModalInputTextColorV380 / settingsModalInputBorderColorV380
- settingsModalCardBackgroundColorV380 / settingsModalCardTextColorV380 / settingsModalCardBorderColorV380
- settingsModalHoverBackgroundColorV380 / settingsModalHoverTextColorV380
- settingsModalSelectedBackgroundColorV380 / settingsModalSelectedTextColorV380 / settingsModalSelectedBorderColorV380
- settingsModalButtonBackgroundColorV380 / settingsModalButtonTextColorV380 / settingsModalButtonBorderColorV380
- settingsWidgetBackgroundColorV380 / settingsWidgetTextColorV380 / settingsWidgetBorderColorV380
- If a backdrop is enabled, give it a visibly useful opacity rather than 0.

SETTINGS LABELS + DASHBOARD RIGHT-CLICK MENUS — CONTRAST REQUIRED:
- settingsCursorNameTextColorV394 must be clearly readable against settingsWidgetBackgroundColorV380.
- settingsCompanionNameTextColorV394 must be clearly readable against settingsWidgetBackgroundColorV380.
- settingsThemeNameTextColorV394 must be clearly readable against settingsModalCardBackgroundColorV380.
- settingsThemeNameHoverTextColorV394 must be clearly readable against settingsModalHoverBackgroundColorV380. Do NOT blindly switch theme names to white on hover. Choose from the actual hover/title background.
- dashboardContextMenuBackgroundColorV394 MUST equal settingsModalBackgroundColorV380 exactly. Dashboard right-click menus intentionally share the Settings modal surface.
- dashboardContextMenuTextColorV394 must strongly contrast with dashboardContextMenuBackgroundColorV394.
- dashboardContextMenuBorderColorV394 must remain visible against dashboardContextMenuBackgroundColorV394.
- dashboardContextMenuHoverTextColorV394 must strongly contrast with dashboardContextMenuHoverBackgroundColorV394.
- The Trash card/button inside Settings is ALWAYS transparent/border-only. Do not try to give Trash a fill color; its text/icon use the Settings modal text color for contrast.
- The Settings modal close X is ALSO ALWAYS transparent in normal/hover/focus/active states. It may have a border, or no visible border. Its X glyph MUST use settingsModalTextColorV380. Never give the Settings X a filled background.
- Target at least 4.5:1 contrast for names/menu text and 3:1 for borders/icons in BOTH Light and Dark.

SHAPE & TYPE — ALWAYS ACTIVE:
- radius: 0–30, normally 20 unless references suggest otherwise.
- shadow: 0–12, normally subtle or 0.
- Prefer the SAME font ID in Light and Dark so they feel like the same theme. Existing font IDs:
${fonts}
- If no existing font fits, both variants may use the SAME safe local/system custom font stack:
  "font":"theme-custom-font",
  "customFontV326":{"label":"Theme Font Name","stack":"Georgia, 'Times New Roman', serif"}
- No font URLs, @font-face, @import, downloaded fonts, CSS declarations, semicolons, or code.

AUDIO — SAME CONTENT/BEHAVIOR IN BOTH UNLESS CONTRAST DOES NOT APPLY:
- introAudio / introAudioName / introAudioProjectPath: empty unless I explicitly provide audio.
- audioPlayMode: full | segment
- audioStart / audioEnd
- audioFade: true by default
- audioVolume: 0–100
- svgHoverSoundsEnabled / svgHoverSoundMode: random | mapped
- svgHoverSounds: [] unless I explicitly provide hover audio
- svgHoverSoundStopModeV87 / svgHoverSoundStopDelayV87

DECORATION MOTION + LAYOUT:
- Use the SAME distribution, scale, overlap settings, animation choice, and exact decoration set in both variants. Loggy treats uploaded/edited decorations as shared theme assets, so Light/Dark switching must never make them disappear.
- Non-color behavior overrides are shared across variants. If the user turns a toggle such as Page Backdrops off in one appearance, switching appearances must keep that toggle off. Keep corresponding boolean/number/select behavior settings aligned unless a color field is explicitly appearance-specific.
- svgDistribution: ${DISTRIBUTIONS.map(([id])=>id).join(', ')}
- svgGlobalScale: 50–220
- decorationsOpacityV117: 0–100
- svgAllowOverlap: true | false
- reduceDecorationOverlapV361: true | false
- preventDecorationOverlapV367: true | false
- Existing default animations:
${animations}
- If one fits, set svgDefaultAnimation to its exact ID in BOTH variants.
- IMPORTANT DEFAULT-ANIMATION RULE: backgroundSvgs MUST NOT contain animationOverride unless the user explicitly set a per-decoration override in the editor. AI-generated decorations should inherit svgDefaultAnimation. If svgDefaultAnimation is cross-screen, EVERY visible decoration inherits Across Screen by default.
- STRICT OVERLAP + ACROSS SCREEN RULE: preventDecorationOverlapV367 must NEVER suppress or hide a decoration whose effective animation is cross-screen. Moving decorations do not occupy a static X position, so static collision suppression does not apply to them and they must not suppress stationary decorations either.
- Only if none fits, create ONE gentle reusable custom animation and use the SAME spec in both variants:
  "svgDefaultAnimation":"theme-custom-animation",
  "customAnimationV159":{"duration":6.8,"timing":"ease-in-out","direction":"alternate","keyframes":[{"offset":0,"x":0,"y":4,"rotate":-2,"scale":1,"opacity":1},{"offset":0.5,"x":8,"y":-8,"rotate":2,"scale":1.02,"opacity":1},{"offset":1,"x":0,"y":4,"rotate":-2,"scale":1,"opacity":1}]}
- backgroundSvgs may contain 0–6 safe static original accents when the references genuinely support them. Keep them secondary to the UI and background. No scripts, foreignObject, event handlers, external href/src/url(), imports, or network references.
- introSvgBounceEnabled / introSvgBopMode: some | all
- introMusicReactionsEnabledV154
- svgHoverAnimationsEnabledV82
- svgHoverAnimationV82: ${HOVER_ANIMATIONS.map(([id])=>id).join(', ')}

CREATE NEW LOG MODAL — SETTINGS-PARITY COLOR SYSTEM:
- Fill every V396 Create New Log color field that appears in the REQUIRED COLOR FIELD list in BOTH Light and Dark variants. Categories already have their V321 controls; do not replace those. The two legacy close-background fields are intentionally hidden/ignored because the X is always transparent.
- CRITICAL PARITY RULE: Create New Log is styled from the SAME neutral palette as the Settings modal. In EACH variant set dashboardCreateLogModalBackgroundColorV396 EXACTLY equal to settingsModalBackgroundColorV380, dashboardCreateLogModalTextColorV396 EXACTLY equal to settingsModalTextColorV380, and dashboardCreateLogModalBorderColorV396 EXACTLY equal to settingsModalBorderColorV380. Do not invent a separate pale Create Log shell. If Dark Settings is dark, Create New Log MUST be that same dark surface.
- RUNTIME PARITY NOTE: those Create Log shell fields are aliases of Settings, not an independent shell palette. The real Dashboard uses the resolved Settings modal background/text/border for Create New Log. In a Dark variant, if Settings is #12110F then Create New Log is #12110F too. Never output a conflicting shell color.
- Title/labels: dashboardCreateLogTitleColorV396 and dashboardCreateLogLabelColorV396 should equal settingsModalTextColorV380 so Create New Log text can never disappear into its modal background.
- Normal Create Log Log Name and Icon Search fields MUST use the same background and text palette. Their normal border MUST equal dashboardCreateLogModalBorderColorV396 (the same border used by the icon container), not a separate input-border color. Specifically: dashboardCreateLogInputBackgroundColorV396 = settingsModalInputBackgroundColorV380, dashboardCreateLogInputTextColorV396 = settingsModalInputTextColorV380, dashboardCreateLogInputBorderColorV396 = dashboardCreateLogModalBorderColorV396.
- V426 SINGLE TEXT-COLOR RULE — CRITICAL: inside Create New Log, the visible text color used for the Icon Search field (including the "Search icons…" placeholder) is the ONE shared text color for BOTH fields. The Log Name placeholder (for example "e.g. Skateboarding, Baking, Civics...") AND the text the user types into Log Name MUST use EXACTLY the same color as "Search icons…". Do NOT invent a muted, secondary, gray, translucent, or separate placeholder color for Log Name. Use dashboardCreateLogInputTextColorV396 as this single normal-state color. The browser runtime deliberately applies that same color to #new-log-name, #new-log-name::placeholder, the Icon Search input, and the Icon Search placeholder.
- The same parity applies to interaction states: dashboardCreateLogInputHoverTextColorV396 is shared by Log Name and Icon Search while hovered; dashboardCreateLogInputFocusTextColorV396 is shared by both while focused. Never make the two fields use different text-color families.
- V428 AUXILIARY DASHBOARD MODALS: the Add Custom SVG Icon modal, Move This Log to Trash confirmation, Trash manager, and Add/Rename Category text modal intentionally inherit the SAME Settings modal palette. Their shell background/text/border use settingsModalBackgroundColorV380 / settingsModalTextColorV380 / settingsModalBorderColorV380; fields use settingsModalInput*V380; action buttons use settingsModalButton*V380 and hover states use settingsModalHover*V380. Existing themes automatically inherit this styling, so never assume these modals are default white/black.
- V428 CUSTOM ICON + BUTTON PARITY: the plus button beside "Search icons…" uses the SAME normal field background/text/border as the Icon Search box, including the theme's border/radius language. Its hover/focus state may use the Settings hover palette but must remain clearly part of that same field family.
- Modal shell: dashboardCreateLogOverlayColorV396 / dashboardCreateLogModalBackgroundColorV396 / dashboardCreateLogModalTextColorV396 / dashboardCreateLogModalBorderColorV396 / dashboardCreateLogTitleColorV396 / dashboardCreateLogLabelColorV396.
- Inputs + icon search: dashboardCreateLogInputBackgroundColorV396 / dashboardCreateLogInputTextColorV396 / dashboardCreateLogInputBorderColorV396 / dashboardCreateLogInputHoverBackgroundColorV396 / dashboardCreateLogInputHoverTextColorV396 / dashboardCreateLogInputHoverBorderColorV396 / dashboardCreateLogInputFocusBackgroundColorV396 / dashboardCreateLogInputFocusTextColorV396 / dashboardCreateLogInputFocusBorderColorV396.
- Do not give Log Name and Icon Search different normal colors. Their normal background/text/border must render identically from first paint. V401 rule: Log Name autofocus MUST NOT change its border color either; Log Name, Icon Search, and the icon grid use one continuous border color with no focus/opening flash.
- Icon choices: dashboardCreateLogIconBackgroundColorV396 / dashboardCreateLogIconColorV396 / dashboardCreateLogIconBorderColorV396 / dashboardCreateLogIconHoverBackgroundColorV396 / dashboardCreateLogIconHoverColorV396 / dashboardCreateLogIconHoverBorderColorV396 / dashboardCreateLogIconSelectedBackgroundColorV396 / dashboardCreateLogIconSelectedColorV396 / dashboardCreateLogIconSelectedBorderColorV396.
- Create Page button: dashboardCreateLogButtonBackgroundColorV396 / dashboardCreateLogButtonTextColorV396 / dashboardCreateLogButtonIconColorV396 / dashboardCreateLogButtonBorderColorV396 / dashboardCreateLogButtonHoverBackgroundColorV396 / dashboardCreateLogButtonHoverTextColorV396 / dashboardCreateLogButtonHoverIconColorV396 / dashboardCreateLogButtonHoverBorderColorV396.
- Close X: only dashboardCreateLogCloseIconColorV396 / dashboardCreateLogCloseBorderColorV396 / dashboardCreateLogCloseHoverIconColorV396 / dashboardCreateLogCloseHoverBorderColorV396 are visually meaningful. The close X background is ALWAYS transparent in normal AND hover/focus states. Never design a filled close-X box.
- NORMAL-STATE DESIGN RULE FOR AI: dashboardCreateLogIconBackgroundColorV396 and dashboardCreateLogButtonBackgroundColorV396 MUST equal dashboardCreateLogModalBackgroundColorV396. This intentionally makes normal controls look border-only/no-fill. Hover and selected states may use a visible filled surface.
- HOVER/SELECTED PARITY: use Settings hover/selected/button colors as the first-choice palette for Create Log hover/selected states. This keeps both modals visually coordinated instead of creating a second unrelated UI palette.
- DARK VARIANT MODAL RULE: dashboardCreateLogModalBackgroundColorV396 MUST equal the already-dark settingsModalBackgroundColorV380. Normal Create Log inputs must use the dark Settings input surface. NEVER use white, cream, pale beige, pale gray, or any light neutral for the Create New Log shell in the Dark variant. The Create New Log title/text MUST strongly contrast with that dark surface.
- Icon SELECTED must be visually distinct from both normal and hover. Use a clear selected surface and readable icon color.
- Create Page normal text/icon must strongly contrast with the modal-colored normal button surface; hover text/icon must strongly contrast with the hover surface.
- Inputs must remain readable in normal, hover, and focus states. Borders must stay visible. Target 4.5:1 for text and 3:1 for icons/borders.

DASHBOARD:
- Dashboard and Log pages must feel like the SAME theme in each variant.
- The regular Log buttons and the + New Log button have EXPLICIT color systems. Fill ALL of these in BOTH variants:
  dashboardLogButtonBackgroundV391 / dashboardLogButtonTextColorV391 / dashboardLogButtonIconColorV391 / dashboardLogButtonBorderColorV391
  dashboardLogButtonHoverBackgroundV391 / dashboardLogButtonHoverTextColorV391 / dashboardLogButtonHoverIconColorV391 / dashboardLogButtonHoverBorderColorV391
  dashboardNewLogButtonBackgroundV391 / dashboardNewLogButtonTextColorV391 / dashboardNewLogButtonIconColorV391 / dashboardNewLogButtonBorderColorV391
  dashboardNewLogButtonHoverBackgroundV391 / dashboardNewLogButtonHoverTextColorV391 / dashboardNewLogButtonHoverIconColorV391 / dashboardNewLogButtonHoverBorderColorV391
- NORMAL-STATE LINK RULE: dashboardLogButtonTextColorV391 MUST equal dashboardLogButtonIconColorV391 exactly, and dashboardNewLogButtonTextColorV391 MUST equal dashboardNewLogButtonIconColorV391 exactly. Loggy intentionally uses the icon color for the normal-state label so the circle text can never disappear while its icon remains readable.
- V400 HARD FULL PARITY: + New Log MUST be visually identical to a normal Log-page circle in BOTH normal AND hover states. Set all 8 dashboardNewLogButton*V391 values exactly equal to their dashboardLogButton*V391 counterparts. Do not invent a separate + New Log palette for any state.
- V402 LIVE-VARIABLE GUARANTEE: the real Dashboard does NOT cache or independently render + New Log colors. + New Log reads the exact same live dashboardLogButton*V391 CSS variables as normal Log circles in both normal and hover states. dashboardNewLogButton*V391 fields are compatibility aliases only and MUST remain exact copies of the matching dashboardLogButton*V391 fields.
- CONTRAST IS MANDATORY: choose the NORMAL icon/text color to be clearly readable against its exact button background, and choose readable HOVER text/icons against the hover background. Target at least WCAG 4.5:1 for label text and 3:1 for icons/borders.
- Never choose text/icon colors that are the same as or visually close to the button background. A pale/light button normally needs dark text/icons; a deep/dark button normally needs light text/icons. Decide from the ACTUAL background color, not simply from whether the whole theme is Light or Dark.
- Design and contrast-check the regular Log button first. Then COPY its exact normal and hover background/text/icon/border values to + New Log. + New Log must never be independently styled or independently contrast-corrected.
- Dashboard log-tile icons should normally be black, white, or a selected-category/accent color with strong contrast.
- Do not add or style a visible Dashboard Settings button; Dashboard Settings is accessed from the context menu.

TRINKETS — CUSTOM CURSOR REQUIRED IN BOTH:
- useThemeCursor: true
- themeCursorTrailEnabledV161: true
- customCursorLabelV161: EXACT shared theme name
- customCursorV161 MUST use this safe shape:
  {"primary":"#RRGGBB","secondary":"#RRGGBB","accent":"#RRGGBB","motif":"sparkle","trail":"sparkle"}
- motif: sparkle | heart | flower | leaf | wave | gem | moon | sun | bow | butterfly | star | ribbon | music | berry | cloud
- trail: sparkle | heart | petal | leaf | bubble | star | gem | music | dot | moon | wave
- Prefer the SAME motif/trail in both variants, but adjust cursor colors for visibility on each background.
- Do NOT invent themeCursorStyle/customCursorModeIdV161; Loggy creates those.
- useThemeCompanion: true | false
- themeCompanion: existing Loggy companion ID only, otherwise none. Prefer the same companion choice in both.

OUTPUT RULES — CRITICAL:
1. Return ONLY one valid raw JSON object. No markdown fence, explanation, comments, or trailing commas.
2. Use EXACTLY this outer structure:
{"format":"loggy-theme-bundle","version":3,"name":"Theme Name","variants":{"light":{...COMPLETE LIGHT THEME...},"dark":{...COMPLETE DARK THEME...}}}
3. BOTH variants are mandatory and must be objects.
4. Every required color field above must appear in BOTH variants.
5. outer name, variants.light.name, variants.dark.name, and both customCursorLabelV161 values must match exactly.
6. No external URLs.
7. Media fields that require real uploaded files must use safe empty values instead of invented paths.
8. Include customCursorV161 in BOTH variants.
9. If you create customFontV326 or customAnimationV159, follow the safe schemas exactly and keep them coordinated across variants.
10. Before answering, verify internally that Light is truly light WITHOUT reflexively defaulting to pure white, Dark is truly dark, both have strong readable contrast, and the JSON parses. Verify that the Light background/surface family is visibly derived from the references and feels intentionally designed; if it is plain white, confirm the references actually justify white. Also verify that the Dark hue family is supported by the supplied references and is not a reflexive purple/violet/plum choice. Follow AI BUILDER MODE and BACKGROUND FOCUS independently and exactly.
11. NEVER escape JSON colons or SVG angle brackets. Do not output \:, \<, or \>.
12. NEVER use Markdown link syntax anywhere inside JSON. In SVG, xmlns must remain the literal URL http://www.w3.org/2000/svg, never [http://...](http://...).
13. Every backgroundSvgs item must be one COMPLETE SVG string ending in </svg>, with all double quotes correctly JSON-escaped.

I will paste this ONE raw bundle into Loggy. Loggy will store both variants together, let me switch between Light and Dark anytime, preview either version, and save whichever version I currently want active.`;
  }

  async function copyText(text, successMessage) {
    try { await navigator.clipboard.writeText(text); toast(successMessage); return; } catch {}
    const area = document.createElement('textarea'); area.value = text; area.style.position='fixed'; area.style.opacity='0'; document.body.appendChild(area); area.select();
    try { document.execCommand('copy'); toast(successMessage); } catch {} area.remove();
  }


  // V390: AI chat/copy surfaces sometimes mutate otherwise-correct theme JSON:
  //   "key"\:true, \<svg..., and xmlns URLs converted to Markdown links.
  // Strict JSON stays untouched. Only after strict parsing fails do we repair
  // these known copy artifacts, including malformed backgroundSvgs strings.
  function repairAiMarkdownUrlV390(value) {
    return String(value || '').replace(/\[(https?:\/\/[^\]\s]+)\]\((https?:\/\/[^)\s]+)\)/g, (match, label, href) => label === href ? label : match);
  }

  function repairAiBackgroundSvgArraysV390(value) {
    return String(value || '').replace(/("backgroundSvgs"\s*:\s*)\[(.*?)\](?=\s*,\s*"[A-Za-z0-9_]+"\s*:)/gs, (whole, prefix, inner) => {
      const body = String(inner || '').trim();
      if (!body) return `${prefix}[]`;
      // This repair is intentionally narrow. A malformed AI paste separates
      // SVG items with ","<svg while leaving attribute quotes unescaped.
      if (!/(?:\\<svg|<svg)[\s>]/i.test(body)) return whole;
      const parts = body.split(/"\s*,\s*"(?=\\?<svg\b|<svg\b)/i);
      if (!parts.length) return whole;
      const repaired = parts.map((part, index) => {
        let svg = String(part || '').trim();
        if (index === 0 && svg.startsWith('"')) svg = svg.slice(1);
        if (index === parts.length - 1 && svg.endsWith('"')) svg = svg.slice(0, -1);
        svg = svg.replace(/\\([:<>])/g, '$1');
        svg = repairAiMarkdownUrlV390(svg);
        if (/^<svg\b/i.test(svg) && !/<\/svg>\s*$/i.test(svg)) svg += '</svg>';
        return JSON.stringify(svg);
      });
      return `${prefix}[${repaired.join(',')}]`;
    });
  }

  function repairAiThemePasteV390(value) {
    let raw = String(value || '')
      .replace(/[\u200B-\u200D\uFEFF]/g, '')
      // Backslashes before colon/angle brackets are not valid JSON escapes and
      // are a common artifact of copied AI output.
      .replace(/\\([:<>])/g, '$1');
    raw = repairAiMarkdownUrlV390(raw);
    raw = repairAiBackgroundSvgArraysV390(raw);
    return raw;
  }

  function stripJsonCommentsV479(value) {
    const src = String(value || '');
    let out = '', inString = false, escape = false, quote = '"';
    for (let i = 0; i < src.length; i++) {
      const ch = src[i], next = src[i + 1];
      if (inString) {
        out += ch;
        if (escape) { escape = false; continue; }
        if (ch === '\\') { escape = true; continue; }
        if (ch === quote) inString = false;
        continue;
      }
      if (ch === '"') { inString = true; quote = ch; out += ch; continue; }
      if (ch === '/' && next === '/') {
        i += 2;
        while (i < src.length && src[i] !== '\n' && src[i] !== '\r') i++;
        if (i < src.length) out += src[i];
        continue;
      }
      if (ch === '/' && next === '*') {
        i += 2;
        while (i < src.length && !(src[i] === '*' && src[i + 1] === '/')) i++;
        i++;
        continue;
      }
      out += ch;
    }
    return out;
  }

  function removeTrailingJsonCommasV479(value) {
    const src = String(value || '');
    let out = '', inString = false, escape = false;
    for (let i = 0; i < src.length; i++) {
      const ch = src[i];
      if (inString) {
        out += ch;
        if (escape) { escape = false; continue; }
        if (ch === '\\') { escape = true; continue; }
        if (ch === '"') inString = false;
        continue;
      }
      if (ch === '"') { inString = true; out += ch; continue; }
      if (ch === ',') {
        let j = i + 1;
        while (j < src.length && /\s/.test(src[j])) j++;
        if (src[j] === '}' || src[j] === ']') continue;
      }
      out += ch;
    }
    return out;
  }

  function extractFirstJsonContainerV479(value) {
    const src = String(value || '');
    let start = -1, opener = '', closer = '', depth = 0, inString = false, escape = false;
    for (let i = 0; i < src.length; i++) {
      const ch = src[i];
      if (inString) {
        if (escape) { escape = false; continue; }
        if (ch === '\\') { escape = true; continue; }
        if (ch === '"') inString = false;
        continue;
      }
      if (ch === '"') { inString = true; continue; }
      if (start < 0 && (ch === '{' || ch === '[')) {
        start = i; opener = ch; closer = ch === '{' ? '}' : ']'; depth = 1; continue;
      }
      if (start >= 0) {
        if (ch === opener) depth++;
        else if (ch === closer) {
          depth--;
          if (depth === 0) return src.slice(start, i + 1);
        }
      }
    }
    return start >= 0 ? src.slice(start) : src;
  }

  function parseJsonCandidateV479(raw) {
    try {
      let value = JSON.parse(raw);
      // Some AI/file surfaces return a JSON object encoded inside one JSON string.
      if (typeof value === 'string') {
        const nested = String(value).trim();
        if (nested.startsWith('{') || nested.startsWith('[')) value = JSON.parse(nested);
      }
      return value;
    } catch { return null; }
  }

  function parseAiThemePayloadV376(text) {
    let raw = String(text || '').trim();
    if (!raw) return null;
    raw = raw.replace(/[\u200B-\u200D\uFEFF]/g, '').trim();
    raw = raw.replace(/^```(?:json|javascript|js)?\s*/i, '').replace(/\s*```$/i, '').trim();
    raw = raw.replace(/^\s*json\s*[:\-]?\s*(?=[{[])/i, '');

    const accept = value => {
      if (Array.isArray(value)) return value;
      return value && typeof value === 'object' ? value : null;
    };

    // 1) Exact valid JSON is always preferred and never modified.
    let parsed = parseJsonCandidateV479(raw);
    if (accept(parsed)) return parsed;

    // 2) If surrounding prose exists, isolate the first complete JSON object/array.
    const isolated = extractFirstJsonContainerV479(raw).trim();
    if (isolated && isolated !== raw) {
      parsed = parseJsonCandidateV479(isolated);
      if (accept(parsed)) return parsed;
      raw = isolated;
    }

    // 3) Repair only common copy/AI artifacts; never eval pasted text.
    let repaired = repairAiThemePasteV390(raw)
      .replace(/[“”]/g, '"')
      .replace(/\u00A0/g, ' ');
    repaired = stripJsonCommentsV479(repaired);
    repaired = removeTrailingJsonCommasV479(repaired);
    parsed = parseJsonCandidateV479(repaired);
    if (accept(parsed)) return parsed;

    // 4) One more SVG-array repair after comma/comment normalization.
    const svgRepaired = repairAiBackgroundSvgArraysV390(repaired);
    if (svgRepaired !== repaired) {
      parsed = parseJsonCandidateV479(svgRepaired);
      if (accept(parsed)) return parsed;
    }
    return null;
  }

  function unwrapAiThemeV376(value, fallbackName = '') {
    if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
    let theme = value.theme && typeof value.theme === 'object' && !Array.isArray(value.theme)
      ? clone(value.theme)
      : value.builder && typeof value.builder === 'object' && !Array.isArray(value.builder)
        ? clone(value.builder)
        : clone(value);
    if (!theme || typeof theme !== 'object' || Array.isArray(theme)) return null;
    delete theme.format; delete theme.version; delete theme.variants;
    if (!theme.name && fallbackName) theme.name = String(fallbackName);
    return stripAiVariantMetaV376(theme);
  }

  function parseAiThemeBundleV376(text) {
    const payload = parseAiThemePayloadV376(text);
    if (!payload) return null;

    // Also accept a simple [lightTheme, darkTheme] pair.
    if (Array.isArray(payload)) {
      if (!payload.length) return null;
      const light = unwrapAiThemeV376(payload[0], payload[0]?.name || 'Custom Theme');
      const dark = unwrapAiThemeV376(payload[1], payload[1]?.name || payload[0]?.name || 'Custom Theme');
      const finalName = String(light?.name || dark?.name || 'Custom Theme').trim() || 'Custom Theme';
      if (light) light.name = finalName;
      if (dark) dark.name = finalName;
      return light || dark ? { name:finalName, variants:{ light, dark }, dual:!!light && !!dark } : null;
    }

    const name = String(payload.name || payload.theme?.name || payload.light?.name || payload.dark?.name || '').trim();
    let rawVariants = payload.variants && typeof payload.variants === 'object' && !Array.isArray(payload.variants)
      ? payload.variants
      : payload.theme?.variants && typeof payload.theme.variants === 'object' && !Array.isArray(payload.theme.variants)
        ? payload.theme.variants
        : null;

    // Friendly shorthand: {"light":{...},"dark":{...}} is accepted too.
    if (!rawVariants && ((payload.light && typeof payload.light === 'object') || (payload.dark && typeof payload.dark === 'object'))) {
      rawVariants = { light:payload.light || null, dark:payload.dark || null };
    }

    const variants = { light:null, dark:null };
    if (rawVariants) {
      variants.light = unwrapAiThemeV376(rawVariants.light, name);
      variants.dark = unwrapAiThemeV376(rawVariants.dark, name);
    } else {
      // Backward compatibility with old one-theme JSON and raw Theme Builder objects.
      const single = unwrapAiThemeV376(payload, name);
      if (single) variants[state.aiThemeMode === 'dark' ? 'dark' : 'light'] = single;
    }
    const finalName = String(name || variants.light?.name || variants.dark?.name || 'Custom Theme').trim() || 'Custom Theme';
    ['light','dark'].forEach(mode => { if (variants[mode]) variants[mode].name = String(variants[mode].name || finalName).trim() || finalName; });
    if (!variants.light && !variants.dark) return null;
    return { name:finalName, variants, dual:!!variants.light && !!variants.dark };
  }

  function parseAiThemeJsonV312(text) {
    const bundle = parseAiThemeBundleV376(text);
    if (!bundle) return null;
    return clone(bundle.variants[state.aiThemeMode] || bundle.variants.light || bundle.variants.dark || null);
  }

  function aiJsonStatusV325() {
    const raw = String(state.aiJsonText || '').trim();
    const savedCount = aiVariantCountV376();
    if (!raw) {
      if (savedCount === 2) return `Both AI versions are saved · ${state.aiThemeMode === 'dark' ? 'Dark' : 'Light'} selected.`;
      if (savedCount === 1) return `${hasAiVariantV376('light') ? 'Light' : 'Dark'} AI version is saved.`;
      return 'Paste the Light + Dark AI theme JSON to continue.';
    }
    const bundle = parseAiThemeBundleV376(raw);
    if (!bundle) return savedCount ? 'Pasted JSON is not valid. Saved AI version(s) are still available.' : 'JSON is not valid yet.';
    if (state.aiJsonAppliedV325 && aiVariantCountV376() === 2) return `Light + Dark versions stored · ${state.aiThemeMode === 'dark' ? 'Dark' : 'Light'} selected.`;
    if (bundle.dual) return 'Valid Light + Dark bundle ready to apply.';
    return `Legacy single-version JSON ready as ${bundle.variants.dark ? 'Dark' : 'Light'}.`;
  }

  function selectedAiVariantAvailableV376() {
    const parsed = parseAiThemeBundleV376(state.aiJsonText);
    return !!parsed?.variants?.[state.aiThemeMode] || hasAiVariantV376(state.aiThemeMode);
  }

  function refreshAiJsonStateV325() {
    const status = $('[data-ai-status]', state.modal);
    const button = $('[data-action="apply-ai-theme"]', state.modal);
    const valid = selectedAiVariantAvailableV376();
    if (status) status.textContent = aiJsonStatusV325();
    if (button) {
      button.disabled = !valid;
      button.textContent = `Apply ${state.aiThemeMode === 'dark' ? 'Dark' : 'Light'} Version`;
    }
  }

  function applyAiThemeObjectV376(imported, mode = state.aiThemeMode, bundleName = '') {
    if (!imported || typeof imported !== 'object' || Array.isArray(imported)) return false;
    mode = mode === 'dark' ? 'dark' : 'light';

    // Complete generated theme, while preserving real uploaded media when the
    // AI correctly leaves those file-backed fields empty.
    const current = state.draft || {};
    const currentDecorations = clone(current.backgroundSvgs || []);
    const currentSounds = clone(current.svgHoverSounds || []);
    const currentIntro = current.introAudio;
    const currentIntroName = current.introAudioName;
    const currentIntroPath = current.introAudioProjectPath;
    const currentBackgroundImage = current.backgroundImage;
    const currentBackgroundImageName = current.backgroundImageName;
    const currentBackgroundImagePath = current.backgroundImageProjectPath || current.backgroundImageProjectPathV3;

    const next = { ...blankDraft(), ...clone(imported) };
    // V452: the new Heading Backdrop and Page Backdrop controls are independent.
    // Accept both new V452 JSON and older legacy backdrop fields, then keep the
    // legacy runtime mirrors synchronized so preview and applied pages match.
    next.headingBackgroundColorV452 = safeHex(
      imported.headingBackgroundColorV452,
      safeHex(imported.contentBackdropColor, next.headingBackgroundColorV452 || next.surface || '#ffffff')
    );
    next.headingBackgroundOpacityV452 = clamp(
      Object.prototype.hasOwnProperty.call(imported,'headingBackgroundOpacityV452') ? imported.headingBackgroundOpacityV452 : imported.contentBackdropOpacity,
      0, 100, next.headingBackgroundOpacityV452 || 88
    );
    next.headingBackgroundRadiusV452 = clamp(
      imported.headingBackgroundRadiusV452, 0, 40, Number(next.headingBackgroundRadiusV452 ?? next.radius) || 10
    );
    next.pageBackdropColorV452 = safeHex(
      imported.pageBackdropColorV452,
      safeHex(imported.dailyLogBackgroundColor, safeHex(imported.contentBackdropColor, next.pageBackdropColorV452 || next.surface || '#ffffff'))
    );
    next.pageBackdropOpacityV452 = clamp(
      Object.prototype.hasOwnProperty.call(imported,'pageBackdropOpacityV452') ? imported.pageBackdropOpacityV452 : (Object.prototype.hasOwnProperty.call(imported,'dailyLogBackgroundOpacity') ? imported.dailyLogBackgroundOpacity : imported.contentBackdropOpacity),
      0, 100, next.pageBackdropOpacityV452 || 92
    );
    next.quizBackdropEnabledV456 = imported.quizBackdropEnabledV456 === true;
    next.quizBackdropColorV456 = safeHex(imported.quizBackdropColorV456, safeHex(imported.contentBackdropColor, next.pageBackdropColorV452 || next.surface || '#ffffff'));
    next.quizBackdropOpacityV456 = clamp(imported.quizBackdropOpacityV456, 0, 100, clamp(imported.contentBackdropOpacity, 0, 100, 92));
    next.quizBackdropRadiusV456 = clamp(imported.quizBackdropRadiusV456, 0, 40, Number(imported.radius ?? next.radius) || 10);
    next.quizBackdropPaddingV459 = clamp(imported.quizBackdropPaddingV459, 0, 40, Number(next.quizBackdropPaddingV459) || 16);
    next.dailyLogBackgroundColor = next.pageBackdropColorV452;
    next.contentBackdropColor = next.pageBackdropColorV452;
    next.dailyLogBackgroundOpacity = next.pageBackdropOpacityV452;
    next.contentBackdropOpacity = next.pageBackdropOpacityV452;
    ensureAiDashboardButtonContrastV391(next);
    ensureAiSettingsContrastV394(next, mode);
    ensureAiCreateLogModalContrastV396(next, mode);
    const themeName = String(bundleName || next.name || imported.name || current.name || 'Custom Theme').trim() || 'Custom Theme';
    next.name = themeName;
    if (!Object.prototype.hasOwnProperty.call(imported,'radius')) next.radius = 20;
    if (!Object.prototype.hasOwnProperty.call(imported,'shadow')) next.shadow = 0;

    // V400: one decoration set is shared by both appearances. The first applied
    // variant establishes it; after that, switching Light/Dark never swaps it out.
    if (Object.prototype.hasOwnProperty.call(imported,'advancedUiEnabledV432')) state.aiBuilderDepthV432 = imported.advancedUiEnabledV432 === true ? 'advanced' : 'basic';
    if (Object.prototype.hasOwnProperty.call(imported,'themeBuilderAiBackgroundFocusV479')) state.aiBackgroundFocusV479 = String(imported.themeBuilderAiBackgroundFocusV479) === 'enhanced' ? 'enhanced' : 'standard';
    state.aiDecorationModeV432 = 'decorations';
    next.aiDecorationsModeV432 = 'decorations';
    if (Array.isArray(state.aiSharedDecorationsV400)) next.backgroundSvgs = clone(state.aiSharedDecorationsV400);
    else if (!Array.isArray(imported.backgroundSvgs) || imported.backgroundSvgs.length === 0) next.backgroundSvgs = currentDecorations;
    if (!Array.isArray(imported.svgHoverSounds) || imported.svgHoverSounds.length === 0) next.svgHoverSounds = currentSounds;

    // V429: AI may choose heading color/opacity/padding, but may not auto-enable.
    // A manual shared override is applied immediately afterward and may win.
    next.headingBackgroundEnabledV429 = false;
    applyAiSharedStateV400(next);
    if (!String(imported.introAudio || '').trim() && currentIntro) {
      next.introAudio = currentIntro;
      next.introAudioName = currentIntroName;
      next.introAudioProjectPath = currentIntroPath || '';
    }
    if (String(imported.backgroundSourceV311 || '') === 'image' && !String(imported.backgroundImage || '').trim() && currentBackgroundImage) {
      next.backgroundImage = currentBackgroundImage;
      next.backgroundImageName = currentBackgroundImageName || '';
      if (currentBackgroundImagePath) next.backgroundImageProjectPath = currentBackgroundImagePath;
    }

    registerCustomFontV326(next, themeName);
    registerCustomAnimationV326(next, themeName);

    if (next.customCursorV161 && typeof next.customCursorV161 === 'object') {
      next.customCursorLabelV161 = themeName;
      next.useThemeCursor = true;
      next.themeCursorTrailEnabledV161 = true;
      try { window.__loggyThemeAiV161?.registerCursor?.(next, themeName); } catch {}
    }

    if (!Object.prototype.hasOwnProperty.call(imported,'audioFade')) next.audioFade = true;
    next.backgroundSourceV311 = inferBackgroundSourceV311(next);
    next.pageBackdropsEnabledV312 = inferPageBackdropsEnabledV312(next);
    next.shapeTypeEnabledV312 = true;
    const targetDefault = String(next.svgDefaultAnimation || 'float').trim() || 'float';
    const normalizeAiDecorationAnimationV404 = asset => {
      const a={...(asset||{})};
      // AI themes inherit the global Default Animation. Only an override that the
      // user explicitly chose in the per-decoration editor is allowed to opt out.
      const override=a.animationOverrideUserSetV404===true?String(a.animationOverride||'').trim():'';
      a.animationOverride=override;
      a.animation=override||targetDefault;
      return a;
    };
    next.backgroundSvgs = (next.backgroundSvgs || []).map(normalizeAiDecorationAnimationV404);

    state.aiThemeMode = mode;
    state.aiVariantsV376 ||= { light:null, dark:null };
    // V486: Decorations/No Decorations was removed from the AI Builder in V481.
    // The apply path still referenced the deleted noDecorationsV432 variable,
    // which raised a ReferenceError AFTER JSON validation and prevented either
    // Light or Dark from ever being applied. Keep the shared decoration set
    // normally and never depend on that retired control.
    if (!Array.isArray(state.aiSharedDecorationsV400)) state.aiSharedDecorationsV400 = clone(next.backgroundSvgs || []);
    state.aiSharedDecorationsV400 = (state.aiSharedDecorationsV400 || []).map(normalizeAiDecorationAnimationV404);
    next.backgroundSvgs = clone(state.aiSharedDecorationsV400);
    applyAiSharedStateV400(next);
    const manualHeadingBackdropV496 = state.draft?.themeBuilderHeadingBackdropOverrideV496;
    if (manualHeadingBackdropV496 && typeof manualHeadingBackdropV496 === 'object') {
      applyHeadingBackdropAuthorityV496(next, headingBackdropAuthorityV496({ ...next, themeBuilderHeadingBackdropOverrideV496: manualHeadingBackdropV496 }));
    }
    const manualQuizBackdropV492 = state.draft?.themeBuilderQuizBackdropOverrideV492;
    if (manualQuizBackdropV492 && typeof manualQuizBackdropV492 === 'object') applyQuizBackdropAuthorityV492(next, quizBackdropAuthorityV492({ ...next, themeBuilderQuizBackdropOverrideV492: manualQuizBackdropV492 }));
    state.aiVariantsV376[mode] = stripAiVariantMetaV376(next);
    propagateAiSharedStateToVariantsV400();

    next.themeBuilderAiJsonV364 = state.aiJsonText;
    next.themeBuilderAiUsedV364 = true;
    next.themeBuilderAiModeV364 = mode; // backward-compatible selected appearance
    next[AI_SELECTED_KEY_V376] = mode;
    next[AI_VARIANTS_KEY_V376] = clone(state.aiVariantsV376);
    next.themeBuilderAutoToolV364 = 'ai';

    state.draft = next;
    state.original = clone(next);
    state.autoThemeTool = 'ai';
    state.aiJsonAppliedV325 = true;
    state.decorationsDirty = Array.isArray(imported.backgroundSvgs) && imported.backgroundSvgs.length > 0;
    state.draft.themeBuilderAiDepthV432 = state.aiBuilderDepthV432;
    state.draft.themeBuilderAiBackgroundFocusV479 = state.aiBackgroundFocusV479;
    state.draft.themeBuilderAiDecorationModeV432 = state.aiDecorationModeV432;
    Object.keys(imported).forEach(markTouched);
    ['name','backgroundSourceV311','pageBackdropsEnabledV312','shapeTypeEnabledV312','themeBuilderAiJsonV364','themeBuilderAiUsedV364','themeBuilderAiModeV364',AI_SELECTED_KEY_V376,AI_VARIANTS_KEY_V376,'themeBuilderAutoToolV364'].forEach(markTouched);
    if (next.customFontV326) ['customFontV326','font'].forEach(markTouched);
    if (next.customAnimationV159) ['customAnimationV159','customAnimationModeIdV159','customAnimationLabelV159','svgDefaultAnimation'].forEach(markTouched);
    if (next.customCursorV161) ['customCursorV161','customCursorLabelV161','customCursorModeIdV161','customCursorDependencyV161','useThemeCursor','themeCursorStyle','themeCursorTrailEnabledV161'].forEach(markTouched);

    renderAllControls();
    refreshAiJsonStateV325();
    setStatus(`Previewing AI ${mode === 'dark' ? 'Dark' : 'Light'} version · Save Theme to make it active.`);
    return true;
  }

  function applyStoredAiVariantV376(mode) {
    mode = mode === 'dark' ? 'dark' : 'light';
    const target = state.aiVariantsV376?.[mode];
    if (!target) return false;
    return applyAiThemeObjectV376(clone(target), mode, target.name || state.draft?.name || 'Custom Theme');
  }

  function applyAiThemeJsonV312(text) {
    state.aiJsonText = String(text || '');
    const bundle = parseAiThemeBundleV376(text);
    if (!bundle) {
      state.aiJsonAppliedV325 = false;
      refreshAiJsonStateV325();
      return false;
    }

    // Preserve the current selected version before importing/replacing the
    // bundle, then keep BOTH new variants in memory and on the saved theme.
    syncActiveAiVariantV376();
    if (bundle.variants.light) state.aiVariantsV376.light = stripAiVariantMetaV376(bundle.variants.light);
    if (bundle.variants.dark) state.aiVariantsV376.dark = stripAiVariantMetaV376(bundle.variants.dark);

    const selected = bundle.variants[state.aiThemeMode] || state.aiVariantsV376[state.aiThemeMode];
    if (!selected) {
      state.aiJsonAppliedV325 = false;
      refreshAiJsonStateV325();
      return false;
    }
    return applyAiThemeObjectV376(selected, state.aiThemeMode, bundle.name);
  }

  async function projectUpload(file, kind) {
    try { if (typeof uploadThemeBuilderAssetToProject === 'function') return await uploadThemeBuilderAssetToProject(file, kind); } catch {}
    return await new Promise(resolve => { const reader = new FileReader(); reader.onload = () => resolve({ url:String(reader.result || ''), projectPath:'', name:file.name, type:file.type }); reader.onerror = () => resolve(null); reader.readAsDataURL(file); });
  }

  async function uploadBackground(file) {
    const saved = await projectUpload(file, 'background'); if (!saved?.url) return;
    state.draft.backgroundImage = saved.url; state.draft.backgroundImageName = saved.name || file.name || 'Background'; state.draft.backgroundModeV158 = 'image'; state.draft.backgroundSourceV311 = 'image';
    ['backgroundImage','backgroundImageName','backgroundModeV158','backgroundSourceV311'].forEach(key => { state.touched.add(key); rememberAiSharedOverrideV400(key,state.draft[key]); }); if(state.draft.backgroundImageProjectPath)rememberAiSharedOverrideV400('backgroundImageProjectPath',state.draft.backgroundImageProjectPath); renderBackground(); schedulePreview();
  }
  async function uploadIntroAudio(file) {
    // V416: claim a replacement transaction BEFORE the async upload starts. If
    // Remove/a second upload/reuse happens meanwhile, this older result is stale.
    const requestV416 = ++state.introSourceRevisionV416;
    stopAllThemeBuilderIntroPlaybackV414();
    const saved = await projectUpload(file, 'audio');
    if (requestV416 !== state.introSourceRevisionV416 || !saved?.url) return;
    replaceThemeBuilderIntroSourceV414({
      url:saved.url,
      name:saved.name || file.name || 'Intro Audio',
      projectPath:saved.projectPath || '',
      sourceThemeId:'',
      requestIdV416:requestV416
    });
    renderAudio(); schedulePreview();
  }
  async function uploadHoverSounds(files) {
    const added = [];
    for (const file of files.slice(0,24)) { const saved = await projectUpload(file,'audio'); if (saved?.url) added.push({ name:saved.name || file.name || 'Hover Sound', url:saved.url, projectPath:saved.projectPath || '' }); }
    if (!added.length) return;
    state.draft.svgHoverSounds = mergeSounds(state.draft.svgHoverSounds || [], added); state.draft.svgHoverSoundsEnabled = true; state.draft.hoverAudioSourceThemeIdV364=''; state.touched.add('svgHoverSounds'); state.touched.add('svgHoverSoundsEnabled'); state.touched.add('hoverAudioSourceThemeIdV364'); rememberAiSharedOverrideV400('svgHoverSounds',state.draft.svgHoverSounds); rememberAiSharedOverrideV400('svgHoverSoundsEnabled',true); rememberAiSharedOverrideV400('hoverAudioSourceThemeIdV364',''); renderAudio(); renderDecorations();
  }
  async function uploadDecorations(files) {
    const added = [];
    for (const file of files.slice(0,40)) {
      const saved = await projectUpload(file, 'svg');
      if (saved?.url) added.push(normalizeDecoration({ name:file.name, url:saved.url, projectPath:saved.projectPath || '', type:saved.type || file.type }, false));
    }
    if (!added.length) return;
    state.draft.backgroundSvgs = mergeDecorations(state.draft.backgroundSvgs || [], added); state.decorationsDirty = true; state.touched.add('backgroundSvgs'); rememberAiSharedDecorationsV400(); renderDecorations(); pushDecorationPreviewV513(); schedulePreview();
  }

  let audioPreview = null;
  let audioPreviewGuardV413 = null;

  // V414 — one active Theme Builder intro source + one audition player.
  const INTRO_SOURCE_KEYS_V414 = ['introAudio','introAudioName','introAudioProjectPath','introAudioSourceThemeIdV364','introAudioRemovedV423'];
  const LEGACY_INTRO_KEYS_V414 = ['introAudioUrl','introSong','introMusic','song','music','introSongName','songName','musicName'];
  function disposeThemeBuilderAudioV414(audio) {
    if (!audio) return;
    try { audio.pause(); } catch {}
    try { audio.currentTime = 0; } catch {}
    try { audio.removeAttribute?.('src'); } catch {}
    try { audio.src = ''; } catch {}
    try { audio.load?.(); } catch {}
  }
  function stopParentThemeBuilderIntroV414() {
    try { audioPreviewGuardV413?.(); } catch {}
    disposeThemeBuilderAudioV414(audioPreview);
    audioPreview = null;
  }
  function stopPreviewFrameIntroV414() {
    try {
      const frame = state.previewFrame || $('.tb307-frame', state.modal);
      frame?.contentWindow?.postMessage({ type:'loggy-theme-preview-stop-intro-v414' }, location.origin);
    } catch {}
  }
  function stopAppliedHostIntroV416() {
    if (STUDIO) {
      try { parent.postMessage({ type:'loggy-theme-builder-stop-host-intro-v416' }, location.origin); } catch {}
    }

    // V443: one applied-Log owner. Stop both its active player and any gesture
    // prime before an Audio-tab audition begins.
    try { window.__loggyLogIntroAudioV443?.stopAll?.(); } catch {}

    // Keep preview/audition-only historical objects cleaned up too. These are
    // not applied-Log owners; they exist only inside Theme Builder preview UIs.
    let audio = null;
    try { audio = customThemeIntroAudioV2 || null; } catch {}
    try { if (customThemeIntroStopTimerV2) clearTimeout(customThemeIntroStopTimerV2); } catch {}
    try { if (customThemeIntroFadeTimerV2) clearInterval(customThemeIntroFadeTimerV2); } catch {}
    try { if (typeof customThemeIntroFadeStartTimerV3 !== 'undefined' && customThemeIntroFadeStartTimerV3) clearTimeout(customThemeIntroFadeStartTimerV3); } catch {}
    disposeThemeBuilderAudioV414(audio);
    try { if (customThemeIntroAudioV2 === audio) customThemeIntroAudioV2 = null; } catch {}

    try {
      for (const modal of [document.getElementById('theme-builder-modal'), document.getElementById('theme-builder-v307-modal')]) {
        const legacy = modal?._themeBuilderIntroPreviewAudioV10 || null;
        disposeThemeBuilderAudioV414(legacy);
        if (modal) modal._themeBuilderIntroPreviewAudioV10 = null;
      }
    } catch {}
  }
  function stopAllThemeBuilderIntroPlaybackV414() {
    try { window.dispatchEvent(new CustomEvent('loggy-intro-audio-stop-v420')); } catch {}
    stopParentThemeBuilderIntroV414();
    stopPreviewFrameIntroV414();
    stopAppliedHostIntroV416();
  }
  function introSelectionFromThemeV416(theme = state.draft || {}) {
    return {
      url:String(theme?.introAudio || ''),
      name:String(theme?.introAudioName || ''),
      projectPath:String(theme?.introAudioProjectPath || ''),
      sourceThemeId:String(theme?.introAudioSourceThemeIdV364 || '')
    };
  }
  function writeIntroSelectionToThemeV416(theme, selection = state.introSelectionV416) {
    if (!theme || typeof theme !== 'object') return theme;
    const sel = selection || {url:'',name:'',projectPath:'',sourceThemeId:''};
    theme.introAudio = String(sel.url || '');
    theme.introAudioName = String(sel.name || (sel.url ? fileName(sel.url,'Intro Audio') : ''));
    theme.introAudioProjectPath = String(sel.projectPath || '');
    theme.introAudioSourceThemeIdV364 = String(sel.sourceThemeId || '');
    // Explicitly blank every historical alias. Later merge-based compatibility
    // code therefore cannot resurrect the replaced/removed source.
    LEGACY_INTRO_KEYS_V414.forEach(key => { theme[key] = ''; });
    return theme;
  }
  function commitIntroSelectionEverywhereV416() {
    state.introSelectionV416 ||= introSelectionFromThemeV416(state.draft);
    writeIntroSelectionToThemeV416(state.draft, state.introSelectionV416);
    INTRO_SOURCE_KEYS_V414.forEach(key => {
      state.touched.add(key);
      try { rememberAiSharedOverrideV400(key,state.draft[key]); } catch {}
    });
    // Audio is theme-level behavior, not appearance-specific. Both AI variants
    // must carry the exact same replacement source before save/switch/reopen.
    if (state.aiVariantsV376 && typeof state.aiVariantsV376 === 'object') {
      for (const mode of ['light','dark']) {
        const variant = state.aiVariantsV376[mode];
        if (variant && typeof variant === 'object' && !Array.isArray(variant)) writeIntroSelectionToThemeV416(variant,state.introSelectionV416);
      }
    }
  }
  window.__loggyApplySavedIntroAuthorityV420 = applySavedIntroAuthorityV420;
  window.__loggyReadIntroAuthorityV420 = readIntroAuthorityMapV420;

  function clearThemeBuilderIntroSourceV414(options = {}) {
    if (options.bumpRevisionV416 !== false) state.introSourceRevisionV416 = Number(state.introSourceRevisionV416 || 0) + 1;
    stopAllThemeBuilderIntroPlaybackV414();
    state.introSelectionV416 = { url:'', name:'', projectPath:'', sourceThemeId:'' };
    writeIntroSelectionToThemeV416(state.draft,state.introSelectionV416);
    state.draft.introAudioRemovedV423 = true;
    INTRO_SOURCE_KEYS_V414.forEach(key => {
      state.touched.add(key);
      try { rememberAiSharedOverrideV400(key,state.draft[key]); } catch {}
    });
    // Clear the same source from both stored appearance drafts immediately, not
    // only after a later mode switch/save.
    if (state.aiVariantsV376 && typeof state.aiVariantsV376 === 'object') {
      for (const mode of ['light','dark']) {
        const variant = state.aiVariantsV376[mode];
        if (variant && typeof variant === 'object' && !Array.isArray(variant)) {
          writeIntroSelectionToThemeV416(variant,state.introSelectionV416);
          variant.introAudioRemovedV423 = true;
        }
      }
    }
    try { state.audioBundleCache?.delete?.(String(state.themeId||'')); } catch {}
  }
  function replaceThemeBuilderIntroSourceV414({url='',name='',projectPath='',sourceThemeId='',requestIdV416=null} = {}) {
    if (requestIdV416 != null && Number(requestIdV416) !== Number(state.introSourceRevisionV416 || 0)) return false;
    if (requestIdV416 == null) state.introSourceRevisionV416 = Number(state.introSourceRevisionV416 || 0) + 1;
    clearThemeBuilderIntroSourceV414({ bumpRevisionV416:false });
    state.introSelectionV416 = {
      url:String(url || ''),
      name:String(name || (url ? fileName(url,'Intro Audio') : '')),
      projectPath:String(projectPath || ''),
      sourceThemeId:String(sourceThemeId || '')
    };
    state.draft.introAudioRemovedV423 = false;
    if (state.aiVariantsV376 && typeof state.aiVariantsV376 === 'object') {
      for (const mode of ['light','dark']) {
        const variant = state.aiVariantsV376[mode];
        if (variant && typeof variant === 'object' && !Array.isArray(variant)) variant.introAudioRemovedV423 = false;
      }
    }
    commitIntroSelectionEverywhereV416();
    try { state.audioBundleCache?.delete?.(String(state.themeId||'')); } catch {}
    return true;
  }

  function parseThemeAudioTimeV413(value, fallback = NaN) {
    if (typeof value === 'number' && Number.isFinite(value)) return Math.max(0, value);
    const raw = String(value ?? '').trim();
    if (!raw) return fallback;
    if (/^\d+(?:\.\d+)?$/.test(raw)) return Math.max(0, Number(raw));
    const parts = raw.split(':').map(part => part.trim());
    if (parts.length < 2 || parts.length > 3 || parts.some(part => !/^\d+(?:\.\d+)?$/.test(part))) return fallback;
    const nums = parts.map(Number);
    const seconds = parts.length === 3 ? nums[0] * 3600 + nums[1] * 60 + nums[2] : nums[0] * 60 + nums[1];
    return Number.isFinite(seconds) ? Math.max(0, seconds) : fallback;
  }
  function guardThemeBuilderIntroAudioV413(audio, theme, baseVolume) {
    try { audioPreviewGuardV413?.(); } catch {}
    if (!audio) return;
    const segment = String(theme?.audioPlayMode || 'full') === 'segment';
    const start = segment ? parseThemeAudioTimeV413(theme?.audioStart, 0) : 0;
    const requestedEnd = segment ? parseThemeAudioTimeV413(theme?.audioEnd, NaN) : NaN;
    const fade = theme?.audioFade !== false;
    let end = segment && Number.isFinite(requestedEnd) && requestedEnd > start ? requestedEnd : NaN;
    let base = Math.max(0, Math.min(1, Number(baseVolume)));
    if (!Number.isFinite(base)) base = .35;
    let stopped = false;
    let interval = 0;
    const ready = () => {
      if (segment) {
        try { audio.currentTime = Math.min(start, Number.isFinite(audio.duration) ? Math.max(0, audio.duration - .02) : start); } catch {}
      }
      if (!segment && Number.isFinite(audio.duration) && audio.duration > 0) end = audio.duration;
    };
    const tick = () => {
      if (stopped || audioPreview !== audio) return;
      if (!Number.isFinite(end)) {
        if (!segment && Number.isFinite(audio.duration) && audio.duration > 0) end = audio.duration;
        else { audio.volume = base; return; }
      }
      const total = Math.max(.1, end - start);
      const fadeDuration = fade ? Math.min(total, 1.4, Math.max(.25, total * .35)) : 0;
      const now = Number(audio.currentTime) || 0;
      if (fadeDuration > 0 && now >= end - fadeDuration) {
        audio.volume = base * Math.max(0, Math.min(1, (end - now) / fadeDuration));
      } else {
        audio.volume = base;
      }
      if (now >= end - .025) {
        stopped = true;
        if (fade) audio.volume = 0;
        try { audio.pause(); } catch {}
        clearInterval(interval);
      }
    };
    if (audio.readyState >= 1) ready(); else audio.addEventListener('loadedmetadata', ready, { once:true });
    audio.addEventListener('timeupdate', tick);
    audio.addEventListener('playing', tick);
    interval = window.setInterval(tick, 40);
    audioPreviewGuardV413 = () => {
      stopped = true;
      clearInterval(interval);
      audio.removeEventListener('timeupdate', tick);
      audio.removeEventListener('playing', tick);
      audioPreviewGuardV413 = null;
    };
  }
  function playUrl(url, volume = 35) {
    const source = String(url || ''); if (!source) return;
    stopParentThemeBuilderIntroV414();
    try { audioPreview = new Audio(source); window.__loggyIntroAudioGateV443?.allow?.(audioPreview); audioPreview.volume = clamp(volume,0,100,35)/100; audioPreview.play().catch(()=>{}); } catch {}
  }
  function playThemeBuilderIntroPreviewV413(theme = {}) {
    const source = String(theme?.introAudio || ''); if (!source) return;
    // Explicit Play is the only Theme Builder intro audition owner. Silence the
    // live iframe first so two copies/sources can never play together.
    stopAllThemeBuilderIntroPlaybackV414();
    try {
      const audio = new Audio(source);
      try { window.__loggyIntroAudioGateV443?.allow?.(audio); } catch {}
      audioPreview = audio;
      const base = clamp(theme?.audioVolume,0,100,35)/100;
      audio.volume = base;
      guardThemeBuilderIntroAudioV413(audio, theme, base);
      audio.play().catch(()=>{});
    } catch {}
  }

  async function importIntroFromTheme(themeId, select) {
    if (!themeId) return;
    const requestV416 = ++state.introSourceRevisionV416;
    stopAllThemeBuilderIntroPlaybackV414();
    if (select) select.disabled = true; setStatus(`Loading song from ${displayName(themeId)}…`);
    const bundle = await configuredAudioBundle(themeId); if (select) select.disabled=false;
    if (requestV416 !== state.introSourceRevisionV416) return;
    if (!bundle?.introAudio?.url) { setStatus(`${displayName(themeId)} has no configured intro song.`); return; }
    if (!replaceThemeBuilderIntroSourceV414({
      url:bundle.introAudio.url,
      name:bundle.introAudio.name || fileName(bundle.introAudio.url,'Intro Audio'),
      projectPath:'',
      sourceThemeId:String(themeId),
      requestIdV416:requestV416
    })) return;
    setStatus(`Using ${state.draft.introAudioName} from ${displayName(themeId)}.`); renderAudio(); schedulePreview();
  }

  async function importHoverFromTheme(themeId, select) {
    if (!themeId) return;
    if (select) select.disabled = true; setStatus(`Loading hover sounds from ${displayName(themeId)}…`);
    const bundle = await configuredAudioBundle(themeId); if (select) select.disabled=false;
    const sounds = Array.isArray(bundle?.hoverSounds) ? bundle.hoverSounds : [];
    if (!sounds.length) { setStatus(`${displayName(themeId)} has no configured hover sounds.`); return; }
    state.draft.svgHoverSounds = mergeSounds(state.draft.svgHoverSounds || [], sounds); state.draft.svgHoverSoundsEnabled = true; state.draft.hoverAudioSourceThemeIdV364=String(themeId); state.touched.add('svgHoverSounds'); state.touched.add('svgHoverSoundsEnabled'); state.touched.add('hoverAudioSourceThemeIdV364');
    setStatus(`Added ${sounds.length} hover sound${sounds.length===1?'':'s'} from ${displayName(themeId)}.`); renderAudio(); renderDecorations();
  }

  function markTouched(key) { if (key) state.touched.add(key); }

  function openDecorationDetails(index) {
    requestAnimationFrame(() => { const card = $(`[data-decoration-index="${index}"]`, state.modal); const details = card?.querySelector('details'); if (details) details.open = true; });
  }

  // V398: neutral Create Log colors are intentionally linked to the Settings
  // palette in the Theme Builder UI as well, so manual edits and AI previews agree.
  function linkedColorPeersV398(key) {
    const groups = [
      // V399: normal + New Log is deliberately the same visual as a normal Log circle.
      ['dashboardLogButtonBackgroundV391','dashboardNewLogButtonBackgroundV391'],
      ['dashboardLogButtonIconColorV391','dashboardLogButtonTextColorV391','dashboardNewLogButtonIconColorV391','dashboardNewLogButtonTextColorV391'],
      ['dashboardLogButtonBorderColorV391','dashboardNewLogButtonBorderColorV391'],
      ['dashboardLogButtonHoverBackgroundV391','dashboardNewLogButtonHoverBackgroundV391'],
      ['dashboardLogButtonHoverTextColorV391','dashboardNewLogButtonHoverTextColorV391'],
      ['dashboardLogButtonHoverIconColorV391','dashboardNewLogButtonHoverIconColorV391'],
      ['dashboardLogButtonHoverBorderColorV391','dashboardNewLogButtonHoverBorderColorV391'],
      ['settingsModalBackgroundColorV380','dashboardContextMenuBackgroundColorV394','dashboardCreateLogModalBackgroundColorV396','dashboardCreateLogIconBackgroundColorV396','dashboardCreateLogButtonBackgroundColorV396'],
      ['settingsModalTextColorV380','dashboardCreateLogModalTextColorV396','dashboardCreateLogTitleColorV396','dashboardCreateLogLabelColorV396'],
      ['settingsModalBorderColorV380','dashboardCreateLogModalBorderColorV396','dashboardCreateLogInputBorderColorV396'],
      ['settingsModalInputBackgroundColorV380','dashboardCreateLogInputBackgroundColorV396','dashboardCreateLogInputFocusBackgroundColorV396'],
      ['settingsModalInputTextColorV380','dashboardCreateLogInputTextColorV396','dashboardCreateLogInputFocusTextColorV396'],
      ['settingsModalInputBorderColorV380'],
      ['settingsModalHoverBackgroundColorV380','dashboardCreateLogInputHoverBackgroundColorV396','dashboardCreateLogIconHoverBackgroundColorV396'],
      ['settingsModalHoverTextColorV380','dashboardCreateLogInputHoverTextColorV396','dashboardCreateLogIconHoverColorV396'],
      ['settingsModalSelectedBackgroundColorV380','dashboardCreateLogIconSelectedBackgroundColorV396'],
      ['settingsModalSelectedTextColorV380','dashboardCreateLogIconSelectedColorV396'],
      ['settingsModalSelectedBorderColorV380','dashboardCreateLogIconSelectedBorderColorV396','dashboardCreateLogInputFocusBorderColorV396'],
      ['settingsModalButtonBackgroundColorV380','dashboardCreateLogButtonHoverBackgroundColorV396'],
      ['settingsModalButtonTextColorV380','dashboardCreateLogButtonHoverTextColorV396','dashboardCreateLogButtonHoverIconColorV396'],
      ['settingsModalButtonBorderColorV380','dashboardCreateLogButtonHoverBorderColorV396']
    ];
    const group=groups.find(g=>g.includes(key));
    return group ? group.filter(k=>k!==key) : [];
  }
  function syncLinkedColorV398(key,value) {
    for(const linked of linkedColorPeersV398(key)){
      state.draft[linked]=value; markTouched(linked);
      const row=$(`[data-color-key="${CSS.escape(linked)}"]`,state.modal);
      const picker=row?.querySelector('[data-color-picker]'), text=row?.querySelector('[data-color-text]');
      if(picker)picker.value=value;if(text)text.value=value;
    }
  }

  // V495: a Theme Builder key can be rendered in more than one panel. Keep every
  // live copy synchronized so a hidden/stale control can never overwrite the
  // value the user just changed when Save Theme runs.
  function syncDuplicateControlsV495(key, value, source = null) {
    if (!state.modal || !key) return;
    const escaped = CSS.escape(String(key));
    state.modal.querySelectorAll(`[data-color-picker="${escaped}"]`).forEach(node => { if (node !== source) node.value = String(value); });
    state.modal.querySelectorAll(`[data-color-text="${escaped}"]`).forEach(node => { if (node !== source) node.value = String(value); });
    state.modal.querySelectorAll(`[data-number-key="${escaped}"]`).forEach(node => { if (node !== source) node.value = String(value); });
    state.modal.querySelectorAll(`[data-bool-key="${escaped}"]`).forEach(node => { if (node !== source) node.checked = !!value; });
    state.modal.querySelectorAll(`[data-output-for="${escaped}"]`).forEach(node => {
      const numberNode = state.modal.querySelector(`[data-number-key="${escaped}"]`);
      node.textContent = `${value}${numberNode?.dataset?.outputSuffix || (key === 'svgGlobalScale' ? '%' : '')}`;
    });
  }

  // V430: Page Background is the actual scene background for both Log and
  // Dashboard when the Theme Color background source is being edited manually.
  // Keep the Dashboard mirror in sync so the Dashboard cannot retain a stale
  // dashboardBackgroundV40 after the user changes Page Background.
  function syncDashboardPageBackgroundV430(key,value){
    if(key!=='background')return;
    state.draft.dashboardBackgroundV40=value;
    markTouched('dashboardBackgroundV40');
    rememberAiSharedOverrideV400('dashboardBackgroundV40',value);
    const row=$(`[data-color-key="dashboardBackgroundV40"]`,state.modal);
    const picker=row?.querySelector('[data-color-picker]'), text=row?.querySelector('[data-color-text]');
    if(picker)picker.value=value;
    if(text)text.value=value;
  }

  function handleInput(event) {
    const el = event.target; if (!el || !state.modal?.contains(el)) return;

    if (el.matches('[data-ai-json]')) {
      state.aiJsonText = String(el.value || '');
      state.aiJsonAppliedV325 = false;
      state.draft.themeBuilderAiJsonV364 = state.aiJsonText;
      state.draft.themeBuilderAiUsedV364 = true;
      state.draft.themeBuilderAiModeV364 = state.aiThemeMode;
      state.draft[AI_SELECTED_KEY_V376] = state.aiThemeMode;
      ['themeBuilderAiJsonV364','themeBuilderAiUsedV364','themeBuilderAiModeV364',AI_SELECTED_KEY_V376].forEach(markTouched);
      refreshAiJsonStateV325();
      return;
    }

    if (el.matches('[data-auto-theme-tool]')) {
      const tool = String(el.dataset.autoThemeTool || '');
      state.autoThemeTool = el.checked && (tool === 'smart' || tool === 'ai') ? tool : '';
      state.draft.themeBuilderAutoToolV364 = state.autoThemeTool;
      if (tool === 'ai') state.draft.themeBuilderAiUsedV364 = !!el.checked;
      ['themeBuilderAutoToolV364','themeBuilderAiUsedV364'].forEach(markTouched);
      renderAI();
      return;
    }

    if (el.matches('[data-smart-palette-picker]')) {
      state.smartPaletteSeed = safeHex(el.value, state.smartPaletteSeed);
      applySmartPaletteV323(state.smartPaletteSeed, state.smartPaletteMode);
      return;
    }
    if (el.matches('[data-smart-palette-text]')) {
      const value = String(el.value || '').trim();
      if (isHex(value)) { state.smartPaletteSeed = value; applySmartPaletteV323(value, state.smartPaletteMode); }
      return;
    }

    if (el.matches('[data-color-picker]')) {
      const key = el.dataset.colorPicker; state.draft[key] = el.value; markTouched(key);
      syncDuplicateControlsV495(key, el.value, el);
      syncLinkedColorV398(key,el.value);
      syncDashboardPageBackgroundV430(key,el.value);
      if (key === 'pageBackdropColorV452') {
        state.draft.dailyLogBackgroundColor = el.value;
        state.draft.contentBackdropColor = el.value;
        ['dailyLogBackgroundColor','contentBackdropColor'].forEach(markTouched);
      }
      if (key === 'headingBackgroundColorV452') { rememberAiSharedOverrideV400(key, el.value); rememberHeadingBackdropAuthorityV496(); try { window.__loggyApplyHeadingBackgroundV431?.(state.draft); } catch {} }
      if (key === 'quizBackdropColorV456') { rememberQuizBackdropAuthorityV492(); try { window.__loggyApplyQuizBackdropV456?.(state.draft); } catch {} }
      schedulePreview(); return;
    }
    if (el.matches('[data-color-text]')) {
      const key = el.dataset.colorText, value = String(el.value || '').trim();
      if (isHex(value)) {
        state.draft[key] = value; markTouched(key); syncDuplicateControlsV495(key, value, el);
        syncLinkedColorV398(key,value);
        syncDashboardPageBackgroundV430(key,value);
        if (key === 'pageBackdropColorV452') {
          state.draft.dailyLogBackgroundColor = value;
          state.draft.contentBackdropColor = value;
          ['dailyLogBackgroundColor','contentBackdropColor'].forEach(markTouched);
        }
        if (key === 'headingBackgroundColorV452') { rememberAiSharedOverrideV400(key, el.value); rememberHeadingBackdropAuthorityV496(); try { window.__loggyApplyHeadingBackgroundV431?.(state.draft); } catch {} }
        if (key === 'quizBackdropColorV456') { rememberQuizBackdropAuthorityV492(); try { window.__loggyApplyQuizBackdropV456?.(state.draft); } catch {} }
        schedulePreview();
      }
      return;
    }

    if (el.matches('[data-theme-key]')) {
      const key = el.dataset.themeKey;
      const previousValue = state.draft[key];
      state.draft[key] = el.value; markTouched(key); rememberAiSharedOverrideV400(key, state.draft[key]);
      if (key === 'svgDefaultAnimation' && previousValue !== el.value) {
        // Older builders sometimes copied the old global default into every
        // decoration override. If every decoration mirrors that old value, it
        // is not a meaningful per-decoration override; clear the mirrors so the
        // newly selected Default Animation can actually own the scene.
        const list = Array.isArray(state.draft.backgroundSvgs) ? state.draft.backgroundSvgs : [];
        const overrides = list.map(a=>String(a?.animationOverride||'').trim()).filter(Boolean);
        let clearedLegacy=false;
        list.forEach(a=>{
          if(!a||typeof a!=='object')return;
          if(a.animationOverrideUserSetV404===true)return;
          if(String(a.animationOverride||'').trim()){a.animationOverride='';clearedLegacy=true;}
        });
        if(!clearedLegacy && list.length && overrides.length === list.length && overrides.every(v=>v===String(previousValue||''))) {
          list.forEach(a=>{ if(a&&typeof a==='object'&&a.animationOverrideUserSetV404!==true) a.animationOverride=''; });
          clearedLegacy=true;
        }
        if(clearedLegacy){state.decorationsDirty = true; markTouched('backgroundSvgs'); rememberAiSharedDecorationsV400();}
        // V373: keep the legacy compatibility field synchronized immediately,
        // not only when Save is pressed. Several older Log/preview renderers still
        // read `asset.animation` while the editor is open. Without this, changing
        // Default Animation can preview correctly for one paint and then snap back
        // to the old value (usually Float) when a late renderer runs.
        list.forEach(a=>{
          if(!a||typeof a!=='object')return;
          const override=String(a.animationOverride||'').trim();
          a.animation=override||String(el.value||'float').trim()||'float';
        });
      }
      if (key === 'svgDistribution') {
        ensureManualSlots();
        // V515: distribution is a decoration-only visual edit. Stamp the new
        // coordinates now and push them straight to the iframe instead of
        // waiting for the full theme apply queue.
        try { stampDecorationLayoutV405(state.draft); } catch {}
        renderDecorations();
        pushDecorationPreviewV513();
      }
      else if (key === 'svgDefaultAnimation' || key === 'svgHoverSoundMode') renderDecorations();
      else if (key === 'audioPlayMode') { renderAudio(); }
      schedulePreview(); return;
    }
    if (el.matches('[data-number-key]')) {
      const key = el.dataset.numberKey;
      if (key === 'decorationsOpacityV117') clearDecorationOpacityLockV493();
      state.draft[key] = +el.value; markTouched(key); rememberAiSharedOverrideV400(key, state.draft[key]);
      syncDuplicateControlsV495(key, state.draft[key], el);
      if (key === 'pageBackdropOpacityV452') {
        state.draft.dailyLogBackgroundOpacity = +el.value;
        state.draft.contentBackdropOpacity = +el.value;
        ['dailyLogBackgroundOpacity','contentBackdropOpacity'].forEach(markTouched);
      }
      const output = $(`[data-output-for="${CSS.escape(key)}"]`, state.modal); if (output) output.textContent = `${el.value}${el.dataset.outputSuffix || (key==='svgGlobalScale'?'%':'')}`;
      if (key === 'headingBackgroundOpacityV452' || key === 'headingBackgroundPaddingV429' || key === 'headingBackgroundRadiusV452') {
        rememberHeadingBackdropAuthorityV496();
        try { window.__loggyApplyHeadingBackgroundV431?.(state.draft); } catch {}
      }
      if (key === 'quizBackdropOpacityV456' || key === 'quizBackdropRadiusV456' || key === 'quizBackdropPaddingV459') {
        rememberQuizBackdropAuthorityV492();
        try { window.__loggyApplyQuizBackdropV456?.(state.draft); } catch {}
      }
      schedulePreview(); return;
    }
    if (el.matches('[data-bool-key]')) {
      const key = el.dataset.boolKey; state.draft[key] = !!el.checked; markTouched(key); rememberAiSharedOverrideV400(key, state.draft[key]);
      syncDuplicateControlsV495(key, state.draft[key], el);
      if (key === 'pageBackdropsEnabledV312') {
        if (state.draft[key]) {
          if (!(Number(state.draft.pageBackdropOpacityV452) > 0)) state.draft.pageBackdropOpacityV452 = 92;
          state.draft.dailyLogBackgroundColor = safeHex(state.draft.pageBackdropColorV452, state.draft.dailyLogBackgroundColor || state.draft.surface || '#ffffff');
          state.draft.contentBackdropColor = state.draft.dailyLogBackgroundColor;
          state.draft.dailyLogBackgroundOpacity = clamp(state.draft.pageBackdropOpacityV452,0,100,92);
          state.draft.contentBackdropOpacity = state.draft.dailyLogBackgroundOpacity;
          ['pageBackdropOpacityV452','dailyLogBackgroundColor','contentBackdropColor','dailyLogBackgroundOpacity','contentBackdropOpacity'].forEach(markTouched);
        }
        renderBackground(); schedulePreview(); return;
      }
      if (key === 'dailyLogBackgroundEnabled' || key === 'contentBackdropEnabled') {
        if (state.draft[key]) {
          state.draft.pageBackdropsEnabledV312 = true;
          const opacityKey = key === 'dailyLogBackgroundEnabled' ? 'dailyLogBackgroundOpacity' : 'contentBackdropOpacity';
          if (!(Number(state.draft[opacityKey]) > 0)) state.draft[opacityKey] = 92;
          markTouched(opacityKey); rememberAiSharedOverrideV400(opacityKey);
        }
        markTouched('pageBackdropsEnabledV312'); rememberAiSharedOverrideV400('pageBackdropsEnabledV312'); renderBackground(); schedulePreview(); return;
      }
      if (key === 'quizBackdropEnabledV456') {
        rememberQuizBackdropAuthorityV492();
        try { window.__loggyApplyQuizBackdropV456?.(state.draft); } catch {}
        renderBackground(); schedulePreview(); return;
      }
      if (key === 'headingBackgroundEnabledV429') {
        if (state.draft[key] && !(Number(state.draft.headingBackgroundOpacityV452) > 0)) {
          state.draft.headingBackgroundOpacityV452 = 88;
          markTouched('headingBackgroundOpacityV452');
          rememberAiSharedOverrideV400('headingBackgroundOpacityV452', state.draft.headingBackgroundOpacityV452);
        }
        // V504: synchronize the durable override immediately, before previewDraft()
        // canonicalizes the draft. This keeps the iframe preview identical to the
        // toggle the user is looking at right now.
        rememberHeadingBackdropAuthorityV496();
        try { window.__loggyApplyHeadingBackgroundV431?.(state.draft); } catch {}
        renderBackground(); schedulePreview(); return;
      }
      if (key === 'preventDecorationOverlapV367') {
        // V493: lock exact visible transparency before any collision renderer
        // remounts/reindexes the preview decorations.
        captureDecorationOpacityLockV493();
        // V490: overlap prevention is placement-only. Snapshot all opacity data
        // and restore it before rendering so this toggle can never alter either
        // the global opacity or a decoration's own opacity/override state.
        const globalOpacityV490 = state.draft.decorationsOpacityV117;
        const opacitySnapshotV490 = (Array.isArray(state.draft.backgroundSvgs) ? state.draft.backgroundSvgs : []).map(asset => ({
          opacityV109: asset?.opacityV109,
          opacity: asset?.opacity,
          opacityOverrideV326: asset?.opacityOverrideV326
        }));
        if (state.draft[key]) {
          state.draft.svgAllowOverlap = false;
          state.draft.reduceDecorationOverlapV361 = false;
          markTouched('svgAllowOverlap'); markTouched('reduceDecorationOverlapV361'); rememberAiSharedOverrideV400('svgAllowOverlap'); rememberAiSharedOverrideV400('reduceDecorationOverlapV361');
        }
        state.draft.decorationsOpacityV117 = globalOpacityV490;
        (Array.isArray(state.draft.backgroundSvgs) ? state.draft.backgroundSvgs : []).forEach((asset,index) => {
          const snap = opacitySnapshotV490[index]; if (!asset || !snap) return;
          if (snap.opacityV109 === undefined) delete asset.opacityV109; else asset.opacityV109 = snap.opacityV109;
          if (snap.opacity === undefined) delete asset.opacity; else asset.opacity = snap.opacity;
          if (snap.opacityOverrideV326 === undefined) delete asset.opacityOverrideV326; else asset.opacityOverrideV326 = snap.opacityOverrideV326;
        });
        renderDecorations(); pushDecorationPreviewV513(); schedulePreview(); return;
      }
      if (key === 'reduceDecorationOverlapV361' && state.draft[key]) {
        state.draft.preventDecorationOverlapV367 = false;
        markTouched('preventDecorationOverlapV367'); rememberAiSharedOverrideV400('preventDecorationOverlapV367');
        renderDecorations(); pushDecorationPreviewV513(); schedulePreview(); return;
      }
      if (key === 'svgAllowOverlap' && state.draft[key]) {
        state.draft.preventDecorationOverlapV367 = false;
        state.draft.reduceDecorationOverlapV361 = false;
        markTouched('preventDecorationOverlapV367'); markTouched('reduceDecorationOverlapV361');
        renderDecorations(); pushDecorationPreviewV513(); schedulePreview(); return;
      }
      if (key === 'svgHoverSoundsEnabled') { renderAudio(); renderDecorations(); schedulePreview(); return; }
      if (key === 'introSvgBounceEnabled' || key === 'introMusicReactionsEnabledV154' || key === 'svgHoverAnimationsEnabledV82') { renderDecorations(); schedulePreview(); return; }
      if (key === 'useThemeCursor') { renderTrinkets(); schedulePreview(); return; }
      if (key === 'useThemeCompanion') { state.draft.themeCompanionEnabledV163 = !!state.draft.useThemeCompanion; markTouched('themeCompanionEnabledV163'); rememberAiSharedOverrideV400('themeCompanionEnabledV163'); renderTrinkets(); schedulePreview(); return; }
      schedulePreview(); return;
    }

    if (el.matches('[data-action-select="reuse-intro"]')) { if (event.type === 'change') importIntroFromTheme(el.value, el); return; }
    if (el.matches('[data-action-select="reuse-hover"]')) { if (event.type === 'change') importHoverFromTheme(el.value, el); return; }

    if (el.matches('[data-deco-hidden]')) {
      const index = +el.dataset.decoHidden, asset = state.draft.backgroundSvgs?.[index]; if (!asset) return;
      asset.hiddenOnScreenV63 = !!el.checked;
      if (asset.hiddenOnScreenV63) asset.alwaysShowOnScreenV370 = false;
      state.decorationsDirty = true; markTouched('backgroundSvgs'); rememberAiSharedDecorationsV400();
      // V519: push visibility BEFORE rebuilding the editor controls or queuing a
      // full preview apply. The iframe removes the live decoration immediately.
      pushDecorationVisibilityPreviewV519(index);
      renderDecorations(); openDecorationDetails(index); pushDecorationPreviewV513(); schedulePreview(); return;
    }
    if (el.matches('[data-deco-always-show]')) {
      const index = +el.dataset.decoAlwaysShow, asset = state.draft.backgroundSvgs?.[index]; if (!asset) return;
      asset.alwaysShowOnScreenV370 = !!el.checked;
      if (asset.alwaysShowOnScreenV370) asset.hiddenOnScreenV63 = false;
      state.decorationsDirty = true; markTouched('backgroundSvgs'); rememberAiSharedDecorationsV400();
      renderDecorations(); openDecorationDetails(index); schedulePreview(); return;
    }
    if (el.matches('[data-deco-opacity-override]')) {
      clearDecorationOpacityLockV493();
      const index = +el.dataset.decoOpacityOverride, asset = state.draft.backgroundSvgs?.[index]; if (!asset) return;
      asset.opacityOverrideV326 = !!el.checked;
      state.decorationsDirty = true; markTouched('backgroundSvgs'); rememberAiSharedDecorationsV400();
      renderDecorations(); openDecorationDetails(index); schedulePreview(); return;
    }
    if (el.matches('[data-deco-opacity]')) {
      clearDecorationOpacityLockV493();
      const index = +el.dataset.decoOpacity, asset = state.draft.backgroundSvgs?.[index]; if (!asset) return;
      asset.opacityV109 = +el.value; asset.opacityOverrideV326 = true; state.decorationsDirty = true; markTouched('backgroundSvgs'); rememberAiSharedDecorationsV400();
      const output = $(`[data-deco-opacity-output="${index}"]`, state.modal); if (output) output.textContent = `${el.value}%`; schedulePreview(); return;
    }
    if (el.matches('[data-deco-animation]')) {
      const index = +el.dataset.decoAnimation, asset = state.draft.backgroundSvgs?.[index]; if (!asset) return;
      asset.animationOverride = el.value; asset.animationOverrideUserSetV404 = !!String(el.value||'').trim(); state.decorationsDirty = true; markTouched('backgroundSvgs'); rememberAiSharedDecorationsV400(); renderDecorations(); openDecorationDetails(index); schedulePreview(); return;
    }
    if (el.matches('[data-deco-bop]')) {
      const index = +el.dataset.decoBop, asset = state.draft.backgroundSvgs?.[index]; if (!asset) return;
      asset.bopModeV60 = el.value; state.decorationsDirty = true; markTouched('backgroundSvgs'); rememberAiSharedDecorationsV400(); schedulePreview(); return;
    }
    if (el.matches('[data-deco-hover]')) {
      const index = +el.dataset.decoHover, asset = state.draft.backgroundSvgs?.[index]; if (!asset) return;
      asset.hoverAnimationOverrideV82 = el.value; state.decorationsDirty = true; markTouched('backgroundSvgs'); rememberAiSharedDecorationsV400(); schedulePreview(); return;
    }
    if (el.matches('[data-deco-sound]')) {
      const index = +el.dataset.decoSound, asset = state.draft.backgroundSvgs?.[index]; if (!asset) return;
      const sound = (state.draft.svgHoverSounds || []).map(item=>normalizeAudioItem(item,'Hover Sound')).find(item=>item?.url===el.value);
      asset.hoverSoundUrl = sound?.url || ''; asset.hoverSoundName = sound?.name || ''; state.decorationsDirty = true; markTouched('backgroundSvgs'); rememberAiSharedDecorationsV400(); return;
    }
    if (el.matches('[data-slot-index][data-slot-axis]')) {
      const index = +el.dataset.slotIndex, axis = el.dataset.slotAxis; ensureManualSlots();
      if (state.draft.manualPlacementSlotsV40[index] && (axis === 'x' || axis === 'y')) {
        state.draft.manualPlacementSlotsV40[index][axis] = +el.value; markTouched('manualPlacementSlotsV40'); schedulePreview();
      }
      return;
    }

    if (el.matches('[data-file="background"]') && el.files?.[0] && event.type === 'change') uploadBackground(el.files[0]);
    if (el.matches('[data-file="audio"]') && el.files?.[0] && event.type === 'change') uploadIntroAudio(el.files[0]);
    if (el.matches('[data-file="hover-sounds"]') && el.files?.length && event.type === 'change') uploadHoverSounds(Array.from(el.files));
    if (el.matches('[data-file="decorations"]') && el.files?.length && event.type === 'change') uploadDecorations(Array.from(el.files));
  }

  function handleClick(event) {
    const tab = event.target?.closest?.('[data-tab]'); if (tab) { selectTab(tab.dataset.tab); return; }
    const action = event.target?.closest?.('[data-action]'); if (!action) return;
    const type = action.dataset.action;

    if (type === 'close') { close(); return; }
    if (type === 'smart-palette-mode') { state.smartPaletteMode = action.dataset.value === 'dark' ? 'dark' : 'light'; applySmartPaletteV323(state.smartPaletteSeed, state.smartPaletteMode); return; }
    if (type === 'ai-theme-mode') {
      const nextMode = action.dataset.value === 'dark' ? 'dark' : 'light';
      if (nextMode !== state.aiThemeMode) {
        rememberAiSharedDecorationsV400();
        syncActiveAiVariantV376();
        propagateAiSharedStateToVariantsV400();
      }
      state.aiThemeMode = nextMode;
      state.draft.themeBuilderAiModeV364=state.aiThemeMode;
      state.draft[AI_SELECTED_KEY_V376]=state.aiThemeMode;
      state.draft.themeBuilderAiUsedV364=true; state.draft.themeBuilderAutoToolV364='ai';
      ['themeBuilderAiModeV364',AI_SELECTED_KEY_V376,'themeBuilderAiUsedV364','themeBuilderAutoToolV364'].forEach(markTouched);
      // If this theme already owns the requested variant, switching the button
      // is a live preview switch. Nothing is persisted until Save Theme.
      if (hasAiVariantV376(nextMode)) { applyStoredAiVariantV376(nextMode); return; }
      renderAI(); refreshAiJsonStateV325(); return;
    }
    if (type === 'ai-builder-depth-v432') {
      state.aiBuilderDepthV432 = action.dataset.value === 'advanced' ? 'advanced' : 'basic';
      state.draft.themeBuilderAiDepthV432 = state.aiBuilderDepthV432;
      try { localStorage.setItem('loggy-ai-builder-depth-v432', state.aiBuilderDepthV432); } catch {}
      markTouched('themeBuilderAiDepthV432'); renderAI(); return;
    }
    if (type === 'ai-background-focus-v479') {
      state.aiBackgroundFocusV479 = action.dataset.value === 'enhanced' ? 'enhanced' : 'standard';
      state.draft.themeBuilderAiBackgroundFocusV479 = state.aiBackgroundFocusV479;
      try { localStorage.setItem('loggy-ai-background-focus-v479', state.aiBackgroundFocusV479); } catch {}
      markTouched('themeBuilderAiBackgroundFocusV479'); renderAI(); return;
    }
    if (type === 'copy-ai-prompt') { copyText(aiThemePrompt(), 'AI theme prompt copied.'); return; }
    if (type === 'clear-ai-json') { state.aiJsonText=''; state.draft.themeBuilderAiJsonV364=''; state.draft.themeBuilderAiUsedV364=true; state.draft.themeBuilderAutoToolV364='ai'; ['themeBuilderAiJsonV364','themeBuilderAiUsedV364','themeBuilderAutoToolV364'].forEach(markTouched); state.aiJsonAppliedV325=aiVariantCountV376()>0; renderAI(); return; }
    if (type === 'apply-ai-theme') {
      let applied = false;
      try {
        const parsed = parseAiThemeBundleV376(state.aiJsonText);
        if (parsed?.variants?.[state.aiThemeMode]) applied = applyAiThemeJsonV312(state.aiJsonText) === true;
        else applied = applyStoredAiVariantV376(state.aiThemeMode) === true;
      } catch (error) {
        console.error('[Loggy Theme Builder] AI theme apply failed:', error);
        applied = false;
      }
      if (!applied) {
        state.aiJsonAppliedV325 = false;
        refreshAiJsonStateV325();
        setStatus(`Could not apply the AI ${state.aiThemeMode === 'dark' ? 'Dark' : 'Light'} version. The JSON parsed, but the theme could not be mounted.`);
        try { toast(`Could not apply the ${state.aiThemeMode === 'dark' ? 'Dark' : 'Light'} version.`); } catch {}
      }
      return;
    }
    if (type === 'copy-background-prompt') { copyText(backgroundPrompt(), 'Background prompt copied.'); return; }
    if (type === 'background-source') {
      const source = String(action.dataset.source || 'theme-color'); if (!BACKGROUND_SOURCES_V311.has(source)) return;
      state.draft.backgroundSourceV311 = source;
      state.draft.backgroundModeV158 = source === 'gradient' ? 'gradient' : source === 'image' ? 'image' : 'solid';
      markTouched('backgroundSourceV311'); markTouched('backgroundModeV158'); rememberAiSharedOverrideV400('backgroundSourceV311',state.draft.backgroundSourceV311); rememberAiSharedOverrideV400('backgroundModeV158',state.draft.backgroundModeV158); renderBackground(); schedulePreview(); return;
    }
    if (type === 'clear-background-code') { state.draft.interactiveBackgroundCodeV56 = ''; markTouched('interactiveBackgroundCodeV56'); rememberAiSharedOverrideV400('interactiveBackgroundCodeV56',''); renderBackground(); schedulePreview(); return; }
    if (type === 'gradient-preset') {
      const preset = gradientPresets()[+action.dataset.gradientIndex]; if (!preset) return;
      state.draft.backgroundSourceV311='gradient'; state.draft.backgroundModeV158='gradient'; state.draft.backgroundGradientV56=preset.css; state.draft.backgroundGradientNameV56=preset.name;
      ['backgroundSourceV311','backgroundModeV158','backgroundGradientV56','backgroundGradientNameV56'].forEach(key=>{markTouched(key);rememberAiSharedOverrideV400(key,state.draft[key]);}); renderBackground(); schedulePreview(); return;
    }
    if (type === 'choose-background') { $('[data-file="background"]', state.modal)?.click(); return; }
    if (type === 'clear-background') { state.draft.backgroundImage=''; state.draft.backgroundImageName=''; markTouched('backgroundImage'); markTouched('backgroundImageName'); rememberAiSharedOverrideV400('backgroundImage',''); rememberAiSharedOverrideV400('backgroundImageName',''); renderBackground(); schedulePreview(); return; }
    if (type === 'choose-audio') { $('[data-file="audio"]', state.modal)?.click(); return; }
    if (type === 'clear-audio') { clearThemeBuilderIntroSourceV414(); setStatus('Intro song removed.'); renderAudio(); schedulePreview(); return; }
    if (type === 'play-intro') { playThemeBuilderIntroPreviewV413(state.draft); return; }
    if (type === 'choose-hover-sounds') { $('[data-file="hover-sounds"]', state.modal)?.click(); return; }
    if (type === 'play-sound') { const item = normalizeAudioItem(state.draft.svgHoverSounds?.[+action.dataset.soundIndex], 'Hover Sound'); if (item?.url) playUrl(item.url, state.draft.audioVolume); return; }
    if (type === 'remove-sound') {
      const index = +action.dataset.soundIndex, list = [...(state.draft.svgHoverSounds || [])], removed = normalizeAudioItem(list[index],'Hover Sound'); list.splice(index,1); state.draft.svgHoverSounds=list; markTouched('svgHoverSounds'); rememberAiSharedOverrideV400('svgHoverSounds',state.draft.svgHoverSounds);
      if (removed?.url) (state.draft.backgroundSvgs || []).forEach(asset => { if (asset?.hoverSoundUrl === removed.url) { asset.hoverSoundUrl=''; asset.hoverSoundName=''; state.decorationsDirty=true; } });
      renderAudio(); renderDecorations(); return;
    }
    if (type === 'choose-decoration') { $('[data-file="decorations"]', state.modal)?.click(); return; }
    if (type === 'download-decoration-v429') {
      const index = +action.dataset.index, asset = state.draft.backgroundSvgs?.[index];
      if (!asset) return;
      downloadDecorationV429(asset,index).then(()=>setStatus(`Downloaded ${asset?.name || `Decoration ${index+1}`}.`)).catch(error=>{ console.warn(error); setStatus('Could not download that decoration.'); });
      return;
    }
    if (type === 'download-all-decorations-v429') { downloadAllDecorationsV429(); return; }
    if (type === 'remove-decoration') {
      const index = +action.dataset.index, list = [...(state.draft.backgroundSvgs || [])]; if (!Number.isInteger(index) || index<0 || index>=list.length) return;
      list.splice(index,1); state.draft.backgroundSvgs=list; state.decorationsDirty=true; markTouched('backgroundSvgs'); rememberAiSharedDecorationsV400(); renderDecorations(); schedulePreview(); return;
    }
    if (type === 'direction') {
      const index=+action.dataset.index, asset=state.draft.backgroundSvgs?.[index]; if (!asset) return;
      asset.crossDirectionV139 = action.dataset.direction === 'left' ? 'left' : 'right'; state.decorationsDirty=true; markTouched('backgroundSvgs'); rememberAiSharedDecorationsV400(); renderDecorations(); openDecorationDetails(index); schedulePreview(); return;
    }
    if (type === 'scale-step') {
      state.draft.svgGlobalScale = clamp((+state.draft.svgGlobalScale || 100) + (+action.dataset.delta || 0), 50, 220, 100); markTouched('svgGlobalScale');
      const range = $('[data-number-key="svgGlobalScale"]', state.modal); if (range) range.value=String(state.draft.svgGlobalScale); const output=$('[data-output-for="svgGlobalScale"]',state.modal); if(output) output.textContent=`${state.draft.svgGlobalScale}%`; schedulePreview(); return;
    }
    if (type === 'select-cursor') {
      const value=String(action.dataset.value||'default'); if (!state.draft.useThemeCursor) return; state.draft.themeCursorStyle=value; markTouched('themeCursorStyle'); renderTrinkets(); schedulePreview(); return;
    }
    if (type === 'select-companion') {
      const value=String(action.dataset.value||'none'); if (!state.draft.useThemeCompanion) return; state.draft.themeCompanion=value; state.draft.themeCompanionStyleV163=value;
      ['themeCompanion','themeCompanionStyleV163'].forEach(markTouched); renderTrinkets(); schedulePreview(); return;
    }
  }

  function openModal() {
    const modal=ensureModal(); state.modal=modal; modal.hidden=false; document.body.classList.add('theme-builder-open');
    requestAnimationFrame(() => { fitPreviewFrame(); try { modal.querySelector('[data-theme-key="name"]')?.focus({preventScroll:true}); } catch {} }); return modal;
  }

  function close() {
    stopAllThemeBuilderIntroPlaybackV414();
    if (!state.modal) return; state.modal.hidden=true; document.body.classList.remove('theme-builder-open');
    if (STUDIO) { try { parent.postMessage({ type:'dashboard-theme-studio-close-v43', studioSessionV283:studioSession(), studioActionV283:studioAction() }, location.origin); } catch {} }
  }

  async function fetchJson(url, timeout=4500) {
    const ctl = typeof AbortController === 'function' ? new AbortController() : null; const timer=setTimeout(()=>{try{ctl?.abort()}catch{}},timeout);
    try { const response=await fetch(url,{cache:'no-store',...(ctl?{signal:ctl.signal}:{})}); if(!response.ok)return null; return await response.json(); } catch{return null} finally{clearTimeout(timer)}
  }

  const INTRO_AUDIO_STATE_KEYS_V420 = new Set([
    'introAudio','introAudioName','introAudioProjectPath','introAudioSourceThemeIdV364',
    'audioPlayMode','audioStart','audioEnd','audioFade','audioVolume',
    'introAudioUpdatedAtV420','introAudioAuthorityV418','introAudioRemovedV423'
  ]);
  function hasSavedIntroAuthorityV420(themeId, draft = state.draft) {
    const id = String(themeId || '');
    if (id) {
      const authority = readIntroAuthorityMapV420()[id];
      if (authority && typeof authority === 'object') return true;
    }
    return draft?.introAudioRemovedV423 === true ||
      !!String(draft?.introAudioUpdatedAtV420 || draft?.introAudioAuthorityV418 || draft?.introAudio || '').trim();
  }
  function hydrateInheritedIntroV420(themeId, item) {
    if (!item?.url || state.touched.has('introAudio') || hasSavedIntroAuthorityV420(themeId, state.draft)) return false;
    state.introSelectionV416 = {
      url:String(item.url || ''),
      name:String(item.name || fileName(item.url,'Intro Audio')),
      projectPath:String(item.projectPath || ''),
      sourceThemeId:String(themeId || '')
    };
    writeIntroSelectionToThemeV416(state.draft, state.introSelectionV416);
    state.draft.introAudioRemovedV423 = false;
    try { rememberAiSharedOverrideV400('introAudioRemovedV423', false); } catch {}
    return true;
  }

  async function enrichBuiltIn(themeId, token) {
    const slug=themeSlug(themeId); if(!slug)return;
    const adapterPromise=fetchJson(`/themes/${encodeURIComponent(slug)}/theme-${encodeURIComponent(slug)}.builder.json`,4000);
    const assetsPromise=fetchJson(`/api/built-in-theme-assets/${encodeURIComponent(slug)}`,5000);
    const audioPromise=fetchJson(`/api/built-in-theme-audio-config/${encodeURIComponent(slug)}`,5000);

    adapterPromise.then(data=>{
      if(token!==state.openToken||state.themeId!==themeId||!data?.builder)return;
      const builder=data.builder||{};
      const savedIntroAuthority = hasSavedIntroAuthorityV420(themeId, state.draft);
      for(const [key,value] of Object.entries(builder)){
        if(key==='backgroundSvgs'||state.touched.has(key))continue;
        if(savedIntroAuthority&&INTRO_AUDIO_STATE_KEYS_V420.has(key))continue;
        state.draft[key]=clone(value);state.dashboardOverlayKeys.add(key)
      }
      const replacing=state.draft.replaceBuiltInDecorationsV30===true||state.draft.authoritativeDecorationsV136===true;
      if(!state.decorationsDirty&&!replacing&&Array.isArray(builder.backgroundSvgs)) state.draft.backgroundSvgs=mergeDecorations(builder.backgroundSvgs.map(item=>({...item,inheritedBuiltInV307:true})),state.draft.backgroundSvgs||[]);
      if(!state.touched.has('name')&&data.name)state.draft.name=data.name;
      if(!state.touched.has('backgroundSourceV311')) state.draft.backgroundSourceV311=inferBackgroundSourceV311(state.draft);
      renderAllControls();
    });

    assetsPromise.then(data=>{
      if(token!==state.openToken||state.themeId!==themeId)return;
      const replacing=state.draft.replaceBuiltInDecorationsV30===true||state.draft.authoritativeDecorationsV136===true;
      if(!state.decorationsDirty&&!replacing){const assets=(Array.isArray(data?.assets)?data.assets:[]).map(item=>normalizeDecoration(item,true)).filter(Boolean);state.draft.backgroundSvgs=mergeDecorations(state.draft.backgroundSvgs||[],assets)}
      if(Array.isArray(data?.audio)&&data.audio[0]?.url) hydrateInheritedIntroV420(themeId, normalizeAudioItem(data.audio[0],'Intro Audio'));
      renderAudio();renderDecorations();schedulePreview();
    });

    audioPromise.then(data=>{
      if(token!==state.openToken||state.themeId!==themeId||!data)return;
      const intro=normalizeAudioItem(data.introAudio,'Intro Audio');
      hydrateInheritedIntroV420(themeId, intro);
      if(!state.touched.has('svgHoverSounds')) state.draft.svgHoverSounds=mergeSounds(state.draft.svgHoverSounds||[],data.hoverSounds||[]);
      renderAudio();renderDecorations();schedulePreview();
    });
  }

  function preparePreviewForThemeOpenV354(modal) {
    if (!modal) return;
    state.previewResetViewV354 = true;
    const loading = $('.tb307-preview-loading', modal);
    if (loading) { loading.hidden = false; loading.textContent = 'Loading selected theme…'; }

    const frame = $('.tb307-frame', modal);
    if (!frame) return;
    state.previewFrame = frame;

    // If the reusable preview was navigated to Dashboard during the previous
    // edit session, reset only this iframe back to the Log preview host. The
    // rest of Loggy never reloads.
    let currentPath = '';
    try { currentPath = String(frame.contentWindow?.location?.pathname || ''); } catch {}
    if (frame.getAttribute('src') && currentPath && currentPath !== '/theme-studio-host') {
      state.previewReady = false;
      frame.src = previewUrl();
    }
  }

  function begin(draft, meta) {
    state.mode=meta.mode;state.kind=meta.kind;state.themeId=meta.themeId||'';state.sourceThemeId=meta.sourceThemeId||'';state.dashboardOverlayKeys=new Set(meta.dashboardOverlayKeys||[]);state.draft={...blankDraft(),...clone(draft)};state.aiJsonAppliedV325=false;
    if (state.draft.themeBuilderHeadingBackdropOverrideV496) applyHeadingBackdropAuthorityV496(state.draft);
    if (state.draft.themeBuilderQuizBackdropOverrideV492) applyQuizBackdropAuthorityV492(state.draft);
    // V416: opening a new edit session invalidates every pending source request
    // from the previous one and snapshots the canonical song as save authority.
    state.introSourceRevisionV416 = Number(state.introSourceRevisionV416 || 0) + 1;
    // V423 migration: V420 already used an empty intro + saved timestamp to mean
    // "removed". Persist that meaning as a real tombstone so the source theme's
    // discovered built-in song can never refill the editor on reopen.
    if (
      state.draft.introAudioRemovedV423 === true ||
      (!String(state.draft.introAudio || '').trim() &&
       !!String(state.draft.introAudioUpdatedAtV420 || state.draft.introAudioAuthorityV418 || '').trim())
    ) {
      state.draft.introAudioRemovedV423 = true;
      state.draft.introAudio = '';
      state.draft.introAudioName = '';
      state.draft.introAudioProjectPath = '';
      state.draft.introAudioSourceThemeIdV364 = '';
      LEGACY_INTRO_KEYS_V414.forEach(key => { state.draft[key] = ''; });
    }
    state.introSelectionV416 = introSelectionFromThemeV416(state.draft);
    writeIntroSelectionToThemeV416(state.draft,state.introSelectionV416);
    stopAllThemeBuilderIntroPlaybackV414();
    state.draft.backgroundSourceV311=inferBackgroundSourceV311(state.draft);
    state.draft.pageBackdropsEnabledV312=inferPageBackdropsEnabledV312(state.draft);
    state.draft.shapeTypeEnabledV312=inferShapeTypeEnabledV312(state.draft);
    state.draft.backgroundSvgs=mergeDecorations(state.draft.backgroundSvgs||[]);state.draft.svgHoverSounds=mergeSounds(state.draft.svgHoverSounds||[]);
    // V371: initialize the preview from the saved global animation immediately.
    // Legacy `asset.animation` is synchronized before the iframe ever sees the
    // draft; explicit per-decoration overrides remain untouched.
    const openDefaultV371=String(state.draft.svgDefaultAnimation||'float').trim()||'float';
    const openingAiV404=state.draft.themeBuilderAiUsedV364===true||String(state.draft.themeBuilderAutoToolV364||'')==='ai'||!!state.draft.themeBuilderAiVariantsV376;
    state.draft.backgroundSvgs=(state.draft.backgroundSvgs||[]).map(asset=>{
      const a={...(asset||{})};
      const raw=String(a.animationOverride||'').trim();
      const override=openingAiV404&&a.animationOverrideUserSetV404!==true?'':raw;
      a.animationOverride=override;a.animation=override||openDefaultV371;return a;
    });
    state.original=clone(state.draft);state.touched=new Set();state.decorationsDirty=false;
    state.aiSharedOverridesV400=Object.create(null); state.aiSharedDecorationsV400=null;
    state.aiJsonText=String(state.draft.themeBuilderAiJsonV364||'');
    state.smartPaletteSeed=safeHex(state.draft.accent,'#8b6fd8');state.smartPaletteMode=inferAppearanceV323(state.draft);
    state.aiThemeMode=String(state.draft[AI_SELECTED_KEY_V376]||state.draft.themeBuilderAiModeV364||state.smartPaletteMode)==='dark'?'dark':'light';
    let savedDepthV432=''; let savedBackgroundV479='';
    try { savedDepthV432=localStorage.getItem('loggy-ai-builder-depth-v432')||''; savedBackgroundV479=localStorage.getItem('loggy-ai-background-focus-v479')||''; } catch {}
    state.aiBuilderDepthV432=String(state.draft.themeBuilderAiDepthV432||savedDepthV432)==='advanced'?'advanced':'basic';
    state.aiBackgroundFocusV479=String(state.draft.themeBuilderAiBackgroundFocusV479||savedBackgroundV479)==='enhanced'?'enhanced':'standard';
    state.aiDecorationModeV432='decorations';
    state.aiVariantsV376=normalizeStoredAiVariantsV376(state.draft);
    const parsedSavedBundleV376=parseAiThemeBundleV376(state.aiJsonText);
    if(!state.aiVariantsV376.light&&parsedSavedBundleV376?.variants?.light)state.aiVariantsV376.light=stripAiVariantMetaV376(parsedSavedBundleV376.variants.light);
    if(!state.aiVariantsV376.dark&&parsedSavedBundleV376?.variants?.dark)state.aiVariantsV376.dark=stripAiVariantMetaV376(parsedSavedBundleV376.variants.dark);
    // Migrate old single-version AI themes into the new persistent variant slot.
    if(state.draft.themeBuilderAiUsedV364===true&&aiVariantCountV376()===0)state.aiVariantsV376[state.aiThemeMode]=stripAiVariantMetaV376(state.draft);
    if(aiVariantCountV376()>0) {
      state.aiSharedDecorationsV400=clone(state.draft.backgroundSvgs||[]);
      // V416 migration: intro audio is one theme-level source. Seed the shared
      // behavior layer from the canonical top-level selection so switching
      // Light/Dark can never reveal an older per-variant song.
      for (const key of INTRO_SOURCE_KEYS_V414) state.aiSharedOverridesV400[key]=clone(state.draft[key]||'');
      // V491: restore manual theme-level backdrop authority when reopening an
      // AI theme. Without this, an older variant snapshot (often #ffffff) could
      // win as soon as Light/Dark was restored even though the top-level theme
      // had the user's saved Quiz Box Backdrop color.
      for (const key of [
        'headingBackgroundEnabledV429','headingBackgroundColorV452','headingBackgroundOpacityV452','headingBackgroundPaddingV429','headingBackgroundRadiusV452','themeBuilderHeadingBackdropOverrideV496',
        'quizBackdropEnabledV456','quizBackdropColorV456','quizBackdropOpacityV456','quizBackdropRadiusV456','quizBackdropPaddingV459','themeBuilderQuizBackdropOverrideV492'
      ]) {
        if (Object.prototype.hasOwnProperty.call(state.draft,key)) state.aiSharedOverridesV400[key]=clone(state.draft[key]);
      }
      propagateAiSharedStateToVariantsV400();
      for (const mode of ['light','dark']) {
        const variant=state.aiVariantsV376?.[mode];
        if(variant&&typeof variant==='object'&&!Array.isArray(variant)) writeIntroSelectionToThemeV416(variant,state.introSelectionV416);
      }
    }
    state.autoThemeTool=(state.draft.themeBuilderAiUsedV364===true||aiVariantCountV376()>0)?'ai':(String(state.draft.themeBuilderAutoToolV364||'')==='smart'?'smart':'');
    state.aiJsonAppliedV325=aiVariantCountV376()>0;
    clearDecorationOpacityLockV493();
    state.openToken+=1;
    const modal=openModal();preparePreviewForThemeOpenV354(modal);renderAllControls();selectTab('colors',false);setStatus('');return{modal,token:state.openToken};
  }
  function openCreate(){const draft=blankDraft();draft.name='My Custom Theme';draft.radius=20;draft.shadow=0;draft.audioFade=true;draft.shapeTypeEnabledV312=true;begin(draft,{mode:'create',kind:'new',themeId:'',sourceThemeId:'',dashboardOverlayKeys:[]});return state.modal}
  function openEdit(themeIdValue,themeName=''){const themeId=String(themeIdValue||'default'),resolved=resolveImmediate(themeId,themeName);const{token}=begin(resolved.draft,{mode:'edit',kind:resolved.kind,themeId,sourceThemeId:resolved.sourceThemeId||'',dashboardOverlayKeys:resolved.dashboardOverlayKeys||[]});if(resolved.kind==='built-in')enrichBuiltIn(themeId,token);return state.modal}

  function cleanDraftForSave() {
    // V416: the latest explicit intro selection is authoritative over every old
    // draft/variant/legacy alias before any AI variant snapshot is taken.
    commitIntroSelectionEverywhereV416();
    if(aiVariantCountV376()>0){ rememberAiSharedDecorationsV400(); syncActiveAiVariantV376(); propagateAiSharedStateToVariantsV400(); commitIntroSelectionEverywhereV416(); }
    const draft=canonicalThemeDraftV312(state.draft);draft.name=String(draft.name||'Theme').trim()||'Theme';
    draft.themeBuilderAiDepthV432=state.aiBuilderDepthV432==='advanced'?'advanced':'basic';
    draft.themeBuilderAiBackgroundFocusV479=state.aiBackgroundFocusV479==='enhanced'?'enhanced':'standard';
    draft.themeBuilderAiDecorationModeV432='decorations';
    draft.aiDecorationsModeV432='decorations';
    writeIntroSelectionToThemeV416(draft,state.introSelectionV416);
    if(aiVariantCountV376()>0){
      draft[AI_VARIANTS_KEY_V376]=clone(state.aiVariantsV376);
      draft[AI_SELECTED_KEY_V376]=state.aiThemeMode==='dark'?'dark':'light';
      draft.themeBuilderAiModeV364=draft[AI_SELECTED_KEY_V376];
      draft.themeBuilderAiUsedV364=true;
      draft.themeBuilderAutoToolV364='ai';
      draft.themeBuilderAiJsonV364=state.aiJsonText;
    }
    draft.backgroundSvgs=mergeDecorations(draft.backgroundSvgs||[]);
    // V371 migration: `animation` is a legacy compatibility field, not a
    // second source of truth. Keep it synchronized with the explicit override
    // or the current global default so no older renderer can resurrect the
    // previous default a moment after the authoritative runtime starts.
    const currentDefault=String(draft.svgDefaultAnimation||'float').trim()||'float';
    const previousDefault=String(state.original?.svgDefaultAnimation||'').trim();
    const rows=draft.backgroundSvgs||[];
    const mirroredOld=!!previousDefault&&previousDefault!==currentDefault&&rows.length>0&&rows.every(a=>{
      const ov=String(a?.animationOverride||'').trim();
      return !ov||ov===previousDefault;
    });
    const savingAiV404=draft.themeBuilderAiUsedV364===true||String(draft.themeBuilderAutoToolV364||'')==='ai'||!!draft.themeBuilderAiVariantsV376;
    draft.backgroundSvgs=rows.map(asset=>{
      const a={...asset};
      if(savingAiV404&&a.animationOverrideUserSetV404!==true)a.animationOverride='';
      else if(mirroredOld&&String(a.animationOverride||'').trim()===previousDefault)a.animationOverride='';
      a.animation=String(a.animationOverride||'').trim()||currentDefault;
      return a;
    });
    draft.svgHoverSounds=mergeSounds(draft.svgHoverSounds||[]);
    if(state.kind==='built-in'&&!state.decorationsDirty){
      draft.backgroundSvgs=(draft.backgroundSvgs||[]).filter(item=>!item?.inheritedBuiltInV307&&!item?.inheritedBuiltInV306&&!item?.inheritedBuiltInV109&&!item?.inheritedBuiltInV30&&!item?.inheritedBuiltInV303);
      draft.replaceBuiltInDecorationsV30=false;
    }else if(state.kind==='built-in'&&state.decorationsDirty){
      draft.backgroundSvgs=(draft.backgroundSvgs||[]).map(item=>{const out=clone(item);delete out.inheritedBuiltInV307;delete out.inheritedBuiltInV306;delete out.inheritedBuiltInV109;delete out.inheritedBuiltInV30;delete out.inheritedBuiltInV303;return out});
      draft.replaceBuiltInDecorationsV30=true;draft.authoritativeDecorationsV136=true;
    }else{
      draft.backgroundSvgs=(draft.backgroundSvgs||[]).map(item=>{const out=clone(item);delete out.inheritedBuiltInV307;delete out.inheritedBuiltInV306;delete out.inheritedBuiltInV109;delete out.inheritedBuiltInV30;delete out.inheritedBuiltInV303;return out});
    }
    // V407: one persisted motion clock + one frozen placement map are shared by
    // Preview, applied Log pages and Dashboard. Across Screen therefore continues
    // from the same phase when navigating instead of restarting per page load.
    draft.decorationMotionEpochV407 = Date.now();
    stampDecorationLayoutV405(draft);
    // Save the final canonicalized active appearance back into its slot after
    // built-in decoration cleanup, then embed both slots in the theme record.
    if(aiVariantCountV376()>0){
      state.aiSharedDecorationsV400=clone(draft.backgroundSvgs||[]);
      state.aiSharedOverridesV400 ||= Object.create(null);
      state.aiSharedOverridesV400.resolvedDecorationPlacementsV405=clone(draft.resolvedDecorationPlacementsV405||[]);
      state.aiSharedOverridesV400.decorationPlacementEngineV410='log-v26';
      state.aiVariantsV376[state.aiThemeMode==='dark'?'dark':'light']=stripAiVariantMetaV376(draft);
      propagateAiSharedStateToVariantsV400();
      for (const mode of ['light','dark']) {
        const variant = state.aiVariantsV376?.[mode];
        if (variant && typeof variant === 'object' && !Array.isArray(variant)) writeIntroSelectionToThemeV416(variant,state.introSelectionV416);
      }
      writeIntroSelectionToThemeV416(draft,state.introSelectionV416);
      draft[AI_VARIANTS_KEY_V376]=clone(state.aiVariantsV376);
      draft[AI_SELECTED_KEY_V376]=state.aiThemeMode==='dark'?'dark':'light';
    }
    return draft;
  }

  async function persistBuiltIn(themeId,draft,stamp){
    const map=readJsonStorage(OVERRIDE_KEY,{});map[themeId]={id:themeId,name:draft.name,theme:clone(draft),updatedAt:String(stamp||new Date().toISOString())};writeJsonStorage(OVERRIDE_KEY,map);
    fetch('/api/built-in-theme-overrides',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({overrides:map})}).catch(()=>{});
    try{if(db?.settings)db.settings.theme=themeId;await saveDb?.()}catch{}try{renderThemePicker?.()}catch{}return themeId;
  }
  function makeThemeId(){return`theme-custom-builder-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,8)}`}
  async function pushSharedLibraryNowV408(library){
    try{
      const response=await fetch('/api/shared-themes',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({themes:Array.isArray(library)?library:[]})});
      return !!response?.ok;
    }catch{return false}
  }
  async function persistShared(id,draft,sourceThemeId='',stamp=''){
    const list=readJsonStorage(SHARED_KEY,[]),library=Array.isArray(list)?list:[];const selectedVariant=String(draft?.[AI_SELECTED_KEY_V376]||draft?.themeBuilderAiModeV364||'').toLowerCase()==='dark'?'dark':'light';const entry={id,name:draft.name,sourceThemeId:sourceThemeId||'',selectedVariant,activeVariant:selectedVariant,theme:clone(draft),updatedAt:String(stamp||new Date().toISOString())};
    const index=library.findIndex(item=>String(item?.id||'')===id);if(index>=0)library[index]=entry;else library.push(entry);
    writeJsonStorage(SHARED_KEY,library);
    // V408: saving a theme is a committed transaction, not a debounced best-effort
    // mirror. Wait for the project copy to receive the exact freshly-saved record
    // before the Builder closes or navigation can start another sync owner.
    await pushSharedLibraryNowV408(library);
    return id;
  }
  // Save-time intro authority is consolidated in commitSavedAudioAuthorityV420.
  async function commitSavedAudioAuthorityV420(savedId, draft, saveStamp='') {
    const id=String(savedId || ''); if (!id || !draft) return;
    const stamp=String(saveStamp || new Date().toISOString());
    const authority=audioAuthorityFromThemeV420(draft,stamp);
    const map=readIntroAuthorityMapV420();
    map[id]=authority;
    writeIntroAuthorityMapV420(map);
    writeAudioAuthorityToThemeV420(draft,authority);
    draft.introAudioAuthorityV418=stamp;

    // Shared library + both appearances.
    let library=readJsonStorage(SHARED_KEY,[]);
    if(Array.isArray(library)){
      const i=library.findIndex(row=>String(row?.id||'')===id);
      if(i>=0){
        const row={...library[i],updatedAt:stamp,theme:clone(library[i]?.theme||{})};
        writeAudioAuthorityToThemeV420(row.theme,authority);row.theme.introAudioAuthorityV418=stamp;
        const variants=row.theme?.[AI_VARIANTS_KEY_V376];
        if(variants&&typeof variants==='object'&&!Array.isArray(variants)){
          for(const mode of ['light','dark']) if(variants[mode]&&typeof variants[mode]==='object'){writeAudioAuthorityToThemeV420(variants[mode],authority);variants[mode].introAudioAuthorityV418=stamp;}
        }
        library[i]=row; writeJsonStorage(SHARED_KEY,library); await pushSharedLibraryNowV408(library);
      }
    }

    // Legacy mirrors must carry the same authority, never an older intro.
    try{
      const copies=db?.settings?.themeCopiesV30;
      const copy=Array.isArray(copies)?copies.find(item=>String(item?.id||'')===id):null;
      if(copy?.theme){writeAudioAuthorityToThemeV420(copy.theme,authority);copy.theme.introAudioAuthorityV418=stamp;copy.updatedAt=stamp;copy.sharedV40=true;}
      if(id==='theme-custom-builder'&&db?.settings){db.settings.customTheme={...(db.settings.customTheme||{}),...clone(draft)};writeAudioAuthorityToThemeV420(db.settings.customTheme,authority);db.settings.customTheme.introAudioAuthorityV418=stamp;}
      await saveDb?.();
    }catch{}
    try{
      const overrides=readJsonStorage(OVERRIDE_KEY,{});
      if(overrides?.[id]){
        const row=overrides[id]?.theme?overrides[id]:{id,name:draft.name,theme:clone(overrides[id]||{})};
        writeAudioAuthorityToThemeV420(row.theme,authority);row.theme.introAudioAuthorityV418=stamp;row.updatedAt=stamp;overrides[id]=row;writeJsonStorage(OVERRIDE_KEY,overrides);
        await fetch('/api/built-in-theme-overrides',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({overrides})}).catch(()=>{});
      }
    }catch{}
  }

  async function persistCopy(themeId,draft,stamp=''){
    let copyTheme=null;try{copyTheme=getThemeCopyV30?.(themeId)}catch{}if(!copyTheme)return persistShared(themeId||makeThemeId(),draft,state.sourceThemeId,stamp);
    copyTheme.name=draft.name;copyTheme.theme=clone(draft);try{await saveDb?.()}catch{}try{publishSharedThemeV40?.({id:copyTheme.id||themeId,name:copyTheme.name,theme:copyTheme.theme,sourceThemeId:copyTheme.sourceThemeId||state.sourceThemeId||''})}catch{}return copyTheme.id||themeId;
  }
  async function persistCustom(draft){
    try{if(!db.settings)db.settings={};db.settings.customTheme={...blankDraft(),...clone(draft)};db.settings.customThemeDeleted=false;db.settings.customThemePermanentlyDeletedV31=false;db.settings.theme='theme-custom-builder';await saveDb?.();renderThemePicker?.()}catch{}return'theme-custom-builder';
  }

  function ensureSavedThemeVisibleV378(savedId,draft,sourceThemeId=''){
    const id=String(savedId||'').trim(); if(!id)return;
    const name=String(draft?.name||'Theme').trim()||'Theme';
    // The visible Log theme gallery is ultimately rendered from dailyThemeSelect,
    // while newer Builder saves are stored in the shared-theme library. Keep both
    // representations synchronized immediately so a just-created AI theme cannot
    // exist in storage without appearing in the picker until reload.
    try{
      if(dailyThemeSelect){
        let option=Array.from(dailyThemeSelect.options||[]).find(o=>String(o.value)===id);
        if(!option){option=document.createElement('option');option.value=id;dailyThemeSelect.appendChild(option)}
        option.textContent=name;
      }
    }catch{}
    try{
      if(!db.settings)db.settings={};
      const copies=typeof ensureThemeCopiesV30==='function'?ensureThemeCopiesV30():(db.settings.themeCopiesV30||=[]);
      let copy=Array.isArray(copies)?copies.find(item=>String(item?.id||'')===id):null;
      if(copy){copy.name=name;copy.theme=clone(draft);copy.sourceThemeId=sourceThemeId||copy.sourceThemeId||''}
      else if(Array.isArray(copies))copies.push({id,name,sourceThemeId:sourceThemeId||'',theme:clone(draft),createdAt:new Date().toISOString()});
    }catch{}
    try{syncThemeCopyOptionsV30?.()}catch{}
    try{syncSharedThemesIntoLogV40?.()}catch{}
    try{renderThemePicker?.()}catch{}
  }

  async function syncSavedThemeIdentityV364(savedId,draft,saveStamp=''){
    const id=String(savedId||''); if(!id)return; const name=String(draft?.name||'Theme').trim()||'Theme'; const stamp=String(saveStamp||new Date().toISOString());
    try{
      const shared=readJsonStorage(SHARED_KEY,[]);
      if(Array.isArray(shared)){const i=shared.findIndex(item=>String(item?.id||'')===id);if(i>=0){const selectedVariant=String(draft?.[AI_SELECTED_KEY_V376]||draft?.themeBuilderAiModeV364||'').toLowerCase()==='dark'?'dark':'light';shared[i]={...shared[i],name,selectedVariant,activeVariant:selectedVariant,theme:{...(shared[i]?.theme||{}),...clone(draft),name},updatedAt:stamp};writeJsonStorage(SHARED_KEY,shared);}}
    }catch{}
    try{
      const copies=db?.settings?.themeCopiesV30;
      if(Array.isArray(copies)){const copy=copies.find(item=>String(item?.id||'')===id);if(copy){copy.name=name;copy.theme={...(copy.theme||{}),...clone(draft),name};}}
    }catch{}
    try{if(id==='theme-custom-builder'&&db?.settings?.customTheme){db.settings.customTheme={...db.settings.customTheme,...clone(draft),name};}}catch{}
    try{ensureSavedThemeVisibleV378(id,draft,state.sourceThemeId||'')}catch{}
    try{await saveDb?.()}catch{}
    try{syncSharedThemesIntoLogV40?.()}catch{}
    try{renderThemePicker?.()}catch{}
  }

  async function saveCurrent(){
    const button=$('.tb307-save',state.modal);if(button?.disabled)return;if(button)button.disabled=true;setStatus('Saving…');
    stopAllThemeBuilderIntroPlaybackV414();
    commitIntroSelectionEverywhereV416();
    // The visible control is authoritative. This closes a stale-state path where
    // a prior edit session could be serialized even though the dropdown showed
    // the newly selected animation.
    const liveDefault=$('[data-theme-key="svgDefaultAnimation"]',state.modal);
    if(liveDefault?.value){
      const selectedDefault=String(liveDefault.value||'float').trim()||'float';
      state.draft.svgDefaultAnimation=selectedDefault;
      markTouched('svgDefaultAnimation');
      // V408: the visible Default Animation control is the save authority. Persist
      // it into the AI shared-state layer BEFORE cleanDraftForSave() snapshots the
      // Light/Dark variants, otherwise an older shared value can win the save.
      rememberAiSharedOverrideV400('svgDefaultAnimation',selectedDefault);
      const rows=Array.isArray(state.draft.backgroundSvgs)?state.draft.backgroundSvgs:[];
      rows.forEach(asset=>{
        if(!asset||typeof asset!=='object')return;
        const override=asset.animationOverrideUserSetV404===true?String(asset.animationOverride||'').trim():'';
        if(asset.animationOverrideUserSetV404!==true)asset.animationOverride='';
        asset.animation=override||selectedDefault;
      });
      rememberAiSharedDecorationsV400();
      if(aiVariantCountV376()>0){
        syncActiveAiVariantV376();
        propagateAiSharedStateToVariantsV400();
      }
    }
    // V427: the visible Audio Volume slider is the save authority. Do not rely
    // only on an earlier input/change event having updated state.draft; historical
    // Theme Builder wrappers can repaint the Audio panel while a drag is ending.
    // Read the live control immediately before serialization so the exact number
    // the user sees is what every persistence mirror receives.
    const liveAudioVolumeV427 = $('[data-number-key="audioVolume"]', state.modal);
    if (liveAudioVolumeV427) {
      const rawAudioVolumeV427 = Number(liveAudioVolumeV427.value);
      if (Number.isFinite(rawAudioVolumeV427)) {
        state.draft.audioVolume = clamp(rawAudioVolumeV427, 0, 100, 35);
        markTouched('audioVolume');
        rememberAiSharedOverrideV400('audioVolume', state.draft.audioVolume);
      }
    }

    // V431: all visible playback controls are a single save transaction.
    // This prevents a repainted Audio panel from saving Full/00:20 while the UI
    // visibly says Segment/00:05.
    const liveAudioModeV431 = $('[data-theme-key="audioPlayMode"]', state.modal);
    const liveAudioStartV431 = $('[data-theme-key="audioStart"]', state.modal);
    const liveAudioEndV431 = $('[data-theme-key="audioEnd"]', state.modal);
    const liveAudioFadeV431 = $('[data-bool-key="audioFade"]', state.modal);
    if (liveAudioModeV431) {
      state.draft.audioPlayMode = String(liveAudioModeV431.value || 'full') === 'segment' ? 'segment' : 'full';
      markTouched('audioPlayMode'); rememberAiSharedOverrideV400('audioPlayMode', state.draft.audioPlayMode);
    }
    if (liveAudioStartV431) {
      state.draft.audioStart = String(liveAudioStartV431.value || '00:00').trim() || '00:00';
      markTouched('audioStart'); rememberAiSharedOverrideV400('audioStart', state.draft.audioStart);
    }
    if (liveAudioEndV431) {
      state.draft.audioEnd = String(liveAudioEndV431.value || '00:20').trim() || '00:20';
      markTouched('audioEnd'); rememberAiSharedOverrideV400('audioEnd', state.draft.audioEnd);
    }
    if (liveAudioFadeV431) {
      state.draft.audioFade = !!liveAudioFadeV431.checked;
      markTouched('audioFade'); rememberAiSharedOverrideV400('audioFade', state.draft.audioFade);
    }

    // V495: state.draft is the save authority. Every live duplicate control is
    // synchronized on input above, so never read a possibly stale first DOM copy
    // here (that was what reset Heading/Quiz backdrop values back to white).
    state.draft.headingBackgroundEnabledV429 = state.draft.headingBackgroundEnabledV429 === true;
    state.draft.headingBackgroundColorV452 = safeHex(state.draft.headingBackgroundColorV452, state.draft.surface || '#ffffff');
    state.draft.headingBackgroundOpacityV452 = clamp(state.draft.headingBackgroundOpacityV452, 0, 100, 88);
    state.draft.headingBackgroundPaddingV429 = clamp(state.draft.headingBackgroundPaddingV429, 0, 40, 10);
    state.draft.headingBackgroundRadiusV452 = clamp(state.draft.headingBackgroundRadiusV452, 0, 40, 10);
    state.draft.pageBackdropColorV452 = safeHex(state.draft.pageBackdropColorV452, state.draft.surface || '#ffffff');
    state.draft.pageBackdropOpacityV452 = clamp(state.draft.pageBackdropOpacityV452, 0, 100, 92);
    state.draft.quizBackdropEnabledV456 = state.draft.quizBackdropEnabledV456 === true;
    state.draft.quizBackdropColorV456 = safeHex(state.draft.quizBackdropColorV456, state.draft.contentBackdropColor || state.draft.surface || '#ffffff');
    state.draft.quizBackdropOpacityV456 = clamp(state.draft.quizBackdropOpacityV456, 0, 100, 92);
    state.draft.quizBackdropRadiusV456 = clamp(state.draft.quizBackdropRadiusV456, 0, 40, 10);
    state.draft.quizBackdropPaddingV459 = clamp(state.draft.quizBackdropPaddingV459, 0, 40, 16);
    applyHeadingBackdropAuthorityV496(state.draft, currentHeadingBackdropAuthorityV496(state.draft));
    markTouched('themeBuilderHeadingBackdropOverrideV496');
    rememberHeadingBackdropAuthorityV496();
    applyQuizBackdropAuthorityV492(state.draft, currentQuizBackdropAuthorityV492(state.draft));
    markTouched('themeBuilderQuizBackdropOverrideV492');
    rememberQuizBackdropAuthorityV492();
    // V459: Heading Backdrop manual controls are theme-level overrides. Persist them
    // into BOTH AI appearances so reopening Edit Theme cannot restore an older
    // per-variant white value after the user saved another color.
    ['headingBackgroundEnabledV429','headingBackgroundColorV452','headingBackgroundOpacityV452','headingBackgroundPaddingV429','headingBackgroundRadiusV452'].forEach(key => {
      rememberAiSharedOverrideV400(key, state.draft[key]);
    });
    // V491: Quiz Box Backdrop is also a theme-level manual override. Keep the
    // exact saved values synchronized into BOTH AI variants so switching or
    // reopening the theme cannot resurrect an older white per-variant value.
    ['quizBackdropEnabledV456','quizBackdropColorV456','quizBackdropOpacityV456','quizBackdropRadiusV456','quizBackdropPaddingV459'].forEach(key => {
      rememberAiSharedOverrideV400(key, state.draft[key]);
    });

    state.draft.dailyLogBackgroundColor = safeHex(state.draft.pageBackdropColorV452, state.draft.dailyLogBackgroundColor || state.draft.surface || '#ffffff');
    state.draft.contentBackdropColor = state.draft.dailyLogBackgroundColor;
    state.draft.dailyLogBackgroundOpacity = clamp(state.draft.pageBackdropOpacityV452,0,100,92);
    state.draft.contentBackdropOpacity = state.draft.dailyLogBackgroundOpacity;

    const draft=cleanDraftForSave();
    draft.audioVolume=clamp(state.draft.audioVolume,0,100,35);
    draft.audioPlayMode=String(state.draft.audioPlayMode||draft.audioPlayMode||'full')==='segment'?'segment':'full';
    draft.audioStart=String(state.draft.audioStart??draft.audioStart??'00:00');
    draft.audioEnd=String(state.draft.audioEnd??draft.audioEnd??'00:20');
    draft.audioFade=state.draft.audioFade!==false;
    draft.headingBackgroundEnabledV429=state.draft.headingBackgroundEnabledV429===true;
    draft.headingBackgroundPaddingV429=clamp(state.draft.headingBackgroundPaddingV429,0,40,10);
    draft.headingBackgroundColorV452=safeHex(state.draft.headingBackgroundColorV452,draft.surface||'#ffffff');
    draft.headingBackgroundOpacityV452=clamp(state.draft.headingBackgroundOpacityV452,0,100,88);
    draft.headingBackgroundRadiusV452=clamp(state.draft.headingBackgroundRadiusV452,0,40,10);
    applyHeadingBackdropAuthorityV496(draft, currentHeadingBackdropAuthorityV496(state.draft));
    draft.pageBackdropColorV452=safeHex(state.draft.pageBackdropColorV452,draft.surface||'#ffffff');
    draft.pageBackdropOpacityV452=clamp(state.draft.pageBackdropOpacityV452,0,100,92);
    draft.quizBackdropEnabledV456=state.draft.quizBackdropEnabledV456===true;
    draft.quizBackdropColorV456=safeHex(state.draft.quizBackdropColorV456,draft.contentBackdropColor||draft.surface||'#ffffff');
    draft.quizBackdropOpacityV456=clamp(state.draft.quizBackdropOpacityV456,0,100,92);
    draft.quizBackdropRadiusV456=clamp(state.draft.quizBackdropRadiusV456,0,40,Number(draft.radius)||10);
    draft.quizBackdropPaddingV459=clamp(state.draft.quizBackdropPaddingV459,0,40,16);
    applyQuizBackdropAuthorityV492(draft, currentQuizBackdropAuthorityV492(state.draft));
    draft.dailyLogBackgroundColor=draft.pageBackdropColorV452;
    draft.contentBackdropColor=draft.pageBackdropColorV452;
    draft.dailyLogBackgroundOpacity=draft.pageBackdropOpacityV452;
    draft.contentBackdropOpacity=draft.pageBackdropOpacityV452;
    draft.svgDefaultAnimation=String(state.draft.svgDefaultAnimation||draft.svgDefaultAnimation||'float').trim()||'float';

    // V377: AI-generated cursors must be finalized BEFORE persistence. The AI
    // preview registers the safe cursor spec, but older save paths could persist
    // customCursorV161 without the generated themeCursorStyle/customCursorModeId.
    // Re-registering here makes the saved theme self-consistent and gives the
    // runtime a concrete cursor ID to activate immediately after Save Theme.
    if(draft.customCursorV161&&typeof draft.customCursorV161==='object'){
      try{window.__loggyThemeAiV161?.registerCursor?.(draft,draft.name)}catch{}
      if(draft.customCursorModeIdV161&&!draft.themeCursorStyle)draft.themeCursorStyle=draft.customCursorModeIdV161;
      const hiddenCursorIdsV382=new Set(readJsonStorage('loggy-hidden-cursors-v163',[]).map(String));
      if(draft.themeCursorStyle&&draft.themeCursorStyle!=='default'&&!hiddenCursorIdsV382.has(String(draft.themeCursorStyle))){draft.useThemeCursor=true;draft.themeCursorTrailEnabledV161=draft.themeCursorTrailEnabledV161!==false}
      else if(hiddenCursorIdsV382.has(String(draft.themeCursorStyle||draft.customCursorModeIdV161||''))){draft.useThemeCursor=false;draft.themeCursorStyle='default';draft.customCursorModeIdV161='';delete draft.customCursorDependencyV161;}
    }
    // V443: prime the exact finalized intro inside the user's Save click before
    // any persistence awaits. The final apply adopts this same Audio element,
    // matching the Dashboard's working gesture-prime -> async apply -> play flow.
    try { window.__loggyLogIntroAudioV443?.prime?.(draft || {}); } catch {}

    const saveStamp = new Date().toISOString();
    const pendingAudioAuthority = audioAuthorityFromThemeV420(draft, saveStamp);
    writeAudioAuthorityToThemeV420(draft, pendingAudioAuthority);
    draft.introAudioAuthorityV418 = saveStamp;
    let savedId=state.themeId;
    try{
      if(STUDIO){
        const requested=studioThemeId(),action=studioAction(),shared=readJsonStorage(SHARED_KEY,[]),existing=Array.isArray(shared)?shared.find(item=>String(item?.id||'')===requested):null;
        const builtIn=action==='edit'&&requested&&!existing&&requested!=='theme-custom-builder'&&!requested.startsWith('theme-custom-builder-');
        if(builtIn)savedId=await persistBuiltIn(requested,draft,saveStamp);else{savedId=existing?.id||(action==='edit'&&requested.startsWith('theme-custom-builder')?requested:makeThemeId());await persistShared(savedId,draft,existing?.sourceThemeId||state.sourceThemeId,saveStamp)}
        await syncSavedThemeIdentityV364(savedId,draft,saveStamp);
        await commitSavedAudioAuthorityV420(savedId,draft,saveStamp);
        try{ensureSavedThemeVisibleV378(savedId,draft,existing?.sourceThemeId||state.sourceThemeId||'')}catch{}
        try{localStorage.setItem('dashboard-theme',String(savedId||'default'));}catch{}
        try{parent.postMessage({type:'dashboard-theme-studio-saved-v43',studioSessionV283:studioSession(),studioActionV283:studioAction(),themeId:savedId,apply:true,builtInOverrideV102:builtIn,themeName:draft.name,sharedThemeV378:builtIn?null:{id:savedId,name:draft.name,sourceThemeId:existing?.sourceThemeId||state.sourceThemeId||'',selectedVariant:String(draft?.[AI_SELECTED_KEY_V376]||draft?.themeBuilderAiModeV364||'').toLowerCase()==='dark'?'dark':'light',activeVariant:String(draft?.[AI_SELECTED_KEY_V376]||draft?.themeBuilderAiModeV364||'').toLowerCase()==='dark'?'dark':'light',theme:clone(draft),updatedAt:saveStamp}},location.origin)}catch{}
        try{state.audioBundleCache?.delete?.(String(savedId||''));}catch{}
        setStatus('Saved');setTimeout(close,80);return;
      }
      if(state.kind==='built-in')savedId=await persistBuiltIn(state.themeId,draft,saveStamp);
      else if(state.kind==='copy')savedId=await persistCopy(state.themeId,draft,saveStamp);
      else if(state.kind==='shared'){
        savedId=await persistShared(state.themeId||makeThemeId(),draft,state.sourceThemeId,saveStamp);try{syncSharedThemesIntoLogV40?.()}catch{}try{if(db?.settings){db.settings.theme=savedId;await saveDb?.()}}catch{}
      }else if(state.kind==='custom')savedId=await persistCustom(draft);
      else{
        savedId=makeThemeId();await persistShared(savedId,draft,'',saveStamp);try{syncSharedThemesIntoLogV40?.()}catch{}
        try{if(!db.settings)db.settings={};const copies=typeof ensureThemeCopiesV30==='function'?ensureThemeCopiesV30():(db.settings.themeCopiesV30||=[]);if(!copies.some(item=>item?.id===savedId))copies.push({id:savedId,name:draft.name,sourceThemeId:'',theme:clone(draft),createdAt:saveStamp});db.settings.theme=savedId;await saveDb?.();renderThemePicker?.()}catch{}
      }
      await syncSavedThemeIdentityV364(savedId,draft,saveStamp);
      await commitSavedAudioAuthorityV420(savedId,draft,saveStamp);
      try{ensureSavedThemeVisibleV378(savedId,draft,state.sourceThemeId||'')}catch{}
      // V400: a saved appearance is the active appearance everywhere. Dashboard
      // uses the same theme id and reads the just-saved selectedVariant metadata.
      try{localStorage.setItem('dashboard-theme',String(savedId||'default'));}catch{}
      try{state.audioBundleCache?.delete?.(String(savedId||''));}catch{}
      // Apply exactly once, after every persistence mirror and the intro-audio
      // authority cache have committed. This avoids the same-theme dedupe wrappers
      // swallowing the only apply that has the newly saved song/segment settings.
      try{
        if(db?.settings?.theme===savedId){
          await applyTheme?.(savedId,{persist:false,force:true});
          // V446: Save Theme primes before persistence. Adopt that exact prime
          // only after the entire wrapped apply has settled. This preserves the
          // user gesture and prevents late theme wrappers from silencing it.
          window.__loggyLogIntroAudioV444?.ensureThemeAudio?.(
            savedId,
            draft,
            'theme-builder-save-final-v446'
          );
        }
      }catch{}

      // V377: apply the just-saved theme cursor now instead of waiting for a
      // reload or a later settings render. This only runs when the theme has
      // explicitly opted into its theme cursor.
      try{
        const cursorId=String(draft?.themeCursorStyle||draft?.customCursorModeIdV161||'').trim();
        const hiddenCursorIdsV382=new Set(readJsonStorage('loggy-hidden-cursors-v163',[]).map(String));
        if(draft?.useThemeCursor===true&&cursorId&&cursorId!=='default'&&!hiddenCursorIdsV382.has(cursorId)){
          if(!db.settings)db.settings={};
          db.settings.cursorStyle=cursorId;
          db.settings.cursorTrails=db.settings.cursorTrails||{};
          db.settings.cursorTrails[cursorId]=draft?.themeCursorTrailEnabledV161!==false;
          window._forceThemeAccessoriesOnceV32=true;
          await saveDb?.();
          applyCursorChoice?.();
          renderCursorPicker?.();
        }
      }catch{}
      setStatus('Saved');toast(`Saved “${draft.name}”.`);setTimeout(close,80);
    }catch(error){console.error('Theme Builder V307 save failed',error);setStatus('Could not save');toast('Could not save this theme.')}finally{if(button)button.disabled=false}
  }

  // New owner API. Old builder implementation functions are never called.
  window.LoggyThemeBuilderV307={openCreate,openEdit,close,getDraft:()=>clone(state.draft),refreshPreview:schedulePreview};
  window.__loggyThemeBuilderV307OpenCreate=openCreate;window.__loggyThemeBuilderV307OpenEdit=openEdit;
  // Existing app entrypoints point directly at V307 so theme cards/dashboard do not need a second UI implementation.
  window.__loggyThemeBuilderV306OpenCreate=openCreate;window.__loggyThemeBuilderV306OpenEdit=openEdit;
  window.__loggyThemeBuilderV300OpenCreate=openCreate;window.__loggyThemeBuilderV300OpenEdit=openEdit;
  try{openNewThemeBuilderCleanV34=openCreate}catch{}try{openNewCustomThemeFromPickerV7=openCreate}catch{}try{openAnyThemeInBuilderV25=openEdit}catch{}try{openExistingCustomThemeFromPickerV7=()=>openEdit('theme-custom-builder')}catch{}try{openThemeCopyInBuilderV30=themeId=>openEdit(themeId)}catch{}try{openDashboardSharedThemeInStudioV43=themeId=>openEdit(themeId)}catch{}

  window.addEventListener('contextmenu',event=>{
    const card=event.target?.closest?.('#theme-picker .theme-picker-card[data-theme]');if(!card)return;
    const id=String(card.dataset.theme||'default'),name=card.querySelector('.theme-picker-name')?.textContent?.trim()||displayName(id);
    event.preventDefault();event.stopPropagation();event.stopImmediatePropagation();
    const actions=[{label:'Edit Theme',icon:'ph-pencil-simple',action:()=>openEdit(id,name)}];
    try{const copyTheme=getThemeCopyV30?.(id);if(typeof duplicateThemeV30==='function')actions.push({label:'Duplicate Theme',icon:'ph-copy',action:()=>duplicateThemeV30(id,name)});if(copyTheme&&typeof deleteThemeCopyV30==='function')actions.push({label:'Delete Theme',icon:'ph-trash',danger:true,action:()=>deleteThemeCopyV30(id)});else if(id!=='default'&&typeof deleteThemeFromPickerV2==='function')actions.push({label:'Delete Theme',icon:'ph-trash',danger:true,action:()=>deleteThemeFromPickerV2(id,name)});showCustomItemContextMenu?.(event.clientX,event.clientY,actions)}catch{}
  },true);

  window.addEventListener('click',event=>{
    const create=event.target?.closest?.('.theme-search-create-v161,.theme-picker-create-card,[data-create-theme-v171]');if(!create)return;
    event.preventDefault();event.stopPropagation();event.stopImmediatePropagation();openCreate();
  },true);

  if(STUDIO){
    const boot=()=>{try{parent.postMessage({type:'dashboard-theme-studio-host-ready-v106'},location.origin)}catch{}if(studioAction()==='edit')openEdit(studioThemeId()||'default',displayName(studioThemeId()||'default'));else openCreate();try{parent.postMessage({type:'dashboard-theme-studio-ready-v69',studioSessionV283:studioSession(),studioActionV283:studioAction()},location.origin)}catch{}};
    if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(boot,0),{once:true});else setTimeout(boot,0);
  }
})();



/* ============================================================
   V327 — SETTINGS / TAB TEMPLATES / DAILY VIEW FINAL REPAIR
   - Restore Tab Templates + My Templates every time Create Tab opens.
   - Trash is Settings-only; no log-navbar trash icon (including preview).
   - Settings opens on the applied theme with an empty, focused search.
   - Numbered Days Layout is Default-view-only.
   - Polaroid New Day + is large and centered.
   - New Theme always opens the clean/default Theme Builder draft.
   ============================================================ */
(() => {
  'use strict';
  if (window.__loggyV327FinalRepair) return;
  window.__loggyV327FinalRepair = true;

  const q = (selector, root = document) => root?.querySelector?.(selector) || null;
  const qa = (selector, root = document) => Array.from(root?.querySelectorAll?.(selector) || []);

  function installStyleV327() {
    if (document.getElementById('loggy-v327-final-style')) return;
    const style = document.createElement('style');
    style.id = 'loggy-v327-final-style';
    style.textContent = `
      /* Create Tab templates must stay visible above the icon gallery. */
      #custom-tab-create-modal .custom-tab-template-section-v53,
      #custom-tab-create-modal .custom-blueprint-section-v162 {
        display:flex!important;
        visibility:visible!important;
        opacity:1!important;
      }
      #custom-tab-create-modal .custom-tab-template-section-v53 { flex-direction:column!important; }
      #custom-tab-create-modal .custom-tab-template-grid-v53 { display:grid!important; }

      /* Trash is no longer a tab-navbar destination. */

      /* Dedicated Log Settings trash card. */
      #log-settings-trash-v327 { display:grid; gap:9px; }
      #log-settings-trash-v327 .log-settings-trash-card-v327 {
        display:grid; grid-template-columns:auto minmax(0,1fr);
        grid-template-areas:'icon title' 'icon copy'; gap:3px 9px;
        width:100%; align-items:center; text-align:left; padding:12px;
        border:var(--thin-border); border-radius:11px;
        background:transparent; color:var(--black); font:inherit; cursor:pointer;
      }
      #log-settings-trash-v327 .log-settings-trash-card-v327 > i { grid-area:icon; font-size:1.3rem; }
      #log-settings-trash-v327 .log-settings-trash-card-v327 > strong { grid-area:title; font-size:.8rem; }
      #log-settings-trash-v327 .log-settings-trash-card-v327 > span { grid-area:copy; font-size:.68rem; opacity:.7; line-height:1.35; }

      /* Polaroid New Day is a centered, obvious + card. */
      #days-grid.polaroid-grid-container > .polaroid-card[title='Add extra log day'] {
        position:relative!important; display:grid!important; place-items:center!important;
        overflow:hidden!important;
      }
      #days-grid.polaroid-grid-container > .polaroid-card[title='Add extra log day'] .polaroid-video {
        position:absolute!important; inset:0!important; width:100%!important; height:100%!important;
        margin:0!important; display:grid!important; place-items:center!important;
      }
      #days-grid.polaroid-grid-container > .polaroid-card[title='Add extra log day'] .polaroid-video-placeholder {
        width:100%!important; height:100%!important; display:grid!important; place-items:center!important;
        border:0!important; background:transparent!important;
      }
      #days-grid.polaroid-grid-container > .polaroid-card[title='Add extra log day'] .polaroid-video-placeholder > i.ph-plus {
        font-size:3.15rem!important; line-height:1!important; margin:0!important;
      }
      #days-grid.polaroid-grid-container > .polaroid-card[title='Add extra log day'] .polaroid-label {
        display:none!important;
      }
    `;
    document.head.appendChild(style);
  }

  function removeTrashNavV327() {
    q('#open-trash-view-btn')?.remove();
  }

  function restoreTabTemplatesV327() {
    try { ensureCustomTabCreateModal?.(); } catch {}
    const modal = q('#custom-tab-create-modal');
    if (!modal) return;
    const box = q('.modal-box', modal);
    if (!box) return;

    let built = null;
    try { built = ensurePrebuiltTabSectionV53?.() || q('.custom-tab-template-section-v53', modal); } catch { built = q('.custom-tab-template-section-v53', modal); }
    if (built) {
      try { renderPrebuiltTabCardsV53?.(built); } catch {}
      const appDb = (typeof db !== 'undefined' ? db : window.db);
      const builtInState = appDb?.settings?.builtInBlueprintStateV162 || {};
      qa('[data-custom-tab-template-v53]', built).forEach(card => {
        const state = String(builtInState[card.dataset.customTabTemplateV53] || 'active');
        card.classList.toggle('hidden', state !== 'active');
      });
      built.hidden = false;
      built.classList.remove('hidden');
      built.style.removeProperty('display');
      const label = q('.field-label', built);
      if (label) label.textContent = 'Tab Templates';
      const iconSection = q('#custom-tab-icon-picker', modal)?.closest('.modal-section');
      const nameSection = q('#custom-tab-name-input', modal)?.closest('.modal-section');
      /* V329: Create Tab order is Tab Name -> icon search/icons -> Tab Templates. */
      const templateAnchor = iconSection || nameSection;
      if (templateAnchor && templateAnchor.nextElementSibling !== built) templateAnchor.insertAdjacentElement('afterend', built);
    }

    /* The V162 wrapper around ensureCustomTabCreateModal normally creates this.
       If an older/later modal rebuild skipped it, build the visible cards here;
       the existing V162 capture handler still owns instantiation on Create Tab. */
    let mine = q('.custom-blueprint-section-v162', modal);
    if (!mine) {
      mine = document.createElement('section');
      mine.className = 'custom-blueprint-section-v162';
      mine.innerHTML = '<div class="custom-blueprint-heading-v162"><strong>My Templates</strong><button type="button" class="small-icon-btn custom-blueprint-manage-v162"><i class="ph ph-sliders"></i> Manage</button></div><div class="custom-blueprint-grid-v162"></div>';
      (built || q('#custom-tab-create-confirm', modal))?.insertAdjacentElement(built ? 'afterend' : 'beforebegin', mine);
    } else if (built && built.nextElementSibling !== mine) {
      built.insertAdjacentElement('afterend', mine);
    }
    mine.hidden = false;
    mine.classList.remove('hidden');
    mine.style.removeProperty('display');

    const grid = q('.custom-blueprint-grid-v162', mine);
    if (grid && !q('[data-custom-blueprint-id-v162]', grid)) {
      const appDb = (typeof db !== 'undefined' ? db : window.db);
      const list = Array.isArray(appDb?.settings?.customTabBlueprintsV162) ? appDb.settings.customTabBlueprintsV162 : [];
      grid.innerHTML = '';
      list.filter(item => item?.status === 'active').forEach(item => {
        const card = document.createElement('button');
        card.type = 'button';
        card.className = 'custom-template-card-v162';
        card.dataset.customBlueprintIdV162 = String(item.id || '');
        card.innerHTML = `<i class="ph ${String(item.icon || 'ph-tabs').replace(/[^a-z0-9_-]/gi,'')}"></i><span></span>`;
        q('span', card).textContent = String(item.name || 'Template');
        card.addEventListener('click', () => {
          modal.dataset.selectedBlueprintV162 = String(item.id || '');
          qa('button', grid).forEach(button => button.classList.toggle('selected', button === card));
          qa('[data-custom-tab-template-v53]', modal).forEach(button => button.classList.remove('selected'));
          const name = q('#custom-tab-name-input', modal);
          if (name && !name.value.trim()) name.value = String(item.name || 'Template');
        });
        grid.appendChild(card);
      });
      if (!grid.children.length) grid.innerHTML = '<small>Save any tab as a template to reuse its layout.</small>';
    }

    const manage = q('.custom-blueprint-manage-v162', mine);
    if (manage && !manage.dataset.v327Bound) {
      manage.dataset.v327Bound = '1';
      manage.addEventListener('click', () => {
        /* If V162 already created the manager, its own state/render code remains
           authoritative. This fallback simply reveals it. */
        const manager = q('#blueprint-manager-v162');
        manager?.classList.remove('hidden');
      });
    }
  }

  function openTrashModalInsideSettingsV327() {
    try {
      renderTrashModal?.();
      const modal = ensureTrashModal?.();
      if (modal) {
        modal.classList.remove('hidden');
        return;
      }
    } catch {}
    try { openTrashModal?.(); } catch {}
  }

  function ensureLogSettingsTrashV327() {
    const modal = q('#daily-settings-modal');
    const box = q(':scope > .modal-box', modal);
    if (!modal || !box) return;

    /* Remove duplicate Trash from the older Workspace utility grid. */
    const oldTrash = q('[data-feature-action="trash"]', modal);
    oldTrash?.remove();

    let section = q('#log-settings-trash-v327', modal);
    if (!section) {
      section = document.createElement('section');
      section.id = 'log-settings-trash-v327';
      section.className = 'modal-section';
      section.innerHTML = `
        <span class="field-label">Trash</span>
        <button type="button" class="log-settings-trash-card-v327">
          <i class="ph ph-trash"></i>
          <strong>Open Trash</strong>
          <span>Restore deleted tabs, components, Knowledge Base items, or remove them permanently.</span>
        </button>`;
      q('.log-settings-trash-card-v327', section)?.addEventListener('click', () => {
        modal.classList.add('hidden');
        openTrashModalInsideSettingsV327();
      });
    }
    const shortcuts = q('#global-shortcuts-section', modal);
    if (shortcuts) {
      if (shortcuts.nextElementSibling !== section) shortcuts.insertAdjacentElement('afterend', section);
    } else if (!section.isConnected) {
      box.appendChild(section);
    }
  }

  // V366 owns applied-theme selection/scrolling in Log Settings.

  function syncDailyLayoutVisibilityV327() {
    const modal = q('#daily-logs-local-settings-modal');
    if (!modal) return;
    const appDb = (typeof db !== 'undefined' ? db : window.db);
    const view = String(q('#daily-logs-local-view-type', modal)?.value || appDb?.settings?.dailyViewType || 'default');
    const numbered = q('#daily-day-layout-setting-v228', modal);
    if (numbered) numbered.classList.toggle('hidden', view !== 'default');
  }

  function hardRouteNewThemeV327(event) {
    const create = event.target?.closest?.('.theme-search-create-v161,.theme-picker-create-card,[data-create-theme-v171]');
    if (!create) return;
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    try { window.__loggyThemeBuilderV307OpenCreate?.(); } catch {}
  }

  installStyleV327();
  removeTrashNavV327();

  try {
    const before = openCustomTabCreateModal;
    openCustomTabCreateModal = function() {
      try { ensureCustomTabCreateModal?.(); } catch {}
      restoreTabTemplatesV327();
      const result = before.apply(this, arguments);
      restoreTabTemplatesV327();
      requestAnimationFrame(restoreTabTemplatesV327);
      return result;
    };
  } catch {}

  try {
    const before = openGlobalThemeSettings;
    openGlobalThemeSettings = function() {
      const result = before.apply(this, arguments);
      removeTrashNavV327();
      ensureLogSettingsTrashV327();
      requestAnimationFrame(() => {
        ensureLogSettingsTrashV327();
      });
      return result;
    };
  } catch {}

  try {
    const before = openDailyLogsLocalSettings;
    openDailyLogsLocalSettings = function() {
      const result = before.apply(this, arguments);
      syncDailyLayoutVisibilityV327();
      requestAnimationFrame(syncDailyLayoutVisibilityV327);
      return result;
    };
  } catch {}

  document.addEventListener('change', event => {
    if (event.target?.matches?.('#daily-logs-local-view-type')) requestAnimationFrame(syncDailyLayoutVisibilityV327);
  }, true);
  document.addEventListener('click', event => {
    if (event.target?.closest?.('#add-custom-tab-btn,[data-action="create-tab"]')) requestAnimationFrame(restoreTabTemplatesV327);
    if (event.target?.closest?.('#open-daily-settings-btn,#open-global-daily-settings-nav-btn')) requestAnimationFrame(() => {
      ensureLogSettingsTrashV327();
    });
  }, true);
  document.addEventListener('click', hardRouteNewThemeV327, true);

  const bootV327 = () => {
    removeTrashNavV327();
    try { restoreTabTemplatesV327(); } catch {}
    try { ensureLogSettingsTrashV327(); } catch {}
    try { syncDailyLayoutVisibilityV327(); } catch {}
    /* Historical code can still call ensureTrashNavButtonV2 later. Remove any
       accidental resurrection without observing the whole document. */
    const nav = q('#side-nav-log-scroll') || q('.side-nav');
    if (nav) {
      try { new MutationObserver(removeTrashNavV327).observe(nav, { childList:true }); } catch {}
    }
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => requestAnimationFrame(bootV327), { once:true });
  else requestAnimationFrame(bootV327);
})();

/* ============================================================
   V328 — USEFUL TAB TEMPLATES + CUSTOM TAB PROMPT
   - Keep Whiteboard + Notebook and replace the old starter set.
   - New starter tabs are composed only from reusable Custom Components.
   - Add a prompt/code workflow for AI-designed custom tabs.
   - Add an obvious hover state to Auto Theme's Copy Prompt button.
   ============================================================ */
(() => {
  'use strict';
  if (window.__loggyV328TabTemplateRefresh) return;
  window.__loggyV328TabTemplateRefresh = true;

  const q = (selector, root = document) => root?.querySelector?.(selector) || null;
  const qa = (selector, root = document) => Array.from(root?.querySelectorAll?.(selector) || []);
  const safeText = value => String(value ?? '');
  const escV328 = value => safeText(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const deepCopyV328 = value => {
    try { return JSON.parse(JSON.stringify(value)); } catch { return value; }
  };

  const NEW_TEMPLATE_DEFS_V328 = [
    {
      id: 'personal-dashboard-v328',
      name: 'Personal Dashboard',
      icon: 'ph-gauge',
      description: 'Goals, priorities, quick notes, progress, and recent Daily Log activity in one home base.'
    },
    {
      id: 'study-center-v328',
      name: 'Study Center',
      icon: 'ph-graduation-cap',
      description: 'Searchable study material, a study queue, key terms, questions, and resources.'
    },
    {
      id: 'project-workspace-v328',
      name: 'Project Workspace',
      icon: 'ph-kanban',
      description: 'Goals, next actions, milestones, a project table, references, and visual project work.'
    },
    {
      id: 'habit-practice-v328',
      name: 'Habit & Practice',
      icon: 'ph-repeat',
      description: 'Track a target, practice sessions, skill ratings, routines, and milestone wins.'
    },
    {
      id: 'milestones-goals-v329',
      name: 'Milestones & Goals',
      icon: 'ph-target',
      description: 'Track goals, progress, milestones, next actions, target dates, and status in one focused tracker.'
    },
    {
      id: 'media-board-v328',
      name: 'Media & Inspiration',
      icon: 'ph-images-square',
      description: 'A searchable moodboard with polaroids, project images, saved links, and Daily Log media.'
    }
  ];

  function componentV328(type, patch = {}) {
    let base = null;
    try { base = defaultCustomComponent(type); } catch {}
    if (!base || typeof base !== 'object') {
      base = { id: (typeof customId === 'function' ? customId('component') : `component-${Date.now()}`), type };
    }
    return Object.assign(base, deepCopyV328(patch || {}), { type });
  }

  function checklistV328(title, items) {
    const component = componentV328('checklist', { title });
    component.items = (items || []).map(text => ({
      id: typeof customId === 'function' ? customId('check') : `check-${Math.random().toString(36).slice(2)}`,
      text,
      done: false,
      completedAt: null
    }));
    return component;
  }

  function cardsV328(title, items) {
    const component = componentV328('cards', { title });
    component.items = (items || []).map(item => ({
      id: typeof customId === 'function' ? customId('card') : `card-${Math.random().toString(36).slice(2)}`,
      title: item.title,
      body: item.body
    }));
    return component;
  }

  function tableV328(title, columns, rows = []) {
    const component = componentV328('tableV162', { title });
    const cols = (columns || []).map(name => ({
      id: typeof customId === 'function' ? customId('col') : `col-${Math.random().toString(36).slice(2)}`,
      name
    }));
    component.columns = cols;
    component.rows = rows.map(values => ({
      id: typeof customId === 'function' ? customId('row') : `row-${Math.random().toString(36).slice(2)}`,
      cells: Object.fromEntries(cols.map((column, index) => [column.id, Array.isArray(values) ? (values[index] ?? '') : (values?.[column.name] ?? '')]))
    }));
    if (!component.rows.length) {
      component.rows.push({
        id: typeof customId === 'function' ? customId('row') : `row-${Math.random().toString(36).slice(2)}`,
        cells: Object.fromEntries(cols.map(column => [column.id, '']))
      });
    }
    return component;
  }

  function buildUsefulTemplateV328(templateId) {
    switch (templateId) {
      case 'personal-dashboard-v328': {
        const search = componentV328('globalSearchV163', { placeholder: 'Search this dashboard...' });
        const goals = componentV328('goalsV162', { title: 'Goals' });
        const progress = componentV328('progressMeter', { title: 'Current Progress', target: 7, unit: 'steps' });
        const recent = componentV328('dailyLogCollection', { title: 'Recent Daily Log Activity', sources: ['notes','knowledge','resources'] });
        return [
          search,
          goals,
          progress,
          checklistV328('Top Priorities', ['Choose today’s most important task', 'Finish one meaningful next action', 'Review what needs attention next']),
          cardsV328('Quick Notes', [
            { title: 'Remember', body: 'Keep an important reminder here.' },
            { title: 'Idea', body: 'Capture something worth returning to.' }
          ]),
          recent
        ];
      }
      case 'study-center-v328': {
        const search = componentV328('globalSearchV163', { placeholder: 'Search everything in this study center...' });
        const collection = componentV328('kbDynamicCollectionV162', { title: 'Study Material', display: 'cards' });
        const vocab = componentV328('vocabulary', { title: 'Key Terms' });
        const qa = componentV328('qaV162', { title: 'Questions & Answers' });
        const resources = componentV328('resources', { title: 'Study Resources' });
        return [
          search,
          checklistV328('Study Queue', ['Choose what to review', 'Practice active recall', 'Mark the next topic to revisit']),
          collection,
          vocab,
          qa,
          resources
        ];
      }
      case 'project-workspace-v328': {
        const goals = componentV328('goalsV162', { title: 'Project Goals' });
        const milestones = componentV328('milestones', { title: 'Milestones' });
        const resources = componentV328('resources', { title: 'References & Links' });
        const gallery = componentV328('projectGallery', { title: 'Project Gallery' });
        return [
          goals,
          checklistV328('Next Actions', ['Define the next deliverable', 'Choose the next concrete action', 'Review blockers and progress']),
          milestones,
          tableV328('Project Board', ['Task', 'Status', 'Notes']),
          resources,
          gallery
        ];
      }
      case 'habit-practice-v328': {
        const progress = componentV328('progressMeter', { title: 'Weekly Target', target: 5, unit: 'sessions' });
        const practice = componentV328('practiceLog', { title: 'Practice Sessions' });
        const skills = componentV328('skillRatings', { title: 'Skill Check-In' });
        const milestones = componentV328('milestones', { title: 'Milestones' });
        return [
          progress,
          checklistV328('Routine', ['Start with the smallest version of the habit', 'Log the session', 'Write one thing to improve next time']),
          practice,
          skills,
          milestones
        ];
      }
      case 'milestones-goals-v329': {
        const goals = componentV328('goalsV162', { title: 'Goals' });
        const progress = componentV328('progressMeter', { title: 'Overall Progress', target: 5, unit: 'goals' });
        const milestones = componentV328('milestones', { title: 'Milestones' });
        return [
          goals,
          progress,
          checklistV328('Next Actions', [
            'Choose the goal that matters most right now',
            'Write the next concrete action',
            'Review progress and update the next step'
          ]),
          milestones,
          tableV328('Goal Planner', ['Goal', 'Target Date', 'Status', 'Notes'])
        ];
      }
      case 'media-board-v328': {
        const search = componentV328('globalSearchV163', { placeholder: 'Search this media board...' });
        const polaroids = componentV328('polaroids', { title: 'Moodboard', items: [] });
        const gallery = componentV328('projectGallery', { title: 'Visual Projects' });
        const resources = componentV328('resources', { title: 'Links & References' });
        const collection = componentV328('dailyLogCollection', { title: 'Saved Daily Log Media', sources: ['images','videos','pdfs','audio','resources'] });
        return [search, polaroids, gallery, resources, collection];
      }
      default:
        return null;
    }
  }

  function installUsefulTemplatesV328() {
    try {
      if (!Array.isArray(CUSTOM_TAB_TEMPLATES_V53)) return;
      const keepIds = new Set(['whiteboard-v197', 'notepad-v249']);
      const preserved = CUSTOM_TAB_TEMPLATES_V53.filter(template => keepIds.has(String(template?.id || '')));
      const ordered = [];
      ['whiteboard-v197','notepad-v249'].forEach(id => {
        const found = preserved.find(template => template.id === id);
        if (found) ordered.push(found);
      });
      ordered.push(...NEW_TEMPLATE_DEFS_V328.map(deepCopyV328));
      CUSTOM_TAB_TEMPLATES_V53.splice(0, CUSTOM_TAB_TEMPLATES_V53.length, ...ordered);

      if (!buildPrebuiltTabComponentsV53.__v328UsefulTemplates) {
        const before = buildPrebuiltTabComponentsV53;
        const wrapped = function(templateId) {
          const built = buildUsefulTemplateV328(String(templateId || ''));
          if (built) return built;
          return before.apply(this, arguments);
        };
        wrapped.__v328UsefulTemplates = true;
        buildPrebuiltTabComponentsV53 = wrapped;
      }

      const modal = q('#custom-tab-create-modal');
      const section = q('.custom-tab-template-section-v53', modal);
      if (section) {
        try { renderPrebuiltTabCardsV53?.(section); } catch {}
      }
    } catch (error) {
      console.warn('V328 useful template install failed', error);
    }
  }

  function componentCatalogV328() {
    let entries = [];
    try {
      entries = (CUSTOM_COMPONENT_LIBRARY || []).map(def => ({
        type: String(def?.type || ''),
        label: String(def?.label || def?.type || '')
      })).filter(item => item.type);
    } catch {}
    return entries;
  }

  function tabPromptTextV328(typeText, behaviorText, notesText) {
    const catalog = componentCatalogV328();
    const available = catalog.map(item => `- ${item.type}: ${item.label}`).join('\n');
    return `You are designing one custom tab for my Loggy app.\n\nTAB I WANT:\n${typeText || 'A useful custom tab'}\n\nWHAT IT SHOULD DO:\n${behaviorText || 'Organize the requested information clearly and make the workflow practical.'}\n\nEXTRA NOTES:\n${notesText || 'None'}\n\nIMPORTANT: Build this tab ONLY from Loggy's existing reusable Custom Components listed below. Do not invent JavaScript, HTML, CSS, event handlers, or unsupported component types. If the request cannot be represented exactly, combine the closest existing reusable components in a practical way.\n\nAVAILABLE CUSTOM COMPONENTS:\n${available}\n\nReturn ONLY one valid JSON object. No markdown fence, explanation, or comments. Use this exact outer shape:\n{\n  \"format\": \"loggyCustomTabV328\",\n  \"name\": \"Short useful tab name\",\n  \"icon\": \"ph-icon-name\",\n  \"components\": [\n    { \"type\": \"existingComponentType\", \"title\": \"Optional title\" }\n  ]\n}\n\nFor component-specific content, include normal JSON fields that fit the component. Examples: checklist.items may be strings; cards.items may be objects with title/body; a tableV162 may use columns as strings and rows as arrays; progressMeter can include target and unit; dailyLogCollection can include sources; globalSearchV163 can include placeholder. Keep the result useful immediately after import, but do not add fake personal data. Use only component types from the list above.`;
  }

  function parseTabCodeV328(raw) {
    let text = String(raw || '').trim();
    if (!text) return null;
    text = text.replace(/^```(?:json|javascript|js)?\s*/i, '').replace(/\s*```$/i, '').trim();
    const start = text.indexOf('{');
    const end = text.lastIndexOf('}');
    if (start >= 0 && end > start) text = text.slice(start, end + 1);
    try {
      const parsed = JSON.parse(text);
      if (!parsed || typeof parsed !== 'object' || !Array.isArray(parsed.components)) return null;
      return parsed;
    } catch {
      return null;
    }
  }

  function rekeyArrayItemsV328(items, prefix = 'item') {
    if (!Array.isArray(items)) return items;
    return items.map(item => {
      if (typeof item === 'string') return item;
      if (!item || typeof item !== 'object') return item;
      const copy = deepCopyV328(item);
      copy.id = typeof customId === 'function' ? customId(prefix) : `${prefix}-${Math.random().toString(36).slice(2)}`;
      return copy;
    });
  }

  function normalizeImportedComponentV328(spec) {
    const type = String(spec?.type || '').trim();
    let allowed = false;
    try { allowed = CUSTOM_COMPONENT_LIBRARY.some(def => String(def?.type || '') === type); } catch {}
    if (!allowed) throw new Error(`Unsupported component type: ${type || '(missing type)'}`);

    const base = componentV328(type);
    const incoming = deepCopyV328(spec || {});
    delete incoming.id;
    const component = Object.assign(base, incoming, { type });
    component.id = typeof customId === 'function' ? customId('component') : `component-${Math.random().toString(36).slice(2)}`;

    if (type === 'checklist' && Array.isArray(spec.items)) {
      component.items = spec.items.map(item => {
        const text = typeof item === 'string' ? item : String(item?.text || '');
        return { id: typeof customId === 'function' ? customId('check') : `check-${Math.random().toString(36).slice(2)}`, text, done:false, completedAt:null };
      });
    } else if (type === 'cards' && Array.isArray(spec.items)) {
      component.items = spec.items.map(item => ({
        id: typeof customId === 'function' ? customId('card') : `card-${Math.random().toString(36).slice(2)}`,
        title: String(item?.title || ''),
        body: String(item?.body || '')
      }));
    } else if (type === 'tableV162' && Array.isArray(spec.columns)) {
      const names = spec.columns.map(column => typeof column === 'string' ? column : String(column?.name || 'Column'));
      const rows = Array.isArray(spec.rows) ? spec.rows : [];
      return tableV328(String(spec.title || 'Table'), names, rows);
    } else {
      ['items','entries','goals','rows','columns','savedSentences'].forEach(key => {
        if (Array.isArray(component[key])) component[key] = rekeyArrayItemsV328(component[key], key.replace(/s$/, '') || 'item');
      });
    }
    return component;
  }

  function createTabFromGeneratedCodeV328(parsed) {
    const components = parsed.components.map(normalizeImportedComponentV328);
    if (!components.length) throw new Error('The generated tab does not contain any supported components.');
    const rawIcon = String(parsed.icon || 'ph-squares-four');
    const icon = /^ph-[a-z0-9-]+$/i.test(rawIcon) ? rawIcon : 'ph-squares-four';
    const tab = {
      id: typeof customId === 'function' ? customId('tab') : `tab-${Date.now().toString(36)}`,
      name: String(parsed.name || 'Custom Tab').trim() || 'Custom Tab',
      icon,
      components,
      generatedFromPromptV328: true
    };
    getCustomTabs().push(tab);
    saveDb();
    try { closeCustomTabCreateModal?.(); } catch {}
    q('#custom-tab-prompt-modal-v328')?.classList.add('hidden');
    renderCustomTabNavigation();
    const view = buildCustomTabView(tab);
    document.body.insertBefore(view, q('#companion-stage') || null);
    activeCustomTabId = tab.id;
    customTabEditMode = false;
    renderCustomTabView(tab.id);
    switchView(view);
    return tab;
  }

  function ensureCustomTabPromptModalV328() {
    let modal = q('#custom-tab-prompt-modal-v328');
    if (modal) return modal;
    modal = document.createElement('div');
    modal.id = 'custom-tab-prompt-modal-v328';
    modal.className = 'modal-overlay hidden custom-tab-modal';
    modal.innerHTML = `
      <div class="modal-box custom-tab-prompt-box-v328">
        <div class="modal-header">
          <div><h2>Custom Tab Prompt</h2><p class="custom-tab-create-hint">Describe the tab, copy the generated prompt to AI, then paste the returned JSON code back here.</p></div>
          <button type="button" class="small-icon-btn custom-tab-prompt-close-v328" aria-label="Close"><i class="ph ph-x"></i></button>
        </div>
        <div class="modal-section custom-tab-prompt-questions-v328">
          <label><span class="field-label">What type of tab do you want?</span><input type="text" class="custom-tab-prompt-type-v328" placeholder="e.g. college planner, finance dashboard, reading tracker"></label>
          <label><span class="field-label">What do you want it to do?</span><textarea class="custom-tab-prompt-behavior-v328" rows="5" placeholder="Describe the workflow, information, trackers, searches, collections, etc."></textarea></label>
          <label><span class="field-label">Anything else? <small>(optional)</small></span><textarea class="custom-tab-prompt-notes-v328" rows="3" placeholder="Layout preferences, things to prioritize, what to avoid..."></textarea></label>
          <button type="button" class="icon-btn custom-tab-build-prompt-v328"><i class="ph ph-sparkle"></i> Build Prompt</button>
        </div>
        <div class="modal-section custom-tab-generated-prompt-v328 hidden">
          <div class="custom-tab-prompt-heading-v328"><span class="field-label">Prompt to give AI</span><button type="button" class="small-icon-btn custom-tab-copy-prompt-v328"><i class="ph ph-copy"></i> Copy Prompt</button></div>
          <textarea class="custom-tab-prompt-output-v328" rows="13" readonly></textarea>
        </div>
        <div class="modal-section custom-tab-code-import-v328">
          <span class="field-label">Paste Generated Tab Code</span>
          <textarea class="custom-tab-code-input-v328" rows="10" spellcheck="false" placeholder='Paste the JSON object returned by AI here'></textarea>
          <div class="custom-tab-code-actions-v328"><span class="custom-tab-code-status-v328"></span><button type="button" class="icon-btn custom-tab-code-create-v328" disabled><i class="ph ph-plus"></i> Create Tab from Code</button></div>
        </div>
      </div>`;
    document.body.appendChild(modal);

    const close = () => modal.classList.add('hidden');
    q('.custom-tab-prompt-close-v328', modal).addEventListener('click', close);
    modal.addEventListener('click', event => { if (event.target === modal) close(); });

    q('.custom-tab-build-prompt-v328', modal).addEventListener('click', () => {
      const typeText = q('.custom-tab-prompt-type-v328', modal).value.trim();
      const behaviorText = q('.custom-tab-prompt-behavior-v328', modal).value.trim();
      const notesText = q('.custom-tab-prompt-notes-v328', modal).value.trim();
      const output = q('.custom-tab-prompt-output-v328', modal);
      output.value = tabPromptTextV328(typeText, behaviorText, notesText);
      q('.custom-tab-generated-prompt-v328', modal).classList.remove('hidden');
      output.focus();
      output.select();
    });

    q('.custom-tab-copy-prompt-v328', modal).addEventListener('click', async event => {
      const output = q('.custom-tab-prompt-output-v328', modal);
      try {
        await navigator.clipboard.writeText(output.value);
        event.currentTarget.innerHTML = '<i class="ph ph-check"></i> Copied';
        setTimeout(() => { event.currentTarget.innerHTML = '<i class="ph ph-copy"></i> Copy Prompt'; }, 1200);
      } catch {
        output.focus();
        output.select();
        try { document.execCommand('copy'); } catch {}
      }
    });

    const codeInput = q('.custom-tab-code-input-v328', modal);
    const createButton = q('.custom-tab-code-create-v328', modal);
    const status = q('.custom-tab-code-status-v328', modal);
    const syncCode = () => {
      const parsed = parseTabCodeV328(codeInput.value);
      createButton.disabled = !parsed;
      status.textContent = codeInput.value.trim() ? (parsed ? 'Valid Loggy tab code.' : 'Could not parse valid tab JSON yet.') : '';
      status.classList.toggle('valid', !!parsed);
    };
    codeInput.addEventListener('input', syncCode);
    createButton.addEventListener('click', () => {
      const parsed = parseTabCodeV328(codeInput.value);
      if (!parsed) return syncCode();
      try {
        createTabFromGeneratedCodeV328(parsed);
      } catch (error) {
        status.textContent = error?.message || 'Could not create this tab.';
        status.classList.remove('valid');
      }
    });
    return modal;
  }

  function openCustomTabPromptV328() {
    const modal = ensureCustomTabPromptModalV328();
    qa('input,textarea', modal).forEach(input => { if (!input.readOnly) input.value = ''; });
    q('.custom-tab-generated-prompt-v328', modal)?.classList.add('hidden');
    q('.custom-tab-code-create-v328', modal).disabled = true;
    q('.custom-tab-code-status-v328', modal).textContent = '';
    modal.classList.remove('hidden');
    setTimeout(() => q('.custom-tab-prompt-type-v328', modal)?.focus(), 0);
  }

  function ensureCustomTabPromptButtonV328() {
    const modal = q('#custom-tab-create-modal');
    if (!modal || q('#custom-tab-prompt-section-v328', modal)) return;
    const section = document.createElement('section');
    section.id = 'custom-tab-prompt-section-v328';
    section.className = 'modal-section';
    section.innerHTML = `
      <span class="field-label">Build a custom tab with AI</span>
      <button type="button" class="custom-tab-prompt-launch-v328">
        <i class="ph ph-sparkle"></i>
        <span><strong>Custom Tab Prompt</strong><small>Tell Loggy what kind of tab you want, then get a prompt and paste the generated tab code back in.</small></span>
        <i class="ph ph-arrow-right"></i>
      </button>`;
    q('.custom-tab-prompt-launch-v328', section).addEventListener('click', openCustomTabPromptV328);
    const mine = q('.custom-blueprint-section-v162', modal);
    const built = q('.custom-tab-template-section-v53', modal);
    const anchor = mine || built || q('#custom-tab-create-confirm', modal);
    if (anchor) anchor.insertAdjacentElement(anchor.matches('#custom-tab-create-confirm') ? 'beforebegin' : 'afterend', section);
  }

  function installStyleV328() {
    if (q('#loggy-v328-tab-template-style')) return;
    const style = document.createElement('style');
    style.id = 'loggy-v328-tab-template-style';
    style.textContent = `
      #custom-tab-prompt-section-v328{display:grid;gap:8px}
      .custom-tab-prompt-launch-v328{width:100%;display:grid;grid-template-columns:auto minmax(0,1fr) auto;gap:10px;align-items:center;text-align:left;padding:12px;border:1px solid #cfcfcf;border-radius:12px;background:transparent;color:inherit;font:inherit;cursor:pointer;transition:transform .15s ease,border-color .15s ease,box-shadow .15s ease,background .15s ease}
      .custom-tab-prompt-launch-v328:hover{transform:translateY(-1px);border-color:currentColor;box-shadow:0 5px 14px rgba(0,0,0,.08);background:rgba(127,127,127,.06)}
      .custom-tab-prompt-launch-v328>i:first-child{font-size:1.35rem}.custom-tab-prompt-launch-v328 span{display:grid;gap:3px}.custom-tab-prompt-launch-v328 strong{font-size:.84rem}.custom-tab-prompt-launch-v328 small{font-size:.7rem;opacity:.7;line-height:1.35}
      .custom-tab-prompt-box-v328{width:min(820px,calc(100vw - 32px));max-width:820px;max-height:min(92vh,900px);overflow:auto}
      .custom-tab-prompt-box-v328 .modal-header>div{min-width:0}.custom-tab-prompt-box-v328 .modal-header p{margin:4px 0 0}
      .custom-tab-prompt-questions-v328,.custom-tab-code-import-v328,.custom-tab-generated-prompt-v328{display:grid;gap:10px}.custom-tab-prompt-questions-v328 label{display:grid;gap:6px}
      .custom-tab-prompt-heading-v328,.custom-tab-code-actions-v328{display:flex;align-items:center;justify-content:space-between;gap:10px}.custom-tab-code-status-v328{font-size:.75rem;opacity:.72}.custom-tab-code-status-v328.valid{opacity:1;font-weight:750}
      .custom-tab-prompt-output-v328,.custom-tab-code-input-v328{width:100%;resize:vertical;font-family:ui-monospace,SFMono-Regular,Consolas,monospace;font-size:.78rem;line-height:1.45}
      .custom-tab-code-create-v328:disabled{opacity:.42;cursor:not-allowed}
      #theme-builder-clean-v307 .tb316-copy-prompt{transition:transform .16s ease,box-shadow .16s ease,background .16s ease,color .16s ease!important}
      #theme-builder-clean-v307 .tb316-copy-prompt:hover{transform:translateY(-2px)!important;background:#fff!important;color:#171717!important;box-shadow:0 5px 0 #171717,0 10px 20px rgba(0,0,0,.14)!important}
      #theme-builder-clean-v307 .tb316-copy-prompt:active{transform:translateY(0)!important;box-shadow:0 2px 0 #171717!important}
    `;
    document.head.appendChild(style);
  }

  installStyleV328();
  installUsefulTemplatesV328();

  try {
    const before = openCustomTabCreateModal;
    openCustomTabCreateModal = function() {
      installUsefulTemplatesV328();
      const result = before.apply(this, arguments);
      installUsefulTemplatesV328();
      ensureCustomTabPromptButtonV328();
      requestAnimationFrame(() => {
        installUsefulTemplatesV328();
        ensureCustomTabPromptButtonV328();
      });
      return result;
    };
  } catch {}

  document.addEventListener('click', event => {
    if (event.target?.closest?.('#add-custom-tab-btn,[data-action="create-tab"]')) {
      requestAnimationFrame(() => {
        installUsefulTemplatesV328();
        ensureCustomTabPromptButtonV328();
      });
    }
  }, true);

  const bootV328 = () => {
    installUsefulTemplatesV328();
    ensureCustomTabPromptButtonV328();
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => requestAnimationFrame(bootV328), { once:true });
  else requestAnimationFrame(bootV328);
})();

/* ============================================================
   V330 — CREATE TAB TEMPLATE CARDS HARDENING
   The V53/V162/V328 wrappers can leave the template section shell in the
   modal while its grid is empty. Render the desired built-ins directly so
   the cards are present every time the Create Tab modal opens.
   ============================================================ */
(() => {
  'use strict';
  if (window.__loggyV330TemplateCards) return;
  window.__loggyV330TemplateCards = true;

  const q = (selector, root = document) => root?.querySelector?.(selector) || null;
  const qa = (selector, root = document) => Array.from(root?.querySelectorAll?.(selector) || []);
  const clone = value => {
    try { return JSON.parse(JSON.stringify(value)); } catch { return value; }
  };

  const FALLBACK_V330 = [
    {
      id: 'whiteboard-v197',
      name: 'Whiteboard',
      icon: 'ph-selection-background',
      description: 'A full-screen multi-board canvas for notes, images, drawing, connections, and visual planning.'
    },
    {
      id: 'notepad-v249',
      name: 'Notebook',
      icon: 'ph-notebook',
      description: 'A full-screen multi-page notebook with page categories, paper styles, images, and drawing tools.'
    },
    {
      id: 'personal-dashboard-v328',
      name: 'Personal Dashboard',
      icon: 'ph-gauge',
      description: 'Goals, priorities, quick notes, progress, and recent Daily Log activity in one home base.'
    },
    {
      id: 'study-center-v328',
      name: 'Study Center',
      icon: 'ph-graduation-cap',
      description: 'Searchable study material, a study queue, key terms, questions, and resources.'
    },
    {
      id: 'project-workspace-v328',
      name: 'Project Workspace',
      icon: 'ph-kanban',
      description: 'Goals, next actions, milestones, a project table, references, and visual project work.'
    },
    {
      id: 'habit-practice-v328',
      name: 'Habit & Practice',
      icon: 'ph-repeat',
      description: 'Track a target, practice sessions, skill ratings, routines, and milestone wins.'
    },
    {
      id: 'milestones-goals-v329',
      name: 'Milestones & Goals',
      icon: 'ph-target',
      description: 'Track goals, progress, milestones, next actions, target dates, and status in one focused tracker.'
    },
    {
      id: 'media-board-v328',
      name: 'Media & Inspiration',
      icon: 'ph-images-square',
      description: 'A searchable moodboard with polaroids, project images, saved links, and Daily Log media.'
    }
  ];

  function desiredTemplatesV330() {
    let current = [];
    try { current = Array.isArray(CUSTOM_TAB_TEMPLATES_V53) ? CUSTOM_TAB_TEMPLATES_V53 : []; } catch {}
    const currentById = new Map(current.map(item => [String(item?.id || ''), item]));
    return FALLBACK_V330.map(fallback => {
      const existing = currentById.get(fallback.id);
      return existing ? { ...clone(fallback), ...clone(existing), id: fallback.id } : clone(fallback);
    });
  }

  function syncTemplateRegistryV330() {
    const desired = desiredTemplatesV330();
    try {
      if (Array.isArray(CUSTOM_TAB_TEMPLATES_V53)) {
        CUSTOM_TAB_TEMPLATES_V53.splice(0, CUSTOM_TAB_TEMPLATES_V53.length, ...desired);
      }
    } catch {}
    return desired;
  }

  function ensureSectionV330(modal) {
    let section = q('.custom-tab-template-section-v53', modal);
    if (section) return section;

    section = document.createElement('section');
    section.className = 'modal-section custom-tab-template-section-v53';
    section.dataset.v330OwnedSection = '1';
    section.innerHTML = `
      <span class="field-label">Tab Templates</span>
      <p class="custom-tab-create-hint">Pick one to create a ready-made page. You can still edit, reorder, add, or remove its sections afterward.</p>
      <div class="custom-tab-template-grid-v53"></div>`;

    const iconSection = q('#custom-tab-icon-picker', modal)?.closest('.modal-section');
    const nameSection = q('#custom-tab-name-input', modal)?.closest('.modal-section');
    const anchor = iconSection || nameSection;
    if (anchor) anchor.insertAdjacentElement('afterend', section);
    else q('.modal-box', modal)?.appendChild(section);

    section.addEventListener('click', event => {
      const card = event.target.closest?.('[data-custom-tab-template-v53]');
      if (!card) return;
      const id = String(card.dataset.customTabTemplateV53 || '');
      const wasSelected = card.classList.contains('selected');
      qa('[data-custom-tab-template-v53]', section).forEach(item => item.classList.remove('selected'));
      modal.dataset.selectedTemplateV53 = wasSelected ? '' : id;
      if (wasSelected) return;
      card.classList.add('selected');
      let template = null;
      try { template = CUSTOM_TAB_TEMPLATES_V53.find(item => String(item?.id || '') === id) || null; } catch {}
      const name = q('#custom-tab-name-input', modal);
      if (name && (!name.value.trim() || name.value === (modal.dataset.lastTemplateNameV53 || ''))) {
        name.value = String(template?.name || card.dataset.templateNameV330 || '');
      }
      modal.dataset.lastTemplateNameV53 = String(template?.name || card.dataset.templateNameV330 || '');
      try { selectTemplateIconV53?.(modal, String(template?.icon || card.dataset.templateIconV330 || 'ph-squares-four')); } catch {}
    });
    return section;
  }

  function stateForV330(id) {
    try {
      const appDb = (typeof db !== 'undefined' ? db : window.db);
      return String(appDb?.settings?.builtInBlueprintStateV162?.[id] || 'active');
    } catch {
      return 'active';
    }
  }

  function renderTemplateCardsV330() {
    try { ensureCustomTabCreateModal?.(); } catch {}
    const modal = q('#custom-tab-create-modal');
    if (!modal) return;

    const templates = syncTemplateRegistryV330();
    const section = ensureSectionV330(modal);
    if (!section) return;

    section.hidden = false;
    section.classList.remove('hidden');
    section.style.setProperty('display', 'flex', 'important');
    section.style.setProperty('visibility', 'visible', 'important');
    section.style.setProperty('opacity', '1', 'important');
    section.style.flexDirection = 'column';

    const label = q('.field-label', section);
    if (label) label.textContent = 'Tab Templates';

    let hint = q('.custom-tab-create-hint', section);
    if (!hint) {
      hint = document.createElement('p');
      hint.className = 'custom-tab-create-hint';
      hint.textContent = 'Pick one to create a ready-made page. You can still edit, reorder, add, or remove its sections afterward.';
      label?.insertAdjacentElement('afterend', hint);
    }

    let grid = q('.custom-tab-template-grid-v53', section);
    if (!grid) {
      grid = document.createElement('div');
      grid.className = 'custom-tab-template-grid-v53';
      section.appendChild(grid);
    }
    grid.style.setProperty('display', 'grid', 'important');
    grid.style.gridTemplateColumns = 'repeat(2, minmax(0, 1fr))';
    grid.style.gap = '8px';
    grid.innerHTML = '';

    templates.forEach(template => {
      if (stateForV330(template.id) !== 'active') return;
      const card = document.createElement('button');
      card.type = 'button';
      card.className = 'custom-tab-template-card-v53';
      card.dataset.customTabTemplateV53 = String(template.id);
      card.dataset.templateNameV330 = String(template.name || 'Template');
      card.dataset.templateIconV330 = String(template.icon || 'ph-tabs');

      const iconWrap = document.createElement('span');
      iconWrap.className = 'custom-tab-template-icon-v53';
      const icon = document.createElement('i');
      icon.className = `ph ${String(template.icon || 'ph-tabs').replace(/[^a-z0-9_-]/gi, '')}`;
      iconWrap.appendChild(icon);

      const copy = document.createElement('span');
      copy.className = 'custom-tab-template-copy-v53';
      const strong = document.createElement('strong');
      strong.textContent = String(template.name || 'Template');
      const small = document.createElement('small');
      small.textContent = String(template.description || '');
      copy.append(strong, small);

      const check = document.createElement('i');
      check.className = 'ph ph-check-circle custom-tab-template-check-v53';
      card.append(iconWrap, copy, check);
      grid.appendChild(card);
    });

    /* If older settings somehow hide every built-in, do not leave a blank hole.
       Newly introduced V328/V329 templates are restored to active automatically. */
    if (!grid.children.length) {
      try {
        const appDb = (typeof db !== 'undefined' ? db : window.db);
        const states = appDb?.settings?.builtInBlueprintStateV162;
        if (states && typeof states === 'object') {
          FALLBACK_V330.filter(item => /-v32[89]$/.test(item.id)).forEach(item => { delete states[item.id]; });
        }
      } catch {}
      FALLBACK_V330.filter(item => /-v32[89]$/.test(item.id)).forEach(template => {
        const card = document.createElement('button');
        card.type = 'button';
        card.className = 'custom-tab-template-card-v53';
        card.dataset.customTabTemplateV53 = template.id;
        card.dataset.templateNameV330 = template.name;
        card.dataset.templateIconV330 = template.icon;
        card.innerHTML = `<span class="custom-tab-template-icon-v53"><i class="ph ${template.icon}"></i></span><span class="custom-tab-template-copy-v53"><strong></strong><small></small></span><i class="ph ph-check-circle custom-tab-template-check-v53"></i>`;
        q('strong', card).textContent = template.name;
        q('small', card).textContent = template.description;
        grid.appendChild(card);
      });
    }

    /* Keep the requested modal order: name, icon search/icons, templates, then My Templates. */
    const iconSection = q('#custom-tab-icon-picker', modal)?.closest('.modal-section');
    if (iconSection && iconSection.nextElementSibling !== section) iconSection.insertAdjacentElement('afterend', section);
    const mine = q('.custom-blueprint-section-v162', modal);
    if (mine && section.nextElementSibling !== mine) section.insertAdjacentElement('afterend', mine);
  }

  function installStyleV330() {
    if (q('#loggy-v330-template-card-style')) return;
    const style = document.createElement('style');
    style.id = 'loggy-v330-template-card-style';
    style.textContent = `
      #custom-tab-create-modal .custom-tab-template-grid-v53{display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:8px!important;min-height:88px}
      #custom-tab-create-modal .custom-tab-template-card-v53:not(.hidden){display:grid!important;visibility:visible!important;opacity:1!important}
      @media(max-width:600px){#custom-tab-create-modal .custom-tab-template-grid-v53{grid-template-columns:1fr!important}}
    `;
    document.head.appendChild(style);
  }

  installStyleV330();

  try {
    const beforeOpenV330 = openCustomTabCreateModal;
    openCustomTabCreateModal = function() {
      renderTemplateCardsV330();
      const result = beforeOpenV330.apply(this, arguments);
      renderTemplateCardsV330();
      requestAnimationFrame(renderTemplateCardsV330);
      setTimeout(renderTemplateCardsV330, 0);
      setTimeout(renderTemplateCardsV330, 60);
      return result;
    };
  } catch {}

  document.addEventListener('click', event => {
    if (!event.target?.closest?.('#add-custom-tab-btn,[data-action="create-tab"]')) return;
    requestAnimationFrame(renderTemplateCardsV330);
    setTimeout(renderTemplateCardsV330, 0);
    setTimeout(renderTemplateCardsV330, 60);
  }, true);

  const bootV330 = () => {
    renderTemplateCardsV330();
    const modal = q('#custom-tab-create-modal');
    if (!modal || modal.dataset.v330TemplateObserver === '1') return;
    modal.dataset.v330TemplateObserver = '1';
    try {
      new MutationObserver(() => {
        const section = q('.custom-tab-template-section-v53', modal);
        const grid = q('.custom-tab-template-grid-v53', section);
        if (!section || !grid || !grid.children.length) renderTemplateCardsV330();
      }).observe(modal, { childList: true, subtree: true });
    } catch {}
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => requestAnimationFrame(bootV330), { once: true });
  else requestAnimationFrame(bootV330);
})();

// ============================================================================
// V336 retired code removed in V366. V350 is the only Across Screen runtime.
// ============================================================================

// ============================================================================
// V337 — AUTHORITATIVE TAB TEMPLATE SELECTION + CLEAR CONNECTIONS HELP
// Rebuilt Tab Template cards no longer depend on whichever historical section
// listener survived the modal rebuild. Window-capture owns built-in selection.
// Also replaces the generic Daily Log Connections ? tooltip with usage guidance.
// ============================================================================
(() => {
  'use strict';
  if (window.__loggyTabTemplatesConnectionsHelpV337) return;
  window.__loggyTabTemplatesConnectionsHelpV337 = true;

  const q = (selector, root = document) => root?.querySelector?.(selector) || null;
  const qa = (selector, root = document) => Array.from(root?.querySelectorAll?.(selector) || []);

  function templateDefV337(id, card = null) {
    try {
      const list = Array.isArray(CUSTOM_TAB_TEMPLATES_V53) ? CUSTOM_TAB_TEMPLATES_V53 : [];
      const found = list.find(item => String(item?.id || '') === String(id || ''));
      if (found) return found;
    } catch {}
    return {
      id: String(id || ''),
      name: String(card?.dataset?.templateNameV330 || q('strong', card)?.textContent || 'Template').trim(),
      icon: String(card?.dataset?.templateIconV330 || q('.custom-tab-template-icon-v53 i', card)?.className?.match(/ph-[a-z0-9-]+/i)?.[0] || 'ph-squares-four')
    };
  }

  function selectIconV337(modal, icon) {
    try {
      if (typeof selectTemplateIconV53 === 'function') {
        selectTemplateIconV53(modal, icon);
        return;
      }
    } catch {}
    const choices = qa('#custom-tab-icon-picker .custom-tab-icon-choice', modal);
    choices.forEach(choice => choice.classList.remove('selected'));
    const match = choices.find(choice => String(choice.dataset.icon || '') === String(icon || '')) || choices[0];
    match?.classList.add('selected');
  }

  function applyTemplateSelectionV337(modal, card) {
    if (!modal || !card) return;
    const id = String(card.dataset.customTabTemplateV53 || '');
    if (!id) return;

    // Built-in and saved user templates are mutually exclusive.
    delete modal.dataset.selectedBlueprintV162;
    qa('.custom-template-card-v162.selected', modal).forEach(item => item.classList.remove('selected'));

    // Clicking a built-in template always selects it. Clicking it again does not
    // silently deselect it; choose another template to change the selection.
    modal.dataset.selectedTemplateV53 = id;
    qa('[data-custom-tab-template-v53]', modal).forEach(item => {
      item.classList.toggle('selected', item === card);
      item.setAttribute('aria-pressed', item === card ? 'true' : 'false');
    });

    const def = templateDefV337(id, card);
    const name = q('#custom-tab-name-input', modal);
    const previous = String(modal.dataset.lastTemplateNameV53 || '');
    if (name && (!name.value.trim() || name.value === previous)) {
      name.value = String(def?.name || card.dataset.templateNameV330 || 'Template');
      name.dispatchEvent(new Event('input', { bubbles: true }));
    }
    modal.dataset.lastTemplateNameV53 = String(def?.name || card.dataset.templateNameV330 || 'Template');
    selectIconV337(modal, String(def?.icon || card.dataset.templateIconV330 || 'ph-squares-four'));
  }

  // Window capture runs before the older document/section handlers, so one
  // click cannot be processed twice and toggle itself back off.
  window.addEventListener('click', event => {
    const card = event.target?.closest?.('#custom-tab-create-modal [data-custom-tab-template-v53]');
    if (!card) return;
    const modal = card.closest('#custom-tab-create-modal');
    if (!modal) return;
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    applyTemplateSelectionV337(modal, card);
  }, true);

  function restoreSelectedCardV337(modal) {
    if (!modal) return;
    const id = String(modal.dataset.selectedTemplateV53 || '');
    qa('[data-custom-tab-template-v53]', modal).forEach(card => {
      const selected = !!id && String(card.dataset.customTabTemplateV53 || '') === id;
      card.classList.toggle('selected', selected);
      card.setAttribute('aria-pressed', selected ? 'true' : 'false');
    });
  }

  // If any late repair re-renders the grid, put the selected state back onto
  // the newly-created card instead of making the choice appear to disappear.
  function observeCreateModalV337() {
    const modal = q('#custom-tab-create-modal');
    if (!modal || modal.dataset.v337TemplateObserver === '1') return;
    modal.dataset.v337TemplateObserver = '1';
    try {
      new MutationObserver(() => restoreSelectedCardV337(modal)).observe(modal, {
        childList: true,
        subtree: true
      });
    } catch {}
  }

  try {
    const before = window.openCustomTabCreateModal;
    if (typeof before === 'function' && !before.__v337TemplateSelection) {
      const wrapped = function() {
        const result = before.apply(this, arguments);
        observeCreateModalV337();
        requestAnimationFrame(() => restoreSelectedCardV337(q('#custom-tab-create-modal')));
        return result;
      };
      wrapped.__v337TemplateSelection = true;
      window.openCustomTabCreateModal = wrapped;
      try { openCustomTabCreateModal = wrapped; } catch {}
    }
  } catch {}

  const CONNECTION_HELP_V337 = {
    title: 'Daily Log Connections',
    what: 'Shows an undirected graph of which Daily Log days are connected to each other.',
    how: 'To use it: open any Daily Log, type @ and link another Day in Log Notes. That creates one line between the two Day nodes automatically. The link works both ways, so it does not matter which Day contains the @Day reference. Click a Day node to open that log.',
    example: 'Example: if Day 12 contains @Day 3, the graph shows one connection: Day 12 — Day 3. Adding @Day 12 inside Day 3 will not create a duplicate line.'
  };

  function componentForWrapV337(tab, wrap, index) {
    const id = String(wrap?.dataset?.componentId || '');
    const list = Array.isArray(tab?.components) ? tab.components : [];
    return (id ? list.find(component => String(component?.id || '') === id) : null) || list[index] || null;
  }

  function patchConnectionsHelpV337(tab, canvas) {
    if (!tab || !canvas) return;
    qa('.custom-tab-component', canvas).forEach((wrap, index) => {
      const component = componentForWrapV337(tab, wrap, index);
      if (component?.type !== 'dailyConnectionsGraph') return;

      let button = q('.custom-component-help-v163', wrap);
      if (!button) {
        button = document.createElement('button');
        button.type = 'button';
        button.className = 'custom-component-help-v163';
        button.textContent = '?';
        wrap.appendChild(button);
      }
      button.setAttribute('aria-label', 'How Daily Log Connections works');
      button.title = 'How Daily Log Connections works';

      let tip = q('.custom-component-help-tooltip-v163', button);
      if (!tip) {
        tip = document.createElement('div');
        tip.className = 'custom-component-help-tooltip-v163';
        button.appendChild(tip);
      }
      tip.innerHTML = '';
      const strong = document.createElement('strong');
      const what = document.createElement('span');
      const how = document.createElement('span');
      const example = document.createElement('small');
      strong.textContent = CONNECTION_HELP_V337.title;
      what.textContent = CONNECTION_HELP_V337.what;
      how.textContent = CONNECTION_HELP_V337.how;
      example.textContent = CONNECTION_HELP_V337.example;
      tip.append(strong, what, how, example);
    });
  }

  try {
    const beforeCanvas = window.renderCustomCanvas || (typeof renderCustomCanvas === 'function' ? renderCustomCanvas : null);
    if (typeof beforeCanvas === 'function' && !beforeCanvas.__v337ConnectionsHelp) {
      const wrappedCanvas = function(tab, canvas) {
        const result = beforeCanvas.apply(this, arguments);
        try { patchConnectionsHelpV337(tab, canvas); } catch {}
        requestAnimationFrame(() => { try { patchConnectionsHelpV337(tab, canvas); } catch {} });
        return result;
      };
      wrappedCanvas.__v337ConnectionsHelp = true;
      window.renderCustomCanvas = wrappedCanvas;
      try { renderCustomCanvas = wrappedCanvas; } catch {}
    }
  } catch {}

  function bootV337() {
    observeCreateModalV337();
    try {
      const tabId = typeof activeCustomTabId !== 'undefined' ? activeCustomTabId : '';
      const tab = tabId && typeof getCustomTab === 'function' ? getCustomTab(tabId) : null;
      const canvas = tabId ? q(`#custom-tab-view-${CSS.escape(String(tabId))} .custom-tab-canvas`) : null;
      if (tab && canvas) patchConnectionsHelpV337(tab, canvas);
    } catch {}
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', bootV337, { once: true });
  else bootV337();
})();

// ============================================================================
// V339 — AUTHORITATIVE TAB TEMPLATE CREATION + SPECIAL TABS + UNDIRECTED LINKS
// The selected template now owns the Create Tab action at window-capture level,
// so old create handlers cannot create an empty shell. Existing empty tabs that
// clearly match a built-in template are repaired once. Whiteboard/Notebook keep
// their special component types, which sends them to the full-screen runtimes.
// Daily Log Connections are rebuilt from saved note @Day links as an undirected
// graph: one edge {A,B} exists whether A mentions B, B mentions A, or both.
// ============================================================================
(() => {
  'use strict';
  if (window.__loggyV339TemplateCreationConnections) return;
  window.__loggyV339TemplateCreationConnections = true;

  const q = (selector, root = document) => root?.querySelector?.(selector) || null;
  const qa = (selector, root = document) => Array.from(root?.querySelectorAll?.(selector) || []);
  const clone = value => { try { return JSON.parse(JSON.stringify(value)); } catch { return value; } };
  const makeId = prefix => {
    try { if (typeof customId === 'function') return customId(prefix); } catch {}
    return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,8)}`;
  };

  const TEMPLATE_META_V339 = [
    { id:'whiteboard-v197', name:'Whiteboard', icon:'ph-selection-background' },
    { id:'notepad-v249', name:'Notebook', icon:'ph-notebook' },
    { id:'personal-dashboard-v328', name:'Personal Dashboard', icon:'ph-gauge' },
    { id:'study-center-v328', name:'Study Center', icon:'ph-graduation-cap' },
    { id:'project-workspace-v328', name:'Project Workspace', icon:'ph-kanban' },
    { id:'habit-practice-v328', name:'Habit & Practice', icon:'ph-repeat' },
    { id:'milestones-goals-v329', name:'Milestones & Goals', icon:'ph-target' },
    { id:'media-board-v328', name:'Media & Inspiration', icon:'ph-images-square' }
  ];

  const metaByIdV339 = id => TEMPLATE_META_V339.find(item => item.id === String(id || '')) || null;

  function componentV339(type, patch = {}) {
    let base = null;
    try { if (typeof defaultCustomComponent === 'function') base = defaultCustomComponent(type); } catch {}
    if (!base || typeof base !== 'object') base = { id:makeId('component'), type };
    return Object.assign(base, clone(patch || {}), { type });
  }

  function checklistV339(title, labels) {
    const component = componentV339('checklist', { title });
    component.items = (labels || []).map(text => ({ id:makeId('check'), text, done:false, completedAt:null }));
    return component;
  }

  function cardsV339(title, items) {
    const component = componentV339('cards', { title });
    component.items = (items || []).map(item => ({ id:makeId('card'), title:String(item?.title || ''), body:String(item?.body || '') }));
    return component;
  }

  function tableV339(title, columnNames) {
    const component = componentV339('tableV162', { title });
    const columns = (columnNames || []).map(name => ({ id:makeId('col'), name }));
    component.columns = columns;
    component.rows = [{ id:makeId('row'), cells:Object.fromEntries(columns.map(column => [column.id, ''])) }];
    return component;
  }

  function fallbackTemplateComponentsV339(templateId) {
    switch (String(templateId || '')) {
      case 'whiteboard-v197':
        return [{ id:makeId('component'), type:'miroWhiteboardV197', title:'Whiteboard' }];
      case 'notepad-v249':
        return [{ id:makeId('component'), type:'fullNotepadV249', title:'Notebook' }];
      case 'personal-dashboard-v328':
        return [
          componentV339('globalSearchV163', { placeholder:'Search this dashboard...' }),
          componentV339('goalsV162', { title:'Goals' }),
          componentV339('progressMeter', { title:'Current Progress', target:7, unit:'steps' }),
          checklistV339('Top Priorities', [
            'Choose today’s most important task',
            'Finish one meaningful next action',
            'Review what needs attention next'
          ]),
          cardsV339('Quick Notes', [
            { title:'Remember', body:'Keep an important reminder here.' },
            { title:'Idea', body:'Capture something worth returning to.' }
          ]),
          componentV339('dailyLogCollection', { title:'Recent Daily Log Activity', sources:['notes','knowledge','resources'] })
        ];
      case 'study-center-v328':
        return [
          componentV339('globalSearchV163', { placeholder:'Search everything in this study center...' }),
          checklistV339('Study Queue', ['Choose what to review','Practice active recall','Mark the next topic to revisit']),
          componentV339('kbDynamicCollectionV162', { title:'Study Material', display:'cards' }),
          componentV339('vocabulary', { title:'Key Terms' }),
          componentV339('qaV162', { title:'Questions & Answers' }),
          componentV339('resources', { title:'Study Resources' })
        ];
      case 'project-workspace-v328':
        return [
          componentV339('goalsV162', { title:'Project Goals' }),
          checklistV339('Next Actions', ['Define the next deliverable','Choose the next concrete action','Review blockers and progress']),
          componentV339('milestones', { title:'Milestones' }),
          tableV339('Project Board', ['Task','Status','Notes']),
          componentV339('resources', { title:'References & Links' }),
          componentV339('projectGallery', { title:'Project Gallery' })
        ];
      case 'habit-practice-v328':
        return [
          componentV339('progressMeter', { title:'Weekly Target', target:5, unit:'sessions' }),
          checklistV339('Routine', ['Start with the smallest version of the habit','Log the session','Write one thing to improve next time']),
          componentV339('practiceLog', { title:'Practice Sessions' }),
          componentV339('skillRatings', { title:'Skill Check-In' }),
          componentV339('milestones', { title:'Milestones' })
        ];
      case 'milestones-goals-v329':
        return [
          componentV339('goalsV162', { title:'Goals' }),
          componentV339('progressMeter', { title:'Overall Progress', target:5, unit:'goals' }),
          checklistV339('Next Actions', ['Choose the goal that matters most right now','Write the next concrete action','Review progress and update the next step']),
          componentV339('milestones', { title:'Milestones' }),
          tableV339('Goal Planner', ['Goal','Target Date','Status','Notes'])
        ];
      case 'media-board-v328':
        return [
          componentV339('globalSearchV163', { placeholder:'Search this media board...' }),
          componentV339('polaroids', { title:'Moodboard', items:[] }),
          componentV339('projectGallery', { title:'Visual Projects' }),
          componentV339('resources', { title:'Links & References' }),
          componentV339('dailyLogCollection', { title:'Saved Daily Log Media', sources:['images','videos','pdfs','audio','resources'] })
        ];
      default:
        return [];
    }
  }

  function buildTemplateComponentsV339(templateId) {
    let components = [];
    try {
      if (typeof buildPrebuiltTabComponentsV53 === 'function') {
        const built = buildPrebuiltTabComponentsV53(templateId);
        if (Array.isArray(built)) components = built.filter(Boolean);
      }
    } catch (error) {
      console.warn('V339 prebuilt component builder failed; using fallback', error);
    }
    if (!components.length) components = fallbackTemplateComponentsV339(templateId);
    return clone(components || []);
  }

  function addOptionalCreateContentV339(tab, modal) {
    // Whiteboard and Notebook are dedicated full-screen apps. Do not attach
    // normal custom-tab sections to them; those sections would never be shown.
    if (['whiteboard-v197','notepad-v249'].includes(String(tab.templateIdV53 || ''))) return;

    const chosenDailySources = qa('.custom-tab-daily-source-grid input[type="checkbox"]:checked', modal).map(input => input.value);
    if (chosenDailySources.length) {
      const existing = tab.components.find(component => component?.type === 'dailyLogCollection');
      if (existing) existing.sources = Array.from(new Set([...(existing.sources || []), ...chosenDailySources]));
      else tab.components.push(componentV339('dailyLogCollection', { sources:chosenDailySources }));
    }

    if (q('#custom-tab-add-connections-map', modal)?.checked && !tab.components.some(component => component?.type === 'dailyConnectionsGraph')) {
      tab.components.push({ id:makeId('component'), type:'dailyConnectionsGraph', title:'Daily Log Connections', titleBackground:'none' });
    }
  }

  function createSelectedTemplateV339(modal, templateId) {
    if (!modal || !templateId) return null;
    const meta = metaByIdV339(templateId) || (() => {
      try {
        const found = (Array.isArray(CUSTOM_TAB_TEMPLATES_V53) ? CUSTOM_TAB_TEMPLATES_V53 : []).find(item => String(item?.id || '') === String(templateId));
        return found ? { id:String(found.id), name:String(found.name || 'My Tab'), icon:String(found.icon || 'ph-squares-four') } : null;
      } catch { return null; }
    })();
    if (!meta) return null;

    const input = q('#custom-tab-name-input', modal);
    const selectedIcon = q('#custom-tab-icon-picker .custom-tab-icon-choice.selected', modal)?.dataset?.icon;
    const tab = {
      id:makeId('tab'),
      name:String(input?.value || '').trim() || meta.name,
      icon:String(selectedIcon || meta.icon || 'ph-squares-four'),
      templateIdV53:String(templateId),
      components:buildTemplateComponentsV339(templateId)
    };

    // V484: Whiteboard and Notebook are real special tabs, not ordinary
    // component canvases. Give them their runtime state at creation time so
    // later wrappers never have to infer/repair a half-created tab.
    if (String(templateId) === 'whiteboard-v197') {
      const boardId = makeId('board');
      tab.whiteboardV198 = {
        version:198,
        theme:'light',
        activeBoardId:boardId,
        folders:[],
        boards:[{
          id:boardId,
          name:'Board 1',
          camera:{x:160,y:120,zoom:.72},
          notes:[],images:[],texts:[],strokes:[],connections:[],
          folderId:'',tags:[],createdAt:Date.now(),updatedAt:Date.now()
        }]
      };
    } else if (String(templateId) === 'notepad-v249') {
      const categoryId = makeId('notepad-category');
      const pageId = makeId('notepad-page');
      tab.notepadV249 = {
        version:249,
        activeCategoryId:categoryId,
        activePageId:pageId,
        categories:[{id:categoryId,name:'Notebook 1'}],
        pages:[{
          id:pageId,title:'Page 1',categoryId,paper:'lined',html:'',images:[],
          createdAt:Date.now(),updatedAt:Date.now()
        }]
      };
    }

    addOptionalCreateContentV339(tab, modal);

    if (!Array.isArray(tab.components) || !tab.components.length) {
      console.error('V339 refused to create an empty built-in template', templateId);
      return null;
    }

    const tabs = typeof getCustomTabs === 'function' ? getCustomTabs() : null;
    if (!Array.isArray(tabs)) return null;
    tabs.push(tab);
    try { saveDb(); } catch {}
    try { closeCustomTabCreateModal?.(); } catch { modal.classList.add('hidden'); }
    try { renderCustomTabNavigation?.(); } catch {}

    // Build the view through the current wrapper chain. For Whiteboard/Notebook,
    // extras-5 replaces this with the full-screen host instead of a normal canvas.
    let view = null;
    try { view = buildCustomTabView(tab); } catch (error) { console.error('V339 could not build template view', error); }
    if (view) {
      const existing = document.getElementById(`custom-tab-view-${tab.id}`);
      if (existing) existing.replaceWith(view);
      else document.body.insertBefore(view, document.getElementById('companion-stage') || null);
    }
    try { activeCustomTabId = tab.id; } catch {}
    try { customTabEditMode = false; } catch {}
    try { renderCustomTabView(tab.id); } catch {}
    try {
      const special = ['whiteboard-v197','notepad-v249'].includes(String(templateId));
      if (special && typeof openCustomTab === 'function') {
        // V484: use the dedicated special-tab wrappers. Calling switchView
        // directly can skip the Whiteboard/Notebook bootstrap/mount path.
        openCustomTab(tab.id);
      } else {
        const liveView = document.getElementById(`custom-tab-view-${tab.id}`) || view;
        if (liveView) switchView(liveView);
        else openCustomTab?.(tab.id);
      }
    } catch (error) {
      console.error('V484 could not open newly-created template tab', error);
      try { openCustomTab?.(tab.id); } catch {}
    }
    return tab;
  }

  // Own template creation before any historical button listener runs.
  window.addEventListener('click', event => {
    const button = event.target?.closest?.('#custom-tab-create-modal #custom-tab-create-confirm');
    if (!button) return;
    const modal = button.closest('#custom-tab-create-modal');
    const templateId = String(modal?.dataset?.selectedTemplateV53 || '');
    if (!templateId) return; // plain custom tab: keep the normal create workflow
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    createSelectedTemplateV339(modal, templateId);
  }, true);

  function inferTemplateIdForEmptyTabV339(tab) {
    if (!tab || (Array.isArray(tab.components) && tab.components.length)) return '';
    const direct = String(tab.templateIdV53 || '');
    if (metaByIdV339(direct)) return direct;
    const name = String(tab.name || '').trim().toLowerCase();
    const icon = String(tab.icon || '');
    const match = TEMPLATE_META_V339.find(meta => meta.name.toLowerCase() === name && (!icon || icon === meta.icon));
    return match?.id || '';
  }

  function repairExistingEmptyTemplateTabsV339() {
    let tabs = [];
    try { tabs = typeof getCustomTabs === 'function' ? getCustomTabs() : []; } catch {}
    if (!Array.isArray(tabs)) return;
    let changed = false;
    tabs.forEach(tab => {
      const templateId = inferTemplateIdForEmptyTabV339(tab);
      if (!templateId) return;
      const components = buildTemplateComponentsV339(templateId);
      if (!components.length) return;
      tab.templateIdV53 = templateId;
      tab.components = components;
      changed = true;
    });
    if (!changed) return;
    try { saveDb(); } catch {}
    try { renderAllCustomTabViews?.(); } catch {}
    try { renderCustomTabNavigation?.(); } catch {}
  }

  // --------------------------------------------------------------------------
  // Robust @Day extraction and one canonical undirected edge per day pair.
  // --------------------------------------------------------------------------
  function extractDaysFromNotesV339(rawNotes) {
    const source = String(rawNotes || '');
    const days = new Set();
    const add = value => {
      const day = Math.floor(Number(value));
      if (Number.isFinite(day) && day > 0) days.add(day);
    };

    const directPatterns = [
      /data-day\s*=\s*["']?(\d+)/gi,
      /href\s*=\s*["'][^"']*#day(?:[-_/])(\d+)["']/gi,
      /@\s*day\s*#?\s*(\d+)/gi,
      /@\s*#?\s*(\d+)/g
    ];
    directPatterns.forEach(pattern => {
      let match;
      while ((match = pattern.exec(source))) add(match[1]);
    });

    // Parsed HTML catches links even when later code changes attribute ordering,
    // stores the day only in href, or changes the visible link text.
    try {
      const doc = new DOMParser().parseFromString(`<div>${source}</div>`, 'text/html');
      doc.querySelectorAll('[data-day]').forEach(node => add(node.getAttribute('data-day')));
      doc.querySelectorAll('a[href*="#day"]').forEach(node => {
        const match = String(node.getAttribute('href') || '').match(/#day(?:[-_/])(\d+)/i);
        if (match) add(match[1]);
      });
      doc.querySelectorAll('.notes-day-link-v38,.notes-day-link-v41').forEach(node => {
        const match = String(node.textContent || '').match(/(?:@\s*day\s*#?\s*|@\s*#?\s*)(\d+)/i);
        if (match) add(match[1]);
      });
      const text = String(doc.body?.textContent || '');
      for (const pattern of [/@\s*day\s*#?\s*(\d+)/gi, /@\s*#?\s*(\d+)/g]) {
        let match;
        while ((match = pattern.exec(text))) add(match[1]);
      }
    } catch {}
    return [...days];
  }

  function getUndirectedConnectionDataV339() {
    const edgeMap = new Map();
    const nodes = new Set();
    const addEdge = (sourceRaw, targetRaw, label = '@Day') => {
      const source = Math.floor(Number(sourceRaw));
      const target = Math.floor(Number(targetRaw));
      if (!Number.isFinite(source) || !Number.isFinite(target) || source < 1 || target < 1 || source === target) return;
      const a = Math.min(source, target);
      const b = Math.max(source, target);
      const key = `${a}-${b}`;
      nodes.add(a); nodes.add(b);
      let edge = edgeMap.get(key);
      if (!edge) {
        edge = { a, b, source:a, target:b, labels:[], kinds:[] };
        edgeMap.set(key, edge);
      }
      if (label && !edge.labels.includes(label)) edge.labels.push(label);
    };

    let days = {};
    try { days = db?.days || {}; } catch {}
    Object.entries(days || {}).forEach(([sourceValue, dayData]) => {
      const source = Math.floor(Number(sourceValue));
      if (!Number.isFinite(source) || source < 1) return;
      extractDaysFromNotesV339(dayData?.notes || '').forEach(target => addEdge(source, target, '@Day'));

      // Keep old manually saved links readable too, but canonicalize them into
      // the exact same undirected pair instead of creating two arrows.
      (Array.isArray(dayData?.connections) ? dayData.connections : []).forEach(raw => {
        let target = Number(raw?.targetDay ?? raw?.day ?? raw?.target ?? raw);
        let label = 'Connected';
        try {
          if (typeof normalizeDailyConnectionV32 === 'function') {
            const normalized = normalizeDailyConnectionV32(raw);
            target = Number(normalized?.targetDay);
            if (typeof getDailyConnectionRelationLabelV32 === 'function') label = getDailyConnectionRelationLabelV32(normalized?.relation) || label;
          }
        } catch {}
        addEdge(source, target, label);
      });
    });

    const edges = [...edgeMap.values()].sort((x,y) => x.a - y.a || x.b - y.b);
    return { nodes:[...nodes].sort((a,b) => a-b), edges };
  }

  function positionsV339(nodes) {
    const map = new Map();
    const count = nodes.length;
    if (!count) return map;
    if (count === 1) { map.set(nodes[0], {x:50,y:50}); return map; }
    const radius = Math.min(39, 27 + Math.min(12,count) * .9);
    nodes.forEach((day,index) => {
      const angle = -Math.PI/2 + (Math.PI*2*index/count);
      map.set(day, { x:50 + Math.cos(angle)*radius, y:50 + Math.sin(angle)*radius });
    });
    return map;
  }

  function escV339(value) {
    try { if (typeof escapeCustomHtml === 'function') return escapeCustomHtml(String(value ?? '')); } catch {}
    return String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  }

  function renderUndirectedConnectionsV339(tab, component, content) {
    if (!content) return;
    const { nodes, edges } = getUndirectedConnectionDataV339();
    const title = escV339(component?.title || 'Daily Log Connections');
    if (!edges.length) {
      content.innerHTML = `
        <div class="custom-collection-header daily-connections-map-header-v56">
          <div><h2>${title}</h2><small>Undirected graph built automatically from @Day links in Daily Log notes.</small></div>
        </div>
        <div class="feature-empty-state daily-connections-map-empty-v56">
          <i class="ph ph-share-network"></i>
          <strong>No @Day connections yet</strong>
          <span>In any Daily Log note, type @Day 4 (or use the @ Day link) to connect the current day with Day 4. The connection works both ways and appears here automatically.</span>
        </div>`;
      return;
    }

    const positions = positionsV339(nodes);
    content.innerHTML = `
      <div class="custom-collection-header daily-connections-map-header-v56">
        <div><h2>${title}</h2><small>Undirected graph · ${nodes.length} day${nodes.length===1?'':'s'} · ${edges.length} connection${edges.length===1?'':'s'}</small></div>
      </div>
      <div class="daily-undirected-graph-v56">
        <svg class="daily-undirected-graph-lines-v56" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          ${edges.map(edge => {
            const a = positions.get(edge.a), b = positions.get(edge.b);
            return `<line x1="${a.x}" y1="${a.y}" x2="${b.x}" y2="${b.y}"></line>`;
          }).join('')}
        </svg>
        ${nodes.map(day => {
          const point = positions.get(day);
          return `<button type="button" class="daily-undirected-node-v56" data-open-day-v339="${day}" style="left:${point.x}%;top:${point.y}%;"><span>Day</span><strong>${day}</strong></button>`;
        }).join('')}
      </div>`;

    qa('[data-open-day-v339]', content).forEach(button => button.addEventListener('click', () => {
      const day = Number(button.dataset.openDayV339);
      if (Number.isFinite(day) && day > 0) openDayLog?.(day);
    }));
  }

  // Replace the late graph renderer and the data accessor. extras-3 already
  // expects an undirected graph; exposing canonical pairs here also keeps any
  // other callers from seeing duplicate A→B / B→A edges.
  try { getDailyConnectionMapDataV55 = getUndirectedConnectionDataV339; } catch {}
  try { renderDailyConnectionsMapV55 = renderUndirectedConnectionsV339; } catch {}

  // Keep the help text accurate: there is no source/target direction anymore.
  try {
    const previousRender = renderCustomTabView;
    if (typeof previousRender === 'function' && !previousRender.__v339ConnectionHelp) {
      const wrapped = function(tabId) {
        const result = previousRender.apply(this, arguments);
        requestAnimationFrame(() => {
          const view = document.getElementById(`custom-tab-view-${tabId}`);
          qa('.custom-tab-component', view).forEach(wrap => {
            const button = q('.custom-component-help-v163', wrap);
            if (!button) return;
            const componentId = String(wrap.dataset.componentId || '');
            let component = null;
            try { component = getCustomTab?.(tabId)?.components?.find(item => String(item?.id || '') === componentId); } catch {}
            if (component?.type !== 'dailyConnectionsGraph') return;
            button.title = 'Daily Log Connections: each @Day link creates one undirected line between the two day nodes. Example: @Day 3 inside Day 12 connects Day 12 — Day 3. It does not matter which day contains the link.';
            button.setAttribute('aria-label', button.title);
          });
        });
        return result;
      };
      wrapped.__v339ConnectionHelp = true;
      renderCustomTabView = wrapped;
    }
  } catch {}

  function bootV339() {
    repairExistingEmptyTemplateTabsV339();
    // Data loading can finish shortly after the feature chunk on a cold start.
    // Re-run the idempotent repair after that window so previously-created blank
    // starter tabs are fixed even if db.customTabs was not hydrated on first pass.
    setTimeout(repairExistingEmptyTemplateTabsV339, 250);
    setTimeout(repairExistingEmptyTemplateTabsV339, 1000);
    // An already-visible Connections tab should refresh immediately after this
    // feature chunk finishes loading instead of waiting for the user to reopen it.
    try {
      const active = document.querySelector('.custom-tab-view.view.active[data-custom-tab-id]');
      if (active?.dataset?.customTabId) renderCustomTabView(active.dataset.customTabId);
    } catch {}
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => requestAnimationFrame(bootV339), { once:true });
  else requestAnimationFrame(bootV339);
})();

// ============================================================================
// V340 — SHARED RECORD FIELDS FOR CARDS / POLAROIDS / KANBAN + PRACTICE POLISH
// - "Practice This Category" is simply "Practice" and answer choices get usable width.
// - Cards and Polaroids share a reusable KB-style field schema with every KB kind.
// - Cards gain a Polaroid card style with independent image-area / bottom-area fields.
// - Kanban columns use right-click (no kebab button) and Kanban cards reuse the same
//   field schema/editor as Cards. Card text is constrained so it cannot overflow.
// ============================================================================
(() => {
  'use strict';
  if (window.__loggyV340SharedRecordFields) return;
  window.__loggyV340SharedRecordFields = true;

  const q=(s,r=document)=>r?.querySelector?.(s)||null;
  const qa=(s,r=document)=>Array.from(r?.querySelectorAll?.(s)||[]);
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const uid=p=>{try{return typeof customId==='function'?customId(p):`${p}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,8)}`}catch{return `${p}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,8)}`}};
  const save=()=>{try{return saveDb()}catch{return Promise.resolve()}};

  const FIELD_KINDS_V340 = [
    ['text','Text','ph-text-t'],
    ['video','Video','ph-video-camera'],
    ['image','Image','ph-image'],
    ['svg','SVG','ph-code'],
    ['select','Select','ph-list-bullets'],
    ['rating','Rating','ph-star'],
    ['pinnedImage','Pinned Image / Map','ph-map-pin'],
    ['latex','LaTeX / Math','ph-function'],
    ['attachment','Attachment','ph-paperclip'],
    ['numberFormat','Number','ph-hash'],
    ['dateTime','Date / Time','ph-calendar'],
    ['boolean','Yes / No','ph-toggle-right']
  ];
  const FIELD_KIND_SET_V340 = new Set(FIELD_KINDS_V340.map(x=>x[0]));

  function fieldV340(name='Field',kind='text',area='bottom'){
    return {id:uid('field'),name,kind:FIELD_KIND_SET_V340.has(kind)?kind:'text',areaV340:area,options:[],maxRating:5};
  }
  function fieldsForV340(component,type='cards'){
    if(!Array.isArray(component.recordFieldsV340)||!component.recordFieldsV340.length){
      if(type==='polaroids') component.recordFieldsV340=[fieldV340('Image','image','image'),fieldV340('Caption','text','bottom')];
      else component.recordFieldsV340=[fieldV340('Title','text','bottom'),fieldV340('Description','text','bottom')];
    }
    component.recordFieldsV340=component.recordFieldsV340.map((raw,i)=>({
      id:String(raw?.id||uid('field')),name:String(raw?.name||`Field ${i+1}`),kind:FIELD_KIND_SET_V340.has(String(raw?.kind||''))?String(raw.kind):'text',
      areaV340:['image','bottom','hidden'].includes(raw?.areaV340)?raw.areaV340:'bottom',options:Array.isArray(raw?.options)?raw.options.map(String):[],maxRating:Math.max(1,Math.min(10,Number(raw?.maxRating)||5))
    }));
    return component.recordFieldsV340;
  }
  function ensureItemValuesV340(component,item,type='cards'){
    item.valuesV340=item.valuesV340&&typeof item.valuesV340==='object'?item.valuesV340:{};
    const fields=fieldsForV340(component,type);
    if(type==='cards'){
      const t=fields.find(f=>/^title$/i.test(f.name))||fields[0], d=fields.find(f=>/description|body|text/i.test(f.name)&&f!==t)||fields[1];
      if(t&&item.valuesV340[t.id]==null&&item.title!=null)item.valuesV340[t.id]=item.title;
      if(d&&item.valuesV340[d.id]==null&&item.body!=null)item.valuesV340[d.id]=item.body;
    } else if(type==='polaroids'){
      const image=fields.find(f=>f.kind==='image'), caption=fields.find(f=>/caption|title|name/i.test(f.name))||fields.find(f=>f.kind==='text');
      if(image&&item.valuesV340[image.id]==null&&item.image)item.valuesV340[image.id]=item.image;
      if(caption&&item.valuesV340[caption.id]==null&&item.caption!=null)item.valuesV340[caption.id]=item.caption;
      // Preserve pre-existing non-image polaroid media by adding a matching field once.
      if(item.youtubeUrl||item.mp4Url){
        let vf=fields.find(f=>f.kind==='video'); if(!vf){vf=fieldV340('Video','video','image');component.recordFieldsV340.push(vf)}
        if(item.valuesV340[vf.id]==null)item.valuesV340[vf.id]=item.youtubeUrl||item.mp4Url||'';
      }
      if(item.pdfUrl){
        let af=fields.find(f=>f.kind==='attachment'); if(!af){af=fieldV340('PDF / Attachment','attachment','image');component.recordFieldsV340.push(af)}
        if(item.valuesV340[af.id]==null)item.valuesV340[af.id]=JSON.stringify({name:'PDF',url:item.pdfUrl});
      }
    }
    return item.valuesV340;
  }
  function readValueV340(item,field){return item?.valuesV340?.[field.id]??''}
  function setValueV340(item,field,value){item.valuesV340||(item.valuesV340={});item.valuesV340[field.id]=value}

  function parseAttachmentV340(value){
    if(!value)return null;if(typeof value==='object')return value;
    try{const j=JSON.parse(value);if(j&&typeof j==='object')return j}catch{}
    return {name:'Attachment',url:String(value)};
  }
  function youtubeIdV340(url){const s=String(url||'');const m=s.match(/(?:youtu\.be\/|v=|shorts\/|embed\/)([A-Za-z0-9_-]{6,})/);return m?.[1]||''}
  function displayFieldV340(field,value,compact=false){
    if(value==null||value==='') return '';
    const label=`<small class="v340-record-label">${esc(field.name)}</small>`;
    if(field.kind==='image'||field.kind==='pinnedImage') return `<div class="v340-record-media"><img src="${esc(String(value))}" alt=""></div>`;
    if(field.kind==='video'){
      const id=youtubeIdV340(value);return id?`<div class="v340-record-media"><img src="https://i.ytimg.com/vi/${esc(id)}/hqdefault.jpg" alt=""><span class="v340-media-badge"><i class="ph ph-play"></i></span></div>`:`<div class="v340-record-value">${label}<span>${esc(value)}</span></div>`;
    }
    if(field.kind==='svg'){
      let safe='';try{safe=typeof safeSvgForKnowledgeBase==='function'?safeSvgForKnowledgeBase(String(value)):''}catch{}return safe?`<div class="v340-record-media v340-svg">${safe}</div>`:`<div class="v340-record-value">${label}<span>SVG</span></div>`;
    }
    if(field.kind==='rating'){const n=Math.max(0,Math.min(field.maxRating||5,Number(value)||0));return `<div class="v340-record-value">${label}<span class="v340-stars">${Array.from({length:field.maxRating||5},(_,i)=>`<i class="ph${i<n?'-fill':''} ph-star"></i>`).join('')}</span></div>`}
    if(field.kind==='attachment'){const a=parseAttachmentV340(value);return a?`<div class="v340-record-value">${label}<a href="${esc(a.url||a.src||'#')}" target="_blank" rel="noopener"><i class="ph ph-paperclip"></i> ${esc(a.name||'Attachment')}</a></div>`:''}
    if(field.kind==='boolean') return `<div class="v340-record-value">${label}<span>${String(value)==='true'||value===true?'Yes':'No'}</span></div>`;
    if(field.kind==='dateTime'){let text=String(value);try{const j=JSON.parse(text);text=[j.start,j.end].filter(Boolean).join(' → ')||text}catch{}return `<div class="v340-record-value">${label}<span>${esc(text)}</span></div>`}
    if(field.kind==='latex'){let html='';try{html=typeof renderLatex==='function'?renderLatex(String(value)):''}catch{}return `<div class="v340-record-value">${label}<span>${html||esc(value)}</span></div>`}
    return `<div class="v340-record-value${compact?' compact':''}">${label}<span>${esc(String(value)).replace(/\n/g,'<br>')}</span></div>`;
  }
  function cardSearchV340(component,item,type){ensureItemValuesV340(component,item,type);return fieldsForV340(component,type).map(f=>String(readValueV340(item,f)||'')).join(' ').toLowerCase()}

  function ensureStyleV340(){if(q('#loggy-v340-style'))return;const s=document.createElement('style');s.id='loggy-v340-style';s.textContent=`
    .custom-component-practiceCategoryV244 .custom-collection-header h2,.custom-component-practiceCategoryV244 h2:first-of-type{white-space:nowrap!important}
    .custom-component-practiceCategoryV244 [class*="answer"],.custom-component-practiceCategoryV244 [class*="choice"],.custom-component-practiceCategoryV244 [class*="option"]{min-width:0!important;max-width:none!important}
    .custom-component-practiceCategoryV244 [class*="answers"],.custom-component-practiceCategoryV244 [class*="choices"],.custom-component-practiceCategoryV244 [class*="options"]{display:grid!important;grid-template-columns:repeat(auto-fit,minmax(180px,1fr))!important;gap:10px!important;width:100%!important}
    .custom-component-practiceCategoryV244 button[class*="answer"],.custom-component-practiceCategoryV244 button[class*="choice"],.custom-component-practiceCategoryV244 button[class*="option"]{width:100%!important;min-width:160px!important;white-space:normal!important;word-break:normal!important;overflow-wrap:break-word!important;line-height:1.25!important;padding:10px 12px!important}.custom-component-practiceCategoryV244 .custom-component-content{width:100%!important;min-width:0!important}.custom-component-practiceCategoryV244 .custom-component-content button:not(.small-icon-btn):not(.filter-tab){min-width:160px!important;max-width:100%!important;white-space:normal!important;overflow-wrap:break-word!important}
    .v340-record-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:12px}.v340-record-card{min-width:0;overflow:hidden;border:var(--thin-border);border-radius:var(--border-radius);background:var(--white);padding:12px;display:grid;gap:9px}.v340-record-card h3,.v340-kanban-card h3{margin:0;max-width:100%;overflow-wrap:anywhere;word-break:break-word;white-space:normal}.v340-record-value{min-width:0;display:grid;gap:2px}.v340-record-value>span,.v340-record-value>a{min-width:0;max-width:100%;overflow-wrap:anywhere;word-break:break-word;white-space:normal}.v340-record-label{opacity:.62;font-weight:700}.v340-record-media{position:relative;width:100%;min-height:110px;display:grid;place-items:center;overflow:hidden;border-radius:9px;background:var(--track-bg)}.v340-record-media img{width:100%;height:100%;max-height:260px;object-fit:cover;display:block}.v340-svg svg{max-width:100%;max-height:230px}.v340-stars{display:flex!important;gap:2px}.v340-media-badge{position:absolute;display:grid;place-items:center;width:34px;height:34px;border-radius:50%;background:rgba(0,0,0,.62);color:#fff}
    .v340-record-grid.is-polaroid{grid-template-columns:repeat(auto-fill,minmax(190px,1fr));align-items:start}.v340-polaroid-card{padding:10px 10px 14px!important;border-radius:4px!important;background:#fff!important;color:#111!important;box-shadow:0 8px 18px rgba(0,0,0,.12)!important}.v340-polaroid-image{min-height:170px;display:grid;gap:6px;align-content:stretch;background:#eee;overflow:hidden}.v340-polaroid-image>.v340-record-media{height:100%;min-height:170px;border-radius:0}.v340-polaroid-bottom{display:grid;gap:6px;padding:10px 4px 0;min-width:0}.v340-polaroid-bottom .v340-record-label{color:#555}.v340-polaroid-bottom .v340-record-value>span,.v340-polaroid-bottom .v340-record-value>a{color:#111}
    .v340-fields-button{width:auto!important;padding:0 9px!important}.v340-fields-modal .modal-box{width:min(760px,calc(100vw - 28px));max-height:min(84vh,760px);overflow:auto}.v340-field-row{display:grid;grid-template-columns:minmax(150px,1.2fr) minmax(145px,1fr) minmax(130px,.8fr) auto;gap:8px;align-items:center;padding:8px 0;border-bottom:1px solid color-mix(in srgb,currentColor 12%,transparent)}.v340-field-row input,.v340-field-row select{width:100%;min-width:0}.v340-field-remove{width:34px;height:34px}.v340-fields-actions{display:flex;justify-content:space-between;gap:10px;margin-top:12px}.v340-record-editor .modal-box{width:min(650px,calc(100vw - 28px));max-height:min(86vh,800px);overflow:auto}.v340-record-editor-fields{display:grid;gap:4px}.v340-record-editor .kb-item-field{margin-top:10px}.v340-simple-file{display:grid;gap:6px;padding:10px;border:1px dashed color-mix(in srgb,currentColor 28%,transparent);border-radius:9px}.v340-simple-file img{width:100%;max-height:220px;object-fit:contain}.v340-rating-editor{display:flex;gap:4px;flex-wrap:wrap}.v340-rating-editor button{width:34px;height:34px;padding:0;display:grid;place-items:center}.v340-select-options{font-size:.72rem;opacity:.65}
    .v340-kanban-board{display:flex;gap:14px;overflow-x:auto;padding:4px 2px 14px}.v340-kanban-column{flex:0 0 280px;min-width:0;border:var(--thin-border);border-radius:var(--border-radius);background:color-mix(in srgb,var(--white) 92%,var(--track-bg));padding:10px;display:flex;flex-direction:column;gap:9px}.v340-kanban-column-head{display:flex;align-items:center;justify-content:space-between;gap:8px}.v340-kanban-column-head strong{min-width:0;overflow-wrap:anywhere}.v340-kanban-list{display:grid;gap:8px;min-height:44px}.v340-kanban-card{min-width:0;max-width:100%;overflow:hidden;border:var(--thin-border);border-radius:9px;background:var(--white);padding:10px;display:grid;gap:6px;cursor:grab}.v340-kanban-card *{max-width:100%}.v340-kanban-card .v340-record-value>span,.v340-kanban-card .v340-record-value>a{display:block;overflow:hidden;overflow-wrap:anywhere;word-break:break-word;white-space:normal}.v340-kanban-add{width:100%;justify-content:center}.v340-kanban-header-actions{display:flex;gap:6px;align-items:center}
  `;document.head.appendChild(s)}

  function polishPracticeV340(scope=document){
    qa('.custom-component-palette-item[data-component-type="practiceCategoryV244"]',scope).forEach(card=>{const label=card.querySelector('span');if(label)label.textContent='Practice'});
    qa('.custom-component-practiceCategoryV244',scope).forEach(wrap=>{
      const componentId=wrap.dataset.componentId;try{const tabId=wrap.closest('.custom-tab-view')?.dataset.customTabId;const comp=tabId&&getCustomTab(tabId)?.components?.find(c=>String(c.id)===String(componentId));if(comp&&/practice this category/i.test(String(comp.title||'')))comp.title='Practice'}catch{}
      qa('h1,h2,h3,strong',wrap).forEach(node=>{if(/^practice this category$/i.test(String(node.textContent||'').trim()))node.textContent='Practice'});
    });
  }

  function fileDataV340(file){return new Promise(resolve=>{const r=new FileReader();r.onload=()=>resolve(String(r.result||''));r.onerror=()=>resolve('');r.readAsDataURL(file)})}

  function createRecordModalV340(title,fields,item,onSave){
    q('#v340-record-editor')?.remove();const modal=document.createElement('div');modal.id='v340-record-editor';modal.className='modal-overlay v340-record-editor';
    ensureItemValuesV340({recordFieldsV340:fields},item,'cards');
    modal.innerHTML=`<div class="modal-box"><div class="modal-header"><h2>${esc(title)}</h2><button type="button" class="small-icon-btn v340-close"><i class="ph ph-x"></i></button></div><div class="v340-record-editor-fields"></div><button type="button" class="icon-btn v340-save"><i class="ph ph-check"></i> Save</button></div>`;
    const host=q('.v340-record-editor-fields',modal);
    fields.filter(f=>f.areaV340!=='hidden').forEach(field=>{
      const value=readValueV340(item,field);const sec=document.createElement('div');sec.className='modal-section kb-item-field';sec.dataset.fieldId=field.id;
      let control='';
      if(field.kind==='text') control=/description|note|body|details/i.test(field.name)?`<textarea rows="3" data-v340-input="${esc(field.id)}">${esc(value)}</textarea>`:`<input type="text" data-v340-input="${esc(field.id)}" value="${esc(value)}">`;
      else if(field.kind==='video') control=`<input type="url" data-v340-input="${esc(field.id)}" value="${esc(value)}" placeholder="YouTube or MP4 URL">`;
      else if(field.kind==='svg'||field.kind==='latex') control=`<textarea rows="4" data-v340-input="${esc(field.id)}">${esc(value)}</textarea>`;
      else if(field.kind==='select') control=`<select data-v340-input="${esc(field.id)}"><option value=""></option>${field.options.map(x=>`<option ${String(value)===x?'selected':''}>${esc(x)}</option>`).join('')}</select><small class="v340-select-options">Options: ${esc(field.options.join(', ')||'configure in Fields')}</small>`;
      else if(field.kind==='rating') control=`<input type="hidden" data-v340-input="${esc(field.id)}" value="${esc(value)}"><div class="v340-rating-editor">${Array.from({length:field.maxRating||5},(_,i)=>`<button type="button" class="small-icon-btn" data-v340-rating="${i+1}"><i class="ph${i<Number(value||0)?'-fill':''} ph-star"></i></button>`).join('')}</div>`;
      else if(field.kind==='numberFormat') control=`<input type="number" step="any" data-v340-input="${esc(field.id)}" value="${esc(value)}">`;
      else if(field.kind==='dateTime') control=`<input type="datetime-local" data-v340-input="${esc(field.id)}" value="${esc(String(value||'').replace(/Z$/,''))}">`;
      else if(field.kind==='boolean') control=`<label><input type="checkbox" data-v340-input="${esc(field.id)}" ${String(value)==='true'||value===true?'checked':''}> Yes</label>`;
      else if(['image','pinnedImage','attachment'].includes(field.kind)){
        const a=field.kind==='attachment'?parseAttachmentV340(value):null;control=`<div class="v340-simple-file">${field.kind!=='attachment'&&value?`<img src="${esc(value)}" alt="">`:a?`<span><i class="ph ph-paperclip"></i> ${esc(a.name||'Attachment')}</span>`:''}<input type="file" data-v340-file="${esc(field.id)}" ${field.kind==='attachment'?'':'accept="image/*"'}><input type="hidden" data-v340-input="${esc(field.id)}" value="${esc(typeof value==='string'?value:JSON.stringify(value||''))}"></div>`;
      }
      sec.innerHTML=`<span class="field-label">${esc(field.name)}</span>${control}`;host.appendChild(sec);
      qa('[data-v340-rating]',sec).forEach(btn=>btn.onclick=()=>{const n=Number(btn.dataset.v340Rating);q(`[data-v340-input="${CSS.escape(field.id)}"]`,sec).value=String(n);qa('[data-v340-rating]',sec).forEach(b=>{const on=Number(b.dataset.v340Rating)<=n;const i=q('i',b);i.classList.toggle('ph-fill',on)})});
      const file=q(`[data-v340-file="${CSS.escape(field.id)}"]`,sec);if(file)file.onchange=async()=>{const f=file.files?.[0];if(!f)return;const hidden=q(`[data-v340-input="${CSS.escape(field.id)}"]`,sec);const data=await fileDataV340(f);hidden.value=field.kind==='attachment'?JSON.stringify({name:f.name,type:f.type,size:f.size,url:data}):data};
    });
    const close=()=>modal.remove();q('.v340-close',modal).onclick=close;modal.onclick=e=>{if(e.target===modal)close()};q('.v340-save',modal).onclick=async()=>{
      fields.forEach(field=>{const input=q(`[data-v340-input="${CSS.escape(field.id)}"]`,modal);if(!input)return;let v=input.type==='checkbox'?String(input.checked):input.value;setValueV340(item,field,v)});await onSave(item);close();
    };document.body.appendChild(modal);
  }

  function openFieldsModalV340(tab,component,type='cards'){
    q('#v340-fields-modal')?.remove();const fields=fieldsForV340(component,type);const modal=document.createElement('div');modal.id='v340-fields-modal';modal.className='modal-overlay v340-fields-modal';
    modal.innerHTML=`<div class="modal-box"><div class="modal-header"><h2>${esc(type==='polaroids'?'Polaroid Fields':'Card Fields')}</h2><button class="small-icon-btn v340-close"><i class="ph ph-x"></i></button></div><p class="progress-hint">These are the same field types available in the Knowledge Base. For Polaroid cards, choose whether each field appears in the image area or the white text area.</p><div class="v340-fields-list"></div><div class="v340-fields-actions"><button type="button" class="icon-btn v340-add-field"><i class="ph ph-plus"></i> Field</button><button type="button" class="icon-btn v340-fields-save"><i class="ph ph-check"></i> Save Fields</button></div></div>`;
    const list=q('.v340-fields-list',modal);
    const render=()=>{list.innerHTML='';fields.forEach(field=>{const row=document.createElement('div');row.className='v340-field-row';row.dataset.id=field.id;row.innerHTML=`<input class="v340-field-name" value="${esc(field.name)}"><select class="v340-field-kind">${FIELD_KINDS_V340.map(([k,l])=>`<option value="${k}" ${field.kind===k?'selected':''}>${esc(l)}</option>`).join('')}</select><select class="v340-field-area"><option value="bottom" ${field.areaV340==='bottom'?'selected':''}>${type==='polaroids'||component.cardStyle==='polaroid'?'White text area':'Show on card'}</option><option value="image" ${field.areaV340==='image'?'selected':''}>Image area</option><option value="hidden" ${field.areaV340==='hidden'?'selected':''}>Hidden</option></select><button type="button" class="small-icon-btn v340-field-remove"><i class="ph ph-trash"></i></button>`;q('.v340-field-remove',row).onclick=()=>{const i=fields.findIndex(f=>f.id===field.id);if(i>=0)fields.splice(i,1);render()};q('.v340-field-kind',row).onchange=e=>{field.kind=e.target.value;if(field.kind==='select'&&!field.options.length){const raw=prompt('Select options, separated by commas','Option 1, Option 2');if(raw!=null)field.options=raw.split(',').map(x=>x.trim()).filter(Boolean)}};list.appendChild(row)});};render();
    const close=()=>modal.remove();q('.v340-close',modal).onclick=close;modal.onclick=e=>{if(e.target===modal)close()};q('.v340-add-field',modal).onclick=()=>{fields.push(fieldV340(`Field ${fields.length+1}`,'text',type==='polaroids'||component.cardStyle==='polaroid'?'bottom':'bottom'));render()};q('.v340-fields-save',modal).onclick=async()=>{qa('.v340-field-row',modal).forEach(row=>{const f=fields.find(x=>x.id===row.dataset.id);if(!f)return;f.name=q('.v340-field-name',row).value.trim()||'Field';f.kind=q('.v340-field-kind',row).value;f.areaV340=q('.v340-field-area',row).value});component.recordFieldsV340=fields;await save();renderCustomTabView(tab.id);close()};document.body.appendChild(modal);
  }

  function renderRecordsV340(tab,component,content,type='cards'){
    const fields=fieldsForV340(component,type);component.items=Array.isArray(component.items)?component.items:[];
    const polaroid=type==='polaroids'||component.cardStyle==='polaroid';
    if(type==='cards'&&!['normal','vertical','horizontal','thin-vertical','square','compact','wide','rounded','borderless','index-card','polaroid'].includes(component.cardStyle))component.cardStyle='normal';
    content.innerHTML=`<div class="custom-collection-header"><h2>${esc(component.title||(type==='polaroids'?'Polaroids':'Cards'))}</h2><div class="custom-polaroid-header-actions">${type==='cards'&&customTabEditMode?`<select class="v340-card-style"><option value="normal">Normal</option><option value="vertical">Vertical</option><option value="horizontal">Horizontal</option><option value="square">Square</option><option value="compact">Compact</option><option value="wide">Wide</option><option value="rounded">Rounded</option><option value="borderless">Borderless</option><option value="index-card">Index Card</option><option value="polaroid">Polaroid</option></select>`:''}<button type="button" class="small-icon-btn v340-fields-button" title="Configure fields"><i class="ph ph-list-plus"></i></button><button type="button" class="small-icon-btn v340-add-record" title="Add ${type==='polaroids'?'polaroid':'card'}"><i class="ph ph-plus"></i></button></div></div><div class="v340-record-grid ${polaroid?'is-polaroid':''}"></div>`;
    const style=q('.v340-card-style',content);if(style){style.value=component.cardStyle||'normal';style.onchange=async()=>{component.cardStyle=style.value;await save();renderCustomTabView(tab.id)}};
    q('.v340-fields-button',content).onclick=()=>openFieldsModalV340(tab,component,type);
    const grid=q('.v340-record-grid',content);
    component.items.forEach(item=>{ensureItemValuesV340(component,item,type);const card=document.createElement('article');card.className=`v340-record-card custom-searchable-item custom-content-editable ${polaroid?'v340-polaroid-card':''}`;card.dataset.customItemId=item.id;card.dataset.searchText=cardSearchV340(component,item,type);const visible=fields.filter(f=>f.areaV340!=='hidden');if(polaroid){const imageFields=visible.filter(f=>f.areaV340==='image'),bottomFields=visible.filter(f=>f.areaV340!=='image');card.innerHTML=`<div class="v340-polaroid-image">${imageFields.map(f=>displayFieldV340(f,readValueV340(item,f))).join('')||'<div class="custom-polaroid-placeholder"><i class="ph ph-image"></i></div>'}</div><div class="v340-polaroid-bottom">${bottomFields.map(f=>displayFieldV340(f,readValueV340(item,f))).join('')}</div>`}else card.innerHTML=visible.map(f=>displayFieldV340(f,readValueV340(item,f))).join('')||'<span>No fields yet.</span>';
      card.oncontextmenu=e=>{e.preventDefault();showCustomItemContextMenu(e.clientX,e.clientY,[{label:'Edit card',icon:'ph-pencil-simple',action:()=>createRecordModalV340('Edit Card',fields,item,async()=>{await save();renderCustomTabView(tab.id)})},{label:'Delete card',icon:'ph-trash',danger:true,action:async()=>{const ok=await showAppConfirm({title:'Delete Card',message:'Delete this card?',confirmLabel:'Delete'});if(!ok)return;component.items=component.items.filter(x=>x.id!==item.id);await save();renderCustomTabView(tab.id)}}])};grid.appendChild(card)});
    q('.v340-add-record',content).onclick=()=>{const item={id:uid(type==='polaroids'?'polaroid':'card'),valuesV340:{}};createRecordModalV340(type==='polaroids'?'Add Polaroid':'Add Card',fields,item,async()=>{if(!component.items.includes(item))component.items.push(item);await save();renderCustomTabView(tab.id)})};
  }

  function normalizeKanbanV340(component){
    component.columns=Array.isArray(component.columns)&&component.columns.length?component.columns:[{id:uid('column'),title:'To Do',cards:[]},{id:uid('column'),title:'Doing',cards:[]},{id:uid('column'),title:'Done',cards:[]}];
    component.columns=component.columns.map((c,i)=>({id:String(c.id||uid('column')),title:String(c.title||c.name||`Column ${i+1}`),cards:Array.isArray(c.cards)?c.cards:Array.isArray(c.items)?c.items:[]}));
    fieldsForV340(component,'cards');return component.columns;
  }
  function renderKanbanV340(tab,component,content){
    const columns=normalizeKanbanV340(component),fields=fieldsForV340(component,'cards');
    content.innerHTML=`<div class="custom-collection-header"><h2>${esc(component.title||'Kanban Board')}</h2><div class="v340-kanban-header-actions"><button type="button" class="small-icon-btn v340-fields-button" title="Card fields"><i class="ph ph-list-plus"></i></button><button type="button" class="small-icon-btn v340-add-column" title="Add column"><i class="ph ph-plus"></i></button></div></div><div class="v340-kanban-board"></div>`;q('.v340-fields-button',content).onclick=()=>openFieldsModalV340(tab,component,'cards');q('.v340-add-column',content).onclick=async()=>{const name=await showAppPrompt({title:'Add Column',label:'Column name',value:'New Column'});if(name==null||!name.trim())return;columns.push({id:uid('column'),title:name.trim(),cards:[]});await save();renderCustomTabView(tab.id)};const board=q('.v340-kanban-board',content);
    columns.forEach(column=>{const col=document.createElement('section');col.className='v340-kanban-column';col.dataset.columnId=column.id;col.innerHTML=`<div class="v340-kanban-column-head"><strong>${esc(column.title)}</strong><span>${column.cards.length}</span></div><div class="v340-kanban-list"></div><button type="button" class="icon-btn v340-kanban-add"><i class="ph ph-plus"></i> Card</button>`;
      col.oncontextmenu=e=>{if(e.target.closest('.v340-kanban-card,.v340-kanban-add'))return;e.preventDefault();showCustomItemContextMenu(e.clientX,e.clientY,[{label:'Rename column',icon:'ph-pencil-simple',action:async()=>{const name=await showAppPrompt({title:'Rename Column',label:'Column name',value:column.title});if(name==null||!name.trim())return;column.title=name.trim();await save();renderCustomTabView(tab.id)}},{label:'Delete column',icon:'ph-trash',danger:true,action:async()=>{const ok=await showAppConfirm({title:'Delete Column',message:`Delete “${column.title}” and its ${column.cards.length} card${column.cards.length===1?'':'s'}?`,confirmLabel:'Delete'});if(!ok)return;component.columns=columns.filter(c=>c.id!==column.id);await save();renderCustomTabView(tab.id)}}])};
      const list=q('.v340-kanban-list',col);list.ondragover=e=>e.preventDefault();list.ondrop=async e=>{e.preventDefault();const cardId=e.dataTransfer.getData('text/v340-kanban-card');if(!cardId)return;let moved=null;columns.forEach(c=>{const i=c.cards.findIndex(x=>String(x.id)===cardId);if(i>=0)moved=c.cards.splice(i,1)[0]});if(moved){column.cards.push(moved);await save();renderCustomTabView(tab.id)}};
      column.cards.forEach(item=>{ensureItemValuesV340(component,item,'cards');const card=document.createElement('article');card.className='v340-kanban-card custom-searchable-item';card.draggable=true;card.dataset.searchText=cardSearchV340(component,item,'cards');const titleField=fields.find(f=>/^title$/i.test(f.name))||fields.find(f=>f.kind==='text');const other=fields.filter(f=>f!==titleField&&f.areaV340!=='hidden').slice(0,3);card.innerHTML=`${titleField?`<h3>${esc(readValueV340(item,titleField)||'Untitled Card')}</h3>`:''}${other.map(f=>displayFieldV340(f,readValueV340(item,f),true)).join('')}`;card.ondragstart=e=>e.dataTransfer.setData('text/v340-kanban-card',String(item.id));card.oncontextmenu=e=>{e.preventDefault();showCustomItemContextMenu(e.clientX,e.clientY,[{label:'Edit card',icon:'ph-pencil-simple',action:()=>createRecordModalV340('Edit Card',fields,item,async()=>{await save();renderCustomTabView(tab.id)})},{label:'Delete card',icon:'ph-trash',danger:true,action:async()=>{const ok=await showAppConfirm({title:'Delete Card',message:'Delete this card?',confirmLabel:'Delete'});if(!ok)return;column.cards=column.cards.filter(x=>x.id!==item.id);await save();renderCustomTabView(tab.id)}}])};list.appendChild(card)});
      q('.v340-kanban-add',col).onclick=()=>{const item={id:uid('card'),valuesV340:{}};createRecordModalV340('Add Card',fields,item,async()=>{if(!column.cards.includes(item))column.cards.push(item);await save();renderCustomTabView(tab.id)})};board.appendChild(col)});
  }

  function installV340(){
    ensureStyleV340();
    try{
      if(typeof renderCustomComponentContent==='function'&&!renderCustomComponentContent.__v340){const before=renderCustomComponentContent;const wrapped=function(tab,component,content){
        if(component?.type==='cards')return renderRecordsV340(tab,component,content,'cards');
        if(component?.type==='polaroids')return renderRecordsV340(tab,component,content,'polaroids');
        if(component?.type==='kanbanV239')return renderKanbanV340(tab,component,content);
        if(component?.type==='practiceCategoryV244'&&/practice this category/i.test(String(component.title||'')))component.title='Practice';
        const r=before.apply(this,arguments);if(component?.type==='practiceCategoryV244')requestAnimationFrame(()=>polishPracticeV340(content.closest('.custom-tab-view')||document));return r};wrapped.__v340=true;wrapped.__v340Before=before;window.renderCustomComponentContent=wrapped;try{renderCustomComponentContent=wrapped}catch{}
      }
    }catch{}
    try{
      if(typeof renderCustomCanvas==='function'&&!renderCustomCanvas.__v340){const before=renderCustomCanvas;const wrapped=function(){const r=before.apply(this,arguments);requestAnimationFrame(()=>polishPracticeV340(arguments[1]||document));return r};wrapped.__v340=true;window.renderCustomCanvas=wrapped;try{renderCustomCanvas=wrapped}catch{}}
    }catch{}
    polishPracticeV340();
  }
  installV340();
  // widgets-loader-v241 can wrap component rendering after extras load. Re-install
  // only if another runtime replaced our wrapper.
  let tries=0;const timer=setInterval(()=>{tries++;installV340();if(tries>20)clearInterval(timer)},350);
  document.addEventListener('click',e=>{if(e.target.closest?.('.custom-tab-nav-btn,.custom-tab-view,.custom-component-palette-item'))requestAnimationFrame(()=>polishPracticeV340())},true);
})();

// ============================================================================
// V341 — GOALS INPUT POLISH / DIRECT UNDIRECTED CONNECTION GRAPH / CALENDAR
// - Styles Goal name inputs consistently with Loggy form controls.
// - Global Search no longer displays the globe icon.
// - Daily Log Connections renders directly from db.days note @Day links as one
//   undirected graph, bypassing all older tree/list renderers.
// - Adds a reusable Monthly Calendar custom component with date events.
// ============================================================================
(() => {
  'use strict';
  if (window.__loggyV341CalendarConnections) return;
  window.__loggyV341CalendarConnections = true;

  const q=(s,r=document)=>r?.querySelector?.(s)||null;
  const qa=(s,r=document)=>Array.from(r?.querySelectorAll?.(s)||[]);
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const uid=p=>{try{return typeof customId==='function'?customId(p):`${p}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,8)}`}catch{return `${p}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,8)}`}};
  const save=()=>{try{return saveDb()}catch{return Promise.resolve()}};

  function ensureStyleV341(){
    if(q('#loggy-v341-style')) return;
    const style=document.createElement('style');
    style.id='loggy-v341-style';
    style.textContent=`
      /* Goal name is a full Loggy form input, not a bare browser field. */
      #goal-config-modal-v163 .goal-name-v163,
      .goal-config-modal-v162 .goal-name-v162,
      #goal-config-modal-v162 .goal-name-v162 {
        width:100%!important; min-height:42px!important; box-sizing:border-box!important;
        padding:9px 11px!important; border:var(--thin-border)!important;
        border-radius:9px!important; outline:none!important; box-shadow:none!important;
        background:var(--white)!important; color:var(--black)!important; font:inherit!important;
      }
      #goal-config-modal-v163 .goal-name-v163:focus,
      .goal-config-modal-v162 .goal-name-v162:focus,
      #goal-config-modal-v162 .goal-name-v162:focus { border:var(--thick-border)!important; }

      /* Global Search intentionally has no leading globe/global icon. */
      .custom-global-search-wrap-v163 > i:first-child { display:none!important; }
      .custom-global-search-wrap-v163 { grid-template-columns:minmax(0,1fr) auto!important; }

      /* Direct undirected Daily Log graph. */
      .daily-connections-v341-head{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;margin-bottom:10px}
      .daily-connections-v341-head h2{margin:0}.daily-connections-v341-head small{display:block;margin-top:3px;opacity:.66}
      .daily-connections-v341-graph{position:relative;width:100%;height:clamp(340px,55vh,620px);min-height:340px;border:var(--thin-border);border-radius:var(--border-radius);overflow:hidden;background:color-mix(in srgb,var(--white) 94%,transparent)}
      .daily-connections-v341-lines{position:absolute;inset:0;width:100%;height:100%;overflow:visible;pointer-events:none}
      .daily-connections-v341-lines line{stroke:currentColor;stroke-width:.42;vector-effect:non-scaling-stroke;opacity:.34}
      .daily-connections-v341-node{position:absolute;transform:translate(-50%,-50%);min-width:58px;min-height:58px;padding:7px;border:var(--thin-border);border-radius:50%;background:var(--white);color:var(--black);display:grid;place-items:center;line-height:1;cursor:pointer;z-index:2;box-shadow:2px 2px 0 color-mix(in srgb,currentColor 22%,transparent)}
      .daily-connections-v341-node span{font-size:.63rem;opacity:.62}.daily-connections-v341-node strong{font-size:1rem;margin-top:2px}
      .daily-connections-v341-node:hover{transform:translate(-50%,-50%) scale(1.06)}
      .daily-connections-v341-empty{min-height:220px;display:grid;place-items:center;text-align:center;gap:7px;padding:28px;border:var(--thin-border);border-radius:var(--border-radius);opacity:.72}
      .daily-connections-v341-empty i{font-size:2rem}

      /* Monthly Calendar custom component. */
      .monthly-calendar-v341-toolbar{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:10px;flex-wrap:wrap}
      .monthly-calendar-v341-nav{display:flex;align-items:center;gap:6px}.monthly-calendar-v341-month{font-weight:800;min-width:150px;text-align:center}
      .monthly-calendar-v341-grid{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));border-left:var(--thin-border);border-top:var(--thin-border);border-radius:var(--border-radius);overflow:hidden;background:var(--white)}
      .monthly-calendar-v341-weekday{padding:8px 5px;text-align:center;font-size:.72rem;font-weight:800;opacity:.68;border-right:var(--thin-border);border-bottom:var(--thin-border);background:var(--track-bg)}
      .monthly-calendar-v341-day{position:relative;min-height:112px;padding:7px;border:0;border-right:var(--thin-border);border-bottom:var(--thin-border);background:var(--white);color:inherit;text-align:left;overflow:hidden;cursor:pointer;font:inherit}
      .monthly-calendar-v341-day.is-outside{opacity:.38;background:color-mix(in srgb,var(--track-bg) 46%,var(--white))}.monthly-calendar-v341-day.is-today .monthly-calendar-v341-number{outline:2px solid currentColor;outline-offset:2px}
      .monthly-calendar-v341-number{display:inline-grid;place-items:center;width:24px;height:24px;border-radius:50%;font-weight:800;font-size:.78rem}
      .monthly-calendar-v341-events{display:grid;gap:4px;margin-top:5px}.monthly-calendar-v341-event{min-width:0;padding:3px 5px;border-radius:5px;background:var(--track-bg);font-size:.68rem;line-height:1.2;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;cursor:context-menu}
      @media(max-width:760px){.monthly-calendar-v341-day{min-height:76px;padding:5px}.monthly-calendar-v341-event{font-size:.6rem;padding:2px 3px}.monthly-calendar-v341-weekday{font-size:.62rem}}
    `;
    document.head.appendChild(style);
  }

  // --------------------------------------------------------------------------
  // Daily Log Connections: direct, authoritative, undirected.
  // --------------------------------------------------------------------------
  function extractMentionDaysV341(html){
    const src=String(html||'');
    const out=new Set();
    const add=n=>{n=Math.floor(Number(n));if(Number.isFinite(n)&&n>0)out.add(n)};
    [
      /data-day\s*=\s*["']?(\d+)/gi,
      /href\s*=\s*["'][^"']*#day[-_/]?(\d+)["']/gi,
      /@\s*day\s*#?\s*(\d+)/gi,
      /@\s*#?\s*(\d+)/g
    ].forEach(re=>{let m;while((m=re.exec(src)))add(m[1])});
    try{
      const doc=new DOMParser().parseFromString(`<div>${src}</div>`,'text/html');
      doc.querySelectorAll('[data-day]').forEach(el=>add(el.getAttribute('data-day')));
      doc.querySelectorAll('a[href]').forEach(el=>{const m=String(el.getAttribute('href')||'').match(/#day[-_/]?(\d+)/i);if(m)add(m[1])});
      const plain=String(doc.body?.textContent||'');
      [/@\s*day\s*#?\s*(\d+)/gi,/@\s*#?\s*(\d+)/g].forEach(re=>{let m;while((m=re.exec(plain)))add(m[1])});
    }catch{}
    return [...out];
  }

  function connectionDataV341(){
    const edgeMap=new Map(), nodes=new Set();
    const addEdge=(x,y)=>{
      x=Math.floor(Number(x));y=Math.floor(Number(y));
      if(!Number.isFinite(x)||!Number.isFinite(y)||x<1||y<1||x===y)return;
      const a=Math.min(x,y),b=Math.max(x,y),key=`${a}|${b}`;
      nodes.add(a);nodes.add(b);if(!edgeMap.has(key))edgeMap.set(key,{a,b,source:a,target:b});
    };
    let days={};try{days=db?.days||{}}catch{}
    Object.entries(days).forEach(([sourceKey,dayData])=>{
      const source=Math.floor(Number(sourceKey));if(!Number.isFinite(source)||source<1)return;
      // @Day autocomplete writes links into notes.innerHTML; parse those directly.
      extractMentionDaysV341(dayData?.notes||'').forEach(target=>addEdge(source,target));
      // Preserve legacy/manual links as the same undirected edges.
      (Array.isArray(dayData?.connections)?dayData.connections:[]).forEach(raw=>{
        let target=raw?.targetDay??raw?.day??raw?.target??raw;
        try{if(typeof normalizeDailyConnectionV32==='function')target=normalizeDailyConnectionV32(raw)?.targetDay??target}catch{}
        addEdge(source,target);
      });
    });
    return {nodes:[...nodes].sort((a,b)=>a-b),edges:[...edgeMap.values()].sort((a,b)=>a.a-b.a||a.b-b.b)};
  }

  function graphPositionsV341(nodes,edges){
    const positions=new Map();
    if(!nodes.length)return positions;
    if(nodes.length===1){positions.set(nodes[0],{x:50,y:50});return positions}
    // Circular placement makes the undirected topology readable and stable.
    const radius=Math.min(40,29+Math.min(nodes.length,16)*.55);
    nodes.forEach((day,i)=>{const angle=-Math.PI/2+(Math.PI*2*i/nodes.length);positions.set(day,{x:50+Math.cos(angle)*radius,y:50+Math.sin(angle)*radius})});
    return positions;
  }

  function renderConnectionsV341(tab,component,content){
    const {nodes,edges}=connectionDataV341();
    const title=esc(component?.title||'Daily Log Connections');
    if(!edges.length){
      content.innerHTML=`<div class="daily-connections-v341-head"><div><h2>${title}</h2><small>Undirected graph built from every @Day link in Daily Log notes.</small></div></div><div class="daily-connections-v341-empty"><i class="ph ph-share-network"></i><strong>No connections found</strong><span>Open a Daily Log, type @, choose another Day, and save/leave the log. Example: linking Day 12 to Day 3 creates one undirected edge: Day 12 — Day 3.</span></div>`;
      return;
    }
    const pos=graphPositionsV341(nodes,edges);
    content.innerHTML=`<div class="daily-connections-v341-head"><div><h2>${title}</h2><small>${nodes.length} connected day${nodes.length===1?'':'s'} · ${edges.length} undirected connection${edges.length===1?'':'s'}</small></div></div><div class="daily-connections-v341-graph"><svg class="daily-connections-v341-lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">${edges.map(e=>{const a=pos.get(e.a),b=pos.get(e.b);return `<line x1="${a.x}" y1="${a.y}" x2="${b.x}" y2="${b.y}"></line>`}).join('')}</svg>${nodes.map(day=>{const p=pos.get(day);return `<button type="button" class="daily-connections-v341-node" data-v341-day="${day}" style="left:${p.x}%;top:${p.y}%"><span>Day</span><strong>${day}</strong></button>`}).join('')}</div>`;
    qa('[data-v341-day]',content).forEach(btn=>btn.onclick=()=>{const day=Number(btn.dataset.v341Day);try{if(Number.isFinite(day)&&typeof openDayLog==='function')openDayLog(day)}catch{}});
  }

  // --------------------------------------------------------------------------
  // Monthly Calendar reusable component.
  // --------------------------------------------------------------------------
  function monthKeyV341(date){return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}`}
  function parseMonthV341(value){const m=String(value||'').match(/^(\d{4})-(\d{2})$/);if(!m)return new Date(new Date().getFullYear(),new Date().getMonth(),1);return new Date(Number(m[1]),Number(m[2])-1,1)}
  function dateKeyV341(date){return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`}
  function ensureCalendarV341(component){
    component.title ||= 'Monthly Calendar';
    component.calendarMonthV341 ||= monthKeyV341(new Date());
    component.eventsV341=Array.isArray(component.eventsV341)?component.eventsV341:[];
    component.eventsV341=component.eventsV341.map(e=>({
      ...(e&&typeof e==='object'?e:{}),
      id:String(e?.id||uid('event')),
      date:String(e?.date||''),
      title:String(e?.title||''),
      notes:String(e?.notes||''),
      imageV355:String(e?.imageV355||''),
      displayV355:e?.displayV355==='image'?'image':'name'
    }));
    return component;
  }
  async function editCalendarEventV341(tab,component,date,event=null){
    // V357: the historical V341 renderer can still be reached briefly or by
    // old saved tabs. Always hand event editing to the current image-capable
    // modal once that runtime is available, so there is only one event form.
    if(typeof window.__openCalendarEventModalV355==='function'){
      return window.__openCalendarEventModalV355(tab,component,date,event);
    }
    let values=null;
    try{values=await showAppFormModal({title:event?'Edit Calendar Event':'Add Calendar Event',submitLabel:event?'Save':'Add Event',fields:[{name:'title',label:'Event',value:event?.title||'',placeholder:'Event name'},{name:'notes',label:'Notes (optional)',type:'textarea',value:event?.notes||''}]})}catch{}
    if(!values||!String(values.title||'').trim())return;
    const item=event||{id:uid('event'),date,title:'',notes:''};item.date=date;item.title=String(values.title).trim();item.notes=String(values.notes||'');if(!event)component.eventsV341.push(item);await save();renderCustomTabView(tab.id);
  }
  function renderCalendarV341(tab,component,content){
    ensureCalendarV341(component);
    const month=parseMonthV341(component.calendarMonthV341),year=month.getFullYear(),mon=month.getMonth();
    const first=new Date(year,mon,1), start=new Date(year,mon,1-first.getDay());
    const todayKey=dateKeyV341(new Date());
    const cells=Array.from({length:42},(_,i)=>{const d=new Date(start);d.setDate(start.getDate()+i);return d});
    content.innerHTML=`<div class="custom-collection-header"><h2>${esc(component.title)}</h2></div><div class="monthly-calendar-v341-toolbar"><div class="monthly-calendar-v341-nav"><button type="button" class="small-icon-btn calendar-prev-v341" title="Previous month"><i class="ph ph-caret-left"></i></button><strong class="monthly-calendar-v341-month">${month.toLocaleDateString(undefined,{month:'long',year:'numeric'})}</strong><button type="button" class="small-icon-btn calendar-next-v341" title="Next month"><i class="ph ph-caret-right"></i></button></div><button type="button" class="small-icon-btn calendar-today-v341">Today</button></div><div class="monthly-calendar-v341-grid">${['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(x=>`<div class="monthly-calendar-v341-weekday">${x}</div>`).join('')}${cells.map(d=>{const key=dateKeyV341(d),outside=d.getMonth()!==mon,events=component.eventsV341.filter(e=>e.date===key);return `<button type="button" class="monthly-calendar-v341-day${outside?' is-outside':''}${key===todayKey?' is-today':''}" data-calendar-date-v341="${key}"><span class="monthly-calendar-v341-number">${d.getDate()}</span><span class="monthly-calendar-v341-events">${events.slice(0,4).map(e=>e.displayV355==='image'&&e.imageV355?`<span class="monthly-calendar-v341-event monthly-calendar-v341-event-image-v358" data-calendar-event-v341="${esc(e.id)}" title="${esc(e.title)}"><img data-calendar-event-image-v358="${esc(e.id)}" alt="${esc(e.title)}"></span>`:`<span class="monthly-calendar-v341-event" data-calendar-event-v341="${esc(e.id)}" title="${esc(e.notes||e.title)}">${esc(e.title)}</span>`).join('')}${events.length>4?`<span class="monthly-calendar-v341-event">+${events.length-4} more</span>`:''}</span></button>`}).join('')}</div>`;
    qa('[data-calendar-event-image-v358]',content).forEach(img=>{
      const id=String(img.dataset.calendarEventImageV358||'');
      const event=component.eventsV341.find(item=>String(item.id)===id);
      const src=String(event?.imageV355||'');
      if(src) img.src=src;
    });
    q('.calendar-prev-v341',content).onclick=async()=>{month.setMonth(month.getMonth()-1);component.calendarMonthV341=monthKeyV341(month);await save();renderCustomTabView(tab.id)};
    q('.calendar-next-v341',content).onclick=async()=>{month.setMonth(month.getMonth()+1);component.calendarMonthV341=monthKeyV341(month);await save();renderCustomTabView(tab.id)};
    q('.calendar-today-v341',content).onclick=async()=>{component.calendarMonthV341=monthKeyV341(new Date());await save();renderCustomTabView(tab.id)};
    qa('[data-calendar-date-v341]',content).forEach(cell=>{
      cell.onclick=e=>{if(e.target.closest('[data-calendar-event-v341]'))return;editCalendarEventV341(tab,component,cell.dataset.calendarDateV341)};
      qa('[data-calendar-event-v341]',cell).forEach(chip=>{
        chip.onclick=e=>{e.preventDefault();e.stopPropagation();const ev=component.eventsV341.find(x=>String(x.id)===String(chip.dataset.calendarEventV341));if(ev)editCalendarEventV341(tab,component,ev.date,ev)};
        chip.oncontextmenu=e=>{e.preventDefault();e.stopPropagation();const ev=component.eventsV341.find(x=>String(x.id)===String(chip.dataset.calendarEventV341));if(!ev)return;showCustomItemContextMenu(e.clientX,e.clientY,[{label:'Edit event',icon:'ph-pencil-simple',action:()=>editCalendarEventV341(tab,component,ev.date,ev)},{label:'Delete event',icon:'ph-trash',danger:true,action:async()=>{const ok=await showAppConfirm({title:'Delete Event',message:`Delete “${ev.title}”?`,confirmLabel:'Delete'});if(!ok)return;component.eventsV341=component.eventsV341.filter(x=>x.id!==ev.id);await save();renderCustomTabView(tab.id)}}])};
      });
    });
  }

  function installV341(){
    ensureStyleV341();
    // Register Monthly Calendar in the component picker once.
    try{
      if(Array.isArray(CUSTOM_COMPONENT_LIBRARY)&&!CUSTOM_COMPONENT_LIBRARY.some(def=>def.type==='monthlyCalendarV341')){
        const anchor=CUSTOM_COMPONENT_LIBRARY.findIndex(def=>def.type==='tableV162');
        CUSTOM_COMPONENT_LIBRARY.splice(anchor>=0?anchor+1:CUSTOM_COMPONENT_LIBRARY.length,0,{type:'monthlyCalendarV341',label:'Monthly Calendar',icon:'ph-calendar-blank'});
      }
    }catch{}

    try{
      if(typeof defaultCustomComponent==='function'&&!defaultCustomComponent.__v341Calendar){
        const before=defaultCustomComponent;
        const wrapped=function(type){if(type==='monthlyCalendarV341')return {id:uid('component'),type,title:'Monthly Calendar',titleBackground:'none',calendarMonthV341:monthKeyV341(new Date()),eventsV341:[]};return before.apply(this,arguments)};
        wrapped.__v341Calendar=true;wrapped.__v341Before=before;window.defaultCustomComponent=wrapped;try{defaultCustomComponent=wrapped}catch{}
      }
    }catch{}

    try{
      if(typeof renderCustomComponentContent==='function'&&!renderCustomComponentContent.__v341Direct){
        const before=renderCustomComponentContent;
        const wrapped=function(tab,component,content){
          if(component?.type==='dailyConnectionsGraph') return renderConnectionsV341(tab,component,content);
          if(component?.type==='monthlyCalendarV341') return renderCalendarV341(tab,component,content);
          const result=before.apply(this,arguments);
          if(component?.type==='globalSearchV163') q('.custom-global-search-wrap-v163 > i:first-child',content)?.remove();
          return result;
        };
        wrapped.__v341Direct=true;wrapped.__v341Before=before;window.renderCustomComponentContent=wrapped;try{renderCustomComponentContent=wrapped}catch{}
      }
    }catch{}

    // Help tooltip for the newly registered component.
    try{
      if(typeof renderCustomComponentPalette==='function'&&!renderCustomComponentPalette.__v341CalendarHelp){
        const before=renderCustomComponentPalette;
        const wrapped=function(palette){const result=before.apply(this,arguments);const card=q('.custom-component-palette-item[data-component-type="monthlyCalendarV341"]',palette);if(card){let help=q('.custom-palette-help-v164',card);if(help){const tip=q('.custom-palette-tooltip-v164',help);if(tip)tip.textContent='A full monthly calendar. Click a date to add an event, click an event to edit it, or right-click an event to delete it. Use the arrows to move between months.'}}return result};
        wrapped.__v341CalendarHelp=true;window.renderCustomComponentPalette=wrapped;try{renderCustomComponentPalette=wrapped}catch{}
      }
    }catch{}
  }

  installV341();
  let tries=0;const retry=setInterval(()=>{tries++;installV341();if(tries>20)clearInterval(retry)},350);
})();


// ============================================================================
// V372 — AUTHORITATIVE APPLIED-THEME RESOLVER
// Late animation runtimes must resolve the theme that is ACTUALLY selected on
// this Log page. Falling back to getCustomThemeSettings() is wrong for shared /
// duplicated themes and was the source of the ~1 second snap back to Float.
// ============================================================================
(() => {
  'use strict';
  if (window.__loggyResolveAppliedThemeV372) return;

  const cloneSafe = value => {
    if (!value || typeof value !== 'object') return null;
    try { return structuredClone(value); } catch {}
    try { return JSON.parse(JSON.stringify(value)); } catch {}
    try { return { ...value }; } catch { return null; }
  };

  window.__loggySetPreviewThemeV372 = theme => {
    window.__loggyActivePreviewThemeV372 = cloneSafe(theme);
    return window.__loggyActivePreviewThemeV372;
  };

  window.__loggyResolveAppliedThemeV372 = explicit => {
    if (explicit && typeof explicit === 'object' && Object.keys(explicit).length) return explicit;

    // Theme Builder's real-site preview is visual-only and owns its current
    // draft independently from the host log's db.settings.theme.
    let isPreviewFrameV373 = false;
    try { isPreviewFrameV373 = new URLSearchParams(location.search).get('theme-builder-preview-v307') === '1'; } catch {}
    const preview = isPreviewFrameV373 ? window.__loggyActivePreviewThemeV372 : null;
    if (preview && typeof preview === 'object' && Object.keys(preview).length) return preview;

    let id = '';
    try { id = String(db?.settings?.theme || ''); } catch {}

    // The shared library is the freshest source after Theme Builder saves.
    if (id) {
      try {
        const shared = readSharedThemeLibraryV40?.().find?.(entry => String(entry?.id || '') === id);
        if (shared?.theme && typeof shared.theme === 'object') return shared.theme;
      } catch {}
      try {
        const shared = JSON.parse(localStorage.getItem('loggy-shared-themes-v40') || '[]');
        const entry = Array.isArray(shared) ? shared.find(item => String(item?.id || '') === id) : null;
        if (entry?.theme && typeof entry.theme === 'object') return entry.theme;
      } catch {}
      try {
        const copy = getThemeCopyV30?.(id);
        if (copy?.theme && typeof copy.theme === 'object') return copy.theme;
      } catch {}
      if (id === 'theme-custom-builder') {
        try {
          const custom = getCustomThemeSettings?.();
          if (custom && typeof custom === 'object') return custom;
        } catch {}
      }
      try {
        const override = getThemeOverrideV25?.(id);
        if (override && typeof override === 'object') return override;
      } catch {}
      try {
        const resolved = resolveThemeCreativeDataV56?.(id);
        if (resolved && typeof resolved === 'object') return resolved;
      } catch {}
    }

    // Never substitute the generic custom-theme draft for an unrelated active
    // theme. An empty object is safer than silently changing its animation.
    return {};
  };
})();

// ============================================================================
// V350 — SINGLE AUTHORITATIVE ACROSS-SCREEN RUNTIME
// One rAF controller owns horizontal travel on Log pages + Theme Builder.
// No CSS left-keyframes, no random startup rerolls, and no competing repair
// generations. R/L is source-facing metadata:
//   R => original travels LEFT -> RIGHT, unflipped.
//   L => original travels RIGHT -> LEFT, unflipped.
// Opposite-direction runtime copies are mirrored horizontally.
// ============================================================================
(function(){
  'use strict';
  if(window.__loggyAcrossRafV350)return;
  window.__loggyAcrossRafV350=true;

  const CROSS='cross-screen';
  const CLONE='themeCrossCloneV350';
  const FALLBACK_MOTION_EPOCH_V407=Date.UTC(2026,0,1);
  const motionElapsedV407=theme=>Math.max(0,(Date.now()-(Number(theme?.decorationMotionEpochV407)||FALLBACK_MOTION_EPOCH_V407))/1000);
  const controllers=new WeakMap();
  let lastAppliedTheme=null;

  function hidden(a){
    if(!a||typeof a!=='object')return false;
    if(typeof a.hiddenOnScreenV63==='boolean')return a.hiddenOnScreenV63;
    if(typeof a.showOnScreen==='boolean')return a.showOnScreen===false;
    if(typeof a.visibleV63==='boolean')return a.visibleV63===false;
    if(typeof a.visible==='boolean')return a.visible===false;
    return false;
  }
  function effective(a,t){
    const ai=t?.themeBuilderAiUsedV364===true||String(t?.themeBuilderAutoToolV364||'')==='ai'||!!t?.themeBuilderAiVariantsV376;
    const raw=String(a?.animationOverride||'').trim();
    const override=ai&&a?.animationOverrideUserSetV404!==true?'':raw;
    return String(override||t?.svgDefaultAnimation||a?.animation||'float').trim()||'float';
  }
  function alwaysShow(a){return a?.alwaysShowOnScreenV370===true}
  function natural(a){return String(a?.crossDirectionV139||'').toLowerCase()==='left'?'left':'right'}
  function norm(v){
    const raw=String(v||'').trim();if(!raw)return'';
    try{const u=new URL(raw,location.href);return decodeURIComponent(u.pathname).replace(/\\/g,'/').toLowerCase()}
    catch{return raw.split('?')[0].split('#')[0].replace(/\\/g,'/').toLowerCase()}
  }
  function assetUrl(a){return norm(a?.url||a?.src||a?.dataUrl||a?.image||'')}
  function itemUrl(item){
    const m=item?.querySelector?.('img[src],object[data],image[href],image[xlink\\:href]');
    return norm(m?.getAttribute?.('src')||m?.getAttribute?.('data')||m?.getAttribute?.('href')||m?.getAttribute?.('xlink:href')||'');
  }
  function assetFor(item,assets,index){
    const stored=Number(item?.dataset?.svgIndex);
    if(Number.isFinite(stored)&&stored>=0&&assets[stored])return{asset:assets[stored],index:stored};
    const url=itemUrl(item);
    if(url){
      let f=assets.find(a=>assetUrl(a)===url);if(f)return{asset:f,index:assets.indexOf(f)};
      const base=url.split('/').pop();if(base){f=assets.find(a=>assetUrl(a).split('/').pop()===base);if(f)return{asset:f,index:assets.indexOf(f)}}
    }
    const i=index%Math.max(1,assets.length);
    return{asset:assets[index]||assets[i]||null,index:i};
  }

  function hash32(value){
    const str=String(value||'');let h=2166136261>>>0;
    for(let i=0;i<str.length;i++){h^=str.charCodeAt(i);h=Math.imul(h,16777619)}
    h^=h>>>16;h=Math.imul(h,2246822519);h^=h>>>13;h=Math.imul(h,3266489917);h^=h>>>16;
    return h>>>0;
  }
  function unit(seed,salt){return hash32(`${seed}|${salt}`)/4294967296}
  function assetSeed(asset,index){return asset?.id||asset?.key||assetUrl(asset)||asset?.name||`asset-${index}`}
  // V374: mirror the placement owner's distribution math for Across Screen
  // clones. Originals read their exact already-resolved parity coordinates.
  function distributionPointV374(theme,index){
    const saved=Array.isArray(theme?.resolvedDecorationPlacementsV405)?theme.resolvedDecorationPlacementsV405:[];
    const savedPoint=saved[Math.max(0,Number(index)||0)];
    if(savedPoint&&Number.isFinite(Number(savedPoint.x))&&Number.isFinite(Number(savedPoint.y)))return{x:Number(savedPoint.x),y:Number(savedPoint.y)};
    const mode=String(theme?.svgDistribution||'random');
    const slots=Array.isArray(theme?.manualPlacementSlotsV40)?theme.manualPlacementSlotsV40:[];
    const hash=(i,a,b)=>((i*a+b)%1000)/1000;
    const i=Math.max(0,Number(index)||0);
    if(mode==='manual-fixed'&&slots[i])return{x:+slots[i].x||50,y:+slots[i].y||50};
    if(mode==='corners'){const c=[[10,10],[90,10],[10,90],[90,90],[50,10],[50,90],[10,50],[90,50]][i%8];return{x:c[0],y:c[1]}}
    if(mode==='center-cluster'){const ang=i*2.3999632297,r=10+(i%5)*4;return{x:50+Math.cos(ang)*r,y:50+Math.sin(ang)*r}}
    if(mode==='side-fixed')return{x:i%2?92:8,y:12+((i*19)%76)};
    if(mode==='side-random')return{x:i%2?94:6,y:8+hash(i,317,113)*84};
    if(mode==='top-bottom')return{x:8+hash(i,277,91)*84,y:i%2?93:7};
    if(mode==='all-edges-random'){const e=i%4,t=7+hash(i,353,137)*86;return e===0?{x:t,y:7}:e===1?{x:93,y:t}:e===2?{x:t,y:93}:{x:7,y:t}}
    const wide=mode==='wide-random';
    return{x:(wide?4:8)+hash(i,311,109)*(wide?92:84),y:(wide?5:8)+hash(i,467,191)*(wide?90:84)};
  }
  function spec(asset,index,instance,theme){
    const seed=`${assetSeed(asset,index)}|${instance}`;
    const speed=Math.max(.25,Math.min(2,(Number(theme?.decorationAnimationSpeedV369)||100)/100));
    const duration=(9.5+unit(seed,'duration')*9)/speed;
    return{
      duration,
      top:8+unit(seed,'top')*84,
      phase:unit(seed,'phase')*duration
    };
  }

  function ensureCss(){
    if(document.getElementById('loggy-across-v350-style'))return;
    const style=document.createElement('style');style.id='loggy-across-v350-style';
    style.textContent=`
      #custom-theme-background-stage,
      #theme-builder-modal .theme-builder-live-art-stage-v61,
      #theme-builder-modal .theme-builder-dashboard-art-stage-v45,
      #theme-builder-modal .theme-builder-dashboard-art-stage{overflow:hidden!important;contain:paint!important;}
      .theme-cross-screen-v94{position:absolute!important;will-change:left!important;pointer-events:auto!important;}
      .theme-cross-screen-v94>.theme-svg-motion-shell,
      .theme-cross-screen-v94>.theme-image-motion-shell-v36{animation:none!important;animation-name:none!important;}
    `;
    document.head.appendChild(style);
  }

  function clearItem(item){
    if(!item)return;
    item.classList.remove('theme-cross-screen-v94','theme-cross-ltr-v94','theme-cross-rtl-v94','theme-cross-face-right-v139','theme-cross-face-left-v139');
    delete item.dataset.v350Across;
    delete item.dataset.themeCrossDirectionV94;
    delete item.dataset.themeCrossInstanceV94;
    ['animation','animation-name','animation-duration','animation-delay','animation-timing-function','animation-iteration-count','animation-fill-mode','animation-play-state','will-change'].forEach(k=>item.style.removeProperty(k));
    if(item.dataset.v350OwnsLeft==='1'){item.style.removeProperty('left');delete item.dataset.v350OwnsLeft}
    item.querySelectorAll('img,object,svg').forEach(m=>{
      if(m.dataset.v350AcrossFlip==='1'){m.style.removeProperty('transform');m.style.removeProperty('transform-origin');delete m.dataset.v350AcrossFlip}
    });
  }

  function prepare(item,asset,assetIndex,instance,travel,forcedTop=null,forcedLeft=null,theme={}){
    const facing=natural(asset),flip=facing!==travel,right=travel==='right',m=spec(asset,assetIndex,instance,theme);
    if(Number.isFinite(Number(forcedTop)))m.top=Number(forcedTop);
    // Seed travel from the selected distribution's X coordinate instead of a
    // second unrelated random phase. The item immediately starts at the same
    // scatter point it had before Across Screen takes over horizontal motion.
    if(Number.isFinite(Number(forcedLeft))){
      const x=Math.max(0,Math.min(100,Number(forcedLeft)));
      const p=Math.max(0,Math.min(1,right?((x+16)/132):((116-x)/132)));
      // V407: p is the canonical phase at the theme's persisted motion epoch.
      // Do not subtract a page-local performance clock here.
      m.phase=p*m.duration;
    }
    item.dataset.v350Across='1';item.dataset.svgIndex=String(assetIndex);item.dataset.themeCrossInstanceV94=String(instance);item.dataset.themeCrossDirectionV94=travel;item.dataset.themeCrossNaturalFacingV350=facing;
    item.classList.add('theme-cross-screen-v94');item.classList.toggle('theme-cross-ltr-v94',right);item.classList.toggle('theme-cross-rtl-v94',!right);item.classList.toggle('theme-cross-face-right-v139',right);item.classList.toggle('theme-cross-face-left-v139',!right);
    item.style.removeProperty('right');item.style.removeProperty('bottom');item.style.setProperty('position','absolute','important');item.style.setProperty('top',`${m.top.toFixed(2)}%`,'important');
    // No CSS travel animation is allowed on the outer item. rAF owns left.
    item.style.setProperty('animation','none','important');item.style.setProperty('animation-name','none','important');item.style.setProperty('animation-play-state','paused','important');item.style.setProperty('will-change','left','important');
    item.querySelectorAll('.theme-svg-motion-shell,.theme-image-motion-shell-v36,.dashboard-shared-motion-v41').forEach(shell=>{
      shell.style.setProperty('animation','none','important');shell.style.setProperty('animation-name','none','important');shell.style.setProperty('animation-play-state','paused','important');
    });
    item.querySelectorAll('img,object,svg').forEach(media=>{
      media.dataset.v350AcrossFlip='1';media.style.setProperty('transform',flip?'scaleX(-1)':'scaleX(1)','important');media.style.setProperty('transform-origin','center center','important');
    });
    return{item,asset,assetIndex,instance,travel,duration:m.duration,phase:m.phase};
  }

  function stop(stage){
    const ctrl=controllers.get(stage);if(!ctrl)return;
    ctrl.alive=false;if(ctrl.raf)cancelAnimationFrame(ctrl.raf);if(ctrl.rebuildRaf)cancelAnimationFrame(ctrl.rebuildRaf);try{ctrl.observer?.disconnect?.()}catch{};controllers.delete(stage);
  }

  function signature(theme){
    const rows=(Array.isArray(theme?.backgroundSvgs)?theme.backgroundSvgs:[]).map((a,i)=>[
      assetSeed(a,i),hidden(a),alwaysShow(a),effective(a,theme),natural(a),Number(a?.opacityV109??a?.opacity??100),Number(theme?.decorationAnimationSpeedV369||100),!!theme?.reduceDecorationOverlapV361,!!theme?.preventDecorationOverlapV367,String(theme?.svgDistribution||'random'),JSON.stringify(theme?.manualPlacementSlotsV40||[])
    ]);
    rows.push(['layout-v405',JSON.stringify(theme?.resolvedDecorationPlacementsV405||[])]);
    return JSON.stringify(rows);
  }

  function configureStage(stage,theme,itemSelector){
    if(!stage||!stage.isConnected)return;
    ensureCss();theme=theme&&typeof theme==='object'?theme:{};
    const sig=signature(theme);
    const existingCtrl=controllers.get(stage);
    if(existingCtrl&&existingCtrl.signature===sig&&existingCtrl.movers.every(m=>m.item?.isConnected)){
      existingCtrl.theme=theme;return;
    }
    stop(stage);

    // Remove every legacy runtime clone/overlay. V350 is the only clone owner.
    stage.querySelectorAll('.loggy-across-overlay-v336,[data-theme-cross-clone-v149="true"],[data-theme-cross-clone-v94="true"],[data-theme-cross-clone-v342="true"],[data-theme-cross-clone-v350="true"]').forEach(n=>n.remove());

    const assets=Array.isArray(theme?.backgroundSvgs)?theme.backgroundSvgs:[];
    const originals=Array.from(stage.querySelectorAll(itemSelector)).filter(n=>
      n.dataset.themeCrossCloneV149!=='true'&&n.dataset.themeCrossCloneV94!=='true'&&n.dataset.themeCrossCloneV342!=='true'&&n.dataset.themeCrossCloneV350!=='true'
    );
    const entries=[];
    originals.forEach((item,displayIndex)=>{
      const found=assetFor(item,assets,displayIndex),asset=found.asset;
      const globalCross=String(theme?.svgDefaultAnimation||'').trim()===CROSS;
      const rawOverride=String(asset?.animationOverride||'').trim();
      const explicitAway=asset?.animationOverrideUserSetV404===true&&rawOverride&&rawOverride!==CROSS;
      const shouldCross=globalCross?!explicitAway:!!asset&&effective(asset,theme)===CROSS;
      // V406: strict-overlap is only meaningful for stationary artwork. Across
      // Screen movers use their saved X as travel phase, so a stale suppression
      // flag must never keep them out of the mover list.
      if(item.dataset.noOverlapSuppressedV370==='1'&&!shouldCross){
        item.style.setProperty('visibility','hidden','important');
        item.style.setProperty('pointer-events','none','important');
        clearItem(item);return;
      }
      if(shouldCross&&item.dataset.noOverlapSuppressedV370==='1')delete item.dataset.noOverlapSuppressedV370;
      item.style.removeProperty('visibility');item.style.removeProperty('pointer-events');delete item.dataset.loggyAcrossHiddenV336;
      // V371/V406: parity owns stationary visibility/placement; Across Screen
      // consumes the same saved Y/phase but is never statically collision-hidden.
      if(!shouldCross){clearItem(item);return}
      // When Across Screen is the global default, every rendered decoration is
      // enrolled even if an old renderer failed to preserve its asset index.
      const sourceAsset=asset||{id:`rendered-${displayIndex}`,crossDirectionV139:'right'};
      const sourceIndex=asset?found.index:displayIndex;
      const travel=natural(sourceAsset);
      entries.push({item,asset:sourceAsset,assetIndex:sourceIndex,travel});
    });
    if(!entries.length){
      // No Across Screen assets. The V366 atomic decoration gate owns reveal.
      return;
    }

    const preventOverlap=theme?.preventDecorationOverlapV367===true;
    const target=preventOverlap?entries.length:Math.min(12,Math.max(6,entries.length));
    const placement=(instance,item,isClone=false)=>{
      if(!isClone){
        const top=parseFloat(item?.style?.top||''),left=parseFloat(item?.style?.left||'');
        if(Number.isFinite(top)||Number.isFinite(left))return{top:Number.isFinite(top)?top:null,left:Number.isFinite(left)?left:null};
      }
      const p=distributionPointV374(theme,instance);
      return{top:p.y,left:p.x};
    };
    let rightCount=entries.filter(e=>e.travel==='right').length,leftCount=entries.length-rightCount;
    const movers=entries.map((e,i)=>{const p=placement(i,e.item,false);return prepare(e.item,e.asset,e.assetIndex,i,e.travel,p.top,p.left,theme)});

    for(let instance=entries.length;instance<target;instance++){
      const source=entries[instance%entries.length];
      const travel=rightCount<=leftCount?'right':'left';
      const clone=source.item.cloneNode(true);
      clone.dataset.themeCrossCloneV350='true';clone.removeAttribute('id');
      // Clear inherited runtime markers before assigning this copy.
      delete clone.dataset.v350Across;delete clone.dataset.themeCrossCloneV94;delete clone.dataset.themeCrossCloneV342;delete clone.dataset.themeCrossCloneV149;
      source.item.parentElement?.appendChild(clone);
      const p=placement(instance,clone,true);
      movers.push(prepare(clone,source.asset,source.assetIndex,instance,travel,p.top,p.left,theme));
      travel==='right'?rightCount++:leftCount++;
    }

    const ctrl={stage,theme,signature:sig,movers,alive:true,raf:0,rebuildRaf:0,observer:null,itemSelector};
    controllers.set(stage,ctrl);

    const positionMover=(mover,now)=>{
      const item=mover.item;if(!item?.isConnected)return;
      const elapsed=motionElapsedV407(ctrl.theme);
      const p=((mover.phase+elapsed)%mover.duration)/mover.duration;
      const left=mover.travel==='right'?(-16+132*p):(116-132*p);
      item.style.setProperty('left',`${left.toFixed(4)}%`,'important');item.dataset.v350OwnsLeft='1';
      item.style.removeProperty('right');
      if(item.style.getPropertyValue('animation-name')!=='none')item.style.setProperty('animation-name','none','important');
      if(item.style.getPropertyValue('animation')!=='none')item.style.setProperty('animation','none','important');
    };

    // Position every mover before the V366 atomic decoration gate reveals art.
    const initialNow=performance.now();
    for(const mover of ctrl.movers) positionMover(mover,initialNow);
    if(stage.id==='custom-theme-background-stage') stage.dataset.loggyAcrossReadyV366='1';

    const tick=now=>{
      if(!ctrl.alive||!stage.isConnected)return;
      for(const mover of ctrl.movers) positionMover(mover,now);
      ctrl.raf=requestAnimationFrame(tick);
    };
    ctrl.raf=requestAnimationFrame(tick);

    try{
      ctrl.observer=new MutationObserver(records=>{
        const meaningful=records.some(r=>r.type==='childList'&&[...r.addedNodes,...r.removedNodes].some(n=>{
          if(n?.nodeType!==1)return false;
          if(n.dataset?.themeCrossCloneV350==='true')return false;
          return true;
        }));
        if(!meaningful||ctrl.rebuildRaf)return;
        ctrl.rebuildRaf=requestAnimationFrame(()=>{
          ctrl.rebuildRaf=0;
          if(ctrl.alive&&stage.isConnected)configureStage(stage,ctrl.theme,ctrl.itemSelector);
        });
      });
      ctrl.observer.observe(stage,{childList:true,subtree:false});
    }catch{}

    try{applyThemeHoverBehaviorV87?.(stage,theme)}catch{}
  }

  function configureApplied(theme){
    const explicit=theme&&typeof theme==='object'&&Object.keys(theme).length?theme:null;
    let resolved=explicit||lastAppliedTheme||null;
    if(!resolved){try{resolved=window.__loggyResolveAppliedThemeV372?.()||null}catch{}}
    resolved=resolved||{};
    if(resolved&&typeof resolved==='object'&&Object.keys(resolved).length)lastAppliedTheme=resolved;
    const stage=document.getElementById('custom-theme-background-stage');
    if(stage)configureStage(stage,resolved,':scope > .custom-theme-background-svg');
  }
  function draft(modal){
    try{return getThemeBuilderDraft?.(modal)||{}}catch{return{backgroundSvgs:Array.isArray(modal?._themeBackgroundSvgs)?modal._themeBackgroundSvgs:[],svgDefaultAnimation:modal?._themeSvgDefaultAnimation||'float'}}
  }
  function configureBuilder(modal){
    if(!modal)return;const theme=draft(modal);
    const live=modal.querySelector('.theme-builder-live-art-stage-v61');
    const dash=modal.querySelector('.theme-builder-dashboard-art-stage-v45,.theme-builder-dashboard-art-stage');
    if(live)configureStage(live,theme,':scope > .theme-builder-live-art-item');
    if(dash)configureStage(dash,theme,':scope > .theme-builder-dashboard-art-item-v45, :scope > .theme-builder-dashboard-art-item-v40');
  }

  // V404: the final decoration owner can explicitly reassert the one Across
  // Screen controller after every placement/default-motion pass.
  window.__loggyConfigureAcrossV404 = theme => configureApplied(theme||lastAppliedTheme||{});
  window.__loggyConfigureBuilderAcrossV404 = modal => configureBuilder(modal);

  function wrap(name,after){
    try{
      const original=window[name];if(typeof original!=='function'||original.__acrossRafV350)return;
      const wrapped=function(){const result=original.apply(this,arguments);try{after.apply(this,arguments)}catch{}return result};
      wrapped.__acrossRafV350=true;window[name]=wrapped;try{eval(`${name}=wrapped`)}catch{}
    }catch{}
  }
  // Configure synchronously after render. No delayed startup passes.
  wrap('mountCustomThemeBackgroundSvgsV2',theme=>configureApplied(theme||{}));
  wrap('applyCustomBuiltTheme',theme=>configureApplied(theme||lastAppliedTheme||{}));
  wrap('updateThemeBuilderPreview',modal=>configureBuilder(modal));
  wrap('renderThemeArtworkPreviewV61',modal=>configureBuilder(modal));
  wrap('renderDashboardPreviewV45',modal=>configureBuilder(modal));
  wrap('populateThemeBuilder',modal=>configureBuilder(modal));

  function boot(){configureApplied(lastAppliedTheme||{});const modal=document.getElementById('theme-builder-modal');if(modal)configureBuilder(modal)}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();

// ============================================================================
// V343 — REAL MONTHLY CALENDAR + REMOVE DAILY LOG COMPONENT
// The calendar is a month-at-a-glance planner: every in-month date has its own
// editable saved notes area. No Daily Log embedding and no event-only workflow.
// ============================================================================
(() => {
  'use strict';
  if (window.__loggyRealMonthlyCalendarV343) return;
  window.__loggyRealMonthlyCalendarV343 = true;

  const q=(s,r=document)=>r?.querySelector?.(s)||null;
  const qa=(s,r=document)=>Array.from(r?.querySelectorAll?.(s)||[]);
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const saveTimers=new WeakMap();

  function saveCalendarSoonV343(component, immediate=false){
    const prior=saveTimers.get(component);
    if(prior) clearTimeout(prior);
    const run=()=>{ saveTimers.delete(component); try{ saveDb(); }catch{} };
    if(immediate) run();
    else saveTimers.set(component,setTimeout(run,320));
  }

  function monthKeyV343(date){
    return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}`;
  }
  function dateKeyV343(date){
    return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
  }
  function parseMonthV343(value){
    const match=String(value||'').match(/^(\d{4})-(\d{2})$/);
    if(!match){ const n=new Date(); return new Date(n.getFullYear(),n.getMonth(),1); }
    return new Date(Number(match[1]),Number(match[2])-1,1);
  }

  function calendarEventIdV355(){
    try{ if(typeof uid==='function') return uid('event'); }catch{}
    return `event-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,8)}`;
  }

  function ensureCalendarNotesV343(component){
    component.title ||= 'Monthly Calendar';
    component.calendarMonthV341 ||= monthKeyV343(new Date());
    if(!component.calendarNotesV343 || typeof component.calendarNotesV343!=='object' || Array.isArray(component.calendarNotesV343)){
      component.calendarNotesV343={};
    }

    // Keep the event model too. V355 adds optional event images and lets the
    // user choose whether the calendar cell shows the event name or image.
    component.eventsV341=Array.isArray(component.eventsV341)?component.eventsV341:[];
    component.eventsV341=component.eventsV341.map(event=>({
      ...(event&&typeof event==='object'?event:{}),
      id:String(event?.id||calendarEventIdV355()),
      date:String(event?.date||''),
      title:String(event?.title||''),
      notes:String(event?.notes||''),
      imageV355:String(event?.imageV355||''),
      displayV355:event?.displayV355==='image'?'image':'name'
    }));

    // Preserve the earlier one-time migration for users who already had V341
    // events before the writable planner was introduced. New events remain
    // proper events and are not copied into the note textarea.
    if(!component.calendarEventsMigratedV343 && component.eventsV341.length){
      component.eventsV341.forEach(event=>{
        const key=String(event?.date||'').trim();
        if(!/^\d{4}-\d{2}-\d{2}$/.test(key)) return;
        const line=[String(event?.title||'').trim(),String(event?.notes||'').trim()].filter(Boolean).join(' — ');
        if(!line) return;
        const current=String(component.calendarNotesV343[key]||'').trim();
        component.calendarNotesV343[key]=current ? `${current}\n${line}` : line;
      });
      component.calendarEventsMigratedV343=true;
    }
    return component;
  }

  function calendarImageDataV355(file){
    return new Promise(resolve=>{
      if(!file){resolve('');return;}
      const reader=new FileReader();
      reader.onerror=()=>resolve('');
      reader.onload=()=>{
        const original=String(reader.result||'');
        if(!original){resolve('');return;}
        const image=new Image();
        image.onerror=()=>resolve(original);
        image.onload=()=>{
          try{
            const maxSide=1000;
            const naturalW=Math.max(1,image.naturalWidth||image.width||1);
            const naturalH=Math.max(1,image.naturalHeight||image.height||1);
            const scale=Math.min(1,maxSide/Math.max(naturalW,naturalH));
            const canvas=document.createElement('canvas');
            canvas.width=Math.max(1,Math.round(naturalW*scale));
            canvas.height=Math.max(1,Math.round(naturalH*scale));
            const ctx=canvas.getContext('2d');
            if(!ctx){resolve(original);return;}
            ctx.clearRect(0,0,canvas.width,canvas.height);
            ctx.drawImage(image,0,0,canvas.width,canvas.height);
            let output='';
            try{output=canvas.toDataURL('image/webp',.86)}catch{}
            if(!output||output==='data:,') output=original;
            resolve(output.length<=original.length*1.15?output:original);
          }catch{resolve(original);}
        };
        image.src=original;
      };
      reader.readAsDataURL(file);
    });
  }

  function openCalendarEventModalV355(tab,component,defaultDate,event=null){
    // V363: ensureCalendarNotesV343 normalizes events by mapping them to fresh
    // objects. Preserve the requested ID and then rebind `event` to the object
    // that actually lives in component.eventsV341. Without this, Edit Event can
    // mutate a detached pre-normalization object and the calendar keeps showing
    // the old display mode (for example Event name instead of Image).
    const requestedEventIdV363 = event?.id != null ? String(event.id) : '';
    ensureCalendarNotesV343(component);
    if(requestedEventIdV363){
      event = component.eventsV341.find(item=>String(item?.id)===requestedEventIdV363) || event;
    }
    document.querySelector('.monthly-calendar-event-overlay-v355')?.remove();
    const overlay=document.createElement('div');
    overlay.className='monthly-calendar-event-overlay-v355';
    const currentImage=String(event?.imageV355||'');
    const currentDisplay=event?.displayV355==='image'?'image':'name';
    overlay.innerHTML=`
      <div class="monthly-calendar-event-modal-v355" role="dialog" aria-modal="true" aria-label="${event?'Edit':'Add'} calendar event">
        <div class="monthly-calendar-event-modal-head-v355">
          <strong>${event?'Edit Event':'Add Event'}</strong>
          <button type="button" class="small-icon-btn calendar-event-close-v355" title="Close"><i class="ph ph-x"></i></button>
        </div>
        <label class="monthly-calendar-event-field-v355"><span>Date</span><input type="date" class="calendar-event-date-v355" value="${esc(event?.date||defaultDate||'')}"></label>
        <label class="monthly-calendar-event-field-v355"><span>Event name</span><input type="text" class="calendar-event-name-v355" value="${esc(event?.title||'')}" placeholder="Event name"></label>
        <label class="monthly-calendar-event-field-v355"><span>Notes <small>(optional)</small></span><textarea class="calendar-event-notes-v355" placeholder="Notes">${esc(event?.notes||'')}</textarea></label>
        <div class="monthly-calendar-event-field-v355 monthly-calendar-event-image-field-v357">
          <span>Upload image <small>(optional)</small></span>
          <input type="file" class="calendar-event-image-file-v355 calendar-event-image-file-v357" accept="image/*">
          <div class="calendar-event-image-row-v355">
            <button type="button" class="calendar-event-remove-image-v355">Remove image</button>
          </div>
          <div class="calendar-event-image-preview-v355"></div>
        </div>
        <label class="monthly-calendar-event-field-v355"><span>Show in calendar</span>
          <select class="calendar-event-display-v355">
            <option value="name"${currentDisplay==='name'?' selected':''}>Event name</option>
            <option value="image"${currentDisplay==='image'?' selected':''}>Image</option>
          </select>
        </label>
        <div class="calendar-event-error-v355" aria-live="polite"></div>
        <div class="monthly-calendar-event-actions-v355">
          ${event?'<button type="button" class="calendar-event-delete-v355 danger">Delete</button>':''}
          <span></span>
          <button type="button" class="calendar-event-cancel-v355">Cancel</button>
          <button type="button" class="calendar-event-save-v355">${event?'Save':'Add Event'}</button>
        </div>
      </div>`;
    document.body.appendChild(overlay);

    let imageData=currentImage;
    let imageLoadPromise=Promise.resolve();
    const preview=overlay.querySelector('.calendar-event-image-preview-v355');
    const removeBtn=overlay.querySelector('.calendar-event-remove-image-v355');
    const display=overlay.querySelector('.calendar-event-display-v355');
    const error=overlay.querySelector('.calendar-event-error-v355');
    const renderPreview=()=>{
      if(preview) preview.innerHTML=imageData?`<img src="${esc(imageData)}" alt="Event image preview">`:'<span>No image selected</span>';
      if(removeBtn) removeBtn.disabled=!imageData;
    };
    renderPreview();

    const close=()=>overlay.remove();
    overlay.querySelector('.calendar-event-close-v355')?.addEventListener('click',close);
    overlay.querySelector('.calendar-event-cancel-v355')?.addEventListener('click',close);
    overlay.addEventListener('mousedown',e=>{if(e.target===overlay)close()});

    const fileInput=overlay.querySelector('.calendar-event-image-file-v355');
    removeBtn?.addEventListener('click',()=>{
      imageData='';
      if(fileInput) fileInput.value='';
      renderPreview();
      if(display?.value==='image')display.value='name';
    });
    fileInput?.addEventListener('change',()=>{
      const file=fileInput.files?.[0];
      if(!file)return;
      fileInput.disabled=true;
      imageLoadPromise=calendarImageDataV355(file).then(data=>{
        imageData=data;
        renderPreview();
        return data;
      }).finally(()=>{ fileInput.disabled=false; });
    });

    overlay.querySelector('.calendar-event-save-v355')?.addEventListener('click',async()=>{
      await imageLoadPromise;
      const date=String(overlay.querySelector('.calendar-event-date-v355')?.value||'').trim();
      const title=String(overlay.querySelector('.calendar-event-name-v355')?.value||'').trim();
      const notes=String(overlay.querySelector('.calendar-event-notes-v355')?.value||'');
      const displayMode=display?.value==='image'?'image':'name';
      if(!/^\d{4}-\d{2}-\d{2}$/.test(date)){if(error)error.textContent='Choose a date.';return;}
      if(!title){if(error)error.textContent='Enter an event name.';return;}
      if(displayMode==='image'&&!imageData){if(error)error.textContent='Choose an image before selecting Image as the calendar display.';return;}
      const item={
        ...(event&&typeof event==='object'?event:{}),
        id:String(event?.id||calendarEventIdV355()),
        date,
        title,
        notes,
        imageV355:String(imageData||''),
        displayV355:displayMode
      };
      const existingIndexV363=component.eventsV341.findIndex(existing=>String(existing?.id)===String(item.id));
      if(existingIndexV363>=0) component.eventsV341[existingIndexV363]=item;
      else component.eventsV341.push(item);
      saveCalendarSoonV343(component,true);
      close();
      try{renderCustomTabView(tab.id)}catch{}
    });

    overlay.querySelector('.calendar-event-delete-v355')?.addEventListener('click',async()=>{
      let ok=true;
      try{if(typeof showAppConfirm==='function')ok=await showAppConfirm({title:'Delete Event',message:`Delete “${event?.title||'this event'}”?`,confirmLabel:'Delete'})}catch{}
      if(!ok)return;
      component.eventsV341=component.eventsV341.filter(item=>String(item.id)!==String(event?.id));
      saveCalendarSoonV343(component,true);
      close();
      try{renderCustomTabView(tab.id)}catch{}
    });

    requestAnimationFrame(()=>overlay.querySelector('.calendar-event-name-v355')?.focus());
  }

  function ensureCalendarStyleV343(){
    if(q('#loggy-real-calendar-v343-style')) return;
    const style=document.createElement('style');
    style.id='loggy-real-calendar-v343-style';
    style.textContent=`
      .monthly-calendar-v343-toolbar{display:flex;align-items:center;justify-content:space-between;gap:10px;margin:0 0 10px;flex-wrap:wrap}
      .monthly-calendar-v343-nav{display:flex;align-items:center;gap:7px}
      .monthly-calendar-v343-month{min-width:175px;text-align:center;font-weight:800}
      .monthly-calendar-v343-grid{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));width:100%;border-left:var(--thin-border);border-top:var(--thin-border);border-radius:var(--border-radius);overflow:hidden;background:var(--white)}
      .monthly-calendar-v343-weekday{padding:8px 4px;text-align:center;font-size:.72rem;font-weight:800;opacity:.7;background:var(--track-bg);border-right:var(--thin-border);border-bottom:var(--thin-border)}
      .monthly-calendar-v343-day{min-width:0;min-height:132px;padding:7px;display:flex;flex-direction:column;gap:5px;border-right:var(--thin-border);border-bottom:var(--thin-border);background:var(--white);box-sizing:border-box}
      .monthly-calendar-v343-day.is-outside{background:color-mix(in srgb,var(--track-bg) 48%,var(--white));opacity:.46}
      .monthly-calendar-v343-day-head{display:flex;align-items:flex-start;justify-content:flex-end;min-height:25px;width:100%}
      .monthly-calendar-v343-number{display:inline-grid;place-items:center;width:25px;height:25px;border-radius:50%;font-size:.76rem;font-weight:800;line-height:1;flex:0 0 auto;margin-left:auto;text-align:center}
      .monthly-calendar-v343-day.is-today .monthly-calendar-v343-number{outline:2px solid currentColor;outline-offset:1px}
      .monthly-calendar-v343-note{width:100%;min-width:0;min-height:88px;flex:1 1 auto;resize:none;box-sizing:border-box;padding:6px 7px;border:1px solid color-mix(in srgb,currentColor 18%,transparent);border-radius:7px;background:color-mix(in srgb,var(--white) 96%,transparent);color:inherit;font:inherit;font-size:.72rem;line-height:1.35;outline:none;overflow:auto}
      .monthly-calendar-v343-note:focus{border-color:currentColor;box-shadow:0 0 0 1px currentColor}
      .monthly-calendar-v343-note::placeholder{color:inherit;opacity:.38}
      .monthly-calendar-v343-outside-label{display:block;min-height:88px;flex:1}
      .monthly-calendar-v355-toolbar-actions{display:flex;align-items:center;gap:7px}
      .monthly-calendar-v355-add-event{display:inline-flex;align-items:center;gap:5px}
      .monthly-calendar-v355-events{display:grid;gap:4px;min-width:0;max-width:100%;overflow:hidden}
      .monthly-calendar-v355-event{width:100%;min-width:0;max-width:100%;box-sizing:border-box;overflow:hidden;border:0;border-radius:6px;background:var(--track-bg);color:inherit;font:inherit;cursor:pointer}
      .monthly-calendar-v355-event-name{padding:4px 6px;font-size:.68rem;line-height:1.2;text-align:left;white-space:nowrap;text-overflow:ellipsis}
      .monthly-calendar-v355-event-image{height:54px;padding:3px;display:flex;align-items:center;justify-content:center}
      .monthly-calendar-v355-event-image img{display:block;width:100%;height:100%;max-width:100%;max-height:100%;object-fit:contain;object-position:center;overflow:hidden}
      .monthly-calendar-v355-more{font-size:.62rem;opacity:.65;padding:1px 3px}
      .monthly-calendar-event-overlay-v355{position:fixed;inset:0;z-index:1000005;background:rgba(0,0,0,.34);display:grid;place-items:center;padding:18px;box-sizing:border-box}
      .monthly-calendar-event-modal-v355{width:min(520px,calc(100vw - 36px));max-height:calc(100vh - 36px);overflow:auto;box-sizing:border-box;background:var(--white);color:var(--black);border:var(--thin-border);border-radius:var(--border-radius);padding:16px;box-shadow:0 18px 60px rgba(0,0,0,.22)}
      .monthly-calendar-event-modal-head-v355{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:12px;font-size:1rem}
      .monthly-calendar-event-field-v355{display:grid;gap:6px;margin:10px 0;font:inherit}.monthly-calendar-event-field-v355>span{font-size:.76rem;font-weight:800}.monthly-calendar-event-field-v355 small{font-weight:500;opacity:.55}
      .monthly-calendar-event-field-v355 input[type=text],.monthly-calendar-event-field-v355 input[type=date],.monthly-calendar-event-field-v355 textarea,.monthly-calendar-event-field-v355 select{width:100%;box-sizing:border-box;border:var(--thin-border);border-radius:8px;background:var(--white);color:var(--black);font:inherit;padding:9px 10px;outline:none}
      .monthly-calendar-event-field-v355 textarea{min-height:82px;resize:vertical}
      .calendar-event-image-row-v355{display:flex;gap:7px;align-items:center;flex-wrap:wrap}.calendar-event-image-row-v355 button,.monthly-calendar-event-actions-v355 button{border:var(--thin-border);border-radius:8px;background:var(--white);color:var(--black);font:inherit;padding:8px 10px;cursor:pointer}.calendar-event-image-row-v355 button:disabled{opacity:.42;cursor:default}
      .calendar-event-image-file-v357{display:block!important;width:100%!important;box-sizing:border-box!important;border:var(--thin-border)!important;border-radius:8px!important;background:var(--white)!important;color:var(--black)!important;font:inherit!important;padding:7px!important;cursor:pointer!important}.calendar-event-image-file-v357::file-selector-button{border:var(--thin-border);border-radius:7px;background:var(--track-bg);color:var(--black);font:inherit;padding:7px 10px;margin-right:9px;cursor:pointer}.monthly-calendar-event-image-field-v357 .calendar-event-image-row-v355{margin-top:7px}
      .calendar-event-image-preview-v355{height:118px;display:flex;align-items:center;justify-content:center;border:var(--thin-border);border-radius:8px;overflow:hidden;background:var(--track-bg);font-size:.72rem;opacity:.9}.calendar-event-image-preview-v355 img{display:block;width:100%;height:100%;object-fit:contain;object-position:center}.calendar-event-image-preview-v355 span{opacity:.5}
      .calendar-event-error-v355{min-height:18px;font-size:.7rem;color:#b42318;margin-top:4px}
      .monthly-calendar-event-actions-v355{display:grid;grid-template-columns:auto 1fr auto auto;gap:7px;align-items:center;margin-top:10px}.monthly-calendar-event-actions-v355 .danger{color:#b42318}
      @media(max-width:900px){.monthly-calendar-v343-day{min-height:132px;padding:5px}.monthly-calendar-v343-note{min-height:58px;font-size:.66rem;padding:5px}.monthly-calendar-v343-weekday{font-size:.64rem}.monthly-calendar-v355-event-image{height:44px}}
      @media(max-width:650px){.monthly-calendar-v343-grid{min-width:720px}.monthly-calendar-v343-scroll{overflow-x:auto;scrollbar-width:none}.monthly-calendar-v343-scroll::-webkit-scrollbar{display:none}}
    `;
    document.head.appendChild(style);
  }

  // V357: one authoritative event modal for both the current calendar renderer
  // and any historical V341 path that is still reachable.
  window.__openCalendarEventModalV355 = openCalendarEventModalV355;

  function renderRealCalendarV343(tab,component,content){
    ensureCalendarStyleV343();
    ensureCalendarNotesV343(component);

    const month=parseMonthV343(component.calendarMonthV341);
    const year=month.getFullYear(), monthIndex=month.getMonth();
    const first=new Date(year,monthIndex,1);
    const start=new Date(year,monthIndex,1-first.getDay());
    const todayKey=dateKeyV343(new Date());
    const cells=Array.from({length:42},(_,i)=>{const d=new Date(start);d.setDate(start.getDate()+i);return d});

    content.innerHTML=`
      <div class="custom-collection-header"><h2>${esc(component.title||'Monthly Calendar')}</h2></div>
      <div class="monthly-calendar-v343-toolbar">
        <div class="monthly-calendar-v343-nav">
          <button type="button" class="small-icon-btn calendar-prev-v343" title="Previous month"><i class="ph ph-caret-left"></i></button>
          <strong class="monthly-calendar-v343-month">${month.toLocaleDateString(undefined,{month:'long',year:'numeric'})}</strong>
          <button type="button" class="small-icon-btn calendar-next-v343" title="Next month"><i class="ph ph-caret-right"></i></button>
        </div>
        <div class="monthly-calendar-v355-toolbar-actions">
          <button type="button" class="small-icon-btn calendar-today-v343">Today</button>
        </div>
      </div>
      <div class="monthly-calendar-v343-scroll">
        <div class="monthly-calendar-v343-grid">
          ${['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(day=>`<div class="monthly-calendar-v343-weekday">${day}</div>`).join('')}
          ${cells.map(date=>{
            const key=dateKeyV343(date);
            const outside=date.getMonth()!==monthIndex;
            const events=component.eventsV341.filter(event=>String(event.date)===key);
            const eventMarkup=events.slice(0,2).map(event=>{
              const imageMode=event.displayV355==='image'&&event.imageV355;
              return imageMode
                ? `<button type="button" class="monthly-calendar-v355-event monthly-calendar-v355-event-image" data-calendar-event-v355="${esc(event.id)}" title="${esc(event.title)}"><img data-calendar-event-image-v358="${esc(event.id)}" alt="${esc(event.title)}"></button>`
                : `<button type="button" class="monthly-calendar-v355-event monthly-calendar-v355-event-name" data-calendar-event-v355="${esc(event.id)}" title="${esc(event.notes||event.title)}">${esc(event.title)}</button>`;
            }).join('');
            return `<div class="monthly-calendar-v343-day${outside?' is-outside':''}${key===todayKey?' is-today':''}" data-calendar-date-v343="${key}" style="position:relative!important;padding:38px 7px 7px!important;align-items:stretch!important;justify-content:flex-start!important;">
              <span class="monthly-calendar-v343-number" style="position:absolute!important;top:8px!important;right:8px!important;left:auto!important;bottom:auto!important;margin:0!important;transform:none!important;translate:none!important;z-index:5!important;">${date.getDate()}</span>
              ${outside
                ? '<span class="monthly-calendar-v343-outside-label" aria-hidden="true"></span>'
                : `${events.length?`<div class="monthly-calendar-v355-events">${eventMarkup}${events.length>2?`<span class="monthly-calendar-v355-more">+${events.length-2} more</span>`:''}</div>`:''}`}
            </div>`;
          }).join('')}
        </div>
      </div>`;

    // V358: hydrate event images from the live event objects after the cell
    // markup exists. This avoids data URLs being lost/escaped by any HTML
    // rendering path and guarantees the selected image becomes the <img> src.
    qa('[data-calendar-event-image-v358]',content).forEach(img=>{
      const id=String(img.dataset.calendarEventImageV358||'');
      const event=component.eventsV341.find(item=>String(item.id)===id);
      const src=String(event?.imageV355||'');
      if(src) img.src=src;
    });

    q('.calendar-prev-v343',content)?.addEventListener('click',()=>{
      month.setMonth(month.getMonth()-1);
      component.calendarMonthV341=monthKeyV343(month);
      saveCalendarSoonV343(component,true);
      renderCustomTabView(tab.id);
    });
    q('.calendar-next-v343',content)?.addEventListener('click',()=>{
      month.setMonth(month.getMonth()+1);
      component.calendarMonthV341=monthKeyV343(month);
      saveCalendarSoonV343(component,true);
      renderCustomTabView(tab.id);
    });
    q('.calendar-today-v343',content)?.addEventListener('click',()=>{
      component.calendarMonthV341=monthKeyV343(new Date());
      saveCalendarSoonV343(component,true);
      renderCustomTabView(tab.id);
    });

    // V360: calendar-native interaction. Click an in-month day to add an event.
    // The event controls themselves stop propagation below so clicking an
    // existing event edits it instead of opening a second Add Event modal.
    qa('.monthly-calendar-v343-day:not(.is-outside)',content).forEach(day=>{
      day.addEventListener('click',e=>{
        if(e.target.closest('[data-calendar-event-v355]')) return;
        const date=String(day.dataset.calendarDateV343||'');
        if(date) openCalendarEventModalV355(tab,component,date,null);
      });
      day.setAttribute('title','Click to add an event');
      day.setAttribute('role','button');
      day.setAttribute('tabindex','0');
      day.addEventListener('keydown',e=>{
        if(e.key!=='Enter'&&e.key!==' ') return;
        if(e.target.closest('[data-calendar-event-v355]')) return;
        e.preventDefault();
        const date=String(day.dataset.calendarDateV343||'');
        if(date) openCalendarEventModalV355(tab,component,date,null);
      });
    });

    qa('[data-calendar-event-v355]',content).forEach(button=>{
      button.addEventListener('click',e=>{
        e.preventDefault();e.stopPropagation();
        const event=component.eventsV341.find(item=>String(item.id)===String(button.dataset.calendarEventV355));
        if(event)openCalendarEventModalV355(tab,component,event.date,event);
      });
    });

  }

  // Expose the real planner renderer so the final ownership guard can ensure
  // no historical event-calendar renderer takes over again later.
  window.__renderRealCalendarV343 = renderRealCalendarV343;

  function removeDailyLogComponentV343(){
    try{
      if(!Array.isArray(CUSTOM_COMPONENT_LIBRARY)) return;
      for(let i=CUSTOM_COMPONENT_LIBRARY.length-1;i>=0;i--){
        const def=CUSTOM_COMPONENT_LIBRARY[i]||{};
        const type=String(def.type||'');
        const label=String(def.label||'').trim();
        if(type==='dailyLogsV245' || type==='dailyLogV245' || type==='dailyLog' || /^Daily Logs?$/i.test(label)){
          CUSTOM_COMPONENT_LIBRARY.splice(i,1);
        }
      }
    }catch{}
  }

  function installV343(){
    ensureCalendarStyleV343();
    removeDailyLogComponentV343();

    // Ensure exactly one real monthly calendar choice exists in the palette.
    try{
      if(Array.isArray(CUSTOM_COMPONENT_LIBRARY)){
        const matches=CUSTOM_COMPONENT_LIBRARY.filter(def=>def?.type==='monthlyCalendarV341');
        if(!matches.length){
          const anchor=CUSTOM_COMPONENT_LIBRARY.findIndex(def=>def?.type==='tableV162');
          CUSTOM_COMPONENT_LIBRARY.splice(anchor>=0?anchor+1:CUSTOM_COMPONENT_LIBRARY.length,0,{type:'monthlyCalendarV341',label:'Monthly Calendar',icon:'ph-calendar-blank'});
        }else{
          matches[0].label='Monthly Calendar';
          matches[0].icon='ph-calendar-blank';
          let kept=false;
          for(let i=CUSTOM_COMPONENT_LIBRARY.length-1;i>=0;i--){
            if(CUSTOM_COMPONENT_LIBRARY[i]?.type!=='monthlyCalendarV341') continue;
            if(!kept){kept=true;continue;}
            CUSTOM_COMPONENT_LIBRARY.splice(i,1);
          }
        }
      }
    }catch{}

    // Last renderer wins: the V341 event calendar becomes the V343 note planner.
    try{
      if(typeof renderCustomComponentContent==='function' && !renderCustomComponentContent.__v343Calendar){
        const before=renderCustomComponentContent;
        const wrapped=function(tab,component,content){
          if(component?.type==='monthlyCalendarV341') return renderRealCalendarV343(tab,component,content);
          return before.apply(this,arguments);
        };
        wrapped.__v343Calendar=true;
        window.renderCustomComponentContent=wrapped;
        try{renderCustomComponentContent=wrapped}catch{}
      }
    }catch{}

    // Palette help must describe the actual note-per-day behavior.
    try{
      if(typeof renderCustomComponentPalette==='function' && !renderCustomComponentPalette.__v343CalendarPalette){
        const before=renderCustomComponentPalette;
        const wrapped=function(palette){
          removeDailyLogComponentV343();
          const result=before.apply(this,arguments);
          qa('.custom-component-palette-item',palette).forEach(card=>{
            const type=card.dataset.componentType;
            if(type==='dailyLogsV245'||type==='dailyLogV245'||type==='dailyLog') card.remove();
          });
          const card=q('.custom-component-palette-item[data-component-type="monthlyCalendarV341"]',palette);
          if(card){
            const tip=q('.custom-palette-tooltip-v164',card);
            if(tip) tip.textContent='A month-at-a-glance calendar with saved day notes and events. Events can show their name or an uploaded image inside the day box.';
          }
          return result;
        };
        wrapped.__v343CalendarPalette=true;
        window.renderCustomComponentPalette=wrapped;
        try{renderCustomComponentPalette=wrapped}catch{}
      }
    }catch{}
  }

  installV343();
  let attempts=0;
  const timer=setInterval(()=>{
    attempts++;
    installV343();
    if(attempts>20) clearInterval(timer);
  },300);
})();

// ============================================================================
// V347 — MONTHLY CALENDAR DAY NUMBERS: HARD-PIN TOP RIGHT
// The number is removed from normal flex/grid flow so no inherited/global
// alignment can push it back toward the middle-left of the cell.
// ============================================================================
(() => {
  'use strict';
  if (window.__loggyCalendarNumbersV347) return;
  window.__loggyCalendarNumbersV347 = true;

  const install = () => {
    let style = document.getElementById('monthly-calendar-number-position-v347');
    if (!style) {
      style = document.createElement('style');
      style.id = 'monthly-calendar-number-position-v347';
      style.textContent = `
        .monthly-calendar-v343-day {
          position: relative !important;
          align-items: stretch !important;
          justify-content: flex-start !important;
          padding: 38px 7px 7px !important;
          box-sizing: border-box !important;
        }
        .monthly-calendar-v343-day-head {
          position: static !important;
          display: block !important;
          width: 0 !important;
          height: 0 !important;
          min-height: 0 !important;
          margin: 0 !important;
          padding: 0 !important;
        }
        .monthly-calendar-v343-number {
          position: absolute !important;
          top: 8px !important;
          right: 8px !important;
          left: auto !important;
          bottom: auto !important;
          margin: 0 !important;
          transform: none !important;
          translate: none !important;
          z-index: 3 !important;
          display: inline-grid !important;
          place-items: center !important;
          width: 25px !important;
          height: 25px !important;
          line-height: 1 !important;
          text-align: center !important;
        }
        @media (max-width: 900px) {
          .monthly-calendar-v343-day {
            padding: 34px 5px 5px !important;
          }
          .monthly-calendar-v343-number {
            top: 6px !important;
            right: 6px !important;
          }
        }
      `;
      document.head.appendChild(style);
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', install, { once: true });
  } else {
    install();
  }
})();


// ============================================================================
// V349 — CALENDAR FINAL OWNER + HARD-PIN DAY NUMBERS
// The real planner renderer owns Monthly Calendar even if an older wrapper is
// still present. Both legacy and planner day numbers are pinned top-right.
// ============================================================================
(() => {
  'use strict';
  if (window.__loggyCalendarFinalV349) return;
  window.__loggyCalendarFinalV349 = true;

  const style=document.createElement('style');
  style.id='monthly-calendar-number-position-v349';
  style.textContent=`
    .monthly-calendar-v343-day{position:relative!important;padding:38px 7px 7px!important;align-items:stretch!important;justify-content:flex-start!important;}
    .monthly-calendar-v343-day > .monthly-calendar-v343-number,
    .monthly-calendar-v341-day > .monthly-calendar-v341-number{position:absolute!important;top:8px!important;right:8px!important;left:auto!important;bottom:auto!important;margin:0!important;transform:none!important;translate:none!important;z-index:5!important;}
    .monthly-calendar-v341-day{position:relative!important;padding-top:38px!important;}
    @media(max-width:900px){
      .monthly-calendar-v343-day{padding:34px 5px 5px!important}
      .monthly-calendar-v343-day > .monthly-calendar-v343-number,
      .monthly-calendar-v341-day > .monthly-calendar-v341-number{top:6px!important;right:6px!important}
    }
  `;
  document.head.appendChild(style);

  // Final renderer ownership. This executes after every historical calendar
  // wrapper in this bundle, so the old event-style calendar cannot win.
  try {
    if (typeof renderCustomComponentContent === 'function' && window.__renderRealCalendarV343) {
      const before = renderCustomComponentContent;
      const wrapped = function(tab, component, content) {
        if (component?.type === 'monthlyCalendarV341') {
          return window.__renderRealCalendarV343(tab, component, content);
        }
        return before.apply(this, arguments);
      };
      window.renderCustomComponentContent = wrapped;
      try { renderCustomComponentContent = wrapped; } catch {}
    }
  } catch {}

  // If a custom tab was already visible while the extras finished loading,
  // replace any old calendar DOM immediately instead of waiting for re-entry.
  requestAnimationFrame(() => {
    try {
      const active = document.querySelector('.custom-tab-view.view.active[data-custom-tab-id], .custom-tab-view.active[data-custom-tab-id]');
      const id = active?.dataset?.customTabId;
      if (!id || typeof getCustomTab !== 'function' || typeof renderCustomTabView !== 'function') return;
      const tab = getCustomTab(id);
      if (tab?.components?.some(c => c?.type === 'monthlyCalendarV341')) renderCustomTabView(id);
    } catch {}
  });
})();


// ============================================================================
// V351 — MONTHLY CALENDAR: CURRENT-MONTH BLACK BORDERS TAKE PRIORITY
// Every date cell belonging to the displayed month owns a complete black
// border on all four sides. Outside-month filler cells keep their subdued look.
// ============================================================================
(() => {
  'use strict';
  if (window.__loggyCalendarBlackBordersV351) return;
  window.__loggyCalendarBlackBordersV351 = true;

  let style = document.getElementById('monthly-calendar-current-month-borders-v351');
  if (!style) {
    style = document.createElement('style');
    style.id = 'monthly-calendar-current-month-borders-v351';
    style.textContent = `
      /* Highest-priority calendar rule: every real day in the displayed month
         has a complete solid black box, independent of theme border colors. */
      .monthly-calendar-v343-grid > .monthly-calendar-v343-day:not(.is-outside),
      .monthly-calendar-v341-grid > .monthly-calendar-v341-day:not(.is-outside) {
        border-top: 1px solid #000000 !important;
        border-right: 1px solid #000000 !important;
        border-bottom: 1px solid #000000 !important;
        border-left: 1px solid #000000 !important;
        border-color: #000000 !important;
        box-sizing: border-box !important;
      }

      /* Keep the current-month grid seams visually solid even where neighboring
         cells meet. This deliberately wins over old var(--thin-border) rules. */
      .monthly-calendar-v343-day:not(.is-outside) + .monthly-calendar-v343-day:not(.is-outside),
      .monthly-calendar-v341-day:not(.is-outside) + .monthly-calendar-v341-day:not(.is-outside) {
        border-left-color: #000000 !important;
      }
    `;
    document.head.appendChild(style);
  }
})();

// ============================================================================
// V355 — MONTHLY CALENDAR: UNIFORM THIN BORDERS + IMAGE EVENTS
// Current-month cells are black; outside-month cells are gray. Every side uses
// the exact same .5px weight so adjacent complete borders form a thin 1px seam.
// ============================================================================
(() => {
  'use strict';
  if (window.__loggyCalendarImageEventsV355) return;
  window.__loggyCalendarImageEventsV355 = true;

  const old=document.getElementById('monthly-calendar-borders-v355');
  old?.remove();
  const style=document.createElement('style');
  style.id='monthly-calendar-borders-v355';
  style.textContent=`
    .monthly-calendar-v343-grid,
    .monthly-calendar-v341-grid{
      border:0!important;
      gap:0!important;
      background:transparent!important;
    }
    .monthly-calendar-v343-weekday,
    .monthly-calendar-v341-weekday{
      border:.5px solid #b7b7b7!important;
      box-sizing:border-box!important;
    }
    .monthly-calendar-v343-grid > .monthly-calendar-v343-day,
    .monthly-calendar-v341-grid > .monthly-calendar-v341-day{
      border:.5px solid #b7b7b7!important;
      border-width:.5px!important;
      box-sizing:border-box!important;
      overflow:hidden!important;
    }
    .monthly-calendar-v343-grid > .monthly-calendar-v343-day:not(.is-outside),
    .monthly-calendar-v341-grid > .monthly-calendar-v341-day:not(.is-outside){
      border-color:#000000!important;
      border-width:.5px!important;
    }
    .monthly-calendar-v343-grid > .monthly-calendar-v343-day.is-outside,
    .monthly-calendar-v341-grid > .monthly-calendar-v341-day.is-outside{
      border-color:#b7b7b7!important;
      border-width:.5px!important;
    }
  `;
  document.head.appendChild(style);
})();



// ============================================================================
// V358 — MONTHLY CALENDAR IMAGE EVENTS: AUTHORITATIVE IMAGE RENDERING
// ============================================================================
(() => {
  'use strict';
  if (window.__loggyCalendarImageRenderV358) return;
  window.__loggyCalendarImageRenderV358 = true;
  const style=document.createElement('style');
  style.id='monthly-calendar-image-render-v358';
  style.textContent=`
    .monthly-calendar-v355-event-image,
    .monthly-calendar-v341-event-image-v358{
      display:flex!important;
      align-items:center!important;
      justify-content:center!important;
      width:100%!important;
      min-width:0!important;
      max-width:100%!important;
      height:74px!important;
      max-height:74px!important;
      padding:3px!important;
      box-sizing:border-box!important;
      overflow:hidden!important;
      white-space:normal!important;
    }
    .monthly-calendar-v355-event-image img,
    .monthly-calendar-v341-event-image-v358 img{
      display:block!important;
      width:100%!important;
      height:100%!important;
      min-width:0!important;
      min-height:0!important;
      max-width:100%!important;
      max-height:100%!important;
      object-fit:contain!important;
      object-position:center!important;
      margin:0!important;
      padding:0!important;
      border:0!important;
      overflow:hidden!important;
    }
  `;
  document.head.appendChild(style);
})();


// V360 — MONTHLY CALENDAR: CLICK DAY TO ADD EVENT, NO WRITE BOXES
(() => {
  'use strict';
  if (window.__loggyMonthlyCalendarClickDayV360) return;
  window.__loggyMonthlyCalendarClickDayV360 = true;

  const style = document.createElement('style');
  style.id = 'monthly-calendar-click-day-v360';
  style.textContent = `
    .monthly-calendar-v343-day:not(.is-outside){
      cursor:pointer!important;
      overflow:hidden!important;
    }
    .monthly-calendar-v343-day:not(.is-outside):hover{
      background:color-mix(in srgb,var(--track-bg) 22%,var(--white))!important;
    }
    .monthly-calendar-v343-day:not(.is-outside):focus-visible{
      outline:2px solid currentColor!important;
      outline-offset:-2px!important;
    }
    .monthly-calendar-v343-note,
    [data-calendar-note-v343],
    .monthly-calendar-v355-add-event{
      display:none!important;
    }
    .monthly-calendar-v355-events{
      margin:0!important;
      align-content:start!important;
    }
    .monthly-calendar-v355-event{
      position:relative!important;
      z-index:6!important;
    }
  `;
  document.head.appendChild(style);
})();


// ============================================================================
// V362 — DISTINCT DEFAULT DECORATION MOTIONS + UI/TOOLBOX POLISH
// Every built-in Theme Builder motion has one authoritative WAAPI definition.
// The normal movement runs on an inner layer so hover animation can continue to
// use the historical motion shell without either animation replacing the other.
// ============================================================================
(() => {
  'use strict';
  if (window.__loggyDistinctDefaultMotionsV362) return;
  window.__loggyDistinctDefaultMotionsV362 = true;

  const BUILT_INS = new Set([
    'float','bob','drift','travel','fall','spin','pulse','still','cross-screen',
    'gentle-sway','breathe','slow-rock','soft-glide','small-orbit','flutter',
    'playful-wobble','tiny-hop','moody-wander-bounce','travel-bounce','drift-sway',
    'orbit-pulse','glide-bob','float-twirl','zigzag-bounce'
  ]);
  const EPOCH = window.__loggyDefaultMotionEpochV362 || (window.__loggyDefaultMotionEpochV362 = performance.now());
  let lastAppliedThemeV362 = null;
  let lastBuilderThemeV362 = null;
  let queuedAppliedV362 = 0;
  let queuedBuilderV362 = 0;

  const hash32 = value => {
    const str=String(value||''); let h=2166136261>>>0;
    for(let i=0;i<str.length;i++){h^=str.charCodeAt(i);h=Math.imul(h,16777619)}
    h^=h>>>16; h=Math.imul(h,2246822519); h^=h>>>13; h=Math.imul(h,3266489917); h^=h>>>16;
    return h>>>0;
  };
  const unit = (seed,salt) => hash32(`${seed}|${salt}`)/4294967296;
  const effective = (asset, theme) => {
    const ai=theme?.themeBuilderAiUsedV364===true||String(theme?.themeBuilderAutoToolV364||'')==='ai'||!!theme?.themeBuilderAiVariantsV376;
    const raw=String(asset?.animationOverride||'').trim();
    const override=ai&&asset?.animationOverrideUserSetV404!==true?'':raw;
    return String(override||theme?.svgDefaultAnimation||asset?.animation||'float').trim()||'float';
  };
  const hidden = a => !!(a && (a.hiddenOnScreenV63===true || a.hidden===true || a.enabled===false || a.showOnScreen===false || a.visible===false || a.visibleV63===false));
  const norm = v => {
    const raw=String(v||'').trim(); if(!raw)return'';
    try{return decodeURIComponent(new URL(raw,location.href).pathname).replace(/\\/g,'/').toLowerCase()}
    catch{return raw.split(/[?#]/)[0].replace(/\\/g,'/').toLowerCase()}
  };
  const assetUrl = a => norm(a?.url||a?.src||a?.dataUrl||a?.image||'');
  const itemUrl = item => {
    const media=item?.querySelector?.('img[src],object[data],image[href],image[xlink\\:href]');
    return norm(media?.getAttribute?.('src')||media?.getAttribute?.('data')||media?.getAttribute?.('href')||media?.getAttribute?.('xlink:href')||'');
  };
  function assetFor(item, assets, displayIndex){
    const stored=Number(item?.dataset?.svgIndex);
    if(Number.isFinite(stored)&&stored>=0&&assets[stored])return{asset:assets[stored],index:stored};
    const url=itemUrl(item);
    if(url){
      let idx=assets.findIndex(a=>assetUrl(a)===url);
      if(idx<0){const base=url.split('/').pop(); if(base)idx=assets.findIndex(a=>assetUrl(a).split('/').pop()===base)}
      if(idx>=0)return{asset:assets[idx],index:idx};
    }
    const visible=assets.map((a,i)=>({a,i})).filter(x=>!hidden(x.a));
    const f=visible[displayIndex%Math.max(1,visible.length)];
    return f?{asset:f.a,index:f.i}:{asset:assets[displayIndex%Math.max(1,assets.length)]||{},index:displayIndex};
  }

  function spec(name){
    switch(name){
      case 'float': return {d:4800,e:'ease-in-out',dir:'alternate',f:[
        {transform:'translate3d(-3px,6px,0) rotate(-1.5deg)'},{transform:'translate3d(3px,-11px,0) rotate(1.7deg)'},{transform:'translate3d(7px,-4px,0) rotate(.4deg)'}]};
      case 'bob': return {d:1850,e:'ease-in-out',dir:'alternate',f:[{transform:'translate3d(0,9px,0)'},{transform:'translate3d(0,-15px,0)'}]};
      case 'drift': return {d:8200,e:'ease-in-out',dir:'alternate',f:[{transform:'translate3d(-25px,4px,0) rotate(-1deg)'},{transform:'translate3d(25px,-5px,0) rotate(1deg)'}]};
      case 'travel': return {d:6500,e:'ease-in-out',dir:'alternate',f:[{transform:'translate3d(-38px,0,0)'},{transform:'translate3d(38px,0,0)'}]};
      case 'fall': return {d:7200,e:'linear',dir:'normal',f:[{transform:'translate3d(-8px,-120vh,0) rotate(-4deg)',opacity:0,offset:0},{transform:'translate3d(-7px,-112vh,0) rotate(-3deg)',opacity:1,offset:.035},{transform:'translate3d(8px,112vh,0) rotate(5deg)',opacity:1,offset:.965},{transform:'translate3d(9px,120vh,0) rotate(6deg)',opacity:0,offset:1}]};
      case 'spin': return {d:8000,e:'linear',dir:'normal',f:[{transform:'rotate(0deg)'},{transform:'rotate(360deg)'}]};
      case 'pulse': return {d:2300,e:'ease-in-out',dir:'alternate',f:[{transform:'scale(.92)'},{transform:'scale(1.09)'}]};
      case 'still': return null;
      case 'gentle-sway': return {d:3600,e:'ease-in-out',dir:'alternate',f:[{transform:'translateX(-8px) rotate(-4deg)'},{transform:'translateX(8px) rotate(4deg)'}]};
      case 'breathe': return {d:3300,e:'ease-in-out',dir:'alternate',f:[{transform:'scale(.955)'},{transform:'scale(1.055)'}]};
      case 'slow-rock': return {d:4300,e:'ease-in-out',dir:'alternate',f:[{transform:'translateY(2px) rotate(-8deg)'},{transform:'translateY(-3px) rotate(8deg)'}]};
      case 'soft-glide': return {d:5600,e:'ease-in-out',dir:'alternate',f:[{transform:'translate3d(-24px,0,0)'},{transform:'translate3d(24px,0,0)'}]};
      case 'small-orbit': return {d:4600,e:'linear',dir:'normal',f:[
        {transform:'translate3d(0,-14px,0)'},{transform:'translate3d(14px,0,0)'},{transform:'translate3d(0,14px,0)'},{transform:'translate3d(-14px,0,0)'},{transform:'translate3d(0,-14px,0)'}]};
      case 'flutter': return {d:1450,e:'ease-in-out',dir:'normal',f:[
        {transform:'translate3d(0,1px,0) rotate(0deg)',offset:0},{transform:'translate3d(4px,-8px,0) rotate(7deg)',offset:.22},{transform:'translate3d(-3px,-3px,0) rotate(-6deg)',offset:.46},{transform:'translate3d(3px,-10px,0) rotate(5deg)',offset:.7},{transform:'translate3d(0,1px,0) rotate(0deg)',offset:1}]};
      case 'playful-wobble': return {d:2500,e:'ease-in-out',dir:'normal',f:[
        {transform:'translate3d(0,0,0) rotate(0)',offset:0},{transform:'translate3d(-9px,-3px,0) rotate(-7deg)',offset:.22},{transform:'translate3d(8px,3px,0) rotate(6deg)',offset:.48},{transform:'translate3d(-4px,-2px,0) rotate(-3deg)',offset:.72},{transform:'translate3d(0,0,0) rotate(0)',offset:1}]};
      case 'tiny-hop': return {d:2550,e:'cubic-bezier(.2,.72,.25,1)',dir:'normal',f:[
        {transform:'translate3d(0,0,0) scale(1)',offset:0},{transform:'translate3d(0,0,0) scale(1)',offset:.18},{transform:'translate3d(0,-19px,0) scale(.98,1.04)',offset:.31},{transform:'translate3d(0,0,0) scale(1.07,.93)',offset:.43},{transform:'translate3d(0,-5px,0) scale(.99,1.02)',offset:.51},{transform:'translate3d(0,0,0) scale(1)',offset:.59},{transform:'translate3d(0,0,0) scale(1)',offset:1}]};
      case 'moody-wander-bounce': return {d:6000,e:'ease-in-out',dir:'normal',f:[
        {transform:'translate3d(-19px,3px,0)'},{transform:'translate3d(-5px,-15px,0)'},{transform:'translate3d(18px,5px,0)'},{transform:'translate3d(6px,-10px,0)'},{transform:'translate3d(-19px,3px,0)'}]};
      case 'travel-bounce': return {d:5200,e:'ease-in-out',dir:'alternate',f:[
        {transform:'translate3d(-35px,0,0)',offset:0},{transform:'translate3d(-17px,-13px,0)',offset:.25},{transform:'translate3d(0,0,0)',offset:.5},{transform:'translate3d(18px,-13px,0)',offset:.75},{transform:'translate3d(35px,0,0)',offset:1}]};
      case 'drift-sway': return {d:6900,e:'ease-in-out',dir:'alternate',f:[{transform:'translate3d(-23px,2px,0) rotate(-6deg)'},{transform:'translate3d(23px,-4px,0) rotate(6deg)'}]};
      case 'orbit-pulse': return {d:4700,e:'linear',dir:'normal',f:[
        {transform:'translate3d(0,-14px,0) scale(.95)'},{transform:'translate3d(14px,0,0) scale(1.08)'},{transform:'translate3d(0,14px,0) scale(.96)'},{transform:'translate3d(-14px,0,0) scale(1.07)'},{transform:'translate3d(0,-14px,0) scale(.95)'}]};
      case 'glide-bob': return {d:5600,e:'ease-in-out',dir:'alternate',f:[
        {transform:'translate3d(-30px,5px,0)'},{transform:'translate3d(-10px,-12px,0)'},{transform:'translate3d(10px,6px,0)'},{transform:'translate3d(30px,-10px,0)'}]};
      case 'float-twirl': return {d:5300,e:'ease-in-out',dir:'alternate',f:[{transform:'translate3d(-4px,10px,0) rotate(-11deg)'},{transform:'translate3d(5px,-13px,0) rotate(12deg)'}]};
      case 'zigzag-bounce': return {d:4400,e:'ease-in-out',dir:'normal',f:[
        {transform:'translate3d(-28px,5px,0)',offset:0},{transform:'translate3d(-12px,-14px,0)',offset:.25},{transform:'translate3d(5px,5px,0)',offset:.5},{transform:'translate3d(20px,-14px,0)',offset:.75},{transform:'translate3d(28px,5px,0)',offset:1}]};
      default: return null;
    }
  }

  function ensureLayer(shell){
    if(!shell)return null;
    let layer=shell.querySelector(':scope > .loggy-default-motion-layer-v362');
    if(!layer){
      layer=document.createElement('div');
      layer.className='loggy-default-motion-layer-v362';
      const nodes=Array.from(shell.childNodes);
      nodes.forEach(node=>layer.appendChild(node));
      shell.appendChild(layer);
    }
    return layer;
  }
  function cancelLayer(layer){
    if(!layer)return;
    try{layer._loggyDefaultMotionV362?.cancel?.()}catch{}
    layer._loggyDefaultMotionV362=null;
    layer.style.removeProperty('transform');
  }
  function stripLegacyBuiltInMotion(item,shell){
    Array.from(item.classList||[]).forEach(cls=>{
      if(/^theme-svg-anim-/.test(cls)){
        const id=cls.slice('theme-svg-anim-'.length);
        if(BUILT_INS.has(id))item.classList.remove(cls);
      }
    });
    Array.from(shell?.classList||[]).forEach(cls=>{
      if(/^dashboard-anim-/.test(cls)) shell.classList.remove(cls);
    });
    // Clear only stale normal-motion inline animation. Hover V82 will put its
    // own animation here temporarily on pointerenter and restore it on leave.
    if(!item.matches?.(':hover')){
      shell?.style?.removeProperty('animation');
      shell?.style?.removeProperty('animation-name');
      shell?.style?.removeProperty('animation-duration');
      shell?.style?.removeProperty('animation-delay');
      shell?.style?.removeProperty('animation-play-state');
    }
  }
  function bindItem(item,asset,index,theme){
    if(!item||hidden(asset))return;
    const name=effective(asset,theme);
    const shell=item.querySelector(':scope > .theme-svg-motion-shell, :scope > .theme-image-motion-shell-v36, :scope > .dashboard-shared-motion-v41') || item.querySelector('.theme-svg-motion-shell,.theme-image-motion-shell-v36,.dashboard-shared-motion-v41');
    if(!shell)return;
    const layer=ensureLayer(shell); if(!layer)return;
    if(name==='cross-screen' || !BUILT_INS.has(name)){
      cancelLayer(layer); delete item.dataset.defaultMotionV362; return;
    }
    stripLegacyBuiltInMotion(item,shell);
    const speed=Math.max(.25,Math.min(2,(Number(theme?.decorationAnimationSpeedV369)||100)/100));
    const motionKey=`${name}@${speed.toFixed(3)}`;
    if(item.dataset.defaultMotionV362===motionKey && layer._loggyDefaultMotionV362?.playState && layer._loggyDefaultMotionV362.playState!=='idle') return;
    cancelLayer(layer);
    item.dataset.defaultMotionV362=motionKey;
    if(name==='still')return;
    const motion=spec(name); if(!motion)return;
    const duration=motion.d/speed;
    try{
      const anim=layer.animate(motion.f,{duration,easing:motion.e,iterations:Infinity,direction:motion.dir,fill:'both'});
      const seed=`${asset?.id||asset?.key||assetUrl(asset)||asset?.name||index}|${name}`;
      const phase=unit(seed,'phase')*duration;
      anim.currentTime=((performance.now()-EPOCH)+phase)%duration;
      layer._loggyDefaultMotionV362=anim;
    }catch{}
  }
  function stageItems(stage){
    if(stage.id==='custom-theme-background-stage') return Array.from(stage.querySelectorAll(':scope > .custom-theme-background-svg'));
    if(stage.matches('.theme-builder-live-art-stage-v61')) return Array.from(stage.querySelectorAll(':scope > .theme-builder-live-art-item'));
    if(stage.matches('.theme-builder-dashboard-art-stage-v45,.theme-builder-dashboard-art-stage')) return Array.from(stage.querySelectorAll(':scope > .theme-builder-dashboard-art-item-v45,:scope > .theme-builder-dashboard-art-item-v40,:scope > .theme-builder-dashboard-art-item'));
    return [];
  }
  function bindStage(stage,theme){
    if(!stage)return;
    const assets=Array.isArray(theme?.backgroundSvgs)?theme.backgroundSvgs:[];
    stageItems(stage).forEach((item,i)=>{
      if(item.dataset.themeCrossCloneV350==='true')return;
      const found=assetFor(item,assets,i); bindItem(item,found.asset||{},found.index,theme||{});
    });
  }
  function builderDraft(){
    const modal=document.getElementById('theme-builder-v307-modal')||document.getElementById('theme-builder-modal');
    // V373: a hidden builder is NOT an applied Log theme. Only expose a draft
    // while a builder is actually open/visible; otherwise its default Float
    // value must never be allowed to rebind the real Log decoration stage.
    if(!modal)return null;
    const visible=!modal.hidden&&!modal.classList.contains('hidden')&&getComputedStyle(modal).display!=='none';
    if(!visible)return null;
    try{if(typeof getThemeBuilderDraft==='function'){const draft=getThemeBuilderDraft(modal)||{};return Object.keys(draft).length?draft:null}}catch{}
    return null;
  }
  const nonEmptyThemeV362=theme=>!!(theme&&typeof theme==='object'&&Object.keys(theme).length);
  function appliedThemeV362(explicit){
    if(nonEmptyThemeV362(explicit)){lastAppliedThemeV362=explicit;return explicit}
    if(nonEmptyThemeV362(lastAppliedThemeV362))return lastAppliedThemeV362;
    try{const resolved=window.__loggyResolveAppliedThemeV372?.()||{};if(nonEmptyThemeV362(resolved)){lastAppliedThemeV362=resolved;return resolved}}catch{}
    return{};
  }
  function builderThemeV362(explicit){
    if(nonEmptyThemeV362(explicit)){lastBuilderThemeV362=explicit;return explicit}
    const draft=builderDraft();if(nonEmptyThemeV362(draft)){lastBuilderThemeV362=draft;return draft}
    if(nonEmptyThemeV362(lastBuilderThemeV362))return lastBuilderThemeV362;
    return appliedThemeV362();
  }
  function bindAppliedV362(theme){
    const stage=document.getElementById('custom-theme-background-stage');
    if(stage)bindStage(stage,appliedThemeV362(theme));
  }
  function bindBuilderV362(theme){
    const resolved=builderThemeV362(theme);
    document.querySelectorAll('.theme-builder-live-art-stage-v61,.theme-builder-dashboard-art-stage-v45,.theme-builder-dashboard-art-stage').forEach(stage=>bindStage(stage,resolved));
  }
  function scheduleAppliedV362(theme){
    if(queuedAppliedV362)cancelAnimationFrame(queuedAppliedV362);
    queuedAppliedV362=requestAnimationFrame(()=>{queuedAppliedV362=0;bindAppliedV362(theme)});
  }
  function scheduleBuilderV362(theme){
    if(queuedBuilderV362)cancelAnimationFrame(queuedBuilderV362);
    queuedBuilderV362=requestAnimationFrame(()=>{queuedBuilderV362=0;bindBuilderV362(theme)});
  }
  // V363/V373: explicit theme finalization always belongs to the real applied
  // stage (including the real-site iframe preview, where the draft is applied
  // through applyCustomBuiltTheme). It must never borrow a hidden builder draft.
  window.__loggyApplyDefaultMotionsV363 = function(theme){
    const resolved=appliedThemeV362(theme);
    bindAppliedV362(resolved);
    requestAnimationFrame(()=>bindAppliedV362(resolved));
  };
  function wrapApplied(name,themeFromArgs){
    try{
      const original=window[name];if(typeof original!=='function'||original.__defaultMotionV362)return;
      const wrapped=function(){const result=original.apply(this,arguments);let t=null;try{t=themeFromArgs?themeFromArgs.apply(this,arguments):arguments[0]}catch{};if(nonEmptyThemeV362(t))lastAppliedThemeV362=t;scheduleAppliedV362(t);return result};
      wrapped.__defaultMotionV362=true;window[name]=wrapped;try{eval(`${name}=window[name]`)}catch{}
    }catch{}
  }
  function wrapBuilder(name){
    try{
      const original=window[name];if(typeof original!=='function'||original.__defaultMotionV362)return;
      const wrapped=function(){const result=original.apply(this,arguments);const draft=builderDraft();if(nonEmptyThemeV362(draft))lastBuilderThemeV362=draft;scheduleBuilderV362(draft);return result};
      wrapped.__defaultMotionV362=true;window[name]=wrapped;try{eval(`${name}=window[name]`)}catch{}
    }catch{}
  }
  wrapApplied('mountCustomThemeBackgroundSvgsV2',t=>t);
  wrapApplied('applyCustomBuiltTheme',t=>t);
  wrapBuilder('updateThemeBuilderPreview');
  wrapBuilder('renderThemeArtworkPreviewV61');
  wrapBuilder('renderDashboardPreviewV45');

  // Rebind only the stage family that actually changed. A builder mutation can
  // no longer schedule a rebind of the real Log stage, and vice versa.
  const appliedObserverV373=new MutationObserver(records=>{
    if(records.some(r=>r.type==='childList'&&([...r.addedNodes,...r.removedNodes].some(n=>n?.nodeType===1))))scheduleAppliedV362();
  });
  const builderObserverV373=new MutationObserver(records=>{
    if(records.some(r=>r.type==='childList'&&([...r.addedNodes,...r.removedNodes].some(n=>n?.nodeType===1))))scheduleBuilderV362();
  });
  function observeStages(){
    const applied=document.getElementById('custom-theme-background-stage');
    if(applied&&applied.dataset.defaultMotionObservedV362!=='1'){applied.dataset.defaultMotionObservedV362='1';appliedObserverV373.observe(applied,{childList:true,subtree:false})}
    document.querySelectorAll('.theme-builder-live-art-stage-v61,.theme-builder-dashboard-art-stage-v45,.theme-builder-dashboard-art-stage').forEach(stage=>{
      if(stage.dataset.defaultMotionObservedV362==='1')return;stage.dataset.defaultMotionObservedV362='1';builderObserverV373.observe(stage,{childList:true,subtree:false});
    });
  }
  const boot=()=>{
    observeStages();bindAppliedV362();bindBuilderV362();
    const rootObserver=new MutationObserver(records=>{
      let appliedAdded=false,builderAdded=false;
      for(const record of records){for(const node of record.addedNodes||[]){
        if(node?.nodeType!==1)continue;
        if(node.matches?.('#custom-theme-background-stage')||node.querySelector?.('#custom-theme-background-stage'))appliedAdded=true;
        if(node.matches?.('.theme-builder-live-art-stage-v61,.theme-builder-dashboard-art-stage-v45,.theme-builder-dashboard-art-stage')||node.querySelector?.('.theme-builder-live-art-stage-v61,.theme-builder-dashboard-art-stage-v45,.theme-builder-dashboard-art-stage'))builderAdded=true;
      }}
      if(appliedAdded||builderAdded)observeStages();
      if(appliedAdded)scheduleAppliedV362();
      if(builderAdded)scheduleBuilderV362();
    });
    rootObserver.observe(document.documentElement,{childList:true,subtree:true});
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();

  // Quiz settings alignment: match the right edge used by the other tab actions.
  const style=document.createElement('style');style.id='loggy-v362-ui-polish';style.textContent=`
    #quizzes-view #open-quiz-settings-v58.quiz-settings-button-v58{right:15px!important;top:15px!important;}
    @media(max-width:650px){#quizzes-view #open-quiz-settings-v58.quiz-settings-button-v58{right:15px!important;}}
    html.toolbox-tab-deleted-v362 #log-view section:has(#add-tool-to-day-btn){display:none!important;}
    .monthly-calendar-v355-event-image,.monthly-calendar-v341-event-image-v358{height:74px!important;max-height:74px!important;}
  `;document.head.appendChild(style);

  // Toolbox tab: enforce right-click delete in capture phase and tie the tab's
  // existence to the Tools section on every Day Log.
  const toolboxDeleted=()=>{try{return Array.isArray(db?.settings?.hiddenBuiltInTabsV52)&&db.settings.hiddenBuiltInTabsV52.includes('tools')}catch{return false}};
  function syncToolbox(){
    const deleted=toolboxDeleted(); document.documentElement.classList.toggle('toolbox-tab-deleted-v362',deleted);
    const button=document.getElementById('open-tools-btn');
    if(button){button.classList.toggle('log-nav-hidden-v52',deleted);button.hidden=deleted;button.setAttribute('aria-hidden',deleted?'true':'false')}
    const section=document.getElementById('add-tool-to-day-btn')?.closest('section');
    if(section){section.hidden=deleted;section.style.display=deleted?'none':'';section.setAttribute('aria-hidden',deleted?'true':'false')}
  }
  async function deleteToolbox(){
    try{
      if(typeof deleteBuiltInLogTabV52==='function'){await deleteBuiltInLogTabV52('tools');syncToolbox();return}
    }catch{}
    let ok=true;try{ok=await showAppConfirm({title:'Delete Toolbox tab?',message:'',confirmLabel:'Delete Tab'})}catch{}
    if(!ok)return;
    try{db.settings||={};db.settings.hiddenBuiltInTabsV52=Array.isArray(db.settings.hiddenBuiltInTabsV52)?db.settings.hiddenBuiltInTabsV52:[];if(!db.settings.hiddenBuiltInTabsV52.includes('tools'))db.settings.hiddenBuiltInTabsV52.push('tools');await Promise.resolve(saveDb?.())}catch{}
    syncToolbox();
  }
  document.addEventListener('contextmenu',event=>{
    const button=event.target?.closest?.('#open-tools-btn');if(!button)return;
    event.preventDefault();event.stopImmediatePropagation();
    try{showCustomItemContextMenu(event.clientX,event.clientY,[{label:'Delete Toolbox tab',icon:'ph-trash',danger:true,action:deleteToolbox}])}
    catch{deleteToolbox()}
  },true);
  const syncSoon=()=>requestAnimationFrame(syncToolbox);
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',syncSoon,{once:true});else syncSoon();
  document.addEventListener('click',syncSoon,true);
  try{
    const oldRestore=window.restoreBuiltInLogTabV52;
    if(typeof oldRestore==='function'&&!oldRestore.__toolboxSyncV362){window.restoreBuiltInLogTabV52=function(){const r=oldRestore.apply(this,arguments);syncSoon();return r};window.restoreBuiltInLogTabV52.__toolboxSyncV362=true;try{restoreBuiltInLogTabV52=window.restoreBuiltInLogTabV52}catch{}}
  }catch{}
})();


// ============================================================================
// V363 — PREVIEW MOTION FINALIZATION + CALENDAR EDIT PERSISTENCE + KB ALIGNMENT
// ============================================================================
(() => {
  'use strict';
  if(window.__loggyV363UiFinal) return;
  window.__loggyV363UiFinal=true;
  const style=document.createElement('style');
  style.id='loggy-v363-ui-final';
  style.textContent=`
    /* V81 deliberately left a large right shadow gutter on Knowledge Base.
       The current header controls no longer need it; align them with the other
       tab action buttons at the actual right edge. */
    #phrases-library-view.view.active > .log-header-container{padding-right:0!important;}
    #phrases-library-view.view.active #add-phrase-library-btn{margin-right:0!important;}
    #phrases-library-view.view.active > .log-header-container > div:last-child{margin-left:auto!important;margin-right:0!important;}
  `;
  document.head.appendChild(style);
})();

/* V364 — accessory rename parity in Log Settings (no prompt()) */
(() => {
  'use strict';
  if (window.__loggyAccessoryRenameV364) return;
  window.__loggyAccessoryRenameV364 = true;

  const RENAME_KEY = 'loggy-accessory-renames-v364';
  const CUR_KEY = 'loggy-custom-cursors-v163';
  const COMP_KEY = 'loggy-custom-companions-v163';
  const HIDE_CUR = 'loggy-hidden-cursors-v163';
  const HIDE_COMP = 'loggy-hidden-companions-v163';

  const read = (key, fallback) => {
    try { const v = JSON.parse(localStorage.getItem(key) || 'null'); return v ?? fallback; }
    catch { return fallback; }
  };
  const write = (key, value) => { try { localStorage.setItem(key, JSON.stringify(value)); } catch {} };

  function applySavedNamesV364() {
    const map = read(RENAME_KEY, {});
    try {
      if (typeof CURSOR_OPTIONS !== 'undefined' && Array.isArray(CURSOR_OPTIONS)) {
        CURSOR_OPTIONS.forEach(opt => {
          const name = map?.cursor?.[opt?.id];
          if (name) opt.name = name;
        });
      }
    } catch {}
    try {
      if (typeof COMPANIONS !== 'undefined' && Array.isArray(COMPANIONS)) {
        COMPANIONS.forEach(opt => {
          const name = map?.companion?.[opt?.id];
          if (name) opt.name = name;
        });
      }
    } catch {}
  }

  function ensureModalV364() {
    let modal = document.getElementById('accessory-rename-modal-v364');
    if (modal) return modal;
    modal = document.createElement('div');
    modal.id = 'accessory-rename-modal-v364';
    modal.className = 'modal-overlay hidden';
    modal.innerHTML = `
      <div class="modal-box accessory-rename-box-v364" role="dialog" aria-modal="true" aria-labelledby="accessory-rename-title-v364">
        <div class="modal-header">
          <h2 id="accessory-rename-title-v364">Rename</h2>
          <button type="button" class="small-icon-btn accessory-rename-close-v364" aria-label="Close"><i class="ph ph-x"></i></button>
        </div>
        <div class="modal-section">
          <span class="field-label">Name</span>
          <input class="accessory-rename-input-v364" type="text" autocomplete="off" maxlength="80">
        </div>
        <div class="accessory-rename-actions-v364">
          <button type="button" class="icon-btn accessory-rename-cancel-v364">Cancel</button>
          <button type="button" class="icon-btn accessory-rename-save-v364"><i class="ph ph-check"></i> Save</button>
        </div>
      </div>`;
    document.body.appendChild(modal);
    const close = () => modal.classList.add('hidden');
    modal.querySelector('.accessory-rename-close-v364')?.addEventListener('click', close);
    modal.querySelector('.accessory-rename-cancel-v364')?.addEventListener('click', close);
    modal.addEventListener('pointerdown', e => { if (e.target === modal) close(); });
    return modal;
  }

  function optionForV364(kind, id) {
    applySavedNamesV364();
    try {
      const list = kind === 'cursor'
        ? (typeof CURSOR_OPTIONS !== 'undefined' ? CURSOR_OPTIONS : [])
        : (typeof COMPANIONS !== 'undefined' ? COMPANIONS : []);
      return list.find(x => String(x?.id || '') === String(id)) || null;
    } catch { return null; }
  }

  function persistCustomNameV364(kind, id, name) {
    const key = kind === 'cursor' ? CUR_KEY : COMP_KEY;
    const list = read(key, []);
    const row = Array.isArray(list) ? list.find(x => String(x?.id || '') === String(id)) : null;
    if (row) { row.name = name; write(key, list); }
  }

  function rerenderV364(kind) {
    applySavedNamesV364();
    try {
      if (kind === 'cursor' && typeof renderCursorPicker === 'function') renderCursorPicker();
      if (kind === 'companion' && typeof renderCompanionPicker === 'function') renderCompanionPicker();
    } catch {}
  }

  function openRenameV364(kind, id, fallbackName) {
    const modal = ensureModalV364();
    const input = modal.querySelector('.accessory-rename-input-v364');
    const title = modal.querySelector('#accessory-rename-title-v364');
    const save = modal.querySelector('.accessory-rename-save-v364');
    const label = kind === 'cursor' ? 'Mouse Pointer' : 'Companion';
    title.textContent = `Rename ${label}`;
    input.value = optionForV364(kind, id)?.name || fallbackName || '';
    modal.classList.remove('hidden');
    requestAnimationFrame(() => { input.focus(); input.select(); });

    const commit = () => {
      const name = input.value.trim();
      if (!name) { input.focus(); return; }
      const map = read(RENAME_KEY, {});
      map[kind] ||= {};
      map[kind][id] = name;
      write(RENAME_KEY, map);
      persistCustomNameV364(kind, id, name);
      const opt = optionForV364(kind, id);
      if (opt) opt.name = name;
      modal.classList.add('hidden');
      rerenderV364(kind);
      try { toast?.(`Renamed to ${name}.`); } catch {}
    };
    save.onclick = commit;
    input.onkeydown = e => {
      if (e.key === 'Enter') { e.preventDefault(); commit(); }
      else if (e.key === 'Escape') modal.classList.add('hidden');
    };
  }

  async function deleteV364(kind, id, name) {
    let ok = true;
    try {
      if (typeof showAppConfirm === 'function') {
        ok = await showAppConfirm({
          title: `Delete ${kind === 'cursor' ? 'Mouse Pointer' : 'Companion'}`,
          message: `Remove “${name}” from the picker?`,
          confirmLabel: 'Delete'
        });
      }
    } catch {}
    if (!ok) return;

    const opt = optionForV364(kind, id);
    const custom = !!opt?.customUserV163 || String(id).startsWith('user-');
    if (kind === 'cursor') {
      const cursorId = String(id || '');
      const aiGenerated = cursorId.startsWith('theme-cursor-v161-') || !!opt?.customCursorSpecV161;
      // Remove the visible card immediately; then remove every backing source so
      // a rerender cannot resurrect the cursor from a stale registry.
      try { document.querySelectorAll(`[data-cursor-id="${CSS.escape(cursorId)}"],[data-accessory-id="${CSS.escape(cursorId)}"]`).forEach(el => el.remove()); } catch {}
      // Global tombstone is authoritative even for user-created/AI cursors.
      // Removing only the backing row lets another page rebuild the same ID.
      { const hidden = new Set(read(HIDE_CUR, [])); hidden.add(cursorId); write(HIDE_CUR, [...hidden]); }
      if (custom) {
        write(CUR_KEY, read(CUR_KEY, []).filter(x => String(x?.id || '') !== cursorId));
      }
      if (aiGenerated) {
        const AI_CURSOR_KEY = 'loggy-ai-theme-cursors-v161';
        write(AI_CURSOR_KEY, read(AI_CURSOR_KEY, []).filter(x => String(x?.id || '') !== cursorId));
      }
      if (!custom || aiGenerated) {
        const hidden = new Set(read(HIDE_CUR, [])); hidden.add(cursorId); write(HIDE_CUR, [...hidden]);
      }
      try {
        const idx = CURSOR_OPTIONS.findIndex(x => String(x?.id || '') === cursorId);
        if (idx >= 0) CURSOR_OPTIONS.splice(idx, 1);
      } catch {}
      try {
        if (db?.settings?.cursorStyle === cursorId) db.settings.cursorStyle = 'default';
        if (db?.settings?.cursorTrails) delete db.settings.cursorTrails[cursorId];
        if (typeof saveDb === 'function') saveDb();
        if (typeof applyCursorChoice === 'function') applyCursorChoice();
      } catch {}
    } else {
      const companionId = String(id || '');
      { const hidden = new Set(read(HIDE_COMP, [])); hidden.add(companionId); write(HIDE_COMP, [...hidden]); }
      if (custom) {
        write(COMP_KEY, read(COMP_KEY, []).filter(x => String(x?.id || '') !== companionId));
        try {
          const idx = COMPANIONS.findIndex(x => String(x?.id || '') === String(id));
          if (idx >= 0) COMPANIONS.splice(idx, 1);
        } catch {}
      } else {
        const hidden = new Set(read(HIDE_COMP, [])); hidden.add(id); write(HIDE_COMP, [...hidden]);
      }
      try {
        if (db?.settings?.companion === id) db.settings.companion = 'none';
        if (typeof saveDb === 'function') saveDb();
        if (typeof renderCompanion === 'function') renderCompanion();
      } catch {}
    }
    const map = read(RENAME_KEY, {}); if (map?.[kind]) delete map[kind][id]; write(RENAME_KEY, map);
    try { window.__loggyPurgeDeletedAccessoryV382?.(kind, String(id || '')); } catch {}
    rerenderV364(kind);
    queueMicrotask(() => rerenderV364(kind));
    requestAnimationFrame(() => rerenderV364(kind));
  }

  function closeMenuV364() { document.getElementById('accessory-context-v364')?.remove(); }
  function openMenuV364(x, y, kind, id, name) {
    closeMenuV364();
    const menu = document.createElement('div');
    menu.id = 'accessory-context-v364';
    menu.className = 'accessory-context-v364';
    const protectedItem = (kind === 'cursor' && id === 'default') || (kind === 'companion' && id === 'none');
    menu.innerHTML = `
      <button type="button" data-action="rename"><i class="ph ph-pencil-simple"></i><span>Rename</span></button>
      ${protectedItem ? '' : '<button type="button" data-action="delete" class="danger"><i class="ph ph-trash"></i><span>Delete</span></button>'}`;
    document.body.appendChild(menu);
    const rect = menu.getBoundingClientRect();
    menu.style.left = `${Math.max(8, Math.min(x, innerWidth - rect.width - 8))}px`;
    menu.style.top = `${Math.max(8, Math.min(y, innerHeight - rect.height - 8))}px`;
    menu.querySelector('[data-action="rename"]')?.addEventListener('click', () => { closeMenuV364(); openRenameV364(kind, id, name); });
    menu.querySelector('[data-action="delete"]')?.addEventListener('click', () => { closeMenuV364(); deleteV364(kind, id, name); });
    setTimeout(() => {
      const outsideV365 = event => {
        const active = document.getElementById('accessory-context-v364');
        if (active?.contains(event.target)) return;
        closeMenuV364();
        document.removeEventListener('pointerdown', outsideV365, true);
      };
      document.addEventListener('pointerdown', outsideV365, true);
    }, 0);
  }

  document.addEventListener('contextmenu', e => {
    const cursorCard = e.target.closest?.('#cursor-picker .cursor-picker-option');
    const companionCard = e.target.closest?.('#companion-picker .icon-option');
    if (!cursorCard && !companionCard) return;
    const kind = cursorCard ? 'cursor' : 'companion';
    const card = cursorCard || companionCard;
    let id = kind === 'cursor' ? card.dataset.cursorId : card.dataset.companionId;
    if (!id && kind === 'companion') {
      const displayed = card.querySelector('small')?.textContent?.trim() || '';
      try { id = COMPANIONS.find(x => x.name === displayed)?.id || ''; } catch {}
      if (!id) {
        try {
          const cards = Array.from(document.querySelectorAll('#companion-picker .icon-option'));
          const pos = cards.indexOf(card);
          if (pos > 0) id = String(COMPANIONS[pos - 1]?.id || '');
        } catch {}
      }
    }
    if (!id) return;
    const opt = optionForV364(kind, id);
    const name = opt?.name || card.querySelector('small')?.textContent?.trim() || id;
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    openMenuV364(e.clientX, e.clientY, kind, id, name);
  }, true);

  const style = document.createElement('style');
  style.id = 'accessory-rename-style-v364';
  style.textContent = `
    #accessory-rename-modal-v364 .accessory-rename-box-v364{max-width:420px!important}
    #accessory-rename-modal-v364 .accessory-rename-input-v364{width:100%;box-sizing:border-box;min-height:42px;padding:9px 11px;border:var(--thin-border,1px solid rgba(0,0,0,.18));border-radius:9px;background:var(--white,#fff);color:var(--black,#161616);font:inherit;outline:none}
    #accessory-rename-modal-v364 .accessory-rename-input-v364:focus{box-shadow:0 0 0 2px color-mix(in srgb,var(--hover-color,#8b6fd8) 28%,transparent)}
    #accessory-rename-modal-v364 .accessory-rename-actions-v364{display:flex;justify-content:flex-end;gap:8px;margin-top:16px}
    .accessory-context-v364{position:fixed;z-index:2147483600;min-width:168px;padding:6px;border:1px solid rgba(0,0,0,.14);border-radius:10px;background:var(--white,#fff);color:var(--black,#161616);box-shadow:0 12px 32px rgba(0,0,0,.18)}
    .accessory-context-v364 button{width:100%;display:flex;align-items:center;gap:8px;border:0;background:transparent;color:inherit;border-radius:7px;padding:8px 10px;text-align:left;font:inherit;cursor:pointer}
    .accessory-context-v364 button:hover{background:var(--hover-color,#eee)}
    .accessory-context-v364 button.danger{color:#b3261e}
  `;
  document.head.appendChild(style);

  applySavedNamesV364();
})();

/* ============================================================
   V365 — SETTINGS PLUS PARITY / READABILITY / RENAME RELIABILITY
   ============================================================ */
(() => {
  'use strict';
  if (window.__loggySettingsPolishV365) return;
  window.__loggySettingsPolishV365 = true;

  const q=(s,r=document)=>r?.querySelector?.(s)||null;
  const qa=(s,r=document)=>Array.from(r?.querySelectorAll?.(s)||[]);
  const validHex=v=>/^#[0-9a-f]{6}$/i.test(String(v||'').trim());
  const hex=(v,f)=>validHex(v)?String(v).trim():f;

  const style=document.createElement('style');
  style.id='loggy-settings-polish-v365';
  style.textContent=`
    /* V366 is the single Log Settings + button style owner. */

    /* Theme cards never grow because of a long title. */
    #theme-picker .theme-picker-card,
    .theme-picker-grid .theme-picker-card{
      height:88px!important;min-height:88px!important;max-height:88px!important;
    }
    #theme-picker .theme-picker-name,
    .theme-picker-grid .theme-picker-name{
      display:block!important;max-width:100%!important;white-space:nowrap!important;
      overflow:hidden!important;text-overflow:ellipsis!important;
    }

    /* Make the custom rename dialog undeniably visible once opened. */
    #accessory-rename-modal-v364:not(.hidden){
      display:flex!important;align-items:center!important;justify-content:center!important;
      visibility:visible!important;opacity:1!important;pointer-events:auto!important;
    }

    /* If a theme gives Settings a dark surface, UI copy must remain readable. */
    #daily-settings-modal.settings-dark-v365 .modal-header h2,
    #daily-settings-modal.settings-dark-v365 .field-label,
    #daily-settings-modal.settings-dark-v365 .progress-hint,
    #daily-settings-modal.settings-dark-v365 .modal-section > strong,
    #daily-settings-modal.settings-dark-v365 .modal-section > label > span,
    #daily-settings-modal.settings-dark-v365 .modal-section > p{
      color:var(--settings-auto-text-v365,#f7f7f7)!important;
    }
  `;
  document.head.appendChild(style);

  function parseColor(value){
    const s=String(value||'').trim();
    let m=s.match(/^#([0-9a-f]{6})$/i);
    if(m){const n=parseInt(m[1],16);return[(n>>16)&255,(n>>8)&255,n&255];}
    m=s.match(/^rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)/i);
    return m?[Number(m[1]),Number(m[2]),Number(m[3])]:null;
  }
  function luminance(rgb){
    if(!rgb)return 1;
    const c=rgb.map(v=>{v=Math.max(0,Math.min(255,v))/255;return v<=.03928?v/12.92:Math.pow((v+.055)/1.055,2.4)});
    return .2126*c[0]+.7152*c[1]+.0722*c[2];
  }
  function syncLogSettingsContrastV365(){
    const modal=q('#daily-settings-modal'),box=q(':scope > .modal-box',modal);
    if(!modal||!box)return;
    const bg=getComputedStyle(box).backgroundColor;
    const dark=luminance(parseColor(bg))<.32;
    modal.classList.toggle('settings-dark-v365',dark);
    if(dark) modal.style.setProperty('--settings-auto-text-v365','#f7f7f7');
    else modal.style.removeProperty('--settings-auto-text-v365');
  }

  function applyPreviewPlusVarsV365(theme){
    if(!theme||typeof theme!=='object')return;
    const root=document.documentElement.style;
    const surface=hex(theme.surface,'#ffffff');
    const text=hex(theme.text,'#111111');
    const border=hex(theme.border,text);
    const hover=hex(theme.hoverColor,hex(theme.accent,'#eeeeee'));
    root.setProperty('--custom-theme-theme-settings-plus-icon-v322',hex(theme.themeSettingsPlusIconColorV322,text));
    root.setProperty('--custom-theme-theme-settings-plus-background-v322',hex(theme.themeSettingsPlusBackgroundColorV322,surface));
    root.setProperty('--custom-theme-theme-settings-plus-border-v322',hex(theme.themeSettingsPlusBorderColorV322,border));
    root.setProperty('--custom-theme-theme-settings-plus-hover-icon-v322',hex(theme.themeSettingsPlusHoverIconColorV322,text));
    root.setProperty('--custom-theme-theme-settings-plus-hover-background-v322',hex(theme.themeSettingsPlusHoverBackgroundColorV322,hover));
    root.setProperty('--custom-theme-theme-settings-plus-hover-border-v322',hex(theme.themeSettingsPlusHoverBorderColorV322,border));
    root.setProperty('--custom-theme-heading-bg-color-v429',hex(theme.headingBackgroundColorV452||theme.contentBackdropColor,surface));
    root.setProperty('--custom-theme-heading-bg-opacity-v429',theme.headingBackgroundEnabledV429===true?`${Math.max(0,Math.min(100,Number(theme.headingBackgroundOpacityV452??theme.contentBackdropOpacity)||0))}%`:'0%');
    root.setProperty('--custom-theme-heading-bg-padding-v429',theme.headingBackgroundEnabledV429===true?`${Math.max(0,Math.min(40,Number(theme.headingBackgroundPaddingV429)||0))}px`:'0px');
    root.setProperty('--custom-theme-heading-bg-radius-v452',theme.headingBackgroundEnabledV429===true?`${Math.max(0,Math.min(40,Number(theme.headingBackgroundRadiusV452??theme.radius)||0))}px`:'0px');
    const quizOnV456=theme.quizBackdropEnabledV456===true;
    root.setProperty('--custom-theme-quiz-backdrop-color-v456',hex(quizOnV456?theme.quizBackdropColorV456:theme.contentBackdropColor,surface));
    root.setProperty('--custom-theme-quiz-backdrop-opacity-v456',`${Math.max(0,Math.min(100,Number(quizOnV456?theme.quizBackdropOpacityV456:(theme.contentBackdropEnabled?theme.contentBackdropOpacity:0))||0))}%`);
    root.setProperty('--custom-theme-quiz-backdrop-radius-v456',`${Math.max(0,Math.min(40,Number(quizOnV456?theme.quizBackdropRadiusV456:theme.radius)||0))}px`);
    root.setProperty('--custom-theme-quiz-backdrop-padding-v459',`${Math.max(0,Math.min(40,Number(quizOnV456?theme.quizBackdropPaddingV459:0)||0))}px`);
  }

  // Theme Builder iframe: update Settings + colors straight from the live draft,
  // even if an older preview renderer does not refresh those CSS variables.
  if(new URLSearchParams(location.search).get('theme-builder-preview-v307')==='1'){
    window.addEventListener('message',event=>{
      if(event.origin!==location.origin||event.data?.type!=='loggy-theme-preview-apply-v307')return;
      applyPreviewPlusVarsV365(event.data?.draft||{});
      requestAnimationFrame(()=>applyPreviewPlusVarsV365(event.data?.draft||{}));
    });
  }

  // Re-check contrast only when the Settings modal actually opens/changes.
  const modal=q('#daily-settings-modal');
  if(modal){
    new MutationObserver(()=>{if(!modal.classList.contains('hidden'))requestAnimationFrame(syncLogSettingsContrastV365)}).observe(modal,{attributes:true,attributeFilter:['class']});
  }
  document.addEventListener('click',e=>{
    if(e.target.closest?.('#daily-settings-modal,#open-daily-settings,#open-settings-btn')) requestAnimationFrame(syncLogSettingsContrastV365);
  },true);
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',syncLogSettingsContrastV365,{once:true});else syncLogSettingsContrastV365();
})();


/* ============================================================================
   V366 — SINGLE DECORATION SETTLE GATE + LOG SETTINGS PARITY
   - No polling and no delayed multi-pass decoration repairs.
   - The outermost mount wrapper hides artwork only while the current theme is
     mounted, placed, and given its authoritative V350/V362 motion state.
   - Log Settings always opens on the applied theme.
   - All Settings + buttons mirror the first create-theme + geometry/colors.
   ============================================================================ */
(() => {
  'use strict';
  if (window.__loggyV366FinalOwner) return;
  window.__loggyV366FinalOwner = true;

  const q=(s,r=document)=>r?.querySelector?.(s)||null;
  const qa=(s,r=document)=>Array.from(r?.querySelectorAll?.(s)||[]);
  const gate=()=>window.__loggyDecorationGateV366;

  function appliedThemeObjectV366(){
    try { return window.__loggyResolveAppliedThemeV372?.()||{}; } catch { return {}; }
  }

  function finalizeDecorationsV366(theme){
    const resolved=theme&&typeof theme==='object'?theme:appliedThemeObjectV366();
    // Placement/default-motion runtimes may rewrite animation classes after V350.
    // Reassert Across Screen last so EVERY decoration inheriting the global
    // default is enrolled before the atomic gate reveals the scene.
    try { window.__loggyApplyDefaultMotionsV363?.(resolved); } catch {}
    try { window.__loggyConfigureAcrossV404?.(resolved); } catch {}
    requestAnimationFrame(()=>{
      try { window.__loggyApplyDefaultMotionsV363?.(resolved); } catch {}
      try { window.__loggyConfigureAcrossV404?.(resolved); } catch {}
      gate()?.end?.();
    });
  }

  // Outermost owner: every real artwork mount becomes an atomic paint. V350 and
  // V362 are already inside this wrapper, so when the original returns the final
  // coordinates/directions are ready; one rAF lets WAAPI commit before reveal.
  try {
    const old=window.mountCustomThemeBackgroundSvgsV2;
    if(typeof old==='function'&&!old.__v366AtomicDecorationOwner){
      const fn=function(theme={}){
        gate()?.begin?.();
        let result;
        try { result=old.apply(this,arguments); }
        catch(err){ gate()?.end?.(); throw err; }
        finalizeDecorationsV366(theme||{});
        return result;
      };
      fn.__v366AtomicDecorationOwner=true;
      window.mountCustomThemeBackgroundSvgsV2=fn;
      try{mountCustomThemeBackgroundSvgsV2=fn}catch{}
    }
  } catch {}

  try {
    const old=window.applyCustomBuiltTheme;
    if(typeof old==='function'&&!old.__v366AtomicThemeOwner){
      const fn=function(theme){
        gate()?.begin?.();
        let result;
        try { result=old.apply(this,arguments); }
        catch(err){ gate()?.end?.(); throw err; }
        finalizeDecorationsV366(theme||appliedThemeObjectV366());
        return result;
      };
      fn.__v366AtomicThemeOwner=true;
      window.applyCustomBuiltTheme=fn;
      try{applyCustomBuiltTheme=fn}catch{}
    }
  } catch {}

  // V368 owns applied-theme selection/centering on every Settings open.

  function syncSettingsVisualParityV366(){
    const modal=q('#daily-settings-modal');if(!modal)return;
    const first=q('.theme-search-create-v161',modal);
    if(first){
      const cs=getComputedStyle(first);
      modal.style.setProperty('--settings-plus-radius-v366',cs.borderRadius||'12px');
      modal.style.setProperty('--settings-plus-border-width-v366',cs.borderTopWidth||'1px');
      modal.style.setProperty('--settings-plus-border-style-v366',cs.borderTopStyle||'solid');
      modal.style.setProperty('--settings-plus-border-color-v366',cs.borderTopColor||'currentColor');
      modal.style.setProperty('--settings-plus-background-v366',cs.backgroundColor||'transparent');
      modal.style.setProperty('--settings-plus-color-v366',cs.color||'currentColor');
    }
    const hint=qa('.modal-section .progress-hint',modal).find(el=>/search or click a theme to apply/i.test(el.textContent||''))||q('.progress-hint',modal);
    if(hint)modal.style.setProperty('--settings-subtitle-color-v366',getComputedStyle(hint).color);
  }
  const settings = q('#daily-settings-modal');
  if(settings){
    new MutationObserver(()=>{if(!settings.classList.contains('hidden'))requestAnimationFrame(syncSettingsVisualParityV366)}).observe(settings,{attributes:true,attributeFilter:['class']});
  }
  document.addEventListener('click',e=>{
    if(e.target?.closest?.('#open-daily-settings-btn,#open-global-daily-settings-nav-btn'))requestAnimationFrame(syncSettingsVisualParityV366);
  },true);

  const style=document.createElement('style');style.id='loggy-v366-settings-style';style.textContent=`
    #daily-settings-modal button:has(i.ph-plus){
      border-width:var(--settings-plus-border-width-v366,1px)!important;
      border-style:var(--settings-plus-border-style-v366,solid)!important;
      border-color:var(--settings-plus-border-color-v366,var(--custom-theme-theme-settings-plus-border-v322,var(--black,#111)))!important;
      border-radius:var(--settings-plus-radius-v366,12px)!important;
      background:var(--settings-plus-background-v366,var(--custom-theme-theme-settings-plus-background-v322,var(--white,#fff)))!important;
      color:var(--settings-plus-color-v366,var(--custom-theme-theme-settings-plus-icon-v322,var(--black,#111)))!important;
      box-shadow:none!important;
    }
    #daily-settings-modal button:has(i.ph-plus):hover,
    #daily-settings-modal button:has(i.ph-plus):focus-visible{
      background:var(--custom-theme-theme-settings-plus-hover-background-v322,var(--white,#fff))!important;
      color:var(--custom-theme-theme-settings-plus-hover-icon-v322,var(--black,#111))!important;
      border-color:var(--custom-theme-theme-settings-plus-hover-border-v322,var(--black,#111))!important;
    }
    #daily-settings-modal #theme-search-input::placeholder{
      color:var(--settings-subtitle-color-v366,var(--muted-text,#737373))!important;
      opacity:1!important;
    }
    #accessory-rename-modal-v364 .accessory-rename-input-v364,
    #accessory-rename-modal-v364 .accessory-rename-cancel-v364,
    #accessory-rename-modal-v364 .accessory-rename-save-v364{
      border-radius:9px!important;
    }
    #accessory-rename-modal-v364 .accessory-rename-cancel-v364,
    #accessory-rename-modal-v364 .accessory-rename-save-v364{
      min-height:42px!important;
      padding:9px 14px!important;
      border:var(--thin-border,1px solid rgba(0,0,0,.18))!important;
      background:var(--white,#fff)!important;
      color:var(--black,#161616)!important;
      box-shadow:none!important;
      font:inherit!important;
    }
    #accessory-rename-modal-v364 .accessory-rename-cancel-v364:hover,
    #accessory-rename-modal-v364 .accessory-rename-save-v364:hover{
      background:var(--hover-color,#eee)!important;
      color:var(--black,#161616)!important;
    }
  `;document.head.appendChild(style);

  // Initial page load: V350/V362 have already executed before this EOF owner.
  requestAnimationFrame(()=>{
    syncSettingsVisualParityV366();
    finalizeDecorationsV366(appliedThemeObjectV366());
  });
})();


// ============================================================================
// V370 — STRICT OVERLAP OWNER MIGRATION
// The old V367 shrink-to-fit runtime was removed. Strict no-overlap is now
// owned by the actual placement/parity runtime (Extras 4 / Dashboard) plus the
// single Across Screen runtime below. It keeps requested decoration size and
// suppresses optional assets when the scene cannot fit them without overlap.
// ============================================================================

/* ============================================================================
   V368 — LOG SETTINGS: APPLIED THEME IS AUTHORITATIVE ON EVERY OPEN
   - One owner only. Replaces the removed V47/V366 open-time selection passes.
   - Reads db.settings.theme fresh every time Settings is opened.
   - Rebuilds/syncs the picker against that ID, clears stale selection/search,
     selects exactly one card, and centers it in the theme gallery.
   - No intervals/polling; runs only when Settings opens.
   ============================================================================ */
(() => {
  'use strict';
  if (window.__loggyV368AppliedThemeSettingsOwner) return;
  window.__loggyV368AppliedThemeSettingsOwner = true;

  const q=(s,r=document)=>r?.querySelector?.(s)||null;
  const qa=(s,r=document)=>Array.from(r?.querySelectorAll?.(s)||[]);

  function appliedThemeIdV368(){
    try {
      const id=String((typeof db!=='undefined'?db:window.db)?.settings?.theme||'').trim();
      return id||'default';
    } catch { return 'default'; }
  }

  function clearSearchV368(modal){
    const input=q('#theme-search-input',modal);
    if(!input)return;
    input.value='';
    input.dataset.previousThemeSearchValue='';
    try{filterThemePicker?.('')}catch{}
    const clear=q('#theme-search-clear',modal);
    clear?.classList?.add('hidden');
  }

  function syncThemeSourcesV368(id){
    try{syncSharedThemesIntoLogV40?.()}catch{}
    try{syncThemeCopyOptionsV30?.()}catch{}
    const select=(typeof dailyThemeSelect!=='undefined'?dailyThemeSelect:q('#daily-theme-select'));
    if(select){
      // Source sync may rebuild options. Always assign AFTER syncing.
      select.value=id;
      // If a valid custom/shared theme is still missing, run the source sync a
      // second time once; never fall back the visible selection to Default.
      if(select.value!==id){
        try{syncSharedThemesIntoLogV40?.()}catch{}
        try{syncThemeCopyOptionsV30?.()}catch{}
        select.value=id;
      }
    }
    return select;
  }

  function renderAndSnapV368(id){
    const modal=q('#daily-settings-modal');
    if(!modal||modal.classList.contains('hidden'))return false;
    const select=syncThemeSourcesV368(id);
    clearSearchV368(modal);

    try{themePickerSelected=id}catch{}
    // renderThemePicker historically derives its selection from the hidden
    // select, so make the applied ID authoritative immediately before render.
    if(select)select.value=id;
    try{renderThemePicker?.()}catch{}
    if(select)select.value=id;
    try{themePickerSelected=id}catch{}
    try{updateThemePickerSelection?.()}catch{}
    try{filterThemePicker?.('')}catch{}

    const picker=q('#theme-picker',modal);
    if(!picker)return false;
    let target=null;
    qa('.theme-picker-card[data-theme]',picker).forEach(card=>{
      const yes=String(card.dataset.theme||'')===id;
      card.classList.toggle('selected',yes);
      card.classList.toggle('theme-key-selected-v245',yes);
      if(yes){card.setAttribute('aria-current','true');target=card}
      else card.removeAttribute('aria-current');
    });
    if(!target)return false;

    // Scroll only the gallery. Do not scroll the Settings modal itself.
    const top=Math.max(0,target.offsetTop-Math.max(0,(picker.clientHeight-target.offsetHeight)/2));
    picker.scrollTop=top;
    return true;
  }

  function settleOpenV368(id){
    // One immediate pass after the modal has opened and one next-paint pass to
    // account for synchronous picker decorators. No delayed timers or polling.
    renderAndSnapV368(id);
    requestAnimationFrame(()=>renderAndSnapV368(id));
  }

  try{
    const old=window.openGlobalThemeSettings || (typeof openGlobalThemeSettings==='function'?openGlobalThemeSettings:null);
    if(typeof old==='function'&&!old.__v368AppliedThemeOwner){
      const fn=function(){
        // Capture from persisted app state, never from the picker's previous
        // UI selection, so closing/reopening Settings cannot select Default.
        const id=appliedThemeIdV368();
        syncThemeSourcesV368(id);
        try{themePickerSelected=id}catch{}
        const result=old.apply(this,arguments);
        settleOpenV368(id);
        return result;
      };
      fn.__v368AppliedThemeOwner=true;
      window.openGlobalThemeSettings=fn;
      try{openGlobalThemeSettings=fn}catch{}
    }
  }catch{}
})();

// ============================================================================
// V372 — DEFAULT ANIMATION SAVE/APPLY FINALIZER
// `svgDefaultAnimation` is the source of truth. Per-decoration `animation` is
// only a compatibility mirror; explicit `animationOverride` is the sole override.
// This outermost wrapper keeps old renderers, Log pages and iframe previews from
// reintroducing a stale Float class after the correct animation has already begun.
// ============================================================================
(() => {
  'use strict';
  if (window.__loggyDefaultAnimationFinalV372) return;
  window.__loggyDefaultAnimationFinalV372 = true;

  function canonicalThemeV372(theme) {
    const source = theme && typeof theme === 'object' && Object.keys(theme).length
      ? theme
      : (window.__loggyResolveAppliedThemeV372?.() || {});
    if (!source || typeof source !== 'object') return {};
    const defaultAnimation = String(source.svgDefaultAnimation || 'float').trim() || 'float';
    const assets = Array.isArray(source.backgroundSvgs) ? source.backgroundSvgs : [];
    const aiTheme = source.themeBuilderAiUsedV364===true || String(source.themeBuilderAutoToolV364||'')==='ai' || !!source.themeBuilderAiVariantsV376;
    return {
      ...source,
      svgDefaultAnimation: defaultAnimation,
      backgroundSvgs: assets.map(asset => {
        if (!asset || typeof asset !== 'object') return asset;
        const rawOverride = String(asset.animationOverride || '').trim();
        const override = aiTheme && asset.animationOverrideUserSetV404 !== true ? '' : rawOverride;
        return { ...asset, animationOverride: override, animation: override || defaultAnimation };
      })
    };
  }

  window.__loggyCanonicalThemeV372 = canonicalThemeV372;

  try {
    const old = window.mountCustomThemeBackgroundSvgsV2;
    if (typeof old === 'function' && !old.__defaultAnimationFinalV372) {
      const fn = function(theme = {}) {
        const canonical = canonicalThemeV372(theme);
        try { window.__loggySetPreviewThemeV372?.(new URLSearchParams(location.search).get('theme-builder-preview-v307') === '1' ? canonical : null); } catch {}
        return old.call(this, canonical);
      };
      fn.__defaultAnimationFinalV372 = true;
      window.mountCustomThemeBackgroundSvgsV2 = fn;
      try { mountCustomThemeBackgroundSvgsV2 = fn; } catch {}
    }
  } catch {}

  try {
    const old = window.applyCustomBuiltTheme;
    if (typeof old === 'function' && !old.__defaultAnimationFinalV372) {
      const fn = function(theme) {
        const canonical = canonicalThemeV372(theme);
        if (new URLSearchParams(location.search).get('theme-builder-preview-v307') === '1') {
          try { window.__loggySetPreviewThemeV372?.(canonical); } catch { window.__loggyActivePreviewThemeV372 = canonical; }
        }
        return old.call(this, canonical);
      };
      fn.__defaultAnimationFinalV372 = true;
      window.applyCustomBuiltTheme = fn;
      try { applyCustomBuiltTheme = fn; } catch {}
    }
  } catch {}

  // Extras load after the base page. Re-bind the existing stage once using the
  // actually selected theme, rather than the generic custom-theme draft.
  const repairCurrentV372 = () => {
    const theme = canonicalThemeV372(window.__loggyResolveAppliedThemeV372?.());
    if (!theme || !Object.keys(theme).length) return;
    // V373: never remount the stage just because the lazy extras bundle finished
    // loading. Remounting was itself a late write and could restart an older
    // renderer. Rebinding motion in place is sufficient and preserves nodes.
    try { window.__loggyApplyDefaultMotionsV363?.(theme); } catch {}
    try { window.__loggyConfigureAcrossV404?.(theme); } catch {}
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => requestAnimationFrame(repairCurrentV372), { once:true });
  else requestAnimationFrame(repairCurrentV372);
})();



// Intro-audio single ownership is handled by the canonical V420 player in template-extras-2.js.

/* V380 — THEME-CONTROLLED LOG SETTINGS MODAL COLORS */
(()=>{
 'use strict';
 if(window.__loggySettingsThemeColorsV380)return;window.__loggySettingsThemeColorsV380=true;
 const q=(s,r=document)=>r?.querySelector?.(s)||null;
 const valid=v=>/^#[0-9a-f]{6}$/i.test(String(v||'').trim());
 const hex=(v,f)=>valid(v)?String(v).trim():f;
 const rgb=v=>{const m=String(v||'').match(/^#([0-9a-f]{6})$/i);if(!m)return null;const n=parseInt(m[1],16);return[(n>>16)&255,(n>>8)&255,n&255]},lum=v=>{const a=rgb(v);if(!a)return 1;const c=a.map(x=>{x/=255;return x<=.04045?x/12.92:((x+.055)/1.055)**2.4});return .2126*c[0]+.7152*c[1]+.0722*c[2]};
 const darkSurface=(v,candidates=[])=>{const pool=[v,...candidates].filter(valid);for(const c of pool)if(lum(c)<=.22)return c;const base=rgb(pool[0]||'#1b1b1b')||[27,27,27];let f=.72,out='#1b1b1b';for(let i=0;i<8;i++){const a=base.map(x=>Math.max(0,Math.min(255,Math.round(x*f))));out='#'+a.map(x=>x.toString(16).padStart(2,'0')).join('');if(lum(out)<=.22)return out;f*=.72}return out};
 const readable=(bg,v)=>{v=hex(v,lum(bg)<.35?'#f7f7f7':'#111111');const r=(Math.max(lum(bg),lum(v))+.05)/(Math.min(lum(bg),lum(v))+.05);return r>=4.5?v:(lum(bg)<.35?'#f7f7f7':'#111111')};
 function apply(theme={}){
   const root=document.documentElement.style;
   const surface=hex(theme.surface,'#ffffff'),page=hex(theme.background,surface),mode=String(theme.themeBuilderAiSelectedVariantV376||theme.themeBuilderAiModeV364||'').toLowerCase(),darkMode=mode==='dark'||lum(page)<=.22;
   const settingsBg=darkMode?darkSurface(hex(theme.settingsModalBackgroundColorV380,surface),[surface,page]):hex(theme.settingsModalBackgroundColorV380,surface);
   const text=readable(settingsBg,hex(theme.settingsModalTextColorV380,hex(theme.text,'#111111'))),border=hex(theme.border,text),hover=hex(theme.hoverColor,hex(theme.accent,'#eeeeee'));
   const set=(k,v)=>root.setProperty(k,v);
   set('--settings-modal-bg-v380',settingsBg);
   set('--settings-modal-text-v380',text);
   set('--settings-modal-border-v380',hex(theme.settingsModalBorderColorV380,border));
   set('--settings-overlay-v381',hex(theme.settingsModalOverlayColorV381,theme.background||'#000000'));
   set('--settings-section-border-v381',hex(theme.settingsModalSectionBorderColorV381,border));
   set('--settings-muted-text-v381',hex(theme.settingsModalMutedTextColorV381,theme.muted||text));
   set('--settings-icon-v381',hex(theme.settingsModalIconColorV381,text));
   set('--settings-input-bg-v380',hex(theme.settingsModalInputBackgroundColorV380,surface));
   set('--settings-input-text-v380',hex(theme.settingsModalInputTextColorV380,text));
   set('--settings-input-border-v380',hex(theme.settingsModalInputBorderColorV380,border));
   set('--settings-card-bg-v380',hex(theme.settingsModalCardBackgroundColorV380,surface));
   set('--settings-card-text-v380',hex(theme.settingsModalCardTextColorV380,text));
   set('--settings-card-border-v380',hex(theme.settingsModalCardBorderColorV380,border));
   set('--settings-hover-bg-v380',hex(theme.settingsModalHoverBackgroundColorV380,hover));
   set('--settings-hover-text-v380',hex(theme.settingsModalHoverTextColorV380,text));
   set('--settings-selected-bg-v380',hex(theme.settingsModalSelectedBackgroundColorV380,text));
   set('--settings-selected-text-v380',hex(theme.settingsModalSelectedTextColorV380,surface));
   set('--settings-selected-border-v380',hex(theme.settingsModalSelectedBorderColorV380,border));
   set('--settings-button-bg-v380',hex(theme.settingsModalButtonBackgroundColorV380,surface));
   set('--settings-button-text-v380',hex(theme.settingsModalButtonTextColorV380,text));
   set('--settings-button-border-v380',hex(theme.settingsModalButtonBorderColorV380,border));
   set('--settings-widget-bg-v380',hex(theme.settingsWidgetBackgroundColorV380,surface));
   set('--settings-widget-text-v380',hex(theme.settingsWidgetTextColorV380,text));
   set('--settings-widget-border-v380',hex(theme.settingsWidgetBorderColorV380,border));
   set('--settings-cursor-name-v394',hex(theme.settingsCursorNameTextColorV394,hex(theme.settingsWidgetTextColorV380,text)));
   set('--settings-companion-name-v394',hex(theme.settingsCompanionNameTextColorV394,hex(theme.settingsWidgetTextColorV380,text)));
   set('--settings-theme-name-v394',hex(theme.settingsThemeNameTextColorV394,hex(theme.settingsModalCardTextColorV380,text)));
   set('--settings-theme-name-hover-v394',hex(theme.settingsThemeNameHoverTextColorV394,hex(theme.settingsModalHoverTextColorV380,text)));
 }
 try{
   const old=window.applyCustomBuiltTheme;
   if(typeof old==='function'&&!old.__settingsColorsV380){
     const fn=function(theme){const r=old.apply(this,arguments);apply(theme||{});return r};fn.__settingsColorsV380=true;window.applyCustomBuiltTheme=fn;try{applyCustomBuiltTheme=fn}catch{}
   }
 }catch{}
 if(new URLSearchParams(location.search).get('theme-builder-preview-v307')==='1')window.addEventListener('message',e=>{if(e.origin===location.origin&&e.data?.type==='loggy-theme-preview-apply-v307')apply(e.data?.draft||{})});
 try{apply(window.__loggyResolveAppliedThemeV372?.()||getCustomThemeSettings?.()||{})}catch{}
 const st=document.createElement('style');st.id='loggy-settings-colors-v381';st.textContent=`
 #daily-settings-modal{background:color-mix(in srgb,var(--settings-overlay-v381,#000) 48%,transparent)!important}
 #daily-settings-modal > .modal-box{background:var(--settings-modal-bg-v380,var(--white,#fff))!important;color:var(--settings-modal-text-v380,var(--black,#111))!important;border-color:var(--settings-modal-border-v380,var(--black,#111))!important}
 #daily-settings-modal .modal-header{background:transparent!important;color:var(--settings-modal-text-v380,var(--black,#111))!important;border-color:var(--settings-section-border-v381,var(--settings-modal-border-v380,currentColor))!important}
 #daily-settings-modal .modal-header h2,#daily-settings-modal .field-label,#daily-settings-modal .modal-section>strong,#daily-settings-modal .modal-section>label>span{color:var(--settings-modal-text-v380,currentColor)!important}
 #daily-settings-modal .progress-hint,#daily-settings-modal small,#daily-settings-modal .theme-search-empty{color:var(--settings-muted-text-v381,var(--settings-modal-text-v380,currentColor))!important}
 #daily-settings-modal i,#daily-settings-modal svg{color:var(--settings-icon-v381,currentColor)!important}
 #daily-settings-modal input:not([type="color"]),#daily-settings-modal textarea,#daily-settings-modal select,#daily-settings-modal .theme-search-wrap{background:var(--settings-input-bg-v380,transparent)!important;color:var(--settings-input-text-v380,currentColor)!important;border-color:var(--settings-input-border-v380,currentColor)!important}
 #daily-settings-modal .modal-section{color:var(--settings-modal-text-v380,currentColor)!important;border-color:var(--settings-section-border-v381,var(--settings-modal-border-v380,currentColor))!important}
 #daily-settings-modal .theme-picker-grid{background:transparent!important;border-color:var(--settings-card-border-v380,currentColor)!important}
 #daily-settings-modal .theme-picker-card{background:var(--settings-card-bg-v380,transparent)!important;color:var(--settings-card-text-v380,currentColor)!important;border-color:var(--settings-card-border-v380,currentColor)!important}
 #daily-settings-modal .theme-picker-card:hover{background:var(--settings-hover-bg-v380,transparent)!important;color:var(--settings-hover-text-v380,currentColor)!important;border-color:var(--settings-selected-border-v380,var(--settings-card-border-v380,currentColor))!important}
 #daily-settings-modal .theme-picker-card.selected{background:var(--settings-selected-bg-v380,var(--black,#111))!important;color:var(--settings-selected-text-v380,var(--white,#fff))!important;border-color:var(--settings-selected-border-v380,currentColor)!important}
 #daily-settings-modal .icon-grid,#daily-settings-modal #cursor-picker,#daily-settings-modal #companion-picker{background:var(--settings-widget-bg-v380,transparent)!important;color:var(--settings-widget-text-v380,currentColor)!important;border-color:var(--settings-widget-border-v380,var(--settings-card-border-v380,currentColor))!important}
 #daily-settings-modal #cursor-picker .icon-option,#daily-settings-modal #companion-picker .icon-option{background:transparent!important;background-color:transparent!important;background-image:none!important;color:var(--settings-widget-text-v380,var(--settings-card-text-v380,currentColor))!important;border-color:var(--settings-widget-border-v380,var(--settings-card-border-v380,currentColor))!important}
 #daily-settings-modal #cursor-picker .icon-option:hover,#daily-settings-modal #companion-picker .icon-option:hover{background:transparent!important;color:var(--settings-hover-text-v380,currentColor)!important;border-color:var(--settings-selected-border-v380,var(--settings-widget-border-v380,currentColor))!important}
 #daily-settings-modal #cursor-picker .icon-option.selected,#daily-settings-modal #companion-picker .icon-option.selected{background:var(--settings-selected-bg-v380,var(--black,#111))!important;color:var(--settings-selected-text-v380,var(--white,#fff))!important;border-color:var(--settings-selected-border-v380,currentColor)!important}
 #daily-settings-modal #cursor-picker .icon-option:not(:hover):not(.selected) small{color:var(--settings-cursor-name-v394,var(--settings-widget-text-v380,currentColor))!important}
 #daily-settings-modal #companion-picker .icon-option:not(:hover):not(.selected) small{color:var(--settings-companion-name-v394,var(--settings-widget-text-v380,currentColor))!important}
 #daily-settings-modal #cursor-picker .icon-option:hover small,#daily-settings-modal #companion-picker .icon-option:hover small{color:var(--settings-hover-text-v380,currentColor)!important}
 #daily-settings-modal #cursor-picker .icon-option.selected small,#daily-settings-modal #companion-picker .icon-option.selected small{color:var(--settings-selected-text-v380,currentColor)!important}
 #daily-settings-modal .theme-picker-card .theme-picker-info{background:var(--settings-card-bg-v380,var(--settings-modal-bg-v380,#fff))!important}
 #daily-settings-modal .theme-picker-card .theme-picker-name{color:var(--settings-theme-name-v394,var(--settings-card-text-v380,currentColor))!important}
 #daily-settings-modal .theme-picker-card:hover .theme-picker-info{background:var(--settings-hover-bg-v380,var(--settings-card-bg-v380,#fff))!important}
 #daily-settings-modal .theme-picker-card:hover .theme-picker-name{color:var(--settings-theme-name-hover-v394,var(--settings-hover-text-v380,currentColor))!important}
 #daily-settings-modal button:not(.icon-option):not(.theme-picker-card){background:var(--settings-button-bg-v380,transparent)!important;color:var(--settings-button-text-v380,currentColor)!important;border-color:var(--settings-button-border-v380,currentColor)!important}
 #daily-settings-modal button:not(.icon-option):not(.theme-picker-card):hover{background:var(--settings-hover-bg-v380,var(--settings-button-bg-v380,transparent))!important;color:var(--settings-hover-text-v380,var(--settings-button-text-v380,currentColor))!important}
 #daily-settings-modal .log-settings-trash-card-v327,#daily-settings-modal .log-settings-trash-card-v327:hover,#daily-settings-modal .log-settings-trash-card-v327:focus,#daily-settings-modal .log-settings-trash-card-v327:focus-visible,#daily-settings-modal .log-settings-trash-card-v327:active{background:transparent!important;background-color:transparent!important;background-image:none!important;box-shadow:none!important;color:var(--settings-modal-text-v380,var(--black,#111))!important;border-color:var(--settings-modal-border-v380,currentColor)!important}
 #daily-settings-modal .log-settings-trash-card-v327>i,#daily-settings-modal .log-settings-trash-card-v327>strong,#daily-settings-modal .log-settings-trash-card-v327>span{color:var(--settings-modal-text-v380,var(--black,#111))!important}
 #daily-settings-modal #daily-settings-close,#daily-settings-modal #daily-settings-close:hover,#daily-settings-modal #daily-settings-close:focus,#daily-settings-modal #daily-settings-close:active{background:transparent!important;background-color:transparent!important;background-image:none!important;color:var(--settings-modal-text-v380,var(--black,#111))!important;border-color:var(--settings-modal-border-v380,currentColor)!important;box-shadow:none!important}
 #daily-settings-modal #daily-settings-close i,#daily-settings-modal #daily-settings-close svg{color:var(--settings-modal-text-v380,var(--black,#111))!important;fill:currentColor;stroke:currentColor}
 `;document.head.appendChild(st);
})();


// ============================================================================
// V382 — GLOBAL ACCESSORY DELETE / TOMBSTONE OWNER
// Deleted cursors + companions stay deleted on every Log page and theme reopen.
// ============================================================================
(() => {
  'use strict';
  if (window.__loggyAccessoryDeleteAuthorityV382) return;
  window.__loggyAccessoryDeleteAuthorityV382 = true;

  const HC='loggy-hidden-cursors-v163', HP='loggy-hidden-companions-v163';
  const CUR='loggy-custom-cursors-v163', COMP='loggy-custom-companions-v163', AI='loggy-ai-theme-cursors-v161';
  const SHARED='loggy-shared-themes-v40';
  const read=(key,fallback)=>{try{const v=JSON.parse(localStorage.getItem(key)||'null');return v??fallback}catch{return fallback}};
  const write=(key,value)=>{try{localStorage.setItem(key,JSON.stringify(value))}catch{}};
  const hidden=(kind)=>new Set((read(kind==='cursor'?HC:HP,[])||[]).map(String));

  function sanitizeTheme(theme,kind,id){
    if(!theme||typeof theme!=='object'||Array.isArray(theme))return false;
    let changed=false;
    if(kind==='cursor'){
      const matches=[theme.themeCursorStyle,theme.customCursorModeIdV161,theme.customCursorDependencyV161?.id].some(v=>String(v||'')===id);
      if(matches){
        theme.useThemeCursor=false;theme.themeCursorStyle='default';theme.themeCursorTrailEnabledV161=false;
        theme.customCursorModeIdV161='';delete theme.customCursorDependencyV161;delete theme.customCursorV161;delete theme.customCursorLabelV161;changed=true;
      }
    }else{
      const matches=[theme.themeCompanion,theme.themeCompanionStyleV163].some(v=>String(v||'')===id);
      if(matches){theme.useThemeCompanion=false;theme.themeCompanionEnabledV163=false;theme.themeCompanion='none';theme.themeCompanionStyleV163='none';changed=true;}
    }
    const variants=theme.themeBuilderAiVariantsV376;
    if(variants&&typeof variants==='object')for(const mode of ['light','dark'])if(sanitizeTheme(variants[mode],kind,id))changed=true;
    return changed;
  }

  function purgeThemeRefs(kind,id){
    id=String(id||'');if(!id)return;
    try{
      const rows=read(SHARED,[]);let dirty=false;
      if(Array.isArray(rows))rows.forEach(row=>{if(sanitizeTheme(row?.theme,kind,id))dirty=true});
      if(dirty)write(SHARED,rows);
    }catch{}
    try{
      const copies=db?.settings?.themeCopiesV30;let dirty=false;
      if(Array.isArray(copies))copies.forEach(row=>{if(sanitizeTheme(row?.theme,kind,id))dirty=true});
      if(sanitizeTheme(db?.settings?.customTheme,kind,id))dirty=true;
      if(dirty)saveDb?.();
    }catch{}
  }
  window.__loggyPurgeDeletedAccessoryV382=purgeThemeRefs;

  function enforce(){
    const hc=hidden('cursor'),hp=hidden('companion');
    try{write(CUR,(read(CUR,[])||[]).filter(x=>!hc.has(String(x?.id||''))))}catch{}
    try{write(COMP,(read(COMP,[])||[]).filter(x=>!hp.has(String(x?.id||''))))}catch{}
    try{write(AI,(read(AI,[])||[]).filter(x=>!hc.has(String(x?.id||''))))}catch{}
    try{if(typeof CURSOR_OPTIONS!=='undefined')for(let i=CURSOR_OPTIONS.length-1;i>=0;i--){const id=String(CURSOR_OPTIONS[i]?.id||'');if(id!=='default'&&hc.has(id))CURSOR_OPTIONS.splice(i,1)}}catch{}
    try{if(typeof COMPANIONS!=='undefined')for(let i=COMPANIONS.length-1;i>=0;i--){const id=String(COMPANIONS[i]?.id||'');if(hp.has(id))COMPANIONS.splice(i,1)}}catch{}
    let changed=false;
    try{
      if(db?.settings){
        const cid=String(db.settings.cursorStyle||'default');if(cid!=='default'&&hc.has(cid)){db.settings.cursorStyle='default';changed=true}
        const pid=String(db.settings.companion||'none');if(pid!=='none'&&hp.has(pid)){db.settings.companion='none';changed=true}
        if(db.settings.cursorTrails)for(const id of hc)if(id in db.settings.cursorTrails){delete db.settings.cursorTrails[id];changed=true}
      }
    }catch{}
    if(changed)try{saveDb?.()}catch{}
  }

  function refresh(){
    enforce();
    try{renderCursorPicker?.()}catch{}
    try{renderCompanionPicker?.()}catch{}
    try{applyCursorChoice?.()}catch{}
    try{renderCompanion?.()}catch{}
  }

  enforce();
  queueMicrotask(refresh);
  window.addEventListener('storage',event=>{
    if(![HC,HP,CUR,COMP,AI,SHARED].includes(event.key))return;
    refresh();
  });
})();

// V397 — Settings close X is permanently transparent on Log pages.
(()=>{
  'use strict';
  if(window.__loggySettingsCloseXAuthorityV397)return;window.__loggySettingsCloseXAuthorityV397=true;
  const st=document.createElement('style');st.id='loggy-settings-close-x-authority-v397';st.textContent=`
  #daily-settings-modal #daily-settings-close,#daily-settings-modal #daily-settings-close:hover,#daily-settings-modal #daily-settings-close:focus,#daily-settings-modal #daily-settings-close:focus-visible,#daily-settings-modal #daily-settings-close:active,
  #settings-modal #settings-close,#settings-modal #settings-close:hover,#settings-modal #settings-close:focus,#settings-modal #settings-close:focus-visible,#settings-modal #settings-close:active{
    background:transparent!important;background-color:transparent!important;background-image:none!important;box-shadow:none!important;
  }
  #daily-settings-modal #daily-settings-close{color:var(--settings-modal-text-v380,var(--black,#111))!important;}
  #settings-modal #settings-close{color:var(--settings-modal-text-v380,var(--black,#111))!important;}
  #daily-settings-modal #daily-settings-close i,#daily-settings-modal #daily-settings-close svg,#settings-modal #settings-close i,#settings-modal #settings-close svg{color:inherit!important;fill:currentColor!important;stroke:currentColor!important;}
  `;document.head.appendChild(st);
  const force=()=>['#daily-settings-close','#settings-close'].forEach(sel=>{const b=document.querySelector(sel);if(!b)return;b.style.setProperty('background','transparent','important');b.style.setProperty('background-color','transparent','important');b.style.setProperty('background-image','none','important');b.style.setProperty('box-shadow','none','important');b.style.setProperty('color','var(--settings-modal-text-v380,var(--black,#111))','important')});
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',force,{once:true});else force();
  document.addEventListener('click',e=>{if(e.target.closest?.('#open-daily-settings-btn,#daily-settings-modal,#settings-modal,#open-settings-btn'))requestAnimationFrame(force)},true);
  window.addEventListener('message',e=>{if(e.origin===location.origin&&e.data?.type==='loggy-theme-preview-apply-v307')requestAnimationFrame(force)});
})();


// ============================================================================
// V407 — FINAL SINGLE-SCENE PLACEMENT + APPLIED LOG ACROSS OWNER
// Saved themes own one immutable placement map. Runtime rendering is not allowed
// to re-stamp/reindex it from a filtered or page-specific asset list. The real
// applied Log page also resolves the actually-selected saved theme before it
// hands control to V350, so a partial/legacy mount object cannot downgrade the
// global Across Screen setting.
// ============================================================================
(() => {
  'use strict';
  if(window.__loggySingleSceneV407)return;
  window.__loggySingleSceneV407=true;

  const hidden=a=>!!(a&&(a.hiddenOnScreenV63===true||a.hidden===true||a.enabled===false||a.showOnScreen===false||a.visible===false||a.visibleV63===false));
  const validPoint=p=>!!(p&&Number.isFinite(Number(p.x))&&Number.isFinite(Number(p.y)));
  const isPreview=()=>{try{return new URLSearchParams(location.search).get('theme-builder-preview-v307')==='1'}catch{return false}};
  const clone=value=>{try{return structuredClone(value)}catch{}try{return JSON.parse(JSON.stringify(value))}catch{return value}};

  function flattenVariantV407(theme){
    if(!theme||typeof theme!=='object')return{};
    const mode=String(theme.themeBuilderAiSelectedVariantV376||theme.themeBuilderAiModeV364||theme.selectedVariant||theme.activeVariant||'').toLowerCase()==='dark'?'dark':'light';
    const variants=(theme.themeBuilderAiVariantsV376&&typeof theme.themeBuilderAiVariantsV376==='object')?theme.themeBuilderAiVariantsV376:((theme.variants&&typeof theme.variants==='object')?theme.variants:null);
    const variant=variants?.[mode];
    return variant&&typeof variant==='object'&&!Array.isArray(variant)?{...theme,...variant,themeBuilderAiSelectedVariantV376:mode,themeBuilderAiModeV364:mode}:theme;
  }

  function selectedAppliedThemeV407(){
    let resolved={};
    try{resolved=window.__loggyResolveAppliedThemeV372?.()||{}}catch{}
    resolved=flattenVariantV407(resolved);
    return resolved&&typeof resolved==='object'?resolved:{};
  }

  function ensureLegacyLayoutV407(theme){
    if(!theme||typeof theme!=='object')return theme;
    const assets=Array.isArray(theme.backgroundSvgs)?theme.backgroundSvgs:[];
    const pts=Array.isArray(theme.resolvedDecorationPlacementsV405)?theme.resolvedDecorationPlacementsV405:[];
    const indexed=assets.every((a,i)=>!a||typeof a!=='object'||Number.isFinite(Number(a.placementIndexV405)));
    if(pts.length>=assets.length&&pts.slice(0,assets.length).every(validPoint)&&indexed)return theme;
    // Compatibility only for themes saved before V405/V407. Once created, this
    // map is preserved; ordinary runtime renders never recompute a saved map.
    try{return window.__loggyStampDecorationLayoutV405?.(theme)||theme}catch{return theme}
  }

  function pointV407(theme,row,index){
    const pts=Array.isArray(theme?.resolvedDecorationPlacementsV405)?theme.resolvedDecorationPlacementsV405:[];
    const raw=Number(row?.svg?.placementIndexV405 ?? row?.placementIndexV405 ?? row?.originalIndex ?? index);
    const idx=Number.isFinite(raw)?raw:index;
    const p=pts[idx];
    return validPoint(p)?{x:Number(p.x),y:Number(p.y),index:idx}:null;
  }

  // Assignment readers consume the saved map but do not mutate it.
  try{
    const before=getPreviewSvgAssignmentsV10;
    getPreviewSvgAssignmentsV10=function(modal,draft={}){
      ensureLegacyLayoutV407(draft);
      const rows=before.apply(this,arguments)||[];
      return rows.map((row,i)=>{const p=pointV407(draft,row,i);return p?{...row,left:p.x,top:p.y}:row});
    };
  }catch{}
  try{
    const before=getRuntimeSvgAssignmentsV10;
    getRuntimeSvgAssignmentsV10=function(theme={}){
      ensureLegacyLayoutV407(theme);
      const rows=before.apply(this,arguments)||[];
      return rows.map((row,i)=>{const p=pointV407(theme,row,i);return p?{...row,left:p.x,top:p.y}:row});
    };
  }catch{}

  function appliedSceneThemeV407(explicit){
    if(isPreview())return ensureLegacyLayoutV407(flattenVariantV407(explicit&&typeof explicit==='object'?explicit:{}));
    const selected=selectedAppliedThemeV407();
    const hasSelected=selected&&Object.keys(selected).length;
    const source=hasSelected?selected:(explicit&&typeof explicit==='object'?flattenVariantV407(explicit):{});
    return ensureLegacyLayoutV407(source);
  }

  function tagAndPlaceV407(explicit={}){
    const theme=appliedSceneThemeV407(explicit);
    const stage=document.getElementById('custom-theme-background-stage');if(!stage)return;
    const all=Array.isArray(theme?.backgroundSvgs)?theme.backgroundSvgs:[];
    const visible=all.filter(a=>!hidden(a));
    const pts=Array.isArray(theme?.resolvedDecorationPlacementsV405)?theme.resolvedDecorationPlacementsV405:[];
    const items=Array.from(stage.querySelectorAll(':scope > .custom-theme-background-svg')).filter(n=>n.dataset.themeCrossCloneV350!=='true'&&n.dataset.themeCrossCloneV149!=='true'&&n.dataset.themeCrossCloneV94!=='true');
    items.forEach((item,i)=>{
      // Prefer URL/old dataset mapping when available, otherwise the visible list.
      let asset=visible[i]||all[i]||{};
      const existing=Number(item.dataset.svgIndex);
      if(Number.isFinite(existing)){
        const byPlacement=all.find(a=>Number(a?.placementIndexV405)===existing);
        if(byPlacement)asset=byPlacement;
      }
      const raw=Number(asset?.placementIndexV405);const idx=Number.isFinite(raw)?raw:i;
      item.dataset.svgIndex=String(idx);
      const p=pts[idx];if(!validPoint(p))return;
      item.style.setProperty('top',`${Math.max(2,Math.min(98,Number(p.y)))}%`,'important');
      if(item.dataset.v350Across!=='1')item.style.setProperty('left',`${Math.max(2,Math.min(98,Number(p.x)))}%`,'important');
    });
    // Always hand V350 the authoritative selected saved theme on the real Log
    // page. This closes the path where a filtered/legacy mount object had the
    // right images but an old default animation.
    try{window.__loggyConfigureAcrossV404BaseV407?.(theme)}catch{}
  }

  // Route every future V404 call through the actual selected saved theme.
  try{
    const base=window.__loggyConfigureAcrossV404;
    if(typeof base==='function'){
      window.__loggyConfigureAcrossV404BaseV407=base;
      window.__loggyConfigureAcrossV404=function(explicit){
        const theme=appliedSceneThemeV407(explicit);
        return base(theme);
      };
    }
  }catch{}

  // Outermost mount owner. No re-stamping after an inner renderer has filtered
  // hidden assets; just tag from the already-saved canonical indices/points.
  try{
    const before=window.mountCustomThemeBackgroundSvgsV2;
    if(typeof before==='function'){
      const fn=function(theme={}){
        const scene=appliedSceneThemeV407(theme);
        const r=before.call(this,scene);
        tagAndPlaceV407(scene);
        requestAnimationFrame(()=>tagAndPlaceV407(scene));
        return r;
      };
      fn.__v407SingleScene=true;
      window.mountCustomThemeBackgroundSvgsV2=fn;try{mountCustomThemeBackgroundSvgsV2=fn}catch{}
    }
  }catch{}

  // Event-driven repair for a stage mounted before the lazy V407 bundle, or a
  // stage replaced by a later legitimate theme application. No polling.
  let queued=0;
  const reassert=()=>{
    if(queued)return;
    queued=requestAnimationFrame(()=>{queued=0;const t=appliedSceneThemeV407();tagAndPlaceV407(t);try{window.__loggyApplyDefaultMotionsV363?.(t)}catch{}try{window.__loggyConfigureAcrossV404?.(t)}catch{}});
  };
  const rootObserver=new MutationObserver(records=>{
    if(records.some(r=>[...r.addedNodes,...r.removedNodes].some(n=>n?.nodeType===1&&(n.id==='custom-theme-background-stage'||n.querySelector?.('#custom-theme-background-stage')))))reassert();
  });
  try{rootObserver.observe(document.documentElement,{childList:true,subtree:true})}catch{}
  window.addEventListener('pageshow',reassert);
  window.addEventListener('loggy-features-ready',reassert);
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',reassert,{once:true});else reassert();
  window.__loggyApplyCanonicalPlacementV405=tagAndPlaceV407;
  window.__loggyApplySingleSceneV407=reassert;
})();



// Intro segment/fade enforcement is handled by the canonical V420 player in template-extras-2.js.

// ============================================================================
// V415 — LOG SETTINGS THEME-GALLERY-ONLY SCROLL OWNER
// Keep Settings title/search visible. Opening Settings centers the applied theme
// only inside #theme-picker; it never scrolls the outer .modal-box.
// ============================================================================
(() => {
  'use strict';
  if (window.__logSettingsThemeGalleryScrollV415) return;
  window.__logSettingsThemeGalleryScrollV415 = true;

  function appliedIdV415(){
    try { return String((typeof db !== 'undefined' ? db : window.db)?.settings?.theme || 'default'); }
    catch { return 'default'; }
  }
  function snapV415(){
    const modal=document.getElementById('daily-settings-modal');
    if(!modal||modal.classList.contains('hidden'))return;
    const box=modal.querySelector(':scope > .modal-box');
    const picker=document.getElementById('theme-picker');
    if(box)box.scrollTop=0;
    if(!picker)return;
    const id=appliedIdV415();
    const card=Array.from(picker.querySelectorAll('.theme-picker-card[data-theme]')).find(c=>String(c.dataset.theme||'')===id)||picker.querySelector('.theme-picker-card.selected');
    if(card){
      const pr=picker.getBoundingClientRect(),cr=card.getBoundingClientRect();
      const delta=cr.top-pr.top-Math.max(0,(picker.clientHeight-card.offsetHeight)/2);
      picker.scrollTop=Math.max(0,picker.scrollTop+delta);
    }
    if(box)box.scrollTop=0;
  }
  try{
    const old=window.openGlobalThemeSettings || (typeof openGlobalThemeSettings==='function'?openGlobalThemeSettings:null);
    if(typeof old==='function'&&!old.__v415GalleryOnly){
      const fn=function(){const r=old.apply(this,arguments);snapV415();requestAnimationFrame(()=>requestAnimationFrame(snapV415));return r};
      fn.__v415GalleryOnly=true;
      window.openGlobalThemeSettings=fn;
      try{openGlobalThemeSettings=fn}catch{}
    }
  }catch{}
  const modal=document.getElementById('daily-settings-modal');
  if(modal)new MutationObserver(()=>{if(!modal.classList.contains('hidden'))requestAnimationFrame(()=>requestAnimationFrame(snapV415))}).observe(modal,{attributes:true,attributeFilter:['class']});
})();

// ============================================================================
// V444 — LOG INTRO LIFECYCLE IS CORE-OWNED
// template.js now stops outgoing audio at the start of the real applyTheme(),
// and starts/adopts the incoming intro at the end. Do not wrap applyTheme here;
// a late wrapper was the reason first-apply behavior depended on extras timing.
// ============================================================================
(() => {
  'use strict';
  window.__loggyFinalIntroLifecycleV443 = true;
  window.__loggyFinalIntroLifecycleV444 = 'core-owned';
})();


/* V429 — decoration downloads + heading-background controls. */


// ============================================================================
// V505 — Heading Backdrop bridge to the single core renderer in template.js.
// No duplicate selector/state implementation lives in this late bundle anymore.
// ============================================================================
(() => {
  'use strict';
  const apply = theme => {
    try { window.__loggyApplyCoreHeadingBackdropV505?.(theme || window.__loggyResolveAppliedThemeV372?.() || getCustomThemeSettings?.() || {}); } catch (_) {}
  };
  window.__loggyApplyHeadingBackgroundV431 = apply;

  window.addEventListener('message', event => {
    if (event.origin !== location.origin || event.data?.type !== 'loggy-theme-preview-apply-v307') return;
    apply(event.data?.draft || {});
  });

  document.addEventListener('input', event => {
    if (!event.target?.closest?.('#theme-builder-v307-modal,#theme-builder-modal')) return;
    try {
      const draft = window.__loggyThemeBuilderV307?.state?.draft || window.__loggyActivePreviewThemeV372 || null;
      if (draft) requestAnimationFrame(() => apply(draft));
    } catch (_) {}
  }, true);
  document.addEventListener('change', event => {
    if (!event.target?.closest?.('#theme-builder-v307-modal,#theme-builder-modal')) return;
    try {
      const draft = window.__loggyThemeBuilderV307?.state?.draft || window.__loggyActivePreviewThemeV372 || null;
      if (draft) requestAnimationFrame(() => apply(draft));
    } catch (_) {}
  }, true);

  try {
    const before = window.applyCustomBuiltTheme || applyCustomBuiltTheme;
    if (typeof before === 'function' && !before.__headingBackdropCoreV505) {
      const wrapped = function(theme) {
        const result = before.apply(this, arguments);
        apply(theme || window.__loggyResolveAppliedThemeV372?.() || {});
        return result;
      };
      wrapped.__headingBackdropCoreV505 = true;
      window.applyCustomBuiltTheme = wrapped;
      try { applyCustomBuiltTheme = wrapped; } catch (_) {}
    }
  } catch (_) {}

  try {
    const previousSwitch = window.switchView || (typeof switchView === 'function' ? switchView : null);
    if (typeof previousSwitch === 'function' && !previousSwitch.__headingBackdropCoreV505) {
      const wrappedSwitch = function() {
        const result = previousSwitch.apply(this, arguments);
        requestAnimationFrame(() => window.__loggySyncCoreHeadingBackdropV505?.());
        return result;
      };
      wrappedSwitch.__headingBackdropCoreV505 = true;
      window.switchView = wrappedSwitch;
      try { switchView = wrappedSwitch; } catch (_) {}
    }
  } catch (_) {}

  try { apply(window.__loggyResolveAppliedThemeV372?.() || getCustomThemeSettings?.() || {}); } catch (_) {}
})();


// ============================================================================
// V432 — ADVANCED AI UI MATERIAL LANGUAGE
// ============================================================================
(() => {
  'use strict';
  if (window.__loggyAdvancedUiV432) return;
  window.__loggyAdvancedUiV432 = true;
  const STYLE_ID='loggy-advanced-ui-style-v432';
  const allowed = value => ['solid','dashed','dotted','double'].includes(String(value)) ? String(value) : 'solid';
  const num = (value,min,max,fallback) => { const n=Number(value); return Number.isFinite(n)?Math.max(min,Math.min(max,n)):fallback; };
  const flatten = theme => {
    if (!theme || typeof theme !== 'object') return {};
    const variants=theme.themeBuilderAiVariantsV376, mode=String(theme.themeBuilderAiSelectedVariantV376||theme.themeBuilderAiModeV364||'').toLowerCase();
    return variants&&typeof variants==='object'&&variants[mode]&&typeof variants[mode]==='object'?{...theme,...variants[mode]}:theme;
  };
  function apply(raw){
    const theme=flatten(raw||{}), enabled=theme.advancedUiEnabledV432===true;
    let style=document.getElementById(STYLE_ID);
    if(!style){style=document.createElement('style');style.id=STYLE_ID;document.head.appendChild(style);}
    if(!enabled){style.textContent='';document.documentElement.dataset.loggyAdvancedUiV432='0';return;}
    const card=allowed(theme.advancedBorderStyleV432), input=allowed(theme.advancedInputBorderStyleV432), button=allowed(theme.advancedButtonBorderStyleV432);
    const width=num(theme.advancedBorderWidthV432,1,4,1), inputRadius=num(theme.advancedInputRadiusV432,0,28,10), cardRadius=num(theme.advancedCardRadiusV432,0,28,10), buttonRadius=num(theme.advancedButtonRadiusV432,0,28,10);
    document.documentElement.dataset.loggyAdvancedUiV432='1';
    style.textContent=`
      body.theme-custom-builder input:not([type="range"]):not([type="color"]):not([type="checkbox"]):not([type="radio"]),
      body.theme-custom-builder textarea,body.theme-custom-builder select,body.theme-custom-builder .theme-search-wrap,
      body.theme-custom-builder .notes-editable,body.theme-custom-builder .input-group input{
        border-style:${input}!important;border-width:${width}px!important;border-radius:${inputRadius}px!important;
      }
      body.theme-custom-builder .day-box,body.theme-custom-builder .day-picker-box,body.theme-custom-builder .phrase-card,
      body.theme-custom-builder .toolbox-item,body.theme-custom-builder .resource-card,body.theme-custom-builder .polaroid-card,
      body.theme-custom-builder .custom-user-card,body.theme-custom-builder .custom-user-polaroid,body.theme-custom-builder .custom-tab-component,
      body.theme-custom-builder .note-audio-row,body.theme-custom-builder .modal-box,body.theme-custom-builder .flashcard,
      body.theme-custom-builder .day-target-box,body.theme-custom-builder #anki-summary-box{
        border-style:${card}!important;border-width:${width}px!important;border-radius:${cardRadius}px!important;
      }
      body.theme-custom-builder .icon-btn:not(.side-nav .icon-btn),body.theme-custom-builder .small-icon-btn:not(.side-nav .small-icon-btn),
      body.theme-custom-builder .filter-tab,body.theme-custom-builder .chip,body.theme-custom-builder .save-btn,
      body.theme-custom-builder button.custom-component-action,body.theme-custom-builder .header-back-btn{
        border-style:${button}!important;border-width:${width}px!important;border-radius:${buttonRadius}px!important;
      }`;
  }
  window.__loggyApplyAdvancedUiV432=apply;
  try{apply(window.__loggyResolveAppliedThemeV372?.()||getCustomThemeSettings?.()||{});}catch{}
  try{
    const before=window.applyCustomBuiltTheme||applyCustomBuiltTheme;
    if(typeof before==='function'&&!before.__advancedUiV432){
      const wrapped=function(theme){const result=before.apply(this,arguments);try{apply(theme||window.__loggyResolveAppliedThemeV372?.()||{});}catch{}return result;};
      wrapped.__advancedUiV432=true;window.applyCustomBuiltTheme=wrapped;try{applyCustomBuiltTheme=wrapped;}catch{}
    }
  }catch{}
  window.addEventListener('message',event=>{if(event.origin!==location.origin||event.data?.type!=='loggy-theme-preview-apply-v307')return;apply(event.data?.draft||{});});
})();


// ============================================================================
// V456 — INDEPENDENT QUIZ BACKDROP
// ============================================================================
(() => {
  'use strict';
  if (window.__loggyQuizBackdropV456) return;
  window.__loggyQuizBackdropV456 = true;
  const root=document.documentElement.style;
  const validHex=v=>/^#[0-9a-f]{6}$/i.test(String(v||'').trim());
  const apply=raw=>{
    const theme=(raw&&typeof raw==='object')?raw:{};
    const on=theme.quizBackdropEnabledV456===true;
    document.documentElement.dataset.loggyQuizBoxBackdropV458=on?'1':'0';
    const color=validHex(on?theme.quizBackdropColorV456:theme.contentBackdropColor)?String(on?theme.quizBackdropColorV456:theme.contentBackdropColor):(validHex(theme.surface)?theme.surface:'#ffffff');
    const opacity=Math.max(0,Math.min(100,Number(on?theme.quizBackdropOpacityV456:(theme.contentBackdropEnabled?theme.contentBackdropOpacity:0))||0));
    const radius=Math.max(0,Math.min(40,Number(on?theme.quizBackdropRadiusV456:theme.radius)||0));
    const padding=Math.max(0,Math.min(40,Number(on?theme.quizBackdropPaddingV459:0)||0));
    root.setProperty('--custom-theme-quiz-backdrop-color-v456',color);
    root.setProperty('--custom-theme-quiz-backdrop-opacity-v456',`${opacity}%`);
    root.setProperty('--custom-theme-quiz-backdrop-radius-v456',`${radius}px`);
    root.setProperty('--custom-theme-quiz-backdrop-padding-v459',`${padding}px`);
  };
  window.__loggyApplyQuizBackdropV456=apply;
  try{apply(window.__loggyResolveAppliedThemeV372?.()||getCustomThemeSettings?.()||{});}catch{}
  window.addEventListener('message',event=>{if(event.origin!==location.origin||event.data?.type!=='loggy-theme-preview-apply-v307')return;apply(event.data?.draft||{});});
})();


// ============================================================================
// V452 — THEME GALLERY KEYBOARD + APPLIED-THEME SCROLL AUTHORITY
// ============================================================================
(() => {
  'use strict';
  if (window.__loggyThemeGalleryNavV452) return;
  window.__loggyThemeGalleryNavV452 = true;
  let hovered = false;
  const modal = document.getElementById('daily-settings-modal');
  const picker = () => document.getElementById('theme-picker');
  const appliedId = () => {
    try { return String((typeof db !== 'undefined' ? db : window.db)?.settings?.theme || 'default'); } catch { return 'default'; }
  };
  const scrollApplied = () => {
    const m = document.getElementById('daily-settings-modal'), p = picker();
    if (!m || m.classList.contains('hidden') || !p) return;
    const id = appliedId();
    const card = Array.from(p.querySelectorAll('.theme-picker-card[data-theme]')).find(c => String(c.dataset.theme || '') === id) || p.querySelector('.theme-picker-card.selected');
    if (!card) return;
    const top = Math.max(0, card.offsetTop - Math.max(0, (p.clientHeight - card.offsetHeight) / 2));
    p.scrollTop = top;
  };
  document.addEventListener('pointerover', e => { if (e.target?.closest?.('#theme-picker')) hovered = true; }, true);
  document.addEventListener('pointerout', e => {
    const p = picker();
    if (p && !p.contains(e.relatedTarget)) hovered = false;
  }, true);
  document.addEventListener('keydown', e => {
    if (e.key !== 'ArrowDown' || !hovered) return;
    const p = picker();
    if (!p || modal?.classList.contains('hidden')) return;
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    p.scrollTop = p.scrollHeight;
  }, true);
  if (modal) new MutationObserver(() => {
    if (!modal.classList.contains('hidden')) { scrollApplied(); requestAnimationFrame(scrollApplied); }
  }).observe(modal,{attributes:true,attributeFilter:['class']});
  document.addEventListener('click', e => {
    if (e.target?.closest?.('#open-daily-settings-btn,#open-settings-btn')) { scrollApplied(); requestAnimationFrame(scrollApplied); }
  }, true);
})();


// ============================================================================
// V454 — LOG SETTINGS THEME DISPLAY CONTAINER AUTHORITY
// ============================================================================
(() => {
  'use strict';
  if (window.__loggyThemeDisplayAuthorityV454) return;
  window.__loggyThemeDisplayAuthorityV454 = true;
  let hoveredV454 = false;
  const modalV454 = () => document.getElementById('daily-settings-modal');
  const pickerV454 = () => document.getElementById('theme-picker');
  const appliedV454 = () => {
    try { return String(db?.settings?.theme || document.getElementById('daily-theme-select')?.value || 'default'); }
    catch { return 'default'; }
  };
  const scrollAppliedV454 = () => {
    const modal = modalV454(), picker = pickerV454();
    if (!modal || modal.classList.contains('hidden') || !picker) return;
    const id = appliedV454();
    const cards = Array.from(picker.querySelectorAll('.theme-picker-card[data-theme]'));
    const card = cards.find(el => String(el.dataset.theme || '') === id) || picker.querySelector('.theme-picker-card.selected');
    if (!card) return;
    picker.scrollTop = Math.max(0, card.offsetTop - Math.max(0, (picker.clientHeight - card.offsetHeight) / 2));
  };
  const burstV454 = () => {
    scrollAppliedV454();
    requestAnimationFrame(scrollAppliedV454);
    setTimeout(scrollAppliedV454, 40);
    setTimeout(scrollAppliedV454, 120);
    setTimeout(scrollAppliedV454, 260);
  };
  document.addEventListener('pointerover', e => { if (e.target?.closest?.('#theme-picker')) hoveredV454 = true; }, true);
  document.addEventListener('pointerout', e => { const p=pickerV454(); if (p && !p.contains(e.relatedTarget)) hoveredV454=false; }, true);
  document.addEventListener('keydown', e => {
    if (e.key !== 'ArrowDown' || !hoveredV454) return;
    const p=pickerV454(), m=modalV454();
    if (!p || !m || m.classList.contains('hidden')) return;
    e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation();
    p.scrollTop = p.scrollHeight;
  }, true);
  const modal = modalV454();
  if (modal) new MutationObserver(() => { if (!modal.classList.contains('hidden')) burstV454(); }).observe(modal,{attributes:true,attributeFilter:['class']});
  const bindPickerObserverV454 = () => {
    const p=pickerV454();
    if (!p || p.dataset.appliedScrollObserverV454) return;
    p.dataset.appliedScrollObserverV454='1';
    new MutationObserver(() => { if (!modalV454()?.classList.contains('hidden')) scrollAppliedV454(); }).observe(p,{childList:true,subtree:true});
  };
  bindPickerObserverV454();
  document.addEventListener('click', e => {
    if (e.target?.closest?.('#open-settings-btn')) { bindPickerObserverV454(); burstV454(); }
  }, true);
})();


/* ============================================================
   V465 — KB bulk count + field-delete confirmation authority
   ============================================================ */
(() => {
  'use strict';
  if (window.__loggyV465KbPolish) return;
  window.__loggyV465KbPolish = true;

  // Always use Loggy's styled confirmation modal for deleting KB fields.
  // This late override wins over legacy definitions that still call confirm().
  window.deleteKnowledgeField = async function(categoryName, fieldId) {
    const config = typeof getCategoryConfig === 'function' ? getCategoryConfig(categoryName) : null;
    const field = config?.fields?.find(entry => String(entry.id) === String(fieldId));
    if (!field) return;
    const ok = typeof showAppConfirm === 'function'
      ? await showAppConfirm({
          title: 'Delete Field',
          message: `Delete “${field.name}”? Existing saved values for this field will also be removed.`,
          confirmLabel: 'Delete Field'
        })
      : false;
    if (!ok) return;
    config.fields = config.fields.filter(entry => String(entry.id) !== String(fieldId));
    Object.values(window.db?.phrase_meta || {}).forEach(meta => {
      if (meta?.type === categoryName && meta.custom_fields && Object.prototype.hasOwnProperty.call(meta.custom_fields, field.name)) {
        delete meta.custom_fields[field.name];
      }
    });
    try { saveDb(); } catch {}
    try { renderSettings(); } catch {}
  };

  // If a legacy script rebuilds the edit modal after initial load, make sure
  // Enable Parts is converted to the same switch treatment as Hide from quizzes.
  const syncEditPartsV465 = () => {
    const input = document.getElementById('edit-item-enable-parts');
    if (!input || input.dataset.v250Toggle) return;
    const row = input.closest('.kb-edit-enable-parts-row');
    if (!row) return;
    row.classList.add('v250-toggle-row','kb-enable-parts-row');
    let label = row.querySelector('.field-label');
    if (label) label.textContent = 'Enable Parts';
    const copy = document.createElement('div'); copy.className='v250-toggle-copy';
    if (label) { label.before(copy); copy.append(label); }
    const control = document.createElement('label'); control.className='v250-switch'; control.setAttribute('aria-label','Enable Parts');
    input.before(control); control.append(input);
    const track=document.createElement('span'); track.className='v250-switch-track'; control.append(track);
    input.dataset.v250Toggle='1';
  };
  document.addEventListener('click', e => {
    if (e.target.closest?.('#phrase-modal,.phrase-card,.polaroid-card')) requestAnimationFrame(syncEditPartsV465);
  }, true);
  new MutationObserver(syncEditPartsV465).observe(document.documentElement,{subtree:true,childList:true});
  setTimeout(syncEditPartsV465,0);
})();

// ============================================================================
// V473 — QUIZ DAY SHORTCUTS ARE AUTHORITATIVE IN template.js
// The former V470 observer override is intentionally retired to avoid competing
// with the base Today / This Week / All state.
// ============================================================================
window.__loggyQuizShortcutExclusiveV470 = true;

// ============================================================================
// V473 — FLASHCARD CLICK-TO-FLIP AUTHORITY
// Clicking the face or back toggles the card. Slide arrows/dots/media/audio keep
// their own interaction and never accidentally flip the card.
// ============================================================================
(() => {
  'use strict';
  if (window.__loggyFlashcardFlipAuthorityV473) return;
  window.__loggyFlashcardFlipAuthorityV473 = true;
  document.addEventListener('click', event => {
    const card = event.target?.closest?.('#quiz-learn-view #quiz-flip-front[data-flippable-card-v473="true"]');
    if (!card) return;
    if (event.target.closest('.card-slide-arrow, .card-dot, .audio-play-btn, video, iframe, a, input, select, textarea')) return;
    if (typeof quizMode !== 'undefined' && quizMode !== 'flashcards') return;
    event.preventDefault();
    event.stopImmediatePropagation();
    quizCardFlipped = !quizCardFlipped;
    currentSlideIndex = 0;
    showQuizCard();
  }, true);
})();

/* ============================================================================
   V494 — DECORATION IMAGE SOURCE / VISIBILITY AUTHORITY
   Keep the artwork inside a decoration shell alive across preview/runtime
   remounts. Placement/overlap/animation code may replace wrappers, but it must
   never leave a surviving wrapper with a blank/broken/hidden <img>.
   ============================================================================ */
(() => {
  'use strict';
  if (window.__loggyDecorationImageAuthorityV494) return;
  window.__loggyDecorationImageAuthorityV494 = true;

  const STAGE_ID = 'custom-theme-background-stage';
  const boundImages = new WeakSet();
  let repairQueued = 0;

  function publicUrlV494(projectPath) {
    let p = String(projectPath || '').trim().replace(/\\/g, '/').replace(/^\.\//, '');
    if (!p) return '';
    const marker = '/public/';
    const lower = p.toLowerCase();
    const i = lower.lastIndexOf(marker);
    if (i >= 0) p = p.slice(i + marker.length);
    else if (lower.startsWith('public/')) p = p.slice(7);
    if (!p) return '';
    return '/' + p.split('/').filter(Boolean).map(part => {
      try { return encodeURIComponent(decodeURIComponent(part)); }
      catch { return encodeURIComponent(part); }
    }).join('/');
  }

  function currentThemeV494(explicit) {
    if (explicit && typeof explicit === 'object' && Array.isArray(explicit.backgroundSvgs)) return explicit;
    try {
      const preview = window.__loggyActivePreviewThemeV372;
      const isPreview = new URLSearchParams(location.search).get('theme-builder-preview-v307') === '1';
      if (isPreview && preview && Array.isArray(preview.backgroundSvgs)) return preview;
    } catch {}
    try {
      const applied = window.__loggyResolveAppliedThemeV372?.();
      if (applied && Array.isArray(applied.backgroundSvgs)) return applied;
    } catch {}
    return {};
  }

  function hiddenV494(asset) {
    return asset?.hiddenOnScreenV63 === true || asset?.hidden === true || asset?.enabled === false;
  }

  function candidatesV494(asset) {
    const out = [];
    const push = value => {
      const v = String(value || '').trim();
      if (v && !out.includes(v)) out.push(v);
    };
    // A source that has already loaded successfully is the safest first choice.
    // Then try the durable project URL and the remaining persisted fallbacks.
    push(asset?._stableUrlV164);
    push(publicUrlV494(asset?.projectPath || asset?.path));
    push(asset?.url);
    push(asset?.src);
    push(asset?.dataUrlBackupV494 || asset?.dataUrl);
    return out;
  }

  function assetForWrapperV494(wrapper, theme, displayIndex) {
    const all = Array.isArray(theme?.backgroundSvgs) ? theme.backgroundSvgs : [];
    const visible = all.filter(asset => asset && !hiddenV494(asset));
    const raw = Number(wrapper?.dataset?.svgIndex);
    if (Number.isFinite(raw)) {
      const byPlacement = all.find(asset => Number(asset?.placementIndexV405) === raw);
      if (byPlacement) return byPlacement;
      if (all[raw]) return all[raw];
    }
    return visible[displayIndex] || all[displayIndex] || null;
  }

  function forceImageVisibleV494(img) {
    if (!img) return;
    // Opacity belongs to the decoration WRAPPER. The image itself must remain
    // fully painted or a later renderer can leave only an empty shell/frame.
    img.style.setProperty('display', 'block', 'important');
    img.style.setProperty('visibility', 'visible', 'important');
    img.style.setProperty('opacity', '1', 'important');
    img.style.setProperty('max-width', '100%', 'important');
    img.style.setProperty('max-height', '100%', 'important');
    img.style.setProperty('width', '100%', 'important');
    img.style.setProperty('height', '100%', 'important');
    img.style.setProperty('object-fit', 'contain', 'important');
  }

  function bindImageV494(img, asset) {
    if (!img || !asset) return;
    const sources = candidatesV494(asset);
    if (!sources.length) return;

    forceImageVisibleV494(img);

    // Never force a fallback that already replaced a broken project URL back to
    // the broken URL. The old repair observer did exactly that on every src
    // mutation, causing an endless broken-source/fallback loop and blank artwork.
    const tried = new Set(String(img.dataset.loggyDecorationTriedV494 || '').split('\n').filter(Boolean));
    const current = String(img.getAttribute('src') || '').trim();
    // Keep whatever source is currently painting successfully, including a
    // blob/data URL. Only move to another candidate after the current source is
    // absent or has actually emitted an error. This avoids replacing a live
    // preview image with an unverified derived project path.
    const currentIsUsableCandidate = current && !tried.has(current);
    if (!currentIsUsableCandidate) {
      const next = sources.find(src => !tried.has(src) && !/^blob:/i.test(src)) || sources.find(src => !tried.has(src));
      if (next && next !== current) img.setAttribute('src', next);
    }

    img.dataset.loggyDecorationAssetV494 = String(asset?.projectPath || asset?.url || asset?.name || 'asset');
    if (boundImages.has(img)) return;
    boundImages.add(img);

    img.addEventListener('load', () => {
      forceImageVisibleV494(img);
      const loaded = String(img.getAttribute('src') || img.currentSrc || '').trim();
      if (loaded && !/^blob:/i.test(loaded)) {
        asset._stableUrlV164 = loaded;
        // A successful source is authoritative for this mounted image. Remove it
        // from the failed-source ledger in case an older attempt marked it.
        const tried = new Set(String(img.dataset.loggyDecorationTriedV494 || '').split('\n').filter(Boolean));
        tried.delete(loaded);
        img.dataset.loggyDecorationTriedV494 = Array.from(tried).join('\n');
      }
    });

    img.addEventListener('error', () => {
      const tried = new Set(String(img.dataset.loggyDecorationTriedV494 || '').split('\n').filter(Boolean));
      const currentSrc = String(img.getAttribute('src') || '').trim();
      if (currentSrc) tried.add(currentSrc);
      img.dataset.loggyDecorationTriedV494 = Array.from(tried).join('\n');
      const next = candidatesV494(asset).find(src => !tried.has(src));
      if (next) {
        img.setAttribute('src', next);
        forceImageVisibleV494(img);
      }
    });
  }

  function repairStageV494(explicitTheme) {
    const stage = document.getElementById(STAGE_ID);
    if (!stage) return;
    const theme = currentThemeV494(explicitTheme);
    const wrappers = Array.from(stage.querySelectorAll(':scope > .custom-theme-background-svg'))
      .filter(node => node.dataset.themeCrossCloneV350 !== 'true' && node.dataset.themeCrossCloneV149 !== 'true' && node.dataset.themeCrossCloneV94 !== 'true');

    wrappers.forEach((wrapper, index) => {
      const asset = assetForWrapperV494(wrapper, theme, index);
      if (!asset || hiddenV494(asset)) return;
      const sources = candidatesV494(asset);
      if (!sources.length) return;

      let img = wrapper.querySelector('img');
      // URL-backed assets must always have an image node. If an older remount
      // left only the shell, reconstruct just the artwork without touching the
      // wrapper's position/animation/opacity.
      if (!img && !String(asset?.markup || '').trim()) {
        const shell = wrapper.querySelector('.theme-svg-motion-shell,.theme-image-motion-shell-v36') || wrapper;
        img = document.createElement('img');
        img.className = 'theme-decoration-image-v36 theme-decoration-image-health-v494';
        img.alt = '';
        img.draggable = false;
        img.decoding = 'async';
        img.src = sources[0];
        shell.replaceChildren(img);
      }
      bindImageV494(img, asset);
    });
  }

  function scheduleRepairV494(theme) {
    if (repairQueued) cancelAnimationFrame(repairQueued);
    repairQueued = requestAnimationFrame(() => {
      repairQueued = 0;
      repairStageV494(theme);
    });
  }

  // Final mount wrapper: repair after all older overlap/placement/animation
  // owners have finished creating their nodes.
  try {
    const before = window.mountCustomThemeBackgroundSvgsV2;
    if (typeof before === 'function' && !before.__decorationImageAuthorityV494) {
      const fn = function(theme = {}) {
        const result = before.apply(this, arguments);
        repairStageV494(theme);
        scheduleRepairV494(theme);
        return result;
      };
      fn.__decorationImageAuthorityV494 = true;
      window.mountCustomThemeBackgroundSvgsV2 = fn;
      try { mountCustomThemeBackgroundSvgsV2 = fn; } catch {}
    }
  } catch {}

  // Repair legitimate later stage replacements without polling.
  try {
    new MutationObserver(records => {
      let relevant = false;
      for (const record of records) {
        if (record.type === 'attributes' && record.target?.tagName === 'IMG') { relevant = true; break; }
        for (const node of record.addedNodes || []) {
          if (node?.nodeType === 1 && (node.id === STAGE_ID || node.matches?.(`#${STAGE_ID} img`) || node.querySelector?.(`#${STAGE_ID} img`))) { relevant = true; break; }
        }
        if (relevant) break;
      }
      if (relevant) scheduleRepairV494();
    }).observe(document.documentElement, { childList:true, subtree:true, attributes:true, attributeFilter:['src','style','class'] });
  } catch {}

  window.__loggyRepairDecorationImagesV494 = repairStageV494;
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => scheduleRepairV494(), { once:true });
  else scheduleRepairV494();
})();
