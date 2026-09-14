// V102 — AUTHORITATIVE THEME LIBRARY / BUILT-IN EDITS / FAST BACKGROUNDS
// ============================================================
(function () {
    const BUILT_IN_OVERRIDE_KEY_V102 = 'loggy-built-in-theme-overrides-v102';
    const PREWARMED_BACKGROUNDS_V102 = new Map();

    const isDashboardStudioV102 = (() => {
        try {
            return new URLSearchParams(window.location.search).get('dashboardThemeStudio') === '1';
        } catch {
            return false;
        }
    })();

    function readBuiltInThemeOverridesV102() {
        try {
            const parsed = JSON.parse(
                localStorage.getItem(BUILT_IN_OVERRIDE_KEY_V102) || '{}'
            );
            return parsed && typeof parsed === 'object' && !Array.isArray(parsed)
                ? parsed
                : {};
        } catch {
            return {};
        }
    }

    function writeBuiltInThemeOverridesV102(overrides, mirror = true) {
        const clean =
            overrides && typeof overrides === 'object' && !Array.isArray(overrides)
                ? overrides
                : {};

        try {
            localStorage.setItem(
                BUILT_IN_OVERRIDE_KEY_V102,
                JSON.stringify(clean)
            );
        } catch {}

        if (mirror) {
            fetch('/api/built-in-theme-overrides', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ overrides: clean })
            }).catch(() => {});
        }

        return clean;
    }

    async function hydrateBuiltInThemeOverridesV102() {
        const local = readBuiltInThemeOverridesV102();
        let remote = {};
        let initialized = false;

        try {
            const response = await fetch('/api/built-in-theme-overrides', {
                method: 'GET',
                cache: 'no-store'
            });
            if (response.ok) {
                const result = await response.json().catch(() => ({}));
                remote =
                    result?.overrides &&
                    typeof result.overrides === 'object' &&
                    !Array.isArray(result.overrides)
                        ? result.overrides
                        : {};
                initialized = result?.initialized === true;
            }
        } catch {}

        // Same rule as the shared custom-theme library: after migration the
        // project copy is authoritative so an old browser cannot resurrect data.
        const chosen = initialized ? remote : local;
        writeBuiltInThemeOverridesV102(chosen, !initialized);

        if (!isDashboardStudioV102) {
            requestAnimationFrame(() => {
                try { renderThemePicker(); } catch {}
            });
        }

        return chosen;
    }

    // A global built-in override keeps the ORIGINAL built-in ID. That means a
    // rename/edit changes the existing card rather than creating a custom copy.
    try {
        const getThemeOverrideBeforeV102 = getThemeOverrideV25;
        getThemeOverrideV25 = function (themeId) {
            const localOverride = getThemeOverrideBeforeV102(themeId);
            if (localOverride) return localOverride;

            const globalEntry = readBuiltInThemeOverridesV102()[String(themeId || '')];
            return globalEntry?.theme || null;
        };
    } catch {}

    // Dashboard Theme Studio: editing a built-in writes an override under that
    // exact built-in ID. Shared/custom themes still use the existing save path.
    try {
        const saveDashboardThemeStudioBeforeV102 = saveDashboardThemeStudioV43;
        saveDashboardThemeStudioV43 = async function (modal, applyAfterSave) {
            const requestedId = String(getDashboardThemeStudioIdV43?.() || '');
            const action = String(getDashboardThemeStudioActionV43?.() || 'create');
            const shared = (() => {
                try {
                    return readSharedThemeLibraryForStudioV43()
                        .some(item => String(item?.id || '') === requestedId);
                } catch {
                    return false;
                }
            })();

            const editingBuiltIn =
                action === 'edit' &&
                !!requestedId &&
                !shared &&
                !requestedId.startsWith('theme-custom-builder');

            if (!editingBuiltIn) {
                return saveDashboardThemeStudioBeforeV102.apply(this, arguments);
            }

            if (
                !modal ||
                !validateThemeBuilderBeforeSaveV25(modal)
            ) {
                return;
            }

            ensureChosenThemeAccessoriesEnabledV46?.(modal);

            const draft = getThemeBuilderDraft(modal);
            const name = String(
                draft?.name ||
                requestedId.replace(/^theme-/, '').replace(/[-_]+/g, ' ') ||
                'Theme'
            ).trim() || 'Theme';

            const themeData = cloneThemeDataV30({
                ...draft,
                name
            });

            const overrides = readBuiltInThemeOverridesV102();
            overrides[requestedId] = {
                id: requestedId,
                name,
                theme: themeData,
                updatedAt: new Date().toISOString()
            };

            // Local write is immediate so the parent Dashboard sees the rename
            // before the Theme Studio closes. Server mirroring happens async.
            writeBuiltInThemeOverridesV102(overrides, true);

            modal._themeEditSavedV25 = true;

            window.parent?.postMessage(
                {
                    type: 'dashboard-theme-studio-saved-v43',
                    themeId: requestedId,
                    apply: !!applyAfterSave,
                    builtInOverrideV102: true
                },
                window.location.origin
            );
        };
    } catch {}

    // The internal Theme Studio host is not a real log and must never publish
    // its temporary/legacy "My Custom Theme" state into the user's library.
    // That was one source of random custom-theme cards appearing by themselves.
    if (isDashboardStudioV102) {
        try {
            publishCurrentLogThemesV40 = function () {};
        } catch {}

        // The hidden host has no visible Theme Settings picker. Avoid rebuilding
        // it while Create/Edit is opening; those rebuilds can be very expensive.
        try {
            renderThemePicker = function () {};
        } catch {}
    }

    function prewarmThemeBackgroundV102(url, priority = 'low') {
        const source = String(url || '').trim();
        if (!source || source === 'none' || PREWARMED_BACKGROUNDS_V102.has(source)) {
            return;
        }

        try {
            const image = new Image();
            image.decoding = 'async';
            try { image.fetchPriority = priority; } catch {}
            PREWARMED_BACKGROUNDS_V102.set(source, image);
            image.onload = () => {
                try { image.decode?.().catch?.(() => {}); } catch {}
            };
            image.onerror = () => {
                PREWARMED_BACKGROUNDS_V102.delete(source);
            };
            image.src = source;
        } catch {}
    }

    function prewarmSharedThemeBackgroundsV102() {
        let library = [];
        try { library = readSharedThemeLibraryV40(); } catch {}

        const active = String(db?.settings?.theme || '');
        library.forEach(entry => {
            const url = entry?.theme?.backgroundImage;
            if (!url) return;
            prewarmThemeBackgroundV102(
                url,
                String(entry?.id || '') === active ? 'high' : 'low'
            );
        });

        try {
            const custom = getCustomThemeSettings?.();
            if (custom?.backgroundImage) {
                prewarmThemeBackgroundV102(custom.backgroundImage, 'high');
            }
        } catch {}
    }

    // Start the image request before the large custom-theme style/runtime chain.
    try {
        const applyCustomBuiltThemeBeforeV102 = applyCustomBuiltTheme;
        applyCustomBuiltTheme = function (theme = getCustomThemeSettings()) {
            if (theme?.backgroundImage) {
                prewarmThemeBackgroundV102(theme.backgroundImage, 'high');
            }
            return applyCustomBuiltThemeBeforeV102.apply(this, arguments);
        };
    } catch {}

    requestAnimationFrame(prewarmSharedThemeBackgroundsV102);
    setTimeout(prewarmSharedThemeBackgroundsV102, 250);
    hydrateBuiltInThemeOverridesV102();
})();

// ============================================================
// V103 — DELAYED EDIT-THEME LOADING INDICATOR
// ============================================================
(function () {
    const LOADER_DELAY_V103 = 140;
    let loaderTokenV103 = 0;

    function ensureThemeEditLoaderV103() {
        let loader = document.getElementById('theme-edit-loader-v103');
        if (loader) return loader;

        loader = document.createElement('div');
        loader.id = 'theme-edit-loader-v103';
        loader.className = 'theme-edit-loader-v103';
        loader.setAttribute('aria-hidden', 'true');
        loader.innerHTML = '<span class="theme-edit-loader-spinner-v103"></span>';
        document.body.appendChild(loader);
        return loader;
    }

    function beginThemeEditLoadingV103() {
        const token = ++loaderTokenV103;
        const loader = ensureThemeEditLoaderV103();
        loader.classList.remove('is-visible-v103');

        const timer = setTimeout(() => {
            if (token !== loaderTokenV103) return;
            loader.classList.add('is-visible-v103');
            loader.setAttribute('aria-hidden', 'false');
        }, LOADER_DELAY_V103);

        return () => {
            if (token !== loaderTokenV103) return;
            clearTimeout(timer);
            loaderTokenV103 += 1;
            loader.classList.remove('is-visible-v103');
            loader.setAttribute('aria-hidden', 'true');
        };
    }

    async function runThemeEditWithLoaderV103(fn, thisArg, args) {
        const finish = beginThemeEditLoadingV103();
        try {
            const result = fn.apply(thisArg, args);
            if (result && typeof result.then === 'function') {
                return await result;
            }
            return result;
        } finally {
            // Give the modal one paint before removing the spinner so there is
            // never a blank frame between loading and the Theme Builder.
            requestAnimationFrame(() => requestAnimationFrame(finish));
        }
    }

    function wrapThemeEditOpenerV103(name) {
        try {
            const original = window[name] || eval(name);
            if (typeof original !== 'function' || original._themeEditLoaderWrappedV103) return;

            const wrapped = function (...args) {
                return runThemeEditWithLoaderV103(original, this, args);
            };
            wrapped._themeEditLoaderWrappedV103 = true;

            try { window[name] = wrapped; } catch {}
            try { eval(`${name} = wrapped`); } catch {}
        } catch {}
    }

    [
        'openAnyThemeInBuilderV25',
        'openThemeCopyInBuilderV30',
        'openExistingCustomThemeFromPickerV7',
        'openDashboardSharedThemeInStudioV43',
        'openThemeCopyInBuilderV30'
    ].forEach(wrapThemeEditOpenerV103);
})();

/* ============================================================
   THEME BUILDER V105 — KB SETTINGS CATEGORY BAR CONTROLS BELONG IN BUILDER
   ============================================================ */
(function(){
    const KB_SETTINGS_THEME_FIELDS_V105 = {
        kbSettingsCategoryNormalBorderV105: '#171717',
        kbSettingsCategoryNormalTextV105: '#171717',
        kbSettingsCategoryHoverBorderV105: '#7c3aed',
        kbSettingsCategoryHoverTextV105: '#171717',
        kbSettingsCategorySelectedBorderV105: '#171717',
        kbSettingsCategorySelectedTextV105: '#171717',
        kbSettingsCategoryShadowSizeV105: 0
    };

    function valueV105(theme, key) {
        if (theme && theme[key] != null && theme[key] !== '') return theme[key];
        try {
            const old = db?.settings?.knowledgeSettingsCategoryStyleV99 || {};
            const map = {
                kbSettingsCategoryNormalBorderV105: 'normalBorder',
                kbSettingsCategoryNormalTextV105: 'normalText',
                kbSettingsCategoryHoverBorderV105: 'hoverBorder',
                kbSettingsCategoryHoverTextV105: 'hoverText',
                kbSettingsCategorySelectedBorderV105: 'selectedBorder',
                kbSettingsCategorySelectedTextV105: 'selectedText',
                kbSettingsCategoryShadowSizeV105: 'shadowSize'
            };
            const legacy = old[map[key]];
            if (legacy != null && legacy !== '') return legacy;
        } catch {}
        return KB_SETTINGS_THEME_FIELDS_V105[key];
    }

    function applyVarsV105(target, theme = {}) {
        if (!target?.style) return;
        const shadow = Math.max(0, Math.min(12, Number(valueV105(theme, 'kbSettingsCategoryShadowSizeV105')) || 0));
        const vars = {
            '--kb-settings-category-normal-border-v99': valueV105(theme, 'kbSettingsCategoryNormalBorderV105'),
            '--kb-settings-category-normal-text-v99': valueV105(theme, 'kbSettingsCategoryNormalTextV105'),
            '--kb-settings-category-hover-border-v99': valueV105(theme, 'kbSettingsCategoryHoverBorderV105'),
            '--kb-settings-category-hover-text-v99': valueV105(theme, 'kbSettingsCategoryHoverTextV105'),
            '--kb-settings-category-selected-border-v99': valueV105(theme, 'kbSettingsCategorySelectedBorderV105'),
            '--kb-settings-category-selected-text-v99': valueV105(theme, 'kbSettingsCategorySelectedTextV105'),
            '--kb-settings-category-shadow-v99': `${shadow}px`
        };
        Object.entries(vars).forEach(([name, value]) => target.style.setProperty(name, value));
    }

    function removeWrongSettingsControlsV105() {
        document.getElementById('kb-settings-category-style-v99')?.remove();
    }

    // V99 accidentally put these appearance controls inside the Knowledge Base
    // Settings modal. They are theme appearance controls, so keep that modal clean.
    try {
        ensureKnowledgeSettingsCategoryStyleControlsV99 = function(){
            removeWrongSettingsControlsV105();
        };
    } catch {}

    try {
        const renderSettingsBeforeV105 = renderSettings;
        renderSettings = function(...args){
            const result = renderSettingsBeforeV105.apply(this, args);
            removeWrongSettingsControlsV105();
            return result;
        };
    } catch {}

    function ensureBuilderControlsV105(modal, theme = {}) {
        const section = modal?.querySelector('.theme-builder-kb-category-controls-v12');
        if (!section) return;

        const host = section.querySelector('.theme-builder-accordion-body') || section;
        let panel = section.querySelector('.theme-builder-kb-settings-category-v105');
        if (!panel) {
            panel = document.createElement('div');
            panel.className = 'theme-builder-kb-settings-category-v105';
            panel.innerHTML = `
                <div class="theme-builder-kb-settings-category-heading-v105">
                    <strong>Knowledge Base Settings Category Bar</strong>
                    <small>Border-first category buttons used inside the Knowledge Base Settings modal.</small>
                </div>
                <div class="theme-builder-color-grid theme-builder-kb-settings-category-grid-v105">
                    ${themeBuilderField('Normal Border', 'kbSettingsCategoryNormalBorderV105', valueV105(theme, 'kbSettingsCategoryNormalBorderV105'))}
                    ${themeBuilderField('Normal Text', 'kbSettingsCategoryNormalTextV105', valueV105(theme, 'kbSettingsCategoryNormalTextV105'))}
                    ${themeBuilderField('Hover Border', 'kbSettingsCategoryHoverBorderV105', valueV105(theme, 'kbSettingsCategoryHoverBorderV105'))}
                    ${themeBuilderField('Hover Text', 'kbSettingsCategoryHoverTextV105', valueV105(theme, 'kbSettingsCategoryHoverTextV105'))}
                    ${themeBuilderField('Selected / Focused Border', 'kbSettingsCategorySelectedBorderV105', valueV105(theme, 'kbSettingsCategorySelectedBorderV105'))}
                    ${themeBuilderField('Selected / Focused Text', 'kbSettingsCategorySelectedTextV105', valueV105(theme, 'kbSettingsCategorySelectedTextV105'))}
                    ${themeBuilderField('Shadow Size', 'kbSettingsCategoryShadowSizeV105', valueV105(theme, 'kbSettingsCategoryShadowSizeV105'), 'range')}
                </div>
            `;
            host.appendChild(panel);

            [
                'kbSettingsCategoryNormalBorderV105',
                'kbSettingsCategoryNormalTextV105',
                'kbSettingsCategoryHoverBorderV105',
                'kbSettingsCategoryHoverTextV105',
                'kbSettingsCategorySelectedBorderV105',
                'kbSettingsCategorySelectedTextV105'
            ].forEach(key => {
                try { bindThemeBuilderColorFieldV12(modal, key); } catch {}
            });

            const range = panel.querySelector('[data-theme-key="kbSettingsCategoryShadowSizeV105"]');
            range?.addEventListener('input', () => {
                const out = panel.querySelector('[data-theme-output="kbSettingsCategoryShadowSizeV105"]');
                if (out) out.textContent = range.value;
                try { updateThemeBuilderPreview(modal); } catch {}
            });
        }

        Object.keys(KB_SETTINGS_THEME_FIELDS_V105).forEach(key => {
            const v = valueV105(theme, key);
            const input = panel.querySelector(`[data-theme-key="${key}"]`);
            const hex = panel.querySelector(`[data-theme-hex="${key}"]`);
            const out = panel.querySelector(`[data-theme-output="${key}"]`);
            if (input && document.activeElement !== input) input.value = String(v);
            if (hex && document.activeElement !== hex) hex.value = String(v).toUpperCase();
            if (out) out.textContent = String(v);
        });
    }

    // Add the controls every time the Category Bars section is created/rebuilt.
    try {
        const ensureKBCategoryBeforeV105 = ensureThemeBuilderKnowledgeCategoryControlsV12;
        ensureThemeBuilderKnowledgeCategoryControlsV12 = function(modal, theme){
            const result = ensureKBCategoryBeforeV105.apply(this, arguments);
            ensureBuilderControlsV105(modal, theme || {});
            return result;
        };
    } catch {}

    try {
        const populateBeforeV105 = populateThemeBuilder;
        populateThemeBuilder = function(modal, theme = {}){
            const result = populateBeforeV105.apply(this, arguments);
            ensureBuilderControlsV105(modal, theme);
            applyVarsV105(modal, theme);
            requestAnimationFrame(() => ensureBuilderControlsV105(modal, theme));
            return result;
        };
    } catch {}

    try {
        const draftBeforeV105 = getThemeBuilderDraft;
        getThemeBuilderDraft = function(modal){
            const draft = draftBeforeV105.apply(this, arguments) || {};
            const section = modal?.querySelector('.theme-builder-kb-settings-category-v105');
            if (section) {
                Object.keys(KB_SETTINGS_THEME_FIELDS_V105).forEach(key => {
                    const input = section.querySelector(`[data-theme-key="${key}"]`);
                    if (!input) return;
                    draft[key] = key === 'kbSettingsCategoryShadowSizeV105'
                        ? Math.max(0, Math.min(12, Number(input.value) || 0))
                        : input.value;
                });
            }
            return draft;
        };
    } catch {}

    try {
        const previewBeforeV105 = updateThemeBuilderPreview;
        updateThemeBuilderPreview = function(modal){
            let draft = {};
            try { draft = getThemeBuilderDraft(modal); } catch {}
            applyVarsV105(modal, draft);
            const result = previewBeforeV105.apply(this, arguments);
            requestAnimationFrame(() => applyVarsV105(modal, draft));
            return result;
        };
    } catch {}

    // Apply the saved per-theme values to the actual Knowledge Base Settings modal.
    try {
        const applyBuiltBeforeV105 = applyCustomBuiltTheme;
        applyCustomBuiltTheme = function(theme = getCustomThemeSettings()){
            const result = applyBuiltBeforeV105.apply(this, arguments);
            applyVarsV105(document.documentElement, theme || {});
            return result;
        };
    } catch {}

    try {
        const clearBuiltBeforeV105 = clearCustomBuiltTheme;
        clearCustomBuiltTheme = function(){
            const result = clearBuiltBeforeV105.apply(this, arguments);
            [
                '--kb-settings-category-normal-border-v99',
                '--kb-settings-category-normal-text-v99',
                '--kb-settings-category-hover-border-v99',
                '--kb-settings-category-hover-text-v99',
                '--kb-settings-category-selected-border-v99',
                '--kb-settings-category-selected-text-v99',
                '--kb-settings-category-shadow-v99'
            ].forEach(name => document.documentElement.style.removeProperty(name));
            return result;
        };
    } catch {}

    removeWrongSettingsControlsV105();
    requestAnimationFrame(() => {
        removeWrongSettingsControlsV105();
        const modal = document.getElementById('theme-builder-modal');
        if (modal) {
            let draft = {};
            try { draft = getThemeBuilderDraft(modal); } catch {}
            ensureBuilderControlsV105(modal, draft);
            applyVarsV105(modal, draft);
        }
    });
})();

// ============================================================
// V106 — FAST THEME EDIT OPENING / PREWARMED DASHBOARD STUDIO
// ============================================================
(function () {
    let fastOpenDepthV106 = 0;
    let pendingPreviewV106 = false;
    let pendingSvgListV106 = false;
    let pendingRebuildV106 = false;
    let lastFastModalV106 = null;

    const updateThemeBuilderPreviewBeforeV106 =
        typeof updateThemeBuilderPreview === 'function'
            ? updateThemeBuilderPreview
            : null;

    const renderThemeBuilderSvgListBeforeV106 =
        typeof renderThemeBuilderSvgListV2 === 'function'
            ? renderThemeBuilderSvgListV2
            : null;

    const rebuildActualThemeBuilderPreviewBeforeV106 =
        typeof rebuildActualThemeBuilderPreviewV5 === 'function'
            ? rebuildActualThemeBuilderPreviewV5
            : null;

    if (updateThemeBuilderPreviewBeforeV106) {
        updateThemeBuilderPreview = function (modal) {
            if (fastOpenDepthV106 > 0 || modal?._themeBuilderFastOpenV106) {
                pendingPreviewV106 = true;
                if (modal) lastFastModalV106 = modal;
                return;
            }
            return updateThemeBuilderPreviewBeforeV106.apply(this, arguments);
        };
    }

    if (renderThemeBuilderSvgListBeforeV106) {
        renderThemeBuilderSvgListV2 = function (modal) {
            if (fastOpenDepthV106 > 0 || modal?._themeBuilderFastOpenV106) {
                pendingSvgListV106 = true;
                if (modal) lastFastModalV106 = modal;
                return;
            }
            return renderThemeBuilderSvgListBeforeV106.apply(this, arguments);
        };
    }

    if (rebuildActualThemeBuilderPreviewBeforeV106) {
        rebuildActualThemeBuilderPreviewV5 = function (modal) {
            if (fastOpenDepthV106 > 0 || modal?._themeBuilderFastOpenV106) {
                pendingRebuildV106 = true;
                if (modal) lastFastModalV106 = modal;
                return;
            }
            return rebuildActualThemeBuilderPreviewBeforeV106.apply(this, arguments);
        };
    }

    function flushFastOpenV106(modal) {
        const target = modal || lastFastModalV106 || document.getElementById('theme-builder-modal');
        if (!target) return;

        const needSvg = pendingSvgListV106;
        const needPreview = pendingPreviewV106;
        const needRebuild = pendingRebuildV106;
        pendingSvgListV106 = false;
        pendingPreviewV106 = false;
        pendingRebuildV106 = false;
        lastFastModalV106 = null;

        // Let the Theme Builder itself paint first. The expensive artwork list
        // and cloned preview are then built once, rather than repeatedly while
        // every control is being hydrated.
        requestAnimationFrame(() => {
            setTimeout(() => {
                try {
                    if (needSvg && renderThemeBuilderSvgListBeforeV106) {
                        renderThemeBuilderSvgListBeforeV106.call(this, target);
                    }
                } catch {}

                try {
                    if (needRebuild && rebuildActualThemeBuilderPreviewBeforeV106) {
                        rebuildActualThemeBuilderPreviewBeforeV106.call(this, target);
                    }
                } catch {}

                try {
                    if ((needPreview || needSvg || needRebuild) && updateThemeBuilderPreviewBeforeV106) {
                        updateThemeBuilderPreviewBeforeV106.call(this, target);
                    }
                } catch {}
            }, 0);
        });
    }

    async function runFastThemeOpenV106(original, thisArg, args) {
        fastOpenDepthV106 += 1;
        let modal = null;
        try {
            modal = document.getElementById('theme-builder-modal');
            if (!modal && typeof ensureThemeBuilderModal === 'function') {
                modal = ensureThemeBuilderModal();
            }
            if (modal) {
                modal._themeBuilderFastOpenV106 = true;
                lastFastModalV106 = modal;
            }

            const result = original.apply(thisArg, args);
            return result && typeof result.then === 'function'
                ? await result
                : result;
        } finally {
            fastOpenDepthV106 = Math.max(0, fastOpenDepthV106 - 1);
            if (fastOpenDepthV106 === 0) {
                const target = modal || lastFastModalV106 || document.getElementById('theme-builder-modal');
                if (target) target._themeBuilderFastOpenV106 = false;
                flushFastOpenV106(target);
            }
        }
    }

    function wrapFastThemeOpenerV106(name) {
        try {
            const original = window[name] || eval(name);
            if (typeof original !== 'function' || original._themeFastOpenWrappedV106) return;

            const wrapped = function (...args) {
                return runFastThemeOpenV106(original, this, args);
            };
            wrapped._themeFastOpenWrappedV106 = true;

            try { window[name] = wrapped; } catch {}
            try { eval(`${name} = wrapped`); } catch {}
        } catch {}
    }

    [
        'openAnyThemeInBuilderV25',
        'openThemeCopyInBuilderV30',
        'openExistingCustomThemeFromPickerV7',
        'openNewThemeBuilderCleanV34',
        'openDashboardSharedThemeInStudioV43'
    ].forEach(wrapFastThemeOpenerV106);

    // Build the huge Theme Builder DOM while the browser is idle instead of
    // making the user's Edit Theme click pay that cost.
    function prebuildThemeBuilderV106() {
        try {
            if (document.getElementById('theme-builder-modal')) return;
            if (typeof ensureThemeBuilderModal !== 'function') return;
            const modal = ensureThemeBuilderModal();
            modal?.classList.add('hidden');
        } catch {}
    }

    // V306: the rewritten Theme Builder owns its own DOM and opens instantly.
    // Do not prebuild the retired historical #theme-builder-modal.

    // Dashboard Theme Studio can stay loaded in a hidden iframe. Commands from
    // the Dashboard reuse this already-parsed 3MB runtime instead of navigating
    // and parsing the entire app again on every Edit Theme click.
    let dashboardStudioReadyPromiseV106 = null;

    function isDashboardStudioV106() {
        try {
            return new URLSearchParams(location.search).get('dashboardThemeStudio') === '1';
        } catch {
            return false;
        }
    }


    function isFreshDashboardCreateV283() {
        try {
            const params = new URLSearchParams(location.search);
            // V300 FIX (bug 4): this used to only recognize the older
            // freshCreateV283/dashboardThemeAction=create signal. The current
            // dashboard owner (dashboard.html's openDashboardThemeStudioV43)
            // never sends that pair -- it sends studioV300=1 instead -- so this
            // guard was always false for every real studio-host load, meaning
            // the dead V106 command listener below always armed itself: it
            // polled every 35ms for up to ~5.6s waiting for globals that were
            // already present, and its 'command-v106' message is never sent by
            // dashboard.html (verified: only the V300 postMessage protocol is
            // used today), so all of that polling and listening was pure
            // waste on every single Theme Builder open from the Dashboard.
            if (params.get('studioV300') === '1') return true;
            return params.get('freshCreateV283') === '1' && params.get('dashboardThemeAction') === 'create';
        } catch {
            return false;
        }
    }

    function waitForDashboardStudioRuntimeV106() {
        if (dashboardStudioReadyPromiseV106) return dashboardStudioReadyPromiseV106;
        dashboardStudioReadyPromiseV106 = (async () => {
            for (let i = 0; i < 160; i += 1) {
                if (
                    typeof ensureThemeBuilderModal === 'function' &&
                    typeof openNewThemeBuilderCleanV34 === 'function' &&
                    typeof openAnyThemeInBuilderV25 === 'function' &&
                    db?.settings
                ) {
                    prebuildThemeBuilderV106();
                    return true;
                }
                await new Promise(resolve => setTimeout(resolve, 35));
            }
            return false;
        })();
        return dashboardStudioReadyPromiseV106;
    }

    function showImmediateStudioLoaderV106() {
        try {
            document.body.classList.add(
                'dashboard-theme-studio-host-v43',
                'dashboard-theme-studio-host-v69'
            );
            let loader = document.getElementById('theme-edit-loader-v103');
            if (!loader) {
                loader = document.createElement('div');
                loader.id = 'theme-edit-loader-v103';
                loader.className = 'theme-edit-loader-v103';
                loader.innerHTML = '<span class="theme-edit-loader-spinner-v103"></span>';
                document.body.appendChild(loader);
            }
            loader.classList.add('is-visible-v103');
            loader.setAttribute('aria-hidden', 'false');
        } catch {}
    }

    function hideImmediateStudioLoaderV106() {
        try {
            const loader = document.getElementById('theme-edit-loader-v103');
            loader?.classList.remove('is-visible-v103');
            loader?.setAttribute('aria-hidden', 'true');
        } catch {}
    }

    async function runDashboardStudioCommandV106(action, themeId) {
        await waitForDashboardStudioRuntimeV106();
        window._returnDashboardAfterThemeSaveV40 = false;

        if (action === 'create') {
            return openNewThemeBuilderCleanV34();
        }

        if (action === 'edit') {
            try {
                if (typeof openDashboardSharedThemeInStudioV43 === 'function') {
                    const opened = await openDashboardSharedThemeInStudioV43(themeId);
                    if (opened) return true;
                }
            } catch {}

            try {
                const copy = typeof getThemeCopyV30 === 'function'
                    ? getThemeCopyV30(themeId)
                    : null;
                if (copy && typeof openThemeCopyInBuilderV30 === 'function') {
                    await openThemeCopyInBuilderV30(themeId);
                    return true;
                }
            } catch {}

            if (themeId === 'theme-custom-builder') {
                return openExistingCustomThemeFromPickerV7();
            }

            return openAnyThemeInBuilderV25(
                themeId,
                typeof getThemeDisplayNameV30 === 'function'
                    ? getThemeDisplayNameV30(themeId)
                    : themeId
            );
        }

        if (action === 'duplicate') {
            try {
                const shared = typeof readSharedThemeLibraryForStudioV43 === 'function'
                    ? readSharedThemeLibraryForStudioV43().find(item => item.id === themeId)
                    : null;
                if (shared?.theme && typeof saveSharedThemeFromStudioV43 === 'function') {
                    const copy = {
                        ...shared,
                        id: typeof makeDashboardStudioThemeIdV43 === 'function'
                            ? makeDashboardStudioThemeIdV43()
                            : `theme-custom-${Date.now()}`,
                        name: `${shared.name || 'Theme'} Copy`,
                        theme: {
                            ...(typeof cloneThemeDataV30 === 'function'
                                ? cloneThemeDataV30(shared.theme)
                                : structuredClone(shared.theme)),
                            name: `${shared.name || 'Theme'} Copy`
                        },
                        updatedAt: new Date().toISOString()
                    };
                    saveSharedThemeFromStudioV43(copy);
                    window.parent?.postMessage({
                        type: 'dashboard-theme-studio-saved-v43',
                        themeId: copy.id,
                        apply: false
                    }, window.location.origin);
                    return true;
                }
            } catch {}

            try {
                if (typeof duplicateThemeV30 === 'function') {
                    await duplicateThemeV30(
                        themeId,
                        typeof getThemeDisplayNameV30 === 'function'
                            ? getThemeDisplayNameV30(themeId)
                            : themeId
                    );
                    if (typeof publishCurrentLogThemesV40 === 'function') {
                        publishCurrentLogThemesV40();
                    }
                    return true;
                }
            } catch {}
        }

        return false;
    }

    if (isDashboardStudioV106() && !isFreshDashboardCreateV283()) {
        waitForDashboardStudioRuntimeV106().then(() => {
            window.parent?.postMessage({
                type: 'dashboard-theme-studio-host-ready-v106'
            }, window.location.origin);
        });

        window.addEventListener('message', async event => {
            if (event.origin !== window.location.origin) return;

            if (event.data?.type === 'dashboard-theme-studio-hide-v106') {
                try {
                    document.getElementById('theme-builder-modal')?.classList.add('hidden');
                } catch {}
                hideImmediateStudioLoaderV106();
                return;
            }

            if (event.data?.type !== 'dashboard-theme-studio-command-v106') return;

            const action = String(event.data.action || 'create');
            const themeId = String(event.data.themeId || '');

            showImmediateStudioLoaderV106();

            // Make the already-loaded iframe visible immediately. The spinner
            // paints before expensive theme hydration starts.
            window.parent?.postMessage({
                type: 'dashboard-theme-studio-ready-v69'
            }, window.location.origin);

            await new Promise(resolve => requestAnimationFrame(() => resolve()));

            try {
                await runDashboardStudioCommandV106(action, themeId);
            } finally {
                hideImmediateStudioLoaderV106();
                try {
                    document.getElementById('theme-builder-modal')?.classList.remove('hidden');
                } catch {}
                window.parent?.postMessage({
                    type: 'dashboard-theme-studio-ready-v69'
                }, window.location.origin);
            }
        });
    }
})();

// ============================================================
// V107 — LOG ICON BACKGROUND + CLEAN DASHBOARD CATEGORY UI
//        + AUTOMATIC COLOR DISTRIBUTOR
// ============================================================
(function(){
    const LOG_BG_KEY_V107 = 'dashboardLogIconBackgroundV107';
    const LEGACY_DASH_CATEGORY_KEYS_V107 = new Set([
        'dashboardCategorySelectedColorV85',
        'dashboardCategoryHoverColorV85'
    ]);

    function validHexV107(value, fallback = '#777777') {
        const text = String(value || '').trim();
        return /^#[0-9a-f]{6}$/i.test(text) ? text : fallback;
    }

    function mainColorsSectionV107(modal) {
        return Array.from(modal?.querySelectorAll('.theme-builder-control-section') || []).find(section => {
            const title = section.querySelector('.theme-builder-accordion-name, .theme-builder-control-heading strong')?.textContent?.trim();
            if (title === 'Main Colors') return true;
            const grid = section.querySelector('.theme-builder-color-grid:not(.theme-builder-nav-color-grid):not(.theme-builder-dashboard-color-grid-v42):not(.theme-builder-kb-category-color-grid-v12):not(.theme-builder-kb-settings-category-grid-v105)');
            return !!grid;
        }) || null;
    }

    function dashboardColorsSectionV107(modal) {
        return modal?.querySelector('.theme-builder-dashboard-colors-v42, .theme-builder-dashboard-colors-v40') || null;
    }

    function removeLegacyCategoryDuplicatesV107(modal) {
        try {
            if (Array.isArray(DASHBOARD_COLOR_FIELDS_V85)) {
                for (let i = DASHBOARD_COLOR_FIELDS_V85.length - 1; i >= 0; i--) {
                    if (LEGACY_DASH_CATEGORY_KEYS_V107.has(DASHBOARD_COLOR_FIELDS_V85[i]?.[1])) {
                        DASHBOARD_COLOR_FIELDS_V85.splice(i, 1);
                    }
                }
            }
        } catch {}

        LEGACY_DASH_CATEGORY_KEYS_V107.forEach(key => {
            modal?.querySelectorAll(`[data-theme-key="${CSS.escape(key)}"], [data-theme-hex="${CSS.escape(key)}"]`).forEach(control => {
                const field = control.closest('.theme-builder-field');
                if (field) field.remove();
                else control.remove();
            });
        });
    }

    function ensureLogIconBackgroundV107(modal, theme = {}) {
        const section = dashboardColorsSectionV107(modal);
        const grid = section?.querySelector('.theme-builder-dashboard-color-grid-v42, .theme-builder-color-grid');
        if (!grid) return;

        let picker = grid.querySelector(`input[type="color"][data-theme-key="${LOG_BG_KEY_V107}"]`);
        const fallback = validHexV107(
            theme?.[LOG_BG_KEY_V107],
            validHexV107(theme?.dashboardCardV40, '#ffffff')
        );

        if (!picker) {
            const categoryGroup = grid.querySelector('.theme-builder-dashboard-category-group-v98');
            const holder = document.createElement('div');
            holder.innerHTML = themeBuilderField('Log Page Icon Background', LOG_BG_KEY_V107, fallback);
            const field = holder.firstElementChild;
            if (categoryGroup) grid.insertBefore(field, categoryGroup);
            else grid.appendChild(field);
            picker = field?.querySelector(`input[type="color"][data-theme-key="${LOG_BG_KEY_V107}"]`);
            try { bindThemeBuilderColorFieldV12(modal, LOG_BG_KEY_V107); } catch {}
        }

        const hex = grid.querySelector(`[data-theme-hex="${LOG_BG_KEY_V107}"]`);
        if (picker && document.activeElement !== picker) picker.value = fallback;
        if (hex && document.activeElement !== hex) hex.value = fallback;
    }

    function readColorV107(modal, key, fallback) {
        const picker = modal?.querySelector(`input[type="color"][data-theme-key="${CSS.escape(key)}"]`);
        const hex = modal?.querySelector(`[data-theme-hex="${CSS.escape(key)}"]`);
        return validHexV107(hex?.value, validHexV107(picker?.value, fallback));
    }

    function setColorV107(modal, key, value) {
        const color = validHexV107(value, '#777777');
        const picker = modal?.querySelector(`input[type="color"][data-theme-key="${CSS.escape(key)}"]`);
        const hex = modal?.querySelector(`[data-theme-hex="${CSS.escape(key)}"]`);
        if (picker) picker.value = color;
        if (hex) hex.value = color;
        if (modal?._dashboardColorStateV85 && key in modal._dashboardColorStateV85) {
            modal._dashboardColorStateV85[key] = color;
        }
    }

    function syncLogIconBackgroundPreviewV107(modal) {
        const preview = modal?.querySelector('.theme-builder-dashboard-preview-v45');
        if (!preview) return;
        const fallback = readColorV107(modal, 'dashboardCardV40', '#ffffff');
        preview.style.setProperty('--tb-dashboard-log-bg-v107', readColorV107(modal, LOG_BG_KEY_V107, fallback));
    }

    function hexToRgbV107(hex) {
        const text = validHexV107(hex, '#777777').slice(1);
        return [parseInt(text.slice(0,2),16), parseInt(text.slice(2,4),16), parseInt(text.slice(4,6),16)];
    }

    function rgbToHexV107(rgb) {
        return '#' + rgb.map(value => Math.max(0, Math.min(255, Math.round(value))).toString(16).padStart(2,'0')).join('');
    }

    function mixV107(a, b, amount) {
        const x = hexToRgbV107(a), y = hexToRgbV107(b);
        const t = Math.max(0, Math.min(1, Number(amount) || 0));
        return rgbToHexV107(x.map((value, index) => value + (y[index] - value) * t));
    }

    function readableV107(color) {
        const [r,g,b] = hexToRgbV107(color).map(v => v / 255);
        const lum = 0.2126*r + 0.7152*g + 0.0722*b;
        return lum > .58 ? '#171717' : '#ffffff';
    }

    function paletteV107(seed) {
        const main = validHexV107(seed, '#8b6fd8');
        return {
            main,
            page: mixV107(main, '#ffffff', .94),
            surface: mixV107(main, '#ffffff', .88),
            surface2: mixV107(main, '#ffffff', .78),
            border: mixV107(main, '#ffffff', .58),
            hover: mixV107(main, '#ffffff', .66),
            selected: mixV107(main, '#000000', .43),
            dark: mixV107(main, '#000000', .68),
            muted: mixV107(main, '#000000', .40)
        };
    }

    function fieldLabelV107(picker) {
        return picker?.closest('.theme-builder-field')?.querySelector(':scope > span')?.textContent?.trim() || '';
    }

    function valueForFieldV107(key, label, p) {
        const text = `${key} ${label}`.toLowerCase();
        const selected = /selected|focused|focus|active/.test(text);
        const hover = /hover/.test(text);
        const isText = /text|title|icon/.test(text);
        const isBorder = /border|outline/.test(text);
        const isBackground = /background|surface|card/.test(text);
        const isMuted = /muted|secondary text/.test(text);
        const isAccent = /accent|button/.test(text);

        if (selected && isText) return readableV107(p.selected);
        if (hover && isText) return readableV107(p.hover);
        if (selected && isBorder) return p.selected;
        if (hover && isBorder) return p.main;
        if (selected && isBackground) return p.selected;
        if (hover && isBackground) return p.hover;
        if (isMuted) return p.muted;
        if (isText) return p.dark;
        if (isBorder) return p.border;
        if (/page background|dashboard background/.test(text)) return p.page;
        if (/log page icon background/.test(text)) return p.surface2;
        if (isBackground) return p.surface;
        if (isAccent) return p.main;
        if (/color/.test(text)) return p.main;
        return p.main;
    }

    function updateDistributorSwatchesV107(box, seed) {
        const p = paletteV107(seed);
        const map = {
            main: p.main,
            hover: p.hover,
            selected: p.selected,
            surface: p.surface,
            border: p.border
        };
        Object.entries(map).forEach(([name,color]) => {
            const swatch = box?.querySelector(`[data-auto-swatch-v107="${name}"]`);
            if (swatch) swatch.style.background = color;
        });
    }

    function applyAutomaticPaletteV107(modal, seed) {
        const p = paletteV107(seed);
        const pickers = Array.from(modal?.querySelectorAll('input[type="color"][data-theme-key]') || []);
        pickers.forEach(picker => {
            const key = picker.dataset.themeKey;
            if (!key) return;
            const label = fieldLabelV107(picker);
            const value = valueForFieldV107(key, label, p);
            setColorV107(modal, key, value);
        });

        // A few semantic links are more useful when forced to consistent values.
        setColorV107(modal, 'accent', p.main);
        setColorV107(modal, 'border', p.border);
        setColorV107(modal, 'text', p.dark);
        setColorV107(modal, 'muted', p.muted);
        setColorV107(modal, 'background', p.page);
        setColorV107(modal, 'dashboardLogIconBackgroundV107', p.surface2);

        try { syncLogIconBackgroundPreviewV107(modal); } catch {}
        try { updateThemeBuilderPreview(modal); } catch {}
    }

    function ensureAutomaticDistributorV107(modal, theme = {}) {
        const section = mainColorsSectionV107(modal);
        const grid = section?.querySelector('.theme-builder-color-grid:not(.theme-builder-nav-color-grid):not(.theme-builder-dashboard-color-grid-v42):not(.theme-builder-kb-category-color-grid-v12)');
        if (!section || !grid) return;

        let box = section.querySelector('.theme-builder-auto-colors-v107');
        if (!box) {
            box = document.createElement('div');
            box.className = 'theme-builder-auto-colors-v107';
            box.innerHTML = `
                <div class="theme-builder-auto-colors-head-v107">
                    <div>
                        <strong>Automatic Color Distributor</strong>
                        <small>Choose one main color, then generate coordinated light, hover, selected, border, text, Dashboard, and category colors.</small>
                    </div>
                </div>
                <div class="theme-builder-auto-colors-row-v107">
                    <label class="theme-builder-auto-seed-v107">
                        <span>Main Color</span>
                        <input type="color" class="theme-builder-auto-seed-picker-v107" value="#8b6fd8">
                        <input type="text" class="theme-builder-auto-seed-hex-v107" value="#8b6fd8" maxlength="7" spellcheck="false">
                    </label>
                    <button type="button" class="theme-builder-auto-apply-v107"><i class="ph ph-magic-wand"></i><span>Fill Theme Colors</span></button>
                </div>
                <div class="theme-builder-auto-swatches-v107" aria-hidden="true">
                    <span data-auto-swatch-v107="surface"></span>
                    <span data-auto-swatch-v107="border"></span>
                    <span data-auto-swatch-v107="hover"></span>
                    <span data-auto-swatch-v107="main"></span>
                    <span data-auto-swatch-v107="selected"></span>
                </div>
            `;
            grid.insertAdjacentElement('beforebegin', box);
        }

        const picker = box.querySelector('.theme-builder-auto-seed-picker-v107');
        const hex = box.querySelector('.theme-builder-auto-seed-hex-v107');
        const initial = validHexV107(
            theme?._autoColorSeedV107,
            readColorV107(modal, 'accent', readColorV107(modal, 'dashboardAccentV40', '#8b6fd8'))
        );
        if (!box.dataset.initializedV107) {
            box.dataset.initializedV107 = 'true';
            picker.value = initial;
            hex.value = initial;
            updateDistributorSwatchesV107(box, initial);
        }

        if (picker.dataset.boundV107 !== 'true') {
            picker.dataset.boundV107 = 'true';
            picker.addEventListener('input', () => {
                hex.value = picker.value;
                updateDistributorSwatchesV107(box, picker.value);
            });
        }
        if (hex.dataset.boundV107 !== 'true') {
            hex.dataset.boundV107 = 'true';
            const commit = () => {
                if (!/^#[0-9a-f]{6}$/i.test(hex.value.trim())) return;
                picker.value = hex.value.trim();
                updateDistributorSwatchesV107(box, picker.value);
            };
            hex.addEventListener('input', commit);
            hex.addEventListener('change', commit);
        }
        const button = box.querySelector('.theme-builder-auto-apply-v107');
        if (button.dataset.boundV107 !== 'true') {
            button.dataset.boundV107 = 'true';
            button.addEventListener('click', () => applyAutomaticPaletteV107(modal, picker.value));
        }
    }

    function polishV107(modal, theme = {}) {
        if (!modal) return;
        removeLegacyCategoryDuplicatesV107(modal);
        ensureLogIconBackgroundV107(modal, theme);
        const surfaceLabel = modal.querySelector('[data-theme-key="dashboardCardV40"]')?.closest('.theme-builder-field')?.querySelector(':scope > span');
        if (surfaceLabel) surfaceLabel.textContent = 'Dashboard Surfaces';
        ensureAutomaticDistributorV107(modal, theme);
        syncLogIconBackgroundPreviewV107(modal);
    }

    // Remove the legacy duplicate rows from the field definition itself so
    // later hydration passes cannot recreate them.
    try { removeLegacyCategoryDuplicatesV107(document.getElementById('theme-builder-modal')); } catch {}

    try {
        const populateBeforeV107 = populateThemeBuilder;
        populateThemeBuilder = function(modal, theme = {}) {
            const result = populateBeforeV107(modal, theme);
            polishV107(modal, theme);
            requestAnimationFrame(() => polishV107(modal, theme));
            return result;
        };
    } catch {}

    try {
        const installDashboardBeforeV107 = stableDashboardThemeControlsV85;
        stableDashboardThemeControlsV85 = function(modal, theme = {}) {
            const result = installDashboardBeforeV107(modal, theme);
            polishV107(modal, theme);
            return result;
        };
    } catch {}

    try {
        const updateBeforeV107 = updateThemeBuilderPreview;
        updateThemeBuilderPreview = function(modal) {
            const result = updateBeforeV107(modal);
            try { syncLogIconBackgroundPreviewV107(modal); } catch {}
            return result;
        };
    } catch {}

    try {
        const dashPreviewBeforeV107 = renderDashboardPreviewV45;
        renderDashboardPreviewV45 = function(modal) {
            const result = dashPreviewBeforeV107(modal);
            try { syncLogIconBackgroundPreviewV107(modal); } catch {}
            return result;
        };
    } catch {}

    try {
        const draftBeforeV107 = getThemeBuilderDraft;
        getThemeBuilderDraft = function(modal) {
            const draft = draftBeforeV107(modal);
            if (!modal) return draft;
            draft[LOG_BG_KEY_V107] = readColorV107(modal, LOG_BG_KEY_V107, validHexV107(draft.dashboardCardV40, '#ffffff'));
            const seed = modal.querySelector('.theme-builder-auto-seed-picker-v107')?.value;
            if (/^#[0-9a-f]{6}$/i.test(String(seed || ''))) draft._autoColorSeedV107 = seed;
            return draft;
        };
    } catch {}

    requestAnimationFrame(() => {
        const modal = document.getElementById('theme-builder-modal');
        if (!modal) return;
        let theme = {};
        try { theme = getThemeBuilderDraft(modal) || {}; } catch {}
        polishV107(modal, theme);
    });
})();

// ============================================================
// V108 — IMMEDIATE PREVIEW PAINT + RELIABLE DASHBOARD PREVIEW NAV
// ============================================================
(function(){
    const previewTicketsV108 = new WeakMap();

    function previewStageHasContentV108(modal) {
        return !!modal?.querySelector(
            '.theme-builder-live-preview-stage .theme-builder-live-canvas, ' +
            '.theme-builder-dashboard-preview-v45:not(.hidden)'
        );
    }

    function paintCurrentPreviewV108(modal) {
        if (!modal || !document.documentElement.contains(modal)) return;

        try {
            if (modal._dashboardPreviewActiveV45) {
                renderDashboardPreviewV45(modal);
                const dashboard = ensureDashboardPreviewV45(modal);
                modal.querySelector('.theme-builder-live-preview-stage')?.classList.add('hidden');
                dashboard?.classList.remove('hidden');
                return;
            }
        } catch {}

        // Build the real-page clone only when V106 has not already produced it.
        // That keeps Edit Theme fast while still guaranteeing an immediate first
        // preview instead of waiting for Fill Theme Colors / Reload Preview.
        const stage = modal.querySelector('.theme-builder-live-preview-stage');
        if (!stage?.querySelector('.theme-builder-live-canvas')) {
            try { rebuildActualThemeBuilderPreviewV5(modal); } catch {}
        }
        try { updateThemeBuilderPreview(modal); } catch {}
        stage?.classList.remove('hidden');
    }

    function scheduleInitialPreviewV108(modal) {
        if (!modal) return;
        const ticket = (previewTicketsV108.get(modal) || 0) + 1;
        previewTicketsV108.set(modal, ticket);

        const attempt = (tries = 0) => {
            if (previewTicketsV108.get(modal) !== ticket) return;
            if (!document.documentElement.contains(modal)) return;

            // V106 batches expensive work while a theme is hydrating. Wait only
            // for that small hydration window, then guarantee one preview paint.
            if (modal._themeBuilderFastOpenV106 && tries < 18) {
                requestAnimationFrame(() => attempt(tries + 1));
                return;
            }

            paintCurrentPreviewV108(modal);

            // If another asynchronous hydration pass replaced the clone, make
            // one cheap verification on the following paint.
            requestAnimationFrame(() => {
                if (previewTicketsV108.get(modal) !== ticket) return;
                if (!previewStageHasContentV108(modal)) paintCurrentPreviewV108(modal);
            });
        };

        requestAnimationFrame(() => attempt(0));
    }

    // Every populate/open gets a guaranteed first preview without requiring a
    // color edit or manual Reload Preview click.
    try {
        const populateBeforeV108 = populateThemeBuilder;
        populateThemeBuilder = function(modal, theme = {}) {
            const result = populateBeforeV108.apply(this, arguments);
            scheduleInitialPreviewV108(modal);
            return result;
        };
    } catch {}

    // The V44 preview listener was registered before V45 and could intercept
    // the cloned Home/Dashboard icon, showing its obsolete gray preview. Catch
    // that click at document-capture level first and always route to V45.
    if (!window.__themeBuilderDashboardNavV108) {
        window.__themeBuilderDashboardNavV108 = true;
        document.addEventListener('click', event => {
            const modal = event.target?.closest?.('#theme-builder-modal');
            if (!modal || modal.classList.contains('hidden')) return;

            const home = event.target.closest(
                '.theme-builder-live-canvas .theme-builder-live-side-nav a[href="/"], ' +
                '.theme-builder-live-canvas a.icon-btn[href="/"], ' +
                '.theme-builder-dashboard-preview-button-v40'
            );
            if (!home) return;

            event.preventDefault();
            event.stopPropagation();
            event.stopImmediatePropagation();

            try {
                modal._dashboardPreviewActiveV40 = false;
                modal.querySelector('.theme-builder-dashboard-preview-v40')?.classList.add('hidden');
                showDashboardPreviewV45(modal);
                renderDashboardPreviewV45(modal);
                const preview = ensureDashboardPreviewV45(modal);
                modal.querySelector('.theme-builder-live-preview-stage')?.classList.add('hidden');
                preview?.classList.remove('hidden');
            } catch {
                // If the preview overlay has not been created yet, create it on
                // the next paint rather than leaving the user on a gray layer.
                requestAnimationFrame(() => {
                    try { showDashboardPreviewV45(modal); } catch {}
                });
            }
        }, true);
    }

    // A pre-built V106 modal can already exist before this code runs. When it
    // becomes visible, make sure its first preview is painted immediately.
    const existing = document.getElementById('theme-builder-modal');
    if (existing && !existing._previewVisibilityObserverV108) {
        existing._previewVisibilityObserverV108 = new MutationObserver(() => {
            if (!existing.classList.contains('hidden')) scheduleInitialPreviewV108(existing);
        });
        existing._previewVisibilityObserverV108.observe(existing, {
            attributes: true,
            attributeFilter: ['class']
        });
    }
})();

// ============================================================
// V109 — BUILT-IN PALETTE + BUILT-IN DECORATIONS + OPACITY + LIGHT DASHBOARD AUTO COLORS
// ============================================================
(function(){
    const IMAGE_EXT_V109 = /\.(?:svg|png|jpe?g|webp|gif|avif)(?:[?#].*)?$/i;

    function validHexV109(value, fallback = '') {
        const text = String(value || '').trim();
        if (/^#[0-9a-f]{6}$/i.test(text)) return text.toLowerCase();
        if (/^#[0-9a-f]{3}$/i.test(text)) {
            return ('#' + text.slice(1).split('').map(ch => ch + ch).join('')).toLowerCase();
        }
        try {
            const parsed = parseThemeCssColorV25(text, '');
            if (/^#[0-9a-f]{6}$/i.test(String(parsed || ''))) return String(parsed).toLowerCase();
        } catch {}
        return fallback;
    }

    function rgbV109(hex) {
        const clean = validHexV109(hex, '#777777').slice(1);
        return [0,2,4].map(i => parseInt(clean.slice(i, i + 2), 16));
    }

    function mixV109(a, b, amount) {
        const x = rgbV109(a), y = rgbV109(b);
        const t = Math.max(0, Math.min(1, Number(amount) || 0));
        return '#' + x.map((v, i) => Math.round(v + (y[i] - v) * t).toString(16).padStart(2, '0')).join('');
    }

    function readableV109(color) {
        const [r,g,b] = rgbV109(color);
        const lum = (0.299*r + 0.587*g + 0.114*b) / 255;
        return lum > .58 ? '#171717' : '#ffffff';
    }

    function luminanceV109(color) {
        const [r,g,b] = rgbV109(color);
        return (0.2126*r + 0.7152*g + 0.0722*b) / 255;
    }

    function resolveVarColorV109(name, style, probe) {
        const raw = String(style?.getPropertyValue?.(name) || '').trim();
        const direct = validHexV109(raw, '');
        if (direct) return direct;
        if (!probe) return '';
        try {
            probe.style.color = `var(${name}, rgb(1, 2, 3))`;
            const computed = getComputedStyle(probe).color;
            const parsed = validHexV109(computed, '');
            if (parsed && parsed !== '#010203') return parsed;
        } catch {}
        return '';
    }

    function firstVarColorV109(style, probe, names, fallback = '') {
        for (const name of names) {
            const color = resolveVarColorV109(name, style, probe);
            if (color) return color;
        }
        return validHexV109(fallback, fallback);
    }

    function gradientPageColorV109(backgroundImage, fallback) {
        const text = String(backgroundImage || '');
        const matches = text.match(/#[0-9a-f]{3,8}|rgba?\([^)]*\)/gi) || [];
        const colors = matches.map(value => validHexV109(value, '')).filter(Boolean);
        if (!colors.length) return fallback;
        const nonWhite = colors.filter(color => {
            const [r,g,b] = rgbV109(color);
            return !(r > 248 && g > 248 && b > 248);
        });
        const pool = nonWhite.length ? nonWhite : colors;
        return pool.sort((a,b) => luminanceV109(b) - luminanceV109(a))[0] || fallback;
    }

    function inferBuiltInPaletteV109(themeId, themeName, base = {}) {
        let isBuiltIn = false;
        try { isBuiltIn = isBuiltInThemeIdV30(themeId); } catch {}
        if (!isBuiltIn) return base;

        const slug = String(themeName || themeId || '')
            .replace(/^theme-/, '')
            .toLowerCase()
            .replace(/[^a-z0-9_-]+/g, '-');

        const bodyStyle = getComputedStyle(document.body);
        const rootStyle = getComputedStyle(document.documentElement);
        const probe = document.createElement('span');
        probe.setAttribute('aria-hidden', 'true');
        probe.style.cssText = 'position:fixed;left:-99999px;top:-99999px;visibility:hidden;pointer-events:none;';
        document.body.appendChild(probe);

        try {
            const style = bodyStyle;
            const surface = firstVarColorV109(style, probe, [
                '--unified-ui-surface', `--${slug}-surface`, `--${slug}-card`, '--white'
            ], base.surface || '#ffffff');

            const soft = firstVarColorV109(style, probe, [
                '--unified-ui-surface-soft', `--${slug}-surface-soft`, `--${slug}-soft`,
                `--${slug}-surface-2`, '--track-bg'
            ], mixV109(surface, base.accent || '#777777', .12));

            const text = firstVarColorV109(style, probe, [
                '--unified-ui-text', `--${slug}-ink`, `--${slug}-text`, '--black'
            ], base.text || '#171717');

            const muted = firstVarColorV109(style, probe, [
                '--unified-ui-muted', `--${slug}-muted`, `--${slug}-muted-text`, '--muted-text'
            ], base.muted || mixV109(text, surface, .42));

            let accent = firstVarColorV109(style, probe, [
                '--unified-ui-accent', `--${slug}-accent`, `--${slug}-primary`,
                `--${slug}-blue`, `--${slug}-pink`, `--${slug}-green`, `--${slug}-second`,
                '--custom-theme-accent'
            ], base.accent || text);

            let border = firstVarColorV109(style, probe, [
                '--unified-ui-border', `--${slug}-border`, '--custom-theme-border-color'
            ], '');

            if (!border) {
                const thin = String(rootStyle.getPropertyValue('--thin-border') || style.getPropertyValue('--thin-border') || '');
                const match = thin.match(/#[0-9a-f]{3,8}|rgba?\([^)]*\)/i);
                border = validHexV109(match?.[0], base.border || text);
            }

            const accentText = firstVarColorV109(style, probe, [
                '--unified-ui-accent-text', `--${slug}-accent-text`
            ], readableV109(accent));

            let background = validHexV109(bodyStyle.backgroundColor, '');
            if (!background || background === '#000000' && /rgba\(0,\s*0,\s*0,\s*0\)/.test(bodyStyle.backgroundColor)) {
                background = '';
            }
            if (!background) {
                background = gradientPageColorV109(bodyStyle.backgroundImage, base.background || surface);
            }

            // Built-in themes commonly expose their true app colors through
            // theme-specific/unified CSS variables. Carry those semantics into
            // every matching Theme Builder control instead of falling back to
            // black/white defaults.
            return {
                ...base,
                background,
                surface,
                text,
                muted,
                border,
                accent,
                tabIconColor: text,
                tabTitleColor: text,
                backButtonColor: text,
                hoverColor: soft,

                kbCategoryBackgroundColor: surface,
                kbCategoryTextColor: text,
                kbCategoryHoverBackgroundColor: soft,
                kbCategoryHoverTextColor: text,
                kbCategoryFocusBackgroundColor: accent,
                kbCategoryFocusTextColor: accentText,
                kbCategoryFocusBorderColor: border,
                kbCategoryBorderColorV97: border,
                kbCategoryHoverBorderColorV97: border,
                kbCategoryShadowSizeV97: 0,

                dashboardBackgroundV40: background,
                dashboardCardV40: surface,
                dashboardTextV40: border,
                dashboardAccentV40: surface,
                dashboardTitleColorV79: text,
                dashboardIconColorV81: text,
                dashboardLogIconColorV85: text,
                dashboardLogIconBackgroundV107: surface,
                dashboardCategoryBackgroundColorV98: surface,
                dashboardCategoryTextColorV98: text,
                dashboardCategoryHoverBackgroundColorV98: soft,
                dashboardCategoryHoverTextColorV98: text,
                dashboardCategorySelectedBackgroundColorV98: accent,
                dashboardCategorySelectedTextColorV98: accentText,
                dashboardCategoryBorderColorV98: border,
                dashboardCategoryHoverBorderColorV98: border,
                dashboardCategorySelectedBorderColorV98: border,
                dashboardCategoryShadowSizeV98: 0
            };
        } finally {
            probe.remove();
        }
    }

    try {
        const captureBeforeV109 = captureCurrentThemeBuilderBaseV25;
        captureCurrentThemeBuilderBaseV25 = function(themeId, themeName) {
            const base = captureBeforeV109.apply(this, arguments) || {};
            return inferBuiltInPaletteV109(themeId, themeName, base);
        };
    } catch {}

    function normalizeBuiltInAssetV109(asset) {
        const url = String(asset?.url || '').trim();
        if (!url || !IMAGE_EXT_V109.test(url)) return null;
        return {
            ...asset,
            name: String(asset?.name || decodeURIComponent(url.split('/').pop()?.split(/[?#]/)[0] || 'Decoration')),
            url,
            inheritedBuiltInV30: true,
            inheritedBuiltInV109: true,
            opacityV109: Number.isFinite(Number(asset?.opacityV109)) ? Number(asset.opacityV109) : 100
        };
    }

    async function fetchBuiltInAssetsV109(themeId, themeName) {
        let slug = String(themeName || '').trim();
        try { slug = getBuiltInThemeNameV30(themeId) || slug; } catch {}
        if (!slug) slug = String(themeId || '').replace(/^theme-/, '');
        slug = slug.toLowerCase().replace(/[^a-z0-9_-]+/g, '-');
        if (!slug) return [];
        try {
            const response = await fetch(`/api/built-in-theme-assets/${encodeURIComponent(slug)}`, { cache: 'no-store' });
            if (!response.ok) return [];
            const data = await response.json();
            return (Array.isArray(data?.assets) ? data.assets : []).map(normalizeBuiltInAssetV109).filter(Boolean);
        } catch {
            return [];
        }
    }

    function mergeBuiltInAssetsV109(modal, discovered) {
        if (!modal || !discovered.length) return false;
        const existing = Array.isArray(modal._themeBackgroundSvgs) ? modal._themeBackgroundSvgs : [];
        // If a built-in editor currently has no inherited art, restore what is
        // actually present in the project's built-in asset folder. This also
        // repairs older/stale overrides that accidentally saved an empty list.

        const seen = new Set(existing.map(asset => String(asset?.url || asset?.markup || '').trim()).filter(Boolean));
        let changed = false;
        const merged = existing.map(asset => ({
            ...asset,
            opacityV109: Number.isFinite(Number(asset?.opacityV109)) ? Number(asset.opacityV109) : 100
        }));
        discovered.forEach(asset => {
            const key = String(asset?.url || '').trim();
            if (!key || seen.has(key)) return;
            seen.add(key);
            merged.push(asset);
            changed = true;
        });

        // If the source scanner failed completely, the server-discovered list
        // becomes the source of truth for the inherited built-in artwork.
        if (!existing.length && discovered.length) changed = true;
        if (changed) modal._themeBackgroundSvgs = merged.length ? merged : discovered;
        try {
            const inherited = new Set(modal._builtInInheritedSvgKeysV30 || []);
            discovered.forEach(asset => {
                const key = String(asset?.url || asset?.markup || '').trim();
                if (key) inherited.add(key);
            });
            modal._builtInInheritedSvgKeysV30 = inherited;
        } catch {}
        return changed;
    }

    try {
        const hydrateBeforeV109 = hydrateBuiltInThemeEditorV30;
        hydrateBuiltInThemeEditorV30 = async function(modal, themeId, themeName) {
            const assetPromise = fetchBuiltInAssetsV109(themeId, themeName);
            const result = await hydrateBeforeV109.apply(this, arguments);
            if (!modal) return result;

            let builtIn = false;
            try { builtIn = isBuiltInThemeIdV30(themeId); } catch {}
            if (!builtIn) return result;

            const discovered = await assetPromise;
            if (mergeBuiltInAssetsV109(modal, discovered)) {
                try {
                    modal._themeImagePagingKeyV62 = `${themeId || themeName || 'built-in'}-v109`;
                    modal._themeImageRenderLimitV62 = Math.max(24, Math.min(modal._themeBackgroundSvgs.length, 48));
                    renderThemeBuilderSvgListV2(modal);
                } catch {}
                try { updateThemeBuilderPreview(modal); } catch {}
            } else if (Array.isArray(modal._themeBackgroundSvgs) && modal._themeBackgroundSvgs.length) {
                try { renderThemeBuilderSvgListV2(modal); } catch {}
            }
            // V106 intentionally delays the expensive gallery render until the
            // editor itself has painted. Install V109 controls after that flush.
            setTimeout(() => {
                try { ensureDecorationOpacityControlsV109(modal); } catch {}
                try { applyDecorationOpacityPreviewV109(modal); } catch {}
            }, 220);
            return result;
        };
    } catch {}

    // ---------------- Per-decoration opacity ----------------
    function opacityValueV109(asset) {
        const value = Number(asset?.opacityV109 ?? asset?.opacity ?? 100);
        return Math.max(0, Math.min(100, Number.isFinite(value) ? value : 100));
    }

    function applyDecorationOpacityPreviewV109(modal) {
        if (!modal) return;
        const assets = Array.isArray(modal._themeBackgroundSvgs) ? modal._themeBackgroundSvgs : [];
        const selectors = [
            '.theme-builder-live-art-item',
            '.theme-builder-dashboard-art-item-v45',
            '.theme-builder-dashboard-art-item-v40'
        ];
        selectors.forEach(selector => {
            Array.from(modal.querySelectorAll(selector)).forEach((item, displayIndex) => {
                let index = Number(item.dataset.svgIndex);
                if (!Number.isFinite(index) || !assets[index]) index = displayIndex % Math.max(1, assets.length);
                const asset = assets[index];
                if (!asset) return;
                item.style.setProperty('opacity', String(opacityValueV109(asset) / 100), 'important');
            });
        });
    }

    function ensureDecorationOpacityControlsV109(modal) {
        if (!modal) return;
        modal.querySelectorAll('.theme-builder-svg-card[data-svg-index]').forEach(card => {
            const index = Number(card.dataset.svgIndex);
            const asset = modal._themeBackgroundSvgs?.[index];
            const options = card.querySelector('.theme-builder-svg-card-options-v10');
            if (!asset || !options) return;

            if (!Number.isFinite(Number(asset.opacityV109))) asset.opacityV109 = opacityValueV109(asset);
            let row = options.querySelector('.theme-builder-decoration-opacity-v109');
            if (!row) {
                row = document.createElement('label');
                row.className = 'theme-builder-svg-option-row theme-builder-decoration-opacity-v109';
                row.innerHTML = `
                    <span class="theme-builder-decoration-opacity-label-v109">Opacity</span>
                    <span class="theme-builder-decoration-opacity-input-wrap-v111">
                        <input type="number" min="0" max="100" step="1" inputmode="numeric" class="theme-builder-decoration-opacity-number-v111" aria-label="Decoration opacity percentage">
                        <span class="theme-builder-decoration-opacity-percent-v111">%</span>
                    </span>
                `;
                const visible = options.querySelector('.theme-builder-image-visible-row-v63');
                if (visible) options.insertBefore(row, visible);
                else options.appendChild(row);
            }

            let number = row.querySelector('.theme-builder-decoration-opacity-number-v111');
            if (!number) {
                row.innerHTML = `
                    <span class="theme-builder-decoration-opacity-label-v109">Opacity</span>
                    <span class="theme-builder-decoration-opacity-input-wrap-v111">
                        <input type="number" min="0" max="100" step="1" inputmode="numeric" class="theme-builder-decoration-opacity-number-v111" aria-label="Decoration opacity percentage">
                        <span class="theme-builder-decoration-opacity-percent-v111">%</span>
                    </span>
                `;
                number = row.querySelector('.theme-builder-decoration-opacity-number-v111');
            }
            const value = opacityValueV109(asset);
            if (document.activeElement !== number) number.value = String(Math.round(value));

            const commitOpacityV111 = (live = false) => {
                let next = Number(number.value);
                if (!Number.isFinite(next)) next = opacityValueV109(asset);
                next = Math.max(0, Math.min(100, Math.round(next)));
                number.value = String(next);
                asset.opacityV109 = next;
                if (modal?.dataset?.themeBuilderBuiltInSourceV30) modal._builtInArtDirtyV30 = true;
                applyDecorationOpacityPreviewV109(modal);
                if (!live) { try { updateThemeBuilderPreview(modal); } catch {} }
            };

            if (number.dataset.boundV111 !== 'true') {
                number.dataset.boundV111 = 'true';
                number.addEventListener('pointerdown', event => event.stopPropagation());
                number.addEventListener('click', event => event.stopPropagation());
                number.addEventListener('input', event => {
                    event.stopPropagation();
                    const raw = Number(number.value);
                    if (Number.isFinite(raw)) {
                        asset.opacityV109 = Math.max(0, Math.min(100, raw));
                        if (modal?.dataset?.themeBuilderBuiltInSourceV30) modal._builtInArtDirtyV30 = true;
                        applyDecorationOpacityPreviewV109(modal);
                    }
                });
                number.addEventListener('change', event => {
                    event.stopPropagation();
                    commitOpacityV111(false);
                });
                number.addEventListener('blur', () => commitOpacityV111(false));
            }
        });
    }

    try {
        const renderBeforeV109 = renderThemeBuilderSvgListV2;
        renderThemeBuilderSvgListV2 = function(modal) {
            const result = renderBeforeV109.apply(this, arguments);
            requestAnimationFrame(() => {
                try { ensureDecorationOpacityControlsV109(modal); } catch {}
                try { applyDecorationOpacityPreviewV109(modal); } catch {}
            });
            return result;
        };
    } catch {}

    try {
        const updateBeforeV109 = updateThemeBuilderPreview;
        updateThemeBuilderPreview = function(modal) {
            const result = updateBeforeV109.apply(this, arguments);
            requestAnimationFrame(() => applyDecorationOpacityPreviewV109(modal));
            return result;
        };
    } catch {}

    try {
        const dashPreviewBeforeV109 = renderDashboardPreviewV45;
        renderDashboardPreviewV45 = function(modal) {
            const result = dashPreviewBeforeV109.apply(this, arguments);
            requestAnimationFrame(() => applyDecorationOpacityPreviewV109(modal));
            return result;
        };
    } catch {}

    try {
        const mountBeforeV109 = mountCustomThemeBackgroundSvgsV2;
        mountCustomThemeBackgroundSvgsV2 = function(theme) {
            const result = mountBeforeV109.apply(this, arguments);
            requestAnimationFrame(() => {
                const assets = Array.isArray(theme?.backgroundSvgs) ? theme.backgroundSvgs : [];
                document.querySelectorAll('#custom-theme-background-stage .custom-theme-background-svg').forEach((item, index) => {
                    const asset = assets[index];
                    if (asset) item.style.setProperty('opacity', String(opacityValueV109(asset) / 100), 'important');
                });
            });
            return result;
        };
    } catch {}

    // ---------------- Automatic distributor: light Dashboard surfaces ----------------
    function setThemeColorFieldV109(modal, key, color) {
        const value = validHexV109(color, '');
        if (!modal || !value) return;
        const picker = modal.querySelector(`input[type="color"][data-theme-key="${CSS.escape(key)}"]`);
        const hex = modal.querySelector(`[data-theme-hex="${CSS.escape(key)}"]`);
        if (picker) picker.value = value;
        if (hex) hex.value = value.toUpperCase();
        if (modal._dashboardColorStateV85 && key in modal._dashboardColorStateV85) {
            modal._dashboardColorStateV85[key] = value;
        }
    }

    function enforceLightDashboardPaletteV109(modal, seed) {
        const main = validHexV109(seed, '#8b6fd8');
        const button = mixV109(main, '#ffffff', .82);
        const normal = mixV109(main, '#ffffff', .87);
        const hover = mixV109(main, '#ffffff', .72);
        const selected = mixV109(main, '#ffffff', .48);
        const border = mixV109(main, '#000000', .18);
        const iconBg = mixV109(main, '#ffffff', .78);

        setThemeColorFieldV109(modal, 'dashboardAccentV40', button);
        setThemeColorFieldV109(modal, 'dashboardTextV40', border);
        setThemeColorFieldV109(modal, 'dashboardLogIconBackgroundV107', iconBg);

        setThemeColorFieldV109(modal, 'dashboardCategoryBackgroundColorV98', normal);
        setThemeColorFieldV109(modal, 'dashboardCategoryTextColorV98', readableV109(normal));
        setThemeColorFieldV109(modal, 'dashboardCategoryHoverBackgroundColorV98', hover);
        setThemeColorFieldV109(modal, 'dashboardCategoryHoverTextColorV98', readableV109(hover));
        setThemeColorFieldV109(modal, 'dashboardCategorySelectedBackgroundColorV98', selected);
        setThemeColorFieldV109(modal, 'dashboardCategorySelectedTextColorV98', readableV109(selected));
        setThemeColorFieldV109(modal, 'dashboardCategoryBorderColorV98', border);
        setThemeColorFieldV109(modal, 'dashboardCategoryHoverBorderColorV98', border);
        setThemeColorFieldV109(modal, 'dashboardCategorySelectedBorderColorV98', border);

        try { updateThemeBuilderPreview(modal); } catch {}
    }

    function removeSeparateKbSettingsCategoryControlsV109(modal) {
        modal?.querySelectorAll('.theme-builder-kb-settings-category-v105').forEach(node => node.remove());
    }

    function polishV109(modal) {
        if (!modal) return;
        removeSeparateKbSettingsCategoryControlsV109(modal);
        ensureDecorationOpacityControlsV109(modal);

        const button = modal.querySelector('.theme-builder-auto-apply-v107');
        if (button && button.dataset.lightDashboardV109 !== 'true') {
            button.dataset.lightDashboardV109 = 'true';
            button.addEventListener('click', () => {
                const seed = modal.querySelector('.theme-builder-auto-seed-picker-v107')?.value || '#8b6fd8';
                requestAnimationFrame(() => enforceLightDashboardPaletteV109(modal, seed));
            });
        }
    }

    try {
        const populateBeforeV109 = populateThemeBuilder;
        populateThemeBuilder = function(modal, theme = {}) {
            const result = populateBeforeV109.apply(this, arguments);
            polishV109(modal);
            requestAnimationFrame(() => polishV109(modal));
            return result;
        };
    } catch {}

    requestAnimationFrame(() => {
        const modal = document.getElementById('theme-builder-modal');
        if (modal) polishV109(modal);
    });
})();

// ============================================================
// V110 — BUILT-IN DECORATIONS IMMEDIATE HYDRATION + MATCHED CONTROLS
// ============================================================
(function(){
    function normalizeBuiltInDecorationsV110(modal) {
        if (!modal || !Array.isArray(modal._themeBackgroundSvgs)) return;
        let defaultAnimation = 'float';
        try {
            defaultAnimation = modal.querySelector('.theme-builder-svg-default-animation')?.value || defaultAnimation;
        } catch {}
        modal._themeBackgroundSvgs = modal._themeBackgroundSvgs.map(asset => {
            let next = asset || {};
            try {
                if (typeof ensureSvgAdvancedDefaultsV10 === 'function') next = ensureSvgAdvancedDefaultsV10(next) || next;
            } catch {}
            try {
                if (typeof normalizeSvgOverrideV11 === 'function') next = normalizeSvgOverrideV11(next, defaultAnimation) || next;
            } catch {}
            if (!Number.isFinite(Number(next.opacityV109))) next.opacityV109 = 100;
            return next;
        });
    }

    function forceBuiltInDecorationUiV110(modal) {
        if (!modal || !modal.dataset?.themeBuilderBuiltInSourceV30) return;
        normalizeBuiltInDecorationsV110(modal);

        // Built-in and custom decorations intentionally share the exact same
        // renderer and option markup. Do not maintain a reduced built-in card.
        try { renderThemeBuilderSvgListV2(modal); } catch {}

        const token = Number(modal._themeImageHydrateTokenV62);
        if (Number.isFinite(token) && token > 0) {
            try { hydrateThemeImageCardsV62(modal, token); } catch {}
        }

        try { installDecorationCustomizeStabilityV89(modal); } catch {}
        try { ensurePerDecorationHoverOverridesV89(modal); } catch {}
        try { ensureAcrossScreenControlsV94(modal); } catch {}
        try { ensureDecorationOpacityControlsV109(modal); } catch {}
        try { applyDecorationCustomizeStateV89(modal); } catch {}
        try { applyDecorationOpacityPreviewV109(modal); } catch {}
        try { cleanDecorationBuilderChromeV86(modal); } catch {}
        try { removeLegacyDecorationUploadCardsV87(modal); } catch {}
    }

    // V109 discovers the project assets before the old built-in hydration ends.
    // Paint those cards immediately after that hydration settles, then do one
    // next-frame pass after V106 releases its fast-open batching guard.
    try {
        const hydrateBeforeV110 = hydrateBuiltInThemeEditorV30;
        hydrateBuiltInThemeEditorV30 = async function(modal, themeId, themeName) {
            const result = await hydrateBeforeV110.apply(this, arguments);
            if (!modal) return result;
            normalizeBuiltInDecorationsV110(modal);
            queueMicrotask(() => forceBuiltInDecorationUiV110(modal));
            requestAnimationFrame(() => forceBuiltInDecorationUiV110(modal));
            setTimeout(() => forceBuiltInDecorationUiV110(modal), 40);
            return result;
        };
    } catch {}

    // Any later population/render path keeps built-in cards identical to custom
    // cards, including hover overrides, visibility, animation and opacity.
    try {
        const populateBeforeV110 = populateThemeBuilder;
        populateThemeBuilder = function(modal, theme = {}) {
            const result = populateBeforeV110.apply(this, arguments);
            if (modal?.dataset?.themeBuilderBuiltInSourceV30) {
                requestAnimationFrame(() => forceBuiltInDecorationUiV110(modal));
            }
            return result;
        };
    } catch {}

    function polishThemeBuilderV110(modal) {
        if (!modal) return;
        // Keep the refresh button the same visual height as the Dashboard button.
        const refresh = modal.querySelector('.theme-builder-live-preview-refresh');
        const dashboard = modal.querySelector('.theme-builder-dashboard-preview-button-v40');
        if (refresh && dashboard) {
            const h = Math.max(31, Math.round(dashboard.getBoundingClientRect().height || 0));
            refresh.style.height = `${h}px`;
            refresh.style.minHeight = `${h}px`;
        }
        if (modal.dataset?.themeBuilderBuiltInSourceV30) {
            forceBuiltInDecorationUiV110(modal);
        }
    }

    requestAnimationFrame(() => {
        const modal = document.getElementById('theme-builder-modal');
        if (modal) polishThemeBuilderV110(modal);
    });

    document.addEventListener('click', event => {
        if (!event.target.closest('.theme-builder-dashboard-preview-button-v40, .theme-builder-live-preview-refresh, [data-action="edit-theme"], .theme-picker-edit-button')) return;
        const modal = document.getElementById('theme-builder-modal');
        if (modal) requestAnimationFrame(() => polishThemeBuilderV110(modal));
    }, true);
})();

// ============================================================
// V114 — AUTO HOVER COLOR + UNIFIED PER-DECORATION OVERRIDES
// ============================================================
(function(){
    function normalizeHexV114(value, fallback = '#8b6fd8') {
        const text = String(value || '').trim();
        return /^#[0-9a-f]{6}$/i.test(text) ? text.toLowerCase() : fallback;
    }

    function mixV114(a, b, amount) {
        const left = normalizeHexV114(a).slice(1);
        const right = normalizeHexV114(b, '#ffffff').slice(1);
        const t = Math.max(0, Math.min(1, Number(amount) || 0));
        const parts = [0,2,4].map(offset => {
            const x = parseInt(left.slice(offset, offset + 2), 16);
            const y = parseInt(right.slice(offset, offset + 2), 16);
            return Math.round(x + (y - x) * t).toString(16).padStart(2, '0');
        });
        return `#${parts.join('')}`;
    }

    function setInteractiveHoverColorV114(modal, seed) {
        if (!modal) return;
        // Keep interactive hover clearly related to the seed while remaining
        // light enough to work on the app's surfaces.
        const hover = mixV114(seed, '#ffffff', .66);
        const picker = modal.querySelector('.theme-builder-hover-color');
        const hex = modal.querySelector('.theme-builder-hover-color-hex');
        if (picker) {
            picker.value = hover;
            picker.dispatchEvent(new Event('input', { bubbles: true }));
        }
        if (hex) {
            hex.value = hover.toUpperCase();
            hex.dispatchEvent(new Event('input', { bubbles: true }));
        }
    }

    function removeAutoSwatchesV114(modal) {
        modal?.querySelectorAll('.theme-builder-auto-swatches-v107').forEach(node => node.remove());
    }

    // A per-image hover choice is a true override. Global hover animation may be
    // disabled, but an individual image can still opt itself into one.
    try {
        effectiveThemeHoverAnimationV82 = function(theme, asset) {
            const override = String(asset?.hoverAnimationOverrideV82 || '').trim();
            if (override === 'none') return '';
            if (THEME_HOVER_ANIMATION_OPTIONS_V82.some(([id]) => id === override)) {
                return override;
            }
            if (!theme?.svgHoverAnimationsEnabledV82) return '';
            return normalizeThemeHoverAnimationV82(
                theme?.svgHoverAnimationV82,
                THEME_HOVER_ANIMATION_DEFAULT_V82
            );
        };
    } catch {}

    function ensureAnimationOverrideV114(modal, card, asset) {
        const options = card.querySelector('.theme-builder-svg-card-options-v10');
        if (!options) return;
        let row = options.querySelector('.theme-builder-svg-animation-select')?.closest('.theme-builder-svg-option-row');
        if (!row) {
            row = document.createElement('label');
            row.className = 'theme-builder-svg-option-row theme-builder-animation-row-v114';
            row.innerHTML = '<span>Animation</span><select class="theme-builder-svg-animation-select"></select>';
            options.prepend(row);
        }
        const select = row.querySelector('.theme-builder-svg-animation-select');
        if (!select) return;
        const defaultAnimation = modal.querySelector('.theme-builder-svg-default-animation')?.value || 'float';
        const optionsList = Array.isArray(THEME_SVG_ANIMATION_OPTIONS_V11)
            ? THEME_SVG_ANIMATION_OPTIONS_V11
            : THEME_SVG_ANIMATION_OPTIONS_V10;
        const selected = String(asset.animationOverride || '');
        select.innerHTML = `
            <option value="">Use Default · ${escapeCustomHtml(themeBuilderAnimationLabelV11?.(defaultAnimation) || defaultAnimation)}</option>
            ${optionsList.map(([value,label]) => `<option value="${escapeCustomHtml(value)}">${escapeCustomHtml(label)}</option>`).join('')}
        `;
        select.value = selected;
        select.onchange = event => {
            event.stopPropagation();
            asset.animationOverride = select.value;
            try { asset.animation = getEffectiveSvgAnimationV11(asset, defaultAnimation); } catch { asset.animation = select.value || defaultAnimation; }
            if (modal.dataset?.themeBuilderBuiltInSourceV30) modal._builtInArtDirtyV30 = true;
            try { updateThemeBuilderPreview(modal); } catch {}
        };
    }

    function ensureHoverOverrideV114(modal, card, asset) {
        const options = card.querySelector('.theme-builder-svg-card-options-v10');
        if (!options) return;
        const globalValue = modal.querySelector('.theme-builder-svg-hover-animation-default-v82')?.value || modal._themeHoverAnimationV82 || 'lift';
        let row = options.querySelector('.theme-builder-svg-hover-animation-row-v82, .theme-builder-svg-hover-animation-row-v89');
        if (!row) {
            row = document.createElement('label');
            row.className = 'theme-builder-svg-option-row theme-builder-svg-hover-animation-row-v82 theme-builder-svg-hover-animation-row-v89';
            options.appendChild(row);
        }
        row.classList.remove('hidden');
        row.innerHTML = '<span>Animation on hover</span><select class="theme-builder-svg-hover-animation-select-v82 theme-builder-svg-hover-animation-select-v89"></select>';
        const select = row.querySelector('select');
        if (!select) return;
        try {
            select.innerHTML = themeHoverAnimationSelectOptionsV82(asset.hoverAnimationOverrideV82 || '', true, globalValue);
        } catch {
            select.innerHTML = themeBuilderV89HoverOptions(asset.hoverAnimationOverrideV82 || '', globalValue);
        }
        select.value = String(asset.hoverAnimationOverrideV82 || '');
        select.onchange = event => {
            event.stopPropagation();
            asset.hoverAnimationOverrideV82 = select.value;
            if (modal.dataset?.themeBuilderBuiltInSourceV30) modal._builtInArtDirtyV30 = true;
            try { updateThemeBuilderPreview(modal); } catch {}
        };
    }

    function ensureBopOverrideV114(modal, card, asset) {
        const options = card.querySelector('.theme-builder-svg-card-options-v10');
        if (!options) return;
        card.querySelector('.theme-builder-svg-intro-bop-row')?.remove();
        let row = options.querySelector('.theme-builder-bop-mode-row-v60');
        if (!row) {
            row = document.createElement('label');
            row.className = 'theme-builder-svg-option-row theme-builder-bop-mode-row-v60';
            row.innerHTML = `
                <span>Bop with music</span>
                <select class="theme-builder-bop-mode-v60">
                    <option value="auto">Auto</option>
                    <option value="always">Always</option>
                    <option value="never">Never</option>
                </select>`;
            options.appendChild(row);
        }
        row.classList.remove('hidden');
        const select = row.querySelector('.theme-builder-bop-mode-v60');
        if (!select) return;
        select.value = ['auto','always','never'].includes(asset.bopModeV60) ? asset.bopModeV60 : 'auto';
        select.onchange = event => {
            event.stopPropagation();
            asset.bopModeV60 = select.value;
            if (modal.dataset?.themeBuilderBuiltInSourceV30) modal._builtInArtDirtyV30 = true;
            try { updateThemeBuilderPreview(modal); } catch {}
        };
    }

    function ensureVisibilityOverrideV114(modal, card, asset) {
        const options = card.querySelector('.theme-builder-svg-card-options-v10');
        if (!options) return;
        let row = options.querySelector('.theme-builder-image-visible-row-v63');
        if (!row) {
            row = document.createElement('label');
            row.className = 'theme-builder-svg-option-row theme-builder-image-visible-row-v63';
            row.innerHTML = '<span>Show on screen</span><input type="checkbox" class="theme-builder-image-visible-v63">';
            options.appendChild(row);
        }
        row.classList.remove('hidden');
        const checkbox = row.querySelector('.theme-builder-image-visible-v63');
        if (!checkbox) return;
        checkbox.checked = asset.hiddenOnScreenV63 !== true;
        checkbox.onchange = event => {
            event.stopPropagation();
            asset.hiddenOnScreenV63 = !checkbox.checked;
            if (modal.dataset?.themeBuilderBuiltInSourceV30) modal._builtInArtDirtyV30 = true;
            try { updateThemeBuilderPreview(modal); } catch {}
            try { renderDashboardThemePreviewV40?.(modal); } catch {}
        };
    }

    function ensureUnifiedDecorationCustomizationV114(modal) {
        if (!modal) return;
        try { installPerImageVisibilityControlsV63(modal); } catch {}
        try { installPerImageBopControlsV60(modal); } catch {}
        try { ensurePerDecorationHoverOverridesV89(modal); } catch {}
        try { ensureDecorationOpacityControlsV109(modal); } catch {}
        try { ensureAcrossScreenControlsV94(modal); } catch {}

        modal.querySelectorAll('.theme-builder-svg-card[data-svg-index]').forEach(card => {
            const index = Number(card.dataset.svgIndex);
            const asset = modal._themeBackgroundSvgs?.[index];
            if (!asset) return;
            const copy = card.querySelector('.theme-builder-svg-card-copy');
            let options = card.querySelector('.theme-builder-svg-card-options-v10');
            if (!options && copy) {
                options = document.createElement('div');
                options.className = 'theme-builder-svg-card-options-v10';
                copy.appendChild(options);
            }
            if (!options) return;

            if (copy && !copy.querySelector('.theme-builder-svg-customize-v11')) {
                const button = document.createElement('button');
                button.type = 'button';
                button.className = 'theme-builder-svg-customize-v11';
                button.innerHTML = '<i class="ph ph-sliders-horizontal"></i><span>Customize</span>';
                copy.insertBefore(button, options);
                button.onclick = event => {
                    event.preventDefault();
                    event.stopPropagation();
                    const open = card.dataset.v89CustomOpen !== 'true';
                    card.dataset.v89CustomOpen = open ? 'true' : 'false';
                    card.classList.toggle('svg-card-custom-open-v11', open);
                };
            }

            ensureAnimationOverrideV114(modal, card, asset);
            ensureHoverOverrideV114(modal, card, asset);
            ensureBopOverrideV114(modal, card, asset);
            ensureVisibilityOverrideV114(modal, card, asset);
            try { ensureDecorationOpacityControlsV109(modal); } catch {}

            // The five requested controls must remain available inside Customize,
            // even if the matching global/general feature is disabled.
            card.querySelectorAll(
                '.theme-builder-svg-animation-select, .theme-builder-svg-hover-animation-row-v82, .theme-builder-bop-mode-row-v60, .theme-builder-image-visible-row-v63, .theme-builder-decoration-opacity-v109'
            ).forEach(node => node.closest?.('.theme-builder-svg-option-row')?.classList.remove('hidden'));
        });

        try { applyDecorationCustomizeStateV89(modal); } catch {}
    }

    try {
        const syncBeforeV114 = syncThemeHoverAnimationUiV82;
        syncThemeHoverAnimationUiV82 = function(modal) {
            const result = syncBeforeV114.apply(this, arguments);
            modal?.querySelectorAll('.theme-builder-svg-hover-animation-row-v82').forEach(row => row.classList.remove('hidden'));
            return result;
        };
    } catch {}

    try {
        const renderBeforeV114 = renderThemeBuilderSvgListV2;
        renderThemeBuilderSvgListV2 = function(modal) {
            const result = renderBeforeV114.apply(this, arguments);
            ensureUnifiedDecorationCustomizationV114(modal);
            requestAnimationFrame(() => ensureUnifiedDecorationCustomizationV114(modal));
            return result;
        };
    } catch {}

    function polishV114(modal) {
        if (!modal) return;
        removeAutoSwatchesV114(modal);
        ensureUnifiedDecorationCustomizationV114(modal);

        const autoButton = modal.querySelector('.theme-builder-auto-apply-v107');
        if (autoButton && autoButton.dataset.hoverColorV114 !== 'true') {
            autoButton.dataset.hoverColorV114 = 'true';
            autoButton.addEventListener('click', () => {
                const seed = modal.querySelector('.theme-builder-auto-seed-picker-v107')?.value || '#8b6fd8';
                // Run after V107/V109 have completed their normal distributor pass.
                requestAnimationFrame(() => {
                    setInteractiveHoverColorV114(modal, seed);
                    try { updateThemeBuilderPreview(modal); } catch {}
                });
            });
        }
    }

    try {
        const populateBeforeV114 = populateThemeBuilder;
        populateThemeBuilder = function(modal, theme = {}) {
            const result = populateBeforeV114.apply(this, arguments);
            polishV114(modal);
            requestAnimationFrame(() => polishV114(modal));
            return result;
        };
    } catch {}

    requestAnimationFrame(() => {
        const modal = document.getElementById('theme-builder-modal');
        if (modal) polishV114(modal);
    });
})();

// ============================================================
// V115 — EDIT IN PLACE: NEVER TURN SAVE & APPLY INTO A DUPLICATE
// The prewarmed Dashboard Theme Studio keeps one /theme-studio-host iframe
// alive. Its URL therefore still says "idle" while later edit commands arrive
// by postMessage. Older save code read the stale URL and treated an edit as a
// create, producing a second theme card. Keep the live command identity as the
// authoritative source for Save / Save & Apply.
// ============================================================
(function(){
    let liveStudioActionV115 = '';
    let liveStudioThemeIdV115 = '';

    function rememberStudioCommandV115(action, themeId) {
        liveStudioActionV115 = String(action || '').trim();
        liveStudioThemeIdV115 = String(themeId || '').trim();

        const modal = document.getElementById('theme-builder-modal');
        if (modal) {
            modal.dataset.themeBuilderStudioActionV115 = liveStudioActionV115;
            modal.dataset.themeBuilderStudioThemeIdV115 = liveStudioThemeIdV115;
            if (liveStudioActionV115 === 'edit' && liveStudioThemeIdV115) {
                modal._themeBuilderOriginalEditIdV115 = liveStudioThemeIdV115;
            }
        }
    }

    // The V106 listener yields before opening the editor, so this listener gets
    // the live command recorded before any Save buttons can be used.
    window.addEventListener('message', event => {
        if (event.origin !== window.location.origin) return;
        if (event.data?.type !== 'dashboard-theme-studio-command-v106') return;
        rememberStudioCommandV115(event.data.action, event.data.themeId);
    });

    try {
        const getActionBeforeV115 = getDashboardThemeStudioActionV43;
        getDashboardThemeStudioActionV43 = function() {
            return liveStudioActionV115 || getActionBeforeV115.apply(this, arguments);
        };
    } catch {}

    try {
        const getIdBeforeV115 = getDashboardThemeStudioIdV43;
        getDashboardThemeStudioIdV43 = function() {
            return liveStudioThemeIdV115 || getIdBeforeV115.apply(this, arguments);
        };
    } catch {}

    // Preserve the identity of log-page edits too. Later populate/hydration
    // passes may rebuild controls, but they must never change what is being
    // edited into a new-theme operation.
    try {
        const openAnyBeforeV115 = openAnyThemeInBuilderV25;
        openAnyThemeInBuilderV25 = async function(themeId, themeName) {
            const result = await openAnyBeforeV115.apply(this, arguments);
            const modal = document.getElementById('theme-builder-modal');
            if (modal && themeId) {
                modal._themeBuilderOriginalEditIdV115 = String(themeId);
                modal.dataset.themeBuilderOriginalEditIdV115 = String(themeId);
            }
            return result;
        };
    } catch {}

    try {
        const openCopyBeforeV115 = openThemeCopyInBuilderV30;
        openThemeCopyInBuilderV30 = async function(copyId) {
            const result = await openCopyBeforeV115.apply(this, arguments);
            const modal = document.getElementById('theme-builder-modal');
            if (modal && copyId) {
                modal._themeBuilderOriginalEditIdV115 = String(copyId);
                modal.dataset.themeBuilderOriginalEditIdV115 = String(copyId);
            }
            return result;
        };
    } catch {}

    try {
        const openSharedBeforeV115 = openDashboardSharedThemeInStudioV43;
        openDashboardSharedThemeInStudioV43 = async function(themeId) {
            rememberStudioCommandV115('edit', themeId);
            const result = await openSharedBeforeV115.apply(this, arguments);
            const modal = document.getElementById('theme-builder-modal');
            if (modal && themeId) {
                modal._themeBuilderOriginalEditIdV115 = String(themeId);
                modal.dataset.themeBuilderOriginalEditIdV115 = String(themeId);
            }
            return result;
        };
    } catch {}

    // Final guard for Dashboard saves. If this session started as Edit, force
    // the exact highlighted theme ID back into the live identity immediately
    // before the existing V102/V43 save chain runs.
    try {
        const saveStudioBeforeV115 = saveDashboardThemeStudioV43;
        saveDashboardThemeStudioV43 = async function(modal, applyAfterSave) {
            const originalId = String(
                modal?._themeBuilderOriginalEditIdV115 ||
                modal?.dataset?.themeBuilderOriginalEditIdV115 ||
                modal?.dataset?.themeBuilderStudioThemeIdV115 ||
                liveStudioThemeIdV115 ||
                ''
            ).trim();

            const originalAction = String(
                modal?.dataset?.themeBuilderStudioActionV115 ||
                liveStudioActionV115 ||
                ''
            ).trim();

            if (originalAction === 'edit' && originalId) {
                rememberStudioCommandV115('edit', originalId);
            }

            return saveStudioBeforeV115.apply(this, arguments);
        };
    } catch {}

    // A genuine Create command starts a fresh identity. This is the only path
    // allowed to make a new theme ID.
    try {
        const openNewBeforeV115 = openNewThemeBuilderCleanV34;
        openNewThemeBuilderCleanV34 = function() {
            if (isDashboardThemeStudioV43?.()) {
                rememberStudioCommandV115('create', '');
            }
            const modal = document.getElementById('theme-builder-modal');
            if (modal) {
                modal._themeBuilderOriginalEditIdV115 = '';
                delete modal.dataset.themeBuilderOriginalEditIdV115;
            }
            return openNewBeforeV115.apply(this, arguments);
        };
    } catch {}
})();

// ============================================================
// V116 — NON-UNIFORM DECORATION MOTION + RELIABLE INTRO FADE
// Keeps the Size control at 100% while CSS supplies a larger 170% visual
// baseline. Motion shells are given distinct phases so decorations never move
// as one synchronized group. Theme Builder intro preview now honors Fade Out.
// ============================================================
(function () {
    const PHASE_STEPS_V116 = [-0.17, -1.31, -2.73, -0.59, -3.91, -1.97, -4.67, -0.93, -3.19, -2.21, -5.11, -1.63, -4.09, -2.89, -0.41, -3.53, -1.09];

    function staggerDecorationMotionV116(root) {
        if (!root) return;
        const items = Array.from(root.querySelectorAll([
            '.theme-builder-live-art-item',
            '.theme-builder-dashboard-art-item-v45',
            '.theme-builder-dashboard-art-item-v40',
            '.custom-theme-background-svg'
        ].join(',')));

        items.forEach((item, index) => {
            if (item.classList.contains('theme-cross-screen-v94')) return;
            const shell = item.querySelector(':scope > .theme-svg-motion-shell') || item.querySelector('.theme-svg-motion-shell');
            if (!shell) return;

            const assetIndex = Number(item.dataset.svgIndex);
            const seed = Number.isFinite(assetIndex) ? assetIndex : index;
            const phase = PHASE_STEPS_V116[Math.abs((seed * 7 + index * 3)) % PHASE_STEPS_V116.length];
            shell.style.setProperty('animation-delay', `${phase}s`, 'important');
            shell.dataset.themeMotionPhaseV116 = String(phase);
        });
    }

    function staggerBuilderMotionV116(modal) {
        if (!modal) return;
        staggerDecorationMotionV116(modal.querySelector('.theme-builder-live-canvas'));
        staggerDecorationMotionV116(modal.querySelector('.theme-builder-dashboard-preview-v45'));
        staggerDecorationMotionV116(modal.querySelector('.theme-builder-dashboard-preview-v40'));
    }

    function scheduleBuilderStaggerV116(modal) {
        requestAnimationFrame(() => requestAnimationFrame(() => staggerBuilderMotionV116(modal)));
        setTimeout(() => staggerBuilderMotionV116(modal), 70);
    }

    try {
        const updateBeforeV116 = updateThemeBuilderPreview;
        updateThemeBuilderPreview = function (modal) {
            const result = updateBeforeV116.apply(this, arguments);
            scheduleBuilderStaggerV116(modal);
            return result;
        };
    } catch {}

    try {
        const logPreviewBeforeV116 = renderThemeArtworkPreviewV61;
        renderThemeArtworkPreviewV61 = function (modal) {
            const result = logPreviewBeforeV116.apply(this, arguments);
            scheduleBuilderStaggerV116(modal);
            return result;
        };
    } catch {}

    try {
        const dashboardPreviewBeforeV116 = renderDashboardPreviewV45;
        renderDashboardPreviewV45 = function (modal) {
            const result = dashboardPreviewBeforeV116.apply(this, arguments);
            scheduleBuilderStaggerV116(modal);
            return result;
        };
    } catch {}

    try {
        const mountBeforeV116 = mountCustomThemeBackgroundSvgsV2;
        mountCustomThemeBackgroundSvgsV2 = function (theme) {
            const result = mountBeforeV116.apply(this, arguments);
            requestAnimationFrame(() => requestAnimationFrame(() => {
                staggerDecorationMotionV116(document.getElementById('custom-theme-background-stage'));
            }));
            return result;
        };
    } catch {}

    function clearIntroPreviewTimersV116(modal) {
        if (!modal) return;
        if (modal._themeBuilderIntroFadeRafV116) cancelAnimationFrame(modal._themeBuilderIntroFadeRafV116);
        if (modal._themeBuilderIntroStopTimerV116) clearTimeout(modal._themeBuilderIntroStopTimerV116);
        modal._themeBuilderIntroFadeRafV116 = 0;
        modal._themeBuilderIntroStopTimerV116 = 0;
    }

    try {
        const stopBeforeV116 = stopThemeBuilderIntroPreviewV10;
        stopThemeBuilderIntroPreviewV10 = function (modal) {
            clearIntroPreviewTimersV116(modal);
            return stopBeforeV116.apply(this, arguments);
        };
    } catch {}

    // Own Preview Intro at the final layer so the checked fade option is not
    // lost through older preview wrappers. The fade follows actual playback
    // time, so seeking/metadata timing cannot make it miss the end of a segment.
    previewThemeBuilderIntroV10 = function (modal) {
        if (!modal) return;
        try { stopThemeBuilderIntroPreviewV10(modal); } catch {}
        clearIntroPreviewTimersV116(modal);

        const draft = getThemeBuilderDraft(modal);
        const artStage = modal.querySelector('.theme-builder-live-art-stage-v61, .theme-builder-dashboard-art-stage-v45, .theme-builder-dashboard-art-stage, .theme-builder-live-art-stage');
        if (!draft.introAudio) return;

        const audio = new Audio(draft.introAudio);
        modal._themeBuilderIntroPreviewAudioV10 = audio;

        const baseVolume = Math.max(0, Math.min(1,
            (Number.isFinite(Number(draft.audioVolume)) ? Number(draft.audioVolume) : 35) / 100
        ));
        const mode = draft.audioPlayMode === 'segment' ? 'segment' : 'full';
        const start = mode === 'segment' ? Math.max(0, Number(draft.audioStart) || 0) : 0;
        const requestedEnd = Math.max(start + 0.1, Number(draft.audioEnd) || (start + 20));
        const fadeEnabled = !!draft.audioFade;
        let finished = false;

        const clean = () => {
            if (finished) return;
            finished = true;
            clearIntroPreviewTimersV116(modal);
            artStage?.classList.remove('theme-svg-intro-active', 'theme-svg-intro-bop-enabled');
            if (modal._themeBuilderIntroPreviewAudioV10 === audio) {
                modal._themeBuilderIntroPreviewAudioV10 = null;
            }
        };

        const finish = () => {
            if (finished) return;
            try { audio.pause(); } catch {}
            clean();
        };

        const effectiveEnd = () => {
            if (mode === 'segment') return requestedEnd;
            return Number.isFinite(audio.duration) && audio.duration > 0 ? audio.duration : Infinity;
        };

        const tick = () => {
            if (finished || modal._themeBuilderIntroPreviewAudioV10 !== audio) return;
            const end = effectiveEnd();
            const remaining = end - (Number(audio.currentTime) || 0);

            if (Number.isFinite(remaining)) {
                const segmentLength = Math.max(0.1, end - start);
                const fadeSeconds = Math.min(1.4, Math.max(0.45, segmentLength * 0.35));
                if (fadeEnabled && remaining <= fadeSeconds) {
                    audio.volume = baseVolume * Math.max(0, Math.min(1, remaining / fadeSeconds));
                } else {
                    audio.volume = baseVolume;
                }
                if (remaining <= 0.025) {
                    finish();
                    return;
                }
            }

            modal._themeBuilderIntroFadeRafV116 = requestAnimationFrame(tick);
        };

        audio.addEventListener('play', () => {
            artStage?.classList.add('theme-svg-intro-active');
            artStage?.classList.toggle('theme-svg-intro-bop-enabled', !!draft.introSvgBounceEnabled);
            if (artStage) staggerDecorationMotionV116(artStage);
        });
        audio.addEventListener('ended', clean, { once: true });
        audio.addEventListener('error', clean, { once: true });

        const startPlayback = () => {
            try { audio.currentTime = start; } catch {}
            audio.volume = baseVolume;
            audio.play().then(() => {
                modal._themeBuilderIntroFadeRafV116 = requestAnimationFrame(tick);
            }).catch(clean);

            if (mode === 'segment') {
                const ms = Math.max(100, (requestedEnd - start) * 1000 + 120);
                modal._themeBuilderIntroStopTimerV116 = setTimeout(finish, ms);
            }
        };

        if (audio.readyState >= 1) startPlayback();
        else audio.addEventListener('loadedmetadata', startPlayback, { once: true });
    };

    requestAnimationFrame(() => {
        const modal = document.getElementById('theme-builder-modal');
        if (modal) scheduleBuilderStaggerV116(modal);
    });
})();


// ============================================================
// V117 — DECORATION OVERRIDES + GENERAL OPACITY + REAL BOP FIX
// ============================================================
(function(){
  const clamp=n=>Math.max(0,Math.min(100,Number.isFinite(Number(n))?Number(n):100));
  function globalOpacity(modal){ return clamp(modal?._themeDecorationsOpacityV117 ?? 100); }
  function effectiveOpacity(modal,a){ return (globalOpacity(modal)/100)*(clamp(a?.opacityV109 ?? a?.opacity ?? 100)/100); }

  try {
    const before=getThemeBuilderDraft;
    getThemeBuilderDraft=function(modal){
      const d=before.apply(this,arguments)||{};
      d.decorationsOpacityV117=globalOpacity(modal);
      return d;
    };
  } catch{}

  function applyPreview(modal){
    if(!modal)return;
    const assets=Array.isArray(modal._themeBackgroundSvgs)?modal._themeBackgroundSvgs:[];
    modal.querySelectorAll('.theme-builder-live-art-item,.theme-builder-dashboard-art-item-v45,.theme-builder-dashboard-art-item-v40').forEach((item,i)=>{
      let idx=Number(item.dataset.svgIndex); if(!Number.isFinite(idx)||!assets[idx]) idx=i%Math.max(1,assets.length);
      if(assets[idx]) item.style.setProperty('opacity',String(effectiveOpacity(modal,assets[idx])),'important');
    });
  }

  function ensureGeneralOpacity(modal,theme){
    const host=modal?.querySelector('.theme-builder-global-svg-controls-v11'); if(!host)return;
    if(!Number.isFinite(Number(modal._themeDecorationsOpacityV117))) modal._themeDecorationsOpacityV117=clamp(theme?.decorationsOpacityV117 ?? 100);
    let row=host.querySelector('.theme-builder-general-opacity-v117');
    if(!row){
      row=document.createElement('div'); row.className='theme-builder-field theme-builder-general-opacity-v117';
      row.innerHTML='<span>Opacity — all decorations</span><div style="display:grid;grid-template-columns:minmax(0,1fr) 76px;gap:8px;align-items:center"><input class="theme-builder-general-opacity-range-v117" type="range" min="0" max="100" step="1"><input class="theme-builder-general-opacity-number-v117" type="number" min="0" max="100" step="1" inputmode="numeric"></div>';
      const size=host.querySelector('.theme-builder-svg-size-v19'); size?host.insertBefore(row,size):host.prepend(row);
    }
    const range=row.querySelector('.theme-builder-general-opacity-range-v117'), num=row.querySelector('.theme-builder-general-opacity-number-v117');
    const sync=v=>{v=clamp(v);modal._themeDecorationsOpacityV117=v;range.value=v;num.value=v;applyPreview(modal);try{updateThemeBuilderPreview(modal)}catch{}};
    range.value=num.value=globalOpacity(modal); range.oninput=()=>sync(range.value); num.oninput=()=>sync(num.value);
  }

  function forceCustomize(modal){
    if(!modal)return;
    try{ensureUnifiedDecorationCustomizationV114(modal)}catch{}
    modal.querySelectorAll('.theme-builder-svg-card[data-svg-index]').forEach(card=>{
      card.querySelectorAll('.theme-builder-decoration-opacity-v109,.theme-builder-animation-row-v114,.theme-builder-svg-hover-animation-row-v82,.theme-builder-bop-mode-row-v60,.theme-builder-image-visible-row-v63').forEach(row=>row.classList.remove('hidden'));
    });
  }

  try{const b=ensureThemeBuilderSvgUiV19;ensureThemeBuilderSvgUiV19=function(modal,theme){const r=b.apply(this,arguments);ensureGeneralOpacity(modal,theme);forceCustomize(modal);return r}}catch{}
  try{const b=populateThemeBuilder;populateThemeBuilder=function(modal,theme){const r=b.apply(this,arguments);modal._themeDecorationsOpacityV117=clamp(theme?.decorationsOpacityV117??100);setTimeout(()=>{ensureGeneralOpacity(modal,theme);forceCustomize(modal);applyPreview(modal)},0);return r}}catch{}
  try{const b=renderThemeBuilderSvgListV2;renderThemeBuilderSvgListV2=function(modal){const r=b.apply(this,arguments);requestAnimationFrame(()=>forceCustomize(modal));return r}}catch{}
  try{const b=updateThemeBuilderPreview;updateThemeBuilderPreview=function(modal){const r=b.apply(this,arguments);requestAnimationFrame(()=>applyPreview(modal));return r}}catch{}

  // V369: intro-song bop ownership was removed from V117. V369 is the single bop runtime.

})();

// V119 obsolete bop runtime removed in V369.

// ============================================================
// V120 — LEGACY DECORATION MIGRATION + TRULY BLANK NEW THEMES
// Every theme generation uses the same five per-decoration overrides.
// Create mode is reset from canonical defaults instead of inheriting the
// previously edited theme's cached artwork/media/editor state.
// ============================================================
(function(){
    function normalizeLegacyDecorationV120(asset, defaultAnimation = 'float') {
        let next = { ...(asset || {}) };

        try {
            if (typeof ensureSvgAdvancedDefaultsV10 === 'function') {
                next = ensureSvgAdvancedDefaultsV10(next) || next;
            }
        } catch {}
        try {
            if (typeof normalizeSvgOverrideV11 === 'function') {
                next = normalizeSvgOverrideV11(next, defaultAnimation) || next;
            }
        } catch {}

        // Add only missing values so old themes keep their existing appearance.
        if (!Number.isFinite(Number(next.opacityV109))) {
            next.opacityV109 = Number.isFinite(Number(next.opacity)) ? Number(next.opacity) : 100;
        }
        if (typeof next.animationOverride !== 'string') next.animationOverride = '';
        if (typeof next.hoverAnimationOverrideV82 !== 'string') next.hoverAnimationOverrideV82 = '';
        if (!['auto','always','never'].includes(String(next.bopModeV60 || '').toLowerCase())) {
            next.bopModeV60 = 'auto';
        }
        if (typeof next.hiddenOnScreenV63 !== 'boolean') next.hiddenOnScreenV63 = false;

        return next;
    }

    function migrateThemeDecorationsV120(theme, modal) {
        if (!theme || typeof theme !== 'object') return theme;
        const defaultAnimation = String(
            theme.svgDefaultAnimation ||
            theme.defaultSvgAnimation ||
            modal?.querySelector?.('.theme-builder-svg-default-animation')?.value ||
            'float'
        );
        const source = Array.isArray(theme.backgroundSvgs) ? theme.backgroundSvgs : [];
        return {
            ...theme,
            backgroundSvgs: source.map(asset => normalizeLegacyDecorationV120(asset, defaultAnimation))
        };
    }

    function migrateModalDecorationsV120(modal, theme) {
        if (!modal) return;
        const defaultAnimation = String(
            modal.querySelector('.theme-builder-svg-default-animation')?.value ||
            theme?.svgDefaultAnimation ||
            'float'
        );
        const assets = Array.isArray(modal._themeBackgroundSvgs)
            ? modal._themeBackgroundSvgs
            : (Array.isArray(theme?.backgroundSvgs) ? theme.backgroundSvgs : []);
        modal._themeBackgroundSvgs = assets.map(asset => normalizeLegacyDecorationV120(asset, defaultAnimation));
    }

    function hydrateAllDecorationOverridesV120(modal, theme) {
        if (!modal) return;
        migrateModalDecorationsV120(modal, theme);

        // Re-render from the normalized data, then run the shared customization
        // installer. This makes legacy, built-in and newly-created themes use
        // exactly the same card structure.
        try { renderThemeBuilderSvgListV2(modal); } catch {}
        try { ensureUnifiedDecorationCustomizationV114(modal); } catch {}
        try { ensureDecorationOpacityControlsV109(modal); } catch {}

        modal.querySelectorAll('.theme-builder-svg-card[data-svg-index]').forEach(card => {
            const index = Number(card.dataset.svgIndex);
            const asset = modal._themeBackgroundSvgs?.[index];
            if (!asset) return;

            // Some very old card renderers did not create an options body.
            const copy = card.querySelector('.theme-builder-svg-card-copy');
            let options = card.querySelector('.theme-builder-svg-card-options-v10');
            if (!options && copy) {
                options = document.createElement('div');
                options.className = 'theme-builder-svg-card-options-v10';
                copy.appendChild(options);
            }

            try { ensureUnifiedDecorationCustomizationV114(modal); } catch {}

            card.querySelectorAll([
                '.theme-builder-decoration-opacity-v109',
                '.theme-builder-animation-row-v114',
                '.theme-builder-svg-hover-animation-row-v82',
                '.theme-builder-svg-hover-animation-row-v89',
                '.theme-builder-bop-mode-row-v60',
                '.theme-builder-image-visible-row-v63'
            ].join(',')).forEach(row => row.classList.remove('hidden'));
        });
    }

    // Normalize every theme before the builder consumes it. This includes old
    // custom themes saved before these fields existed.
    try {
        const populateBeforeV120 = populateThemeBuilder;
        populateThemeBuilder = function(modal, theme = {}) {
            const migrated = migrateThemeDecorationsV120(theme, modal);
            const result = populateBeforeV120.call(this, modal, migrated);
            migrateModalDecorationsV120(modal, migrated);
            requestAnimationFrame(() => hydrateAllDecorationOverridesV120(modal, migrated));
            setTimeout(() => hydrateAllDecorationOverridesV120(modal, migrated), 0);
            return result;
        };
    } catch {}

    // Also normalize any late gallery redraw/hydration pass.
    try {
        const renderBeforeV120 = renderThemeBuilderSvgListV2;
        let inRenderV120 = false;
        renderThemeBuilderSvgListV2 = function(modal) {
            if (inRenderV120) return renderBeforeV120.apply(this, arguments);
            migrateModalDecorationsV120(modal);
            inRenderV120 = true;
            try {
                const result = renderBeforeV120.apply(this, arguments);
                requestAnimationFrame(() => {
                    try { ensureUnifiedDecorationCustomizationV114(modal); } catch {}
                });
                return result;
            } finally {
                inRenderV120 = false;
            }
        };
    } catch {}

    function blankThemeV120() {
        return {
            ...FEATURE_SUITE_DEFAULT_THEME,
            ...CUSTOM_THEME_MEDIA_DEFAULTS_V3,
            ...CUSTOM_THEME_VISUAL_DEFAULTS_V4,
            ...THEME_BUILDER_NAV_DEFAULTS_V6,
            ...CUSTOM_THEME_ADVANCED_DEFAULTS_V10,
            ...CUSTOM_THEME_V11_DEFAULTS,
            ...CUSTOM_THEME_V12_DEFAULTS,
            ...CUSTOM_THEME_V13_DEFAULTS,
            ...CUSTOM_THEME_V15_DEFAULTS,
            ...CUSTOM_THEME_V19_DEFAULTS,
            ...CUSTOM_THEME_V20_DEFAULTS,
            ...CUSTOM_THEME_V26_DEFAULTS,
            ...CUSTOM_THEME_ACCESSORY_DEFAULTS_V32,
            name: 'My Custom Theme',
            backgroundSvgs: [],
            svgHoverSounds: [],
            introAudio: '',
            backgroundImage: '',
            decorationsOpacityV117: 100
        };
    }

    function clearCreateCachesV120(modal) {
        if (!modal) return;
        modal._themeBackgroundSvgs = [];
        modal._themeHoverSounds = [];
        modal._themeDecorationsOpacityV117 = 100;
        modal._themeArtworkKeyV69 = '';
        modal._themeArtworkSnapshotV69 = [];
        modal._themeImagesIntentionallyEditedV69 = false;
        modal._builtInArtDirtyV30 = false;
        modal._themeBuilderOriginalEditIdV115 = '';
        modal._themeBuilderIntroPreviewAudioV10?.pause?.();
        modal._themeBuilderIntroPreviewAudioV10 = null;
        modal.dataset.themeBuilderMode = 'create';
        modal.dataset.themeBuilderEditingThemeV25 = '';
        modal.dataset.themeBuilderEditingCopyV30 = '';
        delete modal.dataset.themeBuilderOriginalEditIdV115;
        delete modal.dataset.themeBuilderBuiltInSourceV30;
    }

    // Final create-mode guard. Older wrappers may leave Silverstine/another
    // edited theme in modal caches even though create mode was requested.
    try {
        const openNewBeforeV120 = openNewThemeBuilderCleanV34;
        openNewThemeBuilderCleanV34 = function() {
            const result = openNewBeforeV120.apply(this, arguments);
            const reset = () => {
                const modal = document.getElementById('theme-builder-modal');
                if (!modal) return;
                clearCreateCachesV120(modal);
                const blank = blankThemeV120();
                try { populateThemeBuilder(modal, blank); } catch {}
                clearCreateCachesV120(modal);
                // populate owns the visible controls; restore the deliberately
                // empty backing arrays afterward so no stale artwork can return.
                modal._themeBackgroundSvgs = [];
                modal._themeHoverSounds = [];
                try { renderThemeBuilderSvgListV2(modal); } catch {}
                try { updateThemeBuilderPreview(modal); } catch {}
                try { installNormalCreateActionsV45?.(modal); } catch {}
                try { installIndependentCreateButtonsV47?.(modal); } catch {}
            };
            reset();
            requestAnimationFrame(reset);
            return result;
        };
    } catch {}

    requestAnimationFrame(() => {
        const modal = document.getElementById('theme-builder-modal');
        if (modal && !modal.classList.contains('hidden')) {
            try { hydrateAllDecorationOverridesV120(modal); } catch {}
        }
    });
})();

// ============================================================
// V121 — BUILT-IN MEDIA ALWAYS VISIBLE + BETTER SHADOW INFERENCE
// ============================================================
(function(){
    const IMG_RE_V121 = /\.(?:svg|png|jpe?g|webp|gif|avif)(?:[?#].*)?$/i;
    const AUDIO_RE_V121 = /\.(?:mp3|wav|ogg|m4a|aac|flac)(?:[?#].*)?$/i;

    function builtInSlugV121(themeId, themeName){
        let slug = String(themeName || '').trim();
        try { slug = getBuiltInThemeNameV30(themeId) || slug; } catch {}
        if (!slug) slug = String(themeId || '').replace(/^theme-/, '');
        return slug.toLowerCase().replace(/[^a-z0-9_-]+/g, '-');
    }

    function mediaNameV121(url, fallback){
        try { return decodeURIComponent(String(url).split('/').pop().split(/[?#]/)[0]) || fallback; }
        catch { return fallback; }
    }

    async function fetchBuiltInMediaV121(themeId, themeName){
        const slug = builtInSlugV121(themeId, themeName);
        if (!slug) return { images: [], audio: [] };
        try {
            const res = await fetch(`/api/built-in-theme-assets/${encodeURIComponent(slug)}`, { cache: 'no-store' });
            if (!res.ok) return { images: [], audio: [] };
            const data = await res.json();
            const rawImages = Array.isArray(data?.assets) ? data.assets : [];
            const rawAudio = Array.isArray(data?.audio) ? data.audio : (Array.isArray(data?.sounds) ? data.sounds : []);
            return {
                images: rawImages.filter(x => IMG_RE_V121.test(String(x?.url || ''))).map(x => ({
                    ...x,
                    name: String(x?.name || mediaNameV121(x?.url, 'Built-in Decoration')),
                    inheritedBuiltInV30: true,
                    inheritedBuiltInV121: true,
                    opacityV109: Number.isFinite(Number(x?.opacityV109)) ? Number(x.opacityV109) : 100
                })),
                audio: rawAudio.filter(x => AUDIO_RE_V121.test(String(x?.url || ''))).map(x => ({
                    ...x,
                    name: String(x?.name || mediaNameV121(x?.url, 'Built-in Audio')),
                    inheritedBuiltInV30: true,
                    inheritedBuiltInV121: true
                }))
            };
        } catch {
            return { images: [], audio: [] };
        }
    }

    function uniqueByUrlV121(items){
        const seen = new Set();
        return (items || []).filter(item => {
            const key = String(item?.url || item?.markup || '').trim();
            if (!key || seen.has(key)) return false;
            seen.add(key);
            return true;
        });
    }

    function chooseIntroAudioV121(list){
        if (!Array.isArray(list) || !list.length) return null;
        const scored = list.map(item => {
            const t = `${item?.name || ''} ${item?.url || ''}`.toLowerCase();
            let score = 0;
            if (/intro|opening|song|music|theme/.test(t)) score += 8;
            if (/hover|click|select|coin|bling|sfx|effect/.test(t)) score -= 6;
            return { item, score };
        }).sort((a,b) => b.score - a.score);
        return scored[0]?.item || list[0];
    }

    function forceBuiltInMediaPaintV121(modal){
        if (!modal || !modal.dataset?.themeBuilderBuiltInSourceV30) return;
        try {
            modal._themeImagePagingKeyV62 = `${modal.dataset.themeBuilderBuiltInSourceV30}-v121`;
            modal._themeImageRenderLimitV62 = Math.max(24, Math.min(96, modal._themeBackgroundSvgs?.length || 24));
        } catch {}
        try { renderThemeBuilderSvgListV2(modal); } catch {}
        try {
            const token = Number(modal._themeImageHydrateTokenV62);
            if (Number.isFinite(token) && token > 0) hydrateThemeImageCardsV62(modal, token);
        } catch {}
        try { ensureDecorationOpacityControlsV109(modal); } catch {}
        try { ensurePerDecorationHoverOverridesV89(modal); } catch {}
        try { ensureAcrossScreenControlsV94(modal); } catch {}
        try { applyDecorationCustomizeStateV89(modal); } catch {}
        try { applyDecorationOpacityPreviewV109(modal); } catch {}
        try { updateThemeBuilderPreview(modal); } catch {}
    }

    // Make source parsing recognize relative/bare audio files too. This is the
    // fallback for themes that keep their soundtrack beside the theme JS.
    try {
        const analyzeBeforeV121 = analyzeThemeSourceV30;
        analyzeThemeSourceV30 = function(themeId, source){
            const info = analyzeBeforeV121.apply(this, arguments) || {};
            const themeName = (() => { try { return getBuiltInThemeNameV30(themeId) || ''; } catch { return ''; } })();
            const text = `${String(source?.js || '')}\n${String(source?.css || '')}`;
            const found = [];
            const re = /["'`]([^"'`\n\r]+?\.(?:mp3|wav|ogg|m4a|aac|flac)(?:\?[^"'`\n\r]*)?)["'`]/gi;
            let m;
            while ((m = re.exec(text))) {
                let url = String(m[1] || '').trim();
                if (!url || url.startsWith('data:') || url.startsWith('blob:')) continue;
                try {
                    const base = new URL(`/themes/${encodeURIComponent(themeName)}/theme-${encodeURIComponent(themeName)}.js`, location.origin);
                    const u = new URL(url, base);
                    url = u.origin === location.origin ? u.pathname + u.search + u.hash : u.href;
                } catch {}
                found.push({ name: mediaNameV121(url, 'Built-in Audio'), url, inheritedBuiltInV30: true, inheritedBuiltInV121: true });
            }
            const allAudio = uniqueByUrlV121([
                ...(info.introAudio ? [{ name: info.introAudioName || mediaNameV121(info.introAudio, 'Built-in Intro Audio'), url: info.introAudio }] : []),
                ...(Array.isArray(info.hoverSounds) ? info.hoverSounds : []),
                ...found
            ]);
            if (!info.introAudio && allAudio.length) {
                const intro = chooseIntroAudioV121(allAudio);
                info.introAudio = intro?.url || '';
                info.introAudioName = intro?.name || '';
            }
            info.hoverSounds = uniqueByUrlV121(allAudio.filter(a => a.url !== info.introAudio));
            return info;
        };
    } catch {}

    // Authoritative built-in hydration: source/runtime discovery + project-folder
    // discovery are merged, then one full populate occurs so Decorations AND Audio
    // are visible without requiring a fake upload/change event.
    try {
        const hydrateBeforeV121 = hydrateBuiltInThemeEditorV30;
        hydrateBuiltInThemeEditorV30 = async function(modal, themeId, themeName){
            const mediaPromise = fetchBuiltInMediaV121(themeId, themeName);
            const result = await hydrateBeforeV121.apply(this, arguments);
            if (!modal) return result;
            let builtIn = false;
            try { builtIn = isBuiltInThemeIdV30(themeId); } catch {}
            if (!builtIn) return result;

            const media = await mediaPromise;
            const override = (() => { try { return getThemeOverrideV25(themeId) || null; } catch { return null; } })();
            const draft = getThemeBuilderDraft(modal);

            const existingImages = Array.isArray(modal._themeBackgroundSvgs) ? modal._themeBackgroundSvgs : [];
            const allowInheritedImages = !override?.replaceBuiltInDecorationsV30;
            const mergedImages = allowInheritedImages
                ? uniqueByUrlV121([...existingImages, ...media.images])
                : existingImages;

            const discoveredIntro = chooseIntroAudioV121(media.audio);
            const effectiveIntro = String(modal._themeIntroAudio || draft.introAudio || discoveredIntro?.url || '');
            const effectiveIntroName = String(modal._themeIntroAudioName || draft.introAudioName || discoveredIntro?.name || '');

            const currentHover = Array.isArray(draft.svgHoverSounds) ? draft.svgHoverSounds : [];
            const discoveredHover = media.audio.filter(x => x.url !== effectiveIntro);
            const mergedHover = uniqueByUrlV121([...currentHover, ...discoveredHover]);

            const shouldRepopulate =
                mergedImages.length !== existingImages.length ||
                (!modal._themeIntroAudio && !!effectiveIntro) ||
                mergedHover.length !== currentHover.length;

            if (shouldRepopulate) {
                populateThemeBuilder(modal, {
                    ...draft,
                    backgroundSvgs: mergedImages,
                    introAudio: effectiveIntro,
                    introAudioName: effectiveIntroName,
                    svgHoverSounds: mergedHover
                });
            } else {
                modal._themeBackgroundSvgs = mergedImages.map(x => ({...x}));
                if (!modal._themeIntroAudio && effectiveIntro) {
                    modal._themeIntroAudio = effectiveIntro;
                    modal._themeIntroAudioName = effectiveIntroName;
                }
            }

            // Built-in source assets are now the inherited baseline, not an edit.
            try {
                const inherited = new Set(modal._builtInInheritedSvgKeysV30 || []);
                media.images.forEach(x => { const k = String(x?.url || ''); if (k) inherited.add(k); });
                modal._builtInInheritedSvgKeysV30 = inherited;
                if (!override?.replaceBuiltInDecorationsV30) modal._builtInArtDirtyV30 = false;
                if (effectiveIntro && !modal._builtInInheritedAudioV30) modal._builtInInheritedAudioV30 = effectiveIntro;
            } catch {}

            forceBuiltInMediaPaintV121(modal);
            queueMicrotask(() => forceBuiltInMediaPaintV121(modal));
            requestAnimationFrame(() => forceBuiltInMediaPaintV121(modal));
            setTimeout(() => forceBuiltInMediaPaintV121(modal), 60);
            return result;
        };
    } catch {}

    // ---------------- Better built-in shadow/radius sampling ----------------
    function shadowMagnitudeV121(value){
        const text = String(value || '').trim();
        if (!text || text === 'none') return 0;
        const layers = text.split(/,(?![^()]*\))/).filter(x => !/\binset\b/i.test(x));
        let best = 0;
        for (const layer of layers) {
            // Strip color functions so their numeric channels aren't mistaken for px.
            const cleaned = layer.replace(/rgba?\([^)]*\)|hsla?\([^)]*\)|#[0-9a-f]{3,8}/gi, ' ');
            const px = [...cleaned.matchAll(/(-?\d*\.?\d+)px/gi)].map(m => Number(m[1]));
            if (px.length < 2) continue;
            const x = Math.abs(px[0] || 0), y = Math.abs(px[1] || 0), blur = Math.abs(px[2] || 0), spread = Math.abs(px[3] || 0);
            // The builder has one Shadow Size control. Translate a soft shadow's
            // blur/spread into the closest visually equivalent amount instead of 0.
            best = Math.max(best, x, y, spread, blur * 0.5);
        }
        return Math.max(0, Math.min(12, Math.round(best)));
    }

    function radiusMagnitudeV121(value){
        const nums = [...String(value || '').matchAll(/(-?\d*\.?\d+)px/gi)].map(m => Math.abs(Number(m[1]))).filter(Number.isFinite);
        return nums.length ? Math.max(...nums) : 0;
    }

    function sampleStylesV121(selectors){
        const shadows = [], radii = [];
        selectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(el => {
                try {
                    const s = getComputedStyle(el);
                    const shadow = shadowMagnitudeV121(s.boxShadow);
                    const radius = radiusMagnitudeV121(s.borderRadius);
                    if (shadow > 0) shadows.push(shadow);
                    if (radius > 0) radii.push(radius);
                } catch {}
            });
        });
        shadows.sort((a,b)=>a-b); radii.sort((a,b)=>a-b);
        const representative = arr => arr.length ? arr[Math.floor((arr.length - 1) * .72)] : 0;
        return { shadow: representative(shadows), radius: representative(radii) };
    }

    try {
        const captureBeforeV121 = captureCurrentThemeBuilderBaseV25;
        captureCurrentThemeBuilderBaseV25 = function(themeId, themeName){
            const base = captureBeforeV121.apply(this, arguments) || {};
            let builtIn = false;
            try { builtIn = isBuiltInThemeIdV30(themeId); } catch {}
            if (!builtIn) return base;

            const general = sampleStylesV121([
                '.day-box', '.icon-btn', '.small-icon-btn', '.phrase-card', '.resource-card',
                '.modal-box', '.toolbox-item', '.filter-tab', '.dashboard-icon', '.dashboard-theme-card'
            ]);
            const category = sampleStylesV121(['.filter-tab', '.category-filter button', '.kb-category-tab', '.quiz-mode-btn']);
            const dashboardCategory = sampleStylesV121(['.category-filter button', '.dashboard-category-filter button', '.dashboard-category-btn']);

            return {
                ...base,
                shadow: general.shadow || Number(base.shadow) || 0,
                radius: general.radius ? Math.max(0, Math.min(30, Math.round(general.radius))) : base.radius,
                kbCategoryShadowSizeV97: category.shadow || Number(base.kbCategoryShadowSizeV97) || 0,
                dashboardCategoryShadowSizeV98: dashboardCategory.shadow || category.shadow || Number(base.dashboardCategoryShadowSizeV98) || 0
            };
        };
    } catch {}
})();

// V122 obsolete bop runtime removed in V369.

// ============================================================
// V123 — BUILT-IN EDITOR MUST OPEN WITH ITS REAL MEDIA ALREADY LOADED
// Flat /svg/theme-name-01.svg assets are common in the project. The server's
// V123 endpoint now discovers those files; this client layer treats that list
// as the authoritative inherited media baseline and does not reveal the editor
// until the Decorations gallery has been painted.
// ============================================================
(function(){
    const IMAGE_RE_V123 = /\.(?:svg|png|jpe?g|webp|gif|avif)(?:[?#].*)?$/i;
    const AUDIO_RE_V123 = /\.(?:mp3|wav|ogg|m4a|aac|flac)(?:[?#].*)?$/i;

    function slugV123(themeId, themeName){
        let slug = String(themeName || '').trim();
        try { slug = getBuiltInThemeNameV30(themeId) || slug; } catch {}
        if (!slug) slug = String(themeId || '').replace(/^theme-/, '');
        return slug.toLowerCase().replace(/[^a-z0-9_-]+/g, '-');
    }

    function displayNameV123(url, fallback){
        try { return decodeURIComponent(String(url || '').split('/').pop().split(/[?#]/)[0]) || fallback; }
        catch { return fallback; }
    }

    function normalizeImageV123(item){
        const url = String(item?.url || '').trim();
        if (!url || !IMAGE_RE_V123.test(url)) return null;
        return {
            ...item,
            name: String(item?.name || displayNameV123(url, 'Built-in Decoration')),
            url,
            inheritedBuiltInV30: true,
            inheritedBuiltInV109: true,
            inheritedBuiltInV121: true,
            inheritedBuiltInV123: true,
            opacityV109: Number.isFinite(Number(item?.opacityV109)) ? Number(item.opacityV109) : 100,
            animation: item?.animation || 'float',
            hoverAnimationV82: item?.hoverAnimationV82 || item?.hoverAnimation || 'auto',
            bopModeV60: item?.bopModeV60 || (item?.introBop === true ? 'always' : 'auto'),
            hiddenOnScreenV63: item?.hiddenOnScreenV63 === true
        };
    }

    function normalizeAudioV123(item){
        const url = String(item?.url || '').trim();
        if (!url || !AUDIO_RE_V123.test(url)) return null;
        return {
            ...item,
            name: String(item?.name || displayNameV123(url, 'Built-in Audio')),
            url,
            inheritedBuiltInV30: true,
            inheritedBuiltInV121: true,
            inheritedBuiltInV123: true
        };
    }

    function uniqueV123(items){
        const seen = new Set();
        return (items || []).filter(Boolean).filter(item => {
            const key = String(item?.url || item?.markup || '').trim();
            if (!key || seen.has(key)) return false;
            seen.add(key);
            return true;
        });
    }

    async function fetchBundleV123(themeId, themeName){
        const slug = slugV123(themeId, themeName);
        if (!slug) return { images: [], audio: [] };
        try {
            const response = await fetch(`/api/built-in-theme-assets/${encodeURIComponent(slug)}`, { cache: 'no-store' });
            if (!response.ok) return { images: [], audio: [] };
            const data = await response.json();
            return {
                images: uniqueV123((Array.isArray(data?.assets) ? data.assets : []).map(normalizeImageV123)),
                audio: uniqueV123((Array.isArray(data?.audio) ? data.audio : (Array.isArray(data?.sounds) ? data.sounds : [])).map(normalizeAudioV123))
            };
        } catch {
            return { images: [], audio: [] };
        }
    }

    function chooseIntroV123(audio){
        if (!audio?.length) return null;
        return [...audio].sort((a,b) => {
            const score = item => {
                const text = `${item?.name || ''} ${item?.url || ''}`.toLowerCase();
                let n = 0;
                if (/intro|opening|theme|song|music/.test(text)) n += 8;
                if (/hover|click|coin|bling|select|sfx|effect/.test(text)) n -= 6;
                return n;
            };
            return score(b) - score(a);
        })[0] || audio[0];
    }

    function forceGalleryV123(modal){
        if (!modal) return;
        const count = Array.isArray(modal._themeBackgroundSvgs) ? modal._themeBackgroundSvgs.length : 0;
        try {
            modal._themeImagePagingKeyV62 = `${modal.dataset.themeBuilderBuiltInSourceV30 || 'built-in'}-v123-${count}`;
            modal._themeImageRenderLimitV62 = Math.max(24, Math.min(Math.max(count, 24), 120));
        } catch {}
        try { renderThemeBuilderSvgListV2(modal); } catch {}
        try {
            const token = Number(modal._themeImageHydrateTokenV62);
            if (Number.isFinite(token) && token > 0) hydrateThemeImageCardsV62(modal, token);
        } catch {}
        try { ensureDecorationOpacityControlsV109(modal); } catch {}
        try { ensurePerDecorationHoverOverridesV89(modal); } catch {}
        try { ensureAcrossScreenControlsV94(modal); } catch {}
        try { applyDecorationCustomizeStateV89(modal); } catch {}
        try { updateThemeBuilderPreview(modal); } catch {}
    }

    function applyBundleV123(modal, themeId, bundle){
        if (!modal) return;
        const override = (() => { try { return getThemeOverrideV25(themeId) || null; } catch { return null; } })();
        const existing = Array.isArray(modal._themeBackgroundSvgs) ? modal._themeBackgroundSvgs.map(normalizeImageV123).filter(Boolean) : [];

        // Untouched built-ins inherit every source decoration. If an edited
        // built-in explicitly replaced its decorations, preserve that edited
        // list exactly rather than resurrecting items the user removed.
        const images = override?.replaceBuiltInDecorationsV30
            ? existing
            : uniqueV123([...existing, ...(bundle.images || [])]);

        modal._themeBackgroundSvgs = images.map(item => ({...item}));

        try {
            const inherited = new Set(modal._builtInInheritedSvgKeysV30 || []);
            (bundle.images || []).forEach(item => { if (item?.url) inherited.add(String(item.url)); });
            modal._builtInInheritedSvgKeysV30 = inherited;
        } catch {}

        const draft = (() => { try { return getThemeBuilderDraft(modal) || {}; } catch { return {}; } })();
        const intro = chooseIntroV123(bundle.audio || []);
        if (!modal._themeIntroAudio && !draft.introAudio && intro?.url) {
            modal._themeIntroAudio = intro.url;
            modal._themeIntroAudioName = intro.name || displayNameV123(intro.url, 'Built-in Intro Audio');
        }

        const introUrl = String(modal._themeIntroAudio || draft.introAudio || '');
        const currentHover = Array.isArray(draft.svgHoverSounds) ? draft.svgHoverSounds : [];
        const hover = uniqueV123([
            ...currentHover,
            ...(bundle.audio || []).filter(item => item?.url && item.url !== introUrl)
        ]);
        modal._themeHoverSounds = hover.map(item => ({...item}));

        forceGalleryV123(modal);
    }

    // Source fallback for flat filenames referenced by an ASSETS array.
    // Previous code assumed every bare SVG lived in /svg/theme-name/file.svg;
    // files already named theme-name-01.svg actually live at /svg/file.svg.
    try {
        const analyzeBeforeV123 = analyzeThemeSourceV30;
        analyzeThemeSourceV30 = function(themeId, source){
            const info = analyzeBeforeV123.apply(this, arguments) || {};
            const slug = slugV123(themeId, '');
            const text = `${String(source?.js || '')}\n${String(source?.css || '')}`;
            const extra = [];
            const re = /["'`]([^"'`\n\r]+?\.(?:svg|png|jpe?g|webp|gif|avif)(?:[?#][^"'`\n\r]*)?)["'`]/gi;
            let match;
            while ((match = re.exec(text))) {
                let ref = String(match[1] || '').trim();
                if (!ref || /^data:|^blob:|^[a-z]+:\/\//i.test(ref)) continue;
                if (ref.startsWith('/')) {
                    extra.push(normalizeImageV123({ url: ref }));
                    continue;
                }
                const clean = ref.replace(/^\.\//, '');
                const base = clean.split('/').pop();
                const lower = String(base || '').toLowerCase();
                if (!clean.includes('/') && (
                    lower.startsWith(`theme-${slug}-`) ||
                    lower.startsWith(`theme_${slug}_`) ||
                    lower.startsWith(`${slug}-`) ||
                    lower.startsWith(`${slug}_`)
                )) {
                    extra.push(normalizeImageV123({ url: `/svg/${base}` }));
                } else if (/^svg\//i.test(clean)) {
                    extra.push(normalizeImageV123({ url: `/${clean}` }));
                }
            }
            info.svgAssets = uniqueV123([...(Array.isArray(info.svgAssets) ? info.svgAssets : []), ...extra]);
            return info;
        };
    } catch {}

    // Hydration gets one final authoritative merge and paint.
    try {
        const hydrateBeforeV123 = hydrateBuiltInThemeEditorV30;
        hydrateBuiltInThemeEditorV30 = async function(modal, themeId, themeName){
            const bundlePromise = fetchBundleV123(themeId, themeName);
            const result = await hydrateBeforeV123.apply(this, arguments);
            let builtIn = false;
            try { builtIn = isBuiltInThemeIdV30(themeId); } catch {}
            if (!modal || !builtIn) return result;
            const bundle = await bundlePromise;
            applyBundleV123(modal, themeId, bundle);
            queueMicrotask(() => forceGalleryV123(modal));
            requestAnimationFrame(() => forceGalleryV123(modal));
            setTimeout(() => forceGalleryV123(modal), 40);
            return result;
        };
    } catch {}

    // Most important UX guarantee: a built-in editor is not revealed with an
    // empty Decorations state. Start discovery at click time, let every older
    // hydration layer run, apply the authoritative media bundle, paint cards,
    // then reveal the modal.
    try {
        const openBeforeV123 = openAnyThemeInBuilderV25;
        openAnyThemeInBuilderV25 = async function(themeId, themeName){
            let builtIn = false;
            try { builtIn = isBuiltInThemeIdV30(themeId); } catch {}
            if (!builtIn) return openBeforeV123.apply(this, arguments);

            const bundlePromise = fetchBundleV123(themeId, themeName);
            const modal = (() => { try { return ensureThemeBuilderModal(); } catch { return null; } })();
            if (modal) {
                modal.classList.add('theme-builder-built-in-loading-v123');
                modal.style.setProperty('visibility', 'hidden', 'important');
                modal.style.setProperty('pointer-events', 'none', 'important');
            }

            try {
                const result = await openBeforeV123.apply(this, arguments);
                const liveModal = document.getElementById('theme-builder-modal') || modal;
                const bundle = await bundlePromise;
                applyBundleV123(liveModal, themeId, bundle);
                // One synchronous render + one animation-frame hydration means
                // the first visible Decorations frame contains actual cards.
                forceGalleryV123(liveModal);
                await new Promise(resolve => requestAnimationFrame(resolve));
                forceGalleryV123(liveModal);
                return result;
            } finally {
                const liveModal = document.getElementById('theme-builder-modal') || modal;
                if (liveModal) {
                    liveModal.classList.remove('theme-builder-built-in-loading-v123');
                    liveModal.style.removeProperty('visibility');
                    liveModal.style.removeProperty('pointer-events');
                }
            }
        };
    } catch {}
})();


// V125 obsolete bop runtime removed in V369.

// ============================================================
// V126 — AUTHORITATIVE BUILT-IN DECORATION RECOVERY + PAGE BG AUTO COLOR
// Built-in editing must never present an empty Decorations gallery when the
// active built-in theme is visibly using art. Recover art from the live theme
// DOM first, then merge project/source discovery from the server, and only
// reveal the editor after that gallery has been rendered.
// ============================================================
(function(){
    const IMAGE_RE_V126 = /\.(?:svg|png|jpe?g|webp|gif|avif)(?:$|[?#])/i;
    const recoveryV126 = new WeakMap();

    function isBuiltInV126(themeId){
        try { return isBuiltInThemeIdV30(themeId); }
        catch {
            return !!themeId && themeId !== 'theme-custom-builder' && !String(themeId).startsWith('theme-custom-builder-');
        }
    }

    function normalizeThemeTokenV126(value){
        return String(value || '')
            .toLowerCase()
            .replace(/^theme[-_]?/, '')
            .replace(/[^a-z0-9]+/g, '');
    }

    function normalizeUrlV126(raw){
        const value = String(raw || '').trim();
        if (!value || /^data:|^blob:/i.test(value)) return '';
        try {
            const u = new URL(value, location.href);
            return u.origin === location.origin ? `${u.pathname}${u.search}${u.hash}` : u.href;
        } catch { return value; }
    }

    function assetNameV126(url, fallback = 'Built-in Decoration'){
        try { return decodeURIComponent(String(url).split('/').pop().split(/[?#]/)[0]) || fallback; }
        catch { return fallback; }
    }

    function assetFromUrlV126(raw, name = ''){
        const url = normalizeUrlV126(raw);
        if (!url || !IMAGE_RE_V126.test(url)) return null;
        return {
            name: name || assetNameV126(url),
            url,
            animation: 'float',
            animationOverride: '',
            hoverAnimationOverrideV82: '',
            bopModeV60: 'auto',
            hiddenOnScreenV63: false,
            opacityV109: 100,
            inheritedBuiltInV30: true,
            inheritedBuiltInV126: true
        };
    }

    function uniqueAssetsV126(items){
        const seen = new Set();
        return (items || []).filter(Boolean).filter(item => {
            const key = String(item?.url || item?.markup || '').trim();
            if (!key || seen.has(key)) return false;
            seen.add(key);
            return true;
        });
    }

    function scanElementV126(root, out, inlineSvgLimit = 80){
        if (!root) return;
        const nodes = [];
        if (root.matches?.('img[src],object[data],image[href],image[xlink\\:href]')) nodes.push(root);
        root.querySelectorAll?.('img[src],object[data],image[href],image[xlink\\:href]').forEach(node => nodes.push(node));
        nodes.forEach(node => {
            const raw = node.getAttribute('src') || node.getAttribute('data') || node.getAttribute('href') || node.getAttribute('xlink:href') || '';
            const asset = assetFromUrlV126(raw, node.getAttribute('alt') || node.getAttribute('aria-label') || '');
            if (asset) out.push(asset);
        });

        // CSS-backed decoration images in the live theme root.
        const cssNodes = [root, ...(root.querySelectorAll ? Array.from(root.querySelectorAll('*')) : [])].slice(0, 900);
        cssNodes.forEach(node => {
            let image = '';
            try { image = getComputedStyle(node).backgroundImage || ''; } catch {}
            const re = /url\((?:["']?)([^)"']+)(?:["']?)\)/gi;
            let match;
            while ((match = re.exec(image))) {
                const asset = assetFromUrlV126(match[1]);
                if (asset) out.push(asset);
            }
        });

        // Inline SVGs are valid built-in decorations too. Keep this bounded so
        // icon-heavy app UI can never create an enormous gallery by accident.
        let count = 0;
        root.querySelectorAll?.('svg').forEach(svg => {
            if (count >= inlineSvgLimit) return;
            if (svg.closest('#theme-builder-modal,.view,.side-nav,.modal-overlay')) return;
            const markup = String(svg.outerHTML || '');
            if (!markup) return;
            out.push({
                name: `Built-in SVG ${count + 1}`,
                markup,
                animation: 'float',
                animationOverride: '',
                hoverAnimationOverrideV82: '',
                bopModeV60: 'auto',
                hiddenOnScreenV63: false,
                opacityV109: 100,
                inheritedBuiltInV30: true,
                inheritedBuiltInV126: true
            });
            count += 1;
        });
    }

    function liveBuiltInAssetsV126(modal, themeId){
        // V127: disabled. Built-in decorations must come only from the exact
        // theme-owned project folders returned by /api/built-in-theme-assets.
        // Scraping the live DOM caused unrelated art to leak into themes whose
        // names happened to share words such as "gold".
        return [];
    }

    function mergeIntoGalleryV126(modal, assets){
        if (!modal || !assets?.length) return 0;
        const existing = Array.isArray(modal._themeBackgroundSvgs) ? modal._themeBackgroundSvgs : [];
        modal._themeBackgroundSvgs = uniqueAssetsV126([...existing, ...assets]).map(item => ({...item}));
        return modal._themeBackgroundSvgs.length;
    }

    function forceGalleryV126(modal){
        if (!modal) return;
        const count = Array.isArray(modal._themeBackgroundSvgs) ? modal._themeBackgroundSvgs.length : 0;
        try {
            modal._themeImagePagingKeyV62 = `${modal.dataset.themeBuilderBuiltInSourceV30 || modal.dataset.themeBuilderEditingThemeV25 || 'built-in'}-v126-${count}`;
            modal._themeImageRenderLimitV62 = Math.max(24, Math.min(180, Math.max(count, 24)));
        } catch {}
        try { renderThemeBuilderSvgListV2(modal); } catch {}
        try {
            const token = Number(modal._themeImageHydrateTokenV62);
            if (Number.isFinite(token) && token > 0) hydrateThemeImageCardsV62(modal, token);
        } catch {}
        try { ensureUnifiedDecorationCustomizationV114(modal); } catch {}
        try { ensureDecorationOpacityControlsV109(modal); } catch {}
        try { ensurePerDecorationHoverOverridesV89(modal); } catch {}
        try { ensureAcrossScreenControlsV94(modal); } catch {}
        try { applyDecorationCustomizeStateV89(modal); } catch {}
        try { applyDecorationOpacityPreviewV109(modal); } catch {}
        try { updateThemeBuilderPreview(modal); } catch {}
    }

    async function fetchProjectAssetsV126(themeId){
        const slug = String(themeId || '').replace(/^theme-/, '').trim();
        if (!slug) return [];
        try {
            const res = await fetch(`/api/built-in-theme-assets/${encodeURIComponent(slug)}`, { cache: 'no-store' });
            if (!res.ok) return [];
            const data = await res.json();
            return uniqueAssetsV126((Array.isArray(data?.assets) ? data.assets : []).map(item => ({
                ...item,
                animation: item?.animation || 'float',
                animationOverride: item?.animationOverride || '',
                hoverAnimationOverrideV82: item?.hoverAnimationOverrideV82 || '',
                bopModeV60: ['auto','always','never'].includes(String(item?.bopModeV60 || '').toLowerCase()) ? String(item.bopModeV60).toLowerCase() : 'auto',
                hiddenOnScreenV63: item?.hiddenOnScreenV63 === true,
                opacityV109: Number.isFinite(Number(item?.opacityV109)) ? Number(item.opacityV109) : 100,
                inheritedBuiltInV30: true,
                inheritedBuiltInV126: true
            })));
        } catch { return []; }
    }

    async function recoverBuiltInGalleryV126(modal, themeId){
        if (!modal || !isBuiltInV126(themeId)) return;
        if (recoveryV126.has(modal)) return recoveryV126.get(modal);
        const task = (async () => {
            // Synchronous live recovery first so the gallery can paint even if
            // the server/source request takes longer.
            mergeIntoGalleryV126(modal, liveBuiltInAssetsV126(modal, themeId));
            forceGalleryV126(modal);

            const projectAssets = await fetchProjectAssetsV126(themeId);
            const savedOverride = (() => { try { return getThemeOverrideV25(themeId) || null; } catch { return null; } })();
            const preserveEditedSet =
                modal._builtInArtDirtyV30 === true ||
                savedOverride?.replaceBuiltInDecorationsV30 === true;
            if (!preserveEditedSet || !(modal._themeBackgroundSvgs?.length)) {
                mergeIntoGalleryV126(modal, projectAssets);
            }

            // V127: no browser-side source scraping here. The server endpoint is
            // authoritative and is restricted to this built-in theme's exact
            // project folder(s).
            forceGalleryV126(modal);
            requestAnimationFrame(() => forceGalleryV126(modal));
        })().finally(() => recoveryV126.delete(modal));
        recoveryV126.set(modal, task);
        return task;
    }

    // Hydration itself now starts with the live runtime snapshot. This prevents
    // older hydrate layers from populating an empty array and then painting the
    // upload-only state over the correct built-in artwork.
    try {
        const hydrateBeforeV126 = hydrateBuiltInThemeEditorV30;
        hydrateBuiltInThemeEditorV30 = async function(modal, themeId, themeName){
            const live = liveBuiltInAssetsV126(modal, themeId);
            const result = await hydrateBeforeV126.apply(this, arguments);
            if (!modal || !isBuiltInV126(themeId)) return result;
            mergeIntoGalleryV126(modal, live);
            await recoverBuiltInGalleryV126(modal, themeId);
            return result;
        };
    } catch {}

    // Keep the whole editor hidden until the real built-in gallery has been
    // recovered. The V123 loader removes inline visibility; this class remains
    // authoritative until V126 is done.
    try {
        const openBeforeV126 = openAnyThemeInBuilderV25;
        openAnyThemeInBuilderV25 = async function(themeId, themeName){
            if (!isBuiltInV126(themeId)) return openBeforeV126.apply(this, arguments);
            const modal = (() => { try { return ensureThemeBuilderModal(); } catch { return null; } })();
            modal?.classList.add('theme-builder-built-in-loading-v126');
            try {
                const result = await openBeforeV126.apply(this, arguments);
                const liveModal = document.getElementById('theme-builder-modal') || modal;
                await recoverBuiltInGalleryV126(liveModal, themeId);
                forceGalleryV126(liveModal);
                await new Promise(resolve => requestAnimationFrame(resolve));
                forceGalleryV126(liveModal);
                return result;
            } finally {
                (document.getElementById('theme-builder-modal') || modal)?.classList.remove('theme-builder-built-in-loading-v126');
            }
        };
    } catch {}

    // If a late legacy redraw somehow clears the list, clicking Decorations
    // immediately repopulates from the still-running built-in theme rather than
    // leaving the user with an Upload Images-only screen.
    if (!window.__themeBuilderDecorationRecoveryV126) {
        window.__themeBuilderDecorationRecoveryV126 = true;
        document.addEventListener('click', event => {
            const modal = event.target?.closest?.('#theme-builder-modal');
            if (!modal || modal.classList.contains('hidden')) return;
            const button = event.target.closest('button');
            if (!button || !/decorations/i.test(String(button.textContent || ''))) return;
            const themeId = modal.dataset.themeBuilderBuiltInSourceV30 || modal.dataset.themeBuilderEditingThemeV25 || '';
            if (!isBuiltInV126(themeId)) return;
            if (!Array.isArray(modal._themeBackgroundSvgs) || !modal._themeBackgroundSvgs.length) {
                mergeIntoGalleryV126(modal, liveBuiltInAssetsV126(modal, themeId));
                forceGalleryV126(modal);
            }
            recoverBuiltInGalleryV126(modal, themeId);
        }, true);
    }

    // Automatic Color Distributor: explicitly choose Page Background Color.
    // The field lives in the Background tab now, so make it an authoritative
    // post-distributor write instead of relying on whatever controls happened
    // to be in the Colors panel when the distributor was originally created.
    function validHexV126(value, fallback = '#8b6fd8'){
        const text = String(value || '').trim();
        return /^#[0-9a-f]{6}$/i.test(text) ? text : fallback;
    }
    function mixHexV126(a, b, amount){
        const parse = hex => {
            const s = validHexV126(hex).slice(1);
            return [0,2,4].map(i => parseInt(s.slice(i,i+2),16));
        };
        const x = parse(a), y = parse(b), t = Math.max(0, Math.min(1, Number(amount) || 0));
        return '#' + x.map((v,i) => Math.round(v + (y[i] - v) * t).toString(16).padStart(2,'0')).join('');
    }
    function setPageBackgroundV126(modal, seed){
        if (!modal) return;
        const page = mixHexV126(validHexV126(seed), '#ffffff', .94);
        const picker = modal.querySelector('input[type="color"][data-theme-key="background"]');
        const hex = modal.querySelector('[data-theme-hex="background"]');
        if (picker) picker.value = page;
        if (hex) hex.value = page;
        try { updateThemeBuilderPreview(modal); } catch {}
    }
    if (!window.__themeBuilderAutoPageBgV126) {
        window.__themeBuilderAutoPageBgV126 = true;
        document.addEventListener('click', event => {
            const button = event.target.closest('.theme-builder-auto-apply-v107');
            const modal = button?.closest('#theme-builder-modal');
            if (!button || !modal) return;
            const seed = modal.querySelector('.theme-builder-auto-seed-picker-v107')?.value ||
                         modal.querySelector('.theme-builder-auto-seed-hex-v107')?.value || '#8b6fd8';
            queueMicrotask(() => setPageBackgroundV126(modal, seed));
            requestAnimationFrame(() => setPageBackgroundV126(modal, seed));
        }, true);
    }
})();


// ============================================================================
// V369 — SINGLE AUTHORITATIVE INTRO-SONG BOP RUNTIME
// Replaces V117/V119/V122/V125/V127 bop ownership. Event-driven only: no
// animation-frame watcher. A deterministic, spatially balanced subset bops;
// even the legacy "all" mode is capped so the whole scene never bops at once.
// ============================================================================
(function(){
  'use strict';
  if(window.__loggyIntroBopV369)return;
  window.__loggyIntroBopV369=true;

  const bound=new WeakMap();
  const clamp=(v,min,max,fallback)=>Math.max(min,Math.min(max,Number.isFinite(Number(v))?Number(v):fallback));
  const fullAssets=theme=>Array.isArray(theme?.backgroundSvgs)?theme.backgroundSvgs:[];
  const hidden=a=>!!(a&&(a.hiddenOnScreenV63===true||a.hidden===true||a.enabled===false||a.showOnScreen===false||a.visible===false||a.visibleV63===false));
  const pref=a=>String(a?.bopModeV60||'auto').toLowerCase();
  const intensity=theme=>clamp(theme?.introSvgBopIntensityV369,25,200,100);

  function stageItems(stage){
    if(!stage)return[];
    return Array.from(stage.querySelectorAll([
      ':scope > .custom-theme-background-svg',
      ':scope > .theme-builder-live-art-item',
      ':scope > .theme-builder-dashboard-art-item-v45',
      ':scope > .theme-builder-dashboard-art-item-v40',
      ':scope > .theme-builder-dashboard-art-item'
    ].join(','))).filter(item=>item.dataset.themeCrossCloneV350!=='true');
  }
  function assetFor(item,index,theme){
    const all=fullAssets(theme),stored=Number(item?.dataset?.svgIndex);
    if(Number.isFinite(stored)&&stored>=0&&all[stored])return all[stored];
    const visible=all.filter(a=>!hidden(a));
    return visible[index]||all[index]||{};
  }
  function pointFor(record,stageRect){
    const el=record.item;
    let x=parseFloat(el?.style?.left||''),y=parseFloat(el?.style?.top||'');
    if(!Number.isFinite(x)||!Number.isFinite(y)){
      const rect=el?.getBoundingClientRect?.();
      if(rect&&stageRect&&stageRect.width&&stageRect.height){
        x=((rect.left+rect.width/2-stageRect.left)/stageRect.width)*100;
        y=((rect.top+rect.height/2-stageRect.top)/stageRect.height)*100;
      }
    }
    if(!Number.isFinite(x))x=8+((record.index*37+13)%84);
    if(!Number.isFinite(y))y=8+((record.index*53+17)%84);
    return{...record,x,y};
  }
  function smartTarget(count,mode){
    if(count<=1)return count;
    const ratio=String(mode||'some').toLowerCase()==='all'
      ? (count<=6?.60:count<=14?.66:.70)
      : (count<=6?.45:count<=14?.52:.58);
    return Math.max(1,Math.min(count-1,Math.round(count*ratio)));
  }
  function selectedIndexes(items,theme){
    const records=items.map((item,index)=>({item,index,asset:assetFor(item,index,theme)}))
      .filter(r=>!hidden(r.asset)&&pref(r.asset)!=='never');
    const target=smartTarget(records.length,theme?.introSvgBopMode||'some');
    if(!target)return new Set();
    const stageRect=items[0]?.parentElement?.getBoundingClientRect?.()||null;
    const remaining=records.map(r=>pointFor(r,stageRect));
    const chosen=[];
    // Explicit "always" is treated as priority, but strict scene balance still
    // caps the total so at least one eligible decoration remains calm.
    remaining.sort((a,b)=>(pref(b.asset)==='always'?1:0)-(pref(a.asset)==='always'?1:0)||a.index-b.index);
    while(chosen.length<target&&remaining.length){
      let best=0,bestScore=-Infinity;
      for(let i=0;i<remaining.length;i++){
        const p=remaining[i];
        let minDist=chosen.length?Infinity:0;
        for(const c of chosen){const dx=(p.x-c.x)/100,dy=(p.y-c.y)/100;minDist=Math.min(minDist,dx*dx+dy*dy)}
        const q=(p.x>=50?1:0)+(p.y>=50?2:0);
        const qCount=chosen.reduce((sum,c)=>sum+((((c.x>=50?1:0)+(c.y>=50?2:0))===q)?1:0),0);
        const priority=pref(p.asset)==='always'?.35:0;
        const score=priority+(chosen.length?minDist:Math.hypot(p.x-8,p.y-8)/100)-qCount*.025;
        if(score>bestScore){bestScore=score;best=i}
      }
      chosen.push(remaining.splice(best,1)[0]);
    }
    return new Set(chosen.map(r=>r.index));
  }
  function ensureBopShell(item){
    const motion=item?.querySelector?.(':scope > .theme-svg-motion-shell, :scope > .theme-image-motion-shell-v36, :scope > .dashboard-shared-motion-v41')||
      item?.querySelector?.('.theme-svg-motion-shell,.theme-image-motion-shell-v36,.dashboard-shared-motion-v41');
    if(!motion)return null;
    const host=motion.querySelector(':scope > .loggy-default-motion-layer-v362, :scope > .dashboard-default-motion-layer-v362')||motion;
    let shell=host.querySelector(':scope > .theme-bop-shell-v369');
    if(shell)return shell;
    shell=document.createElement('div');shell.className='theme-bop-shell-v369';
    shell.style.cssText='display:block;width:100%;height:100%;transform-origin:center center;will-change:transform;';
    Array.from(host.childNodes).forEach(node=>shell.appendChild(node));
    host.appendChild(shell);
    return shell;
  }
  function stopShell(shell){
    if(!shell)return;
    try{shell._loggyBopV369?.cancel?.()}catch{}
    shell._loggyBopV369=null;
    shell.style.removeProperty('transform');
  }
  function clear(stage){
    stageItems(stage).forEach(item=>{item.classList.remove('theme-bop-selected-v369','theme-svg-intro-bop-selected');stopShell(item.querySelector('.theme-bop-shell-v369'))});
    stage?.classList.remove('theme-bop-active-v369','theme-svg-intro-active','theme-svg-intro-bop-enabled','theme-svg-intro-bop-all');
  }
  function apply(stage,theme){
    if(!stage)return;
    clear(stage);
    if(theme?.introSvgBounceEnabled!==true)return;
    const items=stageItems(stage),selected=selectedIndexes(items,theme),amp=intensity(theme)/100;
    stage.classList.add('theme-bop-active-v369');
    items.forEach((item,index)=>{
      if(!selected.has(index))return;
      item.classList.add('theme-bop-selected-v369');
      const shell=ensureBopShell(item);if(!shell)return;
      const source=Number(item.dataset.svgIndex),phase=Number.isFinite(source)?source:index;
      const y=15*amp,scale=1+(.075*amp),rot=.6*amp,duration=400+((phase%4)*28);
      try{
        const anim=shell.animate([
          {transform:`translate3d(0,0,0) scale(1) rotate(${-0.4*amp}deg)`},
          {transform:`translate3d(0,${-y}px,0) scale(${scale}) rotate(${rot}deg)`}
        ],{duration,easing:'cubic-bezier(.36,.07,.19,.97)',iterations:Infinity,direction:'alternate',fill:'both'});
        anim.currentTime=(phase%9)*55;
        shell._loggyBopV369=anim;
      }catch{}
    });
  }
  function bindAudio(audio,getStage,getTheme,isCurrent){
    if(!audio)return;
    let state=bound.get(audio);
    if(!state){
      state={getStage,getTheme,isCurrent};bound.set(audio,state);
      const sync=()=>{
        let current=true;try{current=state.isCurrent?state.isCurrent():true}catch{}
        const stage=state.getStage?.();if(!current){clear(stage);return}
        if(!audio.paused&&!audio.ended)apply(stage,state.getTheme?.()||{});else clear(stage);
      };
      audio.addEventListener('play',sync);audio.addEventListener('playing',sync);
      audio.addEventListener('pause',sync);audio.addEventListener('ended',sync);audio.addEventListener('error',sync);audio.addEventListener('abort',sync);
      state.sync=sync;
    }else{state.getStage=getStage;state.getTheme=getTheme;state.isCurrent=isCurrent}
    state.sync?.();
  }
  function builderStage(modal){return modal?.querySelector('.theme-builder-live-art-stage-v61,.theme-builder-dashboard-art-stage-v45,.theme-builder-dashboard-art-stage,.theme-builder-live-art-stage')||null}
  function builderTheme(modal){
    let d={};try{d=getThemeBuilderDraft(modal)||{}}catch{}
    if(Array.isArray(modal?._themeBackgroundSvgs))d.backgroundSvgs=modal._themeBackgroundSvgs;
    return d;
  }
  try{const before=mountCustomThemeBackgroundSvgsV2;mountCustomThemeBackgroundSvgsV2=function(theme){const r=before.apply(this,arguments);requestAnimationFrame(()=>{let a=null;try{a=customThemeIntroAudioV2}catch{};const st=document.getElementById('custom-theme-background-stage');if(a&&!a.paused&&!a.ended)apply(st,theme||{});else clear(st)});return r}}catch{}
  try{const before=playCustomThemeIntroAudioV2;playCustomThemeIntroAudioV2=function(theme){const r=before.apply(this,arguments);let a=null;try{a=customThemeIntroAudioV2}catch{};bindAudio(a,()=>document.getElementById('custom-theme-background-stage'),()=>theme||{},()=>{try{return customThemeIntroAudioV2===a}catch{return true}});return r}}catch{}
  try{const before=previewThemeBuilderIntroV10;previewThemeBuilderIntroV10=function(modal){const r=before.apply(this,arguments);const a=modal?._themeBuilderIntroPreviewAudioV10||null;bindAudio(a,()=>builderStage(modal),()=>builderTheme(modal),()=>modal?._themeBuilderIntroPreviewAudioV10===a);return r}}catch{}
  try{const before=updateThemeBuilderPreview;updateThemeBuilderPreview=function(modal){const r=before.apply(this,arguments);requestAnimationFrame(()=>{const a=modal?._themeBuilderIntroPreviewAudioV10,st=builderStage(modal);if(a&&!a.paused&&!a.ended)apply(st,builderTheme(modal));else clear(st)});return r}}catch{}
  try{const before=stopThemeBuilderIntroPreviewV10;stopThemeBuilderIntroPreviewV10=function(modal){clear(builderStage(modal));return before.apply(this,arguments)}}catch{}
  window.__loggyIntroBopV369={apply,clear,selectedIndexes};
})();

// ============================================================
// V130 — ONE PAGE BACKGROUND COLOR + SMART AUTO BACKDROP COLOR
// ============================================================
(function(){
    function hexV130(value, fallback = '#f7f5fb') {
        const s = String(value || '').trim();
        return /^#[0-9a-f]{6}$/i.test(s) ? s.toLowerCase() : fallback;
    }
    function rgbV130(hex) {
        const s = hexV130(hex).slice(1);
        return [0,2,4].map(i => parseInt(s.slice(i, i + 2), 16));
    }
    function toHexV130(rgb) {
        return '#' + rgb.map(v => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0')).join('');
    }
    function mixV130(a, b, t) {
        const x = rgbV130(a), y = rgbV130(b), k = Math.max(0, Math.min(1, Number(t) || 0));
        return toHexV130(x.map((v,i) => v + (y[i] - v) * k));
    }
    function lumV130(hex) {
        const c = rgbV130(hex).map(v => {
            v /= 255;
            return v <= .04045 ? v / 12.92 : Math.pow((v + .055) / 1.055, 2.4);
        });
        return .2126*c[0] + .7152*c[1] + .0722*c[2];
    }
    function contrastV130(a,b) {
        const x = lumV130(a), y = lumV130(b);
        return (Math.max(x,y)+.05)/(Math.min(x,y)+.05);
    }
    function distanceV130(a,b) {
        const x = rgbV130(a), y = rgbV130(b);
        return Math.hypot(x[0]-y[0], x[1]-y[1], x[2]-y[2]);
    }

    function onePageColorV130(modal) {
        if (!modal) return;
        const section = modal.querySelector('.theme-builder-background-controls');
        if (!section) return;

        // Remove the two historical independent backdrop color fields.
        ['dailyLogBackgroundColor','contentBackdropColor'].forEach(key => {
            modal.querySelectorAll(`[data-theme-key="${key}"], [data-theme-hex="${key}"]`).forEach(control => {
                const field = control.closest('.theme-builder-field');
                if (field) field.remove();
            });
        });

        // Keep exactly one authoritative base/page background field.
        const backgroundControls = Array.from(modal.querySelectorAll('[data-theme-key="background"], [data-theme-hex="background"]'));
        const fields = [];
        backgroundControls.forEach(control => {
            const field = control.closest('.theme-builder-field');
            if (field && !fields.includes(field)) fields.push(field);
        });
        let keep = fields.find(field => section.contains(field)) || fields[0] || null;
        fields.forEach(field => { if (field !== keep) field.remove(); });
        if (keep && !section.contains(keep)) {
            const heading = section.querySelector('.theme-builder-control-heading');
            heading?.insertAdjacentElement('afterend', keep);
        }
        if (keep) {
            keep.classList.add('theme-builder-page-background-color-v130');
            const label = keep.querySelector(':scope > span');
            if (label) label.textContent = 'Page Background Color';
        }

        // Clarify the remaining controls: they now adjust opacity/on-off only.
        const dailyLabel = modal.querySelector('.theme-builder-daily-backdrop-details');
        const otherLabel = modal.querySelector('.theme-builder-other-backdrop-details');
        dailyLabel?.setAttribute('data-v130-shared-color','true');
        otherLabel?.setAttribute('data-v130-shared-color','true');
    }

    function syncBackdropColorV130(theme) {
        if (!theme || typeof theme !== 'object') return theme;
        const bg = hexV130(theme.background, theme.dailyLogBackgroundColor || theme.contentBackdropColor || '#f7f5fb');
        theme.background = bg;
        theme.dailyLogBackgroundColor = bg;
        theme.contentBackdropColor = bg;
        return theme;
    }

    // All draft/save/preview paths use the single page color for both backdrop layers.
    try {
        const beforeDraftV130 = getThemeBuilderDraft;
        getThemeBuilderDraft = function(modal) {
            const draft = beforeDraftV130.apply(this, arguments);
            return syncBackdropColorV130(draft);
        };
    } catch {}

    try {
        const beforePopulateV130 = populateThemeBuilder;
        populateThemeBuilder = function(modal, theme = {}) {
            const result = beforePopulateV130(modal, syncBackdropColorV130({...theme}));
            onePageColorV130(modal);
            requestAnimationFrame(() => onePageColorV130(modal));
            setTimeout(() => onePageColorV130(modal), 80);
            return result;
        };
    } catch {}

    function setColorFieldV130(modal, key, value) {
        const color = hexV130(value);
        const picker = modal.querySelector(`input[type="color"][data-theme-key="${key}"]`);
        const hex = modal.querySelector(`[data-theme-hex="${key}"]`);
        if (picker) {
            picker.value = color;
            picker.dispatchEvent(new Event('input', { bubbles:true }));
        }
        if (hex) hex.value = color;
        return color;
    }

    function smartPageBackgroundV130(modal, seed) {
        if (!modal) return;
        const base = hexV130(seed, '#8b6fd8');
        const text = hexV130(modal.querySelector('input[type="color"][data-theme-key="text"]')?.value, '#171717');
        const surface = hexV130(modal.querySelector('input[type="color"][data-theme-key="surface"]')?.value, '#ffffff');
        const textIsLight = lumV130(text) > .52;

        const candidates = textIsLight
            ? [.18,.28,.38,.48,.58,.68,.76].map(t => mixV130(base, '#000000', t))
            : [.68,.76,.82,.87,.91,.94,.96].map(t => mixV130(base, '#ffffff', t));

        let best = candidates[0];
        let bestScore = -Infinity;
        for (const c of candidates) {
            const contrast = contrastV130(c, text);
            const separation = distanceV130(c, surface);
            // Favor WCAG-strong text contrast first, then enough visual separation
            // from cards while retaining more of the seed color when scores tie.
            const passBonus = contrast >= 7 ? 120 : (contrast >= 4.5 ? 65 : 0);
            const separationScore = Math.min(45, separation * .22);
            const extremePenalty = (!textIsLight && lumV130(c) < .78) || (textIsLight && lumV130(c) > .28) ? 18 : 0;
            const score = passBonus + contrast * 8 + separationScore - extremePenalty;
            if (score > bestScore) { bestScore = score; best = c; }
        }
        setColorFieldV130(modal, 'background', best);
        try { updateThemeBuilderPreview(modal); } catch {}
        return best;
    }

    // Override the V126 simplistic page-background post-write with a smarter
    // final pass after the distributor has generated the rest of the palette.
    if (!window.__themeBuilderSmartBackdropV130) {
        window.__themeBuilderSmartBackdropV130 = true;
        document.addEventListener('click', event => {
            const button = event.target.closest('.theme-builder-auto-apply-v107');
            const modal = button?.closest('#theme-builder-modal');
            if (!button || !modal) return;
            const seed = modal.querySelector('.theme-builder-auto-seed-picker-v107')?.value ||
                         modal.querySelector('.theme-builder-auto-seed-hex-v107')?.value || '#8b6fd8';
            // Run after every older distributor/post-distributor layer.
            setTimeout(() => {
                smartPageBackgroundV130(modal, seed);
                onePageColorV130(modal);
            }, 0);
            requestAnimationFrame(() => requestAnimationFrame(() => {
                smartPageBackgroundV130(modal, seed);
                onePageColorV130(modal);
            }));
        }, true);
    }

    // V133 PERFORMANCE FIX: do NOT watch the entire document for DOM changes.
    // Theme Builder population creates a large number of nodes; the old
    // subtree MutationObserver re-ran onePageColorV130 for nearly every one of
    // those mutations and made Edit Theme feel extremely slow. The populate
    // wrapper above plus the distributor hook are the authoritative places to
    // enforce the single Page Background Color field.
})();

// ============================================================
// V131 — FAST NON-BLOCKING BUILT-IN THEME EDIT
// Open the Theme Builder immediately. Built-in decoration/audio discovery is
// allowed to finish in the background instead of hiding the entire editor.
// Also dedupe the many legacy requests to the exact same built-in asset route.
// ============================================================
(function(){
    // Multiple historical hydration layers request the same endpoint during one
    // Edit Theme action. Share one in-flight/short-lived response so the server
    // scans the theme folders only once.
    if (!window.__themeAssetFetchCacheV131) {
        window.__themeAssetFetchCacheV131 = new Map();
        const originalFetchV131 = window.fetch.bind(window);
        window.fetch = function(input, init){
            let url = '';
            try { url = typeof input === 'string' ? input : String(input?.url || ''); } catch {}
            const method = String(init?.method || (typeof input !== 'string' ? input?.method : '') || 'GET').toUpperCase();
            if (method === 'GET' && /^\/api\/built-in-theme-assets\//.test(url)) {
                const key = url;
                const now = Date.now();
                const hit = window.__themeAssetFetchCacheV131.get(key);
                if (hit && hit.expires > now) {
                    return hit.promise.then(response => response.clone());
                }
                const promise = originalFetchV131(input, { ...(init || {}), cache: 'default' })
                    .then(response => response)
                    .catch(error => {
                        window.__themeAssetFetchCacheV131.delete(key);
                        throw error;
                    });
                window.__themeAssetFetchCacheV131.set(key, { promise, expires: now + 15000 });
                return promise.then(response => response.clone());
            }
            return originalFetchV131(input, init);
        };
    }

    function isBuiltInV131(themeId){
        try { return isBuiltInThemeIdV30(themeId); }
        catch { return !!themeId && themeId !== 'theme-custom-builder' && !String(themeId).startsWith('theme-custom-builder-'); }
    }

    function revealV131(modal){
        if (!modal) return;
        modal.classList.remove('theme-builder-built-in-loading-v123','theme-builder-built-in-loading-v126');
        modal.style.removeProperty('visibility');
        modal.style.removeProperty('pointer-events');
        // Once the base editor has begun populating, never let an older loader
        // hide it again while media hydration continues.
        if (modal.dataset.themeBuilderEditingThemeV25 || modal.dataset.themeBuilderBuiltInSourceV30) {
            modal.classList.remove('hidden');
        }
    }

    try {
        const openBeforeV131 = openAnyThemeInBuilderV25;
        openAnyThemeInBuilderV25 = function(themeId, themeName){
            if (!isBuiltInV131(themeId)) return openBeforeV131.apply(this, arguments);

            const modal = (() => { try { return ensureThemeBuilderModal(); } catch { return null; } })();
            let observer = null;
            let settled = false;

            const keepVisible = () => {
                if (settled) return;
                const live = document.getElementById('theme-builder-modal') || modal;
                revealV131(live);
            };

            if (modal) {
                try {
                    observer = new MutationObserver(keepVisible);
                    observer.observe(modal, { attributes: true, attributeFilter: ['class','style'] });
                } catch {}
            }

            // Do not await here before allowing paint. The underlying opener
            // still performs every normal capture/hydration step and returns the
            // same promise to callers, but its visibility guards are neutralized.
            let result;
            try { result = openBeforeV131.apply(this, arguments); }
            catch (error) {
                settled = true;
                try { observer?.disconnect(); } catch {}
                throw error;
            }

            queueMicrotask(keepVisible);
            requestAnimationFrame(keepVisible);
            setTimeout(keepVisible, 0);
            setTimeout(keepVisible, 35);
            setTimeout(keepVisible, 100);

            if (result && typeof result.then === 'function') {
                return result.finally(() => {
                    settled = true;
                    try { observer?.disconnect(); } catch {}
                    revealV131(document.getElementById('theme-builder-modal') || modal);
                    // Heavy gallery/preview work happens after the visible shell
                    // has had a chance to paint.
                    requestAnimationFrame(() => {
                        const live = document.getElementById('theme-builder-modal') || modal;
                        try { forceGalleryV126?.(live); } catch {}
                        try { updateThemeBuilderPreview(live); } catch {}
                    });
                });
            }

            settled = true;
            try { observer?.disconnect(); } catch {}
            revealV131(document.getElementById('theme-builder-modal') || modal);
            return result;
        };
    } catch {}
})();


// ============================================================
// V132 — INSTANT EDIT SHELL + BUILT-IN BASE SNAPSHOT CACHE
// The original V25 edit flow applies a built-in theme, waits for its CSS and
// captures computed values before finishing the editor population. Keep that
// accurate first capture, but never make the click wait before the modal can
// paint, and reuse the captured base for later edits in this session.
// ============================================================
(function(){
    const baseCacheV132 = window.__themeBuilderBaseCacheV132 || (window.__themeBuilderBaseCacheV132 = new Map());

    function builtInV132(id){
        try { return isBuiltInThemeIdV30(id); }
        catch { return !!id && id !== 'theme-custom-builder' && !String(id).startsWith('theme-custom-builder-'); }
    }

    // Cache the exact computed base whenever the normal accurate capture path
    // runs. This does not alter the first capture; it only makes later opens
    // instantaneous.
    try {
        const captureBeforeV132 = captureCurrentThemeBuilderBaseV25;
        captureCurrentThemeBuilderBaseV25 = function(themeId, themeName){
            const value = captureBeforeV132.apply(this, arguments);
            if (builtInV132(themeId) && value && typeof value === 'object') {
                try { baseCacheV132.set(String(themeId), structuredClone(value)); }
                catch { try { baseCacheV132.set(String(themeId), JSON.parse(JSON.stringify(value))); } catch {} }
            }
            return value;
        };
    } catch {}

    function showShellV132(modal, themeId){
        if (!modal) return;
        modal.dataset.themeBuilderEditingThemeV25 = String(themeId || '');
        modal.dataset.themeBuilderMode = 'edit-existing-theme';
        modal.classList.remove(
            'hidden',
            'theme-builder-built-in-loading-v123',
            'theme-builder-built-in-loading-v126'
        );
        modal.style.removeProperty('visibility');
        modal.style.removeProperty('pointer-events');
        // Prevent an old loading class/inline style from being restored by a
        // historical observer during the first paint.
        requestAnimationFrame(() => {
            modal.classList.remove('hidden','theme-builder-built-in-loading-v123','theme-builder-built-in-loading-v126');
            modal.style.removeProperty('visibility');
            modal.style.removeProperty('pointer-events');
        });
    }

    function cloneV132(value){
        try { return structuredClone(value); }
        catch { try { return JSON.parse(JSON.stringify(value)); } catch { return value; } }
    }

    // Fast path after a built-in has been captured once. This bypasses the
    // expensive applyTheme -> CSS wait -> computed-style recapture cycle.
    function openCachedV132(themeId, themeName, base){
        const modal = document.getElementById('theme-builder-modal') || ensureThemeBuilderModal();
        const previousTheme = db.settings.theme || 'default';
        modal._themeEditPreviousThemeV25 = previousTheme;
        modal._themeEditSavedV25 = false;
        modal.dataset.themeBuilderEditingThemeV25 = String(themeId || '');
        modal.dataset.themeBuilderMode = 'edit-existing-theme';
        try { bindThemeBuilderEditCancelV25(modal); } catch {}

        const existingOverride = (() => { try { return getThemeOverrideV25(themeId); } catch { return null; } })();
        const editTheme = {
            ...cloneV132(base),
            ...(existingOverride || {}),
            name: existingOverride?.name || themeName || base?.name || themeId
        };

        populateThemeBuilder(modal, editTheme);
        try {
            modal.querySelector('.theme-builder-save').onclick = () => saveThemeOverrideV25(modal);
        } catch {}
        showShellV132(modal, themeId);

        // Exact built-in media can hydrate after the modal is already usable.
        setTimeout(() => {
            try { recoverBuiltInGalleryV126?.(modal, themeId); } catch {}
            try { hydrateBuiltInThemeEditorV30?.(modal, themeId, themeName); } catch {}
        }, 0);
        return Promise.resolve();
    }

    try {
        const openBeforeV132 = openAnyThemeInBuilderV25;
        openAnyThemeInBuilderV25 = function(themeId, themeName){
            if (!builtInV132(themeId)) return openBeforeV132.apply(this, arguments);

            const cached = baseCacheV132.get(String(themeId));
            if (cached) return openCachedV132(themeId, themeName, cached);

            // First-ever capture of this built-in: reveal the existing modal
            // shell now, then yield a full frame before starting the expensive
            // accurate capture. This guarantees the click itself never blocks
            // the browser from painting the Theme Builder.
            const modal = document.getElementById('theme-builder-modal') || (() => {
                try { return ensureThemeBuilderModal(); } catch { return null; }
            })();
            showShellV132(modal, themeId);

            return new Promise((resolve, reject) => {
                requestAnimationFrame(() => {
                    setTimeout(() => {
                        let result;
                        try { result = openBeforeV132.apply(this, arguments); }
                        catch (error) { reject(error); return; }
                        Promise.resolve(result).then(resolve, reject);
                    }, 0);
                });
            });
        };
    } catch {}

    // Pre-create the builder while the app is idle so the first Edit click does
    // not also pay the large DOM-construction cost.
    const prewarmV132 = () => {
        if (document.getElementById('theme-builder-modal')) return;
        try {
            const modal = ensureThemeBuilderModal();
            modal?.classList.add('hidden');
        } catch {}
    };
    if ('requestIdleCallback' in window) requestIdleCallback(prewarmV132, {timeout: 1200});
    else setTimeout(prewarmV132, 350);
})();

// ============================================================================
// V134 — BUILT-IN DECORATION DELETE = REMOVE FROM LIVE SOURCE + REVERSIBLE BACKUP
// ============================================================================
(function(){
    function builtInIdV134(modal){
        return String(
            modal?.dataset?.themeBuilderBuiltInSourceV30 ||
            modal?.dataset?.themeBuilderEditingThemeV25 ||
            ''
        );
    }

    function builtInSlugV134(themeId){
        return String(themeId || '').replace(/^theme-/, '').trim().toLowerCase();
    }

    function isBuiltInEditorV134(modal){
        const id = builtInIdV134(modal);
        if (!id || id === 'theme-custom-builder' || id.startsWith('theme-custom-builder-')) return false;
        try { return isBuiltInThemeIdV30(id); } catch { return true; }
    }

    function assetKeyV134(asset){
        return String(asset?.url || asset?.projectPath || asset?.markup || asset?.name || '').trim();
    }

    function isInheritedAssetV134(asset){
        if (!asset) return false;
        if (
            asset.inheritedBuiltInV30 || asset.inheritedBuiltInV109 ||
            asset.inheritedBuiltInV121 || asset.inheritedBuiltInV123 ||
            asset.inheritedBuiltInV126 || asset.inheritedBuiltInV127
        ) return true;
        const url = String(asset.url || '');
        return /^\/(?:svg\/|themes\/)/i.test(url) && !/\/custom-builder-/i.test(url);
    }

    function pendingSetV134(modal){
        if (!(modal?._builtInPendingRemovedAssetsV134 instanceof Map)) {
            modal._builtInPendingRemovedAssetsV134 = new Map();
        }
        return modal._builtInPendingRemovedAssetsV134;
    }

    function rememberRemovedV134(modal, candidates){
        if (!isBuiltInEditorV134(modal)) return;
        const currentKeys = new Set((modal._themeBackgroundSvgs || []).map(assetKeyV134));
        const pending = pendingSetV134(modal);
        for (const asset of candidates || []) {
            const key = assetKeyV134(asset);
            if (!key || currentKeys.has(key) || !isInheritedAssetV134(asset) || !asset?.url) continue;
            pending.set(key, { ...asset });
        }
        if (pending.size) modal._builtInArtDirtyV30 = true;
    }

    async function archiveBuiltInAssetsV134(modal, assets){
        const themeId = builtInIdV134(modal);
        const slug = builtInSlugV134(themeId);
        const urls = [...new Set((assets || []).map(a => String(a?.url || '')).filter(Boolean))];
        if (!slug || !urls.length) return { ok: true, moved: [] };

        try {
            const response = await fetch(`/api/built-in-theme-assets/${encodeURIComponent(slug)}/remove`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ urls })
            });
            const data = await response.json().catch(() => ({}));
            if (!response.ok || data?.status !== 'success') {
                showFeatureToast(data?.message || 'Could not remove the deleted built-in image from its theme folder.');
                return { ok: false, data };
            }
            try { window.__themeAssetFetchCacheV131?.clear?.(); } catch {}
            return { ok: true, data };
        } catch (error) {
            showFeatureToast('Could not update the built-in theme image folder. Make sure you replaced server.js and restarted Node.');
            return { ok: false, error };
        }
    }

    async function restoreBuiltInAssetsV134(themeId){
        const slug = builtInSlugV134(themeId);
        if (!slug) return { ok: true };
        try {
            const response = await fetch(`/api/built-in-theme-assets/${encodeURIComponent(slug)}/restore`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: '{}'
            });
            const data = await response.json().catch(() => ({}));
            if (!response.ok || data?.status !== 'success') {
                showFeatureToast(data?.message || 'Could not restore the original built-in theme images.');
                return { ok: false, data };
            }
            try { window.__themeAssetFetchCacheV131?.clear?.(); } catch {}
            return { ok: true, data };
        } catch (error) {
            showFeatureToast('Could not restore the original built-in images. Make sure you replaced server.js and restarted Node.');
            return { ok: false, error };
        }
    }

    function notifyBuiltInAssetsChangedV134(themeId, restored = false){
        try {
            window.parent?.postMessage({
                type: 'theme-builder-built-in-assets-changed-v134',
                themeId: String(themeId || ''),
                restored: !!restored
            }, window.location.origin);
        } catch {}
    }

    // Record single-image deletions after the user's confirmation has actually
    // removed the card from the working array.
    try {
        const before = confirmDeleteThemeBuilderSvg;
        confirmDeleteThemeBuilderSvg = async function(modal, index){
            const candidate = modal?._themeBackgroundSvgs?.[Number(index)];
            const result = await before.apply(this, arguments);
            rememberRemovedV134(modal, candidate ? [candidate] : []);
            return result;
        };
    } catch {}

    // File-style selection is the primary deletion UI in the current builder.
    try {
        const before = deleteSelectedThemeImagesV37;
        deleteSelectedThemeImagesV37 = async function(modal, explicitIndexes = null){
            let indexes = [];
            try {
                indexes = (explicitIndexes || selectedThemeImageIndexesV37(modal) || [])
                    .map(Number)
                    .filter(Number.isFinite);
            } catch {}
            const candidates = indexes.map(index => modal?._themeBackgroundSvgs?.[index]).filter(Boolean);
            const result = await before.apply(this, arguments);
            rememberRemovedV134(modal, candidates);
            return result;
        };
    } catch {}

    async function queueExistingOverrideRemovalsV134(modal, themeId){
        if (!modal || !themeId || !isBuiltInEditorV134(modal)) return;
        let override = null;
        try { override = getThemeOverrideV25(themeId) || null; } catch {}
        if (!override?.replaceBuiltInDecorationsV30) return;

        const desired = new Set(
            (Array.isArray(override.backgroundSvgs) ? override.backgroundSvgs : [])
                .map(assetKeyV134)
                .filter(Boolean)
        );
        const slug = builtInSlugV134(themeId);
        if (!slug) return;

        try {
            const response = await fetch(`/api/built-in-theme-assets/${encodeURIComponent(slug)}`, { cache: 'no-store' });
            if (!response.ok) return;
            const data = await response.json().catch(() => ({}));
            const missingFromOverride = (Array.isArray(data?.assets) ? data.assets : [])
                .filter(asset => asset?.url && !desired.has(assetKeyV134(asset)));
            if (missingFromOverride.length) {
                const pending = pendingSetV134(modal);
                for (const asset of missingFromOverride) pending.set(assetKeyV134(asset), { ...asset });
            }
        } catch {}
    }

    // Saving a built-in edit commits queued removals to disk. Files are moved
    // outside /public into .theme-builder-backups, never permanently destroyed.
    try {
        const before = saveThemeOverrideV25;
        saveThemeOverrideV25 = async function(modal){
            const themeId = builtInIdV134(modal);
            try { await modal?._builtInExistingRemovalScanV134; } catch {}
            const pending = isBuiltInEditorV134(modal)
                ? [...pendingSetV134(modal).values()]
                : [];

            const result = await before.apply(this, arguments);

            if (pending.length && themeId) {
                const archived = await archiveBuiltInAssetsV134(modal, pending);
                if (archived.ok) {
                    modal._builtInPendingRemovedAssetsV134 = new Map();
                    try { await applyTheme(themeId, { persist: false }); } catch {}
                    notifyBuiltInAssetsChangedV134(themeId, false);
                }
            }

            return result;
        };
    } catch {}

    // Migration for edits saved by older builds: those overrides already omit
    // deleted images, but the physical files were never moved. Queue the source
    // files that are absent from the saved replacement list so the next Save &
    // Apply repairs Dashboard/log runtime behavior too.
    try {
        const beforeOpen = openAnyThemeInBuilderV25;
        openAnyThemeInBuilderV25 = function(themeId, themeName){
            const result = beforeOpen.apply(this, arguments);
            if (themeId && themeId !== 'theme-custom-builder') {
                const run = () => {
                    const modal = document.getElementById('theme-builder-modal');
                    if (!modal) return;
                    modal._builtInExistingRemovalScanV134 = queueExistingOverrideRemovalsV134(modal, themeId);
                };
                Promise.resolve(result).then(run, () => {});
            }
            return result;
        };
    } catch {}

    // Restore Original Theme now restores any archived source images BEFORE the
    // original built-in runtime is reapplied.
    try {
        const beforeEnsure = ensureRestoreOriginalButtonV27;
        ensureRestoreOriginalButtonV27 = function(modal, themeId, themeName){
            const result = beforeEnsure.apply(this, arguments);
            const button = modal?.querySelector('.theme-builder-restore-original-v27');
            if (!button || !themeId || themeId === 'theme-custom-builder') return result;

            button.onclick = async () => {
                const currentOverrides = ensureThemeOverridesV25();
                if (!currentOverrides[themeId]) {
                    showFeatureToast('This theme is already using its original version.');
                    return;
                }

                const confirmed = await showAppConfirm({
                    title: 'Restore the original theme?',
                    message: `This removes all Theme Builder edits you saved for “${themeName || themeId}” and restores its original built-in colors, artwork, audio, CSS, JavaScript, and behavior.`,
                    confirmLabel: 'Restore Original'
                });
                if (!confirmed) return;

                const restored = await restoreBuiltInAssetsV134(themeId);
                if (!restored.ok) return;

                delete currentOverrides[themeId];
                db.settings.theme = themeId;
                await saveDb();

                modal._themeEditSavedV25 = true;
                modal._builtInPendingRemovedAssetsV134 = new Map();
                modal.dataset.themeBuilderEditingThemeV25 = '';
                themeOverrideApplySuppressedV25 = false;

                await applyTheme(themeId, { persist: false });
                if (dailyThemeSelect) dailyThemeSelect.value = themeId;
                themePickerSelected = themeId;
                renderThemePicker();
                modal.classList.add('hidden');
                dailySettingsModal?.classList.add('hidden');
                notifyBuiltInAssetsChangedV134(themeId, true);
                showFeatureToast(`Restored the original “${themeName || themeId}” theme.`);
            };

            return result;
        };
    } catch {}
})();


// ============================================================================
// V135 — AUTHORITATIVE BUILT-IN ART + RELIABLE RESTORE + AUDIO LENGTHS
//         + ONE-SOUND DELETE + SAFER CREATIVE-BACKGROUND PROMPT
// ============================================================================
(function(){
    // ------------------------------------------------------------------
    // Built-in artwork: once a built-in's decorations were edited, the
    // Theme Builder replacement list is the ONLY image layer. The original
    // theme CSS/JS still supplies its colors/behavior, but its native art root
    // is removed so remaining images cannot duplicate and a deleted image
    // cannot survive from an already-loaded browser resource.
    // ------------------------------------------------------------------
    function builtInReplacementActiveV135(themeId){
        if (!themeId || themeId === 'theme-custom-builder') return false;
        try {
            if (themeOverrideApplySuppressedV25) return false;
        } catch {}
        try {
            return getThemeOverrideV25(themeId)?.replaceBuiltInDecorationsV30 === true;
        } catch {
            return false;
        }
    }

    function removeNativeBuiltInArtV135(themeId){
        if (!builtInReplacementActiveV135(themeId)) return;
        let roots = [];
        try { roots = getBuiltInThemeRootsV30(themeId) || []; } catch {}
        roots.forEach(root => {
            if (!root || root.id === 'custom-theme-background-stage' || root.closest?.('#theme-builder-modal')) return;
            try { root.remove(); } catch {}
        });
    }

    try {
        const applyBeforeV135 = applyTheme;
        applyTheme = async function(themeValue, opts = {}){
            const result = await applyBeforeV135.apply(this, arguments);
            if (builtInReplacementActiveV135(themeValue)) {
                removeNativeBuiltInArtV135(themeValue);
                requestAnimationFrame(() => removeNativeBuiltInArtV135(themeValue));
            }
            return result;
        };
    } catch {}

    // ------------------------------------------------------------------
    // Restore Original: ALWAYS ask the server to restore archived files first.
    // V134 incorrectly returned early when the local override record was gone,
    // which could leave real files sitting in the backup folder forever.
    // ------------------------------------------------------------------
    async function restoreArchivedBuiltInFilesV135(themeId){
        const slug = String(themeId || '').replace(/^theme-/, '').trim().toLowerCase();
        if (!slug) return { ok:true, data:{ restored:[] } };
        try {
            const response = await fetch(`/api/built-in-theme-assets/${encodeURIComponent(slug)}/restore`, {
                method:'POST',
                headers:{'Content-Type':'application/json'},
                body:'{}'
            });
            const data = await response.json().catch(() => ({}));
            return { ok: response.ok && data?.status === 'success', data };
        } catch (error) {
            return { ok:false, error };
        }
    }

    function clearBuiltInCachesV135(themeId){
        try { window.__themeAssetFetchCacheV131?.clear?.(); } catch {}
        try { window.__themeBuilderBaseCacheV132?.delete?.(String(themeId || '')); } catch {}
    }

    try {
        const ensureRestoreBeforeV135 = ensureRestoreOriginalButtonV27;
        ensureRestoreOriginalButtonV27 = function(modal, themeId, themeName){
            const result = ensureRestoreBeforeV135.apply(this, arguments);
            const button = modal?.querySelector('.theme-builder-restore-original-v27');
            if (!button || !themeId || themeId === 'theme-custom-builder') return result;

            button.onclick = async () => {
                const overrides = ensureThemeOverridesV25();
                const hadOverride = !!overrides[themeId];
                const confirmed = await showAppConfirm({
                    title:'Restore the original theme?',
                    message:`This restores the original built-in images and removes all Theme Builder edits saved for “${themeName || themeId}”.`,
                    confirmLabel:'Restore Original'
                });
                if (!confirmed) return;

                const restored = await restoreArchivedBuiltInFilesV135(themeId);
                if (!restored.ok) {
                    showFeatureToast('Could not restore the original built-in images. Replace server.js, restart Node, and try again.');
                    return;
                }

                const restoredCount = Array.isArray(restored.data?.restored) ? restored.data.restored.length : 0;
                if (overrides[themeId]) delete overrides[themeId];
                db.settings.theme = themeId;
                await saveDb();
                clearBuiltInCachesV135(themeId);

                modal._themeEditSavedV25 = true;
                modal._builtInPendingRemovedAssetsV134 = new Map();
                modal._builtInArtDirtyV30 = false;
                modal.dataset.themeBuilderEditingThemeV25 = '';
                modal.dataset.themeBuilderBuiltInSourceV30 = '';
                themeOverrideApplySuppressedV25 = false;

                await applyTheme(themeId, {persist:false});
                if (dailyThemeSelect) dailyThemeSelect.value = themeId;
                themePickerSelected = themeId;
                renderThemePicker();
                modal.classList.add('hidden');
                dailySettingsModal?.classList.add('hidden');
                try {
                    window.parent?.postMessage({
                        type:'theme-builder-built-in-assets-changed-v134',
                        themeId:String(themeId),
                        restored:true
                    }, window.location.origin);
                } catch {}

                if (!hadOverride && !restoredCount) showFeatureToast('This theme is already using its original version.');
                else showFeatureToast(`Restored the original “${themeName || themeId}” theme${restoredCount ? ` · ${restoredCount} image${restoredCount === 1 ? '' : 's'} restored` : ''}.`);
            };
            return result;
        };
    } catch {}

    // ------------------------------------------------------------------
    // Audio durations. Metadata is cached by URL, so normal preview/color UI
    // updates never cause repeated audio downloads or slow the Theme Builder.
    // ------------------------------------------------------------------
    const audioDurationCacheV135 = window.__themeAudioDurationCacheV135 || (window.__themeAudioDurationCacheV135 = new Map());

    function formatDurationV135(seconds){
        const total = Math.max(0, Math.round(Number(seconds) || 0));
        const h = Math.floor(total / 3600);
        const m = Math.floor((total % 3600) / 60);
        const s = total % 60;
        return h > 0
            ? `${h}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`
            : `${m}:${String(s).padStart(2,'0')}`;
    }

    function audioDurationV135(url){
        const key = String(url || '').trim();
        if (!key) return Promise.resolve(null);
        if (audioDurationCacheV135.has(key)) return audioDurationCacheV135.get(key);
        const promise = new Promise(resolve => {
            const audio = document.createElement('audio');
            let done = false;
            const finish = value => {
                if (done) return;
                done = true;
                try { audio.removeAttribute('src'); audio.load(); } catch {}
                resolve(Number.isFinite(value) && value > 0 ? value : null);
            };
            audio.preload = 'metadata';
            audio.addEventListener('loadedmetadata', () => finish(Number(audio.duration)), {once:true});
            audio.addEventListener('durationchange', () => {
                if (Number.isFinite(audio.duration) && audio.duration > 0) finish(Number(audio.duration));
            }, {once:true});
            audio.addEventListener('error', () => finish(null), {once:true});
            setTimeout(() => finish(null), 8000);
            try { audio.src = key; audio.load(); } catch { finish(null); }
        });
        audioDurationCacheV135.set(key, promise);
        return promise;
    }

    function ensureIntroDurationNodeV135(modal){
        if (!modal) return null;
        let node = modal.querySelector('.theme-builder-audio-duration-v135');
        if (node) return node;
        const row = modal.querySelector('.theme-builder-audio-name')?.closest('.theme-builder-file-picker-row');
        if (!row) return null;
        node = document.createElement('span');
        node.className = 'theme-builder-audio-duration-v135';
        node.hidden = true;
        row.appendChild(node);
        return node;
    }

    function refreshIntroDurationV135(modal){
        if (!modal) return;
        const node = ensureIntroDurationNodeV135(modal);
        if (!node) return;
        const url = String(modal._themeIntroAudio || '').trim();
        if (!url) {
            modal._themeIntroDurationKeyV135 = '';
            node.hidden = true;
            node.textContent = '';
            return;
        }
        if (modal._themeIntroDurationKeyV135 === url && node.dataset.readyV135 === 'true') return;
        modal._themeIntroDurationKeyV135 = url;
        node.dataset.readyV135 = 'false';
        node.hidden = false;
        node.textContent = 'Length: …';
        audioDurationV135(url).then(duration => {
            if (String(modal._themeIntroAudio || '').trim() !== url) return;
            node.dataset.readyV135 = 'true';
            node.textContent = duration ? `Length: ${formatDurationV135(duration)}` : 'Length unavailable';
        });
    }

    try {
        const populateBeforeV135 = populateThemeBuilder;
        populateThemeBuilder = function(modal, theme){
            const result = populateBeforeV135.apply(this, arguments);
            refreshIntroDurationV135(modal);
            return result;
        };
    } catch {}

    try {
        const updateBeforeV135 = updateThemeBuilderPreview;
        updateThemeBuilderPreview = function(modal){
            const result = updateBeforeV135.apply(this, arguments);
            refreshIntroDurationV135(modal);
            return result;
        };
    } catch {}

    // ------------------------------------------------------------------
    // Hover-sound list: remove exactly ONE list item/reference. Do not delete
    // the physical sound file when clicking X; especially never mutate a
    // built-in sound folder. This also avoids index/list reset side effects.
    // ------------------------------------------------------------------
    renderThemeBuilderHoverSoundListV10 = function(modal){
        const host = modal?.querySelector('.theme-builder-hover-sound-list');
        if (!host) return;
        const sounds = Array.isArray(modal._themeHoverSounds) ? modal._themeHoverSounds : [];
        host.innerHTML = '';

        sounds.forEach((sound, index) => {
            const row = document.createElement('div');
            row.className = 'theme-builder-hover-sound-row';
            row.innerHTML = `
                <i class="ph ph-speaker-high"></i>
                <span class="theme-builder-hover-sound-name-v135">${escapeCustomHtml(sound?.name || ('Sound ' + (index + 1)))}</span>
                <small class="theme-builder-hover-sound-duration-v135">…</small>
                <button type="button" class="small-icon-btn theme-builder-hover-sound-remove-v135" title="Remove only this sound" aria-label="Remove only this sound">
                    <i class="ph ph-x"></i>
                </button>
            `;

            const durationNode = row.querySelector('.theme-builder-hover-sound-duration-v135');
            const url = String(sound?.url || '').trim();
            if (url) {
                audioDurationV135(url).then(duration => {
                    if (!durationNode?.isConnected) return;
                    durationNode.textContent = duration ? formatDurationV135(duration) : '';
                });
            } else if (durationNode) durationNode.textContent = '';

            const remove = row.querySelector('.theme-builder-hover-sound-remove-v135');
            remove?.addEventListener('pointerdown', event => {
                event.preventDefault();
                event.stopPropagation();
            }, true);
            remove?.addEventListener('click', async event => {
                event.preventDefault();
                event.stopPropagation();
                event.stopImmediatePropagation();

                const label = sound?.name || ('Sound ' + (index + 1));
                const confirmed = await showAppConfirm({
                    title:'Remove this hover sound?',
                    message:`Only “${label}” will be removed from this theme. The other hover sounds will stay.`,
                    confirmLabel:'Remove Sound'
                });
                if (!confirmed) return;

                const live = Array.isArray(modal._themeHoverSounds) ? modal._themeHoverSounds : [];
                let targetIndex = index;
                if (live[targetIndex] !== sound) {
                    targetIndex = live.findIndex(item =>
                        item === sound ||
                        (String(item?.url || '') === String(sound?.url || '') && String(item?.name || '') === String(sound?.name || ''))
                    );
                }
                if (targetIndex < 0 || targetIndex >= live.length) return;
                const removed = live.splice(targetIndex, 1)[0];

                (modal._themeBackgroundSvgs || []).forEach(svg => {
                    if (String(svg?.hoverSoundUrl || '') === String(removed?.url || '')) svg.hoverSoundUrl = '';
                });

                renderThemeBuilderHoverSoundListV10(modal);
                try { renderThemeBuilderSvgListV2(modal); } catch {}
                try { updateThemeBuilderPreview(modal); } catch {}
            });
            host.appendChild(row);
        });
    };

    // ------------------------------------------------------------------
    // Creative background prompt: foreground decoration images are supplied
    // separately by the user. The generated code must therefore create only
    // an environmental/abstract backdrop, never counterfeit those assets.
    // ------------------------------------------------------------------
    themeBuilderBackgroundPromptV56 = function(modal){
        const draft = getThemeBuilderDraft(modal);
        return `Create one self-contained HTML document for a polished, fun, interactive full-screen BACKGROUND for a theme called "${draft.name || 'Custom Theme'}".

Theme palette:
- page background: ${draft.background || '#ffffff'}
- card/surface: ${draft.surface || '#ffffff'}
- text: ${draft.text || '#111111'}
- muted text: ${draft.muted || '#666666'}
- accent: ${draft.accent || '#888888'}
- border: ${draft.border || '#111111'}

IMPORTANT CONTEXT:
The app already has separate foreground decoration images/SVGs that will be placed and animated on top of this background. DO NOT recreate, trace, imitate, draw, or substitute those decoration images. The background must complement them, not compete with or duplicate them.

Requirements:
- Output ONLY the HTML code. No markdown fences and no explanation.
- It runs inside a sandboxed full-screen iframe BEHIND the app.
- Use only inline HTML, CSS, canvas, and JavaScript. No external URLs, libraries, fonts, images, audio, fetches, imports, or network requests.
- Fill the entire viewport and resize responsively with no scrollbars.
- Make it visually rich and clearly more interesting than one flat color: use layered gradients, soft lighting/glows, subtle texture, abstract patterns, atmospheric depth, gentle waves/ripples, tiny ambient particles, or other BACKGROUND-LEVEL effects that fit the palette.
- Add tasteful lightweight animation. Pointer movement may create gentle parallax, glow movement, ripples, or ambient reactions. Keep it calm enough that app text/cards remain easy to read.
- DO NOT create illustrated sticker-like objects or theme-specific foreground assets. Do not draw characters, animals, flowers, butterflies, food, clothing, icons, logos, props, decorative clip-art, or recognizable object silhouettes just because the theme name suggests them.
- Avoid standalone illustrative SVG artwork. If SVG is used at all, use it only for abstract masks/filters/pattern primitives, never as a replacement for the user's decoration images. Prefer CSS/canvas for ambient effects.
- Do not add buttons, menus, labels, text, cards, controls, cursors, form fields, links, or any app-like UI.
- Do not use huge central objects. Keep the center comparatively calm because app cards may cover it; distribute subtle interest toward the full viewport and edges.
- Do not interfere with the parent site: no parent/top access, no storage, no navigation, no alerts, no focus stealing, no keyboard shortcuts, no context-menu blocking, no preventDefault on user input, and no expensive event loops.
- All decorative elements must stay behind app content. Do not create transparent click-capturing overlays or anything intended to block/intercept the site's controls.
- Keep performance lightweight: cap particles, reuse objects, use requestAnimationFrame only when needed, pause/reduce work when document.hidden, and avoid layout thrashing.
- Respect prefers-reduced-motion by substantially reducing or disabling motion.
- The result should feel intentionally designed for this palette and theme while remaining an abstract/environmental BACKGROUND only.`;
    };
})();

// ============================================================================
// V136 — AUTHORITATIVE APPLIED DECORATIONS + STRICT VISIBILITY
//         + BUILT-IN RUNTIME ART SUPPRESSION + MORE MOTION OPTIONS
// ============================================================================
(function(){
    const BUILT_IN_OVERRIDE_KEY_V136 = 'loggy-built-in-theme-overrides-v102';

    function isHiddenDecorationV136(asset){
        if (!asset || typeof asset !== 'object') return false;
        // hiddenOnScreenV63 is the current UI source of truth. Legacy flags are
        // consulted only when that field never existed on an older saved theme.
        if (typeof asset.hiddenOnScreenV63 === 'boolean') return asset.hiddenOnScreenV63;
        if (typeof asset.showOnScreen === 'boolean') return !asset.showOnScreen;
        if (typeof asset.visibleV63 === 'boolean') return !asset.visibleV63;
        if (typeof asset.visible === 'boolean') return !asset.visible;
        return false;
    }

    function normalizeDecorationV136(asset){
        const hidden = isHiddenDecorationV136(asset);
        return {
            ...(asset || {}),
            hiddenOnScreenV63: hidden,
            showOnScreen: !hidden,
            visibleV63: !hidden,
            visible: !hidden
        };
    }

    function normalizeDecorationListV136(list){
        return (Array.isArray(list) ? list : []).map(normalizeDecorationV136);
    }

    function visibleDecorationListV136(list){
        return normalizeDecorationListV136(list).filter(asset => !asset.hiddenOnScreenV63);
    }

    function builtInIdFromModalV136(modal){
        return String(
            modal?.dataset?.themeBuilderBuiltInSourceV30 ||
            modal?.dataset?.themeBuilderEditingThemeV25 ||
            ''
        );
    }

    function isBuiltInIdV136(themeId){
        const value = String(themeId || '');
        return !!value && value !== 'theme-custom-builder' && !value.startsWith('theme-custom-builder-');
    }

    function currentOverrideV136(themeId){
        try { return getThemeOverrideV25(themeId) || null; } catch { return null; }
    }

    function replacementActiveV136(themeId){
        if (!isBuiltInIdV136(themeId)) return false;
        try { if (themeOverrideApplySuppressedV25) return false; } catch {}
        const override = currentOverrideV136(themeId);
        if (!override) return false;
        return override.replaceBuiltInDecorationsV30 === true ||
            override.authoritativeDecorationsV136 === true ||
            (Array.isArray(override.backgroundSvgs) && override.backgroundSvgs.length > 0);
    }

    function mirrorBuiltInOverrideV136(themeId, theme){
        if (!isBuiltInIdV136(themeId)) return;
        let all = {};
        try {
            const parsed = JSON.parse(localStorage.getItem(BUILT_IN_OVERRIDE_KEY_V136) || '{}');
            if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) all = parsed;
        } catch {}

        if (!theme) {
            delete all[themeId];
        } else {
            const cleanTheme = {
                ...(theme || {}),
                backgroundSvgs: normalizeDecorationListV136(theme?.backgroundSvgs)
            };
            all[themeId] = {
                id: themeId,
                name: String(cleanTheme.name || themeId),
                theme: cleanTheme,
                updatedAt: new Date().toISOString()
            };
        }

        try { localStorage.setItem(BUILT_IN_OVERRIDE_KEY_V136, JSON.stringify(all)); } catch {}
        try {
            fetch('/api/built-in-theme-overrides', {
                method:'PUT',
                headers:{'Content-Type':'application/json'},
                body:JSON.stringify({overrides:all})
            }).catch(() => {});
        } catch {}
    }

    // Make every save path receive exactly the list currently shown in the
    // Decorations panel. This covers log-page Save, Save & Apply, and the
    // Dashboard Theme Studio built-in save path.
    try {
        const beforeDraftV136 = getThemeBuilderDraft;
        getThemeBuilderDraft = function(modal){
            const draft = beforeDraftV136.apply(this, arguments) || {};
            if (Array.isArray(modal?._themeBackgroundSvgs)) {
                const normalized = normalizeDecorationListV136(modal._themeBackgroundSvgs);
                modal._themeBackgroundSvgs = normalized.map(asset => ({...asset}));
                draft.backgroundSvgs = normalized.map(asset => ({...asset}));
            } else {
                draft.backgroundSvgs = normalizeDecorationListV136(draft.backgroundSvgs);
            }

            const themeId = builtInIdFromModalV136(modal);
            if (isBuiltInIdV136(themeId)) {
                const existing = currentOverrideV136(themeId);
                const artEdited = modal?._builtInArtDirtyV30 === true ||
                    existing?.replaceBuiltInDecorationsV30 === true ||
                    existing?.authoritativeDecorationsV136 === true;
                if (artEdited) {
                    draft.replaceBuiltInDecorationsV30 = true;
                    draft.authoritativeDecorationsV136 = true;
                }
            }
            return draft;
        };
    } catch {}

    // Final runtime guard: hidden decorations are removed before the log-page
    // art renderer can assign positions/classes, regardless of which historical
    // wrapper passed the theme object in.
    try {
        const beforeAssignmentsV136 = getRuntimeSvgAssignmentsV10;
        getRuntimeSvgAssignmentsV10 = function(theme = {}){
            const safeTheme = {
                ...(theme || {}),
                backgroundSvgs: visibleDecorationListV136(theme?.backgroundSvgs)
            };
            return beforeAssignmentsV136.call(this, safeTheme) || [];
        };
    } catch {}

    try {
        const beforeMountV136 = mountCustomThemeBackgroundSvgsV2;
        mountCustomThemeBackgroundSvgsV2 = function(theme = {}){
            const safeTheme = {
                ...(theme || {}),
                backgroundSvgs: visibleDecorationListV136(theme?.backgroundSvgs)
            };
            // Always clear the prior stage first. This matters when the new
            // authoritative list contains zero visible decorations.
            try { document.getElementById('custom-theme-background-stage')?.remove(); } catch {}
            return beforeMountV136.call(this, safeTheme);
        };
    } catch {}

    // Save-only bypasses saveThemeOverrideV25 in V49, so mirror it too.
    try {
        const beforeSaveOnlyV136 = saveBuiltInThemeOnlyV49;
        saveBuiltInThemeOnlyV49 = async function(modal){
            const themeId = builtInIdFromModalV136(modal);
            const result = await beforeSaveOnlyV136.apply(this, arguments);
            const override = currentOverrideV136(themeId);
            if (override) {
                override.backgroundSvgs = normalizeDecorationListV136(override.backgroundSvgs);
                if (modal?._builtInArtDirtyV30 || override.replaceBuiltInDecorationsV30) {
                    override.replaceBuiltInDecorationsV30 = true;
                    override.authoritativeDecorationsV136 = true;
                }
                mirrorBuiltInOverrideV136(themeId, override);
            }
            return result;
        };
    } catch {}

    try {
        const beforeSaveOverrideV136 = saveThemeOverrideV25;
        saveThemeOverrideV25 = async function(modal){
            const themeId = builtInIdFromModalV136(modal);
            const result = await beforeSaveOverrideV136.apply(this, arguments);
            if (isBuiltInIdV136(themeId)) {
                const override = currentOverrideV136(themeId);
                if (override) {
                    override.backgroundSvgs = normalizeDecorationListV136(
                        Array.isArray(modal?._themeBackgroundSvgs)
                            ? modal._themeBackgroundSvgs
                            : override.backgroundSvgs
                    );
                    if (modal?._builtInArtDirtyV30 || override.replaceBuiltInDecorationsV30) {
                        override.replaceBuiltInDecorationsV30 = true;
                        override.authoritativeDecorationsV136 = true;
                    }
                    try { await saveDb(); } catch {}
                    mirrorBuiltInOverrideV136(themeId, override);
                    // Re-apply from the just-normalized authoritative state so
                    // a hidden image cannot linger from the save that preceded
                    // this final normalization pass.
                    try { await applyTheme(themeId, {persist:false}); } catch {}
                }
            }
            return result;
        };
    } catch {}

    // ------------------------------------------------------------------
    // Native built-in art suppression.
    // Keep the built-in JS mounted for music/other behavior, but remove any
    // image/SVG art it injects whenever Theme Builder artwork is authoritative.
    // This observer only examines newly-added nodes and skips all app/editor
    // subtrees; it does NOT rescan the Theme Builder on every mutation.
    // ------------------------------------------------------------------
    const nativeArtStateV136 = { active:false, themeId:'' };

    function excludedAppNodeV136(node){
        if (!node || node.nodeType !== 1) return true;
        if (node.id === 'custom-theme-background-stage' ||
            node.id === 'theme-builder-modal' ||
            node.id === 'companion-stage' ||
            node.id === 'custom-cursor-visual') return true;
        try {
            if (node.closest('#custom-theme-background-stage,#theme-builder-modal,.view,.side-nav,.modal-overlay,.global-command-palette,#virtual-keyboard')) return true;
        } catch {}
        return false;
    }

    function directBodyRootV136(node){
        let current = node?.nodeType === 1 ? node : node?.parentElement;
        while (current && current.parentElement && current.parentElement !== document.body) {
            if (excludedAppNodeV136(current)) return null;
            current = current.parentElement;
        }
        return current?.parentElement === document.body ? current : null;
    }

    function nativeArtEvidenceV136(root, themeId){
        if (!root || excludedAppNodeV136(root)) return false;
        const name = String(themeId || '').replace(/^theme-/, '').toLowerCase();
        const text = `${root.id || ''} ${root.className || ''}`.toLowerCase();
        if (name && text.includes(name) && /(background|scene|stage|decor|particle|art|sprite|float)/.test(text)) return true;

        const imageSelector = [
            'img[src*="/svg/"]',
            'object[data*="/svg/"]',
            'image[href*="/svg/"]',
            'img[src*="/themes/"]',
            'object[data*="/themes/"]',
            'image[href*="/themes/"]'
        ].join(',');
        try {
            if (root.matches?.(imageSelector) || root.querySelector?.(imageSelector)) return true;
        } catch {}

        // Inline SVG theme roots are common. Only treat them as native theme art
        // when they live in a fixed/absolute non-interactive visual layer.
        let hasSvg = false;
        try { hasSvg = root.tagName === 'SVG' || !!root.querySelector?.('svg'); } catch {}
        if (hasSvg) {
            try {
                const cs = getComputedStyle(root);
                if ((cs.position === 'fixed' || cs.position === 'absolute') &&
                    (cs.pointerEvents === 'none' || Number.parseInt(cs.zIndex || '0', 10) <= 1)) return true;
            } catch {}
        }

        try {
            const bg = String(getComputedStyle(root).backgroundImage || '').toLowerCase();
            if (bg.includes('/svg/') || (name && bg.includes(`/themes/${name}/`))) return true;
        } catch {}
        return false;
    }

    function removeNativeArtRootV136(node){
        if (!nativeArtStateV136.active) return;
        const root = directBodyRootV136(node);
        if (!root || root.id === 'custom-theme-background-stage') return;
        if (!nativeArtEvidenceV136(root, nativeArtStateV136.themeId)) return;
        try { root.remove(); } catch {}
    }

    function cleanupNativeArtV136(themeId){
        if (!replacementActiveV136(themeId)) return;
        try {
            (getBuiltInThemeRootsV30(themeId) || []).forEach(root => {
                if (root && root.id !== 'custom-theme-background-stage' && !root.closest?.('#theme-builder-modal')) {
                    try { root.remove(); } catch {}
                }
            });
        } catch {}
        try {
            Array.from(document.body.children).forEach(removeNativeArtRootV136);
        } catch {}
    }

    try {
        const observer = new MutationObserver(records => {
            if (!nativeArtStateV136.active) return;
            for (const record of records) {
                for (const node of record.addedNodes || []) removeNativeArtRootV136(node);
            }
        });
        observer.observe(document.body, {childList:true, subtree:true});
        window.__themeNativeArtObserverV136 = observer;
    } catch {}

    try {
        const beforeApplyV136 = applyTheme;
        applyTheme = async function(themeValue, opts = {}){
            const themeId = String(themeValue || 'default');
            const active = replacementActiveV136(themeId);
            nativeArtStateV136.active = active;
            nativeArtStateV136.themeId = active ? themeId : '';

            const result = await beforeApplyV136.apply(this, arguments);
            if (active) {
                cleanupNativeArtV136(themeId);
                requestAnimationFrame(() => cleanupNativeArtV136(themeId));
            }
            return result;
        };
    } catch {}

    // Restore Original must clear BOTH the log-local override and the V102
    // project/dashboard override; otherwise Dashboard can keep applying the old
    // replacement even after the source images were restored.
    try {
        const beforeEnsureRestoreV136 = ensureRestoreOriginalButtonV27;
        ensureRestoreOriginalButtonV27 = function(modal, themeId, themeName){
            const result = beforeEnsureRestoreV136.apply(this, arguments);
            const button = modal?.querySelector('.theme-builder-restore-original-v27');
            if (!button || !isBuiltInIdV136(themeId)) return result;

            button.disabled = false;
            button.onclick = async () => {
                const confirmed = await showAppConfirm({
                    title:'Restore the original theme?',
                    message:`This restores the original built-in images and removes all Theme Builder edits saved for “${themeName || themeId}”.`,
                    confirmLabel:'Restore Original'
                });
                if (!confirmed) return;

                try {
                    const response = await fetch(`/api/built-in-theme-assets/${encodeURIComponent(String(themeId).replace(/^theme-/, ''))}/restore`, {
                        method:'POST',
                        headers:{'Content-Type':'application/json'},
                        body:'{}'
                    });
                    const data = await response.json().catch(() => ({}));
                    if (!response.ok || data?.status !== 'success') throw new Error(data?.message || 'Restore failed');
                } catch {
                    showFeatureToast('Could not restore the original built-in images. Replace server.js, restart Node, and try again.');
                    return;
                }

                try { delete ensureThemeOverridesV25()[themeId]; } catch {}
                mirrorBuiltInOverrideV136(themeId, null);
                try { window.__themeAssetFetchCacheV131?.clear?.(); } catch {}
                try { window.__themeBuilderBaseCacheV132?.delete?.(String(themeId)); } catch {}

                db.settings.theme = themeId;
                try { await saveDb(); } catch {}
                modal._themeEditSavedV25 = true;
                modal._builtInArtDirtyV30 = false;
                modal._builtInPendingRemovedAssetsV134 = new Map();
                modal.dataset.themeBuilderEditingThemeV25 = '';
                modal.dataset.themeBuilderBuiltInSourceV30 = '';
                themeOverrideApplySuppressedV25 = false;
                nativeArtStateV136.active = false;
                nativeArtStateV136.themeId = '';

                await applyTheme(themeId, {persist:false});
                if (dailyThemeSelect) dailyThemeSelect.value = themeId;
                themePickerSelected = themeId;
                try { renderThemePicker(); } catch {}
                modal.classList.add('hidden');
                dailySettingsModal?.classList.add('hidden');
                try {
                    window.parent?.postMessage({
                        type:'theme-builder-built-in-assets-changed-v134',
                        themeId:String(themeId),
                        restored:true
                    }, window.location.origin);
                } catch {}
                showFeatureToast(`Restored the original “${themeName || themeId}” theme.`);
            };
            return result;
        };
    } catch {}

    // ------------------------------------------------------------------
    // More default motion choices. These are intentionally useful background
    // motions rather than huge/jarring effects.
    // ------------------------------------------------------------------
    const MORE_ANIMATIONS_V136 = [
        ['gentle-sway', 'Gentle Sway'],
        ['breathe', 'Soft Breathe'],
        ['slow-rock', 'Slow Rock'],
        ['soft-glide', 'Soft Side Glide'],
        ['small-orbit', 'Small Orbit'],
        ['flutter', 'Light Flutter'],
        ['playful-wobble', 'Playful Wobble'],
        ['tiny-hop', 'Tiny Hop']
    ];

    try {
        if (Array.isArray(THEME_SVG_ANIMATION_OPTIONS_V11)) {
            MORE_ANIMATIONS_V136.forEach(option => {
                if (!THEME_SVG_ANIMATION_OPTIONS_V11.some(existing => existing?.[0] === option[0])) {
                    THEME_SVG_ANIMATION_OPTIONS_V11.push(option);
                }
            });
        }
    } catch {}

    function previewMotionV136(animation, fallback){
        switch (String(animation || '')) {
            case 'gentle-sway': return 'theme-svg-motion-gentle-sway-v136 7.2s ease-in-out infinite alternate';
            case 'breathe': return 'theme-svg-motion-breathe-v136 4.8s ease-in-out infinite alternate';
            case 'slow-rock': return 'theme-svg-motion-slow-rock-v136 5.8s ease-in-out infinite alternate';
            case 'soft-glide': return 'theme-svg-motion-soft-glide-v136 7.4s ease-in-out infinite alternate';
            case 'small-orbit': return 'theme-svg-motion-small-orbit-v136 7s ease-in-out infinite';
            case 'flutter': return 'theme-svg-motion-flutter-v136 2.9s ease-in-out infinite';
            case 'playful-wobble': return 'theme-svg-motion-playful-wobble-v136 3.8s ease-in-out infinite';
            case 'tiny-hop': return 'theme-svg-motion-tiny-hop-v136 3.2s ease-in-out infinite';
            default: return fallback;
        }
    }

    try {
        const beforePreviewMotionV136 = themeBuilderDashboardAnimationV78;
        themeBuilderDashboardAnimationV78 = function(animation){
            return previewMotionV136(animation, beforePreviewMotionV136.apply(this, arguments));
        };
    } catch {}

    try {
        const beforePreviewMotion69V136 = dashboardPreviewMotionValueV69;
        dashboardPreviewMotionValueV69 = function(animation){
            return previewMotionV136(animation, beforePreviewMotion69V136.apply(this, arguments));
        };
    } catch {}
})();

// ============================================================
// V138 — MOODY-STYLE COMBINED MOTIONS + MORE HOVER ANIMATIONS
// ============================================================
(function(){
    if (window.__themeBuilderCombinedMotionsV138) return;
    window.__themeBuilderCombinedMotionsV138 = true;

    const COMBINED_V138 = [
        ['moody-wander-bounce', 'Moody Wander + Light Bounce'],
        ['travel-bounce', 'Travel + Light Bounce'],
        ['drift-sway', 'Drift + Sway'],
        ['orbit-pulse', 'Orbit + Pulse'],
        ['glide-bob', 'Glide + Bob'],
        ['float-twirl', 'Float + Soft Twirl'],
        ['zigzag-bounce', 'Zigzag + Bounce']
    ];

    const HOVER_V138 = [
        ['tilt-lift', 'Tilt + Lift'],
        ['pop-wiggle', 'Pop + Wiggle'],
        ['squish', 'Soft Squish'],
        ['flip', 'Quick Flip'],
        ['jello', 'Jello Wobble'],
        ['mini-orbit', 'Mini Orbit'],
        ['side-nudge', 'Side Nudge'],
        ['double-hop', 'Double Hop'],
        ['soft-shiver', 'Soft Shiver']
    ];

    try {
        if (Array.isArray(THEME_SVG_ANIMATION_OPTIONS_V11)) {
            COMBINED_V138.forEach(option => {
                if (!THEME_SVG_ANIMATION_OPTIONS_V11.some(existing => existing?.[0] === option[0])) {
                    THEME_SVG_ANIMATION_OPTIONS_V11.push(option);
                }
            });
        }
    } catch {}

    try {
        if (Array.isArray(THEME_HOVER_ANIMATION_OPTIONS_V82)) {
            HOVER_V138.forEach(option => {
                if (!THEME_HOVER_ANIMATION_OPTIONS_V82.some(existing => existing?.[0] === option[0])) {
                    THEME_HOVER_ANIMATION_OPTIONS_V82.push(option);
                }
            });
        }
    } catch {}

    function combinedMotionV138(animation, fallback){
        switch (String(animation || '')) {
            case 'moody-wander-bounce': return 'theme-svg-motion-moody-wander-bounce-v138 7.8s ease-in-out infinite';
            case 'travel-bounce': return 'theme-svg-motion-travel-bounce-v138 17s linear infinite';
            case 'drift-sway': return 'theme-svg-motion-drift-sway-v138 8.8s ease-in-out infinite';
            case 'orbit-pulse': return 'theme-svg-motion-orbit-pulse-v138 6.8s ease-in-out infinite';
            case 'glide-bob': return 'theme-svg-motion-glide-bob-v138 7.6s ease-in-out infinite';
            case 'float-twirl': return 'theme-svg-motion-float-twirl-v138 6.4s ease-in-out infinite';
            case 'zigzag-bounce': return 'theme-svg-motion-zigzag-bounce-v138 8.2s ease-in-out infinite';
            default: return fallback;
        }
    }

    try {
        const before78V138 = themeBuilderDashboardAnimationV78;
        themeBuilderDashboardAnimationV78 = function(animation){
            return combinedMotionV138(animation, before78V138.apply(this, arguments));
        };
    } catch {}

    try {
        const before69V138 = dashboardPreviewMotionValueV69;
        dashboardPreviewMotionValueV69 = function(animation){
            return combinedMotionV138(animation, before69V138.apply(this, arguments));
        };
    } catch {}

    try {
        const beforeHoverCssV138 = hoverAnimationCssV82;
        hoverAnimationCssV82 = function(animation){
            switch (String(animation || '')) {
                case 'tilt-lift': return 'theme-hover-tilt-lift-v138 .5s cubic-bezier(.2,.8,.2,1) both';
                case 'pop-wiggle': return 'theme-hover-pop-wiggle-v138 .62s ease-in-out both';
                case 'squish': return 'theme-hover-squish-v138 .56s cubic-bezier(.22,.82,.24,1) both';
                case 'flip': return 'theme-hover-flip-v138 .7s cubic-bezier(.2,.72,.24,1) both';
                case 'jello': return 'theme-hover-jello-v138 .7s ease-in-out both';
                case 'mini-orbit': return 'theme-hover-mini-orbit-v138 .68s ease-in-out both';
                case 'side-nudge': return 'theme-hover-side-nudge-v138 .45s ease-out both';
                case 'double-hop': return 'theme-hover-double-hop-v138 .66s cubic-bezier(.2,.72,.24,1) both';
                case 'soft-shiver': return 'theme-hover-soft-shiver-v138 .48s ease-in-out both';
                default: return beforeHoverCssV138.apply(this, arguments);
            }
        };
    } catch {}

    // If the builder was created unusually early, refresh existing animation
    // selects in place so the new options appear without rebuilding the modal.
    function refreshExistingSelectsV138(){
        const modal = document.getElementById('theme-builder-modal');
        if (!modal) return;
        try {
            modal.querySelectorAll('.theme-builder-svg-default-animation, .theme-builder-svg-animation-select').forEach(select => {
                const current = select.value;
                COMBINED_V138.forEach(([id,label]) => {
                    if (![...select.options].some(option => option.value === id)) {
                        const option = document.createElement('option');
                        option.value = id;
                        option.textContent = label;
                        select.appendChild(option);
                    }
                });
                if ([...select.options].some(option => option.value === current)) select.value = current;
            });
            modal.querySelectorAll('.theme-builder-svg-hover-animation-default-v82, .theme-builder-svg-hover-animation-select-v82, .theme-builder-svg-hover-animation-select-v89').forEach(select => {
                const current = select.value;
                HOVER_V138.forEach(([id,label]) => {
                    if (![...select.options].some(option => option.value === id)) {
                        const option = document.createElement('option');
                        option.value = id;
                        option.textContent = label;
                        select.appendChild(option);
                    }
                });
                if ([...select.options].some(option => option.value === current)) select.value = current;
            });
        } catch {}
    }

    requestAnimationFrame(refreshExistingSelectsV138);
    document.addEventListener('click', event => {
        if (event.target?.closest?.('[data-action="edit-theme"], .theme-edit-btn, .theme-picker-card')) {
            requestAnimationFrame(() => requestAnimationFrame(refreshExistingSelectsV138));
        }
    }, true);
})();

// ============================================================================
// V139 — PER-DECORATION ACROSS-SCREEN DIRECTION + AUTOMATIC HORIZONTAL FLIP
// Checked R means the ORIGINAL artwork naturally faces right.
// Unchecked means the ORIGINAL artwork naturally faces left. Travel direction
// is assigned independently by Across Screen; the artwork is mirrored only when
// its natural facing does not match that runtime travel direction.
// The controls only appear when that decoration's effective animation is
// Across Screen (including when Across Screen is the global default).
// ============================================================================
(function(){
    const CROSS_V139 = 'cross-screen';

    function directionV139(asset){
        return String(asset?.crossDirectionV139 || '').toLowerCase() === 'left'
            ? 'left'
            : 'right';
    }

    function effectiveCardAnimationV139(modal, asset){
        const override = String(asset?.animationOverride || '').trim();
        if (override) return override;
        return String(
            modal?.querySelector?.('.theme-builder-svg-default-animation')?.value ||
            asset?.animation ||
            'float'
        ).trim();
    }

    function markBuiltInDirtyV139(modal){
        try {
            if (modal?.dataset?.themeBuilderBuiltInSourceV30) {
                modal._builtInArtDirtyV30 = true;
            }
        } catch {}
    }

    function ensureDirectionRowV139(modal, card, asset){
        const options = card?.querySelector?.('.theme-builder-svg-card-options-v10');
        if (!options || !asset) return;

        let row = options.querySelector('.theme-builder-cross-direction-row-v139');
        if (!row) {
            row = document.createElement('div');
            row.className = 'theme-builder-svg-option-row theme-builder-cross-direction-row-v139';
            row.innerHTML = `
                <span>Original Faces Right</span>
                <div class="theme-builder-cross-direction-buttons-v139" role="group" aria-label="Across Screen direction">
                    <label class="theme-builder-cross-direction-choice-v139" title="Checked = the original image naturally faces right. Unchecked = it naturally faces left.">
                        <input type="checkbox" class="theme-builder-cross-right-v139" aria-label="Original image faces right; unchecked means original faces left">
                        <strong>R</strong>
                    </label>
                </div>`;
            options.appendChild(row);
        }

        const active = effectiveCardAnimationV139(modal, asset) === CROSS_V139;
        row.classList.toggle('hidden', !active);
        if (!active) return;

        const right = row.querySelector('.theme-builder-cross-right-v139');
        const current = directionV139(asset);
        if (right) right.checked = current === 'right';

        const commit = value => {
            asset.crossDirectionV139 = value;
            if (right) right.checked = value === 'right';
            markBuiltInDirtyV139(modal);
            try { updateThemeBuilderPreview(modal); } catch {}
            try { renderDashboardThemePreviewV40?.(modal); } catch {}
            try { renderDashboardPreviewV45?.(modal); } catch {}
        };

        if (right) {
            right.onchange = event => {
                event.stopPropagation();
                commit(right.checked ? 'right' : 'left');
            };
        }
    }

    function ensureDirectionControlsV139(modal){
        if (!modal) return;
        modal.querySelectorAll('.theme-builder-svg-card[data-svg-index]').forEach(card => {
            const index = Number(card.dataset.svgIndex);
            const asset = modal._themeBackgroundSvgs?.[index];
            if (!asset) return;
            ensureDirectionRowV139(modal, card, asset);
        });
    }

    // V366: obsolete V139 movement reconciliation removed. V350 is the sole motion owner.


    // Rebuild/refresh the R/L row whenever cards or the effective animation
    // changes. This catches both a global Across Screen default and a per-image
    // Across Screen override.
    try {
        const beforeListV139 = renderThemeBuilderSvgListV2;
        renderThemeBuilderSvgListV2 = function(modal){
            const result = beforeListV139.apply(this, arguments);
            ensureDirectionControlsV139(modal);
            return result;
        };
    } catch {}





    document.addEventListener('change', event => {
        if (!event.target?.matches?.('.theme-builder-svg-default-animation, .theme-builder-svg-animation-select')) return;
        const modal = event.target.closest?.('#theme-builder-modal') || document.getElementById('theme-builder-modal');
        if (!modal) return;
        requestAnimationFrame(() => {
            ensureDirectionControlsV139(modal);
        });
    }, true);

    document.addEventListener('click', event => {
        const customize = event.target?.closest?.('.theme-builder-svg-customize-v11');
        if (!customize) return;
        const modal = customize.closest?.('#theme-builder-modal');
        if (modal) requestAnimationFrame(() => ensureDirectionControlsV139(modal));
    }, true);

})();

// ============================================================================
// V142 — FIX ACROSS-SCREEN R CHECKBOX TOGGLE
// The preview refresh can rebuild/synchronize the card during the same click.
// Toggle from the decoration's saved direction instead of relying on the
// checkbox's transient DOM checked state, so R can always be checked/unchecked.
// ============================================================================
(function(){
    function directionV142(asset){
        return String(asset?.crossDirectionV139 || '').toLowerCase() === 'left'
            ? 'left'
            : 'right';
    }

    function markBuiltInDirtyV142(modal){
        try {
            if (modal?.dataset?.themeBuilderBuiltInSourceV30) {
                modal._builtInArtDirtyV30 = true;
            }
        } catch {}
    }

    function commitDirectionV142(modal, asset, checkbox, direction){
        asset.crossDirectionV139 = direction === 'left' ? 'left' : 'right';
        if (checkbox) checkbox.checked = asset.crossDirectionV139 === 'right';
        markBuiltInDirtyV142(modal);
        try { updateThemeBuilderPreview(modal); } catch {}
        try { renderDashboardThemePreviewV40?.(modal); } catch {}
        try { renderDashboardPreviewV45?.(modal); } catch {}
    }

    function bindToggleV142(modal){
        if (!modal) return;
        modal.querySelectorAll('.theme-builder-svg-card[data-svg-index]').forEach(card => {
            const checkbox = card.querySelector('.theme-builder-cross-right-v139');
            if (!checkbox) return;
            const index = Number(card.dataset.svgIndex);
            const asset = modal._themeBackgroundSvgs?.[index];
            if (!asset) return;

            checkbox.checked = directionV142(asset) === 'right';

            // Prevent card/customize click handlers from racing the checkbox.
            checkbox.onpointerdown = event => {
                event.stopPropagation();
            };
            checkbox.onclick = event => {
                event.preventDefault();
                event.stopPropagation();
                event.stopImmediatePropagation?.();
                const next = directionV142(asset) === 'right' ? 'left' : 'right';
                commitDirectionV142(modal, asset, checkbox, next);
            };
            // The click handler above owns mouse/touch toggling. Keep keyboard
            // changes functional if the browser emits change without click.
            checkbox.onchange = event => {
                event.stopPropagation();
            };
        });
    }

    function scheduleBindV142(modal){
        if (!modal) return;
        requestAnimationFrame(() => bindToggleV142(modal));
        setTimeout(() => bindToggleV142(modal), 80);
    }

    try {
        const beforeListV142 = renderThemeBuilderSvgListV2;
        renderThemeBuilderSvgListV2 = function(modal){
            const result = beforeListV142.apply(this, arguments);
            scheduleBindV142(modal);
            return result;
        };
    } catch {}

    try {
        const beforePreviewV142 = updateThemeBuilderPreview;
        updateThemeBuilderPreview = function(modal){
            const result = beforePreviewV142.apply(this, arguments);
            scheduleBindV142(modal);
            return result;
        };
    } catch {}

    document.addEventListener('click', event => {
        const customize = event.target?.closest?.('.theme-builder-svg-customize-v11');
        if (!customize) return;
        const modal = customize.closest?.('#theme-builder-modal');
        if (modal) scheduleBindV142(modal);
    }, true);

    requestAnimationFrame(() => {
        const modal = document.getElementById('theme-builder-modal');
        if (modal) scheduleBindV142(modal);
    });
})();

// ============================================================================
// V143 — FIX SHOW-ON-SCREEN CHECKBOX TOGGLE
// Toggle from the saved decoration visibility state instead of the transient
// checkbox DOM state so preview/dashboard refreshes cannot force it back on.
// ============================================================================
(function(){
    function isVisibleV143(asset){
        if (!asset || typeof asset !== 'object') return true;
        if (typeof asset.hiddenOnScreenV63 === 'boolean') return asset.hiddenOnScreenV63 !== true;
        if (typeof asset.showOnScreen === 'boolean') return asset.showOnScreen !== false;
        if (typeof asset.visibleV63 === 'boolean') return asset.visibleV63 !== false;
        if (typeof asset.visible === 'boolean') return asset.visible !== false;
        return true;
    }

    function commitVisibilityV143(modal, asset, checkbox, visible){
        const nextVisible = visible === true;
        asset.hiddenOnScreenV63 = !nextVisible;
        // Keep all historical/runtime visibility aliases synchronized so saved
        // built-in themes, dashboard reloads, and log pages agree.
        asset.showOnScreen = nextVisible;
        asset.visibleV63 = nextVisible;
        asset.visible = nextVisible;
        if (checkbox) checkbox.checked = nextVisible;
        try {
            if (modal?.dataset?.themeBuilderBuiltInSourceV30) {
                modal._builtInArtDirtyV30 = true;
            }
        } catch {}
        try { updateThemeBuilderPreview(modal); } catch {}
        try { renderDashboardThemePreviewV40?.(modal); } catch {}
        try { renderDashboardPreviewV45?.(modal); } catch {}
    }

    function bindVisibilityToggleV143(modal){
        if (!modal) return;
        modal.querySelectorAll('.theme-builder-svg-card[data-svg-index]').forEach(card => {
            const checkbox = card.querySelector('.theme-builder-image-visible-v63');
            if (!checkbox) return;
            const index = Number(card.dataset.svgIndex);
            const asset = modal._themeBackgroundSvgs?.[index];
            if (!asset) return;

            checkbox.checked = isVisibleV143(asset);
            checkbox.onpointerdown = event => {
                event.stopPropagation();
            };
            checkbox.onclick = event => {
                event.preventDefault();
                event.stopPropagation();
                event.stopImmediatePropagation?.();
                commitVisibilityV143(modal, asset, checkbox, !isVisibleV143(asset));
            };
            checkbox.onchange = event => {
                event.stopPropagation();
            };
        });
    }

    function scheduleVisibilityBindV143(modal){
        if (!modal) return;
        requestAnimationFrame(() => bindVisibilityToggleV143(modal));
        setTimeout(() => bindVisibilityToggleV143(modal), 80);
    }

    try {
        const beforeListV143 = renderThemeBuilderSvgListV2;
        renderThemeBuilderSvgListV2 = function(modal){
            const result = beforeListV143.apply(this, arguments);
            scheduleVisibilityBindV143(modal);
            return result;
        };
    } catch {}

    try {
        const beforePreviewV143 = updateThemeBuilderPreview;
        updateThemeBuilderPreview = function(modal){
            const result = beforePreviewV143.apply(this, arguments);
            scheduleVisibilityBindV143(modal);
            return result;
        };
    } catch {}

    document.addEventListener('click', event => {
        const customize = event.target?.closest?.('.theme-builder-svg-customize-v11');
        if (!customize) return;
        const modal = customize.closest?.('#theme-builder-modal');
        if (modal) scheduleVisibilityBindV143(modal);
    }, true);

    requestAnimationFrame(() => {
        const modal = document.getElementById('theme-builder-modal');
        if (modal) scheduleVisibilityBindV143(modal);
    });
})();

// ============================================================================
// V144 — AUTHORITATIVE DECORATION TOGGLES + LOCKED ACROSS-SCREEN DIRECTION
// Fixes two root causes:
// 1) Theme Builder preview refreshes clone/replace _themeBackgroundSvgs, so
//    per-node handlers can hold stale asset objects. Capture clicks here and
//    always mutate the CURRENT asset from modal._themeBackgroundSvgs[index].
// 2) Applied runtimes filter hidden art before creating items. Their svgIndex
//    therefore belongs to the VISIBLE list, not the original unfiltered list.
//    Reconcile travel + facing against that exact same visible list.
// ============================================================================
(function(){
    if (window.__themeBuilderDirectionVisibilityV144) return;
    window.__themeBuilderDirectionVisibilityV144 = true;

    function hiddenV144(asset){
        if (!asset || typeof asset !== 'object') return false;
        if (typeof asset.hiddenOnScreenV63 === 'boolean') return asset.hiddenOnScreenV63;
        if (typeof asset.showOnScreen === 'boolean') return asset.showOnScreen === false;
        if (typeof asset.visibleV63 === 'boolean') return asset.visibleV63 === false;
        if (typeof asset.visible === 'boolean') return asset.visible === false;
        return false;
    }

    function directionV144(asset){
        return String(asset?.crossDirectionV139 || '').toLowerCase() === 'left'
            ? 'left'
            : 'right';
    }

    function markDirtyV144(modal){
        try {
            if (modal?.dataset?.themeBuilderBuiltInSourceV30) modal._builtInArtDirtyV30 = true;
        } catch {}
    }

    function liveAssetForControlV144(control){
        const modal = control?.closest?.('#theme-builder-modal');
        const card = control?.closest?.('.theme-builder-svg-card[data-svg-index]');
        const index = Number(card?.dataset?.svgIndex);
        if (!modal || !Number.isFinite(index)) return null;
        const asset = modal._themeBackgroundSvgs?.[index];
        if (!asset) return null;
        return {modal, card, index, asset};
    }

    function refreshAfterToggleV144(modal){
        // Run after the click has fully finished. The live decoration state is
        // already updated before getThemeBuilderDraft gets a chance to clone it.
        queueMicrotask(() => {
            try { updateThemeBuilderPreview(modal); } catch {}
            try { renderDashboardThemePreviewV40?.(modal); } catch {}
            try { renderDashboardPreviewV45?.(modal); } catch {}
            requestAnimationFrame(() => {
                try { syncControlStateV144(modal); } catch {}
            });
        });
    }

    function setVisibilityV144(asset, visible){
        const value = visible === true;
        asset.hiddenOnScreenV63 = !value;
        asset.showOnScreen = value;
        asset.visibleV63 = value;
        asset.visible = value;
    }

    // Own these two controls at DOCUMENT CAPTURE phase. This executes before
    // all legacy card/label/change handlers and prevents stale handlers from
    // immediately restoring the old value.
    document.addEventListener('click', event => {
        const target = event.target;
        if (!target?.closest) return;

        const rightControl = target.closest('.theme-builder-cross-direction-choice-v139');
        if (rightControl) {
            const input = rightControl.querySelector('.theme-builder-cross-right-v139');
            const live = liveAssetForControlV144(input || rightControl);
            if (!input || !live) return;

            event.preventDefault();
            event.stopPropagation();
            event.stopImmediatePropagation?.();

            const next = directionV144(live.asset) === 'right' ? 'left' : 'right';
            live.asset.crossDirectionV139 = next;
            input.checked = next === 'right';
            input.setAttribute('data-v144-direction', next);
            try { input.focus({preventScroll:true}); } catch {}
            markDirtyV144(live.modal);
            refreshAfterToggleV144(live.modal);
            return;
        }

        const visibilityControl = target.closest('.theme-builder-image-visible-row-v63');
        if (visibilityControl) {
            const input = visibilityControl.querySelector('.theme-builder-image-visible-v63');
            const live = liveAssetForControlV144(input || visibilityControl);
            if (!input || !live) return;

            event.preventDefault();
            event.stopPropagation();
            event.stopImmediatePropagation?.();

            const nextVisible = hiddenV144(live.asset);
            setVisibilityV144(live.asset, nextVisible);
            input.checked = nextVisible;
            try { input.focus({preventScroll:true}); } catch {}
            markDirtyV144(live.modal);
            refreshAfterToggleV144(live.modal);
        }
    }, true);

    function syncControlStateV144(modal){
        if (!modal) return;
        modal.querySelectorAll('.theme-builder-svg-card[data-svg-index]').forEach(card => {
            const index = Number(card.dataset.svgIndex);
            const asset = Number.isFinite(index) ? modal._themeBackgroundSvgs?.[index] : null;
            if (!asset) return;
            const right = card.querySelector('.theme-builder-cross-right-v139');
            if (right) {
                const dir = directionV144(asset);
                right.checked = dir === 'right';
                right.setAttribute('data-v144-direction', dir);
            }
            const visible = card.querySelector('.theme-builder-image-visible-v63');
            if (visible) visible.checked = !hiddenV144(asset);
        });
    }

    // V366: obsolete V144 movement reconciliation removed. The capture-phase controls above remain authoritative for editing metadata.

})();

// ============================================================================
// V145 — CLEAN CREATE + LIVE AUDIO LIBRARY + CARD COLOR + URL-LOCKED CROSSING
// ============================================================================
(function(){
    if (window.__themeBuilderV145) return;
    window.__themeBuilderV145 = true;

    // ---------------------------------------------------------------------
    // 1) A Create Theme action on a log page must always start from defaults.
    // ---------------------------------------------------------------------
    function blankThemeV145(){
        return {
            ...FEATURE_SUITE_DEFAULT_THEME,
            ...CUSTOM_THEME_MEDIA_DEFAULTS_V3,
            ...CUSTOM_THEME_VISUAL_DEFAULTS_V4,
            ...THEME_BUILDER_NAV_DEFAULTS_V6,
            ...CUSTOM_THEME_ADVANCED_DEFAULTS_V10,
            ...CUSTOM_THEME_V11_DEFAULTS,
            ...CUSTOM_THEME_V12_DEFAULTS,
            ...CUSTOM_THEME_V13_DEFAULTS,
            ...CUSTOM_THEME_V15_DEFAULTS,
            ...CUSTOM_THEME_V19_DEFAULTS,
            ...CUSTOM_THEME_V20_DEFAULTS,
            ...CUSTOM_THEME_V26_DEFAULTS,
            ...CUSTOM_THEME_ACCESSORY_DEFAULTS_V32,
            name:'My Custom Theme',
            backgroundSvgs:[],
            svgHoverSounds:[],
            introAudio:'',
            introAudioName:'',
            backgroundImage:'',
            backgroundImageName:'',
            decorationsOpacityV117:100
        };
    }

    function forceBlankCreateV145(modal){
        if (!modal) return;
        try { removeBuiltInEditorStateForCustomV30?.(modal); } catch {}
        try { removeRestoreOriginalButtonV27?.(modal); } catch {}
        modal.dataset.themeBuilderMode = 'create';
        modal.dataset.themeBuilderEditingThemeV25 = '';
        modal.dataset.themeBuilderEditingCopyV30 = '';
        delete modal.dataset.themeBuilderBuiltInSourceV30;
        delete modal.dataset.themeBuilderOriginalEditIdV115;
        modal._themeBuilderOriginalEditIdV115 = '';
        modal._themeBackgroundSvgs = [];
        modal._themeHoverSounds = [];
        modal._themeIntroAudio = '';
        modal._themeIntroAudioName = '';
        modal._themeAudioProjectPath = '';
        modal._themeArtworkKeyV69 = '';
        modal._themeArtworkSnapshotV69 = [];
        modal._themeImagesIntentionallyEditedV69 = false;
        modal._builtInArtDirtyV30 = false;
        try { modal._themeBuilderIntroPreviewAudioV10?.pause?.(); } catch {}
        modal._themeBuilderIntroPreviewAudioV10 = null;

        const blank = blankThemeV145();
        try { populateThemeBuilder(modal, blank); } catch {}
        // populate() may hydrate from older stateful wrappers; empty the backing
        // collections again so Create cannot inherit the previous theme.
        modal._themeBackgroundSvgs = [];
        modal._themeHoverSounds = [];
        modal._themeIntroAudio = '';
        modal._themeIntroAudioName = '';
        try { renderThemeBuilderSvgListV2(modal); } catch {}
        try { renderThemeBuilderHoverSoundListV10(modal); } catch {}
        try { updateThemeBuilderPreview(modal); } catch {}
    }

    try {
        const openNewBeforeV145 = openNewThemeBuilderCleanV34;
        openNewThemeBuilderCleanV34 = function(){
            const result = openNewBeforeV145.apply(this, arguments);
            const run = () => forceBlankCreateV145(document.getElementById('theme-builder-modal'));
            run();
            queueMicrotask(run);
            requestAnimationFrame(run);
            return result;
        };
        openNewCustomThemeFromPickerV7 = openNewThemeBuilderCleanV34;
    } catch {}

    // Final delegated Create card owner. This avoids a stale older click
    // listener opening the most recently edited custom theme first.
    document.addEventListener('click', event => {
        const create = event.target?.closest?.('.theme-picker-create-card');
        if (!create) return;
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation?.();
        try { openNewThemeBuilderCleanV34(); } catch {}
    }, true);

    // ---------------------------------------------------------------------
    // 2) Hover sounds disappear from the UI immediately after confirmation.
    // ---------------------------------------------------------------------
    const durationCacheV145 = window.__themeAudioDurationCacheV145 || (window.__themeAudioDurationCacheV145 = new Map());
    function durationV145(url){
        const key = String(url || '').trim();
        if (!key) return Promise.resolve(null);
        if (durationCacheV145.has(key)) return durationCacheV145.get(key);
        const promise = new Promise(resolve => {
            const audio = document.createElement('audio');
            let done = false;
            const finish = value => {
                if (done) return;
                done = true;
                try { audio.removeAttribute('src'); audio.load(); } catch {}
                resolve(Number.isFinite(value) && value > 0 ? value : null);
            };
            audio.preload = 'metadata';
            audio.addEventListener('loadedmetadata', () => finish(Number(audio.duration)), {once:true});
            audio.addEventListener('error', () => finish(null), {once:true});
            try { audio.src = key; audio.load(); } catch { finish(null); }
            setTimeout(() => finish(null), 4500);
        });
        durationCacheV145.set(key, promise);
        return promise;
    }
    function formatDurationV145(seconds){
        if (!Number.isFinite(seconds) || seconds <= 0) return '';
        const total = Math.round(seconds);
        const minutes = Math.floor(total / 60);
        const rest = String(total % 60).padStart(2, '0');
        return `${minutes}:${rest}`;
    }

    renderThemeBuilderHoverSoundListV10 = function(modal){
        const host = modal?.querySelector('.theme-builder-hover-sound-list');
        if (!host) return;
        const sounds = Array.isArray(modal._themeHoverSounds) ? modal._themeHoverSounds : [];
        host.innerHTML = '';
        sounds.forEach((sound, index) => {
            const row = document.createElement('div');
            row.className = 'theme-builder-hover-sound-row';
            row.dataset.hoverSoundIndexV145 = String(index);
            row.innerHTML = `
                <i class="ph ph-speaker-high"></i>
                <span class="theme-builder-hover-sound-name-v135">${escapeCustomHtml(sound?.name || ('Sound ' + (index + 1)))}</span>
                <small class="theme-builder-hover-sound-duration-v135"></small>
                <button type="button" class="small-icon-btn theme-builder-hover-sound-remove-v145" title="Remove only this sound" aria-label="Remove only this sound"><i class="ph ph-x"></i></button>
            `;
            const durationNode = row.querySelector('.theme-builder-hover-sound-duration-v135');
            const url = String(sound?.url || '');
            if (url) durationV145(url).then(value => {
                if (durationNode?.isConnected) durationNode.textContent = formatDurationV145(value);
            });
            row.querySelector('.theme-builder-hover-sound-remove-v145')?.addEventListener('click', async event => {
                event.preventDefault();
                event.stopPropagation();
                event.stopImmediatePropagation?.();
                const label = sound?.name || ('Sound ' + (index + 1));
                const ok = await showAppConfirm({
                    title:'Remove this hover sound?',
                    message:`Only “${label}” will be removed from this theme.`,
                    confirmLabel:'Remove Sound'
                });
                if (!ok) return;

                const live = Array.isArray(modal._themeHoverSounds) ? modal._themeHoverSounds : [];
                let liveIndex = live.findIndex(item => item === sound);
                if (liveIndex < 0) liveIndex = live.findIndex(item =>
                    String(item?.url || '') === String(sound?.url || '') &&
                    String(item?.name || '') === String(sound?.name || '')
                );
                if (liveIndex < 0) liveIndex = index < live.length ? index : -1;
                if (liveIndex >= 0) {
                    const removed = live[liveIndex];
                    modal._themeHoverSounds = live.filter((_, i) => i !== liveIndex);
                    (modal._themeBackgroundSvgs || []).forEach(asset => {
                        if (String(asset?.hoverSoundUrl || '') === String(removed?.url || '')) asset.hoverSoundUrl = '';
                    });
                }
                // Immediate visual removal first; heavier preview work happens
                // on the next frame and can never make the row linger.
                row.remove();
                requestAnimationFrame(() => {
                    try { renderThemeBuilderHoverSoundListV10(modal); } catch {}
                    try { renderThemeBuilderSvgListV2(modal); } catch {}
                    try { updateThemeBuilderPreview(modal); } catch {}
                });
            });
            host.appendChild(row);
        });
    };

    // Resolve the currently saved theme object for card-color rendering.
    function themeObjectV145(themeId){
        const id = String(themeId || '');
        if (id === 'theme-custom-builder') return db?.settings?.customTheme || null;
        try {
            const copy = getThemeCopyV30?.(id);
            if (copy?.theme) return copy.theme;
        } catch {}
        try {
            const shared = readSharedThemeLibraryV40?.().find?.(entry => String(entry?.id || '') === id);
            if (shared?.theme) return shared.theme;
        } catch {}
        try {
            const override = getThemeOverrideV25?.(id);
            if (override) return override;
        } catch {}
        return null;
    }

    // ---------------------------------------------------------------------
    // 4) Theme card preview uses the theme's Automatic Distributor main seed.
    // ---------------------------------------------------------------------
    function validColorV145(value){ return /^#[0-9a-f]{6}$/i.test(String(value || '').trim()) ? String(value).trim() : ''; }
    function themeMainColorV145(themeId){
        const theme = themeObjectV145(themeId);
        return validColorV145(theme?._autoColorSeedV107) ||
            validColorV145(theme?.accent) ||
            validColorV145(theme?.dashboardAccentV40) || '';
    }
    function paintThemeCardV145(card, themeId){
        const color = themeMainColorV145(themeId);
        const preview = card?.querySelector?.('.theme-picker-preview');
        if (!color || !preview) return;
        preview.style.setProperty('background', color, 'important');
        preview.style.setProperty('--preview-accent', color);
        preview.dataset.mainColorV145 = color;
    }
    try {
        const createCardBeforeV145 = createThemePickerCard;
        createThemePickerCard = function(option){
            const card = createCardBeforeV145.apply(this, arguments);
            if (card) paintThemeCardV145(card, option?.value || card.dataset.theme);
            return card;
        };
    } catch {}

    // V366: historical V145 Across Screen reconciliation removed.
    // V350 is the sole movement/direction owner.

})();


// ============================================================================
// V147 — R MEANS NATURAL/ORIGINAL FACING ONLY
// Checked R = source artwork naturally faces right. Unchecked = naturally left.
// Across Screen travel is independent; media is mirrored iff natural != travel.
// ============================================================================
window.__themeCrossNaturalFacingV147 = true;

// V149/V151 retired Across Screen implementations removed in V366.

// ============================================================================
// V153 — REUSE CONFIGURED INTRO / HOVER AUDIO FROM ANOTHER THEME
// Two source choices per audio section: upload OR choose a theme.
// Selecting a theme is the action: intro imports that theme's one configured
// intro track; hover imports only the hover sounds actually configured there.
// No folder-wide audio enumeration and no work until a source theme is chosen.
// ============================================================================
(function(){
    if (window.__themeReuseConfiguredAudioV153) return;
    window.__themeReuseConfiguredAudioV153 = true;

    const bundleCache = window.__themeReuseConfiguredAudioCacheV153 ||
        (window.__themeReuseConfiguredAudioCacheV153 = new Map());

    function text(value){ return String(value == null ? '' : value).trim(); }

    function fileName(url, fallback){
        const raw = text(url);
        if (!raw) return fallback || 'Audio';
        try {
            return decodeURIComponent(new URL(raw, location.href).pathname.split('/').pop()) || fallback || 'Audio';
        } catch {
            try { return decodeURIComponent(raw.split(/[?#]/)[0].split('/').pop()) || fallback || 'Audio'; }
            catch { return raw.split(/[?#]/)[0].split('/').pop() || fallback || 'Audio'; }
        }
    }

    function normalizedUrl(value){
        const raw = text(value);
        if (!raw) return '';
        try {
            const u = new URL(raw, location.href);
            return `${u.pathname}${u.search}`.toLowerCase();
        } catch {
            return raw.toLowerCase();
        }
    }

    function asAudioItem(value, fallbackName){
        if (!value) return null;
        if (typeof value === 'string') {
            const url = text(value);
            return url ? { name:fileName(url, fallbackName || 'Audio'), url } : null;
        }
        if (typeof value !== 'object') return null;
        const url = text(value.url || value.src || value.audio || value.href || value.path);
        if (!url) return null;
        return {
            ...value,
            name:text(value.name || value.fileName || value.label) || fileName(url, fallbackName || 'Audio'),
            url
        };
    }

    function addSoundList(target, source){
        if (!source) return;
        const values = Array.isArray(source) ? source : [source];
        values.forEach(value => {
            const item = asAudioItem(value, 'Hover Sound');
            if (item) target.push(item);
        });
    }

    function exactBundleFromTheme(theme){
        if (!theme || typeof theme !== 'object') return { introAudio:null, hoverSounds:[] };

        const introRaw =
            theme.introAudio ||
            theme.introAudioUrl ||
            theme.introSong ||
            theme.introMusic ||
            theme.song ||
            theme.music ||
            '';

        const introAudio = asAudioItem(
            typeof introRaw === 'object' && !Array.isArray(introRaw)
                ? introRaw
                : {
                    url:introRaw,
                    name:theme.introAudioName || theme.introSongName || theme.songName || theme.musicName || ''
                },
            'Intro Audio'
        );

        const hoverSounds = [];
        addSoundList(hoverSounds, theme.svgHoverSounds);
        addSoundList(hoverSounds, theme.hoverSounds);
        addSoundList(hoverSounds, theme.hoverAudio);
        addSoundList(hoverSounds, theme.hoverSfx);
        addSoundList(hoverSounds, theme.soundEffects);

        // Mapped-per-image sounds are part of the theme's actual hover setup too.
        (Array.isArray(theme.backgroundSvgs) ? theme.backgroundSvgs : []).forEach(asset => {
            const mapped = asAudioItem(
                {
                    url:asset?.hoverSoundUrl || asset?.hoverAudioUrl || '',
                    name:asset?.hoverSoundName || ''
                },
                'Hover Sound'
            );
            if (mapped) hoverSounds.push(mapped);
        });

        const deduped = [];
        const seen = new Set();
        hoverSounds.forEach(item => {
            const key = normalizedUrl(item?.url);
            if (!key || seen.has(key)) return;
            seen.add(key);
            deduped.push(item);
        });

        return { introAudio, hoverSounds:deduped };
    }

    function localBuiltInOverride(themeId){
        try {
            const parsed = JSON.parse(localStorage.getItem('loggy-built-in-theme-overrides-v102') || '{}');
            const value = parsed && typeof parsed === 'object' && !Array.isArray(parsed)
                ? parsed[themeId]
                : null;
            return value && typeof value === 'object' ? value : null;
        } catch { return null; }
    }

    function savedThemeRecord(themeId){
        const id = text(themeId);
        if (!id) return { theme:null, authoritative:false };

        if (id === 'theme-custom-builder') {
            try {
                const theme = getCustomThemeSettings?.();
                if (theme) return { theme, authoritative:true };
            } catch {}
        }

        try {
            const copy = getThemeCopyV30?.(id);
            if (copy?.theme) return { theme:copy.theme, authoritative:true };
        } catch {}

        try {
            const list = readSharedThemeLibraryV40?.();
            const shared = Array.isArray(list) ? list.find(item => text(item?.id) === id) : null;
            if (shared?.theme) return { theme:shared.theme, authoritative:true };
        } catch {}

        try {
            const list = readSharedThemeLibraryForStudioV43?.();
            const shared = Array.isArray(list) ? list.find(item => text(item?.id) === id) : null;
            if (shared?.theme) return { theme:shared.theme, authoritative:true };
        } catch {}

        // A per-log override is authoritative even if the user intentionally
        // removed every sound from it.
        try {
            const override = getThemeOverrideV25?.(id);
            if (override && typeof override === 'object') return { theme:override, authoritative:true };
        } catch {}

        const projectOverride = localBuiltInOverride(id);
        if (projectOverride) return { theme:projectOverride, authoritative:true };

        return { theme:null, authoritative:false };
    }

    function builtInName(themeId){
        const id = text(themeId);
        if (!id || id === 'default') return '';
        try {
            const name = getBuiltInThemeNameV30?.(id);
            if (name) return text(name);
        } catch {}
        return id.replace(/^theme-/, '');
    }

    async function fetchBuiltInConfiguredBundle(themeId){
        const name = builtInName(themeId);
        if (!name) return { introAudio:null, hoverSounds:[] };

        try {
            const response = await fetch(`/api/built-in-theme-audio-config/${encodeURIComponent(name)}`, {
                method:'GET',
                cache:'no-store'
            });
            if (!response.ok) return { introAudio:null, hoverSounds:[] };
            const data = await response.json().catch(() => ({}));
            const introAudio = asAudioItem(data?.introAudio, 'Intro Audio');
            const hoverSounds = [];
            addSoundList(hoverSounds, data?.hoverSounds);
            const seen = new Set();
            return {
                introAudio,
                hoverSounds:hoverSounds.filter(item => {
                    const key = normalizedUrl(item?.url);
                    if (!key || seen.has(key)) return false;
                    seen.add(key);
                    return true;
                })
            };
        } catch {
            return { introAudio:null, hoverSounds:[] };
        }
    }

    async function configuredBundle(themeId){
        const id = text(themeId);
        if (!id) return { introAudio:null, hoverSounds:[] };
        if (bundleCache.has(id)) return bundleCache.get(id);

        const promise = (async () => {
            const saved = savedThemeRecord(id);
            if (saved.authoritative) return exactBundleFromTheme(saved.theme);
            return fetchBuiltInConfiguredBundle(id);
        })();

        bundleCache.set(id, promise);
        try { return await promise; }
        catch {
            bundleCache.delete(id);
            return { introAudio:null, hoverSounds:[] };
        }
    }

    function currentEditingId(modal){
        return text(
            modal?.dataset?.themeBuilderEditingThemeV25 ||
            modal?.dataset?.themeBuilderEditingThemeV30 ||
            modal?.dataset?.themeBuilderBuiltInSourceV30 ||
            ''
        );
    }

    function themeOptions(modal){
        const current = currentEditingId(modal);
        const options = [];
        const seen = new Set();

        try {
            Array.from(dailyThemeSelect?.options || []).forEach(option => {
                const id = text(option.value);
                if (!id || id === 'default' || id === current || seen.has(id)) return;
                seen.add(id);
                options.push({ id, name:text(option.textContent) || id });
            });
        } catch {}

        // In Theme Studio, the hidden select can briefly lag shared-theme
        // hydration. Add already-loaded shared entries without doing any fetch.
        const addShared = list => {
            (Array.isArray(list) ? list : []).forEach(entry => {
                const id = text(entry?.id);
                if (!id || id === current || seen.has(id)) return;
                seen.add(id);
                options.push({ id, name:text(entry?.name || entry?.theme?.name) || 'Custom Theme' });
            });
        };
        try { addShared(readSharedThemeLibraryV40?.()); } catch {}
        try { addShared(readSharedThemeLibraryForStudioV43?.()); } catch {}

        return options;
    }

    function fillSelect(select, modal, placeholder){
        if (!select) return;
        const previous = text(select.value);
        const options = themeOptions(modal);
        select.innerHTML = `
            <option value="">${escapeCustomHtml(placeholder)}</option>
            ${options.map(option => `<option value="${escapeCustomHtml(option.id)}">${escapeCustomHtml(option.name)}</option>`).join('')}
        `;
        if (previous && options.some(option => option.id === previous)) select.value = previous;
    }

    function pickerCard(kind, modal){
        const card = document.createElement('div');
        card.className = 'theme-audio-picker-card-v153 theme-audio-theme-picker-v153';
        card.dataset.audioReuseKindV153 = kind;
        card.innerHTML = `
            <span class="theme-audio-picker-label-v153">
                <i class="ph ph-palette"></i>
                ${kind === 'intro' ? 'Reuse song from theme' : 'Reuse hover sounds from theme'}
            </span>
            <select class="theme-audio-theme-select-v153" aria-label="${kind === 'intro' ? 'Reuse intro song from theme' : 'Reuse hover sounds from theme'}"></select>
            <small class="theme-audio-theme-status-v153">Select a theme to import automatically.</small>
        `;
        fillSelect(
            card.querySelector('.theme-audio-theme-select-v153'),
            modal,
            kind === 'intro' ? 'Select theme for intro song…' : 'Select theme for hover sounds…'
        );
        return card;
    }

    function setStatus(card, message, state){
        const node = card?.querySelector('.theme-audio-theme-status-v153');
        if (!node) return;
        node.textContent = message;
        node.dataset.stateV153 = state || '';
    }

    function markBuiltInAudioDirty(modal){
        if (modal?.dataset?.themeBuilderBuiltInSourceV30) modal._builtInAudioDirtyV30 = true;
    }

    async function onIntroThemeSelected(modal, select, card){
        const themeId = text(select.value);
        if (!themeId) return;
        const label = text(select.options[select.selectedIndex]?.textContent) || 'theme';
        const requestId = `${Date.now()}-${Math.random()}`;
        card.dataset.requestV153 = requestId;
        select.disabled = true;
        setStatus(card, `Loading ${label}…`, 'loading');

        const bundle = await configuredBundle(themeId);
        if (card.dataset.requestV153 !== requestId) return;
        select.disabled = false;
        select.value = '';

        const intro = bundle?.introAudio;
        if (!intro?.url) {
            setStatus(card, `${label} has no configured intro song.`, 'empty');
            return;
        }

        modal._themeIntroAudio = intro.url;
        modal._themeIntroAudioName = intro.name || fileName(intro.url, 'Intro Audio');
        modal._themeAudioProjectPath = '';
        const input = modal.querySelector('.theme-builder-audio-file');
        if (input) input.value = '';
        markBuiltInAudioDirty(modal);

        try { updateThemeBuilderPreview(modal); } catch {}
        const nameNode = modal.querySelector('.theme-builder-audio-name');
        if (nameNode) nameNode.textContent = modal._themeIntroAudioName;
        setStatus(card, `Using ${modal._themeIntroAudioName} from ${label}.`, 'success');
    }

    async function onHoverThemeSelected(modal, select, card){
        const themeId = text(select.value);
        if (!themeId) return;
        const label = text(select.options[select.selectedIndex]?.textContent) || 'theme';
        const requestId = `${Date.now()}-${Math.random()}`;
        card.dataset.requestV153 = requestId;
        select.disabled = true;
        setStatus(card, `Loading ${label}…`, 'loading');

        const bundle = await configuredBundle(themeId);
        if (card.dataset.requestV153 !== requestId) return;
        select.disabled = false;
        select.value = '';

        const incoming = Array.isArray(bundle?.hoverSounds) ? bundle.hoverSounds : [];
        if (!incoming.length) {
            setStatus(card, `${label} has no configured hover sounds.`, 'empty');
            return;
        }

        const live = Array.isArray(modal._themeHoverSounds) ? modal._themeHoverSounds.slice() : [];
        const seen = new Set(live.map(item => normalizedUrl(item?.url)).filter(Boolean));
        let added = 0;

        incoming.forEach(sound => {
            const item = asAudioItem(sound, 'Hover Sound');
            const key = normalizedUrl(item?.url);
            if (!item || !key || seen.has(key)) return;
            seen.add(key);
            live.push({
                ...item,
                projectPath:'',
                reusedFromThemeV153:themeId
            });
            added += 1;
        });

        modal._themeHoverSounds = live;
        markBuiltInAudioDirty(modal);
        try { renderThemeBuilderHoverSoundListV10(modal); } catch {}
        try { renderThemeBuilderSvgListV2(modal); } catch {}
        try { updateThemeBuilderPreview(modal); } catch {}

        if (added) {
            setStatus(
                card,
                `Added ${added} hover sound${added === 1 ? '' : 's'} from ${label}${added < incoming.length ? ` · ${incoming.length - added} already here` : ''}.`,
                'success'
            );
        } else {
            setStatus(card, `All ${incoming.length} ${label} hover sound${incoming.length === 1 ? ' is' : 's are'} already added.`, 'success');
        }
    }

    function wrapUploadRow(row, kind){
        if (!row || row.closest('.theme-audio-picker-card-v153')) return row?.closest('.theme-audio-picker-card-v153') || null;
        const card = document.createElement('div');
        card.className = 'theme-audio-picker-card-v153 theme-audio-upload-picker-v153';
        const label = document.createElement('span');
        label.className = 'theme-audio-picker-label-v153';
        label.innerHTML = `<i class="ph ph-upload-simple"></i>${kind === 'intro' ? 'Upload intro song' : 'Upload hover sounds'}`;
        row.parentNode.insertBefore(card, row);
        card.appendChild(label);
        card.appendChild(row);
        return card;
    }

    function installIntro(modal){
        const section = modal?.querySelector('.theme-builder-audio-file')?.closest('section');
        const row = section?.querySelector('.theme-builder-audio-choose')?.closest('.theme-builder-file-picker-row');
        if (!section || !row) return;

        let grid = section.querySelector('.theme-audio-source-grid-v153');
        if (!grid) {
            grid = document.createElement('div');
            grid.className = 'theme-audio-source-grid-v153 theme-audio-intro-source-grid-v153';
            row.parentNode.insertBefore(grid, row);
            const uploadCard = wrapUploadRow(row, 'intro');
            if (uploadCard) grid.appendChild(uploadCard);
            grid.appendChild(pickerCard('intro', modal));
        }

        const card = grid.querySelector('[data-audio-reuse-kind-v153="intro"]');
        const select = card?.querySelector('.theme-audio-theme-select-v153');
        fillSelect(select, modal, 'Select theme for intro song…');
        if (select && select.dataset.boundV153 !== 'true') {
            select.dataset.boundV153 = 'true';
            select.addEventListener('change', () => onIntroThemeSelected(modal, select, card));
        }
    }

    function installHover(modal){
        const details = modal?.querySelector('.theme-builder-svg-hover-sound-details');
        const row = details?.querySelector('.theme-builder-hover-sound-choose')?.closest('.theme-builder-file-picker-row');
        if (!details || !row) return;

        let grid = details.querySelector('.theme-audio-source-grid-v153');
        if (!grid) {
            grid = document.createElement('div');
            grid.className = 'theme-audio-source-grid-v153 theme-audio-hover-source-grid-v153';
            row.parentNode.insertBefore(grid, row);
            const uploadCard = wrapUploadRow(row, 'hover');
            if (uploadCard) grid.appendChild(uploadCard);
            grid.appendChild(pickerCard('hover', modal));
        }

        const card = grid.querySelector('[data-audio-reuse-kind-v153="hover"]');
        const select = card?.querySelector('.theme-audio-theme-select-v153');
        fillSelect(select, modal, 'Select theme for hover sounds…');
        if (select && select.dataset.boundV153 !== 'true') {
            select.dataset.boundV153 = 'true';
            select.addEventListener('change', () => onHoverThemeSelected(modal, select, card));
        }
    }

    function install(modal){
        if (!modal?.isConnected) return;
        installIntro(modal);
        installHover(modal);
    }

    try {
        const beforePopulateV153 = populateThemeBuilder;
        populateThemeBuilder = function(modal, theme){
            const result = beforePopulateV153.apply(this, arguments);
            install(modal);
            requestAnimationFrame(() => install(modal));
            return result;
        };
    } catch {}

    // Advanced controls rebuild the hover-sound panel, so reinstall immediately
    // after that one local rebuild rather than observing the entire document.
    try {
        const beforeAdvancedV153 = ensureThemeBuilderAdvancedControlsV10;
        ensureThemeBuilderAdvancedControlsV10 = function(modal, merged){
            const result = beforeAdvancedV153.apply(this, arguments);
            installHover(modal);
            return result;
        };
    } catch {}

    try {
        const beforeEnsureModalV153 = ensureThemeBuilderModal;
        ensureThemeBuilderModal = function(){
            const modal = beforeEnsureModalV153.apply(this, arguments);
            requestAnimationFrame(() => install(modal));
            return modal;
        };
    } catch {}
})();

// ============================================================================
// V154 — MUSIC VISUAL REACTIONS + THEME PACKS + VERSION HISTORY
// All expensive work is opt-in/lazy: analyser only runs while enabled audio is
// playing; ZIP I/O only runs on button click; history loads only when opened.
// ============================================================================
(function(){
    if (window.__themeBuilderV154) return;
    window.__themeBuilderV154 = true;

    const HISTORY_API = '/api/theme-history';
    const analyserStates = window.__themeMusicAnalyserStatesV154 || (window.__themeMusicAnalyserStatesV154 = new WeakMap());
    const activeReactions = window.__themeMusicActiveReactionsV154 || (window.__themeMusicActiveReactionsV154 = new WeakMap());

    const clamp = (n, min = 0, max = 1) => Math.max(min, Math.min(max, Number(n) || 0));
    const safeText = value => String(value == null ? '' : value).trim();

    function reducedMotionV154(){
        try { return matchMedia('(prefers-reduced-motion: reduce)').matches; } catch { return false; }
    }

    function ensureReactionOverlayV154(stage){
        if (!stage) return null;
        let overlay = stage.querySelector(':scope > .theme-music-react-overlay-v154');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.className = 'theme-music-react-overlay-v154';
            stage.insertBefore(overlay, stage.firstChild || null);
        }
        return overlay;
    }

    function reactionItemsV154(stage){
        if (!stage) return [];
        return Array.from(stage.querySelectorAll([
            '.custom-theme-background-svg',
            '.theme-builder-live-art-item',
            '.theme-builder-dashboard-art-item-v45',
            '.theme-builder-dashboard-art-item-v40'
        ].join(','))).filter(item => item.dataset?.themeMusicParticleV154 !== 'true');
    }

    function clearReactionStageV154(stage){
        if (!stage) return;
        stage.classList.remove('theme-music-react-active-v154');
        stage.style.removeProperty('--theme-music-react-scale-v154');
        stage.style.removeProperty('--theme-music-react-glow-v154');
        stage.style.removeProperty('--theme-music-react-lift-v154');
        stage.style.removeProperty('--theme-music-react-overlay-v154');
        stage.querySelectorAll('.theme-music-react-particle-v154').forEach(node => node.remove());
        const overlay = stage.querySelector(':scope > .theme-music-react-overlay-v154');
        if (overlay) overlay.style.opacity = '0';
    }

    function stopMusicReactionV154(audio, stage){
        const active = audio ? activeReactions.get(audio) : null;
        if (active?.raf) cancelAnimationFrame(active.raf);
        if (audio) activeReactions.delete(audio);
        clearReactionStageV154(stage || active?.stage);
    }

    function getAnalyserV154(audio){
        if (!audio) return null;
        const previous = analyserStates.get(audio);
        if (previous) return previous;
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return null;
        try {
            const context = new AudioCtx();
            const source = context.createMediaElementSource(audio);
            const analyser = context.createAnalyser();
            analyser.fftSize = 128;
            analyser.smoothingTimeConstant = 0.78;
            source.connect(analyser);
            analyser.connect(context.destination);
            const state = { context, source, analyser, data:new Uint8Array(analyser.frequencyBinCount) };
            analyserStates.set(audio, state);
            return state;
        } catch (error) {
            return null;
        }
    }

    function spawnParticlesV154(stage, energy, accent){
        if (!stage || reducedMotionV154()) return;
        const existing = stage.querySelectorAll('.theme-music-react-particle-v154').length;
        if (existing >= 22) return;
        const count = energy > .72 ? 3 : 2;
        for (let i = 0; i < count && existing + i < 22; i++) {
            const dot = document.createElement('span');
            dot.className = 'theme-music-react-particle-v154';
            dot.dataset.themeMusicParticleV154 = 'true';
            const size = 3 + Math.random() * 5;
            dot.style.setProperty('--particle-x-v154', `${8 + Math.random() * 84}%`);
            dot.style.setProperty('--particle-y-v154', `${18 + Math.random() * 68}%`);
            dot.style.setProperty('--particle-dx-v154', `${(Math.random() - .5) * 46}px`);
            dot.style.setProperty('--particle-dy-v154', `${-18 - Math.random() * 38}px`);
            dot.style.setProperty('--particle-size-v154', `${size}px`);
            dot.style.setProperty('--particle-color-v154', accent || '#ffffff');
            dot.style.setProperty('--particle-opacity-v154', String(.28 + energy * .48));
            stage.appendChild(dot);
            dot.addEventListener('animationend', () => dot.remove(), { once:true });
            setTimeout(() => dot.remove(), 1300);
        }
    }

    function startMusicReactionV154(audio, stage, theme){
        if (!audio || !stage || !theme?.introMusicReactionsEnabledV154 || reducedMotionV154()) {
            clearReactionStageV154(stage);
            return;
        }
        stopMusicReactionV154(audio, stage);
        const analyserState = getAnalyserV154(audio);
        if (!analyserState) return;
        try { analyserState.context.resume?.(); } catch {}

        const accent = safeText(theme.accent || theme.dashboardAccentV40 || theme.border || '#ffffff');
        stage.style.setProperty('--theme-music-react-accent-v154', accent);
        stage.classList.add('theme-music-react-active-v154');
        ensureReactionOverlayV154(stage);

        const active = { stage, raf:0, lastBeat:0, lastBurst:0 };
        activeReactions.set(audio, active);
        const tick = time => {
            if (!stage.isConnected || audio.paused || audio.ended || activeReactions.get(audio) !== active) {
                stopMusicReactionV154(audio, stage);
                return;
            }
            const state = analyserState;
            state.analyser.getByteFrequencyData(state.data);
            let total = 0;
            let low = 0;
            const lowCount = Math.min(10, state.data.length);
            for (let i = 0; i < state.data.length; i++) {
                total += state.data[i];
                if (i < lowCount) low += state.data[i];
            }
            const avg = state.data.length ? total / state.data.length / 255 : 0;
            const bass = lowCount ? low / lowCount / 255 : 0;
            const volumeFactor = Number.isFinite(Number(audio.volume)) ? Number(audio.volume) : 1;
            const energy = clamp(((avg * .58 + bass * .72) * volumeFactor - .035) * 1.42);
            const scale = 1 + energy * .052;
            const glow = energy * .88;
            const overlay = energy * .16;
            stage.style.setProperty('--theme-music-react-scale-v154', scale.toFixed(4));
            stage.style.setProperty('--theme-music-react-glow-v154', glow.toFixed(4));
            stage.style.setProperty('--theme-music-react-lift-v154', `${(-energy * 5.5).toFixed(2)}px`);
            stage.style.setProperty('--theme-music-react-overlay-v154', overlay.toFixed(4));
            const overlayNode = stage.querySelector(':scope > .theme-music-react-overlay-v154');
            if (overlayNode) overlayNode.style.opacity = String(overlay);

            const beatLift = bass - active.lastBeat;
            if (bass > .38 && beatLift > .035 && time - active.lastBurst > 210) {
                active.lastBurst = time;
                spawnParticlesV154(stage, clamp(bass), accent);
            }
            active.lastBeat = active.lastBeat * .72 + bass * .28;
            active.raf = requestAnimationFrame(tick);
        };
        active.raf = requestAnimationFrame(tick);
        const cleanup = () => stopMusicReactionV154(audio, stage);
        audio.addEventListener('ended', cleanup, { once:true });
        audio.addEventListener('error', cleanup, { once:true });
        audio.addEventListener('abort', cleanup, { once:true });
        audio.addEventListener('pause', cleanup, { once:true });
    }

    function startWhenPlayingV154(audio, stage, theme){
        if (!audio || !stage) return;
        if (!theme?.introMusicReactionsEnabledV154) {
            clearReactionStageV154(stage);
            return;
        }
        const run = () => startMusicReactionV154(audio, stage, theme);
        if (!audio.paused && !audio.ended) run();
        else audio.addEventListener('play', run, { once:true });
    }

    function introReactionUiV154(modal, theme){
        const section = modal?.querySelector('.theme-builder-audio-file')?.closest('section');
        if (!section) return;
        let row = section.querySelector('.theme-builder-music-react-row-v154');
        if (!row) {
            row = document.createElement('label');
            row.className = 'feature-toggle-row theme-builder-music-react-row-v154';
            row.innerHTML = `
                <input type="checkbox" class="theme-builder-music-react-enabled-v154">
                <span class="theme-builder-music-react-copy-v154">
                    <strong><i class="ph ph-waveform"></i> Music Visual Reactions</strong>
                    <small>React to the real song volume with gentle decoration pulses, glow, background light, and tiny beat particles.</small>
                </span>
            `;
            const bop = section.querySelector('.theme-builder-intro-svg-bop-wrap');
            const fade = section.querySelector('.theme-builder-fade-row');
            (bop || fade || section.querySelector('.theme-builder-upload-status'))?.insertAdjacentElement('afterend', row);
            if (!row.isConnected) section.appendChild(row);
            const input = row.querySelector('input');
            input?.addEventListener('change', () => {
                const audio = modal._themeBuilderIntroPreviewAudioV10;
                const stage = modal.querySelector('.theme-builder-live-art-stage-v61, .theme-builder-dashboard-art-stage-v45, .theme-builder-dashboard-art-stage, .theme-builder-live-art-stage');
                if (!input.checked) {
                    if (audio) stopMusicReactionV154(audio, stage);
                    clearReactionStageV154(stage);
                } else if (audio && !audio.paused && !audio.ended) {
                    startMusicReactionV154(audio, stage, getThemeBuilderDraft(modal));
                }
            });
        }
        const input = row.querySelector('.theme-builder-music-react-enabled-v154');
        if (input && theme && Object.prototype.hasOwnProperty.call(theme, 'introMusicReactionsEnabledV154')) {
            input.checked = !!theme.introMusicReactionsEnabledV154;
        }
    }

    try {
        const beforeDraft = getThemeBuilderDraft;
        getThemeBuilderDraft = function(modal){
            const draft = beforeDraft.apply(this, arguments);
            draft.introMusicReactionsEnabledV154 = !!modal?.querySelector('.theme-builder-music-react-enabled-v154')?.checked;
            return draft;
        };
    } catch {}

    try {
        const beforePopulate = populateThemeBuilder;
        populateThemeBuilder = function(modal, theme = {}){
            const result = beforePopulate.apply(this, arguments);
            introReactionUiV154(modal, theme || {});
            requestAnimationFrame(() => introReactionUiV154(modal, theme || {}));
            ensureHistoryButtonV154(modal);
            return result;
        };
    } catch {}

    try {
        const beforeEnsure = ensureThemeBuilderModal;
        ensureThemeBuilderModal = function(){
            const modal = beforeEnsure.apply(this, arguments);
            introReactionUiV154(modal, {});
            ensureHistoryButtonV154(modal);
            return modal;
        };
    } catch {}

    try {
        const beforeAdvanced = ensureThemeBuilderAdvancedControlsV10;
        ensureThemeBuilderAdvancedControlsV10 = function(modal, merged){
            const result = beforeAdvanced.apply(this, arguments);
            introReactionUiV154(modal, merged || {});
            return result;
        };
    } catch {}

    try {
        const beforePreview = previewThemeBuilderIntroV10;
        previewThemeBuilderIntroV10 = function(modal){
            const result = beforePreview.apply(this, arguments);
            const theme = getThemeBuilderDraft(modal);
            const audio = modal?._themeBuilderIntroPreviewAudioV10;
            const stage = modal?.querySelector('.theme-builder-live-art-stage-v61, .theme-builder-dashboard-art-stage-v45, .theme-builder-dashboard-art-stage, .theme-builder-live-art-stage');
            startWhenPlayingV154(audio, stage, theme);
            return result;
        };
    } catch {}

    try {
        const beforeStop = stopThemeBuilderIntroPreviewV10;
        stopThemeBuilderIntroPreviewV10 = function(modal){
            const audio = modal?._themeBuilderIntroPreviewAudioV10;
            const stage = modal?.querySelector('.theme-builder-live-art-stage-v61, .theme-builder-dashboard-art-stage-v45, .theme-builder-dashboard-art-stage, .theme-builder-live-art-stage');
            if (audio) stopMusicReactionV154(audio, stage);
            else clearReactionStageV154(stage);
            return beforeStop.apply(this, arguments);
        };
    } catch {}

    try {
        const beforePlay = playCustomThemeIntroAudioV2;
        playCustomThemeIntroAudioV2 = function(theme = {}){
            const result = beforePlay.apply(this, arguments);
            let audio = null;
            try { audio = customThemeIntroAudioV2 || null; } catch {}
            const stage = document.getElementById('custom-theme-background-stage');
            startWhenPlayingV154(audio, stage, theme || {});
            return result;
        };
    } catch {}

    // ---------------------------------------------------------------------
    // VERSION HISTORY — project-side snapshots, last 10, lazy read.
    // ---------------------------------------------------------------------
    function compactHistoryThemeV154(theme){
        function clone(value){
            if (Array.isArray(value)) return value.map(clone);
            if (!value || typeof value !== 'object') return value;
            const hasProjectUrl = typeof value.url === 'string' && /^\//.test(value.url);
            const next = {};
            for (const [key, item] of Object.entries(value)) {
                if (key.startsWith('_') || key === 'file' || key === 'blob') continue;
                if (hasProjectUrl && (key === 'dataUrl' || (key === 'markup' && typeof item === 'string' && item.length > 12000))) continue;
                next[key] = clone(item);
            }
            return next;
        }
        return clone(theme || {});
    }

    function currentHistoryThemeIdV154(modal){
        const query = new URLSearchParams(location.search);
        return safeText(
            modal?.dataset?.themeBuilderEditingCopyV30 ||
            modal?.dataset?.themeBuilderEditingThemeV25 ||
            query.get('themeId') ||
            (modal?.dataset?.themeBuilderMode === 'edit-custom-theme-v49' ? 'theme-custom-builder' : '') ||
            'theme-custom-builder'
        );
    }

    function historyUrlV154(themeId){
        return `${HISTORY_API}/${encodeURIComponent(HOBBY || 'log')}/${encodeURIComponent(themeId || 'theme-custom-builder')}`;
    }

    function saveHistorySnapshotV154(modal, forcedId, forcedTheme){
        if (!modal) return;
        let theme = forcedTheme;
        try { if (!theme) theme = getThemeBuilderDraft(modal); } catch { return; }
        if (!theme || typeof theme !== 'object') return;
        const themeId = forcedId || currentHistoryThemeIdV154(modal);
        const compact = compactHistoryThemeV154(theme);
        // Fire-and-forget on purpose: version history must never delay Save.
        try {
            fetch(historyUrlV154(themeId), {
                method:'POST',
                headers:{'Content-Type':'application/json'},
                body:JSON.stringify({ name:compact.name || 'Theme', theme:compact })
            }).catch(() => {});
        } catch {}
    }

    // Dashboard Theme Studio knows the final generated id only here.
    try {
        const beforeStudioWrite = saveSharedThemeFromStudioV43;
        saveSharedThemeFromStudioV43 = function(entry){
            const result = beforeStudioWrite.apply(this, arguments);
            if (entry?.id && entry?.theme) {
                const modal = document.getElementById('theme-builder-modal');
                saveHistorySnapshotV154(modal, entry.id, entry.theme);
            }
            return result;
        };
    } catch {}

    document.addEventListener('click', event => {
        const button = event.target.closest('#theme-builder-modal .theme-builder-save, #theme-builder-modal .theme-builder-save-apply-v49, #theme-builder-modal .theme-builder-create-apply-v45');
        if (!button) return;
        const modal = button.closest('#theme-builder-modal');
        try {
            if (typeof isDashboardThemeStudioV43 === 'function' && isDashboardThemeStudioV43()) return; // handled by final-id wrapper above
        } catch {}
        try {
            if (typeof validateThemeBuilderBeforeSaveV25 === 'function' && !validateThemeBuilderBeforeSaveV25(modal)) return;
        } catch {}
        saveHistorySnapshotV154(modal);
    }, true);

    function ensureHistoryModalV154(){
        let overlay = document.getElementById('theme-builder-history-modal-v154');
        if (overlay) return overlay;
        overlay = document.createElement('div');
        overlay.id = 'theme-builder-history-modal-v154';
        overlay.className = 'modal-overlay hidden theme-builder-history-overlay-v154';
        overlay.innerHTML = `
            <div class="modal-box theme-builder-history-box-v154">
                <div class="modal-header">
                    <div>
                        <h2>Theme Version History</h2>
                        <p class="feature-modal-subtitle">The last 10 saves for this theme.</p>
                    </div>
                    <button type="button" class="small-icon-btn theme-builder-history-close-v154" title="Close"><i class="ph ph-x"></i></button>
                </div>
                <div class="theme-builder-history-list-v154"></div>
            </div>`;
        document.body.appendChild(overlay);
        const close = () => {
            overlay.classList.add('hidden');
            overlay.setAttribute('aria-hidden', 'true');
        };
        overlay.querySelector('.theme-builder-history-close-v154')?.addEventListener('click', close);
        overlay.addEventListener('pointerdown', e => { if (e.target === overlay) close(); });
        return overlay;
    }

    function formatHistoryTimeV154(iso){
        const d = new Date(iso);
        if (!Number.isFinite(d.getTime())) return 'Saved version';
        return d.toLocaleString([], { month:'short', day:'numeric', hour:'numeric', minute:'2-digit' });
    }

    async function openHistoryV154(modal){
        const overlay = ensureHistoryModalV154();
        const list = overlay.querySelector('.theme-builder-history-list-v154');
        // V156: force History above Theme Builder even when older global modal
        // CSS uses !important. Re-appending also keeps it last in modal DOM order.
        try { document.body.appendChild(overlay); } catch {}
        try { overlay.style.setProperty('z-index', '2147483200', 'important'); } catch {}
        try { overlay.querySelector('.theme-builder-history-box-v154')?.style.setProperty('z-index', '2147483201', 'important'); } catch {}
        overlay.classList.remove('hidden');
        overlay.setAttribute('aria-hidden', 'false');
        list.innerHTML = '<div class="theme-builder-history-empty-v154"><i class="ph ph-spinner-gap"></i><strong>Loading version history…</strong></div>';
        const themeId = currentHistoryThemeIdV154(modal);
        let data;
        try {
            const response = await fetch(historyUrlV154(themeId), { cache:'no-store' });
            data = await response.json();
            if (!response.ok) throw new Error(data?.message || 'Could not load history.');
        } catch (error) {
            list.innerHTML = `<div class="theme-builder-history-empty-v154">${escapeCustomHtml(error.message || 'Could not load history.')}</div>`;
            return;
        }
        const entries = Array.isArray(data?.entries) ? data.entries.slice(0, 10) : [];
        if (!entries.length) {
            list.innerHTML = '<div class="theme-builder-history-empty-v154"><i class="ph ph-clock-counter-clockwise"></i><strong>No saved versions yet</strong><span>Save this theme to create its first version. Your last 10 saves will appear here.</span></div>';
            return;
        }
        list.innerHTML = entries.map((entry, index) => `
            <article class="theme-builder-history-card-v154">
                <div class="theme-builder-history-card-copy-v154">
                    <strong>${escapeCustomHtml(entry.name || 'Theme')}</strong>
                    <span>${escapeCustomHtml(formatHistoryTimeV154(entry.savedAt))}</span>
                </div>
                <button type="button" class="theme-builder-history-restore-v154" data-history-index-v154="${index}">
                    <i class="ph ph-arrow-counter-clockwise"></i> Restore
                </button>
            </article>`).join('');
        list.querySelectorAll('[data-history-index-v154]').forEach(button => {
            button.addEventListener('click', () => {
                const entry = entries[Number(button.dataset.historyIndexV154)];
                if (!entry?.theme) return;
                const editingTheme = modal.dataset.themeBuilderEditingThemeV25;
                const editingCopy = modal.dataset.themeBuilderEditingCopyV30;
                const mode = modal.dataset.themeBuilderMode;
                try { stopThemeBuilderIntroPreviewV10?.(modal); } catch {}
                populateThemeBuilder(modal, JSON.parse(JSON.stringify(entry.theme)));
                if (editingTheme) modal.dataset.themeBuilderEditingThemeV25 = editingTheme;
                if (editingCopy) modal.dataset.themeBuilderEditingCopyV30 = editingCopy;
                if (mode) modal.dataset.themeBuilderMode = mode;
                try { if (typeof installLogEditSaveButtonsV49 === 'function') installLogEditSaveButtonsV49(modal); } catch {}
                overlay.classList.add('hidden');
                showFeatureToast(`Restored ${formatHistoryTimeV154(entry.savedAt)} in the editor. Save to keep it.`);
            });
        });
    }

    function ensureHistoryButtonV154(modal){
        const header = modal?.querySelector('.modal-header');
        const close = header?.querySelector('.theme-builder-close');
        if (!header || !close) return;
        let button = header.querySelector('.theme-builder-history-btn-v154');
        if (!button) {
            button = document.createElement('button');
            button.type = 'button';
            button.className = 'small-icon-btn theme-builder-history-btn-v154';
            button.title = 'Theme Version History';
            button.setAttribute('aria-label', 'Theme Version History');
            button.innerHTML = '<i class="ph ph-clock-counter-clockwise"></i>';
            close.insertAdjacentElement('beforebegin', button);
            button.addEventListener('click', () => openHistoryV154(modal));
        }
    }

    // ---------------------------------------------------------------------
    // THEME PACKS — controls live directly below the theme gallery.
    // ---------------------------------------------------------------------
    function resolveThemeForPackV154(themeId){
        const id = safeText(themeId);
        try {
            const shared = readSharedThemeLibraryV40?.().find?.(entry => String(entry?.id || '') === id);
            if (shared?.theme) return { id, name:shared.name || shared.theme.name || 'Custom Theme', theme:shared.theme };
        } catch {}
        try {
            const copy = getThemeCopyV30?.(id);
            if (copy?.theme) return { id, name:copy.name || copy.theme.name || 'Custom Theme', theme:copy.theme };
        } catch {}
        if (id === 'theme-custom-builder') {
            try {
                const theme = getCustomThemeSettings?.();
                if (theme) return { id, name:theme.name || 'Custom Theme', theme };
            } catch {}
        }
        try {
            const override = getThemeOverrideV25?.(id);
            if (override) return { id, name:override.name || id.replace(/^theme-/, ''), theme:override };
        } catch {}
        return null;
    }

    function currentThemePackSelectionV154(){
        return safeText(
            (typeof themePickerSelected !== 'undefined' ? themePickerSelected : '') ||
            db?.settings?.theme ||
            dailyThemeSelect?.value ||
            'theme-custom-builder'
        );
    }

    async function exportThemePackV154(button){
        const id = currentThemePackSelectionV154();
        const resolved = resolveThemeForPackV154(id);
        if (!resolved) {
            showFeatureToast('Choose a custom or edited theme to export.');
            return;
        }
        const old = button.innerHTML;
        button.disabled = true;
        button.innerHTML = '<i class="ph ph-spinner-gap"></i> Creating ZIP…';
        try {
            const response = await fetch(`/api/theme-pack/export/${encodeURIComponent(HOBBY || 'log')}`, {
                method:'POST',
                headers:{'Content-Type':'application/json'},
                body:JSON.stringify({ themeId:resolved.id, name:resolved.name, theme:resolved.theme })
            });
            if (!response.ok) {
                const data = await response.json().catch(() => ({}));
                throw new Error(data?.message || 'Could not export Theme Pack.');
            }
            const blob = await response.blob();
            const disposition = response.headers.get('Content-Disposition') || '';
            const match = disposition.match(/filename="?([^";]+)"?/i);
            const filename = match?.[1] || `${(resolved.name || 'theme').replace(/[^a-z0-9_-]+/gi, '-')}-theme-pack.zip`;
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            a.remove();
            setTimeout(() => URL.revokeObjectURL(url), 1500);
            showFeatureToast(`Exported “${resolved.name}” Theme Pack.`);
        } catch (error) {
            showFeatureToast(error.message || 'Could not export Theme Pack.');
        } finally {
            button.disabled = false;
            button.innerHTML = old;
        }
    }

    async function importThemePackV154(file, button){
        if (!file) return;
        const old = button.innerHTML;
        button.disabled = true;
        button.innerHTML = '<i class="ph ph-spinner-gap"></i> Restoring…';
        try {
            const bytes = await file.arrayBuffer();
            const response = await fetch(`/api/theme-pack/import/${encodeURIComponent(HOBBY || 'log')}`, {
                method:'POST',
                headers:{'Content-Type':'application/zip'},
                body:bytes
            });
            const data = await response.json().catch(() => ({}));
            if (!response.ok || data?.status !== 'success' || !data?.theme) throw new Error(data?.message || 'Could not import Theme Pack.');
            const id = `theme-custom-builder-import-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,7)}`;
            const name = safeText(data.name || data.theme.name) || 'Imported Theme';
            publishSharedThemeV40({ id, name, theme:data.theme, sourceThemeId:'' });
            try { syncSharedThemesIntoLogV40(); } catch {}
            try { syncThemeCopyOptionsV30(); } catch {}
            db.settings.theme = id;
            try { await saveDb(); } catch {}
            try { await applyTheme(id, { persist:false }); } catch {}
            if (dailyThemeSelect) dailyThemeSelect.value = id;
            try { themePickerSelected = id; } catch {}
            try { renderThemePicker(); } catch {}
            showFeatureToast(`Imported “${name}” with ${Number(data.assetsImported) || 0} project file${Number(data.assetsImported) === 1 ? '' : 's'}.`);
        } catch (error) {
            showFeatureToast(error.message || 'Could not import Theme Pack.');
        } finally {
            button.disabled = false;
            button.innerHTML = old;
        }
    }

    function ensureThemePackControlsV154(){
        const grid = document.getElementById('theme-picker');
        if (!grid || document.getElementById('theme-pack-tools-v154')) return;
        const tools = document.createElement('div');
        tools.id = 'theme-pack-tools-v154';
        tools.className = 'theme-pack-tools-v154';
        tools.innerHTML = `
            <div class="theme-pack-tools-copy-v154">
                <strong><i class="ph ph-package"></i> Theme Pack Backup</strong>
                <small>Export the selected custom theme with its images, sounds, background, and settings — or restore one from a ZIP.</small>
            </div>
            <div class="theme-pack-tools-actions-v154">
                <button type="button" class="theme-pack-export-v154"><i class="ph ph-download-simple"></i> Export Selected Theme</button>
                <button type="button" class="theme-pack-import-v154"><i class="ph ph-upload-simple"></i> Import Theme Pack</button>
                <input type="file" class="theme-pack-file-v154 hidden" accept=".zip,application/zip,application/octet-stream">
            </div>`;
        const empty = document.getElementById('theme-search-empty');
        (empty || grid).insertAdjacentElement('afterend', tools);
        const exportButton = tools.querySelector('.theme-pack-export-v154');
        const importButton = tools.querySelector('.theme-pack-import-v154');
        const fileInput = tools.querySelector('.theme-pack-file-v154');
        exportButton.addEventListener('click', () => exportThemePackV154(exportButton));
        importButton.addEventListener('click', () => fileInput.click());
        fileInput.addEventListener('change', async () => {
            const file = fileInput.files?.[0];
            fileInput.value = '';
            if (file) await importThemePackV154(file, importButton);
        });
    }

    try {
        const beforeRenderPicker = renderThemePicker;
        renderThemePicker = function(){
            const result = beforeRenderPicker.apply(this, arguments);
            ensureThemePackControlsV154();
            return result;
        };
    } catch {}

    requestAnimationFrame(() => {
        ensureThemePackControlsV154();
        const modal = document.getElementById('theme-builder-modal');
        if (modal) {
            introReactionUiV154(modal, {});
            ensureHistoryButtonV154(modal);
        }
    });

    window.__themeMusicReactionsV154 = {
        start:startMusicReactionV154,
        stop:stopMusicReactionV154,
        clear:clearReactionStageV154
    };
})();


// ============================================================================
// V158 — SMOOTH BACKGROUNDS / TRUE BACKGROUND PERSISTENCE / SMART CONTRAST
//        UNIQUE CURSOR TRAILS / FAVORITES / THEME PROMPT / TAB DEDUPE
//        CHECKLIST ITEM IMAGES
// ============================================================================
(function(){
    if (window.__loggyV158) return;
    window.__loggyV158 = true;

    // ---------------------------------------------------------------------
    // 1–2) Replace the old harsh preset collection with a deliberately soft,
    // layered collection. Existing saved CSS strings still keep working.
    // ---------------------------------------------------------------------
    const SMOOTH_BACKGROUNDS_V158 = [{"name": "Summer Shore", "css": "radial-gradient(circle at 50% 5%,rgba(255,255,255,.58),transparent 32%),radial-gradient(circle at 16% 82%,rgba(255,146,126,.18),transparent 30%),radial-gradient(circle at 86% 16%,rgba(255,211,110,.20),transparent 28%),linear-gradient(180deg,#bfe9fb 0%,#daf6ff 34%,#fef0ca 74%,#f9e1bf 100%)"}, {"name": "Seafoam Morning", "css": "radial-gradient(ellipse at 18% 18%,rgba(125,211,196,.20),transparent 48%),radial-gradient(ellipse at 86% 74%,rgba(133,197,219,.18),transparent 52%),linear-gradient(155deg,#d9f3ed 0%,#e8f7f3 46%,#dceff2 100%)"}, {"name": "Peach Linen", "css": "radial-gradient(ellipse at 78% 16%,rgba(244,171,139,.18),transparent 50%),radial-gradient(ellipse at 18% 84%,rgba(234,190,157,.14),transparent 52%),linear-gradient(145deg,#f8e2d4 0%,#f7eadf 48%,#f2ddd3 100%)"}, {"name": "Lavender Fog", "css": "radial-gradient(ellipse at 20% 24%,rgba(164,146,204,.16),transparent 52%),radial-gradient(ellipse at 82% 72%,rgba(139,166,210,.14),transparent 54%),linear-gradient(155deg,#e7e0ef 0%,#eee8f2 50%,#dfe7f0 100%)"}, {"name": "Rosewater Dawn", "css": "radial-gradient(ellipse at 72% 22%,rgba(220,146,166,.16),transparent 50%),radial-gradient(ellipse at 18% 78%,rgba(224,176,151,.13),transparent 54%),linear-gradient(150deg,#f4dfe4 0%,#f6e9e7 48%,#efe1dc 100%)"}, {"name": "Buttercream Sky", "css": "radial-gradient(ellipse at 78% 20%,rgba(230,198,119,.18),transparent 52%),radial-gradient(ellipse at 16% 82%,rgba(151,190,216,.16),transparent 56%),linear-gradient(155deg,#f7edce 0%,#f8f1dc 48%,#e1edf2 100%)"}, {"name": "Minted Pearl", "css": "radial-gradient(ellipse at 16% 20%,rgba(130,190,165,.16),transparent 54%),radial-gradient(ellipse at 84% 76%,rgba(188,176,214,.13),transparent 54%),linear-gradient(150deg,#e3f1e9 0%,#eef4ee 50%,#e7e2ef 100%)"}, {"name": "Blue Hydrangea", "css": "radial-gradient(ellipse at 20% 70%,rgba(119,151,205,.18),transparent 52%),radial-gradient(ellipse at 82% 22%,rgba(166,143,196,.15),transparent 54%),linear-gradient(145deg,#dce7f4 0%,#e8eaf4 48%,#e5dff0 100%)"}, {"name": "Sakura Haze", "css": "radial-gradient(ellipse at 78% 26%,rgba(214,151,175,.17),transparent 52%),radial-gradient(ellipse at 18% 78%,rgba(172,157,204,.12),transparent 56%),linear-gradient(150deg,#f3e0e8 0%,#f6e9ec 52%,#e9e3ef 100%)"}, {"name": "Soft Apricot", "css": "radial-gradient(ellipse at 20% 18%,rgba(234,163,118,.16),transparent 52%),radial-gradient(ellipse at 82% 80%,rgba(221,181,138,.13),transparent 56%),linear-gradient(150deg,#f6dfcf 0%,#f8e9dc 50%,#f1e0d0 100%)"}, {"name": "Cloudberry", "css": "radial-gradient(ellipse at 78% 18%,rgba(183,146,191,.16),transparent 52%),radial-gradient(ellipse at 18% 80%,rgba(218,164,156,.14),transparent 55%),linear-gradient(145deg,#eadfe9 0%,#f2e6e5 50%,#eddad7 100%)"}, {"name": "Coastal Glass", "css": "radial-gradient(ellipse at 18% 78%,rgba(95,169,181,.17),transparent 55%),radial-gradient(ellipse at 84% 18%,rgba(126,179,206,.16),transparent 52%),linear-gradient(150deg,#d4ebea 0%,#e3f1ef 48%,#d8e8ef 100%)"}, {"name": "Lilac Tide", "css": "radial-gradient(ellipse at 24% 18%,rgba(163,142,200,.17),transparent 52%),radial-gradient(ellipse at 80% 78%,rgba(114,174,196,.15),transparent 56%),linear-gradient(155deg,#e3dcef 0%,#ece8f2 48%,#d9e9ec 100%)"}, {"name": "Sage Mist", "css": "radial-gradient(ellipse at 18% 22%,rgba(119,159,130,.15),transparent 54%),radial-gradient(ellipse at 82% 76%,rgba(191,176,140,.13),transparent 58%),linear-gradient(145deg,#e0e8dd 0%,#edf0e7 52%,#e8e0d2 100%)"}, {"name": "Honey Cream", "css": "radial-gradient(ellipse at 76% 20%,rgba(209,172,92,.17),transparent 54%),radial-gradient(ellipse at 18% 82%,rgba(217,181,128,.12),transparent 56%),linear-gradient(150deg,#f4e7c6 0%,#f7efd9 50%,#eee1c6 100%)"}, {"name": "Ballet Slipper", "css": "radial-gradient(ellipse at 20% 18%,rgba(207,144,157,.14),transparent 54%),radial-gradient(ellipse at 82% 78%,rgba(208,171,165,.12),transparent 56%),linear-gradient(150deg,#f0dfe1 0%,#f4e8e6 48%,#eadbd8 100%)"}, {"name": "Powder Blue", "css": "radial-gradient(ellipse at 80% 20%,rgba(118,157,194,.15),transparent 54%),radial-gradient(ellipse at 16% 80%,rgba(152,181,205,.12),transparent 58%),linear-gradient(150deg,#dce8f1 0%,#e7eef3 52%,#d9e4ec 100%)"}, {"name": "Dreamy Denim", "css": "radial-gradient(ellipse at 20% 24%,rgba(93,117,154,.17),transparent 54%),radial-gradient(ellipse at 82% 76%,rgba(145,131,166,.14),transparent 58%),linear-gradient(150deg,#cad5e4 0%,#d8dce7 50%,#d5ccdc 100%)"}, {"name": "Dusty Mauve", "css": "radial-gradient(ellipse at 18% 20%,rgba(142,99,127,.15),transparent 55%),radial-gradient(ellipse at 84% 76%,rgba(165,127,131,.13),transparent 58%),linear-gradient(145deg,#ddccd6 0%,#e6d9dd 50%,#dccdcf 100%)"}, {"name": "Warm Sand", "css": "radial-gradient(ellipse at 78% 20%,rgba(178,144,103,.14),transparent 56%),radial-gradient(ellipse at 18% 80%,rgba(198,165,124,.11),transparent 58%),linear-gradient(150deg,#e9dcc6 0%,#efe6d7 50%,#e5d6bf 100%)"}, {"name": "Pearl Grey", "css": "radial-gradient(ellipse at 18% 20%,rgba(134,147,160,.12),transparent 58%),radial-gradient(ellipse at 82% 78%,rgba(174,160,178,.10),transparent 58%),linear-gradient(145deg,#e2e4e6 0%,#ecebec 50%,#dddfe3 100%)"}, {"name": "Pistachio Milk", "css": "radial-gradient(ellipse at 20% 18%,rgba(143,176,128,.15),transparent 55%),radial-gradient(ellipse at 82% 78%,rgba(199,183,139,.12),transparent 58%),linear-gradient(150deg,#e5ebd8 0%,#eff0e3 48%,#e9dfc9 100%)"}, {"name": "Vanilla Lilac", "css": "radial-gradient(ellipse at 78% 18%,rgba(167,145,199,.14),transparent 56%),radial-gradient(ellipse at 18% 80%,rgba(215,193,130,.11),transparent 58%),linear-gradient(150deg,#f1ead7 0%,#f2edf0 50%,#e6deed 100%)"}, {"name": "Aquamarine Veil", "css": "radial-gradient(ellipse at 18% 22%,rgba(78,167,164,.18),transparent 55%),radial-gradient(ellipse at 82% 76%,rgba(116,145,190,.13),transparent 58%),linear-gradient(145deg,#cae7e2 0%,#dcece8 48%,#d7dfeb 100%)"}, {"name": "Peony Milk", "css": "radial-gradient(ellipse at 80% 20%,rgba(205,125,155,.15),transparent 55%),radial-gradient(ellipse at 16% 82%,rgba(177,148,191,.11),transparent 58%),linear-gradient(150deg,#eed9e1 0%,#f3e5e7 50%,#e7dfe9 100%)"}, {"name": "Coconut Water", "css": "radial-gradient(ellipse at 18% 20%,rgba(119,179,173,.13),transparent 58%),radial-gradient(ellipse at 82% 78%,rgba(210,188,144,.10),transparent 60%),linear-gradient(145deg,#e6efeb 0%,#f1efe5 52%,#e9e0cf 100%)"}, {"name": "Seaside Evening", "css": "radial-gradient(ellipse at 18% 24%,rgba(72,111,144,.18),transparent 56%),radial-gradient(ellipse at 82% 76%,rgba(114,86,132,.15),transparent 58%),linear-gradient(150deg,#49677d 0%,#586a7e 48%,#62586f 100%)"}, {"name": "Plum Velvet", "css": "radial-gradient(ellipse at 20% 18%,rgba(126,79,119,.18),transparent 58%),radial-gradient(ellipse at 80% 82%,rgba(81,68,106,.14),transparent 60%),linear-gradient(145deg,#3f2d42 0%,#4a354a 50%,#383449 100%)"}, {"name": "Midnight Lake", "css": "radial-gradient(ellipse at 18% 22%,rgba(49,92,116,.17),transparent 58%),radial-gradient(ellipse at 82% 78%,rgba(52,68,108,.13),transparent 60%),linear-gradient(150deg,#152b38 0%,#1e3542 48%,#202b44 100%)"}, {"name": "Forest Velvet", "css": "radial-gradient(ellipse at 20% 20%,rgba(66,112,89,.17),transparent 58%),radial-gradient(ellipse at 82% 78%,rgba(87,92,69,.12),transparent 60%),linear-gradient(145deg,#1f352c 0%,#294038 50%,#30382d 100%)"}, {"name": "Cocoa Rose", "css": "radial-gradient(ellipse at 20% 18%,rgba(123,82,78,.16),transparent 58%),radial-gradient(ellipse at 82% 80%,rgba(119,72,91,.13),transparent 60%),linear-gradient(150deg,#3a2928 0%,#49302f 48%,#432b38 100%)"}, {"name": "Stormy Lilac", "css": "radial-gradient(ellipse at 18% 22%,rgba(105,96,132,.16),transparent 58%),radial-gradient(ellipse at 82% 76%,rgba(74,94,116,.13),transparent 60%),linear-gradient(145deg,#353848 0%,#414151 50%,#354350 100%)"}, {"name": "Deep Teal", "css": "radial-gradient(ellipse at 18% 20%,rgba(48,118,118,.18),transparent 58%),radial-gradient(ellipse at 84% 78%,rgba(50,90,104,.13),transparent 60%),linear-gradient(150deg,#17383a 0%,#204648 48%,#203a45 100%)"}, {"name": "Wine Satin", "css": "radial-gradient(ellipse at 20% 18%,rgba(135,62,85,.17),transparent 58%),radial-gradient(ellipse at 82% 80%,rgba(92,58,82,.13),transparent 60%),linear-gradient(145deg,#46202d 0%,#572638 50%,#41283d 100%)"}, {"name": "Charcoal Blue", "css": "radial-gradient(ellipse at 18% 22%,rgba(62,83,105,.15),transparent 60%),radial-gradient(ellipse at 82% 76%,rgba(88,78,107,.11),transparent 60%),linear-gradient(145deg,#262d35 0%,#303943 50%,#302f3b 100%)"}, {"name": "Night Bloom", "css": "radial-gradient(ellipse at 22% 18%,rgba(105,67,124,.17),transparent 58%),radial-gradient(ellipse at 80% 80%,rgba(50,89,102,.12),transparent 60%),linear-gradient(150deg,#2e2437 0%,#392c45 48%,#283b43 100%)"}, {"name": "Moss & Ink", "css": "radial-gradient(ellipse at 18% 20%,rgba(94,112,72,.16),transparent 60%),radial-gradient(ellipse at 82% 78%,rgba(51,74,78,.12),transparent 60%),linear-gradient(145deg,#303728 0%,#394232 50%,#2d3a3b 100%)"}, {"name": "Espresso Cream", "css": "radial-gradient(ellipse at 18% 18%,rgba(132,96,72,.15),transparent 58%),radial-gradient(ellipse at 82% 80%,rgba(96,74,69,.12),transparent 60%),linear-gradient(145deg,#3b2d25 0%,#49382e 50%,#3f3330 100%)"}, {"name": "Muted Berry", "css": "radial-gradient(ellipse at 18% 20%,rgba(137,79,109,.16),transparent 58%),radial-gradient(ellipse at 82% 80%,rgba(103,82,126,.13),transparent 60%),linear-gradient(150deg,#4a3040 0%,#59374c 48%,#463752 100%)"}, {"name": "Slate Coast", "css": "radial-gradient(ellipse at 20% 18%,rgba(73,108,126,.16),transparent 60%),radial-gradient(ellipse at 82% 78%,rgba(87,91,115,.12),transparent 60%),linear-gradient(145deg,#334852 0%,#3e5159 50%,#404858 100%)"}, {"name": "Olive Smoke", "css": "radial-gradient(ellipse at 18% 22%,rgba(120,119,76,.15),transparent 60%),radial-gradient(ellipse at 82% 76%,rgba(78,92,78,.11),transparent 60%),linear-gradient(150deg,#454633 0%,#50503b 48%,#3e4a41 100%)"}, {"name": "Soft Terracotta", "css": "radial-gradient(ellipse at 18% 18%,rgba(189,111,83,.15),transparent 58%),radial-gradient(ellipse at 82% 80%,rgba(145,91,86,.11),transparent 60%),linear-gradient(145deg,#b97d6a 0%,#c68b76 50%,#a97972 100%)"}, {"name": "Dusky Rose", "css": "radial-gradient(ellipse at 18% 22%,rgba(170,103,124,.15),transparent 58%),radial-gradient(ellipse at 82% 78%,rgba(124,101,139,.12),transparent 60%),linear-gradient(150deg,#a97987 0%,#b98994 48%,#987f99 100%)"}, {"name": "Rainwashed Blue", "css": "radial-gradient(ellipse at 18% 18%,rgba(93,139,165,.15),transparent 60%),radial-gradient(ellipse at 82% 82%,rgba(118,133,158,.11),transparent 60%),linear-gradient(145deg,#91adbd 0%,#a4b8c3 50%,#9ca7ba 100%)"}, {"name": "Quiet Orchid", "css": "radial-gradient(ellipse at 18% 20%,rgba(142,112,164,.15),transparent 58%),radial-gradient(ellipse at 82% 80%,rgba(116,135,164,.11),transparent 60%),linear-gradient(145deg,#ad97ba 0%,#b9a8c1 50%,#a5adc0 100%)"}, {"name": "Golden Sandbar", "css": "radial-gradient(ellipse at 78% 18%,rgba(199,157,84,.16),transparent 56%),radial-gradient(ellipse at 18% 82%,rgba(116,164,176,.12),transparent 60%),linear-gradient(155deg,#dfc58f 0%,#e9d8ae 50%,#bfd3d2 100%)"}, {"name": "Coral Mist", "css": "radial-gradient(ellipse at 18% 20%,rgba(217,119,102,.14),transparent 58%),radial-gradient(ellipse at 82% 78%,rgba(102,167,178,.12),transparent 60%),linear-gradient(150deg,#e7b9ae 0%,#ebcbc1 48%,#bcd5d6 100%)"}, {"name": "Wisteria Sea", "css": "radial-gradient(ellipse at 20% 18%,rgba(142,117,183,.16),transparent 58%),radial-gradient(ellipse at 82% 80%,rgba(83,151,175,.13),transparent 60%),linear-gradient(150deg,#b8add0 0%,#c9c1d8 48%,#a9cbd2 100%)"}];
    try {
        THEME_GRADIENT_PRESETS_V56.splice(0, THEME_GRADIENT_PRESETS_V56.length, ...SMOOTH_BACKGROUNDS_V158);
    } catch {}

    // ---------------------------------------------------------------------
    // 3) Every cursor gets a light-weight trail derived from its own theme.
    // We use the cursor's own emoji/name + colors from its SVG and a unique
    // two-mark signature, so no large cursor SVGs are cloned on every move.
    // ---------------------------------------------------------------------
    const TRAIL_MARKS_V158 = ['•','✦','◇','○','×','⌁','▴','▾','+','·','≈','˙','✧','□','△','◌'];
    function trailHashV158(value){
        let h = 2166136261;
        for (const ch of String(value || '')) { h ^= ch.codePointAt(0); h = Math.imul(h, 16777619); }
        return h >>> 0;
    }
    function trailEscV158(value){
        return String(value == null ? '' : value).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
    }
    function trailColorsV158(choice){
        const svg = String(choice?.svg || '');
        const colors = [...svg.matchAll(/#[0-9a-fA-F]{6}\b/g)].map(m => m[0].toLowerCase());
        const useful = colors.filter(c => !['#ffffff','#fffafa','#f8fafc','#000000','#111111','#171717'].includes(c));
        const id = String(choice?.id || '').toLowerCase();
        if (id === 'sparkle') return ['#f4c84f','#fff2a8'];
        if (id === 'hearts') return ['#ec5f8f','#f7b2ca'];
        if (id === 'bubbles') return ['#6bc6e8','#d9f5ff'];
        return [useful[0] || colors[0] || '#8da0b3', useful.find(c => c !== useful[0]) || colors.find(c => c !== colors[0]) || '#f4f5f7'];
    }
    const getCursorTrailProfileBeforeV158 = getCursorTrailProfile;
    getCursorTrailProfile = function(choice){
        if (!choice) return getCursorTrailProfileBeforeV158(choice);
        const index = Math.max(0, CURSOR_OPTIONS.indexOf(choice));
        const h = trailHashV158(choice.id || choice.name || index);
        const [color, accent] = trailColorsV158(choice);
        const a = TRAIL_MARKS_V158[index % TRAIL_MARKS_V158.length];
        const b = TRAIL_MARKS_V158[Math.floor(index / TRAIL_MARKS_V158.length) % TRAIL_MARKS_V158.length];
        const symbol = String(choice.emoji || (choice.name || '•').trim().slice(0,1) || '•');
        return {
            type:'themed-v158', color, accent, symbol, markA:a, markB:b,
            variant:index, hash:h
        };
    };
    const cursorTrailParticleHtmlBeforeV158 = cursorTrailParticleHtml;
    cursorTrailParticleHtml = function(profile){
        if (profile?.type !== 'themed-v158') return cursorTrailParticleHtmlBeforeV158(profile);
        return `<span class="trail-themed-token-v158" style="--trail-v158-variant:${Number(profile.variant)||0}">
            <span class="trail-themed-symbol-v158">${trailEscV158(profile.symbol)}</span>
            <span class="trail-themed-mark-v158 trail-themed-mark-a-v158">${trailEscV158(profile.markA)}</span>
            <span class="trail-themed-mark-v158 trail-themed-mark-b-v158">${trailEscV158(profile.markB)}</span>
        </span>`;
    };
    const spawnCursorParticleBeforeV158 = spawnCursorParticle;
    spawnCursorParticle = function(layer, choice, x, y){
        if (!layer || !choice) return;
        const profile = getCursorTrailProfile(choice);
        if (profile?.type !== 'themed-v158') return spawnCursorParticleBeforeV158(layer, choice, x, y);
        const el = document.createElement('div');
        el.className = `cursor-particle cursor-trail-themed-v158 cursor-trail-for-${choice.id}`;
        el.innerHTML = cursorTrailParticleHtml(profile);
        el.style.left = x + 'px';
        el.style.top = y + 'px';
        el.style.setProperty('--trail-color', profile.color);
        el.style.setProperty('--trail-accent', profile.accent);
        const angle = ((profile.variant * 47) % 150) - 75;
        const dx = Math.round(Math.sin(angle * Math.PI / 180) * (12 + (profile.variant % 5) * 3) + (Math.random() * 8 - 4));
        const dy = 16 + (profile.variant % 7) * 3 + Math.round(Math.random() * 8);
        const rot = ((profile.variant * 37) % 100) - 50 + Math.round(Math.random() * 20 - 10);
        const duration = 620 + (profile.variant % 8) * 34;
        el.style.setProperty('--trail-drift-x', `${dx}px`);
        el.style.setProperty('--trail-drift-y', `${dy}px`);
        el.style.setProperty('--trail-rotate', `${rot}deg`);
        el.style.setProperty('--trail-scale', String(.74 + (profile.variant % 5) * .07));
        el.style.setProperty('animation-duration', `${duration}ms`, 'important');
        layer.appendChild(el);
        setTimeout(() => el.remove(), duration + 100);
    };

    // ---------------------------------------------------------------------
    // 4) Music reaction must never put a dark/drop-shadow silhouette behind
    // transparent images. Scale/lift/particles stay; image filtering is gone.
    // ---------------------------------------------------------------------
    // CSS below is authoritative.

    // ---------------------------------------------------------------------
    // 6) Track which background source the user explicitly chose. A gradient
    // can now win over an older image/native theme background, and the mode is
    // saved with the theme so it survives refreshes.
    // ---------------------------------------------------------------------
    function inferredBackgroundModeV158(theme){
        const explicit = String(theme?.backgroundModeV158 || '').trim();
        if (['gradient','image','solid'].includes(explicit)) return explicit;
        if (String(theme?.backgroundGradientV56 || '').trim()) return 'gradient';
        if (String(theme?.backgroundImage || '').trim()) return 'image';
        return '';
    }
    try {
        const draftBeforeV158 = getThemeBuilderDraft;
        getThemeBuilderDraft = function(modal){
            const draft = draftBeforeV158.apply(this, arguments);
            draft.backgroundModeV158 = modal?._themeBackgroundModeV158 || inferredBackgroundModeV158(draft) || '';
            return draft;
        };
    } catch {}
    try {
        const populateBeforeV158 = populateThemeBuilder;
        populateThemeBuilder = function(modal, theme = {}){
            if (modal) modal._themeBackgroundModeV158 = inferredBackgroundModeV158(theme);
            const result = populateBeforeV158.apply(this, arguments);
            if (modal) modal._themeBackgroundModeV158 = inferredBackgroundModeV158(theme);
            ensureFullThemePromptButtonV158(modal);
            return result;
        };
    } catch {}
    document.addEventListener('click', event => {
        const modal = event.target.closest?.('#theme-builder-modal');
        if (!modal) return;
        if (event.target.closest('[data-gradient-index-v56]')) modal._themeBackgroundModeV158 = 'gradient';
        if (event.target.closest('.theme-gradient-clear-v56, .theme-gradient-none-v60')) modal._themeBackgroundModeV158 = 'solid';
        if (event.target.closest('.theme-builder-background-clear')) modal._themeBackgroundModeV158 = 'solid';
    }, true);
    document.addEventListener('change', event => {
        const input = event.target;
        if (input?.matches?.('#theme-builder-modal .theme-builder-background-file') && input.files?.length) {
            const modal = input.closest('#theme-builder-modal');
            if (modal) modal._themeBackgroundModeV158 = 'image';
        }
    }, true);

    function resolvedThemeV158(themeId){
        const id = String(themeId || '');
        try { const copy = getThemeCopyV30?.(id); if (copy?.theme) return copy.theme; } catch {}
        try { const shared = readSharedThemeLibraryV40?.().find?.(entry => String(entry?.id || '') === id); if (shared?.theme) return shared.theme; } catch {}
        if (id === 'theme-custom-builder') { try { return getCustomThemeSettings?.() || null; } catch {} }
        try { const override = getThemeOverrideV25?.(id); if (override) return override; } catch {}
        try { const map = JSON.parse(localStorage.getItem('loggy-built-in-theme-overrides-v102') || '{}'); if (map?.[id]) return map[id]; } catch {}
        try { return resolveThemeCreativeDataV56?.(id) || null; } catch {}
        return null;
    }
    function cssUrlV158(value){ return `url("${String(value || '').replace(/\\/g,'\\\\').replace(/"/g,'\\"')}")`; }
    function clearPersistentBackgroundV158(){
        if (document.body.dataset.backgroundOwnedV158 === 'true') {
            document.body.style.removeProperty('background-image');
            document.body.style.removeProperty('background-color');
            delete document.body.dataset.backgroundOwnedV158;
        }
    }
    function enforcePersistentBackgroundV158(theme){
        if (!theme || typeof theme !== 'object') { clearPersistentBackgroundV158(); return; }
        const mode = inferredBackgroundModeV158(theme);
        if (!mode) { clearPersistentBackgroundV158(); return; }
        const gradient = String(theme.backgroundGradientV56 || '').trim();
        const image = String(theme.backgroundImage || '').trim();
        let imageCss = 'none';
        if (mode === 'gradient' && gradient) imageCss = gradient;
        else if (mode === 'image' && image) imageCss = cssUrlV158(image);
        else if (mode === 'solid') imageCss = 'none';
        else if (gradient) imageCss = gradient;
        else if (image) imageCss = cssUrlV158(image);
        document.body.style.setProperty('background-image', imageCss, 'important');
        if (theme.background) document.body.style.setProperty('background-color', String(theme.background), 'important');
        document.body.dataset.backgroundOwnedV158 = 'true';
    }
    function schedulePersistentBackgroundV158(theme){
        // V171: apply the resolved background once, then confirm on the next
        // animation frame. Older repeated delayed writes caused the visible
        // background "flip" and could race decoration mounting.
        enforcePersistentBackgroundV158(theme);
        requestAnimationFrame(() => enforcePersistentBackgroundV158(theme));
    }
    try {
        const applyThemeBeforeV158 = applyTheme;
        applyTheme = async function(themeValue, opts = {}){
            const result = await applyThemeBeforeV158.apply(this, arguments);
            schedulePersistentBackgroundV158(resolvedThemeV158(themeValue));
            return result;
        };
    } catch {}
    try {
        const applyCustomBeforeV158 = applyCustomBuiltTheme;
        applyCustomBuiltTheme = function(theme = getCustomThemeSettings()){
            const result = applyCustomBeforeV158.apply(this, arguments);
            schedulePersistentBackgroundV158(theme || {});
            return result;
        };
    } catch {}

    // Make previews obey the same explicit background mode.
    try {
        const updatePreviewBeforeV158 = updateThemeBuilderPreview;
        updateThemeBuilderPreview = function(modal){
            const result = updatePreviewBeforeV158.apply(this, arguments);
            try {
                const draft = getThemeBuilderDraft(modal);
                const mode = inferredBackgroundModeV158(draft);
                const bg = mode === 'gradient' && draft.backgroundGradientV56 ? draft.backgroundGradientV56 :
                           mode === 'image' && draft.backgroundImage ? cssUrlV158(draft.backgroundImage) : 'none';
                modal?.querySelectorAll?.('.theme-builder-preview,.theme-builder-app-preview,.theme-builder-live-canvas').forEach(preview => {
                    preview.style.setProperty('background-image', bg, 'important');
                    preview.style.setProperty('background-color', draft.background || '#fff', 'important');
                    preview.style.setProperty('background-size', 'cover', 'important');
                    preview.style.setProperty('background-position', 'center', 'important');
                });
                const dash = modal?.querySelector?.('.theme-builder-dashboard-preview-v45,.theme-builder-dashboard-preview-v40');
                if (dash) dash.style.setProperty('background-image', bg, 'important');
            } catch {}
            return result;
        };
    } catch {}

    // ---------------------------------------------------------------------
    // 7) Background-aware Automatic Color Distributor. This only analyzes an
    // image when the user presses Fill Theme Colors. No polling/observers.
    // ---------------------------------------------------------------------
    function rgbFromHexV158(hex){
        const s = String(hex || '').trim().replace('#','');
        if (!/^[0-9a-f]{6}$/i.test(s)) return [127,127,127];
        return [0,2,4].map(i => parseInt(s.slice(i,i+2),16));
    }
    function hexFromRgbV158(rgb){ return '#' + rgb.map(v => Math.max(0,Math.min(255,Math.round(v))).toString(16).padStart(2,'0')).join(''); }
    function mixColorV158(a,b,t){ const x=rgbFromHexV158(a),y=rgbFromHexV158(b),k=Math.max(0,Math.min(1,Number(t)||0)); return hexFromRgbV158(x.map((v,i)=>v+(y[i]-v)*k)); }
    function lumColorV158(hex){
        const c=rgbFromHexV158(hex).map(v=>{v/=255;return v<=.04045?v/12.92:Math.pow((v+.055)/1.055,2.4)});
        return .2126*c[0]+.7152*c[1]+.0722*c[2];
    }
    function contrastV158(a,b){ const x=lumColorV158(a),y=lumColorV158(b); return (Math.max(x,y)+.05)/(Math.min(x,y)+.05); }
    function averageHexV158(colors){
        if (!colors.length) return '#f2f2f2';
        const sum=[0,0,0]; colors.forEach(c=>rgbFromHexV158(c).forEach((v,i)=>sum[i]+=v));
        return hexFromRgbV158(sum.map(v=>v/colors.length));
    }
    function gradientAverageV158(css, fallback){
        const raw=String(css||''); const colors=[];
        for (const m of raw.matchAll(/#[0-9a-fA-F]{6}\b/g)) colors.push(m[0]);
        for (const m of raw.matchAll(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*([\d.]+))?\s*\)/g)) {
            const alpha=m[4]===undefined?1:Number(m[4]); if(alpha>=.45) colors.push(hexFromRgbV158([+m[1],+m[2],+m[3]]));
        }
        return averageHexV158(colors.length?colors:[fallback||'#f2f2f2']);
    }
    function imageAverageV158(src){
        return new Promise(resolve => {
            const img=new Image(); let done=false;
            const finish=v=>{if(done)return;done=true;resolve(v)};
            const timer=setTimeout(()=>finish(''),2200);
            img.onload=()=>{
                clearTimeout(timer);
                try {
                    const canvas=document.createElement('canvas'); canvas.width=40; canvas.height=40;
                    const ctx=canvas.getContext('2d',{willReadFrequently:true}); ctx.drawImage(img,0,0,40,40);
                    const data=ctx.getImageData(0,0,40,40).data; let r=0,g=0,b=0,n=0;
                    for(let i=0;i<data.length;i+=4){ if(data[i+3]<80)continue; r+=data[i];g+=data[i+1];b+=data[i+2];n++; }
                    finish(n?hexFromRgbV158([r/n,g/n,b/n]):'');
                } catch { finish(''); }
            };
            img.onerror=()=>{clearTimeout(timer);finish('')};
            try { const u=new URL(src,location.href); if(u.origin!==location.origin) img.crossOrigin='anonymous'; } catch {}
            img.decoding='async'; img.src=src;
        });
    }
    function setColorControlV158(modal,key,value){
        const picker=modal?.querySelector?.(`input[type="color"][data-theme-key="${CSS.escape(key)}"]`);
        const hex=modal?.querySelector?.(`[data-theme-hex="${CSS.escape(key)}"]`);
        if(picker) picker.value=value; if(hex) hex.value=value;
    }
    async function visualAverageV158(modal){
        const draft=getThemeBuilderDraft(modal); const mode=inferredBackgroundModeV158(draft);
        if(mode==='image' && draft.backgroundImage){ const avg=await imageAverageV158(draft.backgroundImage); if(avg)return avg; }
        if(mode==='gradient' && draft.backgroundGradientV56) return gradientAverageV158(draft.backgroundGradientV56,draft.background);
        return /^#[0-9a-f]{6}$/i.test(String(draft.background||'')) ? draft.background : '#f2f2f2';
    }
    async function applyBackgroundAwareContrastV158(modal){
        if(!modal?.isConnected)return;
        const avg=await visualAverageV158(modal);
        if(!modal?.isConnected)return;
        const seed=modal.querySelector('.theme-builder-auto-seed-picker-v107')?.value || '#8b6fd8';
        const lightText=contrastV158(avg,'#f7f8fb') >= contrastV158(avg,'#17191c');
        const text=lightText?'#f7f8fb':'#17191c';
        const muted=lightText?'#c7ccd5':'#5c626b';
        const surface=lightText?mixColorV158(seed,'#12161b',.82):mixColorV158(seed,'#ffffff',.93);
        const surface2=lightText?mixColorV158(seed,'#20262e',.76):mixColorV158(seed,'#ffffff',.85);
        let accent=seed;
        if(lightText && contrastV158(accent,surface)<3) accent=mixColorV158(accent,'#ffffff',.34);
        if(!lightText && contrastV158(accent,surface)<3) accent=mixColorV158(accent,'#000000',.20);
        const border=lightText?mixColorV158(accent,'#ffffff',.34):mixColorV158(accent,'#000000',.28);
        const visualMode=inferredBackgroundModeV158(getThemeBuilderDraft(modal));
        const pickers=Array.from(modal.querySelectorAll('input[type="color"][data-theme-key]'));
        pickers.forEach(picker=>{
            const key=picker.dataset.themeKey||'';
            const label=picker.closest('.theme-builder-field')?.querySelector(':scope > span')?.textContent||'';
            const semantic=(key+' '+label).toLowerCase();
            if(key==='background') return;
            let value='';
            if(/muted|secondary text/.test(semantic)) value=muted;
            else if(/text|title|icon/.test(semantic)) value=text;
            else if(/selected|active|focus/.test(semantic) && /background|surface|card/.test(semantic)) value=accent;
            else if(/hover/.test(semantic) && /background|surface|card/.test(semantic)) value=surface2;
            else if(/border|outline/.test(semantic)) value=border;
            else if(/accent|button/.test(semantic)) value=accent;
            else if(/background|surface|card/.test(semantic)) value=surface;
            if(value) setColorControlV158(modal,key,value);
        });
        ['text','tabIconColor','tabTitleColor','dashboardTextV40','dashboardTitleColorV79'].forEach(k=>setColorControlV158(modal,k,text));
        ['muted'].forEach(k=>setColorControlV158(modal,k,muted));
        ['surface','dashboardCardV40'].forEach(k=>setColorControlV158(modal,k,surface));
        ['accent','dashboardAccentV40'].forEach(k=>setColorControlV158(modal,k,accent));
        setColorControlV158(modal,'border',border);
        try { updateThemeBuilderPreview(modal); } catch {}
        const note=modal.querySelector('.theme-builder-auto-colors-v107 small');
        if(note) note.textContent=`Background-aware palette · ${lightText?'dark':'light'} background detected, so ${lightText?'light':'dark'} text/UI colors were chosen.`;
    }
    document.addEventListener('click', event=>{
        const button=event.target.closest?.('#theme-builder-modal .theme-builder-auto-apply-v107');
        if(!button)return; const modal=button.closest('#theme-builder-modal');
        setTimeout(()=>applyBackgroundAwareContrastV158(modal),20);
    }, true);

    // ---------------------------------------------------------------------
    // 8a) Copy a full Theme Pack generation prompt for another AI.
    // ---------------------------------------------------------------------
    function fullThemePromptV158(modal){
        let draft={}; try{draft=getThemeBuilderDraft(modal)||{}}catch{}
        const name=String(draft.name||'Custom Theme').trim()||'Custom Theme';
        const slug=name.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'')||'custom-theme';
        return `Create a complete importable Loggy Theme Pack for a theme called "${name}".\n\nCURRENT PALETTE TO USE AS A STARTING POINT:\n- page/background: ${draft.background||'#f5f5f5'}\n- cards/surfaces: ${draft.surface||'#ffffff'}\n- main text: ${draft.text||'#171717'}\n- muted text: ${draft.muted||'#666666'}\n- accent: ${draft.accent||'#888888'}\n- border: ${draft.border||'#222222'}\n\nDELIVERY FORMAT — IMPORTANT:\nReturn ONE downloadable ZIP file. Do not return only code in chat. The ZIP must contain a file named theme.json at its root. It may also contain generated assets under assets/svg/${slug}/, assets/sounds/${slug}/, and assets/themes/${slug}/. Do not use external URLs or hotlinked assets.\n\ntheme.json MUST have this outer structure:\n{\n  "packVersion": 1,\n  "type": "loggy-theme-pack",\n  "name": "${name}",\n  "themeId": "theme-custom-builder-${slug}",\n  "theme": { ...theme settings... }\n}\n\nInside "theme", include a polished coherent set of these settings when relevant:\nname, background, surface, text, muted, accent, border, radius, shadow, font, backgroundModeV158, backgroundGradientV56, backgroundGradientNameV56, interactiveBackgroundCodeV56, backgroundImage, introAudio, audioStart, audioEnd, audioFade, introSvgBounceEnabled, introMusicReactionsEnabledV154, svgHoverSounds, backgroundSvgs, dashboardBackgroundV40, dashboardCardV40, dashboardTextV40, dashboardAccentV40, dashboardTitleColorV79, tabIconColor, and tabTitleColor.\n\nIf you generate decoration SVG/PNG files, put them in assets/svg/${slug}/ and reference them inside backgroundSvgs with URLs like /svg/${slug}/filename.svg or /svg/${slug}/filename.png. If you include audio, put it in assets/sounds/${slug}/ and reference it as /sounds/${slug}/filename.mp3. If you include a background image, put it in assets/themes/${slug}/ and reference it as /themes/${slug}/filename.png. The importer rewrites these asset paths automatically.\n\nSTYLE REQUIREMENTS:\n- Make the theme cohesive, aesthetic, readable, and usable rather than neon or harsh.\n- Prefer smooth layered gradients with gentle color transitions and no strong white spotlight blobs.\n- Text and icon colors must have strong contrast against backgrounds/surfaces.\n- If the background is dark, use light text and dark coordinated surfaces. If the background is light, use dark text and light coordinated surfaces.\n- Foreground decorations should have transparent backgrounds and remain separate from the background.\n- Interactive background code, if used, must be one self-contained HTML document with inline CSS/JS only, no network requests, no external libraries, and gentle motion.\n- Keep performance lightweight.\n- The final ZIP must be directly importable using Loggy's “Import Theme Pack” button.`;
    }
    async function copyTextV158(text){
        try{await navigator.clipboard.writeText(text);return true}catch{}
        try{const a=document.createElement('textarea');a.value=text;a.style.cssText='position:fixed;opacity:0;pointer-events:none';document.body.appendChild(a);a.select();document.execCommand('copy');a.remove();return true}catch{return false}
    }
    function ensureFullThemePromptButtonV158(modal){
        if(!modal || modal.querySelector('.theme-copy-full-prompt-v158'))return;
        const field=modal.querySelector('[data-theme-key="name"]')?.closest('.theme-builder-field');
        const controls=modal.querySelector('.theme-builder-controls');
        if(!controls)return;
        const row=document.createElement('div'); row.className='theme-full-prompt-row-v158';
        row.innerHTML=`<div><strong><i class="ph ph-sparkle"></i> Generate a Full Theme with AI</strong><small>Copies a prompt that asks an AI for a ZIP you can import with Theme Pack Import.</small></div><button type="button" class="theme-builder-file-button theme-copy-full-prompt-v158"><i class="ph ph-copy"></i> Copy Theme Prompt</button>`;
        (field||controls.firstElementChild)?.insertAdjacentElement(field?'afterend':'beforebegin',row);
        row.querySelector('.theme-copy-full-prompt-v158')?.addEventListener('click',async()=>{
            const ok=await copyTextV158(fullThemePromptV158(modal));
            try{showFeatureToast(ok?'Theme generation prompt copied.':'Could not copy the theme prompt.')}catch{}
        });
    }
    try{
        const ensureModalBeforeV158=ensureThemeBuilderModal;
        ensureThemeBuilderModal=function(){const modal=ensureModalBeforeV158.apply(this,arguments);ensureFullThemePromptButtonV158(modal);return modal;};
    }catch{}

    // ---------------------------------------------------------------------
    // 8b) Favorite themes. Stored once in localStorage so favorites are shared
    // by Dashboard and every log page. Favorites simply sort to the front.
    // ---------------------------------------------------------------------
    const FAVORITE_KEY_V158='loggy-favorite-themes-v158';
    function favoritesV158(){try{const a=JSON.parse(localStorage.getItem(FAVORITE_KEY_V158)||'[]');return new Set(Array.isArray(a)?a.map(String):[])}catch{return new Set()}}
    function saveFavoritesV158(set){try{localStorage.setItem(FAVORITE_KEY_V158,JSON.stringify([...set]))}catch{}}
    function decorateThemeFavoritesV158(){
        const grid=document.getElementById('theme-picker'); if(!grid)return;
        const fav=favoritesV158();
        const cards=Array.from(grid.querySelectorAll('.theme-picker-card[data-theme]'));
        cards.forEach(card=>{
            const id=String(card.dataset.theme||''); if(!id)return;
            let star=card.querySelector(':scope > .theme-favorite-star-v158');
            if(!star){
                star=document.createElement('span'); star.className='theme-favorite-star-v158'; star.setAttribute('role','button'); star.tabIndex=0; star.title='Favorite theme';
                star.addEventListener('pointerdown',e=>{e.preventDefault();e.stopPropagation()});
                const toggle=e=>{e.preventDefault();e.stopPropagation();const set=favoritesV158();set.has(id)?set.delete(id):set.add(id);saveFavoritesV158(set);decorateThemeFavoritesV158()};
                star.addEventListener('click',toggle); star.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){toggle(e)}});
                card.appendChild(star);
            }
            const on=fav.has(id); star.classList.toggle('is-favorite-v158',on); star.innerHTML=`<i class="${on?'ph-fill':'ph'} ph-star"></i>`; star.setAttribute('aria-label',on?'Remove from favorites':'Add to favorites');
        });
        cards.sort((a,b)=>(fav.has(String(b.dataset.theme))-fav.has(String(a.dataset.theme)))).forEach(card=>grid.appendChild(card));
    }
    try{
        const renderPickerBeforeV158=renderThemePicker;
        renderThemePicker=function(){const r=renderPickerBeforeV158.apply(this,arguments);decorateThemeFavoritesV158();requestAnimationFrame(decorateThemeFavoritesV158);return r;};
    }catch{}
    requestAnimationFrame(decorateThemeFavoritesV158);

    // ---------------------------------------------------------------------
    // 9) Prevent custom tab nav duplicates. V52 moves buttons out of the old
    // factory hosts; old renderers then see empty factories and make another
    // copy. Remove the moved copy before a rebuild and dedupe once afterward.
    // ---------------------------------------------------------------------
    function dedupeCustomTabNavV158(){
        const all=Array.from(document.querySelectorAll('.custom-tab-nav-btn[data-custom-tab-id]'));
        const byId=new Map();
        all.forEach(button=>{
            const id=String(button.dataset.customTabId||''); if(!id)return;
            const current=byId.get(id);
            if(!current){byId.set(id,button);return;}
            const host=document.getElementById('log-tab-order-host-v52');
            const preferCurrent=current.parentElement===host;
            const preferButton=button.parentElement===host;
            if(preferButton&&!preferCurrent){current.remove();byId.set(id,button)} else button.remove();
        });
    }
    try{
        const renderTabsBeforeV158=renderCustomTabNavigation;
        renderCustomTabNavigation=function(){
            document.querySelectorAll('#log-tab-order-host-v52 > .custom-tab-nav-btn[data-custom-tab-id]').forEach(button=>button.remove());
            const result=renderTabsBeforeV158.apply(this,arguments);
            requestAnimationFrame(dedupeCustomTabNavV158);
            return result;
        };
    }catch{}
    try{
        const orderBeforeV158=applyUnifiedLogNavOrderV52;
        applyUnifiedLogNavOrderV52=function(){const r=orderBeforeV158.apply(this,arguments);dedupeCustomTabNavV158();return r;};
    }catch{}

    // ---------------------------------------------------------------------
    // 10) Checklist items can have a small optional image directly after the
    // checkbox. The Checklist title/header is untouched.
    // ---------------------------------------------------------------------
    function compressChecklistImageV158(file){
        return new Promise(resolve=>{
            if(!file||!String(file.type||'').startsWith('image/')){resolve('');return}
            if(file.size>8*1024*1024){try{showFeatureToast('Choose an image under 8 MB.')}catch{}resolve('');return}
            const reader=new FileReader();
            reader.onerror=()=>resolve('');
            reader.onload=()=>{
                const src=String(reader.result||''); const img=new Image();
                img.onerror=()=>resolve(src); img.onload=()=>{
                    try{
                        const max=360,scale=Math.min(1,max/Math.max(img.naturalWidth||1,img.naturalHeight||1));
                        const c=document.createElement('canvas');c.width=Math.max(1,Math.round(img.naturalWidth*scale));c.height=Math.max(1,Math.round(img.naturalHeight*scale));
                        c.getContext('2d').drawImage(img,0,0,c.width,c.height);
                        resolve(c.toDataURL('image/webp',.86));
                    }catch{resolve(src)}
                }; img.src=src;
            }; reader.readAsDataURL(file);
        });
    }
    function addChecklistImageControlsV158(tab,component,content){
        if(!content)return;
        const items=Array.isArray(component?.items)?component.items:[];
        content.querySelectorAll('.custom-check-row[data-custom-item-id]').forEach(row=>{
            const item=items.find(x=>String(x?.id)===String(row.dataset.customItemId)); if(!item)return;
            const checkbox=row.querySelector('input[type="checkbox"]'); if(!checkbox||row.querySelector('.custom-check-image-v158'))return;
            const control=document.createElement('span');control.className='custom-check-image-v158';control.setAttribute('role','button');control.tabIndex=0;
            const paint=()=>{control.innerHTML=item.imageV158?`<img src="${trailEscV158(item.imageV158)}" alt="">`:'<i class="ph ph-image-square"></i>';control.title=item.imageV158?'Replace checklist image':'Add checklist image'};
            paint(); checkbox.insertAdjacentElement('afterend',control);
            const choose=()=>{
                const input=document.createElement('input');input.type='file';input.accept='image/*';input.className='hidden';document.body.appendChild(input);
                input.addEventListener('cancel',()=>input.remove(),{once:true});input.addEventListener('change',async()=>{const file=input.files?.[0];input.remove();if(!file)return;const data=await compressChecklistImageV158(file);if(!data)return;item.imageV158=data;saveDb();renderCustomTabView(tab.id)},{once:true});
                input.click();
            };
            control.addEventListener('pointerdown',e=>{e.preventDefault();e.stopPropagation()});
            control.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();choose()});
            control.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();e.stopPropagation();choose()}});
            control.addEventListener('contextmenu',async e=>{e.preventDefault();e.stopPropagation();if(!item.imageV158)return;const ok=await showAppConfirm({title:'Remove Checklist Image',message:'Remove this image from the checklist item?',confirmLabel:'Remove'});if(ok){item.imageV158='';saveDb();renderCustomTabView(tab.id)}});
        });
    }
    try{
        const checklistBeforeV158=renderCustomChecklist;
        renderCustomChecklist=function(tab,component,content){const r=checklistBeforeV158.apply(this,arguments);addChecklistImageControlsV158(tab,component,content);return r;};
    }catch{}

    // Apply UI additions if the editor is already in the document.
    requestAnimationFrame(()=>{const modal=document.getElementById('theme-builder-modal');if(modal)ensureFullThemePromptButtonV158(modal)});
})();


// ============================================================================
// V159 — AI THEME JSON PROMPT / LIGHT-DARK MODE / DIRECT JSON IMPORT
//        REUSABLE THEME-NAMED CUSTOM ANIMATION MODES
// ============================================================================
(function(){
    if (window.__loggyThemeJsonV159) return;
    window.__loggyThemeJsonV159 = true;

    const REGISTRY_KEY = 'loggy-theme-custom-animations-v159';
    const MARKER = 'theme-custom-animation';
    const SAFE_TIMING = new Set(['linear','ease','ease-in','ease-out','ease-in-out']);
    const SAFE_DIRECTION = new Set(['normal','alternate','reverse','alternate-reverse']);

    function cloneV159(value){
        try { return JSON.parse(JSON.stringify(value)); } catch { return value; }
    }
    function safeSlugV159(value){
        return String(value || 'theme').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'').slice(0,52) || 'theme';
    }
    function clampV159(n,min,max,fallback){
        n=Number(n); return Number.isFinite(n) ? Math.max(min,Math.min(max,n)) : fallback;
    }
    function cleanTreeV159(value, depth=0){
        if (depth > 16) return null;
        if (Array.isArray(value)) return value.slice(0,500).map(v=>cleanTreeV159(v,depth+1));
        if (value && typeof value === 'object') {
            const out={};
            for (const [k,v] of Object.entries(value)) {
                if (k === '__proto__' || k === 'prototype' || k === 'constructor') continue;
                out[k]=cleanTreeV159(v,depth+1);
            }
            return out;
        }
        if (typeof value === 'string') return value.slice(0,250000);
        if (typeof value === 'number' || typeof value === 'boolean' || value == null) return value;
        return null;
    }
    function sanitizeSpecV159(raw){
        if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return null;
        const frames = Array.isArray(raw.keyframes) ? raw.keyframes.slice(0,12) : [];
        if (frames.length < 2) return null;
        const keyframes = frames.map((frame,index)=>({
            offset: clampV159(frame?.offset,0,1,index/Math.max(1,frames.length-1)),
            x: clampV159(frame?.x,-160,160,0),
            y: clampV159(frame?.y,-160,160,0),
            rotate: clampV159(frame?.rotate,-180,180,0),
            scale: clampV159(frame?.scale,.45,1.8,1),
            opacity: clampV159(frame?.opacity,.15,1,1)
        })).sort((a,b)=>a.offset-b.offset);
        keyframes[0].offset=0; keyframes[keyframes.length-1].offset=1;
        return {
            duration: clampV159(raw.duration,1.2,40,6.8),
            timing: SAFE_TIMING.has(String(raw.timing||'')) ? String(raw.timing) : 'ease-in-out',
            direction: SAFE_DIRECTION.has(String(raw.direction||'')) ? String(raw.direction) : 'alternate',
            keyframes
        };
    }
    function readRegistryV159(){
        try {
            const parsed=JSON.parse(localStorage.getItem(REGISTRY_KEY)||'[]');
            return Array.isArray(parsed) ? parsed.filter(x=>x&&typeof x==='object') : [];
        } catch { return []; }
    }
    function writeRegistryV159(list){
        try { localStorage.setItem(REGISTRY_KEY,JSON.stringify((Array.isArray(list)?list:[]).slice(-120))); } catch {}
    }
    function animationNameV159(id){ return `loggy-custom-motion-v159-${safeSlugV159(id)}`; }
    function cssFramesV159(spec){
        return spec.keyframes.map(f=>`${Math.round(f.offset*10000)/100}%{transform:translate3d(${f.x}px,${f.y}px,0) rotate(${f.rotate}deg) scale(${f.scale});opacity:${f.opacity}}`).join('');
    }
    function renderRegistryStyleV159(){
        const list=readRegistryV159();
        let style=document.getElementById('theme-custom-animation-style-v159');
        if(!style){style=document.createElement('style');style.id='theme-custom-animation-style-v159';document.head.appendChild(style)}
        const chunks=[];
        list.forEach(entry=>{
            const spec=sanitizeSpecV159(entry.spec); const id=String(entry.id||'');
            if(!spec || !/^theme-motion-v159-[a-z0-9-]+$/.test(id)) return;
            const kf=animationNameV159(id);
            chunks.push(`@keyframes ${kf}{${cssFramesV159(spec)}}`);
            chunks.push(`.theme-svg-anim-${id} .theme-svg-motion-shell{animation:${kf} ${spec.duration}s ${spec.timing} infinite ${spec.direction} !important;}`);
            chunks.push(`@media (prefers-reduced-motion:reduce){.theme-svg-anim-${id} .theme-svg-motion-shell{animation-duration:${Math.max(10,spec.duration*1.8)}s !important;animation-iteration-count:1 !important;}}`);
        });
        style.textContent=chunks.join('\n');
    }
    function syncRegistryOptionsV159(){
        let list=readRegistryV159();
        try {
            if(Array.isArray(THEME_SVG_ANIMATION_OPTIONS_V11)){
                list.forEach(entry=>{
                    const id=String(entry.id||''), label=String(entry.label||'Custom Theme').slice(0,80);
                    if(!/^theme-motion-v159-[a-z0-9-]+$/.test(id)) return;
                    const existing=THEME_SVG_ANIMATION_OPTIONS_V11.find(x=>x?.[0]===id);
                    if(existing) existing[1]=label;
                    else THEME_SVG_ANIMATION_OPTIONS_V11.push([id,label]);
                });
            }
        } catch {}
        refreshAnimationSelectsV159();
    }
    function refreshAnimationSelectsV159(){
        const modal=document.getElementById('theme-builder-modal'); if(!modal)return;
        let options=[]; try{options=Array.isArray(THEME_SVG_ANIMATION_OPTIONS_V11)?THEME_SVG_ANIMATION_OPTIONS_V11:[]}catch{}
        modal.querySelectorAll('.theme-builder-svg-default-animation,.theme-builder-svg-animation-select').forEach(select=>{
            const current=select.value;
            options.forEach(([id,label])=>{
                if(!Array.from(select.options).some(o=>o.value===id)){
                    const o=document.createElement('option');o.value=id;o.textContent=label;select.appendChild(o);
                }
            });
            if(Array.from(select.options).some(o=>o.value===current))select.value=current;
        });
    }
    function saveRegistryEntryV159(entry){
        const id=String(entry?.id||''), spec=sanitizeSpecV159(entry?.spec);
        if(!spec || !/^theme-motion-v159-[a-z0-9-]+$/.test(id)) return false;
        const label=String(entry?.label||'Custom Theme').trim().slice(0,80)||'Custom Theme';
        const list=readRegistryV159();
        const index=list.findIndex(x=>String(x?.id||'')===id);
        if(index>=0){
            const old=list[index];
            try{if(String(old?.label||'')===label && JSON.stringify(sanitizeSpecV159(old?.spec))===JSON.stringify(spec))return false}catch{}
            list[index]={id,label,spec,updatedAt:new Date().toISOString()};
        }else list.push({id,label,spec,updatedAt:new Date().toISOString()});
        writeRegistryV159(list);return true;
    }
    function registerAnimationFromThemeV159(theme,name){
        if(!theme || typeof theme!=='object') return theme;
        let changed=false;
        if(Array.isArray(theme.customAnimationDependenciesV159)){
            theme.customAnimationDependenciesV159.slice(0,40).forEach(entry=>{if(saveRegistryEntryV159(entry))changed=true});
        }
        const spec=sanitizeSpecV159(theme.customAnimationV159);
        if(spec){
            const storedLabel=String(theme.customAnimationLabelV159||'').trim();
            const label=String(storedLabel||name||theme.name||'Custom Theme').trim().slice(0,80)||'Custom Theme';
            const existingId=String(theme.customAnimationModeIdV159||'');
            const id=/^theme-motion-v159-[a-z0-9-]+$/.test(existingId) ? existingId : `theme-motion-v159-${safeSlugV159(label)}`;
            if(saveRegistryEntryV159({id,label,spec}))changed=true;
            theme.customAnimationV159=spec;
            theme.customAnimationModeIdV159=id;
            theme.customAnimationLabelV159=label;
            if(String(theme.svgDefaultAnimation||'')===MARKER) theme.svgDefaultAnimation=id;
            if(Array.isArray(theme.backgroundSvgs)){
                theme.backgroundSvgs=theme.backgroundSvgs.map(asset=>{
                    if(!asset||typeof asset!=='object')return asset;
                    const a={...asset};
                    if(String(a.animation||'')===MARKER)a.animation=id;
                    if(String(a.animationOverride||'')===MARKER)a.animationOverride=id;
                    return a;
                });
            }
        }
        if(changed){renderRegistryStyleV159();syncRegistryOptionsV159()}
        return theme;
    }
    function animationValueV159(id){
        const entry=readRegistryV159().find(x=>String(x?.id||'')===String(id||''));
        const spec=sanitizeSpecV159(entry?.spec); if(!spec)return '';
        return `${animationNameV159(entry.id)} ${spec.duration}s ${spec.timing} infinite ${spec.direction}`;
    }

    // Load permanent modes immediately. Also recover modes from saved themes if
    // localStorage's registry was ever cleared independently.
    function recoverSavedModesV159(){
        try{(readSharedThemeLibraryV40?.()||[]).forEach(entry=>{if(entry?.theme?.customAnimationV159||Array.isArray(entry?.theme?.customAnimationDependenciesV159))registerAnimationFromThemeV159(entry.theme,entry.name||entry.theme.name)})}catch{}
    }
    renderRegistryStyleV159(); syncRegistryOptionsV159(); recoverSavedModesV159();
    window.__loggyCustomAnimationV159={register:registerAnimationFromThemeV159,list:readRegistryV159,refresh:()=>{renderRegistryStyleV159();syncRegistryOptionsV159()}};

    try{
        const beforePublishV159=publishSharedThemeV40;
        publishSharedThemeV40=function(args={}){
            if(args?.theme?.customAnimationV159 || Array.isArray(args?.theme?.customAnimationDependenciesV159)){
                const theme=registerAnimationFromThemeV159(cloneV159(args.theme),args.name||args.theme.name);
                return beforePublishV159.call(this,{...args,theme});
            }
            return beforePublishV159.apply(this,arguments);
        };
    }catch{}

    // Carry every custom mode used by a theme inside that theme too. This makes
    // Theme Pack backups portable even when Theme B uses Theme A's animation.
    try{
        const beforeDraftV159=getThemeBuilderDraft;
        getThemeBuilderDraft=function(modal){
            const draft=beforeDraftV159.apply(this,arguments);
            const ids=new Set();
            const collect=v=>{v=String(v||'');if(/^theme-motion-v159-[a-z0-9-]+$/.test(v))ids.add(v)};
            collect(draft?.svgDefaultAnimation);
            (Array.isArray(draft?.backgroundSvgs)?draft.backgroundSvgs:[]).forEach(a=>{collect(a?.animation);collect(a?.animationOverride)});
            const registry=readRegistryV159();
            const deps=registry.filter(entry=>ids.has(String(entry?.id||''))).map(entry=>({id:entry.id,label:entry.label,spec:sanitizeSpecV159(entry.spec)})).filter(x=>x.spec);
            if(deps.length)draft.customAnimationDependenciesV159=deps;
            else delete draft.customAnimationDependenciesV159;
            return draft;
        };
    }catch{}

    // Builder Dashboard preview understands every registered custom motion.
    try{
        const beforeV159=themeBuilderDashboardAnimationV78;
        themeBuilderDashboardAnimationV78=function(animation){
            const value=animationValueV159(animation); return value||beforeV159.apply(this,arguments);
        };
    }catch{}
    try{
        const beforeV159=dashboardPreviewMotionValueV69;
        dashboardPreviewMotionValueV69=function(animation){
            const value=animationValueV159(animation); return value||beforeV159.apply(this,arguments);
        };
    }catch{}

    function collectColorFieldsV159(modal){
        const map=new Map();
        modal?.querySelectorAll?.('input[type="color"][data-theme-key]').forEach(input=>{
            const key=String(input.dataset.themeKey||'').trim();if(!key||map.has(key))return;
            const label=input.closest('.theme-builder-field')?.querySelector(':scope > span')?.textContent?.trim()||key;
            const value=/^#[0-9a-f]{6}$/i.test(input.value)?input.value:'#777777';
            map.set(key,{key,label,value});
        });
        return [...map.values()];
    }
    function fontOptionsV159(modal){
        const select=modal?.querySelector?.('[data-theme-key="font"]');
        return Array.from(select?.options||[]).map(o=>({value:o.value,label:o.textContent.trim()})).filter(x=>x.value);
    }
    function animationOptionsV159(){
        try{return (THEME_SVG_ANIMATION_OPTIONS_V11||[]).map(([id,label])=>({id,label}))}catch{return[]}
    }
    function jsonThemePromptV159(modal,appearance){
        let draft={};try{draft=getThemeBuilderDraft(modal)||{}}catch{}
        const colors=collectColorFieldsV159(modal);
        const colorObject={}; colors.forEach(x=>colorObject[x.key]=x.value);
        const colorList=colors.map(x=>`- ${x.key} (${x.label})`).join('\n');
        const fonts=fontOptionsV159(modal).map(x=>`${x.value} = ${x.label}`).join(', ');
        const animations=animationOptionsV159().map(x=>`- ${x.id}: ${x.label}`).join('\n');
        const currentName=String(draft.name||'Custom Theme').trim()||'Custom Theme';
        const mode=appearance==='dark'?'DARK':'LIGHT';
        return `You are creating ONE directly importable Loggy theme JSON. I will attach exactly FOUR reference images with this prompt. Analyze those four images together for palette, mood, softness, visual era, contrast, and overall atmosphere. Treat the images as VISUAL REFERENCES ONLY: do not embed the images, do not invent image file paths, and do not put base64 image data in the JSON. I will add my SVG decorations separately after import.\n\nTHEME APPEARANCE I CHOSE: ${mode}.\nThis choice is mandatory. ${mode==='DARK'?'Build a genuinely dark background/surface system with light readable text and softer luminous accents.':'Build a genuinely light background/surface system with dark readable text and soft coordinated accents.'}\n\nOUTPUT RULES — VERY IMPORTANT:\n1. If your interface can create files, return one downloadable .json file containing the object. If it cannot create a file, output ONLY one valid raw JSON object. No markdown fence, no explanation, no comments, no trailing commas.\n2. The JSON must use the exact outer format shown below so Loggy can import it directly.\n3. Every color field listed below is REQUIRED and must be a six-digit #RRGGBB hex value. Do not leave any color field out.\n4. Make the palette cohesive and derived from the four reference images, but prioritize readability and contrast over exact color copying.\n5. Avoid neon combinations, muddy gray-on-gray text, harsh gradients, and strong white spotlight blobs.\n6. Prefer a smooth aesthetic layered gradient with broad gentle transitions similar in quality to a polished editorial wallpaper.\n7. Do not use external URLs. backgroundImage, introAudio, svgHoverSounds, and backgroundSvgs should stay empty in this JSON.\n\nEXACT COLOR SETTINGS THAT MUST ALL BE FILLED:\n${colorList}\n\nUse these CURRENT values only as a schema/example, NOT as colors you must preserve:\n${JSON.stringify(colorObject,null,2)}\n\nOTHER SETTINGS:\n- name: use a short attractive theme name inspired by the four images. If the current working name "${currentName}" is already meaningful, you may keep it.\n- font: choose one valid Loggy font option. Available options: ${fonts||'default'}.\n- radius: number from 0 to 30.\n- shadow: number from 0 to 12. Keep it subtle.\n- backgroundModeV158: use "gradient" or "solid". Prefer "gradient" when the reference images support it.\n- backgroundGradientV56: when gradient mode is used, provide a valid CSS background-image value made from 1 linear-gradient plus at most 2 very soft radial-gradient layers. Keep radial alpha low and broad; NO bright white spotlight circles.\n- backgroundGradientNameV56: a short descriptive name for that generated background.\n- backgroundImage: "".\n- interactiveBackgroundCodeV56: "" unless a truly necessary abstract ambient background cannot be represented by the gradient. For this JSON prompt, gradient is preferred.\n- backgroundSvgs: []. The four reference images are NOT decoration files.\n- svgHoverSounds: [].\n- introAudio: "".\n- svgGlobalScale: normally 100.\n- svgScenePreset: normally "scatter".\n- svgDistribution: normally "side-random" or "random".\n\nDECORATION ANIMATION:\nChoose ONE of the existing animation IDs below if one already matches the theme well:\n${animations}\n\nIf an existing mode fits, set "svgDefaultAnimation" to that exact ID and OMIT "customAnimationV159".\n\nONLY if none of those existing modes really fit the four reference images, invent ONE gentle custom decoration motion. Then set "svgDefaultAnimation" to exactly "${MARKER}" and include "customAnimationV159" using this SAFE numeric schema:\n{\n  "duration": 6.8,\n  "timing": "ease-in-out",\n  "direction": "alternate",\n  "keyframes": [\n    {"offset":0,"x":0,"y":4,"rotate":-2,"scale":1,"opacity":1},\n    {"offset":0.5,"x":8,"y":-8,"rotate":2,"scale":1.02,"opacity":1},\n    {"offset":1,"x":0,"y":4,"rotate":-2,"scale":1,"opacity":1}\n  ]\n}\nCustom-animation rules: 2–12 keyframes; offsets from 0 to 1 in order; first offset 0 and last 1; x/y are pixels; use gentle values usually within ±32px; rotate usually within ±8deg; scale usually 0.94–1.08; opacity normally 1; duration usually 4–12 seconds. Do NOT put CSS, JavaScript, keyframe text, URLs, filters, shadows, or arbitrary code in customAnimationV159. Loggy will safely turn these numeric keyframes into an animation mode. On import, Loggy automatically names that reusable animation mode after the theme, saves it permanently, and makes it available in the Animation Mode dropdown for other themes.\n\nREQUIRED JSON SHAPE:\n{\n  "format": "loggy-theme-json",\n  "version": 1,\n  "name": "Theme Name",\n  "theme": {\n    "name": "Theme Name",\n    ...EVERY REQUIRED COLOR KEY LISTED ABOVE AS FLAT FIELDS...,\n    "font": "valid-font-value",\n    "radius": 12,\n    "shadow": 2,\n    "backgroundModeV158": "gradient",\n    "backgroundGradientNameV56": "Background Name",\n    "backgroundGradientV56": "linear-gradient(...)",\n    "backgroundImage": "",\n    "interactiveBackgroundCodeV56": "",\n    "svgDefaultAnimation": "one-existing-id-or-${MARKER}",\n    "svgScenePreset": "scatter",\n    "svgDistribution": "side-random",\n    "svgGlobalScale": 100,\n    "backgroundSvgs": [],\n    "svgHoverSounds": [],\n    "introAudio": ""\n  }\n}\n\nBefore answering, verify internally that every required color key is present, all JSON is valid, the chosen ${mode} appearance has strong text/icon contrast, and the gradient is smooth rather than harsh. Then CREATE the downloadable .json file and return only the downloadable file/link. Do NOT paste the JSON text into the chat.`;
    }
    async function copyTextV159(text){
        try{await navigator.clipboard.writeText(text);return true}catch{}
        try{const ta=document.createElement('textarea');ta.value=text;ta.style.cssText='position:fixed;left:-9999px;top:0;opacity:0';document.body.appendChild(ta);ta.select();const ok=document.execCommand('copy');ta.remove();return ok}catch{return false}
    }
    function ensureJsonPromptV159(modal){
        if(!modal)return;
        modal.querySelectorAll('.theme-full-prompt-row-v158').forEach(n=>n.remove());
        if(modal.querySelector('.theme-json-prompt-row-v159'))return;
        const field=modal.querySelector('[data-theme-key="name"]')?.closest('.theme-builder-field');
        const controls=modal.querySelector('.theme-builder-controls'); if(!controls)return;
        const row=document.createElement('div');row.className='theme-json-prompt-row-v159';
        row.innerHTML=`<div class="theme-json-prompt-copy-v159"><strong><i class="ph ph-brackets-curly"></i> Create Theme JSON with AI</strong><small>Attach your 4 reference images to the AI with this prompt. The returned JSON imports directly into Loggy and can create a reusable theme-named animation.</small></div><div class="theme-json-prompt-actions-v159"><select class="theme-json-prompt-mode-v159" aria-label="Theme appearance"><option value="light">Light Theme</option><option value="dark">Dark Theme</option></select><button type="button" class="theme-builder-file-button theme-copy-json-prompt-v159"><i class="ph ph-copy"></i> Copy JSON Prompt</button></div>`;
        (field||controls.firstElementChild)?.insertAdjacentElement(field?'afterend':'beforebegin',row);
        row.querySelector('.theme-copy-json-prompt-v159')?.addEventListener('click',async()=>{
            const btn=row.querySelector('.theme-copy-json-prompt-v159');const old=btn.innerHTML;
            const mode=row.querySelector('.theme-json-prompt-mode-v159')?.value||'light';
            const ok=await copyTextV159(jsonThemePromptV159(modal,mode));
            btn.innerHTML=ok?'<i class="ph ph-check"></i> Copied':'<i class="ph ph-warning"></i> Copy failed';
            if(ok)try{showFeatureToast(`Copied ${mode} Theme JSON prompt. Attach your 4 images when you send it to the AI.`)}catch{}
            setTimeout(()=>{if(btn?.isConnected)btn.innerHTML=old},1400);
        });
    }

    function normalizeImportedJsonV159(payload){
        payload=cleanTreeV159(payload);
        if(!payload||typeof payload!=='object'||Array.isArray(payload))throw new Error('That file does not contain a theme JSON object.');
        const raw=payload.theme&&typeof payload.theme==='object'&&!Array.isArray(payload.theme)?payload.theme:payload;
        const theme=cloneV159(raw)||{};
        const name=String(payload.name||theme.name||'Imported Theme').trim().slice(0,80)||'Imported Theme';
        theme.name=name;
        if(!Array.isArray(theme.backgroundSvgs))theme.backgroundSvgs=[];
        if(!Array.isArray(theme.svgHoverSounds))theme.svgHoverSounds=[];
        if(typeof theme.backgroundImage==='string' && /^https?:/i.test(theme.backgroundImage))theme.backgroundImage='';
        theme.backgroundSvgs=theme.backgroundSvgs.filter(asset=>{
            const u=String(asset?.url||asset?.src||'');return !/^https?:/i.test(u);
        });
        return registerAnimationFromThemeV159(theme,name);
    }
    async function importJsonThemeV159(file,button){
        if(!file)return;
        const old=button?.innerHTML||'';if(button){button.disabled=true;button.innerHTML='<i class="ph ph-spinner-gap"></i> Importing…'}
        try{
            if(file.size>3*1024*1024)throw new Error('Theme JSON is too large.');
            const parsed=JSON.parse(await file.text());
            const theme=normalizeImportedJsonV159(parsed);
            const name=String(theme.name||parsed.name||'Imported Theme');
            const id=`theme-custom-builder-json-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,7)}`;
            publishSharedThemeV40({id,name,theme,sourceThemeId:''});
            try{syncSharedThemesIntoLogV40()}catch{}
            try{syncThemeCopyOptionsV30()}catch{}
            try{db.settings.theme=id;await saveDb()}catch{}
            try{await applyTheme(id,{persist:false})}catch{}
            try{if(dailyThemeSelect)dailyThemeSelect.value=id}catch{}
            try{themePickerSelected=id}catch{}
            try{renderThemePicker()}catch{}
            try{showFeatureToast(`Imported “${name}” from Theme JSON.`)}catch{}
        }catch(error){try{showFeatureToast(error.message||'Could not import Theme JSON.')}catch{alert(error.message||'Could not import Theme JSON.')}}
        finally{if(button){button.disabled=false;button.innerHTML=old}}
    }
    function ensureJsonImportV159(){
        const tools=document.getElementById('theme-pack-tools-v154');if(!tools||tools.querySelector('.theme-json-import-v159'))return;
        const actions=tools.querySelector('.theme-pack-tools-actions-v154');if(!actions)return;
        const btn=document.createElement('button');btn.type='button';btn.className='theme-json-import-v159';btn.innerHTML='<i class="ph ph-brackets-curly"></i> Import Theme JSON';
        const input=document.createElement('input');input.type='file';input.className='theme-json-file-v159 hidden';input.accept='.json,application/json';
        actions.append(btn,input);btn.addEventListener('click',()=>input.click());input.addEventListener('change',async()=>{const file=input.files?.[0];input.value='';if(file)await importJsonThemeV159(file,btn)});
    }

    try{const beforePopulateV159=populateThemeBuilder;populateThemeBuilder=function(modal,theme={}){recoverSavedModesV159();const r=beforePopulateV159.apply(this,arguments);ensureJsonPromptV159(modal);refreshAnimationSelectsV159();return r}}catch{}
    try{const beforeEnsureV159=ensureThemeBuilderModal;ensureThemeBuilderModal=function(){recoverSavedModesV159();const modal=beforeEnsureV159.apply(this,arguments);ensureJsonPromptV159(modal);refreshAnimationSelectsV159();return modal}}catch{}
    try{const beforeRenderPickerV159=renderThemePicker;renderThemePicker=function(){recoverSavedModesV159();const r=beforeRenderPickerV159.apply(this,arguments);ensureJsonImportV159();return r}}catch{}

    requestAnimationFrame(()=>{recoverSavedModesV159();ensureJsonPromptV159(document.getElementById('theme-builder-modal'));ensureJsonImportV159();refreshAnimationSelectsV159()});
    window.__loggyThemeCustomAnimationsV159={read:readRegistryV159,register:registerAnimationFromThemeV159,refresh:()=>{renderRegistryStyleV159();syncRegistryOptionsV159()}};
})();

// ============================================================================
// V160 — CUSTOM TAB CHECKLIST ITEM EDIT MODAL / LINK ICON / IMAGE LIGHTBOX
// ============================================================================
(function(){
    if (window.__loggyChecklistEditorV160) return;
    window.__loggyChecklistEditorV160 = true;

    function escV160(value){
        if (typeof escapeCustomHtml === 'function') return escapeCustomHtml(String(value ?? ''));
        return String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
    }
    function safeUrlV160(value){
        let url=String(value||'').trim();
        if(!url) return '';
        if(!/^[a-z][a-z0-9+.-]*:/i.test(url)) url='https://'+url;
        try{
            const u=new URL(url, location.href);
            if(!['http:','https:'].includes(u.protocol)) return '';
            return u.href;
        }catch{return ''}
    }
    function compressImageV160(file){
        return new Promise(resolve=>{
            if(!file || !String(file.type||'').startsWith('image/')) return resolve('');
            if(file.size > 8*1024*1024){
                try{showFeatureToast('Choose an image under 8 MB.')}catch{}
                return resolve('');
            }
            const reader=new FileReader();
            reader.onerror=()=>resolve('');
            reader.onload=()=>{
                const src=String(reader.result||'');
                const img=new Image();
                img.onerror=()=>resolve(src);
                img.onload=()=>{
                    try{
                        const max=720;
                        const scale=Math.min(1,max/Math.max(img.naturalWidth||1,img.naturalHeight||1));
                        const canvas=document.createElement('canvas');
                        canvas.width=Math.max(1,Math.round((img.naturalWidth||1)*scale));
                        canvas.height=Math.max(1,Math.round((img.naturalHeight||1)*scale));
                        const ctx=canvas.getContext('2d');
                        ctx.drawImage(img,0,0,canvas.width,canvas.height);
                        resolve(canvas.toDataURL('image/webp',.88));
                    }catch{resolve(src)}
                };
                img.src=src;
            };
            reader.readAsDataURL(file);
        });
    }

    function ensureEditorModalV160(){
        let modal=document.getElementById('custom-check-edit-modal-v160');
        if(modal) return modal;
        modal=document.createElement('div');
        modal.id='custom-check-edit-modal-v160';
        modal.className='modal hidden custom-check-edit-modal-v160';
        modal.innerHTML=`
            <div class="modal-box custom-check-edit-box-v160" role="dialog" aria-modal="true" aria-labelledby="custom-check-edit-title-v160">
                <div class="modal-header">
                    <div>
                        <h2 id="custom-check-edit-title-v160">Edit Checklist Item</h2>
                        <p>Edit the text, optional image, and optional link for this checkbox.</p>
                    </div>
                    <button type="button" class="small-icon-btn custom-check-edit-close-v160" aria-label="Close"><i class="ph ph-x"></i></button>
                </div>
                <div class="modal-section custom-check-edit-fields-v160">
                    <label class="custom-check-edit-field-v160">
                        <span>Checklist item</span>
                        <input type="text" class="custom-check-edit-text-v160" maxlength="500" autocomplete="off">
                    </label>
                    <label class="custom-check-edit-field-v160">
                        <span>Link <small>optional</small></span>
                        <div class="custom-check-edit-link-wrap-v160">
                            <i class="ph ph-link"></i>
                            <input type="url" class="custom-check-edit-link-v160" placeholder="https://example.com" autocomplete="url">
                        </div>
                    </label>
                    <div class="custom-check-edit-field-v160">
                        <span>Image <small>optional</small></span>
                        <div class="custom-check-edit-image-editor-v160">
                            <button type="button" class="custom-check-edit-image-preview-v160" title="Preview image"></button>
                            <div class="custom-check-edit-image-actions-v160">
                                <button type="button" class="icon-btn custom-check-edit-upload-v160"><i class="ph ph-upload-simple"></i> Choose Image</button>
                                <button type="button" class="icon-btn custom-check-edit-remove-image-v160"><i class="ph ph-trash"></i> Remove Image</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="custom-check-edit-footer-v160">
                    <button type="button" class="icon-btn custom-check-edit-cancel-v160">Cancel</button>
                    <button type="button" class="icon-btn custom-tab-primary-btn custom-check-edit-save-v160"><i class="ph ph-check"></i> Save</button>
                </div>
            </div>`;
        document.body.appendChild(modal);
        const close=()=>modal.classList.add('hidden');
        modal.querySelector('.custom-check-edit-close-v160')?.addEventListener('click',close);
        modal.querySelector('.custom-check-edit-cancel-v160')?.addEventListener('click',close);
        modal.addEventListener('mousedown',e=>{if(e.target===modal)close()});
        return modal;
    }

    function ensureLightboxV160(){
        let box=document.getElementById('custom-check-image-lightbox-v160');
        if(box) return box;
        box=document.createElement('div');
        box.id='custom-check-image-lightbox-v160';
        box.className='custom-check-image-lightbox-v160 hidden';
        box.innerHTML=`<button type="button" class="custom-check-image-lightbox-close-v160" aria-label="Close image"><i class="ph ph-x"></i></button><img alt="Checklist image">`;
        document.body.appendChild(box);
        const close=()=>box.classList.add('hidden');
        box.addEventListener('click',e=>{if(e.target===box)close()});
        box.querySelector('.custom-check-image-lightbox-close-v160')?.addEventListener('click',close);
        document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!box.classList.contains('hidden')) close()});
        return box;
    }
    function openImageV160(src){
        if(!src) return;
        const box=ensureLightboxV160();
        box.querySelector('img').src=src;
        box.classList.remove('hidden');
    }

    function openEditorV160(tab,component,item){
        const modal=ensureEditorModalV160();
        const text=modal.querySelector('.custom-check-edit-text-v160');
        const link=modal.querySelector('.custom-check-edit-link-v160');
        const preview=modal.querySelector('.custom-check-edit-image-preview-v160');
        const remove=modal.querySelector('.custom-check-edit-remove-image-v160');
        const upload=modal.querySelector('.custom-check-edit-upload-v160');
        const save=modal.querySelector('.custom-check-edit-save-v160');
        let pendingImage=String(item.imageV158||item.imageV160||'');

        text.value=String(item.text||'');
        link.value=String(item.linkV160||'');
        const repaint=()=>{
            preview.innerHTML=pendingImage?`<img src="${escV160(pendingImage)}" alt="Checklist image preview">`:'<span><i class="ph ph-image-square"></i>No image</span>';
            preview.classList.toggle('has-image-v160',!!pendingImage);
            remove.disabled=!pendingImage;
        };
        repaint();
        const choose=()=>{
            const input=document.createElement('input');
            input.type='file';input.accept='image/*';input.className='hidden';document.body.appendChild(input);
            input.addEventListener('change',async()=>{
                const file=input.files?.[0];input.remove();if(!file)return;
                const data=await compressImageV160(file);if(!data)return;
                pendingImage=data;repaint();
            },{once:true});
            input.addEventListener('cancel',()=>input.remove(),{once:true});
            input.click();
        };
        upload.onclick=choose;
        preview.onclick=()=>{if(pendingImage) openImageV160(pendingImage)};
        remove.onclick=()=>{pendingImage='';repaint()};
        save.onclick=()=>{
            const newText=String(text.value||'').trim();
            if(!newText){text.focus();return}
            const rawLink=String(link.value||'').trim();
            const normalized=rawLink?safeUrlV160(rawLink):'';
            if(rawLink&&!normalized){
                try{showFeatureToast('Enter a valid http:// or https:// link.')}catch{}
                link.focus();return;
            }
            item.text=newText;
            item.linkV160=normalized;
            item.imageV158=pendingImage;
            delete item.imageV160;
            saveDb();
            modal.classList.add('hidden');
            renderCustomTabView(tab.id);
        };
        modal.classList.remove('hidden');
        requestAnimationFrame(()=>text.focus());
    }

    function enhanceChecklistV160(tab,component,content){
        if(!content) return;
        const items=Array.isArray(component?.items)?component.items:[];
        content.querySelectorAll('.custom-check-row[data-custom-item-id]').forEach(row=>{
            const item=items.find(entry=>String(entry?.id)===String(row.dataset.customItemId));
            if(!item)return;

            // Remove the old V158 upload-on-click control and rebuild it as a
            // view-only thumbnail. Image editing now lives only in Edit.
            const old=row.querySelector('.custom-check-image-v158');
            if(old) old.remove();
            const checkbox=row.querySelector('input[type="checkbox"]');
            const src=String(item.imageV158||item.imageV160||'');
            if(src&&checkbox){
                const image=document.createElement('button');
                image.type='button';
                image.className='custom-check-image-v160';
                image.title='Open image';
                image.innerHTML=`<img src="${escV160(src)}" alt="">`;
                image.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();openImageV160(src)});
                image.addEventListener('contextmenu',e=>{e.preventDefault();e.stopPropagation();openEditorV160(tab,component,item)});
                checkbox.insertAdjacentElement('afterend',image);
            }

            const existingLink=row.querySelector('.custom-check-link-v160');
            if(existingLink) existingLink.remove();
            const href=safeUrlV160(item.linkV160||'');
            if(href){
                const link=document.createElement('a');
                link.className='custom-check-link-v160';
                link.href=href;
                link.target='_blank';
                link.rel='noopener noreferrer';
                link.title='Open link';
                link.setAttribute('aria-label','Open checklist link');
                link.innerHTML='<i class="ph ph-link"></i>';
                link.addEventListener('click',e=>e.stopPropagation());
                link.addEventListener('mousedown',e=>e.stopPropagation());
                row.appendChild(link);
            }

            row.title='Right-click to edit checklist item';
            row.addEventListener('contextmenu',event=>{
                event.preventDefault();
                event.stopImmediatePropagation();
                showCustomItemContextMenu(event.clientX,event.clientY,[
                    {
                        label:'Edit',
                        icon:'ph-pencil-simple',
                        action:()=>openEditorV160(tab,component,item)
                    },
                    {
                        label:'Open link',
                        icon:'ph-link',
                        action:()=>{const u=safeUrlV160(item.linkV160||'');if(u)window.open(u,'_blank','noopener')},
                        disabled:!href
                    },
                    {
                        label:'Delete item',
                        icon:'ph-trash',
                        danger:true,
                        action:async()=>{
                            if(!(await showAppConfirm({title:'Delete Checklist Item',message:'Delete this checklist item?',confirmLabel:'Delete'})))return;
                            component.items=component.items.filter(entry=>entry.id!==item.id);
                            saveDb();renderCustomTabView(tab.id);
                        }
                    }
                ].filter(entry=>!entry.disabled));
            },true);
        });
    }

    try{
        const before=renderCustomChecklist;
        renderCustomChecklist=function(tab,component,content){
            const result=before.apply(this,arguments);
            enhanceChecklistV160(tab,component,content);
            return result;
        };
    }catch{}
})();

// ============================================================================
// V161 — AI THEME JSON WORKFLOW / LIVE CURSOR PREVIEW / RELIABLE THEME SETTLE
//        AUDIO AUDITION / FONT LIBRARY / THEMED CONTROLS / CUSTOM AI CURSORS
//        SEARCH-LINE CREATE BUTTON / EDIT-AUDIO FADE / SHORTCUT LABEL FIX
// ============================================================================
(function(){
    if (window.__loggyThemeBuilderV161) return;
    window.__loggyThemeBuilderV161 = true;

    const AI_CURSOR_KEY_V161 = 'loggy-ai-theme-cursors-v161';
    const HIDDEN_CURSOR_KEY_V382 = 'loggy-hidden-cursors-v163';
    const AI_CURSOR_ID_PREFIX_V161 = 'theme-cursor-v161-';
    const FONT_OPTIONS_V161 = [
        ['rounded','Soft Rounded',"'Trebuchet MS', 'Arial Rounded MT Bold', ui-sans-serif, system-ui, sans-serif"],
        ['modern','Modern Sans',"Avenir, 'Avenir Next', 'Segoe UI', ui-sans-serif, system-ui, sans-serif"],
        ['humanist','Humanist',"Candara, Calibri, 'Segoe UI', ui-sans-serif, sans-serif"],
        ['geometric','Geometric',"Futura, 'Century Gothic', Avenir, ui-sans-serif, sans-serif"],
        ['friendly','Friendly',"'Segoe UI', Tahoma, Verdana, ui-sans-serif, sans-serif"],
        ['soft','Soft Casual',"'Trebuchet MS', Verdana, ui-sans-serif, sans-serif"],
        ['editorial','Editorial Serif',"Baskerville, 'Iowan Old Style', 'Palatino Linotype', Georgia, serif"],
        ['book','Book Serif',"'Palatino Linotype', Palatino, 'Book Antiqua', Georgia, serif"],
        ['classic','Classic Serif',"Garamond, Georgia, 'Times New Roman', serif"],
        ['luxury','Elegant Serif',"Didot, 'Bodoni MT', 'Times New Roman', serif"],
        ['slab','Slab Serif',"Rockwell, 'Roboto Slab', 'Courier New', serif"],
        ['typewriter','Typewriter',"'American Typewriter', 'Courier New', ui-monospace, monospace"],
        ['code','Clean Mono',"'SFMono-Regular', Consolas, 'Liberation Mono', 'Courier New', monospace"],
        ['terminal','Terminal Mono',"Monaco, Menlo, Consolas, ui-monospace, monospace"],
        ['narrow','Narrow Sans',"'Arial Narrow', 'Aptos Narrow', 'Roboto Condensed', Arial, sans-serif"],
        ['bold','Bold Display',"Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif"],
        ['school','School Notes',"'Comic Sans MS', 'Bradley Hand', cursive"],
        ['script','Casual Script',"'Segoe Print', 'Bradley Hand', 'Comic Sans MS', cursive"],
        ['newspaper','Newspaper',"'Times New Roman', Times, Georgia, serif"],
        ['ui','System UI',"system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"],
        ['verdana','Verdana',"Verdana, Geneva, sans-serif"],
        ['tahoma','Tahoma',"Tahoma, Verdana, sans-serif"],
        ['calibri','Calibri',"Calibri, Candara, 'Segoe UI', sans-serif"],
        ['georgia','Georgia',"Georgia, 'Times New Roman', serif"],
        ['palatino','Palatino',"Palatino, 'Palatino Linotype', 'Book Antiqua', serif"],
        ['courier','Courier',"'Courier New', Courier, monospace"]
    ];

    function escV161(value){
        try { if (typeof escapeCustomHtml === 'function') return escapeCustomHtml(String(value ?? '')); } catch {}
        return String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
    }
    function slugV161(value){
        return String(value || 'theme').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'').slice(0,60) || 'theme';
    }
    function hexV161(value, fallback){
        const raw=String(value||'').trim();
        return /^#[0-9a-f]{6}$/i.test(raw) ? raw.toLowerCase() : fallback;
    }
    function cloneV161(value){
        try { return JSON.parse(JSON.stringify(value)); } catch { return null; }
    }
    async function copyTextV161(text){
        try {
            if(navigator.clipboard?.writeText){ await navigator.clipboard.writeText(text); return true; }
        } catch {}
        try { const ta=document.createElement('textarea');ta.value=text;ta.style.cssText='position:fixed;left:-9999px;top:0;opacity:0';document.body.appendChild(ta);ta.select();const ok=document.execCommand('copy');ta.remove();return !!ok; } catch { return false; }
    }

    // ------------------------------------------------------------------
    // Fonts: append many no-network/system-stack choices to every Builder font
    // selector. CUSTOM_THEME_FONT_STACKS is a mutable object even though the
    // binding itself is const.
    // ------------------------------------------------------------------
    try {
        FONT_OPTIONS_V161.forEach(([id,,stack]) => { CUSTOM_THEME_FONT_STACKS[id]=stack; });
    } catch {}
    function installFontsV161(modal){
        if(!modal) return;
        modal.querySelectorAll('[data-theme-key="font"]').forEach(select=>{
            const current=select.value;
            FONT_OPTIONS_V161.forEach(([id,label])=>{
                if(!Array.from(select.options).some(o=>o.value===id)){
                    const option=document.createElement('option');option.value=id;option.textContent=label;select.appendChild(option);
                }
            });
            if(Array.from(select.options).some(o=>o.value===current)) select.value=current;
        });
    }

    // ------------------------------------------------------------------
    // Safe theme-generated cursors. AI chooses palette + motif + trail family;
    // Loggy generates the actual SVG itself, so imported JSON never executes SVG
    // or script supplied by the AI.
    // ------------------------------------------------------------------
    const MOTIFS_V161 = new Set(['sparkle','heart','flower','leaf','wave','gem','moon','sun','bow','butterfly','star','ribbon','music','berry','cloud']);
    const TRAILS_V161 = new Set(['sparkle','heart','petal','leaf','bubble','star','gem','music','dot','moon','wave']);
    const TRAIL_SYMBOL_V161 = {sparkle:'✦',heart:'♥',petal:'❀',leaf:'❧',bubble:'○',star:'★',gem:'◆',music:'♪',dot:'•',moon:'☾',wave:'≈'};
    function sanitizeCursorSpecV161(spec, theme={}){
        if(!spec || typeof spec!=='object' || Array.isArray(spec)) return null;
        const motif=MOTIFS_V161.has(String(spec.motif||'').toLowerCase())?String(spec.motif).toLowerCase():'sparkle';
        const trail=TRAILS_V161.has(String(spec.trail||'').toLowerCase())?String(spec.trail).toLowerCase():'sparkle';
        return {
            primary:hexV161(spec.primary,hexV161(theme.accent,'#8b6fd8')),
            secondary:hexV161(spec.secondary,hexV161(theme.surface,'#ffffff')),
            accent:hexV161(spec.accent,hexV161(theme.text,'#29252f')),
            motif,trail
        };
    }
    function motifSvgV161(spec){
        const p=spec.primary,s=spec.secondary,a=spec.accent;
        switch(spec.motif){
            case 'heart': return `<path d="M62 21c5-8 18-5 18 6 0 10-18 21-18 21S44 37 44 27c0-11 13-14 18-6Z" fill="${p}" stroke="${a}" stroke-width="3"/>`;
            case 'flower': return `<g fill="${p}" stroke="${a}" stroke-width="2"><circle cx="62" cy="18" r="8"/><circle cx="75" cy="28" r="8"/><circle cx="68" cy="42" r="8"/><circle cx="52" cy="39" r="8"/><circle cx="49" cy="24" r="8"/></g><circle cx="62" cy="30" r="7" fill="${s}" stroke="${a}" stroke-width="2"/>`;
            case 'leaf': return `<path d="M44 39C47 17 63 8 82 10 80 31 66 44 44 39Z" fill="${p}" stroke="${a}" stroke-width="3"/><path d="M47 37 76 15" stroke="${s}" stroke-width="3" stroke-linecap="round"/>`;
            case 'wave': return `<path d="M43 34c10-20 25-22 38-8-9-2-14 3-14 9 0 6 6 10 13 8-12 12-31 8-37-9Z" fill="${p}" stroke="${a}" stroke-width="3"/><path d="M51 31c8-7 15-7 22-1" fill="none" stroke="${s}" stroke-width="3" stroke-linecap="round"/>`;
            case 'gem': return `<path d="M47 19 61 10l17 6 6 15-20 20-20-14Z" fill="${p}" stroke="${a}" stroke-width="3"/><path d="m47 19 17 32 14-35m-31 3 31-3M44 37l40-6" fill="none" stroke="${s}" stroke-width="2" opacity=".9"/>`;
            case 'moon': return `<path d="M77 12c-12 3-18 15-14 25 3 9 12 14 21 12-7 8-20 10-30 4-12-7-16-22-9-34 7-11 21-15 32-7Z" fill="${p}" stroke="${a}" stroke-width="3"/>`;
            case 'sun': return `<circle cx="63" cy="28" r="11" fill="${p}" stroke="${a}" stroke-width="3"/><g stroke="${a}" stroke-width="3" stroke-linecap="round"><path d="M63 7v7M63 42v7M42 28h7M77 28h8M48 13l5 5M74 39l5 5M78 13l-5 5M52 39l-5 5"/></g>`;
            case 'bow': return `<path d="M48 10c20 11 28 30 29 50M48 10c-2 20 7 38 29 50" fill="none" stroke="${p}" stroke-width="4" stroke-linecap="round"/><path d="m46 12 32 46" stroke="${a}" stroke-width="2"/><path d="m76 55 8 2-4 7" fill="${s}" stroke="${a}" stroke-width="2"/>`;
            case 'butterfly': return `<path d="M61 29c-15-17-27-10-20 5 5 10 14 8 20 2-2 11 5 18 12 11 7-8 1-17-9-18 9-3 14-11 9-17-6-7-13 2-12 17Z" fill="${p}" stroke="${a}" stroke-width="2.5"/><path d="M61 25v18" stroke="${a}" stroke-width="3" stroke-linecap="round"/>`;
            case 'ribbon': return `<path d="M45 15c18-10 34 4 24 17-9 11-25 4-21-7 3-8 16-6 22 5l11 23-12-4-6 11-9-24" fill="${p}" stroke="${a}" stroke-width="3" stroke-linejoin="round"/>`;
            case 'music': return `<path d="M70 12v31c0 7-7 12-14 9-7-3-6-12 1-15 3-1 6-1 9 0V19l20-5v23c0 7-7 12-14 9-7-3-6-12 1-15 3-1 6-1 9 0V10Z" fill="${p}" stroke="${a}" stroke-width="2.5"/>`;
            case 'berry': return `<g fill="${p}" stroke="${a}" stroke-width="2"><circle cx="56" cy="30" r="8"/><circle cx="69" cy="27" r="8"/><circle cx="63" cy="40" r="8"/></g><path d="M62 20c3-8 9-10 15-9" fill="none" stroke="${a}" stroke-width="3" stroke-linecap="round"/>`;
            case 'cloud': return `<path d="M46 39c-8 0-11-11-4-15 2-8 13-11 19-5 8-7 20-1 19 9 9 1 9 12 1 14H48Z" fill="${p}" stroke="${a}" stroke-width="3"/>`;
            case 'star': return `<path d="m63 9 6 13 14 2-10 10 3 14-13-7-13 7 3-14-10-10 14-2Z" fill="${p}" stroke="${a}" stroke-width="3" stroke-linejoin="round"/>`;
            default: return `<path d="m63 8 4 14 14 5-14 4-4 15-4-15-14-4 14-5Z" fill="${p}" stroke="${a}" stroke-width="2.5"/><circle cx="80" cy="14" r="4" fill="${s}"/>`;
        }
    }
    function cursorSvgV161(spec){
        return `<svg viewBox="0 0 100 100" width="40" height="40" xmlns="http://www.w3.org/2000/svg"><path d="M8 7 48 80 58 57 80 70 88 56 65 44 84 30Z" fill="${spec.secondary}" stroke="${spec.accent}" stroke-width="4" stroke-linejoin="round"/><path d="M13 13 46 70 53 50 72 60" fill="none" stroke="${spec.primary}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>${motifSvgV161(spec)}</svg>`;
    }
    function readCursorRegistryV161(){
        try { const value=JSON.parse(localStorage.getItem(AI_CURSOR_KEY_V161)||'[]'); return Array.isArray(value)?value:[]; } catch { return []; }
    }
    function isCursorDeletedV382(id){
        id=String(id||''); if(!id||id==='default') return false;
        try{const value=JSON.parse(localStorage.getItem(HIDDEN_CURSOR_KEY_V382)||'[]');return Array.isArray(value)&&value.map(String).includes(id)}catch{return false}
    }
    function removeCursorChoiceV382(id){
        try{for(let i=CURSOR_OPTIONS.length-1;i>=0;i--){if(String(CURSOR_OPTIONS[i]?.id||'')===String(id||''))CURSOR_OPTIONS.splice(i,1)}}catch{}
    }
    function writeCursorRegistryV161(list){ try { localStorage.setItem(AI_CURSOR_KEY_V161,JSON.stringify(list.slice(-80))); } catch {} }
    function installCursorEntryV161(entry){
        if(!entry || !/^theme-cursor-v161-[a-z0-9-]+$/.test(String(entry.id||''))) return;
        if(isCursorDeletedV382(entry.id)){removeCursorChoiceV382(entry.id);return;}
        const spec=sanitizeCursorSpecV161(entry.spec,{}); if(!spec)return;
        const label=String(entry.label||'Theme Cursor').trim().slice(0,80)||'Theme Cursor';
        let choice=CURSOR_OPTIONS.find(c=>String(c.id)===entry.id);
        const data={id:entry.id,name:label,kind:'image',emoji:TRAIL_SYMBOL_V161[spec.trail]||'✦',svg:cursorSvgV161(spec),customCursorSpecV161:spec};
        if(choice) Object.assign(choice,data); else CURSOR_OPTIONS.push(data);
        document.querySelectorAll('#theme-builder-modal .theme-builder-cursor-choice-v32 select').forEach(select=>{
            let option=Array.from(select.options).find(o=>o.value===entry.id);
            if(!option){option=document.createElement('option');option.value=entry.id;select.appendChild(option);}
            option.textContent=label;
        });
    }
    function recoverCursorsV161(){ readCursorRegistryV161().forEach(installCursorEntryV161); }
    function saveCursorEntryV161(entry){
        if(isCursorDeletedV382(entry?.id)){
            removeCursorChoiceV382(entry?.id);
            writeCursorRegistryV161(readCursorRegistryV161().filter(x=>String(x?.id||'')!==String(entry?.id||'')));
            return false;
        }
        const list=readCursorRegistryV161(); const index=list.findIndex(x=>String(x?.id||'')===String(entry.id||''));
        if(index>=0) list[index]=entry; else list.push(entry); writeCursorRegistryV161(list); installCursorEntryV161(entry); return true;
    }
    function registerCursorFromThemeV161(theme,name){
        if(!theme||typeof theme!=='object') return theme;
        const dep=theme.customCursorDependencyV161;
        if(dep?.id && dep?.spec){
            const depId=String(dep.id);
            if(isCursorDeletedV382(depId)){
                removeCursorChoiceV382(depId);
            }else{
                const spec=sanitizeCursorSpecV161(dep.spec,theme); if(spec) saveCursorEntryV161({id:depId,label:String(dep.label||'Theme Cursor').slice(0,80),spec});
            }
        }
        const own=sanitizeCursorSpecV161(theme.customCursorV161,theme);
        if(!own) return theme;
        const label=String(theme.customCursorLabelV161||name||theme.name||'Theme Cursor').trim().slice(0,80)||'Theme Cursor';
        const existing=String(theme.customCursorModeIdV161||theme.themeCursorStyle||'');
        const id=/^theme-cursor-v161-[a-z0-9-]+$/.test(existing)?existing:`${AI_CURSOR_ID_PREFIX_V161}${slugV161(label)}`;
        if(isCursorDeletedV382(id)){
            removeCursorChoiceV382(id);
            writeCursorRegistryV161(readCursorRegistryV161().filter(x=>String(x?.id||'')!==id));
            theme.useThemeCursor=false;
            theme.themeCursorStyle='default';
            theme.customCursorModeIdV161='';
            delete theme.customCursorDependencyV161;
            return theme;
        }
        saveCursorEntryV161({id,label,spec:own});
        theme.customCursorV161=own;
        theme.customCursorModeIdV161=id;
        theme.customCursorLabelV161=label;
        theme.customCursorDependencyV161={id,label,spec:own};
        theme.useThemeCursor=true;
        theme.themeCursorStyle=id;
        theme.themeCursorTrailEnabledV161=true;
        return theme;
    }
    recoverCursorsV161();

    try {
        const trailBeforeV161=getCursorTrailProfile;
        getCursorTrailProfile=function(choice){
            const spec=choice?.customCursorSpecV161;
            if(!spec) return trailBeforeV161.apply(this,arguments);
            const index=Math.max(0,CURSOR_OPTIONS.indexOf(choice));
            return {type:'themed-v158',color:spec.primary,accent:spec.secondary,symbol:TRAIL_SYMBOL_V161[spec.trail]||'✦',markA:TRAIL_SYMBOL_V161[spec.trail]||'✦',markB:'·',variant:100+index};
        };
    } catch {}

    // If a theme reuses an AI cursor, carry the safe cursor dependency with it.
    try {
        const draftBeforeCursorV161=getThemeBuilderDraft;
        getThemeBuilderDraft=function(modal){
            const draft=draftBeforeCursorV161.apply(this,arguments);
            const id=String(draft?.themeCursorStyle||'');
            if(id.startsWith(AI_CURSOR_ID_PREFIX_V161)){
                const entry=readCursorRegistryV161().find(x=>String(x?.id||'')===id);
                if(entry?.spec) draft.customCursorDependencyV161={id:entry.id,label:entry.label,spec:sanitizeCursorSpecV161(entry.spec,draft)};
            }
            if(draft.audioVolume==null || draft.audioVolume==='') draft.audioVolume=35;
            return draft;
        };
    } catch {}

    function setTrailForThemeV161(theme){
        const id=String(theme?.themeCursorStyle||'');
        if(isCursorDeletedV382(id) || !id.startsWith(AI_CURSOR_ID_PREFIX_V161) || theme?.themeCursorTrailEnabledV161===false) return;
        try {
            db.settings.cursorTrails=db.settings.cursorTrails||{};
            db.settings.cursorTrails[id]=true;
        } catch {}
    }

    // ------------------------------------------------------------------
    // Better AI prompt: usable before a theme exists, exact Builder schema,
    // smooth background instructions, safe reusable custom animation, and safe
    // custom cursor+trail generation.
    // ------------------------------------------------------------------
    function schemaModalV161(){
        let modal=document.getElementById('theme-builder-modal');
        try { if(!modal) modal=ensureThemeBuilderModal(); } catch {}
        installFontsV161(modal); return modal;
    }
    function colorSchemaV161(){
        const modal=schemaModalV161(); const items=[]; const seen=new Set();
        modal?.querySelectorAll?.('input[type="color"][data-theme-key]').forEach(input=>{
            const key=String(input.dataset.themeKey||'').trim(); if(!key||seen.has(key))return;seen.add(key);
            const label=input.closest('.theme-builder-field')?.querySelector(':scope > span')?.textContent?.trim()||key;
            items.push({key,label});
        });
        if(!items.length){
            [['background','Page Background Color'],['surface','Cards / Surface'],['text','Main Text'],['muted','Muted Text'],['accent','Accent'],['border','Borders'],['dashboardBackgroundV40','Dashboard Background'],['dashboardCardV40','Dashboard Cards'],['dashboardTextV40','Dashboard Text'],['dashboardAccentV40','Dashboard Accent'],['dashboardTitleColorV79','Dashboard Title'],['tabIconColor','Tab Icon'],['tabTitleColor','Tab Title']].forEach(([key,label])=>items.push({key,label}));
        }
        return items;
    }
    function animationSchemaV161(){
        try { return (THEME_SVG_ANIMATION_OPTIONS_V11||[]).map(([id,label])=>`- ${id}: ${label}`).join('\n'); } catch { return '- float: Float'; }
    }
    function fontSchemaV161(){
        const modal=schemaModalV161();
        return Array.from(modal?.querySelector?.('[data-theme-key="font"]')?.options||[]).map(o=>`${o.value} = ${o.textContent.trim()}`).filter(Boolean).join(', ');
    }
    function aiPromptV161(appearance){
        const mode=appearance==='dark'?'DARK':'LIGHT';
        const colors=colorSchemaV161();
        const colorList=colors.map(x=>`- ${x.key} (${x.label}) — REQUIRED #RRGGBB`).join('\n');
        return `You are creating ONE directly importable Loggy theme JSON. I will attach exactly FOUR visual reference images with this prompt. Analyze all four together for palette, mood, softness, visual era, contrast, materials, lighting, and atmosphere. They are VISUAL REFERENCES ONLY: do not embed them, do not invent file paths for them, and do not output base64 image data. I will add my own decoration SVG/PNG files separately after import.\n\nTHEME APPEARANCE: ${mode}. This is mandatory. ${mode==='DARK'?'Use genuinely dark page/surface colors with light readable text and gentle luminous accents.':'Use genuinely light page/surface colors with dark readable text and soft coordinated accents.'}\n\nOUTPUT RULES:\n1. CREATE A REAL DOWNLOADABLE .json FILE containing exactly ONE valid JSON object. Do NOT paste raw JSON into the chat response and do NOT wrap JSON in markdown. Use your file/artifact creation tool and return the downloadable .json file/link. If your interface truly cannot create a file, say that briefly instead of dumping JSON text. No comments or trailing commas.\n2. Use the exact outer structure shown below.\n3. Fill EVERY required color key below with a six-digit #RRGGBB value.\n4. Derive the palette from the four references, but prioritize readability and intentional contrast.\n5. Avoid neon clashes, muddy low-contrast text, harsh multi-stop gradients, and bright white spotlight blobs.\n6. Backgrounds should feel smooth and aesthetic: broad transitions, restrained saturation, and at most two extremely soft low-opacity radial layers over one smooth linear gradient.\n7. Do not use external URLs. Leave backgroundImage, introAudio, svgHoverSounds, and backgroundSvgs empty.\n\nREQUIRED COLOR FIELDS:\n${colorList}\n\nGENERAL THEME SETTINGS:\n- name: invent a short polished theme name inspired by the references.\n- font: choose exactly one available value: ${fontSchemaV161()}.\n- radius: 0–30.\n- shadow: 0–12, usually subtle.\n- audioVolume: 35.\n- backgroundModeV158: "gradient" or "solid"; prefer "gradient" when suitable.\n- backgroundGradientNameV56: short descriptive name.\n- backgroundGradientV56: valid CSS background-image value; one smooth linear-gradient plus at most two broad low-alpha radial-gradient layers. No harsh white spotlight circles.\n- backgroundImage: "".\n- interactiveBackgroundCodeV56: "" unless absolutely necessary; gradient is preferred.\n- backgroundSvgs: [].\n- svgHoverSounds: [].\n- introAudio: "".\n- svgGlobalScale: normally 100.\n- svgScenePreset: normally "scatter".\n- svgDistribution: normally "side-random" or "random".\n\nDECORATION ANIMATION:\nChoose an existing animation ID when one fits:\n${animationSchemaV161()}\n\nIf an existing mode fits, set svgDefaultAnimation to its exact ID and OMIT customAnimationV159. Only if none fit, set svgDefaultAnimation to "theme-custom-animation" and provide customAnimationV159 with this SAFE numeric shape:\n{"duration":6.8,"timing":"ease-in-out","direction":"alternate","keyframes":[{"offset":0,"x":0,"y":4,"rotate":-2,"scale":1,"opacity":1},{"offset":0.5,"x":8,"y":-8,"rotate":2,"scale":1.02,"opacity":1},{"offset":1,"x":0,"y":4,"rotate":-2,"scale":1,"opacity":1}]}\nUse 2–12 keyframes; ordered offsets 0..1; x/y usually within ±32px; rotate usually within ±8deg; scale usually 0.94–1.08; duration usually 4–12s. Never put CSS, JavaScript, filters, URLs, shadows, or arbitrary code in customAnimationV159. Loggy will safely register this animation under the theme name as a reusable Animation Mode.\n\nDASHBOARD BUTTON + LOG-TILE GUIDANCE:\n- Treat dashboard presentation as part of the theme, not an afterthought.\n- Dashboard log-page tile icons should normally be BLACK, WHITE, or the selected category/accent color, whichever has the best contrast.\n- The borders of the three top-right dashboard buttons should harmonize with the selected dashboard category background/accent.\n- On light themes, those buttons may use a clean white/light surface with category-colored borders, similar to a breezy light-card theme.\n- On dark themes, those buttons may use the same dark surface family as the selected log tile/page, with readable light/accent icons, similar to dark retro or matrix-style themes.\n- Fill every dashboard color field intentionally, and never leave the three dashboard buttons using stale colors from another theme.\n\nCUSTOM CURSOR + TRAIL — REQUIRED:\nCreate a matching cursor description using ONLY this safe schema (Loggy itself draws the SVG):\n"customCursorV161":{"primary":"#RRGGBB","secondary":"#RRGGBB","accent":"#RRGGBB","motif":"sparkle","trail":"sparkle"}\n- primary, secondary, and accent must harmonize with the theme and remain visible against the chosen background.\n- motif MUST be one of: sparkle, heart, flower, leaf, wave, gem, moon, sun, bow, butterfly, star, ribbon, music, berry, cloud.\n- trail MUST be one of: sparkle, heart, petal, leaf, bubble, star, gem, music, dot, moon, wave.\n- Choose the motif/trail that best matches the four reference images.\n- Also set "useThemeCursor": true and do not invent a themeCursorStyle ID; Loggy creates the cursor ID during import and makes it the initial cursor automatically.\n\nREQUIRED JSON SHAPE:\n{\n  "format":"loggy-theme-json",\n  "version":2,\n  "name":"Theme Name",\n  "theme":{\n    "name":"Theme Name",\n    ...EVERY REQUIRED COLOR FIELD ABOVE AS FLAT FIELDS...,\n    "font":"one-valid-font-value",\n    "radius":12,\n    "shadow":2,\n    "audioVolume":35,\n    "backgroundModeV158":"gradient",\n    "backgroundGradientNameV56":"Background Name",\n    "backgroundGradientV56":"linear-gradient(...) ",\n    "backgroundImage":"",\n    "interactiveBackgroundCodeV56":"",\n    "svgDefaultAnimation":"one-existing-id-or-theme-custom-animation",\n    "svgScenePreset":"scatter",\n    "svgDistribution":"side-random",\n    "svgGlobalScale":100,\n    "backgroundSvgs":[],\n    "svgHoverSounds":[],\n    "introAudio":"",\n    "useThemeCursor":true,\n    "customCursorV161":{"primary":"#RRGGBB","secondary":"#RRGGBB","accent":"#RRGGBB","motif":"one-allowed-motif","trail":"one-allowed-trail"}\n  }\n}\n\nBefore outputting, verify internally that every required color key is present, the JSON parses, ${mode} contrast is correct, the background is smooth, and the cursor palette is visible against the background. Then CREATE the downloadable .json file and return only the downloadable file/link. Do NOT paste the JSON text into the chat.`;
    }

    function cleanImportedV161(payload){
        const copy=cloneV161(payload); if(!copy||typeof copy!=='object'||Array.isArray(copy)) throw new Error('That file does not contain a theme JSON object.');
        const raw=copy.theme&&typeof copy.theme==='object'&&!Array.isArray(copy.theme)?copy.theme:copy;
        const theme=cloneV161(raw)||{};
        const name=String(copy.name||theme.name||'Imported Theme').trim().slice(0,80)||'Imported Theme';
        theme.name=name;
        if(!Array.isArray(theme.backgroundSvgs))theme.backgroundSvgs=[];
        if(!Array.isArray(theme.svgHoverSounds))theme.svgHoverSounds=[];
        ['backgroundImage','introAudio'].forEach(key=>{ if(/^https?:/i.test(String(theme[key]||''))) theme[key]=''; });
        theme.backgroundSvgs=theme.backgroundSvgs.filter(asset=>!/^https?:/i.test(String(asset?.url||asset?.src||'')));
        if(theme.audioVolume==null || theme.audioVolume==='') theme.audioVolume=35;
        try { window.__loggyThemeCustomAnimationsV159?.register?.(theme,name); } catch {}
        registerCursorFromThemeV161(theme,name);
        return theme;
    }

    async function readThemeJsonFileV161(file){
        if(!file) throw new Error('Choose a JSON file.');
        if(file.size>3*1024*1024) throw new Error('Theme JSON is too large.');
        let parsed; try { parsed=JSON.parse(await file.text()); } catch { throw new Error('That file is not valid JSON.'); }
        return cleanImportedV161(parsed);
    }

    // V214 — fast AI JSON import WITHOUT bypassing Theme Builder setup.
    // The V211 shortcut set values only on controls that already existed. That
    // skipped the real populate chain which creates Main Colors, Navigation,
    // Page Backdrops, the Background upload UI, Decorations wiring and Trinkets.
    // Keep the complete populate chain, but temporarily suspend only the costly
    // repeated preview/gallery renders. Then settle those expensive surfaces once.
    function nextPaintV214(){
        return new Promise(resolve=>requestAnimationFrame(resolve));
    }
    function idleV214(fn, timeout=180){
        if(typeof requestIdleCallback==='function') requestIdleCallback(()=>fn(),{timeout});
        else setTimeout(fn,0);
    }
    function suspendHeavyThemeBuilderRendersV214(){
        const saved={};
        const noop=()=>{};
        try{saved.updateThemeBuilderPreview=updateThemeBuilderPreview;updateThemeBuilderPreview=noop}catch{}
        try{saved.rebuildActualThemeBuilderPreviewV5=rebuildActualThemeBuilderPreviewV5;rebuildActualThemeBuilderPreviewV5=noop}catch{}
        try{saved.renderThemeBuilderSvgListV2=renderThemeBuilderSvgListV2;renderThemeBuilderSvgListV2=noop}catch{}
        try{saved.renderThemeBuilderHoverSoundListV10=renderThemeBuilderHoverSoundListV10;renderThemeBuilderHoverSoundListV10=noop}catch{}
        try{saved.renderAdvancedThemeBuilderSvgPreviewV10=renderAdvancedThemeBuilderSvgPreviewV10;renderAdvancedThemeBuilderSvgPreviewV10=noop}catch{}
        try{saved.renderThemeArtworkPreviewV61=renderThemeArtworkPreviewV61;renderThemeArtworkPreviewV61=noop}catch{}
        try{saved.renderDashboardThemePreviewV40=renderDashboardThemePreviewV40;renderDashboardThemePreviewV40=noop}catch{}
        try{saved.renderDashboardPreviewV45=renderDashboardPreviewV45;renderDashboardPreviewV45=noop}catch{}
        try{saved.installThemeAccessoryGalleriesV37=installThemeAccessoryGalleriesV37;installThemeAccessoryGalleriesV37=noop}catch{}
        try{saved.refreshThemeAccessoryGallerySelectionV37=refreshThemeAccessoryGallerySelectionV37;refreshThemeAccessoryGallerySelectionV37=noop}catch{}
        return ()=>{
            try{if(saved.updateThemeBuilderPreview)updateThemeBuilderPreview=saved.updateThemeBuilderPreview}catch{}
            try{if(saved.rebuildActualThemeBuilderPreviewV5)rebuildActualThemeBuilderPreviewV5=saved.rebuildActualThemeBuilderPreviewV5}catch{}
            try{if(saved.renderThemeBuilderSvgListV2)renderThemeBuilderSvgListV2=saved.renderThemeBuilderSvgListV2}catch{}
            try{if(saved.renderThemeBuilderHoverSoundListV10)renderThemeBuilderHoverSoundListV10=saved.renderThemeBuilderHoverSoundListV10}catch{}
            try{if(saved.renderAdvancedThemeBuilderSvgPreviewV10)renderAdvancedThemeBuilderSvgPreviewV10=saved.renderAdvancedThemeBuilderSvgPreviewV10}catch{}
            try{if(saved.renderThemeArtworkPreviewV61)renderThemeArtworkPreviewV61=saved.renderThemeArtworkPreviewV61}catch{}
            try{if(saved.renderDashboardThemePreviewV40)renderDashboardThemePreviewV40=saved.renderDashboardThemePreviewV40}catch{}
            try{if(saved.renderDashboardPreviewV45)renderDashboardPreviewV45=saved.renderDashboardPreviewV45}catch{}
            try{if(saved.installThemeAccessoryGalleriesV37)installThemeAccessoryGalleriesV37=saved.installThemeAccessoryGalleriesV37}catch{}
            try{if(saved.refreshThemeAccessoryGallerySelectionV37)refreshThemeAccessoryGallerySelectionV37=saved.refreshThemeAccessoryGallerySelectionV37}catch{}
        };
    }
    function revealImportedBuilderV214(modal){
        modal.classList.remove('hidden','theme-builder-built-in-loading-v123','theme-builder-built-in-loading-v126','theme-json-importing-v209','theme-builder-fast-open-v176');
        modal.removeAttribute('aria-busy');
        modal.removeAttribute('aria-hidden');
        modal.removeAttribute('inert');
        try{modal.inert=false}catch{}
        modal.style.removeProperty('visibility');
        modal.style.removeProperty('opacity');
        modal.style.removeProperty('pointer-events');
    }
    function wireImportedCreateActionsV214(modal){
        if(!modal)return;
        modal.dataset.themeBuilderMode='create';
        modal.dataset.themeBuilderEditingThemeV25='';
        modal.dataset.themeBuilderEditingCopyV30='';
        delete modal.dataset.themeBuilderBuiltInSourceV30;
        try{removeBuiltInEditorStateForCustomV30?.(modal)}catch{}
        try{removeRestoreOriginalButtonV27?.(modal)}catch{}
        try{removeLegacyThemeBuilderResetV28?.(modal)}catch{}

        const save=modal.querySelector('.theme-builder-save');
        const createApply=async()=>{
            try{if(typeof validateThemeBuilderBeforeSaveV25==='function'&&!validateThemeBuilderBeforeSaveV25(modal))return}catch{}
            const draft=getThemeBuilderDraft(modal);
            db.settings.customTheme={
                ...(typeof FEATURE_SUITE_DEFAULT_THEME!=='undefined'?FEATURE_SUITE_DEFAULT_THEME:{}),
                ...(typeof CUSTOM_THEME_MEDIA_DEFAULTS_V3!=='undefined'?CUSTOM_THEME_MEDIA_DEFAULTS_V3:{}),
                ...(typeof CUSTOM_THEME_VISUAL_DEFAULTS_V4!=='undefined'?CUSTOM_THEME_VISUAL_DEFAULTS_V4:{}),
                ...draft
            };
            db.settings.customThemeDeleted=false;
            db.settings.deletedThemes=(db.settings.deletedThemes||[]).filter(v=>v!=='theme-custom-builder');
            db.settings.theme='theme-custom-builder';
            try{ensureCustomThemePickerOption?.()}catch{}
            await saveDb();
            window._forceThemeAccessoriesOnceV32=true;
            try{await applyTheme('theme-custom-builder',{persist:false})}catch{}
            try{if(dailyThemeSelect)dailyThemeSelect.value='theme-custom-builder'}catch{}
            try{themePickerSelected='theme-custom-builder';renderThemePicker?.()}catch{}
            modal.classList.add('hidden');
            try{dailySettingsModal?.classList.add('hidden')}catch{}
            try{showFeatureToast('Custom theme saved and applied.')}catch{}
        };
        if(save){save.onclick=createApply;modal._createApplyHandlerV45=createApply}
        try{installNormalCreateActionsV45?.(modal)}catch{}
        try{bindDashboardPreviewV45?.(modal)}catch{}
        try{bindUniversalManualDragV45?.(modal)}catch{}
    }
    function settleImportedBuilderV214(modal,theme,saved){
        if(!modal?.isConnected||modal.classList.contains('hidden'))return;
        try{saved.renderThemeBuilderSvgListV2?.(modal)}catch{}
        try{saved.renderThemeBuilderHoverSoundListV10?.(modal)}catch{}
        try{installThemeBuilderSectionTabsV11?.(modal)}catch{}
        try{saved.rebuildActualThemeBuilderPreviewV5?.(modal)}catch{}
        try{saved.updateThemeBuilderPreview?.(modal)}catch{}
        try{
            registerCursorFromThemeV161(theme,theme.name);
            const cursorId=String(theme.themeCursorStyle||theme.customCursorModeIdV161||'');
            if(cursorId&&cursorId.startsWith(AI_CURSOR_ID_PREFIX_V161)){
                theme.useThemeCursor=true;
                theme.themeCursorTrailEnabledV161=true;
                setTrailForThemeV161(theme);
            }
        }catch{}
        // Trinket galleries can be heavier than the form itself. Populate them in
        // their own task after the first correct Theme Builder paint.
        setTimeout(()=>{
            if(!modal?.isConnected||modal.classList.contains('hidden'))return;
            try{saved.installThemeAccessoryGalleriesV37?.(modal)}catch{}
            try{saved.refreshThemeAccessoryGallerySelectionV37?.(modal)}catch{}
            try{
                const cursorId=String(theme.themeCursorStyle||theme.customCursorModeIdV161||'');
                if(cursorId&&cursorId.startsWith(AI_CURSOR_ID_PREFIX_V161)){
                    const toggle=modal.querySelector('.theme-builder-use-cursor-v32 input');
                    const select=modal.querySelector('.theme-builder-cursor-choice-v32 select');
                    if(toggle&&!toggle.checked){toggle.checked=true;toggle.dispatchEvent(new Event('change',{bubbles:true}))}
                    if(select&&select.value!==cursorId&&Array.from(select.options||[]).some(o=>o.value===cursorId)){
                        select.value=cursorId;select.dispatchEvent(new Event('change',{bubbles:true}));
                    }
                }
            }catch{}
        },0);
    }
    async function populateImportedIntoEditorV161(theme, openNew){
        let modal=null;
        // Build a fresh modal directly instead of opening a blank theme first and
        // then populating it a second time. That duplicate population was a major
        // source of the JSON-import freeze.
        try{modal=ensureThemeBuilderModal()}catch{}
        if(!modal)throw new Error('Could not open Theme Builder.');

        wireImportedCreateActionsV214(modal);
        modal.classList.add('theme-json-importing-v214');
        modal.setAttribute('aria-busy','true');
        revealImportedBuilderV214(modal);
        await nextPaintV214();

        const restore=suspendHeavyThemeBuilderRendersV214();
        const saved={};
        try{
            // Capture the real expensive functions before restoration so the
            // one-shot settle can call them explicitly afterward.
            try{saved.updateThemeBuilderPreview=updateThemeBuilderPreview}catch{}
            try{saved.rebuildActualThemeBuilderPreviewV5=rebuildActualThemeBuilderPreviewV5}catch{}
            try{saved.renderThemeBuilderSvgListV2=renderThemeBuilderSvgListV2}catch{}
            try{saved.renderThemeBuilderHoverSoundListV10=renderThemeBuilderHoverSoundListV10}catch{}
            try{saved.installThemeAccessoryGalleriesV37=installThemeAccessoryGalleriesV37}catch{}
            try{saved.refreshThemeAccessoryGallerySelectionV37=refreshThemeAccessoryGallerySelectionV37}catch{}
        }catch{}

        // The capture above happened after suspension in some engines, so keep a
        // separate reference set from the restoration helper by reading the globals
        // again immediately after restore below.
        try{populateThemeBuilder(modal,theme)}catch(error){restore();throw error}
        restore();

        // Refresh saved references now that the real functions are restored.
        try{saved.updateThemeBuilderPreview=updateThemeBuilderPreview}catch{}
        try{saved.rebuildActualThemeBuilderPreviewV5=rebuildActualThemeBuilderPreviewV5}catch{}
        try{saved.renderThemeBuilderSvgListV2=renderThemeBuilderSvgListV2}catch{}
        try{saved.renderThemeBuilderHoverSoundListV10=renderThemeBuilderHoverSoundListV10}catch{}
        try{saved.installThemeAccessoryGalleriesV37=installThemeAccessoryGalleriesV37}catch{}
        try{saved.refreshThemeAccessoryGallerySelectionV37=refreshThemeAccessoryGallerySelectionV37}catch{}

        wireImportedCreateActionsV214(modal);
        try{installFontsV161(modal)}catch{}
        modal.classList.remove('theme-json-importing-v214');
        modal.removeAttribute('aria-busy');
        revealImportedBuilderV214(modal);
        await nextPaintV214();
        settleImportedBuilderV214(modal,theme,saved);
        return modal;
    }

    async function importIntoEditorV161(file,button,openNew){
        const old=button?.innerHTML||'';
        if(button){button.disabled=true;button.innerHTML='<i class="ph ph-spinner-gap"></i> Loading…';}
        try {
            const theme=await readThemeJsonFileV161(file);
            const modal=await populateImportedIntoEditorV161(theme,!!openNew);
            ensureBuilderAiControlsV161(modal);
            try { showFeatureToast(`Loaded “${theme.name}” into Theme Builder. Review it, then click Save or Save & Apply.`); } catch {}
        } catch(error){
            try { window.__lastThemeImportErrorV161=String(error?.stack||error?.message||error); } catch {}
            try { showFeatureToast(error.message||'Could not load Theme JSON.'); } catch { alert(error.message||'Could not load Theme JSON.'); }
        } finally { if(button){button.disabled=false;button.innerHTML=old;} }
    }

    function builderAppearanceV161(modal){ return modal?.querySelector('.theme-json-prompt-mode-v159')?.value||'light'; }
    function ensureBuilderAiControlsV161(modal){
        if(!modal)return;
        installFontsV161(modal);
        const row=modal.querySelector('.theme-json-prompt-row-v159');
        if(row){
            const actions=row.querySelector('.theme-json-prompt-actions-v159');
            if(actions && !actions.querySelector('.theme-json-upload-v161')){
                const btn=document.createElement('button');btn.type='button';btn.className='theme-builder-file-button theme-json-upload-v161';btn.innerHTML='<i class="ph ph-upload-simple"></i> Upload Theme JSON';
                const input=document.createElement('input');input.type='file';input.accept='.json,application/json';input.className='hidden theme-json-upload-file-v161';
                actions.append(btn,input);
                btn.addEventListener('click',()=>input.click());
                input.addEventListener('change',async()=>{const file=input.files?.[0];input.value='';if(file)await importIntoEditorV161(file,btn,false);});
            }
        }
        ensureSongAuditionV161(modal);
    }

    // Capture the older Copy JSON button so it uses the new prompt with cursor
    // schema and does not depend on a pre-filled name/color.
    document.addEventListener('click',async event=>{
        const btn=event.target.closest?.('#theme-builder-modal .theme-copy-json-prompt-v159');
        if(!btn)return;
        event.preventDefault();event.stopPropagation();event.stopImmediatePropagation?.();
        const modal=btn.closest('#theme-builder-modal'); const old=btn.innerHTML;
        const mode=builderAppearanceV161(modal);
        const ok=await copyTextV161(aiPromptV161(mode));
        btn.innerHTML=ok?'<i class="ph ph-check"></i> Copied':'<i class="ph ph-warning"></i> Copy failed';
        if(ok)try{showFeatureToast(`Copied ${mode} AI Theme JSON prompt. Attach your 4 reference images.`)}catch{}
        setTimeout(()=>{if(btn.isConnected)btn.innerHTML=old},1300);
    },true);

    // Main Theme Settings entry: no need to create a dummy theme first.
    function ensureThemeAiEntryV161(){
        const search=document.querySelector('#theme-search-input')?.closest('.theme-search-wrap');
        const parent=search?.parentElement;if(!search||!parent)return;
        if(document.getElementById('theme-ai-entry-v161'))return;
        const panel=document.createElement('div');panel.id='theme-ai-entry-v161';panel.className='theme-ai-entry-v161';
        panel.innerHTML=`<div class="theme-ai-entry-copy-v161"><strong><i class="ph ph-sparkle"></i> Create Theme with AI</strong><small>Choose light or dark, copy the prompt, attach your 4 reference images, then upload the returned JSON. It opens in Theme Builder fully editable before you save it.</small></div><div class="theme-ai-entry-actions-v161"><select class="theme-ai-entry-mode-v161" aria-label="AI theme appearance"><option value="light">Light Theme</option><option value="dark">Dark Theme</option></select><button type="button" class="theme-ai-copy-v161"><i class="ph ph-copy"></i> Copy JSON Prompt</button><button type="button" class="theme-ai-upload-v161"><i class="ph ph-upload-simple"></i> Upload Theme JSON</button><input type="file" class="theme-ai-file-v161 hidden" accept=".json,application/json"></div>`;
        const anchor=search.closest('.theme-search-row-v161')||search; anchor.insertAdjacentElement('afterend',panel);
        const copy=panel.querySelector('.theme-ai-copy-v161'),upload=panel.querySelector('.theme-ai-upload-v161'),file=panel.querySelector('.theme-ai-file-v161');
        copy.onclick=async()=>{const old=copy.innerHTML,mode=panel.querySelector('.theme-ai-entry-mode-v161')?.value||'light';const ok=await copyTextV161(aiPromptV161(mode));copy.innerHTML=ok?'<i class="ph ph-check"></i> Copied':'<i class="ph ph-warning"></i> Copy failed';if(ok)try{showFeatureToast(`Copied ${mode} AI Theme JSON prompt. Attach your 4 reference images.`)}catch{}setTimeout(()=>{if(copy.isConnected)copy.innerHTML=old},1300)};
        upload.onclick=()=>file.click();
        file.onchange=async()=>{const f=file.files?.[0];file.value='';if(f)await importIntoEditorV161(f,upload,true)};
    }

    // Old Theme Pack JSON import button now routes into the editor instead of
    // instantly publishing/applying, matching the new review-before-save flow.
    document.addEventListener('click',event=>{
        const oldBtn=event.target.closest?.('.theme-json-import-v159');if(!oldBtn)return;
        event.preventDefault();event.stopPropagation();event.stopImmediatePropagation?.();
        let input=document.getElementById('theme-json-route-file-v161');
        if(!input){input=document.createElement('input');input.type='file';input.id='theme-json-route-file-v161';input.accept='.json,application/json';input.className='hidden';document.body.appendChild(input);input.addEventListener('change',async()=>{const f=input.files?.[0];input.value='';if(f)await importIntoEditorV161(f,oldBtn,true)});}
        input.click();
    },true);

    // ------------------------------------------------------------------
    // Theme search + button on the SAME line.
    // ------------------------------------------------------------------
    function ensureThemeSearchPlusV161(){
        const wrap=document.querySelector('#theme-search-input')?.closest('.theme-search-wrap'); if(!wrap)return;
        let row=wrap.closest('.theme-search-row-v161');
        if(!row){row=document.createElement('div');row.className='theme-search-row-v161';wrap.parentNode.insertBefore(row,wrap);row.appendChild(wrap);}
        if(!row.querySelector('.theme-search-create-v161')){
            const btn=document.createElement('button');btn.type='button';btn.className='theme-search-create-v161';btn.title='Create new theme';btn.setAttribute('aria-label','Create new theme');btn.innerHTML='<i class="ph ph-plus"></i>';btn.onclick=()=>{try{openNewThemeBuilderCleanV34()}catch{}};row.appendChild(btn);
        }
    }

    // ------------------------------------------------------------------
    // Live Builder cursor preview. Selecting a cursor immediately swaps the
    // visible pointer while the Builder is open; closing/saving restores the
    // actually-applied app cursor.
    // ------------------------------------------------------------------
    function previewCursorV161(id){
        const choice=CURSOR_OPTIONS.find(c=>String(c.id)===String(id))||CURSOR_OPTIONS[0];
        const root=document.documentElement;
        try{stopCursorFx()}catch{};try{stopTrackingCustomCursor()}catch{};
        document.body.classList.remove('cursor-none');root.classList.remove('cursor-hide-native');
        let visual=document.getElementById('custom-cursor-visual');
        if(choice.kind==='fx'||choice.kind==='image'){
            if(!visual){visual=document.createElement('div');visual.id='custom-cursor-visual';document.body.appendChild(visual);}
            visual.innerHTML=choice.kind==='fx'?CURSOR_FX_GLYPH_SVG:choice.svg;
            visual.className=`cursor-custom cursor-kind-${choice.kind} cursor-style-${choice.id}`;
            visual.dataset.cursorId=choice.id;visual.style.display='flex';visual.style.setProperty('z-index','2147483647','important');visual.style.setProperty('pointer-events','none','important');
            root.classList.add('cursor-hide-native');try{trackCustomCursor(visual)}catch{}
            if(choice.customCursorSpecV161 || isCursorTrailEnabled(choice.id)) try{startCursorFx(choice)}catch{}
        } else {
            if(visual){visual.style.display='none';visual.className='';delete visual.dataset.cursorId;}
            if(choice.kind==='none')document.body.classList.add('cursor-none');
        }
    }
    document.addEventListener('change',event=>{
        const select=event.target.closest?.('#theme-builder-modal .theme-builder-cursor-choice-v32 select'); if(!select)return;
        requestAnimationFrame(()=>previewCursorV161(select.value));
    },true);
    document.addEventListener('click',event=>{
        const card=event.target.closest?.('#theme-builder-modal .theme-cursor-card-v37'); if(!card)return;
        requestAnimationFrame(()=>previewCursorV161(card.dataset.cursorId));
    },true);

    // ------------------------------------------------------------------
    // Intro song audition button next to the selected filename.
    // ------------------------------------------------------------------
    function stopSongAuditionV161(modal){
        const audio=modal?._themeSongAuditionV161;if(audio){try{audio.pause();audio.currentTime=0}catch{}}
        if(modal)modal._themeSongAuditionV161=null;
        const btn=modal?.querySelector('.theme-song-audition-v161');if(btn)btn.innerHTML='<i class="ph ph-speaker-high"></i>';
    }
    function refreshSongAuditionV161(modal){
        const btn=modal?.querySelector('.theme-song-audition-v161');if(!btn)return;
        const has=!!String(modal?._themeIntroAudio||'').trim();btn.disabled=!has;btn.classList.toggle('is-disabled-v161',!has);
    }
    function ensureSongAuditionV161(modal){
        if(!modal)return;
        const name=modal.querySelector('.theme-builder-audio-name');const row=name?.closest('.theme-builder-file-picker-row');if(!row)return;
        let btn=row.querySelector('.theme-song-audition-v161');
        if(!btn){btn=document.createElement('button');btn.type='button';btn.className='small-icon-btn theme-song-audition-v161';btn.title='Play or pause selected intro song';btn.setAttribute('aria-label','Play or pause selected intro song');btn.innerHTML='<i class="ph ph-speaker-high"></i>';name.insertAdjacentElement('afterend',btn);
            btn.onclick=async()=>{
                const src=String(modal._themeIntroAudio||'').trim();if(!src)return;
                const current=modal._themeSongAuditionV161;
                if(current&&!current.paused){current.pause();btn.innerHTML='<i class="ph ph-speaker-high"></i>';return;}
                stopSongAuditionV161(modal);try{stopThemeBuilderIntroPreviewV10?.(modal)}catch{}
                const audio=new Audio(src);modal._themeSongAuditionV161=audio;
                const volume=Number(modal.querySelector('.theme-builder-song-volume-input-v42')?.value);audio.volume=Math.max(0,Math.min(1,(Number.isFinite(volume)?volume:35)/100));
                audio.addEventListener('ended',()=>{if(modal._themeSongAuditionV161===audio){modal._themeSongAuditionV161=null;btn.innerHTML='<i class="ph ph-speaker-high"></i>';}});audio.addEventListener('pause',()=>{if(btn.isConnected)btn.innerHTML='<i class="ph ph-speaker-high"></i>';});
                audio.addEventListener('play',()=>{if(btn.isConnected)btn.innerHTML='<i class="ph ph-pause"></i>';});
                try{const draft=getThemeBuilderDraft(modal);const start=Math.max(0,Number(draft.audioStart)||0);audio.addEventListener('loadedmetadata',()=>{try{audio.currentTime=Math.min(start,Math.max(0,(audio.duration||start+1)-.05))}catch{}},{once:true});}catch{}
                try{await audio.play()}catch{try{showFeatureToast('Could not play that audio file.')}catch{}}
            };
        }
        refreshSongAuditionV161(modal);
    }
    document.addEventListener('change',event=>{
        if(event.target?.matches?.('#theme-builder-modal .theme-builder-audio-file')){
            const modal=event.target.closest('#theme-builder-modal');setTimeout(()=>{ensureSongAuditionV161(modal);refreshSongAuditionV161(modal)},350);
        }
    },true);

    // ------------------------------------------------------------------
    // Fade any currently playing applied-theme intro when entering Theme Builder
    // so it never competes with the audio controls/preview inside the editor.
    // ------------------------------------------------------------------
    function fadeAppliedIntroV161(){
        let audio=null;try{audio=customThemeIntroAudioV2||null}catch{}
        if(!audio||audio.paused||audio.ended)return;
        const start=Math.max(0,Math.min(1,Number(audio.volume)||0));const began=performance.now(),duration=620;
        const tick=now=>{if(!audio||audio.paused)return;const p=Math.min(1,(now-began)/duration);try{audio.volume=start*(1-p)}catch{};if(p<1)requestAnimationFrame(tick);else{try{audio.pause()}catch{};try{if(customThemeIntroAudioV2===audio)customThemeIntroAudioV2=null}catch{}}};requestAnimationFrame(tick);
    }
    function wrapBuilderOpenFadeV161(name){
        try{
            const before=eval(name);if(typeof before!=='function')return;
            const wrapped=function(){fadeAppliedIntroV161();return before.apply(this,arguments)};
            try{eval(`${name}=wrapped`)}catch{};try{window[name]=wrapped}catch{}
        }catch{}
    }
    ['openNewThemeBuilderCleanV34','openExistingCustomThemeFromPickerV7','openAnyThemeInBuilderV25','openThemeCopyInBuilderV30','openDashboardSharedThemeInStudioV43'].forEach(wrapBuilderOpenFadeV161);
    // Also fade at the actual Edit Theme click boundary. This makes the behavior
    // reliable even when another compatibility wrapper owns the opener function.
    document.addEventListener('click',event=>{
        if(event.target?.closest?.('[data-action="edit-theme"], .theme-edit-btn, .theme-picker-edit-button')) fadeAppliedIntroV161();
    },true);

    // ------------------------------------------------------------------
    // Post-apply compatibility hydration for background/cursor state only.
    // V366 owns decoration mounting; late decoration remounts were removed
    // because they caused visible position jumps after a theme had settled.
    // ------------------------------------------------------------------
    function resolveThemeV161(id){
        const key=String(id||'');
        try{const copy=getThemeCopyV30?.(key);if(copy?.theme)return copy.theme}catch{}
        try{const shared=readSharedThemeLibraryV40?.().find?.(x=>String(x?.id||'')===key);if(shared?.theme)return shared.theme}catch{}
        if(key==='theme-custom-builder'){try{return getCustomThemeSettings?.()||null}catch{}}
        try{const override=getThemeOverrideV25?.(key);if(override)return override}catch{}
        return null;
    }
    let settleTokenV161=0;
    function settleThemeV161(theme,token){
        if(!theme||token!==settleTokenV161)return;
        registerCursorFromThemeV161(theme,theme.name);setTrailForThemeV161(theme);
        const mode=String(theme.backgroundModeV158||'').trim();
        const gradient=String(theme.backgroundGradientV56||'').trim();
        const image=String(theme.backgroundImage||'').trim();
        try{
            if(String(theme.interactiveBackgroundCodeV56||'').trim()) mountThemeCreativeBackgroundV56?.({...theme,backgroundGradientV56:mode==='gradient'?gradient:''});
            if(mode==='gradient'&&gradient){document.body.style.setProperty('background-image',gradient,'important');document.body.style.setProperty('background-size','cover','important');document.body.style.setProperty('background-position','center','important');}
            else if(mode==='image'&&image){document.body.style.setProperty('background-image',`url("${image.replace(/\\/g,'\\\\').replace(/"/g,'\\"')}")`,'important');document.body.style.setProperty('background-size','cover','important');document.body.style.setProperty('background-position','center','important');}
            else if(mode==='solid') document.body.style.setProperty('background-image','none','important');
        }catch{}
        // V366: decoration mounting is owned by the single atomic theme runtime.
        // Do not remount artwork here; this compatibility pass only hydrates
        // background/cursor state after the main theme application.
        try{applyCursorChoice?.()}catch{}
    }
    try{
        const applyBeforeSettleV161=applyTheme;
        applyTheme=async function(themeId,opts={}){
            const token=++settleTokenV161;
            const result=await applyBeforeSettleV161.apply(this,arguments);
            const theme=resolveThemeV161(themeId);
            if(theme)requestAnimationFrame(()=>settleThemeV161(theme,token));
            // Built-in theme CSS is loaded through a dynamic <link>. On a cold load it
            // can finish after the JS module mounted; hook the real stylesheet load so
            // source-defined backgrounds/animations get one clean remount instead of
            // requiring a page reload. Edited/custom themes use settleThemeV161 above.
            try{
                const link=document.getElementById('dynamic-theme-css');
                if(link && !theme && String(themeId||'').startsWith('theme-')){
                    link.addEventListener('load',()=>{
                        if(token!==settleTokenV161 || !document.body.classList.contains(String(themeId)))return;
                        try{
                            const mod=activeThemeModule;
                            if(mod?.unmount && mod?.mount){mod.unmount();mod.mount();}
                        }catch{}
                        try{applyCursorChoice?.()}catch{}
                    },{once:true});
                }
            }catch{}
            return result;
        };
    }catch{}

    // ------------------------------------------------------------------
    // Shortcut wording: Shift+W is authoritative in the visible list.
    // ------------------------------------------------------------------
    function fixShortcutV161(){
        document.querySelectorAll('#global-shortcuts-section .global-shortcut-row').forEach(row=>{
            if(/Open Theme Settings/i.test(row.textContent||'')){
                const keys=row.querySelectorAll('kbd');if(keys.length)keys[keys.length-1].textContent='W';
            }
        });
    }

    // Install/refresh hooks.
    try{
        const populateBeforeV161=populateThemeBuilder;
        populateThemeBuilder=function(modal,theme={}){
            if(theme&&typeof theme==='object'){registerCursorFromThemeV161(theme,theme.name);setTrailForThemeV161(theme)}
            installFontsV161(modal);
            document.querySelectorAll('#theme-builder-modal .theme-builder-cursor-choice-v32 select').forEach(select=>{CURSOR_OPTIONS.forEach(cursor=>{if(!Array.from(select.options).some(o=>o.value===cursor.id)){const o=document.createElement('option');o.value=cursor.id;o.textContent=cursor.name;select.appendChild(o)}})});
            const result=populateBeforeV161.apply(this,arguments);installFontsV161(modal);ensureBuilderAiControlsV161(modal);try{installThemeAccessoryGalleriesV37?.(modal)}catch{};return result;
        };
    }catch{}
    try{
        const ensureBeforeV161=ensureThemeBuilderModal;
        ensureThemeBuilderModal=function(){const modal=ensureBeforeV161.apply(this,arguments);installFontsV161(modal);ensureBuilderAiControlsV161(modal);return modal};
    }catch{}
    try{
        const updateBeforeV161=updateThemeBuilderPreview;
        updateThemeBuilderPreview=function(modal){const result=updateBeforeV161.apply(this,arguments);try{const draft=getThemeBuilderDraft(modal);if(/^#[0-9a-f]{6}$/i.test(String(draft?.accent||'')))modal.style.setProperty('--theme-builder-control-accent-v161',draft.accent)}catch{}ensureSongAuditionV161(modal);refreshSongAuditionV161(modal);return result};
    }catch{}
    try{
        const renderBeforeV161=renderThemePicker;
        renderThemePicker=function(){const result=renderBeforeV161.apply(this,arguments);ensureThemeSearchPlusV161();ensureThemeAiEntryV161();return result};
    }catch{}
    try{
        const shortcutsBeforeV161=ensureGlobalShortcutsSection;
        ensureGlobalShortcutsSection=function(){const result=shortcutsBeforeV161.apply(this,arguments);fixShortcutV161();return result};
    }catch{}
    try{
        const settingsBeforeV161=openGlobalThemeSettings;
        openGlobalThemeSettings=function(){const result=settingsBeforeV161.apply(this,arguments);requestAnimationFrame(()=>{ensureThemeSearchPlusV161();ensureThemeAiEntryV161();fixShortcutV161()});return result};
    }catch{}

    // Stop audition + restore actual app cursor when leaving the editor.
    document.addEventListener('click',event=>{
        if(!event.target.closest?.('#theme-builder-modal .theme-builder-close,#theme-builder-modal .theme-builder-save,#theme-builder-modal .theme-builder-save-apply-v49,#theme-builder-modal .theme-builder-create-apply-v45'))return;
        const modal=document.getElementById('theme-builder-modal');stopSongAuditionV161(modal);setTimeout(()=>{try{applyCursorChoice?.()}catch{}},90);
    },true);

    requestAnimationFrame(()=>{
        recoverCursorsV161();
        ensureThemeSearchPlusV161();
        ensureThemeAiEntryV161();
        fixShortcutV161();
        const modal=document.getElementById('theme-builder-modal');if(modal){installFontsV161(modal);ensureBuilderAiControlsV161(modal)}
    });

    window.addEventListener('storage',event=>{
        if(event.key!==HIDDEN_CURSOR_KEY_V382)return;
        try{const hidden=JSON.parse(localStorage.getItem(HIDDEN_CURSOR_KEY_V382)||'[]');const set=new Set(Array.isArray(hidden)?hidden.map(String):[]);for(let i=CURSOR_OPTIONS.length-1;i>=0;i--){const id=String(CURSOR_OPTIONS[i]?.id||'');if(id!=='default'&&set.has(id))CURSOR_OPTIONS.splice(i,1)}renderCursorPicker?.();applyCursorChoice?.()}catch{}
    });

    window.__loggyThemeAiV161={prompt:aiPromptV161,importFile:importIntoEditorV161,registerCursor:registerCursorFromThemeV161};
})();

// ============================================================


// ============================================================================
// V326 — DECORATION PARITY / GLOBAL OPACITY OVERRIDES / CUSTOM FONT REGISTRY
// ============================================================================
(function(){
    if(window.__loggyThemeParityV326)return;window.__loggyThemeParityV326=true;
    const FONT_KEY='loggy-theme-custom-fonts-v326';
    function safeFontStack(stack){stack=String(stack||'').trim().slice(0,240);return !!stack&&!/[<>{};\n\r]/.test(stack)&&!/(?:url|@import|expression)\s*\(/i.test(stack)}
    try{
        const rows=JSON.parse(localStorage.getItem(FONT_KEY)||'[]');
        (Array.isArray(rows)?rows:[]).forEach(row=>{const id=String(row?.id||''),stack=String(row?.stack||'');if(/^theme-font-v326-[a-z0-9-]+$/.test(id)&&safeFontStack(stack))CUSTOM_THEME_FONT_STACKS[id]=stack});
    }catch{}

    function hidden(a){return a?.hiddenOnScreenV63===true||a?.hidden===true||a?.visible===false||a?.showOnScreen===false}
    function alwaysShowV370(a){return a?.alwaysShowOnScreenV370===true}
    function assets(theme){return (Array.isArray(theme?.backgroundSvgs)?theme.backgroundSvgs:[]).filter(Boolean)}
    function points(theme,count){
        const mode=String(theme?.svgDistribution||'random');
        const slots=Array.isArray(theme?.manualPlacementSlotsV40)?theme.manualPlacementSlotsV40:[];
        const out=[];
        const hash=(i,a,b)=>((i*a+b)%1000)/1000;
        for(let i=0;i<count;i++){
            if(mode==='manual-fixed'&&slots[i]){out.push({x:+slots[i].x||50,y:+slots[i].y||50});continue}
            if(mode==='corners'){const c=[[10,10],[90,10],[10,90],[90,90],[50,10],[50,90],[10,50],[90,50]][i%8];out.push({x:c[0],y:c[1]});continue}
            if(mode==='center-cluster'){const ang=(i*2.3999632297),r=10+(i%5)*4;out.push({x:50+Math.cos(ang)*r,y:50+Math.sin(ang)*r});continue}
            if(mode==='side-fixed'){out.push({x:i%2?92:8,y:12+((i*19)%76)});continue}
            if(mode==='side-random'){out.push({x:i%2?94:6,y:8+hash(i,317,113)*84});continue}
            if(mode==='top-bottom'){out.push({x:8+hash(i,277,91)*84,y:i%2?93:7});continue}
            if(mode==='all-edges-random'){const e=i%4,t=7+hash(i,353,137)*86;out.push(e===0?{x:t,y:7}:e===1?{x:93,y:t}:e===2?{x:t,y:93}:{x:7,y:t});continue}
            const wide=mode==='wide-random';
            out.push({x:(wide?4:8)+hash(i,311,109)*(wide?92:84),y:(wide?5:8)+hash(i,467,191)*(wide?90:84)});
        }
        if(theme?.reduceDecorationOverlapV361===true&&theme?.preventDecorationOverlapV367!==true&&out.length>1){
            const scale=Math.max(.5,Math.min(2.2,Number(theme?.svgGlobalScale??100)/100));
            const minDist=Math.max(8,Math.min(18,10*scale));
            for(let pass=0;pass<18;pass++){
                let moved=false;
                for(let i=0;i<out.length;i++)for(let j=i+1;j<out.length;j++){
                    let dx=out[j].x-out[i].x,dy=out[j].y-out[i].y,dist=Math.hypot(dx,dy);
                    if(dist>=minDist)continue;
                    if(dist<.001){const ang=((i+1)*2.3999632297+(j+1)*.73);dx=Math.cos(ang);dy=Math.sin(ang);dist=1}
                    const push=(minDist-dist)/2+.12,nx=dx/dist,ny=dy/dist;
                    out[i].x-=nx*push;out[i].y-=ny*push;out[j].x+=nx*push;out[j].y+=ny*push;
                    out[i].x=Math.max(3,Math.min(97,out[i].x));out[i].y=Math.max(4,Math.min(96,out[i].y));
                    out[j].x=Math.max(3,Math.min(97,out[j].x));out[j].y=Math.max(4,Math.min(96,out[j].y));moved=true;
                }
                if(!moved)break;
            }
        }
        return out;
    }
    function effectiveOpacity(theme,a){
        const global=Math.max(0,Math.min(100,Number(theme?.decorationsOpacityV117??100)));
        const own=Math.max(0,Math.min(100,Number(a?.opacityV109??a?.opacity??100)));
        return (a?.opacityOverrideV326===true?own:global)/100;
    }
    function strictPlanV371(stage,list,theme,pts){
        if(theme?.preventDecorationOverlapV367!==true)return null;
        const candidates=list.map((a,index)=>({a,index,p:pts[index]||{x:50,y:50}})).filter(r=>!hidden(r.a));
        if(!candidates.length)return{selected:new Set(),positions:new Map()};
        const rect=stage?.getBoundingClientRect?.()||{};
        const width=Math.max(520,stage?.clientWidth||rect.width||1280),height=Math.max(320,stage?.clientHeight||rect.height||760);
        const scale=Math.max(.5,Math.min(2.2,(Number(theme?.svgGlobalScale)||100)/100));
        // Preserve the selected distribution exactly. Strict mode solves
        // collisions by hiding optional decorations, never by shrinking them or
        // replacing distribution coordinates with artificial lanes.
        const footprint=Math.max(62,84*scale),margin=Math.max(8,12*scale);
        const collide=(a,b)=>{
            const dx=Math.abs((a.p.x-b.p.x)*width/100),dy=Math.abs((a.p.y-b.p.y)*height/100);
            return dx < footprint+margin && dy < footprint+margin;
        };
        const required=candidates.filter(r=>alwaysShowV370(r.a));
        const optional=candidates.filter(r=>!alwaysShowV370(r.a));
        const selected=[...required];
        // Keep as many optional decorations as possible. Least-conflicted
        // candidates are considered first, but their original distribution
        // points are never moved.
        optional.sort((a,b)=>{
            const ca=candidates.reduce((n,x)=>n+(x!==a&&collide(a,x)?1:0),0);
            const cb=candidates.reduce((n,x)=>n+(x!==b&&collide(b,x)?1:0),0);
            return ca-cb || a.index-b.index;
        });
        optional.forEach(candidate=>{if(!selected.some(kept=>collide(candidate,kept)))selected.push(candidate)});
        return{selected:new Set(selected.map(r=>r.index)),positions:new Map(candidates.map(r=>[r.index,r.p]))};
    }
    function clearLegacyStrictScaleV370(item){
        if(!item)return;
        if(item.dataset.noOverlapScaleV367==='1'){item.style.removeProperty('--theme-svg-global-scale');delete item.dataset.noOverlapScaleV367}
    }
    function setSuppressedV370(item,on){
        clearLegacyStrictScaleV370(item);
        if(on){item.style.setProperty('visibility','hidden','important');item.style.setProperty('pointer-events','none','important');item.dataset.noOverlapSuppressedV370='1'}
        else if(item.dataset.noOverlapSuppressedV370==='1'){item.style.removeProperty('visibility');item.style.removeProperty('pointer-events');delete item.dataset.noOverlapSuppressedV370}
    }
    function applyParity(theme){
        const stage=document.getElementById('custom-theme-background-stage');if(!stage)return;
        const list=assets(theme),items=Array.from(stage.querySelectorAll(':scope > .custom-theme-background-svg')).filter(x=>!x.dataset.themeCrossCloneV149&&!x.dataset.themeCrossCloneV94&&!x.dataset.themeCrossCloneV350);
        const count=Math.max(list.length,items.length),pts=points(theme,count),plan=strictPlanV371(stage,list,theme,pts);
        items.forEach((item,i)=>{const raw=Number(item.dataset.svgIndex),idx=Number.isFinite(raw)&&raw>=0&&raw<pts.length?raw:i,p=pts[idx]||{x:50,y:50},a=list[idx]||list[i]||{};const suppressed=!!(plan&&!plan.selected.has(idx));setSuppressedV370(item,suppressed);if(suppressed)return;const anim=String(a?.animationOverride||theme?.svgDefaultAnimation||a?.animation||'float').trim()||'float';const y=p.y;if(anim==='cross-screen'||item.classList.contains('theme-cross-screen-v94')){
            // V374: Across Screen must inherit the chosen distribution before its
            // horizontal travel runtime takes ownership. Previously Y was only
            // written in strict no-overlap mode, so Organic Scatter was ignored.
            item.style.setProperty('top',`${Math.max(2,Math.min(98,y))}%`,'important');
            // Leave the distribution X available as the starting travel phase.
            // Once V350 is active it owns left continuously, so later parity passes
            // must not snap an already-moving decoration back to its seed point.
            if(item.dataset.v350Across!=='1')item.style.setProperty('left',`${Math.max(2,Math.min(98,p.x))}%`,'important');
            item.style.removeProperty('right');item.style.removeProperty('bottom');item.style.setProperty('opacity',String(effectiveOpacity(theme,a)),'important');return;
        }item.style.setProperty('left',`${Math.max(2,Math.min(98,p.x))}%`,'important');item.style.setProperty('top',`${Math.max(2,Math.min(98,y))}%`,'important');item.style.removeProperty('right');item.style.removeProperty('bottom');item.style.setProperty('opacity',String(effectiveOpacity(theme,a)),'important')});
    }
    function schedule(theme){applyParity(theme||{});requestAnimationFrame(()=>applyParity(theme||{}))}
    try{
        const before=mountCustomThemeBackgroundSvgsV2;
        mountCustomThemeBackgroundSvgsV2=function(theme={}){
            const safe={...(theme||{}),backgroundSvgs:(Array.isArray(theme?.backgroundSvgs)?theme.backgroundSvgs:[]).map(a=>({...a,animation:String(a?.animationOverride||theme?.svgDefaultAnimation||a?.animation||'float')}))};
            const r=before.call(this,safe);schedule(safe);return r;
        };
    }catch{}
    try{
        const before=applyCustomBuiltTheme;
        applyCustomBuiltTheme=function(theme=getCustomThemeSettings()){
            try{window.__loggyCustomAnimationV159?.register?.(theme,theme?.name)}catch{}
            try{
                const custom=theme?.customFontV326;
                if(custom&&typeof custom==='object'){
                    const id=String(custom.id||`theme-font-v326-${String(custom.label||theme?.name||'theme').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'').slice(0,52)}`);
                    const stack=String(custom.stack||'').trim().slice(0,240);
                    if(/^theme-font-v326-[a-z0-9-]+$/.test(id)&&safeFontStack(stack)){
                        CUSTOM_THEME_FONT_STACKS[id]=stack;theme.customFontV326={id,label:String(custom.label||theme?.name||'Custom Font').slice(0,80),stack};theme.font=id;
                    }
                }
            }catch{}
            const result=before.apply(this,arguments);
            try{
                document.body.classList.add('theme-custom-builder');
                const root=document.documentElement;
                root.style.setProperty('--border-radius',`${Math.max(0,Math.min(30,Number(theme?.radius??20)))}px`);
                const sh=Math.max(0,Math.min(12,Number(theme?.shadow??0)));root.style.setProperty('--custom-theme-shadow',`${sh}px ${sh}px 0 ${theme?.border||'#111111'}`);
                root.style.setProperty('--custom-theme-daily-bg-color',theme?.dailyLogBackgroundColor||theme?.surface||'#fff');
                root.style.setProperty('--custom-theme-daily-bg-opacity',theme?.dailyLogBackgroundEnabled?`${Math.max(0,Math.min(100,Number(theme?.dailyLogBackgroundOpacity??92)))}%`:'0%');
                root.style.setProperty('--custom-theme-content-backdrop-color',theme?.contentBackdropColor||theme?.surface||'#fff');
                root.style.setProperty('--custom-theme-content-backdrop-opacity',theme?.contentBackdropEnabled?`${Math.max(0,Math.min(100,Number(theme?.contentBackdropOpacity??92)))}%`:'0%');
                if(theme?.font&&CUSTOM_THEME_FONT_STACKS[theme.font])root.style.setProperty('--custom-theme-font',CUSTOM_THEME_FONT_STACKS[theme.font]);
            }catch{}
            schedule(theme);return result;
        };
    }catch{}
})();


// V375 — destroy Theme Builder intro-preview media on every preview switch.
(() => {
  'use strict';
  if (window.__themeBuilderIntroAudioCleanupV375) return;
  window.__themeBuilderIntroAudioCleanupV375 = true;
  const dispose = audio => {
    if (!audio) return;
    try { audio.pause(); } catch {}
    try { audio.currentTime = 0; } catch {}
    try { audio.removeAttribute?.('src'); } catch {}
    try { audio.src = ''; } catch {}
    try { audio.load?.(); } catch {}
  };
  try {
    const before = stopThemeBuilderIntroPreviewV10;
    if (typeof before === 'function' && !before.__v375HardDispose) {
      const fn = function (modal) {
        const old = modal?._themeBuilderIntroPreviewAudioV10 || null;
        const result = before.apply(this, arguments);
        dispose(old);
        return result;
      };
      fn.__v375HardDispose = true;
      stopThemeBuilderIntroPreviewV10 = fn;
    }
  } catch {}
})();
