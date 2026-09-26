// V162 — Q&A / Goals / Tables / KB Collections / Recommendations
//        Knowledge Base bulk tools + display labels + rating fields
//        reusable tab blueprints + final Theme Builder reliability fixes
// ============================================================
(function(){
    'use strict';

    const V162 = 'v162';
    const esc = value => {
        try { return escapeCustomHtml(String(value ?? '')); }
        catch { return String(value ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch])); }
    };
    const attr = value => esc(value).replace(/`/g, '&#096;');
    const deepClone = value => {
        try { return structuredClone(value); }
        catch { try { return JSON.parse(JSON.stringify(value)); } catch { return value; } }
    };
    const uid = prefix => {
        try { return customId(prefix); }
        catch { return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2,8)}`; }
    };
    const uniqueStrings = values => [...new Set((values || []).map(v => String(v || '').trim()).filter(Boolean))];
    const splitList = value => uniqueStrings(String(value || '').split(/[\n,;]+/));
    const clamp = (n, min, max) => Math.max(min, Math.min(max, Number(n) || 0));

    let saveTimerV162 = null;
    function scheduleSaveV162(delay = 300) {
        clearTimeout(saveTimerV162);
        saveTimerV162 = setTimeout(() => {
            saveTimerV162 = null;
            try { saveDb(); } catch {}
        }, delay);
    }

    function ensureSettingsV162() {
        db.settings ||= {};
        db.settings.customTabBlueprintsV162 ||= [];
        db.settings.builtInBlueprintStateV162 ||= {};
        db.settings.dailyRecommendationV162 ||= {
            enabled: false,
            paused: false,
            title: 'Daily Recommendation',
            mode: 'filter',
            categories: [],
            tags: [],
            learnedState: 'any',
            partsState: 'any',
            placeholderType: '',
            metadataJson: '',
            orderedItems: [],
            endBehavior: 'stop'
        };
        db.settings.dailyRecommendationV162.tagMode =
            String(db.settings.dailyRecommendationV162.tagMode || 'and').toLowerCase() === 'or' ? 'or' : 'and';
    }

    // ------------------------------------------------------------
    // Knowledge Base display labels remain separate from permanent IDs.
    // ------------------------------------------------------------
    function categoryForItemV162(itemId) {
        return String(db.phrase_meta?.[itemId]?.type || '');
    }
    function configForItemV162(itemId) {
        const category = categoryForItemV162(itemId);
        return db.settings?.categorySettings?.[category] || null;
    }
    function getKnowledgeDisplayLabelV162(itemId, context = 'everywhere') {
        const id = String(itemId ?? '');
        const config = configForItemV162(id);
        const fieldName = String(config?.displayFieldV162 || '').trim();
        const scope = config?.displayScopeV162 === 'kb' ? 'kb' : 'everywhere';
        if (!fieldName || fieldName === '__title__') return id;
        if (scope === 'kb' && context !== 'kb') return id;
        const value = db.phrase_meta?.[id]?.custom_fields?.[fieldName];
        if (value == null) return id;
        try {
            const fieldDef = getKnowledgeFieldDefs(categoryForItemV162(id)).find(field => field?.name === fieldName);
            // A pinned-image primary display is rendered visually on the card
            // by V171; never expose its JSON payload as the visible label.
            if (fieldDef?.kind === 'pinnedImage' || window.__loggyPinnedImageV169?.isPinnedValue?.(value)) return id;
        } catch {}
        const text = String(value).trim();
        return text || id;
    }
    window.getKnowledgeDisplayLabelV162 = getKnowledgeDisplayLabelV162;

    function ensureCategoryDisplayControlsV162() {
        const panel = document.getElementById('kb-category-config-panel');
        if (!panel || !activeCategorySettingTab) return;
        let section = panel.querySelector('.kb-display-label-settings-v162');
        if (!section) {
            section = document.createElement('div');
            section.className = 'modal-section kb-display-label-settings-v162';
            section.innerHTML = `
                <span class="field-label">Primary Display Label</span>
                <select class="kb-display-field-v162"></select>
                <span class="field-label">Display Scope</span>
                <select class="kb-display-scope-v162">
                    <option value="kb">Knowledge Base Only</option>
                    <option value="everywhere">Everywhere</option>
                </select>
                <p class="progress-hint">The item ID stays permanent. This only changes the label people see.</p>
            `;
            panel.prepend(section);
            section.querySelector('.kb-display-field-v162').addEventListener('change', event => {
                const cfg = getCategoryConfig(activeCategorySettingTab);
                cfg.displayFieldV162 = event.target.value;
                saveDb();
                try { renderPhrasesLibrary(document.getElementById('phrases-search-bar')?.value || ''); } catch {}
            });
            section.querySelector('.kb-display-scope-v162').addEventListener('change', event => {
                const cfg = getCategoryConfig(activeCategorySettingTab);
                cfg.displayScopeV162 = event.target.value === 'kb' ? 'kb' : 'everywhere';
                saveDb();
                try { renderPhrasesLibrary(document.getElementById('phrases-search-bar')?.value || ''); } catch {}
                try { if (currentDay && db.days?.[currentDay]) renderPhrases(db.days[currentDay].phrases || []); } catch {}
            });
        }
        const cfg = getCategoryConfig(activeCategorySettingTab);
        const select = section.querySelector('.kb-display-field-v162');
        const fields = Array.isArray(cfg?.fields) ? cfg.fields : [];
        select.innerHTML = `<option value="__title__">Original item title / ID</option>` + fields.map(field => {
            const name = typeof field === 'string' ? field : field?.name;
            return name ? `<option value="${attr(name)}">${esc(name)}</option>` : '';
        }).join('');
        select.value = cfg.displayFieldV162 || '__title__';
        section.querySelector('.kb-display-scope-v162').value = cfg.displayScopeV162 === 'kb' ? 'kb' : 'everywhere';
    }

    try {
        const before = renderSettings;
        renderSettings = function(...args) {
            const result = before.apply(this, args);
            ensureCategoryDisplayControlsV162();
            return result;
        };
    } catch {}

    try {
        const before = renderPhrasesLibrary;
        renderPhrasesLibrary = function(...args) {
            const result = before.apply(this, args);
            requestAnimationFrame(() => {
                document.querySelectorAll('#phrases-library-grid .phrase-card').forEach(card => {
                    const title = card.querySelector('.kb-library-item-title') || card.querySelector('.phrase-card-title') || card;
                    const current = String(card.dataset.kbItemIdV162 || title?.textContent || '').trim();
                    const id = card.dataset.kbItemIdV162 || (db.phrase_meta?.[current] ? current : '');
                    if (!id) return;
                    card.dataset.kbItemIdV162 = id;
                    if (title) {
                        const label = getKnowledgeDisplayLabelV162(id, 'kb');
                        // If the visible label is the item's original title, preserve
                        // placeholder presentation across reloads: \noun => NOUN.
                        // Custom primary-display fields remain plain text.
                        if (label === id && typeof placeholderTokenHtmlV56 === 'function' && label.includes('\\')) {
                            title.innerHTML = placeholderTokenHtmlV56(label);
                        } else {
                            title.textContent = label;
                        }
                    }
                });
            });
            return result;
        };
    } catch {}

    try {
        const before = renderPhrases;
        renderPhrases = function(phrases) {
            const result = before.apply(this, arguments);
            const ids = Array.isArray(phrases) ? phrases : [];
            document.querySelectorAll('#phrases-container .chip').forEach((chip, index) => {
                const id = ids[index];
                if (!id) return;
                chip.dataset.kbItemIdV162 = id;
                const title = chip.querySelector('.kb-day-item-title');
                if (title) {
                    const label = getKnowledgeDisplayLabelV162(id, 'everywhere');
                    // Keep pattern placeholders visually resolved after every render
                    // and reload while retaining the backslash form only in storage.
                    if (label === id && typeof placeholderTokenHtmlV56 === 'function' && label.includes('\\')) {
                        title.innerHTML = placeholderTokenHtmlV56(label);
                    } else {
                        title.textContent = label;
                    }
                }
            });
            return result;
        };
    } catch {}

    // ------------------------------------------------------------
    // Star rating custom field type.
    // ------------------------------------------------------------
    try {
        const before = normalizeKnowledgeField;
        normalizeKnowledgeField = function(field, index = 0, legacyConfig = {}) {
            const normalized = before.apply(this, arguments);
            if (field && typeof field === 'object' && field.kind === 'rating') {
                normalized.kind = 'rating';
                normalized.maxRating = clamp(field.maxRating || 5, 1, 10) || 5;
            }
            return normalized;
        };
    } catch {}

    function injectRatingFieldUiV162() {
        const modal = document.getElementById('kb-field-create-modal');
        const kinds = modal?.querySelector('#kb-field-create-kind');
        if (!modal || !kinds) return;
        if (!kinds.querySelector('[data-kind="rating"]')) {
            const button = document.createElement('button');
            button.type = 'button';
            button.className = 'kb-clean-icon-option kb-rating-kind-v162';
            button.dataset.kind = 'rating';
            button.dataset.tip = 'Star rating';
            button.setAttribute('aria-label', 'Star rating');
            button.innerHTML = '<i class="ph ph-star"></i>';
            kinds.appendChild(button);
            button.addEventListener('click', () => {
                pendingKnowledgeFieldKind = 'rating';
                kinds.querySelectorAll('[data-kind]').forEach(node => node.classList.toggle('selected', node === button));
                modal.querySelector('#kb-field-create-language-section')?.classList.add('hidden');
                syncRatingUiV162();
            });
        }
        let section = modal.querySelector('#kb-field-rating-max-v162');
        if (!section) {
            section = document.createElement('div');
            section.id = 'kb-field-rating-max-v162';
            section.className = 'modal-section hidden';
            section.innerHTML = `
                <span class="field-label">Maximum Rating</span>
                <input type="number" min="1" max="10" step="1" value="5" class="kb-rating-max-input-v162">
                <p class="progress-hint">1–10 stars supported. Five is the default.</p>
            `;
            const options = modal.querySelector('#kb-field-create-language-section');
            (options?.parentNode || modal.querySelector('.modal-box'))?.insertBefore(section, options || modal.querySelector('#kb-field-create-save'));
        }
        syncRatingUiV162();
    }
    function syncRatingUiV162() {
        const modal = document.getElementById('kb-field-create-modal');
        modal?.querySelector('#kb-field-rating-max-v162')?.classList.toggle('hidden', pendingKnowledgeFieldKind !== 'rating');
    }

    try {
        const before = ensureKnowledgeFieldCreateModal;
        ensureKnowledgeFieldCreateModal = function() {
            before.apply(this, arguments);
            injectRatingFieldUiV162();
        };
    } catch {}
    try {
        const before = openKnowledgeFieldCreateModal;
        openKnowledgeFieldCreateModal = function(fieldId = null) {
            ensureKnowledgeFieldCreateModal();
            const cfg = activeCategorySettingTab ? getCategoryConfig(activeCategorySettingTab) : null;
            const existing = fieldId ? cfg?.fields?.find(f => f.id === fieldId) : null;
            const result = before.apply(this, arguments);
            injectRatingFieldUiV162();
            const input = document.querySelector('#kb-field-create-modal .kb-rating-max-input-v162');
            if (input) input.value = clamp(existing?.maxRating || 5, 1, 10) || 5;
            syncRatingUiV162();
            return result;
        };
    } catch {}

    document.addEventListener('click', event => {
        const save = event.target.closest?.('#kb-field-create-save');
        if (!save || pendingKnowledgeFieldKind !== 'rating') return;
        const category = activeCategorySettingTab;
        const editingId = editingKnowledgeFieldId;
        const name = document.getElementById('kb-field-create-name')?.value.trim();
        const max = clamp(document.querySelector('#kb-field-create-modal .kb-rating-max-input-v162')?.value || 5, 1, 10) || 5;
        setTimeout(() => {
            try {
                const cfg = category ? getCategoryConfig(category) : null;
                const field = editingId
                    ? cfg?.fields?.find(entry => entry.id === editingId)
                    : cfg?.fields?.slice().reverse().find(entry => entry.kind === 'rating' && (!name || entry.name === name));
                if (!field) return;
                field.kind = 'rating';
                field.maxRating = max;
                saveDb();
            } catch {}
        }, 0);
    }, true);

    function ratingInputHtmlV162(field, value = '', mode = 'add') {
        const max = clamp(field?.maxRating || 5, 1, 10) || 5;
        const numeric = clamp(value || 0, 0, max);
        const cls = mode === 'edit' ? 'dynamic-edit-field' : 'dynamic-add-field';
        return `
            <div class="modal-section mt-10 kb-item-field kb-rating-field-v162" data-field-id="${attr(field.id)}">
                <div class="kb-item-field-label-row"><span class="field-label">${esc(field.name)}</span></div>
                <div class="kb-rating-input-v162" data-max="${max}">
                    ${Array.from({length:max}, (_,i) => `<button type="button" class="kb-rating-star-v162${i < numeric ? ' selected' : ''}" data-value="${i+1}" aria-label="${i+1} star${i ? 's' : ''}"><i class="ph${i < numeric ? '-fill' : ''} ph-star"></i></button>`).join('')}
                    <button type="button" class="kb-rating-clear-v162" title="Clear rating"><i class="ph ph-x"></i></button>
                    <input type="hidden" class="${cls}" data-key="${attr(field.name)}" value="${numeric || ''}">
                </div>
            </div>`;
    }
    try {
        const before = buildKnowledgeFieldInputHtml;
        buildKnowledgeFieldInputHtml = function(field, value = '', mode = 'add') {
            if (field?.kind === 'rating') return ratingInputHtmlV162(field, value, mode);
            return before.apply(this, arguments);
        };
    } catch {}
    try {
        const before = buildKnowledgeFieldDisplayHtml;
        buildKnowledgeFieldDisplayHtml = function(field, value = '') {
            if (field?.kind !== 'rating') return before.apply(this, arguments);
            const max = clamp(field?.maxRating || 5, 1, 10) || 5;
            const val = clamp(value || 0, 0, max);
            return `<div class="modal-section mt-10 kb-item-field kb-display-field kb-rating-display-field-v162"><div class="kb-item-field-label-row"><span class="field-label">${esc(field.name)}</span></div><div class="kb-rating-display-v162" aria-label="${val} out of ${max}">${Array.from({length:max}, (_,i)=>`<i class="ph${i < val ? '-fill' : ''} ph-star"></i>`).join('')}<span>${val}/${max}</span></div></div>`;
        };
    } catch {}

    document.addEventListener('click', event => {
        const star = event.target.closest?.('.kb-rating-star-v162');
        const clear = event.target.closest?.('.kb-rating-clear-v162');
        if (!star && !clear) return;
        const wrap = (star || clear).closest('.kb-rating-input-v162');
        const hidden = wrap?.querySelector('input[type="hidden"]');
        if (!wrap || !hidden) return;
        const max = Number(wrap.dataset.max || 5);
        const value = clear ? 0 : clamp(star.dataset.value, 0, max);
        hidden.value = value || '';
        wrap.querySelectorAll('.kb-rating-star-v162').forEach(btn => {
            const on = Number(btn.dataset.value) <= value;
            btn.classList.toggle('selected', on);
            const icon = btn.querySelector('i');
            icon?.classList.toggle('ph-fill', on);
        });
        hidden.dispatchEvent(new Event('input', {bubbles:true}));
        hidden.dispatchEvent(new Event('change', {bubbles:true}));
    });

    // ------------------------------------------------------------
    // Generic KB filters shared by Goals, collections, recommendations.
    // ------------------------------------------------------------
    function learnedItemSetV162() {
        const learned = new Set();
        Object.values(db.days || {}).forEach(day => (day?.phrases || []).forEach(id => learned.add(String(id))));
        return learned;
    }
    function tagsForItemV162(id) {
        try { if (typeof getKnowledgeItemTagsV55 === 'function') return getKnowledgeItemTagsV55(id).map(v => String(v).toLowerCase()); } catch {}
        const meta = db.phrase_meta?.[id] || {};
        return uniqueStrings([...(meta.tags || []), meta.type]).map(v => v.toLowerCase());
    }
    function parseMetadataFilterV162(raw) {
        if (!raw) return {};
        if (typeof raw === 'object') return raw;
        try { const parsed = JSON.parse(String(raw)); return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {}; }
        catch { return {}; }
    }
    function kbItemMatchesV162(id, filter = {}, learnedSet = learnedItemSetV162()) {
        const meta = db.phrase_meta?.[id] || {};
        const categories = uniqueStrings(filter.categories || []);
        if (categories.length && !categories.includes(String(meta.type || ''))) return false;
        const desiredTags = uniqueStrings(filter.tags || []).map(v => v.replace(/^#/, '').toLowerCase());
        const itemTags = tagsForItemV162(id).map(v => v.replace(/^#/, '').toLowerCase());
        if (desiredTags.length) {
            const mode = String(filter.tagMode || 'and').toLowerCase() === 'or' ? 'or' : 'and';
            const tagMatch = mode === 'or'
                ? desiredTags.some(tag => itemTags.includes(tag))
                : desiredTags.every(tag => itemTags.includes(tag));
            if (!tagMatch) return false;
        }
        if (filter.learnedState === 'learned' && !learnedSet.has(String(id))) return false;
        if (filter.learnedState === 'unlearned' && learnedSet.has(String(id))) return false;
        const hasParts = Array.isArray(meta.parts) && meta.parts.length > 0;
        if (filter.partsState === 'with' && !hasParts) return false;
        if (filter.partsState === 'without' && hasParts) return false;
        const placeholder = String(filter.placeholderType || '').trim().replace(/[{}]/g, '').toLowerCase();
        if (placeholder) {
            const hay = `${id} ${Object.values(meta.custom_fields || {}).join(' ')} ${itemTags.join(' ')}`.toLowerCase();
            if (!hay.includes(`{${placeholder}}`) && !itemTags.includes(placeholder) && !String(meta.type || '').toLowerCase().includes(placeholder)) return false;
        }
        const metadata = parseMetadataFilterV162(filter.metadataJson || filter.metadata || {});
        for (const [key, wanted] of Object.entries(metadata)) {
            const actual = key === 'category' || key === 'type' ? meta.type : meta.custom_fields?.[key] ?? meta[key];
            if (String(actual ?? '').toLowerCase().indexOf(String(wanted ?? '').toLowerCase()) === -1) return false;
        }
        return true;
    }
    window.kbItemMatchesV162 = kbItemMatchesV162;

    // ------------------------------------------------------------
    // V686 — Custom Recommendation button
    // Replaces the old fixed #lazy-only recommendation behavior with one
    // configurable recommendation engine. Right-click the button to edit:
    // name, icon, categories, required tags, and per-category field filters.
    // ------------------------------------------------------------
    let lastLazyRecommendationV596 = '';
    let currentLazyRecommendationV597 = '';

    const lazyRecommendationIconsV686 = [
        'ph-moon-stars','ph-lightning','ph-star','ph-sparkle','ph-fire','ph-target','ph-brain','ph-book-open',
        'ph-graduation-cap','ph-pencil-simple','ph-note-pencil','ph-calculator','ph-function','ph-sigma','ph-pi',
        'ph-ruler','ph-flask','ph-atom','ph-globe','ph-map-trifold','ph-translate','ph-chats-circle','ph-question',
        'ph-question-mark','ph-lightbulb','ph-magnifying-glass','ph-puzzle-piece','ph-cards','ph-stack','ph-list-checks',
        'ph-check-circle','ph-arrow-clockwise','ph-shuffle','ph-dice-five','ph-magic-wand','ph-rocket','ph-trophy',
        'ph-medal','ph-heart','ph-smiley','ph-sun','ph-cloud','ph-plant','ph-tree','ph-mountains','ph-compass',
        'ph-clock','ph-calendar','ph-alarm','ph-coffee','ph-cookie','ph-fork-knife','ph-music-note','ph-headphones',
        'ph-camera','ph-paint-brush','ph-palette','ph-code','ph-terminal','ph-chart-line','ph-chart-bar','ph-currency-dollar',
        'ph-briefcase','ph-wrench','ph-hammer','ph-gear','ph-flag','ph-bookmark','ph-tag','ph-hash'
    ];

    function lazyRecommendationSettingsV686() {
        db.settings ||= {};
        const raw = db.settings.lazyRecommendationV686;
        const base = {
            title: 'Lazy Day Recommendation',
            icon: 'ph-moon-stars',
            categories: [],
            tags: ['lazy'],
            tagMode: 'and',
            removeTagsOnLearn: ['lazy','hide'],
            fieldFilters: []
        };
        if (!raw || typeof raw !== 'object') {
            db.settings.lazyRecommendationV686 = base;
            return db.settings.lazyRecommendationV686;
        }
        raw.title = String(raw.title || base.title).trim() || base.title;
        raw.icon = String(raw.icon || base.icon).replace(/^ph\s+/, '').trim() || base.icon;
        raw.categories = uniqueStrings(raw.categories || []);
        raw.tags = uniqueStrings(raw.tags || []).map(tag => tag.replace(/^#/, '').trim()).filter(Boolean);
        raw.tagMode = String(raw.tagMode || 'and').toLowerCase() === 'or' ? 'or' : 'and';
        raw.removeTagsOnLearn = uniqueStrings(raw.removeTagsOnLearn ?? base.removeTagsOnLearn)
            .map(tag => String(tag || '').replace(/^#/, '').trim())
            .filter(Boolean);
        raw.fieldFilters = Array.isArray(raw.fieldFilters) ? raw.fieldFilters.map(row => ({
            category: String(row?.category || '').trim(),
            field: String(row?.field || '').trim(),
            contains: String(row?.contains || '').trim()
        })).filter(row => row.category && row.field) : [];
        return raw;
    }

    function lazyRecommendationCategoriesV686() {
        return uniqueStrings([
            ...(db.settings?.categories || []),
            ...Object.keys(db.settings?.categorySettings || {}),
            ...(db.phrases || []).map(id => String(db.phrase_meta?.[id]?.type || ''))
        ]);
    }

    function lazyRecommendationFieldsV686(category) {
        const names = [];
        try {
            (getKnowledgeFieldDefs(category) || []).forEach(field => {
                if (field?.name) names.push(String(field.name));
            });
        } catch {}
        try {
            const cfg = getCategoryConfig(category);
            (cfg?.fields || []).forEach((raw, index) => {
                const field = typeof normalizeKnowledgeField === 'function'
                    ? normalizeKnowledgeField(raw, index, cfg)
                    : raw;
                if (field?.name) names.push(String(field.name));
            });
        } catch {}
        return uniqueStrings(names);
    }

    function lazyRecommendationFieldValueV686(id, row) {
        if (row.field === '__title__') return String(id || '');
        return String(db.phrase_meta?.[id]?.custom_fields?.[row.field] ?? '');
    }

    function lazyDayCandidatesV596() {
        const settings = lazyRecommendationSettingsV686();
        const learned = learnedItemSetV162();
        const wantedCategories = new Set(settings.categories.map(String));
        const wantedTags = settings.tags.map(tag => String(tag).replace(/^#/, '').trim().toLowerCase()).filter(Boolean);

        return (db.phrases || []).filter(id => {
            const key = String(id);
            if (learned.has(key)) return false;

            const meta = db.phrase_meta?.[key] || {};
            const category = String(meta.type || '');
            if (wantedCategories.size && !wantedCategories.has(category)) return false;

            const itemTags = tagsForItemV162(key)
                .map(tag => String(tag || '').replace(/^#/, '').trim().toLowerCase())
                .filter(Boolean);
            if (wantedTags.length) {
                const tagMatch = settings.tagMode === 'or'
                    ? wantedTags.some(tag => itemTags.includes(tag))
                    : wantedTags.every(tag => itemTags.includes(tag));
                if (!tagMatch) return false;
            }

            for (const row of settings.fieldFilters) {
                if (row.category && category !== row.category) return false;
                const value = lazyRecommendationFieldValueV686(key, row).trim();
                if (!value) return false;
                const wanted = String(row.contains || '').trim().toLowerCase();
                if (wanted && !value.toLowerCase().includes(wanted)) return false;
            }
            return true;
        });
    }

    function applyLazyRecommendationButtonV686(trigger, panel) {
        const settings = lazyRecommendationSettingsV686();
        if (trigger) {
            trigger.title = settings.title;
            trigger.setAttribute('aria-label', settings.title);
            trigger.innerHTML = `<i class="ph ${attr(settings.icon)}"></i>`;
        }
        if (panel) {
            const label = panel.querySelector('.lazy-day-recommendation-copy-v596 small');
            const icon = panel.querySelector('.lazy-day-recommendation-icon-v596 i');
            if (label) label.textContent = settings.title;
            if (icon) icon.className = `ph ${settings.icon}`;
        }
    }

    function closeLazyRecommendationSettingsV686() {
        document.getElementById('lazy-recommendation-settings-v686')?.remove();
    }

    function openLazyRecommendationSettingsV686() {
        closeLazyRecommendationSettingsV686();
        const settings = deepClone(lazyRecommendationSettingsV686());
        const categories = lazyRecommendationCategoriesV686();
        const modal = document.createElement('div');
        modal.id = 'lazy-recommendation-settings-v686';
        modal.className = 'modal-overlay lazy-recommendation-settings-v686';
        modal.innerHTML = `
            <div class="modal-box lazy-recommendation-settings-box-v686" role="dialog" aria-modal="true" aria-label="Recommendation Settings">
                <div class="modal-header">
                    <h2>Recommendation Settings</h2>
                    <button type="button" class="small-icon-btn lazy-recommendation-close-v686" title="Close" aria-label="Close"><i class="ph ph-x"></i></button>
                </div>

                <div class="modal-section">
                    <span class="field-label">Button name</span>
                    <input type="text" class="lazy-recommendation-name-v686" value="${attr(settings.title)}" placeholder="Recommendation name">
                    <p class="progress-hint">This is the name shown when you hover the recommendation button.</p>
                </div>

                <div class="modal-section">
                    <span class="field-label">Icon</span>
                    <div class="lazy-recommendation-icon-search-v686">
                        <i class="ph ph-magnifying-glass"></i>
                        <input type="search" class="lazy-recommendation-icon-query-v686" placeholder="Search icons…" autocomplete="off">
                    </div>
                    <div class="lazy-recommendation-icon-grid-v686"></div>
                </div>

                <div class="modal-section">
                    <span class="field-label">Categories <small>(optional)</small></span>
                    <p class="progress-hint">Leave all unchecked to allow items from any category.</p>
                    <div class="lazy-recommendation-category-grid-v686">
                        ${categories.length ? categories.map(category => `
                            <label class="lazy-recommendation-check-v686">
                                <input type="checkbox" value="${attr(category)}" ${settings.categories.includes(category) ? 'checked' : ''}>
                                <span>${esc(category)}</span>
                            </label>`).join('') : '<small>No categories exist yet.</small>'}
                    </div>
                </div>

                <div class="modal-section">
                    <span class="field-label">Required tags <small>(optional)</small></span>
                    <div class="lazy-recommendation-tag-rule-v689">
                        <input type="text" class="lazy-recommendation-tags-v686" value="${attr((settings.tags || []).join(', '))}" placeholder="lazy, 2.1">
                        <select class="lazy-recommendation-tag-mode-v689" aria-label="Tag matching rule">
                            <option value="and" ${settings.tagMode === 'or' ? '' : 'selected'}>AND</option>
                            <option value="or" ${settings.tagMode === 'or' ? 'selected' : ''}>OR</option>
                        </select>
                    </div>
                    <p class="progress-hint"><strong>AND</strong> requires every tag. <strong>OR</strong> requires at least one tag.</p>
                </div>

                <div class="modal-section">
                    <span class="field-label">Remove tags after adding to Items Learned <small>(optional)</small></span>
                    <input type="text" class="lazy-recommendation-remove-tags-v688" value="${attr((settings.removeTagsOnLearn || []).join(', '))}" placeholder="lazy, hide">
                    <p class="progress-hint">Separate tags with commas. Only these tags are removed when you accept a recommendation. Leave blank to keep every tag.</p>
                </div>

                <div class="modal-section">
                    <div class="lazy-recommendation-fields-head-v686">
                        <div>
                            <span class="field-label">Field filters <small>(optional)</small></span>
                            <p class="progress-hint">Require a field to contain something, or type text it must contain.</p>
                        </div>
                        <button type="button" class="small-icon-btn lazy-recommendation-add-field-v686" title="Add field filter"><i class="ph ph-plus"></i></button>
                    </div>
                    <div class="lazy-recommendation-field-list-v686"></div>
                </div>

                <div class="lazy-recommendation-match-summary-v686"></div>

                <div class="modal-actions lazy-recommendation-actions-footer-v686">
                    <button type="button" class="icon-btn lazy-recommendation-save-v686"><i class="ph ph-check"></i> Save</button>
                </div>
            </div>`;
        document.body.appendChild(modal);

        const iconGrid = modal.querySelector('.lazy-recommendation-icon-grid-v686');
        const iconQuery = modal.querySelector('.lazy-recommendation-icon-query-v686');
        const fieldList = modal.querySelector('.lazy-recommendation-field-list-v686');
        const summary = modal.querySelector('.lazy-recommendation-match-summary-v686');
        let selectedIcon = settings.icon;
        let draftRows = settings.fieldFilters.map(row => ({...row}));

        function renderIcons(query = '') {
            const q = String(query || '').trim().toLowerCase().replace(/^ph-/, '');
            const visible = lazyRecommendationIconsV686.filter(icon => !q || icon.replace(/^ph-/, '').includes(q));
            iconGrid.innerHTML = visible.map(icon => `
                <button type="button" class="lazy-recommendation-icon-option-v686 ${icon === selectedIcon ? 'selected' : ''}" data-icon="${attr(icon)}" title="${attr(icon.replace(/^ph-/, '').replace(/-/g, ' '))}">
                    <i class="ph ${attr(icon)}"></i>
                </button>`).join('') || '<small>No icons found.</small>';
            iconGrid.querySelectorAll('[data-icon]').forEach(button => button.onclick = () => {
                selectedIcon = button.dataset.icon;
                renderIcons(iconQuery.value);
            });
        }

        function categoryOptions(selected) {
            return categories.map(category => `<option value="${attr(category)}" ${category === selected ? 'selected' : ''}>${esc(category)}</option>`).join('');
        }

        function renderFieldRows() {
            fieldList.innerHTML = draftRows.map((row, index) => {
                const fields = lazyRecommendationFieldsV686(row.category);
                const fieldOptions = [
                    {name:'__title__', label:'Title'},
                    ...fields.map(name => ({name, label:name}))
                ];
                if (!fieldOptions.some(field => field.name === row.field)) row.field = fieldOptions[0]?.name || '__title__';
                return `
                    <div class="lazy-recommendation-field-row-v686" data-index="${index}">
                        <select class="lazy-recommendation-field-category-v686" aria-label="Category">${categoryOptions(row.category)}</select>
                        <select class="lazy-recommendation-field-name-v686" aria-label="Field">
                            ${fieldOptions.map(field => `<option value="${attr(field.name)}" ${field.name === row.field ? 'selected' : ''}>${esc(field.label)}</option>`).join('')}
                        </select>
                        <input type="text" class="lazy-recommendation-field-contains-v686" value="${attr(row.contains)}" placeholder="Contains… (optional)">
                        <button type="button" class="small-icon-btn lazy-recommendation-remove-field-v686" title="Remove filter"><i class="ph ph-x"></i></button>
                    </div>`;
            }).join('') || '<div class="lazy-recommendation-no-fields-v686">No field filters. Any field values are allowed.</div>';

            fieldList.querySelectorAll('.lazy-recommendation-field-row-v686').forEach(rowEl => {
                const index = Number(rowEl.dataset.index);
                const categorySelect = rowEl.querySelector('.lazy-recommendation-field-category-v686');
                const fieldSelect = rowEl.querySelector('.lazy-recommendation-field-name-v686');
                const containsInput = rowEl.querySelector('.lazy-recommendation-field-contains-v686');
                categorySelect.onchange = () => {
                    draftRows[index].category = categorySelect.value;
                    draftRows[index].field = lazyRecommendationFieldsV686(categorySelect.value)[0] || '__title__';
                    renderFieldRows();
                    updateSummary();
                };
                fieldSelect.onchange = () => { draftRows[index].field = fieldSelect.value; updateSummary(); };
                containsInput.oninput = () => { draftRows[index].contains = containsInput.value; updateSummary(); };
                rowEl.querySelector('.lazy-recommendation-remove-field-v686').onclick = () => {
                    draftRows.splice(index, 1);
                    renderFieldRows();
                    updateSummary();
                };
            });
        }

        function draftSettings() {
            return {
                title: modal.querySelector('.lazy-recommendation-name-v686').value.trim() || 'Recommendation',
                icon: selectedIcon || 'ph-moon-stars',
                categories: [...modal.querySelectorAll('.lazy-recommendation-category-grid-v686 input:checked')].map(input => input.value),
                tags: splitList(modal.querySelector('.lazy-recommendation-tags-v686').value).map(tag => tag.replace(/^#/, '')),
                tagMode: modal.querySelector('.lazy-recommendation-tag-mode-v689')?.value === 'or' ? 'or' : 'and',
                removeTagsOnLearn: splitList(modal.querySelector('.lazy-recommendation-remove-tags-v688').value).map(tag => tag.replace(/^#/, '')),
                fieldFilters: draftRows.map(row => ({
                    category: String(row.category || '').trim(),
                    field: String(row.field || '').trim(),
                    contains: String(row.contains || '').trim()
                })).filter(row => row.category && row.field)
            };
        }

        function matchingCountForDraftV686(draft) {
            const learned = learnedItemSetV162();
            const categoriesSet = new Set(draft.categories);
            const tags = draft.tags.map(tag => tag.toLowerCase());
            return (db.phrases || []).filter(id => {
                const key = String(id);
                if (learned.has(key)) return false;
                const meta = db.phrase_meta?.[key] || {};
                const category = String(meta.type || '');
                if (categoriesSet.size && !categoriesSet.has(category)) return false;
                const itemTags = tagsForItemV162(key).map(tag => String(tag).replace(/^#/, '').trim().toLowerCase());
                if (tags.length) {
                    const tagMatch = draft.tagMode === 'or'
                        ? tags.some(tag => itemTags.includes(tag))
                        : tags.every(tag => itemTags.includes(tag));
                    if (!tagMatch) return false;
                }
                return draft.fieldFilters.every(row => {
                    if (category !== row.category) return false;
                    const value = lazyRecommendationFieldValueV686(key, row).trim();
                    if (!value) return false;
                    return !row.contains || value.toLowerCase().includes(row.contains.toLowerCase());
                });
            }).length;
        }

        function updateSummary() {
            const count = matchingCountForDraftV686(draftSettings());
            summary.innerHTML = `<strong>${count}</strong> unlearned KB item${count === 1 ? '' : 's'} currently match these filters.`;
        }

        iconQuery.oninput = () => renderIcons(iconQuery.value);
        modal.querySelector('.lazy-recommendation-name-v686').oninput = updateSummary;
        modal.querySelector('.lazy-recommendation-tags-v686').oninput = updateSummary;
        modal.querySelector('.lazy-recommendation-tag-mode-v689').onchange = updateSummary;
        modal.querySelector('.lazy-recommendation-remove-tags-v688').oninput = updateSummary;
        modal.querySelectorAll('.lazy-recommendation-category-grid-v686 input').forEach(input => input.onchange = updateSummary);
        modal.querySelector('.lazy-recommendation-add-field-v686').onclick = () => {
            const category = categories[0] || '';
            if (!category) return;
            draftRows.push({category, field:lazyRecommendationFieldsV686(category)[0] || '__title__', contains:''});
            renderFieldRows();
            updateSummary();
        };
        modal.querySelector('.lazy-recommendation-close-v686').onclick = closeLazyRecommendationSettingsV686;
        modal.addEventListener('click', event => { if (event.target === modal) closeLazyRecommendationSettingsV686(); });
        modal.querySelector('.lazy-recommendation-save-v686').onclick = async () => {
            db.settings.lazyRecommendationV686 = draftSettings();
            currentLazyRecommendationV597 = '';
            lastLazyRecommendationV596 = '';
            try { await saveDb(); } catch {}
            const panel = document.getElementById('lazy-day-recommendation-v596');
            const trigger = document.getElementById('lazy-day-recommendation-btn-v596');
            applyLazyRecommendationButtonV686(trigger, panel);
            if (panel && !panel.classList.contains('hidden')) showLazyDayRecommendationV596();
            closeLazyRecommendationSettingsV686();
        };

        renderIcons();
        renderFieldRows();
        updateSummary();
        setTimeout(() => modal.querySelector('.lazy-recommendation-name-v686')?.focus(), 0);
    }

    function ensureLazyDayUiV596() {
        const section = document.getElementById('phrases-container')?.closest?.('section');
        if (!section) return null;

        const actions = section.querySelector('.section-header > div:last-child');
        let trigger = document.getElementById('lazy-day-recommendation-btn-v596');

        if (!trigger && actions) {
            trigger = document.createElement('button');
            trigger.id = 'lazy-day-recommendation-btn-v596';
            trigger.type = 'button';
            trigger.className = 'small-icon-btn';
            actions.prepend(trigger);
        }

        let panel = document.getElementById('lazy-day-recommendation-v596');
        if (!panel) {
            panel = document.createElement('div');
            panel.id = 'lazy-day-recommendation-v596';
            panel.className = 'lazy-day-recommendation-v596 hidden';
            panel.setAttribute('aria-live', 'polite');
            panel.innerHTML = `
                <button type="button" class="lazy-day-recommendation-main-v596">
                    <span class="lazy-day-recommendation-icon-v596"><i class="ph ph-moon-stars"></i></span>
                    <span class="lazy-day-recommendation-copy-v596">
                        <small>Lazy Day Recommendation</small>
                        <span class="lazy-day-recommendation-value-v596"></span>
                        <em class="lazy-day-recommendation-meta-v596"></em>
                    </span>
                </button>
                <div class="lazy-day-recommendation-actions-v597">
                    <button type="button" class="small-icon-btn lazy-day-recommendation-skip-v597" title="Skip and show another" aria-label="Skip recommendation"><i class="ph ph-skip-forward"></i></button>
                    <button type="button" class="small-icon-btn lazy-day-recommendation-learned-v597" title="Add to Items Learned" aria-label="Add recommendation to Items Learned"><i class="ph ph-check"></i></button>
                </div>`;
            const input = section.querySelector('#phrase-input-group');
            if (input) input.insertAdjacentElement('beforebegin', panel);
            else section.querySelector('.section-header')?.insertAdjacentElement('afterend', panel);
        }

        applyLazyRecommendationButtonV686(trigger, panel);

        if (trigger && trigger.dataset.lazyDayBoundV686 !== '1') {
            trigger.dataset.lazyDayBoundV686 = '1';
            trigger.addEventListener('click', event => {
                event.preventDefault();
                if (!panel.classList.contains('hidden')) {
                    panel.classList.add('hidden');
                    return;
                }
                if (currentLazyRecommendationV597) {
                    panel.classList.remove('hidden');
                    return;
                }
                showLazyDayRecommendationV596();
            });
            trigger.addEventListener('contextmenu', event => {
                event.preventDefault();
                event.stopPropagation();
                if (typeof showCustomItemContextMenu === 'function') {
                    showCustomItemContextMenu(event.clientX, event.clientY, [{
                        label: 'Edit filters',
                        icon: 'ph-sliders-horizontal',
                        action: openLazyRecommendationSettingsV686
                    }]);
                } else {
                    openLazyRecommendationSettingsV686();
                }
            });
        }

        const skip = panel.querySelector('.lazy-day-recommendation-skip-v597');
        if (skip && skip.dataset.lazyDayBoundV597 !== '1') {
            skip.dataset.lazyDayBoundV597 = '1';
            skip.addEventListener('click', event => {
                event.preventDefault();
                event.stopPropagation();
                showLazyDayRecommendationV596();
            });
        }

        const learned = panel.querySelector('.lazy-day-recommendation-learned-v597');
        if (learned && learned.dataset.lazyDayBoundV597 !== '1') {
            learned.dataset.lazyDayBoundV597 = '1';
            learned.addEventListener('click', async event => {
                event.preventDefault();
                event.stopPropagation();
                await acceptLazyDayRecommendationV597();
            });
        }

        return panel;
    }

    async function acceptLazyDayRecommendationV597() {
        const id = String(currentLazyRecommendationV597 || '');
        if (!id || !currentDay) return;

        db.days ||= {};
        db.days[currentDay] ||= { notes:'', phrases:[], tools:[], video:'', checkedParts:{} };
        db.days[currentDay].phrases ||= [];
        if (!db.days[currentDay].phrases.includes(id)) db.days[currentDay].phrases.push(id);

        // Recommendation-specific cleanup is fully configurable. Only the tags
        // chosen in Recommendation Settings are removed when an item is accepted.
        // All other source tags remain untouched.
        try {
            const meta = db.phrase_meta?.[id];
            const removeTags = new Set(
                (lazyRecommendationSettingsV686().removeTagsOnLearn || [])
                    .map(tag => String(tag || '').replace(/^#/, '').trim().toLowerCase())
                    .filter(Boolean)
            );
            if (meta && removeTags.size) {
                const tags = Array.isArray(meta.tags) ? meta.tags : [];
                meta.tags = tags.filter(tag => !removeTags.has(
                    String(tag || '').replace(/^#/, '').trim().toLowerCase()
                ));
            }
        } catch {}

        try { renderPhrases(db.days[currentDay].phrases); } catch {}
        try { populatePhrasesDatalist(); } catch {}
        try { renderPhrasesLibrary(document.getElementById('phrases-search-bar')?.value || ''); } catch {}
        try { await saveDb(); } catch {}
        try { showFeatureToast?.(`Added “${id}” to Items Learned.`); } catch {}

        currentLazyRecommendationV597 = '';
        showLazyDayRecommendationV596();
    }

    function showLazyDayRecommendationV596() {
        const panel = ensureLazyDayUiV596();
        if (!panel) return;

        const settings = lazyRecommendationSettingsV686();
        const candidates = lazyDayCandidatesV596();
        const value = panel.querySelector('.lazy-day-recommendation-value-v596');
        const meta = panel.querySelector('.lazy-day-recommendation-meta-v596');
        const main = panel.querySelector('.lazy-day-recommendation-main-v596');
        const actions = panel.querySelector('.lazy-day-recommendation-actions-v597');

        applyLazyRecommendationButtonV686(document.getElementById('lazy-day-recommendation-btn-v596'), panel);
        if (main) main.onclick = null;
        panel.classList.remove('hidden');

        if (!candidates.length) {
            lastLazyRecommendationV596 = '';
            currentLazyRecommendationV597 = '';
            panel.classList.add('lazy-day-empty-v623');
            if (value) value.textContent = 'No unlearned Knowledge Base items match your recommendation filters.';
            if (meta) meta.textContent = 'Right-click the recommendation button to edit filters.';
            if (actions) actions.hidden = true;
            return;
        }

        panel.classList.remove('lazy-day-empty-v623');
        if (actions) actions.hidden = false;

        let pool = candidates;
        if (candidates.length > 1 && lastLazyRecommendationV596) {
            const withoutLast = candidates.filter(id => String(id) !== lastLazyRecommendationV596);
            if (withoutLast.length) pool = withoutLast;
        }

        const id = String(pool[Math.floor(Math.random() * pool.length)]);
        lastLazyRecommendationV596 = id;
        currentLazyRecommendationV597 = id;

        const display = getKnowledgeDisplayLabelV162(id, 'everywhere');
        const rawPattern = String(display) === id && id.includes('\\');
        if (value) {
            if (rawPattern && typeof placeholderTokenHtmlV56 === 'function') value.innerHTML = placeholderTokenHtmlV56(id);
            else value.textContent = display;
        }

        if (meta) {
            const tagText = settings.tags.length ? settings.tags.map(tag => `#${tag}`).join(' + ') : 'custom filters';
            meta.textContent = `${tagText} · ${candidates.length} unlearned item${candidates.length === 1 ? '' : 's'} available`;
        }
        main.onclick = () => openItemModal(id, true, false);
    }

    const bootLazyDayV596 = () => ensureLazyDayUiV596();
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', bootLazyDayV596, { once:true });
    else bootLazyDayV596();

    try {
        const beforeOpenDayV596 = openDayLog;
        if (typeof beforeOpenDayV596 === 'function' && !beforeOpenDayV596.__lazyDayV596) {
            const wrappedOpenDayV596 = function() {
                const result = beforeOpenDayV596.apply(this, arguments);
                requestAnimationFrame(ensureLazyDayUiV596);
                return result;
            };
            wrappedOpenDayV596.__lazyDayV596 = true;
            openDayLog = wrappedOpenDayV596;
        }
    } catch {}

    window.__loggyLazyDayV596 = {
        candidates: lazyDayCandidatesV596,
        recommend: showLazyDayRecommendationV596,
        accept: acceptLazyDayRecommendationV597,
        settings: openLazyRecommendationSettingsV686
    };

    if (typeof window.__loggyShowHiddenKbItemsV597 !== 'boolean') {
        window.__loggyShowHiddenKbItemsV597 = false;
    }

    function setShowHiddenKbItemsV597(show) {
        window.__loggyShowHiddenKbItemsV597 = show === true;
        try {
            db.settings ||= {};
            if (db.settings.knowledgeHideTagsV557 === undefined) db.settings.knowledgeHideTagsV557 = true;
            document.documentElement.classList.toggle('kb-hide-item-tags-v557', !!db.settings.knowledgeHideTagsV557);
        } catch {}

        try {
            renderPhrasesLibrary(
                document.getElementById('phrases-search-bar')?.value || ''
            );
        } catch {}

        try {
            showFeatureToast?.(
                window.__loggyShowHiddenKbItemsV597
                    ? 'Showing #hide Knowledge Base items.'
                    : 'Hiding #hide Knowledge Base items.'
            );
        } catch {}
    }

    // ------------------------------------------------------------
    // Add component types.
    // ------------------------------------------------------------
    function addComponentDefV162(type, label, icon, after = null) {
        if (CUSTOM_COMPONENT_LIBRARY.some(def => def.type === type)) return;
        const def = {type, label, icon};
        const index = after ? CUSTOM_COMPONENT_LIBRARY.findIndex(d => d.type === after) : -1;
        CUSTOM_COMPONENT_LIBRARY.splice(index >= 0 ? index + 1 : CUSTOM_COMPONENT_LIBRARY.length, 0, def);
    }
    try {
        addComponentDefV162('qaV162', 'Q&A', 'ph-question', 'text');
        addComponentDefV162('goalsV162', 'Goals', 'ph-target', 'progressMeter');
        addComponentDefV162('tableV162', 'Table', 'ph-table', 'goalsV162');
        addComponentDefV162('kbDynamicCollectionV162', 'Dynamic Collection', 'ph-stack', 'tableV162');
    } catch {}

    try {
        const before = defaultCustomComponent;
        defaultCustomComponent = function(type) {
            if (type === 'qaV162') return {id:uid('component'), type, title:'Q&A', titleBackground:'none', items:[]};
            if (type === 'goalsV162') return {id:uid('component'), type, title:'Goals', titleBackground:'none', goals:[]};
            if (type === 'tableV162') {
                const c1 = uid('col'), c2 = uid('col');
                return {id:uid('component'), type, title:'Table', titleBackground:'none', columns:[{id:c1,name:'Column 1'},{id:c2,name:'Column 2'}], rows:[{id:uid('row'),cells:{[c1]:'',[c2]:''}}]};
            }
            if (type === 'kbDynamicCollectionV162') return {id:uid('component'), type, title:'Dynamic Collection', titleBackground:'none', display:'cards', categories:[], tags:[], learnedState:'any', partsState:'any', placeholderType:'', metadataJson:''};
            return before.apply(this, arguments);
        };
    } catch {}

    // ------------------------------------------------------------
    // Q&A component.
    // ------------------------------------------------------------
    function ensureQaReferencesV162(item) {
        item.references ||= [];
        return item.references;
    }
    function addQaReferenceV162(item, day, kind = 'discussed') {
        if (!item || !day) return;
        const refs = ensureQaReferencesV162(item);
        const existing = refs.find(ref => Number(ref.day) === Number(day));
        if (existing) {
            if (kind === 'answered') existing.kind = 'answered';
            existing.updatedAt = new Date().toISOString();
        } else refs.push({day:Number(day), kind, updatedAt:new Date().toISOString()});
    }
    async function addQuestionV162(tab, component, fromDay = null) {
        const values = await showAppFormModal({
            title:'New Question', submitLabel:'Add Question', fields:[
                {name:'question', label:'Question', value:''},
                {name:'answer', label:'Answer (optional)', type:'textarea', value:''}
            ]
        });
        if (!values || !String(values.question || '').trim()) return null;
        const item = {id:uid('question'), question:String(values.question).trim(), answer:String(values.answer || ''), references:[], createdAt:new Date().toISOString()};
        if (fromDay) addQaReferenceV162(item, fromDay, item.answer.trim() ? 'answered' : 'discussed');
        component.items ||= [];
        component.items.push(item);
        saveDb();
        try { renderCustomTabView(tab.id); } catch {}
        return item;
    }
    function renderQaV162(tab, component, content) {
        component.items ||= [];
        content.innerHTML = `
            <div class="custom-collection-header qa-header-v162"><h2>${esc(component.title || 'Q&A')}</h2><button type="button" class="small-icon-btn qa-add-v162"><i class="ph ph-plus"></i> Question</button></div>
            <div class="qa-list-v162"></div>`;
        content.querySelector('.qa-add-v162').addEventListener('click', () => addQuestionV162(tab, component));
        const list = content.querySelector('.qa-list-v162');
        component.items.forEach(item => {
            const card = document.createElement('article');
            card.className = 'qa-card-v162 custom-searchable-item';
            card.dataset.customItemId = item.id;
            card.dataset.searchText = `${item.question || ''} ${item.answer || ''}`.toLowerCase();
            const refs = ensureQaReferencesV162(item);
            card.innerHTML = `
                <div class="qa-question-row-v162"><strong>${esc(item.question || 'Untitled question')}</strong><div class="qa-card-actions-v162"><button type="button" class="small-icon-btn qa-edit-question-v162" title="Edit question"><i class="ph ph-pencil-simple"></i></button><button type="button" class="small-icon-btn qa-delete-v162" title="Delete question"><i class="ph ph-trash"></i></button></div></div>
                <textarea class="qa-answer-v162" placeholder="Answer this question...">${esc(item.answer || '')}</textarea>
                <div class="qa-references-v162">${refs.length ? refs.sort((a,b)=>Number(a.day)-Number(b.day)).map(ref => `<button type="button" class="qa-day-ref-v162" data-day="${Number(ref.day)}"><i class="ph ph-calendar-blank"></i> Day ${Number(ref.day)}${ref.kind === 'answered' ? ' · answered' : ''}</button>`).join('') : '<span>No Daily Log references yet.</span>'}</div>`;
            const textarea = card.querySelector('.qa-answer-v162');
            textarea.addEventListener('input', () => { item.answer = textarea.value; scheduleSaveV162(); });
            textarea.addEventListener('blur', () => { item.answer = textarea.value; try { saveDb(); } catch {} });
            card.querySelector('.qa-edit-question-v162').addEventListener('click', async () => {
                const values = await showAppFormModal({title:'Edit Question', submitLabel:'Save', fields:[{name:'question',label:'Question',value:item.question || ''}]});
                if (!values || !String(values.question || '').trim()) return;
                item.question = String(values.question).trim(); saveDb(); renderCustomTabView(tab.id);
            });
            card.querySelector('.qa-delete-v162').addEventListener('click', () => {
                component.items = component.items.filter(entry => entry.id !== item.id);
                Object.values(db.days || {}).forEach(day => { if (Array.isArray(day.customTabLinks)) day.customTabLinks = day.customTabLinks.filter(link => link.itemId !== item.id); });
                saveDb(); renderCustomTabView(tab.id);
            });
            card.querySelectorAll('.qa-day-ref-v162').forEach(btn => btn.addEventListener('click', () => { try { openDayLog(Number(btn.dataset.day)); } catch {} }));
            list.appendChild(card);
        });
        if (!component.items.length) list.innerHTML = '<div class="custom-feature-empty-v162">No questions yet. Add one whenever something comes to mind.</div>';
    }

    // ------------------------------------------------------------
    // Goals component.
    // ------------------------------------------------------------
    function dayDateV162(dayNumber) {
        if (!db.startDate) return null;
        const d = new Date(`${db.startDate}T12:00:00`);
        if (Number.isNaN(d.getTime())) return null;
        d.setDate(d.getDate() + Number(dayNumber || 1) - 1);
        return d;
    }
    function goalAutoCountV162(goal) {
        if (!goal.autoEnabled) return 0;
        const learned = learnedItemSetV162();
        let count = 0;
        Object.entries(db.days || {}).forEach(([dayKey, day]) => {
            const date = dayDateV162(dayKey);
            if (date && goal.startDate) { const start = new Date(`${goal.startDate}T00:00:00`); if (date < start) return; }
            if (date && goal.endDate) { const end = new Date(`${goal.endDate}T23:59:59`); if (date > end) return; }
            (day?.phrases || []).forEach(id => {
                if (kbItemMatchesV162(id, {categories:goal.categories || [], tags:goal.tags || [], metadataJson:goal.metadataJson || ''}, learned)) count++;
            });
        });
        return count;
    }
    function goalCurrentV162(goal) {
        const manual = Number(goal.manualProgress || 0);
        return Math.max(0, manual + goalAutoCountV162(goal));
    }
    function ensureGoalModalV162() {
        if (document.getElementById('goal-config-modal-v162')) return;
        const modal = document.createElement('div');
        modal.id = 'goal-config-modal-v162'; modal.className = 'modal-overlay hidden';
        modal.innerHTML = `
            <div class="modal-box goal-config-box-v162">
              <div class="modal-header"><h2>Goal</h2><button type="button" class="small-icon-btn goal-close-v162"><i class="ph ph-x"></i></button></div>
              <div class="modal-section"><span class="field-label">Goal Name</span><input class="goal-name-v162" type="text"></div>
              <div class="goal-two-col-v162"><label><span class="field-label">Target</span><input class="goal-target-v162" type="number" min="1" value="10"></label><label><span class="field-label">Unit</span><input class="goal-unit-v162" type="text" value="items"></label></div>
              <div class="goal-two-col-v162"><label><span class="field-label">Start Date</span><input class="goal-start-v162" type="date"></label><label><span class="field-label">End Date</span><input class="goal-end-v162" type="date"></label></div>
              <label class="goal-auto-row-v162"><input class="goal-auto-v162" type="checkbox"> <span>Automatically count matching items added to Daily Logs</span></label>
              <div class="modal-section"><span class="field-label">Knowledge Base Categories</span><input class="goal-categories-v162" type="text" placeholder="Nouns, Chords"></div>
              <div class="modal-section"><span class="field-label">Tags</span><input class="goal-tags-v162" type="text" placeholder="practice, important"></div>
              <div class="modal-section"><span class="field-label">Other field filters (optional JSON)</span><textarea class="goal-metadata-v162" placeholder='{"Language":"Korean"}'></textarea></div>
              <button type="button" class="icon-btn goal-save-v162"><i class="ph ph-check"></i> Save Goal</button>
            </div>`;
        document.body.appendChild(modal);
        modal.querySelector('.goal-close-v162').onclick = () => modal.classList.add('hidden');
        modal.addEventListener('click', e => { if (e.target === modal) modal.classList.add('hidden'); });
    }
    function editGoalV162(tab, component, goal = null) {
        ensureGoalModalV162();
        const modal = document.getElementById('goal-config-modal-v162');
        const original = goal || {id:uid('goal'), name:'', target:10, unit:'items', manualProgress:0, autoEnabled:false, categories:[], tags:[], metadataJson:'', startDate:'', endDate:''};
        modal.querySelector('.modal-header h2').textContent = goal ? 'Edit Goal' : 'New Goal';
        modal.querySelector('.goal-name-v162').value = original.name || '';
        modal.querySelector('.goal-target-v162').value = original.target || 10;
        modal.querySelector('.goal-unit-v162').value = original.unit || 'items';
        modal.querySelector('.goal-start-v162').value = original.startDate || '';
        modal.querySelector('.goal-end-v162').value = original.endDate || '';
        modal.querySelector('.goal-auto-v162').checked = !!original.autoEnabled;
        modal.querySelector('.goal-categories-v162').value = (original.categories || []).join(', ');
        modal.querySelector('.goal-tags-v162').value = (original.tags || []).join(', ');
        modal.querySelector('.goal-metadata-v162').value = original.metadataJson || '';
        modal.querySelector('.goal-save-v162').onclick = () => {
            const name = modal.querySelector('.goal-name-v162').value.trim(); if (!name) return;
            const candidateJson = modal.querySelector('.goal-metadata-v162').value.trim();
            if (candidateJson) { try { JSON.parse(candidateJson); } catch { try{showFeatureToast('Other field filters must be valid JSON.')}catch{} return; } }
            Object.assign(original, {
                name,
                target: Math.max(1, Number(modal.querySelector('.goal-target-v162').value) || 1),
                unit: modal.querySelector('.goal-unit-v162').value.trim() || 'items',
                startDate: modal.querySelector('.goal-start-v162').value,
                endDate: modal.querySelector('.goal-end-v162').value,
                autoEnabled: modal.querySelector('.goal-auto-v162').checked,
                categories: splitList(modal.querySelector('.goal-categories-v162').value),
                tags: splitList(modal.querySelector('.goal-tags-v162').value).map(v => v.replace(/^#/, '')),
                metadataJson: candidateJson
            });
            component.goals ||= [];
            if (!goal) component.goals.push(original);
            saveDb(); modal.classList.add('hidden'); renderCustomTabView(tab.id);
        };
        modal.classList.remove('hidden'); requestAnimationFrame(() => modal.querySelector('.goal-name-v162').focus());
    }
    function renderGoalsV162(tab, component, content) {
        component.goals ||= [];
        content.innerHTML = `<div class="custom-collection-header"><h2>${esc(component.title || 'Goals')}</h2><button type="button" class="small-icon-btn goals-add-v162"><i class="ph ph-plus"></i> Goal</button></div><div class="goals-list-v162"></div>`;
        content.querySelector('.goals-add-v162').onclick = () => editGoalV162(tab, component, null);
        const list = content.querySelector('.goals-list-v162');
        component.goals.forEach(goal => {
            const current = goalCurrentV162(goal), target = Math.max(1, Number(goal.target) || 1), pct = Math.min(100, Math.round((current / target) * 100));
            const card = document.createElement('article'); card.className = 'goal-card-v162'; card.dataset.customItemId = goal.id;
            card.innerHTML = `
                <div class="goal-title-row-v162"><div><strong>${esc(goal.name || 'Goal')}</strong><small>${esc([goal.startDate && `from ${goal.startDate}`, goal.endDate && `to ${goal.endDate}`].filter(Boolean).join(' ') || 'No time period')}</small></div><div class="goal-card-actions-v162"><button type="button" class="small-icon-btn goal-edit-v162"><i class="ph ph-pencil-simple"></i></button><button type="button" class="small-icon-btn goal-delete-v162"><i class="ph ph-trash"></i></button></div></div>
                <div class="goal-progress-copy-v162"><span>${current} / ${target} ${esc(goal.unit || 'items')}</span><strong>${pct}%</strong></div>
                <div class="progress-bar-track"><div class="progress-bar-fill" style="width:${pct}%"></div></div>
                <div class="goal-controls-v162"><button type="button" class="goal-minus-v162" aria-label="Decrease progress"><i class="ph ph-minus"></i></button><button type="button" class="goal-plus-v162" aria-label="Increase progress"><i class="ph ph-plus"></i></button>${goal.autoEnabled ? `<span class="goal-auto-badge-v162"><i class="ph ph-lightning"></i> ${goalAutoCountV162(goal)} automatic</span>` : '<span class="goal-auto-badge-v162">Manual</span>'}</div>`;
            card.querySelector('.goal-minus-v162').onclick = () => { goal.manualProgress = Number(goal.manualProgress || 0) - 1; saveDb(); renderCustomTabView(tab.id); };
            card.querySelector('.goal-plus-v162').onclick = () => { goal.manualProgress = Number(goal.manualProgress || 0) + 1; saveDb(); renderCustomTabView(tab.id); };
            card.querySelector('.goal-edit-v162').onclick = () => editGoalV162(tab, component, goal);
            card.querySelector('.goal-delete-v162').onclick = () => { component.goals = component.goals.filter(g => g.id !== goal.id); saveDb(); renderCustomTabView(tab.id); };
            list.appendChild(card);
        });
        if (!component.goals.length) list.innerHTML = '<div class="custom-feature-empty-v162">No goals yet.</div>';
    }

    // ------------------------------------------------------------
    // Table component.
    // ------------------------------------------------------------
    function renderTableV162(tab, component, content) {
        component.columns ||= [];
        component.rows ||= [];
        if (!component.columns.length) component.columns.push({id:uid('col'),name:'Column 1'});
        content.innerHTML = `<div class="custom-collection-header"><h2>${esc(component.title || 'Table')}</h2><div class="table-toolbar-v162"><button type="button" class="small-icon-btn table-add-row-v162"><i class="ph ph-plus"></i> Row</button><button type="button" class="small-icon-btn table-add-col-v162"><i class="ph ph-plus"></i> Column</button></div></div><div class="table-scroll-v162"><table class="custom-table-v162"><thead><tr></tr></thead><tbody></tbody></table></div>`;
        const head = content.querySelector('thead tr');
        component.columns.forEach(col => {
            const th = document.createElement('th');
            th.innerHTML = `<input class="table-header-input-v162" value="${attr(col.name || '')}" aria-label="Column name"><button type="button" class="table-delete-col-v162" title="Remove column"><i class="ph ph-x"></i></button>`;
            th.querySelector('input').addEventListener('input', e => { col.name = e.target.value; scheduleSaveV162(); });
            th.querySelector('input').addEventListener('blur', () => saveDb());
            th.querySelector('button').onclick = () => {
                if (component.columns.length <= 1) return;
                component.columns = component.columns.filter(c => c.id !== col.id);
                component.rows.forEach(row => { if (row.cells) delete row.cells[col.id]; });
                saveDb(); renderCustomTabView(tab.id);
            };
            head.appendChild(th);
        });
        const actions = document.createElement('th'); actions.className = 'table-actions-head-v162'; actions.textContent = '';
        head.appendChild(actions);
        const body = content.querySelector('tbody');
        component.rows.forEach(row => {
            row.cells ||= {};
            const tr = document.createElement('tr'); tr.dataset.customItemId = row.id;
            component.columns.forEach(col => {
                const td = document.createElement('td');
                td.innerHTML = `<textarea class="table-cell-v162" rows="1">${esc(row.cells[col.id] || '')}</textarea>`;
                const input = td.querySelector('textarea');
                input.addEventListener('input', () => { row.cells[col.id] = input.value; scheduleSaveV162(); });
                input.addEventListener('blur', () => saveDb());
                tr.appendChild(td);
            });
            const td = document.createElement('td'); td.className = 'table-row-actions-v162'; td.innerHTML = '<button type="button" class="small-icon-btn" title="Remove row"><i class="ph ph-trash"></i></button>';
            td.querySelector('button').onclick = () => { component.rows = component.rows.filter(r => r.id !== row.id); saveDb(); renderCustomTabView(tab.id); };
            tr.appendChild(td); body.appendChild(tr);
        });
        content.querySelector('.table-add-row-v162').onclick = () => {
            const cells = {}; component.columns.forEach(col => cells[col.id] = ''); component.rows.push({id:uid('row'),cells}); saveDb(); renderCustomTabView(tab.id);
        };
        content.querySelector('.table-add-col-v162').onclick = () => {
            const col = {id:uid('col'),name:`Column ${component.columns.length + 1}`}; component.columns.push(col); component.rows.forEach(row => { row.cells ||= {}; row.cells[col.id] = ''; }); saveDb(); renderCustomTabView(tab.id);
        };
    }

    // ------------------------------------------------------------
    // Dynamic Knowledge Base collection.
    // ------------------------------------------------------------
    function imageForKnowledgeItemV162(id) {
        const meta = db.phrase_meta?.[id] || {};
        const cfg = db.settings?.categorySettings?.[meta.type] || {};
        for (const field of cfg.fields || []) {
            const normalized = typeof field === 'string' ? {name:field,kind:inferKnowledgeFieldKind(field)} : field;
            if (normalized?.kind === 'image') {
                const value = meta.custom_fields?.[normalized.name];
                if (value) return String(value);
            }
        }
        return '';
    }
    function openKbDetailV162(id) {
        let modal = document.getElementById('kb-dynamic-detail-v162');
        if (!modal) {
            modal = document.createElement('div'); modal.id = 'kb-dynamic-detail-v162'; modal.className = 'modal-overlay hidden kb-dynamic-detail-overlay-v162';
            modal.innerHTML = '<div class="modal-box kb-dynamic-detail-box-v162"><div class="modal-header"><h2></h2><button type="button" class="small-icon-btn kb-dynamic-detail-close-v162"><i class="ph ph-x"></i></button></div><div class="kb-dynamic-detail-body-v162"></div></div>';
            document.body.appendChild(modal);
            modal.querySelector('.kb-dynamic-detail-close-v162').onclick = () => modal.classList.add('hidden');
            modal.addEventListener('click', e => { if (e.target === modal) modal.classList.add('hidden'); });
        }
        const meta = db.phrase_meta?.[id] || {};
        const cfg = db.settings?.categorySettings?.[meta.type] || {};
        modal.querySelector('h2').textContent = getKnowledgeDisplayLabelV162(id, 'everywhere');
        const body = modal.querySelector('.kb-dynamic-detail-body-v162');
        body.innerHTML = `<div class="kb-detail-id-v162"><small>Permanent ID</small><span>${esc(id)}</span></div><div class="kb-detail-tags-v162">${tagsForItemV162(id).map(tag=>`<span>#${esc(tag)}</span>`).join('')}</div>`;
        (cfg.fields || []).forEach(rawField => {
            const field = normalizeKnowledgeField(rawField, 0, cfg);
            const value = meta.custom_fields?.[field.name] ?? '';
            if (value === '' || value == null) return;
            const section = document.createElement('section'); section.className = 'kb-dynamic-field-v162';
            let display = '';
            try { display = buildKnowledgeFieldDisplayHtml(field, value); } catch { display = `<p>${esc(value)}</p>`; }
            section.innerHTML = `<strong>${esc(field.name)}</strong>${display}`; body.appendChild(section);
        });
        modal.classList.remove('hidden');
    }
    function renderDynamicCollectionV162(tab, component, content) {
        const learned = learnedItemSetV162();
        const ids = (db.phrases || []).filter(id => kbItemMatchesV162(id, component, learned));
        content.innerHTML = `<div class="custom-collection-header"><h2>${esc(component.title || 'Dynamic Collection')}</h2><span class="dynamic-count-v162">${ids.length} item${ids.length===1?'':'s'}</span></div><div class="dynamic-kb-grid-v162 ${component.display === 'polaroid' ? 'polaroid' : 'cards'}"></div>`;
        const grid = content.querySelector('.dynamic-kb-grid-v162');
        ids.forEach(id => {
            const label = getKnowledgeDisplayLabelV162(id, 'everywhere');
            const card = document.createElement('button'); card.type = 'button'; card.className = `dynamic-kb-card-v162 ${component.display === 'polaroid' ? 'polaroid' : ''}`; card.dataset.knowledgeItem = id;
            const image = imageForKnowledgeItemV162(id);
            card.innerHTML = component.display === 'polaroid'
                ? `${image ? `<img src="${attr(image)}" alt="">` : '<div class="dynamic-polaroid-placeholder-v162"><i class="ph ph-books"></i></div>'}<strong>${esc(label)}</strong><small>${esc(categoryForItemV162(id))}</small>`
                : `<span class="dynamic-card-icon-v162"><i class="ph ph-books"></i></span><span><strong>${esc(label)}</strong><small>${esc(categoryForItemV162(id))}</small></span>`;
            card.onclick = () => openKbDetailV162(id); grid.appendChild(card);
        });
        if (!ids.length) grid.innerHTML = '<div class="custom-feature-empty-v162">No Knowledge Base items match these filters yet.</div>';
    }
    function ensureDynamicConfigV162() {
        if (document.getElementById('dynamic-config-modal-v162')) return;
        const modal = document.createElement('div'); modal.id = 'dynamic-config-modal-v162'; modal.className = 'modal-overlay hidden';
        modal.innerHTML = `<div class="modal-box dynamic-config-box-v162"><div class="modal-header"><h2>Dynamic Collection</h2><button type="button" class="small-icon-btn dynamic-close-v162"><i class="ph ph-x"></i></button></div>
            <div class="modal-section"><span class="field-label">Title</span><input class="dynamic-title-v162" type="text"></div>
            <div class="modal-section"><span class="field-label">Display</span><select class="dynamic-display-v162"><option value="cards">Cards</option><option value="polaroid">Polaroid-style cards</option></select></div>
            <div class="modal-section"><span class="field-label">Categories</span><input class="dynamic-categories-v162" type="text" placeholder="Nouns, Patterns"></div>
            <div class="modal-section"><span class="field-label">Tags</span><input class="dynamic-tags-v162" type="text" placeholder="grammar, beginner"></div>
            <div class="goal-two-col-v162"><label><span class="field-label">Learned State</span><select class="dynamic-learned-v162"><option value="any">Learned or unlearned</option><option value="learned">Only previously learned</option><option value="unlearned">Only never learned</option></select></label><label><span class="field-label">Parts</span><select class="dynamic-parts-v162"><option value="any">With or without parts</option><option value="with">Only items with parts</option><option value="without">Only items without parts</option></select></label></div>
            <div class="modal-section"><span class="field-label">Placeholder / Type filter</span><input class="dynamic-placeholder-v162" type="text" placeholder="noun, verb..."></div>
            <div class="modal-section"><span class="field-label">Other field filters (JSON)</span><textarea class="dynamic-metadata-v162" placeholder='{"Translation":"hello"}'></textarea></div>
            <button type="button" class="icon-btn dynamic-save-v162"><i class="ph ph-check"></i> Save</button></div>`;
        document.body.appendChild(modal); modal.querySelector('.dynamic-close-v162').onclick = () => modal.classList.add('hidden'); modal.addEventListener('click',e=>{if(e.target===modal)modal.classList.add('hidden')});
    }
    function editDynamicCollectionV162(tab, component) {
        ensureDynamicConfigV162(); const modal = document.getElementById('dynamic-config-modal-v162');
        modal.querySelector('.dynamic-title-v162').value = component.title || 'Dynamic Collection';
        modal.querySelector('.dynamic-display-v162').value = component.display === 'polaroid' ? 'polaroid' : 'cards';
        modal.querySelector('.dynamic-categories-v162').value = (component.categories || []).join(', ');
        modal.querySelector('.dynamic-tags-v162').value = (component.tags || []).join(', ');
        modal.querySelector('.dynamic-learned-v162').value = component.learnedState || 'any';
        modal.querySelector('.dynamic-parts-v162').value = component.partsState || 'any';
        modal.querySelector('.dynamic-placeholder-v162').value = component.placeholderType || '';
        modal.querySelector('.dynamic-metadata-v162').value = component.metadataJson || '';
        modal.querySelector('.dynamic-save-v162').onclick = () => {
            const raw = modal.querySelector('.dynamic-metadata-v162').value.trim(); if(raw){try{JSON.parse(raw)}catch{try{showFeatureToast('Other field filters must be valid JSON.')}catch{}return;}}
            Object.assign(component,{title:modal.querySelector('.dynamic-title-v162').value.trim()||'Dynamic Collection',display:modal.querySelector('.dynamic-display-v162').value,categories:splitList(modal.querySelector('.dynamic-categories-v162').value),tags:splitList(modal.querySelector('.dynamic-tags-v162').value).map(v=>v.replace(/^#/,'')),learnedState:modal.querySelector('.dynamic-learned-v162').value,partsState:modal.querySelector('.dynamic-parts-v162').value,placeholderType:modal.querySelector('.dynamic-placeholder-v162').value.trim(),metadataJson:raw});
            saveDb(); modal.classList.add('hidden'); renderCustomTabView(tab.id);
        };
        modal.classList.remove('hidden');
    }

    try {
        const before = renderCustomComponentContent;
        renderCustomComponentContent = function(tab, component, content) {
            if (component?.type === 'qaV162') return renderQaV162(tab, component, content);
            if (component?.type === 'goalsV162') return renderGoalsV162(tab, component, content);
            if (component?.type === 'tableV162') return renderTableV162(tab, component, content);
            if (component?.type === 'kbDynamicCollectionV162') return renderDynamicCollectionV162(tab, component, content);
            return before.apply(this, arguments);
        };
    } catch {}
    try {
        const before = editCustomComponent;
        editCustomComponent = async function(tabId, componentId) {
            const tab = getCustomTab(tabId); const component = tab?.components?.find(c => c.id === componentId);
            if (component?.type === 'kbDynamicCollectionV162') return editDynamicCollectionV162(tab, component);
            if (['qaV162','goalsV162','tableV162'].includes(component?.type)) {
                const values = await showAppFormModal({title:`Edit ${getCustomComponentLabel(component)}`,submitLabel:'Save',fields:[{name:'title',label:'Section Title',value:component.title || ''}]});
                if (!values) return; component.title = String(values.title || '').trim() || getCustomComponentLabel(component); saveDb(); renderCustomTabView(tabId); return;
            }
            return before.apply(this, arguments);
        };
    } catch {}
    try {
        const before = getCustomItemLabel;
        getCustomItemLabel = function(component, item) {
            if (component?.type === 'qaV162') return item?.question || 'Question';
            if (component?.type === 'goalsV162') return item?.name || 'Goal';
            return before.apply(this, arguments);
        };
    } catch {}
    try {
        const before = getCustomComponentItemArray;
        getCustomComponentItemArray = function(component) {
            if (component?.type === 'goalsV162') return component.goals ||= [];
            return before.apply(this, arguments);
        };
    } catch {}

    // Daily Q&A linking/answer syncing.
    try {
        const before = createCustomItemFromDailyView;
        createCustomItemFromDailyView = async function(tab, component) {
            if (component?.type === 'qaV162') return addQuestionV162(tab, component, currentDay);
            if (component?.type === 'goalsV162') { editGoalV162(tab, component, null); return null; }
            return before.apply(this, arguments);
        };
    } catch {}
    try {
        const before = addDailyCustomLink;
        addDailyCustomLink = function(tab, component, item = null) {
            const result = before.apply(this, arguments);
            if (component?.type === 'qaV162' && item && currentDay) { addQaReferenceV162(item, currentDay, item.answer?.trim() ? 'answered' : 'discussed'); saveDb(); }
            return result;
        };
    } catch {}
    try {
        const before = renderDailyCustomTabLinks;
        renderDailyCustomTabLinks = function() {
            const result = before.apply(this, arguments);
            const list = document.getElementById('daily-custom-tab-links-list');
            const links = getDailyCustomLinks();
            if (!list) return result;
            Array.from(list.children).forEach((row, index) => {
                const link = links[index]; if (!link) return;
                const resolved = resolveDailyCustomLink(link); if (resolved.component?.type !== 'qaV162' || !resolved.item) return;
                row.classList.add('daily-qa-link-v162');
                const main = row.querySelector('.daily-custom-tab-link-main');
                main?.querySelector('strong') && (main.querySelector('strong').textContent = resolved.item.question || 'Question');
                let answer = row.querySelector('.daily-qa-answer-v162');
                if (!answer) { answer = document.createElement('textarea'); answer.className='daily-qa-answer-v162'; answer.placeholder='Answer this question in today\'s log...'; row.appendChild(answer); }
                answer.value = resolved.item.answer || '';
                answer.addEventListener('click', e => e.stopPropagation());
                answer.addEventListener('input', () => { resolved.item.answer = answer.value; addQaReferenceV162(resolved.item, currentDay, answer.value.trim() ? 'answered' : 'discussed'); scheduleSaveV162(); });
                answer.addEventListener('blur', () => saveDb());
            });
            return result;
        };
    } catch {}

    // ------------------------------------------------------------
    // Q&A + improved Goals built-in blueprints.
    // ------------------------------------------------------------
    try {
        if (Array.isArray(CUSTOM_TAB_TEMPLATES_V53) && !CUSTOM_TAB_TEMPLATES_V53.some(t => t.id === 'q-and-a-v162')) {
            CUSTOM_TAB_TEMPLATES_V53.push({id:'q-and-a-v162',name:'Q&A',icon:'ph-question',description:'Keep questions and answer them from this tab or from Daily Logs.'});
        }
        const before = buildPrebuiltTabComponentsV53;
        buildPrebuiltTabComponentsV53 = function(templateId) {
            if (templateId === 'q-and-a-v162') return [defaultCustomComponent('qaV162')];
            if (templateId === 'goals') return [defaultCustomComponent('goalsV162')];
            return before.apply(this, arguments);
        };
    } catch {}

    // ------------------------------------------------------------
    // Reusable custom tab blueprint manager.
    // ------------------------------------------------------------
    function blueprintsV162() { ensureSettingsV162(); return db.settings.customTabBlueprintsV162; }
    function rekeyComponentV162(component) {
        const copy = deepClone(component);
        copy.id = uid('component');
        ['items','entries','goals','rows','columns'].forEach(key => {
            if (Array.isArray(copy[key])) copy[key].forEach(item => { if (item && typeof item === 'object') item.id = uid(key.slice(0,-1) || 'item'); });
        });
        if (copy.type === 'tableV162') {
            const oldCols = deepClone(component.columns || []), newCols = copy.columns || [], map = {};
            oldCols.forEach((old, i) => map[old.id] = newCols[i]?.id);
            (copy.rows || []).forEach((row, i) => { const oldCells = component.rows?.[i]?.cells || {}; const cells={}; Object.entries(oldCells).forEach(([k,v]) => { if(map[k]) cells[map[k]]=v; }); row.cells=cells; });
        }
        return copy;
    }
    function instantiateBlueprintV162(bp, nameOverride = '') {
        const tab = {id:uid('tab'), name:nameOverride || bp.name || 'Custom Tab', icon:bp.icon || 'ph-tabs', components:(bp.components || []).map(rekeyComponentV162), archived:false, createdAt:new Date().toISOString(), blueprintSourceIdV162:bp.id};
        getCustomTabs().push(tab); saveDb(); try { renderCustomTabNavigation(); let view=document.getElementById(`custom-tab-view-${tab.id}`); if(!view){ view=buildCustomTabView(tab); document.body.insertBefore(view,document.getElementById('companion-stage')||null); } activeCustomTabId=tab.id; customTabEditMode=false; renderCustomTabView(tab.id); switchView(view); } catch {} return tab;
    }
    async function saveTabAsBlueprintV162(tab, existing = null) {
        const values = await showAppFormModal({title:existing?'Update Template':'Save as Template',submitLabel:existing?'Update Template':'Save Template',fields:[{name:'name',label:'Template Name',value:existing?.name || tab.name || 'My Template'}]});
        if (!values || !String(values.name || '').trim()) return;
        const bp = existing || {id:uid('blueprint'), status:'active', createdAt:new Date().toISOString()};
        bp.name = String(values.name).trim(); bp.icon = tab.icon || 'ph-tabs'; bp.components = deepClone(tab.components || []); bp.updatedAt = new Date().toISOString(); bp.status='active';
        if (!existing) blueprintsV162().push(bp);
        tab.blueprintSourceIdV162 = bp.id; saveDb(); try { showFeatureToast(existing?'Template updated.':'Template saved.'); } catch {}
    }
    function builtInStateV162(id) { ensureSettingsV162(); return db.settings.builtInBlueprintStateV162[id] || 'active'; }
    function setBuiltInStateV162(id, state) { ensureSettingsV162(); db.settings.builtInBlueprintStateV162[id] = state; saveDb(); try { renderBlueprintCardsV162(); } catch {} }

    function ensureBlueprintManagerV162() {
        if (document.getElementById('blueprint-manager-v162')) return;
        const modal = document.createElement('div'); modal.id='blueprint-manager-v162'; modal.className='modal-overlay hidden';
        modal.innerHTML=`<div class="modal-box blueprint-manager-box-v162"><div class="modal-header"><h2>Tab Templates</h2><button type="button" class="small-icon-btn blueprint-close-v162"><i class="ph ph-x"></i></button></div><div class="blueprint-manager-list-v162"></div></div>`;
        document.body.appendChild(modal); modal.querySelector('.blueprint-close-v162').onclick=()=>modal.classList.add('hidden'); modal.addEventListener('click',e=>{if(e.target===modal)modal.classList.add('hidden')});
    }
    async function renameBlueprintV162(bp) {
        const values = await showAppFormModal({title:'Rename Template',submitLabel:'Rename',fields:[{name:'name',label:'Template Name',value:bp.name||''}]});
        if(!values||!String(values.name||'').trim())return;bp.name=String(values.name).trim();saveDb();renderBlueprintManagerV162();renderBlueprintCardsV162();
    }
    function renderBlueprintManagerV162() {
        ensureBlueprintManagerV162(); const modal=document.getElementById('blueprint-manager-v162'), list=modal.querySelector('.blueprint-manager-list-v162'); list.innerHTML='';
        const active = blueprintsV162().filter(bp=>bp.status==='active');
        const archived = blueprintsV162().filter(bp=>bp.status==='archived');
        const deleted = blueprintsV162().filter(bp=>bp.status==='deleted');
        const section=(title,items,kind)=>{
            const wrap=document.createElement('section');wrap.className='blueprint-manager-section-v162';wrap.innerHTML=`<h3>${esc(title)}</h3><div></div>`;const host=wrap.querySelector('div');
            if(!items.length)host.innerHTML='<small>None</small>';
            items.forEach(bp=>{const row=document.createElement('div');row.className='blueprint-manager-row-v162';row.innerHTML=`<span><i class="ph ${attr(bp.icon||'ph-tabs')}"></i><strong>${esc(bp.name)}</strong></span><div></div>`;const actions=row.lastElementChild;
                if(kind==='active'){
                    const use=document.createElement('button');use.innerHTML='<i class="ph ph-plus"></i>';use.title='Create tab from template';use.onclick=()=>{instantiateBlueprintV162(bp);modal.classList.add('hidden')};actions.appendChild(use);
                    const rename=document.createElement('button');rename.innerHTML='<i class="ph ph-text-aa"></i>';rename.title='Rename';rename.onclick=()=>renameBlueprintV162(bp);actions.appendChild(rename);
                    const edit=document.createElement('button');edit.innerHTML='<i class="ph ph-pencil-simple"></i>';edit.title='Edit layout';edit.onclick=()=>{instantiateBlueprintV162(bp,`${bp.name} — Edit`);modal.classList.add('hidden')};actions.appendChild(edit);
                    const dup=document.createElement('button');dup.innerHTML='<i class="ph ph-copy"></i>';dup.title='Duplicate';dup.onclick=()=>{const copy=deepClone(bp);copy.id=uid('blueprint');copy.name=`${bp.name} Copy`;copy.createdAt=new Date().toISOString();blueprintsV162().push(copy);saveDb();renderBlueprintManagerV162()};actions.appendChild(dup);
                    const arch=document.createElement('button');arch.innerHTML='<i class="ph ph-archive"></i>';arch.title='Archive';arch.onclick=()=>{bp.status='archived';saveDb();renderBlueprintManagerV162();renderBlueprintCardsV162()};actions.appendChild(arch);
                    const del=document.createElement('button');del.innerHTML='<i class="ph ph-trash"></i>';del.title='Delete';del.onclick=()=>{bp.status='deleted';saveDb();renderBlueprintManagerV162();renderBlueprintCardsV162()};actions.appendChild(del);
                } else { const restore=document.createElement('button');restore.innerHTML='<i class="ph ph-arrow-counter-clockwise"></i> Restore';restore.onclick=()=>{bp.status='active';saveDb();renderBlueprintManagerV162();renderBlueprintCardsV162()};actions.appendChild(restore); }
                host.appendChild(row);});list.appendChild(wrap);
        };
        section('My Templates',active,'active'); section('Archived Templates',archived,'archived'); section('Deleted Templates',deleted,'deleted');
        const built=document.createElement('section');built.className='blueprint-manager-section-v162';built.innerHTML='<h3>Hidden Built-in Templates</h3><div></div>';const host=built.querySelector('div');
        const hidden=(CUSTOM_TAB_TEMPLATES_V53||[]).filter(t=>builtInStateV162(t.id)!=='active'); if(!hidden.length)host.innerHTML='<small>None</small>'; hidden.forEach(t=>{const row=document.createElement('div');row.className='blueprint-manager-row-v162';row.innerHTML=`<span><i class="ph ${attr(t.icon||'ph-tabs')}"></i><strong>${esc(t.name)}</strong><small>${esc(builtInStateV162(t.id))}</small></span><div><button type="button"><i class="ph ph-arrow-counter-clockwise"></i> Restore</button></div>`;row.querySelector('button').onclick=()=>{setBuiltInStateV162(t.id,'active');renderBlueprintManagerV162()};host.appendChild(row)});list.appendChild(built);
    }
    function openBlueprintManagerV162(){renderBlueprintManagerV162();document.getElementById('blueprint-manager-v162').classList.remove('hidden')}

    function renderBlueprintCardsV162() {
        ensureSettingsV162();
        const modal = document.getElementById('custom-tab-create-modal'); if(!modal)return;
        modal.querySelectorAll('[data-custom-tab-template-v53]').forEach(card=>{const id=card.dataset.customTabTemplateV53;card.classList.toggle('hidden',builtInStateV162(id)!=='active');if(!card.dataset.v162Menu){card.dataset.v162Menu='1';card.addEventListener('contextmenu',event=>{event.preventDefault();showCustomItemContextMenu(event.clientX,event.clientY,[{label:'Archive template',icon:'ph-archive',action:()=>setBuiltInStateV162(id,'archived')},{label:'Delete template',icon:'ph-trash',danger:true,action:()=>setBuiltInStateV162(id,'deleted')}])})}});
        let section=modal.querySelector('.custom-blueprint-section-v162');if(!section){section=document.createElement('section');section.className='custom-blueprint-section-v162';section.innerHTML='<div class="custom-blueprint-heading-v162"><strong>My Templates</strong><button type="button" class="small-icon-btn custom-blueprint-manage-v162"><i class="ph ph-sliders"></i> Manage</button></div><div class="custom-blueprint-grid-v162"></div>';const box=modal.querySelector('.modal-box');const save=box?.querySelector('#custom-tab-create-confirm, [data-enter-submit="true"]');box?.insertBefore(section,save||null);section.querySelector('.custom-blueprint-manage-v162').onclick=openBlueprintManagerV162;}
        const grid=section.querySelector('.custom-blueprint-grid-v162');grid.innerHTML='';
        blueprintsV162().filter(bp=>bp.status==='active').forEach(bp=>{const card=document.createElement('button');card.type='button';card.className='custom-template-card-v162';card.dataset.customBlueprintIdV162=bp.id;card.innerHTML=`<i class="ph ${attr(bp.icon||'ph-tabs')}"></i><span>${esc(bp.name)}</span>`;card.onclick=()=>{modal.dataset.selectedBlueprintV162=bp.id;grid.querySelectorAll('button').forEach(b=>b.classList.toggle('selected',b===card));modal.querySelectorAll('[data-custom-tab-template-v53]').forEach(c=>c.classList.remove('selected'));const name=modal.querySelector('#custom-tab-name-input');if(name&&!name.value.trim())name.value=bp.name};grid.appendChild(card)});
        if(!grid.children.length)grid.innerHTML='<small>Save any tab as a template to reuse its layout.</small>';
    }
    window.renderBlueprintCardsV162 = renderBlueprintCardsV162;
    document.addEventListener('click',event=>{
        const modal=event.target.closest?.('#custom-tab-create-modal');if(!modal)return;
        const builtin=event.target.closest?.('[data-custom-tab-template-v53]');if(builtin)delete modal.dataset.selectedBlueprintV162;
        const save=event.target.closest?.('#custom-tab-create-confirm, #custom-tab-create-save, .custom-tab-create-save, [data-custom-tab-create-save]');
        if(!save||!modal.dataset.selectedBlueprintV162)return;
        const bp=blueprintsV162().find(x=>x.id===modal.dataset.selectedBlueprintV162&&x.status==='active');if(!bp)return;
        event.preventDefault();event.stopImmediatePropagation();
        const nameInput=modal.querySelector('#custom-tab-name-input');instantiateBlueprintV162(bp,nameInput?.value.trim()||bp.name);modal.classList.add('hidden');delete modal.dataset.selectedBlueprintV162;
    },true);

    function injectBlueprintActionsIntoTabSettingsV162() {
        const modal=document.getElementById('custom-tab-settings-modal');if(!modal)return;
        const tabId=modal.dataset.customTabId || activeCustomTabId;const tab=tabId?getCustomTab(tabId):null;if(!tab)return;
        let row=modal.querySelector('.tab-blueprint-actions-v162');if(!row){row=document.createElement('div');row.className='tab-blueprint-actions-v162';const box=modal.querySelector('.modal-box');row.innerHTML='<button type="button" class="icon-btn tab-save-template-v162"><i class="ph ph-floppy-disk"></i> Save as Template</button><button type="button" class="icon-btn tab-update-template-v162 hidden"><i class="ph ph-arrow-clockwise"></i> Update Template</button>';box?.appendChild(row);}
        row.querySelector('.tab-save-template-v162').onclick=()=>saveTabAsBlueprintV162(tab,null);
        const update=row.querySelector('.tab-update-template-v162');const source=blueprintsV162().find(bp=>bp.id===tab.blueprintSourceIdV162);update.classList.toggle('hidden',!source);if(source)update.onclick=()=>saveTabAsBlueprintV162(tab,source);
    }
    try { const before=openCustomTabSettingsModal; openCustomTabSettingsModal=function(tabId){const r=before.apply(this,arguments);const modal=document.getElementById('custom-tab-settings-modal');if(modal&&tabId)modal.dataset.customTabId=tabId;requestAnimationFrame(injectBlueprintActionsIntoTabSettingsV162);return r}; } catch {}

    // ------------------------------------------------------------
    // Bulk Knowledge Base import with preview.
    // v464: Items Only + Items With Fields modes.
    // ------------------------------------------------------------
    let bulkPreviewV162 = null;
    function bulkModeV464(modal){ return modal?.querySelector('.kb-bulk-mode-v464')?.value || 'items'; }
    function bulkSelectedFieldsV464(modal){
        return [...(modal?.querySelectorAll('.kb-bulk-field-choice-v464:checked')||[])].map(cb=>cb.value).filter(Boolean);
    }
    function bulkCategoryFieldsV464(category){
        const cfg=getCategoryConfig(category);
        return (cfg?.fields||[]).map((raw,i)=>normalizeKnowledgeField(raw,i,cfg)).filter(f=>f?.name);
    }
    function renderBulkFieldChoicesV464(){
        const modal=document.getElementById('kb-bulk-modal-v162'); if(!modal)return;
        const mode=bulkModeV464(modal); const wrap=modal.querySelector('.kb-bulk-fields-wrap-v464');
        wrap.classList.toggle('hidden',mode!=='fields');
        const label=modal.querySelector('.kb-bulk-items-label-v464');
        const hint=modal.querySelector('.kb-bulk-format-hint-v464');
        if(mode==='fields'){
            const category=modal.querySelector('.kb-bulk-category-v162').value;
            const fields=bulkCategoryFieldsV464(category);
            const previous=new Set(bulkSelectedFieldsV464(modal));
            const host=modal.querySelector('.kb-bulk-field-choices-v464');
            host.innerHTML=fields.length?fields.map((f,i)=>`<label class="kb-bulk-field-choice-row-v464"><input type="checkbox" class="kb-bulk-field-choice-v464" value="${attr(f.name)}" ${previous.has(f.name)||(!previous.size&&i<2)?'checked':''}><span>${esc(f.name)}</span><small>${esc(f.type||'text')}</small></label>`).join(''):'<small>This category has no custom fields yet.</small>';
            label.textContent='Records';
            hint.innerHTML='<strong>Format:</strong> one record per line (or separate records with <code>;</code>). Use commas between columns. The first column is the item name; checked fields follow in the order shown below. Put a value in double quotes if it contains a comma. Example: <code>teacher,"a person who teaches","The teacher helps students."</code>';
            modal.querySelector('.kb-bulk-text-v162').placeholder='teacher,"a person who teaches","The teacher helps students."\nstudent,"a person who learns","The student studies every day."';
            host.querySelectorAll('input').forEach(el=>el.addEventListener('change',()=>invalidateBulkPreviewV464(modal)));
        }else{
            label.textContent='Items / Patterns';
            hint.textContent='Paste item names using the delimiter below. This mode works exactly like the original bulk add.';
            modal.querySelector('.kb-bulk-text-v162').placeholder='apple\nbanana\nI am {noun}\nCan I {verb} the {noun}?';
        }
        invalidateBulkPreviewV464(modal);
    }
    function bulkDetectedCountV465(modal){
        if(!modal)return 0;
        const text=modal.querySelector('.kb-bulk-text-v162')?.value||'';
        if(bulkModeV464(modal)==='fields')return splitRecordsV464(text).length;
        return parseBulkV162(text,modal.querySelector('.kb-bulk-delimiter-v162')?.value||'auto').length;
    }
    function updateBulkCountV465(modal,readyCount=null){
        const count=bulkDetectedCountV465(modal);
        const out=modal?.querySelector('.kb-bulk-count-v465');
        if(!out)return;
        out.innerHTML=`<strong>${count}</strong> item${count===1?'':'s'} detected${readyCount===null?'':` <span>· ${readyCount} ready to add</span>`}`;
    }
    function invalidateBulkPreviewV464(modal){
        bulkPreviewV162=null;
        modal?.querySelector('.kb-bulk-commit-v162')?.setAttribute('disabled','');
        const out=modal?.querySelector('.kb-bulk-preview-v162'); if(out)out.innerHTML='';
        updateBulkCountV465(modal);
    }
    function existingBulkDaysV684(){
        return Object.keys(db.days||{})
            .map(Number)
            .filter(day=>Number.isInteger(day)&&day>0)
            .sort((a,b)=>a-b);
    }
    function parseBulkDaysV684(modal){
        const input=modal?.querySelector('.kb-bulk-days-input-v684');
        const raw=String(input?.value||'');
        const compact=raw.replace(/\s+/g,'');
        if(!compact)return {days:[],invalid:[],malformed:false};
        const parts=compact.split(',');
        const malformed=parts.some(part=>!/^\d+$/.test(part));
        const requested=[...new Set(parts.filter(part=>/^\d+$/.test(part)).map(Number).filter(day=>day>0))];
        const existing=new Set(existingBulkDaysV684());
        const invalid=requested.filter(day=>!existing.has(day));
        return {days:requested.filter(day=>existing.has(day)),invalid,malformed};
    }
    function syncBulkDaysV684(modal){
        if(!modal)return true;
        const feedback=modal.querySelector('.kb-bulk-days-feedback-v684');
        const input=modal.querySelector('.kb-bulk-days-input-v684');
        const commit=modal.querySelector('.kb-bulk-commit-v162');
        const state=parseBulkDaysV684(modal);
        const hasValue=!!String(input?.value||'').trim();
        const valid=!state.malformed&&!state.invalid.length;
        modal.dataset.kbBulkDaysValidV684=valid?'1':'0';
        if(input){
            input.classList.toggle('invalid',!valid);
            input.setAttribute('aria-invalid',valid?'false':'true');
        }
        if(feedback){
            feedback.classList.toggle('error',!valid);
            if(!hasValue){
                feedback.textContent='Optional. Enter existing day numbers separated by commas, for example 1, 2, 3.';
            }else if(state.malformed){
                feedback.textContent='Use only day numbers separated by commas.';
            }else if(state.invalid.length){
                feedback.textContent=`${state.invalid.length===1?'Day':'Days'} ${state.invalid.join(', ')} ${state.invalid.length===1?'does':'do'} not exist yet.`;
            }else{
                feedback.textContent=`Will add the imported items to ${state.days.map(day=>`Day ${day}`).join(', ')}.`;
            }
        }
        if(commit&&!valid)commit.disabled=true;
        return valid;
    }
    function ensureBulkDaysV684(modal){
        if(!modal)return;
        let wrap=modal.querySelector('.kb-bulk-days-v684');
        if(!wrap){
            wrap=document.createElement('div');
            wrap.className='modal-section kb-bulk-days-v684';
            wrap.innerHTML=`<span class="field-label">Add to Items Learned <small>(optional)</small></span><input type="text" class="kb-bulk-days-input-v684" inputmode="numeric" autocomplete="off" placeholder="1, 2, 3"><small class="kb-bulk-days-feedback-v684">Optional. Enter existing day numbers separated by commas, for example 1, 2, 3.</small>`;
            const delimiter=modal.querySelector('.kb-bulk-delimiter-wrap-v464');
            if(delimiter)delimiter.insertAdjacentElement('afterend',wrap);
            else modal.querySelector('.kb-bulk-box-v162')?.appendChild(wrap);
            const input=wrap.querySelector('.kb-bulk-days-input-v684');
            input.addEventListener('input',()=>syncBulkDaysV684(modal));
            input.addEventListener('blur',()=>syncBulkDaysV684(modal));
        }
        syncBulkDaysV684(modal);
    }
    function ensureBulkImportV162() {
        if(document.getElementById('kb-bulk-modal-v162'))return;
        const modal=document.createElement('div');modal.id='kb-bulk-modal-v162';modal.className='modal-overlay hidden';modal.innerHTML=`<div class="modal-box kb-bulk-box-v162"><div class="modal-header"><h2>Bulk Add Knowledge Base Items</h2><button type="button" class="small-icon-btn kb-bulk-close-v162"><i class="ph ph-x"></i></button></div>
        <div class="modal-section"><span class="field-label">Bulk Add Mode</span><select class="kb-bulk-mode-v464"><option value="items">Items Only</option><option value="fields">Items + Fields</option></select></div>
        <div class="modal-section"><span class="field-label">Category</span><select class="kb-bulk-category-v162"></select></div>
        <div class="modal-section kb-bulk-fields-wrap-v464 hidden"><span class="field-label">Fields to Include</span><div class="kb-bulk-field-choices-v464"></div><small class="kb-bulk-field-order-note-v464">The checked fields are imported in the order shown here.</small></div>
        <div class="modal-section"><span class="field-label">Shared Tags <small>(applied to every imported item)</small></span><input type="text" class="kb-bulk-tags-v162" placeholder="lazy, noun, beginner"></div>
        <div class="modal-section kb-bulk-delimiter-wrap-v464"><span class="field-label">Delimiter</span><select class="kb-bulk-delimiter-v162"><option value="auto">Auto detect</option><option value="newline">One item per line</option><option value="comma">Comma</option><option value="semicolon">Semicolon</option><option value="tab">Tab</option></select></div>
        <div class="kb-bulk-format-hint-v464"></div>
        <button type="button" class="icon-btn kb-bulk-copy-prompt-v466"><i class="ph ph-copy"></i> Copy AI Prompt</button>
        <div class="modal-section"><span class="field-label kb-bulk-items-label-v464">Items / Patterns</span><textarea class="kb-bulk-text-v162" rows="10"></textarea><div class="kb-bulk-count-v465"><strong>0</strong> items detected</div></div>
        <button type="button" class="icon-btn kb-bulk-preview-btn-v162">Preview Import</button><div class="kb-bulk-preview-v162"></div><button type="button" class="icon-btn kb-bulk-commit-v162" disabled><i class="ph ph-check"></i> Add Items</button></div>`;
        document.body.appendChild(modal);ensureBulkDaysV684(modal);modal.querySelector('.kb-bulk-close-v162').onclick=()=>modal.classList.add('hidden');modal.addEventListener('click',e=>{if(e.target===modal)modal.classList.add('hidden')});
        modal.querySelector('.kb-bulk-copy-prompt-v466').onclick=()=>copyBulkAiPromptV466(modal);
        modal.querySelector('.kb-bulk-preview-btn-v162').onclick=previewBulkV162;modal.querySelector('.kb-bulk-commit-v162').onclick=commitBulkV162;
        modal.querySelector('.kb-bulk-mode-v464').addEventListener('change',()=>{modal.querySelector('.kb-bulk-delimiter-wrap-v464').classList.toggle('hidden',bulkModeV464(modal)==='fields');renderBulkFieldChoicesV464();updateBulkCountV465(modal)});
        modal.querySelector('.kb-bulk-category-v162').addEventListener('change',()=>{renderBulkFieldChoicesV464();updateBulkCountV465(modal)});
        modal.querySelectorAll('textarea,input,select').forEach(input=>{if(!input.classList.contains('kb-bulk-mode-v464')&&!input.classList.contains('kb-bulk-category-v162'))input.addEventListener('input',()=>invalidateBulkPreviewV464(modal))});
        renderBulkFieldChoicesV464();
    }
    function bulkItemsOnlySeparatorV466(modal){
        const delimiter=modal?.querySelector('.kb-bulk-delimiter-v162')?.value||'auto';
        if(delimiter==='comma')return {name:'commas',sample:'teacher,student,doctor'};
        if(delimiter==='semicolon')return {name:'semicolons',sample:'teacher;student;doctor'};
        if(delimiter==='tab')return {name:'tabs',sample:'teacher\tstudent\tdoctor'};
        return {name:'one item per line',sample:'teacher\nstudent\ndoctor'};
    }
    function buildBulkAiPromptV466(modal){
        const category=modal?.querySelector('.kb-bulk-category-v162')?.value||'the selected category';
        const mode=bulkModeV464(modal);
        if(mode==='fields'){
            const fields=bulkSelectedFieldsV464(modal);
            if(!fields.length)return '';
            const columns=['Item Name',...fields];
            const example=['teacher',...fields.map((f,i)=>i===0?'a person who teaches':i===1?'The teacher helps students.':`example ${f}`)];
            const csvExample=example.map(v=>/[",;\n]/.test(v)?`"${String(v).replace(/"/g,'""')}"`:v).join(',');
            return `Take the image, screenshot, PDF page, or other source I gave you and format the information so I can paste it directly into Loggy's Knowledge Base Bulk Add records box.\n\nCategory: ${category}\nColumns, in this EXACT order: ${columns.join(', ')}\n\nOUTPUT RULES:\n- Output ONLY the paste-ready records. Do not add an introduction, explanation, bullets, numbering, markdown, or code fences.\n- Put exactly ONE record per line.\n- Separate columns with commas.\n- The first column must always be the item name.\n- Then output the selected fields in exactly this order: ${fields.join(', ')}.\n- If a value contains a comma, semicolon, double quote, or line break, wrap that value in double quotes. Escape a double quote inside a quoted value by doubling it.\n- If a selected field is missing from the source, leave that field empty but KEEP its column/comma so every row has exactly ${columns.length} columns.\n- Do not invent definitions, examples, pronunciations, or other missing information. Use only information actually visible in the source.\n- Preserve the source wording unless a tiny OCR spacing error is obvious.\n- Include every applicable item you can clearly read from the source.\n\nFORMAT EXAMPLE (${columns.join(' | ')}):\n${csvExample}\n\nNow read the source I provided and return only the correctly formatted records.`;
        }
        const sep=bulkItemsOnlySeparatorV466(modal);
        return `Take the image, screenshot, PDF page, or other source I gave you and extract the Knowledge Base item names for Loggy.\n\nCategory: ${category}\n\nOUTPUT RULES:\n- Output ONLY the paste-ready item names. Do not add an introduction, explanation, bullets, numbering, markdown, or code fences.\n- Use ${sep.name}.\n- Do not include definitions, notes, tags, labels, or extra commentary.\n- Do not invent items that are not visible in the source.\n- Preserve the source wording unless a tiny OCR spacing error is obvious.\n- Include every applicable item you can clearly read.\n\nFORMAT EXAMPLE:\n${sep.sample}\n\nNow read the source I provided and return only the correctly formatted items.`;
    }
    async function copyBulkAiPromptV466(modal){
        const prompt=buildBulkAiPromptV466(modal);
        if(!prompt){try{showFeatureToast('Choose at least one field first.')}catch{}return;}
        let ok=false;
        try{await navigator.clipboard.writeText(prompt);ok=true}catch{
            try{const ta=document.createElement('textarea');ta.value=prompt;ta.style.position='fixed';ta.style.opacity='0';document.body.appendChild(ta);ta.select();ok=document.execCommand('copy');ta.remove()}catch{}
        }
        try{showFeatureToast(ok?'Copied AI formatting prompt.':'Could not copy the prompt.')}catch{}
    }
    function parseBulkV162(text,delimiter){
        const raw=String(text||'');let parts=[];
        if(delimiter==='newline')parts=raw.split(/\r?\n/);else if(delimiter==='comma')parts=raw.split(',');else if(delimiter==='semicolon')parts=raw.split(';');else if(delimiter==='tab')parts=raw.split('\t');else { parts=raw.split(/[\r\n,;\t]+/); }
        return parts.map(v=>v.trim()).filter(Boolean);
    }
    function splitRecordsV464(text){
        const raw=String(text||''); const out=[]; let cur=''; let quoted=false;
        for(let i=0;i<raw.length;i++){
            const ch=raw[i];
            if(ch==='"'){
                if(quoted&&raw[i+1]==='"'){cur+='"';i++;continue;}
                quoted=!quoted;cur+=ch;continue;
            }
            if(!quoted&&(ch===';'||ch==='\n'||ch==='\r')){
                if(ch==='\r'&&raw[i+1]==='\n')i++;
                if(cur.trim())out.push(cur.trim());cur='';continue;
            }
            cur+=ch;
        }
        if(cur.trim())out.push(cur.trim());
        return out;
    }
    function parseCsvRowV464(row){
        const cols=[];let cur='';let quoted=false;
        for(let i=0;i<row.length;i++){
            const ch=row[i];
            if(ch==='"'){
                if(quoted&&row[i+1]==='"'){cur+='"';i++;continue;}
                quoted=!quoted;continue;
            }
            if(ch===','&&!quoted){cols.push(cur.trim());cur='';continue;}
            cur+=ch;
        }
        cols.push(cur.trim());
        return {cols,unclosedQuote:quoted};
    }
    function malformedBulkV162(value){let depth=0;for(const ch of value){if(ch==='{')depth++;if(ch==='}')depth--;if(depth<0)return true;}return depth!==0||value.length>500;}
    function previewBulkV162(){
        const modal=document.getElementById('kb-bulk-modal-v162'); const mode=bulkModeV464(modal); const category=modal.querySelector('.kb-bulk-category-v162').value; const tags=splitList(modal.querySelector('.kb-bulk-tags-v162').value);
        if(mode==='fields'){
            const fields=bulkSelectedFieldsV464(modal); const records=splitRecordsV464(modal.querySelector('.kb-bulk-text-v162').value); const seen=new Set();
            const rows=records.map(record=>{
                const parsed=parseCsvRowV464(record); const item=String(parsed.cols[0]||'').trim(); const values=parsed.cols.slice(1); let status='ready';
                if(!fields.length)status='choose at least one field';
                else if(parsed.unclosedQuote)status='unclosed quote';
                else if(!item)status='missing item name';
                else if(parsed.cols.length!==fields.length+1)status=`expected ${fields.length+1} columns`;
                else if(db.phrases.includes(item))status='already exists';
                else if(seen.has(item))status='duplicate in paste';
                else if(malformedBulkV162(item))status='check formatting';
                seen.add(item);
                const custom={}; fields.forEach((name,i)=>custom[name]=values[i]??'');
                return{value:item,values,custom,status,record};
            });
            bulkPreviewV162={mode,signature:modal.querySelector('.kb-bulk-text-v162').value,category,tags,fields,rows};
            const ready=rows.filter(r=>r.status==='ready'), warning=rows.filter(r=>r.status!=='ready');
            updateBulkCountV465(modal,ready.length);
            modal.querySelector('.kb-bulk-preview-v162').innerHTML=`<div class="kb-bulk-summary-v162"><strong>${ready.length} ready</strong><span>${warning.length} skipped / needs review</span></div><div class="kb-bulk-preview-list-v162">${rows.slice(0,250).map(r=>`<div class="${r.status==='ready'?'ready':'warning'}"><span class="kb-bulk-preview-record-v464"><strong>${esc(r.value||'(no item)')}</strong>${fields.map((f,i)=>`<em>${esc(f)}: ${esc(r.values?.[i]??'')}</em>`).join('')}</span><small>${esc(r.status)}</small></div>`).join('')}${rows.length>250?`<div><small>+ ${rows.length-250} more</small></div>`:''}</div>`;
            modal.querySelector('.kb-bulk-commit-v162').disabled=!ready.length||warning.some(r=>['unclosed quote','missing item name','choose at least one field','check formatting'].includes(r.status));
            syncBulkDaysV684(modal);
            return;
        }
        const values=parseBulkV162(modal.querySelector('.kb-bulk-text-v162').value,modal.querySelector('.kb-bulk-delimiter-v162').value);const seen=new Set();const rows=values.map(value=>{let status='ready';if(db.phrases.includes(value))status='already exists';else if(seen.has(value))status='duplicate in paste';else if(malformedBulkV162(value))status='check formatting';seen.add(value);return{value,status}});bulkPreviewV162={mode:'items',signature:modal.querySelector('.kb-bulk-text-v162').value,category,tags,rows};const ready=rows.filter(r=>r.status==='ready');const warning=rows.filter(r=>r.status!=='ready');updateBulkCountV465(modal,ready.length);modal.querySelector('.kb-bulk-preview-v162').innerHTML=`<div class="kb-bulk-summary-v162"><strong>${ready.length} ready</strong><span>${warning.length} skipped / needs review</span></div><div class="kb-bulk-preview-list-v162">${rows.slice(0,250).map(r=>`<div class="${r.status==='ready'?'ready':'warning'}"><span>${esc(r.value)}</span><small>${esc(r.status)}</small></div>`).join('')}${rows.length>250?`<div><small>+ ${rows.length-250} more</small></div>`:''}</div>`;modal.querySelector('.kb-bulk-commit-v162').disabled=!ready.length||warning.some(r=>r.status==='check formatting');syncBulkDaysV684(modal);
    }
    function commitBulkV162(){
        const modal=document.getElementById('kb-bulk-modal-v162');if(!syncBulkDaysV684(modal))return;if(!bulkPreviewV162||bulkPreviewV162.signature!==modal.querySelector('.kb-bulk-text-v162').value)return previewBulkV162();const category=bulkPreviewV162.category||db.settings.categories?.[0]||'Category';const tags=(typeof normalizeKnowledgeTagsV55==='function'?normalizeKnowledgeTagsV55(bulkPreviewV162.tags):bulkPreviewV162.tags.map(v=>v.replace(/^#/,'')));let added=0;bulkPreviewV162.rows.filter(r=>r.status==='ready').forEach(row=>{if(db.phrases.includes(row.value))return;db.phrases.push(row.value);const cfg=getCategoryConfig(category);const custom={};(cfg.fields||[]).forEach((raw,i)=>{const f=normalizeKnowledgeField(raw,i,cfg);custom[f.name]=''});if(bulkPreviewV162.mode==='fields')Object.entries(row.custom||{}).forEach(([name,value])=>{if(Object.prototype.hasOwnProperty.call(custom,name))custom[name]=value});db.phrase_meta[row.value]={...(db.phrase_meta[row.value]||{}),type:category,tags:[...tags],custom_fields:custom,enableParts:false,parts:[]};added++});saveDb();try{populatePhrasesDatalist();renderLibraryTabs();renderPhrasesLibrary(document.getElementById('phrases-search-bar')?.value||'')}catch{}modal.classList.add('hidden');bulkPreviewV162=null;try{showFeatureToast(`Added ${added} Knowledge Base item${added===1?'':'s'}.`)}catch{}
    }
    function ensureBulkButtonV162(){
        const header=document.querySelector('#phrases-library-view .log-header-container > div:last-child');if(!header||document.getElementById('kb-bulk-add-btn-v162'))return;const btn=document.createElement('button');btn.id='kb-bulk-add-btn-v162';btn.className='icon-btn';btn.title='Bulk add items';btn.innerHTML='<i class="ph ph-stack-plus"></i>';btn.onclick=()=>{ensureBulkImportV162();const modal=document.getElementById('kb-bulk-modal-v162');const select=modal.querySelector('.kb-bulk-category-v162');select.innerHTML=(db.settings.categories||[]).map(c=>`<option value="${attr(c)}">${esc(c)}</option>`).join('');select.value=libraryFilter&&libraryFilter!=='all'?libraryFilter:(db.settings.categories?.[0]||'');modal.querySelector('.kb-bulk-text-v162').value='';const dayInput=modal.querySelector('.kb-bulk-days-input-v684');if(dayInput)dayInput.value='';modal.querySelector('.kb-bulk-preview-v162').innerHTML='';modal.querySelector('.kb-bulk-commit-v162').disabled=true;bulkPreviewV162=null;renderBulkFieldChoicesV464();updateBulkCountV465(modal);syncBulkDaysV684(modal);modal.classList.remove('hidden')};header.insertBefore(btn,document.getElementById('add-phrase-library-btn'));
    }

    // ------------------------------------------------------------
    // Daily Knowledge Base recommendations.
    // ------------------------------------------------------------
    function ensureRecommendationBarV162(){
        const view = document.getElementById('log-view');
        if (!view) return null;
        let bar = document.getElementById('daily-recommendation-v162');
        if (!bar) {
            bar = document.createElement('section');
            bar.id = 'daily-recommendation-v162';
            bar.className = 'daily-recommendation-v162 hidden';
            const header = view.querySelector('.log-header-container');
            header?.insertAdjacentElement('afterend', bar);
        }
        if (bar.dataset.v689Ready !== '1') {
            bar.dataset.v689Ready = '1';
            bar.innerHTML = `
                <button type="button" class="daily-recommendation-main-v162">
                    <span class="daily-recommendation-icon-v162"><i class="ph ph-sparkle"></i></span>
                    <span class="daily-recommendation-copy-v162"><small></small><span class="daily-recommendation-value-v217"></span></span>
                </button>
                <button type="button" class="small-icon-btn daily-recommendation-learned-v689" title="Add to Items Learned" aria-label="Add recommendation to Items Learned"><i class="ph ph-check"></i></button>`;
            bar.addEventListener('contextmenu', event => {
                event.preventDefault();
                event.stopPropagation();
                if (typeof showCustomItemContextMenu === 'function') {
                    showCustomItemContextMenu(event.clientX, event.clientY, [{
                        label:'Edit filters', icon:'ph-sliders-horizontal', action:openRecommendationSettingsV162
                    }]);
                } else openRecommendationSettingsV162();
            });
            bar.querySelector('.daily-recommendation-learned-v689').addEventListener('click', async event => {
                event.preventDefault();
                event.stopPropagation();
                const id = String(bar.dataset.recommendationIdV689 || '');
                if (!id || !currentDay) return;
                db.days ||= {};
                db.days[currentDay] ||= {notes:'',phrases:[],tools:[],video:'',checkedParts:{}};
                db.days[currentDay].phrases ||= [];
                if (!db.days[currentDay].phrases.includes(id)) db.days[currentDay].phrases.push(id);
                try { renderPhrases(db.days[currentDay].phrases); } catch {}
                try { await saveDb(); } catch {}
                try { showFeatureToast?.(`Added “${getKnowledgeDisplayLabelV162(id,'everywhere')}” to Items Learned.`); } catch {}
                renderRecommendationV162();
            });
        }
        return bar;
    }
    function recommendationForDayV162(day){
        ensureSettingsV162();
        const cfg=db.settings.dailyRecommendationV162;
        if(!cfg.enabled||cfg.paused)return{state:cfg.paused?'paused':'disabled'};
        const phrases=db.phrases||[];
        const learned=learnedItemSetV162();
        if(cfg.mode==='ordered'){
            const list=Array.isArray(cfg.orderedItems)?cfg.orderedItems:[];
            if(!list.length)return{state:'empty'};
            let index=Math.max(0,Number(day||1)-1);
            if(index>=list.length){if(cfg.endBehavior==='loop')index=index%list.length;else return{state:'complete'}}
            for(let offset=0;offset<list.length;offset++){
                const candidate=String(list[(index+offset)%list.length]||'').trim();
                if(phrases.includes(candidate) && !learned.has(candidate)) return{state:'item',id:candidate,index:index+offset};
                if(cfg.endBehavior!=='loop'&&index+offset>=list.length-1)break;
            }
            return{state:'missing'};
        }
        // Recommendations are always for items not yet present in Items Learned.
        const matches=phrases.filter(id=>!learned.has(String(id)) && kbItemMatchesV162(id,{...cfg,learnedState:'unlearned'},learned));
        if(!matches.length)return{state:'empty'};
        const index=(Math.max(1,Number(day||1))-1)%matches.length;
        return{state:'item',id:matches[index],index};
    }
    function renderRecommendationV162(){
        const bar=ensureRecommendationBarV162();
        if(!bar)return;
        ensureSettingsV162();
        const cfg=db.settings.dailyRecommendationV162;
        const rec=recommendationForDayV162(currentDay);
        bar.classList.toggle('hidden',!cfg.enabled);
        if(!cfg.enabled)return;
        const small=bar.querySelector('small');
        const strong=bar.querySelector('.daily-recommendation-value-v217');
        const main=bar.querySelector('.daily-recommendation-main-v162');
        const learnedButton=bar.querySelector('.daily-recommendation-learned-v689');
        bar.dataset.recommendationIdV689='';
        if(main)main.onclick=null;
        if(learnedButton) learnedButton.hidden=true;
        if(rec.state==='paused'){small.textContent=cfg.title||'Daily Recommendation';strong.textContent='Paused';return;}
        if(rec.state==='complete'){small.textContent=cfg.title||'Daily Recommendation';strong.textContent='Ordered list complete';return;}
        if(rec.state==='empty'||rec.state==='missing'){small.textContent=cfg.title||'Daily Recommendation';strong.textContent='No matching item available';return;}
        if(rec.state==='item'){
            bar.dataset.recommendationIdV689=String(rec.id);
            if(learnedButton) learnedButton.hidden=false;
            small.textContent=cfg.title||'Daily Recommendation';
            const rawRecLabel=getKnowledgeDisplayLabelV162(rec.id,'everywhere');
            const isRawPattern=String(rawRecLabel)===String(rec.id)&&String(rec.id).includes('\\');
            if(isRawPattern && typeof placeholderTokenHtmlV56==='function') strong.innerHTML=placeholderTokenHtmlV56(String(rec.id));
            else strong.textContent=rawRecLabel;
            // Use the real KB item modal, identical to clicking the item in Knowledge Base.
            main.onclick=()=>openItemModal(rec.id,true,false);
        }
    }
    function ensureRecommendationModalV162(){
        if(document.getElementById('recommendation-modal-v162'))return;const modal=document.createElement('div');modal.id='recommendation-modal-v162';modal.className='modal-overlay hidden';modal.innerHTML=`<div class="modal-box recommendation-box-v162"><div class="modal-header"><h2>Daily Recommendation</h2><button type="button" class="small-icon-btn rec-close-v162"><i class="ph ph-x"></i></button></div>
        <label class="goal-auto-row-v162"><input type="checkbox" class="rec-enabled-v162"><span>Show recommendation bar on Daily Logs</span></label><label class="goal-auto-row-v162"><input type="checkbox" class="rec-paused-v162"><span>Pause recommendations</span></label>
        <div class="modal-section"><span class="field-label">Bar Label</span><input class="rec-title-v162" type="text"></div><div class="modal-section"><span class="field-label">Mode</span><select class="rec-mode-v162"><option value="filter">Filter-based</option><option value="ordered">Ordered list</option></select></div>
        <div class="rec-filter-fields-v162"><div class="modal-section"><span class="field-label">Categories</span><input class="rec-categories-v162" type="text"></div><div class="modal-section"><span class="field-label">Tags</span><div class="daily-recommendation-tag-rule-v689"><input class="rec-tags-v162" type="text" placeholder="tag1, tag2"><select class="rec-tag-mode-v689"><option value="and">AND</option><option value="or">OR</option></select></div><p class="progress-hint">AND requires every tag. OR requires at least one tag.</p></div><div class="goal-two-col-v162"><label><span class="field-label">Learned State</span><select class="rec-learned-v162"><option value="any">Either</option><option value="learned">Previously learned only</option><option value="unlearned">Never learned only</option></select></label><label><span class="field-label">Parts</span><select class="rec-parts-v162"><option value="any">Either</option><option value="with">With parts</option><option value="without">Without parts</option></select></label></div><div class="modal-section"><span class="field-label">Placeholder / Type</span><input class="rec-placeholder-v162" type="text" placeholder="noun, verb..."></div><div class="modal-section"><span class="field-label">Other metadata filters (JSON)</span><textarea class="rec-metadata-v162"></textarea></div></div>
        <div class="rec-ordered-fields-v162 hidden"><div class="modal-section"><span class="field-label">Ordered item IDs / JSON list</span><textarea class="rec-ordered-v162" rows="8" placeholder='["item 1", "item 2"]\n—or one item ID per line'></textarea><p class="progress-hint">Duplicates are kept in the exact order you provide. Missing/deleted items are skipped. Recommendations do not count as learned.</p></div><div class="modal-section"><span class="field-label">At end of list</span><select class="rec-end-v162"><option value="stop">Stop and show complete</option><option value="loop">Loop from the beginning</option></select></div></div>
        <button type="button" class="icon-btn rec-save-v162"><i class="ph ph-check"></i> Save Settings</button></div>`;document.body.appendChild(modal);modal.querySelector('.rec-close-v162').onclick=()=>modal.classList.add('hidden');modal.addEventListener('click',e=>{if(e.target===modal)modal.classList.add('hidden')});modal.querySelector('.rec-mode-v162').onchange=syncRecommendationModeV162;modal.querySelector('.rec-save-v162').onclick=saveRecommendationV162;
    }
    function syncRecommendationModeV162(){const modal=document.getElementById('recommendation-modal-v162');if(!modal)return;const ordered=modal.querySelector('.rec-mode-v162').value==='ordered';modal.querySelector('.rec-filter-fields-v162').classList.toggle('hidden',ordered);modal.querySelector('.rec-ordered-fields-v162').classList.toggle('hidden',!ordered)}
    function openRecommendationSettingsV162(){ensureSettingsV162();ensureRecommendationModalV162();const c=db.settings.dailyRecommendationV162,m=document.getElementById('recommendation-modal-v162');m.querySelector('.rec-enabled-v162').checked=!!c.enabled;m.querySelector('.rec-paused-v162').checked=!!c.paused;m.querySelector('.rec-title-v162').value=c.title||'Daily Recommendation';m.querySelector('.rec-mode-v162').value=c.mode==='ordered'?'ordered':'filter';m.querySelector('.rec-categories-v162').value=(c.categories||[]).join(', ');m.querySelector('.rec-tags-v162').value=(c.tags||[]).join(', ');m.querySelector('.rec-tag-mode-v689').value=c.tagMode==='or'?'or':'and';m.querySelector('.rec-learned-v162').value='unlearned';m.querySelector('.rec-learned-v162').disabled=true;m.querySelector('.rec-parts-v162').value=c.partsState||'any';m.querySelector('.rec-placeholder-v162').value=c.placeholderType||'';m.querySelector('.rec-metadata-v162').value=c.metadataJson||'';m.querySelector('.rec-ordered-v162').value=JSON.stringify(c.orderedItems||[],null,2);m.querySelector('.rec-end-v162').value=c.endBehavior==='loop'?'loop':'stop';syncRecommendationModeV162();m.classList.remove('hidden')}
    function parseOrderedV162(raw){const text=String(raw||'').trim();if(!text)return[];if(text.startsWith('[')){const arr=JSON.parse(text);if(!Array.isArray(arr))throw new Error('Ordered JSON must be an array.');return arr.map(v=>String(v).trim()).filter(Boolean);}return text.split(/\r?\n/).map(v=>v.trim()).filter(Boolean)}
    function saveRecommendationV162(){const m=document.getElementById('recommendation-modal-v162'),c=db.settings.dailyRecommendationV162;let ordered=[];try{ordered=parseOrderedV162(m.querySelector('.rec-ordered-v162').value)}catch(e){try{showFeatureToast(e.message)}catch{}return}const metadata=m.querySelector('.rec-metadata-v162').value.trim();if(metadata){try{JSON.parse(metadata)}catch{try{showFeatureToast('Other metadata filters must be valid JSON.')}catch{}return}}Object.assign(c,{enabled:m.querySelector('.rec-enabled-v162').checked,paused:m.querySelector('.rec-paused-v162').checked,title:m.querySelector('.rec-title-v162').value.trim()||'Daily Recommendation',mode:m.querySelector('.rec-mode-v162').value,categories:splitList(m.querySelector('.rec-categories-v162').value),tags:splitList(m.querySelector('.rec-tags-v162').value).map(v=>v.replace(/^#/,'')),tagMode:m.querySelector('.rec-tag-mode-v689').value==='or'?'or':'and',learnedState:'unlearned',partsState:m.querySelector('.rec-parts-v162').value,placeholderType:m.querySelector('.rec-placeholder-v162').value.trim(),metadataJson:metadata,orderedItems:ordered,endBehavior:m.querySelector('.rec-end-v162').value});saveDb();m.classList.add('hidden');renderRecommendationV162()}
    try{const before=openDayLog;openDayLog=function(){const r=before.apply(this,arguments);requestAnimationFrame(renderRecommendationV162);return r}}catch{}

    // ------------------------------------------------------------
    // Theme Settings cleanup + stronger AI prompt + cursor/trail behavior.
    // ------------------------------------------------------------
    function removeThemeAiBoxesV162(){
        document.getElementById('theme-ai-entry-v161')?.remove();
        document.querySelectorAll('#daily-settings-modal .theme-ai-entry-v161, #daily-settings-modal .theme-json-prompt-row-v159').forEach(n=>n.remove());
        document.querySelectorAll('#theme-pack-tools-v154 .theme-json-import-v159').forEach(n=>n.remove());
    }
    try{const before=openGlobalThemeSettings;openGlobalThemeSettings=function(){const r=before.apply(this,arguments);removeThemeAiBoxesV162();requestAnimationFrame(removeThemeAiBoxesV162);return r}}catch{}
    try{const before=renderThemePicker;renderThemePicker=function(){const r=before.apply(this,arguments);removeThemeAiBoxesV162();return r}}catch{}

    function luminanceV162(hex){const s=String(hex||'').replace('#','');if(!/^[0-9a-f]{6}$/i.test(s))return null;const c=[0,2,4].map(i=>parseInt(s.slice(i,i+2),16)/255).map(v=>v<=.03928?v/12.92:Math.pow((v+.055)/1.055,2.4));return .2126*c[0]+.7152*c[1]+.0722*c[2]}
    function fullThemePromptV162(appearance='dark'){
        const mode=appearance==='light'?'LIGHT':'DARK';let modal=document.getElementById('theme-builder-modal');try{if(!modal)modal=ensureThemeBuilderModal()}catch{}
        const keys=[];const seen=new Set();modal?.querySelectorAll?.('[data-theme-key]').forEach(input=>{const key=String(input.dataset.themeKey||'').trim();if(!key||seen.has(key))return;seen.add(key);const label=input.closest('.theme-builder-field,.theme-builder-color-field,.theme-builder-control-row')?.querySelector('span,strong')?.textContent?.trim()||key;let type=input.type||input.tagName.toLowerCase();let options='';if(input.tagName==='SELECT')options=Array.from(input.options).map(o=>o.value).filter(Boolean).join('|');keys.push({key,label,type,options})});
        try { const draft=getThemeBuilderDraft(modal); Object.keys(draft||{}).sort().forEach(key=>{ if(seen.has(key))return; seen.add(key); const value=draft[key]; keys.push({key,label:key,type:Array.isArray(value)?'array':typeof value,options:''}); }); } catch {}
        const colors=keys.filter(x=>modal?.querySelector?.(`[data-theme-key="${CSS.escape(x.key)}"]`)?.matches?.('input[type="color"]')).map(x=>x.key);
        const fields=keys.map(x=>`- ${x.key} (${x.label || x.key})${x.options?` allowed: ${x.options}`:''}`).join('\n');
        const colorList=colors.length?colors.map(k=>`- ${k}: REQUIRED six-digit #RRGGBB`).join('\n'):'- background\n- surface\n- text\n- muted\n- accent\n- border';
        return `Create ONE directly importable Loggy theme JSON from exactly FOUR visual reference images I will attach. The references are visual inspiration only. Do not embed them and do not invent file paths or base64 assets.\n\nMANDATORY APPEARANCE: ${mode}.\n${mode==='DARK'?'A DARK theme means the actual PAGE BACKGROUND and major SURFACES are dark. Do not give me a white, cream, near-white, pastel-light, or high-luminance page background. Main text/icons must be light and readable. As a hard check, page/background colors should normally have relative luminance <= 0.18, major card/surface colors <= 0.24, and normal text should achieve at least 4.5:1 contrast against the surfaces it sits on.':'A LIGHT theme means the actual PAGE BACKGROUND and major SURFACES are light. Main text/icons must be dark and readable. As a hard check, page/background colors should normally have relative luminance >= 0.72 and normal text should achieve at least 4.5:1 contrast.'}\nThe visual goal is a cohesive theme where decoration images will POP clearly against the background without sacrificing text/icon readability.\n\nCRITICAL COMPLETENESS RULE: fill EVERY setting represented by the Theme Builder schema below. Do not only fill six basic colors. Include dashboard, tabs, buttons, category bars, modals, borders, hover/selected states, backgrounds, radii, shadows, font, audio defaults, decorations, cursor settings, and every other supported key. If a setting is not relevant, still provide its safe/default value rather than omitting it unless its schema is explicitly optional.\n\nTHEME BUILDER FIELD SCHEMA DISCOVERED FROM THIS APP:\n${fields || '(Use every field in the exact required JSON shape below.)'}\n\nCOLOR KEYS THAT MUST ALL BE PRESENT:\n${colorList}\n\nBACKGROUND RULES:\n- backgroundModeV158 must match the actual appearance.\n- Prefer one smooth linear gradient with at most two huge, very soft, low-opacity radial glows.\n- No bright white spotlight blobs on dark themes.\n- No harsh rainbow/multi-stop clashes.\n- backgroundImage: "" and backgroundSvgs: [] because I add decorations separately.\n- interactiveBackgroundCodeV56: "" unless absolutely necessary.\n\nCUSTOM CURSOR + TRAIL ARE REQUIRED:\n- Include customCursorV161 with primary, secondary, accent, motif, and trail.\n- motif must be one of: sparkle, heart, flower, leaf, wave, gem, moon, sun, bow, butterfly, star, ribbon, music, berry, cloud.\n- trail must be one of: sparkle, heart, petal, leaf, bubble, star, gem, music, dot, moon, wave.\n- The trail must visually match the custom cursor and overall theme.\n- Set useThemeCursor: true.\n- Set themeCursorTrailEnabledV161: true.\n- Do NOT invent themeCursorStyle/customCursorModeIdV161 IDs. Loggy creates the custom cursor ID on import, turns the Theme Cursor toggle ON, selects the generated custom cursor as Initial Cursor, and enables its trail automatically.\n\nANIMATION:\nUse an existing svgDefaultAnimation ID when possible. If none fits, use svgDefaultAnimation:"theme-custom-animation" plus safe numeric customAnimationV159 keyframes only (2–12 ordered offsets from 0 to 1; gentle x/y/rotate/scale/opacity; no arbitrary CSS/JS).\n\nOUTPUT RULES:\n1. CREATE and return ONE downloadable .json FILE containing exactly the valid JSON object. Do NOT paste the raw JSON into the chat. The downloadable .json file is mandatory because Loggy imports theme files, not pasted JSON text.\n2. No markdown fence, commentary, comments, or trailing commas.\n3. Every color is six-digit #RRGGBB.\n4. Do not use external URLs.\n5. Keep backgroundImage:"", introAudio:"", svgHoverSounds:[], backgroundSvgs:[].\n6. Include format:"loggy-theme-json", version:2, name, and theme.\n7. Before output, verify EVERY Theme Builder key you can represent is present, JSON parses, the requested ${mode} appearance is literal, text/icon contrast is readable, and the decorations will stand out.\n\nMINIMUM REQUIRED STRUCTURE:\n{"format":"loggy-theme-json","version":2,"name":"Theme Name","theme":{"name":"Theme Name",...ALL THEME BUILDER SETTINGS...,"backgroundImage":"","backgroundSvgs":[],"svgHoverSounds":[],"introAudio":"","useThemeCursor":true,"themeCursorTrailEnabledV161":true,"customCursorV161":{"primary":"#RRGGBB","secondary":"#RRGGBB","accent":"#RRGGBB","motif":"sparkle","trail":"sparkle"}}}`;
    }
    window.__loggyThemeAiPromptV162=fullThemePromptV162;
    document.addEventListener('click',async event=>{const btn=event.target.closest?.('#theme-builder-modal .theme-copy-json-prompt-v159, #theme-builder-modal .theme-copy-full-prompt-v158');if(!btn)return;event.preventDefault();event.stopImmediatePropagation();const modal=btn.closest('#theme-builder-modal');const mode=modal?.querySelector('.theme-json-prompt-mode-v159')?.value||'dark';const text=fullThemePromptV162(mode);let ok=false;try{await navigator.clipboard.writeText(text);ok=true}catch{try{const ta=document.createElement('textarea');ta.value=text;document.body.appendChild(ta);ta.select();ok=document.execCommand('copy');ta.remove()}catch{}}try{showFeatureToast(ok?`Copied improved ${mode} Theme Builder prompt.`:'Could not copy the prompt.')}catch{}},true);

    // (Old "V162 clean-create guard" removed — it wrapped populateThemeBuilder
    // on every single call, adding overhead to every theme open/tab switch,
    // but its own trigger path was superseded by V164's openBrandNewThemeV164
    // further down this file, so it could never actually fire. V164 is the
    // real, working blank-slate implementation for "New Theme".)

    // Ensure imported/generated cursor is selected, toggle is on, and trail enabled.
    function enforceGeneratedCursorV162(theme,modal){if(!theme?.customCursorV161&&!String(theme?.themeCursorStyle||'').startsWith('theme-cursor-v161-'))return;try{window.__loggyThemeAiV161?.registerCursor?.(theme,theme.name)}catch{}theme.useThemeCursor=true;theme.themeCursorTrailEnabledV161=true;const id=String(theme.themeCursorStyle||theme.customCursorModeIdV161||'');if(id){try{db.settings.cursorTrails ||= {};db.settings.cursorTrails[id]=true}catch{}const section=modal?.querySelector('.theme-builder-accessories-v32');const toggle=section?.querySelector('.theme-builder-use-cursor-v32 input');const select=section?.querySelector('.theme-builder-cursor-choice-v32 select');if(toggle){toggle.checked=true;toggle.dispatchEvent(new Event('change',{bubbles:true}))}if(select&&Array.from(select.options).some(o=>o.value===id)){select.value=id;select.dispatchEvent(new Event('change',{bubbles:true}))}}}
    try{const before=populateThemeBuilder;populateThemeBuilder=function(modal,theme){if(theme?.customCursorV161){try{window.__loggyThemeAiV161?.registerCursor?.(theme,theme.name)}catch{}}const r=before.call(this,modal,theme);enforceGeneratedCursorV162(theme,modal);return r}}catch{}

    // Durable decoration URL normalization + error-time server resolution.
    function publicUrlFromProjectPathV162(projectPath){let p=String(projectPath||'').replace(/\\/g,'/').replace(/^\.\//,'');const marker='/public/';const i=p.toLowerCase().lastIndexOf(marker);if(i>=0)p=p.slice(i+marker.length);else if(p.toLowerCase().startsWith('public/'))p=p.slice(7);if(!p)return'';return'/'+p.split('/').filter(Boolean).map(part=>encodeURIComponent(decodeURIComponent(part))).join('/')}
    function normalizeThemeAssetsV162(theme){if(!theme||typeof theme!=='object')return theme;(theme.backgroundSvgs||[]).forEach(asset=>{if(!asset||typeof asset!=='object')return;const resolved=publicUrlFromProjectPathV162(asset.projectPath||asset.path);if(resolved){asset._projectUrlV495=resolved;if(!String(asset.url||asset.src||'').trim())asset.url=resolved}const current=String(asset.url||asset.src||'').trim();if(current&&!/^blob:/i.test(current)&&!asset._stableUrlV164)asset._stableUrlV164=current});const bgPath=theme.backgroundImageProjectPathV3||theme.backgroundImageProjectPath;if(bgPath){const r=publicUrlFromProjectPathV162(bgPath);if(r&&!String(theme.backgroundImage||'').trim())theme.backgroundImage=r}return theme}
    try{const before=populateThemeBuilder;populateThemeBuilder=function(modal,theme){normalizeThemeAssetsV162(theme);return before.call(this,modal,theme)}}catch{}
    function repairBuilderImagesV162(modal){if(!modal)return;(modal._themeBackgroundSvgs||[]).forEach(asset=>{if(!asset||typeof asset!=='object')return;const repaired=publicUrlFromProjectPathV162(asset.projectPath||asset.path);if(repaired)asset._projectUrlV495=repaired;const current=String(asset.url||asset.src||'').trim();if(current&&!/^blob:/i.test(current)&&!asset._stableUrlV164)asset._stableUrlV164=current});modal.querySelectorAll('img').forEach(img=>{if(img.dataset.assetRepairBoundV162)return;img.dataset.assetRepairBoundV162='1';img.addEventListener('error',async()=>{const card=img.closest('[data-asset-id],[data-index],.theme-builder-svg-card,.theme-builder-art-card-v69');let asset=null;const assets=modal._themeBackgroundSvgs||[];const idx=Number(card?.dataset?.index);if(Number.isInteger(idx)&&assets[idx])asset=assets[idx];if(!asset){const current=decodeURIComponent(String(img.src||''));asset=assets.find(a=>current.includes(decodeURIComponent(String(a.url||'')))||String(a.url||'')===img.getAttribute('src'))}if(!asset)return;let tried;try{tried=new Set(JSON.parse(img.dataset.assetRepairTriedV495||'[]'))}catch{tried=new Set()}const failed=String(img.getAttribute('src')||img.src||'').trim();if(failed)tried.add(failed);const candidates=[asset._stableUrlV164,asset.url,asset.src,asset._projectUrlV495,publicUrlFromProjectPathV162(asset.projectPath||asset.path)].map(v=>String(v||'').trim()).filter(Boolean);let candidate=candidates.find(v=>!tried.has(v));if(candidate){tried.add(candidate);img.dataset.assetRepairTriedV495=JSON.stringify([...tried]);img.src=candidate;return}if(asset.projectPath&&!img.dataset.assetRepairServerTriedV495){img.dataset.assetRepairServerTriedV495='1';try{const res=await fetch(`/api/theme-asset-resolve/${encodeURIComponent(HOBBY)}`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({projectPath:asset.projectPath})});if(res.ok){const data=await res.json();if(data?.url&&!tried.has(String(data.url))){img.src=data.url;return}}}catch{}}card?.classList.add('theme-asset-missing-v162');card?.setAttribute('title','Decoration file is missing. Re-upload this decoration to repair it.');});img.addEventListener('load',()=>{const current=String(img.getAttribute('src')||img.src||'').trim();if(!current||/^blob:/i.test(current))return;const card=img.closest('[data-asset-id],[data-index],.theme-builder-svg-card,.theme-builder-art-card-v69');const assets=modal._themeBackgroundSvgs||[];const idx=Number(card?.dataset?.index);const asset=Number.isInteger(idx)?assets[idx]:null;if(asset){asset._stableUrlV164=current;asset.url=current}img.dataset.assetRepairTriedV495='[]';})})}
    try{const before=renderThemeBuilderSvgListV2;renderThemeBuilderSvgListV2=function(modal){const r=before.apply(this,arguments);repairBuilderImagesV162(modal);return r}}catch{}

    // ------------------------------------------------------------
    // Final initialization hooks.
    // ------------------------------------------------------------
    function initV162(){
        try{ensureSettingsV162()}catch{}
        try{ensureBulkButtonV162()}catch{}
        try{ensureRecommendationBarV162()}catch{}
        try{removeThemeAiBoxesV162()}catch{}
        try{renderBlueprintCardsV162()}catch{}
    }
    try{const before=initializeFeatureSuiteAfterLoad;initializeFeatureSuiteAfterLoad=function(...args){const r=before.apply(this,args);requestAnimationFrame(initV162);return r}}catch{}
    if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(initV162,0));else setTimeout(initV162,0);
    setTimeout(initV162,700);

    window.__loggyV162={init:initV162,openRecommendationSettings:openRecommendationSettingsV162,openBlueprintManager:openBlueprintManagerV162,getKnowledgeDisplayLabel:getKnowledgeDisplayLabelV162};
})();

// V162B — small final UI guards for V162.
(function(){
    document.addEventListener('click', event => {
        if (!event.target.closest?.('#kb-field-create-kind [data-kind]')) return;
        setTimeout(() => {
            try {
                document.getElementById('kb-field-rating-max-v162')?.classList.toggle(
                    'hidden',
                    pendingKnowledgeFieldKind !== 'rating'
                );
            } catch {}
        }, 0);
    }, true);

    function injectRecommendationSettingsButtonV162B(modal) {
        if (!modal || modal.querySelector('.daily-recommendation-settings-row-v162b')) return;
        const box = modal.querySelector('.modal-box');
        if (!box) return;
        const section = document.createElement('div');
        section.className = 'modal-section daily-recommendation-settings-row-v162b';
        section.innerHTML = `
            <button type="button" class="icon-btn daily-recommendation-open-settings-v162b">
                <i class="ph ph-sparkle"></i>
                Daily Knowledge Base Recommendation
            </button>
            <p class="progress-hint">Configure filtered or ordered recommendations shown at the top of each Daily Log.</p>
        `;
        box.appendChild(section);
        section.querySelector('button').addEventListener('click', () => {
            try { window.__loggyV162?.openRecommendationSettings?.(); } catch {}
        });
    }

    try {
        const beforeEnsure = ensureDailyLogsSettingsModal;
        ensureDailyLogsSettingsModal = function(...args) {
            const modal = beforeEnsure.apply(this, args);
            injectRecommendationSettingsButtonV162B(modal);
            return modal;
        };
    } catch {}

    try {
        const beforeOpen = openDailyLogsLocalSettings;
        openDailyLogsLocalSettings = function(...args) {
            const result = beforeOpen.apply(this, args);
            injectRecommendationSettingsButtonV162B(
                document.getElementById('daily-logs-local-settings-modal')
            );
            return result;
        };
    } catch {}
})();

/* ============================================================
   V163 — ACCESSORIES + CUSTOM TAB / KNOWLEDGE BASE POLISH
   ============================================================ */
(function(){
    'use strict';
    const V='v163';
    const $=(s,r=document)=>r?.querySelector?.(s)||null;
    const $$=(s,r=document)=>Array.from(r?.querySelectorAll?.(s)||[]);
    const esc=v=>{try{return escapeCustomHtml(String(v??''))}catch{return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}};
    const uid2=p=>{try{return customId(p)}catch{return `${p}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,8)}`}};
    const toast=m=>{try{showFeatureToast(m)}catch{console.info(m)}};
    const readJson=(key,fallback)=>{try{const v=JSON.parse(localStorage.getItem(key)||'null');return v??fallback}catch{return fallback}};
    const writeJson=(key,v)=>{try{localStorage.setItem(key,JSON.stringify(v))}catch{}};

    // Preserve category-level display-label settings through old migration code.
    try{
        const before=migrateKnowledgeBaseSettings;
        migrateKnowledgeBaseSettings=function(){
            const extras={};
            Object.entries(db.settings?.categorySettings||{}).forEach(([k,cfg])=>{
                if(cfg&&typeof cfg==='object') extras[k]={
                    displayFieldV162:cfg.displayFieldV162,
                    displayScopeV162:cfg.displayScopeV162,
                    displayFieldScopeV162:cfg.displayFieldScopeV162,
                    hideTagsInPolaroidV163:cfg.hideTagsInPolaroidV163,
                    polaroidOrientationV163:cfg.polaroidOrientationV163,
                    polaroidsPerRowV163:cfg.polaroidsPerRowV163
                };
            });
            const r=before.apply(this,arguments);
            Object.entries(extras).forEach(([k,e])=>{if(db.settings.categorySettings?.[k])Object.entries(e).forEach(([p,v])=>{if(v!==undefined)db.settings.categorySettings[k][p]=v})});
            return r;
        };
    }catch{}

    // ---------------- Custom tabs: global search + refined local search ----------------
    try{
        if(!CUSTOM_COMPONENT_LIBRARY.some(x=>x.type==='globalSearchV163')){
            const i=CUSTOM_COMPONENT_LIBRARY.findIndex(x=>x.type==='search');
            CUSTOM_COMPONENT_LIBRARY.splice(i<0?0:i+1,0,{type:'globalSearchV163',label:'Global Search Bar',icon:'ph-magnifying-glass-plus'});
        }
        const beforeDefault=defaultCustomComponent;
        defaultCustomComponent=function(type){
            if(type==='globalSearchV163') return {id:uid2('component'),type,placeholder:'Search every component below...'};
            return beforeDefault.apply(this,arguments);
        };
    }catch{}

    const restoreSearchNodesV163=root=>$$('.custom-searchable-item',root).forEach(n=>{n.classList.remove('custom-search-hidden-v163');n.style.removeProperty('display')});
    function applySearchV163(root,query){
        if(!root)return; const q=String(query||'').trim().toLowerCase();
        $$('.custom-searchable-item',root).forEach(n=>{
            const hay=(n.dataset.searchText||n.textContent||'').toLowerCase();
            const hide=!!q&&!hay.includes(q);n.classList.toggle('custom-search-hidden-v163',hide);
        });
    }
    function renderSearchV163(content,component,global=false){
        content.innerHTML=`<div class="custom-user-search-wrap ${global?'custom-global-search-wrap-v163':''}"><i class="ph ${global?'ph-globe-hemisphere-west':'ph-magnifying-glass'}"></i><input type="text" class="custom-user-search" placeholder="${esc(component.placeholder||(global?'Search every component below...':'Search the component below...'))}"><button type="button" class="custom-user-search-clear hidden" aria-label="Clear search"><i class="ph ph-x"></i></button></div>`;
        const input=$('.custom-user-search',content), clear=$('.custom-user-search-clear',content);
        const target=()=>{
            const wrapper=content.closest('.custom-tab-component'); if(!wrapper)return null;
            if(!global) return wrapper.nextElementSibling;
            const holder=document.createElement('div');
            // A lightweight virtual root isn't queryable across siblings, so return wrapper and traverse below explicitly.
            return wrapper;
        };
        const run=()=>{
            clear?.classList.toggle('hidden',!input.value);
            const wrapper=content.closest('.custom-tab-component'); if(!wrapper)return;
            if(!global){ const next=wrapper.nextElementSibling; restoreSearchNodesV163(next);applySearchV163(next,input.value);return; }
            let node=wrapper.nextElementSibling;while(node){restoreSearchNodesV163(node);applySearchV163(node,input.value);node=node.nextElementSibling;}
        };
        input?.addEventListener('input',run);clear?.addEventListener('click',()=>{input.value='';run();input.focus()});
    }

    // ---------------- Category Bar ----------------
    async function addCategoryV163(tab,component){
        const value=await showAppPrompt({title:'Add Category',label:'Category name',placeholder:'e.g. Grammar',submitLabel:'Add'});
        if(value===null||!value.trim())return; component.categories||=[]; const name=value.trim();
        if(component.categories.some(x=>x.toLowerCase()===name.toLowerCase())){toast('That category already exists.');return;}
        component.categories.push(name);component.activeCategory=name;saveDb();renderCustomTabView(tab.id);
    }
    async function renameCategoryV163(tab,component,oldName){
        const value=await showAppPrompt({title:'Rename Category',label:'Category name',value:oldName,submitLabel:'Save'});
        if(value===null||!value.trim())return;const name=value.trim();
        if(name!==oldName&&component.categories.some(x=>x.toLowerCase()===name.toLowerCase())){toast('That category already exists.');return;}
        component.categories=component.categories.map(x=>x===oldName?name:x);(component.items||[]).forEach(item=>{if(item.category===oldName)item.category=name});if(component.activeCategory===oldName)component.activeCategory=name;saveDb();renderCustomTabView(tab.id);
    }
    async function deleteCategoryV163(tab,component,name){
        if((component.categories||[]).length<=1){toast('Keep at least one category.');return;}
        const count=(component.items||[]).filter(x=>x.category===name).length;
        const ok=await showAppConfirm({title:'Delete Category',message:`Delete “${name}”${count?` and its ${count} item${count===1?'':'s'}`:''}?`,confirmLabel:'Delete'});if(!ok)return;
        component.categories=component.categories.filter(x=>x!==name);component.items=(component.items||[]).filter(x=>x.category!==name);if(component.activeCategory===name)component.activeCategory=component.categories[0];saveDb();renderCustomTabView(tab.id);
    }
    async function addCategoryItemV163(tab,component){
        const active=component.activeCategory||component.categories?.[0]||'Category';
        const v=await showAppFormModal({title:`Add to ${active}`,submitLabel:'Add Item',fields:[{name:'title',label:'Item',placeholder:'Item name'},{name:'body',label:'Details (optional)',type:'textarea'}]});
        if(!v||!String(v.title||'').trim())return;component.items||=[];component.items.push({id:uid2('category-item'),category:active,title:String(v.title).trim(),body:String(v.body||'')});saveDb();renderCustomTabView(tab.id);
    }
    function renderCategoryV163(tab,component,content){
        component.categories=Array.isArray(component.categories)&&component.categories.length?component.categories:['Category 1'];component.items=Array.isArray(component.items)?component.items:[];if(!component.categories.includes(component.activeCategory))component.activeCategory=component.categories[0];const active=component.activeCategory;
        content.innerHTML=`<div class="custom-collection-header custom-category-header-v163"><h2>${esc(component.title||'Categories')}</h2><div class="custom-category-head-actions-v163"><button type="button" class="small-icon-btn custom-category-add-category-v163" title="Add category"><i class="ph ph-folder-plus"></i></button><button type="button" class="small-icon-btn custom-category-add-item-v163" title="Add item"><i class="ph ph-plus"></i></button></div></div><div class="custom-category-bar-v163"></div><div class="custom-category-items-v163"></div>`;
        const bar=$('.custom-category-bar-v163',content),list=$('.custom-category-items-v163',content);
        component.categories.forEach(cat=>{const b=document.createElement('button');b.type='button';b.className=`filter-tab custom-category-tab-v163${cat===active?' active':''}`;b.textContent=cat;b.title='Right-click to rename or delete';b.onclick=()=>{component.activeCategory=cat;saveDb();renderCustomTabView(tab.id)};b.oncontextmenu=e=>{e.preventDefault();showCustomItemContextMenu(e.clientX,e.clientY,[{label:'Rename category',icon:'ph-pencil-simple',action:()=>renameCategoryV163(tab,component,cat)},{label:'Delete category',icon:'ph-trash',danger:true,action:()=>deleteCategoryV163(tab,component,cat)}])};bar.appendChild(b)});
        $('.custom-category-add-category-v163',content).onclick=()=>addCategoryV163(tab,component);$('.custom-category-add-item-v163',content).onclick=()=>addCategoryItemV163(tab,component);
        component.items.filter(x=>x.category===active).forEach(item=>{const card=document.createElement('article');card.className='custom-category-item-v163 custom-searchable-item custom-content-editable';card.dataset.searchText=`${item.title||''} ${item.body||''} ${item.category||''}`.toLowerCase();card.dataset.customItemId=item.id;card.innerHTML=`<strong>${esc(item.title||'Untitled')}</strong>${item.body?`<span>${esc(item.body)}</span>`:''}`;card.oncontextmenu=e=>{e.preventDefault();showCustomItemContextMenu(e.clientX,e.clientY,[{label:'Edit item',icon:'ph-pencil-simple',action:async()=>{const v=await showAppFormModal({title:'Edit Category Item',submitLabel:'Save',fields:[{name:'title',label:'Item',value:item.title||''},{name:'body',label:'Details',type:'textarea',value:item.body||''}]});if(!v)return;item.title=String(v.title||'').trim()||item.title;item.body=String(v.body||'');saveDb();renderCustomTabView(tab.id)}},{label:'Delete item',icon:'ph-trash',danger:true,action:async()=>{const ok=await showAppConfirm({title:'Delete Item',message:`Delete “${item.title||'this item'}”?`,confirmLabel:'Delete'});if(!ok)return;component.items=component.items.filter(x=>x.id!==item.id);saveDb();renderCustomTabView(tab.id)}}])};list.appendChild(card)});
        if(!list.children.length)list.innerHTML=`<div class="custom-category-empty-v163">No items in ${esc(active)} yet.</div>`;
    }

    // ---------------- Q&A accordion ----------------
    const qaOpenV163=new Set();
    function removeQaLinksV163(id){Object.values(db.days||{}).forEach(day=>{if(Array.isArray(day.customTabLinks))day.customTabLinks=day.customTabLinks.filter(link=>link.itemId!==id)})}
    async function addQaV163(tab,component,item=null){
        const v=await showAppFormModal({title:item?'Edit Question':'New Question',submitLabel:item?'Save':'Add',fields:[{name:'question',label:'Question',value:item?.question||'',type:'textarea',rows:3},{name:'answer',label:'Answer (optional)',value:item?.answer||'',type:'textarea',rows:5}]});if(!v||!String(v.question||'').trim())return;
        component.items||=[];if(item){item.question=String(v.question).trim();item.answer=String(v.answer||'')}else component.items.push({id:uid2('question'),question:String(v.question).trim(),answer:String(v.answer||''),references:[],createdAt:new Date().toISOString()});saveDb();renderCustomTabView(tab.id);
    }
    async function editQaAnswerV163(tab,component,item){const v=await showAppFormModal({title:'Answer Question',submitLabel:'Save Answer',fields:[{name:'answer',label:'Answer',value:item.answer||'',type:'textarea',rows:7}]});if(!v)return;item.answer=String(v.answer||'');saveDb();renderCustomTabView(tab.id)}
    function renderQaV163(tab,component,content){
        component.items=Array.isArray(component.items)?component.items:[];content.innerHTML=`<div class="custom-collection-header qa-header-v163"><h2>${esc(component.title||'Q&A')}</h2><button type="button" class="small-icon-btn qa-add-v163" title="Add question" aria-label="Add question"><i class="ph ph-plus"></i></button></div><div class="qa-list-v163"></div>`;$('.qa-add-v163',content).onclick=()=>addQaV163(tab,component);const list=$('.qa-list-v163',content);
        component.items.forEach(item=>{const open=qaOpenV163.has(item.id),refs=Array.isArray(item.references)?item.references:[];const row=document.createElement('article');row.className=`qa-row-v163 custom-searchable-item${open?' open':''}`;row.dataset.searchText=`${item.question||''} ${item.answer||''}`.toLowerCase();row.dataset.customItemId=item.id;row.innerHTML=`<button type="button" class="qa-summary-v163" aria-expanded="${open?'true':'false'}"><i class="ph ph-caret-right qa-caret-v163"></i><span class="qa-question-text-v163">${esc(item.question||'Untitled question')}</span><span class="qa-answer-state-v163">${item.answer?'<i class="ph ph-check-circle"></i>':'<i class="ph ph-chat-circle"></i>'}</span></button><div class="qa-detail-v163 ${open?'':'hidden'}"><div class="qa-full-question-v163">${esc(item.question||'')}</div><div class="qa-answer-copy-v163">${item.answer?esc(item.answer).replace(/\n/g,'<br>'):'<span class="qa-empty-answer-v163">No answer yet.</span>'}</div><div class="qa-detail-actions-v163"><button type="button" class="small-icon-btn qa-answer-edit-v163"><i class="ph ph-pencil-simple"></i> ${item.answer?'Edit Answer':'Add Answer'}</button></div><div class="qa-references-v163">${refs.length?refs.map(r=>`<button type="button" class="qa-day-ref-v163" data-day="${Number(r.day)||0}"><i class="ph ph-calendar-blank"></i> Day ${Number(r.day)||0}</button>`).join(''):'<span>No Daily Log references yet.</span>'}</div></div>`;
            $('.qa-summary-v163',row).onclick=()=>{qaOpenV163.has(item.id)?qaOpenV163.delete(item.id):qaOpenV163.add(item.id);renderCustomTabView(tab.id)};$('.qa-answer-edit-v163',row)?.addEventListener('click',()=>editQaAnswerV163(tab,component,item));$$('.qa-day-ref-v163',row).forEach(b=>b.onclick=()=>{try{openDayLog(Number(b.dataset.day))}catch{}});row.oncontextmenu=e=>{e.preventDefault();showCustomItemContextMenu(e.clientX,e.clientY,[{label:item.answer?'Edit answer':'Add answer',icon:'ph-chat-text',action:()=>editQaAnswerV163(tab,component,item)},{label:'Edit question',icon:'ph-pencil-simple',action:()=>addQaV163(tab,component,item)},{label:'Delete question',icon:'ph-trash',danger:true,action:async()=>{const ok=await showAppConfirm({title:'Delete Question',message:'Delete this question and its Daily Log references?',confirmLabel:'Delete'});if(!ok)return;component.items=component.items.filter(x=>x.id!==item.id);removeQaLinksV163(item.id);saveDb();renderCustomTabView(tab.id)}}])};list.appendChild(row)});
        if(!component.items.length)list.innerHTML='<div class="custom-feature-empty-v162">No questions yet.</div>';
    }

    // ---------------- Goals: existing KB categories/tags instead of free typing ----------------
    const allKbTagsV163=()=>{const out=new Set();(db.phrases||[]).forEach(id=>{try{(getKnowledgeItemTagsV55(id)||[]).forEach(t=>out.add(String(t).replace(/^#/,'')))}catch{(db.phrase_meta?.[id]?.tags||[]).forEach(t=>out.add(String(t).replace(/^#/,'')))}});return [...out].filter(Boolean).sort((a,b)=>a.localeCompare(b))};
    function matchesGoalItemV163(id,goal){const meta=db.phrase_meta?.[id]||{};if(goal.categories?.length&&!goal.categories.includes(meta.type))return false;const tags=new Set((meta.tags||[]).map(x=>String(x).replace(/^#/,'')));if(goal.tags?.length&&!goal.tags.every(t=>tags.has(String(t).replace(/^#/,''))))return false;if(goal.metadataJson){try{const f=JSON.parse(goal.metadataJson);for(const[k,v]of Object.entries(f)){const actual=meta.custom_fields?.[k]??meta[k];if(String(actual??'').toLowerCase()!==String(v??'').toLowerCase())return false}}catch{}}return true}
    function dayDateV163(day){if(!db.startDate)return null;const d=new Date(`${db.startDate}T12:00:00`);if(Number.isNaN(d.getTime()))return null;d.setDate(d.getDate()+Number(day||1)-1);return d}
    function autoGoalV163(goal){if(!goal.autoEnabled)return 0;let count=0;Object.entries(db.days||{}).forEach(([n,day])=>{const date=dayDateV163(n);if(goal.startDate&&date&&date<new Date(`${goal.startDate}T00:00:00`))return;if(goal.endDate&&date&&date>new Date(`${goal.endDate}T23:59:59`))return;(day?.phrases||[]).forEach(id=>{if(matchesGoalItemV163(id,goal))count++})});return count}
    function choiceChipsV163(values,selected,cls){const set=new Set(selected||[]);return `<div class="choice-chips-v163 ${cls}">${values.length?values.map(v=>`<label class="choice-chip-v163"><input type="checkbox" value="${esc(v)}" ${set.has(v)?'checked':''}><span>${esc(v)}</span></label>`).join(''):'<span class="progress-hint">None exist yet.</span>'}</div>`}
    function ensureGoalModalV163(){let m=$('#goal-config-modal-v163');if(m)return m;m=document.createElement('div');m.id='goal-config-modal-v163';m.className='modal-overlay hidden';m.innerHTML=`<div class="modal-box goal-config-box-v163"><div class="modal-header"><h2>Goal</h2><button type="button" class="small-icon-btn goal-close-v163"><i class="ph ph-x"></i></button></div><div class="modal-section"><span class="field-label">Goal name</span><input class="goal-name-v163"></div><div class="goal-two-col-v162"><label><span class="field-label">Target</span><input class="goal-target-v163" type="number" min="1" value="10"></label><label><span class="field-label">Unit</span><input class="goal-unit-v163" value="items"></label></div><div class="goal-two-col-v162"><label><span class="field-label">Start date</span><input class="goal-start-v163" type="date"></label><label><span class="field-label">End date</span><input class="goal-end-v163" type="date"></label></div><label class="goal-auto-row-v162"><input class="goal-auto-v163" type="checkbox"><span>Automatically count matching items added to Daily Logs</span><button type="button" class="help-dot-v163 goal-filter-help-v163" aria-label="Why use Knowledge Base filters">?</button></label><div class="goal-kb-filter-wrap-v163"><div class="modal-section"><span class="field-label">Knowledge Base categories</span><div class="goal-categories-host-v163"></div></div><div class="modal-section"><span class="field-label">Tags</span><div class="goal-tags-host-v163"></div></div><div class="modal-section"><span class="field-label">Other field filters (optional JSON)</span><textarea class="goal-metadata-v163" placeholder='{"Language":"Korean"}'></textarea></div></div><button type="button" class="icon-btn goal-save-v163"><i class="ph ph-check"></i> Save Goal</button></div>`;document.body.appendChild(m);$('.goal-close-v163',m).onclick=()=>m.classList.add('hidden');m.onclick=e=>{if(e.target===m)m.classList.add('hidden')};$('.goal-filter-help-v163',m).onmouseenter=e=>showTransientHelpV163(e.currentTarget,'Choose categories/tags so this goal can automatically count matching Knowledge Base items whenever you add them to Daily Logs. Example: a “Learn 50 Korean nouns” goal can count category Nouns + tag Korean.');return m}
    function showTransientHelpV163(anchor,text){let tip=$('#transient-help-v163');if(!tip){tip=document.createElement('div');tip.id='transient-help-v163';tip.className='transient-help-v163';document.body.appendChild(tip)}tip.textContent=text;const r=anchor.getBoundingClientRect();tip.style.left=`${Math.min(innerWidth-330,Math.max(10,r.left))}px`;tip.style.top=`${Math.min(innerHeight-120,r.bottom+8)}px`;tip.classList.add('visible');const hide=()=>tip.classList.remove('visible');anchor.addEventListener('mouseleave',hide,{once:true})}
    function editGoalV163(tab,component,goal=null){const m=ensureGoalModalV163(),g=goal||{id:uid2('goal'),name:'',target:10,unit:'items',manualProgress:0,autoEnabled:false,categories:[],tags:[],metadataJson:'',startDate:'',endDate:''};$('.modal-header h2',m).textContent=goal?'Edit Goal':'New Goal';$('.goal-name-v163',m).value=g.name||'';$('.goal-target-v163',m).value=g.target||10;$('.goal-unit-v163',m).value=g.unit||'items';$('.goal-start-v163',m).value=g.startDate||'';$('.goal-end-v163',m).value=g.endDate||'';$('.goal-auto-v163',m).checked=!!g.autoEnabled;$('.goal-metadata-v163',m).value=g.metadataJson||'';$('.goal-categories-host-v163',m).innerHTML=choiceChipsV163(db.settings?.categories||[],g.categories||[],'goal-category-chips-v163');$('.goal-tags-host-v163',m).innerHTML=choiceChipsV163(allKbTagsV163(),g.tags||[],'goal-tag-chips-v163');const sync=()=>$('.goal-kb-filter-wrap-v163',m).classList.toggle('goal-filter-disabled-v163',!$('.goal-auto-v163',m).checked);$('.goal-auto-v163',m).onchange=sync;sync();$('.goal-save-v163',m).onclick=()=>{const name=$('.goal-name-v163',m).value.trim();if(!name){toast('Give the goal a name.');return}const metadata=$('.goal-metadata-v163',m).value.trim();if(metadata){try{JSON.parse(metadata)}catch{toast('Other field filters must be valid JSON.');return}}Object.assign(g,{name,target:Math.max(1,Number($('.goal-target-v163',m).value)||1),unit:$('.goal-unit-v163',m).value.trim()||'items',startDate:$('.goal-start-v163',m).value,endDate:$('.goal-end-v163',m).value,autoEnabled:$('.goal-auto-v163',m).checked,categories:$$('.goal-category-chips-v163 input:checked',m).map(x=>x.value),tags:$$('.goal-tag-chips-v163 input:checked',m).map(x=>x.value),metadataJson:metadata});component.goals||=[];if(!goal)component.goals.push(g);saveDb();m.classList.add('hidden');renderCustomTabView(tab.id)};m.classList.remove('hidden');requestAnimationFrame(()=>$('.goal-name-v163',m)?.focus())}
    function renderGoalsV163(tab,component,content){component.goals=Array.isArray(component.goals)?component.goals:[];content.innerHTML=`<div class="custom-collection-header"><h2>${esc(component.title||'Goals')}</h2><button type="button" class="small-icon-btn goals-add-v163"><i class="ph ph-plus"></i></button></div><div class="goals-list-v163"></div>`;$('.goals-add-v163',content).onclick=()=>editGoalV163(tab,component);const list=$('.goals-list-v163',content);component.goals.forEach(g=>{const auto=autoGoalV163(g),cur=Math.max(0,Number(g.manualProgress||0)+auto),target=Math.max(1,Number(g.target)||1),pct=Math.min(100,Math.round(cur/target*100));const card=document.createElement('article');card.className='goal-card-v162 custom-searchable-item';card.dataset.searchText=`${g.name||''} ${(g.categories||[]).join(' ')} ${(g.tags||[]).join(' ')}`.toLowerCase();card.innerHTML=`<div class="goal-card-top-v162"><div><strong>${esc(g.name||'Goal')}</strong><small>${cur} / ${target} ${esc(g.unit||'items')}${g.autoEnabled&&auto?` · ${auto} automatic`:''}</small></div><button type="button" class="small-icon-btn goal-edit-v163"><i class="ph ph-pencil-simple"></i></button></div><div class="progress-bar-track"><div class="progress-bar-fill" style="width:${pct}%"></div></div><div class="goal-card-bottom-v163"><span>${pct}%</span><div><button type="button" class="small-icon-btn goal-minus-v163"><i class="ph ph-minus"></i></button><button type="button" class="small-icon-btn goal-plus-v163"><i class="ph ph-plus"></i></button></div></div>`;$('.goal-edit-v163',card).onclick=()=>editGoalV163(tab,component,g);$('.goal-minus-v163',card).onclick=()=>{g.manualProgress=Math.max(0,Number(g.manualProgress||0)-1);saveDb();renderCustomTabView(tab.id)};$('.goal-plus-v163',card).onclick=()=>{g.manualProgress=Math.max(0,Number(g.manualProgress||0)+1);saveDb();renderCustomTabView(tab.id)};card.oncontextmenu=e=>{e.preventDefault();showCustomItemContextMenu(e.clientX,e.clientY,[{label:'Edit goal',icon:'ph-pencil-simple',action:()=>editGoalV163(tab,component,g)},{label:'Delete goal',icon:'ph-trash',danger:true,action:async()=>{const ok=await showAppConfirm({title:'Delete Goal',message:`Delete “${g.name||'this goal'}”?`,confirmLabel:'Delete'});if(!ok)return;component.goals=component.goals.filter(x=>x.id!==g.id);saveDb();renderCustomTabView(tab.id)}}])};list.appendChild(card)});if(!component.goals.length)list.innerHTML='<div class="custom-feature-empty-v162">No goals yet.</div>'}

    // Override component rendering for requested refined types.
    try{
        const beforeRender=renderCustomComponentContent;
        renderCustomComponentContent=function(tab,component,content){
            if(component?.type==='search') return renderSearchV163(content,component,false);
            if(component?.type==='globalSearchV163') return renderSearchV163(content,component,true);
            if(component?.type==='categoryBar') return renderCategoryV163(tab,component,content);
            if(component?.type==='qaV162') return renderQaV163(tab,component,content);
            if(component?.type==='goalsV162') return renderGoalsV163(tab,component,content);
            return beforeRender.apply(this,arguments);
        };
    }catch{}

    // ---------------- Contextual help for every component ----------------
    const HELP={
      heading:['Heading','Adds a visual section title.','Use it to divide a tab into clear sections.','Example: “Weekly Review”'],text:['Text','Freeform notes or instructions.','Good for summaries, directions, or reference text.','Example: “Remember to review verbs.”'],search:['Local Search','Searches only the component directly below it.','Place it immediately above a large list, cards, checklist, or collection.','Example: type “Korean” to filter the list below.'],globalSearchV163:['Global Search','Searches every component below it in this tab.','Best near the top of a long custom tab.','Example: one search filters cards + checklist + resources below.'],categoryBar:['Category Bar','Groups small items into switchable categories.','Right-click a category to rename it; use the folder-plus and plus buttons to add categories/items.','Example: Grammar | Vocabulary | Listening'],cards:['Cards','Flexible title + body cards.','Store short notes, ideas, facts, or mini records.','Example: “Concept” / “What it means…”'],polaroids:['Polaroids','Visual cards for images and supported media.','Useful for memories, references, moodboards, or progress photos.','Example: photo + caption'],checklist:['Checklist','Track tasks with completion dates.','Add, edit, check off, and delete items.','Example: □ Review 10 flashcards'],practiceLog:['Practice Log','Stores dated practice sessions and minutes.','Use it for music, language, art, fitness skills, etc.','Example: Scales · 30 min'],progressMeter:['Progress Meter','Manual numeric progress toward a target.','Use +/− and edit the target/unit by right-clicking.','Example: 7 / 20 lessons'],skillRatings:['Skill Ratings','Rates skills from 1–5 stars.','Track confidence across several sub-skills.','Example: Pronunciation ★★★★☆'],vocabulary:['Vocabulary','Stores terms, meanings, and notes.','Useful for language or subject-specific terms.','Example: casa → house'],resources:['Resources','Stores named links with notes.','Keep videos, articles, docs, and reference sites together.','Example: “Lesson 4 video” ↗'],dailyLogCollection:['Daily Log Collection','Surfaces selected Daily Log content.','Use it to review recurring activity across days.','Example: recent logs'],milestones:['Milestones','Checklist-style major achievements.','Completed milestones retain their completion date.','Example: “Finish Unit 1”'],projectGallery:['Project Gallery','Stores project images with titles and notes.','Useful for before/after or portfolio snapshots.','Example: sketch image + note'],recipeTracker:['Recipe Tracker','Stores repeatable recipe/project records.','Useful for recipes and structured creations.','Example: Bread · baked twice'],tableV162:['Table','Editable rows, columns, and cells.','Use it for structured comparisons or trackers.','Example: Date | Topic | Score'],qaV162:['Q&A','Stores questions and synced answers.','Expand a question, answer it here or from a Daily Log, and follow Daily Log references.','Example: “Why does this chord work?” ▸'],goalsV162:['Goals','Tracks manual and automatic progress.','Automatic progress can count matching KB categories/tags added to Daily Logs.','Example: 22 / 50 Korean nouns'],customKnowledgeBaseV453:['Knowledge Base','An independent Knowledge Base stored only inside this custom tab.','It has its own categories, fields, placeholders, and items and does not read or change the log page Knowledge Base.','Example: a separate research glossary'],kbDynamicCollectionV162:['Dynamic Collection','Automatically shows matching Knowledge Base items.','Filter by category/tags/metadata and display as cards or polaroids.','Example: all “Chord” items tagged jazz'],divider:['Divider','Adds visual separation.','Use between sections without adding content.','Example: ─────────'],spacer:['Spacer','Adds empty breathing room.','Use to visually separate groups of components.','Example: 36px blank space']
    };
    function decorateComponentHelpV163(tab,canvas){
        $$('.custom-tab-component',canvas).forEach((wrap,i)=>{if($('.custom-component-help-v163',wrap))return;const component=tab.components?.[i]||tab.components?.find(x=>x.id===wrap.dataset.componentId);if(!component)return;const def=HELP[component.type]||[CUSTOM_COMPONENT_LIBRARY.find(x=>x.type===component.type)?.label||'Component','Reusable custom-tab component.','Configure it in edit mode.','Example: customize this component'];const b=document.createElement('button');b.type='button';b.className='custom-component-help-v163';b.textContent='?';b.setAttribute('aria-label',`About ${def[0]}`);const tip=document.createElement('div');tip.className='custom-component-help-tooltip-v163';tip.innerHTML=`<strong>${esc(def[0])}</strong><span>${esc(def[1])}</span><span>${esc(def[2])}</span><small>${esc(def[3])}</small>`;b.appendChild(tip);wrap.appendChild(b)})
    }
    try{const beforeCanvas=renderCustomCanvas;renderCustomCanvas=function(tab,canvas){const r=beforeCanvas.apply(this,arguments);decorateComponentHelpV163(tab,canvas);return r}}catch{}

    // Remove fixed builder-only clutter and the old create-tab Daily Log source section.
    function cleanCustomTabUiV163(){
        $$('.custom-tab-daily-source-section,.custom-tab-connections-option-v32,.custom-tab-pin-toggle').forEach(x=>x.remove());
        $$('.tab-save-template-v162,.tab-update-template-v162').forEach(x=>x.classList.add('full-width-v163'));
    }
    try{const beforeSettings=ensureCustomTabSettingsModal;ensureCustomTabSettingsModal=function(){const r=beforeSettings.apply(this,arguments);cleanCustomTabUiV163();return r}}catch{}

    // ---------------- KB: direct delete + range multi-select + right-click delete ----------------
    const kbSelectionV163=new Set(); let kbSelectModeV163=false; let kbLastSelectedIdV164=null;
    async function deleteKbIdsV163(ids){ids=[...new Set(ids)].filter(id=>(db.phrases||[]).includes(id));if(!ids.length)return;const ok=await showAppConfirm({title:ids.length===1?'Delete Knowledge Base Item':'Delete Selected Items',message:ids.length===1?`Move “${ids[0]}” to Trash?`:`Move ${ids.length} selected Knowledge Base items to Trash?`,confirmLabel:ids.length===1?'Delete':'Delete Selected'});if(!ok)return;ids.forEach(id=>{try{moveKnowledgeItemToTrash(id)}catch{}});kbSelectionV163.clear();kbLastSelectedIdV164=null;kbSelectModeV163=false;try{renderPhrasesLibrary($('#phrases-search-bar')?.value||'')}catch{}}
    function ensureKbSelectionToolbarV163(){const header=$('#phrases-library-view .log-header-container > div:last-child');if(!header)return;let select=$('#kb-select-toggle-v163');if(!select){select=document.createElement('button');select.id='kb-select-toggle-v163';select.className='icon-btn';select.title='Select multiple items';select.innerHTML='<i class="ph ph-check-square-offset"></i>';select.onclick=()=>{kbSelectModeV163=!kbSelectModeV163;if(!kbSelectModeV163){kbSelectionV163.clear();kbLastSelectedIdV164=null}renderPhrasesLibrary($('#phrases-search-bar')?.value||'')};header.insertBefore(select,$('#add-phrase-library-btn'))}let bar=$('#kb-selection-bar-v163');if(!bar){bar=document.createElement('div');bar.id='kb-selection-bar-v163';bar.className='kb-selection-bar-v163 hidden';bar.innerHTML='<span class="kb-selection-count-v163">0 selected</span><span class="progress-hint kb-selection-hint-v164">Shift-click to select a range · right-click a selected item for bulk actions</span>';$('#phrases-search-bar')?.insertAdjacentElement('afterend',bar)}bar.classList.toggle('hidden',!kbSelectModeV163);$('.kb-selection-count-v163',bar).textContent=`${kbSelectionV163.size} selected`;select.classList.toggle('selected',kbSelectModeV163)}

    // V467 — Knowledge Base shortcuts + in-modal shortcut reference.
    function kbViewVisibleV467(){
        const view=document.getElementById('phrases-library-view');
        // V598: "active" is the actual top-level view authority. Older checks
        // based only on hidden/display could disagree with the tab router.
        return !!view && (view.classList.contains('active') || (!view.classList.contains('hidden') && view.getClientRects().length > 0));
    }
    function ensureKbShortcutDefaultsV467(){
        db.settings||={};
        db.settings.kbShortcutsV467||={};
        if(!db.settings.kbShortcutsV467.bulkAdd)db.settings.kbShortcutsV467.bulkAdd='Shift+=';
        if(!db.settings.kbShortcutsV467.bulkHidden)db.settings.kbShortcutsV467.bulkHidden='Shift+H';
        const legacySelect=String(db.settings.kbShortcutsV467.bulkSelect||'').replace(/\s+/g,'').toLowerCase();
        if(!db.settings.kbShortcutsV467.bulkSelect || legacySelect==='shift+delete' || legacySelect==='shift+del') db.settings.kbShortcutsV467.bulkSelect='Shift+S';
        if('bulkDelete' in db.settings.kbShortcutsV467) delete db.settings.kbShortcutsV467.bulkDelete;
    }
    function kbShortcutMainKeyV667(event){
        const code=String(event.code||'');
        if(/^Key[A-Z]$/.test(code))return code.slice(3);
        if(/^Digit[0-9]$/.test(code))return code.slice(5);
        const byCode={Equal:'=',Minus:'-',Period:'.',Comma:',',Slash:'/',Backslash:'\\',Semicolon:';',Quote:"'",BracketLeft:'[',BracketRight:']',Backquote:'`'};
        if(byCode[code])return byCode[code];
        const key=String(event.key||'').trim();
        if(!key||['Shift','Control','Alt','Meta'].includes(key))return '';
        if(key===' ')return 'Space';
        if(key.length===1)return key.toUpperCase();
        return key;
    }
    function kbShortcutFromEventV667(event){
        const main=kbShortcutMainKeyV667(event); if(!main)return '';
        const parts=[];
        if(event.ctrlKey)parts.push('Ctrl');
        if(event.altKey)parts.push('Alt');
        if(event.shiftKey)parts.push('Shift');
        if(event.metaKey)parts.push('Meta');
        parts.push(main);
        return parts.join('+');
    }
    function kbShortcutMatchesV667(event,shortcut){
        const wanted=String(shortcut||'').split('+').map(x=>x.trim()).filter(Boolean);
        if(!wanted.length)return false;
        const has=name=>wanted.some(x=>x.toLowerCase()===name.toLowerCase());
        if(!!event.ctrlKey!==has('Ctrl')||!!event.altKey!==has('Alt')||!!event.shiftKey!==has('Shift')||!!event.metaKey!==has('Meta'))return false;
        const main=wanted.find(x=>!['ctrl','alt','shift','meta'].includes(x.toLowerCase()))||'';
        return kbShortcutMainKeyV667(event).toLowerCase()===main.toLowerCase();
    }
    function kbShortcutButtonLabelV667(value){return String(value||'').replace(/\+/g,' + ')}
    function bindKbShortcutCaptureV667(section){
        section.querySelectorAll('[data-kb-shortcut-v667]').forEach(button=>{
            const key=button.dataset.kbShortcutV667;
            button.textContent=kbShortcutButtonLabelV667(db.settings.kbShortcutsV467?.[key]);
            if(button.dataset.boundV667==='1')return;
            button.dataset.boundV667='1';
            button.addEventListener('click',()=>{
                button.classList.add('capturing');
                const before=button.textContent;
                button.textContent='Press shortcut…';
                const capture=event=>{
                    event.preventDefault(); event.stopPropagation(); event.stopImmediatePropagation();
                    if(event.key==='Escape'){
                        document.removeEventListener('keydown',capture,true);
                        button.classList.remove('capturing'); button.textContent=before; return;
                    }
                    const next=kbShortcutFromEventV667(event); if(!next)return;
                    db.settings.kbShortcutsV467[key]=next;
                    try{saveDb()}catch{}
                    document.removeEventListener('keydown',capture,true);
                    button.classList.remove('capturing'); button.textContent=kbShortcutButtonLabelV667(next);
                };
                setTimeout(()=>document.addEventListener('keydown',capture,true),0);
            });
        });
    }
    function ensureKbShortcutsSectionV467(){
        ensureKbShortcutDefaultsV467();
        const modal=document.getElementById('settings-modal');
        const box=modal?.querySelector('.modal-box');
        if(!box)return;
        let section=document.getElementById('kb-shortcuts-v467');
        if(!section){section=document.createElement('div');section.id='kb-shortcuts-v467';section.className='modal-section kb-shortcuts-v467';box.appendChild(section)}
        else if(section.parentElement!==box)box.appendChild(section);
        section.innerHTML=`<span class="field-label">Knowledge Base Page Shortcuts</span><div class="kb-shortcut-editor-list-v667"><div class="kb-shortcut-editor-row-v667"><span>Bulk Add Knowledge Base Items</span><button type="button" class="kb-shortcut-capture-v667" data-kb-shortcut-v667="bulkAdd"></button></div><div class="kb-shortcut-editor-row-v667"><span>Show or hide #hide items</span><button type="button" class="kb-shortcut-capture-v667" data-kb-shortcut-v667="bulkHidden"></button></div><div class="kb-shortcut-editor-row-v667"><span>Multi Select</span><button type="button" class="kb-shortcut-capture-v667" data-kb-shortcut-v667="bulkSelect"></button></div></div>`;
        bindKbShortcutCaptureV667(section);
    }
    ensureKbShortcutDefaultsV467();
    document.addEventListener('keydown',event=>{
        if(!kbViewVisibleV467())return;

        // V671: Escape always exits Knowledge Base multi-select mode.
        // This works even if a KB search/input currently has focus.
        if(event.key==='Escape'){
            const selectButton=document.getElementById('kb-select-toggle-v163');
            if(selectButton?.classList.contains('selected')){
                event.preventDefault();
                event.stopPropagation();
                event.stopImmediatePropagation();
                selectButton.click();
                return;
            }
        }

        // V598: Shift+H is a KB-view command, not a typing command.
        // It must still work while the KB search box or an Add/Edit input has
        // focus. Handle it BEFORE the generic typing guard.
        if(!event.repeat && kbShortcutMatchesV667(event,db.settings?.kbShortcutsV467?.bulkHidden)){
            event.preventDefault();
            event.stopPropagation();
            event.stopImmediatePropagation();
            setShowHiddenKbItemsV597(!window.__loggyShowHiddenKbItemsV597);
            return;
        }

        const target=event.target;
        const typing=target?.matches?.('input,textarea,select,[contenteditable="true"],[role="textbox"]');
        if(typing)return;

        if(kbShortcutMatchesV667(event,db.settings?.kbShortcutsV467?.bulkAdd)){
            event.preventDefault();event.stopPropagation();
            const button=document.getElementById('kb-bulk-add-btn-v162');
            if(button){button.click();return;}
            try{ensureBulkImportV162();}catch{}
            requestAnimationFrame(()=>document.getElementById('kb-bulk-add-btn-v162')?.click());
            return;
        }
        if(kbShortcutMatchesV667(event,db.settings?.kbShortcutsV467?.bulkSelect)){
            event.preventDefault();event.stopPropagation();event.stopImmediatePropagation();
            const selectButton=document.getElementById('kb-select-toggle-v163');
            if(selectButton){selectButton.click();return;}
            kbSelectModeV163=!kbSelectModeV163;
            if(!kbSelectModeV163){kbSelectionV163.clear();kbLastSelectedIdV164=null;}
            try{renderPhrasesLibrary($('#phrases-search-bar')?.value||'')}catch{}
        }
    },true);
    // V596: do not watch the entire document just to detect one Settings modal.
    // Observe that modal's own visibility class only.
    const kbSettingsModalV596=document.getElementById('settings-modal');
    if(kbSettingsModalV596){
        const kbSettingsObserverV596=new MutationObserver(()=>{
            if(!kbSettingsModalV596.classList.contains('hidden')) ensureKbShortcutsSectionV467();
        });
        kbSettingsObserverV596.observe(kbSettingsModalV596,{attributes:true,attributeFilter:['class']});
    }
    document.addEventListener('click',event=>{if(event.target.closest?.('#open-settings-btn,#knowledge-settings-btn,#open-kb-settings-btn'))setTimeout(ensureKbShortcutsSectionV467,0)},true);
    function toggleKbSelectionV164(id,shiftKey,cards){const ordered=cards.map(card=>card.dataset.kbItemIdV163).filter(Boolean);if(shiftKey&&kbLastSelectedIdV164&&ordered.includes(kbLastSelectedIdV164)&&ordered.includes(id)){const a=ordered.indexOf(kbLastSelectedIdV164),b=ordered.indexOf(id);ordered.slice(Math.min(a,b),Math.max(a,b)+1).forEach(itemId=>kbSelectionV163.add(itemId))}else{kbSelectionV163.has(id)?kbSelectionV163.delete(id):kbSelectionV163.add(id)}kbLastSelectedIdV164=id}
    function decorateKbCardsV163(){ensureKbSelectionToolbarV163();const grid=$('#phrases-library-grid');if(!grid)return;const cards=$$('.phrase-card,.polaroid-card',grid);const filterText=$('#phrases-search-bar')?.value||'';const visibleIds=(db.phrases||[]).filter(id=>window.__loggyShowHiddenKbItemsV597===true||!((db.phrase_meta?.[id]?.tags||[]).map(t=>String(t||'').replace(/^#/,'').toLowerCase()).some(t=>t==='hide'||t==='lazy'))).filter(id=>libraryFilter==='all'||db.phrase_meta?.[id]?.type===libraryFilter).filter(id=>String(id).toLowerCase().includes(String(filterText).toLowerCase())).sort();cards.forEach((card,cardIndex)=>{let id=card.dataset.kbItemIdV162||card.dataset.itemId||card.dataset.phrase||card.dataset.id||visibleIds[cardIndex];if(!id){const txt=(card.querySelector('strong,.phrase-card-title,.polaroid-caption,.chip-text')?.textContent||card.textContent||'').trim();id=(db.phrases||[]).find(x=>{try{return window.__loggyV162?.getKnowledgeDisplayLabel?.(x,'kb')===txt||x===txt}catch{return x===txt}})}if(id)card.dataset.kbItemIdV163=id});cards.forEach(card=>{const id=card.dataset.kbItemIdV163;if(!id)return;card.classList.toggle('kb-selected-v163',kbSelectionV163.has(id));if(kbSelectModeV163){let c=$('.kb-select-check-v163',card);if(!c){c=document.createElement('span');c.className='kb-select-check-v163';c.innerHTML='<i class="ph ph-check"></i>';card.appendChild(c)}c.classList.toggle('selected',kbSelectionV163.has(id));if(!card.dataset.kbSelectBoundV164){card.dataset.kbSelectBoundV164='1';card.addEventListener('click',e=>{if(!kbSelectModeV163)return;e.preventDefault();e.stopImmediatePropagation();const itemId=card.dataset.kbItemIdV163;if(!itemId)return;toggleKbSelectionV164(itemId,!!e.shiftKey,cards);decorateKbCardsV163()},true)}}else $('.kb-select-check-v163',card)?.remove();card.oncontextmenu=e=>{e.preventDefault();if(kbSelectModeV163){if(!kbSelectionV163.has(id)){kbSelectionV163.add(id);kbLastSelectedIdV164=id;decorateKbCardsV163()}const ids=[...kbSelectionV163];showCustomItemContextMenu(e.clientX,e.clientY,[{label:`Delete ${ids.length} selected`,icon:'ph-trash',danger:true,action:()=>deleteKbIdsV163(ids)}]);return}showCustomItemContextMenu(e.clientX,e.clientY,[{label:'Open item',icon:'ph-eye',action:()=>openItemModal(id,true)},{label:'Delete item',icon:'ph-trash',danger:true,action:()=>deleteKbIdsV163([id])}])}});const view=db.settings?.libraryView||'list';if(view==='polaroid'){const active=(libraryFilter&&libraryFilter!=='all'?libraryFilter:null);const cfg=active?db.settings?.categorySettings?.[active]:null;const count=Math.max(1,Math.min(8,Number(cfg?.polaroidsPerRowV163||db.settings.polaroidsPerRowV163||4)));grid.style.setProperty('--kb-polaroids-per-row-v163',String(count));grid.classList.toggle('kb-polaroid-horizontal-v163',(cfg?.polaroidOrientationV163||db.settings.polaroidOrientationV163)==='horizontal');cards.forEach(card=>{if(cfg?.hideTagsInPolaroidV163||db.settings.hideTagsInPolaroidV163){$('.kb-tags-v163',card)?.remove();return}const id=card.dataset.kbItemIdV163;let tags=[];try{tags=getKnowledgeItemTagsV55(id)||[]}catch{tags=db.phrase_meta?.[id]?.tags||[]}if(tags.length&&!$('.kb-tags-v163',card)){const t=document.createElement('div');t.className='kb-tags-v163';t.innerHTML=tags.map(x=>`<span>#${esc(String(x).replace(/^#/,''))}</span>`).join('');card.appendChild(t)}})}}
    try{const beforeLibrary=renderPhrasesLibrary;renderPhrasesLibrary=function(){const r=beforeLibrary.apply(this,arguments);requestAnimationFrame(decorateKbCardsV163);return r}}catch{}

    function ensureKbPolaroidSettingsV163(){const modal=$('#settings-modal');if(!modal)return;const row=$('#settings-hide-categories-row');if(!row||$('#kb-polaroid-options-v163'))return;const box=document.createElement('div');box.id='kb-polaroid-options-v163';box.className='kb-polaroid-options-v163';box.innerHTML=`<label><input type="checkbox" class="kb-hide-tags-v163"> <span>Hide tags in this view</span></label><label><span class="field-label">Polaroid orientation</span><select class="kb-polaroid-orientation-v163"><option value="vertical">Vertical</option><option value="horizontal">Horizontal</option></select></label><label><span class="field-label">Polaroids per row</span><select class="kb-polaroids-row-v163">${[1,2,3,4,5,6,7,8].map(n=>`<option value="${n}">${n}</option>`).join('')}</select></label>`;row.insertAdjacentElement('afterend',box);const cfg=()=>{const cat=typeof activeCategorySettingTab!=='undefined'?activeCategorySettingTab:null;return cat?(db.settings.categorySettings[cat]||={}):db.settings};const sync=()=>{const c=cfg();$('.kb-hide-tags-v163',box).checked=!!c.hideTagsInPolaroidV163;$('.kb-polaroid-orientation-v163',box).value=c.polaroidOrientationV163||'vertical';$('.kb-polaroids-row-v163',box).value=String(c.polaroidsPerRowV163||4)};box.onchange=()=>{const c=cfg();c.hideTagsInPolaroidV163=$('.kb-hide-tags-v163',box).checked;c.polaroidOrientationV163=$('.kb-polaroid-orientation-v163',box).value;c.polaroidsPerRowV163=Number($('.kb-polaroids-row-v163',box).value)||4;saveDb();try{renderPhrasesLibrary($('#phrases-search-bar')?.value||'')}catch{}};sync();modal.addEventListener('click',e=>{if(e.target.closest('#settings-category-tabs'))setTimeout(sync,0)})}

    // Placeholder toggle: only reveal details while enabled + contextual use cases.
    function polishPlaceholderSettingsV163(){const section=$('.kb-placeholder-settings-v56,#kb-placeholder-settings-v56');if(!section)return;const toggle=$('input[type="checkbox"]',section);if(!toggle)return;let help=$('.placeholder-help-v163',section);if(!help){help=document.createElement('button');help.type='button';help.className='help-dot-v163 placeholder-help-v163';help.textContent='?';help.onmouseenter=()=>showTransientHelpV163(help,'Placeholders make reusable patterns. Language example: “I am NOUN” can swap NOUN with matching vocabulary items. Chemistry example: “ELEMENT + O₂ → OXIDE” can reuse element/compound slots to practice reaction patterns.');section.querySelector('strong,.field-label')?.insertAdjacentElement('afterend',help)}const detail=$$('.kb-placeholder-chips-v56,.kb-placeholder-add-v56',section);const sync=()=>detail.forEach(x=>x.classList.toggle('hidden',!toggle.checked));toggle.addEventListener('change',sync);sync()}

    // ---------------- Recommendation: toggle-first setup + choice lists ----------------
    function recommendationCfgV163(){db.settings||={};db.settings.dailyRecommendationV162||={enabled:false,paused:false,title:'Daily Recommendation',mode:'filter',categories:[],tags:[],learnedState:'any',partsState:'any',placeholderType:'',metadataJson:'',orderedItems:[],endBehavior:'stop'};return db.settings.dailyRecommendationV162}
    function enhanceRecommendationModalV163(){const m=$('#recommendation-modal-v162');if(!m)return;$('.rec-enabled-v162',m)?.closest('label')?.classList.add('hidden');const meta=$('.rec-metadata-v162',m),ordered=$('.rec-ordered-v162',m);if(meta&&!meta.placeholder)meta.placeholder='{"Language":"Korean","Difficulty":"Beginner"}';if(ordered)ordered.placeholder='["apple","banana","cherry"]\n—or one item ID per line';$('.rec-save-v162',m)?.classList.add('padded-action-v163');function choices(input,values,cls){if(!input||input.dataset.choiceEnhancedV163)return;input.dataset.choiceEnhancedV163='1';input.classList.add('hidden');const host=document.createElement('div');host.className=`choice-chips-v163 ${cls}`;input.insertAdjacentElement('afterend',host);const selected=()=>new Set(String(input.value||'').split(',').map(x=>x.trim().replace(/^#/,'')).filter(Boolean));const draw=()=>{const sel=selected();host.innerHTML=values().length?values().map(v=>`<label class="choice-chip-v163"><input type="checkbox" value="${esc(v)}" ${sel.has(v)?'checked':''}><span>${esc(v)}</span></label>`).join(''):'<span class="progress-hint">None exist yet.</span>';$$('input',host).forEach(c=>c.onchange=()=>{input.value=$$('input:checked',host).map(x=>x.value).join(', ')})};draw()};choices($('.rec-categories-v162',m),()=>db.settings?.categories||[],'rec-category-chips-v163');choices($('.rec-tags-v162',m),allKbTagsV163,'rec-tag-chips-v163');const ph=$('.rec-placeholder-v162',m);if(ph&&ph.tagName==='INPUT'&&!ph.dataset.replacedV163){const values=[];try{const s=ensurePlaceholderSettingsV56();(Array.isArray(s)?s:Object.keys(s?.types||s?.placeholders||{})).forEach(x=>values.push(x))}catch{};const sel=document.createElement('select');sel.className=ph.className;sel.dataset.replacedV163='1';sel.innerHTML='<option value="">Any placeholder type</option>'+[...new Set(values)].map(v=>`<option value="${esc(v)}">${esc(v)}</option>`).join('');sel.value=ph.value;ph.replaceWith(sel)}}
    function ensureRecommendationToggleV163(){
        // V194: both Daily Settings surfaces must get the same recommendation
        // toggle. querySelector() used to stop at #daily-settings-modal, so the
        // gear-opened local Daily Logs modal could permanently miss the toggle.
        const modals=$$('#daily-settings-modal,#daily-logs-local-settings-modal');
        if(!modals.length)return;
        modals.forEach(modal=>{
            $$('.daily-recommendation-settings-row-v162b',modal).forEach(node=>node.remove());
            if($('.daily-recommend-toggle-row-v163',modal))return;
            const box=$('.modal-box',modal);if(!box)return;
            const row=document.createElement('label');
            row.className='modal-section daily-recommend-toggle-row-v163';
            row.innerHTML='<span class="daily-recommend-toggle-copy-v163"><strong>Daily Knowledge Base Recommendation</strong><small>Show one suggested Knowledge Base item near the top of each Daily Log.</small></span><input type="checkbox" class="daily-recommend-toggle-v163">';
            box.appendChild(row);
            const input=$('.daily-recommend-toggle-v163',row);
            input.checked=!!recommendationCfgV163().enabled;
            input.onchange=()=>{const c=recommendationCfgV163();c.enabled=input.checked;saveDb();if(input.checked){try{window.__loggyV162?.openRecommendationSettings?.();setTimeout(enhanceRecommendationModalV163,0)}catch{}}else $('#daily-recommendation-v162')?.classList.add('hidden')};
        });
    }
    try{const beforeEnsureDaily=ensureDailyLogsSettingsModal;ensureDailyLogsSettingsModal=function(){const r=beforeEnsureDaily.apply(this,arguments);ensureRecommendationToggleV163();return r}}catch{}
    try{const beforeOpenDaily=openDailyLogsLocalSettings;openDailyLogsLocalSettings=function(){const r=beforeOpenDaily.apply(this,arguments);setTimeout(ensureRecommendationToggleV163,0);return r}}catch{}
    document.addEventListener('click',e=>{if(e.target.closest('.daily-recommendation-settings-v162'))setTimeout(enhanceRecommendationModalV163,0)},true);

    // ---------------- Custom cursor / companion creation, prompt generation, deletion ----------------
    const CUR_KEY='loggy-custom-cursors-v163',COMP_KEY='loggy-custom-companions-v163',HIDE_CUR='loggy-hidden-cursors-v163',HIDE_COMP='loggy-hidden-companions-v163';
    const customCursors=()=>readJson(CUR_KEY,[]),customComps=()=>readJson(COMP_KEY,[]),hiddenCursors=()=>new Set(readJson(HIDE_CUR,[])),hiddenComps=()=>new Set(readJson(HIDE_COMP,[]));
    function sanitizeSvgV163(raw){const s=String(raw||'').trim();if(!/^<svg[\s>]/i.test(s))throw new Error('Paste one complete <svg>…</svg> element.');const doc=new DOMParser().parseFromString(s,'image/svg+xml');if(doc.querySelector('parsererror')||doc.documentElement.tagName.toLowerCase()!=='svg')throw new Error('That SVG could not be parsed.');doc.querySelectorAll('script,foreignObject,iframe,object,embed,image,audio,video').forEach(n=>n.remove());doc.querySelectorAll('*').forEach(el=>{[...el.attributes].forEach(a=>{const n=a.name.toLowerCase(),v=a.value.toLowerCase();if(n.startsWith('on')||((n==='href'||n==='xlink:href')&&!a.value.startsWith('#'))||v.includes('javascript:')||v.includes('http://')||v.includes('https://'))el.removeAttribute(a.name)})});const root=doc.documentElement;root.setAttribute('xmlns','http://www.w3.org/2000/svg');if(!root.getAttribute('viewBox'))root.setAttribute('viewBox','0 0 100 100');root.setAttribute('width','40');root.setAttribute('height','40');return new XMLSerializer().serializeToString(root)}
    function colorsFromSvgV163(svg){const found=[...String(svg).matchAll(/#[0-9a-f]{6}\b/ig)].map(m=>m[0]);return [found[0]||'#7c3aed',found[1]||'#f9a8d4']}
    function installAccessoriesV163(){const hc=hiddenCursors(),hp=hiddenComps();customCursors().forEach(r=>{if(!CURSOR_OPTIONS.some(x=>x.id===r.id))CURSOR_OPTIONS.push({id:r.id,name:r.name,kind:'image',svg:r.svg,emoji:'✦',customUserV163:true,trailV163:r.trail})});customComps().forEach(r=>{if(!COMPANIONS.some(x=>x.id===r.id))COMPANIONS.push({id:r.id,name:r.name,type:r.type||'land',svg:r.svg,customUserV163:true})});return{hc,hp}}
    async function copyTextV163(text,msg){let ok=false;try{await navigator.clipboard.writeText(text);ok=true}catch{const ta=document.createElement('textarea');ta.value=text;document.body.appendChild(ta);ta.select();try{ok=document.execCommand('copy')}catch{}ta.remove()}toast(ok?msg:'Could not copy the prompt.')}
    function ensureAccessoryModalV163(kind){const id=`${kind}-maker-modal-v163`;let m=document.getElementById(id);if(m)return m;const isCursor=kind==='cursor';m=document.createElement('div');m.id=id;m.className='modal-overlay hidden';m.innerHTML=`<div class="modal-box accessory-maker-box-v163"><div class="modal-header"><h2>${isCursor?'Add Mouse Pointer':'Add Companion'}</h2><button type="button" class="small-icon-btn accessory-close-v163"><i class="ph ph-x"></i></button></div><div class="modal-section"><span class="field-label">Name</span><input class="accessory-name-v163" placeholder="${isCursor?'Moon Wand':'Tiny Red Dragon'}"></div>${isCursor?`<div class="modal-section"><span class="field-label">Theme / vibe</span><textarea class="accessory-idea-v163" placeholder="e.g. dreamy lavender celestial, silver stars, soft glow"></textarea></div><div class="modal-section"><span class="field-label">Matching trail</span><select class="accessory-type-v163"><option value="sparkles">Sparkles</option><option value="hearts">Hearts</option><option value="dots">Soft dots</option><option value="stars">Stars</option></select></div>`:`<div class="modal-section"><span class="field-label">What should the companion be?</span><input class="accessory-subject-v163" placeholder="e.g. tiny red dragon"></div><div class="modal-section"><span class="field-label">Style / theme</span><textarea class="accessory-idea-v163" placeholder="e.g. cozy storybook, rounded shapes, warm autumn colors"></textarea></div><div class="modal-section"><span class="field-label">Movement type</span><select class="accessory-type-v163"><option value="land">Land / walking</option><option value="water">Water / swimming</option><option value="air">Air / flying</option></select></div>`}<button type="button" class="icon-btn accessory-copy-prompt-v163"><i class="ph ph-copy"></i> Copy AI SVG Prompt</button><div class="modal-section"><span class="field-label">Paste SVG code</span><textarea class="accessory-svg-v163" rows="10" placeholder="<svg viewBox=&quot;0 0 100 100&quot; ...>...</svg>"></textarea></div><button type="button" class="icon-btn accessory-save-v163"><i class="ph ph-check"></i> Add ${isCursor?'Pointer':'Companion'}</button></div>`;document.body.appendChild(m);$('.accessory-close-v163',m).onclick=()=>m.classList.add('hidden');m.onclick=e=>{if(e.target===m)m.classList.add('hidden')};$('.accessory-copy-prompt-v163',m).onclick=()=>{const name=$('.accessory-name-v163',m).value.trim()||(isCursor?'custom cursor':'custom companion'),idea=$('.accessory-idea-v163',m).value.trim()||'cohesive with my theme';const subject=$('.accessory-subject-v163',m)?.value.trim()||name,type=$('.accessory-type-v163',m).value;const prompt=isCursor?`Create ONE standalone SVG mouse pointer named "${name}" for a ${idea} theme. Output ONLY the raw <svg>...</svg> code, with no markdown or explanation. Requirements: viewBox="0 0 100 100"; transparent background; visually reads clearly at about 40x40 px; the actual pointing/hotspot tip must be near x=8,y=8 so clicks feel accurate; keep artwork inside the viewBox; use only SVG paths/shapes/gradients; NO scripts, event handlers, foreignObject, external URLs, external images, web fonts, or network resources. Make it visually polished but not cluttered. Design it so a matching ${type} cursor trail would make visual sense. Use explicit #RRGGBB colors where practical.`:`Create ONE standalone SVG companion named "${name}". Subject: ${subject}. Style/theme: ${idea}. It will be used as a small animated ${type} companion inside a web app. Output ONLY the raw <svg>...</svg> code, with no markdown or explanation. Requirements: viewBox="0 0 100 100"; transparent background; centered complete character with no cropped body parts; readable at about 40x40 px; face right by default if directional; use only SVG paths/shapes/gradients; NO scripts, event handlers, foreignObject, external URLs, external images, web fonts, or network resources. Optional animation-friendly classes are welcome: leg-1/leg-2 for walking, fish-fin/tentacle for swimming, companion-wing for flying. Use explicit #RRGGBB colors where practical.`;copyTextV163(prompt,'Copied the SVG prompt.')};$('.accessory-save-v163',m).onclick=()=>{try{const svg=sanitizeSvgV163($('.accessory-svg-v163',m).value),name=$('.accessory-name-v163',m).value.trim()||(isCursor?'Custom Pointer':'Custom Companion'),id=`user-${kind}-v163-${Date.now().toString(36)}`;if(isCursor){const [c1,c2]=colorsFromSvgV163(svg),trailType=$('.accessory-type-v163',m).value;const list=customCursors();list.push({id,name,svg,trail:{symbol:trailType==='hearts'?'♥':trailType==='stars'?'★':'✦',color:c1,accent:c2},createdAt:new Date().toISOString()});writeJson(CUR_KEY,list);db.settings.cursorStyle=id;db.settings.cursorTrails||={};db.settings.cursorTrails[id]=true}else{const list=customComps();list.push({id,name,svg,type:$('.accessory-type-v163',m).value,createdAt:new Date().toISOString()});writeJson(COMP_KEY,list);db.settings.companion=id}saveDb();installAccessoriesV163();m.classList.add('hidden');isCursor?(renderCursorPicker(),applyCursorChoice()):(renderCompanionPicker(),renderCompanion());toast(`Added ${name}.`)}catch(err){toast(err.message||'Could not add that SVG.')}};return m}
    function addAccessoryControlsV163(){const cp=$('#cursor-picker'),pp=$('#companion-picker');[[cp,'cursor'],[pp,'companion']].forEach(([picker,kind])=>{if(!picker)return;const section=picker.closest('.modal-section');if(!section||$('.accessory-add-v163',section))return;const label=$('.field-label',section);const controls=document.createElement('span');controls.className='accessory-heading-controls-v163';controls.innerHTML=`<button type="button" class="small-icon-btn accessory-add-v163" title="Add ${kind}"><i class="ph ph-plus"></i></button>`;label?.insertAdjacentElement('afterend',controls);$('.accessory-add-v163',controls).onclick=()=>{const m=ensureAccessoryModalV163(kind);$('.accessory-svg-v163',m).value='';m.classList.remove('hidden');requestAnimationFrame(()=>$('.accessory-name-v163',m)?.focus())}})}
    async function deleteAccessoryV163(kind,id,name,isCustom){const ok=await showAppConfirm({title:`Delete ${kind==='cursor'?'Mouse Pointer':'Companion'}`,message:`Remove “${name}” from the picker?`,confirmLabel:'Delete'});if(!ok)return;if(kind==='cursor'){if(isCustom){writeJson(CUR_KEY,customCursors().filter(x=>x.id!==id));const index=CURSOR_OPTIONS.findIndex(x=>x.id===id);if(index>=0)CURSOR_OPTIONS.splice(index,1)}else{const h=hiddenCursors();h.add(id);writeJson(HIDE_CUR,[...h])}if(db.settings.cursorStyle===id)db.settings.cursorStyle='default';if(db.settings.cursorTrails)delete db.settings.cursorTrails[id];saveDb();renderCursorPicker();applyCursorChoice()}else{if(isCustom)writeJson(COMP_KEY,customComps().filter(x=>x.id!==id));else{const h=hiddenComps();h.add(id);writeJson(HIDE_COMP,[...h])}if(db.settings.companion===id)db.settings.companion='none';saveDb();renderCompanionPicker();renderCompanion()}}
    try{const beforeTrail=getCursorTrailProfile;getCursorTrailProfile=function(choice){if(choice?.customUserV163&&choice.trailV163)return{...choice.trailV163,fx:'custom'};return beforeTrail.apply(this,arguments)}}catch{}
    function bindCursorDeleteV219(){const picker=$('#cursor-picker');if(!picker||picker.dataset.cursorDeleteV219==='1')return;picker.dataset.cursorDeleteV219='1';picker.addEventListener('contextmenu',e=>{const card=e.target.closest?.('.cursor-picker-option');if(!card||!picker.contains(card))return;const id=card.dataset.cursorId;if(!id||id==='default')return;e.preventDefault();e.stopImmediatePropagation();const opt=CURSOR_OPTIONS.find(x=>x.id===id);showCustomItemContextMenu(e.clientX,e.clientY,[{label:'Delete pointer',icon:'ph-trash',danger:true,action:()=>deleteAccessoryV163('cursor',id,opt?.name||id,!!opt?.customUserV163)}])},true)}
    try{const beforeCursor=renderCursorPicker;renderCursorPicker=function(){installAccessoriesV163();const r=beforeCursor.apply(this,arguments),hidden=hiddenCursors();$$('.cursor-picker-option','#cursor-picker').forEach(card=>{const id=card.dataset.cursorId;if(hidden.has(id))card.remove()});bindCursorDeleteV219();addAccessoryControlsV163();return r}}catch{}
    bindCursorDeleteV219();
    try{const beforeComp=renderCompanionPicker;renderCompanionPicker=function(){installAccessoriesV163();const r=beforeComp.apply(this,arguments),hidden=hiddenComps();$$('#companion-picker .icon-option').forEach(card=>{const name=$('small',card)?.textContent||'';const opt=COMPANIONS.find(x=>x.name===name);if(!opt)return;card.dataset.companionId=opt.id;if(hidden.has(opt.id)){card.remove();return}card.addEventListener('contextmenu',e=>{e.preventDefault();showCustomItemContextMenu(e.clientX,e.clientY,[{label:'Delete companion',icon:'ph-trash',danger:true,action:()=>deleteAccessoryV163('companion',opt.id,opt.name,!!opt.customUserV163)}])})});addAccessoryControlsV163();return r}}catch{}

    // Remove theme-grid plus card everywhere; the search-row plus is the single create control.
    function removeThemeCreateCardsV163(){$$('.theme-picker-create-card,.theme-picker-create-card-v40').forEach(x=>x.remove())}
    try{const beforeThemePicker=renderThemePicker;renderThemePicker=function(){const r=beforeThemePicker.apply(this,arguments);requestAnimationFrame(removeThemeCreateCardsV163);return r}}catch{}

    // Faster Theme Builder opening: build/prewarm the modal immediately after app initialization.
    function prewarmThemeBuilderV163(){try{ensureThemeBuilderModal?.();const m=$('#theme-builder-modal');if(m){m.classList.add('theme-builder-prewarmed-v163');requestAnimationFrame(()=>{try{installThemeBuilderSectionTabsV11?.(m)}catch{}})}}catch{}}
    if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(prewarmThemeBuilderV163,30));else setTimeout(prewarmThemeBuilderV163,30);

    // Misc requested UI polish.
    function polishV163(){installAccessoriesV163();try{renderCursorPicker()}catch{}try{renderCompanionPicker()}catch{}cleanCustomTabUiV163();ensureKbPolaroidSettingsV163();polishPlaceholderSettingsV163();ensureKbSelectionToolbarV163();decorateKbCardsV163();removeThemeCreateCardsV163();ensureRecommendationToggleV163();$$('.kb-bulk-preview-btn-v162,.kb-bulk-commit-v162,.goal-save-v162,.rec-save-v162').forEach(b=>b.classList.add('padded-action-v163'))}
    if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(polishV163,0));else setTimeout(polishV163,0);setTimeout(polishV163,700);
    try{const beforeSettings=renderSettings;renderSettings=function(){const r=beforeSettings.apply(this,arguments);requestAnimationFrame(()=>{ensureKbPolaroidSettingsV163();polishPlaceholderSettingsV163()});return r}}catch{}
    window.__loggyV163={polish:polishV163,addCursor:()=>ensureAccessoryModalV163('cursor'),addCompanion:()=>ensureAccessoryModalV163('companion'),editGoal:editGoalV163,addQuestion:addQaV163};
})();

/* V163C — Knowledge Base item view keeps Trash action directly available. */
(function(){
    try{
        const beforeOpenItemV163C=openItemModal;
        openItemModal=function(itemId,isCumulativeView=false,editInfo=false){
            const r=beforeOpenItemV163C.apply(this,arguments);
            if(isCumulativeView){
                const del=document.getElementById('phrase-modal-delete');
                if(del){del.classList.remove('hidden');del.title='Move item to Trash';}
            }
            return r;
        };
    }catch{}
})();

/* V163D — keep the component-level edit control on the refined styled flows. */
(function(){
    try{
        const beforeEditV163D=editCustomComponent;
        editCustomComponent=async function(tabId,componentId){
            const tab=getCustomTab(tabId);
            const component=tab?.components?.find(x=>x.id===componentId);
            if(component?.type==='goalsV162') return window.__loggyV163?.editGoal?.(tab,component,null);
            if(component?.type==='qaV162') return window.__loggyV163?.addQuestion?.(tab,component,null);
            return beforeEditV163D.apply(this,arguments);
        };
    }catch{}

    function syncThemeCreateButtonV163D(){
        const plus=document.querySelector('.theme-search-create-v161');
        const sample=document.getElementById('open-daily-settings-btn') || document.querySelector('#daily-settings-modal .small-icon-btn');
        if(!plus||!sample)return;
        const s=getComputedStyle(sample);
        ['background-color','color','border-top-color','border-right-color','border-bottom-color','border-left-color','border-top-width','border-right-width','border-bottom-width','border-left-width','border-top-style','border-right-style','border-bottom-style','border-left-style','border-radius','box-shadow'].forEach(prop=>{
            const value=s.getPropertyValue(prop);if(value)plus.style.setProperty(prop,value,'important');
        });
    }
    try{const beforePickerV163D=renderThemePicker;renderThemePicker=function(){const r=beforePickerV163D.apply(this,arguments);requestAnimationFrame(syncThemeCreateButtonV163D);return r}}catch{}
    document.addEventListener('click',e=>{if(e.target.closest?.('#open-daily-settings-btn,.theme-picker-card'))setTimeout(syncThemeCreateButtonV163D,0)},true);
    setTimeout(syncThemeCreateButtonV163D,300);
})();

/* ============================================================
   V164 — UI consistency, stable theme artwork, dropdown filters,
   clean new-theme creation, and Knowledge Base range selection.
   ============================================================ */
(function loggyV164(){
    'use strict';
    const $=(sel,root=document)=>root?.querySelector?.(sel)||null;
    const $$=(sel,root=document)=>Array.from(root?.querySelectorAll?.(sel)||[]);
    const esc=value=>String(value??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
    const split=value=>String(value||'').split(/[,\n]+/).map(v=>v.trim()).filter(Boolean);

    function allKbTagsV164(){
        const tags=new Set();
        try{(db.phrases||[]).forEach(id=>{let list=[];try{list=getKnowledgeItemTagsV55(id)||[]}catch{list=db.phrase_meta?.[id]?.tags||[]}list.forEach(tag=>tags.add(String(tag).replace(/^#/,'')))})}catch{}
        return [...tags].filter(Boolean).sort((a,b)=>a.localeCompare(b));
    }
    function placeholderTypesV164(){
        try{const value=ensurePlaceholderSettingsV56();if(Array.isArray(value))return [...new Set(value.map(String))]}catch{}
        return [];
    }

    // ------------------------------------------------------------
    // Styled reusable multi-select dropdown. It keeps the existing
    // hidden input updated so older save logic remains compatible.
    // ------------------------------------------------------------
    function closeMultiDropdownsV164(except=null){
        $$('.multi-dropdown-v164.open').forEach(w=>{if(w!==except)w.classList.remove('open')});
    }
    function installMultiDropdownV164(input,valuesProvider,{placeholder='Any',empty='None available'}={}){
        if(!input)return null;
        input.classList.add('hidden','multi-dropdown-source-v164');
        let wrap=input.nextElementSibling;
        if(!wrap?.classList?.contains('multi-dropdown-v164')){
            wrap=document.createElement('div');wrap.className='multi-dropdown-v164';
            wrap.innerHTML='<button type="button" class="multi-dropdown-button-v164"><span></span><i class="ph ph-caret-down"></i></button><div class="multi-dropdown-panel-v164"></div>';
            input.insertAdjacentElement('afterend',wrap);
        }
        const button=$('.multi-dropdown-button-v164',wrap),copy=$('span',button),panel=$('.multi-dropdown-panel-v164',wrap);
        const selected=()=>new Set(split(input.value).map(v=>v.replace(/^#/,'')));
        const draw=()=>{
            const values=[...new Set((valuesProvider?.()||[]).map(v=>String(v).trim()).filter(Boolean))];
            const sel=selected();
            copy.textContent=sel.size?[...sel].join(', '):placeholder;
            copy.title=copy.textContent;
            panel.innerHTML=values.length?values.map(v=>`<label class="multi-dropdown-option-v164"><input type="checkbox" value="${esc(v)}" ${sel.has(v)?'checked':''}><span>${esc(v)}</span></label>`).join(''):`<span class="progress-hint multi-dropdown-empty-v164">${esc(empty)}</span>`;
            $$('input[type="checkbox"]',panel).forEach(box=>box.onchange=()=>{
                input.value=$$('input[type="checkbox"]:checked',panel).map(x=>x.value).join(', ');
                input.dispatchEvent(new Event('input',{bubbles:true}));
                input.dispatchEvent(new Event('change',{bubbles:true}));
                const now=selected();copy.textContent=now.size?[...now].join(', '):placeholder;copy.title=copy.textContent;
            });
        };
        button.onclick=e=>{e.preventDefault();e.stopPropagation();const opening=!wrap.classList.contains('open');closeMultiDropdownsV164(wrap);if(opening){draw();wrap.classList.add('open')}};
        panel.onclick=e=>e.stopPropagation();
        draw();
        wrap._redrawV164=draw;
        return wrap;
    }
    if(!document.documentElement.dataset.multiDropdownCloseV164){
        document.documentElement.dataset.multiDropdownCloseV164='1';
        document.addEventListener('click',()=>closeMultiDropdownsV164());
        document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMultiDropdownsV164()});
    }

    // ------------------------------------------------------------
    // Knowledge Base settings: real visual switch, ON by default,
    // help icon beside the title, and polaroid-only controls.
    // ------------------------------------------------------------
    function polishPlaceholderV164(){
        const section=$('.kb-placeholder-settings-v56,#kb-placeholder-settings-v56');if(!section)return;
        try{if(db.settings.knowledgePlaceholdersEnabledV56===undefined)db.settings.knowledgePlaceholdersEnabledV56=true}catch{}
        const toggle=$('.kb-placeholders-enabled-v56',section);if(!toggle)return;
        toggle.setAttribute('role','switch');toggle.setAttribute('aria-label','Enable placeholders');
        const label=toggle.closest('label');if(label){label.classList.add('kb-placeholder-switch-label-v164');if(!$('.kb-switch-track-v173',label)&&!$('.kb-toggle-track-v164',label)){const track=document.createElement('span');track.className='kb-toggle-track-v164';track.innerHTML='<span class="kb-toggle-knob-v164"></span>';label.appendChild(track)}}
        const heading=$('.kb-placeholder-settings-heading-v56 > div',section);const field=$('.field-label',heading||section);let help=$('.placeholder-help-v163',section);
        if(field){let row=$('.kb-placeholder-title-row-v164',heading);if(!row){row=document.createElement('div');row.className='kb-placeholder-title-row-v164';field.insertAdjacentElement('beforebegin',row);row.appendChild(field)}if(help&&!row.contains(help))row.appendChild(help)}
        const sync=()=>{toggle.checked=!!db.settings.knowledgePlaceholdersEnabledV56;toggle.setAttribute('aria-checked',toggle.checked?'true':'false');$$('.kb-placeholder-chips-v56,.kb-placeholder-add-v56',section).forEach(el=>el.classList.toggle('hidden',!toggle.checked))};
        if(!toggle.dataset.v164SwitchBound){toggle.dataset.v164SwitchBound='1';toggle.addEventListener('change',sync)}sync();
    }
    function syncPolaroidSettingsVisibilityV164(){
        const box=$('#kb-polaroid-options-v163');if(!box)return;
        const isPolaroid=(db.settings?.libraryView||'list')==='polaroid';box.classList.toggle('hidden',!isPolaroid);box.setAttribute('aria-hidden',isPolaroid?'false':'true');
    }
    try{const before=renderSettings;renderSettings=function(){const r=before.apply(this,arguments);requestAnimationFrame(()=>{polishPlaceholderV164();syncPolaroidSettingsVisibilityV164()});return r}}catch{}
    document.addEventListener('click',e=>{if(e.target.closest?.('.kb-view-btn'))requestAnimationFrame(syncPolaroidSettingsVisibilityV164)},true);

    // ------------------------------------------------------------
    // Recommendation filters: actual dropdowns sourced from existing
    // categories/tags/placeholders when Filter Based mode is used.
    // ------------------------------------------------------------
    function enhanceRecommendationDropdownsV164(){
        const modal=$('#recommendation-modal-v162');if(!modal)return;
        $$('.rec-category-chips-v163,.rec-tag-chips-v163',modal).forEach(node=>node.classList.add('hidden'));
        const cat=$('.rec-categories-v162',modal),tags=$('.rec-tags-v162',modal);
        installMultiDropdownV164(cat,()=>db.settings?.categories||[],{placeholder:'Any category',empty:'No categories exist yet'});
        installMultiDropdownV164(tags,allKbTagsV164,{placeholder:'Any tag',empty:'No tags exist yet'});
        let ph=$('.rec-placeholder-v162',modal);
        if(ph&&ph.tagName!=='SELECT'){
            const sel=document.createElement('select');sel.className=ph.className;sel.value=ph.value;ph.replaceWith(sel);ph=sel;
        }
        if(ph){const current=ph.value;ph.innerHTML='<option value="">Any placeholder type</option>'+placeholderTypesV164().map(v=>`<option value="${esc(v)}">${esc(v)}</option>`).join('');ph.value=current}
        const mode=$('.rec-mode-v162',modal);const filterMode=!mode||mode.value==='filter';
        $$('.multi-dropdown-v164',modal).forEach(w=>w.closest('.modal-section,label')?.classList.toggle('hidden',!filterMode));
        ph?.closest('.modal-section,label')?.classList.toggle('hidden',!filterMode);
        if(mode&&!mode.dataset.v164Bound){mode.dataset.v164Bound='1';mode.addEventListener('change',()=>setTimeout(enhanceRecommendationDropdownsV164,0))}
    }
    try{if(window.__loggyV162?.openRecommendationSettings){const before=window.__loggyV162.openRecommendationSettings;window.__loggyV162.openRecommendationSettings=function(){const r=before.apply(this,arguments);requestAnimationFrame(enhanceRecommendationDropdownsV164);return r}}}catch{}
    document.addEventListener('click',e=>{if(e.target.closest?.('.daily-recommendation-toggle-v163,.daily-recommendation-settings-v162,.open-recommendation-settings-v162,.recommendation-settings-btn-v162'))setTimeout(enhanceRecommendationDropdownsV164,0)},true);

    // ------------------------------------------------------------
    // Dynamic Collection settings with the same real dropdowns.
    // ------------------------------------------------------------
    function ensureDynamicConfigV164(){
        let modal=$('#dynamic-config-modal-v164');if(modal)return modal;
        modal=document.createElement('div');modal.id='dynamic-config-modal-v164';modal.className='modal-overlay hidden';
        modal.innerHTML=`<div class="modal-box dynamic-config-box-v162"><div class="modal-header"><h2>Dynamic Collection</h2><button type="button" class="small-icon-btn dynamic-close-v164"><i class="ph ph-x"></i></button></div>
          <div class="modal-section"><span class="field-label">Title</span><input class="dynamic-title-v164" type="text"></div>
          <div class="modal-section"><span class="field-label">Display</span><select class="dynamic-display-v164"><option value="cards">Cards</option><option value="polaroid">Polaroid-style cards</option></select></div>
          <div class="modal-section"><span class="field-label">Categories</span><input class="dynamic-categories-v164" type="text"></div>
          <div class="modal-section"><span class="field-label">Tags</span><input class="dynamic-tags-v164" type="text"></div>
          <div class="goal-two-col-v162"><label><span class="field-label">Learned State</span><select class="dynamic-learned-v164"><option value="any">Learned or unlearned</option><option value="learned">Only previously learned</option><option value="unlearned">Only never learned</option></select></label><label><span class="field-label">Parts</span><select class="dynamic-parts-v164"><option value="any">With or without parts</option><option value="with">Only items with parts</option><option value="without">Only items without parts</option></select></label></div>
          <div class="modal-section"><span class="field-label">Placeholder / Type</span><select class="dynamic-placeholder-v164"></select></div>
          <div class="modal-section"><span class="field-label">Other field filters (JSON)</span><textarea class="dynamic-metadata-v164" placeholder='{"Translation":"hello"}'></textarea></div>
          <button type="button" class="icon-btn dynamic-save-v164 padded-action-v163"><i class="ph ph-check"></i> Save</button></div>`;
        document.body.appendChild(modal);$('.dynamic-close-v164',modal).onclick=()=>modal.classList.add('hidden');modal.addEventListener('click',e=>{if(e.target===modal)modal.classList.add('hidden')});return modal;
    }
    function editDynamicCollectionV164(tab,component){
        const modal=ensureDynamicConfigV164();
        $('.dynamic-title-v164',modal).value=component.title||'Dynamic Collection';$('.dynamic-display-v164',modal).value=component.display==='polaroid'?'polaroid':'cards';
        const cat=$('.dynamic-categories-v164',modal),tags=$('.dynamic-tags-v164',modal);cat.value=(component.categories||[]).join(', ');tags.value=(component.tags||[]).join(', ');
        installMultiDropdownV164(cat,()=>db.settings?.categories||[],{placeholder:'Any category'});installMultiDropdownV164(tags,allKbTagsV164,{placeholder:'Any tag'});
        $('.dynamic-learned-v164',modal).value=component.learnedState||'any';$('.dynamic-parts-v164',modal).value=component.partsState||'any';
        const ph=$('.dynamic-placeholder-v164',modal),phValue=component.placeholderType||'';ph.innerHTML='<option value="">Any placeholder type</option>'+placeholderTypesV164().map(v=>`<option value="${esc(v)}">${esc(v)}</option>`).join('');ph.value=phValue;
        $('.dynamic-metadata-v164',modal).value=component.metadataJson||'';
        $('.dynamic-save-v164',modal).onclick=()=>{const raw=$('.dynamic-metadata-v164',modal).value.trim();if(raw){try{JSON.parse(raw)}catch{try{showFeatureToast('Other field filters must be valid JSON.')}catch{}return}}Object.assign(component,{title:$('.dynamic-title-v164',modal).value.trim()||'Dynamic Collection',display:$('.dynamic-display-v164',modal).value,categories:split(cat.value),tags:split(tags.value).map(v=>v.replace(/^#/,'')),learnedState:$('.dynamic-learned-v164',modal).value,partsState:$('.dynamic-parts-v164',modal).value,placeholderType:ph.value,metadataJson:raw});saveDb();modal.classList.add('hidden');renderCustomTabView(tab.id)};
        modal.classList.remove('hidden');requestAnimationFrame(()=>$('.dynamic-title-v164',modal)?.focus());
    }
    try{const before=editCustomComponent;editCustomComponent=async function(tabId,componentId){const tab=getCustomTab(tabId),component=tab?.components?.find(c=>c.id===componentId);if(component?.type==='kbDynamicCollectionV162')return editDynamicCollectionV164(tab,component);return before.apply(this,arguments)}}catch{}

    // ------------------------------------------------------------
    // Toolbox: remove native prompt() flow and use site modal.
    // ------------------------------------------------------------
    function installStyledToolboxAddV164(){
        const old=$('#add-tool-btn');if(!old||old.dataset.v164StyledTool)return;
        const button=old.cloneNode(true);button.dataset.v164StyledTool='1';old.replaceWith(button);
        button.addEventListener('click',async()=>{const values=await showAppFormModal({title:'Add Tool',submitLabel:'Add Tool',fields:[{name:'name',label:'Tool name',placeholder:'Dictionary, tuner, reference site…',className:'toolbox-add-tool-input-v506'},{name:'link',label:'Link (optional)',type:'url',placeholder:'https://…',className:'toolbox-add-tool-input-v506'}]});if(!values||!String(values.name||'').trim())return;db.tools.push({name:String(values.name).trim(),link:String(values.link||'').trim()});saveDb();populateToolsDatalist();renderToolbox()});
    }

    // ------------------------------------------------------------
    // Component help belongs on palette cards in EDIT mode, not on
    // already-placed components.
    // ------------------------------------------------------------
    const HELP_V164={
      searchBar:'Search only the component directly below this bar. Example: place it above a Vocabulary component to filter that vocabulary list.',globalSearchV163:'Search every searchable component below this bar in the same tab. Example: find “Korean” across notes, cards, Q&A, and collections.',categoryGroup:'Organize items into named categories. Add categories/items, rename categories by right-clicking, and display compact item cards.',qaV162:'Store reusable questions and answers. Answers can sync with Daily Logs and each question can show the days where it was discussed.',goalsV162:'Track a target manually with +/− or automatically from matching Knowledge Base activity.',tableV162:'Create an editable table and add/remove rows or columns.',customKnowledgeBaseV453:'An independent empty Knowledge Base. It stores its own categories, fields, placeholders, and items. A normal reusable Search Bar can filter it when you choose to add one.',kbDynamicCollectionV162:'Automatically shows Knowledge Base items matching selected categories, tags, placeholder type, learned state, parts state, or metadata.',checklist:'Track a list of things to complete. Example: a study routine or packing list.',cards:'A flexible set of small cards for facts, ideas, or grouped notes.',polaroids:'Visual cards with an image and caption. Example: artwork, vocabulary pictures, or inspiration.',text:'A freeform text block for notes or instructions.',heading:'A section heading used to divide a tab into readable areas.',dailyLog:'Display Daily Log content inside the custom tab.',practiceLog:'Record practice sessions and notes.',progressMeter:'Track progress toward a numeric target.',skillRatings:'Give skills a 1–5 confidence rating.',vocabulary:'Keep words/phrases with meanings and notes.',resources:'Save useful links and references.',milestones:'Track important achievements or checkpoints.',projectGallery:'Display projects with images and notes.',recipeTracker:'Keep recipes or repeatable procedures.'
    };
    function decoratePaletteHelpV164(palette){
        $$('.custom-component-palette-item',palette).forEach(card=>{
            if(card.querySelector('.custom-palette-help-v164'))return;
            const type=card.dataset.componentType,label=card.querySelector('span')?.textContent?.trim()||'Component';
            const help=document.createElement('span');help.className='custom-palette-help-v164';help.tabIndex=0;help.setAttribute('role','button');help.setAttribute('aria-label',`About ${label}`);help.textContent='?';
            const tooltip=document.createElement('span');tooltip.className='custom-palette-tooltip-v164';tooltip.textContent=HELP_V164[type]||`${label} component. Add it to your tab, then use Edit mode to configure its content and settings.`;help.appendChild(tooltip);
            ['pointerdown','mousedown','click'].forEach(name=>help.addEventListener(name,e=>{e.preventDefault();e.stopPropagation()}));help.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();e.stopPropagation();help.classList.toggle('keyboard-open-v164')}});card.appendChild(help);
        });
    }
    try{const before=renderCustomComponentPalette;renderCustomComponentPalette=function(palette){const r=before.apply(this,arguments);decoratePaletteHelpV164(palette);return r}}catch{}

    // ------------------------------------------------------------
    // Cursor/Companion + buttons: keep heading and + on one line.
    // ------------------------------------------------------------
    function alignAccessoryHeadingsV164(){
        [['#cursor-picker','cursor'],['#companion-picker','companion']].forEach(([selector,kind])=>{
            const picker=$(selector),section=picker?.closest('.modal-section');if(!section)return;
            const label=$('.field-label',section),controls=$('.accessory-heading-controls-v163',section);if(!label||!controls)return;
            let row=$(`.accessory-heading-row-v164[data-kind="${kind}"]`,section);
            if(!row){row=document.createElement('div');row.className='accessory-heading-row-v164';row.dataset.kind=kind;label.insertAdjacentElement('beforebegin',row)}
            if(!row.contains(label))row.appendChild(label);if(!row.contains(controls))row.appendChild(controls);
        });
    }
    try{const before=renderCursorPicker;renderCursorPicker=function(){const r=before.apply(this,arguments);requestAnimationFrame(alignAccessoryHeadingsV164);return r}}catch{}
    try{const before=renderCompanionPicker;renderCompanionPicker=function(){const r=before.apply(this,arguments);requestAnimationFrame(alignAccessoryHeadingsV164);return r}}catch{}

    // ------------------------------------------------------------
    // Theme artwork stability. Prefer durable /public paths, hydrate
    // gallery cards before paint, cancel the queued duplicate hydrate,
    // and avoid immediate duplicate same-theme applies.
    // ------------------------------------------------------------
    function publicAssetUrlV164(projectPath){
        let path=String(projectPath||'').replace(/\\/g,'/').replace(/^\.\//,'');const marker='/public/';const lower=path.toLowerCase();const i=lower.lastIndexOf(marker);if(i>=0)path=path.slice(i+marker.length);else if(lower.startsWith('public/'))path=path.slice(7);if(!path)return'';return'/'+path.split('/').filter(Boolean).map(part=>{try{return encodeURIComponent(decodeURIComponent(part))}catch{return encodeURIComponent(part)}}).join('/');
    }
    function stabilizeAssetArrayV164(assets){
        (Array.isArray(assets)?assets:[]).forEach(asset=>{if(!asset||typeof asset!=='object')return;const durable=publicAssetUrlV164(asset.projectPath||asset.path);if(durable)asset._projectUrlV495=durable;const current=String(asset.url||asset.src||'').trim();if(current&&!/^blob:/i.test(current)&&!asset._stableUrlV164)asset._stableUrlV164=current;if(!current&&durable)asset.url=durable});return assets;
    }
    function stabilizeBuilderImagesV164(modal){
        if(!modal)return;const assets=stabilizeAssetArrayV164(modal._themeBackgroundSvgs||[]);
        $$('.theme-builder-svg-card[data-svg-index] img,.theme-builder-svg-card img',modal).forEach((img,fallbackIndex)=>{
            const card=img.closest('.theme-builder-svg-card');const idx=Number(card?.dataset?.svgIndex);const asset=assets[Number.isInteger(idx)?idx:fallbackIndex];if(!asset)return;
            if(!img.dataset.v164StableBound){img.dataset.v164StableBound='1';img.addEventListener('load',()=>{const loaded=String(img.getAttribute('src')||img.currentSrc||img.src||'').trim();if(loaded&&!/^blob:/i.test(loaded)){asset._stableUrlV164=loaded;asset.url=loaded}img.dataset.v164TriedV495='[]'});img.addEventListener('error',()=>{let tried;try{tried=new Set(JSON.parse(img.dataset.v164TriedV495||'[]'))}catch{tried=new Set()}const failed=String(img.getAttribute('src')||img.src||'').trim();if(failed)tried.add(failed);const candidates=[asset._stableUrlV164,asset.url,asset.src,asset._projectUrlV495,publicAssetUrlV164(asset.projectPath||asset.path)].map(v=>String(v||'').trim()).filter(Boolean);const candidate=candidates.find(v=>!tried.has(v));if(!candidate)return;tried.add(candidate);img.dataset.v164TriedV495=JSON.stringify([...tried]);img.src=candidate},true)}
        });
    }
    try{const before=renderThemeBuilderSvgListV2;renderThemeBuilderSvgListV2=function(modal){stabilizeAssetArrayV164(modal?._themeBackgroundSvgs);const r=before.apply(this,arguments);try{const token=Number(modal?._themeImageHydrateTokenV62);if(modal&&Number.isFinite(token)&&typeof hydrateThemeImageCardsV62==='function'){hydrateThemeImageCardsV62(modal,token);modal._themeImageHydrateTokenV62=token+1}}catch{}stabilizeBuilderImagesV164(modal);requestAnimationFrame(()=>stabilizeBuilderImagesV164(modal));return r}}catch{}
    try{const before=populateThemeBuilder;populateThemeBuilder=function(modal,theme){stabilizeAssetArrayV164(theme?.backgroundSvgs);const r=before.call(this,modal,theme);stabilizeAssetArrayV164(modal?._themeBackgroundSvgs);stabilizeBuilderImagesV164(modal);return r}}catch{}
    // V496: keep only durable-source normalization here. The old V164 runtime
    // repair matched stage images to backgroundSvgs by raw DOM index; hidden
    // assets and cross-page clones can shift that index, causing a perfectly
    // good image to be replaced with another asset's broken URL. V494 (loaded
    // later) is the single runtime repair owner and maps wrappers back to their
    // actual placement/asset before trying fallbacks.
    try{const before=mountCustomThemeBackgroundSvgsV2;mountCustomThemeBackgroundSvgsV2=function(theme){stabilizeAssetArrayV164(theme?.backgroundSvgs);return before.apply(this,arguments)}}catch{}
    // V421 consolidation: removed the redundant 500ms applyTheme dedupe here.
    // V171 later in this file is the single same-theme dedupe/restack owner.

    // ------------------------------------------------------------
    // Clean new theme: modal stays hidden until a truly blank/default
    // draft is populated. This prevents the current theme flashing in.
    // ------------------------------------------------------------
    function blankThemeV164(){
        let blank={};
        for(const name of ['FEATURE_SUITE_DEFAULT_THEME','CUSTOM_THEME_MEDIA_DEFAULTS_V3','CUSTOM_THEME_VISUAL_DEFAULTS_V4','THEME_BUILDER_NAV_DEFAULTS_V6','CUSTOM_THEME_ADVANCED_DEFAULTS_V10','CUSTOM_THEME_V11_DEFAULTS','CUSTOM_THEME_V12_DEFAULTS','CUSTOM_THEME_V13_DEFAULTS','CUSTOM_THEME_V15_DEFAULTS','CUSTOM_THEME_V19_DEFAULTS','CUSTOM_THEME_V20_DEFAULTS','CUSTOM_THEME_V26_DEFAULTS','CUSTOM_THEME_ACCESSORY_DEFAULTS_V32']){
            try{const value=eval(name);if(value&&typeof value==='object')blank={...blank,...value}}catch{}
        }
        return {...blank,name:'My Custom Theme',backgroundImage:'',backgroundImageName:'',backgroundSvgs:[],svgHoverSounds:[],introAudio:'',introAudioName:'',interactiveBackgroundCodeV56:'',useThemeCursor:false,themeCursorStyle:'default',themeCursorTrailEnabledV161:false,customCursorV161:null};
    }
    const previousNewThemeV164=typeof openNewThemeBuilderCleanV34==='function'?openNewThemeBuilderCleanV34:null;
    function openBrandNewThemeV164(){
        let modal;try{modal=ensureThemeBuilderModal()}catch{return previousNewThemeV164?.()}
        modal.classList.add('hidden');modal.dataset.themeBuilderMode='create';modal.dataset.themeBuilderEditingThemeV25='';modal.dataset.themeBuilderEditingCopyV30='';delete modal.dataset.themeBuilderBuiltInSourceV30;
        modal._themeBackgroundSvgs=[];modal._themeHoverSounds=[];modal._themeIntroAudio='';modal._themeIntroAudioName='';modal._themeAudioProjectPath='';modal._themeArtworkSnapshotV69=[];modal._themeArtworkKeyV69='';
        const blank=blankThemeV164();
        try{populateThemeBuilder(modal,blank)}catch{try{previousNewThemeV164?.()}catch{}}
        modal._themeBackgroundSvgs=[];modal._themeHoverSounds=[];modal._themeIntroAudio='';modal._themeIntroAudioName='';
        try{renderThemeBuilderSvgListV2(modal);renderThemeBuilderHoverSoundListV10?.(modal);updateThemeBuilderPreview(modal);installNormalCreateActionsV45?.(modal);installIndependentCreateButtonsV47?.(modal);bindDashboardPreviewV45?.(modal);bindUniversalManualDragV45?.(modal)}catch{}
        modal.dataset.themeBuilderMode='create';modal.dataset.themeBuilderEditingThemeV25='';modal.dataset.themeBuilderEditingCopyV30='';delete modal.dataset.themeBuilderBuiltInSourceV30;
        modal.classList.remove('hidden');requestAnimationFrame(()=>modal.querySelector('[data-theme-key="name"],.theme-builder-name input,input[name="themeName"]')?.focus());return modal;
    }
    // (V164's own click listener + opener reassignment removed — V172/V175/V176
    // further down this file fully replace this path with a version that
    // pre-warms a blank theme draft while idle so "New Theme" opens instantly.
    // openBrandNewThemeV164 is kept and exposed below purely as an emergency
    // fallback for V172 to call if its own modal setup throws.)

    // Hide the old Field-to-Field instructional empty box and make sure
    // late-created UI gets its V164 polish.
    function polishV164(){installStyledToolboxAddV164();polishPlaceholderV164();syncPolaroidSettingsVisibilityV164();alignAccessoryHeadingsV164();$$('.quiz-transformation-rules-v58 .quiz-settings-empty-v58,.quiz-settings-empty-v58[data-v58-empty]').forEach(node=>{if(/add a rule if you want field to field practice/i.test(node.textContent||''))node.remove()});}
    if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',polishV164,{once:true});else polishV164();
    document.addEventListener('click',e=>{if(e.target.closest?.('#open-settings-btn,#open-tools-btn,.theme-search-create-v161,#open-daily-settings-btn'))setTimeout(polishV164,0)},true);
    window.__loggyV164={enhanceRecommendationDropdownsV164,polishV164,openBrandNewThemeV164};
})();

/* ============================================================
   V168 — edge-aware custom-tab component help tooltips
   ============================================================ */
(() => {
    'use strict';
    const SELECTOR = '.custom-palette-help-v164,.custom-component-help-v163';
    function orientTabHelpV168(help) {
        if (!help?.getBoundingClientRect) return;
        const r = help.getBoundingClientRect();
        const viewportWidth = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
        const center = r.left + r.width / 2;
        help.classList.toggle('tooltip-open-right-v168', center <= viewportWidth / 2);
        help.classList.toggle('tooltip-open-left-v168', center > viewportWidth / 2);
    }
    document.addEventListener('pointerenter', event => {
        const help = event.target.closest?.(SELECTOR);
        if (help) orientTabHelpV168(help);
    }, true);
    document.addEventListener('mouseover', event => {
        const help = event.target.closest?.(SELECTOR);
        if (help) orientTabHelpV168(help);
    }, true);
    document.addEventListener('focusin', event => {
        const help = event.target.closest?.(SELECTOR);
        if (help) orientTabHelpV168(help);
    }, true);
    window.addEventListener('resize', () => {
        document.querySelectorAll(`${SELECTOR}.tooltip-open-right-v168,${SELECTOR}.tooltip-open-left-v168`).forEach(orientTabHelpV168);
    }, { passive: true });
    window.__orientTabHelpV168 = orientTabHelpV168;
})();

// ============================================================
// V169 — Knowledge Base "Pinned Image" field type
// Image/map pins with labels + interactive Flashcards / Quizlet Learn / Anki
// ============================================================
(() => {
    'use strict';

    const PINNED_KIND_V169 = 'pinnedImage';
    const DEFAULT_PIN_COLOR_V169 = '#e53935';
    const CORRECT_PIN_COLOR_V169 = '#22a06b';
    const WRONG_PIN_COLOR_V169 = '#d97706';
    const escV169 = value => {
        try { return escapeKnowledgeHtml(String(value ?? '')); }
        catch { return String(value ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch])); }
    };
    const attrV169 = value => {
        try { return escapeKnowledgeAttr(String(value ?? '')); }
        catch { return escV169(value).replace(/`/g, '&#096;'); }
    };
    const uidV169 = () => `pin-v169-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

    function normalizeColorV169(value, fallback = DEFAULT_PIN_COLOR_V169) {
        const raw = String(value || '').trim();
        if (/^#[0-9a-f]{6}$/i.test(raw)) return raw.toLowerCase();
        if (/^#[0-9a-f]{3}$/i.test(raw)) {
            return '#' + raw.slice(1).split('').map(ch => ch + ch).join('').toLowerCase();
        }
        return fallback;
    }

    function emptyPinnedValueV169(field = null) {
        return {
            version: 1,
            image: '',
            pinColor: normalizeColorV169(field?.defaultPinColor || DEFAULT_PIN_COLOR_V169),
            testMode: 'whole',
            pins: []
        };
    }

    function parsePinnedValueV169(value, field = null) {
        if (value && typeof value === 'object' && !Array.isArray(value)) {
            const copy = { ...value };
            copy.image = String(copy.image || '');
            copy.pinColor = normalizeColorV169(copy.pinColor || field?.defaultPinColor || DEFAULT_PIN_COLOR_V169);
            copy.testMode = copy.testMode === 'parts' ? 'parts' : 'whole';
            copy.pins = Array.isArray(copy.pins) ? copy.pins : [];
            copy.pins = copy.pins.map((pin, index) => ({
                id: String(pin?.id || `pin-${index + 1}`),
                x: Math.max(0, Math.min(100, Number(pin?.x) || 0)),
                y: Math.max(0, Math.min(100, Number(pin?.y) || 0)),
                label: String(pin?.label ?? pin?.name ?? pin?.title ?? pin?.text ?? pin?.answer ?? ''),
                color: normalizeColorV169(pin?.color || copy.pinColor),
                size: Math.max(0.55, Math.min(2.2, Number(pin?.size) || 1)),
                direction: ['up','right','down','left'].includes(String(pin?.direction || '')) ? String(pin.direction) : 'down',
                labelManual: !!pin?.labelManual,
                labelDx: Number.isFinite(Number(pin?.labelDx)) ? Number(pin.labelDx) : 0,
                labelDy: Number.isFinite(Number(pin?.labelDy)) ? Number(pin.labelDy) : 0
            }));
            return copy;
        }

        const text = String(value ?? '').trim();
        if (!text) return emptyPinnedValueV169(field);

        try {
            const parsed = JSON.parse(text);
            return parsePinnedValueV169(parsed, field);
        } catch {
            // Gracefully migrate a plain image URL/data URL into a pinned image.
            return {
                ...emptyPinnedValueV169(field),
                image: text
            };
        }
    }

    // V495: recognize saved pinned maps by their data shape, not only by the
    // current field definition. Older backups can still call the field "text"
    // even though its saved value is a complete pinned-image payload.
    function pinnedPayloadShapeV495(value) {
        let raw = value;
        if (typeof raw === 'string') {
            const text = raw.trim();
            if (!text || text[0] !== '{') return null;
            try { raw = JSON.parse(text); } catch { return null; }
        }
        if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return null;
        if (!String(raw.image || '').trim() || !Array.isArray(raw.pins)) return null;
        const hasPin = raw.pins.some(pin =>
            pin && typeof pin === 'object' &&
            Number.isFinite(Number(pin.x)) && Number.isFinite(Number(pin.y)) &&
            String(pin.label || '').trim()
        );
        return hasPin ? raw : null;
    }

    function isPinnedValueV495(value) {
        return !!pinnedPayloadShapeV495(value);
    }

    function serializePinnedValueV169(data, field = null) {
        const normalized = parsePinnedValueV169(data, field);
        return JSON.stringify({
            version: 1,
            image: normalized.image,
            pinColor: normalized.pinColor,
            testMode: normalized.testMode === 'parts' ? 'parts' : 'whole',
            pins: normalized.pins.map(pin => ({
                id: pin.id,
                x: Math.round(pin.x * 1000) / 1000,
                y: Math.round(pin.y * 1000) / 1000,
                label: String(pin.label || '').trim(),
                color: normalizeColorV169(pin.color || normalized.pinColor),
                size: Math.round(Math.max(0.55, Math.min(2.2, Number(pin.size) || 1)) * 100) / 100,
                direction: ['up','right','down','left'].includes(String(pin.direction || '')) ? String(pin.direction) : 'down',
                labelManual: !!pin.labelManual,
                labelDx: Math.round((Number(pin.labelDx) || 0) * 1000) / 1000,
                labelDy: Math.round((Number(pin.labelDy) || 0) * 1000) / 1000
            }))
        });
    }

    function pinnedHasUsefulDataV169(value, field = null) {
        const data = parsePinnedValueV169(value, field);
        return !!data.image && data.pins.some(pin => String(pin.label || '').trim());
    }

    function normalizedAnswerV169(value) {
        return String(value ?? '')
            .trim()
            .replace(/\s+/g, ' ')
            .toLocaleLowerCase();
    }

    function answersMatchV169(typed, answer) {
        return normalizedAnswerV169(typed) === normalizedAnswerV169(answer);
    }

    // ------------------------------------------------------------
    // Field normalization + field creation UI.
    // ------------------------------------------------------------
    try {
        const beforeNormalizeV169 = normalizeKnowledgeField;
        normalizeKnowledgeField = function(field, index = 0, legacyConfig = {}) {
            const normalized = beforeNormalizeV169.apply(this, arguments);
            if (field && typeof field === 'object' && field.kind === PINNED_KIND_V169) {
                normalized.kind = PINNED_KIND_V169;
                normalized.defaultPinColor = normalizeColorV169(field.defaultPinColor || DEFAULT_PIN_COLOR_V169);
            }
            return normalized;
        };
    } catch {}

    function syncPinnedFieldCreateUiV169() {
        const modal = document.getElementById('kb-field-create-modal');
        if (!modal) return;
        const section = modal.querySelector('#kb-field-pinned-image-options-v169');
        section?.classList.toggle('hidden', pendingKnowledgeFieldKind !== PINNED_KIND_V169);
    }

    function injectPinnedFieldCreateUiV169() {
        const modal = document.getElementById('kb-field-create-modal');
        const kinds = modal?.querySelector('#kb-field-create-kind');
        if (!modal || !kinds) return;

        if (!kinds.querySelector(`[data-kind="${PINNED_KIND_V169}"]`)) {
            const button = document.createElement('button');
            button.type = 'button';
            button.className = 'kb-clean-icon-option kb-pinned-image-kind-v169';
            button.dataset.kind = PINNED_KIND_V169;
            button.dataset.tip = 'Pinned image / map';
            button.setAttribute('aria-label', 'Pinned image or map');
            button.innerHTML = '<i class="ph ph-map-pin"></i>';
            kinds.appendChild(button);
            button.addEventListener('click', () => {
                pendingKnowledgeFieldKind = PINNED_KIND_V169;
                kinds.querySelectorAll('[data-kind]').forEach(node => {
                    node.classList.toggle('selected', node === button);
                });
                modal.querySelector('#kb-field-create-language-section')?.classList.add('hidden');
                syncPinnedFieldCreateUiV169();
            });
        }

        if (!modal.querySelector('#kb-field-pinned-image-options-v169')) {
            const section = document.createElement('div');
            section.id = 'kb-field-pinned-image-options-v169';
            section.className = 'modal-section hidden kb-field-pinned-image-options-v169';
            section.innerHTML = `
                <div class="kb-item-field-label-row">
                    <span class="field-label">Default Pin Color</span>
                    <span class="kb-inline-help-v169" title="New pins start with this color. You can change individual pins later.">?</span>
                </div>
                <div class="kb-pinned-color-row-v169">
                    <input type="color" class="kb-pinned-default-color-v169" value="${DEFAULT_PIN_COLOR_V169}">
                    <span>New pins start red by default.</span>
                </div>
            `;
            const save = modal.querySelector('#kb-field-create-save');
            save?.insertAdjacentElement('beforebegin', section);
        }

        syncPinnedFieldCreateUiV169();
    }

    try {
        const beforeEnsureFieldModalV169 = ensureKnowledgeFieldCreateModal;
        ensureKnowledgeFieldCreateModal = function() {
            beforeEnsureFieldModalV169.apply(this, arguments);
            injectPinnedFieldCreateUiV169();
        };
    } catch {}

    try {
        const beforeOpenFieldModalV169 = openKnowledgeFieldCreateModal;
        openKnowledgeFieldCreateModal = function(fieldId = null) {
            ensureKnowledgeFieldCreateModal();
            const config = activeCategorySettingTab ? getCategoryConfig(activeCategorySettingTab) : null;
            const existing = fieldId ? config?.fields?.find(field => field.id === fieldId) : null;
            const result = beforeOpenFieldModalV169.apply(this, arguments);
            injectPinnedFieldCreateUiV169();
            const color = document.querySelector('#kb-field-create-modal .kb-pinned-default-color-v169');
            if (color) color.value = normalizeColorV169(existing?.defaultPinColor || DEFAULT_PIN_COLOR_V169);
            syncPinnedFieldCreateUiV169();
            return result;
        };
    } catch {}

    document.addEventListener('click', event => {
        const save = event.target.closest?.('#kb-field-create-save');
        if (!save || pendingKnowledgeFieldKind !== PINNED_KIND_V169) return;
        const category = activeCategorySettingTab;
        const editingId = editingKnowledgeFieldId;
        const name = document.getElementById('kb-field-create-name')?.value.trim();
        const configBefore = category ? getCategoryConfig(category) : null;
        const beforeCount = Array.isArray(configBefore?.fields) ? configBefore.fields.length : 0;
        const color = normalizeColorV169(document.querySelector('#kb-field-create-modal .kb-pinned-default-color-v169')?.value || DEFAULT_PIN_COLOR_V169);
        setTimeout(() => {
            try {
                const config = category ? getCategoryConfig(category) : null;
                if (!config) return;
                const field = editingId
                    ? config.fields?.find(entry => entry.id === editingId)
                    : (config.fields?.length > beforeCount
                        ? config.fields[config.fields.length - 1]
                        : null);
                if (!field || field.kind !== PINNED_KIND_V169 || (name && field.name !== name)) return;
                field.defaultPinColor = color;
                saveDb();
            } catch {}
        }, 0);
    }, true);

    // ------------------------------------------------------------
    // Knowledge Base item editor.
    // ------------------------------------------------------------
    // V590: one canonical renderer for every NON-QUIZ pinned map surface.
    // Add/Edit preview, KB cards, Items Learned and read-only item fields all
    // use the same saved pin/label coordinates. Quiz renderers stay separate
    // because they intentionally hide/reveal answers.
    function pinnedStageHtmlV169(data, options = {}) {
        const labeled = !!options.labeled;
        const interactive = !!options.interactive;
        const readonly = !!options.readonly;
        const answers = options.answers || {};
        const selectedId = options.selectedId || '';
        const stageClass = String(options.stageClass || '').trim();
        const labelClass = String(options.labelClass || '').trim();
        const pins = Array.isArray(data?.pins) ? data.pins : [];

        if (!data?.image) {
            return '<div class="kb-pinned-empty-v169"><i class="ph ph-image"></i><span>Upload an image to start placing pins.</span></div>';
        }

        const clampPct = value => Math.max(0, Math.min(100, Number(value) || 0));

        return `
            <div class="kb-pinned-stage-v169 ${stageClass} ${interactive ? 'is-interactive' : ''}" data-pinned-stage-v169="1" data-static-labels-v590="${readonly ? '1' : '0'}">
                <img src="${attrV169(data.image)}" alt="">
                <div class="kb-pinned-overlay-v169">
                    ${pins.map((pin, index) => {
                        const state = answers[pin.id] || {};
                        const isCorrect = state.status === 'correct';
                        const isWrong = state.status === 'wrong';
                        const color = isCorrect ? CORRECT_PIN_COLOR_V169 : isWrong ? WRONG_PIN_COLOR_V169 : normalizeColorV169(pin.color || data.pinColor);
                        const label = String(pin.label || '').trim();
                        const showLabel = labeled || state.status === 'correct';
                        const x = clampPct(pin.x);
                        const y = clampPct(pin.y);
                        const dx = Number.isFinite(Number(pin.labelDx)) ? Number(pin.labelDx) : 0;
                        const dy = Number.isFinite(Number(pin.labelDy)) ? Number(pin.labelDy) : 0;
                        const manual = !!pin.labelManual;
                        const labelX = manual ? clampPct(x + dx) : x;
                        const labelY = manual ? clampPct(y + dy) : y;
                        const transform = manual ? 'translate(-50%,-50%)' : 'translate(18px,-50%)';
                        const pinTag = readonly ? 'span' : 'button';
                        const typeAttr = readonly ? '' : ' type="button"';
                        return `
                            <${pinTag}${typeAttr}
                                class="kb-map-pin-v169 pin-dir-${attrV169(pin.direction || 'down')} ${selectedId === pin.id ? 'selected' : ''} ${isCorrect ? 'correct' : ''} ${isWrong ? 'wrong' : ''}"
                                data-pin-id-v169="${attrV169(pin.id)}"
                                data-pin-index-v169="${index}"
                                style="left:${x}%;top:${y}%;--pin-color-v169:${color};--pin-scale-v171:${Math.max(.55,Math.min(2.2,Number(pin.size)||1))};"
                                aria-label="${showLabel && label ? attrV169(label) : `Pin ${index + 1}`}"
                                title="${showLabel && label ? attrV169(label) : `Pin ${index + 1}`}"
                            ><span class="kb-map-pin-glyph-v615"><span class="kb-map-pin-dot-v169"></span></span></${pinTag}>
                            ${showLabel && label ? `<span class="kb-map-pin-label-v169 ${labelClass} ${manual ? 'is-manual-v170' : 'is-auto-v170'}"
                                data-pin-label-for-v170="${attrV169(pin.id)}"
                                data-pin-x-v170="${x}"
                                data-pin-y-v170="${y}"
                                data-label-dx-v170="${dx}"
                                data-label-dy-v170="${dy}"
                                data-label-manual-v170="${manual ? '1' : '0'}"
                                style="left:${labelX}%;top:${labelY}%;transform:${transform};display:block!important;visibility:visible!important;opacity:1!important;z-index:30!important;"
                                title="${manual ? 'Drag to reposition label' : attrV169(label)}">${escV169(label)}</span>` : ''}
                        `;
                    }).join('')}
                </div>
            </div>
        `;
    }


    function pinnedInputHtmlV169(field, value = '', mode = 'add') {
        const data = parsePinnedValueV169(value, field);
        const inputClass = mode === 'edit' ? 'dynamic-edit-field' : 'dynamic-add-field';
        return `
            <div class="modal-section mt-10 kb-item-field kb-pinned-image-field-v169" data-field-id="${attrV169(field.id)}" data-mode-v169="${mode}">
                <div class="kb-item-field-label-row">
                    <span class="field-label">${escV169(field.name)}</span>
                    <span class="kb-inline-help-v169" title="Upload the image first. Then use Place Pins to open a large full-screen workspace. Pins can be resized, rotated, labeled, dragged, and tested as a whole image or one pin at a time.">?</span>
                </div>
                <input type="hidden" class="${inputClass} kb-pinned-value-v169" data-key="${attrV169(field.name)}" value="${attrV169(serializePinnedValueV169(data, field))}">
                <div class="kb-pinned-editor-v169">
                    <div class="kb-pinned-toolbar-v169 kb-pinned-toolbar-v171">
                        <button type="button" class="icon-btn kb-pinned-upload-v169"><i class="ph ph-image"></i><span>${data.image ? 'Replace image' : 'Upload image'}</span></button>
                        <button type="button" class="icon-btn kb-pinned-place-v171 ${data.image ? '' : 'hidden'}"><i class="ph ph-map-pin"></i><span>Place Pins</span></button>
                        <label class="kb-pinned-new-color-v169" title="Color for newly placed pins">
                            <span>New pin</span>
                            <input type="color" class="kb-pinned-new-color-input-v169" value="${normalizeColorV169(data.pinColor || field.defaultPinColor)}">
                        </label>
                        <label class="kb-pinned-test-mode-wrap-v171">
                            <span>Quiz mode</span>
                            <select class="kb-pinned-test-mode-v171" title="Whole image asks for all pins together. By parts creates a separate prompt for each pin.">
                                <option value="whole" ${data.testMode === 'parts' ? '' : 'selected'}>Test whole image</option>
                                <option value="parts" ${data.testMode === 'parts' ? 'selected' : ''}>Test by parts</option>
                            </select>
                        </label>
                        <button type="button" class="small-icon-btn kb-pinned-remove-image-v169 ${data.image ? '' : 'hidden'}" title="Remove image"><i class="ph ph-trash"></i></button>
                    </div>
                    <input type="file" class="kb-pinned-file-v169 hidden" accept="image/*">
                    <div class="kb-pinned-stage-host-v169">${pinnedStageHtmlV169(data, { labeled: true })}</div>
                    <div class="kb-pinned-selected-editor-v169 hidden">
                        <input type="text" class="kb-pinned-label-input-v169" placeholder="Pin label, e.g. Kentucky" maxlength="160">
                        <input type="color" class="kb-pinned-pin-color-v169" value="${DEFAULT_PIN_COLOR_V169}" title="Pin color">
                        <div class="kb-pinned-size-control-v171" title="Pin size">
                            <button type="button" class="small-icon-btn kb-pinned-size-minus-v171" aria-label="Make pin smaller"><i class="ph ph-minus"></i></button>
                            <span class="kb-pinned-size-value-v171">100%</span>
                            <button type="button" class="small-icon-btn kb-pinned-size-plus-v171" aria-label="Make pin larger"><i class="ph ph-plus"></i></button>
                        </div>
                        <select class="kb-pinned-direction-v171" title="Direction of the pin point">
                            <option value="down">Point down</option>
                            <option value="up">Point up</option>
                            <option value="left">Point left</option>
                            <option value="right">Point right</option>
                        </select>
                        <button type="button" class="small-icon-btn kb-pinned-label-save-v169" title="Save label"><i class="ph ph-check"></i></button>
                        <button type="button" class="small-icon-btn kb-pinned-delete-pin-v169" title="Delete pin"><i class="ph ph-trash"></i></button>
                    </div>
                </div>
            </div>
        `;
    }

    try {
        const beforeBuildInputV169 = buildKnowledgeFieldInputHtml;
        buildKnowledgeFieldInputHtml = function(field, value = '', mode = 'add') {
            if (field?.kind === PINNED_KIND_V169) return pinnedInputHtmlV169(field, value, mode);
            return beforeBuildInputV169.apply(this, arguments);
        };
    } catch {}

    function persistPinnedEditorValueV169(section, data, field, mode, itemId) {
        const hidden = section.querySelector('.kb-pinned-value-v169');
        if (!hidden) return;
        hidden.value = serializePinnedValueV169(data, field);
        if (mode === 'edit' && itemId && db.phrase_meta?.[itemId]) {
            db.phrase_meta[itemId].custom_fields ||= {};
            db.phrase_meta[itemId].custom_fields[hidden.dataset.key] = hidden.value;
            saveDb();
        }
    }

    function bindPinnedImageEditorV169(section, field, mode, itemId = null) {
        if (!section || section.dataset.pinnedBoundV169 === '1') return;
        section.dataset.pinnedBoundV169 = '1';
        const hidden = section.querySelector('.kb-pinned-value-v169');
        const editor = section.querySelector('.kb-pinned-editor-v169');
        const host = section.querySelector('.kb-pinned-stage-host-v169');
        const fileInput = section.querySelector('.kb-pinned-file-v169');
        const upload = section.querySelector('.kb-pinned-upload-v169');
        const placePins = section.querySelector('.kb-pinned-place-v171');
        const removeImage = section.querySelector('.kb-pinned-remove-image-v169');
        const newColor = section.querySelector('.kb-pinned-new-color-input-v169');
        const testModeSelect = section.querySelector('.kb-pinned-test-mode-v171');
        const selectedEditor = section.querySelector('.kb-pinned-selected-editor-v169');
        const labelInput = section.querySelector('.kb-pinned-label-input-v169');
        const pinColor = section.querySelector('.kb-pinned-pin-color-v169');
        const pinDirection = section.querySelector('.kb-pinned-direction-v171');
        const sizeMinus = section.querySelector('.kb-pinned-size-minus-v171');
        const sizePlus = section.querySelector('.kb-pinned-size-plus-v171');
        const sizeValue = section.querySelector('.kb-pinned-size-value-v171');
        const saveLabel = section.querySelector('.kb-pinned-label-save-v169');
        const deletePinButton = section.querySelector('.kb-pinned-delete-pin-v169');
        if (!hidden || !host || !fileInput || !upload || !newColor) return;

        let data = parsePinnedValueV169(hidden.value, field);
        let selectedId = '';
        let dragState = null;
        let placementMode = false;
        let editorAnchorV171 = null;

        const selectedPin = () => data.pins.find(pin => pin.id === selectedId) || null;
        const clampSize = value => Math.max(.55, Math.min(2.2, Number(value) || 1));

        const setPlacementMode = value => {
            placementMode = !!value && !!data.image;
            if (placementMode && editor && editor.parentElement !== document.body) {
                editorAnchorV171 = document.createComment('kb-pinned-editor-home-v171');
                editor.parentNode?.insertBefore(editorAnchorV171, editor);
                document.body.appendChild(editor);
            } else if (!placementMode && editor && editorAnchorV171?.parentNode) {
                editorAnchorV171.parentNode.insertBefore(editor, editorAnchorV171);
                editorAnchorV171.remove();
                editorAnchorV171 = null;
            }
            editor?.classList.toggle('is-pin-placement-v171', placementMode);
            document.body.classList.toggle('kb-pin-placement-open-v171', placementMode);
            if (placePins) {
                placePins.classList.toggle('is-active-v171', placementMode);
                const span = placePins.querySelector('span');
                if (span) span.textContent = placementMode ? 'Done Placing' : 'Place Pins';
                const icon = placePins.querySelector('i');
                if (icon) icon.className = placementMode ? 'ph ph-check' : 'ph ph-map-pin';
            }

            // V213: moving the map editor between the full-screen placement
            // workspace and the normal Add/Edit Item modal changes its width.
            // The label algorithm stores pixel positions, so force a fresh
            // layout after the reparent instead of waiting for a browser resize.
            const relayoutV213 = () => {
                if (!placementMode) return;
                try { window.__layoutPinnedLabelsV170?.(host); } catch {}
            };
            requestAnimationFrame(() => {
                relayoutV213();
                requestAnimationFrame(relayoutV213);
            });
            const imgV213 = host?.querySelector?.('.kb-pinned-stage-v169 > img');
            if (imgV213) {
                if (!imgV213.complete) imgV213.addEventListener('load', relayoutV213, { once:true });
                else if (typeof imgV213.decode === 'function') imgV213.decode().then(relayoutV213).catch(() => {});
            }
        };

        const syncSelectedEditor = () => {
            const pin = selectedPin();
            selectedEditor?.classList.toggle('hidden', !pin && !placementMode);
            if (!pin) return;
            if (labelInput && document.activeElement !== labelInput) labelInput.value = pin.label || '';
            if (pinColor) pinColor.value = normalizeColorV169(pin.color || data.pinColor);
            if (pinDirection) pinDirection.value = ['up','right','down','left'].includes(pin.direction) ? pin.direction : 'down';
            if (sizeValue) sizeValue.textContent = `${Math.round(clampSize(pin.size) * 100)}%`;
        };

        const render = () => {
            host.innerHTML = pinnedStageHtmlV169(data, { labeled: true, selectedId });
            host.classList.add('kb-pinned-editor-preview-v566');
            host.querySelectorAll('.kb-map-pin-label-v169').forEach(label => {
                label.style.setProperty('display','block','important');
                label.style.setProperty('visibility','visible','important');
                label.style.setProperty('opacity','1','important');
                label.style.setProperty('z-index','20','important');
            });
            upload.querySelector('span').textContent = data.image ? 'Replace image' : 'Upload image';
            removeImage?.classList.toggle('hidden', !data.image);
            placePins?.classList.toggle('hidden', !data.image);
            newColor.value = normalizeColorV169(data.pinColor || field.defaultPinColor);
            if (testModeSelect) testModeSelect.value = data.testMode === 'parts' ? 'parts' : 'whole';
            bindStage();
            bindLabelDraggingV170();
            // V600: labels are permanent map content, so lay them out in the
            // normal Add/Edit preview too, not only in full-screen placement.
            requestAnimationFrame(() => {
                try { window.__alignPinnedOverlayToImageV612?.(host.querySelector('.kb-pinned-stage-v169')); } catch {}
                try { window.__layoutPinnedLabelsV170?.(host); } catch {}
                requestAnimationFrame(() => {
                    try { window.__alignPinnedOverlayToImageV612?.(host.querySelector('.kb-pinned-stage-v169')); } catch {}
                    try { window.__layoutPinnedLabelsV170?.(host); } catch {}
                });
            });
            syncSelectedEditor();
            setPlacementMode(placementMode);
        };

        const save = () => persistPinnedEditorValueV169(section, data, field, mode, itemId);

        const chooseImage = () => {
            fileInput.value = '';
            fileInput.click();
        };

        upload.addEventListener('click', chooseImage);
        placePins?.addEventListener('click', () => {
            if (!data.image) return;

            // V600: never lose the label that is currently typed into the
            // selected-pin field when Done Placing is clicked. The previous
            // flow rebuilt the preview before that draft was committed, which
            // left the normal map showing pins with no visible labels.
            if (placementMode && selectedId) {
                const pin = selectedPin();
                if (pin) {
                    pin.label = String(labelInput?.value || pin.label || '').trim();
                    pin.color = normalizeColorV169(pinColor?.value || pin.color || data.pinColor);
                    pin.direction = ['up','right','down','left'].includes(pinDirection?.value) ? pinDirection.value : (pin.direction || 'down');
                    pin.size = clampSize(pin.size);
                    save();
                }
            }

            const nextPlacementMode = !placementMode;
            setPlacementMode(nextPlacementMode);
            if (nextPlacementMode) selectedId = '';
            // Rebuild both when entering and when clicking Done Placing so the
            // normal map preview immediately contains every saved label.
            render();
        });

        removeImage?.addEventListener('click', () => {
            setPlacementMode(false);
            data.image = '';
            data.pins = [];
            selectedId = '';
            save();
            render();
        });

        newColor.addEventListener('input', () => {
            data.pinColor = normalizeColorV169(newColor.value, field.defaultPinColor || DEFAULT_PIN_COLOR_V169);
            save();
        });

        testModeSelect?.addEventListener('change', () => {
            data.testMode = testModeSelect.value === 'parts' ? 'parts' : 'whole';
            save();
        });

        fileInput.addEventListener('change', async () => {
            const file = fileInput.files?.[0];
            if (!file) return;
            const image = await customImageFileToDataUrl(file);
            if (!image) return;
            data.image = image;
            // Preserve pins when replacing the image because positions are percentages.
            setPlacementMode(false);
            save();
            render();
        });

        const commitSelected = () => {
            const pin = selectedPin();
            if (!pin) return;
            pin.label = String(labelInput?.value || '').trim();
            pin.color = normalizeColorV169(pinColor?.value || data.pinColor);
            pin.direction = ['up','right','down','left'].includes(pinDirection?.value) ? pinDirection.value : 'down';
            pin.size = clampSize(pin.size);
            save();
            render();
        };

        // V600: keep the selected pin's label synchronized while typing so
        // leaving the field or closing Place Pins cannot silently discard it.
        labelInput?.addEventListener('input', () => {
            const pin = selectedPin();
            if (!pin) return;
            pin.label = String(labelInput.value || '');
        });
        labelInput?.addEventListener('change', () => {
            const pin = selectedPin();
            if (!pin) return;
            pin.label = String(labelInput.value || '').trim();
            save();
            render();
        });
        // Enter completes this pin, then detaches the blank field from it.
        // Otherwise a later change/blur can erase the label just saved.
        const finishPinLabelV649 = () => {
            if (!selectedPin()) return;
            commitSelected();
            if (!placementMode) return;
            selectedId = '';
            if (labelInput) labelInput.value = '';
            render();
        };
        if (labelInput) labelInput.__commitPinnedLabelV616 = finishPinLabelV649;
        labelInput?.addEventListener('keydown', event => {
            if (event.key !== 'Enter' || event.isComposing || event.keyCode === 229) return;
            event.preventDefault();
            event.stopPropagation();
            event.stopImmediatePropagation();
            finishPinLabelV649();
            // Enter means save/show this label only. Place Pins stays open.
            requestAnimationFrame(() => {
                if (placementMode) {
                    labelInput?.focus?.({ preventScroll:true });
                    try { labelInput?.select?.(); } catch {}
                }
            });
        });
        saveLabel?.addEventListener('click', commitSelected);

        pinColor?.addEventListener('input', () => {
            const pin = selectedPin();
            if (!pin) return;
            pin.color = normalizeColorV169(pinColor.value || data.pinColor);
            save();
            render();
        });

        pinDirection?.addEventListener('change', () => {
            const pin = selectedPin();
            if (!pin) return;
            pin.direction = ['up','right','down','left'].includes(pinDirection.value) ? pinDirection.value : 'down';
            save();
            render();
        });

        const resizeSelected = delta => {
            const pin = selectedPin();
            if (!pin) return;
            pin.size = clampSize(clampSize(pin.size) + delta);
            save();
            render();
        };
        sizeMinus?.addEventListener('click', () => resizeSelected(-.15));
        sizePlus?.addEventListener('click', () => resizeSelected(.15));

        const deleteSelected = () => {
            if (!selectedId) return;
            data.pins = data.pins.filter(pin => pin.id !== selectedId);
            selectedId = '';
            save();
            render();
        };
        deletePinButton?.addEventListener('click', deleteSelected);

        function selectPin(pinId, focusLabel = true) {
            selectedId = pinId;
            if (labelInput) labelInput.value = selectedPin()?.label || '';
            render();
            if (focusLabel) requestAnimationFrame(() => {
                labelInput?.focus();
                labelInput?.select();
            });
        }

        function bindStage() {
            const stage = host.querySelector('.kb-pinned-stage-v169');
            if (!stage || !data.image) return;

            stage.classList.toggle('is-placement-mode-v171', placementMode);

            stage.addEventListener('click', event => {
                if (event.target.closest('.kb-map-pin-v169')) return;
                if (!placementMode) return;
                const rect = window.__pinnedCoordinateRectV612?.(stage) || stage.getBoundingClientRect();
                if (!rect.width || !rect.height) return;
                // Ignore clicks in any stage padding/letterbox outside the image.
                if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) return;
                const x = Math.max(0, Math.min(100, ((event.clientX - rect.left) / rect.width) * 100));
                const y = Math.max(0, Math.min(100, ((event.clientY - rect.top) / rect.height) * 100));
                const pin = {
                    id: uidV169(),
                    x,
                    y,
                    label: '',
                    color: normalizeColorV169(data.pinColor || field.defaultPinColor),
                    size: 1,
                    direction: 'down',
                    labelManual: false,
                    labelDx: 0,
                    labelDy: 0
                };
                data.pins.push(pin);
                selectedId = pin.id;
                save();
                render();
                requestAnimationFrame(() => labelInput?.focus());
            });

            stage.querySelectorAll('.kb-map-pin-v169').forEach(button => {
                const pinId = button.dataset.pinIdV169;
                button.addEventListener('click', event => {
                    event.preventDefault();
                    event.stopPropagation();
                    selectPin(pinId, true);
                });
                button.addEventListener('contextmenu', event => {
                    event.preventDefault();
                    event.stopPropagation();
                    selectedId = pinId;
                    const pin = selectedPin();
                    showCustomItemContextMenu(event.clientX, event.clientY, [
                        {
                            label: pin?.label ? 'Edit label' : 'Add label',
                            icon: 'ph-pencil-simple',
                            action: () => selectPin(pinId, true)
                        },
                        {
                            label: 'Delete pin',
                            icon: 'ph-trash',
                            danger: true,
                            action: deleteSelected
                        }
                    ]);
                });
                button.addEventListener('pointerdown', event => {
                    if (event.button !== 0) return;
                    const pin = data.pins.find(entry => entry.id === pinId);
                    if (!pin) return;
                    dragState = {
                        id: pinId,
                        pointerId: event.pointerId,
                        moved: false,
                        startX: event.clientX,
                        startY: event.clientY
                    };
                    button.setPointerCapture?.(event.pointerId);
                    event.stopPropagation();
                });
                button.addEventListener('pointermove', event => {
                    if (!dragState || dragState.id !== pinId || dragState.pointerId !== event.pointerId) return;
                    const dx = Math.abs(event.clientX - dragState.startX);
                    const dy = Math.abs(event.clientY - dragState.startY);
                    if (dx + dy < 3 && !dragState.moved) return;
                    dragState.moved = true;
                    const rect = window.__pinnedCoordinateRectV612?.(stage) || stage.getBoundingClientRect();
                    const pin = data.pins.find(entry => entry.id === pinId);
                    if (!pin || !rect.width || !rect.height) return;
                    pin.x = Math.max(0, Math.min(100, ((event.clientX - rect.left) / rect.width) * 100));
                    pin.y = Math.max(0, Math.min(100, ((event.clientY - rect.top) / rect.height) * 100));
                    button.style.left = `${pin.x}%`;
                    button.style.top = `${pin.y}%`;
                });
                const finishDrag = event => {
                    if (!dragState || dragState.id !== pinId || dragState.pointerId !== event.pointerId) return;
                    const moved = dragState.moved;
                    dragState = null;
                    if (moved) {
                        save();
                        render();
                    }
                };
                button.addEventListener('pointerup', finishDrag);
                button.addEventListener('pointercancel', finishDrag);
            });
        }

        function bindLabelDraggingV170() {
            const stage = host.querySelector('.kb-pinned-stage-v169');
            if (!stage) return;
            stage.querySelectorAll('.kb-map-pin-label-v169').forEach(label => {
                const pinId = label.dataset.pinLabelForV170;
                label.style.pointerEvents = 'auto';
                label.style.cursor = 'grab';
                let state = null;
                label.addEventListener('pointerdown', event => {
                    if (event.button !== 0) return;
                    event.preventDefault();
                    event.stopPropagation();
                    const pin = data.pins.find(entry => entry.id === pinId);
                    if (!pin) return;
                    const rect = window.__pinnedCoordinateRectV612?.(stage) || stage.getBoundingClientRect();
                    state = { pointerId:event.pointerId, rect };
                    label.setPointerCapture?.(event.pointerId);
                    label.style.cursor = 'grabbing';
                });
                label.addEventListener('pointermove', event => {
                    if (!state || event.pointerId !== state.pointerId) return;
                    const pin = data.pins.find(entry => entry.id === pinId);
                    if (!pin || !state.rect.width || !state.rect.height) return;
                    const centerX = ((event.clientX - state.rect.left) / state.rect.width) * 100;
                    const centerY = ((event.clientY - state.rect.top) / state.rect.height) * 100;
                    pin.labelManual = true;
                    pin.labelDx = centerX - pin.x;
                    pin.labelDy = centerY - pin.y;
                    label.style.left = `${centerX}%`;
                    label.style.top = `${centerY}%`;
                    label.style.transform = 'translate(-50%, -50%)';
                });
                const finish = event => {
                    if (!state || event.pointerId !== state.pointerId) return;
                    state = null;
                    label.style.cursor = 'grab';
                    save();
                    render();
                };
                label.addEventListener('pointerup', finish);
                label.addEventListener('pointercancel', finish);
                label.addEventListener('dblclick', event => {
                    event.preventDefault();
                    event.stopPropagation();
                    const pin = data.pins.find(entry => entry.id === pinId);
                    if (!pin) return;
                    pin.labelManual = false;
                    pin.labelDx = 0;
                    pin.labelDy = 0;
                    save();
                    render();
                });
            });
        }

        const escapePlacement = event => {
            if (event.key !== 'Escape' || !placementMode) return;
            event.preventDefault();
            setPlacementMode(false);
        };
        document.addEventListener('keydown', escapePlacement);

        // If the surrounding item modal is closed while the map workspace is open,
        // immediately restore page scrolling.
        const rootModal = section.closest('.modal,.modal-overlay');
        if (rootModal) {
            new MutationObserver(() => {
                if (rootModal.classList.contains('hidden')) setPlacementMode(false);
            }).observe(rootModal, { attributes:true, attributeFilter:['class'] });
        }

        render();
    }

    try {
        const beforeBindFieldBehaviorV169 = bindKnowledgeItemFieldBehavior;
        bindKnowledgeItemFieldBehavior = function(container, categoryName, mode, itemId = null) {
            const result = beforeBindFieldBehaviorV169.apply(this, arguments);
            const fields = getKnowledgeFieldDefs(categoryName);
            container?.querySelectorAll('.kb-pinned-image-field-v169').forEach(section => {
                const fieldId = section.dataset.fieldId;
                const field = fields.find(entry => entry.id === fieldId) || fields.find(entry => entry.name === section.querySelector('.kb-pinned-value-v169')?.dataset.key);
                if (field) bindPinnedImageEditorV169(section, field, mode, itemId);
            });
            return result;
        };
    } catch {}

    // ------------------------------------------------------------
    // Read-only item display.
    // ------------------------------------------------------------
    function labeledPinnedDisplayV169(field, value = '') {
        const data = parsePinnedValueV169(value, field);
        if (!data.image) return '<div class="kb-display-empty">Not added</div>';
        return `<div class="kb-pinned-readonly-v169">${pinnedStageHtmlV169(data, { labeled: true })}</div>`;
    }

    try {
        const beforeBuildDisplayV169 = buildKnowledgeFieldDisplayHtml;
        buildKnowledgeFieldDisplayHtml = function(field, value = '') {
            const legacyPinnedV496 = field?.kind !== PINNED_KIND_V169 && isPinnedValueV495(value);
            if (field?.kind !== PINNED_KIND_V169 && !legacyPinnedV496) return beforeBuildDisplayV169.apply(this, arguments);
            const effectiveFieldV496 = field?.kind === PINNED_KIND_V169 ? field : { ...field, kind: PINNED_KIND_V169 };
            return `
                <div class="modal-section mt-10 kb-item-field kb-display-field kb-pinned-display-field-v169 kb-readonly-map-v483">
                    <div class="kb-item-field-label-row"><span class="field-label">${escV169(field.name)}</span></div>
                    ${labeledPinnedDisplayV169(effectiveFieldV496, value)}
                </div>
            `;
        };
    } catch {}

    // ------------------------------------------------------------
    // Quiz helpers.
    // ------------------------------------------------------------
    function pinnedFieldForItemV169(itemId) {
        const meta = db.phrase_meta?.[itemId];
        if (!meta) return null;
        const values = meta.custom_fields || {};
        const defs = getKnowledgeFieldDefs(meta.type).filter(field => field?.quiz !== false);
        const byName = new Map(defs.map(field => [String(field?.name || ''), field]));

        // Prefer correctly typed maps, then recover legacy fields whose saved
        // JSON is a pinned map even when the old field definition says text.
        const ordered = [
            ...defs.filter(field => field?.kind === PINNED_KIND_V169),
            ...defs.filter(field => field?.kind !== PINNED_KIND_V169)
        ];
        for (const field of ordered) {
            const raw = values[field.name];
            if (!raw) continue;
            if (field.kind !== PINNED_KIND_V169 && !isPinnedValueV495(raw)) continue;
            const effectiveField = field.kind === PINNED_KIND_V169 ? field : { ...field, kind: PINNED_KIND_V169 };
            const data = parsePinnedValueV169(raw, effectiveField);
            const labeledPins = data.pins.filter(pin => String(pin.label || '').trim());
            if (data.image && labeledPins.length) {
                return { field: effectiveField, data: { ...data, pins: labeledPins }, raw, legacyKindV495: field.kind !== PINNED_KIND_V169 };
            }
        }

        // Very old backups can retain the value after the field definition was
        // removed. Keep that card studyable instead of exposing serialized JSON.
        for (const [name, raw] of Object.entries(values)) {
            if (byName.has(String(name)) || !isPinnedValueV495(raw)) continue;
            const field = { id: `legacy-map-${String(name)}`, name: String(name), kind: PINNED_KIND_V169, quiz: true, defaultPinColor: DEFAULT_PIN_COLOR_V169 };
            const data = parsePinnedValueV169(raw, field);
            const labeledPins = data.pins.filter(pin => String(pin.label || '').trim());
            if (data.image && labeledPins.length) return { field, data: { ...data, pins: labeledPins }, raw, legacyKindV495: true };
        }
        return null;
    }

    function labeledPinnedQuizHtmlV169(itemId) {
        const pinned = pinnedFieldForItemV169(itemId);
        if (!pinned) return '';
        return `<div class="quiz-pinned-labeled-v169">${pinnedStageHtmlV169(pinned.data, { labeled: true })}</div>`;
    }

    // Replace the quiz-back renderer so pinned-image JSON is never shown as text.
    try {
        renderCardBackContent = function(meta) {
            const categoryName = meta.type || db.settings.categories[0];
            const fields = getKnowledgeFieldDefs(categoryName)
                .filter(field => field.quiz !== false)
                .sort((a, b) => Number(!!b.quizPrimary) - Number(!!a.quizPrimary));
            const values = meta.custom_fields || {};
            const slides = [];

            fields.forEach(field => {
                const raw = values[field.name];
                if (raw == null || raw === '') return;
                const value = String(raw).trim();
                if (!value) return;

                const legacyPinnedV496 = field.kind !== PINNED_KIND_V169 && isPinnedValueV495(raw);
                if (field.kind === PINNED_KIND_V169 || legacyPinnedV496) {
                    const effectiveFieldV496 = field.kind === PINNED_KIND_V169 ? field : { ...field, kind: PINNED_KIND_V169 };
                    const data = parsePinnedValueV169(raw, effectiveFieldV496);
                    if (data.image) {
                        slides.push(`<div class="quiz-media-fullscreen kb-quiz-pinned-slide-v169 kb-readonly-map-v483">${pinnedStageHtmlV169(data, { labeled: true })}</div>`);
                    }
                    return;
                }

                if (field.kind === 'video') {
                    const youtubeId = extractYoutubeId(value);
                    if (youtubeId) {
                        const startSec = extractYoutubeStart(value);
                        const startParam = startSec > 0 ? `&start=${startSec}` : '';
                        slides.push(`<div class="quiz-media-fullscreen"><iframe src="https://www.youtube.com/embed/${attrV169(youtubeId)}?autoplay=1${startParam}" allow="autoplay; encrypted-media" allowfullscreen></iframe></div>`);
                    } else {
                        slides.push(`<div class="quiz-media-fullscreen"><video src="${attrV169(value)}" autoplay controls playsinline></video></div>`);
                    }
                    return;
                }

                if (field.kind === 'image') {
                    slides.push(`<div class="quiz-media-fullscreen kb-quiz-image-slide"><img src="${attrV169(value)}" alt=""></div>`);
                    return;
                }

                if (field.kind === 'svg') {
                    const safeSvg = safeSvgForKnowledgeBase(value);
                    if (safeSvg) slides.push(`<div class="quiz-media-fullscreen kb-quiz-svg-slide">${safeSvg}</div>`);
                    return;
                }

                if (field.kind === 'rating') {
                    try {
                        slides.push(`<div class="kb-quiz-text-slide">${buildKnowledgeFieldDisplayHtml(field, value)}</div>`);
                    } catch {
                        slides.push(`<div class="kb-quiz-text-slide"><span>${escV169(value)}</span></div>`);
                    }
                    return;
                }

                const audioButton = field.pronunciation
                    ? `<button class="audio-play-btn" data-tts-text="${attrV169(value)}" data-tts-lang="${attrV169(field.ttsLang || 'ko')}" title="Play pronunciation"><i class="ph ph-speaker-high"></i></button>`
                    : '';
                slides.push(`<div class="kb-quiz-text-slide"><span>${escV169(value)}</span>${audioButton}</div>`);
            });

            if (!slides.length) {
                currentCardSlideCount = 1;
                return `<span style="font-size:1.8rem;color:#999;">No quiz-back fields are enabled for "${escV169(categoryName)}".</span>`;
            }

            currentCardSlideCount = slides.length;
            if (currentSlideIndex < 0) currentSlideIndex = slides.length - 1;
            if (currentSlideIndex >= slides.length) currentSlideIndex = 0;

            const dots = slides.length > 1
                ? `<div class="card-dots-row">${slides.map((_, index) => `<span class="card-dot ${index === currentSlideIndex ? 'active' : ''}" onclick="event.stopPropagation(); switchSlide(${index})"></span>`).join('')}</div>`
                : '';
            const arrows = slides.length > 1
                ? `<button class="card-slide-arrow card-slide-prev" onclick="event.stopPropagation(); stepSlide(-1)"><i class="ph ph-caret-left"></i></button><button class="card-slide-arrow card-slide-next" onclick="event.stopPropagation(); stepSlide(1)"><i class="ph ph-caret-right"></i></button>`
                : '';
            return `<div class="card-slide-container"><div class="card-slider-wrapper">${arrows}${slides[currentSlideIndex]}</div>${dots ? `<div class="card-footer-nav">${dots}</div>` : ''}</div>`;
        };
    } catch {}

    let pinnedQuizSessionV169 = {
        key: '',
        answers: {},
        activePinId: ''
    };

    function ensurePinnedQuizSessionV169(itemId, field) {
        const key = `${quizMode}|${itemId}|${field.id}`;
        if (pinnedQuizSessionV169.key !== key) {
            pinnedQuizSessionV169 = { key, answers: {}, activePinId: '' };
        }
        return pinnedQuizSessionV169;
    }

    function allPinnedAnswersCorrectV169(data, state) {
        const labeledPins = data.pins.filter(pin => String(pin.label || '').trim());
        return labeledPins.length > 0 && labeledPins.every(pin => state.answers?.[pin.id]?.status === 'correct');
    }

    function interactivePinnedQuizHtmlV169(itemId, pinned, mode) {
        const state = ensurePinnedQuizSessionV169(itemId, pinned.field);
        const data = pinned.data;
        const active = data.pins.find(pin => pin.id === state.activePinId) || null;
        const correctCount = data.pins.filter(pin => String(pin.label || '').trim() && state.answers?.[pin.id]?.status === 'correct').length;
        const total = data.pins.filter(pin => String(pin.label || '').trim()).length;
        const complete = allPinnedAnswersCorrectV169(data, state);

        return `
            <div class="quiz-pinned-practice-v169" data-item-v169="${attrV169(itemId)}" data-field-v169="${attrV169(pinned.field.id)}">
                <div class="quiz-pinned-stage-wrap-v169">
                    ${pinnedStageHtmlV169(data, { interactive: true, answers: state.answers, selectedId: state.activePinId })}
                    ${active ? `
                        <div class="quiz-pin-answer-popover-v169" data-answer-for-v169="${attrV169(active.id)}" style="left:${active.x}%;top:${active.y}%;">
                            <input type="text" class="quiz-pin-answer-input-v169" value="${attrV169(state.answers?.[active.id]?.typed || '')}" placeholder="Type label…" autocomplete="off" spellcheck="false">
                            <button type="button" class="small-icon-btn quiz-pin-answer-save-v169" title="Check answer"><i class="ph ph-arrow-return-left"></i></button>
                        </div>
                    ` : ''}
                </div>
                <div class="quiz-pinned-status-v169">
                    <span>${correctCount} / ${total} pins correct</span>
                    <small>Click a pin, type its label, then press Enter. Capitalization does not matter.</small>
                </div>
                ${mode === 'learn' && complete ? `<button type="button" class="icon-btn quiz-pinned-continue-v169"><i class="ph ph-check"></i> Continue</button>` : ''}
                ${mode === 'anki' ? `<button type="button" class="icon-btn quiz-pinned-show-answer-v169"><i class="ph ph-eye"></i> Show labeled pins</button>` : ''}
                ${mode === 'flashcards' ? `<button type="button" class="icon-btn quiz-pinned-show-answer-v169"><i class="ph ph-eye"></i> Show labeled pins</button>` : ''}
            </div>
        `;
    }

    function bindInteractivePinnedQuizV169(area, itemId, pinned, mode) {
        const root = area.querySelector('.quiz-pinned-practice-v169');
        if (!root) return;
        const state = ensurePinnedQuizSessionV169(itemId, pinned.field);

        const rerender = () => showQuizCard();

        root.querySelectorAll('.kb-map-pin-v169').forEach(pinButton => {
            pinButton.addEventListener('click', event => {
                event.preventDefault();
                event.stopPropagation();
                state.activePinId = pinButton.dataset.pinIdV169 || '';
                rerender();
            });
        });

        const submit = () => {
            const input = root.querySelector('.quiz-pin-answer-input-v169');
            const pinId = root.querySelector('.quiz-pin-answer-popover-v169')?.dataset.answerForV169;
            if (!input || !pinId) return;
            const pin = pinned.data.pins.find(entry => entry.id === pinId);
            if (!pin) return;
            const typed = input.value.trim();
            if (!typed) return;
            const correct = answersMatchV169(typed, pin.label);
            state.answers[pinId] = {
                typed,
                status: correct ? 'correct' : 'wrong'
            };
            state.activePinId = correct ? '' : pinId;
            rerender();
        };

        root.querySelector('.quiz-pin-answer-save-v169')?.addEventListener('click', submit);
        root.querySelector('.quiz-pin-answer-input-v169')?.addEventListener('keydown', event => {
            if (event.key !== 'Enter') return;
            event.preventDefault();
            event.stopPropagation();
            submit();
        });

        root.querySelector('.quiz-pinned-show-answer-v169')?.addEventListener('click', event => {
            event.preventDefault();
            event.stopPropagation();
            quizCardFlipped = true;
            currentSlideIndex = 0;
            showQuizCard();
        });

        root.querySelector('.quiz-pinned-continue-v169')?.addEventListener('click', event => {
            event.preventDefault();
            event.stopPropagation();
            processLearnAnswer(true);
        });

        const input = root.querySelector('.quiz-pin-answer-input-v169');
        if (input) requestAnimationFrame(() => input.focus());
    }

    function renderPinnedFlashcardOrAnkiV169(area, itemId, pinned, mode) {
        document.getElementById('quiz-set-label').innerText = `${Math.min(activeQuizIndex + 1, activeQuizDeck.length)} / ${activeQuizDeck.length}`;

        if (!quizCardFlipped) {
            area.innerHTML = `
                <div class="flashcard-mode-wrap quiz-pinned-card-wrap-v169">
                    <div class="flashcard-mode-card quiz-pinned-card-v169" id="quiz-flip-front">
                        ${interactivePinnedQuizHtmlV169(itemId, pinned, mode)}
                    </div>
                    <div class="flashcard-hint-text">Fill the pins, or show the labeled answer.</div>
                    ${mode === 'flashcards' ? `
                        <div class="flashcard-nav-container">
                            <button class="flashcard-nav-btn" id="fc-prev" ${activeQuizIndex === 0 ? 'disabled' : ''}><i class="ph ph-arrow-left"></i></button>
                            <button class="flashcard-nav-btn" id="fc-next"><i class="ph ph-arrow-right"></i></button>
                        </div>
                    ` : ''}
                </div>
            `;
            bindInteractivePinnedQuizV169(area, itemId, pinned, mode);
            if (mode === 'flashcards') {
                area.querySelector('#fc-prev')?.addEventListener('click', () => {
                    if (activeQuizIndex > 0) {
                        activeQuizIndex--;
                        quizCardFlipped = false;
                        currentSlideIndex = 0;
                        pinnedQuizSessionV169.key = '';
                        showQuizCard();
                    }
                });
                area.querySelector('#fc-next')?.addEventListener('click', () => {
                    activeQuizIndex++;
                    quizCardFlipped = false;
                    currentSlideIndex = 0;
                    pinnedQuizSessionV169.key = '';
                    showQuizCard();
                });
            }
            return;
        }

        const labeled = labeledPinnedQuizHtmlV169(itemId);
        if (mode === 'flashcards') {
            area.innerHTML = `
                <div class="flashcard-mode-wrap quiz-pinned-card-wrap-v169">
                    <div class="flashcard-mode-card quiz-pinned-card-v169" id="quiz-flip-front">${labeled}</div>
                    <div class="flashcard-hint-text">Labeled pins</div>
                    <div class="flashcard-nav-container">
                        <button class="flashcard-nav-btn" id="fc-prev" ${activeQuizIndex === 0 ? 'disabled' : ''}><i class="ph ph-arrow-left"></i></button>
                        <button class="flashcard-nav-btn" id="fc-next"><i class="ph ph-arrow-right"></i></button>
                    </div>
                </div>
            `;
            area.querySelector('#quiz-flip-front')?.addEventListener('click', event => {
                if (event.target.closest('.kb-map-pin-v169')) return;
                quizCardFlipped = false;
                showQuizCard();
            });
            area.querySelector('#fc-prev')?.addEventListener('click', () => {
                if (activeQuizIndex > 0) {
                    activeQuizIndex--;
                    quizCardFlipped = false;
                    currentSlideIndex = 0;
                    pinnedQuizSessionV169.key = '';
                    showQuizCard();
                }
            });
            area.querySelector('#fc-next')?.addEventListener('click', () => {
                activeQuizIndex++;
                quizCardFlipped = false;
                currentSlideIndex = 0;
                pinnedQuizSessionV169.key = '';
                showQuizCard();
            });
            return;
        }

        area.innerHTML = `
            <div class="flashcard-wrap quiz-pinned-card-wrap-v169">
                <div class="flashcard-mode-card quiz-pinned-card-v169">${labeled}</div>
                <div class="quiz-pinned-anki-actions-v169">
                    <button class="icon-btn still-learning-btn" onclick="processAnkiAnswer('Again')"><i class="ph ph-arrow-counter-clockwise"></i> Still Learning</button>
                    <button class="icon-btn got-it-btn" onclick="processAnkiAnswer('Good')"><i class="ph ph-check"></i> Got It!</button>
                </div>
            </div>
        `;
    }

    try {
        const beforeShowQuizV169 = showQuizCard;
        showQuizCard = function() {
            const area = document.getElementById('quiz-flashcard-area');
            if (!area) return beforeShowQuizV169.apply(this, arguments);

            let itemId = '';
            if (quizMode === 'learn') itemId = learnQueue?.[0]?.id || '';
            else itemId = activeQuizDeck?.[activeQuizIndex] || '';
            const pinned = itemId ? pinnedFieldForItemV169(itemId) : null;

            if (!pinned) return beforeShowQuizV169.apply(this, arguments);

            if (quizMode === 'learn') {
                document.getElementById('quiz-set-label').innerText = `${activeQuizIndex + 1} / ${activeQuizDeck.length}`;
                area.innerHTML = `<div class="flashcard-wrap quiz-pinned-card-wrap-v169"><div class="flashcard-mode-card quiz-pinned-card-v169">${interactivePinnedQuizHtmlV169(itemId, pinned, 'learn')}</div></div>`;
                bindInteractivePinnedQuizV169(area, itemId, pinned, 'learn');
                return;
            }

            if (quizMode === 'flashcards' || quizMode === 'anki') {
                renderPinnedFlashcardOrAnkiV169(area, itemId, pinned, quizMode);
                try { attachAudioPlayButtons(area); } catch {}
                return;
            }

            return beforeShowQuizV169.apply(this, arguments);
        };
    } catch {}

    window.__loggyPinnedImageV169 = {
        parse: parsePinnedValueV169,
        serialize: serializePinnedValueV169,
        isPinnedValue: isPinnedValueV495,
        answersMatch: answersMatchV169,
        fieldForItem: pinnedFieldForItemV169,
        defaultPinColor: DEFAULT_PIN_COLOR_V169,
        renderStage: pinnedStageHtmlV169
    };
})();

// ============================================================
// V170 — Pinned-image smart label placement + recipe workflow viewer/editor
// ============================================================
(() => {
    'use strict';

    // ---- Smart pinned-image label placement ---------------------------------
    const overlapAreaV170 = (a,b) => Math.max(0, Math.min(a.right,b.right)-Math.max(a.left,b.left)) * Math.max(0, Math.min(a.bottom,b.bottom)-Math.max(a.top,b.top));
    const clampV170 = (v,min,max) => Math.max(min,Math.min(max,v));

    // V612 — the image rectangle is the ONLY coordinate system for pins.
    // The stage can become wider/narrower when Place Pins is opened/closed,
    // but the overlay is always snapped to the rendered image itself.
    const watchedPinnedStagesV612 = new WeakSet();

    function objectPositionFractionV616(value, axis='x') {
        const text=String(value||'50% 50%').trim().toLowerCase();
        const parts=text.split(/\s+/).filter(Boolean);
        let token=axis==='x' ? (parts[0]||'50%') : (parts[1]||parts[0]||'50%');
        if(axis==='x') {
            if(token==='left') return 0;
            if(token==='center') return .5;
            if(token==='right') return 1;
        } else {
            if(token==='top') return 0;
            if(token==='center') return .5;
            if(token==='bottom') return 1;
        }
        const pct=parseFloat(token);
        return Number.isFinite(pct) ? Math.max(0,Math.min(1,pct/100)) : .5;
    }

    // V616: return the rectangle occupied by the IMAGE CONTENT, not merely the
    // <img> element box. This matters when object-fit:contain letterboxes the
    // source image inside a wider/taller element.
    function renderedImageContentRectV616(stage) {
        if (!stage?.isConnected) return null;
        const img=stage.querySelector(':scope > img');
        if (!img) return null;
        const box=img.getBoundingClientRect();
        if (!box.width || !box.height) return null;
        const nw=Number(img.naturalWidth)||0, nh=Number(img.naturalHeight)||0;
        if (!nw || !nh) return box;
        const cs=getComputedStyle(img);
        const fit=String(cs.objectFit||'fill').toLowerCase();
        let w=box.width,h=box.height;
        if (fit==='contain' || fit==='scale-down') {
            let scale=Math.min(box.width/nw,box.height/nh);
            if(fit==='scale-down') scale=Math.min(1,scale);
            w=nw*scale; h=nh*scale;
        } else if (fit==='cover') {
            const scale=Math.max(box.width/nw,box.height/nh);
            w=nw*scale; h=nh*scale;
        } else if (fit==='none') {
            w=nw; h=nh;
        }
        const fx=objectPositionFractionV616(cs.objectPosition,'x');
        const fy=objectPositionFractionV616(cs.objectPosition,'y');
        return {
            left:box.left+(box.width-w)*fx,
            top:box.top+(box.height-h)*fy,
            right:box.left+(box.width-w)*fx+w,
            bottom:box.top+(box.height-h)*fy+h,
            width:w,height:h,x:box.left+(box.width-w)*fx,y:box.top+(box.height-h)*fy
        };
    }

    function alignPinnedOverlayToImageV612(stage) {
        if (!stage || !stage.isConnected) return false;
        const img = stage.querySelector(':scope > img');
        const overlay = stage.querySelector(':scope > .kb-pinned-overlay-v169');
        if (!img || !overlay) return false;
        const stageRect = stage.getBoundingClientRect();
        const imageRect = renderedImageContentRectV616(stage);
        if (!stageRect.width || !stageRect.height || !imageRect?.width || !imageRect?.height) {
            if (!watchedPinnedStagesV612.has(stage)) {
                watchedPinnedStagesV612.add(stage);
                img.addEventListener('load', () => requestAnimationFrame(() => layoutPinnedStageV170(stage)), { passive:true });
            }
            return false;
        }
        // One authoritative overlay: exact source-image content rectangle.
        overlay.style.setProperty('inset', 'auto', 'important');
        overlay.style.setProperty('right', 'auto', 'important');
        overlay.style.setProperty('bottom', 'auto', 'important');
        overlay.style.setProperty('left', `${imageRect.left - stageRect.left}px`, 'important');
        overlay.style.setProperty('top', `${imageRect.top - stageRect.top}px`, 'important');
        overlay.style.setProperty('width', `${imageRect.width}px`, 'important');
        overlay.style.setProperty('height', `${imageRect.height}px`, 'important');

        if (!watchedPinnedStagesV612.has(stage)) {
            watchedPinnedStagesV612.add(stage);
            const relayout = () => requestAnimationFrame(() => layoutPinnedStageV170(stage));
            img.addEventListener('load', relayout, { passive:true });
            try {
                const ro = new ResizeObserver(relayout);
                ro.observe(img); ro.observe(stage);
                stage.__kbPinnedResizeObserverV616 = ro;
            } catch {}
        }
        return true;
    }

    function pinnedCoordinateRectV612(stage) {
        if (!stage) return null;
        const rect=renderedImageContentRectV616(stage);
        if (rect?.width && rect?.height) {
            alignPinnedOverlayToImageV612(stage);
            return rect;
        }
        const fallback=stage.getBoundingClientRect?.();
        return fallback?.width && fallback?.height ? fallback : null;
    }

    window.__renderedPinnedImageRectV616 = renderedImageContentRectV616;
    window.__alignPinnedOverlayToImageV612 = alignPinnedOverlayToImageV612;
    window.__pinnedCoordinateRectV612 = pinnedCoordinateRectV612;

    function layoutPinnedStageV170(stage) {
        if (!stage || !stage.isConnected) return;
        alignPinnedOverlayToImageV612(stage);
        const overlay = stage.querySelector('.kb-pinned-overlay-v169');
        if (!overlay) return;
        const rect = overlay.getBoundingClientRect();
        if (!rect.width || !rect.height) return;
        const labels = [...overlay.querySelectorAll('.kb-map-pin-label-v169')];

        // V615: labels use saved image-relative coordinates only. The old smart
        // collision algorithm recalculated pixel positions at every map size,
        // which made labels appear to move after Done Placing. Auto labels stay
        // attached to their pin; manually dragged labels keep their saved dx/dy.
        if (stage.dataset.pinnedStageV169 === '1') {
            labels.forEach(label => {
                const px = clampV170(parseFloat(label.dataset.pinXV170) || 0, 0, 100);
                const py = clampV170(parseFloat(label.dataset.pinYV170) || 0, 0, 100);
                const manual = label.dataset.labelManualV170 === '1';
                const dx = Number.isFinite(parseFloat(label.dataset.labelDxV170)) ? parseFloat(label.dataset.labelDxV170) : 0;
                const dy = Number.isFinite(parseFloat(label.dataset.labelDyV170)) ? parseFloat(label.dataset.labelDyV170) : 0;
                label.style.left = `${clampV170(px + (manual ? dx : 0), 0, 100)}%`;
                label.style.top = `${clampV170(py + (manual ? dy : 0), 0, 100)}%`;
                label.style.transform = manual ? 'translate(-50%, -50%)' : 'translate(18px, -50%)';
                label.style.display = 'block';
                label.style.visibility = 'visible';
                label.style.opacity = '1';
            });
            return;
        }

        const pins = [...overlay.querySelectorAll('.kb-map-pin-v169')].map(node => ({
            id: node.dataset.pinIdV169 || '',
            x: (parseFloat(node.style.left)||0) / 100 * rect.width,
            y: (parseFloat(node.style.top)||0) / 100 * rect.height
        }));
        const occupied = [];
        const pad = 6;

        labels.forEach(label => {
            const px = (parseFloat(label.dataset.pinXV170)||0) / 100 * rect.width;
            const py = (parseFloat(label.dataset.pinYV170)||0) / 100 * rect.height;
            if (label.dataset.labelManualV170 === '1') {
                const dx = parseFloat(label.dataset.labelDxV170)||0;
                const dy = parseFloat(label.dataset.labelDyV170)||0;
                const cx = clampV170((parseFloat(label.dataset.pinXV170)||0)+dx, 0, 100);
                const cy = clampV170((parseFloat(label.dataset.pinYV170)||0)+dy, 0, 100);
                label.style.left = `${cx}%`;
                label.style.top = `${cy}%`;
                label.style.transform = 'translate(-50%, -50%)';
                label.dataset.labelSideV170 = 'manual';
                requestAnimationFrame(() => {
                    const r = label.getBoundingClientRect();
                    occupied.push({left:r.left-rect.left,top:r.top-rect.top,right:r.right-rect.left,bottom:r.bottom-rect.top});
                });
                return;
            }

            label.style.transform = 'none';
            label.style.left = '0px';
            label.style.top = '0px';
            const w = Math.min(Math.max(label.offsetWidth || 70, 34), Math.max(34, rect.width - pad*2));
            const h = Math.max(label.offsetHeight || 25, 22);
            const gapX = 18, gapY = 18;
            const candidates = [
                {side:'right', left:px+gapX, top:py-h/2},
                {side:'left', left:px-gapX-w, top:py-h/2},
                {side:'below', left:px-w/2, top:py+gapY},
                {side:'above', left:px-w/2, top:py-gapY-h},
                {side:'down-right', left:px+12, top:py+14},
                {side:'up-right', left:px+12, top:py-h-14},
                {side:'down-left', left:px-w-12, top:py+14},
                {side:'up-left', left:px-w-12, top:py-h-14}
            ];
            let best = null;
            candidates.forEach((c, order) => {
                const box={left:c.left,top:c.top,right:c.left+w,bottom:c.top+h};
                let score = order * .2;
                if (box.left < pad) score += (pad-box.left)*18;
                if (box.top < pad) score += (pad-box.top)*18;
                if (box.right > rect.width-pad) score += (box.right-(rect.width-pad))*18;
                if (box.bottom > rect.height-pad) score += (box.bottom-(rect.height-pad))*18;
                occupied.forEach(o => score += overlapAreaV170(box,o)*25);
                pins.forEach(pin => {
                    const pb={left:pin.x-18,top:pin.y-38,right:pin.x+18,bottom:pin.y+8};
                    score += overlapAreaV170(box,pb)*10;
                });
                const dist=Math.hypot((c.left+w/2)-px,(c.top+h/2)-py);
                score += dist*.025;
                if (!best || score < best.score) best={...c,score,w,h};
            });
            let left=clampV170(best.left,pad,Math.max(pad,rect.width-w-pad));
            let top=clampV170(best.top,pad,Math.max(pad,rect.height-h-pad));
            label.style.left=`${left}px`;
            label.style.top=`${top}px`;
            label.dataset.labelSideV170=best.side;
            occupied.push({left,top,right:left+w,bottom:top+h});
        });
    }

    function layoutPinnedLabelsV170(root=document) {
        const stages = root?.matches?.('.kb-pinned-stage-v169') ? [root] : [...(root?.querySelectorAll?.('.kb-pinned-stage-v169') || [])];
        stages.forEach(layoutPinnedStageV170);
    }
    window.__layoutPinnedLabelsV170 = layoutPinnedLabelsV170;

    let layoutQueuedV170=false;
    const queueLayoutV170=()=>{
        if(layoutQueuedV170)return;
        layoutQueuedV170=true;
        requestAnimationFrame(()=>{layoutQueuedV170=false;layoutPinnedLabelsV170(document)});
    };
    /* V187: pinned-map renderers already request label layout explicitly. Keep
       resize relayout, but do not watch every DOM insertion in the application. */
    window.addEventListener('resize',queueLayoutV170,{passive:true});

    // ---- Recipe Tracker: cooking-process table style -------------------------
    const esc = value => { try { return escapeCustomHtml(String(value??'')); } catch { return String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); } };
    const rid=prefix=>`${prefix}-${Date.now()}-${Math.random().toString(36).slice(2,8)}`;
    function normalizeRecipeV170(item={}) {
        item.ingredients = Array.isArray(item.ingredients) ? item.ingredients.map(x=>typeof x==='string'?{id:rid('ingredient'),text:x}:{id:x.id||rid('ingredient'),text:String(x.text||x.name||'')}) : [];
        item.steps = Array.isArray(item.steps) ? item.steps.map(x=>typeof x==='string'?{id:rid('step'),title:'',text:x}:{id:x.id||rid('step'),title:String(x.title||''),text:String(x.text||x.instruction||'')}) : [];
        if (!item.ingredients.length && item.notes && !item.steps.length) item.steps=[{id:rid('step'),title:'Notes',text:String(item.notes)}];
        item.servings = String(item.servings||'');
        item.temperature = String(item.temperature||'');
        return item;
    }

    function ensureRecipeModalV170() {
        let modal=document.getElementById('recipe-workflow-modal-v170');
        if(modal)return modal;
        modal=document.createElement('div');
        modal.id='recipe-workflow-modal-v170';
        modal.className='modal hidden recipe-workflow-modal-v170';
        modal.innerHTML=`<div class="modal-box recipe-workflow-box-v170">
          <div class="recipe-modal-head-v170"><div><span class="recipe-kicker-v170">RECIPE WORKFLOW</span><h2 class="recipe-modal-title-v170">Recipe</h2><p class="recipe-modal-meta-v170"></p></div><div class="recipe-head-actions-v170"><button type="button" class="small-icon-btn recipe-edit-v170" title="Edit recipe"><i class="ph ph-pencil-simple"></i></button><button type="button" class="small-icon-btn recipe-close-v170" title="Close"><i class="ph ph-x"></i></button></div></div>
          <div class="recipe-workflow-content-v170"></div>
        </div>`;
        document.body.appendChild(modal);
        modal.querySelector('.recipe-close-v170').onclick=()=>modal.classList.add('hidden');
        modal.addEventListener('pointerdown',e=>{if(e.target===modal)modal.classList.add('hidden')});
        return modal;
    }

    function recipeWorkflowHtmlV170(item) {
        normalizeRecipeV170(item);
        const ingredients=item.ingredients.length?item.ingredients:[{text:'Add ingredients in Edit Recipe'}];
        const steps=item.steps.length?item.steps:[{title:'Instructions',text:item.notes||'Add instructions in Edit Recipe'}];
        return `<div class="recipe-process-sheet-v170">
          <div class="recipe-process-banner-v170">${esc(item.name||'Recipe')}${item.servings?` <span>(${esc(item.servings)})</span>`:''}</div>
          ${item.temperature?`<div class="recipe-process-subline-v170">${esc(item.temperature)}</div>`:''}
          <div class="recipe-process-scroll-v170"><div class="recipe-process-grid-v170" style="--recipe-step-count-v170:${steps.length}">
            <div class="recipe-ingredients-col-v170"><div class="recipe-col-title-v170">Ingredients</div>${ingredients.map(x=>`<div class="recipe-ingredient-cell-v170">${esc(x.text||'')}</div>`).join('')}</div>
            ${steps.map((step,index)=>`<div class="recipe-step-col-v170"><div class="recipe-col-title-v170">${esc(step.title||`Step ${index+1}`)}</div><div class="recipe-step-cell-v170"><span class="recipe-step-number-v170">${index+1}</span><p>${esc(step.text||'')}</p></div></div>`).join('')}
          </div></div>
          ${item.notes && item.steps.length?`<div class="recipe-notes-v170"><strong>Notes</strong><p>${esc(item.notes)}</p></div>`:''}
        </div>`;
    }

    function openRecipeDetailV170(tab,component,item){
        normalizeRecipeV170(item);
        const modal=ensureRecipeModalV170();
        modal.querySelector('.recipe-modal-title-v170').textContent=item.name||'Recipe';
        modal.querySelector('.recipe-modal-meta-v170').textContent=[item.type,item.servings,item.temperature].filter(Boolean).join(' · ');
        modal.querySelector('.recipe-workflow-content-v170').innerHTML=recipeWorkflowHtmlV170(item);
        modal.querySelector('.recipe-edit-v170').onclick=async()=>{modal.classList.add('hidden');await editRecipeItem(tab,component,item)};
        modal.classList.remove('hidden');
    }

    function ensureRecipeEditorV170(){
        let modal=document.getElementById('recipe-editor-modal-v170');
        if(modal)return modal;
        modal=document.createElement('div');modal.id='recipe-editor-modal-v170';modal.className='modal hidden recipe-editor-modal-v170';
        modal.innerHTML=`<div class="modal-box recipe-editor-box-v170"><div class="recipe-editor-head-v170"><div><span class="recipe-kicker-v170">RECIPE TRACKER</span><h2 class="recipe-editor-title-v170">Edit Recipe</h2></div><button type="button" class="small-icon-btn recipe-editor-close-v170"><i class="ph ph-x"></i></button></div>
        <div class="recipe-editor-scroll-v170">
          <div class="recipe-editor-basics-v170"><label><span>Recipe name</span><input class="recipe-name-v170" placeholder="Banana Nut Bread"></label><label><span>Type</span><input class="recipe-type-v170" placeholder="bread, dinner, dessert…"></label><label><span>Servings / yield</span><input class="recipe-servings-v170" placeholder="about 10 servings"></label><label><span>Temperature / setup</span><input class="recipe-temp-v170" placeholder="Preheat oven to 350°F (170°C)"></label><label><span>Rating</span><input type="number" min="1" max="5" class="recipe-rating-v170" value="3"></label></div>
          <section class="recipe-editor-section-v170"><div class="recipe-editor-section-head-v170"><div><strong>Ingredients</strong><small>One ingredient or quantity per row.</small></div><button type="button" class="icon-btn recipe-add-ingredient-v170"><i class="ph ph-plus"></i> Ingredient</button></div><div class="recipe-ingredient-editor-v170"></div></section>
          <section class="recipe-editor-section-v170"><div class="recipe-editor-section-head-v170"><div><strong>Process columns</strong><small>Drag the handle to reorder instructions from left to right.</small></div><button type="button" class="icon-btn recipe-add-step-v170"><i class="ph ph-plus"></i> Step</button></div><div class="recipe-step-editor-v170"></div></section>
          <label class="recipe-notes-field-v170"><span>Extra notes</span><textarea class="recipe-notes-input-v170" rows="3" placeholder="What worked, substitutions, what to change next time…"></textarea></label>
        </div><div class="recipe-editor-actions-v170"><button type="button" class="icon-btn recipe-editor-cancel-v170">Cancel</button><button type="button" class="icon-btn recipe-editor-save-v170"><i class="ph ph-check"></i> Save Recipe</button></div></div>`;
        document.body.appendChild(modal);return modal;
    }

    function editRecipeModalV170(source={},isNew=false){
        const modal=ensureRecipeEditorV170();
        const draft=JSON.parse(JSON.stringify(normalizeRecipeV170({...source})));
        draft.ingredients=draft.ingredients||[];draft.steps=draft.steps||[];
        const q=s=>modal.querySelector(s);
        q('.recipe-editor-title-v170').textContent=isNew?'Add Recipe':'Edit Recipe';
        q('.recipe-name-v170').value=draft.name||'';q('.recipe-type-v170').value=draft.type||'';q('.recipe-servings-v170').value=draft.servings||'';q('.recipe-temp-v170').value=draft.temperature||'';q('.recipe-rating-v170').value=String(draft.rating||3);q('.recipe-notes-input-v170').value=draft.notes||'';
        const ingHost=q('.recipe-ingredient-editor-v170'),stepHost=q('.recipe-step-editor-v170');
        function renderIngredients(){ingHost.innerHTML=draft.ingredients.map((x,i)=>`<div class="recipe-editor-row-v170" data-ing-index="${i}"><span class="recipe-row-number-v170">${i+1}</span><input value="${esc(x.text)}" placeholder="2 large ripe bananas"><button type="button" class="small-icon-btn recipe-row-delete-v170"><i class="ph ph-trash"></i></button></div>`).join('');ingHost.querySelectorAll('[data-ing-index]').forEach(row=>{const i=+row.dataset.ingIndex;row.querySelector('input').oninput=e=>draft.ingredients[i].text=e.target.value;row.querySelector('.recipe-row-delete-v170').onclick=()=>{draft.ingredients.splice(i,1);renderIngredients()}})}
        function renderSteps(){stepHost.innerHTML=draft.steps.map((x,i)=>`<div class="recipe-step-editor-card-v170" draggable="true" data-step-index="${i}"><div class="recipe-step-drag-v170" title="Drag to reorder"><i class="ph ph-dots-six-vertical"></i><strong>Step ${i+1}</strong></div><input class="recipe-step-title-input-v170" value="${esc(x.title)}" placeholder="Prep / Mash / Fold / Bake"><textarea rows="3" placeholder="Instruction…">${esc(x.text)}</textarea><button type="button" class="small-icon-btn recipe-row-delete-v170"><i class="ph ph-trash"></i></button></div>`).join('');let from=-1;stepHost.querySelectorAll('[data-step-index]').forEach(card=>{const i=+card.dataset.stepIndex;card.querySelector('input').oninput=e=>draft.steps[i].title=e.target.value;card.querySelector('textarea').oninput=e=>draft.steps[i].text=e.target.value;card.querySelector('.recipe-row-delete-v170').onclick=()=>{draft.steps.splice(i,1);renderSteps()};card.ondragstart=()=>{from=i;card.classList.add('is-dragging')};card.ondragend=()=>card.classList.remove('is-dragging');card.ondragover=e=>e.preventDefault();card.ondrop=e=>{e.preventDefault();if(from<0||from===i)return;const [m]=draft.steps.splice(from,1);draft.steps.splice(i,0,m);renderSteps()}})}
        renderIngredients();renderSteps();
        q('.recipe-add-ingredient-v170').onclick=()=>{draft.ingredients.push({id:rid('ingredient'),text:''});renderIngredients();requestAnimationFrame(()=>ingHost.querySelector('[data-ing-index]:last-child input')?.focus())};
        q('.recipe-add-step-v170').onclick=()=>{draft.steps.push({id:rid('step'),title:'',text:''});renderSteps();requestAnimationFrame(()=>stepHost.querySelector('[data-step-index]:last-child input')?.focus())};
        modal.classList.remove('hidden');
        return new Promise(resolve=>{let done=false;const finish=v=>{if(done)return;done=true;modal.classList.add('hidden');resolve(v)};q('.recipe-editor-close-v170').onclick=()=>finish(null);q('.recipe-editor-cancel-v170').onclick=()=>finish(null);modal.onpointerdown=e=>{if(e.target===modal)finish(null)};q('.recipe-editor-save-v170').onclick=()=>{draft.name=q('.recipe-name-v170').value.trim()||'Recipe';draft.type=q('.recipe-type-v170').value.trim();draft.servings=q('.recipe-servings-v170').value.trim();draft.temperature=q('.recipe-temp-v170').value.trim();draft.rating=Math.max(1,Math.min(5,Number(q('.recipe-rating-v170').value)||3));draft.notes=q('.recipe-notes-input-v170').value.trim();draft.ingredients=draft.ingredients.filter(x=>x.text.trim());draft.steps=draft.steps.filter(x=>x.title.trim()||x.text.trim());finish(draft)}});
    }

    renderRecipeTracker = function(tab,component,content){
        if(!Array.isArray(component.items))component.items=[];
        content.innerHTML=`${learningSectionHeader(component,'add-recipe','Add recipe')}<div class="learning-recipe-grid recipe-grid-v170"></div>`;
        const grid=content.querySelector('.learning-recipe-grid');
        component.items.forEach(item=>{normalizeRecipeV170(item);const card=document.createElement('article');card.className='learning-recipe-card recipe-card-v170 custom-searchable-item custom-content-editable';card.dataset.customItemId=item.id;card.dataset.searchText=[item.name,item.type,item.notes,...item.ingredients.map(x=>x.text),...item.steps.map(x=>`${x.title} ${x.text}`)].join(' ').toLowerCase();const rating=Math.max(1,Math.min(5,Number(item.rating)||1));card.innerHTML=`<div class="recipe-card-icon-v170"><i class="ph ph-cooking-pot"></i></div><div class="learning-recipe-top"><strong>${esc(item.name||'Recipe')}</strong><span>${esc(item.type||'')}</span></div><div class="learning-stars">${Array.from({length:5},(_,i)=>`<i class="ph ${i<rating?'ph-star-fill':'ph-star'}"></i>`).join('')}</div><div class="recipe-card-summary-v170">${item.ingredients.length?`<span><i class="ph ph-list-bullets"></i>${item.ingredients.length} ingredients</span>`:''}${item.steps.length?`<span><i class="ph ph-arrow-right"></i>${item.steps.length} steps</span>`:''}</div>`;card.addEventListener('click',e=>{if(e.button!==0)return;openRecipeDetailV170(tab,component,item)});card.addEventListener('contextmenu',e=>{e.preventDefault();showCustomItemContextMenu(e.clientX,e.clientY,[{label:'Open recipe',icon:'ph-eye',action:()=>openRecipeDetailV170(tab,component,item)},{label:'Edit recipe',icon:'ph-pencil-simple',action:()=>window.editRecipeItem(tab,component,item)},{label:'Delete recipe',icon:'ph-trash',danger:true,action:async()=>{const ok=await showAppConfirm({title:'Delete Recipe',message:`Delete “${item.name||'this recipe'}”?`,confirmLabel:'Delete'});if(!ok)return;component.items=component.items.filter(x=>x.id!==item.id);saveDb();renderCustomTabView(tab.id)}}])});grid.appendChild(card)});
        content.querySelector('.add-recipe').onclick=async()=>{const item=await editRecipeModalV170({id:rid('recipe'),name:'',type:'',rating:3,ingredients:[],steps:[],notes:''},true);if(!item)return;component.items.push(item);saveDb();renderCustomTabView(tab.id)};
    };
    window.editRecipeItem = async function(tab,component,item){const updated=await editRecipeModalV170(item,false);if(!updated)return;Object.assign(item,updated);saveDb();renderCustomTabView(tab.id)};
    window.__loggyRecipeV170={normalize:normalizeRecipeV170,workflowHtml:recipeWorkflowHtmlV170,open:openRecipeDetailV170};
})();

// ============================================================
// V171 — dashboard/theme stability + KB map study UX + shared tab templates
//        + primary-display context tools + top-layer help popovers
// ============================================================
(() => {
    'use strict';

    const qV171 = (selector, root = document) => root?.querySelector?.(selector) || null;
    const qaV171 = (selector, root = document) => Array.from(root?.querySelectorAll?.(selector) || []);
    const cloneV171 = value => {
        try { return structuredClone(value); } catch {}
        try { return JSON.parse(JSON.stringify(value)); } catch { return value; }
    };
    const escV171 = value => {
        try { return escapeKnowledgeHtml(String(value ?? '')); }
        catch { return String(value ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch])); }
    };
    const attrV171 = value => {
        try { return escapeKnowledgeAttr(String(value ?? '')); }
        catch { return escV171(value).replace(/`/g, '&#096;'); }
    };

    // ------------------------------------------------------------
    // Theme layering: the creative/code background is the true back layer;
    // image/SVG decorations always live above it. The delayed background
    // rewrites were removed in V158 above so this layer order stays stable.
    // ------------------------------------------------------------
    function restackThemeArtV171() {
        const code = document.getElementById('custom-theme-code-background-v56');
        const stage = document.getElementById('custom-theme-background-stage');
        if (code) code.style.setProperty('z-index', '0', 'important');
        if (stage) stage.style.setProperty('z-index', '1', 'important');
    }
    try {
        const beforeMountV171 = mountCustomThemeBackgroundSvgsV2;
        mountCustomThemeBackgroundSvgsV2 = function(theme) {
            const result = beforeMountV171.apply(this, arguments);
            restackThemeArtV171();
            requestAnimationFrame(restackThemeArtV171);
            return result;
        };
    } catch {}
    try {
        const beforeApplyV171 = applyTheme;
        let lastThemeKeyV171 = '', lastThemeAtV171 = 0, lastThemeResultV171 = null;
        applyTheme = function(themeValue, options = {}) {
            const key = typeof themeValue === 'string' ? themeValue : String(themeValue?.id || themeValue?.name || 'object-theme');
            const now = performance.now();
            if (key && key === lastThemeKeyV171 && now - lastThemeAtV171 < 900 && !options?.force) return lastThemeResultV171;
            lastThemeKeyV171 = key;
            lastThemeAtV171 = now;
            lastThemeResultV171 = Promise.resolve(beforeApplyV171.apply(this, arguments)).then(result => {
                restackThemeArtV171();
                requestAnimationFrame(restackThemeArtV171);
                return result;
            });
            return lastThemeResultV171;
        };
    } catch {}

    // ------------------------------------------------------------
    // A create-theme request must always mean a genuinely blank draft.
    // Window capture runs before older document-level create handlers.
    // ------------------------------------------------------------
    function openBlankThemeV171() {
        // openNewThemeBuilderCleanV34 is looked up at call time, so by the time
        // a click actually happens this resolves to the newest/most complete
        // "new theme" implementation defined anywhere in this file (currently
        // the pre-warmed instant-open version). Try that first. The V164
        // fallback is older, does a full synchronous rebuild every time
        // (slow), and is missing resets for some newer theme fields - it
        // should only ever run if the current implementation is unavailable.
        try { const r = openNewThemeBuilderCleanV34?.(); if (r) return r; } catch {}
        try { return window.__loggyV164?.openBrandNewThemeV164?.(); } catch {}
        return null;
    }
    // V260: Create Theme clicks/messages are owned by one authoritative late
    // controller in template-extras-6.js. Historical duplicate capture handlers
    // were removed because they could populate/open the same Builder twice.

    // ------------------------------------------------------------
    // Knowledge Base primary display is edited from the category context menu.
    // ------------------------------------------------------------
    function ensurePrimaryDisplayModalV171() {
        let modal = document.getElementById('kb-primary-display-modal-v171');
        if (modal) return modal;
        modal = document.createElement('div');
        modal.id = 'kb-primary-display-modal-v171';
        modal.className = 'modal-overlay hidden';
        modal.innerHTML = `
            <div class="modal-box kb-primary-display-box-v171">
                <div class="modal-header">
                    <div><h2>Edit Primary Label</h2><p class="progress-hint kb-primary-category-name-v171"></p></div>
                    <button type="button" class="small-icon-btn kb-primary-close-v171"><i class="ph ph-x"></i></button>
                </div>
                <div class="modal-section">
                    <span class="field-label">Primary Display</span>
                    <select class="kb-primary-field-v171"></select>
                    <p class="progress-hint">Choose what represents items from this category. Pinned Image fields show the actual labeled map/image on Knowledge Base cards.</p>
                </div>
                <div class="modal-section">
                    <span class="field-label">Display Scope</span>
                    <select class="kb-primary-scope-v171">
                        <option value="kb">Knowledge Base Only</option>
                        <option value="everywhere">Everywhere</option>
                    </select>
                </div>
                <button type="button" class="icon-btn kb-primary-save-v171"><i class="ph ph-check"></i> Save</button>
            </div>`;
        document.body.appendChild(modal);
        qV171('.kb-primary-close-v171', modal).onclick = () => modal.classList.add('hidden');
        modal.addEventListener('click', event => { if (event.target === modal) modal.classList.add('hidden'); });
        return modal;
    }
    function openPrimaryDisplayModalV171(category) {
        if (!category) return;
        const modal = ensurePrimaryDisplayModalV171();
        modal.dataset.categoryV171 = category;
        qV171('.kb-primary-category-name-v171', modal).textContent = category;
        const cfg = getCategoryConfig(category);
        const fields = getKnowledgeFieldDefs(category) || [];
        const select = qV171('.kb-primary-field-v171', modal);
        select.innerHTML = `<option value="__title__">Original item title / ID</option>` + fields.map(field => {
            const suffix = field?.kind === 'pinnedImage' ? ' — Pinned Image' : '';
            return field?.name ? `<option value="${attrV171(field.name)}">${escV171(field.name + suffix)}</option>` : '';
        }).join('');
        select.value = cfg?.displayFieldV162 || '__title__';
        qV171('.kb-primary-scope-v171', modal).value = cfg?.displayScopeV162 === 'kb' ? 'kb' : 'everywhere';
        qV171('.kb-primary-save-v171', modal).onclick = () => {
            const liveCfg = getCategoryConfig(category);
            liveCfg.displayFieldV162 = select.value || '__title__';
            liveCfg.displayScopeV162 = qV171('.kb-primary-scope-v171', modal).value === 'kb' ? 'kb' : 'everywhere';
            db.settings.categorySettings ||= {};
            db.settings.categorySettings[category] ||= liveCfg;
            db.settings.categorySettings[category].displayFieldV162 = liveCfg.displayFieldV162;
            db.settings.categorySettings[category].displayScopeV162 = liveCfg.displayScopeV162;
            saveDb();
            modal.classList.add('hidden');
            try { renderPhrasesLibrary(qV171('#phrases-search-bar')?.value || ''); } catch {}
            try { if (currentDay && db.days?.[currentDay]) renderPhrases(db.days[currentDay].phrases || []); } catch {}
        };
        modal.classList.remove('hidden');
    }
    document.addEventListener('contextmenu', event => {
        const button = event.target.closest?.('#settings-category-tabs .kb-category-grid-item:not(.kb-category-grid-add)');
        if (!button) return;
        const category = String(button.textContent || '').trim();
        if (!category) return;
        event.preventDefault();
        event.stopImmediatePropagation();
        showCustomItemContextMenu(event.clientX, event.clientY, [
            { label:'Rename category', icon:'ph-pencil-simple', action:()=>renameKnowledgeCategory(category) },
            { label:'Edit Primary Label', icon:'ph-identification-card', action:()=>openPrimaryDisplayModalV171(category) },
            { label:'Delete category', icon:'ph-trash', danger:true, action:()=>deleteKnowledgeCategory(category) }
        ]);
    }, true);
    function hideLegacyPrimaryControlsV171() {
        qaV171('.kb-display-label-settings-v162').forEach(section => section.remove());
    }
    try {
        const beforeSettingsV171 = renderSettings;
        renderSettings = function() {
            const result = beforeSettingsV171.apply(this, arguments);
            hideLegacyPrimaryControlsV171();
            return result;
        };
    } catch {}

    // ------------------------------------------------------------
    // Render a pinned-image primary display directly on KB cards.
    // ------------------------------------------------------------
    function primaryPinnedDataV171(itemId) {
        try {
            const category = db.phrase_meta?.[itemId]?.type;
            if (!category) return null;
            const cfg = db.settings?.categorySettings?.[category];
            const fieldName = String(cfg?.displayFieldV162 || '');
            if (!fieldName || fieldName === '__title__') return null;
            const field = getKnowledgeFieldDefs(category).find(entry => entry?.name === fieldName && entry?.kind === 'pinnedImage');
            if (!field) return null;
            const raw = db.phrase_meta?.[itemId]?.custom_fields?.[fieldName];
            const data = window.__loggyPinnedImageV169?.parse?.(raw, field);
            return data?.image ? { field, data } : null;
        } catch { return null; }
    }
    function primaryMapHtmlV171(data) {
        return window.__loggyPinnedImageV169?.renderStage?.(data, {
            labeled:true,
            readonly:true,
            stageClass:'kb-primary-map-stage-v171',
            labelClass:'kb-primary-map-label-v171'
        }) || '';
    }
    function decoratePrimaryMapsV171() {
        const grid = document.getElementById('phrases-library-grid');
        if (!grid) return;
        qaV171('.phrase-card,.polaroid-card', grid).forEach(card => {
            const itemId = card.dataset.kbItemIdV163 || card.dataset.kbItemIdV162 || card.dataset.itemId || '';
            qV171(':scope > .kb-primary-map-v171', card)?.remove();
            if (!itemId) return;
            const pinned = primaryPinnedDataV171(itemId);
            if (!pinned) return;
            const wrap = document.createElement('div');
            wrap.className = 'kb-primary-map-v171';
            wrap.innerHTML = primaryMapHtmlV171(pinned.data);
            card.insertBefore(wrap, card.firstChild);
            // V621: a map polaroid uses the map itself as its one media panel.
            // The generic polaroid media slot used to remain underneath it,
            // which produced the duplicate second image/placeholder.
            if (card.classList.contains('polaroid-card')) {
                qV171(':scope > .polaroid-video', card)?.remove();
            }
        });
    }
    try {
        const beforeLibraryV171 = renderPhrasesLibrary;
        renderPhrasesLibrary = function() {
            const result = beforeLibraryV171.apply(this, arguments);
            requestAnimationFrame(decoratePrimaryMapsV171);
            return result;
        };
    } catch {}

    // ------------------------------------------------------------
    // Custom tab templates are shared by every log page on this origin.
    // ------------------------------------------------------------
    const GLOBAL_BLUEPRINT_KEY_V171 = 'loggy-global-custom-tab-blueprints-v171';
    let blueprintSignatureV171 = '';
    function readGlobalBlueprintsV171() {
        try { const parsed = JSON.parse(localStorage.getItem(GLOBAL_BLUEPRINT_KEY_V171) || '[]'); return Array.isArray(parsed) ? parsed : []; }
        catch { return []; }
    }
    function writeGlobalBlueprintsV171(list) {
        try { localStorage.setItem(GLOBAL_BLUEPRINT_KEY_V171, JSON.stringify(list || [])); } catch {}
    }
    function localBlueprintsV171() {
        db.settings ||= {};
        db.settings.customTabBlueprintsV162 ||= [];
        return db.settings.customTabBlueprintsV162;
    }
    function refreshBlueprintUiV171() {
        try {
            document.getElementById('blueprint-manager-v162')?.remove();
            ensureCustomTabCreateModal?.();
        } catch {}
    }
    function setBuiltInBlueprintStateV171(id, state) {
        db.settings ||= {};
        db.settings.builtInBlueprintStateV162 ||= {};
        db.settings.builtInBlueprintStateV162[id] = state;
        saveDb();
        refreshBlueprintUiV171();
    }
    function signatureV171() {
        try { return JSON.stringify(localBlueprintsV171()); } catch { return ''; }
    }
    function mergeGlobalBlueprintsV171() {
        const local = localBlueprintsV171();
        const global = readGlobalBlueprintsV171();
        if (global.length) {
            const localById = new Map(local.map(item => [String(item?.id || ''), item]));
            global.forEach(item => {
                if (!item?.id) return;
                const index = local.findIndex(entry => String(entry?.id || '') === String(item.id));
                if (index >= 0) local[index] = cloneV171(item);
                else local.push(cloneV171(item));
            });
        } else if (local.length) {
            writeGlobalBlueprintsV171(cloneV171(local));
        }
        blueprintSignatureV171 = signatureV171();
    }
    mergeGlobalBlueprintsV171();
    try {
        const beforeSaveDbV171 = saveDb;
        saveDb = function() {
            const current = signatureV171();
            if (current !== blueprintSignatureV171) {
                writeGlobalBlueprintsV171(cloneV171(localBlueprintsV171()));
                blueprintSignatureV171 = current;
            }
            return beforeSaveDbV171.apply(this, arguments);
        };
    } catch {}
    try {

    } catch {}
    window.addEventListener('storage', event => {
        if (event.key !== GLOBAL_BLUEPRINT_KEY_V171) return;
        mergeGlobalBlueprintsV171();
        refreshBlueprintUiV171();
    });
    function duplicateBlueprintV171(bp) {
        if (!bp) return;
        const copy = cloneV171(bp);
        copy.id = typeof uid === 'function' ? uid('blueprint') : `blueprint-${Date.now()}`;
        copy.name = `${bp.name || 'Template'} Copy`;
        copy.status = 'active';
        copy.createdAt = new Date().toISOString();
        copy.updatedAt = copy.createdAt;
        localBlueprintsV171().push(copy);
        saveDb();
        refreshBlueprintUiV171();
    }
    document.addEventListener('contextmenu', event => {
        const custom = event.target.closest?.('#custom-tab-create-modal .custom-template-card-v162[data-custom-blueprint-id-v162]');
        if (custom) {
            const bp = localBlueprintsV171().find(item => String(item.id) === String(custom.dataset.customBlueprintIdV162));
            if (!bp) return;
            event.preventDefault();
            event.stopImmediatePropagation();
            showCustomItemContextMenu(event.clientX,event.clientY,[
                {label:'Duplicate template',icon:'ph-copy',action:()=>duplicateBlueprintV171(bp)},
                {label:'Archive template',icon:'ph-archive',action:()=>{bp.status='archived';bp.updatedAt=new Date().toISOString();saveDb();refreshBlueprintUiV171()}},
                {label:'Delete template',icon:'ph-trash',danger:true,action:()=>{bp.status='deleted';bp.updatedAt=new Date().toISOString();saveDb();refreshBlueprintUiV171()}}
            ]);
            return;
        }
        const builtin = event.target.closest?.('#custom-tab-create-modal [data-custom-tab-template-v53]');
        if (!builtin) return;
        const id = builtin.dataset.customTabTemplateV53;
        const def = (CUSTOM_TAB_TEMPLATES_V53 || []).find(item => item.id === id);
        if (!def) return;
        event.preventDefault();
        event.stopImmediatePropagation();
        showCustomItemContextMenu(event.clientX,event.clientY,[
            {label:'Duplicate template',icon:'ph-copy',action:()=>{
                const bp={id:typeof uid==='function'?uid('blueprint'):`blueprint-${Date.now()}`,name:`${def.name || 'Template'} Copy`,icon:def.icon||'ph-tabs',components:cloneV171(buildPrebuiltTabComponentsV53(id)||[]),status:'active',createdAt:new Date().toISOString(),updatedAt:new Date().toISOString()};
                localBlueprintsV171().push(bp);saveDb();refreshBlueprintUiV171();
            }},
            {label:'Archive template',icon:'ph-archive',action:()=>setBuiltInBlueprintStateV171(id,'archived')},
            {label:'Delete template',icon:'ph-trash',danger:true,action:()=>setBuiltInBlueprintStateV171(id,'deleted')}
        ]);
    }, true);

    // ------------------------------------------------------------
    // Help popovers render in a body-level portal so no component/card can
    // cover or clip them. Placement still chooses the side with room.
    // ------------------------------------------------------------
    let helpPortalV171 = null;
    let helpOwnerV171 = null;
    function hideHelpPortalV171() {
        helpPortalV171?.remove();
        helpPortalV171 = null;
        helpOwnerV171 = null;
    }
    function showHelpPortalV171(owner) {
        const source = qV171('.custom-palette-tooltip-v164,.custom-component-help-tooltip-v163', owner);
        if (!source) return;
        hideHelpPortalV171();
        const rect = owner.getBoundingClientRect();
        const width = Math.min(310, Math.max(220, window.innerWidth - 24));
        const gap = 9;
        const roomRight = window.innerWidth - rect.left;
        const openRight = rect.left < window.innerWidth / 2 || roomRight > width + gap;
        const portal = document.createElement('div');
        portal.className = 'custom-help-portal-v171';
        portal.innerHTML = source.innerHTML;
        document.body.appendChild(portal);
        portal.style.width = `${width}px`;
        const measured = portal.getBoundingClientRect();
        let left = openRight ? rect.left : rect.right - measured.width;
        left = Math.max(12, Math.min(window.innerWidth - measured.width - 12, left));
        let top = rect.bottom + gap;
        if (top + measured.height > window.innerHeight - 12) top = Math.max(12, rect.top - measured.height - gap);
        portal.style.left = `${left}px`;
        portal.style.top = `${top}px`;
        helpPortalV171 = portal;
        helpOwnerV171 = owner;
    }
    document.addEventListener('pointerover', event => {
        const owner = event.target.closest?.('.custom-palette-help-v164,.custom-component-help-v163');
        if (!owner || owner === helpOwnerV171) return;
        showHelpPortalV171(owner);
    }, true);
    document.addEventListener('pointerout', event => {
        const owner = event.target.closest?.('.custom-palette-help-v164,.custom-component-help-v163');
        if (!owner || owner !== helpOwnerV171) return;
        if (event.relatedTarget && owner.contains(event.relatedTarget)) return;
        hideHelpPortalV171();
    }, true);
    document.addEventListener('focusin', event => {
        const owner = event.target.closest?.('.custom-palette-help-v164,.custom-component-help-v163');
        if (owner) showHelpPortalV171(owner);
    });
    document.addEventListener('focusout', event => {
        if (event.target.closest?.('.custom-palette-help-v164,.custom-component-help-v163')) hideHelpPortalV171();
    });
    window.addEventListener('scroll', hideHelpPortalV171, true);
    window.addEventListener('resize', hideHelpPortalV171);

    // ------------------------------------------------------------
    // Pinned-image quiz renderer V171.
    // Flashcards are one-sided: labels are revealed by clicking pins.
    // Parts mode makes Quizlet Learn / Anki prompt one pin at a time.
    // ------------------------------------------------------------
    const partSessionsV171 = new Map();
    function pinDataV171(itemId) { return window.__loggyPinnedImageV169?.fieldForItem?.(itemId) || null; }
    function pinStageV171(data, options = {}) {
        const reveal = options.reveal instanceof Set ? options.reveal : new Set();
        const current = String(options.current || '');
        const pins = Array.isArray(data?.pins) ? data.pins : [];
        if (!data?.image) return '';
        return `<div class="kb-pinned-stage-v169 quiz-map-stage-v171"><img src="${attrV171(data.image)}" alt=""><div class="kb-pinned-overlay-v169">${pins.map((pin,index)=>{
            const id=String(pin.id||`pin-${index}`),label=String(pin.label||'').trim(),shown=reveal.has(id),dir=['up','right','down','left'].includes(pin.direction)?pin.direction:'down',size=Math.max(.55,Math.min(2.2,Number(pin.size)||1));
            return `<button type="button" class="kb-map-pin-v169 pin-dir-${dir} ${current===id?'kb-map-pin-v171-current':''} ${shown?'is-revealed-v171':''}" data-pin-id-v171="${attrV171(id)}" style="left:${Number(pin.x)||0}%;top:${Number(pin.y)||0}%;--pin-color-v169:${attrV171(pin.color||data.pinColor||'#e53935')};--pin-scale-v171:${size};"><span class="kb-map-pin-dot-v169"></span></button>${shown&&label?`<span class="kb-map-pin-label-v169 quiz-map-label-v171" data-pin-label-for-v170="${attrV171(id)}" data-pin-x-v170="${Number(pin.x)||0}" data-pin-y-v170="${Number(pin.y)||0}" data-label-dx-v170="${Number(pin.labelDx)||0}" data-label-dy-v170="${Number(pin.labelDy)||0}" data-label-manual-v170="${pin.labelManual?'1':'0'}">${escV171(label)}</span>`:''}`;
        }).join('')}</div></div>`;
    }
    function currentQuizItemV171() {
        try { return quizMode === 'learn' ? (learnQueue?.[0]?.id || '') : (activeQuizDeck?.[activeQuizIndex] || ''); }
        catch { return ''; }
    }
    function setQuizCounterV171() {
        try { qV171('#quiz-set-label').innerText = `${Math.min(activeQuizIndex + 1, activeQuizDeck.length)} / ${activeQuizDeck.length}`; } catch {}
    }
    function renderPinnedFlashcardV171(area,itemId,pinned) {
        setQuizCounterV171();
        const data=pinned.data,reveal=new Set();
        const parts=data.testMode==='parts';
        let partIndex=0;
        const pins=data.pins||[];
        const render=()=>{
            const current=parts?String(pins[partIndex]?.id||''):'';
            area.innerHTML=`<div class="flashcard-mode-wrap quiz-pinned-card-wrap-v169 quiz-pinned-one-sided-v171"><div class="flashcard-mode-card quiz-pinned-card-v169 quiz-pinned-front-v171">${parts?`<div class="quiz-map-part-prompt-v171">Label this pin <span>${Math.min(partIndex+1,pins.length)} / ${pins.length}</span></div>`:''}${pinStageV171(data,{reveal,current})}</div><div class="flashcard-hint-text">Click a pin to reveal its label.${parts?' Use Next Pin to move through the map.':''}</div>${parts?`<div class="quiz-map-part-nav-v171"><button class="icon-btn quiz-map-prev-pin-v171" ${partIndex===0?'disabled':''}><i class="ph ph-arrow-left"></i> Previous Pin</button><button class="icon-btn quiz-map-next-pin-v171">${partIndex>=pins.length-1?'Next Card':'Next Pin'} <i class="ph ph-arrow-right"></i></button></div>`:`<div class="flashcard-nav-container"><button class="flashcard-nav-btn" id="fc-prev" ${activeQuizIndex===0?'disabled':''}><i class="ph ph-arrow-left"></i></button><button class="flashcard-nav-btn" id="fc-next"><i class="ph ph-arrow-right"></i></button></div>`}</div>`;
            qaV171('[data-pin-id-v171]',area).forEach(btn=>btn.onclick=event=>{event.preventDefault();event.stopPropagation();const id=btn.dataset.pinIdV171;if(parts&&id!==current)return;const wasOpen=reveal.has(id);reveal.clear();if(!wasOpen)reveal.add(id);render();requestAnimationFrame(()=>window.__layoutPinnedLabelsV170?.(area))});
            if(parts){
                qV171('.quiz-map-prev-pin-v171',area)?.addEventListener('click',()=>{if(partIndex>0){partIndex--;reveal.clear();render()}});
                qV171('.quiz-map-next-pin-v171',area)?.addEventListener('click',()=>{if(partIndex<pins.length-1){partIndex++;reveal.clear();render()}else{activeQuizIndex++;quizCardFlipped=false;currentSlideIndex=0;showQuizCard()}});
            } else {
                qV171('#fc-prev',area)?.addEventListener('click',()=>{if(activeQuizIndex>0){activeQuizIndex--;quizCardFlipped=false;currentSlideIndex=0;showQuizCard()}});
                qV171('#fc-next',area)?.addEventListener('click',()=>{activeQuizIndex++;quizCardFlipped=false;currentSlideIndex=0;showQuizCard()});
            }
            requestAnimationFrame(()=>window.__layoutPinnedLabelsV170?.(area));
        };
        render();
    }
    function renderPinnedPartsQuizV171(area,itemId,pinned,mode) {
        setQuizCounterV171();
        const pins=pinned.data.pins||[];
        const key=`${mode}:${itemId}`;
        const session=partSessionsV171.get(key)||{index:0,correct:new Set()};
        session.index=Math.max(0,Math.min(pins.length-1,session.index||0));
        partSessionsV171.set(key,session);
        const pin=pins[session.index];
        if(!pin)return;
        const render=()=>{
            const reveal=new Set(session.correct);
            area.innerHTML=`<div class="flashcard-wrap quiz-pinned-card-wrap-v169 quiz-map-parts-v171"><div class="flashcard-mode-card quiz-pinned-card-v169 quiz-pinned-front-v171"><div class="quiz-map-part-prompt-v171"><strong>Label this pin</strong><span>${session.index+1} / ${pins.length}</span></div>${pinStageV171(pinned.data,{reveal,current:pin.id})}<div class="quiz-map-answer-row-v171"><input type="text" class="quiz-map-answer-v171" autocomplete="off" placeholder="Type the pin label…"><button type="button" class="icon-btn quiz-map-answer-save-v171"><i class="ph ph-arrow-return-left"></i> Enter</button></div><div class="quiz-map-answer-status-v171"></div></div></div>`;
            const input=qV171('.quiz-map-answer-v171',area),status=qV171('.quiz-map-answer-status-v171',area);
            const submit=()=>{
                const typed=String(input?.value||'').trim();if(!typed)return;
                if(!window.__loggyPinnedImageV169?.answersMatch?.(typed,pin.label)){
                    status.textContent='Try again.';status.classList.add('is-wrong-v171');input?.select();return;
                }
                session.correct.add(pin.id);status.textContent='Correct';status.classList.remove('is-wrong-v171');status.classList.add('is-correct-v171');
                if(session.index<pins.length-1){session.index++;partSessionsV171.set(key,session);setTimeout(()=>renderPinnedPartsQuizV171(area,itemId,pinned,mode),180);return;}
                partSessionsV171.delete(key);
                if(mode==='learn'){setTimeout(()=>processLearnAnswer(true),180);return;}
                area.innerHTML=`<div class="flashcard-wrap quiz-pinned-card-wrap-v169"><div class="flashcard-mode-card quiz-pinned-card-v169 quiz-pinned-front-v171"><div class="quiz-map-complete-v171"><i class="ph ph-check-circle"></i><strong>All pins labeled</strong></div>${pinStageV171(pinned.data,{reveal:new Set(pins.map(x=>x.id))})}</div><div class="quiz-pinned-anki-actions-v169"><button class="icon-btn still-learning-btn quiz-map-again-v171"><i class="ph ph-arrow-counter-clockwise"></i> Still Learning</button><button class="icon-btn got-it-btn quiz-map-good-v171"><i class="ph ph-check"></i> Got It!</button></div></div>`;
                qV171('.quiz-map-again-v171',area).onclick=()=>processAnkiAnswer('Again');
                qV171('.quiz-map-good-v171',area).onclick=()=>processAnkiAnswer('Good');
                requestAnimationFrame(()=>window.__layoutPinnedLabelsV170?.(area));
            };
            qV171('.quiz-map-answer-save-v171',area)?.addEventListener('click',submit);
            input?.addEventListener('keydown',event=>{if(event.key==='Enter'){event.preventDefault();submit()}});
            requestAnimationFrame(()=>{window.__layoutPinnedLabelsV170?.(area);input?.focus()});
        };
        render();
    }
    try {
        const beforeShowQuizV171 = showQuizCard;
        showQuizCard = function() {
            const area=document.getElementById('quiz-flashcard-area');
            const itemId=currentQuizItemV171();
            const pinned=itemId?pinDataV171(itemId):null;
            if(!area||!pinned)return beforeShowQuizV171.apply(this,arguments);
            if(quizMode==='flashcards'){
                renderPinnedFlashcardV171(area,itemId,pinned);
                return;
            }
            if((quizMode==='learn'||quizMode==='anki')&&pinned.data.testMode==='parts'){
                renderPinnedPartsQuizV171(area,itemId,pinned,quizMode);
                return;
            }
            return beforeShowQuizV171.apply(this,arguments);
        };
    } catch {}

    // Recipe tracker V170 was previously assigned only on window; guarantee the
    // actual renderer binding sees it after older function declarations.
    try { if (typeof window.renderRecipeTracker === 'function' && window.renderRecipeTracker !== renderRecipeTracker) renderRecipeTracker = window.renderRecipeTracker; } catch {}

    // Run one cleanup pass after the app has mounted.
    function initV171() {
        hideLegacyPrimaryControlsV171();
        restackThemeArtV171();
        try { decoratePrimaryMapsV171(); } catch {}
    }
    if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',initV171,{once:true});else initV171();
})();

// ============================================================
// V172 — pinned-map UX/study fixes, KB context/select polish,
// recipe tracker reliability, and hard blank-theme creation
// ============================================================
(() => {
    'use strict';
    if (window.__loggyV172) return;
    window.__loggyV172 = true;

    const q = (s, r = document) => r?.querySelector?.(s) || null;
    const qa = (s, r = document) => Array.from(r?.querySelectorAll?.(s) || []);
    const esc = value => {
        try { return escapeCustomHtml(String(value ?? '')); }
        catch { return String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
    };
    const attr = value => esc(value).replace(/`/g, '&#096;');
    const uid = prefix => `${prefix}-v172-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

    // ------------------------------------------------------------
    // Pinned image UI: keep the full-screen canvas clean. Quiz mode lives
    // under Hide from quizzes and is only visible when the item is testable.
    // ------------------------------------------------------------
    function syncPinnedQuizControlsV172(root = document) {
        const containers = [
            q('#kb-add-item-fields-body', root) || q('#add-item-dynamic-fields', root),
            q('#phrase-modal-dynamic-fields', root)
        ].filter(Boolean);

        containers.forEach(container => {
            const section = q('.kb-pinned-image-field-v169', container);
            if (!section) return;
            const original = q('.kb-pinned-test-mode-wrap-v171', section);
            if (!original) return;
            original.classList.add('kb-pinned-test-mode-original-v172');

            const hideRow = q('.kb-hide-from-quizzes-row-v59', container.parentElement || container) ||
                            q('.kb-hide-from-quizzes-row-v59', container.closest('.modal-box') || document);
            if (!hideRow) return;
            const hideCheck = q('input[type="checkbox"]', hideRow);
            const sourceSelect = q('.kb-pinned-test-mode-v171', original);
            if (!sourceSelect) return;

            let row = q('.kb-pinned-quiz-mode-row-v172', hideRow.parentElement);
            if (!row) {
                row = document.createElement('div');
                row.className = 'modal-section mt-10 kb-pinned-quiz-mode-row-v172';
                row.innerHTML = `
                    <div class="kb-item-field-label-row">
                        <span class="field-label">Pinned Image Quiz Mode</span>
                        <span class="kb-inline-help-v169" title="Test whole image asks you to label all pins on one map. Test by parts makes each pin its own study prompt.">?</span>
                    </div>
                    <select class="kb-pinned-test-mode-proxy-v172">
                        <option value="whole">Test whole image</option>
                        <option value="parts">Test by parts</option>
                    </select>
                    <p class="progress-hint">Choose whether this map is studied all at once or one pin at a time.</p>`;
                hideRow.insertAdjacentElement('afterend', row);
            }
            const proxy = q('.kb-pinned-test-mode-proxy-v172', row);
            proxy.value = sourceSelect.value === 'parts' ? 'parts' : 'whole';
            if (!proxy.dataset.boundV172) {
                proxy.dataset.boundV172 = '1';
                proxy.addEventListener('change', () => {
                    sourceSelect.value = proxy.value;
                    sourceSelect.dispatchEvent(new Event('change', { bubbles: true }));
                });
            }
            const refresh = () => row.classList.toggle('hidden', !!hideCheck?.checked);
            refresh();
            if (hideCheck && !hideCheck.dataset.pinnedQuizBoundV172) {
                hideCheck.dataset.pinnedQuizBoundV172 = '1';
                hideCheck.addEventListener('change', refresh);
            }
        });
    }

    const schedulePinnedPolishV172 = () => requestAnimationFrame(() => syncPinnedQuizControlsV172(document));
    try {
        const before = renderAddKnowledgeFields;
        renderAddKnowledgeFields = function() { const r = before.apply(this, arguments); schedulePinnedPolishV172(); return r; };
    } catch {}
    try {
        const before = renderKnowledgeEditFields;
        renderKnowledgeEditFields = function() { const r = before.apply(this, arguments); schedulePinnedPolishV172(); return r; };
    } catch {}
    /* V187: renderAddKnowledgeFields/renderKnowledgeEditFields above are the only
       creation paths that need this polish, so a whole-document observer is redundant. */

    // ------------------------------------------------------------
    // KB cards: selection is border-only. Right click = edit/delete.
    // Left click remains the normal open action. Delete button in edit modal
    // is removed because deletion belongs in the context menu.
    // ------------------------------------------------------------
    function selectedKbIdsV172() {
        return qa('#phrases-library-grid .kb-selected-v163[data-kb-item-id-v163]').map(card => card.dataset.kbItemIdV163).filter(Boolean);
    }
    async function deleteKnowledgeItemsV172(ids) {
        ids = [...new Set(ids)].filter(id => (db.phrases || []).includes(id));
        if (!ids.length) return;
        const ok = await showAppConfirm({
            title: ids.length === 1 ? 'Delete Knowledge Base Item' : 'Delete Selected Items',
            message: ids.length === 1 ? `Move “${ids[0]}” to Trash?` : `Move ${ids.length} selected items to Trash?`,
            confirmLabel: ids.length === 1 ? 'Delete' : 'Delete Selected'
        });
        if (!ok) return;
        ids.forEach(id => { try { moveKnowledgeItemToTrash(id); } catch {} });
        // V163's next render sees an empty selection and exits naturally when no
        // cards remain selected; explicitly click the active select control off.
        const toggle = q('#kb-select-toggle-v163.selected');
        if (toggle) toggle.click();
        try { renderPhrasesLibrary(q('#phrases-search-bar')?.value || ''); } catch {}
    }
    function polishKbCardsV172() {
        qa('.kb-select-check-v163').forEach(node => node.remove());
        const grid = q('#phrases-library-grid');
        if (!grid) return;
        const cards = qa('.phrase-card,.polaroid-card', grid);
        cards.forEach(card => {
            const id = card.dataset.kbItemIdV163;
            if (!id) return;
            card.oncontextmenu = event => {
                event.preventDefault();
                event.stopPropagation();
                const inSelectMode = !!q('#kb-select-toggle-v163.selected');
                if (inSelectMode) {
                    if (!card.classList.contains('kb-selected-v163')) card.click();
                    requestAnimationFrame(() => {
                        const ids = selectedKbIdsV172();
                        showCustomItemContextMenu(event.clientX, event.clientY, [{
                            label: `Delete ${Math.max(1, ids.length)} selected`, icon: 'ph-trash', danger: true,
                            action: () => deleteKnowledgeItemsV172(ids.length ? ids : [id])
                        }]);
                    });
                    return;
                }
                showCustomItemContextMenu(event.clientX, event.clientY, [
                    { label: 'Edit item', icon: 'ph-pencil-simple', action: () => openItemModal(id, true, true) },
                    { label: 'Delete item', icon: 'ph-trash', danger: true, action: () => deleteKnowledgeItemsV172([id]) }
                ]);
            };
        });
        q('#phrase-modal-delete')?.classList.add('hidden');

        const mapCards = cards.filter(card => q('.kb-primary-map-v171', card));
        grid.classList.remove('kb-primary-map-flow-v172');
        cards.forEach(card => card.classList.toggle('has-primary-map-v172', !!q('.kb-primary-map-v171', card)));
    }
    try {
        const before = renderPhrasesLibrary;
        renderPhrasesLibrary = function() { const r = before.apply(this, arguments); requestAnimationFrame(polishKbCardsV172); return r; };
    } catch {}
    try {
        const before = openItemModal;
        openItemModal = function() {
            const r = before.apply(this, arguments);
            requestAnimationFrame(() => {
                q('#phrase-modal-delete')?.classList.add('hidden');
                syncPinnedQuizControlsV172(document);
            });
            return r;
        };
    } catch {}

    // ------------------------------------------------------------
    // Pinned image study renderer. Never lets serialized JSON fall through to
    // generic quiz cards. Flashcards are one-sided; click a pin to reveal it.
    // Learn/Anki use case-insensitive typed labels.
    // ------------------------------------------------------------
    const studyStateV172 = new Map();
    function currentQuizItemV172() {
        try { return quizMode === 'learn' ? (learnQueue?.[0]?.id || '') : (activeQuizDeck?.[activeQuizIndex] || ''); }
        catch { return ''; }
    }
    function pinFieldV172(itemId) { return window.__loggyPinnedImageV169?.fieldForItem?.(itemId) || null; }
    function answerMatchesV172(a, b) { return window.__loggyPinnedImageV169?.answersMatch?.(a, b) ?? (String(a).trim().toLowerCase() === String(b).trim().toLowerCase()); }
    function pinStageV172(data, state = {}, opts = {}) {
        const reveal = state.reveal || new Set();
        const correct = state.correct || new Set();
        const active = opts.active || '';
        return `<div class="map-study-stage-v172"><img src="${attr(data.image)}" alt="Pinned study image"><div class="kb-pinned-overlay-v169">${(data.pins||[]).map((pin,index)=>{
            const id=String(pin.id||index), shown=reveal.has(id)||correct.has(id), label=String(pin.label||'').trim();
            const dir=['up','right','down','left'].includes(pin.direction)?pin.direction:'down';
            const color=correct.has(id)?'#22a06b':(pin.color||data.pinColor||'#e53935');
            const scale=Math.max(.55,Math.min(2.2,Number(pin.size)||1));
            return `<button type="button" class="kb-map-pin-v169 pin-dir-${dir} ${active===id?'map-study-active-v172':''} ${correct.has(id)?'map-study-correct-v172':''}" data-map-pin-v172="${attr(id)}" style="left:${Number(pin.x)||0}%;top:${Number(pin.y)||0}%;--pin-color-v169:${attr(color)};--pin-scale-v171:${scale};"><span class="kb-map-pin-dot-v169"></span></button>${shown&&label?`<span class="kb-map-pin-label-v169" data-pin-label-for-v170="${attr(id)}" data-pin-x-v170="${Number(pin.x)||0}" data-pin-y-v170="${Number(pin.y)||0}" data-label-dx-v170="${Number(pin.labelDx)||0}" data-label-dy-v170="${Number(pin.labelDy)||0}" data-label-manual-v170="${pin.labelManual?'1':'0'}">${esc(label)}</span>`:''}`;
        }).join('')}</div></div>`;
    }
    function setCounterV172() {
        try { q('#quiz-set-label').innerText = `${Math.min(activeQuizIndex + 1, activeQuizDeck.length)} / ${activeQuizDeck.length}`; } catch {}
    }
    function nextFlashcardV172(delta=1) {
        activeQuizIndex = Math.max(0, activeQuizIndex + delta);
        quizCardFlipped = false; currentSlideIndex = 0; showQuizCard();
    }
    function renderMapFlashcardV172(area, itemId, pinned) {
        setCounterV172();
        const pins=(pinned.data.pins||[]).filter(p=>String(p.label||'').trim());
        const parts=pinned.data.testMode==='parts';
        const key=`flash:${itemId}`;
        const st=studyStateV172.get(key)||{reveal:new Set(),index:0,correct:new Set()}; studyStateV172.set(key,st);
        st.index=Math.max(0,Math.min(st.index,pins.length-1));
        const active=parts?String(pins[st.index]?.id||''):'';
        area.innerHTML=`<div class="map-study-wrap-v172"><div class="map-study-card-v172">${parts?`<div class="map-study-prompt-v172"><strong>Which place is this pin?</strong><span>${st.index+1} / ${pins.length}</span></div>`:''}${pinStageV172(pinned.data,st,{active})}</div><div class="flashcard-hint-text">Click ${parts?'the highlighted pin':'a pin'} to reveal its label.</div>${parts?`<div class="map-study-nav-v172"><button class="icon-btn map-prev-pin-v172" ${st.index===0?'disabled':''}><i class="ph ph-arrow-left"></i> Previous Pin</button><button class="icon-btn map-next-pin-v172">${st.index>=pins.length-1?'Next Card':'Next Pin'} <i class="ph ph-arrow-right"></i></button></div>`:`<div class="flashcard-nav-container"><button class="flashcard-nav-btn map-prev-card-v172" ${activeQuizIndex===0?'disabled':''}><i class="ph ph-arrow-left"></i></button><button class="flashcard-nav-btn map-next-card-v172"><i class="ph ph-arrow-right"></i></button></div>`}</div>`;
        qa('[data-map-pin-v172]',area).forEach(btn=>btn.onclick=e=>{e.preventDefault();e.stopPropagation();const id=btn.dataset.mapPinV172;if(parts&&id!==active)return;const wasOpen=st.reveal.has(id);st.reveal.clear();if(!wasOpen)st.reveal.add(id);renderMapFlashcardV172(area,itemId,pinned);requestAnimationFrame(()=>window.__layoutPinnedLabelsV170?.(area))});
        q('.map-prev-pin-v172',area)?.addEventListener('click',()=>{if(st.index>0){st.index--;st.reveal.clear();renderMapFlashcardV172(area,itemId,pinned)}});
        q('.map-next-pin-v172',area)?.addEventListener('click',()=>{if(st.index<pins.length-1){st.index++;st.reveal.clear();renderMapFlashcardV172(area,itemId,pinned)}else{studyStateV172.delete(key);nextFlashcardV172(1)}});
        q('.map-prev-card-v172',area)?.addEventListener('click',()=>{if(activeQuizIndex>0){studyStateV172.delete(key);nextFlashcardV172(-1)}});
        q('.map-next-card-v172',area)?.addEventListener('click',()=>{studyStateV172.delete(key);nextFlashcardV172(1)});
        requestAnimationFrame(()=>window.__layoutPinnedLabelsV170?.(area));
    }
    function renderMapTypedStudyV172(area,itemId,pinned,mode) {
        setCounterV172();
        const pins=(pinned.data.pins||[]).filter(p=>String(p.label||'').trim());
        const parts=pinned.data.testMode==='parts';
        const key=`${mode}:${itemId}`;
        const st=studyStateV172.get(key)||{correct:new Set(),reveal:new Set(),index:0,active:''}; studyStateV172.set(key,st);
        if(parts) st.active=String(pins[Math.max(0,Math.min(st.index,pins.length-1))]?.id||'');
        const complete=st.correct.size>=pins.length&&pins.length>0;
        area.innerHTML=`<div class="map-study-wrap-v172"><div class="map-study-card-v172"><div class="map-study-prompt-v172"><strong>${parts?'Label this pin':'Label the pins'}</strong><span>${parts?`${Math.min(st.index+1,pins.length)} / ${pins.length}`:`${st.correct.size} / ${pins.length} correct`}</span></div>${pinStageV172(pinned.data,st,{active:st.active})}${!complete?`<div class="map-study-answer-v172"><span>${st.active?'Selected pin':'Click a pin to answer'}</span><div><input type="text" class="map-study-input-v172" placeholder="Type label…" autocomplete="off" spellcheck="false" ${st.active?'':'disabled'}><button type="button" class="icon-btn map-study-submit-v172" ${st.active?'':'disabled'}><i class="ph ph-arrow-return-left"></i> Enter</button></div><small class="map-study-status-v172">Capitalization does not matter.</small></div>`:''}</div>${complete?(mode==='learn'?`<button type="button" class="icon-btn map-study-continue-v172"><i class="ph ph-check"></i> Continue</button>`:`<div class="quiz-pinned-anki-actions-v169"><button class="icon-btn still-learning-btn map-study-again-v172"><i class="ph ph-arrow-counter-clockwise"></i> Still Learning</button><button class="icon-btn got-it-btn map-study-good-v172"><i class="ph ph-check"></i> Got It!</button></div>`):''}</div>`;
        qa('[data-map-pin-v172]',area).forEach(btn=>btn.onclick=e=>{e.preventDefault();e.stopPropagation();const id=btn.dataset.mapPinV172;if(parts&&id!==st.active)return;if(st.correct.has(id))return;st.active=id;renderMapTypedStudyV172(area,itemId,pinned,mode)});
        const submit=()=>{const input=q('.map-study-input-v172',area);if(!input||!st.active)return;const pin=pins.find(p=>String(p.id)===st.active);if(!pin||!input.value.trim())return;const status=q('.map-study-status-v172',area);if(answerMatchesV172(input.value,pin.label)){st.correct.add(st.active);st.reveal.add(st.active);if(parts){st.index++;if(st.index<pins.length)st.active=String(pins[st.index].id);else st.active='';}else st.active='';setTimeout(()=>renderMapTypedStudyV172(area,itemId,pinned,mode),120)}else{if(status){status.textContent='Try again.';status.classList.add('is-wrong-v172')}input.select()}};
        q('.map-study-submit-v172',area)?.addEventListener('click',submit);
        q('.map-study-input-v172',area)?.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();submit()}});
        q('.map-study-continue-v172',area)?.addEventListener('click',()=>{studyStateV172.delete(key);processLearnAnswer(true)});
        q('.map-study-again-v172',area)?.addEventListener('click',()=>{studyStateV172.delete(key);processAnkiAnswer('Again')});
        q('.map-study-good-v172',area)?.addEventListener('click',()=>{studyStateV172.delete(key);processAnkiAnswer('Good')});
        const input=q('.map-study-input-v172',area);if(input&&!input.disabled)requestAnimationFrame(()=>input.focus());
        requestAnimationFrame(()=>window.__layoutPinnedLabelsV170?.(area));
    }
    try {
        const before = showQuizCard;
        showQuizCard = function() {
            const area=q('#quiz-flashcard-area'); const itemId=currentQuizItemV172(); const pinned=itemId?pinFieldV172(itemId):null;
            if(!area||!pinned||!(pinned.data?.image)) return before.apply(this,arguments);
            if(quizMode==='flashcards'){renderMapFlashcardV172(area,itemId,pinned);return;}
            if(quizMode==='learn'||quizMode==='anki'){renderMapTypedStudyV172(area,itemId,pinned,quizMode);return;}
            return before.apply(this,arguments);
        };
    } catch {}

    // ------------------------------------------------------------
    // Recipe Tracker: reliable + button, no component dragging from controls,
    // persistent editor, clickable cards, and draggable workflow columns.
    // ------------------------------------------------------------
    function normalizeRecipeV172(item={}) {
        item.id=item.id||uid('recipe'); item.name=String(item.name||'Recipe'); item.type=String(item.type||'');
        item.servings=String(item.servings||''); item.temperature=String(item.temperature||''); item.notes=String(item.notes||'');
        item.rating=Math.max(1,Math.min(5,Number(item.rating)||3));
        item.ingredients=Array.isArray(item.ingredients)?item.ingredients.map(x=>typeof x==='string'?{id:uid('ing'),text:x}:{id:x.id||uid('ing'),text:String(x.text||x.name||'')}):[];
        item.steps=Array.isArray(item.steps)?item.steps.map(x=>typeof x==='string'?{id:uid('step'),title:'',text:x}:{id:x.id||uid('step'),title:String(x.title||''),text:String(x.text||x.instruction||'')}):[];
        return item;
    }
    function ensureRecipeEditorV172(){
        let modal=q('#recipe-editor-modal-v172');if(modal)return modal;
        modal=document.createElement('div');modal.id='recipe-editor-modal-v172';modal.className='modal hidden recipe-editor-modal-v170 recipe-editor-modal-v172';
        modal.innerHTML=`<div class="modal-box recipe-editor-box-v170"><div class="recipe-editor-head-v170"><div><span class="recipe-kicker-v170">RECIPE TRACKER</span><h2 class="recipe-editor-title-v172">Recipe</h2></div><button type="button" class="small-icon-btn recipe-editor-close-v172"><i class="ph ph-x"></i></button></div><div class="recipe-editor-scroll-v170"><div class="recipe-editor-basics-v170"><label><span>Recipe name</span><input class="recipe-name-v172" placeholder="Banana Nut Bread"></label><label><span>Type</span><input class="recipe-type-v172" placeholder="bread, dinner, dessert…"></label><label><span>Servings / yield</span><input class="recipe-servings-v172" placeholder="about 10 servings"></label><label><span>Temperature / setup</span><input class="recipe-temp-v172" placeholder="Preheat oven to 350°F (170°C)"></label><label><span>Rating</span><input type="number" min="1" max="5" class="recipe-rating-v172" value="3"></label></div><section class="recipe-editor-section-v170"><div class="recipe-editor-section-head-v170"><div><strong>Ingredients</strong><small>One ingredient per row.</small></div><button type="button" class="icon-btn recipe-add-ing-v172"><i class="ph ph-plus"></i> Ingredient</button></div><div class="recipe-ings-v172"></div></section><section class="recipe-editor-section-v170"><div class="recipe-editor-section-head-v170"><div><strong>Process columns</strong><small>Drag columns to reorder them.</small></div><button type="button" class="icon-btn recipe-add-step-v172"><i class="ph ph-plus"></i> Step</button></div><div class="recipe-steps-v172"></div></section><label class="recipe-notes-field-v170"><span>Extra notes</span><textarea class="recipe-notes-v172" rows="3"></textarea></label></div><div class="recipe-editor-actions-v170"><button type="button" class="icon-btn recipe-cancel-v172">Cancel</button><button type="button" class="icon-btn recipe-save-v172"><i class="ph ph-check"></i> Save Recipe</button></div></div>`;
        document.body.appendChild(modal);return modal;
    }
    function editRecipeV172(source,isNew=false){
        const modal=ensureRecipeEditorV172();const draft=JSON.parse(JSON.stringify(normalizeRecipeV172({...source})));const $=s=>q(s,modal);
        $('.recipe-editor-title-v172').textContent=isNew?'Add Recipe':'Edit Recipe';$('.recipe-name-v172').value=draft.name==='Recipe'&&isNew?'':draft.name;$('.recipe-type-v172').value=draft.type;$('.recipe-servings-v172').value=draft.servings;$('.recipe-temp-v172').value=draft.temperature;$('.recipe-rating-v172').value=draft.rating;$('.recipe-notes-v172').value=draft.notes;
        const ingHost=$('.recipe-ings-v172'),stepHost=$('.recipe-steps-v172');
        const renderIng=()=>{ingHost.innerHTML=draft.ingredients.map((x,i)=>`<div class="recipe-editor-row-v170" data-i="${i}"><span class="recipe-row-number-v170">${i+1}</span><input value="${attr(x.text)}" placeholder="2 large ripe bananas"><button type="button" class="small-icon-btn recipe-del-v172"><i class="ph ph-trash"></i></button></div>`).join('');qa('[data-i]',ingHost).forEach(row=>{const i=+row.dataset.i;q('input',row).oninput=e=>draft.ingredients[i].text=e.target.value;q('.recipe-del-v172',row).onclick=()=>{draft.ingredients.splice(i,1);renderIng()}})};
        const renderSteps=()=>{stepHost.innerHTML=draft.steps.map((x,i)=>`<div class="recipe-step-editor-card-v170" draggable="true" data-s="${i}"><div class="recipe-step-drag-v170"><i class="ph ph-dots-six-vertical"></i><strong>Step ${i+1}</strong></div><input value="${attr(x.title)}" placeholder="Prep / Fold / Bake"><textarea rows="3" placeholder="Instruction…">${esc(x.text)}</textarea><button type="button" class="small-icon-btn recipe-del-v172"><i class="ph ph-trash"></i></button></div>`).join('');let from=-1;qa('[data-s]',stepHost).forEach(card=>{const i=+card.dataset.s;q('input',card).oninput=e=>draft.steps[i].title=e.target.value;q('textarea',card).oninput=e=>draft.steps[i].text=e.target.value;q('.recipe-del-v172',card).onclick=()=>{draft.steps.splice(i,1);renderSteps()};card.ondragstart=e=>{from=i;e.stopPropagation()};card.ondragover=e=>e.preventDefault();card.ondrop=e=>{e.preventDefault();e.stopPropagation();if(from<0||from===i)return;const [m]=draft.steps.splice(from,1);draft.steps.splice(i,0,m);renderSteps()}})};
        renderIng();renderSteps();$('.recipe-add-ing-v172').onclick=()=>{draft.ingredients.push({id:uid('ing'),text:''});renderIng()};$('.recipe-add-step-v172').onclick=()=>{draft.steps.push({id:uid('step'),title:'',text:''});renderSteps()};modal.classList.remove('hidden');
        return new Promise(resolve=>{let finished=false;const done=v=>{if(finished)return;finished=true;modal.classList.add('hidden');resolve(v)};$('.recipe-editor-close-v172').onclick=()=>done(null);$('.recipe-cancel-v172').onclick=()=>done(null);modal.onpointerdown=e=>{if(e.target===modal)done(null)};$('.recipe-save-v172').onclick=()=>{draft.name=$('.recipe-name-v172').value.trim()||'Recipe';draft.type=$('.recipe-type-v172').value.trim();draft.servings=$('.recipe-servings-v172').value.trim();draft.temperature=$('.recipe-temp-v172').value.trim();draft.rating=Math.max(1,Math.min(5,Number($('.recipe-rating-v172').value)||3));draft.notes=$('.recipe-notes-v172').value.trim();draft.ingredients=draft.ingredients.filter(x=>x.text.trim());draft.steps=draft.steps.filter(x=>x.title.trim()||x.text.trim());done(draft)}});
    }
    function ensureRecipeViewV172(){
        let modal=q('#recipe-view-modal-v172');if(modal)return modal;
        modal=document.createElement('div');modal.id='recipe-view-modal-v172';modal.className='modal hidden recipe-workflow-modal-v170 recipe-view-modal-v172';modal.innerHTML=`<div class="modal-box recipe-workflow-box-v170"><div class="recipe-modal-head-v170"><div><span class="recipe-kicker-v170">RECIPE WORKFLOW</span><h2 class="recipe-view-title-v172">Recipe</h2><p class="recipe-view-meta-v172"></p></div><div class="recipe-head-actions-v170"><button type="button" class="small-icon-btn recipe-view-edit-v172"><i class="ph ph-pencil-simple"></i></button><button type="button" class="small-icon-btn recipe-view-close-v172"><i class="ph ph-x"></i></button></div></div><div class="recipe-view-content-v172"></div></div>`;document.body.appendChild(modal);q('.recipe-view-close-v172',modal).onclick=()=>modal.classList.add('hidden');modal.onpointerdown=e=>{if(e.target===modal)modal.classList.add('hidden')};return modal;
    }
    function recipeSheetV172(item){
        normalizeRecipeV172(item);const ingredients=item.ingredients.length?item.ingredients:[{text:'No ingredients added yet'}];const steps=item.steps.length?item.steps:[{title:'Instructions',text:item.notes||'No instructions added yet'}];
        return `<div class="recipe-process-sheet-v170 recipe-process-sheet-v172"><div class="recipe-process-banner-v170">${esc(item.name)}${item.servings?` <span>(${esc(item.servings)})</span>`:''}</div>${item.temperature?`<div class="recipe-process-subline-v170">${esc(item.temperature)}</div>`:''}<div class="recipe-process-scroll-v170"><div class="recipe-process-grid-v170" style="--recipe-step-count-v170:${steps.length}"><div class="recipe-ingredients-col-v170"><div class="recipe-col-title-v170">Ingredients</div>${ingredients.map(x=>`<div class="recipe-ingredient-cell-v170">${esc(x.text)}</div>`).join('')}</div>${steps.map((s,i)=>`<div class="recipe-step-col-v170 recipe-step-col-v172" draggable="true" data-step-v172="${i}"><div class="recipe-col-title-v170"><i class="ph ph-dots-six-vertical"></i> ${esc(s.title||`Step ${i+1}`)}</div><div class="recipe-step-cell-v170"><span class="recipe-step-number-v170">${i+1}</span><p>${esc(s.text)}</p></div></div>`).join('')}</div></div>${item.notes&&item.steps.length?`<div class="recipe-notes-v170"><strong>Notes</strong><p>${esc(item.notes)}</p></div>`:''}</div>`;
    }
    function openRecipeV172(tab,component,item){
        normalizeRecipeV172(item);const modal=ensureRecipeViewV172();q('.recipe-view-title-v172',modal).textContent=item.name;q('.recipe-view-meta-v172',modal).textContent=[item.type,item.servings,item.temperature].filter(Boolean).join(' · ');const host=q('.recipe-view-content-v172',modal);
        const render=()=>{host.innerHTML=recipeSheetV172(item);let from=-1;qa('.recipe-step-col-v172',host).forEach(col=>{const i=+col.dataset.stepV172;col.ondragstart=e=>{from=i;e.stopPropagation();col.classList.add('is-dragging')};col.ondragend=()=>col.classList.remove('is-dragging');col.ondragover=e=>e.preventDefault();col.ondrop=e=>{e.preventDefault();e.stopPropagation();if(from<0||from===i)return;const [m]=item.steps.splice(from,1);item.steps.splice(i,0,m);saveDb();render()}})};render();q('.recipe-view-edit-v172',modal).onclick=async()=>{modal.classList.add('hidden');const updated=await editRecipeV172(item,false);if(!updated)return;Object.assign(item,updated);saveDb();renderCustomTabView(tab.id)};modal.classList.remove('hidden');
    }
    function renderRecipeTrackerV172(tab,component,content){
        if(!Array.isArray(component.items))component.items=[];component.items.forEach(normalizeRecipeV172);
        content.innerHTML=`${learningSectionHeader(component,'add-recipe','Add recipe')}<div class="learning-recipe-grid recipe-grid-v170 recipe-grid-v172"></div>`;
        const grid=q('.recipe-grid-v172',content);component.items.forEach(item=>{const card=document.createElement('article');card.className='learning-recipe-card recipe-card-v170 custom-searchable-item custom-content-editable';card.dataset.customItemId=item.id;card.dataset.searchText=[item.name,item.type,item.notes,...item.ingredients.map(x=>x.text),...item.steps.map(x=>`${x.title} ${x.text}`)].join(' ').toLowerCase();card.innerHTML=`<div class="recipe-card-icon-v170"><i class="ph ph-cooking-pot"></i></div><div class="learning-recipe-top"><strong>${esc(item.name)}</strong><span>${esc(item.type)}</span></div><div class="learning-stars">${Array.from({length:5},(_,i)=>`<i class="ph ${i<item.rating?'ph-star-fill':'ph-star'}"></i>`).join('')}</div><div class="recipe-card-summary-v170"><span><i class="ph ph-list-bullets"></i>${item.ingredients.length} ingredients</span><span><i class="ph ph-arrow-right"></i>${item.steps.length} steps</span></div>`;card.onclick=e=>{if(e.defaultPrevented||e.target.closest('button,input,textarea,select'))return;openRecipeV172(tab,component,item)};card.oncontextmenu=e=>{e.preventDefault();showCustomItemContextMenu(e.clientX,e.clientY,[{label:'Edit recipe',icon:'ph-pencil-simple',action:async()=>{const updated=await editRecipeV172(item,false);if(!updated)return;Object.assign(item,updated);saveDb();renderCustomTabView(tab.id)}},{label:'Delete recipe',icon:'ph-trash',danger:true,action:async()=>{const ok=await showAppConfirm({title:'Delete Recipe',message:`Delete “${item.name}”?`,confirmLabel:'Delete'});if(!ok)return;component.items=component.items.filter(x=>x.id!==item.id);saveDb();renderCustomTabView(tab.id)}}])};grid.appendChild(card)});
        const add=q('.add-recipe',content);if(add)add.onclick=async e=>{e.preventDefault();e.stopPropagation();const item=await editRecipeV172({id:uid('recipe'),name:'',type:'',rating:3,ingredients:[],steps:[],notes:''},true);if(!item)return;component.items.push(item);saveDb();renderCustomTabView(tab.id)};
    }
    try { renderRecipeTracker = renderRecipeTrackerV172; window.renderRecipeTracker = renderRecipeTrackerV172; } catch {}
    document.addEventListener('dragstart', event => {
        const wrapper=event.target?.closest?.('.custom-tab-component');
        if(!wrapper)return;
        if(event.target.closest('button,input,textarea,select,a,[contenteditable="true"],.recipe-step-col-v172,.recipe-step-editor-card-v170')) {
            if(!event.target.closest('.recipe-step-col-v172,.recipe-step-editor-card-v170')) event.preventDefault();
            event.stopImmediatePropagation();
        }
    }, true);
    document.addEventListener('pointerdown', event => {
        if(event.target?.closest?.('.custom-component-recipeTracker button,.custom-component-recipeTracker input,.custom-component-recipeTracker textarea,.custom-component-recipeTracker select')) event.stopPropagation();
    }, true);

    // ------------------------------------------------------------
    // Hard blank theme creation. While a create request is initializing, any
    // late hydration/populate call is fed the blank draft instead of the
    // currently selected theme.
    // ------------------------------------------------------------
    let blankGuardV172=false, blankTokenV172=0;
    function makeBlankThemeV172(){
        let blank={};
        for(const name of ['FEATURE_SUITE_DEFAULT_THEME','CUSTOM_THEME_MEDIA_DEFAULTS_V3','CUSTOM_THEME_VISUAL_DEFAULTS_V4','THEME_BUILDER_NAV_DEFAULTS_V6','CUSTOM_THEME_ADVANCED_DEFAULTS_V10','CUSTOM_THEME_V11_DEFAULTS','CUSTOM_THEME_V12_DEFAULTS','CUSTOM_THEME_V13_DEFAULTS','CUSTOM_THEME_V15_DEFAULTS','CUSTOM_THEME_V19_DEFAULTS','CUSTOM_THEME_V20_DEFAULTS','CUSTOM_THEME_V26_DEFAULTS','CUSTOM_THEME_ACCESSORY_DEFAULTS_V32']){
            try{const v=eval(name);if(v&&typeof v==='object')blank={...blank,...v}}catch{}
        }
        return {...blank,name:'My Custom Theme',backgroundImage:'',backgroundImageName:'',backgroundImageProjectPath:'',backgroundSvgs:[],svgHoverSounds:[],introAudio:'',introAudioName:'',introAudioProjectPath:'',interactiveBackgroundCodeV56:'',useThemeCursor:false,themeCursorStyle:'default',themeCursorTrailEnabledV161:false,customCursorV161:null,customCursorModeIdV161:'',themeCompanionEnabledV163:false,themeCompanionStyleV163:'',customCompanionV163:null};
    }
    function resetBuilderInternalsV172(modal){
        if(!modal)return;modal.dataset.themeBuilderMode='create';modal.dataset.themeBuilderEditingThemeV25='';modal.dataset.themeBuilderEditingCopyV30='';delete modal.dataset.themeBuilderBuiltInSourceV30;delete modal.dataset.themeBuilderEditingTheme;
        modal._themeBackgroundSvgs=[];modal._themeHoverSounds=[];modal._themeIntroAudio='';modal._themeIntroAudioName='';modal._themeAudioProjectPath='';modal._themeArtworkSnapshotV69=[];modal._themeArtworkKeyV69='';
    }
    try{
        const beforePopulate=populateThemeBuilder;
        populateThemeBuilder=function(modal,theme){
            if(blankGuardV172 && modal?.dataset?.themeBuilderMode==='create') theme=makeBlankThemeV172();
            const r=beforePopulate.call(this,modal,theme);
            if(blankGuardV172) resetBuilderInternalsV172(modal);
            else if(modal) modal.dataset.blankReadyV175='0';
            return r;
        };
    }catch{}
    let blankPrepBusyV175=false;
    function prepareBlankThemeV175(){
        if(blankPrepBusyV175)return null;
        let modal=document.getElementById('theme-builder-modal');try{if(!modal)modal=ensureThemeBuilderModal()}catch{return null}
        if(!modal || !modal.classList.contains('hidden'))return modal;
        if(modal.dataset.blankReadyV175==='1')return modal;
        blankPrepBusyV175=true;blankGuardV172=true;
        try{
            resetBuilderInternalsV172(modal);
            populateThemeBuilder(modal,makeBlankThemeV172());
            resetBuilderInternalsV172(modal);
            try{renderThemeBuilderSvgListV2?.(modal);renderThemeBuilderHoverSoundListV10?.(modal);updateThemeBuilderPreview?.(modal)}catch{}
            modal.dataset.blankReadyV175='1';
            modal.classList.add('theme-builder-prewarmed-v175');
        }catch{}
        blankGuardV172=false;blankPrepBusyV175=false;
        return modal;
    }
    window.__loggyPrepareBlankThemeV175=prepareBlankThemeV175;
    function queueBlankPrepV175(delay=0){
        setTimeout(()=>{
            const run=()=>{try{prepareBlankThemeV175()}catch{}};
            if('requestIdleCallback' in window)requestIdleCallback(run,{timeout:650});else setTimeout(run,0);
        },delay);
    }
    function openBlankThemeV172(){
        try { window.__loggyBeginCreateIsolationV259?.(); } catch {}
        try { window.__loggyThemeBuilderIntentV257?.beginCreate?.(); } catch {}
        const token=++blankTokenV172;
        blankGuardV172=true;
        let modal;
        try{ modal=document.getElementById('theme-builder-modal') || ensureThemeBuilderModal(); }catch{ return window.__loggyV164?.openBrandNewThemeV164?.(); }
        // V245: New Theme must ALWAYS start from a genuinely blank/default draft.
        // The old prewarm shortcut could leave the controls/decorations from the
        // currently applied theme in the already-built modal. Re-populate every
        // time; the modal shell itself is still pre-created for responsiveness.
        modal.classList.add('hidden');
        resetBuilderInternalsV172(modal);
        try{ populateThemeBuilder(modal,makeBlankThemeV172()); }catch{}
        resetBuilderInternalsV172(modal);
        try{ renderThemeBuilderSvgListV2?.(modal); renderThemeBuilderHoverSoundListV10?.(modal); updateThemeBuilderPreview?.(modal); }catch{}
        modal.dataset.blankReadyV175='1';
        modal.classList.add('theme-builder-prewarmed-v175');
        // V176: show the modal shell immediately, then reveal the heavy Theme Builder
        // controls on the next task. The builder DOM is already prewarmed, so this
        // avoids making the click wait for a full paint/layout of every settings
        // section before the modal itself becomes visible.
        modal.classList.add('theme-builder-fast-open-v176');
        modal.classList.remove('hidden');
        setTimeout(()=>{
            if(token!==blankTokenV172)return;
            modal.classList.remove('theme-builder-fast-open-v176');
            try{ modal.querySelector('[data-theme-key="name"],.theme-builder-name input,input[name="themeName"]')?.focus({preventScroll:true}); }catch{}
        },0);
        setTimeout(()=>{ if(token===blankTokenV172) blankGuardV172=false; },220);
        return modal;
    }
    // V257: expose the lexical blank factory/opener so the final coordinator can
    // call the real clean-create path directly instead of traversing historical wrappers.
    window.__loggyOpenBlankThemeDirectV257 = openBlankThemeV172;
    window.__loggyMakeBlankThemeV257 = makeBlankThemeV172;

    // V306: do not prewarm the retired historical Theme Builder modal.
    // V306: opening Theme Settings no longer creates/prepares the retired Builder DOM.
    document.addEventListener('input',event=>{if(event.target?.closest?.('#theme-builder-modal')){const m=document.getElementById('theme-builder-modal');if(m)m.dataset.blankReadyV175='0'}},true);
    document.addEventListener('change',event=>{if(event.target?.closest?.('#theme-builder-modal')){const m=document.getElementById('theme-builder-modal');if(m)m.dataset.blankReadyV175='0'}},true);
    /* V187: observe only the Theme Builder modal, never the entire document. */
    function bindBlankThemeObserverV187(){
        const modal=document.getElementById('theme-builder-modal');
        if(!modal||modal.dataset.blankObserverV187==='1')return;
        modal.dataset.blankObserverV187='1';
        try{new MutationObserver(ms=>{for(const m of ms){if(m.attributeName==='class'&&modal.classList.contains('hidden')){queueBlankPrepV175(180);break}}}).observe(modal,{attributes:true,attributeFilter:['class']})}catch{}
    }
    document.addEventListener('click',event=>{if(event.target?.closest?.('#theme-builder-modal,.theme-search-create-v161,.theme-picker-create-card,#open-daily-settings-btn,#open-global-daily-settings-nav-btn'))bindBlankThemeObserverV187()},true);
    if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>requestAnimationFrame(bindBlankThemeObserverV187),{once:true});else requestAnimationFrame(bindBlankThemeObserverV187);
    try{openNewThemeBuilderCleanV34=openBlankThemeV172}catch{}try{openNewCustomThemeFromPickerV7=openBlankThemeV172}catch{}
    // V260 owns the single Create Theme click/message entry point.
    document.addEventListener('pointerdown',event=>{if(blankGuardV172&&event.isTrusted&&event.target?.closest?.('#theme-builder-modal')){blankGuardV172=false;blankTokenV172++}},true);

    // Keep creative background under image decorations even after late mounts.
    let artRepairQueuedV172=false;
    function repairThemeArtV172(){
        artRepairQueuedV172=false;
        // V280: while Create Theme is booting, the host page is intentionally
        // switched to clean Default. Never remount the previously applied custom
        // theme's artwork behind/into the blank Builder preview.
        if(window.__loggyCreateThemeIsolationV280)return;
        const code=q('#custom-theme-code-background-v56'),stage=q('#custom-theme-background-stage');
        if(code)code.style.setProperty('z-index','0','important');if(stage)stage.style.setProperty('z-index','1','important');
        const theme=db.settings?.customTheme;const assets=(theme?.backgroundSvgs||[]).filter(a=>a&&!a.hidden);
        if(document.body.classList.contains('theme-custom-builder')&&assets.length&&(!stage||!stage.children.length)){
            try{mountCustomThemeBackgroundSvgsV2(theme)}catch{}
            const s=q('#custom-theme-background-stage');if(s)s.style.setProperty('z-index','1','important');
        }
    }
    function queueArtRepairV172(){if(artRepairQueuedV172)return;artRepairQueuedV172=true;requestAnimationFrame(repairThemeArtV172)}
    try{const before=applyTheme;applyTheme=function(){const r=before.apply(this,arguments);queueArtRepairV172();return r}}catch{}
    try{new MutationObserver(queueArtRepairV172).observe(document.body,{childList:true,subtree:false})}catch{}

    function initV172(){syncPinnedQuizControlsV172();polishKbCardsV172();queueArtRepairV172()}
    if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',initV172,{once:true});else initV172();
})();

// V172.1 — prevent controls inside a draggable custom component from ever
// starting a component reorder gesture (especially Recipe Tracker +).
(() => {
    'use strict';
    const interactive = 'button,input,textarea,select,a,[contenteditable="true"],.recipe-card-v170,.recipe-process-sheet-v172';
    document.addEventListener('pointerdown', event => {
        const wrapper = event.target?.closest?.('.custom-tab-component.builder-component');
        if (!wrapper || !event.target.closest?.(interactive)) return;
        const was = wrapper.draggable;
        wrapper.draggable = false;
        const restore = () => {
            if (wrapper.isConnected && wrapper.classList.contains('builder-component')) wrapper.draggable = was;
            window.removeEventListener('pointerup', restore, true);
            window.removeEventListener('pointercancel', restore, true);
        };
        window.addEventListener('pointerup', restore, true);
        window.addEventListener('pointercancel', restore, true);
    }, true);
})();

// ============================================================
// V173 — KB pinned-map polish, recommendation placement,
//        recipe tracker repair, dashboard theme-builder additions.
// ============================================================
(() => {
    'use strict';
    if (window.__loggyV173) return;
    window.__loggyV173 = true;
    const q = (s,r=document) => r?.querySelector?.(s) || null;
    const qa = (s,r=document) => Array.from(r?.querySelectorAll?.(s) || []);
    const esc = value => String(value ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
    const attr = esc;
    const id = prefix => `${prefix}-v173-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,8)}`;

    // ------------------------------------------------------------
    // Pinned-image editor polish.
    // ------------------------------------------------------------
    function hidePinnedSelectionEditorV173(target) {
        const editor = target?.closest?.('.kb-pinned-editor-v169');
        q('.kb-pinned-selected-editor-v169', editor)?.classList.add('hidden');
    }
    document.addEventListener('click', event => {
        if (!event.target?.closest?.('.kb-pinned-label-save-v169')) return;
        queueMicrotask(() => hidePinnedSelectionEditorV173(event.target));
        requestAnimationFrame(() => hidePinnedSelectionEditorV173(event.target));
    }, true);
    document.addEventListener('keydown', event => {
        if (event.key !== 'Enter' || !event.target?.matches?.('.kb-pinned-label-input-v169')) return;
        // V615: Enter in Place Pins saves the label; it is NOT Done Placing and
        // must not collapse the selected-pin editor or close placement mode.
        if (event.target.closest?.('.kb-pinned-editor-v169.is-pin-placement-v171')) return;
        const target = event.target;
        queueMicrotask(() => hidePinnedSelectionEditorV173(target));
        requestAnimationFrame(() => hidePinnedSelectionEditorV173(target));
    }, true);

    // Close Knowledge Base modals by clicking their backdrop. Full-screen pin
    // placement is intentionally excluded.
    const kbBackdropIdsV173 = new Set([
        'phrase-modal','add-item-modal','settings-modal','kb-field-create-modal',
        'kb-bulk-modal-v162','recommendation-modal-v162','primary-display-modal-v171',
        'bulk-import-modal-v162','kb-category-rename-modal-v163'
    ]);
    document.addEventListener('pointerdown', event => {
        const modal = event.target;
        if (!(modal instanceof Element) || !modal.classList.contains('modal-overlay')) return;
        if (event.target !== modal || !kbBackdropIdsV173.has(modal.id)) return;
        if (document.body.classList.contains('kb-pin-placement-open-v171')) return;
        modal.classList.add('hidden');
    }, true);

    // Keep one-pin study input immediately ready for typing (Anki included).
    function focusVisibleMapAnswerV173() {
        const input = q('#quiz-flashcard-area .map-study-input-v172:not(:disabled)');
        if (!input) return;
        requestAnimationFrame(() => {
            try { input.focus({preventScroll:true}); input.select?.(); } catch { input.focus?.(); }
        });
    }
    try {
        const before = showQuizCard;
        showQuizCard = function() {
            const result = before.apply(this, arguments);
            focusVisibleMapAnswerV173();
            setTimeout(focusVisibleMapAnswerV173, 0);
            return result;
        };
    } catch {}

    // ------------------------------------------------------------
    // Pinned-image primary display in Daily Log Items Learned.
    // ------------------------------------------------------------
    function pinnedPrimaryEverywhereV173(itemId) {
        try {
            const category = db.phrase_meta?.[itemId]?.type;
            const cfg = db.settings?.categorySettings?.[category];
            if (!category || cfg?.displayScopeV162 === 'kb') return null;
            const fieldName = String(cfg?.displayFieldV162 || '');
            if (!fieldName || fieldName === '__title__') return null;
            const field = getKnowledgeFieldDefs(category).find(entry => entry?.name === fieldName && entry?.kind === 'pinnedImage');
            if (!field) return null;
            const raw = db.phrase_meta?.[itemId]?.custom_fields?.[fieldName];
            const data = window.__loggyPinnedImageV169?.parse?.(raw, field);
            return data?.image ? data : null;
        } catch { return null; }
    }
    function dailyMapHtmlV173(data) {
        return window.__loggyPinnedImageV169?.renderStage?.(data, {
            labeled:true,
            readonly:true,
            stageClass:'kb-day-primary-map-stage-v173',
            labelClass:'kb-day-primary-map-label-v590'
        }) || '';
    }
    function decorateDailyPrimaryMapsV173() {
        qa('#phrases-container .chip').forEach(chip => {
            q(':scope > .kb-day-primary-map-v173', chip)?.remove();
            chip.classList.remove('kb-day-map-card-v173');
            const itemId = chip.dataset.kbItemIdV162 || chip.dataset.kbItemIdV163 || '';
            const data = itemId ? pinnedPrimaryEverywhereV173(itemId) : null;
            if (!data) return;
            const wrap = document.createElement('div');
            wrap.className = 'kb-day-primary-map-v173';
            wrap.innerHTML = dailyMapHtmlV173(data);
            chip.prepend(wrap);
            chip.classList.add('kb-day-map-card-v173');
        });
    }
    try {
        const before = renderPhrases;
        renderPhrases = function() {
            const result = before.apply(this, arguments);
            requestAnimationFrame(decorateDailyPrimaryMapsV173);
            return result;
        };
    } catch {}

    // ------------------------------------------------------------
    // Daily recommendation belongs in Knowledge Base Settings.
    // ------------------------------------------------------------
    function recCfgV173() {
        db.settings ||= {};
        db.settings.dailyRecommendationV162 ||= {enabled:false,paused:false,mode:'filter',categories:[],tags:[],orderedItems:[]};
        return db.settings.dailyRecommendationV162;
    }
    function cleanRecommendationModalV173() {
        const modal = q('#recommendation-modal-v162');
        if (!modal) return;
        modal.style.setProperty('z-index','2147483000','important');
        const meta = q('.rec-metadata-v162',modal);
        if (meta) {
            meta.value = '';
            meta.closest('.modal-section,label')?.classList.add('hidden');
        }
        qa('.rec-category-chips-v163,.rec-tag-chips-v163',modal).forEach(node => node.remove());
        for (const input of [q('.rec-categories-v162',modal), q('.rec-tags-v162',modal)]) {
            if (!input) continue;
            const wrappers = qa('.multi-dropdown-v164', input.parentElement || modal);
            wrappers.slice(1).forEach(node => node.remove());
        }
        try { window.__loggyV164?.enhanceRecommendationDropdownsV164?.(); } catch {}
        // V164 may have regenerated wrappers; keep exactly one for each input.
        for (const input of [q('.rec-categories-v162',modal), q('.rec-tags-v162',modal)]) {
            if (!input) continue;
            const parent = input.parentElement || modal;
            const wrappers = qa(':scope > .multi-dropdown-v164', parent);
            wrappers.slice(1).forEach(node => node.remove());
        }
    }
    function ensureKbRecommendationSettingV173() {
        const modal = q('#settings-modal');
        const box = q(':scope > .modal-box', modal);
        if (!box) return;
        qa('#daily-settings-modal .daily-recommend-toggle-row-v163,#daily-logs-local-settings-modal .daily-recommend-toggle-row-v163,#daily-settings-modal .daily-recommendation-settings-row-v162b,#daily-logs-local-settings-modal .daily-recommendation-settings-row-v162b').forEach(node => node.remove());
        let row = q('.kb-daily-recommend-setting-v173',box);
        if (!row) {
            row = document.createElement('div');
            row.className = 'modal-section mt-20 kb-daily-recommend-setting-v173';
            row.innerHTML = `<div class="kb-daily-recommend-copy-v173"><strong>Daily Knowledge Base Recommendation</strong><small>Show one Knowledge Base suggestion at the top of each Daily Log.</small></div><label class="kb-switch-v173" title="Enable daily recommendations"><input type="checkbox" class="kb-daily-recommend-toggle-v173"><span class="kb-switch-track-v173"></span></label>`;
            box.appendChild(row);
            q('.kb-daily-recommend-toggle-v173',row).addEventListener('change', event => {
                const cfg = recCfgV173();
                cfg.enabled = !!event.target.checked;
                saveDb();
                if (cfg.enabled) {
                    window.__loggyV162?.openRecommendationSettings?.();
                    requestAnimationFrame(cleanRecommendationModalV173);
                } else q('#daily-recommendation-v162')?.classList.add('hidden');
            });
            row.addEventListener('dblclick', () => {
                window.__loggyV162?.openRecommendationSettings?.();
                requestAnimationFrame(cleanRecommendationModalV173);
            });
        }
        q('.kb-daily-recommend-toggle-v173',row).checked = !!recCfgV173().enabled;
    }
    try {
        const before = renderSettings;
        renderSettings = function() {
            const result = before.apply(this, arguments);
            ensureKbRecommendationSettingV173();
            return result;
        };
    } catch {}
    if (window.__loggyV162?.openRecommendationSettings) {
        const before = window.__loggyV162.openRecommendationSettings;
        window.__loggyV162.openRecommendationSettings = function() {
            const result = before.apply(this, arguments);
            requestAnimationFrame(cleanRecommendationModalV173);
            return result;
        };
    }

    // ------------------------------------------------------------
    // Recipe Tracker V173 — reliable add/save/open + process columns.
    // ------------------------------------------------------------
    function recipeNormalizeV173(item={}) {
        item.id = item.id || id('recipe');
        item.name = String(item.name || 'Recipe');
        item.type = String(item.type || '');
        item.servings = String(item.servings || '');
        item.temperature = String(item.temperature || '');
        item.notes = String(item.notes || '');
        item.rating = Math.max(1,Math.min(5,Number(item.rating)||3));
        item.ingredients = Array.isArray(item.ingredients) ? item.ingredients.map(x => typeof x === 'string' ? {id:id('ing'),text:x} : {id:x.id||id('ing'),text:String(x.text||x.name||'')}) : [];
        item.steps = Array.isArray(item.steps) ? item.steps.map(x => typeof x === 'string' ? {id:id('step'),title:'',text:x} : {id:x.id||id('step'),title:String(x.title||''),text:String(x.text||x.instruction||'')}) : [];
        return item;
    }
    function cloneRecipeV173(item) { return recipeNormalizeV173(JSON.parse(JSON.stringify(recipeNormalizeV173(item)))); }
    function ensureRecipeEditorV173() {
        let modal = q('#recipe-editor-modal-v173');
        if (modal) return modal;
        modal = document.createElement('div');
        modal.id = 'recipe-editor-modal-v173';
        modal.className = 'modal-overlay hidden recipe-editor-modal-v173';
        modal.innerHTML = `<div class="modal-box recipe-editor-box-v173"><div class="modal-header"><h2 class="recipe-editor-heading-v173">Recipe</h2><button type="button" class="small-icon-btn recipe-editor-close-v173"><i class="ph ph-x"></i></button></div><div class="recipe-edit-grid-v173"><label><span class="field-label">Recipe name</span><input class="recipe-name-v173" type="text"></label><label><span class="field-label">Type</span><input class="recipe-type-v173" type="text" placeholder="Bread, dinner, dessert…"></label><label><span class="field-label">Servings / yield</span><input class="recipe-servings-v173" type="text" placeholder="10 servings"></label><label><span class="field-label">Temperature / setup</span><input class="recipe-temp-v173" type="text" placeholder="Preheat oven to 350°F (170°C)"></label><label><span class="field-label">Rating</span><select class="recipe-rating-v173">${[1,2,3,4,5].map(n=>`<option value="${n}">${n} star${n===1?'':'s'}</option>`).join('')}</select></label><div class="wide-v173"><div class="section-header"><span class="field-label">Ingredients</span><button type="button" class="small-icon-btn recipe-add-ing-v173"><i class="ph ph-plus"></i></button></div><div class="recipe-list-v173 recipe-ings-v173"></div></div><div class="wide-v173"><div class="section-header"><span class="field-label">Process / instruction columns</span><button type="button" class="small-icon-btn recipe-add-step-v173"><i class="ph ph-plus"></i></button></div><p class="progress-hint">These become the draggable process columns in the finished recipe table.</p><div class="recipe-list-v173 recipe-steps-v173"></div></div><label class="wide-v173"><span class="field-label">Notes</span><textarea class="recipe-notes-v173"></textarea></label></div><button type="button" class="icon-btn recipe-save-v173"><i class="ph ph-check"></i> Save Recipe</button></div>`;
        document.body.appendChild(modal);
        q('.recipe-editor-close-v173',modal).onclick = () => modal.classList.add('hidden');
        modal.addEventListener('pointerdown', e => { if (e.target === modal) modal.classList.add('hidden'); });
        return modal;
    }
    function openRecipeEditorV173(tab, component, source, isNew=false) {
        const modal = ensureRecipeEditorV173();
        const draft = cloneRecipeV173(source || {name:'',rating:3,ingredients:[],steps:[]});
        if (isNew && draft.name === 'Recipe') draft.name = '';
        q('.recipe-editor-heading-v173',modal).textContent = isNew ? 'Add Recipe' : 'Edit Recipe';
        q('.recipe-name-v173',modal).value = draft.name;
        q('.recipe-type-v173',modal).value = draft.type;
        q('.recipe-servings-v173',modal).value = draft.servings;
        q('.recipe-temp-v173',modal).value = draft.temperature;
        q('.recipe-rating-v173',modal).value = String(draft.rating);
        q('.recipe-notes-v173',modal).value = draft.notes;
        const ingHost = q('.recipe-ings-v173',modal), stepHost = q('.recipe-steps-v173',modal);
        const renderIngredients = () => {
            ingHost.innerHTML = draft.ingredients.map((ing,i)=>`<div class="recipe-row-v173" data-i="${i}"><input type="text" value="${attr(ing.text)}" placeholder="2 large ripe bananas"><button type="button" class="small-icon-btn recipe-remove-row-v173"><i class="ph ph-trash"></i></button></div>`).join('') || '<p class="progress-hint">No ingredients yet.</p>';
            qa('.recipe-row-v173',ingHost).forEach(row => {
                const i = Number(row.dataset.i);
                q('input',row).oninput = e => draft.ingredients[i].text = e.target.value;
                q('.recipe-remove-row-v173',row).onclick = () => { draft.ingredients.splice(i,1); renderIngredients(); };
            });
        };
        const renderSteps = () => {
            stepHost.innerHTML = draft.steps.map((step,i)=>`<div class="recipe-step-row-v173" data-i="${i}" draggable="true"><input type="text" class="recipe-step-title-input-v173" value="${attr(step.title)}" placeholder="Mash / Fold / Bake"><textarea placeholder="Instruction">${esc(step.text)}</textarea><button type="button" class="small-icon-btn recipe-remove-step-v173"><i class="ph ph-trash"></i></button></div>`).join('') || '<p class="progress-hint">No process columns yet.</p>';
            let from = -1;
            qa('.recipe-step-row-v173',stepHost).forEach(row => {
                const i = Number(row.dataset.i);
                q('input',row).oninput = e => draft.steps[i].title = e.target.value;
                q('textarea',row).oninput = e => draft.steps[i].text = e.target.value;
                q('.recipe-remove-step-v173',row).onclick = () => { draft.steps.splice(i,1); renderSteps(); };
                row.ondragstart = e => { from=i; e.stopPropagation(); row.classList.add('is-dragging-v173'); };
                row.ondragend = () => row.classList.remove('is-dragging-v173');
                row.ondragover = e => e.preventDefault();
                row.ondrop = e => { e.preventDefault(); e.stopPropagation(); if (from<0 || from===i) return; const [moved]=draft.steps.splice(from,1); draft.steps.splice(i,0,moved); renderSteps(); };
            });
        };
        renderIngredients(); renderSteps();
        q('.recipe-add-ing-v173',modal).onclick = () => { draft.ingredients.push({id:id('ing'),text:''}); renderIngredients(); requestAnimationFrame(()=>qa('.recipe-row-v173 input',ingHost).at(-1)?.focus()); };
        q('.recipe-add-step-v173',modal).onclick = () => { draft.steps.push({id:id('step'),title:'',text:''}); renderSteps(); requestAnimationFrame(()=>qa('.recipe-step-title-input-v173',stepHost).at(-1)?.focus()); };
        q('.recipe-save-v173',modal).onclick = () => {
            draft.name = q('.recipe-name-v173',modal).value.trim() || 'Recipe';
            draft.type = q('.recipe-type-v173',modal).value.trim();
            draft.servings = q('.recipe-servings-v173',modal).value.trim();
            draft.temperature = q('.recipe-temp-v173',modal).value.trim();
            draft.rating = Number(q('.recipe-rating-v173',modal).value)||3;
            draft.notes = q('.recipe-notes-v173',modal).value.trim();
            draft.ingredients = draft.ingredients.filter(x=>String(x.text||'').trim());
            draft.steps = draft.steps.filter(x=>String(x.title||'').trim() || String(x.text||'').trim());
            if (!Array.isArray(component.items)) component.items=[];
            const index = component.items.findIndex(x=>x.id===source?.id);
            if (index >= 0 && !isNew) component.items[index] = draft; else component.items.push(draft);
            saveDb();
            modal.classList.add('hidden');
            renderCustomTabView(tab.id);
        };
        modal.classList.remove('hidden');
        requestAnimationFrame(()=>q('.recipe-name-v173',modal)?.focus());
    }
    function recipeSheetV173(item) {
        recipeNormalizeV173(item);
        const ingredients = item.ingredients.length ? item.ingredients : [{text:'No ingredients added yet'}];
        const steps = item.steps.length ? item.steps : [{title:'Instructions',text:item.notes||'No instructions added yet'}];
        return `<div class="recipe-engineering-sheet-v173"><div class="recipe-sheet-title-v173">${esc(item.name)}${item.servings?` <span>(${esc(item.servings)})</span>`:''}</div>${item.temperature?`<div class="recipe-sheet-setup-v173">${esc(item.temperature)}</div>`:''}<div class="recipe-sheet-scroll-v173"><div class="recipe-sheet-grid-v173" style="--recipe-step-count-v173:${steps.length}"><div class="recipe-sheet-ingredients-v173">${ingredients.map(x=>`<div class="recipe-sheet-cell-v173">${esc(x.text)}</div>`).join('')}</div>${steps.map((step,i)=>`<div class="recipe-sheet-step-v173" draggable="true" data-step-index-v173="${i}"><div class="recipe-step-title-v173"><i class="ph ph-dots-six-vertical"></i>${esc(step.title||`Step ${i+1}`)}</div><div class="recipe-step-body-v173">${esc(step.text)}</div></div>`).join('')}</div></div>${item.notes&&item.steps.length?`<div class="recipe-sheet-notes-v173"><strong>Notes</strong><div>${esc(item.notes)}</div></div>`:''}</div>`;
    }
    function ensureRecipeViewV173() {
        let modal=q('#recipe-view-modal-v173');
        if (modal) return modal;
        modal=document.createElement('div'); modal.id='recipe-view-modal-v173'; modal.className='modal-overlay hidden recipe-view-modal-v173';
        modal.innerHTML=`<div class="modal-box recipe-view-box-v173"><div class="modal-header"><div><h2 class="recipe-view-title-v173">Recipe</h2><p class="progress-hint recipe-view-meta-v173"></p></div><div style="display:flex;gap:7px"><button type="button" class="small-icon-btn recipe-view-edit-v173"><i class="ph ph-pencil-simple"></i></button><button type="button" class="small-icon-btn recipe-view-close-v173"><i class="ph ph-x"></i></button></div></div><div class="recipe-view-content-v173"></div></div>`;
        document.body.appendChild(modal);
        q('.recipe-view-close-v173',modal).onclick=()=>modal.classList.add('hidden');
        modal.onpointerdown=e=>{if(e.target===modal)modal.classList.add('hidden')};
        return modal;
    }
    function openRecipeV173(tab,component,item) {
        recipeNormalizeV173(item);
        const modal=ensureRecipeViewV173(), host=q('.recipe-view-content-v173',modal);
        q('.recipe-view-title-v173',modal).textContent=item.name;
        q('.recipe-view-meta-v173',modal).textContent=[item.type,item.servings,item.temperature].filter(Boolean).join(' · ');
        const render=()=>{
            host.innerHTML=recipeSheetV173(item);
            let from=-1;
            qa('.recipe-sheet-step-v173',host).forEach(col=>{
                const i=Number(col.dataset.stepIndexV173);
                col.ondragstart=e=>{from=i;e.stopPropagation();col.classList.add('is-dragging-v173')};
                col.ondragend=()=>col.classList.remove('is-dragging-v173');
                col.ondragover=e=>e.preventDefault();
                col.ondrop=e=>{e.preventDefault();e.stopPropagation();if(from<0||from===i)return;const [moved]=item.steps.splice(from,1);item.steps.splice(i,0,moved);saveDb();render()};
            });
        };
        render();
        q('.recipe-view-edit-v173',modal).onclick=()=>{modal.classList.add('hidden');openRecipeEditorV173(tab,component,item,false)};
        modal.classList.remove('hidden');
    }
    function renderRecipeTrackerV173(tab,component,content) {
        component.items = Array.isArray(component.items) ? component.items : [];
        component.items.forEach(recipeNormalizeV173);
        content.innerHTML = `${learningSectionHeader(component,'add-recipe','Add recipe')}<div class="learning-recipe-grid recipe-grid-v173"></div>`;
        const grid=q('.recipe-grid-v173',content);
        component.items.forEach(item=>{
            const card=document.createElement('article');
            card.className='learning-recipe-card recipe-card-v173 custom-searchable-item custom-content-editable';
            card.dataset.customItemId=item.id;
            card.dataset.searchText=[item.name,item.type,item.notes,...item.ingredients.map(x=>x.text),...item.steps.map(x=>`${x.title} ${x.text}`)].join(' ').toLowerCase();
            card.innerHTML=`<div class="recipe-card-icon-v170"><i class="ph ph-cooking-pot"></i></div><div class="learning-recipe-top"><strong>${esc(item.name)}</strong><span>${esc(item.type)}</span></div><div class="learning-stars">${Array.from({length:5},(_,i)=>`<i class="ph ${i<item.rating?'ph-star-fill':'ph-star'}"></i>`).join('')}</div><div class="recipe-card-summary-v170"><span>${item.ingredients.length} ingredients</span><span>${item.steps.length} process columns</span></div>`;
            card.onclick=e=>{if(e.target.closest('button,input,textarea,select,a'))return;openRecipeV173(tab,component,item)};
            card.oncontextmenu=e=>{e.preventDefault();e.stopPropagation();showCustomItemContextMenu(e.clientX,e.clientY,[{label:'Edit recipe',icon:'ph-pencil-simple',action:()=>openRecipeEditorV173(tab,component,item,false)},{label:'Delete recipe',icon:'ph-trash',danger:true,action:async()=>{const ok=await showAppConfirm({title:'Delete Recipe',message:`Delete “${item.name}”?`,confirmLabel:'Delete'});if(!ok)return;component.items=component.items.filter(x=>x.id!==item.id);saveDb();renderCustomTabView(tab.id)}}])};
            grid.appendChild(card);
        });
        const add=q('.add-recipe',content);
        if(add){add.type='button';add.draggable=false;add.onclick=e=>{e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();openRecipeEditorV173(tab,component,{id:id('recipe'),name:'',rating:3,ingredients:[],steps:[]},true)}}
    }
    try { renderRecipeTracker = renderRecipeTrackerV173; window.renderRecipeTracker = renderRecipeTrackerV173; } catch {}
    document.addEventListener('dragstart', e=>{
        if(e.target?.closest?.('.custom-component-recipeTracker') && !e.target.closest('.recipe-sheet-step-v173,.recipe-step-row-v173')) e.preventDefault();
    },true);

    // ------------------------------------------------------------
    // Theme Builder: Dashboard title is dashboard-owned now; add logged-today
    // card colors and make the AI prompt account for them.
    // ------------------------------------------------------------
    function removeDashboardTitleBuilderV173(modal=q('#theme-builder-modal')) {
        q('.theme-builder-dashboard-title-field-v69',modal)?.remove();
    }
    try {
        const before = ensureThemeIdentityControlsV69;
        ensureThemeIdentityControlsV69 = function() { const result=before.apply(this,arguments); removeDashboardTitleBuilderV173(arguments[0]); return result; };
    } catch {}
    // V175: logged-today theme colors were retired; Dashboard uses only a title underline.
    try {
        const before = populateThemeBuilder;
        populateThemeBuilder = function() { const r=before.apply(this,arguments); removeDashboardTitleBuilderV173(arguments[0]); return r; };
    } catch {}
    const promptBeforeV173 = window.__loggyThemeAiPromptV162;
    if (typeof promptBeforeV173 === 'function') {
        window.__loggyThemeAiPromptV162 = function() {
            return String(promptBeforeV173.apply(this,arguments)) + `

DASHBOARD TITLE NOTE:
- Do NOT include or ask for dashboardTitleV69. The Dashboard title is renamed/hidden directly on the Dashboard.`;
        };
    }

    function initV173() {
        ensureKbRecommendationSettingV173();
        removeDashboardTitleBuilderV173();
        cleanRecommendationModalV173();
        decorateDailyPrimaryMapsV173();
    }
    if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',initV173,{once:true}); else initV173();
})();

// ============================================================
// V175 — final alignment/performance/modal/recipe/map refinements
// ============================================================
(() => {
    'use strict';
    if (window.__loggyV175) return;
    window.__loggyV175 = true;

    const qV175 = (s, r = document) => r?.querySelector?.(s) || null;
    const qaV175 = (s, r = document) => Array.from(r?.querySelectorAll?.(s) || []);
    const escV175 = value => {
        try { return escapeCustomHtml(String(value ?? '')); }
        catch { return String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
    };
    const attrV175 = value => escV175(value).replace(/`/g, '&#096;');
    const uidV175 = prefix => `${prefix}-v175-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,8)}`;

    // ------------------------------------------------------------
    // Nested modal stacking. Only newly-opened modals are promoted, so a
    // parent modal can never leap back above the confirmation/settings modal
    // that it just launched.
    // ------------------------------------------------------------
    let modalZV175 = 2147483300;
    function promoteModalV175(modal) {
        if (!(modal instanceof Element) || modal.classList.contains('hidden')) return;
        if (!modal.matches('.modal-overlay,.modal')) return;
        // V224: Knowledge Base child dialogs opened from Settings must never be
        // demoted behind their parent by the generic modal promoter. This covers
        // the legacy field editor, the existing-log-safe field editor, and the
        // category Primary Label editor.
        if (modal.id === 'kb-field-create-modal' || modal.id === 'kb-field-create-modal-v221') {
            modal.style.setProperty('z-index', '2147483647', 'important');
            return;
        }
        if (modal.id === 'kb-primary-display-modal-v171') {
            modal.style.setProperty('z-index', '2147483646', 'important');
            return;
        }
        modalZV175 += 5;
        if (modalZV175 > 2147483635) modalZV175 = 2147483305;
        modal.style.setProperty('z-index', String(modalZV175), 'important');
    }
    function inspectOpenedModalV175(node) {
        if (!(node instanceof Element)) return;
        if (node.matches('.modal-overlay:not(.hidden),.modal:not(.hidden)')) promoteModalV175(node);
        qaV175('.modal-overlay:not(.hidden),.modal:not(.hidden)', node).forEach(promoteModalV175);
    }
    /* V187 performance: modal stacking used to observe every class change in the
       whole application. Promote visible modals only around real user actions. */
    let promoteVisibleQueuedV187 = false;
    function promoteVisibleModalsV187() {
        if (promoteVisibleQueuedV187) return;
        promoteVisibleQueuedV187 = true;
        requestAnimationFrame(() => {
            promoteVisibleQueuedV187 = false;
            qaV175('.modal-overlay:not(.hidden),.modal:not(.hidden)').forEach(promoteModalV175);
        });
    }
    document.addEventListener('pointerdown', promoteVisibleModalsV187, true);
    document.addEventListener('click', promoteVisibleModalsV187, true);
    document.addEventListener('keydown', event => {
        if (event.key === 'Enter' || event.key === 'Escape') {
            promoteVisibleModalsV187();
        }
    }, true);

    // ------------------------------------------------------------
    // Logged-today is presentation-only now. Remove the old Theme Builder
    // color controls/keys so themes do not style it and the AI prompt does not
    // learn those deprecated settings.
    // ------------------------------------------------------------
    function stripLoggedTodayThemeControlsV175(root = document) {
        try {
            if (Array.isArray(DASHBOARD_COLOR_FIELDS_V85)) {
                for (let i = DASHBOARD_COLOR_FIELDS_V85.length - 1; i >= 0; i--) {
                    const key = DASHBOARD_COLOR_FIELDS_V85[i]?.[1];
                    if (key === 'dashboardCompletedCardV173' || key === 'dashboardCompletedTextV173') DASHBOARD_COLOR_FIELDS_V85.splice(i, 1);
                }
            }
        } catch {}
        qaV175('[data-theme-key="dashboardCompletedCardV173"],[data-theme-key="dashboardCompletedTextV173"]', root).forEach(input => {
            const row = input.closest('.theme-builder-color-field,.theme-builder-control-row,.theme-builder-field,label') || input;
            row.remove();
        });
    }
    stripLoggedTodayThemeControlsV175();
    try {
        const beforePopulateV175 = populateThemeBuilder;
        populateThemeBuilder = function() {
            const result = beforePopulateV175.apply(this, arguments);
            stripLoggedTodayThemeControlsV175(arguments[0] || document);
            return result;
        };
    } catch {}

    // ------------------------------------------------------------
    // Daily KB Recommendation: keep the row left-aligned, and when launched
    // from KB Settings make its child modal match that settings window's size.
    // ------------------------------------------------------------
    function fitRecommendationToKbSettingsV175(parentRect) {
        const modal = qV175('#recommendation-modal-v162');
        const box = qV175(':scope > .modal-box', modal);
        if (!modal || !box || !parentRect?.width) return;
        const maxW = Math.max(320, Math.min(parentRect.width, innerWidth - 32));
        const maxH = Math.max(320, Math.min(parentRect.height, innerHeight - 32));
        box.style.setProperty('width', `${Math.round(maxW)}px`, 'important');
        box.style.setProperty('max-width', `${Math.round(maxW)}px`, 'important');
        box.style.setProperty('max-height', `${Math.round(maxH)}px`, 'important');
        box.style.setProperty('overflow-y', 'auto', 'important');
        promoteModalV175(modal);
    }
    try {
        const beforeRecV175 = window.__loggyV162?.openRecommendationSettings;
        if (typeof beforeRecV175 === 'function') {
            window.__loggyV162.openRecommendationSettings = function() {
                const parent = qV175('#settings-modal:not(.hidden) > .modal-box');
                const rect = parent?.getBoundingClientRect?.();
                const result = beforeRecV175.apply(this, arguments);
                requestAnimationFrame(() => fitRecommendationToKbSettingsV175(rect));
                return result;
            };
        }
    } catch {}

    // ------------------------------------------------------------
    // Pinned maps: normal add/edit item modals are read-only previews. The
    // full-screen Place Pins workspace is the only place that can select,
    // drag, add, recolor, resize or rotate pins.
    // ------------------------------------------------------------
    const isNormalPinnedPreviewV175 = target => {
        if (!(target instanceof Element) || document.body.classList.contains('kb-pin-placement-open-v171')) return false;
        return !!target.closest('#add-item-modal .kb-pinned-stage-v169,#phrase-modal .kb-pinned-stage-v169');
    };
    ['pointerdown','click','contextmenu'].forEach(type => document.addEventListener(type, event => {
        if (!isNormalPinnedPreviewV175(event.target)) return;
        event.preventDefault();
        event.stopImmediatePropagation();
    }, true));

    // Single-pin map study (including Anki) should be ready for typing without
    // requiring a click on the active pin.
    function focusMapStudyInputV175() {
        const input = qV175('#quiz-flashcard-area .quiz-map-answer-v171:not(:disabled),#quiz-flashcard-area .map-study-input-v172:not(:disabled)');
        if (!input) return;
        try { input.focus({preventScroll:true}); } catch { input.focus?.(); }
    }
    document.addEventListener('click', event => {
        if (event.target?.closest?.('#quiz-flashcard-area,.quiz-mode-btn,.start-quiz-btn,.flashcard-mode-card')) {
            requestAnimationFrame(focusMapStudyInputV175);
        }
    }, true);
    try {
        const beforeShowQuizV175 = showQuizCard;
        showQuizCard = function() {
            const result = beforeShowQuizV175.apply(this, arguments);
            requestAnimationFrame(focusMapStudyInputV175);
            return result;
        };
    } catch {}

    // The whole Daily Log map card opens the KB item, not just its title.
    document.addEventListener('click', event => {
        const card = event.target?.closest?.('#phrases-container .chip.kb-day-map-card-v173');
        if (!card) return;
        if (event.target.closest('.delete-chip,.audio-play-btn-sm,.chip-audio-btn,button:not(.kb-day-item-main)')) return;
        const main = qV175('.kb-day-item-main', card);
        if (!main || event.target.closest('.kb-day-item-main')) return;
        event.preventDefault();
        main.click();
    }, true);

    // ------------------------------------------------------------
    // KB layout is owned exclusively by the canonical V683 layout engine.
    // Historical V175 masonry measurement/ResizeObserver ownership was removed
    // so restored logs cannot race between multiple layout systems.
    // ------------------------------------------------------------

    // ------------------------------------------------------------
    // Recipe Tracker V175 — cover images, real drag handles, a worked example
    // in the editor, and a finished engineering-style draggable process table.
    // ------------------------------------------------------------
    function normalizeRecipeV175(item = {}) {
        item.id ||= uidV175('recipe');
        item.name = String(item.name || 'Recipe');
        item.type = String(item.type || '');
        item.servings = String(item.servings || '');
        item.temperature = String(item.temperature || '');
        item.notes = String(item.notes || '');
        item.coverImage = String(item.coverImage || item.image || '');
        item.rating = Math.max(1, Math.min(5, Number(item.rating) || 3));
        item.ingredients = Array.isArray(item.ingredients) ? item.ingredients.map(x => typeof x === 'string' ? {id:uidV175('ing'),text:x} : {id:x.id||uidV175('ing'),text:String(x.text||x.name||'')}) : [];
        item.steps = Array.isArray(item.steps) ? item.steps.map(x => typeof x === 'string' ? {id:uidV175('step'),title:'',text:x} : {id:x.id||uidV175('step'),title:String(x.title||''),text:String(x.text||x.instruction||'')}) : [];
        return item;
    }
    const cloneRecipeV175 = item => normalizeRecipeV175(JSON.parse(JSON.stringify(normalizeRecipeV175(item))));
    async function imageFileToDataV175(file) {
        try { if (typeof customImageFileToDataUrl === 'function') return await customImageFileToDataUrl(file); } catch {}
        return await new Promise(resolve => {
            const reader = new FileReader();
            reader.onload = () => resolve(String(reader.result || ''));
            reader.onerror = () => resolve('');
            reader.readAsDataURL(file);
        });
    }
    function recipeExampleV175() {
        return `<div class="recipe-example-v175"><div class="recipe-example-title-v175">Example · Lemon Loaf (8 servings)</div><div class="recipe-example-setup-v175">Preheat oven to 350°F</div><div class="recipe-example-grid-v175"><div><span>2 cups flour</span><span>3 eggs</span><span>1 cup sugar</span><span>2 lemons</span></div><div><b>mix</b><small>Whisk wet ingredients</small></div><div><b>fold</b><small>Add dry ingredients</small></div><div><b>bake</b><small>45–50 min.</small></div><div><b>cool</b><small>Cool before slicing</small></div></div></div>`;
    }
    function ensureRecipeEditorV175() {
        let modal = qV175('#recipe-editor-modal-v175');
        if (modal) return modal;
        modal = document.createElement('div');
        modal.id = 'recipe-editor-modal-v175';
        modal.className = 'modal-overlay hidden recipe-editor-modal-v175';
        modal.innerHTML = `<div class="modal-box recipe-editor-box-v175"><div class="modal-header"><h2 class="recipe-editor-heading-v175">Recipe</h2><button type="button" class="small-icon-btn recipe-editor-close-v175"><i class="ph ph-x"></i></button></div><div class="recipe-edit-grid-v175"><label><span class="field-label">Recipe name</span><input class="recipe-name-v175" type="text"></label><label><span class="field-label">Type</span><input class="recipe-type-v175" type="text" placeholder="Bread, dinner, dessert…"></label><label><span class="field-label">Servings / yield</span><input class="recipe-servings-v175" type="text" placeholder="10 servings"></label><label><span class="field-label">Temperature / setup</span><input class="recipe-temp-v175" type="text" placeholder="Preheat oven to 350°F (170°C)"></label><label><span class="field-label">Rating</span><select class="recipe-rating-v175">${[1,2,3,4,5].map(n=>`<option value="${n}">${n} star${n===1?'':'s'}</option>`).join('')}</select></label><div class="wide-v175 recipe-cover-editor-v175"><div class="section-header"><span class="field-label">Recipe cover image</span><div><button type="button" class="small-icon-btn recipe-cover-upload-v175" title="Upload cover image"><i class="ph ph-image"></i></button><button type="button" class="small-icon-btn recipe-cover-remove-v175" title="Remove cover image"><i class="ph ph-trash"></i></button></div></div><input type="file" class="recipe-cover-file-v175 hidden" accept="image/*"><div class="recipe-cover-preview-v175"></div></div><div class="wide-v175"><div class="section-header"><span class="field-label">Ingredients</span><button type="button" class="small-icon-btn recipe-add-ing-v175"><i class="ph ph-plus"></i></button></div><div class="recipe-list-v175 recipe-ings-v175"></div></div><div class="wide-v175"><div class="section-header"><span class="field-label">Process / instruction columns</span><button type="button" class="small-icon-btn recipe-add-step-v175"><i class="ph ph-plus"></i></button></div><p class="progress-hint">Drag the <i class="ph ph-dots-six-vertical"></i> handle to reorder a process column. Each row below becomes one vertical instruction column in the finished recipe.</p><div class="recipe-list-v175 recipe-steps-v175"></div></div><label class="wide-v175"><span class="field-label">Notes</span><textarea class="recipe-notes-v175"></textarea></label><div class="wide-v175"><span class="field-label">Example finished recipe</span>${recipeExampleV175()}</div></div><button type="button" class="icon-btn recipe-save-v175"><i class="ph ph-check"></i> Save Recipe</button></div>`;
        document.body.appendChild(modal);
        qV175('.recipe-editor-close-v175', modal).onclick = () => modal.classList.add('hidden');
        modal.addEventListener('pointerdown', e => { if (e.target === modal) modal.classList.add('hidden'); });
        return modal;
    }
    function openRecipeEditorV175(tab, component, source, isNew = false) {
        const modal = ensureRecipeEditorV175();
        const draft = cloneRecipeV175(source || {id:uidV175('recipe'),name:'',rating:3,ingredients:[],steps:[]});
        if (isNew && draft.name === 'Recipe') draft.name = '';
        qV175('.recipe-editor-heading-v175',modal).textContent = isNew ? 'Add Recipe' : 'Edit Recipe';
        qV175('.recipe-name-v175',modal).value = draft.name;
        qV175('.recipe-type-v175',modal).value = draft.type;
        qV175('.recipe-servings-v175',modal).value = draft.servings;
        qV175('.recipe-temp-v175',modal).value = draft.temperature;
        qV175('.recipe-rating-v175',modal).value = String(draft.rating);
        qV175('.recipe-notes-v175',modal).value = draft.notes;
        const ingHost=qV175('.recipe-ings-v175',modal), stepHost=qV175('.recipe-steps-v175',modal), preview=qV175('.recipe-cover-preview-v175',modal);
        const renderCover=()=>{ preview.innerHTML = draft.coverImage ? `<img src="${attrV175(draft.coverImage)}" alt="Recipe cover">` : '<div class="recipe-cover-empty-v175"><i class="ph ph-image"></i><span>No cover image</span></div>'; qV175('.recipe-cover-remove-v175',modal).classList.toggle('hidden',!draft.coverImage); };
        const renderIngredients=()=>{
            ingHost.innerHTML=draft.ingredients.map((ing,i)=>`<div class="recipe-row-v175" data-i="${i}"><input type="text" value="${attrV175(ing.text)}" placeholder="2 large ripe bananas"><button type="button" class="small-icon-btn recipe-remove-ing-v175"><i class="ph ph-trash"></i></button></div>`).join('')||'<p class="progress-hint">No ingredients yet. Use + to add one.</p>';
            qaV175('.recipe-row-v175',ingHost).forEach(row=>{const i=Number(row.dataset.i);qV175('input',row).oninput=e=>draft.ingredients[i].text=e.target.value;qV175('.recipe-remove-ing-v175',row).onclick=()=>{draft.ingredients.splice(i,1);renderIngredients()}});
        };
        const renderSteps=()=>{
            stepHost.innerHTML=draft.steps.map((step,i)=>`<div class="recipe-step-row-v175" data-i="${i}"><button type="button" draggable="true" class="recipe-step-drag-v175" title="Drag to reorder"><i class="ph ph-dots-six-vertical"></i></button><input type="text" class="recipe-step-title-input-v175" value="${attrV175(step.title)}" placeholder="Mash / Fold / Bake"><textarea placeholder="Instruction">${escV175(step.text)}</textarea><button type="button" class="small-icon-btn recipe-remove-step-v175"><i class="ph ph-trash"></i></button></div>`).join('')||'<p class="progress-hint">No process columns yet. Use + to add one.</p>';
            let from=-1;
            qaV175('.recipe-step-row-v175',stepHost).forEach(row=>{
                const i=Number(row.dataset.i),handle=qV175('.recipe-step-drag-v175',row);
                qV175('input',row).oninput=e=>draft.steps[i].title=e.target.value;
                qV175('textarea',row).oninput=e=>draft.steps[i].text=e.target.value;
                qV175('.recipe-remove-step-v175',row).onclick=()=>{draft.steps.splice(i,1);renderSteps()};
                handle.ondragstart=e=>{from=i;try{e.dataTransfer.effectAllowed='move';e.dataTransfer.setData('text/plain',String(i))}catch{};row.classList.add('is-dragging-v175')};
                handle.ondragend=()=>row.classList.remove('is-dragging-v175');
                row.ondragover=e=>{e.preventDefault();try{e.dataTransfer.dropEffect='move'}catch{}};
                row.ondrop=e=>{e.preventDefault();e.stopPropagation();if(from<0||from===i)return;const [moved]=draft.steps.splice(from,1);draft.steps.splice(i,0,moved);renderSteps()};
            });
        };
        renderCover(); renderIngredients(); renderSteps();
        qV175('.recipe-add-ing-v175',modal).onclick=()=>{draft.ingredients.push({id:uidV175('ing'),text:''});renderIngredients();requestAnimationFrame(()=>qaV175('.recipe-row-v175 input',ingHost).at(-1)?.focus())};
        qV175('.recipe-add-step-v175',modal).onclick=()=>{draft.steps.push({id:uidV175('step'),title:'',text:''});renderSteps();requestAnimationFrame(()=>qaV175('.recipe-step-title-input-v175',stepHost).at(-1)?.focus())};
        const file=qV175('.recipe-cover-file-v175',modal);
        qV175('.recipe-cover-upload-v175',modal).onclick=()=>{file.value='';file.click()};
        qV175('.recipe-cover-remove-v175',modal).onclick=()=>{draft.coverImage='';renderCover()};
        file.onchange=async()=>{const f=file.files?.[0];if(!f)return;draft.coverImage=await imageFileToDataV175(f);renderCover()};
        qV175('.recipe-save-v175',modal).onclick=()=>{
            draft.name=qV175('.recipe-name-v175',modal).value.trim()||'Recipe';
            draft.type=qV175('.recipe-type-v175',modal).value.trim();
            draft.servings=qV175('.recipe-servings-v175',modal).value.trim();
            draft.temperature=qV175('.recipe-temp-v175',modal).value.trim();
            draft.rating=Number(qV175('.recipe-rating-v175',modal).value)||3;
            draft.notes=qV175('.recipe-notes-v175',modal).value.trim();
            draft.ingredients=draft.ingredients.filter(x=>String(x.text||'').trim());
            draft.steps=draft.steps.filter(x=>String(x.title||'').trim()||String(x.text||'').trim());
            component.items=Array.isArray(component.items)?component.items:[];
            const idx=component.items.findIndex(x=>x.id===source?.id);
            if(idx>=0&&!isNew)component.items[idx]=draft;else component.items.push(draft);
            saveDb();modal.classList.add('hidden');renderCustomTabView(typeof tab==='string'?tab:tab.id);
        };
        modal.classList.remove('hidden');
        promoteModalV175(modal);
        requestAnimationFrame(()=>qV175('.recipe-name-v175',modal)?.focus());
    }
    function recipeSheetV175(item) {
        normalizeRecipeV175(item);
        const ingredients=item.ingredients.length?item.ingredients:[{text:'No ingredients added yet'}];
        const steps=item.steps.length?item.steps:[{title:'Instructions',text:item.notes||'No instructions added yet'}];
        return `<div class="recipe-engineering-sheet-v175">${item.coverImage?`<div class="recipe-sheet-cover-v175"><img src="${attrV175(item.coverImage)}" alt="${attrV175(item.name)}"></div>`:''}<div class="recipe-sheet-title-v175">${escV175(item.name)}${item.servings?` <span>(${escV175(item.servings)})</span>`:''}</div>${item.temperature?`<div class="recipe-sheet-setup-v175">${escV175(item.temperature)}</div>`:''}<div class="recipe-sheet-scroll-v175"><div class="recipe-sheet-grid-v175" style="--recipe-step-count-v175:${steps.length}"><div class="recipe-sheet-ingredients-v175">${ingredients.map(x=>`<div class="recipe-sheet-cell-v175">${escV175(x.text)}</div>`).join('')}</div>${steps.map((step,i)=>`<div class="recipe-sheet-step-v175" data-step-index-v175="${i}"><button type="button" draggable="true" class="recipe-sheet-step-handle-v175" title="Drag this column"><i class="ph ph-dots-six-vertical"></i><span>${escV175(step.title||`Step ${i+1}`)}</span></button><div class="recipe-step-body-v175">${escV175(step.text)}</div></div>`).join('')}</div></div>${item.notes&&item.steps.length?`<div class="recipe-sheet-notes-v175"><strong>Notes</strong><div>${escV175(item.notes)}</div></div>`:''}</div>`;
    }
    function ensureRecipeViewV175(){
        let modal=qV175('#recipe-view-modal-v175');if(modal)return modal;
        modal=document.createElement('div');modal.id='recipe-view-modal-v175';modal.className='modal-overlay hidden recipe-view-modal-v175';
        modal.innerHTML=`<div class="modal-box recipe-view-box-v175"><div class="modal-header"><div><h2 class="recipe-view-title-v175">Recipe</h2><p class="progress-hint recipe-view-meta-v175"></p></div><div class="recipe-view-actions-v175"><button type="button" class="small-icon-btn recipe-view-edit-v175" title="Edit recipe"><i class="ph ph-pencil-simple"></i></button><button type="button" class="small-icon-btn recipe-view-close-v175"><i class="ph ph-x"></i></button></div></div><div class="recipe-view-content-v175"></div></div>`;
        document.body.appendChild(modal);qV175('.recipe-view-close-v175',modal).onclick=()=>modal.classList.add('hidden');modal.onpointerdown=e=>{if(e.target===modal)modal.classList.add('hidden')};return modal;
    }
    function openRecipeV175(tab,component,item){
        normalizeRecipeV175(item);const modal=ensureRecipeViewV175(),host=qV175('.recipe-view-content-v175',modal);
        qV175('.recipe-view-title-v175',modal).textContent=item.name;qV175('.recipe-view-meta-v175',modal).textContent=[item.type,item.servings,item.temperature].filter(Boolean).join(' · ');
        const render=()=>{
            host.innerHTML=recipeSheetV175(item);let from=-1;
            qaV175('.recipe-sheet-step-v175',host).forEach(col=>{
                const i=Number(col.dataset.stepIndexV175),handle=qV175('.recipe-sheet-step-handle-v175',col);
                handle.ondragstart=e=>{from=i;try{e.dataTransfer.effectAllowed='move';e.dataTransfer.setData('text/plain',String(i))}catch{};col.classList.add('is-dragging-v175')};
                handle.ondragend=()=>col.classList.remove('is-dragging-v175');
                col.ondragover=e=>{e.preventDefault();try{e.dataTransfer.dropEffect='move'}catch{}};
                col.ondrop=e=>{e.preventDefault();e.stopPropagation();if(from<0||from===i)return;const [moved]=item.steps.splice(from,1);item.steps.splice(i,0,moved);saveDb();render()};
            });
        };
        render();qV175('.recipe-view-edit-v175',modal).onclick=()=>{modal.classList.add('hidden');openRecipeEditorV175(tab,component,item,false)};modal.classList.remove('hidden');promoteModalV175(modal);
    }
    function renderRecipeTrackerV175(tab,component,content){
        component.items=Array.isArray(component.items)?component.items:[];component.items.forEach(normalizeRecipeV175);
        content.innerHTML=`${learningSectionHeader(component,'add-recipe','Add recipe')}<div class="learning-recipe-grid recipe-grid-v175"></div>`;
        const grid=qV175('.recipe-grid-v175',content);
        component.items.forEach(item=>{
            const card=document.createElement('article');card.className='learning-recipe-card recipe-card-v175 custom-searchable-item custom-content-editable';card.dataset.customItemId=item.id;card.dataset.searchText=[item.name,item.type,item.notes,...item.ingredients.map(x=>x.text),...item.steps.map(x=>`${x.title} ${x.text}`)].join(' ').toLowerCase();
            card.innerHTML=`${item.coverImage?`<img class="recipe-card-cover-v175" src="${attrV175(item.coverImage)}" alt="">`:`<div class="recipe-card-cover-v175 recipe-card-cover-empty-v175"><i class="ph ph-cooking-pot"></i></div>`}<div class="learning-recipe-top"><strong>${escV175(item.name)}</strong><span>${escV175(item.type)}</span></div><div class="learning-stars">${Array.from({length:5},(_,i)=>`<i class="ph ${i<item.rating?'ph-star-fill':'ph-star'}"></i>`).join('')}</div><div class="recipe-card-summary-v175"><span>${item.ingredients.length} ingredients</span><span>${item.steps.length} process columns</span></div>`;
            card.onclick=e=>{if(e.target.closest('button,input,textarea,select,a'))return;openRecipeV175(tab,component,item)};
            card.oncontextmenu=e=>{e.preventDefault();e.stopPropagation();showCustomItemContextMenu(e.clientX,e.clientY,[{label:'Edit recipe',icon:'ph-pencil-simple',action:()=>openRecipeEditorV175(tab,component,item,false)},{label:'Delete recipe',icon:'ph-trash',danger:true,action:async()=>{const ok=await showAppConfirm({title:'Delete Recipe',message:`Delete “${item.name}”?`,confirmLabel:'Delete'});if(!ok)return;component.items=component.items.filter(x=>x.id!==item.id);saveDb();renderCustomTabView(typeof tab==='string'?tab:tab.id)}}])};grid.appendChild(card);
        });
        const add=qV175('.add-recipe',content);if(add){add.type='button';add.draggable=false;add.onclick=e=>{e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();openRecipeEditorV175(tab,component,{id:uidV175('recipe'),name:'',rating:3,coverImage:'',ingredients:[],steps:[]},true)}}
    }
    try { renderRecipeTracker=renderRecipeTrackerV175; window.renderRecipeTracker=renderRecipeTrackerV175; } catch {}

    // ------------------------------------------------------------
    // Theme decorations: repeated same-theme mounts inside one switch are
    // ignored once the correct art stage already exists. This prevents the
    // visible "jump through several positions" effect without blocking later
    // deliberate theme edits.
    // ------------------------------------------------------------
    try {
        const beforeMountV175 = mountCustomThemeBackgroundSvgsV2;
        let lastSigV175='', lastAtV175=0, lastResultV175;
        mountCustomThemeBackgroundSvgsV2 = function(theme = {}) {
            let sig='';
            try { sig=JSON.stringify((theme.backgroundSvgs||[]).filter(x=>x&&!x.hidden).map(a=>[a.id||a.name||a.projectPath||a.url,a.x,a.y,a.size,a.rotation,a.animation,a.position,a.manualPositionV44])); } catch {}
            const now=performance.now(), stage=qV175('#custom-theme-background-stage');
            if(sig && sig===lastSigV175 && now-lastAtV175<1200 && stage?.children?.length) return lastResultV175 ?? stage;
            lastSigV175=sig;lastAtV175=now;lastResultV175=beforeMountV175.apply(this,arguments);return lastResultV175;
        };
    } catch {}

    function initV175(){stripLoggedTodayThemeControlsV175();requestAnimationFrame(focusMapStudyInputV175)}
    if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',initV175,{once:true});else initV175();
})();

// ============================================================
// V177 — reliable Daily Log opening, single-pass theme art, cursor safety
// ============================================================
(() => {
    'use strict';
    if (window.__loggyV177) return;
    window.__loggyV177 = true;

    // Numbered Daily Log buttons get one authoritative capture handler. Older
    // compatibility listeners cannot swallow the click before the day opens.
    // V178: do not swallow the original per-day click listeners. The older
    // capture override could prevent the app's own openDay callback from running
    // correctly after later compatibility patches. We only provide a fallback
    // for a day element that somehow lost its direct listener.
    document.addEventListener('click', event => {
        const button = event.target?.closest?.('#days-grid .day-box, #days-grid .polaroid-card[data-day]');
        if (!button) return;
        const day = Number(button.dataset.day || button.closest?.('[data-day]')?.dataset?.day || 0);
        if (!Number.isFinite(day) || day <= 0) return;
        // Let the original target listener run first. If the view did not switch,
        // open the day on the next microtask without cancelling the native click.
        const wasActive = !!document.getElementById('log-view')?.classList.contains('active');
        queueMicrotask(() => {
            const badge = Number(document.getElementById('current-day-badge')?.textContent || 0);
            if (badge === day && document.getElementById('log-view')?.classList.contains('active')) return;
            try { openDayLog(day); }
            catch (error) {
                console.error('[V178] Could not open Daily Log day', day, error);
                try { showFeatureToast?.(`Could not open Day ${day}.`); } catch {}
            }
        });
    }, false);

    // Lock a theme's decoration scene after its first successful mount during a
    // theme switch. Legacy post-apply settle passes still run for compatibility,
    // but they no longer rebuild the same scene and make images visibly jump.
    try {
        const mountBeforeV177 = mountCustomThemeBackgroundSvgsV2;
        let lastSignatureV177 = '';
        let lockedUntilV177 = 0;
        let lastResultV177 = null;
        const signatureV177 = theme => {
            try {
                const assets = (theme?.backgroundSvgs || []).filter(Boolean).map(asset => ({
                    id: asset.id || asset.name || asset.projectPath || asset.path || '',
                    x: Number(asset.x ?? asset.left ?? 0),
                    y: Number(asset.y ?? asset.top ?? 0),
                    size: Number(asset.size ?? asset.scale ?? 0),
                    rotation: Number(asset.rotation ?? asset.rotate ?? 0),
                    animation: String(asset.animation || asset.animationId || ''),
                    hidden: !!asset.hidden,
                    manual: asset.manualPositionV44 || asset.position || null
                }));
                return JSON.stringify([String(theme?.name || ''), String(theme?.svgDistribution || ''), String(theme?.svgScenePreset || ''), assets]);
            } catch { return String(theme?.name || ''); }
        };
        mountCustomThemeBackgroundSvgsV2 = function(theme = {}) {
            const sig = signatureV177(theme);
            const now = performance.now();
            const stage = document.getElementById('custom-theme-background-stage');
            if (sig && sig === lastSignatureV177 && now < lockedUntilV177 && stage?.children?.length) {
                return lastResultV177 ?? stage;
            }
            lastSignatureV177 = sig;
            lockedUntilV177 = now + 2600;
            lastResultV177 = mountBeforeV177.apply(this, arguments);
            return lastResultV177;
        };
    } catch {}

    // Never hide the native mouse unless the replacement cursor is already in
    // the DOM and visible. This removes the brief/no-cursor state that could occur
    // while a theme cursor was registering or intro audio was starting.
    function guardCursorV177() {
        const root = document.documentElement;
        const visual = document.getElementById('custom-cursor-visual');
        const chosen = (() => {
            try { return CURSOR_OPTIONS.find(c => c.id === (db.settings.cursorStyle || 'default')); }
            catch { return null; }
        })();
        const wantsVisual = chosen && (chosen.kind === 'fx' || chosen.kind === 'image');
        const ready = !!(visual && visual.style.display !== 'none' && visual.innerHTML.trim());
        if (root.classList.contains('cursor-hide-native') && !ready) root.classList.remove('cursor-hide-native');
        else if (wantsVisual && ready && !root.classList.contains('cursor-hide-native')) root.classList.add('cursor-hide-native');
    }
    try {
        const beforeCursorV177 = applyCursorChoice;
        applyCursorChoice = function() {
            const result = beforeCursorV177.apply(this, arguments);
            guardCursorV177();
            requestAnimationFrame(guardCursorV177);
            return result;
        };
    } catch {}
    /* V187: applyCursorChoice already calls the cursor guard. Avoid watching every
       body insertion/class change just to re-run the same check. */
    window.addEventListener('pointermove', guardCursorV177, { passive: true });
})();


// ============================================================
// V178 — day navigation, blank Theme Builder, pin modal stacking
// ============================================================
(() => {
    'use strict';
    if (window.__loggyV178) return;
    window.__loggyV178 = true;

    const q=(s,r=document)=>r?.querySelector?.(s)||null;

    // Make blank-theme preparation happen as soon as the main page is usable,
    // not 1.6s later. This keeps the + button nearly instant even on first use.
    const prewarmBlankV178 = () => {
        try { window.__loggyPrepareBlankThemeV175?.(); } catch {}
    };
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            requestAnimationFrame(() => setTimeout(prewarmBlankV178, 0));
        }, {once:true});
    } else {
        requestAnimationFrame(() => setTimeout(prewarmBlankV178, 0));
    }

    // After any Theme Builder closes, immediately rebuild the hidden pristine
    // create draft while the user is looking at Theme Settings. This guarantees
    // the next + starts from defaults rather than the previously edited theme.
    try {
        const themeModal=q('#theme-builder-modal');
        if(themeModal){
            new MutationObserver(records=>{
                for(const rec of records){
                    if(rec.attributeName==='class' && themeModal.classList.contains('hidden')){
                        themeModal.dataset.blankReadyV175='0';
                        setTimeout(prewarmBlankV178,0);
                        break;
                    }
                }
            }).observe(themeModal,{attributes:true,attributeFilter:['class']});
        }
    } catch {}

    // Full-screen pin placement must always be above the item editor it came from.
    // The editor is reparented to body, so promote it whenever placement mode starts.
    const promotePinPlacementV178=()=>{
        const editor=q('body > .kb-pinned-editor-v169.is-pin-placement-v171');
        if(editor) editor.style.setProperty('z-index','2147483640','important');
    };
    document.addEventListener('click',event=>{
        if(event.target?.closest?.('.kb-pinned-place-v171')) requestAnimationFrame(promotePinPlacementV178);
    },true);
    /* The click handler above covers every normal pin-placement launch; a global
       subtree attribute observer was unnecessary and expensive. */
})();

// ============================================================
// V179 — custom theme background-first mounting / preload
// ============================================================
(() => {
    'use strict';

    const creativeSigV179 = theme => {
        try {
            return JSON.stringify([
                String(theme?.backgroundModeV158 || ''),
                String(theme?.backgroundGradientV56 || ''),
                String(theme?.backgroundImage || ''),
                String(theme?.interactiveBackgroundCodeV56 || '')
            ]);
        } catch { return ''; }
    };

    function preloadThemeBackgroundImageV179(theme) {
        const src = String(theme?.backgroundImage || '').trim();
        if (!src || /^data:/i.test(src)) return;
        try {
            let link = document.querySelector('link[data-loggy-theme-bg-preload-v179]');
            if (!link) {
                link = document.createElement('link');
                link.rel = 'preload';
                link.as = 'image';
                link.dataset.loggyThemeBgPreloadV179 = '1';
                document.head.appendChild(link);
            }
            if (link.href !== new URL(src, location.href).href) link.href = src;
        } catch {}
        try {
            const img = new Image();
            img.decoding = 'async';
            try { img.fetchPriority = 'high'; } catch {}
            img.src = src;
            // Keep it reachable until decode/load finishes so the request is not deprioritized.
            window.__loggyThemeBgPreloadV179 = img;
            if (img.decode) img.decode().catch(() => {}).finally(() => {
                if (window.__loggyThemeBgPreloadV179 === img) window.__loggyThemeBgPreloadV179 = null;
            });
        } catch {}
    }

    // Do not tear down/rebuild the same interactive background iframe during the
    // compatibility wrapper chain. Recreating srcdoc was making it visibly appear
    // after decoration images even though it belonged to the same theme apply.
    try {
        const mountBeforeV179 = mountThemeCreativeBackgroundV56;
        mountThemeCreativeBackgroundV56 = function(theme = {}) {
            preloadThemeBackgroundImageV179(theme);
            const sig = creativeSigV179(theme);
            const code = String(theme?.interactiveBackgroundCodeV56 || '').trim();
            const existing = document.getElementById('custom-theme-code-background-v56');

            if (code && existing && existing.dataset.themeCreativeSigV179 === sig) {
                const gradient = String(theme?.backgroundGradientV56 || '').trim();
                if (gradient && !theme?.backgroundImage) {
                    document.body.style.setProperty('background-image', gradient, 'important');
                    document.body.style.setProperty('background-size', 'cover', 'important');
                    document.body.style.setProperty('background-attachment', 'fixed', 'important');
                }
                document.body.classList.add('custom-code-background-active-v56');
                return existing;
            }

            const result = mountBeforeV179.apply(this, arguments);
            const frame = document.getElementById('custom-theme-code-background-v56');
            if (frame) {
                frame.dataset.themeCreativeSigV179 = sig;
                try { frame.loading = 'eager'; } catch {}
            }
            return result;
        };
    } catch {}

    // Critical ordering fix: mount/preload the custom theme background BEFORE the
    // normal custom-theme renderer mounts its SVG/PNG decoration images. The older
    // V56 wrapper still asks to mount it afterward, but the dedupe above turns that
    // second call into a no-op instead of reloading the iframe.
    try {
        const applyCustomBeforeV179 = applyCustomBuiltTheme;
        applyCustomBuiltTheme = function(theme = getCustomThemeSettings()) {
            try {
                preloadThemeBackgroundImageV179(theme);
                mountThemeCreativeBackgroundV56(theme || {});
            } catch {}
            return applyCustomBeforeV179.apply(this, arguments);
        };
    } catch {}
})();

// ============================================================
// V180 — authoritative day opening + Theme Decorations cleanup
// ============================================================
(() => {
    'use strict';
    if (window.__loggyV180) return;
    window.__loggyV180 = true;

    const qV180 = (s, r = document) => r?.querySelector?.(s) || null;

    // Numbered days: make one capture-phase click path authoritative. Some older
    // compatibility handlers can cancel/replace the normal per-card listener,
    // so open the selected day before those handlers get a chance to swallow it.
    document.addEventListener('click', event => {
        const target = event.target?.closest?.('#days-grid .day-box, #days-grid .polaroid-card');
        if (!target) return;
        if (target.closest?.('.new-day, .add-day, [data-new-day]')) return;

        const owner = target.matches?.('[data-day]') ? target : target.closest?.('[data-day]');
        const day = Number(target.dataset?.day || owner?.dataset?.day || target.textContent?.trim());
        if (!Number.isInteger(day) || day < 1) return;

        event.preventDefault();
        event.stopImmediatePropagation();
        try { playClickSound?.(); } catch {}
        try {
            openDayLog(day);
        } catch (error) {
            console.error('[V180] Daily Log open failed', day, error);
            // If a late compatibility wrapper throws after the core view already
            // changed, make sure the requested day/view remain visibly selected.
            try {
                currentDay = day;
                const badge = qV180('#current-day-badge');
                if (badge) badge.textContent = String(day);
                if (typeof switchView === 'function' && typeof logView !== 'undefined' && logView) switchView(logView);
                history.replaceState(null, '', `#day/${day}`);
            } catch {}
        }
    }, true);

    function enforceThemeDecorationCopyV180(modal = qV180('#theme-builder-modal')) {
        if (!modal) return;
        const heading = qV180('.theme-builder-svg-section .theme-builder-media-heading strong', modal);
        if (heading) heading.textContent = 'Theme Decorations';

        const detail = qV180('.theme-builder-svg-section .theme-builder-media-heading small', modal);
        if (detail) detail.textContent = 'Upload SVG, PNG, or JPG images for the theme background.';

        const input = qV180('.theme-builder-svg-file', modal);
        if (input) input.accept = '.svg,.png,.jpg,.jpeg,image/svg+xml,image/png,image/jpeg';

        const count = qV180('.theme-builder-svg-count', modal);
        const total = Array.isArray(modal._themeBackgroundSvgs) ? modal._themeBackgroundSvgs.length : 0;
        if (count) count.textContent = `${total} decoration${total === 1 ? '' : 's'}`;
        const empty = qV180('.theme-builder-svg-empty', modal);
        if (empty) {
            const strong = qV180('strong', empty); if (strong) strong.textContent = 'No decorations uploaded yet';
            const span = qV180('span', empty); if (span) span.textContent = 'Click here or “Add Artwork” to choose some.';
        }
        const add = qV180('.theme-builder-svg-add-card strong', modal);
        if (add) add.textContent = 'Add more decorations';
        modal.querySelectorAll('.theme-builder-svg-card-copy small').forEach(el => el.textContent = 'Right-click to delete');
    }

    // Keep the renamed copy authoritative even when older Theme Builder polish
    // functions rerun after a render/populate cycle.
    try {
        const beforePopulateV180 = populateThemeBuilder;
        populateThemeBuilder = function(modal, theme = {}) {
            const result = beforePopulateV180.apply(this, arguments);
            enforceThemeDecorationCopyV180(modal);
            requestAnimationFrame(() => enforceThemeDecorationCopyV180(modal));
            return result;
        };
    } catch {}
    try {
        const beforeRenderListV180 = renderThemeBuilderSvgListV2;
        renderThemeBuilderSvgListV2 = function(modal) {
            const result = beforeRenderListV180.apply(this, arguments);
            enforceThemeDecorationCopyV180(modal);
            return result;
        };
    } catch {}

    async function deleteThemeDecorationV180(modal, index) {
        if (!modal || !Number.isInteger(index) || index < 0) return;
        const assets = Array.isArray(modal._themeBackgroundSvgs) ? modal._themeBackgroundSvgs : [];
        const asset = assets[index];
        if (!asset) return;

        // Remove from the live draft first so the card disappears immediately.
        // The previous confirm-first path could put a confirmation behind the
        // Theme Builder and made deletion look broken.
        const liveIndex = assets.indexOf(asset);
        if (liveIndex < 0) return;
        assets.splice(liveIndex, 1);
        modal._themeImageSelectionV37 = new Set();
        modal._themeImageSelectionAnchorV37 = null;
        // V70's canonical-artwork safety restores an empty gallery unless the
        // empty state is explicitly marked as intentional. Mark/update the
        // canonical draft BEFORE rendering so deleting the final decoration
        // cannot immediately resurrect it.
        try {
            modal._themeArtworkExplicitlyClearedV70 = assets.length === 0;
            if (assets.length === 0) modal._themeCanonicalArtworkV70 = [];
            else if (typeof updateCanonicalArtworkV70 === 'function') updateCanonicalArtworkV70(modal);
        } catch {}
        if (modal.dataset?.themeBuilderBuiltInSourceV30) modal._builtInArtDirtyV30 = true;

        try { renderThemeBuilderSvgListV2(modal); } catch {}
        try { updateThemeBuilderPreview(modal); } catch {}
        enforceThemeDecorationCopyV180(modal);

        // V529: unlink from this theme only. Keep the uploaded decoration file
        // durable because other themes/variants may still reference it.
    }

    // Right-click deletion: bypass stale multi-selection state and delete the
    // exact decoration that was right-clicked. This makes the card disappear as
    // soon as the confirmation completes.
    document.addEventListener('contextmenu', event => {
        const card = event.target?.closest?.('#theme-builder-modal .theme-builder-svg-card[data-svg-index]');
        if (!card) return;
        const modal = card.closest('#theme-builder-modal');
        const index = Number(card.dataset.svgIndex);
        if (!modal || !Number.isInteger(index)) return;

        event.preventDefault();
        event.stopImmediatePropagation();
        try {
            selectSingleThemeImageV37?.(modal, index);
        } catch {}
        showCustomItemContextMenu(event.clientX, event.clientY, [{
            label: 'Delete Decoration',
            icon: 'ph-trash',
            danger: true,
            action: () => {
                const list = Array.isArray(modal._themeBackgroundSvgs) ? modal._themeBackgroundSvgs : [];
                const live = list[index];
                if (!live) return;
                list.splice(index, 1);
                try {
                    modal._themeImageSelectionV37 = new Set();
                    modal._themeImageSelectionAnchorV37 = null;
                    modal._themeArtworkExplicitlyClearedV70 = list.length === 0;
                    if (!list.length) modal._themeCanonicalArtworkV70 = [];
                    else if (typeof updateCanonicalArtworkV70 === 'function') updateCanonicalArtworkV70(modal);
                } catch {}
                // Do not call the legacy wrapped gallery renderer here: several
                // historical artwork-safety wrappers repopulate an intentionally
                // empty gallery from an older canonical snapshot during that
                // render. Update the visible gallery directly instead.
                try {
                    const host = modal.querySelector('.theme-builder-svg-list');
                    const clickedCard = host?.querySelector(`.theme-builder-svg-card[data-svg-index="${index}"]`);
                    clickedCard?.remove();
                    host?.querySelectorAll('.theme-builder-svg-card[data-svg-index]').forEach(cardEl => {
                        const oldIndex = Number(cardEl.dataset.svgIndex);
                        if (Number.isInteger(oldIndex) && oldIndex > index) cardEl.dataset.svgIndex = String(oldIndex - 1);
                    });
                    if (host && !list.length) {
                        host.innerHTML = `<button type="button" class="theme-builder-svg-empty theme-builder-svg-add-empty"><i class="ph ph-file-svg"></i><strong>No decorations uploaded yet</strong><span>Click here or “Add Artwork” to choose some.</span></button>`;
                        host.querySelector('.theme-builder-svg-add-empty')?.addEventListener('click', () => modal.querySelector('.theme-builder-svg-file')?.click());
                    }
                    const count = modal.querySelector('.theme-builder-svg-count');
                    if (count) count.textContent = `${list.length} decoration${list.length === 1 ? '' : 's'}`;
                } catch {}
                enforceThemeDecorationCopyV180(modal);
                // V529: unlink only. Never physically delete a decoration asset
                // from the shared project store when one theme removes it.
            }
        }]);
    }, true);

    const initV180 = () => enforceThemeDecorationCopyV180();
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initV180, { once: true });
    else initV180();
})();

// ============================================================
// V181 — recommendation child stacking + live Recipe Tracker builder
// ============================================================
(() => {
    'use strict';
    if (window.__loggyV181) return;
    window.__loggyV181 = true;

    const q181 = (s, r = document) => r?.querySelector?.(s) || null;
    const qa181 = (s, r = document) => Array.from(r?.querySelectorAll?.(s) || []);
    const esc181 = value => String(value ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
    const attr181 = esc181;
    const uid181 = prefix => {
        try { if (typeof customId === 'function') return customId(prefix); } catch {}
        return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,8)}`;
    };

    // ------------------------------------------------------------
    // Daily KB Recommendation is a true child modal of KB Settings.
    // Match the open parent's desktop dimensions and always stack above it.
    // ------------------------------------------------------------
    function fitRecommendationV181() {
        const modal = q181('#recommendation-modal-v162');
        if (!modal || modal.classList.contains('hidden')) return;
        const parent = q181('#settings-modal:not(.hidden),#knowledge-settings-modal:not(.hidden),#phrases-settings-modal:not(.hidden)');
        const parentBox = q181(':scope > .modal-box', parent);
        const box = q181(':scope > .modal-box', modal);
        if (!box) return;

        modal.style.setProperty('z-index', '2147483646', 'important');
        if (parentBox) {
            const rect = parentBox.getBoundingClientRect();
            if (rect.width > 0 && rect.height > 0) {
                const width = Math.min(rect.width, Math.max(320, innerWidth - 24));
                const height = Math.min(rect.height, Math.max(320, innerHeight - 24));
                box.style.setProperty('width', `${Math.round(width)}px`, 'important');
                box.style.setProperty('max-width', `${Math.round(width)}px`, 'important');
                box.style.setProperty('height', `${Math.round(height)}px`, 'important');
                box.style.setProperty('max-height', `${Math.round(height)}px`, 'important');
                box.style.setProperty('overflow-y', 'auto', 'important');
            }
        }
    }
    try {
        const priorRecommendationV181 = window.__loggyV162?.openRecommendationSettings;
        if (typeof priorRecommendationV181 === 'function') {
            window.__loggyV162.openRecommendationSettings = function() {
                const result = priorRecommendationV181.apply(this, arguments);
                fitRecommendationV181();
                requestAnimationFrame(fitRecommendationV181);
                setTimeout(fitRecommendationV181, 0);
                return result;
            };
        }
    } catch {}
    document.addEventListener('change', event => {
        if (event.target?.matches?.('.kb-daily-recommend-toggle-v173') && event.target.checked) {
            requestAnimationFrame(fitRecommendationV181);
            setTimeout(fitRecommendationV181, 0);
        }
    }, true);

    // ------------------------------------------------------------
    // Recipe Tracker V181
    // Live engineering table sits directly below the finished example while
    // editing. Process columns can be reordered immediately and each process
    // block can be dragged downward to span more ingredient rows.
    // ------------------------------------------------------------
    function normalizeRecipeV181(item = {}) {
        item.id ||= uid181('recipe');
        item.name = String(item.name || 'Recipe');
        item.type = String(item.type || '');
        item.servings = String(item.servings || '');
        item.temperature = String(item.temperature || '');
        item.notes = String(item.notes || '');
        item.coverImage = String(item.coverImage || item.image || '');
        item.rating = Math.max(1, Math.min(5, Number(item.rating) || 3));
        item.ingredients = Array.isArray(item.ingredients)
            ? item.ingredients.map(x => typeof x === 'string'
                ? {id:uid181('ing'), text:x}
                : {id:x.id || uid181('ing'), text:String(x.text || x.name || '')})
            : [];
        item.steps = Array.isArray(item.steps)
            ? item.steps.map(x => {
                const raw = typeof x === 'string' ? {text:x} : (x || {});
                return {
                    id: raw.id || uid181('step'),
                    title: String(raw.title || ''),
                    text: String(raw.text || raw.instruction || ''),
                    rowStartV181: Number.isFinite(Number(raw.rowStartV181)) ? Number(raw.rowStartV181) : 0,
                    rowEndV181: Number.isFinite(Number(raw.rowEndV181)) ? Number(raw.rowEndV181) : Math.max(0, item.ingredients.length - 1)
                };
            })
            : [];
        clampRecipeSpansV181(item);
        return item;
    }
    function clampRecipeSpansV181(item) {
        const max = Math.max(0, (item.ingredients?.length || 1) - 1);
        (item.steps || []).forEach(step => {
            step.rowStartV181 = Math.max(0, Math.min(max, Number(step.rowStartV181) || 0));
            step.rowEndV181 = Math.max(step.rowStartV181, Math.min(max, Number(step.rowEndV181) || step.rowStartV181));
        });
    }
    const cloneRecipeV181 = item => normalizeRecipeV181(JSON.parse(JSON.stringify(normalizeRecipeV181(item))));
    async function imageToDataV181(file) {
        try { if (typeof customImageFileToDataUrl === 'function') return await customImageFileToDataUrl(file); } catch {}
        return await new Promise(resolve => {
            const reader = new FileReader();
            reader.onload = () => resolve(String(reader.result || ''));
            reader.onerror = () => resolve('');
            reader.readAsDataURL(file);
        });
    }
    function recipeExampleV181() {
        return `<div class="recipe-example-v181">
            <div class="recipe-example-title-v181">Example · Banana Nut Bread</div>
            <div class="recipe-example-setup-v181">Preheat oven to 350°F</div>
            <div class="recipe-example-table-v181">
                <div class="recipe-example-ingredients-v181"><b>Ingredients</b><span>3 ripe bananas</span><span>⅓ cup melted butter</span><span>¾ cup sugar</span><span>1 egg</span><span>1½ cups flour</span><span>½ cup walnuts</span></div>
                <div class="recipe-example-process-v181"><b>mash + mix</b><span style="--span:4">Mash bananas, then mix with butter, sugar, and egg.</span></div>
                <div class="recipe-example-process-v181"><b>fold</b><span style="--span:2">Fold in flour and walnuts.</span></div>
                <div class="recipe-example-process-v181"><b>bake</b><span style="--span:6">Bake until set, then cool before slicing.</span></div>
            </div>
            <small>In your live recipe below, drag a process column horizontally to reorder it. Drag the small handle at the bottom of a process block downward to make that step apply to more ingredient rows.</small>
        </div>`;
    }

    function ensureRecipeEditorV181() {
        let modal = q181('#recipe-editor-modal-v181');
        if (modal) return modal;
        modal = document.createElement('div');
        modal.id = 'recipe-editor-modal-v181';
        modal.className = 'modal-overlay hidden recipe-editor-modal-v181';
        modal.innerHTML = `<div class="modal-box recipe-editor-box-v181">
            <div class="modal-header"><h2 class="recipe-editor-heading-v181">Recipe</h2><button type="button" class="small-icon-btn recipe-editor-close-v181"><i class="ph ph-x"></i></button></div>
            <div class="recipe-edit-grid-v181">
                <label><span class="field-label">Recipe name</span><input class="recipe-name-v181" type="text"></label>
                <label><span class="field-label">Type</span><input class="recipe-type-v181" type="text" placeholder="Bread, dinner, dessert…"></label>
                <label><span class="field-label">Servings / yield</span><input class="recipe-servings-v181" type="text" placeholder="10 servings"></label>
                <label><span class="field-label">Temperature / setup</span><input class="recipe-temp-v181" type="text" placeholder="Preheat oven to 350°F"></label>
                <label><span class="field-label">Rating</span><select class="recipe-rating-v181">${[1,2,3,4,5].map(n=>`<option value="${n}">${n} star${n===1?'':'s'}</option>`).join('')}</select></label>
                <div class="recipe-wide-v181 recipe-cover-editor-v181"><div class="section-header"><span class="field-label">Recipe cover image</span><div><button type="button" class="small-icon-btn recipe-cover-upload-v181" title="Upload cover image"><i class="ph ph-image"></i></button><button type="button" class="small-icon-btn recipe-cover-remove-v181" title="Remove cover image"><i class="ph ph-trash"></i></button></div></div><input type="file" class="recipe-cover-file-v181 hidden" accept="image/*"><div class="recipe-cover-preview-v181"></div></div>
                <div class="recipe-wide-v181"><div class="section-header"><span class="field-label">Ingredients</span><button type="button" class="small-icon-btn recipe-add-ing-v181"><i class="ph ph-plus"></i></button></div><div class="recipe-list-v181 recipe-ings-v181"></div></div>
                <div class="recipe-wide-v181"><div class="section-header"><span class="field-label">Process / instruction columns</span><button type="button" class="small-icon-btn recipe-add-step-v181"><i class="ph ph-plus"></i></button></div><p class="progress-hint">Drag the dotted handle to reorder columns. “Starts at” controls the first ingredient row; in the live table, drag a process block's bottom handle down to extend it across more rows.</p><div class="recipe-list-v181 recipe-steps-v181"></div></div>
                <div class="recipe-wide-v181 recipe-live-section-v181"><div class="section-header"><div><span class="field-label">Your live recipe</span><small>Updates as you type — reorder columns and resize their row spans before saving.</small></div></div><div class="recipe-live-preview-v181"></div></div>
                <label class="recipe-wide-v181"><span class="field-label">Notes</span><textarea class="recipe-notes-v181"></textarea></label>
                <div class="recipe-wide-v181"><span class="field-label">Example finished recipe</span>${recipeExampleV181()}</div>
            </div>
            <button type="button" class="icon-btn recipe-save-v181"><i class="ph ph-check"></i> Save Recipe</button>
        </div>`;
        document.body.appendChild(modal);
        q181('.recipe-editor-close-v181', modal).onclick = () => modal.classList.add('hidden');
        modal.addEventListener('pointerdown', e => { if (e.target === modal) modal.classList.add('hidden'); });
        return modal;
    }

    function recipeSheetHtmlV181(item, {live=false} = {}) {
        normalizeRecipeV181(item);
        const ingredients = item.ingredients.length ? item.ingredients : [{id:'empty',text:'Add an ingredient'}];
        const steps = item.steps.length ? item.steps : [{id:'empty-step',title:'Process',text:'Add a process column',rowStartV181:0,rowEndV181:0}];
        const rows = ingredients.length;
        const stepCount = steps.length;
        const cover = item.coverImage ? `<div class="recipe-sheet-cover-v181"><img src="${attr181(item.coverImage)}" alt=""></div>` : '';
        return `<div class="recipe-engineering-sheet-v181${live?' is-live-v181':''}">${cover}<div class="recipe-sheet-title-v181">${esc181(item.name || 'Untitled Recipe')}${item.servings?` <span>(${esc181(item.servings)})</span>`:''}</div>${item.temperature?`<div class="recipe-sheet-setup-v181">${esc181(item.temperature)}</div>`:''}<div class="recipe-sheet-scroll-v181"><div class="recipe-sheet-grid-v181" style="--recipe-cols-v181:${stepCount};--recipe-rows-v181:${rows}"><div class="recipe-sheet-head-v181 recipe-sheet-ing-head-v181">Ingredients</div>${ingredients.map((ing,i)=>`<div class="recipe-sheet-ingredient-v181 recipe-live-ingredient-v181" data-ing-index-v181="${i}" style="grid-column:1;grid-row:${i+2}">${esc181(ing.text || `Ingredient ${i+1}`)}</div>`).join('')}${steps.map((step,i)=>{const start=Math.max(0,Math.min(rows-1,Number(step.rowStartV181)||0));const end=Math.max(start,Math.min(rows-1,Number(step.rowEndV181)||start));const span=end-start+1;return `<div class="recipe-sheet-head-v181 recipe-step-head-v181" data-step-id-v181="${attr181(step.id)}" style="grid-column:${i+2};grid-row:1">${live?`<button type="button" draggable="true" class="recipe-live-column-drag-v181" title="Drag column"><i class="ph ph-dots-six-vertical"></i><span>${esc181(step.title||`Step ${i+1}`)}</span></button>`:`<span>${esc181(step.title||`Step ${i+1}`)}</span>`}</div><div class="recipe-process-block-v181" data-step-id-v181="${attr181(step.id)}" style="grid-column:${i+2};grid-row:${start+2} / span ${span}"><div>${esc181(step.text||'Add instruction')}</div>${live?`<button type="button" class="recipe-span-handle-v181" title="Drag down to include more ingredient rows" aria-label="Resize process row span"><i class="ph ph-arrows-down-up"></i></button>`:''}</div>`}).join('')}</div></div>${item.notes?`<div class="recipe-sheet-notes-v181"><strong>Notes</strong><div>${esc181(item.notes)}</div></div>`:''}</div>`;
    }

    function ensureRecipeViewV181() {
        let modal = q181('#recipe-view-modal-v181');
        if (modal) return modal;
        modal = document.createElement('div');
        modal.id = 'recipe-view-modal-v181';
        modal.className = 'modal-overlay hidden recipe-view-modal-v181';
        modal.innerHTML = `<div class="modal-box recipe-view-box-v181"><div class="modal-header"><div><h2 class="recipe-view-title-v181">Recipe</h2><p class="progress-hint recipe-view-meta-v181"></p></div><button type="button" class="small-icon-btn recipe-view-close-v181"><i class="ph ph-x"></i></button></div><div class="recipe-view-content-v181"></div></div>`;
        document.body.appendChild(modal);
        q181('.recipe-view-close-v181', modal).onclick = () => modal.classList.add('hidden');
        modal.addEventListener('pointerdown', e => { if (e.target === modal) modal.classList.add('hidden'); });
        return modal;
    }
    function openRecipeViewV181(item) {
        normalizeRecipeV181(item);
        const modal = ensureRecipeViewV181();
        q181('.recipe-view-title-v181', modal).textContent = item.name || 'Recipe';
        q181('.recipe-view-meta-v181', modal).textContent = [item.type,item.servings,item.temperature].filter(Boolean).join(' · ');
        q181('.recipe-view-content-v181', modal).innerHTML = recipeSheetHtmlV181(item);
        modal.classList.remove('hidden');
        modal.style.setProperty('z-index','2147483644','important');
    }

    function openRecipeEditorV181(tab, component, source, isNew=false) {
        const modal = ensureRecipeEditorV181();
        const draft = cloneRecipeV181(source || {id:uid181('recipe'),name:'',rating:3,coverImage:'',ingredients:[],steps:[]});
        if (isNew && draft.name === 'Recipe') draft.name = '';
        const tabId = typeof tab === 'string' ? tab : tab?.id;
        q181('.recipe-editor-heading-v181',modal).textContent = isNew ? 'Add Recipe' : 'Edit Recipe';
        q181('.recipe-name-v181',modal).value = draft.name;
        q181('.recipe-type-v181',modal).value = draft.type;
        q181('.recipe-servings-v181',modal).value = draft.servings;
        q181('.recipe-temp-v181',modal).value = draft.temperature;
        q181('.recipe-rating-v181',modal).value = String(draft.rating);
        q181('.recipe-notes-v181',modal).value = draft.notes;
        const ingHost=q181('.recipe-ings-v181',modal), stepHost=q181('.recipe-steps-v181',modal), coverHost=q181('.recipe-cover-preview-v181',modal), liveHost=q181('.recipe-live-preview-v181',modal);

        const syncTop = () => {
            draft.name = q181('.recipe-name-v181',modal).value;
            draft.type = q181('.recipe-type-v181',modal).value;
            draft.servings = q181('.recipe-servings-v181',modal).value;
            draft.temperature = q181('.recipe-temp-v181',modal).value;
            draft.rating = Number(q181('.recipe-rating-v181',modal).value)||3;
            draft.notes = q181('.recipe-notes-v181',modal).value;
        };
        const renderCover = () => {
            coverHost.innerHTML = draft.coverImage ? `<img src="${attr181(draft.coverImage)}" alt="Recipe cover">` : '<div class="recipe-cover-empty-v181"><i class="ph ph-image"></i><span>No cover image</span></div>';
            q181('.recipe-cover-remove-v181',modal).classList.toggle('hidden',!draft.coverImage);
        };
        const renderLive = () => {
            syncTop();
            clampRecipeSpansV181(draft);
            liveHost.innerHTML = recipeSheetHtmlV181(draft,{live:true});

            // Horizontal process-column reorder directly in the live recipe.
            let fromId='';
            qa181('.recipe-live-column-drag-v181', liveHost).forEach(handle => {
                const head = handle.closest('[data-step-id-v181]');
                const id = head?.dataset.stepIdV181 || '';
                handle.ondragstart = e => { fromId=id; try{e.dataTransfer.effectAllowed='move';e.dataTransfer.setData('text/plain',id)}catch{}; };
                head.ondragover = e => { e.preventDefault(); try{e.dataTransfer.dropEffect='move'}catch{}; };
                head.ondrop = e => {
                    e.preventDefault(); e.stopPropagation();
                    const targetId = id;
                    const from = draft.steps.findIndex(s=>s.id===fromId), to = draft.steps.findIndex(s=>s.id===targetId);
                    if (from<0 || to<0 || from===to) return;
                    const [moved]=draft.steps.splice(from,1); draft.steps.splice(to,0,moved);
                    renderSteps(); renderLive();
                };
            });

            // Vertical row-span resize. Dragging the bottom grip chooses the
            // closest ingredient row and updates the saved rowEndV181 value.
            qa181('.recipe-span-handle-v181', liveHost).forEach(handle => {
                const block = handle.closest('.recipe-process-block-v181');
                const stepId = block?.dataset.stepIdV181;
                handle.onpointerdown = event => {
                    event.preventDefault(); event.stopPropagation();
                    try { handle.setPointerCapture(event.pointerId); } catch {}
                    // Cache the ingredient row rects once instead of re-querying a
                    // DOM that we're about to replace out from under the drag.
                    const rows = qa181('.recipe-live-ingredient-v181', liveHost).map(row => ({
                        index: Number(row.dataset.ingIndexV181) || 0,
                        rect: row.getBoundingClientRect()
                    }));
                    const stepAtStart = draft.steps.find(s => s.id === stepId);
                    const startRow = stepAtStart ? (stepAtStart.rowStartV181||0) : 0;
                    let pendingNext = null;
                    const move = ev => {
                        if (!rows.length) return;
                        let target = 0, best = Infinity;
                        rows.forEach(r => {
                            const d = Math.abs(ev.clientY - (r.rect.top + r.rect.height/2));
                            if (d < best) { best = d; target = r.index; }
                        });
                        const step = draft.steps.find(s => s.id === stepId); if (!step) return;
                        const next = Math.max(step.rowStartV181||0, target);
                        if (next !== (pendingNext===null?step.rowEndV181:pendingNext)) {
                            pendingNext = next;
                            // Live visual feedback without tearing down the DOM mid-drag:
                            // just resize the grid-row span in place.
                            block.style.gridRow = `${startRow+2} / span ${next-startRow+1}`;
                        }
                    };
                    const finish = () => {
                        window.removeEventListener('pointermove', move, true);
                        window.removeEventListener('pointerup', finish, true);
                        window.removeEventListener('pointercancel', finish, true);
                        try { handle.releasePointerCapture(event.pointerId); } catch {}
                        if (pendingNext !== null) {
                            const step = draft.steps.find(s => s.id === stepId);
                            if (step) step.rowEndV181 = pendingNext;
                        }
                        renderLive();
                    };
                    window.addEventListener('pointermove', move, true);
                    window.addEventListener('pointerup', finish, true);
                    window.addEventListener('pointercancel', finish, true);
                };
            });
        };
        const ingredientOptions = selected => {
            const source = draft.ingredients.length ? draft.ingredients : [{text:'Ingredient 1'}];
            return source.map((ing,i)=>`<option value="${i}" ${i===selected?'selected':''}>${i+1}. ${esc181(ing.text||`Ingredient ${i+1}`)}</option>`).join('');
        };
        const renderIngredients = () => {
            ingHost.innerHTML = draft.ingredients.map((ing,i)=>`<div class="recipe-row-v181" data-i="${i}"><input type="text" value="${attr181(ing.text)}" placeholder="2 large ripe bananas"><button type="button" class="small-icon-btn recipe-remove-ing-v181"><i class="ph ph-trash"></i></button></div>`).join('') || '<p class="progress-hint">No ingredients yet. Use + to add one.</p>';
            qa181('.recipe-row-v181',ingHost).forEach(row=>{
                const i=Number(row.dataset.i);q181('input',row).oninput=e=>{draft.ingredients[i].text=e.target.value;renderSteps(false);renderLive()};
                q181('.recipe-remove-ing-v181',row).onclick=()=>{draft.ingredients.splice(i,1);clampRecipeSpansV181(draft);renderIngredients();renderSteps();renderLive()};
            });
        };
        const renderSteps = (rerenderLive=true) => {
            clampRecipeSpansV181(draft);
            stepHost.innerHTML = draft.steps.map((step,i)=>`<div class="recipe-step-row-v181" data-i="${i}"><button type="button" draggable="true" class="recipe-step-drag-v181" title="Drag to reorder"><i class="ph ph-dots-six-vertical"></i></button><div class="recipe-step-fields-v181"><input type="text" class="recipe-step-title-input-v181" value="${attr181(step.title)}" placeholder="Mash / Mix / Bake"><textarea placeholder="Instruction">${esc181(step.text)}</textarea><label class="recipe-step-start-label-v181"><span>Starts at</span><select class="recipe-step-start-v181">${ingredientOptions(step.rowStartV181)}</select></label></div><button type="button" class="small-icon-btn recipe-remove-step-v181"><i class="ph ph-trash"></i></button></div>`).join('') || '<p class="progress-hint">No process columns yet. Use + to add one.</p>';
            let from=-1;
            qa181('.recipe-step-row-v181',stepHost).forEach(row=>{
                const i=Number(row.dataset.i), step=draft.steps[i], handle=q181('.recipe-step-drag-v181',row);
                q181('.recipe-step-title-input-v181',row).oninput=e=>{step.title=e.target.value;renderLive()};
                q181('textarea',row).oninput=e=>{step.text=e.target.value;renderLive()};
                q181('.recipe-step-start-v181',row).onchange=e=>{const old=step.rowStartV181||0;const next=Number(e.target.value)||0;const span=Math.max(0,(step.rowEndV181||old)-old);step.rowStartV181=next;step.rowEndV181=Math.min(Math.max(0,draft.ingredients.length-1),next+span);clampRecipeSpansV181(draft);renderLive()};
                q181('.recipe-remove-step-v181',row).onclick=()=>{draft.steps.splice(i,1);renderSteps();renderLive()};
                handle.ondragstart=e=>{from=i;try{e.dataTransfer.effectAllowed='move';e.dataTransfer.setData('text/plain',String(i))}catch{};row.classList.add('is-dragging-v181')};
                handle.ondragend=()=>row.classList.remove('is-dragging-v181');
                row.ondragover=e=>{e.preventDefault();try{e.dataTransfer.dropEffect='move'}catch{}};
                row.ondrop=e=>{e.preventDefault();e.stopPropagation();if(from<0||from===i)return;const [moved]=draft.steps.splice(from,1);draft.steps.splice(i,0,moved);renderSteps();renderLive()};
            });
            if (rerenderLive) renderLive();
        };

        renderCover(); renderIngredients(); renderSteps(false); renderLive();
        // Abort old editor input listeners from the previous open before binding a new draft.
        try { modal._recipeSignalV181?.abort(); } catch {}
        modal._recipeSignalV181 = new AbortController();
        const signal=modal._recipeSignalV181.signal;
        ['.recipe-name-v181','.recipe-type-v181','.recipe-servings-v181','.recipe-temp-v181','.recipe-rating-v181','.recipe-notes-v181'].forEach(sel=>{
            const el=q181(sel,modal); if(!el)return; el.addEventListener(el.tagName==='SELECT'?'change':'input',renderLive,{signal});
        });
        q181('.recipe-add-ing-v181',modal).onclick=()=>{draft.ingredients.push({id:uid181('ing'),text:''});clampRecipeSpansV181(draft);renderIngredients();renderSteps(false);renderLive();requestAnimationFrame(()=>qa181('.recipe-row-v181 input',ingHost).at(-1)?.focus())};
        q181('.recipe-add-step-v181',modal).onclick=()=>{const end=Math.max(0,draft.ingredients.length-1);draft.steps.push({id:uid181('step'),title:'',text:'',rowStartV181:0,rowEndV181:0});renderSteps();requestAnimationFrame(()=>qa181('.recipe-step-title-input-v181',stepHost).at(-1)?.focus())};
        const file=q181('.recipe-cover-file-v181',modal);
        q181('.recipe-cover-upload-v181',modal).onclick=()=>{file.value='';file.click()};
        q181('.recipe-cover-remove-v181',modal).onclick=()=>{draft.coverImage='';renderCover();renderLive()};
        file.onchange=async()=>{const f=file.files?.[0];if(!f)return;draft.coverImage=await imageToDataV181(f);renderCover();renderLive()};
        q181('.recipe-save-v181',modal).onclick=()=>{
            syncTop();
            draft.name=draft.name.trim()||'Recipe';draft.type=draft.type.trim();draft.servings=draft.servings.trim();draft.temperature=draft.temperature.trim();draft.notes=draft.notes.trim();
            draft.ingredients=draft.ingredients.filter(x=>String(x.text||'').trim());
            draft.steps=draft.steps.filter(x=>String(x.title||'').trim()||String(x.text||'').trim());
            clampRecipeSpansV181(draft);
            component.items=Array.isArray(component.items)?component.items:[];
            const idx=component.items.findIndex(x=>x.id===source?.id);
            if(idx>=0&&!isNew)component.items[idx]=draft;else component.items.push(draft);
            saveDb();modal.classList.add('hidden');renderCustomTabView(tabId);
        };
        modal.classList.remove('hidden');
        modal.style.setProperty('z-index','2147483644','important');
        requestAnimationFrame(()=>q181('.recipe-name-v181',modal)?.focus());
    }

    function renderRecipeTrackerV181(tab, component, content) {
        component.items = Array.isArray(component.items) ? component.items : [];
        component.items.forEach(normalizeRecipeV181);
        content.innerHTML = `${learningSectionHeader(component,'add-recipe','Add recipe')}<div class="learning-recipe-grid recipe-grid-v181"></div>`;
        const grid=q181('.recipe-grid-v181',content), tabId=typeof tab==='string'?tab:tab?.id;
        component.items.forEach(item=>{
            const card=document.createElement('article');
            card.className='learning-recipe-card recipe-card-v181 custom-searchable-item custom-content-editable';
            card.dataset.customItemId=item.id;
            card.dataset.searchText=[item.name,item.type,item.notes,...item.ingredients.map(x=>x.text),...item.steps.map(x=>`${x.title} ${x.text}`)].join(' ').toLowerCase();
            card.innerHTML=`${item.coverImage?`<img class="recipe-card-cover-v181" src="${attr181(item.coverImage)}" alt="">`:`<div class="recipe-card-cover-v181 recipe-card-cover-empty-v181"><i class="ph ph-cooking-pot"></i></div>`}<div class="learning-recipe-top"><strong>${esc181(item.name)}</strong><span>${esc181(item.type)}</span></div><div class="learning-stars">${Array.from({length:5},(_,i)=>`<i class="ph ${i<item.rating?'ph-star-fill':'ph-star'}"></i>`).join('')}</div><div class="recipe-card-summary-v181"><span>${item.ingredients.length} ingredients</span><span>${item.steps.length} process columns</span></div>`;
            card.onclick=e=>{if(e.target.closest('button,input,textarea,select,a'))return;openRecipeViewV181(item)};
            card.oncontextmenu=e=>{e.preventDefault();e.stopPropagation();showCustomItemContextMenu(e.clientX,e.clientY,[{label:'Edit recipe',icon:'ph-pencil-simple',action:()=>openRecipeEditorV181(tab,component,item,false)},{label:'Delete recipe',icon:'ph-trash',danger:true,action:async()=>{const ok=await showAppConfirm({title:'Delete Recipe',message:`Delete “${item.name}”?`,confirmLabel:'Delete'});if(!ok)return;component.items=component.items.filter(x=>x.id!==item.id);saveDb();renderCustomTabView(tabId)}}])};
            grid.appendChild(card);
        });
        const add=q181('.add-recipe',content);
        if(add){add.type='button';add.draggable=false;add.onclick=e=>{e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();openRecipeEditorV181(tab,component,{id:uid181('recipe'),name:'',rating:3,coverImage:'',ingredients:[],steps:[]},true)}}
    }
    try { renderRecipeTracker = renderRecipeTrackerV181; window.renderRecipeTracker = renderRecipeTrackerV181; } catch {}
    window.__loggyRecipeV181 = { openEditor:openRecipeEditorV181, openView:openRecipeViewV181, render:renderRecipeTrackerV181, normalize:normalizeRecipeV181 };
})();


// ============================================================
// V181.1 — make floating context-menu commands win before legacy closers
// ============================================================
(() => {
    if (window.__loggyContextMenuPointerFixV181) return;
    window.__loggyContextMenuPointerFixV181 = true;
    window.addEventListener('pointerdown', event => {
        if (event.button !== 0) return;
        const button = event.target?.closest?.('#custom-item-context-menu button');
        if (!button) return;
        const action = button.__loggyContextAction;
        if (typeof action !== 'function') return;
        event.preventDefault();
        event.stopImmediatePropagation();
        button.closest('#custom-item-context-menu')?.remove();
        try { action(); } catch (error) { console.error(error); }
    }, true);
})();


// ============================================================
// V182 — authoritative Daily Log clicks + Theme Decoration deletion
// ============================================================
(() => {
    'use strict';
    if (window.__loggyV182) return;
    window.__loggyV182 = true;

    const q182 = (s, r=document) => r?.querySelector?.(s) || null;

    // Use the original synchronous Daily Log opener as the fast path. The later
    // compatibility wrappers only add secondary helpers; a failure in one of
    // those helpers must never make a numbered day appear dead.
    function openDayFastV182(day) {
        day = Number(day);
        if (!Number.isInteger(day) || day < 1) return;

        // Give immediate visual feedback before any optional Daily Log add-ons.
        try { if (logView && !logView.classList.contains('active')) switchView(logView); } catch {}

        let opened = false;
        try {
            if (typeof openDayLogBeforeConnectionsV32 === 'function') {
                openDayLogBeforeConnectionsV32(day);
                opened = true;
            }
        } catch (error) {
            console.error('[V182] core Daily Log open failed', day, error);
        }
        if (!opened) {
            try { openDayLog(day); opened = true; }
            catch (error) { console.error('[V182] Daily Log open fallback failed', day, error); }
        }

        // Keep the small post-open enhancements, but isolate each one so none can
        // block the day itself from opening.
        try { ensureDailyConnectionsArrayV32?.(day); } catch {}
        try { ensureDailyConnectionsUIV32?.(); } catch {}
        try { renderDailyConnectionsV32?.(); } catch {}
        try { closeDayMentionMenuV44?.(); } catch {}
        try { closeNotesDayPopupV45?.(); } catch {}
        try { requestAnimationFrame(() => { try { bindDayMentionAutocompleteV44?.(); } catch {} try { bindSlashStyleDayPopupV45?.(); } catch {} }); } catch {}
    }
    window.__openDayFastV182 = openDayFastV182;

    // Window capture runs before the older document-level compatibility handlers.
    // It only owns real numbered days; the + New Day card is left untouched.
    window.addEventListener('click', event => {
        const target = event.target instanceof Element ? event.target : null;
        if (!target) return;
        const dayCard = target.closest('#days-grid .polaroid-card[data-day], #days-grid [data-day] > .day-box, #days-grid .day-box[data-day]');
        if (!dayCard) return;
        const owner = dayCard.matches('[data-day]') ? dayCard : dayCard.closest('[data-day]');
        const day = Number(dayCard.dataset.day || owner?.dataset?.day || 0);
        if (!Number.isInteger(day) || day < 1) return;
        event.preventDefault();
        event.stopImmediatePropagation();
        try { playClickSound?.(); } catch {}
        openDayFastV182(day);
    }, true);

    function enforceDecorationCopyV182(modal=q182('#theme-builder-modal')) {
        if (!modal) return;
        const heading=q182('.theme-builder-svg-section .theme-builder-media-heading strong',modal);
        const detail=q182('.theme-builder-svg-section .theme-builder-media-heading small',modal);
        const input=q182('.theme-builder-svg-file',modal);
        if (heading) heading.textContent='Theme Decorations';
        if (detail) detail.textContent='Upload SVG, PNG, or JPG images for the theme background.';
        if (input) input.accept='.svg,.png,.jpg,.jpeg,image/svg+xml,image/png,image/jpeg';
        modal.querySelectorAll('.theme-builder-svg-card-copy small').forEach(el=>el.textContent='Right-click to delete');
        const add=q182('.theme-builder-svg-add-card strong',modal); if(add) add.textContent='Add more decorations';
        const empty=q182('.theme-builder-svg-empty',modal);
        if(empty){
            const strong=q182('strong',empty); if(strong) strong.textContent='No decorations uploaded yet';
            const helper=q182('span,small',empty); if(helper) helper.textContent='Click here or “Add Artwork” to choose some.';
        }
        const count=q182('.theme-builder-svg-count',modal);
        const n=Array.isArray(modal._themeBackgroundSvgs)?modal._themeBackgroundSvgs.length:0;
        if(count) count.textContent=`${n} decoration${n===1?'':'s'}`;
    }

    async function removeDecorationV182(modal,index,card=null) {
        const assets=Array.isArray(modal?._themeBackgroundSvgs)?modal._themeBackgroundSvgs:null;
        if(!assets || !Number.isInteger(index) || index<0 || index>=assets.length) return;
        const asset=assets[index];
        assets.splice(index,1);
        modal._themeDecorationDeleteGuardUntilV182=performance.now()+1800;
        modal._themeImageSelectionV37=new Set();
        modal._themeImageSelectionAnchorV37=null;
        if(modal.dataset?.themeBuilderBuiltInSourceV30) modal._builtInArtDirtyV30=true;

        // Disappear immediately, even if an old renderer throws later.
        try { card?.remove(); } catch {}
        try { renderThemeBuilderSvgListV2(modal); } catch {}
        try { updateThemeBuilderPreview(modal); } catch {}
        enforceDecorationCopyV182(modal);

        // V529: unlink only; keep the durable uploaded project asset.
    }

    // If a late compatibility populate fires immediately after deletion, preserve
    // the live edited decoration array instead of restoring the pre-delete copy.
    try {
        const beforePopulateV182=populateThemeBuilder;
        populateThemeBuilder=function(modal,theme={}){
            let nextTheme=theme;
            if(modal && Number(modal._themeDecorationDeleteGuardUntilV182||0)>performance.now()){
                nextTheme={...(theme||{}),backgroundSvgs:(modal._themeBackgroundSvgs||[]).map(a=>({...a}))};
            }
            const result=beforePopulateV182.call(this,modal,nextTheme);
            enforceDecorationCopyV182(modal);
            return result;
        };
    } catch {}
    try {
        const beforeRenderV182=renderThemeBuilderSvgListV2;
        renderThemeBuilderSvgListV2=function(modal){
            const result=beforeRenderV182.apply(this,arguments);
            enforceDecorationCopyV182(modal);
            return result;
        };
    } catch {}

    // Own Theme Builder decoration right-clicks before older document handlers.
    window.addEventListener('contextmenu', event => {
        const target=event.target instanceof Element?event.target:null;
        const card=target?.closest('#theme-builder-modal .theme-builder-svg-card[data-svg-index]:not(.theme-builder-svg-add-card)');
        if(!card) return;
        const modal=card.closest('#theme-builder-modal');
        const index=Number(card.dataset.svgIndex);
        if(!modal || !Number.isInteger(index)) return;
        event.preventDefault();
        event.stopImmediatePropagation();
        try { selectSingleThemeImageV37?.(modal,index); } catch {}
        showCustomItemContextMenu(event.clientX,event.clientY,[{
            label:'Delete Decoration',icon:'ph-trash',danger:true,
            action:()=>removeDecorationV182(modal,index,card)
        }]);
    },true);

    const polish=()=>enforceDecorationCopyV182();
    if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',polish,{once:true}); else polish();
    document.addEventListener('click',e=>{if(e.target?.closest?.('.theme-search-create-v161,.theme-picker-create-card,#theme-builder-modal'))requestAnimationFrame(polish)},true);
})();

// ============================================================
// V183 — Recipe Tracker: direct live-grid editor
// Ingredients and instructions are edited in the actual recipe grid. There is
// no separate step list, start-row selector, example, or preview panel.
// ============================================================
(() => {
    'use strict';
    if (window.__loggyRecipeV183) return;
    window.__loggyRecipeV183 = true;

    const q = (s, r = document) => r?.querySelector?.(s) || null;
    const qa = (s, r = document) => Array.from(r?.querySelectorAll?.(s) || []);
    const esc = value => String(value ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
    const attr = esc;
    const makeId = prefix => {
        try { if (typeof customId === 'function') return customId(prefix); } catch {}
        return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,8)}`;
    };

    function normalize(item = {}) {
        item.id ||= makeId('recipe');
        item.name = String(item.name || 'Recipe');
        item.type = String(item.type || '');
        item.servings = String(item.servings || '');
        item.temperature = String(item.temperature || '');
        item.notes = String(item.notes || '');
        item.coverImage = String(item.coverImage || item.image || '');
        item.rating = Math.max(1, Math.min(5, Number(item.rating) || 3));
        item.ingredients = Array.isArray(item.ingredients)
            ? item.ingredients.map(x => typeof x === 'string'
                ? { id: makeId('ing'), text: x }
                : { id: x?.id || makeId('ing'), text: String(x?.text || x?.name || '') })
            : [];
        item.steps = Array.isArray(item.steps)
            ? item.steps.map(x => {
                const raw = typeof x === 'string' ? { text: x } : (x || {});
                return {
                    id: raw.id || makeId('instruction'),
                    title: String(raw.title || ''),
                    text: String(raw.text || raw.instruction || ''),
                    rowStartV181: Number.isFinite(Number(raw.rowStartV181)) ? Number(raw.rowStartV181) : 0,
                    rowEndV181: Number.isFinite(Number(raw.rowEndV181)) ? Number(raw.rowEndV181) : 0,
                    colV184: Number.isFinite(Number(raw.colV184)) ? Math.max(0, Math.floor(Number(raw.colV184))) : null
                };
            })
            : [];
        clamp(item);
        return item;
    }

    function clamp(item) {
        const max = Math.max(0, (item.ingredients?.length || 1) - 1);
        (item.steps || []).forEach((step, index) => {
            let start = Number(step.rowStartV181);
            let end = Number(step.rowEndV181);
            if (!Number.isFinite(start)) start = 0;
            if (!Number.isFinite(end)) end = start;
            start = Math.max(0, Math.min(max, start));
            end = Math.max(start, Math.min(max, end));
            step.rowStartV181 = start;
            step.rowEndV181 = end;
            if (!Number.isFinite(Number(step.colV184))) step.colV184 = index;
            step.colV184 = Math.max(0, Math.floor(Number(step.colV184) || 0));
        });
    }

    const cloneRecipe = item => normalize(JSON.parse(JSON.stringify(normalize(item))));

    async function fileToData(file) {
        try { if (typeof customImageFileToDataUrl === 'function') return await customImageFileToDataUrl(file); } catch {}
        return await new Promise(resolve => {
            const reader = new FileReader();
            reader.onload = () => resolve(String(reader.result || ''));
            reader.onerror = () => resolve('');
            reader.readAsDataURL(file);
        });
    }

    function ensureEditor() {
        let modal = q('#recipe-editor-modal-v183');
        if (modal) return modal;
        modal = document.createElement('div');
        modal.id = 'recipe-editor-modal-v183';
        modal.className = 'modal-overlay hidden recipe-editor-modal-v183';
        modal.innerHTML = `<div class="modal-box recipe-editor-box-v183">
            <div class="modal-header recipe-editor-header-v183">
                <h2 class="recipe-editor-title-v183">Recipe</h2>
                <button type="button" class="small-icon-btn recipe-editor-close-v183" aria-label="Close"><i class="ph ph-x"></i></button>
            </div>
            <div class="recipe-meta-v183">
                <label><span class="field-label">Recipe name</span><input class="recipe-name-v183" type="text" placeholder="Banana Nut Bread"></label>
                <label><span class="field-label">Type</span><input class="recipe-type-v183" type="text" placeholder="Bread, dinner, dessert…"></label>
                <label><span class="field-label">Servings / yield</span><input class="recipe-servings-v183" type="text" placeholder="10 servings"></label>
                <label><span class="field-label">Temperature / setup</span><input class="recipe-temp-v183" type="text" placeholder="Preheat oven to 350°F"></label>
                <label><span class="field-label">Rating</span><select class="recipe-rating-v183">${[1,2,3,4,5].map(n=>`<option value="${n}">${n} star${n===1?'':'s'}</option>`).join('')}</select></label>
                <div class="recipe-cover-control-v183">
                    <span class="field-label">Image</span>
                    <button type="button" class="recipe-cover-preview-v184 recipe-cover-pick-v185" title="Click to add or replace image. Right-click to remove." aria-label="Recipe image"><i class="ph ph-image"></i></button>
                    <input type="file" class="recipe-cover-file-v183 hidden" accept="image/*">
                </div>
            </div>
            <div class="recipe-builder-toolbar-v183">
                <div><strong>Build the recipe directly in the grid</strong><small>Drag an instruction card up, down, left, or right. Drop it below another instruction to stack them in the same lane. Drag the bottom handle to cover more ingredient rows.</small></div>
                <div class="recipe-builder-actions-v183">
                    <button type="button" class="small-icon-btn recipe-add-ingredient-v183"><i class="ph ph-plus"></i> Ingredient</button>
                    <button type="button" class="small-icon-btn recipe-add-instruction-v183"><i class="ph ph-plus"></i> Instruction</button>
                </div>
            </div>
            <div class="recipe-live-editor-v183"></div>
            <label class="recipe-notes-wrap-v183"><span class="field-label">Notes</span><textarea class="recipe-notes-v183" placeholder="Optional notes"></textarea></label>
            <button type="button" class="icon-btn recipe-save-v183"><i class="ph ph-check"></i> Save Recipe</button>
        </div>`;
        document.body.appendChild(modal);
        q('.recipe-editor-close-v183', modal).onclick = () => modal.classList.add('hidden');
        modal.addEventListener('pointerdown', e => { if (e.target === modal) modal.classList.add('hidden'); });
        return modal;
    }

    function ensureViewer() {
        let modal = q('#recipe-view-modal-v183');
        if (modal) return modal;
        modal = document.createElement('div');
        modal.id = 'recipe-view-modal-v183';
        modal.className = 'modal-overlay hidden recipe-view-modal-v183';
        modal.innerHTML = `<div class="modal-box recipe-view-box-v183"><div class="modal-header"><div><h2 class="recipe-view-title-v183">Recipe</h2><p class="progress-hint recipe-view-meta-v183"></p></div><button type="button" class="small-icon-btn recipe-view-close-v183"><i class="ph ph-x"></i></button></div><div class="recipe-view-content-v183"></div></div>`;
        document.body.appendChild(modal);
        q('.recipe-view-close-v183', modal).onclick = () => modal.classList.add('hidden');
        modal.addEventListener('pointerdown', e => { if (e.target === modal) modal.classList.add('hidden'); });
        return modal;
    }

    function viewerHtml(item) {
        normalize(item);
        const ingredients = item.ingredients.length ? item.ingredients : [{ text: 'No ingredients' }];
        const rows = ingredients.length;
        const cols = Math.max(1, ...item.steps.map((step, i) => Number.isFinite(Number(step.colV184)) ? Number(step.colV184) + 1 : i + 1));
        return `<article class="recipe-sheet-v183 recipe-sheet-v184" style="--recipe-view-cols-v184:${cols};--recipe-view-rows-v184:${rows}">
            <div class="recipe-view-summary-v184">
                <div class="recipe-view-cover-v183 ${item.coverImage ? '' : 'is-empty-v184'}">${item.coverImage ? `<img src="${attr(item.coverImage)}" alt="">` : '<i class="ph ph-cooking-pot"></i>'}</div>
                <div class="recipe-view-summary-copy-v184">
                    <div class="recipe-view-heading-v183"><strong>${esc(item.name || 'Recipe')}</strong>${item.servings ? `<span>${esc(item.servings)}</span>` : ''}</div>
                    ${item.type ? `<div class="recipe-view-type-v184">${esc(item.type)}</div>` : ''}
                    ${item.temperature ? `<div class="recipe-view-setup-v183">${esc(item.temperature)}</div>` : ''}
                </div>
            </div>
            <div class="recipe-grid-scroll-v183 recipe-view-grid-wrap-v184"><div class="recipe-grid-v183 recipe-grid-readonly-v183" style="--recipe-cols-v183:${cols};--recipe-rows-v183:${rows}">
                <div class="recipe-corner-v183">Ingredients</div>
                <div class="recipe-instructions-label-v184" style="grid-column:2 / span ${cols};grid-row:1">Instructions</div>
                ${ingredients.map((ing,i)=>`<div class="recipe-ingredient-view-v183" style="grid-column:1;grid-row:${i+2}">${esc(ing.text)}</div>`).join('')}
                ${item.steps.map((step,i)=>{const start=Math.max(0,Math.min(rows-1,step.rowStartV181||0));const end=Math.max(start,Math.min(rows-1,step.rowEndV181||start));const col=Math.max(0,Number.isFinite(Number(step.colV184))?Number(step.colV184):i);return `<div class="recipe-instruction-view-v183 recipe-instruction-view-v184" style="grid-column:${col+2};grid-row:${start+2} / span ${end-start+1}">${step.title?`<strong>${esc(step.title)}</strong>`:''}<span>${esc(step.text)}</span></div>`}).join('')}
            </div></div>
            ${item.notes ? `<div class="recipe-view-notes-v183"><strong>Notes</strong><div>${esc(item.notes)}</div></div>` : ''}
        </article>`;
    }

    function fitRecipeViewV184(modal) {
        const host = q('.recipe-view-content-v183', modal);
        const sheet = q('.recipe-sheet-v183', host);
        if (!host || !sheet) return;
        sheet.style.zoom = '1';
        sheet.style.width = '100%';
        requestAnimationFrame(() => {
            const availableW = Math.max(1, host.clientWidth);
            const availableH = Math.max(1, host.clientHeight);
            const neededW = Math.max(1, sheet.scrollWidth);
            const neededH = Math.max(1, sheet.scrollHeight);
            const scale = Math.max(.62, Math.min(1, availableW / neededW, availableH / neededH));
            if (scale < .995) {
                sheet.style.zoom = String(scale);
                sheet.style.width = `${100 / scale}%`;
            }
        });
    }

    function openView(item) {
        normalize(item);
        const modal = ensureViewer();
        q('.recipe-view-title-v183', modal).textContent = item.name || 'Recipe';
        q('.recipe-view-meta-v183', modal).textContent = [item.type, item.servings, item.temperature].filter(Boolean).join(' · ');
        q('.recipe-view-content-v183', modal).innerHTML = viewerHtml(item);
        modal.classList.remove('hidden');
        fitRecipeViewV184(modal);
    }

    function openEditor(tab, component, source, isNew = false) {
        const modal = ensureEditor();
        const draft = cloneRecipe(source || { id: makeId('recipe'), name:'', rating:3, ingredients:[], steps:[] });
        if (isNew && draft.name === 'Recipe') draft.name = '';
        const tabId = typeof tab === 'string' ? tab : tab?.id;
        q('.recipe-editor-title-v183', modal).textContent = isNew ? 'Add Recipe' : 'Edit Recipe';
        q('.recipe-name-v183', modal).value = draft.name;
        q('.recipe-type-v183', modal).value = draft.type;
        q('.recipe-servings-v183', modal).value = draft.servings;
        q('.recipe-temp-v183', modal).value = draft.temperature;
        q('.recipe-rating-v183', modal).value = String(draft.rating);
        q('.recipe-notes-v183', modal).value = draft.notes;
        const live = q('.recipe-live-editor-v183', modal);

        const syncMeta = () => {
            draft.name = q('.recipe-name-v183', modal).value;
            draft.type = q('.recipe-type-v183', modal).value;
            draft.servings = q('.recipe-servings-v183', modal).value;
            draft.temperature = q('.recipe-temp-v183', modal).value;
            draft.rating = Number(q('.recipe-rating-v183', modal).value) || 3;
            draft.notes = q('.recipe-notes-v183', modal).value;
        };

        function nearestIngredientIndex(clientY) {
            const rows = qa('.recipe-ingredient-edit-v183', live);
            if (!rows.length) return 0;
            let target = 0, best = Infinity;
            rows.forEach(row => {
                const rect = row.getBoundingClientRect();
                const d = Math.abs(clientY - (rect.top + rect.height / 2));
                if (d < best) { best = d; target = Number(row.dataset.indexV183) || 0; }
            });
            return target;
        }

        function nearestInstructionColumn(clientX) {
            const guides = qa('.recipe-instruction-guide-v184', live);
            if (!guides.length) return 0;
            let target = 0, best = Infinity;
            guides.forEach(guide => {
                const rect = guide.getBoundingClientRect();
                const d = Math.abs(clientX - (rect.left + rect.width / 2));
                if (d < best) { best = d; target = Number(guide.dataset.colV184) || 0; }
            });
            return target;
        }

        function bindInstructionDrag(block, step) {
            const moveHandle = q('.recipe-instruction-move-v183', block);
            const resizeHandle = q('.recipe-instruction-resize-v183', block);

            moveHandle.onpointerdown = event => {
                event.preventDefault(); event.stopPropagation();
                try { moveHandle.setPointerCapture?.(event.pointerId); } catch {}
                const originalSpan = Math.max(1, (step.rowEndV181 || 0) - (step.rowStartV181 || 0) + 1);
                block.classList.add('is-moving-v183');
                const move = ev => {
                    const editorBox = q('.recipe-editor-box-v183', modal);
                    if (editorBox) {
                        const rect = editorBox.getBoundingClientRect();
                        const edge = 72;
                        if (ev.clientY > rect.bottom - edge) editorBox.scrollTop += 18;
                        else if (ev.clientY < rect.top + edge) editorBox.scrollTop -= 18;
                    }
                    const targetRow = nearestIngredientIndex(ev.clientY);
                    const targetCol = nearestInstructionColumn(ev.clientX);
                    const maxStart = Math.max(0, draft.ingredients.length - originalSpan);
                    let nextStart = Math.max(0, Math.min(maxStart, targetRow));

                    // If the pointer lands inside another instruction in the same
                    // lane, snap to the nearest open position above/below it. This
                    // makes “drag left and place underneath” behave like stacking
                    // cards instead of letting two instructions overlap each other.
                    const laneSteps = draft.steps
                        .filter(other => other.id !== step.id && Math.max(0, Number(other.colV184) || 0) === targetCol)
                        .sort((a,b) => (a.rowStartV181 || 0) - (b.rowStartV181 || 0));
                    for (let pass = 0; pass < laneSteps.length + 1; pass += 1) {
                        const hit = laneSteps.find(other => {
                            const a0 = nextStart;
                            const a1 = nextStart + originalSpan - 1;
                            const b0 = Math.max(0, Number(other.rowStartV181) || 0);
                            const b1 = Math.max(b0, Number(other.rowEndV181) || b0);
                            return a0 <= b1 && a1 >= b0;
                        });
                        if (!hit) break;
                        const hitBlock = q(`[data-step-id-v183="${CSS.escape(String(hit.id))}"]`, live);
                        const hitRect = hitBlock?.getBoundingClientRect?.();
                        const hitStart = Math.max(0, Number(hit.rowStartV181) || 0);
                        const hitEnd = Math.max(hitStart, Number(hit.rowEndV181) || hitStart);
                        const preferBelow = hitRect ? ev.clientY >= hitRect.top + hitRect.height / 2 : targetRow >= hitStart;
                        const below = hitEnd + 1;
                        const above = hitStart - originalSpan;
                        if (preferBelow && below <= maxStart) nextStart = below;
                        else if (above >= 0) nextStart = above;
                        else if (below <= maxStart) nextStart = below;
                        else break;
                    }

                    block.style.gridColumn = String(targetCol + 2);
                    block.style.gridRow = `${nextStart + 2} / span ${originalSpan}`;
                    block.dataset.pendingStartV183 = String(nextStart);
                    block.dataset.pendingColV184 = String(targetCol);
                };
                const finish = () => {
                    window.removeEventListener('pointermove', move, true);
                    window.removeEventListener('pointerup', finish, true);
                    window.removeEventListener('pointercancel', finish, true);
                    block.classList.remove('is-moving-v183');
                    const nextStart = Number(block.dataset.pendingStartV183);
                    const nextCol = Number(block.dataset.pendingColV184);
                    if (Number.isFinite(nextStart)) {
                        step.rowStartV181 = nextStart;
                        step.rowEndV181 = Math.min(Math.max(0, draft.ingredients.length - 1), nextStart + originalSpan - 1);
                    }
                    if (Number.isFinite(nextCol)) step.colV184 = Math.max(0, Math.floor(nextCol));
                    delete block.dataset.pendingStartV183;
                    delete block.dataset.pendingColV184;
                    renderGrid();
                };
                window.addEventListener('pointermove', move, true);
                window.addEventListener('pointerup', finish, true);
                window.addEventListener('pointercancel', finish, true);
            };

            // Right-click the vertical resize handle to instantly extend this
            // instruction from its current starting row through the final ingredient.
            // This is the quick equivalent of dragging the handle all the way down.
            resizeHandle.oncontextmenu = event => {
                event.preventDefault();
                event.stopPropagation();
                if (!draft.ingredients.length) return;
                const start = Math.max(0, Number(step.rowStartV181) || 0);
                step.rowEndV181 = Math.max(start, draft.ingredients.length - 1);
                renderGrid();
            };

            resizeHandle.onpointerdown = event => {
                // Ignore secondary/right-button pointer presses. The contextmenu
                // handler above owns those so they never start a drag first.
                if (event.button !== undefined && event.button !== 0) return;
                event.preventDefault(); event.stopPropagation();
                const move = ev => {
                    const editorBox = q('.recipe-editor-box-v183', modal);
                    if (editorBox) {
                        const rect = editorBox.getBoundingClientRect();
                        const edge = 72;
                        if (ev.clientY > rect.bottom - edge) editorBox.scrollTop += 18;
                        else if (ev.clientY < rect.top + edge) editorBox.scrollTop -= 18;
                    }
                    const target = Math.max(step.rowStartV181 || 0, nearestIngredientIndex(ev.clientY));
                    block.style.gridRow = `${(step.rowStartV181 || 0) + 2} / span ${target - (step.rowStartV181 || 0) + 1}`;
                    block.dataset.pendingEndV183 = String(target);
                };
                const finish = () => {
                    window.removeEventListener('pointermove', move, true);
                    window.removeEventListener('pointerup', finish, true);
                    window.removeEventListener('pointercancel', finish, true);
                    const nextEnd = Number(block.dataset.pendingEndV183);
                    if (Number.isFinite(nextEnd)) step.rowEndV181 = nextEnd;
                    delete block.dataset.pendingEndV183;
                    renderGrid();
                };
                window.addEventListener('pointermove', move, true);
                window.addEventListener('pointerup', finish, true);
                window.addEventListener('pointercancel', finish, true);
            };
        }

        function renderGrid() {
            syncMeta();
            clamp(draft);
            const rows = Math.max(1, draft.ingredients.length);
            const cols = Math.max(1, ...draft.steps.map((step, i) => Number.isFinite(Number(step.colV184)) ? Number(step.colV184) + 1 : i + 1));
            live.innerHTML = `<div class="recipe-grid-scroll-v183"><div class="recipe-grid-v183 recipe-grid-edit-v183" style="--recipe-cols-v183:${cols};--recipe-rows-v183:${rows}">
                <div class="recipe-corner-v183">Ingredients</div>
                ${Array.from({length:cols},(_,i)=>`<div class="recipe-instruction-guide-v184" data-col-v184="${i}" style="grid-column:${i+2};grid-row:1"><span>Instruction lane</span></div>`).join('')}
                ${draft.ingredients.map((ing,i)=>`<div class="recipe-ingredient-edit-v183" data-index-v183="${i}" style="grid-column:1;grid-row:${i+2}"><input type="text" value="${attr(ing.text)}" placeholder="Ingredient"><button type="button" class="recipe-delete-ingredient-v183" title="Delete ingredient"><i class="ph ph-x"></i></button></div>`).join('') || `<div class="recipe-empty-ingredients-v183" style="grid-column:1;grid-row:2">Add ingredients</div>`}
                ${draft.steps.map((step,i)=>{const start=step.rowStartV181||0,end=Math.max(start,step.rowEndV181||start),col=Math.max(0,Number.isFinite(Number(step.colV184))?Number(step.colV184):i);return `<div class="recipe-instruction-edit-v183 recipe-instruction-card-v184" data-step-id-v183="${attr(step.id)}" style="grid-column:${col+2};grid-row:${start+2} / span ${end-start+1}"><div class="recipe-instruction-card-top-v184"><button type="button" class="recipe-instruction-move-v183" title="Drag up, down, left, or right"><i class="ph ph-arrows-out-cardinal"></i></button><input type="text" class="recipe-instruction-title-v183" value="${attr(step.title)}" placeholder="Instruction"><button type="button" class="recipe-delete-instruction-v183" title="Delete instruction"><i class="ph ph-x"></i></button></div><textarea placeholder="Type instruction…">${esc(step.text)}</textarea><button type="button" class="recipe-instruction-resize-v183" title="Drag to cover more ingredient rows · Right-click to extend to the end"><i class="ph ph-arrows-down-up"></i></button></div>`}).join('')}
            </div></div>`;

            qa('.recipe-ingredient-edit-v183', live).forEach(row => {
                const i = Number(row.dataset.indexV183);
                q('input', row).oninput = e => { draft.ingredients[i].text = e.target.value; };
                q('.recipe-delete-ingredient-v183', row).onclick = () => {
                    draft.ingredients.splice(i,1);
                    clamp(draft);
                    renderGrid();
                };
            });

            qa('.recipe-instruction-edit-v183', live).forEach(block => {
                const step = draft.steps.find(s => s.id === block.dataset.stepIdV183);
                if (!step) return;
                q('.recipe-instruction-title-v183', block).oninput = e => { step.title = e.target.value; };
                q('.recipe-delete-instruction-v183', block).onclick = () => { draft.steps = draft.steps.filter(s => s.id !== step.id); renderGrid(); };
                q('textarea', block).oninput = e => { step.text = e.target.value; };
                bindInstructionDrag(block, step);
            });
        }

        q('.recipe-add-ingredient-v183', modal).onclick = () => {
            draft.ingredients.push({ id: makeId('ing'), text:'' });
            clamp(draft);
            renderGrid();
            requestAnimationFrame(() => qa('.recipe-ingredient-edit-v183 input', live).at(-1)?.focus());
        };
        q('.recipe-add-instruction-v183', modal).onclick = () => {
            if (!draft.ingredients.length) draft.ingredients.push({ id: makeId('ing'), text:'' });
            const nextCol = draft.steps.length ? Math.max(...draft.steps.map((step, i) => Number.isFinite(Number(step.colV184)) ? Number(step.colV184) : i)) + 1 : 0;
            draft.steps.push({ id: makeId('instruction'), title:'', text:'', rowStartV181:0, rowEndV181:0, colV184:nextCol });
            renderGrid();
            requestAnimationFrame(() => qa('.recipe-instruction-title-v183', live).at(-1)?.focus());
        };

        const file = q('.recipe-cover-file-v183', modal);
        const preview = q('.recipe-cover-preview-v184', modal);
        const renderCoverPreviewV184 = () => {
            if (preview) {
                preview.innerHTML = draft.coverImage ? `<img src="${attr(draft.coverImage)}" alt="">` : '<i class="ph ph-image"></i>';
                preview.classList.toggle('has-image-v185', !!draft.coverImage);
            }
        };
        if (preview) {
            preview.onclick = () => { file.value=''; file.click(); };
            preview.oncontextmenu = event => {
                event.preventDefault();
                event.stopPropagation();
                if (!draft.coverImage) return;
                draft.coverImage = '';
                renderCoverPreviewV184();
            };
        }
        renderCoverPreviewV184();
        file.onchange = async () => { const f=file.files?.[0]; if(!f)return; draft.coverImage=await fileToData(f); renderCoverPreviewV184(); };

        try { modal._recipeSignalV183?.abort(); } catch {}
        modal._recipeSignalV183 = new AbortController();
        const signal = modal._recipeSignalV183.signal;
        qa('.recipe-meta-v183 input,.recipe-meta-v183 select,.recipe-notes-v183', modal).forEach(el => el.addEventListener(el.tagName==='SELECT'?'change':'input', syncMeta, { signal }));

        q('.recipe-save-v183', modal).onclick = () => {
            syncMeta();
            draft.name = draft.name.trim() || 'Recipe';
            draft.type = draft.type.trim();
            draft.servings = draft.servings.trim();
            draft.temperature = draft.temperature.trim();
            draft.notes = draft.notes.trim();
            draft.ingredients = draft.ingredients.filter(x => String(x.text || '').trim());
            draft.steps = draft.steps.filter(x => String(x.title || '').trim() || String(x.text || '').trim());
            clamp(draft);
            component.items = Array.isArray(component.items) ? component.items : [];
            const idx = component.items.findIndex(x => x.id === source?.id);
            if (idx >= 0 && !isNew) component.items[idx] = draft;
            else component.items.push(draft);
            saveDb();
            modal.classList.add('hidden');
            renderCustomTabView(tabId);
        };

        renderGrid();
        modal.classList.remove('hidden');
        requestAnimationFrame(() => q('.recipe-name-v183', modal)?.focus());
    }

    function renderTracker(tab, component, content) {
        component.items = Array.isArray(component.items) ? component.items : [];
        component.items.forEach(normalize);
        content.innerHTML = `${learningSectionHeader(component,'add-recipe','Add recipe')}<div class="learning-recipe-grid recipe-list-cards-v183"></div>`;
        const grid = q('.recipe-list-cards-v183', content);
        const tabId = typeof tab === 'string' ? tab : tab?.id;
        component.items.forEach(item => {
            const card = document.createElement('article');
            card.className = 'learning-recipe-card recipe-card-v183 custom-searchable-item custom-content-editable';
            card.dataset.customItemId = item.id;
            card.dataset.searchText = [item.name,item.type,item.notes,...item.ingredients.map(x=>x.text),...item.steps.map(x=>`${x.title} ${x.text}`)].join(' ').toLowerCase();
            card.innerHTML = `<div class="recipe-card-image-v184 ${item.coverImage?'':'is-empty-v184'}">${item.coverImage?`<img src="${attr(item.coverImage)}" alt="">`:'<i class="ph ph-cooking-pot"></i>'}</div><div class="recipe-card-title-v183"><strong>${esc(item.name)}</strong>${item.type?`<span>${esc(item.type)}</span>`:''}${item.rating?`<small>${'★'.repeat(Math.max(1,Math.min(5,Number(item.rating)||3)))}</small>`:''}</div>`;
            card.onclick = e => { if (e.target.closest('button,input,textarea,select,a')) return; openView(item); };
            card.oncontextmenu = e => {
                e.preventDefault(); e.stopPropagation();
                showCustomItemContextMenu(e.clientX,e.clientY,[
                    { label:'Edit recipe', icon:'ph-pencil-simple', action:()=>openEditor(tab,component,item,false) },
                    { label:'Delete recipe', icon:'ph-trash', danger:true, action:async()=>{ const ok=await showAppConfirm({title:'Delete Recipe',message:`Delete “${item.name}”?`,confirmLabel:'Delete'}); if(!ok)return; component.items=component.items.filter(x=>x.id!==item.id); saveDb(); renderCustomTabView(tabId); } }
                ]);
            };
            grid.appendChild(card);
        });
        const add = q('.add-recipe', content);
        if (add) add.onclick = e => { e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation(); openEditor(tab, component, {id:makeId('recipe'),name:'',rating:3,ingredients:[],steps:[]}, true); };
    }

    try { renderRecipeTracker = renderTracker; } catch {}
    window.renderRecipeTracker = renderTracker;
    window.__loggyRecipeV183 = { openEditor, openView, render:renderTracker, normalize };
})();


// ============================================================
// V184 — Fast navigation / Theme Settings open path
// Heavy hidden galleries are no longer rebuilt before the modal can paint.
// Custom tabs reuse their already-rendered DOM when nothing changed.
// ============================================================
(() => {
    'use strict';
    if (window.__loggyPerformanceV184) return;
    window.__loggyPerformanceV184 = true;
    const q = (s,r=document) => r?.querySelector?.(s) || null;
    let dataVersionV184 = 1;
    try {
        const saveBeforeV184 = saveDb;
        saveDb = function() {
            dataVersionV184 += 1;
            return saveBeforeV184.apply(this, arguments);
        };
    } catch {}

    // Keep a tiny render marker on custom views. Any real render refreshes the
    // marker, while simple tab-to-tab navigation can reuse the existing DOM.
    try {
        const renderBeforeV184 = renderCustomTabView;
        renderCustomTabView = function(tabId) {
            const result = renderBeforeV184.apply(this, arguments);
            const view = document.getElementById(`custom-tab-view-${tabId}`);
            if (view) view.dataset.renderVersionV184 = String(dataVersionV184);
            return result;
        };

        openCustomTab = function(tabId) {
            const tab = getCustomTab(tabId);
            const view = document.getElementById(`custom-tab-view-${tabId}`);
            if (!tab || !view) return;
            activeCustomTabId = tabId;
            const wasEditing = !!view.querySelector('.custom-tab-canvas.is-editing');
            customTabEditMode = false;
            if (view.dataset.renderVersionV184 !== String(dataVersionV184) || wasEditing) renderCustomTabView(tabId);
            switchView(view);
            requestAnimationFrame(() => {
                const scrollRegion = document.getElementById('side-nav-log-scroll');
                const navButton = document.querySelector(`.custom-tab-nav-btn[data-custom-tab-id="${CSS.escape(String(tabId))}"]`);
                if (scrollRegion?.classList.contains('is-scrollable') && navButton) navButton.scrollIntoView({ block:'nearest', behavior:'auto' });
            });
        };
    } catch {}

    // Built-in side-nav pages switch immediately, then refresh their heavier
    // content on the next frame. Cached content is reused until data changes.
    try {
        const builtIn = {
            'open-daily-logs-nav-btn': { view: () => gridView, render: () => initGrid(), always:false },
            'open-tools-btn': { view: () => toolboxView, render: () => renderToolbox(), always:false },
            'open-phrases-btn': { view: () => phrasesLibraryView, render: () => renderPhrasesLibrary(), always:false },
            'open-quizzes-btn': { view: () => quizzesView, render: () => updateQuizUI(), always:true }
        };
        window.addEventListener('click', event => {
            const button = event.target?.closest?.('.side-nav .icon-btn');
            const config = button && builtIn[button.id];
            if (!config) return;
            event.preventDefault();
            event.stopPropagation();
            event.stopImmediatePropagation();
            activeCustomTabId = null;
            customTabEditMode = false;
            const view = config.view();
            switchView(view);
            const stale = config.always || view?.dataset?.renderVersionV184 !== String(dataVersionV184);
            if (!stale) return;
            const runRenderV643 = () => {
                try { config.render(); } finally { if (view) view.dataset.renderVersionV184 = String(dataVersionV184); }
            };
            // V643: KB can contain hundreds/thousands of cards. Let the newly
            // selected KB view paint and become scrollable/clickable BEFORE any
            // stale card rebuild starts. Reopening an unchanged KB uses the
            // existing DOM immediately and does no render work at all.
            if (button.id === 'open-phrases-btn') {
                requestAnimationFrame(() => setTimeout(runRenderV643, 0));
            } else {
                requestAnimationFrame(runRenderV643);
            }
        }, true);
    } catch {}

    // Fast Theme Settings: reveal the existing modal immediately. Build only
    // galleries that are actually missing, and defer cross-source resync work.
    try {
        openGlobalThemeSettings = function() {
            const modal = dailySettingsModal || document.getElementById('daily-settings-modal');
            if (!modal) return;
            try { hideDailyOnlyControlsFromGlobalSettings?.(); } catch {}
            try { ensureGlobalShortcutsSection?.(); ensureGlobalUtilitiesSection?.(); } catch {}
            const title = modal.querySelector('.modal-header h2');
            if (title) title.textContent = 'Settings';
            const current = db.settings?.theme || 'default';
            if (dailyThemeSelect) dailyThemeSelect.value = current;
            themePickerSelected = current;
            if (themeSearchInput) {
                themeSearchInput.value = '';
                themeSearchInput.dataset.previousThemeSearchValue = '';
            }

            modal.classList.remove('hidden');

            // The built-in picker is normally already present. Avoid throwing
            // it away and recreating every card on each Shift+W.
            if (themePicker && !themePicker.querySelector('.theme-picker-card')) {
                try { renderThemePicker(); } catch {}
            } else {
                try { updateThemePickerSelection?.(); filterThemePicker?.(''); } catch {}
            }
            const companionHost = document.getElementById('companion-picker');
            const cursorHost = document.getElementById('cursor-picker');
            if (companionHost && !companionHost.children.length) { try { renderCompanionPicker(); } catch {} }
            if (cursorHost && !cursorHost.children.length) { try { renderCursorPicker(); } catch {} }

            [themePicker, companionHost, cursorHost].forEach(element => {
                if (!element) return;
                element.closest('.modal-section')?.classList.remove('hidden','global-settings-daily-only-hidden');
                element.style.display = '';
            });

            requestAnimationFrame(() => {
                try { ensureThemeSearchPlusV161?.(); ensureThemeAiEntryV161?.(); fixShortcutV161?.(); } catch {}
                try { removeThemeAiBoxesV162?.(); } catch {}
                themeSearchInput?.focus?.({ preventScroll:true });
                const card = themePicker?.querySelector(`.theme-picker-card[data-theme="${CSS.escape(current)}"]`);
                card?.scrollIntoView?.({ block:'nearest', behavior:'auto' });
            });

            // The modal is already visible, so warm the blank Theme Builder
            // shortly after the first paint. This makes the + / Create Theme path
            // much faster without competing with initial log-page startup.
            requestAnimationFrame(() => setTimeout(() => {
                try { window.__loggyPrepareBlankThemeV175?.(); } catch {}
            }, 110));

            const resync = () => {
                try { syncSharedThemesIntoLogV40?.(); syncThemeCopyOptionsV30?.(); } catch {}
            };
            if ('requestIdleCallback' in window) requestIdleCallback(resync, { timeout:1500 });
            else setTimeout(resync, 450);
        };
    } catch {}
})();

// ============================================================
// V189 — TAB CONTEXT CLEANUP / DAILY GEAR / THEME BUILDER LAYER
// ============================================================
(() => {
    'use strict';
    if (window.__loggyV189) return;
    window.__loggyV189 = true;

    const BUILDER_Z_V189 = 2147483000;
    const SETTINGS_Z_V189 = 2147480000;

    function ensureDailySettingsGearV189(root = document) {
        if (!root?.querySelector) return;
        const selectors = [
            '#open-daily-settings-btn',
            '[data-preview-original-id="open-daily-settings-btn"]'
        ];
        const buttons = [];
        for (const selector of selectors) {
            if (root.matches?.(selector)) buttons.push(root);
            const found = root.querySelector?.(selector);
            if (found && !buttons.includes(found)) buttons.push(found);
        }

        buttons.forEach(button => {
            const settingsIcon = button.querySelector(':scope > i.ph-sliders-horizontal');
            if (!settingsIcon || button.children.length !== 1) {
                button.replaceChildren();
                const icon = document.createElement('i');
                icon.className = 'ph ph-sliders-horizontal';
                icon.setAttribute('aria-hidden', 'true');
                button.appendChild(icon);
            }
            button.setAttribute('aria-label', 'Daily View Settings');
            button.title = 'Daily View Settings';
        });
    }

    ensureDailySettingsGearV189(document);

    // Every rebuilt actual-page preview gets the exact same settings glyph as
    // the live Daily Logs page. This runs after the clone is created, so the
    // preview never depends on stale SVG markup from an older template version.
    try {
        const rebuildPreviewBeforeV189 = rebuildActualThemeBuilderPreviewV5;
        rebuildActualThemeBuilderPreviewV5 = function () {
            const result = rebuildPreviewBeforeV189.apply(this, arguments);
            const modal = arguments[0] || document.getElementById('theme-builder-modal');
            ensureDailySettingsGearV189(modal || document);
            return result;
        };
    } catch {}

    // V222: right-clicking a custom tab icon exposes exactly one action:
    // delete/move the tab to Trash. Tab Settings remains available elsewhere,
    // but never appears in this context menu.
    document.addEventListener('contextmenu', event => {
        const button = event.target?.closest?.('.custom-tab-nav-btn[data-custom-tab-id]');
        if (!button) return;
        const tabId = String(button.dataset.customTabId || '');
        if (!tabId) return;

        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();

        const tabForMenuV249 = typeof getCustomTab === 'function' ? getCustomTab(tabId) : null;
        const specialTabV249 = !!tabForMenuV249 && (
            tabForMenuV249.templateIdV53 === 'whiteboard-v197' ||
            tabForMenuV249.templateIdV53 === 'notepad-v249' ||
            (Array.isArray(tabForMenuV249.components) && tabForMenuV249.components.some(component => component?.type === 'miroWhiteboardV197' || component?.type === 'fullNotepadV249'))
        );
        const menuItemsV249 = [];
        if (specialTabV249 && typeof openCustomTabSettingsModal === 'function') {
            menuItemsV249.push({ label:'Tab Settings', icon:'ph-sliders-horizontal', action:() => openCustomTabSettingsModal(tabId) });
        }
        menuItemsV249.push({
            label: 'Delete tab',
            icon: 'ph-trash',
            danger: true,
            action: async () => {
                const tab = typeof getCustomTab === 'function' ? getCustomTab(tabId) : null;
                const confirmed = typeof showAppConfirm === 'function'
                    ? await showAppConfirm({
                        title: 'Move this tab to Trash?',
                        message: tab?.name
                            ? `“${tab.name}” and everything inside it can be restored later from Trash.`
                            : 'This tab and everything inside it can be restored later from Trash.',
                        confirmLabel: 'Move to Trash'
                    })
                    : false;
                if (!confirmed) return;
                if (typeof moveCustomTabToTrash === 'function') moveCustomTabToTrash(tabId);
                try { saveDb(); } catch {}
                document.getElementById(`custom-tab-view-${tabId}`)?.remove();
                try { renderCustomTabNavigation(); } catch {}
                try { activeCustomTabId = null; } catch {}
                try { customTabEditMode = false; } catch {}
                try { switchView(gridView); } catch {}
            }
        });
        showCustomItemContextMenu(event.clientX, event.clientY, menuItemsV249);
    }, true);

    function dailyThemeSettingsModalV189() {
        return document.getElementById('daily-settings-modal');
    }

    function restoreThemeSettingsUnderlayV189() {
        const settings = dailyThemeSettingsModalV189();
        if (!settings) return;
        settings.classList.remove('theme-settings-under-builder-v189');
        settings.style.removeProperty('z-index');
        settings.style.removeProperty('pointer-events');
    }

    function enforceThemeBuilderLayerV189(modal = document.getElementById('theme-builder-modal')) {
        if (!modal) return null;

        // The builder must live directly under body so no transformed/stacking
        // parent can trap it beneath Theme Settings.
        if (modal.parentElement !== document.body || modal !== document.body.lastElementChild) {
            document.body.appendChild(modal);
        }

        const isOpen = !modal.classList.contains('hidden');
        if (!isOpen) {
            restoreThemeSettingsUnderlayV189();
            return modal;
        }

        try { modal.inert = false; } catch {}
        modal.removeAttribute('inert');
        modal.style.setProperty('position', 'fixed', 'important');
        modal.style.setProperty('inset', '0', 'important');
        modal.style.setProperty('z-index', String(BUILDER_Z_V189), 'important');
        modal.style.setProperty('pointer-events', 'auto', 'important');
        modal.style.setProperty('visibility', 'visible', 'important');
        modal.style.setProperty('opacity', '1', 'important');

        const box = modal.querySelector(':scope > .modal-box, .theme-builder-box-v4, .theme-builder-box-expanded, .theme-builder-box');
        if (box) {
            box.style.setProperty('position', 'relative', 'important');
            box.style.setProperty('z-index', String(BUILDER_Z_V189 + 1), 'important');
            box.style.setProperty('pointer-events', 'auto', 'important');
        }

        const settings = dailyThemeSettingsModalV189();
        if (settings && !settings.classList.contains('hidden')) {
            settings.classList.add('theme-settings-under-builder-v189');
            settings.style.setProperty('z-index', String(SETTINGS_Z_V189), 'important');
            settings.style.setProperty('pointer-events', 'none', 'important');
        }

        // V195: do not walk/rewrite every button/input/label in this very large
        // modal. CSS already makes Builder controls interactive. Rewriting the
        // entire subtree on every open/pointer event was a major source of lag.
        if (box) {
            try { box.inert = false; } catch {}
            box.removeAttribute?.('inert');
        }
        ensureDailySettingsGearV189(modal);
        return modal;
    }

    function installThemeBuilderLayerObserverV189(modal) {
        if (!modal || modal.dataset.layerObserverV189 === '1') return;
        modal.dataset.layerObserverV189 = '1';
        const observer = new MutationObserver(records => {
            if (!records.some(record => record.attributeName === 'class')) return;
            queueMicrotask(() => enforceThemeBuilderLayerV189(modal));
        });
        observer.observe(modal, { attributes: true, attributeFilter: ['class'] });
        modal._themeBuilderLayerObserverV189 = observer;
    }

    function activateThemeBuilderV189() {
        const modal = document.getElementById('theme-builder-modal');
        if (!modal) return null;
        installThemeBuilderLayerObserverV189(modal);
        return enforceThemeBuilderLayerV189(modal);
    }

    // Catch every current entry point. Sync openers are repaired immediately;
    // async edit openers are repaired both immediately (if already revealed)
    // and again after their theme data has finished loading.
    try {
        const ensureBeforeV189 = ensureThemeBuilderModal;
        ensureThemeBuilderModal = function () {
            const modal = ensureBeforeV189.apply(this, arguments);
            installThemeBuilderLayerObserverV189(modal);
            ensureDailySettingsGearV189(modal || document);
            return modal;
        };
    } catch {}

    try {
        const openBuilderBeforeV189 = openThemeBuilder;
        openThemeBuilder = function () {
            const result = openBuilderBeforeV189.apply(this, arguments);
            activateThemeBuilderV189();
            requestAnimationFrame(activateThemeBuilderV189);
            return result;
        };
    } catch {}

    try {
        const openNewBeforeV189 = openNewThemeBuilderCleanV34;
        openNewThemeBuilderCleanV34 = function () {
            const result = openNewBeforeV189.apply(this, arguments);
            activateThemeBuilderV189();
            queueMicrotask(activateThemeBuilderV189);
            requestAnimationFrame(activateThemeBuilderV189);
            return result;
        };
        try { openNewCustomThemeFromPickerV7 = openNewThemeBuilderCleanV34; } catch {}
    } catch {}

    try {
        const openExistingBeforeV189 = openExistingCustomThemeFromPickerV7;
        openExistingCustomThemeFromPickerV7 = function () {
            const result = openExistingBeforeV189.apply(this, arguments);
            activateThemeBuilderV189();
            requestAnimationFrame(activateThemeBuilderV189);
            return result;
        };
    } catch {}

    try {
        const openAnyBeforeV189 = openAnyThemeInBuilderV25;
        openAnyThemeInBuilderV25 = async function () {
            const pending = openAnyBeforeV189.apply(this, arguments);
            activateThemeBuilderV189();
            const result = await pending;
            activateThemeBuilderV189();
            requestAnimationFrame(activateThemeBuilderV189);
            return result;
        };
    } catch {}

    try {
        const openCopyBeforeV189 = openThemeCopyInBuilderV30;
        openThemeCopyInBuilderV30 = async function () {
            const pending = openCopyBeforeV189.apply(this, arguments);
            activateThemeBuilderV189();
            const result = await pending;
            activateThemeBuilderV189();
            requestAnimationFrame(activateThemeBuilderV189);
            return result;
        };
    } catch {}

    // The current + Theme button has several historical delegated handlers.
    // Whichever one wins still calls one of the wrapped openers above; this
    // extra next-frame sync guarantees the visible builder is on top.
    document.addEventListener('click', event => {
        if (!event.target?.closest?.('.theme-search-create-v161,.theme-picker-create-card,[data-create-theme-v171]')) return;
        queueMicrotask(activateThemeBuilderV189);
        requestAnimationFrame(activateThemeBuilderV189);
    }, true);

    // Same protection for Edit Theme actions invoked from the context menu.
    document.addEventListener('click', event => {
        const menu = event.target?.closest?.('.custom-item-context-menu,.context-menu');
        if (!menu) return;
        const text = String(event.target?.closest?.('button')?.textContent || '').trim().toLowerCase();
        if (!text.includes('edit theme')) return;
        queueMicrotask(activateThemeBuilderV189);
        requestAnimationFrame(activateThemeBuilderV189);
    }, true);

    // Restore Theme Settings interaction the instant Builder closes.
    document.addEventListener('click', event => {
        if (!event.target?.closest?.('#theme-builder-modal .theme-builder-close')) return;
        queueMicrotask(restoreThemeSettingsUnderlayV189);
        requestAnimationFrame(restoreThemeSettingsUnderlayV189);
    }, true);

    // Initial/prewarmed modal setup.
    const initial = document.getElementById('theme-builder-modal');
    if (initial) {
        installThemeBuilderLayerObserverV189(initial);
        enforceThemeBuilderLayerV189(initial);
    }
})();

// ============================================================
// V191 — AUTHORITATIVE THEME BUILDER MODAL COORDINATOR
// Guarantees + Theme / Edit Theme always open above Theme Settings and that
// the settings underlay can never intercept Builder input, even when older
// capture-phase handlers bypass the normal Theme Builder opener wrappers.
// ============================================================
(() => {
    'use strict';
    if (window.__loggyThemeBuilderModalV191) return;
    window.__loggyThemeBuilderModalV191 = true;

    const BUILDER_Z_V191 = 2147483000;
    const SETTINGS_Z_V191 = 2147479000;
    let boundBuilderV191 = null;
    let builderClassObserverV191 = null;
    let settingsClassObserverV191 = null;
    let bodyChildObserverV191 = null;

    function settingsModalV191() {
        return document.getElementById('daily-settings-modal');
    }

    function builderIsOpenV191(modal = document.getElementById('theme-builder-modal')) {
        return !!modal && !modal.classList.contains('hidden');
    }

    function suspendThemeSettingsV191() {
        const settings = settingsModalV191();
        if (!settings || settings.classList.contains('hidden')) return;

        if (!settings.dataset.v191StateCaptured) {
            settings.dataset.v191StateCaptured = '1';
            settings.dataset.v191HadInert = settings.hasAttribute('inert') ? '1' : '0';
            settings.dataset.v191AriaHidden = settings.hasAttribute('aria-hidden')
                ? String(settings.getAttribute('aria-hidden'))
                : '__missing__';
        }

        if (!settings.classList.contains('theme-settings-under-builder-v189') || !settings.classList.contains('theme-settings-under-builder-v191')) { settings.classList.add('theme-settings-under-builder-v189', 'theme-settings-under-builder-v191'); }
        try { settings.inert = true; } catch {}
        settings.setAttribute('inert', '');
        settings.setAttribute('aria-hidden', 'true');
        settings.style.setProperty('z-index', String(SETTINGS_Z_V191), 'important');
        settings.style.setProperty('pointer-events', 'none', 'important');
    }

    function restoreThemeSettingsV191() {
        const settings = settingsModalV191();
        if (!settings) return;

        if (settings.classList.contains('theme-settings-under-builder-v189') || settings.classList.contains('theme-settings-under-builder-v191')) { settings.classList.remove('theme-settings-under-builder-v189', 'theme-settings-under-builder-v191'); }
        settings.style.removeProperty('z-index');
        settings.style.removeProperty('pointer-events');

        if (settings.dataset.v191StateCaptured === '1') {
            if (settings.dataset.v191HadInert !== '1') {
                try { settings.inert = false; } catch {}
                settings.removeAttribute('inert');
            }
            const previousAria = settings.dataset.v191AriaHidden;
            if (previousAria === '__missing__') settings.removeAttribute('aria-hidden');
            else if (previousAria != null) settings.setAttribute('aria-hidden', previousAria);

            delete settings.dataset.v191StateCaptured;
            delete settings.dataset.v191HadInert;
            delete settings.dataset.v191AriaHidden;
        }
    }

    function forceBuilderInteractiveV191(modal) {
        if (!modal) return;

        // Older V189 installs a second class observer on each rebuilt Builder.
        // It is no longer needed once this coordinator owns the modal lifecycle.
        try { modal._themeBuilderLayerObserverV189?.disconnect?.(); } catch {}
        modal._themeBuilderLayerObserverV189 = null;
        modal.dataset.layerObserverV189 = '1';

        if (modal.parentElement !== document.body || modal !== document.body.lastElementChild) {
            document.body.appendChild(modal);
        }

        try { modal.inert = false; } catch {}
        modal.removeAttribute('inert');
        modal.removeAttribute('aria-hidden');
        if (!modal.classList.contains('theme-builder-front-v191')) modal.classList.add('theme-builder-front-v191');
        modal.style.setProperty('position', 'fixed', 'important');
        modal.style.setProperty('inset', '0', 'important');
        modal.style.setProperty('z-index', String(BUILDER_Z_V191), 'important');
        modal.style.setProperty('pointer-events', 'auto', 'important');
        modal.style.setProperty('visibility', 'visible', 'important');
        modal.style.setProperty('opacity', '1', 'important');

        const box = modal.querySelector(':scope > .modal-box');
        if (box) {
            box.style.setProperty('position', 'relative', 'important');
            box.style.setProperty('z-index', '1', 'important');
            box.style.setProperty('pointer-events', 'auto', 'important');
        }

        // V195: all normal Builder controls are already covered by the CSS
        // pointer-events rules. Avoid a querySelectorAll + inline-style write
        // across hundreds/thousands of controls every time the Builder opens or
        // receives a pointer event.
        if (!document.body.classList.contains('theme-builder-modal-open-v191')) document.body.classList.add('theme-builder-modal-open-v191');
        suspendThemeSettingsV191();
    }

    function releaseBuilderV191(modal) {
        if (modal) {
            if (modal.classList.contains('theme-builder-front-v191')) modal.classList.remove('theme-builder-front-v191');

            // V189 left !important inline open-state styles behind after close.
            // Those inline values outrank the prewarmed .hidden rules and can
            // leave an invisible/visible Builder click shield in the page.
            // Strip every layer-only inline value when the Builder closes so
            // the normal hidden/prewarm CSS becomes authoritative again.
            ['position','inset','z-index','pointer-events','visibility','opacity'].forEach(prop => {
                modal.style.removeProperty(prop);
            });

            const box = modal.querySelector(':scope > .modal-box');
            if (box) {
                box.style.removeProperty('z-index');
                box.style.removeProperty('pointer-events');
            }

            // V195: no descendant pointer-events styles are written during open,
            // so there is nothing to scrub across the entire Builder subtree here.
            if (modal.classList.contains('hidden')) {
                try { modal.inert = true; } catch {}
                modal.setAttribute('inert', '');
            }
        }
        if (document.body.classList.contains('theme-builder-modal-open-v191')) document.body.classList.remove('theme-builder-modal-open-v191');
        restoreThemeSettingsV191();
    }

    function syncBuilderV191(modal = document.getElementById('theme-builder-modal')) {
        if (!modal) {
            releaseBuilderV191(null);
            return;
        }
        if (builderIsOpenV191(modal)) forceBuilderInteractiveV191(modal);
        else releaseBuilderV191(modal);
    }

    function bindSettingsObserverV191() {
        const settings = settingsModalV191();
        if (!settings || settings.dataset.v191SettingsObserved === '1') return;
        settings.dataset.v191SettingsObserved = '1';
        settingsClassObserverV191?.disconnect?.();
        settingsClassObserverV191 = new MutationObserver(records => {
            if (!records.some(record => record.attributeName === 'class')) return;
            const builder = document.getElementById('theme-builder-modal');
            if (builderIsOpenV191(builder)) queueMicrotask(suspendThemeSettingsV191);
        });
        settingsClassObserverV191.observe(settings, { attributes:true, attributeFilter:['class'] });
    }

    function bindBuilderV191(modal = document.getElementById('theme-builder-modal')) {
        if (!modal) return;
        if (boundBuilderV191 === modal && modal.dataset.v191BuilderObserved === '1') {
            syncBuilderV191(modal);
            return;
        }

        builderClassObserverV191?.disconnect?.();
        boundBuilderV191 = modal;
        modal.dataset.v191BuilderObserved = '1';

        // Disconnect the failed V189 modal-layer observer on every newly-built
        // modal. V93's preview click-shield guard remains intact.
        try { modal._themeBuilderLayerObserverV189?.disconnect?.(); } catch {}
        modal._themeBuilderLayerObserverV189 = null;
        modal.dataset.layerObserverV189 = '1';

        builderClassObserverV191 = new MutationObserver(records => {
            if (!records.some(record => record.attributeName === 'class')) return;
            queueMicrotask(() => syncBuilderV191(modal));
        });
        builderClassObserverV191.observe(modal, { attributes:true, attributeFilter:['class'] });
        syncBuilderV191(modal);
    }

    // + Theme has an older WINDOW capture handler that calls its private blank
    // opener and stopImmediatePropagation(), so later click listeners never see
    // that click. Watching only direct body children catches that exact path,
    // plus every ensureThemeBuilderModal() rebuild, without a document-wide
    // subtree observer.
    function bindBodyObserverV191() {
        if (!document.body || bodyChildObserverV191) return;
        bodyChildObserverV191 = new MutationObserver(records => {
            let builderChanged = false;
            for (const record of records) {
                if (record.type !== 'childList') continue;
                if (Array.from(record.addedNodes || []).some(node =>
                    node?.nodeType === 1 && (node.id === 'theme-builder-modal' || node.querySelector?.('#theme-builder-modal'))
                )) builderChanged = true;
                if (Array.from(record.removedNodes || []).some(node =>
                    node === boundBuilderV191 || node?.id === 'theme-builder-modal'
                )) builderChanged = true;
            }
            if (!builderChanged) return;
            queueMicrotask(() => bindBuilderV191(document.getElementById('theme-builder-modal')));
        });
        bodyChildObserverV191.observe(document.body, { childList:true });
    }

    function bootV191() {
        bindSettingsObserverV191();
        bindBuilderV191();
        bindBodyObserverV191();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', bootV191, { once:true });
    } else {
        bootV191();
    }

    // A final pointer/focus safety net repairs the layer before the browser
    // dispatches input if an older routine changed modal state in the same task.
    window.addEventListener('pointerdown', () => {
        const modal = document.getElementById('theme-builder-modal');
        if (!builderIsOpenV191(modal)) return;
        // Normal pointer input should be O(1). Repair only if a legacy routine
        // actually knocked the Builder out of its authoritative open state.
        const broken =
            modal.inert ||
            !modal.classList.contains('theme-builder-front-v191') ||
            modal.style.getPropertyValue('pointer-events') === 'none';
        if (broken) forceBuilderInteractiveV191(modal);
    }, true);
    window.addEventListener('focusin', () => {
        const modal = document.getElementById('theme-builder-modal');
        if (!builderIsOpenV191(modal)) return;
        const settings = settingsModalV191();
        if (settings && !settings.classList.contains('hidden') && !settings.inert) {
            suspendThemeSettingsV191();
        }
    }, true);
})();


// ============================================================
// V195 — FAST MODAL CLOSE + THEME BUILDER PERFORMANCE COORDINATOR
// ============================================================
(() => {
    'use strict';
    if (window.__loggyV195ModalPerformance) return;
    window.__loggyV195ModalPerformance = true;

    // Close the visible surface immediately on pointer-down so the next paint is
    // never held up by modal-specific cleanup. If a real close control exists,
    // trigger it after one paint so its normal promises/state restoration still
    // run. Capture phase wins before older backdrop handlers.
    window.addEventListener('pointerdown', event => {
        const overlay = event.target;
        if (!(overlay instanceof HTMLElement)) return;
        if (!overlay.matches('.modal-overlay:not(.hidden), .modal:not(.hidden)')) return;
        if (!overlay.querySelector(':scope > .modal-box')) return;

        const closeButton = overlay.querySelector([
            ':scope > .modal-box > .modal-header .theme-builder-close',
            ':scope > .modal-box > .modal-header [class*="close"]',
            ':scope > .modal-box > .recipe-modal-head-v170 [class*="close"]',
            ':scope > .modal-box .modal-close',
            ':scope > .modal-box [data-modal-close]'
        ].join(','));

        // Make the backdrop disappear now. This is purely visual/state gating;
        // the normal close control still performs semantic cleanup next frame.
        overlay.classList.add('hidden');

        if (closeButton instanceof HTMLElement && !closeButton.hasAttribute('disabled')) {
            event.preventDefault();
            event.stopImmediatePropagation();
            requestAnimationFrame(() => {
                setTimeout(() => {
                    try { closeButton.click(); } catch {}
                }, 0);
            });
        }
    }, true);

    // Initial Theme Builder population used to rebuild the expensive live-page
    // preview several times through historical compatibility wrappers. Batch all
    // preview requests made during one populate() call and render exactly once on
    // the next frame. Normal edits outside population keep their existing timing.
    try {
        const previewBeforeV195 = updateThemeBuilderPreview;
        const populateBeforeV195 = populateThemeBuilder;
        let populateDepthV195 = 0;
        let pendingPreviewModalV195 = null;
        let previewRafV195 = 0;

        updateThemeBuilderPreview = function(modal) {
            if (populateDepthV195 > 0) {
                pendingPreviewModalV195 = modal || pendingPreviewModalV195;
                return;
            }
            return previewBeforeV195.apply(this, arguments);
        };

        function flushPreviewV195() {
            previewRafV195 = 0;
            const modal = pendingPreviewModalV195;
            pendingPreviewModalV195 = null;
            if (!modal?.isConnected) return;
            try { previewBeforeV195.call(window, modal); } catch (error) { console.error(error); }
        }

        populateThemeBuilder = function(modal, theme) {
            populateDepthV195 += 1;
            if (modal) modal.classList.add('theme-builder-populating-v195');
            try {
                return populateBeforeV195.apply(this, arguments);
            } finally {
                populateDepthV195 = Math.max(0, populateDepthV195 - 1);
                if (populateDepthV195 === 0) {
                    pendingPreviewModalV195 = modal || pendingPreviewModalV195;
                    if (!previewRafV195) previewRafV195 = requestAnimationFrame(flushPreviewV195);
                    requestAnimationFrame(() => modal?.classList.remove('theme-builder-populating-v195'));
                }
            }
        };
    } catch {}

    // The blank-theme prewarm is valuable, but don't let it contend with a real
    // pointer interaction. If the builder is still cold after features load,
    // prepare it only during idle time.
    const warmBuilderV195 = () => {
        const run = () => {
            try { window.__loggyPrepareBlankThemeV175?.(); } catch {}
        };
        if ('requestIdleCallback' in window) requestIdleCallback(run, { timeout: 1800 });
        else setTimeout(run, 650);
    };
    if (document.documentElement.dataset.loggyFeaturesReady === '1') warmBuilderV195();
    else window.addEventListener('loggy-features-ready', warmBuilderV195, { once:true });
})();

// ============================================================
// V196 — VISIBLE THEME BACKGROUNDS IN BUILDER PREVIEW
// Keep the fast V195 Builder, but make the *visible* live preview own the
// theme background. Historical preview markup is still present but hidden.
// ============================================================
(() => {
    'use strict';
    if (window.__loggyV196BuilderPreviewBackground) return;
    window.__loggyV196BuilderPreviewBackground = true;

    const cssUrlV196 = value => `url("${String(value || '').replace(/\\/g, '\\\\').replace(/"/g, '\\"')}")`;

    function ensureDocV196(code) {
        try {
            if (typeof ensureBackgroundDocumentV56 === 'function') return ensureBackgroundDocumentV56(code);
        } catch {}
        const text = String(code || '').trim();
        if (!text) return '';
        if (/<html[\s>]/i.test(text) || /<!doctype/i.test(text)) return text;
        return `<!doctype html><html><head><meta charset="utf-8"><style>html,body{margin:0;width:100%;height:100%;overflow:hidden}</style></head><body>${text}</body></html>`;
    }

    function syncVisiblePreviewBackgroundV196(modal) {
        if (!modal?.isConnected) return;
        const live = modal.querySelector('.theme-builder-live-canvas');
        if (!live) return;

        let draft = null;
        try { draft = getThemeBuilderDraft(modal); } catch { return; }
        if (!draft) return;

        const gradient = String(draft.backgroundGradientV56 || '').trim();
        const image = String(draft.backgroundImage || '').trim();
        const code = String(
            modal._themeInteractiveCodeV56 ?? draft.interactiveBackgroundCodeV56 ?? ''
        ).trim();
        const explicitMode = String(draft.backgroundModeV158 || modal._themeBackgroundModeV158 || '').trim();

        let imageCss = 'none';
        if (explicitMode === 'gradient' && gradient) imageCss = gradient;
        else if (explicitMode === 'image' && image) imageCss = cssUrlV196(image);
        else if (explicitMode === 'solid') imageCss = 'none';
        else if (gradient) imageCss = gradient;
        else if (image) imageCss = cssUrlV196(image);

        live.style.setProperty('background-color', String(draft.background || '#ffffff'), 'important');
        live.style.setProperty('background-image', imageCss, 'important');
        live.style.setProperty('background-size', 'cover', 'important');
        live.style.setProperty('background-position', 'center', 'important');
        live.style.setProperty('background-repeat', 'no-repeat', 'important');

        // Interactive HTML background: keep one iframe in the visible live canvas.
        let frame = live.querySelector(':scope > iframe.theme-code-preview-frame-v56');
        if (code) {
            if (!frame) {
                frame = document.createElement('iframe');
                frame.className = 'theme-code-preview-frame-v56';
                frame.setAttribute('sandbox', 'allow-scripts');
                frame.setAttribute('aria-hidden', 'true');
                live.prepend(frame);
            }
            const doc = ensureDocV196(code);
            if (frame.dataset.previewCodeV196 !== code) {
                frame.dataset.previewCodeV196 = code;
                frame.srcdoc = doc;
            }
            frame.style.display = 'block';
        } else if (frame) {
            frame.remove();
        }

        // The dashboard preview has its own surface. Keep image/gradient/solid
        // backgrounds synchronized there too; its existing V79 code-background
        // iframe continues to handle interactive dashboard code.
        modal.querySelectorAll('.theme-builder-dashboard-preview-v45,.theme-builder-dashboard-preview-v44,.theme-builder-dashboard-preview-v40')
            .forEach(dash => {
                dash.style.setProperty('background-color', String(draft.background || '#ffffff'), 'important');
                dash.style.setProperty('background-image', imageCss, 'important');
                dash.style.setProperty('background-size', 'cover', 'important');
                dash.style.setProperty('background-position', 'center', 'important');
                dash.style.setProperty('background-repeat', 'no-repeat', 'important');
            });
    }

    // Preserve every historical preview feature, then cheaply correct only the
    // visible background surface. One rAF coalesces bursts during Edit/Create.
    try {
        const beforeV196 = updateThemeBuilderPreview;
        let raf = 0;
        let pending = null;
        updateThemeBuilderPreview = function(modal) {
            const result = beforeV196.apply(this, arguments);
            pending = modal || pending;
            if (!raf) {
                raf = requestAnimationFrame(() => {
                    raf = 0;
                    const target = pending;
                    pending = null;
                    try { syncVisiblePreviewBackgroundV196(target); } catch {}
                });
            }
            return result;
        };
    } catch {}

    // Population can replace the live canvas, so resync after the batched
    // create/edit hydration has finished.
    try {
        const beforePopulateV196 = populateThemeBuilder;
        populateThemeBuilder = function(modal, theme) {
            const result = beforePopulateV196.apply(this, arguments);
            requestAnimationFrame(() => {
                try { syncVisiblePreviewBackgroundV196(modal); } catch {}
            });
            return result;
        };
    } catch {}

    // Also repair an already-open Builder if this feature chunk finishes loading
    // after its modal became visible.
    requestAnimationFrame(() => {
        const modal = document.getElementById('theme-builder-modal');
        if (modal && !modal.classList.contains('hidden')) {
            try { syncVisiblePreviewBackgroundV196(modal); } catch {}
        }
    });

    // ============================================================
    // V198 — FULL-SCREEN MULTI-BOARD WHITEBOARD TAB BLUEPRINT
    // Heavy whiteboard runtime remains lazy-loaded. Normal Daily Logs/KB
    // startup does not parse the whiteboard engine until a board is opened.
    // ============================================================
    const WHITEBOARD_TEMPLATE_ID_V198 = 'whiteboard-v197'; // keep old id for compatibility
    const WHITEBOARD_COMPONENT_TYPE_V198 = 'miroWhiteboardV197';
    let whiteboardRuntimePromiseV198 = null;
    const WHITEBOARD_ROUTE_KEY_V207 = 'loggy-whiteboard-route-v207';
    let cursorSnapshotV207 = null;

    function readWhiteboardRouteV207() {
        try { const v = JSON.parse(sessionStorage.getItem(WHITEBOARD_ROUTE_KEY_V207) || 'null'); return v && v.path === location.pathname ? v : null; } catch { return null; }
    }
    function rememberWhiteboardRouteV207(tab, boardId) {
        if (!tab) return;
        try { sessionStorage.setItem(WHITEBOARD_ROUTE_KEY_V207, JSON.stringify({ path:location.pathname, tabId:String(tab.id), boardId:String(boardId || tab.whiteboardV198?.activeBoardId || ''), theme:tab.whiteboardV198?.theme === 'dark' ? 'dark' : 'light' })); } catch {}
    }
    function clearWhiteboardRouteV207() { try { sessionStorage.removeItem(WHITEBOARD_ROUTE_KEY_V207); } catch {} }
    function setWhiteboardNativeCursorV207(active) {
        const html = document.documentElement, body = document.body;
        if (active) {
            if (!cursorSnapshotV207) cursorSnapshotV207 = {
                htmlHide:html.classList.contains('cursor-hide-native'),
                nativeTheme:html.classList.contains('cursor-native-theme-v449'),
                bodyNone:body.classList.contains('cursor-none')
            };
            html.classList.remove('cursor-hide-native','cursor-native-theme-v449'); body.classList.remove('cursor-none');
            html.style.setProperty('cursor','auto','important'); body.style.setProperty('cursor','auto','important');
        } else {
            html.style.removeProperty('cursor'); body.style.removeProperty('cursor');
            if (cursorSnapshotV207) {
                html.classList.toggle('cursor-hide-native', !!cursorSnapshotV207.htmlHide);
                html.classList.toggle('cursor-native-theme-v449', !!cursorSnapshotV207.nativeTheme);
                body.classList.toggle('cursor-none', !!cursorSnapshotV207.bodyNone);
                cursorSnapshotV207 = null;
            }
        }
    }

    function isWhiteboardTabV198(tab) {
        return !!tab && (
            tab.templateIdV53 === WHITEBOARD_TEMPLATE_ID_V198 ||
            (Array.isArray(tab.components) && tab.components.some(component => component?.type === WHITEBOARD_COMPONENT_TYPE_V198))
        );
    }

    function ensureWhiteboardBootstrapStyleV198() {
        if (document.getElementById('whiteboard-bootstrap-style-v198')) return;
        const style = document.createElement('style');
        style.id = 'whiteboard-bootstrap-style-v198';
        style.textContent = `
            html.whiteboard-tab-active-v198,body.whiteboard-tab-active-v198{overflow:hidden!important;width:100%!important;height:100%!important}
            .whiteboard-tab-view-v198,
            .whiteboard-tab-view-v198.custom-tab-view.view.active{position:fixed!important;inset:0!important;left:0!important;right:0!important;top:0!important;bottom:0!important;transform:none!important;width:100vw!important;height:100dvh!important;min-width:100vw!important;min-height:100dvh!important;max-width:none!important;max-height:none!important;margin:0!important;padding:0!important;overflow:hidden!important;z-index:2147480000!important;background:#F9F9F9!important;pointer-events:auto!important;visibility:visible!important}
            .whiteboard-runtime-host-v198{position:fixed!important;inset:0!important;width:100vw!important;height:100dvh!important;overflow:hidden!important;background:#F9F9F9!important;pointer-events:auto!important;visibility:visible!important}
            body.whiteboard-tab-active-v198>*:not(.whiteboard-tab-view-v198):not(script):not(style){visibility:hidden!important;pointer-events:none!important}
            body.whiteboard-tab-active-v198>.whiteboard-tab-view-v198{visibility:visible!important;pointer-events:auto!important;display:block!important}
            .whiteboard-runtime-loading-v198{position:fixed;inset:0;display:grid;place-items:center;font:600 14px/1.4 system-ui,sans-serif;color:#1A1A1A;background:#F9F9F9}

            .daily-whiteboard-links-v198{margin-top:18px}
            .daily-whiteboard-links-list-v198{display:grid;gap:10px;margin-top:10px}
            .daily-whiteboard-link-v198{display:flex;align-items:center;gap:10px;border:1px solid var(--border,#ddd);border-radius:12px;padding:8px;background:var(--card-bg,#fff)}
            .daily-whiteboard-link-main-v198{display:flex;align-items:center;gap:12px;min-width:0;flex:1;border:0;background:transparent;color:inherit;text-align:left;cursor:pointer}
            .daily-whiteboard-thumb-v198{width:86px;height:56px;border-radius:8px;overflow:hidden;border:1px solid rgba(0,0,0,.12);flex:0 0 auto;background:#f9f9f9}
            .daily-whiteboard-thumb-v198 svg{display:block;width:100%;height:100%}
            .daily-whiteboard-link-text-v198{min-width:0;display:flex;flex-direction:column;gap:2px}.daily-whiteboard-link-text-v198 strong{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.daily-whiteboard-link-text-v198 small{opacity:.65}
            .daily-whiteboard-unlink-v198{flex:0 0 auto}
            .daily-whiteboard-picker-v198 .modal-box{width:min(920px,calc(100vw - 36px));max-width:920px}
            .daily-whiteboard-picker-grid-v198{display:grid;grid-template-columns:repeat(auto-fill,minmax(210px,1fr));gap:14px;max-height:min(62vh,620px);overflow:auto;padding:4px}
            .daily-whiteboard-picker-card-v198{border:1px solid var(--border,#ddd);border-radius:14px;overflow:hidden;background:var(--card-bg,#fff);cursor:pointer;text-align:left;color:inherit;padding:0}
            .daily-whiteboard-picker-card-v198:hover{transform:translateY(-1px);box-shadow:0 7px 18px rgba(0,0,0,.09)}
            .daily-whiteboard-picker-card-v198 .preview{height:130px;background:#f9f9f9;border-bottom:1px solid rgba(0,0,0,.08)}
            .daily-whiteboard-picker-card-v198 .preview svg{width:100%;height:100%;display:block}.daily-whiteboard-picker-card-v198 .meta{padding:10px 11px}.daily-whiteboard-picker-card-v198 .meta strong{display:block}.daily-whiteboard-picker-card-v198 .meta small{opacity:.65}
            .daily-tab-whiteboard-board-wrap-v205{margin-top:8px}
            .daily-tab-whiteboard-board-grid-v205{display:grid;grid-template-columns:repeat(auto-fill,minmax(190px,1fr));gap:12px;max-height:min(44vh,390px);overflow:auto;overscroll-behavior:contain;padding:3px 4px 5px 1px}
            .daily-tab-whiteboard-card-v205{display:block;width:100%;padding:0!important;border:1px solid var(--border,#ddd)!important;border-radius:13px!important;background:var(--card-bg,#fff)!important;color:inherit!important;text-align:left!important;overflow:hidden;cursor:pointer;transition:transform .1s ease,box-shadow .1s ease}
            .daily-tab-whiteboard-card-v205:hover{transform:translateY(-1px);box-shadow:0 7px 18px rgba(0,0,0,.09)}
            .daily-tab-whiteboard-card-v205 .preview{height:108px;background:#f9f9f9;border-bottom:1px solid rgba(0,0,0,.08)}
            .daily-tab-whiteboard-card-v205 .preview svg{display:block;width:100%;height:100%}
            .daily-tab-whiteboard-card-v205 .meta{padding:9px 10px;display:flex;flex-direction:column;gap:2px}.daily-tab-whiteboard-card-v205 .meta strong{font-size:13px}.daily-tab-whiteboard-card-v205 .meta small{font-size:11px;opacity:.65}
            .daily-tab-whiteboard-empty-v205{padding:18px;border:1px dashed var(--border,#ddd);border-radius:12px;opacity:.7;text-align:center}
        `;
        document.head.appendChild(style);
    }

    function ensureWhiteboardRuntimeV198() {
        ensureWhiteboardBootstrapStyleV198();
        if (window.LoggyWhiteboardV198) return Promise.resolve(window.LoggyWhiteboardV198);
        if (whiteboardRuntimePromiseV198) return whiteboardRuntimePromiseV198;

        let link = document.querySelector('link[data-loggy-whiteboard-css-v198]');
        if (!link) {
            document.querySelector('link[data-loggy-whiteboard-css-v197]')?.remove();
            link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = '/template-whiteboard.css?v=523';
            link.dataset.loggyWhiteboardCssV198 = '1';
            document.head.appendChild(link);
        }

        whiteboardRuntimePromiseV198 = new Promise((resolve, reject) => {
            document.querySelector('script[data-loggy-whiteboard-js-v197]')?.remove();
            const existing = document.querySelector('script[data-loggy-whiteboard-js-v198]');
            if (existing) {
                if (window.LoggyWhiteboardV198) { resolve(window.LoggyWhiteboardV198); return; }
                existing.addEventListener('load', () => resolve(window.LoggyWhiteboardV198), { once: true });
                existing.addEventListener('error', reject, { once: true });
                return;
            }
            const script = document.createElement('script');
            script.src = '/template-whiteboard.js?v=523';
            script.async = true;
            script.dataset.loggyWhiteboardJsV198 = '1';
            script.addEventListener('load', () => resolve(window.LoggyWhiteboardV198), { once: true });
            script.addEventListener('error', reject, { once: true });
            document.head.appendChild(script);
        });
        return whiteboardRuntimePromiseV198;
    }

    function migrateTabWhiteboardStateV198(tab) {
        if (!tab) return null;
        if (tab.whiteboardV198?.version === 198 && Array.isArray(tab.whiteboardV198.boards)) {
            if (!Array.isArray(tab.whiteboardV198.folders)) tab.whiteboardV198.folders = [];
            tab.whiteboardV198.boards.forEach(board => {
                if (!Array.isArray(board.tags)) board.tags = [];
                if (typeof board.folderId !== 'string') board.folderId = '';
                if (!Array.isArray(board.images)) board.images = [];
                if (!Array.isArray(board.texts)) board.texts = [];
            });
            return tab.whiteboardV198;
        }
        const old = tab.whiteboardV197;
        const id = `board-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,7)}`;
        if (old && (Array.isArray(old.notes) || Array.isArray(old.connections))) {
            tab.whiteboardV198 = {
                version: 198,
                theme: old.theme === 'dark' ? 'dark' : 'light',
                folders: [],
                activeBoardId: id,
                boards: [{
                    id, name: 'Board 1', camera: old.camera || { x:160, y:120, zoom:.72 },
                    notes: Array.isArray(old.notes) ? old.notes : [], images:[], texts:[],
                    strokes: [], connections: Array.isArray(old.connections) ? old.connections : [], folderId:'', tags:[],
                    createdAt: Date.now(), updatedAt: Date.now()
                }]
            };
        } else {
            tab.whiteboardV198 = {
                version:198, theme:'light', activeBoardId:id, folders:[],
                boards:[{id,name:'Board 1',camera:{x:160,y:120,zoom:.72},notes:[],images:[],texts:[],strokes:[],connections:[],folderId:'',tags:[],createdAt:Date.now(),updatedAt:Date.now()}]
            };
        }
        return tab.whiteboardV198;
    }

    // Built-in blueprint registration. It remains available only through + Create Tab.
    try {
        if (Array.isArray(CUSTOM_TAB_TEMPLATES_V53) && !CUSTOM_TAB_TEMPLATES_V53.some(t => t.id === WHITEBOARD_TEMPLATE_ID_V198)) {
            CUSTOM_TAB_TEMPLATES_V53.push({
                id: WHITEBOARD_TEMPLATE_ID_V198,
                name: 'Whiteboard',
                icon: 'ph-selection-background',
                description: 'A full-screen multi-board canvas with sticky notes, movable images, text boxes, drawing, lasso, erasers, connections, and visual board previews.'
            });
        } else {
            const item = CUSTOM_TAB_TEMPLATES_V53?.find?.(t => t.id === WHITEBOARD_TEMPLATE_ID_V198);
            if (item) item.description = 'A full-screen multi-board canvas with sticky notes, movable images, text boxes, drawing, lasso, erasers, connections, and visual board previews.';
        }

        const buildBeforeWhiteboardV198 = buildPrebuiltTabComponentsV53;
        buildPrebuiltTabComponentsV53 = function(templateId) {
            if (templateId === WHITEBOARD_TEMPLATE_ID_V198) {
                return [{
                    id: typeof customId === 'function' ? customId('component') : `component-whiteboard-${Date.now()}`,
                    type: WHITEBOARD_COMPONENT_TYPE_V198,
                    title: 'Whiteboard'
                }];
            }
            return buildBeforeWhiteboardV198.apply(this, arguments);
        };

        ensureCustomTabCreateModal?.();
        const sectionV198 = document.querySelector('#custom-tab-create-modal .custom-tab-template-section-v53');
        if (sectionV198 && typeof renderPrebuiltTabCardsV53 === 'function') {
            renderPrebuiltTabCardsV53(sectionV198);
            try { renderBlueprintCardsV162(); } catch {}
        }
    } catch (error) { console.warn('Whiteboard template registration failed', error); }

    const buildCustomTabViewBeforeWhiteboardV198 = buildCustomTabView;
    buildCustomTabView = function(tab) {
        if (!isWhiteboardTabV198(tab)) return buildCustomTabViewBeforeWhiteboardV198.apply(this, arguments);
        ensureWhiteboardBootstrapStyleV198();
        const view = document.createElement('div');
        view.id = `custom-tab-view-${tab.id}`;
        view.className = 'view custom-tab-view whiteboard-tab-view-v198';
        view.dataset.customTabId = tab.id;
        view.dataset.whiteboardV198 = '1';
        view.innerHTML = '<div class="whiteboard-runtime-host-v198"><div class="whiteboard-runtime-loading-v198">Opening whiteboard…</div></div>';
        return view;
    };

    async function uploadWhiteboardImageV251(tab, boardId, file) {
        const query = new URLSearchParams({
            tabId:String(tab?.id || 'whiteboard'),
            boardId:String(boardId || 'board'),
            mime:String(file?.type || 'application/octet-stream'),
            fileName:String(file?.name || 'image')
        });
        const response = await fetch(`/api/whiteboard-media-raw/${encodeURIComponent(HOBBY)}?${query.toString()}`, {
            method:'POST',
            headers:{'Content-Type':'application/octet-stream'},
            body:await file.arrayBuffer()
        });
        const payload = await response.json().catch(() => null);
        if (!response.ok || !payload?.image) throw new Error(payload?.message || 'Could not save whiteboard image.');
        return payload.image;
    }

    async function deleteWhiteboardImageV251(image) {
        if (!image || (!image.projectPath && !image.src)) return;
        await fetch(`/api/whiteboard-media/${encodeURIComponent(HOBBY)}`, {
            method:'DELETE',
            headers:{'Content-Type':'application/json'},
            body:JSON.stringify({projectPath:image.projectPath || '', src:image.src || ''})
        }).catch(() => null);
    }

    // V509: Real Quizzes portal inside Whiteboard. The real Quizzes/Quiz Learn
    // DOM remains authoritative. Drawing on top of it is controlled ONLY by the
    // Whiteboard's own pen/highlighter/eraser tools; the quiz window has no duplicate
    // ink toolbar. Select/lasso/sticky/text leave the quiz fully interactive.
    let activeWhiteboardQuizPortalV507 = null;

    function whiteboardQuizViewIsPortaledV507(view) {
        return !!activeWhiteboardQuizPortalV507 && (view === quizzesView || view === quizLearnView);
    }

    function showWhiteboardQuizPortalViewV507(view) {
        const state = activeWhiteboardQuizPortalV507;
        if (!state || !whiteboardQuizViewIsPortaledV507(view)) return false;
        [quizzesView, quizLearnView].forEach(item => item?.classList?.toggle('wb-quiz-portal-current-v507', item === view));
        state.currentView = view;
        const title = state.panel?.querySelector('[data-role="wb-quiz-title-v507"]');
        if (title) title.textContent = view === quizLearnView ? 'Quiz' : 'Quizzes';
        return true;
    }

    function closeWhiteboardQuizPortalV507() {
        const state = activeWhiteboardQuizPortalV507;
        if (!state) return;
        activeWhiteboardQuizPortalV507 = null;
        document.body.classList.remove('whiteboard-quiz-portal-active-v507');
        try { state.quizView?.removeEventListener('click', state.closeCapture, true); } catch {}
        try {
            if (state.settingsButtonRecordV523?.el && state.syncQuizSettingsThemeV578) {
                state.settingsButtonRecordV523.el.removeEventListener('click', state.syncQuizSettingsThemeV578, true);
            }
        } catch {}
        try { state.whiteboardRoot?.removeEventListener('loggy-whiteboard-toolchange-v509', state.syncTool); } catch {}
        try { state.whiteboardRoot?.removeEventListener('loggy-whiteboard-camera-v516', state.syncZoomV516); } catch {}
        try { state.toolObserver?.disconnect(); } catch {}
        try { state.practiceObserver?.disconnect(); } catch {}
        try { state.resizeObserverV521?.disconnect(); } catch {}
        try { if (state.syncResponsiveV521) window.removeEventListener('resize', state.syncResponsiveV521); } catch {}
        try { state.content?.removeEventListener('click', state.practiceLaunchCaptureV514, true); } catch {}
        try { state.quizLayerMenuV523?.remove(); } catch {}
        if (state.settingsButtonRecordV523?.el) {
            const rec = state.settingsButtonRecordV523;
            rec.el.classList.remove('wb-quiz-settings-head-v523');
            if (rec.parent) {
                try { rec.parent.insertBefore(rec.el, rec.next && rec.next.parentNode === rec.parent ? rec.next : null); }
                catch { try { rec.parent.appendChild(rec.el); } catch {} }
            }
        }
        if (window.__loggyWhiteboardQuizPracticeRouterV518 === state.practiceRouterV518) delete window.__loggyWhiteboardQuizPracticeRouterV518;
        // V514: restore any real practice modal to the exact place it came from.
        // Never remove it: newer Smart/Field-to-Field runtimes may reuse that node.
        for (const rec of state.practiceRecordsV514 || []) {
            const modal = rec?.modal;
            if (!modal) continue;
            modal.classList.remove('wb-quiz-practice-modal-v511','wb-quiz-practice-embedded-v512');
            delete modal.dataset.wbThemeV511;
            if (rec.parent) {
                try { rec.parent.insertBefore(modal, rec.next && rec.next.parentNode === rec.parent ? rec.next : null); }
                catch { try { rec.parent.appendChild(modal); } catch {} }
            }
        }
        try { state.panel?.remove(); } catch {}
        for (const rec of state.records || []) {
            const el = rec.el;
            if (!el) continue;
            el.classList.remove('wb-quiz-portaled-v507','wb-quiz-portal-current-v507');
            if (rec.parent) {
                try { rec.parent.insertBefore(el, rec.next && rec.next.parentNode === rec.parent ? rec.next : null); }
                catch { try { rec.parent.appendChild(el); } catch {} }
            }
            el.classList.toggle('active', !!rec.wasActive);
        }
    }

    function openWhiteboardQuizPortalV507(whiteboardRoot) {
        if (!whiteboardRoot || !document.contains(whiteboardRoot)) return;
        if (activeWhiteboardQuizPortalV507) {
            activeWhiteboardQuizPortalV507.panel?.removeAttribute('hidden');
            showWhiteboardQuizPortalViewV507(activeWhiteboardQuizPortalV507.currentView || quizzesView);
            activeWhiteboardQuizPortalV507.syncTool?.();
            return;
        }
        if (!quizzesView || !quizLearnView) return;
        try { updateQuizUI(); } catch {}

        const panel = document.createElement('section');
        panel.className = 'wb-quiz-window-v507 wb-quiz-default-theme-v509';
        panel.dataset.quizDrawing = '0';
        panel.innerHTML = `
          <div class="wb-quiz-window-head-v507">
            <div class="wb-quiz-window-drag-v507" data-role="wb-quiz-drag-v507"><i class="ph ph-cards"></i><span data-role="wb-quiz-title-v507">Quizzes</span></div>
            <div class="wb-quiz-window-actions-v507">
              <button type="button" class="wb-quiz-close-v507" data-quiz-close-v507 title="Close" aria-label="Close quizzes window"><i class="ph ph-x"></i></button>
            </div>
          </div>
          <div class="wb-quiz-window-body-v507">
            <div class="wb-quiz-portal-content-v507" data-role="wb-quiz-content-v507"></div>
            <svg class="wb-quiz-annotation-v507" data-role="wb-quiz-annotation-v507"></svg>
          </div>`;
        whiteboardRoot.appendChild(panel);
        panel.dataset.wbQuizLayerV523 = 'middle';
        const quizLayerMenuV523 = document.createElement('div');
        quizLayerMenuV523.className = 'wb-quiz-layer-menu-v523';
        quizLayerMenuV523.hidden = true;
        quizLayerMenuV523.innerHTML = '<button type="button" data-wb-quiz-layer-v523="front"><i class="ph ph-arrow-up"></i> Bring to front</button><button type="button" data-wb-quiz-layer-v523="back"><i class="ph ph-arrow-down"></i> Send to back</button>';
        whiteboardRoot.appendChild(quizLayerMenuV523);
        const content = panel.querySelector('[data-role="wb-quiz-content-v507"]');
        const svg = panel.querySelector('[data-role="wb-quiz-annotation-v507"]');
        const records = [quizzesView, quizLearnView].map(el => ({el,parent:el.parentNode,next:el.nextSibling,wasActive:el.classList.contains('active')}));
        records.forEach(({el}) => { el.classList.remove('active'); el.classList.add('wb-quiz-portaled-v507'); content.appendChild(el); });

        const state = {panel,content,svg,records,quizView:quizzesView,currentView:quizzesView,drawing:null,paths:[],whiteboardRoot,quizLayerMenuV523,baseZoomV516:Math.max(.05,Number(whiteboardRoot.dataset.cameraZoomV516)||.72)};
        activeWhiteboardQuizPortalV507 = state;
        document.body.classList.add('whiteboard-quiz-portal-active-v507');

        // V523: keep Quiz Settings in the unscaled title bar so it remains visible
        // and clickable no matter how small the resizable quiz body becomes.
        const quizSettingsButtonV523 = document.getElementById('open-quiz-settings-v58');
        const quizWindowActionsV523 = panel.querySelector('.wb-quiz-window-actions-v507');
        if (quizSettingsButtonV523 && quizWindowActionsV523) {
            state.settingsButtonRecordV523 = {el:quizSettingsButtonV523,parent:quizSettingsButtonV523.parentNode,next:quizSettingsButtonV523.nextSibling};
            quizSettingsButtonV523.classList.add('wb-quiz-settings-head-v523');

            state.syncQuizSettingsThemeV578 = () => {
                try {
                    const modal = typeof ensureQuizSettingsModalV58 === 'function'
                        ? ensureQuizSettingsModalV58()
                        : document.getElementById('quiz-settings-modal-v58');
                    if (modal) {
                        modal.dataset.wbThemeV511 =
                            whiteboardRoot.dataset.theme === 'dark' ? 'dark' : 'light';
                    }
                } catch {}
            };
            quizSettingsButtonV523.addEventListener('click', state.syncQuizSettingsThemeV578, true);

            quizWindowActionsV523.insertBefore(quizSettingsButtonV523, quizWindowActionsV523.firstChild);
        }

        // V523: right-clicking the quiz window controls the window's own layer
        // relative to board objects. The menu always closes after one choice.
        panel.addEventListener('contextmenu', event => {
            if (event.target.closest?.('.wb-quiz-layer-menu-v523')) return;
            event.preventDefault();
            event.stopPropagation();
            const rootRect = whiteboardRoot.getBoundingClientRect();
            quizLayerMenuV523.hidden = false;
            const maxX = Math.max(8, rootRect.width - 170);
            const maxY = Math.max(8, rootRect.height - 88);
            quizLayerMenuV523.style.left = `${Math.max(8, Math.min(maxX, event.clientX - rootRect.left))}px`;
            quizLayerMenuV523.style.top = `${Math.max(8, Math.min(maxY, event.clientY - rootRect.top))}px`;
        });
        quizLayerMenuV523.addEventListener('click', event => {
            const button = event.target.closest?.('[data-wb-quiz-layer-v523]');
            if (!button) return;
            event.preventDefault();
            event.stopPropagation();
            panel.dataset.wbQuizLayerV523 = button.dataset.wbQuizLayerV523 === 'back' ? 'back' : 'front';
            quizLayerMenuV523.hidden = true;
        });
        whiteboardRoot.addEventListener('pointerdown', event => {
            if (!quizLayerMenuV523.hidden && !event.target.closest?.('.wb-quiz-layer-menu-v523')) quizLayerMenuV523.hidden = true;
        });

        showWhiteboardQuizPortalViewV507(quizzesView);
        // V518: match the real Quizzes tab: rebuild optional practice cards after
        // the view is portaled, and treat the portaled Quizzes view as visible.
        try { renderQuizExtraPracticeSectionsV59?.(); } catch {}
        const practiceHostV518 = document.getElementById('quiz-extra-practice-host-v59');
        if (practiceHostV518) {
            practiceHostV518.classList.remove('view-hidden-v60');
            practiceHostV518.classList.toggle('hidden', !practiceHostV518.children.length);
        }

        // The original Quizzes back button means “close this Whiteboard window” here.
        state.closeCapture = event => {
            if (!event.target?.closest?.('#close-quizzes-btn')) return;
            event.preventDefault(); event.stopPropagation(); event.stopImmediatePropagation();
            closeWhiteboardQuizPortalV507();
        };
        quizzesView.addEventListener('click', state.closeCapture, true);

        panel.addEventListener('click', event => {
            if (event.target.closest?.('[data-quiz-close-v507]')) closeWhiteboardQuizPortalV507();
        });

        // The Whiteboard tool is the one source of truth for whether the quiz overlay
        // should receive drawing input. No separate Interact/Write mode exists.
        const drawingTools = new Set(['pen','highlighter','eraser','precision']);
        const practiceSelectorV514 = '[id^="smart-placeholder-practice-modal-"],#transformation-practice-modal-v59';

        const setPortalTitleV514 = value => {
            const title = panel.querySelector('[data-role="wb-quiz-title-v507"]');
            const next = String(value || '').trim() || (state.currentView === quizLearnView ? 'Quiz' : 'Quizzes');
            if (title && title.textContent !== next) title.textContent = next;
        };

        const practiceIsVisibleV514 = modal => {
            if (!modal || !modal.isConnected || modal.hidden) return false;
            if (modal.classList.contains('hidden')) return false;
            try { return getComputedStyle(modal).display !== 'none' && getComputedStyle(modal).visibility !== 'hidden'; } catch { return true; }
        };

        const portalPracticeModalV514 = modal => {
            if (!modal || !activeWhiteboardQuizPortalV507 || !practiceIsVisibleV514(modal)) return false;
            const body = panel.querySelector('.wb-quiz-window-body-v507');
            if (!body) return false;
            state.practiceRecordsV514 ||= [];
            if (!state.practiceRecordsV514.some(rec => rec.modal === modal)) {
                state.practiceRecordsV514.push({modal,parent:modal.parentNode,next:modal.nextSibling});
            }
            modal.classList.add('wb-quiz-practice-modal-v511','wb-quiz-practice-embedded-v512');
            modal.dataset.wbThemeV511 = whiteboardRoot.dataset.theme === 'dark' ? 'dark' : 'light';
            if (modal.parentElement !== body) body.appendChild(modal);
            setPortalTitleV514(modal.querySelector('.modal-header h2')?.textContent || 'Practice');
            try { state.syncResponsiveV521?.(); } catch {}
            return true;
        };

        const syncPracticeThemeV514 = () => {
            for (const rec of state.practiceRecordsV514 || []) {
                if (rec.modal?.isConnected) rec.modal.dataset.wbThemeV511 = whiteboardRoot.dataset.theme === 'dark' ? 'dark' : 'light';
            }
        };

        const syncAfterPracticeLaunchV514 = () => {
            let found = false;
            document.querySelectorAll(practiceSelectorV514).forEach(modal => {
                if (portalPracticeModalV514(modal)) found = true;
            });
            if (!found) setPortalTitleV514();
        };

        state.syncTool = () => {
            const tool = String(whiteboardRoot.dataset.activeTool || 'select');
            panel.dataset.wbTool = tool;
            panel.dataset.quizDrawing = drawingTools.has(tool) ? '1' : '0';
            panel.dataset.wbThemeV511 = whiteboardRoot.dataset.theme === 'dark' ? 'dark' : 'light';
            syncPracticeThemeV514();
            try {
                const settingsModalV578 = document.getElementById('quiz-settings-modal-v58');
                if (settingsModalV578 && !settingsModalV578.classList.contains('hidden')) {
                    settingsModalV578.dataset.wbThemeV511 =
                        whiteboardRoot.dataset.theme === 'dark' ? 'dark' : 'light';
                }
            } catch {}
        };
        whiteboardRoot.addEventListener('loggy-whiteboard-toolchange-v509', state.syncTool);
        state.toolObserver = new MutationObserver(state.syncTool);
        state.toolObserver.observe(whiteboardRoot, {attributes:true, attributeFilter:['data-active-tool','data-theme','data-wb-pen-color-v509','data-wb-highlighter-color-v509','data-wb-pen-width-v509','data-wb-highlighter-width-v509']});
        state.syncTool();

        // V516: route the two practice launchers directly through their REAL
        // runtime functions while the Quizzes portal is active. V514 tried to wait
        // until some other click handler created a body-level modal and then catch
        // it afterward; newer Smart Placeholder versions can replace that modal in
        // the same click, so the catch was unreliable. We invoke the same runtime,
        // then immediately embed the exact modal it created in this window.
        state.practiceRouterV518 = kind => {
            const fn = kind === 'smart'
                ? (window.openSmartPlaceholderPracticeV487 || window.openSmartPlaceholderPracticeV474 || window.openSmartPlaceholderPracticeV473 || window.openSmartPlaceholderPracticeV468 || window.openSmartPlaceholderPracticeV59)
                : (window.openTransformationPracticeV59 || window.openFieldToFieldPracticeV60);
            if (typeof fn !== 'function') return false;
            try { fn(); } catch (error) { console.error('[Whiteboard Quizzes V518] practice launch failed', error); return false; }
            syncAfterPracticeLaunchV514();
            queueMicrotask(syncAfterPracticeLaunchV514);
            requestAnimationFrame(syncAfterPracticeLaunchV514);
            return true;
        };
        window.__loggyWhiteboardQuizPracticeRouterV518 = state.practiceRouterV518;

        state.practiceLaunchCaptureV514 = event => {
            const smart = event.target?.closest?.('.open-smart-practice-v59');
            const field = event.target?.closest?.('.open-transformation-practice-v59');
            if (!smart && !field) return;
            event.preventDefault();
            event.stopPropagation();
            event.stopImmediatePropagation();
            state.practiceRouterV518?.(smart ? 'smart' : 'field');
        };
        content.addEventListener('click', state.practiceLaunchCaptureV514, true);

        // V516: the quiz window participates in Whiteboard +/- zoom. It keeps the
        // size it had when opened as 100%, then follows the camera proportionally.
        state.syncZoomV516 = event => {
            const current = Math.max(.05, Number(event?.detail?.zoom ?? whiteboardRoot.dataset.cameraZoomV516) || state.baseZoomV516);
            const factor = Math.max(.35, Math.min(3, current / state.baseZoomV516));
            state.quizScaleV518 = factor;
            panel.style.zoom = '';
            panel.dataset.wbQuizZoomV516 = String(factor);
            if (state.dragPositionedV518) {
                panel.style.transformOrigin = 'top left';
                panel.style.transform = `scale(${factor})`;
            } else {
                panel.style.transformOrigin = 'center center';
                panel.style.transform = `translate(-50%,-50%) scale(${factor})`;
            }
        };
        whiteboardRoot.addEventListener('loggy-whiteboard-camera-v516', state.syncZoomV516);
        state.syncZoomV516();

        // V521: resizing the outer Quizzes window also resizes the UI INSIDE it.
        // The portal keeps its normal responsive layout until the window becomes
        // smaller than the size it opened at; then the real quiz UI scales down
        // proportionally while its layout viewport is expanded to the inverse size.
        // This keeps cards/buttons readable and prevents content from simply being
        // clipped by a smaller frame. Whiteboard camera zoom remains a separate
        // transform owned by syncZoomV516 above.
        const quizBodyResponsiveV521 = panel.querySelector('.wb-quiz-window-body-v507');
        const clampQuizInnerScaleV521 = value => Math.max(.58, Math.min(1, Number(value) || 1));
        state.syncResponsiveV521 = () => {
            const body = quizBodyResponsiveV521;
            if (!body || !content?.isConnected) return;
            const width = Math.max(1, panel.clientWidth || body.clientWidth || 1);
            const height = Math.max(1, (panel.clientHeight - 52) || body.clientHeight || 1);
            const sizeKey = `${Math.round(width)}x${Math.round(height)}`;
            if (state.lastResponsiveSizeV522 === sizeKey) return;
            state.lastResponsiveSizeV522 = sizeKey;
            if (!state.baseInnerSizeV521 || !state.baseInnerSizeV521.w || !state.baseInnerSizeV521.h) {
                state.baseInnerSizeV521 = {w:width,h:height};
            }
            const base = state.baseInnerSizeV521;
            const scale = clampQuizInnerScaleV521(Math.min(width / base.w, height / base.h));
            state.innerScaleV521 = scale;
            panel.style.setProperty('--wb-quiz-inner-scale-v521', String(scale));
            panel.dataset.wbQuizCompactV521 = scale < .86 ? '1' : '0';

            // CSS zoom is intentionally applied ONLY to the portal contents, never
            // to the draggable outer panel. Expanding the layout box by 1/scale
            // makes the shrunken UI continue to fill the resized window.
            const inverse = (100 / scale).toFixed(4) + '%';
            content.style.zoom = String(scale);
            content.style.width = inverse;
            content.style.height = inverse;
            content.style.right = 'auto';
            content.style.bottom = 'auto';

            for (const rec of state.practiceRecordsV514 || []) {
                const modal = rec?.modal;
                if (!modal?.classList?.contains('wb-quiz-practice-embedded-v512')) continue;
                modal.style.setProperty('zoom', String(scale), 'important');
                modal.style.setProperty('width', inverse, 'important');
                modal.style.setProperty('height', inverse, 'important');
                modal.style.setProperty('right', 'auto', 'important');
                modal.style.setProperty('bottom', 'auto', 'important');
            }
        };
        // Capture the opening size after layout has settled, then observe only the
        // quiz body. Updating descendants cannot resize the fixed outer panel, so
        // this observer does not create the mutation/resize loops seen in V512.
        requestAnimationFrame(() => {
            state.baseInnerSizeV521 = null;
            state.syncResponsiveV521?.();
        });
        if (typeof ResizeObserver === 'function' && panel) {
            // V522: observe ONLY the outer resizable panel. Placeholder drag/drop
            // mutates quiz contents heavily; observing the body caused resize -> zoom
            // -> resize feedback during HTML5 drag and could freeze the page.
            state.resizeObserverV521 = new ResizeObserver(() => state.syncResponsiveV521?.());
            state.resizeObserverV521.observe(panel);
        } else {
            window.addEventListener('resize', state.syncResponsiveV521, {passive:true});
        }

        // If an embedded practice closes/removes itself, restore the normal Quizzes
        // title without observing the rest of the document. This observer is scoped
        // strictly to the quiz window body and never mutates the observed subtree.
        const quizBodyV514 = panel.querySelector('.wb-quiz-window-body-v507');
        state.practiceObserver = new MutationObserver(() => {
            const embedded = quizBodyV514?.querySelector('.wb-quiz-practice-embedded-v512');
            if (!embedded || !practiceIsVisibleV514(embedded)) setPortalTitleV514();
        });
        if (quizBodyV514) state.practiceObserver.observe(quizBodyV514, {childList:true});

        // Drag only from the title area so quiz controls remain fully interactive.
        const drag = panel.querySelector('[data-role="wb-quiz-drag-v507"]');
        drag?.addEventListener('pointerdown', event => {
            if (event.button !== 0) return;
            event.preventDefault();
            const rect = panel.getBoundingClientRect();
            const factor = Math.max(.35, Number(state.quizScaleV518) || 1);
            state.dragPositionedV518 = true;
            panel.style.left = `${rect.left}px`;
            panel.style.top = `${rect.top}px`;
            panel.style.transformOrigin = 'top left';
            panel.style.transform = `scale(${factor})`;
            const sx=event.clientX, sy=event.clientY, ox=rect.left, oy=rect.top;
            const visualW=panel.offsetWidth*factor, visualH=panel.offsetHeight*factor;
            const move = e => {
                panel.style.left = `${Math.max(0,Math.min(innerWidth-visualW,e.clientX-sx+ox))}px`;
                panel.style.top = `${Math.max(0,Math.min(innerHeight-visualH,e.clientY-sy+oy))}px`;
            };
            const up = () => { window.removeEventListener('pointermove',move); window.removeEventListener('pointerup',up); };
            window.addEventListener('pointermove',move); window.addEventListener('pointerup',up,{once:true});
        });

        // V520: convert viewport pointer coordinates through the SVG's actual
        // screen transform. This keeps quiz annotations directly under the pen at
        // every Whiteboard zoom level instead of assuming a 1:1 CSS pixel mapping.
        const point = event => {
            try {
                const matrix = svg.getScreenCTM?.();
                if (matrix) {
                    const pt = svg.createSVGPoint();
                    pt.x = event.clientX; pt.y = event.clientY;
                    const local = pt.matrixTransform(matrix.inverse());
                    return {x:local.x,y:local.y};
                }
            } catch (_) {}
            const r=svg.getBoundingClientRect();
            const sx = r.width ? (svg.clientWidth || r.width) / r.width : 1;
            const sy = r.height ? (svg.clientHeight || r.height) / r.height : 1;
            return {x:(event.clientX-r.left)*sx,y:(event.clientY-r.top)*sy};
        };
        const pathData = pts => pts.length ? `M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}` + pts.slice(1).map(p=>` L ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join('') : '';
        svg.addEventListener('pointerdown', event => {
            const tool = String(whiteboardRoot.dataset.activeTool || 'select');
            if (!drawingTools.has(tool) || event.button !== 0) return;
            event.preventDefault(); event.stopPropagation();
            if (tool === 'eraser' || tool === 'precision') {
                const hit = event.target.closest?.('path[data-quiz-stroke-v507]');
                if (hit) { hit.remove(); state.paths=state.paths.filter(x=>x.el!==hit); }
                return;
            }
            const p=point(event), el=document.createElementNS('http://www.w3.org/2000/svg','path');
            const high=tool==='highlighter';
            const color = high ? (whiteboardRoot.dataset.wbHighlighterColorV509 || '#FFF200') : (whiteboardRoot.dataset.wbPenColorV509 || '#202124');
            const width = Math.max(1,Number(high ? whiteboardRoot.dataset.wbHighlighterWidthV509 : whiteboardRoot.dataset.wbPenWidthV509) || (high?26:5));
            el.dataset.quizStrokeV507='1'; el.setAttribute('stroke', color); el.setAttribute('stroke-width',String(width)); el.setAttribute('opacity',high?'.42':'1');
            svg.appendChild(el); state.drawing={id:event.pointerId,pts:[p],el}; state.paths.push(state.drawing); try{svg.setPointerCapture(event.pointerId)}catch{}
        });
        svg.addEventListener('pointermove', event => {
            const d=state.drawing; if(!d||d.id!==event.pointerId)return; event.preventDefault(); d.pts.push(point(event)); d.el.setAttribute('d',pathData(d.pts));
        });
        const finish = event => { const d=state.drawing;if(!d||d.id!==event.pointerId)return;d.el.setAttribute('d',pathData(d.pts));state.drawing=null;try{svg.releasePointerCapture(event.pointerId)}catch{} };
        svg.addEventListener('pointerup',finish); svg.addEventListener('pointercancel',finish);
    }

    function mountWhiteboardTabV198(tab, view) {
        if (!tab || !view || !isWhiteboardTabV198(tab)) return;
        const host = view.querySelector('.whiteboard-runtime-host-v198');
        if (!host) return;
        const state = migrateTabWhiteboardStateV198(tab);
        // V497: render/switch wrappers can call this mount path several times while
        // opening one tab. The whiteboard runtime's mount(existingHost) performs a
        // full renderAll(), so repeated calls make the workspace sluggish and can
        // interrupt pointer gestures. One host gets one controller mount.
        if (host.dataset.whiteboardMountedV497 === '1' || host.dataset.whiteboardMountingV497 === '1') return;
        host.dataset.whiteboardMountingV497 = '1';
        ensureWhiteboardRuntimeV198().then(runtime => {
            if (!runtime || !document.contains(view)) { delete host.dataset.whiteboardMountingV497; return; }
            runtime.mount(host, {
                id: tab.id,
                name: tab.name || 'Whiteboard',
                getState: () => tab.whiteboardV198 || state,
                saveState: next => { tab.whiteboardV198 = next; rememberWhiteboardRouteV207(tab, next?.activeBoardId); try { saveDb(); } catch {} },
                routeChanged: boardId => rememberWhiteboardRouteV207(tab, boardId),
                ensureNativeCursor: () => setWhiteboardNativeCursorV207(true),
                openQuizzes: whiteboardRoot => openWhiteboardQuizPortalV507(whiteboardRoot),
                uploadImage: (file, boardId) => uploadWhiteboardImageV251(tab, boardId, file),
                deleteImage: deleteWhiteboardImageV251,
                exit: () => {
                    clearWhiteboardRouteV207();
                    activeCustomTabId = null;
                    customTabEditMode = false;
                    try { initGrid(); } catch {}
                    try { switchView(gridView); } catch {}
                }
            });
            delete host.dataset.whiteboardMountingV497;
            host.dataset.whiteboardMountedV497 = '1';
        }).catch(error => {
            delete host.dataset.whiteboardMountingV497;
            console.error('Whiteboard runtime failed to load', error);
            host.innerHTML = '<div class="whiteboard-runtime-loading-v198">Could not load the whiteboard. Refresh this page and try again.</div>';
        });
    }

    const renderCustomTabViewBeforeWhiteboardV198 = renderCustomTabView;
    renderCustomTabView = function(tabId) {
        const tab = getCustomTab?.(tabId);
        if (!isWhiteboardTabV198(tab)) return renderCustomTabViewBeforeWhiteboardV198.apply(this, arguments);
        const view = document.getElementById(`custom-tab-view-${tabId}`);
        if (view) mountWhiteboardTabV198(tab, view);
    };

    function ensureSpecialWhiteboardViewV198(tabId) {
        const tab = getCustomTab?.(tabId);
        if (!isWhiteboardTabV198(tab)) return document.getElementById(`custom-tab-view-${tabId}`);
        let view = document.getElementById(`custom-tab-view-${tabId}`);
        if (!view?.classList.contains('whiteboard-tab-view-v198')) {
            const replacement = buildCustomTabView(tab);
            const wasActive = !!view?.classList.contains('active');
            if (view) view.replaceWith(replacement);
            else document.body.insertBefore(replacement, document.getElementById('companion-stage') || null);
            view = replacement;
            if (wasActive) view.classList.add('active');
        }
        // V404: fullscreen CSS hides every other direct body child. A special
        // view left nested inside the normal custom-tab host gets hidden with its
        // parent, so always promote it to the body before opening/switching.
        if (view && view.parentElement !== document.body) {
            document.body.insertBefore(view, document.getElementById('companion-stage') || null);
        }
        return view;
    }

    const openCustomTabBeforeWhiteboardV198 = openCustomTab;
    openCustomTab = function(tabId) {
        const tab = getCustomTab?.(tabId);
        if (!isWhiteboardTabV198(tab)) return openCustomTabBeforeWhiteboardV198.apply(this, arguments);
        ensureWhiteboardBootstrapStyleV198();
        ensureSpecialWhiteboardViewV198(tabId);
        document.body.classList.add('whiteboard-tab-active-v198');
        document.documentElement.classList.add('whiteboard-tab-active-v198');
        setWhiteboardNativeCursorV207(true);
        return openCustomTabBeforeWhiteboardV198.apply(this, arguments);
    };

    const renderAllCustomTabViewsBeforeWhiteboardV198 = renderAllCustomTabViews;
    renderAllCustomTabViews = function() {
        const result = renderAllCustomTabViewsBeforeWhiteboardV198.apply(this, arguments);
        try { getCustomTabs().filter(isWhiteboardTabV198).forEach(tab => ensureSpecialWhiteboardViewV198(tab.id)); } catch {}
        return result;
    };

    const switchViewBeforeWhiteboardV198 = switchView;
    switchView = function(viewToShow) {
        if (activeWhiteboardQuizPortalV507 && (viewToShow === quizzesView || viewToShow === quizLearnView)) {
            showWhiteboardQuizPortalViewV507(viewToShow);
            return;
        }
        const isWhiteboard = !!viewToShow?.classList?.contains('whiteboard-tab-view-v198');
        const wasWhiteboard = document.body.classList.contains('whiteboard-tab-active-v198');
        if (activeWhiteboardQuizPortalV507 && wasWhiteboard && !isWhiteboard) closeWhiteboardQuizPortalV507();
        ensureWhiteboardBootstrapStyleV198();
        document.body.classList.toggle('whiteboard-tab-active-v198', isWhiteboard);
        document.documentElement.classList.toggle('whiteboard-tab-active-v198', isWhiteboard);
        setWhiteboardNativeCursorV207(isWhiteboard);
        if (isWhiteboard) { try { document.querySelectorAll('[data-theme-hover-sound-enabled-v87="true"]').forEach(item=>{ if(typeof stopThemeHoverAudioForItemV87==='function') stopThemeHoverAudioForItemV87(item,0); }); } catch {} }
        const result = switchViewBeforeWhiteboardV198.apply(this, arguments);
        if (isWhiteboard) {
            const tab = getCustomTab?.(viewToShow.dataset.customTabId);
            rememberWhiteboardRouteV207(tab, tab?.whiteboardV198?.activeBoardId);
            mountWhiteboardTabV198(tab, viewToShow);
            document.documentElement.classList.remove('loading-log-page','restoring-log-view');
        } else if (wasWhiteboard) clearWhiteboardRouteV207();
        return result;
    };

    // ---------- Daily Logs ↔ board references with real previews ----------
    function boardPreviewSvgV198(board, theme='light') {
        const notes = Array.isArray(board?.notes) ? board.notes : [];
        const strokes = Array.isArray(board?.strokes) ? board.strokes : [];
        const xs=[], ys=[];
        notes.forEach(n=>{const x=Number(n.x)||0,y=Number(n.y)||0,w=Number(n.w)||320,h=Number(n.h)||320;xs.push(x,x+w);ys.push(y,y+h)});
        strokes.forEach(s=>(s.points||[]).forEach(p=>{xs.push(Number(p.x)||0);ys.push(Number(p.y)||0)}));
        let minX=-300,minY=-200,maxX=300,maxY=200;
        if(xs.length){minX=Math.min(...xs)-50;maxX=Math.max(...xs)+50;minY=Math.min(...ys)-50;maxY=Math.max(...ys)+50}
        const safeColor=(v,fallback)=>/^#[0-9a-f]{6}$/i.test(String(v||''))?v:fallback;
        const noteSvg=notes.slice(0,60).map(n=>`<rect x="${Number(n.x)||0}" y="${Number(n.y)||0}" width="${Math.max(20,Number(n.w)||320)}" height="${Math.max(20,Number(n.h)||320)}" rx="2" fill="${safeColor(n.color,'#FFF1A8')}"/>`).join('');
        const strokeSvg=strokes.slice(0,80).map(s=>{const pts=(s.points||[]).slice(0,240).map((p,i)=>`${i?'L':'M'} ${Number(p.x)||0} ${Number(p.y)||0}`).join(' ');return pts?`<path d="${pts}" fill="none" stroke="${safeColor(s.color,'#202124')}" stroke-width="${Math.max(1,Number(s.width)||4)}" opacity="${s.tool==='highlighter'?'.3':'1'}" stroke-linecap="round"/>`:''}).join('');
        const bg=theme==='dark'?'#121212':'#f9f9f9';
        return `<svg viewBox="${minX} ${minY} ${Math.max(1,maxX-minX)} ${Math.max(1,maxY-minY)}" preserveAspectRatio="xMidYMid meet" aria-hidden="true"><rect x="${minX}" y="${minY}" width="${Math.max(1,maxX-minX)}" height="${Math.max(1,maxY-minY)}" fill="${bg}"/>${strokeSvg}${noteSvg}</svg>`;
    }

    function allWhiteboardsV198() {
        const result=[];
        try {
            getCustomTabs().filter(isWhiteboardTabV198).forEach(tab=>{
                const state=migrateTabWhiteboardStateV198(tab);
                (state?.boards||[]).forEach(board=>result.push({tab,state,board}));
            });
        } catch {}
        return result;
    }

    function getDailyWhiteboardLinksV198() {
        if (!currentDay || !db?.days?.[currentDay]) return [];
        if (!Array.isArray(db.days[currentDay].whiteboardLinksV198)) db.days[currentDay].whiteboardLinksV198=[];
        return db.days[currentDay].whiteboardLinksV198;
    }

    function openExactWhiteboardV198(tabId, boardId) {
        const tab=getCustomTab?.(tabId); if(!tab||!isWhiteboardTabV198(tab)) return;
        const state=migrateTabWhiteboardStateV198(tab);
        if(state.boards.some(b=>b.id===boardId)) state.activeBoardId=boardId;
        tab.whiteboardV198=state; try{saveDb()}catch{}
        openCustomTab(tab.id);
        requestAnimationFrame(()=>{
            const host=document.querySelector(`#custom-tab-view-${CSS.escape(tab.id)} .whiteboard-runtime-host-v198`);
            if(host && window.LoggyWhiteboardV198) window.LoggyWhiteboardV198.openBoard(host,boardId);
        });
    }

    function ensureDailyWhiteboardLinksV198() {
        ensureWhiteboardBootstrapStyleV198();
        // V449: Whiteboards belong inside Tab Items, never as a standalone Daily Log section.
        document.getElementById('daily-whiteboard-links-v198')?.remove();
        try { ensureDailyCustomTabLinksUI?.(); } catch {}
        try { applyHiddenLoggySectionsV432?.(); } catch {}
        if (!window.__syncDailySpecialTabItemsEmptyV449) {
            window.__syncDailySpecialTabItemsEmptyV449 = () => {
                const list=document.getElementById('daily-custom-tab-links-list'); if(!list)return;
                const rows=list.querySelectorAll('.daily-custom-tab-link');
                let empty=list.querySelector('.daily-custom-tab-empty');
                if(rows.length){ empty?.remove(); return; }
                if(!empty){ empty=document.createElement('div'); empty.className='daily-custom-tab-empty'; empty.textContent='Nothing from your custom tabs is linked to this day yet.'; list.appendChild(empty); }
            };
        }
    }

    function renderDailyWhiteboardLinksV198() {
        ensureDailyWhiteboardLinksV198();
        const list=document.getElementById('daily-custom-tab-links-list'); if(!list)return;
        list.querySelectorAll('.daily-tab-whiteboard-item-v449').forEach(node=>node.remove());
        const links=getDailyWhiteboardLinksV198();
        links.forEach(link=>{
            const tab=getCustomTab?.(link.tabId), state=tab&&isWhiteboardTabV198(tab)?migrateTabWhiteboardStateV198(tab):null, board=state?.boards?.find(b=>b.id===link.boardId);
            const row=document.createElement('div'); row.className='daily-custom-tab-link daily-whiteboard-link-v198 daily-tab-whiteboard-item-v449';
            const main=document.createElement('button'); main.type='button'; main.className='daily-custom-tab-link-main daily-whiteboard-link-main-v198';
            const thumb=document.createElement('span'); thumb.className='daily-whiteboard-thumb-v198'; thumb.innerHTML=boardPreviewSvgV198(board||{},state?.theme||'light');
            const text=document.createElement('span'); text.className='daily-custom-tab-link-text daily-whiteboard-link-text-v198';
            const strong=document.createElement('strong'); strong.textContent=board?.name||link.boardName||'Missing whiteboard';
            const small=document.createElement('small'); small.textContent=`${tab?.name||link.tabName||'Whiteboard'} · Whiteboard`;
            text.append(strong,small); main.append(thumb,text); main.disabled=!board; main.addEventListener('click',()=>board&&openExactWhiteboardV198(tab.id,board.id));
            const del=document.createElement('button'); del.type='button'; del.className='daily-custom-tab-unlink daily-whiteboard-unlink-v198'; del.title='Remove from this day'; del.innerHTML='<i class="ph ph-x"></i>';
            del.addEventListener('click',()=>{db.days[currentDay].whiteboardLinksV198=getDailyWhiteboardLinksV198().filter(x=>x.id!==link.id);saveDb();renderDailyWhiteboardLinksV198()});
            row.append(main,del); list.appendChild(row);
        });
        window.__syncDailySpecialTabItemsEmptyV449?.();
    }
    window.__renderDailyWhiteboardTabItemsV449 = renderDailyWhiteboardLinksV198;

    function ensureDailyWhiteboardPickerV198() {
        if(document.getElementById('daily-whiteboard-picker-v198'))return;
        const modal=document.createElement('div');modal.id='daily-whiteboard-picker-v198';modal.className='modal-overlay hidden daily-whiteboard-picker-v198';
        modal.innerHTML=`<div class="modal-box"><div class="modal-header"><div><h2>Choose a Whiteboard</h2><p class="progress-hint" style="margin:3px 0 0">The cards are live previews of your saved boards.</p></div><button type="button" class="small-icon-btn" data-close-whiteboard-picker><i class="ph ph-x"></i></button></div><div class="daily-whiteboard-picker-grid-v198" data-whiteboard-picker-grid></div></div>`;
        document.body.appendChild(modal); const close=()=>modal.classList.add('hidden');modal.querySelector('[data-close-whiteboard-picker]').onclick=close;modal.addEventListener('click',e=>{if(e.target===modal)close()});
    }

    function openDailyWhiteboardPickerV198() {
        if(!currentDay)return; ensureDailyWhiteboardPickerV198(); const modal=document.getElementById('daily-whiteboard-picker-v198'),grid=modal.querySelector('[data-whiteboard-picker-grid]');grid.innerHTML='';const boards=allWhiteboardsV198();
        if(!boards.length){grid.innerHTML='<p class="progress-hint">Create a Whiteboard tab first, then create a board inside it.</p>';modal.classList.remove('hidden');return}
        boards.forEach(({tab,state,board})=>{const card=document.createElement('button');card.type='button';card.className='daily-whiteboard-picker-card-v198';card.innerHTML=`<div class="preview">${boardPreviewSvgV198(board,state.theme)}</div><div class="meta"><strong></strong><small></small></div>`;card.querySelector('strong').textContent=board.name;card.querySelector('small').textContent=tab.name||'Whiteboard';card.addEventListener('click',()=>{const links=getDailyWhiteboardLinksV198();if(!links.some(x=>x.tabId===tab.id&&x.boardId===board.id))links.push({id:customId('whiteboard-link'),tabId:tab.id,boardId:board.id,tabName:tab.name,boardName:board.name});saveDb();renderDailyWhiteboardLinksV198();modal.classList.add('hidden')});grid.appendChild(card)});modal.classList.remove('hidden');
    }

    try {
        const openDayLogBeforeWhiteboardV198=openDayLog;
        openDayLog=function(){const r=openDayLogBeforeWhiteboardV198.apply(this,arguments);requestAnimationFrame(()=>renderDailyWhiteboardLinksV198());return r};
        if(currentDay) requestAnimationFrame(()=>renderDailyWhiteboardLinksV198());
    } catch(error){console.warn('Daily whiteboard links setup failed',error)}


    // V205 — When "Add from a Tab" points at a Whiteboard tab, replace the
    // normal Component dropdown with a scrollable visual board picker.
    try {
        const populateDailyCustomComponentSelectBeforeWhiteboardV205 = populateDailyCustomComponentSelect;
        populateDailyCustomComponentSelect = function() {
            const tabSelect = document.getElementById('daily-custom-tab-picker-tab');
            const componentSelect = document.getElementById('daily-custom-tab-picker-component');
            const tab = tabSelect ? getCustomTab?.(tabSelect.value) : null;
            const section = componentSelect?.closest('.modal-section');
            const label = section?.querySelector('.field-label');
            section?.querySelector('.daily-tab-whiteboard-board-wrap-v205')?.remove();
            if (!isWhiteboardTabV198(tab)) {
                if (componentSelect) componentSelect.style.display = '';
                if (label) label.textContent = 'Component';
                return populateDailyCustomComponentSelectBeforeWhiteboardV205.apply(this, arguments);
            }
            if (!section || !componentSelect) return;
            componentSelect.innerHTML = '<option value="">Whiteboard boards</option>';
            componentSelect.style.display = 'none';
            if (label) label.textContent = 'Board';
            const wrap = document.createElement('div');
            wrap.className = 'daily-tab-whiteboard-board-wrap-v205';
            const grid = document.createElement('div');
            grid.className = 'daily-tab-whiteboard-board-grid-v205';
            const state = migrateTabWhiteboardStateV198(tab);
            const boards = Array.isArray(state?.boards) ? state.boards : [];
            if (!boards.length) {
                grid.innerHTML = '<div class="daily-tab-whiteboard-empty-v205">No boards yet. Open this Whiteboard tab and create one first.</div>';
            } else {
                boards.forEach(board => {
                    const card = document.createElement('button');
                    card.type = 'button';
                    card.className = 'daily-tab-whiteboard-card-v205';
                    card.innerHTML = `<div class="preview">${boardPreviewSvgV198(board, state.theme)}</div><div class="meta"><strong></strong><small></small></div>`;
                    card.querySelector('strong').textContent = board.name || 'Untitled board';
                    const folderName = (state.folders || []).find(folder => folder.id === board.folderId)?.name;
                    const tagText = Array.isArray(board.tags) && board.tags.length ? ` · ${board.tags.slice(0,3).join(', ')}` : '';
                    card.querySelector('small').textContent = `${folderName || 'Unfiled'}${tagText}`;
                    card.addEventListener('click', () => {
                        const links = getDailyWhiteboardLinksV198();
                        if (!links.some(item => item.tabId === tab.id && item.boardId === board.id)) {
                            links.push({id:customId('whiteboard-link'),tabId:tab.id,boardId:board.id,tabName:tab.name,boardName:board.name});
                        }
                        saveDb();
                        renderDailyWhiteboardLinksV198();
                        document.getElementById('daily-custom-tab-picker-modal')?.classList.add('hidden');
                    });
                    grid.appendChild(card);
                });
            }
            wrap.appendChild(grid);
            section.appendChild(wrap);
            const actions = document.getElementById('daily-custom-tab-picker-actions');
            if (actions) actions.innerHTML = '<p class="progress-hint" style="margin-top:10px">Choose a board preview above to link it to this day.</p>';
        };

        const renderDailyCustomTabPickerActionsBeforeWhiteboardV205 = renderDailyCustomTabPickerActions;
        renderDailyCustomTabPickerActions = function() {
            const tab = getCustomTab?.(document.getElementById('daily-custom-tab-picker-tab')?.value);
            if (isWhiteboardTabV198(tab)) {
                const actions = document.getElementById('daily-custom-tab-picker-actions');
                if (actions) actions.innerHTML = '<p class="progress-hint" style="margin-top:10px">Choose a board preview above to link it to this day.</p>';
                return;
            }
            return renderDailyCustomTabPickerActionsBeforeWhiteboardV205.apply(this, arguments);
        };
    } catch (error) { console.warn('Whiteboard Add from Tab picker upgrade failed', error); }

    // V207: a browser reload while a whiteboard is active returns directly to
    // that exact tab/board. The early HTML guard masks the regular log page until
    // this lazy whiteboard chunk is ready, avoiding a theme/Daily Logs flash.
    function restoreWhiteboardRouteV207() {
        const route = readWhiteboardRouteV207();
        if (!route) { document.documentElement.classList.remove('whiteboard-restore-pending-v207'); return; }
        const tab = getCustomTab?.(route.tabId);
        if (!isWhiteboardTabV198(tab)) { clearWhiteboardRouteV207(); document.documentElement.classList.remove('whiteboard-restore-pending-v207'); return; }
        try {
            ensureSpecialWhiteboardViewV198(tab.id);
            openCustomTab(tab.id);
            const view = document.getElementById(`custom-tab-view-${tab.id}`);
            if (view) {
                document.body.classList.add('whiteboard-tab-active-v198');
                document.documentElement.classList.add('whiteboard-tab-active-v198');
                setWhiteboardNativeCursorV207(true);
                mountWhiteboardTabV198(tab, view);
                ensureWhiteboardRuntimeV198().then(runtime => {
                    const host = view.querySelector('.whiteboard-runtime-host-v198');
                    if (route.boardId && host) runtime?.openBoard?.(host, route.boardId);
                    rememberWhiteboardRouteV207(tab, route.boardId || tab.whiteboardV198?.activeBoardId);
                    document.documentElement.classList.remove('whiteboard-restore-pending-v207','loading-log-page','restoring-log-view');
                }).catch(() => document.documentElement.classList.remove('whiteboard-restore-pending-v207'));
            }
        } catch (error) {
            console.warn('Whiteboard reload restore failed', error);
            clearWhiteboardRouteV207();
            document.documentElement.classList.remove('whiteboard-restore-pending-v207');
        }
    }
    requestAnimationFrame(() => restoreWhiteboardRouteV207());

    // Upgrade old V197 whiteboard views after this chunk loads.
    requestAnimationFrame(() => {
        try {
            document.querySelectorAll('.whiteboard-tab-view-v197').forEach(v=>v.remove());
            ensureWhiteboardBootstrapStyleV198();
            getCustomTabs().filter(isWhiteboardTabV198).forEach(tab => {
                const old = document.getElementById(`custom-tab-view-${tab.id}`);
                const wasActive = !!old?.classList.contains('active');
                const view = ensureSpecialWhiteboardViewV198(tab.id);
                if (wasActive && view) {
                    view.classList.add('active');
                    document.body.classList.add('whiteboard-tab-active-v198');
                    document.documentElement.classList.add('whiteboard-tab-active-v198');
                    mountWhiteboardTabV198(tab, view);
                }
            });
        } catch (error) { console.warn('Whiteboard view upgrade failed', error); }
    });

})();

// ============================================================
// V207 — KB child-modal stacking + instant Theme Settings/Edit response
// ============================================================
(() => {
    'use strict';
    if (window.__loggyV207Final) return;
    window.__loggyV207Final = true;

    // KB Settings can itself sit on a very high modal layer. Moving the field
    // editor to the end of <body> plus an explicit front class makes its stacking
    // order independent of whichever settings wrapper launched it.
    // (Body of frontKnowledgeFieldModalV207 disabled - V215 further down this
    // file supersedes it with a higher z-index and is the single source of
    // truth for promoting this modal. Having two patches independently
    // re-parent the same open modal on every populate/microtask/rAF was
    // redundant churn on top of an already crowded modal.)
    function frontKnowledgeFieldModalV207() {}
    try {
        const beforeFieldOpenV207 = openKnowledgeFieldCreateModal;
        openKnowledgeFieldCreateModal = function() {
            const result = beforeFieldOpenV207.apply(this, arguments);
            frontKnowledgeFieldModalV207();
            queueMicrotask(frontKnowledgeFieldModalV207);
            requestAnimationFrame(frontKnowledgeFieldModalV207);
            return result;
        };
    } catch {}

    // Shift+W should only reveal Theme Settings synchronously. Historical code
    // prewarmed the enormous Theme Builder 110ms later, causing a visible freeze
    // immediately after the settings modal opened. Builder warming now stays idle-only.
    try {
        openGlobalThemeSettings = function() {
            const modal = (typeof dailySettingsModal !== 'undefined' && dailySettingsModal) || document.getElementById('daily-settings-modal');
            if (!modal) return;
            const title = modal.querySelector('.modal-header h2');
            if (title) title.textContent = 'Settings';
            const current = (typeof db !== 'undefined' && db?.settings?.theme) || 'default';
            try { if (dailyThemeSelect) dailyThemeSelect.value = current; } catch {}
            try { themePickerSelected = current; } catch {}
            try {
                if (themeSearchInput) {
                    themeSearchInput.value = '';
                    themeSearchInput.dataset.previousThemeSearchValue = '';
                }
            } catch {}
            modal.classList.remove('hidden');

            // Yield a real paint before touching picker galleries or accessory lists.
            requestAnimationFrame(() => setTimeout(() => {
                try { hideDailyOnlyControlsFromGlobalSettings?.(); } catch {}
                try { ensureGlobalShortcutsSection?.(); ensureGlobalUtilitiesSection?.(); } catch {}
                try {
                    if (themePicker && !themePicker.querySelector('.theme-picker-card')) renderThemePicker?.();
                    else { updateThemePickerSelection?.(); filterThemePicker?.(''); }
                } catch {}
                const companionHost = document.getElementById('companion-picker');
                const cursorHost = document.getElementById('cursor-picker');
                try { if (companionHost && !companionHost.children.length) renderCompanionPicker?.(); } catch {}
                try { if (cursorHost && !cursorHost.children.length) renderCursorPicker?.(); } catch {}
                try {
                    [typeof themePicker !== 'undefined' ? themePicker : null, companionHost, cursorHost].forEach(element => {
                        if (!element) return;
                        element.closest('.modal-section')?.classList.remove('hidden','global-settings-daily-only-hidden');
                        element.style.display = '';
                    });
                } catch {}
                try { ensureThemeSearchPlusV161?.(); ensureThemeAiEntryV161?.(); fixShortcutV161?.(); removeThemeAiBoxesV162?.(); } catch {}
                try { themeSearchInput?.focus?.({ preventScroll:true }); } catch {}
                try {
                    const card = themePicker?.querySelector(`.theme-picker-card[data-theme="${CSS.escape(current)}"]`);
                    card?.scrollIntoView?.({ block:'nearest', behavior:'auto' });
                } catch {}
                const resync = () => { try { syncSharedThemesIntoLogV40?.(); syncThemeCopyOptionsV30?.(); } catch {} };
                if ('requestIdleCallback' in window) requestIdleCallback(resync, { timeout:3000 });
                else setTimeout(resync, 700);
            }, 0));
        };
    } catch {}

    function ensureThemeOpeningIsolationV263() {
        // Keep loader isolation in the same always-used bundle as showThemeOpeningV207.
        // V261 put this rule in extras-6, which can still be loading when the opening
        // card is first painted. That let the app's animated custom cursor/ring sit
        // directly on top of "Opening Theme" for the first frames.
        if (document.getElementById('theme-builder-opening-isolation-v263')) return;
        const style = document.createElement('style');
        style.id = 'theme-builder-opening-isolation-v263';
        style.textContent = `
            html.theme-builder-single-loader-v261 #custom-cursor-visual,
            html.theme-builder-single-loader-v261 #cursor-fx-layer,
            html.theme-builder-single-loader-v261 .cursor-custom,
            html.theme-builder-single-loader-v261 .dashboard-cursor-trail-v163,
            html.theme-builder-single-loader-v261 #theme-builder-loading-v63,
            html.theme-builder-single-loader-v261 .theme-builder-loading-v63,
            html.theme-builder-single-loader-v261 .theme-builder-loading-spinner-v63 {
                display:none!important;
                visibility:hidden!important;
                opacity:0!important;
                animation:none!important;
                pointer-events:none!important;
            }
            #theme-builder-opening-v207>div::before,
            #theme-builder-opening-v207>div::after,
            #theme-builder-opening-v207>div>strong::before,
            #theme-builder-opening-v207>div>strong::after {
                content:none!important;
                display:none!important;
                animation:none!important;
            }
            html.theme-builder-single-loader-v261 #theme-builder-opening-v207,
            html.theme-builder-single-loader-v261 #theme-builder-opening-v207 * {
                cursor:default!important;
            }
        `;
        document.head.appendChild(style);
    }

    function showThemeOpeningV207() {
        // V263: one loader means one loader. The only animated element allowed on
        // this surface is the small Phosphor spinner to the RIGHT of the label.
        ensureThemeOpeningIsolationV263();
        document.getElementById('theme-builder-loading-v63')?.remove();
        document.querySelectorAll('.theme-builder-loading-v63,.theme-builder-loading-spinner-v63').forEach(node => node.remove());
        document.documentElement.classList.add('theme-builder-single-loader-v261');
        let cover = document.getElementById('theme-builder-opening-v207');
        if (!cover) {
            cover = document.createElement('div');
            cover.id = 'theme-builder-opening-v207';
            cover.innerHTML = '<div><strong>Opening Theme</strong><i class="ph ph-spinner-gap theme-builder-opening-inline-spinner-v263" aria-hidden="true"></i></div>';
            document.body.appendChild(cover);
        } else {
            // Repair any stale card created by an older cached bundle.
            const card = cover.firstElementChild;
            if (card) card.innerHTML = '<strong>Opening Theme</strong><i class="ph ph-spinner-gap theme-builder-opening-inline-spinner-v263" aria-hidden="true"></i>';
        }
        cover.hidden = false;
        return cover;
    }
    function hideThemeOpeningV207() {
        const cover = document.getElementById('theme-builder-opening-v207');
        requestAnimationFrame(() => {
            if (cover) cover.hidden = true;
            document.documentElement.classList.remove('theme-builder-single-loader-v261');
        });
    }
    const yieldPaintV207 = () => new Promise(resolve => requestAnimationFrame(() => setTimeout(resolve, 0)));
    let themeOpenDepthV207 = 0;

    // The expensive edit routines are already promise-aware. Put one paint in
    // front of their theme application/hydration so an Edit click responds now,
    // rather than after applyTheme + CSS capture has blocked the frame.
    try {
        const beforeAnyThemeV207 = openAnyThemeInBuilderV25;
        openAnyThemeInBuilderV25 = async function() {
            if (themeOpenDepthV207) return await beforeAnyThemeV207.apply(this, arguments);
            themeOpenDepthV207++;
            showThemeOpeningV207();
            await yieldPaintV207();
            try { return await beforeAnyThemeV207.apply(this, arguments); }
            finally { themeOpenDepthV207--; hideThemeOpeningV207(); }
        };
    } catch {}
    try {
        const beforeCopyThemeV207 = openThemeCopyInBuilderV30;
        openThemeCopyInBuilderV30 = async function() {
            if (themeOpenDepthV207) return await beforeCopyThemeV207.apply(this, arguments);
            themeOpenDepthV207++;
            showThemeOpeningV207();
            await yieldPaintV207();
            try { return await beforeCopyThemeV207.apply(this, arguments); }
            finally { themeOpenDepthV207--; hideThemeOpeningV207(); }
        };
    } catch {}
})();

// V207 — never let idle Theme Builder prewarming interrupt an open settings modal
// or a just-received user input. It can try again on a genuinely idle turn.
(() => {
    try {
        const prepareBeforeV207 = window.__loggyPrepareBlankThemeV175;
        if (typeof prepareBeforeV207 !== 'function') return;
        let lastInput = performance.now();
        let retryScheduled = false;
        const mark = () => { lastInput = performance.now(); };
        document.addEventListener('pointerdown', mark, { capture:true, passive:true });
        document.addEventListener('keydown', mark, true);
        window.__loggyPrepareBlankThemeV175 = function() {
            const settings = document.getElementById('daily-settings-modal');
            const busy = settings && !settings.classList.contains('hidden');
            if (busy || performance.now() - lastInput < 900) {
                if (!retryScheduled) {
                    retryScheduled = true;
                    const retry = () => { retryScheduled = false; try { window.__loggyPrepareBlankThemeV175(); } catch {} };
                    if ('requestIdleCallback' in window) requestIdleCallback(retry, { timeout:5000 });
                    else setTimeout(retry, 1800);
                }
                return null;
            }
            return prepareBeforeV207.apply(this, arguments);
        };
    } catch {}
})();

// ============================================================
// V211 — FINAL KB PLACEHOLDER PERSISTENCE + NON-BLOCKING THEME EDIT/JSON IMPORT
// ============================================================
(() => {
    'use strict';
    if (window.__loggyV211Reliability) return;
    window.__loggyV211Reliability = true;

    const q = (s, r = document) => r?.querySelector?.(s) || null;
    const qa = (s, r = document) => Array.from(r?.querySelectorAll?.(s) || []);
    const clone = value => {
        try { return structuredClone(value); }
        catch { try { return JSON.parse(JSON.stringify(value)); } catch { return value; } }
    };
    const nextPaint = () => new Promise(resolve => requestAnimationFrame(() => resolve()));
    const idle = (fn, timeout = 220) => {
        if ('requestIdleCallback' in window) requestIdleCallback(() => fn(), { timeout });
        else setTimeout(fn, 0);
    };

    // ---------------- KB placeholder display ----------------
    function visiblePatternTitleV211(id) {
        return String(id ?? '').replace(/\\([a-z0-9_\-\u00C0-\u024F\u1100-\u11FF\u3130-\u318F\uAC00-\uD7AF]+)/gi,
            (_, token) => String(token).toUpperCase());
    }

    function allKnowledgeIdsV211() {
        const ids = new Set();
        try { Object.keys(db?.phrase_meta || {}).forEach(id => ids.add(String(id))); } catch {}
        try { Object.keys(db?.progress || {}).forEach(id => ids.add(String(id))); } catch {}
        try {
            Object.values(db?.days || {}).forEach(day => (day?.phrases || []).forEach(id => ids.add(String(id))));
        } catch {}
        return [...ids];
    }

    function displayLabelV211(id, context) {
        try {
            const label = window.getKnowledgeDisplayLabelV162?.(id, context);
            if (label != null && String(label) !== String(id)) return String(label);
        } catch {}
        return visiblePatternTitleV211(id);
    }

    function resolveCardIdV211(card, title, context) {
        const explicit = card?.dataset?.kbItemIdV162 || card?.dataset?.kbItemIdV163 || card?.dataset?.kbItemId;
        if (explicit) return String(explicit);
        const shown = String(title?.textContent || '').trim();
        if (!shown) return '';
        const ids = allKnowledgeIdsV211();
        const exact = ids.find(id => id === shown);
        if (exact) return exact;
        const match = ids.find(id => displayLabelV211(id, context) === shown || visiblePatternTitleV211(id) === shown);
        return match || '';
    }

    function repairKnowledgeTitlesV211() {
        qa('#phrases-library-grid .phrase-card, #phrases-library-grid .polaroid-card').forEach(card => {
            const title = q('.kb-library-item-title', card);
            if (!title) return;
            const id = resolveCardIdV211(card, title, 'kb');
            if (!id) return;
            card.dataset.kbItemIdV162 = id;
            const label = (() => {
                try {
                    const custom = window.getKnowledgeDisplayLabelV162?.(id, 'kb');
                    if (custom != null && String(custom) !== id) return String(custom);
                } catch {}
                return null;
            })();
            if (label != null) title.textContent = label;
            else if (String(id).includes('\\')) {
                try { title.innerHTML = placeholderTokenHtmlV56(id); }
                catch { title.textContent = visiblePatternTitleV211(id); }
            } else title.textContent = id;
        });

        const dayIds = (() => {
            try { return currentDay ? (db?.days?.[currentDay]?.phrases || []).map(String) : []; }
            catch { return []; }
        })();
        qa('#phrases-container .chip').forEach((chip, index) => {
            const title = q('.kb-day-item-title', chip);
            const id = dayIds[index] || chip.dataset.kbItemIdV162 || '';
            if (!title || !id) return;
            chip.dataset.kbItemIdV162 = id;
            let custom = null;
            try {
                const value = window.getKnowledgeDisplayLabelV162?.(id, 'everywhere');
                if (value != null && String(value) !== String(id)) custom = String(value);
            } catch {}
            if (custom != null) title.textContent = custom;
            else if (String(id).includes('\\')) {
                try { title.innerHTML = placeholderTokenHtmlV56(id); }
                catch { title.textContent = visiblePatternTitleV211(id); }
            } else title.textContent = id;
        });
    }

    try {
        const before = renderPhrasesLibrary;
        renderPhrasesLibrary = function() {
            const result = before.apply(this, arguments);
            repairKnowledgeTitlesV211();
            requestAnimationFrame(repairKnowledgeTitlesV211);
            return result;
        };
    } catch {}
    try {
        const before = renderPhrases;
        renderPhrases = function() {
            const result = before.apply(this, arguments);
            repairKnowledgeTitlesV211();
            requestAnimationFrame(repairKnowledgeTitlesV211);
            return result;
        };
    } catch {}
    requestAnimationFrame(repairKnowledgeTitlesV211);

    // V214: removed the V211 shortcut Theme Builder hydrator.
    // It bypassed the real populateThemeBuilder chain, which is where the
    // color accordions, page backdrops, background-image controls, decoration
    // gallery and Trinkets panel are created/wired. Theme Builder now uses the
    // complete feature-preserving path again; JSON import gets its own bounded
    // performance path in template-extras-4.js.

})();


// ============================================================
// V212 — removed (V215 below is the single, authoritative KB Edit Field
// top-layer implementation). Having two competing patches both calling
// showPopover()/hidePopover() and re-parenting the same modal element was
// the cause of the freeze / disappearing editor.
// ============================================================

// ============================================================
// V213 — Pinned-map label layout lifecycle
// Labels must be positioned against the CURRENT rendered map size. The map is
// reparented when leaving Place Pins, and read-only maps are inserted while the
// item modal is still hidden. Both cases previously left stale/full-screen or
// 0,0 label coordinates until a browser resize happened.
// ============================================================
(() => {
    'use strict';
    if (window.__loggyPinnedLabelLifecycleV213) return;
    window.__loggyPinnedLabelLifecycleV213 = true;

    const observedStagesV213 = new WeakSet();
    let resizeObserverV213 = null;
    try {
        resizeObserverV213 = new ResizeObserver(entries => {
            for (const entry of entries) scheduleStageV213(entry.target, false);
        });
    } catch {}

    function stagesInV213(root) {
        if (!root) return [];
        if (root.matches?.('.kb-pinned-stage-v169')) return [root];
        return [...(root.querySelectorAll?.('.kb-pinned-stage-v169') || [])];
    }

    function layoutStageNowV213(stage) {
        if (!stage?.isConnected) return false;
        const rect = stage.getBoundingClientRect();
        if (!rect.width || !rect.height) return false;
        try { window.__layoutPinnedLabelsV170?.(stage); } catch { return false; }
        stage.dataset.labelLayoutV213 = `${Math.round(rect.width)}x${Math.round(rect.height)}`;
        return true;
    }

    function watchStageV213(stage) {
        if (!stage || observedStagesV213.has(stage)) return;
        observedStagesV213.add(stage);
        try { resizeObserverV213?.observe(stage); } catch {}
        const img = stage.querySelector(':scope > img');
        if (!img) return;
        const afterImage = () => scheduleStageV213(stage, true);
        img.addEventListener('load', afterImage, { passive:true });
        if (img.complete && typeof img.decode === 'function') {
            img.decode().then(afterImage).catch(() => {});
        }
    }

    function scheduleStageV213(stage, settle = true) {
        if (!stage) return;
        watchStageV213(stage);
        if (stage.dataset.labelLayoutQueuedV213 === '1') return;
        stage.dataset.labelLayoutQueuedV213 = '1';
        requestAnimationFrame(() => {
            stage.dataset.labelLayoutQueuedV213 = '0';
            layoutStageNowV213(stage);
            if (!settle) return;
            // One extra frame catches modal width/flex calculations that finish
            // immediately after the stage is inserted or reparented.
            requestAnimationFrame(() => layoutStageNowV213(stage));
        });
    }

    function scheduleRootV213(root, settle = true) {
        stagesInV213(root).forEach(stage => scheduleStageV213(stage, settle));
    }

    // Keep the public layout helper useful for all existing callers while also
    // installing image/ResizeObserver lifecycle handling for those stages.
    const previousLayoutV213 = window.__layoutPinnedLabelsV170;
    if (typeof previousLayoutV213 === 'function') {
        window.__layoutPinnedLabelsV170 = function(root = document) {
            const result = previousLayoutV213(root);
            stagesInV213(root).forEach(watchStageV213);
            return result;
        };
    }

    // Add/Edit Item are the two problematic surfaces. Observe only these modal
    // roots, and only react when a pinned-map stage is actually added or when
    // the modal itself becomes visible. This avoids any page-wide observer.
    function bindModalV213(modal) {
        if (!modal || modal.dataset.pinLabelLifecycleV213 === '1') return;
        modal.dataset.pinLabelLifecycleV213 = '1';

        new MutationObserver(records => {
            let needsLayout = false;
            for (const record of records) {
                for (const node of record.addedNodes || []) {
                    if (!(node instanceof Element)) continue;
                    if (node.matches?.('.kb-pinned-stage-v169') || node.querySelector?.('.kb-pinned-stage-v169')) {
                        needsLayout = true;
                        break;
                    }
                }
                if (needsLayout) break;
            }
            if (needsLayout) scheduleRootV213(modal, true);
        }).observe(modal, { childList:true, subtree:true });

        new MutationObserver(() => {
            if (!modal.classList.contains('hidden')) scheduleRootV213(modal, true);
        }).observe(modal, { attributes:true, attributeFilter:['class'] });

        // Existing stage, if any.
        scheduleRootV213(modal, true);
    }

    ['add-item-modal','phrase-modal'].forEach(id => bindModalV213(document.getElementById(id)));

    // Read-only Open Item maps are built while the modal is hidden. Schedule
    // again synchronously after the opener finishes so labels never stay at 0,0.
    try {
        const beforeOpenItemV213 = openItemModal;
        openItemModal = function() {
            const result = beforeOpenItemV213.apply(this, arguments);
            const modal = document.getElementById('phrase-modal');
            scheduleRootV213(modal, true);
            return result;
        };
        window.openItemModal = openItemModal;
    } catch {}

    // Expose a tiny targeted helper for future pinned-map renderers.
    window.__loggyPinnedLabelLifecycleV213 = {
        layout: root => scheduleRootV213(root || document, true)
    };
})();

// ============================================================
// Theme Builder structure is owned by the single installer in template-extras-1.js.


// ============================================================
// V215 — KB nested modal, ordering, selection and layout stability
// ============================================================
(() => {
    'use strict';
    if (window.__loggyKbV215) return;
    window.__loggyKbV215 = true;

    const qV215 = (s, r=document) => r?.querySelector?.(s) || null;
    const qaV215 = (s, r=document) => Array.from(r?.querySelectorAll?.(s) || []);

    // One-time migration: placeholders now start enabled by default. After this
    // migration the user's own toggle choice is respected normally.
    try {
        db.settings ||= {};
        if (!db.settings.knowledgePlaceholdersDefaultMigratedV215) {
            db.settings.knowledgePlaceholdersEnabledV56 = true;
            db.settings.knowledgePlaceholdersDefaultMigratedV215 = true;
            try { saveDb(); } catch {}
        }
    } catch {}

    // --------------------------------------------------------
    // Edit Field must be above KB Settings from the FIRST paint.
    // The older wrapper could run before the original opener actually removed
    // `.hidden`, so it missed the initial promotion and only looked correct
    // after another click. Watch only this modal's visibility and promote on
    // the exact hidden -> visible transition.
    // --------------------------------------------------------
    function isOpenV215(modal) {
        return !!modal && !modal.classList.contains('hidden');
    }
    function forceFieldEditorFrontV215() {
        const modal = qV215('#kb-field-create-modal');
        if (!isOpenV215(modal)) return;

        if (modal.parentElement !== document.body || modal !== document.body.lastElementChild) {
            document.body.appendChild(modal);
        }
        modal.classList.add('kb-field-front-v215');
        modal.removeAttribute('inert');
        modal.removeAttribute('aria-hidden');
        try { modal.inert = false; } catch {}
        // Max z-index alone reliably wins the stacking order here - no need for
        // the Popover API. Mixing showPopover()/hidePopover() with the repeated
        // DOM re-parenting several patches do to this same modal was fragile
        // and the likely cause of the freeze / the editor failing to appear.
        modal.style.setProperty('z-index', '2147483647', 'important');
        modal.style.setProperty('pointer-events', 'auto', 'important');

        const parent = qV215('#settings-modal:not(.hidden)');
        if (parent) {
            if (parent.dataset.kbFieldPreviousZV215 === undefined) {
                parent.dataset.kbFieldPreviousZV215 = parent.style.getPropertyValue('z-index') || '';
                parent.dataset.kbFieldPreviousZPriorityV215 = parent.style.getPropertyPriority('z-index') || '';
            }
            parent.classList.add('kb-settings-under-field-v215');
            parent.style.setProperty('z-index', '2147483500', 'important');
        }
    }
    function closeFieldEditorLayerV215() {
        const modal = qV215('#kb-field-create-modal');
        if (!modal) return;
        const parent = qV215('#settings-modal');
        if (parent) {
            parent.classList.remove('kb-settings-under-field-v215');
            if (parent.dataset.kbFieldPreviousZV215 !== undefined) {
                const value = parent.dataset.kbFieldPreviousZV215;
                const priority = parent.dataset.kbFieldPreviousZPriorityV215 || '';
                if (value) parent.style.setProperty('z-index', value, priority);
                else parent.style.removeProperty('z-index');
                delete parent.dataset.kbFieldPreviousZV215;
                delete parent.dataset.kbFieldPreviousZPriorityV215;
            }
        }
    }
    function bindFieldEditorLayerV215() {
        const modal = qV215('#kb-field-create-modal');
        if (!modal || modal.dataset.frontLifecycleV215 === '1') return;
        modal.dataset.frontLifecycleV215 = '1';
        new MutationObserver(() => {
            if (isOpenV215(modal)) {
                // Microtask gives the original opener time to finish populating
                // while still promoting before the next browser paint.
                queueMicrotask(forceFieldEditorFrontV215);
            } else {
                closeFieldEditorLayerV215();
            }
        }).observe(modal, {attributes:true, attributeFilter:['class']});
        if (isOpenV215(modal)) forceFieldEditorFrontV215();
    }

    try {
        const ensureBeforeV215 = ensureKnowledgeFieldCreateModal;
        ensureKnowledgeFieldCreateModal = function() {
            const result = ensureBeforeV215.apply(this, arguments);
            bindFieldEditorLayerV215();
            return result;
        };
    } catch {}
    try {
        const openBeforeV215 = openKnowledgeFieldCreateModal;
        openKnowledgeFieldCreateModal = function() {
            const result = openBeforeV215.apply(this, arguments);
            bindFieldEditorLayerV215();
            queueMicrotask(forceFieldEditorFrontV215);
            requestAnimationFrame(forceFieldEditorFrontV215);
            return result;
        };
        window.openKnowledgeFieldCreateModal = openKnowledgeFieldCreateModal;
    } catch {}
    // NOTE: previously this also re-ran forceFieldEditorFrontV215 on every
    // pointerdown/click while the editor was open, which re-parents
    // (document.body.appendChild) and re-shows an already-open popover on
    // every click. Re-parenting a live open popover repeatedly is what was
    // causing the freeze / the editor failing to appear. The class-change
    // MutationObserver in bindFieldEditorLayerV215 above already promotes it
    // once, synchronously, the moment it opens — that's sufficient.
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', bindFieldEditorLayerV215, {once:true});
    else bindFieldEditorLayerV215();

    // --------------------------------------------------------
    // Knowledge Base ordering setting: use the stable insertion order in
    // db.phrases as creation order. Descending means newest cards first.
    // --------------------------------------------------------
    function ensureKbOrderSettingV215() {
        const modal = qV215('#settings-modal');
        const categoryTabs = qV215('#settings-category-tabs');
        if (!modal || !categoryTabs) return;
        db.settings ||= {};
        if (!['created-asc','created-desc'].includes(db.settings.kbItemOrderV215)) {
            db.settings.kbItemOrderV215 = 'created-desc';
        }
        let section = qV215('#kb-item-order-setting-v215', modal);
        if (!section) {
            section = document.createElement('section');
            section.id = 'kb-item-order-setting-v215';
            section.className = 'modal-section kb-item-order-setting-v215';
            section.innerHTML = `
                <span class="field-label">Knowledge Base Item Order</span>
                <div class="set-size-picker kb-item-order-options-v216" style="margin-top:6px;" role="radiogroup" aria-label="Knowledge Base item order">
                    <button type="button" class="filter-tab kb-item-order-btn-v216" data-order="created-desc" role="radio">Newest First</button>
                    <button type="button" class="filter-tab kb-item-order-btn-v216" data-order="created-asc" role="radio">Oldest First</button>
                </div>`;
            const categorySection = categoryTabs.closest('.modal-section');
            categorySection?.insertAdjacentElement('beforebegin', section);
            qaV215('.kb-item-order-btn-v216', section).forEach(button => {
                button.addEventListener('click', () => {
                    db.settings.kbItemOrderV215 = button.dataset.order === 'created-asc' ? 'created-asc' : 'created-desc';
                    qaV215('.kb-item-order-btn-v216', section).forEach(btn => {
                        const active = btn.dataset.order === db.settings.kbItemOrderV215;
                        btn.classList.toggle('active', active);
                        btn.setAttribute('aria-checked', active ? 'true' : 'false');
                    });
                    try { saveDb(); } catch {}
                    try { renderPhrasesLibrary(qV215('#phrases-search-bar')?.value || ''); } catch {}
                });
            });
        }
        qaV215('.kb-item-order-btn-v216', section).forEach(btn => {
            const active = btn.dataset.order === db.settings.kbItemOrderV215;
            btn.classList.toggle('active', active);
            btn.setAttribute('aria-checked', active ? 'true' : 'false');
        });
    }

    // Keep the KB settings in the requested visual order: recommendation first,
    // then placeholders immediately underneath it. This runs after the historical
    // render wrappers because both sections are created dynamically.
    function positionKbSettingsV216() {
        const modal = qV215('#settings-modal');
        const box = qV215(':scope > .modal-box', modal);
        const recommendation = qV215('.kb-daily-recommend-setting-v173', box);
        const placeholders = qV215('.kb-placeholder-settings-v56,#kb-placeholder-settings-v56', box);
        if (recommendation && placeholders && recommendation.nextElementSibling !== placeholders) {
            recommendation.insertAdjacentElement('afterend', placeholders);
        }
        const order = qV215('#kb-item-order-setting-v215', box);
        const viewButton = qV215('.kb-view-btn', box);
        const viewSection = viewButton?.closest('.modal-section');
        if (viewSection && order && viewSection.nextElementSibling !== order) {
            // Requested order: Knowledge Base View -> Knowledge Base Item Order -> Categories.
            viewSection.insertAdjacentElement('afterend', order);
        }
    }

    // Reorder already-rendered cards immediately after the core renderer. This
    // keeps every later card decorator/primary-map pass working on the final DOM
    // order without rewriting the historical renderer chain.
    function applyKbOrderV215() {
        const grid = qV215('#phrases-library-grid');
        if (!grid) return;
        const rank = new Map((db.phrases || []).map((id, index) => [String(id), index]));
        const desc = (db.settings?.kbItemOrderV215 || 'created-desc') !== 'created-asc';
        const cards = qaV215(':scope > .phrase-card, :scope > .polaroid-card', grid);
        cards.sort((a,b) => {
            const ai = rank.get(String(a.dataset.kbItemIdV162 || a.dataset.kbItemIdV163 || '')) ?? 0;
            const bi = rank.get(String(b.dataset.kbItemIdV162 || b.dataset.kbItemIdV163 || '')) ?? 0;
            return desc ? bi-ai : ai-bi;
        });
        const frag = document.createDocumentFragment();
        cards.forEach(card => frag.appendChild(card));
        grid.appendChild(frag);
    }

    // --------------------------------------------------------
    // Card order only. Layout is NOT owned here anymore; V683 is the single
    // Knowledge Base layout owner for fresh, restored, and large libraries.
    // --------------------------------------------------------
    try {
        const beforeLibraryV215 = renderPhrasesLibrary;
        renderPhrasesLibrary = function() {
            const result = beforeLibraryV215.apply(this, arguments);
            applyKbOrderV215();
            return result;
        };
        window.renderPhrasesLibrary = renderPhrasesLibrary;
    } catch {}

    // --------------------------------------------------------
    // Multi-select is card selection, never browser text selection.
    // --------------------------------------------------------
    document.addEventListener('selectstart', event => {
        if (!qV215('#kb-select-toggle-v163.selected')) return;
        if (event.target?.closest?.('#phrases-library-grid .phrase-card,#phrases-library-grid .polaroid-card')) {
            event.preventDefault();
        }
    }, true);

    try {
        const settingsBeforeV215 = renderSettings;
        renderSettings = function() {
            const result = settingsBeforeV215.apply(this, arguments);
            ensureKbOrderSettingV215();
    requestAnimationFrame(positionKbSettingsV216);
            // Make the default-on migration visible in the switch immediately.
            const toggle = qV215('.kb-placeholders-enabled-v56');
            if (toggle) {
                toggle.checked = db.settings?.knowledgePlaceholdersEnabledV56 !== false;
                toggle.setAttribute('aria-checked', toggle.checked ? 'true' : 'false');
            }
            return result;
        };
        window.renderSettings = renderSettings;
    } catch {}

    ensureKbOrderSettingV215();
})();

// ============================================================
// V221/V222 — existing-log-safe Knowledge Base Add/Edit Field editor
// This block is deliberately self-contained. Existing logs run copied core JS,
// so Add Field must not depend on any helper added only to the newest template.js.
// It also avoids the historical openKnowledgeFieldCreateModal wrapper chain.
// ============================================================
(() => {
    'use strict';
    if (window.__loggyKbAddFieldSafeV221) return;
    window.__loggyKbAddFieldSafeV221 = true;

    const MODAL_ID = 'kb-field-create-modal-v221';

    // V223: the app's generic modal promoter can rewrite the safe editor's
    // z-index after it opens. Keep this child editor above Knowledge Base
    // Settings for the entire time it is visible, and restore the parent when
    // the editor closes.
    const FIELD_FRONT_Z_V223 = '2147483647';
    const SETTINGS_UNDER_Z_V223 = '2147483000';

    function setImportantV223(node, property, value) {
        if (!node) return;
        if (node.style.getPropertyValue(property) === value &&
            node.style.getPropertyPriority(property) === 'important') return;
        node.style.setProperty(property, value, 'important');
    }

    function settingsModalV223() {
        return document.getElementById('settings-modal');
    }

    function restoreFieldStackV223() {
        const settings = settingsModalV223();
        if (!settings || settings.dataset.kbSafeStackSavedV223 !== '1') return;
        const value = settings.dataset.kbSafePrevZV223 || '';
        const priority = settings.dataset.kbSafePrevZPriorityV223 || '';
        if (value) settings.style.setProperty('z-index', value, priority);
        else settings.style.removeProperty('z-index');
        delete settings.dataset.kbSafeStackSavedV223;
        delete settings.dataset.kbSafePrevZV223;
        delete settings.dataset.kbSafePrevZPriorityV223;
    }

    function forceFieldStackV223(modal) {
        if (!modal || modal.classList.contains('hidden')) return;

        // Being the last body child also wins ties if another old layer reaches
        // the browser's maximum integer z-index.
        if (modal.parentElement !== document.body || modal !== document.body.lastElementChild) {
            document.body.appendChild(modal);
        }

        setImportantV223(modal, 'position', 'fixed');
        setImportantV223(modal, 'z-index', FIELD_FRONT_Z_V223);
        setImportantV223(modal, 'pointer-events', 'auto');

        const box = modal.querySelector('.kb-field-safe-box-v221');
        if (box) {
            setImportantV223(box, 'position', 'relative');
            setImportantV223(box, 'z-index', FIELD_FRONT_Z_V223);
        }

        const settings = settingsModalV223();
        if (settings && !settings.classList.contains('hidden')) {
            if (settings.dataset.kbSafeStackSavedV223 !== '1') {
                settings.dataset.kbSafeStackSavedV223 = '1';
                settings.dataset.kbSafePrevZV223 = settings.style.getPropertyValue('z-index') || '';
                settings.dataset.kbSafePrevZPriorityV223 = settings.style.getPropertyPriority('z-index') || '';
            }
            setImportantV223(settings, 'z-index', SETTINGS_UNDER_Z_V223);
        }
    }

    function bindFieldStackGuardV223(modal) {
        if (!modal || modal.dataset.kbFieldStackGuardV223 === '1') return;
        modal.dataset.kbFieldStackGuardV223 = '1';

        let queued = false;
        const reconcile = () => {
            if (queued) return;
            queued = true;
            queueMicrotask(() => {
                queued = false;
                if (modal.classList.contains('hidden')) restoreFieldStackV223();
                else forceFieldStackV223(modal);
            });
        };

        new MutationObserver(reconcile).observe(modal, {
            attributes: true,
            attributeFilter: ['class', 'style']
        });

        const settings = settingsModalV223();
        if (settings) {
            new MutationObserver(() => {
                if (!modal.classList.contains('hidden')) reconcile();
            }).observe(settings, {
                attributes: true,
                attributeFilter: ['class', 'style']
            });
        }

        // The generic modal promoter runs around user actions/requestAnimationFrame.
        // Reassert once after those same actions so it cannot leave the editor behind.
        document.addEventListener('pointerdown', () => {
            if (!modal.classList.contains('hidden')) requestAnimationFrame(() => forceFieldStackV223(modal));
        }, true);
        document.addEventListener('click', () => {
            if (!modal.classList.contains('hidden')) requestAnimationFrame(() => forceFieldStackV223(modal));
        }, true);

        reconcile();
    }

    function categoriesV221() {
        try {
            return Array.isArray(db?.settings?.categories)
                ? db.settings.categories.map(value => String(value))
                : [];
        } catch {
            return [];
        }
    }

    function activeCategoryV221() {
        const categories = categoriesV221();
        if (!categories.length) return '';

        try {
            if (
                typeof activeCategorySettingTab !== 'undefined' &&
                categories.includes(String(activeCategorySettingTab || ''))
            ) {
                return String(activeCategorySettingTab);
            }
        } catch {}

        const activeButton = document.querySelector(
            '#settings-category-tabs .kb-category-grid-item.active:not(.kb-category-grid-add)'
        );
        const activeLabel = String(activeButton?.textContent || '').trim();
        if (categories.includes(activeLabel)) return activeLabel;

        const selectedLabel = String(
            document.getElementById('kb-selected-category-name')?.textContent || ''
        ).trim();
        if (categories.includes(selectedLabel)) return selectedLabel;

        return categories[0] || '';
    }

    function configV221(category) {
        try {
            if (typeof getCategoryConfig === 'function') {
                const config = getCategoryConfig(category);
                if (config && Array.isArray(config.fields)) return config;
            }
        } catch (error) {
            console.warn('KB V221 getCategoryConfig fallback', error);
        }

        try {
            db.settings ||= {};
            db.settings.categorySettings ||= {};
            const current = db.settings.categorySettings[category];
            const config = current && typeof current === 'object' ? current : {};
            if (!Array.isArray(config.fields)) config.fields = [];
            db.settings.categorySettings[category] = config;
            return config;
        } catch {
            return null;
        }
    }

    function idV221(name) {
        try {
            if (typeof knowledgeFieldId === 'function') return knowledgeFieldId(name);
        } catch {}
        return `kb-field-${String(name || 'field')
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '')}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    }

    function toastV221(message) {
        try {
            if (typeof showFeatureToast === 'function') {
                showFeatureToast(message);
                return;
            }
        } catch {}
        try { window.alert(message); } catch {}
    }

    function parseOptionsV221(value) {
        return Array.from(new Set(
            String(value || '')
                .split(/[\n,]+/)
                .map(value => value.trim())
                .filter(Boolean)
        ));
    }

    function ensureModalV221() {
        let modal = document.getElementById(MODAL_ID);
        if (modal) return modal;

        modal = document.createElement('div');
        modal.id = MODAL_ID;
        modal.className = 'modal-overlay hidden kb-field-safe-modal-v221';
        modal.setAttribute('aria-hidden', 'true');
        modal.innerHTML = `
            <div class="modal-box kb-field-create-modal-box kb-field-safe-box-v221" role="dialog" aria-modal="true" aria-labelledby="kb-field-title-v221">
                <div class="modal-header">
                    <h2 id="kb-field-title-v221">Add Field</h2>
                    <button type="button" class="small-icon-btn kb-field-close-v221" title="Close" aria-label="Close"><i class="ph ph-x"></i></button>
                </div>

                <div class="modal-section">
                    <span class="field-label">Field Name</span>
                    <input type="text" class="kb-field-name-v221" placeholder="e.g. Meaning, Tutorial, Reference Image" maxlength="48">
                </div>

                <div class="modal-section">
                    <span class="field-label">Field Type</span>
                    <div class="kb-field-modal-icons kb-field-kinds-v221">
                        <button type="button" class="kb-clean-icon-option selected" data-kind-v221="text" data-tip="Plain text" aria-label="Plain text"><i class="ph ph-text-t"></i></button>
                        <button type="button" class="kb-clean-icon-option" data-kind-v221="video" data-tip="YouTube or MP4" aria-label="Video"><i class="ph ph-video-camera"></i></button>
                        <button type="button" class="kb-clean-icon-option" data-kind-v221="image" data-tip="Image upload" aria-label="Image"><i class="ph ph-image"></i></button>
                        <button type="button" class="kb-clean-icon-option" data-kind-v221="svg" data-tip="SVG code" aria-label="SVG"><i class="ph ph-code"></i></button>
                        <button type="button" class="kb-clean-icon-option" data-kind-v221="select" data-tip="Dropdown / custom options" aria-label="Dropdown"><i class="ph ph-list-bullets"></i></button>
                        <button type="button" class="kb-clean-icon-option" data-kind-v221="rating" data-tip="Star rating" aria-label="Star rating"><i class="ph ph-star"></i></button>
                        <button type="button" class="kb-clean-icon-option" data-kind-v221="pinnedImage" data-tip="Pinned image / map" aria-label="Pinned image or map"><i class="ph ph-map-pin"></i></button>
                    </div>
                </div>

                <div class="modal-section">
                    <span class="field-label">Options</span>
                    <div class="kb-field-modal-icons">
                        <button type="button" class="kb-clean-icon-option kb-field-pronunciation-v221" data-tip="Enable pronunciation" aria-label="Enable pronunciation"><i class="ph ph-speaker-high"></i></button>
                        <button type="button" class="kb-clean-icon-option selected kb-field-quiz-v221" data-tip="Show on quiz card back" aria-label="Show on quiz card back"><i class="ph ph-cards"></i></button>
                        <button type="button" class="kb-clean-icon-option kb-field-editable-v221" data-tip="Allow editing from Daily Logs" aria-label="Allow editing from Daily Logs"><i class="ph ph-cursor-text"></i></button>
                        <button type="button" class="kb-clean-icon-option kb-field-primary-quiz-v476" data-tip="On Quizlet Learn Written mode, this field is what you have to write in order to learn the card" aria-label="On Quizlet Learn Written mode, this field is what you have to write in order to learn the card"><i class="ph ph-star"></i></button>
                    </div>
                </div>

                <div class="modal-section hidden kb-field-language-section-v221">
                    <span class="field-label">Translation Language Code</span>
                    <input type="text" class="kb-field-language-v221" placeholder="e.g. ko, es, en, fr, ja" maxlength="10" value="ko">
                </div>

                <div class="modal-section hidden kb-field-select-section-v221">
                    <span class="field-label">Dropdown Options</span>
                    <textarea class="kb-field-options-v221" rows="4" placeholder="Verb&#10;Noun&#10;Adjective"></textarea>
                    <p class="progress-hint">Add one option per line or separate options with commas.</p>
                </div>

                <div class="modal-section hidden kb-field-rating-section-v221">
                    <span class="field-label">Maximum Rating</span>
                    <input type="number" class="kb-field-rating-v221" min="1" max="10" step="1" value="5">
                </div>

                <div class="modal-section hidden kb-field-pin-section-v221">
                    <span class="field-label">Default Pin Color</span>
                    <input type="color" class="kb-field-pin-color-v221" value="#e53935">
                </div>

                <button type="button" class="icon-btn kb-modal-primary kb-field-save-v221" data-enter-submit="true">Add Field</button>
            </div>
        `;

        const style = document.createElement('style');
        style.id = 'kb-field-safe-style-v221';
        style.textContent = `
            #${MODAL_ID}.kb-field-safe-modal-v221:not(.hidden){position:fixed!important;inset:0!important;width:100vw!important;height:100dvh!important;margin:0!important;padding:20px!important;display:flex!important;align-items:center!important;justify-content:center!important;overflow:auto!important;background:var(--overlay-scrim,rgba(0,0,0,.55))!important;z-index:2147483647!important;pointer-events:auto!important;visibility:visible!important;opacity:1!important;}
            #${MODAL_ID}.hidden{display:none!important;}
            #${MODAL_ID} .kb-field-safe-box-v221{position:relative!important;z-index:1!important;width:min(480px,calc(100vw - 40px))!important;max-width:480px!important;max-height:calc(100dvh - 40px)!important;overflow:auto!important;pointer-events:auto!important;}
            #${MODAL_ID} .kb-field-kinds-v221{gap:10px!important;}
            #${MODAL_ID} input[type="number"]{width:100%;padding:10px;border:var(--thin-border);border-radius:var(--border-radius);font:inherit;background:var(--white);color:var(--black);}
            #${MODAL_ID} input[type="color"]{width:46px;height:38px;padding:2px;border:var(--thin-border);border-radius:8px;background:var(--white);}
        `;
        if (!document.getElementById(style.id)) document.head.appendChild(style);
        document.body.appendChild(modal);

        const state = {
            kind: 'text',
            pronunciation: false,
            quiz: true,
            quizPrimary: false,
            editable: false,
            category: '',
            editingId: ''
        };
        modal.__kbFieldStateV221 = state;

        const sync = () => {
            modal.querySelectorAll('[data-kind-v221]').forEach(button => {
                button.classList.toggle('selected', button.dataset.kindV221 === state.kind);
            });
            modal.querySelector('.kb-field-pronunciation-v221')?.classList.toggle('selected', state.pronunciation);
            modal.querySelector('.kb-field-quiz-v221')?.classList.toggle('selected', state.quiz);
            modal.querySelector('.kb-field-primary-quiz-v476')?.classList.toggle('selected', state.quizPrimary);
            modal.querySelector('.kb-field-editable-v221')?.classList.toggle('selected', state.editable);
            modal.querySelector('.kb-field-language-section-v221')?.classList.toggle('hidden', !state.pronunciation);
            modal.querySelector('.kb-field-select-section-v221')?.classList.toggle('hidden', state.kind !== 'select');
            modal.querySelector('.kb-field-rating-section-v221')?.classList.toggle('hidden', state.kind !== 'rating');
            modal.querySelector('.kb-field-pin-section-v221')?.classList.toggle('hidden', state.kind !== 'pinnedImage');
        };

        const close = () => {
            modal.classList.add('hidden');
            modal.setAttribute('aria-hidden', 'true');
            restoreFieldStackV223();
        };

        modal.querySelectorAll('[data-kind-v221]').forEach(button => {
            button.addEventListener('click', () => {
                state.kind = button.dataset.kindV221 || 'text';
                sync();
            });
        });
        modal.querySelector('.kb-field-pronunciation-v221')?.addEventListener('click', () => {
            state.pronunciation = !state.pronunciation;
            sync();
        });
        modal.querySelector('.kb-field-quiz-v221')?.addEventListener('click', () => {
            state.quiz = !state.quiz;
            if (!state.quiz) state.quizPrimary = false;
            sync();
        });
        modal.querySelector('.kb-field-primary-quiz-v476')?.addEventListener('click', () => {
            state.quizPrimary = !state.quizPrimary;
            if (state.quizPrimary) state.quiz = true;
            sync();
        });
        modal.querySelector('.kb-field-editable-v221')?.addEventListener('click', () => {
            state.editable = !state.editable;
            sync();
        });
        modal.querySelector('.kb-field-close-v221')?.addEventListener('click', close);
        modal.addEventListener('click', event => {
            if (event.target === modal) close();
        });

        const save = () => {
            const category = state.category || activeCategoryV221();
            const name = String(modal.querySelector('.kb-field-name-v221')?.value || '').trim();
            if (!category) {
                toastV221('Select a category first.');
                return;
            }
            if (!name) {
                modal.querySelector('.kb-field-name-v221')?.focus();
                return;
            }

            const config = configV221(category);
            if (!config || !Array.isArray(config.fields)) {
                toastV221('Could not load this category.');
                return;
            }

            const editingIndex = state.editingId
                ? config.fields.findIndex(field =>
                    field && typeof field === 'object' &&
                    String(field.id || '') === String(state.editingId)
                )
                : -1;

            const duplicate = config.fields.some((field, index) =>
                index !== editingIndex &&
                String(typeof field === 'string' ? field : field?.name || '')
                    .trim().toLowerCase() === name.toLowerCase()
            );
            if (duplicate) {
                toastV221('That field already exists in this category.');
                return;
            }

            const language = String(modal.querySelector('.kb-field-language-v221')?.value || '').trim() || (() => {
                try { return db.settings?.ttsLang || 'ko'; } catch { return 'ko'; }
            })();

            const existingField =
                editingIndex >= 0 &&
                config.fields[editingIndex] &&
                typeof config.fields[editingIndex] === 'object'
                    ? config.fields[editingIndex]
                    : null;

            const field = {
                ...(existingField || {}),
                id: existingField?.id || idV221(name),
                name,
                kind: state.kind,
                pronunciation: !!state.pronunciation,
                ttsLang: language,
                quiz: !!state.quiz,
                quizPrimary: !!state.quizPrimary,
                editable: !!state.editable,
                options: []
            };

            if (state.kind === 'select') {
                field.options = parseOptionsV221(modal.querySelector('.kb-field-options-v221')?.value || '');
                if (!field.options.length) {
                    toastV221('Add at least one dropdown option.');
                    modal.querySelector('.kb-field-options-v221')?.focus();
                    return;
                }
            }
            if (state.kind === 'rating') {
                const raw = Number(modal.querySelector('.kb-field-rating-v221')?.value || 5);
                field.maxRating = Math.max(1, Math.min(10, Number.isFinite(raw) ? raw : 5));
            }
            if (state.kind === 'pinnedImage') {
                const color = String(modal.querySelector('.kb-field-pin-color-v221')?.value || '#e53935');
                field.defaultPinColor = /^#[0-9a-f]{6}$/i.test(color) ? color.toLowerCase() : '#e53935';
            }

            if (state.kind !== 'select') delete field.options;
            if (state.kind !== 'rating') delete field.maxRating;
            if (state.kind !== 'pinnedImage') delete field.defaultPinColor;

            if (editingIndex >= 0) config.fields[editingIndex] = field;
            else config.fields.push(field);
            if (field.quizPrimary) {
                config.fields.forEach(entry => {
                    if (entry !== field && entry && typeof entry === 'object') entry.quizPrimary = false;
                });
                field.quiz = true;
            }

            try {
                if (typeof activeCategorySettingTab !== 'undefined') activeCategorySettingTab = category;
            } catch {}
            try { saveDb(); } catch (error) { console.error('KB V221 save failed', error); }
            state.editingId = '';
            close();
            try { renderSettings(); } catch (error) { console.error('KB V221 render failed', error); }
        };

        modal.querySelector('.kb-field-save-v221')?.addEventListener('click', save);
        modal.querySelector('.kb-field-name-v221')?.addEventListener('keydown', event => {
            if (event.key === 'Enter') {
                event.preventDefault();
                save();
            }
        });

        bindFieldStackGuardV223(modal);
        return modal;
    }

    function openV221(fieldId = null, categoryOverride = '') {
        const category = String(categoryOverride || activeCategoryV221() || '');
        if (!category) {
            toastV221('Select a category first.');
            return false;
        }

        const config = configV221(category);
        if (!config || !Array.isArray(config.fields)) {
            toastV221('Could not load this category.');
            return false;
        }

        const field = fieldId
            ? config.fields.find(entry =>
                entry && typeof entry === 'object' &&
                String(entry.id || '') === String(fieldId)
            )
            : null;

        if (fieldId && !field) {
            toastV221('Could not find that field.');
            return false;
        }

        const modal = ensureModalV221();
        const state = modal.__kbFieldStateV221;
        state.kind = field?.kind || 'text';
        state.pronunciation = !!field?.pronunciation;
        state.quiz = field ? field.quiz !== false : true;
        state.quizPrimary = field ? !!field.quizPrimary : false;
        state.editable = field ? !!field.editable : false;
        state.category = category;
        state.editingId = field?.id || '';

        const name = modal.querySelector('.kb-field-name-v221');
        const language = modal.querySelector('.kb-field-language-v221');
        const options = modal.querySelector('.kb-field-options-v221');
        const rating = modal.querySelector('.kb-field-rating-v221');
        const pinColor = modal.querySelector('.kb-field-pin-color-v221');
        const title = modal.querySelector('#kb-field-title-v221');
        const saveButton = modal.querySelector('.kb-field-save-v221');

        if (name) name.value = field?.name || '';
        if (language) {
            try { language.value = field?.ttsLang || db.settings?.ttsLang || 'ko'; }
            catch { language.value = field?.ttsLang || 'ko'; }
        }
        if (options) options.value = Array.isArray(field?.options) ? field.options.join('\n') : '';
        if (rating) rating.value = String(field?.maxRating || 5);
        if (pinColor) {
            const value = String(field?.defaultPinColor || '#e53935');
            pinColor.value = /^#[0-9a-f]{6}$/i.test(value) ? value : '#e53935';
        }
        if (title) title.textContent = field ? 'Edit Field' : 'Add Field';
        if (saveButton) saveButton.textContent = field ? 'Done' : 'Add Field';

        modal.querySelectorAll('[data-kind-v221]').forEach(button => {
            button.classList.toggle('selected', button.dataset.kindV221 === state.kind);
        });
        modal.querySelector('.kb-field-pronunciation-v221')?.classList.toggle('selected', state.pronunciation);
        modal.querySelector('.kb-field-quiz-v221')?.classList.toggle('selected', state.quiz);
        modal.querySelector('.kb-field-primary-quiz-v476')?.classList.toggle('selected', state.quizPrimary);
        modal.querySelector('.kb-field-editable-v221')?.classList.toggle('selected', state.editable);
        modal.querySelector('.kb-field-language-section-v221')?.classList.toggle('hidden', !state.pronunciation);
        modal.querySelector('.kb-field-select-section-v221')?.classList.toggle('hidden', state.kind !== 'select');
        modal.querySelector('.kb-field-rating-section-v221')?.classList.toggle('hidden', state.kind !== 'rating');
        modal.querySelector('.kb-field-pin-section-v221')?.classList.toggle('hidden', state.kind !== 'pinnedImage');

        if (modal.parentElement !== document.body || modal !== document.body.lastElementChild) {
            document.body.appendChild(modal);
        }
        modal.classList.remove('hidden');
        modal.removeAttribute('inert');
        modal.setAttribute('aria-hidden', 'false');
        try { modal.inert = false; } catch {}
        forceFieldStackV223(modal);

        requestAnimationFrame(() => {
            forceFieldStackV223(modal);
            name?.focus({ preventScroll: true });
            if (field) name?.select?.();
        });
        return true;
    }

    window.openKnowledgeAddFieldSafeV221 = () => openV221(null);
    window.openKnowledgeEditFieldSafeV222 = (fieldId, category) =>
        openV221(fieldId, category);

    // Capture-phase delegation wins over every old per-card listener, including
    // copied JS on logs created before this patch.
    document.addEventListener('click', event => {
        const addButton = event.target.closest?.('#kb-field-builder-list .kb-field-summary-add');
        if (!addButton) return;
        event.preventDefault();
        event.stopImmediatePropagation();
        openV221(null);
    }, true);

    // V222: field-card right-clicks must never enter the legacy wrapped edit
    // modal. Replace the entire context menu at capture phase so Edit Field uses
    // the same standalone editor that already fixed Add Field.
    document.addEventListener('contextmenu', event => {
        const card = event.target.closest?.(
            '#kb-field-builder-list .kb-field-summary-card[data-field-id]'
        );
        if (!card || card.classList.contains('kb-field-summary-add')) return;

        const fieldId = String(card.dataset.fieldId || '');
        const category = activeCategoryV221();
        if (!fieldId || !category) return;

        event.preventDefault();
        event.stopImmediatePropagation();

        const items = [
            {
                label: 'Edit field',
                icon: 'ph-pencil-simple',
                action: () => openV221(fieldId, category)
            },
            {
                label: 'Delete field',
                icon: 'ph-trash',
                danger: true,
                action: () => {
                    try {
                        if (typeof deleteKnowledgeField === 'function') {
                            deleteKnowledgeField(category, fieldId);
                            return;
                        }
                    } catch (error) {
                        console.error('KB V222 delete field failed', error);
                    }
                }
            }
        ];

        try {
            if (typeof showCustomItemContextMenu === 'function') {
                showCustomItemContextMenu(event.clientX, event.clientY, items);
            } else {
                openV221(fieldId, category);
            }
        } catch (error) {
            console.error('KB V222 field menu failed', error);
            openV221(fieldId, category);
        }
    }, true);
})();

/* ============================================================
   V245 — authoritative custom-tab + theme polish
   ============================================================ */
(() => {
    'use strict';
    if (window.__loggyExtrasV245) return;
    window.__loggyExtrasV245 = true;
    const q=(s,r=document)=>r?.querySelector?.(s)||null;
    const qa=(s,r=document)=>Array.from(r?.querySelectorAll?.(s)||[]);
    const esc245=v=>{try{return escapeCustomHtml(String(v??''))}catch{return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}};

    // ------------------------------------------------------------
    // Component help belongs in the component picker only.
    // ------------------------------------------------------------
    try {
        const beforeCanvasV245 = renderCustomCanvas;
        renderCustomCanvas = function(tab, canvas) {
            const result = beforeCanvasV245.apply(this, arguments);
            qa('.custom-component-help-v163', canvas).forEach(node => node.remove());
            qa('.custom-tab-component', canvas).forEach((wrap,index) => {
                const id = wrap.dataset.componentId;
                const component = tab?.components?.find?.(c => String(c.id) === String(id)) || tab?.components?.[index];
                if (!component) return;
                const heading = wrap.querySelector('.custom-component-content h2,.custom-component-content h3,.custom-collection-header h2,.custom-collection-header h3');
                if (heading) heading.classList.toggle('hidden', component.showTitle === false);
                wrap.querySelector('.custom-component-title-toggle-v245')?.remove();
                if (typeof customTabEditMode !== 'undefined' && customTabEditMode && 'title' in component) {
                    const button = document.createElement('button');
                    button.type='button';button.className='small-icon-btn custom-component-title-toggle-v245';
                    button.title = component.showTitle === false ? 'Show component title' : 'Hide component title';
                    button.setAttribute('aria-label', button.title);
                    button.innerHTML = `<i class="ph ${component.showTitle === false ? 'ph-eye' : 'ph-eye-slash'}"></i>`;
                    button.addEventListener('click', event => {
                        event.preventDefault();event.stopPropagation();
                        component.showTitle = component.showTitle === false;
                        saveDb();renderCustomTabView(tab.id);
                    });
                    const controls = wrap.querySelector('.custom-component-controls');
                    if (controls) controls.insertBefore(button, controls.querySelector('.custom-component-edit') || controls.firstChild);
                    else wrap.appendChild(button);
                }
            });
            return result;
        };
    } catch {}

    const HELP_V245 = {
        divider:'A simple visual divider. Drop it anywhere you want a clean section break; it has no required settings.',
        spacer:'Adds empty vertical breathing room between components. Its only purpose is spacing.',
        text:'A freeform text area. Type directly into it; use it for instructions, notes, explanations, or context.',
        heading:'Adds a section heading so you can visually group the components below it.',
        alphabetV244:'Character/alphabet cards with categories and optional image/audio. Click a card to hear it; right-click a card to edit it.',
        practiceCategoryV244:'Place directly below Alphabet Cards, Cards, Vocabulary, or Polaroids. In Edit mode choose which field is the question and which is the answer; image fields are supported.',
        ankiReviewV244:'Place directly below Alphabet Cards, Cards, Vocabulary, or Polaroids. In Edit mode choose the flashcard front/back fields. Review uses Still Learning and Got It.',
        dailyLogsV245:'Embeds an interactive Daily Logs day grid in a custom tab. Click a day to open it or + to add the next day.',
        aiPromptGeneratorV245:'Build an AI prompt that makes one thing (video, worksheet, story, image, etc.) from selected Daily Log items, Knowledge Base items, or another custom component.',
        dropdownV239:'Expandable container that can hold other components. Text inside a Dropdown is editable directly in place.',
        kanbanV239:'Drag cards between columns. Right-click cards or column menus to edit/remove them.'
    };
    try {
        const beforePaletteV245 = renderCustomComponentPalette;
        renderCustomComponentPalette = function(palette) {
            const result = beforePaletteV245.apply(this, arguments);
            qa('.custom-component-palette-item', palette).forEach(card => {
                const tip = q('.custom-palette-tooltip-v164', card);
                const type = card.dataset.componentType;
                if (tip && HELP_V245[type]) tip.textContent = HELP_V245[type];
                // Never leave the old one-size-fits-all "use Edit mode" sentence on
                // components where it is inaccurate (Spacer/Divider are the obvious
                // examples, but this also protects future zero-config components).
                if (tip && /use edit mode to configure/i.test(tip.textContent)) {
                    const label = card.querySelector('span')?.textContent?.trim() || 'This component';
                    tip.textContent = `${label} adds its matching content block to the custom tab. Its controls appear directly on the component when that component supports them.`;
                }
            });
            return result;
        };
    } catch {}

    // ------------------------------------------------------------
    // Q&A/Dropdown-style accordion: do not repeat the question inside;
    // show the whole summary, and use an icon-only edit button bottom-right.
    // ------------------------------------------------------------
    const qaOpenV245 = new Set();
    async function editAnswerV245(tab, component, item) {
        const values = await showAppFormModal({
            title:'Edit Answer', submitLabel:'Save Answer',
            fields:[{name:'answer',label:'Answer',type:'textarea',rows:7,value:item.answer||''}]
        });
        if (!values) return;
        item.answer = String(values.answer||'');
        await saveDb();
        renderCustomTabView(tab.id);
    }
    function renderQaV245(tab, component, content) {
        component.items = Array.isArray(component.items) ? component.items : [];
        content.innerHTML = `<div class="custom-collection-header qa-header-v163"><h2>${esc245(component.title||'Q&A')}</h2><button type="button" class="small-icon-btn qa-add-v245" title="Add question"><i class="ph ph-plus"></i></button></div><div class="qa-list-v163"></div>`;
        q('.qa-add-v245',content).onclick=async()=>{
            const v=await showAppFormModal({title:'New Question',submitLabel:'Add',fields:[{name:'question',label:'Question',type:'textarea',rows:3},{name:'answer',label:'Answer (optional)',type:'textarea',rows:5}]});
            if(!v||!String(v.question||'').trim())return;
            component.items.push({id:(typeof customId==='function'?customId('question'):`question-${Date.now()}`),question:String(v.question).trim(),answer:String(v.answer||''),references:[],createdAt:new Date().toISOString()});
            await saveDb();renderCustomTabView(tab.id);
        };
        const list=q('.qa-list-v163',content);
        component.items.forEach(item=>{
            const open=qaOpenV245.has(item.id),refs=Array.isArray(item.references)?item.references:[];
            const row=document.createElement('article');row.className=`qa-row-v163 custom-searchable-item${open?' open':''}`;row.dataset.searchText=`${item.question||''} ${item.answer||''}`.toLowerCase();
            row.innerHTML=`<button type="button" class="qa-summary-v163 qa-summary-v245" aria-expanded="${open?'true':'false'}"><i class="ph ph-caret-right qa-caret-v163"></i><span class="qa-question-text-v163">${esc245(item.question||'Untitled question')}</span><span class="qa-answer-state-v163">${item.answer?'<i class="ph ph-check-circle"></i>':'<i class="ph ph-chat-circle"></i>'}</span></button><div class="qa-detail-v163 ${open?'':'hidden'}"><div class="qa-answer-copy-v163">${item.answer?esc245(item.answer).replace(/\n/g,'<br>'):'<span class="qa-empty-answer-v163">No answer yet.</span>'}</div><div class="qa-detail-actions-v163 qa-detail-actions-v245"><button type="button" class="small-icon-btn qa-answer-edit-v245" title="Edit answer" aria-label="Edit answer"><i class="ph ph-pencil-simple"></i></button></div><div class="qa-references-v163">${refs.length?refs.map(r=>`<button type="button" class="qa-day-ref-v163" data-day="${Number(r.day)||0}"><i class="ph ph-calendar-blank"></i> Day ${Number(r.day)||0}</button>`).join(''):'<span>No Daily Log references yet.</span>'}</div></div>`;
            q('.qa-summary-v163',row).onclick=()=>{qaOpenV245.has(item.id)?qaOpenV245.delete(item.id):qaOpenV245.add(item.id);renderCustomTabView(tab.id)};
            q('.qa-answer-edit-v245',row).onclick=()=>editAnswerV245(tab,component,item);
            qa('.qa-day-ref-v163',row).forEach(b=>b.onclick=()=>{try{openDayLog(Number(b.dataset.day))}catch{}});
            row.oncontextmenu=e=>{e.preventDefault();showCustomItemContextMenu(e.clientX,e.clientY,[{label:'Edit answer',icon:'ph-chat-text',action:()=>editAnswerV245(tab,component,item)},{label:'Delete question',icon:'ph-trash',danger:true,action:async()=>{const ok=await showAppConfirm({title:'Delete Question',message:'Delete this question?',confirmLabel:'Delete'});if(!ok)return;component.items=component.items.filter(x=>x.id!==item.id);await saveDb();renderCustomTabView(tab.id)}}])};
            list.appendChild(row);
        });
        if(!component.items.length)list.innerHTML='<div class="custom-feature-empty-v162">No questions yet.</div>';
    }
    try {
        const beforeContentV245 = renderCustomComponentContent;
        renderCustomComponentContent = function(tab, component, content) {
            if (component?.type === 'qaV162') return renderQaV245(tab, component, content);
            return beforeContentV245.apply(this, arguments);
        };
    } catch {}

    // ------------------------------------------------------------
    // Theme search keyboard ownership. Arrow keys choose a visible card;
    // Enter always applies the chosen/only result and closes Settings.
    // ------------------------------------------------------------
    let themeKeyIndexV245 = 0;
    function visibleThemeCardsV245(){
        const picker=document.getElementById('theme-picker');
        return qa('.theme-picker-card',picker).filter(card=>!card.classList.contains('theme-search-hidden')&&getComputedStyle(card).display!=='none');
    }
    function markThemeKeyCardV245(cards,index){
        cards.forEach(c=>c.classList.remove('theme-key-selected-v245'));
        if(!cards.length)return;
        themeKeyIndexV245=((index%cards.length)+cards.length)%cards.length;
        const card=cards[themeKeyIndexV245];card.classList.add('theme-key-selected-v245');card.scrollIntoView({block:'nearest',inline:'nearest'});
    }
    window.addEventListener('keydown', async event=>{
        const input=document.getElementById('theme-search-input');
        if(!input||document.activeElement!==input)return;
        const cards=visibleThemeCardsV245();
        if(!cards.length)return;
        if(['ArrowDown','ArrowRight','ArrowUp','ArrowLeft','Enter'].includes(event.key)){event.preventDefault();event.stopImmediatePropagation()}
        if(event.key==='ArrowDown'||event.key==='ArrowRight'){markThemeKeyCardV245(cards,themeKeyIndexV245+1);return}
        if(event.key==='ArrowUp'||event.key==='ArrowLeft'){markThemeKeyCardV245(cards,themeKeyIndexV245-1);return}
        if(event.key==='Enter'){
            // V255: Enter owns the keyboard-highlighted result when several
            // matches remain, and still falls back to the sole visible result.
            const selected=cards.find(card=>card.classList.contains('theme-key-selected-v245'))||cards[themeKeyIndexV245]||cards[0];
            if(!selected?.dataset?.theme)return;
            document.getElementById('daily-settings-modal')?.classList.add('hidden');
            input.blur();
            selected.click();
        }
    },true);
    document.getElementById('theme-search-input')?.addEventListener('input',()=>{themeKeyIndexV245=0;requestAnimationFrame(()=>markThemeKeyCardV245(visibleThemeCardsV245(),0))});

    // ------------------------------------------------------------
    // Durable theme artwork URLs. projectPath/path is the source of truth;
    // blob URLs are only temporary browser-session handles.
    // ------------------------------------------------------------
    function stableThemeUrlV245(path){
        let p=String(path||'').replace(/\\/g,'/').replace(/^\.\//,'');
        const marker='/public/';const i=p.toLowerCase().lastIndexOf(marker);if(i>=0)p=p.slice(i+marker.length);else if(p.toLowerCase().startsWith('public/'))p=p.slice(7);
        if(!p)return'';return'/'+p.split('/').filter(Boolean).map(part=>{try{return encodeURIComponent(decodeURIComponent(part))}catch{return encodeURIComponent(part)}}).join('/');
    }
    function normalizeThemeV245(theme){
        if(!theme||typeof theme!=='object')return theme;
        (theme.backgroundSvgs||[]).forEach(asset=>{if(!asset||typeof asset!=='object')return;const url=stableThemeUrlV245(asset.projectPath||asset.path);if(url)asset._projectUrlV495=url;const current=String(asset.url||asset.src||'').trim();if(current&&!/^blob:/i.test(current)&&!asset._stableUrlV164)asset._stableUrlV164=current;if(!current&&url)asset.url=url});
        const bgPath=theme.backgroundImageProjectPathV3||theme.backgroundImageProjectPath;if(bgPath){const url=stableThemeUrlV245(bgPath);if(url&&!String(theme.backgroundImage||'').trim())theme.backgroundImage=url}
        return theme;
    }
    try { const beforeGetV245=getCustomThemeSettings; getCustomThemeSettings=function(){return normalizeThemeV245(beforeGetV245.apply(this,arguments))}; } catch {}
    try { const beforePopV245=populateThemeBuilder; populateThemeBuilder=function(modal,theme){normalizeThemeV245(theme);const r=beforePopV245.apply(this,arguments);(modal?._themeBackgroundSvgs||[]).forEach(a=>normalizeThemeV245({backgroundSvgs:[a]}));return r}; } catch {}
    try { const beforeMountV245=mountCustomThemeBackgroundSvgsV2; mountCustomThemeBackgroundSvgsV2=function(theme){normalizeThemeV245(theme);return beforeMountV245.apply(this,arguments)}; } catch {}

    // Editing a theme must preview the theme being edited, not whichever theme
    // happened to be active before the user chose Edit Theme.
    try {
        const beforeEditThemeV245=openAnyThemeInBuilderV25;
        openAnyThemeInBuilderV25=async function(themeId,themeName){
            const previous=db.settings?.theme||'default';
            const result=await beforeEditThemeV245.apply(this,arguments);
            const modal=document.getElementById('theme-builder-modal');
            if(!modal)return result;
            try{
                // V257 performance: the authoritative edit opener already loaded
                // themeId before it populated/hydrated the Builder. Re-applying the
                // same theme here doubled CSS/JS mounting work and was the largest
                // avoidable delay when editing a non-active theme.
                db.settings.theme=previous;
                modal._themeEditPreviousThemeV25=previous;
                modal._themePreviewEditingThemeV245=themeId;
                rebuildActualThemeBuilderPreviewV5?.(modal);
                renderThemeBuilderSvgListV2?.(modal);
            }catch{}
            return result;
        };
    } catch {}

    // Strip stale pager/arrow controls from cloned previews when those controls
    // are not part of the real current UI anymore.
    try {
        const beforeRebuildV245=rebuildActualThemeBuilderPreviewV5;
        rebuildActualThemeBuilderPreviewV5=function(modal){
            const r=beforeRebuildV245.apply(this,arguments);
            requestAnimationFrame(()=>{
                const root=q('.theme-builder-live-preview-stage',modal);
                qa('.daily-day-pager-v231,.daily-layout-page-controls-v231,.daily-layout-pager-v231',root).forEach(n=>n.remove());
                qa('[hidden],.hidden',root).forEach(n=>{if(n.matches?.('.daily-day-pager-v231,.daily-layout-page-controls-v231,.daily-layout-pager-v231'))n.remove()});
            });
            return r;
        };
    } catch {}
})();

/* V245 — size the actual Theme Builder preview from the cloned page's real height. */
(() => {
    'use strict';
    try {
        fitActualThemeBuilderPreviewV9 = function(modal) {
            const viewport = modal?.querySelector?.('.theme-builder-live-preview-viewport');
            const canvas = modal?.querySelector?.('.theme-builder-live-canvas');
            if (!viewport || !canvas) return;
            const baseWidth = 1280;
            const availableWidth = Math.max(1, viewport.clientWidth);
            const scale = Math.min(1, availableWidth / baseWidth);
            canvas.style.setProperty('--theme-builder-preview-scale', String(scale));
            canvas.style.setProperty('width', `${baseWidth}px`, 'important');
            canvas.style.setProperty('height', 'auto', 'important');
            canvas.style.setProperty('min-height', '760px', 'important');
            requestAnimationFrame(() => {
                const contentHeight = Math.max(760, canvas.scrollHeight || 760);
                canvas.style.setProperty('height', `${contentHeight}px`, 'important');
                const visibleHeight = Math.max(360, Math.min(680, Math.round(contentHeight * scale)));
                viewport.style.setProperty('height', `${visibleHeight}px`, 'important');
            });
        };
    } catch {}
})();

/* V245 — final persistence guarantee for theme changes. */
(() => {
    'use strict';
    try {
        const beforeApplyPersistV245 = applyTheme;
        applyTheme = async function(themeValue, opts = {}) {
            const result = await beforeApplyPersistV245.apply(this, arguments);
            if (opts?.persist !== false) {
                try { await saveDb(); } catch {}
            }
            return result;
        };
    } catch {}
})();

/* V589 — FINAL DECORATION ASSIGNMENT OWNER.
   This replaces the old V245 override that discarded Manual Fixed coordinates
   and bypassed hidden-decoration filtering because it ran after the V136 guard.
   Runtime + preview now consume the same canonical saved scene directly. */
(() => {
    'use strict';

    function seedV589(theme){
        const text=[
            theme?.name||'',
            theme?.svgDistribution||'',
            ...(theme?.backgroundSvgs||[]).map(a=>
                a?.id||a?.name||a?.projectPath||a?.url||''
            )
        ].join('|');
        let h=2166136261;
        for(let i=0;i<text.length;i++){
            h^=text.charCodeAt(i);
            h=Math.imul(h,16777619);
        }
        return Math.abs(h>>>0)%100000;
    }

    function hiddenV589(asset){
        if(!asset||typeof asset!=='object')return false;
        if(typeof asset.hiddenOnScreenV63==='boolean')return asset.hiddenOnScreenV63;
        if(typeof asset.showOnScreen==='boolean')return asset.showOnScreen===false;
        if(typeof asset.visibleV63==='boolean')return asset.visibleV63===false;
        if(typeof asset.visible==='boolean')return asset.visible===false;
        if(typeof asset.enabled==='boolean')return asset.enabled===false;
        return false;
    }

    function pointV589(theme, sourceIndex){
        const valid=p=>p&&Number.isFinite(Number(p.x))&&Number.isFinite(Number(p.y));
        const resolved=Array.isArray(theme?.resolvedDecorationPlacementsV405)
            ? theme.resolvedDecorationPlacementsV405 : [];
        if(valid(resolved[sourceIndex])){
            return {x:Number(resolved[sourceIndex].x),y:Number(resolved[sourceIndex].y)};
        }
        if(String(theme?.svgDistribution||'')==='manual-fixed'){
            const slots=Array.isArray(theme?.manualPlacementSlotsV40)
                ? theme.manualPlacementSlotsV40 : [];
            if(valid(slots[sourceIndex])){
                return {x:Number(slots[sourceIndex].x),y:Number(slots[sourceIndex].y)};
            }
        }
        return null;
    }

    function canonicalEntriesV589(theme={}){
        const all=Array.isArray(theme?.backgroundSvgs)?theme.backgroundSvgs:[];
        const rows=[];
        all.forEach((asset,sourceIndex)=>{
            if(!asset||hiddenV589(asset))return;
            const canonicalIndex=Number.isFinite(Number(asset?.placementIndexV405))
                ? Math.max(0,Math.floor(Number(asset.placementIndexV405)))
                : sourceIndex;
            rows.push({
                asset:{...asset,placementIndexV405:canonicalIndex},
                sourceIndex:canonicalIndex
            });
        });
        return rows;
    }

    function assignmentsV589(theme={}, seed=null){
        const rows=canonicalEntriesV589(theme);
        const safeTheme={
            ...(theme||{}),
            backgroundSvgs:rows.map(row=>row.asset)
        };
        const entries=makePlacementEntriesV26(safeTheme);

        // Generate only fallback points. A saved canonical/manual point always wins.
        const generated=String(theme?.svgDistribution||'')==='manual-fixed'
            ? []
            : buildThemePlacementPointsV26(
                theme.svgDistribution,
                entries.length,
                {
                    seed,
                    allowOverlap:!!theme.svgAllowOverlap,
                    svgGlobalScale:theme.svgGlobalScale
                }
            );

        return entries.map((entry,index)=>{
            const sourceIndex=rows[index]?.sourceIndex ?? index;
            const saved=pointV589(theme,sourceIndex);
            const fallback=generated[index]||{x:50,y:50};
            return {
                ...entry,
                originalIndex:sourceIndex,
                svg:{...(entry.svg||{}),placementIndexV405:sourceIndex},
                left:saved?.x ?? fallback.x,
                top:saved?.y ?? fallback.y
            };
        });
    }

    getPreviewSvgAssignmentsV10=function(modal,draft={}){
        const seed=seedV589(draft);
        if(modal)modal._themePreviewDistributionSeedV10=seed;
        return assignmentsV589(draft,seed);
    };

    getRuntimeSvgAssignmentsV10=function(theme={}){
        return assignmentsV589(theme,seedV589(theme));
    };

    window.__loggyDecorationAssignmentsV589=assignmentsV589;
})();

/* V245.1 — keep every Theme Builder edit path coherent with the theme being edited.
   Duplicated/custom themes have separate historical openers, so controls could be
   populated from one theme while the live-page preview cloned whichever theme was
   currently active.  The modal preview is hidden during the temporary visual load
   and revealed only after the correct edited theme has been mounted and cloned. */
(() => {
    'use strict';
    if (window.__loggyThemeEditCoherenceV2451) return;
    window.__loggyThemeEditCoherenceV2451 = true;

    const cloneV2451 = value => {
        try { return structuredClone(value); } catch {}
        try { return JSON.parse(JSON.stringify(value)); } catch { return value; }
    };
    const modalV2451 = () => document.getElementById('theme-builder-modal');
    const viewportV2451 = modal => modal?.querySelector?.('.theme-builder-live-preview-viewport');
    const hidePreviewV2451 = modal => {
        const viewport = viewportV2451(modal);
        if (!viewport) return;
        viewport.dataset.previewSyncingV245 = '1';
        viewport.style.setProperty('visibility', 'hidden', 'important');
    };
    const showPreviewV2451 = modal => {
        const viewport = viewportV2451(modal);
        if (!viewport) return;
        delete viewport.dataset.previewSyncingV245;
        viewport.style.removeProperty('visibility');
    };
    const finishPreviewV2451 = (modal, draft) => {
        if (!modal) return;
        try {
            if (draft && typeof draft === 'object') {
                try { normalizeThemeV245?.(draft); } catch {}
                // Re-populate from the captured edit draft after the temporary
                // visual apply. This guarantees decoration/media galleries and
                // every control reflect the edited theme, not the active theme.
                populateThemeBuilder?.(modal, draft);
            }
        } catch {}
        try { renderThemeBuilderSvgListV2?.(modal); } catch {}
        try { renderThemeBuilderHoverSoundListV10?.(modal); } catch {}
        try { rebuildActualThemeBuilderPreviewV5?.(modal); } catch {}
        requestAnimationFrame(() => {
            try { fitActualThemeBuilderPreviewV9?.(modal); } catch {}
            showPreviewV2451(modal);
        });
    };

    // Theme copies (including copies of built-ins) have their own opener.
    // Apply the copy itself to the page only for the live preview, then restore
    // the persisted selection ID while leaving the preview clone intact.
    try {
        const beforeCopyV2451 = openThemeCopyInBuilderV30;
        openThemeCopyInBuilderV30 = async function(copyId) {
            const previous = db.settings?.theme || 'default';
            const result = await beforeCopyV2451.apply(this, arguments);
            const modal = modalV2451();
            const copy = (() => { try { return getThemeCopyV30?.(copyId) || null; } catch { return null; } })();
            if (!modal || !copy) return result;
            const draft = cloneV2451((() => { try { return getThemeBuilderDraft?.(modal); } catch { return copy.theme || {}; } })());
            hidePreviewV2451(modal);
            try {
                await applyTheme(copyId, { persist:false, force:true });
            } catch {}
            try { db.settings.theme = previous; } catch {}
            modal._themeEditPreviousThemeV25 = previous;
            modal._themeEditPreviousThemeV49 = previous;
            modal.dataset.themeBuilderEditingCopyV30 = String(copyId || '');
            modal.dataset.themeBuilderEditingThemeV25 = '';
            finishPreviewV2451(modal, draft);
            return result;
        };
    } catch {}

    // The single editable custom theme is also a separate synchronous opener.
    // Populate its own saved draft immediately; then temporarily mount that theme
    // for the cloned preview without changing which theme is actually selected.
    try {
        const beforeCustomV2451 = openExistingCustomThemeFromPickerV7;
        openExistingCustomThemeFromPickerV7 = function() {
            const previous = db.settings?.theme || 'default';
            const result = beforeCustomV2451.apply(this, arguments);
            const modal = modalV2451();
            if (!modal) return result;
            let draft = null;
            try { draft = cloneV2451(getCustomThemeSettings?.() || db.settings?.customTheme || {}); } catch { draft = cloneV2451(db.settings?.customTheme || {}); }
            try { normalizeThemeV245?.(draft); } catch {}
            try { populateThemeBuilder?.(modal, draft); } catch {}
            try { renderThemeBuilderSvgListV2?.(modal); } catch {}
            try { renderThemeBuilderHoverSoundListV10?.(modal); } catch {}
            hidePreviewV2451(modal);
            Promise.resolve().then(async () => {
                try { await applyTheme('theme-custom-builder', { persist:false, force:true }); } catch {}
                try { db.settings.theme = previous; } catch {}
                modal._themeEditPreviousThemeV25 = previous;
                modal._themeEditPreviousThemeV49 = previous;
                modal.dataset.themeBuilderEditingThemeV25 = '';
                modal.dataset.themeBuilderEditingCopyV30 = '';
                finishPreviewV2451(modal, draft);
            });
            return result;
        };
    } catch {}
})();

// ============================================================
// V249 — FULL-SCREEN NOTEPAD BUILT-IN TAB
// Lazy runtime, project-backed images, @ references, and Daily Log previews.
// ============================================================
(() => {
    'use strict';
    if (window.__loggyNotepadBootstrapV249) return;
    window.__loggyNotepadBootstrapV249 = true;

    const NOTEPAD_TEMPLATE_ID_V249 = 'notepad-v249';
    const NOTEPAD_COMPONENT_TYPE_V249 = 'fullNotepadV249';
    const NOTEPAD_ROUTE_KEY_V249 = 'loggy-notepad-route-v249';
    let notepadRuntimePromiseV249 = null;

    const escV249 = value => String(value ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
    const stripV249 = html => {
        const div = document.createElement('div'); div.innerHTML = String(html || '');
        return (div.textContent || '').replace(/\s+/g, ' ').trim();
    };
    const idV249 = prefix => {
        try { if (typeof customId === 'function') return customId(prefix); } catch {}
        return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,8)}`;
    };

    function isNotepadTabV249(tab) {
        return !!tab && (
            tab.templateIdV53 === NOTEPAD_TEMPLATE_ID_V249 ||
            (Array.isArray(tab.components) && tab.components.some(component => component?.type === NOTEPAD_COMPONENT_TYPE_V249))
        );
    }
    window.__loggyIsNotepadTabV249 = isNotepadTabV249;

    function makeDefaultNotepadStateV249() {
        const categoryId = idV249('notepad-category');
        const pageId = idV249('notepad-page');
        return {
            version:249,
            activeCategoryId:categoryId,
            activePageId:pageId,
            categories:[{id:categoryId,name:'Notebook 1'}],
            pages:[{id:pageId,title:'Page 1',categoryId,paper:'lined',html:'',images:[],createdAt:Date.now(),updatedAt:Date.now()}]
        };
    }

    function migrateTabNotepadStateV249(tab) {
        if (!tab) return null;
        if (String(tab.name||'').trim()==='Untitled Note') tab.name='Untitled Notebook';
        const state = tab.notepadV249 && typeof tab.notepadV249 === 'object' ? tab.notepadV249 : makeDefaultNotepadStateV249();
        state.version = 249;
        state.categories = Array.isArray(state.categories) ? state.categories.filter(Boolean) : [];
        if (!state.categories.length) state.categories = [{id:idV249('notepad-category'),name:'Notebook 1'}];
        state.categories.forEach((category,index) => {
            category.id = String(category.id || idV249('notepad-category'));
            category.name = String((state.categories.length===1&&String(category.name||'').trim()==='Notes')?`Notebook ${index+1}`:(category.name || `Notebook ${index + 1}`));
        });
        const categoryIds = new Set(state.categories.map(category => category.id));
        state.pages = Array.isArray(state.pages) ? state.pages.filter(Boolean) : [];
        if (!state.pages.length) {
            const pageId = idV249('notepad-page');
            state.pages.push({id:pageId,title:'Page 1',categoryId:state.categories[0].id,paper:'lined',html:'',images:[],createdAt:Date.now(),updatedAt:Date.now()});
        }
        state.pages.forEach((page,index) => {
            page.id = String(page.id || idV249('notepad-page'));
            page.title = String(page.title || `Page ${index + 1}`);if(page.title==='Untitled Note')page.title=`Page ${index+1}`;
            if (!categoryIds.has(String(page.categoryId || ''))) page.categoryId = state.categories[0].id;
            if (!['blank','lined','dot','graph','cornell'].includes(page.paper)) page.paper = 'lined';
            page.html = String(page.html || '');
            page.images = Array.isArray(page.images) ? page.images.filter(Boolean) : [];
            page.createdAt = Number(page.createdAt) || Date.now();
            page.updatedAt = Number(page.updatedAt) || page.createdAt;
        });
        if (!state.pages.some(page => page.id === state.activePageId)) state.activePageId = state.pages[0].id;
        if (state.activeCategoryId !== 'all' && !categoryIds.has(String(state.activeCategoryId || ''))) {
            state.activeCategoryId = state.pages.find(page => page.id === state.activePageId)?.categoryId || state.categories[0].id;
        }
        tab.notepadV249 = state;
        return state;
    }

    function ensureNotepadBootstrapStyleV249() {
        if (document.getElementById('notepad-bootstrap-style-v249')) return;
        const style = document.createElement('style');
        style.id = 'notepad-bootstrap-style-v249';
        style.textContent = `
            html.notepad-tab-active-v249,body.notepad-tab-active-v249{overflow:hidden!important;width:100%!important;height:100%!important}
            .notepad-tab-view-v249,.notepad-tab-view-v249.custom-tab-view.view.active{position:fixed!important;inset:0!important;width:100vw!important;height:100dvh!important;min-width:100vw!important;min-height:100dvh!important;margin:0!important;padding:0!important;overflow:hidden!important;z-index:2147480000!important;background:#f2f0ea!important;pointer-events:auto!important;visibility:visible!important}
            .notepad-runtime-host-v249{position:fixed!important;inset:0!important;width:100vw!important;height:100dvh!important;overflow:hidden!important;background:#f2f0ea!important;pointer-events:auto!important;visibility:visible!important}
            body.notepad-tab-active-v249>*:not(.notepad-tab-view-v249):not(script):not(style){visibility:hidden!important;pointer-events:none!important}
            body.notepad-tab-active-v249>.notepad-tab-view-v249{visibility:visible!important;pointer-events:auto!important;display:block!important}
            .notepad-runtime-loading-v249{position:fixed;inset:0;display:grid;place-items:center;background:#f2f0ea;color:#202124;font:600 14px/1.4 system-ui,sans-serif}
            .daily-notepad-links-v249{margin-top:18px}.daily-notepad-links-list-v249{display:grid;gap:10px;margin-top:10px}
            .daily-notepad-link-v249{display:flex;align-items:center;gap:10px;border:1px solid var(--border,#ddd);border-radius:12px;padding:8px;background:var(--card-bg,#fff)}
            .daily-notepad-link-main-v249{display:flex;align-items:center;gap:12px;min-width:0;flex:1;border:0;background:transparent;color:inherit;text-align:left;cursor:pointer;padding:0}
            .daily-notepad-thumb-v249,.daily-notepad-picker-preview-v249{position:relative;overflow:hidden;border:1px solid rgba(0,0,0,.12);background:#fffefb}
            .daily-notepad-thumb-v249{width:92px;height:64px;border-radius:7px;flex:0 0 auto}.daily-notepad-picker-preview-v249{height:132px;border-radius:0}
            .daily-notepad-paper-v249{position:absolute;inset:0;padding:9px 10px;font:7px/1.35 Georgia,serif;color:#555;overflow:hidden;white-space:normal}
            .daily-notepad-paper-v249[data-paper="lined"]{background-image:repeating-linear-gradient(to bottom,transparent 0,transparent 11px,#dce4ef 12px)}
            .daily-notepad-paper-v249[data-paper="graph"]{background-image:linear-gradient(#e2e7ed 1px,transparent 1px),linear-gradient(90deg,#e2e7ed 1px,transparent 1px);background-size:12px 12px}
            .daily-notepad-paper-v249[data-paper="dot"]{background-image:radial-gradient(circle,#c7ccd2 .7px,transparent .8px);background-size:10px 10px}
            .daily-notepad-paper-v249[data-paper="cornell"]{background-image:linear-gradient(90deg,transparent 0,transparent 28%,#edc2bd 28%,#edc2bd calc(28% + 1px),transparent calc(28% + 1px)),repeating-linear-gradient(to bottom,transparent 0,transparent 11px,#dce4ef 12px)}
            .daily-notepad-paper-v249 img{position:absolute;right:7px;bottom:7px;width:36%;height:46%;object-fit:cover;border:2px solid #fff;box-shadow:0 1px 5px rgba(0,0,0,.16)}
            .daily-notepad-link-text-v249{min-width:0;display:flex;flex-direction:column;gap:2px}.daily-notepad-link-text-v249 strong{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.daily-notepad-link-text-v249 small{opacity:.65}
            .daily-notepad-picker-v249 .modal-box{width:min(930px,calc(100vw - 36px));max-width:930px}.daily-notepad-picker-grid-v249,.daily-tab-notepad-page-grid-v249{display:grid;grid-template-columns:repeat(auto-fill,minmax(210px,1fr));gap:14px;max-height:min(62vh,620px);overflow:auto;padding:4px}
            .daily-notepad-picker-card-v249,.daily-tab-notepad-card-v249{border:1px solid var(--border,#ddd);border-radius:14px;overflow:hidden;background:var(--card-bg,#fff);cursor:pointer;text-align:left;color:inherit;padding:0!important;transition:transform .1s ease,box-shadow .1s ease}
            .daily-notepad-picker-card-v249:hover,.daily-tab-notepad-card-v249:hover{transform:translateY(-1px);box-shadow:0 7px 18px rgba(0,0,0,.09)}
            .daily-notepad-picker-card-v249 .meta,.daily-tab-notepad-card-v249 .meta{padding:10px 11px}.daily-notepad-picker-card-v249 .meta strong,.daily-tab-notepad-card-v249 .meta strong{display:block}.daily-notepad-picker-card-v249 .meta small,.daily-tab-notepad-card-v249 .meta small{opacity:.65}
            .daily-tab-notepad-page-wrap-v249{margin-top:8px}.daily-notepad-empty-v249{padding:18px;border:1px dashed var(--border,#ddd);border-radius:12px;opacity:.7;text-align:center}
            .notepad-link-target-flash-v249{animation:notepadLinkFlashV249 1.4s ease}@keyframes notepadLinkFlashV249{0%,100%{outline:0 solid rgba(55,100,180,0)}35%{outline:4px solid rgba(55,100,180,.3);outline-offset:5px}}
        `;
        document.head.appendChild(style);
    }

    let notepadAddonPromiseV250 = null;
    function ensureNotepadAddonV250() {
        if (window.__loggyNotepadV250) return Promise.resolve();
        if (!document.querySelector('link[data-loggy-notepad-v250-css]')) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = '/template-notepad-v250.css?v=503';
            link.dataset.loggyNotepadV250Css = '1';
            document.head.appendChild(link);
        }
        if (notepadAddonPromiseV250) return notepadAddonPromiseV250;
        notepadAddonPromiseV250 = new Promise((resolve, reject) => {
            const existing = document.querySelector('script[data-loggy-notepad-v250-js]');
            if (existing) {
                if (window.__loggyNotepadV250) return resolve();
                existing.addEventListener('load', resolve, {once:true});
                existing.addEventListener('error', reject, {once:true});
                return;
            }
            const script = document.createElement('script');
            script.src = '/template-notepad-v250.js?v=503';
            script.async = true;
            script.dataset.loggyNotepadV250Js = '1';
            script.addEventListener('load', resolve, {once:true});
            script.addEventListener('error', reject, {once:true});
            document.head.appendChild(script);
        });
        return notepadAddonPromiseV250;
    }

    function ensureNotepadRuntimeV249() {
        ensureNotepadBootstrapStyleV249();
        const finish = runtime => ensureNotepadAddonV250().catch(error => {
            console.warn('Notepad V250 addon could not load', error);
        }).then(() => runtime);
        if (window.LoggyNotepadV249) return finish(window.LoggyNotepadV249);
        if (!notepadRuntimePromiseV249) {
            if (!document.querySelector('link[data-loggy-notepad-css-v249]')) {
                const link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = '/template-notepad.css?v=503';
                link.dataset.loggyNotepadCssV249 = '1';
                document.head.appendChild(link);
            }
            notepadRuntimePromiseV249 = new Promise((resolve,reject) => {
                const existing = document.querySelector('script[data-loggy-notepad-js-v249]');
                if (existing) {
                    if (window.LoggyNotepadV249) return resolve(window.LoggyNotepadV249);
                    existing.addEventListener('load',() => resolve(window.LoggyNotepadV249),{once:true});
                    existing.addEventListener('error',reject,{once:true});
                    return;
                }
                const script = document.createElement('script');
                script.src = '/template-notepad.js?v=503';
                script.async = true;
                script.dataset.loggyNotepadJsV249 = '1';
                script.addEventListener('load',() => resolve(window.LoggyNotepadV249),{once:true});
                script.addEventListener('error',reject,{once:true});
                document.head.appendChild(script);
            });
        }
        return notepadRuntimePromiseV249.then(finish);
    }

    function readNotepadRouteV249() {
        try { const value = JSON.parse(sessionStorage.getItem(NOTEPAD_ROUTE_KEY_V249) || 'null'); return value && value.path === location.pathname ? value : null; } catch { return null; }
    }
    function rememberNotepadRouteV249(tab,pageId) {
        if (!tab) return;
        try { sessionStorage.setItem(NOTEPAD_ROUTE_KEY_V249,JSON.stringify({path:location.pathname,tabId:String(tab.id),pageId:String(pageId || tab.notepadV249?.activePageId || '')})); } catch {}
    }
    function clearNotepadRouteV249() { try { sessionStorage.removeItem(NOTEPAD_ROUTE_KEY_V249); } catch {} }

    async function uploadNotepadImageV249(tab,pageId,file) {
        const query = new URLSearchParams({tabId:String(tab.id),pageId:String(pageId),mime:String(file.type || 'application/octet-stream'),fileName:String(file.name || 'image')});
        const response = await fetch(`/api/notepad-media-raw/${encodeURIComponent(HOBBY)}?${query.toString()}`,{method:'POST',headers:{'Content-Type':'application/octet-stream'},body:await file.arrayBuffer()});
        const payload = await response.json().catch(()=>null);
        if (!response.ok || !payload?.image) throw new Error(payload?.message || 'Could not save notebook image.');
        return payload.image;
    }
    async function deleteNotepadImageV249(image) {
        if (!image || (!image.projectPath && !image.src)) return;
        await fetch(`/api/notepad-media/${encodeURIComponent(HOBBY)}`,{method:'DELETE',headers:{'Content-Type':'application/json'},body:JSON.stringify({projectPath:image.projectPath||'',src:image.src||''})}).catch(()=>null);
    }

    function itemLabelV249(item) {
        if (!item || typeof item !== 'object') return '';
        const keys = ['title','name','term','word','character','question','text','label','front','prompt','recipe','skill'];
        for (const key of keys) if (String(item[key] ?? '').trim()) return String(item[key]).trim();
        return '';
    }
    function componentLabelV249(component) {
        if (!component) return 'Component';
        const direct = component.title || component.text || component.placeholder || component.name;
        if (String(direct || '').trim()) return String(direct).trim();
        try { return getCustomComponentLabel(component) || 'Component'; } catch { return 'Component'; }
    }
    function collectComponentItemsV249(tab,component,targets) {
        const seen = new Set();
        const walk = (value,depth=0) => {
            if (!value || depth > 3) return;
            if (Array.isArray(value)) { value.forEach(item => walk(item,depth+1)); return; }
            if (typeof value !== 'object') return;
            if (value !== component && value.id && !seen.has(String(value.id))) {
                const label = itemLabelV249(value);
                if (label) {
                    seen.add(String(value.id));
                    targets.push({kind:'item',label,subtitle:`${tab.name || 'Tab'} · ${componentLabelV249(component)}`,icon:'ph-tag',tabId:String(tab.id),componentId:String(component.id),itemId:String(value.id)});
                }
            }
            Object.entries(value).forEach(([key,child]) => {
                if (['html','notes','body','description','src','data','projectPath'].includes(key)) return;
                if (Array.isArray(child) || (child && typeof child === 'object' && depth < 2)) walk(child,depth+1);
            });
        };
        Object.entries(component).forEach(([key,value]) => {
            if (key === 'id' || key === 'type') return;
            if (Array.isArray(value) && value.some(item => item && typeof item === 'object')) walk(value,0);
        });
    }

    function buildNotepadLinkTargetsV249() {
        const targets = [];
        try {
            Object.keys(db?.days || {}).map(Number).filter(Number.isFinite).sort((a,b)=>a-b).forEach(day => targets.push({kind:'day',label:`Day ${day}`,subtitle:'Daily Logs',icon:'ph-calendar-blank',day:String(day)}));
        } catch {}
        targets.push(
            {kind:'builtin',label:'Daily Logs',subtitle:'Built-in tab',icon:'ph-calendar',view:'daily'},
            {kind:'builtin',label:'Knowledge Base',subtitle:'Built-in tab',icon:'ph-books',view:'kb'},
            {kind:'builtin',label:'Quizzes',subtitle:'Built-in tab',icon:'ph-cards',view:'quizzes'},
            {kind:'builtin',label:'Toolbox',subtitle:'Built-in tab',icon:'ph-wrench',view:'tools'}
        );
        try {
            getCustomTabs().forEach(tab => {
                targets.push({kind:'tab',label:tab.name || 'Custom Tab',subtitle:isNotepadTabV249(tab)?'Notepad tab':'Custom tab',icon:tab.icon || 'ph-squares-four',tabId:String(tab.id)});
                if (isNotepadTabV249(tab)) {
                    const state = migrateTabNotepadStateV249(tab);
                    (state.pages || []).forEach(page => targets.push({kind:'notepadPage',label:page.title || 'Page',subtitle:`${tab.name || 'Untitled Notebook'} · notebook page`,icon:'ph-note',tabId:String(tab.id),pageId:String(page.id)}));
                    return;
                }
                (tab.components || []).forEach(component => {
                    if (!component?.id) return;
                    targets.push({kind:'component',label:componentLabelV249(component),subtitle:`${tab.name || 'Tab'} · component`,icon:'ph-layout',tabId:String(tab.id),componentId:String(component.id)});
                    collectComponentItemsV249(tab,component,targets);
                    if (component.type === 'dropdownV239' && Array.isArray(component.children)) {
                        component.children.forEach(child => {
                            if (!child?.id) return;
                            targets.push({kind:'component',label:componentLabelV249(child),subtitle:`${tab.name || 'Tab'} · ${componentLabelV249(component)}`,icon:'ph-layout',tabId:String(tab.id),componentId:String(child.id),parentComponentId:String(component.id)});
                            collectComponentItemsV249(tab,child,targets);
                        });
                    }
                });
            });
        } catch (error) { console.warn('Notepad link catalog failed',error); }
        return targets;
    }

    function flashLinkedElementV249(element) {
        if (!element) return;
        element.scrollIntoView?.({block:'center',behavior:'smooth'}); element.classList.add('notepad-link-target-flash-v249'); setTimeout(()=>element.classList.remove('notepad-link-target-flash-v249'),1500);
    }
    function navigateNotepadReferenceV249(target) {
        const kind = String(target?.kind || '');
        if (kind === 'notepadPage') { openExactNotepadPageV249(target.tabId,target.pageId); return; }
        if (kind === 'day') { const day = Number(target.day); if (Number.isFinite(day)) openDayLog(day); return; }
        if (kind === 'builtin') {
            if (target.view === 'daily') { try { initGrid(); switchView(gridView); } catch {} return; }
            const ids = {kb:'open-phrases-btn',quizzes:'open-quizzes-btn',tools:'open-tools-btn'}; document.getElementById(ids[target.view])?.click(); return;
        }
        if (['tab','component','item'].includes(kind) && target.tabId) {
            openCustomTab(String(target.tabId));
            if (kind !== 'tab') requestAnimationFrame(() => setTimeout(() => {
                const view = document.getElementById(`custom-tab-view-${CSS.escape(String(target.tabId))}`); if (!view) return;
                let element = null;
                if (target.itemId) element = view.querySelector(`[data-custom-item-id="${CSS.escape(String(target.itemId))}"],[data-item-id="${CSS.escape(String(target.itemId))}"],[data-card-id="${CSS.escape(String(target.itemId))}"]`);
                if (!element && target.componentId) element = view.querySelector(`[data-component-id="${CSS.escape(String(target.componentId))}"]`);
                flashLinkedElementV249(element);
            },80));
        }
    }

    // Register the built-in blueprint through + Create Tab.
    try {
        if (Array.isArray(CUSTOM_TAB_TEMPLATES_V53) && !CUSTOM_TAB_TEMPLATES_V53.some(template => template.id === NOTEPAD_TEMPLATE_ID_V249)) {
            CUSTOM_TAB_TEMPLATES_V53.push({id:NOTEPAD_TEMPLATE_ID_V249,name:'Notebook',icon:'ph-notebook',description:'A full-screen multi-page notebook with page categories, paper styles, movable images, drawing tools, and exact-page links from Daily Logs.'});
        }
        const buildBeforeNotepadV249 = buildPrebuiltTabComponentsV53;
        buildPrebuiltTabComponentsV53 = function(templateId) {
            if (templateId === NOTEPAD_TEMPLATE_ID_V249) return [{id:idV249('component-notepad'),type:NOTEPAD_COMPONENT_TYPE_V249,title:'Notebook'}];
            return buildBeforeNotepadV249.apply(this,arguments);
        };
        ensureCustomTabCreateModal?.();
        const section = document.querySelector('#custom-tab-create-modal .custom-tab-template-section-v53');
        if (section && typeof renderPrebuiltTabCardsV53 === 'function') { renderPrebuiltTabCardsV53(section); try { renderBlueprintCardsV162?.(); } catch {} }
    } catch (error) { console.warn('Notepad blueprint registration failed',error); }

    function buildNotepadViewV249(tab) {
        ensureNotepadBootstrapStyleV249();
        const view = document.createElement('div'); view.id = `custom-tab-view-${tab.id}`; view.className = 'view custom-tab-view notepad-tab-view-v249'; view.dataset.customTabId = tab.id; view.dataset.notepadV249 = '1';
        view.innerHTML = '<div class="notepad-runtime-host-v249"><div class="notepad-runtime-loading-v249">Opening notebook…</div></div>';
        return view;
    }
    const buildCustomTabViewBeforeNotepadV249 = buildCustomTabView;
    buildCustomTabView = function(tab) { return isNotepadTabV249(tab) ? buildNotepadViewV249(tab) : buildCustomTabViewBeforeNotepadV249.apply(this,arguments); };

    function ensureSpecialNotepadViewV249(tabId) {
        const tab = getCustomTab?.(tabId); if (!isNotepadTabV249(tab)) return document.getElementById(`custom-tab-view-${tabId}`);
        let view = document.getElementById(`custom-tab-view-${tabId}`);
        if (!view?.classList.contains('notepad-tab-view-v249')) {
            const replacement = buildNotepadViewV249(tab), wasActive = !!view?.classList.contains('active'); if (view) view.replaceWith(replacement); else document.body.insertBefore(replacement,document.getElementById('companion-stage') || null); view = replacement; if (wasActive) view.classList.add('active');
        }
        // V404: Notebook must be a direct body child for the fullscreen isolation
        // selectors to keep it visible while hiding the normal Log shell.
        if (view && view.parentElement !== document.body) {
            document.body.insertBefore(view, document.getElementById('companion-stage') || null);
        }
        return view;
    }
    function mountNotepadTabV249(tab,view) {
        if (!tab || !view || !isNotepadTabV249(tab)) return;
        const host = view.querySelector('.notepad-runtime-host-v249'); if (!host) return;
        const state = migrateTabNotepadStateV249(tab);
        if (host.__loggyNotepadV249) {
            const name = host.querySelector('.np-notebook-name-v249'); if (name) name.textContent = tab.name || 'Untitled Notebook';
            return host.__loggyNotepadV249;
        }
        if (host.dataset.notepadMountingV249 === '1') return;
        host.dataset.notepadMountingV249 = '1';
        ensureNotepadRuntimeV249().then(runtime => {
            if (!runtime || !document.contains(view)) { delete host.dataset.notepadMountingV249; return; }
            const api = runtime.mount(host,{
                id:String(tab.id),name:tab.name || 'Untitled Notebook',
                getState:() => tab.notepadV249 || state,
                saveState:async next => { tab.notepadV249 = next; rememberNotepadRouteV249(tab,next?.activePageId); try { await saveDb(); } catch {} },
                routeChanged:pageId => rememberNotepadRouteV249(tab,pageId),
                uploadImage:(file,pageId) => uploadNotepadImageV249(tab,pageId,file),
                deleteImage:deleteNotepadImageV249,
                getLinkTargets:buildNotepadLinkTargetsV249,
                navigate:navigateNotepadReferenceV249,
                exit:() => { clearNotepadRouteV249(); try { activeCustomTabId = null; customTabEditMode = false; initGrid(); switchView(gridView); } catch {} }
            });
            delete host.dataset.notepadMountingV249;
            return api;
        }).catch(error => { delete host.dataset.notepadMountingV249; console.error('Notepad runtime failed to load',error); host.innerHTML = '<div class="notepad-runtime-loading-v249">Could not load the notebook. Refresh this page and try again.</div>'; });
    }

    const renderCustomTabViewBeforeNotepadV249 = renderCustomTabView;
    renderCustomTabView = function(tabId) { const tab = getCustomTab?.(tabId); if (!isNotepadTabV249(tab)) return renderCustomTabViewBeforeNotepadV249.apply(this,arguments); const view = ensureSpecialNotepadViewV249(tabId); if (view) mountNotepadTabV249(tab,view); };
    const openCustomTabBeforeNotepadV249 = openCustomTab;
    openCustomTab = function(tabId) { const tab = getCustomTab?.(tabId); if (isNotepadTabV249(tab)) { ensureNotepadBootstrapStyleV249(); ensureSpecialNotepadViewV249(tabId); document.body.classList.add('notepad-tab-active-v249'); document.documentElement.classList.add('notepad-tab-active-v249'); } return openCustomTabBeforeNotepadV249.apply(this,arguments); };
    const renderAllCustomTabViewsBeforeNotepadV249 = renderAllCustomTabViews;
    renderAllCustomTabViews = function() { const result = renderAllCustomTabViewsBeforeNotepadV249.apply(this,arguments); try { getCustomTabs().filter(isNotepadTabV249).forEach(tab => ensureSpecialNotepadViewV249(tab.id)); } catch {} return result; };
    const switchViewBeforeNotepadV249 = switchView;
    switchView = function(viewToShow) {
        const isNotepad = !!viewToShow?.classList?.contains('notepad-tab-view-v249'), wasNotepad = document.body.classList.contains('notepad-tab-active-v249');
        ensureNotepadBootstrapStyleV249();
        document.body.classList.toggle('notepad-tab-active-v249',isNotepad); document.documentElement.classList.toggle('notepad-tab-active-v249',isNotepad);
        if (isNotepad) { try { document.querySelectorAll('[data-theme-hover-sound-enabled-v87="true"]').forEach(item=>{ if(typeof stopThemeHoverAudioForItemV87==='function') stopThemeHoverAudioForItemV87(item,0); }); } catch {} }
        const result = switchViewBeforeNotepadV249.apply(this,arguments);
        if (isNotepad) { const tab = getCustomTab?.(viewToShow.dataset.customTabId); mountNotepadTabV249(tab,viewToShow); rememberNotepadRouteV249(tab,tab?.notepadV249?.activePageId); document.documentElement.classList.remove('loading-log-page','restoring-log-view','notepad-restore-pending-v249'); }
        else if (wasNotepad) clearNotepadRouteV249();
        return result;
    };

    function allNotepadPagesV249() {
        const result=[]; try { getCustomTabs().filter(isNotepadTabV249).forEach(tab => { const state=migrateTabNotepadStateV249(tab); (state.pages||[]).forEach(page => result.push({tab,state,page})); }); } catch {} return result;
    }
    function notepadPagePreviewV249(page) {
        const text = stripV249(page?.html || '').slice(0,190) || 'Empty notebook page'; const image = Array.isArray(page?.images) ? page.images.find(item => item?.src) : null; const paper = ['blank','lined','dot','graph','cornell'].includes(page?.paper) ? page.paper : 'lined';
        return `<div class="daily-notepad-paper-v249" data-paper="${escV249(paper)}"><strong style="display:block;margin-bottom:4px;font:700 8px/1.2 system-ui,sans-serif;color:#333">${escV249(page?.title || 'Page')}</strong>${escV249(text)}${image?`<img src="${escV249(image.src)}" alt="">`:''}</div>`;
    }
    function openExactNotepadPageV249(tabId,pageId) {
        const tab = getCustomTab?.(String(tabId)); if (!tab || !isNotepadTabV249(tab)) return; const state = migrateTabNotepadStateV249(tab); if (state.pages.some(page => page.id === String(pageId))) state.activePageId = String(pageId); tab.notepadV249 = state; try { saveDb(); } catch {} rememberNotepadRouteV249(tab,state.activePageId); openCustomTab(tab.id);
        ensureNotepadRuntimeV249().then(runtime => requestAnimationFrame(() => { const host = document.querySelector(`#custom-tab-view-${CSS.escape(String(tab.id))} .notepad-runtime-host-v249`); runtime?.openPage?.(host,String(pageId)); }));
    }
    window.__loggyOpenNotepadPageV249 = openExactNotepadPageV249;

    function getDailyNotepadLinksV249() {
        if (!currentDay || !db?.days?.[currentDay]) return []; if (!Array.isArray(db.days[currentDay].notepadLinksV249)) db.days[currentDay].notepadLinksV249=[]; return db.days[currentDay].notepadLinksV249;
    }
    function ensureDailyNotepadLinksV249() {
        ensureNotepadBootstrapStyleV249();
        // V449: Notebook Pages belong inside Tab Items, never as a standalone Daily Log section.
        document.getElementById('daily-notepad-links-v249')?.remove();
        try { ensureDailyCustomTabLinksUI?.(); } catch {}
        try { applyHiddenLoggySectionsV432?.(); } catch {}
    }
    function renderDailyNotepadLinksV249() {
        ensureDailyNotepadLinksV249();
        const list=document.getElementById('daily-custom-tab-links-list'); if(!list)return;
        list.querySelectorAll('.daily-tab-notepad-item-v449').forEach(node=>node.remove());
        const links=getDailyNotepadLinksV249();
        links.forEach(link=>{
            const tab=getCustomTab?.(link.tabId),state=tab&&isNotepadTabV249(tab)?migrateTabNotepadStateV249(tab):null,page=state?.pages?.find(item=>item.id===link.pageId);
            const row=document.createElement('div'); row.className='daily-custom-tab-link daily-notepad-link-v249 daily-tab-notepad-item-v449';
            const main=document.createElement('button'); main.type='button'; main.className='daily-custom-tab-link-main daily-notepad-link-main-v249';
            main.innerHTML=`<span class="daily-notepad-thumb-v249">${notepadPagePreviewV249(page||{title:link.pageTitle})}</span><span class="daily-custom-tab-link-text daily-notepad-link-text-v249"><strong></strong><small></small></span>`;
            main.querySelector('strong').textContent=page?.title||link.pageTitle||'Missing notebook page';
            main.querySelector('small').textContent=`${tab?.name||link.tabName||'Untitled Notebook'} · Notebook Page`;
            main.disabled=!page; main.onclick=()=>page&&openExactNotepadPageV249(tab.id,page.id);
            const del=document.createElement('button'); del.type='button'; del.className='daily-custom-tab-unlink'; del.title='Remove from this day'; del.innerHTML='<i class="ph ph-x"></i>';
            del.onclick=()=>{db.days[currentDay].notepadLinksV249=getDailyNotepadLinksV249().filter(item=>item.id!==link.id);saveDb();renderDailyNotepadLinksV249()};
            row.append(main,del); list.appendChild(row);
        });
        window.__syncDailySpecialTabItemsEmptyV449?.();
    }
    window.__renderDailyNotepadTabItemsV449 = renderDailyNotepadLinksV249;
    function ensureDailyNotepadPickerV249() {
        if (document.getElementById('daily-notepad-picker-v249')) return; const modal=document.createElement('div');modal.id='daily-notepad-picker-v249';modal.className='modal-overlay hidden daily-notepad-picker-v249';modal.innerHTML=`<div class="modal-box"><div class="modal-header"><div><h2>Choose a Notebook Page</h2><p class="progress-hint" style="margin:3px 0 0">Each card is a preview of the saved notebook page.</p></div><button type="button" class="small-icon-btn" data-close><i class="ph ph-x"></i></button></div><div class="daily-notepad-picker-grid-v249" data-grid></div></div>`;document.body.appendChild(modal);const close=()=>modal.classList.add('hidden');modal.querySelector('[data-close]').onclick=close;modal.onclick=e=>{if(e.target===modal)close()};
    }
    function linkNotepadPageToCurrentDayV249(tab,page) {
        if (!currentDay || !tab || !page) return; const links=getDailyNotepadLinksV249(); if (!links.some(item=>item.tabId===tab.id&&item.pageId===page.id)) links.push({id:idV249('notepad-link'),tabId:String(tab.id),pageId:String(page.id),tabName:tab.name,pageTitle:page.title}); saveDb();renderDailyNotepadLinksV249();
    }
    function openDailyNotepadPickerV249() {
        if (!currentDay) return; ensureDailyNotepadPickerV249(); const modal=document.getElementById('daily-notepad-picker-v249'),grid=modal.querySelector('[data-grid]');grid.innerHTML='';const pages=allNotepadPagesV249(); if(!pages.length){grid.innerHTML='<div class="daily-notepad-empty-v249">Create a Notebook tab first, then add a page inside it.</div>';modal.classList.remove('hidden');return}
        pages.forEach(({tab,page})=>{const card=document.createElement('button');card.type='button';card.className='daily-notepad-picker-card-v249';card.innerHTML=`<div class="daily-notepad-picker-preview-v249">${notepadPagePreviewV249(page)}</div><div class="meta"><strong></strong><small></small></div>`;card.querySelector('strong').textContent=page.title||'Page';card.querySelector('small').textContent=tab.name||'Untitled Notebook';card.onclick=()=>{linkNotepadPageToCurrentDayV249(tab,page);modal.classList.add('hidden')};grid.appendChild(card)}); modal.classList.remove('hidden');
    }

    try {
        const openDayLogBeforeNotepadV249 = openDayLog;
        openDayLog = function(){const result=openDayLogBeforeNotepadV249.apply(this,arguments);requestAnimationFrame(renderDailyNotepadLinksV249);return result};
        if (currentDay) requestAnimationFrame(renderDailyNotepadLinksV249);
    } catch (error) { console.warn('Daily Notepad links setup failed',error); }

    // V449: the base Tab Items renderer clears its list, so restore special
    // Whiteboard/Notebook rows immediately after every normal Tab Items render.
    try {
        if (!window.__loggyDailySpecialTabItemsRefreshV449 && typeof renderDailyCustomTabLinks === 'function') {
            window.__loggyDailySpecialTabItemsRefreshV449 = true;
            const renderDailyCustomTabLinksBeforeV449 = renderDailyCustomTabLinks;
            renderDailyCustomTabLinks = function() {
                const result = renderDailyCustomTabLinksBeforeV449.apply(this, arguments);
                try { window.__renderDailyWhiteboardTabItemsV449?.(); } catch {}
                try { window.__renderDailyNotepadTabItemsV449?.(); } catch {}
                return result;
            };
            if (currentDay) requestAnimationFrame(() => renderDailyCustomTabLinks());
        }
    } catch (error) { console.warn('V449 Tab Items special-link refresh failed', error); }

    // Reuse Daily Logs > Add from a Tab. Selecting a Notepad tab swaps the
    // Component dropdown for notebook-page preview cards.
    try {
        const populateBeforeNotepadV249 = populateDailyCustomComponentSelect;
        populateDailyCustomComponentSelect = function() {
            const tabSelect=document.getElementById('daily-custom-tab-picker-tab'),componentSelect=document.getElementById('daily-custom-tab-picker-component'),tab=tabSelect?getCustomTab?.(tabSelect.value):null,section=componentSelect?.closest('.modal-section'),label=section?.querySelector('.field-label');section?.querySelector('.daily-tab-notepad-page-wrap-v249')?.remove();
            if (!isNotepadTabV249(tab)) { if(componentSelect)componentSelect.style.display=''; if(label)label.textContent='Component'; return populateBeforeNotepadV249.apply(this,arguments); }
            if(!section||!componentSelect)return;componentSelect.innerHTML='<option value="">Notebook pages</option>';componentSelect.style.display='none';if(label)label.textContent='Page';const wrap=document.createElement('div');wrap.className='daily-tab-notepad-page-wrap-v249';const grid=document.createElement('div');grid.className='daily-tab-notepad-page-grid-v249';const state=migrateTabNotepadStateV249(tab);if(!state.pages.length)grid.innerHTML='<div class="daily-notepad-empty-v249">No notebook pages yet.</div>';else state.pages.forEach(page=>{const card=document.createElement('button');card.type='button';card.className='daily-tab-notepad-card-v249';card.innerHTML=`<div class="daily-notepad-picker-preview-v249">${notepadPagePreviewV249(page)}</div><div class="meta"><strong></strong><small></small></div>`;card.querySelector('strong').textContent=page.title||'Page';const cat=state.categories.find(c=>c.id===page.categoryId);card.querySelector('small').textContent=cat?.name||'Notes';card.onclick=()=>{linkNotepadPageToCurrentDayV249(tab,page);document.getElementById('daily-custom-tab-picker-modal')?.classList.add('hidden')};grid.appendChild(card)});wrap.appendChild(grid);section.appendChild(wrap);const actions=document.getElementById('daily-custom-tab-picker-actions');if(actions)actions.innerHTML='<p class="progress-hint" style="margin-top:10px">Choose a notebook page preview above to link it to this day.</p>';
        };
        const actionsBeforeNotepadV249 = renderDailyCustomTabPickerActions;
        renderDailyCustomTabPickerActions = function(){const tab=getCustomTab?.(document.getElementById('daily-custom-tab-picker-tab')?.value);if(isNotepadTabV249(tab)){const actions=document.getElementById('daily-custom-tab-picker-actions');if(actions)actions.innerHTML='<p class="progress-hint" style="margin-top:10px">Choose a notebook page preview above to link it to this day.</p>';return}return actionsBeforeNotepadV249.apply(this,arguments)};
    } catch (error) { console.warn('Notepad Add from Tab picker upgrade failed',error); }

    function restoreNotepadRouteV249() {
        const route=readNotepadRouteV249(); if(!route){document.documentElement.classList.remove('notepad-restore-pending-v249');return} const tab=getCustomTab?.(route.tabId);if(!isNotepadTabV249(tab)){clearNotepadRouteV249();document.documentElement.classList.remove('notepad-restore-pending-v249');return}
        const state=migrateTabNotepadStateV249(tab);if(state.pages.some(page=>page.id===route.pageId))state.activePageId=route.pageId;tab.notepadV249=state;try{ensureSpecialNotepadViewV249(tab.id);openCustomTab(tab.id);const view=document.getElementById(`custom-tab-view-${tab.id}`);if(view){document.body.classList.add('notepad-tab-active-v249');document.documentElement.classList.add('notepad-tab-active-v249');mountNotepadTabV249(tab,view);ensureNotepadRuntimeV249().then(runtime=>{const host=view.querySelector('.notepad-runtime-host-v249');if(route.pageId&&host)runtime?.openPage?.(host,route.pageId);document.documentElement.classList.remove('notepad-restore-pending-v249','loading-log-page','restoring-log-view')})}}catch(error){console.warn('Notepad reload restore failed',error);clearNotepadRouteV249();document.documentElement.classList.remove('notepad-restore-pending-v249')}
    }
    requestAnimationFrame(restoreNotepadRouteV249);

    // Ensure a just-created Notepad has its special state immediately, before
    // the user starts typing or uploads its first image.
    try {
        const createBeforeNotepadV249 = createCustomTabFromModalV53;
        if (typeof createBeforeNotepadV249 === 'function') {
            createCustomTabFromModalV53 = function() {
                const modal = document.getElementById('custom-tab-create-modal');
                const templateId = String(modal?.dataset?.selectedTemplateV53 || '');
                const result = createBeforeNotepadV249.apply(this,arguments);
                if (templateId === NOTEPAD_TEMPLATE_ID_V249) {
                    try {
                        const tab = getCustomTab?.(activeCustomTabId);
                        if (isNotepadTabV249(tab)) { migrateTabNotepadStateV249(tab); saveDb(); }
                    } catch {}
                }
                return result;
            };
        }
    } catch {}
})();


// ============================================================
// V276 — Toolbox tab state also controls the Daily Log Tools section
// ============================================================
(() => {
    'use strict';
    if (window.__loggyToolboxDailySectionSyncV276) return;
    window.__loggyToolboxDailySectionSyncV276 = true;

    function toolboxHiddenV276() {
        try {
            if (typeof isBuiltInTabHiddenV52 === 'function') {
                return !!isBuiltInTabHiddenV52('tools');
            }
        } catch {}
        try {
            return !!db?.settings?.hiddenBuiltInTabsV52?.includes?.('tools');
        } catch {}
        return false;
    }

    function dailyToolsSectionV276() {
        return document.getElementById('add-tool-to-day-btn')?.closest?.('section') || null;
    }

    function syncDailyToolsSectionV276() {
        const section = dailyToolsSectionV276();
        if (!section) return;
        const perLoggyHiddenV433 = db?.settings?.hiddenSectionsV432?.tools === true;
        const hidden = toolboxHiddenV276() || perLoggyHiddenV433;
        section.classList.toggle('daily-tools-hidden-v276', hidden);
        section.classList.toggle('loggy-section-hidden-v433', perLoggyHiddenV433);
        section.hidden = hidden;
        section.setAttribute('aria-hidden', hidden ? 'true' : 'false');
        try { window.__applyHiddenLoggySectionsV433?.(); } catch (_) {}
    }

    window.__syncDailyToolsSectionV276 = syncDailyToolsSectionV276;

    try {
        if (typeof deleteBuiltInLogTabV52 === 'function') {
            const deleteBeforeV276 = deleteBuiltInLogTabV52;
            deleteBuiltInLogTabV52 = async function(key) {
                const result = await deleteBeforeV276.apply(this, arguments);
                if (String(key) === 'tools') syncDailyToolsSectionV276();
                return result;
            };
        }
    } catch (error) {
        console.warn('V276 Toolbox delete sync install failed', error);
    }

    try {
        if (typeof restoreBuiltInLogTabV52 === 'function') {
            const restoreBeforeV276 = restoreBuiltInLogTabV52;
            restoreBuiltInLogTabV52 = function(key) {
                const result = restoreBeforeV276.apply(this, arguments);
                if (String(key) === 'tools') requestAnimationFrame(syncDailyToolsSectionV276);
                return result;
            };
        }
    } catch (error) {
        console.warn('V276 Toolbox restore sync install failed', error);
    }

    try {
        if (typeof applyUnifiedLogNavOrderV52 === 'function') {
            const applyBeforeV276 = applyUnifiedLogNavOrderV52;
            applyUnifiedLogNavOrderV52 = function() {
                const result = applyBeforeV276.apply(this, arguments);
                syncDailyToolsSectionV276();
                return result;
            };
        }
    } catch (error) {
        console.warn('V276 Toolbox nav sync install failed', error);
    }

    try {
        if (typeof openDayLog === 'function') {
            const openDayBeforeV276 = openDayLog;
            openDayLog = function() {
                const result = openDayBeforeV276.apply(this, arguments);
                requestAnimationFrame(syncDailyToolsSectionV276);
                return result;
            };
        }
    } catch (error) {
        console.warn('V276 Toolbox day sync install failed', error);
    }

    requestAnimationFrame(syncDailyToolsSectionV276);
    setTimeout(syncDailyToolsSectionV276, 120);
})();


// ============================================================================
// V404 — FINAL WHITEBOARD / NOTEBOOK FULLSCREEN STRUCTURAL OWNER
// Special full-screen tabs must remain direct children of <body>. Later custom
// tab render passes may recreate/move views, so re-promote them at the final
// layer before switchView can hide the regular Log shell.
// ============================================================================
(() => {
  'use strict';
  if (window.__loggySpecialTabFullscreenV404) return;
  window.__loggySpecialTabFullscreenV404 = true;

  const promote = view => {
    if (!view || !(view instanceof HTMLElement)) return view;
    if (!view.classList.contains('whiteboard-tab-view-v198') && !view.classList.contains('notepad-tab-view-v249')) return view;
    if (view.parentElement !== document.body) document.body.insertBefore(view, document.getElementById('companion-stage') || null);
    return view;
  };
  const viewFor = id => document.getElementById(`custom-tab-view-${String(id || '')}`);

  try {
    const old = window.openCustomTab;
    if (typeof old === 'function' && !old.__fullscreenV404) {
      const fn = function(tabId) {
        promote(viewFor(tabId));
        const result = old.apply(this, arguments);
        const finish = () => {
          const view = promote(viewFor(tabId));
          const whiteboard = !!view?.classList.contains('whiteboard-tab-view-v198');
          const notebook = !!view?.classList.contains('notepad-tab-view-v249');
          if (whiteboard || notebook) {
            document.body.classList.toggle('whiteboard-tab-active-v198', whiteboard);
            document.documentElement.classList.toggle('whiteboard-tab-active-v198', whiteboard);
            document.body.classList.toggle('notepad-tab-active-v249', notebook);
            document.documentElement.classList.toggle('notepad-tab-active-v249', notebook);
          }
        };
        finish(); requestAnimationFrame(finish);
        return result;
      };
      fn.__fullscreenV404 = true; window.openCustomTab = fn; try { openCustomTab = fn; } catch {}
    }
  } catch {}

  try {
    const old = window.switchView;
    if (typeof old === 'function' && !old.__fullscreenV404) {
      const fn = function(viewToShow) {
        promote(viewToShow);
        const result = old.apply(this, arguments);
        promote(viewToShow);
        return result;
      };
      fn.__fullscreenV404 = true; window.switchView = fn; try { switchView = fn; } catch {}
    }
  } catch {}

  const repair = () => document.querySelectorAll('.whiteboard-tab-view-v198,.notepad-tab-view-v249').forEach(promote);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', repair, {once:true}); else repair();
})();


// ============================================================================
// V453 — INDEPENDENT CUSTOM KB COMPONENT
// This is intentionally separate from the log page's real Knowledge Base.
// Adding it also inserts the existing reusable Search Bar component directly
// above it instead of maintaining a second one-off search implementation.
// ============================================================================
(() => {
  'use strict';
  if (window.__loggyCustomKnowledgeComponentV453) return;
  window.__loggyCustomKnowledgeComponentV453 = true;

  const TYPE = 'customKnowledgeBaseV453';
  const LEGACY_TYPE = 'knowledgeBaseV431';
  const esc = value => String(value ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const uid = prefix => `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,8)}`;
  const splitList = value => [...new Set(String(value || '').split(',').map(x => x.trim()).filter(Boolean))];

  try {
    for (let i = CUSTOM_COMPONENT_LIBRARY.length - 1; i >= 0; i--) {
      if (CUSTOM_COMPONENT_LIBRARY[i]?.type === LEGACY_TYPE || CUSTOM_COMPONENT_LIBRARY[i]?.type === TYPE) {
        CUSTOM_COMPONENT_LIBRARY.splice(i, 1);
      }
    }
    const after = CUSTOM_COMPONENT_LIBRARY.findIndex(def => def.type === 'globalSearchV163');
    const fallbackAfter = CUSTOM_COMPONENT_LIBRARY.findIndex(def => def.type === 'search');
    const anchor = after >= 0 ? after : fallbackAfter;
    CUSTOM_COMPONENT_LIBRARY.splice(anchor >= 0 ? anchor + 1 : CUSTOM_COMPONENT_LIBRARY.length, 0,
      {type:TYPE,label:'Knowledge Base',icon:'ph-books'});
  } catch {}

  try {
    const before = defaultCustomComponent;
    defaultCustomComponent = function(type) {
      if (type === TYPE) return {
        id: uid('component'),
        type: TYPE,
        title: 'Knowledge Base',
        titleBackground: 'none',
        categories: [],
        fields: [],
        items: []
      };
      return before.apply(this, arguments);
    };
  } catch {}

  function normalize(component) {
    if (!component) return component;
    component.type = TYPE;
    component.title = String(component.title || 'Knowledge Base');
    component.categories = Array.isArray(component.categories) ? component.categories.map(String).filter(Boolean) : [];
    component.fields = Array.isArray(component.fields) ? component.fields.map(String).filter(Boolean) : [];
    component.items = Array.isArray(component.items) ? component.items : [];
    component.items.forEach(item => {
      item.id ||= uid('kb-item');
      item.title = String(item.title || 'Untitled Item');
      item.category = String(item.category || '');
      item.values = item.values && typeof item.values === 'object' && !Array.isArray(item.values) ? item.values : {};
    });
    return component;
  }

  function migrateLegacy() {
    let changed = false;
    try {
      (db?.settings?.customTabs || []).forEach(tab => {
        if (!Array.isArray(tab.components)) return;
        for (let i = 0; i < tab.components.length; i++) {
          const component = tab.components[i];
          if (component?.type !== LEGACY_TYPE) continue;
          // The old component pointed at the real KB. Do not carry those links
          // into the new independent component; start clean as requested.
          tab.components[i] = normalize({
            id: component.id || uid('component'),
            type: TYPE,
            title: component.title || 'Knowledge Base',
            titleBackground: component.titleBackground || 'none',
            categories: [], fields: [], items: []
          });
          if (i === 0 || tab.components[i - 1]?.type !== 'search') {
            const search = defaultCustomComponent('search');
            search.placeholder = 'Search Custom KB...';
            tab.components.splice(i, 0, search);
            i++;
          }
          changed = true;
        }
      });
      if (changed) saveDb?.();
    } catch {}
    return changed;
  }

  async function editItem(tab, component, item = null) {
    normalize(component);
    const current = item || {id:uid('kb-item'), title:'', category:'', values:{}};
    const formFields = [
      {name:'title',label:'Item Name',value:current.title || ''}
    ];
    if (component.categories.length) {
      formFields.push({
        name:'category', label:'Category', type:'select', value:current.category || component.categories[0],
        options:component.categories.map(name => ({value:name,label:name}))
      });
    } else {
      formFields.push({name:'category',label:'Category (optional)',value:current.category || '',placeholder:'e.g. Grammar'});
    }
    component.fields.forEach((field, index) => {
      formFields.push({name:`field_${index}`,label:field,value:String(current.values?.[field] || ''),type:'textarea'});
    });
    const values = await showAppFormModal({
      title:item ? 'Edit Knowledge Base Item' : 'Add Knowledge Base Item',
      submitLabel:item ? 'Save' : 'Add',
      fields:formFields
    });
    if (!values || !String(values.title || '').trim()) return;
    current.title = String(values.title).trim();
    current.category = String(values.category || '').trim();
    current.values ||= {};
    component.fields.forEach((field,index) => { current.values[field] = String(values[`field_${index}`] || ''); });
    if (!item) component.items.push(current);
    try { await saveDb(); } catch {}
    renderCustomTabView(tab.id);
  }

  function renderCustomKb(tab, component, content) {
    normalize(component);
    content.innerHTML = `
      <div class="custom-kb-independent-v453">
        <div class="custom-collection-header">
          <h2>${esc(component.title || 'Knowledge Base')}</h2>
          <div class="custom-kb-head-actions-v453">
            <span>${component.items.length} item${component.items.length===1?'':'s'}</span>
            <button type="button" class="small-icon-btn custom-kb-add-v453" title="Add item" aria-label="Add Knowledge Base item"><i class="ph ph-plus"></i></button>
          </div>
        </div>
        <div class="custom-kb-grid-v453"></div>
      </div>`;

    const grid = content.querySelector('.custom-kb-grid-v453');
    if (!component.items.length) {
      grid.innerHTML = '<div class="custom-feature-empty-v162 custom-kb-empty-v453">This Knowledge Base is empty. Use + to add your first item.</div>';
    } else {
      component.items.forEach(item => {
        const article = document.createElement('article');
        article.className = 'custom-kb-card-v453 custom-searchable-item custom-content-editable';
        article.dataset.customItemId = item.id;
        const fieldText = component.fields.map(field => `${field} ${item.values?.[field] || ''}`).join(' ');
        article.dataset.searchText = `${item.title || ''} ${item.category || ''} ${fieldText}`.toLowerCase();
        const valuesHtml = component.fields
          .filter(field => String(item.values?.[field] || '').trim())
          .map(field => `<div class="custom-kb-field-v453"><strong>${esc(field)}</strong><span>${esc(item.values[field])}</span></div>`)
          .join('');
        article.innerHTML = `
          <div class="custom-kb-card-head-v453">
            <strong>${esc(item.title || 'Untitled Item')}</strong>
            ${item.category ? `<small>${esc(item.category)}</small>` : ''}
          </div>
          ${valuesHtml ? `<div class="custom-kb-values-v453">${valuesHtml}</div>` : ''}`;
        article.addEventListener('dblclick', () => editItem(tab, component, item));
        article.addEventListener('contextmenu', event => {
          event.preventDefault();
          showCustomItemContextMenu(event.clientX,event.clientY,[
            {label:'Edit item',icon:'ph-pencil-simple',action:()=>editItem(tab,component,item)},
            {label:'Delete item',icon:'ph-trash',danger:true,action:async()=>{
              const ok=await showAppConfirm({title:'Delete Knowledge Base Item',message:`Delete “${item.title || 'this item'}”?`,confirmLabel:'Delete'});
              if(!ok)return;
              component.items=component.items.filter(entry=>entry.id!==item.id);
              try{await saveDb();}catch{}
              renderCustomTabView(tab.id);
            }}
          ]);
        });
        grid.appendChild(article);
      });
    }
    content.querySelector('.custom-kb-add-v453')?.addEventListener('click',()=>editItem(tab,component));
  }

  try {
    const before = renderCustomComponentContent;
    renderCustomComponentContent = function(tab, component, content) {
      if (component?.type === LEGACY_TYPE) { component.type = TYPE; component.categories = []; component.fields = []; component.items = []; try{saveDb?.();}catch{} }
      if (component?.type === TYPE) return renderCustomKb(tab, normalize(component), content);
      return before.apply(this, arguments);
    };
  } catch {}

  try {
    const before = getCustomComponentItemArray;
    getCustomComponentItemArray = function(component) {
      if (component?.type === LEGACY_TYPE) { component.type=TYPE; component.categories=[]; component.fields=[]; component.items=[]; }
      if (component?.type === TYPE) return normalize(component).items;
      return before.apply(this, arguments);
    };
  } catch {}

  try {
    const before = getCustomItemLabel;
    getCustomItemLabel = function(component, item) {
      if (component?.type === LEGACY_TYPE) component.type=TYPE;
      if (component?.type === TYPE) return String(item?.title || 'Knowledge Base Item');
      return before.apply(this, arguments);
    };
  } catch {}

  try {
    const before = editCustomComponent;
    editCustomComponent = async function(tabId, componentId) {
      const tab = getCustomTab(tabId);
      const component = tab?.components?.find(c => c.id === componentId);
      if (component?.type === TYPE) {
        normalize(component);
        const values = await showAppFormModal({
          title:'Knowledge Base Settings', submitLabel:'Save', fields:[
            {name:'title',label:'Section Title',value:component.title || 'Knowledge Base'},
            {name:'categories',label:'Categories',value:component.categories.join(', '),placeholder:'e.g. Words, Patterns, Grammar'},
            {name:'fields',label:'Item Fields',value:component.fields.join(', '),placeholder:'e.g. Meaning, Pronunciation, Example'}
          ]
        });
        if (!values) return;
        component.title = String(values.title || '').trim() || 'Knowledge Base';
        component.categories = splitList(values.categories);
        component.fields = splitList(values.fields);
        try { await saveDb(); } catch {}
        renderCustomTabView(tabId);
        return;
      }
      return before.apply(this, arguments);
    };
  } catch {}

  // Add the REAL reusable Search Bar component above every newly-created
  // Custom KB. It stays independently editable/movable/deletable.
  try {
    const before = addCustomComponent;
    addCustomComponent = function(tabId, type, index = null) {
      if (type !== TYPE) return before.apply(this, arguments);
      const tab = getCustomTab(tabId);
      if (!tab) return;
      if (!Array.isArray(tab.components)) tab.components=[];
      const search = defaultCustomComponent('search');
      search.placeholder = 'Search Custom KB...';
      const kb = defaultCustomComponent(TYPE);
      const insertAt = index === null || index < 0 || index > tab.components.length ? tab.components.length : index;
      tab.components.splice(insertAt,0,search,kb);
      saveDb();
      renderCustomTabView(tabId);
    };
  } catch {}

  try {
    const before = createCustomItemFromDailyView;
    createCustomItemFromDailyView = async function(tab, component) {
      if (component?.type === TYPE) {
        await editItem(tab, normalize(component));
        return null;
      }
      return before.apply(this, arguments);
    };
  } catch {}

  migrateLegacy();
  document.addEventListener('DOMContentLoaded',()=>{ if(migrateLegacy()) try{renderAllCustomTabViews?.();renderCustomTabNavigation?.();}catch{} },{once:true});
  setTimeout(()=>{ if(migrateLegacy()) try{renderAllCustomTabViews?.();renderCustomTabNavigation?.();}catch{} },700);
  setTimeout(()=>{ if(migrateLegacy()) try{renderAllCustomTabViews?.();renderCustomTabNavigation?.();}catch{} },1800);
})();

// ============================================================================
// V447 — FINAL TRUE-FULLSCREEN OWNER FOR WHITEBOARD + NOTEBOOK
// Generic theme/view styling can still turn these special tabs into card-sized
// squares. This final layer promotes them to <body>, stamps viewport geometry
// with inline !important values, and repairs the loaded runtime root as well.
// ============================================================================
(() => {
    'use strict';
    if (window.__loggySpecialTabFullscreenV447) return;
    window.__loggySpecialTabFullscreenV447 = true;

    const isWhiteboard = view => !!view?.classList?.contains('whiteboard-tab-view-v198');
    const isNotebook = view => !!view?.classList?.contains('notepad-tab-view-v249');
    const isSpecial = view => isWhiteboard(view) || isNotebook(view);

    const setImportant = (element, property, value) => {
        try { element?.style?.setProperty(property, value, 'important'); } catch (_) {}
    };

    function stampFullscreenV447(view) {
        if (!view || !(view instanceof HTMLElement) || !isSpecial(view)) return view;

        if (view.parentElement !== document.body) {
            document.body.insertBefore(view, document.getElementById('companion-stage') || null);
        }

        view.classList.add('loggy-special-fullscreen-v447');
        [
            ['position','fixed'],['inset','0'],['left','0'],['top','0'],['right','0'],['bottom','0'],
            ['width','100vw'],['height','100dvh'],['min-width','100vw'],['min-height','100dvh'],
            ['max-width','none'],['max-height','none'],['margin','0'],['padding','0'],
            ['transform','none'],['border-radius','0'],['overflow','hidden'],
            ['box-sizing','border-box'],['z-index','2147480000'],['visibility','visible'],
            ['pointer-events','auto']
        ].forEach(([property, value]) => setImportant(view, property, value));

        const host = view.querySelector(
            isWhiteboard(view) ? '.whiteboard-runtime-host-v198' : '.notepad-runtime-host-v249'
        );

        if (host) {
            [
                ['position','fixed'],['inset','0'],['left','0'],['top','0'],['right','0'],['bottom','0'],
                ['width','100vw'],['height','100dvh'],['min-width','100vw'],['min-height','100dvh'],
                ['max-width','none'],['max-height','none'],['margin','0'],['padding','0'],
                ['transform','none'],['border-radius','0'],['overflow','hidden'],
                ['box-sizing','border-box'],['visibility','visible'],['pointer-events','auto']
            ].forEach(([property, value]) => setImportant(host, property, value));

            const runtimeRoot = host.firstElementChild;
            if (runtimeRoot) {
                [
                    ['width','100%'],['height','100%'],['min-width','100%'],['min-height','100%'],
                    ['max-width','none'],['max-height','none'],['margin','0'],['box-sizing','border-box']
                ].forEach(([property, value]) => setImportant(runtimeRoot, property, value));
            }
        }

        return view;
    }

    function syncSpecialFullscreenV447(view) {
        if (!isSpecial(view)) return;
        stampFullscreenV447(view);

        const whiteboard = isWhiteboard(view);
        const notebook = isNotebook(view);
        document.body.classList.toggle('whiteboard-tab-active-v198', whiteboard);
        document.documentElement.classList.toggle('whiteboard-tab-active-v198', whiteboard);
        document.body.classList.toggle('notepad-tab-active-v249', notebook);
        document.documentElement.classList.toggle('notepad-tab-active-v249', notebook);

        // Repair again after the async runtime inserts its own root.
        requestAnimationFrame(() => stampFullscreenV447(view));
        setTimeout(() => stampFullscreenV447(view), 60);
        setTimeout(() => stampFullscreenV447(view), 240);
    }

    const viewFor = tabId => document.getElementById(`custom-tab-view-${String(tabId || '')}`);

    try {
        const previous = window.openCustomTab || (typeof openCustomTab === 'function' ? openCustomTab : null);
        if (typeof previous === 'function' && !previous.__fullscreenV447) {
            const wrapped = function(tabId) {
                let view = stampFullscreenV447(viewFor(tabId));
                const result = previous.apply(this, arguments);
                const finish = () => {
                    view = stampFullscreenV447(viewFor(tabId) || view);
                    if (isSpecial(view)) syncSpecialFullscreenV447(view);
                };
                finish();
                requestAnimationFrame(finish);
                setTimeout(finish, 80);
                return result;
            };
            wrapped.__fullscreenV447 = true;
            window.openCustomTab = wrapped;
            try { openCustomTab = wrapped; } catch (_) {}
        }
    } catch (_) {}

    try {
        const previous = window.switchView || (typeof switchView === 'function' ? switchView : null);
        if (typeof previous === 'function' && !previous.__fullscreenV447) {
            const wrapped = function(viewToShow) {
                if (isSpecial(viewToShow)) stampFullscreenV447(viewToShow);
                const result = previous.apply(this, arguments);
                if (isSpecial(viewToShow)) syncSpecialFullscreenV447(viewToShow);
                return result;
            };
            wrapped.__fullscreenV447 = true;
            window.switchView = wrapped;
            try { switchView = wrapped; } catch (_) {}
        }
    } catch (_) {}

    const repairAll = () => {
        document.querySelectorAll('.whiteboard-tab-view-v198,.notepad-tab-view-v249').forEach(view => {
            stampFullscreenV447(view);
            if (view.classList.contains('active')) syncSpecialFullscreenV447(view);
        });
    };

    // V499: activation wrappers above are the only fullscreen owner.
    // Do NOT watch the entire document: Whiteboard/Notebook generate lots of DOM
    // changes while drawing, typing and dragging, and the old observer re-stamped
    // the whole workspace on each one, making clicks and gestures appear frozen.
    if (document.body) repairAll();
    else document.addEventListener('DOMContentLoaded', repairAll, { once:true });
})();

// ============================================================================
// V461 — CUSTOM KB PARITY
// Standalone custom-tab Knowledge Base with the normal KB layout language.
// It owns its own categories/field schemas/items and has zero Daily Log links.
// Normal reusable Search Bar components can filter its item cards.
// ============================================================================
(() => {
  'use strict';
  if (window.__loggyCustomKbParityV461) return;
  window.__loggyCustomKbParityV461 = true;
  const TYPE='customKnowledgeBaseV453';
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const uid=p=>`${p}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,8)}`;

  function normalize(c){
    if(!c)return c;
    c.type=TYPE;c.title=String(c.title||'Knowledge Base');if(c.title==='Custom KB')c.title='Knowledge Base';
    c.categories=Array.isArray(c.categories)?c.categories.map(String).filter(Boolean):[];
    c.categorySettings=(c.categorySettings&&typeof c.categorySettings==='object')?c.categorySettings:{};
    // Migrate the old global field list into every existing category once.
    if(Array.isArray(c.fields)&&c.fields.length){
      c.categories.forEach(cat=>{if(!c.categorySettings[cat])c.categorySettings[cat]={fields:c.fields.map(name=>({id:uid('field'),name:String(name),kind:'text'}))};});
      delete c.fields;
    }
    c.categories.forEach(cat=>{
      const cfg=c.categorySettings[cat]||(c.categorySettings[cat]={fields:[]});
      cfg.fields=Array.isArray(cfg.fields)?cfg.fields.map((f,i)=>typeof f==='string'?{id:uid('field'),name:f,kind:'text'}:{id:f.id||uid('field'),name:String(f.name||`Field ${i+1}`),kind:String(f.kind||'text')}):[];
    });
    c.items=Array.isArray(c.items)?c.items:[];
    c.items.forEach(it=>{it.id||=uid('kb-item');it.title=String(it.title||'Untitled Item');it.category=String(it.category||c.categories[0]||'');it.values=(it.values&&typeof it.values==='object')?it.values:{};it.tags=Array.isArray(it.tags)?it.tags:[];});
    if(c.activeCategory!=='all'&&!c.categories.includes(c.activeCategory))c.activeCategory='all';
    c.activeCategory ||= 'all';
    return c;
  }
  const fieldsFor=(c,cat)=>normalize(c).categorySettings?.[cat]?.fields||[];

  async function addCategory(tab,c){
    const v=await showAppPrompt({title:'Add Category',label:'Category Name',value:'',submitLabel:'Add Category'});
    const name=String(v||'').trim(); if(!name||c.categories.includes(name))return;
    c.categories.push(name);c.categorySettings[name]={fields:[]};c.activeCategory=name;await saveDb();renderCustomTabView(tab.id);
  }
  async function renameCategory(tab,c,old){
    const v=await showAppPrompt({title:'Rename Category',label:'Category Name',value:old,submitLabel:'Save'});
    const name=String(v||'').trim();if(!name||name===old||c.categories.includes(name))return;
    c.categories=c.categories.map(x=>x===old?name:x);c.categorySettings[name]=c.categorySettings[old]||{fields:[]};delete c.categorySettings[old];c.items.forEach(i=>{if(i.category===old)i.category=name});if(c.activeCategory===old)c.activeCategory=name;await saveDb();renderCustomTabView(tab.id);
  }
  async function deleteCategory(tab,c,cat){
    const ok=await showAppConfirm({title:'Delete Category',message:`Delete “${cat}”? Items in it will remain but become uncategorized.`,confirmLabel:'Delete'});if(!ok)return;
    c.categories=c.categories.filter(x=>x!==cat);delete c.categorySettings[cat];c.items.forEach(i=>{if(i.category===cat)i.category=''});c.activeCategory='all';await saveDb();renderCustomTabView(tab.id);
  }
  async function addField(tab,c,cat){
    if(!cat){showFeatureToast?.('Add a category first.');return;}
    const r=await showAppFormModal({title:'Add Field',submitLabel:'Add Field',fields:[
      {name:'name',label:'Field Name',value:'',placeholder:'e.g. Meaning, Pronunciation, Example'},
      {name:'kind',label:'Field Type',type:'select',value:'text',options:[{value:'text',label:'Text'},{value:'textarea',label:'Long Text'},{value:'pronunciation',label:'Pronunciation / Phonetic Spelling'},{value:'url',label:'Link / URL'}]}
    ]});
    const name=String(r?.name||'').trim();if(!name)return;
    c.categorySettings[cat] ||= {fields:[]};c.categorySettings[cat].fields.push({id:uid('field'),name,kind:r.kind||'text'});await saveDb();renderCustomTabView(tab.id);
  }
  async function editField(tab,c,cat,f){
    const r=await showAppFormModal({title:'Edit Field',submitLabel:'Save',fields:[{name:'name',label:'Field Name',value:f.name},{name:'kind',label:'Field Type',type:'select',value:f.kind||'text',options:[{value:'text',label:'Text'},{value:'textarea',label:'Long Text'},{value:'pronunciation',label:'Pronunciation / Phonetic Spelling'},{value:'url',label:'Link / URL'}]}]});
    if(!r)return;const old=f.name;f.name=String(r.name||old).trim()||old;f.kind=r.kind||'text';if(f.name!==old)c.items.forEach(i=>{if(Object.prototype.hasOwnProperty.call(i.values,old)){i.values[f.name]=i.values[old];delete i.values[old]}});await saveDb();renderCustomTabView(tab.id);
  }
  async function deleteField(tab,c,cat,f){const ok=await showAppConfirm({title:'Delete Field',message:`Delete “${f.name}” from ${cat}?`,confirmLabel:'Delete'});if(!ok)return;c.categorySettings[cat].fields=c.categorySettings[cat].fields.filter(x=>x.id!==f.id);c.items.forEach(i=>delete i.values?.[f.name]);await saveDb();renderCustomTabView(tab.id);}

  async function editItem(tab,c,item=null){
    normalize(c); if(!c.categories.length){await addCategory(tab,c);return;}
    const cur=item||{id:uid('kb-item'),title:'',category:c.activeCategory!=='all'?c.activeCategory:c.categories[0],values:{},tags:[]};
    const category=cur.category&&c.categories.includes(cur.category)?cur.category:c.categories[0];
    const defs=fieldsFor(c,category);
    const form=[{name:'title',label:'Item Name',value:cur.title||''},{name:'category',label:'Category',type:'select',value:category,options:c.categories.map(x=>({value:x,label:x}))}];
    defs.forEach((f,i)=>form.push({name:`f_${i}`,label:f.name,value:String(cur.values?.[f.name]||''),type:f.kind==='textarea'?'textarea':'text',placeholder:f.kind==='pronunciation'?'Phonetic spelling / pronunciation…':f.name+'…'}));
    form.push({name:'tags',label:'Tags',value:(cur.tags||[]).join(', '),placeholder:'Optional, comma separated'});
    const r=await showAppFormModal({title:item?'Edit Knowledge Base Item':'Add Knowledge Base Item',submitLabel:item?'Save':'Add Item',fields:form});if(!r||!String(r.title||'').trim())return;
    const chosen=String(r.category||category);cur.title=String(r.title).trim();cur.category=chosen;cur.values=cur.values||{};
    // If the category changed, capture values from whichever schema is visible now, then let a second edit expose the destination schema.
    defs.forEach((f,i)=>cur.values[f.name]=String(r[`f_${i}`]||''));cur.tags=String(r.tags||'').split(',').map(x=>x.trim()).filter(Boolean);
    if(!item)c.items.push(cur);await saveDb();renderCustomTabView(tab.id);
  }

  function openSettings(tab,c){
    normalize(c);
    let overlay=document.getElementById('custom-kb-settings-v461');overlay?.remove();
    overlay=document.createElement('div');overlay.id='custom-kb-settings-v461';overlay.className='modal-overlay';
    overlay.innerHTML=`<div class="modal-box custom-kb-settings-box-v461"><div class="modal-header"><h2>Knowledge Base Settings</h2><button class="small-icon-btn" data-close><i class="ph ph-x"></i></button></div><div class="custom-kb-settings-body-v461"></div></div>`;
    document.body.appendChild(overlay);
    const body=overlay.querySelector('.custom-kb-settings-body-v461');
    const draw=()=>{
      normalize(c);const active=(c._settingsCategoryV461&&c.categories.includes(c._settingsCategoryV461))?c._settingsCategoryV461:c.categories[0]||'';c._settingsCategoryV461=active;
      body.innerHTML=`
        <div class="modal-section"><span class="field-label">Section Title</span><input class="custom-kb-title-v461" value="${esc(c.title)}"></div>
        <div class="kb-category-config-panel custom-kb-config-v461">
          <div class="section-header"><h3>Categories</h3><button class="small-icon-btn" data-add-cat title="Add Category"><i class="ph ph-plus"></i></button></div>
          <div class="filter-tabs custom-kb-settings-tabs-v461">${c.categories.map(cat=>`<button class="filter-tab ${cat===active?'active':''}" data-cat="${esc(cat)}">${esc(cat)}</button>`).join('')||'<span class="custom-kb-empty-note-v461">No categories yet.</span>'}</div>
          ${active?`<div class="custom-kb-cat-actions-v461"><button class="btn-secondary" data-rename>Rename Category</button><button class="btn-secondary danger" data-delete-cat>Delete Category</button></div><div class="section-header custom-kb-fields-head-v461"><h3>Fields</h3><button class="small-icon-btn" data-add-field title="Add Field"><i class="ph ph-plus"></i></button></div><div class="kb-field-card-grid custom-kb-fields-v461">${fieldsFor(c,active).map(f=>`<article class="kb-field-summary-card" data-field="${f.id}"><div><strong>${esc(f.name)}</strong><small>${esc(f.kind==='pronunciation'?'Pronunciation / Phonetic Spelling':f.kind==='textarea'?'Long Text':f.kind==='url'?'Link / URL':'Text')}</small></div><div><button class="small-icon-btn" data-edit-field="${f.id}"><i class="ph ph-pencil-simple"></i></button><button class="small-icon-btn" data-delete-field="${f.id}"><i class="ph ph-trash"></i></button></div></article>`).join('')||'<div class="custom-kb-empty-note-v461">No fields in this category yet.</div>'}</div>`:''}
        </div>`;
      body.querySelector('.custom-kb-title-v461').onchange=async e=>{c.title=e.target.value.trim()||'Knowledge Base';await saveDb();};
      body.querySelector('[data-add-cat]')?.addEventListener('click',async()=>{await addCategory(tab,c);draw()});
      body.querySelectorAll('[data-cat]').forEach(b=>b.onclick=()=>{c._settingsCategoryV461=b.dataset.cat;draw()});
      body.querySelector('[data-rename]')?.addEventListener('click',async()=>{await renameCategory(tab,c,active);draw()});
      body.querySelector('[data-delete-cat]')?.addEventListener('click',async()=>{await deleteCategory(tab,c,active);draw()});
      body.querySelector('[data-add-field]')?.addEventListener('click',async()=>{await addField(tab,c,active);draw()});
      body.querySelectorAll('[data-edit-field]').forEach(b=>b.onclick=async()=>{const f=fieldsFor(c,active).find(x=>x.id===b.dataset.editField);if(f){await editField(tab,c,active,f);draw()}});
      body.querySelectorAll('[data-delete-field]').forEach(b=>b.onclick=async()=>{const f=fieldsFor(c,active).find(x=>x.id===b.dataset.deleteField);if(f){await deleteField(tab,c,active,f);draw()}});
    };
    overlay.querySelector('[data-close]').onclick=()=>{overlay.remove();renderCustomTabView(tab.id)};overlay.addEventListener('click',e=>{if(e.target===overlay){overlay.remove();renderCustomTabView(tab.id)}});draw();
  }

  function render(tab,c,content){
    normalize(c);const active=c.activeCategory||'all';const items=c.items.filter(i=>active==='all'||i.category===active);
    content.innerHTML=`<div class="custom-kb-parity-v461">
      <div class="log-header-container custom-kb-header-v461"><h1>${esc(c.title||'Knowledge Base')}</h1><div class="custom-kb-header-actions-v461"><button class="icon-btn custom-kb-settings-btn-v461" title="Knowledge Base Settings"><i class="ph ph-sliders-horizontal"></i></button><button class="icon-btn custom-kb-add-btn-v461" title="Add New Item"><i class="ph ph-plus"></i></button></div></div>
      <div class="filter-tabs custom-kb-tabs-v461"><button class="filter-tab ${active==='all'?'active':''}" data-filter="all">All</button>${c.categories.map(cat=>`<button class="filter-tab ${active===cat?'active':''}" data-filter="${esc(cat)}">${esc(cat)}</button>`).join('')}</div>
      <div class="phrases-grid custom-kb-grid-v461">${items.map(i=>{const defs=fieldsFor(c,i.category);const search=[i.title,i.category,(i.tags||[]).join(' '),...defs.map(f=>i.values?.[f.name]||'')].join(' ').toLowerCase();return `<article class="phrase-card custom-searchable-item custom-content-editable custom-kb-card-v461" data-id="${esc(i.id)}" data-search-text="${esc(search)}"><span class="chip-text"><strong>${esc(i.title)}</strong>${i.category?`<small class="custom-kb-card-category-v461">${esc(i.category)}</small>`:''}</span></article>`}).join('')||'<div class="custom-feature-empty-v162 custom-kb-empty-v461">No items here yet. Use + to add one.</div>'}</div>
    </div>`;
    content.querySelector('.custom-kb-settings-btn-v461').onclick=()=>openSettings(tab,c);content.querySelector('.custom-kb-add-btn-v461').onclick=()=>editItem(tab,c);
    content.querySelectorAll('.custom-kb-tabs-v461 [data-filter]').forEach(b=>b.onclick=()=>{c.activeCategory=b.dataset.filter;saveDb();renderCustomTabView(tab.id)});
    content.querySelectorAll('.custom-kb-card-v461').forEach(card=>{const item=c.items.find(i=>i.id===card.dataset.id);card.onclick=()=>editItem(tab,c,item);card.oncontextmenu=e=>{e.preventDefault();showCustomItemContextMenu(e.clientX,e.clientY,[{label:'Edit item',icon:'ph-pencil-simple',action:()=>editItem(tab,c,item)},{label:'Delete item',icon:'ph-trash',danger:true,action:async()=>{const ok=await showAppConfirm({title:'Delete Knowledge Base Item',message:`Delete “${item.title}”?`,confirmLabel:'Delete'});if(ok){c.items=c.items.filter(x=>x.id!==item.id);await saveDb();renderCustomTabView(tab.id)}}}])}});
  }

  // Final renderer/settings override.
  try{const prev=renderCustomComponentContent;renderCustomComponentContent=function(tab,c,content){if(c?.type===TYPE)return render(tab,normalize(c),content);return prev.apply(this,arguments)}}catch{}
  try{const prev=editCustomComponent;editCustomComponent=async function(tabId,componentId){const tab=getCustomTab(tabId),c=tab?.components?.find(x=>x.id===componentId);if(c?.type===TYPE){openSettings(tab,normalize(c));return;}return prev.apply(this,arguments)}}catch{}

  // New Custom KBs must be inserted alone. Do not auto-create Search Bar.
  try{const prev=addCustomComponent;addCustomComponent=function(tabId,type,index=null){if(type!==TYPE)return prev.apply(this,arguments);const tab=getCustomTab(tabId);if(!tab)return;tab.components ||= [];const kb=defaultCustomComponent(TYPE);normalize(kb);const at=index===null||index<0||index>tab.components.length?tab.components.length:index;tab.components.splice(at,0,kb);saveDb();renderCustomTabView(tabId)}}catch{}

  // Remove only the old automatically-created search bars (distinct placeholder)
  // directly before a Custom KB. User-created normal search bars are preserved.
  function removeLegacyAutoSearch(){let changed=false;try{(db?.settings?.customTabs||[]).forEach(tab=>{for(let i=(tab.components||[]).length-1;i>=1;i--){const c=tab.components[i],p=tab.components[i-1];if(c?.type===TYPE&&p?.type==='search'&&String(p.placeholder||'')==='Search Custom KB...'){tab.components.splice(i-1,1);changed=true;i--;}}});if(changed)saveDb();}catch{}return changed;}
  removeLegacyAutoSearch();
  document.addEventListener('DOMContentLoaded',()=>{if(removeLegacyAutoSearch())try{renderAllCustomTabViews?.()}catch{}},{once:true});
})();

// ============================================================================
// V463 — FULL CUSTOM KB PARITY
// Custom-tab KB mirrors the real KB's standalone feature set while remaining
// entirely isolated from Daily Logs, Quizzes, recommendations and real KB data.
// ============================================================================
(() => {
  'use strict';
  if (window.__loggyCustomKbFullParityV463) return;
  window.__loggyCustomKbFullParityV463 = true;

  const TYPE = 'customKnowledgeBaseV453';
  const FIELD_KINDS = [
    ['text','Plain text','ph-text-t'], ['video','YouTube or MP4','ph-video-camera'],
    ['image','Image','ph-image'], ['svg','SVG code','ph-code'],
    ['select','Dropdown / custom options','ph-list-bullets'], ['rating','Star rating','ph-star'],
    ['pinnedImage','Pinned image / map','ph-map-pin'], ['latex','LaTeX','ph-function'],
    ['attachment','Attachment','ph-paperclip'], ['numberFormat','Formatted number','ph-hash'],
    ['dateTime','Date / time','ph-calendar'], ['boolean','On / off','ph-toggle-right']
  ];
  const esc = v => String(v ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const attr = esc;
  const uid = p => `${p}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,8)}`;
  const normPlaceholder = v => String(v||'').trim().replace(/^\\+/,'').toLowerCase().replace(/\s+/g,'-').replace(/[^a-z0-9_\-\u00C0-\u024F\u1100-\u11FF\u3130-\u318F\uAC00-\uD7AF]/gi,'');

  function normalize(c){
    if(!c) return c;
    c.type = TYPE;
    c.title = String(c.title || 'Knowledge Base');
    if (c.title === 'Custom KB') c.title = 'Knowledge Base';
    c.categories = Array.isArray(c.categories) ? [...new Set(c.categories.map(String).filter(Boolean))] : [];
    c.categorySettings = c.categorySettings && typeof c.categorySettings === 'object' ? c.categorySettings : {};
    c.placeholdersEnabledV463 = c.placeholdersEnabledV463 !== false;
    c.placeholdersV463 = Array.isArray(c.placeholdersV463) ? [...new Set(c.placeholdersV463.map(normPlaceholder).filter(Boolean))] : ['noun','verb','adjective'];
    c.items = Array.isArray(c.items) ? c.items : [];
    c.categories.forEach(cat => {
      const cfg = c.categorySettings[cat] && typeof c.categorySettings[cat] === 'object' ? c.categorySettings[cat] : {};
      cfg.fields = Array.isArray(cfg.fields) ? cfg.fields.map((f,i) => {
        if(typeof f === 'string') f = {name:f};
        const kind = FIELD_KINDS.some(x=>x[0]===f?.kind) ? f.kind : (f?.kind==='textarea'?'text':f?.kind==='pronunciation'?'text':'text');
        return {
          ...(f||{}), id:f?.id||uid('kb-field'), name:String(f?.name||`Field ${i+1}`), kind,
          pronunciation: !!(f?.pronunciation || f?.kind==='pronunciation'), ttsLang:String(f?.ttsLang||'en'),
          options:Array.isArray(f?.options)?f.options.map(String):[], maxRating:Math.max(1,Math.min(10,Number(f?.maxRating)||5)),
          defaultPinColor:String(f?.defaultPinColor||'#e53935'), numberStyle:['number','currency','percent'].includes(f?.numberStyle)?f.numberStyle:'number',
          decimals:Math.max(0,Math.min(8,Number(f?.decimals??2))), currencySymbol:String(f?.currencySymbol||'$').slice(0,6),
          dateMode:f?.dateMode==='range'?'range':'single'
        };
      }) : [];
      c.categorySettings[cat] = cfg;
    });
    c.items.forEach(item => {
      item.id ||= uid('kb-item'); item.title = String(item.title||'Untitled Item');
      item.category = String(item.category||c.categories[0]||''); item.values = item.values&&typeof item.values==='object'?item.values:{};
      item.tags = Array.isArray(item.tags)?item.tags:[];
    });
    if(c.activeCategory !== 'all' && !c.categories.includes(c.activeCategory)) c.activeCategory = 'all';
    c.activeCategory ||= 'all';
    return c;
  }
  const fieldsFor = (c,cat) => normalize(c).categorySettings?.[cat]?.fields || [];
  const kindLabel = kind => FIELD_KINDS.find(x=>x[0]===kind)?.[1] || 'Plain text';

  function patternHtml(c,text){
    const source=String(text||'');
    if(!c.placeholdersEnabledV463) return esc(source);
    return source.replace(/\\([a-z0-9_\-\u00C0-\u024F\u1100-\u11FF\u3130-\u318F\uAC00-\uD7AF]+)/gi,(m,n)=>c.placeholdersV463.includes(normPlaceholder(n))?`<strong class="kb-placeholder-token-v56">${esc(m)}</strong>`:esc(m));
  }

  function speak(text,lang='en'){
    try{
      speechSynthesis.cancel(); const u=new SpeechSynthesisUtterance(String(text||'')); u.lang=lang||'en'; speechSynthesis.speak(u);
    }catch{}
  }

  function openFieldModal(tab,c,category,field=null,onDone=()=>{}){
    normalize(c); const current = field ? {...field, options:[...(field.options||[])]} : {id:'',name:'',kind:'text',pronunciation:false,ttsLang:'en',options:[],maxRating:5,defaultPinColor:'#e53935',numberStyle:'number',decimals:2,currencySymbol:'$',dateMode:'single'};
    document.getElementById('custom-kb-field-modal-v463')?.remove();
    const overlay=document.createElement('div'); overlay.id='custom-kb-field-modal-v463'; overlay.className='modal-overlay';
    overlay.innerHTML=`<div class="modal-box kb-field-create-modal-box kb-field-safe-box-v221 custom-kb-field-box-v463">
      <div class="modal-header"><h2>${field?'Edit Field':'Add Field'}</h2><button class="small-icon-btn" data-close><i class="ph ph-x"></i></button></div>
      <div class="modal-section"><span class="field-label">Field Name</span><input class="ckb-field-name-v463" maxlength="48" value="${attr(current.name)}" placeholder="e.g. Meaning, Tutorial, Reference Image"></div>
      <div class="modal-section"><span class="field-label">Field Type</span><div class="kb-field-modal-icons ckb-kinds-v463">${FIELD_KINDS.map(([k,label,icon])=>`<button type="button" class="kb-clean-icon-option ${current.kind===k?'selected':''}" data-kind="${k}" data-tip="${attr(label)}" title="${attr(label)}"><i class="ph ${icon}"></i></button>`).join('')}</div></div>
      <div class="modal-section"><span class="field-label">Options</span><div class="kb-field-modal-icons"><button type="button" class="kb-clean-icon-option ckb-pron-v463 ${current.pronunciation?'selected':''}" title="Enable pronunciation"><i class="ph ph-speaker-high"></i></button></div></div>
      <div class="modal-section ckb-lang-v463 ${current.pronunciation?'':'hidden'}"><span class="field-label">Pronunciation Language Code</span><input class="ckb-lang-input-v463" value="${attr(current.ttsLang||'en')}" placeholder="en, ko, es, ja…"></div>
      <div class="modal-section ckb-select-v463 ${current.kind==='select'?'':'hidden'}"><span class="field-label">Dropdown Options</span><textarea class="ckb-options-v463" rows="4" placeholder="One option per line">${esc((current.options||[]).join('\n'))}</textarea></div>
      <div class="modal-section ckb-rating-v463 ${current.kind==='rating'?'':'hidden'}"><span class="field-label">Maximum Rating</span><input type="number" class="ckb-rating-input-v463" min="1" max="10" value="${current.maxRating||5}"></div>
      <div class="modal-section ckb-pin-v463 ${current.kind==='pinnedImage'?'':'hidden'}"><span class="field-label">Default Pin Color</span><input type="color" class="ckb-pin-input-v463" value="${attr(current.defaultPinColor||'#e53935')}"></div>
      <div class="modal-section ckb-number-v463 ${current.kind==='numberFormat'?'':'hidden'}"><span class="field-label">Number Format</span><div class="custom-kb-inline-v463"><select class="ckb-number-style-v463"><option value="number">Number</option><option value="currency">Currency</option><option value="percent">Percent</option></select><input type="number" class="ckb-decimals-v463" min="0" max="8" value="${current.decimals??2}" title="Decimals"><input class="ckb-currency-v463" maxlength="6" value="${attr(current.currencySymbol||'$')}" title="Currency symbol"></div></div>
      <div class="modal-section ckb-date-v463 ${current.kind==='dateTime'?'':'hidden'}"><span class="field-label">Date Mode</span><select class="ckb-date-mode-v463"><option value="single">Single date/time</option><option value="range">Date/time range</option></select></div>
      <button class="icon-btn kb-modal-primary ckb-field-save-v463">${field?'Done':'Add Field'}</button>
    </div>`;
    document.body.appendChild(overlay);
    overlay.querySelector('.ckb-number-style-v463').value=current.numberStyle||'number'; overlay.querySelector('.ckb-date-mode-v463').value=current.dateMode||'single';
    const sync=()=>{
      overlay.querySelectorAll('[data-kind]').forEach(b=>b.classList.toggle('selected',b.dataset.kind===current.kind));
      overlay.querySelector('.ckb-lang-v463').classList.toggle('hidden',!current.pronunciation);
      overlay.querySelector('.ckb-select-v463').classList.toggle('hidden',current.kind!=='select'); overlay.querySelector('.ckb-rating-v463').classList.toggle('hidden',current.kind!=='rating');
      overlay.querySelector('.ckb-pin-v463').classList.toggle('hidden',current.kind!=='pinnedImage'); overlay.querySelector('.ckb-number-v463').classList.toggle('hidden',current.kind!=='numberFormat'); overlay.querySelector('.ckb-date-v463').classList.toggle('hidden',current.kind!=='dateTime');
    };
    overlay.querySelectorAll('[data-kind]').forEach(b=>b.onclick=()=>{current.kind=b.dataset.kind;sync()});
    overlay.querySelector('.ckb-pron-v463').onclick=e=>{current.pronunciation=!current.pronunciation;e.currentTarget.classList.toggle('selected',current.pronunciation);sync()};
    const close=()=>overlay.remove(); overlay.querySelector('[data-close]').onclick=close; overlay.onclick=e=>{if(e.target===overlay)close()};
    overlay.querySelector('.ckb-field-save-v463').onclick=async()=>{
      const name=String(overlay.querySelector('.ckb-field-name-v463').value||'').trim(); if(!name){overlay.querySelector('.ckb-field-name-v463').focus();return;}
      const cfg=c.categorySettings[category]||(c.categorySettings[category]={fields:[]}); const duplicate=cfg.fields.some(f=>f!==field&&f.name.toLowerCase()===name.toLowerCase()); if(duplicate){showFeatureToast?.('That field already exists in this category.');return;}
      const oldName=field?.name||'';
      Object.assign(current,{id:field?.id||uid('kb-field'),name,ttsLang:String(overlay.querySelector('.ckb-lang-input-v463').value||'en').trim()||'en',options:String(overlay.querySelector('.ckb-options-v463').value||'').split(/\n|,/).map(x=>x.trim()).filter(Boolean),maxRating:Math.max(1,Math.min(10,Number(overlay.querySelector('.ckb-rating-input-v463').value)||5)),defaultPinColor:overlay.querySelector('.ckb-pin-input-v463').value||'#e53935',numberStyle:overlay.querySelector('.ckb-number-style-v463').value,decimals:Math.max(0,Math.min(8,Number(overlay.querySelector('.ckb-decimals-v463').value)||0)),currencySymbol:String(overlay.querySelector('.ckb-currency-v463').value||'$').slice(0,6),dateMode:overlay.querySelector('.ckb-date-mode-v463').value});
      if(field) Object.assign(field,current); else cfg.fields.push(current);
      if(field&&oldName&&oldName!==name)c.items.forEach(i=>{if(Object.prototype.hasOwnProperty.call(i.values||{},oldName)){i.values[name]=i.values[oldName];delete i.values[oldName]}});
      await saveDb(); close(); onDone();
    };
    requestAnimationFrame(()=>overlay.querySelector('.ckb-field-name-v463')?.focus());
  }

  function fieldInputHtml(f,value=''){
    const v=String(value??'');
    if(f.kind==='select') return `<select data-field-id="${attr(f.id)}"><option value="">Choose…</option>${(f.options||[]).map(o=>`<option value="${attr(o)}" ${o===v?'selected':''}>${esc(o)}</option>`).join('')}</select>`;
    if(f.kind==='rating') return `<input data-field-id="${attr(f.id)}" type="number" min="0" max="${f.maxRating||5}" value="${attr(v)}">`;
    if(f.kind==='boolean') return `<label class="kb-switch-v173"><input data-field-id="${attr(f.id)}" type="checkbox" ${v==='true'||v===true?'checked':''}><span class="kb-switch-track-v173"></span></label>`;
    if(f.kind==='dateTime') return `<input data-field-id="${attr(f.id)}" type="datetime-local" value="${attr(v)}">`;
    if(f.kind==='numberFormat') return `<input data-field-id="${attr(f.id)}" type="number" step="any" value="${attr(v)}">`;
    if(['svg','latex'].includes(f.kind)) return `<textarea data-field-id="${attr(f.id)}" rows="4">${esc(v)}</textarea>`;
    if(['video','image','pinnedImage','attachment'].includes(f.kind)) return `<input data-field-id="${attr(f.id)}" value="${attr(v)}" placeholder="${f.kind==='video'?'Video URL':f.kind==='attachment'?'File/attachment URL':'Image URL or data URL'}">`;
    return `<input data-field-id="${attr(f.id)}" value="${attr(v)}">`;
  }

  function openItemEditor(tab,c,item=null){
    normalize(c); if(!c.categories.length){showFeatureToast?.('Add a category in Knowledge Base Settings first.');return;}
    const draft=item?item:{id:uid('kb-item'),title:'',category:c.activeCategory!=='all'&&c.categories.includes(c.activeCategory)?c.activeCategory:c.categories[0],values:{},tags:[]};
    document.getElementById('custom-kb-item-modal-v463')?.remove(); const overlay=document.createElement('div'); overlay.id='custom-kb-item-modal-v463'; overlay.className='modal-overlay';
    const draw=()=>{const category=c.categories.includes(draft.category)?draft.category:c.categories[0];draft.category=category;const fields=fieldsFor(c,category);
      overlay.innerHTML=`<div class="modal-box custom-kb-item-box-v463"><div class="modal-header"><h2>${item?'Edit Knowledge Base Item':'Add Knowledge Base Item'}</h2><button class="small-icon-btn" data-close><i class="ph ph-x"></i></button></div>
      <div class="modal-section"><span class="field-label">Item Name</span><input class="ckb-item-title-v463" value="${attr(draft.title)}" placeholder="Item name or pattern such as I am a \\noun"><div class="ckb-placeholder-shortcuts-v463">${c.placeholdersEnabledV463?c.placeholdersV463.map(p=>`<button type="button" class="kb-placeholder-chip-v56" data-insert-placeholder="${attr(p)}">\\${esc(p)}</button>`).join(''):''}</div></div>
      <div class="modal-section"><span class="field-label">Category</span><select class="ckb-item-category-v463">${c.categories.map(cat=>`<option value="${attr(cat)}" ${cat===category?'selected':''}>${esc(cat)}</option>`).join('')}</select></div>
      <div class="ckb-item-fields-v463">${fields.map(f=>`<div class="modal-section kb-item-field"><div class="kb-item-field-label-row"><span class="field-label">${esc(f.name)}</span>${f.pronunciation?`<button type="button" class="small-icon-btn" data-speak-field="${attr(f.id)}" title="Pronounce"><i class="ph ph-speaker-high"></i></button>`:''}</div>${fieldInputHtml(f,draft.values?.[f.name]??'')}</div>`).join('')||'<div class="custom-kb-empty-note-v461">This category has no fields yet. Add fields in Knowledge Base Settings.</div>'}</div>
      <div class="modal-section"><span class="field-label">Tags</span><input class="ckb-item-tags-v463" value="${attr((draft.tags||[]).join(', '))}" placeholder="Optional, comma separated"></div>
      <button class="icon-btn kb-modal-primary ckb-item-save-v463">${item?'Save':'Add Item'}</button></div>`;
      const title=overlay.querySelector('.ckb-item-title-v463'); overlay.querySelectorAll('[data-insert-placeholder]').forEach(b=>b.onclick=()=>{const token='\\'+b.dataset.insertPlaceholder;const s=title.selectionStart??title.value.length,e=title.selectionEnd??s;title.setRangeText(token,s,e,'end');title.focus()});
      overlay.querySelector('.ckb-item-category-v463').onchange=e=>{capture();draft.category=e.target.value;draw()};
      overlay.querySelectorAll('[data-speak-field]').forEach(b=>b.onclick=()=>{const f=fields.find(x=>x.id===b.dataset.speakField);const el=overlay.querySelector(`[data-field-id="${CSS.escape(f.id)}"]`);const val=el?.type==='checkbox'?String(el.checked):el?.value;speak(val,f.ttsLang)});
      overlay.querySelector('[data-close]').onclick=()=>overlay.remove(); overlay.querySelector('.ckb-item-save-v463').onclick=async()=>{capture();if(!draft.title.trim()){title.focus();return;}if(!item)c.items.push(draft);await saveDb();overlay.remove();renderCustomTabView(tab.id)};
      function capture(){draft.title=String(overlay.querySelector('.ckb-item-title-v463')?.value||draft.title);draft.tags=String(overlay.querySelector('.ckb-item-tags-v463')?.value||'').split(',').map(x=>x.trim()).filter(Boolean);fields.forEach(f=>{const el=overlay.querySelector(`[data-field-id="${CSS.escape(f.id)}"]`);if(!el)return;draft.values[f.name]=el.type==='checkbox'?String(el.checked):el.value})}
    };
    document.body.appendChild(overlay); overlay.addEventListener('click',e=>{if(e.target===overlay)overlay.remove()});draw();requestAnimationFrame(()=>overlay.querySelector('.ckb-item-title-v463')?.focus());
  }

  function openSettings(tab,c){
    normalize(c); document.getElementById('custom-kb-settings-v463')?.remove(); const overlay=document.createElement('div');overlay.id='custom-kb-settings-v463';overlay.className='modal-overlay';
    overlay.innerHTML=`<div class="modal-box custom-kb-settings-box-v461 custom-kb-settings-box-v463"><div class="modal-header"><h2>Knowledge Base Settings</h2><button class="small-icon-btn" data-close><i class="ph ph-x"></i></button></div><div class="custom-kb-settings-body-v461"></div></div>`;document.body.appendChild(overlay); const body=overlay.querySelector('.custom-kb-settings-body-v461');
    const draw=()=>{normalize(c);const active=c.categories.includes(c._settingsCategoryV463)?c._settingsCategoryV463:c.categories[0]||'';c._settingsCategoryV463=active;const fields=active?fieldsFor(c,active):[];
      body.innerHTML=`<div class="modal-section"><span class="field-label">Knowledge Base Title</span><input class="ckb-title-v463" value="${attr(c.title)}"></div>
      <section class="modal-section kb-placeholder-settings-v56 ckb-placeholders-v463 ${c.placeholdersEnabledV463?'':'disabled-v56'}"><div class="kb-placeholder-settings-heading-v56 kb-placeholder-heading-row-v451"><div class="kb-daily-recommend-copy-v173 kb-placeholder-copy-v451"><span class="field-label">Placeholders</span><small>Type \\ in item titles to build reusable patterns inside this Knowledge Base.</small></div><label class="kb-switch-v173"><input type="checkbox" class="ckb-placeholder-toggle-v463" ${c.placeholdersEnabledV463?'checked':''}><span class="kb-switch-track-v173"></span></label></div><div class="kb-placeholder-chips-v56 ${c.placeholdersEnabledV463?'':'hidden'}">${c.placeholdersV463.map(p=>`<span class="kb-placeholder-chip-v56"><strong>\\${esc(p)}</strong><button data-remove-placeholder="${attr(p)}"><i class="ph ph-x"></i></button></span>`).join('')||'<span class="kb-placeholder-empty-v56">Add the placeholder names you want to reuse.</span>'}</div><div class="kb-placeholder-add-v56 ${c.placeholdersEnabledV463?'':'hidden'}"><input class="ckb-placeholder-new-v463" placeholder="e.g. noun"><button class="icon-btn ckb-placeholder-add-v463">Add Placeholder</button></div></section>
      <div class="modal-section"><div class="section-header"><h3>Categories</h3><button class="small-icon-btn" data-add-category><i class="ph ph-plus"></i></button></div><div class="filter-tabs custom-kb-settings-tabs-v461">${c.categories.map(cat=>`<button class="filter-tab ${cat===active?'active':''}" data-category="${attr(cat)}">${esc(cat)}</button>`).join('')||'<span class="custom-kb-empty-note-v461">No categories yet.</span>'}</div></div>
      ${active?`<div class="modal-section"><div class="section-header"><h3>Edit Fields</h3><button class="small-icon-btn" data-add-field><i class="ph ph-plus"></i></button></div><div class="kb-field-card-grid custom-kb-fields-v461">${fields.map(f=>`<article class="kb-field-summary-card" data-field-id="${attr(f.id)}"><div><strong>${esc(f.name)}</strong><small>${esc(kindLabel(f.kind))}${f.pronunciation?' · Pronunciation enabled':''}</small></div><div><button class="small-icon-btn" data-edit-field="${attr(f.id)}"><i class="ph ph-pencil-simple"></i></button><button class="small-icon-btn" data-delete-field="${attr(f.id)}"><i class="ph ph-trash"></i></button></div></article>`).join('')||'<div class="custom-kb-empty-note-v461">No fields yet. Press + to add one.</div>'}</div></div>`:''}`;
      body.querySelector('.ckb-title-v463').onchange=async e=>{c.title=e.target.value.trim()||'Knowledge Base';await saveDb()};
      const syncPlaceholderVisibility=()=>body.querySelector('.kb-placeholder-add-v56')?.classList.toggle('hidden',!c.placeholdersEnabledV463);
      body.querySelector('.ckb-placeholder-toggle-v463').onchange=async e=>{c.placeholdersEnabledV463=e.target.checked;await saveDb();draw()};
      body.querySelector('.ckb-placeholder-add-v463')?.addEventListener('click',async()=>{const input=body.querySelector('.ckb-placeholder-new-v463');const p=normPlaceholder(input.value);if(p&&!c.placeholdersV463.includes(p)){c.placeholdersV463.push(p);await saveDb();draw()}});
      body.querySelectorAll('[data-remove-placeholder]').forEach(b=>b.onclick=async()=>{c.placeholdersV463=c.placeholdersV463.filter(x=>x!==b.dataset.removePlaceholder);await saveDb();draw()});
      body.querySelector('[data-add-category]')?.addEventListener('click',async()=>{const v=await showAppPrompt({title:'Add Category',label:'Category Name',submitLabel:'Add Category'});const n=String(v||'').trim();if(n&&!c.categories.includes(n)){c.categories.push(n);c.categorySettings[n]={fields:[]};c._settingsCategoryV463=n;await saveDb();draw()}});
      body.querySelectorAll('[data-category]').forEach(b=>{
        b.onclick=()=>{c._settingsCategoryV463=b.dataset.category;draw()};
        b.oncontextmenu=e=>{
          e.preventDefault();
          const category=b.dataset.category;
          showCustomItemContextMenu(e.clientX,e.clientY,[
            {label:'Rename category',icon:'ph-pencil-simple',action:async()=>{
              const v=await showAppPrompt({title:'Rename Category',label:'Category Name',value:category,submitLabel:'Save'});
              const n=String(v||'').trim(); if(!n||n===category||c.categories.includes(n))return;
              c.categories=c.categories.map(x=>x===category?n:x); c.categorySettings[n]=c.categorySettings[category]; delete c.categorySettings[category];
              c.items.forEach(i=>{if(i.category===category)i.category=n}); c._settingsCategoryV463=n; await saveDb(); draw();
            }},
            {label:'Delete category',icon:'ph-trash',danger:true,action:async()=>{
              const ok=await showAppConfirm({title:'Delete Category',message:`Delete “${category}”?`,confirmLabel:'Delete'}); if(!ok)return;
              c.categories=c.categories.filter(x=>x!==category); delete c.categorySettings[category]; c.items.forEach(i=>{if(i.category===category)i.category=''});
              c._settingsCategoryV463=c.categories[0]||''; await saveDb(); draw();
            }}
          ]);
        };
      });
      body.querySelector('[data-add-field]')?.addEventListener('click',()=>openFieldModal(tab,c,active,null,draw));
      body.querySelectorAll('[data-edit-field]').forEach(b=>b.onclick=()=>{const f=fields.find(x=>x.id===b.dataset.editField);if(f)openFieldModal(tab,c,active,f,draw)});
      body.querySelectorAll('[data-delete-field]').forEach(b=>b.onclick=async()=>{const f=fields.find(x=>x.id===b.dataset.deleteField);if(!f)return;const ok=await showAppConfirm({title:'Delete Field',message:`Delete “${f.name}”?`,confirmLabel:'Delete'});if(!ok)return;c.categorySettings[active].fields=c.categorySettings[active].fields.filter(x=>x.id!==f.id);c.items.forEach(i=>delete i.values?.[f.name]);await saveDb();draw()});
      syncPlaceholderVisibility();
    };
    overlay.querySelector('[data-close]').onclick=()=>{overlay.remove();renderCustomTabView(tab.id)}; overlay.onclick=e=>{if(e.target===overlay){overlay.remove();renderCustomTabView(tab.id)}};draw();
  }

  function render(tab,c,content){
    normalize(c);const active=c.activeCategory||'all';const items=c.items.filter(i=>active==='all'||i.category===active);
    content.innerHTML=`<div class="custom-kb-parity-v461 custom-kb-full-v463"><div class="log-header-container custom-kb-header-v461"><h1>${esc(c.title)}</h1><div class="custom-kb-header-actions-v461"><button class="icon-btn ckb-settings-v463" title="Knowledge Base Settings"><i class="ph ph-sliders-horizontal"></i></button><button class="icon-btn ckb-add-v463" title="Add New Item"><i class="ph ph-plus"></i></button></div></div><div class="filter-tabs custom-kb-tabs-v461"><button class="filter-tab ${active==='all'?'active':''}" data-filter="all">All</button>${c.categories.map(cat=>`<button class="filter-tab ${active===cat?'active':''}" data-filter="${attr(cat)}">${esc(cat)}</button>`).join('')}</div><div class="phrases-grid custom-kb-grid-v461">${items.map(item=>{const defs=fieldsFor(c,item.category);const search=[item.title,item.category,(item.tags||[]).join(' '),...defs.map(f=>item.values?.[f.name]||'')].join(' ').toLowerCase();return `<article class="phrase-card custom-searchable-item custom-content-editable custom-kb-card-v461" data-id="${attr(item.id)}" data-search-text="${attr(search)}"><span class="chip-text"><strong>${patternHtml(c,item.title)}</strong>${item.category?`<small class="custom-kb-card-category-v461">${esc(item.category)}</small>`:''}</span></article>`}).join('')||'<div class="custom-feature-empty-v162 custom-kb-empty-v461">No items here yet. Use + to add one.</div>'}</div></div>`;
    content.querySelector('.ckb-settings-v463').onclick=()=>openSettings(tab,c);content.querySelector('.ckb-add-v463').onclick=()=>openItemEditor(tab,c);
    content.querySelectorAll('[data-filter]').forEach(b=>b.onclick=()=>{c.activeCategory=b.dataset.filter;saveDb();renderCustomTabView(tab.id)});
    content.querySelectorAll('.custom-kb-card-v461').forEach(card=>{const item=c.items.find(i=>i.id===card.dataset.id);card.onclick=()=>openItemEditor(tab,c,item);card.oncontextmenu=e=>{e.preventDefault();showCustomItemContextMenu(e.clientX,e.clientY,[{label:'Edit item',icon:'ph-pencil-simple',action:()=>openItemEditor(tab,c,item)},{label:'Delete item',icon:'ph-trash',danger:true,action:async()=>{const ok=await showAppConfirm({title:'Delete Knowledge Base Item',message:`Delete “${item.title}”?`,confirmLabel:'Delete'});if(ok){c.items=c.items.filter(x=>x.id!==item.id);await saveDb();renderCustomTabView(tab.id)}}}])}});
  }

  try{const prev=renderCustomComponentContent;renderCustomComponentContent=function(tab,c,content){if(c?.type===TYPE)return render(tab,normalize(c),content);return prev.apply(this,arguments)}}catch{}
  try{const prev=editCustomComponent;editCustomComponent=async function(tabId,componentId){const tab=getCustomTab(tabId),c=tab?.components?.find(x=>x.id===componentId);if(c?.type===TYPE){openSettings(tab,normalize(c));return;}return prev.apply(this,arguments)}}catch{}
})();

// ============================================================================
// V480 — authoritative pinned-image quiz compatibility + special-tab input
// Maps respect Quizlet Learn MC/Written modes and never expose serialized JSON.
// Whiteboard/Notebook are repaired as true interactive top-level workspaces.
// ============================================================================
(() => {
  'use strict';
  if (window.__loggyPinnedQuizAndSpecialTabsV480) return;
  window.__loggyPinnedQuizAndSpecialTabsV480 = true;

  const esc = value => String(value ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const attr = esc;
  const norm = value => String(value ?? '').normalize('NFKC').trim().toLocaleLowerCase().replace(/\s+/g,' ');
  const mapSessions = new Map();

  function currentItemId() {
    try { return quizMode === 'learn' ? String(learnQueue?.[0]?.id || '') : String(activeQuizDeck?.[activeQuizIndex] || ''); }
    catch { return ''; }
  }
  function pinnedFor(itemId) {
    try { return window.__loggyPinnedImageV169?.fieldForItem?.(itemId) || null; } catch { return null; }
  }
  function labeledPins(pinned) {
    return (pinned?.data?.pins || []).filter(pin => String(pin?.label || '').trim());
  }
  function pinStage(data, {active='', revealed=new Set(), revealAll=false}={}) {
    const pins = (data?.pins || []).filter(pin => String(pin?.label || '').trim());
    return `<div class="map-study-stage-v172 map-study-stage-v480"><img src="${attr(data?.image || '')}" alt="Pinned study image"><div class="kb-pinned-overlay-v169">${pins.map((pin,index) => {
      const id=String(pin.id || index), label=String(pin.label || '').trim();
      const dir=['up','right','down','left'].includes(pin.direction)?pin.direction:'down';
      const scale=Math.max(.55,Math.min(2.2,Number(pin.size)||1));
      const showLabel=revealAll || revealed.has(id);
      return `<button type="button" class="kb-map-pin-v169 pin-dir-${dir} ${active===id?'map-study-active-v172':''}" data-map-pin-v480="${attr(id)}" style="left:${Number(pin.x)||0}%;top:${Number(pin.y)||0}%;--pin-color-v169:${attr(pin.color||data.pinColor||'#e53935')};--pin-scale-v171:${scale};"><span class="kb-map-pin-dot-v169"></span></button>${showLabel?`<span class="kb-map-pin-label-v169 quiz-map-label-v480" data-pin-label-for-v170="${attr(id)}" data-pin-x-v170="${Number(pin.x)||0}" data-pin-y-v170="${Number(pin.y)||0}" data-label-dx-v170="${Number(pin.labelDx)||0}" data-label-dy-v170="${Number(pin.labelDy)||0}" data-label-manual-v170="${pin.labelManual?'1':'0'}">${esc(label)}</span>`:''}`;
    }).join('')}</div></div>`;
  }
  function layoutLabels(root) { requestAnimationFrame(() => { try { window.__layoutPinnedLabelsV170?.(root); } catch {} }); }
  function setCounter() { try { document.getElementById('quiz-set-label').textContent=`${Math.min((activeQuizIndex||0)+1, activeQuizDeck?.length||0)} / ${activeQuizDeck?.length||0}`; } catch {} }

  function renderPinnedFlashcard(area,itemId,pinned) {
    setCounter();
    const meta=db.phrase_meta?.[itemId] || {custom_fields:{}};
    const content=quizCardFlipped ? renderCardBackContent(meta) : `<span style="font-size:2.8rem">${esc(itemId)}</span>`;
    area.innerHTML=`<div class="flashcard-mode-wrap pinned-standard-flashcard-v480"><div class="flashcard-mode-card pinned-flashcard-card-v480" id="quiz-flip-front-v480" style="padding:${quizCardFlipped?'0':'20px'}">${content}</div><div class="flashcard-nav-container"><button class="flashcard-nav-btn" data-prev-v480 ${activeQuizIndex===0?'disabled':''}><i class="ph ph-arrow-left"></i></button><button class="flashcard-nav-btn" data-next-v480><i class="ph ph-arrow-right"></i></button></div></div>`;
    area.querySelector('#quiz-flip-front-v480')?.addEventListener('click', e=>{
      if(e.target.closest('button,.card-dot,.card-slide-arrow,a,input,video,iframe,audio')) return;
      quizCardFlipped=!quizCardFlipped; currentSlideIndex=0; showQuizCard();
    });
    area.querySelector('[data-prev-v480]')?.addEventListener('click',()=>{if(activeQuizIndex>0){activeQuizIndex--;quizCardFlipped=false;currentSlideIndex=0;showQuizCard();}});
    area.querySelector('[data-next-v480]')?.addEventListener('click',()=>{activeQuizIndex++;quizCardFlipped=false;currentSlideIndex=0;showQuizCard();});
    try { attachAudioPlayButtons(area); } catch {}
    layoutLabels(area);
  }

  function renderPinnedAnki(area,itemId,pinned) {
    setCounter();
    const meta=db.phrase_meta?.[itemId] || {custom_fields:{}};
    if(!quizCardFlipped){
      area.innerHTML=`<div class="flashcard-wrap pinned-standard-flashcard-v480"><div class="flashcard-mode-card pinned-flashcard-card-v480" data-anki-flip-v480><span style="font-size:2.8rem">${esc(itemId)}</span></div></div>`;
      area.querySelector('[data-anki-flip-v480]')?.addEventListener('click',()=>{quizCardFlipped=true;currentSlideIndex=0;showQuizCard();});
    } else {
      area.innerHTML=`<div class="flashcard-wrap pinned-standard-flashcard-v480"><div class="flashcard-mode-card pinned-flashcard-card-v480" data-anki-back-flip-v669 style="padding:0">${renderCardBackContent(meta)}</div><div class="quiz-pinned-anki-actions-v169"><button class="icon-btn still-learning-btn" data-anki-again-v480><i class="ph ph-arrow-counter-clockwise"></i> Still Learning</button><button class="icon-btn got-it-btn" data-anki-good-v480><i class="ph ph-check"></i> Got It!</button></div></div>`;
      area.querySelector('[data-anki-back-flip-v669]')?.addEventListener('click',(e)=>{if(e.target.closest('button,input,textarea,select,a,video,audio,iframe,.card-dot,.card-slide-arrow,.audio-play-btn'))return;quizCardFlipped=false;currentSlideIndex=0;showQuizCard();});
      area.querySelector('[data-anki-again-v480]')?.addEventListener('click',()=>processAnkiAnswer('Again'));
      area.querySelector('[data-anki-good-v480]')?.addEventListener('click',()=>processAnkiAnswer('Good'));
    }
    try { attachAudioPlayButtons(area); } catch {}
    layoutLabels(area);
  }

  function getLearnSession(itemId,pinned) {
    const key=`learn:${itemId}:${pinned?.field?.id || pinned?.field?.name || 'map'}`;
    let state=mapSessions.get(key);
    if(!state){
      let type='mc';
      try { type=typeof chooseQuizletLearnQuestionTypeV476==='function'?chooseQuizletLearnQuestionTypeV476(db.phrase_meta?.[itemId]||{}):'mc'; } catch {}
      state={key,type,index:0,revealed:new Set(),hadWrong:false,waiting:false};
      mapSessions.set(key,state);
    }
    return state;
  }
  function finishMapLearn(state, correct) {
    mapSessions.delete(state.key);
    processLearnAnswer(correct);
  }
  function renderMapLearnMc(area,itemId,pinned,state) {
    setCounter();
    const pins=labeledPins(pinned);
    if(!pins.length) return finishMapLearn(state,true);
    state.index=Math.max(0,Math.min(state.index,pins.length-1));
    const active=pins[state.index];
    const activeId=String(active.id);
    const choices=[String(active.label).trim()];
    const distractors=pins.filter(p=>String(p.id)!==activeId).map(p=>String(p.label).trim()).filter(Boolean);
    while(choices.length<4 && distractors.length){ const i=Math.floor(Math.random()*distractors.length); const c=distractors.splice(i,1)[0]; if(!choices.includes(c)) choices.push(c); }
    choices.sort(()=>Math.random()-.5);
    area.innerHTML=`<div class="map-study-wrap-v172 map-learn-mc-v480"><div class="map-study-card-v172"><div class="map-study-prompt-v172"><strong>Which label fits the highlighted pin?</strong><span>${state.index+1} / ${pins.length}</span></div>${pinStage(pinned.data,{active:activeId,revealed:state.revealed})}<div class="quiz-learn-options-v38 map-learn-options-v480">${choices.map(c=>`<button class="icon-btn" data-map-choice-v480="${attr(c)}">${esc(c)}</button>`).join('')}</div><div class="map-learn-feedback-v480" aria-live="polite"></div></div></div>`;
    area.querySelectorAll('[data-map-choice-v480]').forEach(btn=>btn.addEventListener('click',()=>{
      if(state.waiting) return;
      const correct=norm(btn.dataset.mapChoiceV480)===norm(active.label);
      const feedback=area.querySelector('.map-learn-feedback-v480');
      if(!correct){ state.hadWrong=true; feedback.innerHTML='<strong>Incorrect</strong>'; return; }
      state.revealed.add(activeId); state.waiting=true;
      feedback.innerHTML=`<strong>Correct</strong><button type="button" class="icon-btn map-next-v480">${state.index>=pins.length-1?'Continue':'Next'}</button>`;
      layoutLabels(area);
      feedback.querySelector('.map-next-v480')?.addEventListener('click',()=>{
        state.waiting=false; state.revealed.clear();
        if(state.index>=pins.length-1) finishMapLearn(state,!state.hadWrong); else {state.index++;renderMapLearnMc(area,itemId,pinned,state);}
      });
    }));
    layoutLabels(area);
  }
  function renderMapLearnWritten(area,itemId,pinned,state) {
    setCounter();
    const pins=labeledPins(pinned);
    if(!pins.length) return finishMapLearn(state,true);
    state.index=Math.max(0,Math.min(state.index,pins.length-1));
    const active=pins[state.index], activeId=String(active.id);
    area.innerHTML=`<div class="map-study-wrap-v172 map-learn-written-v480"><div class="map-study-card-v172"><div class="map-study-prompt-v172"><strong>Type the label for the highlighted pin</strong><span>${state.index+1} / ${pins.length}</span></div>${pinStage(pinned.data,{active:activeId,revealed:state.revealed})}<form class="map-study-answer-v172 map-written-form-v480"><div><input type="text" class="map-study-input-v172" autocomplete="off" spellcheck="false" placeholder="Type your answer…"><button type="submit" class="icon-btn">Check Answer</button></div><small class="map-study-status-v172" aria-live="polite">Capitalization does not matter.</small></form></div></div>`;
    const form=area.querySelector('.map-written-form-v480'), input=form?.querySelector('input'), status=form?.querySelector('.map-study-status-v172'), button=form?.querySelector('button');
    form?.addEventListener('submit',e=>{
      e.preventDefault();
      if(state.waiting){
        state.waiting=false; state.revealed.clear();
        if(state.index>=pins.length-1) finishMapLearn(state,!state.hadWrong); else {state.index++;renderMapLearnWritten(area,itemId,pinned,state);} return;
      }
      if(!input?.value.trim()) return;
      const correct=norm(input.value)===norm(active.label);
      if(!correct){
        state.hadWrong=true; state.revealed.add(activeId); status.innerHTML='<strong>Incorrect</strong> · Type the correct answer to continue.'; status.classList.add('is-wrong-v172'); input.value=''; layoutLabels(area); input.focus(); return;
      }
      state.revealed.add(activeId); status.classList.remove('is-wrong-v172'); status.innerHTML='<strong>Correct</strong>'; state.waiting=true; input.disabled=true; button.textContent=state.index>=pins.length-1?'Continue':'Next'; layoutLabels(area);
    });
    layoutLabels(area); requestAnimationFrame(()=>input?.focus({preventScroll:true}));
  }

  try {
    const previous=showQuizCard;
    const wrapped=function(){
      const area=document.getElementById('quiz-flashcard-area'), itemId=currentItemId(), pinned=itemId?pinnedFor(itemId):null;
      if(!area || !pinned?.data?.image) return previous.apply(this,arguments);
      if(quizMode==='flashcards'){ renderPinnedFlashcard(area,itemId,pinned); return; }
      if(quizMode==='anki'){ renderPinnedAnki(area,itemId,pinned); return; }
      if(quizMode==='learn'){
        const state=getLearnSession(itemId,pinned);
        if(state.type==='written') renderMapLearnWritten(area,itemId,pinned,state); else renderMapLearnMc(area,itemId,pinned,state);
        return;
      }
      return previous.apply(this,arguments);
    };
    window.showQuizCard=wrapped; try { showQuizCard=wrapped; } catch {}
  } catch {}

  // Whiteboard / Notebook: ensure the active workspace itself is the interaction
  // surface. Remove stale inert states and keep it directly below floating widgets.
  function repairSpecialInputV480(){
    const white=document.querySelector('.whiteboard-tab-view-v198.active,.whiteboard-tab-view-v198.loggy-special-fullscreen-v447');
    const note=document.querySelector('.notepad-tab-view-v249.active,.notepad-tab-view-v249.loggy-special-fullscreen-v447');
    const view=(document.body.classList.contains('whiteboard-tab-active-v198')?white:null) || (document.body.classList.contains('notepad-tab-active-v249')?note:null);
    if(!view) return;
    try { document.body.inert=false; document.body.removeAttribute('inert'); } catch {}
    [view, view.querySelector('.whiteboard-runtime-host-v198,.notepad-runtime-host-v249'), view.querySelector('.whiteboard-runtime-host-v198 > *,.notepad-runtime-host-v249 > *')].filter(Boolean).forEach(el=>{
      try { el.inert=false; el.removeAttribute('inert'); } catch {}
      el.style.setProperty('pointer-events','auto','important');
      el.style.setProperty('visibility','visible','important');
    });
    view.style.setProperty('z-index','2147483645','important');
    view.querySelectorAll('[inert]').forEach(el=>{try{el.inert=false;el.removeAttribute('inert')}catch{}});
  }
  // V499: do this once at startup. Opening/switching the special tab already
  // normalizes the workspace through V404/V447. Never capture every user click.
  const queueRepairV480=()=>requestAnimationFrame(repairSpecialInputV480);
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',queueRepairV480,{once:true}); else queueRepairV480();
})();

// ============================================================================
// V482 — final pinned-image quiz renderer + reliable special workspace input
// ============================================================================
(() => {
  'use strict';
  if (window.__loggyPinnedFinalV482) return;
  window.__loggyPinnedFinalV482 = true;

  const esc = value => String(value ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const attr = esc;
  const norm = value => String(value ?? '').normalize('NFKC').trim().toLocaleLowerCase().replace(/\s+/g,' ');
  const sessions = new Map();

  function itemIdV482() {
    try { return quizMode === 'learn' ? String(learnQueue?.[0]?.id || '') : String(activeQuizDeck?.[activeQuizIndex] || ''); }
    catch { return ''; }
  }
  function pinnedV482(id) {
    try { return window.__loggyPinnedImageV169?.fieldForItem?.(id) || null; }
    catch { return null; }
  }
  function pinsV482(pinned) {
    return (pinned?.data?.pins || []).filter(pin => String(pin?.label || '').trim());
  }
  function labelV482(pin) { return String(pin?.label || '').trim(); }
  function setCountV482() {
    try {
      const total = activeQuizDeck?.length || 0;
      const n = quizMode === 'learn' ? Math.max(1, total - (learnQueue?.length || 0) + 1) : Math.min((activeQuizIndex || 0) + 1,total);
      const el=document.getElementById('quiz-set-label'); if(el) el.textContent=`${Math.min(n,total)} / ${total}`;
    } catch {}
  }

  function stageV482(data,{active='',showLabels=false,revealed=null}={}) {
    const pins=(data?.pins || []).filter(pin=>String(pin?.label||'').trim());
    const shown = revealed instanceof Set ? revealed : new Set();
    const clamp=v=>Math.max(0,Math.min(100,Number(v)||0));
    return `<div class="kb-pinned-stage-v169 map-study-stage-v172 map-stage-final-v482" data-pinned-stage-v169="1"><img src="${attr(data?.image||'')}" alt="Pinned study image"><div class="kb-pinned-overlay-v169">${pins.map((pin,index)=>{
      const id=String(pin.id||index), dir=['up','right','down','left'].includes(pin.direction)?pin.direction:'down';
      const scale=Math.max(.55,Math.min(2.2,Number(pin.size)||1));
      const reveal=showLabels || shown.has(id), x=clamp(pin.x), y=clamp(pin.y);
      const dx=Number.isFinite(Number(pin.labelDx))?Number(pin.labelDx):0, dy=Number.isFinite(Number(pin.labelDy))?Number(pin.labelDy):0, manual=!!pin.labelManual;
      const lx=clamp(x+(manual?dx:0)), ly=clamp(y+(manual?dy:0));
      return `<button type="button" class="kb-map-pin-v169 pin-dir-${dir} ${active===id?'map-study-active-v172':''}" data-pin-id-v169="${attr(id)}" style="left:${x}%;top:${y}%;--pin-color-v169:${attr(pin.color||data.pinColor||'#e53935')};--pin-scale-v171:${scale};" tabindex="-1"><span class="kb-map-pin-glyph-v615"><span class="kb-map-pin-dot-v169"></span></span></button>${reveal?`<span class="kb-map-pin-label-v169 map-label-final-v482 ${manual?'is-manual-v170':'is-auto-v170'}" data-pin-label-for-v170="${attr(id)}" data-pin-x-v170="${x}" data-pin-y-v170="${y}" data-label-dx-v170="${dx}" data-label-dy-v170="${dy}" data-label-manual-v170="${manual?'1':'0'}" style="left:${lx}%;top:${ly}%;transform:${manual?'translate(-50%,-50%)':'translate(18px,-50%)'};display:block!important;visibility:visible!important;opacity:1!important;z-index:30!important">${esc(labelV482(pin))}</span>`:''}`;
    }).join('')}</div></div>`;
  }
  function layoutV482(root) {
    const run=()=>{ try { window.__layoutPinnedLabelsV170?.(root); } catch {} };
    requestAnimationFrame(run); setTimeout(run,40); setTimeout(run,140);
  }

  function renderStudyBackV482(area,id,pinned,anki=false) {
    setCountV482();
    area.innerHTML=`<div class="flashcard-wrap pinned-card-final-v482"><div class="pinned-map-answer-shell-v482">${stageV482(pinned.data,{showLabels:true})}</div>${anki?`<div class="quiz-pinned-anki-actions-v169"><button class="icon-btn still-learning-btn" data-map-again-v482><i class="ph ph-arrow-counter-clockwise"></i> Still Learning</button><button class="icon-btn got-it-btn" data-map-good-v482><i class="ph ph-check"></i> Got It!</button></div>`:`<div class="flashcard-hint-text">Tap the map to flip back</div><div class="flashcard-nav-container"><button class="flashcard-nav-btn" data-map-prev-v482 ${activeQuizIndex===0?'disabled':''}><i class="ph ph-arrow-left"></i></button><button class="flashcard-nav-btn" data-map-next-v482><i class="ph ph-arrow-right"></i></button></div>`}</div>`;
    layoutV482(area);
    if(anki){
      area.querySelector('[data-map-again-v482]')?.addEventListener('click',()=>processAnkiAnswer('Again'));
      area.querySelector('[data-map-good-v482]')?.addEventListener('click',()=>processAnkiAnswer('Good'));
    } else {
      area.querySelector('.pinned-map-answer-shell-v482')?.addEventListener('click',e=>{if(e.target.closest('button'))return;quizCardFlipped=false;currentSlideIndex=0;showQuizCard();});
      area.querySelector('[data-map-prev-v482]')?.addEventListener('click',()=>{if(activeQuizIndex>0){activeQuizIndex--;quizCardFlipped=false;currentSlideIndex=0;showQuizCard();}});
      area.querySelector('[data-map-next-v482]')?.addEventListener('click',()=>{activeQuizIndex++;quizCardFlipped=false;currentSlideIndex=0;showQuizCard();});
    }
  }
  function renderStudyFrontV482(area,id,anki=false) {
    setCountV482();
    area.innerHTML=`<div class="flashcard-wrap pinned-card-final-v482"><div class="flashcard-mode-card pinned-map-front-v482" data-map-flip-v482><span style="font-size:2.8rem">${esc(id)}</span></div>${anki?'':`<div class="flashcard-nav-container"><button class="flashcard-nav-btn" data-map-prev-v482 ${activeQuizIndex===0?'disabled':''}><i class="ph ph-arrow-left"></i></button><button class="flashcard-nav-btn" data-map-next-v482><i class="ph ph-arrow-right"></i></button></div>`}</div>`;
    area.querySelector('[data-map-flip-v482]')?.addEventListener('click',()=>{quizCardFlipped=true;currentSlideIndex=0;showQuizCard();});
    if(!anki){
      area.querySelector('[data-map-prev-v482]')?.addEventListener('click',()=>{if(activeQuizIndex>0){activeQuizIndex--;quizCardFlipped=false;currentSlideIndex=0;showQuizCard();}});
      area.querySelector('[data-map-next-v482]')?.addEventListener('click',()=>{activeQuizIndex++;quizCardFlipped=false;currentSlideIndex=0;showQuizCard();});
    }
  }

  function otherMapLabelsV482(itemId,pinned) {
    const category=String(db.phrase_meta?.[itemId]?.type||'');
    const values=[];
    for(const candidate of Object.keys(db.phrase_meta||{})){
      if(candidate===itemId || String(db.phrase_meta?.[candidate]?.type||'')!==category) continue;
      const p=pinnedV482(candidate); if(!p) continue;
      pinsV482(p).forEach(pin=>{const label=labelV482(pin);if(label)values.push(label)});
    }
    return [...new Set(values)];
  }
  function shuffledV482(values){return [...values].sort(()=>Math.random()-.5)}
  function modeV482(id){
    try { return typeof chooseQuizletLearnQuestionTypeV476==='function' ? chooseQuizletLearnQuestionTypeV476(db.phrase_meta?.[id]||{}) : 'mc'; }
    catch { return 'mc'; }
  }
  function sessionV482(id,pinned){
    const key=`v482:${id}:${pinned?.field?.id||pinned?.field?.name||'map'}`;
    let s=sessions.get(key);
    if(!s){s={key,type:modeV482(id),index:0,wrong:false,ready:false,revealed:new Set()};sessions.set(key,s)}
    return s;
  }
  function finishV482(s,correct){sessions.delete(s.key);processLearnAnswer(correct)}

  function renderMapMcV482(area,id,pinned,s){
    setCountV482(); const pins=pinsV482(pinned); if(!pins.length)return finishV482(s,true);
    s.index=Math.max(0,Math.min(s.index,pins.length-1)); const pin=pins[s.index], pid=String(pin.id||s.index), answer=labelV482(pin);
    const pool=[...pins.filter(x=>String(x.id)!==pid).map(labelV482),...otherMapLabelsV482(id,pinned)].filter(Boolean).filter(x=>norm(x)!==norm(answer));
    const choices=[answer]; for(const c of shuffledV482([...new Set(pool)])){if(choices.length>=4)break;if(!choices.some(x=>norm(x)===norm(c)))choices.push(c)}
    area.innerHTML=`<div class="map-study-wrap-v172 map-learn-final-v482"><div class="map-study-card-v172"><div class="map-study-prompt-v172"><strong>Which label fits the highlighted pin?</strong><span>${s.index+1} / ${pins.length}</span></div>${stageV482(pinned.data,{active:pid,revealed:s.revealed})}<div class="quiz-learn-options-v38 map-learn-options-final-v482">${shuffledV482(choices).map(c=>`<button class="icon-btn" data-map-mc-v482="${attr(c)}">${esc(c)}</button>`).join('')}</div><div class="map-learn-feedback-v482" aria-live="polite"></div></div></div>`;
    area.querySelectorAll('[data-map-mc-v482]').forEach(btn=>btn.addEventListener('click',()=>{
      if(s.ready)return; const ok=norm(btn.dataset.mapMcV482)===norm(answer), feedback=area.querySelector('.map-learn-feedback-v482');
      if(!ok){s.wrong=true;feedback.innerHTML='<strong>Incorrect</strong>';return}
      s.revealed.add(pid);s.ready=true;feedback.innerHTML=`<strong>Correct</strong><button class="icon-btn" data-map-continue-v482>${s.index>=pins.length-1?'Continue':'Next'}</button>`;layoutV482(area);
      feedback.querySelector('[data-map-continue-v482]')?.addEventListener('click',()=>{s.ready=false;s.revealed.clear();if(s.index>=pins.length-1)finishV482(s,!s.wrong);else{s.index++;renderMapMcV482(area,id,pinned,s)}});
    })); layoutV482(area);
  }

  function renderMapWrittenV482(area,id,pinned,s){
    setCountV482(); const pins=pinsV482(pinned); if(!pins.length)return finishV482(s,true);
    s.index=Math.max(0,Math.min(s.index,pins.length-1)); const pin=pins[s.index], pid=String(pin.id||s.index), answer=labelV482(pin);
    area.innerHTML=`<div class="map-study-wrap-v172 map-learn-final-v482"><div class="map-study-card-v172"><div class="map-study-prompt-v172"><strong>Type the label for the highlighted pin</strong><span>${s.index+1} / ${pins.length}</span></div>${stageV482(pinned.data,{active:pid,revealed:s.revealed})}<form class="map-study-answer-v172 map-written-final-v482"><div><input type="text" autocomplete="off" spellcheck="false" placeholder="Type your answer…"><button type="submit" class="icon-btn">Check Answer</button></div><small aria-live="polite">Capitalization does not matter.</small></form></div></div>`;
    const form=area.querySelector('.map-written-final-v482'),input=form?.querySelector('input'),button=form?.querySelector('button'),status=form?.querySelector('small');
    const advance=()=>{s.ready=false;s.revealed.clear();if(s.index>=pins.length-1)finishV482(s,!s.wrong);else{s.index++;renderMapWrittenV482(area,id,pinned,s)}};
    form?.addEventListener('submit',e=>{e.preventDefault();if(s.ready){advance();return}if(!input?.value.trim())return;const ok=norm(input.value)===norm(answer);if(!ok){s.wrong=true;s.revealed.add(pid);status.innerHTML='<strong>Incorrect</strong> · Type the correct answer to continue.';input.value='';button.textContent='Check Again';layoutV482(area);input.focus();return}s.revealed.add(pid);s.ready=true;status.innerHTML='<strong>Correct</strong>';input.disabled=true;button.textContent=s.index>=pins.length-1?'Continue':'Next';layoutV482(area)});
    // Second Enter continues even after the now-disabled input can no longer submit the form.
    const key=e=>{if(e.key!=='Enter'||!s.ready||!document.body.contains(form))return;e.preventDefault();e.stopImmediatePropagation();document.removeEventListener('keydown',key,true);advance()};
    document.addEventListener('keydown',key,true); layoutV482(area); requestAnimationFrame(()=>input?.focus({preventScroll:true}));
  }

  try {
    const previous=window.showQuizCard || showQuizCard;
    const finalShow=function(){
      const area=document.getElementById('quiz-flashcard-area'),id=itemIdV482(),pinned=id?pinnedV482(id):null;
      if(!area||!pinned?.data?.image)return previous.apply(this,arguments);
      if(quizMode==='flashcards'){quizCardFlipped?renderStudyBackV482(area,id,pinned,false):renderStudyFrontV482(area,id,false);return}
      if(quizMode==='anki'){quizCardFlipped?renderStudyBackV482(area,id,pinned,true):renderStudyFrontV482(area,id,true);return}
      if(quizMode==='learn'){const s=sessionV482(id,pinned);if(s.type==='written')renderMapWrittenV482(area,id,pinned,s);else renderMapMcV482(area,id,pinned,s);return}
      return previous.apply(this,arguments);
    };
    finalShow.__pinnedFinalV482=true;window.showQuizCard=finalShow;try{showQuizCard=finalShow}catch{}
  } catch {}

  // V590: non-quiz label visibility is owned by the canonical V169 renderer.

  // Whiteboard / Notebook: make the real runtime controls interactive, not only
  // the outer shell. This also clears stale hidden/inert state inherited from
  // the ordinary Log view when a special workspace is promoted to fullscreen.
  function repairWorkspaceV482(){
    const isWhite=document.body.classList.contains('whiteboard-tab-active-v198');
    const isNote=document.body.classList.contains('notepad-tab-active-v249');
    if(!isWhite&&!isNote)return;
    const selector=isWhite?'.whiteboard-tab-view-v198':'.notepad-tab-view-v249';
    const hostSelector=isWhite?'.whiteboard-runtime-host-v198':'.notepad-runtime-host-v249';
    const views=[...document.querySelectorAll(selector)];
    const view=views.find(v=>v.classList.contains('active'))||views.at(-1);
    if(!view)return;
    if(view.parentElement!==document.body)document.body.insertBefore(view,document.getElementById('loggy-widget-stage-v239')||document.getElementById('companion-stage')||null);
    view.classList.add('active','loggy-special-fullscreen-v447');
    try{view.inert=false;view.removeAttribute('inert');view.removeAttribute('aria-hidden')}catch{}
    view.style.setProperty('display','block','important');
    view.style.setProperty('visibility','visible','important');
    view.style.setProperty('pointer-events','auto','important');
    const host=view.querySelector(hostSelector);
    if(host){
      try{host.inert=false;host.removeAttribute('inert');host.removeAttribute('aria-hidden')}catch{}
      host.style.setProperty('visibility','visible','important');
      host.style.setProperty('pointer-events','auto','important');
    }
    // Do not touch descendants. Whiteboard canvas/overlays and Notebook editors
    // intentionally manage pointer-events themselves.
  }
  const scheduleRepairV482=()=>requestAnimationFrame(repairWorkspaceV482);
  // V499: one startup repair only. V404/V447 run again whenever a special tab
  // is actually opened/switched, so no body-wide observer or click interception.
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',scheduleRepairV482,{once:true});else scheduleRepairV482();
})();


// ============================================================================
// V483 — pinned maps are first-class Quizlet Learn items + permanent readonly labels
// ============================================================================
(() => {
  'use strict';
  if (window.__loggyPinnedQuizV483) return;
  window.__loggyPinnedQuizV483 = true;

  const esc = v => String(v ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const attr = esc;
  const norm = v => String(v ?? '').normalize('NFKC').trim().toLocaleLowerCase().replace(/\s+/g,' ');
  const sessions = new Map();

  function itemId(){
    try { return quizMode === 'learn' ? String(learnQueue?.[0]?.id || '') : String(activeQuizDeck?.[activeQuizIndex] || ''); }
    catch { return ''; }
  }
  function pinned(id){ try { return window.__loggyPinnedImageV169?.fieldForItem?.(id) || null; } catch { return null; } }
  function pins(p){ return (p?.data?.pins || []).filter(x => String(x?.label || '').trim()); }
  function label(pin){ return String(pin?.label || '').trim(); }
  function validMap(id){ const p=pinned(id); return !!(p?.data?.image && pins(p).length); }

  // Base template.js calls this during Written-mode eligibility filtering.
  window.__loggyPinnedQuizEligibleV483 = function(meta, id){
    if (id && validMap(String(id))) return true;
    try {
      const category=String(meta?.type || '');
      const defs=typeof getKnowledgeFieldDefs==='function' ? getKnowledgeFieldDefs(category) : [];
      const values=meta?.custom_fields || {};
      for(const f of defs){
        const raw=values[f.name];
        const legacy=window.__loggyPinnedImageV169?.isPinnedValue?.(raw);
        if(f?.kind!=='pinnedImage' && !legacy) continue;
        const effective=f?.kind==='pinnedImage'?f:{...f,kind:'pinnedImage'};
        const data=window.__loggyPinnedImageV169?.parse?.(raw,effective);
        if(data?.image && (data.pins||[]).some(pin=>String(pin?.label||'').trim())) return true;
      }
    } catch {}
    return false;
  };

  function otherLabels(id){
    const cat=String(db.phrase_meta?.[id]?.type || '');
    const out=[];
    for(const candidate of Object.keys(db.phrase_meta || {})){
      if(candidate===id || String(db.phrase_meta?.[candidate]?.type||'')!==cat) continue;
      const p=pinned(candidate); if(!p) continue;
      pins(p).forEach(pin=>{const x=label(pin);if(x)out.push(x)});
    }
    return [...new Set(out)];
  }
  const shuffle=a=>[...a].sort(()=>Math.random()-.5);

  function questionType(id){
    try {
      syncQuizletLearnModesV476?.();
      const mc=quizletLearnModesV476?.has?.('mc');
      const wr=quizletLearnModesV476?.has?.('written');
      if(mc&&wr){ const t=(quizletLearnQuestionCounterV476 % 2===0)?'mc':'written'; quizletLearnQuestionCounterV476++; return t; }
      return wr?'written':'mc';
    } catch { return 'mc'; }
  }

  function session(id,p){
    const key=`v483:${id}:${p?.field?.id||p?.field?.name||'map'}`;
    let s=sessions.get(key);
    if(!s){
      s={key,type:questionType(id),index:0,hadWrong:false,ready:false,results:new Map(),revealed:new Set(),firstWrong:new Set()};
      sessions.set(key,s);
    }
    return s;
  }
  function finish(s){ sessions.delete(s.key); processLearnAnswer(!s.hadWrong); }

  function setCount(){
    try{
      const total=activeQuizDeck?.length||0;
      const n=Math.max(1,total-(learnQueue?.length||0)+1);
      const el=document.getElementById('quiz-set-label'); if(el)el.textContent=`${Math.min(n,total)} / ${total}`;
    }catch{}
  }

  function stage(data,s,activeId,{revealActive=false,showAll=false}={}){
    const clamp=v=>Math.max(0,Math.min(100,Number(v)||0));
    return `<div class="kb-pinned-stage-v169 map-study-stage-v172 map-stage-v483" data-pinned-stage-v169="1"><img src="${attr(data?.image||'')}" alt="Pinned study image"><div class="kb-pinned-overlay-v169">${(data?.pins||[]).filter(p=>String(p?.label||'').trim()).map((pin,i)=>{
      const id=String(pin.id||i), status=s?.results?.get(id)||'', dir=['up','right','down','left'].includes(pin.direction)?pin.direction:'down';
      const scale=Math.max(.55,Math.min(2.2,Number(pin.size)||1));
      const color=status==='correct'?'#22a06b':status==='wrong'?'#d92d20':(pin.color||data.pinColor||'#e53935');
      const reveal=showAll || s?.revealed?.has(id) || (revealActive && id===activeId), x=clamp(pin.x), y=clamp(pin.y);
      const dx=Number.isFinite(Number(pin.labelDx))?Number(pin.labelDx):0, dy=Number.isFinite(Number(pin.labelDy))?Number(pin.labelDy):0, manual=!!pin.labelManual;
      const lx=clamp(x+(manual?dx:0)), ly=clamp(y+(manual?dy:0));
      return `<button type="button" class="kb-map-pin-v169 pin-dir-${dir} ${id===activeId?'map-study-active-v172':''} ${status?`map-result-${status}-v483`:''}" data-v483-pin="${attr(id)}" data-pin-id-v169="${attr(id)}" style="left:${x}%;top:${y}%;--pin-color-v169:${attr(color)};--pin-scale-v171:${scale};" tabindex="-1"><span class="kb-map-pin-glyph-v615"><span class="kb-map-pin-dot-v169"></span></span></button>${reveal?`<span class="kb-map-pin-label-v169 map-label-final-v483 ${manual?'is-manual-v170':'is-auto-v170'}" data-pin-label-for-v170="${attr(id)}" data-pin-x-v170="${x}" data-pin-y-v170="${y}" data-label-dx-v170="${dx}" data-label-dy-v170="${dy}" data-label-manual-v170="${manual?'1':'0'}" style="left:${lx}%;top:${ly}%;transform:${manual?'translate(-50%,-50%)':'translate(18px,-50%)'};display:block!important;visibility:visible!important;opacity:1!important;z-index:30!important" title="${attr(label(pin))}">${esc(label(pin))}</span>`:''}`;
    }).join('')}</div></div>`;
  }

  function heading(p,s,total){
    const whole=p?.data?.testMode!=='parts';
    return `<div class="map-study-prompt-v172"><strong>${whole?'Whole image round':'Test by part'} · ${s.type==='written'?'Written':'Multiple Choice'}</strong><span>${s.index+1} / ${total}</span></div>`;
  }

  function advance(area,id,p,s,renderer){
    s.ready=false;
    const ps=pins(p);
    if(s.index>=ps.length-1){ finish(s); return; }
    s.index++;
    renderer(area,id,p,s);
  }

  function bindWholePinClicks(area,id,p,s,renderer){
    area.querySelectorAll('[data-v483-pin]').forEach(btn=>btn.addEventListener('click',()=>{
      const pid=String(btn.dataset.v483Pin||'');
      if(!pid || s.results.has(pid))return;
      s.activeId=pid;
      renderer(area,id,p,s);
    }));
  }

  function wholeRoundShell(area,id,p,s,renderer){
    const ps=pins(p), done=s.results.size>=ps.length;
    if(done){
      area.innerHTML=`<div class="map-study-wrap-v172 map-learn-v483"><div class="map-study-card-v172"><div class="map-study-prompt-v172"><strong>Whole image round complete</strong><span>${ps.length} / ${ps.length}</span></div>${stage(p.data,s,'',{showAll:true})}<div class="map-learn-feedback-v483"><button class="icon-btn" data-v483-finish>Finish Round</button></div></div></div>`;
      area.querySelector('[data-v483-finish]')?.addEventListener('click',()=>finish(s));
      return true;
    }
    if(!s.activeId){
      area.innerHTML=`<div class="map-study-wrap-v172 map-learn-v483"><div class="map-study-card-v172"><div class="map-study-prompt-v172"><strong>Whole image round · ${s.type==='written'?'Written':'Multiple Choice'}</strong><span>${s.results.size} / ${ps.length}</span></div>${stage(p.data,s,'')}<div class="map-learn-feedback-v483"><strong>Click any unanswered pin to test it.</strong></div></div></div>`;
      bindWholePinClicks(area,id,p,s,renderer);
      return true;
    }
    return false;
  }

  function renderMc(area,id,p,s){
    setCount(); const ps=pins(p); if(!ps.length){finish(s);return}
    const whole=p.data.testMode!=='parts';
    if(whole && wholeRoundShell(area,id,p,s,renderMc))return;
    s.index=Math.max(0,Math.min(s.index,ps.length-1));
    const pin=whole ? ps.find(x=>String(x.id)===String(s.activeId)) : ps[s.index];
    if(!pin){s.activeId='';return renderMc(area,id,p,s)}
    const pid=String(pin.id||s.index), answer=label(pin);
    const pool=[...ps.filter(x=>String(x.id)!==pid).map(label),...otherLabels(id)].filter(Boolean).filter(x=>norm(x)!==norm(answer));
    const choices=[answer]; for(const c of shuffle([...new Set(pool)])){if(choices.length>=4)break;if(!choices.some(x=>norm(x)===norm(c)))choices.push(c)}
    const title=whole?`Whole image round · Multiple Choice`:`Test by part · Multiple Choice`;
    area.innerHTML=`<div class="map-study-wrap-v172 map-learn-v483"><div class="map-study-card-v172"><div class="map-study-prompt-v172"><strong>${title}</strong><span>${whole?s.results.size+1:s.index+1} / ${ps.length}</span></div>${stage(p.data,s,pid)}<div class="quiz-learn-options-v38 map-learn-options-v483">${shuffle(choices).map(c=>`<button class="icon-btn" data-v483-choice="${attr(c)}">${esc(c)}</button>`).join('')}</div><div class="map-learn-feedback-v483" aria-live="polite"></div></div></div>`;
    area.querySelectorAll('[data-v483-choice]').forEach(btn=>btn.addEventListener('click',()=>{
      const ok=norm(btn.dataset.v483Choice)===norm(answer);
      s.results.set(pid,ok?'correct':'wrong'); s.revealed.add(pid); if(!ok)s.hadWrong=true;
      if(whole){s.activeId='';renderMc(area,id,p,s);return}
      area.innerHTML=`<div class="map-study-wrap-v172 map-learn-v483"><div class="map-study-card-v172"><div class="map-study-prompt-v172"><strong>${title}</strong><span>${s.index+1} / ${ps.length}</span></div>${stage(p.data,s,pid)}<div class="quiz-learn-options-v38 map-learn-options-v483">${shuffle(choices).map(c=>`<button class="icon-btn" disabled>${esc(c)}</button>`).join('')}</div><div class="map-learn-feedback-v483"><strong>${ok?'Correct':'Incorrect'}</strong><button class="icon-btn" data-v483-next>${s.index>=ps.length-1?'Finish Round':'Next Pin'}</button></div></div></div>`;
      area.querySelector('[data-v483-next]')?.addEventListener('click',()=>advance(area,id,p,s,renderMc));
    }));
  }

  function renderWritten(area,id,p,s){
    setCount(); const ps=pins(p); if(!ps.length){finish(s);return}
    const whole=p.data.testMode!=='parts';
    if(whole && wholeRoundShell(area,id,p,s,renderWritten))return;
    s.index=Math.max(0,Math.min(s.index,ps.length-1));
    const pin=whole ? ps.find(x=>String(x.id)===String(s.activeId)) : ps[s.index];
    if(!pin){s.activeId='';return renderWritten(area,id,p,s)}
    const pid=String(pin.id||s.index),answer=label(pin);
    const title=whole?'Whole image round · Written':'Test by part · Written';
    area.innerHTML=`<div class="map-study-wrap-v172 map-learn-v483"><div class="map-study-card-v172"><div class="map-study-prompt-v172"><strong>${title}</strong><span>${whole?s.results.size+1:s.index+1} / ${ps.length}</span></div>${stage(p.data,s,pid)}<form class="map-study-answer-v172 map-written-v483"><div><input type="text" autocomplete="off" spellcheck="false" placeholder="Type the pin label…"><button type="submit" class="icon-btn">Check Answer</button></div><small aria-live="polite">Capitalization does not matter.</small></form></div></div>`;
    const form=area.querySelector('.map-written-v483'),input=form?.querySelector('input'),button=form?.querySelector('button');
    const redraw=(message,ready)=>{
      area.querySelector('.map-study-stage-v172')?.replaceWith((()=>{const box=document.createElement('div');box.innerHTML=stage(p.data,s,pid);return box.firstElementChild})());
      const st=area.querySelector('.map-written-v483 small'); if(st)st.innerHTML=message;
      const b=area.querySelector('.map-written-v483 button'); if(b)b.textContent=ready?(whole?'Done With Pin':(s.index>=ps.length-1?'Finish Round':'Next Pin')):'Check Again';
    };
    form?.addEventListener('submit',e=>{
      e.preventDefault();
      if(s.ready){
        s.ready=false;
        if(whole){s.activeId='';renderWritten(area,id,p,s)}else advance(area,id,p,s,renderWritten);
        return;
      }
      if(!input?.value.trim())return;
      const ok=norm(input.value)===norm(answer);
      if(!ok){
        s.hadWrong=true; s.firstWrong.add(pid); s.results.set(pid,'wrong'); s.revealed.add(pid);
        redraw('<strong>Incorrect</strong> · Type the correct answer to continue.',false);
        input.value=''; input.focus(); return;
      }
      if(!s.firstWrong.has(pid))s.results.set(pid,'correct');
      s.revealed.add(pid); s.ready=true;
      redraw('<strong>Correct</strong>',true);
      input.disabled=true;
    });
    requestAnimationFrame(()=>input?.focus({preventScroll:true}));
  }

  // Final owner for pinned-map Quizlet Learn only. Flashcards/Anki continue to
  // use the V482 frameless revealed-map renderer.
  try{
    const previous=window.showQuizCard || showQuizCard;
    const finalShow=function(){
      const area=document.getElementById('quiz-flashcard-area'),id=itemId(),p=id?pinned(id):null;
      if(quizMode!=='learn' || !area || !p?.data?.image || !pins(p).length) return previous.apply(this,arguments);
      const s=session(id,p); if(s.type==='written')renderWritten(area,id,p,s); else renderMc(area,id,p,s);
    };
    finalShow.__pinnedMapV483=true; window.showQuizCard=finalShow; try{showQuizCard=finalShow}catch{}
  }catch{}

  // Permanent read-only renderer for maps opened from KB or Day Log Items Learned.
  // It does not depend on the placement editor's label lifecycle; labels are part
  // of the map markup and are positioned directly next to their saved pins.
  function readonlyMap(field,value){
    const data=window.__loggyPinnedImageV169?.parse?.(value,field);
    if(!data?.image)return '<div class="kb-display-empty">Not added</div>';
    const stage=window.__loggyPinnedImageV169?.renderStage?.(data,{
      labeled:true,
      readonly:true,
      stageClass:'kb-readonly-map-stage-v590',
      labelClass:'kb-readonly-map-label-v483'
    })||'';
    return `<div class="kb-pinned-readonly-v169 kb-readonly-map-v483">${stage}</div>`;
  }
  try{
    const before=buildKnowledgeFieldDisplayHtml;
    buildKnowledgeFieldDisplayHtml=function(field,value=''){
      const legacy=window.__loggyPinnedImageV169?.isPinnedValue?.(value);
      if(field?.kind!=='pinnedImage'&&!legacy)return before.apply(this,arguments);
      const effective=field?.kind==='pinnedImage'?field:{...(field||{}),kind:'pinnedImage'};
      return `<div class="modal-section mt-10 kb-item-field kb-display-field kb-pinned-display-field-v169"><div class="kb-item-field-label-row"><span class="field-label">${esc(effective.name||'Map')}</span></div>${readonlyMap(effective,value)}</div>`;
    };
    window.buildKnowledgeFieldDisplayHtml=buildKnowledgeFieldDisplayHtml;
  }catch{}
})();


// ============================================================
// V557 — Knowledge Base: global "Hide tags" setting
// Hides tag chips/rows on KB item cards without removing tag data,
// so tag search/filtering and editing continue to work.
// ============================================================
(function(){
    'use strict';

    const SETTING_KEY = 'knowledgeHideTagsV557';

    function cfgV557(){
        try {
            db.settings ||= {};

            // V630: Hide Tags is ON by default for the KB template.
            // Existing logs with an explicit saved OFF value keep that choice.
            if (db.settings[SETTING_KEY] === undefined) {
                db.settings[SETTING_KEY] = true;
            }

            return db.settings;
        } catch {
            return {};
        }
    }

    function hideTagsEnabledV557(){
        return !!cfgV557()[SETTING_KEY];
    }

    function applyKbTagVisibilityV557(){
        const hide = hideTagsEnabledV557();
        document.documentElement.classList.toggle('kb-hide-item-tags-v557', hide);

        // Existing KB card tag renderers across list/grid/polaroid versions.
        document.querySelectorAll(
            '#phrases-library-grid .kb-library-tag-row-v55,' +
            '#phrases-library-grid .kb-library-tag-row-v57,' +
            '#phrases-library-grid .kb-library-tags,' +
            '#phrases-library-grid .kb-item-tags,' +
            '#phrases-library-grid .phrase-tags,' +
            '#phrases-library-grid [class*="kb-library-tag-row"],' +
            '#phrases-library-grid [class*="kb-item-tag-row"]'
        ).forEach(node => {
            node.style.setProperty('display', hide ? 'none' : '', hide ? 'important' : '');
            if (!hide) node.style.removeProperty('display');
        });
    }

    function ensureHideTagsSettingV557(){
        const modal = document.querySelector('#settings-modal');
        const box = modal?.querySelector(':scope > .modal-box') || modal?.querySelector('.modal-box');
        if (!box) return;

        let row = box.querySelector('.kb-hide-tags-setting-v557');
        if (!row) {
            row = document.createElement('div');
            row.className = 'modal-section mt-20 kb-hide-tags-setting-v557';
            row.innerHTML = `
                <div class="kb-hide-tags-copy-v557"><strong>Hide Tags</strong></div>
                <label class="kb-switch-v173 kb-hide-tags-switch-v557" title="Hide tags">
                    <input type="checkbox" class="kb-hide-tags-toggle-v557">
                    <span class="kb-switch-track-v173"></span>
                </label>
            `;

            const toggle = row.querySelector('.kb-hide-tags-toggle-v557');
            toggle?.addEventListener('change', () => {
                cfgV557()[SETTING_KEY] = !!toggle.checked;
                try { saveDb(); } catch {}
                applyKbTagVisibilityV557();
                try {
                    const search = document.querySelector('#phrases-search-bar')?.value || '';
                    renderPhrasesLibrary(search);
                } catch {}
                requestAnimationFrame(applyKbTagVisibilityV557);
            });
        }

        // V560: Hide Tags belongs directly BELOW the Placeholders section.
        // Reposition on every render too, so an already-created row from an
        // older build cannot remain above Placeholders.
        const placeholderAnchorV560 =
            box.querySelector('.kb-placeholder-settings-v56,#kb-placeholder-settings-v56');
        const fallbackAnchorV560 =
            box.querySelector('#settings-hide-categories-row') ||
            box.querySelector('#kb-polaroid-options-v163');
        const anchorV560 = placeholderAnchorV560 || fallbackAnchorV560;
        if (anchorV560) {
            if (anchorV560.nextElementSibling !== row) {
                anchorV560.insertAdjacentElement('afterend', row);
            }
        } else if (!row.parentElement) {
            box.appendChild(row);
        }

        const toggle = row.querySelector('.kb-hide-tags-toggle-v557');
        if (toggle) {
            toggle.checked = hideTagsEnabledV557();
            toggle.setAttribute('role','switch');
            toggle.setAttribute('aria-checked', toggle.checked ? 'true' : 'false');
        }

        ensureHideCategoryTabsSettingV558(box, row);
    }

    // V558 — "Hide category tabs" toggle, styled identically to and placed
    // directly below the "Hide Tags" switch above. Applies in every KB view
    // (list, polaroid, etc.), not just polaroid.
    function ensureHideCategoryTabsSettingV558(box, hideTagsRow){
        let catRow = box.querySelector('.kb-hide-cat-tabs-setting-v558');
        if (!catRow) {
            catRow = document.createElement('div');
            catRow.className = 'modal-section mt-10 kb-hide-cat-tabs-setting-v558';
            catRow.innerHTML = `
                <div class="kb-hide-tags-copy-v557"><strong>Hide category tabs</strong></div>
                <label class="kb-switch-v173 kb-hide-tags-switch-v557" title="Hide category tabs">
                    <input type="checkbox" class="kb-hide-cat-tabs-toggle-v558">
                    <span class="kb-switch-track-v173"></span>
                </label>
            `;
            const toggle = catRow.querySelector('.kb-hide-cat-tabs-toggle-v558');
            toggle.addEventListener('change', () => {
                db.settings.hideCategoriesInPolaroid = !!toggle.checked;
                const oldCheckbox = document.getElementById('settings-hide-categories');
                if (oldCheckbox) oldCheckbox.checked = toggle.checked;
                try { saveDb(); } catch {}
                try { applyLibraryViewVisuals(); } catch {}
            });
        }
        if (hideTagsRow && hideTagsRow.nextElementSibling !== catRow) {
            hideTagsRow.insertAdjacentElement('afterend', catRow);
        }
        const toggle = catRow.querySelector('.kb-hide-cat-tabs-toggle-v558');
        if (toggle) {
            toggle.checked = !!db.settings.hideCategoriesInPolaroid;
            toggle.setAttribute('role','switch');
            toggle.setAttribute('aria-checked', toggle.checked ? 'true' : 'false');
        }
        window.__loggySyncHideCategoryTabsSwitchV558 = () => {
            const t = document.querySelector('.kb-hide-cat-tabs-toggle-v558');
            if (t) t.checked = !!db.settings.hideCategoriesInPolaroid;
        };
    }

    // Add a stylesheet guard too, so tags never flash back during rerenders.
    if (!document.getElementById('kb-hide-tags-style-v557')) {
        const style = document.createElement('style');
        style.id = 'kb-hide-tags-style-v557';
        style.textContent = `
            html.kb-hide-item-tags-v557 #phrases-library-grid .kb-library-tag-row-v55,
            html.kb-hide-item-tags-v557 #phrases-library-grid .kb-library-tag-row-v57,
            html.kb-hide-item-tags-v557 #phrases-library-grid .kb-library-tags,
            html.kb-hide-item-tags-v557 #phrases-library-grid .kb-item-tags,
            html.kb-hide-item-tags-v557 #phrases-library-grid .phrase-tags,
            html.kb-hide-item-tags-v557 #phrases-library-grid [class*="kb-library-tag-row"],
            html.kb-hide-item-tags-v557 #phrases-library-grid [class*="kb-item-tag-row"] {
                display: none !important;
            }
            .kb-hide-tags-setting-v557 {
                display:inline-flex !important;
                flex-direction:row !important;
                align-items:center !important;
                justify-content:flex-start !important;
                align-self:flex-start !important;
                gap:8px !important;
                width:auto !important;
                max-width:100% !important;
                text-align:left !important;
                margin-left:0 !important;
                margin-right:auto !important;
                padding-left:0 !important;
            }
            .kb-hide-tags-copy-v557 {
                display:flex !important;
                align-items:center !important;
                flex:0 0 auto !important;
                min-width:0;
                text-align:left !important;
            }
            .kb-hide-tags-copy-v557 strong {
                margin:0 !important;
                text-align:left !important;
            }
            .kb-hide-tags-switch-v557 {
                margin:0 !important;
                flex:0 0 auto !important;
            }
        `;
        document.head.appendChild(style);
    }

    // KB settings renderer.
    try {
        const beforeV557 = renderSettings;
        renderSettings = function(){
            const result = beforeV557.apply(this, arguments);
            requestAnimationFrame(() => {
                ensureHideTagsSettingV557();
                applyKbTagVisibilityV557();
            });
            return result;
        };
    } catch {}

    // KB library renderer. Apply after every item/card rerender.
    try {
        const beforeLibraryV557 = renderPhrasesLibrary;
        renderPhrasesLibrary = function(){
            const result = beforeLibraryV557.apply(this, arguments);
            requestAnimationFrame(applyKbTagVisibilityV557);
            return result;
        };
    } catch {}

    // Keep the toggle synced when the KB settings modal is opened/re-rendered.
    document.addEventListener('click', event => {
        if (
            event.target.closest?.('[data-view="phrases"],[data-tab="phrases"],#settings-btn,.settings-btn') ||
            event.target.closest?.('#settings-category-tabs')
        ) {
            requestAnimationFrame(() => {
                ensureHideTagsSettingV557();
                applyKbTagVisibilityV557();
            });
        }
    }, true);

    requestAnimationFrame(() => {
        applyKbTagVisibilityV557();
        ensureHideTagsSettingV557();
    });

    window.__loggyKbHideTagsV557 = {
        apply: applyKbTagVisibilityV557,
        ensureSetting: ensureHideTagsSettingV557
    };
})();



// ============================================================
// V598 — Ctrl+K field-owned bridge for the floating Keyboard widget
// ============================================================
(() => {
    'use strict';
    if (window.__loggyKeyboardTextTargetBridgeV598) return;
    window.__loggyKeyboardTextTargetBridgeV598 = true;

    let lastKeyboardTextTargetV598 = null;
    const redispatchedCtrlKEventsV598 = new WeakSet();

    function validKeyboardTextTargetV598(node) {
        if (!(node instanceof HTMLElement) || !node.isConnected) return false;
        if (node.matches('textarea')) return !node.disabled && !node.readOnly;

        if (node.matches('input')) {
            const type = String(node.type || 'text').toLowerCase();
            return (
                !node.disabled &&
                !node.readOnly &&
                ![
                    'button','checkbox','radio','range','file','submit',
                    'reset','color','date','datetime-local','time','number',
                    'month','week'
                ].includes(type)
            );
        }

        return node.isContentEditable || node.getAttribute('role') === 'textbox';
    }

    function rememberKeyboardTextTargetV598(node) {
        if (!validKeyboardTextTargetV598(node)) return false;

        if (
            lastKeyboardTextTargetV598 &&
            lastKeyboardTextTargetV598 !== node
        ) {
            try { delete lastKeyboardTextTargetV598.dataset.loggyKeyboardTargetV598; } catch {}
        }

        lastKeyboardTextTargetV598 = node;
        window.__loggyKeyboardTextTargetV598 = node;
        // Also keep the V597 name populated for any historical runtime that
        // learned that property during the previous release.
        window.__loggyKeyboardTextTargetV597 = node;

        node.dataset.loggyKeyboardTargetV598 = '1';
        return true;
    }

    function closestTextTargetV598(node) {
        if (validKeyboardTextTargetV598(node)) return node;

        if (!(node instanceof Element)) return null;
        const field = node.closest?.(
            'input,textarea,[contenteditable="true"],[role="textbox"]'
        );
        return validKeyboardTextTargetV598(field) ? field : null;
    }

    function activeTextTargetV598(event) {
        const eventTarget = closestTextTargetV598(event?.target);
        if (eventTarget) return eventTarget;

        const active = validKeyboardTextTargetV598(document.activeElement)
            ? document.activeElement
            : null;
        if (active) return active;

        return validKeyboardTextTargetV598(lastKeyboardTextTargetV598)
            ? lastKeyboardTextTargetV598
            : null;
    }

    function reassertTextTargetV598(target) {
        if (!validKeyboardTextTargetV598(target)) return false;
        rememberKeyboardTextTargetV598(target);

        try {
            target.focus({ preventScroll:true });
        } catch {
            try { target.focus(); } catch {}
        }

        // The floating widget runtime may keep its own focusin-based target
        // tracker. If the field was already focused, .focus() does not emit a
        // new focusin, so explicitly send one from the real field.
        try {
            target.dispatchEvent(new FocusEvent('focusin', {
                bubbles:true,
                composed:true,
                relatedTarget:null
            }));
        } catch {}

        return document.activeElement === target || validKeyboardTextTargetV598(target);
    }

    // Track every dynamically-created KB/modal text field from the moment the
    // user actually interacts with it.
    document.addEventListener('focusin', event => {
        const target = closestTextTargetV598(event.target);
        if (target) rememberKeyboardTextTargetV598(target);
    }, true);

    document.addEventListener('pointerdown', event => {
        const target = closestTextTargetV598(event.target);
        if (target) {
            rememberKeyboardTextTargetV598(target);
            return;
        }

        // Clicking the floating Keyboard must not destroy the field it types
        // into. Prevent pointer focus from moving away from the remembered field.
        if (
            event.target?.closest?.('#virtual-keyboard') &&
            validKeyboardTextTargetV598(lastKeyboardTextTargetV598)
        ) {
            event.preventDefault();
            reassertTextTargetV598(lastKeyboardTextTargetV598);
        }
    }, true);

    // Run before the widget runtime's ordinary shortcut handler. The original
    // Ctrl+K is consumed and then re-fired FROM THE INPUT ITSELF, so the widget
    // sees both event.target === field and document.activeElement === field.
    window.addEventListener('keydown', event => {
        if (redispatchedCtrlKEventsV598.has(event)) return;

        if (
            event.repeat ||
            !event.ctrlKey ||
            event.shiftKey ||
            event.altKey ||
            event.metaKey ||
            !(event.code === 'KeyK' || String(event.key || '').toLowerCase() === 'k')
        ) return;

        const target = activeTextTargetV598(event);
        if (!target) return; // Let the widget show its normal no-field message.

        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();

        reassertTextTargetV598(target);

        const forwarded = new KeyboardEvent('keydown', {
            key:'k',
            code:'KeyK',
            ctrlKey:true,
            shiftKey:false,
            altKey:false,
            metaKey:false,
            bubbles:true,
            cancelable:true,
            composed:true
        });

        redispatchedCtrlKEventsV598.add(forwarded);
        target.dispatchEvent(forwarded);
    }, true);

    window.__loggyKeyboardTextTargetV598Api = {
        current: () => (
            validKeyboardTextTargetV598(document.activeElement)
                ? document.activeElement
                : (
                    validKeyboardTextTargetV598(lastKeyboardTextTargetV598)
                        ? lastKeyboardTextTargetV598
                        : null
                )
        ),
        remember: rememberKeyboardTextTargetV598,
        focus: target => reassertTextTargetV598(
            target || lastKeyboardTextTargetV598
        )
    };
})();



// ============================================================================
// V611 — FAST LOG INTERACTION AUTHORITY
// Navigation clicks run before the large compatibility listener stack. Only
// concrete navigation/day targets are captured; ordinary controls are untouched.
// ============================================================================
(() => {
  'use strict';
  if (window.__loggyFastInteractionV611) return;
  window.__loggyFastInteractionV611 = true;

  window.addEventListener('click', event => {
    if (event.defaultPrevented) return;
    const target = event.target instanceof Element ? event.target : null;
    if (!target) return;

    const dayCard = target.closest('#days-grid .polaroid-card[data-day], #days-grid [data-day] > .day-box, #days-grid .day-box[data-day]');
    if (dayCard) {
      const owner = dayCard.matches('[data-day]') ? dayCard : dayCard.closest('[data-day]');
      const day = Number(dayCard.dataset.day || owner?.dataset?.day || 0);
      if (Number.isInteger(day) && day > 0) {
        event.preventDefault();
        event.stopImmediatePropagation();
        try { window.__openDayFastV182?.(day); } catch { try { openDayLog?.(day); } catch {} }
        return;
      }
    }

    const custom = target.closest('.custom-tab-nav-btn[data-custom-tab-id]');
    if (custom) {
      const id = String(custom.dataset.customTabId || '');
      if (id) {
        event.preventDefault();
        event.stopImmediatePropagation();
        try { openCustomTab?.(id); } catch {}
        return;
      }
    }

    const built = target.closest('#open-phrases-btn,#open-quizzes-btn,#open-tools-btn');
    if (!built) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    try {
      if (built.id === 'open-phrases-btn') {
        const view=phrasesLibraryView;
        switchView?.(view);
        const stale=view?.dataset?.renderVersionV184!==String(typeof dataVersionV184!=='undefined'?dataVersionV184:'');
        if(stale) requestAnimationFrame(()=>setTimeout(()=>{
          try{renderPhrasesLibrary?.(); if(view&&typeof dataVersionV184!=='undefined')view.dataset.renderVersionV184=String(dataVersionV184);}catch{}
        },0));
      }
      else if (built.id === 'open-quizzes-btn') { switchView?.(quizzesView); requestAnimationFrame(()=>updateQuizUI?.()); }
      else if (built.id === 'open-tools-btn') { switchView?.(toolboxView); requestAnimationFrame(()=>renderToolbox?.()); }
    } catch {}
  }, true);
})();


// ============================================================================
// V616 — AUTHORITATIVE PIN INPUT + IMAGE ALIGNMENT + KB ALL PACKING
// ============================================================================
(() => {
  'use strict';
  if (window.__loggyV616Authority) return;
  window.__loggyV616Authority = true;

  // ENTER IN A PIN LABEL IS OWNED HERE AT WINDOW CAPTURE, BEFORE document/modal
  // capture handlers can interpret it as another action. It commits only.
  const swallowPinLabelEnterV616 = event => {
    if (event.key !== 'Enter' || event.isComposing || event.keyCode === 229) return;
    const input = event.target;
    if (!input?.matches?.('.kb-pinned-label-input-v169')) return;
    const editor=input.closest?.('.kb-pinned-editor-v169');
    if (!editor?.classList?.contains('is-pin-placement-v171')) return;
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    try { input.__commitPinnedLabelV616?.(); } catch {}
    requestAnimationFrame(() => {
      if (!editor.isConnected || !editor.classList.contains('is-pin-placement-v171')) return;
      try { input.focus({preventScroll:true}); } catch { input.focus?.(); }
    });
  };
  window.addEventListener('keydown', swallowPinLabelEnterV616, true);
  window.addEventListener('keypress', event => {
    if (event.key==='Enter' && event.target?.matches?.('.kb-pinned-label-input-v169') && event.target.closest?.('.is-pin-placement-v171')) {
      event.preventDefault(); event.stopPropagation(); event.stopImmediatePropagation();
    }
  }, true);

  // Align EVERY live map surface, not only the full-screen editor.
  const layoutMapRootV616 = root => {
    const stages = root?.matches?.('.kb-pinned-stage-v169') ? [root] : [...(root?.querySelectorAll?.('.kb-pinned-stage-v169') || [])];
    stages.forEach(stage => {
      try { window.__alignPinnedOverlayToImageV612?.(stage); } catch {}
      try { window.__layoutPinnedLabelsV170?.(stage); } catch {}
    });
  };
  const queueMapRootV616 = root => requestAnimationFrame(() => requestAnimationFrame(() => layoutMapRootV616(root)));
  if (document.readyState==='loading') document.addEventListener('DOMContentLoaded',()=>queueMapRootV616(document),{once:true}); else queueMapRootV616(document);
  try {
    new MutationObserver(records => {
      for (const record of records) for (const node of record.addedNodes || []) {
        if (!(node instanceof Element)) continue;
        if (node.matches?.('.kb-pinned-stage-v169') || node.querySelector?.('.kb-pinned-stage-v169')) queueMapRootV616(node);
      }
    }).observe(document.body,{childList:true,subtree:true});
  } catch {}

  // Knowledge Base layout — V683 single authoritative owner.
  // All previous masonry/flex/packed-grid owners were removed. Every render,
  // restore, category change, image load and resize now converges on this one
  // deterministic layout path.
  let kbLayoutRafV683 = 0;
  let kbLayoutEpochV683 = 0;
  const KB_GAP_V683 = 12;
  const KB_LARGE_THRESHOLD_V683 = 160;
  const KB_CHUNK_V683 = 48;
  const LEGACY_LAYOUT_CLASSES_V683 = [
    'kb-primary-map-flow-v172','kb-masonry-v175','kb-layout-pending-v215',
    'kb-all-grid-v614','kb-packed-all-v616','kb-packed-all-v620',
    'kb-pack-pending-v620','kb-large-pack-v644'
  ];

  function kbCardsV683(grid){
    return [...grid.querySelectorAll(':scope > .phrase-card,:scope > .polaroid-card')]
      .filter(card => !card.classList.contains('hidden'));
  }

  function clearCardGeometryV683(card){
    delete card.dataset.kbLayoutPlacedV683;
    delete card.dataset.kbPackedV644;
    [
      'position','left','right','top','bottom','inset','width','max-width','min-width',
      'height','max-height','min-height','grid-row','grid-row-end','grid-column',
      'grid-column-end','transform','visibility','pointer-events','margin','flex'
    ].forEach(prop => card.style.removeProperty(prop));
  }

  function resetLegacyKbLayoutV683(grid){
    if(!grid) return;
    LEGACY_LAYOUT_CLASSES_V683.forEach(name => grid.classList.remove(name));
    grid.classList.remove('kb-layout-v683-all','kb-layout-v683-category','kb-layout-v683-polaroid','kb-layout-v683-pending');
    grid.style.removeProperty('height');
    kbCardsV683(grid).forEach(clearCardGeometryV683);
  }

  function bestLaneV683(bottoms, span){
    let bestStart=0, bestY=Infinity;
    for(let start=0; start<=bottoms.length-span; start++){
      let y=0;
      for(let i=start;i<start+span;i++) y=Math.max(y,bottoms[i]);
      if(y<bestY-.5){ bestY=y; bestStart=start; }
    }
    return {start:bestStart,y:bestY};
  }

  function layoutPackedAllV683(grid,cards,width){
    const epoch=++kbLayoutEpochV683;
    const gap=KB_GAP_V683;
    const lanes=Math.max(2,Math.min(9,Math.floor((width+gap)/150)));
    const laneWidth=(width-gap*(lanes-1))/lanes;
    const bottoms=new Array(lanes).fill(0);
    let index=0;
    let maxBottom=0;

    grid.classList.add('kb-layout-v683-all','kb-layout-v683-pending');
    grid.classList.toggle('kb-large-library-v644',cards.length>=KB_LARGE_THRESHOLD_V683);

    // Start each pass from a clean geometry state. This is critical for restored
    // logs because old versions may have left inline absolute/grid measurements.
    cards.forEach(clearCardGeometryV683);

    const run = deadline => {
      if(epoch!==kbLayoutEpochV683 || !grid.isConnected) return;
      const started=performance.now();
      let processed=0;
      while(index<cards.length && processed<KB_CHUNK_V683){
        if(processed && performance.now()-started>8 && !deadline?.didTimeout) break;
        if(processed && typeof deadline?.timeRemaining==='function' && deadline.timeRemaining()<1.2) break;

        const card=cards[index++];
        const isMap=card.classList.contains('has-primary-map-v172');

        card.style.setProperty('position','absolute','important');
        card.style.setProperty('left','-10000px','important');
        card.style.setProperty('top','0','important');
        card.style.setProperty('height','auto','important');
        card.style.setProperty('min-width','0','important');
        card.style.setProperty('visibility','hidden','important');

        let span;
        if(isMap){
          span=Math.max(2,Math.min(lanes,Math.ceil(lanes*.34)));
        }else{
          card.style.setProperty('width','max-content','important');
          card.style.setProperty('max-width',`${Math.min(width,laneWidth*2+gap)}px`,'important');
          const natural=Math.max(laneWidth,Math.ceil(card.getBoundingClientRect().width));
          span=Math.max(1,Math.min(2,Math.ceil((natural+gap)/(laneWidth+gap))));
        }
        span=Math.min(span,lanes);
        const slot=bestLaneV683(bottoms,span);
        const finalWidth=laneWidth*span+gap*(span-1);

        card.style.setProperty('left',`${Math.round(slot.start*(laneWidth+gap))}px`,'important');
        card.style.setProperty('top',`${Math.round(slot.y)}px`,'important');
        card.style.setProperty('width',`${Math.floor(finalWidth)}px`,'important');
        card.style.setProperty('max-width',`${Math.floor(finalWidth)}px`,'important');
        card.style.setProperty('visibility','visible','important');
        card.dataset.kbLayoutPlacedV683='1';

        const h=Math.max(1,Math.ceil(card.getBoundingClientRect().height));
        const bottom=slot.y+h+gap;
        for(let i=slot.start;i<slot.start+span;i++) bottoms[i]=bottom;
        maxBottom=Math.max(maxBottom,bottom-gap);
        processed++;
      }

      grid.style.setProperty('height',`${Math.ceil(maxBottom)}px`,'important');
      if(index<cards.length){
        if('requestIdleCallback' in window) requestIdleCallback(run,{timeout:50});
        else setTimeout(()=>run({timeRemaining:()=>6,didTimeout:true}),0);
        return;
      }

      grid.classList.remove('kb-layout-v683-pending');
      cards.forEach(card=>card.querySelectorAll('img').forEach(img=>{
        if(img.dataset.kbLayoutLoadV683==='1') return;
        img.dataset.kbLayoutLoadV683='1';
        img.addEventListener('load',queueKbLayoutV683,{passive:true});
      }));
    };

    requestAnimationFrame(()=>run({timeRemaining:()=>8,didTimeout:true}));
  }

  function layoutKbV683(){
    kbLayoutRafV683=0;
    const grid=document.getElementById('phrases-library-grid');
    if(!grid) return;

    const cards=kbCardsV683(grid);
    const isPolaroid=(db?.settings?.libraryView==='polaroid') || grid.classList.contains('polaroid-grid-container');
    const isAll=(typeof libraryFilter==='undefined') || String(libraryFilter||'all')==='all';

    // Developer stress preview deliberately owns its own cheap native grid.
    if(grid.classList.contains('kb-developer-fast-grid-v643')){
      resetLegacyKbLayoutV683(grid);
      grid.classList.add('kb-developer-fast-grid-v643');
      return;
    }

    LEGACY_LAYOUT_CLASSES_V683.forEach(name=>grid.classList.remove(name));
    grid.classList.remove('kb-layout-v683-all','kb-layout-v683-category','kb-layout-v683-polaroid','kb-layout-v683-pending');
    grid.style.removeProperty('height');
    cards.forEach(clearCardGeometryV683);

    if(isPolaroid){
      grid.classList.add('kb-layout-v683-polaroid');
      grid.classList.toggle('kb-large-library-v644',cards.length>=KB_LARGE_THRESHOLD_V683);
      return;
    }

    if(!isAll){
      grid.classList.add('kb-layout-v683-category');
      grid.classList.toggle('kb-large-library-v644',cards.length>=KB_LARGE_THRESHOLD_V683);
      return;
    }

    if(!cards.length){
      grid.classList.add('kb-layout-v683-all');
      return;
    }

    const width=Math.max(0,grid.clientWidth);
    if(width<40){ queueKbLayoutV683(); return; }
    layoutPackedAllV683(grid,cards,width);
  }

  function queueKbLayoutV683(){
    if(kbLayoutRafV683) cancelAnimationFrame(kbLayoutRafV683);
    kbLayoutRafV683=requestAnimationFrame(()=>requestAnimationFrame(layoutKbV683));
  }

  try{
    const before=renderPhrasesLibrary;
    renderPhrasesLibrary=function(){
      const grid=document.getElementById('phrases-library-grid');
      if(grid) grid.classList.add('kb-layout-v683-pending');
      const result=before.apply(this,arguments);
      queueKbLayoutV683();
      return result;
    };
    window.renderPhrasesLibrary=renderPhrasesLibrary;
  }catch{}

  window.addEventListener('resize',queueKbLayoutV683,{passive:true});
  document.addEventListener('kb-preview-batch-v620',queueKbLayoutV683);
  document.addEventListener('kb-preview-complete-v643',queueKbLayoutV683);
  document.addEventListener('click',event=>{
    if(event.target?.closest?.('#library-filter-tabs,.kb-view-btn')) queueKbLayoutV683();
  },true);

  try{
    const grid=document.getElementById('phrases-library-grid');
    if(grid){
      new ResizeObserver(queueKbLayoutV683).observe(grid);
      new MutationObserver(records=>{
        if(records.some(r=>r.type==='childList' || (r.type==='attributes' && r.attributeName==='class'))){
          queueKbLayoutV683();
        }
      }).observe(grid,{childList:true,subtree:true,attributes:true,attributeFilter:['class']});
    }
  }catch{}

  window.__loggyLayoutKnowledgeBaseV683=queueKbLayoutV683;
  queueKbLayoutV683();
})();

// ============================================================================
// V617 — AUTHORITATIVE PINNED-MAP QUIZZES + ZERO-FLASH KB TAG VISIBILITY
// ============================================================================
(() => {
  'use strict';
  if (window.__loggyPinnedQuizV617) return;
  window.__loggyPinnedQuizV617 = true;

  const esc = v => String(v ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const norm = v => String(v ?? '').normalize('NFKC').trim().toLocaleLowerCase().replace(/\s+/g,' ');
  const sessions = new Map();

  function syncHideTagsV617(){
    let hide=false;
    try { hide=!!db?.settings?.knowledgeHideTagsV557; } catch {}
    document.documentElement.classList.toggle('kb-hide-item-tags-v557',hide);
  }
  syncHideTagsV617();
  try {
    const beforeRender=renderPhrasesLibrary;
    renderPhrasesLibrary=function(){ syncHideTagsV617(); return beforeRender.apply(this,arguments); };
    window.renderPhrasesLibrary=renderPhrasesLibrary;
  } catch {}

  function currentId(){
    try { return quizMode==='learn' ? String(learnQueue?.[0]?.id||'') : String(activeQuizDeck?.[activeQuizIndex]||''); }
    catch { return ''; }
  }
  function pinned(id){ try { return window.__loggyPinnedImageV169?.fieldForItem?.(id)||null; } catch { return null; } }
  function pins(p){ return (p?.data?.pins||[]).filter(x=>String(x?.label||'').trim()); }
  function label(pin){ return String(pin?.label||'').trim(); }
  function pinId(pin,index){ return String(pin?.id||index); }
  function setCount(){
    try {
      const total=activeQuizDeck?.length||0;
      const n=quizMode==='learn'?Math.max(1,total-(learnQueue?.length||0)+1):Math.min((activeQuizIndex||0)+1,total);
      const el=document.getElementById('quiz-set-label'); if(el&&total)el.textContent=`${Math.min(n,total)} / ${total}`;
    } catch {}
  }
  function canonicalStage(data,{showAll=false,revealed=null,active='',results=null}={}){
    // V619 fix: previously this always passed labeled:true to the stage
    // renderer, baking EVERY pin's label into the HTML regardless of the
    // reveal state, and relying on a later JS pass to hide the ones that
    // shouldn't be visible yet. That created a "labels already visible on
    // the front" bug. Instead, only bake in the label text for pins that
    // are actually supposed to be shown right now; everything else is
    // truly blank until it's revealed.
    const shown = revealed instanceof Set ? revealed : new Set();
    const rawPins = Array.isArray(data?.pins) ? data.pins : [];
    const filteredData = { ...(data||{}), pins: rawPins.map((pin,index)=>{
      const id = pinId(pin,index);
      const isActive = String(active || '') === id;
      const isShown = showAll || (!isActive && shown.has(id)) || (!isActive && results && results.get?.(id)==='correct');
      return isShown ? pin : { ...pin, label:'' };
    }) };
    return window.__loggyPinnedImageV169?.renderStage?.(filteredData,{
      labeled:true, readonly:true, stageClass:'map-stage-v617', labelClass:'map-label-v617'
    }) || '';
  }
  function decorateStage(root,{showAll=false,revealed=null,active='',results=null}={}){
    const shown=revealed instanceof Set?revealed:new Set();
    root.querySelectorAll('.map-stage-v617').forEach(stage=>{
      stage.querySelectorAll('.kb-map-pin-label-v169').forEach(lbl=>{
        const id=String(lbl.dataset.pinLabelForV170||'');
        const visible=showAll||shown.has(id);
        lbl.style.setProperty('display',visible?'block':'none','important');
        lbl.style.setProperty('visibility',visible?'visible':'hidden','important');
      });
      stage.querySelectorAll('.kb-map-pin-v169').forEach((pin,index)=>{
        const id=String(pin.dataset.pinIdV169||index);
        pin.classList.toggle('map-study-active-v172',id===String(active));
        pin.classList.remove('map-result-correct-v617','map-result-wrong-v617');
        const status=results?.get?.(id);
        if(status==='correct')pin.classList.add('map-result-correct-v617');
        if(status==='wrong')pin.classList.add('map-result-wrong-v617');
      });
      try { window.__alignPinnedOverlayToImageV612?.(stage); } catch {}
      try { window.__layoutPinnedLabelsV170?.(stage); } catch {}
    });
  }
  function queueDecorate(root,opts){
    const run=()=>decorateStage(root,opts);
    run(); requestAnimationFrame(run); setTimeout(run,60);
  }
  function nav(area){
    area.querySelector('[data-map-prev-v617]')?.addEventListener('click',()=>{if(activeQuizIndex>0){activeQuizIndex--;quizCardFlipped=false;currentSlideIndex=0;showQuizCard();}});
    area.querySelector('[data-map-next-v617]')?.addEventListener('click',()=>{activeQuizIndex++;quizCardFlipped=false;currentSlideIndex=0;showQuizCard();});
  }

  function renderFlashcard(area,id,p){
    setCount();
    const ps=pins(p); const whole=p?.data?.testMode!=='parts';
    if(whole){
      if(quizCardFlipped){
        area.innerHTML=`<div class="flashcard-wrap pinned-card-v617"><div class="pinned-map-answer-shell-v617" data-map-flip-back-v617>${canonicalStage(p.data,{showAll:true})}</div><button type="button" class="icon-btn map-reveal-toggle-v619" data-map-flip-back-v617>Hide pin labels</button><div class="flashcard-hint-text">Tap the map or button to hide labels</div><div class="flashcard-nav-container"><button class="flashcard-nav-btn" data-map-prev-v617 ${activeQuizIndex===0?'disabled':''}><i class="ph ph-arrow-left"></i></button><button class="flashcard-nav-btn" data-map-next-v617><i class="ph ph-arrow-right"></i></button></div></div>`;
        queueDecorate(area,{showAll:true});
        area.querySelectorAll('[data-map-flip-back-v617]').forEach(el=>el.addEventListener('click',e=>{if(e.target.closest('.flashcard-nav-btn'))return;quizCardFlipped=false;showQuizCard();}));
      }else{
        area.innerHTML=`<div class="flashcard-wrap pinned-card-v617"><div class="pinned-map-answer-shell-v617" data-map-flip-v617>${canonicalStage(p.data,{})}</div><button type="button" class="icon-btn map-reveal-toggle-v619" data-map-flip-v617>Reveal pin labels</button><div class="flashcard-hint-text">Tap the map or button to reveal the pin labels</div><div class="flashcard-nav-container"><button class="flashcard-nav-btn" data-map-prev-v617 ${activeQuizIndex===0?'disabled':''}><i class="ph ph-arrow-left"></i></button><button class="flashcard-nav-btn" data-map-next-v617><i class="ph ph-arrow-right"></i></button></div></div>`;
        queueDecorate(area,{});
        area.querySelectorAll('[data-map-flip-v617]').forEach(el=>el.addEventListener('click',e=>{if(e.target.closest('.flashcard-nav-btn'))return;quizCardFlipped=true;showQuizCard();}));
      }
      nav(area); return;
    }
    // Part-by-part testing: cycle one pin at a time so map items with
    // "test by parts" enabled are actually testable pin-by-pin here too,
    // not just in Learn mode.
    if(!ps.length)return renderFlashcardNoPinsV619(area);
    const s=session(id,p);
    s.index=Math.max(0,Math.min(s.index,ps.length-1));
    const pin=ps[s.index]; const pid=pinId(pin,s.index);
    if(quizCardFlipped){
      area.innerHTML=`<div class="flashcard-wrap pinned-card-v617"><div class="pinned-map-answer-shell-v617" data-map-flip-back-v617>${canonicalStage(p.data,{active:pid,revealed:new Set([pid])})}</div><button type="button" class="icon-btn map-reveal-toggle-v619" data-map-flip-back-v617>Hide this label</button><div class="flashcard-hint-text">Part ${s.index+1} / ${ps.length} · Tap the map or button to hide</div><div class="flashcard-nav-container"><button class="flashcard-nav-btn" data-map-part-prev-v619 ${s.index===0?'disabled':''}><i class="ph ph-arrow-left"></i></button><button class="flashcard-nav-btn" data-map-part-next-v619 ${s.index>=ps.length-1?'disabled':''}><i class="ph ph-arrow-right"></i></button></div><div class="flashcard-hint-text">Card ${activeQuizIndex+1} / ${activeQuizDeck.length}</div><div class="flashcard-nav-container"><button class="flashcard-nav-btn" data-map-prev-v617 ${activeQuizIndex===0?'disabled':''}><i class="ph ph-caret-left"></i></button><button class="flashcard-nav-btn" data-map-next-v617><i class="ph ph-caret-right"></i></button></div></div>`;
      queueDecorate(area,{active:pid,revealed:new Set([pid])});
      area.querySelectorAll('[data-map-flip-back-v617]').forEach(el=>el.addEventListener('click',e=>{if(e.target.closest('.flashcard-nav-btn'))return;quizCardFlipped=false;showQuizCard();}));
    }else{
      area.innerHTML=`<div class="flashcard-wrap pinned-card-v617"><div class="pinned-map-answer-shell-v617" data-map-flip-v617>${canonicalStage(p.data,{active:pid})}</div><button type="button" class="icon-btn map-reveal-toggle-v619" data-map-flip-v617>Reveal this label</button><div class="flashcard-hint-text">Part ${s.index+1} / ${ps.length} · Tap the highlighted pin's map or button to reveal</div><div class="flashcard-nav-container"><button class="flashcard-nav-btn" data-map-part-prev-v619 ${s.index===0?'disabled':''}><i class="ph ph-arrow-left"></i></button><button class="flashcard-nav-btn" data-map-part-next-v619 ${s.index>=ps.length-1?'disabled':''}><i class="ph ph-arrow-right"></i></button></div><div class="flashcard-hint-text">Card ${activeQuizIndex+1} / ${activeQuizDeck.length}</div><div class="flashcard-nav-container"><button class="flashcard-nav-btn" data-map-prev-v617 ${activeQuizIndex===0?'disabled':''}><i class="ph ph-caret-left"></i></button><button class="flashcard-nav-btn" data-map-next-v617><i class="ph ph-caret-right"></i></button></div></div>`;
      queueDecorate(area,{active:pid});
      area.querySelectorAll('[data-map-flip-v617]').forEach(el=>el.addEventListener('click',e=>{if(e.target.closest('.flashcard-nav-btn'))return;quizCardFlipped=true;showQuizCard();}));
    }
    area.querySelector('[data-map-part-prev-v619]')?.addEventListener('click',()=>{if(s.index>0){s.index--;quizCardFlipped=false;showQuizCard();}});
    area.querySelector('[data-map-part-next-v619]')?.addEventListener('click',()=>{if(s.index<ps.length-1){s.index++;quizCardFlipped=false;showQuizCard();}});
    nav(area);
  }
  function renderFlashcardNoPinsV619(area){
    area.innerHTML=`<div class="flashcard-wrap pinned-card-v617"><div class="pinned-map-answer-shell-v617"><div class="kb-pinned-empty-v169"><i class="ph ph-map-pin"></i><span>This map has no labeled pins yet.</span></div></div></div>`;
  }

  function renderAnki(area,id,p){
    setCount();
    const ps=pins(p); const whole=p?.data?.testMode!=='parts';
    if(whole){
      if(!quizCardFlipped){
        area.innerHTML=`<div class="flashcard-wrap pinned-card-v617"><div class="pinned-map-answer-shell-v617" data-map-flip-v617>${canonicalStage(p.data,{})}</div><button type="button" class="icon-btn map-reveal-toggle-v619" data-map-flip-v617>Reveal pin labels</button><div class="flashcard-hint-text">Tap the map or button to reveal the pin labels</div></div>`;
        queueDecorate(area,{});
        area.querySelectorAll('[data-map-flip-v617]').forEach(el=>el.addEventListener('click',()=>{quizCardFlipped=true;showQuizCard();}));
        return;
      }
      area.innerHTML=`<div class="flashcard-wrap pinned-card-v617"><div class="pinned-map-answer-shell-v617">${canonicalStage(p.data,{showAll:true})}</div><div class="quiz-pinned-anki-actions-v169"><button class="icon-btn still-learning-btn" data-map-again-v617><i class="ph ph-arrow-counter-clockwise"></i> Still Learning</button><button class="icon-btn got-it-btn" data-map-good-v617><i class="ph ph-check"></i> Got It!</button></div></div>`;
      queueDecorate(area,{showAll:true});
      area.querySelector('[data-map-again-v617]')?.addEventListener('click',()=>processAnkiAnswer('Again'));
      area.querySelector('[data-map-good-v617]')?.addEventListener('click',()=>processAnkiAnswer('Good'));
      return;
    }
    if(!ps.length)return renderFlashcardNoPinsV619(area);
    const s=session(id,p);
    s.index=Math.max(0,Math.min(s.index,ps.length-1));
    const pin=ps[s.index]; const pid=pinId(pin,s.index);
    if(!quizCardFlipped){
      area.innerHTML=`<div class="flashcard-wrap pinned-card-v617"><div class="pinned-map-answer-shell-v617" data-map-flip-v617>${canonicalStage(p.data,{active:pid})}</div><button type="button" class="icon-btn map-reveal-toggle-v619" data-map-flip-v617>Reveal this label</button><div class="flashcard-hint-text">Part ${s.index+1} / ${ps.length} · Tap the map or button to reveal</div></div>`;
      queueDecorate(area,{active:pid});
      area.querySelectorAll('[data-map-flip-v617]').forEach(el=>el.addEventListener('click',()=>{quizCardFlipped=true;showQuizCard();}));
      return;
    }
    area.innerHTML=`<div class="flashcard-wrap pinned-card-v617"><div class="pinned-map-answer-shell-v617">${canonicalStage(p.data,{active:pid,revealed:new Set([pid])})}</div><div class="flashcard-hint-text">Part ${s.index+1} / ${ps.length}</div><div class="quiz-pinned-anki-actions-v169"><button class="icon-btn still-learning-btn" data-map-again-v617><i class="ph ph-arrow-counter-clockwise"></i> Still Learning</button><button class="icon-btn got-it-btn" data-map-good-v617><i class="ph ph-check"></i> Got It!</button></div></div>`;
    queueDecorate(area,{active:pid,revealed:new Set([pid])});
    area.querySelector('[data-map-again-v617]')?.addEventListener('click',()=>processAnkiAnswerForPin(id,'Again'));
    area.querySelector('[data-map-good-v617]')?.addEventListener('click',()=>processAnkiAnswerForPin(id,'Good'));
  }
  // Cycle through each pin before scoring the card in Anki mode; only once
  // every part has been rated does the underlying SRS card advance. Any
  // "Still Learning" rating on any part marks the whole card for review.
  function processAnkiAnswerForPin(id,rating){
    try {
      if(rating==='Again') window.__loggyMapAnkiHadWrongV619 = true;
      const p=pinned(id); const ps=pins(p); const s=session(id,p);
      if(s.index<ps.length-1){
        s.index++; quizCardFlipped=false; showQuizCard(); return;
      }
      const finalRating = window.__loggyMapAnkiHadWrongV619 ? 'Again' : rating;
      window.__loggyMapAnkiHadWrongV619 = false;
      sessions.delete(s.key);
      processAnkiAnswer(finalRating);
    } catch { processAnkiAnswer(rating); }
  }

  function otherLabels(itemId,p){
    const cat=String(db?.phrase_meta?.[itemId]?.type||''); const out=[];
    for(const candidate of Object.keys(db?.phrase_meta||{})){
      if(candidate===itemId||String(db.phrase_meta?.[candidate]?.type||'')!==cat)continue;
      const cp=pinned(candidate); if(!cp)continue; pins(cp).forEach(x=>out.push(label(x)));
    }
    pins(p).forEach(x=>out.push(label(x)));
    return [...new Set(out.filter(Boolean))];
  }
  function questionType(id){
    try { const t=chooseQuizletLearnQuestionTypeV476?.(db?.phrase_meta?.[id]||{}); return t==='written'?'written':'mc'; }
    catch { return 'mc'; }
  }
  function session(id,p){
    const key=`v617:${id}:${p?.field?.id||p?.field?.name||'map'}`;
    let s=sessions.get(key);
    if(!s){s={key,type:questionType(id),index:0,active:'',revealed:new Set(),results:new Map(),hadWrong:false,ready:false};sessions.set(key,s)}
    return s;
  }
  function finishLearn(s,correct=!s.hadWrong){ sessions.delete(s.key); processLearnAnswer(correct); }
  function activePin(p,s){
    const ps=pins(p); const whole=p?.data?.testMode!=='parts';
    if(whole){ return ps.find((x,i)=>pinId(x,i)===s.active)||null; }
    s.index=Math.max(0,Math.min(s.index,ps.length-1)); return ps[s.index]||null;
  }
  function advanceLearn(area,id,p,s,renderer){
    const ps=pins(p),whole=p?.data?.testMode!=='parts'; s.ready=false;
    if(whole){ s.active=''; if(s.results.size>=ps.length)return finishLearn(s); renderer(area,id,p,s); return; }
    if(s.index>=ps.length-1)return finishLearn(s); s.index++; renderer(area,id,p,s);
  }
  function chooseWholePin(area,id,p,s,renderer){
    area.querySelectorAll('.map-stage-v617 .kb-map-pin-v169').forEach((btn,index)=>btn.addEventListener('click',()=>{
      const pid=String(btn.dataset.pinIdV169||index); if(s.results.has(pid))return; s.active=pid; renderer(area,id,p,s);
    }));
  }
  function baseLearnShell(area,p,s,inner,opts){
    const topCounter=document.getElementById('quiz-set-label');
    if(topCounter) topCounter.textContent='';
    area.innerHTML=`<div class="map-study-wrap-v172 map-learn-v617"><div class="map-study-card-v172">${inner}</div></div>`;
    queueDecorate(area,opts);
  }
  function renderLearnMc(area,id,p,s){
    setCount(); const ps=pins(p); if(!ps.length)return finishLearn(s,true); const whole=p.data.testMode!=='parts';
    if(whole&&!s.active){
      if(s.results.size>=ps.length)return finishLearn(s);
      baseLearnShell(area,p,s,`<div class="map-study-prompt-v172"><strong>Multiple Choice · Whole image</strong><span>${s.results.size} / ${ps.length}</span></div>${canonicalStage(p.data,{revealed:s.revealed,results:s.results})}<div class="map-learn-feedback-v617"><strong>Click any unanswered pin to test it.</strong></div>`,{revealed:s.revealed,results:s.results});
      chooseWholePin(area,id,p,s,renderLearnMc); return;
    }
    const pin=activePin(p,s); if(!pin){s.active='';return renderLearnMc(area,id,p,s)}
    const index=ps.indexOf(pin),pid=pinId(pin,index),answer=label(pin);
    const pool=otherLabels(id,p).filter(x=>norm(x)!==norm(answer)).sort(()=>Math.random()-.5); const choices=[answer];
    for(const x of pool){if(choices.length>=4)break;if(!choices.some(y=>norm(y)===norm(x)))choices.push(x)} choices.sort(()=>Math.random()-.5);
    baseLearnShell(area,p,s,`<div class="map-study-prompt-v172"><strong>Which label fits the highlighted pin?</strong><span>${whole?s.results.size+1:s.index+1} / ${ps.length}</span></div>${canonicalStage(p.data,{active:pid,revealed:s.revealed,results:s.results})}<div class="quiz-learn-options-v38 map-learn-options-v617">${choices.map(c=>`<button class="icon-btn" data-choice-v617="${esc(c)}">${esc(c)}</button>`).join('')}</div><div class="map-learn-feedback-v617" aria-live="polite"></div>`,{active:pid,revealed:s.revealed,results:s.results});
    area.querySelectorAll('[data-choice-v617]').forEach(btn=>btn.addEventListener('click',()=>{
      if(s.ready)return;
      const ok=norm(btn.dataset.choiceV617)===norm(answer);
      if(!ok)s.hadWrong=true;
      s.results.set(pid,ok?'correct':'wrong');
      s.revealed.add(pid);
      s.ready=true;
      area.querySelectorAll('[data-choice-v617]').forEach(choice=>{ choice.disabled=true; choice.setAttribute('aria-disabled','true'); });
      const fb=area.querySelector('.map-learn-feedback-v617');
      if(fb)fb.innerHTML=`<strong>${ok?'Correct':'Incorrect'}</strong><button type="button" class="icon-btn" data-next-v617>${(whole?s.results.size>=ps.length:s.index>=ps.length-1)?'Finish Round':'Next'}</button>`;
      queueDecorate(area,{active:pid,revealed:s.revealed,results:s.results});
      area.querySelector('[data-next-v617]')?.addEventListener('click',()=>advanceLearn(area,id,p,s,renderLearnMc),{once:true});
    }));
  }
  function renderLearnWritten(area,id,p,s){
    setCount(); const ps=pins(p); if(!ps.length)return finishLearn(s,true); const whole=p.data.testMode!=='parts';
    if(whole&&!s.active){
      if(s.results.size>=ps.length)return finishLearn(s);
      baseLearnShell(area,p,s,`<div class="map-study-prompt-v172"><strong>Written · Whole image</strong><span>${s.results.size} / ${ps.length}</span></div>${canonicalStage(p.data,{revealed:s.revealed,results:s.results})}<div class="map-learn-feedback-v617"><strong>Click any unanswered pin to test it.</strong></div>`,{revealed:s.revealed,results:s.results});
      chooseWholePin(area,id,p,s,renderLearnWritten); return;
    }
    const pin=activePin(p,s); if(!pin){s.active='';return renderLearnWritten(area,id,p,s)}
    const index=ps.indexOf(pin),pid=pinId(pin,index),answer=label(pin);
    baseLearnShell(area,p,s,`<div class="map-study-prompt-v172"><strong>Type the label for the highlighted pin</strong><span>${whole?s.results.size+1:s.index+1} / ${ps.length}</span></div>${canonicalStage(p.data,{active:pid,revealed:s.revealed,results:s.results})}<form class="map-study-answer-v172 map-written-v617"><div><input type="text" autocomplete="off" spellcheck="false" placeholder="Type the pin label…"><button type="submit" class="icon-btn">Check Answer</button></div><small aria-live="polite">Capitalization does not matter.</small></form>`,{active:pid,revealed:s.revealed,results:s.results});
    const form=area.querySelector('.map-written-v617'),input=form?.querySelector('input'),small=form?.querySelector('small');
    form?.addEventListener('submit',e=>{
      e.preventDefault(); if(s.ready)return advanceLearn(area,id,p,s,renderLearnWritten); if(!input?.value.trim())return;
      const ok=norm(input.value)===norm(answer); if(!ok){s.hadWrong=true;s.results.set(pid,'wrong');s.revealed.add(pid);if(small)small.innerHTML='<strong>Incorrect</strong> · Type the correct label to continue.';input.value='';queueDecorate(area,{active:pid,revealed:s.revealed,results:s.results});input.focus();return;}
      if(!s.results.has(pid)||s.results.get(pid)!=='wrong')s.results.set(pid,'correct'); s.revealed.add(pid); s.ready=true; input.disabled=true;
      const button=form.querySelector('button'); if(button)button.textContent=(whole?s.results.size>=ps.length:s.index>=ps.length-1)?'Finish Round':'Next'; if(small)small.innerHTML='<strong>Correct</strong>'; queueDecorate(area,{active:pid,revealed:s.revealed,results:s.results});
    }); requestAnimationFrame(()=>input?.focus({preventScroll:true}));
  }

  try {
    const previous=window.showQuizCard||showQuizCard;
    const owner=function(){
      const area=document.getElementById('quiz-flashcard-area'),id=currentId(),p=id?pinned(id):null;
      if(!area||!p?.data?.image||!pins(p).length||!['flashcards','anki','learn'].includes(String(quizMode)))return previous.apply(this,arguments);
      if(quizMode==='flashcards')return renderFlashcard(area,id,p);
      if(quizMode==='anki')return renderAnki(area,id,p);
      const s=session(id,p); return s.type==='written'?renderLearnWritten(area,id,p,s):renderLearnMc(area,id,p,s);
    };
    owner.__pinnedMapV617=true; window.showQuizCard=owner; try{showQuizCard=owner}catch{}
  } catch {}
})();

// ============================================================================
// V621 — MAP QUIZ MODEL: WHOLE CONTEXT vs ONE-PIN PARTS
// ============================================================================
(() => {
  'use strict';
  if (window.__loggyPinnedQuizV621) return;
  window.__loggyPinnedQuizV621 = true;

  const esc = value => String(value ?? '').replace(/[&<>"']/g, char => ({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
  }[char]));
  const norm = value => String(value ?? '').normalize('NFKC').trim().toLocaleLowerCase().replace(/\s+/g,' ');
  const stateByKey = new Map();
  let runSerial = 1;
  let learnRoundSerial = 0;

  document.addEventListener('click', event => {
    if (!event.target?.closest?.('#start-quiz-btn')) return;
    runSerial += 1;
    learnRoundSerial = 0;
    stateByKey.clear();
  }, true);

  function currentIdV621() {
    try {
      return String(quizMode === 'learn' ? (learnQueue?.[0]?.id || '') : (activeQuizDeck?.[activeQuizIndex] || ''));
    } catch { return ''; }
  }
  function pinnedV621(id) {
    try { return window.__loggyPinnedImageV169?.fieldForItem?.(id) || null; }
    catch { return null; }
  }
  function labeledPinsV621(pinned) {
    return (Array.isArray(pinned?.data?.pins) ? pinned.data.pins : []).filter(pin => String(pin?.label || '').trim());
  }
  function pinIdV621(pin, index) {
    const raw = String(pin?.id ?? '').trim();
    return raw || String(index);
  }
  function pinLabelV621(pin) { return String(pin?.label || '').trim(); }
  function isPartsV621(pinned) { return String(pinned?.data?.testMode || '').toLowerCase() === 'parts'; }
  function fieldKeyV621(pinned) { return String(pinned?.field?.id || pinned?.field?.name || 'map'); }

  function stateV621(mode, id, pinned) {
    const key = `${runSerial}:${mode}:${id}:${fieldKeyV621(pinned)}`;
    let state = stateByKey.get(key);
    if (!state) {
      state = {
        key,
        index:0,
        revealed:false,
        hadWrong:false,
        ready:false,
        completed:new Set(),
        learnRound:++learnRoundSerial
      };
      stateByKey.set(key, state);
    }
    return state;
  }
  function dropStateV621(state) { if (state?.key) stateByKey.delete(state.key); }

  function visibleStageDataV621(pinned, { partIndex = null, revealed = null } = {}) {
    const sourcePins = labeledPinsV621(pinned);
    const reveal = revealed instanceof Set ? revealed : new Set();
    const indexed = sourcePins.map((pin, index) => ({ pin, index, id:pinIdV621(pin,index) }));
    const chosen = Number.isInteger(partIndex) ? indexed.filter(row => row.index === partIndex) : indexed;
    return {
      ...(pinned?.data || {}),
      pins: chosen.map(row => ({
        ...row.pin,
        id: row.id,
        label: reveal.has(row.id) ? pinLabelV621(row.pin) : ''
      }))
    };
  }

  function stageHtmlV621(pinned, options = {}) {
    const data = visibleStageDataV621(pinned, options);
    return window.__loggyPinnedImageV169?.renderStage?.(data, {
      labeled:true,
      readonly:true,
      stageClass:'map-stage-v621',
      labelClass:'map-label-v621'
    }) || '';
  }

  function decorateStagesV621(root, { active = '', status = '' } = {}) {
    root?.querySelectorAll?.('.map-stage-v621').forEach(stage => {
      stage.querySelectorAll('.kb-map-pin-v169').forEach((node, index) => {
        const id = String(node.dataset.pinIdV169 || index);
        node.classList.toggle('map-target-v621', !!active && id === String(active));
        node.classList.toggle('map-answer-correct-v621', !!status && status === 'correct' && id === String(active));
        node.classList.toggle('map-answer-wrong-v621', !!status && status === 'wrong' && id === String(active));
      });
      try { window.__alignPinnedOverlayToImageV612?.(stage); } catch {}
      try { window.__layoutPinnedLabelsV170?.(stage); } catch {}
    });
  }
  function queueDecorateV621(root, options = {}) {
    const run = () => decorateStagesV621(root, options);
    run();
    requestAnimationFrame(run);
    setTimeout(run, 60);
  }

  function allPinIdsV621(pinned) {
    return new Set(labeledPinsV621(pinned).map((pin,index) => pinIdV621(pin,index)));
  }
  function revealForV621(pinned, state, includeCurrent = false) {
    const reveal = new Set(state?.completed || []);
    const pins = labeledPinsV621(pinned);
    if (includeCurrent && pins[state.index]) reveal.add(pinIdV621(pins[state.index],state.index));
    return reveal;
  }

  function setNormalCounterV621() {
    try {
      const total = activeQuizDeck?.length || 0;
      const el = document.getElementById('quiz-set-label');
      if (el && total) el.textContent = `${Math.min((activeQuizIndex || 0) + 1,total)} / ${total}`;
    } catch {}
  }
  function hideLearnTopCounterV621() {
    const el = document.getElementById('quiz-set-label');
    if (el) el.textContent = '';
  }
  function goCardV621(delta) {
    activeQuizIndex = Math.max(0, (activeQuizIndex || 0) + delta);
    quizCardFlipped = false;
    currentSlideIndex = 0;
    showQuizCard();
  }

  // ------------------------------------------------------------------------
  // FLASHCARDS
  // Whole image: all pins, tap image to reveal/hide every label.
  // Parts: same source image, exactly one pin at a time, tap to reveal it.
  // ------------------------------------------------------------------------
  function renderFlashcardsV621(area, id, pinned) {
    setNormalCounterV621();
    const quizLearnViewV655=document.getElementById('quiz-learn-view');
    if(quizLearnViewV655)quizLearnViewV655.dataset.quizModeV655='flashcards';
    const pins = labeledPinsV621(pinned);
    if (!pins.length) return;
    const parts = isPartsV621(pinned);
    const state = stateV621('flashcards',id,pinned);
    state.index = Math.max(0, Math.min(state.index,pins.length-1));
    const current = pins[state.index];
    const pid = pinIdV621(current,state.index);
    const reveal = state.revealed
      ? (parts ? new Set([pid]) : allPinIdsV621(pinned))
      : new Set();
    const partIndex = parts ? state.index : null;
    const partLine = parts ? `<div class="map-v621-subline">Part ${state.index+1} / ${pins.length}</div>` : '';
    area.innerHTML = `
      <div class="flashcard-wrap map-card-v621">
        <div class="quiz-inline-counter-v655">${Math.min((activeQuizIndex||0)+1, activeQuizDeck?.length||0)} / ${activeQuizDeck?.length||0}</div>
        <div class="map-v621-stage-shell" data-map-toggle-v621>
          ${stageHtmlV621(pinned,{partIndex,revealed:reveal})}
        </div>
        <div class="flashcard-hint-text">${state.revealed ? 'Tap the image to hide the label' + (parts?'':'s') : 'Tap the image to reveal the label' + (parts?'':'s')}</div>
        ${partLine}
        ${parts ? `<div class="flashcard-nav-container map-v621-part-nav">
          <button class="flashcard-nav-btn" data-part-prev-v621 ${state.index===0?'disabled':''}><i class="ph ph-arrow-left"></i></button>
          <button class="flashcard-nav-btn" data-part-next-v621 ${state.index>=pins.length-1?'disabled':''}><i class="ph ph-arrow-right"></i></button>
        </div>` : ''}
        <div class="flashcard-nav-container">
          <button class="flashcard-nav-btn" data-card-prev-v621 ${activeQuizIndex===0?'disabled':''}><i class="ph ph-caret-left"></i></button>
          <button class="flashcard-nav-btn" data-card-next-v621><i class="ph ph-caret-right"></i></button>
        </div>
      </div>`;
    queueDecorateV621(area,{});
    area.querySelector('[data-map-toggle-v621]')?.addEventListener('click',()=>{ state.revealed=!state.revealed; renderFlashcardsV621(area,id,pinned); });
    area.querySelector('[data-part-prev-v621]')?.addEventListener('click',()=>{ if(state.index>0){state.index--;state.revealed=false;renderFlashcardsV621(area,id,pinned);} });
    area.querySelector('[data-part-next-v621]')?.addEventListener('click',()=>{ if(state.index<pins.length-1){state.index++;state.revealed=false;renderFlashcardsV621(area,id,pinned);} });
    area.querySelector('[data-card-prev-v621]')?.addEventListener('click',()=>goCardV621(-1));
    area.querySelector('[data-card-next-v621]')?.addEventListener('click',()=>goCardV621(1));
  }

  // ------------------------------------------------------------------------
  // ANKI
  // Whole image: tap image to reveal all labels, then rate the map.
  // Parts: one pin per image. No Reveal button; tapping the image flips it.
  // Every part is rated before the underlying SRS card advances.
  // ------------------------------------------------------------------------
  function renderAnkiV621(area,id,pinned) {
    setNormalCounterV621();
    const pins=labeledPinsV621(pinned);
    if(!pins.length)return;
    const parts=isPartsV621(pinned);
    const state=stateV621('anki',id,pinned);
    state.index=Math.max(0,Math.min(state.index,pins.length-1));
    const current=pins[state.index];
    const pid=pinIdV621(current,state.index);
    const reveal = state.revealed ? (parts?new Set([pid]):allPinIdsV621(pinned)) : new Set();
    const partIndex=parts?state.index:null;
    area.innerHTML=`
      <div class="flashcard-wrap map-card-v621 map-anki-v621">
        <div class="map-v621-stage-shell ${state.revealed?'is-revealed-v621':''}" data-map-anki-toggle-v669>
          ${stageHtmlV621(pinned,{partIndex,revealed:reveal})}
        </div>
        <div class="flashcard-hint-text">${state.revealed ? (parts?`Part ${state.index+1} / ${pins.length}`:'Labels revealed') : (parts?`Part ${state.index+1} / ${pins.length} · Tap the image to reveal`:'Tap the image to reveal all labels')}</div>
        ${state.revealed ? `<div class="quiz-pinned-anki-actions-v169 map-anki-actions-v621">
          <button class="icon-btn still-learning-btn" data-anki-again-v621><i class="ph ph-arrow-counter-clockwise"></i> Still Learning</button>
          <button class="icon-btn got-it-btn" data-anki-good-v621><i class="ph ph-check"></i> Got It!</button>
        </div>` : ''}
      </div>`;
    queueDecorateV621(area,{});
    area.querySelector('[data-map-anki-toggle-v669]')?.addEventListener('click',(e)=>{
      if(e.target.closest('button,input,textarea,select,a,video,audio,iframe,.audio-play-btn'))return;
      state.revealed=!state.revealed;
      renderAnkiV621(area,id,pinned);
    });
    const rate = rating => {
      if(!parts){ dropStateV621(state); processAnkiAnswer(rating); return; }
      if(rating==='Again') state.hadWrong=true;
      if(state.index<pins.length-1){ state.index++; state.revealed=false; renderAnkiV621(area,id,pinned); return; }
      const finalRating=state.hadWrong?'Again':'Good';
      dropStateV621(state);
      processAnkiAnswer(finalRating);
    };
    area.querySelector('[data-anki-again-v621]')?.addEventListener('click',()=>rate('Again'));
    area.querySelector('[data-anki-good-v621]')?.addEventListener('click',()=>rate('Good'));
  }

  function choicePoolV621(itemId,pinned,answer) {
    const category=String(db?.phrase_meta?.[itemId]?.type||'');
    const values=[];
    const add=value=>{const clean=String(value||'').trim();if(clean&&norm(clean)!==norm(answer)&&!values.some(v=>norm(v)===norm(clean)))values.push(clean);};
    labeledPinsV621(pinned).forEach(pin=>add(pinLabelV621(pin)));
    for(const candidate of Object.keys(db?.phrase_meta||{})){
      if(candidate===itemId)continue;
      if(category&&String(db.phrase_meta?.[candidate]?.type||'')!==category)continue;
      const other=pinnedV621(candidate); if(!other)continue;
      labeledPinsV621(other).forEach(pin=>add(pinLabelV621(pin)));
    }
    for(let i=values.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[values[i],values[j]]=[values[j],values[i]];}
    return values;
  }
  function learnQuestionTypeV621(state) {
    try { syncQuizletLearnModesV476?.(); } catch {}
    let wantsMc=true,wantsWritten=false;
    try {
      wantsMc=quizletLearnModesV476.has('mc');
      wantsWritten=quizletLearnModesV476.has('written');
    } catch {}
    if(wantsWritten&&!wantsMc)return 'written';
    if(wantsMc&&!wantsWritten)return 'mc';
    if(wantsWritten&&wantsMc)return ((state.learnRound+state.index)%2===0)?'mc':'written';
    return 'mc';
  }
  function learnProgressV621(state,pins) {
    let learned=0,total=0;
    try { learned=Math.min(activeQuizIndex||0,activeQuizDeck?.length||0);total=activeQuizDeck?.length||0; } catch {}
    return `<span class="map-v621-progress">Pin ${state.index+1} / ${pins.length}${total?` · Learned ${learned} / ${total}`:''}</span>`;
  }
  function finishLearnRoundV621(state) {
    const correctRound=!state.hadWrong;
    dropStateV621(state);
    processLearnAnswer(correctRound);
  }
  function continueLearnV621(area,id,pinned,state) {
    const pins=labeledPinsV621(pinned);
    state.ready=false;
    if(state.index>=pins.length-1){ finishLearnRoundV621(state); return; }
    state.index++;
    renderLearnV621(area,id,pinned,state);
  }
  function learnStageOptionsV621(pinned,state,revealCurrent=false) {
    const pins=labeledPinsV621(pinned);
    const current=pins[state.index];
    const pid=pinIdV621(current,state.index);
    const parts=isPartsV621(pinned);
    const revealed=revealForV621(pinned,state,revealCurrent);
    return {pid,parts,revealed,partIndex:parts?state.index:null};
  }
  function learnShellV621(area,html,stageOptions={}) {
    hideLearnTopCounterV621();
    area.innerHTML=`<div class="map-learn-v621"><div class="map-study-card-v172 map-learn-card-v621">${html}</div></div>`;
    queueDecorateV621(area,stageOptions);
  }

  function renderLearnMcV621(area,id,pinned,state) {
    const pins=labeledPinsV621(pinned);
    if(!pins.length){dropStateV621(state);processLearnAnswer(true);return;}
    state.index=Math.max(0,Math.min(state.index,pins.length-1));
    const pin=pins[state.index];
    const answer=pinLabelV621(pin);
    const {pid,parts,revealed,partIndex}=learnStageOptionsV621(pinned,state,false);
    const prompt=parts?'Which label belongs to this pin?':'Which label fits the highlighted pin?';
    const pool=choicePoolV621(id,pinned,answer);
    const choices=[answer];
    for(const value of pool){if(choices.length>=4)break;if(!choices.some(c=>norm(c)===norm(value)))choices.push(value);}
    for(let i=choices.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[choices[i],choices[j]]=[choices[j],choices[i]];}
    learnShellV621(area,`
      <div class="map-study-prompt-v172 map-v621-prompt"><strong>${prompt}</strong>${learnProgressV621(state,pins)}</div>
      <div class="map-v621-stage-shell">${stageHtmlV621(pinned,{partIndex,revealed})}</div>
      <div class="quiz-learn-options-v38 map-learn-options-v621">
        ${choices.map(choice=>`<button type="button" class="icon-btn" data-map-choice-v621="${esc(choice)}">${esc(choice)}</button>`).join('')}
        <button type="button" class="icon-btn map-mc-idk-v672" data-map-mc-idk-v672>Idk</button>
      </div>
      <div class="map-learn-feedback-v621" aria-live="polite"></div>`,{active:parts?'':pid});

    const finishMapMcV672=(button=null,fromIdk=false)=>{
      if(state.ready)return;
      const picked=String(button?.dataset?.mapChoiceV621||'');
      const correct=!fromIdk&&norm(picked)===norm(answer);
      if(!correct)state.hadWrong=true;
      state.completed.add(pid);
      state.ready=true;
      area.querySelectorAll('[data-map-choice-v621]').forEach(choice=>{
        choice.disabled=true;
        const value=String(choice.dataset.mapChoiceV621||'');
        choice.classList.toggle('map-choice-correct-v621',norm(value)===norm(answer));
        choice.classList.toggle('map-choice-wrong-v621',!!button&&choice===button&&!correct);
      });
      const idk=area.querySelector('[data-map-mc-idk-v672]');
      if(idk)idk.disabled=true;
      // Reveal this pin only AFTER an answer. In parts mode it is still the only
      // pin on the image; in whole mode the target was visibly highlighted first.
      const shell=area.querySelector('.map-v621-stage-shell');
      if(shell) shell.innerHTML=stageHtmlV621(pinned,{partIndex,revealed:revealForV621(pinned,state,true)});
      queueDecorateV621(area,{active:parts?'':pid,status:correct?'correct':'wrong'});
      const feedback=area.querySelector('.map-learn-feedback-v621');
      if(feedback)feedback.innerHTML=`<strong>${correct?'Correct':fromIdk?`Answer revealed · Correct answer: ${esc(answer)}`:'Incorrect'}</strong><button type="button" class="icon-btn" data-map-learn-next-v621>Continue Learning</button>`;
      area.querySelector('[data-map-learn-next-v621]')?.addEventListener('click',()=>continueLearnV621(area,id,pinned,state),{once:true});
    };
    area.querySelectorAll('[data-map-choice-v621]').forEach(button=>button.addEventListener('click',()=>finishMapMcV672(button,false)));
    area.querySelector('[data-map-mc-idk-v672]')?.addEventListener('click',()=>finishMapMcV672(null,true));
  }

  function renderLearnWrittenV621(area,id,pinned,state) {
    const pins=labeledPinsV621(pinned);
    if(!pins.length){dropStateV621(state);processLearnAnswer(true);return;}
    state.index=Math.max(0,Math.min(state.index,pins.length-1));
    const pin=pins[state.index];
    const answer=pinLabelV621(pin);
    const {pid,parts,revealed,partIndex}=learnStageOptionsV621(pinned,state,false);
    const prompt=parts?'Type the label for this pin':'Type the label for the highlighted pin';
    learnShellV621(area,`
      <div class="map-study-prompt-v172 map-v621-prompt"><strong>${prompt}</strong>${learnProgressV621(state,pins)}</div>
      <div class="map-v621-stage-shell">${stageHtmlV621(pinned,{partIndex,revealed})}</div>
      <form class="map-written-v621">
        <div class="map-written-row-v621"><input type="text" autocomplete="off" spellcheck="false" placeholder="Type the pin label…"><button type="button" class="icon-btn map-written-idk-v654" data-map-written-idk-v654>Idk</button><button type="submit" class="icon-btn" data-map-written-submit-v654>Check Answer</button></div>
        <small aria-live="polite">Capitalization does not matter.</small>
      </form>`,{active:parts?'':pid});
    const form=area.querySelector('.map-written-v621');
    const input=form?.querySelector('input');
    const note=form?.querySelector('small');
    const button=form?.querySelector('[data-map-written-submit-v654]');
    const idk=form?.querySelector('[data-map-written-idk-v654]');
    const revealCorrection=(fromIdk=false)=>{
      state.hadWrong=true;
      if(note)note.innerHTML=`<strong>${fromIdk?'Answer revealed':'Incorrect'}</strong> · Correct answer: <strong>${esc(answer)}</strong>. Type it to continue.`;
      const shell=area.querySelector('.map-v621-stage-shell');
      if(shell)shell.innerHTML=stageHtmlV621(pinned,{partIndex,revealed:revealForV621(pinned,state,true)});
      queueDecorateV621(area,{active:parts?'':pid,status:'wrong'});
      if(button)button.textContent='Check Again';
      if(idk)idk.disabled=true;
      input.disabled=false;
      input.value='';
      requestAnimationFrame(()=>input?.focus({preventScroll:true}));
    };
    idk?.addEventListener('click',()=>{ if(!state.ready)revealCorrection(true); });
    form?.addEventListener('submit',event=>{
      event.preventDefault();
      if(state.ready){continueLearnV621(area,id,pinned,state);return;}
      if(!input?.value.trim())return;
      const correct=norm(input.value)===norm(answer);
      if(!correct){ revealCorrection(false); return; }
      state.completed.add(pid);
      state.ready=true;
      input.disabled=true;
      if(idk)idk.disabled=true;
      if(button)button.textContent='Continue Learning';
      if(note)note.innerHTML='<strong>Correct</strong>';
      const shell=area.querySelector('.map-v621-stage-shell');
      if(shell)shell.innerHTML=stageHtmlV621(pinned,{partIndex,revealed:revealForV621(pinned,state,true)});
      queueDecorateV621(area,{active:parts?'':pid,status:'correct'});
    });
    requestAnimationFrame(()=>input?.focus({preventScroll:true}));
  }

  function renderLearnV621(area,id,pinned,state) {
    hideLearnTopCounterV621();
    const quizLearnViewV655=document.getElementById('quiz-learn-view');
    if(quizLearnViewV655)quizLearnViewV655.dataset.quizModeV655='learn';
    const type=learnQuestionTypeV621(state);
    if(type==='written')renderLearnWrittenV621(area,id,pinned,state);
    else renderLearnMcV621(area,id,pinned,state);
  }

  try {
    const previous=window.showQuizCard || showQuizCard;
    const owner=function(){
      const area=document.getElementById('quiz-flashcard-area');
      const id=currentIdV621();
      const pinned=id?pinnedV621(id):null;
      const pins=pinned?labeledPinsV621(pinned):[];
      const mode=String(typeof quizMode!=='undefined'?quizMode:'');
      if(!area||!pinned?.data?.image||!pins.length||!['flashcards','anki','learn'].includes(mode))return previous.apply(this,arguments);
      if(mode==='flashcards')return renderFlashcardsV621(area,id,pinned);
      if(mode==='anki')return renderAnkiV621(area,id,pinned);
      const state=stateV621('learn',id,pinned);
      return renderLearnV621(area,id,pinned,state);
    };
    owner.__pinnedMapV621=true;
    window.showQuizCard=owner;
    try { showQuizCard=owner; } catch {}
  } catch {}
})();

// V642: obsolete out-of-scope V623 Lazy Day wrapper removed.


// ============================================================================
// V664 — KB selection actions, Shift+S, Shift+H reliability, bulk-add days
// ============================================================================
(() => {
  'use strict';
  if (window.__loggyKbBulkActionsV664) return;
  window.__loggyKbBulkActionsV664 = true;

  const q = (s, r=document) => r.querySelector(s);
  const qa = (s, r=document) => Array.from(r.querySelectorAll(s));
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

  function existingDaysV664(){
    return Object.keys(db?.days || {})
      .map(Number)
      .filter(Number.isFinite)
      .sort((a,b)=>a-b);
  }

  function selectedKbIdsV664(){
    return [...new Set(
      qa('#phrases-library-grid .kb-selected-v163[data-kb-item-id-v163]')
        .map(card => card.dataset.kbItemIdV163)
        .filter(id => id && (db.phrases || []).includes(id))
    )];
  }

  function addItemsToDaysV664(ids, days){
    ids=[...new Set(ids)].filter(id => (db.phrases || []).includes(id));
    days=[...new Set(days.map(Number))].filter(day => Number.isFinite(day) && db.days?.[day]);
    if(!ids.length || !days.length) return 0;
    let added=0;
    days.forEach(dayNum => {
      const day=db.days[dayNum];
      if(!Array.isArray(day.phrases)) day.phrases=[];
      ids.forEach(id => {
        if(day.phrases.includes(id)) return;
        day.phrases.push(id);
        added++;
      });
    });
    try { saveDb(); } catch {}
    try {
      if(typeof currentDay !== 'undefined' && days.includes(Number(currentDay)) && db.days?.[currentDay]) {
        renderPhrases(db.days[currentDay].phrases || []);
      }
    } catch {}
    return added;
  }

  function ensureAddSelectedToDayModalV664(){
    let modal=q('#kb-add-selected-day-modal-v664');
    if(modal) return modal;
    modal=document.createElement('div');
    modal.id='kb-add-selected-day-modal-v664';
    modal.className='modal-overlay hidden kb-add-selected-day-modal-v664';
    modal.innerHTML=`<div class="modal-box kb-add-selected-day-box-v664">
      <div class="modal-header"><h2>Add to Items Learned</h2><button type="button" class="small-icon-btn kb-add-selected-day-close-v664" aria-label="Close"><i class="ph ph-x"></i></button></div>
      <div class="modal-section"><span class="field-label">Day number</span><input class="kb-add-selected-day-input-v666" type="number" min="1" step="1" inputmode="numeric" placeholder="Enter day number" autocomplete="off"></div>
      <button type="button" class="icon-btn kb-add-selected-day-submit-v664" disabled><i class="ph ph-plus"></i> Add</button>
    </div>`;
    document.body.appendChild(modal);
    const close=()=>modal.classList.add('hidden');
    q('.kb-add-selected-day-close-v664',modal).onclick=close;
    modal.addEventListener('pointerdown',event=>{if(event.target===modal)close()});
    return modal;
  }

  function openAddSelectedToDayV664(ids){
    ids=[...new Set(ids)].filter(id => (db.phrases || []).includes(id));
    if(!ids.length) return;
    const days=existingDaysV664();
    if(!days.length){ try{showFeatureToast?.('Create a Daily Log day first.')}catch{} return; }
    const modal=ensureAddSelectedToDayModalV664();
    const input=q('.kb-add-selected-day-input-v666',modal);
    const submit=q('.kb-add-selected-day-submit-v664',modal);
    const title=q('.modal-header h2',modal);
    if(title) title.textContent=`Add ${ids.length} selected to Items Learned`;
    input.value='';
    modal.dataset.itemIds=JSON.stringify(ids);

    const selectedExistingDay=()=>{
      const raw=String(input.value||'').trim();
      if(!/^\d+$/.test(raw)) return null;
      const day=Number(raw);
      return Number.isInteger(day) && day>0 && db.days?.[day] ? day : null;
    };
    const syncSubmit=()=>{
      const valid=selectedExistingDay()!=null;
      submit.disabled=!valid;
      submit.setAttribute('aria-disabled',valid?'false':'true');
    };
    input.oninput=syncSubmit;
    input.onkeydown=event=>{
      if(event.key==='Enter' && !submit.disabled){ event.preventDefault(); submit.click(); }
    };
    submit.onclick=()=>{
      const day=selectedExistingDay();
      if(day==null) return;
      let itemIds=[]; try{itemIds=JSON.parse(modal.dataset.itemIds||'[]')}catch{}
      const count=addItemsToDaysV664(itemIds,[day]);
      modal.classList.add('hidden');
      try{showFeatureToast?.(count?`Added ${itemIds.length} selected item${itemIds.length===1?'':'s'} to Day ${day}.`:`Those items are already in Day ${day}.`)}catch{}
    };
    syncSubmit();
    modal.classList.remove('hidden');
    requestAnimationFrame(()=>input.focus());
  }

  async function deleteSelectedKbV664(ids){
    ids=[...new Set(ids)].filter(id => (db.phrases || []).includes(id));
    if(!ids.length)return;
    const ok=await showAppConfirm({
      title:ids.length===1?'Delete Knowledge Base Item':'Delete Selected Items',
      message:ids.length===1?`Move “${ids[0]}” to Trash?`:`Move ${ids.length} selected Knowledge Base items to Trash?`,
      confirmLabel:ids.length===1?'Delete':'Delete Selected'
    });
    if(!ok)return;

    // Prevent starter migrations from ever re-seeding deliberately removed built-ins.
    db.settings ||= {};
    db.settings.englishStarterTemplateV451 = db.settings.englishStarterTemplateV451 === true;
    if(db.settings.englishStarterTemplateV451){
      db.settings.englishStarterExamplesV453=true;
      db.settings.englishStarterDay1V462=true;
      db.settings.englishStarterLazyItemsV597=true;
      db.settings.englishStarterMapItemV656=true;
    }

    const trashEntries=[];
    ids.forEach(itemId=>{
      const index=(db.phrases||[]).indexOf(itemId);
      if(index<0)return;
      const meta=JSON.parse(JSON.stringify(db.phrase_meta?.[itemId]||{}));
      const loggedDays=[];
      Object.entries(db.days||{}).forEach(([dayNumber,dayData])=>{
        if(!Array.isArray(dayData?.phrases))return;
        const positions=[];
        dayData.phrases.forEach((value,position)=>{if(String(value)===String(itemId))positions.push(position)});
        if(!positions.length)return;
        loggedDays.push({dayNumber,positions});
        dayData.phrases=dayData.phrases.filter(value=>String(value)!==String(itemId));
      });
      const entry={deletedAt:new Date().toISOString(),originalIndex:index,itemId,meta,loggedDays};
      try{getFeatureTrash().kbItems.unshift(entry)}catch{}
      trashEntries.push(entry);
      db.phrases.splice(index,1);
      delete db.phrase_meta[itemId];
    });
    try{saveDb()}catch{}
    try{renderPhrasesLibrary(q('#phrases-search-bar')?.value||'')}catch{}
    const toggle=q('#kb-select-toggle-v163.selected');
    if(toggle) toggle.click();
    try{
      showFeatureToast?.(`Moved ${trashEntries.length} item${trashEntries.length===1?'':'s'} to Trash.`,'Undo',()=>{
        const trash=getFeatureTrash().kbItems;
        [...trashEntries].reverse().forEach(entry=>{
          const ti=trash.findIndex(x=>x===entry || (x.itemId===entry.itemId && x.deletedAt===entry.deletedAt));
          if(ti>=0)trash.splice(ti,1);
          if(!(db.phrases||[]).includes(entry.itemId)){
            const at=Math.max(0,Math.min(Number(entry.originalIndex)||0,db.phrases.length));
            db.phrases.splice(at,0,entry.itemId);
          }
          db.phrase_meta[entry.itemId]=entry.meta||{};
          (entry.loggedDays||[]).forEach(ref=>{
            const day=db.days?.[ref.dayNumber]; if(!day)return;
            if(!Array.isArray(day.phrases))day.phrases=[];
            if(day.phrases.includes(entry.itemId))return;
            const at=Math.max(0,Math.min(Number(ref.positions?.[0]??day.phrases.length),day.phrases.length));
            day.phrases.splice(at,0,entry.itemId);
          });
        });
        try{saveDb()}catch{}
        try{renderPhrasesLibrary(q('#phrases-search-bar')?.value||'')}catch{}
      });
    }catch{}
  }

  // Own selected-card right click at capture time so older one-action menus cannot replace it.
  document.addEventListener('contextmenu',event=>{
    const card=event.target?.closest?.('#phrases-library-grid .phrase-card,#phrases-library-grid .polaroid-card');
    if(!card || !q('#kb-select-toggle-v163.selected'))return;
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    if(!card.classList.contains('kb-selected-v163')) card.click();
    requestAnimationFrame(()=>{
      const ids=selectedKbIdsV664();
      if(!ids.length)return;
      showCustomItemContextMenu(event.clientX,event.clientY,[
        {label:`Add ${ids.length} selected to Items Learned`,icon:'ph-plus-circle',action:()=>openAddSelectedToDayV664(ids)},
        {label:`Delete ${ids.length} selected`,icon:'ph-trash',danger:true,action:()=>deleteSelectedKbV664(ids)}
      ]);
    });
  },true);

  // Bulk Add Items Learned targets: compact comma-separated day input.
  // The modal owns one validated text field instead of a growing list of day checkboxes.
  document.addEventListener('click',event=>{
    if(event.target?.closest?.('#kb-bulk-add-btn-v162')){
      setTimeout(()=>{
        const modal=q('#kb-bulk-modal-v162');
        if(!modal)return;
        ensureBulkDaysV684(modal);
      },0);
    }
  },true);

  // Snapshot the validated target days before the normal commit closes the modal,
  // then attach only the newly-created KB items to those existing days.
  document.addEventListener('click',event=>{
    const button=event.target?.closest?.('.kb-bulk-commit-v162');
    if(!button)return;
    const modal=button.closest('#kb-bulk-modal-v162');
    if(!modal||!syncBulkDaysV684(modal))return;
    const {days}=parseBulkDaysV684(modal);
    if(!days.length)return;
    const before=new Set(db.phrases||[]);
    setTimeout(()=>{
      const added=(db.phrases||[]).filter(id=>!before.has(id));
      if(!added.length)return;
      addItemsToDaysV664(added,days);
      try{showFeatureToast?.(`Added ${added.length} imported item${added.length===1?'':'s'} to ${days.length===1?`Day ${days[0]}`:`Days ${days.join(', ')}`}.`)}catch{}
    },0);
  },true);

  // Keep the shortcut reference accurate in both Settings surfaces.
  function patchShortcutTextV664(){
    qa('#kb-shortcuts-v467 .global-shortcut-row').forEach(row=>{
      if(/Delete/i.test(row.textContent||'')){
        row.innerHTML='<kbd>Shift</kbd><span>+</span><kbd>S</kbd><p>Enter or exit Knowledge Base multi-select mode.</p>';
      }
    });
  }
  const obs=new MutationObserver(patchShortcutTextV664);
  if(document.body)obs.observe(document.body,{childList:true,subtree:true});
  patchShortcutTextV664();
})();
