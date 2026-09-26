// V56 — FLEXIBLE PLACEHOLDERS / UNDIRECTED CONNECTION GRAPH /
// SENTENCE BUILDER DRAG+DROP / KB MODAL POLISH / CREATIVE BACKGROUNDS
// ============================================================

const THEME_GRADIENT_PRESETS_V56 = [{"name": "Summer Shore", "css": "radial-gradient(circle at 50% 5%,rgba(255,255,255,.58),transparent 32%),radial-gradient(circle at 16% 82%,rgba(255,146,126,.18),transparent 30%),radial-gradient(circle at 86% 16%,rgba(255,211,110,.20),transparent 28%),linear-gradient(180deg,#bfe9fb 0%,#daf6ff 34%,#fef0ca 74%,#f9e1bf 100%)"}, {"name": "Blush Sky", "css": "linear-gradient(135deg,#ffd6e7 0%,#fff1c7 52%,#d9efff 100%)"}, {"name": "Cotton Candy", "css": "linear-gradient(135deg,#ffc9e8 0%,#cdb7ff 50%,#bdeaff 100%)"}, {"name": "Peach Cream", "css": "linear-gradient(135deg,#ffd1b8 0%,#fff0d6 55%,#ffe2ef 100%)"}, {"name": "Lilac Milk", "css": "linear-gradient(135deg,#e6d7ff 0%,#f8edff 48%,#dfe8ff 100%)"}, {"name": "Mint Cloud", "css": "linear-gradient(135deg,#c9f7df 0%,#edfff7 52%,#d8f3ff 100%)"}, {"name": "Lemon Sorbet", "css": "linear-gradient(135deg,#fff3a8 0%,#fff9d7 50%,#ffd6c9 100%)"}, {"name": "Rose Water", "css": "linear-gradient(135deg,#f9c8d9 0%,#ffe7ef 48%,#f7e6ff 100%)"}, {"name": "Blueberry Cream", "css": "linear-gradient(135deg,#c7d8ff 0%,#e6ecff 45%,#eddcff 100%)"}, {"name": "Sea Glass", "css": "linear-gradient(135deg,#bce8df 0%,#dff7ef 45%,#ccecff 100%)"}, {"name": "Vanilla Berry", "css": "linear-gradient(135deg,#fff0c8 0%,#ffdbe9 48%,#e7dbff 100%)"}, {"name": "Sunset Soda", "css": "linear-gradient(135deg,#ff9d7a 0%,#ffcf8d 45%,#d7b7ff 100%)"}, {"name": "Cherry Cola", "css": "linear-gradient(135deg,#6e1423 0%,#a62639 48%,#f05c7a 100%)"}, {"name": "Ocean Pop", "css": "linear-gradient(135deg,#0e7490 0%,#22b8cf 48%,#8be9fd 100%)"}, {"name": "Electric Grape", "css": "linear-gradient(135deg,#4c1d95 0%,#7c3aed 48%,#c084fc 100%)"}, {"name": "Bubblegum Neon", "css": "linear-gradient(135deg,#ff4fa3 0%,#9b5cff 50%,#52d9ff 100%)"}, {"name": "Citrus Pop", "css": "linear-gradient(135deg,#ff8a00 0%,#ffd000 48%,#90e650 100%)"}, {"name": "Aqua Lime", "css": "linear-gradient(135deg,#00a6a6 0%,#2dd4bf 48%,#bef264 100%)"}, {"name": "Berry Punch", "css": "linear-gradient(135deg,#8b1e3f 0%,#d946ef 48%,#fb7185 100%)"}, {"name": "Purple Soda", "css": "linear-gradient(135deg,#312e81 0%,#7c3aed 50%,#ec4899 100%)"}, {"name": "Mango Heat", "css": "linear-gradient(135deg,#f97316 0%,#fbbf24 48%,#ef4444 100%)"}, {"name": "Midnight Blue", "css": "linear-gradient(135deg,#020617 0%,#172554 50%,#1d4ed8 100%)"}, {"name": "Dark Plum", "css": "linear-gradient(135deg,#1f102b 0%,#4c1d5f 52%,#8b2f70 100%)"}, {"name": "Forest Night", "css": "linear-gradient(135deg,#071a12 0%,#123c2b 50%,#1f6f50 100%)"}, {"name": "Charcoal Rose", "css": "linear-gradient(135deg,#171717 0%,#3f2a36 50%,#7c3f5d 100%)"}, {"name": "Night Aquarium", "css": "linear-gradient(135deg,#001827 0%,#023047 48%,#126782 100%)"}, {"name": "Black Cherry", "css": "linear-gradient(135deg,#12070a 0%,#3a0d1b 50%,#7f1d3a 100%)"}, {"name": "Deep Violet", "css": "linear-gradient(135deg,#0f0820 0%,#2e1065 50%,#5b21b6 100%)"}, {"name": "Storm", "css": "linear-gradient(135deg,#111827 0%,#334155 50%,#64748b 100%)"}, {"name": "Velvet Teal", "css": "linear-gradient(135deg,#071f22 0%,#0f4c5c 50%,#168aad 100%)"}, {"name": "Coffee Night", "css": "linear-gradient(135deg,#1b120d 0%,#4a2c1b 50%,#805a3b 100%)"}, {"name": "Aurora", "css": "linear-gradient(135deg,#071a2b 0%,#164e63 34%,#22c55e 66%,#7c3aed 100%)"}, {"name": "Northern Lights", "css": "linear-gradient(120deg,#061826 0%,#0f766e 35%,#22c55e 58%,#8b5cf6 100%)"}, {"name": "Galaxy", "css": "radial-gradient(circle at 20% 20%,#6d28d9 0%,transparent 35%),radial-gradient(circle at 80% 30%,#2563eb 0%,transparent 34%),linear-gradient(135deg,#09051a 0%,#160b38 100%)"}, {"name": "Nebula Pink", "css": "radial-gradient(circle at 25% 30%,#ec4899 0%,transparent 33%),radial-gradient(circle at 70% 60%,#7c3aed 0%,transparent 36%),linear-gradient(135deg,#12071f 0%,#1e1b4b 100%)"}, {"name": "Moon Mist", "css": "radial-gradient(circle at 70% 18%,#ffffff 0%,#dbeafe 10%,transparent 22%),linear-gradient(135deg,#cbd5e1 0%,#e2e8f0 48%,#c7d2fe 100%)"}, {"name": "Firefly", "css": "radial-gradient(circle at 18% 24%,#fef08a 0%,transparent 12%),radial-gradient(circle at 74% 68%,#bef264 0%,transparent 11%),linear-gradient(135deg,#0b2a1d 0%,#164e3f 100%)"}, {"name": "Dawn", "css": "linear-gradient(180deg,#8ec5fc 0%,#e0c3fc 46%,#ffe0b2 100%)"}, {"name": "Dusk", "css": "linear-gradient(180deg,#25316d 0%,#5f6f94 42%,#dcae96 100%)"}, {"name": "Golden Hour", "css": "linear-gradient(160deg,#f59e0b 0%,#fbbf24 40%,#fb7185 100%)"}, {"name": "Blue Hour", "css": "linear-gradient(160deg,#172554 0%,#1d4ed8 45%,#93c5fd 100%)"}, {"name": "Spring Meadow", "css": "linear-gradient(135deg,#d9f99d 0%,#bbf7d0 45%,#bae6fd 100%)"}, {"name": "Summer Pool", "css": "linear-gradient(135deg,#7dd3fc 0%,#67e8f9 45%,#a7f3d0 100%)"}, {"name": "Autumn Leaves", "css": "linear-gradient(135deg,#7c2d12 0%,#ea580c 48%,#facc15 100%)"}, {"name": "Winter Frost", "css": "linear-gradient(135deg,#dbeafe 0%,#e0f2fe 48%,#f8fafc 100%)"}, {"name": "Candy Cane", "css": "repeating-linear-gradient(135deg,#ffffff 0 24px,#fecdd3 24px 48px,#ffffff 48px 72px,#ef4444 72px 96px)"}, {"name": "Notebook Pastel", "css": "linear-gradient(135deg,#fff7ed 0%,#fce7f3 50%,#e0f2fe 100%)"}, {"name": "Lavender Haze", "css": "linear-gradient(135deg,#c4b5fd 0%,#ddd6fe 45%,#f5d0fe 100%)"}, {"name": "Coral Reef", "css": "linear-gradient(135deg,#fb7185 0%,#fdba74 48%,#67e8f9 100%)"}, {"name": "Mermaid", "css": "linear-gradient(135deg,#0f766e 0%,#2dd4bf 42%,#a78bfa 100%)"}, {"name": "Dragon Fruit", "css": "linear-gradient(135deg,#e11d48 0%,#f472b6 48%,#84cc16 100%)"}, {"name": "Butterfly", "css": "linear-gradient(135deg,#60a5fa 0%,#a78bfa 48%,#f472b6 100%)"}, {"name": "Fairy Dust", "css": "radial-gradient(circle at 20% 30%,#ffffff 0 2px,transparent 3px),radial-gradient(circle at 70% 55%,#ffffff 0 2px,transparent 3px),linear-gradient(135deg,#f5d0fe 0%,#c4b5fd 50%,#bae6fd 100%)"}, {"name": "Retro Peach", "css": "linear-gradient(135deg,#f9a8d4 0%,#fdba74 50%,#fde68a 100%)"}, {"name": "Y2K Chrome", "css": "linear-gradient(135deg,#dbeafe 0%,#f5f3ff 30%,#a5b4fc 58%,#fbcfe8 100%)"}, {"name": "Arcade", "css": "linear-gradient(135deg,#111827 0%,#581c87 35%,#be185d 68%,#06b6d4 100%)"}, {"name": "Mint Chocolate", "css": "linear-gradient(135deg,#134e4a 0%,#5eead4 52%,#3f2d20 100%)"}, {"name": "Strawberry Milk", "css": "linear-gradient(135deg,#fecdd3 0%,#fff1f2 52%,#f9a8d4 100%)"}, {"name": "Matcha Latte", "css": "linear-gradient(135deg,#84a98c 0%,#cad2c5 48%,#f5f1e8 100%)"}, {"name": "Blue Raspberry", "css": "linear-gradient(135deg,#0284c7 0%,#38bdf8 48%,#c084fc 100%)"}, {"name": "Sakura", "css": "linear-gradient(135deg,#fbcfe8 0%,#ffe4e6 48%,#ddd6fe 100%)"}, {"name": "Desert", "css": "linear-gradient(135deg,#b45309 0%,#f59e0b 45%,#fde68a 100%)"}, {"name": "Cloudy Day", "css": "linear-gradient(135deg,#94a3b8 0%,#cbd5e1 48%,#e2e8f0 100%)"}, {"name": "Ice Cream", "css": "linear-gradient(135deg,#fde68a 0%,#fecdd3 34%,#ddd6fe 67%,#bae6fd 100%)"}, {"name": "Prism", "css": "linear-gradient(120deg,#f87171 0%,#fb923c 16%,#facc15 32%,#4ade80 48%,#22d3ee 64%,#60a5fa 80%,#c084fc 100%)"}];

// ------------------------------------------------------------
// KNOWLEDGE BASE MODAL BACKDROP CLOSE + GLOBAL SEARCH OUTSIDE CLOSE
// ------------------------------------------------------------

(function bindBackdropAndSearchCloseV56() {
    if (settingsModal && settingsModal.dataset.backdropCloseV56 !== 'true') {
        settingsModal.dataset.backdropCloseV56 = 'true';
        settingsModal.addEventListener('pointerdown', event => {
            if (event.target === settingsModal) {
                settingsModal.classList.add('hidden');
            }
        });
    }

    if (phraseModal && phraseModal.dataset.backdropCloseV56 !== 'true') {
        phraseModal.dataset.backdropCloseV56 = 'true';
        phraseModal.addEventListener('pointerdown', event => {
            if (event.target !== phraseModal) return;
            phraseModal.classList.add('hidden');
            const vid = document.getElementById('phrase-modal-video-container');
            if (vid) vid.innerHTML = '';
        });
    }

    document.addEventListener('pointerdown', event => {
        const host = document.getElementById('daily-global-search-results');
        if (!host || host.classList.contains('hidden')) return;
        if (event.target.closest('.daily-global-search-column')) return;
        host.classList.add('hidden');
    }, true);
})();


// ------------------------------------------------------------
// CATEGORY NAME ACTIONS USE SITE-STYLED MODALS
// ------------------------------------------------------------

renameKnowledgeCategory = async function(oldName) {
    const result = await showAppPrompt({
        title: 'Rename Category',
        label: 'Category Name',
        value: oldName,
        submitLabel: 'Save'
    });

    if (result === null) return;

    const cleanName = String(result).trim();
    if (!cleanName || cleanName === oldName) return;

    if (db.settings.categories.includes(cleanName)) {
        showFeatureToast('A category with that name already exists.');
        return;
    }

    const index = db.settings.categories.indexOf(oldName);
    if (index < 0) return;

    db.settings.categories[index] = cleanName;
    db.settings.categorySettings[cleanName] =
        db.settings.categorySettings[oldName] || { fields: [] };
    delete db.settings.categorySettings[oldName];

    Object.values(db.phrase_meta || {}).forEach(meta => {
        if (meta?.type === oldName) meta.type = cleanName;
    });

    if (libraryFilter === oldName) libraryFilter = cleanName;
    activeCategorySettingTab = cleanName;

    await saveDb();
    renderSettings();
    renderLibraryTabs();
    renderPhrasesLibrary(
        document.getElementById('phrases-search-bar')?.value || ''
    );
};

deleteKnowledgeCategory = async function(categoryName) {
    if (db.settings.categories.length <= 1) {
        showFeatureToast('Keep at least one Knowledge Base category.');
        return;
    }

    const itemCount = Object.values(db.phrase_meta || {})
        .filter(meta => meta?.type === categoryName)
        .length;

    const fallback =
        db.settings.categories.find(category => category !== categoryName);

    const confirmed = await showAppConfirm({
        title: `Delete “${categoryName}” category?`,
        message: itemCount
            ? `${itemCount} item${itemCount === 1 ? '' : 's'} will be moved to “${fallback}”.`
            : '',
        confirmLabel: 'Delete Category'
    });

    if (!confirmed) return;

    db.settings.categories =
        db.settings.categories.filter(category => category !== categoryName);

    delete db.settings.categorySettings[categoryName];

    Object.values(db.phrase_meta || {}).forEach(meta => {
        if (meta?.type === categoryName) meta.type = fallback;
    });

    if (libraryFilter === categoryName) libraryFilter = 'all';
    activeCategorySettingTab = null;

    await saveDb();
    renderSettings();
    renderLibraryTabs();
    renderPhrasesLibrary(
        document.getElementById('phrases-search-bar')?.value || ''
    );
};

// Existing New Category UI is already site-styled. Prevent native duplicate alert.
const ensureKnowledgeCategoryCreateModalBeforeV56 =
    ensureKnowledgeCategoryCreateModal;

ensureKnowledgeCategoryCreateModal = function() {
    ensureKnowledgeCategoryCreateModalBeforeV56();

    const modal = document.getElementById('kb-category-create-modal');
    const save = modal?.querySelector('#kb-category-create-save');

    if (!save || save.dataset.styledDuplicateV56 === 'true') return;
    save.dataset.styledDuplicateV56 = 'true';

    save.addEventListener('click', event => {
        const name =
            modal.querySelector('#kb-category-create-name')?.value.trim() || '';
        if (!name) return;
        if (!db.settings.categories.includes(name)) return;

        event.preventDefault();
        event.stopImmediatePropagation();
        showFeatureToast('That category already exists.');
    }, true);
};


// ------------------------------------------------------------
// FLEXIBLE PLACEHOLDER SETTINGS
// \placeholder tokens can be used in Knowledge Base item titles.
// ------------------------------------------------------------

function normalizePlaceholderNameV56(value) {
    return String(value || '')
        .trim()
        .replace(/^\\+/, '')
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9_\-\u00C0-\u024F\u1100-\u11FF\u3130-\u318F\uAC00-\uD7AF]/gi, '');
}

function ensurePlaceholderSettingsV56() {
    if (!db.settings) db.settings = {};

    if (db.settings.knowledgePlaceholdersEnabledV56 === undefined) {
        db.settings.knowledgePlaceholdersEnabledV56 = true;
    }

    if (!Array.isArray(db.settings.knowledgePlaceholdersV56)) {
        db.settings.knowledgePlaceholdersV56 = [
            'verb',
            'noun',
            'adjective'
        ];
    }

    db.settings.knowledgePlaceholdersV56 =
        Array.from(new Set(
            db.settings.knowledgePlaceholdersV56
                .map(normalizePlaceholderNameV56)
                .filter(Boolean)
        ));

    return db.settings.knowledgePlaceholdersV56;
}

function placeholderTokenHtmlV56(title) {
    const source = String(title || '');
    const regex = /\\([a-z0-9_\-\u00C0-\u024F\u1100-\u11FF\u3130-\u318F\uAC00-\uD7AF]+)/gi;
    let result = '';
    let last = 0;
    let match;

    while ((match = regex.exec(source))) {
        result += escapeKnowledgeHtml(source.slice(last, match.index));
        result += `<strong class="kb-placeholder-token-v56">${escapeKnowledgeHtml(match[0])}</strong>`;
        last = match.index + match[0].length;
    }

    result += escapeKnowledgeHtml(source.slice(last));
    return result;
}

function ensureKnowledgePlaceholderSettingsUiV56() {
    const modal = document.getElementById('settings-modal');
    if (!modal) return null;

    const categories = document.getElementById('settings-category-tabs');
    const categorySection =
        categories?.closest('.modal-section') ||
        categories?.parentElement;

    let section = modal.querySelector('.kb-placeholder-settings-v56');

    if (!section) {
        section = document.createElement('section');
        section.className =
            'modal-section kb-placeholder-settings-v56';

        section.innerHTML = `
            <div class="kb-placeholder-settings-heading-v56 kb-placeholder-heading-row-v451">
                <div class="kb-daily-recommend-copy-v173 kb-placeholder-copy-v451">
                    <strong class="field-label">Placeholders</strong>
                    <small>
                        Type \\ in a Knowledge Base item title to insert one.
                    </small>
                </div>

                <label class="kb-switch-v173 kb-placeholder-toggle-v56 kb-placeholder-switch-v451" title="Enable placeholders">
                    <input type="checkbox" class="kb-placeholders-enabled-v56">
                    <span class="kb-switch-track-v173"></span>
                </label>
            </div>

            <div class="kb-placeholder-chips-v56"></div>

            <div class="kb-placeholder-add-v56">
                <input
                    type="text"
                    class="kb-placeholder-new-v56"
                    placeholder="e.g. conjugation-suffix"
                    autocomplete="off"
                >
                <button
                    type="button"
                    class="icon-btn kb-placeholder-add-button-v56"
                >
                    Add Placeholder
                </button>
            </div>
        `;

        if (categorySection) {
            categorySection.insertAdjacentElement('beforebegin', section);
        } else {
            modal.querySelector('.modal-box')?.appendChild(section);
        }

        section
            .querySelector('.kb-placeholder-add-button-v56')
            .addEventListener('click', () => {
                const input =
                    section.querySelector('.kb-placeholder-new-v56');

                const name =
                    normalizePlaceholderNameV56(input.value);

                if (!name) return;

                const placeholders =
                    ensurePlaceholderSettingsV56();

                if (!placeholders.includes(name)) {
                    placeholders.push(name);
                    saveDb();
                }

                input.value = '';
                renderKnowledgePlaceholderSettingsV56();
                input.focus();
            });

        section
            .querySelector('.kb-placeholder-new-v56')
            .addEventListener('keydown', event => {
                if (event.key !== 'Enter') return;
                event.preventDefault();
                section
                    .querySelector('.kb-placeholder-add-button-v56')
                    .click();
            });

        section
            .querySelector('.kb-placeholders-enabled-v56')
            .addEventListener('change', event => {
                db.settings.knowledgePlaceholdersEnabledV56 =
                    event.target.checked;
                saveDb();
                renderKnowledgePlaceholderSettingsV56();
            });
    }

    return section;
}

function renderKnowledgePlaceholderSettingsV56() {
    const section = ensureKnowledgePlaceholderSettingsUiV56();
    if (!section) return;

    const placeholders = ensurePlaceholderSettingsV56();

    const toggle =
        section.querySelector('.kb-placeholders-enabled-v56');

    toggle.checked =
        db.settings.knowledgePlaceholdersEnabledV56 === true;

    section.classList.toggle(
        'disabled-v56',
        db.settings.knowledgePlaceholdersEnabledV56 !== true
    );

    const host =
        section.querySelector('.kb-placeholder-chips-v56');

    host.innerHTML =
        placeholders.length
            ? placeholders.map(name => `
                <span class="kb-placeholder-chip-v56">
                    <strong>\\${escapeKnowledgeHtml(name)}</strong>
                    <button
                        type="button"
                        data-remove-placeholder-v56="${escapeKnowledgeAttr(name)}"
                        title="Remove placeholder"
                    >
                        <i class="ph ph-x"></i>
                    </button>
                </span>
            `).join('')
            : `
                <span class="kb-placeholder-empty-v56">
                    Add the placeholder names you want to reuse.
                </span>
            `;

    host.querySelectorAll('[data-remove-placeholder-v56]')
        .forEach(button => {
            button.addEventListener('click', () => {
                const name =
                    button.dataset.removePlaceholderV56;

                db.settings.knowledgePlaceholdersV56 =
                    ensurePlaceholderSettingsV56()
                        .filter(item => item !== name);

                saveDb();
                renderKnowledgePlaceholderSettingsV56();
            });
        });
}

const renderSettingsBeforePlaceholdersV56 =
    renderSettings;

renderSettings = function() {
    renderSettingsBeforePlaceholdersV56();
    renderKnowledgePlaceholderSettingsV56();
};


// ------------------------------------------------------------
// PLACEHOLDER AUTOCOMPLETE ON NEW/EDIT ITEM NAMES
// ------------------------------------------------------------

function removePlaceholderPopupV56() {
    document.getElementById('kb-placeholder-popup-v56')?.remove();
}

function placeholderQueryAtCaretV56(input) {
    const caret =
        Number.isFinite(input.selectionStart)
            ? input.selectionStart
            : input.value.length;

    const before = input.value.slice(0, caret);
    const match = before.match(/\\([^\s\\]*)$/);

    if (!match) return null;

    return {
        query: normalizePlaceholderNameV56(match[1]),
        start: caret - match[0].length,
        end: caret
    };
}

function insertPlaceholderIntoInputV56(input, name) {
    const found = placeholderQueryAtCaretV56(input);
    if (!found) return;

    const token = `\\${name}`;

    const next =
        input.value.slice(0, found.start) +
        token +
        ' ' +
        input.value.slice(found.end);

    input.value = next;

    const caret =
        found.start +
        token.length +
        1;

    input.setSelectionRange(caret, caret);
    input.dispatchEvent(new Event('input', { bubbles: true }));
    removePlaceholderPopupV56();
    input.focus();
}

function renderPlaceholderPopupV56(input) {
    removePlaceholderPopupV56();

    if (
        db.settings?.knowledgePlaceholdersEnabledV56 === false
    ) {
        return;
    }

    const found =
        placeholderQueryAtCaretV56(input);

    if (!found) return;

    const choices =
        ensurePlaceholderSettingsV56()
            .filter(name =>
                !found.query ||
                name.startsWith(found.query)
            );

    if (!choices.length) return;

    const popup = document.createElement('div');
    popup.id = 'kb-placeholder-popup-v56';
    popup.className = 'kb-placeholder-popup-v56';
    popup.dataset.selectedIndex = '0';

    popup.innerHTML =
        choices.map((name, index) => `
            <button
                type="button"
                class="${index === 0 ? 'selected' : ''}"
                data-placeholder-name-v56="${escapeKnowledgeAttr(name)}"
            >
                <strong>\\${escapeKnowledgeHtml(name)}</strong>
                <span>Placeholder</span>
            </button>
        `).join('');

    document.body.appendChild(popup);

    const rect = input.getBoundingClientRect();
    popup.style.left = `${Math.max(8, rect.left)}px`;
    popup.style.top = `${Math.min(
        window.innerHeight - popup.offsetHeight - 8,
        rect.bottom + 5
    )}px`;
    popup.style.width = `${Math.max(190, rect.width)}px`;

    popup.querySelectorAll('[data-placeholder-name-v56]')
        .forEach(button => {
            button.addEventListener('pointerdown', event => {
                event.preventDefault();
            });

            button.addEventListener('click', () => {
                insertPlaceholderIntoInputV56(
                    input,
                    button.dataset.placeholderNameV56
                );
            });
        });
}

function bindPlaceholderAutocompleteV56(input) {
    if (!input || input.dataset.placeholderAutocompleteV56 === 'true') return;

    input.dataset.placeholderAutocompleteV56 = 'true';

    input.addEventListener('input', () => {
        renderPlaceholderPopupV56(input);
    });

    input.addEventListener('keydown', event => {
        const popup =
            document.getElementById('kb-placeholder-popup-v56');

        if (!popup) return;

        const buttons =
            Array.from(
                popup.querySelectorAll(
                    '[data-placeholder-name-v56]'
                )
            );

        if (!buttons.length) return;

        let index =
            Number(popup.dataset.selectedIndex || 0);

        if (event.key === 'ArrowDown') {
            event.preventDefault();
            index = (index + 1) % buttons.length;
        } else if (event.key === 'ArrowUp') {
            event.preventDefault();
            index = (index - 1 + buttons.length) % buttons.length;
        } else if (event.key === 'Enter') {
            event.preventDefault();
            event.stopImmediatePropagation();
            buttons[index]?.click();
            return;
        } else if (event.key === 'Escape') {
            removePlaceholderPopupV56();
            return;
        } else {
            return;
        }

        popup.dataset.selectedIndex = String(index);
        buttons.forEach((button, i) =>
            button.classList.toggle('selected', i === index)
        );
        buttons[index]?.scrollIntoView({ block: 'nearest' });
    });

    input.addEventListener('blur', () => {
        setTimeout(removePlaceholderPopupV56, 120);
    });
}

const openKnowledgeAddItemModalBeforePlaceholdersV56 =
    openKnowledgeAddItemModal;

openKnowledgeAddItemModal = function() {
    openKnowledgeAddItemModalBeforePlaceholdersV56();

    bindPlaceholderAutocompleteV56(
        document.getElementById('add-item-name')
    );
};


// ------------------------------------------------------------
// EDIT ITEM NAME
// ------------------------------------------------------------

async function renameKnowledgeItemV56(oldName, nextName) {
    const clean = String(nextName || '').trim();

    if (!clean || clean === oldName) return oldName;

    if (db.phrases.includes(clean)) {
        showFeatureToast('A Knowledge Base item with that name already exists.');
        return oldName;
    }

    const index = db.phrases.indexOf(oldName);
    if (index < 0) return oldName;

    const meta = db.phrase_meta[oldName];
    db.phrases[index] = clean;
    db.phrase_meta[clean] = meta;
    delete db.phrase_meta[oldName];

    Object.values(db.days || {}).forEach(day => {
        if (Array.isArray(day?.phrases)) {
            day.phrases = day.phrases.map(value =>
                value === oldName ? clean : value
            );
        }
    });

    if (db.srs && Object.prototype.hasOwnProperty.call(db.srs, oldName)) {
        db.srs[clean] = db.srs[oldName];
        delete db.srs[oldName];
    }

    activeModalItem = clean;

    await saveDb();
    populatePhrasesDatalist();
    renderPhrasesLibrary(
        document.getElementById('phrases-search-bar')?.value || ''
    );

    return clean;
}

const renderKnowledgeEditFieldsBeforeRenameV56 =
    renderKnowledgeEditFields;

renderKnowledgeEditFields = function(itemId, categoryName) {
    renderKnowledgeEditFieldsBeforeRenameV56(itemId, categoryName);

    const container =
        document.getElementById('phrase-modal-dynamic-fields');

    if (!container || container.querySelector('.kb-edit-item-name-v56')) {
        return;
    }

    const section = document.createElement('div');
    section.className =
        'modal-section mt-10 kb-edit-item-name-v56';

    section.innerHTML = `
        <span class="field-label">Title</span>

        <div class="kb-edit-item-name-row-v56">
            <input
                type="text"
                class="kb-edit-item-name-input-v56"
                value="${escapeKnowledgeAttr(itemId)}"
                autocomplete="off"
            >

            <button
                type="button"
                class="small-icon-btn kb-edit-item-name-save-v56"
                title="Save item name"
            >
                <i class="ph ph-check"></i>
            </button>
        </div>
    `;

    container.prepend(section);

    const input =
        section.querySelector('.kb-edit-item-name-input-v56');

    bindPlaceholderAutocompleteV56(input);

    section
        .querySelector('.kb-edit-item-name-save-v56')
        .addEventListener('click', async () => {
            const renamed =
                await renameKnowledgeItemV56(
                    itemId,
                    input.value
                );

            if (renamed !== itemId) {
                openItemModal(renamed, true, true);
            }
        });

    input.addEventListener('keydown', event => {
        if (
            event.key === 'Enter' &&
            !document.getElementById('kb-placeholder-popup-v56')
        ) {
            event.preventDefault();
            section
                .querySelector('.kb-edit-item-name-save-v56')
                .click();
        }
    });
};


// ------------------------------------------------------------
// BOLD PLACEHOLDERS IN KNOWLEDGE BASE TITLES
// ------------------------------------------------------------

const renderPhrasesLibraryBeforeTitlePlaceholdersV56 =
    renderPhrasesLibrary;

renderPhrasesLibrary = function(filterText = '') {
    renderPhrasesLibraryBeforeTitlePlaceholdersV56(filterText);

    document
        .querySelectorAll(
            '#phrases-library-grid .kb-library-item-title, ' +
            '#phrases-library-grid .chip-text'
        )
        .forEach(title => {
            const raw = title.textContent || '';
            if (!raw.includes('\\')) return;
            title.innerHTML = placeholderTokenHtmlV56(raw);
        });
};

const openItemModalBeforeTitlePlaceholdersV56 =
    openItemModal;

openItemModal = function(
    itemId,
    isCumulativeView = false,
    editInfo = false
) {
    openItemModalBeforeTitlePlaceholdersV56(
        itemId,
        isCumulativeView,
        editInfo
    );

    const main =
        document.querySelector(
            '#phrase-modal-title .phrase-modal-title-main-row > span'
        );

    if (main) {
        main.innerHTML =
            placeholderTokenHtmlV56(itemId);
    }

    if (editInfo) {
        bindPlaceholderAutocompleteV56(
            document.querySelector(
                '.kb-edit-item-name-input-v56'
            )
        );
    }
};


// ------------------------------------------------------------
// UNDIRECTED CONNECTION GRAPH ONLY
// ------------------------------------------------------------

function getUndirectedDailyEdgesV56() {
    const raw =
        getDailyConnectionMapDataV55();

    const map = new Map();

    raw.edges.forEach(edge => {
        const a = Math.min(edge.source, edge.target);
        const b = Math.max(edge.source, edge.target);
        const key = `${a}-${b}`;

        if (!map.has(key)) {
            map.set(key, {
                a,
                b,
                labels: []
            });
        }

        const entry = map.get(key);

        (edge.labels || []).forEach(label => {
            if (label && !entry.labels.includes(label)) {
                entry.labels.push(label);
            }
        });
    });

    const edges =
        Array.from(map.values())
            .sort((x, y) => x.a - y.a || x.b - y.b);

    const nodes =
        Array.from(new Set(
            edges.flatMap(edge => [edge.a, edge.b])
        )).sort((a, b) => a - b);

    return { nodes, edges };
}

function undirectedGraphPositionsV56(nodes) {
    const count = nodes.length;
    const positions = new Map();

    if (!count) return positions;

    if (count === 1) {
        positions.set(nodes[0], { x: 50, y: 50 });
        return positions;
    }

    const radius =
        Math.min(39, 27 + Math.min(12, count) * .9);

    nodes.forEach((day, index) => {
        const angle =
            -Math.PI / 2 +
            (Math.PI * 2 * index / count);

        positions.set(day, {
            x: 50 + Math.cos(angle) * radius,
            y: 50 + Math.sin(angle) * radius
        });
    });

    return positions;
}

renderDailyConnectionsMapV55 = function(tab, component, content) {
    const { nodes, edges } =
        getUndirectedDailyEdgesV56();

    if (!edges.length) {
        content.innerHTML = `
            <div class="custom-collection-header">
                <div>
                    <h2>${escapeCustomHtml(
                        component.title ||
                        'Daily Log Connections Map'
                    )}</h2>
                    <small>
                        Undirected graph built automatically from @Day links.
                    </small>
                </div>
            </div>

            <div class="feature-empty-state daily-connections-map-empty-v56">
                <i class="ph ph-share-network"></i>
                <strong>No @Day connections yet</strong>
                <span>
                    Link another Daily Log with @Day in your notes and it will appear here.
                </span>
            </div>
        `;
        return;
    }

    const positions =
        undirectedGraphPositionsV56(nodes);

    content.innerHTML = `
        <div class="custom-collection-header daily-connections-map-header-v56">
            <div>
                <h2>${escapeCustomHtml(
                    component.title ||
                    'Daily Log Connections Map'
                )}</h2>
                <small>
                    Undirected graph · ${nodes.length} days · ${edges.length} connections
                </small>
            </div>
        </div>

        <div class="daily-undirected-graph-v56">
            <svg
                class="daily-undirected-graph-lines-v56"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                aria-hidden="true"
            >
                ${edges.map(edge => {
                    const a = positions.get(edge.a);
                    const b = positions.get(edge.b);
                    return `
                        <line
                            x1="${a.x}"
                            y1="${a.y}"
                            x2="${b.x}"
                            y2="${b.y}"
                        ></line>

                        ${
                            edge.labels.length
                                ? `
                                    <text
                                        x="${(a.x + b.x) / 2}"
                                        y="${(a.y + b.y) / 2}"
                                        text-anchor="middle"
                                    >
                                        ${escapeCustomHtml(
                                            edge.labels.join(' · ')
                                        )}
                                    </text>
                                `
                                : ''
                        }
                    `;
                }).join('')}
            </svg>

            ${nodes.map(day => {
                const point = positions.get(day);
                return `
                    <button
                        type="button"
                        class="daily-undirected-node-v56"
                        data-open-day-v56="${day}"
                        style="left:${point.x}%;top:${point.y}%;"
                    >
                        <span>Day</span>
                        <strong>${day}</strong>
                    </button>
                `;
            }).join('')}
        </div>
    `;

    content
        .querySelectorAll('[data-open-day-v56]')
        .forEach(button => {
            button.addEventListener('click', () =>
                openDayLog(
                    Number(button.dataset.openDayV56)
                )
            );
        });
};


// ------------------------------------------------------------
// FLEXIBLE PLACEHOLDER-DRIVEN SENTENCE BUILDER
// Uses placeholders for slots. Tags/dropdown values remain searchable metadata.
// ------------------------------------------------------------

function placeholderSegmentsV56(title) {
    const source = String(title || '');
    const regex =
        /\\([a-z0-9_\-\u00C0-\u024F\u1100-\u11FF\u3130-\u318F\uAC00-\uD7AF]+)/gi;

    const segments = [];
    let last = 0;
    let match;
    let slotIndex = 0;

    while ((match = regex.exec(source))) {
        if (match.index > last) {
            segments.push({
                type: 'text',
                text: source.slice(last, match.index)
            });
        }

        segments.push({
            type: 'slot',
            name: normalizePlaceholderNameV56(match[1]),
            raw: match[0],
            slotIndex: slotIndex++
        });

        last = match.index + match[0].length;
    }

    if (last < source.length) {
        segments.push({
            type: 'text',
            text: source.slice(last)
        });
    }

    return segments;
}

function knowledgePatternItemsV56() {
    return (db.phrases || [])
        .filter(itemId =>
            placeholderSegmentsV56(itemId)
                .some(segment => segment.type === 'slot')
        )
        .sort((a, b) => a.localeCompare(b));
}

function sentenceBuilderSearchItemsV56(query, patternId) {
    const parsed =
        parseKnowledgeSearchV55(query);

    const text =
        parsed.text.toLowerCase();

    return (db.phrases || [])
        .filter(itemId => itemId !== patternId)
        .filter(itemId => {
            const tags =
                getKnowledgeItemTagsV55(itemId);

            if (
                !parsed.tags.every(tag =>
                    tags.includes(tag)
                )
            ) {
                return false;
            }

            if (!text) return true;

            const meta =
                db.phrase_meta?.[itemId] || {};

            const haystack =
                `${itemId} ${meta.type || ''} ${Object.values(
                    meta.custom_fields || {}
                ).join(' ')} ${tags.join(' ')}`
                    .toLowerCase();

            return haystack.includes(text);
        })
        .slice(0, 80);
}

function sentenceBuilderPlainTextV56(patternId, values) {
    const segments =
        placeholderSegmentsV56(patternId);

    return segments.map(segment => {
        if (segment.type === 'text') return segment.text;
        return values?.[segment.slotIndex]?.itemId || segment.raw;
    }).join('')
        .replace(/\s+([,.!?;:])/g, '$1')
        .replace(/\s{2,}/g, ' ')
        .trim();
}

function sentenceBuilderSavedHtmlV56(patternId, values) {
    const segments =
        placeholderSegmentsV56(patternId);

    return segments.map(segment => {
        if (segment.type === 'text') {
            return escapeKnowledgeHtml(segment.text);
        }

        const item =
            values?.[segment.slotIndex]?.itemId;

        if (!item) {
            return `<span class="sentence-builder-unfilled-v56">${escapeKnowledgeHtml(segment.raw)}</span>`;
        }

        return `<strong class="sentence-builder-replacement-v56">${escapeKnowledgeHtml(item)}</strong>`;
    }).join('');
}

function ensureSentenceGroupsV56(component) {
    if (!Array.isArray(component.sentenceGroupsV56)) {
        component.sentenceGroupsV56 = [];
    }

    if (
        Array.isArray(component.savedSentences) &&
        component.savedSentences.length
    ) {
        let legacy =
            component.sentenceGroupsV56.find(
                group => group.id === 'legacy'
            );

        if (!legacy) {
            legacy = {
                id: 'legacy',
                label: 'Saved Sentences',
                items: []
            };
            component.sentenceGroupsV56.push(legacy);
        }

        component.savedSentences.forEach(item => {
            if (
                !legacy.items.some(existing =>
                    existing.id === item.id
                )
            ) {
                legacy.items.push({
                    ...item,
                    html:
                        escapeKnowledgeHtml(item.text || '')
                });
            }
        });

        component.savedSentences = [];
    }

    if (!component.sentenceGroupsV56.length) {
        component.sentenceGroupsV56.push({
            id: customId('sentence-group'),
            label: 'Saved Sentences',
            items: []
        });
    }

    if (
        !component.activeSentenceGroupV56 ||
        !component.sentenceGroupsV56.some(
            group =>
                group.id ===
                component.activeSentenceGroupV56
        )
    ) {
        component.activeSentenceGroupV56 =
            component.sentenceGroupsV56[0].id;
    }

    return component.sentenceGroupsV56;
}

async function addSentenceGroupV56(tab, component) {
    const result = await showAppPrompt({
        title: 'New Sentence Group',
        label: 'Group Label',
        value: '',
        submitLabel: 'Create'
    });

    if (result === null) return;

    const label =
        String(result).trim();

    if (!label) return;

    const group = {
        id: customId('sentence-group'),
        label,
        items: []
    };

    ensureSentenceGroupsV56(component).push(group);
    component.activeSentenceGroupV56 = group.id;

    saveDb();
    renderCustomTabView(tab.id);
}

async function renameSentenceGroupV56(tab, component, groupId) {
    const group =
        ensureSentenceGroupsV56(component)
            .find(item => item.id === groupId);

    if (!group) return;

    const result = await showAppPrompt({
        title: 'Rename Sentence Group',
        label: 'Group Label',
        value: group.label || '',
        submitLabel: 'Save'
    });

    if (result === null) return;

    const label = String(result).trim();
    if (!label) return;

    group.label = label;
    saveDb();
    renderCustomTabView(tab.id);
}

renderKnowledgeSentenceBuilderV53 = function(tab, component, content) {
    const patterns =
        knowledgePatternItemsV56();

    const groups =
        ensureSentenceGroupsV56(component);

    if (!component.placeholderValuesV56 ||
        typeof component.placeholderValuesV56 !== 'object') {
        component.placeholderValuesV56 = {};
    }

    if (
        !component.patternIdV56 ||
        !patterns.includes(component.patternIdV56)
    ) {
        component.patternIdV56 =
            patterns[0] || '';
        component.placeholderValuesV56 = {};
    }

    const patternId =
        component.patternIdV56;

    const segments =
        patternId
            ? placeholderSegmentsV56(patternId)
            : [];

    content.innerHTML = `
        <div class="custom-collection-header sentence-builder-header-v56">
            <div>
                <h2>${escapeCustomHtml(
                    component.title ||
                    'Sentence Builder'
                )}</h2>
                <small>
                    Placeholders create drop zones. Tags and dropdown values help you search/filter Knowledge Base items.
                </small>
            </div>
        </div>

        ${
            patterns.length
                ? `
                    <div class="sentence-builder-pattern-row-v56">
                        <label>
                            <span>Pattern</span>
                            <select class="sentence-builder-pattern-select-v56">
                                ${patterns.map(id => `
                                    <option
                                        value="${escapeKnowledgeAttr(id)}"
                                        ${id === patternId ? 'selected' : ''}
                                    >
                                        ${escapeKnowledgeHtml(id)}
                                    </option>
                                `).join('')}
                            </select>
                        </label>
                    </div>

                    <div class="sentence-builder-canvas-v56">
                        ${segments.map(segment => {
                            if (segment.type === 'text') {
                                return `
                                    <span class="sentence-builder-literal-v56">
                                        ${escapeKnowledgeHtml(segment.text)}
                                    </span>
                                `;
                            }

                            const value =
                                component.placeholderValuesV56[
                                    segment.slotIndex
                                ];

                            return `
                                <div
                                    class="sentence-builder-slot-v56 ${value ? 'filled' : ''}"
                                    data-sentence-slot-v56="${segment.slotIndex}"
                                    data-placeholder-v56="${escapeKnowledgeAttr(segment.name)}"
                                >
                                    <span class="sentence-builder-slot-label-v56">
                                        \\${escapeKnowledgeHtml(segment.name)}
                                    </span>

                                    <div class="sentence-builder-slot-value-v56">
                                        ${
                                            value
                                                ? `<strong>${escapeKnowledgeHtml(value.itemId)}</strong>`
                                                : '<span>Drop a Knowledge Base item here</span>'
                                        }
                                    </div>

                                    ${
                                        value
                                            ? `
                                                <button
                                                    type="button"
                                                    class="sentence-builder-slot-clear-v56"
                                                    title="Clear placeholder"
                                                >
                                                    <i class="ph ph-x"></i>
                                                </button>
                                            `
                                            : ''
                                    }
                                </div>
                            `;
                        }).join('')}
                    </div>

                    <div class="sentence-builder-search-v56">
                        <i class="ph ph-magnifying-glass"></i>
                        <input
                            type="text"
                            class="sentence-builder-search-input-v56"
                            placeholder="Search Knowledge Base or use #tag…"
                        >
                    </div>

                    <div class="sentence-builder-kb-results-v56"></div>

                    <div class="sentence-builder-output-v56">
                        <div>
                            <span>Sentence</span>
                            <div class="sentence-builder-output-text-v56">
                                ${sentenceBuilderSavedHtmlV56(
                                    patternId,
                                    component.placeholderValuesV56
                                )}
                            </div>
                        </div>

                        <div class="sentence-builder-save-controls-v56">
                            <select class="sentence-builder-group-select-v56">
                                ${groups.map(group => `
                                    <option
                                        value="${escapeKnowledgeAttr(group.id)}"
                                        ${
                                            group.id ===
                                            component.activeSentenceGroupV56
                                                ? 'selected'
                                                : ''
                                        }
                                    >
                                        ${escapeKnowledgeHtml(group.label)}
                                    </option>
                                `).join('')}
                            </select>

                            <button
                                type="button"
                                class="small-icon-btn sentence-builder-new-group-v56"
                                title="New group"
                            >
                                <i class="ph ph-plus"></i>
                            </button>

                            <button
                                type="button"
                                class="icon-btn sentence-builder-save-sentence-v56"
                            >
                                Save Sentence
                            </button>
                        </div>
                    </div>
                `
                : `
                    <div class="feature-empty-state sentence-pattern-empty-v56">
                        <i class="ph ph-brackets-curly"></i>
                        <strong>No placeholder patterns yet</strong>
                        <span>
                            Create a Knowledge Base item and use \\ in its title to insert one of your configured placeholders.
                        </span>
                    </div>
                `
        }

        <div class="sentence-builder-groups-v56">
            ${groups.map(group => `
                <details class="sentence-builder-group-v56">
                    <summary>
                        <span>
                            ${escapeKnowledgeHtml(group.label)}
                            <small>${(group.items || []).length}</small>
                        </span>

                        <button
                            type="button"
                            class="small-icon-btn sentence-builder-rename-group-v56"
                            data-group-id-v56="${escapeKnowledgeAttr(group.id)}"
                            title="Rename group"
                        >
                            <i class="ph ph-pencil-simple"></i>
                        </button>
                    </summary>

                    <div class="sentence-builder-group-items-v56">
                        ${
                            (group.items || []).length
                                ? group.items.map(item => `
                                    <article
                                        class="sentence-builder-saved-item-v56"
                                        data-saved-sentence-id-v56="${escapeKnowledgeAttr(item.id)}"
                                        data-group-id-v56="${escapeKnowledgeAttr(group.id)}"
                                    >
                                        <div class="sentence-builder-saved-copy-v56">
                                            ${
                                                item.html ||
                                                escapeKnowledgeHtml(item.text || '')
                                            }
                                        </div>

                                        <button
                                            type="button"
                                            class="small-icon-btn sentence-builder-saved-audio-v56"
                                            title="Play sentence"
                                            data-sentence-audio-v56="${escapeKnowledgeAttr(item.text || '')}"
                                        >
                                            <i class="ph ph-speaker-high"></i>
                                        </button>

                                        <button
                                            type="button"
                                            class="small-icon-btn sentence-builder-saved-delete-v56"
                                            title="Delete saved sentence"
                                        >
                                            <i class="ph ph-x"></i>
                                        </button>
                                    </article>
                                `).join('')
                                : `
                                    <div class="sentence-builder-empty-saved-v53">
                                        No sentences in this group yet.
                                    </div>
                                `
                        }
                    </div>
                </details>
            `).join('')}
        </div>
    `;

    const rerender = () => {
        saveDb();
        renderCustomTabView(tab.id);
    };

    content
        .querySelector('.sentence-builder-pattern-select-v56')
        ?.addEventListener('change', event => {
            component.patternIdV56 = event.target.value;
            component.placeholderValuesV56 = {};
            rerender();
        });

    const search =
        content.querySelector('.sentence-builder-search-input-v56');

    const results =
        content.querySelector('.sentence-builder-kb-results-v56');

    const renderResults = () => {
        if (!results) return;

        const items =
            sentenceBuilderSearchItemsV56(
                search?.value || '',
                patternId
            );

        results.innerHTML =
            items.length
                ? items.map(itemId => {
                    const tags =
                        getKnowledgeItemTagsV55(itemId)
                            .filter(tag =>
                                tag !== normalizeKnowledgeTagV55(
                                    db.phrase_meta?.[itemId]?.type
                                )
                            )
                            .slice(0, 4);

                    return `
                        <button
                            type="button"
                            class="sentence-builder-kb-result-v56"
                            draggable="true"
                            data-kb-drag-item-v56="${escapeKnowledgeAttr(itemId)}"
                        >
                            <span>${placeholderTokenHtmlV56(itemId)}</span>

                            <small>
                                ${tags.map(tag =>
                                    `#${escapeKnowledgeHtml(tag)}`
                                ).join(' ')}
                            </small>

                            <i class="ph ph-dots-six-vertical"></i>
                        </button>
                    `;
                }).join('')
                : `
                    <div class="sentence-pattern-no-results-v55">
                        No Knowledge Base items match.
                    </div>
                `;

        results
            .querySelectorAll('[data-kb-drag-item-v56]')
            .forEach(button => {
                button.addEventListener('dragstart', event => {
                    event.dataTransfer.effectAllowed = 'copy';
                    event.dataTransfer.setData(
                        'text/kb-item-v56',
                        button.dataset.kbDragItemV56
                    );
                    button.classList.add('dragging');
                });

                button.addEventListener('dragend', () => {
                    button.classList.remove('dragging');
                });
            });
    };

    search?.addEventListener('input', renderResults);
    renderResults();

    content
        .querySelectorAll('[data-sentence-slot-v56]')
        .forEach(slot => {
            const index =
                Number(slot.dataset.sentenceSlotV56);

            slot.addEventListener('dragover', event => {
                if (
                    !event.dataTransfer.types.includes(
                        'text/kb-item-v56'
                    )
                ) return;

                event.preventDefault();
                slot.classList.add('drop-ready');
            });

            slot.addEventListener('dragleave', () => {
                slot.classList.remove('drop-ready');
            });

            slot.addEventListener('drop', event => {
                const itemId =
                    event.dataTransfer.getData(
                        'text/kb-item-v56'
                    );

                if (!itemId) return;

                event.preventDefault();
                slot.classList.remove('drop-ready');

                component.placeholderValuesV56[index] = {
                    itemId
                };

                rerender();
            });

            slot
                .querySelector('.sentence-builder-slot-clear-v56')
                ?.addEventListener('click', () => {
                    delete component.placeholderValuesV56[index];
                    rerender();
                });
        });

    content
        .querySelector('.sentence-builder-group-select-v56')
        ?.addEventListener('change', event => {
            component.activeSentenceGroupV56 =
                event.target.value;
            saveDb();
        });

    content
        .querySelector('.sentence-builder-new-group-v56')
        ?.addEventListener('click', () =>
            addSentenceGroupV56(tab, component)
        );

    content
        .querySelector('.sentence-builder-save-sentence-v56')
        ?.addEventListener('click', () => {
            const slots =
                segments.filter(segment => segment.type === 'slot');

            const complete =
                slots.every(segment =>
                    component.placeholderValuesV56[
                        segment.slotIndex
                    ]?.itemId
                );

            if (!complete) {
                showFeatureToast('Fill every placeholder first.');
                return;
            }

            const group =
                ensureSentenceGroupsV56(component)
                    .find(item =>
                        item.id ===
                        component.activeSentenceGroupV56
                    ) ||
                ensureSentenceGroupsV56(component)[0];

            const text =
                sentenceBuilderPlainTextV56(
                    patternId,
                    component.placeholderValuesV56
                );

            group.items.unshift({
                id: customId('sentence'),
                text,
                html:
                    sentenceBuilderSavedHtmlV56(
                        patternId,
                        component.placeholderValuesV56
                    ),
                patternId,
                createdAt:
                    new Date().toISOString()
            });

            rerender();
        });

    content
        .querySelectorAll('.sentence-builder-rename-group-v56')
        .forEach(button => {
            button.addEventListener('click', event => {
                event.preventDefault();
                event.stopPropagation();
                renameSentenceGroupV56(
                    tab,
                    component,
                    button.dataset.groupIdV56
                );
            });
        });

    content
        .querySelectorAll('.sentence-builder-saved-audio-v56')
        .forEach(button => {
            button.addEventListener('click', () => {
                playTTSAudio(
                    button.dataset.sentenceAudioV56 || '',
                    db.settings.ttsLang || 'ko'
                );
            });
        });

    content
        .querySelectorAll('.sentence-builder-saved-delete-v56')
        .forEach(button => {
            button.addEventListener('click', () => {
                const row =
                    button.closest(
                        '[data-saved-sentence-id-v56]'
                    );

                const group =
                    ensureSentenceGroupsV56(component)
                        .find(item =>
                            item.id ===
                            row.dataset.groupIdV56
                        );

                if (!group) return;

                group.items =
                    (group.items || [])
                        .filter(item =>
                            item.id !==
                            row.dataset.savedSentenceIdV56
                        );

                rerender();
            });
        });
};


// ------------------------------------------------------------
// THEME BUILDER: 60+ GRADIENTS + SANDBOXED INTERACTIVE HTML BACKGROUND
// ------------------------------------------------------------

function cssEscapeUrlTextV56(value) {
    return String(value || '')
        .replace(/\\/g, '\\\\')
        .replace(/"/g, '\\"');
}

function ensureBackgroundDocumentV56(code) {
    const raw = String(code || '').trim();

    if (!raw) return '';

    if (/<html[\s>]/i.test(raw)) {
        return raw.replace(
            /<head([^>]*)>/i,
            `<head$1>
                <meta
                    http-equiv="Content-Security-Policy"
                    content="default-src 'none'; style-src 'unsafe-inline'; script-src 'unsafe-inline'; img-src data: blob:; font-src data:;"
                >`
        );
    }

    return `
        <!doctype html>
        <html>
            <head>
                <meta charset="utf-8">
                <meta
                    http-equiv="Content-Security-Policy"
                    content="default-src 'none'; style-src 'unsafe-inline'; script-src 'unsafe-inline'; img-src data: blob:; font-src data:;"
                >
                <style>
                    html,body{margin:0;width:100%;height:100%;overflow:hidden;background:transparent;}
                </style>
            </head>
            <body>${raw}</body>
        </html>
    `;
}

function removeThemeCreativeBackgroundV56() {
    document
        .getElementById('custom-theme-code-background-v56')
        ?.remove();

    document.body.classList.remove(
        'custom-code-background-active-v56'
    );

    document.body.style.removeProperty(
        '--custom-theme-gradient-v56'
    );

    document.body.style.removeProperty(
        'background-image'
    );
}

function mountThemeCreativeBackgroundV56(theme = {}) {
    document
        .getElementById('custom-theme-code-background-v56')
        ?.remove();

    document.body.classList.remove(
        'custom-code-background-active-v56'
    );

    const gradient =
        String(theme.backgroundGradientV56 || '').trim();

    const code =
        String(theme.interactiveBackgroundCodeV56 || '').trim();

    if (
        gradient &&
        !theme.backgroundImage
    ) {
        document.body.style.setProperty(
            'background-image',
            gradient,
            'important'
        );

        document.body.style.setProperty(
            'background-size',
            'cover',
            'important'
        );

        document.body.style.setProperty(
            'background-attachment',
            'fixed',
            'important'
        );
    }

    if (!code) return;

    const frame = document.createElement('iframe');
    frame.id = 'custom-theme-code-background-v56';
    frame.className = 'custom-theme-code-background-v56';
    frame.setAttribute('sandbox', 'allow-scripts');
    frame.setAttribute('aria-hidden', 'true');
    frame.srcdoc = ensureBackgroundDocumentV56(code);

    document.body.prepend(frame);
    document.body.classList.add(
        'custom-code-background-active-v56'
    );
}

function resolveThemeCreativeDataV56(themeId) {
    try {
        const copy =
            getThemeCopyV30?.(themeId);

        if (copy?.theme) return copy.theme;
    } catch {}

    if (themeId === 'theme-custom-builder') {
        try {
            return getCustomThemeSettings();
        } catch {}
    }

    try {
        const overrides =
            ensureThemeOverridesV25?.();

        if (overrides?.[themeId]) {
            return overrides[themeId];
        }
    } catch {}

    return null;
}

const applyCustomBuiltThemeBeforeCreativeV56 =
    applyCustomBuiltTheme;

applyCustomBuiltTheme = function(theme = getCustomThemeSettings()) {
    applyCustomBuiltThemeBeforeCreativeV56(theme);
    mountThemeCreativeBackgroundV56(theme || {});
};

const applyThemeBeforeCreativeV56 =
    applyTheme;

applyTheme = async function(themeValue, opts = {}) {
    removeThemeCreativeBackgroundV56();

    const result =
        await applyThemeBeforeCreativeV56(
            themeValue,
            opts
        );

    const theme =
        resolveThemeCreativeDataV56(themeValue);

    if (theme) {
        mountThemeCreativeBackgroundV56(theme);
    }

    return result;
};

function themeBuilderBackgroundPromptV56(modal) {
    const draft =
        getThemeBuilderDraft(modal);

    return `Create one self-contained HTML document for an interactive full-screen background for a theme called "${draft.name || 'Custom Theme'}".

Theme palette:
- base/background: ${draft.background || '#ffffff'}
- card/surface: ${draft.surface || '#ffffff'}
- text: ${draft.text || '#111111'}
- muted text: ${draft.muted || '#666666'}
- accent: ${draft.accent || '#888888'}
- border: ${draft.border || '#111111'}

Requirements:
- Output ONLY the HTML code. No markdown fences and no explanation.
- It will run inside a sandboxed full-screen iframe behind the app.
- Use only inline HTML, CSS, SVG/canvas, and JavaScript.
- No external URLs, libraries, fonts, images, audio, fetches, imports, or network requests.
- Fill the full viewport and resize responsively.
- Make the background decorative and interactive with pointer movement/clicks, but keep motion gentle enough that text placed above it stays readable.
- Do not add buttons, menus, labels, paragraphs, or other app-like UI.
- Avoid large text and avoid placing important visuals only in the center, because app cards may cover that area.
- Prefer lightweight animation using requestAnimationFrame/CSS and clean up excessive particles.
- Match the theme name and palette rather than generating a generic background.`;
}

async function copyThemeBackgroundPromptV56(modal) {
    const text =
        themeBuilderBackgroundPromptV56(modal);

    try {
        await navigator.clipboard.writeText(text);
        showFeatureToast('Background prompt copied.');
    } catch {
        const area = document.createElement('textarea');
        area.value = text;
        area.style.position = 'fixed';
        area.style.opacity = '0';
        document.body.appendChild(area);
        area.select();
        document.execCommand('copy');
        area.remove();
        showFeatureToast('Background prompt copied.');
    }
}

function ensureThemeCreativeBackgroundControlsV56(modal) {
    if (!modal) return null;

    let section =
        modal.querySelector(
            '.theme-builder-creative-background-v56'
        );

    if (!section) {
        section = document.createElement('section');
        section.className =
            'theme-builder-control-section theme-builder-creative-background-v56';
        section.dataset.themeBuilderPanelGroup = 'background';

        section.innerHTML = `
            <div class="theme-builder-control-heading">
                <strong>Background Options</strong>
                <small>
                    Choose a background preset, upload an image, or paste an interactive HTML background.
                </small>
            </div>

            <div class="theme-gradient-toolbar-v56">
                <button
                    type="button"
                    class="theme-builder-file-button theme-gradient-clear-v56"
                >
                    Solid Color
                </button>

                <span class="theme-gradient-selected-v56"></span>
            </div>

            <div class="theme-gradient-grid-v56">
                ${THEME_GRADIENT_PRESETS_V56.map((preset, index) => `
                    <button
                        type="button"
                        class="theme-gradient-swatch-v56"
                        data-gradient-index-v56="${index}"
                        title="${escapeCustomHtml(preset.name)}"
                        style="background:${preset.css};"
                    >
                        <span>${escapeCustomHtml(preset.name)}</span>
                    </button>
                `).join('')}
            </div>

            <div class="theme-builder-code-background-v56">
                <div class="theme-builder-media-heading">
                    <div>
                        <strong>Interactive Background Code</strong>
                        <small>
                            Paste a self-contained HTML background. It runs in a sandbox.
                        </small>
                    </div>
                </div>

                <textarea
                    class="theme-background-code-input-v56"
                    rows="8"
                    spellcheck="false"
                    placeholder="Paste the generated HTML here…"
                ></textarea>

                <div class="theme-background-code-actions-v56">
                    <button
                        type="button"
                        class="theme-builder-file-button theme-copy-background-prompt-v56"
                    >
                        <i class="ph ph-copy"></i>
                        Copy Prompt
                    </button>

                    <button
                        type="button"
                        class="theme-builder-file-button theme-preview-background-code-v56"
                    >
                        <i class="ph ph-play"></i>
                        Preview Code
                    </button>

                    <button
                        type="button"
                        class="small-icon-btn theme-clear-background-code-v56"
                        title="Clear code"
                    >
                        <i class="ph ph-x"></i>
                    </button>
                </div>
            </div>
        `;

        const anchor =
            modal.querySelector(
                '.theme-builder-background-controls'
            ) ||
            modal.querySelector(
                '.theme-builder-media-section'
            );

        if (anchor) {
            anchor.insertAdjacentElement(
                'afterend',
                section
            );
        } else {
            modal
                .querySelector('.theme-builder-controls')
                ?.appendChild(section);
        }

        section
            .querySelectorAll('[data-gradient-index-v56]')
            .forEach(button => {
                button.addEventListener('click', () => {
                    const preset =
                        THEME_GRADIENT_PRESETS_V56[
                            Number(button.dataset.gradientIndexV56)
                        ];

                    modal._themeGradientV56 =
                        preset?.css || '';

                    modal._themeGradientNameV56 =
                        preset?.name || '';

                    updateThemeBuilderPreview(modal);
                    syncThemeCreativeBackgroundUiV56(modal);
                });
            });

        section
            .querySelector('.theme-gradient-clear-v56')
            .addEventListener('click', () => {
                modal._themeGradientV56 = '';
                modal._themeGradientNameV56 = '';
                updateThemeBuilderPreview(modal);
                syncThemeCreativeBackgroundUiV56(modal);
            });

        section
            .querySelector('.theme-copy-background-prompt-v56')
            .addEventListener('click', () =>
                copyThemeBackgroundPromptV56(modal)
            );

        section
            .querySelector('.theme-preview-background-code-v56')
            .addEventListener('click', () => {
                modal._themeInteractiveCodeV56 =
                    section.querySelector(
                        '.theme-background-code-input-v56'
                    ).value;

                updateThemeBuilderPreview(modal);
                showFeatureToast(
                    modal._themeInteractiveCodeV56.trim()
                        ? 'Interactive background preview updated.'
                        : 'Interactive background cleared.'
                );
            });

        section
            .querySelector('.theme-clear-background-code-v56')
            .addEventListener('click', () => {
                modal._themeInteractiveCodeV56 = '';
                section.querySelector(
                    '.theme-background-code-input-v56'
                ).value = '';
                updateThemeBuilderPreview(modal);
            });

        installThemeBuilderSectionTabsV11?.(modal);
    }

    syncThemeCreativeBackgroundUiV56(modal);

    return section;
}

function syncThemeCreativeBackgroundUiV56(modal) {
    const section =
        modal?.querySelector(
            '.theme-builder-creative-background-v56'
        );

    if (!section) return;

    const selected =
        String(modal._themeGradientV56 || '');

    section
        .querySelectorAll('[data-gradient-index-v56]')
        .forEach(button => {
            const preset =
                THEME_GRADIENT_PRESETS_V56[
                    Number(button.dataset.gradientIndexV56)
                ];

            button.classList.toggle(
                'selected',
                preset?.css === selected
            );
        });

    const label =
        section.querySelector(
            '.theme-gradient-selected-v56'
        );

    label.textContent =
        modal._themeGradientNameV56 ||
        (
            selected
                ? 'Custom gradient'
                : 'Solid color'
        );

    const code =
        section.querySelector(
            '.theme-background-code-input-v56'
        );

    if (
        code &&
        document.activeElement !== code &&
        code.value !==
            String(modal._themeInteractiveCodeV56 || '')
    ) {
        code.value =
            modal._themeInteractiveCodeV56 ||
            '';
    }
}

const getThemeBuilderDraftBeforeCreativeV56 =
    getThemeBuilderDraft;

getThemeBuilderDraft = function(modal) {
    const draft =
        getThemeBuilderDraftBeforeCreativeV56(modal);

    const codeInput =
        modal?.querySelector(
            '.theme-background-code-input-v56'
        );

    draft.backgroundGradientV56 =
        String(modal?._themeGradientV56 || '');

    draft.backgroundGradientNameV56 =
        String(modal?._themeGradientNameV56 || '');

    draft.interactiveBackgroundCodeV56 =
        String(
            codeInput?.value ??
            modal?._themeInteractiveCodeV56 ??
            ''
        );

    return draft;
};

const populateThemeBuilderBeforeCreativeV56 =
    populateThemeBuilder;

populateThemeBuilder = function(modal, theme) {
    populateThemeBuilderBeforeCreativeV56(modal, theme);

    modal._themeGradientV56 =
        theme?.backgroundGradientV56 || '';

    modal._themeGradientNameV56 =
        theme?.backgroundGradientNameV56 || '';

    modal._themeInteractiveCodeV56 =
        theme?.interactiveBackgroundCodeV56 || '';

    ensureThemeCreativeBackgroundControlsV56(modal);

    const code =
        modal.querySelector(
            '.theme-background-code-input-v56'
        );

    if (code) {
        code.value =
            modal._themeInteractiveCodeV56;
    }

    syncThemeCreativeBackgroundUiV56(modal);
};

function renderThemeBackgroundCodePreviewV56(modal) {
    modal
        .querySelectorAll(
            '.theme-code-preview-frame-v56'
        )
        .forEach(frame => frame.remove());

    const code =
        String(modal._themeInteractiveCodeV56 || '').trim();

    if (!code) return;

    // V196: the real Theme Builder preview is .theme-builder-live-canvas.
    // The old .theme-builder-app-preview still exists for compatibility but is
    // deliberately hidden by CSS, so mounting the iframe there made interactive
    // theme backgrounds look like a plain/white background in the visible preview.
    const preview =
        modal.querySelector(
            '.theme-builder-live-canvas'
        ) ||
        modal.querySelector(
            '.theme-builder-preview'
        ) ||
        modal.querySelector(
            '.theme-builder-app-preview'
        );

    if (!preview) return;

    const frame = document.createElement('iframe');
    frame.className = 'theme-code-preview-frame-v56';
    frame.setAttribute('sandbox', 'allow-scripts');
    frame.setAttribute('aria-hidden', 'true');
    frame.srcdoc = ensureBackgroundDocumentV56(code);

    preview.prepend(frame);
}

const updateThemeBuilderPreviewBeforeCreativeV56 =
    updateThemeBuilderPreview;

updateThemeBuilderPreview = function(modal) {
    updateThemeBuilderPreviewBeforeCreativeV56(modal);

    const draft =
        getThemeBuilderDraft(modal);

    const gradient =
        draft.backgroundGradientV56 || '';

    if (
        gradient &&
        !draft.backgroundImage
    ) {
        modal
            .querySelectorAll(
                '.theme-builder-preview, .theme-builder-app-preview, .theme-builder-live-canvas'
            )
            .forEach(preview => {
                preview.style.backgroundImage =
                    gradient;
                preview.style.backgroundSize =
                    'cover';
            });
    }

    renderThemeBackgroundCodePreviewV56(modal);
    syncThemeCreativeBackgroundUiV56(modal);
};


// ------------------------------------------------------------
// FINAL SMALL UX POLISH
// ------------------------------------------------------------

requestAnimationFrame(() => {
    renderKnowledgePlaceholderSettingsV56();

    bindPlaceholderAutocompleteV56(
        document.getElementById('add-item-name')
    );
});


// ============================================================
// V58 — QUIZ SETTINGS / ANKI FORECAST / LEECH DETECTION /
// SMART PLACEHOLDER PRACTICE / FLEXIBLE FORM TRANSFORMATIONS
// ============================================================

function ensureQuizSettingsV58() {
    if (!db.settings) db.settings = {};

    if (!db.settings.quizSettingsV58 || typeof db.settings.quizSettingsV58 !== 'object') {
        db.settings.quizSettingsV58 = {};
    }

    const settings = db.settings.quizSettingsV58;

    if (settings.smartPlaceholderPractice === undefined) {
        settings.smartPlaceholderPractice = false;
    }

    if (settings.transformationPractice === undefined) {
        settings.transformationPractice = false;
    }

    if (!Array.isArray(settings.transformations)) {
        settings.transformations = [];
    }

    return settings;
}

function getAllLoggedItemIdsV58() {
    const ids = new Set();

    Object.values(db.days || {}).forEach(day => {
        (day?.phrases || []).forEach(id => {
            if (db.phrase_meta?.[id]) ids.add(id);
        });
    });

    return Array.from(ids);
}

function dateStringOffsetV58(days) {
    const date = new Date();
    date.setUTCDate(date.getUTCDate() + Number(days || 0));
    return date.toISOString().slice(0, 10);
}

function getAnkiDueBreakdownV58(items = getDueSrsItems()) {
    const today = dateStringOffsetV58(0);
    let dueToday = 0;
    let overdue = 0;

    items.forEach(id => {
        const due = db.srs?.[id]?.due;

        if (due && due < today) overdue += 1;
        else dueToday += 1;
    });

    return {
        total: items.length,
        dueToday,
        overdue
    };
}

function getAnkiForecastV58() {
    const learned = new Set(getAllLoggedItemIdsV58());
    const tomorrow = dateStringOffsetV58(1);
    const weekEnd = dateStringOffsetV58(7);

    let tomorrowCount = 0;
    let nextSevenDays = 0;

    learned.forEach(id => {
        const due = db.srs?.[id]?.due;
        if (!due) return;

        if (due === tomorrow) tomorrowCount += 1;
        if (due >= tomorrow && due <= weekEnd) nextSevenDays += 1;
    });

    return {
        tomorrow: tomorrowCount,
        nextSevenDays
    };
}

function renderAnkiSummaryV58() {
    const summary = document.getElementById('anki-summary-detail');
    if (!summary) return;

    const dueItems = getDueSrsItems();
    const breakdown = getAnkiDueBreakdownV58(dueItems);
    const forecast = getAnkiForecastV58();

    summary.innerHTML = breakdown.total
        ? `<span class="anki-count-v58"><strong>${breakdown.dueToday}</strong> due today</span><span class="anki-summary-separator-v57"> · </span><span class="anki-count-v58"><strong>${breakdown.overdue}</strong> overdue</span>`
        : 'Nothing due right now!';

    const box = document.getElementById('anki-summary-box');
    if (!box) return;

    let forecastEl = box.querySelector('#anki-forecast-v58');

    if (!forecastEl) {
        forecastEl = document.createElement('div');
        forecastEl.id = 'anki-forecast-v58';
        forecastEl.className = 'anki-forecast-v58';
        summary.insertAdjacentElement('afterend', forecastEl);
    }

    forecastEl.innerHTML = `
        <span>Tomorrow: <strong>${forecast.tomorrow}</strong></span>
        <span class="anki-summary-separator-v57"> · </span>
        <span>Next 7 days: <strong>${forecast.nextSevenDays}</strong></span>
    `;
}

const updateAvailableQuizTypesBeforeV58 = updateAvailableQuizTypes;
updateAvailableQuizTypes = function() {
    const result = updateAvailableQuizTypesBeforeV58();

    if (quizMode === 'anki') {
        renderAnkiSummaryV58();
    }

    return result;
};


// ------------------------------------------------------------
// QUIZ SETTINGS MODAL
// ------------------------------------------------------------

function getTransformationFieldOptionsV58(categoryName) {
    const fields = getKnowledgeFieldDefs(categoryName)
        .filter(field => !['image', 'video', 'svg'].includes(field.kind));

    return [
        { value: '__title__', label: 'Title' },
        ...fields.map(field => ({
            value: field.name,
            label: field.name
        }))
    ];
}

function quizTransformationValueV58(itemId, fieldName) {
    if (fieldName === '__title__') return String(itemId || '');

    return String(
        db.phrase_meta?.[itemId]?.custom_fields?.[fieldName] || ''
    ).trim();
}

function createDefaultTransformationV58() {
    for (const category of db.settings.categories || []) {
        const fields = getTransformationFieldOptionsV58(category);

        if (fields.length >= 2) {
            return {
                id: customId('transformation'),
                category,
                fromField: fields[0].value,
                toField: fields[1].value,
                label: ''
            };
        }
    }

    return {
        id: customId('transformation'),
        category: db.settings.categories?.[0] || '',
        fromField: '__title__',
        toField: '__title__',
        label: ''
    };
}

function renderQuizTransformationRulesV58(modal) {
    const settings = ensureQuizSettingsV58();
    const host = modal.querySelector('.quiz-transformation-rules-v58');
    if (!host) return;

    host.innerHTML = settings.transformations.length
        ? settings.transformations.map(rule => {
            const category =
                db.settings.categories.includes(rule.category)
                    ? rule.category
                    : (db.settings.categories[0] || '');

            rule.category = category;

            const fields = getTransformationFieldOptionsV58(category);
            const fieldValues = new Set(fields.map(field => field.value));

            if (!fieldValues.has(rule.fromField)) {
                rule.fromField = fields[0]?.value || '__title__';
            }

            if (!fieldValues.has(rule.toField)) {
                rule.toField = fields[1]?.value || fields[0]?.value || '__title__';
            }

            return `
                <article class="quiz-transformation-rule-v58" data-transformation-id-v58="${escapeKnowledgeAttr(rule.id)}">
                    <div class="quiz-transformation-rule-top-v58">
                        <strong>${escapeKnowledgeHtml(rule.label || 'Transformation')}</strong>
                        <button type="button" class="small-icon-btn quiz-transformation-delete-v58" title="Remove transformation">
                            <i class="ph ph-x"></i>
                        </button>
                    </div>

                    <label>
                        <span>Category</span>
                        <select class="quiz-transformation-category-v58">
                            ${(db.settings.categories || []).map(name => `
                                <option value="${escapeKnowledgeAttr(name)}" ${name === category ? 'selected' : ''}>${escapeKnowledgeHtml(name)}</option>
                            `).join('')}
                        </select>
                    </label>

                    <div class="quiz-transformation-pair-v58">
                        <label>
                            <span>Show</span>
                            <select class="quiz-transformation-from-v58">
                                ${fields.map(field => `
                                    <option value="${escapeKnowledgeAttr(field.value)}" ${field.value === rule.fromField ? 'selected' : ''}>${escapeKnowledgeHtml(field.label)}</option>
                                `).join('')}
                            </select>
                        </label>

                        <i class="ph ph-arrow-right"></i>

                        <label>
                            <span>Ask for</span>
                            <select class="quiz-transformation-to-v58">
                                ${fields.map(field => `
                                    <option value="${escapeKnowledgeAttr(field.value)}" ${field.value === rule.toField ? 'selected' : ''}>${escapeKnowledgeHtml(field.label)}</option>
                                `).join('')}
                            </select>
                        </label>
                    </div>

                    <label>
                        <span>Optional label</span>
                        <input
                            type="text"
                            class="quiz-transformation-label-v58"
                            value="${escapeKnowledgeAttr(rule.label || '')}"
                            placeholder="e.g. Dictionary → Polite Present"
                        >
                    </label>
                </article>
            `;
        }).join('')
        : `
            <div class="quiz-settings-empty-v58">
                Add a transformation rule if you want Quizlet Learn to ask things such as dictionary form → polite form or present → past.
            </div>
        `;

    host.querySelectorAll('[data-transformation-id-v58]')
        .forEach(card => {
            const rule = settings.transformations.find(
                item => item.id === card.dataset.transformationIdV58
            );

            if (!rule) return;

            card.querySelector('.quiz-transformation-delete-v58')
                ?.addEventListener('click', () => {
                    settings.transformations = settings.transformations
                        .filter(item => item.id !== rule.id);
                    saveDb();
                    renderQuizTransformationRulesV58(modal);
                });

            card.querySelector('.quiz-transformation-category-v58')
                ?.addEventListener('change', event => {
                    rule.category = event.target.value;
                    const fields = getTransformationFieldOptionsV58(rule.category);
                    rule.fromField = fields[0]?.value || '__title__';
                    rule.toField = fields[1]?.value || fields[0]?.value || '__title__';
                    saveDb();
                    renderQuizTransformationRulesV58(modal);
                });

            card.querySelector('.quiz-transformation-from-v58')
                ?.addEventListener('change', event => {
                    rule.fromField = event.target.value;
                    saveDb();
                });

            card.querySelector('.quiz-transformation-to-v58')
                ?.addEventListener('change', event => {
                    rule.toField = event.target.value;
                    saveDb();
                });

            card.querySelector('.quiz-transformation-label-v58')
                ?.addEventListener('change', event => {
                    rule.label = event.target.value.trim();
                    saveDb();
                    renderQuizTransformationRulesV58(modal);
                });
        });
}

function ensureQuizSettingsModalV58() {
    let modal = document.getElementById('quiz-settings-modal-v58');
    if (modal) return modal;

    modal = document.createElement('div');
    modal.id = 'quiz-settings-modal-v58';
    modal.className = 'modal-overlay hidden quiz-settings-modal-v58';

    modal.innerHTML = `
        <div class="modal-box quiz-settings-box-v58">
            <div class="modal-header">
                <div>
                    <h2>Quiz Settings</h2>
                    <p class="quiz-settings-subtitle-v58">Optional generated practice. Your normal Flashcards, Quizlet Learn, and Anki decks still only use Items Learned from Daily Logs.</p>
                </div>

                <button type="button" class="small-icon-btn quiz-settings-close-v58" title="Close">
                    <i class="ph ph-x"></i>
                </button>
            </div>

            <section class="modal-section quiz-settings-option-v58">
                <label class="feature-toggle-row">
                    <input type="checkbox" class="quiz-smart-placeholder-toggle-v58">
                    <span>
                        <strong>Smart Placeholder Practice</strong>
                    </span>
                </label>
            </section>

            <section class="modal-section quiz-settings-option-v58">
                <label class="feature-toggle-row">
                    <input type="checkbox" class="quiz-transformation-toggle-v58">
                    <span>
                        <strong>Conjugation / Form Transformations</strong>
                    </span>
                </label>

                <div class="quiz-transformation-settings-v58">
                    <div class="quiz-settings-section-heading-v58">
                        <div>
                            <strong>Transformation Rules</strong>
                            <small>Choose which Knowledge Base field is shown and which field you must produce.</small>
                        </div>

                        <button type="button" class="icon-btn quiz-add-transformation-v58">
                            <i class="ph ph-plus"></i>
                            Add Rule
                        </button>
                    </div>

                    <div class="quiz-transformation-rules-v58"></div>
                </div>
            </section>
        </div>
    `;

    document.body.appendChild(modal);

    const close = () => modal.classList.add('hidden');

    modal.querySelector('.quiz-settings-close-v58')
        ?.addEventListener('click', close);

    modal.addEventListener('pointerdown', event => {
        if (event.target === modal) close();
    });

    modal.querySelector('.quiz-smart-placeholder-toggle-v58')
        ?.addEventListener('change', event => {
            ensureQuizSettingsV58().smartPlaceholderPractice = event.target.checked;
            saveDb();
        });

    modal.querySelector('.quiz-transformation-toggle-v58')
        ?.addEventListener('change', event => {
            ensureQuizSettingsV58().transformationPractice = event.target.checked;
            saveDb();
            syncQuizSettingsModalV58(modal);
        });

    modal.querySelector('.quiz-add-transformation-v58')
        ?.addEventListener('click', () => {
            ensureQuizSettingsV58().transformations.push(
                createDefaultTransformationV58()
            );
            saveDb();
            renderQuizTransformationRulesV58(modal);
        });

    return modal;
}

function syncQuizSettingsModalV58(modal = ensureQuizSettingsModalV58()) {
    const settings = ensureQuizSettingsV58();

    const smart = modal.querySelector('.quiz-smart-placeholder-toggle-v58');
    const transform = modal.querySelector('.quiz-transformation-toggle-v58');
    const details = modal.querySelector('.quiz-transformation-settings-v58');

    if (smart) smart.checked = !!settings.smartPlaceholderPractice;
    if (transform) transform.checked = !!settings.transformationPractice;
    details?.classList.toggle('disabled-v58', !settings.transformationPractice);

    renderQuizTransformationRulesV58(modal);
}

function openQuizSettingsV58() {
    const modal = ensureQuizSettingsModalV58();
    syncQuizSettingsModalV58(modal);
    modal.classList.remove('hidden');
}

function ensureQuizSettingsButtonV58() {
    if (!quizzesView || document.getElementById('open-quiz-settings-v58')) return;

    const button = document.createElement('button');
    button.type = 'button';
    button.id = 'open-quiz-settings-v58';
    button.className = 'small-icon-btn quiz-settings-button-v58';
    button.title = 'Quiz Settings';
    button.innerHTML = '<i class="ph ph-sliders-horizontal"></i>';
    button.addEventListener('click', openQuizSettingsV58);

    quizzesView.appendChild(button);
}

const updateQuizUIBeforeSettingsV58 = updateQuizUI;
updateQuizUI = function() {
    ensureQuizSettingsV58();
    ensureQuizSettingsButtonV58();
    const result = updateQuizUIBeforeSettingsV58();
    if (quizMode === 'anki') renderAnkiSummaryV58();
    return result;
};


// ------------------------------------------------------------
// QUIET LEECH DETECTION
// Repeated Still Learning presses do not punish scheduling; they simply mark
// an item as needing extra attention after 5 presses.
// ------------------------------------------------------------

function isLeechItemV58(itemId) {
    return !!db.srs?.[itemId]?.leechV58;
}

const processAnkiAnswerBeforeLeechV58 = processAnkiAnswer;
processAnkiAnswer = function(rating) {
    const id = activeQuizDeck[activeQuizIndex];

    if (id) {
        if (!db.srs) db.srs = {};

        if (!db.srs[id]) {
            db.srs[id] = {
                status: 'New',
                step_index: 0,
                interval: 1,
                ease_factor: 2.5
            };
        }

        const state = db.srs[id];
        state.stillLearningCountV58 = Number(state.stillLearningCountV58 || 0);

        if (rating === 'Again') {
            state.stillLearningCountV58 += 1;
        }

        state.leechV58 = state.stillLearningCountV58 >= 5;
    }

    const result = processAnkiAnswerBeforeLeechV58(rating);

    renderPhrasesLibrary(
        document.getElementById('phrases-search-bar')?.value || ''
    );

    return result;
};

function decorateLeechesV58() {
    document.querySelectorAll('#phrases-library-grid .phrase-card, #phrases-library-grid .polaroid-card')
        .forEach(card => {
            card.querySelector('.kb-leech-badge-v58')?.remove();

            const title =
                card.querySelector('.kb-library-item-title')?.textContent?.trim() ||
                card.querySelector('.chip-text')?.childNodes?.[0]?.textContent?.trim() ||
                '';

            if (!title || !isLeechItemV58(title)) return;

            const badge = document.createElement('span');
            badge.className = 'kb-leech-badge-v58';
            badge.title = 'Needs extra attention — repeatedly marked Still Learning';
            badge.innerHTML = '<i class="ph ph-warning-circle"></i><span>Needs work</span>';
            card.appendChild(badge);
        });
}

const renderPhrasesLibraryBeforeLeechesV58 = renderPhrasesLibrary;
renderPhrasesLibrary = function(filterText = '') {
    const result = renderPhrasesLibraryBeforeLeechesV58(filterText);
    decorateLeechesV58();
    return result;
};

const openItemModalBeforeLeechesV58 = openItemModal;
openItemModal = function(itemId, isCumulativeView = false, editInfo = false) {
    const result = openItemModalBeforeLeechesV58(
        itemId,
        isCumulativeView,
        editInfo
    );

    const title = document.getElementById('phrase-modal-title');
    title?.querySelector('.kb-modal-leech-v58')?.remove();

    if (title && isLeechItemV58(itemId)) {
        const badge = document.createElement('span');
        badge.className = 'kb-modal-leech-v58';
        badge.innerHTML = '<i class="ph ph-warning-circle"></i> Needs work';
        title.appendChild(badge);
    }

    return result;
};


// ------------------------------------------------------------
// SMART PLACEHOLDER QUIZLET LEARN PRACTICE
// ------------------------------------------------------------

let quizSmartPracticeStateV58 = {
    itemId: '',
    values: {}
};

function canonicalPlaceholderWordV58(value) {
    let text = normalizeKnowledgeTagV55(value)
        .replace(/ies$/i, 'y')
        .replace(/sses$/i, 'ss')
        .replace(/xes$/i, 'x')
        .replace(/zes$/i, 'z')
        .replace(/ches$/i, 'ch')
        .replace(/shes$/i, 'sh')
        .replace(/s$/i, '');

    return text;
}

function placeholderRequirementMatchesItemV58(placeholderName, itemId) {
    const wanted = canonicalPlaceholderWordV58(placeholderName);
    if (!wanted) return false;

    const meta = db.phrase_meta?.[itemId] || {};

    const candidates = new Set([
        normalizeKnowledgeTagV55(meta.type || ''),
        ...getKnowledgeItemTagsV55(itemId)
    ]);

    Object.values(meta.custom_fields || {}).forEach(value => {
        if (typeof value === 'string' && value.trim()) {
            candidates.add(normalizeKnowledgeTagV55(value));
        }
    });

    return Array.from(candidates).some(value => {
        const candidate = canonicalPlaceholderWordV58(value);
        return (
            candidate === wanted ||
            candidate.includes(wanted) ||
            wanted.includes(candidate)
        );
    });
}

function getPlaceholderCandidatesV58(placeholderName, patternId) {
    return getAllLoggedItemIdsV58()
        .filter(id => id !== patternId)
        .filter(id => !String(id).includes('\\'))
        .filter(id => placeholderRequirementMatchesItemV58(placeholderName, id));
}

function currentLearnPatternV58() {
    const current = learnQueue?.[0]?.id;
    if (!current) return null;

    const segments = placeholderSegmentsV56(current);
    const slots = segments.filter(segment => segment.type === 'slot');

    if (!slots.length) return null;

    return {
        itemId: current,
        segments,
        slots
    };
}

function renderSmartPlaceholderPracticeV58(area, pattern) {
    if (quizSmartPracticeStateV58.itemId !== pattern.itemId) {
        quizSmartPracticeStateV58 = {
            itemId: pattern.itemId,
            values: {}
        };
    }

    const allCandidateIds = Array.from(new Set(
        pattern.slots.flatMap(slot =>
            getPlaceholderCandidatesV58(slot.name, pattern.itemId)
        )
    ));

    document.getElementById('quiz-set-label').innerText =
        `${activeQuizIndex + 1} / ${activeQuizDeck.length} · Smart placeholder practice`;

    area.innerHTML = `
        <div class="quiz-generated-practice-v58 quiz-smart-placeholder-v58">
            <div class="quiz-generated-heading-v58">
                <span>Smart Placeholder Practice</span>
                <small>Drag a learned Knowledge Base item into each placeholder.</small>
            </div>

            <div class="quiz-placeholder-pattern-v58">
                ${pattern.segments.map(segment => {
                    if (segment.type === 'text') {
                        return `<span class="quiz-placeholder-literal-v58">${escapeKnowledgeHtml(segment.text)}</span>`;
                    }

                    const value = quizSmartPracticeStateV58.values[segment.slotIndex];

                    return `
                        <div
                            class="quiz-placeholder-drop-v58 ${value ? 'filled' : ''}"
                            data-quiz-placeholder-index-v58="${segment.slotIndex}"
                            data-quiz-placeholder-name-v58="${escapeKnowledgeAttr(segment.name)}"
                        >
                            <small>\\${escapeKnowledgeHtml(segment.name)}</small>
                            <strong>${value ? escapeKnowledgeHtml(value) : 'Drop here'}</strong>
                            ${value ? `<button type="button" class="quiz-placeholder-clear-v58" title="Clear"><i class="ph ph-x"></i></button>` : ''}
                        </div>
                    `;
                }).join('')}
            </div>

            <div class="quiz-placeholder-bank-toolbar-v58">
                <i class="ph ph-magnifying-glass"></i>
                <input type="text" class="quiz-placeholder-bank-search-v58" placeholder="Search learned items or #tag…">
            </div>

            <div class="quiz-placeholder-bank-v58"></div>

            <div class="quiz-generated-actions-v58">
                <button type="button" class="icon-btn quiz-placeholder-check-v58">
                    Check &amp; Continue
                </button>
            </div>
        </div>
    `;

    const bank = area.querySelector('.quiz-placeholder-bank-v58');
    const search = area.querySelector('.quiz-placeholder-bank-search-v58');

    const renderBank = () => {
        const parsed = parseKnowledgeSearchV55(search.value || '');
        const text = parsed.text.toLowerCase();

        const visible = allCandidateIds.filter(id => {
            const tags = getKnowledgeItemTagsV55(id);
            if (!parsed.tags.every(tag => tags.includes(tag))) return false;

            if (!text) return true;

            const meta = db.phrase_meta?.[id] || {};
            const haystack = `${id} ${meta.type || ''} ${Object.values(meta.custom_fields || {}).join(' ')} ${tags.join(' ')}`.toLowerCase();
            return haystack.includes(text);
        });

        bank.innerHTML = visible.length
            ? visible.map(id => `
                <button
                    type="button"
                    class="quiz-placeholder-bank-item-v58"
                    draggable="true"
                    data-quiz-kb-item-v58="${escapeKnowledgeAttr(id)}"
                >
                    <strong>${placeholderTokenHtmlV56(id)}</strong>
                    <small>${escapeKnowledgeHtml(db.phrase_meta?.[id]?.type || '')}</small>
                    <i class="ph ph-dots-six-vertical"></i>
                </button>
            `).join('')
            : `
                <div class="quiz-settings-empty-v58">
                    No learned items match the placeholders in this pattern yet. Use matching tags, dropdown values, or category names.
                </div>
            `;

        bank.querySelectorAll('[data-quiz-kb-item-v58]')
            .forEach(button => {
                button.addEventListener('dragstart', event => {
                    event.dataTransfer.effectAllowed = 'copy';
                    event.dataTransfer.setData(
                        'text/quiz-kb-item-v58',
                        button.dataset.quizKbItemV58
                    );
                });
            });
    };

    search.addEventListener('input', renderBank);
    renderBank();

    area.querySelectorAll('[data-quiz-placeholder-index-v58]')
        .forEach(slot => {
            const index = Number(slot.dataset.quizPlaceholderIndexV58);
            const placeholderName = slot.dataset.quizPlaceholderNameV58;

            slot.addEventListener('dragover', event => {
                if (!event.dataTransfer.types.includes('text/quiz-kb-item-v58')) return;
                event.preventDefault();
                slot.classList.add('drop-ready');
            });

            slot.addEventListener('dragleave', () => {
                slot.classList.remove('drop-ready');
            });

            slot.addEventListener('drop', event => {
                const itemId = event.dataTransfer.getData('text/quiz-kb-item-v58');
                if (!itemId) return;

                event.preventDefault();
                slot.classList.remove('drop-ready');

                if (!placeholderRequirementMatchesItemV58(placeholderName, itemId)) {
                    slot.classList.add('drop-wrong');
                    setTimeout(() => slot.classList.remove('drop-wrong'), 350);
                    showFeatureToast(`That item does not match \\${placeholderName}.`);
                    return;
                }

                quizSmartPracticeStateV58.values[index] = itemId;
                showQuizCard();
            });

            slot.querySelector('.quiz-placeholder-clear-v58')
                ?.addEventListener('click', () => {
                    delete quizSmartPracticeStateV58.values[index];
                    showQuizCard();
                });
        });

    area.querySelector('.quiz-placeholder-check-v58')
        ?.addEventListener('click', () => {
            const complete = pattern.slots.every(slot =>
                quizSmartPracticeStateV58.values[slot.slotIndex]
            );

            if (!complete) {
                showFeatureToast('Fill every placeholder first.');
                return;
            }

            quizSmartPracticeStateV58 = { itemId: '', values: {} };
            processLearnAnswer(true);
        });
}


// ------------------------------------------------------------
// TRANSFORMATION PRACTICE
// ------------------------------------------------------------

function findTransformationPracticeV58(itemId) {
    const settings = ensureQuizSettingsV58();
    const meta = db.phrase_meta?.[itemId];

    if (!meta) return null;

    for (const rule of settings.transformations) {
        if (rule.category !== meta.type) continue;

        const prompt = quizTransformationValueV58(itemId, rule.fromField);
        const answer = quizTransformationValueV58(itemId, rule.toField);

        if (!prompt || !answer || prompt === answer) continue;

        return {
            rule,
            prompt,
            answer
        };
    }

    return null;
}

function normalizeTransformationAnswerV58(value) {
    return String(value || '')
        .trim()
        .toLocaleLowerCase()
        .replace(/\s+/g, ' ');
}

function acceptedTransformationAnswersV58(answer) {
    const raw = String(answer || '');

    const split = raw.includes('|')
        ? raw.split('|')
        : [raw];

    return split
        .map(normalizeTransformationAnswerV58)
        .filter(Boolean);
}

function renderTransformationPracticeV58(area, itemId, practice) {
    const label =
        practice.rule.label ||
        `${practice.rule.fromField === '__title__' ? 'Title' : practice.rule.fromField} → ${practice.rule.toField === '__title__' ? 'Title' : practice.rule.toField}`;

    document.getElementById('quiz-set-label').innerText =
        `${activeQuizIndex + 1} / ${activeQuizDeck.length} · Transformation practice`;

    area.innerHTML = `
        <div class="quiz-generated-practice-v58 quiz-transformation-practice-v58">
            <div class="quiz-generated-heading-v58">
                <span>${escapeKnowledgeHtml(label)}</span>
                <small>${escapeKnowledgeHtml(db.phrase_meta?.[itemId]?.type || '')}</small>
            </div>

            <div class="quiz-transformation-prompt-v58">
                <span>${escapeKnowledgeHtml(practice.rule.fromField === '__title__' ? 'Title' : practice.rule.fromField)}</span>
                <strong>${escapeKnowledgeHtml(practice.prompt)}</strong>
            </div>

            <label class="quiz-transformation-answer-v58">
                <span>${escapeKnowledgeHtml(practice.rule.toField === '__title__' ? 'Title' : practice.rule.toField)}</span>
                <input
                    type="text"
                    class="quiz-transformation-answer-input-v58"
                    autocomplete="off"
                    spellcheck="false"
                    placeholder="Type your answer…"
                >
            </label>

            <div class="quiz-transformation-feedback-v58 hidden"></div>

            <div class="quiz-generated-actions-v58">
                <button type="button" class="icon-btn quiz-transformation-check-v58">
                    Check
                </button>
            </div>
        </div>
    `;

    const input = area.querySelector('.quiz-transformation-answer-input-v58');
    const check = area.querySelector('.quiz-transformation-check-v58');
    const feedback = area.querySelector('.quiz-transformation-feedback-v58');

    const evaluate = () => {
        const typed = normalizeTransformationAnswerV58(input.value);
        if (!typed) return;

        const accepted = acceptedTransformationAnswersV58(practice.answer);
        const correct = accepted.includes(typed);

        if (correct) {
            feedback.className = 'quiz-transformation-feedback-v58 correct';
            feedback.innerHTML = '<i class="ph ph-check-circle"></i> Correct';
            check.disabled = true;
            setTimeout(() => processLearnAnswer(true), 420);
            return;
        }

        feedback.className = 'quiz-transformation-feedback-v58 wrong';
        feedback.innerHTML = `
            <span><i class="ph ph-info"></i> Correct answer: <strong>${escapeKnowledgeHtml(practice.answer)}</strong></span>
            <button type="button" class="icon-btn quiz-transformation-continue-v58">Continue</button>
        `;

        check.classList.add('hidden');

        feedback.querySelector('.quiz-transformation-continue-v58')
            ?.addEventListener('click', () => processLearnAnswer(false));
    };

    check.addEventListener('click', evaluate);
    input.addEventListener('keydown', event => {
        if (event.key !== 'Enter') return;
        event.preventDefault();
        evaluate();
    });

    requestAnimationFrame(() => input.focus());
}


// ------------------------------------------------------------
// ONE LEARN SESSION: generated practice is inserted into the same existing
// Quizlet Learn queue. No extra round/deck is created.
// ------------------------------------------------------------

let activeAnkiBreakdownV58 = null;

const startQuizButtonV58 = document.getElementById('start-quiz-btn');
startQuizButtonV58?.addEventListener('click', () => {
    activeAnkiBreakdownV58 = null;
}, true);

const showQuizCardBeforeGeneratedPracticeV58 = showQuizCard;
showQuizCard = function() {
    const settings = ensureQuizSettingsV58();

    if (quizMode === 'learn' && learnQueue?.length) {
        const currentId = learnQueue[0].id;

        if (settings.smartPlaceholderPractice) {
            const pattern = currentLearnPatternV58();
            if (pattern) {
                renderSmartPlaceholderPracticeV58(
                    document.getElementById('quiz-flashcard-area'),
                    pattern
                );
                return;
            }
        }

        if (settings.transformationPractice) {
            const practice = findTransformationPracticeV58(currentId);

            if (practice) {
                renderTransformationPracticeV58(
                    document.getElementById('quiz-flashcard-area'),
                    currentId,
                    practice
                );
                return;
            }
        }
    }

    const result = showQuizCardBeforeGeneratedPracticeV58();

    if (quizMode === 'anki' && activeQuizDeck.length) {
        if (!activeAnkiBreakdownV58) {
            activeAnkiBreakdownV58 = getAnkiDueBreakdownV58(activeQuizDeck);
        }

        const label = document.getElementById('quiz-set-label');
        if (label) {
            const current = Math.min(activeQuizIndex + 1, activeQuizDeck.length);
            label.innerText =
                `${current} / ${activeQuizDeck.length} · ${activeAnkiBreakdownV58.dueToday} today · ${activeAnkiBreakdownV58.overdue} overdue`;
        }

        const id = activeQuizDeck[activeQuizIndex];
        const front = document.getElementById('quiz-flip-front');

        if (front && isLeechItemV58(id) && !front.querySelector('.quiz-leech-indicator-v58')) {
            const badge = document.createElement('span');
            badge.className = 'quiz-leech-indicator-v58';
            badge.innerHTML = '<i class="ph ph-warning-circle"></i> Needs work';
            front.appendChild(badge);
        }
    }

    return result;
};

requestAnimationFrame(() => {
    ensureQuizSettingsV58();
    ensureQuizSettingsButtonV58();
    if (quizMode === 'anki') renderAnkiSummaryV58();
});


// ============================================================
// V59 — THEME BUILDER PERFORMANCE + HEADING BACKGROUNDS /
// QUIZ PRACTICE SECTIONS / KB DISPLAY + QUIZ EXCLUSIONS / DAILY PDFS
// ============================================================

// ------------------------------------------------------------
// PLACEHOLDER DISPLAY: storage keeps the leading backslash, but every
// visible placeholder is bold uppercase without the slash.
// ------------------------------------------------------------
placeholderTokenHtmlV56 = function(title) {
    const source = String(title || '');
    const regex = /\\([a-z0-9_\-\u00C0-\u024F\u1100-\u11FF\u3130-\u318F\uAC00-\uD7AF]+)/gi;
    let result = '';
    let last = 0;
    let match;

    while ((match = regex.exec(source))) {
        result += escapeKnowledgeHtml(source.slice(last, match.index));
        result += `<strong class="kb-placeholder-token-v56">${escapeKnowledgeHtml(match[1].toUpperCase())}</strong>`;
        last = match.index + match[0].length;
    }

    result += escapeKnowledgeHtml(source.slice(last));
    return result;
};

const renderPhrasesBeforePlaceholderDisplayV59 = renderPhrases;
renderPhrases = function(phrases) {
    const result = renderPhrasesBeforePlaceholderDisplayV59(phrases);
    document.querySelectorAll('#phrases-container .kb-day-item-title').forEach(node => {
        const raw = node.textContent || '';
        if (raw.includes('\\')) node.innerHTML = placeholderTokenHtmlV56(raw);
    });
    return result;
};

// Hashtags now mean ONLY explicit tags the user added. Category names and
// dropdown values remain useful metadata for matching, but are not hashtags.
getKnowledgeItemTagsV55 = function(itemId) {
    return normalizeKnowledgeTagsV55(db.phrase_meta?.[itemId]?.tags || []);
};

// ------------------------------------------------------------
// HIDE FROM QUIZZES / FLASHCARDS / ANKI
// ------------------------------------------------------------
function isHiddenFromQuizzesV59(itemId) {
    return !!db.phrase_meta?.[itemId]?.hideFromQuizzesV59;
}

const getDueSrsItemsBeforeHideV59 = getDueSrsItems;
getDueSrsItems = function() {
    return getDueSrsItemsBeforeHideV59().filter(id => !isHiddenFromQuizzesV59(id));
};

const getAllLoggedItemIdsBeforeHideV59 = getAllLoggedItemIdsV58;
getAllLoggedItemIdsV58 = function() {
    return getAllLoggedItemIdsBeforeHideV59().filter(id => !isHiddenFromQuizzesV59(id));
};

function ensureKbQuizVisibilityRowV59(root, checked = false, editItemId = '') {
    if (!root || root.querySelector('.kb-hide-from-quizzes-row-v59')) return;
    const row = document.createElement('label');
    row.className = 'modal-section mt-10 kb-hide-from-quizzes-row-v59';
    row.innerHTML = `
        <span class="field-label">Hide from quizzes</span>
        <input type="checkbox" id="${editItemId ? 'edit-' : ''}kb-hide-from-quizzes-v59" ${checked ? 'checked' : ''}>
    `;
    root.appendChild(row);

    if (editItemId) {
        row.querySelector('input')?.addEventListener('change', event => {
            if (!db.phrase_meta?.[editItemId]) return;
            db.phrase_meta[editItemId].hideFromQuizzesV59 = !!event.target.checked;
            saveDb();
            updateQuizUI?.();
        });
    }
}

const renderAddKnowledgeFieldsBeforeQuizHideV59 = renderAddKnowledgeFields;
renderAddKnowledgeFields = function(categoryName) {
    renderAddKnowledgeFieldsBeforeQuizHideV59(categoryName);
    ensureKbQuizVisibilityRowV59(document.getElementById('kb-add-item-fields-body'), false, '');
};

const renderKnowledgeEditFieldsBeforeQuizHideV59 = renderKnowledgeEditFields;
renderKnowledgeEditFields = function(itemId, categoryName) {
    renderKnowledgeEditFieldsBeforeQuizHideV59(itemId, categoryName);
    ensureKbQuizVisibilityRowV59(
        document.getElementById('phrase-modal-dynamic-fields'),
        isHiddenFromQuizzesV59(itemId),
        itemId
    );
};

// ------------------------------------------------------------
// THEME BUILDER — fast image editor for large artwork sets.
// Only a page of image cards is mounted at a time; the full array remains
// intact for saving, previewing, placement, and runtime behavior.
// ------------------------------------------------------------
const renderThemeBuilderSvgListBeforePagingV59 = renderThemeBuilderSvgListV2;
renderThemeBuilderSvgListV2 = function(modal) {
    const all = Array.isArray(modal?._themeBackgroundSvgs)
        ? modal._themeBackgroundSvgs
        : [];

    const pageSize = 18;
    const limit = Math.max(pageSize, Number(modal?._themeImageRenderLimitV59) || pageSize);

    if (all.length <= limit) {
        renderThemeBuilderSvgListBeforePagingV59(modal);
    } else {
        const visible = all.slice(0, limit);
        modal._themeBackgroundSvgs = visible;
        try {
            renderThemeBuilderSvgListBeforePagingV59(modal);
        } finally {
            modal._themeBackgroundSvgs = all;
        }

        const host = modal.querySelector('.theme-builder-svg-list');
        const addCard = host?.querySelector('.theme-builder-svg-add-card');
        if (host && !host.querySelector('.theme-builder-image-load-more-v59')) {
            const more = document.createElement('button');
            more.type = 'button';
            more.className = 'theme-builder-svg-card theme-builder-image-load-more-v59';
            more.innerHTML = `<i class="ph ph-caret-down"></i><strong>Show ${Math.min(pageSize, all.length - limit)} more</strong><small>${limit} of ${all.length} loaded</small>`;
            more.addEventListener('click', () => {
                modal._themeImageRenderLimitV59 = Math.min(all.length, limit + pageSize);
                renderThemeBuilderSvgListV2(modal);
            });
            if (addCard) host.insertBefore(more, addCard); else host.appendChild(more);
        }
    }

    const count = modal?.querySelector('.theme-builder-svg-count');
    if (count) count.textContent = `${all.length} image${all.length === 1 ? '' : 's'}`;

    modal?.querySelectorAll('.theme-builder-svg-card-preview img').forEach(img => {
        img.loading = 'lazy';
        img.decoding = 'async';
    });
};

function forceThemeArtworkPreviewV59(modal) {
    if (!modal) return;
    const assets = Array.isArray(modal._themeBackgroundSvgs) ? modal._themeBackgroundSvgs : [];
    const canvas = modal.querySelector('.theme-builder-live-canvas');
    if (!canvas) return;

    canvas.querySelector('.theme-builder-live-art-stage')?.remove();
    if (!assets.length) return;

    const stage = document.createElement('div');
    stage.className = 'theme-builder-live-art-stage theme-builder-live-art-stage-v59';

    let assignments = [];
    try {
        assignments = getPreviewSvgAssignmentsV10?.(modal, getThemeBuilderDraft(modal)) || [];
    } catch {}

    assets.slice(0, 12).forEach((asset, index) => {
        const item = document.createElement('div');
        item.className = 'theme-builder-live-art-item';
        const point = assignments[index] || {};
        item.style.left = `${Number(point.left) || (7 + ((index * 31 + 11) % 86))}%`;
        item.style.top = `${Number(point.top) || (9 + ((index * 47 + 19) % 80))}%`;
        item.innerHTML = renderThemeBuilderSvgAsset(asset);
        item.querySelectorAll('img').forEach(img => {
            img.loading = 'eager';
            img.decoding = 'async';
        });
        stage.appendChild(item);
    });

    canvas.prepend(stage);
}

const updateThemeBuilderPreviewBeforeArtworkFixV59 = updateThemeBuilderPreview;
updateThemeBuilderPreview = function(modal) {
    const result = updateThemeBuilderPreviewBeforeArtworkFixV59(modal);
    forceThemeArtworkPreviewV59(modal);
    applyThemeHeadingPreviewV59(modal);
    return result;
};

// ------------------------------------------------------------
// THEME BUILDER — optional background behind section headings.
// ------------------------------------------------------------
function ensureThemeHeadingControlsV59(modal) {
    if (!modal || modal.querySelector('.theme-heading-background-controls-v59')) return;

    const section = document.createElement('section');
    section.className = 'theme-builder-control-section theme-heading-background-controls-v59';
    section.dataset.themeBuilderPanelGroup = 'colors';
    section.innerHTML = `
        <div class="theme-builder-control-heading">
            <strong>Section Heading Backdrop</strong>
            <small>Add a padded background behind headings such as Items Learned, Tools, Media Resources, and custom-tab section titles.</small>
        </div>
        <label class="feature-toggle-row theme-heading-background-toggle-v59">
            <input type="checkbox" class="theme-heading-background-enabled-v59">
            <span>Use heading backdrop</span>
        </label>
        <div class="theme-heading-background-details-v59">
            <label class="theme-builder-field">
                <span>Background Color</span>
                <input type="color" class="theme-heading-background-color-v59" value="#ffffff">
            </label>
            <label class="theme-builder-field">
                <span>Padding</span>
                <input type="range" class="theme-heading-background-padding-v59" min="2" max="18" step="1" value="6">
                <output class="theme-heading-background-padding-output-v59">6px</output>
            </label>
        </div>
    `;

    const colors = modal.querySelector('.theme-builder-color-grid')?.closest('.theme-builder-control-section');
    if (colors) colors.insertAdjacentElement('afterend', section);
    else modal.querySelector('.theme-builder-controls')?.prepend(section);

    const refresh = () => {
        const enabled = section.querySelector('.theme-heading-background-enabled-v59').checked;
        section.querySelector('.theme-heading-background-details-v59')?.classList.toggle('hidden', !enabled);
        const p = section.querySelector('.theme-heading-background-padding-v59');
        section.querySelector('.theme-heading-background-padding-output-v59').textContent = `${p.value}px`;
        updateThemeBuilderPreview(modal);
    };

    section.querySelector('.theme-heading-background-enabled-v59').addEventListener('change', refresh);
    section.querySelector('.theme-heading-background-color-v59').addEventListener('input', refresh);
    section.querySelector('.theme-heading-background-padding-v59').addEventListener('input', refresh);
    installThemeBuilderSectionTabsV11?.(modal);
}

const getThemeBuilderDraftBeforeHeadingBgV59 = getThemeBuilderDraft;
getThemeBuilderDraft = function(modal) {
    const draft = getThemeBuilderDraftBeforeHeadingBgV59(modal);
    draft.sectionHeadingBackgroundEnabledV59 = !!modal?.querySelector('.theme-heading-background-enabled-v59')?.checked;
    draft.sectionHeadingBackgroundColorV59 = modal?.querySelector('.theme-heading-background-color-v59')?.value || draft.surface || '#ffffff';
    draft.sectionHeadingBackgroundPaddingV59 = Number(modal?.querySelector('.theme-heading-background-padding-v59')?.value || 6);
    return draft;
};

const populateThemeBuilderBeforeHeadingBgV59 = populateThemeBuilder;
populateThemeBuilder = function(modal, theme) {
    populateThemeBuilderBeforeHeadingBgV59(modal, theme);
    ensureThemeHeadingControlsV59(modal);
    const enabled = modal.querySelector('.theme-heading-background-enabled-v59');
    const color = modal.querySelector('.theme-heading-background-color-v59');
    const padding = modal.querySelector('.theme-heading-background-padding-v59');
    if (enabled) enabled.checked = !!theme?.sectionHeadingBackgroundEnabledV59;
    if (color) color.value = theme?.sectionHeadingBackgroundColorV59 || theme?.surface || '#ffffff';
    if (padding) padding.value = String(Number(theme?.sectionHeadingBackgroundPaddingV59) || 6);
    modal.querySelector('.theme-heading-background-details-v59')?.classList.toggle('hidden', !enabled?.checked);
    modal._themeImageRenderLimitV59 = 18;
    renderThemeBuilderSvgListV2(modal);
    requestAnimationFrame(() => forceThemeArtworkPreviewV59(modal));
};

function applyThemeHeadingStyleV59(theme = {}) {
    const root = document.documentElement;
    const enabled = !!theme.sectionHeadingBackgroundEnabledV59;
    root.classList.toggle('theme-section-heading-bg-v59', enabled);
    root.style.setProperty('--section-heading-bg-v59', theme.sectionHeadingBackgroundColorV59 || theme.surface || '#ffffff');
    root.style.setProperty('--section-heading-pad-v59', `${Math.max(2, Math.min(18, Number(theme.sectionHeadingBackgroundPaddingV59) || 6))}px`);
}

function applyThemeHeadingPreviewV59(modal) {
    const canvas = modal?.querySelector('.theme-builder-live-canvas');
    if (!canvas) return;
    const draft = getThemeBuilderDraft(modal);
    canvas.classList.toggle('theme-section-heading-bg-v59', !!draft.sectionHeadingBackgroundEnabledV59);
    canvas.style.setProperty('--section-heading-bg-v59', draft.sectionHeadingBackgroundColorV59 || draft.surface || '#fff');
    canvas.style.setProperty('--section-heading-pad-v59', `${Number(draft.sectionHeadingBackgroundPaddingV59) || 6}px`);
}

const applyCustomBuiltThemeBeforeHeadingBgV59 = applyCustomBuiltTheme;
applyCustomBuiltTheme = function(theme = getCustomThemeSettings()) {
    const result = applyCustomBuiltThemeBeforeHeadingBgV59(theme);
    applyThemeHeadingStyleV59(theme || {});
    return result;
};

const applyThemeBeforeHeadingBgV59 = applyTheme;
applyTheme = async function(themeValue, opts = {}) {
    const result = await applyThemeBeforeHeadingBgV59(themeValue, opts);
    let theme = null;
    try { theme = resolveThemeCreativeDataV56?.(themeValue) || null; } catch {}
    applyThemeHeadingStyleV59(theme || {});
    return result;
};

// ------------------------------------------------------------
// CONSISTENT PAGE ACTION BUTTONS
// ------------------------------------------------------------
function normalizePageActionButtonsV59(root = document) {
    root.querySelectorAll(
        '#open-quiz-settings-v58, #open-daily-settings-btn, #open-settings-btn, ' +
        '.custom-tab-edit-btn, .custom-tab-settings-btn'
    ).forEach(button => button.classList.add('page-action-square-v59'));
}

const ensureQuizSettingsButtonBeforeStyleV59 = ensureQuizSettingsButtonV58;
ensureQuizSettingsButtonV58 = function() {
    ensureQuizSettingsButtonBeforeStyleV59();
    normalizePageActionButtonsV59();
};

const renderCustomTabViewBeforeActionStyleV59 = renderCustomTabView;
renderCustomTabView = function(tabId) {
    const result = renderCustomTabViewBeforeActionStyleV59(tabId);
    normalizePageActionButtonsV59(document.getElementById(`custom-tab-view-${tabId}`) || document);
    return result;
};

requestAnimationFrame(() => normalizePageActionButtonsV59());

// ------------------------------------------------------------
// QUIZ SETTINGS: generated practices are separate sections below Start Quiz,
// never injected into Flashcards / Learn / Anki sessions.
// ------------------------------------------------------------
showQuizCard = function() {
    const result = showQuizCardBeforeGeneratedPracticeV58();

    if (quizMode === 'anki' && activeQuizDeck.length) {
        if (!activeAnkiBreakdownV58) activeAnkiBreakdownV58 = getAnkiDueBreakdownV58(activeQuizDeck);
        const label = document.getElementById('quiz-set-label');
        if (label) {
            const current = Math.min(activeQuizIndex + 1, activeQuizDeck.length);
            label.innerText = `${current} / ${activeQuizDeck.length} · ${activeAnkiBreakdownV58.dueToday} today · ${activeAnkiBreakdownV58.overdue} overdue`;
        }
        const id = activeQuizDeck[activeQuizIndex];
        const front = document.getElementById('quiz-flip-front');
        if (front && isLeechItemV58(id) && !front.querySelector('.quiz-leech-indicator-v58')) {
            const badge = document.createElement('span');
            badge.className = 'quiz-leech-indicator-v58';
            badge.innerHTML = '<i class="ph ph-warning-circle"></i> Needs work';
            front.appendChild(badge);
        }
    }
    return result;
};

function learnedPlaceholderPatternsV59() {
    const learned = new Set(getAllLoggedItemIdsV58());
    return knowledgePatternItemsV56().filter(id => learned.has(id));
}

function ensureQuizExtraPracticeHostV59() {
    const start = document.getElementById('start-quiz-btn');
    if (!start) return null;
    let host = document.getElementById('quiz-extra-practice-host-v59');
    if (!host) {
        host = document.createElement('div');
        host.id = 'quiz-extra-practice-host-v59';
        host.className = 'quiz-extra-practice-host-v59';
        const parent = start.parentElement;
        if (parent) parent.insertAdjacentElement('afterend', host);
        else start.insertAdjacentElement('afterend', host);
    }
    return host;
}

function createPracticeModalV59(id, title) {
    document.getElementById(id)?.remove();
    const modal = document.createElement('div');
    modal.id = id;
    modal.className = 'modal-overlay quiz-practice-modal-v59';
    modal.innerHTML = `
        <div class="modal-box quiz-practice-box-v59">
            <div class="modal-header">
                <h2>${escapeKnowledgeHtml(title)}</h2>
                <button type="button" class="small-icon-btn quiz-practice-close-v59"><i class="ph ph-x"></i></button>
            </div>
            <div class="quiz-practice-body-v59"></div>
        </div>`;
    document.body.appendChild(modal);
    const close = () => modal.remove();
    modal.querySelector('.quiz-practice-close-v59').addEventListener('click', close);
    modal.addEventListener('pointerdown', e => { if (e.target === modal) close(); });
    return modal;
}

function openSmartPlaceholderPracticeV59() {
    const patterns = learnedPlaceholderPatternsV59();
    const modal = createPracticeModalV59('smart-placeholder-practice-modal-v59', 'Smart Placeholder Practice');
    const body = modal.querySelector('.quiz-practice-body-v59');
    if (!patterns.length) {
        body.innerHTML = '<div class="quiz-settings-empty-v58">No learned placeholder patterns are available yet.</div>';
        return;
    }

    let currentPattern = patterns[Math.floor(Math.random() * patterns.length)];
    let values = {};

    const render = () => {
        const segments = placeholderSegmentsV56(currentPattern);
        const slots = segments.filter(x => x.type === 'slot');
        const candidates = Array.from(new Set(slots.flatMap(slot => getPlaceholderCandidatesV58(slot.name, currentPattern))))
            .filter(id => !isHiddenFromQuizzesV59(id));

        body.innerHTML = `
            <div class="quiz-practice-toolbar-v59">
                <strong>${placeholderTokenHtmlV56(currentPattern)}</strong>
                <button type="button" class="small-icon-btn smart-next-pattern-v59" title="New pattern"><i class="ph ph-shuffle"></i></button>
            </div>
            <div class="sentence-builder-canvas-v56 smart-practice-canvas-v59">
                ${segments.map(seg => seg.type === 'text'
                    ? `<span class="sentence-builder-literal-v56">${escapeKnowledgeHtml(seg.text)}</span>`
                    : `<div class="sentence-builder-slot-v56 ${values[seg.slotIndex] ? 'filled' : ''}" data-smart-slot-v59="${seg.slotIndex}" data-smart-name-v59="${escapeKnowledgeAttr(seg.name)}">
                        <span class="sentence-builder-slot-label-v56">${escapeKnowledgeHtml(seg.name.toUpperCase())}</span>
                        <div class="sentence-builder-slot-value-v56">${values[seg.slotIndex] ? `<strong>${escapeKnowledgeHtml(values[seg.slotIndex])}</strong>` : '<span>Drop an item here</span>'}</div>
                    </div>`).join('')}
            </div>
            <div class="sentence-builder-search-v56"><i class="ph ph-magnifying-glass"></i><input class="smart-practice-search-v59" placeholder="Search learned items or #tag…"></div>
            <div class="sentence-builder-kb-results-v56 smart-practice-bank-v59"></div>
            <div class="quiz-generated-actions-v58"><button type="button" class="icon-btn smart-practice-check-v59">Check</button></div>`;

        const search = body.querySelector('.smart-practice-search-v59');
        const bank = body.querySelector('.smart-practice-bank-v59');
        const drawBank = () => {
            const parsed = parseKnowledgeSearchV55(search.value || '');
            const q = parsed.text.toLowerCase();
            const filtered = candidates.filter(id => {
                if (!parsed.tags.every(tag => getKnowledgeItemTagsV55(id).includes(tag))) return false;
                return !q || `${id} ${Object.values(db.phrase_meta?.[id]?.custom_fields || {}).join(' ')}`.toLowerCase().includes(q);
            });
            bank.innerHTML = filtered.length ? filtered.map(id => `<button type="button" class="sentence-builder-kb-result-v56" draggable="true" data-smart-item-v59="${escapeKnowledgeAttr(id)}"><span>${placeholderTokenHtmlV56(id)}</span><i class="ph ph-dots-six-vertical"></i></button>`).join('') : '<div class="sentence-pattern-no-results-v55">No matching learned items.</div>';
            bank.querySelectorAll('[data-smart-item-v59]').forEach(btn => btn.addEventListener('dragstart', e => e.dataTransfer.setData('text/smart-v59', btn.dataset.smartItemV59)));
        };
        search.addEventListener('input', drawBank); drawBank();

        body.querySelectorAll('[data-smart-slot-v59]').forEach(slot => {
            slot.addEventListener('dragover', e => { e.preventDefault(); slot.classList.add('drop-ready'); });
            slot.addEventListener('dragleave', () => slot.classList.remove('drop-ready'));
            slot.addEventListener('drop', e => {
                e.preventDefault(); slot.classList.remove('drop-ready');
                const item = e.dataTransfer.getData('text/smart-v59');
                const name = slot.dataset.smartNameV59;
                if (!item || !placeholderRequirementMatchesItemV58(name, item)) {
                    showFeatureToast(`That item does not match ${name.toUpperCase()}.`); return;
                }
                values[Number(slot.dataset.smartSlotV59)] = item; render();
            });
        });
        body.querySelector('.smart-next-pattern-v59').addEventListener('click', () => {
            currentPattern = patterns[Math.floor(Math.random() * patterns.length)]; values = {}; render();
        });
        body.querySelector('.smart-practice-check-v59').addEventListener('click', () => {
            const complete = slots.every(s => values[s.slotIndex]);
            if (!complete) { showFeatureToast('Fill every placeholder first.'); return; }
            showFeatureToast('Complete!');
            currentPattern = patterns[Math.floor(Math.random() * patterns.length)]; values = {}; render();
        });
    };
    render();
}

function getTransformationExercisesV59() {
    const learned = getAllLoggedItemIdsV58();
    const exercises = [];
    learned.forEach(itemId => {
        const practice = findTransformationPracticeV58(itemId);
        if (practice && !isHiddenFromQuizzesV59(itemId)) exercises.push({itemId, ...practice});
    });
    return exercises;
}

function openTransformationPracticeV59() {
    const exercises = getTransformationExercisesV59();
    const modal = createPracticeModalV59('transformation-practice-modal-v59', 'Conjugation / Form Transformations');
    const body = modal.querySelector('.quiz-practice-body-v59');
    if (!exercises.length) {
        body.innerHTML = '<div class="quiz-settings-empty-v58">No learned items match your transformation rules yet.</div>';
        return;
    }
    let current = exercises[Math.floor(Math.random() * exercises.length)];
    const render = () => {
        const rule = current.rule;
        const label = rule.label || `${rule.fromField === '__title__' ? 'Title' : rule.fromField} → ${rule.toField === '__title__' ? 'Title' : rule.toField}`;
        body.innerHTML = `
            <div class="quiz-generated-practice-v58 quiz-transformation-practice-v58 standalone-v59">
                <div class="quiz-generated-heading-v58"><span>${escapeKnowledgeHtml(label)}</span><small>${escapeKnowledgeHtml(db.phrase_meta?.[current.itemId]?.type || '')}</small></div>
                <div class="quiz-transformation-prompt-v58"><span>${escapeKnowledgeHtml(rule.fromField === '__title__' ? 'Title' : rule.fromField)}</span><strong>${escapeKnowledgeHtml(current.prompt)}</strong></div>
                <label class="quiz-transformation-answer-v58"><span>${escapeKnowledgeHtml(rule.toField === '__title__' ? 'Title' : rule.toField)}</span><input type="text" class="transform-standalone-input-v59" placeholder="Type your answer…"></label>
                <div class="transform-standalone-feedback-v59"></div>
                <div class="quiz-generated-actions-v58"><button class="icon-btn transform-standalone-check-v59">Check</button><button class="small-icon-btn transform-standalone-next-v59" title="Next"><i class="ph ph-arrow-right"></i></button></div>
            </div>`;
        const input = body.querySelector('.transform-standalone-input-v59');
        const feedback = body.querySelector('.transform-standalone-feedback-v59');
        const check = () => {
            if (!input.value.trim()) return;
            const ok = acceptedTransformationAnswersV58(current.answer).includes(normalizeTransformationAnswerV58(input.value));
            feedback.innerHTML = ok ? '<span class="correct"><i class="ph ph-check-circle"></i> Correct</span>' : `<span class="wrong">Correct answer: <strong>${escapeKnowledgeHtml(current.answer)}</strong></span>`;
        };
        body.querySelector('.transform-standalone-check-v59').addEventListener('click', check);
        input.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); check(); } });
        body.querySelector('.transform-standalone-next-v59').addEventListener('click', () => { current = exercises[Math.floor(Math.random() * exercises.length)]; render(); });
        requestAnimationFrame(() => input.focus());
    };
    render();
}

function renderQuizExtraPracticeSectionsV59() {
    const host = ensureQuizExtraPracticeHostV59();
    if (!host) return;
    const settings = ensureQuizSettingsV58();
    const cards = [];
    if (settings.smartPlaceholderPractice) cards.push(`
        <section class="quiz-extra-practice-card-v59"><div><strong>Smart Placeholder Practice</strong><small>Drag learned Knowledge Base items into your custom placeholder patterns.</small></div><button class="icon-btn open-smart-practice-v59">Start Practice</button></section>`);
    if (settings.transformationPractice) cards.push(`
        <section class="quiz-extra-practice-card-v59"><div><strong>Conjugation / Form Transformations</strong><small>Practice the transformation rules you configured without changing your normal quiz decks.</small></div><button class="icon-btn open-transformation-practice-v59">Start Practice</button></section>`);
    host.innerHTML = cards.join('');
    host.classList.toggle('hidden', !cards.length);
    host.querySelector('.open-smart-practice-v59')?.addEventListener('click', event => { event.preventDefault(); event.stopImmediatePropagation(); (window.openSmartPlaceholderPracticeV473 || window.openSmartPlaceholderPracticeV468 || openSmartPlaceholderPracticeV59)(); });
    host.querySelector('.open-transformation-practice-v59')?.addEventListener('click', openTransformationPracticeV59);
}

const updateQuizUIBeforeExtraPracticeV59 = updateQuizUI;
updateQuizUI = function() {
    const result = updateQuizUIBeforeExtraPracticeV59();
    renderQuizExtraPracticeSectionsV59();
    return result;
};

// Quiz Settings polish: icon-only add rule, help example on hover, centered X.
const ensureQuizSettingsModalBeforePolishV59 = ensureQuizSettingsModalV58;
ensureQuizSettingsModalV58 = function() {
    const modal = ensureQuizSettingsModalBeforePolishV59();
    if (!modal) return modal;

    const add = modal.querySelector('.quiz-add-transformation-v58');
    if (add) {
        add.innerHTML = '<i class="ph ph-plus"></i>';
        add.title = 'Add transformation rule';
        add.setAttribute('aria-label', 'Add transformation rule');
    }

    const heading = modal.querySelector('.quiz-settings-section-heading-v58');
    if (heading && !heading.querySelector('.quiz-transformation-help-v59')) {
        const help = document.createElement('button');
        help.type = 'button';
        help.className = 'small-icon-btn quiz-transformation-help-v59';
        help.innerHTML = '<i class="ph ph-question"></i>';
        help.title = 'Transformation example';
        heading.querySelector('div')?.appendChild(help);

        const show = () => {
            document.getElementById('quiz-transformation-help-popover-v59')?.remove();
            const pop = document.createElement('div');
            pop.id = 'quiz-transformation-help-popover-v59';
            pop.className = 'quiz-transformation-help-popover-v59';
            pop.innerHTML = `
                <strong>Example</strong>
                <span>Category: French Verbs</span>
                <span>Show: <b>Infinitive</b> → <b>parler</b></span>
                <span>Ask for: <b>Nous Present</b></span>
                <span>Practice asks: <b>parler → ?</b></span>
                <span>Correct answer: <b>parlons</b></span>`;
            document.body.appendChild(pop);
            const r = help.getBoundingClientRect();
            pop.style.left = `${Math.min(window.innerWidth - 310, r.left)}px`;
            pop.style.top = `${Math.min(window.innerHeight - 190, r.bottom + 6)}px`;
        };
        const hide = () => document.getElementById('quiz-transformation-help-popover-v59')?.remove();
        help.addEventListener('mouseenter', show);
        help.addEventListener('mouseleave', hide);
        help.addEventListener('focus', show);
        help.addEventListener('blur', hide);
    }
    return modal;
};

const syncQuizSettingsModalBeforeExtraV59 = syncQuizSettingsModalV58;
syncQuizSettingsModalV58 = function(modal = ensureQuizSettingsModalV58()) {
    const result = syncQuizSettingsModalBeforeExtraV59(modal);
    renderQuizExtraPracticeSectionsV59();
    return result;
};

// ------------------------------------------------------------
// DAILY LOG MEDIA RESOURCES — add uploaded PDFs and modernize copy.
// ------------------------------------------------------------
async function uploadDailyPdfV59(file) {
    if (!file) return null;
    if (!(file.type === 'application/pdf' || /\.pdf$/i.test(file.name || ''))) {
        showFeatureToast('Choose a PDF file.');
        return null;
    }
    const dataUrl = await customFileToDataUrl(file);
    if (!dataUrl) return null;
    try {
        const response = await fetch(`/api/daily-resource-pdf/${encodeURIComponent(HOBBY)}`, {
            method: 'POST',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify({fileName: file.name, dataUrl})
        });
        const result = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(result.message || 'PDF upload failed.');
        return result;
    } catch (error) {
        showFeatureToast(error.message || 'Could not upload PDF.');
        return null;
    }
}

function ensureDailyPdfResourceUiV59() {
    const group = document.getElementById('resource-input-group');
    const input = document.getElementById('new-resource-url');
    if (!group || !input) return;

    input.placeholder = 'Paste a YouTube, TikTok, site, or other link…';
    input.setAttribute('aria-label', 'YouTube, TikTok, site, or other link');

    const section = group.closest('.borderless-section') || group.parentElement?.parentElement || group.parentElement;
    if (section) {
        const walker = document.createTreeWalker(section, NodeFilter.SHOW_TEXT);
        let node;
        while ((node = walker.nextNode())) {
            if (/Paste a YouTube.*TikTok.*learn today/i.test(node.nodeValue || '')) {
                node.nodeValue = 'Add a YouTube (including Shorts), TikTok, website/link, or upload a PDF you used to learn today.';
                break;
            }
        }
    }

    if (!document.getElementById('daily-resource-pdf-input-v59')) {
        const file = document.createElement('input');
        file.type = 'file'; file.id = 'daily-resource-pdf-input-v59';
        file.accept = 'application/pdf,.pdf'; file.className = 'hidden';
        const button = document.createElement('button');
        button.type = 'button'; button.className = 'small-icon-btn daily-resource-pdf-button-v59';
        button.innerHTML = '<i class="ph ph-file-pdf"></i><span>Upload PDF</span>';
        button.title = 'Upload PDF';
        group.append(file, button);
        button.addEventListener('click', () => { file.value=''; file.click(); });
        file.addEventListener('change', async () => {
            const selected = file.files?.[0];
            if (!selected || !currentDay) return;
            const saved = await uploadDailyPdfV59(selected);
            if (!saved?.url) return;
            if (!db.days[currentDay].resources) db.days[currentDay].resources=[];
            db.days[currentDay].resources.push({type:'pdf', url:saved.url, title:selected.name.replace(/\.pdf$/i,'') || 'PDF', fileName:selected.name});
            renderResources(db.days[currentDay]); scheduleSaveDay();
            group.classList.add('hidden');
        });
    }
}

const renderResourcesBeforePdfV59 = renderResources;
renderResources = function(dayData) {
    const result = renderResourcesBeforePdfV59(dayData);
    const grid = document.getElementById('resources-grid');
    (dayData?.resources || []).forEach((res, index) => {
        if (res?.type !== 'pdf') return;
        const card = grid?.children?.[index];
        if (!card) return;
        card.classList.add('daily-pdf-resource-v59');
        card.innerHTML = `
            <a class="daily-generic-resource-card" href="${escapeCustomHtml(res.url || '#')}" target="_blank" rel="noopener noreferrer" title="Open PDF">
                <span class="daily-generic-resource-icon"><i class="ph ph-file-pdf"></i></span>
                <span class="daily-generic-resource-copy"><strong>${escapeCustomHtml(res.title || res.fileName || 'PDF')}</strong><small>PDF</small></span>
                <i class="ph ph-arrow-square-out daily-generic-resource-open"></i>
            </a>
            <div class="resource-card-controls"><button class="resource-card-btn" data-action="delete" title="Remove"><i class="ph ph-trash"></i></button></div>`;
        card.querySelector('[data-action="delete"]')?.addEventListener('click', () => {
            dayData.resources.splice(index,1); renderResources(dayData); scheduleSaveDay();
        });
    });
    ensureDailyPdfResourceUiV59();
    return result;
};

requestAnimationFrame(() => {
    ensureDailyPdfResourceUiV59();
    renderQuizExtraPracticeSectionsV59();
    normalizePageActionButtonsV59();
});


// ============================================================
// V60 — CURSOR / THEME PREVIEW / FIELD PRACTICE / TAB POLISH
// ============================================================

// ------------------------------------------------------------
// 1) Keep the chosen app cursor authoritative everywhere.
// Side-nav drag still works; it simply no longer changes to a grab/hand cursor.
// ------------------------------------------------------------
function normalizePageActionButtonSizeV60(root = document) {
    const reference = document.getElementById('add-phrase-library-btn');
    let size = 42;
    if (reference) {
        const rect = reference.getBoundingClientRect();
        const measured = Math.max(rect.width || 0, rect.height || 0);
        if (measured >= 28 && measured <= 64) size = Math.round(measured);
    }

    root.querySelectorAll(
        '#open-quiz-settings-v58, #open-daily-settings-btn, #open-settings-btn, ' +
        '.custom-tab-edit-btn, .custom-tab-settings-btn'
    ).forEach(button => {
        button.classList.add('page-action-square-v60');
        button.style.setProperty('--page-action-size-v60', `${size}px`);
    });
}

// ------------------------------------------------------------
// 2) Section-heading backgrounds.
// V59 used a selector/class combination that could be overridden by theme
// background shorthands. V60 uses a dedicated body class + background-color.
// ------------------------------------------------------------
function clearThemeHeadingStyleV60(root = document) {
    root.querySelectorAll('[data-theme-heading-bg-v60="true"]').forEach(node => {
        node.removeAttribute('data-theme-heading-bg-v60');
    });
}

function headingTargetsV60(root = document) {
    return Array.from(root.querySelectorAll([
        '.view .borderless-section > h1',
        '.view .borderless-section > h2',
        '.view .borderless-section > h3',
        '.view .section-header > h1',
        '.view .section-header > h2',
        '.view .section-header > h3',
        '.view .custom-collection-header h1',
        '.view .custom-collection-header h2',
        '.view .custom-collection-header h3',
        '.view .feature-page-header h1',
        '.view .feature-page-header h2',
        '.view .custom-tab-title',
        '.view .weekly-review-title',
        '.view .weekly-review-section h2',
        '.view .weekly-review-section h3',
        '.view .custom-user-heading',
        '.theme-builder-live-canvas .borderless-section > h1',
        '.theme-builder-live-canvas .borderless-section > h2',
        '.theme-builder-live-canvas .borderless-section > h3',
        '.theme-builder-live-canvas .section-header > h1',
        '.theme-builder-live-canvas .section-header > h2',
        '.theme-builder-live-canvas .section-header > h3',
        '.theme-builder-live-canvas .custom-collection-header h1',
        '.theme-builder-live-canvas .custom-collection-header h2',
        '.theme-builder-live-canvas .custom-collection-header h3',
        '.theme-builder-live-canvas .feature-page-header h1',
        '.theme-builder-live-canvas .feature-page-header h2',
        '.theme-builder-live-canvas .custom-tab-title',
        '.theme-builder-live-canvas .custom-user-heading'
    ].join(',')));
}

function applyThemeHeadingStyleV60(theme = {}, previewRoot = null) {
    const targetRoot = previewRoot || document;
    const enabled = !!theme.sectionHeadingBackgroundEnabledV59;
    const color = theme.sectionHeadingBackgroundColorV59 || theme.surface || '#ffffff';
    const padding = Math.max(2, Math.min(18, Number(theme.sectionHeadingBackgroundPaddingV59) || 6));

    if (!previewRoot) {
        document.documentElement.classList.remove('theme-section-heading-bg-v59');
        document.body.classList.toggle('theme-section-heading-bg-v60', enabled);
        document.body.style.setProperty('--section-heading-bg-v60', color);
        document.body.style.setProperty('--section-heading-pad-v60', `${padding}px`);
    } else {
        previewRoot.classList.remove('theme-section-heading-bg-v59');
        previewRoot.classList.toggle('theme-section-heading-bg-v60', enabled);
        previewRoot.style.setProperty('--section-heading-bg-v60', color);
        previewRoot.style.setProperty('--section-heading-pad-v60', `${padding}px`);
    }

    headingTargetsV60(targetRoot).forEach(node => {
        if (enabled) node.setAttribute('data-theme-heading-bg-v60', 'true');
        else node.removeAttribute('data-theme-heading-bg-v60');
    });
}

const applyThemeBeforeHeadingFixV60 = applyTheme;
applyTheme = async function(themeValue, opts = {}) {
    const result = await applyThemeBeforeHeadingFixV60(themeValue, opts);
    let theme = null;
    try { theme = resolveThemeCreativeDataV56?.(themeValue) || null; } catch {}
    applyThemeHeadingStyleV60(theme || {});
    return result;
};

const updateThemeBuilderPreviewBeforeV60 = updateThemeBuilderPreview;
updateThemeBuilderPreview = function(modal) {
    const result = updateThemeBuilderPreviewBeforeV60(modal);

    // Use the full saved artwork array. The preview renderer itself is cheap;
    // paging only applies to the editor cards, not the live canvas.
    forceThemeArtworkPreviewV60(modal);

    try {
        const draft = getThemeBuilderDraft(modal);
        const canvas = modal?.querySelector('.theme-builder-live-canvas');
        if (canvas) applyThemeHeadingStyleV60(draft, canvas);
    } catch {}

    return result;
};

// ------------------------------------------------------------
// 3) Reliable Theme Builder artwork preview.
// ------------------------------------------------------------
function forceThemeArtworkPreviewV60(modal) {
    if (!modal) return;

    const canvas = modal.querySelector('.theme-builder-live-canvas');
    if (!canvas) return;

    canvas.querySelectorAll(
        '.theme-builder-live-art-stage-v59, .theme-builder-live-art-stage-v60'
    ).forEach(node => node.remove());

    const assets = Array.isArray(modal._themeBackgroundSvgs)
        ? modal._themeBackgroundSvgs
        : [];

    if (!assets.length) return;

    let assignments = [];
    try {
        const draft = getThemeBuilderDraft(modal);
        assignments = getPreviewSvgAssignmentsV10(modal, draft) || [];
    } catch {}

    const stage = document.createElement('div');
    stage.className = 'theme-builder-live-art-stage theme-builder-live-art-stage-v60';

    assets.slice(0, 16).forEach((rawAsset, index) => {
        const assignment = assignments[index] || {};
        const asset = assignment.svg || rawAsset;
        const item = document.createElement('div');
        item.className =
            `theme-builder-live-art-item theme-svg-anim-${asset?.animation || 'float'}`;
        item.dataset.svgIndex = String(
            Number.isFinite(assignment.originalIndex)
                ? assignment.originalIndex
                : index
        );
        item.style.left = `${Number.isFinite(Number(assignment.left)) ? Number(assignment.left) : (8 + (index * 29) % 84)}%`;
        item.style.top = `${Number.isFinite(Number(assignment.top)) ? Number(assignment.top) : (10 + (index * 41) % 78)}%`;
        item.innerHTML = `
            <div class="theme-svg-motion-shell theme-image-motion-shell-v36">
                ${renderThemeImageAssetV36(asset)}
            </div>
        `;
        stage.appendChild(item);
    });

    // Put the artwork in the canvas background layer, then keep the cloned
    // page transparent enough for those decorations to remain visible.
    canvas.prepend(stage);
    applyAutomaticIntroBoppersV60(stage, modal._themeBackgroundSvgs, getThemeBuilderDraft(modal)?.introSvgBopMode || 'some');
}

// Dashboard preview artwork is always below dashboard UI components.
function normalizeDashboardArtworkLayerV60(modal) {
    modal?.querySelectorAll(
        '.theme-builder-dashboard-art-stage-v45, .theme-builder-dashboard-art-v40'
    ).forEach(stage => {
        stage.classList.add('theme-builder-dashboard-art-behind-v60');
    });
}

// ------------------------------------------------------------
// 4) Save & Apply must preserve a renamed current theme.
// ------------------------------------------------------------
async function saveThemeCopyAndApplyV60(modal, copyId) {
    if (!modal || !validateThemeBuilderBeforeSaveV25(modal)) return;

    ensureChosenThemeAccessoriesEnabledV46?.(modal);

    const copy = getThemeCopyV30(copyId);
    if (!copy) return;

    writeThemeCopyDraftV49(modal, copy);

    publishSharedThemeV40?.({
        id: copy.id,
        name: copy.name,
        theme: copy.theme,
        sourceThemeId: copy.sourceThemeId || ''
    });

    db.settings.theme = copyId;
    await saveDb();
    syncThemeCopyOptionsV30();

    window._forceThemeAccessoriesOnceV32 = true;
    await applyTheme(copyId, {persist:false});

    db.settings.theme = copyId;
    if (dailyThemeSelect) dailyThemeSelect.value = copyId;
    themePickerSelected = copyId;

    await saveDb();
    renderThemePicker();

    modal.classList.add('hidden');
    dailySettingsModal?.classList.add('hidden');

    showFeatureToast(`Saved and applied “${copy.name}”.`);
}

const installLogEditSaveButtonsBeforeRenameFixV60 = installLogEditSaveButtonsV49;
installLogEditSaveButtonsV49 = function(modal) {
    installLogEditSaveButtonsBeforeRenameFixV60(modal);

    const copyId = modal?.dataset?.themeBuilderEditingCopyV30 || '';
    const apply = modal?.querySelector('.theme-builder-save-apply-v49');
    if (copyId && apply) {
        apply.onclick = () => saveThemeCopyAndApplyV60(modal, copyId);
    }
};

// ------------------------------------------------------------
// 5) Quiz Settings wording/help and page-only extra practice.
// ------------------------------------------------------------
function polishQuizSettingsV60(modal = document.getElementById('quiz-settings-modal-v58')) {
    if (!modal) return;

    const optionStrong = modal.querySelector(
        '.quiz-transformation-toggle-v58'
    )?.closest('label')?.querySelector('strong');
    if (optionStrong) optionStrong.textContent = 'Field to Field Practice';

    const optionSmall = modal.querySelector(
        '.quiz-transformation-toggle-v58'
    )?.closest('label')?.querySelector('small');
    if (optionSmall) {
        optionSmall.remove();
    }

    const heading = modal.querySelector('.quiz-settings-section-heading-v58 > div');
    if (heading) {
        const strong = heading.querySelector('strong');
        if (strong) strong.textContent = 'Transformation Rules';

        let help = heading.querySelector('.quiz-transformation-help-v60');
        if (!help) {
            help = document.createElement('span');
            help.className = 'quiz-transformation-help-v60';
            help.textContent = '?';
            help.tabIndex = 0;
            help.setAttribute('role','button');
            help.setAttribute('aria-label','Field to Field Practice examples');
            strong?.insertAdjacentElement('afterend', help);

            const show = () => {
                document.getElementById('quiz-transformation-help-popover-v59')?.remove();
                document.getElementById('quiz-transformation-help-popover-v60')?.remove();
                const pop = document.createElement('div');
                pop.id = 'quiz-transformation-help-popover-v60';
                pop.className = 'quiz-transformation-help-popover-v60';
                pop.innerHTML = `
                    <strong>French example</strong>
                    <span>Category: French Verbs</span>
                    <span>Show: Infinitive → <b>parler</b></span>
                    <span>Ask for: Nous Present</span>
                    <span>Practice: <b>parler → ?</b> Answer: <b>parlons</b></span>
                    <strong>Chemistry example</strong>
                    <span>Category: Compounds</span>
                    <span>Show: Formula → <b>NaCl</b></span>
                    <span>Ask for: Compound Name</span>
                    <span>Practice: <b>NaCl → ?</b> Answer: <b>sodium chloride</b></span>
                `;
                document.body.appendChild(pop);
                const r = help.getBoundingClientRect();
                pop.style.left = `${Math.max(8, Math.min(window.innerWidth - 320, r.left))}px`;
                pop.style.top = `${Math.max(8, Math.min(window.innerHeight - 250, r.bottom + 5))}px`;
            };
            const hide = () => document.getElementById('quiz-transformation-help-popover-v60')?.remove();
            help.addEventListener('mouseenter', show);
            help.addEventListener('mouseleave', hide);
            help.addEventListener('focus', show);
            help.addEventListener('blur', hide);
        }
    }

    modal.querySelector('.quiz-transformation-help-v59')?.remove();

    const add = modal.querySelector('.quiz-add-transformation-v58');
    if (add) {
        add.innerHTML = '<i class="ph ph-plus"></i>';
        add.title = 'Add transformation rule';
        add.setAttribute('aria-label','Add transformation rule');
    }
}

const ensureQuizSettingsModalBeforeV60 = ensureQuizSettingsModalV58;
ensureQuizSettingsModalV58 = function() {
    const modal = ensureQuizSettingsModalBeforeV60();
    polishQuizSettingsV60(modal);
    return modal;
};

const ensureQuizExtraPracticeHostBeforeV60 = ensureQuizExtraPracticeHostV59;
ensureQuizExtraPracticeHostV59 = function() {
    const start = document.getElementById('start-quiz-btn');
    if (!start || !quizzesView) return null;

    let host = document.getElementById('quiz-extra-practice-host-v59');
    if (!host) {
        host = document.createElement('div');
        host.id = 'quiz-extra-practice-host-v59';
        host.className = 'quiz-extra-practice-host-v59';
    }

    // Always keep it INSIDE the Quizzes view so it cannot remain visible
    // when the user navigates elsewhere.
    if (host.parentElement !== quizzesView) {
        const firstVisualCard =
            quizzesView.querySelector(
                '.quiz-mode-grid, .quiz-mode-options, .quiz-mode-cards, .quiz-picker-grid, .quiz-grid'
            );
        if (firstVisualCard) quizzesView.insertBefore(host, firstVisualCard);
        else {
            const startParent = start.parentElement;
            if (startParent && startParent.parentElement === quizzesView) {
                startParent.insertAdjacentElement('afterend', host);
            } else {
                quizzesView.appendChild(host);
            }
        }
    }
    return host;
};

const renderQuizExtraPracticeSectionsBeforeV60 = renderQuizExtraPracticeSectionsV59;
renderQuizExtraPracticeSectionsV59 = function() {
    const result = renderQuizExtraPracticeSectionsBeforeV60();
    const host = document.getElementById('quiz-extra-practice-host-v59');
    if (host) {
        host.querySelectorAll('.quiz-extra-practice-card-v59 strong').forEach(strong => {
            if (/Conjugation|Form Transform/i.test(strong.textContent || '')) {
                strong.textContent = 'Field to Field Practice';
            }
        });
    }
    return result;
};

const switchViewBeforeQuizPracticeVisibilityV60 = switchView;
switchView = function(viewToShow) {
    const result = switchViewBeforeQuizPracticeVisibilityV60(viewToShow);
    const host = document.getElementById('quiz-extra-practice-host-v59');
    if (host) {
        host.classList.toggle(
            'view-hidden-v60',
            viewToShow !== quizzesView
        );
    }
    document.getElementById('quiz-transformation-help-popover-v60')?.remove();
    document.getElementById('quiz-transformation-help-popover-v59')?.remove();
    return result;
};

const openTransformationPracticeBeforeV60 = openTransformationPracticeV59;
openTransformationPracticeV59 = function() {
    openTransformationPracticeBeforeV60();
    const modal = document.getElementById('transformation-practice-modal-v59');
    const title = modal?.querySelector('.modal-header h2');
    if (title) title.textContent = 'Field to Field Practice';
};

// ------------------------------------------------------------
// 6) Sentence Builder: choose TTS language and equal-size audio/delete buttons.
// ------------------------------------------------------------
const renderKnowledgeSentenceBuilderBeforeAudioV60 = renderKnowledgeSentenceBuilderV53;
renderKnowledgeSentenceBuilderV53 = function(tab, component, content) {
    renderKnowledgeSentenceBuilderBeforeAudioV60(tab, component, content);

    if (!content) return;

    if (!component.sentenceAudioLangV60) {
        component.sentenceAudioLangV60 = db.settings.ttsLang || 'ko';
    }

    const controls = content.querySelector('.sentence-builder-save-controls-v56');
    if (controls && !controls.querySelector('.sentence-builder-audio-lang-v60')) {
        const label = document.createElement('label');
        label.className = 'sentence-builder-audio-picker-v60';
        label.innerHTML = `
            <span>Sentence audio</span>
            <select class="sentence-builder-audio-lang-v60">
                <option value="ko">Korean</option>
                <option value="fr">French</option>
                <option value="es">Spanish</option>
                <option value="en">English</option>
                <option value="de">German</option>
                <option value="it">Italian</option>
                <option value="ja">Japanese</option>
                <option value="zh">Chinese</option>
            </select>
        `;
        controls.insertBefore(label, controls.firstChild);
        const select = label.querySelector('select');
        select.value = component.sentenceAudioLangV60 || 'ko';
        select.addEventListener('change', () => {
            component.sentenceAudioLangV60 = select.value;
            saveDb();
        });
    }

    // Rebind saved audio buttons in capture phase so the selected/saved
    // language wins over the older default-language listener.
    content.querySelectorAll('.sentence-builder-saved-audio-v56').forEach(button => {
        const row = button.closest('[data-saved-sentence-id-v56]');
        const groupId = row?.dataset.groupIdV56;
        const itemId = row?.dataset.savedSentenceIdV56;
        const group = ensureSentenceGroupsV56(component).find(g => g.id === groupId);
        const item = group?.items?.find(entry => entry.id === itemId);
        button.dataset.sentenceAudioLangV60 =
            item?.audioLangV60 ||
            component.sentenceAudioLangV60 ||
            db.settings.ttsLang ||
            'ko';

        button.addEventListener('click', event => {
            event.preventDefault();
            event.stopImmediatePropagation();
            playTTSAudio(
                button.dataset.sentenceAudioV56 || '',
                button.dataset.sentenceAudioLangV60 || 'ko'
            );
        }, true);
    });

    // Ensure new saved sentences remember the currently selected voice locale.
    const saveButton = content.querySelector('.sentence-builder-save-sentence-v56');
    if (saveButton && !saveButton.dataset.audioLangCaptureV60) {
        saveButton.dataset.audioLangCaptureV60 = 'true';
        saveButton.addEventListener('click', () => {
            const groups = ensureSentenceGroupsV56(component);
            const group = groups.find(g => g.id === component.activeSentenceGroupV56) || groups[0];
            setTimeout(() => {
                const newest = group?.items?.[0];
                if (newest && !newest.audioLangV60) {
                    newest.audioLangV60 =
                        component.sentenceAudioLangV60 ||
                        db.settings.ttsLang ||
                        'ko';
                    saveDb();
                }
            }, 0);
        }, true);
    }
};

// ------------------------------------------------------------
// 7) Custom tabs: remove title-background chooser from edit mode and let
// users keep the soft component backdrop outside edit mode.
// ------------------------------------------------------------
const renderCustomTabViewBeforeBackdropV60 = renderCustomTabView;
renderCustomTabView = function(tabId) {
    const result = renderCustomTabViewBeforeBackdropV60(tabId);
    const tab = getCustomTab(tabId);
    const view = document.getElementById(`custom-tab-view-${tabId}`);
    if (view && tab) {
        view.classList.toggle('keep-component-backdrop-v60', !!tab.keepComponentBackdropV60);
        view.querySelectorAll('.custom-component-title-style').forEach(button => button.remove());
        normalizePageActionButtonSizeV60(view);
    }
    return result;
};

const openCustomTabSettingsModalBeforeBackdropV60 = openCustomTabSettingsModal;
openCustomTabSettingsModal = function(tabId) {
    openCustomTabSettingsModalBeforeBackdropV60(tabId);
    const tab = getCustomTab(tabId);
    const modal = document.getElementById('custom-tab-settings-modal');
    if (!tab || !modal) return;

    const nameSection = modal.querySelector('#custom-tab-settings-name')?.closest('.modal-section');
    if (nameSection && !modal.querySelector('#custom-tab-keep-backdrop-v60')) {
        const section = document.createElement('label');
        section.className = 'modal-section custom-tab-backdrop-setting-v60';
        section.innerHTML = `
            <span class="field-label">Component Background</span>
            <span class="feature-toggle-row">
                <input type="checkbox" id="custom-tab-keep-backdrop-v60" ${tab.keepComponentBackdropV60 ? 'checked' : ''}>
                <span>Keep the soft edit-mode component background outside edit mode</span>
            </span>
        `;
        nameSection.insertAdjacentElement('afterend', section);

        const checkbox = section.querySelector('input');
        checkbox.addEventListener('change', () => {
            tab.keepComponentBackdropV60 = checkbox.checked;
            saveDb();
            renderCustomTabView(tabId);
        });
    }
};

// ------------------------------------------------------------
// 8) Per-image music-bop override: Auto / Always / Never.
// ------------------------------------------------------------
function applyAutomaticIntroBoppersV60(stage, assets = [], mode = 'some') {
    if (!stage) return;

    const items = Array.from(
        stage.querySelectorAll('.theme-builder-live-art-item, .custom-theme-background-svg')
    );

    stage.classList.toggle('theme-svg-intro-bop-all', mode === 'all');

    const auto = [];
    const forced = [];

    items.forEach((item, displayIndex) => {
        item.classList.remove('theme-svg-intro-bop-selected');
        item.removeAttribute('data-auto-intro-bop');

        const sourceIndex = Number(item.dataset.svgIndex);
        const asset =
            assets?.[Number.isFinite(sourceIndex) ? sourceIndex : displayIndex] ||
            assets?.[displayIndex] ||
            {};
        const preference = String(asset.bopModeV60 || 'auto');

        if (preference === 'never') return;
        if (preference === 'always') {
            forced.push(item);
            return;
        }
        auto.push(item);
    });

    forced.forEach(item => {
        item.classList.add('theme-svg-intro-bop-selected');
        item.dataset.autoIntroBop = 'forced';
    });

    const autoSelected =
        mode === 'all'
            ? auto
            : chooseSpreadSvgBoppersV23(auto);

    autoSelected.forEach(item => {
        item.classList.add('theme-svg-intro-bop-selected');
        item.dataset.autoIntroBop = 'true';
    });
}

const applyAutomaticIntroBoppersBeforeV60 = applyAutomaticIntroBoppersV23;
applyAutomaticIntroBoppersV23 = function(stage, mode = 'some') {
    const modal = stage?.closest?.('#theme-builder-modal');
    let assets = null;

    if (modal) {
        assets = modal._themeBackgroundSvgs || [];
    } else {
        try {
            const active = resolveThemeCreativeDataV56?.(db.settings.theme);
            assets = active?.backgroundSvgs || [];
        } catch {}
    }

    applyAutomaticIntroBoppersV60(stage, assets || [], mode);
};

function installPerImageBopControlsV60(modal) {
    if (!modal) return;

    modal.querySelectorAll('.theme-builder-svg-card[data-svg-index], .theme-builder-svg-card').forEach(card => {
        const index = Number(card.dataset.svgIndex);
        if (!Number.isFinite(index)) return;
        const asset = modal._themeBackgroundSvgs?.[index];
        if (!asset) return;

        const options =
            card.querySelector('.theme-builder-svg-card-options-v10') ||
            card.querySelector('.theme-builder-svg-card-copy');

        if (!options || options.querySelector('.theme-builder-bop-mode-row-v60')) return;

        const row = document.createElement('label');
        row.className = 'theme-builder-svg-option-row theme-builder-bop-mode-row-v60';
        row.innerHTML = `
            <span>Bop with music</span>
            <select class="theme-builder-bop-mode-v60">
                <option value="auto">Auto</option>
                <option value="always">Always</option>
                <option value="never">Never</option>
            </select>
        `;
        const select = row.querySelector('select');
        select.value = asset.bopModeV60 || 'auto';
        select.addEventListener('change', event => {
            asset.bopModeV60 = event.target.value;
            updateThemeBuilderPreview(modal);
        });

        options.appendChild(row);
        card.querySelector('.theme-builder-svg-intro-bop-row')?.remove();
    });
}

const renderThemeBuilderSvgListBeforeBopV60 = renderThemeBuilderSvgListV2;
renderThemeBuilderSvgListV2 = function(modal) {
    const result = renderThemeBuilderSvgListBeforeBopV60(modal);
    installPerImageBopControlsV60(modal);
    return result;
};

// ------------------------------------------------------------
// 9) Interactive code backgrounds cannot capture the app pointer or create
// viewport overflow. Generated code still animates, but the app owns input.
// ------------------------------------------------------------
const ensureBackgroundDocumentBeforeSafetyV60 = ensureBackgroundDocumentV56;
ensureBackgroundDocumentV56 = function(code) {
    let doc = ensureBackgroundDocumentBeforeSafetyV60(code);
    if (!doc) return doc;

    const safetyStyle = `
        <style id="loggy-background-safety-v60">
            html,body{
                margin:0!important;
                width:100%!important;
                height:100%!important;
                max-width:100vw!important;
                max-height:100vh!important;
                overflow:hidden!important;
                overscroll-behavior:none!important;
                background:transparent!important;
            }
            body{position:relative!important;}
        </style>
        <script>
        (() => {
            addEventListener('message', event => {
                const data = event.data || {};
                if (!data.__loggyBackgroundPointerV60) return;
                const x = Number(data.x) || 0;
                const y = Number(data.y) || 0;
                const target = document.elementFromPoint(x, y) || document.body || document.documentElement;
                try {
                    const ev = new PointerEvent(data.type || 'pointermove', {
                        bubbles: true,
                        cancelable: false,
                        clientX: x,
                        clientY: y,
                        pointerType: data.pointerType || 'mouse',
                        buttons: Number(data.buttons) || 0
                    });
                    target.dispatchEvent(ev);
                } catch {}
            });
        })();
        <\/script>
    `;

    if (/<\/head>/i.test(doc)) {
        doc = doc.replace(/<\/head>/i, `${safetyStyle}</head>`);
    } else {
        doc = safetyStyle + doc;
    }
    return doc;
};

function relayBackgroundPointerV60(type, event) {
    document.querySelectorAll(
        '#custom-theme-code-background-v56, .theme-code-preview-frame-v56'
    ).forEach(frame => {
        try {
            frame.contentWindow?.postMessage({
                __loggyBackgroundPointerV60: true,
                type,
                x: event.clientX,
                y: event.clientY,
                pointerType: event.pointerType || 'mouse',
                buttons: event.buttons || 0
            }, '*');
        } catch {}
    });
}

if (!window._backgroundPointerRelayInstalledV60) {
    window._backgroundPointerRelayInstalledV60 = true;
    window.addEventListener('pointermove', event => relayBackgroundPointerV60('pointermove', event), {passive:true});
    window.addEventListener('pointerdown', event => relayBackgroundPointerV60('pointerdown', event), {passive:true});
    window.addEventListener('pointerup', event => relayBackgroundPointerV60('pointerup', event), {passive:true});
}

// ------------------------------------------------------------
// 10) Gradient UI: explicit None option; remove the old Solid Color button.
// ------------------------------------------------------------
function polishGradientNoneV60(modal) {
    const section = modal?.querySelector('.theme-builder-creative-background-v56');
    if (!section) return;

    section.querySelector('.theme-gradient-clear-v56')?.remove();

    const grid = section.querySelector('.theme-gradient-grid-v56');
    if (grid && !grid.querySelector('.theme-gradient-none-v60')) {
        const none = document.createElement('button');
        none.type = 'button';
        none.className = 'theme-gradient-swatch-v56 theme-gradient-none-v60';
        none.title = 'None';
        none.innerHTML = '<span>None</span>';
        none.addEventListener('click', () => {
            modal._themeGradientV56 = '';
            modal._themeGradientNameV56 = 'None';
            updateThemeBuilderPreview(modal);
            syncThemeCreativeBackgroundUiV56(modal);
            polishGradientNoneV60(modal);
        });
        grid.prepend(none);
    }

    const selected = !String(modal._themeGradientV56 || '').trim();
    grid?.querySelector('.theme-gradient-none-v60')?.classList.toggle('selected', selected);

    const label = section.querySelector('.theme-gradient-selected-v56');
    if (label && selected) label.textContent = 'None';
}

const ensureThemeCreativeBackgroundControlsBeforeNoneV60 = ensureThemeCreativeBackgroundControlsV56;
ensureThemeCreativeBackgroundControlsV56 = function(modal) {
    const section = ensureThemeCreativeBackgroundControlsBeforeNoneV60(modal);
    polishGradientNoneV60(modal);
    return section;
};

const syncThemeCreativeBackgroundUiBeforeNoneV60 = syncThemeCreativeBackgroundUiV56;
syncThemeCreativeBackgroundUiV56 = function(modal) {
    const result = syncThemeCreativeBackgroundUiBeforeNoneV60(modal);
    polishGradientNoneV60(modal);
    return result;
};

// ------------------------------------------------------------
// Final refresh hooks.
// ------------------------------------------------------------
const populateThemeBuilderBeforeV60 = populateThemeBuilder;
populateThemeBuilder = function(modal, theme) {
    populateThemeBuilderBeforeV60(modal, theme);
    renderThemeBuilderSvgListV2(modal);
    installPerImageBopControlsV60(modal);
    polishGradientNoneV60(modal);
    normalizeDashboardArtworkLayerV60(modal);
    requestAnimationFrame(() => {
        forceThemeArtworkPreviewV60(modal);
        normalizeDashboardArtworkLayerV60(modal);
    });
};

requestAnimationFrame(() => {
    normalizePageActionButtonSizeV60();
    renderQuizExtraPracticeSectionsV59?.();
    polishQuizSettingsV60(document.getElementById('quiz-settings-modal-v58'));
});


// ============================================================
// V61 — EXACT ACTION-BUTTON SIZING / PER-COMPONENT BACKDROP /
// CURSOR + CUSTOM-CODE CONTAINMENT / KB LOAD TEST / PREVIEW ART
// ============================================================


// ------------------------------------------------------------
// 1) EXACTLY MATCH THE KNOWLEDGE BASE + BUTTON SIZE.
// Re-sync whenever the KB + button becomes measurable.
// ------------------------------------------------------------

let pageActionReferenceSizeV61 = 54;

function readKnowledgePlusButtonSizeV61() {
    const reference =
        document.getElementById(
            'add-phrase-library-btn'
        );

    if (!reference) {
        return pageActionReferenceSizeV61;
    }

    const rect =
        reference.getBoundingClientRect();

    const style =
        getComputedStyle(
            reference
        );

    const width =
        rect.width ||
        parseFloat(style.width) ||
        0;

    const height =
        rect.height ||
        parseFloat(style.height) ||
        0;

    if (
        width >= 28 &&
        height >= 28
    ) {
        pageActionReferenceSizeV61 =
            Math.round(
                Math.max(
                    width,
                    height
                )
            );
    }

    return pageActionReferenceSizeV61;
}

function syncPageActionButtonsV61(
    root =
        document
) {
    const size =
        readKnowledgePlusButtonSizeV61();

    root
        .querySelectorAll(
            [
                '#open-quiz-settings-v58',
                '#open-daily-settings-btn',
                '#open-settings-btn'
            ].join(',')
        )
        .forEach(
            button => {
                button.classList.add(
                    'page-action-square-v61'
                );

                button.style
                    .setProperty(
                        '--page-action-size-v61',
                        `${size}px`
                    );
            }
        );
}

function installPageActionSizeObserverV61() {
    const reference =
        document.getElementById(
            'add-phrase-library-btn'
        );

    if (
        reference &&
        reference.dataset
            .actionSizeObserverV61 !==
            'true'
    ) {
        reference.dataset
            .actionSizeObserverV61 =
            'true';

        const observer =
            new ResizeObserver(
                () => {
                    readKnowledgePlusButtonSizeV61();
                    syncPageActionButtonsV61();
                }
            );

        observer.observe(
            reference
        );
    }

    syncPageActionButtonsV61();
}

window.addEventListener(
    'resize',
    installPageActionSizeObserverV61
);


// ------------------------------------------------------------
// 2) QUIZ SETTINGS GEAR MUST ALWAYS BE CLICKABLE.
// ------------------------------------------------------------

const ensureQuizSettingsButtonBeforeV61 =
    ensureQuizSettingsButtonV58;

ensureQuizSettingsButtonV58 =
    function() {
        ensureQuizSettingsButtonBeforeV61();

        const button =
            document.getElementById(
                'open-quiz-settings-v58'
            );

        if (button) {
            button.disabled =
                false;

            button.style
                .setProperty(
                    'pointer-events',
                    'auto',
                    'important'
                );

            button.style
                .setProperty(
                    'z-index',
                    '5000',
                    'important'
                );

            button.onclick =
                event => {
                    event.preventDefault();
                    event.stopPropagation();

                    openQuizSettingsV58();
                };
        }

        installPageActionSizeObserverV61();
    };


// ------------------------------------------------------------
// 3) PER-COMPONENT SOFT BACKDROP TOGGLE.
// Icon sits directly beside the pencil while editing the component.
// ------------------------------------------------------------

function applyComponentBackdropStateV61(
    tab,
    canvas
) {
    if (
        !tab ||
        !canvas
    ) {
        return;
    }

    canvas
        .querySelectorAll(
            '.custom-tab-component'
        )
        .forEach(
            wrapper => {
                const component =
                    (
                        tab.components ||
                        []
                    ).find(
                        item =>
                            item.id ===
                            wrapper.dataset
                                .componentId
                    );

                wrapper.classList.toggle(
                    'keep-component-backdrop-v61',
                    !!component
                        ?.keepBackdropV61
                );

                const controls =
                    wrapper.querySelector(
                        '.custom-component-controls'
                    );

                if (
                    !controls ||
                    !customTabEditMode
                ) {
                    return;
                }

                controls
                    .querySelector(
                        '.custom-component-title-style'
                    )
                    ?.remove();

                let toggle =
                    controls.querySelector(
                        '.custom-component-backdrop-toggle-v61'
                    );

                if (!toggle) {
                    toggle =
                        document.createElement(
                            'button'
                        );

                    toggle.type =
                        'button';

                    toggle.className =
                        'custom-component-backdrop-toggle-v61';

                    toggle.title =
                        'Keep this component background outside edit mode';

                    toggle.setAttribute(
                        'aria-label',
                        'Toggle persistent component background'
                    );

                    toggle.innerHTML =
                        '<i class="ph ph-square-half"></i>';

                    const edit =
                        controls.querySelector(
                            '.custom-component-edit'
                        );

                    if (edit) {
                        edit.insertAdjacentElement(
                            'afterend',
                            toggle
                        );
                    } else {
                        controls.prepend(
                            toggle
                        );
                    }

                    toggle.addEventListener(
                        'click',
                        event => {
                            event.preventDefault();
                            event.stopPropagation();

                            const currentTab =
                                getCustomTab(
                                    tab.id
                                );

                            const currentComponent =
                                currentTab
                                    ?.components
                                    ?.find(
                                        item =>
                                            item.id ===
                                            wrapper.dataset
                                                .componentId
                                    );

                            if (
                                !currentComponent
                            ) {
                                return;
                            }

                            currentComponent
                                .keepBackdropV61 =
                                !currentComponent
                                    .keepBackdropV61;

                            saveDb();

                            renderCustomTabView(
                                tab.id
                            );
                        }
                    );
                }

                toggle.classList.toggle(
                    'active',
                    !!component
                        ?.keepBackdropV61
                );
            }
        );
}

const renderCustomCanvasBeforeV61 =
    renderCustomCanvas;

renderCustomCanvas =
    function(
        tab,
        canvas
    ) {
        const result =
            renderCustomCanvasBeforeV61(
                tab,
                canvas
            );

        applyComponentBackdropStateV61(
            tab,
            canvas
        );

        return result;
    };

const openCustomTabSettingsModalBeforeV61 =
    openCustomTabSettingsModal;

openCustomTabSettingsModal =
    function(
        tabId
    ) {
        openCustomTabSettingsModalBeforeV61(
            tabId
        );

        document
            .querySelector(
                '#custom-tab-settings-modal .custom-tab-backdrop-setting-v60'
            )
            ?.remove();
    };


// ------------------------------------------------------------
// 4) CUSTOM BACKGROUND CODE: KEEP APP CURSOR STABLE + CONTAIN VIEWPORT.
// ------------------------------------------------------------

function syncCustomBackgroundViewportV61() {
    const active =
        document.body.classList
            .contains(
                'custom-code-background-active-v56'
            );

    document.documentElement
        .classList.toggle(
            'custom-code-background-viewport-v61',
            active
        );

    if (!active) {
        return;
    }

    const shouldScroll =
        document.documentElement
            .scrollHeight >
        window.innerHeight +
            4;

    document.documentElement
        .classList.toggle(
            'custom-code-needs-y-scroll-v61',
            shouldScroll
        );
}

const mountThemeCreativeBackgroundBeforeV61 =
    mountThemeCreativeBackgroundV56;

mountThemeCreativeBackgroundV56 =
    function(
        theme =
            {}
    ) {
        const result =
            mountThemeCreativeBackgroundBeforeV61(
                theme
            );

        requestAnimationFrame(
            () => {
                syncCustomBackgroundViewportV61();
                applyCursorChoice?.();
            }
        );

        return result;
    };

const removeThemeCreativeBackgroundBeforeV61 =
    removeThemeCreativeBackgroundV56;

removeThemeCreativeBackgroundV56 =
    function() {
        const result =
            removeThemeCreativeBackgroundBeforeV61();

        document.documentElement
            .classList.remove(
                'custom-code-background-viewport-v61',
                'custom-code-needs-y-scroll-v61'
            );

        requestAnimationFrame(
            () =>
                applyCursorChoice?.()
        );

        return result;
    };

window.addEventListener(
    'resize',
    syncCustomBackgroundViewportV61
);


// ------------------------------------------------------------
// 5) HARDEN THE GENERATED-BACKGROUND PROMPT.
// ------------------------------------------------------------

const themeBuilderBackgroundPromptBeforeV61 =
    themeBuilderBackgroundPromptV56;

themeBuilderBackgroundPromptV56 =
    function(
        modal
    ) {
        return (
            themeBuilderBackgroundPromptBeforeV61(
                modal
            ) +
            `

Additional compatibility rules for this app:
- html and body MUST use width:100%; height:100%; margin:0; overflow:hidden; max-width:100vw; max-height:100vh.
- Never make any element wider than 100vw or taller than 100vh.
- Never use width:100vw on an element that also has margins, borders, translated positioning, or extra horizontal padding.
- Never translate, scale, rotate, or otherwise transform html or body.
- Keep every decorative element clipped inside one fixed inset:0 scene container with overflow:hidden.
- Do not create horizontal or vertical page scrollbars.
- Do not call scrollTo, scrollBy, scrollIntoView, focus(), requestFullscreen(), or pointer-lock APIs.
- Do not set cursor:none and do not draw a replacement mouse cursor.
- Never move the real browser/app cursor.
- Pointer interaction must only animate decorative objects; it must not alter layout dimensions or viewport size.
- Prefer transform:translate3d() on small child decorations rather than changing document/body position.
- All animations must remain within the fixed scene bounds.
- The app UI sits above this background, so never create app-like clickable controls in the background.`
        );
    };


// ------------------------------------------------------------
// 6) DEVELOPER MODE: 500-DAY + 500-ITEM STRESS PREVIEWS, SESSION ONLY.
// ------------------------------------------------------------

const DEVELOPER_KB_PREVIEW_COUNT_V247 = 500;

let developerPreviewKnowledge500V247 =
    sessionStorage.getItem(
        'developer-preview-knowledge-500-v247'
    ) === 'true' ||
    sessionStorage.getItem(
        'developer-preview-knowledge-70-v61'
    ) === 'true';

function fakeKnowledgeItemTitleV247(
    category,
    index
) {
    const number = String(index + 1).padStart(3, '0');
    const safeCategory = String(category || 'Category');

    // Deliberately cycle through different content lengths so Developer Mode
    // tests wrapping, dense cards, tall cards, and long labels instead of 500
    // identical short strings.
    switch (index % 6) {
        case 0:
            return `${safeCategory} ${number}`;
        case 1:
            return `Preview ${safeCategory} Item ${number}`;
        case 2:
            return `${safeCategory} ${number} · medium-length study item for layout testing`;
        case 3:
            return `${safeCategory} ${number} · a longer Knowledge Base preview item that checks wrapping across cards and polaroid labels`;
        case 4:
            return `${safeCategory} ${number} · long-form preview content with several words, punctuation, and extra descriptive text so crowded category layouts can be stress-tested realistically`;
        default:
            return `${safeCategory} ${number} · extra-long developer preview item used to test very tall labels, wrapping, overflow behavior, category switching, search filtering, and scrolling performance when a Knowledge Base contains hundreds of mixed-length entries`;
    }
}

let developerKbPreviewEpochV620=0;
function setDeveloperKnowledgeFastLayoutV643(grid, enabled) {
    if (!grid) return;
    grid.classList.toggle('kb-developer-fast-grid-v643', !!enabled);
    if (!enabled) {
        grid.style.removeProperty('height');
        grid.querySelectorAll(':scope > .phrase-card, :scope > .polaroid-card').forEach(card => {
            for (const prop of ['position','left','top','width','max-width','min-width','visibility']) {
                card.style.removeProperty(prop);
            }
        });
    }
}

function appendDeveloperKnowledgeItemsV247(filterText = '') {
    const epoch=++developerKbPreviewEpochV620;
    const grid=document.getElementById('phrases-library-grid');
    if(!grid)return;

    grid.querySelectorAll('[data-developer-kb-preview-v247], [data-developer-kb-preview-v61]').forEach(node=>node.remove());

    const isPolaroid=db.settings.libraryView==='polaroid';
    const isAll=String(typeof libraryFilter!=='undefined' ? libraryFilter : 'all')==='all';
    const useFastAllLayout=developerPreviewKnowledge500V247 && isAll && !isPolaroid;
    setDeveloperKnowledgeFastLayoutV643(grid,useFastAllLayout);

    if(!developerPreviewKnowledge500V247){
        document.dispatchEvent(new Event('kb-preview-complete-v643'));
        return;
    }

    const query=String(filterText||'').trim().toLowerCase();
    const categories=(db.settings.categories||[]).filter(category=>isAll||libraryFilter===category);
    let categoryIndex=0,itemIndex=0;

    const schedule = callback => {
        if ('requestIdleCallback' in window) {
            requestIdleCallback(callback,{timeout:45});
        } else {
            setTimeout(() => callback({timeRemaining:()=>8,didTimeout:true}),0);
        }
    };

    function appendBatch(deadline){
        if(epoch!==developerKbPreviewEpochV620 || !grid.isConnected || !developerPreviewKnowledge500V247)return;
        const fragment=document.createDocumentFragment();
        const started=performance.now();
        let count=0;

        while(categoryIndex<categories.length && count<90){
            // Keep each task short enough that scrolling/tab clicks can run.
            if(count>0 && performance.now()-started>7 && !deadline?.didTimeout) break;
            if(count>0 && typeof deadline?.timeRemaining==='function' && deadline.timeRemaining()<2) break;

            const category=categories[categoryIndex];
            const title=fakeKnowledgeItemTitleV247(category,itemIndex++);
            if(itemIndex>=DEVELOPER_KB_PREVIEW_COUNT_V247){itemIndex=0;categoryIndex++;}
            if(query && !title.toLowerCase().includes(query))continue;

            const card=document.createElement('div');
            card.dataset.developerKbPreviewV247='true';
            card.className=(isPolaroid?'polaroid-card':'phrase-card')+' developer-kb-preview-card-v61 developer-kb-preview-card-v247';
            card.innerHTML=isPolaroid
                ? `<div class="polaroid-video developer-kb-preview-media-v61"><i class="ph ph-test-tube"></i></div><div class="polaroid-label"><span class="chip-text">${escapeKnowledgeHtml(title)}</span></div>`
                : `<span class="chip-text">${escapeKnowledgeHtml(title)}</span>`;
            card.title=`Developer preview · ${category}`;
            fragment.appendChild(card);
            count++;
        }

        if(fragment.childNodes.length) grid.appendChild(fragment);

        if(categoryIndex<categories.length){
            schedule(appendBatch);
            return;
        }

        // One completion signal only. Older code repacked the entire growing
        // collection after every 100 cards, which caused repeated freezes and
        // the disappear/reappear flash. Developer All view now stays on the
        // browser's fast CSS grid for the whole stress preview.
        document.dispatchEvent(new Event('kb-preview-complete-v643'));
        requestAnimationFrame(syncKnowledgeLibraryViewportV61);
    }

    // Allow the real KB page and toggle state to paint first.
    schedule(appendBatch);
}

const renderPhrasesLibraryBeforeDevLoadV247 = renderPhrasesLibrary;
renderPhrasesLibrary = function(filterText = '') {
    const result = renderPhrasesLibraryBeforeDevLoadV247(filterText);
    appendDeveloperKnowledgeItemsV247(filterText);
    requestAnimationFrame(syncKnowledgeLibraryViewportV61);
    return result;
};

function upgradeDeveloperDaysPreviewV247(modal) {
    const toggle = modal?.querySelector('#developer-preview-100-days');
    const option = toggle?.closest('.developer-mode-option');
    if (!option) return;

    const title = option.querySelector('strong');
    const description = option.querySelector('p');
    if (title) title.textContent = 'Preview 500 Days';
    if (description) {
        description.textContent =
            'Show at least 500 numbered days on the Logs page so you can stress-test pagination, layouts, scrolling, and themes. Nothing is saved.';
    }
}

// Existing logs use a copied older template.js where the Developer Mode limit
// is still hard-coded to 100. Temporarily add empty visual-only day records
// while initGrid() renders so those old logs also preview all 500 days. The
// temporary records are removed immediately afterward and are never saved.
if (!window.__developer500GridWrappedV247 && typeof initGrid === 'function') {
    window.__developer500GridWrappedV247 = true;
    const initGridBeforeDeveloper500V247 = initGrid;
    initGrid = function initGridDeveloper500V247(...args) {
        if (!developerPreview100Days || !db?.days) {
            return initGridBeforeDeveloper500V247.apply(this, args);
        }

        const inserted = new Map();
        for (let day = 1; day <= 500; day++) {
            if (!Object.prototype.hasOwnProperty.call(db.days, day)) {
                const temporaryDay = {};
                db.days[day] = temporaryDay;
                inserted.set(day, temporaryDay);
            }
        }

        try {
            return initGridBeforeDeveloper500V247.apply(this, args);
        } finally {
            inserted.forEach((temporaryDay, day) => {
                if (db.days[day] === temporaryDay) delete db.days[day];
            });
        }
    };
}

function injectDeveloperKnowledgeToggleV247(modal) {
    if (!modal) return;

    upgradeDeveloperDaysPreviewV247(modal);

    if (modal.querySelector('#developer-preview-knowledge-500-v247')) return;

    // Remove the prior V61 control if an old copied bundle already inserted it.
    modal
        .querySelector('#developer-preview-knowledge-70-v61')
        ?.closest('.developer-mode-option')
        ?.remove();

    const existing = modal
        .querySelector('#developer-preview-100-days')
        ?.closest('.developer-mode-option');

    const option = document.createElement('div');
    option.className = 'developer-mode-option';
    option.innerHTML = `
        <div>
            <strong>Preview 500 Knowledge Base Items Per Category</strong>
            <p>
                Adds 500 temporary visual-only Knowledge Base cards of mixed text lengths to every category so you can stress-test wrapping, scrolling, category switching, search, and themes. Nothing is saved.
            </p>
        </div>
        <label class="developer-toggle">
            <input
                type="checkbox"
                id="developer-preview-knowledge-500-v247"
                ${developerPreviewKnowledge500V247 ? 'checked' : ''}
            >
            <span class="developer-toggle-slider"></span>
        </label>
    `;

    if (existing) {
        existing.insertAdjacentElement('afterend', option);
    } else {
        modal
            .querySelector('.developer-mode-actions')
            ?.insertAdjacentElement('beforebegin', option);
    }

    option
        .querySelector('#developer-preview-knowledge-500-v247')
        .addEventListener('change', event => {
            developerPreviewKnowledge500V247 = event.target.checked;
            sessionStorage.setItem(
                'developer-preview-knowledge-500-v247',
                developerPreviewKnowledge500V247 ? 'true' : 'false'
            );
            // Retire the old session flag so it cannot fight the new toggle.
            sessionStorage.removeItem('developer-preview-knowledge-70-v61');
            renderPhrasesLibrary(
                document.getElementById('phrases-search-bar')?.value || ''
            );
        });
}

const ensureDeveloperModeModalBeforeV247 = ensureDeveloperModeModal;
ensureDeveloperModeModal = function() {
    ensureDeveloperModeModalBeforeV247();
    injectDeveloperKnowledgeToggleV247(
        document.getElementById('developer-mode-modal')
    );
};

const openDeveloperModeBeforeV247 = openDeveloperMode;
openDeveloperMode = function() {
    ensureDeveloperModeModal();
    const toggle = document.getElementById('developer-preview-knowledge-500-v247');
    if (toggle) toggle.checked = developerPreviewKnowledge500V247;
    return openDeveloperModeBeforeV247();
};


// ------------------------------------------------------------
// 7) KB GRID + CUSTOM TABS GET THEIR OWN HIDDEN-SCROLLBAR SCROLL AREA.
// ------------------------------------------------------------

function syncKnowledgeLibraryViewportV61() {
    const view =
        document.getElementById(
            'phrases-library-view'
        );

    const grid =
        document.getElementById(
            'phrases-library-grid'
        );

    if (
        !view ||
        !grid ||
        !view.classList.contains(
            'active'
        )
    ) {
        return;
    }

    const rect =
        grid.getBoundingClientRect();

    const available =
        Math.max(
            180,
            Math.floor(
                window.innerHeight -
                rect.top -
                22
            )
        );

    grid.style
        .setProperty(
            '--kb-library-viewport-height-v61',
            `${available}px`
        );
}

window.addEventListener(
    'resize',
    syncKnowledgeLibraryViewportV61
);

const switchViewBeforeScrollAreasV61 =
    switchView;

switchView =
    function(
        viewToShow
    ) {
        const result =
            switchViewBeforeScrollAreasV61(
                viewToShow
            );

        requestAnimationFrame(
            () => {
                syncKnowledgeLibraryViewportV61();
                syncCustomBackgroundViewportV61();

                if (
                    viewToShow ===
                    phrasesLibraryView
                ) {
                    installPageActionSizeObserverV61();
                }
            }
        );

        return result;
    };


// ------------------------------------------------------------
// 8) THEME BUILDER ARTWORK PREVIEW — RENDER INSIDE THE REAL PAGE,
// BEHIND COMPONENTS, WITH THE SAME MOTION SHELL + BOP CLASSES.
// ------------------------------------------------------------

function renderThemeArtworkPreviewV61(
    modal
) {
    if (!modal) {
        return;
    }

    const canvas =
        modal.querySelector(
            '.theme-builder-live-canvas'
        );

    if (!canvas) {
        return;
    }

    const dashboard =
        modal.querySelector(
            '.theme-builder-dashboard-preview-v45'
        );

    if (
        dashboard &&
        !dashboard.classList.contains(
            'hidden'
        )
    ) {
        normalizeDashboardArtworkLayerV60?.(
            modal
        );

        return;
    }

    const page =
        canvas.querySelector(
            '.theme-builder-live-page'
        );

    if (!page) {
        return;
    }

    page
        .querySelectorAll(
            '.theme-builder-live-art-stage-v61'
        )
        .forEach(
            node =>
                node.remove()
        );

    canvas
        .querySelectorAll(
            ':scope > .theme-builder-live-art-stage-v59, :scope > .theme-builder-live-art-stage-v60'
        )
        .forEach(
            node =>
                node.remove()
        );

    const assets =
        Array.isArray(
            modal._themeBackgroundSvgs
        )
            ? modal._themeBackgroundSvgs
            : [];

    if (!assets.length) {
        return;
    }

    const draft =
        getThemeBuilderDraft(
            modal
        );

    let assignments =
        [];

    try {
        assignments =
            getPreviewSvgAssignmentsV10(
                modal,
                draft
            ) ||
            [];
    } catch {}

    const stage =
        document.createElement(
            'div'
        );

    stage.className =
        'theme-builder-live-art-stage theme-svg-effects-stage-v10 theme-builder-live-art-stage-v61';

    const maxPreview =
        Math.min(
            24,
            assets.length
        );

    for (
        let index =
            0;
        index <
            maxPreview;
        index++
    ) {
        const assignment =
            assignments.find(
                item =>
                    Number(
                        item.originalIndex
                    ) ===
                    index
            ) ||
            assignments[index] ||
            {};

        const rawAsset =
            assignment.svg ||
            assets[index];

        const asset =
            ensureSvgAdvancedDefaultsV10(
                rawAsset
            );

        if (!asset) {
            continue;
        }

        const item =
            document.createElement(
                'div'
            );

        item.className =
            `theme-builder-live-art-item theme-svg-anim-${asset.animation || 'float'}`;

        item.dataset.svgIndex =
            String(
                index
            );

        item.style.left =
            `${
                Number.isFinite(
                    Number(
                        assignment.left
                    )
                )
                    ? Number(
                        assignment.left
                    )
                    : 8 +
                        (
                            index *
                            29
                        ) %
                        84
            }%`;

        item.style.top =
            `${
                Number.isFinite(
                    Number(
                        assignment.top
                    )
                )
                    ? Number(
                        assignment.top
                    )
                    : 10 +
                        (
                            index *
                            41
                        ) %
                        78
            }%`;

        item.style
            .setProperty(
                '--theme-svg-delay',
                `${(index % 13) * -0.41}s`
            );

        item.innerHTML = `
            <div class="theme-svg-motion-shell theme-image-motion-shell-v36">
                ${renderThemeImageAssetV36(
                    asset
                )}
            </div>
        `;

        item
            .querySelectorAll(
                'img'
            )
            .forEach(
                image => {
                    image.loading =
                        'eager';

                    image.decoding =
                        'async';
                }
            );

        stage.appendChild(
            item
        );
    }

    page.style
        .setProperty(
            'background-color',
            'transparent',
            'important'
        );

    page.style
        .setProperty(
            'background-image',
            'none',
            'important'
        );

    page.prepend(
        stage
    );

    applyAutomaticIntroBoppersV60(
        stage,
        assets,
        draft.introSvgBopMode ||
        'some'
    );

    if (
        draft.introSvgBounceEnabled
    ) {
        stage.classList.add(
            'theme-svg-intro-bop-enabled'
        );
    }
}

const updateThemeBuilderPreviewBeforeArtV61 =
    updateThemeBuilderPreview;

updateThemeBuilderPreview =
    function(
        modal
    ) {
        const result =
            updateThemeBuilderPreviewBeforeArtV61(
                modal
            );

        requestAnimationFrame(
            () => {
                renderThemeArtworkPreviewV61(
                    modal
                );

                installPerImageBopControlsV60?.(
                    modal
                );
            }
        );

        return result;
    };

const rebuildActualThemeBuilderPreviewBeforeArtV61 =
    rebuildActualThemeBuilderPreviewV5;

rebuildActualThemeBuilderPreviewV5 =
    function(
        modal
    ) {
        const result =
            rebuildActualThemeBuilderPreviewBeforeArtV61(
                modal
            );

        requestAnimationFrame(
            () => {
                renderThemeArtworkPreviewV61(
                    modal
                );

                normalizeDashboardArtworkLayerV60?.(
                    modal
                );
            }
        );

        return result;
    };

const populateThemeBuilderBeforeArtV61 =
    populateThemeBuilder;

populateThemeBuilder =
    function(
        modal,
        theme
    ) {
        const result =
            populateThemeBuilderBeforeArtV61(
                modal,
                theme
            );

        requestAnimationFrame(
            () => {
                renderThemeArtworkPreviewV61(
                    modal
                );

                installPerImageBopControlsV60?.(
                    modal
                );

                polishGradientNoneV60?.(
                    modal
                );
            }
        );

        return result;
    };


// ------------------------------------------------------------
// FINAL INITIALIZATION.
// ------------------------------------------------------------

requestAnimationFrame(
    () => {
        installPageActionSizeObserverV61();
        syncKnowledgeLibraryViewportV61();
        syncCustomBackgroundViewportV61();

        const developerModal =
            document.getElementById(
                'developer-mode-modal'
            );

        if (developerModal) {
            injectDeveloperKnowledgeToggleV61(
                developerModal
            );
        }
    }
);



// ============================================================
// V62 — IMAGE PAGING/HYDRATION / HEADING PREVIEW / CENTERED PAGES
// ============================================================


// ------------------------------------------------------------
// 1) The component-backdrop button gets an obvious selected underline.
// ------------------------------------------------------------

function refreshComponentBackdropToggleV62(
    toggle,
    selected
) {
    if (!toggle) {
        return;
    }

    toggle.classList.toggle(
        'active',
        !!selected
    );

    toggle.setAttribute(
        'aria-pressed',
        selected
            ? 'true'
            : 'false'
    );
}


// ------------------------------------------------------------
// 2) Match the actual + icon size as well as its button size.
// ------------------------------------------------------------

let pageActionIconSizeV62 =
    32;

function readKnowledgePlusIconSizeV62() {
    const icon =
        document.querySelector(
            '#add-phrase-library-btn i'
        );

    if (!icon) {
        return pageActionIconSizeV62;
    }

    const style =
        getComputedStyle(
            icon
        );

    const size =
        parseFloat(
            style.fontSize
        );

    if (
        Number.isFinite(
            size
        ) &&
        size >=
            12 &&
        size <=
            40
    ) {
        pageActionIconSizeV62 =
            size;
    }

    return pageActionIconSizeV62;
}

function syncPageActionIconSizeV62(
    root =
        document
) {
    const size =
        readKnowledgePlusIconSizeV62();

    root
        .querySelectorAll(
            [
                '#open-quiz-settings-v58 i',
                '#open-daily-settings-btn i',
                '#open-settings-btn i'
            ].join(',')
        )
        .forEach(
            icon => {
                icon.style
                    .setProperty(
                        '--page-action-icon-size-v62',
                        `${size}px`
                    );
            }
        );
}

const syncPageActionButtonsBeforeIconV62 =
    syncPageActionButtonsV61;

syncPageActionButtonsV61 =
    function(
        root =
            document
    ) {
        const result =
            syncPageActionButtonsBeforeIconV62(
                root
            );

        syncPageActionIconSizeV62(
            root
        );

        return result;
    };


// ------------------------------------------------------------
// 3) FAST THEME IMAGE LIST:
// Immediate gray skeleton cards, then hydrate only the visible page.
// "Show more" is authoritative and cannot be swallowed by card handlers.
// ------------------------------------------------------------

function themeImagePageSizeV62() {
    return 18;
}

function themeImageRenderLimitV62(
    modal,
    total
) {
    const pageSize =
        themeImagePageSizeV62();

    const current =
        Number(
            modal?._themeImageRenderLimitV62
        );

    const limit =
        Number.isFinite(
            current
        )
            ? current
            : pageSize;

    return Math.max(
        pageSize,
        Math.min(
            total,
            limit
        )
    );
}

function renderThemeImageSkeletonsV62(
    modal
) {
    const host =
        modal?.querySelector(
            '.theme-builder-svg-list'
        );

    if (!host) {
        return;
    }

    const all =
        Array.isArray(
            modal._themeBackgroundSvgs
        )
            ? modal._themeBackgroundSvgs
            : [];

    const pageSize =
        themeImagePageSizeV62();

    const limit =
        themeImageRenderLimitV62(
            modal,
            all.length
        );

    host.innerHTML =
        '';

    if (!all.length) {
        host.innerHTML = `
            <button
                type="button"
                class="theme-builder-svg-empty theme-builder-svg-add-empty"
            >
                <i class="ph ph-image"></i>
                <strong>No images uploaded yet</strong>
                <span>Click here or “Add Artwork” to choose some.</span>
            </button>
        `;

        host
            .querySelector(
                '.theme-builder-svg-add-empty'
            )
            ?.addEventListener(
                'click',
                () =>
                    modal
                        .querySelector(
                            '.theme-builder-svg-file'
                        )
                        ?.click()
            );

        return;
    }

    all
        .slice(
            0,
            limit
        )
        .forEach(
            (
                asset,
                index
            ) => {
                const card =
                    document.createElement(
                        'article'
                    );

                card.className =
                    'theme-builder-svg-card theme-builder-image-skeleton-v62';

                card.dataset.svgIndex =
                    String(
                        index
                    );

                card.innerHTML = `
                    <div class="theme-builder-svg-card-preview theme-builder-image-placeholder-v62">
                        <i class="ph ph-image"></i>
                    </div>

                    <div class="theme-builder-svg-card-copy">
                        <strong>
                            ${escapeCustomHtml(
                                asset?.name ||
                                `Image ${index + 1}`
                            )}
                        </strong>

                        <small>
                            Loading preview…
                        </small>
                    </div>
                `;

                host.appendChild(
                    card
                );
            }
        );

    appendThemeImagePagingCardsV62(
        modal,
        host,
        all,
        limit,
        pageSize
    );
}

function appendThemeImagePagingCardsV62(
    modal,
    host,
    all,
    limit,
    pageSize =
        themeImagePageSizeV62()
) {
    host
        .querySelector(
            '.theme-builder-image-load-more-v62'
        )
        ?.remove();

    host
        .querySelector(
            '.theme-builder-svg-add-card'
        )
        ?.remove();

    if (
        all.length >
        limit
    ) {
        const more =
            document.createElement(
                'button'
            );

        more.type =
            'button';

        more.className =
            'theme-builder-svg-card theme-builder-image-load-more-v62';

        more.innerHTML = `
            <i class="ph ph-caret-down"></i>

            <strong>
                Show ${Math.min(
                    pageSize,
                    all.length -
                    limit
                )} more
            </strong>

            <small>
                ${limit} of ${all.length} loaded
            </small>
        `;

        const load =
            event => {
                event.preventDefault();
                event.stopPropagation();
                event.stopImmediatePropagation();

                modal._themeImageRenderLimitV62 =
                    Math.min(
                        all.length,
                        limit +
                        pageSize
                    );

                renderThemeBuilderSvgListV2(
                    modal
                );
            };

        more.addEventListener(
            'pointerdown',
            event => {
                event.stopPropagation();
            },
            true
        );

        more.addEventListener(
            'click',
            load,
            true
        );

        host.appendChild(
            more
        );
    }

    const add =
        document.createElement(
            'button'
        );

    add.type =
        'button';

    add.className =
        'theme-builder-svg-card theme-builder-svg-add-card';

    add.innerHTML = `
        <i class="ph ph-plus"></i>
        <strong>Add Artwork</strong>
    `;

    add.addEventListener(
        'click',
        event => {
            event.preventDefault();
            event.stopPropagation();

            modal
                .querySelector(
                    '.theme-builder-svg-file'
                )
                ?.click();
        }
    );

    host.appendChild(
        add
    );
}

function markThemeImageCardLoadingV62(
    card
) {
    if (!card) {
        return;
    }

    const image =
        card.querySelector(
            '.theme-builder-svg-card-preview img'
        );

    if (!image) {
        card.classList.add(
            'theme-builder-image-ready-v62'
        );

        return;
    }

    card.classList.add(
        'theme-builder-image-hydrating-v62'
    );

    image.loading =
        'lazy';

    image.decoding =
        'async';

    const ready =
        () => {
            card.classList.remove(
                'theme-builder-image-hydrating-v62'
            );

            card.classList.add(
                'theme-builder-image-ready-v62'
            );
        };

    if (
        image.complete &&
        image.naturalWidth >
            0
    ) {
        ready();
    } else {
        image.addEventListener(
            'load',
            ready,
            {
                once:
                    true
            }
        );

        image.addEventListener(
            'error',
            ready,
            {
                once:
                    true
            }
        );
    }
}

function hydrateThemeImageCardsV62(
    modal,
    token
) {
    if (
        !modal ||
        modal._themeImageHydrateTokenV62 !==
            token
    ) {
        return;
    }

    const all =
        Array.isArray(
            modal._themeBackgroundSvgs
        )
            ? modal._themeBackgroundSvgs
            : [];

    const limit =
        themeImageRenderLimitV62(
            modal,
            all.length
        );

    const visible =
        all.slice(
            0,
            limit
        );

    const full =
        modal._themeBackgroundSvgs;

    modal._themeBackgroundSvgs =
        visible;

    try {
        renderThemeBuilderSvgListBeforePagingV59(
            modal
        );
    } finally {
        modal._themeBackgroundSvgs =
            full;
    }

    if (
        modal._themeImageHydrateTokenV62 !==
        token
    ) {
        return;
    }

    const host =
        modal.querySelector(
            '.theme-builder-svg-list'
        );

    if (!host) {
        return;
    }

    host
        .querySelectorAll(
            '.theme-builder-svg-card[data-svg-index]'
        )
        .forEach(
            card => {
                markThemeImageCardLoadingV62(
                    card
                );
            }
        );

    appendThemeImagePagingCardsV62(
        modal,
        host,
        all,
        limit
    );

    const count =
        modal.querySelector(
            '.theme-builder-svg-count'
        );

    if (count) {
        count.textContent =
            `${all.length} image${
                all.length ===
                1
                    ? ''
                    : 's'
            }`;
    }

    installPerImageBopControlsV60?.(
        modal
    );

    styleThemeImageUploadButtonV46?.(
        modal
    );
}

renderThemeBuilderSvgListV2 =
    function(
        modal
    ) {
        if (!modal) {
            return;
        }

        const all =
            Array.isArray(
                modal._themeBackgroundSvgs
            )
                ? modal._themeBackgroundSvgs
                : [];

        if (
            !Number.isFinite(
                Number(
                    modal._themeImageRenderLimitV62
                )
            )
        ) {
            modal._themeImageRenderLimitV62 =
                themeImagePageSizeV62();
        }

        const count =
            modal.querySelector(
                '.theme-builder-svg-count'
            );

        if (count) {
            count.textContent =
                `${all.length} image${
                    all.length ===
                    1
                        ? ''
                        : 's'
                }`;
        }

        renderThemeImageSkeletonsV62(
            modal
        );

        const token =
            (
                Number(
                    modal._themeImageHydrateTokenV62
                ) ||
                0
            ) +
            1;

        modal._themeImageHydrateTokenV62 =
            token;

        const hydrate =
            () =>
                hydrateThemeImageCardsV62(
                    modal,
                    token
                );

        if (
            'requestIdleCallback' in
            window
        ) {
            requestIdleCallback(
                hydrate,
                {
                    timeout:
                        180
                }
            );
        } else {
            setTimeout(
                hydrate,
                16
            );
        }
    };


// Preserve the expanded page count while the SAME theme is being refreshed.
const populateThemeBuilderBeforePagingV62 =
    populateThemeBuilder;

populateThemeBuilder =
    function(
        modal,
        theme
    ) {
        const previousLimit =
            Number(
                modal
                    ?._themeImageRenderLimitV62
            );

        const previousKey =
            String(
                modal
                    ?._themeImagePagingKeyV62 ||
                ''
            );

        const nextKey =
            String(
                theme?.id ||
                theme?.name ||
                modal
                    ?.dataset
                    ?.themeBuilderEditingCopyV30 ||
                modal
                    ?.dataset
                    ?.themeBuilderEditingThemeV25 ||
                'new-theme'
            );

        const sameTheme =
            previousKey ===
            nextKey;

        const result =
            populateThemeBuilderBeforePagingV62(
                modal,
                theme
            );

        modal._themeImagePagingKeyV62 =
            nextKey;

        modal._themeImageRenderLimitV62 =
            sameTheme &&
            Number.isFinite(
                previousLimit
            )
                ? previousLimit
                : themeImagePageSizeV62();

        renderThemeBuilderSvgListV2(
            modal
        );

        return result;
    };


// ------------------------------------------------------------
// 4) Heading background preview is applied INLINE to the cloned page.
// This reflects color + padding immediately and cannot be lost to preview
// rebuild ordering.
// ------------------------------------------------------------

function themePreviewHeadingNodesV62(
    modal
) {
    const page =
        modal?.querySelector(
            '.theme-builder-live-page'
        );

    if (!page) {
        return [];
    }

    // V501: preview every structural tab/page heading. The previous explicit list
    // missed generated/custom layouts, so KB/Quizzes/Toolbox/custom tabs could
    // preview without the Heading Backdrop even though Daily Log worked.
    return Array.from(page.querySelectorAll('h1,h2,h3,.custom-tab-title,.custom-user-heading'))
        .filter(node => !node.closest('.modal-overlay,.modal-box,.quiz-card,.flashcard-mode-card,.map-study-card-v172'));
}

function applyHeadingPreviewV62(
    modal
) {
    if (!modal) {
        return;
    }

    let draft =
        null;

    try {
        draft =
            getThemeBuilderDraft(
                modal
            );
    } catch {
        return;
    }

    // V496: this older preview helper still runs, so it must read the same
    // dedicated Heading Backdrop fields as the current Theme Builder. Otherwise
    // its inline !important styles can repaint the preview with a stale white
    // legacy value after the modern preview has already rendered correctly.
    const hasModernHeadingV496 =
        Object.prototype.hasOwnProperty.call(draft || {}, 'headingBackgroundEnabledV429') ||
        Object.prototype.hasOwnProperty.call(draft || {}, 'headingBackgroundColorV452');

    const enabled = hasModernHeadingV496
        ? draft?.headingBackgroundEnabledV429 === true
        : !!draft?.sectionHeadingBackgroundEnabledV59;

    const color = hasModernHeadingV496
        ? (draft?.headingBackgroundColorV452 || draft?.surface || '#ffffff')
        : (draft?.sectionHeadingBackgroundColorV59 || draft?.surface || '#ffffff');

    const opacity = Math.max(
        0,
        Math.min(
            100,
            Number(
                hasModernHeadingV496
                    ? (draft?.headingBackgroundOpacityV452 ?? 88)
                    : 100
            ) || 0
        )
    );

    const headingRgbaV496 = (() => {
        const match = /^#([0-9a-f]{6})$/i.exec(String(color || '').trim());
        if (!match) return color;
        const n = parseInt(match[1], 16);
        return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${opacity / 100})`;
    })();

    const padding = Math.max(
        0,
        Math.min(
            40,
            Number(
                hasModernHeadingV496
                    ? (draft?.headingBackgroundPaddingV429 ?? 10)
                    : (draft?.sectionHeadingBackgroundPaddingV59 ?? 6)
            ) || 0
        )
    );

    const radius = Math.max(
        0,
        Math.min(
            40,
            Number(
                hasModernHeadingV496
                    ? (draft?.headingBackgroundRadiusV452 ?? draft?.radius ?? 10)
                    : (draft?.radius ?? 10)
            ) || 0
        )
    );

    themePreviewHeadingNodesV62(
        modal
    ).forEach(
        node => {
            if (!enabled) {
                if (
                    node.dataset
                        .headingPreviewV62 ===
                    'true'
                ) {
                    node.style
                        .removeProperty(
                            'background-color'
                        );

                    node.style
                        .removeProperty(
                            'background-image'
                        );

                    node.style
                        .removeProperty(
                            'padding'
                        );

                    node.style
                        .removeProperty(
                            'border-radius'
                        );

                    node.style
                        .removeProperty(
                            'display'
                        );

                    node.style
                        .removeProperty(
                            'width'
                        );

                    delete node.dataset
                        .headingPreviewV62;
                }

                return;
            }

            node.dataset
                .headingPreviewV62 =
                'true';

            node.style
                .setProperty(
                    'background-color',
                    headingRgbaV496,
                    'important'
                );

            node.style
                .setProperty(
                    'background-image',
                    'none',
                    'important'
                );

            node.style
                .setProperty(
                    'padding',
                    `${padding}px ${padding + 3}px`,
                    'important'
                );

            node.style
                .setProperty(
                    'border-radius',
                    `${radius}px`,
                    'important'
                );

            node.style
                .setProperty(
                    'display',
                    'inline-block',
                    'important'
                );

            node.style
                .setProperty(
                    'width',
                    'fit-content',
                    'important'
                );
        }
    );
}

const updateThemeBuilderPreviewBeforeHeadingV62 =
    updateThemeBuilderPreview;

updateThemeBuilderPreview =
    function(
        modal
    ) {
        const result =
            updateThemeBuilderPreviewBeforeHeadingV62(
                modal
            );

        requestAnimationFrame(
            () => {
                applyHeadingPreviewV62(
                    modal
                );
            }
        );

        return result;
    };

const rebuildActualThemeBuilderPreviewBeforeHeadingV62 =
    rebuildActualThemeBuilderPreviewV5;

rebuildActualThemeBuilderPreviewV5 =
    function(
        modal
    ) {
        const result =
            rebuildActualThemeBuilderPreviewBeforeHeadingV62(
                modal
            );

        requestAnimationFrame(
            () => {
                applyHeadingPreviewV62(
                    modal
                );
            }
        );

        return result;
    };


// ------------------------------------------------------------
// 5) Final initialization.
// ------------------------------------------------------------

requestAnimationFrame(
    () => {
        syncPageActionButtonsV61();
        syncPageActionIconSizeV62();

        document
            .querySelectorAll(
                '.custom-component-backdrop-toggle-v61'
            )
            .forEach(
                toggle => {
                    refreshComponentBackdropToggleV62(
                        toggle,
                        toggle.classList
                            .contains(
                                'active'
                            )
                    );
                }
            );
    }
);



// ============================================================
// V63 — DASHBOARD PREVIEW MOTION / FIXED PAGE CHROME / IMAGE VISIBILITY
// THEME LOADING INDICATOR / BACKDROP PREVIEW / KB CARD OPACITY
// ============================================================


// ------------------------------------------------------------
// THEME DEFAULT SOFT BACKDROP = SAME FEEL AS PERSISTENT COMPONENT BACKDROP.
// ------------------------------------------------------------

CUSTOM_THEME_VISUAL_DEFAULTS_V4.dailyLogBackgroundColor =
    '#ffffff';

CUSTOM_THEME_VISUAL_DEFAULTS_V4.dailyLogBackgroundOpacity =
    90;

CUSTOM_THEME_VISUAL_DEFAULTS_V4.contentBackdropColor =
    '#ffffff';

CUSTOM_THEME_VISUAL_DEFAULTS_V4.contentBackdropOpacity =
    90;


// ------------------------------------------------------------
// THEME IMAGE VISIBILITY — HIDE FROM THE ACTUAL SCREEN / ALL PREVIEWS.
// ------------------------------------------------------------

const getPreviewSvgAssignmentsBeforeVisibilityV63 =
    getPreviewSvgAssignmentsV10;

getPreviewSvgAssignmentsV10 =
    function(
        modal,
        draft
    ) {
        const assignments =
            getPreviewSvgAssignmentsBeforeVisibilityV63(
                modal,
                draft
            ) ||
            [];

        return assignments.filter(
            assignment =>
                assignment
                    ?.svg
                    ?.hiddenOnScreenV63 !==
                true
        );
    };


const getRuntimeSvgAssignmentsBeforeVisibilityV63 =
    getRuntimeSvgAssignmentsV10;

getRuntimeSvgAssignmentsV10 =
    function(
        theme
    ) {
        const assignments =
            getRuntimeSvgAssignmentsBeforeVisibilityV63(
                theme
            ) ||
            [];

        return assignments.filter(
            assignment =>
                assignment
                    ?.svg
                    ?.hiddenOnScreenV63 !==
                true
        );
    };


function installPerImageVisibilityControlsV63(
    modal
) {
    if (!modal) {
        return;
    }

    modal
        .querySelectorAll(
            '.theme-builder-svg-card[data-svg-index]'
        )
        .forEach(
            card => {
                const index =
                    Number(
                        card.dataset
                            .svgIndex
                    );

                if (
                    !Number.isFinite(
                        index
                    )
                ) {
                    return;
                }

                const asset =
                    modal
                        ._themeBackgroundSvgs
                        ?.[index];

                if (!asset) {
                    return;
                }

                const options =
                    card.querySelector(
                        '.theme-builder-svg-card-options-v10'
                    ) ||
                    card.querySelector(
                        '.theme-builder-svg-card-copy'
                    );

                if (
                    !options ||
                    options.querySelector(
                        '.theme-builder-image-visible-row-v63'
                    )
                ) {
                    return;
                }

                const row =
                    document.createElement(
                        'label'
                    );

                row.className =
                    'theme-builder-svg-option-row theme-builder-image-visible-row-v63';

                row.innerHTML = `
                    <span>Show on screen</span>

                    <input
                        type="checkbox"
                        class="theme-builder-image-visible-v63"
                        ${asset.hiddenOnScreenV63 === true ? '' : 'checked'}
                    >
                `;

                const checkbox =
                    row.querySelector(
                        '.theme-builder-image-visible-v63'
                    );

                checkbox.addEventListener(
                    'change',
                    () => {
                        asset.hiddenOnScreenV63 =
                            !checkbox.checked;

                        updateThemeBuilderPreview(
                            modal
                        );

                        renderDashboardThemePreviewV40?.(
                            modal
                        );
                    }
                );

                options.appendChild(
                    row
                );
            }
        );
}


// ------------------------------------------------------------
// DASHBOARD PREVIEW — USE THE SAME ANIMATION + MUSIC-BOP SHELL AS LOG PREVIEW.
// ------------------------------------------------------------

function animateDashboardThemePreviewV63(
    modal
) {
    const host =
        modal?.querySelector(
            '.theme-builder-dashboard-preview-v40'
        );

    if (!host) {
        return;
    }

    const draft =
        getThemeBuilderDraft(
            modal
        );

    const assignments =
        getPreviewSvgAssignmentsV10(
            modal,
            draft
        ) ||
        [];

    const stage =
        host.querySelector(
            '.theme-builder-dashboard-art-v40'
        );

    if (!stage) {
        return;
    }

    stage.classList.add(
        'theme-svg-effects-stage-v10',
        'theme-builder-dashboard-art-stage-v63'
    );

    const items =
        Array.from(
            stage.querySelectorAll(
                '.theme-builder-dashboard-art-item-v40'
            )
        );

    items.forEach(
        (
            item,
            displayIndex
        ) => {
            const assignment =
                assignments[
                    displayIndex
                ];

            const asset =
                ensureSvgAdvancedDefaultsV10(
                    assignment?.svg
                );

            if (!asset) {
                return;
            }

            item.dataset.svgIndex =
                String(
                    Number.isFinite(
                        Number(
                            assignment
                                ?.originalIndex
                        )
                    )
                        ? Number(
                            assignment
                                .originalIndex
                        )
                        : displayIndex
                );

            item.classList.add(
                'theme-builder-dashboard-art-animated-v63',
                `theme-svg-anim-${asset.animation || 'float'}`
            );

            item.style
                .setProperty(
                    '--theme-svg-delay',
                    `${(displayIndex % 13) * -0.41}s`
                );

            if (
                !item.querySelector(
                    ':scope > .theme-svg-motion-shell'
                )
            ) {
                const current =
                    item.innerHTML;

                item.innerHTML = `
                    <div class="theme-svg-motion-shell theme-image-motion-shell-v36">
                        ${current}
                    </div>
                `;
            }
        }
    );

    applyAutomaticIntroBoppersV60(
        stage,
        Array.isArray(
            modal._themeBackgroundSvgs
        )
            ? modal._themeBackgroundSvgs
            : [],
        draft.introSvgBopMode ||
        'some'
    );

    stage.classList.toggle(
        'theme-svg-intro-bop-enabled',
        !!draft.introSvgBounceEnabled
    );
}


const renderDashboardThemePreviewBeforeMotionV63 =
    renderDashboardThemePreviewV40;

renderDashboardThemePreviewV40 =
    function(
        modal
    ) {
        const result =
            renderDashboardThemePreviewBeforeMotionV63(
                modal
            );

        animateDashboardThemePreviewV63(
            modal
        );

        return result;
    };


// The V60 bop helper now recognizes Dashboard-preview artwork too.
const applyAutomaticIntroBoppersBeforeDashboardV63 =
    applyAutomaticIntroBoppersV60;

applyAutomaticIntroBoppersV60 =
    function(
        stage,
        assets =
            [],
        mode =
            'some'
    ) {
        if (!stage) {
            return;
        }

        const items =
            Array.from(
                stage.querySelectorAll(
                    [
                        '.theme-builder-live-art-item',
                        '.custom-theme-background-svg',
                        '.theme-builder-dashboard-art-item-v40'
                    ].join(',')
                )
            );

        stage.classList.toggle(
            'theme-svg-intro-bop-all',
            mode ===
                'all'
        );

        const auto =
            [];

        const forced =
            [];

        items.forEach(
            (
                item,
                displayIndex
            ) => {
                item.classList.remove(
                    'theme-svg-intro-bop-selected'
                );

                item.removeAttribute(
                    'data-auto-intro-bop'
                );

                const sourceIndex =
                    Number(
                        item.dataset
                            .svgIndex
                    );

                const asset =
                    assets?.[
                        Number.isFinite(
                            sourceIndex
                        )
                            ? sourceIndex
                            : displayIndex
                    ] ||
                    assets?.[
                        displayIndex
                    ] ||
                    {};

                const preference =
                    String(
                        asset.bopModeV60 ||
                        'auto'
                    );

                if (
                    asset.hiddenOnScreenV63 ===
                    true ||
                    preference ===
                    'never'
                ) {
                    return;
                }

                if (
                    preference ===
                    'always'
                ) {
                    forced.push(
                        item
                    );

                    return;
                }

                auto.push(
                    item
                );
            }
        );

        forced.forEach(
            item => {
                item.classList.add(
                    'theme-svg-intro-bop-selected'
                );

                item.dataset.autoIntroBop =
                    'forced';
            }
        );

        const autoSelected =
            mode ===
                'all'
                ? auto
                : chooseSpreadSvgBoppersV23(
                    auto
                );

        autoSelected.forEach(
            item => {
                item.classList.add(
                    'theme-svg-intro-bop-selected'
                );

                item.dataset.autoIntroBop =
                    'true';
            }
        );
    };


// ------------------------------------------------------------
// IMAGE CUSTOMIZE CONTROLS MUST GET BOP + SHOW/HIDE AFTER EVERY PAGE HYDRATE.
// ------------------------------------------------------------

const installPerImageBopControlsBeforeVisibilityV63 =
    installPerImageBopControlsV60;

installPerImageBopControlsV60 =
    function(
        modal
    ) {
        const result =
            installPerImageBopControlsBeforeVisibilityV63(
                modal
            );

        installPerImageVisibilityControlsV63(
            modal
        );

        return result;
    };


// ------------------------------------------------------------
// THEME BUILDER BACKDROP PREVIEW — FINAL AUTHORITATIVE PASS.
// ------------------------------------------------------------

function prepareThemeBackdropControlsV63(
    modal
) {
    if (
        !modal ||
        modal.dataset
            .backdropDefaultsV63 ===
            'true'
    ) {
        return;
    }

    modal.dataset
        .backdropDefaultsV63 =
        'true';

    [
        [
            '.theme-builder-daily-backdrop-enabled',
            '.theme-builder-daily-backdrop-opacity',
            'dailyLogBackgroundColor'
        ],
        [
            '.theme-builder-other-backdrop-enabled',
            '.theme-builder-other-backdrop-opacity',
            'contentBackdropColor'
        ]
    ].forEach(
        (
            [
                toggleSelector,
                opacitySelector,
                colorKey
            ]
        ) => {
            const toggle =
                modal.querySelector(
                    toggleSelector
                );

            if (!toggle) {
                return;
            }

            toggle.addEventListener(
                'change',
                () => {
                    if (!toggle.checked) {
                        return;
                    }

                    const opacity =
                        modal.querySelector(
                            opacitySelector
                        );

                    if (
                        opacity &&
                        Number(
                            opacity.value
                        ) <=
                            0
                    ) {
                        opacity.value =
                            '90';

                        opacity.dispatchEvent(
                            new Event(
                                'input',
                                {
                                    bubbles:
                                        true
                                }
                            )
                        );
                    }

                    const color =
                        modal.querySelector(
                            `[data-theme-key="${colorKey}"]`
                        );

                    if (
                        color &&
                        !String(
                            color.value ||
                            ''
                        ).trim()
                    ) {
                        color.value =
                            modal.querySelector(
                                '[data-theme-key="surface"]'
                            )?.value ||
                            '#ffffff';
                    }

                    updateThemeBuilderPreview(
                        modal
                    );
                }
            );
        }
    );
}


function applyThemeBackdropPreviewV63(
    modal
) {
    const canvas =
        modal?.querySelector(
            '.theme-builder-live-canvas'
        );

    const page =
        canvas?.querySelector(
            '.theme-builder-live-page'
        );

    if (
        !canvas ||
        !page
    ) {
        return;
    }

    const draft =
        getThemeBuilderDraft(
            modal
        );

    const sourceId =
        canvas.dataset
            .previewSourceId ||
        page.dataset
            .previewOriginalId ||
        '';

    const isDaily =
        sourceId ===
            'grid-view' ||
        sourceId ===
            'log-view';

    const enabled =
        isDaily
            ? !!draft
                .dailyLogBackgroundEnabled
            : !!draft
                .contentBackdropEnabled;

    const color =
        isDaily
            ? (
                draft
                    .dailyLogBackgroundColor ||
                draft.surface ||
                '#ffffff'
            )
            : (
                draft
                    .contentBackdropColor ||
                draft.surface ||
                '#ffffff'
            );

    const opacity =
        Math.max(
            0,
            Math.min(
                100,
                Number(
                    isDaily
                        ? draft
                            .dailyLogBackgroundOpacity
                        : draft
                            .contentBackdropOpacity
                ) ||
                0
            )
        );

    page.style
        .setProperty(
            'background',
            enabled
                ? hexToRgbaV4(
                    color,
                    opacity /
                        100
                )
                : 'transparent',
            'important'
        );

    page.style
        .setProperty(
            'background-color',
            enabled
                ? hexToRgbaV4(
                    color,
                    opacity /
                        100
                )
                : 'transparent',
            'important'
        );

    page.style
        .setProperty(
            'border-radius',
            `${Math.max(
                0,
                Number(
                    draft.radius
                ) ||
                0
            )}px`,
            'important'
        );

    page.style
        .setProperty(
            'padding',
            enabled
                ? '18px'
                : '0px',
            'important'
        );
}


// ------------------------------------------------------------
// KNOWLEDGE BASE CARD OPACITY CONTROL.
// This did NOT previously exist.
// ------------------------------------------------------------

function ensureKnowledgeCardOpacityControlV63(
    modal
) {
    if (
        !modal ||
        modal.querySelector(
            '.theme-builder-kb-card-opacity-v63'
        )
    ) {
        return;
    }

    const section =
        document.createElement(
            'section'
        );

    section.className =
        'theme-builder-control-section theme-builder-kb-card-opacity-v63';

    section.dataset
        .themeBuilderPanelGroup =
        'colors';

    section.innerHTML = `
        <div class="theme-builder-control-heading">
            <strong>Knowledge Base Cards</strong>
            <small>
                Control how transparent Knowledge Base item cards are.
            </small>
        </div>

        <label class="theme-builder-opacity-field">
            <span>
                Item Card Opacity
                <output class="theme-builder-kb-card-opacity-output-v63">
                    100%
                </output>
            </span>

            <input
                type="range"
                class="theme-builder-kb-card-opacity-input-v63"
                min="0"
                max="100"
                step="1"
                value="100"
            >
        </label>
    `;

    const headingSection =
        modal.querySelector(
            '.theme-builder-heading-background-v59'
        );

    const colors =
        modal.querySelector(
            '.theme-builder-color-grid'
        )?.closest(
            '.theme-builder-control-section'
        );

    if (headingSection) {
        headingSection
            .insertAdjacentElement(
                'afterend',
                section
            );
    } else if (colors) {
        colors
            .insertAdjacentElement(
                'afterend',
                section
            );
    } else {
        modal.querySelector(
            '.theme-builder-controls'
        )?.prepend(
            section
        );
    }

    const input =
        section.querySelector(
            '.theme-builder-kb-card-opacity-input-v63'
        );

    const output =
        section.querySelector(
            '.theme-builder-kb-card-opacity-output-v63'
        );

    const refresh =
        () => {
            output.textContent =
                `${Math.round(
                    Number(
                        input.value
                    ) ||
                    0
                )}%`;

            updateThemeBuilderPreview(
                modal
            );
        };

    input.addEventListener(
        'input',
        refresh
    );

    installThemeBuilderSectionTabsV11?.(
        modal
    );
}


const getThemeBuilderDraftBeforeKbOpacityV63 =
    getThemeBuilderDraft;

getThemeBuilderDraft =
    function(
        modal
    ) {
        const draft =
            getThemeBuilderDraftBeforeKbOpacityV63(
                modal
            );

        draft.knowledgeCardOpacityV63 =
            Math.max(
                0,
                Math.min(
                    100,
                    Number(
                        modal?.querySelector(
                            '.theme-builder-kb-card-opacity-input-v63'
                        )?.value ??
                        draft.knowledgeCardOpacityV63 ??
                        100
                    ) ||
                    0
                )
            );

        return draft;
    };


function applyKnowledgeCardOpacityPreviewV63(
    modal
) {
    const page =
        modal?.querySelector(
            '.theme-builder-live-page'
        );

    if (!page) {
        return;
    }

    const draft =
        getThemeBuilderDraft(
            modal
        );

    const canvas =
        modal.querySelector(
            '.theme-builder-live-canvas'
        );

    const sourceId =
        canvas?.dataset
            ?.previewSourceId ||
        page.dataset
            ?.previewOriginalId ||
        '';

    const opacity =
        sourceId ===
            'phrases-library-view'
            ? Math.max(
            0,
            Math.min(
                100,
                Number(
                    draft
                        .knowledgeCardOpacityV63
                ) ||
                0
            )
        ) /
        100
            : 1;

    page.querySelectorAll(
        '.phrase-card, .polaroid-card'
    ).forEach(
        card => {
            card.style
                .setProperty(
                    'opacity',
                    String(
                        opacity
                    ),
                    'important'
                );
        }
    );
}


function applyKnowledgeCardOpacityRuntimeV63(
    theme
) {
    const opacity =
        Math.max(
            0,
            Math.min(
                100,
                Number(
                    theme
                        ?.knowledgeCardOpacityV63 ??
                    100
                )
            )
        );

    document.documentElement
        .style.setProperty(
            '--custom-theme-kb-card-opacity-v63',
            String(
                opacity /
                100
            )
        );
}


// ------------------------------------------------------------
// FINAL THEME BUILDER UPDATE/POPULATE WIRES.
// ------------------------------------------------------------

const populateThemeBuilderBeforeV63 =
    populateThemeBuilder;

populateThemeBuilder =
    function(
        modal,
        theme
    ) {
        const result =
            populateThemeBuilderBeforeV63(
                modal,
                theme
            );

        ensureKnowledgeCardOpacityControlV63(
            modal
        );

        prepareThemeBackdropControlsV63(
            modal
        );

        const kbOpacity =
            modal.querySelector(
                '.theme-builder-kb-card-opacity-input-v63'
            );

        if (kbOpacity) {
            kbOpacity.value =
                String(
                    Math.max(
                        0,
                        Math.min(
                            100,
                            Number(
                                theme
                                    ?.knowledgeCardOpacityV63 ??
                                100
                            )
                        )
                    )
                );

            const output =
                modal.querySelector(
                    '.theme-builder-kb-card-opacity-output-v63'
                );

            if (output) {
                output.textContent =
                    `${Math.round(
                        Number(
                            kbOpacity.value
                        )
                    )}%`;
            }
        }

        installPerImageVisibilityControlsV63(
            modal
        );

        requestAnimationFrame(
            () => {
                applyThemeBackdropPreviewV63(
                    modal
                );

                applyKnowledgeCardOpacityPreviewV63(
                    modal
                );

                animateDashboardThemePreviewV63(
                    modal
                );
            }
        );

        return result;
    };


const updateThemeBuilderPreviewBeforeV63 =
    updateThemeBuilderPreview;

updateThemeBuilderPreview =
    function(
        modal
    ) {
        const result =
            updateThemeBuilderPreviewBeforeV63(
                modal
            );

        requestAnimationFrame(
            () => {
                applyThemeBackdropPreviewV63(
                    modal
                );

                applyKnowledgeCardOpacityPreviewV63(
                    modal
                );

                animateDashboardThemePreviewV63(
                    modal
                );

                installPerImageVisibilityControlsV63(
                    modal
                );
            }
        );

        return result;
    };


const rebuildActualThemeBuilderPreviewBeforeV63 =
    rebuildActualThemeBuilderPreviewV5;

rebuildActualThemeBuilderPreviewV5 =
    function(
        modal
    ) {
        const result =
            rebuildActualThemeBuilderPreviewBeforeV63(
                modal
            );

        requestAnimationFrame(
            () => {
                applyThemeBackdropPreviewV63(
                    modal
                );

                applyKnowledgeCardOpacityPreviewV63(
                    modal
                );

                animateDashboardThemePreviewV63(
                    modal
                );
            }
        );

        return result;
    };


// ------------------------------------------------------------
// RUNTIME KB CARD OPACITY AFTER THEME APPLICATION.
// ------------------------------------------------------------

const applyThemeBeforeKbOpacityV63 =
    applyTheme;

applyTheme =
    async function(
        themeValue,
        opts =
            {}
    ) {
        const result =
            await applyThemeBeforeKbOpacityV63(
                themeValue,
                opts
            );

        let theme =
            null;

        try {
            theme =
                resolveThemeCreativeDataV56?.(
                    themeValue
                ) ||
                null;
        } catch {}

        applyKnowledgeCardOpacityRuntimeV63(
            theme ||
            {}
        );

        return result;
    };


// ------------------------------------------------------------
// FIXED TOP CHROME / INNER SCROLL AREAS.
// ------------------------------------------------------------

function syncFixedPanelScrollAreasV63() {
    const setHeight =
        (
            element,
            bottomGap =
                22
        ) => {
            if (!element) {
                return;
            }

            const rect =
                element
                    .getBoundingClientRect();

            const height =
                Math.max(
                    140,
                    Math.floor(
                        window.innerHeight -
                        rect.top -
                        bottomGap
                    )
                );

            element.style
                .setProperty(
                    '--fixed-panel-scroll-height-v63',
                    `${height}px`
                );
        };

    setHeight(
        document.getElementById(
            'phrases-library-grid'
        )
    );

    setHeight(
        document.getElementById(
            'toolbox-grid'
        )
    );

    document.querySelectorAll(
        '.custom-tab-view.view.active .custom-tab-canvas'
    ).forEach(
        canvas =>
            setHeight(
                canvas
            )
    );
}


window.addEventListener(
    'resize',
    syncFixedPanelScrollAreasV63
);


const switchViewBeforeFixedPanelsV63 =
    switchView;

switchView =
    function(
        viewToShow
    ) {
        const result =
            switchViewBeforeFixedPanelsV63(
                viewToShow
            );

        requestAnimationFrame(
            syncFixedPanelScrollAreasV63
        );

        return result;
    };


const renderCustomTabViewBeforeFixedPanelsV63 =
    renderCustomTabView;

renderCustomTabView =
    function(
        tabId
    ) {
        const result =
            renderCustomTabViewBeforeFixedPanelsV63(
                tabId
            );

        requestAnimationFrame(
            syncFixedPanelScrollAreasV63
        );

        return result;
    };


// ------------------------------------------------------------
// >1 SECOND THEME-EDITOR LOADING INDICATOR.
// ------------------------------------------------------------

let themeBuilderLoadDepthV63 =
    0;

let themeBuilderLoadTimerV63 =
    null;


function ensureThemeBuilderLoadingOverlayV63() {
    let overlay =
        document.getElementById(
            'theme-builder-loading-v63'
        );

    if (overlay) {
        return overlay;
    }

    overlay =
        document.createElement(
            'div'
        );

    overlay.id =
        'theme-builder-loading-v63';

    overlay.className =
        'theme-builder-loading-v63 hidden';

    overlay.innerHTML = `
        <div class="theme-builder-loading-card-v63">
            <span class="theme-builder-loading-spinner-v63"></span>
            <strong>Loading theme…</strong>
        </div>
    `;

    document.body.appendChild(
        overlay
    );

    return overlay;
}


function beginThemeBuilderLoadV63() {
    themeBuilderLoadDepthV63 +=
        1;

    if (
        themeBuilderLoadDepthV63 !==
        1
    ) {
        return;
    }

    clearTimeout(
        themeBuilderLoadTimerV63
    );

    themeBuilderLoadTimerV63 =
        setTimeout(
            () => {
                if (
                    themeBuilderLoadDepthV63 >
                    0
                ) {
                    ensureThemeBuilderLoadingOverlayV63()
                        .classList.remove(
                            'hidden'
                        );
                }
            },
            1000
        );
}


function endThemeBuilderLoadV63() {
    themeBuilderLoadDepthV63 =
        Math.max(
            0,
            themeBuilderLoadDepthV63 -
                1
        );

    if (
        themeBuilderLoadDepthV63 >
        0
    ) {
        return;
    }

    clearTimeout(
        themeBuilderLoadTimerV63
    );

    ensureThemeBuilderLoadingOverlayV63()
        .classList.add(
            'hidden'
        );
}


const openAnyThemeInBuilderBeforeLoadingV63 =
    openAnyThemeInBuilderV25;

openAnyThemeInBuilderV25 =
    async function(
        ...args
    ) {
        beginThemeBuilderLoadV63();

        try {
            return await openAnyThemeInBuilderBeforeLoadingV63(
                ...args
            );
        } finally {
            endThemeBuilderLoadV63();
        }
    };


const openThemeCopyInBuilderBeforeLoadingV63 =
    openThemeCopyInBuilderV30;

openThemeCopyInBuilderV30 =
    async function(
        ...args
    ) {
        beginThemeBuilderLoadV63();

        try {
            return await openThemeCopyInBuilderBeforeLoadingV63(
                ...args
            );
        } finally {
            endThemeBuilderLoadV63();
        }
    };


// ------------------------------------------------------------
// FINAL INITIALIZATION.
// ------------------------------------------------------------

requestAnimationFrame(
    () => {
        syncFixedPanelScrollAreasV63();
    }
);



// ============================================================
// V64 — DAILY-LOG WIDTH MATCH + QUIZ SETTINGS COPY/LAYOUT POLISH
// ============================================================

function polishQuizSettingsV64(
    modal =
        document.getElementById(
            'quiz-settings-modal-v58'
        )
) {
    if (!modal) {
        return;
    }

    // Smart Placeholder Practice is a separate practice area,
    // not part of Quizlet Learn.
    const smartCopy =
        modal.querySelector(
            '.quiz-smart-placeholder-toggle-v58'
        )
            ?.closest(
                'label'
            )
            ?.querySelector(
                'small'
            );

    if (smartCopy) {
        smartCopy.remove();
    }

    // Keep the Field to Field Practice wording from V60.
    const fieldPracticeTitle =
        modal.querySelector(
            '.quiz-transformation-toggle-v58'
        )
            ?.closest(
                'label'
            )
            ?.querySelector(
                'strong'
            );

    if (fieldPracticeTitle) {
        fieldPracticeTitle.textContent =
            'Field to Field Practice';
    }

    const headingCopy =
        modal.querySelector(
            '.quiz-settings-section-heading-v58 > div'
        );

    if (headingCopy) {
        headingCopy.classList.add(
            'quiz-rules-copy-v64'
        );

        const strong =
            headingCopy.querySelector(
                ':scope > strong'
            ) ||
            headingCopy.querySelector(
                'strong'
            );

        if (strong) {
            strong.textContent =
                'Rules';
        }

        let help =
            headingCopy.querySelector(
                '.quiz-transformation-help-v60'
            );

        // V60 normally creates this. Make a fallback if an older saved/runtime
        // modal was already present before that wrapper ran.
        if (!help) {
            help =
                document.createElement(
                    'span'
                );

            help.className =
                'quiz-transformation-help-v60';

            help.textContent =
                '?';

            help.tabIndex =
                0;

            help.setAttribute(
                'role',
                'button'
            );

            help.setAttribute(
                'aria-label',
                'Field to Field Practice examples'
            );

            const show =
                () => {
                    document
                        .getElementById(
                            'quiz-transformation-help-popover-v60'
                        )
                        ?.remove();

                    const pop =
                        document.createElement(
                            'div'
                        );

                    pop.id =
                        'quiz-transformation-help-popover-v60';

                    pop.className =
                        'quiz-transformation-help-popover-v60';

                    pop.innerHTML = `
                        <strong>French example</strong>
                        <span>Category: French Verbs</span>
                        <span>Show: Infinitive → <b>parler</b></span>
                        <span>Ask for: Nous Present</span>
                        <span>Practice: <b>parler → ?</b> Answer: <b>parlons</b></span>
                        <strong>Chemistry example</strong>
                        <span>Category: Compounds</span>
                        <span>Show: Formula → <b>NaCl</b></span>
                        <span>Ask for: Compound Name</span>
                        <span>Practice: <b>NaCl → ?</b> Answer: <b>sodium chloride</b></span>
                    `;

                    document.body.appendChild(
                        pop
                    );

                    const rect =
                        help.getBoundingClientRect();

                    pop.style.left =
                        `${Math.max(
                            8,
                            Math.min(
                                window.innerWidth -
                                    320,
                                rect.left
                            )
                        )}px`;

                    pop.style.top =
                        `${Math.max(
                            8,
                            Math.min(
                                window.innerHeight -
                                    250,
                                rect.bottom +
                                    5
                            )
                        )}px`;
                };

            const hide =
                () =>
                    document
                        .getElementById(
                            'quiz-transformation-help-popover-v60'
                        )
                        ?.remove();

            help.addEventListener(
                'mouseenter',
                show
            );

            help.addEventListener(
                'mouseleave',
                hide
            );

            help.addEventListener(
                'focus',
                show
            );

            help.addEventListener(
                'blur',
                hide
            );
        }

        let titleRow =
            headingCopy.querySelector(
                '.quiz-rules-title-row-v64'
            );

        if (!titleRow) {
            titleRow =
                document.createElement(
                    'div'
                );

            titleRow.className =
                'quiz-rules-title-row-v64';

            const small =
                headingCopy.querySelector(
                    ':scope > small'
                );

            if (small) {
                headingCopy.insertBefore(
                    titleRow,
                    small
                );
            } else {
                headingCopy.prepend(
                    titleRow
                );
            }
        }

        if (
            strong &&
            strong.parentElement !==
                titleRow
        ) {
            titleRow.appendChild(
                strong
            );
        }

        if (
            help &&
            help.parentElement !==
                titleRow
        ) {
            titleRow.appendChild(
                help
            );
        }

        const description =
            headingCopy.querySelector(
                ':scope > small'
            );

        if (description) {
            description.textContent =
                'Choose which Knowledge Base field is shown and which field you must produce.';
        }
    }

    // Remove the older styled help button if a stale version survived.
    modal.querySelector(
        '.quiz-transformation-help-v59'
    )?.remove();
}


const ensureQuizSettingsModalBeforeV64 =
    ensureQuizSettingsModalV58;

ensureQuizSettingsModalV58 =
    function() {
        const modal =
            ensureQuizSettingsModalBeforeV64();

        polishQuizSettingsV64(
            modal
        );

        return modal;
    };


const renderQuizTransformationRulesBeforeV64 =
    renderQuizTransformationRulesV58;

renderQuizTransformationRulesV58 =
    function(
        modal
    ) {
        const result =
            renderQuizTransformationRulesBeforeV64(
                modal
            );

        const host =
            modal?.querySelector(
                '.quiz-transformation-rules-v58'
            );

        host
            ?.querySelectorAll(
                '.quiz-transformation-rule-top-v58 > strong'
            )
            .forEach(
                title => {
                    if (
                        title.textContent
                            .trim() ===
                        'Transformation'
                    ) {
                        title.textContent =
                            'Rule';
                    }
                }
            );

        const empty =
            host?.querySelector(
                '.quiz-settings-empty-v58'
            );

        if (empty) {
            empty.textContent =
                'Add a rule if you want Field to Field Practice to ask things such as dictionary form → polite form, present → past, or formula → compound name.';
        }

        return result;
    };


requestAnimationFrame(
    () => {
        const modal =
            document.getElementById(
                'quiz-settings-modal-v58'
            );

        if (modal) {
            polishQuizSettingsV64(
                modal
            );
        }
    }
);



// ============================================================
// V65 — EXACT DAILY LOGS WIDTH / FIELD-TO-FIELD RULE VISIBILITY /
// PREVIEW BACKDROP MATCHES REAL THEME
// ============================================================


// ------------------------------------------------------------
// FIELD TO FIELD RULES ONLY EXIST VISUALLY WHILE ENABLED.
// ------------------------------------------------------------

function syncFieldToFieldRulesVisibilityV65(
    modal =
        document.getElementById(
            'quiz-settings-modal-v58'
        )
) {
    if (!modal) {
        return;
    }

    const settings =
        ensureQuizSettingsV58();

    const details =
        modal.querySelector(
            '.quiz-transformation-settings-v58'
        );

    if (details) {
        details.classList.toggle(
            'hidden',
            !settings.transformationPractice
        );

        details.classList.remove(
            'disabled-v58'
        );

        details.setAttribute(
            'aria-hidden',
            settings.transformationPractice
                ? 'false'
                : 'true'
        );
    }
}


const syncQuizSettingsModalBeforeV65 =
    syncQuizSettingsModalV58;

syncQuizSettingsModalV58 =
    function(
        modal =
            ensureQuizSettingsModalV58()
    ) {
        const result =
            syncQuizSettingsModalBeforeV65(
                modal
            );

        syncFieldToFieldRulesVisibilityV65(
            modal
        );

        return result;
    };


const ensureQuizSettingsModalBeforeV65 =
    ensureQuizSettingsModalV58;

ensureQuizSettingsModalV58 =
    function() {
        const modal =
            ensureQuizSettingsModalBeforeV65();

        syncFieldToFieldRulesVisibilityV65(
            modal
        );

        return modal;
    };


// ------------------------------------------------------------
// PREVIEW BACKDROP: USE THE EXACT SAME color-mix() EXPRESSION AS RUNTIME.
// No separate rgba conversion, so preview and real page composite identically.
// ------------------------------------------------------------

function applyThemeBackdropPreviewV65(
    modal
) {
    const canvas =
        modal?.querySelector(
            '.theme-builder-live-canvas'
        );

    const page =
        canvas?.querySelector(
            '.theme-builder-live-page'
        );

    if (
        !canvas ||
        !page
    ) {
        return;
    }

    const draft =
        getThemeBuilderDraft(
            modal
        );

    const sourceId =
        canvas.dataset
            .previewSourceId ||
        page.dataset
            .previewOriginalId ||
        '';

    const isDaily =
        sourceId ===
            'grid-view' ||
        sourceId ===
            'log-view';

    const enabled =
        isDaily
            ? !!draft
                .dailyLogBackgroundEnabled
            : !!draft
                .contentBackdropEnabled;

    const color =
        isDaily
            ? (
                draft
                    .dailyLogBackgroundColor ||
                draft.surface ||
                '#ffffff'
            )
            : (
                draft
                    .contentBackdropColor ||
                draft.surface ||
                '#ffffff'
            );

    const opacity =
        Math.max(
            0,
            Math.min(
                100,
                Number(
                    isDaily
                        ? draft
                            .dailyLogBackgroundOpacity
                        : draft
                            .contentBackdropOpacity
                ) ||
                0
            )
        );

    const runtimeBackground =
        enabled
            ? `color-mix(in srgb, ${color} ${opacity}%, transparent)`
            : 'transparent';

    // Clear all previous preview backdrop declarations first so there
    // cannot be a doubled/darker background from an earlier preview pass.
    page.style
        .removeProperty(
            'background'
        );

    page.style
        .removeProperty(
            'background-color'
        );

    page.style
        .removeProperty(
            'background-image'
        );

    page.style
        .setProperty(
            'background',
            runtimeBackground,
            'important'
        );

    page.style
        .setProperty(
            'background-image',
            'none',
            'important'
        );

    page.style
        .setProperty(
            'border-radius',
            `${Math.max(
                0,
                Number(
                    draft.radius
                ) ||
                0
            )}px`,
            'important'
        );

    page.style
        .setProperty(
            'padding',
            enabled
                ? '18px'
                : '0px',
            'important'
        );

    page.dataset
        .backdropPreviewV65 =
        isDaily
            ? 'daily'
            : 'other';
}


// Replace V63's final backdrop pass with the exact runtime-matching one.
const updateThemeBuilderPreviewBeforeBackdropMatchV65 =
    updateThemeBuilderPreview;

updateThemeBuilderPreview =
    function(
        modal
    ) {
        const result =
            updateThemeBuilderPreviewBeforeBackdropMatchV65(
                modal
            );

        requestAnimationFrame(
            () =>
                applyThemeBackdropPreviewV65(
                    modal
                )
        );

        return result;
    };


const rebuildActualThemeBuilderPreviewBeforeBackdropMatchV65 =
    rebuildActualThemeBuilderPreviewV5;

rebuildActualThemeBuilderPreviewV5 =
    function(
        modal
    ) {
        const result =
            rebuildActualThemeBuilderPreviewBeforeBackdropMatchV65(
                modal
            );

        requestAnimationFrame(
            () =>
                applyThemeBackdropPreviewV65(
                    modal
                )
        );

        return result;
    };


const populateThemeBuilderBeforeBackdropMatchV65 =
    populateThemeBuilder;

populateThemeBuilder =
    function(
        modal,
        theme
    ) {
        const result =
            populateThemeBuilderBeforeBackdropMatchV65(
                modal,
                theme
            );

        requestAnimationFrame(
            () =>
                applyThemeBackdropPreviewV65(
                    modal
                )
        );

        return result;
    };



// ============================================================
// V66 — QUIZ SETTINGS OPTIONAL PRACTICE LIVE REFRESH
// ============================================================

function refreshOptionalQuizPracticeSectionsV66() {
    // Build/rebuild the separate practice cards immediately from current
    // settings instead of waiting for updateQuizUI() or a page reload.
    renderQuizExtraPracticeSectionsV59();

    const host =
        document.getElementById(
            'quiz-extra-practice-host-v59'
        );

    if (!host) {
        return;
    }

    // If the user is currently on Quizzes, the newly enabled card should
    // become visible immediately. On every other page it remains hidden.
    const quizzesActive =
        !!quizzesView && (
        quizzesView.classList.contains('active') ||
        quizzesView.classList.contains('wb-quiz-portal-current-v507')
    );

    host.classList.toggle(
        'view-hidden-v60',
        !quizzesActive
    );

    host.classList.toggle(
        'hidden',
        !host.children.length
    );
}


function bindQuizPracticeLiveRefreshV66(
    modal =
        document.getElementById(
            'quiz-settings-modal-v58'
        )
) {
    if (
        !modal ||
        modal.dataset
            .quizPracticeLiveRefreshV66 ===
            'true'
    ) {
        return;
    }

    modal.dataset
        .quizPracticeLiveRefreshV66 =
        'true';

    const smart =
        modal.querySelector(
            '.quiz-smart-placeholder-toggle-v58'
        );

    if (smart) {
        smart.addEventListener(
            'change',
            event => {
                ensureQuizSettingsV58()
                    .smartPlaceholderPractice =
                    event.target.checked;

                // Update the Quizzes page now, before the save request
                // completes, so there is no reload requirement.
                refreshOptionalQuizPracticeSectionsV66();

                Promise.resolve(
                    saveDb()
                ).finally(
                    () => {
                        // One final render after persistence also keeps the
                        // UI synchronized if another wrapper updated state.
                        refreshOptionalQuizPracticeSectionsV66();
                    }
                );
            },
            true
        );
    }

    const field =
        modal.querySelector(
            '.quiz-transformation-toggle-v58'
        );

    if (field) {
        field.addEventListener(
            'change',
            event => {
                ensureQuizSettingsV58()
                    .transformationPractice =
                    event.target.checked;

                syncFieldToFieldRulesVisibilityV65(
                    modal
                );

                refreshOptionalQuizPracticeSectionsV66();

                Promise.resolve(
                    saveDb()
                ).finally(
                    () => {
                        syncFieldToFieldRulesVisibilityV65(
                            modal
                        );

                        refreshOptionalQuizPracticeSectionsV66();
                    }
                );
            },
            true
        );
    }
}


const ensureQuizSettingsModalBeforeV66 =
    ensureQuizSettingsModalV58;

ensureQuizSettingsModalV58 =
    function() {
        const modal =
            ensureQuizSettingsModalBeforeV66();

        bindQuizPracticeLiveRefreshV66(
            modal
        );

        return modal;
    };


const openQuizSettingsBeforeV66 =
    openQuizSettingsV58;

openQuizSettingsV58 =
    function() {
        const result =
            openQuizSettingsBeforeV66();

        const modal =
            document.getElementById(
                'quiz-settings-modal-v58'
            );

        bindQuizPracticeLiveRefreshV66(
            modal
        );

        refreshOptionalQuizPracticeSectionsV66();

        return result;
    };


// Also refresh every time the Quizzes page itself is shown.
const switchViewBeforeQuizPracticeRefreshV66 =
    switchView;

switchView =
    function(
        viewToShow
    ) {
        const result =
            switchViewBeforeQuizPracticeRefreshV66(
                viewToShow
            );

        if (
            viewToShow ===
            quizzesView
        ) {
            requestAnimationFrame(
                refreshOptionalQuizPracticeSectionsV66
            );
        }

        return result;
    };


requestAnimationFrame(
    () => {
        bindQuizPracticeLiveRefreshV66();
        refreshOptionalQuizPracticeSectionsV66();
    }
);



// ============================================================
// V67 — DASHBOARD PREVIEW MOTION + ZERO OUTER PAGE SCROLL
// ============================================================


// ------------------------------------------------------------
// 1) Dashboard preview motion gets its own authoritative animation layer.
// The normal log preview motion system remains unchanged.
// ------------------------------------------------------------

function forceDashboardPreviewMotionV67(
    modal
) {
    const host =
        modal?.querySelector(
            '.theme-builder-dashboard-preview-v40'
        );

    if (
        !host ||
        host.classList.contains(
            'hidden'
        )
    ) {
        return;
    }

    const draft =
        getThemeBuilderDraft(
            modal
        );

    const assignments =
        getPreviewSvgAssignmentsV10(
            modal,
            draft
        ) ||
        [];

    const stage =
        host.querySelector(
            '.theme-builder-dashboard-art-v40'
        );

    if (!stage) {
        return;
    }

    stage.classList.add(
        'theme-builder-dashboard-motion-stage-v67'
    );

    const items =
        Array.from(
            stage.querySelectorAll(
                '.theme-builder-dashboard-art-item-v40'
            )
        );

    items.forEach(
        (
            item,
            displayIndex
        ) => {
            const assignment =
                assignments[
                    displayIndex
                ] ||
                null;

            const asset =
                ensureSvgAdvancedDefaultsV10(
                    assignment?.svg
                );

            if (!asset) {
                return;
            }

            const animation =
                String(
                    asset.animation ||
                    'float'
                );

            item.dataset
                .dashboardAnimationV67 =
                animation;

            item.classList.add(
                'theme-builder-dashboard-motion-item-v67'
            );

            item.style
                .setProperty(
                    '--dashboard-preview-motion-delay-v67',
                    `${(displayIndex % 11) * -0.31}s`
                );

            let shell =
                item.querySelector(
                    ':scope > .theme-svg-motion-shell'
                );

            if (!shell) {
                const current =
                    item.innerHTML;

                item.innerHTML = `
                    <div class="theme-svg-motion-shell theme-image-motion-shell-v36">
                        ${current}
                    </div>
                `;

                shell =
                    item.querySelector(
                        ':scope > .theme-svg-motion-shell'
                    );
            }

            if (shell) {
                shell.style
                    .setProperty(
                        'animation-delay',
                        'var(--dashboard-preview-motion-delay-v67)',
                        'important'
                    );

                shell.style
                    .setProperty(
                        'animation-play-state',
                        'running',
                        'important'
                    );
            }
        }
    );

    // Preserve Auto / Always / Never bop selection in Dashboard preview.
    applyAutomaticIntroBoppersV60(
        stage,
        Array.isArray(
            modal._themeBackgroundSvgs
        )
            ? modal._themeBackgroundSvgs
            : [],
        draft.introSvgBopMode ||
        'some'
    );
}


const renderDashboardThemePreviewBeforeV67 =
    renderDashboardThemePreviewV40;

renderDashboardThemePreviewV40 =
    function(
        modal
    ) {
        const result =
            renderDashboardThemePreviewBeforeV67(
                modal
            );

        requestAnimationFrame(
            () =>
                forceDashboardPreviewMotionV67(
                    modal
                )
        );

        return result;
    };


const updateThemeBuilderPreviewBeforeDashboardMotionV67 =
    updateThemeBuilderPreview;

updateThemeBuilderPreview =
    function(
        modal
    ) {
        const result =
            updateThemeBuilderPreviewBeforeDashboardMotionV67(
                modal
            );

        requestAnimationFrame(
            () =>
                forceDashboardPreviewMotionV67(
                    modal
                )
        );

        return result;
    };


// ------------------------------------------------------------
// 2) Daily Logs and Quizzes are fixed viewport pages.
// The browser/body never becomes their scroll container.
// ------------------------------------------------------------

function syncFixedViewportPageV67(
    view =
        null
) {
    const current =
        view ||
        document.querySelector(
            '.view.active'
        );

    const lock =
        current ===
            gridView ||
        current ===
            quizzesView;

    document.body.classList.toggle(
        'fixed-viewport-page-v67',
        lock
    );

    document.documentElement.classList.toggle(
        'fixed-viewport-page-v67',
        lock
    );

    if (
        current ===
        gridView
    ) {
        const days =
            document.getElementById(
                'days-grid'
            );

        if (days) {
            const rect =
                days.getBoundingClientRect();

            const available =
                Math.max(
                    160,
                    Math.floor(
                        window.innerHeight -
                        rect.top -
                        20
                    )
                );

            days.style
                .setProperty(
                    '--daily-days-scroll-height-v67',
                    `${available}px`
                );
        }
    }

    if (
        current ===
        quizzesView
    ) {
        const extra =
            document.getElementById(
                'quiz-extra-practice-host-v59'
            );

        if (extra) {
            const rect =
                extra.getBoundingClientRect();

            const available =
                Math.max(
                    120,
                    Math.floor(
                        window.innerHeight -
                        rect.top -
                        18
                    )
                );

            extra.style
                .setProperty(
                    '--quiz-extra-scroll-height-v67',
                    `${available}px`
                );
        }
    }
}


const switchViewBeforeFixedViewportV67 =
    switchView;

switchView =
    function(
        viewToShow
    ) {
        const result =
            switchViewBeforeFixedViewportV67(
                viewToShow
            );

        requestAnimationFrame(
            () =>
                syncFixedViewportPageV67(
                    viewToShow
                )
        );

        return result;
    };


window.addEventListener(
    'resize',
    () =>
        syncFixedViewportPageV67()
);


requestAnimationFrame(
    () => {
        syncFixedViewportPageV67();

        const modal =
            document.getElementById(
                'theme-builder-modal'
            );

        if (modal) {
            forceDashboardPreviewMotionV67(
                modal
            );
        }
    }
);



// ============================================================
// V68 — PREVIEW GRADIENT + ICON COLOR PERSISTENCE /
// SEARCH BAR ROUNDNESS / NUMBER INPUTS FOR EVERY THEME SLIDER
// ============================================================

const THEME_SEARCH_RADIUS_DEFAULTS_V68 = {
    dailySearchRadiusV68: 10,
    knowledgeSearchRadiusV68: 10,
    customTabSearchRadiusV68: 11
};

function clampThemeNumberV68(value, min, max, fallback = 0) {
    const parsed = Number(value);
    if (!Number.isFinite(parsed)) return fallback;
    return Math.max(min, Math.min(max, parsed));
}

function themeSearchRadiusControlV68(label, className, value) {
    const clean = clampThemeNumberV68(value, 0, 50, 10);
    return `
        <label class="theme-builder-range-field theme-search-radius-field-v68">
            <span>
                ${escapeCustomHtml(label)}
                <output>${Math.round(clean)}px</output>
            </span>
            <input
                type="range"
                class="${escapeCustomHtml(className)}"
                min="0"
                max="50"
                step="1"
                value="${clean}"
            >
        </label>
    `;
}

function ensureThemeSearchRadiusControlsV68(modal, theme = null) {
    if (!modal) return null;

    let section = modal.querySelector('.theme-builder-search-radius-section-v68');
    if (!section) {
        section = document.createElement('section');
        section.className = 'theme-builder-control-section theme-builder-search-radius-section-v68';
        section.dataset.themeBuilderPanelGroup = 'colors';

        const shape = Array.from(modal.querySelectorAll('.theme-builder-control-section'))
            .find(node => node.querySelector('.theme-builder-sliders'));

        if (shape) shape.insertAdjacentElement('afterend', section);
        else modal.querySelector('.theme-builder-controls')?.appendChild(section);
    }

    const merged = {
        ...THEME_SEARCH_RADIUS_DEFAULTS_V68,
        ...(theme || {})
    };

    section.innerHTML = `
        <div class="theme-builder-control-heading">
            <strong>Search Bar Roundness</strong>
            <small>Set the corner roundness separately for Daily Logs, Knowledge Base, and custom-tab search bars.</small>
        </div>
        <div class="theme-builder-search-radius-grid-v68">
            ${themeSearchRadiusControlV68('Daily Logs Search Bars', 'theme-daily-search-radius-v68', merged.dailySearchRadiusV68)}
            ${themeSearchRadiusControlV68('Knowledge Base Search Bar', 'theme-knowledge-search-radius-v68', merged.knowledgeSearchRadiusV68)}
            ${themeSearchRadiusControlV68('Custom Tab Search Bars', 'theme-custom-search-radius-v68', merged.customTabSearchRadiusV68)}
        </div>
    `;

    section.querySelectorAll('input[type="range"]').forEach(input => {
        input.addEventListener('input', () => {
            const output = input.closest('label')?.querySelector('output');
            if (output) output.textContent = `${Math.round(Number(input.value) || 0)}px`;
            updateThemeBuilderPreview(modal);
        });
        input.addEventListener('change', () => updateThemeBuilderPreview(modal));
    });

    installThemeBuilderSectionTabsV11?.(modal);
    enhanceThemeBuilderRangeNumbersV68(modal);
    return section;
}

const getThemeBuilderDraftBeforeSearchRadiusV68 = getThemeBuilderDraft;
getThemeBuilderDraft = function(modal) {
    const draft = getThemeBuilderDraftBeforeSearchRadiusV68(modal);

    draft.dailySearchRadiusV68 = clampThemeNumberV68(
        modal?.querySelector('.theme-daily-search-radius-v68')?.value ?? draft.dailySearchRadiusV68,
        0, 50, THEME_SEARCH_RADIUS_DEFAULTS_V68.dailySearchRadiusV68
    );
    draft.knowledgeSearchRadiusV68 = clampThemeNumberV68(
        modal?.querySelector('.theme-knowledge-search-radius-v68')?.value ?? draft.knowledgeSearchRadiusV68,
        0, 50, THEME_SEARCH_RADIUS_DEFAULTS_V68.knowledgeSearchRadiusV68
    );
    draft.customTabSearchRadiusV68 = clampThemeNumberV68(
        modal?.querySelector('.theme-custom-search-radius-v68')?.value ?? draft.customTabSearchRadiusV68,
        0, 50, THEME_SEARCH_RADIUS_DEFAULTS_V68.customTabSearchRadiusV68
    );

    return {
        ...THEME_SEARCH_RADIUS_DEFAULTS_V68,
        ...draft
    };
};

function applySearchRadiusPreviewV68(modal) {
    const canvas = modal?.querySelector('.theme-builder-live-canvas');
    const page = canvas?.querySelector('.theme-builder-live-page');
    if (!canvas || !page) return;

    const draft = getThemeBuilderDraft(modal);
    const dailyRadius = `${clampThemeNumberV68(draft.dailySearchRadiusV68, 0, 50, 10)}px`;
    const kbRadius = `${clampThemeNumberV68(draft.knowledgeSearchRadiusV68, 0, 50, 10)}px`;
    const customRadius = `${clampThemeNumberV68(draft.customTabSearchRadiusV68, 0, 50, 11)}px`;
    const sourceId = canvas.dataset.previewSourceId || '';

    if (sourceId === 'grid-view' || sourceId === 'log-view') {
        page.querySelectorAll('.daily-log-search-box, .daily-global-search-box')
            .forEach(el => el.style.setProperty('border-radius', dailyRadius, 'important'));
    }

    if (sourceId === 'phrases-library-view') {
        page.querySelectorAll('[data-preview-original-id="phrases-search-bar"], .phrases-search-bar, input[class*="phrases-search"]')
            .forEach(el => {
                el.style.setProperty('border-radius', kbRadius, 'important');
                const parent = el.parentElement;
                if (parent && /search/i.test(parent.className || '')) {
                    parent.style.setProperty('border-radius', kbRadius, 'important');
                }
            });
    }

    if (page.dataset.customTabId || /^custom-tab-view-/i.test(sourceId)) {
        page.querySelectorAll('.custom-user-search, input[type="search"], input[class*="search"]')
            .forEach(el => el.style.setProperty('border-radius', customRadius, 'important'));
    }
}

function applySearchRadiusRuntimeV68(theme) {
    const root = document.documentElement;
    const body = document.body;
    const hasTheme = !!theme && typeof theme === 'object';

    body.classList.toggle('theme-search-radius-v68', hasTheme);
    if (!hasTheme) {
        [
            '--custom-theme-daily-search-radius-v68',
            '--custom-theme-kb-search-radius-v68',
            '--custom-theme-custom-search-radius-v68'
        ].forEach(name => root.style.removeProperty(name));
        return;
    }

    root.style.setProperty(
        '--custom-theme-daily-search-radius-v68',
        `${clampThemeNumberV68(theme.dailySearchRadiusV68, 0, 50, THEME_SEARCH_RADIUS_DEFAULTS_V68.dailySearchRadiusV68)}px`
    );
    root.style.setProperty(
        '--custom-theme-kb-search-radius-v68',
        `${clampThemeNumberV68(theme.knowledgeSearchRadiusV68, 0, 50, THEME_SEARCH_RADIUS_DEFAULTS_V68.knowledgeSearchRadiusV68)}px`
    );
    root.style.setProperty(
        '--custom-theme-custom-search-radius-v68',
        `${clampThemeNumberV68(theme.customTabSearchRadiusV68, 0, 50, THEME_SEARCH_RADIUS_DEFAULTS_V68.customTabSearchRadiusV68)}px`
    );
}

const applyThemeBeforeSearchRadiusV68 = applyTheme;
applyTheme = async function(themeValue, opts = {}) {
    const result = await applyThemeBeforeSearchRadiusV68(themeValue, opts);
    let theme = null;
    try { theme = resolveThemeCreativeDataV56?.(themeValue) || null; } catch {}
    applySearchRadiusRuntimeV68(theme);
    return result;
};

const applyCustomBuiltThemeBeforeSearchRadiusV68 = applyCustomBuiltTheme;
applyCustomBuiltTheme = function(theme = getCustomThemeSettings()) {
    const result = applyCustomBuiltThemeBeforeSearchRadiusV68(theme);
    applySearchRadiusRuntimeV68(theme || null);
    return result;
};

// ------------------------------------------------------------
// Preview gradient + tab icon color must survive every page/tab rebuild.
// ------------------------------------------------------------
function applyPersistentThemePreviewVisualsV68(modal) {
    if (!modal) return;
    const draft = getThemeBuilderDraft(modal);
    const gradient = String(draft.backgroundGradientV56 || '').trim();
    const image = String(draft.backgroundImage || '').trim();
    const canvas = modal.querySelector('.theme-builder-live-canvas');

    const backgroundImage = image
        ? `url("${image.replace(/"/g, '\\"')}")`
        : (gradient || 'none');

    if (canvas) {
        canvas.style.setProperty('background-color', draft.background || '#ffffff', 'important');
        canvas.style.setProperty('background-image', backgroundImage, 'important');
        canvas.style.setProperty('background-size', 'cover', 'important');
        canvas.style.setProperty('background-position', 'center', 'important');
        canvas.style.setProperty('--custom-theme-tab-icon-color', draft.tabIconColor || draft.text, 'important');

        const iconColor = draft.tabIconColor || draft.text;
        canvas.querySelectorAll(
            '.theme-builder-live-side-nav .icon-btn, ' +
            '.theme-builder-live-side-nav .custom-tab-nav-btn, ' +
            '.theme-builder-live-side-nav .icon-btn i, ' +
            '.theme-builder-live-side-nav .custom-tab-nav-btn i, ' +
            '.theme-builder-live-side-nav .icon-btn svg, ' +
            '.theme-builder-live-side-nav .custom-tab-nav-btn svg'
        ).forEach(el => {
            el.style.setProperty('color', iconColor, 'important');
            if (el.matches('svg')) el.style.setProperty('stroke', 'currentColor', 'important');
        });
    }

    const dashboard = modal.querySelector('.theme-builder-dashboard-preview-v40');
    if (dashboard) {
        dashboard.style.setProperty('background-color', draft.background || '#ffffff', 'important');
        dashboard.style.setProperty('background-image', backgroundImage, 'important');
        dashboard.style.setProperty('background-size', 'cover', 'important');
        dashboard.style.setProperty('background-position', 'center', 'important');
    }

    applySearchRadiusPreviewV68(modal);
}

const applyThemeBuilderDraftToActualPreviewBeforePersistV68 = applyThemeBuilderDraftToActualPreviewV5;
applyThemeBuilderDraftToActualPreviewV5 = function(modal) {
    const result = applyThemeBuilderDraftToActualPreviewBeforePersistV68(modal);
    requestAnimationFrame(() => applyPersistentThemePreviewVisualsV68(modal));
    return result;
};

const rebuildActualThemeBuilderPreviewBeforePersistV68 = rebuildActualThemeBuilderPreviewV5;
rebuildActualThemeBuilderPreviewV5 = function(modal) {
    const result = rebuildActualThemeBuilderPreviewBeforePersistV68(modal);
    requestAnimationFrame(() => applyPersistentThemePreviewVisualsV68(modal));
    return result;
};

const renderDashboardThemePreviewBeforePersistV68 = renderDashboardThemePreviewV40;
renderDashboardThemePreviewV40 = function(modal) {
    const result = renderDashboardThemePreviewBeforePersistV68(modal);
    requestAnimationFrame(() => applyPersistentThemePreviewVisualsV68(modal));
    return result;
};

const updateThemeBuilderPreviewBeforePersistV68 = updateThemeBuilderPreview;
updateThemeBuilderPreview = function(modal) {
    const result = updateThemeBuilderPreviewBeforePersistV68(modal);
    requestAnimationFrame(() => applyPersistentThemePreviewVisualsV68(modal));
    return result;
};

// ------------------------------------------------------------
// Every Theme Builder range slider gets a paired editable number field.
// ------------------------------------------------------------
function enhanceThemeBuilderRangeNumbersV68(modal = document.getElementById('theme-builder-modal')) {
    if (!modal) return;

    modal.querySelectorAll('input[type="range"]').forEach(range => {
        if (range.dataset.numberPairV68 === 'true') return;
        range.dataset.numberPairV68 = 'true';

        const row = document.createElement('div');
        row.className = 'theme-builder-slider-number-row-v68';
        range.parentNode.insertBefore(row, range);
        row.appendChild(range);

        const number = document.createElement('input');
        number.type = 'number';
        number.className = 'theme-builder-slider-number-v68';
        number.min = range.min || '0';
        number.max = range.max || '100';
        number.step = range.step || '1';
        number.value = range.value;
        number.setAttribute('aria-label', 'Type slider value');
        row.appendChild(number);

        const syncNumber = () => {
            if (document.activeElement !== number) number.value = range.value;
        };

        range.addEventListener('input', syncNumber);
        range.addEventListener('change', syncNumber);

        const setRangeFromNumber = (commit = false) => {
            let value = Number(number.value);
            if (!Number.isFinite(value)) return;
            const min = Number.isFinite(Number(range.min)) ? Number(range.min) : 0;
            const max = Number.isFinite(Number(range.max)) ? Number(range.max) : 100;
            value = Math.max(min, Math.min(max, value));
            range.value = String(value);
            range.dispatchEvent(new Event('input', { bubbles: true }));
            if (commit) range.dispatchEvent(new Event('change', { bubbles: true }));
        };

        number.addEventListener('input', () => setRangeFromNumber(false));
        number.addEventListener('change', () => {
            setRangeFromNumber(true);
            number.value = range.value;
        });
        number.addEventListener('keydown', event => {
            if (event.key === 'Enter') {
                event.preventDefault();
                setRangeFromNumber(true);
                number.blur();
            }
        });
    });
}

function installThemeBuilderRangeObserverV68(modal) {
    if (!modal || modal.dataset.rangeObserverV68 === 'true') return;
    modal.dataset.rangeObserverV68 = 'true';
    const controls = modal.querySelector('.theme-builder-controls') || modal;
    const observer = new MutationObserver(() => enhanceThemeBuilderRangeNumbersV68(modal));
    observer.observe(controls, { childList: true, subtree: true });
    modal._themeRangeObserverV68 = observer;
    enhanceThemeBuilderRangeNumbersV68(modal);
}

const populateThemeBuilderBeforeV68 = populateThemeBuilder;
populateThemeBuilder = function(modal, theme) {
    const result = populateThemeBuilderBeforeV68(modal, theme);
    ensureThemeSearchRadiusControlsV68(modal, {
        ...THEME_SEARCH_RADIUS_DEFAULTS_V68,
        ...(theme || {})
    });
    installThemeBuilderRangeObserverV68(modal);
    enhanceThemeBuilderRangeNumbersV68(modal);
    requestAnimationFrame(() => applyPersistentThemePreviewVisualsV68(modal));
    return result;
};

const ensureThemeBuilderModalBeforeV68 = ensureThemeBuilderModal;
ensureThemeBuilderModal = function() {
    const result = ensureThemeBuilderModalBeforeV68();
    const modal = document.getElementById('theme-builder-modal');
    if (modal) installThemeBuilderRangeObserverV68(modal);
    return result;
};

requestAnimationFrame(() => {
    const modal = document.getElementById('theme-builder-modal');
    if (modal) {
        installThemeBuilderRangeObserverV68(modal);
        applyPersistentThemePreviewVisualsV68(modal);
    }
});


// ============================================================
// V69 — DASHBOARD TITLE / CURRENT DASHBOARD PREVIEW / FAST PREVIEW SWITCHING /
// ARTWORK SAFETY / DASHBOARD-STUDIO HANDSHAKE
// ============================================================

const DASHBOARD_TITLE_DEFAULT_V69 =
    'MY LOGS';

function cleanDashboardTitleV69(
    value
) {
    const clean =
        String(
            value ??
            ''
        )
            .replace(
                /\s+/g,
                ' '
            )
            .trim()
            .slice(
                0,
                48
            );

    return (
        clean ||
        DASHBOARD_TITLE_DEFAULT_V69
    );
}


// ------------------------------------------------------------
// Theme identity section — Theme Name + Dashboard "My Logs" text.
// ------------------------------------------------------------

function ensureThemeIdentityControlsV69(
    modal,
    theme =
        null
) {
    const host =
        modal?.querySelector(
            '.theme-builder-controls'
        );

    if (!host) {
        return null;
    }

    let section =
        host.querySelector(
            '.theme-builder-identity-section-v69'
        );

    if (!section) {
        section =
            document.createElement(
                'section'
            );

        section.className =
            'theme-builder-control-section theme-builder-identity-section-v69';

        section.dataset
            .themeBuilderPanelGroup =
            'colors';

        section.innerHTML = `
            <div class="theme-builder-control-heading">
                <strong>Theme Identity</strong>
            </div>

            <div class="theme-builder-identity-fields-v69"></div>
        `;

        const tabs =
            host.querySelector(
                '.theme-builder-section-tabs-v11'
            );

        if (tabs) {
            tabs.insertAdjacentElement(
                'afterend',
                section
            );
        } else {
            host.prepend(
                section
            );
        }
    }

    const fields =
        section.querySelector(
            '.theme-builder-identity-fields-v69'
        );

    let nameField =
        host.querySelector(
            ':scope > label.theme-builder-field > input[data-theme-key="name"]'
        )
            ?.closest(
                'label'
            );

    if (
        nameField &&
        nameField.parentElement !==
            fields
    ) {
        fields.prepend(
            nameField
        );
    }

    let dashboardTitle =
        fields.querySelector(
            '.theme-builder-dashboard-title-field-v69'
        );

    if (!dashboardTitle) {
        dashboardTitle =
            document.createElement(
                'label'
            );

        dashboardTitle.className =
            'theme-builder-field theme-builder-dashboard-title-field-v69';

        dashboardTitle.innerHTML = `
            <span>Dashboard “My Logs” Text</span>

            <input
                type="text"
                class="theme-builder-dashboard-title-v69"
                maxlength="48"
                spellcheck="false"
                placeholder="MY LOGS"
            >
        `;

        fields.appendChild(
            dashboardTitle
        );

        dashboardTitle
            .querySelector(
                '.theme-builder-dashboard-title-v69'
            )
            ?.addEventListener(
                'input',
                () =>
                    updateThemeBuilderPreview(
                        modal
                    )
            );
    }

    const input =
        section.querySelector(
            '.theme-builder-dashboard-title-v69'
        );

    if (input) {
        const incoming =
            theme?.dashboardTitleV69;

        if (
            incoming !==
            undefined
        ) {
            input.value =
                cleanDashboardTitleV69(
                    incoming
                );
        } else if (
            !input.value
        ) {
            input.value =
                DASHBOARD_TITLE_DEFAULT_V69;
        }
    }

    return section;
}


const getThemeBuilderDraftBeforeDashboardTitleV69 =
    getThemeBuilderDraft;

getThemeBuilderDraft =
    function(
        modal
    ) {
        const draft =
            getThemeBuilderDraftBeforeDashboardTitleV69(
                modal
            );

        draft.dashboardTitleV69 =
            cleanDashboardTitleV69(
                modal
                    ?.querySelector(
                        '.theme-builder-dashboard-title-v69'
                    )
                    ?.value ??
                draft.dashboardTitleV69
            );

        return draft;
    };


// ------------------------------------------------------------
// Accordion/tabs are owned by the single Theme Builder UI installer in template-extras-1.js.
// No versioned accordion controller runs here.
// ------------------------------------------------------------

// ------------------------------------------------------------
// Dashboard preview — current layout, custom title, guaranteed animation.
// ------------------------------------------------------------

function dashboardPreviewMotionValueV69(
    animation
) {
    switch (
        String(
            animation ||
            'float'
        )
    ) {
        case 'bob':
            return 'dashboard-preview-bob-v67 1.55s ease-in-out infinite alternate';

        case 'drift':
            return 'dashboard-preview-drift-v67 7.8s ease-in-out infinite alternate';

        case 'spin':
            return 'dashboard-preview-spin-v67 8.5s linear infinite';

        case 'pulse':
            return 'dashboard-preview-pulse-v67 2s ease-in-out infinite alternate';

        case 'still':
            return 'none';

        case 'float':
        default:
            return 'dashboard-preview-float-v67 4.8s ease-in-out infinite alternate';
    }
}


function forceDashboardPreviewMotionV69(
    modal
) {
    const host =
        modal?.querySelector(
            '.theme-builder-dashboard-preview-v40'
        );

    if (!host) {
        return;
    }

    const draft =
        getThemeBuilderDraft(
            modal
        );

    const assignments =
        getPreviewSvgAssignmentsV10(
            modal,
            draft
        ) ||
        [];

    const stage =
        host.querySelector(
            '.theme-builder-dashboard-art-v40'
        );

    if (!stage) {
        return;
    }

    stage.classList.add(
        'theme-builder-dashboard-motion-stage-v67',
        'theme-builder-dashboard-motion-stage-v69'
    );

    stage
        .querySelectorAll(
            '.theme-builder-dashboard-art-item-v40'
        )
        .forEach(
            (
                item,
                index
            ) => {
                const assignment =
                    assignments[
                        index
                    ];

                const asset =
                    ensureSvgAdvancedDefaultsV10(
                        assignment
                            ?.svg
                    );

                if (!asset) {
                    return;
                }

                item.dataset
                    .svgIndex =
                    String(
                        Number.isFinite(
                            Number(
                                assignment
                                    ?.originalIndex
                            )
                        )
                            ? Number(
                                assignment
                                    .originalIndex
                            )
                            : index
                    );

                let shell =
                    item.querySelector(
                        ':scope > .theme-svg-motion-shell'
                    );

                if (!shell) {
                    const current =
                        item.innerHTML;

                    item.innerHTML = `
                        <div class="theme-svg-motion-shell theme-image-motion-shell-v36">
                            ${current}
                        </div>
                    `;

                    shell =
                        item.querySelector(
                            ':scope > .theme-svg-motion-shell'
                        );
                }

                if (!shell) {
                    return;
                }

                shell.style.setProperty(
                    'animation',
                    dashboardPreviewMotionValueV69(
                        asset.animation
                    ),
                    'important'
                );

                shell.style.setProperty(
                    'animation-delay',
                    `${(index % 11) * -0.31}s`,
                    'important'
                );

                shell.style.setProperty(
                    'animation-play-state',
                    'running',
                    'important'
                );

                shell.style.setProperty(
                    'will-change',
                    'transform',
                    'important'
                );
            }
        );

    applyAutomaticIntroBoppersV60?.(
        stage,
        Array.isArray(
            modal._themeBackgroundSvgs
        )
            ? modal._themeBackgroundSvgs
            : [],
        draft.introSvgBopMode ||
        'some'
    );
}


renderDashboardThemePreviewV40 =
    function(
        modal
    ) {
        const host =
            modal?.querySelector(
                '.theme-builder-dashboard-preview-v40'
            );

        if (!host) {
            return;
        }

        const draft =
            getThemeBuilderDraft(
                modal
            );

        const bg =
            draft.dashboardBackgroundV40 ||
            draft.background;

        const card =
            draft.dashboardCardV40 ||
            draft.surface;

        const text =
            draft.dashboardTextV40 ||
            draft.text;

        const accent =
            draft.dashboardAccentV40 ||
            draft.accent;

        host.style.setProperty(
            '--dash-preview-bg',
            bg
        );

        host.style.setProperty(
            '--dash-preview-card',
            card
        );

        host.style.setProperty(
            '--dash-preview-text',
            text
        );

        host.style.setProperty(
            '--dash-preview-accent',
            accent
        );

        const assignments =
            getPreviewSvgAssignmentsV10(
                modal,
                draft
            ) ||
            [];

        host.innerHTML = `
            <div class="theme-builder-dashboard-art-v40">
                ${assignments
                    .map(
                        assignment => `
                            <div
                                class="theme-builder-dashboard-art-item-v40"
                                style="
                                    left:${Number(assignment.left) || 50}%;
                                    top:${Number(assignment.top) || 50}%;
                                "
                            >
                                <div class="theme-svg-motion-shell theme-image-motion-shell-v36">
                                    ${renderThemeImageAssetV36(
                                        assignment.svg
                                    )}
                                </div>
                            </div>
                        `
                    )
                    .join('')}
            </div>

            <h2 class="theme-builder-dashboard-title-v69">
                ${escapeCustomHtml(
                    cleanDashboardTitleV69(
                        draft.dashboardTitleV69
                    )
                )}
            </h2>

            <div class="theme-builder-dashboard-actions-v40" aria-label="Dashboard tools">
                <span><i class="ph ph-hard-drives"></i></span>
                <span><i class="ph ph-trash"></i></span>
                <span><i class="ph ph-palette"></i></span>
            </div>

            <div class="theme-builder-dashboard-filter-v40">
                <span class="active">All</span>
                <span>School</span>
                <span>Non-School</span>
            </div>

            <div class="theme-builder-dashboard-cards-v40">
                <div class="theme-builder-dashboard-card-v40">
                    <i class="ph ph-translate"></i>
                    <span>French</span>
                </div>

                <div class="theme-builder-dashboard-card-v40">
                    <i class="ph ph-guitar"></i>
                    <span>Guitar</span>
                </div>

                <div class="theme-builder-dashboard-card-v40">
                    <i class="ph ph-calculator"></i>
                    <span>Calculus</span>
                </div>
            </div>
        `;

        applyPersistentThemePreviewVisualsV68?.(
            modal
        );

        forceDashboardPreviewMotionV69(
            modal
        );

        normalizeDashboardArtworkLayerV60?.(
            modal
        );

        bindManualImageDraggingV40?.(
            modal
        );
    };


// ------------------------------------------------------------
// Preserve artwork aggressively so Theme Builder previews can never
// accidentally save a paged/empty gallery over the real custom theme.
// ------------------------------------------------------------

function cloneThemeArtworkV69(
    assets
) {
    return Array.isArray(
        assets
    )
        ? assets.map(
            asset => ({
                ...asset
            })
        )
        : [];
}


function themeBuilderArtworkKeyV69(
    modal,
    theme =
        null
) {
    return String(
        modal
            ?.dataset
            ?.themeBuilderEditingCopyV30 ||
        modal
            ?.dataset
            ?.themeBuilderEditingThemeV25 ||
        theme?.id ||
        theme?.name ||
        'new-theme'
    );
}


function captureThemeArtworkSnapshotV69(
    modal,
    force =
        false
) {
    if (!modal) {
        return;
    }

    const current =
        Array.isArray(
            modal._themeBackgroundSvgs
        )
            ? modal._themeBackgroundSvgs
            : [];

    if (
        force ||
        current.length ||
        modal._themeImagesIntentionallyEditedV69
    ) {
        modal._themeArtworkSnapshotV69 =
            cloneThemeArtworkV69(
                current
            );
    }
}


const deleteSelectedThemeImagesBeforeV69 =
    deleteSelectedThemeImagesV37;

deleteSelectedThemeImagesV37 =
    async function(
        modal,
        explicitIndexes =
            null
    ) {
        if (modal) {
            modal._themeImagesIntentionallyEditedV69 =
                true;
        }

        const result =
            await deleteSelectedThemeImagesBeforeV69(
                modal,
                explicitIndexes
            );

        captureThemeArtworkSnapshotV69(
            modal,
            true
        );

        return result;
    };


const renderThemeBuilderSvgListBeforeArtworkSafetyV69 =
    renderThemeBuilderSvgListV2;

renderThemeBuilderSvgListV2 =
    function(
        modal
    ) {
        if (
            modal &&
            (
                !Array.isArray(
                    modal._themeBackgroundSvgs
                ) ||
                !modal
                    ._themeBackgroundSvgs
                    .length
            ) &&
            Array.isArray(
                modal._themeArtworkSnapshotV69
            ) &&
            modal
                ._themeArtworkSnapshotV69
                .length &&
            !modal._themeImagesIntentionallyEditedV69
        ) {
            modal._themeBackgroundSvgs =
                cloneThemeArtworkV69(
                    modal._themeArtworkSnapshotV69
                );
        }

        const result =
            renderThemeBuilderSvgListBeforeArtworkSafetyV69(
                modal
            );

        captureThemeArtworkSnapshotV69(
            modal
        );

        return result;
    };


const getThemeBuilderDraftBeforeArtworkSafetyV69 =
    getThemeBuilderDraft;

getThemeBuilderDraft =
    function(
        modal
    ) {
        if (
            modal &&
            (
                !Array.isArray(
                    modal._themeBackgroundSvgs
                ) ||
                !modal
                    ._themeBackgroundSvgs
                    .length
            ) &&
            Array.isArray(
                modal._themeArtworkSnapshotV69
            ) &&
            modal
                ._themeArtworkSnapshotV69
                .length &&
            !modal._themeImagesIntentionallyEditedV69
        ) {
            modal._themeBackgroundSvgs =
                cloneThemeArtworkV69(
                    modal._themeArtworkSnapshotV69
                );
        }

        const draft =
            getThemeBuilderDraftBeforeArtworkSafetyV69(
                modal
            );

        if (
            (
                !Array.isArray(
                    draft.backgroundSvgs
                ) ||
                !draft
                    .backgroundSvgs
                    .length
            ) &&
            Array.isArray(
                modal
                    ?._themeArtworkSnapshotV69
            ) &&
            modal
                ._themeArtworkSnapshotV69
                .length &&
            !modal
                ?._themeImagesIntentionallyEditedV69
        ) {
            draft.backgroundSvgs =
                cloneThemeArtworkV69(
                    modal._themeArtworkSnapshotV69
                );
        }

        return draft;
    };


// ------------------------------------------------------------
// Fast preview-tab switching: keep the already-loaded artwork DOM instead
// of reconstructing every image each time a user clicks a preview nav icon.
// ------------------------------------------------------------

const forceThemeArtworkPreviewBeforeFastV69 =
    forceThemeArtworkPreviewV60;

forceThemeArtworkPreviewV60 =
    function(
        modal
    ) {
        if (
            modal
                ?._fastPreviewSwitchV69
        ) {
            return;
        }

        return forceThemeArtworkPreviewBeforeFastV69(
            modal
        );
    };


const renderThemeArtworkPreviewBeforeFastV69 =
    renderThemeArtworkPreviewV61;

renderThemeArtworkPreviewV61 =
    function(
        modal
    ) {
        if (
            modal
                ?._fastPreviewSwitchV69
        ) {
            return;
        }

        return renderThemeArtworkPreviewBeforeFastV69(
            modal
        );
    };


function applyFastPreviewFinishingV69(
    modal
) {
    applyPersistentThemePreviewVisualsV68?.(
        modal
    );

    applyHeadingPreviewV62?.(
        modal
    );

    applyThemeBackdropPreviewV65?.(
        modal
    );

    applyKnowledgeCardOpacityPreviewV63?.(
        modal
    );

    applySearchRadiusPreviewV68?.(
        modal
    );

    bindThemeBuilderDayCardsV12?.(
        modal
    );

    requestAnimationFrame(
        () =>
            fitActualThemeBuilderPreviewV9?.(
                modal
            )
    );
}


const bindThemeBuilderPreviewTabsBeforeFastV69 =
    bindThemeBuilderPreviewTabsV10;

bindThemeBuilderPreviewTabsV10 =
    function(
        modal
    ) {
        bindThemeBuilderPreviewTabsBeforeFastV69(
            modal
        );

        const nav =
            modal?.querySelector(
                '.theme-builder-live-side-nav'
            );

        if (
            !nav ||
            nav.dataset
                .fastPreviewTabsV69 ===
                'true'
        ) {
            return;
        }

        nav.dataset
            .fastPreviewTabsV69 =
            'true';

        nav.addEventListener(
            'click',
            event => {
                const button =
                    event.target.closest(
                        'button, a.icon-btn'
                    );

                if (!button) {
                    return;
                }

                const targetId =
                    getThemeBuilderPreviewTargetIdV10(
                        button
                    );

                if (!targetId) {
                    return;
                }

                event.preventDefault();
                event.stopPropagation();
                event.stopImmediatePropagation();

                if (
                    modal
                        ._themeBuilderPreviewSourceId ===
                    targetId
                ) {
                    return;
                }

                const oldPage =
                    modal.querySelector(
                        '.theme-builder-live-page'
                    );

                const artwork =
                    oldPage?.querySelector(
                        ':scope > .theme-builder-live-art-stage-v61'
                    ) ||
                    oldPage?.querySelector(
                        ':scope > .theme-builder-live-art-stage-v60'
                    ) ||
                    null;

                artwork?.remove();

                modal._themeBuilderPreviewSourceId =
                    targetId;

                modal._fastPreviewSwitchV69 =
                    true;

                rebuildActualThemeBuilderPreviewV5(
                    modal
                );

                const newPage =
                    modal.querySelector(
                        '.theme-builder-live-page'
                    );

                if (
                    artwork &&
                    newPage
                ) {
                    newPage.prepend(
                        artwork
                    );
                }

                applyFastPreviewFinishingV69(
                    modal
                );

                requestAnimationFrame(
                    () =>
                        requestAnimationFrame(
                            () => {
                                modal._fastPreviewSwitchV69 =
                                    false;
                            }
                        )
                );
            },
            true
        );
    };


// ------------------------------------------------------------
// Built-in editor Restore action: icon only + equal-width bottom actions.
// ------------------------------------------------------------

const ensureRestoreOriginalButtonBeforeIconV69 =
    ensureRestoreOriginalButtonV27;

ensureRestoreOriginalButtonV27 =
    function(
        modal,
        themeId,
        themeName
    ) {
        const result =
            ensureRestoreOriginalButtonBeforeIconV69(
                modal,
                themeId,
                themeName
            );

        const button =
            modal?.querySelector(
                '.theme-builder-restore-original-v27'
            );

        if (button) {
            button.innerHTML =
                '<i class="ph ph-arrow-u-up-left"></i>';

            button.setAttribute(
                'aria-label',
                'Restore original theme'
            );
        }

        return result;
    };


// ------------------------------------------------------------
// Dashboard Theme Studio host: make the iframe transparent except for the
// builder, and tell the Dashboard only after the modal is actually ready.
// ------------------------------------------------------------

function notifyDashboardThemeStudioReadyV69() {
    if (
        !isDashboardThemeStudioV43?.()
    ) {
        return;
    }

    document.body.classList.add(
        'dashboard-theme-studio-host-v43',
        'dashboard-theme-studio-host-v69'
    );

    const modal =
        document.getElementById(
            'theme-builder-modal'
        );

    if (
        !modal ||
        modal.classList.contains(
            'hidden'
        )
    ) {
        return;
    }

    window.parent?.postMessage(
        {
            type:
                'dashboard-theme-studio-ready-v69',
            studioSessionV283: new URLSearchParams(location.search).get('studioSessionV283') || '',
            studioActionV283: new URLSearchParams(location.search).get('dashboardThemeAction') || ''
        },
        window.location.origin
    );
}


function wrapDashboardStudioOpenV69(
    fn
) {
    return async function(
        ...args
    ) {
        const result =
            await fn.apply(
                this,
                args
            );

        requestAnimationFrame(
            () =>
                notifyDashboardThemeStudioReadyV69()
        );

        return result;
    };
}


openNewThemeBuilderCleanV34 =
    wrapDashboardStudioOpenV69(
        openNewThemeBuilderCleanV34
    );

openThemeCopyInBuilderV30 =
    wrapDashboardStudioOpenV69(
        openThemeCopyInBuilderV30
    );

openAnyThemeInBuilderV25 =
    wrapDashboardStudioOpenV69(
        openAnyThemeInBuilderV25
    );

openExistingCustomThemeFromPickerV7 =
    wrapDashboardStudioOpenV69(
        openExistingCustomThemeFromPickerV7
    );


// ------------------------------------------------------------
// Final Theme Builder population.
// ------------------------------------------------------------

const populateThemeBuilderBeforeV69 =
    populateThemeBuilder;

populateThemeBuilder =
    function(
        modal,
        theme
    ) {
        const key =
            themeBuilderArtworkKeyV69(
                modal,
                theme
            );

        if (
            modal &&
            modal._themeArtworkKeyV69 !==
                key
        ) {
            modal._themeArtworkKeyV69 =
                key;

            modal._themeImagesIntentionallyEditedV69 =
                false;

            modal._themeArtworkSnapshotV69 =
                cloneThemeArtworkV69(
                    theme
                        ?.backgroundSvgs
                );
        }

        const result =
            populateThemeBuilderBeforeV69(
                modal,
                theme
            );

        ensureThemeIdentityControlsV69(
            modal,
            theme
        );

        if (
            (
                !Array.isArray(
                    modal
                        ?._themeBackgroundSvgs
                ) ||
                !modal
                    ._themeBackgroundSvgs
                    .length
            ) &&
            Array.isArray(
                modal
                    ?._themeArtworkSnapshotV69
            ) &&
            modal
                ._themeArtworkSnapshotV69
                .length &&
            !modal
                ._themeImagesIntentionallyEditedV69
        ) {
            modal._themeBackgroundSvgs =
                cloneThemeArtworkV69(
                    modal._themeArtworkSnapshotV69
                );

            renderThemeBuilderSvgListV2(
                modal
            );
        } else {
            captureThemeArtworkSnapshotV69(
                modal
            );
        }

        installThemeBuilderSectionTabsV11(
            modal
        );

        bindThemeBuilderPreviewTabsV10(
            modal
        );

        requestAnimationFrame(
            () => {
                applyPersistentThemePreviewVisualsV68?.(
                    modal
                );

                forceDashboardPreviewMotionV69(
                    modal
                );

                notifyDashboardThemeStudioReadyV69();
            }
        );

        return result;
    };


requestAnimationFrame(
    () => {
        const modal =
            document.getElementById(
                'theme-builder-modal'
            );

        if (modal) {
            ensureThemeIdentityControlsV69(
                modal,
                getThemeBuilderDraft(
                    modal
                )
            );

            installThemeBuilderSectionTabsV11(
                modal
            );
        }

        notifyDashboardThemeStudioReadyV69();
    }
);



// V69 wide-page viewport class.
const switchViewBeforeWideMainPageV69 =
    switchView;

switchView =
    function(
        viewToShow
    ) {
        const result =
            switchViewBeforeWideMainPageV69(
                viewToShow
            );

        document.body.classList.toggle(
            'wide-main-page-v69',
            [
                gridView,
                quizzesView,
                phrasesLibraryView,
                toolboxView
            ].includes(
                viewToShow
            )
        );

        return result;
    };

requestAnimationFrame(
    () => {
        const active =
            document.querySelector(
                '.view.active'
            );

        document.body.classList.toggle(
            'wide-main-page-v69',
            [
                gridView,
                quizzesView,
                phrasesLibraryView,
                toolboxView
            ].includes(
                active
            )
        );
    }
);



// ============================================================
// V70 — NEVER LOSE CUSTOM THEME ARTWORK
// ============================================================


// ------------------------------------------------------------
// Accordion rebuilding was retired. The canonical installer in V82 owns the
// structure; V70 now only protects custom artwork.
// ------------------------------------------------------------

// ------------------------------------------------------------
// 2) Canonical artwork vault.
// Never let a temporary empty/paged preview array overwrite a real custom theme.
// ------------------------------------------------------------

function cloneThemeArtworkV70(
    assets
) {
    return Array.isArray(
        assets
    )
        ? assets.map(
            asset => ({
                ...asset
            })
        )
        : [];
}


function persistentArtworkCandidatesV70(
    modal,
    incomingTheme =
        null
) {
    const candidates =
        [];

    if (
        Array.isArray(
            incomingTheme
                ?.backgroundSvgs
        )
    ) {
        candidates.push(
            incomingTheme
                .backgroundSvgs
        );
    }

    const copyId =
        modal?.dataset
            ?.themeBuilderEditingCopyV30 ||
        '';

    if (copyId) {
        try {
            const copy =
                getThemeCopyV30(
                    copyId
                );

            if (
                Array.isArray(
                    copy?.theme
                        ?.backgroundSvgs
                )
            ) {
                candidates.push(
                    copy.theme
                        .backgroundSvgs
                );
            }
        } catch {}
    }

    const editingThemeId =
        modal?.dataset
            ?.themeBuilderEditingThemeV25 ||
        '';

    if (
        editingThemeId ===
            'theme-custom-builder' ||
        db?.settings?.theme ===
            'theme-custom-builder'
    ) {
        try {
            const custom =
                getCustomThemeSettings();

            if (
                Array.isArray(
                    custom
                        ?.backgroundSvgs
                )
            ) {
                candidates.push(
                    custom
                        .backgroundSvgs
                );
            }
        } catch {}
    }

    if (
        isDashboardThemeStudioV43?.() &&
        getDashboardThemeStudioActionV43?.() ===
            'edit'
    ) {
        try {
            const id =
                getDashboardThemeStudioIdV43();

            const entry =
                readSharedThemeLibraryForStudioV43()
                    .find(
                        item =>
                            item.id ===
                            id
                    );

            if (
                Array.isArray(
                    entry?.theme
                        ?.backgroundSvgs
                )
            ) {
                candidates.push(
                    entry.theme
                        .backgroundSvgs
                );
            }
        } catch {}
    }

    try {
        const activeTheme =
            resolveThemeCreativeDataV56?.(
                copyId ||
                editingThemeId ||
                db?.settings?.theme
            );

        if (
            Array.isArray(
                activeTheme
                    ?.backgroundSvgs
            )
        ) {
            candidates.push(
                activeTheme
                    .backgroundSvgs
            );
        }
    } catch {}

    return candidates;
}


function bestPersistentArtworkV70(
    modal,
    incomingTheme =
        null
) {
    const candidates =
        persistentArtworkCandidatesV70(
            modal,
            incomingTheme
        );

    const nonEmpty =
        candidates.find(
            list =>
                Array.isArray(
                    list
                ) &&
                list.length
        );

    return cloneThemeArtworkV70(
        nonEmpty ||
        candidates[0] ||
        []
    );
}


function seedCanonicalArtworkV70(
    modal,
    incomingTheme =
        null
) {
    if (!modal) {
        return;
    }

    const persistent =
        bestPersistentArtworkV70(
            modal,
            incomingTheme
        );

    if (
        persistent.length
    ) {
        modal._themeCanonicalArtworkV70 =
            persistent;

        modal._themeArtworkExplicitlyClearedV70 =
            false;
    } else if (
        !Array.isArray(
            modal
                ._themeCanonicalArtworkV70
        )
    ) {
        modal._themeCanonicalArtworkV70 =
            [];
    }
}


function restoreCanonicalArtworkIfNeededV70(
    modal
) {
    if (
        !modal ||
        modal._themeArtworkExplicitlyClearedV70
    ) {
        return;
    }

    const current =
        Array.isArray(
            modal._themeBackgroundSvgs
        )
            ? modal._themeBackgroundSvgs
            : [];

    const canonical =
        Array.isArray(
            modal
                ._themeCanonicalArtworkV70
        )
            ? modal
                ._themeCanonicalArtworkV70
            : [];

    if (
        !current.length &&
        canonical.length
    ) {
        modal._themeBackgroundSvgs =
            cloneThemeArtworkV70(
                canonical
            );
    }
}


function updateCanonicalArtworkV70(
    modal
) {
    if (!modal) {
        return;
    }

    const current =
        Array.isArray(
            modal._themeBackgroundSvgs
        )
            ? modal._themeBackgroundSvgs
            : [];

    if (
        current.length
    ) {
        modal._themeCanonicalArtworkV70 =
            cloneThemeArtworkV70(
                current
            );

        modal._themeArtworkExplicitlyClearedV70 =
            false;
    } else if (
        modal._themeArtworkExplicitlyClearedV70
    ) {
        modal._themeCanonicalArtworkV70 =
            [];
    }
}


// Final get-draft safety: a temporary empty gallery can never become persisted.
const getThemeBuilderDraftBeforeCanonicalV70 =
    getThemeBuilderDraft;

getThemeBuilderDraft =
    function(
        modal
    ) {
        restoreCanonicalArtworkIfNeededV70(
            modal
        );

        const draft =
            getThemeBuilderDraftBeforeCanonicalV70(
                modal
            );

        const canonical =
            Array.isArray(
                modal
                    ?._themeCanonicalArtworkV70
            )
                ? modal
                    ._themeCanonicalArtworkV70
                : [];

        if (
            !modal
                ?._themeArtworkExplicitlyClearedV70 &&
            (
                !Array.isArray(
                    draft.backgroundSvgs
                ) ||
                !draft
                    .backgroundSvgs
                    .length
            ) &&
            canonical.length
        ) {
            draft.backgroundSvgs =
                cloneThemeArtworkV70(
                    canonical
                );
        }

        if (
            Array.isArray(
                draft.backgroundSvgs
            ) &&
            draft.backgroundSvgs
                .length
        ) {
            modal._themeCanonicalArtworkV70 =
                cloneThemeArtworkV70(
                    draft.backgroundSvgs
                );
        }

        return draft;
    };


// Track single-image deletion too.
const confirmDeleteThemeBuilderSvgBeforeCanonicalV70 =
    confirmDeleteThemeBuilderSvg;

confirmDeleteThemeBuilderSvg =
    async function(
        modal,
        index
    ) {
        const before =
            Array.isArray(
                modal
                    ?._themeBackgroundSvgs
            )
                ? modal
                    ._themeBackgroundSvgs
                    .length
                : 0;

        const result =
            await confirmDeleteThemeBuilderSvgBeforeCanonicalV70(
                modal,
                index
            );

        const after =
            Array.isArray(
                modal
                    ?._themeBackgroundSvgs
            )
                ? modal
                    ._themeBackgroundSvgs
                    .length
                : 0;

        if (
            after !==
            before
        ) {
            modal._themeArtworkExplicitlyClearedV70 =
                after ===
                    0;

            updateCanonicalArtworkV70(
                modal
            );
        }

        return result;
    };


// Track bulk deletion too.
const deleteSelectedThemeImagesBeforeCanonicalV70 =
    deleteSelectedThemeImagesV37;

deleteSelectedThemeImagesV37 =
    async function(
        modal,
        explicitIndexes =
            null
    ) {
        const result =
            await deleteSelectedThemeImagesBeforeCanonicalV70(
                modal,
                explicitIndexes
            );

        const count =
            Array.isArray(
                modal
                    ?._themeBackgroundSvgs
            )
                ? modal
                    ._themeBackgroundSvgs
                    .length
                : 0;

        modal._themeArtworkExplicitlyClearedV70 =
            count ===
                0;

        updateCanonicalArtworkV70(
            modal
        );

        return result;
    };


function bindArtworkUploadTrackingV70(
    modal
) {
    const input =
        modal?.querySelector(
            '.theme-builder-svg-file'
        );

    if (
        !input ||
        input.dataset
            .artworkTrackingV70 ===
            'true'
    ) {
        return;
    }

    input.dataset
        .artworkTrackingV70 =
        'true';

    input.addEventListener(
        'change',
        () => {
            setTimeout(
                () => {
                    const count =
                        Array.isArray(
                            modal
                                ._themeBackgroundSvgs
                        )
                            ? modal
                                ._themeBackgroundSvgs
                                .length
                            : 0;

                    if (
                        count
                    ) {
                        modal._themeArtworkExplicitlyClearedV70 =
                            false;

                        updateCanonicalArtworkV70(
                            modal
                        );
                    }
                },
                0
            );
        },
        true
    );
}


// ------------------------------------------------------------
// 3) Remove V69's risky fast-preview DOM-moving optimization.
// Rebind the preview nav using the stable pre-V69 behavior.
// ------------------------------------------------------------

function restoreStablePreviewNavigationV70(
    modal
) {
    const nav =
        modal?.querySelector(
            '.theme-builder-live-side-nav'
        );

    if (
        !nav ||
        nav.dataset
            .stablePreviewV70 ===
            'true'
    ) {
        return;
    }

    const clone =
        nav.cloneNode(
            true
        );

    clone.dataset
        .stablePreviewV70 =
        'true';

    clone.removeAttribute(
        'data-fast-preview-tabs-v69'
    );

    nav.replaceWith(
        clone
    );

    // Use the stable binder captured before V69's fast-navigation override.
    bindThemeBuilderPreviewTabsBeforeFastV69?.(
        modal
    );
}


// ------------------------------------------------------------
// 4) Final population repair.
// ------------------------------------------------------------

const populateThemeBuilderBeforeV70 =
    populateThemeBuilder;

populateThemeBuilder =
    function(
        modal,
        theme
    ) {
        seedCanonicalArtworkV70(
            modal,
            theme
        );

        const result =
            populateThemeBuilderBeforeV70(
                modal,
                theme
            );

        restoreCanonicalArtworkIfNeededV70(
            modal
        );

        bindArtworkUploadTrackingV70(
            modal
        );

        restoreStablePreviewNavigationV70(
            modal
        );

        if (
            Array.isArray(
                modal
                    ?._themeBackgroundSvgs
            ) &&
            modal
                ._themeBackgroundSvgs
                .length
        ) {
            renderThemeBuilderSvgListV2(
                modal
            );

            updateCanonicalArtworkV70(
                modal
            );
        }

        requestAnimationFrame(
            () => {
                restoreCanonicalArtworkIfNeededV70(
                    modal
                );

                renderThemeArtworkPreviewV61?.(
                    modal
                );

                renderDashboardThemePreviewV40?.(
                    modal
                );
            }
        );

        return result;
    };


// Repair an already-open modal too.
requestAnimationFrame(
    () => {
        const modal =
            document.getElementById(
                'theme-builder-modal'
            );

        if (!modal) {
            return;
        }

        seedCanonicalArtworkV70(
            modal,
            getThemeBuilderDraft(
                modal
            )
        );

        restoreCanonicalArtworkIfNeededV70(
            modal
        );

        bindArtworkUploadTrackingV70(
            modal
        );

        restoreStablePreviewNavigationV70(
            modal
        );

    }
);



// ============================================================
// V72 — DAILY LOG CENTERING / DASHBOARD PREVIEW ARTWORK MOTION
// ============================================================

// ------------------------------------------------------------
// 2) Dashboard artwork animation inside Theme Builder.
// Apply motion after every dashboard-preview rebuild, not just the first render.
// ------------------------------------------------------------

function dashboardPreviewAnimationV72(animation) {
    switch (String(animation || 'float')) {
        case 'bob':
            return 'dashboard-preview-bob-v67 1.55s ease-in-out infinite alternate';
        case 'drift':
            return 'dashboard-preview-drift-v67 7.8s ease-in-out infinite alternate';
        case 'spin':
            return 'dashboard-preview-spin-v67 8.5s linear infinite';
        case 'pulse':
            return 'dashboard-preview-pulse-v67 2s ease-in-out infinite alternate';
        case 'still':
            return 'none';
        case 'float':
        default:
            return 'dashboard-preview-float-v67 4.8s ease-in-out infinite alternate';
    }
}

function applyDashboardPreviewMotionV72(modal) {
    if (!modal) return;

    const draft = getThemeBuilderDraft(modal);
    const assets = Array.isArray(draft?.backgroundSvgs)
        ? draft.backgroundSvgs
        : (Array.isArray(modal._themeBackgroundSvgs) ? modal._themeBackgroundSvgs : []);

    modal.querySelectorAll('.theme-builder-dashboard-preview-v40').forEach(host => {
        const stage = host.querySelector('.theme-builder-dashboard-art-v40');
        if (!stage) return;

        stage.classList.add('theme-builder-dashboard-motion-stage-v72');

        const items = Array.from(
            stage.querySelectorAll('.theme-builder-dashboard-art-item-v40')
        );

        items.forEach((item, displayIndex) => {
            const sourceIndex = Number(item.dataset.svgIndex);
            const asset = ensureSvgAdvancedDefaultsV10({
                ...(assets[Number.isFinite(sourceIndex) ? sourceIndex : displayIndex] || {})
            });

            let shell = directThemeChildV72(item, '.theme-svg-motion-shell');

            if (!shell) {
                const fragment = document.createElement('div');
                fragment.className = 'theme-svg-motion-shell theme-image-motion-shell-v36';
                while (item.firstChild) fragment.appendChild(item.firstChild);
                item.appendChild(fragment);
                shell = fragment;
            }

            item.classList.add('theme-builder-dashboard-motion-item-v72');
            item.dataset.dashboardAnimationV72 = asset?.animation || 'float';

            shell.style.setProperty(
                'animation',
                dashboardPreviewAnimationV72(asset?.animation),
                'important'
            );
            shell.style.setProperty(
                'animation-delay',
                `${(displayIndex % 13) * -0.29}s`,
                'important'
            );
            shell.style.setProperty('animation-play-state', 'running', 'important');
            shell.style.setProperty('will-change', 'transform', 'important');
        });
    });
}

function bindDashboardPreviewMotionWatcherV72(modal) {
    if (!modal || modal._dashboardPreviewMotionWatcherV72) return;

    const viewport = modal.querySelector('.theme-builder-live-preview-viewport');
    if (!viewport) return;

    let queued = false;
    const observer = new MutationObserver(() => {
        if (queued) return;
        queued = true;
        requestAnimationFrame(() => {
            queued = false;
            applyDashboardPreviewMotionV72(modal);
        });
    });

    observer.observe(viewport, { childList: true, subtree: true });
    modal._dashboardPreviewMotionWatcherV72 = observer;
}

const renderDashboardThemePreviewBeforeV72 = renderDashboardThemePreviewV40;
renderDashboardThemePreviewV40 = function(modal) {
    const result = renderDashboardThemePreviewBeforeV72(modal);
    applyDashboardPreviewMotionV72(modal);
    bindDashboardPreviewMotionWatcherV72(modal);
    requestAnimationFrame(() => applyDashboardPreviewMotionV72(modal));
    return result;
};

const updateThemeBuilderPreviewBeforeV72 = updateThemeBuilderPreview;
updateThemeBuilderPreview = function(modal) {
    const result = updateThemeBuilderPreviewBeforeV72(modal);
    requestAnimationFrame(() => applyDashboardPreviewMotionV72(modal));
    return result;
};

// ------------------------------------------------------------
// 3) Daily Logs horizontal centering.
// The V69 wide-page rule expanded the body but left the older 50% margin on
// #grid-view, which can push Daily Logs into the right half of the viewport.
// Detail view gets its own full-width body class too so theme CSS cannot shift it.
// ------------------------------------------------------------

function syncDailyLogCenteringV72(view = null) {
    const current = view || document.querySelector('.view.active');
    document.body.classList.toggle(
        'daily-log-detail-page-v72',
        current === logView || current?.id === 'log-view'
    );
}

const switchViewBeforeDailyCenteringV72 = switchView;
switchView = function(viewToShow) {
    const result = switchViewBeforeDailyCenteringV72(viewToShow);
    // V206: synchronous so there is no narrow->wide paint between frames.
    syncDailyLogCenteringV72(viewToShow);
    return result;
};

// Final repair whenever the builder is populated. This runs after all older
// V69/V70/V71 population hooks have finished creating their sections.
const populateThemeBuilderBeforeV72 = populateThemeBuilder;
populateThemeBuilder = function(modal, theme) {
    const result = populateThemeBuilderBeforeV72(modal, theme);

    bindDashboardPreviewMotionWatcherV72(modal);
    applyDashboardPreviewMotionV72(modal);

    requestAnimationFrame(() => {
        applyDashboardPreviewMotionV72(modal);
    });

    return result;
};

(() => {
    syncDailyLogCenteringV72();

    const modal = document.getElementById('theme-builder-modal');
    if (modal) {
        bindDashboardPreviewMotionWatcherV72(modal);
        applyDashboardPreviewMotionV72(modal);
    }
})();


// ============================================================
// V73 — DASHBOARD PREVIEW MOTION
// ============================================================

// ------------------------------------------------------------
// V73 dashboard preview motion: use the preview assignment itself so animation
// does not depend on a missing data-svg-index attribute after a preview rebuild.
// ------------------------------------------------------------
function forceDashboardPreviewMotionV73(modal) {
    const host = modal?.querySelector('.theme-builder-dashboard-preview-v40');
    if (!host) return;

    const draft = getThemeBuilderDraft(modal);
    const assignments = getPreviewSvgAssignmentsV10(modal, draft) || [];
    const items = Array.from(host.querySelectorAll('.theme-builder-dashboard-art-item-v40'));

    items.forEach((item, index) => {
        const assignment = assignments[index] || {};
        const asset = ensureSvgAdvancedDefaultsV10(assignment.svg || {});
        let shell = item.querySelector(':scope > .theme-svg-motion-shell');

        if (!shell) {
            shell = document.createElement('div');
            shell.className = 'theme-svg-motion-shell theme-image-motion-shell-v36';
            while (item.firstChild) shell.appendChild(item.firstChild);
            item.appendChild(shell);
        }

        item.classList.add('theme-builder-dashboard-motion-item-v72', 'theme-builder-dashboard-motion-item-v73');
        item.dataset.svgIndex = String(
            Number.isFinite(Number(assignment.originalIndex)) ? Number(assignment.originalIndex) : index
        );

        const animation = asset?.animation || 'float';
        shell.style.setProperty('animation', dashboardPreviewAnimationV72(animation), 'important');
        shell.style.setProperty('animation-delay', `${(index % 13) * -0.29}s`, 'important');
        shell.style.setProperty('animation-play-state', 'running', 'important');
        shell.style.setProperty('will-change', 'transform', 'important');
    });
}

const renderDashboardThemePreviewBeforeV73 = renderDashboardThemePreviewV40;
renderDashboardThemePreviewV40 = function(modal) {
    const result = renderDashboardThemePreviewBeforeV73(modal);
    forceDashboardPreviewMotionV73(modal);
    requestAnimationFrame(() => forceDashboardPreviewMotionV73(modal));
    return result;
};

const updateThemeBuilderPreviewBeforeV73 = updateThemeBuilderPreview;
updateThemeBuilderPreview = function(modal) {
    const result = updateThemeBuilderPreviewBeforeV73(modal);
    requestAnimationFrame(() => forceDashboardPreviewMotionV73(modal));
    return result;
};

// ============================================================
// V78 — FINAL TOGGLE / DASHBOARD PREVIEW MOTION STABILIZER
// ============================================================

function themeBuilderDashboardAnimationV78(animation) {
    switch (String(animation || 'float')) {
        case 'bob':
            return 'dashboard-preview-bob-v67 1.55s ease-in-out infinite alternate';
        case 'drift':
            return 'dashboard-preview-drift-v67 7.8s ease-in-out infinite alternate';
        case 'spin':
            return 'dashboard-preview-spin-v67 8.5s linear infinite';
        case 'pulse':
            return 'dashboard-preview-pulse-v67 2s ease-in-out infinite alternate';
        case 'still':
            return 'none';
        case 'float':
        default:
            return 'dashboard-preview-float-v67 4.8s ease-in-out infinite alternate';
    }
}

function ensureDashboardMotionShellV78(item) {
    if (!item) return null;

    let shell = null;
    try {
        shell = item.querySelector(':scope > .theme-svg-motion-shell');
    } catch {
        shell = Array.from(item.children || []).find(child =>
            child.classList?.contains('theme-svg-motion-shell')
        ) || null;
    }

    if (!shell) {
        shell = document.createElement('div');
        shell.className = 'theme-svg-motion-shell theme-image-motion-shell-v36';
        while (item.firstChild) shell.appendChild(item.firstChild);
        item.appendChild(shell);
    }

    return shell;
}

function playDashboardShellAnimationV78(shell, animation, index) {
    if (!shell) return;

    const value = themeBuilderDashboardAnimationV78(animation);
    shell.style.setProperty('animation', value, 'important');
    shell.style.setProperty('animation-delay', `${(index % 13) * -0.29}s`, 'important');
    shell.style.setProperty('animation-play-state', 'running', 'important');
    shell.style.setProperty('transform-origin', 'center center', 'important');
    shell.style.setProperty('will-change', 'transform', 'important');

    requestAnimationFrame(() => {
        try {
            shell.getAnimations?.().forEach(player => {
                try {
                    player.playbackRate = 1;
                    player.play();
                } catch {}
            });
        } catch {}
    });
}

function applyDashboardPreviewMotionV78(modal) {
    if (!modal) return;

    const draft = getThemeBuilderDraft(modal);
    let assignments = [];
    try {
        assignments = getPreviewSvgAssignmentsV10(modal, draft) || [];
    } catch {}

    // V45 is the dashboard preview that is actually shown by the newer
    // Theme Builder. Older fixes only targeted V40, which is why the visible
    // dashboard artwork stayed frozen.
    modal.querySelectorAll('.theme-builder-dashboard-preview-v45').forEach(preview => {
        const items = Array.from(
            preview.querySelectorAll('.theme-builder-dashboard-art-item-v45')
        );

        items.forEach((item, index) => {
            const slot = Number(item.dataset.manualSlotV45);
            const assignment = assignments[Number.isFinite(slot) ? slot : index] || {};
            const asset = ensureSvgAdvancedDefaultsV10({ ...(assignment.svg || {}) });
            const animation = asset?.animation || 'float';
            const shell = ensureDashboardMotionShellV78(item);

            item.dataset.dashboardAnimationV78 = animation;
            item.classList.add('theme-builder-dashboard-motion-item-v78');
            playDashboardShellAnimationV78(shell, animation, index);
        });
    });

    // Keep the older V40 preview animated too in case another code path makes
    // it visible.
    modal.querySelectorAll('.theme-builder-dashboard-preview-v40').forEach(preview => {
        const items = Array.from(
            preview.querySelectorAll('.theme-builder-dashboard-art-item-v40')
        );

        items.forEach((item, index) => {
            const sourceIndex = Number(item.dataset.svgIndex);
            const assignment = assignments[Number.isFinite(sourceIndex) ? sourceIndex : index] || {};
            const asset = ensureSvgAdvancedDefaultsV10({ ...(assignment.svg || {}) });
            const animation = asset?.animation || item.dataset.dashboardAnimationV72 || 'float';
            const shell = ensureDashboardMotionShellV78(item);

            item.dataset.dashboardAnimationV78 = animation;
            item.classList.add('theme-builder-dashboard-motion-item-v78');
            playDashboardShellAnimationV78(shell, animation, index);
        });
    });
}

function scheduleDashboardPreviewMotionV78(modal) {
    if (!modal) return;

    cancelAnimationFrame(modal._dashboardMotionFrameV78 || 0);
    clearTimeout(modal._dashboardMotionTimerV78 || 0);

    modal._dashboardMotionFrameV78 = requestAnimationFrame(() => {
        applyDashboardPreviewMotionV78(modal);
        modal._dashboardMotionTimerV78 = setTimeout(
            () => applyDashboardPreviewMotionV78(modal),
            80
        );
    });
}

function bindDashboardPreviewMotionObserverV78(modal) {
    if (!modal || modal._dashboardMotionObserverV78) return;

    const viewport = modal.querySelector('.theme-builder-live-preview-viewport');
    if (!viewport) return;

    let queued = false;
    const observer = new MutationObserver(mutations => {
        const relevant = mutations.some(mutation =>
            Array.from(mutation.addedNodes || []).some(node =>
                node?.nodeType === 1 && (
                    node.matches?.('.theme-builder-dashboard-preview-v45, .theme-builder-dashboard-preview-v40, .theme-builder-dashboard-art-item-v45, .theme-builder-dashboard-art-item-v40') ||
                    node.querySelector?.('.theme-builder-dashboard-preview-v45, .theme-builder-dashboard-preview-v40, .theme-builder-dashboard-art-item-v45, .theme-builder-dashboard-art-item-v40')
                )
            )
        );

        if (!relevant || queued) return;
        queued = true;
        requestAnimationFrame(() => {
            queued = false;
            applyDashboardPreviewMotionV78(modal);
        });
    });

    observer.observe(viewport, { childList: true, subtree: true });
    modal._dashboardMotionObserverV78 = observer;
}

try {
    const renderDashboardPreviewBeforeV78 = renderDashboardPreviewV45;
    renderDashboardPreviewV45 = function(modal) {
        const result = renderDashboardPreviewBeforeV78(modal);
        scheduleDashboardPreviewMotionV78(modal);
        bindDashboardPreviewMotionObserverV78(modal);
        return result;
    };
} catch {}

try {
    const showDashboardPreviewBeforeV78 = showDashboardPreviewV45;
    showDashboardPreviewV45 = function(modal) {
        const result = showDashboardPreviewBeforeV78(modal);
        scheduleDashboardPreviewMotionV78(modal);
        return result;
    };
} catch {}

try {
    const renderDashboardThemePreviewBeforeV78 = renderDashboardThemePreviewV40;
    renderDashboardThemePreviewV40 = function(modal) {
        const result = renderDashboardThemePreviewBeforeV78(modal);
        scheduleDashboardPreviewMotionV78(modal);
        return result;
    };
} catch {}

try {
    const updateThemeBuilderPreviewBeforeV78 = updateThemeBuilderPreview;
    updateThemeBuilderPreview = function(modal) {
        const result = updateThemeBuilderPreviewBeforeV78(modal);
        scheduleDashboardPreviewMotionV78(modal);
        bindDashboardPreviewMotionObserverV78(modal);
        return result;
    };
} catch {}

requestAnimationFrame(() => {
    const modal = document.getElementById('theme-builder-modal');
    if (!modal) return;
    bindDashboardPreviewMotionObserverV78(modal);
    scheduleDashboardPreviewMotionV78(modal);
});


// ============================================================
// V79 — DASHBOARD PREVIEW BACKGROUND + CURRENT DASHBOARD LAYOUT
//       + DASHBOARD COLOR LABELS/TITLE COLOR
// ============================================================

function dashboardPreviewCssUrlV79(value) {
    const source = String(value || '').trim();
    if (!source) return 'none';
    return `url("${source.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}")`;
}

function syncDashboardPreviewBackgroundV79(modal) {
    if (!modal) return;

    const preview = modal.querySelector('.theme-builder-dashboard-preview-v45');
    if (!preview) return;

    const draft = getThemeBuilderDraft(modal);

    preview.style.setProperty(
        '--tb-dashboard-bg-v45',
        draft.dashboardBackgroundV40 || draft.background || '#f5f5f5'
    );

    preview.style.setProperty(
        '--tb-dashboard-card-v45',
        draft.dashboardCardV40 || draft.surface || '#ffffff'
    );

    preview.style.setProperty(
        '--tb-dashboard-text-v45',
        draft.dashboardTextV40 || draft.text || '#171717'
    );

    preview.style.setProperty(
        '--tb-dashboard-accent-v45',
        draft.dashboardAccentV40 || draft.accent || '#777777'
    );

    preview.style.setProperty(
        '--tb-dashboard-title-v79',
        draft.dashboardTitleColorV79 || draft.dashboardTextV40 || draft.text || '#171717'
    );

    preview.style.setProperty(
        '--tb-dashboard-background-image-v48',
        dashboardPreviewCssUrlV79(draft.backgroundImage)
    );

    preview.style.setProperty(
        '--tb-dashboard-gradient-v79',
        String(draft.backgroundGradientV56 || 'none')
    );

    const title = preview.querySelector('h2');
    if (title) {
        title.textContent = typeof cleanDashboardTitleV69 === 'function'
            ? cleanDashboardTitleV69(draft.dashboardTitleV69)
            : String(draft.dashboardTitleV69 || 'MY LOGS');
    }

    preview.querySelector('.theme-builder-dashboard-code-background-v79')?.remove();

    const code = String(draft.interactiveBackgroundCodeV56 || '').trim();
    if (code) {
        const frame = document.createElement('iframe');
        frame.className = 'theme-builder-dashboard-code-background-v79';
        frame.setAttribute('sandbox', 'allow-scripts');
        frame.setAttribute('aria-hidden', 'true');
        frame.tabIndex = -1;
        frame.srcdoc = typeof ensureBackgroundDocumentV56 === 'function'
            ? ensureBackgroundDocumentV56(code)
            : code;
        preview.prepend(frame);
    }
}

try {
    const renderDashboardPreviewBeforeV79 = renderDashboardPreviewV45;
    renderDashboardPreviewV45 = function(modal) {
        const result = renderDashboardPreviewBeforeV79(modal);
        syncDashboardPreviewBackgroundV79(modal);
        scheduleDashboardPreviewMotionV78?.(modal);
        return result;
    };
} catch {}

try {
    const updateThemeBuilderPreviewBeforeDashboardV79 = updateThemeBuilderPreview;
    updateThemeBuilderPreview = function(modal) {
        const result = updateThemeBuilderPreviewBeforeDashboardV79(modal);
        syncDashboardPreviewBackgroundV79(modal);
        scheduleDashboardPreviewMotionV78?.(modal);
        return result;
    };
} catch {}


// ------------------------------------------------------------
// Dashboard Colors: clearer labels + independent dashboard title color.
// ------------------------------------------------------------

const stableDashboardThemeControlsBeforeV79 =
    typeof stableDashboardThemeControlsV51 === 'function'
        ? stableDashboardThemeControlsV51
        : null;

function bindDashboardTitleColorFieldV79(modal, section) {
    const picker = section?.querySelector(
        'input[type="color"][data-theme-key="dashboardTitleColorV79"]'
    );
    const hex = section?.querySelector(
        '[data-theme-hex="dashboardTitleColorV79"]'
    );

    if (picker && picker.dataset.boundDashboardTitleV79 !== 'true') {
        picker.dataset.boundDashboardTitleV79 = 'true';

        picker.addEventListener('pointerdown', () => {
            modal._dashboardColorPickerOpenV51 = true;
        }, true);

        picker.addEventListener('input', () => {
            if (hex) hex.value = picker.value;
            updateThemeBuilderPreview(modal);
        });

        const finish = () => setTimeout(() => {
            modal._dashboardColorPickerOpenV51 = false;
        }, 0);

        picker.addEventListener('change', finish);
        picker.addEventListener('blur', finish);
    }

    if (hex && hex.dataset.boundDashboardTitleV79 !== 'true') {
        hex.dataset.boundDashboardTitleV79 = 'true';
        hex.addEventListener('input', () => {
            const value = hex.value.trim();
            if (!/^#[0-9a-f]{6}$/i.test(value)) return;
            if (picker) picker.value = value;
            updateThemeBuilderPreview(modal);
        });
    }
}

function stableDashboardThemeControlsV79(modal, theme = {}) {
    const section = stableDashboardThemeControlsBeforeV79
        ? stableDashboardThemeControlsBeforeV79(modal, theme)
        : modal?.querySelector('.theme-builder-dashboard-colors-v42');

    if (!section) return section;

    const relabel = (key, label) => {
        const input = section.querySelector(`[data-theme-key="${key}"]`);
        const span = input?.closest('.theme-builder-field')?.querySelector(':scope > span');
        if (span) span.textContent = label;
    };

    relabel('dashboardTextV40', 'Accent Color');
    relabel('dashboardAccentV40', 'Buttons Color');

    let titlePicker = section.querySelector(
        'input[type="color"][data-theme-key="dashboardTitleColorV79"]'
    );

    if (!titlePicker) {
        const grid = section.querySelector('.theme-builder-dashboard-color-grid-v42') ||
            section.querySelector('.theme-builder-color-grid');

        if (grid) {
            const initial =
                theme.dashboardTitleColorV79 ||
                theme.dashboardTextV40 ||
                theme.text ||
                '#000000';

            grid.insertAdjacentHTML(
                'beforeend',
                themeBuilderField(
                    'Dashboard Title Color',
                    'dashboardTitleColorV79',
                    /^#[0-9a-f]{6}$/i.test(String(initial)) ? String(initial) : '#000000'
                )
            );
        }
    }

    bindDashboardTitleColorFieldV79(modal, section);
    return section;
}

if (stableDashboardThemeControlsBeforeV79) {
    stableDashboardThemeControlsV51 = stableDashboardThemeControlsV79;
    ensureDashboardThemeControlsV42 = stableDashboardThemeControlsV79;
    ensureDashboardThemeControlsV40 = stableDashboardThemeControlsV79;
}

// Upgrade an already-open builder immediately.
requestAnimationFrame(() => {
    const modal = document.getElementById('theme-builder-modal');
    if (!modal) return;

    try {
        stableDashboardThemeControlsV79(modal, getThemeBuilderDraft(modal));
    } catch {}

    syncDashboardPreviewBackgroundV79(modal);
});


// ============================================================
// V80 — LIVE DASHBOARD PREVIEW REFRESH
// Keep the Dashboard preview in sync while editing the Builder so image,
// background, gradient, title/color and placement changes never require the
// manual reload button.
// ============================================================

function refreshActiveDashboardPreviewV80(modal) {
    if (!modal || !modal._dashboardPreviewActiveV45) return;

    try {
        renderDashboardPreviewV45(modal);
    } catch {}

    try {
        syncDashboardPreviewBackgroundV79(modal);
    } catch {}

    try {
        scheduleDashboardPreviewMotionV78(modal);
    } catch {}
}

function scheduleActiveDashboardPreviewV80(modal) {
    if (!modal || !modal._dashboardPreviewActiveV45) return;

    try {
        cancelAnimationFrame(modal._dashboardAutoRefreshFrameV80 || 0);
    } catch {}

    modal._dashboardAutoRefreshFrameV80 = requestAnimationFrame(() => {
        refreshActiveDashboardPreviewV80(modal);
    });
}

try {
    const updateThemeBuilderPreviewBeforeDashboardRefreshV80 =
        updateThemeBuilderPreview;

    updateThemeBuilderPreview = function(modal) {
        const result =
            updateThemeBuilderPreviewBeforeDashboardRefreshV80(modal);

        scheduleActiveDashboardPreviewV80(modal);

        return result;
    };
} catch {}

function bindThemeBuilderDashboardAutoRefreshV80(modal) {
    if (!modal || modal.dataset.dashboardAutoRefreshV80 === 'true') return;

    modal.dataset.dashboardAutoRefreshV80 = 'true';

    // Switching Colors / Background / Audio / Images should also refresh the
    // current Dashboard preview. This covers edits that rebuild a Builder
    // panel before its input/change handler has a chance to redraw.
    modal.addEventListener('click', event => {
        const tab = event.target?.closest?.(
            '.theme-builder-section-tabs-v11 [data-theme-builder-panel]'
        );

        if (!tab) return;

        requestAnimationFrame(() => {
            scheduleActiveDashboardPreviewV80(modal);
        });
    }, true);

    // File uploads are asynchronous. Their normal handlers call
    // updateThemeBuilderPreview, but this delayed refresh guarantees the
    // Dashboard redraw happens after the decoded image/SVG has entered draft
    // state rather than before it.
    modal.addEventListener('change', event => {
        if (!event.target?.matches?.(
            '.theme-builder-svg-file, .theme-builder-background-file'
        )) {
            return;
        }

        setTimeout(() => scheduleActiveDashboardPreviewV80(modal), 0);
        setTimeout(() => scheduleActiveDashboardPreviewV80(modal), 120);
    }, true);
}

try {
    const ensureThemeBuilderModalBeforeDashboardRefreshV80 =
        ensureThemeBuilderModal;

    ensureThemeBuilderModal = function() {
        const result = ensureThemeBuilderModalBeforeDashboardRefreshV80();
        const modal = document.getElementById('theme-builder-modal');
        if (modal) bindThemeBuilderDashboardAutoRefreshV80(modal);
        return result;
    };
} catch {}

requestAnimationFrame(() => {
    const modal = document.getElementById('theme-builder-modal');
    if (!modal) return;

    bindThemeBuilderDashboardAutoRefreshV80(modal);
    scheduleActiveDashboardPreviewV80(modal);
});


// ============================================================
// V81 — DASHBOARD ICON COLOR PICKER + PREVIEW SYNC
// ============================================================

function bindDashboardIconColorFieldV81(modal, section) {
    const picker = section?.querySelector(
        'input[type="color"][data-theme-key="dashboardIconColorV81"]'
    );
    const hex = section?.querySelector(
        '[data-theme-hex="dashboardIconColorV81"]'
    );

    if (picker && picker.dataset.boundDashboardIconV81 !== 'true') {
        picker.dataset.boundDashboardIconV81 = 'true';

        picker.addEventListener('pointerdown', () => {
            modal._dashboardColorPickerOpenV51 = true;
        }, true);

        picker.addEventListener('input', () => {
            if (hex) hex.value = picker.value;
            updateThemeBuilderPreview(modal);
        });

        const finish = () => setTimeout(() => {
            modal._dashboardColorPickerOpenV51 = false;
        }, 0);

        picker.addEventListener('change', finish);
        picker.addEventListener('blur', finish);
    }

    if (hex && hex.dataset.boundDashboardIconV81 !== 'true') {
        hex.dataset.boundDashboardIconV81 = 'true';

        hex.addEventListener('input', () => {
            const value = hex.value.trim();
            if (!/^#[0-9a-f]{6}$/i.test(value)) return;
            if (picker) picker.value = value;
            updateThemeBuilderPreview(modal);
        });
    }
}

const stableDashboardThemeControlsBeforeV81 =
    typeof stableDashboardThemeControlsV51 === 'function'
        ? stableDashboardThemeControlsV51
        : null;

function stableDashboardThemeControlsV81(modal, theme = {}) {
    const section = stableDashboardThemeControlsBeforeV81
        ? stableDashboardThemeControlsBeforeV81(modal, theme)
        : modal?.querySelector('.theme-builder-dashboard-colors-v42');

    if (!section) return section;

    let picker = section.querySelector(
        'input[type="color"][data-theme-key="dashboardIconColorV81"]'
    );

    if (!picker) {
        const grid = section.querySelector('.theme-builder-dashboard-color-grid-v42') ||
            section.querySelector('.theme-builder-color-grid');

        if (grid) {
            const initial =
                theme.dashboardIconColorV81 ||
                theme.dashboardTextV40 ||
                theme.text ||
                '#000000';

            grid.insertAdjacentHTML(
                'beforeend',
                themeBuilderField(
                    'Dashboard Icons Color',
                    'dashboardIconColorV81',
                    /^#[0-9a-f]{6}$/i.test(String(initial))
                        ? String(initial)
                        : '#000000'
                )
            );
        }
    }

    bindDashboardIconColorFieldV81(modal, section);
    return section;
}

if (stableDashboardThemeControlsBeforeV81) {
    stableDashboardThemeControlsV51 = stableDashboardThemeControlsV81;
    ensureDashboardThemeControlsV42 = stableDashboardThemeControlsV81;
    ensureDashboardThemeControlsV40 = stableDashboardThemeControlsV81;
}

function syncDashboardPreviewIconColorV81(modal) {
    if (!modal) return;

    const preview = modal.querySelector('.theme-builder-dashboard-preview-v45');
    if (!preview) return;

    const draft = getThemeBuilderDraft(modal);
    const color =
        draft.dashboardIconColorV81 ||
        draft.dashboardTextV40 ||
        draft.text ||
        '#171717';

    preview.style.setProperty('--tb-dashboard-icon-v81', String(color));
}

try {
    const renderDashboardPreviewBeforeV81 = renderDashboardPreviewV45;
    renderDashboardPreviewV45 = function(modal) {
        const result = renderDashboardPreviewBeforeV81(modal);
        syncDashboardPreviewIconColorV81(modal);
        return result;
    };
} catch {}

try {
    const updateThemeBuilderPreviewBeforeV81 = updateThemeBuilderPreview;
    updateThemeBuilderPreview = function(modal) {
        const result = updateThemeBuilderPreviewBeforeV81(modal);
        syncDashboardPreviewIconColorV81(modal);
        return result;
    };
} catch {}

requestAnimationFrame(() => {
    const modal = document.getElementById('theme-builder-modal');
    if (!modal) return;

    try {
        stableDashboardThemeControlsV81(modal, getThemeBuilderDraft(modal));
    } catch {}

    try {
        syncDashboardPreviewIconColorV81(modal);
    } catch {}
});

// ============================================================
// V82 — DECORATIONS HOVER BEHAVIOR / TRINKETS TAB / STABLE UI
// ============================================================

const THEME_HOVER_ANIMATION_OPTIONS_V82 = [
    ['lift', 'Lift & Pop'],
    ['bounce', 'Bounce'],
    ['wiggle', 'Wiggle'],
    ['spin', 'Quick Spin'],
    ['pulse', 'Pulse'],
    ['float', 'Soft Float']
];

const THEME_HOVER_ANIMATION_DEFAULT_V82 = 'lift';
const THEME_BUILDER_ACCORDION_NONE_V82 = '__theme_builder_none_v82__';

function normalizeThemeHoverAnimationV82(value, fallback = THEME_HOVER_ANIMATION_DEFAULT_V82) {
    const clean = String(value || '').trim();
    return THEME_HOVER_ANIMATION_OPTIONS_V82.some(([id]) => id === clean)
        ? clean
        : fallback;
}

function effectiveThemeHoverAnimationV82(theme, asset) {
    if (!theme?.svgHoverAnimationsEnabledV82) return '';

    const override = String(asset?.hoverAnimationOverrideV82 || '').trim();
    if (override === 'none') return '';
    if (THEME_HOVER_ANIMATION_OPTIONS_V82.some(([id]) => id === override)) {
        return override;
    }

    return normalizeThemeHoverAnimationV82(
        theme?.svgHoverAnimationV82,
        THEME_HOVER_ANIMATION_DEFAULT_V82
    );
}

function hoverAnimationCssV82(animation) {
    switch (String(animation || '')) {
        case 'bounce':
            return 'theme-hover-bounce-v82 .52s cubic-bezier(.2,.72,.24,1) both';
        case 'wiggle':
            return 'theme-hover-wiggle-v82 .55s ease-in-out both';
        case 'spin':
            return 'theme-hover-spin-v82 .58s cubic-bezier(.2,.7,.2,1) both';
        case 'pulse':
            return 'theme-hover-pulse-v82 .62s ease-in-out both';
        case 'float':
            return 'theme-hover-float-v82 .7s ease-in-out both';
        case 'lift':
        default:
            return 'theme-hover-lift-v82 .42s cubic-bezier(.2,.8,.2,1) both';
    }
}

function directThemeMotionShellV82(item) {
    if (!item) return null;

    let shell = item.querySelector?.(':scope > .theme-svg-motion-shell');
    if (shell) return shell;

    // A few late preview renderers intentionally output the image directly.
    // Wrap it without touching the positioned outer item.
    if (
        item.matches?.('.theme-builder-live-art-item, .theme-builder-dashboard-art-item-v45, .theme-builder-dashboard-art-item-v40')
    ) {
        const movable = Array.from(item.childNodes).filter(node => {
            if (node.nodeType !== 1) return true;
            return !node.classList?.contains('theme-builder-art-controls-v40');
        });

        if (movable.length) {
            shell = document.createElement('div');
            shell.className = 'theme-svg-motion-shell theme-image-motion-shell-v36';
            movable.forEach(node => shell.appendChild(node));
            item.prepend(shell);
        }
    }

    return shell;
}

function bindThemeHoverAnimationItemV82(item, theme, asset) {
    if (!item) return;

    const animation = effectiveThemeHoverAnimationV82(theme, asset);
    item.dataset.themeHoverAnimationV82 = animation || 'none';
    item.dataset.themeHoverEnabledV82 = animation ? 'true' : 'false';

    if (item._themeHoverEnterV82) {
        try { item.removeEventListener('pointerenter', item._themeHoverEnterV82); } catch {}
    }
    if (item._themeHoverLeaveV82) {
        try { item.removeEventListener('pointerleave', item._themeHoverLeaveV82); } catch {}
    }

    const shell = directThemeMotionShellV82(item);
    if (!shell) return;

    const enter = () => {
        if (!animation) return;

        item._themeHoverBaseV82 = {
            animation: shell.style.getPropertyValue('animation'),
            animationPriority: shell.style.getPropertyPriority('animation'),
            delay: shell.style.getPropertyValue('animation-delay'),
            delayPriority: shell.style.getPropertyPriority('animation-delay'),
            playState: shell.style.getPropertyValue('animation-play-state'),
            playStatePriority: shell.style.getPropertyPriority('animation-play-state')
        };

        shell.style.setProperty('animation', hoverAnimationCssV82(animation), 'important');
        shell.style.setProperty('animation-delay', '0s', 'important');
        shell.style.setProperty('animation-play-state', 'running', 'important');
    };

    const leave = () => {
        const base = item._themeHoverBaseV82 || {};

        if (base.animation) {
            shell.style.setProperty('animation', base.animation, base.animationPriority || '');
        } else {
            shell.style.removeProperty('animation');
        }

        if (base.delay) {
            shell.style.setProperty('animation-delay', base.delay, base.delayPriority || '');
        } else {
            shell.style.removeProperty('animation-delay');
        }

        if (base.playState) {
            shell.style.setProperty('animation-play-state', base.playState, base.playStatePriority || '');
        } else {
            shell.style.removeProperty('animation-play-state');
        }

        item._themeHoverBaseV82 = null;
    };

    item.addEventListener('pointerenter', enter);
    item.addEventListener('pointerleave', leave);
    item._themeHoverEnterV82 = enter;
    item._themeHoverLeaveV82 = leave;
}

function applyThemeHoverAnimationsV82(root, theme) {
    if (!root) return;

    const assets = Array.isArray(theme?.backgroundSvgs)
        ? theme.backgroundSvgs
        : [];

    const items = Array.from(root.querySelectorAll([
        '.theme-builder-live-art-item',
        '.theme-builder-dashboard-art-item-v45',
        '.theme-builder-dashboard-art-item-v40',
        '.custom-theme-background-svg'
    ].join(',')));

    items.forEach((item, displayIndex) => {
        let index = Number(item.dataset.svgIndex);
        if (!Number.isFinite(index) || index < 0 || index >= assets.length) {
            index = displayIndex % Math.max(1, assets.length);
        }
        bindThemeHoverAnimationItemV82(item, theme || {}, assets[index] || {});
    });
}

function themeHoverAnimationSelectOptionsV82(value = '', includeDefault = false, defaultValue = '') {
    const selected = String(value || '');
    const defaultLabel = THEME_HOVER_ANIMATION_OPTIONS_V82.find(
        ([id]) => id === normalizeThemeHoverAnimationV82(defaultValue)
    )?.[1] || 'Lift & Pop';

    return [
        ...(includeDefault
            ? [
                `<option value="" ${selected === '' ? 'selected' : ''}>Use Default · ${escapeCustomHtml(defaultLabel)}</option>`,
                `<option value="none" ${selected === 'none' ? 'selected' : ''}>No hover animation</option>`
            ]
            : []),
        ...THEME_HOVER_ANIMATION_OPTIONS_V82.map(([id, label]) => `
            <option value="${escapeCustomHtml(id)}" ${selected === id ? 'selected' : ''}>${escapeCustomHtml(label)}</option>
        `)
    ].join('');
}

function syncThemeHoverAnimationUiV82(modal) {
    if (!modal) return;

    const enabled = !!modal.querySelector('.theme-builder-svg-hover-animations-enabled-v82')?.checked;
    const details = modal.querySelector('.theme-builder-svg-hover-animation-details-v82');
    details?.classList.toggle('hidden', !enabled);

    const soundWrap = modal.querySelector('.theme-builder-svg-hover-sounds-wrap');
    if (soundWrap) {
        soundWrap.classList.toggle('theme-builder-hover-sounds-disabled-v82', !enabled);
        soundWrap.classList.toggle('hidden', !enabled);
    }

    modal.querySelectorAll('.theme-builder-svg-hover-animation-row-v82').forEach(row => {
        row.classList.toggle('hidden', !enabled);
    });

    if (!enabled) {
        modal.querySelectorAll('.theme-builder-svg-mapped-sound-row').forEach(row => {
            row.classList.add('hidden');
        });
    } else {
        try { syncThemeBuilderAdvancedVisibilityV10(modal); } catch {}
    }
}

function ensureThemeHoverAnimationControlsV82(modal, theme = {}) {
    if (!modal) return;

    const panel = modal.querySelector('.theme-builder-svg-effects-panel');
    if (!panel) return;

    let wrap = panel.querySelector('.theme-builder-svg-hover-animation-wrap-v82');
    if (!wrap) {
        wrap = document.createElement('div');
        wrap.className = 'theme-builder-svg-hover-animation-wrap-v82';
        wrap.innerHTML = `
            <label class="theme-builder-visual-toggle theme-builder-svg-hover-animation-toggle-v82">
                <input type="checkbox" class="theme-builder-svg-hover-animations-enabled-v82">
                <span class="theme-builder-visual-toggle-copy">
                    <strong>Animate decorations on hover</strong>
                </span>
                <span class="theme-builder-switch" aria-hidden="true"></span>
            </label>

            <div class="theme-builder-svg-hover-animation-details-v82">
                <label class="theme-builder-field theme-builder-svg-hover-animation-default-field-v82">
                    <span>Hover Animation</span>
                    <select class="theme-builder-svg-hover-animation-default-v82"></select>
                </label>
                <div class="theme-builder-hover-sound-slot-v82"></div>
            </div>
        `;

        const global = panel.querySelector('.theme-builder-global-svg-controls-v11');
        if (global) global.insertAdjacentElement('afterend', wrap);
        else panel.prepend(wrap);
    }

    const toggle = wrap.querySelector('.theme-builder-svg-hover-animations-enabled-v82');
    const select = wrap.querySelector('.theme-builder-svg-hover-animation-default-v82');

    const enabled = theme.svgHoverAnimationsEnabledV82 === undefined
        ? !!modal._themeHoverAnimationsEnabledV82
        : !!theme.svgHoverAnimationsEnabledV82;

    if (toggle) {
        toggle.checked = enabled;
        modal._themeHoverAnimationsEnabledV82 = enabled;
    }

    const selected = normalizeThemeHoverAnimationV82(
        theme.svgHoverAnimationV82 || modal._themeHoverAnimationV82,
        THEME_HOVER_ANIMATION_DEFAULT_V82
    );

    if (select) {
        select.innerHTML = themeHoverAnimationSelectOptionsV82(selected, false);
        select.value = selected;
        modal._themeHoverAnimationV82 = selected;
    }

    const soundWrap = panel.querySelector('.theme-builder-svg-hover-sounds-wrap');
    const slot = wrap.querySelector('.theme-builder-hover-sound-slot-v82');
    if (soundWrap && slot && soundWrap.parentElement !== slot) {
        slot.appendChild(soundWrap);
    }

    const soundTitle = soundWrap?.querySelector('.theme-builder-visual-toggle-copy strong');
    if (soundTitle) soundTitle.textContent = 'Play sounds on hover';

    if (toggle && toggle.dataset.hoverAnimationBoundV82 !== 'true') {
        toggle.dataset.hoverAnimationBoundV82 = 'true';
        toggle.addEventListener('change', () => {
            modal._themeHoverAnimationsEnabledV82 = !!toggle.checked;
            syncThemeHoverAnimationUiV82(modal);
            updateThemeBuilderPreview(modal);
        });
    }

    if (select && select.dataset.hoverAnimationBoundV82 !== 'true') {
        select.dataset.hoverAnimationBoundV82 = 'true';
        select.addEventListener('pointerdown', event => event.stopPropagation());
        select.addEventListener('click', event => event.stopPropagation());
        select.addEventListener('change', () => {
            modal._themeHoverAnimationV82 = normalizeThemeHoverAnimationV82(select.value);
            updateThemeBuilderPreview(modal);
        });
    }

    syncThemeHoverAnimationUiV82(modal);
}

function captureThemeImageCustomizationStateV82(modal) {
    const open = new Set();
    modal?.querySelectorAll('.theme-builder-svg-card[data-svg-index].svg-card-custom-open-v11').forEach(card => {
        const index = Number(card.dataset.svgIndex);
        if (Number.isFinite(index)) open.add(index);
    });
    return open;
}

function restoreThemeImageCustomizationStateV82(modal, open) {
    modal?.querySelectorAll('.theme-builder-svg-card[data-svg-index]').forEach(card => {
        const index = Number(card.dataset.svgIndex);
        card.classList.toggle('svg-card-custom-open-v11', open?.has(index) || false);
    });
}

function installPerImageHoverControlsV82(modal) {
    if (!modal) return;

    const enabled = !!modal.querySelector('.theme-builder-svg-hover-animations-enabled-v82')?.checked;
    const globalAnimation = normalizeThemeHoverAnimationV82(
        modal.querySelector('.theme-builder-svg-hover-animation-default-v82')?.value ||
        modal._themeHoverAnimationV82,
        THEME_HOVER_ANIMATION_DEFAULT_V82
    );

    modal.querySelectorAll('.theme-builder-svg-card[data-svg-index]').forEach(card => {
        const index = Number(card.dataset.svgIndex);
        const asset = modal._themeBackgroundSvgs?.[index];
        const options = card.querySelector('.theme-builder-svg-card-options-v10');
        if (!asset || !options) return;

        let row = options.querySelector('.theme-builder-svg-hover-animation-row-v82');
        if (!row) {
            row = document.createElement('label');
            row.className = 'theme-builder-svg-option-row theme-builder-svg-hover-animation-row-v82';
            row.innerHTML = `
                <span>Hover Animation</span>
                <select class="theme-builder-svg-hover-animation-select-v82"></select>
            `;

            const soundRow = options.querySelector('.theme-builder-svg-mapped-sound-row');
            if (soundRow) options.insertBefore(row, soundRow);
            else options.appendChild(row);
        }

        row.classList.toggle('hidden', !enabled);
        const select = row.querySelector('.theme-builder-svg-hover-animation-select-v82');
        if (!select) return;

        select.innerHTML = themeHoverAnimationSelectOptionsV82(
            asset.hoverAnimationOverrideV82 || '',
            true,
            globalAnimation
        );
        select.value = String(asset.hoverAnimationOverrideV82 || '');

        if (select.dataset.boundV82 !== 'true') {
            select.dataset.boundV82 = 'true';
            select.addEventListener('pointerdown', event => event.stopPropagation());
            select.addEventListener('click', event => event.stopPropagation());
            select.addEventListener('change', () => {
                asset.hoverAnimationOverrideV82 = select.value;
                updateThemeBuilderPreview(modal);
            });
        }
    });
}

function ensureUploadImagesButtonV82(modal) {
    if (!modal) return;

    const section = modal.querySelector('.theme-builder-svg-section');
    const input = section?.querySelector('.theme-builder-svg-file');
    if (!section || !input) return;

    let button = section.querySelector('.theme-builder-upload-images-v82');
    if (!button) {
        button = document.createElement('button');
        button.type = 'button';
        button.className = 'theme-builder-file-button theme-builder-upload-images-v82';
        button.innerHTML = '<i class="ph ph-upload-simple"></i><span>Upload Images</span>';

        const heading = section.querySelector('.theme-builder-media-heading');
        if (heading) heading.insertAdjacentElement('afterend', button);
        else section.prepend(button);
    }

    button.onclick = event => {
        event.preventDefault();
        input.click();
    };

    section.querySelector('.theme-builder-svg-choose')?.classList.add('theme-image-upload-toolbar-hidden-v40');
    section.querySelectorAll('.theme-builder-svg-add-card').forEach(card => card.remove());
    section.querySelector('.theme-builder-svg-empty')?.remove();

    const headingText = section.querySelector('.theme-builder-media-heading strong');
    if (headingText) headingText.textContent = 'Decorations';
}

function stabilizeDefaultSvgAnimationSelectV82(modal) {
    if (!modal) return;
    const old = modal.querySelector('.theme-builder-svg-default-animation');
    if (!old || old.dataset.stableDefaultAnimationV82 === 'true') return;

    const clone = old.cloneNode(true);
    clone.dataset.stableDefaultAnimationV82 = 'true';
    old.replaceWith(clone);

    clone.addEventListener('pointerdown', event => event.stopPropagation());
    clone.addEventListener('click', event => event.stopPropagation());
    clone.addEventListener('change', () => {
        const value = clone.value;
        modal._themeBackgroundSvgs = (modal._themeBackgroundSvgs || []).map(asset => ({
            ...asset,
            animation: asset.animationOverride || value
        }));

        const scene = modal.querySelector('.theme-builder-svg-scene-preset');
        if (scene) scene.value = 'custom';

        renderThemeBuilderSvgListV2(modal);
        updateThemeBuilderPreview(modal);
    });
}

const getThemeBuilderDraftBeforeV82 = getThemeBuilderDraft;
getThemeBuilderDraft = function(modal) {
    const draft = getThemeBuilderDraftBeforeV82(modal);

    const enabledControl = modal?.querySelector('.theme-builder-svg-hover-animations-enabled-v82');
    const animationControl = modal?.querySelector('.theme-builder-svg-hover-animation-default-v82');

    draft.svgHoverAnimationsEnabledV82 = enabledControl
        ? !!enabledControl.checked
        : !!draft.svgHoverAnimationsEnabledV82;

    draft.svgHoverAnimationV82 = normalizeThemeHoverAnimationV82(
        animationControl?.value || draft.svgHoverAnimationV82,
        THEME_HOVER_ANIMATION_DEFAULT_V82
    );

    // Sounds live inside hover behavior now. If hover behavior is disabled,
    // the saved theme cannot unexpectedly play invisible hover audio.
    if (!draft.svgHoverAnimationsEnabledV82) {
        draft.svgHoverSoundsEnabled = false;
    }

    draft.backgroundSvgs = Array.isArray(modal?._themeBackgroundSvgs)
        ? modal._themeBackgroundSvgs.map(asset => ({ ...asset }))
        : [];

    return draft;
};

const ensureThemeBuilderGlobalSvgControlsBeforeV82 = ensureThemeBuilderGlobalSvgControlsV11;
ensureThemeBuilderGlobalSvgControlsV11 = function(modal, theme) {
    const result = ensureThemeBuilderGlobalSvgControlsBeforeV82(modal, theme);
    stabilizeDefaultSvgAnimationSelectV82(modal);
    ensureThemeHoverAnimationControlsV82(modal, theme || {});
    return result;
};

const renderThemeBuilderSvgListBeforeV82 = renderThemeBuilderSvgListV2;
renderThemeBuilderSvgListV2 = function(modal) {
    const open = captureThemeImageCustomizationStateV82(modal);
    const result = renderThemeBuilderSvgListBeforeV82(modal);

    restoreThemeImageCustomizationStateV82(modal, open);
    ensureUploadImagesButtonV82(modal);
    ensureThemeHoverAnimationControlsV82(modal, getThemeBuilderDraft(modal));
    installPerImageHoverControlsV82(modal);
    stabilizeDefaultSvgAnimationSelectV82(modal);
    syncThemeHoverAnimationUiV82(modal);

    return result;
};

const populateThemeBuilderBeforeV82 = populateThemeBuilder;
populateThemeBuilder = function(modal, theme = {}) {
    const merged = {
        svgHoverAnimationsEnabledV82: !!theme?.svgHoverAnimationsEnabledV82,
        svgHoverAnimationV82: normalizeThemeHoverAnimationV82(
            theme?.svgHoverAnimationV82,
            THEME_HOVER_ANIMATION_DEFAULT_V82
        ),
        ...theme
    };

    const result = populateThemeBuilderBeforeV82(modal, merged);

    ensureThemeAccessoryControlsV32(modal, merged);
    ensureThemeHoverAnimationControlsV82(modal, merged);
    ensureUploadImagesButtonV82(modal);
    stabilizeDefaultSvgAnimationSelectV82(modal);
    installPerImageHoverControlsV82(modal);
    installThemeBuilderSectionTabsV11?.(modal);

    return result;
};

const renderAdvancedThemeBuilderSvgPreviewBeforeV82 = renderAdvancedThemeBuilderSvgPreviewV10;
renderAdvancedThemeBuilderSvgPreviewV10 = function(modal) {
    const result = renderAdvancedThemeBuilderSvgPreviewBeforeV82(modal);
    try {
        const draft = getThemeBuilderDraft(modal);
        const canvas = modal?.querySelector('.theme-builder-live-canvas');
        applyThemeHoverAnimationsV82(canvas, draft);
    } catch {}
    return result;
};

const mountCustomThemeBackgroundSvgsBeforeV82 = mountCustomThemeBackgroundSvgsV2;
mountCustomThemeBackgroundSvgsV2 = function(theme) {
    const result = mountCustomThemeBackgroundSvgsBeforeV82(theme);
    try {
        applyThemeHoverAnimationsV82(
            document.getElementById('custom-theme-background-stage'),
            theme || {}
        );
    } catch {}
    return result;
};

try {
    const renderDashboardPreviewBeforeHoverV82 = renderDashboardPreviewV45;
    renderDashboardPreviewV45 = function(modal) {
        const result = renderDashboardPreviewBeforeHoverV82(modal);
        try {
            const draft = getThemeBuilderDraft(modal);
            const preview = modal?.querySelector('.theme-builder-dashboard-preview-v45');
            applyThemeHoverAnimationsV82(preview, draft);
        } catch {}
        return result;
    };
} catch {}

const updateThemeBuilderPreviewBeforeV82 = updateThemeBuilderPreview;
updateThemeBuilderPreview = function(modal) {
    const result = updateThemeBuilderPreviewBeforeV82(modal);

    try {
        const draft = getThemeBuilderDraft(modal);
        ensureThemeHoverAnimationControlsV82(modal, draft);
        syncThemeHoverAnimationUiV82(modal);
        applyThemeHoverAnimationsV82(modal?.querySelector('.theme-builder-live-canvas'), draft);
        applyThemeHoverAnimationsV82(modal?.querySelector('.theme-builder-dashboard-preview-v45'), draft);
    } catch {}

    return result;
};

requestAnimationFrame(() => {
    const modal = document.getElementById('theme-builder-modal');
    if (!modal) return;

    try {
        ensureThemeAccessoryControlsV32(modal, getThemeBuilderDraft(modal));
        ensureThemeHoverAnimationControlsV82(modal, getThemeBuilderDraft(modal));
        ensureUploadImagesButtonV82(modal);
        installThemeBuilderSectionTabsV11?.(modal);
        installPerImageHoverControlsV82(modal);
        stabilizeDefaultSvgAnimationSelectV82(modal);
    } catch {}
});

// ============================================================
// V85 — RELIABLE DASHBOARD COLOR SYSTEM
// Separate toolbar/log icon colors, category selected/hover colors, and
// preserve every dashboard color through preview, Save & Apply, and re-edit.
// ============================================================

const DASHBOARD_COLOR_FIELDS_V85 = [
    ['Dashboard Background', 'dashboardBackgroundV40', '#f5f5f5'],
    ['Log Cards', 'dashboardCardV40', '#ffffff'],
    ['Accent Color', 'dashboardTextV40', '#171717'],
    ['Buttons Color', 'dashboardAccentV40', '#777777'],
    ['Dashboard Title Color', 'dashboardTitleColorV79', '#171717'],
    ['Dashboard Icons Color', 'dashboardIconColorV81', '#171717'],
    ['Log Page Icons Color', 'dashboardLogIconColorV85', '#171717'],
    ['Category Selected Color', 'dashboardCategorySelectedColorV85', '#777777'],
    ['Category Hovered Color', 'dashboardCategoryHoverColorV85', '#d9d2ff']
];

function dashboardValidHexV85(value) {
    return /^#[0-9a-f]{6}$/i.test(String(value || '').trim());
}

function dashboardColorFallbacksV85(theme = {}) {
    const text = dashboardValidHexV85(theme.dashboardTextV40)
        ? theme.dashboardTextV40
        : (dashboardValidHexV85(theme.text) ? theme.text : '#171717');
    const accent = dashboardValidHexV85(theme.dashboardAccentV40)
        ? theme.dashboardAccentV40
        : (dashboardValidHexV85(theme.accent) ? theme.accent : '#777777');

    return {
        dashboardBackgroundV40: dashboardValidHexV85(theme.dashboardBackgroundV40)
            ? theme.dashboardBackgroundV40
            : (dashboardValidHexV85(theme.background) ? theme.background : '#f5f5f5'),
        dashboardCardV40: dashboardValidHexV85(theme.dashboardCardV40)
            ? theme.dashboardCardV40
            : (dashboardValidHexV85(theme.surface) ? theme.surface : '#ffffff'),
        dashboardTextV40: text,
        dashboardAccentV40: accent,
        dashboardTitleColorV79: dashboardValidHexV85(theme.dashboardTitleColorV79)
            ? theme.dashboardTitleColorV79
            : text,
        dashboardIconColorV81: dashboardValidHexV85(theme.dashboardIconColorV81)
            ? theme.dashboardIconColorV81
            : text,
        dashboardLogIconColorV85: dashboardValidHexV85(theme.dashboardLogIconColorV85)
            ? theme.dashboardLogIconColorV85
            : (dashboardValidHexV85(theme.dashboardIconColorV81) ? theme.dashboardIconColorV81 : text),
        dashboardCategorySelectedColorV85: dashboardValidHexV85(theme.dashboardCategorySelectedColorV85)
            ? theme.dashboardCategorySelectedColorV85
            : accent,
        dashboardCategoryHoverColorV85: dashboardValidHexV85(theme.dashboardCategoryHoverColorV85)
            ? theme.dashboardCategoryHoverColorV85
            : accent
    };
}

function dashboardColorStateV85(modal, theme = {}) {
    if (!modal) return dashboardColorFallbacksV85(theme);
    if (!modal._dashboardColorStateV85) {
        modal._dashboardColorStateV85 = dashboardColorFallbacksV85(theme);
    }
    return modal._dashboardColorStateV85;
}

function setDashboardColorControlV85(section, key, value) {
    if (!section || !dashboardValidHexV85(value)) return;

    const picker = section.querySelector(
        `input[type="color"][data-theme-key="${CSS.escape(key)}"]`
    );
    const hex = section.querySelector(
        `[data-theme-hex="${CSS.escape(key)}"]`
    );

    if (picker && document.activeElement !== picker) picker.value = value;
    if (hex && document.activeElement !== hex) hex.value = value;
}

function readDashboardColorControlV85(section, key, fallback) {
    if (!section) return fallback;
    const picker = section.querySelector(
        `input[type="color"][data-theme-key="${CSS.escape(key)}"]`
    );
    const hex = section.querySelector(
        `[data-theme-hex="${CSS.escape(key)}"]`
    );

    const candidates = [picker?.value, hex?.value, fallback];
    return candidates.find(dashboardValidHexV85) || fallback;
}

function bindDashboardColorControlV85(modal, section, key) {
    const picker = section?.querySelector(
        `input[type="color"][data-theme-key="${CSS.escape(key)}"]`
    );
    const hex = section?.querySelector(
        `[data-theme-hex="${CSS.escape(key)}"]`
    );

    if (picker && picker.dataset.boundDashboardColorV85 !== 'true') {
        picker.dataset.boundDashboardColorV85 = 'true';

        picker.addEventListener('pointerdown', () => {
            modal._dashboardColorPickerOpenV51 = true;
        }, true);

        picker.addEventListener('input', () => {
            const state = dashboardColorStateV85(modal);
            state[key] = picker.value;
            if (hex) hex.value = picker.value;
            updateThemeBuilderPreview(modal);
        });

        const finish = () => setTimeout(() => {
            modal._dashboardColorPickerOpenV51 = false;
        }, 0);
        picker.addEventListener('change', finish);
        picker.addEventListener('blur', finish);
    }

    if (hex && hex.dataset.boundDashboardColorV85 !== 'true') {
        hex.dataset.boundDashboardColorV85 = 'true';
        hex.addEventListener('input', () => {
            const value = String(hex.value || '').trim();
            if (!dashboardValidHexV85(value)) return;
            const state = dashboardColorStateV85(modal);
            state[key] = value;
            if (picker) picker.value = value;
            updateThemeBuilderPreview(modal);
        });
    }
}

const stableDashboardThemeControlsBeforeV85 =
    typeof stableDashboardThemeControlsV51 === 'function'
        ? stableDashboardThemeControlsV51
        : null;

function stableDashboardThemeControlsV85(modal, theme = {}) {
    const section = stableDashboardThemeControlsBeforeV85
        ? stableDashboardThemeControlsBeforeV85(modal, theme)
        : modal?.querySelector('.theme-builder-dashboard-colors-v42');

    if (!section || !modal) return section;

    const state = dashboardColorStateV85(modal, theme);
    if (modal._dashboardColorHydratingV85) {
        Object.assign(state, dashboardColorFallbacksV85(theme));
    }

    const grid = section.querySelector('.theme-builder-dashboard-color-grid-v42') ||
        section.querySelector('.theme-builder-color-grid');
    if (!grid) return section;

    // Keep the requested labels even if an older wrapper tries to restore them.
    const relabel = (key, label) => {
        const input = section.querySelector(`[data-theme-key="${CSS.escape(key)}"]`);
        const span = input?.closest('.theme-builder-field')?.querySelector(':scope > span');
        if (span) span.textContent = label;
    };
    relabel('dashboardTextV40', 'Accent Color');
    relabel('dashboardAccentV40', 'Buttons Color');

    DASHBOARD_COLOR_FIELDS_V85.forEach(([label, key, defaultValue]) => {
        let picker = section.querySelector(
            `input[type="color"][data-theme-key="${CSS.escape(key)}"]`
        );

        if (!picker) {
            const initial = dashboardValidHexV85(state[key])
                ? state[key]
                : defaultValue;
            grid.insertAdjacentHTML(
                'beforeend',
                themeBuilderField(label, key, initial)
            );
            picker = section.querySelector(
                `input[type="color"][data-theme-key="${CSS.escape(key)}"]`
            );
        }

        if (modal._dashboardColorHydratingV85) {
            setDashboardColorControlV85(
                section,
                key,
                dashboardValidHexV85(state[key]) ? state[key] : defaultValue
            );
        } else {
            state[key] = readDashboardColorControlV85(
                section,
                key,
                dashboardValidHexV85(state[key]) ? state[key] : defaultValue
            );
        }

        bindDashboardColorControlV85(modal, section, key);
    });

    return section;
}

if (stableDashboardThemeControlsBeforeV85) {
    stableDashboardThemeControlsV51 = stableDashboardThemeControlsV85;
    ensureDashboardThemeControlsV42 = stableDashboardThemeControlsV85;
    ensureDashboardThemeControlsV40 = stableDashboardThemeControlsV85;
}

const getThemeBuilderDraftBeforeDashboardColorsV85 = getThemeBuilderDraft;
getThemeBuilderDraft = function(modal) {
    const draft = getThemeBuilderDraftBeforeDashboardColorsV85(modal);
    if (!modal) return draft;

    const state = dashboardColorStateV85(modal, draft);
    const section = modal.querySelector('.theme-builder-dashboard-colors-v42');

    DASHBOARD_COLOR_FIELDS_V85.forEach(([, key, defaultValue]) => {
        let value;
        if (modal._dashboardColorHydratingV85) {
            value = state[key];
        } else {
            value = readDashboardColorControlV85(
                section,
                key,
                state[key] || draft[key] || defaultValue
            );
        }

        if (!dashboardValidHexV85(value)) {
            value = dashboardColorFallbacksV85({ ...draft, ...state })[key] || defaultValue;
        }

        state[key] = value;
        draft[key] = value;
    });

    return draft;
};

const populateThemeBuilderBeforeDashboardColorsV85 = populateThemeBuilder;
populateThemeBuilder = function(modal, theme = {}) {
    if (!modal) return populateThemeBuilderBeforeDashboardColorsV85(modal, theme);

    modal._dashboardColorHydratingV85 = true;
    modal._dashboardColorStateV85 = dashboardColorFallbacksV85(theme);

    let result;
    try {
        result = populateThemeBuilderBeforeDashboardColorsV85(modal, theme);
        stableDashboardThemeControlsV85(modal, theme);
    } finally {
        modal._dashboardColorHydratingV85 = false;
    }

    syncDashboardPreviewColorsV85(modal);
    return result;
};

function dashboardReadableColorV85(color) {
    try {
        if (typeof getReadableTextColor === 'function') {
            return getReadableTextColor(color);
        }
    } catch {}
    return '#ffffff';
}

function syncDashboardPreviewColorsV85(modal) {
    if (!modal) return;
    const preview = modal.querySelector('.theme-builder-dashboard-preview-v45');
    if (!preview) return;

    const draft = getThemeBuilderDraft(modal);
    const colors = dashboardColorFallbacksV85(draft);

    preview.style.setProperty('--tb-dashboard-bg-v45', colors.dashboardBackgroundV40);
    preview.style.setProperty('--tb-dashboard-card-v45', colors.dashboardCardV40);
    preview.style.setProperty('--tb-dashboard-text-v45', colors.dashboardTextV40);
    preview.style.setProperty('--tb-dashboard-accent-v45', colors.dashboardAccentV40);
    preview.style.setProperty('--tb-dashboard-title-v79', colors.dashboardTitleColorV79);
    preview.style.setProperty('--tb-dashboard-icon-v81', colors.dashboardIconColorV81);
    preview.style.setProperty('--tb-dashboard-log-icon-v85', colors.dashboardLogIconColorV85);
    preview.style.setProperty('--tb-dashboard-category-selected-v85', colors.dashboardCategorySelectedColorV85);
    preview.style.setProperty('--tb-dashboard-category-hover-v85', colors.dashboardCategoryHoverColorV85);
    preview.style.setProperty(
        '--tb-dashboard-category-selected-text-v85',
        dashboardReadableColorV85(colors.dashboardCategorySelectedColorV85)
    );
    preview.style.setProperty(
        '--tb-dashboard-category-hover-text-v85',
        dashboardReadableColorV85(colors.dashboardCategoryHoverColorV85)
    );
}

try {
    const renderDashboardPreviewBeforeColorsV85 = renderDashboardPreviewV45;
    renderDashboardPreviewV45 = function(modal) {
        const result = renderDashboardPreviewBeforeColorsV85(modal);
        syncDashboardPreviewColorsV85(modal);
        return result;
    };
} catch {}

try {
    const updateThemeBuilderPreviewBeforeColorsV85 = updateThemeBuilderPreview;
    updateThemeBuilderPreview = function(modal) {
        const result = updateThemeBuilderPreviewBeforeColorsV85(modal);
        syncDashboardPreviewColorsV85(modal);
        return result;
    };
} catch {}

// Preserve dashboard-specific values if an existing shared theme is republished
// through a legacy path that happens not to include a late-added field.
try {
    const publishSharedThemeBeforeColorsV85 = publishSharedThemeV40;
    publishSharedThemeV40 = function(payload = {}) {
        const existing = readSharedThemeLibraryV40?.().find(item => item.id === payload.id);
        const existingTheme = existing?.theme || {};
        const nextTheme = { ...(payload.theme || {}) };

        DASHBOARD_COLOR_FIELDS_V85.forEach(([, key]) => {
            if (!dashboardValidHexV85(nextTheme[key]) && dashboardValidHexV85(existingTheme[key])) {
                nextTheme[key] = existingTheme[key];
            }
        });

        return publishSharedThemeBeforeColorsV85({
            ...payload,
            theme: nextTheme
        });
    };
} catch {}

requestAnimationFrame(() => {
    const modal = document.getElementById('theme-builder-modal');
    if (!modal) return;
    try {
        stableDashboardThemeControlsV85(modal, getThemeBuilderDraft(modal));
        syncDashboardPreviewColorsV85(modal);
    } catch {}
});


// ============================================================
// V86 — DECORATIONS CLEANUP / NO-FLASH SIZE + RE-SPACE UPDATES
// ============================================================

function cleanDecorationBuilderChromeV86(modal) {
    if (!modal) return;

    const section = modal.querySelector('.theme-builder-svg-section');
    if (section) {
        // The old dashed count/toolbar row is obsolete now that Upload Images
        // has its own full-width button.
        section.querySelector('.theme-builder-svg-toolbar')?.remove();
        section.querySelector('.theme-builder-svg-empty')?.remove();
        section.querySelectorAll('.theme-builder-svg-add-card').forEach(card => card.remove());
    }

    const sizeLabel = modal.querySelector('.theme-builder-svg-size-v19 > span');
    if (sizeLabel) sizeLabel.textContent = 'Size';

    const animation = modal.querySelector('.theme-builder-svg-default-animation');
    const animationLabel = animation?.closest('.theme-builder-field')?.querySelector(':scope > span');
    if (animationLabel) animationLabel.textContent = 'Default Animation';

    const placement = modal.querySelector('.theme-builder-svg-distribution');
    const placementLabel = placement?.closest('.theme-builder-field')?.querySelector(':scope > span');
    if (placementLabel) placementLabel.textContent = 'Decoration Placement';
}

function refreshDecorationArtworkOnlyV86(modal, rebuildArtwork = false) {
    if (!modal) return;

    const draft = getThemeBuilderDraft(modal);
    const scale = String(getThemeSvgScaleV19(draft.svgGlobalScale) / 100);

    // Put the scale on the modal itself so both preview modes inherit it.
    modal.style.setProperty('--theme-svg-global-scale', scale, 'important');

    const canvas = modal.querySelector('.theme-builder-live-canvas');
    if (canvas) {
        syncThemeBuilderSvgScaleV19(canvas, draft);
    }

    if (rebuildArtwork) {
        // Redraw only the artwork stages. Do NOT redraw the Decorations gallery;
        // that redraw was what made every Customize panel visibly flash open.
        try {
            renderAdvancedThemeBuilderSvgPreviewV10(modal);
        } catch {}

        if (modal._dashboardPreviewActiveV45) {
            try {
                renderDashboardPreviewV45(modal);
            } catch {}
            try {
                syncDashboardPreviewBackgroundV79(modal);
            } catch {}
            try {
                scheduleDashboardPreviewMotionV78(modal);
            } catch {}
        }
    }

    try {
        applyThemeHoverAnimationsV82(canvas, draft);
    } catch {}
}

// Size changes are preview-only operations. They no longer run the giant
// updateThemeBuilderPreview pipeline, so the image cards never get rebuilt.
setThemeBuilderSvgScaleV19 = function(modal, value) {
    if (!modal) return;

    modal._themeSvgGlobalScaleV19 = getThemeSvgScaleV19(value);

    const output = modal.querySelector('.theme-builder-svg-size-value-v19');
    if (output) {
        output.textContent = `${modal._themeSvgGlobalScaleV19}%`;
    }

    let shouldRebuildArtwork = false;
    const overlapEnabled = !!modal.querySelector(
        '.theme-builder-svg-overlap-enabled-v26'
    )?.checked;

    if (!overlapEnabled) {
        const draft = getThemeBuilderDraft(modal);

        if (draft.svgDistribution === 'manual-fixed') {
            try {
                resolveManualPlacementOverlapV41(
                    modal,
                    modal._themeSvgGlobalScaleV19
                );
            } catch {}
        } else {
            modal._themePreviewDistributionSeedV10 = Math.random() * 100000;
        }

        shouldRebuildArtwork = true;
    }

    refreshDecorationArtworkOnlyV86(modal, shouldRebuildArtwork);
    cleanDecorationBuilderChromeV86(modal);
};

// Re-space is also artwork-only. The Decorations card DOM is left completely
// untouched, including which individual Customize panels are open or closed.
rspreadThemeImagesV41 = function(modal) {
    if (!modal) return;

    const draft = getThemeBuilderDraft(modal);
    if (draft.svgAllowOverlap) return;

    if (draft.svgDistribution === 'manual-fixed') {
        try {
            resolveManualPlacementOverlapV41(modal, draft.svgGlobalScale);
        } catch {}
    } else {
        modal._themePreviewDistributionSeedV10 = Math.random() * 100000;
    }

    refreshDecorationArtworkOnlyV86(modal, true);
    cleanDecorationBuilderChromeV86(modal);
};

// Keep the obsolete toolbar removed after uploads/paging rebuild the gallery.
try {
    const renderThemeBuilderSvgListBeforeV86 = renderThemeBuilderSvgListV2;
    renderThemeBuilderSvgListV2 = function(modal) {
        const result = renderThemeBuilderSvgListBeforeV86(modal);
        cleanDecorationBuilderChromeV86(modal);
        return result;
    };
} catch {}

try {
    const ensureThemeBuilderGlobalSvgControlsBeforeV86 = ensureThemeBuilderGlobalSvgControlsV11;
    ensureThemeBuilderGlobalSvgControlsV11 = function(modal, theme) {
        const result = ensureThemeBuilderGlobalSvgControlsBeforeV86(modal, theme);
        cleanDecorationBuilderChromeV86(modal);
        return result;
    };
} catch {}

try {
    const populateThemeBuilderBeforeV86 = populateThemeBuilder;
    populateThemeBuilder = function(modal, theme = {}) {
        const result = populateThemeBuilderBeforeV86(modal, theme);
        cleanDecorationBuilderChromeV86(modal);
        return result;
    };
} catch {}

requestAnimationFrame(() => {
    cleanDecorationBuilderChromeV86(
        document.getElementById('theme-builder-modal')
    );
});


// ============================================================
// V87 — DECORATION PREVIEW STABILITY + HOVER SOUND LIFECYCLE
// ============================================================

const THEME_HOVER_SOUND_STOP_MODE_DEFAULT_V87 = 'immediate';
const THEME_HOVER_SOUND_STOP_DELAY_DEFAULT_V87 = 0.1;

function normalizeThemeHoverSoundStopModeV87(value) {
    return String(value || '').trim() === 'delay' ? 'delay' : 'immediate';
}

function normalizeThemeHoverSoundStopDelayV87(value) {
    const n = Number(value);
    return Math.max(0.1, Math.min(10, Number.isFinite(n) ? n : THEME_HOVER_SOUND_STOP_DELAY_DEFAULT_V87));
}

function syncThemeHoverSoundStopUiV87(modal) {
    if (!modal) return;
    const mode = normalizeThemeHoverSoundStopModeV87(
        modal.querySelector('.theme-builder-svg-hover-sound-stop-mode-v87')?.value
    );
    const delayRow = modal.querySelector('.theme-builder-svg-hover-sound-stop-delay-row-v87');
    delayRow?.classList.toggle('hidden', mode !== 'delay');
}

function ensureThemeHoverSoundStopControlsV87(modal, theme = {}) {
    if (!modal) return;
    const details = modal.querySelector('.theme-builder-svg-hover-sound-details');
    if (!details) return;

    let host = details.querySelector('.theme-builder-svg-hover-sound-stop-controls-v87');
    if (!host) {
        host = document.createElement('div');
        host.className = 'theme-builder-svg-hover-sound-stop-controls-v87';
        host.innerHTML = `
            <label class="theme-builder-field">
                <span>Stop Sound</span>
                <select class="theme-builder-svg-hover-sound-stop-mode-v87">
                    <option value="immediate">As soon as hover ends</option>
                    <option value="delay">After custom seconds</option>
                </select>
            </label>
            <label class="theme-builder-field theme-builder-svg-hover-sound-stop-delay-row-v87">
                <span>Stop Delay (seconds)</span>
                <input
                    type="number"
                    class="theme-builder-svg-hover-sound-stop-delay-v87"
                    min="0.1"
                    max="10"
                    step="0.1"
                    inputmode="decimal"
                >
            </label>
        `;

        const list = details.querySelector('.theme-builder-hover-sound-list');
        if (list) details.insertBefore(host, list);
        else details.appendChild(host);
    }

    const mode = host.querySelector('.theme-builder-svg-hover-sound-stop-mode-v87');
    const delay = host.querySelector('.theme-builder-svg-hover-sound-stop-delay-v87');

    const savedMode = normalizeThemeHoverSoundStopModeV87(
        theme.svgHoverSoundStopModeV87 ?? modal._themeHoverSoundStopModeV87
    );
    const savedDelay = normalizeThemeHoverSoundStopDelayV87(
        theme.svgHoverSoundStopDelayV87 ?? modal._themeHoverSoundStopDelayV87
    );

    if (mode && document.activeElement !== mode) mode.value = savedMode;
    if (delay && document.activeElement !== delay) delay.value = String(savedDelay);
    modal._themeHoverSoundStopModeV87 = savedMode;
    modal._themeHoverSoundStopDelayV87 = savedDelay;

    if (mode && mode.dataset.boundV87 !== 'true') {
        mode.dataset.boundV87 = 'true';
        mode.addEventListener('change', () => {
            modal._themeHoverSoundStopModeV87 = normalizeThemeHoverSoundStopModeV87(mode.value);
            syncThemeHoverSoundStopUiV87(modal);
            scheduleThemePreviewHoverV87(modal);
        });
    }

    if (delay && delay.dataset.boundV87 !== 'true') {
        delay.dataset.boundV87 = 'true';
        delay.addEventListener('input', () => {
            modal._themeHoverSoundStopDelayV87 = normalizeThemeHoverSoundStopDelayV87(delay.value);
            scheduleThemePreviewHoverV87(modal);
        });
        delay.addEventListener('change', () => {
            delay.value = String(normalizeThemeHoverSoundStopDelayV87(delay.value));
            modal._themeHoverSoundStopDelayV87 = Number(delay.value);
        });
    }

    syncThemeHoverSoundStopUiV87(modal);
}

// Suppress the historical fire-and-forget hover sound player. Those anonymous
// listeners still exist on some old render paths; V87 owns hover audio so it
// can stop reliably on pointerleave.
try {
    playSingleThemeHoverSoundV10 = function() {};
} catch {}

function stopThemeHoverAudioForItemV87(item, delayMs = 0) {
    if (!item) return;
    if (item._themeHoverStopTimerV87) {
        clearTimeout(item._themeHoverStopTimerV87);
        item._themeHoverStopTimerV87 = null;
    }

    const stop = () => {
        const audio = item._themeHoverAudioV87;
        item._themeHoverAudioV87 = null;
        if (!audio) return;
        try {
            audio.pause();
            audio.currentTime = 0;
            audio.src = '';
        } catch {}
    };

    if (delayMs > 0) {
        item._themeHoverStopTimerV87 = setTimeout(stop, delayMs);
    } else {
        stop();
    }
}

function startThemeHoverAudioForItemV87(item, theme, asset) {
    if (!item || !theme?.svgHoverSoundsEnabled) return;

    stopThemeHoverAudioForItemV87(item, 0);

    let url = '';
    try {
        url = chooseThemeHoverSoundUrlV10(theme, asset) || '';
    } catch {}
    if (!url) return;

    const audio = new Audio(url);
    const rawVolume = Number(theme.svgHoverVolume);
    audio.volume = Math.max(0, Math.min(1, (Number.isFinite(rawVolume) ? rawVolume : 72) / 100));
    item._themeHoverAudioV87 = audio;

    audio.addEventListener('ended', () => {
        if (item._themeHoverAudioV87 === audio) item._themeHoverAudioV87 = null;
    }, { once: true });

    audio.play().catch(() => {
        if (item._themeHoverAudioV87 === audio) item._themeHoverAudioV87 = null;
    });
}

function bindThemeHoverSoundItemV87(item, theme, asset) {
    if (!item) return;

    if (item._themeHoverSoundEnterV87) {
        item.removeEventListener('pointerenter', item._themeHoverSoundEnterV87);
    }
    if (item._themeHoverSoundLeaveV87) {
        item.removeEventListener('pointerleave', item._themeHoverSoundLeaveV87);
    }

    const soundsEnabled = !!theme?.svgHoverAnimationsEnabledV82 && !!theme?.svgHoverSoundsEnabled;
    item.dataset.themeHoverSoundEnabledV87 = soundsEnabled ? 'true' : 'false';

    if (!soundsEnabled) {
        stopThemeHoverAudioForItemV87(item, 0);
        return;
    }

    // Late preview CSS intentionally makes the artwork layer click-through.
    // Individual decorations must remain hit-testable for hover effects.
    item.style.setProperty('pointer-events', 'auto', 'important');

    const enter = () => {
        startThemeHoverAudioForItemV87(item, theme, asset);
    };

    const leave = () => {
        const mode = normalizeThemeHoverSoundStopModeV87(theme.svgHoverSoundStopModeV87);
        const ms = mode === 'delay'
            ? normalizeThemeHoverSoundStopDelayV87(theme.svgHoverSoundStopDelayV87) * 1000
            : 0;
        stopThemeHoverAudioForItemV87(item, ms);
    };

    item.addEventListener('pointerenter', enter);
    item.addEventListener('pointerleave', leave);
    item._themeHoverSoundEnterV87 = enter;
    item._themeHoverSoundLeaveV87 = leave;
}

function applyThemeHoverBehaviorV87(root, theme) {
    if (!root) return;

    try { applyThemeHoverAnimationsV82(root, theme || {}); } catch {}

    const assets = Array.isArray(theme?.backgroundSvgs) ? theme.backgroundSvgs : [];
    const items = Array.from(root.querySelectorAll([
        '.theme-builder-live-art-item',
        '.theme-builder-dashboard-art-item-v45',
        '.theme-builder-dashboard-art-item-v40',
        '.custom-theme-background-svg'
    ].join(',')));

    items.forEach((item, displayIndex) => {
        let index = Number(item.dataset.svgIndex);
        if (!Number.isFinite(index) || index < 0 || index >= assets.length) {
            const manualIndex = Number(item.dataset.manualSlotV45);
            index = Number.isFinite(manualIndex) ? manualIndex : displayIndex;
        }
        const asset = assets.length ? (assets[index % assets.length] || {}) : {};
        bindThemeHoverSoundItemV87(item, theme || {}, asset);
    });
}

function scheduleThemePreviewHoverV87(modal) {
    if (!modal) return;
    const run = () => {
        const draft = getThemeBuilderDraft(modal);
        applyThemeHoverBehaviorV87(modal.querySelector('.theme-builder-live-canvas'), draft);
        applyThemeHoverBehaviorV87(modal.querySelector('.theme-builder-dashboard-preview-v45'), draft);
    };
    requestAnimationFrame(() => requestAnimationFrame(run));
    setTimeout(run, 45);
}

// V61 is the renderer that owns the visible Log Page artwork in current builds.
// Bind after it, not only after the old V10 stage renderer.
try {
    const renderThemeArtworkPreviewBeforeV87 = renderThemeArtworkPreviewV61;
    renderThemeArtworkPreviewV61 = function(modal) {
        const result = renderThemeArtworkPreviewBeforeV87(modal);
        scheduleThemePreviewHoverV87(modal);
        return result;
    };
} catch {}

try {
    const renderDashboardPreviewBeforeV87 = renderDashboardPreviewV45;
    renderDashboardPreviewV45 = function(modal) {
        const result = renderDashboardPreviewBeforeV87(modal);
        scheduleThemePreviewHoverV87(modal);
        return result;
    };
} catch {}

try {
    const updateThemeBuilderPreviewBeforeV87 = updateThemeBuilderPreview;
    updateThemeBuilderPreview = function(modal) {
        const result = updateThemeBuilderPreviewBeforeV87(modal);
        scheduleThemePreviewHoverV87(modal);
        return result;
    };
} catch {}

// Real log-page custom theme decorations get the exact same hover animation
// and bounded audio lifecycle as both previews.
try {
    const mountCustomThemeBackgroundSvgsBeforeV87 = mountCustomThemeBackgroundSvgsV2;
    mountCustomThemeBackgroundSvgsV2 = function(theme) {
        const result = mountCustomThemeBackgroundSvgsBeforeV87(theme);
        requestAnimationFrame(() => {
            applyThemeHoverBehaviorV87(
                document.getElementById('custom-theme-background-stage'),
                theme || {}
            );
        });
        return result;
    };
} catch {}

// Save + restore the new hover-audio stop behavior.
try {
    const getThemeBuilderDraftBeforeV87 = getThemeBuilderDraft;
    getThemeBuilderDraft = function(modal) {
        const draft = getThemeBuilderDraftBeforeV87(modal);
        const mode = modal?.querySelector('.theme-builder-svg-hover-sound-stop-mode-v87')?.value;
        const delay = modal?.querySelector('.theme-builder-svg-hover-sound-stop-delay-v87')?.value;
        draft.svgHoverSoundStopModeV87 = normalizeThemeHoverSoundStopModeV87(
            mode ?? modal?._themeHoverSoundStopModeV87 ?? draft.svgHoverSoundStopModeV87
        );
        draft.svgHoverSoundStopDelayV87 = normalizeThemeHoverSoundStopDelayV87(
            delay ?? modal?._themeHoverSoundStopDelayV87 ?? draft.svgHoverSoundStopDelayV87
        );
        return draft;
    };
} catch {}

try {
    const populateThemeBuilderBeforeV87 = populateThemeBuilder;
    populateThemeBuilder = function(modal, theme = {}) {
        const merged = {
            svgHoverSoundStopModeV87: normalizeThemeHoverSoundStopModeV87(theme.svgHoverSoundStopModeV87),
            svgHoverSoundStopDelayV87: normalizeThemeHoverSoundStopDelayV87(theme.svgHoverSoundStopDelayV87),
            ...theme
        };
        const result = populateThemeBuilderBeforeV87(modal, merged);
        ensureThemeHoverSoundStopControlsV87(modal, merged);
        removeLegacyDecorationUploadCardsV87(modal);
        installDecorationUploadCardGuardV87(modal);
        scheduleThemePreviewHoverV87(modal);
        return result;
    };
} catch {}

try {
    const ensureThemeBuilderGlobalSvgControlsBeforeV87 = ensureThemeBuilderGlobalSvgControlsV11;
    ensureThemeBuilderGlobalSvgControlsV11 = function(modal, theme) {
        const result = ensureThemeBuilderGlobalSvgControlsBeforeV87(modal, theme);
        ensureThemeHoverSoundStopControlsV87(modal, theme || {});
        removeLegacyDecorationUploadCardsV87(modal);
        return result;
    };
} catch {}

// --------------------------------------------------------------------------
// Decorations gallery: the ONLY upload affordance is the full-width button at
// the top. Never append an upload/add card to the end of the image grid.
// --------------------------------------------------------------------------

function removeLegacyDecorationUploadCardsV87(modal) {
    const section = modal?.querySelector('.theme-builder-svg-section');
    if (!section) return;

    section.querySelector('.theme-builder-svg-toolbar')?.remove();
    section.querySelector('.theme-builder-svg-empty')?.remove();
    section.querySelectorAll('.theme-builder-svg-add-card, .theme-builder-svg-add-empty').forEach(node => node.remove());

    const list = section.querySelector('.theme-builder-svg-list');
    list?.querySelectorAll('button').forEach(button => {
        if (button.classList.contains('theme-builder-image-load-more-v62') ||
            button.classList.contains('theme-builder-image-load-more-v59')) return;
        const label = String(button.textContent || button.getAttribute('aria-label') || '').replace(/\s+/g, ' ').trim();
        if (/^(upload images|add artwork|add images)$/i.test(label)) button.remove();
    });
}

function installDecorationUploadCardGuardV87(modal) {
    const list = modal?.querySelector('.theme-builder-svg-list');
    if (!list || list._uploadCardObserverV87) return;

    let queued = false;
    const observer = new MutationObserver(() => {
        if (queued) return;
        queued = true;
        requestAnimationFrame(() => {
            queued = false;
            removeLegacyDecorationUploadCardsV87(modal);
        });
    });
    observer.observe(list, { childList: true, subtree: false });
    list._uploadCardObserverV87 = observer;
}

// Replace V62 paging helper with a load-more-only implementation. This removes
// the end card structurally instead of merely hiding it with CSS.
try {
    appendThemeImagePagingCardsV62 = function(modal, host, all, limit, pageSize = themeImagePageSizeV62()) {
        if (!host) return;
        host.querySelector('.theme-builder-image-load-more-v62')?.remove();
        host.querySelectorAll('.theme-builder-svg-add-card, .theme-builder-svg-add-empty').forEach(node => node.remove());

        if (all.length > limit) {
            const more = document.createElement('button');
            more.type = 'button';
            more.className = 'theme-builder-svg-card theme-builder-image-load-more-v62';
            more.innerHTML = `
                <i class="ph ph-caret-down"></i>
                <strong>Show ${Math.min(pageSize, all.length - limit)} more</strong>
                <small>${limit} of ${all.length} loaded</small>
            `;
            const load = event => {
                event.preventDefault();
                event.stopPropagation();
                event.stopImmediatePropagation();
                modal._themeImageRenderLimitV62 = Math.min(all.length, limit + pageSize);
                renderThemeBuilderSvgListV2(modal);
            };
            more.addEventListener('pointerdown', event => event.stopPropagation(), true);
            more.addEventListener('click', load, true);
            host.appendChild(more);
        }
    };
} catch {}

// Do not allow an artwork-only update to rebuild the Decorations gallery.
try {
    const renderThemeBuilderSvgListBeforeV87 = renderThemeBuilderSvgListV2;
    renderThemeBuilderSvgListV2 = function(modal) {
        if (modal?._themeDecorationArtworkOnlyV87) return;
        const result = renderThemeBuilderSvgListBeforeV87(modal);
        removeLegacyDecorationUploadCardsV87(modal);
        installDecorationUploadCardGuardV87(modal);
        ensureThemeHoverSoundStopControlsV87(modal, getThemeBuilderDraft(modal));
        return result;
    };
} catch {}

function refreshDecorationArtworkOnlyV87(modal) {
    if (!modal) return;
    modal._themeDecorationArtworkOnlyV87 = true;

    const draft = getThemeBuilderDraft(modal);
    const scale = String(getThemeSvgScaleV19(draft.svgGlobalScale) / 100);
    modal.style.setProperty('--theme-svg-global-scale', scale, 'important');
    modal.querySelector('.theme-builder-live-canvas')?.style.setProperty('--theme-svg-global-scale', scale, 'important');
    modal.querySelector('.theme-builder-dashboard-preview-v45')?.style.setProperty('--theme-svg-global-scale', scale, 'important');

    try {
        if (typeof renderThemeArtworkPreviewV61 === 'function') {
            renderThemeArtworkPreviewV61(modal);
        }
    } catch {}

    if (modal._dashboardPreviewActiveV45) {
        try { renderDashboardPreviewV45(modal); } catch {}
        try { syncDashboardPreviewBackgroundV79(modal); } catch {}
        try { scheduleDashboardPreviewMotionV78(modal); } catch {}
    }

    scheduleThemePreviewHoverV87(modal);
    removeLegacyDecorationUploadCardsV87(modal);

    // Keep the lock through the late requestAnimationFrame renderers used by
    // the preview. This prevents a hidden legacy list refresh from flashing all
    // Customize bodies open for one frame.
    requestAnimationFrame(() => requestAnimationFrame(() => {
        modal._themeDecorationArtworkOnlyV87 = false;
        removeLegacyDecorationUploadCardsV87(modal);
    }));
}

setThemeBuilderSvgScaleV19 = function(modal, value) {
    if (!modal) return;
    modal._themeSvgGlobalScaleV19 = getThemeSvgScaleV19(value);

    const output = modal.querySelector('.theme-builder-svg-size-value-v19');
    if (output) output.textContent = `${modal._themeSvgGlobalScaleV19}%`;

    const overlapEnabled = !!modal.querySelector('.theme-builder-svg-overlap-enabled-v26')?.checked;
    if (!overlapEnabled) {
        const draft = getThemeBuilderDraft(modal);
        if (draft.svgDistribution === 'manual-fixed') {
            try { resolveManualPlacementOverlapV41(modal, modal._themeSvgGlobalScaleV19); } catch {}
        } else {
            modal._themePreviewDistributionSeedV10 = Math.random() * 100000;
        }
    }

    // Always redraw the CURRENT V61 artwork stage. The old V10 renderer was
    // removing the visible V61 stage and placing a hidden stage behind it,
    // which is why decorations vanished after +/- until Reload/Re-space.
    refreshDecorationArtworkOnlyV87(modal);
};

rspreadThemeImagesV41 = function(modal) {
    if (!modal) return;
    const draft = getThemeBuilderDraft(modal);
    if (draft.svgAllowOverlap) return;

    if (draft.svgDistribution === 'manual-fixed') {
        try { resolveManualPlacementOverlapV41(modal, draft.svgGlobalScale); } catch {}
    } else {
        modal._themePreviewDistributionSeedV10 = Math.random() * 100000;
    }

    refreshDecorationArtworkOnlyV87(modal);
};

requestAnimationFrame(() => {
    const modal = document.getElementById('theme-builder-modal');
    if (!modal) return;
    ensureThemeHoverSoundStopControlsV87(modal, getThemeBuilderDraft(modal));
    removeLegacyDecorationUploadCardsV87(modal);
    installDecorationUploadCardGuardV87(modal);
    scheduleThemePreviewHoverV87(modal);
});


// ============================================================
// V88 — HOVER SOUND FADE + ATOMIC RE-SPACE UI
// ============================================================

const THEME_HOVER_SOUND_FADE_DEFAULT_V88 = false;

function syncThemeHoverSoundStopUiV88(modal) {
    if (!modal) return;
    try { syncThemeHoverSoundStopUiV87(modal); } catch {}
    const mode = normalizeThemeHoverSoundStopModeV87(
        modal.querySelector('.theme-builder-svg-hover-sound-stop-mode-v87')?.value
    );
    const fadeRow = modal.querySelector('.theme-builder-svg-hover-sound-fade-row-v88');
    fadeRow?.classList.toggle('hidden', mode !== 'delay');
}

function ensureThemeHoverSoundFadeControlV88(modal, theme = {}) {
    if (!modal) return;
    try { ensureThemeHoverSoundStopControlsV87(modal, theme || {}); } catch {}

    const host = modal.querySelector('.theme-builder-svg-hover-sound-stop-controls-v87');
    if (!host) return;

    let row = host.querySelector('.theme-builder-svg-hover-sound-fade-row-v88');
    if (!row) {
        row = document.createElement('label');
        row.className = 'theme-builder-svg-hover-sound-fade-row-v88';
        row.innerHTML = `
            <span class="theme-builder-svg-hover-sound-fade-copy-v88">
                <strong>Fade at the end</strong>
                <small>Gently lower the hover sound before it stops.</small>
            </span>
            <input type="checkbox" class="theme-builder-svg-hover-sound-fade-v88">
        `;
        host.appendChild(row);
    }

    const input = row.querySelector('.theme-builder-svg-hover-sound-fade-v88');
    const saved = theme.svgHoverSoundFadeOnStopV88 === undefined
        ? !!modal._themeHoverSoundFadeOnStopV88
        : !!theme.svgHoverSoundFadeOnStopV88;

    if (input && document.activeElement !== input) input.checked = saved;
    modal._themeHoverSoundFadeOnStopV88 = saved;

    const mode = host.querySelector('.theme-builder-svg-hover-sound-stop-mode-v87');
    if (mode && mode.dataset.fadeSyncBoundV88 !== 'true') {
        mode.dataset.fadeSyncBoundV88 = 'true';
        const sync = () => {
            modal._themeHoverSoundStopModeV87 = normalizeThemeHoverSoundStopModeV87(mode.value);
            syncThemeHoverSoundStopUiV88(modal);
            scheduleThemePreviewHoverV87(modal);
        };
        mode.addEventListener('input', sync);
        mode.addEventListener('change', sync);
    }

    if (input && input.dataset.boundV88 !== 'true') {
        input.dataset.boundV88 = 'true';
        input.addEventListener('change', () => {
            modal._themeHoverSoundFadeOnStopV88 = !!input.checked;
            scheduleThemePreviewHoverV87(modal);
        });
    }

    syncThemeHoverSoundStopUiV88(modal);
}

try {
    const getThemeBuilderDraftBeforeFadeV88 = getThemeBuilderDraft;
    getThemeBuilderDraft = function(modal) {
        const draft = getThemeBuilderDraftBeforeFadeV88(modal);
        const input = modal?.querySelector('.theme-builder-svg-hover-sound-fade-v88');
        draft.svgHoverSoundFadeOnStopV88 = input
            ? !!input.checked
            : !!(modal?._themeHoverSoundFadeOnStopV88 ?? draft.svgHoverSoundFadeOnStopV88);
        return draft;
    };
} catch {}

try {
    const populateThemeBuilderBeforeFadeV88 = populateThemeBuilder;
    populateThemeBuilder = function(modal, theme = {}) {
        const merged = {
            svgHoverSoundFadeOnStopV88: theme.svgHoverSoundFadeOnStopV88 ?? THEME_HOVER_SOUND_FADE_DEFAULT_V88,
            ...theme
        };
        const result = populateThemeBuilderBeforeFadeV88(modal, merged);
        ensureThemeHoverSoundFadeControlV88(modal, merged);
        return result;
    };
} catch {}

try {
    const ensureThemeHoverSoundStopControlsBeforeFadeV88 = ensureThemeHoverSoundStopControlsV87;
    ensureThemeHoverSoundStopControlsV87 = function(modal, theme = {}) {
        const result = ensureThemeHoverSoundStopControlsBeforeFadeV88(modal, theme);
        // Avoid direct recursion: schedule the extra row after the V87 host exists.
        queueMicrotask(() => {
            if (!modal?.isConnected) return;
            const host = modal.querySelector('.theme-builder-svg-hover-sound-stop-controls-v87');
            if (!host) return;
            let row = host.querySelector('.theme-builder-svg-hover-sound-fade-row-v88');
            if (!row) {
                row = document.createElement('label');
                row.className = 'theme-builder-svg-hover-sound-fade-row-v88';
                row.innerHTML = `
                    <span class="theme-builder-svg-hover-sound-fade-copy-v88">
                        <strong>Fade at the end</strong>
                        <small>Gently lower the hover sound before it stops.</small>
                    </span>
                    <input type="checkbox" class="theme-builder-svg-hover-sound-fade-v88">
                `;
                host.appendChild(row);
            }
            const input = row.querySelector('.theme-builder-svg-hover-sound-fade-v88');
            const saved = theme.svgHoverSoundFadeOnStopV88 === undefined
                ? !!modal._themeHoverSoundFadeOnStopV88
                : !!theme.svgHoverSoundFadeOnStopV88;
            if (input && document.activeElement !== input) input.checked = saved;
            modal._themeHoverSoundFadeOnStopV88 = saved;
            if (input && input.dataset.boundV88 !== 'true') {
                input.dataset.boundV88 = 'true';
                input.addEventListener('change', () => {
                    modal._themeHoverSoundFadeOnStopV88 = !!input.checked;
                    scheduleThemePreviewHoverV87(modal);
                });
            }
            const mode = host.querySelector('.theme-builder-svg-hover-sound-stop-mode-v87');
            if (mode && mode.dataset.fadeSyncBoundV88 !== 'true') {
                mode.dataset.fadeSyncBoundV88 = 'true';
                mode.addEventListener('change', () => syncThemeHoverSoundStopUiV88(modal));
                mode.addEventListener('input', () => syncThemeHoverSoundStopUiV88(modal));
            }
            syncThemeHoverSoundStopUiV88(modal);
        });
        return result;
    };
} catch {}

// V88 upgrades V87's stop routine. Immediate mode still stops instantly.
// In custom-delay mode, optional Fade at the end uses the final part of the
// chosen delay so the audio reaches silence at the requested stop time.
stopThemeHoverAudioForItemV87 = function(item, delayMs = 0) {
    if (!item) return;

    if (item._themeHoverStopTimerV87) {
        clearTimeout(item._themeHoverStopTimerV87);
        item._themeHoverStopTimerV87 = null;
    }
    if (item._themeHoverFadeTimerV88) {
        clearTimeout(item._themeHoverFadeTimerV88);
        item._themeHoverFadeTimerV88 = null;
    }
    if (item._themeHoverFadeRafV88) {
        cancelAnimationFrame(item._themeHoverFadeRafV88);
        item._themeHoverFadeRafV88 = null;
    }

    const audio = item._themeHoverAudioV87;
    if (!audio) return;

    const finalize = () => {
        if (item._themeHoverAudioV87 === audio) item._themeHoverAudioV87 = null;
        try {
            audio.pause();
            audio.currentTime = 0;
            audio.src = '';
        } catch {}
    };

    const ms = Math.max(0, Number(delayMs) || 0);
    const shouldFade = ms > 0 && item._themeHoverFadeOnStopV88 === true;

    if (!ms) {
        finalize();
        return;
    }

    if (shouldFade) {
        const fadeDuration = Math.min(650, Math.max(220, ms * 0.4));
        const fadeStart = Math.max(0, ms - fadeDuration);
        const baseVolume = Math.max(0, Math.min(1, Number(audio.volume) || 0));

        item._themeHoverFadeTimerV88 = setTimeout(() => {
            const started = performance.now();
            const tick = now => {
                if (item._themeHoverAudioV87 !== audio) return;
                const p = Math.min(1, (now - started) / fadeDuration);
                try { audio.volume = baseVolume * (1 - p); } catch {}
                if (p < 1) item._themeHoverFadeRafV88 = requestAnimationFrame(tick);
            };
            item._themeHoverFadeRafV88 = requestAnimationFrame(tick);
        }, fadeStart);
    }

    item._themeHoverStopTimerV87 = setTimeout(finalize, ms);
};

try {
    const bindThemeHoverSoundItemBeforeFadeV88 = bindThemeHoverSoundItemV87;
    bindThemeHoverSoundItemV87 = function(item, theme, asset) {
        if (item) item._themeHoverFadeOnStopV88 = !!theme?.svgHoverSoundFadeOnStopV88;
        return bindThemeHoverSoundItemBeforeFadeV88(item, theme, asset);
    };
} catch {}

// --------------------------------------------------------------------------
// Re-space UI guard. Closed Customize bodies are force-hidden for the entire
// artwork update, even if an old observer temporarily adds its open class.
// --------------------------------------------------------------------------
function beginDecorationRespaceGuardV88(modal) {
    if (!modal) return { open: new Set(), token: 0 };
    const open = new Set();
    modal.querySelectorAll('.theme-builder-svg-card[data-svg-index]').forEach(card => {
        const index = Number(card.dataset.svgIndex);
        if (card.classList.contains('svg-card-custom-open-v11') && Number.isFinite(index)) {
            open.add(index);
            card.dataset.v88WasOpen = 'true';
        } else {
            card.dataset.v88WasOpen = 'false';
        }
    });
    const token = (modal._themeRespaceGuardTokenV88 || 0) + 1;
    modal._themeRespaceGuardTokenV88 = token;
    modal.classList.add('theme-builder-respace-running-v88');
    return { open, token };
}

function endDecorationRespaceGuardV88(modal, state) {
    if (!modal || !state) return;
    const finish = () => {
        if (modal._themeRespaceGuardTokenV88 !== state.token) return;
        modal.querySelectorAll('.theme-builder-svg-card[data-svg-index]').forEach(card => {
            const index = Number(card.dataset.svgIndex);
            const shouldOpen = Number.isFinite(index) && state.open.has(index);
            card.classList.toggle('svg-card-custom-open-v11', shouldOpen);
            delete card.dataset.v88WasOpen;
        });
        modal.classList.remove('theme-builder-respace-running-v88');
    };
    requestAnimationFrame(() => requestAnimationFrame(() => setTimeout(finish, 140)));
}

try {
    const respreadThemeImagesBeforeGuardV88 = respreadThemeImagesV41;
    respreadThemeImagesV41 = function(modal) {
        const state = beginDecorationRespaceGuardV88(modal);
        try {
            return respreadThemeImagesBeforeGuardV88(modal);
        } finally {
            endDecorationRespaceGuardV88(modal, state);
        }
    };
} catch {}

requestAnimationFrame(() => {
    const modal = document.getElementById('theme-builder-modal');
    if (!modal) return;
    ensureThemeHoverSoundFadeControlV88(modal, getThemeBuilderDraft(modal));
});


// ============================================================
// V89 — STABLE DECORATION CUSTOMIZATION / HOVER OVERRIDES / FADE UI
// ============================================================

function themeBuilderV89HoverOptions(value = '', globalValue = '') {
    try {
        return themeHoverAnimationSelectOptionsV82(value, true, globalValue);
    } catch {
        const current = String(value || '');
        const options = [
            ['', 'Use Default'],
            ['none', 'No hover animation'],
            ['lift-pop', 'Lift & Pop'],
            ['bounce', 'Bounce'],
            ['wiggle', 'Wiggle'],
            ['spin', 'Spin'],
            ['pulse', 'Pulse'],
            ['shake', 'Shake']
        ];
        return options.map(([id, label]) =>
            `<option value="${id}" ${current === id ? 'selected' : ''}>${label}</option>`
        ).join('');
    }
}

function ensurePerDecorationHoverOverridesV89(modal) {
    if (!modal) return;

    const enabled = !!modal.querySelector('.theme-builder-svg-hover-animations-enabled-v82')?.checked;
    const globalAnimation = (() => {
        try {
            return normalizeThemeHoverAnimationV82(
                modal.querySelector('.theme-builder-svg-hover-animation-default-v82')?.value ||
                modal._themeHoverAnimationV82,
                THEME_HOVER_ANIMATION_DEFAULT_V82
            );
        } catch {
            return String(modal.querySelector('.theme-builder-svg-hover-animation-default-v82')?.value || 'lift-pop');
        }
    })();

    modal.querySelectorAll('.theme-builder-svg-card[data-svg-index]').forEach(card => {
        const index = Number(card.dataset.svgIndex);
        if (!Number.isFinite(index)) return;
        const asset = modal._themeBackgroundSvgs?.[index];
        const options = card.querySelector('.theme-builder-svg-card-options-v10');
        if (!asset || !options) return;

        let row = options.querySelector('.theme-builder-svg-hover-animation-row-v82, .theme-builder-svg-hover-animation-row-v89');
        if (!row) {
            row = document.createElement('label');
            row.className = 'theme-builder-svg-option-row theme-builder-svg-hover-animation-row-v82 theme-builder-svg-hover-animation-row-v89';
            const soundRow = options.querySelector('.theme-builder-svg-mapped-sound-row');
            const visibleRow = options.querySelector('.theme-builder-image-visible-row-v63');
            if (soundRow) options.insertBefore(row, soundRow);
            else if (visibleRow) options.insertBefore(row, visibleRow);
            else options.appendChild(row);
        }

        row.classList.add('theme-builder-svg-hover-animation-row-v89');
        row.classList.toggle('hidden', !enabled);
        row.innerHTML = `
            <span>Hover Animation</span>
            <select class="theme-builder-svg-hover-animation-select-v82 theme-builder-svg-hover-animation-select-v89"></select>
        `;

        const select = row.querySelector('select');
        if (!select) return;
        const saved = String(asset.hoverAnimationOverrideV82 || '');
        select.innerHTML = themeBuilderV89HoverOptions(saved, globalAnimation);
        select.value = saved;

        select.addEventListener('pointerdown', event => event.stopPropagation());
        select.addEventListener('click', event => event.stopPropagation());
        select.addEventListener('change', event => {
            event.stopPropagation();
            asset.hoverAnimationOverrideV82 = select.value;
            try { scheduleThemePreviewHoverV87(modal); } catch {}
            try {
                const draft = getThemeBuilderDraft(modal);
                applyThemeHoverAnimationsV82(modal.querySelector('.theme-builder-live-canvas'), draft);
                applyThemeHoverAnimationsV82(modal.querySelector('.theme-builder-dashboard-preview-v45'), draft);
            } catch {}
        });
    });
}

// Make every historical call land on the final reliable implementation.
try { installPerImageHoverControlsV82 = ensurePerDecorationHoverOverridesV89; } catch {}

function restyleHoverFadeControlV89(modal) {
    if (!modal) return;
    const row = modal.querySelector('.theme-builder-svg-hover-sound-fade-row-v88');
    if (!row) return;

    let input = row.querySelector('.theme-builder-svg-hover-sound-fade-v88');
    const checked = !!input?.checked;

    if (row.dataset.v89Simple !== 'true') {
        row.dataset.v89Simple = 'true';
        row.innerHTML = `
            <span class="theme-builder-svg-hover-sound-fade-label-v89">Fade at the end</span>
            <input type="checkbox" class="theme-builder-svg-hover-sound-fade-v88 theme-builder-svg-hover-sound-fade-v89">
        `;
        input = row.querySelector('.theme-builder-svg-hover-sound-fade-v88');
        input.checked = checked || !!modal._themeHoverSoundFadeOnStopV88;
        input.addEventListener('change', () => {
            modal._themeHoverSoundFadeOnStopV88 = !!input.checked;
            try { scheduleThemePreviewHoverV87(modal); } catch {}
        });
    }

    const mode = (() => {
        try {
            return normalizeThemeHoverSoundStopModeV87(
                modal.querySelector('.theme-builder-svg-hover-sound-stop-mode-v87')?.value
            );
        } catch {
            return modal.querySelector('.theme-builder-svg-hover-sound-stop-mode-v87')?.value || 'immediate';
        }
    })();
    row.classList.toggle('hidden', mode !== 'delay');
}

function applyDecorationCustomizeStateV89(modal) {
    if (!modal) return;
    const open = modal._themeDecorationCustomizeOpenV89 || new Set();
    modal.querySelectorAll('.theme-builder-svg-card[data-svg-index]').forEach(card => {
        const index = Number(card.dataset.svgIndex);
        const shouldOpen = Number.isFinite(index) && open.has(index);
        card.dataset.v89CustomOpen = shouldOpen ? 'true' : 'false';
        card.classList.toggle('svg-card-custom-open-v11', shouldOpen);
    });
}

function installDecorationCustomizeStabilityV89(modal) {
    if (!modal) return;
    const section = modal.querySelector('.theme-builder-svg-section');
    if (!section) return;

    if (!(modal._themeDecorationCustomizeOpenV89 instanceof Set)) {
        const initial = new Set();
        modal.querySelectorAll('.theme-builder-svg-card[data-svg-index].svg-card-custom-open-v11').forEach(card => {
            const index = Number(card.dataset.svgIndex);
            if (Number.isFinite(index)) initial.add(index);
        });
        modal._themeDecorationCustomizeOpenV89 = initial;
    }

    applyDecorationCustomizeStateV89(modal);

    if (!section._themeCustomizeClickV89) {
        section._themeCustomizeClickV89 = true;
        section.addEventListener('click', event => {
            const button = event.target?.closest?.('.theme-builder-svg-customize-v11');
            if (!button || !section.contains(button)) return;
            const card = button.closest('.theme-builder-svg-card[data-svg-index]');
            const index = Number(card?.dataset.svgIndex);
            if (!card || !Number.isFinite(index)) return;

            event.preventDefault();
            event.stopPropagation();
            event.stopImmediatePropagation();

            const open = modal._themeDecorationCustomizeOpenV89;
            if (open.has(index)) open.delete(index);
            else open.add(index);
            applyDecorationCustomizeStateV89(modal);
            ensurePerDecorationHoverOverridesV89(modal);
        }, true);
    }

    const list = section.querySelector('.theme-builder-svg-list');
    if (list && !list._themeCustomizeObserverV89) {
        let correcting = false;
        const observer = new MutationObserver(() => {
            if (correcting) return;
            correcting = true;
            queueMicrotask(() => {
                try {
                    applyDecorationCustomizeStateV89(modal);
                    ensurePerDecorationHoverOverridesV89(modal);
                } finally {
                    correcting = false;
                }
            });
        });
        observer.observe(list, {
            subtree: true,
            childList: true,
            attributes: true,
            attributeFilter: ['class']
        });
        list._themeCustomizeObserverV89 = observer;
    }
}

function syncV89DecorationUi(modal) {
    if (!modal) return;
    installDecorationCustomizeStabilityV89(modal);
    ensurePerDecorationHoverOverridesV89(modal);
    restyleHoverFadeControlV89(modal);
    try { removeLegacyDecorationUploadCardsV87(modal); } catch {}
}

// Re-space only changes placement + redraws the artwork stages. It never
// rebuilds or touches the Decorations cards, and the V89 state guard remains
// authoritative for any late legacy class mutations.
try {
    respreadThemeImagesV41 = function(modal) {
        if (!modal) return;
        const draft = getThemeBuilderDraft(modal);
        if (draft.svgAllowOverlap) return;

        if (draft.svgDistribution === 'manual-fixed') {
            try { resolveManualPlacementOverlapV41(modal, draft.svgGlobalScale); } catch {}
        } else {
            modal._themePreviewDistributionSeedV10 = Math.random() * 100000;
        }

        applyDecorationCustomizeStateV89(modal);
        try { refreshDecorationArtworkOnlyV87(modal); }
        catch {
            try { renderThemeArtworkPreviewV61(modal); } catch {}
        }
        applyDecorationCustomizeStateV89(modal);
        syncV89DecorationUi(modal);
    };
} catch {}

// Keep the final row/override/state intact after every builder render path.
try {
    const renderThemeBuilderSvgListBeforeV89 = renderThemeBuilderSvgListV2;
    renderThemeBuilderSvgListV2 = function(modal) {
        const result = renderThemeBuilderSvgListBeforeV89(modal);
        syncV89DecorationUi(modal);
        return result;
    };
} catch {}

try {
    const populateThemeBuilderBeforeV89 = populateThemeBuilder;
    populateThemeBuilder = function(modal, theme = {}) {
        const result = populateThemeBuilderBeforeV89(modal, theme);
        syncV89DecorationUi(modal);
        requestAnimationFrame(() => syncV89DecorationUi(modal));
        return result;
    };
} catch {}

try {
    const ensureThemeHoverSoundStopControlsBeforeV89 = ensureThemeHoverSoundStopControlsV87;
    ensureThemeHoverSoundStopControlsV87 = function(modal, theme = {}) {
        const result = ensureThemeHoverSoundStopControlsBeforeV89(modal, theme);
        requestAnimationFrame(() => {
            restyleHoverFadeControlV89(modal);
            ensurePerDecorationHoverOverridesV89(modal);
        });
        return result;
    };
} catch {}

requestAnimationFrame(() => {
    const modal = document.getElementById('theme-builder-modal');
    if (!modal) return;
    syncV89DecorationUi(modal);
});

// ============================================================
// V93 — THEME BUILDER CLICKABILITY GUARD
// The problem was not the removed Across Screen option: existing preview
// layers can be pointer-interactive and have very high z-index values. This
// guard keeps preview iframes/dashboard surfaces from ever becoming a click
// shield over Theme Builder controls.
// ============================================================
(function () {
    function enforceThemeBuilderClickabilityV93(modal) {
        if (!modal) return;

        // A prewarmed Theme Builder stays in the DOM for fast opening, but it
        // must never become an invisible click shield over the Daily Log grid.
        // Older V93 logic forced pointer-events:auto even while the modal still
        // had .hidden, allowing descendants to intercept numbered-day clicks.
        const hiddenV181 = modal.classList.contains('hidden');
        try { modal.inert = hiddenV181; } catch {}
        modal.style.setProperty('pointer-events', hiddenV181 ? 'none' : 'auto', 'important');
        if (hiddenV181) {
            document.body.classList.remove('theme-builder-modal-open-v93');
            return;
        }

        const interactiveHosts = [
            modal.querySelector('.theme-builder-box-v4'),
            modal.querySelector('.modal-header'),
            modal.querySelector('.theme-builder-layout-v4'),
            modal.querySelector('.theme-builder-controls'),
            modal.querySelector('.theme-builder-section-tabs-v11'),
            modal.querySelector('.theme-builder-actions')
        ].filter(Boolean);

        interactiveHosts.forEach(node => {
            node.style.setProperty('pointer-events', 'auto', 'important');
        });

        modal.querySelectorAll(
            'iframe.theme-code-preview-frame-v56, iframe.theme-builder-dashboard-code-background-v79'
        ).forEach(frame => {
            frame.style.setProperty('pointer-events', 'none', 'important');
            frame.style.setProperty('z-index', '0', 'important');
        });

        modal.querySelectorAll(
            '.theme-builder-dashboard-preview-v45, .theme-builder-dashboard-preview-v44'
        ).forEach(preview => {
            preview.style.setProperty('pointer-events', 'none', 'important');
        });

        modal.querySelectorAll(
            '.theme-builder-dashboard-art-item-v45, .theme-builder-dashboard-art-item-v40'
        ).forEach(item => {
            item.style.setProperty('pointer-events', 'auto', 'important');
        });

        const isOpen = !modal.classList.contains('hidden');
        document.body.classList.toggle('theme-builder-modal-open-v93', isOpen);

        const pageBackground = document.getElementById('custom-theme-code-background-v56');
        if (pageBackground && isOpen) {
            pageBackground.style.setProperty('pointer-events', 'none', 'important');
            pageBackground.style.setProperty('z-index', '0', 'important');
        }
    }

    function watchThemeBuilderClickabilityV93(modal) {
        if (!modal || modal._themeBuilderClickabilityObserverV93) return;

        const observer = new MutationObserver(() => {
            requestAnimationFrame(() => enforceThemeBuilderClickabilityV93(modal));
        });

        observer.observe(modal, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['class']
        });

        modal._themeBuilderClickabilityObserverV93 = observer;
        enforceThemeBuilderClickabilityV93(modal);
    }

    try {
        const ensureThemeBuilderModalBeforeV93 = ensureThemeBuilderModal;
        ensureThemeBuilderModal = function () {
            const result = ensureThemeBuilderModalBeforeV93();
            const modal = document.getElementById('theme-builder-modal');
            if (modal) {
                watchThemeBuilderClickabilityV93(modal);
                enforceThemeBuilderClickabilityV93(modal);
            }
            return result;
        };
    } catch {}

    try {
        const openThemeBuilderBeforeV93 = openThemeBuilder;
        openThemeBuilder = function () {
            const result = openThemeBuilderBeforeV93();
            const modal = document.getElementById('theme-builder-modal');
            if (modal) {
                enforceThemeBuilderClickabilityV93(modal);
                requestAnimationFrame(() => enforceThemeBuilderClickabilityV93(modal));
                setTimeout(() => enforceThemeBuilderClickabilityV93(modal), 80);
            }
            return result;
        };
    } catch {}

    requestAnimationFrame(() => {
        const modal = document.getElementById('theme-builder-modal');
        if (modal) {
            watchThemeBuilderClickabilityV93(modal);
            enforceThemeBuilderClickabilityV93(modal);
        }
    });
})();


// ============================================================
// V94 — ACROSS-SCREEN DECORATION MOTION
// Decorations continuously cross the screen in their selected direction, leave
// the opposite edge, and repeat. Runtime-only copies may fill the other direction
// when a theme has too few moving items. The moving layer is
// strictly clipped to the preview/page artwork stage so it can never become a
// full Theme Builder click shield.
// ============================================================
(function () {
    const CROSS_ANIMATION_V94 = 'cross-screen';
    const CROSS_LABEL_V94 = 'Across Screen';

    try {
        if (Array.isArray(THEME_SVG_ANIMATION_OPTIONS_V11) &&
            !THEME_SVG_ANIMATION_OPTIONS_V11.some(option => option?.[0] === CROSS_ANIMATION_V94)) {
            THEME_SVG_ANIMATION_OPTIONS_V11.push([CROSS_ANIMATION_V94, CROSS_LABEL_V94]);
        }
    } catch {}

    function effectiveAnimationV94(asset, theme = {}) {
        const override = String(asset?.animationOverride || '').trim();
        if (override) return override;

        // V372: the saved theme-level Default Animation is authoritative.
        // `asset.animation` is only a legacy compatibility mirror and may still
        // contain an older value (commonly Float) on themes created before the
        // global-default field existed. Reading it first made Across Screen and
        // preview/runtime compatibility passes resurrect the old animation.
        const globalDefault = String(theme?.svgDefaultAnimation || '').trim();
        if (globalDefault) return globalDefault;

        const direct = String(asset?.animation || '').trim();
        if (direct) return direct;
        return 'float';
    }

    function randomBetweenV94(min, max) {
        return min + Math.random() * (max - min);
    }

    function clearCrossPresentationV94(item) {
        if (!item) return;
        item.classList.remove(
            'theme-cross-screen-v94',
            'theme-cross-ltr-v94',
            'theme-cross-rtl-v94',
            'theme-cross-face-right-v139',
            'theme-cross-face-left-v139'
        );
        delete item.dataset.themeCrossDirectionV94;
        item.style.removeProperty('--theme-cross-duration-v94');
        item.style.removeProperty('--theme-cross-delay-v94');
        item.style.removeProperty('--theme-cross-top-v94');
    }

    function crossDirectionV141(asset) {
        // Across Screen is right-facing/right-moving by default. The only way
        // a saved decoration itself travels left is when its R checkbox is off.
        return String(asset?.crossDirectionV139 || '').toLowerCase() === 'left'
            ? 'left'
            : 'right';
    }

    function prepareCrossItemV94(item, assetIndex, instanceIndex = 0, direction = 'right') {
        if (!item) return;
        const dir = String(direction || '').toLowerCase() === 'left' ? 'left' : 'right';
        const ltr = dir === 'right';
        const top = randomBetweenV94(8, 92);
        const duration = randomBetweenV94(9.5, 18.5);
        // Negative delay means the preview already looks alive when it opens,
        // while every new cycle still begins completely outside the edge.
        const delay = -randomBetweenV94(0, duration);

        item.classList.add('theme-cross-screen-v94');
        item.classList.toggle('theme-cross-ltr-v94', ltr);
        item.classList.toggle('theme-cross-rtl-v94', !ltr);
        // Keep travel and facing locked together. V139's visual flip CSS uses
        // these face classes, so a left-moving copy can never face right.
        item.classList.toggle('theme-cross-face-right-v139', ltr);
        item.classList.toggle('theme-cross-face-left-v139', !ltr);
        item.dataset.svgIndex = String(assetIndex);
        item.dataset.themeCrossInstanceV94 = String(instanceIndex);
        item.dataset.themeCrossDirectionV94 = dir;
        item.style.setProperty('--theme-cross-top-v94', `${top.toFixed(2)}%`);
        item.style.setProperty('--theme-cross-duration-v94', `${duration.toFixed(2)}s`);
        item.style.setProperty('--theme-cross-delay-v94', `${delay.toFixed(2)}s`);
    }

    function ensureCrossOptionInSelectV94(select) {
        if (!select || select.querySelector(`option[value="${CROSS_ANIMATION_V94}"]`)) return;
        const option = document.createElement('option');
        option.value = CROSS_ANIMATION_V94;
        option.textContent = CROSS_LABEL_V94;
        select.appendChild(option);
    }

    function ensureAcrossScreenControlsV94(modal) {
        if (!modal) return;
        modal.querySelectorAll(
            '.theme-builder-svg-default-animation, .theme-builder-svg-animation-select'
        ).forEach(ensureCrossOptionInSelectV94);
    }

    function configureCrossStageV94(root, theme = {}, selector) {
        if (!root) return;

        root.querySelectorAll('[data-theme-cross-clone-v94="true"]').forEach(node => node.remove());

        const assets = Array.isArray(theme?.backgroundSvgs) ? theme.backgroundSvgs : [];
        const originals = Array.from(root.querySelectorAll(selector))
            .filter(item => item.dataset.themeCrossCloneV94 !== 'true');

        const crossEntries = [];

        originals.forEach((item, displayIndex) => {
            let assetIndex = Number(item.dataset.svgIndex);
            if (!Number.isFinite(assetIndex) || assetIndex < 0 || assetIndex >= assets.length) {
                const manualIndex = Number(item.dataset.manualSlotV45);
                assetIndex = Number.isFinite(manualIndex) && manualIndex >= 0
                    ? manualIndex
                    : displayIndex;
            }

            const asset = assets.length ? (assets[assetIndex % assets.length] || {}) : {};
            if (effectiveAnimationV94(asset, theme) === CROSS_ANIMATION_V94) {
                // R is SOURCE FACING only. Travel is assigned independently so
                // the stream can use both directions; rendering flips the art
                // whenever source facing and travel direction differ.
                const direction = (crossEntries.length % 2 === 0) ? 'right' : 'left';
                prepareCrossItemV94(item, assetIndex, 0, direction);
                crossEntries.push({ item, assetIndex, direction });
            } else {
                clearCrossPresentationV94(item);
            }
        });

        if (!crossEntries.length) return;

        // Keep a stream going even when the theme only has one or two fish /
        // decorations. These are visual runtime clones only; the user's saved
        // decoration list is never duplicated.
        const targetCount = Math.min(12, Math.max(6, crossEntries.length));
        let rightCount = crossEntries.filter(entry => entry.direction === 'right').length;
        let leftCount = crossEntries.length - rightCount;
        let instance = crossEntries.length;
        while (instance < targetCount) {
            // Saved originals always obey their R checkbox. Runtime-only copies
            // may fill the underrepresented direction so the screen has a useful
            // stream. If a right-facing source is reused on the left path, the
            // face-left class below mirrors it horizontally automatically.
            const direction = leftCount < rightCount ? 'left' : 'right';
            const sameDirection = crossEntries.filter(entry => entry.direction === direction);
            const pool = sameDirection.length ? sameDirection : crossEntries;
            const source = pool[Math.floor(Math.random() * pool.length)];
            const clone = source.item.cloneNode(true);
            clone.dataset.themeCrossCloneV94 = 'true';
            clone.removeAttribute('id');
            prepareCrossItemV94(clone, source.assetIndex, instance, direction);
            source.item.parentElement?.appendChild(clone);
            if (direction === 'left') leftCount++; else rightCount++;
            instance++;
        }

        // Rebind the already-supported hover animation/sound behavior to the
        // runtime-only clones as well.
        try { applyThemeHoverBehaviorV87(root, theme); } catch {}
    }

    function configureBuilderCrossScreenV94(modal) {
        if (!modal) return;
        ensureAcrossScreenControlsV94(modal);

        let draft;
        try { draft = getThemeBuilderDraft(modal); } catch { draft = {}; }

        const livePage = modal.querySelector('.theme-builder-live-page');
        configureCrossStageV94(
            livePage,
            draft,
            '.theme-builder-live-art-stage-v61 .theme-builder-live-art-item'
        );

        const dashboard = modal.querySelector('.theme-builder-dashboard-preview-v45');
        configureCrossStageV94(
            dashboard,
            draft,
            '.theme-builder-dashboard-art-stage-v45 .theme-builder-dashboard-art-item-v45'
        );
    }

    function scheduleBuilderCrossScreenV94(modal) {
        if (!modal) return;
        const token = (modal._themeCrossScheduleTokenV94 || 0) + 1;
        modal._themeCrossScheduleTokenV94 = token;
        requestAnimationFrame(() => requestAnimationFrame(() => {
            if (modal._themeCrossScheduleTokenV94 !== token) return;
            configureBuilderCrossScreenV94(modal);
        }));
    }

    // Add the new option to every future global/per-decoration animation UI.
    try {
        const beforeGlobalV94 = ensureThemeBuilderGlobalSvgControlsV11;
        ensureThemeBuilderGlobalSvgControlsV11 = function(modal, theme) {
            const result = beforeGlobalV94(modal, theme);
            ensureAcrossScreenControlsV94(modal);
            return result;
        };
    } catch {}

    try {
        const beforeListV94 = renderThemeBuilderSvgListV2;
        renderThemeBuilderSvgListV2 = function(modal) {
            const result = beforeListV94(modal);
            ensureAcrossScreenControlsV94(modal);
            return result;
        };
    } catch {}

    // Current Log Page preview renderer.
    try {
        const beforeLogPreviewV94 = renderThemeArtworkPreviewV61;
        renderThemeArtworkPreviewV61 = function(modal) {
            const result = beforeLogPreviewV94(modal);
            scheduleBuilderCrossScreenV94(modal);
            return result;
        };
    } catch {}

    // Dashboard preview renderer. Assign animation identity to each artwork
    // item because the historical Dashboard preview renderer only placed the
    // image and did not copy its base animation class.
    try {
        const beforeDashboardPreviewV94 = renderDashboardPreviewV45;
        renderDashboardPreviewV45 = function(modal) {
            const result = beforeDashboardPreviewV94(modal);
            scheduleBuilderCrossScreenV94(modal);
            return result;
        };
    } catch {}

    // Real log pages use the same clipped background stage and the same
    // transient clone strategy. No fixed/high-z-index overlay is introduced.
    try {
        const beforeRuntimeMountV94 = mountCustomThemeBackgroundSvgsV2;
        mountCustomThemeBackgroundSvgsV2 = function(theme) {
            const result = beforeRuntimeMountV94(theme);
            requestAnimationFrame(() => {
                const stage = document.getElementById('custom-theme-background-stage');
                configureCrossStageV94(
                    stage,
                    theme || {},
                    '.custom-theme-background-svg'
                );
            });
            return result;
        };
    } catch {}

    try {
        const beforeUpdateV94 = updateThemeBuilderPreview;
        updateThemeBuilderPreview = function(modal) {
            const result = beforeUpdateV94(modal);
            scheduleBuilderCrossScreenV94(modal);
            return result;
        };
    } catch {}

    requestAnimationFrame(() => {
        const modal = document.getElementById('theme-builder-modal');
        if (modal) scheduleBuilderCrossScreenV94(modal);
    });
})();


// ============================================================
// V95 — RESPONSIVE IMAGE UPLOADS + CROSS-BROWSER THEME LIBRARY
// ============================================================
(function () {
    const SHARED_KEY_V95 = 'loggy-shared-themes-v40';
    const IS_DASHBOARD_STUDIO_V95 = (() => {
        try {
            return new URLSearchParams(window.location.search).get('dashboardThemeStudio') === '1';
        } catch {
            return false;
        }
    })();

    function parseThemeLibraryV95(value) {
        try {
            const parsed = JSON.parse(String(value || '[]'));
            return Array.isArray(parsed) ? parsed : [];
        } catch {
            return [];
        }
    }

    function themeStampV95(item) {
        const value = Date.parse(
            String(item?.updatedAt || item?.createdAt || '')
        );
        return Number.isFinite(value) ? value : 0;
    }

    function mergeThemeLibrariesV95(remoteThemes, localThemes) {
        const byId = new Map();

        (Array.isArray(remoteThemes) ? remoteThemes : []).forEach(item => {
            if (!item?.id) return;
            byId.set(String(item.id), item);
        });

        (Array.isArray(localThemes) ? localThemes : []).forEach(item => {
            if (!item?.id) return;
            const id = String(item.id);
            const existing = byId.get(id);
            if (!existing || themeStampV95(item) >= themeStampV95(existing)) {
                byId.set(id, item);
            }
        });

        return Array.from(byId.values());
    }

    async function putSharedThemesToServerV95(themes) {
        try {
            await fetch('/api/shared-themes', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ themes: Array.isArray(themes) ? themes : [] })
            });
        } catch {}
    }

    // Patch only the one localStorage key used by shared custom themes. This
    // keeps localStorage as an instant cache while mirroring changes to the
    // project server for Edge/Firefox/Chrome parity.
    try {
        const storageProto = Storage.prototype;
        if (!storageProto.__loggySharedThemeSyncV95) {
            const nativeSetItem = storageProto.setItem;
            storageProto.__loggySharedThemeSyncV95 = true;

            let serverReady = false;
            let suppressMirror = false;
            let mirrorTimer = 0;

            storageProto.setItem = function (key, value) {
                nativeSetItem.call(this, key, value);

                if (
                    this === localStorage &&
                    String(key) === SHARED_KEY_V95 &&
                    serverReady &&
                    !suppressMirror
                ) {
                    clearTimeout(mirrorTimer);
                    mirrorTimer = setTimeout(() => {
                        putSharedThemesToServerV95(
                            parseThemeLibraryV95(value)
                        );
                    }, 80);
                }
            };

            (async () => {
                let remote = [];
                let initialized = false;

                try {
                    const response = await fetch('/api/shared-themes', {
                        method: 'GET',
                        cache: 'no-store'
                    });
                    if (response.ok) {
                        const result = await response.json().catch(() => ({}));
                        remote = Array.isArray(result?.themes) ? result.themes : [];
                        initialized = result?.initialized === true;
                    }
                } catch {}

                const local = parseThemeLibraryV95(
                    localStorage.getItem(SHARED_KEY_V95)
                );

                // V408: the server remains authoritative for membership (so a
                // deleted local-only theme cannot resurrect), but for an ID that
                // exists on BOTH sides the newest updatedAt wins. This prevents a
                // Dashboard/Studio startup GET from rolling a just-saved animation
                // back to an older server copy.
                let chosen;
                if (initialized) {
                    const remoteIds = new Set(remote.filter(item=>item?.id).map(item=>String(item.id)));
                    const sameIdsLocal = local.filter(item=>item?.id && remoteIds.has(String(item.id)));
                    chosen = mergeThemeLibrariesV95(remote, sameIdsLocal);
                } else {
                    chosen = mergeThemeLibrariesV95(remote, local);
                }

                suppressMirror = true;
                nativeSetItem.call(
                    localStorage,
                    SHARED_KEY_V95,
                    JSON.stringify(chosen)
                );
                suppressMirror = false;
                serverReady = true;

                if (!initialized || JSON.stringify(chosen) !== JSON.stringify(remote)) {
                    // If a newer local edit won for an existing ID, immediately
                    // repair the server copy too so the next page sees the same save.
                    await putSharedThemesToServerV95(chosen);
                }

                // The Dashboard Theme Studio iframe does not need to import the
                // entire shared library into its temporary host log or render a
                // hidden theme picker. That work was a major source of freezes
                // when pressing the + Create Theme card.
                if (!IS_DASHBOARD_STUDIO_V95) {
                    try { syncSharedThemesIntoLogV40(); } catch {}
                    try { syncThemeCopyOptionsV30(); } catch {}
                    requestAnimationFrame(() => {
                        try { renderThemePicker(); } catch {}
                    });
                }
            })();
        }
    } catch {}

    // Direct Blob upload. No FileReader/base64/JSON conversion is performed
    // when the V95 server endpoint is present.
    try {
        const uploadThemeBuilderAssetToProjectBeforeV95 =
            uploadThemeBuilderAssetToProject;

        uploadThemeBuilderAssetToProject = async function (file, kind) {
            if (!file) return null;

            const params = new URLSearchParams({
                kind: String(kind || ''),
                fileName: String(file.name || 'asset'),
                mime: String(file.type || '')
            });

            let response;
            try {
                response = await fetch(
                    `/api/theme-assets-raw/${encodeURIComponent(HOBBY)}?${params.toString()}`,
                    {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/octet-stream' },
                        body: file
                    }
                );
            } catch {
                response = null;
            }

            // Older server.js: preserve the old working path instead of
            // breaking uploads entirely.
            if (!response || response.status === 404) {
                return uploadThemeBuilderAssetToProjectBeforeV95(file, kind);
            }

            const rawText = await response.text();
            let result = {};
            try { result = rawText ? JSON.parse(rawText) : {}; } catch {}

            if (!response.ok) {
                showFeatureToast(
                    result.message ||
                    `Could not save “${file.name}” into the project.`
                );
                return null;
            }

            if (!result.url || !result.projectPath) {
                showFeatureToast(
                    'The server returned an incomplete upload response.'
                );
                return null;
            }

            return result;
        };
    } catch {}

    function yieldToUiV95() {
        return new Promise(resolve => {
            if (typeof requestIdleCallback === 'function') {
                requestIdleCallback(() => resolve(), { timeout: 40 });
            } else {
                setTimeout(resolve, 0);
            }
        });
    }

    // Replace the decoration upload loop with a small two-worker queue. Only
    // the Upload Images button is busy; the rest of Theme Builder remains
    // clickable and scrollable while files are sent to Node.
    try {
        uploadThemeImagesV36 = async function (modal, input) {
            const selected = Array.from(input?.files || []);
            if (!selected.length || !modal) return;

            const files = selected.filter(file => {
                const valid =
                    typeof isThemeImageFileV37 === 'function'
                        ? isThemeImageFileV37(file)
                        : /\.(svg|png|jpe?g)$/i.test(String(file?.name || ''));

                if (!valid) {
                    showFeatureToast(
                        `“${file.name}” is not an SVG, PNG, or JPG image.`
                    );
                }
                return valid;
            });

            input.value = '';
            if (!files.length) return;

            const choose = modal.querySelector('.theme-builder-svg-choose');
            const previousHtml = choose?.innerHTML || '';
            const previousDisabled = Boolean(choose?.disabled);

            modal._themeUploadInProgressV95 = true;
            if (choose) {
                choose.disabled = true;
                choose.setAttribute('aria-busy', 'true');
            }

            const results = new Array(files.length);
            let cursor = 0;
            let finished = 0;

            const updateProgress = () => {
                if (!choose) return;
                choose.innerHTML =
                    `<i class="ph ph-upload-simple"></i> Uploading ${finished}/${files.length}`;
            };
            updateProgress();

            const worker = async () => {
                while (true) {
                    const index = cursor++;
                    if (index >= files.length) return;

                    const file = files[index];
                    const saved = await uploadThemeBuilderAssetToProject(file, 'svg');

                    if (saved) {
                        results[index] = {
                            name: file.name,
                            url: saved.url,
                            projectPath: saved.projectPath || '',
                            assetType:
                                typeof getUploadedThemeImageTypeV37 === 'function'
                                    ? getUploadedThemeImageTypeV37(file)
                                    : (/\.png$/i.test(file.name) ? 'png' : /\.jpe?g$/i.test(file.name) ? 'jpg' : 'svg')
                        };
                    }

                    finished += 1;
                    updateProgress();
                    await yieldToUiV95();
                }
            };

            try {
                const workerCount = Math.min(2, files.length);
                await Promise.all(
                    Array.from({ length: workerCount }, () => worker())
                );

                if (!Array.isArray(modal._themeBackgroundSvgs)) {
                    modal._themeBackgroundSvgs = [];
                }

                results.filter(Boolean).forEach(asset => {
                    modal._themeBackgroundSvgs.push(asset);
                });

                // One gallery render + one preview render after the batch,
                // instead of repeatedly rebuilding the editor while uploading.
                renderThemeBuilderSvgListV2(modal);
                try { polishThemeImageUploadUiV36(modal); } catch {}
                updateThemeBuilderPreview(modal);
            } finally {
                modal._themeUploadInProgressV95 = false;
                if (choose) {
                    choose.disabled = previousDisabled;
                    choose.removeAttribute('aria-busy');
                    choose.innerHTML = previousHtml ||
                        '<i class="ph ph-upload-simple"></i> Upload Images';
                }
            }
        };
    } catch {}

    // Gallery thumbnails do not need eager synchronous decoding.
    function optimizeDecorationThumbsV95(modal) {
        modal?.querySelectorAll('.theme-builder-svg-card-preview img').forEach(img => {
            img.loading = 'lazy';
            img.decoding = 'async';
            img.fetchPriority = 'low';
        });
    }

    try {
        const renderThemeBuilderSvgListBeforeV95 = renderThemeBuilderSvgListV2;
        renderThemeBuilderSvgListV2 = function (modal) {
            const result = renderThemeBuilderSvgListBeforeV95(modal);
            optimizeDecorationThumbsV95(modal);
            return result;
        };
    } catch {}

    // V93's original observer watched the entire Theme Builder subtree. During
    // a large gallery rebuild that can produce unnecessary repeated scans.
    // CSS already enforces the click-through layering, so keep only a tiny
    // open/close observer on the modal itself.
    function lightenClickabilityObserverV95(modal) {
        if (!modal || modal._themeClickObserverLightenedV95) return;
        modal._themeClickObserverLightenedV95 = true;

        try {
            modal._themeBuilderClickabilityObserverV93?.disconnect();
        } catch {}

        const syncOpenState = () => {
            document.body.classList.toggle(
                'theme-builder-modal-open-v93',
                !modal.classList.contains('hidden')
            );
        };

        const observer = new MutationObserver(syncOpenState);
        observer.observe(modal, {
            attributes: true,
            attributeFilter: ['class']
        });
        modal._themeBuilderClickabilityObserverV95 = observer;
        syncOpenState();
    }

    try {
        const ensureThemeBuilderModalBeforeV95 = ensureThemeBuilderModal;
        ensureThemeBuilderModal = function () {
            const result = ensureThemeBuilderModalBeforeV95();
            lightenClickabilityObserverV95(
                document.getElementById('theme-builder-modal')
            );
            return result;
        };
    } catch {}

    requestAnimationFrame(() => {
        lightenClickabilityObserverV95(
            document.getElementById('theme-builder-modal')
        );
    });
})();


// ============================================================
// V96 — NON-BLOCKING DECORATION GALLERY + SMOOTH HOVER RETURN
// Fixes the async V62 gallery hydration / V89 MutationObserver feedback loop
// and lets hover transforms ease back to their resting pose.
// ============================================================
(function () {
    // --------------------------------------------------------
    // 1) The V89 gallery observer could enter a MutationObserver feedback
    // loop after V62 asynchronously hydrated the real cards. Every callback
    // rebuilt the Hover Animation row, which produced another mutation.
    // Keep customization state event-driven instead of observing the whole
    // gallery subtree.
    // --------------------------------------------------------
    try {
        installDecorationCustomizeStabilityV89 = function (modal) {
            if (!modal) return;
            const section = modal.querySelector('.theme-builder-svg-section');
            if (!section) return;

            const list = section.querySelector('.theme-builder-svg-list');
            if (list?._themeCustomizeObserverV89) {
                try { list._themeCustomizeObserverV89.disconnect(); } catch {}
                list._themeCustomizeObserverV89 = null;
            }

            if (!(modal._themeDecorationCustomizeOpenV89 instanceof Set)) {
                const initial = new Set();
                modal.querySelectorAll(
                    '.theme-builder-svg-card[data-svg-index].svg-card-custom-open-v11'
                ).forEach(card => {
                    const index = Number(card.dataset.svgIndex);
                    if (Number.isFinite(index)) initial.add(index);
                });
                modal._themeDecorationCustomizeOpenV89 = initial;
            }

            try { applyDecorationCustomizeStateV89(modal); } catch {}

            if (!section._themeCustomizeClickV89) {
                section._themeCustomizeClickV89 = true;
                section.addEventListener('click', event => {
                    const button = event.target?.closest?.('.theme-builder-svg-customize-v11');
                    if (!button || !section.contains(button)) return;

                    const card = button.closest('.theme-builder-svg-card[data-svg-index]');
                    const index = Number(card?.dataset.svgIndex);
                    if (!card || !Number.isFinite(index)) return;

                    event.preventDefault();
                    event.stopPropagation();
                    event.stopImmediatePropagation();

                    const open = modal._themeDecorationCustomizeOpenV89;
                    if (open.has(index)) open.delete(index);
                    else open.add(index);

                    try { applyDecorationCustomizeStateV89(modal); } catch {}
                    try { ensurePerDecorationHoverOverridesV89(modal); } catch {}
                }, true);
            }
        };
    } catch {}

    // Make the per-image hover row idempotent. Re-running the UI sync no
    // longer destroys/recreates the select or its event listeners.
    try {
        ensurePerDecorationHoverOverridesV89 = function (modal) {
            if (!modal) return;

            const enabled = !!modal.querySelector(
                '.theme-builder-svg-hover-animations-enabled-v82'
            )?.checked;

            const globalAnimation = (() => {
                try {
                    return normalizeThemeHoverAnimationV82(
                        modal.querySelector('.theme-builder-svg-hover-animation-default-v82')?.value ||
                        modal._themeHoverAnimationV82,
                        THEME_HOVER_ANIMATION_DEFAULT_V82
                    );
                } catch {
                    return String(
                        modal.querySelector('.theme-builder-svg-hover-animation-default-v82')?.value ||
                        'lift'
                    );
                }
            })();

            modal.querySelectorAll('.theme-builder-svg-card[data-svg-index]').forEach(card => {
                const index = Number(card.dataset.svgIndex);
                if (!Number.isFinite(index)) return;

                const asset = modal._themeBackgroundSvgs?.[index];
                const options = card.querySelector('.theme-builder-svg-card-options-v10');
                if (!asset || !options) return;

                let row = options.querySelector(
                    '.theme-builder-svg-hover-animation-row-v82, .theme-builder-svg-hover-animation-row-v89'
                );

                if (!row) {
                    row = document.createElement('label');
                    row.className =
                        'theme-builder-svg-option-row theme-builder-svg-hover-animation-row-v82 theme-builder-svg-hover-animation-row-v89';
                    row.innerHTML = `
                        <span>Hover Animation</span>
                        <select class="theme-builder-svg-hover-animation-select-v82 theme-builder-svg-hover-animation-select-v89"></select>
                    `;

                    const soundRow = options.querySelector('.theme-builder-svg-mapped-sound-row');
                    const visibleRow = options.querySelector('.theme-builder-image-visible-row-v63');
                    if (soundRow) options.insertBefore(row, soundRow);
                    else if (visibleRow) options.insertBefore(row, visibleRow);
                    else options.appendChild(row);
                }

                row.classList.add('theme-builder-svg-hover-animation-row-v89');
                row.classList.toggle('hidden', !enabled);

                let select = row.querySelector(
                    '.theme-builder-svg-hover-animation-select-v82, .theme-builder-svg-hover-animation-select-v89'
                );
                if (!select) {
                    select = document.createElement('select');
                    select.className =
                        'theme-builder-svg-hover-animation-select-v82 theme-builder-svg-hover-animation-select-v89';
                    row.appendChild(select);
                }

                const saved = String(asset.hoverAnimationOverrideV82 || '');
                const html = themeBuilderV89HoverOptions(saved, globalAnimation);
                if (select.innerHTML !== html) select.innerHTML = html;
                if (select.value !== saved) select.value = saved;

                if (select.dataset.boundV96 !== 'true') {
                    select.dataset.boundV96 = 'true';
                    select.addEventListener('pointerdown', event => event.stopPropagation());
                    select.addEventListener('click', event => event.stopPropagation());
                    select.addEventListener('change', event => {
                        event.stopPropagation();
                        asset.hoverAnimationOverrideV82 = select.value;
                        try { scheduleThemePreviewHoverV87(modal); } catch {}
                        try {
                            const draft = getThemeBuilderDraft(modal);
                            applyThemeHoverAnimationsV82(
                                modal.querySelector('.theme-builder-live-canvas'),
                                draft
                            );
                            applyThemeHoverAnimationsV82(
                                modal.querySelector('.theme-builder-dashboard-preview-v45'),
                                draft
                            );
                        } catch {}
                    });
                }
            });
        };
    } catch {}

    // After V62 hydrates actual cards, run the modern UI sync once. This
    // replaces the MutationObserver that previously tried to detect hydration.
    try {
        const hydrateThemeImageCardsBeforeV96 = hydrateThemeImageCardsV62;
        hydrateThemeImageCardsV62 = function (modal, token) {
            const result = hydrateThemeImageCardsBeforeV96(modal, token);

            if (modal && modal._themeImageHydrateTokenV62 === token) {
                try { installDecorationCustomizeStabilityV89(modal); } catch {}
                try { ensurePerDecorationHoverOverridesV89(modal); } catch {}
                try { applyDecorationCustomizeStateV89(modal); } catch {}
                try { cleanDecorationBuilderChromeV86(modal); } catch {}
                try { removeLegacyDecorationUploadCardsV87(modal); } catch {}
                try { ensureAcrossScreenControlsV94(modal); } catch {}
                try { optimizeDecorationThumbsV95(modal); } catch {}
            }

            return result;
        };
    } catch {}

    // Small/normal galleries should not sit on "Loading preview…" waiting for
    // requestIdleCallback. Hydrate them on the very next paint, then invalidate
    // V62's older delayed callback so the gallery is not rendered twice.
    try {
        const renderThemeBuilderSvgListBeforeV96 = renderThemeBuilderSvgListV2;
        renderThemeBuilderSvgListV2 = function (modal) {
            const result = renderThemeBuilderSvgListBeforeV96(modal);
            if (!modal) return result;

            const total = Array.isArray(modal._themeBackgroundSvgs)
                ? modal._themeBackgroundSvgs.length
                : 0;
            const token = Number(modal._themeImageHydrateTokenV62);

            if (total <= 24 && Number.isFinite(token) && token > 0) {
                cancelAnimationFrame(modal._themeFastHydrateRafV96 || 0);
                modal._themeFastHydrateRafV96 = requestAnimationFrame(() => {
                    if (modal._themeImageHydrateTokenV62 !== token) return;
                    try { hydrateThemeImageCardsV62(modal, token); } catch {}

                    // Invalidate the idle callback V62 already scheduled.
                    if (modal._themeImageHydrateTokenV62 === token) {
                        modal._themeImageHydrateTokenV62 = token + 1;
                    }
                });
            }

            return result;
        };
    } catch {}

    // --------------------------------------------------------
    // 2) Smooth hover return. Freeze the decoration at its current hover pose,
    // ease transform back to neutral, then restore its normal base animation.
    // --------------------------------------------------------
    function restoreHoverBaseV96(shell, base) {
        if (!shell) return;
        base = base || {};

        if (base.animation) {
            shell.style.setProperty('animation', base.animation, base.animationPriority || '');
        } else {
            shell.style.removeProperty('animation');
        }

        if (base.delay) {
            shell.style.setProperty('animation-delay', base.delay, base.delayPriority || '');
        } else {
            shell.style.removeProperty('animation-delay');
        }

        if (base.playState) {
            shell.style.setProperty('animation-play-state', base.playState, base.playStatePriority || '');
        } else {
            shell.style.removeProperty('animation-play-state');
        }
    }

    function cancelHoverReturnV96(item, shell, restore = true) {
        if (!item || !shell) return;
        clearTimeout(item._themeHoverReturnTimerV96);
        cancelAnimationFrame(item._themeHoverReturnRafV96 || 0);
        item._themeHoverReturnTimerV96 = 0;
        item._themeHoverReturnRafV96 = 0;

        shell.style.removeProperty('transition');
        shell.style.removeProperty('transform');

        if (restore && item._themeHoverReturnBaseV96) {
            restoreHoverBaseV96(shell, item._themeHoverReturnBaseV96);
        }
        item._themeHoverReturnBaseV96 = null;
    }

    try {
        bindThemeHoverAnimationItemV82 = function (item, theme, asset) {
            if (!item) return;

            const animation = effectiveThemeHoverAnimationV82(theme, asset);
            item.dataset.themeHoverAnimationV82 = animation || 'none';
            item.dataset.themeHoverEnabledV82 = animation ? 'true' : 'false';

            if (item._themeHoverEnterV82) {
                try { item.removeEventListener('pointerenter', item._themeHoverEnterV82); } catch {}
            }
            if (item._themeHoverLeaveV82) {
                try { item.removeEventListener('pointerleave', item._themeHoverLeaveV82); } catch {}
            }

            const shell = directThemeMotionShellV82(item);
            if (!shell) return;

            const enter = () => {
                if (!animation) return;

                // If the pointer comes back during the return, finish cleanup
                // first so the new hover begins from the normal animation.
                cancelHoverReturnV96(item, shell, true);

                item._themeHoverBaseV82 = {
                    animation: shell.style.getPropertyValue('animation'),
                    animationPriority: shell.style.getPropertyPriority('animation'),
                    delay: shell.style.getPropertyValue('animation-delay'),
                    delayPriority: shell.style.getPropertyPriority('animation-delay'),
                    playState: shell.style.getPropertyValue('animation-play-state'),
                    playStatePriority: shell.style.getPropertyPriority('animation-play-state')
                };

                shell.style.setProperty('animation', hoverAnimationCssV82(animation), 'important');
                shell.style.setProperty('animation-delay', '0s', 'important');
                shell.style.setProperty('animation-play-state', 'running', 'important');
            };

            const leave = () => {
                if (!animation) return;

                const base = item._themeHoverBaseV82 || {};
                const currentTransform = getComputedStyle(shell).transform || 'none';

                item._themeHoverReturnBaseV96 = base;
                item._themeHoverBaseV82 = null;

                // Freeze exactly where the hover animation currently is.
                shell.style.setProperty('transition', 'none', 'important');
                shell.style.setProperty('animation', 'none', 'important');
                shell.style.setProperty('animation-delay', '0s', 'important');
                shell.style.setProperty('animation-play-state', 'paused', 'important');
                shell.style.setProperty('transform', currentTransform, 'important');

                // Force the frozen pose to commit before starting the return.
                void shell.offsetWidth;

                item._themeHoverReturnRafV96 = requestAnimationFrame(() => {
                    shell.style.setProperty(
                        'transition',
                        'transform .42s cubic-bezier(.22,.82,.24,1)',
                        'important'
                    );
                    shell.style.setProperty('transform', 'none', 'important');
                });

                item._themeHoverReturnTimerV96 = setTimeout(() => {
                    shell.style.removeProperty('transition');
                    shell.style.removeProperty('transform');
                    restoreHoverBaseV96(shell, item._themeHoverReturnBaseV96 || base);
                    item._themeHoverReturnBaseV96 = null;
                    item._themeHoverReturnTimerV96 = 0;
                }, 455);
            };

            item.addEventListener('pointerenter', enter);
            item.addEventListener('pointerleave', leave);
            item._themeHoverEnterV82 = enter;
            item._themeHoverLeaveV82 = leave;
        };
    } catch {}

    requestAnimationFrame(() => {
        const modal = document.getElementById('theme-builder-modal');
        if (!modal) return;

        try { installDecorationCustomizeStabilityV89(modal); } catch {}
        try {
            const list = modal.querySelector('.theme-builder-svg-list');
            list?._themeCustomizeObserverV89?.disconnect?.();
            if (list) list._themeCustomizeObserverV89 = null;
        } catch {}
        try { scheduleThemePreviewHoverV87(modal); } catch {}
    });
})();

// ============================================================
// V97 — THEME BUILDER ORGANIZATION / CATEGORY BARS / PREVIEW MODALS
//      PLAYABLE HOVER SOUNDS / FAST COLOR DRAG / STAGGERED INTRO BOP
// ============================================================
(function () {
    const V97_CATEGORY_DEFAULTS = {
        kbCategoryBorderColorV97: '#171717',
        kbCategoryHoverBorderColorV97: '#171717',
        kbCategoryShadowSizeV97: 0,
        svgHoverSoundNoIntroV97: true
    };

    function v97ValidHex(value, fallback = '#171717') {
        const text = String(value || '').trim();
        return /^#[0-9a-f]{6}$/i.test(text) ? text : fallback;
    }

    function v97MainColorsSection(modal) {
        return Array.from(modal?.querySelectorAll('.theme-builder-control-section') || [])
            .find(section => {
                const name = section.querySelector('.theme-builder-accordion-name, .theme-builder-control-heading strong')?.textContent?.trim();
                return name === 'Main Colors' || section.querySelector('.theme-builder-color-grid:not(.theme-builder-nav-color-grid):not(.theme-builder-dashboard-color-grid-v42):not(.theme-builder-kb-category-color-grid-v12)');
            }) || null;
    }

    function v97ReplaceVisibleSvgWording(modal) {
        if (!modal) return;
        const selector = [
            '.theme-builder-control-heading strong',
            '.theme-builder-accordion-name',
            '.theme-builder-field > span',
            '.theme-builder-visual-toggle-copy strong',
            '.theme-builder-file-button',
            '.theme-builder-svg-option-row > span',
            '.theme-builder-svg-option-row > label',
            '.theme-builder-intro-svg-bop-wrap strong',
            'select option'
        ].join(',');

        modal.querySelectorAll(selector).forEach(node => {
            if (node.closest('.theme-builder-file-name, .theme-builder-svg-card-preview')) return;
            Array.from(node.childNodes).forEach(child => {
                if (child.nodeType !== Node.TEXT_NODE) return;
                const original = child.nodeValue || '';
                let next = original
                    .replace(/\bSVGs\b/g, 'Decorations')
                    .replace(/\bSVG\b/g, 'Decoration')
                    .replace(/\bsvgs\b/g, 'decorations')
                    .replace(/\bsvg\b/g, 'decoration');
                if (next !== original) child.nodeValue = next;
            });
        });

        const introToggle = modal.querySelector('.theme-builder-intro-svg-bop-toggle .theme-builder-visual-toggle-copy strong');
        if (introToggle) introToggle.textContent = 'Bop selected decorations with intro audio';

        // Catch remaining explanatory copy while preserving real filenames and code.
        try {
            const walker = document.createTreeWalker(modal, NodeFilter.SHOW_TEXT);
            const nodes = [];
            let textNode;
            while ((textNode = walker.nextNode())) nodes.push(textNode);
            nodes.forEach(textNode => {
                const parent = textNode.parentElement;
                if (!parent) return;
                if (parent.closest('code, pre, textarea, .theme-builder-file-name, .theme-builder-svg-card-preview')) return;
                const original = textNode.nodeValue || '';
                if (/\.(svg|png|jpe?g)\b/i.test(original)) return;
                const next = original
                    .replace(/\bSVGs\b/g, 'Decorations')
                    .replace(/\bSVG\b/g, 'Decoration')
                    .replace(/\bsvgs\b/g, 'decorations')
                    .replace(/\bsvg\b/g, 'decoration');
                if (next !== original) textNode.nodeValue = next;
            });
        } catch {}

        // Keep the upload-format wording literal. The generic SVG→Decoration
        // copy pass must not turn “Upload SVG, PNG, or JPG…” into
        // “Upload Decoration, PNG, or JPG…”.
        const mediaHeadingV181 = modal.querySelector('.theme-builder-svg-section .theme-builder-media-heading strong');
        const mediaDetailV181 = modal.querySelector('.theme-builder-svg-section .theme-builder-media-heading small');
        if (mediaHeadingV181) mediaHeadingV181.textContent = 'Theme Decorations';
        if (mediaDetailV181) mediaDetailV181.textContent = 'Upload SVG, PNG, or JPG images for the theme background.';
    }

    function v97InstallReduceOverlapControl(modal) {
        const oldRow = modal?.querySelector('.theme-builder-svg-overlap-row-v26');
        const oldInput = oldRow?.querySelector('.theme-builder-svg-overlap-enabled-v26');
        if (!oldRow || !oldInput) return;

        oldRow.classList.add('theme-builder-overlap-internal-v97');

        let row = modal.querySelector('.theme-builder-reduce-overlap-row-v97');
        if (!row) {
            row = document.createElement('label');
            row.className = 'theme-builder-visual-toggle theme-builder-reduce-overlap-row-v97';
            row.innerHTML = `
                <input type="checkbox" class="theme-builder-reduce-overlap-v97">
                <span class="theme-builder-visual-toggle-copy">
                    <strong>Reduce Decoration Overlap</strong>
                </span>
                <span class="theme-builder-switch" aria-hidden="true"></span>
            `;
            oldRow.insertAdjacentElement('afterend', row);
        }

        const input = row.querySelector('.theme-builder-reduce-overlap-v97');
        input.checked = !oldInput.checked;
        if (input.dataset.boundV97 !== 'true') {
            input.dataset.boundV97 = 'true';
            input.addEventListener('change', () => {
                oldInput.checked = !input.checked;
                oldInput.dispatchEvent(new Event('change', { bubbles: true }));
            });
        }
    }

    function v97StyleToggleDependents(modal) {
        if (!modal) return;
        modal.querySelectorAll([
            '.theme-builder-backdrop-details',
            '.theme-builder-daily-backdrop-details',
            '.theme-builder-other-backdrop-details',
            '.theme-builder-nav-background-details',
            '.theme-builder-nav-individual-bg-details',
            '.theme-builder-svg-hover-animation-details-v82',
            '.theme-builder-svg-hover-sound-details'
        ].join(',')).forEach(node => node.classList.add('theme-builder-toggle-dependent-v97'));
    }

    function v97MoveBuilderSections(modal) {
        if (!modal) return;
        const main = v97MainColorsSection(modal);
        if (!main) return;

        const dashboard = modal.querySelector('.theme-builder-dashboard-colors-v42, .theme-builder-dashboard-colors-v40');
        if (dashboard && dashboard !== main.nextElementSibling) {
            main.insertAdjacentElement('afterend', dashboard);
        }

        const hover = modal.querySelector('.theme-builder-hover-controls-v10');
        if (hover && hover !== main) {
            const hoverGrid = hover.querySelector('.theme-builder-hover-control-grid');
            if (hoverGrid) {
                let group = main.querySelector('.theme-builder-main-hover-group-v97');
                if (!group) {
                    group = document.createElement('div');
                    group.className = 'theme-builder-main-hover-group-v97';
                    group.innerHTML = '<div class="theme-builder-subgroup-title-v97">Interactive Hover</div>';
                    const mainBody = main.querySelector(':scope > .theme-builder-accordion-body') || main;
                    mainBody.appendChild(group);
                }
                group.appendChild(hoverGrid);
            }
            hover.remove();
        }

        const backgroundField = modal.querySelector('[data-theme-key="background"]')?.closest('.theme-builder-field');
        const backgroundSection = modal.querySelector('.theme-builder-background-controls');
        if (backgroundField && backgroundSection && !backgroundSection.contains(backgroundField)) {
            const heading = backgroundSection.querySelector('.theme-builder-control-heading');
            backgroundField.classList.add('theme-builder-page-background-color-v97');
            const label = backgroundField.querySelector(':scope > span');
            if (label) label.textContent = 'Page Background Color';
            heading?.insertAdjacentElement('afterend', backgroundField);
        }
    }

    function v97EnsureCategoryBarThemeControls(modal, theme = {}) {
        const section = modal?.querySelector('.theme-builder-kb-category-controls-v12');
        if (!section) return;

        const heading = section.querySelector('.theme-builder-control-heading strong, .theme-builder-accordion-name');
        if (heading) heading.textContent = 'Category Bars';

        const grid = section.querySelector('.theme-builder-kb-category-color-grid-v12, .theme-builder-color-grid');
        if (!grid) return;

        const baseBorder = v97ValidHex(theme.kbCategoryBorderColorV97, theme.border || '#171717');
        const hoverBorder = v97ValidHex(theme.kbCategoryHoverBorderColorV97, theme.kbCategoryFocusBorderColor || theme.border || '#171717');
        const shadow = Math.max(0, Math.min(12, Number(theme.kbCategoryShadowSizeV97) || 0));

        const ensureColor = (label, key, value) => {
            let picker = grid.querySelector(`input[type="color"][data-theme-key="${CSS.escape(key)}"]`);
            if (!picker) {
                grid.insertAdjacentHTML('beforeend', themeBuilderField(label, key, value));
                picker = grid.querySelector(`input[type="color"][data-theme-key="${CSS.escape(key)}"]`);
                try { bindThemeBuilderColorFieldV12(modal, key); } catch {}
            }
            const fieldLabel = picker?.closest('.theme-builder-field')?.querySelector(':scope > span');
            if (fieldLabel) fieldLabel.textContent = label;
        };

        ensureColor('Normal Border', 'kbCategoryBorderColorV97', baseBorder);
        ensureColor('Hover Border', 'kbCategoryHoverBorderColorV97', hoverBorder);

        const focusPicker = grid.querySelector('[data-theme-key="kbCategoryFocusBorderColor"]');
        const focusLabel = focusPicker?.closest('.theme-builder-field')?.querySelector(':scope > span');
        if (focusLabel) focusLabel.textContent = 'Selected / Focused Border';

        if (!grid.querySelector('[data-theme-key="kbCategoryShadowSizeV97"]')) {
            grid.insertAdjacentHTML('beforeend', themeBuilderField('Shadow Size', 'kbCategoryShadowSizeV97', shadow, 'range'));
            const range = grid.querySelector('[data-theme-key="kbCategoryShadowSizeV97"]');
            range?.addEventListener('input', () => updateThemeBuilderPreview(modal));
        }
    }

    function v97EnsureNoSoundOnIntro(modal, theme = {}) {
        const details = modal?.querySelector('.theme-builder-svg-hover-sound-details');
        if (!details) return;
        let row = details.querySelector('.theme-builder-no-sound-intro-v97');
        if (!row) {
            row = document.createElement('label');
            row.className = 'theme-builder-inline-check-v97 theme-builder-no-sound-intro-v97';
            row.innerHTML = `
                <span>No Sound on Intro</span>
                <input type="checkbox" class="theme-builder-no-sound-intro-input-v97">
            `;
            details.prepend(row);
        }
        const input = row.querySelector('input');
        const saved = theme.svgHoverSoundNoIntroV97 ?? modal._themeHoverSoundNoIntroV97 ?? true;
        if (document.activeElement !== input) input.checked = !!saved;
        modal._themeHoverSoundNoIntroV97 = !!input.checked;
        if (input.dataset.boundV97 !== 'true') {
            input.dataset.boundV97 = 'true';
            input.addEventListener('change', () => {
                modal._themeHoverSoundNoIntroV97 = !!input.checked;
                try { scheduleThemePreviewHoverV87(modal); } catch {}
            });
        }
    }

    function v97WireHoverSoundPreviewRows(modal) {
        const host = modal?.querySelector('.theme-builder-hover-sound-list');
        if (!host) return;
        const sounds = Array.isArray(modal._themeHoverSounds) ? modal._themeHoverSounds : [];

        host.querySelectorAll('.theme-builder-hover-sound-row').forEach((row, index) => {
            const sound = sounds[index];
            const icon = row.querySelector(':scope > i.ph-speaker-high, :scope > i.ph-speaker-simple-high');
            if (!icon || !sound?.url) return;
            icon.classList.add('theme-builder-hover-sound-preview-icon-v97');
            icon.setAttribute('role', 'button');
            icon.setAttribute('tabindex', '0');
            icon.setAttribute('title', 'Play sound');
            icon.setAttribute('aria-label', `Play ${sound.name || `Sound ${index + 1}`}`);

            const toggle = event => {
                event.preventDefault();
                event.stopPropagation();
                const current = modal._themeHoverSoundAuditionV97;
                if (current?.audio && current.icon === icon && !current.audio.paused) {
                    try { current.audio.pause(); current.audio.currentTime = 0; } catch {}
                    icon.classList.remove('ph-stop-circle');
                    icon.classList.add('ph-speaker-high');
                    modal._themeHoverSoundAuditionV97 = null;
                    return;
                }
                if (current?.audio) {
                    try { current.audio.pause(); current.audio.currentTime = 0; } catch {}
                    current.icon?.classList.remove('ph-stop-circle');
                    current.icon?.classList.add('ph-speaker-high');
                }
                const audio = new Audio(sound.url);
                audio.volume = Math.max(0, Math.min(1, (Number(modal.querySelector('.theme-builder-svg-hover-volume')?.value) || 72) / 100));
                icon.classList.remove('ph-speaker-high');
                icon.classList.add('ph-stop-circle');
                modal._themeHoverSoundAuditionV97 = { audio, icon };
                const clean = () => {
                    if (modal._themeHoverSoundAuditionV97?.audio === audio) modal._themeHoverSoundAuditionV97 = null;
                    icon.classList.remove('ph-stop-circle');
                    icon.classList.add('ph-speaker-high');
                };
                audio.addEventListener('ended', clean, { once: true });
                audio.play().catch(clean);
            };

            if (icon.dataset.boundV97 !== 'true') {
                icon.dataset.boundV97 = 'true';
                icon.addEventListener('click', toggle);
                icon.addEventListener('keydown', event => {
                    if (event.key === 'Enter' || event.key === ' ') toggle(event);
                });
            }
        });
    }

    try {
        const renderHoverSoundListBeforeV97 = renderThemeBuilderHoverSoundListV10;
        renderThemeBuilderHoverSoundListV10 = function(modal) {
            const result = renderHoverSoundListBeforeV97(modal);
            v97WireHoverSoundPreviewRows(modal);
            return result;
        };
    } catch {}

    function v97SanitizePreviewClone(root) {
        root?.querySelectorAll?.('[id]').forEach(node => {
            node.dataset.previewOriginalId = node.id;
            node.removeAttribute('id');
        });
        root?.querySelectorAll?.('button, input, select, textarea').forEach(node => {
            node.removeAttribute('disabled');
            node.tabIndex = 0;
        });
    }

    function v97OpenClonedSettingsPreview(modal, title, sourceModal) {
        if (!sourceModal) return;
        const overlay = createThemeBuilderPreviewSettingsShellV20(modal, title);
        const content = overlay?.querySelector('.theme-builder-preview-settings-content-v20');
        const sourceBox = sourceModal.querySelector('.modal-box');
        if (!content || !sourceBox) return;
        const clone = sourceBox.cloneNode(true);
        clone.classList.add('theme-builder-preview-cloned-settings-v20', 'theme-builder-preview-cloned-settings-v97');
        clone.querySelector(':scope > .modal-header')?.remove();
        v97SanitizePreviewClone(clone);
        content.innerHTML = '';
        content.appendChild(clone);
    }

    function v97OpenCustomTabSettingsPreview(modal) {
        const sourceId = modal._themeBuilderPreviewSourceId || modal.querySelector('.theme-builder-live-canvas')?.dataset.previewSourceId || '';
        let tab = null;
        const match = String(sourceId).match(/^custom-tab-view-(.+)$/);
        if (match) tab = getCustomTab(match[1]);
        tab ||= getCustomTab(activeCustomTabId) || getCustomTabs()[0] || { name: 'Custom Tab', icon: 'ph-squares-four' };
        const overlay = createThemeBuilderPreviewSettingsShellV20(modal, 'Tab Settings');
        const content = overlay?.querySelector('.theme-builder-preview-settings-content-v20');
        if (!content) return;
        content.innerHTML = `
            <div class="modal-section"><span class="field-label">Tab Name</span><input type="text" value="${escapeCustomHtml(tab.name || 'Custom Tab')}"></div>
            <div class="modal-section"><span class="field-label">Icon</span><div class="custom-tab-icon-picker custom-tab-settings-icon-picker"><button type="button" class="custom-tab-icon-choice selected">${renderCustomTabIcon(tab.icon || 'ph-squares-four')}</button></div></div>
            <button type="button" class="icon-btn custom-tab-save-settings"><i class="ph ph-check"></i> Save</button>
            <button type="button" class="icon-btn"><i class="ph ph-copy"></i> Duplicate Tab</button>
            <button type="button" class="delete-btn"><i class="ph ph-trash"></i> Move to Trash</button>
        `;
    }

    function v97OpenPlusTabPreview(modal) {
        try { ensureCustomTabCreateModal(); } catch {}
        const source = document.getElementById('custom-tab-create-modal');
        if (source) v97OpenClonedSettingsPreview(modal, 'Create Tab', source);
    }

    function bindThemeBuilderAllPreviewSettingsV97(modal) {
        const canvas = modal?.querySelector('.theme-builder-live-canvas');
        if (!canvas) return;
        try { ensureQuizSettingsV58(); ensureQuizSettingsModalV58(); } catch {}

        const bind = (selector, handler) => {
            canvas.querySelectorAll(selector).forEach(button => {
                if (button.dataset.previewSettingsV97 === 'true') return;
                button.dataset.previewSettingsV97 = 'true';
                button.classList.add('theme-builder-preview-settings-button-v20');
                button.addEventListener('click', event => {
                    event.preventDefault();
                    event.stopPropagation();
                    event.stopImmediatePropagation();
                    handler();
                }, true);
            });
        };

        bind('[data-preview-original-id="open-daily-settings-btn"]', () => {
            openThemeBuilderDailySettingsPreviewV20(modal);
        });
        bind('[data-preview-original-id="open-settings-btn"]', () => {
            openThemeBuilderKnowledgeSettingsPreviewV20(modal);
        });
        bind('[data-preview-original-id="open-quiz-settings-v58"]', () => {
            try { ensureQuizSettingsV58(); ensureQuizSettingsModalV58(); } catch {}
            v97OpenClonedSettingsPreview(modal, 'Quiz Settings', document.getElementById('quiz-settings-modal-v58'));
        });
        bind('.custom-tab-settings-btn, [data-preview-original-id="custom-tab-settings-btn"]', () => v97OpenCustomTabSettingsPreview(modal));
        bind('[data-preview-original-id="add-custom-tab-btn"], .custom-tab-plus-btn', () => v97OpenPlusTabPreview(modal));
    }

    function v97InstallFastColorDrag(modal) {
        if (!modal || modal._fastColorDragBoundV97) return;
        modal._fastColorDragBoundV97 = true;
        modal.addEventListener('input', event => {
            const input = event.target;
            if (!(input instanceof HTMLInputElement) || input.type !== 'color') return;

            // Prevent dozens of historical listeners from rebuilding the whole
            // preview for every native picker mousemove. One paint = one update.
            event.stopImmediatePropagation();
            event.stopPropagation();

            const key = input.dataset.themeKey;
            if (key) {
                const hex = modal.querySelector(`[data-theme-hex="${CSS.escape(key)}"]`);
                if (hex) hex.value = input.value;
                if (modal._dashboardColorStateV85 && key in modal._dashboardColorStateV85) {
                    modal._dashboardColorStateV85[key] = input.value;
                }
            }
            if (input.classList.contains('theme-builder-hover-color')) {
                const hex = modal.querySelector('.theme-builder-hover-color-hex');
                if (hex) hex.value = input.value;
            }

            cancelAnimationFrame(modal._fastColorRafV97 || 0);
            modal._fastColorRafV97 = requestAnimationFrame(() => {
                try { updateThemeBuilderPreview(modal); } catch {}
            });
        }, true);
    }

    function v97PolishThemeBuilder(modal, theme = {}) {
        if (!modal) return;
        v97InstallReduceOverlapControl(modal);
        v97MoveBuilderSections(modal);
        v97EnsureCategoryBarThemeControls(modal, theme);
        v97EnsureNoSoundOnIntro(modal, theme);
        v97StyleToggleDependents(modal);
        v97WireHoverSoundPreviewRows(modal);
        v97ReplaceVisibleSvgWording(modal);
        v97InstallFastColorDrag(modal);
        bindThemeBuilderAllPreviewSettingsV97(modal);
    }

    try {
        const populateBeforeV97 = populateThemeBuilder;
        populateThemeBuilder = function(modal, theme = {}) {
            const merged = { ...V97_CATEGORY_DEFAULTS, ...(theme || {}) };
            const result = populateBeforeV97(modal, merged);
            v97PolishThemeBuilder(modal, merged);
            requestAnimationFrame(() => v97PolishThemeBuilder(modal, merged));
            return result;
        };
    } catch {}

    try {
        const updatePreviewBeforeV97 = updateThemeBuilderPreview;
        updateThemeBuilderPreview = function(modal) {
            const result = updatePreviewBeforeV97(modal);
            requestAnimationFrame(() => {
                bindThemeBuilderAllPreviewSettingsV97(modal);
                v97ReplaceVisibleSvgWording(modal);
            });
            return result;
        };
    } catch {}

    try {
        const draftBeforeV97 = getThemeBuilderDraft;
        getThemeBuilderDraft = function(modal) {
            const draft = { ...V97_CATEGORY_DEFAULTS, ...draftBeforeV97(modal) };
            const color = key => modal.querySelector(`[data-theme-key="${CSS.escape(key)}"]`)?.value;
            const shadow = Number(color('kbCategoryShadowSizeV97'));
            draft.kbCategoryBorderColorV97 = v97ValidHex(color('kbCategoryBorderColorV97'), draft.border || '#171717');
            draft.kbCategoryHoverBorderColorV97 = v97ValidHex(color('kbCategoryHoverBorderColorV97'), draft.kbCategoryFocusBorderColor || draft.border || '#171717');
            draft.kbCategoryShadowSizeV97 = Number.isFinite(shadow) ? Math.max(0, Math.min(12, shadow)) : 0;
            draft.svgHoverSoundNoIntroV97 = !!modal.querySelector('.theme-builder-no-sound-intro-input-v97')?.checked;
            return draft;
        };
    } catch {}

    function v97ApplyCategoryVars(target, theme = {}) {
        if (!target) return;
        const normalBorder = v97ValidHex(theme.kbCategoryBorderColorV97, theme.border || '#171717');
        const hoverBorder = v97ValidHex(theme.kbCategoryHoverBorderColorV97, theme.kbCategoryFocusBorderColor || theme.border || '#171717');
        const shadow = Math.max(0, Math.min(12, Number(theme.kbCategoryShadowSizeV97) || 0));
        target.style.setProperty('--custom-theme-category-border-v97', normalBorder, 'important');
        target.style.setProperty('--custom-theme-category-hover-border-v97', hoverBorder, 'important');
        target.style.setProperty('--custom-theme-category-shadow-v97', `${shadow}px`, 'important');
    }

    try {
        const interactionVarsBeforeV97 = applyThemeBuilderInteractionVarsV12;
        applyThemeBuilderInteractionVarsV12 = function(target, theme) {
            const result = interactionVarsBeforeV97(target, theme);
            v97ApplyCategoryVars(target, theme || {});
            return result;
        };
    } catch {}

    try {
        const applyCustomBeforeV97 = applyCustomBuiltTheme;
        applyCustomBuiltTheme = function(theme = getCustomThemeSettings()) {
            const merged = { ...V97_CATEGORY_DEFAULTS, ...(theme || {}) };
            const result = applyCustomBeforeV97(merged);
            v97ApplyCategoryVars(document.documentElement, merged);
            return result;
        };
    } catch {}

    // Hover sounds may optionally be silenced for as long as intro music is active.
    function v97IntroIsPlayingForItem(item) {
        try {
            const modal = document.getElementById('theme-builder-modal');
            const previewAudio = modal?._themeBuilderIntroPreviewAudioV10;
            if (previewAudio && !previewAudio.paused && !previewAudio.ended) return true;
        } catch {}
        if (item?.closest?.('.theme-svg-intro-active')) return true;
        return !!document.querySelector('.theme-svg-intro-active');
    }

    try {
        const startHoverAudioBeforeV97 = startThemeHoverAudioForItemV87;
        startThemeHoverAudioForItemV87 = function(item, theme, asset) {
            if (theme?.svgHoverSoundNoIntroV97 && v97IntroIsPlayingForItem(item)) {
                try { stopThemeHoverAudioForItemV87(item, 0); } catch {}
                return;
            }
            return startHoverAudioBeforeV97(item, theme, asset);
        };
    } catch {}

    // ---------------- Generic Category Bar custom-tab component ----------------
    try {
        if (!CUSTOM_COMPONENT_LIBRARY.some(def => def.type === 'categoryBar')) {
            const searchIndex = CUSTOM_COMPONENT_LIBRARY.findIndex(def => def.type === 'search');
            CUSTOM_COMPONENT_LIBRARY.splice(Math.max(0, searchIndex + 1), 0, {
                type: 'categoryBar',
                label: 'Category Bar',
                icon: 'ph-tabs'
            });
        }
    } catch {}

    try {
        const defaultComponentBeforeV97 = defaultCustomComponent;
        defaultCustomComponent = function(type) {
            if (type === 'categoryBar') {
                const id = customId('component');
                return {
                    id,
                    type,
                    title: 'Categories',
                    titleBackground: 'none',
                    categories: ['Category 1', 'Category 2'],
                    activeCategory: 'Category 1',
                    items: []
                };
            }
            return defaultComponentBeforeV97(type);
        };
    } catch {}

    function renderCustomCategoryBarV97(tab, component, content) {
        if (!Array.isArray(component.categories) || !component.categories.length) component.categories = ['Category 1'];
        if (!component.categories.includes(component.activeCategory)) component.activeCategory = component.categories[0];
        if (!Array.isArray(component.items)) component.items = [];
        const active = component.activeCategory;

        content.innerHTML = `
            <div class="custom-collection-header custom-category-header-v97">
                <h2>${escapeCustomHtml(component.title || 'Categories')}</h2>
            </div>
            <div class="custom-category-bar-v97" role="tablist"></div>
            <div class="custom-category-items-v97"></div>
        `;
        const bar = content.querySelector('.custom-category-bar-v97');
        const list = content.querySelector('.custom-category-items-v97');

        component.categories.forEach(category => {
            const button = document.createElement('button');
            button.type = 'button';
            button.className = `filter-tab custom-category-bar-tab-v97${category === active ? ' active' : ''}`;
            button.setAttribute('aria-selected', category === active ? 'true' : 'false');
            button.textContent = category;
            button.addEventListener('click', () => {
                component.activeCategory = category;
                saveDb();
                renderCustomTabView(tab.id);
            });
            bar.appendChild(button);
        });

        const add = document.createElement('button');
        add.type = 'button';
        add.className = 'filter-tab custom-category-bar-add-v97';
        add.title = `Add item to ${active}`;
        add.setAttribute('aria-label', `Add item to ${active}`);
        add.innerHTML = '<i class="ph ph-plus"></i>';
        add.addEventListener('click', async () => {
            const values = await showAppFormModal({
                title: `Add to ${active}`,
                submitLabel: 'Add Item',
                fields: [
                    { name: 'title', label: 'Item Title', value: '' },
                    { name: 'body', label: 'Details', type: 'textarea', value: '' }
                ]
            });
            if (!values || !String(values.title || '').trim()) return;
            component.items.push({
                id: customId('category-item'),
                category: active,
                title: String(values.title).trim(),
                body: String(values.body || '')
            });
            saveDb();
            renderCustomTabView(tab.id);
        });
        bar.appendChild(add);

        component.items.filter(item => item.category === active).forEach(item => {
            const card = document.createElement('article');
            card.className = 'custom-category-item-v97 custom-user-card custom-searchable-item custom-content-editable';
            card.dataset.searchText = `${item.title || ''} ${item.body || ''} ${item.category || ''}`.toLowerCase();
            card.innerHTML = `<h3>${escapeCustomHtml(item.title || 'Untitled')}</h3>${item.body ? `<p>${escapeCustomHtml(item.body).replace(/\n/g, '<br>')}</p>` : ''}`;
            card.addEventListener('contextmenu', event => {
                event.preventDefault();
                showCustomItemContextMenu(event.clientX, event.clientY, [
                    {
                        label: 'Edit item', icon: 'ph-pencil-simple', action: async () => {
                            const values = await showAppFormModal({
                                title: 'Edit Item', submitLabel: 'Save', fields: [
                                    { name: 'title', label: 'Item Title', value: item.title || '' },
                                    { name: 'body', label: 'Details', type: 'textarea', value: item.body || '' }
                                ]
                            });
                            if (!values) return;
                            item.title = String(values.title || '').trim() || item.title;
                            item.body = String(values.body || '');
                            saveDb(); renderCustomTabView(tab.id);
                        }
                    },
                    {
                        label: 'Delete item', icon: 'ph-trash', danger: true, action: () => {
                            component.items = component.items.filter(entry => entry.id !== item.id);
                            saveDb(); renderCustomTabView(tab.id);
                        }
                    }
                ]);
            });
            list.appendChild(card);
        });

        if (!list.children.length) {
            list.innerHTML = `<div class="custom-category-empty-v97">No items in ${escapeCustomHtml(active)} yet.</div>`;
        }
    }

    try {
        const renderComponentBeforeV97 = renderCustomComponentContent;
        renderCustomComponentContent = function(tab, component, content) {
            if (component?.type === 'categoryBar') return renderCustomCategoryBarV97(tab, component, content);
            return renderComponentBeforeV97(tab, component, content);
        };
    } catch {}

    try {
        const editComponentBeforeV97 = editCustomComponent;
        editCustomComponent = async function(tabId, componentId) {
            const tab = getCustomTab(tabId);
            const component = tab?.components?.find(entry => entry.id === componentId);
            if (component?.type !== 'categoryBar') return editComponentBeforeV97(tabId, componentId);
            const values = await showAppFormModal({
                title: 'Edit Category Bar',
                submitLabel: 'Save',
                fields: [
                    { name: 'title', label: 'Section Title', value: component.title || 'Categories' },
                    { name: 'categories', label: 'Categories (comma separated)', value: (component.categories || []).join(', ') }
                ]
            });
            if (!values) return;
            const categories = String(values.categories || '').split(',').map(v => v.trim()).filter(Boolean);
            component.title = String(values.title || '').trim() || 'Categories';
            component.categories = categories.length ? [...new Set(categories)] : ['Category 1'];
            if (!component.categories.includes(component.activeCategory)) component.activeCategory = component.categories[0];
            saveDb();
            renderCustomTabView(tabId);
        };
    } catch {}

    // Search Bar already filters .custom-searchable-item. Re-run filtering after
    // a category switch so a Search Bar directly above the Category Bar remains linked.
    try {
        const renderTabBeforeSearchV97 = renderCustomTabView;
        renderCustomTabView = function(tabId) {
            const view = document.getElementById(`custom-tab-view-${tabId}`);
            const query = view?.querySelector('.custom-user-search')?.value || '';
            const result = renderTabBeforeSearchV97(tabId);
            const nextView = document.getElementById(`custom-tab-view-${tabId}`);
            const nextInput = nextView?.querySelector('.custom-user-search');
            if (nextInput && query) {
                nextInput.value = query;
                filterCustomTabItems(tabId, query);
            }
            return result;
        };
    } catch {}

    // Theme Settings modal title + remove theme-card helper copy.
    try {
        const openThemeSettingsBeforeV97 = openGlobalThemeSettings;
        openGlobalThemeSettings = function() {
            const result = openThemeSettingsBeforeV97();
            const title = document.querySelector('#daily-settings-modal .modal-header h2');
            if (title) title.textContent = 'Settings';
            document.querySelectorAll('#daily-settings-modal .theme-picker-hint').forEach(node => node.remove());
            return result;
        };
    } catch {}

    try {
        const renderThemePickerBeforeV97 = renderThemePicker;
        renderThemePicker = function() {
            const result = renderThemePickerBeforeV97();
            document.querySelectorAll('#daily-settings-modal .theme-picker-hint').forEach(node => node.remove());
            return result;
        };
    } catch {}

    window.__v97ReplaceVisibleSvgWording = v97ReplaceVisibleSvgWording;
    window.__v97EnsureNoSoundOnIntro = v97EnsureNoSoundOnIntro;
    window.__v97WireHoverSoundPreviewRows = v97WireHoverSoundPreviewRows;
    window.__v97PolishThemeBuilder = v97PolishThemeBuilder;

    requestAnimationFrame(() => {
        const modal = document.getElementById('theme-builder-modal');
        if (modal) v97PolishThemeBuilder(modal, (() => { try { return getThemeBuilderDraft(modal); } catch { return {}; } })());
        const title = document.querySelector('#daily-settings-modal .modal-header h2');
        if (title?.textContent?.trim() === 'Settings') title.textContent = 'Settings';
    });
})();

// V97B — final hydration/order guard after late gallery + accordion passes.
(function(){
    function syncCategoryValuesV97B(modal, theme = {}) {
        const section = modal?.querySelector('.theme-builder-kb-category-controls-v12');
        if (!section) return;
        section.querySelectorAll('.theme-builder-control-heading strong, .theme-builder-accordion-name').forEach(node => {
            if (/Knowledge Base Categories|Category Bars/i.test(node.textContent || '')) node.textContent = 'Category Bars';
        });
        const pairs = [
            ['kbCategoryBorderColorV97', theme.kbCategoryBorderColorV97 || theme.border || '#171717'],
            ['kbCategoryHoverBorderColorV97', theme.kbCategoryHoverBorderColorV97 || theme.kbCategoryFocusBorderColor || theme.border || '#171717']
        ];
        pairs.forEach(([key, value]) => {
            if (!/^#[0-9a-f]{6}$/i.test(String(value))) return;
            const picker = section.querySelector(`input[type="color"][data-theme-key="${CSS.escape(key)}"]`);
            const hex = section.querySelector(`[data-theme-hex="${CSS.escape(key)}"]`);
            if (picker && document.activeElement !== picker) picker.value = value;
            if (hex && document.activeElement !== hex) hex.value = value;
        });
        const range = section.querySelector('[data-theme-key="kbCategoryShadowSizeV97"]');
        if (range && document.activeElement !== range) {
            range.value = String(Math.max(0, Math.min(12, Number(theme.kbCategoryShadowSizeV97) || 0)));
            const out = section.querySelector('[data-theme-output="kbCategoryShadowSizeV97"]');
            if (out) out.textContent = range.value;
        }
    }

    try {
        const renderBefore = renderThemeBuilderSvgListV2;
        renderThemeBuilderSvgListV2 = function(modal) {
            const result = renderBefore(modal);
            requestAnimationFrame(() => {
                try { window.__v97ReplaceVisibleSvgWording?.(modal); } catch {}
                try { window.__v97EnsureNoSoundOnIntro?.(modal, getThemeBuilderDraft(modal)); } catch {}
                try { window.__v97WireHoverSoundPreviewRows?.(modal); } catch {}
            });
            return result;
        };
    } catch {}

    try {
        const hydrateBefore = hydrateThemeImageCardsV62;
        hydrateThemeImageCardsV62 = function(modal, token) {
            const result = hydrateBefore(modal, token);
            requestAnimationFrame(() => {
                try { window.__v97ReplaceVisibleSvgWording?.(modal); } catch {}
                try { window.__v97WireHoverSoundPreviewRows?.(modal); } catch {}
            });
            return result;
        };
    } catch {}

    try {
        const populateBefore = populateThemeBuilder;
        populateThemeBuilder = function(modal, theme = {}) {
            const result = populateBefore(modal, theme);
            syncCategoryValuesV97B(modal, theme);
            requestAnimationFrame(() => syncCategoryValuesV97B(modal, theme));
            return result;
        };
    } catch {}
})();

// V97C — make custom-theme page widths follow the actually rendered Daily Logs width.
(function(){
    function captureDailyPageWidthV97(){
        if (!document.body?.classList.contains('theme-custom-builder')) return;
        const grid = document.getElementById('grid-view');
        if (!grid) return;
        const rect = grid.getBoundingClientRect();
        if (rect.width > 200) {
            document.documentElement.style.setProperty('--custom-theme-daily-page-width-v97', `${Math.round(rect.width)}px`);
        }
    }
    try {
        const switchViewBeforeV97 = switchView;
        switchView = function(view){
            captureDailyPageWidthV97();
            const result = switchViewBeforeV97.apply(this, arguments);
            requestAnimationFrame(captureDailyPageWidthV97);
            return result;
        };
    } catch {}
    window.addEventListener('resize', captureDailyPageWidthV97, { passive:true });
    requestAnimationFrame(() => requestAnimationFrame(captureDailyPageWidthV97));
})();

// ============================================================
// V98 — DASHBOARD/TAB CATEGORY STYLE MATCHING + COLOR COPY MENU
// ============================================================
(function(){
    const DASH_CATEGORY_FIELDS_V98 = [
        ['Normal Background', 'dashboardCategoryBackgroundColorV98', '#777777'],
        ['Normal Text', 'dashboardCategoryTextColorV98', '#171717'],
        ['Hover Background', 'dashboardCategoryHoverBackgroundColorV98', '#d9d2ff'],
        ['Hover Text', 'dashboardCategoryHoverTextColorV98', '#171717'],
        ['Selected / Focused Background', 'dashboardCategorySelectedBackgroundColorV98', '#777777'],
        ['Selected / Focused Text', 'dashboardCategorySelectedTextColorV98', '#ffffff'],
        ['Normal Border', 'dashboardCategoryBorderColorV98', '#171717'],
        ['Hover Border', 'dashboardCategoryHoverBorderColorV98', '#171717'],
        ['Selected / Focused Border', 'dashboardCategorySelectedBorderColorV98', '#171717']
    ];

    const CATEGORY_MATCH_V98 = [
        ['kbCategoryBackgroundColor', 'dashboardCategoryBackgroundColorV98'],
        ['kbCategoryTextColor', 'dashboardCategoryTextColorV98'],
        ['kbCategoryHoverBackgroundColor', 'dashboardCategoryHoverBackgroundColorV98'],
        ['kbCategoryHoverTextColor', 'dashboardCategoryHoverTextColorV98'],
        ['kbCategoryFocusBackgroundColor', 'dashboardCategorySelectedBackgroundColorV98'],
        ['kbCategoryFocusTextColor', 'dashboardCategorySelectedTextColorV98'],
        ['kbCategoryBorderColorV97', 'dashboardCategoryBorderColorV98'],
        ['kbCategoryHoverBorderColorV97', 'dashboardCategoryHoverBorderColorV98'],
        ['kbCategoryFocusBorderColor', 'dashboardCategorySelectedBorderColorV98'],
        ['kbCategoryShadowSizeV97', 'dashboardCategoryShadowSizeV98']
    ];

    const LABELS_V98 = {
        background: 'Background → Page Background Color',
        surface: 'Main Colors → Cards / Surface',
        text: 'Main Colors → Main Text',
        border: 'Main Colors → Borders',
        accent: 'Main Colors → Accent',
        muted: 'Main Colors → Muted Text',
        dashboardTextV40: 'Dashboard → Accent Color',
        dashboardAccentV40: 'Dashboard → Buttons Color',
        dashboardCategoryBackgroundColorV98: 'Dashboard Categories → Normal Background',
        dashboardCategoryTextColorV98: 'Dashboard Categories → Normal Text',
        dashboardCategoryHoverBackgroundColorV98: 'Dashboard Categories → Hover Background',
        dashboardCategoryHoverTextColorV98: 'Dashboard Categories → Hover Text',
        dashboardCategorySelectedBackgroundColorV98: 'Dashboard Categories → Selected Background',
        dashboardCategorySelectedTextColorV98: 'Dashboard Categories → Selected Text',
        dashboardCategoryBorderColorV98: 'Dashboard Categories → Normal Border',
        dashboardCategoryHoverBorderColorV98: 'Dashboard Categories → Hover Border',
        dashboardCategorySelectedBorderColorV98: 'Dashboard Categories → Selected Border',
        kbCategoryBackgroundColor: 'Category Bars → Normal Background',
        kbCategoryTextColor: 'Category Bars → Normal Text',
        kbCategoryHoverBackgroundColor: 'Category Bars → Hover Background',
        kbCategoryHoverTextColor: 'Category Bars → Hover Text',
        kbCategoryFocusBackgroundColor: 'Category Bars → Selected Background',
        kbCategoryFocusTextColor: 'Category Bars → Selected Text',
        kbCategoryBorderColorV97: 'Category Bars → Normal Border',
        kbCategoryHoverBorderColorV97: 'Category Bars → Hover Border',
        kbCategoryFocusBorderColor: 'Category Bars → Selected Border'
    };

    const COPY_SOURCES_V98 = {};
    CATEGORY_MATCH_V98.forEach(([tabKey, dashKey]) => {
        if (String(tabKey).includes('Shadow')) return;
        COPY_SOURCES_V98[tabKey] = [dashKey];
        COPY_SOURCES_V98[dashKey] = [tabKey];
    });
    // The user's Dashboard "Accent Color" is the ink/border color used by
    // dashboard controls. Make the Log-page Borders field directly copyable
    // from it, and vice versa.
    COPY_SOURCES_V98.border = ['dashboardTextV40', 'dashboardCategoryBorderColorV98', 'kbCategoryBorderColorV97'];
    COPY_SOURCES_V98.dashboardTextV40 = ['border', 'kbCategoryBorderColorV97'];

    function validHexV98(value, fallback = '#171717') {
        const v = String(value || '').trim();
        return /^#[0-9a-f]{6}$/i.test(v) ? v : fallback;
    }

    function readableV98(color) {
        try { return getReadableTextColor(color); } catch {}
        const hex = validHexV98(color).slice(1);
        const r = parseInt(hex.slice(0,2),16), g = parseInt(hex.slice(2,4),16), b = parseInt(hex.slice(4,6),16);
        return (0.299*r + 0.587*g + 0.114*b) / 255 > .58 ? '#171717' : '#ffffff';
    }

    function controlV98(modal, key) {
        return {
            picker: modal?.querySelector(`input[type="color"][data-theme-key="${CSS.escape(key)}"]`) || null,
            hex: modal?.querySelector(`[data-theme-hex="${CSS.escape(key)}"]`) || null,
            range: modal?.querySelector(`input[type="range"][data-theme-key="${CSS.escape(key)}"]`) || null
        };
    }

    function readValueV98(modal, key, fallback = '') {
        const c = controlV98(modal, key);
        if (c.picker && validHexV98(c.picker.value, '') ) return c.picker.value;
        if (c.hex && validHexV98(c.hex.value, '') ) return c.hex.value;
        if (c.range) return c.range.value;
        try {
            const draft = getThemeBuilderDraft(modal);
            if (draft && draft[key] != null) return draft[key];
        } catch {}
        return fallback;
    }

    function setValueV98(modal, key, value, update = false) {
        const c = controlV98(modal, key);
        if (c.range) {
            c.range.value = String(value ?? 0);
            const out = modal?.querySelector(`[data-theme-output="${CSS.escape(key)}"]`);
            if (out) out.textContent = c.range.value;
        } else if (validHexV98(value, '')) {
            if (c.picker) c.picker.value = value;
            if (c.hex) c.hex.value = value;
        }

        // Keep V85's legacy selected/hover keys synchronized so old save and
        // runtime paths remain backwards compatible.
        if (key === 'dashboardCategorySelectedBackgroundColorV98') {
            const old = controlV98(modal, 'dashboardCategorySelectedColorV85');
            if (old.picker) old.picker.value = value;
            if (old.hex) old.hex.value = value;
            if (modal?._dashboardColorStateV85) modal._dashboardColorStateV85.dashboardCategorySelectedColorV85 = value;
        }
        if (key === 'dashboardCategoryHoverBackgroundColorV98') {
            const old = controlV98(modal, 'dashboardCategoryHoverColorV85');
            if (old.picker) old.picker.value = value;
            if (old.hex) old.hex.value = value;
            if (modal?._dashboardColorStateV85) modal._dashboardColorStateV85.dashboardCategoryHoverColorV85 = value;
        }

        if (update) {
            try { updateThemeBuilderPreview(modal); } catch {}
        }
    }

    function dashboardCategoryDefaultsV98(theme = {}) {
        const normalBg = validHexV98(theme.dashboardCategoryBackgroundColorV98,
            validHexV98(theme.dashboardAccentV40, validHexV98(theme.accent, '#777777')));
        const normalText = validHexV98(theme.dashboardCategoryTextColorV98,
            validHexV98(theme.dashboardTextV40, validHexV98(theme.text, '#171717')));
        const hoverBg = validHexV98(theme.dashboardCategoryHoverBackgroundColorV98,
            validHexV98(theme.dashboardCategoryHoverColorV85, normalBg));
        const selectedBg = validHexV98(theme.dashboardCategorySelectedBackgroundColorV98,
            validHexV98(theme.dashboardCategorySelectedColorV85, normalBg));
        const normalBorder = validHexV98(theme.dashboardCategoryBorderColorV98, normalText);
        return {
            dashboardCategoryBackgroundColorV98: normalBg,
            dashboardCategoryTextColorV98: normalText,
            dashboardCategoryHoverBackgroundColorV98: hoverBg,
            dashboardCategoryHoverTextColorV98: validHexV98(theme.dashboardCategoryHoverTextColorV98, readableV98(hoverBg)),
            dashboardCategorySelectedBackgroundColorV98: selectedBg,
            dashboardCategorySelectedTextColorV98: validHexV98(theme.dashboardCategorySelectedTextColorV98, readableV98(selectedBg)),
            dashboardCategoryBorderColorV98: normalBorder,
            dashboardCategoryHoverBorderColorV98: validHexV98(theme.dashboardCategoryHoverBorderColorV98, normalBorder),
            dashboardCategorySelectedBorderColorV98: validHexV98(theme.dashboardCategorySelectedBorderColorV98, normalBorder),
            dashboardCategoryShadowSizeV98: Math.max(0, Math.min(12, Number(theme.dashboardCategoryShadowSizeV98) || 0))
        };
    }

    function ensureDashboardCategoryControlsV98(modal, theme = {}) {
        const section = modal?.querySelector('.theme-builder-dashboard-colors-v42, .theme-builder-dashboard-colors-v40');
        const grid = section?.querySelector('.theme-builder-dashboard-color-grid-v42, .theme-builder-color-grid');
        if (!section || !grid) return;

        // Hide the two old simplified category fields; the new group below is
        // a superset and keeps those values synchronized internally.
        ['dashboardCategorySelectedColorV85','dashboardCategoryHoverColorV85'].forEach(key => {
            controlV98(modal, key).picker?.closest('.theme-builder-field')?.classList.add('theme-builder-legacy-dashboard-category-v98');
        });

        let group = section.querySelector('.theme-builder-dashboard-category-group-v98');
        if (!group) {
            group = document.createElement('div');
            group.className = 'theme-builder-dashboard-category-group-v98';
            group.innerHTML = `
                <div class="theme-builder-section-sync-head-v98">
                    <strong>Dashboard Category Bar</strong>
                    <button type="button" class="theme-builder-sync-values-v98 theme-builder-match-tabs-v98">
                        <i class="ph ph-copy"></i><span>Match Category Bars</span>
                    </button>
                </div>
                <div class="theme-builder-dashboard-category-grid-v98"></div>
            `;
            grid.appendChild(group);
        }

        const inner = group.querySelector('.theme-builder-dashboard-category-grid-v98');
        const defaults = dashboardCategoryDefaultsV98(theme);
        DASH_CATEGORY_FIELDS_V98.forEach(([label,key]) => {
            if (!inner.querySelector(`[data-theme-key="${CSS.escape(key)}"]`)) {
                inner.insertAdjacentHTML('beforeend', themeBuilderField(label, key, defaults[key]));
            }
            setValueV98(modal, key, validHexV98(theme[key], defaults[key]), false);
            try { bindThemeBuilderColorFieldV12(modal, key); } catch {}
        });
        if (!inner.querySelector('[data-theme-key="dashboardCategoryShadowSizeV98"]')) {
            inner.insertAdjacentHTML('beforeend', themeBuilderField('Shadow Size', 'dashboardCategoryShadowSizeV98', defaults.dashboardCategoryShadowSizeV98, 'range'));
        }
        const range = inner.querySelector('[data-theme-key="dashboardCategoryShadowSizeV98"]');
        if (range && document.activeElement !== range) {
            range.value = String(theme.dashboardCategoryShadowSizeV98 ?? defaults.dashboardCategoryShadowSizeV98);
            const out = inner.querySelector('[data-theme-output="dashboardCategoryShadowSizeV98"]');
            if (out) out.textContent = range.value;
        }
        if (range && range.dataset.boundV98 !== 'true') {
            range.dataset.boundV98 = 'true';
            range.addEventListener('input', () => {
                const out = inner.querySelector('[data-theme-output="dashboardCategoryShadowSizeV98"]');
                if (out) out.textContent = range.value;
                updateThemeBuilderPreview(modal);
            });
        }

        const match = group.querySelector('.theme-builder-match-tabs-v98');
        if (match && match.dataset.boundV98 !== 'true') {
            match.dataset.boundV98 = 'true';
            match.addEventListener('click', () => copyCategoryGroupV98(modal, 'tabs-to-dashboard'));
        }
    }

    function ensureCategoryGroupMatchButtonV98(modal) {
        const section = modal?.querySelector('.theme-builder-kb-category-controls-v12');
        if (!section) return;
        let head = section.querySelector('.theme-builder-category-sync-head-v98');
        if (!head) {
            head = document.createElement('div');
            head.className = 'theme-builder-category-sync-head-v98';
            head.innerHTML = `
                <button type="button" class="theme-builder-sync-values-v98 theme-builder-match-dashboard-v98">
                    <i class="ph ph-copy"></i><span>Match Dashboard Categories</span>
                </button>
            `;
            const grid = section.querySelector('.theme-builder-kb-category-color-grid-v12, .theme-builder-color-grid');
            grid?.insertAdjacentElement('beforebegin', head);
        }
        const button = head.querySelector('.theme-builder-match-dashboard-v98');
        if (button && button.dataset.boundV98 !== 'true') {
            button.dataset.boundV98 = 'true';
            button.addEventListener('click', () => copyCategoryGroupV98(modal, 'dashboard-to-tabs'));
        }
    }

    function copyCategoryGroupV98(modal, direction) {
        const pairs = direction === 'tabs-to-dashboard'
            ? CATEGORY_MATCH_V98
            : CATEGORY_MATCH_V98.map(([a,b]) => [b,a]);
        pairs.forEach(([source,target]) => {
            const value = readValueV98(modal, source, '');
            if (value !== '') setValueV98(modal, target, value, false);
        });
        try { syncDashboardCategoryPreviewV98(modal); } catch {}
        try { updateThemeBuilderPreview(modal); } catch {}
    }

    function installColorCopyMenusV98(modal) {
        if (!modal) return;
        modal.querySelectorAll('.theme-builder-field').forEach(field => {
            const picker = field.querySelector('input[type="color"][data-theme-key]');
            if (!picker) return;
            const key = picker.dataset.themeKey;
            const sources = COPY_SOURCES_V98[key] || [];
            if (!sources.length) return;
            field.classList.add('theme-builder-color-copyable-v98');
            field.title = 'Right-click to copy a matching color';
            if (field.dataset.copyMenuV98 === 'true') return;
            field.dataset.copyMenuV98 = 'true';
            field.addEventListener('contextmenu', event => {
                event.preventDefault();
                event.stopPropagation();
                const actions = sources
                    .map(sourceKey => {
                        const value = readValueV98(modal, sourceKey, '');
                        if (!validHexV98(value, '')) return null;
                        return {
                            label: `Copy from ${LABELS_V98[sourceKey] || sourceKey}`,
                            icon: 'ph-copy',
                            action: () => {
                                setValueV98(modal, key, value, false);
                                try { updateThemeBuilderPreview(modal); } catch {}
                            }
                        };
                    })
                    .filter(Boolean);
                if (!actions.length) return;
                try { showCustomItemContextMenu(event.clientX, event.clientY, actions); } catch {}
            });
        });
    }

    function currentDashboardCategoryThemeV98(modal, draft = null) {
        const base = draft || (() => { try { return getThemeBuilderDraft(modal); } catch { return {}; } })();
        const d = dashboardCategoryDefaultsV98(base || {});
        Object.keys(d).forEach(key => {
            const value = readValueV98(modal, key, d[key]);
            d[key] = key.includes('Shadow') ? Math.max(0, Math.min(12, Number(value) || 0)) : validHexV98(value, d[key]);
        });
        return d;
    }

    function syncDashboardCategoryPreviewV98(modal) {
        const preview = modal?.querySelector('.theme-builder-dashboard-preview-v45');
        if (!preview) return;
        const c = currentDashboardCategoryThemeV98(modal);
        preview.style.setProperty('--tb-dashboard-category-bg-v98', c.dashboardCategoryBackgroundColorV98);
        preview.style.setProperty('--tb-dashboard-category-text-v98', c.dashboardCategoryTextColorV98);
        preview.style.setProperty('--tb-dashboard-category-hover-bg-v98', c.dashboardCategoryHoverBackgroundColorV98);
        preview.style.setProperty('--tb-dashboard-category-hover-text-v98', c.dashboardCategoryHoverTextColorV98);
        preview.style.setProperty('--tb-dashboard-category-selected-bg-v98', c.dashboardCategorySelectedBackgroundColorV98);
        preview.style.setProperty('--tb-dashboard-category-selected-text-v98', c.dashboardCategorySelectedTextColorV98);
        preview.style.setProperty('--tb-dashboard-category-border-v98', c.dashboardCategoryBorderColorV98);
        preview.style.setProperty('--tb-dashboard-category-hover-border-v98', c.dashboardCategoryHoverBorderColorV98);
        preview.style.setProperty('--tb-dashboard-category-selected-border-v98', c.dashboardCategorySelectedBorderColorV98);
        preview.style.setProperty('--tb-dashboard-category-shadow-v98', `${c.dashboardCategoryShadowSizeV98}px`);
    }

    function polishV98(modal, theme = {}) {
        if (!modal) return;
        ensureDashboardCategoryControlsV98(modal, theme);
        ensureCategoryGroupMatchButtonV98(modal);
        installColorCopyMenusV98(modal);
        syncDashboardCategoryPreviewV98(modal);
    }

    // Explicitly preserve the new dashboard category fields through draft/save.
    try {
        const getDraftBeforeV98 = getThemeBuilderDraft;
        getThemeBuilderDraft = function(modal) {
            const draft = getDraftBeforeV98(modal);
            if (!modal) return draft;
            const c = currentDashboardCategoryThemeV98(modal, draft);
            Object.assign(draft, c);
            draft.dashboardCategorySelectedColorV85 = c.dashboardCategorySelectedBackgroundColorV98;
            draft.dashboardCategoryHoverColorV85 = c.dashboardCategoryHoverBackgroundColorV98;
            return draft;
        };
    } catch {}

    try {
        const populateBeforeV98 = populateThemeBuilder;
        populateThemeBuilder = function(modal, theme = {}) {
            const result = populateBeforeV98(modal, theme);
            requestAnimationFrame(() => polishV98(modal, theme));
            return result;
        };
    } catch {}

    try {
        const previewBeforeV98 = updateThemeBuilderPreview;
        updateThemeBuilderPreview = function(modal) {
            const result = previewBeforeV98(modal);
            try { syncDashboardCategoryPreviewV98(modal); } catch {}
            return result;
        };
    } catch {}

    try {
        const dashboardPreviewBeforeV98 = renderDashboardPreviewV45;
        renderDashboardPreviewV45 = function(modal) {
            const result = dashboardPreviewBeforeV98(modal);
            try { syncDashboardCategoryPreviewV98(modal); } catch {}
            return result;
        };
    } catch {}

    window.__themeBuilderV98Polish = polishV98;
    requestAnimationFrame(() => {
        const modal = document.getElementById('theme-builder-modal');
        if (modal) {
            let theme = {};
            try { theme = getThemeBuilderDraft(modal); } catch {}
            polishV98(modal, theme);
        }
    });
})();

/* ============================================================
   THEME BUILDER / KNOWLEDGE BASE V99
   Knowledge Base Settings category-bar appearance controls
   ============================================================ */

const KB_SETTINGS_CATEGORY_STYLE_DEFAULTS_V99 = Object.freeze({
    normalBorder: '#171717',
    normalText: '#171717',
    hoverBorder: '#7c3aed',
    hoverText: '#171717',
    selectedBorder: '#171717',
    selectedText: '#171717',
    shadowSize: 0
});

function kbSettingsCategoryStyleV99() {
    if (!db.settings) db.settings = {};
    const saved = db.settings.knowledgeSettingsCategoryStyleV99 || {};
    db.settings.knowledgeSettingsCategoryStyleV99 = {
        ...KB_SETTINGS_CATEGORY_STYLE_DEFAULTS_V99,
        ...saved
    };
    return db.settings.knowledgeSettingsCategoryStyleV99;
}

function applyKnowledgeSettingsCategoryStyleV99() {
    const style = kbSettingsCategoryStyleV99();
    const root = document.documentElement;
    const px = Math.max(0, Math.min(12, Number(style.shadowSize) || 0));

    root.style.setProperty('--kb-settings-category-normal-border-v99', style.normalBorder);
    root.style.setProperty('--kb-settings-category-normal-text-v99', style.normalText);
    root.style.setProperty('--kb-settings-category-hover-border-v99', style.hoverBorder);
    root.style.setProperty('--kb-settings-category-hover-text-v99', style.hoverText);
    root.style.setProperty('--kb-settings-category-selected-border-v99', style.selectedBorder);
    root.style.setProperty('--kb-settings-category-selected-text-v99', style.selectedText);
    root.style.setProperty('--kb-settings-category-shadow-v99', `${px}px`);
}

function ensureKnowledgeSettingsCategoryStyleControlsV99() {
    const tabs = document.getElementById('settings-category-tabs');
    if (!tabs) return;

    const categorySection = tabs.closest('.modal-section');
    if (!categorySection) return;

    let section = document.getElementById('kb-settings-category-style-v99');
    if (!section) {
        section = document.createElement('div');
        section.id = 'kb-settings-category-style-v99';
        section.className = 'modal-section kb-settings-category-style-v99';
        section.innerHTML = `
            <div class="kb-settings-category-style-heading-v99">
                <div>
                    <strong>Category Bar Appearance</strong>
                    <small>Border-first styling for the category buttons in Knowledge Base Settings.</small>
                </div>
            </div>

            <div class="kb-settings-category-style-grid-v99">
                <label class="kb-settings-category-color-v99">
                    <span>Normal Border</span>
                    <span class="kb-settings-category-color-control-v99">
                        <input type="color" data-kb-settings-style-v99="normalBorder">
                        <input type="text" data-kb-settings-style-text-v99="normalBorder" maxlength="7" spellcheck="false">
                    </span>
                </label>

                <label class="kb-settings-category-color-v99">
                    <span>Normal Text</span>
                    <span class="kb-settings-category-color-control-v99">
                        <input type="color" data-kb-settings-style-v99="normalText">
                        <input type="text" data-kb-settings-style-text-v99="normalText" maxlength="7" spellcheck="false">
                    </span>
                </label>

                <label class="kb-settings-category-color-v99">
                    <span>Hover Border</span>
                    <span class="kb-settings-category-color-control-v99">
                        <input type="color" data-kb-settings-style-v99="hoverBorder">
                        <input type="text" data-kb-settings-style-text-v99="hoverBorder" maxlength="7" spellcheck="false">
                    </span>
                </label>

                <label class="kb-settings-category-color-v99">
                    <span>Hover Text</span>
                    <span class="kb-settings-category-color-control-v99">
                        <input type="color" data-kb-settings-style-v99="hoverText">
                        <input type="text" data-kb-settings-style-text-v99="hoverText" maxlength="7" spellcheck="false">
                    </span>
                </label>

                <label class="kb-settings-category-color-v99">
                    <span>Selected / Focused Border</span>
                    <span class="kb-settings-category-color-control-v99">
                        <input type="color" data-kb-settings-style-v99="selectedBorder">
                        <input type="text" data-kb-settings-style-text-v99="selectedBorder" maxlength="7" spellcheck="false">
                    </span>
                </label>

                <label class="kb-settings-category-color-v99">
                    <span>Selected / Focused Text</span>
                    <span class="kb-settings-category-color-control-v99">
                        <input type="color" data-kb-settings-style-v99="selectedText">
                        <input type="text" data-kb-settings-style-text-v99="selectedText" maxlength="7" spellcheck="false">
                    </span>
                </label>
            </div>

            <label class="kb-settings-category-shadow-row-v99">
                <span>
                    <strong>Shadow Size</strong>
                    <small>0 removes the shadow completely.</small>
                </span>
                <span class="kb-settings-category-shadow-control-v99">
                    <input type="range" min="0" max="12" step="1" data-kb-settings-shadow-v99>
                    <output data-kb-settings-shadow-output-v99>0px</output>
                </span>
            </label>
        `;

        categorySection.insertAdjacentElement('afterend', section);

        const validHex = value => /^#[0-9a-f]{6}$/i.test(String(value || '').trim());

        section.querySelectorAll('[data-kb-settings-style-v99]').forEach(colorInput => {
            const key = colorInput.dataset.kbSettingsStyleV99;
            const textInput = section.querySelector(`[data-kb-settings-style-text-v99="${key}"]`);

            const preview = value => {
                const style = kbSettingsCategoryStyleV99();
                style[key] = value;
                colorInput.value = value;
                if (textInput) textInput.value = value.toUpperCase();
                applyKnowledgeSettingsCategoryStyleV99();
            };

            colorInput.addEventListener('input', () => preview(colorInput.value));
            colorInput.addEventListener('change', () => {
                preview(colorInput.value);
                saveDb();
            });

            textInput?.addEventListener('input', () => {
                const value = textInput.value.trim();
                if (validHex(value)) preview(value);
            });
            textInput?.addEventListener('change', () => {
                const value = textInput.value.trim();
                if (validHex(value)) {
                    preview(value);
                    saveDb();
                } else {
                    const current = kbSettingsCategoryStyleV99()[key];
                    textInput.value = String(current).toUpperCase();
                }
            });
        });

        const shadow = section.querySelector('[data-kb-settings-shadow-v99]');
        const output = section.querySelector('[data-kb-settings-shadow-output-v99]');
        shadow?.addEventListener('input', () => {
            const value = Math.max(0, Math.min(12, Number(shadow.value) || 0));
            kbSettingsCategoryStyleV99().shadowSize = value;
            if (output) output.textContent = `${value}px`;
            applyKnowledgeSettingsCategoryStyleV99();
        });
        shadow?.addEventListener('change', () => saveDb());
    }

    const style = kbSettingsCategoryStyleV99();
    section.querySelectorAll('[data-kb-settings-style-v99]').forEach(colorInput => {
        const key = colorInput.dataset.kbSettingsStyleV99;
        const value = style[key] || KB_SETTINGS_CATEGORY_STYLE_DEFAULTS_V99[key];
        colorInput.value = value;
        const textInput = section.querySelector(`[data-kb-settings-style-text-v99="${key}"]`);
        if (textInput) textInput.value = String(value).toUpperCase();
    });

    const shadow = section.querySelector('[data-kb-settings-shadow-v99]');
    const output = section.querySelector('[data-kb-settings-shadow-output-v99]');
    if (shadow) shadow.value = String(style.shadowSize ?? 0);
    if (output) output.textContent = `${style.shadowSize ?? 0}px`;

    applyKnowledgeSettingsCategoryStyleV99();
}

const renderSettingsBeforeV99 = renderSettings;
renderSettings = function renderSettingsV99(...args) {
    const result = renderSettingsBeforeV99.apply(this, args);
    ensureKnowledgeSettingsCategoryStyleControlsV99();
    applyKnowledgeSettingsCategoryStyleV99();
    return result;
};

applyKnowledgeSettingsCategoryStyleV99();
requestAnimationFrame(() => {
    if (document.getElementById('settings-category-tabs')) {
        ensureKnowledgeSettingsCategoryStyleControlsV99();
    }
});

/* ============================================================
   THEME BUILDER V100 — EDIT-FREEZE GUARD + BUILT-IN DECORATIONS
   ============================================================ */
(function () {
    // --------------------------------------------------------
    // 1) Break the V98 dashboard-category draft recursion.
    // Some V98 color helpers fall back to getThemeBuilderDraft() while
    // getThemeBuilderDraft() itself is calculating those same fields. When
    // Edit Theme opens before every dashboard control exists, that can recurse
    // indefinitely and lock the browser. Nested reads now return the last
    // stable draft instead of entering the full getter chain again.
    // --------------------------------------------------------
    try {
        const getThemeBuilderDraftBeforeV100 = getThemeBuilderDraft;
        getThemeBuilderDraft = function getThemeBuilderDraftV100(modal) {
            if (modal?._themeDraftReadActiveV100) {
                const stable = modal._themeLastStableDraftV100 || {};
                return {
                    ...stable,
                    backgroundSvgs: Array.isArray(modal?._themeBackgroundSvgs)
                        ? modal._themeBackgroundSvgs.map(asset => ({ ...asset }))
                        : (Array.isArray(stable.backgroundSvgs)
                            ? stable.backgroundSvgs.map(asset => ({ ...asset }))
                            : [])
                };
            }

            if (modal) modal._themeDraftReadActiveV100 = true;
            try {
                const draft = getThemeBuilderDraftBeforeV100(modal) || {};
                if (modal) modal._themeLastStableDraftV100 = { ...draft };
                return draft;
            } finally {
                if (modal) modal._themeDraftReadActiveV100 = false;
            }
        };
    } catch {}

    // Keep accidental nested preview rebuilds from multiplying during Theme
    // Builder initialization. If something requests another preview while one
    // is already rendering, collapse those requests into one next-frame pass.
    try {
        const updateThemeBuilderPreviewBeforeV100 = updateThemeBuilderPreview;
        updateThemeBuilderPreview = function updateThemeBuilderPreviewV100(modal) {
            if (!modal) return updateThemeBuilderPreviewBeforeV100(modal);

            if (modal._themePreviewUpdatingV100) {
                modal._themePreviewQueuedV100 = true;
                return;
            }

            modal._themePreviewUpdatingV100 = true;
            let result;
            try {
                result = updateThemeBuilderPreviewBeforeV100(modal);
            } finally {
                modal._themePreviewUpdatingV100 = false;
                if (modal._themePreviewQueuedV100) {
                    modal._themePreviewQueuedV100 = false;
                    cancelAnimationFrame(modal._themePreviewQueuedRafV100 || 0);
                    modal._themePreviewQueuedRafV100 = requestAnimationFrame(() => {
                        if (!modal.isConnected || modal.classList.contains('hidden')) return;
                        try { updateThemeBuilderPreview(modal); } catch {}
                    });
                }
            }
            return result;
        };
    } catch {}

    // --------------------------------------------------------
    // 2) Built-in themes: collect ALL image decorations, not only SVG.
    // Earlier built-in hydration only recognized SVG URLs, so themes whose
    // decorations are PNG/JPG/WebP/GIF/AVIF looked empty in Decorations even
    // though their art was visibly mounted by the built-in theme runtime.
    // --------------------------------------------------------
    const IMAGE_EXT_V100 = /\.(?:svg|png|jpe?g|webp|gif|avif)(?:$|[?#])/i;

    function normalizeBuiltInAssetUrlV100(raw, themeName = '') {
        const value = String(raw || '').trim();
        if (!value || value.startsWith('data:') || value.startsWith('blob:')) return '';

        try {
            const base = themeName
                ? new URL(`/themes/${encodeURIComponent(themeName)}/theme-${encodeURIComponent(themeName)}.js`, location.origin)
                : location.href;
            const resolved = new URL(value, base);
            if (resolved.origin === location.origin) {
                return resolved.pathname + resolved.search + resolved.hash;
            }
            return resolved.href;
        } catch {
            return value;
        }
    }

    function makeBuiltInDecorationV100(rawUrl, nameHint = '', themeName = '') {
        const url = normalizeBuiltInAssetUrlV100(rawUrl, themeName);
        if (!url || !IMAGE_EXT_V100.test(url)) return null;
        return {
            name: nameHint || (() => {
                try { return themeAssetFileNameV30(url, 'Built-in Decoration'); }
                catch { return String(url).split('/').pop() || 'Built-in Decoration'; }
            })(),
            url,
            animation: 'float',
            introBop: true,
            hoverSoundUrl: '',
            inheritedBuiltInV30: true,
            inheritedBuiltInV100: true
        };
    }

    try {
        const collectRuntimeAssetsBeforeV100 = collectRuntimeSvgAssetsV30;
        collectRuntimeSvgAssetsV30 = function collectRuntimeImageAssetsV100(roots) {
            const assets = [];
            try {
                const old = collectRuntimeAssetsBeforeV100(roots);
                if (Array.isArray(old)) assets.push(...old);
            } catch {}

            (roots || []).forEach(root => {
                if (!root?.querySelectorAll) return;

                root.querySelectorAll('img[src], object[data], image[href], image[xlink\\:href]').forEach(element => {
                    const source =
                        element.getAttribute('src') ||
                        element.getAttribute('data') ||
                        element.getAttribute('href') ||
                        element.getAttribute('xlink:href') ||
                        '';
                    if (!IMAGE_EXT_V100.test(source)) return;

                    const asset = makeBuiltInDecorationV100(
                        source,
                        element.getAttribute('alt') || element.getAttribute('aria-label') || ''
                    );
                    if (asset) assets.push(asset);
                });
            });

            try { return uniqueThemeAssetsV30(assets); }
            catch {
                const seen = new Set();
                return assets.filter(asset => {
                    const key = String(asset?.url || asset?.markup || asset?.name || '');
                    if (!key || seen.has(key)) return false;
                    seen.add(key);
                    return true;
                });
            }
        };
    } catch {}

    try {
        const analyzeThemeSourceBeforeV100 = analyzeThemeSourceV30;
        analyzeThemeSourceV30 = function analyzeThemeImageSourceV100(themeId, source) {
            let info = {};
            try { info = analyzeThemeSourceBeforeV100(themeId, source) || {}; } catch {}

            const themeName = (() => {
                try { return getBuiltInThemeNameV30(themeId) || ''; }
                catch { return ''; }
            })();
            const jsText = String(source?.js || '');
            const cssText = String(source?.css || '');
            const allText = `${jsText}\n${cssText}`;
            const assets = Array.isArray(info.svgAssets) ? [...info.svgAssets] : [];

            // Exact quoted paths: /svg/..., /images/..., ../assets/..., etc.
            const quoted = /["'`]([^"'`\n\r]+?\.(?:svg|png|jpe?g|webp|gif|avif)(?:\?[^"'`\n\r]*)?)["'`]/gi;
            let match;
            while ((match = quoted.exec(allText))) {
                const raw = String(match[1] || '').trim();
                if (!raw) continue;

                let url = raw;
                // Preserve the legacy convention used by many theme ASSETS
                // arrays where only a bare filename is stored in JS.
                if (!/[\\/]/.test(raw) && themeName) {
                    url = `/svg/theme-${encodeURIComponent(themeName)}/${raw}`;
                }

                const asset = makeBuiltInDecorationV100(url, '', themeName);
                if (asset) assets.push(asset);
            }

            // CSS url(...) references are not always quoted.
            const cssUrl = /url\(\s*(["']?)([^)"']+?\.(?:svg|png|jpe?g|webp|gif|avif)(?:\?[^)"']*)?)\1\s*\)/gi;
            while ((match = cssUrl.exec(cssText))) {
                const asset = makeBuiltInDecorationV100(match[2], '', themeName);
                if (asset) assets.push(asset);
            }

            try { info.svgAssets = uniqueThemeAssetsV30(assets); }
            catch { info.svgAssets = assets; }
            return info;
        };
    } catch {}

    // Older/custom theme records occasionally used a different artwork key.
    // Normalize those into backgroundSvgs before the existing builder chain
    // runs, without touching themes that already have backgroundSvgs.
    try {
        const populateThemeBuilderBeforeV100 = populateThemeBuilder;
        populateThemeBuilder = function populateThemeBuilderV100(modal, theme = {}) {
            let normalized = theme || {};
            const existing = Array.isArray(normalized.backgroundSvgs)
                ? normalized.backgroundSvgs
                : [];

            if (!existing.length) {
                const alternates = [
                    normalized.decorations,
                    normalized.images,
                    normalized.svgs,
                    normalized.artwork,
                    normalized.floatingImages
                ];
                const found = alternates.find(Array.isArray);
                if (found?.length) {
                    normalized = {
                        ...normalized,
                        backgroundSvgs: found.map(asset =>
                            typeof asset === 'string'
                                ? makeBuiltInDecorationV100(asset) || { name: 'Decoration', url: asset }
                                : { ...asset }
                        )
                    };
                }
            }

            return populateThemeBuilderBeforeV100(modal, normalized);
        };
    } catch {}

    // After built-in hydration finishes, force one authoritative gallery pass
    // so the Decorations tab immediately reflects the inherited asset list.
    try {
        const hydrateBuiltInThemeEditorBeforeV100 = hydrateBuiltInThemeEditorV30;
        hydrateBuiltInThemeEditorV30 = async function hydrateBuiltInThemeEditorV100(modal, themeId, themeName) {
            const result = await hydrateBuiltInThemeEditorBeforeV100(modal, themeId, themeName);

            if (!modal || !isBuiltInThemeIdV30(themeId)) return result;

            // If the hydrated list exists, make it the source of truth for the
            // gallery. V62/V96 will hydrate thumbnails on the next paint.
            if (Array.isArray(modal._themeBackgroundSvgs) && modal._themeBackgroundSvgs.length) {
                modal._themeImagePagingKeyV62 = String(themeId || themeName || 'built-in');
                modal._themeImageRenderLimitV62 = Math.max(
                    Number(modal._themeImageRenderLimitV62) || 0,
                    Math.min(24, modal._themeBackgroundSvgs.length)
                );
                try { renderThemeBuilderSvgListV2(modal); } catch {}
            }

            return result;
        };
    } catch {}
})();

// ============================================================
// V101 — OPENING THEME BUILDER MUST NOT RESTART INTRO AUDIO
// ============================================================
(function () {
    const inDashboardStudio = (() => {
        try {
            if (typeof isDashboardThemeStudioV43 === 'function') {
                return !!isDashboardThemeStudioV43();
            }
        } catch {}
        try {
            return new URLSearchParams(window.location.search).get('dashboardThemeStudio') === '1';
        } catch {
            return false;
        }
    })();

    // Dashboard Theme Studio runs inside a same-origin log-page iframe. During
    // boot/edit hydration that iframe can temporarily mount a real theme, whose
    // intro audio would otherwise start from 0 and sound like the Dashboard's
    // already-playing song had reset. Silence ONLY audio created/started by
    // that automatic inspection. Audio created later by manual auditions or hover
    // auditions, etc. is untouched.
    if (inDashboardStudio && !window.__themeStudioAudioGuardV101) {
        window.__themeStudioAudioGuardV101 = true;

        const blockedMedia = new WeakSet();
        const NativeAudio = window.Audio;
        const nativePlay = HTMLMediaElement.prototype.play;
        let silentDepth = 0;
        let bootSilent = true;

        const isSilent = () => bootSilent || silentDepth > 0;

        if (typeof NativeAudio === 'function') {
            function ThemeStudioAudioV101(...args) {
                const audio = new NativeAudio(...args);
                if (isSilent()) blockedMedia.add(audio);
                return audio;
            }

            try { Object.setPrototypeOf(ThemeStudioAudioV101, NativeAudio); } catch {}
            ThemeStudioAudioV101.prototype = NativeAudio.prototype;
            window.Audio = ThemeStudioAudioV101;
        }

        HTMLMediaElement.prototype.play = function (...args) {
            if (isSilent() || blockedMedia.has(this)) {
                blockedMedia.add(this);
                try { this.pause(); } catch {}
                return Promise.resolve();
            }
            return nativePlay.apply(this, args);
        };

        const beginSilentInspection = () => {
            silentDepth += 1;
        };

        const endSilentInspection = () => {
            silentDepth = Math.max(0, silentDepth - 1);
            if (silentDepth === 0) {
                // The modal is now ready. Future user-created audio objects
                // (manual audio / hover-sound auditions) are allowed to play.
                bootSilent = false;
            }
        };

        function wrapSync(name) {
            try {
                const before = window[name] || eval(name);
                if (typeof before !== 'function') return;
                const wrapped = function (...args) {
                    beginSilentInspection();
                    try {
                        return before.apply(this, args);
                    } finally {
                        setTimeout(endSilentInspection, 0);
                    }
                };
                try { window[name] = wrapped; } catch {}
                try { eval(`${name} = wrapped`); } catch {}
            } catch {}
        }

        function wrapAsync(name) {
            try {
                const before = window[name] || eval(name);
                if (typeof before !== 'function') return;
                const wrapped = async function (...args) {
                    beginSilentInspection();
                    try {
                        return await before.apply(this, args);
                    } finally {
                        endSilentInspection();
                    }
                };
                try { window[name] = wrapped; } catch {}
                try { eval(`${name} = wrapped`); } catch {}
            } catch {}
        }

        wrapSync('openNewThemeBuilderCleanV34');
        wrapSync('openExistingCustomThemeFromPickerV7');
        wrapAsync('openAnyThemeInBuilderV25');
        wrapAsync('openThemeCopyInBuilderV30');
        wrapAsync('openDashboardSharedThemeInStudioV43');

        // Failsafe for Create mode or any legacy opener that does not pass
        // through one of the wrappers above.
        const releaseWhenReady = () => {
            const modal = document.getElementById('theme-builder-modal');
            if (modal && !modal.classList.contains('hidden')) {
                bootSilent = false;
                return;
            }
            setTimeout(releaseWhenReady, 80);
        };
        setTimeout(releaseWhenReady, 0);
    }

    // On a normal log page, Edit Theme used to call applyTheme() even when the
    // theme being edited was already the active theme. That unnecessary remount
    // restarted its intro song. Skip exactly that one inspection-time reapply;
    // the current theme is already mounted and its computed styles are available.
    if (!inDashboardStudio) {
        try {
            const openAnyThemeInBuilderBeforeV101 = openAnyThemeInBuilderV25;
            openAnyThemeInBuilderV25 = async function (themeId, themeName) {
                const activeTheme = String(db?.settings?.theme || 'default');
                const requestedTheme = String(themeId || 'default');

                if (requestedTheme !== activeTheme) {
                    return openAnyThemeInBuilderBeforeV101.apply(this, arguments);
                }

                const realApplyTheme = applyTheme;
                let skippedInspectionReapply = false;

                applyTheme = async function (value, opts = {}) {
                    if (
                        !skippedInspectionReapply &&
                        String(value || 'default') === activeTheme &&
                        opts?.persist === false
                    ) {
                        skippedInspectionReapply = true;
                        return;
                    }
                    return realApplyTheme.apply(this, arguments);
                };

                try {
                    return await openAnyThemeInBuilderBeforeV101.call(this, themeId, themeName);
                } finally {
                    applyTheme = realApplyTheme;
                }
            };
        } catch {}
    }
})();

// ============================================================

// ============================================================
// V457 — SMART PLACEHOLDER PRACTICE: TWO REAL ANSWER MODES
// ============================================================
(function(){
    function shuffleV457(list){
        const out = [...list];
        for(let i = out.length - 1; i > 0; i--){
            const j = Math.floor(Math.random() * (i + 1));
            [out[i], out[j]] = [out[j], out[i]];
        }
        return out;
    }

    function learnedNonPatternItemsV457(){
        const patternIds = new Set(knowledgePatternItemsV56());
        return Array.from(new Set(getAllLoggedItemIdsV58()))
            .filter(id => !patternIds.has(id))
            .filter(id => !String(id).includes('\\'))
            .filter(id => !!db.phrase_meta?.[id])
            .filter(id => !isHiddenFromQuizzesV59(id))
            .sort((a,b) => String(a).localeCompare(String(b)));
    }

    function answerablePatternsV457(items){
        return learnedPlaceholderPatternsV59().filter(patternId => {
            const slots = placeholderSegmentsV56(patternId).filter(seg => seg.type === 'slot');
            return slots.length && slots.every(slot =>
                items.some(itemId => placeholderRequirementMatchesItemV58(slot.name, itemId))
            );
        });
    }

    function randomFromV457(list){
        return list.length ? list[Math.floor(Math.random() * list.length)] : null;
    }

    function buildChoiceQuestionV457(patterns, items){
        const possible = [];
        patterns.forEach(patternId => {
            const segments = placeholderSegmentsV56(patternId);
            segments.filter(seg => seg.type === 'slot').forEach(slot => {
                const correct = items.filter(id => placeholderRequirementMatchesItemV58(slot.name, id));
                const wrong = items.filter(id => !placeholderRequirementMatchesItemV58(slot.name, id));
                if(correct.length && wrong.length >= 3){
                    possible.push({ patternId, segments, slot, correct, wrong });
                }
            });
        });
        const picked = randomFromV457(possible);
        if(!picked) return null;
        const correctId = randomFromV457(picked.correct);
        const distractors = shuffleV457(picked.wrong).slice(0,3);
        return {
            ...picked,
            correctId,
            choices: shuffleV457([correctId, ...distractors]),
            selectedId: ''
        };
    }

    function smartFeedbackV457(body, message, state){
        const feedback = body.querySelector('.smart-practice-feedback-v457');
        if(!feedback) return;
        feedback.classList.remove('correct','wrong','neutral');
        feedback.classList.add(state || 'neutral');
        feedback.textContent = message || '';
    }

    function itemButtonV457(id, dataAttr){
        return `<button type="button" class="sentence-builder-kb-result-v56 smart-practice-item-v457" draggable="true" ${dataAttr}="${escapeKnowledgeAttr(id)}"><span>${placeholderTokenHtmlV56(id)}</span><i class="ph ph-dots-six-vertical"></i></button>`;
    }

    openSmartPlaceholderPracticeV59 = function(){
        const allItems = learnedNonPatternItemsV457();
        const patterns = answerablePatternsV457(allItems);
        const modal = createPracticeModalV59('smart-placeholder-practice-modal-v59', 'Smart Placeholder Practice');
        const body = modal.querySelector('.quiz-practice-body-v59');

        if(!allItems.length){
            body.innerHTML = '<div class="quiz-settings-empty-v58">No learned non-pattern Knowledge Base items are available yet.</div>';
            return;
        }
        if(!patterns.length){
            body.innerHTML = '<div class="quiz-settings-empty-v58">No learned placeholder pattern currently has a learned item that can correctly fill every placeholder.</div>';
            return;
        }

        let mode = 'all';
        let currentPattern = randomFromV457(patterns);
        let values = {};
        let choiceQuestion = null;

        const newAllPattern = () => {
            currentPattern = randomFromV457(patterns);
            values = {};
        };
        const newChoiceQuestion = () => {
            choiceQuestion = buildChoiceQuestionV457(patterns, allItems);
        };

        function renderModeBarV457(){
            return `
                <div class="smart-practice-mode-switch-v457" role="tablist" aria-label="Smart Placeholder Practice mode">
                    <button type="button" class="smart-practice-mode-v457 ${mode === 'all' ? 'active' : ''}" data-smart-mode-v457="all">All Learned Items</button>
                    <button type="button" class="smart-practice-mode-v457 ${mode === 'choices' ? 'active' : ''}" data-smart-mode-v457="choices">4 Choices</button>
                </div>`;
        }

        function bindModeBarV457(){
            body.querySelectorAll('[data-smart-mode-v457]').forEach(button => {
                button.addEventListener('click', () => {
                    const next = button.dataset.smartModeV457;
                    if(next === mode) return;
                    mode = next;
                    if(mode === 'all') newAllPattern();
                    else newChoiceQuestion();
                    render();
                });
            });
        }

        function renderAllModeV457(){
            const segments = placeholderSegmentsV56(currentPattern);
            const slots = segments.filter(seg => seg.type === 'slot');
            body.innerHTML = `
                ${renderModeBarV457()}
                <div class="smart-practice-mode-help-v457">Search by learned item name, then decide for yourself which item actually fits each placeholder.</div>
                <div class="quiz-practice-toolbar-v59">
                    <strong>${placeholderTokenHtmlV56(currentPattern)}</strong>
                    <button type="button" class="small-icon-btn smart-next-pattern-v59" title="New pattern"><i class="ph ph-shuffle"></i></button>
                </div>
                <div class="sentence-builder-canvas-v56 smart-practice-canvas-v59">
                    ${segments.map(seg => seg.type === 'text'
                        ? `<span class="sentence-builder-literal-v56">${escapeKnowledgeHtml(seg.text)}</span>`
                        : `<div class="sentence-builder-slot-v56 ${values[seg.slotIndex] ? 'filled' : ''}" data-smart-slot-v457="${seg.slotIndex}" data-smart-name-v457="${escapeKnowledgeAttr(seg.name)}">
                            <span class="sentence-builder-slot-label-v56">${escapeKnowledgeHtml(seg.name.toUpperCase())}</span>
                            <div class="sentence-builder-slot-value-v56">${values[seg.slotIndex] ? `<strong>${escapeKnowledgeHtml(values[seg.slotIndex])}</strong>` : '<span>Drop an item here</span>'}</div>
                        </div>`).join('')}
                </div>
                <div class="sentence-builder-search-v56"><i class="ph ph-magnifying-glass"></i><input class="smart-practice-search-v457" placeholder="Search learned items…" autocomplete="off"></div>
                <div class="sentence-builder-kb-results-v56 smart-practice-bank-v457"></div>
                <div class="smart-practice-feedback-v457 neutral" aria-live="polite"></div>
                <div class="quiz-generated-actions-v58"><button type="button" class="icon-btn smart-practice-check-v457">Check Answer</button></div>`;

            bindModeBarV457();
            const search = body.querySelector('.smart-practice-search-v457');
            const bank = body.querySelector('.smart-practice-bank-v457');
            const drawBank = () => {
                const q = String(search.value || '').trim().toLowerCase();
                // Deliberately title-only: tags and metadata cannot be used to reveal the placeholder type.
                const filtered = allItems.filter(id => !q || String(id).toLowerCase().includes(q));
                bank.innerHTML = filtered.length
                    ? filtered.map(id => itemButtonV457(id, 'data-smart-item-v457')).join('')
                    : '<div class="sentence-pattern-no-results-v55">No learned items match that name.</div>';
                bank.querySelectorAll('[data-smart-item-v457]').forEach(btn => {
                    btn.addEventListener('dragstart', event => {
                        event.dataTransfer.effectAllowed = 'copy';
                        event.dataTransfer.setData('text/smart-v457', btn.dataset.smartItemV457);
                    });
                });
            };
            search.addEventListener('input', drawBank);
            drawBank();

            body.querySelectorAll('[data-smart-slot-v457]').forEach(slot => {
                slot.addEventListener('dragover', event => {
                    if(!event.dataTransfer.types.includes('text/smart-v457')) return;
                    event.preventDefault();
                    slot.classList.add('drop-ready');
                });
                slot.addEventListener('dragleave', () => slot.classList.remove('drop-ready'));
                slot.addEventListener('drop', event => {
                    const itemId = event.dataTransfer.getData('text/smart-v457');
                    if(!itemId) return;
                    event.preventDefault();
                    slot.classList.remove('drop-ready');
                    values[Number(slot.dataset.smartSlotV457)] = itemId;
                    render();
                });
            });

            body.querySelector('.smart-next-pattern-v59')?.addEventListener('click', () => {
                newAllPattern();
                render();
            });
            body.querySelector('.smart-practice-check-v457')?.addEventListener('click', () => {
                const missing = slots.filter(slot => !values[slot.slotIndex]);
                if(missing.length){
                    smartFeedbackV457(body, 'Fill every placeholder first.', 'neutral');
                    return;
                }
                const wrong = [];
                slots.forEach(slot => {
                    const el = body.querySelector(`[data-smart-slot-v457="${slot.slotIndex}"]`);
                    const itemId = values[slot.slotIndex];
                    const ok = placeholderRequirementMatchesItemV58(slot.name, itemId);
                    el?.classList.toggle('answer-correct-v457', ok);
                    el?.classList.toggle('answer-wrong-v457', !ok);
                    if(!ok) wrong.push({slot, itemId});
                });
                if(!wrong.length){
                    smartFeedbackV457(body, 'Correct! Every item matches its placeholder.', 'correct');
                }else if(wrong.length === 1){
                    smartFeedbackV457(body, `Incorrect. “${wrong[0].itemId}” does not match ${wrong[0].slot.name.toUpperCase()}.`, 'wrong');
                }else{
                    smartFeedbackV457(body, `Incorrect. ${wrong.length} choices do not match their placeholders.`, 'wrong');
                }
            });
        }

        function renderChoiceModeV457(){
            if(!choiceQuestion) newChoiceQuestion();
            if(!choiceQuestion){
                body.innerHTML = `
                    ${renderModeBarV457()}
                    <div class="quiz-settings-empty-v58">4 Choices needs at least one learned item that matches a placeholder and three learned non-matching items. Add a few more learned items, then try again.</div>`;
                bindModeBarV457();
                return;
            }

            const q = choiceQuestion;
            const targetIndex = q.slot.slotIndex;
            body.innerHTML = `
                ${renderModeBarV457()}
                <div class="smart-practice-mode-help-v457">Choose which learned item correctly fits <strong>${escapeKnowledgeHtml(q.slot.name.toUpperCase())}</strong>. Patterns are never used as answer choices.</div>
                <div class="quiz-practice-toolbar-v59">
                    <strong>${placeholderTokenHtmlV56(q.patternId)}</strong>
                    <button type="button" class="small-icon-btn smart-next-choice-v457" title="New question"><i class="ph ph-shuffle"></i></button>
                </div>
                <div class="sentence-builder-canvas-v56 smart-practice-canvas-v59 smart-choice-canvas-v457">
                    ${q.segments.map(seg => {
                        if(seg.type === 'text') return `<span class="sentence-builder-literal-v56">${escapeKnowledgeHtml(seg.text)}</span>`;
                        if(seg.slotIndex !== targetIndex) return `<div class="sentence-builder-slot-v56 smart-choice-passive-slot-v457"><span class="sentence-builder-slot-label-v56">${escapeKnowledgeHtml(seg.name.toUpperCase())}</span></div>`;
                        return `<div class="sentence-builder-slot-v56 smart-choice-target-v457 ${q.selectedId ? 'filled' : ''}" data-smart-choice-slot-v457="true">
                            <span class="sentence-builder-slot-label-v56">${escapeKnowledgeHtml(seg.name.toUpperCase())}</span>
                            <div class="sentence-builder-slot-value-v56">${q.selectedId ? `<strong>${escapeKnowledgeHtml(q.selectedId)}</strong>` : '<span>Drag one answer here</span>'}</div>
                        </div>`;
                    }).join('')}
                </div>
                <div class="smart-choice-bank-v457">
                    ${q.choices.map(id => itemButtonV457(id, 'data-smart-choice-v457')).join('')}
                </div>
                <div class="smart-practice-feedback-v457 neutral" aria-live="polite"></div>
                <div class="quiz-generated-actions-v58"><button type="button" class="icon-btn smart-choice-check-v457">Check Answer</button></div>`;

            bindModeBarV457();
            const target = body.querySelector('[data-smart-choice-slot-v457]');
            body.querySelectorAll('[data-smart-choice-v457]').forEach(btn => {
                btn.addEventListener('dragstart', event => {
                    event.dataTransfer.effectAllowed = 'copy';
                    event.dataTransfer.setData('text/smart-choice-v457', btn.dataset.smartChoiceV457);
                });
                // Clicking is an accessibility/fallback equivalent to dragging.
                btn.addEventListener('click', () => {
                    q.selectedId = btn.dataset.smartChoiceV457;
                    render();
                });
            });
            target?.addEventListener('dragover', event => {
                if(!event.dataTransfer.types.includes('text/smart-choice-v457')) return;
                event.preventDefault();
                target.classList.add('drop-ready');
            });
            target?.addEventListener('dragleave', () => target.classList.remove('drop-ready'));
            target?.addEventListener('drop', event => {
                const itemId = event.dataTransfer.getData('text/smart-choice-v457');
                if(!itemId) return;
                event.preventDefault();
                q.selectedId = itemId;
                render();
            });
            body.querySelector('.smart-next-choice-v457')?.addEventListener('click', () => {
                newChoiceQuestion();
                render();
            });
            body.querySelector('.smart-choice-check-v457')?.addEventListener('click', () => {
                if(!q.selectedId){
                    smartFeedbackV457(body, 'Choose one answer first.', 'neutral');
                    return;
                }
                const ok = placeholderRequirementMatchesItemV58(q.slot.name, q.selectedId);
                target?.classList.toggle('answer-correct-v457', ok);
                target?.classList.toggle('answer-wrong-v457', !ok);
                if(ok){
                    smartFeedbackV457(body, `Correct! “${q.selectedId}” matches ${q.slot.name.toUpperCase()}.`, 'correct');
                }else{
                    smartFeedbackV457(body, `Incorrect. “${q.selectedId}” does not match ${q.slot.name.toUpperCase()}.`, 'wrong');
                }
            });
        }

        function render(){
            if(mode === 'choices') renderChoiceModeV457();
            else renderAllModeV457();
        }

        render();
    };

    // Keep the practice-card copy accurate for the new two-mode behavior.
    const renderQuizExtraPracticeSectionsBeforeV457 = renderQuizExtraPracticeSectionsV59;
    renderQuizExtraPracticeSectionsV59 = function(){
        const result = renderQuizExtraPracticeSectionsBeforeV457();
        const card = document.querySelector('.open-smart-practice-v59')?.closest('.quiz-extra-practice-card-v59');
        const small = card?.querySelector('small');
        if(small) small.textContent = 'Practice placeholder patterns using all learned items or a four-choice challenge.';
        return result;
    };
})();

// ============================================================
// V460 — ENSURE SMART PLACEHOLDER PRACTICE BUTTON USES V457 TWO-MODE UI
// ============================================================
(function(){
    function bindTwoModeSmartPracticeButtonV460(){
        document.querySelectorAll('.open-smart-practice-v59').forEach(oldButton => {
            if(oldButton.dataset.smartTwoModeBoundV460 === '1') return;

            // The original V59 renderer bound the old one-mode function directly
            // with addEventListener. Cloning removes that stale listener so the
            // button can reliably open the current two-mode implementation.
            const button = oldButton.cloneNode(true);
            button.dataset.smartTwoModeBoundV460 = '1';
            oldButton.replaceWith(button);
            button.addEventListener('click', event => {
                event.preventDefault();
                event.stopPropagation();
                openSmartPlaceholderPracticeV59();
            });

            const card = button.closest('.quiz-extra-practice-card-v59');
            const small = card?.querySelector('small');
            if(small){
                small.textContent = 'Practice placeholder patterns using all learned items or a four-choice challenge.';
            }
        });
    }

    // Future quiz UI refreshes must also discard the stale V59 listener.
    const renderQuizExtraPracticeSectionsBeforeV460 = renderQuizExtraPracticeSectionsV59;
    renderQuizExtraPracticeSectionsV59 = function(){
        const result = renderQuizExtraPracticeSectionsBeforeV460.apply(this, arguments);
        bindTwoModeSmartPracticeButtonV460();
        return result;
    };

    // Fix any Smart Practice card that was rendered before the V457/V460 patches loaded.
    bindTwoModeSmartPracticeButtonV460();
    if(document.readyState === 'loading'){
        document.addEventListener('DOMContentLoaded', bindTwoModeSmartPracticeButtonV460, { once: true });
    }else{
        requestAnimationFrame(bindTwoModeSmartPracticeButtonV460);
    }
})();

// ============================================================
// V468 — SMART PLACEHOLDER PRACTICE REWRITE
// Completely replaces the legacy practice entry point/UI.
// ============================================================
(() => {
  'use strict';

  function spShuffleV468(list){
    const out=[...list];
    for(let i=out.length-1;i>0;i--){
      const j=Math.floor(Math.random()*(i+1));
      [out[i],out[j]]=[out[j],out[i]];
    }
    return out;
  }
  function spPickV468(list){ return list.length ? list[Math.floor(Math.random()*list.length)] : null; }
  function spLearnedItemsV468(){
    const patterns=new Set(knowledgePatternItemsV56());
    return Array.from(new Set(getAllLoggedItemIdsV58()))
      .filter(id=>!patterns.has(id))
      .filter(id=>!!db.phrase_meta?.[id])
      .sort((a,b)=>String(a).localeCompare(String(b)));
  }
  function spPatternsV468(){
    return learnedPlaceholderPatternsV59().filter(id=>placeholderSegmentsV56(id).some(seg=>seg.type==='slot'));
  }
  function spAnswerButtonV468(id, attr){
    return `<button type="button" class="sentence-builder-kb-result-v56 smart-practice-answer-v468" draggable="true" ${attr}="${escapeKnowledgeAttr(id)}"><span>${placeholderTokenHtmlV56(id)}</span><i class="ph ph-dots-six-vertical"></i></button>`;
  }
  function spSetFeedbackV468(body,text,state='neutral'){
    const el=body.querySelector('.smart-practice-feedback-v468');
    if(!el)return;
    el.className=`smart-practice-feedback-v468 ${state}`;
    el.textContent=text||'';
  }
  function spBuildChoiceV468(patterns,items){
    const possible=[];
    patterns.forEach(patternId=>{
      const segments=placeholderSegmentsV56(patternId);
      segments.filter(seg=>seg.type==='slot').forEach(slot=>{
        const correct=items.filter(id=>placeholderRequirementMatchesItemV58(slot.name,id));
        const wrong=items.filter(id=>!placeholderRequirementMatchesItemV58(slot.name,id));
        if(correct.length && wrong.length>=3) possible.push({patternId,segments,slot,correct,wrong});
      });
    });
    const base=spPickV468(possible);
    if(!base)return null;
    const correctId=spPickV468(base.correct);
    const choices=spShuffleV468([correctId,...spShuffleV468(base.wrong).slice(0,3)]);
    return {...base,correctId,choices,selectedId:''};
  }

  function openSmartPlaceholderPracticeV468(){
    document.getElementById('smart-placeholder-practice-modal-v59')?.remove();
    document.getElementById('smart-placeholder-practice-modal-v468')?.remove();

    const modal=createPracticeModalV59('smart-placeholder-practice-modal-v468','Smart Placeholder Practice');
    const body=modal.querySelector('.quiz-practice-body-v59');
    const allItems=spLearnedItemsV468();
    const patterns=spPatternsV468();
    let mode='';
    let allPattern=null;
    let allValues={};
    let choice=null;

    const showModeChooser=()=>{
      mode='';
      body.innerHTML=`
        <div class="smart-practice-chooser-v468">
          <p class="smart-practice-chooser-intro-v468">Choose how you want to practice.</p>
          <div class="smart-practice-mode-cards-v468">
            <button type="button" class="smart-practice-mode-card-v468" data-mode-v468="all">
              <strong>All Learned Items</strong>
              <span>Search all learned non-pattern items and decide what fits each placeholder yourself.</span>
            </button>
            <button type="button" class="smart-practice-mode-card-v468" data-mode-v468="choices">
              <strong>4 Choices</strong>
              <span>Choose the one learned item that correctly fits the active placeholder.</span>
            </button>
          </div>
        </div>`;
      body.querySelectorAll('[data-mode-v468]').forEach(btn=>btn.addEventListener('click',()=>{
        mode=btn.dataset.modeV468;
        if(mode==='all') startAllMode(); else startChoiceMode();
      }));
    };

    const modeHeader=(title,subtitle)=>`
      <div class="smart-practice-mode-header-v468">
        <button type="button" class="small-icon-btn smart-practice-back-v468" title="Choose another mode"><i class="ph ph-arrow-left"></i></button>
        <div><strong>${escapeKnowledgeHtml(title)}</strong><small>${escapeKnowledgeHtml(subtitle)}</small></div>
      </div>`;

    const bindBack=()=>body.querySelector('.smart-practice-back-v468')?.addEventListener('click',showModeChooser);

    const chooseAllPattern=()=>{
      const answerable=patterns.filter(patternId=>{
        const slots=placeholderSegmentsV56(patternId).filter(seg=>seg.type==='slot');
        return slots.length && slots.every(slot=>allItems.some(id=>placeholderRequirementMatchesItemV58(slot.name,id)));
      });
      allPattern=spPickV468(answerable.length?answerable:patterns);
      allValues={};
    };

    function startAllMode(){
      if(!allItems.length){
        body.innerHTML=`${modeHeader('All Learned Items','All learned non-pattern KB items')}<div class="quiz-settings-empty-v58">No learned non-pattern Knowledge Base items are available yet.</div>`;
        bindBack();return;
      }
      if(!patterns.length){
        body.innerHTML=`${modeHeader('All Learned Items','All learned non-pattern KB items')}<div class="quiz-settings-empty-v58">No learned placeholder patterns are available yet.</div>`;
        bindBack();return;
      }
      chooseAllPattern();
      renderAllMode();
    }

    function renderAllMode(){
      const segments=placeholderSegmentsV56(allPattern);
      const slots=segments.filter(seg=>seg.type==='slot');
      body.innerHTML=`
        ${modeHeader('All Learned Items','Search names only. Tags and metadata are not searched.')}
        <div class="quiz-practice-toolbar-v59">
          <strong>${placeholderTokenHtmlV56(allPattern)}</strong>
          <button type="button" class="small-icon-btn smart-practice-new-v468" title="New pattern"><i class="ph ph-shuffle"></i></button>
        </div>
        <div class="sentence-builder-canvas-v56 smart-practice-canvas-v59">
          ${segments.map(seg=>seg.type==='text'
            ? `<span class="sentence-builder-literal-v56">${escapeKnowledgeHtml(seg.text)}</span>`
            : `<div class="sentence-builder-slot-v56 ${allValues[seg.slotIndex]?'filled':''}" data-all-slot-v468="${seg.slotIndex}" data-slot-name-v468="${escapeKnowledgeAttr(seg.name)}">
                <span class="sentence-builder-slot-label-v56">${escapeKnowledgeHtml(seg.name.toUpperCase())}</span>
                <div class="sentence-builder-slot-value-v56">${allValues[seg.slotIndex]?`<strong>${escapeKnowledgeHtml(allValues[seg.slotIndex])}</strong>`:'<span>Drop any learned item here</span>'}</div>
              </div>`).join('')}
        </div>
        <div class="sentence-builder-search-v56"><i class="ph ph-magnifying-glass"></i><input class="smart-practice-search-v468" placeholder="Search learned item names…" autocomplete="off"></div>
        <div class="sentence-builder-kb-results-v56 smart-practice-bank-v468"></div>
        <div class="smart-practice-feedback-v468 neutral" aria-live="polite"></div>
        <div class="quiz-generated-actions-v58"><button type="button" class="icon-btn smart-practice-check-v468">Check Answer</button></div>`;
      bindBack();
      const search=body.querySelector('.smart-practice-search-v468');
      const bank=body.querySelector('.smart-practice-bank-v468');
      const draw=()=>{
        const q=String(search.value||'').trim().toLowerCase();
        const shown=allItems.filter(id=>!q||String(id).toLowerCase().includes(q));
        bank.innerHTML=shown.length?shown.map(id=>spAnswerButtonV468(id,'data-all-item-v468')).join(''):'<div class="sentence-pattern-no-results-v55">No learned item names match that search.</div>';
        bank.querySelectorAll('[data-all-item-v468]').forEach(btn=>btn.addEventListener('dragstart',e=>{
          e.dataTransfer.effectAllowed='copy';
          e.dataTransfer.setData('text/loggy-smart-all-v468',btn.dataset.allItemV468);
        }));
      };
      search.addEventListener('input',draw);draw();
      body.querySelectorAll('[data-all-slot-v468]').forEach(slot=>{
        slot.addEventListener('dragover',e=>{ if(!e.dataTransfer.types.includes('text/loggy-smart-all-v468'))return; e.preventDefault();slot.classList.add('drop-ready'); });
        slot.addEventListener('dragleave',()=>slot.classList.remove('drop-ready'));
        slot.addEventListener('drop',e=>{
          const id=e.dataTransfer.getData('text/loggy-smart-all-v468');
          if(!id)return;
          e.preventDefault();
          allValues[Number(slot.dataset.allSlotV468)]=id;
          renderAllMode();
        });
      });
      body.querySelector('.smart-practice-new-v468')?.addEventListener('click',()=>{chooseAllPattern();renderAllMode();});
      body.querySelector('.smart-practice-check-v468')?.addEventListener('click',()=>{
        const missing=slots.filter(s=>!allValues[s.slotIndex]);
        if(missing.length){spSetFeedbackV468(body,'Fill every placeholder first.','neutral');return;}
        let wrong=0;
        slots.forEach(s=>{
          const ok=placeholderRequirementMatchesItemV58(s.name,allValues[s.slotIndex]);
          const el=body.querySelector(`[data-all-slot-v468="${s.slotIndex}"]`);
          el?.classList.toggle('answer-correct-v457',ok);
          el?.classList.toggle('answer-wrong-v457',!ok);
          if(!ok)wrong++;
        });
        if(!wrong)spSetFeedbackV468(body,'Correct. Every item fits its placeholder.','correct');
        else spSetFeedbackV468(body,`Incorrect. ${wrong===1?'One item does':`${wrong} items do`} not fit ${wrong===1?'its':'their'} placeholder${wrong===1?'':'s'}.`,'wrong');
      });
    }

    function startChoiceMode(){
      if(!allItems.length||!patterns.length){
        body.innerHTML=`${modeHeader('4 Choices','Exactly four learned non-pattern answer choices')}<div class="quiz-settings-empty-v58">You need learned placeholder patterns and learned non-pattern items before using this mode.</div>`;
        bindBack();return;
      }
      choice=spBuildChoiceV468(patterns,allItems);
      renderChoiceMode();
    }

    function renderChoiceMode(){
      if(!choice){
        body.innerHTML=`${modeHeader('4 Choices','Exactly four learned non-pattern answer choices')}<div class="quiz-settings-empty-v58">I could not build a four-choice question with exactly one correct learned item and three incorrect learned items. Add more varied learned items and try again.</div>`;
        bindBack();return;
      }
      const targetIndex=choice.slot.slotIndex;
      body.innerHTML=`
        ${modeHeader('4 Choices','Exactly one of the four choices fits the active placeholder.')}
        <div class="quiz-practice-toolbar-v59">
          <strong>${placeholderTokenHtmlV56(choice.patternId)}</strong>
          <button type="button" class="small-icon-btn smart-choice-new-v468" title="New question"><i class="ph ph-shuffle"></i></button>
        </div>
        <div class="sentence-builder-canvas-v56 smart-practice-canvas-v59">
          ${choice.segments.map(seg=>{
            if(seg.type==='text')return `<span class="sentence-builder-literal-v56">${escapeKnowledgeHtml(seg.text)}</span>`;
            if(seg.slotIndex!==targetIndex)return `<div class="sentence-builder-slot-v56 smart-choice-passive-slot-v468"><span class="sentence-builder-slot-label-v56">${escapeKnowledgeHtml(seg.name.toUpperCase())}</span></div>`;
            return `<div class="sentence-builder-slot-v56 ${choice.selectedId?'filled':''}" data-choice-slot-v468="true"><span class="sentence-builder-slot-label-v56">${escapeKnowledgeHtml(seg.name.toUpperCase())}</span><div class="sentence-builder-slot-value-v56">${choice.selectedId?`<strong>${escapeKnowledgeHtml(choice.selectedId)}</strong>`:'<span>Drag or click one answer</span>'}</div></div>`;
          }).join('')}
        </div>
        <div class="smart-choice-bank-v468">${choice.choices.map(id=>spAnswerButtonV468(id,'data-choice-item-v468')).join('')}</div>
        <div class="smart-practice-feedback-v468 neutral" aria-live="polite"></div>
        <div class="quiz-generated-actions-v58"><button type="button" class="icon-btn smart-choice-check-v468">Check Answer</button></div>`;
      bindBack();
      const target=body.querySelector('[data-choice-slot-v468]');
      body.querySelectorAll('[data-choice-item-v468]').forEach(btn=>{
        btn.addEventListener('dragstart',e=>{e.dataTransfer.effectAllowed='copy';e.dataTransfer.setData('text/loggy-smart-choice-v468',btn.dataset.choiceItemV468);});
        btn.addEventListener('click',()=>{choice.selectedId=btn.dataset.choiceItemV468;renderChoiceMode();});
      });
      target?.addEventListener('dragover',e=>{if(!e.dataTransfer.types.includes('text/loggy-smart-choice-v468'))return;e.preventDefault();target.classList.add('drop-ready');});
      target?.addEventListener('dragleave',()=>target.classList.remove('drop-ready'));
      target?.addEventListener('drop',e=>{const id=e.dataTransfer.getData('text/loggy-smart-choice-v468');if(!id)return;e.preventDefault();choice.selectedId=id;renderChoiceMode();});
      body.querySelector('.smart-choice-new-v468')?.addEventListener('click',()=>{choice=spBuildChoiceV468(patterns,allItems);renderChoiceMode();});
      body.querySelector('.smart-choice-check-v468')?.addEventListener('click',()=>{
        if(!choice.selectedId){spSetFeedbackV468(body,'Choose one answer first.','neutral');return;}
        const ok=placeholderRequirementMatchesItemV58(choice.slot.name,choice.selectedId);
        target?.classList.toggle('answer-correct-v457',ok);
        target?.classList.toggle('answer-wrong-v457',!ok);
        spSetFeedbackV468(body,ok?'Correct. That item fits the placeholder.':'Incorrect. That item does not fit the placeholder.',ok?'correct':'wrong');
      });
    }

    showModeChooser();
  }

  window.openSmartPlaceholderPracticeV468=openSmartPlaceholderPracticeV468;
  window.openSmartPlaceholderPracticeV473=openSmartPlaceholderPracticeV468;
  // Replace the legacy global too, so any old listeners still resolve to the rewrite.
  openSmartPlaceholderPracticeV59=openSmartPlaceholderPracticeV468;

  // One authoritative capture handler. It runs before legacy bubble listeners.
  if(!window.__loggySmartPracticeEntryV468){
    window.__loggySmartPracticeEntryV468=true;
    document.addEventListener('click',event=>{
      const button=event.target.closest?.('.open-smart-practice-v59');
      if(!button)return;
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
      openSmartPlaceholderPracticeV468();
    },true);
  }
})();
