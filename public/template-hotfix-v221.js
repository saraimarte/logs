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
                        <button type="button" class="kb-clean-icon-option" data-kind-v221="latex" data-tip="LaTeX / Math" aria-label="LaTeX / Math"><i class="ph ph-function"></i></button>
                        <button type="button" class="kb-clean-icon-option" data-kind-v221="attachment" data-tip="File Attachment" aria-label="File Attachment"><i class="ph ph-paperclip"></i></button>
                        <button type="button" class="kb-clean-icon-option" data-kind-v221="numberFormat" data-tip="Number / Currency / Percent" aria-label="Number / Currency / Percent"><i class="ph ph-currency-dollar"></i></button>
                        <button type="button" class="kb-clean-icon-option" data-kind-v221="dateTime" data-tip="Date & Time / Date Range" aria-label="Date & Time / Date Range"><i class="ph ph-calendar-dots"></i></button>
                        <button type="button" class="kb-clean-icon-option" data-kind-v221="boolean" data-tip="Boolean Toggle" aria-label="Boolean Toggle"><i class="ph ph-toggle-right"></i></button>
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

// ============================================================
// V222 — old-log fallback: custom tab icon context menu = Delete only
// ============================================================
(() => {
    'use strict';
    if (window.__loggyTabContextDeleteOnlyV222) return;
    window.__loggyTabContextDeleteOnlyV222 = true;

    document.addEventListener('contextmenu', event => {
        const button = event.target?.closest?.('.custom-tab-nav-btn[data-custom-tab-id]');
        if (!button) return;
        const tabId = String(button.dataset.customTabId || '');
        if (!tabId) return;

        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();

        const removeTab = async () => {
            let tab = null;
            try { tab = typeof getCustomTab === 'function' ? getCustomTab(tabId) : null; } catch {}
            let confirmed = true;
            try {
                confirmed = typeof showAppConfirm === 'function'
                    ? await showAppConfirm({
                        title: 'Move this tab to Trash?',
                        message: tab?.name
                            ? `“${tab.name}” and everything inside it can be restored later from Trash.`
                            : 'This tab and everything inside it can be restored later from Trash.',
                        confirmLabel: 'Move to Trash'
                    })
                    : false;
            } catch {}
            if (!confirmed) return;

            try { if (typeof moveCustomTabToTrash === 'function') moveCustomTabToTrash(tabId); } catch {}
            try { saveDb(); } catch {}
            document.getElementById(`custom-tab-view-${tabId}`)?.remove();
            try { renderCustomTabNavigation(); } catch {}
            try { activeCustomTabId = null; } catch {}
            try { customTabEditMode = false; } catch {}
            try { switchView(gridView); } catch {}
        };

        try {
            if (typeof showCustomItemContextMenu === 'function') {
                let currentTab = null;
                try { currentTab = typeof getCustomTab === 'function' ? getCustomTab(tabId) : null; } catch {}
                const isSpecialCanvasTab = !!currentTab && (
                    currentTab.templateIdV53 === 'whiteboard-v197' ||
                    currentTab.templateIdV53 === 'notepad-v249' ||
                    (Array.isArray(currentTab.components) && currentTab.components.some(component => component?.type === 'miroWhiteboardV197' || component?.type === 'fullNotepadV249'))
                );
                const items = [];
                if (isSpecialCanvasTab && typeof openCustomTabSettingsModal === 'function') {
                    items.push({
                        label: 'Tab Settings',
                        icon: 'ph-sliders-horizontal',
                        action: () => openCustomTabSettingsModal(tabId)
                    });
                }
                items.push({
                    label: 'Delete tab',
                    icon: 'ph-trash',
                    danger: true,
                    action: removeTab
                });
                showCustomItemContextMenu(event.clientX, event.clientY, items);
            }
        } catch (error) {
            console.error('V249 tab context menu failed', error);
        }
    }, true);
})();


// ============================================================
// V224 — KB nested modal fronting + field-option underline +
//        Daily Items Learned audio contrast + custom KB suggestions
// ============================================================
(() => {
    'use strict';
    if (window.__loggyUiHotfixV224) return;
    window.__loggyUiHotfixV224 = true;

    const PRIMARY_ID_V224 = 'kb-primary-display-modal-v171';
    const PRIMARY_Z_V224 = '2147483646';

    function forcePrimaryFrontV224() {
        const modal = document.getElementById(PRIMARY_ID_V224);
        if (!modal || modal.classList.contains('hidden')) return;

        if (
            modal.style.getPropertyValue('z-index') !== PRIMARY_Z_V224 ||
            modal.style.getPropertyPriority('z-index') !== 'important'
        ) {
            modal.style.setProperty('z-index', PRIMARY_Z_V224, 'important');
        }
        if (modal.style.getPropertyValue('position') !== 'fixed') {
            modal.style.setProperty('position', 'fixed', 'important');
        }
        const box = modal.querySelector('.kb-primary-display-box-v171,.modal-box');
        if (box) {
            if (box.style.getPropertyValue('position') !== 'relative') {
                box.style.setProperty('position', 'relative', 'important');
            }
            if (box.style.getPropertyValue('z-index') !== '1') {
                box.style.setProperty('z-index', '1', 'important');
            }
        }
    }

    function bindPrimaryFrontGuardV224() {
        const modal = document.getElementById(PRIMARY_ID_V224);
        if (!modal || modal.dataset.frontGuardV224 === '1') return !!modal;
        modal.dataset.frontGuardV224 = '1';

        const observer = new MutationObserver(() => {
            if (!modal.classList.contains('hidden')) forcePrimaryFrontV224();
        });
        observer.observe(modal, { attributes: true, attributeFilter: ['class', 'style'] });
        forcePrimaryFrontV224();
        return true;
    }

    // The Primary Label modal is lazy-created by template-extras-5. Watch only
    // direct body children until it appears, then stop the creation observer.
    if (!bindPrimaryFrontGuardV224() && document.body) {
        const bodyObserver = new MutationObserver(() => {
            if (bindPrimaryFrontGuardV224()) bodyObserver.disconnect();
        });
        bodyObserver.observe(document.body, { childList: true });
    }

    // V596: the modal already has its own class/style observer above.
    // Running this repair after EVERY pointerdown and click across the entire
    // Log page was redundant and added work to the critical interaction path.

    const style = document.createElement('style');
    style.id = 'loggy-ui-hotfix-style-v224';
    style.textContent = `
        /* Primary Label is a child of Knowledge Base Settings, never behind it. */
        body > #${PRIMARY_ID_V224}:not(.hidden){
            position:fixed!important;
            inset:0!important;
            z-index:${PRIMARY_Z_V224}!important;
            pointer-events:auto!important;
            visibility:visible!important;
            opacity:1!important;
        }
        body > #${PRIMARY_ID_V224}:not(.hidden) > .modal-box{
            position:relative!important;
            z-index:1!important;
            pointer-events:auto!important;
        }

        /* Safe Add/Edit Field option toggles: every selected option gets the
           same bottom underline, including the middle Show on Quiz button. */
        #kb-field-create-modal-v221 .kb-field-pronunciation-v221,
        #kb-field-create-modal-v221 .kb-field-quiz-v221,
        #kb-field-create-modal-v221 .kb-field-editable-v221{
            border:0!important;
            border-bottom:2px solid transparent!important;
            border-radius:0!important;
            box-shadow:none!important;
            background:transparent!important;
            padding-bottom:5px!important;
        }
        #kb-field-create-modal-v221 .kb-field-pronunciation-v221.selected,
        #kb-field-create-modal-v221 .kb-field-quiz-v221.selected,
        #kb-field-create-modal-v221 .kb-field-editable-v221.selected{
            border-bottom-color:currentColor!important;
            box-shadow:none!important;
            opacity:1!important;
        }

        /* Items Learned audio follows the card's foreground color so it remains
           visible when the card changes background on hover or under a theme. */
        #phrases-container .chip .chip-audio-btn,
        #phrases-container .chip .chip-audio-btn > i{
            color:inherit!important;
            stroke:currentColor!important;
            visibility:visible!important;
        }
        #phrases-container .chip:hover .chip-audio-btn,
        #phrases-container .chip:hover .chip-audio-btn > i{
            color:inherit!important;
            opacity:1!important;
            visibility:visible!important;
        }

        /* Custom Daily KB suggestion menu — replaces the native datalist UI. */
        #phrase-input-group.kb-suggest-host-v224{
            position:relative!important;
            overflow:visible!important;
            z-index:120!important;
        }
        #daily-kb-suggestions-v224{
            position:absolute!important;
            top:calc(100% + 6px)!important;
            left:0!important;
            right:0!important;
            z-index:2147483200!important;
            max-height:240px!important;
            overflow:auto!important;
            padding:6px!important;
            border:var(--thin-border)!important;
            border-radius:11px!important;
            background:var(--white)!important;
            color:var(--black)!important;
            box-shadow:4px 5px 0 color-mix(in srgb,var(--black) 20%,transparent)!important;
            scrollbar-width:none!important;
        }
        #daily-kb-suggestions-v224::-webkit-scrollbar{display:none!important;}
        #daily-kb-suggestions-v224.hidden{display:none!important;}
        #daily-kb-suggestions-v224 .daily-kb-suggestion-v224{
            width:100%!important;
            min-height:39px!important;
            display:flex!important;
            align-items:center!important;
            justify-content:space-between!important;
            gap:10px!important;
            padding:7px 9px!important;
            margin:0!important;
            border:0!important;
            border-radius:8px!important;
            background:transparent!important;
            color:var(--black)!important;
            font:inherit!important;
            text-align:left!important;
            cursor:pointer!important;
        }
        #daily-kb-suggestions-v224 .daily-kb-suggestion-v224:hover,
        #daily-kb-suggestions-v224 .daily-kb-suggestion-v224:focus-visible{
            background:var(--black)!important;
            color:var(--white)!important;
            outline:0!important;
        }
        #daily-kb-suggestions-v224 .daily-kb-suggestion-main-v224{
            min-width:0!important;
            overflow:hidden!important;
            text-overflow:ellipsis!important;
            white-space:nowrap!important;
        }
        #daily-kb-suggestions-v224 .daily-kb-suggestion-cat-v224{
            flex:0 0 auto!important;
            max-width:42%!important;
            overflow:hidden!important;
            text-overflow:ellipsis!important;
            white-space:nowrap!important;
            font-size:.68rem!important;
            opacity:.68!important;
        }
        #daily-kb-suggestions-v224 .daily-kb-suggestion-empty-v224{
            padding:10px!important;
            color:var(--muted-text)!important;
            font-size:.85rem!important;
            text-align:center!important;
        }
    `;
    if (!document.getElementById(style.id)) document.head.appendChild(style);

    function escapeHtmlV224(value) {
        return String(value ?? '').replace(/[&<>"']/g, ch => ({
            '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'
        })[ch]);
    }

    function initDailyKbSuggestionsV224() {
        const input = document.getElementById('new-phrase-input');
        const group = document.getElementById('phrase-input-group');
        if (!input || !group || input.dataset.kbSuggestionsV224 === '1') return;
        input.dataset.kbSuggestionsV224 = '1';
        input.removeAttribute('list');
        input.setAttribute('autocomplete', 'off');
        input.setAttribute('aria-autocomplete', 'list');
        group.classList.add('kb-suggest-host-v224');

        let menu = document.getElementById('daily-kb-suggestions-v224');
        if (!menu) {
            menu = document.createElement('div');
            menu.id = 'daily-kb-suggestions-v224';
            menu.className = 'hidden';
            menu.setAttribute('role', 'listbox');
            group.appendChild(menu);
        }
        input.setAttribute('aria-controls', menu.id);

        const hide = () => menu.classList.add('hidden');
        const ids = () => {
            try {
                return Array.from(new Set((Array.isArray(db?.phrases) ? db.phrases : []).map(String)))
                    .filter(Boolean)
                    .sort((a,b) => a.localeCompare(b, undefined, { sensitivity:'base' }));
            } catch { return []; }
        };
        const display = id => {
            try {
                const value = window.getKnowledgeDisplayLabelV162?.(id, 'everywhere');
                return String(value == null ? id : value);
            } catch { return String(id); }
        };
        const category = id => {
            try { return String(db?.phrase_meta?.[id]?.type || ''); }
            catch { return ''; }
        };

        const render = () => {
            if (group.classList.contains('hidden')) { hide(); return; }
            const query = String(input.value || '').trim().toLocaleLowerCase();
            const matches = ids().filter(id => {
                const label = display(id);
                const cat = category(id);
                return !query || `${id} ${label} ${cat}`.toLocaleLowerCase().includes(query);
            }).slice(0, 14);

            if (!matches.length) {
                menu.innerHTML = '<div class="daily-kb-suggestion-empty-v224">No matching Knowledge Base items</div>';
                menu.classList.remove('hidden');
                return;
            }

            menu.innerHTML = matches.map(id => {
                const label = display(id);
                const cat = category(id);
                const secondary = label !== id ? `<span class="daily-kb-suggestion-cat-v224">${escapeHtmlV224(id)}</span>` : (cat ? `<span class="daily-kb-suggestion-cat-v224">${escapeHtmlV224(cat)}</span>` : '');
                const labelHtml = (typeof window.knowledgeVisibleTitleHtmlV212 === 'function') ? window.knowledgeVisibleTitleHtmlV212(label) : escapeHtmlV224(label);
                return `<button type="button" class="daily-kb-suggestion-v224" role="option" data-kb-id-v224="${escapeHtmlV224(id)}"><span class="daily-kb-suggestion-main-v224">${labelHtml}</span>${secondary}</button>`;
            }).join('');
            menu.classList.remove('hidden');
        };

        input.addEventListener('focus', () => requestAnimationFrame(render));
        input.addEventListener('input', render);
        input.addEventListener('keydown', event => {
            if (event.key === 'Escape') hide();
        });

        // pointerdown keeps focus from bouncing away before the old Enter
        // handler receives the selected Knowledge Base ID.
        menu.addEventListener('pointerdown', event => {
            const option = event.target.closest?.('.daily-kb-suggestion-v224[data-kb-id-v224]');
            if (!option) return;
            event.preventDefault();
            event.stopPropagation();
            const id = String(option.dataset.kbIdV224 || '');
            if (!id) return;
            input.value = id;
            hide();
            input.focus();
            input.dispatchEvent(new KeyboardEvent('keydown', {
                key:'Enter', code:'Enter', bubbles:true, cancelable:true
            }));
        });

        document.addEventListener('pointerdown', event => {
            if (!group.contains(event.target)) hide();
        }, true);

        // Reopen with fresh Knowledge Base contents every time the + control is used.
        document.getElementById('add-phrase-btn')?.addEventListener('click', () => {
            requestAnimationFrame(render);
        });

        window.addEventListener('loggy-features-ready', () => {
            if (!group.classList.contains('hidden') && document.activeElement === input) render();
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initDailyKbSuggestionsV224, { once:true });
    } else {
        initDailyKbSuggestionsV224();
    }
})();


/* ============================================================
   V227 — existing-log fixes: Daily landing, quiz day ranges/shortcuts,
   placeholder label cleanup, faster KB video polaroids, Daily alignment.
   ============================================================ */
(() => {
    'use strict';
    if (window.__loggyHotfixV227) return;
    window.__loggyHotfixV227 = true;

    // V245: do not force existing logs back to Daily Logs. Their copied core and
    // shared navigation state are allowed to restore the actual current tab/day.

    const style = document.createElement('style');
    style.id = 'loggy-hotfix-v227-style';
    style.textContent = `
        /* Hide only the redundant text; keep the switch itself. */
        #settings-modal .kb-placeholder-toggle-v56 > span:not(.kb-toggle-track-v164){display:none!important;}

        .quiz-day-quick-selectors-v227{display:flex!important;flex-wrap:wrap!important;gap:8px!important;margin:10px 0 12px!important;}
        .quiz-day-quick-selectors-v227 label{display:inline-flex!important;align-items:center!important;gap:7px!important;min-height:36px!important;padding:6px 10px!important;border:var(--thin-border)!important;border-radius:9px!important;background:var(--white)!important;color:var(--black)!important;cursor:pointer!important;font-weight:700!important;}
        .quiz-day-quick-selectors-v227 input{width:16px!important;height:16px!important;margin:0!important;accent-color:currentColor!important;}
        #quiz-day-grid .day-picker-box:disabled{cursor:not-allowed!important;}
        #quiz-day-grid .day-picker-box.selected{opacity:1!important;}

        #phrases-library-grid .kb-polaroid-video-thumb-v227{display:block!important;width:100%!important;height:100%!important;object-fit:cover!important;pointer-events:none!important;content-visibility:auto!important;}
        #phrases-library-grid .polaroid-video > video{pointer-events:none!important;}

        #grid-view.view.active > header,
        #grid-view.view.active > .daily-log-search-wrap{width:100%!important;margin-left:0!important;margin-right:0!important;}
        #grid-view.view.active > #days-grid.grid-container,
        #grid-view.view.active > #days-grid.polaroid-grid-container{padding-left:0!important;}
    `;
    document.head.appendChild(style);

    // Lightweight video previews: YouTube cards use thumbnails rather than one
    // autoplaying iframe per item. This is especially important while switching
    // among large video-heavy categories in Polaroid view.
    try {
        buildPolaroidVideoHtml = function(videoUrl) {
            if (!videoUrl) return `<div class="polaroid-video-placeholder"><i class="ph ph-play-circle"></i></div>`;
            const ytId = typeof extractYoutubeId === 'function' ? extractYoutubeId(videoUrl) : '';
            if (ytId) return `<img class="kb-polaroid-video-thumb-v227" src="https://i.ytimg.com/vi/${ytId}/hqdefault.jpg" loading="lazy" decoding="async" fetchpriority="low" alt="" tabindex="-1">`;
            if (/\.mp4(?:$|[?#])/i.test(String(videoUrl))) return `<video src="${videoUrl}" preload="metadata" muted playsinline tabindex="-1"></video>`;
            return `<div class="polaroid-video-placeholder"><i class="ph ph-play-circle"></i></div>`;
        };
    } catch {}

    // Replace the old single-day-only picker for existing logs too.
    try {
        let anchor = null;
        let activeShortcutV474 = null;
        const selectable = maxDay => {
            const out=[]; for(let day=1;day<=maxDay;day++) if(dayHasQuizItems(day)) out.push(day); return out;
        };
        const shortcut = (kind,maxDay) => {
            const today = getTodayCalculatedDayNumber();
            if(kind==='today') return today<=maxDay && dayHasQuizItems(today) ? [today] : [];
            if(kind==='week'){
                const start=Math.max(1,today-6), end=Math.min(maxDay,today), out=[];
                for(let day=start;day<=end;day++) if(dayHasQuizItems(day)) out.push(day);
                return out;
            }
            return selectable(maxDay);
        };
        const sameSet = values => {
            const wanted=new Set(values);
            return wanted.size===selectedQuizDays.size && [...wanted].every(day=>selectedQuizDays.has(day));
        };
        const sync = maxDay => {
            document.querySelectorAll('#quiz-day-grid .day-picker-box[data-quiz-day-v227]').forEach(box=>{
                const day=Number(box.dataset.quizDayV227), on=selectedQuizDays.has(day);
                box.classList.toggle('selected',on); box.setAttribute('aria-pressed',on?'true':'false');
            });
            document.querySelectorAll('#quiz-day-quick-selectors-v227 input[data-quiz-shortcut-v227]').forEach(input=>{
                const on = input.dataset.quizShortcutV227 === activeShortcutV474;
                input.checked = on;
                input.closest('label')?.classList.toggle('selected', on);
            });
            updateAvailableQuizTypes();
        };
        const ensureShortcuts = maxDay => {
            const grid=document.getElementById('quiz-day-grid'); if(!grid)return;
            let host=document.getElementById('quiz-day-quick-selectors-v227');
            if(host)return;
            host=document.createElement('div'); host.id='quiz-day-quick-selectors-v227'; host.className='quiz-day-quick-selectors-v227';
            host.innerHTML='<label><input type="checkbox" data-quiz-shortcut-v227="today"><span>Today</span></label><label><input type="checkbox" data-quiz-shortcut-v227="week" title="Past 7 days including today"><span>This Week</span></label><label><input type="checkbox" data-quiz-shortcut-v227="all"><span>All</span></label>';
            grid.insertAdjacentElement('beforebegin',host);
            host.addEventListener('change',event=>{
                const input=event.target.closest?.('input[data-quiz-shortcut-v227]'); if(!input)return;
                try{playClickSound()}catch{}
                const kind=input.dataset.quizShortcutV227;
                const target=shortcut(kind,maxDay);
                selectedQuizDays.clear();
                if(input.checked){
                    activeShortcutV474=kind;
                    target.forEach(day=>selectedQuizDays.add(day));
                }else{
                    activeShortcutV474=null;
                }
                anchor=null; sync(maxDay);
            });
        };
        renderQuizDayPicker = function(){
            selectedQuizDays.clear(); anchor=null; activeShortcutV474=null;
            const grid=document.getElementById('quiz-day-grid'); if(!grid)return;
            grid.innerHTML='';
            const maxDay=getQuizDayCountV648();
            ensureShortcuts(maxDay);
            for(let i=1;i<=maxDay;i++){
                const hasData=dayHasQuizItems(i), box=document.createElement('button');
                box.type='button'; box.className='day-picker-box'; box.dataset.quizDayV227=String(i); box.textContent=String(i); box.setAttribute('aria-pressed','false');
                if(!hasData){box.classList.add('no-data');box.disabled=true;box.setAttribute('aria-disabled','true');}
                box.addEventListener('click',event=>{
                    if(!hasData)return; try{playClickSound()}catch{}
                    if(event.shiftKey && Number.isFinite(anchor)){
                        const lo=Math.min(anchor,i), hi=Math.max(anchor,i);
                        for(let day=lo;day<=hi;day++) if(dayHasQuizItems(day)) selectedQuizDays.add(day);
                    }else{
                        selectedQuizDays.has(i)?selectedQuizDays.delete(i):selectedQuizDays.add(i); anchor=i;
                    }
                    activeShortcutV474=null;
                    sync(maxDay);
                });
                grid.appendChild(box);
            }
            sync(maxDay);
        };
    } catch (error) { console.error('V227 quiz picker could not initialize', error); }
})();

/* ============================================================
   V228 — quiz clear-on-background, KB controls, lazy ASL autoplay,
   and Daily Logs numbered-day layouts.
   ============================================================ */
(() => {
    'use strict';
    if (window.__loggyHotfixV228) return;
    window.__loggyHotfixV228 = true;

    const q = (selector, root = document) => root?.querySelector?.(selector) || null;
    const qa = (selector, root = document) => Array.from(root?.querySelectorAll?.(selector) || []);
    const clamp = (value, min, max) => Math.max(min, Math.min(max, Number(value) || min));
    const attr = value => String(value ?? '').replace(/[&<>"']/g, ch => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[ch]));

    const style = document.createElement('style');
    style.id = 'loggy-hotfix-v228-style';
    style.textContent = `
        /* Placeholder title is deliberately true black, independent of muted theme text. */
        #settings-modal .kb-placeholder-title-row-v164 > .field-label,
        #settings-modal .kb-placeholder-settings-heading-v56 .field-label,
        #settings-modal .kb-placeholder-title-row-v164 .placeholder-help-v163{
            color:#000!important;
            opacity:1!important;
        }

        /* Match KB View / Item Order control language. */
        #settings-modal #kb-polaroid-options-v163.kb-polaroid-options-v228{
            display:grid!important;
            gap:12px!important;
            margin-top:10px!important;
            padding:0!important;
            border:0!important;
            border-radius:0!important;
            background:transparent!important;
        }
        #settings-modal #kb-polaroid-options-v163.kb-polaroid-options-v228 > label:first-child{
            display:flex!important;
            align-items:center!important;
            gap:7px!important;
        }
        #settings-modal .kb-polaroid-control-section-v228{display:block!important;}
        #settings-modal .kb-polaroid-orientation-picker-v228{margin-top:6px!important;}
        #settings-modal .kb-polaroid-orientation-picker-v228 .filter-tab.active{
            background:var(--black)!important;
            color:var(--white)!important;
        }
        #settings-modal .kb-polaroid-stepper-v228{
            display:inline-grid!important;
            grid-template-columns:38px 64px 38px!important;
            align-items:stretch!important;
            margin-top:6px!important;
            border:var(--thin-border)!important;
            border-radius:8px!important;
            overflow:hidden!important;
            background:var(--white)!important;
        }
        #settings-modal .kb-polaroid-stepper-v228 button{
            border:0!important;
            border-radius:0!important;
            background:var(--white)!important;
            color:var(--black)!important;
            min-height:36px!important;
            cursor:pointer!important;
            display:grid!important;
            place-items:center!important;
            font:inherit!important;
        }
        #settings-modal .kb-polaroid-stepper-v228 button:hover{background:var(--track-bg)!important;}
        #settings-modal .kb-polaroid-stepper-v228 input{
            width:64px!important;
            min-width:0!important;
            border:0!important;
            border-left:var(--thin-border)!important;
            border-right:var(--thin-border)!important;
            border-radius:0!important;
            background:var(--white)!important;
            color:var(--black)!important;
            text-align:center!important;
            font:inherit!important;
            font-weight:700!important;
            padding:4px!important;
            appearance:textfield!important;
        }
        #settings-modal .kb-polaroid-stepper-v228 input::-webkit-inner-spin-button,
        #settings-modal .kb-polaroid-stepper-v228 input::-webkit-outer-spin-button{appearance:none!important;margin:0!important;}

        /* ASL KB video cards: thumbnail until visible, then a muted autoplay iframe. */
        #phrases-library-grid .kb-polaroid-youtube-shell-v228,
        #phrases-library-grid .kb-polaroid-native-shell-v228,
        #phrases-library-grid .kb-polaroid-youtube-shell-v228 > img,
        #phrases-library-grid .kb-polaroid-youtube-shell-v228 > iframe,
        #phrases-library-grid .kb-polaroid-native-shell-v228 > video{
            display:block!important;
            width:100%!important;
            height:100%!important;
            object-fit:cover!important;
            border:0!important;
        }
        #phrases-library-grid .kb-polaroid-youtube-shell-v228,
        #phrases-library-grid .kb-polaroid-native-shell-v228{overflow:hidden!important;pointer-events:none!important;}

        /* Daily Logs numbered-day layout picker. */
        #daily-logs-local-settings-modal .daily-day-layout-picker-v228{margin-top:6px!important;}
        #daily-logs-local-settings-modal .daily-day-layout-picker-v228 .filter-tab.active{
            background:var(--black)!important;
            color:var(--white)!important;
        }

        #grid-view.view.active > #days-grid.daily-day-layout-compact-v228{
            grid-template-columns:repeat(auto-fill,minmax(52px,1fr))!important;
            gap:8px!important;
        }
        #grid-view.view.active > #days-grid.daily-day-layout-compact-v228 .day-box{
            border-radius:10px!important;
            font-size:1.35rem!important;
        }

        #grid-view.view.active > #days-grid.daily-day-layout-strip-v228{
            display:grid!important;
            grid-auto-flow:column!important;
            grid-auto-columns:70px!important;
            grid-template-columns:none!important;
            align-content:start!important;
            justify-content:start!important;
            gap:10px!important;
            overflow-x:auto!important;
            overflow-y:hidden!important;
            overscroll-behavior-x:contain!important;
        }
        #grid-view.view.active > #days-grid.daily-day-layout-strip-v228 > *{width:70px!important;}

        #grid-view.view.active > #days-grid.daily-day-layout-periodic-v228{
            display:grid!important;
            align-content:start!important;
            justify-content:start!important;
            gap:10px!important;
            overflow-x:auto!important;
            overflow-y:auto!important;
            overscroll-behavior:contain!important;
            padding-bottom:18px!important;
        }
        #grid-view.view.active > #days-grid.daily-day-layout-periodic-v228 > *{
            width:68px!important;
            min-width:68px!important;
            max-width:68px!important;
        }
        #grid-view.view.active > #days-grid.daily-day-layout-periodic-v228 .day-box{
            width:68px!important;
            height:68px!important;
            min-height:68px!important;
            aspect-ratio:1!important;
            font-size:1.45rem!important;
            border-radius:11px!important;
        }
    `;
    document.head.appendChild(style);

    // Clicking blank/background space in the Quizzes landing page clears the
    // numbered-day selection. Interactive controls keep their normal action.
    document.addEventListener('click', event => {
        try {
            const view = document.getElementById('quizzes-view');
            if (!view?.classList.contains('active') || !view.contains(event.target)) return;
            if (!(selectedQuizDays instanceof Set) || selectedQuizDays.size === 0) return;
            if (event.target.closest?.('#quiz-day-grid .day-picker-box')) return;
            if (event.target.closest?.('#quiz-day-quick-selectors-v227')) return;
            if (event.target.closest?.('button,input,select,textarea,a,label,[role="button"]')) return;
            // Re-rendering is intentional: V227's range anchor lives inside its
            // picker closure, so this clears both the selected set and the anchor.
            renderQuizDayPicker();
        } catch {}
    }, true);

    function currentKbPolaroidConfigV228() {
        try {
            db.settings ||= {};
            db.settings.categorySettings ||= {};
            const cat = typeof activeCategorySettingTab !== 'undefined' ? activeCategorySettingTab : null;
            return cat ? (db.settings.categorySettings[cat] ||= {}) : db.settings;
        } catch {
            return {};
        }
    }

    function refreshKbAfterPolaroidSettingV228() {
        try { saveDb(); } catch {}
        try { renderPhrasesLibrary(q('#phrases-search-bar')?.value || ''); } catch {}
    }

    function syncKbPolaroidControlsV228(box) {
        if (!box) return;
        const cfg = currentKbPolaroidConfigV228();
        const hide = q('.kb-hide-tags-v228', box);
        if (hide) hide.checked = !!cfg.hideTagsInPolaroidV163;
        const orientation = cfg.polaroidOrientationV163 === 'horizontal' ? 'horizontal' : 'vertical';
        const legacyOrientation = q('.kb-polaroid-orientation-v163', box);
        if (legacyOrientation) legacyOrientation.value = orientation;
        qa('.kb-polaroid-orient-btn-v228', box).forEach(button => {
            const on = button.dataset.orientationV228 === orientation;
            button.classList.toggle('active', on);
            button.setAttribute('aria-pressed', on ? 'true' : 'false');
        });
        const row = q('.kb-polaroids-row-v228', box);
        if (row) row.value = String(clamp(cfg.polaroidsPerRowV163 || 4, 1, 8));
    }

    function upgradeKbPolaroidSettingsV228() {
        const box = document.getElementById('kb-polaroid-options-v163');
        if (!box) return false;
        if (box.dataset.v228Upgraded === '1') {
            syncKbPolaroidControlsV228(box);
            return true;
        }

        // Detach the old select-based onchange handler before replacing its DOM.
        box.onchange = null;
        box.dataset.v228Upgraded = '1';
        box.classList.add('kb-polaroid-options-v228');
        box.innerHTML = `
            <label>
                <input type="checkbox" class="kb-hide-tags-v163 kb-hide-tags-v228">
                <span>Hide tags in this view</span>
            </label>
            <select class="kb-polaroid-orientation-v163 hidden" aria-hidden="true" tabindex="-1"><option value="vertical">Vertical</option><option value="horizontal">Horizontal</option></select>
            <div class="kb-polaroid-control-section-v228">
                <span class="field-label">Polaroid Orientation</span>
                <div class="set-size-picker kb-polaroid-orientation-picker-v228" role="radiogroup" aria-label="Polaroid Orientation">
                    <button type="button" class="filter-tab kb-polaroid-orient-btn-v228" data-orientation-v228="vertical">Vertical</button>
                    <button type="button" class="filter-tab kb-polaroid-orient-btn-v228" data-orientation-v228="horizontal">Horizontal</button>
                </div>
            </div>
            <div class="kb-polaroid-control-section-v228">
                <span class="field-label">Polaroids per row</span>
                <div class="kb-polaroid-stepper-v228">
                    <button type="button" class="kb-polaroid-row-minus-v228" aria-label="Fewer polaroids per row"><i class="ph ph-minus"></i></button>
                    <input class="kb-polaroids-row-v163 kb-polaroids-row-v228" type="number" min="1" max="8" inputmode="numeric" aria-label="Polaroids per row">
                    <button type="button" class="kb-polaroid-row-plus-v228" aria-label="More polaroids per row"><i class="ph ph-plus"></i></button>
                </div>
            </div>`;

        q('.kb-hide-tags-v228', box)?.addEventListener('change', event => {
            currentKbPolaroidConfigV228().hideTagsInPolaroidV163 = !!event.target.checked;
            refreshKbAfterPolaroidSettingV228();
        });
        qa('.kb-polaroid-orient-btn-v228', box).forEach(button => button.addEventListener('click', () => {
            currentKbPolaroidConfigV228().polaroidOrientationV163 = button.dataset.orientationV228 === 'horizontal' ? 'horizontal' : 'vertical';
            syncKbPolaroidControlsV228(box);
            refreshKbAfterPolaroidSettingV228();
        }));

        const rowInput = q('.kb-polaroids-row-v228', box);
        const setRows = value => {
            const next = clamp(value, 1, 8);
            currentKbPolaroidConfigV228().polaroidsPerRowV163 = next;
            if (rowInput) rowInput.value = String(next);
            refreshKbAfterPolaroidSettingV228();
        };
        q('.kb-polaroid-row-minus-v228', box)?.addEventListener('click', () => setRows((Number(rowInput?.value) || 4) - 1));
        q('.kb-polaroid-row-plus-v228', box)?.addEventListener('click', () => setRows((Number(rowInput?.value) || 4) + 1));
        rowInput?.addEventListener('change', () => setRows(rowInput.value));
        rowInput?.addEventListener('keydown', event => {
            if (event.key === 'Enter') {
                event.preventDefault();
                setRows(rowInput.value);
                rowInput.blur();
            }
        });

        syncKbPolaroidControlsV228(box);
        return true;
    }

    document.addEventListener('click', event => {
        if (event.target.closest?.('#settings-category-tabs,.kb-view-btn,#open-settings-btn,#settings-btn')) {
            requestAnimationFrame(upgradeKbPolaroidSettingsV228);
        }
    }, true);
    let kbUpgradeTriesV228 = 0;
    const kbUpgradeTimerV228 = setInterval(() => {
        kbUpgradeTriesV228 += 1;
        const done = upgradeKbPolaroidSettingsV228();
        if ((done && window.__loggyV163) || kbUpgradeTriesV228 > 80) clearInterval(kbUpgradeTimerV228);
    }, 250);

    function isAslLogV228() {
        try {
            const parts = location.pathname.split('/').filter(Boolean);
            const id = decodeURIComponent(parts[0] === 'app' ? (parts[1] || '') : '').toLowerCase();
            return id === 'asl' || id.startsWith('asl-') || id.startsWith('asl_');
        } catch { return false; }
    }

    function youtubeThumbV228(id) {
        return `https://i.ytimg.com/vi/${encodeURIComponent(id)}/hqdefault.jpg`;
    }

    function installKbVideoBuilderV228() {
        if (typeof buildPolaroidVideoHtml !== 'function') return;
        if (buildPolaroidVideoHtml.__v228) return;
        const isAsl = isAslLogV228();
        const replacement = function(videoUrl) {
            if (!videoUrl) return `<div class="polaroid-video-placeholder"><i class="ph ph-play-circle"></i></div>`;
            const ytId = typeof extractYoutubeId === 'function' ? extractYoutubeId(videoUrl) : '';
            if (ytId) {
                if (isAsl) {
                    return `<div class="kb-polaroid-youtube-shell-v228" data-youtube-v228="${attr(ytId)}"><img src="${youtubeThumbV228(ytId)}" loading="lazy" decoding="async" fetchpriority="low" alt="" tabindex="-1"></div>`;
                }
                return `<img class="kb-polaroid-video-thumb-v227" src="${youtubeThumbV228(ytId)}" loading="lazy" decoding="async" fetchpriority="low" alt="" tabindex="-1">`;
            }
            if (/\.mp4(?:$|[?#])/i.test(String(videoUrl))) {
                if (isAsl) return `<div class="kb-polaroid-native-shell-v228" data-video-v228="${attr(videoUrl)}"><div class="polaroid-video-placeholder"><i class="ph ph-play-circle"></i></div></div>`;
                return `<video src="${attr(videoUrl)}" preload="metadata" muted playsinline tabindex="-1"></video>`;
            }
            return `<div class="polaroid-video-placeholder"><i class="ph ph-play-circle"></i></div>`;
        };
        replacement.__v228 = true;
        buildPolaroidVideoHtml = replacement;
    }

    function hydrateVisibleKbVideosV228() {
        if (!isAslLogV228()) return;
        const grid = document.getElementById('phrases-library-grid');
        if (!grid) return;
        try { window.__kbPolaroidObserverV228?.disconnect?.(); } catch {}

        const activate = shell => {
            if (!shell?.isConnected || shell.dataset.activeV228 === '1') return;
            shell.dataset.activeV228 = '1';
            const yt = shell.dataset.youtubeV228;
            if (yt) {
                const encoded = encodeURIComponent(yt);
                shell.innerHTML = `<iframe src="https://www.youtube.com/embed/${encoded}?autoplay=1&mute=1&loop=1&playlist=${encoded}&controls=0&playsinline=1&rel=0" loading="lazy" allow="autoplay; encrypted-media" tabindex="-1"></iframe>`;
                return;
            }
            const src = shell.dataset.videoV228;
            if (src) {
                shell.innerHTML = `<video src="${attr(src)}" autoplay muted loop playsinline preload="metadata" tabindex="-1"></video>`;
                q('video', shell)?.play?.().catch?.(() => {});
            }
        };
        const deactivate = shell => {
            if (!shell?.isConnected || shell.dataset.activeV228 !== '1' || shell.dataset.visibleV228 === '1') return;
            delete shell.dataset.activeV228;
            const yt = shell.dataset.youtubeV228;
            if (yt) shell.innerHTML = `<img src="${youtubeThumbV228(yt)}" loading="lazy" decoding="async" fetchpriority="low" alt="" tabindex="-1">`;
            else shell.innerHTML = `<div class="polaroid-video-placeholder"><i class="ph ph-play-circle"></i></div>`;
        };

        if (!('IntersectionObserver' in window)) {
            qa('.kb-polaroid-youtube-shell-v228,.kb-polaroid-native-shell-v228', grid).slice(0, 8).forEach(activate);
            return;
        }
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                const shell = entry.target;
                if (entry.isIntersecting) {
                    shell.dataset.visibleV228 = '1';
                    activate(shell);
                } else {
                    delete shell.dataset.visibleV228;
                    setTimeout(() => deactivate(shell), 650);
                }
            });
        }, { root: grid, rootMargin: '80px 0px', threshold: 0.04 });
        window.__kbPolaroidObserverV228 = observer;
        qa('.kb-polaroid-youtube-shell-v228,.kb-polaroid-native-shell-v228', grid).forEach(shell => observer.observe(shell));
    }

    function installKbVideoRenderHookV228() {
        installKbVideoBuilderV228();
        if (typeof renderPhrasesLibrary !== 'function') return;
        if (renderPhrasesLibrary.__v228VideoHook) return;
        const before = renderPhrasesLibrary;
        const wrapped = function(...args) {
            const result = before.apply(this, args);
            requestAnimationFrame(hydrateVisibleKbVideosV228);
            return result;
        };
        wrapped.__v228VideoHook = true;
        renderPhrasesLibrary = wrapped;
    }
    installKbVideoRenderHookV228();
    setTimeout(installKbVideoRenderHookV228, 900);
    setTimeout(installKbVideoRenderHookV228, 2200);
    document.addEventListener('click', event => {
        if (event.target.closest?.('#library-filter-tabs,.kb-view-btn,#open-phrases-btn')) {
            setTimeout(() => { installKbVideoRenderHookV228(); hydrateVisibleKbVideosV228(); }, 0);
        }
    }, true);

    // Atomic-number positions in a conventional 18-column periodic table with
    // lanthanides/actinides in the two detached rows.
    function periodicPositionV228(atomic) {
        if (atomic === 1) return { col: 1, row: 1 };
        if (atomic === 2) return { col: 18, row: 1 };
        if (atomic >= 3 && atomic <= 4) return { col: atomic - 2, row: 2 };
        if (atomic >= 5 && atomic <= 10) return { col: atomic + 8, row: 2 };
        if (atomic >= 11 && atomic <= 12) return { col: atomic - 10, row: 3 };
        if (atomic >= 13 && atomic <= 18) return { col: atomic, row: 3 };
        if (atomic >= 19 && atomic <= 36) return { col: atomic - 18, row: 4 };
        if (atomic >= 37 && atomic <= 54) return { col: atomic - 36, row: 5 };
        if (atomic === 55) return { col: 1, row: 6 };
        if (atomic === 56) return { col: 2, row: 6 };
        if (atomic >= 57 && atomic <= 71) return { col: atomic - 54, row: 8 };
        if (atomic >= 72 && atomic <= 86) return { col: atomic - 68, row: 6 };
        if (atomic === 87) return { col: 1, row: 7 };
        if (atomic === 88) return { col: 2, row: 7 };
        if (atomic >= 89 && atomic <= 103) return { col: atomic - 86, row: 9 };
        if (atomic >= 104 && atomic <= 118) return { col: atomic - 100, row: 7 };
        return { col: 1, row: 1 };
    }

    function applyDailyDayLayoutV228() {
        const grid = document.getElementById('days-grid');
        if (!grid) return;
        const classes = ['daily-day-layout-compact-v228','daily-day-layout-strip-v228','daily-day-layout-periodic-v228'];
        grid.classList.remove(...classes);
        grid.style.removeProperty('grid-template-columns');
        grid.style.removeProperty('grid-template-rows');
        grid.style.removeProperty('grid-auto-columns');
        grid.style.removeProperty('grid-auto-flow');
        qa(':scope > *', grid).forEach(child => {
            child.style.removeProperty('grid-column');
            child.style.removeProperty('grid-row');
        });

        if ((db.settings?.dailyViewType || 'default') === 'polaroid') return;
        const layout = db.settings?.dailyDayLayoutV228 || 'grid';
        if (layout === 'compact') {
            grid.classList.add('daily-day-layout-compact-v228');
            return;
        }
        if (layout !== 'periodic') return;

        grid.classList.add('daily-day-layout-periodic-v228');
        const children = qa(':scope > *', grid);
        const realDays = children.map(child => Number(child.dataset.day)).filter(Number.isFinite);
        const nextDay = (realDays.length ? Math.max(...realDays) : 0) + 1;
        let furthestCycle = 0;
        children.forEach(child => {
            const day = Number.isFinite(Number(child.dataset.day)) ? Number(child.dataset.day) : nextDay;
            const cycle = Math.floor((Math.max(1, day) - 1) / 118);
            const atomic = ((Math.max(1, day) - 1) % 118) + 1;
            const pos = periodicPositionV228(atomic);
            child.style.gridColumn = String(cycle * 20 + pos.col);
            child.style.gridRow = String(pos.row);
            furthestCycle = Math.max(furthestCycle, cycle);
        });
        const totalColumns = furthestCycle * 20 + 18;
        grid.style.setProperty('grid-template-columns', `repeat(${totalColumns}, 68px)`, 'important');
        grid.style.setProperty('grid-template-rows', 'repeat(9, 68px)', 'important');
    }

    function ensureDailyDayLayoutSettingV228(modal) {
        if (!modal) return;
        let section = q('#daily-day-layout-setting-v228', modal);
        if (!section) {
            section = document.createElement('div');
            section.id = 'daily-day-layout-setting-v228';
            section.className = 'modal-section';
            section.innerHTML = `
                <span class="field-label">Numbered Days Layout</span>
                <div class="set-size-picker daily-day-layout-picker-v228" role="radiogroup" aria-label="Numbered Days Layout">
                    <button type="button" class="filter-tab" data-daily-layout-v228="grid">Grid</button>
                    <button type="button" class="filter-tab" data-daily-layout-v228="periodic">Periodic Table</button>
                    <button type="button" class="filter-tab" data-daily-layout-v228="compact">Compact</button>
                </div>`;
            const viewSelect = q('#daily-logs-local-view-type', modal);
            const viewSection = viewSelect?.closest('.modal-section');
            if (viewSection) viewSection.insertAdjacentElement('afterend', section);
            else q('.modal-box', modal)?.appendChild(section);
            qa('[data-daily-layout-v228]', section).forEach(button => button.addEventListener('click', () => {
                db.settings ||= {};
                db.settings.dailyDayLayoutV228 = button.dataset.dailyLayoutV228 || 'grid';
                syncDailyDayLayoutSettingV228(modal);
                try { saveDb(); } catch {}
                try { initGrid(); } catch {}
            }));
        }
        syncDailyDayLayoutSettingV228(modal);
    }

    function syncDailyDayLayoutSettingV228(modal) {
        if (!modal) return;
        const current = db.settings?.dailyDayLayoutV228 || 'grid';
        qa('[data-daily-layout-v228]', modal).forEach(button => {
            const on = button.dataset.dailyLayoutV228 === current;
            button.classList.toggle('active', on);
            button.setAttribute('aria-pressed', on ? 'true' : 'false');
        });
    }

    try {
        const beforeEnsureDailyV228 = ensureDailyLogsSettingsModal;
        ensureDailyLogsSettingsModal = function(...args) {
            const modal = beforeEnsureDailyV228.apply(this, args);
            ensureDailyDayLayoutSettingV228(modal);
            return modal;
        };
    } catch {}
    try {
        const beforeOpenDailyV228 = openDailyLogsLocalSettings;
        openDailyLogsLocalSettings = function(...args) {
            const result = beforeOpenDailyV228.apply(this, args);
            const modal = document.getElementById('daily-logs-local-settings-modal');
            ensureDailyDayLayoutSettingV228(modal);
            syncDailyDayLayoutSettingV228(modal);
            return result;
        };
    } catch {}
    try {
        const beforeInitGridV228 = initGrid;
        initGrid = function(...args) {
            const result = beforeInitGridV228.apply(this, args);
            applyDailyDayLayoutV228();
            return result;
        };
    } catch {}

    requestAnimationFrame(() => {
        try { applyDailyDayLayoutV228(); } catch {}
        try { ensureDailyDayLayoutSettingV228(document.getElementById('daily-logs-local-settings-modal')); } catch {}
    });
})();

/* ============================================================
   V229 — expanded Daily Logs day layouts.
   IMPORTANT: every layout keeps the original .day-box/.has-data DOM and
   theme variables intact. These rules only alter geometry/positioning so
   themes created against older template code still style the tiles.
   ============================================================ */
(() => {
    'use strict';
    if (window.__loggyHotfixV229) return;
    window.__loggyHotfixV229 = true;

    const q = (selector, root = document) => root?.querySelector?.(selector) || null;
    const qa = (selector, root = document) => Array.from(root?.querySelectorAll?.(selector) || []);
    const NEW_LAYOUTS = ['bubbles','pebbles','pills','dominoes','zigzag','wave','droplets','petals','badges','clouds','honeycomb','arches','mosaic','tickets','orbit','clover','lanterns'];
    const NEW_CLASSES = NEW_LAYOUTS.map(name => `daily-day-layout-${name}-v229`);

    const style = document.createElement('style');
    style.id = 'loggy-hotfix-v229-day-layout-style';
    style.textContent = `
        /* The picker may wrap onto several rows as layouts are added. */
        #daily-logs-local-settings-modal .daily-day-layout-picker-v228{
            display:flex!important;
            flex-wrap:wrap!important;
            align-items:center!important;
            gap:7px!important;
        }

        /* BUBBLES — circular tiles; all visual colors/borders remain .day-box theme-owned. */
        #grid-view.view.active > #days-grid.daily-day-layout-bubbles-v229{
            grid-template-columns:repeat(auto-fill,76px)!important;
            justify-content:start!important;
            gap:13px!important;
        }
        #grid-view.view.active > #days-grid.daily-day-layout-bubbles-v229 > *{
            width:76px!important;
            height:76px!important;
        }
        #grid-view.view.active > #days-grid.daily-day-layout-bubbles-v229 .day-box{
            width:76px!important;
            height:76px!important;
            min-height:76px!important;
            aspect-ratio:1!important;
            border-radius:50%!important;
            font-size:1.55rem!important;
        }

        /* PEBBLES — organic rounded stones using real border-radius, not a clip mask,
           so legacy theme backgrounds/borders continue to render normally. */
        #grid-view.view.active > #days-grid.daily-day-layout-pebbles-v229{
            grid-template-columns:repeat(auto-fill,82px)!important;
            justify-content:start!important;
            gap:13px!important;
        }
        #grid-view.view.active > #days-grid.daily-day-layout-pebbles-v229 > *{
            width:82px!important;
            height:78px!important;
        }
        #grid-view.view.active > #days-grid.daily-day-layout-pebbles-v229 .day-box{
            width:78px!important;
            height:74px!important;
            min-height:74px!important;
            aspect-ratio:auto!important;
            font-size:1.48rem!important;
        }
        #grid-view.view.active > #days-grid.daily-day-layout-pebbles-v229 > :nth-child(4n+1) .day-box{border-radius:58% 42% 54% 46% / 43% 57% 43% 57%!important;}
        #grid-view.view.active > #days-grid.daily-day-layout-pebbles-v229 > :nth-child(4n+2) .day-box{border-radius:45% 55% 39% 61% / 58% 42% 58% 42%!important;}
        #grid-view.view.active > #days-grid.daily-day-layout-pebbles-v229 > :nth-child(4n+3) .day-box{border-radius:62% 38% 58% 42% / 48% 59% 41% 52%!important;}
        #grid-view.view.active > #days-grid.daily-day-layout-pebbles-v229 > :nth-child(4n) .day-box{border-radius:40% 60% 48% 52% / 61% 39% 55% 45%!important;}

        /* PILLS — wide capsules. */
        #grid-view.view.active > #days-grid.daily-day-layout-pills-v229{
            grid-template-columns:repeat(auto-fill,minmax(96px,1fr))!important;
            gap:10px!important;
        }
        #grid-view.view.active > #days-grid.daily-day-layout-pills-v229 .day-box{
            aspect-ratio:auto!important;
            min-height:50px!important;
            height:50px!important;
            border-radius:999px!important;
            font-size:1.3rem!important;
        }

        /* DOMINOES — tall portrait tiles. */
        #grid-view.view.active > #days-grid.daily-day-layout-dominoes-v229{
            grid-template-columns:repeat(auto-fill,58px)!important;
            justify-content:start!important;
            gap:11px!important;
        }
        #grid-view.view.active > #days-grid.daily-day-layout-dominoes-v229 > *{
            width:58px!important;
            height:88px!important;
        }
        #grid-view.view.active > #days-grid.daily-day-layout-dominoes-v229 .day-box{
            width:58px!important;
            height:88px!important;
            min-height:88px!important;
            aspect-ratio:auto!important;
            border-radius:999px!important;
            font-size:1.3rem!important;
        }

        /* ZIGZAG — circular stepping stones. */
        #grid-view.view.active > #days-grid.daily-day-layout-zigzag-v229{
            grid-template-columns:repeat(auto-fill,72px)!important;
            justify-content:start!important;
            column-gap:11px!important;
            row-gap:28px!important;
            padding-top:16px!important;
            padding-bottom:18px!important;
        }
        #grid-view.view.active > #days-grid.daily-day-layout-zigzag-v229 > *{
            width:72px!important;
            height:72px!important;
        }
        #grid-view.view.active > #days-grid.daily-day-layout-zigzag-v229 > :nth-child(even){transform:translateY(16px)!important;}
        #grid-view.view.active > #days-grid.daily-day-layout-zigzag-v229 .day-box{
            width:72px!important;
            height:72px!important;
            min-height:72px!important;
            aspect-ratio:1!important;
            border-radius:50%!important;
            font-size:1.45rem!important;
        }

        /* WAVE — one horizontally scrollable ribbon of themed circles. */
        #grid-view.view.active > #days-grid.daily-day-layout-wave-v229{
            display:grid!important;
            grid-auto-flow:column!important;
            grid-auto-columns:68px!important;
            grid-template-columns:none!important;
            align-items:center!important;
            justify-content:start!important;
            column-gap:11px!important;
            min-height:132px!important;
            padding:30px 4px!important;
            overflow-x:auto!important;
            overflow-y:hidden!important;
            overscroll-behavior-x:contain!important;
        }
        #grid-view.view.active > #days-grid.daily-day-layout-wave-v229 > *{
            width:68px!important;
            height:68px!important;
        }
        #grid-view.view.active > #days-grid.daily-day-layout-wave-v229 > :nth-child(8n+1),
        #grid-view.view.active > #days-grid.daily-day-layout-wave-v229 > :nth-child(8n){transform:translateY(0)!important;}
        #grid-view.view.active > #days-grid.daily-day-layout-wave-v229 > :nth-child(8n+2),
        #grid-view.view.active > #days-grid.daily-day-layout-wave-v229 > :nth-child(8n+7){transform:translateY(-18px)!important;}
        #grid-view.view.active > #days-grid.daily-day-layout-wave-v229 > :nth-child(8n+3),
        #grid-view.view.active > #days-grid.daily-day-layout-wave-v229 > :nth-child(8n+6){transform:translateY(-28px)!important;}
        #grid-view.view.active > #days-grid.daily-day-layout-wave-v229 > :nth-child(8n+4),
        #grid-view.view.active > #days-grid.daily-day-layout-wave-v229 > :nth-child(8n+5){transform:translateY(-34px)!important;}
        #grid-view.view.active > #days-grid.daily-day-layout-wave-v229 .day-box{
            width:68px!important;
            height:68px!important;
            min-height:68px!important;
            aspect-ratio:1!important;
            border-radius:50%!important;
            font-size:1.4rem!important;
        }


        /* DROPLETS — soft teardrop silhouettes without clip-paths, preserving theme borders. */
        #grid-view.view.active > #days-grid.daily-day-layout-droplets-v229{
            grid-template-columns:repeat(auto-fill,78px)!important;
            justify-content:start!important;
            gap:13px!important;
        }
        #grid-view.view.active > #days-grid.daily-day-layout-droplets-v229 > *{width:78px!important;height:82px!important;}
        #grid-view.view.active > #days-grid.daily-day-layout-droplets-v229 .day-box{
            width:74px!important;height:80px!important;min-height:80px!important;aspect-ratio:auto!important;
            border-radius:56% 44% 62% 38% / 42% 48% 52% 58%!important;
        }
        #grid-view.view.active > #days-grid.daily-day-layout-droplets-v229 > :nth-child(even) .day-box{
            border-radius:44% 56% 38% 62% / 48% 42% 58% 52%!important;
        }

        /* PETALS — alternating petal-shaped tiles. */
        #grid-view.view.active > #days-grid.daily-day-layout-petals-v229{
            grid-template-columns:repeat(auto-fill,78px)!important;justify-content:start!important;gap:14px!important;
        }
        #grid-view.view.active > #days-grid.daily-day-layout-petals-v229 > *{width:78px!important;height:78px!important;}
        #grid-view.view.active > #days-grid.daily-day-layout-petals-v229 .day-box{
            width:76px!important;height:76px!important;min-height:76px!important;aspect-ratio:1!important;
            border-radius:72% 28% 68% 32% / 68% 32% 72% 28%!important;
        }
        #grid-view.view.active > #days-grid.daily-day-layout-petals-v229 > :nth-child(even) .day-box{
            border-radius:28% 72% 32% 68% / 32% 68% 28% 72%!important;
        }

        /* BADGES — rounded crest-like tiles. */
        #grid-view.view.active > #days-grid.daily-day-layout-badges-v229{
            grid-template-columns:repeat(auto-fill,80px)!important;justify-content:start!important;gap:12px!important;
        }
        #grid-view.view.active > #days-grid.daily-day-layout-badges-v229 > *{width:80px!important;height:86px!important;}
        #grid-view.view.active > #days-grid.daily-day-layout-badges-v229 .day-box{
            width:78px!important;height:84px!important;min-height:84px!important;aspect-ratio:auto!important;
            border-radius:48% 48% 28% 28% / 42% 42% 24% 24%!important;
        }

        /* CLOUDS — wide, puffy organic cards. */
        #grid-view.view.active > #days-grid.daily-day-layout-clouds-v229{
            grid-template-columns:repeat(auto-fill,108px)!important;justify-content:start!important;gap:12px!important;
        }
        #grid-view.view.active > #days-grid.daily-day-layout-clouds-v229 > *{width:108px!important;height:62px!important;}
        #grid-view.view.active > #days-grid.daily-day-layout-clouds-v229 .day-box{
            width:104px!important;height:60px!important;min-height:60px!important;aspect-ratio:auto!important;
            border-radius:54% 46% 52% 48% / 72% 68% 42% 38%!important;
        }
        #grid-view.view.active > #days-grid.daily-day-layout-clouds-v229 > :nth-child(3n+2) .day-box{
            border-radius:46% 54% 44% 56% / 65% 76% 35% 44%!important;
        }

        /* HONEYCOMB — tightly packed rounded cells with a staggered second lane. */
        #grid-view.view.active > #days-grid.daily-day-layout-honeycomb-v229{
            grid-template-columns:repeat(auto-fill,70px)!important;justify-content:start!important;
            column-gap:5px!important;row-gap:24px!important;padding-top:4px!important;padding-bottom:18px!important;
        }
        #grid-view.view.active > #days-grid.daily-day-layout-honeycomb-v229 > *{width:70px!important;height:64px!important;}
        #grid-view.view.active > #days-grid.daily-day-layout-honeycomb-v229 > :nth-child(even){transform:translateY(18px)!important;}
        #grid-view.view.active > #days-grid.daily-day-layout-honeycomb-v229 .day-box{
            width:68px!important;height:62px!important;min-height:62px!important;aspect-ratio:auto!important;border-radius:27%!important;
        }

        /* STAIRCASE — horizontally scrollable stepping stones. */
        #grid-view.view.active > #days-grid.daily-day-layout-staircase-v229{
            display:grid!important;grid-auto-flow:column!important;grid-auto-columns:68px!important;grid-template-columns:none!important;
            justify-content:start!important;align-items:start!important;column-gap:10px!important;min-height:142px!important;
            padding:12px 4px 34px!important;overflow-x:auto!important;overflow-y:hidden!important;overscroll-behavior-x:contain!important;
        }
        #grid-view.view.active > #days-grid.daily-day-layout-staircase-v229 > *{width:68px!important;height:68px!important;}
        #grid-view.view.active > #days-grid.daily-day-layout-staircase-v229 > :nth-child(6n+1){transform:translateY(0)!important;}
        #grid-view.view.active > #days-grid.daily-day-layout-staircase-v229 > :nth-child(6n+2){transform:translateY(12px)!important;}
        #grid-view.view.active > #days-grid.daily-day-layout-staircase-v229 > :nth-child(6n+3){transform:translateY(24px)!important;}
        #grid-view.view.active > #days-grid.daily-day-layout-staircase-v229 > :nth-child(6n+4){transform:translateY(36px)!important;}
        #grid-view.view.active > #days-grid.daily-day-layout-staircase-v229 > :nth-child(6n+5){transform:translateY(24px)!important;}
        #grid-view.view.active > #days-grid.daily-day-layout-staircase-v229 > :nth-child(6n){transform:translateY(12px)!important;}
        #grid-view.view.active > #days-grid.daily-day-layout-staircase-v229 .day-box{
            width:66px!important;height:66px!important;min-height:66px!important;aspect-ratio:1!important;border-radius:50%!important;
        }

        /* ARCHES — circular days rise and fall in repeating arches. */
        #grid-view.view.active > #days-grid.daily-day-layout-arches-v229{
            display:grid!important;grid-auto-flow:column!important;grid-auto-columns:66px!important;grid-template-columns:none!important;
            justify-content:start!important;align-items:center!important;column-gap:9px!important;min-height:138px!important;
            padding:34px 4px 24px!important;overflow-x:auto!important;overflow-y:hidden!important;overscroll-behavior-x:contain!important;
        }
        #grid-view.view.active > #days-grid.daily-day-layout-arches-v229 > *{width:66px!important;height:66px!important;}
        #grid-view.view.active > #days-grid.daily-day-layout-arches-v229 > :nth-child(7n+1),
        #grid-view.view.active > #days-grid.daily-day-layout-arches-v229 > :nth-child(7n){transform:translateY(26px)!important;}
        #grid-view.view.active > #days-grid.daily-day-layout-arches-v229 > :nth-child(7n+2),
        #grid-view.view.active > #days-grid.daily-day-layout-arches-v229 > :nth-child(7n+6){transform:translateY(13px)!important;}
        #grid-view.view.active > #days-grid.daily-day-layout-arches-v229 > :nth-child(7n+3),
        #grid-view.view.active > #days-grid.daily-day-layout-arches-v229 > :nth-child(7n+5){transform:translateY(4px)!important;}
        #grid-view.view.active > #days-grid.daily-day-layout-arches-v229 > :nth-child(7n+4){transform:translateY(0)!important;}
        #grid-view.view.active > #days-grid.daily-day-layout-arches-v229 .day-box{
            width:64px!important;height:64px!important;min-height:64px!important;aspect-ratio:1!important;border-radius:50%!important;
        }

        /* MOSAIC — mixed wide and compact rounded cells in a dense tile wall. */
        #grid-view.view.active > #days-grid.daily-day-layout-mosaic-v229{
            display:grid!important;grid-template-columns:repeat(auto-fill,minmax(62px,1fr))!important;grid-auto-flow:dense!important;
            grid-auto-rows:62px!important;gap:9px!important;justify-content:stretch!important;
        }
        #grid-view.view.active > #days-grid.daily-day-layout-mosaic-v229 > *{width:auto!important;height:62px!important;}
        #grid-view.view.active > #days-grid.daily-day-layout-mosaic-v229 > :nth-child(7n+1),
        #grid-view.view.active > #days-grid.daily-day-layout-mosaic-v229 > :nth-child(7n+5){grid-column:span 2!important;}
        #grid-view.view.active > #days-grid.daily-day-layout-mosaic-v229 .day-box{
            width:100%!important;height:62px!important;min-height:62px!important;aspect-ratio:auto!important;border-radius:26px!important;
        }
        #grid-view.view.active > #days-grid.daily-day-layout-mosaic-v229 > :not(:nth-child(7n+1)):not(:nth-child(7n+5)) .day-box{
            border-radius:50%!important;
        }

        /* TICKETS — low rectangular stubs with alternating corner cuts. */
        #grid-view.view.active > #days-grid.daily-day-layout-tickets-v229{
            grid-template-columns:repeat(auto-fill,minmax(92px,1fr))!important;gap:10px!important;
        }
        #grid-view.view.active > #days-grid.daily-day-layout-tickets-v229 .day-box{
            aspect-ratio:auto!important;height:54px!important;min-height:54px!important;border-radius:20px 6px 20px 6px!important;
        }
        #grid-view.view.active > #days-grid.daily-day-layout-tickets-v229 > :nth-child(even) .day-box{
            border-radius:6px 20px 6px 20px!important;
        }

        /* ORBIT — two alternating circular lanes in one horizontal track. */
        #grid-view.view.active > #days-grid.daily-day-layout-orbit-v229{
            display:grid!important;grid-auto-flow:column!important;grid-auto-columns:70px!important;grid-template-columns:none!important;
            align-items:center!important;justify-content:start!important;column-gap:10px!important;min-height:142px!important;
            padding:32px 4px!important;overflow-x:auto!important;overflow-y:hidden!important;overscroll-behavior-x:contain!important;
        }
        #grid-view.view.active > #days-grid.daily-day-layout-orbit-v229 > *{width:70px!important;height:70px!important;}
        #grid-view.view.active > #days-grid.daily-day-layout-orbit-v229 > :nth-child(4n+1),
        #grid-view.view.active > #days-grid.daily-day-layout-orbit-v229 > :nth-child(4n+2){transform:translateY(-22px)!important;}
        #grid-view.view.active > #days-grid.daily-day-layout-orbit-v229 > :nth-child(4n+3),
        #grid-view.view.active > #days-grid.daily-day-layout-orbit-v229 > :nth-child(4n){transform:translateY(22px)!important;}
        #grid-view.view.active > #days-grid.daily-day-layout-orbit-v229 .day-box{
            width:68px!important;height:68px!important;min-height:68px!important;aspect-ratio:1!important;border-radius:50%!important;
        }

        /* CLOVER — four alternating soft lobed profiles. */
        #grid-view.view.active > #days-grid.daily-day-layout-clover-v229{
            grid-template-columns:repeat(auto-fill,80px)!important;justify-content:start!important;gap:13px!important;
        }
        #grid-view.view.active > #days-grid.daily-day-layout-clover-v229 > *{width:80px!important;height:80px!important;}
        #grid-view.view.active > #days-grid.daily-day-layout-clover-v229 .day-box{
            width:78px!important;height:78px!important;min-height:78px!important;aspect-ratio:1!important;
            border-radius:58% 42% 58% 42% / 42% 58% 42% 58%!important;
        }
        #grid-view.view.active > #days-grid.daily-day-layout-clover-v229 > :nth-child(2n) .day-box{
            border-radius:42% 58% 42% 58% / 58% 42% 58% 42%!important;
        }

        /* LANTERNS — tall oval-top / softly tapered-bottom tiles. */
        #grid-view.view.active > #days-grid.daily-day-layout-lanterns-v229{
            grid-template-columns:repeat(auto-fill,70px)!important;justify-content:start!important;gap:12px!important;
        }
        #grid-view.view.active > #days-grid.daily-day-layout-lanterns-v229 > *{width:70px!important;height:88px!important;}
        #grid-view.view.active > #days-grid.daily-day-layout-lanterns-v229 .day-box{
            width:68px!important;height:86px!important;min-height:86px!important;aspect-ratio:auto!important;
            border-radius:48% 48% 32% 32% / 36% 36% 20% 20%!important;
        }

        /* Theme compatibility bridge: intentionally DO NOT set background, color,
           border, border-width/style/color, box-shadow, font-family, or hover filter
           for any V229/V230 layout. Those remain owned by the original .day-box rules and
           whichever legacy/current theme is active. */
    `;
    document.head.appendChild(style);

    function applyDailyDayLayoutV229() {
        const grid = document.getElementById('days-grid');
        if (!grid) return;

        grid.classList.remove(...NEW_CLASSES);
        // initGrid() rebuilds children, but clear the transforms as a defensive path
        // for live setting changes or older wrappers that reuse the same nodes.
        qa(':scope > *', grid).forEach(child => child.style.removeProperty('transform'));

        if ((db.settings?.dailyViewType || 'default') === 'polaroid') return;
        const layout = db.settings?.dailyDayLayoutV228 || 'grid';
        if (!NEW_LAYOUTS.includes(layout)) return; // V228 remains authoritative for its original four.
        grid.classList.add(`daily-day-layout-${layout}-v229`);
    }

    function syncDailyDayLayoutV229(modal) {
        if (!modal) return;
        const current = db.settings?.dailyDayLayoutV228 || 'grid';
        qa('[data-daily-layout-v228]', modal).forEach(button => {
            const on = button.dataset.dailyLayoutV228 === current;
            button.classList.toggle('active', on);
            button.setAttribute('aria-pressed', on ? 'true' : 'false');
        });
    }

    function ensureDailyDayLayoutChoicesV229(modal) {
        if (!modal) return;
        const picker = q('.daily-day-layout-picker-v228', modal);
        if (!picker) return;

        const choices = [
            ['bubbles','Bubbles'],
            ['pebbles','Pebbles'],
            ['pills','Pills'],
            ['dominoes','Dominoes'],
            ['zigzag','Zigzag'],
            ['wave','Wave'],
            ['droplets','Droplets'],
            ['petals','Petals'],
            ['badges','Badges'],
            ['clouds','Clouds'],
            ['honeycomb','Honeycomb'],
            
            ['arches','Arches'],
            ['mosaic','Mosaic'],
            ['tickets','Tickets'],
            ['orbit','Orbit'],
            ['clover','Clover'],
            ['lanterns','Lanterns']
        ];
        choices.forEach(([value, label]) => {
            if (q(`[data-daily-layout-v228="${value}"]`, picker)) return;
            const button = document.createElement('button');
            button.type = 'button';
            button.className = 'filter-tab';
            button.dataset.dailyLayoutV228 = value;
            button.textContent = label;
            button.addEventListener('click', () => {
                db.settings ||= {};
                db.settings.dailyDayLayoutV228 = value;
                syncDailyDayLayoutV229(modal);
                try { saveDb(); } catch {}
                try { initGrid(); } catch { applyDailyDayLayoutV229(); }
            });
            picker.appendChild(button);
        });
        syncDailyDayLayoutV229(modal);
    }

    try {
        const beforeEnsureDailyV229 = ensureDailyLogsSettingsModal;
        ensureDailyLogsSettingsModal = function(...args) {
            const modal = beforeEnsureDailyV229.apply(this, args);
            ensureDailyDayLayoutChoicesV229(modal);
            return modal;
        };
    } catch {}

    try {
        const beforeOpenDailyV229 = openDailyLogsLocalSettings;
        openDailyLogsLocalSettings = function(...args) {
            const result = beforeOpenDailyV229.apply(this, args);
            const modal = document.getElementById('daily-logs-local-settings-modal');
            ensureDailyDayLayoutChoicesV229(modal);
            syncDailyDayLayoutV229(modal);
            return result;
        };
    } catch {}

    try {
        const beforeInitGridV229 = initGrid;
        initGrid = function(...args) {
            const result = beforeInitGridV229.apply(this, args);
            applyDailyDayLayoutV229();
            return result;
        };
    } catch {}

    requestAnimationFrame(() => {
        try { ensureDailyDayLayoutChoicesV229(document.getElementById('daily-logs-local-settings-modal')); } catch {}
        try { applyDailyDayLayoutV229(); } catch {}
    });
})();

/* ============================================================
   V231 — true paged Daily Logs layouts + newest-page landing +
   additional themed geometry layouts.

   Paged means a complete composition is shown at once. Moving right/left
   changes to a fresh composition; it never extends the same composition.
   Every numbered day remains the original .day-box/.has-data element, so
   legacy themes keep ownership of colors, borders, shadows, and hover rules.
   ============================================================ */
(() => {
    'use strict';
    if (window.__loggyHotfixV231) return;
    window.__loggyHotfixV231 = true;

    const q = (selector, root = document) => root?.querySelector?.(selector) || null;
    const qa = (selector, root = document) => Array.from(root?.querySelectorAll?.(selector) || []);

    const EXTRA_LAYOUTS_V231 = [
        ['diamonds', 'Diamonds'],
        ['leaves', 'Leaves'],
        ['gems', 'Gems'],
        ['shields', 'Shields'],
        ['ribbons', 'Ribbons'],
        ['pyramid', 'Pyramid'],
        ['clock', 'Clock'],
        ['spiral', 'Spiral'],
        ['constellation', 'Constellation'],
        ['snake', 'Snake'],
        ['fan', 'Fan'],
        ['clean', 'Clean']
    ];

    const PAGE_CONFIG_V231 = {
        periodic:      { size: 118, kind: 'periodic' },
        wave:          { size: 40,  kind: 'grid', cols: 8, rows: 5 },
        staircase:     { size: 36,  kind: 'grid', cols: 6, rows: 6 },
        arches:        { size: 35,  kind: 'grid', cols: 7, rows: 5 },
        orbit:         { size: 32,  kind: 'grid', cols: 8, rows: 4 },
        diamonds:      { size: 48,  kind: 'grid', cols: 8, rows: 6 },
        leaves:        { size: 48,  kind: 'grid', cols: 8, rows: 6 },
        gems:          { size: 48,  kind: 'grid', cols: 8, rows: 6 },
        shields:       { size: 48,  kind: 'grid', cols: 8, rows: 6 },
        ribbons:       { size: 48,  kind: 'grid', cols: 8, rows: 6 },
        pyramid:       { size: 36,  kind: 'pyramid' },
        clock:         { size: 24,  kind: 'clock' },
        spiral:        { size: 20,  kind: 'spiral' },
        constellation: { size: 36,  kind: 'constellation' },
        snake:         { size: 42,  kind: 'snake', cols: 7, rows: 6 },
        fan:           { size: 28,  kind: 'fan' },
        clean:         { size: 48,  kind: 'grid', cols: 8, rows: 6 }
    };

    const PAGED_LAYOUTS_V231 = new Set(Object.keys(PAGE_CONFIG_V231));
    const EXTRA_CLASS_NAMES_V231 = EXTRA_LAYOUTS_V231.map(([name]) => `daily-day-layout-${name}-v231`);

    const style = document.createElement('style');
    style.id = 'loggy-hotfix-v231-day-pages-style';
    style.textContent = `
        #daily-day-pager-v231{
            flex:0 0 auto!important;
            display:none;
            align-items:center!important;
            justify-content:flex-end!important;
            gap:8px!important;
            min-height:38px!important;
            margin:0 0 10px!important;
        }
        #daily-day-pager-v231.visible-v231{display:flex!important;}
        #daily-day-pager-v231 .daily-page-label-v231{
            color:var(--black)!important;
            font:inherit!important;
            font-size:.82rem!important;
            font-weight:800!important;
            min-width:150px!important;
            text-align:center!important;
        }
        #daily-day-pager-v231 .daily-page-btn-v231{
            width:36px!important;
            height:36px!important;
            min-width:36px!important;
            display:inline-flex!important;
            align-items:center!important;
            justify-content:center!important;
            border:var(--thin-border)!important;
            border-radius:10px!important;
            background:var(--white)!important;
            color:var(--black)!important;
            font:inherit!important;
            cursor:pointer!important;
        }
        #daily-day-pager-v231 .daily-page-btn-v231:disabled{opacity:.35!important;cursor:not-allowed!important;}

        /* Pagination never changes theme-owned visual paint on the original tile. */
        #grid-view.view.active > #days-grid .daily-page-hidden-v231{display:none!important;}

        /* A Periodic Table page is a complete 18 x 9 composition. No sideways
           continuation is allowed inside a page. JS chooses a cell size that
           fits the available days container. */
        #grid-view.view.active > #days-grid.daily-day-layout-periodic-v228.daily-paged-layout-v231{
            display:grid!important;
            width:100%!important;
            box-sizing:border-box!important;
            justify-content:stretch!important;
            align-content:start!important;
            overflow-x:hidden!important;
            overflow-y:hidden!important;
            padding:2px 0 8px!important;
            scrollbar-width:none!important;
        }
        #grid-view.view.active > #days-grid.daily-day-layout-periodic-v228.daily-paged-layout-v231 > :not(.daily-page-hidden-v231){
            width:100%!important;
            min-width:0!important;
            max-width:none!important;
            height:var(--daily-periodic-cell-v231,44px)!important;
            transform:none!important;
        }
        #grid-view.view.active > #days-grid.daily-day-layout-periodic-v228.daily-paged-layout-v231 .day-box{
            width:100%!important;
            height:100%!important;
            min-height:0!important;
            aspect-ratio:1!important;
            border-radius:clamp(4px,16%,11px)!important;
            font-size:clamp(.62rem,calc(var(--daily-periodic-cell-v231,44px) * .30),1.45rem)!important;
        }

        /* V231's paged Wave/Staircase/Arches/Orbit use finite row-major pages,
           overriding the older endless horizontal auto-flow versions. */
        #grid-view.view.active > #days-grid.daily-paged-pattern-v231{
            display:grid!important;
            width:100%!important;
            box-sizing:border-box!important;
            grid-auto-flow:row!important;
            grid-auto-columns:auto!important;
            justify-content:stretch!important;
            align-content:start!important;
            overflow-x:hidden!important;
            overflow-y:auto!important;
            padding:12px 0!important;
        }
        #grid-view.view.active > #days-grid.daily-paged-pattern-v231 > :not(.daily-page-hidden-v231){
            width:100%!important;
            height:var(--daily-pattern-cell-v231,64px)!important;
            min-width:0!important;
        }
        #grid-view.view.active > #days-grid.daily-paged-pattern-v231 .day-box{
            width:100%!important;
            height:100%!important;
            min-height:0!important;
            aspect-ratio:1!important;
        }

        /* New V231 layouts only alter geometry. No background/color/border paint. */
        #grid-view.view.active > #days-grid.daily-day-layout-diamonds-v231 .day-box{
            clip-path:polygon(50% 2%,98% 50%,50% 98%,2% 50%)!important;
            border-radius:8px!important;
        }
        #grid-view.view.active > #days-grid.daily-day-layout-leaves-v231 .day-box{
            border-radius:72% 18% 72% 18% / 72% 18% 72% 18%!important;
        }
        #grid-view.view.active > #days-grid.daily-day-layout-gems-v231 .day-box{
            clip-path:polygon(24% 4%,76% 4%,98% 35%,78% 96%,22% 96%,2% 35%)!important;
            border-radius:5px!important;
        }
        #grid-view.view.active > #days-grid.daily-day-layout-shields-v231 .day-box{
            clip-path:polygon(10% 5%,90% 5%,94% 57%,50% 98%,6% 57%)!important;
            border-radius:8px!important;
        }
        #grid-view.view.active > #days-grid.daily-day-layout-ribbons-v231 .day-box{
            clip-path:polygon(8% 12%,92% 12%,82% 50%,92% 88%,8% 88%,18% 50%)!important;
            border-radius:7px!important;
        }
        #grid-view.view.active > #days-grid.daily-day-layout-clock-v231 .day-box,
        #grid-view.view.active > #days-grid.daily-day-layout-spiral-v231 .day-box,
        #grid-view.view.active > #days-grid.daily-day-layout-constellation-v231 .day-box,
        #grid-view.view.active > #days-grid.daily-day-layout-fan-v231 .day-box{
            border-radius:50%!important;
        }
        #grid-view.view.active > #days-grid.daily-day-layout-pyramid-v231 .day-box{
            clip-path:polygon(50% 2%,98% 94%,2% 94%)!important;
            border-radius:8px!important;
        }
        #grid-view.view.active > #days-grid.daily-day-layout-snake-v231 .day-box{
            border-radius:28px 10px 28px 10px!important;
        }

        /* V257 Clean: numbers only — no card box, shape, shadow, or fill. */
        #grid-view.view.active > #days-grid.daily-day-layout-clean-v231 > [data-day]{
            display:grid!important;
            place-items:center!important;
        }
        #grid-view.view.active > #days-grid.daily-day-layout-clean-v231 .day-box,
        #grid-view.view.active > #days-grid.daily-day-layout-clean-v231 > .daily-add-day-slot-v238 > .day-box{
            width:100%!important;
            height:100%!important;
            min-width:0!important;
            min-height:0!important;
            padding:0!important;
            margin:0!important;
            aspect-ratio:auto!important;
            background:transparent!important;
            background-image:none!important;
            border:0!important;
            outline:0!important;
            border-radius:0!important;
            clip-path:none!important;
            box-shadow:none!important;
            filter:none!important;
            transform:none!important;
            display:grid!important;
            place-items:center!important;
            font-size:clamp(1.25rem,2.15vw,1.85rem)!important;
            font-weight:700!important;
            line-height:1.2!important;
            overflow:visible!important;
        }
        #grid-view.view.active > #days-grid.daily-day-layout-clean-v231 .day-box:hover,
        #grid-view.view.active > #days-grid.daily-day-layout-clean-v231 .day-box:focus-visible{
            background:transparent!important;
            border-radius:0!important;
            text-decoration:underline!important;
            text-underline-offset:4px!important;
        }

        /* V329 Clean is a fixed page, never a vertically scrolling mini-grid. */
        #grid-view.view.active > #days-grid.daily-day-layout-clean-v231.daily-paged-pattern-v231{
            overflow-x:hidden!important;
            overflow-y:hidden!important;
            padding:8px 0 14px!important;
            align-content:start!important;
        }
        #grid-view.view.active > #days-grid.daily-day-layout-clean-v231.daily-paged-pattern-v231 > :not(.daily-page-hidden-v231){
            overflow:visible!important;
        }

        #grid-view.view.active > #days-grid.daily-absolute-page-v231{
            position:relative!important;
            display:block!important;
            width:100%!important;
            box-sizing:border-box!important;
            overflow:hidden!important;
            min-height:300px!important;
            padding:0!important;
        }
        #grid-view.view.active > #days-grid.daily-absolute-page-v231 > :not(.daily-page-hidden-v231){
            position:absolute!important;
            width:var(--daily-absolute-cell-v231,58px)!important;
            height:var(--daily-absolute-cell-v231,58px)!important;
            margin:0!important;
        }
        #grid-view.view.active > #days-grid.daily-absolute-page-v231 .day-box{
            width:100%!important;
            height:100%!important;
            min-height:0!important;
            aspect-ratio:1!important;
        }
    `;
    document.head.appendChild(style);

    function periodicPositionV231(atomic) {
        if (atomic === 1) return { col: 1, row: 1 };
        if (atomic === 2) return { col: 18, row: 1 };
        if (atomic >= 3 && atomic <= 4) return { col: atomic - 2, row: 2 };
        if (atomic >= 5 && atomic <= 10) return { col: atomic + 8, row: 2 };
        if (atomic >= 11 && atomic <= 12) return { col: atomic - 10, row: 3 };
        if (atomic >= 13 && atomic <= 18) return { col: atomic, row: 3 };
        if (atomic >= 19 && atomic <= 36) return { col: atomic - 18, row: 4 };
        if (atomic >= 37 && atomic <= 54) return { col: atomic - 36, row: 5 };
        if (atomic === 55) return { col: 1, row: 6 };
        if (atomic === 56) return { col: 2, row: 6 };
        if (atomic >= 57 && atomic <= 71) return { col: atomic - 54, row: 8 };
        if (atomic >= 72 && atomic <= 86) return { col: atomic - 68, row: 6 };
        if (atomic === 87) return { col: 1, row: 7 };
        if (atomic === 88) return { col: 2, row: 7 };
        if (atomic >= 89 && atomic <= 103) return { col: atomic - 86, row: 9 };
        if (atomic >= 104 && atomic <= 118) return { col: atomic - 100, row: 7 };
        return { col: 1, row: 1 };
    }

    function currentLayoutV231() {
        const layout = db?.settings?.dailyDayLayoutV228 || 'grid';
        return (layout === 'strip' || layout === 'heart') ? 'grid' : layout;
    }

    function isPagedLayoutV231(layout = currentLayoutV231()) {
        return PAGED_LAYOUTS_V231.has(layout) && (db?.settings?.dailyViewType || 'default') !== 'polaroid';
    }

    function childrenV231(grid) {
        return qa(':scope > [data-day]', grid).filter(el => Number.isFinite(Number(el.dataset.day)));
    }

    function maxRenderedDayV231(grid) {
        const nums = childrenV231(grid).map(el => Number(el.dataset.day));
        return nums.length ? Math.max(...nums) : 1;
    }

    function addDayButtonV231(grid) {
        return q(':scope > button.day-box[title="Add extra log day"], :scope > .polaroid-card[title="Add extra log day"], :scope > .daily-add-day-slot-v238 > button.day-box[title="Add extra log day"]', grid);
    }

    function addDayLayoutNodeV231(grid) {
        const button = addDayButtonV231(grid);
        return button?.closest?.('.daily-add-day-slot-v238') || button || null;
    }

    function addDayNumberV231(grid) {
        return maxRenderedDayV231(grid) + 1;
    }

    function newestTargetDayV231(grid) {
        const maxDay = maxRenderedDayV231(grid);
        let today = NaN;
        try { today = Number(getTodayCalculatedDayNumber()); } catch {}
        if (!Number.isFinite(today) || today < 1) today = maxDay;
        return Math.max(1, Math.min(maxDay, today));
    }

    function ensurePagerV231() {
        const grid = document.getElementById('days-grid');
        if (!grid) return null;
        let pager = document.getElementById('daily-day-pager-v231');
        if (!pager) {
            pager = document.createElement('div');
            pager.id = 'daily-day-pager-v231';
            pager.innerHTML = `
                <button type="button" class="daily-page-btn-v231" data-page-step-v231="-1" aria-label="Previous days page"><i class="ph ph-caret-left"></i></button>
                <span class="daily-page-label-v231" aria-live="polite"></span>
                <button type="button" class="daily-page-btn-v231" data-page-step-v231="1" aria-label="Next days page"><i class="ph ph-caret-right"></i></button>`;
            grid.insertAdjacentElement('beforebegin', pager);
            qa('[data-page-step-v231]', pager).forEach(button => {
                button.addEventListener('click', () => setDailyPageV231((window.__dailyPageIndexV231 || 0) + Number(button.dataset.pageStepV231 || 0), false));
            });
        }
        return pager;
    }

    function pageCountV231(grid, config) {
        const lastSlot = maxRenderedDayV231(grid) + (addDayButtonV231(grid) ? 1 : 0);
        return Math.max(1, Math.ceil(lastSlot / config.size));
    }

    function fitCellV231(grid, cols, rows, maxCell = 70, gap = 9) {
        const width = Math.max(260, grid.clientWidth || grid.getBoundingClientRect().width || 900);
        const byWidth = (width - gap * Math.max(0, cols - 1) - 2) / cols;
        return Math.max(16, Math.floor(byWidth));
    }

    function resetPagedGridV231(grid) {
        grid.classList.remove('daily-paged-layout-v231', 'daily-paged-pattern-v231', 'daily-absolute-page-v231', ...EXTRA_CLASS_NAMES_V231);
        [
            'grid-template-columns','grid-template-rows','grid-auto-columns','grid-auto-rows','grid-auto-flow',
            'justify-content','align-content','gap','overflow-x','overflow-y','position','height','min-height'
        ].forEach(prop => grid.style.removeProperty(prop));
        grid.style.removeProperty('--daily-periodic-cell-v231');
        grid.style.removeProperty('--daily-pattern-cell-v231');
        grid.style.removeProperty('--daily-absolute-cell-v231');
        childrenV231(grid).forEach(child => {
            child.classList.remove('daily-page-hidden-v231');
            ['grid-column','grid-row','transform','left','top','width','height','position','display'].forEach(prop => child.style.removeProperty(prop));
        });
        const addButton = addDayButtonV231(grid);
        const add = addDayLayoutNodeV231(grid);
        if (add) {
            add.classList.remove('daily-page-hidden-v231');
            ['grid-column','grid-row','transform','left','top','width','height','position','display'].forEach(prop => add.style.removeProperty(prop));
        }
        if (addButton && addButton !== add) {
            addButton.classList.remove('daily-page-hidden-v231');
            ['grid-column','grid-row','transform','left','top','width','height','position','display'].forEach(prop => addButton.style.removeProperty(prop));
        }
    }

    function showOnlyPageV231(grid, config, pageIndex) {
        const startDay = pageIndex * config.size + 1;
        const endDay = startDay + config.size - 1;
        const visible = [];
        childrenV231(grid).forEach(child => {
            const day = Number(child.dataset.day);
            const onPage = day >= startDay && day <= endDay;
            child.classList.toggle('daily-page-hidden-v231', !onPage);
            if (onPage) visible.push(child);
        });
        visible.sort((a,b) => Number(a.dataset.day) - Number(b.dataset.day));

        const addButton = addDayButtonV231(grid);
        const add = addDayLayoutNodeV231(grid);
        const addDay = addDayNumberV231(grid);
        const addOnPage = !!add && addDay >= startDay && addDay <= endDay;
        if (add) {
            add.classList.toggle('daily-page-hidden-v231', !addOnPage);
            add.classList.toggle('v251-hide-final-plus', !addOnPage);
            add.setAttribute('aria-hidden', String(!addOnPage));
        }
        if (addButton && addButton !== add) {
            addButton.classList.toggle('daily-page-hidden-v231', !addOnPage);
            addButton.classList.toggle('v251-hide-final-plus', !addOnPage);
            addButton.setAttribute('aria-hidden', String(!addOnPage));
        }

        return {
            visible,
            layoutNodes: addOnPage ? [...visible, add] : visible,
            add: addOnPage ? addButton : null,
            startDay,
            endDay: Math.min(endDay, maxRenderedDayV231(grid))
        };
    }

    function layoutPeriodicV231(grid, visible, pageIndex) {
        const gap = 6;
        const cell = fitCellV231(grid, 18, 9, 68, gap);
        grid.classList.add('daily-paged-layout-v231');
        grid.style.setProperty('--daily-periodic-cell-v231', `${cell}px`);
        grid.style.setProperty('grid-template-columns', 'repeat(18, minmax(0, 1fr))', 'important');
        grid.style.setProperty('grid-template-rows', `repeat(9, ${cell}px)`, 'important');
        grid.style.setProperty('gap', `${gap}px`, 'important');
        visible.forEach(child => {
            const day = Number(child.dataset.day) || addDayNumberV231(grid);
            const atomic = ((day - 1) % 118) + 1;
            const pos = periodicPositionV231(atomic);
            child.style.setProperty('grid-column', String(pos.col), 'important');
            child.style.setProperty('grid-row', String(pos.row), 'important');
            child.style.setProperty('transform', 'none', 'important');
        });
    }

    const waveOffsetsV231 = [0,-12,-22,-28,-28,-22,-12,0];
    const stairOffsetsV231 = [0,9,18,27,18,9];
    const archOffsetsV231 = [20,10,3,0,3,10,20];

    function layoutFiniteGridV231(grid, visible, layout, config) {
        const gap = layout === 'clean' ? 10 : 9;
        let cell = fitCellV231(grid, config.cols, config.rows, layout === 'clean' ? 82 : 70, gap);
        if (layout === 'clean') {
            const top = Math.max(0, grid.getBoundingClientRect().top || 0);
            const availableHeight = Math.max(250, (window.innerHeight || document.documentElement.clientHeight || 800) - top - 24);
            const byHeight = Math.floor((availableHeight - gap * Math.max(0, config.rows - 1) - 22) / config.rows);
            cell = Math.max(34, Math.min(cell, byHeight));
        }
        grid.classList.add('daily-paged-pattern-v231');
        grid.style.setProperty('--daily-pattern-cell-v231', `${cell}px`);
        grid.style.setProperty('grid-template-columns', `repeat(${config.cols}, minmax(0, 1fr))`, 'important');
        grid.style.setProperty('grid-template-rows', `repeat(${config.rows}, ${cell}px)`, 'important');
        grid.style.setProperty('gap', `${gap}px`, 'important');
        if (layout === 'clean') {
            grid.style.setProperty('overflow-y', 'hidden', 'important');
            grid.style.setProperty('height', `${config.rows * cell + Math.max(0, config.rows - 1) * gap + 22}px`, 'important');
            grid.style.setProperty('min-height', '0', 'important');
        }
        visible.forEach((child, index) => {
            const row = Math.floor(index / config.cols) + 1;
            const col = (index % config.cols) + 1;
            child.style.setProperty('grid-column', String(col), 'important');
            child.style.setProperty('grid-row', String(row), 'important');
            let transform = 'none';
            if (layout === 'wave') transform = `translateY(${Math.round(waveOffsetsV231[(col - 1) % 8] * Math.max(.55, cell / 70))}px)`;
            if (layout === 'staircase') transform = `translateY(${Math.round(stairOffsetsV231[(col - 1) % 6] * Math.max(.55, cell / 70))}px)`;
            if (layout === 'arches') transform = `translateY(${Math.round(archOffsetsV231[(col - 1) % 7] * Math.max(.55, cell / 70))}px)`;
            if (layout === 'orbit') transform = `translateY(${Math.round(((row + col) % 2 ? -16 : 16) * Math.max(.55, cell / 70))}px)`;
            child.style.setProperty('transform', transform, 'important');
        });
    }

    function layoutPyramidV231(grid, visible) {
        const gap = 7;
        const rows = 8;
        const cols = 15;
        const cell = fitCellV231(grid, cols, rows, 64, gap);
        grid.classList.add('daily-paged-pattern-v231', 'daily-day-layout-pyramid-v231');
        grid.style.setProperty('--daily-pattern-cell-v231', `${cell}px`);
        grid.style.setProperty('grid-template-columns', `repeat(${cols}, minmax(0, 1fr))`, 'important');
        grid.style.setProperty('grid-template-rows', `repeat(${rows}, ${cell}px)`, 'important');
        grid.style.setProperty('gap', `${gap}px`, 'important');
        let index = 0;
        for (let row = 1; row <= rows && index < visible.length; row++) {
            const count = row;
            const startCol = rows - row + 1;
            for (let j = 0; j < count && index < visible.length; j++, index++) {
                const child = visible[index];
                child.style.setProperty('grid-row', String(row), 'important');
                child.style.setProperty('grid-column', String(startCol + j * 2), 'important');
                child.style.setProperty('transform', 'none', 'important');
            }
        }
    }

    function absoluteFrameV231(grid, maxCell = 60) {
        grid.classList.add('daily-absolute-page-v231');
        const cs = getComputedStyle(grid);
        const padLeft = parseFloat(cs.paddingLeft) || 0;
        const padRight = parseFloat(cs.paddingRight) || 0;
        const outerWidth = Math.max(300, grid.clientWidth || grid.getBoundingClientRect().width || 900);
        const width = Math.max(260, outerWidth - padLeft - padRight);
        const height = Math.max(340, Math.round(width * .58));
        const cell = Math.max(34, Math.min(maxCell, Math.floor(width / 13)));
        grid.style.setProperty('height', `${height}px`, 'important');
        grid.style.setProperty('min-height', `${height}px`, 'important');
        grid.style.setProperty('--daily-absolute-cell-v231', `${cell}px`);
        return { width, height, cell, left: padLeft, cx: padLeft + width / 2, cy: height / 2 };
    }

    function setAbsolutePointV231(child, x, y, cell, transform = '') {
        child.style.setProperty('left', `${Math.round(x - cell / 2)}px`, 'important');
        child.style.setProperty('top', `${Math.round(y - cell / 2)}px`, 'important');
        child.style.setProperty('transform', transform || 'none', 'important');
    }

    function layoutClockV231(grid, visible) {
        grid.classList.add('daily-day-layout-clock-v231');
        const f = absoluteFrameV231(grid, 58);
        const rx = Math.max(90, f.width * .46);
        const ry = Math.max(90, f.height * .39);
        visible.forEach((child, i) => {
            const a = -Math.PI / 2 + (Math.PI * 2 * i / 24);
            setAbsolutePointV231(child, f.cx + Math.cos(a) * rx, f.cy + Math.sin(a) * ry, f.cell);
        });
    }

    function layoutSpiralV231(grid, visible) {
        grid.classList.add('daily-day-layout-spiral-v231');
        const f = absoluteFrameV231(grid, 44);
        const count = Math.max(1, visible.length);
        const maxR = Math.min(f.width * .44, f.height * .44);
        const minR = Math.max(24, maxR * .12);
        const radialStep = count <= 1 ? 0 : (maxR - minR) / (count - 1);
        const angularStep = 1.35;
        const points = visible.map((child, i) => {
            const a = -Math.PI / 2 + i * angularStep;
            const r = minR + i * radialStep;
            return { child, x: f.cx + Math.cos(a) * r, y: f.cy + Math.sin(a) * r * .82 };
        });
        let closest = Infinity;
        for (let i = 0; i < points.length; i++) {
            for (let j = i + 1; j < points.length; j++) {
                const dx = points[i].x - points[j].x;
                const dy = points[i].y - points[j].y;
                closest = Math.min(closest, Math.hypot(dx, dy));
            }
        }
        const spiralCell = Number.isFinite(closest)
            ? Math.max(24, Math.min(44, Math.floor(closest * .76)))
            : Math.min(44, f.cell);
        grid.style.setProperty('--daily-absolute-cell-v231', `${spiralCell}px`);
        points.forEach(point => setAbsolutePointV231(point.child, point.x, point.y, spiralCell));
    }

    function layoutConstellationV231(grid, visible) {
        grid.classList.add('daily-day-layout-constellation-v231');
        const f = absoluteFrameV231(grid, 50);
        const cols = 9, rows = 4;
        visible.forEach((child, i) => {
            const row = Math.floor(i / cols), col = i % cols;
            const jitterX = (((i * 37) % 17) - 8) * 1.2;
            const jitterY = (((i * 53) % 19) - 9) * 1.1;
            const x = (col + .65) * (f.width / cols) + jitterX;
            const y = (row + .62) * (f.height / rows) + jitterY;
            setAbsolutePointV231(child, x, y, f.cell);
        });
    }

    function layoutFanV231(grid, visible) {
        grid.classList.add('daily-day-layout-fan-v231');
        const f = absoluteFrameV231(grid, 54);
        const maxR = Math.min(f.width * .49, f.height * .80);
        visible.forEach((child, i) => {
            const band = Math.floor(i / 7);
            const within = i % 7;
            const a = Math.PI * (.14 + .72 * (within / 6));
            const r = maxR * (.46 + band * .16);
            setAbsolutePointV231(child, f.cx + Math.cos(a) * r, f.height * .88 - Math.sin(a) * r, f.cell);
        });
    }

    function layoutSnakeV231(grid, visible, config) {
        const gap = 10;
        const cell = fitCellV231(grid, config.cols, config.rows, 68, gap);
        grid.classList.add('daily-paged-pattern-v231', 'daily-day-layout-snake-v231');
        grid.style.setProperty('--daily-pattern-cell-v231', `${cell}px`);
        grid.style.setProperty('grid-template-columns', `repeat(${config.cols}, minmax(0, 1fr))`, 'important');
        grid.style.setProperty('grid-template-rows', `repeat(${config.rows}, ${cell}px)`, 'important');
        grid.style.setProperty('gap', `${gap}px`, 'important');
        visible.forEach((child, i) => {
            const row = Math.floor(i / config.cols);
            const offset = i % config.cols;
            const col = row % 2 === 0 ? offset : (config.cols - 1 - offset);
            child.style.setProperty('grid-row', String(row + 1), 'important');
            child.style.setProperty('grid-column', String(col + 1), 'important');
            child.style.setProperty('transform', 'none', 'important');
        });
    }

    function layoutCurrentPageV231(grid, layout, config, visible, pageIndex) {
        grid.classList.add('daily-paged-layout-v231');
        if (layout === 'periodic') return layoutPeriodicV231(grid, visible, pageIndex);
        if (['wave',,'arches','orbit','diamonds','leaves','gems','shields','ribbons','clean'].includes(layout)) {
            if (EXTRA_LAYOUTS_V231.some(([name]) => name === layout)) grid.classList.add(`daily-day-layout-${layout}-v231`);
            return layoutFiniteGridV231(grid, visible, layout, config);
        }
        if (layout === 'pyramid') return layoutPyramidV231(grid, visible);
        if (layout === 'clock') return layoutClockV231(grid, visible);
        if (layout === 'spiral') return layoutSpiralV231(grid, visible);
        if (layout === 'constellation') return layoutConstellationV231(grid, visible);
        if (layout === 'snake') return layoutSnakeV231(grid, visible, config);
        if (layout === 'fan') return layoutFanV231(grid, visible);
    }

    function syncPagerV231(grid, config, pageIndex, range) {
        const pager = ensurePagerV231();
        if (!pager) return;
        const total = pageCountV231(grid, config);
        pager.classList.toggle('visible-v231', total > 1 || isPagedLayoutV231());
        q('.daily-page-label-v231', pager).textContent = range.visible.length
            ? `Days ${range.startDay}–${range.endDay} · Page ${pageIndex + 1} of ${total}`
            : `New Day · Page ${pageIndex + 1} of ${total}`;
        const prev = q('[data-page-step-v231="-1"]', pager);
        const next = q('[data-page-step-v231="1"]', pager);
        if (prev) prev.disabled = pageIndex <= 0;
        if (next) next.disabled = pageIndex >= total - 1;
    }

    function setDailyPageV231(index, jumpToNewest = false) {
        const grid = document.getElementById('days-grid');
        if (!grid) return;
        const layout = currentLayoutV231();
        const config = PAGE_CONFIG_V231[layout];
        if (!config || (db.settings?.dailyViewType || 'default') === 'polaroid') {
            ensurePagerV231()?.classList.remove('visible-v231');
            return;
        }
        resetPagedGridV231(grid);
        // Restore the old layout class after reset if the layout belongs to V228/V229.
        if (layout === 'periodic') grid.classList.add('daily-day-layout-periodic-v228');
        if (['wave',,'arches','orbit'].includes(layout)) grid.classList.add(`daily-day-layout-${layout}-v229`);
        if (EXTRA_LAYOUTS_V231.some(([name]) => name === layout)) grid.classList.add(`daily-day-layout-${layout}-v231`);

        const total = pageCountV231(grid, config);
        if (jumpToNewest || !Number.isFinite(index)) {
            const target = newestTargetDayV231(grid);
            index = Math.floor((Math.max(1, target) - 1) / config.size);
        }
        index = Math.max(0, Math.min(total - 1, Math.trunc(index)));
        window.__dailyPageIndexV231 = index;
        const range = showOnlyPageV231(grid, config, index);
        layoutCurrentPageV231(grid, layout, config, range.layoutNodes, index);
        syncPagerV231(grid, config, index, range);
    }

    function applyPagedDailyLayoutV231(jumpToNewest = true) {
        const grid = document.getElementById('days-grid');
        if (!grid) return;
        const layout = currentLayoutV231();
        const pager = ensurePagerV231();
        if (!isPagedLayoutV231(layout)) {
            resetPagedGridV231(grid);
            pager?.classList.remove('visible-v231');
            return;
        }
        setDailyPageV231(window.__dailyPageIndexV231, jumpToNewest);
    }

    function ensureChoicesV231(modal) {
        if (!modal) return;
        const picker = q('.daily-day-layout-picker-v228', modal);
        if (!picker) return;
        EXTRA_LAYOUTS_V231.forEach(([value, label]) => {
            if (q(`[data-daily-layout-v228="${value}"]`, picker)) return;
            const button = document.createElement('button');
            button.type = 'button';
            button.className = 'filter-tab';
            button.dataset.dailyLayoutV228 = value;
            button.textContent = label;
            button.addEventListener('click', () => {
                db.settings ||= {};
                db.settings.dailyDayLayoutV228 = value;
                qa('[data-daily-layout-v228]', picker).forEach(b => {
                    const on = b === button;
                    b.classList.toggle('active', on);
                    b.setAttribute('aria-pressed', on ? 'true' : 'false');
                });
                try { saveDb(); } catch {}
                try { initGrid(); } catch { applyPagedDailyLayoutV231(true); }
            });
            picker.appendChild(button);
        });
        const current = currentLayoutV231();
        qa('[data-daily-layout-v228]', picker).forEach(button => {
            const on = button.dataset.dailyLayoutV228 === current;
            button.classList.toggle('active', on);
            button.setAttribute('aria-pressed', on ? 'true' : 'false');
        });
    }

    // Wrap after V228/V229 so their compatibility classes exist first; V231 then
    // converts only the layouts that should be true discrete pages.
    try {
        const beforeInitGridV231 = initGrid;
        initGrid = function(...args) {
            const result = beforeInitGridV231.apply(this, args);
            requestAnimationFrame(() => applyPagedDailyLayoutV231(true));
            return result;
        };
    } catch {}

    try {
        const beforeEnsureDailyV231 = ensureDailyLogsSettingsModal;
        ensureDailyLogsSettingsModal = function(...args) {
            const modal = beforeEnsureDailyV231.apply(this, args);
            ensureChoicesV231(modal);
            return modal;
        };
    } catch {}

    try {
        const beforeOpenDailyV231 = openDailyLogsLocalSettings;
        openDailyLogsLocalSettings = function(...args) {
            const result = beforeOpenDailyV231.apply(this, args);
            ensureChoicesV231(document.getElementById('daily-logs-local-settings-modal'));
            return result;
        };
    } catch {}

    // Trackpad/mouse horizontal scrolling changes exactly one complete page.
    // Vertical wheel input is left alone.
    const grid = document.getElementById('days-grid');
    if (grid && !grid.dataset.pagedWheelV231) {
        grid.dataset.pagedWheelV231 = '1';
        let wheelLock = false;
        grid.addEventListener('wheel', event => {
            if (!isPagedLayoutV231()) return;
            if (Math.abs(event.deltaX) < 22 || Math.abs(event.deltaX) <= Math.abs(event.deltaY)) return;
            event.preventDefault();
            if (wheelLock) return;
            wheelLock = true;
            setDailyPageV231((window.__dailyPageIndexV231 || 0) + (event.deltaX > 0 ? 1 : -1), false);
            setTimeout(() => { wheelLock = false; }, 260);
        }, { passive: false });

        let touchX = null;
        grid.addEventListener('touchstart', event => { touchX = event.touches?.[0]?.clientX ?? null; }, { passive: true });
        grid.addEventListener('touchend', event => {
            if (!isPagedLayoutV231() || touchX == null) return;
            const endX = event.changedTouches?.[0]?.clientX;
            if (!Number.isFinite(endX)) return;
            const dx = endX - touchX;
            touchX = null;
            if (Math.abs(dx) < 45) return;
            setDailyPageV231((window.__dailyPageIndexV231 || 0) + (dx < 0 ? 1 : -1), false);
        }, { passive: true });
    }

    // Re-fit a complete page when the viewport changes without changing pages.
    let resizeTimerV231 = null;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimerV231);
        resizeTimerV231 = setTimeout(() => {
            if (isPagedLayoutV231()) setDailyPageV231(window.__dailyPageIndexV231 || 0, false);
        }, 100);
    });

    // Daily Logs always opens on the page containing today's/latest rendered day.
    document.addEventListener('click', event => {
        if (!event.target.closest?.('#open-daily-logs-nav-btn')) return;
        requestAnimationFrame(() => requestAnimationFrame(() => applyPagedDailyLayoutV231(true)));
    }, true);

    window.__setDailyPageV231 = setDailyPageV231;

    requestAnimationFrame(() => {
        try { ensureChoicesV231(document.getElementById('daily-logs-local-settings-modal')); } catch {}
        try { applyPagedDailyLayoutV231(true); } catch {}
    });
})();


/* ============================================================
   V232 — full-width paged compositions, Add Day pagination,
   remove Horizontal Strip, and Ctrl + . jump-to-new-day shortcut.
   ============================================================ */
(() => {
    'use strict';
    if (window.__loggyHotfixV232) return;
    window.__loggyHotfixV232 = true;

    const q = (selector, root = document) => root?.querySelector?.(selector) || null;

    function cleanDailyLayoutPickerV232() {
        const modal = document.getElementById('daily-logs-local-settings-modal');
        q('[data-daily-layout-v228="strip"]', modal)?.remove();
        let savedLayout = null;
        try { savedLayout = db?.settings?.dailyDayLayoutV228 || null; } catch {}
        if (savedLayout === 'strip') {
            db.settings.dailyDayLayoutV228 = 'grid';
            try { saveDb(); } catch {}
            try { initGrid(); } catch {}
        }
    }

    function ensureShortcutRowV232() {
        const list = document.querySelector('#global-shortcuts-section .global-shortcuts-list');
        if (!list || list.querySelector('[data-shortcut-v232="new-day"]')) return;
        const row = document.createElement('div');
        row.className = 'global-shortcut-row';
        row.dataset.shortcutV232 = 'new-day';
        row.innerHTML = '<kbd>Ctrl</kbd><span>+</span><kbd>.</kbd><p>Jump to the New Day (+) tile in Daily Logs.</p>';
        const rows = list.querySelectorAll('.global-shortcut-row');
        if (rows.length > 2) rows[2].insertAdjacentElement('afterend', row);
        else list.appendChild(row);
    }

    function jumpToNewDayV232() {
        const gridView = document.getElementById('grid-view');
        const grid = document.getElementById('days-grid');
        if (!gridView?.classList.contains('active') || !grid) return false;

        const add = q(':scope > button.day-box[title="Add extra log day"], :scope > .polaroid-card[title="Add extra log day"], :scope > .daily-add-day-slot-v238 > button.day-box[title="Add extra log day"]', grid);
        if (!add) return false;

        let layout = 'grid';
        try { layout = db?.settings?.dailyDayLayoutV228 || 'grid'; } catch {}
        const configs = {
            periodic:118, wave:40, staircase:36, arches:35, orbit:32,
            diamonds:48, leaves:48, gems:48, shields:48, ribbons:48,
            pyramid:36, clock:24, spiral:20, constellation:36,
            snake:42, fan:28, clean:48
        };
        const size = configs[layout];
        if (size && typeof window.__setDailyPageV231 === 'function') {
            const maxDay = Math.max(1, ...Array.from(grid.querySelectorAll(':scope > [data-day]')).map(el => Number(el.dataset.day)).filter(Number.isFinite));
            const addDay = maxDay + 1;
            window.__setDailyPageV231(Math.floor((addDay - 1) / size), false);
        }

        requestAnimationFrame(() => requestAnimationFrame(() => {
            add.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
            try { add.focus({ preventScroll: true }); } catch { try { add.focus(); } catch {} }
        }));
        return true;
    }

    document.addEventListener('keydown', event => {
        if (!event.ctrlKey || event.altKey || event.metaKey || event.shiftKey) return;
        if (!(event.key === '.' || event.code === 'Period')) return;
        if (!document.getElementById('grid-view')?.classList.contains('active')) return;
        if (jumpToNewDayV232()) event.preventDefault();
    }, true);

    document.addEventListener('click', event => {
        if (event.target.closest?.('#open-daily-settings-btn')) setTimeout(cleanDailyLayoutPickerV232, 0);
        if (event.target.closest?.('#open-global-daily-settings-nav-btn')) setTimeout(ensureShortcutRowV232, 0);
    }, true);

    // V596: both jobs are driven by their actual Settings-open buttons above.
    // Watching every DOM mutation in the Log page caused unnecessary work on
    // ordinary clicks, chip renders, notes, theme updates, and modal changes.
    requestAnimationFrame(() => {
        cleanDailyLayoutPickerV232();
        ensureShortcutRowV232();
    });
})();

/* ============================================================
   V233 — paint-stable Daily Logs layouts.
   Prevent the default grid from being painted for one frame before a saved
   paged/custom layout (especially Periodic Table) reaches final geometry.
   ============================================================ */
(() => {
    'use strict';
    if (window.__loggyHotfixV233) return;
    window.__loggyHotfixV233 = true;

    const PAGED_V233 = new Set([
        'periodic','wave',,'arches','orbit',
        'diamonds','leaves','gems','shields','ribbons','pyramid',,
        'spiral','constellation','snake','fan','clean'
    ]);

    const style = document.createElement('style');
    style.id = 'loggy-hotfix-v233-no-layout-flash-style';
    style.textContent = `
        /* visibility keeps the grid measurable, unlike display:none, so the
           full-width page can be laid out correctly before the first paint. */
        body.daily-layout-preparing-v233 #grid-view #days-grid,
        body.daily-layout-preparing-v233 #grid-view #daily-day-pager-v231{
            visibility:hidden!important;
        }
    `;
    document.head.appendChild(style);

    function currentLayoutV233() {
        try {
            const value = db?.settings?.dailyDayLayoutV228 || 'grid';
            return value === 'strip' ? 'grid' : value;
        } catch {
            return 'grid';
        }
    }

    function isDefaultTileViewV233() {
        try { return (db?.settings?.dailyViewType || 'default') !== 'polaroid'; }
        catch { return true; }
    }

    function beginStablePaintV233() {
        document.body?.classList.add('daily-layout-preparing-v233');
    }

    function revealStablePaintV233() {
        document.body?.classList.remove('daily-layout-preparing-v233');
        window.__dailyLayoutNeedsRevealV233 = false;
    }

    function finishDailyLayoutNowV233() {
        const grid = document.getElementById('days-grid');
        if (!grid) return;
        const layout = currentLayoutV233();

        // V228/V229 layouts are already applied synchronously by their initGrid
        // wrappers. V231 paged layouts were the remaining next-frame jump, so
        // force their exact final page/geometry now while the grid is measurable.
        if (isDefaultTileViewV233() && PAGED_V233.has(layout) && typeof window.__setDailyPageV231 === 'function') {
            window.__setDailyPageV231(Number.NaN, true);
        }
    }

    // This is intentionally the outermost initGrid wrapper. Hide BEFORE the
    // legacy grid rebuild starts, then reveal only after final geometry exists.
    try {
        const beforeInitGridV233 = initGrid;
        initGrid = function(...args) {
            beginStablePaintV233();
            let result;
            try {
                result = beforeInitGridV233.apply(this, args);
                finishDailyLayoutNowV233();
            } finally {
                const gridView = document.getElementById('grid-view');
                if (gridView?.classList.contains('active')) {
                    revealStablePaintV233();
                } else {
                    // Initial app restore builds Daily Logs before activating it.
                    // Keep it unpainted until switchView gives it a real width.
                    window.__dailyLayoutNeedsRevealV233 = true;
                }
            }
            return result;
        };
    } catch {}

    // On initial load, initGrid can run while #grid-view is inactive (width 0).
    // Finalize once more immediately after it becomes active, before revealing.
    try {
        const beforeSwitchViewV233 = switchView;
        switchView = function(viewToShow, ...args) {
            const isDailyGrid = viewToShow?.id === 'grid-view' || viewToShow === document.getElementById('grid-view');
            if (isDailyGrid) beginStablePaintV233();
            const result = beforeSwitchViewV233.call(this, viewToShow, ...args);
            if (isDailyGrid) {
                try { finishDailyLayoutNowV233(); } finally { revealStablePaintV233(); }
            }
            return result;
        };
    } catch {}

    // If this hotfix loads while Daily Logs is already visible, normalize it in
    // the same task so no later V231 animation-frame pass causes a visible jump.
    try {
        const gridView = document.getElementById('grid-view');
        if (gridView?.classList.contains('active')) {
            beginStablePaintV233();
            finishDailyLayoutNowV233();
            revealStablePaintV233();
        }
    } catch {
        revealStablePaintV233();
    }
})();

/* ============================================================
   V234 — prevent shaped Daily Logs tiles from clipping at the top.
   Wave/orbit pages intentionally translate some tiles upward; reserve real
   internal headroom so the full shapes are visible inside the scroll box.
   ============================================================ */
(() => {
    'use strict';
    if (window.__loggyHotfixV234) return;
    window.__loggyHotfixV234 = true;

    const style = document.createElement('style');
    style.id = 'loggy-hotfix-v234-day-layout-headroom-style';
    style.textContent = `
        /* Keep the page full-width. These rules only add vertical breathing
           room for layouts whose geometry rises above their first grid row. */
        #grid-view.view.active > #days-grid.daily-paged-pattern-v231.daily-day-layout-wave-v229{
            padding-top:44px!important;
            padding-bottom:14px!important;
            scroll-padding-top:44px!important;
        }
        #grid-view.view.active > #days-grid.daily-paged-pattern-v231.daily-day-layout-orbit-v229{
            padding-top:30px!important;
            padding-bottom:14px!important;
            scroll-padding-top:30px!important;
        }

        /* Older/non-paged versions of those shapes can still appear briefly
           in legacy logs before the shared pager upgrades them. Protect those
           too so no theme/version path exposes a clipped first row. */
        #grid-view.view.active > #days-grid.daily-day-layout-wave-v229:not(.daily-paged-pattern-v231){
            padding-top:46px!important;
        }
        #grid-view.view.active > #days-grid.daily-day-layout-orbit-v229:not(.daily-paged-pattern-v231){
            padding-top:32px!important;
        }
    `;
    document.head.appendChild(style);
})();

/* ============================================================
   V235 — Periodic Table hover pop.
   Animate only geometry/border style so legacy themes keep ownership of
   tile background, text color, and border color.
   ============================================================ */
(() => {
    'use strict';
    if (window.__loggyHotfixV235) return;
    window.__loggyHotfixV235 = true;

    const style = document.createElement('style');
    style.id = 'loggy-hotfix-v235-periodic-hover-style';
    style.textContent = `
        /* Reserve room for the top row to lift without clipping. */
        #grid-view.view.active > #days-grid.daily-day-layout-periodic-v228.daily-paged-layout-v231{
            padding-top:10px!important;
        }

        #grid-view.view.active > #days-grid.daily-day-layout-periodic-v228 .day-box{
            transform-origin:center center!important;
            will-change:transform;
            transition:
                transform .18s cubic-bezier(.2,.8,.2,1),
                border-width .18s ease,
                border-style .18s ease,
                filter .18s ease!important;
        }

        #grid-view.view.active > #days-grid.daily-day-layout-periodic-v228 .day-box:hover{
            transform:translateY(-5px) scale(1.07)!important;
            border-width:3px!important;
            border-style:double!important;
            z-index:8!important;
        }

        #grid-view.view.active > #days-grid.daily-day-layout-periodic-v228 .day-box:active{
            transform:translateY(-2px) scale(1.035)!important;
        }

        @media (prefers-reduced-motion: reduce){
            #grid-view.view.active > #days-grid.daily-day-layout-periodic-v228 .day-box{
                transition:none!important;
            }
            #grid-view.view.active > #days-grid.daily-day-layout-periodic-v228 .day-box:hover{
                transform:none!important;
            }
        }
    `;
    document.head.appendChild(style);
})();

/* ============================================================
   V237 — keyboard-only Daily Logs paging + true full-width fun layouts.
   Removes the visible page chrome while preserving discrete pages. Left/Right
   Arrow changes pages when Daily Logs is active. Legacy theme paint remains
   untouched: these rules only control geometry/spacing/sizing.
   ============================================================ */
(() => {
    'use strict';
    if (window.__loggyHotfixV237) return;
    window.__loggyHotfixV237 = true;

    const PAGED_LAYOUTS_V237 = new Set([
        'periodic','wave',,'arches','orbit',
        'diamonds','leaves','gems','shields','ribbons','pyramid',,
        'spiral','constellation','snake','fan','clean'
    ]);

    const style = document.createElement('style');
    style.id = 'loggy-hotfix-v237-keyboard-pages-fullwidth-style';
    style.textContent = `
        /* No visible pagination chrome. Pages are controlled with keyboard arrows. */
        #daily-day-pager-v231,
        #daily-day-pager-v231.visible-v231{
            display:none!important;
            visibility:hidden!important;
            height:0!important;
            min-height:0!important;
            margin:0!important;
            padding:0!important;
            overflow:hidden!important;
            pointer-events:none!important;
        }

        /* Every custom day composition uses exactly the same visible left/right
           edges as the two Daily Logs search boxes. */
        #grid-view.view.active > #days-grid.grid-container[class*="daily-day-layout-"]{
            width:100%!important;
            max-width:100%!important;
            box-sizing:border-box!important;
            padding-left:0!important;
            padding-right:0!important;
        }

        /* Older fun layouts used fixed-width columns. minmax(...,1fr) keeps the
           same shape family but distributes leftover width across the row, so a
           usable extra column is not stranded as empty space at the right. */
        #grid-view.view.active > #days-grid.daily-day-layout-bubbles-v229,
        #grid-view.view.active > #days-grid.daily-day-layout-pebbles-v229,
        #grid-view.view.active > #days-grid.daily-day-layout-zigzag-v229,
        #grid-view.view.active > #days-grid.daily-day-layout-droplets-v229,
        #grid-view.view.active > #days-grid.daily-day-layout-petals-v229,
        #grid-view.view.active > #days-grid.daily-day-layout-honeycomb-v229,
        #grid-view.view.active > #days-grid.daily-day-layout-clover-v229{
            grid-template-columns:repeat(auto-fill,minmax(64px,1fr))!important;
            justify-content:stretch!important;
        }
        #grid-view.view.active > #days-grid.daily-day-layout-dominoes-v229,
        #grid-view.view.active > #days-grid.daily-day-layout-badges-v229,
        #grid-view.view.active > #days-grid.daily-day-layout-lanterns-v229{
            grid-template-columns:repeat(auto-fill,minmax(68px,1fr))!important;
            justify-content:stretch!important;
        }
        #grid-view.view.active > #days-grid.daily-day-layout-clouds-v229{
            grid-template-columns:repeat(auto-fill,minmax(100px,1fr))!important;
            justify-content:stretch!important;
        }

        /* Let the original day tile fill the distributed track while retaining
           the shape's old aspect ratio. No background/border/color/shadow paint. */
        #grid-view.view.active > #days-grid.daily-day-layout-bubbles-v229 > *,
        #grid-view.view.active > #days-grid.daily-day-layout-pebbles-v229 > *,
        #grid-view.view.active > #days-grid.daily-day-layout-zigzag-v229 > *,
        #grid-view.view.active > #days-grid.daily-day-layout-petals-v229 > *,
        #grid-view.view.active > #days-grid.daily-day-layout-honeycomb-v229 > *,
        #grid-view.view.active > #days-grid.daily-day-layout-clover-v229 > *{
            width:100%!important;
            height:auto!important;
            min-width:0!important;
            aspect-ratio:1!important;
        }
        #grid-view.view.active > #days-grid.daily-day-layout-bubbles-v229 .day-box,
        #grid-view.view.active > #days-grid.daily-day-layout-pebbles-v229 .day-box,
        #grid-view.view.active > #days-grid.daily-day-layout-zigzag-v229 .day-box,
        #grid-view.view.active > #days-grid.daily-day-layout-petals-v229 .day-box,
        #grid-view.view.active > #days-grid.daily-day-layout-honeycomb-v229 .day-box,
        #grid-view.view.active > #days-grid.daily-day-layout-clover-v229 .day-box{
            width:100%!important;
            height:auto!important;
            min-height:0!important;
            aspect-ratio:1!important;
        }

        #grid-view.view.active > #days-grid.daily-day-layout-droplets-v229 > *{
            width:100%!important;height:auto!important;min-width:0!important;aspect-ratio:74/80!important;
        }
        #grid-view.view.active > #days-grid.daily-day-layout-droplets-v229 .day-box{
            width:100%!important;height:auto!important;min-height:0!important;aspect-ratio:74/80!important;
        }
        #grid-view.view.active > #days-grid.daily-day-layout-dominoes-v229 > *{
            width:100%!important;height:auto!important;min-width:0!important;aspect-ratio:58/88!important;
        }
        #grid-view.view.active > #days-grid.daily-day-layout-dominoes-v229 .day-box{
            width:100%!important;height:auto!important;min-height:0!important;aspect-ratio:58/88!important;
        }
        #grid-view.view.active > #days-grid.daily-day-layout-badges-v229 > *{
            width:100%!important;height:auto!important;min-width:0!important;aspect-ratio:78/84!important;
        }
        #grid-view.view.active > #days-grid.daily-day-layout-badges-v229 .day-box{
            width:100%!important;height:auto!important;min-height:0!important;aspect-ratio:78/84!important;
        }
        #grid-view.view.active > #days-grid.daily-day-layout-clouds-v229 > *{
            width:100%!important;height:auto!important;min-width:0!important;aspect-ratio:104/60!important;
        }
        #grid-view.view.active > #days-grid.daily-day-layout-clouds-v229 .day-box{
            width:100%!important;height:auto!important;min-height:0!important;aspect-ratio:104/60!important;
        }
        #grid-view.view.active > #days-grid.daily-day-layout-lanterns-v229 > *{
            width:100%!important;height:auto!important;min-width:0!important;aspect-ratio:70/88!important;
        }
        #grid-view.view.active > #days-grid.daily-day-layout-lanterns-v229 .day-box{
            width:100%!important;height:auto!important;min-height:0!important;aspect-ratio:70/88!important;
        }

        @media (max-width:760px){
            #grid-view.view.active > #days-grid.grid-container[class*="daily-day-layout-"]{
                padding-left:0!important;
                padding-right:0!important;
            }
        }
    `;
    document.head.appendChild(style);

    function currentLayoutV237() {
        try { return String(db?.settings?.dailyDayLayoutV228 || 'grid'); }
        catch { return 'grid'; }
    }

    function typingTargetV237(target) {
        return target instanceof Element && !!target.closest('input,textarea,select,[contenteditable="true"],[role="textbox"]');
    }

    function blockingOverlayV237() {
        return !!document.querySelector('.modal-overlay:not(.hidden), .modal:not(.hidden), .context-menu:not(.hidden)');
    }

    document.addEventListener('keydown', event => {
        if (event.defaultPrevented || event.ctrlKey || event.metaKey || event.altKey || event.shiftKey) return;
        if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
        if (typingTargetV237(event.target) || blockingOverlayV237()) return;
        if (!document.getElementById('grid-view')?.classList.contains('active')) return;
        const layout = currentLayoutV237();
        if (!PAGED_LAYOUTS_V237.has(layout)) return;
        try {
            if ((db?.settings?.dailyViewType || 'default') === 'polaroid') return;
        } catch {}
        if (typeof window.__setDailyPageV231 !== 'function') return;
        const current = Number.isFinite(Number(window.__dailyPageIndexV231)) ? Number(window.__dailyPageIndexV231) : 0;
        window.__setDailyPageV231(current + (event.key === 'ArrowRight' ? 1 : -1), false);
        event.preventDefault();
        event.stopPropagation();
    }, true);


    // V590: mouse wheel paging mirrors the keyboard on discrete horizontal
    // Daily Logs layouts. Scroll UP = ArrowRight/next view. Scroll DOWN =
    // ArrowLeft/previous view. Never intercept a layout that actually needs
    // vertical scrolling.
    let wheelAccumV590 = 0;
    let wheelLastV590 = 0;
    let wheelLockV590 = false;

    function verticallyScrollableV590(node) {
        if (!node) return false;
        const style = getComputedStyle(node);
        const allows = /^(auto|scroll)$/i.test(style.overflowY || '');
        return allows && node.scrollHeight > node.clientHeight + 3;
    }

    function wheelPagingEligibleV590(event) {
        if (event.defaultPrevented || event.ctrlKey || event.metaKey || event.altKey || event.shiftKey) return false;
        if (typingTargetV237(event.target) || blockingOverlayV237()) return false;
        const view = document.getElementById('grid-view');
        const grid = document.getElementById('days-grid');
        if (!view?.classList.contains('active') || !grid) return false;
        if (!(event.target instanceof Element) || !event.target.closest('#grid-view')) return false;
        const layout = currentLayoutV237();
        if (!PAGED_LAYOUTS_V237.has(layout) || !grid.classList.contains('daily-paged-layout-v231')) return false;
        try { if ((db?.settings?.dailyViewType || 'default') === 'polaroid') return false; } catch {}
        if (typeof window.__setDailyPageV231 !== 'function') return false;
        if (verticallyScrollableV590(grid) || verticallyScrollableV590(view)) return false;
        return Math.abs(Number(event.deltaY) || 0) > Math.abs(Number(event.deltaX) || 0);
    }

    document.addEventListener('wheel', event => {
        if (!wheelPagingEligibleV590(event) || wheelLockV590) return;

        const now = performance.now();
        if (now - wheelLastV590 > 180) wheelAccumV590 = 0;
        wheelLastV590 = now;
        wheelAccumV590 += Number(event.deltaY) || 0;
        if (Math.abs(wheelAccumV590) < 28) return;

        const step = wheelAccumV590 < 0 ? 1 : -1;
        wheelAccumV590 = 0;

        const selector = `#daily-day-pager-v231 [data-page-step-v231="${step}"]`;
        const button = document.querySelector(selector);
        if (button?.disabled) return;

        const current = Number.isFinite(Number(window.__dailyPageIndexV231))
            ? Number(window.__dailyPageIndexV231)
            : 0;

        event.preventDefault();
        event.stopPropagation();
        wheelLockV590 = true;
        window.__setDailyPageV231(current + step, false);
        setTimeout(() => { wheelLockV590 = false; }, 150);
    }, {capture:true, passive:false});

    // Older V231 code may re-add its "visible" class while changing pages.
    // Keep the pager semantically out of the visible interface as well.
    const hidePagerV237 = () => {
        const pager = document.getElementById('daily-day-pager-v231');
        if (!pager) return;
        pager.setAttribute('aria-hidden', 'true');
        pager.tabIndex = -1;
        pager.querySelectorAll('button').forEach(button => button.tabIndex = -1);
    };
    // V244: CSS already keeps the pager hidden. Avoid a whole-page MutationObserver
    // watching every class change; just normalize the pager once now and once
    // after the current render frame.
    hidePagerV237();
    requestAnimationFrame(hidePagerV237);
})();


/* ============================================================
   V238 — visible Spiral pages, exact search-edge alignment,
   remove Heart, and normalize New Day (+) to a normal day slot.
   ============================================================ */
(() => {
    'use strict';
    if (window.__loggyHotfixV238) return;
    window.__loggyHotfixV238 = true;
    const q = (selector, root = document) => root?.querySelector?.(selector) || null;
    const PAGED_V238 = new Set([
        'periodic','wave',,'arches','orbit','diamonds','leaves','gems',
        'shields','ribbons','pyramid',,'spiral','constellation','snake','fan','clean'
    ]);
    const style = document.createElement('style');
    style.id = 'loggy-hotfix-v238-day-layout-corrections-style';
    style.textContent = `
        #grid-view.view.active > #days-grid.grid-container,
        #grid-view.view.active > #days-grid.grid-container[class*="daily-day-layout-"]{
            padding-left:0!important;
            padding-right:0!important;
        }
        #grid-view.view.active > #days-grid.grid-container[class*="daily-day-layout-"] > .daily-add-day-slot-v238{
            position:relative!important;
            display:inline-block!important;
            box-sizing:border-box!important;
            min-width:0!important;
        }
        #grid-view.view.active > #days-grid.grid-container[class*="daily-day-layout-"] > .daily-add-day-slot-v238 > .day-box{
            width:100%!important;
            height:100%!important;
            min-width:0!important;
            min-height:0!important;
            box-sizing:border-box!important;
            margin:0!important;
        }
        #daily-logs-local-settings-modal [data-daily-layout-v228="heart"]{display:none!important;}
    `;
    document.head.appendChild(style);
    function currentLayoutV238() {
        try { return String(db?.settings?.dailyDayLayoutV228 || 'grid'); }
        catch { return 'grid'; }
    }
    function removeHeartV238() {
        document.querySelectorAll('[data-daily-layout-v228="heart"]').forEach(el => el.remove());
        try {
            if (db?.settings?.dailyDayLayoutV228 === 'heart') {
                db.settings.dailyDayLayoutV228 = 'grid';
                try { saveDb(); } catch {}
            }
        } catch {}
    }
    function normalizeAddDayV238() {
        const grid = document.getElementById('days-grid');
        if (!grid) return false;
        try { if ((db?.settings?.dailyViewType || 'default') === 'polaroid') return false; } catch {}
        if (currentLayoutV238() === 'grid') return false;
        const button = q(':scope > button.day-box[title="Add extra log day"]', grid);
        if (!button) return false;
        const slot = document.createElement('div');
        slot.className = 'daily-add-day-slot-v238';
        slot.style.position = 'relative';
        slot.style.display = 'inline-block';
        button.insertAdjacentElement('beforebegin', slot);
        slot.appendChild(button);
        return true;
    }
    function refreshCurrentPageV238() {
        const layout = currentLayoutV238();
        if (!PAGED_V238.has(layout) || typeof window.__setDailyPageV231 !== 'function') return;
        const page = Number(window.__dailyPageIndexV231);
        try { window.__setDailyPageV231(Number.isFinite(page) ? page : Number.NaN, !Number.isFinite(page)); } catch {}
    }
    try {
        const beforeInitGridV238 = initGrid;
        initGrid = function(...args) {
            const result = beforeInitGridV238.apply(this, args);
            removeHeartV238();
            if (normalizeAddDayV238()) refreshCurrentPageV238();
            return result;
        };
    } catch {}
    document.addEventListener('click', event => {
        if (event.target.closest?.('#open-daily-settings-btn,#open-global-daily-settings-nav-btn')) setTimeout(removeHeartV238, 0);
    }, true);
    removeHeartV238();
    if (normalizeAddDayV238()) refreshCurrentPageV238();
})();

/* ============================================================
   V242 — repair advanced Daily Logs layouts.
   - Clock / Spiral / Constellation use collision-safe grid geometry.
   - Pyramid keeps the themed day tile intact and only changes arrangement.
   - Ribbons / Shields keep real theme borders instead of clip-path erasing them.
   - New Day (+) is always laid out as the same-sized final day slot.
   ============================================================ */
(() => {
    'use strict';
    if (window.__loggyHotfixV242) return;
    window.__loggyHotfixV242 = true;

    const BROKEN_V242 = new Set(['clock','spiral','constellation','pyramid','ribbons','shields']);
    const q = (selector, root = document) => root?.querySelector?.(selector) || null;
    const qa = (selector, root = document) => Array.from(root?.querySelectorAll?.(selector) || []);

    const style = document.createElement('style');
    style.id = 'loggy-hotfix-v242-layout-repair-style';
    style.textContent = `
        #grid-view.view.active > #days-grid.daily-layout-repaired-v242{
            width:100%!important;
            box-sizing:border-box!important;
            padding-left:0!important;
            padding-right:0!important;
            overflow:hidden!important;
        }
        #grid-view.view.active > #days-grid.daily-layout-repaired-v242 > :not(.daily-page-hidden-v231){
            min-width:0!important;
            box-sizing:border-box!important;
        }
        #grid-view.view.active > #days-grid.daily-layout-repaired-v242 > :not(.daily-page-hidden-v231) .day-box,
        #grid-view.view.active > #days-grid.daily-layout-repaired-v242 > .day-box:not(.daily-page-hidden-v231){
            width:100%!important;
            height:100%!important;
            min-width:0!important;
            min-height:0!important;
            box-sizing:border-box!important;
            margin:0!important;
        }
        #grid-view.view.active > #days-grid.daily-day-layout-shields-v231 .day-box{
            clip-path:none!important;
            border-radius:14px 14px 30px 30px!important;
        }
        #grid-view.view.active > #days-grid.daily-day-layout-ribbons-v231 .day-box{
            clip-path:none!important;
            border-radius:999px 12px 999px 12px!important;
        }
        #grid-view.view.active > #days-grid.daily-day-layout-pyramid-v231 .day-box{
            clip-path:none!important;
            border-radius:var(--border-radius,10px)!important;
        }
        #grid-view.view.active > #days-grid.daily-day-layout-clock-v231 .day-box,
        #grid-view.view.active > #days-grid.daily-day-layout-spiral-v231 .day-box,
        #grid-view.view.active > #days-grid.daily-day-layout-constellation-v231 .day-box{
            border-radius:50%!important;
        }
    `;
    document.head.appendChild(style);

    function currentLayoutV242() {
        try { return String(db?.settings?.dailyDayLayoutV228 || 'grid'); }
        catch { return 'grid'; }
    }

    function visibleNodesV242(grid) {
        const nodes = qa(':scope > [data-day]', grid)
            .filter(node => !node.classList.contains('daily-page-hidden-v231'))
            .sort((a,b) => Number(a.dataset.day) - Number(b.dataset.day));
        const add = q(':scope > .daily-add-day-slot-v238:not(.daily-page-hidden-v231)', grid) ||
            q(':scope > button.day-box[title="Add extra log day"]:not(.daily-page-hidden-v231)', grid);
        if (add && !nodes.includes(add)) nodes.push(add);
        return nodes;
    }

    function clearNodeGeometryV242(node) {
        ['position','left','top','right','bottom','grid-row','grid-column','transform','width','height','display']
            .forEach(prop => node.style.removeProperty(prop));
        const button = node.matches?.('.day-box') ? node : q('.day-box', node);
        if (button && button !== node) {
            ['position','left','top','right','bottom','grid-row','grid-column','transform','width','height','display']
                .forEach(prop => button.style.removeProperty(prop));
        }
    }

    function prepareGridV242(grid, cols, rows, gap = 10) {
        grid.classList.remove('daily-absolute-page-v231');
        grid.classList.add('daily-paged-pattern-v231','daily-layout-repaired-v242');
        const width = Math.max(280, grid.clientWidth || grid.getBoundingClientRect().width || 900);
        const cell = Math.max(30, Math.floor((width - gap * Math.max(0, cols - 1)) / cols));
        grid.style.setProperty('display','grid','important');
        grid.style.setProperty('position','relative','important');
        grid.style.setProperty('height','auto','important');
        grid.style.setProperty('min-height','0','important');
        grid.style.setProperty('grid-template-columns',`repeat(${cols},minmax(0,1fr))`,'important');
        grid.style.setProperty('grid-template-rows',`repeat(${rows},${cell}px)`,'important');
        grid.style.setProperty('gap',`${gap}px`,'important');
        grid.style.setProperty('--daily-pattern-cell-v231',`${cell}px`);
        return cell;
    }

    function placeV242(node,row,col) {
        clearNodeGeometryV242(node);
        node.style.setProperty('position','relative','important');
        node.style.setProperty('grid-row',String(row),'important');
        node.style.setProperty('grid-column',String(col),'important');
        node.style.setProperty('width','100%','important');
        node.style.setProperty('height','100%','important');
        node.style.setProperty('transform','none','important');
    }

    function clockPositionsV242() {
        const out=[];
        for(let c=1;c<=7;c++) out.push([1,c]);
        for(let r=2;r<=7;r++) out.push([r,7]);
        for(let c=6;c>=1;c--) out.push([7,c]);
        for(let r=6;r>=2;r--) out.push([r,1]);
        return out;
    }

    function spiralPositionsV242() {
        const size=5, out=[];
        let top=1,left=1,bottom=size,right=size;
        while(top<=bottom && left<=right){
            for(let c=left;c<=right;c++) out.push([top,c]); top++;
            for(let r=top;r<=bottom;r++) out.push([r,right]); right--;
            if(top<=bottom){for(let c=right;c>=left;c--) out.push([bottom,c]); bottom--;}
            if(left<=right){for(let r=bottom;r>=top;r--) out.push([r,left]); left++;}
        }
        return out;
    }

    function repairLayoutV242() {
        const layout = currentLayoutV242();
        if (!BROKEN_V242.has(layout)) return;
        const grid = document.getElementById('days-grid');
        if (!grid || !document.getElementById('grid-view')?.classList.contains('active')) return;
        let nodes = visibleNodesV242(grid);
        if (!nodes.length) return;

        if (layout === 'clock') {
            prepareGridV242(grid,7,7,10);
            const positions=clockPositionsV242();
            nodes.slice(0,positions.length).forEach((node,i)=>placeV242(node,...positions[i]));
            return;
        }
        if (layout === 'spiral') {
            prepareGridV242(grid,5,5,12);
            const positions=spiralPositionsV242();
            nodes.slice(0,20).forEach((node,i)=>placeV242(node,...positions[i]));
            return;
        }
        if (layout === 'constellation') {
            prepareGridV242(grid,9,4,12);
            nodes.slice(0,36).forEach((node,i)=>{
                const row=Math.floor(i/9)+1, col=(i%9)+1;
                placeV242(node,row,col);
                const offset=((i*7)%3-1)*5;
                node.style.setProperty('transform',`translateY(${offset}px)`,'important');
            });
            return;
        }
        if (layout === 'pyramid') {
            prepareGridV242(grid,15,8,7);
            let index=0;
            for(let row=1;row<=8 && index<nodes.length;row++){
                const count=row, start=9-row;
                for(let j=0;j<count && index<nodes.length;j++,index++) placeV242(nodes[index],row,start+j*2);
            }
            return;
        }
        // Shields and ribbons are regular full-width pages; keep theme paint intact.
        if (layout === 'shields' || layout === 'ribbons') {
            prepareGridV242(grid,8,6,10);
            nodes.slice(0,48).forEach((node,i)=>placeV242(node,Math.floor(i/8)+1,(i%8)+1));
        }
    }

    const oldSetPageV242 = window.__setDailyPageV231;
    if (typeof oldSetPageV242 === 'function') {
        window.__setDailyPageV231 = function(...args) {
            const result = oldSetPageV242.apply(this,args);
            repairLayoutV242();
            return result;
        };
    }

    try {
        const oldInitGridV242 = initGrid;
        initGrid = function(...args) {
            const result = oldInitGridV242.apply(this,args);
            requestAnimationFrame(()=>requestAnimationFrame(repairLayoutV242));
            return result;
        };
    } catch {}

    document.addEventListener('click', event => {
        if (event.target.closest?.('[data-daily-layout-v228],#open-daily-settings-btn,#open-daily-logs-nav-btn')) {
            requestAnimationFrame(()=>requestAnimationFrame(repairLayoutV242));
        }
    }, true);

    requestAnimationFrame(()=>requestAnimationFrame(repairLayoutV242));
})();

/* ============================================================
   V244 — layout cleanup, one true Add Day tile, and New Day Date mode.
   ============================================================ */
(() => {
    'use strict';
    if (window.__loggyHotfixV244) return;
    window.__loggyHotfixV244 = true;

    const REMOVED_V244 = new Set(['spiral','constellation','diamonds','ribbons','fan','staircase','clock']);
    const PAGE_SIZES_V244 = {periodic:118,wave:40,staircase:36,arches:35,orbit:32,diamonds:48,leaves:48,gems:48,shields:48,ribbons:48,pyramid:36,clock:24,spiral:20,constellation:36,snake:42,fan:28,clean:48};
    const q=(s,r=document)=>r?.querySelector?.(s)||null;
    const qa=(s,r=document)=>Array.from(r?.querySelectorAll?.(s)||[]);

    const style=document.createElement('style');
    style.id='loggy-hotfix-v244-style';
    style.textContent=`
      #daily-logs-local-settings-modal [data-daily-layout-v228="spiral"],
      #daily-logs-local-settings-modal [data-daily-layout-v228="constellation"],
      #daily-logs-local-settings-modal [data-daily-layout-v228="diamonds"],
      #daily-logs-local-settings-modal [data-daily-layout-v228="ribbons"],
      #daily-logs-local-settings-modal [data-daily-layout-v228="fan"],
      #daily-logs-local-settings-modal [data-daily-layout-v228="staircase"],
      #daily-logs-local-settings-modal [data-daily-layout-v228="clock"]{display:none!important}
      #grid-view.view.active #days-grid .daily-add-day-slot-v238{box-sizing:border-box!important}
      #grid-view.view.active #days-grid .daily-add-day-slot-v238>.day-box[title="Add extra log day"]{
        width:100%!important;height:100%!important;min-width:0!important;min-height:0!important;margin:0!important;
        box-sizing:border-box!important;display:grid!important;place-items:center!important;padding:0!important;
      }
      #phrases-library-view #kb-bulk-add-btn-v162,#phrases-library-view #kb-select-toggle-v163{display:none!important}
      #daily-logs-local-settings-modal .new-day-date-options-v244{margin-top:7px;display:flex;gap:8px;flex-wrap:wrap}
      #daily-logs-local-settings-modal .new-day-date-options-v244 .filter-tab{min-width:132px}
      #daily-logs-local-settings-modal .complete-log-style-options-v244{margin-top:7px;display:flex;gap:8px;flex-wrap:wrap}
      #daily-logs-local-settings-modal .complete-log-style-options-v244 .filter-tab{min-width:132px}
      #daily-logs-local-settings-modal .complete-log-color-row-v244{display:flex;align-items:center;gap:12px;margin-top:12px}
      #daily-logs-local-settings-modal .complete-log-color-row-v244.hidden{display:none!important}
      #daily-logs-local-settings-modal #complete-log-color-v244{width:54px;height:38px;padding:2px;border:var(--thin-border);border-radius:8px;background:var(--white)}
      html[data-complete-log-style-v244="background"] #grid-view.view.active #days-grid .day-box.has-data{background:var(--complete-log-color-v244,#d9f99d)!important;border:var(--thin-border)!important}
      html[data-complete-log-style-v244="rainbow"] #grid-view.view.active #days-grid .day-box.has-data,
      html[data-complete-log-style-v244="random"] #grid-view.view.active #days-grid .day-box.has-data{background:var(--complete-log-dynamic-color-v362,var(--white))!important;border:var(--thin-border)!important}
    `;
    document.head.appendChild(style);

    function cleanRemovedLayoutsV244(){
      qa('[data-daily-layout-v228]').forEach(btn=>{if(REMOVED_V244.has(btn.dataset.dailyLayoutV228))btn.remove()});
      try{
        const current=String(db?.settings?.dailyDayLayoutV228||'grid');
        if(REMOVED_V244.has(current)){
          db.settings.dailyDayLayoutV228='grid';
          try{saveDb()}catch{}
          try{initGrid()}catch{}
        }
      }catch{}
    }

    function addButtonsV244(grid){
      return qa('button.day-box[title="Add extra log day"],.polaroid-card[title="Add extra log day"]',grid);
    }
    function ensureSinglePlusV244(){
      const grid=document.getElementById('days-grid');if(!grid)return null;
      const buttons=addButtonsV244(grid);if(!buttons.length)return null;
      const keep=buttons[buttons.length-1];
      buttons.slice(0,-1).forEach(btn=>{const slot=btn.closest('.daily-add-day-slot-v238');if(slot&&slot.children.length===1)slot.remove();else btn.remove()});
      keep.innerHTML='<i class="ph ph-plus" aria-hidden="true"></i>';
      keep.setAttribute('aria-label','Add new day');
      if((db?.settings?.dailyViewType||'default')!=='polaroid' && String(db?.settings?.dailyDayLayoutV228||'grid')!=='grid'){
        let slot=keep.closest('.daily-add-day-slot-v238');
        if(!slot){slot=document.createElement('div');slot.className='daily-add-day-slot-v238';keep.before(slot);slot.appendChild(keep)}
        slot.setAttribute('aria-label','Add new day');
      }
      return keep;
    }

    function latestPlusPageV244(){
      const grid=document.getElementById('days-grid');if(!grid)return;
      const layout=String(db?.settings?.dailyDayLayoutV228||'grid');
      const size=PAGE_SIZES_V244[layout];
      if(!size||typeof window.__setDailyPageV231!=='function')return;
      const days=qa(':scope > [data-day]',grid).map(x=>Number(x.dataset.day)).filter(Number.isFinite);
      const max=days.length?Math.max(...days):0;
      const plusDay=max+1;
      try{window.__setDailyPageV231(Math.floor((plusDay-1)/size),false)}catch{}
    }

    function ensureNewDayDateSettingV244(){
      const modal=document.getElementById('daily-logs-local-settings-modal');if(!modal)return;
      let section=modal.querySelector('#new-day-date-setting-v244');
      if(!section){
        section=document.createElement('div');section.id='new-day-date-setting-v244';section.className='modal-section';
        section.innerHTML=`<span class="field-label">New Day Date</span><div class="set-size-picker new-day-date-options-v244" role="radiogroup" aria-label="Date used for a new Daily Log"><button type="button" class="filter-tab" data-new-day-date-v244="following">Following date</button><button type="button" class="filter-tab" data-new-day-date-v244="today">Today</button></div><p class="progress-hint">Choose whether + continues from the previous logged date or uses today's calendar date.</p>`;
        const box=modal.querySelector('.modal-box');
        const layoutPicker=modal.querySelector('.daily-day-layout-picker-v228')?.closest('.modal-section');
        if(layoutPicker)layoutPicker.insertAdjacentElement('afterend',section);else box?.appendChild(section);
        qa('[data-new-day-date-v244]',section).forEach(btn=>btn.onclick=()=>{db.settings ||= {};db.settings.newDayDateModeV244=btn.dataset.newDayDateV244;try{saveDb()}catch{};syncNewDayDateV244()});
      }
      syncNewDayDateV244();
    }
    function syncNewDayDateV244(){
      const mode=String(db?.settings?.newDayDateModeV244||'following');
      qa('[data-new-day-date-v244]').forEach(btn=>{const on=btn.dataset.newDayDateV244===mode;btn.classList.toggle('active',on);btn.setAttribute('aria-pressed',on?'true':'false')});
    }
    function validCompleteColorV244(value){
      const v=String(value||'').trim();
      return /^#[0-9a-f]{6}$/i.test(v)?v:'#d9f99d';
    }
    function ensureCompleteLogStyleSettingV244(){
      const modal=document.getElementById('daily-logs-local-settings-modal');if(!modal)return;
      let section=modal.querySelector('#complete-log-style-setting-v244');
      if(!section){
        section=document.createElement('div');section.id='complete-log-style-setting-v244';section.className='modal-section';
        section.innerHTML=`<span class="field-label">Complete Log Style</span><div class="set-size-picker complete-log-style-options-v244" role="radiogroup" aria-label="How completed Daily Log boxes look"><button type="button" class="filter-tab" data-complete-log-style-v244="border">Darker border</button><button type="button" class="filter-tab" data-complete-log-style-v244="background">Background color</button><button type="button" class="filter-tab" data-complete-log-style-v244="rainbow">Rainbow</button><button type="button" class="filter-tab" data-complete-log-style-v244="random">Random background color</button></div><div class="complete-log-color-row-v244"><input type="color" id="complete-log-color-v244" value="#d9f99d" aria-label="Completed log background color"><span class="progress-hint">Choose the color used after a Daily Log has content.</span></div>`;
        const dateSection=modal.querySelector('#new-day-date-setting-v244');
        if(dateSection)dateSection.insertAdjacentElement('afterend',section);else modal.querySelector('.modal-box')?.appendChild(section);
        qa('[data-complete-log-style-v244]',section).forEach(btn=>btn.onclick=()=>{db.settings||={};db.settings.completeLogStyleV244=btn.dataset.completeLogStyleV244;try{saveDb()}catch{};syncCompleteLogStyleV244()});
        const colorInput=q('#complete-log-color-v244',section);
        if(colorInput)colorInput.oninput=()=>{db.settings||={};db.settings.completeLogColorV244=validCompleteColorV244(colorInput.value);try{saveDb()}catch{};syncCompleteLogStyleV244()};
      }
      syncCompleteLogStyleV244();
    }
    function dynamicCompleteLogColorV362(day,mode){
      const n=Math.max(1,Math.round(Number(day)||1));
      if(mode==='rainbow'){
        const colors=['#ffd6d6','#ffe4bf','#fff2b8','#dff3c4','#ccefed','#d7ddff','#ead6ff'];
        return colors[(n-1)%colors.length];
      }
      const hue=(n*137.508+23)%360;
      const sat=58+((n*17)%10);
      const light=80+((n*7)%5);
      return `hsl(${hue.toFixed(1)} ${sat}% ${light}%)`;
    }
    function applyDynamicCompleteLogColorsV362(mode){
      qa('#days-grid .day-box.has-data').forEach(box=>{
        const holder=box.closest?.('[data-day]');
        const day=Number(box.dataset?.day||holder?.dataset?.day||0);
        if(mode==='rainbow'||mode==='random')box.style.setProperty('--complete-log-dynamic-color-v362',dynamicCompleteLogColorV362(day,mode));
        else box.style.removeProperty('--complete-log-dynamic-color-v362');
      });
    }
    function syncCompleteLogStyleV244(){
      const raw=String(db?.settings?.completeLogStyleV244||'border');
      const mode=['border','background','rainbow','random'].includes(raw)?raw:'border';
      const chosen=validCompleteColorV244(db?.settings?.completeLogColorV244||'#d9f99d');
      document.documentElement.dataset.completeLogStyleV244=mode;
      document.documentElement.style.setProperty('--complete-log-color-v244',chosen);
      qa('[data-complete-log-style-v244]').forEach(btn=>{const on=btn.dataset.completeLogStyleV244===mode;btn.classList.toggle('active',on);btn.setAttribute('aria-pressed',on?'true':'false')});
      const row=q('#complete-log-style-setting-v244 .complete-log-color-row-v244');if(row)row.classList.toggle('hidden',mode!=='background');
      const input=q('#complete-log-color-v244');if(input&&input.value.toLowerCase()!==chosen.toLowerCase())input.value=chosen;
      applyDynamicCompleteLogColorsV362(mode);
      requestAnimationFrame(()=>applyDynamicCompleteLogColorsV362(mode));
    }

    document.addEventListener('click',event=>{
      const add=event.target.closest?.('button.day-box[title="Add extra log day"],.polaroid-card[title="Add extra log day"]');
      if(add){
        const mode=String(db?.settings?.newDayDateModeV244||'following');
        let target=NaN;
        if(mode==='today'){
          try{target=Number(getTodayCalculatedDayNumber())}catch{}
        }else{
          const meaningful=Object.entries(db?.days||{}).filter(([,day])=>{if(!day||typeof day!=='object')return false;return Object.entries(day).some(([key,value])=>{if(key==='checkedParts')return false;if(typeof value==='string')return !!value.trim();if(Array.isArray(value))return value.length>0;if(value&&typeof value==='object')return Object.keys(value).length>0;return !!value})}).map(([n])=>Number(n)).filter(Number.isFinite);
          const fallback=Object.keys(db?.days||{}).map(Number).filter(Number.isFinite);
          const last=meaningful.length?Math.max(...meaningful):(fallback.length?Math.max(...fallback):0);
          target=Math.max(1,last+1);
        }
        if(Number.isFinite(target)&&target>=1){event.preventDefault();event.stopImmediatePropagation();try{playClickSound()}catch{};try{openDayLog(Math.round(target))}catch{};return}
      }
      // V244 previously duplicated this work: it ran again here via
      // setTimeout(...,0) on the very same click that already runs it
      // synchronously through the wrapped openDailyLogsLocalSettings/
      // ensureDailyLogsSettingsModal below. That doubled the DOM queries
      // and rebuild work on every "Daily Log Settings" open, adding a
      // visible delay before the modal appeared. Removed — the wrapped
      // open/ensure calls already cover it.
      if(event.target.closest?.('#open-daily-logs-nav-btn'))requestAnimationFrame(()=>requestAnimationFrame(()=>{ensureSinglePlusV244();latestPlusPageV244()}));
    },true);

    try{
      const oldEnsure=ensureDailyLogsSettingsModal;
      ensureDailyLogsSettingsModal=function(...args){const modal=oldEnsure.apply(this,args);cleanRemovedLayoutsV244();ensureNewDayDateSettingV244();ensureCompleteLogStyleSettingV244();return modal};
    }catch{}
    // V244 used to re-run cleanRemovedLayoutsV244/ensureNewDayDateSettingV244/
    // ensureCompleteLogStyleSettingV244 a second time here. openDailyLogsLocalSettings
    // always calls ensureDailyLogsSettingsModal() first (see template.js), and the
    // wrapper on ensureDailyLogsSettingsModal just above already runs all three on
    // that same call — so this second pass was pure duplicate work on every open.
    // Left as a no-op wrapper so any code that reassigns openDailyLogsLocalSettings
    // still chains through this reference correctly.
    try{
      const oldOpen=openDailyLogsLocalSettings;
      openDailyLogsLocalSettings=function(...args){return oldOpen.apply(this,args)};
    }catch{}
    try{
      const oldInit=initGrid;
      initGrid=function(...args){const result=oldInit.apply(this,args);cleanRemovedLayoutsV244();syncCompleteLogStyleV244();ensureSinglePlusV244();requestAnimationFrame(()=>{ensureSinglePlusV244();if(document.getElementById('grid-view')?.classList.contains('active'))latestPlusPageV244()});return result};
    }catch{}

    cleanRemovedLayoutsV244();
    ensureNewDayDateSettingV244();
    ensureCompleteLogStyleSettingV244();
    syncCompleteLogStyleV244();
    ensureSinglePlusV244();
    requestAnimationFrame(()=>requestAnimationFrame(()=>{ensureSinglePlusV244();if(document.getElementById('grid-view')?.classList.contains('active'))latestPlusPageV244()}));
})();

/* ============================================================
   V245 — restore actual page + custom-tab title controls for copied logs
   ============================================================ */
(() => {
    'use strict';
    if (window.__loggyHotfixV245) return;
    window.__loggyHotfixV245 = true;

    function applyCustomTabChromeV245(tabId) {
        try {
            const tab = getCustomTab(tabId);
            const view = document.getElementById(`custom-tab-view-${tabId}`);
            if (!tab || !view) return;
            view.querySelector('.custom-tab-title-wrap')?.classList.toggle('hidden', tab.showPageTitle === false);
            const actions = view.querySelector('.custom-tab-header-actions');
            if (actions) actions.style.marginLeft = 'auto';
            const edit = view.querySelector('.custom-tab-edit-btn');
            if (edit) {
                edit.classList.remove('active-builder-control');
                edit.classList.toggle('custom-tab-edit-active-v245', !!window.customTabEditMode);
                edit.innerHTML = '<i class="ph ph-pencil-simple"></i>';
            }
            const settings = view.querySelector('.custom-tab-settings-btn');
            if (settings) settings.innerHTML = '<i class="ph ph-sliders-horizontal"></i>';
        } catch {}
    }

    try {
        const beforeRenderTabV245 = renderCustomTabView;
        renderCustomTabView = function(tabId) {
            const result = beforeRenderTabV245.apply(this, arguments);
            applyCustomTabChromeV245(tabId);
            return result;
        };
    } catch {}

    try {
        const beforeTabSettingsV245 = openCustomTabSettingsModal;
        openCustomTabSettingsModal = function(tabId) {
            const result = beforeTabSettingsV245.apply(this, arguments);
            const tab = getCustomTab(tabId);
            const modal = document.getElementById('custom-tab-settings-modal');
            const nameInput = modal?.querySelector('#custom-tab-settings-name');
            const section = nameInput?.closest('.modal-section');
            if (!tab || !section) return result;
            let row = section.querySelector('.custom-tab-title-visibility-v245');
            if (!row) {
                row = document.createElement('div');
                row.className = 'custom-tab-title-visibility-v245';
                row.style.cssText = 'display:flex;gap:10px;flex-wrap:wrap;margin-top:10px';
                row.innerHTML = '<button type="button" class="filter-tab show-v245">Show title</button><button type="button" class="filter-tab hide-v245">Hide title</button>';
                section.appendChild(row);
            }
            const sync = () => {
                row.querySelector('.show-v245')?.classList.toggle('active', tab.showPageTitle !== false);
                row.querySelector('.hide-v245')?.classList.toggle('active', tab.showPageTitle === false);
            };
            row.querySelector('.show-v245').onclick = () => { tab.showPageTitle = true; saveDb(); applyCustomTabChromeV245(tabId); sync(); };
            row.querySelector('.hide-v245').onclick = () => { tab.showPageTitle = false; saveDb(); applyCustomTabChromeV245(tabId); sync(); };
            sync();
            return result;
        };
    } catch {}

    // Restore the state captured by server.js before an old copied core could
    // overwrite it with the historical V227 Daily Logs landing behavior.
    const preserved = window.__loggyRestoreStateV245;
    if (preserved && !window.__loggyRestoreStateAppliedV245) {
        window.__loggyRestoreStateAppliedV245 = true;
        let attempts = 0;
        const restore = () => {
            attempts++;
            const title = document.getElementById('app-title');
            const ready = !!title && getComputedStyle(title).visibility !== 'hidden';
            if (!ready) {
                if (attempts < 160) setTimeout(restore, 50);
                return;
            }
            try {
                sessionStorage.setItem(preserved.key, preserved.tab || 'daily');
                const dayMatch = String(preserved.hash || '').match(/^#day\/(\d+)$/);
                if (dayMatch && typeof openDayLog === 'function') {
                    history.replaceState(null, '', preserved.hash);
                    openDayLog(Number(dayMatch[1]));
                    return;
                }
                if (typeof restoreLastTopLevelView === 'function') restoreLastTopLevelView();
            } catch {}
        };
        setTimeout(restore, 0);
    }
})();

/* V246 — file-backed Daily Log note images for existing logs. */
(function installDailyMediaStorageV246(){
    try {
        if (window.__dailyMediaStorageV246) return;
        window.__dailyMediaStorageV246 = true;

        async function uploadDailyNoteImageV246(file, dayNumber) {
            const response = await fetch(
                `/api/daily-media-raw/${encodeURIComponent(HOBBY)}?day=${encodeURIComponent(dayNumber)}&fileName=${encodeURIComponent(file.name || 'image')}&mime=${encodeURIComponent(file.type || 'application/octet-stream')}`,
                { method:'POST', headers:{'Content-Type':'application/octet-stream'}, body:file }
            );
            const result = await response.json().catch(() => ({}));
            if (!response.ok || !result?.image?.src) throw new Error(result?.message || 'Could not save that Daily Log image.');
            return result.image;
        }

        toggleStarImage = function(index) {
            if (!currentDay || !db.days?.[currentDay]?.noteImages) return;
            db.days[currentDay].noteImages = db.days[currentDay].noteImages.map((img, idx) => {
                const src = typeof img === 'string' ? img : img?.src;
                const nextStarred = idx === index ? !(typeof img === 'object' && img?.starred) : false;
                return typeof img === 'object' && img
                    ? { ...img, src, starred: nextStarred }
                    : { src, starred: nextStarred };
            });
            renderNoteImages(db.days[currentDay].noteImages);
            scheduleSaveDay();
        };

        addNoteImages = async function(files) {
            if (!currentDay || !files || !files.length) return;
            const dayNumber = currentDay;
            if (!db.days[dayNumber].noteImages) db.days[dayNumber].noteImages = [];
            const valid = [...files].filter(file => file?.type?.startsWith('image/'));
            if (!valid.length) return;
            const uploads = await Promise.allSettled(valid.map(file => uploadDailyNoteImageV246(file, dayNumber)));
            let added = 0;
            uploads.forEach(result => {
                if (result.status === 'fulfilled') {
                    db.days[dayNumber].noteImages.push({ ...result.value, starred:false });
                    added++;
                } else {
                    console.error('Daily Log image upload failed:', result.reason);
                    try { showFeatureToast?.(result.reason?.message || 'One Daily Log image could not be saved.'); } catch {}
                }
            });
            if (added) {
                renderNoteImages(db.days[dayNumber].noteImages);
                scheduleSaveDay();
            }
        };

        removeNoteImage = function(index) {
            if (!currentDay || !db.days?.[currentDay]?.noteImages) return;
            const removed = db.days[currentDay].noteImages[index];
            db.days[currentDay].noteImages.splice(index, 1);
            renderNoteImages(db.days[currentDay].noteImages);
            scheduleSaveDay();
            if (removed && typeof removed === 'object' && (removed.projectPath || String(removed.src || '').startsWith('/media/'))) {
                fetch(`/api/daily-media/${encodeURIComponent(HOBBY)}`, {
                    method:'DELETE',
                    headers:{'Content-Type':'application/json'},
                    body:JSON.stringify({ projectPath:removed.projectPath || '', src:removed.src || '' })
                }).catch(()=>{});
            }
        };
    } catch (error) {
        console.error('V246 Daily Log media storage could not initialize:', error);
    }
})();

/* V248: Staircase and Clock layouts removed. Saved selections fall back to Grid. */
(function(){
  const removed = new Set(['staircase','clock']);
  function fixV248(){
    try {
      if (window.db?.settings && removed.has(String(window.db.settings.dailyDayLayoutV228 || '').toLowerCase())) {
        window.db.settings.dailyDayLayoutV228 = 'grid';
        if (typeof window.saveDb === 'function') window.saveDb();
        if (typeof window.renderDays === 'function') window.renderDays();
      }
    } catch (_) {}
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fixV248, {once:true});
  else fixV248();
})();

/* V257 — global final-page-only New Day (+) guard. */
(() => {
    'use strict';
    if (window.__loggyHotfixV257FinalPlus) return;
    window.__loggyHotfixV257FinalPlus = true;

    const style = document.createElement('style');
    style.id = 'loggy-hotfix-v257-final-plus-style';
    style.textContent = `
      #grid-view.view.active #days-grid[data-final-active-page-v257="0"] .daily-add-day-slot-v238,
      #grid-view.view.active #days-grid[data-final-active-page-v257="0"] > .day-box[title="Add extra log day"],
      #grid-view.view.active #days-grid[data-final-active-page-v257="0"] > .polaroid-card[title="Add extra log day"]{
        display:none!important;
        visibility:hidden!important;
        pointer-events:none!important;
      }
    `;
    document.head.appendChild(style);

    function syncFinalPlusV257(){
        const grid = document.getElementById('days-grid');
        if (!grid) return;
        const paged = grid.classList.contains('daily-paged-layout-v231');
        const next = document.querySelector('#daily-day-pager-v231 [data-page-step-v231="1"]');
        const finalPage = !paged || !next || next.disabled === true;
        grid.dataset.finalActivePageV257 = finalPage ? '1' : '0';
        const button = grid.querySelector(':scope > .daily-add-day-slot-v238 > button[title="Add extra log day"], :scope > button.day-box[title="Add extra log day"], :scope > .polaroid-card[title="Add extra log day"]');
        const slot = button?.closest?.('.daily-add-day-slot-v238');
        [slot, button].filter(Boolean).forEach(node => {
            if (!finalPage) node.setAttribute('aria-hidden', 'true');
            else if (!node.classList.contains('daily-page-hidden-v231')) node.removeAttribute('aria-hidden');
        });
    }

    const wrapSetPage = () => {
        const current = window.__setDailyPageV231;
        if (typeof current !== 'function' || current.__v257FinalPlus) return;
        const wrapped = function(...args){
            const result = current.apply(this, args);
            requestAnimationFrame(syncFinalPlusV257);
            return result;
        };
        wrapped.__v257FinalPlus = true;
        window.__setDailyPageV231 = wrapped;
    };

    function bindObserversV257(){
        wrapSetPage();
        const grid = document.getElementById('days-grid');
        const next = document.querySelector('#daily-day-pager-v231 [data-page-step-v231="1"]');
        if (grid && grid.dataset.finalPlusObserverV257 !== '1') {
            grid.dataset.finalPlusObserverV257 = '1';
            new MutationObserver(syncFinalPlusV257).observe(grid, {attributes:true, attributeFilter:['class'], childList:true});
        }
        if (next && next.dataset.finalPlusObserverV257 !== '1') {
            next.dataset.finalPlusObserverV257 = '1';
            new MutationObserver(syncFinalPlusV257).observe(next, {attributes:true, attributeFilter:['disabled']});
        }
        syncFinalPlusV257();
    }

    document.addEventListener('click', event => {
        if (event.target.closest?.('#grid-view,[data-daily-layout-v228],[data-page-step-v231]')) {
            requestAnimationFrame(bindObserversV257);
        }
    }, true);
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => setTimeout(bindObserversV257, 0), {once:true});
    else setTimeout(bindObserversV257, 0);
})();


/* ============================================================
   V330 — CLEAN LAYOUT: STRICT 48-DAY PAGES, NEVER WRAP DAYS
   ============================================================ */
(() => {
    'use strict';
    if (window.__loggyClean48V330) return;
    window.__loggyClean48V330 = true;

    const PAGE_SIZE = 48;
    const q = (s,r=document) => r?.querySelector?.(s) || null;
    const qa = (s,r=document) => Array.from(r?.querySelectorAll?.(s) || []);
    let syncing = false;

    function isClean() {
        try { return (db?.settings?.dailyDayLayoutV228 || 'grid') === 'clean' && (db?.settings?.dailyViewType || 'default') !== 'polaroid'; }
        catch { return false; }
    }

    function dayNodes(grid) {
        return qa(':scope > [data-day]', grid).filter(el => Number.isFinite(Number(el.dataset.day)));
    }

    function addParts(grid) {
        const button = q(':scope > .daily-add-day-slot-v238 > button.day-box[title="Add extra log day"], :scope > button.day-box[title="Add extra log day"]', grid);
        return { button, slot: button?.closest?.('.daily-add-day-slot-v238') || button || null };
    }

    function strictClean48(pageOverride) {
        if (syncing || !isClean()) return;
        const grid = document.getElementById('days-grid');
        if (!grid || !document.getElementById('grid-view')?.classList.contains('active')) return;
        syncing = true;
        try {
            const nodes = dayNodes(grid);
            if (!nodes.length) return;
            const maxDay = Math.max(...nodes.map(el => Number(el.dataset.day)));
            const {button:addButton, slot:addSlot} = addParts(grid);
            const addDay = maxDay + 1;
            const total = Math.max(1, Math.ceil((maxDay + (addButton ? 1 : 0)) / PAGE_SIZE));
            let page = Number.isFinite(Number(pageOverride)) ? Math.trunc(Number(pageOverride)) : Math.trunc(Number(window.__dailyPageIndexV231 || 0));
            page = Math.max(0, Math.min(total - 1, page));
            window.__dailyPageIndexV231 = page;
            const start = page * PAGE_SIZE + 1;
            const end = start + PAGE_SIZE - 1;

            grid.classList.add('daily-day-layout-clean-v231','daily-paged-pattern-v231');
            grid.style.setProperty('grid-template-columns','repeat(8, minmax(0, 1fr))','important');
            grid.style.setProperty('grid-template-rows','repeat(6, minmax(52px, 1fr))','important');
            grid.style.setProperty('overflow-y','hidden','important');

            const visible=[];
            nodes.forEach(node => {
                const day=Number(node.dataset.day);
                const show=day>=start && day<=end;
                node.classList.toggle('daily-page-hidden-v231', !show);
                node.style.setProperty('display', show ? 'grid' : 'none', 'important');
                if (show) visible.push(node);
            });
            visible.sort((a,b)=>Number(a.dataset.day)-Number(b.dataset.day));
            visible.forEach((node,i)=>{
                node.style.setProperty('grid-column',String((i%8)+1),'important');
                node.style.setProperty('grid-row',String(Math.floor(i/8)+1),'important');
                node.style.setProperty('transform','none','important');
            });

            const addOnPage=!!addSlot && addDay>=start && addDay<=end;
            [addSlot,addButton].filter(Boolean).forEach(node=>{
                node.classList.toggle('daily-page-hidden-v231',!addOnPage);
                node.classList.toggle('v251-hide-final-plus',!addOnPage);
                node.style.setProperty('display',addOnPage?'grid':'none','important');
                node.setAttribute('aria-hidden',String(!addOnPage));
            });
            if(addOnPage && addSlot){
                const i=visible.length;
                addSlot.style.setProperty('grid-column',String((i%8)+1),'important');
                addSlot.style.setProperty('grid-row',String(Math.floor(i/8)+1),'important');
            }

            const pager=document.getElementById('daily-day-pager-v231');
            if(pager){
                pager.classList.add('visible-v231');
                const label=q('.daily-page-label-v231',pager);
                if(label) label.textContent=`Days ${start}–${Math.min(end,maxDay)} · Page ${page+1} of ${total}`;
                const prev=q('[data-page-step-v231="-1"]',pager), next=q('[data-page-step-v231="1"]',pager);
                if(prev) prev.disabled=page<=0;
                if(next) next.disabled=page>=total-1;
            }
        } finally { syncing=false; }
    }

    const wrapPager=()=>{
        const current=window.__setDailyPageV231;
        if(typeof current!=='function' || current.__clean48V330) return;
        const wrapped=function(index,...rest){
            const result=current.call(this,index,...rest);
            requestAnimationFrame(()=>strictClean48(index));
            return result;
        };
        wrapped.__clean48V330=true;
        window.__setDailyPageV231=wrapped;
    };

    function schedule(page){ requestAnimationFrame(()=>requestAnimationFrame(()=>strictClean48(page))); }
    document.addEventListener('click',e=>{
        const step=e.target.closest?.('#daily-day-pager-v231 [data-page-step-v231]');
        if(step && isClean()) schedule((window.__dailyPageIndexV231||0)+Number(step.dataset.pageStepV231||0));
        if(e.target.closest?.('[data-daily-layout-v228="clean"],#open-daily-logs-nav-btn,#open-daily-settings-btn')) schedule();
    },true);
    const observer=new MutationObserver(()=>{ if(isClean()) schedule(); });
    const bind=()=>{
        wrapPager();
        const grid=document.getElementById('days-grid');
        if(grid && grid.dataset.clean48ObserverV330!=='1'){
            grid.dataset.clean48ObserverV330='1';
            observer.observe(grid,{childList:true,subtree:false});
        }
        schedule();
    };
    if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',bind,{once:true}); else bind();
    window.addEventListener('resize',()=>schedule(),{passive:true});
})();


/* ============================================================
   V487 — AUTHORITATIVE SMART PLACEHOLDER PRACTICE
   Rewritten to support every placeholder in a pattern in both modes.
   ============================================================ */
(() => {
  'use strict';
  if (window.__loggySmartPlaceholderAuthorityV487) return;
  window.__loggySmartPlaceholderAuthorityV487 = true;

  const esc = value => String(value ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const attr = esc;
  const shuffle = list => {
    const out=[...list];
    for(let i=out.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[out[i],out[j]]=[out[j],out[i]];}
    return out;
  };
  const pick = list => list?.length ? list[Math.floor(Math.random()*list.length)] : null;

  function helpersReady(){
    return typeof db==='object' &&
      typeof window.getAllLoggedItemIdsV58==='function' &&
      typeof window.knowledgePatternItemsV56==='function' &&
      typeof window.learnedPlaceholderPatternsV59==='function' &&
      typeof window.placeholderSegmentsV56==='function' &&
      typeof window.placeholderRequirementMatchesItemV58==='function';
  }
  function learnedItems(){
    const patternSet=new Set(window.knowledgePatternItemsV56());
    return Array.from(new Set(window.getAllLoggedItemIdsV58()))
      .filter(id=>!patternSet.has(id))
      .filter(id=>db?.phrase_meta?.[id])
      .sort((a,b)=>String(a).localeCompare(String(b)));
  }
  function learnedPatterns(){
    return window.learnedPlaceholderPatternsV59()
      .filter(id=>window.placeholderSegmentsV56(id).some(seg=>seg.type==='slot'));
  }
  function formattedPattern(patternId){
    return window.placeholderSegmentsV56(patternId).map(seg=>
      seg.type==='slot' ? String(seg.name||'').toUpperCase() : String(seg.text||'')
    ).join('');
  }
  function makeModal(){
    document.getElementById('smart-placeholder-practice-modal-v59')?.remove();
    document.getElementById('smart-placeholder-practice-modal-v468')?.remove();
    document.getElementById('smart-placeholder-practice-modal-v474')?.remove();
    document.getElementById('smart-placeholder-practice-modal-v487')?.remove();
    const modal=document.createElement('div');
    modal.id='smart-placeholder-practice-modal-v487';
    modal.className='modal-overlay quiz-practice-modal-v59 smart-practice-modal-v474 smart-practice-modal-v487';
    modal.innerHTML=`<div class="modal-box quiz-practice-box-v59 smart-practice-box-v474 smart-practice-box-v487">
      <div class="modal-header"><h2>Smart Placeholder Practice</h2><button type="button" class="small-icon-btn smart-practice-close-v487" aria-label="Close"><i class="ph ph-x"></i></button></div>
      <div class="quiz-practice-body-v59 smart-practice-body-v474 smart-practice-body-v487"></div>
    </div>`;
    document.body.appendChild(modal);
    modal.querySelector('.smart-practice-close-v487').onclick=()=>modal.remove();
    return modal;
  }
  function answerButton(id, dataName){
    return `<button type="button" class="sentence-builder-kb-result-v56 smart-practice-answer-v474" draggable="true" ${dataName}="${attr(id)}"><span>${esc(id)}</span><i class="ph ph-dots-six-vertical"></i></button>`;
  }
  function slotHtml(seg, value, dataAttr, active=false){
    return `<div class="sentence-builder-slot-v56 smart-practice-slot-v487${value?' filled':''}${active?' active':''}" ${dataAttr}="${seg.slotIndex}" data-smart-slot-name-v487="${attr(seg.name)}"${value?' draggable="true"':''}>
      <span class="sentence-builder-slot-label-v56">${esc(String(seg.name).toUpperCase())}</span>
      <div class="sentence-builder-slot-value-v56">${value?`<strong>${esc(value)}</strong><span class="smart-practice-remove-hint-v489">drag back to choices to remove</span>`:'<span>Drop an item here</span>'}</div>
    </div>`;
  }
  function feedback(body,text,state='neutral'){
    const el=body.querySelector('.smart-practice-feedback-v474');
    if(!el)return;
    el.className=`smart-practice-feedback-v474 ${state}`;
    el.textContent=text||'';
  }
  function nextEmptySlot(slots, values, fromIndex=-1){
    if(!slots.length) return null;
    for(let step=1; step<=slots.length; step++){
      const slot=slots[(fromIndex+step+slots.length)%slots.length];
      if(!values[slot.slotIndex]) return slot.slotIndex;
    }
    return slots[0].slotIndex;
  }

  function openPractice(){
    if(!helpersReady()){
      let tries=0;
      const wait=setInterval(()=>{
        tries++;
        if(helpersReady()){clearInterval(wait);openPractice();}
        else if(tries>30){clearInterval(wait);}
      },50);
      return;
    }

    const modal=makeModal();
    const body=modal.querySelector('.smart-practice-body-v487');
    let renderQueued=false;
    const queueRender=(fn)=>{
      if(renderQueued) return;
      renderQueued=true;
      requestAnimationFrame(()=>{
        renderQueued=false;
        if(document.body.contains(modal)) fn();
      });
    };
    const items=learnedItems();
    const patterns=learnedPatterns();

    let allPattern=null;
    let allValues={};
    let allActiveSlot=null;

    let choicePattern=null;
    let choiceValues={};
    let choiceActiveSlot=null;
    let choiceBanks={};

    const modeHeader=(title,help)=>`<div class="smart-practice-mode-top-v474"><button type="button" class="icon-btn smart-practice-back-v487"><i class="ph ph-arrow-left"></i> Modes</button><div><strong>${esc(title)}</strong><small>${esc(help)}</small></div></div>`;
    const bindBack=()=>body.querySelector('.smart-practice-back-v487')?.addEventListener('click',showChooser);

    function showChooser(){
      body.innerHTML=`
        <div class="smart-practice-mode-chooser-v474">
          <p class="smart-practice-chooser-copy-v474">Choose how you want to practice this time.</p>
          <button type="button" class="smart-practice-mode-card-v474" data-mode-v487="all"><strong>All Learned Items</strong><span>Search every learned non-pattern item by name, fill every placeholder in the pattern, then Check Answer.</span></button>
          <button type="button" class="smart-practice-mode-card-v474" data-mode-v487="choices"><strong>4 Choices</strong><span>Fill every placeholder using a four-choice bank tailored to whichever placeholder is active.</span></button>
        </div>`;
      body.querySelector('[data-mode-v487="all"]').onclick=startAll;
      body.querySelector('[data-mode-v487="choices"]').onclick=startChoices;
    }

    /* ---------------- ALL LEARNED ITEMS ---------------- */
    function chooseAllPattern(){
      allPattern=pick(patterns);
      allValues={};
      const slots=allPattern ? window.placeholderSegmentsV56(allPattern).filter(seg=>seg.type==='slot') : [];
      allActiveSlot=slots[0]?.slotIndex ?? null;
    }
    function startAll(){
      if(!patterns.length){body.innerHTML=`${modeHeader('All Learned Items','Search learned item names only.')}<div class="quiz-settings-empty-v58">No learned placeholder patterns are available yet.</div>`;bindBack();return;}
      chooseAllPattern();
      renderAll();
    }
    function renderAll(){
      const segments=window.placeholderSegmentsV56(allPattern);
      const slots=segments.filter(seg=>seg.type==='slot');
      if(allActiveSlot==null && slots.length) allActiveSlot=slots[0].slotIndex;
      body.innerHTML=`${modeHeader('All Learned Items','All learned non-pattern KB items. Search checks item names only.')}
        <div class="quiz-practice-toolbar-v59"><strong>${esc(formattedPattern(allPattern))}</strong><button type="button" class="small-icon-btn smart-practice-shuffle-v487" title="New pattern"><i class="ph ph-shuffle"></i></button></div>
        <div class="sentence-builder-canvas-v56 smart-practice-canvas-v474">${segments.map(seg=>seg.type==='text'?`<span class="sentence-builder-literal-v56">${esc(seg.text)}</span>`:slotHtml(seg,allValues[seg.slotIndex],'data-all-slot-v487',seg.slotIndex===allActiveSlot)).join('')}</div>
        <div class="sentence-builder-search-v56"><i class="ph ph-magnifying-glass"></i><input class="smart-practice-search-v487" placeholder="Search learned item names…" autocomplete="off"></div>
        <div class="sentence-builder-kb-results-v56 smart-practice-bank-v487" data-smart-remove-zone-v489="all"></div>
        <div class="smart-practice-feedback-v474 neutral" aria-live="polite"></div>
        <div class="quiz-generated-actions-v58"><button type="button" class="icon-btn smart-practice-check-v487">Check Answer</button></div>`;
      bindBack();
      const search=body.querySelector('.smart-practice-search-v487');
      const bank=body.querySelector('.smart-practice-bank-v487');
      const draw=()=>{
        const q=String(search.value||'').trim().toLowerCase();
        const shown=items.filter(id=>!q||String(id).toLowerCase().includes(q));
        bank.innerHTML=shown.length?shown.map(id=>answerButton(id,'data-all-item-v487')).join(''):'<div class="sentence-pattern-no-results-v55">No learned item names match that search.</div>';
        bank.querySelectorAll('[data-all-item-v487]').forEach(btn=>{
          btn.addEventListener('dragstart',e=>{e.dataTransfer.effectAllowed='copy';e.dataTransfer.setData('text/loggy-smart-v487',btn.dataset.allItemV487);});
          btn.addEventListener('click',()=>{
            if(allActiveSlot==null) return;
            allValues[allActiveSlot]=btn.dataset.allItemV487;
            const currentIndex=slots.findIndex(s=>s.slotIndex===allActiveSlot);
            allActiveSlot=nextEmptySlot(slots,allValues,currentIndex);
            queueRender(renderAll);
          });
        });
      };
      search.addEventListener('input',draw); draw();

      body.querySelectorAll('[data-all-slot-v487]').forEach(slot=>{
        slot.addEventListener('click',()=>{
          const next=Number(slot.dataset.allSlotV487);
          if(next===allActiveSlot) return;
          allActiveSlot=next;
          queueRender(renderAll);
        });
        if(allValues[Number(slot.dataset.allSlotV487)]){
          slot.addEventListener('dragstart',e=>{
            e.dataTransfer.effectAllowed='move';
            e.dataTransfer.setData('text/loggy-smart-filled-v489', String(slot.dataset.allSlotV487));
            e.dataTransfer.setData('text/loggy-smart-v487', allValues[Number(slot.dataset.allSlotV487)]||'');
          });
        }
        slot.addEventListener('dragover',e=>{if(!Array.from(e.dataTransfer.types||[]).includes('text/loggy-smart-v487'))return;e.preventDefault();slot.classList.add('drop-ready');});
        slot.addEventListener('dragleave',()=>slot.classList.remove('drop-ready'));
        slot.addEventListener('drop',e=>{
          const id=e.dataTransfer.getData('text/loggy-smart-v487');
          if(!id)return;
          e.preventDefault();
          const targetIndex=Number(slot.dataset.allSlotV487);
          allValues[targetIndex]=id;
          const currentIndex=slots.findIndex(s=>s.slotIndex===targetIndex);
          allActiveSlot=nextEmptySlot(slots,allValues,currentIndex);
          queueRender(renderAll);
        });
      });
      bank.addEventListener('dragover',e=>{
        if(!Array.from(e.dataTransfer.types||[]).includes('text/loggy-smart-filled-v489')) return;
        e.preventDefault();
        e.dataTransfer.dropEffect='move';
        bank.classList.add('remove-drop-ready-v489');
      });
      bank.addEventListener('dragleave',()=>bank.classList.remove('remove-drop-ready-v489'));
      bank.addEventListener('drop',e=>{
        const raw=e.dataTransfer.getData('text/loggy-smart-filled-v489');
        if(raw==='') return;
        e.preventDefault();
        bank.classList.remove('remove-drop-ready-v489');
        const idx=Number(raw);
        delete allValues[idx];
        allActiveSlot=idx;
        queueRender(renderAll);
      });
      body.querySelector('.smart-practice-shuffle-v487').onclick=()=>{chooseAllPattern();queueRender(renderAll);};
      body.querySelector('.smart-practice-check-v487').onclick=()=>{
        if(slots.some(seg=>!allValues[seg.slotIndex])){feedback(body,'Fill every placeholder first.','neutral');return;}
        let wrong=0;
        slots.forEach(seg=>{
          const ok=window.placeholderRequirementMatchesItemV58(seg.name,allValues[seg.slotIndex]);
          const el=body.querySelector(`[data-all-slot-v487="${seg.slotIndex}"]`);
          el?.classList.toggle('answer-correct-v457',ok);
          el?.classList.toggle('answer-wrong-v457',!ok);
          if(!ok)wrong++;
        });
        feedback(body,wrong?`Incorrect. ${wrong===1?'One item does':`${wrong} items do`} not fit the required placeholder type${wrong===1?'':'s'}.`:'Correct. Every item fits its placeholder.',wrong?'wrong':'correct');
      };
    }

    /* ---------------- FOUR CHOICES ---------------- */
    function validChoicePatterns(){
      return patterns.filter(patternId=>{
        const slots=window.placeholderSegmentsV56(patternId).filter(seg=>seg.type==='slot');
        return slots.length && slots.every(slot=>{
          const good=items.filter(id=>window.placeholderRequirementMatchesItemV58(slot.name,id));
          const bad=items.filter(id=>!window.placeholderRequirementMatchesItemV58(slot.name,id));
          return good.length>=1 && bad.length>=3;
        });
      });
    }
    function bankForSlot(slot){
      if(choiceBanks[slot.slotIndex]) return choiceBanks[slot.slotIndex];
      const good=items.filter(id=>window.placeholderRequirementMatchesItemV58(slot.name,id));
      const bad=items.filter(id=>!window.placeholderRequirementMatchesItemV58(slot.name,id));
      if(!good.length || bad.length<3) return [];
      const correct=pick(good);
      const choices=shuffle([correct,...shuffle(bad).slice(0,3)]);
      choiceBanks[slot.slotIndex]={correct,choices};
      return choiceBanks[slot.slotIndex];
    }
    function chooseChoicePattern(){
      choicePattern=pick(validChoicePatterns());
      choiceValues={};
      choiceBanks={};
      const slots=choicePattern ? window.placeholderSegmentsV56(choicePattern).filter(seg=>seg.type==='slot') : [];
      choiceActiveSlot=slots[0]?.slotIndex ?? null;
      slots.forEach(bankForSlot);
    }
    function startChoices(){
      chooseChoicePattern();
      renderChoices();
    }
    function renderChoices(){
      if(!choicePattern){body.innerHTML=`${modeHeader('4 Choices','Four choices are generated for each placeholder.')}<div class="quiz-settings-empty-v58">There are not enough varied learned items yet to give every placeholder one correct answer and three incorrect choices.</div>`;bindBack();return;}
      const segments=window.placeholderSegmentsV56(choicePattern);
      const slots=segments.filter(seg=>seg.type==='slot');
      const active=slots.find(s=>s.slotIndex===choiceActiveSlot) || slots[0];
      choiceActiveSlot=active?.slotIndex ?? null;
      const bankData=active ? bankForSlot(active) : null;
      body.innerHTML=`${modeHeader('4 Choices','Fill every placeholder. Click a placeholder to switch which four choices are shown.')}
        <div class="quiz-practice-toolbar-v59"><strong>${esc(formattedPattern(choicePattern))}</strong><button type="button" class="small-icon-btn smart-choice-new-v487" title="New question"><i class="ph ph-shuffle"></i></button></div>
        <div class="sentence-builder-canvas-v56 smart-practice-canvas-v474 smart-choice-pattern-v487">${segments.map(seg=>seg.type==='text'?`<span class="sentence-builder-literal-v56">${esc(seg.text)}</span>`:slotHtml(seg,choiceValues[seg.slotIndex],'data-choice-slot-v487',seg.slotIndex===choiceActiveSlot)).join('')}</div>
        <div class="smart-choice-bank-v474 smart-choice-bank-v487" data-smart-remove-zone-v489="choices">${(bankData?.choices||[]).map(id=>answerButton(id,'data-choice-item-v487')).join('')}</div>
        <div class="smart-practice-feedback-v474 neutral" aria-live="polite"></div>
        <div class="quiz-generated-actions-v58"><button type="button" class="icon-btn smart-choice-check-v487">Check Answer</button></div>`;
      bindBack();

      body.querySelectorAll('[data-choice-slot-v487]').forEach(slot=>{
        slot.addEventListener('click',()=>{
          const next=Number(slot.dataset.choiceSlotV487);
          if(next===choiceActiveSlot) return;
          choiceActiveSlot=next;
          queueRender(renderChoices);
        });
        if(choiceValues[Number(slot.dataset.choiceSlotV487)]){
          slot.addEventListener('dragstart',e=>{
            e.dataTransfer.effectAllowed='move';
            e.dataTransfer.setData('text/loggy-smart-choice-filled-v489', String(slot.dataset.choiceSlotV487));
            e.dataTransfer.setData('text/loggy-smart-choice-v487', choiceValues[Number(slot.dataset.choiceSlotV487)]||'');
          });
        }
        slot.addEventListener('dragover',e=>{if(Number(slot.dataset.choiceSlotV487)!==choiceActiveSlot)return;if(!Array.from(e.dataTransfer.types||[]).includes('text/loggy-smart-choice-v487'))return;e.preventDefault();slot.classList.add('drop-ready');});
        slot.addEventListener('dragleave',()=>slot.classList.remove('drop-ready'));
        slot.addEventListener('drop',e=>{
          const slotIndex=Number(slot.dataset.choiceSlotV487);
          if(slotIndex!==choiceActiveSlot)return;
          const id=e.dataTransfer.getData('text/loggy-smart-choice-v487');
          if(!id)return;
          e.preventDefault();
          choiceValues[slotIndex]=id;
          const currentIndex=slots.findIndex(s=>s.slotIndex===slotIndex);
          choiceActiveSlot=nextEmptySlot(slots,choiceValues,currentIndex);
          queueRender(renderChoices);
        });
      });

      body.querySelectorAll('[data-choice-item-v487]').forEach(btn=>{
        btn.addEventListener('dragstart',e=>{e.dataTransfer.effectAllowed='copy';e.dataTransfer.setData('text/loggy-smart-choice-v487',btn.dataset.choiceItemV487);});
        btn.addEventListener('click',()=>{
          if(choiceActiveSlot==null)return;
          choiceValues[choiceActiveSlot]=btn.dataset.choiceItemV487;
          const currentIndex=slots.findIndex(s=>s.slotIndex===choiceActiveSlot);
          choiceActiveSlot=nextEmptySlot(slots,choiceValues,currentIndex);
          queueRender(renderChoices);
        });
      });
      const choiceBank=body.querySelector('.smart-choice-bank-v487');
      choiceBank?.addEventListener('dragover',e=>{
        if(!Array.from(e.dataTransfer.types||[]).includes('text/loggy-smart-choice-filled-v489')) return;
        e.preventDefault();
        e.dataTransfer.dropEffect='move';
        choiceBank.classList.add('remove-drop-ready-v489');
      });
      choiceBank?.addEventListener('dragleave',()=>choiceBank.classList.remove('remove-drop-ready-v489'));
      choiceBank?.addEventListener('drop',e=>{
        const raw=e.dataTransfer.getData('text/loggy-smart-choice-filled-v489');
        if(raw==='') return;
        e.preventDefault();
        choiceBank.classList.remove('remove-drop-ready-v489');
        const idx=Number(raw);
        delete choiceValues[idx];
        choiceActiveSlot=idx;
        queueRender(renderChoices);
      });

      body.querySelector('.smart-choice-new-v487').onclick=()=>{chooseChoicePattern();queueRender(renderChoices);};
      body.querySelector('.smart-choice-check-v487').onclick=()=>{
        if(slots.some(seg=>!choiceValues[seg.slotIndex])){feedback(body,'Fill every placeholder first.','neutral');return;}
        let wrong=0;
        slots.forEach(seg=>{
          const ok=window.placeholderRequirementMatchesItemV58(seg.name,choiceValues[seg.slotIndex]);
          const el=body.querySelector(`[data-choice-slot-v487="${seg.slotIndex}"]`);
          el?.classList.toggle('answer-correct-v457',ok);
          el?.classList.toggle('answer-wrong-v457',!ok);
          if(!ok)wrong++;
        });
        feedback(body,wrong?`Incorrect. ${wrong===1?'One answer does':`${wrong} answers do`} not fit the required placeholder type${wrong===1?'':'s'}.`:'Correct. Every answer fits its placeholder.',wrong?'wrong':'correct');
      };
    }

    showChooser();
  }

  window.openSmartPlaceholderPracticeV474=openPractice;
  window.openSmartPlaceholderPracticeV487=openPractice;
  document.addEventListener('click',event=>{
    const button=event.target?.closest?.('.open-smart-practice-v59');
    if(!button)return;
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    if(button.closest?.('.wb-quiz-window-v507') && typeof window.__loggyWhiteboardQuizPracticeRouterV518==='function'){
      if(window.__loggyWhiteboardQuizPracticeRouterV518('smart')) return;
    }
    openPractice();
  },true);
})();
