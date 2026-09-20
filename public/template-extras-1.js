// V443: applied Log intro audio is owned only by template.js.
// Historical theme-rendering wrappers may still call this name for visual
// reactions, but it never creates, starts, seeks, fades, or stops media.
function playCustomThemeIntroAudioV2(_theme = {}, _options = {}) {
    try { return window.__loggyLogIntroAudioV443?.audio || null; } catch (_) { return null; }
}

// ============================================================
// THEME PICKER MANAGEMENT + MEDIA-ENHANCED THEME BUILDER
// ============================================================

function ensureCustomThemePickerOption() {
    if (!dailyThemeSelect) return;
    normalizeFeatureSuiteSettings();

    let option = Array.from(dailyThemeSelect.options).find(item => item.value === 'theme-custom-builder');
    if (db.settings.customThemeDeleted) {
        option?.remove();
        return;
    }

    const theme = getCustomThemeSettings();
    if (!option) {
        option = document.createElement('option');
        option.value = 'theme-custom-builder';
        dailyThemeSelect.appendChild(option);
    }
    option.textContent = theme.name || 'My Custom Theme';

    if (typeof THEME_PREVIEWS !== 'undefined') {
        THEME_PREVIEWS['theme-custom-builder'] = [
            theme.background,
            theme.surface,
            theme.accent,
            String(theme.background || '').toLowerCase() === '#000000'
        ];
    }
}

async function deleteThemeFromPickerV2(themeValue, themeName) {
    if (!themeValue || themeValue === 'default') {
        showFeatureToast('The Default theme cannot be deleted.');
        return;
    }

    const confirmed = await showAppConfirm({
        title: 'Delete this theme?',
        message: `“${themeName || themeValue}” will be removed from this log’s theme picker.`,
        confirmLabel: 'Delete Theme'
    });
    if (!confirmed) return;

    normalizeFeatureSuiteSettings();

    if (themeValue === 'theme-custom-builder') {
        db.settings.customThemeDeleted = true;
        Array.from(dailyThemeSelect?.options || [])
            .find(option => option.value === 'theme-custom-builder')
            ?.remove();
    } else if (!db.settings.deletedThemes.includes(themeValue)) {
        db.settings.deletedThemes.push(themeValue);
    }

    if (db.settings.theme === themeValue) {
        await applyTheme('default', { persist: false });
        db.settings.theme = 'default';
        themePickerSelected = 'default';
        if (dailyThemeSelect) dailyThemeSelect.value = 'default';
    }

    await saveDb();
    renderThemePicker();
    showFeatureToast(`Deleted “${themeName || 'theme'}”.`);
}

function createThemePickerCard(option) {
    const card = document.createElement('button');
    card.type = 'button';
    card.className = 'theme-picker-card';
    card.dataset.theme = option.value;
    card.dataset.themeName = option.textContent.trim();
    card.dataset.themeCategory = option.parentElement?.tagName === 'OPTGROUP'
        ? option.parentElement.label
        : '';

    let preview = THEME_PREVIEWS[option.value];
    if (!preview) {
        const seed = Array.from(option.value || option.textContent || 'theme')
            .reduce((total, char) => total + char.charCodeAt(0), 0);
        const hueA = seed % 360;
        const hueB = (hueA + 42 + (seed % 58)) % 360;
        const hueAccent = (hueA + 190) % 360;
        preview = [
            `hsl(${hueA} 74% 84%)`,
            `hsl(${hueB} 70% 94%)`,
            `hsl(${hueAccent} 66% 48%)`
        ];
    }

    const [a, b, accent, dark] = preview;
    if (dark) card.classList.add('theme-dark');
    card.innerHTML = `
        <div class="theme-picker-preview" style="background:linear-gradient(135deg,${a},${b});--preview-accent:${accent};"></div>
        <div class="theme-picker-info">
            <span class="theme-picker-name"></span>
            <span class="theme-picker-hint">Click to apply${option.value === 'default' ? '' : ' · Right-click to delete'}</span>
        </div>`;
    card.querySelector('.theme-picker-name').textContent = option.textContent.trim();

    card.addEventListener('click', async () => {
        themePickerSelected = option.value;
        updateThemePickerSelection();
        await applyTheme(option.value);
    });

    if (option.value !== 'default') {
        card.addEventListener('contextmenu', event => {
            event.preventDefault();
            showCustomItemContextMenu(event.clientX, event.clientY, [{
                label: 'Delete theme', icon: 'ph-trash', danger: true,
                action: () => deleteThemeFromPickerV2(option.value, option.textContent.trim())
            }]);
        });
    }
    return card;
}

function renderThemePicker() {
    if (!themePicker || !dailyThemeSelect) return;
    normalizeFeatureSuiteSettings();
    ensureCustomThemePickerOption();
    themePicker.innerHTML = '';

    const removedThemeValues = new Set([
        'theme-candy', 'theme-forest', 'theme-blossom', 'theme-80s', 'theme-rainforest', 'theme-arcade',
        ...db.settings.deletedThemes
    ]);
    if (db.settings.customThemeDeleted) removedThemeValues.add('theme-custom-builder');

    let options = Array.from(dailyThemeSelect.querySelectorAll('option'))
        .filter(option => !removedThemeValues.has(option.value));

    options.forEach(option => {
        if (option.value === 'theme-water') option.textContent = 'Sky Blue';
    });

    const specialValues = new Set(['theme-water', 'theme-whimsical', 'theme-cloud']);
    const special = {};
    options = options.filter(option => {
        if (specialValues.has(option.value)) {
            special[option.value] = option;
            return false;
        }
        return true;
    });

    const honeyIndex = options.findIndex(option => option.value === 'theme-honey');
    if (special['theme-water']) {
        if (honeyIndex !== -1) options.splice(honeyIndex + 1, 0, special['theme-water']);
        else options.push(special['theme-water']);
    }

    const noirIndex = options.findIndex(option => option.value === 'theme-noir');
    const noirInsert = [];
    if (special['theme-whimsical']) noirInsert.push(special['theme-whimsical']);
    if (special['theme-cloud']) noirInsert.push(special['theme-cloud']);
    if (noirInsert.length) {
        if (noirIndex !== -1) options.splice(noirIndex + 1, 0, ...noirInsert);
        else options.push(...noirInsert);
    }

    options.forEach(option => themePicker.appendChild(createThemePickerCard(option)));

    themePickerSelected = dailyThemeSelect.value || 'default';
    if (removedThemeValues.has(themePickerSelected)) {
        themePickerSelected = 'default';
        dailyThemeSelect.value = 'default';
    }
    updateThemePickerSelection();
    filterThemePicker(themeSearchInput?.value || '');
}

function clearCustomThemeRuntimeMediaV2() {
    document.getElementById('custom-theme-background-stage')?.remove();
    if (customThemeIntroStopTimerV2) clearTimeout(customThemeIntroStopTimerV2);
    if (customThemeIntroFadeTimerV2) clearInterval(customThemeIntroFadeTimerV2);
    customThemeIntroStopTimerV2 = null;
    customThemeIntroFadeTimerV2 = null;
    if (customThemeIntroAudioV2) {
        try { customThemeIntroAudioV2.pause(); customThemeIntroAudioV2.currentTime = 0; } catch (error) {}
        customThemeIntroAudioV2 = null;
    }
}

function clearCustomBuiltTheme() {
    clearCustomThemeRuntimeMediaV2();
    const root = document.documentElement;
    [
        '--white', '--black', '--muted-text', '--track-bg', '--thin-border', '--thick-border',
        '--border-radius', '--custom-theme-accent', '--custom-theme-accent-text', '--custom-theme-shadow',
        '--custom-theme-font', '--custom-theme-page-bg', '--custom-theme-border-color', '--custom-theme-background-image'
    ].forEach(name => root.style.removeProperty(name));
}

function mountCustomThemeBackgroundSvgsV2(theme) {
    const svgs = Array.isArray(theme.backgroundSvgs) ? theme.backgroundSvgs : [];
    if (!svgs.length) return;

    const stage = document.createElement('div');
    stage.id = 'custom-theme-background-stage';
    stage.className = 'custom-theme-background-stage';
    const positions = [[8,14],[76,12],[18,68],[70,66],[44,28],[47,76],[88,42],[5,43]];

    svgs.slice(0,8).forEach((svg,index) => {
        const item = document.createElement('div');
        item.className = 'custom-theme-background-svg';
        item.style.left = `${positions[index][0]}%`;
        item.style.top = `${positions[index][1]}%`;
        item.style.setProperty('--custom-svg-delay', `${index * -0.7}s`);
        item.style.setProperty('--custom-svg-rotate', `${(index % 2 ? -1 : 1) * (4 + index * 2)}deg`);
        item.innerHTML = String(svg?.markup || '');
        stage.appendChild(item);
    });
    document.body.prepend(stage);
}

function legacyPlayCustomThemeIntroAudioV2_A(theme) {
    try { return window.__loggyLogIntroAudioV443?.audio || null; } catch (_) { return null; }
}

function applyCustomBuiltTheme(theme = getCustomThemeSettings()) {
    clearCustomThemeRuntimeMediaV2();
    const root = document.documentElement;
    const radius = Math.max(0, Math.min(30, Number(theme.radius) || 0));
    const shadow = Math.max(0, Math.min(12, Number(theme.shadow) || 0));
    const accentText = getReadableTextColor(theme.accent);

    root.style.setProperty('--white', theme.surface);
    root.style.setProperty('--black', theme.text);
    root.style.setProperty('--muted-text', theme.muted);
    root.style.setProperty('--track-bg', `${theme.accent}18`);
    root.style.setProperty('--thin-border', `1.5px solid ${theme.border}`);
    root.style.setProperty('--thick-border', `2.5px solid ${theme.border}`);
    root.style.setProperty('--border-radius', `${radius}px`);
    root.style.setProperty('--custom-theme-accent', theme.accent);
    root.style.setProperty('--custom-theme-accent-text', accentText);
    root.style.setProperty('--custom-theme-shadow', `${shadow}px ${shadow}px 0 ${theme.border}`);
    root.style.setProperty('--custom-theme-font', CUSTOM_THEME_FONT_STACKS[theme.font] || CUSTOM_THEME_FONT_STACKS.hand);
    root.style.setProperty('--custom-theme-page-bg', theme.background);
    root.style.setProperty('--custom-theme-border-color', theme.border);
    root.style.setProperty('--custom-theme-background-image', theme.backgroundImage ? `url("${String(theme.backgroundImage).replace(/"/g, '\\"')}")` : 'none');

    mountCustomThemeBackgroundSvgsV2(theme);
    playCustomThemeIntroAudioV2(theme);
}

function readThemeFileAsDataUrlV2(file, maxBytes = 12 * 1024 * 1024) {
    return new Promise(resolve => {
        if (!file) { resolve(''); return; }
        if (file.size > maxBytes) {
            showFeatureToast(`“${file.name}” is too large for a saved theme.`);
            resolve('');
            return;
        }
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result || ''));
        reader.onerror = () => resolve('');
        reader.readAsDataURL(file);
    });
}

function readThemeSvgAsMarkupV2(file) {
    return new Promise(resolve => {
        if (!file || file.size > 1024 * 1024) { resolve(''); return; }
        const reader = new FileReader();
        reader.onload = () => {
            let markup = String(reader.result || '');
            markup = markup.replace(/<script[\s\S]*?<\/script>/gi, '');
            markup = markup.replace(/\son\w+\s*=\s*(['"]).*?\1/gi, '');
            if (!/<svg[\s>]/i.test(markup)) { resolve(''); return; }
            resolve(markup);
        };
        reader.onerror = () => resolve('');
        reader.readAsText(file);
    });
}

function ensureThemeBuilderModal() {
    let old = document.getElementById('theme-builder-modal');
    old?.remove();

    const modal = document.createElement('div');
    modal.id = 'theme-builder-modal';
    modal.className = 'modal-overlay hidden theme-builder-modal';
    modal.innerHTML = `
        <div class="modal-box theme-builder-box theme-builder-box-expanded">
            <div class="modal-header">
                <div><h2>Theme Builder</h2><p class="feature-modal-subtitle">Build colors, a background image, intro audio, and animated SVG decorations.</p></div>
                <button type="button" class="small-icon-btn theme-builder-close"><i class="ph ph-x"></i></button>
            </div>

            <div class="theme-builder-layout">
                <div class="theme-builder-controls">
                    <label class="theme-builder-field"><span>Theme Name</span><input type="text" data-theme-key="name" maxlength="36"></label>
                    <div class="theme-builder-color-grid"></div>
                    <div class="theme-builder-sliders"></div>
                    <label class="theme-builder-field"><span>Font Style</span><select data-theme-key="font">
                        <option value="hand">Handwritten</option><option value="clean">Clean Sans</option><option value="serif">Book Serif</option><option value="mono">Monospace</option>
                    </select></label>

                    <section class="theme-builder-media-section">
                        <div class="theme-builder-media-heading"><div><strong>Background Image</strong><small>Optional full-page image behind the theme.</small></div><button type="button" class="small-icon-btn theme-builder-background-clear" title="Remove background image"><i class="ph ph-x"></i></button></div>
                        <input type="file" class="theme-builder-background-file" accept="image/*">
                        <div class="theme-builder-upload-status theme-builder-background-status"></div>
                    </section>

                    <section class="theme-builder-media-section">
                        <div class="theme-builder-media-heading"><div><strong>Intro Audio</strong><small>Choose up to the first 20 seconds to play when the theme is applied.</small></div><button type="button" class="small-icon-btn theme-builder-audio-clear" title="Remove audio"><i class="ph ph-x"></i></button></div>
                        <input type="file" class="theme-builder-audio-file" accept="audio/*">
                        <div class="theme-builder-audio-timing">
                            <label><span>Start</span><input type="number" data-theme-key="audioStart" min="0" max="20" step="0.5"><small>sec</small></label>
                            <label><span>End</span><input type="number" data-theme-key="audioEnd" min="0.5" max="20" step="0.5"><small>sec</small></label>
                        </div>
                        <label class="feature-toggle-row theme-builder-fade-row"><input type="checkbox" class="theme-builder-audio-fade"><span>Fade audio out at the end</span></label>
                        <div class="theme-builder-upload-status theme-builder-audio-status"></div>
                    </section>

                    <section class="theme-builder-media-section">
                        <div class="theme-builder-media-heading"><div><strong>Animated Decorations</strong><small>Upload up to 8 SVGs. They float automatically and react when you hover them.</small></div></div>
                        <input type="file" class="theme-builder-svg-file" accept=".svg,.png,image/svg+xml,image/png" multiple>
                        <div class="theme-builder-svg-list"></div>
                    </section>
                </div>

                <div class="theme-builder-preview-wrap">
                    <span class="field-label">Live Preview</span>
                    <div class="theme-builder-preview">
                        <div class="theme-builder-preview-nav"><i class="ph ph-house"></i><i class="ph ph-palette"></i><i class="ph ph-books"></i></div>
                        <article class="theme-builder-preview-card">
                            <span class="theme-builder-preview-chip">Day 12</span><h3>Learning Dashboard</h3>
                            <p>Cards, Daily Logs, Knowledge Base, and custom tabs all use your theme.</p>
                            <div class="theme-builder-preview-progress"><span></span></div><button type="button">Save Progress</button>
                        </article>
                    </div>
                </div>
            </div>

            <div class="theme-builder-actions">
                <button type="button" class="icon-btn theme-builder-reset"><i class="ph ph-arrow-counter-clockwise"></i> Reset</button>
                <button type="button" class="icon-btn custom-tab-primary-btn theme-builder-save" data-enter-submit="true"><i class="ph ph-check"></i> Save & Apply Theme</button>
            </div>
        </div>`;

    document.body.appendChild(modal);
    const close = () => modal.classList.add('hidden');
    modal.querySelector('.theme-builder-close').addEventListener('click', close);
    modal.addEventListener('pointerdown', event => { if (event.target === modal) close(); });
    return modal;
}

function getThemeBuilderDraft(modal) {
    const draft = {
        ...FEATURE_SUITE_DEFAULT_THEME,
        ...CUSTOM_THEME_MEDIA_DEFAULTS_V2,
        backgroundSvgs: Array.isArray(modal._themeBackgroundSvgs) ? modal._themeBackgroundSvgs : []
    };
    modal.querySelectorAll('[data-theme-key]').forEach(input => {
        const key = input.dataset.themeKey;
        draft[key] = input.type === 'range' || input.type === 'number' ? Number(input.value) : input.value;
    });
    draft.backgroundImage = modal._themeBackgroundImage || '';
    draft.introAudio = modal._themeIntroAudio || '';
    draft.audioFade = !!modal.querySelector('.theme-builder-audio-fade')?.checked;
    return draft;
}

function renderThemeBuilderSvgListV2(modal) {
    const host = modal.querySelector('.theme-builder-svg-list');
    if (!host) return;
    const svgs = Array.isArray(modal._themeBackgroundSvgs) ? modal._themeBackgroundSvgs : [];
    host.innerHTML = '';
    if (!svgs.length) {
        host.innerHTML = '<div class="theme-builder-upload-empty">No SVG decorations uploaded.</div>';
        return;
    }
    svgs.forEach((svg,index) => {
        const row = document.createElement('div');
        row.className = 'theme-builder-svg-row';
        row.innerHTML = `<div class="theme-builder-svg-thumb">${renderThemeBuilderSvgAsset(svg)}</div><span>${escapeCustomHtml(svg.name || `SVG ${index+1}`)}</span><button type="button" class="small-icon-btn" title="Remove"><i class="ph ph-x"></i></button>`;
        row.querySelector('button').addEventListener('click', () => {
            modal._themeBackgroundSvgs.splice(index,1);
            renderThemeBuilderSvgListV2(modal);
        });
        host.appendChild(row);
    });
}

function updateThemeBuilderPreview(modal) {
    const draft = getThemeBuilderDraft(modal);
    const preview = modal.querySelector('.theme-builder-preview');
    const card = modal.querySelector('.theme-builder-preview-card');
    const button = card?.querySelector('button');
    const chip = card?.querySelector('.theme-builder-preview-chip');
    const progress = card?.querySelector('.theme-builder-preview-progress span');
    if (!preview || !card) return;

    preview.style.backgroundColor = draft.background;
    preview.style.backgroundImage = draft.backgroundImage ? `linear-gradient(rgba(255,255,255,.08), rgba(255,255,255,.08)), url("${draft.backgroundImage}")` : 'none';
    preview.style.backgroundSize = 'cover';
    preview.style.backgroundPosition = 'center';
    preview.style.color = draft.text;
    preview.style.fontFamily = CUSTOM_THEME_FONT_STACKS[draft.font] || CUSTOM_THEME_FONT_STACKS.hand;
    card.style.background = draft.surface;
    card.style.color = draft.text;
    card.style.borderColor = draft.border;
    card.style.borderRadius = `${draft.radius}px`;
    card.style.boxShadow = `${draft.shadow}px ${draft.shadow}px 0 ${draft.border}`;
    if (button) {
        button.style.background = draft.accent;
        button.style.color = getReadableTextColor(draft.accent);
        button.style.borderColor = draft.border;
        button.style.borderRadius = `${Math.max(4, draft.radius - 4)}px`;
    }
    if (chip) { chip.style.background = `${draft.accent}22`; chip.style.color = draft.text; }
    if (progress) progress.style.background = draft.accent;

    modal.querySelectorAll('[data-theme-output]').forEach(output => {
        output.textContent = String(draft[output.dataset.themeOutput]);
    });
    const backgroundStatus = modal.querySelector('.theme-builder-background-status');
    if (backgroundStatus) backgroundStatus.textContent = draft.backgroundImage ? 'Background image ready' : 'No background image';
    const audioStatus = modal.querySelector('.theme-builder-audio-status');
    if (audioStatus) audioStatus.textContent = draft.introAudio
        ? `Audio ready · ${draft.audioStart}s–${draft.audioEnd}s${draft.audioFade ? ' · fade' : ''}`
        : 'No intro audio';
}

function populateThemeBuilder(modal, theme) {
    const merged = {
        ...FEATURE_SUITE_DEFAULT_THEME,
        ...CUSTOM_THEME_MEDIA_DEFAULTS_V2,
        ...theme,
        backgroundSvgs: Array.isArray(theme?.backgroundSvgs) ? theme.backgroundSvgs : []
    };
    const colors = [
        ['Page Background','background'],['Cards / Surface','surface'],['Main Text','text'],
        ['Borders','border'],['Accent','accent'],['Muted Text','muted']
    ];
    modal.querySelector('.theme-builder-color-grid').innerHTML = colors.map(([label,key]) => themeBuilderField(label,key,merged[key])).join('');
    modal.querySelector('.theme-builder-sliders').innerHTML =
        themeBuilderField('Corner Radius','radius',merged.radius,'range') +
        themeBuilderField('Shadow Size','shadow',merged.shadow,'range');
    modal.querySelector('[data-theme-key="name"]').value = merged.name;
    modal.querySelector('[data-theme-key="font"]').value = merged.font;
    modal.querySelector('[data-theme-key="audioStart"]').value = Math.max(0,Math.min(20,Number(merged.audioStart)||0));
    modal.querySelector('[data-theme-key="audioEnd"]').value = Math.max(.5,Math.min(20,Number(merged.audioEnd)||20));
    modal.querySelector('.theme-builder-audio-fade').checked = merged.audioFade !== false;
    modal._themeBackgroundImage = merged.backgroundImage || '';
    modal._themeIntroAudio = merged.introAudio || '';
    modal._themeBackgroundSvgs = merged.backgroundSvgs.map(item => ({...item}));

    modal.querySelectorAll('input[data-theme-key], select[data-theme-key]').forEach(input => {
        input.oninput = () => {
            const hexInput = modal.querySelector(`[data-theme-hex="${CSS.escape(input.dataset.themeKey)}"]`);
            if (input.type === 'color' && hexInput) hexInput.value = input.value;
            updateThemeBuilderPreview(modal);
        };
    });
    modal.querySelectorAll('[data-theme-hex]').forEach(input => {
        input.onchange = () => {
            const value = input.value.trim();
            if (!/^#[0-9a-f]{6}$/i.test(value)) return;
            const picker = modal.querySelector(`input[type="color"][data-theme-key="${CSS.escape(input.dataset.themeHex)}"]`);
            if (picker) picker.value = value;
            updateThemeBuilderPreview(modal);
        };
    });

    const backgroundFile = modal.querySelector('.theme-builder-background-file');
    backgroundFile.onchange = async () => {
        const file = backgroundFile.files?.[0];
        if (!file) return;
        const dataUrl = await readThemeFileAsDataUrlV2(file, 8 * 1024 * 1024);
        if (!dataUrl) return;
        modal._themeBackgroundImage = dataUrl;
        updateThemeBuilderPreview(modal);
    };
    modal.querySelector('.theme-builder-background-clear').onclick = () => {
        modal._themeBackgroundImage = '';
        backgroundFile.value = '';
        updateThemeBuilderPreview(modal);
    };

    const audioFile = modal.querySelector('.theme-builder-audio-file');
    audioFile.onchange = async () => {
        const file = audioFile.files?.[0];
        if (!file) return;
        const dataUrl = await readThemeFileAsDataUrlV2(file, 12 * 1024 * 1024);
        if (!dataUrl) return;
        modal._themeIntroAudio = dataUrl;
        updateThemeBuilderPreview(modal);
    };
    modal.querySelector('.theme-builder-audio-clear').onclick = () => {
        modal._themeIntroAudio = '';
        audioFile.value = '';
        updateThemeBuilderPreview(modal);
    };
    modal.querySelector('.theme-builder-audio-fade').onchange = () => updateThemeBuilderPreview(modal);

    const svgFile = modal.querySelector('.theme-builder-svg-file');
    svgFile.onchange = async () => {
        const files = Array.from(svgFile.files || []).slice(0, Math.max(0, 8 - modal._themeBackgroundSvgs.length));
        for (const file of files) {
            const markup = await readThemeSvgAsMarkupV2(file);
            if (markup) modal._themeBackgroundSvgs.push({ name: file.name, markup });
        }
        svgFile.value = '';
        renderThemeBuilderSvgListV2(modal);
        updateThemeBuilderPreview(modal);
    };

    renderThemeBuilderSvgListV2(modal);
    updateThemeBuilderPreview(modal);
}

// ============================================================
// NOTES LINK POPUP — CHOOSE A MEDIA RESOURCE FROM THIS DAY
// ============================================================

function renderNotesResourceChoicesV2() {
    const popup = document.getElementById('notes-link-popup');
    if (!popup) return;

    let host = popup.querySelector('.notes-media-resource-choices');
    if (!host) {
        host = document.createElement('div');
        host.className = 'notes-media-resource-choices';
        popup.appendChild(host);
    }
    host.innerHTML = '';

    const resources = currentDay ? (db.days[currentDay]?.resources || []) : [];
    if (!resources.length) {
        host.innerHTML = '<div class="notes-media-resource-empty">No Media Resources on this day yet.</div>';
        return;
    }

    const heading = document.createElement('span');
    heading.className = 'notes-resource-choice-heading';
    heading.textContent = 'Or link to a Media Resource from this day';
    host.appendChild(heading);

    resources.forEach((resource,index) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'notes-media-resource-choice';
        button.innerHTML = `
            <i class="ph ${resource.type === 'yt' ? 'ph-youtube-logo' : resource.type === 'tiktok' ? 'ph-video' : 'ph-link'}"></i>
            <span><strong>${escapeCustomHtml(getDailyResourceDisplayTitle(resource,index))}</strong><small>${escapeCustomHtml(getDailyResourceDomain(resource))}</small></span>`;
        button.addEventListener('click', () => {
            if (!slashRange) return;
            insertMediaResourceIconAtRangeV2(slashRange,index);
            if (currentDay) {
                db.days[currentDay].notes = document.getElementById('log-notes').innerHTML;
                scheduleSaveDay();
            }
            closeNotesLinkPopup();
            document.getElementById('log-notes')?.focus();
        });
        host.appendChild(button);
    });
}

function openNotesLinkPopup(range) {
    slashRange = range;
    const popup = document.getElementById('notes-link-popup');
    const input = document.getElementById('notes-link-input');
    if (!popup || !input) return;
    popup.classList.remove('hidden');
    input.value = '';
    renderNotesResourceChoicesV2();
    input.focus();
}

function insertMediaResourceIconAtRangeV2(range, resourceIndex) {
    if (!range) return;
    const resource = currentDay ? db.days[currentDay]?.resources?.[resourceIndex] : null;
    if (!resource) return;

    const icon = document.createElement('a');
    icon.href = `#daily-resource-${resourceIndex}`;
    icon.dataset.resourceIndex = String(resourceIndex);
    icon.className = 'notes-link-icon daily-resource-notes-link';
    icon.title = `Jump to ${getDailyResourceDisplayTitle(resource,resourceIndex)}`;
    icon.contentEditable = 'false';
    icon.innerHTML = '<i class="ph ph-link"></i>';

    range.deleteContents();
    range.insertNode(icon);
    const space = document.createTextNode('\u00A0');
    range.setStartAfter(icon);
    range.insertNode(space);
    range.setStartAfter(space);
    range.collapse(true);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
}

// Alias used by the earlier Enter handler replacement.
function insertMediaResourceIconAtRange(range, resourceIndex) {
    insertMediaResourceIconAtRangeV2(range, resourceIndex);
}

if (!document.documentElement.dataset.dailyResourceNoteLinksBoundV2) {
    document.documentElement.dataset.dailyResourceNoteLinksBoundV2 = 'true';
    document.getElementById('log-notes')?.addEventListener('click', event => {
        const link = event.target.closest('a[data-resource-index]');
        if (!link) return;
        event.preventDefault();
        const resources = currentDay ? (db.days[currentDay]?.resources || []) : [];
        const savedUrl = String(link.dataset.resourceUrl || '');
        const currentIndex = savedUrl
            ? resources.findIndex(resource => String(resource?.url || '') === savedUrl)
            : -1;
        highlightDailyResource(currentIndex >= 0 ? currentIndex : Number(link.dataset.resourceIndex));
    });
}

// ============================================================
// FEATURE PACK INITIALIZATION — UTILITIES IN THEIR NEW HOMES
// ============================================================

function initializeFeatureSuiteAfterLoad() {
    normalizeFeatureSuiteSettings();
    ensureCustomThemePickerOption();
    ensureWeeklyReviewView();
    ensureTrashViewV2();

    const scrollRegion = document.getElementById('side-nav-log-scroll');
    ensureTrashNavButtonV2(scrollRegion);
    ensureWeeklyReviewNavButton(scrollRegion);

    // The old floating Global Search / Trash / Backup modals are intentionally
    // not initialized. Search is inline on Daily Logs; Trash/Weekly are tabs;
    // current-log export/restore is available from the dashboard log menu.
    ensureThemeBuilderModal();
    bindGlobalCommandShortcut();
    ensureGlobalUtilitiesSection();
    updateLogSpecificSideNavScrollState();
}

// Prefer starting custom-theme audio inside the user's apply-theme gesture so
// browsers are less likely to block playback. If metadata arrives later we
// correct the requested start point without re-requesting permission.
function legacyPlayCustomThemeIntroAudioV2_B(theme) {
    try { return window.__loggyLogIntroAudioV443?.audio || null; } catch (_) { return null; }
}

// Store the resource URL as well as its current index so Notes links still
// jump to the intended resource if other resource cards are removed later.
function insertMediaResourceIconAtRangeV2(range, resourceIndex) {
    if (!range) return;
    const resource = currentDay ? db.days[currentDay]?.resources?.[resourceIndex] : null;
    if (!resource) return;

    const icon = document.createElement('a');
    icon.href = `#daily-resource-${resourceIndex}`;
    icon.dataset.resourceIndex = String(resourceIndex);
    icon.dataset.resourceUrl = String(resource.url || '');
    icon.className = 'notes-link-icon daily-resource-notes-link';
    icon.title = `Jump to ${getDailyResourceDisplayTitle(resource, resourceIndex)}`;
    icon.contentEditable = 'false';
    icon.innerHTML = '<i class="ph ph-link"></i>';

    range.deleteContents();
    range.insertNode(icon);
    const space = document.createTextNode('\u00A0');
    range.setStartAfter(icon);
    range.insertNode(space);
    range.setStartAfter(space);
    range.collapse(true);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
}

function insertMediaResourceIconAtRange(range, resourceIndex) {
    insertMediaResourceIconAtRangeV2(range, resourceIndex);
}


// ============================================================
// THEME BUILDER / MEDIA RESOURCE REFINEMENT V3
// ============================================================

const CUSTOM_THEME_MEDIA_DEFAULTS_V3 = {
    backgroundImage: '',
    backgroundImageName: '',
    introAudio: '',
    introAudioName: '',
    audioPlayMode: 'full',
    audioStart: 0,
    audioEnd: 20,
    audioFade: true,
    backgroundSvgs: []
};

let customThemeIntroFadeStartTimerV3 = null;

// ------------------------------------------------------------
// Saved feature data
// ------------------------------------------------------------

function normalizeFeatureSuiteSettings() {
    if (!db.settings) db.settings = {};

    if (!db.settings.trash || typeof db.settings.trash !== 'object') {
        db.settings.trash = {};
    }

    ['tabs', 'components', 'kbItems', 'resources'].forEach(key => {
        if (!Array.isArray(db.settings.trash[key])) {
            db.settings.trash[key] = [];
        }
    });

    if (!db.settings.weeklyReviewNotes || typeof db.settings.weeklyReviewNotes !== 'object') {
        db.settings.weeklyReviewNotes = {};
    }

    if (!Array.isArray(db.settings.deletedThemes)) {
        db.settings.deletedThemes = [];
    }

    if (db.settings.customThemeDeleted === undefined) {
        db.settings.customThemeDeleted = false;
    }

    const existing =
        db.settings.customTheme &&
        typeof db.settings.customTheme === 'object'
            ? db.settings.customTheme
            : null;

    const legacyMode =
        existing?.introAudio &&
        !existing?.audioPlayMode
            ? 'segment'
            : 'full';

    db.settings.customTheme = {
        ...FEATURE_SUITE_DEFAULT_THEME,
        ...CUSTOM_THEME_MEDIA_DEFAULTS_V3,
        ...(existing || {}),
        audioPlayMode:
            existing?.audioPlayMode ||
            legacyMode,
        backgroundSvgs:
            Array.isArray(existing?.backgroundSvgs)
                ? existing.backgroundSvgs
                : []
    };
}

// ------------------------------------------------------------
// Theme Builder timestamps
// ------------------------------------------------------------

function parseThemeTimecode(value, fallback = 0) {
    const text =
        String(value || '')
            .trim();

    const match =
        text.match(
            /^(\d{1,4}):([0-5]\d)$/
        );

    if (!match) return fallback;

    return (
        Number(match[1]) * 60 +
        Number(match[2])
    );
}

function isValidThemeTimecode(value) {
    return /^(\d{1,4}):([0-5]\d)$/.test(
        String(value || '').trim()
    );
}

function formatThemeTimecode(seconds) {
    const total =
        Math.max(
            0,
            Math.floor(
                Number(seconds) || 0
            )
        );

    const minutes =
        Math.floor(
            total / 60
        );

    const secs =
        total % 60;

    return (
        String(minutes).padStart(2, '0') +
        ':' +
        String(secs).padStart(2, '0')
    );
}

function getThemeAudioMode(modal) {
    return (
        modal
            .querySelector(
                'input[name="theme-builder-audio-mode"]:checked'
            )
            ?.value ||
        'full'
    );
}

function syncThemeAudioModeUi(modal) {
    const mode =
        getThemeAudioMode(
            modal
        );

    const timing =
        modal.querySelector(
            '.theme-builder-audio-timing'
        );

    timing?.classList.toggle(
        'hidden',
        mode !== 'segment'
    );

    modal
        .querySelectorAll(
            '.theme-builder-audio-mode-option'
        )
        .forEach(option => {
            const input =
                option.querySelector(
                    'input'
                );

            option.classList.toggle(
                'selected',
                !!input?.checked
            );
        });

    updateThemeBuilderPreview(
        modal
    );
}

// ------------------------------------------------------------
// Styled Theme Builder modal
// ------------------------------------------------------------

function ensureThemeBuilderModal() {
    document
        .getElementById(
            'theme-builder-modal'
        )
        ?.remove();

    const modal =
        document.createElement(
            'div'
        );

    modal.id =
        'theme-builder-modal';

    modal.className =
        'modal-overlay hidden theme-builder-modal';

    modal.innerHTML = `
        <div class="modal-box theme-builder-box theme-builder-box-expanded">
            <div class="modal-header">
                <div>
                    <h2>Theme Builder</h2>
                    <p class="feature-modal-subtitle">
                        Build colors, images, audio, and animated SVG decorations.
                    </p>
                </div>

                <button
                    type="button"
                    class="small-icon-btn theme-builder-close"
                    title="Close"
                >
                    <i class="ph ph-x"></i>
                </button>
            </div>
<div class="theme-builder-layout">
                <div class="theme-builder-controls">
                    <label class="theme-builder-field">
                        <span>Theme Name</span>
                        <input
                            type="text"
                            data-theme-key="name"
                            maxlength="36"
                        >
                    </label>

                    <div class="theme-builder-color-grid"></div>
                    <div class="theme-builder-sliders"></div>

                    <label class="theme-builder-field">
                        <span>Font Style</span>
                        <select data-theme-key="font">
                            <option value="hand">Handwritten</option>
                            <option value="clean">Clean Sans</option>
                            <option value="serif">Book Serif</option>
                            <option value="mono">Monospace</option>
                        </select>
                    </label>

                    <section class="theme-builder-media-section">
                        <div class="theme-builder-media-heading">
                            <div>
                                <strong>Background Image</strong>
                                <small>Optional full-page image behind the theme.</small>
                            </div>

                            <button
                                type="button"
                                class="small-icon-btn theme-builder-background-clear"
                                title="Remove background image"
                            >
                                <i class="ph ph-x"></i>
                            </button>
                        </div>

                        <input
                            type="file"
                            class="theme-builder-background-file theme-builder-native-file"
                            accept="image/*"
                        >

                        <div class="theme-builder-file-picker-row">
                            <button
                                type="button"
                                class="theme-builder-file-button theme-builder-background-choose"
                            >
                                <i class="ph ph-image-square"></i>
                                Choose Image
                            </button>

                            <span class="theme-builder-file-name theme-builder-background-name">
                                No image selected
                            </span>
                        </div>

                        <div class="theme-builder-upload-status theme-builder-background-status"></div>
                    </section>

                    <section class="theme-builder-media-section">
                        <div class="theme-builder-media-heading">
                            <div>
                                <strong>Intro Audio</strong>
                                <small>
                                    Play the full audio file or choose an exact
                                    <strong>00:00</strong> start and end.
                                </small>
                            </div>

                            <button
                                type="button"
                                class="small-icon-btn theme-builder-audio-clear"
                                title="Remove audio"
                            >
                                <i class="ph ph-x"></i>
                            </button>
                        </div>

                        <input
                            type="file"
                            class="theme-builder-audio-file theme-builder-native-file"
                            accept="audio/*"
                        >

                        <div class="theme-builder-file-picker-row">
                            <button
                                type="button"
                                class="theme-builder-file-button theme-builder-audio-choose"
                            >
                                <i class="ph ph-music-notes"></i>
                                Choose Audio
                            </button>

                            <span class="theme-builder-file-name theme-builder-audio-name">
                                No audio selected
                            </span>
                        </div>

                        <div class="theme-builder-audio-mode">
                            <label class="theme-builder-audio-mode-option">
                                <input
                                    type="radio"
                                    name="theme-builder-audio-mode"
                                    value="full"
                                >
                                <span>
                                    <i class="ph ph-play-circle"></i>
                                    <strong>Play Full Audio</strong>
                                    <small>Play from the beginning until the file ends.</small>
                                </span>
                            </label>

                            <label class="theme-builder-audio-mode-option">
                                <input
                                    type="radio"
                                    name="theme-builder-audio-mode"
                                    value="segment"
                                >
                                <span>
                                    <i class="ph ph-selection"></i>
                                    <strong>Use Start &amp; End</strong>
                                    <small>Play only the time range you type below.</small>
                                </span>
                            </label>
                        </div>

                        <div class="theme-builder-audio-timing">
                            <label>
                                <span>Start</span>
                                <input
                                    type="text"
                                    class="theme-builder-timecode theme-builder-audio-start"
                                    inputmode="numeric"
                                    placeholder="00:00"
                                    maxlength="7"
                                    spellcheck="false"
                                >
                            </label>

                            <label>
                                <span>End</span>
                                <input
                                    type="text"
                                    class="theme-builder-timecode theme-builder-audio-end"
                                    inputmode="numeric"
                                    placeholder="00:20"
                                    maxlength="7"
                                    spellcheck="false"
                                >
                            </label>
                        </div>

                        <label class="feature-toggle-row theme-builder-fade-row">
                            <input
                                type="checkbox"
                                class="theme-builder-audio-fade"
                            >
                            <span>Fade audio out at the end</span>
                        </label>

                        <div class="theme-builder-upload-status theme-builder-audio-status"></div>
                    </section>

                    <section class="theme-builder-media-section theme-builder-svg-section">
                        <div class="theme-builder-media-heading">
                            <div>
                                <strong>Animated Decorations</strong>
                                <small>
                                    Add as many SVG decorations as you want.
                                    Right-click any uploaded SVG to delete it.
                                </small>
                            </div>
                        </div>

                        <input
                            type="file"
                            class="theme-builder-svg-file theme-builder-native-file"
                            accept=".svg,.png,image/svg+xml,image/png"
                            multiple
                        >

                        <div class="theme-builder-svg-toolbar">
                            <button
                                type="button"
                                class="theme-builder-file-button theme-builder-svg-choose"
                            >
                                <i class="ph ph-plus"></i>
                                Add Artwork
                            </button>

                            <span class="theme-builder-svg-count">0 SVGs</span>
                        </div>

                        <div class="theme-builder-svg-list theme-builder-svg-gallery"></div>
                    </section>
                </div>

                <div class="theme-builder-preview-wrap">
                    <span class="field-label">Live Preview</span>

                    <div class="theme-builder-preview">
                        <div class="theme-builder-preview-nav">
                            <i class="ph ph-house"></i>
                            <i class="ph ph-palette"></i>
                            <i class="ph ph-books"></i>
                        </div>

                        <article class="theme-builder-preview-card">
                            <span class="theme-builder-preview-chip">Day 12</span>
                            <h3>Learning Dashboard</h3>
                            <p>
                                Cards, Daily Logs, Knowledge Base, and custom tabs all use your theme.
                            </p>

                            <div class="theme-builder-preview-progress">
                                <span></span>
                            </div>

                            <button type="button">
                                Save Progress
                            </button>
                        </article>
                    </div>
                </div>
            </div>

            <div class="theme-builder-actions">
                <button
                    type="button"
                    class="icon-btn theme-builder-reset"
                >
                    <i class="ph ph-arrow-counter-clockwise"></i>
                    Reset
                </button>

                <button
                    type="button"
                    class="icon-btn custom-tab-primary-btn theme-builder-save"
                    data-enter-submit="true"
                >
                    <i class="ph ph-check"></i>
                    Save &amp; Apply Theme
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(
        modal
    );

    const close =
        () =>
            modal.classList.add(
                'hidden'
            );

    modal
        .querySelector(
            '.theme-builder-close'
        )
        ?.addEventListener(
            'click',
            close
        );

    modal.addEventListener(
        'pointerdown',
        event => {
            if (
                event.target === modal
            ) {
                close();
            }
        }
    );

    return modal;
}

function getThemeBuilderDraft(modal) {
    const draft = {
        ...FEATURE_SUITE_DEFAULT_THEME,
        ...CUSTOM_THEME_MEDIA_DEFAULTS_V3,
        backgroundSvgs:
            Array.isArray(
                modal._themeBackgroundSvgs
            )
                ? modal._themeBackgroundSvgs
                : []
    };

    modal
        .querySelectorAll(
            '[data-theme-key]'
        )
        .forEach(input => {
            const key =
                input.dataset.themeKey;

            draft[key] =
                input.type === 'range' ||
                input.type === 'number'
                    ? Number(
                        input.value
                    )
                    : input.value;
        });

    draft.backgroundImage =
        modal._themeBackgroundImage ||
        '';

    draft.backgroundImageName =
        modal._themeBackgroundImageName ||
        '';

    draft.introAudio =
        modal._themeIntroAudio ||
        '';

    draft.introAudioName =
        modal._themeIntroAudioName ||
        '';

    draft.audioPlayMode =
        getThemeAudioMode(
            modal
        );

    draft.audioStart =
        parseThemeTimecode(
            modal
                .querySelector(
                    '.theme-builder-audio-start'
                )
                ?.value,
            0
        );

    draft.audioEnd =
        parseThemeTimecode(
            modal
                .querySelector(
                    '.theme-builder-audio-end'
                )
                ?.value,
            Math.max(
                1,
                draft.audioStart + 20
            )
        );

    draft.audioFade =
        !!modal
            .querySelector(
                '.theme-builder-audio-fade'
            )
            ?.checked;

    return draft;
}

async function confirmDeleteThemeBuilderSvg(
    modal,
    index
) {
    const asset = modal?._themeBackgroundSvgs?.[index];
    if (!asset) return;

    // V181: remove from the draft immediately. This keeps right-click delete
    // responsive even when the Theme Builder is already open above another
    // modal, and avoids a nested confirmation getting trapped underneath it.
    modal._themeBackgroundSvgs.splice(index, 1);
    try { modal._themeImageSelectionV37 = new Set(); } catch {}
    try { modal._themeImageSelectionAnchorV37 = null; } catch {}

    renderThemeBuilderSvgListV2(modal);
    try { polishThemeImageUploadUiV36?.(modal); } catch {}
    try { updateThemeBuilderPreview(modal); } catch {}

    try {
        if (asset.projectPath && typeof deleteThemeBuilderAssetFromProject === 'function') {
            await deleteThemeBuilderAssetFromProject(asset.projectPath);
        } else if (typeof deleteThemeBuilderProjectAsset === 'function') {
            await deleteThemeBuilderProjectAsset(asset.url);
        }
    } catch {}
}

function renderThemeBuilderSvgListV2(
    modal
) {
    const host =
        modal.querySelector(
            '.theme-builder-svg-list'
        );

    if (!host) return;

    const svgs =
        Array.isArray(
            modal._themeBackgroundSvgs
        )
            ? modal._themeBackgroundSvgs
            : [];

    const count =
        modal.querySelector(
            '.theme-builder-svg-count'
        );

    if (count) {
        count.textContent =
            `${svgs.length} SVG${svgs.length === 1 ? '' : 's'}`;
    }

    host.innerHTML = '';

    if (!svgs.length) {
        host.innerHTML = `
            <button
                type="button"
                class="theme-builder-svg-empty theme-builder-svg-add-empty"
            >
                <i class="ph ph-file-svg"></i>
                <strong>No SVGs uploaded yet</strong>
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

    svgs.forEach(
        (svg, index) => {
            const card =
                document.createElement(
                    'article'
                );

            card.className =
                'theme-builder-svg-card';

            card.dataset.svgIndex =
                String(index);

            card.title =
                'Right-click to delete';

            card.innerHTML = `
                <div class="theme-builder-svg-card-preview">
                    ${renderThemeBuilderSvgAsset(svg)}
                </div>

                <div class="theme-builder-svg-card-copy">
                    <strong>${escapeCustomHtml(svg.name || `SVG ${index + 1}`)}</strong>
                    <small>Right-click to delete</small>
                </div>

                <button
                    type="button"
                    class="small-icon-btn theme-builder-svg-remove"
                    title="Delete SVG"
                    aria-label="Delete SVG"
                >
                    <i class="ph ph-x"></i>
                </button>
            `;

            card
                .querySelector(
                    '.theme-builder-svg-remove'
                )
                ?.addEventListener(
                    'click',
                    event => {
                        event.stopPropagation();

                        confirmDeleteThemeBuilderSvg(
                            modal,
                            index
                        );
                    }
                );

            card.addEventListener(
                'contextmenu',
                event => {
                    event.preventDefault();

                    showCustomItemContextMenu(
                        event.clientX,
                        event.clientY,
                        [
                            {
                                label:
                                    'Delete SVG',
                                icon:
                                    'ph-trash',
                                danger:
                                    true,
                                action:
                                    () =>
                                        confirmDeleteThemeBuilderSvg(
                                            modal,
                                            index
                                        )
                            }
                        ]
                    );
                }
            );

            host.appendChild(
                card
            );
        }
    );

    const addCard =
        document.createElement(
            'button'
        );

    addCard.type = 'button';
    addCard.className =
        'theme-builder-svg-card theme-builder-svg-add-card';

    addCard.innerHTML = `
        <i class="ph ph-plus"></i>
        <strong>Add more SVGs</strong>
    `;

    addCard.addEventListener(
        'click',
        () =>
            modal
                .querySelector(
                    '.theme-builder-svg-file'
                )
                ?.click()
    );

    host.appendChild(
        addCard
    );
}

function updateThemeBuilderPreview(
    modal
) {
    const draft =
        getThemeBuilderDraft(
            modal
        );

    const preview =
        modal.querySelector(
            '.theme-builder-preview'
        );

    const card =
        modal.querySelector(
            '.theme-builder-preview-card'
        );

    const button =
        card?.querySelector(
            'button'
        );

    const chip =
        card?.querySelector(
            '.theme-builder-preview-chip'
        );

    const progress =
        card?.querySelector(
            '.theme-builder-preview-progress span'
        );

    if (!preview || !card) return;

    preview.style.backgroundColor =
        draft.background;

    preview.style.backgroundImage =
        draft.backgroundImage
            ? `linear-gradient(rgba(255,255,255,.08), rgba(255,255,255,.08)), url("${draft.backgroundImage}")`
            : 'none';

    preview.style.backgroundSize =
        'cover';

    preview.style.backgroundPosition =
        'center';

    preview.style.color =
        draft.text;

    preview.style.fontFamily =
        CUSTOM_THEME_FONT_STACKS[
            draft.font
        ] ||
        CUSTOM_THEME_FONT_STACKS.hand;

    card.style.background =
        draft.surface;

    card.style.color =
        draft.text;

    card.style.borderColor =
        draft.border;

    card.style.borderRadius =
        `${draft.radius}px`;

    card.style.boxShadow =
        `${draft.shadow}px ${draft.shadow}px 0 ${draft.border}`;

    if (button) {
        button.style.background =
            draft.accent;

        button.style.color =
            getReadableTextColor(
                draft.accent
            );

        button.style.borderColor =
            draft.border;

        button.style.borderRadius =
            `${Math.max(4, draft.radius - 4)}px`;
    }

    if (chip) {
        chip.style.background =
            `${draft.accent}22`;

        chip.style.color =
            draft.text;
    }

    if (progress) {
        progress.style.background =
            draft.accent;
    }

    modal
        .querySelectorAll(
            '[data-theme-output]'
        )
        .forEach(output => {
            output.textContent =
                String(
                    draft[
                        output.dataset.themeOutput
                    ]
                );
        });

    const backgroundStatus =
        modal.querySelector(
            '.theme-builder-background-status'
        );

    if (backgroundStatus) {
        backgroundStatus.textContent =
            draft.backgroundImage
                ? 'Background image is included in the saved theme.'
                : 'No background image';
    }

    const backgroundName =
        modal.querySelector(
            '.theme-builder-background-name'
        );

    if (backgroundName) {
        backgroundName.textContent =
            draft.backgroundImage
                ? (
                    draft.backgroundImageName ||
                    'Saved background image'
                )
                : 'No image selected';
    }

    const audioStatus =
        modal.querySelector(
            '.theme-builder-audio-status'
        );

    if (audioStatus) {
        if (!draft.introAudio) {
            audioStatus.textContent =
                'No intro audio';
        } else if (
            draft.audioPlayMode ===
            'full'
        ) {
            audioStatus.textContent =
                `Audio ready · full file${draft.audioFade ? ' · fade at end' : ''}`;
        } else {
            audioStatus.textContent =
                `Audio ready · ${formatThemeTimecode(draft.audioStart)}–${formatThemeTimecode(draft.audioEnd)}${draft.audioFade ? ' · fade' : ''}`;
        }
    }

    const audioName =
        modal.querySelector(
            '.theme-builder-audio-name'
        );

    if (audioName) {
        audioName.textContent =
            draft.introAudio
                ? (
                    draft.introAudioName ||
                    'Saved audio'
                )
                : 'No audio selected';
    }
}

function populateThemeBuilder(
    modal,
    theme
) {
    const merged = {
        ...FEATURE_SUITE_DEFAULT_THEME,
        ...CUSTOM_THEME_MEDIA_DEFAULTS_V3,
        ...theme,
        backgroundSvgs:
            Array.isArray(
                theme?.backgroundSvgs
            )
                ? theme.backgroundSvgs
                : []
    };

    const colors = [
        ['Page Background', 'background'],
        ['Cards / Surface', 'surface'],
        ['Main Text', 'text'],
        ['Borders', 'border'],
        ['Accent', 'accent'],
        ['Muted Text', 'muted']
    ];

    modal
        .querySelector(
            '.theme-builder-color-grid'
        ).innerHTML =
        colors
            .map(
                ([label, key]) =>
                    themeBuilderField(
                        label,
                        key,
                        merged[key]
                    )
            )
            .join('');

    modal
        .querySelector(
            '.theme-builder-sliders'
        ).innerHTML =
        themeBuilderField(
            'Corner Radius',
            'radius',
            merged.radius,
            'range'
        ) +
        themeBuilderField(
            'Shadow Size',
            'shadow',
            merged.shadow,
            'range'
        );

    modal
        .querySelector(
            '[data-theme-key="name"]'
        ).value =
        merged.name;

    modal
        .querySelector(
            '[data-theme-key="font"]'
        ).value =
        merged.font;

    modal._themeBackgroundImage =
        merged.backgroundImage ||
        '';

    modal._themeBackgroundImageName =
        merged.backgroundImageName ||
        '';

    modal._themeBackgroundProjectPath =
        merged.backgroundImageProjectPath ||
        '';

    modal._themeIntroAudio =
        merged.introAudio ||
        '';

    modal._themeIntroAudioName =
        merged.introAudioName ||
        '';

    modal._themeAudioProjectPath =
        merged.introAudioProjectPath ||
        '';

    modal._themeBackgroundSvgs =
        merged.backgroundSvgs.map(
            item => ({
                ...item
            })
        );

    const mode =
        merged.audioPlayMode ===
        'segment'
            ? 'segment'
            : 'full';

    modal
        .querySelectorAll(
            'input[name="theme-builder-audio-mode"]'
        )
        .forEach(input => {
            input.checked =
                input.value ===
                mode;

            input.onchange =
                () =>
                    syncThemeAudioModeUi(
                        modal
                    );
        });

    modal
        .querySelector(
            '.theme-builder-audio-start'
        ).value =
        formatThemeTimecode(
            merged.audioStart
        );

    modal
        .querySelector(
            '.theme-builder-audio-end'
        ).value =
        formatThemeTimecode(
            merged.audioEnd
        );

    modal
        .querySelector(
            '.theme-builder-audio-fade'
        ).checked =
        merged.audioFade !== false;

    modal
        .querySelectorAll(
            'input[data-theme-key], select[data-theme-key]'
        )
        .forEach(input => {
            input.oninput =
                () => {
                    const hexInput =
                        modal.querySelector(
                            `[data-theme-hex="${CSS.escape(input.dataset.themeKey)}"]`
                        );

                    if (
                        input.type ===
                            'color' &&
                        hexInput
                    ) {
                        hexInput.value =
                            input.value;
                    }

                    updateThemeBuilderPreview(
                        modal
                    );
                };
        });

    modal
        .querySelectorAll(
            '[data-theme-hex]'
        )
        .forEach(input => {
            input.onchange =
                () => {
                    const value =
                        input.value.trim();

                    if (
                        !/^#[0-9a-f]{6}$/i.test(
                            value
                        )
                    ) {
                        return;
                    }

                    const picker =
                        modal.querySelector(
                            `input[type="color"][data-theme-key="${CSS.escape(input.dataset.themeHex)}"]`
                        );

                    if (picker) {
                        picker.value =
                            value;
                    }

                    updateThemeBuilderPreview(
                        modal
                    );
                };
        });

    const startInput =
        modal.querySelector(
            '.theme-builder-audio-start'
        );

    const endInput =
        modal.querySelector(
            '.theme-builder-audio-end'
        );

    [
        startInput,
        endInput
    ].forEach(input => {
        input?.addEventListener(
            'input',
            () => {
                input.value =
                    input.value.replace(
                        /[^\d:]/g,
                        ''
                    );

                updateThemeBuilderPreview(
                    modal
                );
            }
        );

        input?.addEventListener(
            'blur',
            () => {
                if (
                    isValidThemeTimecode(
                        input.value
                    )
                ) {
                    input.value =
                        formatThemeTimecode(
                            parseThemeTimecode(
                                input.value
                            )
                        );
                }

                updateThemeBuilderPreview(
                    modal
                );
            }
        );
    });

    const backgroundFile =
        modal.querySelector(
            '.theme-builder-background-file'
        );

    modal
        .querySelector(
            '.theme-builder-background-choose'
        ).onclick =
        () =>
            backgroundFile.click();

    backgroundFile.onchange =
        async () => {
            const file =
                backgroundFile.files?.[0];

            if (!file) return;

            const saved =
                await uploadThemeBuilderAssetToProject(
                    file,
                    'background'
                );

            if (!saved) {
                backgroundFile.value = '';
                return;
            }

            const oldUrl =
                modal._themeBackgroundImage;

            modal._themeBackgroundImage =
                saved.url;

            modal._themeBackgroundImageName =
                file.name;

            modal._themeBackgroundProjectPath =
                saved.projectPath ||
                '';

            updateThemeBuilderPreview(
                modal
            );

            if (
                oldUrl &&
                oldUrl !== saved.url
            ) {
                deleteThemeBuilderProjectAsset(
                    oldUrl
                );
            }

            showFeatureToast(
                `Saved image to ${saved.projectPath || saved.url}`
            );
        };

    modal
        .querySelector(
            '.theme-builder-background-clear'
        ).onclick =
        async () => {
            const oldUrl =
                modal._themeBackgroundImage;

            modal._themeBackgroundImage =
                '';

            modal._themeBackgroundImageName =
                '';

            modal._themeBackgroundProjectPath =
                '';

            backgroundFile.value =
                '';

            updateThemeBuilderPreview(
                modal
            );

            await deleteThemeBuilderProjectAsset(
                oldUrl
            );
        };

    const audioFile =
        modal.querySelector(
            '.theme-builder-audio-file'
        );

    modal
        .querySelector(
            '.theme-builder-audio-choose'
        ).onclick =
        () =>
            audioFile.click();

    audioFile.onchange =
        async () => {
            const file =
                audioFile.files?.[0];

            if (!file) return;

            const saved =
                await uploadThemeBuilderAssetToProject(
                    file,
                    'audio'
                );

            if (!saved) {
                audioFile.value = '';
                return;
            }

            const oldUrl =
                modal._themeIntroAudio;

            modal._themeIntroAudio =
                saved.url;

            modal._themeIntroAudioName =
                file.name;

            modal._themeAudioProjectPath =
                saved.projectPath ||
                '';

            updateThemeBuilderPreview(
                modal
            );

            if (
                oldUrl &&
                oldUrl !== saved.url
            ) {
                deleteThemeBuilderProjectAsset(
                    oldUrl
                );
            }

            showFeatureToast(
                `Saved audio to ${saved.projectPath || saved.url}`
            );
        };

    modal
        .querySelector(
            '.theme-builder-audio-clear'
        ).onclick =
        async () => {
            const oldUrl =
                modal._themeIntroAudio;

            modal._themeIntroAudio =
                '';

            modal._themeIntroAudioName =
                '';

            modal._themeAudioProjectPath =
                '';

            audioFile.value =
                '';

            updateThemeBuilderPreview(
                modal
            );

            await deleteThemeBuilderProjectAsset(
                oldUrl
            );
        };

    modal
        .querySelector(
            '.theme-builder-audio-fade'
        ).onchange =
        () =>
            updateThemeBuilderPreview(
                modal
            );

    const svgFile =
        modal.querySelector(
            '.theme-builder-svg-file'
        );

    const svgChoose =
        modal.querySelector(
            '.theme-builder-svg-choose'
        );

    // Newer Theme Builder versions replace the legacy SVG chooser with the
    // unified image-upload toolbar. Keep populateThemeBuilder compatible with
    // both DOM shapes so reopening/importing a theme cannot abort halfway.
    if (svgChoose && svgFile) {
        svgChoose.onclick =
            () =>
                svgFile.click();
    }

    if (svgFile) svgFile.onchange =
        async () => {
            const files =
                Array.from(
                    svgFile.files ||
                    []
                );

            let savedCount = 0;

            for (
                const file of files
            ) {
                const saved =
                    await uploadThemeBuilderAssetToProject(
                        file,
                        'svg'
                    );

                if (!saved) {
                    continue;
                }

                modal
                    ._themeBackgroundSvgs
                    .push({
                        name:
                            file.name,
                        url:
                            saved.url,
                        projectPath:
                            saved.projectPath ||
                            ''
                    });

                savedCount += 1;
            }

            svgFile.value = '';

            renderThemeBuilderSvgListV2(
                modal
            );

            updateThemeBuilderPreview(
                modal
            );

            if (savedCount) {
                showFeatureToast(
                    `Saved ${savedCount} SVG${savedCount === 1 ? '' : 's'} into public/svg.`
                );
            }
        };

    renderThemeBuilderSvgListV2(
        modal
    );

    syncThemeAudioModeUi(
        modal
    );

    updateThemeBuilderPreview(
        modal
    );
}

// ------------------------------------------------------------
// Unlimited animated SVG runtime
// ------------------------------------------------------------

function mountCustomThemeBackgroundSvgsV2(
    theme
) {
    const svgs =
        Array.isArray(
            theme.backgroundSvgs
        )
            ? theme.backgroundSvgs
            : [];

    if (!svgs.length) return;

    const stage =
        document.createElement(
            'div'
        );

    stage.id =
        'custom-theme-background-stage';

    stage.className =
        'custom-theme-background-stage';

    svgs.forEach(
        (svg, index) => {
            const item =
                document.createElement(
                    'div'
                );

            item.className =
                'custom-theme-background-svg';

            const left =
                5 +
                (
                    (
                        index * 31 +
                        11
                    ) %
                    90
                );

            const top =
                7 +
                (
                    (
                        index * 47 +
                        19
                    ) %
                    84
                );

            item.style.left =
                `${left}%`;

            item.style.top =
                `${top}%`;

            item.style.setProperty(
                '--custom-svg-delay',
                `${(index % 13) * -0.42}s`
            );

            item.style.setProperty(
                '--custom-svg-rotate',
                `${((index % 2) ? -1 : 1) * (4 + (index % 9) * 3)}deg`
            );

            item.style.setProperty(
                '--custom-svg-scale',
                String(
                    0.78 +
                    (index % 5) *
                        0.08
                )
            );

            item.innerHTML =
                String(
                    svg?.markup ||
                    ''
                );

            stage.appendChild(
                item
            );
        }
    );

    document.body.prepend(
        stage
    );
}

// ------------------------------------------------------------
// Full-audio or time-range playback
// ------------------------------------------------------------

function clearCustomThemeRuntimeMediaV2() {
    document
        .getElementById(
            'custom-theme-background-stage'
        )
        ?.remove();

    if (customThemeIntroStopTimerV2) {
        clearTimeout(
            customThemeIntroStopTimerV2
        );
    }

    if (customThemeIntroFadeTimerV2) {
        clearInterval(
            customThemeIntroFadeTimerV2
        );
    }

    if (
        customThemeIntroFadeStartTimerV3
    ) {
        clearTimeout(
            customThemeIntroFadeStartTimerV3
        );
    }

    customThemeIntroStopTimerV2 =
        null;

    customThemeIntroFadeTimerV2 =
        null;

    customThemeIntroFadeStartTimerV3 =
        null;

    if (customThemeIntroAudioV2) {
        try {
            customThemeIntroAudioV2.pause();
            customThemeIntroAudioV2.currentTime =
                0;
        } catch (error) {}

        customThemeIntroAudioV2 =
            null;
    }
}

function startCustomThemeAudioFadeV3(
    audio,
    durationMs
) {
    if (
        !audio ||
        durationMs <= 0
    ) {
        return;
    }

    const started =
        performance.now();

    customThemeIntroFadeTimerV2 =
        setInterval(
            () => {
                if (
                    customThemeIntroAudioV2 !==
                    audio
                ) {
                    clearInterval(
                        customThemeIntroFadeTimerV2
                    );

                    customThemeIntroFadeTimerV2 =
                        null;

                    return;
                }

                const progress =
                    Math.min(
                        1,
                        (
                            performance.now() -
                            started
                        ) /
                        durationMs
                    );

                audio.volume =
                    Math.max(
                        0,
                        1 - progress
                    );

                if (
                    progress >= 1
                ) {
                    clearInterval(
                        customThemeIntroFadeTimerV2
                    );

                    customThemeIntroFadeTimerV2 =
                        null;
                }
            },
            50
        );
}

function scheduleCustomThemeAudioEndV3(
    audio,
    playbackSeconds,
    shouldStop,
    shouldFade
) {
    if (
        !Number.isFinite(
            playbackSeconds
        ) ||
        playbackSeconds <= 0
    ) {
        return;
    }

    const totalMs =
        playbackSeconds *
        1000;

    if (
        shouldFade &&
        totalMs > 700
    ) {
        const fadeMs =
            Math.min(
                1800,
                Math.max(
                    500,
                    totalMs * 0.22
                )
            );

        customThemeIntroFadeStartTimerV3 =
            setTimeout(
                () => {
                    if (
                        customThemeIntroAudioV2 ===
                        audio
                    ) {
                        startCustomThemeAudioFadeV3(
                            audio,
                            fadeMs
                        );
                    }
                },
                Math.max(
                    0,
                    totalMs - fadeMs
                )
            );
    }

    if (shouldStop) {
        customThemeIntroStopTimerV2 =
            setTimeout(
                () => {
                    if (
                        customThemeIntroAudioV2 !==
                        audio
                    ) {
                        return;
                    }

                    audio.pause();
                    audio.volume = 1;
                },
                totalMs
            );
    }
}

function legacyPlayCustomThemeIntroAudioV2_C(
    theme
) {
    try { return window.__loggyLogIntroAudioV443?.audio || null; } catch (_) { return null; }
}

// ------------------------------------------------------------
// Media Resources -> Trash
// ------------------------------------------------------------

function moveDailyResourceToTrash(
    dayData,
    resourceIndex
) {
    if (
        !dayData ||
        !Array.isArray(
            dayData.resources
        ) ||
        resourceIndex < 0 ||
        resourceIndex >=
            dayData.resources.length
    ) {
        return;
    }

    normalizeFeatureSuiteSettings();

    const [
        resource
    ] =
        dayData.resources.splice(
            resourceIndex,
            1
        );

    const dayNumber =
        Number(currentDay) ||
        null;

    const entry = {
        deletedAt:
            new Date().toISOString(),
        day:
            dayNumber,
        originalIndex:
            resourceIndex,
        resource:
            JSON.parse(
                JSON.stringify(
                    resource
                )
            )
    };

    getFeatureTrash()
        .resources
        .unshift(
            entry
        );

    saveDb();

    renderResources(
        dayData
    );

    showFeatureToast(
        `Moved “${getDailyResourceDisplayTitle(resource, resourceIndex)}” to Trash.`,
        'Undo',
        () => {
            const trash =
                getFeatureTrash()
                    .resources;

            const index =
                trash.indexOf(
                    entry
                );

            if (index < 0) return;

            trash.splice(
                index,
                1
            );

            if (
                !Array.isArray(
                    dayData.resources
                )
            ) {
                dayData.resources =
                    [];
            }

            dayData.resources.splice(
                Math.max(
                    0,
                    Math.min(
                        resourceIndex,
                        dayData.resources.length
                    )
                ),
                0,
                entry.resource
            );

            saveDb();

            renderResources(
                dayData
            );
        }
    );
}

function getDailyResourceNoteIconClass(
    resource
) {
    if (
        resource?.type ===
        'yt'
    ) {
        return 'ph-youtube-logo';
    }

    if (
        resource?.type ===
        'tiktok'
    ) {
        return 'ph-tiktok-logo';
    }

    return 'ph-link';
}

function upgradeDailyResourceNoteIcons() {
    const notes =
        document.getElementById(
            'log-notes'
        );

    if (!notes) return;

    const resources =
        currentDay
            ? (
                db.days[currentDay]
                    ?.resources ||
                []
            )
            : [];

    notes
        .querySelectorAll(
            'a[data-resource-index]'
        )
        .forEach(link => {
            const savedUrl =
                String(
                    link.dataset.resourceUrl ||
                    ''
                );

            let resource =
                savedUrl
                    ? resources.find(
                        item =>
                            String(
                                item?.url ||
                                ''
                            ) ===
                            savedUrl
                    )
                    : null;

            if (!resource) {
                resource =
                    resources[
                        Number(
                            link.dataset.resourceIndex
                        )
                    ];
            }

            if (!resource) return;

            link.dataset.resourceType =
                resource.type ||
                'link';

            link.innerHTML =
                `<i class="ph ${getDailyResourceNoteIconClass(resource)}"></i>`;
        });
}

function renderResources(dayData) {
    const grid =
        document.getElementById(
            'resources-grid'
        );

    if (!grid) return;

    grid.innerHTML = '';

    const resources =
        dayData.resources ||
        [];

    resources.forEach(
        (res, idx) => {
            const card =
                document.createElement(
                    'div'
                );

            card.classList.add(
                'resource-card',
                res.type ||
                'link'
            );

            card.id =
                `daily-resource-${idx}`;

            card.dataset.resourceIndex =
                String(idx);

            if (
                res.type ===
                'yt'
            ) {
                const startParam =
                    res.start > 0
                        ? `&start=${res.start}`
                        : '';

                card.innerHTML = `
                    <iframe
                        src="https://www.youtube.com/embed/${res.id}?controls=1${startParam}"
                        allow="encrypted-media"
                        allowfullscreen
                    ></iframe>

                    <span class="resource-card-label">
                        YouTube
                    </span>

                    <div class="resource-card-controls">
                        <button
                            class="resource-card-btn"
                            data-action="delete"
                            title="Move to Trash"
                        >
                            <i class="ph ph-trash"></i>
                        </button>
                    </div>
                `;
            } else if (
                res.type ===
                'tiktok'
            ) {
                card.innerHTML = `
                    <iframe
                        src="https://www.tiktok.com/embed/v2/${res.id}"
                        allow="encrypted-media"
                        allowfullscreen
                    ></iframe>

                    <span class="resource-card-label">
                        TikTok
                    </span>

                    <div class="resource-card-controls">
                        <button
                            class="resource-card-btn"
                            data-action="delete"
                            title="Move to Trash"
                        >
                            <i class="ph ph-trash"></i>
                        </button>
                    </div>
                `;
            } else {
                const title =
                    getDailyResourceDisplayTitle(
                        res,
                        idx
                    );

                const domain =
                    getDailyResourceDomain(
                        res
                    );

                card.innerHTML = `
                    <a
                        class="daily-generic-resource-card"
                        href="${escapeCustomHtml(res.url || '#')}"
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Open ${escapeCustomHtml(title)}"
                    >
                        <span class="daily-generic-resource-icon">
                            <i class="ph ph-newspaper-clipping"></i>
                        </span>

                        <span class="daily-generic-resource-copy">
                            <strong>${escapeCustomHtml(title)}</strong>
                            <small>${escapeCustomHtml(domain)}</small>
                        </span>

                        <i class="ph ph-arrow-square-out daily-generic-resource-open"></i>
                    </a>

                    <div class="resource-card-controls">
                        <button
                            class="resource-card-btn"
                            data-action="delete"
                            title="Move to Trash"
                        >
                            <i class="ph ph-trash"></i>
                        </button>
                    </div>
                `;
            }

            card
                .querySelector(
                    '[data-action="delete"]'
                )
                ?.addEventListener(
                    'click',
                    () =>
                        moveDailyResourceToTrash(
                            dayData,
                            idx
                        )
                );

            grid.appendChild(
                card
            );
        }
    );

    upgradeDailyResourceNoteIcons();

    requestAnimationFrame(
        syncNotesHeight
    );
}

// ------------------------------------------------------------
// Trash tab now includes Media Resources
// ------------------------------------------------------------

function ensureTrashViewV2() {
    let view =
        document.getElementById(
            'feature-trash-view'
        );

    if (view) return view;

    view =
        document.createElement(
            'div'
        );

    view.id =
        'feature-trash-view';

    view.className =
        'view feature-trash-view';

    view.innerHTML = `
        <header class="feature-page-header">
            <div>
                <span class="weekly-review-eyebrow">Recover deleted content</span>
                <h1>Trash</h1>
                <p>
                    Restore tabs, components, Knowledge Base items, and Media Resources.
                </p>
            </div>

            <button
                type="button"
                class="small-icon-btn feature-trash-view-empty"
                title="Empty Trash"
            >
                <i class="ph ph-trash"></i>
            </button>
        </header>

        <div class="feature-trash-view-list"></div>
    `;

    document.body.insertBefore(
        view,
        document.getElementById(
            'companion-stage'
        ) ||
        null
    );

    view
        .querySelector(
            '.feature-trash-view-empty'
        )
        .addEventListener(
            'click',
            async () => {
                const trash =
                    getFeatureTrash();

                const total =
                    trash.tabs.length +
                    trash.components.length +
                    trash.kbItems.length +
                    trash.resources.length;

                if (!total) return;

                const confirmed =
                    await showAppConfirm({
                        title:
                            'Empty Trash?',
                        message:
                            'Everything in this log’s Trash will be permanently deleted.',
                        confirmLabel:
                            'Empty Trash'
                    });

                if (!confirmed) return;

                trash.tabs = [];
                trash.components = [];
                trash.kbItems = [];
                trash.resources = [];

                saveDb();

                renderTrashViewV2();
            }
        );

    return view;
}

function renderTrashViewV2() {
    const view =
        ensureTrashViewV2();

    const list =
        view.querySelector(
            '.feature-trash-view-list'
        );

    const trash =
        getFeatureTrash();

    list.innerHTML = '';

    const groups = [
        [
            'Tabs',
            trash.tabs,
            entry =>
                entry.tab?.name ||
                'Untitled Tab',
            'tab'
        ],
        [
            'Components',
            trash.components,
            entry =>
                `${entry.component?.title || entry.component?.text || entry.component?.type || 'Component'} · ${entry.tabName || 'Tab'}`,
            'component'
        ],
        [
            'Knowledge Base',
            trash.kbItems,
            entry =>
                entry.itemId ||
                'Knowledge Item',
            'kb'
        ],
        [
            'Media Resources',
            trash.resources,
            entry =>
                getDailyResourceDisplayTitle(
                    entry.resource,
                    entry.originalIndex
                ),
            'resource'
        ]
    ];

    let total = 0;

    groups.forEach(
        ([
            label,
            entries,
            getLabel,
            type
        ]) => {
            if (!entries.length) {
                return;
            }

            total +=
                entries.length;

            const section =
                document.createElement(
                    'section'
                );

            section.className =
                'feature-trash-group weekly-review-section';

            section.innerHTML = `
                <h3>${escapeCustomHtml(label)}</h3>
                <div class="feature-trash-group-list"></div>
            `;

            const host =
                section.querySelector(
                    '.feature-trash-group-list'
                );

            entries.forEach(
                (entry, index) => {
                    const row =
                        document.createElement(
                            'article'
                        );

                    row.className =
                        'feature-trash-row';

                    const when =
                        entry.deletedAt
                            ? new Date(
                                entry.deletedAt
                            ).toLocaleString()
                            : '';

                    const detail =
                        type ===
                        'resource'
                            ? `Day ${entry.day || '?'} · ${getDailyResourceDomain(entry.resource)}`
                            : when;

                    row.innerHTML = `
                        <div class="feature-trash-copy">
                            <strong>${escapeCustomHtml(getLabel(entry))}</strong>
                            <small>${escapeCustomHtml(detail)}</small>
                            ${
                                type ===
                                'resource'
                                    ? `<small>${escapeCustomHtml(when)}</small>`
                                    : ''
                            }
                        </div>

                        <div class="feature-trash-actions">
                            <button
                                type="button"
                                class="small-icon-btn feature-restore"
                                title="Restore"
                            >
                                <i class="ph ph-arrow-counter-clockwise"></i>
                            </button>

                            <button
                                type="button"
                                class="small-icon-btn feature-delete-permanent"
                                title="Delete permanently"
                            >
                                <i class="ph ph-trash"></i>
                            </button>
                        </div>
                    `;

                    row
                        .querySelector(
                            '.feature-restore'
                        )
                        .addEventListener(
                            'click',
                            () => {
                                if (
                                    type ===
                                    'tab'
                                ) {
                                    const [
                                        restored
                                    ] =
                                        trash.tabs.splice(
                                            index,
                                            1
                                        );

                                    const tabs =
                                        getCustomTabs();

                                    const desired =
                                        Number.isFinite(
                                            Number(
                                                restored.originalIndex
                                            )
                                        )
                                            ? Number(
                                                restored.originalIndex
                                            )
                                            : tabs.length;

                                    tabs.splice(
                                        Math.max(
                                            0,
                                            Math.min(
                                                desired,
                                                tabs.length
                                            )
                                        ),
                                        0,
                                        restored.tab
                                    );

                                    saveDb();
                                    renderCustomTabNavigation();
                                    renderAllCustomTabViews();
                                    updateLogSpecificSideNavScrollState();
                                } else if (
                                    type ===
                                    'component'
                                ) {
                                    const targetTab =
                                        getCustomTab(
                                            entry.tabId
                                        );

                                    if (!targetTab) {
                                        showFeatureToast(
                                            'Restore the original tab first.'
                                        );
                                        return;
                                    }

                                    const [
                                        restored
                                    ] =
                                        trash.components.splice(
                                            index,
                                            1
                                        );

                                    if (
                                        !Array.isArray(
                                            targetTab.components
                                        )
                                    ) {
                                        targetTab.components =
                                            [];
                                    }

                                    const desired =
                                        Number.isFinite(
                                            Number(
                                                restored.originalIndex
                                            )
                                        )
                                            ? Number(
                                                restored.originalIndex
                                            )
                                            : targetTab.components.length;

                                    targetTab.components.splice(
                                        Math.max(
                                            0,
                                            Math.min(
                                                desired,
                                                targetTab.components.length
                                            )
                                        ),
                                        0,
                                        restored.component
                                    );

                                    saveDb();
                                    renderCustomTabView(
                                        targetTab.id
                                    );
                                } else if (
                                    type ===
                                    'kb'
                                ) {
                                    const [
                                        restored
                                    ] =
                                        trash.kbItems.splice(
                                            index,
                                            1
                                        );

                                    const desired =
                                        Number.isFinite(
                                            Number(
                                                restored.originalIndex
                                            )
                                        )
                                            ? Number(
                                                restored.originalIndex
                                            )
                                            : db.phrases.length;

                                    db.phrases.splice(
                                        Math.max(
                                            0,
                                            Math.min(
                                                desired,
                                                db.phrases.length
                                            )
                                        ),
                                        0,
                                        restored.itemId
                                    );

                                    db.phrase_meta[
                                        restored.itemId
                                    ] =
                                        restored.meta ||
                                        {};

                                    saveDb();
                                    renderPhrasesLibrary();
                                } else {
                                    const [
                                        restored
                                    ] =
                                        trash.resources.splice(
                                            index,
                                            1
                                        );

                                    const day =
                                        Number(
                                            restored.day
                                        );

                                    if (!db.days[day]) {
                                        db.days[day] = {};
                                    }

                                    if (
                                        !Array.isArray(
                                            db.days[day].resources
                                        )
                                    ) {
                                        db.days[day].resources =
                                            [];
                                    }

                                    const desired =
                                        Number.isFinite(
                                            Number(
                                                restored.originalIndex
                                            )
                                        )
                                            ? Number(
                                                restored.originalIndex
                                            )
                                            : db.days[day].resources.length;

                                    db.days[day].resources.splice(
                                        Math.max(
                                            0,
                                            Math.min(
                                                desired,
                                                db.days[day].resources.length
                                            )
                                        ),
                                        0,
                                        restored.resource
                                    );

                                    saveDb();

                                    if (
                                        Number(currentDay) ===
                                        day
                                    ) {
                                        renderResources(
                                            db.days[day]
                                        );
                                    }
                                }

                                renderTrashViewV2();
                            }
                        );

                    row
                        .querySelector(
                            '.feature-delete-permanent'
                        )
                        .addEventListener(
                            'click',
                            async () => {
                                const confirmed =
                                    await showAppConfirm({
                                        title:
                                            'Delete permanently?',
                                        message:
                                            `“${getLabel(entry)}” cannot be restored after this.`,
                                        confirmLabel:
                                            'Delete Permanently'
                                    });

                                if (!confirmed) return;

                                entries.splice(
                                    index,
                                    1
                                );

                                saveDb();

                                renderTrashViewV2();
                            }
                        );

                    host.appendChild(
                        row
                    );
                }
            );

            list.appendChild(
                section
            );
        }
    );

    if (!total) {
        list.innerHTML = `
            <div class="feature-empty-state feature-trash-page-empty">
                <i class="ph ph-trash"></i>
                <strong>Trash is empty</strong>
                <span>
                    Deleted tabs, components, Knowledge Base items, and Media Resources will show up here.
                </span>
            </div>
        `;
    }

    view
        .querySelector(
            '.feature-trash-view-empty'
        ).disabled =
        !total;
}

// ------------------------------------------------------------
// Notes media-resource icons: YouTube / TikTok / Link
// ------------------------------------------------------------

function renderNotesResourceChoicesV2() {
    const popup =
        document.getElementById(
            'notes-link-popup'
        );

    if (!popup) return;

    let host =
        popup.querySelector(
            '.notes-media-resource-choices'
        );

    if (!host) {
        host =
            document.createElement(
                'div'
            );

        host.className =
            'notes-media-resource-choices';

        popup.appendChild(
            host
        );
    }

    host.innerHTML = '';

    const resources =
        currentDay
            ? (
                db.days[currentDay]
                    ?.resources ||
                []
            )
            : [];

    if (!resources.length) {
        host.innerHTML = `
            <div class="notes-media-resource-empty">
                No Media Resources on this day yet.
            </div>
        `;

        return;
    }

    const heading =
        document.createElement(
            'span'
        );

    heading.className =
        'notes-resource-choice-heading';

    heading.textContent =
        'Or link to a Media Resource from this day';

    host.appendChild(
        heading
    );

    resources.forEach(
        (resource, index) => {
            const button =
                document.createElement(
                    'button'
                );

            button.type = 'button';

            button.className =
                'notes-media-resource-choice';

            button.innerHTML = `
                <i class="ph ${getDailyResourceNoteIconClass(resource)}"></i>

                <span>
                    <strong>${escapeCustomHtml(getDailyResourceDisplayTitle(resource, index))}</strong>
                    <small>${escapeCustomHtml(getDailyResourceDomain(resource))}</small>
                </span>
            `;

            button.addEventListener(
                'click',
                () => {
                    if (!slashRange) return;

                    insertMediaResourceIconAtRangeV2(
                        slashRange,
                        index
                    );

                    if (currentDay) {
                        db.days[currentDay].notes =
                            document.getElementById(
                                'log-notes'
                            ).innerHTML;

                        scheduleSaveDay();
                    }

                    closeNotesLinkPopup();

                    document
                        .getElementById(
                            'log-notes'
                        )
                        ?.focus();
                }
            );

            host.appendChild(
                button
            );
        }
    );
}

function insertMediaResourceIconAtRangeV2(
    range,
    resourceIndex
) {
    if (!range) return;

    const resource =
        currentDay
            ? db.days[currentDay]
                ?.resources?.[
                    resourceIndex
                ]
            : null;

    if (!resource) return;

    const icon =
        document.createElement(
            'a'
        );

    icon.href =
        `#daily-resource-${resourceIndex}`;

    icon.dataset.resourceIndex =
        String(
            resourceIndex
        );

    icon.dataset.resourceUrl =
        String(
            resource.url ||
            ''
        );

    icon.dataset.resourceType =
        resource.type ||
        'link';

    icon.className =
        'notes-link-icon daily-resource-notes-link';

    icon.title =
        `Jump to ${getDailyResourceDisplayTitle(resource, resourceIndex)}`;

    icon.contentEditable =
        'false';

    icon.innerHTML =
        `<i class="ph ${getDailyResourceNoteIconClass(resource)}"></i>`;

    range.deleteContents();
    range.insertNode(
        icon
    );

    const space =
        document.createTextNode(
            '\u00A0'
        );

    range.setStartAfter(
        icon
    );

    range.insertNode(
        space
    );

    range.setStartAfter(
        space
    );

    range.collapse(
        true
    );

    const selection =
        window.getSelection();

    selection.removeAllRanges();

    selection.addRange(
        range
    );
}

function insertMediaResourceIconAtRange(
    range,
    resourceIndex
) {
    insertMediaResourceIconAtRangeV2(
        range,
        resourceIndex
    );
}


// ============================================================
// GLOBAL SEARCH BORDER + ESCAPE MODAL FIX
// ============================================================

function forceDailyGlobalSearchInputBorderless() {
    const input = document.getElementById('daily-global-search-input');
    if (!input) return;

    [
        ['border', '0'],
        ['border-width', '0'],
        ['border-style', 'none'],
        ['outline', '0'],
        ['box-shadow', 'none'],
        ['background', 'transparent'],
        ['background-color', 'transparent'],
        ['border-radius', '0'],
        ['appearance', 'none'],
        ['-webkit-appearance', 'none']
    ].forEach(([property, value]) => {
        input.style.setProperty(property, value, 'important');
    });
}

function closeTopVisibleModalWithEscape() {
    const modals = Array.from(
        document.querySelectorAll('.modal-overlay:not(.hidden)')
    );
    const modal = modals[modals.length - 1];
    if (!modal) return false;

    const selectors = [
        '#app-confirm-cancel',
        '#app-prompt-cancel',
        '.custom-tab-create-close',
        '.custom-tab-settings-close',
        '.daily-collection-close',
        '.daily-custom-tab-picker-close',
        '.backup-restore-close',
        '.feature-trash-close',
        '.theme-builder-close',
        '.kb-category-create-close',
        '.kb-field-create-close',
        '#daily-logs-local-settings-close',
        '#developer-mode-close',
        '.close-btn',
        '[id$="-close"]',
        '[id*="close"]'
    ];

    const closeControl = selectors
        .map(selector => modal.querySelector(selector))
        .find(Boolean);

    if (closeControl) closeControl.click();
    else modal.classList.add('hidden');

    return true;
}

if (!document.documentElement.dataset.modalEscapeEverywhereBound) {
    document.documentElement.dataset.modalEscapeEverywhereBound = 'true';

    document.addEventListener('keydown', event => {
        if (event.key !== 'Escape' || event.repeat) return;

        if (closeTopVisibleModalWithEscape()) {
            event.preventDefault();
            event.stopPropagation();
        }
    });
}

requestAnimationFrame(forceDailyGlobalSearchInputBorderless);

document.addEventListener('focusin', event => {
    if (event.target?.id === 'daily-global-search-input') {
        forceDailyGlobalSearchInputBorderless();
    }
});


// ============================================================
// THEME BUILDER PROJECT ASSET STORAGE
// New uploads are copied into the real project folders by server.js.
// ============================================================

async function readThemeAssetAsDataUrlForProject(file) {
    return new Promise(resolve => {
        if (!file) {
            resolve('');
            return;
        }

        const reader = new FileReader();

        reader.onload =
            () =>
                resolve(
                    String(
                        reader.result ||
                        ''
                    )
                );

        reader.onerror =
            () =>
                resolve('');

        reader.readAsDataURL(
            file
        );
    });
}

async function checkThemeBuilderAssetServer() {
    try {
        const response = await fetch('/api/theme-assets-status', {
            method: 'GET',
            cache: 'no-store'
        });

        if (!response.ok) {
            return {
                ok: false,
                message:
                    'The Theme Builder file-save endpoint is not active. Replace the project root server.js with the updated server.js and restart the Node server.'
            };
        }

        const result = await response.json().catch(() => ({}));

        if (result?.feature !== 'theme-assets') {
            return {
                ok: false,
                message:
                    'The running server is an older version. Replace server.js and restart the Node server.'
            };
        }

        return { ok: true };
    } catch (error) {
        return {
            ok: false,
            message:
                'Could not reach the local Node server. Make sure server.js is running, then try again.'
        };
    }
}

async function uploadThemeBuilderAssetToProject(
    file,
    kind
) {
    if (!file) return null;

    const serverStatus =
        await checkThemeBuilderAssetServer();

    if (!serverStatus.ok) {
        showFeatureToast(
            serverStatus.message
        );
        return null;
    }

    const dataUrl =
        await readThemeAssetAsDataUrlForProject(
            file
        );

    if (!dataUrl) {
        showFeatureToast(
            `Could not read “${file.name}”.`
        );
        return null;
    }

    let response;

    try {
        response = await fetch(
            `/api/theme-assets/${encodeURIComponent(HOBBY)}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type':
                        'application/json'
                },
                body: JSON.stringify({
                    kind,
                    fileName: file.name,
                    dataUrl
                })
            }
        );
    } catch (error) {
        showFeatureToast(
            'The local server connection failed while saving the file.'
        );
        return null;
    }

    const rawText = await response.text();
    let result = {};

    try {
        result = rawText
            ? JSON.parse(rawText)
            : {};
    } catch (error) {
        result = {};
    }

    if (!response.ok) {
        let message =
            result.message ||
            `Could not save “${file.name}” into the project.`;

        if (response.status === 404) {
            message =
                'The Theme Builder upload endpoint was not found. Replace the project root server.js with the updated server.js and restart Node.';
        } else if (response.status === 413) {
            message =
                result.message ||
                `“${file.name}” is too large to upload.`;
        } else if (!result.message && rawText) {
            message =
                `Server error ${response.status} while saving “${file.name}”.`;
        }

        showFeatureToast(message);
        console.error(
            'Theme Builder asset upload failed:',
            response.status,
            rawText
        );
        return null;
    }

    if (!result.url || !result.projectPath) {
        showFeatureToast(
            'The server saved an incomplete Theme Builder response. Restart the updated server.js and try again.'
        );
        return null;
    }

    return result;
}

async function deleteThemeBuilderProjectAsset(
    url
) {
    const value =
        String(url || '');

    if (
        !value ||
        value.startsWith('data:') ||
        value.startsWith('blob:')
    ) {
        return true;
    }

    try {
        const response =
            await fetch(
                `/api/theme-assets/${encodeURIComponent(HOBBY)}`,
                {
                    method: 'DELETE',
                    headers: {
                        'Content-Type':
                            'application/json'
                    },
                    body:
                        JSON.stringify({
                            url: value
                        })
                }
            );

        if (!response.ok) {
            const result =
                await response
                    .json()
                    .catch(
                        () => ({})
                    );

            showFeatureToast(
                result.message ||
                'Could not remove the old Theme Builder file from the project.'
            );

            return false;
        }

        return true;
    } catch (error) {
        showFeatureToast(
            'Could not remove the old Theme Builder file from the project.'
        );

        return false;
    }
}

function renderThemeBuilderSvgAsset(
    svg
) {
    if (svg?.url) {
        return `
            <img
                src="${escapeCustomHtml(svg.url)}"
                alt=""
                draggable="false"
            >
        `;
    }

    return String(
        svg?.markup ||
        ''
    );
}



function getThemeBuilderDraft(modal) {
    const draft = {
        ...FEATURE_SUITE_DEFAULT_THEME,
        ...CUSTOM_THEME_MEDIA_DEFAULTS_V3,
        backgroundSvgs:
            Array.isArray(
                modal._themeBackgroundSvgs
            )
                ? modal._themeBackgroundSvgs
                : []
    };

    modal
        .querySelectorAll(
            '[data-theme-key]'
        )
        .forEach(input => {
            const key =
                input.dataset.themeKey;

            draft[key] =
                input.type === 'range' ||
                input.type === 'number'
                    ? Number(
                        input.value
                    )
                    : input.value;
        });

    draft.backgroundImage =
        modal._themeBackgroundImage ||
        '';

    draft.backgroundImageName =
        modal._themeBackgroundImageName ||
        '';

    draft.backgroundImageProjectPath =
        modal._themeBackgroundProjectPath ||
        '';

    draft.introAudio =
        modal._themeIntroAudio ||
        '';

    draft.introAudioName =
        modal._themeIntroAudioName ||
        '';

    draft.introAudioProjectPath =
        modal._themeAudioProjectPath ||
        '';

    draft.audioPlayMode =
        getThemeAudioMode(
            modal
        );

    draft.audioStart =
        parseThemeTimecode(
            modal
                .querySelector(
                    '.theme-builder-audio-start'
                )
                ?.value,
            0
        );

    draft.audioEnd =
        parseThemeTimecode(
            modal
                .querySelector(
                    '.theme-builder-audio-end'
                )
                ?.value,
            Math.max(
                1,
                draft.audioStart + 20
            )
        );

    draft.audioFade =
        !!modal
            .querySelector(
                '.theme-builder-audio-fade'
            )
            ?.checked;

    return draft;
}

// URL-backed SVGs live as real files under public/svg, while old embedded
// custom themes remain backwards-compatible.
function mountCustomThemeBackgroundSvgsV2(
    theme
) {
    const svgs =
        Array.isArray(
            theme.backgroundSvgs
        )
            ? theme.backgroundSvgs
            : [];

    if (!svgs.length) return;

    const stage =
        document.createElement(
            'div'
        );

    stage.id =
        'custom-theme-background-stage';

    stage.className =
        'custom-theme-background-stage';

    svgs.forEach(
        (svg, index) => {
            const item =
                document.createElement(
                    'div'
                );

            item.className =
                'custom-theme-background-svg';

            const left =
                5 +
                (
                    (
                        index * 31 +
                        11
                    ) %
                    90
                );

            const top =
                7 +
                (
                    (
                        index * 47 +
                        19
                    ) %
                    84
                );

            item.style.left =
                `${left}%`;

            item.style.top =
                `${top}%`;

            item.style.setProperty(
                '--custom-svg-delay',
                `${(index % 13) * -0.42}s`
            );

            item.style.setProperty(
                '--custom-svg-rotate',
                `${((index % 2) ? -1 : 1) * (4 + (index % 9) * 3)}deg`
            );

            item.style.setProperty(
                '--custom-svg-scale',
                String(
                    0.78 +
                    (index % 5) *
                        0.08
                )
            );

            if (svg?.url) {
                const image =
                    document.createElement(
                        'img'
                    );

                image.src =
                    svg.url;

                image.alt =
                    '';

                image.draggable =
                    false;

                item.appendChild(
                    image
                );
            } else {
                item.innerHTML =
                    String(
                        svg?.markup ||
                        ''
                    );
            }

            stage.appendChild(
                item
            );
        }
    );

    document.body.prepend(
        stage
    );
}



// ============================================================
// THEME BUILDER V4 — PAGE COLORS, BACKDROPS & REAL PAGE PREVIEW
// ============================================================

const CUSTOM_THEME_VISUAL_DEFAULTS_V4 = {
    tabIconColor: '#171717',
    tabTitleColor: '#171717',

    dailyLogBackgroundEnabled: false,
    dailyLogBackgroundColor: '#ffffff',
    dailyLogBackgroundOpacity: 92,

    contentBackdropEnabled: false,
    contentBackdropColor: '#ffffff',
    contentBackdropOpacity: 0,

    // V429: optional backgrounds behind log-page section/page headings.
    // This is intentionally OFF by default; AI themes may choose the color,
    // opacity, and padding, but the user turns the feature on manually.
    headingBackgroundEnabledV429: false,
    headingBackgroundPaddingV429: 10
};

function normalizeFeatureSuiteSettings() {
    if (!db.settings) db.settings = {};

    if (
        !db.settings.trash ||
        typeof db.settings.trash !== 'object'
    ) {
        db.settings.trash = {};
    }

    [
        'tabs',
        'components',
        'kbItems',
        'resources'
    ].forEach(key => {
        if (
            !Array.isArray(
                db.settings.trash[key]
            )
        ) {
            db.settings.trash[key] = [];
        }
    });

    if (
        !db.settings.weeklyReviewNotes ||
        typeof db.settings.weeklyReviewNotes !==
            'object'
    ) {
        db.settings.weeklyReviewNotes = {};
    }

    if (
        !Array.isArray(
            db.settings.deletedThemes
        )
    ) {
        db.settings.deletedThemes = [];
    }

    if (
        db.settings.customThemeDeleted ===
        undefined
    ) {
        db.settings.customThemeDeleted = false;
    }

    const existing =
        db.settings.customTheme &&
        typeof db.settings.customTheme ===
            'object'
            ? db.settings.customTheme
            : null;

    const legacyMode =
        existing?.introAudio &&
        !existing?.audioPlayMode
            ? 'segment'
            : 'full';

    db.settings.customTheme = {
        ...FEATURE_SUITE_DEFAULT_THEME,
        ...CUSTOM_THEME_MEDIA_DEFAULTS_V3,
        ...CUSTOM_THEME_VISUAL_DEFAULTS_V4,
        ...(existing || {}),
        audioPlayMode:
            existing?.audioPlayMode ||
            legacyMode,
        backgroundSvgs:
            Array.isArray(
                existing?.backgroundSvgs
            )
                ? existing.backgroundSvgs
                : []
    };
}

function themeBuilderToggleRowV4({
    className,
    title,
    detail,
    checked
}) {
    return `
        <label class="theme-builder-visual-toggle ${className || ''}">
            <input
                type="checkbox"
                ${checked ? 'checked' : ''}
            >
            <span class="theme-builder-visual-toggle-copy">
                <strong>${escapeCustomHtml(title)}</strong>
                <small>${escapeCustomHtml(detail)}</small>
            </span>
            <span class="theme-builder-switch" aria-hidden="true"></span>
        </label>
    `;
}

function themeBuilderOpacityControlV4(
    label,
    className,
    value
) {
    return `
        <label class="theme-builder-opacity-field">
            <span>
                ${escapeCustomHtml(label)}
                <output>${Math.round(Number(value) || 0)}%</output>
            </span>
            <input
                type="range"
                class="${escapeCustomHtml(className)}"
                min="0"
                max="100"
                step="1"
                value="${Math.max(0, Math.min(100, Number(value) || 0))}"
            >
        </label>
    `;
}

function ensureThemeBuilderModal() {
    document
        .getElementById(
            'theme-builder-modal'
        )
        ?.remove();

    const modal =
        document.createElement(
            'div'
        );

    modal.id =
        'theme-builder-modal';

    modal.className =
        'modal-overlay hidden theme-builder-modal';

    modal.innerHTML = `
        <div class="modal-box theme-builder-box theme-builder-box-expanded theme-builder-box-v4">
            <div class="modal-header">
                <div>
                    <h2>Theme Builder</h2>
                    <p class="feature-modal-subtitle">
                        Design the actual pages, navigation, background, media, and decorations.
                    </p>
                </div>

                <button
                    type="button"
                    class="small-icon-btn theme-builder-close"
                    title="Close"
                >
                    <i class="ph ph-x"></i>
                </button>
            </div>

            <div class="theme-builder-layout theme-builder-layout-v4">
                <div class="theme-builder-controls">
                    <label class="theme-builder-field">
                        <span>Theme Name</span>
                        <input
                            type="text"
                            data-theme-key="name"
                            maxlength="36"
                        >
                    </label>

                    <section class="theme-builder-control-section">
                        <div class="theme-builder-control-heading">
                            <strong>Main Colors</strong>
                            <small>Cards, text, borders, buttons, and the base page.</small>
                        </div>

                        <div class="theme-builder-color-grid"></div>
                    </section>

                    <section class="theme-builder-control-section">
                        <div class="theme-builder-control-heading">
                            <strong>Navigation &amp; Page Titles</strong>
                            <small>These are independent from your normal text color.</small>
                        </div>

                        <div class="theme-builder-color-grid theme-builder-nav-color-grid"></div>
                    </section>

                    <section class="theme-builder-control-section theme-builder-background-controls">
                        <div class="theme-builder-control-heading">
                            <strong>Page Backdrops</strong>
                            <small>
                                Control whether your background image stays fully visible or has a colored layer behind page content.
                            </small>
                        </div>

                        <div class="theme-builder-daily-backdrop-settings"></div>
                        <div class="theme-builder-other-backdrop-settings"></div>
                    </section>

                    <section class="theme-builder-control-section">
                        <div class="theme-builder-control-heading">
                            <strong>Shape &amp; Type</strong>
                        </div>

                        <div class="theme-builder-sliders"></div>

                        <label class="theme-builder-field">
                            <span>Font Style</span>
                            <select data-theme-key="font">
                                <option value="hand">Handwritten</option>
                                <option value="clean">Clean Sans</option>
                                <option value="serif">Book Serif</option>
                                <option value="mono">Monospace</option>
                            </select>
                        </label>
                    </section>

                    <section class="theme-builder-media-section">
                        <div class="theme-builder-media-heading">
                            <div>
                                <strong>Background Image</strong>
                                <small>Optional full-page image behind every page.</small>
                            </div>

                            <button
                                type="button"
                                class="small-icon-btn theme-builder-background-clear"
                                title="Remove background image"
                            >
                                <i class="ph ph-x"></i>
                            </button>
                        </div>

                        <input
                            type="file"
                            class="theme-builder-background-file theme-builder-native-file"
                            accept="image/*"
                        >

                        <div class="theme-builder-file-picker-row">
                            <button
                                type="button"
                                class="theme-builder-file-button theme-builder-background-choose"
                            >
                                <i class="ph ph-image-square"></i>
                                Choose Image
                            </button>

                            <span class="theme-builder-file-name theme-builder-background-name">
                                No image selected
                            </span>
                        </div>

                        <div class="theme-builder-upload-status theme-builder-background-status"></div>
                    </section>

                    <section class="theme-builder-media-section">
                        <div class="theme-builder-media-heading">
                            <div>
                                <strong>Intro Audio</strong>
                                <small>
                                    Play the whole file or choose a 00:00 start and end.
                                </small>
                            </div>

                            <button
                                type="button"
                                class="small-icon-btn theme-builder-audio-clear"
                                title="Remove audio"
                            >
                                <i class="ph ph-x"></i>
                            </button>
                        </div>

                        <input
                            type="file"
                            class="theme-builder-audio-file theme-builder-native-file"
                            accept="audio/*"
                        >

                        <div class="theme-builder-file-picker-row">
                            <button
                                type="button"
                                class="theme-builder-file-button theme-builder-audio-choose"
                            >
                                <i class="ph ph-music-notes"></i>
                                Choose Audio
                            </button>

                            <span class="theme-builder-file-name theme-builder-audio-name">
                                No audio selected
                            </span>
                        </div>

                        <div class="theme-builder-audio-mode">
                            <label class="theme-builder-audio-mode-option">
                                <input
                                    type="radio"
                                    name="theme-builder-audio-mode"
                                    value="full"
                                >
                                <span>
                                    <i class="ph ph-play-circle"></i>
                                    <strong>Play Full Audio</strong>
                                    <small>Play from the beginning until it ends.</small>
                                </span>
                            </label>

                            <label class="theme-builder-audio-mode-option">
                                <input
                                    type="radio"
                                    name="theme-builder-audio-mode"
                                    value="segment"
                                >
                                <span>
                                    <i class="ph ph-selection"></i>
                                    <strong>Use Start &amp; End</strong>
                                    <small>Play only the time range you type.</small>
                                </span>
                            </label>
                        </div>

                        <div class="theme-builder-audio-timing">
                            <label>
                                <span>Start</span>
                                <input
                                    type="text"
                                    class="theme-builder-timecode theme-builder-audio-start"
                                    inputmode="numeric"
                                    placeholder="00:00"
                                    maxlength="7"
                                    spellcheck="false"
                                >
                            </label>

                            <label>
                                <span>End</span>
                                <input
                                    type="text"
                                    class="theme-builder-timecode theme-builder-audio-end"
                                    inputmode="numeric"
                                    placeholder="00:20"
                                    maxlength="7"
                                    spellcheck="false"
                                >
                            </label>
                        </div>

                        <label class="feature-toggle-row theme-builder-fade-row">
                            <input
                                type="checkbox"
                                class="theme-builder-audio-fade"
                            >
                            <span>Fade audio out at the end</span>
                        </label>

                        <div class="theme-builder-upload-status theme-builder-audio-status"></div>
                    </section>

                    <section class="theme-builder-media-section theme-builder-svg-section">
                        <div class="theme-builder-media-heading">
                            <div>
                                <strong>Animated Decorations</strong>
                                <small>
                                    Add as many SVG or PNG decorations as you want. Right-click artwork to delete it.
                                </small>
                            </div>
                        </div>

                        <input
                            type="file"
                            class="theme-builder-svg-file theme-builder-native-file"
                            accept=".svg,.png,image/svg+xml,image/png"
                            multiple
                        >

                        <div class="theme-builder-svg-toolbar">
                            <button
                                type="button"
                                class="theme-builder-file-button theme-builder-svg-choose"
                            >
                                <i class="ph ph-plus"></i>
                                Add Artwork
                            </button>

                            <span class="theme-builder-svg-count">0 SVGs</span>
                        </div>

                        <div class="theme-builder-svg-list theme-builder-svg-gallery"></div>
                    </section>
                </div>

                <div class="theme-builder-preview-wrap theme-builder-real-preview-wrap">
                    <div class="theme-builder-preview-header">
                        <div>
                            <span class="field-label">Real Page Preview</span>
                            <small>Switch pages to see how the same theme behaves.</small>
                        </div>

                        <div class="theme-builder-preview-page-tabs" role="tablist">
                            <button
                                type="button"
                                class="theme-builder-preview-page active"
                                data-preview-page="daily"
                            >
                                Daily Logs
                            </button>

                            <button
                                type="button"
                                class="theme-builder-preview-page"
                                data-preview-page="knowledge"
                            >
                                Knowledge
                            </button>

                            <button
                                type="button"
                                class="theme-builder-preview-page"
                                data-preview-page="custom"
                            >
                                Custom Tab
                            </button>
                        </div>
                    </div>

                    <div class="theme-builder-app-preview" data-active-preview="daily">
                        <div class="theme-builder-preview-background-art"></div>

                        <aside class="theme-builder-real-nav">
                            <i class="ph ph-house"></i>
                            <i class="ph ph-palette"></i>
                            <span></span>
                            <i class="ph ph-calendar-blank"></i>
                            <i class="ph ph-wrench"></i>
                            <i class="ph ph-books"></i>
                            <i class="ph ph-question"></i>
                            <i class="ph ph-trash"></i>
                            <i class="ph ph-calendar-check"></i>
                            <i class="ph ph-star"></i>
                        </aside>

                        <section class="theme-builder-real-page theme-builder-real-page-daily active">
                            <div class="theme-builder-real-page-backdrop"></div>

                            <div class="theme-builder-real-page-content">
                                <div class="theme-builder-real-page-heading">
                                    <div>
                                        <small>DAILY LOGS</small>
                                        <h2>My Learning Log</h2>
                                    </div>
                                    <button type="button">
                                        <i class="ph ph-sliders-horizontal"></i>
                                    </button>
                                </div>

                                <div class="theme-builder-real-search-row">
                                    <div>
                                        <i class="ph ph-calendar-blank"></i>
                                        <span>Search Daily Logs…</span>
                                    </div>
                                    <div>
                                        <i class="ph ph-magnifying-glass"></i>
                                        <span>Search everything…</span>
                                    </div>
                                </div>

                                <div class="theme-builder-real-day-grid">
                                    <article>
                                        <div class="theme-builder-real-polaroid-image"></div>
                                        <strong>Day 12</strong>
                                        <small>September 3</small>
                                    </article>

                                    <article>
                                        <div class="theme-builder-real-polaroid-image alt"></div>
                                        <strong>Day 11</strong>
                                        <small>September 2</small>
                                    </article>

                                    <article class="theme-builder-real-add-day">
                                        <i class="ph ph-plus"></i>
                                    </article>
                                </div>
                            </div>
                        </section>

                        <section class="theme-builder-real-page theme-builder-real-page-knowledge">
                            <div class="theme-builder-real-page-backdrop"></div>

                            <div class="theme-builder-real-page-content">
                                <div class="theme-builder-real-page-heading">
                                    <div>
                                        <small>KNOWLEDGE BASE</small>
                                        <h2>Knowledge Base</h2>
                                    </div>
                                    <button type="button">
                                        <i class="ph ph-plus"></i>
                                    </button>
                                </div>

                                <div class="theme-builder-real-category-row">
                                    <article>
                                        <i class="ph ph-translate"></i>
                                        <strong>Korean</strong>
                                        <small>18 items</small>
                                    </article>

                                    <article>
                                        <i class="ph ph-code"></i>
                                        <strong>Web Dev</strong>
                                        <small>9 items</small>
                                    </article>

                                    <article>
                                        <i class="ph ph-book-open"></i>
                                        <strong>Reading</strong>
                                        <small>7 items</small>
                                    </article>
                                </div>

                                <article class="theme-builder-real-detail-card">
                                    <span>Recently learned</span>
                                    <h3>Sentence Patterns</h3>
                                    <p>A saved Knowledge Base card would look like this on the selected backdrop.</p>
                                </article>
                            </div>
                        </section>

                        <section class="theme-builder-real-page theme-builder-real-page-custom">
                            <div class="theme-builder-real-page-backdrop"></div>

                            <div class="theme-builder-real-page-content">
                                <div class="theme-builder-real-page-heading">
                                    <div>
                                        <small>CUSTOM TAB</small>
                                        <h2>Korean</h2>
                                    </div>
                                    <button type="button">
                                        <i class="ph ph-sliders-horizontal"></i>
                                    </button>
                                </div>

                                <div class="theme-builder-real-component-grid">
                                    <article>
                                        <span>Vocabulary</span>
                                        <h3>This Week</h3>
                                        <div class="theme-builder-real-list-line"></div>
                                        <div class="theme-builder-real-list-line short"></div>
                                        <div class="theme-builder-real-list-line"></div>
                                    </article>

                                    <article>
                                        <span>Progress</span>
                                        <h3>Speaking</h3>
                                        <div class="theme-builder-real-progress">
                                            <span></span>
                                        </div>
                                        <small>68% complete</small>
                                    </article>

                                    <article class="wide">
                                        <span>Practice Notes</span>
                                        <p>
                                            Custom components use your card surface, text, title color, and the page backdrop you choose.
                                        </p>
                                    </article>
                                </div>
                            </div>
                        </section>
                    </div>

                    <div class="theme-builder-preview-legend">
                        <span><i class="ph ph-circle-fill"></i> Background image / base</span>
                        <span><i class="ph ph-square-fill"></i> Page backdrop</span>
                        <span><i class="ph ph-navigation-arrow-fill"></i> Tab icon color</span>
                    </div>
                </div>
            </div>

            <div class="theme-builder-actions">
                <button
                    type="button"
                    class="icon-btn theme-builder-reset"
                >
                    <i class="ph ph-arrow-counter-clockwise"></i>
                    Reset
                </button>

                <button
                    type="button"
                    class="icon-btn custom-tab-primary-btn theme-builder-save"
                    data-enter-submit="true"
                >
                    <i class="ph ph-check"></i>
                    Save &amp; Apply Theme
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(
        modal
    );

    const close =
        () =>
            modal.classList.add(
                'hidden'
            );

    modal
        .querySelector(
            '.theme-builder-close'
        )
        ?.addEventListener(
            'click',
            close
        );

    modal.addEventListener(
        'pointerdown',
        event => {
            if (
                event.target === modal
            ) {
                close();
            }
        }
    );

    modal
        .querySelectorAll(
            '.theme-builder-preview-page'
        )
        .forEach(button => {
            button.addEventListener(
                'click',
                () => {
                    modal
                        .querySelectorAll(
                            '.theme-builder-preview-page'
                        )
                        .forEach(item =>
                            item.classList.remove(
                                'active'
                            )
                        );

                    button.classList.add(
                        'active'
                    );

                    const page =
                        button.dataset.previewPage ||
                        'daily';

                    const appPreview =
                        modal.querySelector(
                            '.theme-builder-app-preview'
                        );

                    if (appPreview) {
                        appPreview.dataset.activePreview =
                            page;
                    }

                    modal
                        .querySelectorAll(
                            '.theme-builder-real-page'
                        )
                        .forEach(item =>
                            item.classList.toggle(
                                'active',
                                item.classList.contains(
                                    `theme-builder-real-page-${page}`
                                )
                            )
                        );

                    updateThemeBuilderPreview(
                        modal
                    );
                }
            );
        });

    return modal;
}

function getThemeBuilderDraft(
    modal
) {
    const draft = {
        ...FEATURE_SUITE_DEFAULT_THEME,
        ...CUSTOM_THEME_MEDIA_DEFAULTS_V3,
        ...CUSTOM_THEME_VISUAL_DEFAULTS_V4,
        backgroundSvgs:
            Array.isArray(
                modal._themeBackgroundSvgs
            )
                ? modal._themeBackgroundSvgs
                : []
    };

    modal
        .querySelectorAll(
            '[data-theme-key]'
        )
        .forEach(input => {
            const key =
                input.dataset.themeKey;

            draft[key] =
                input.type === 'range' ||
                input.type === 'number'
                    ? Number(
                        input.value
                    )
                    : input.value;
        });

    draft.backgroundImage =
        modal._themeBackgroundImage ||
        '';

    draft.backgroundImageName =
        modal._themeBackgroundImageName ||
        '';

    draft.backgroundImageProjectPath =
        modal._themeBackgroundProjectPath ||
        '';

    draft.introAudio =
        modal._themeIntroAudio ||
        '';

    draft.introAudioName =
        modal._themeIntroAudioName ||
        '';

    draft.introAudioProjectPath =
        modal._themeAudioProjectPath ||
        '';

    draft.audioPlayMode =
        getThemeAudioMode(
            modal
        );

    draft.audioStart =
        parseThemeTimecode(
            modal
                .querySelector(
                    '.theme-builder-audio-start'
                )
                ?.value,
            0
        );

    draft.audioEnd =
        parseThemeTimecode(
            modal
                .querySelector(
                    '.theme-builder-audio-end'
                )
                ?.value,
            Math.max(
                1,
                draft.audioStart + 20
            )
        );

    draft.audioFade =
        !!modal
            .querySelector(
                '.theme-builder-audio-fade'
            )
            ?.checked;

    draft.dailyLogBackgroundEnabled =
        !!modal
            .querySelector(
                '.theme-builder-daily-backdrop-enabled'
            )
            ?.checked;

    draft.dailyLogBackgroundOpacity =
        Number(
            modal
                .querySelector(
                    '.theme-builder-daily-backdrop-opacity'
                )
                ?.value
        ) || 0;

    draft.contentBackdropEnabled =
        !!modal
            .querySelector(
                '.theme-builder-other-backdrop-enabled'
            )
            ?.checked;

    draft.contentBackdropOpacity =
        Number(
            modal
                .querySelector(
                    '.theme-builder-other-backdrop-opacity'
                )
                ?.value
        ) || 0;

    return draft;
}

function getThemeBuilderPreviewBackdropV4(
    draft,
    page
) {
    if (page === 'daily') {
        return {
            enabled:
                !!draft.dailyLogBackgroundEnabled,
            color:
                draft.dailyLogBackgroundColor ||
                '#ffffff',
            opacity:
                Number(
                    draft.dailyLogBackgroundOpacity
                ) || 0
        };
    }

    return {
        enabled:
            !!draft.contentBackdropEnabled,
        color:
            draft.contentBackdropColor ||
            '#ffffff',
        opacity:
            Number(
                draft.contentBackdropOpacity
            ) || 0
    };
}

function hexToRgbaV4(
    hex,
    opacity
) {
    const value =
        String(hex || '#ffffff')
            .replace('#', '');

    if (
        !/^[0-9a-f]{6}$/i.test(
            value
        )
    ) {
        return `rgba(255,255,255,${opacity})`;
    }

    const r =
        parseInt(
            value.slice(0, 2),
            16
        );

    const g =
        parseInt(
            value.slice(2, 4),
            16
        );

    const b =
        parseInt(
            value.slice(4, 6),
            16
        );

    return `rgba(${r},${g},${b},${opacity})`;
}

function updateThemeBuilderPreview(
    modal
) {
    const draft =
        getThemeBuilderDraft(
            modal
        );

    const appPreview =
        modal.querySelector(
            '.theme-builder-app-preview'
        );

    if (!appPreview) return;

    appPreview.style.setProperty(
        '--preview-background',
        draft.background
    );

    appPreview.style.setProperty(
        '--preview-surface',
        draft.surface
    );

    appPreview.style.setProperty(
        '--preview-text',
        draft.text
    );

    appPreview.style.setProperty(
        '--preview-muted',
        draft.muted
    );

    appPreview.style.setProperty(
        '--preview-border',
        draft.border
    );

    appPreview.style.setProperty(
        '--preview-accent',
        draft.accent
    );

    appPreview.style.setProperty(
        '--preview-icon-color',
        draft.tabIconColor
    );

    appPreview.style.setProperty(
        '--preview-title-color',
        draft.tabTitleColor
    );

    appPreview.style.setProperty(
        '--preview-radius',
        `${draft.radius}px`
    );

    appPreview.style.setProperty(
        '--preview-shadow',
        `${draft.shadow}px ${draft.shadow}px 0 ${draft.border}`
    );

    appPreview.style.fontFamily =
        CUSTOM_THEME_FONT_STACKS[
            draft.font
        ] ||
        CUSTOM_THEME_FONT_STACKS.hand;

    appPreview.style.backgroundColor =
        draft.background;

    appPreview.style.backgroundImage =
        draft.backgroundImage
            ? `url("${draft.backgroundImage}")`
            : 'none';

    appPreview.style.backgroundSize =
        'cover';

    appPreview.style.backgroundPosition =
        'center';

    const activePage =
        appPreview.dataset.activePreview ||
        'daily';

    const backdrop =
        getThemeBuilderPreviewBackdropV4(
            draft,
            activePage
        );

    const activeBackdrop =
        modal.querySelector(
            '.theme-builder-real-page.active .theme-builder-real-page-backdrop'
        );

    if (activeBackdrop) {
        activeBackdrop.style.background =
            backdrop.enabled
                ? hexToRgbaV4(
                    backdrop.color,
                    Math.max(
                        0,
                        Math.min(
                            100,
                            backdrop.opacity
                        )
                    ) / 100
                )
                : 'transparent';
    }

    modal
        .querySelectorAll(
            '.theme-builder-real-page:not(.active) .theme-builder-real-page-backdrop'
        )
        .forEach(element => {
            element.style.background =
                'transparent';
        });

    const svgArt =
        modal.querySelector(
            '.theme-builder-preview-background-art'
        );

    if (svgArt) {
        svgArt.innerHTML = '';

        (
            draft.backgroundSvgs ||
            []
        )
            .slice(0, 6)
            .forEach(
                (svg, index) => {
                    const item =
                        document.createElement(
                            'div'
                        );

                    item.className =
                        'theme-builder-preview-svg-art';

                    item.style.left =
                        `${8 + ((index * 29) % 82)}%`;

                    item.style.top =
                        `${10 + ((index * 37) % 76)}%`;

                    item.innerHTML =
                        renderThemeBuilderSvgAsset(
                            svg
                        );

                    svgArt.appendChild(
                        item
                    );
                }
            );
    }

    modal
        .querySelectorAll(
            '[data-theme-output]'
        )
        .forEach(output => {
            output.textContent =
                String(
                    draft[
                        output.dataset.themeOutput
                    ]
                );
        });

    const dailyOpacity =
        modal.querySelector(
            '.theme-builder-daily-backdrop-opacity'
        );

    if (dailyOpacity) {
        const output =
            dailyOpacity
                .closest(
                    '.theme-builder-opacity-field'
                )
                ?.querySelector(
                    'output'
                );

        if (output) {
            output.textContent =
                `${Math.round(Number(dailyOpacity.value) || 0)}%`;
        }
    }

    const otherOpacity =
        modal.querySelector(
            '.theme-builder-other-backdrop-opacity'
        );

    if (otherOpacity) {
        const output =
            otherOpacity
                .closest(
                    '.theme-builder-opacity-field'
                )
                ?.querySelector(
                    'output'
                );

        if (output) {
            output.textContent =
                `${Math.round(Number(otherOpacity.value) || 0)}%`;
        }
    }

    modal
        .querySelector(
            '.theme-builder-daily-backdrop-details'
        )
        ?.classList.toggle(
            'disabled',
            !draft.dailyLogBackgroundEnabled
        );

    modal
        .querySelector(
            '.theme-builder-other-backdrop-details'
        )
        ?.classList.toggle(
            'disabled',
            !draft.contentBackdropEnabled
        );

    const backgroundStatus =
        modal.querySelector(
            '.theme-builder-background-status'
        );

    if (backgroundStatus) {
        backgroundStatus.textContent =
            draft.backgroundImage
                ? 'Background image ready'
                : 'No background image';
    }

    const backgroundName =
        modal.querySelector(
            '.theme-builder-background-name'
        );

    if (backgroundName) {
        backgroundName.textContent =
            draft.backgroundImage
                ? (
                    draft.backgroundImageName ||
                    'Saved background image'
                )
                : 'No image selected';
    }

    const audioStatus =
        modal.querySelector(
            '.theme-builder-audio-status'
        );

    if (audioStatus) {
        if (!draft.introAudio) {
            audioStatus.textContent =
                'No intro audio';
        } else if (
            draft.audioPlayMode ===
            'full'
        ) {
            audioStatus.textContent =
                `Audio ready · full file${draft.audioFade ? ' · fade at end' : ''}`;
        } else {
            audioStatus.textContent =
                `Audio ready · ${formatThemeTimecode(draft.audioStart)}–${formatThemeTimecode(draft.audioEnd)}${draft.audioFade ? ' · fade' : ''}`;
        }
    }

    const audioName =
        modal.querySelector(
            '.theme-builder-audio-name'
        );

    if (audioName) {
        audioName.textContent =
            draft.introAudio
                ? (
                    draft.introAudioName ||
                    'Saved audio'
                )
                : 'No audio selected';
    }

    renderThemeBuilderSvgListV2(
        modal
    );
}

function populateThemeBuilder(
    modal,
    theme
) {
    const merged = {
        ...FEATURE_SUITE_DEFAULT_THEME,
        ...CUSTOM_THEME_MEDIA_DEFAULTS_V3,
        ...CUSTOM_THEME_VISUAL_DEFAULTS_V4,
        ...theme,
        backgroundSvgs:
            Array.isArray(
                theme?.backgroundSvgs
            )
                ? theme.backgroundSvgs
                : []
    };

    const mainColors = [
        ['Page Background', 'background'],
        ['Cards / Surface', 'surface'],
        ['Main Text', 'text'],
        ['Borders', 'border'],
        ['Accent', 'accent'],
        ['Muted Text', 'muted']
    ];

    const navColors = [
        ['Tab Icon Color', 'tabIconColor'],
        ['Tab Title Color', 'tabTitleColor']
    ];

    modal
        .querySelector(
            '.theme-builder-color-grid'
        ).innerHTML =
        mainColors
            .map(
                ([label, key]) =>
                    themeBuilderField(
                        label,
                        key,
                        merged[key]
                    )
            )
            .join('');

    modal
        .querySelector(
            '.theme-builder-nav-color-grid'
        ).innerHTML =
        navColors
            .map(
                ([label, key]) =>
                    themeBuilderField(
                        label,
                        key,
                        merged[key]
                    )
            )
            .join('');

    modal
        .querySelector(
            '.theme-builder-sliders'
        ).innerHTML =
        themeBuilderField(
            'Corner Radius',
            'radius',
            merged.radius,
            'range'
        ) +
        themeBuilderField(
            'Shadow Size',
            'shadow',
            merged.shadow,
            'range'
        );

    modal
        .querySelector(
            '.theme-builder-daily-backdrop-settings'
        ).innerHTML = `
            ${themeBuilderToggleRowV4({
                className:
                    'theme-builder-daily-toggle',
                title:
                    'Background behind Daily Logs',
                detail:
                    'Turn this off to let the main background image show directly behind Daily Logs.',
                checked:
                    !!merged.dailyLogBackgroundEnabled
            })}

            <div class="theme-builder-backdrop-details theme-builder-daily-backdrop-details">
                ${themeBuilderField(
                    'Daily Log Background Color',
                    'dailyLogBackgroundColor',
                    merged.dailyLogBackgroundColor
                )}

                ${themeBuilderOpacityControlV4(
                    'Daily Log Background Opacity',
                    'theme-builder-daily-backdrop-opacity',
                    merged.dailyLogBackgroundOpacity
                )}
            </div>
        `;

    modal
        .querySelector(
            '.theme-builder-other-backdrop-settings'
        ).innerHTML = `
            ${themeBuilderToggleRowV4({
                className:
                    'theme-builder-other-toggle',
                title:
                    'Backdrop behind other tabs',
                detail:
                    'This replaces the old automatic white overlay. Leave it off for no overlay at all.',
                checked:
                    !!merged.contentBackdropEnabled
            })}

            <div class="theme-builder-backdrop-details theme-builder-other-backdrop-details">
                ${themeBuilderField(
                    'Other Page Backdrop Color',
                    'contentBackdropColor',
                    merged.contentBackdropColor
                )}

                ${themeBuilderOpacityControlV4(
                    'Other Page Backdrop Opacity',
                    'theme-builder-other-backdrop-opacity',
                    merged.contentBackdropOpacity
                )}
            </div>
        `;

    modal
        .querySelector(
            '.theme-builder-daily-backdrop-enabled'
        );

    const dailyToggle =
        modal.querySelector(
            '.theme-builder-daily-toggle input'
        );

    if (dailyToggle) {
        dailyToggle.classList.add(
            'theme-builder-daily-backdrop-enabled'
        );
    }

    const otherToggle =
        modal.querySelector(
            '.theme-builder-other-toggle input'
        );

    if (otherToggle) {
        otherToggle.classList.add(
            'theme-builder-other-backdrop-enabled'
        );
    }

    modal
        .querySelector(
            '[data-theme-key="name"]'
        ).value =
        merged.name;

    modal
        .querySelector(
            '[data-theme-key="font"]'
        ).value =
        merged.font;

    modal._themeBackgroundImage =
        merged.backgroundImage ||
        '';

    modal._themeBackgroundImageName =
        merged.backgroundImageName ||
        '';

    modal._themeBackgroundProjectPath =
        merged.backgroundImageProjectPath ||
        '';

    modal._themeIntroAudio =
        merged.introAudio ||
        '';

    modal._themeIntroAudioName =
        merged.introAudioName ||
        '';

    modal._themeAudioProjectPath =
        merged.introAudioProjectPath ||
        '';

    modal._themeBackgroundSvgs =
        merged.backgroundSvgs.map(
            item => ({
                ...item
            })
        );

    const mode =
        merged.audioPlayMode ===
        'segment'
            ? 'segment'
            : 'full';

    modal
        .querySelectorAll(
            'input[name="theme-builder-audio-mode"]'
        )
        .forEach(input => {
            input.checked =
                input.value ===
                mode;

            input.onchange =
                () =>
                    syncThemeAudioModeUi(
                        modal
                    );
        });

    modal
        .querySelector(
            '.theme-builder-audio-start'
        ).value =
        formatThemeTimecode(
            merged.audioStart
        );

    modal
        .querySelector(
            '.theme-builder-audio-end'
        ).value =
        formatThemeTimecode(
            merged.audioEnd
        );

    modal
        .querySelector(
            '.theme-builder-audio-fade'
        ).checked =
        merged.audioFade !== false;

    modal
        .querySelectorAll(
            'input[data-theme-key], select[data-theme-key]'
        )
        .forEach(input => {
            input.oninput =
                () => {
                    const hexInput =
                        modal.querySelector(
                            `[data-theme-hex="${CSS.escape(input.dataset.themeKey)}"]`
                        );

                    if (
                        input.type ===
                            'color' &&
                        hexInput
                    ) {
                        hexInput.value =
                            input.value;
                    }

                    updateThemeBuilderPreview(
                        modal
                    );
                };
        });

    modal
        .querySelectorAll(
            '[data-theme-hex]'
        )
        .forEach(input => {
            input.oninput =
                () => {
                    const value =
                        input.value.trim();

                    if (
                        !/^#[0-9a-f]{6}$/i.test(
                            value
                        )
                    ) {
                        return;
                    }

                    const picker =
                        modal.querySelector(
                            `input[type="color"][data-theme-key="${CSS.escape(input.dataset.themeHex)}"]`
                        );

                    if (picker) {
                        picker.value =
                            value;
                    }

                    updateThemeBuilderPreview(
                        modal
                    );
                };
        });

    [
        dailyToggle,
        otherToggle,
        modal.querySelector(
            '.theme-builder-daily-backdrop-opacity'
        ),
        modal.querySelector(
            '.theme-builder-other-backdrop-opacity'
        )
    ].forEach(input => {
        input?.addEventListener(
            'input',
            () =>
                updateThemeBuilderPreview(
                    modal
                )
        );

        input?.addEventListener(
            'change',
            () =>
                updateThemeBuilderPreview(
                    modal
                )
        );
    });

    const startInput =
        modal.querySelector(
            '.theme-builder-audio-start'
        );

    const endInput =
        modal.querySelector(
            '.theme-builder-audio-end'
        );

    [
        startInput,
        endInput
    ].forEach(input => {
        input?.addEventListener(
            'input',
            () => {
                input.value =
                    input.value.replace(
                        /[^\d:]/g,
                        ''
                    );

                updateThemeBuilderPreview(
                    modal
                );
            }
        );

        input?.addEventListener(
            'blur',
            () => {
                if (
                    isValidThemeTimecode(
                        input.value
                    )
                ) {
                    input.value =
                        formatThemeTimecode(
                            parseThemeTimecode(
                                input.value
                            )
                        );
                }

                updateThemeBuilderPreview(
                    modal
                );
            }
        );
    });

    const backgroundFile =
        modal.querySelector(
            '.theme-builder-background-file'
        );

    modal
        .querySelector(
            '.theme-builder-background-choose'
        ).onclick =
        () =>
            backgroundFile.click();

    backgroundFile.onchange =
        async () => {
            const file =
                backgroundFile.files?.[0];

            if (!file) return;

            const saved =
                await uploadThemeBuilderAssetToProject(
                    file,
                    'background'
                );

            if (!saved) {
                backgroundFile.value = '';
                return;
            }

            const oldUrl =
                modal._themeBackgroundImage;

            modal._themeBackgroundImage =
                saved.url;

            modal._themeBackgroundImageName =
                file.name;

            modal._themeBackgroundProjectPath =
                saved.projectPath ||
                '';

            updateThemeBuilderPreview(
                modal
            );

            if (
                oldUrl &&
                oldUrl !== saved.url
            ) {
                deleteThemeBuilderProjectAsset(
                    oldUrl
                );
            }
        };

    modal
        .querySelector(
            '.theme-builder-background-clear'
        ).onclick =
        async () => {
            const oldUrl =
                modal._themeBackgroundImage;

            modal._themeBackgroundImage =
                '';

            modal._themeBackgroundImageName =
                '';

            modal._themeBackgroundProjectPath =
                '';

            backgroundFile.value =
                '';

            updateThemeBuilderPreview(
                modal
            );

            await deleteThemeBuilderProjectAsset(
                oldUrl
            );
        };

    const audioFile =
        modal.querySelector(
            '.theme-builder-audio-file'
        );

    modal
        .querySelector(
            '.theme-builder-audio-choose'
        ).onclick =
        () =>
            audioFile.click();

    audioFile.onchange =
        async () => {
            const file =
                audioFile.files?.[0];

            if (!file) return;

            const saved =
                await uploadThemeBuilderAssetToProject(
                    file,
                    'audio'
                );

            if (!saved) {
                audioFile.value = '';
                return;
            }

            const oldUrl =
                modal._themeIntroAudio;

            modal._themeIntroAudio =
                saved.url;

            modal._themeIntroAudioName =
                file.name;

            modal._themeAudioProjectPath =
                saved.projectPath ||
                '';

            updateThemeBuilderPreview(
                modal
            );

            if (
                oldUrl &&
                oldUrl !== saved.url
            ) {
                deleteThemeBuilderProjectAsset(
                    oldUrl
                );
            }
        };

    modal
        .querySelector(
            '.theme-builder-audio-clear'
        ).onclick =
        async () => {
            const oldUrl =
                modal._themeIntroAudio;

            modal._themeIntroAudio =
                '';

            modal._themeIntroAudioName =
                '';

            modal._themeAudioProjectPath =
                '';

            audioFile.value =
                '';

            updateThemeBuilderPreview(
                modal
            );

            await deleteThemeBuilderProjectAsset(
                oldUrl
            );
        };

    modal
        .querySelector(
            '.theme-builder-audio-fade'
        ).onchange =
        () =>
            updateThemeBuilderPreview(
                modal
            );

    const svgFile =
        modal.querySelector(
            '.theme-builder-svg-file'
        );

    const svgChoose =
        modal.querySelector(
            '.theme-builder-svg-choose'
        );

    // Newer Theme Builder versions replace the legacy SVG chooser with the
    // unified image-upload toolbar. Keep populateThemeBuilder compatible with
    // both DOM shapes so reopening/importing a theme cannot abort halfway.
    if (svgChoose && svgFile) {
        svgChoose.onclick =
            () =>
                svgFile.click();
    }

    if (svgFile) svgFile.onchange =
        async () => {
            const files =
                Array.from(
                    svgFile.files ||
                    []
                );

            for (
                const file of files
            ) {
                const saved =
                    await uploadThemeBuilderAssetToProject(
                        file,
                        'svg'
                    );

                if (!saved) continue;

                modal
                    ._themeBackgroundSvgs
                    .push({
                        name:
                            file.name,
                        url:
                            saved.url,
                        projectPath:
                            saved.projectPath ||
                            ''
                    });
            }

            svgFile.value =
                '';

            renderThemeBuilderSvgListV2(
                modal
            );

            updateThemeBuilderPreview(
                modal
            );
        };

    renderThemeBuilderSvgListV2(
        modal
    );

    syncThemeAudioModeUi(
        modal
    );

    updateThemeBuilderPreview(
        modal
    );
}

function applyCustomBuiltTheme(
    theme = getCustomThemeSettings()
) {
    clearCustomThemeRuntimeMediaV2();

    const root =
        document.documentElement;

    const radius =
        Math.max(
            0,
            Math.min(
                30,
                Number(theme.radius) ||
                    0
            )
        );

    const shadow =
        Math.max(
            0,
            Math.min(
                12,
                Number(theme.shadow) ||
                    0
            )
        );

    const accentText =
        getReadableTextColor(
            theme.accent
        );

    root.style.setProperty(
        '--white',
        theme.surface
    );

    root.style.setProperty(
        '--black',
        theme.text
    );

    root.style.setProperty(
        '--muted-text',
        theme.muted
    );

    root.style.setProperty(
        '--track-bg',
        `${theme.accent}18`
    );

    root.style.setProperty(
        '--thin-border',
        `1.5px solid ${theme.border}`
    );

    root.style.setProperty(
        '--thick-border',
        `2.5px solid ${theme.border}`
    );

    root.style.setProperty(
        '--border-radius',
        `${radius}px`
    );

    root.style.setProperty(
        '--custom-theme-accent',
        theme.accent
    );

    root.style.setProperty(
        '--custom-theme-accent-text',
        accentText
    );

    root.style.setProperty(
        '--custom-theme-shadow',
        `${shadow}px ${shadow}px 0 ${theme.border}`
    );

    root.style.setProperty(
        '--custom-theme-font',
        CUSTOM_THEME_FONT_STACKS[
            theme.font
        ] ||
        CUSTOM_THEME_FONT_STACKS.hand
    );

    root.style.setProperty(
        '--custom-theme-page-bg',
        theme.background
    );

    root.style.setProperty(
        '--custom-theme-border-color',
        theme.border
    );

    root.style.setProperty(
        '--custom-theme-background-image',
        theme.backgroundImage
            ? `url("${String(theme.backgroundImage).replace(/"/g, '\\"')}")`
            : 'none'
    );

    root.style.setProperty(
        '--custom-theme-tab-icon-color',
        theme.tabIconColor ||
        theme.text
    );

    root.style.setProperty(
        '--custom-theme-tab-title-color',
        theme.tabTitleColor ||
        theme.text
    );

    root.style.setProperty(
        '--custom-theme-daily-bg-color',
        theme.dailyLogBackgroundColor ||
        theme.surface
    );

    root.style.setProperty(
        '--custom-theme-daily-bg-opacity',
        theme.dailyLogBackgroundEnabled
            ? `${Math.max(0, Math.min(100, Number(theme.dailyLogBackgroundOpacity) || 0))}%`
            : '0%'
    );

    root.style.setProperty(
        '--custom-theme-content-backdrop-color',
        theme.contentBackdropColor ||
        theme.surface
    );

    root.style.setProperty(
        '--custom-theme-content-backdrop-opacity',
        theme.contentBackdropEnabled
            ? `${Math.max(0, Math.min(100, Number(theme.contentBackdropOpacity) || 0))}%`
            : '0%'
    );

    // V496: Heading Backdrop owns its own color/opacity/padding/radius.
    // Never mirror Page Backdrop values here: this legacy apply layer runs after
    // some newer theme code and used to repaint a saved heading back to white.
    const headingBackdropEnabledV496 = theme.headingBackgroundEnabledV429 === true;
    root.style.setProperty(
        '--custom-theme-heading-bg-color-v429',
        theme.headingBackgroundColorV452 || theme.contentBackdropColor || theme.surface
    );
    root.style.setProperty(
        '--custom-theme-heading-bg-opacity-v429',
        headingBackdropEnabledV496
            ? `${Math.max(0, Math.min(100, Number(theme.headingBackgroundOpacityV452 ?? theme.contentBackdropOpacity) || 0))}%`
            : '0%'
    );
    root.style.setProperty(
        '--custom-theme-heading-bg-padding-v429',
        headingBackdropEnabledV496
            ? `${Math.max(0, Math.min(40, Number(theme.headingBackgroundPaddingV429) || 0))}px`
            : '0px'
    );
    root.style.setProperty(
        '--custom-theme-heading-bg-radius-v452',
        headingBackdropEnabledV496
            ? `${Math.max(0, Math.min(40, Number(theme.headingBackgroundRadiusV452 ?? theme.radius) || 0))}px`
            : '0px'
    );


    // V505: template-extras-1 redeclares applyCustomBuiltTheme after template.js.
    // Route that real active apply function back through the single core Heading
    // Backdrop authority so it cannot silently drop the enabled dataset/variables.
    try { window.__loggyApplyCoreHeadingBackdropV505?.(theme); } catch (_) {}

    root.style.setProperty('--custom-theme-theme-settings-plus-icon-v322', theme.themeSettingsPlusIconColorV322 || theme.text);
    root.style.setProperty('--custom-theme-theme-settings-plus-background-v322', theme.themeSettingsPlusBackgroundColorV322 || theme.surface);
    root.style.setProperty('--custom-theme-theme-settings-plus-border-v322', theme.themeSettingsPlusBorderColorV322 || theme.border);
    root.style.setProperty('--custom-theme-theme-settings-plus-hover-icon-v322', theme.themeSettingsPlusHoverIconColorV322 || theme.text);
    root.style.setProperty('--custom-theme-theme-settings-plus-hover-background-v322', theme.themeSettingsPlusHoverBackgroundColorV322 || theme.hoverColor || theme.accent);
    root.style.setProperty('--custom-theme-theme-settings-plus-hover-border-v322', theme.themeSettingsPlusHoverBorderColorV322 || theme.border);

    mountCustomThemeBackgroundSvgsV2(
        theme
    );

    playCustomThemeIntroAudioV2(
        theme
    );
}

function clearCustomBuiltTheme() {
    clearCustomThemeRuntimeMediaV2();

    const root =
        document.documentElement;

    [
        '--white',
        '--black',
        '--muted-text',
        '--track-bg',
        '--thin-border',
        '--thick-border',
        '--border-radius',
        '--custom-theme-accent',
        '--custom-theme-accent-text',
        '--custom-theme-shadow',
        '--custom-theme-font',
        '--custom-theme-page-bg',
        '--custom-theme-border-color',
        '--custom-theme-background-image',
        '--custom-theme-tab-icon-color',
        '--custom-theme-tab-title-color',
        '--custom-theme-daily-bg-color',
        '--custom-theme-daily-bg-opacity',
        '--custom-theme-content-backdrop-color',
        '--custom-theme-content-backdrop-opacity',
        '--custom-theme-heading-bg-color-v429',
        '--custom-theme-heading-bg-opacity-v429',
        '--custom-theme-heading-bg-padding-v429',
        '--custom-theme-heading-bg-radius-v452',
        '--custom-theme-theme-settings-plus-icon-v322',
        '--custom-theme-theme-settings-plus-background-v322',
        '--custom-theme-theme-settings-plus-border-v322',
        '--custom-theme-theme-settings-plus-hover-icon-v322',
        '--custom-theme-theme-settings-plus-hover-background-v322',
        '--custom-theme-theme-settings-plus-hover-border-v322'
    ].forEach(name =>
        root.style.removeProperty(
            name
        )
    );
}



// ============================================================
// THEME BUILDER V5 — ACTUAL PAGE LIVE PREVIEW
// Uses cloned real application DOM instead of a fabricated mock page.
// ============================================================

function getThemeBuilderPreviewSourceOptionsV5() {
    const views =
        Array.from(
            document.querySelectorAll(
                'body > .view'
            )
        );

    return views
        .filter(view => {
            if (
                !view?.id ||
                view.id ===
                    'quiz-learn-view'
            ) {
                return false;
            }

            return true;
        })
        .map(view => {
            let label = '';

            if (
                view.id ===
                'grid-view'
            ) {
                label =
                    'Daily Logs';
            } else if (
                view.id ===
                'log-view'
            ) {
                label =
                    currentDay
                        ? `Day ${currentDay}`
                        : 'Daily Log';
            } else if (
                view.id ===
                'toolbox-view'
            ) {
                label =
                    'Toolbox';
            } else if (
                view.id ===
                'phrases-library-view'
            ) {
                label =
                    'Knowledge Base';
            } else if (
                view.id ===
                'quizzes-view'
            ) {
                label =
                    'Quizzes';
            } else if (
                view.id ===
                'weekly-review-view'
            ) {
                label =
                    'Weekly Review';
            } else if (
                view.id ===
                'feature-trash-view'
            ) {
                label =
                    'Trash';
            } else if (
                view.dataset?.customTabId
            ) {
                const tab =
                    getCustomTab(
                        view.dataset
                            .customTabId
                    );

                label =
                    tab?.name ||
                    'Custom Tab';
            } else {
                label =
                    view
                        .querySelector(
                            'h1, h2'
                        )
                        ?.textContent
                        ?.trim() ||
                    view.id.replace(
                        /[-_]+/g,
                        ' '
                    );
            }

            return {
                id:
                    view.id,
                label
            };
        });
}

function stripThemeBuilderCloneIdsV5(
    root
) {
    if (!root) return;

    if (root.id) {
        root.dataset.previewOriginalId =
            root.id;

        root.removeAttribute(
            'id'
        );
    }

    root
        .querySelectorAll(
            '[id]'
        )
        .forEach(element => {
            element.dataset.previewOriginalId =
                element.id;

            element.removeAttribute(
                'id'
            );
        });

    root
        .querySelectorAll(
            'input, textarea, select, button, a, [contenteditable]'
        )
        .forEach(element => {
            element.tabIndex = -1;

            if (
                element.matches(
                    'input, textarea, select'
                )
            ) {
                element.disabled =
                    true;
            }

            if (
                element.hasAttribute(
                    'contenteditable'
                )
            ) {
                element.removeAttribute(
                    'contenteditable'
                );
            }
        });
}

function ensureActualThemeBuilderPreviewV5(
    modal
) {
    const wrap =
        modal.querySelector(
            '.theme-builder-real-preview-wrap'
        );

    if (!wrap) return;

    if (
        wrap.dataset.actualPreviewReady ===
        'true'
    ) {
        return;
    }

    const activeView =
        Array.from(
            document.querySelectorAll(
                'body > .view.active'
            )
        )[0];

    modal._themeBuilderPreviewSourceId =
        activeView?.id ||
        'grid-view';

    wrap.dataset.actualPreviewReady =
        'true';

    wrap.innerHTML = `
        <div class="theme-builder-live-preview-header">
            <div>
                <span class="field-label">Actual Page Preview</span>
            </div>

            <div class="theme-builder-live-preview-controls">
                <select
                    class="theme-builder-live-preview-select"
                    aria-label="Page to preview"
                ></select>

                <button
                    type="button"
                    class="small-icon-btn theme-builder-live-preview-refresh"
                    title="Refresh actual page preview"
                >
                    <i class="ph ph-arrow-clockwise"></i>
                </button>
            </div>
        </div>

        <div class="theme-builder-live-preview-viewport">
            <div class="theme-builder-live-preview-stage"></div>
        </div>

    `;

    const select =
        wrap.querySelector(
            '.theme-builder-live-preview-select'
        );

    const options =
        getThemeBuilderPreviewSourceOptionsV5();

    select.innerHTML =
        options
            .map(option => `
                <option
                    value="${escapeCustomHtml(option.id)}"
                    ${
                        option.id ===
                        modal._themeBuilderPreviewSourceId
                            ? 'selected'
                            : ''
                    }
                >
                    ${escapeCustomHtml(option.label)}
                </option>
            `)
            .join('');

    if (
        !options.some(
            option =>
                option.id ===
                modal._themeBuilderPreviewSourceId
        )
    ) {
        modal._themeBuilderPreviewSourceId =
            options[0]?.id ||
            'grid-view';

        select.value =
            modal._themeBuilderPreviewSourceId;
    }

    select.addEventListener(
        'change',
        () => {
            modal._themeBuilderPreviewSourceId =
                select.value;

            rebuildActualThemeBuilderPreviewV5(
                modal
            );
        }
    );

    wrap
        .querySelector(
            '.theme-builder-live-preview-refresh'
        )
        ?.addEventListener(
            'click',
            () =>
                rebuildActualThemeBuilderPreviewV5(
                    modal
                )
        );

    rebuildActualThemeBuilderPreviewV5(
        modal
    );
}

function rebuildActualThemeBuilderPreviewV5(
    modal
) {
    const stage =
        modal.querySelector(
            '.theme-builder-live-preview-stage'
        );

    if (!stage) return;

    const source =
        document.getElementById(
            modal._themeBuilderPreviewSourceId ||
            'grid-view'
        ) ||
        document.querySelector(
            'body > .view.active'
        ) ||
        gridView;

    const realNav =
        document.querySelector(
            'body > .side-nav'
        );

    stage.innerHTML = '';

    const canvas =
        document.createElement(
            'div'
        );

    canvas.className =
        'theme-builder-live-canvas theme-custom-builder';

    canvas.dataset.previewSourceId =
        source?.id ||
        '';

    if (realNav) {
        const navClone =
            realNav.cloneNode(
                true
            );

        stripThemeBuilderCloneIdsV5(
            navClone
        );

        navClone.classList.add(
            'theme-builder-live-side-nav'
        );

        canvas.appendChild(
            navClone
        );
    }

    if (source) {
        const pageClone =
            source.cloneNode(
                true
            );

        stripThemeBuilderCloneIdsV5(
            pageClone
        );

        pageClone.classList.add(
            'theme-builder-live-page'
        );

        pageClone.classList.add(
            'active'
        );

        pageClone.classList.remove(
            'hidden'
        );

        canvas.appendChild(
            pageClone
        );
    }

    stage.appendChild(
        canvas
    );

    applyThemeBuilderDraftToActualPreviewV5(
        modal
    );
}

function applyThemeBuilderDraftToActualPreviewV5(
    modal
) {
    const canvas =
        modal.querySelector(
            '.theme-builder-live-canvas'
        );

    if (!canvas) return;

    const draft =
        getThemeBuilderDraft(
            modal
        );

    const radius =
        Math.max(
            0,
            Math.min(
                30,
                Number(
                    draft.radius
                ) || 0
            )
        );

    const shadow =
        Math.max(
            0,
            Math.min(
                12,
                Number(
                    draft.shadow
                ) || 0
            )
        );

    const variables = {
        '--white':
            draft.surface,
        '--black':
            draft.text,
        '--muted-text':
            draft.muted,
        '--track-bg':
            `${draft.accent}18`,
        '--thin-border':
            `1.5px solid ${draft.border}`,
        '--thick-border':
            `2.5px solid ${draft.border}`,
        '--border-radius':
            `${radius}px`,
        '--custom-theme-accent':
            draft.accent,
        '--custom-theme-accent-text':
            getReadableTextColor(
                draft.accent
            ),
        '--custom-theme-shadow':
            `${shadow}px ${shadow}px 0 ${draft.border}`,
        '--custom-theme-font':
            CUSTOM_THEME_FONT_STACKS[
                draft.font
            ] ||
            CUSTOM_THEME_FONT_STACKS.hand,
        '--custom-theme-page-bg':
            draft.background,
        '--custom-theme-border-color':
            draft.border,
        '--custom-theme-tab-icon-color':
            draft.tabIconColor ||
            draft.text,
        '--custom-theme-tab-title-color':
            draft.tabTitleColor ||
            draft.text,
        '--custom-theme-daily-bg-color':
            draft.dailyLogBackgroundColor ||
            draft.surface,
        '--custom-theme-daily-bg-opacity':
            draft.dailyLogBackgroundEnabled
                ? `${Math.max(0, Math.min(100, Number(draft.dailyLogBackgroundOpacity) || 0))}%`
                : '0%',
        '--custom-theme-content-backdrop-color':
            draft.contentBackdropColor ||
            draft.surface,
        '--custom-theme-content-backdrop-opacity':
            draft.contentBackdropEnabled
                ? `${Math.max(0, Math.min(100, Number(draft.contentBackdropOpacity) || 0))}%`
                : '0%',
        '--custom-theme-heading-bg-color-v429':
            draft.headingBackgroundColorV452 || draft.contentBackdropColor || draft.surface,
        '--custom-theme-heading-bg-opacity-v429':
            draft.headingBackgroundEnabledV429 === true
                ? `${Math.max(0, Math.min(100, Number(draft.headingBackgroundOpacityV452 ?? draft.contentBackdropOpacity) || 0))}%`
                : '0%',
        '--custom-theme-heading-bg-padding-v429':
            draft.headingBackgroundEnabledV429 === true
                ? `${Math.max(0, Math.min(40, Number(draft.headingBackgroundPaddingV429) || 0))}px`
                : '0px',
        '--custom-theme-heading-bg-radius-v452':
            draft.headingBackgroundEnabledV429 === true
                ? `${Math.max(0, Math.min(40, Number(draft.headingBackgroundRadiusV452 ?? draft.radius) || 0))}px`
                : '0px'
    };

    Object.entries(
        variables
    ).forEach(
        ([name, value]) => {
            canvas.style.setProperty(
                name,
                value
            );
        }
    );

    canvas.style.backgroundColor =
        draft.background;

    canvas.style.backgroundImage =
        draft.backgroundImage
            ? `url("${String(draft.backgroundImage).replace(/"/g, '\\"')}")`
            : 'none';

    canvas.style.backgroundSize =
        'cover';

    canvas.style.backgroundPosition =
        'center';

    canvas.style.fontFamily =
        CUSTOM_THEME_FONT_STACKS[
            draft.font
        ] ||
        CUSTOM_THEME_FONT_STACKS.hand;

    const page =
        canvas.querySelector(
            '.theme-builder-live-page'
        );

    const sourceId =
        canvas.dataset.previewSourceId ||
        '';

    const isDaily =
        sourceId === 'grid-view' ||
        sourceId === 'log-view';

    if (page) {
        const enabled =
            isDaily
                ? !!draft.dailyLogBackgroundEnabled
                : !!draft.contentBackdropEnabled;

        const color =
            isDaily
                ? (
                    draft.dailyLogBackgroundColor ||
                    draft.surface
                )
                : (
                    draft.contentBackdropColor ||
                    draft.surface
                );

        const opacity =
            isDaily
                ? Number(
                    draft.dailyLogBackgroundOpacity
                ) || 0
                : Number(
                    draft.contentBackdropOpacity
                ) || 0;

        page.style.setProperty(
            'background',
            enabled
                ? hexToRgbaV4(
                    color,
                    Math.max(
                        0,
                        Math.min(
                            100,
                            opacity
                        )
                    ) / 100
                )
                : 'transparent',
            'important'
        );

        page.style.setProperty(
            'border-radius',
            `${radius}px`,
            'important'
        );
    }

    canvas
        .querySelectorAll(
            '.theme-builder-live-side-nav, .theme-builder-live-side-nav *'
        )
        .forEach(element => {
            if (
                element.classList?.contains(
                    'icon-btn'
                ) ||
                element.matches?.(
                    'i, svg'
                )
            ) {
                element.style.setProperty(
                    'color',
                    draft.tabIconColor ||
                    draft.text,
                    'important'
                );

                element.style.setProperty(
                    'stroke',
                    'currentColor',
                    'important'
                );
            }
        });

    canvas
        .querySelectorAll(
            '.theme-builder-live-page > h1, .theme-builder-live-page > header h1, .theme-builder-live-page > header h2, .theme-builder-live-page .custom-tab-title, .theme-builder-live-page .feature-page-header h1'
        )
        .forEach(title => {
            title.style.setProperty(
                'color',
                draft.tabTitleColor ||
                draft.text,
                'important'
            );
        });

    let artStage =
        canvas.querySelector(
            '.theme-builder-live-art-stage'
        );

    artStage?.remove();

    if (
        Array.isArray(
            draft.backgroundSvgs
        ) &&
        draft.backgroundSvgs.length
    ) {
        artStage =
            document.createElement(
                'div'
            );

        artStage.className =
            'theme-builder-live-art-stage';

        draft.backgroundSvgs
            .slice(0, 12)
            .forEach(
                (svg, index) => {
                    const item =
                        document.createElement(
                            'div'
                        );

                    item.className =
                        'theme-builder-live-art-item';

                    item.style.left =
                        `${5 + ((index * 31 + 11) % 90)}%`;

                    item.style.top =
                        `${7 + ((index * 47 + 19) % 84)}%`;

                    item.innerHTML =
                        renderThemeBuilderSvgAsset(
                            svg
                        );

                    artStage.appendChild(
                        item
                    );
                }
            );

        canvas.prepend(
            artStage
        );
    }
}

// Override the fake preview updater: controls still update their labels/status,
// but the visual preview is now the cloned ACTUAL page.
function updateThemeBuilderPreview(
    modal
) {
    ensureActualThemeBuilderPreviewV5(
        modal
    );

    const draft =
        getThemeBuilderDraft(
            modal
        );

    applyThemeBuilderDraftToActualPreviewV5(
        modal
    );

    modal
        .querySelectorAll(
            '[data-theme-output]'
        )
        .forEach(output => {
            output.textContent =
                String(
                    draft[
                        output.dataset.themeOutput
                    ]
                );
        });

    const opacityPairs = [
        [
            '.theme-builder-daily-backdrop-opacity',
            '.theme-builder-daily-backdrop-details',
            draft.dailyLogBackgroundEnabled
        ],
        [
            '.theme-builder-other-backdrop-opacity',
            '.theme-builder-other-backdrop-details',
            draft.contentBackdropEnabled
        ]
    ];

    opacityPairs.forEach(
        ([
            inputSelector,
            detailsSelector,
            enabled
        ]) => {
            const input =
                modal.querySelector(
                    inputSelector
                );

            const output =
                input
                    ?.closest(
                        '.theme-builder-opacity-field'
                    )
                    ?.querySelector(
                        'output'
                    );

            if (
                input &&
                output
            ) {
                output.textContent =
                    `${Math.round(Number(input.value) || 0)}%`;
            }

            modal
                .querySelector(
                    detailsSelector
                )
                ?.classList.toggle(
                    'disabled',
                    !enabled
                );
        }
    );

    const backgroundStatus =
        modal.querySelector(
            '.theme-builder-background-status'
        );

    if (backgroundStatus) {
        backgroundStatus.textContent =
            draft.backgroundImage
                ? 'Background image ready'
                : 'No background image';
    }

    const backgroundName =
        modal.querySelector(
            '.theme-builder-background-name'
        );

    if (backgroundName) {
        backgroundName.textContent =
            draft.backgroundImage
                ? (
                    draft.backgroundImageName ||
                    'Saved background image'
                )
                : 'No image selected';
    }

    const audioStatus =
        modal.querySelector(
            '.theme-builder-audio-status'
        );

    if (audioStatus) {
        if (!draft.introAudio) {
            audioStatus.textContent =
                'No intro audio';
        } else if (
            draft.audioPlayMode ===
            'full'
        ) {
            audioStatus.textContent =
                `Audio ready · full file${draft.audioFade ? ' · fade at end' : ''}`;
        } else {
            audioStatus.textContent =
                `Audio ready · ${formatThemeTimecode(draft.audioStart)}–${formatThemeTimecode(draft.audioEnd)}${draft.audioFade ? ' · fade' : ''}`;
        }
    }

    const audioName =
        modal.querySelector(
            '.theme-builder-audio-name'
        );

    if (audioName) {
        audioName.textContent =
            draft.introAudio
                ? (
                    draft.introAudioName ||
                    'Saved audio'
                )
                : 'No audio selected';
    }

    renderThemeBuilderSvgListV2(
        modal
    );
}



// ============================================================
// THEME BUILDER V6 — RIGHT-SIDE NAV + OPTIONAL NAV BACKGROUND
// ============================================================

const THEME_BUILDER_NAV_DEFAULTS_V6 = {
    tabNavBackgroundEnabled: false,
    tabNavBackgroundColor: '#ffffff',
    tabNavBackgroundOpacity: 88
};

const getThemeBuilderDraftBeforeNavV6 =
    getThemeBuilderDraft;

getThemeBuilderDraft = function(
    modal
) {
    const draft =
        getThemeBuilderDraftBeforeNavV6(
            modal
        );

    draft.tabNavBackgroundEnabled =
        !!modal
            .querySelector(
                '.theme-builder-nav-background-enabled'
            )
            ?.checked;

    draft.tabNavBackgroundColor =
        modal
            .querySelector(
                '[data-theme-key="tabNavBackgroundColor"]'
            )
            ?.value ||
        draft.tabNavBackgroundColor ||
        THEME_BUILDER_NAV_DEFAULTS_V6
            .tabNavBackgroundColor;

    draft.tabNavBackgroundOpacity =
        Number(
            modal
                .querySelector(
                    '.theme-builder-nav-background-opacity'
                )
                ?.value
        );

    if (
        !Number.isFinite(
            draft.tabNavBackgroundOpacity
        )
    ) {
        draft.tabNavBackgroundOpacity =
            THEME_BUILDER_NAV_DEFAULTS_V6
                .tabNavBackgroundOpacity;
    }

    return {
        ...THEME_BUILDER_NAV_DEFAULTS_V6,
        ...draft
    };
};

function ensureThemeBuilderNavBackgroundControlsV6(
    modal,
    theme
) {
    const navGrid =
        modal.querySelector(
            '.theme-builder-nav-color-grid'
        );

    if (!navGrid) return;

    const section =
        navGrid.closest(
            '.theme-builder-control-section'
        );

    if (!section) return;

    let host =
        section.querySelector(
            '.theme-builder-nav-background-settings'
        );

    if (!host) {
        host =
            document.createElement(
                'div'
            );

        host.className =
            'theme-builder-nav-background-settings';

        navGrid.insertAdjacentElement(
            'afterend',
            host
        );
    }

    const merged = {
        ...THEME_BUILDER_NAV_DEFAULTS_V6,
        ...(theme || {})
    };

    host.innerHTML = `
        ${themeBuilderToggleRowV4({
            className:
                'theme-builder-nav-background-toggle',
            title:
                'Background behind tab icons',
            detail:
                'Off keeps the tab navigation completely transparent.',
            checked:
                !!merged.tabNavBackgroundEnabled
        })}

        <div class="theme-builder-backdrop-details theme-builder-nav-background-details">
            ${themeBuilderField(
                'Tab Navigation Background Color',
                'tabNavBackgroundColor',
                merged.tabNavBackgroundColor
            )}

            ${themeBuilderOpacityControlV4(
                'Tab Navigation Background Opacity',
                'theme-builder-nav-background-opacity',
                merged.tabNavBackgroundOpacity
            )}
        </div>
    `;

    const toggle =
        host.querySelector(
            '.theme-builder-nav-background-toggle input'
        );

    if (toggle) {
        toggle.classList.add(
            'theme-builder-nav-background-enabled'
        );
    }

    const colorPicker =
        host.querySelector(
            '[data-theme-key="tabNavBackgroundColor"]'
        );

    const hexInput =
        host.querySelector(
            '[data-theme-hex="tabNavBackgroundColor"]'
        );

    const opacity =
        host.querySelector(
            '.theme-builder-nav-background-opacity'
        );

    const update =
        () => {
            if (
                colorPicker &&
                hexInput
            ) {
                hexInput.value =
                    colorPicker.value;
            }

            const output =
                opacity
                    ?.closest(
                        '.theme-builder-opacity-field'
                    )
                    ?.querySelector(
                        'output'
                    );

            if (
                opacity &&
                output
            ) {
                output.textContent =
                    `${Math.round(Number(opacity.value) || 0)}%`;
            }

            host
                .querySelector(
                    '.theme-builder-nav-background-details'
                )
                ?.classList.toggle(
                    'disabled',
                    !toggle?.checked
                );

            updateThemeBuilderPreview(
                modal
            );
        };

    toggle?.addEventListener(
        'change',
        update
    );

    colorPicker?.addEventListener(
        'input',
        update
    );

    hexInput?.addEventListener(
        'input',
        () => {
            const value =
                hexInput.value.trim();

            if (
                /^#[0-9a-f]{6}$/i.test(
                    value
                ) &&
                colorPicker
            ) {
                colorPicker.value =
                    value;
                update();
            }
        }
    );

    opacity?.addEventListener(
        'input',
        update
    );

    update();
}

const populateThemeBuilderBeforeNavV6 =
    populateThemeBuilder;

populateThemeBuilder = function(
    modal,
    theme
) {
    const merged = {
        ...THEME_BUILDER_NAV_DEFAULTS_V6,
        ...(theme || {})
    };

    populateThemeBuilderBeforeNavV6(
        modal,
        merged
    );

    ensureThemeBuilderNavBackgroundControlsV6(
        modal,
        merged
    );

    rebuildActualThemeBuilderPreviewV5(
        modal
    );
};

const applyCustomBuiltThemeBeforeNavV6 =
    applyCustomBuiltTheme;

applyCustomBuiltTheme = function(
    theme = getCustomThemeSettings()
) {
    const merged = {
        ...THEME_BUILDER_NAV_DEFAULTS_V6,
        ...(theme || {})
    };

    applyCustomBuiltThemeBeforeNavV6(
        merged
    );

    const root =
        document.documentElement;

    root.style.setProperty(
        '--custom-theme-tab-nav-bg-color',
        merged.tabNavBackgroundColor
    );

    root.style.setProperty(
        '--custom-theme-tab-nav-bg-opacity',
        merged.tabNavBackgroundEnabled
            ? `${Math.max(
                0,
                Math.min(
                    100,
                    Number(
                        merged.tabNavBackgroundOpacity
                    ) ||
                    0
                )
            )}%`
            : '0%'
    );
};

const clearCustomBuiltThemeBeforeNavV6 =
    clearCustomBuiltTheme;

clearCustomBuiltTheme = function() {
    clearCustomBuiltThemeBeforeNavV6();

    document.documentElement
        .style
        .removeProperty(
            '--custom-theme-tab-nav-bg-color'
        );

    document.documentElement
        .style
        .removeProperty(
            '--custom-theme-tab-nav-bg-opacity'
        );
};

const applyThemeBuilderDraftToActualPreviewBeforeNavV6 =
    applyThemeBuilderDraftToActualPreviewV5;

applyThemeBuilderDraftToActualPreviewV5 =
    function(
        modal
    ) {
        applyThemeBuilderDraftToActualPreviewBeforeNavV6(
            modal
        );

        const canvas =
            modal.querySelector(
                '.theme-builder-live-canvas'
            );

        if (!canvas) return;

        const draft = {
            ...THEME_BUILDER_NAV_DEFAULTS_V6,
            ...getThemeBuilderDraft(
                modal
            )
        };

        canvas.style.setProperty(
            '--custom-theme-tab-nav-bg-color',
            draft.tabNavBackgroundColor
        );

        canvas.style.setProperty(
            '--custom-theme-tab-nav-bg-opacity',
            draft.tabNavBackgroundEnabled
                ? `${Math.max(
                    0,
                    Math.min(
                        100,
                        Number(
                            draft.tabNavBackgroundOpacity
                        ) ||
                        0
                    )
                )}%`
                : '0%'
        );

        const nav =
            canvas.querySelector(
                '.theme-builder-live-side-nav'
            );

        if (nav) {
            nav.classList.toggle(
                'has-theme-nav-background',
                !!draft.tabNavBackgroundEnabled
            );
        }
    };



// ============================================================
// THEME PICKER V7 — EDIT CUSTOM THEME + INLINE CREATE CARD
// ============================================================

// Theme Builder no longer gets its own separate Workspace/Theme Tools button.
// Creation/editing now happens directly from the theme gallery.
function ensureGlobalUtilitiesSection() {
    document
        .getElementById(
            'global-workspace-tools-section'
        )
        ?.remove();
}

// V300 removal: openExistingCustomThemeFromPickerV7 and
// openNewCustomThemeFromPickerV7 used to call the un-owned legacy
// openThemeBuilder() directly. Both global names are now reassigned
// unconditionally by template-extras-6.js (the single V300 owner) to
// openEdit('theme-custom-builder') and openCreate respectively -- every
// caller looks the identifier up by name at call time, so these bodies were
// dead weight kept alive only by being shadowed. Removed rather than left
// here unreachable.

function createThemePickerCreateCardV7() {
    const card =
        document.createElement(
            'button'
        );

    card.type =
        'button';

    card.className =
        'theme-picker-create-card';

    card.title =
        'Create your own theme';

    card.setAttribute(
        'aria-label',
        'Create your own theme'
    );

    card.innerHTML = `
        <span class="theme-picker-create-plus">
            <i class="ph ph-plus"></i>
        </span>

        <span class="theme-picker-create-copy">
            <strong>Create Theme</strong>
            <small>Make your own</small>
        </span>
    `;

    card.addEventListener(
        'click',
        openNewCustomThemeFromPickerV7
    );

    return card;
}

function createThemePickerCard(
    option
) {
    const card =
        document.createElement(
            'button'
        );

    card.type =
        'button';

    card.className =
        'theme-picker-card';

    card.dataset.theme =
        option.value;

    card.dataset.themeName =
        option.textContent.trim();

    card.dataset.themeCategory =
        option.parentElement?.tagName ===
        'OPTGROUP'
            ? option.parentElement.label
            : '';

    const isCustomTheme =
        option.value ===
        'theme-custom-builder';

    let preview =
        THEME_PREVIEWS[
            option.value
        ];

    if (!preview) {
        const seed =
            Array.from(
                option.value ||
                option.textContent ||
                'theme'
            ).reduce(
                (total, char) =>
                    total +
                    char.charCodeAt(
                        0
                    ),
                0
            );

        const hueA =
            seed % 360;

        const hueB =
            (
                hueA +
                42 +
                (seed % 58)
            ) %
            360;

        const hueAccent =
            (
                hueA +
                190
            ) %
            360;

        preview = [
            `hsl(${hueA} 74% 84%)`,
            `hsl(${hueB} 70% 94%)`,
            `hsl(${hueAccent} 66% 48%)`
        ];
    }

    const [
        a,
        b,
        accent,
        dark
    ] = preview;

    if (dark) {
        card.classList.add(
            'theme-dark'
        );
    }

    if (isCustomTheme) {
        card.classList.add(
            'theme-picker-custom-theme'
        );
    }

    const hint =
        isCustomTheme
            ? 'Click to apply · Right-click to edit'
            : option.value ===
                'default'
                ? 'Click to apply'
                : 'Click to apply · Right-click for options';

    card.innerHTML = `
        <div
            class="theme-picker-preview"
            style="background:linear-gradient(135deg,${a},${b});--preview-accent:${accent};"
        ></div>

        <div class="theme-picker-info">
            <span class="theme-picker-name"></span>
            <span class="theme-picker-hint">
                ${hint}
            </span>
        </div>

        ${
            isCustomTheme
                ? `
                    <span
                        class="theme-picker-custom-badge"
                        title="Custom theme"
                    >
                        <i class="ph ph-pencil-simple"></i>
                    </span>
                `
                : ''
        }
    `;

    card
        .querySelector(
            '.theme-picker-name'
        ).textContent =
        option.textContent.trim();

    card.addEventListener(
        'click',
        async () => {
            themePickerSelected =
                option.value;

            updateThemePickerSelection();

            await applyTheme(
                option.value
            );

            // V446: this is the card implementation that actually exists after
            // the lazy extras load. Commit intro audio only AFTER the final
            // wrapped applyTheme promise resolves; otherwise the next wrapper can
            // immediately stop it and the theme appears silent until reload.
            try {
                window.__loggyLogIntroAudioV444?.ensureThemeAudio?.(
                    option.value,
                    typeof resolveAppliedCustomThemeV445 === 'function'
                        ? resolveAppliedCustomThemeV445(option.value)
                        : null,
                    'theme-card-final-extras-v446'
                );
            } catch (_) {}
        }
    );

    if (
        option.value !==
        'default'
    ) {
        card.addEventListener(
            'contextmenu',
            event => {
                event.preventDefault();

                const actions =
                    isCustomTheme
                        ? [
                            {
                                label:
                                    'Edit Theme',
                                icon:
                                    'ph-pencil-simple',
                                action:
                                    openExistingCustomThemeFromPickerV7
                            },
                            {
                                label:
                                    'Delete Theme',
                                icon:
                                    'ph-trash',
                                danger:
                                    true,
                                action:
                                    () =>
                                        deleteThemeFromPickerV2(
                                            option.value,
                                            option.textContent.trim()
                                        )
                            }
                        ]
                        : [
                            {
                                label:
                                    'Delete Theme',
                                icon:
                                    'ph-trash',
                                danger:
                                    true,
                                action:
                                    () =>
                                        deleteThemeFromPickerV2(
                                            option.value,
                                            option.textContent.trim()
                                        )
                            }
                        ];

                showCustomItemContextMenu(
                    event.clientX,
                    event.clientY,
                    actions
                );
            }
        );
    }

    return card;
}

function filterThemePicker(
    searchValue = ''
) {
    if (!themePicker) return;

    const query =
        normalizeThemeSearchText(
            searchValue
        );

    let visibleCount =
        0;

    themePicker
        .querySelectorAll(
            '.theme-picker-card'
        )
        .forEach(card => {
            const idText =
                normalizeThemeSearchText(
                    card.dataset.theme
                );

            const nameText =
                normalizeThemeSearchText(
                    card.dataset.themeName
                );

            const matches =
                !query ||
                idText.includes(
                    query
                ) ||
                nameText.includes(
                    query
                );

            card.classList.toggle(
                'theme-search-hidden',
                !matches
            );

            if (matches) {
                visibleCount++;
            }
        });

    // The create card is an end-of-gallery action, not a search result.
    themePicker
        .querySelector(
            '.theme-picker-create-card'
        )
        ?.classList.toggle(
            'theme-search-hidden',
            !!query
        );

    if (themeSearchEmpty) {
        themeSearchEmpty.classList.toggle(
            'hidden',
            visibleCount !==
                0
        );
    }

    if (themeSearchClear) {
        themeSearchClear.classList.toggle(
            'hidden',
            !String(
                searchValue
            ).trim()
        );
    }
}

function renderThemePicker() {
    if (
        !themePicker ||
        !dailyThemeSelect
    ) {
        return;
    }

    normalizeFeatureSuiteSettings();
    ensureCustomThemePickerOption();

    themePicker.innerHTML =
        '';

    const removedThemeValues =
        new Set([
            'theme-candy',
            'theme-forest',
            'theme-blossom',
            'theme-80s',
            'theme-rainforest',
            'theme-arcade',
            ...db.settings
                .deletedThemes
        ]);

    if (
        db.settings
            .customThemeDeleted
    ) {
        removedThemeValues.add(
            'theme-custom-builder'
        );
    }

    let options =
        Array.from(
            dailyThemeSelect
                .querySelectorAll(
                    'option'
                )
        ).filter(
            option =>
                !removedThemeValues
                    .has(
                        option.value
                    )
        );

    options.forEach(
        option => {
            if (
                option.value ===
                'theme-water'
            ) {
                option.textContent =
                    'Sky Blue';
            }
        }
    );

    const specialValues =
        new Set([
            'theme-water',
            'theme-whimsical',
            'theme-cloud'
        ]);

    const special = {};

    options =
        options.filter(
            option => {
                if (
                    specialValues
                        .has(
                            option.value
                        )
                ) {
                    special[
                        option.value
                    ] =
                        option;

                    return false;
                }

                return true;
            }
        );

    const honeyIndex =
        options.findIndex(
            option =>
                option.value ===
                'theme-honey'
        );

    if (
        special[
            'theme-water'
        ]
    ) {
        if (
            honeyIndex !==
            -1
        ) {
            options.splice(
                honeyIndex + 1,
                0,
                special[
                    'theme-water'
                ]
            );
        } else {
            options.push(
                special[
                    'theme-water'
                ]
            );
        }
    }

    const noirIndex =
        options.findIndex(
            option =>
                option.value ===
                'theme-noir'
        );

    const noirInsert = [];

    if (
        special[
            'theme-whimsical'
        ]
    ) {
        noirInsert.push(
            special[
                'theme-whimsical'
            ]
        );
    }

    if (
        special[
            'theme-cloud'
        ]
    ) {
        noirInsert.push(
            special[
                'theme-cloud'
            ]
        );
    }

    if (
        noirInsert.length
    ) {
        if (
            noirIndex !==
            -1
        ) {
            options.splice(
                noirIndex + 1,
                0,
                ...noirInsert
            );
        } else {
            options.push(
                ...noirInsert
            );
        }
    }

    options.forEach(
        option =>
            themePicker.appendChild(
                createThemePickerCard(
                    option
                )
            )
    );

    // Always end the gallery with the create-your-own-theme card.
    themePicker.appendChild(
        createThemePickerCreateCardV7()
    );

    themePickerSelected =
        dailyThemeSelect.value ||
        'default';

    if (
        removedThemeValues.has(
            themePickerSelected
        )
    ) {
        themePickerSelected =
            'default';

        dailyThemeSelect.value =
            'default';
    }

    updateThemePickerSelection();

    filterThemePicker(
        themeSearchInput?.value ||
        ''
    );
}



// ============================================================
// THEME PICKER / BUILDER V8 — FINAL INTERACTION POLISH
// ============================================================

function createThemePickerCreateCardV7() {
    const card =
        document.createElement(
            'button'
        );

    card.type =
        'button';

    card.className =
        'theme-picker-create-card';

    card.title =
        'Create your own theme';

    card.setAttribute(
        'aria-label',
        'Create your own theme'
    );

    // Intentionally ONLY a plus sign.
    card.innerHTML =
        '<i class="ph ph-plus"></i>';

    card.addEventListener(
        'click',
        openNewCustomThemeFromPickerV7
    );

    return card;
}

function filterThemePicker(
    searchValue = ''
) {
    if (!themePicker) return;

    const query =
        normalizeThemeSearchText(
            searchValue
        );

    let visibleCount =
        0;

    themePicker
        .querySelectorAll(
            '.theme-picker-card'
        )
        .forEach(card => {
            const idText =
                normalizeThemeSearchText(
                    card.dataset.theme
                );

            const nameText =
                normalizeThemeSearchText(
                    card.dataset.themeName
                );

            const matches =
                !query ||
                idText.includes(
                    query
                ) ||
                nameText.includes(
                    query
                );

            card.classList.toggle(
                'theme-search-hidden',
                !matches
            );

            if (matches) {
                visibleCount++;
            }
        });

    // The + create-theme control is ALWAYS present at the end,
    // including while searching and regardless of the active theme.
    themePicker
        .querySelector(
            '.theme-picker-create-card'
        )
        ?.classList.remove(
            'theme-search-hidden'
        );

    if (themeSearchEmpty) {
        themeSearchEmpty.classList.toggle(
            'hidden',
            visibleCount !== 0
        );
    }

    if (themeSearchClear) {
        themeSearchClear.classList.toggle(
            'hidden',
            !String(
                searchValue
            ).trim()
        );
    }
}

function parseThemeHexV8(
    value
) {
    let hex =
        String(value || '')
            .trim()
            .replace(
                '#',
                ''
            );

    if (
        /^[0-9a-f]{3}$/i.test(
            hex
        )
    ) {
        hex =
            hex
                .split('')
                .map(char =>
                    char + char
                )
                .join('');
    }

    if (
        !/^[0-9a-f]{6}$/i.test(
            hex
        )
    ) {
        return null;
    }

    return {
        r:
            parseInt(
                hex.slice(0, 2),
                16
            ),
        g:
            parseInt(
                hex.slice(2, 4),
                16
            ),
        b:
            parseInt(
                hex.slice(4, 6),
                16
            )
    };
}

function themeRelativeLuminanceV8(
    rgb
) {
    const channel =
        value => {
            const normalized =
                value / 255;

            return normalized <=
                0.03928
                ? normalized /
                    12.92
                : Math.pow(
                    (
                        normalized +
                        0.055
                    ) /
                        1.055,
                    2.4
                );
        };

    return (
        0.2126 *
            channel(
                rgb.r
            ) +
        0.7152 *
            channel(
                rgb.g
            ) +
        0.0722 *
            channel(
                rgb.b
            )
    );
}

function themeContrastRatioV8(
    a,
    b
) {
    const first =
        themeRelativeLuminanceV8(
            a
        );

    const second =
        themeRelativeLuminanceV8(
            b
        );

    const lighter =
        Math.max(
            first,
            second
        );

    const darker =
        Math.min(
            first,
            second
        );

    return (
        lighter +
        0.05
    ) /
    (
        darker +
        0.05
    );
}

function getReadableThemeSurfaceTextV8(
    mainText,
    surface
) {
    const main =
        parseThemeHexV8(
            mainText
        );

    const bg =
        parseThemeHexV8(
            surface
        );

    if (
        main &&
        bg &&
        themeContrastRatioV8(
            main,
            bg
        ) >=
            4.5
    ) {
        return mainText;
    }

    if (!bg) {
        return (
            mainText ||
            '#111111'
        );
    }

    const black =
        {
            r: 0,
            g: 0,
            b: 0
        };

    const white =
        {
            r: 255,
            g: 255,
            b: 255
        };

    return (
        themeContrastRatioV8(
            bg,
            white
        ) >=
        themeContrastRatioV8(
            bg,
            black
        )
            ? '#ffffff'
            : '#111111'
    );
}

const applyCustomBuiltThemeBeforeReadabilityV8 =
    applyCustomBuiltTheme;

applyCustomBuiltTheme = function(
    theme = getCustomThemeSettings()
) {
    applyCustomBuiltThemeBeforeReadabilityV8(
        theme
    );

    document.documentElement
        .style
        .setProperty(
            '--custom-theme-surface-readable-text',
            getReadableThemeSurfaceTextV8(
                theme?.text,
                theme?.surface
            )
        );
};

const clearCustomBuiltThemeBeforeReadabilityV8 =
    clearCustomBuiltTheme;

clearCustomBuiltTheme = function() {
    clearCustomBuiltThemeBeforeReadabilityV8();

    document.documentElement
        .style
        .removeProperty(
            '--custom-theme-surface-readable-text'
        );
};

const applyThemeBuilderDraftToActualPreviewBeforeReadabilityV8 =
    applyThemeBuilderDraftToActualPreviewV5;

applyThemeBuilderDraftToActualPreviewV5 =
    function(
        modal
    ) {
        applyThemeBuilderDraftToActualPreviewBeforeReadabilityV8(
            modal
        );

        const canvas =
            modal.querySelector(
                '.theme-builder-live-canvas'
            );

        if (!canvas) return;

        const draft =
            getThemeBuilderDraft(
                modal
            );

        canvas.style.setProperty(
            '--custom-theme-surface-readable-text',
            getReadableThemeSurfaceTextV8(
                draft.text,
                draft.surface
            )
        );
    };

// Close Theme Builder only when the pointer PRESS begins outside.
// Dragging from inside the modal and releasing outside must not close it.
const ensureThemeBuilderModalBeforePointerGuardV8 =
    ensureThemeBuilderModal;

ensureThemeBuilderModal = function() {
    const modal =
        ensureThemeBuilderModalBeforePointerGuardV8();

    if (
        !modal ||
        modal.dataset
            .themeBuilderPointerGuardV8 ===
            'true'
    ) {
        return modal;
    }

    modal.dataset
        .themeBuilderPointerGuardV8 =
        'true';

    let pointerStartedOnBackdrop =
        false;

    modal.addEventListener(
        'pointerdown',
        event => {
            pointerStartedOnBackdrop =
                event.target ===
                modal;
        },
        true
    );

    modal.addEventListener(
        'click',
        event => {
            if (
                event.target ===
                    modal &&
                !pointerStartedOnBackdrop
            ) {
                event.preventDefault();
                event.stopImmediatePropagation();
            }

            pointerStartedOnBackdrop =
                false;
        },
        true
    );

    modal.addEventListener(
        'pointercancel',
        () => {
            pointerStartedOnBackdrop =
                false;
        },
        true
    );

    return modal;
};



// ============================================================
// THEME BUILDER PREVIEW V9 — CLEAN, FIT-TO-WIDTH PREVIEW
// ============================================================

function fitActualThemeBuilderPreviewV9(
    modal
) {
    const viewport =
        modal?.querySelector(
            '.theme-builder-live-preview-viewport'
        );

    const canvas =
        modal?.querySelector(
            '.theme-builder-live-canvas'
        );

    if (
        !viewport ||
        !canvas
    ) {
        return;
    }

    const baseWidth =
        1280;

    const baseHeight =
        760;

    const availableWidth =
        Math.max(
            1,
            viewport.clientWidth
        );

    const scale =
        availableWidth /
        baseWidth;

    canvas.style.setProperty(
        '--theme-builder-preview-scale',
        String(scale)
    );

    viewport.style.height =
        `${Math.max(
            280,
            Math.min(
                460,
                Math.round(
                    baseHeight *
                    scale
                )
            )
        )}px`;
}

const rebuildActualThemeBuilderPreviewBeforeFitV9 =
    rebuildActualThemeBuilderPreviewV5;

rebuildActualThemeBuilderPreviewV5 =
    function(
        modal
    ) {
        rebuildActualThemeBuilderPreviewBeforeFitV9(
            modal
        );

        requestAnimationFrame(
            () =>
                fitActualThemeBuilderPreviewV9(
                    modal
                )
        );
    };

const ensureActualThemeBuilderPreviewBeforeFitV9 =
    ensureActualThemeBuilderPreviewV5;

ensureActualThemeBuilderPreviewV5 =
    function(
        modal
    ) {
        ensureActualThemeBuilderPreviewBeforeFitV9(
            modal
        );

        if (
            modal &&
            modal.dataset
                .themeBuilderPreviewResizeV9 !==
                'true'
        ) {
            modal.dataset
                .themeBuilderPreviewResizeV9 =
                'true';

            const viewport =
                modal.querySelector(
                    '.theme-builder-live-preview-viewport'
                );

            if (
                viewport &&
                typeof ResizeObserver !==
                    'undefined'
            ) {
                const observer =
                    new ResizeObserver(
                        () =>
                            fitActualThemeBuilderPreviewV9(
                                modal
                            )
                    );

                observer.observe(
                    viewport
                );

                modal._themeBuilderPreviewResizeObserverV9 =
                    observer;
            }
        }

        requestAnimationFrame(
            () =>
                fitActualThemeBuilderPreviewV9(
                    modal
                )
        );
    };



// ============================================================
// THEME BUILDER V10 — HOVER COLOR, CLICKABLE PREVIEW TABS,
// SVG MOTION, INTRO BOP, HOVER SOUNDS & DISTRIBUTION
// ============================================================

const CUSTOM_THEME_ADVANCED_DEFAULTS_V10 = {
    hoverColor: '#d9d2ff',
    hoverOpacity: 28,

    introSvgBounceEnabled: false,

    svgHoverSoundsEnabled: false,
    svgHoverSoundMode: 'random',
    svgHoverSounds: [
        { name: 'Arcade Positive Selection', url: '/sounds/winx/cartoon_music-arcade-game-positive-selection-bling-489760.mp3' },
        { name: 'Electricity', url: '/sounds/winx/freesound_community-electricity-sound-6066.mp3' },
        { name: 'Match Sizzle', url: '/sounds/winx/freesound_community-match-sizzle-02-104778.mp3' },
        { name: 'Get Coin', url: '/sounds/winx/koiroylers-get-coin-351945.mp3' }
    ],

    svgDistribution: 'random'
};

const THEME_SVG_ANIMATION_OPTIONS_V10 = [
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

let customThemeHoverAudiosV10 =
    new Set();

function cloneThemeHoverSoundsV10(
    sounds
) {
    return Array.isArray(
        sounds
    )
        ? sounds.map(
            sound => ({
                ...sound
            })
        )
        : [];
}

function ensureSvgAdvancedDefaultsV10(
    svg
) {
    if (
        !svg ||
        typeof svg !==
            'object'
    ) {
        return svg;
    }

    // V371: legacy V10 used to coerce every animation it did not know back
    // to Float. Newer Theme Builder modes are valid, so only fill a genuinely
    // missing value. This prevents a saved global/default animation from being
    // replaced by an old V10 fallback during Log-page apply/preview hydration.
    if (!String(svg.animation || '').trim()) {
        svg.animation = 'float';
    }

    if (
        typeof svg.introBop !==
        'boolean'
    ) {
        svg.introBop =
            true;
    }

    if (
        typeof svg.hoverSoundUrl !==
        'string'
    ) {
        svg.hoverSoundUrl =
            '';
    }

    return svg;
}

const getThemeBuilderDraftBeforeAdvancedV10 =
    getThemeBuilderDraft;

getThemeBuilderDraft = function(
    modal
) {
    const draft = {
        ...CUSTOM_THEME_ADVANCED_DEFAULTS_V10,
        ...getThemeBuilderDraftBeforeAdvancedV10(
            modal
        )
    };

    draft.hoverColor =
        modal
            .querySelector(
                '.theme-builder-hover-color'
            )
            ?.value ||
        draft.hoverColor;

    const hoverOpacity =
        Number(
            modal
                .querySelector(
                    '.theme-builder-hover-opacity'
                )
                ?.value
        );

    if (
        Number.isFinite(
            hoverOpacity
        )
    ) {
        draft.hoverOpacity =
            Math.max(
                0,
                Math.min(
                    100,
                    hoverOpacity
                )
            );
    }

    draft.introSvgBounceEnabled =
        !!modal
            .querySelector(
                '.theme-builder-intro-svg-bop-enabled'
            )
            ?.checked;

    draft.svgHoverSoundsEnabled =
        !!modal
            .querySelector(
                '.theme-builder-svg-hover-sounds-enabled'
            )
            ?.checked;

    draft.svgHoverSoundMode =
        modal
            .querySelector(
                '.theme-builder-svg-hover-sound-mode'
            )
            ?.value ===
            'mapped'
            ? 'mapped'
            : 'random';

    draft.svgHoverSounds =
        cloneThemeHoverSoundsV10(
            modal._themeHoverSounds
        );

    const distribution =
        modal
            .querySelector(
                '.theme-builder-svg-distribution'
            )
            ?.value;

    draft.svgDistribution =
        [
            'random',
            'side-fixed',
            'side-random'
        ].includes(
            distribution
        )
            ? distribution
            : 'random';

    draft.backgroundSvgs =
        Array.isArray(
            modal._themeBackgroundSvgs
        )
            ? modal
                ._themeBackgroundSvgs
                .map(
                    svg =>
                        ensureSvgAdvancedDefaultsV10({
                            ...svg
                        })
                )
            : [];

    return draft;
};

function themeBuilderSimpleToggleV10(
    className,
    title,
    checked
) {
    return `
        <label class="theme-builder-visual-toggle ${escapeCustomHtml(className)}">
            <input
                type="checkbox"
                ${checked ? 'checked' : ''}
            >
            <span class="theme-builder-visual-toggle-copy">
                <strong>${escapeCustomHtml(title)}</strong>
            </span>
            <span
                class="theme-builder-switch"
                aria-hidden="true"
            ></span>
        </label>
    `;
}

function themeBuilderHoverControlV10(
    theme
) {
    const merged = {
        ...CUSTOM_THEME_ADVANCED_DEFAULTS_V10,
        ...(theme || {})
    };

    return `
        <section class="theme-builder-control-section theme-builder-hover-controls-v10">
            <div class="theme-builder-control-heading">
                <strong>Interactive Hover</strong>
            </div>

            <div class="theme-builder-backdrop-details theme-builder-hover-control-grid">
                <label class="theme-builder-field">
                    <span>Hover Color</span>
                    <div class="theme-builder-color-control">
                        <input
                            type="color"
                            class="theme-builder-hover-color"
                            value="${escapeCustomHtml(merged.hoverColor)}"
                        >
                        <input
                            type="text"
                            class="theme-builder-hover-color-hex"
                            value="${escapeCustomHtml(merged.hoverColor)}"
                            maxlength="7"
                            spellcheck="false"
                        >
                    </div>
                </label>

                ${themeBuilderOpacityControlV4(
                    'Hover Opacity',
                    'theme-builder-hover-opacity',
                    merged.hoverOpacity
                )}
            </div>
        </section>
    `;
}

function renderThemeBuilderHoverSoundListV10(
    modal
) {
    const host =
        modal.querySelector(
            '.theme-builder-hover-sound-list'
        );

    if (!host) return;

    const sounds =
        cloneThemeHoverSoundsV10(
            modal._themeHoverSounds
        );

    host.innerHTML =
        '';

    sounds.forEach(
        (sound, index) => {
            const row =
                document.createElement(
                    'div'
                );

            row.className =
                'theme-builder-hover-sound-row';

            row.innerHTML = `
                <i class="ph ph-speaker-high"></i>
                <span>${escapeCustomHtml(sound.name || ('Sound ' + (index + 1)))}</span>
                <button
                    type="button"
                    class="small-icon-btn"
                    title="Remove sound"
                >
                    <i class="ph ph-x"></i>
                </button>
            `;

            row
                .querySelector(
                    'button'
                )
                ?.addEventListener(
                    'click',
                    async () => {
                        const label =
                            sound.name ||
                            ('Sound ' + (index + 1));

                        const confirmed =
                            await showAppConfirm({
                                title:
                                    'Remove this hover sound?',
                                message:
                                    `“${label}” will be removed from this theme.`,
                                confirmLabel:
                                    'Remove Sound'
                            });

                        if (!confirmed) {
                            return;
                        }

                        modal._themeHoverSounds
                            .splice(
                                index,
                                1
                            );

                        (
                            modal._themeBackgroundSvgs ||
                            []
                        ).forEach(
                            svg => {
                                if (
                                    svg.hoverSoundUrl ===
                                    sound.url
                                ) {
                                    svg.hoverSoundUrl =
                                        '';
                                }
                            }
                        );

                        renderThemeBuilderHoverSoundListV10(
                            modal
                        );

                        renderThemeBuilderSvgListV2(
                            modal
                        );

                        updateThemeBuilderPreview(
                            modal
                        );

                        await deleteThemeBuilderProjectAsset(
                            sound.url
                        );
                    }
                );

            host.appendChild(
                row
            );
        }
    );
}

function stopThemeBuilderIntroPreviewV10(
    modal
) {
    const audio =
        modal?._themeBuilderIntroPreviewAudioV10;

    if (audio) {
        try {
            audio.pause();
            audio.currentTime =
                0;
        } catch {}
    }

    modal._themeBuilderIntroPreviewAudioV10 =
        null;

    modal
        ?.querySelector(
            '.theme-builder-live-art-stage'
        )
        ?.classList.remove(
            'theme-svg-intro-active',
            'theme-svg-intro-bop-enabled'
        );
}

function previewThemeBuilderIntroV10(
    modal
) {
    stopThemeBuilderIntroPreviewV10(
        modal
    );

    const draft =
        getThemeBuilderDraft(
            modal
        );

    const artStage =
        modal.querySelector(
            '.theme-builder-live-art-stage'
        );

    if (
        !draft.introAudio ||
        !draft.backgroundSvgs.length ||
        !artStage
    ) {
        return;
    }

    const audio =
        new Audio(
            draft.introAudio
        );

    try { window.__loggyIntroAudioGateV443?.allow?.(audio); } catch (_) {}

    modal._themeBuilderIntroPreviewAudioV10 =
        audio;

    const clean =
        () => {
            if (
                modal._themeBuilderIntroPreviewAudioV10 !==
                audio
            ) {
                return;
            }

            artStage.classList.remove(
                'theme-svg-intro-active',
                'theme-svg-intro-bop-enabled'
            );

            modal._themeBuilderIntroPreviewAudioV10 =
                null;
        };

    const begin =
        () => {
            artStage.classList.add(
                'theme-svg-intro-active'
            );

            artStage.classList.toggle(
                'theme-svg-intro-bop-enabled',
                !!draft.introSvgBounceEnabled
            );
        };

    audio.addEventListener(
        'play',
        begin
    );

    audio.addEventListener(
        'ended',
        clean,
        {
            once: true
        }
    );

    audio.addEventListener(
        'pause',
        () => {
            if (
                audio.ended ||
                modal._themeBuilderIntroPreviewAudioV10 ===
                    audio
            ) {
                clean();
            }
        }
    );

    const mode =
        draft.audioPlayMode ===
        'segment'
            ? 'segment'
            : 'full';

    const start =
        Math.max(
            0,
            Number(
                draft.audioStart
            ) || 0
        );

    const requestedEnd =
        Math.max(
            start + 0.1,
            Number(
                draft.audioEnd
            ) || start + 20
        );

    const startPlayback =
        () => {
            if (
                mode ===
                'segment'
            ) {
                try {
                    audio.currentTime =
                        start;
                } catch {}
            }

            audio.play()
                .catch(
                    clean
                );

            if (
                mode ===
                'segment'
            ) {
                const duration =
                    Math.max(
                        0.1,
                        requestedEnd -
                            start
                    );

                setTimeout(
                    () => {
                        if (
                            modal._themeBuilderIntroPreviewAudioV10 !==
                            audio
                        ) {
                            return;
                        }

                        audio.pause();
                    },
                    duration *
                        1000
                );
            }
        };

    if (
        audio.readyState >=
        1
    ) {
        startPlayback();
    } else {
        audio.addEventListener(
            'loadedmetadata',
            startPlayback,
            {
                once: true
            }
        );
    }
}

function syncThemeBuilderAdvancedVisibilityV10(
    modal
) {
    const hasSvgs =
        (
            modal._themeBackgroundSvgs ||
            []
        ).length >
        0;

    const hasAudio =
        !!modal._themeIntroAudio;

    const introBopEnabled =
        !!modal
            .querySelector(
                '.theme-builder-intro-svg-bop-enabled'
            )
            ?.checked;

    const hoverSoundsEnabled =
        !!modal
            .querySelector(
                '.theme-builder-svg-hover-sounds-enabled'
            )
            ?.checked;

    const mapped =
        modal
            .querySelector(
                '.theme-builder-svg-hover-sound-mode'
            )
            ?.value ===
        'mapped';

    modal
        .querySelector(
            '.theme-builder-intro-svg-bop-wrap'
        )
        ?.classList.toggle(
            'hidden',
            !hasSvgs
        );

    modal
        .querySelector(
            '.theme-builder-svg-effects-panel'
        )
        ?.classList.toggle(
            'hidden',
            !hasSvgs
        );

    modal
        .querySelector(
            '.theme-builder-svg-hover-sound-details'
        )
        ?.classList.toggle(
            'hidden',
            !hoverSoundsEnabled
        );

    modal
        .querySelectorAll(
            '.theme-builder-svg-mapped-sound-row'
        )
        .forEach(
            row => {
                row.classList.toggle(
                    'hidden',
                    !hoverSoundsEnabled ||
                        !mapped
                );
            }
        );

    modal
        .querySelectorAll(
            '.theme-builder-svg-intro-bop-row'
        )
        .forEach(
            row => {
                row.classList.toggle(
                    'hidden',
                    !introBopEnabled
                );
            }
        );
}

function ensureThemeBuilderAdvancedControlsV10(
    modal,
    theme
) {
    const merged = {
        ...CUSTOM_THEME_ADVANCED_DEFAULTS_V10,
        ...(theme || {})
    };

    modal._themeHoverSounds =
        cloneThemeHoverSoundsV10(
            merged.svgHoverSounds
        );

    modal._themeBackgroundSvgs =
        (
            modal._themeBackgroundSvgs ||
            []
        ).map(
            svg =>
                ensureSvgAdvancedDefaultsV10(
                    svg
                )
        );

    // ---------------- Interactive Hover ----------------
    const navColorSection =
        modal
            .querySelector(
                '.theme-builder-nav-color-grid'
            )
            ?.closest(
                '.theme-builder-control-section'
            );

    if (navColorSection) {
        modal
            .querySelector(
                '.theme-builder-hover-controls-v10'
            )
            ?.remove();

        navColorSection.insertAdjacentHTML(
            'afterend',
            themeBuilderHoverControlV10(
                merged
            )
        );

        const color =
            modal.querySelector(
                '.theme-builder-hover-color'
            );

        const hex =
            modal.querySelector(
                '.theme-builder-hover-color-hex'
            );

        const opacity =
            modal.querySelector(
                '.theme-builder-hover-opacity'
            );

        const updateHover =
            () => {
                if (
                    color &&
                    hex
                ) {
                    hex.value =
                        color.value;
                }

                const output =
                    opacity
                        ?.closest(
                            '.theme-builder-opacity-field'
                        )
                        ?.querySelector(
                            'output'
                        );

                if (
                    opacity &&
                    output
                ) {
                    output.textContent =
                        `${Math.round(Number(opacity.value) || 0)}%`;
                }

                updateThemeBuilderPreview(
                    modal
                );
            };

        color?.addEventListener(
            'input',
            updateHover
        );

        hex?.addEventListener(
            'input',
            () => {
                const value =
                    hex.value.trim();

                if (
                    /^#[0-9a-f]{6}$/i.test(
                        value
                    ) &&
                    color
                ) {
                    color.value =
                        value;

                    updateHover();
                }
            }
        );

        opacity?.addEventListener(
            'input',
            updateHover
        );
    }

    // ---------------- Intro SVG bop ----------------
    const audioSection =
        modal
            .querySelector(
                '.theme-builder-audio-file'
            )
            ?.closest(
                '.theme-builder-media-section'
            );

    if (audioSection) {
        audioSection
            .querySelector(
                '.theme-builder-intro-svg-bop-wrap'
            )
            ?.remove();

        const host =
            document.createElement(
                'div'
            );

        host.className =
            'theme-builder-intro-svg-bop-wrap';

        host.innerHTML = `
            ${themeBuilderSimpleToggleV10(
                'theme-builder-intro-svg-bop-toggle',
                'Bop selected SVGs with intro audio',
                !!merged.introSvgBounceEnabled
            )}
        `;

        const fadeRow =
            audioSection.querySelector(
                '.theme-builder-fade-row'
            );

        if (fadeRow) {
            fadeRow.insertAdjacentElement(
                'afterend',
                host
            );
        } else {
            audioSection.appendChild(
                host
            );
        }

        const toggle =
            host.querySelector(
                '.theme-builder-intro-svg-bop-toggle input'
            );

        if (toggle) {
            toggle.classList.add(
                'theme-builder-intro-svg-bop-enabled'
            );

            toggle.addEventListener(
                'change',
                () => {
                    renderThemeBuilderSvgListV2(
                        modal
                    );

                    syncThemeBuilderAdvancedVisibilityV10(
                        modal
                    );

                    updateThemeBuilderPreview(
                        modal
                    );
                }
            );
        }
    }

    // ---------------- SVG behavior + hover sounds ----------------
    const svgSection =
        modal.querySelector(
            '.theme-builder-svg-section'
        );

    if (svgSection) {
        svgSection
            .querySelector(
                '.theme-builder-svg-effects-panel'
            )
            ?.remove();

        const panel =
            document.createElement(
                'div'
            );

        panel.className =
            'theme-builder-svg-effects-panel';

        panel.innerHTML = `
            <label class="theme-builder-field">
                <span>SVG Distribution</span>
                <select class="theme-builder-svg-distribution">
                    <option value="random">
                        Random all over screen
                    </option>
                    <option value="side-fixed">
                        Fixed side positions · fixed stickers
                    </option>
                    <option value="side-random">
                        Fixed side positions · random stickers
                    </option>
                </select>
            </label>

            <div class="theme-builder-svg-hover-sounds-wrap">
                ${themeBuilderSimpleToggleV10(
                    'theme-builder-svg-hover-sounds-toggle',
                    'SVG hover sounds',
                    !!merged.svgHoverSoundsEnabled
                )}

                <div class="theme-builder-svg-hover-sound-details">
                    <input
                        type="file"
                        class="theme-builder-hover-sound-file theme-builder-native-file"
                        accept="audio/*"
                        multiple
                    >

                    <div class="theme-builder-file-picker-row">
                        <button
                            type="button"
                            class="theme-builder-file-button theme-builder-hover-sound-choose"
                        >
                            <i class="ph ph-speaker-high"></i>
                            Add Sounds
                        </button>
                    </div>

                    <label class="theme-builder-field">
                        <span>Sound Assignment</span>
                        <select class="theme-builder-svg-hover-sound-mode">
                            <option value="random">
                                Randomize sounds
                            </option>
                            <option value="mapped">
                                Choose sound for each SVG
                            </option>
                        </select>
                    </label>

                    <div class="theme-builder-hover-sound-list"></div>
                </div>
            </div>
        `;

        svgSection.appendChild(
            panel
        );

        const distribution =
            panel.querySelector(
                '.theme-builder-svg-distribution'
            );

        distribution.value =
            [
                'random',
                'side-fixed',
                'side-random'
            ].includes(
                merged.svgDistribution
            )
                ? merged.svgDistribution
                : 'random';

        distribution.addEventListener(
            'change',
            () => {
                modal._themePreviewDistributionSeedV10 =
                    Math.random() *
                    100000;

                updateThemeBuilderPreview(
                    modal
                );
            }
        );

        const soundToggle =
            panel.querySelector(
                '.theme-builder-svg-hover-sounds-toggle input'
            );

        if (soundToggle) {
            soundToggle.classList.add(
                'theme-builder-svg-hover-sounds-enabled'
            );

            soundToggle.addEventListener(
                'change',
                () => {
                    syncThemeBuilderAdvancedVisibilityV10(
                        modal
                    );

                    renderThemeBuilderSvgListV2(
                        modal
                    );

                    updateThemeBuilderPreview(
                        modal
                    );
                }
            );
        }

        const mode =
            panel.querySelector(
                '.theme-builder-svg-hover-sound-mode'
            );

        mode.value =
            merged.svgHoverSoundMode ===
            'mapped'
                ? 'mapped'
                : 'random';

        mode.addEventListener(
            'change',
            () => {
                renderThemeBuilderSvgListV2(
                    modal
                );

                syncThemeBuilderAdvancedVisibilityV10(
                    modal
                );

                updateThemeBuilderPreview(
                    modal
                );
            }
        );

        const soundFile =
            panel.querySelector(
                '.theme-builder-hover-sound-file'
            );

        panel
            .querySelector(
                '.theme-builder-hover-sound-choose'
            )
            ?.addEventListener(
                'click',
                () =>
                    soundFile?.click()
            );

        if (soundFile) {
            soundFile.onchange =
                async () => {
                    const files =
                        Array.from(
                            soundFile.files ||
                            []
                        );

                    for (
                        const file of files
                    ) {
                        const saved =
                            await uploadThemeBuilderAssetToProject(
                                file,
                                'audio'
                            );

                        if (!saved) {
                            continue;
                        }

                        modal._themeHoverSounds
                            .push({
                                name:
                                    file.name,
                                url:
                                    saved.url,
                                projectPath:
                                    saved.projectPath ||
                                    ''
                            });
                    }

                    soundFile.value =
                        '';

                    renderThemeBuilderHoverSoundListV10(
                        modal
                    );

                    renderThemeBuilderSvgListV2(
                        modal
                    );

                    updateThemeBuilderPreview(
                        modal
                    );
                };
        }

        renderThemeBuilderHoverSoundListV10(
            modal
        );
    }

    if (
        modal.dataset
            .themeBuilderAdvancedCloseBoundV10 !==
        'true'
    ) {
        modal.dataset
            .themeBuilderAdvancedCloseBoundV10 =
            'true';

        modal
            .querySelector(
                '.theme-builder-close'
            )
            ?.addEventListener(
                'click',
                () =>
                    stopThemeBuilderIntroPreviewV10(
                        modal
                    ),
                true
            );

        modal.addEventListener(
            'pointerdown',
            event => {
                if (
                    event.target ===
                    modal
                ) {
                    stopThemeBuilderIntroPreviewV10(
                        modal
                    );
                }
            },
            true
        );
    }

    renderThemeBuilderSvgListV2(
        modal
    );

    syncThemeBuilderAdvancedVisibilityV10(
        modal
    );
}

const populateThemeBuilderBeforeAdvancedV10 =
    populateThemeBuilder;

populateThemeBuilder = function(
    modal,
    theme
) {
    const merged = {
        ...CUSTOM_THEME_ADVANCED_DEFAULTS_V10,
        ...(theme || {}),
        svgHoverSounds:
            cloneThemeHoverSoundsV10(
                theme?.svgHoverSounds
            )
    };

    populateThemeBuilderBeforeAdvancedV10(
        modal,
        merged
    );

    modal._themeBackgroundSvgs =
        (
            modal._themeBackgroundSvgs ||
            []
        ).map(
            svg =>
                ensureSvgAdvancedDefaultsV10(
                    svg
                )
        );

    ensureThemeBuilderAdvancedControlsV10(
        modal,
        merged
    );

    updateThemeBuilderPreview(
        modal
    );
};

const renderThemeBuilderSvgListBeforeAdvancedV10 =
    renderThemeBuilderSvgListV2;

renderThemeBuilderSvgListV2 =
    function(
        modal
    ) {
        renderThemeBuilderSvgListBeforeAdvancedV10(
            modal
        );

        const svgs =
            modal._themeBackgroundSvgs ||
            [];

        const sounds =
            modal._themeHoverSounds ||
            [];

        const soundMode =
            modal
                .querySelector(
                    '.theme-builder-svg-hover-sound-mode'
                )
                ?.value ||
            'random';

        const hoverSoundsEnabled =
            !!modal
                .querySelector(
                    '.theme-builder-svg-hover-sounds-enabled'
                )
                ?.checked;

        const introBopEnabled =
            !!modal
                .querySelector(
                    '.theme-builder-intro-svg-bop-enabled'
                )
                ?.checked;

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

                    const svg =
                        svgs[index];

                    if (!svg) {
                        return;
                    }

                    ensureSvgAdvancedDefaultsV10(
                        svg
                    );

                    const copy =
                        card.querySelector(
                            '.theme-builder-svg-card-copy'
                        );

                    if (!copy) {
                        return;
                    }

                    copy
                        .querySelector(
                            '.theme-builder-svg-card-options-v10'
                        )
                        ?.remove();

                    const options =
                        document.createElement(
                            'div'
                        );

                    options.className =
                        'theme-builder-svg-card-options-v10';

                    const animationOptions =
                        THEME_SVG_ANIMATION_OPTIONS_V10
                            .map(
                                ([value, label]) => `
                                    <option
                                        value="${escapeCustomHtml(value)}"
                                        ${svg.animation === value ? 'selected' : ''}
                                    >
                                        ${escapeCustomHtml(label)}
                                    </option>
                                `
                            )
                            .join('');

                    const soundOptions =
                        sounds
                            .map(
                                sound => `
                                    <option
                                        value="${escapeCustomHtml(sound.url || '')}"
                                        ${svg.hoverSoundUrl === sound.url ? 'selected' : ''}
                                    >
                                        ${escapeCustomHtml(sound.name || 'Sound')}
                                    </option>
                                `
                            )
                            .join('');

                    options.innerHTML = `
                        <label class="theme-builder-svg-option-row">
                            <span>Animation</span>
                            <select class="theme-builder-svg-animation-select">
                                ${animationOptions}
                            </select>
                        </label>

                        <label class="theme-builder-svg-option-row theme-builder-svg-intro-bop-row ${
                            !introBopEnabled
                                ? 'hidden'
                                : ''
                        }">
                            <span>Bop with intro</span>
                            <input
                                type="checkbox"
                                class="theme-builder-svg-intro-bop-check"
                                ${svg.introBop !== false ? 'checked' : ''}
                            >
                        </label>

                        <label class="theme-builder-svg-option-row theme-builder-svg-mapped-sound-row ${
                            !hoverSoundsEnabled ||
                            soundMode !==
                                'mapped'
                                ? 'hidden'
                                : ''
                        }">
                            <span>Hover Sound</span>
                            <select class="theme-builder-svg-sound-select">
                                <option value="">
                                    No sound
                                </option>
                                ${soundOptions}
                            </select>
                        </label>
                    `;

                    options
                        .querySelector(
                            '.theme-builder-svg-animation-select'
                        )
                        ?.addEventListener(
                            'change',
                            event => {
                                svg.animation =
                                    event
                                        .currentTarget
                                        .value;

                                updateThemeBuilderPreview(
                                    modal
                                );
                            }
                        );

                    options
                        .querySelector(
                            '.theme-builder-svg-intro-bop-check'
                        )
                        ?.addEventListener(
                            'change',
                            event => {
                                svg.introBop =
                                    !!event
                                        .currentTarget
                                        .checked;

                                updateThemeBuilderPreview(
                                    modal
                                );
                            }
                        );

                    options
                        .querySelector(
                            '.theme-builder-svg-sound-select'
                        )
                        ?.addEventListener(
                            'change',
                            event => {
                                svg.hoverSoundUrl =
                                    event
                                        .currentTarget
                                        .value;

                                updateThemeBuilderPreview(
                                    modal
                                );
                            }
                        );

                    copy.appendChild(
                        options
                    );
                }
            );

        syncThemeBuilderAdvancedVisibilityV10(
            modal
        );
    };

function getThemeBuilderPreviewTargetIdV10(
    button
) {
    if (!button) {
        return '';
    }

    const originalId =
        button.dataset
            .previewOriginalId ||
        '';

    const map = {
        'open-daily-logs-nav-btn':
            'grid-view',
        'open-tools-btn':
            'toolbox-view',
        'open-phrases-btn':
            'phrases-library-view',
        'open-quizzes-btn':
            'quizzes-view',
        'open-weekly-review-btn':
            'weekly-review-view',
        'open-trash-view-btn':
            'feature-trash-view'
    };

    if (
        map[
            originalId
        ]
    ) {
        return map[
            originalId
        ];
    }

    const customTabId =
        button.dataset
            .customTabId;

    if (
        customTabId
    ) {
        return (
            document.getElementById(
                `custom-tab-view-${customTabId}`
            )?.id ||
            ''
        );
    }

    return '';
}

function bindThemeBuilderPreviewTabsV10(
    modal
) {
    const nav =
        modal.querySelector(
            '.theme-builder-live-side-nav'
        );

    if (!nav) return;

    nav
        .querySelectorAll(
            'button, a.icon-btn'
        )
        .forEach(
            button => {
                const targetId =
                    getThemeBuilderPreviewTargetIdV10(
                        button
                    );

                button.classList.toggle(
                    'theme-builder-preview-nav-clickable',
                    !!targetId
                );

                if (
                    !targetId
                ) {
                    return;
                }

                button.addEventListener(
                    'click',
                    event => {
                        event.preventDefault();
                        event.stopPropagation();

                        modal._themeBuilderPreviewSourceId =
                            targetId;

                        rebuildActualThemeBuilderPreviewV5(
                            modal
                        );
                    }
                );
            }
        );

    nav
        .querySelectorAll(
            '.active-nav'
        )
        .forEach(
            button =>
                button.classList.remove(
                    'active-nav'
                )
        );

    nav
        .querySelectorAll(
            'button, a.icon-btn'
        )
        .forEach(
            button => {
                if (
                    getThemeBuilderPreviewTargetIdV10(
                        button
                    ) ===
                    modal._themeBuilderPreviewSourceId
                ) {
                    button.classList.add(
                        'active-nav'
                    );
                }
            }
        );
}

function pseudoRandomThemePreviewV10(
    seed,
    index,
    salt = 0
) {
    const raw =
        Math.sin(
            (
                seed *
                    9973 +
                index *
                    7919 +
                salt *
                    104729
            ) *
                12.9898
        ) *
        43758.5453;

    return (
        raw -
        Math.floor(
            raw
        )
    );
}

function themeSideSlotsV10() {
    return [
        [4, 10],
        [4, 25],
        [4, 40],
        [4, 55],
        [4, 70],
        [4, 85],
        [96, 10],
        [96, 25],
        [96, 40],
        [96, 55],
        [96, 70],
        [96, 85],
        [15, 5],
        [30, 5],
        [45, 5],
        [60, 5],
        [75, 5],
        [90, 5],
        [15, 95],
        [30, 95],
        [45, 95],
        [60, 95],
        [75, 95],
        [90, 95]
    ];
}

function getPreviewSvgAssignmentsV10(
    modal,
    draft
) {
    const svgs =
        draft.backgroundSvgs ||
        [];

    if (
        !svgs.length
    ) {
        return [];
    }

    if (
        !Number.isFinite(
            modal._themePreviewDistributionSeedV10
        )
    ) {
        modal._themePreviewDistributionSeedV10 =
            Math.random() *
            100000;
    }

    const seed =
        modal._themePreviewDistributionSeedV10;

    let refs =
        svgs.map(
            (svg, originalIndex) => ({
                svg,
                originalIndex
            })
        );

    if (
        draft.svgDistribution ===
        'side-random'
    ) {
        refs =
            refs
                .map(
                    (entry, index) => ({
                        ...entry,
                        order:
                            pseudoRandomThemePreviewV10(
                                seed,
                                index,
                                77
                            )
                    })
                )
                .sort(
                    (a, b) =>
                        a.order -
                        b.order
                );
    }

    const sideSlots =
        themeSideSlotsV10();

    return refs.map(
        (
            entry,
            displayIndex
        ) => {
            if (
                draft.svgDistribution ===
                'random'
            ) {
                return {
                    ...entry,
                    left:
                        7 +
                        pseudoRandomThemePreviewV10(
                            seed,
                            displayIndex,
                            11
                        ) *
                            86,
                    top:
                        7 +
                        pseudoRandomThemePreviewV10(
                            seed,
                            displayIndex,
                            23
                        ) *
                            86
                };
            }

            const slot =
                sideSlots[
                    displayIndex %
                    sideSlots.length
                ];

            return {
                ...entry,
                left:
                    slot[0],
                top:
                    slot[1]
            };
        }
    );
}

function playSingleThemeHoverSoundV10(
    url,
    volume = 0.72
) {
    if (!url) return;

    const audio =
        new Audio(
            url
        );

    audio.volume =
        volume;

    customThemeHoverAudiosV10
        .add(
            audio
        );

    const clean =
        () =>
            customThemeHoverAudiosV10
                .delete(
                    audio
                );

    audio.addEventListener(
        'ended',
        clean,
        {
            once: true
        }
    );

    audio.play()
        .catch(
            clean
        );
}

function chooseThemeHoverSoundUrlV10(
    theme,
    svg
) {
    if (
        !theme.svgHoverSoundsEnabled
    ) {
        return '';
    }

    const sounds =
        Array.isArray(
            theme.svgHoverSounds
        )
            ? theme.svgHoverSounds
            : [];

    if (
        !sounds.length
    ) {
        return '';
    }

    if (
        theme.svgHoverSoundMode ===
        'mapped'
    ) {
        return (
            svg?.hoverSoundUrl ||
            ''
        );
    }

    const picked =
        sounds[
            Math.floor(
                Math.random() *
                sounds.length
            )
        ];

    return (
        picked?.url ||
        ''
    );
}

function renderAdvancedThemeBuilderSvgPreviewV10(
    modal
) {
    const canvas =
        modal.querySelector(
            '.theme-builder-live-canvas'
        );

    if (!canvas) return;

    const draft =
        getThemeBuilderDraft(
            modal
        );

    canvas
        .querySelector(
            '.theme-builder-live-art-stage'
        )
        ?.remove();

    if (
        !draft.backgroundSvgs.length
    ) {
        return;
    }

    const artStage =
        document.createElement(
            'div'
        );

    artStage.className =
        'theme-builder-live-art-stage';

    const assignments =
        getPreviewSvgAssignmentsV10(
            modal,
            draft
        );

    assignments.forEach(
        (
            assignment,
            displayIndex
        ) => {
            const svg =
                ensureSvgAdvancedDefaultsV10(
                    assignment.svg
                );

            const item =
                document.createElement(
                    'div'
                );

            item.className =
                `theme-builder-live-art-item theme-svg-anim-${svg.animation}`;

            if (
                svg.introBop !==
                false
            ) {
                item.classList.add(
                    'theme-svg-intro-bop-selected'
                );
            }

            item.dataset.svgIndex =
                String(
                    assignment.originalIndex
                );

            item.style.left =
                `${assignment.left}%`;

            item.style.top =
                `${assignment.top}%`;

            item.style.setProperty(
                '--theme-svg-delay',
                `${(displayIndex % 11) * -0.37}s`
            );

            item.innerHTML = `
                <div class="theme-svg-motion-shell">
                    ${renderThemeBuilderSvgAsset(svg)}
                </div>
            `;

            item.addEventListener(
                'pointerenter',
                () => {
                    const url =
                        chooseThemeHoverSoundUrlV10(
                            draft,
                            svg
                        );

                    playSingleThemeHoverSoundV10(
                        url
                    );
                }
            );

            artStage.appendChild(
                item
            );
        }
    );

    canvas.prepend(
        artStage
    );
}

const applyThemeBuilderDraftToActualPreviewBeforeAdvancedV10 =
    applyThemeBuilderDraftToActualPreviewV5;

applyThemeBuilderDraftToActualPreviewV5 =
    function(
        modal
    ) {
        applyThemeBuilderDraftToActualPreviewBeforeAdvancedV10(
            modal
        );

        const canvas =
            modal.querySelector(
                '.theme-builder-live-canvas'
            );

        if (!canvas) return;

        const draft =
            getThemeBuilderDraft(
                modal
            );

        canvas.style.setProperty(
            '--custom-theme-hover-color',
            draft.hoverColor
        );

        canvas.style.setProperty(
            '--custom-theme-hover-opacity',
            `${Math.max(
                0,
                Math.min(
                    100,
                    Number(
                        draft.hoverOpacity
                    ) ||
                    0
                )
            )}%`
        );

        renderAdvancedThemeBuilderSvgPreviewV10(
            modal
        );

        bindThemeBuilderPreviewTabsV10(
            modal
        );
    };

const rebuildActualThemeBuilderPreviewBeforeTabsV10 =
    rebuildActualThemeBuilderPreviewV5;

rebuildActualThemeBuilderPreviewV5 =
    function(
        modal
    ) {
        rebuildActualThemeBuilderPreviewBeforeTabsV10(
            modal
        );

        bindThemeBuilderPreviewTabsV10(
            modal
        );

        requestAnimationFrame(
            () =>
                fitActualThemeBuilderPreviewV9(
                    modal
                )
        );
    };

function getRuntimeSvgAssignmentsV10(
    theme
) {
    const svgs =
        Array.isArray(
            theme.backgroundSvgs
        )
            ? theme.backgroundSvgs
                .map(
                    (svg, originalIndex) => ({
                        svg:
                            ensureSvgAdvancedDefaultsV10({
                                ...svg
                            }),
                        originalIndex
                    })
                )
            : [];

    if (
        theme.svgDistribution ===
        'side-random'
    ) {
        for (
            let index =
                svgs.length - 1;
            index >
                0;
            index--
        ) {
            const swapIndex =
                Math.floor(
                    Math.random() *
                    (index + 1)
                );

            [
                svgs[index],
                svgs[swapIndex]
            ] = [
                svgs[swapIndex],
                svgs[index]
            ];
        }
    }

    const slots =
        themeSideSlotsV10();

    return svgs.map(
        (
            entry,
            displayIndex
        ) => {
            if (
                theme.svgDistribution ===
                'random'
            ) {
                return {
                    ...entry,
                    left:
                        6 +
                        Math.random() *
                            88,
                    top:
                        6 +
                        Math.random() *
                            88
                };
            }

            const slot =
                slots[
                    displayIndex %
                    slots.length
                ];

            return {
                ...entry,
                left:
                    slot[0],
                top:
                    slot[1]
            };
        }
    );
}

mountCustomThemeBackgroundSvgsV2 =
    function(
        theme
    ) {
        const merged = {
            ...CUSTOM_THEME_ADVANCED_DEFAULTS_V10,
            ...(theme || {})
        };

        const assignments =
            getRuntimeSvgAssignmentsV10(
                merged
            );

        if (
            !assignments.length
        ) {
            return;
        }

        const stage =
            document.createElement(
                'div'
            );

        stage.id =
            'custom-theme-background-stage';

        stage.className =
            'custom-theme-background-stage theme-svg-effects-stage-v10';

        assignments.forEach(
            (
                assignment,
                displayIndex
            ) => {
                const svg =
                    assignment.svg;

                const item =
                    document.createElement(
                        'div'
                    );

                item.className =
                    `custom-theme-background-svg theme-svg-anim-${svg.animation}`;

                if (
                    svg.introBop !==
                    false
                ) {
                    item.classList.add(
                        'theme-svg-intro-bop-selected'
                    );
                }

                item.dataset.svgIndex =
                    String(
                        assignment.originalIndex
                    );

                item.style.left =
                    `${assignment.left}%`;

                item.style.top =
                    `${assignment.top}%`;

                item.style.setProperty(
                    '--theme-svg-delay',
                    `${(displayIndex % 13) * -0.41}s`
                );

                item.innerHTML = `
                    <div class="theme-svg-motion-shell">
                        ${renderThemeBuilderSvgAsset(svg)}
                    </div>
                `;

                item.addEventListener(
                    'pointerenter',
                    () => {
                        const url =
                            chooseThemeHoverSoundUrlV10(
                                merged,
                                svg
                            );

                        playSingleThemeHoverSoundV10(
                            url
                        );
                    }
                );

                stage.appendChild(
                    item
                );
            }
        );

        document.body.prepend(
            stage
        );
    };

const playCustomThemeIntroAudioBeforeAdvancedV10 =
    playCustomThemeIntroAudioV2;

playCustomThemeIntroAudioV2 =
    function(
        theme
    ) {
        playCustomThemeIntroAudioBeforeAdvancedV10(
            theme
        );

        const audio =
            customThemeIntroAudioV2;

        const stage =
            document.getElementById(
                'custom-theme-background-stage'
            );

        if (
            !audio ||
            !stage
        ) {
            return;
        }

        const begin =
            () => {
                stage.classList.add(
                    'theme-svg-intro-active'
                );

                stage.classList.toggle(
                    'theme-svg-intro-bop-enabled',
                    !!theme.introSvgBounceEnabled
                );
            };

        const finish =
            () => {
                stage.classList.remove(
                    'theme-svg-intro-active',
                    'theme-svg-intro-bop-enabled'
                );
            };

        audio.addEventListener(
            'play',
            begin
        );

        audio.addEventListener(
            'pause',
            finish
        );

        audio.addEventListener(
            'ended',
            finish
        );

        if (
            !audio.paused
        ) {
            begin();
        }
    };

const clearCustomThemeRuntimeMediaBeforeAdvancedV10 =
    clearCustomThemeRuntimeMediaV2;

clearCustomThemeRuntimeMediaV2 =
    function() {
        clearCustomThemeRuntimeMediaBeforeAdvancedV10();

        customThemeHoverAudiosV10
            .forEach(
                audio => {
                    try {
                        audio.pause();
                        audio.currentTime =
                            0;
                    } catch {}
                }
            );

        customThemeHoverAudiosV10
            .clear();
    };

const applyCustomBuiltThemeBeforeAdvancedV10 =
    applyCustomBuiltTheme;

applyCustomBuiltTheme =
    function(
        theme =
            getCustomThemeSettings()
    ) {
        const merged = {
            ...CUSTOM_THEME_ADVANCED_DEFAULTS_V10,
            ...(theme || {}),
            svgHoverSounds:
                cloneThemeHoverSoundsV10(
                    theme?.svgHoverSounds
                ),
            backgroundSvgs:
                Array.isArray(
                    theme?.backgroundSvgs
                )
                    ? theme.backgroundSvgs
                        .map(
                            svg =>
                                ensureSvgAdvancedDefaultsV10({
                                    ...svg
                                })
                        )
                    : []
        };

        applyCustomBuiltThemeBeforeAdvancedV10(
            merged
        );

        const root =
            document.documentElement;

        root.style.setProperty(
            '--custom-theme-hover-color',
            merged.hoverColor
        );

        root.style.setProperty(
            '--custom-theme-hover-opacity',
            `${Math.max(
                0,
                Math.min(
                    100,
                    Number(
                        merged.hoverOpacity
                    ) ||
                    0
                )
            )}%`
        );
    };

const clearCustomBuiltThemeBeforeAdvancedV10 =
    clearCustomBuiltTheme;

clearCustomBuiltTheme =
    function() {
        clearCustomBuiltThemeBeforeAdvancedV10();

        const root =
            document.documentElement;

        root.style.removeProperty(
            '--custom-theme-hover-color'
        );

        root.style.removeProperty(
            '--custom-theme-hover-opacity'
        );
    };

// Keep the theme source complete even when a newly added theme folder
// was not already present in the hidden select.
async function hydrateThemeSourceFromManifestV10() {
    if (
        !dailyThemeSelect ||
        dailyThemeSelect.dataset
            .manifestHydratedV10 ===
            'true'
    ) {
        return;
    }

    dailyThemeSelect.dataset
        .manifestHydratedV10 =
        'true';

    try {
        const response =
            await fetch(
                '/themes/themes.json',
                {
                    cache:
                        'no-store'
                }
            );

        if (
            !response.ok
        ) {
            return;
        }

        const manifest =
            await response.json();

        if (
            !Array.isArray(
                manifest
            )
        ) {
            return;
        }

        manifest.forEach(
            theme => {
                if (
                    !theme?.id
                ) {
                    return;
                }

                const rawId =
                    String(
                        theme.id
                    );

                const value =
                    rawId.startsWith(
                        'theme-'
                    )
                        ? rawId
                        : `theme-${rawId}`;

                const exists =
                    Array.from(
                        dailyThemeSelect
                            .options
                    ).some(
                        option =>
                            option.value ===
                            value
                    );

                if (
                    exists
                ) {
                    return;
                }

                const option =
                    document.createElement(
                        'option'
                    );

                option.value =
                    value;

                option.textContent =
                    theme.name ||
                    rawId
                        .replace(
                            /^theme-/,
                            ''
                        )
                        .replace(
                            /[-_]+/g,
                            ' '
                        )
                        .replace(
                            /\b\w/g,
                            char =>
                                char.toUpperCase()
                        );

                dailyThemeSelect.appendChild(
                    option
                );
            }
        );

        renderThemePicker();
    } catch {}
}

setTimeout(
    hydrateThemeSourceFromManifestV10,
    0
);



// ============================================================
// THEME BUILDER V11 — CLEAR UI + RELIABLE LIVE PREVIEW
// - strong tab-icon color
// - exact hover preview
// - one default SVG animation with optional per-SVG overrides
// - scene presets inspired by the uploaded legacy theme patterns
// - no dropdown required for preview navigation
// ============================================================

const CUSTOM_THEME_V11_DEFAULTS = {
    svgDefaultAnimation: 'float',
    svgScenePreset: 'scatter'
};

const THEME_SVG_ANIMATION_OPTIONS_V11 = THEME_SVG_ANIMATION_OPTIONS_V10;

const THEME_SCENE_PRESETS_V11 = [
    ['scatter', 'Float Scatter'],
    ['edge', 'Edge Collage'],
    ['swim', 'Swim Lanes'],
    ['rain', 'Falling / Digital Rain'],
    ['custom', 'Custom']
];

function themeBuilderAnimationLabelV11(
    value
) {
    return (
        THEME_SVG_ANIMATION_OPTIONS_V11
            .find(
                option =>
                    option[0] ===
                    value
            )?.[1] ||
        'Float'
    );
}

function inferSvgDefaultAnimationV11(theme) {
    // V371: an explicitly saved global default is authoritative, including all
    // newer animation IDs. Only infer from legacy per-decoration data when the
    // theme truly has no global default at all.
    const explicit = String(theme?.svgDefaultAnimation || '').trim();
    if (explicit) return explicit;

    const counts = new Map();
    (theme?.backgroundSvgs || []).forEach(svg => {
        const value = String(svg?.animation || '').trim();
        if (value) counts.set(value, (counts.get(value) || 0) + 1);
    });
    let best = 'float', bestCount = -1;
    counts.forEach((count, value) => { if (count > bestCount) { best = value; bestCount = count; } });
    return best;
}

function normalizeSvgOverrideV11(svg, defaultAnimation) {
    const copy = ensureSvgAdvancedDefaultsV10({ ...svg });

    // V371: old V11 converted the previous global animation stored in
    // `asset.animation` into a per-decoration override whenever the global
    // default changed. That is what made a newly saved default work briefly and
    // then snap back to the previous animation. Overrides now exist only when
    // they were explicitly stored as animationOverride.
    copy.animationOverride = String(copy.animationOverride || '').trim();
    copy.animation = copy.animationOverride || String(defaultAnimation || '').trim() || 'float';
    return copy;
}

function getEffectiveSvgAnimationV11(svg, defaultAnimation) {
    const override = String(svg?.animationOverride || '').trim();
    if (override) return override;
    const globalDefault = String(defaultAnimation || '').trim();
    if (globalDefault) return globalDefault;
    return String(svg?.animation || 'float').trim() || 'float';
}

function applySvgScenePresetV11(
    modal,
    preset
) {
    const defaultAnimation =
        modal.querySelector(
            '.theme-builder-svg-default-animation'
        );

    const distribution =
        modal.querySelector(
            '.theme-builder-svg-distribution'
        );

    const map = {
        scatter: {
            animation:
                'float',
            distribution:
                'random'
        },
        edge: {
            animation:
                'float',
            distribution:
                'side-fixed'
        },
        swim: {
            animation:
                'travel',
            distribution:
                'lanes'
        },
        rain: {
            animation:
                'fall',
            distribution:
                'columns'
        }
    };

    const config =
        map[preset];

    if (!config) {
        return;
    }

    if (defaultAnimation) {
        defaultAnimation.value =
            config.animation;
    }

    if (distribution) {
        distribution.value =
            config.distribution;
    }

    modal._themeBackgroundSvgs =
        (
            modal._themeBackgroundSvgs ||
            []
        ).map(
            svg => ({
                ...svg,
                animation:
                    svg.animationOverride ||
                    config.animation
            })
        );

    modal._themePreviewDistributionSeedV10 =
        Math.random() *
        100000;

    renderThemeBuilderSvgListV2(
        modal
    );

    updateThemeBuilderPreview(
        modal
    );
}

function ensureThemeBuilderGlobalSvgControlsV11(
    modal,
    theme
) {
    const panel =
        modal.querySelector(
            '.theme-builder-svg-effects-panel'
        );

    if (!panel) {
        return;
    }

    panel
        .querySelector(
            '.theme-builder-global-svg-controls-v11'
        )
        ?.remove();

    const defaultAnimation =
        inferSvgDefaultAnimationV11(
            theme
        );

    modal._themeBackgroundSvgs =
        (
            modal._themeBackgroundSvgs ||
            []
        ).map(
            svg =>
                normalizeSvgOverrideV11(
                    svg,
                    defaultAnimation
                )
        );

    const controls =
        document.createElement(
            'div'
        );

    controls.className =
        'theme-builder-global-svg-controls-v11';

    controls.innerHTML = `
        <label class="theme-builder-field">
            <span>Scene Style</span>
            <select class="theme-builder-svg-scene-preset">
                ${THEME_SCENE_PRESETS_V11
                    .map(
                        ([value, label]) => `
                            <option
                                value="${escapeCustomHtml(value)}"
                                ${(
                                    theme?.svgScenePreset ||
                                    'scatter'
                                ) === value
                                    ? 'selected'
                                    : ''}
                            >
                                ${escapeCustomHtml(label)}
                            </option>
                        `
                    )
                    .join('')}
            </select>
        </label>

        <label class="theme-builder-field">
            <span>Default Animation</span>
            <select class="theme-builder-svg-default-animation">
                ${THEME_SVG_ANIMATION_OPTIONS_V11
                    .map(
                        ([value, label]) => `
                            <option
                                value="${escapeCustomHtml(value)}"
                                ${defaultAnimation === value
                                    ? 'selected'
                                    : ''}
                            >
                                ${escapeCustomHtml(label)}
                            </option>
                        `
                    )
                    .join('')}
            </select>
        </label>
    `;

    panel.prepend(
        controls
    );

    const distribution =
        panel.querySelector(
            '.theme-builder-svg-distribution'
        );

    if (distribution) {
        const options = [
            ['random', 'Random all over screen'],
            ['side-fixed', 'Fixed side positions · fixed stickers'],
            ['side-random', 'Fixed side positions · reshuffle stickers'],
            ['lanes', 'Horizontal lanes'],
            ['columns', 'Vertical columns']
        ];

        distribution.innerHTML =
            options
                .map(
                    ([value, label]) => `
                        <option
                            value="${escapeCustomHtml(value)}"
                        >
                            ${escapeCustomHtml(label)}
                        </option>
                    `
                )
                .join('');

        distribution.value =
            [
                'random',
                'side-fixed',
                'side-random',
                'lanes',
                'columns'
            ].includes(
                theme?.svgDistribution
            )
                ? theme.svgDistribution
                : 'random';
    }

    controls
        .querySelector(
            '.theme-builder-svg-scene-preset'
        )
        ?.addEventListener(
            'change',
            event => {
                applySvgScenePresetV11(
                    modal,
                    event.currentTarget
                        .value
                );
            }
        );

    controls
        .querySelector(
            '.theme-builder-svg-default-animation'
        )
        ?.addEventListener(
            'change',
            event => {
                const value =
                    event.currentTarget
                        .value;

                modal._themeBackgroundSvgs =
                    (
                        modal._themeBackgroundSvgs ||
                        []
                    ).map(
                        svg => ({
                            ...svg,
                            animation:
                                svg.animationOverride ||
                                value
                        })
                    );

                const scene =
                    modal.querySelector(
                        '.theme-builder-svg-scene-preset'
                    );

                if (scene) {
                    scene.value =
                        'custom';
                }

                renderThemeBuilderSvgListV2(
                    modal
                );

                updateThemeBuilderPreview(
                    modal
                );
            }
        );

    distribution
        ?.addEventListener(
            'change',
            () => {
                const scene =
                    modal.querySelector(
                        '.theme-builder-svg-scene-preset'
                    );

                if (scene) {
                    scene.value =
                        'custom';
                }
            }
        );
}

const THEME_BUILDER_PANELS = Object.freeze([
    ['colors', 'Colors', 'ph-palette'],
    ['background', 'Background', 'ph-image'],
    ['audio', 'Audio', 'ph-music-notes'],
    ['svgs', 'Decorations', 'ph-images'],
    ['trinkets', 'Trinkets', 'ph-sparkle']
]);

const THEME_BUILDER_PANEL_IDS = new Set(
    THEME_BUILDER_PANELS.map(([id]) => id)
);

function themeBuilderPanelForElement(element) {
    if (!element || element.nodeType !== 1) return '';
    if (element.matches('.theme-builder-section-tabs-v11')) return '';

    if (element.matches('.theme-builder-accessories-v32')) {
        return 'trinkets';
    }

    if (
        element.matches('.theme-builder-background-controls, .theme-builder-creative-background-v56') ||
        element.querySelector('.theme-builder-background-file, .theme-background-code-input-v56, .theme-gradient-grid-v56')
    ) {
        return 'background';
    }

    if (element.querySelector('.theme-builder-audio-file')) {
        return 'audio';
    }

    if (
        element.matches('.theme-builder-svg-section') ||
        element.querySelector('.theme-builder-svg-file')
    ) {
        return 'svgs';
    }

    const declared = String(
        element.dataset?.themeBuilderPanelGroup || ''
    ).trim();

    return THEME_BUILDER_PANEL_IDS.has(declared)
        ? declared
        : 'colors';
}

function themeBuilderAccordionTitle(section, index = 0) {
    const heading = section
        ?.querySelector('.theme-builder-control-heading strong')
        ?.textContent
        ?.replace(/\s+/g, ' ')
        ?.trim();

    if (heading) return heading;

    if (section?.classList.contains('theme-builder-identity-section-v69')) {
        return 'Theme Identity';
    }
    if (
        section?.classList.contains('theme-builder-dashboard-colors-v40') ||
        section?.classList.contains('theme-builder-dashboard-colors-v42')
    ) {
        return 'Dashboard Colors';
    }
    if (section?.classList.contains('theme-builder-hover-controls-v10')) {
        return 'Interactive Hover';
    }
    if (section?.classList.contains('theme-builder-kb-category-controls-v12')) {
        return 'Category Bars';
    }
    if (section?.classList.contains('theme-heading-background-controls-v59')) {
        return 'Section Heading Backdrop';
    }
    if (section?.classList.contains('theme-builder-kb-card-opacity-v63')) {
        return 'Knowledge Base Cards';
    }
    if (section?.classList.contains('theme-builder-search-radius-section-v68')) {
        return 'Search Bar Roundness';
    }
    if (section?.querySelector('.theme-builder-nav-color-grid')) {
        return 'Navigation & Page Titles';
    }
    if (section?.querySelector('.theme-builder-sliders')) {
        return 'Shape & Type';
    }
    if (section?.querySelector('.theme-builder-color-grid')) {
        return 'Main Colors';
    }

    return `Color Settings ${index + 1}`;
}

function setThemeBuilderColorAccordionOpen(section, open) {
    const isOpen = !!open;
    const toggle = section?.querySelector(':scope > .theme-builder-accordion-toggle');
    const body = section?.querySelector(':scope > .theme-builder-accordion-body');

    section?.classList.toggle('is-open', isOpen);
    toggle?.setAttribute('aria-expanded', isOpen ? 'true' : 'false');

    if (body) {
        body.hidden = !isOpen;
        body.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
    }
}

function ensureThemeBuilderColorAccordion(modal, section, index) {
    if (!modal || !section) return;

    const title = themeBuilderAccordionTitle(section, index);
    section.dataset.themeBuilderPanelGroup = 'colors';
    section.dataset.themeAccordionKey = title;
    section.classList.add('theme-builder-accordion');

    let toggle = section.querySelector(':scope > .theme-builder-accordion-toggle');
    let body = section.querySelector(':scope > .theme-builder-accordion-body');

    if (!toggle) {
        toggle = document.createElement('button');
        toggle.type = 'button';
        toggle.className = 'theme-builder-accordion-toggle';
        section.prepend(toggle);
    }

    if (!body) {
        body = document.createElement('div');
        body.className = 'theme-builder-accordion-body';
        section.appendChild(body);
    }

    Array.from(section.children).forEach(child => {
        if (child === toggle || child === body) return;
        body.appendChild(child);
    });

    toggle.replaceChildren();

    const name = document.createElement('span');
    name.className = 'theme-builder-accordion-name';
    name.textContent = title;

    const caret = document.createElement('i');
    caret.className = 'ph ph-caret-down';
    caret.setAttribute('aria-hidden', 'true');

    toggle.append(name, caret);
    toggle.setAttribute('aria-label', title);

    toggle.onclick = event => {
        event.preventDefault();
        event.stopPropagation();

        const wasOpen = section.classList.contains('is-open');
        const host = modal.querySelector('.theme-builder-controls');

        host
            ?.querySelectorAll(':scope > .theme-builder-control-section[data-theme-builder-panel-group="colors"].theme-builder-accordion')
            .forEach(item => setThemeBuilderColorAccordionOpen(item, false));

        if (wasOpen) {
            modal._themeBuilderOpenColorAccordion = null;
            return;
        }

        setThemeBuilderColorAccordionOpen(section, true);
        modal._themeBuilderOpenColorAccordion = title;
    };

    setThemeBuilderColorAccordionOpen(
        section,
        modal._themeBuilderOpenColorAccordion === title
    );
}

function installThemeBuilderSectionTabsV11(modal) {
    const host = modal?.querySelector('.theme-builder-controls');
    if (!host) return;

    let tabs = host.querySelector(':scope > .theme-builder-section-tabs-v11');
    if (!tabs) {
        tabs = document.createElement('nav');
        tabs.className = 'theme-builder-section-tabs-v11';
        tabs.setAttribute('aria-label', 'Theme Builder sections');
        host.prepend(tabs);
    }

    const desiredTabIds = THEME_BUILDER_PANELS.map(([id]) => id).join('|');
    const currentTabIds = Array.from(
        tabs.querySelectorAll(':scope > [data-theme-builder-panel]')
    ).map(button => button.dataset.themeBuilderPanel).join('|');

    if (currentTabIds !== desiredTabIds) {
        tabs.innerHTML = THEME_BUILDER_PANELS
            .map(([id, label, icon]) => `
                <button type="button" data-theme-builder-panel="${id}">
                    <i class="ph ${icon}"></i>
                    <span>${label}</span>
                </button>
            `)
            .join('');
    }

    const topLevelItems = Array.from(host.children).filter(
        child => child !== tabs
    );

    const colorSections = topLevelItems.filter(element => {
        const panel = themeBuilderPanelForElement(element);
        element.dataset.themeBuilderPanelGroup = panel;
        return panel === 'colors' && element.matches('.theme-builder-control-section');
    });

    if (!modal._themeBuilderAccordionInitialized) {
        const titles = colorSections.map((section, index) =>
            themeBuilderAccordionTitle(section, index)
        );

        modal._themeBuilderOpenColorAccordion = titles.includes('Main Colors')
            ? 'Main Colors'
            : (titles[0] || null);
        modal._themeBuilderAccordionInitialized = true;
    }

    colorSections.forEach((section, index) =>
        ensureThemeBuilderColorAccordion(modal, section, index)
    );

    let activePanel = String(modal._themeBuilderUiPanelV11 || 'colors');
    if (!THEME_BUILDER_PANEL_IDS.has(activePanel)) activePanel = 'colors';

    const showPanel = panel => {
        const nextPanel = THEME_BUILDER_PANEL_IDS.has(panel)
            ? panel
            : 'colors';

        modal._themeBuilderUiPanelV11 = nextPanel;

        tabs
            .querySelectorAll(':scope > [data-theme-builder-panel]')
            .forEach(button => {
                button.classList.toggle(
                    'active',
                    button.dataset.themeBuilderPanel === nextPanel
                );
            });

        Array.from(host.children).forEach(element => {
            if (element === tabs) return;

            const owner = themeBuilderPanelForElement(element);
            element.dataset.themeBuilderPanelGroup = owner;
            element.classList.toggle(
                'theme-builder-panel-hidden-v11',
                owner !== nextPanel
            );
        });
    };

    tabs.onclick = event => {
        const button = event.target?.closest?.('[data-theme-builder-panel]');
        if (!button || !tabs.contains(button)) return;

        event.preventDefault();
        showPanel(button.dataset.themeBuilderPanel);
    };

    showPanel(activePanel);
}

function makeThemeBuilderUiConciseV11(
    modal
) {
    modal
        .querySelector(
            '.feature-modal-subtitle'
        )
        ?.remove();

    modal
        .querySelectorAll(
            '.theme-builder-control-heading small'
        )
        .forEach(
            item =>
                item.remove()
        );

    modal
        .querySelectorAll(
            '.theme-builder-visual-toggle-copy small'
        )
        .forEach(
            item =>
                item.remove()
        );

    modal
        .querySelectorAll(
            '.theme-builder-audio-mode-option small'
        )
        .forEach(
            item =>
                item.remove()
        );

    modal
        .querySelectorAll(
            '.theme-builder-upload-status'
        )
        .forEach(
            item =>
                item.classList.add(
                    'hidden'
                )
        );
}

function organizeThemeBuilderUiV11(
    modal,
    theme
) {
    makeThemeBuilderUiConciseV11(
        modal
    );

    ensureThemeBuilderGlobalSvgControlsV11(
        modal,
        theme
    );

    installThemeBuilderSectionTabsV11(
        modal
    );
}

const populateThemeBuilderBeforeV11 =
    populateThemeBuilder;

populateThemeBuilder =
    function(
        modal,
        theme
    ) {
        const defaultAnimation =
            inferSvgDefaultAnimationV11(
                theme
            );

        const merged = {
            ...CUSTOM_THEME_V11_DEFAULTS,
            ...(theme || {}),
            svgDefaultAnimation:
                defaultAnimation,
            backgroundSvgs:
                Array.isArray(
                    theme?.backgroundSvgs
                )
                    ? theme.backgroundSvgs
                        .map(
                            svg =>
                                normalizeSvgOverrideV11(
                                    svg,
                                    defaultAnimation
                                )
                        )
                    : []
        };

        populateThemeBuilderBeforeV11(
            modal,
            merged
        );

        organizeThemeBuilderUiV11(
            modal,
            merged
        );

        renderThemeBuilderSvgListV2(
            modal
        );

        updateThemeBuilderPreview(
            modal
        );
    };

const renderThemeBuilderSvgListBeforeV11 =
    renderThemeBuilderSvgListV2;

renderThemeBuilderSvgListV2 =
    function(
        modal
    ) {
        const defaultAnimation =
            modal
                .querySelector(
                    '.theme-builder-svg-default-animation'
                )
                ?.value ||
            inferSvgDefaultAnimationV11({
                backgroundSvgs:
                    modal._themeBackgroundSvgs
            });

        modal._themeBackgroundSvgs =
            (
                modal._themeBackgroundSvgs ||
                []
            ).map(
                svg =>
                    normalizeSvgOverrideV11(
                        svg,
                        defaultAnimation
                    )
            );

        renderThemeBuilderSvgListBeforeV11(
            modal
        );

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

                    const svg =
                        modal
                            ._themeBackgroundSvgs[
                            index
                        ];

                    if (!svg) {
                        return;
                    }

                    const options =
                        card.querySelector(
                            '.theme-builder-svg-card-options-v10'
                        );

                    if (!options) {
                        return;
                    }

                    const oldAnimation =
                        options.querySelector(
                            '.theme-builder-svg-animation-select'
                        );

                    if (oldAnimation) {
                        const override =
                            svg.animationOverride ||
                            '';

                        oldAnimation.innerHTML = `
                            <option value="">
                                Use Default · ${escapeCustomHtml(themeBuilderAnimationLabelV11(defaultAnimation))}
                            </option>

                            ${THEME_SVG_ANIMATION_OPTIONS_V11
                                .map(
                                    ([value, label]) => `
                                        <option
                                            value="${escapeCustomHtml(value)}"
                                            ${override === value
                                                ? 'selected'
                                                : ''}
                                        >
                                            ${escapeCustomHtml(label)}
                                        </option>
                                    `
                                )
                                .join('')}
                        `;

                        oldAnimation.value =
                            override;

                        oldAnimation.onchange =
                            event => {
                                svg.animationOverride =
                                    event
                                        .currentTarget
                                        .value;

                                svg.animation =
                                    getEffectiveSvgAnimationV11(
                                        svg,
                                        defaultAnimation
                                    );

                                updateThemeBuilderPreview(
                                    modal
                                );
                            };
                    }

                    const copy =
                        card.querySelector(
                            '.theme-builder-svg-card-copy'
                        );

                    if (!copy) {
                        return;
                    }

                    let customize =
                        copy.querySelector(
                            '.theme-builder-svg-customize-v11'
                        );

                    if (!customize) {
                        customize =
                            document.createElement(
                                'button'
                            );

                        customize.type =
                            'button';

                        customize.className =
                            'theme-builder-svg-customize-v11';

                        customize.innerHTML =
                            '<i class="ph ph-sliders-horizontal"></i><span>Customize</span>';

                        copy.insertBefore(
                            customize,
                            options
                        );
                    }

                    const hasOverride =
                        !!svg.animationOverride ||
                        svg.introBop ===
                            false ||
                        !!svg.hoverSoundUrl;

                    card.classList.toggle(
                        'svg-card-custom-open-v11',
                        card.classList.contains(
                            'svg-card-custom-open-v11'
                        ) ||
                            hasOverride
                    );

                    customize.onclick =
                        event => {
                            event.preventDefault();
                            event.stopPropagation();

                            card.classList.toggle(
                                'svg-card-custom-open-v11'
                            );
                        };
                }
            );
    };

function laneAssignmentsV11(
    refs
) {
    const laneCount =
        Math.max(
            1,
            Math.min(
                11,
                refs.length
            )
        );

    return refs.map(
        (
            entry,
            index
        ) => ({
            ...entry,
            left:
                index %
                    2 ===
                0
                    ? 12
                    : 88,
            top:
                7 +
                (
                    index %
                    laneCount
                ) *
                    (
                        86 /
                        Math.max(
                            1,
                            laneCount -
                                1
                        )
                    )
        })
    );
}

function columnAssignmentsV11(
    refs
) {
    const count =
        Math.max(
            1,
            Math.min(
                12,
                refs.length
            )
        );

    return refs.map(
        (
            entry,
            index
        ) => ({
            ...entry,
            left:
                7 +
                (
                    index %
                    count
                ) *
                    (
                        86 /
                        Math.max(
                            1,
                            count -
                                1
                        )
                    ),
            top:
                8 +
                (
                    index *
                    17
                ) %
                    76
        })
    );
}

const getPreviewSvgAssignmentsBeforeV11 =
    getPreviewSvgAssignmentsV10;

getPreviewSvgAssignmentsV10 =
    function(
        modal,
        draft
    ) {
        const base =
            getPreviewSvgAssignmentsBeforeV11(
                modal,
                draft
            );

        if (
            draft.svgDistribution ===
            'lanes'
        ) {
            return laneAssignmentsV11(
                base
            );
        }

        if (
            draft.svgDistribution ===
            'columns'
        ) {
            return columnAssignmentsV11(
                base
            );
        }

        return base;
    };

const getRuntimeSvgAssignmentsBeforeV11 =
    getRuntimeSvgAssignmentsV10;

getRuntimeSvgAssignmentsV10 =
    function(
        theme
    ) {
        const base =
            getRuntimeSvgAssignmentsBeforeV11(
                theme
            );

        if (
            theme.svgDistribution ===
            'lanes'
        ) {
            return laneAssignmentsV11(
                base
            );
        }

        if (
            theme.svgDistribution ===
            'columns'
        ) {
            return columnAssignmentsV11(
                base
            );
        }

        return base;
    };

function forceThemeBuilderTabIconColorV11(
    modal
) {
    const draft =
        getThemeBuilderDraft(
            modal
        );

    const canvas =
        modal.querySelector(
            '.theme-builder-live-canvas'
        );

    if (!canvas) {
        return;
    }

    canvas.style.setProperty(
        '--custom-theme-tab-icon-color',
        draft.tabIconColor,
        'important'
    );

    canvas
        .querySelectorAll(
            '.theme-builder-live-side-nav .icon-btn, .theme-builder-live-side-nav .custom-tab-nav-btn, .theme-builder-live-side-nav i, .theme-builder-live-side-nav svg'
        )
        .forEach(
            element => {
                element.style.setProperty(
                    'color',
                    draft.tabIconColor,
                    'important'
                );

                element.style.setProperty(
                    'stroke',
                    'currentColor',
                    'important'
                );
            }
        );
}

const applyThemeBuilderDraftToActualPreviewBeforeV11 =
    applyThemeBuilderDraftToActualPreviewV5;

applyThemeBuilderDraftToActualPreviewV5 =
    function(
        modal
    ) {
        const draft =
            getThemeBuilderDraft(
                modal
            );

        modal._themeBackgroundSvgs =
            (
                modal._themeBackgroundSvgs ||
                []
            ).map(
                svg => {
                    const normalized =
                        normalizeSvgOverrideV11(
                            svg,
                            draft.svgDefaultAnimation
                        );

                    normalized.animation =
                        getEffectiveSvgAnimationV11(
                            normalized,
                            draft.svgDefaultAnimation
                        );

                    return normalized;
                }
            );

        applyThemeBuilderDraftToActualPreviewBeforeV11(
            modal
        );

        const canvas =
            modal.querySelector(
                '.theme-builder-live-canvas'
            );

        if (!canvas) {
            return;
        }

        canvas.style.setProperty(
            '--custom-theme-hover-color',
            draft.hoverColor,
            'important'
        );

        canvas.style.setProperty(
            '--custom-theme-hover-opacity',
            `${Math.max(
                0,
                Math.min(
                    100,
                    Number(
                        draft.hoverOpacity
                    ) ||
                    0
                )
            )}%`,
            'important'
        );

        forceThemeBuilderTabIconColorV11(
            modal
        );
    };

const applyCustomBuiltThemeBeforeV11 =
    applyCustomBuiltTheme;

applyCustomBuiltTheme =
    function(
        theme =
            getCustomThemeSettings()
    ) {
        const defaultAnimation =
            inferSvgDefaultAnimationV11(
                theme
            );

        const merged = {
            ...CUSTOM_THEME_V11_DEFAULTS,
            ...(theme || {}),
            svgDefaultAnimation:
                defaultAnimation,
            backgroundSvgs:
                Array.isArray(
                    theme?.backgroundSvgs
                )
                    ? theme.backgroundSvgs
                        .map(
                            svg => {
                                const normalized =
                                    normalizeSvgOverrideV11(
                                        svg,
                                        defaultAnimation
                                    );

                                normalized.animation =
                                    getEffectiveSvgAnimationV11(
                                        normalized,
                                        defaultAnimation
                                    );

                                return normalized;
                            }
                        )
                    : []
        };

        applyCustomBuiltThemeBeforeV11(
            merged
        );

        const root =
            document.documentElement;

        root.style.setProperty(
            '--custom-theme-tab-icon-color',
            merged.tabIconColor,
            'important'
        );

        root.style.setProperty(
            '--custom-theme-hover-color',
            merged.hoverColor,
            'important'
        );

        root.style.setProperty(
            '--custom-theme-hover-opacity',
            `${Math.max(
                0,
                Math.min(
                    100,
                    Number(
                        merged.hoverOpacity
                    ) ||
                    0
                )
            )}%`,
            'important'
        );
    };

const clearCustomBuiltThemeBeforeV11 =
    clearCustomBuiltTheme;

clearCustomBuiltTheme =
    function() {
        clearCustomBuiltThemeBeforeV11();

        const root =
            document.documentElement;

        [
            '--custom-theme-tab-icon-color',
            '--custom-theme-hover-color',
            '--custom-theme-hover-opacity'
        ].forEach(
            name =>
                root.style.removeProperty(
                    name
                )
        );
    };

// Make actual preview tabs clickable after every rebuild and keep the dropdown gone.
const rebuildActualThemeBuilderPreviewBeforeV11 =
    rebuildActualThemeBuilderPreviewV5;

rebuildActualThemeBuilderPreviewV5 =
    function(
        modal
    ) {
        rebuildActualThemeBuilderPreviewBeforeV11(
            modal
        );

        bindThemeBuilderPreviewTabsV10(
            modal
        );

        forceThemeBuilderTabIconColorV11(
            modal
        );

        requestAnimationFrame(
            () =>
                fitActualThemeBuilderPreviewV9(
                    modal
                )
        );
    };



// ============================================================
// THEME BUILDER V12 — DAY PREVIEW, STABLE MODAL, TRUE HOVER,
// KNOWLEDGE CATEGORY COLORS, STICKY HEADER
// ============================================================

const CUSTOM_THEME_V12_DEFAULTS = {
    kbCategoryBackgroundColor: '#ffffff',
    kbCategoryTextColor: '#171717',
    kbCategoryHoverBackgroundColor: '#d9d2ff',
    kbCategoryHoverTextColor: '#171717'
};

function themeClampV12(
    value,
    min,
    max
) {
    return Math.max(
        min,
        Math.min(
            max,
            Number(value) || 0
        )
    );
}

function themeHexToRgbV12(
    value
) {
    let hex =
        String(value || '')
            .trim()
            .replace(
                '#',
                ''
            );

    if (
        /^[0-9a-f]{3}$/i.test(
            hex
        )
    ) {
        hex =
            hex
                .split('')
                .map(
                    char =>
                        char + char
                )
                .join('');
    }

    if (
        !/^[0-9a-f]{6}$/i.test(
            hex
        )
    ) {
        return null;
    }

    return {
        r:
            parseInt(
                hex.slice(0, 2),
                16
            ),
        g:
            parseInt(
                hex.slice(2, 4),
                16
            ),
        b:
            parseInt(
                hex.slice(4, 6),
                16
            )
    };
}

function themeRgbToHexV12(
    rgb
) {
    const hex =
        value =>
            Math.round(
                themeClampV12(
                    value,
                    0,
                    255
                )
            )
                .toString(16)
                .padStart(
                    2,
                    '0'
                );

    return (
        '#' +
        hex(rgb.r) +
        hex(rgb.g) +
        hex(rgb.b)
    );
}

function mixThemeColorsV12(
    foreground,
    background,
    opacityPercent
) {
    const fg =
        themeHexToRgbV12(
            foreground
        );

    const bg =
        themeHexToRgbV12(
            background
        );

    if (!fg) {
        return (
            background ||
            '#ffffff'
        );
    }

    if (!bg) {
        return (
            foreground ||
            '#d9d2ff'
        );
    }

    const alpha =
        themeClampV12(
            opacityPercent,
            0,
            100
        ) /
        100;

    return themeRgbToHexV12({
        r:
            fg.r *
                alpha +
            bg.r *
                (
                    1 -
                    alpha
                ),
        g:
            fg.g *
                alpha +
            bg.g *
                (
                    1 -
                    alpha
                ),
        b:
            fg.b *
                alpha +
            bg.b *
                (
                    1 -
                    alpha
                )
    });
}

const getThemeBuilderDraftBeforeV12 =
    getThemeBuilderDraft;

getThemeBuilderDraft =
    function(
        modal
    ) {
        const draft = {
            ...CUSTOM_THEME_V12_DEFAULTS,
            ...getThemeBuilderDraftBeforeV12(
                modal
            )
        };

        [
            'kbCategoryBackgroundColor',
            'kbCategoryTextColor',
            'kbCategoryHoverBackgroundColor',
            'kbCategoryHoverTextColor'
        ].forEach(
            key => {
                const input =
                    modal
                        .querySelector(
                            `[data-theme-key="${key}"]`
                        );

                if (
                    input?.value
                ) {
                    draft[key] =
                        input.value;
                }
            }
        );

        return draft;
    };

function bindThemeBuilderColorFieldV12(
    modal,
    key
) {
    const picker =
        modal.querySelector(
            `input[type="color"][data-theme-key="${key}"]`
        );

    const hex =
        modal.querySelector(
            `[data-theme-hex="${key}"]`
        );

    if (
        !picker ||
        picker.dataset
            .themeBuilderV12Bound ===
            'true'
    ) {
        return;
    }

    picker.dataset
        .themeBuilderV12Bound =
        'true';

    picker.addEventListener(
        'input',
        () => {
            if (hex) {
                hex.value =
                    picker.value;
            }

            updateThemeBuilderPreview(
                modal
            );
        }
    );

    hex?.addEventListener(
        'input',
        () => {
            const value =
                hex.value.trim();

            if (
                /^#[0-9a-f]{6}$/i.test(
                    value
                )
            ) {
                picker.value =
                    value;

                updateThemeBuilderPreview(
                    modal
                );
            }
        }
    );
}

function ensureThemeBuilderKnowledgeCategoryControlsV12(
    modal,
    theme
) {
    modal
        .querySelector(
            '.theme-builder-kb-category-controls-v12'
        )
        ?.remove();

    const hoverSection =
        modal.querySelector(
            '.theme-builder-hover-controls-v10'
        );

    const navSection =
        modal
            .querySelector(
                '.theme-builder-nav-color-grid'
            )
            ?.closest(
                '.theme-builder-control-section'
            );

    const anchor =
        hoverSection ||
        navSection;

    if (!anchor) {
        return;
    }

    const merged = {
        ...CUSTOM_THEME_V12_DEFAULTS,
        ...(theme || {})
    };

    // New themes inherit from the theme's own surfaces unless explicitly saved.
    if (
        !theme?.kbCategoryBackgroundColor
    ) {
        merged.kbCategoryBackgroundColor =
            theme?.surface ||
            merged.kbCategoryBackgroundColor;
    }

    if (
        !theme?.kbCategoryTextColor
    ) {
        merged.kbCategoryTextColor =
            theme?.text ||
            merged.kbCategoryTextColor;
    }

    if (
        !theme?.kbCategoryHoverBackgroundColor
    ) {
        merged.kbCategoryHoverBackgroundColor =
            theme?.hoverColor ||
            theme?.accent ||
            merged.kbCategoryHoverBackgroundColor;
    }

    if (
        !theme?.kbCategoryHoverTextColor
    ) {
        merged.kbCategoryHoverTextColor =
            theme?.text ||
            merged.kbCategoryHoverTextColor;
    }

    const section =
        document.createElement(
            'section'
        );

    section.className =
        'theme-builder-control-section theme-builder-kb-category-controls-v12';

    section.innerHTML = `
        <div class="theme-builder-control-heading">
            <strong>Knowledge Base Categories</strong>
        </div>

        <div class="theme-builder-color-grid theme-builder-kb-category-color-grid-v12">
            ${themeBuilderField(
                'Category Background',
                'kbCategoryBackgroundColor',
                merged.kbCategoryBackgroundColor
            )}

            ${themeBuilderField(
                'Category Text',
                'kbCategoryTextColor',
                merged.kbCategoryTextColor
            )}

            ${themeBuilderField(
                'Category Hover Background',
                'kbCategoryHoverBackgroundColor',
                merged.kbCategoryHoverBackgroundColor
            )}

            ${themeBuilderField(
                'Category Hover Text',
                'kbCategoryHoverTextColor',
                merged.kbCategoryHoverTextColor
            )}
        </div>
    `;

    anchor.insertAdjacentElement(
        'afterend',
        section
    );

    [
        'kbCategoryBackgroundColor',
        'kbCategoryTextColor',
        'kbCategoryHoverBackgroundColor',
        'kbCategoryHoverTextColor'
    ].forEach(
        key =>
            bindThemeBuilderColorFieldV12(
                modal,
                key
            )
    );
}

function applyThemeBuilderInteractionVarsV12(
    target,
    draft
) {
    if (!target) {
        return;
    }

    const surface =
        draft.surface ||
        '#ffffff';

    const hoverSolid =
        mixThemeColorsV12(
            draft.hoverColor,
            surface,
            draft.hoverOpacity
        );

    const variables = {
        '--custom-theme-hover-solid':
            hoverSolid,
        '--custom-theme-kb-category-bg':
            draft.kbCategoryBackgroundColor,
        '--custom-theme-kb-category-text':
            draft.kbCategoryTextColor,
        '--custom-theme-kb-category-hover-bg':
            draft.kbCategoryHoverBackgroundColor,
        '--custom-theme-kb-category-hover-text':
            draft.kbCategoryHoverTextColor
    };

    Object.entries(
        variables
    ).forEach(
        (
            [
                name,
                value
            ]
        ) => {
            target.style.setProperty(
                name,
                value,
                'important'
            );
        }
    );
}

function prepareThemeBuilderDayPreviewV12(
    modal
) {
    const canvas =
        modal.querySelector(
            '.theme-builder-live-canvas'
        );

    const page =
        canvas?.querySelector(
            '.theme-builder-live-page'
        );

    if (
        !canvas ||
        !page ||
        canvas.dataset
            .previewSourceId !==
            'log-view'
    ) {
        return;
    }

    const day =
        Math.max(
            1,
            Number(
                modal
                    ._themeBuilderPreviewDay
            ) ||
                currentDay ||
                1
        );

    const dayData =
        db.days?.[day] ||
        {};

    const badge =
        page.querySelector(
            '[data-preview-original-id="current-day-badge"]'
        );

    if (badge) {
        badge.textContent =
            String(day);
    }

    const date =
        page.querySelector(
            '[data-preview-original-id="current-date-title"]'
        );

    if (date) {
        try {
            date.textContent =
                formatDate(
                    day
                );
        } catch {
            date.textContent =
                `Day ${day}`;
        }
    }

    const notes =
        page.querySelector(
            '[data-preview-original-id="log-notes"]'
        );

    if (notes) {
        notes.innerHTML =
            dayData.notes ||
            '';
    }

    const phrases =
        page.querySelector(
            '[data-preview-original-id="phrases-container"]'
        );

    if (phrases) {
        phrases.innerHTML =
            (
                dayData.phrases ||
                []
            )
                .slice(
                    0,
                    8
                )
                .map(
                    phrase => `
                        <div class="chip">
                            <div class="kb-day-item-title-row">
                                <button
                                    type="button"
                                    class="kb-day-item-main"
                                    tabindex="-1"
                                >
                                    <span class="kb-day-item-title">
                                        ${escapeKnowledgeHtml(phrase)}
                                    </span>
                                </button>
                            </div>
                        </div>
                    `
                )
                .join('');
    }

    const tools =
        page.querySelector(
            '[data-preview-original-id="tools-container"]'
        );

    if (tools) {
        tools.innerHTML =
            (
                dayData.tools ||
                []
            )
                .slice(
                    0,
                    8
                )
                .map(
                    name => `
                        <div class="tool-row">
                            <i class="ph ph-wrench"></i>
                            <span class="tool-row-name">
                                ${escapeKnowledgeHtml(name)}
                            </span>
                        </div>
                    `
                )
                .join('');
    }
}

function bindThemeBuilderDayCardsV12(
    modal
) {
    const canvas =
        modal.querySelector(
            '.theme-builder-live-canvas'
        );

    if (
        !canvas ||
        canvas.dataset
            .previewSourceId !==
            'grid-view'
    ) {
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
            '[data-day]'
        )
        .forEach(
            element => {
                const day =
                    Number(
                        element.dataset
                            .day
                    );

                if (
                    !Number.isFinite(
                        day
                    ) ||
                    day <
                        1
                ) {
                    return;
                }

                const clickable =
                    element.matches(
                        '.polaroid-card'
                    )
                        ? element
                        : (
                            element.querySelector(
                                '.day-box'
                            ) ||
                            element
                        );

                clickable.classList.add(
                    'theme-builder-preview-day-clickable-v12'
                );

                clickable.addEventListener(
                    'click',
                    event => {
                        event.preventDefault();
                        event.stopPropagation();

                        modal._themeBuilderPreviewDay =
                            day;

                        modal._themeBuilderPreviewSourceId =
                            'log-view';

                        rebuildActualThemeBuilderPreviewV5(
                            modal
                        );
                    }
                );
            }
        );
}

const applyThemeBuilderDraftToActualPreviewBeforeV12 =
    applyThemeBuilderDraftToActualPreviewV5;

applyThemeBuilderDraftToActualPreviewV5 =
    function(
        modal
    ) {
        applyThemeBuilderDraftToActualPreviewBeforeV12(
            modal
        );

        const draft =
            getThemeBuilderDraft(
                modal
            );

        const canvas =
            modal.querySelector(
                '.theme-builder-live-canvas'
            );

        if (!canvas) {
            return;
        }

        applyThemeBuilderInteractionVarsV12(
            canvas,
            draft
        );

        prepareThemeBuilderDayPreviewV12(
            modal
        );

        bindThemeBuilderDayCardsV12(
            modal
        );
    };

const rebuildActualThemeBuilderPreviewBeforeV12 =
    rebuildActualThemeBuilderPreviewV5;

rebuildActualThemeBuilderPreviewV5 =
    function(
        modal
    ) {
        rebuildActualThemeBuilderPreviewBeforeV12(
            modal
        );

        prepareThemeBuilderDayPreviewV12(
            modal
        );

        bindThemeBuilderDayCardsV12(
            modal
        );

        bindThemeBuilderPreviewTabsV10(
            modal
        );

        requestAnimationFrame(
            () =>
                fitActualThemeBuilderPreviewV9(
                    modal
                )
        );
    };

const populateThemeBuilderBeforeV12 =
    populateThemeBuilder;

populateThemeBuilder =
    function(
        modal,
        theme
    ) {
        const merged = {
            ...CUSTOM_THEME_V12_DEFAULTS,
            ...(theme || {})
        };

        populateThemeBuilderBeforeV12(
            modal,
            merged
        );

        ensureThemeBuilderKnowledgeCategoryControlsV12(
            modal,
            merged
        );

        // Rebuild the section bar so this new color section belongs to Colors.
        installThemeBuilderSectionTabsV11(
            modal
        );

        updateThemeBuilderPreview(
            modal
        );
    };

const applyCustomBuiltThemeBeforeV12 =
    applyCustomBuiltTheme;

applyCustomBuiltTheme =
    function(
        theme =
            getCustomThemeSettings()
    ) {
        const merged = {
            ...CUSTOM_THEME_V12_DEFAULTS,
            ...(theme || {})
        };

        if (
            !theme?.kbCategoryBackgroundColor
        ) {
            merged.kbCategoryBackgroundColor =
                merged.surface;
        }

        if (
            !theme?.kbCategoryTextColor
        ) {
            merged.kbCategoryTextColor =
                merged.text;
        }

        if (
            !theme?.kbCategoryHoverBackgroundColor
        ) {
            merged.kbCategoryHoverBackgroundColor =
                merged.hoverColor ||
                merged.accent;
        }

        if (
            !theme?.kbCategoryHoverTextColor
        ) {
            merged.kbCategoryHoverTextColor =
                merged.text;
        }

        applyCustomBuiltThemeBeforeV12(
            merged
        );

        applyThemeBuilderInteractionVarsV12(
            document.documentElement,
            merged
        );
    };

const clearCustomBuiltThemeBeforeV12 =
    clearCustomBuiltTheme;

clearCustomBuiltTheme =
    function() {
        clearCustomBuiltThemeBeforeV12();

        [
            '--custom-theme-hover-solid',
            '--custom-theme-kb-category-bg',
            '--custom-theme-kb-category-text',
            '--custom-theme-kb-category-hover-bg',
            '--custom-theme-kb-category-hover-text'
        ].forEach(
            name =>
                document.documentElement
                    .style
                    .removeProperty(
                        name
                    )
        );
    };



// ============================================================
// THEME BUILDER V13 — QUIET EDIT MODE, NAV BACKGROUND OPTIONS,
// CLICKABLE UPLOAD ZONES, BACK BUTTON COLOR
// ============================================================

const CUSTOM_THEME_V13_DEFAULTS = {
    backButtonColor: '#171717',

    tabNavIndividualBackgroundEnabled: false,
    tabNavIndividualBackgroundColor: '#ffffff',
    tabNavIndividualBackgroundOpacity: 88
};

function syncThemeBuilderOpenStateV13(
    modal
) {
    const open =
        !!modal &&
        !modal.classList.contains(
            'hidden'
        );

    document.body.classList.toggle(
        'theme-builder-open',
        open
    );

    if (!open) {
        stopThemeBuilderIntroPreviewV10?.(
            modal
        );
    }
}

const ensureThemeBuilderModalBeforeV13 =
    ensureThemeBuilderModal;

ensureThemeBuilderModal =
    function() {
        const modal =
            ensureThemeBuilderModalBeforeV13();

        if (!modal) {
            return modal;
        }

        if (
            modal.dataset
                .themeBuilderQuietModeV13 !==
                'true'
        ) {
            modal.dataset
                .themeBuilderQuietModeV13 =
                'true';

            // Stop hover/mouse movement from bubbling out of Theme Builder
            // into the currently applied theme's global hover handlers.
            [
                'mousemove',
                'pointermove',
                'mouseover',
                'pointerover'
            ].forEach(
                type => {
                    modal.addEventListener(
                        type,
                        event => {
                            event.stopPropagation();
                        }
                    );
                }
            );

            const observer =
                new MutationObserver(
                    () =>
                        syncThemeBuilderOpenStateV13(
                            modal
                        )
                );

            observer.observe(
                modal,
                {
                    attributes:
                        true,
                    attributeFilter:
                        ['class']
                }
            );

            modal._themeBuilderOpenObserverV13 =
                observer;
        }

        syncThemeBuilderOpenStateV13(
            modal
        );

        return modal;
    };

const getThemeBuilderDraftBeforeV13 =
    getThemeBuilderDraft;

getThemeBuilderDraft =
    function(
        modal
    ) {
        const draft = {
            ...CUSTOM_THEME_V13_DEFAULTS,
            ...getThemeBuilderDraftBeforeV13(
                modal
            )
        };

        draft.backButtonColor =
            modal
                .querySelector(
                    '[data-theme-key="backButtonColor"]'
                )
                ?.value ||
            draft.backButtonColor;

        draft.tabNavIndividualBackgroundEnabled =
            !!modal
                .querySelector(
                    '.theme-builder-nav-individual-bg-enabled'
                )
                ?.checked;

        draft.tabNavIndividualBackgroundColor =
            modal
                .querySelector(
                    '[data-theme-key="tabNavIndividualBackgroundColor"]'
                )
                ?.value ||
            draft.tabNavIndividualBackgroundColor;

        const opacity =
            Number(
                modal
                    .querySelector(
                        '.theme-builder-nav-individual-bg-opacity'
                    )
                    ?.value
            );

        if (
            Number.isFinite(
                opacity
            )
        ) {
            draft.tabNavIndividualBackgroundOpacity =
                themeClampV12(
                    opacity,
                    0,
                    100
                );
        }

        return draft;
    };

function updateThemeBuilderIndividualNavDetailsV13(
    modal
) {
    const enabled =
        !!modal
            .querySelector(
                '.theme-builder-nav-individual-bg-enabled'
            )
            ?.checked;

    modal
        .querySelector(
            '.theme-builder-nav-individual-bg-details'
        )
        ?.classList.toggle(
            'disabled',
            !enabled
        );
}

function enforceExclusiveThemeNavBackgroundsV13(
    modal,
    changed
) {
    const full =
        modal.querySelector(
            '.theme-builder-nav-background-enabled'
        );

    const individual =
        modal.querySelector(
            '.theme-builder-nav-individual-bg-enabled'
        );

    if (
        changed ===
            'full' &&
        full?.checked &&
        individual
    ) {
        individual.checked =
            false;
    }

    if (
        changed ===
            'individual' &&
        individual?.checked &&
        full
    ) {
        full.checked =
            false;
    }

    const fullDetails =
        modal.querySelector(
            '.theme-builder-nav-background-details'
        );

    fullDetails?.classList.toggle(
        'disabled',
        !full?.checked
    );

    updateThemeBuilderIndividualNavDetailsV13(
        modal
    );

    updateThemeBuilderPreview(
        modal
    );
}

function ensureThemeBuilderNavOptionsV13(
    modal,
    theme
) {
    const navGrid =
        modal.querySelector(
            '.theme-builder-nav-color-grid'
        );

    if (!navGrid) {
        return;
    }

    const merged = {
        ...CUSTOM_THEME_V13_DEFAULTS,
        ...(theme || {})
    };

    // Back button color joins tab icon/title colors.
    if (
        !navGrid.querySelector(
            '[data-theme-key="backButtonColor"]'
        )
    ) {
        navGrid.insertAdjacentHTML(
            'beforeend',
            themeBuilderField(
                'Back Button Color',
                'backButtonColor',
                merged.backButtonColor
            )
        );

        bindThemeBuilderColorFieldV12(
            modal,
            'backButtonColor'
        );
    }

    const fullHost =
        modal.querySelector(
            '.theme-builder-nav-background-settings'
        );

    if (fullHost) {
        const title =
            fullHost.querySelector(
                '.theme-builder-nav-background-toggle .theme-builder-visual-toggle-copy strong'
            );

        if (title) {
            title.textContent =
                'Full background behind tab navbar';
        }
    }

    let individualHost =
        modal.querySelector(
            '.theme-builder-nav-individual-bg-settings-v13'
        );

    if (!individualHost) {
        individualHost =
            document.createElement(
                'div'
            );

        individualHost.className =
            'theme-builder-nav-individual-bg-settings-v13';

        individualHost.innerHTML = `
            ${themeBuilderSimpleToggleV10(
                'theme-builder-nav-individual-bg-toggle',
                'Individual backgrounds behind tab icons',
                !!merged.tabNavIndividualBackgroundEnabled
            )}

            <div class="theme-builder-backdrop-details theme-builder-nav-individual-bg-details">
                ${themeBuilderField(
                    'Individual Icon Background',
                    'tabNavIndividualBackgroundColor',
                    merged.tabNavIndividualBackgroundColor
                )}

                ${themeBuilderOpacityControlV4(
                    'Individual Icon Background Opacity',
                    'theme-builder-nav-individual-bg-opacity',
                    merged.tabNavIndividualBackgroundOpacity
                )}
            </div>
        `;

        if (fullHost) {
            fullHost.insertAdjacentElement(
                'afterend',
                individualHost
            );
        } else {
            navGrid.insertAdjacentElement(
                'afterend',
                individualHost
            );
        }
    }

    const individualToggle =
        individualHost.querySelector(
            '.theme-builder-nav-individual-bg-toggle input'
        );

    if (individualToggle) {
        individualToggle.classList.add(
            'theme-builder-nav-individual-bg-enabled'
        );

        individualToggle.checked =
            !!merged.tabNavIndividualBackgroundEnabled;
    }

    const color =
        individualHost.querySelector(
            '[data-theme-key="tabNavIndividualBackgroundColor"]'
        );

    if (color) {
        color.value =
            merged.tabNavIndividualBackgroundColor;
    }

    const hex =
        individualHost.querySelector(
            '[data-theme-hex="tabNavIndividualBackgroundColor"]'
        );

    if (hex) {
        hex.value =
            merged.tabNavIndividualBackgroundColor;
    }

    const opacity =
        individualHost.querySelector(
            '.theme-builder-nav-individual-bg-opacity'
        );

    if (opacity) {
        opacity.value =
            String(
                merged.tabNavIndividualBackgroundOpacity
            );

        const output =
            opacity
                .closest(
                    '.theme-builder-opacity-field'
                )
                ?.querySelector(
                    'output'
                );

        if (output) {
            output.textContent =
                `${Math.round(
                    Number(
                        opacity.value
                    ) ||
                    0
                )}%`;
        }
    }

    bindThemeBuilderColorFieldV12(
        modal,
        'tabNavIndividualBackgroundColor'
    );

    const fullToggle =
        modal.querySelector(
            '.theme-builder-nav-background-enabled'
        );

    if (
        fullToggle &&
        fullToggle.dataset
            .themeBuilderExclusiveV13 !==
            'true'
    ) {
        fullToggle.dataset
            .themeBuilderExclusiveV13 =
            'true';

        fullToggle.addEventListener(
            'change',
            () =>
                enforceExclusiveThemeNavBackgroundsV13(
                    modal,
                    'full'
                )
        );
    }

    if (
        individualToggle &&
        individualToggle.dataset
            .themeBuilderExclusiveV13 !==
            'true'
    ) {
        individualToggle.dataset
            .themeBuilderExclusiveV13 =
            'true';

        individualToggle.addEventListener(
            'change',
            () =>
                enforceExclusiveThemeNavBackgroundsV13(
                    modal,
                    'individual'
                )
        );
    }

    if (
        opacity &&
        opacity.dataset
            .themeBuilderV13Bound !==
            'true'
    ) {
        opacity.dataset
            .themeBuilderV13Bound =
            'true';

        opacity.addEventListener(
            'input',
            () => {
                const output =
                    opacity
                        .closest(
                            '.theme-builder-opacity-field'
                        )
                        ?.querySelector(
                            'output'
                        );

                if (output) {
                    output.textContent =
                        `${Math.round(
                            Number(
                                opacity.value
                            ) ||
                            0
                        )}%`;
                }

                updateThemeBuilderPreview(
                    modal
                );
            }
        );
    }

    updateThemeBuilderIndividualNavDetailsV13(
        modal
    );
}

function prepareThemeBuilderUploadZonesV13(
    modal
) {
    const backgroundFile =
        modal.querySelector(
            '.theme-builder-background-file'
        );

    const backgroundRow =
        modal.querySelector(
            '.theme-builder-background-choose'
        )
        ?.closest(
            '.theme-builder-file-picker-row'
        );

    if (
        backgroundRow &&
        backgroundFile
    ) {
        backgroundRow.classList.add(
            'theme-builder-click-upload-zone-v13',
            'theme-builder-background-dropzone-v13'
        );

        if (
            backgroundRow.dataset
                .themeBuilderUploadV13 !==
                'true'
        ) {
            backgroundRow.dataset
                .themeBuilderUploadV13 =
                'true';

            backgroundRow.addEventListener(
                'click',
                event => {
                    if (
                        event.target.closest(
                            'button'
                        )
                    ) {
                        return;
                    }

                    backgroundFile.click();
                }
            );
        }
    }

    const svgFile =
        modal.querySelector(
            '.theme-builder-svg-file'
        );

    const svgToolbar =
        modal.querySelector(
            '.theme-builder-svg-toolbar'
        );

    if (
        svgToolbar &&
        svgFile
    ) {
        svgToolbar.classList.add(
            'theme-builder-click-upload-zone-v13',
            'theme-builder-svg-dropzone-v13'
        );

        if (
            !svgToolbar.querySelector(
                '.theme-builder-svg-dropzone-icon-v13'
            )
        ) {
            svgToolbar.insertAdjacentHTML(
                'afterbegin',
                '<i class="ph ph-file-svg theme-builder-svg-dropzone-icon-v13"></i>'
            );
        }

        if (
            svgToolbar.dataset
                .themeBuilderUploadV13 !==
                'true'
        ) {
            svgToolbar.dataset
                .themeBuilderUploadV13 =
                'true';

            svgToolbar.addEventListener(
                'click',
                event => {
                    if (
                        event.target.closest(
                            'button'
                        )
                    ) {
                        return;
                    }

                    svgFile.click();
                }
            );
        }
    }
}

const populateThemeBuilderBeforeV13 =
    populateThemeBuilder;

populateThemeBuilder =
    function(
        modal,
        theme
    ) {
        const merged = {
            ...CUSTOM_THEME_V13_DEFAULTS,
            ...(theme || {})
        };

        populateThemeBuilderBeforeV13(
            modal,
            merged
        );

        ensureThemeBuilderNavOptionsV13(
            modal,
            merged
        );

        prepareThemeBuilderUploadZonesV13(
            modal
        );

        installThemeBuilderSectionTabsV11(
            modal
        );

        updateThemeBuilderPreview(
            modal
        );
    };

function applyThemeBuilderNavVisualVarsV13(
    target,
    theme
) {
    if (!target) {
        return;
    }

    target.style.setProperty(
        '--custom-theme-back-button-color',
        theme.backButtonColor ||
        theme.text ||
        '#171717',
        'important'
    );

    const individualBg =
        theme.tabNavIndividualBackgroundEnabled
            ? hexToRgbaV4(
                theme.tabNavIndividualBackgroundColor ||
                '#ffffff',
                themeClampV12(
                    theme.tabNavIndividualBackgroundOpacity,
                    0,
                    100
                ) /
                100
            )
            : 'transparent';

    target.style.setProperty(
        '--custom-theme-tab-item-background',
        individualBg,
        'important'
    );
}

const applyThemeBuilderDraftToActualPreviewBeforeV13 =
    applyThemeBuilderDraftToActualPreviewV5;

applyThemeBuilderDraftToActualPreviewV5 =
    function(
        modal
    ) {
        applyThemeBuilderDraftToActualPreviewBeforeV13(
            modal
        );

        const canvas =
            modal.querySelector(
                '.theme-builder-live-canvas'
            );

        if (!canvas) {
            return;
        }

        applyThemeBuilderNavVisualVarsV13(
            canvas,
            getThemeBuilderDraft(
                modal
            )
        );
    };

const applyCustomBuiltThemeBeforeV13 =
    applyCustomBuiltTheme;

applyCustomBuiltTheme =
    function(
        theme =
            getCustomThemeSettings()
    ) {
        const merged = {
            ...CUSTOM_THEME_V13_DEFAULTS,
            ...(theme || {})
        };

        applyCustomBuiltThemeBeforeV13(
            merged
        );

        applyThemeBuilderNavVisualVarsV13(
            document.documentElement,
            merged
        );
    };

const clearCustomBuiltThemeBeforeV13 =
    clearCustomBuiltTheme;

clearCustomBuiltTheme =
    function() {
        clearCustomBuiltThemeBeforeV13();

        [
            '--custom-theme-back-button-color',
            '--custom-theme-tab-item-background'
        ].forEach(
            name =>
                document.documentElement
                    .style
                    .removeProperty(
                        name
                    )
        );
    };



// ============================================================
// THEME BUILDER V14 — GUARANTEED HOVER PREVIEW + DAY BACK NAV
// ============================================================

function getThemeBuilderPreviewHoverValuesV14(
    modal
) {
    const draft =
        getThemeBuilderDraft(
            modal
        );

    return {
        generalBackground:
            mixThemeColorsV12(
                draft.hoverColor,
                draft.surface ||
                    '#ffffff',
                draft.hoverOpacity
            ),

        kbBackground:
            draft.kbCategoryHoverBackgroundColor ||
            draft.hoverColor ||
            '#d9d2ff',

        kbText:
            draft.kbCategoryHoverTextColor ||
            draft.text ||
            '#171717'
    };
}

function restoreThemeBuilderPreviewHoverStyleV14(
    element
) {
    const previous =
        element
            ._themeBuilderHoverStyleV14;

    if (!previous) {
        return;
    }

    [
        'background',
        'background-color',
        'background-image',
        'color',
        '-webkit-text-fill-color'
    ].forEach(
        property => {
            const saved =
                previous[property];

            if (
                saved &&
                saved.value
            ) {
                element.style.setProperty(
                    property,
                    saved.value,
                    saved.priority ||
                    ''
                );
            } else {
                element.style.removeProperty(
                    property
                );
            }
        }
    );

    element._themeBuilderHoverStyleV14 =
        null;
}

function saveThemeBuilderPreviewHoverStyleV14(
    element
) {
    if (
        element
            ._themeBuilderHoverStyleV14
    ) {
        return;
    }

    const saved = {};

    [
        'background',
        'background-color',
        'background-image',
        'color',
        '-webkit-text-fill-color'
    ].forEach(
        property => {
            saved[property] = {
                value:
                    element.style
                        .getPropertyValue(
                            property
                        ),
                priority:
                    element.style
                        .getPropertyPriority(
                            property
                        )
            };
        }
    );

    element._themeBuilderHoverStyleV14 =
        saved;
}

function applyThemeBuilderPreviewHoverStyleV14(
    modal,
    element
) {
    if (
        !modal ||
        !element
    ) {
        return;
    }

    saveThemeBuilderPreviewHoverStyleV14(
        element
    );

    const values =
        getThemeBuilderPreviewHoverValuesV14(
            modal
        );

    const isKnowledgeCategory =
        element.matches(
            '.kb-category-grid-item, #library-filter-tabs .filter-tab'
        );

    const background =
        isKnowledgeCategory
            ? values.kbBackground
            : values.generalBackground;

    element.style.setProperty(
        'background',
        background,
        'important'
    );

    element.style.setProperty(
        'background-color',
        background,
        'important'
    );

    element.style.setProperty(
        'background-image',
        'none',
        'important'
    );

    if (
        isKnowledgeCategory
    ) {
        element.style.setProperty(
            'color',
            values.kbText,
            'important'
        );

        element.style.setProperty(
            '-webkit-text-fill-color',
            values.kbText,
            'important'
        );
    }
}

function bindThemeBuilderPreviewHoverV14(
    modal
) {
    const page =
        modal.querySelector(
            '.theme-builder-live-page'
        );

    if (!page) {
        return;
    }

    const selector = [
        'button',
        '.day-box',
        '.filter-tab',
        '.kb-category-grid-item',
        '.kb-field-summary-card',
        '.custom-component-palette-item',
        '.small-icon-btn',
        '.icon-btn'
    ].join(',');

    page
        .querySelectorAll(
            selector
        )
        .forEach(
            element => {
                if (
                    element.dataset
                        .themeBuilderHoverV14 ===
                    'true'
                ) {
                    return;
                }

                element.dataset
                    .themeBuilderHoverV14 =
                    'true';

                element.addEventListener(
                    'pointerenter',
                    () =>
                        applyThemeBuilderPreviewHoverStyleV14(
                            modal,
                            element
                        )
                );

                element.addEventListener(
                    'pointerleave',
                    () =>
                        restoreThemeBuilderPreviewHoverStyleV14(
                            element
                        )
                );
            }
        );
}

function refreshThemeBuilderPreviewHoveredElementsV14(
    modal
) {
    const page =
        modal.querySelector(
            '.theme-builder-live-page'
        );

    if (!page) {
        return;
    }

    page
        .querySelectorAll(
            '[data-theme-builder-hover-v14="true"]'
        )
        .forEach(
            element => {
                if (
                    element.matches(
                        ':hover'
                    )
                ) {
                    restoreThemeBuilderPreviewHoverStyleV14(
                        element
                    );

                    applyThemeBuilderPreviewHoverStyleV14(
                        modal,
                        element
                    );
                }
            }
        );
}

function bindThemeBuilderDayBackButtonV14(
    modal
) {
    const canvas =
        modal.querySelector(
            '.theme-builder-live-canvas'
        );

    if (
        !canvas ||
        canvas.dataset
            .previewSourceId !==
            'log-view'
    ) {
        return;
    }

    const page =
        canvas.querySelector(
            '.theme-builder-live-page'
        );

    if (!page) {
        return;
    }

    const buttons =
        new Set([
            ...page.querySelectorAll(
                '.header-back-btn'
            ),
            ...page.querySelectorAll(
                '[data-preview-original-id*="back"]'
            )
        ]);

    buttons.forEach(
        button => {
            if (
                button.dataset
                    .themeBuilderDayBackV14 ===
                'true'
            ) {
                return;
            }

            button.dataset
                .themeBuilderDayBackV14 =
                'true';

            button.classList.add(
                'theme-builder-preview-back-clickable-v14'
            );

            button.addEventListener(
                'click',
                event => {
                    event.preventDefault();
                    event.stopPropagation();

                    modal._themeBuilderPreviewSourceId =
                        'grid-view';

                    rebuildActualThemeBuilderPreviewV5(
                        modal
                    );
                }
            );
        }
    );
}

const applyThemeBuilderDraftToActualPreviewBeforeV14 =
    applyThemeBuilderDraftToActualPreviewV5;

applyThemeBuilderDraftToActualPreviewV5 =
    function(
        modal
    ) {
        applyThemeBuilderDraftToActualPreviewBeforeV14(
            modal
        );

        bindThemeBuilderPreviewHoverV14(
            modal
        );

        bindThemeBuilderDayBackButtonV14(
            modal
        );

        refreshThemeBuilderPreviewHoveredElementsV14(
            modal
        );
    };

const rebuildActualThemeBuilderPreviewBeforeV14 =
    rebuildActualThemeBuilderPreviewV5;

rebuildActualThemeBuilderPreviewV5 =
    function(
        modal
    ) {
        rebuildActualThemeBuilderPreviewBeforeV14(
            modal
        );

        bindThemeBuilderPreviewHoverV14(
            modal
        );

        bindThemeBuilderDayBackButtonV14(
            modal
        );

        bindThemeBuilderDayCardsV12(
            modal
        );

        bindThemeBuilderPreviewTabsV10(
            modal
        );

        requestAnimationFrame(
            () =>
                fitActualThemeBuilderPreviewV9(
                    modal
                )
        );
    };



// ============================================================
// THEME BUILDER V15 — PREVIEW BACK BUTTON CLEANUP +
// KNOWLEDGE CATEGORY FOCUSED/SELECTED STYLING
// ============================================================

const CUSTOM_THEME_V15_DEFAULTS = {
    kbCategoryFocusBackgroundColor: '#171717',
    kbCategoryFocusTextColor: '#ffffff',
    kbCategoryFocusBorderColor: '#171717'
};

const getThemeBuilderDraftBeforeV15 =
    getThemeBuilderDraft;

getThemeBuilderDraft =
    function(
        modal
    ) {
        const draft = {
            ...CUSTOM_THEME_V15_DEFAULTS,
            ...getThemeBuilderDraftBeforeV15(
                modal
            )
        };

        [
            'kbCategoryFocusBackgroundColor',
            'kbCategoryFocusTextColor',
            'kbCategoryFocusBorderColor'
        ].forEach(
            key => {
                const input =
                    modal.querySelector(
                        `[data-theme-key="${key}"]`
                    );

                if (input?.value) {
                    draft[key] =
                        input.value;
                }
            }
        );

        return draft;
    };

function ensureThemeBuilderKnowledgeFocusControlsV15(
    modal,
    theme
) {
    const section =
        modal.querySelector(
            '.theme-builder-kb-category-controls-v12'
        );

    if (!section) {
        return;
    }

    const grid =
        section.querySelector(
            '.theme-builder-kb-category-color-grid-v12'
        );

    if (!grid) {
        return;
    }

    grid
        .querySelectorAll(
            '[data-theme-focus-control-v15="true"]'
        )
        .forEach(
            node =>
                node.closest(
                    '.theme-builder-field'
                )?.remove()
        );

    const merged = {
        ...CUSTOM_THEME_V15_DEFAULTS,
        ...(theme || {})
    };

    if (
        !theme?.kbCategoryFocusBackgroundColor
    ) {
        merged.kbCategoryFocusBackgroundColor =
            theme?.accent ||
            theme?.text ||
            '#171717';
    }

    if (
        !theme?.kbCategoryFocusTextColor
    ) {
        merged.kbCategoryFocusTextColor =
            getReadableTextColor(
                merged.kbCategoryFocusBackgroundColor
            );
    }

    if (
        !theme?.kbCategoryFocusBorderColor
    ) {
        merged.kbCategoryFocusBorderColor =
            theme?.border ||
            theme?.text ||
            '#171717';
    }

    const holder =
        document.createElement(
            'div'
        );

    holder.innerHTML = `
        ${themeBuilderField(
            'Selected / Focused Background',
            'kbCategoryFocusBackgroundColor',
            merged.kbCategoryFocusBackgroundColor
        )}

        ${themeBuilderField(
            'Selected / Focused Text',
            'kbCategoryFocusTextColor',
            merged.kbCategoryFocusTextColor
        )}

        ${themeBuilderField(
            'Selected / Focused Border',
            'kbCategoryFocusBorderColor',
            merged.kbCategoryFocusBorderColor
        )}
    `;

    Array.from(
        holder.children
    ).forEach(
        field => {
            field
                .querySelectorAll(
                    '[data-theme-key], [data-theme-hex]'
                )
                .forEach(
                    input => {
                        input.dataset
                            .themeFocusControlV15 =
                            'true';
                    }
                );

            grid.appendChild(
                field
            );
        }
    );

    [
        'kbCategoryFocusBackgroundColor',
        'kbCategoryFocusTextColor',
        'kbCategoryFocusBorderColor'
    ].forEach(
        key =>
            bindThemeBuilderColorFieldV12(
                modal,
                key
            )
    );
}

function applyThemeBuilderCategoryFocusVarsV15(
    target,
    theme
) {
    if (!target) {
        return;
    }

    target.style.setProperty(
        '--custom-theme-kb-category-focus-bg',
        theme.kbCategoryFocusBackgroundColor ||
            '#171717',
        'important'
    );

    target.style.setProperty(
        '--custom-theme-kb-category-focus-text',
        theme.kbCategoryFocusTextColor ||
            '#ffffff',
        'important'
    );

    target.style.setProperty(
        '--custom-theme-kb-category-focus-border',
        theme.kbCategoryFocusBorderColor ||
            '#171717',
        'important'
    );
}

function isThemeBuilderPreviewBackControlV15(
    element
) {
    return !!element?.closest?.(
        [
            '.header-back-btn',
            '.custom-tab-back-btn',
            '[data-preview-original-id="close-tools-btn"]',
            '[data-preview-original-id="close-phrases-btn"]',
            '[data-preview-original-id="close-quizzes-btn"]',
            '[data-preview-original-id*="back"]'
        ].join(',')
    );
}

function syncThemeBuilderPreviewBackControlsV15(
    modal
) {
    const canvas =
        modal.querySelector(
            '.theme-builder-live-canvas'
        );

    if (!canvas) {
        return;
    }

    const sourceId =
        canvas.dataset
            .previewSourceId ||
        modal._themeBuilderPreviewSourceId ||
        '';

    const page =
        canvas.querySelector(
            '.theme-builder-live-page'
        );

    if (!page) {
        return;
    }

    const backControls =
        page.querySelectorAll(
            [
                '.header-back-btn',
                '.custom-tab-back-btn',
                '[data-preview-original-id="close-tools-btn"]',
                '[data-preview-original-id="close-phrases-btn"]',
                '[data-preview-original-id="close-quizzes-btn"]',
                '[data-preview-original-id*="back"]'
            ].join(',')
        );

    backControls.forEach(
        control => {
            const isDailyLogBack =
                sourceId ===
                    'log-view' &&
                control.matches(
                    '.header-back-btn, [data-preview-original-id*="back"]'
                );

            control.classList.toggle(
                'theme-builder-preview-back-hidden-v15',
                !isDailyLogBack
            );

            if (
                isDailyLogBack
            ) {
                control.classList.add(
                    'theme-builder-preview-day-back-v15'
                );
            } else {
                control.classList.remove(
                    'theme-builder-preview-day-back-v15'
                );
            }
        }
    );
}

const applyThemeBuilderPreviewHoverStyleBeforeV15 =
    applyThemeBuilderPreviewHoverStyleV14;

applyThemeBuilderPreviewHoverStyleV14 =
    function(
        modal,
        element
    ) {
        if (
            isThemeBuilderPreviewBackControlV15(
                element
            )
        ) {
            return;
        }

        applyThemeBuilderPreviewHoverStyleBeforeV15(
            modal,
            element
        );
    };

const bindThemeBuilderPreviewHoverBeforeV15 =
    bindThemeBuilderPreviewHoverV14;

bindThemeBuilderPreviewHoverV14 =
    function(
        modal
    ) {
        bindThemeBuilderPreviewHoverBeforeV15(
            modal
        );

        modal
            .querySelectorAll(
                '.theme-builder-live-page .theme-builder-preview-day-back-v15'
            )
            .forEach(
                element => {
                    restoreThemeBuilderPreviewHoverStyleV14(
                        element
                    );

                    element.dataset
                        .themeBuilderHoverV14 =
                        'false';
                }
            );
    };

const applyThemeBuilderDraftToActualPreviewBeforeV15 =
    applyThemeBuilderDraftToActualPreviewV5;

applyThemeBuilderDraftToActualPreviewV5 =
    function(
        modal
    ) {
        applyThemeBuilderDraftToActualPreviewBeforeV15(
            modal
        );

        const draft =
            getThemeBuilderDraft(
                modal
            );

        const canvas =
            modal.querySelector(
                '.theme-builder-live-canvas'
            );

        applyThemeBuilderCategoryFocusVarsV15(
            canvas,
            draft
        );

        syncThemeBuilderPreviewBackControlsV15(
            modal
        );
    };

const rebuildActualThemeBuilderPreviewBeforeV15 =
    rebuildActualThemeBuilderPreviewV5;

rebuildActualThemeBuilderPreviewV5 =
    function(
        modal
    ) {
        rebuildActualThemeBuilderPreviewBeforeV15(
            modal
        );

        syncThemeBuilderPreviewBackControlsV15(
            modal
        );

        bindThemeBuilderDayBackButtonV14(
            modal
        );

        bindThemeBuilderPreviewTabsV10(
            modal
        );

        requestAnimationFrame(
            () =>
                fitActualThemeBuilderPreviewV9(
                    modal
                )
        );
    };

const populateThemeBuilderBeforeV15 =
    populateThemeBuilder;

populateThemeBuilder =
    function(
        modal,
        theme
    ) {
        const merged = {
            ...CUSTOM_THEME_V15_DEFAULTS,
            ...(theme || {})
        };

        populateThemeBuilderBeforeV15(
            modal,
            merged
        );

        ensureThemeBuilderKnowledgeFocusControlsV15(
            modal,
            merged
        );

        installThemeBuilderSectionTabsV11(
            modal
        );

        updateThemeBuilderPreview(
            modal
        );
    };

const applyCustomBuiltThemeBeforeV15 =
    applyCustomBuiltTheme;

applyCustomBuiltTheme =
    function(
        theme =
            getCustomThemeSettings()
    ) {
        const merged = {
            ...CUSTOM_THEME_V15_DEFAULTS,
            ...(theme || {})
        };

        if (
            !theme?.kbCategoryFocusBackgroundColor
        ) {
            merged.kbCategoryFocusBackgroundColor =
                merged.accent ||
                merged.text ||
                '#171717';
        }

        if (
            !theme?.kbCategoryFocusTextColor
        ) {
            merged.kbCategoryFocusTextColor =
                getReadableTextColor(
                    merged.kbCategoryFocusBackgroundColor
                );
        }

        if (
            !theme?.kbCategoryFocusBorderColor
        ) {
            merged.kbCategoryFocusBorderColor =
                merged.border ||
                merged.text ||
                '#171717';
        }

        applyCustomBuiltThemeBeforeV15(
            merged
        );

        applyThemeBuilderCategoryFocusVarsV15(
            document.documentElement,
            merged
        );
    };

const clearCustomBuiltThemeBeforeV15 =
    clearCustomBuiltTheme;

clearCustomBuiltTheme =
    function() {
        clearCustomBuiltThemeBeforeV15();

        [
            '--custom-theme-kb-category-focus-bg',
            '--custom-theme-kb-category-focus-text',
            '--custom-theme-kb-category-focus-border'
        ].forEach(
            name =>
                document.documentElement
                    .style
                    .removeProperty(
                        name
                    )
        );
    };



// ============================================================
// THEME BUILDER V16 — PREVIEW-ONLY KNOWLEDGE CATEGORY FOCUS FIX
// The real theme already applies these colors correctly.
// This layer makes the cloned live preview reflect them exactly.
// ============================================================

function saveThemeBuilderCategoryPreviewStyleV16(
    element
) {
    if (
        !element ||
        element._themeBuilderCategoryPreviewStyleV16
    ) {
        return;
    }

    const saved = {};

    [
        'background',
        'background-color',
        'background-image',
        'color',
        '-webkit-text-fill-color',
        'border-color',
        'box-shadow'
    ].forEach(
        property => {
            saved[property] = {
                value:
                    element.style.getPropertyValue(
                        property
                    ),
                priority:
                    element.style.getPropertyPriority(
                        property
                    )
            };
        }
    );

    element._themeBuilderCategoryPreviewStyleV16 =
        saved;
}

function restoreThemeBuilderCategoryPreviewStyleV16(
    element
) {
    const saved =
        element?._themeBuilderCategoryPreviewStyleV16;

    if (!saved) {
        return;
    }

    Object.entries(
        saved
    ).forEach(
        (
            [
                property,
                state
            ]
        ) => {
            if (
                state?.value
            ) {
                element.style.setProperty(
                    property,
                    state.value,
                    state.priority ||
                    ''
                );
            } else {
                element.style.removeProperty(
                    property
                );
            }
        }
    );

    element._themeBuilderCategoryPreviewStyleV16 =
        null;
}

function applyThemeBuilderCategoryFocusPreviewV16(
    modal,
    element
) {
    if (
        !modal ||
        !element
    ) {
        return;
    }

    saveThemeBuilderCategoryPreviewStyleV16(
        element
    );

    const draft =
        getThemeBuilderDraft(
            modal
        );

    const background =
        draft.kbCategoryFocusBackgroundColor ||
        '#171717';

    const text =
        draft.kbCategoryFocusTextColor ||
        '#ffffff';

    const border =
        draft.kbCategoryFocusBorderColor ||
        '#171717';

    element.style.setProperty(
        'background',
        background,
        'important'
    );

    element.style.setProperty(
        'background-color',
        background,
        'important'
    );

    element.style.setProperty(
        'background-image',
        'none',
        'important'
    );

    element.style.setProperty(
        'color',
        text,
        'important'
    );

    element.style.setProperty(
        '-webkit-text-fill-color',
        text,
        'important'
    );

    element.style.setProperty(
        'border-color',
        border,
        'important'
    );

    element.style.setProperty(
        'box-shadow',
        `inset 0 -3px 0 ${border}`,
        'important'
    );

    element
        .querySelectorAll(
            'i, svg, span'
        )
        .forEach(
            child => {
                child.style.setProperty(
                    'color',
                    'inherit',
                    'important'
                );

                child.style.setProperty(
                    'stroke',
                    'currentColor',
                    'important'
                );
            }
        );
}

function isThemeBuilderPreviewCategorySelectedV16(
    element
) {
    return (
        element.classList.contains(
            'active'
        ) ||
        element.getAttribute(
            'aria-selected'
        ) ===
            'true' ||
        element.dataset
            .themeBuilderPreviewCategorySelectedV16 ===
            'true'
    );
}

function syncThemeBuilderKnowledgeCategoryPreviewV16(
    modal
) {
    const page =
        modal.querySelector(
            '.theme-builder-live-page'
        );

    if (!page) {
        return;
    }

    const categories =
        page.querySelectorAll(
            [
                '#library-filter-tabs .filter-tab',
                '.kb-category-grid-item'
            ].join(',')
        );

    categories.forEach(
        element => {
            if (
                isThemeBuilderPreviewCategorySelectedV16(
                    element
                )
            ) {
                applyThemeBuilderCategoryFocusPreviewV16(
                    modal,
                    element
                );
            } else {
                restoreThemeBuilderCategoryPreviewStyleV16(
                    element
                );
            }

            if (
                element.dataset
                    .themeBuilderCategoryFocusV16 ===
                'true'
            ) {
                return;
            }

            element.dataset
                .themeBuilderCategoryFocusV16 =
                'true';

            // Make the preview itself useful: clicking a category shows
            // exactly how that selected/focused state will look.
            element.addEventListener(
                'click',
                event => {
                    event.preventDefault();
                    event.stopPropagation();

                    categories.forEach(
                        other => {
                            other.dataset
                                .themeBuilderPreviewCategorySelectedV16 =
                                'false';

                            other.classList.remove(
                                'active'
                            );

                            other.setAttribute(
                                'aria-selected',
                                'false'
                            );

                            restoreThemeBuilderCategoryPreviewStyleV16(
                                other
                            );
                        }
                    );

                    element.dataset
                        .themeBuilderPreviewCategorySelectedV16 =
                        'true';

                    element.classList.add(
                        'active'
                    );

                    element.setAttribute(
                        'aria-selected',
                        'true'
                    );

                    applyThemeBuilderCategoryFocusPreviewV16(
                        modal,
                        element
                    );
                }
            );

            element.addEventListener(
                'focus',
                () => {
                    applyThemeBuilderCategoryFocusPreviewV16(
                        modal,
                        element
                    );
                }
            );

            element.addEventListener(
                'blur',
                () => {
                    if (
                        !isThemeBuilderPreviewCategorySelectedV16(
                            element
                        )
                    ) {
                        restoreThemeBuilderCategoryPreviewStyleV16(
                            element
                        );
                    }
                }
            );
        }
    );
}

function refreshThemeBuilderKnowledgeCategoryPreviewV16(
    modal
) {
    const page =
        modal.querySelector(
            '.theme-builder-live-page'
        );

    if (!page) {
        return;
    }

    page
        .querySelectorAll(
            [
                '#library-filter-tabs .filter-tab',
                '.kb-category-grid-item'
            ].join(',')
        )
        .forEach(
            element => {
                if (
                    isThemeBuilderPreviewCategorySelectedV16(
                        element
                    ) ||
                    element ===
                        document.activeElement
                ) {
                    restoreThemeBuilderCategoryPreviewStyleV16(
                        element
                    );

                    applyThemeBuilderCategoryFocusPreviewV16(
                        modal,
                        element
                    );
                }
            }
        );
}

const applyThemeBuilderDraftToActualPreviewBeforeV16 =
    applyThemeBuilderDraftToActualPreviewV5;

applyThemeBuilderDraftToActualPreviewV5 =
    function(
        modal
    ) {
        applyThemeBuilderDraftToActualPreviewBeforeV16(
            modal
        );

        syncThemeBuilderKnowledgeCategoryPreviewV16(
            modal
        );

        refreshThemeBuilderKnowledgeCategoryPreviewV16(
            modal
        );
    };

const rebuildActualThemeBuilderPreviewBeforeV16 =
    rebuildActualThemeBuilderPreviewV5;

rebuildActualThemeBuilderPreviewV5 =
    function(
        modal
    ) {
        rebuildActualThemeBuilderPreviewBeforeV16(
            modal
        );

        syncThemeBuilderKnowledgeCategoryPreviewV16(
            modal
        );

        requestAnimationFrame(
            () => {
                refreshThemeBuilderKnowledgeCategoryPreviewV16(
                    modal
                );

                fitActualThemeBuilderPreviewV9(
                    modal
                );
            }
        );
    };



// ============================================================
// THEME BUILDER V17 — KNOWLEDGE CATEGORY PREVIEW FIX
// IMPORTANT: cloned preview IDs are removed by stripThemeBuilderCloneIdsV5.
// The original #library-filter-tabs becomes
// [data-preview-original-id="library-filter-tabs"].
// This preview layer therefore styles the CLONED controls directly.
// ============================================================

function getThemeBuilderPreviewCategoriesV17(
    modal
) {
    const page =
        modal?.querySelector(
            '.theme-builder-live-page'
        );

    if (!page) {
        return [];
    }

    return Array.from(
        page.querySelectorAll(
            [
                '[data-preview-original-id="library-filter-tabs"] .filter-tab',
                '.kb-category-grid-item'
            ].join(',')
        )
    );
}

function isThemeBuilderPreviewCategorySelectedV17(
    element
) {
    return (
        element.classList.contains(
            'active'
        ) ||
        element.getAttribute(
            'aria-selected'
        ) ===
            'true' ||
        element.dataset
            .themeBuilderPreviewCategorySelectedV16 ===
            'true' ||
        element.dataset
            .themeBuilderPreviewCategorySelectedV17 ===
            'true'
    );
}

function applyThemeBuilderPreviewCategoryStateV17(
    modal,
    element,
    forcedState = ''
) {
    if (
        !modal ||
        !element
    ) {
        return;
    }

    const draft =
        getThemeBuilderDraft(
            modal
        );

    const selected =
        forcedState ===
            'selected' ||
        (
            !forcedState &&
            isThemeBuilderPreviewCategorySelectedV17(
                element
            )
        );

    const hovered =
        !selected &&
        (
            forcedState ===
                'hover' ||
            (
                !forcedState &&
                element.matches(
                    ':hover'
                )
            )
        );

    let background;
    let text;
    let border;
    let shadow;

    if (selected) {
        background =
            draft.kbCategoryFocusBackgroundColor ||
            draft.kbCategoryBackgroundColor ||
            '#171717';

        text =
            draft.kbCategoryFocusTextColor ||
            draft.kbCategoryTextColor ||
            '#ffffff';

        border =
            draft.kbCategoryFocusBorderColor ||
            draft.border ||
            '#171717';

        shadow =
            `inset 0 -3px 0 ${border}`;
    } else if (hovered) {
        background =
            draft.kbCategoryHoverBackgroundColor ||
            draft.hoverColor ||
            draft.kbCategoryBackgroundColor ||
            '#d9d2ff';

        text =
            draft.kbCategoryHoverTextColor ||
            draft.kbCategoryTextColor ||
            draft.text ||
            '#171717';

        border =
            draft.border ||
            'transparent';

        shadow =
            'none';
    } else {
        background =
            draft.kbCategoryBackgroundColor ||
            draft.surface ||
            '#ffffff';

        text =
            draft.kbCategoryTextColor ||
            draft.text ||
            '#171717';

        border =
            draft.border ||
            'transparent';

        shadow =
            'none';
    }

    [
        ['background', background],
        ['background-color', background],
        ['background-image', 'none'],
        ['color', text],
        ['-webkit-text-fill-color', text],
        ['border-color', border],
        ['box-shadow', shadow]
    ].forEach(
        (
            [
                property,
                value
            ]
        ) => {
            element.style.setProperty(
                property,
                value,
                'important'
            );
        }
    );

    element
        .querySelectorAll(
            'span, strong, small, i, svg'
        )
        .forEach(
            child => {
                child.style.setProperty(
                    'color',
                    'inherit',
                    'important'
                );

                child.style.setProperty(
                    '-webkit-text-fill-color',
                    'currentColor',
                    'important'
                );

                if (
                    child.matches(
                        'i, svg'
                    )
                ) {
                    child.style.setProperty(
                        'stroke',
                        'currentColor',
                        'important'
                    );
                }
            }
        );
}

function refreshThemeBuilderPreviewCategoriesV17(
    modal
) {
    getThemeBuilderPreviewCategoriesV17(
        modal
    ).forEach(
        element =>
            applyThemeBuilderPreviewCategoryStateV17(
                modal,
                element
            )
    );
}

function bindThemeBuilderPreviewCategoriesV17(
    modal
) {
    const categories =
        getThemeBuilderPreviewCategoriesV17(
            modal
        );

    categories.forEach(
        element => {
            if (
                element.dataset
                    .themeBuilderCategoryV17Bound ===
                'true'
            ) {
                applyThemeBuilderPreviewCategoryStateV17(
                    modal,
                    element
                );

                return;
            }

            element.dataset
                .themeBuilderCategoryV17Bound =
                'true';

            element.addEventListener(
                'pointerenter',
                () => {
                    if (
                        isThemeBuilderPreviewCategorySelectedV17(
                            element
                        )
                    ) {
                        applyThemeBuilderPreviewCategoryStateV17(
                            modal,
                            element,
                            'selected'
                        );
                    } else {
                        applyThemeBuilderPreviewCategoryStateV17(
                            modal,
                            element,
                            'hover'
                        );
                    }
                }
            );

            element.addEventListener(
                'pointerleave',
                () => {
                    applyThemeBuilderPreviewCategoryStateV17(
                        modal,
                        element
                    );
                }
            );

            element.addEventListener(
                'focus',
                () => {
                    applyThemeBuilderPreviewCategoryStateV17(
                        modal,
                        element,
                        'selected'
                    );
                }
            );

            element.addEventListener(
                'blur',
                () => {
                    applyThemeBuilderPreviewCategoryStateV17(
                        modal,
                        element
                    );
                }
            );

            element.addEventListener(
                'click',
                event => {
                    event.preventDefault();
                    event.stopPropagation();

                    categories.forEach(
                        other => {
                            other.dataset
                                .themeBuilderPreviewCategorySelectedV17 =
                                'false';

                            other.dataset
                                .themeBuilderPreviewCategorySelectedV16 =
                                'false';

                            other.classList.remove(
                                'active'
                            );

                            other.setAttribute(
                                'aria-selected',
                                'false'
                            );

                            applyThemeBuilderPreviewCategoryStateV17(
                                modal,
                                other,
                                'normal'
                            );
                        }
                    );

                    element.dataset
                        .themeBuilderPreviewCategorySelectedV17 =
                        'true';

                    element.classList.add(
                        'active'
                    );

                    element.setAttribute(
                        'aria-selected',
                        'true'
                    );

                    applyThemeBuilderPreviewCategoryStateV17(
                        modal,
                        element,
                        'selected'
                    );
                }
            );

            applyThemeBuilderPreviewCategoryStateV17(
                modal,
                element
            );
        }
    );
}

const applyThemeBuilderDraftToActualPreviewBeforeV17 =
    applyThemeBuilderDraftToActualPreviewV5;

applyThemeBuilderDraftToActualPreviewV5 =
    function(
        modal
    ) {
        applyThemeBuilderDraftToActualPreviewBeforeV17(
            modal
        );

        bindThemeBuilderPreviewCategoriesV17(
            modal
        );

        refreshThemeBuilderPreviewCategoriesV17(
            modal
        );
    };

const rebuildActualThemeBuilderPreviewBeforeV17 =
    rebuildActualThemeBuilderPreviewV5;

rebuildActualThemeBuilderPreviewV5 =
    function(
        modal
    ) {
        rebuildActualThemeBuilderPreviewBeforeV17(
            modal
        );

        bindThemeBuilderPreviewCategoriesV17(
            modal
        );

        requestAnimationFrame(
            () => {
                refreshThemeBuilderPreviewCategoriesV17(
                    modal
                );

                fitActualThemeBuilderPreviewV9(
                    modal
                );
            }
        );
    };



// ============================================================
// THEME BUILDER V18 — GLOBAL CATEGORY NAV STYLING
// Category controls are a shared component. These settings now
// apply to every .filter-tab category navbar, including Quizzes,
// Knowledge Base, and future pages using the same component.
// ============================================================

function getThemeBuilderPreviewCategoriesV18(
    modal
) {
    const page =
        modal?.querySelector(
            '.theme-builder-live-page'
        );

    if (!page) {
        return [];
    }

    return Array.from(
        page.querySelectorAll(
            [
                '.filter-tab',
                '.kb-category-grid-item'
            ].join(',')
        )
    );
}

function applyThemeBuilderPreviewCategoryStateV18(
    modal,
    element,
    forcedState = ''
) {
    if (
        !modal ||
        !element
    ) {
        return;
    }

    const draft =
        getThemeBuilderDraft(
            modal
        );

    const selected =
        forcedState ===
            'selected' ||
        (
            !forcedState &&
            (
                element.classList.contains(
                    'active'
                ) ||
                element.getAttribute(
                    'aria-selected'
                ) ===
                    'true' ||
                element.dataset
                    .themeBuilderPreviewCategorySelectedV18 ===
                    'true'
            )
        );

    const hovered =
        !selected &&
        (
            forcedState ===
                'hover' ||
            (
                !forcedState &&
                element.matches(
                    ':hover'
                )
            )
        );

    let background;
    let text;
    let border;
    let shadow =
        'none';

    if (selected) {
        background =
            draft.kbCategoryFocusBackgroundColor ||
            draft.kbCategoryBackgroundColor ||
            '#171717';

        text =
            draft.kbCategoryFocusTextColor ||
            draft.kbCategoryTextColor ||
            '#ffffff';

        border =
            draft.kbCategoryFocusBorderColor ||
            draft.border ||
            '#171717';

        shadow =
            `inset 0 -3px 0 ${border}`;
    } else if (hovered) {
        background =
            draft.kbCategoryHoverBackgroundColor ||
            draft.hoverColor ||
            draft.kbCategoryBackgroundColor ||
            '#d9d2ff';

        text =
            draft.kbCategoryHoverTextColor ||
            draft.kbCategoryTextColor ||
            draft.text ||
            '#171717';

        border =
            draft.border ||
            'transparent';
    } else {
        background =
            draft.kbCategoryBackgroundColor ||
            draft.surface ||
            '#ffffff';

        text =
            draft.kbCategoryTextColor ||
            draft.text ||
            '#171717';

        border =
            draft.border ||
            'transparent';
    }

    [
        ['background', background],
        ['background-color', background],
        ['background-image', 'none'],
        ['color', text],
        ['-webkit-text-fill-color', text],
        ['border-color', border],
        ['box-shadow', shadow]
    ].forEach(
        (
            [
                property,
                value
            ]
        ) => {
            element.style.setProperty(
                property,
                value,
                'important'
            );
        }
    );

    element
        .querySelectorAll(
            'span, strong, small, i, svg'
        )
        .forEach(
            child => {
                child.style.setProperty(
                    'color',
                    'inherit',
                    'important'
                );

                child.style.setProperty(
                    '-webkit-text-fill-color',
                    'currentColor',
                    'important'
                );

                if (
                    child.matches(
                        'i, svg'
                    )
                ) {
                    child.style.setProperty(
                        'stroke',
                        'currentColor',
                        'important'
                    );
                }
            }
        );
}

function bindThemeBuilderPreviewCategoriesV18(
    modal
) {
    const categories =
        getThemeBuilderPreviewCategoriesV18(
            modal
        );

    categories.forEach(
        element => {
            if (
                element.dataset
                    .themeBuilderCategoryV18Bound !==
                'true'
            ) {
                element.dataset
                    .themeBuilderCategoryV18Bound =
                    'true';

                element.addEventListener(
                    'pointerenter',
                    () => {
                        const selected =
                            element.classList.contains(
                                'active'
                            ) ||
                            element.getAttribute(
                                'aria-selected'
                            ) ===
                                'true' ||
                            element.dataset
                                .themeBuilderPreviewCategorySelectedV18 ===
                                'true';

                        applyThemeBuilderPreviewCategoryStateV18(
                            modal,
                            element,
                            selected
                                ? 'selected'
                                : 'hover'
                        );
                    }
                );

                element.addEventListener(
                    'pointerleave',
                    () =>
                        applyThemeBuilderPreviewCategoryStateV18(
                            modal,
                            element
                        )
                );

                element.addEventListener(
                    'focus',
                    () =>
                        applyThemeBuilderPreviewCategoryStateV18(
                            modal,
                            element,
                            'selected'
                        )
                );

                element.addEventListener(
                    'blur',
                    () =>
                        applyThemeBuilderPreviewCategoryStateV18(
                            modal,
                            element
                        )
                );

                element.addEventListener(
                    'click',
                    event => {
                        event.preventDefault();
                        event.stopPropagation();

                        categories.forEach(
                            other => {
                                other.dataset
                                    .themeBuilderPreviewCategorySelectedV18 =
                                    'false';

                                other.classList.remove(
                                    'active'
                                );

                                other.setAttribute(
                                    'aria-selected',
                                    'false'
                                );

                                applyThemeBuilderPreviewCategoryStateV18(
                                    modal,
                                    other,
                                    'normal'
                                );
                            }
                        );

                        element.dataset
                            .themeBuilderPreviewCategorySelectedV18 =
                            'true';

                        element.classList.add(
                            'active'
                        );

                        element.setAttribute(
                            'aria-selected',
                            'true'
                        );

                        applyThemeBuilderPreviewCategoryStateV18(
                            modal,
                            element,
                            'selected'
                        );
                    }
                );
            }

            applyThemeBuilderPreviewCategoryStateV18(
                modal,
                element
            );
        }
    );
}

function refreshThemeBuilderPreviewCategoriesV18(
    modal
) {
    getThemeBuilderPreviewCategoriesV18(
        modal
    ).forEach(
        element =>
            applyThemeBuilderPreviewCategoryStateV18(
                modal,
                element
            )
    );
}

const applyThemeBuilderDraftToActualPreviewBeforeV18 =
    applyThemeBuilderDraftToActualPreviewV5;

applyThemeBuilderDraftToActualPreviewV5 =
    function(
        modal
    ) {
        applyThemeBuilderDraftToActualPreviewBeforeV18(
            modal
        );

        bindThemeBuilderPreviewCategoriesV18(
            modal
        );

        refreshThemeBuilderPreviewCategoriesV18(
            modal
        );
    };

const rebuildActualThemeBuilderPreviewBeforeV18 =
    rebuildActualThemeBuilderPreviewV5;

rebuildActualThemeBuilderPreviewV5 =
    function(
        modal
    ) {
        rebuildActualThemeBuilderPreviewBeforeV18(
            modal
        );

        bindThemeBuilderPreviewCategoriesV18(
            modal
        );

        requestAnimationFrame(
            () => {
                refreshThemeBuilderPreviewCategoriesV18(
                    modal
                );

                fitActualThemeBuilderPreviewV9(
                    modal
                );
            }
        );
    };

// Rename the builder section so it is clear these controls are shared
// by Knowledge Base, Quizzes, and any other category navbar component.
const populateThemeBuilderBeforeCategoryHeadingV18 =
    populateThemeBuilder;

populateThemeBuilder =
    function(
        modal,
        theme
    ) {
        populateThemeBuilderBeforeCategoryHeadingV18(
            modal,
            theme
        );

        const heading =
            modal.querySelector(
                '.theme-builder-kb-category-controls-v12 .theme-builder-control-heading strong'
            );

        if (heading) {
            heading.textContent =
                'Category Navigation';
        }

        updateThemeBuilderPreview(
            modal
        );
    };



// ============================================================
// THEME BUILDER V19 — SHAPE/TYPE PREVIEW, CURRENT THEME REOPEN,
// PADDED BACKDROPS, GLOBAL SVG SIZE, CLEANER SVG CONTROLS,
// ORGANIC SVG MOTION, POLAROID FULLSCREEN
// ============================================================

const CUSTOM_THEME_V19_DEFAULTS = {
    svgGlobalScale: 100
};

function getThemeSvgScaleV19(
    value
) {
    return Math.max(
        50,
        Math.min(
            220,
            Number(value) || 100
        )
    );
}

const getThemeBuilderDraftBeforeV19 =
    getThemeBuilderDraft;

getThemeBuilderDraft =
    function(
        modal
    ) {
        const draft = {
            ...CUSTOM_THEME_V19_DEFAULTS,
            ...getThemeBuilderDraftBeforeV19(
                modal
            )
        };

        draft.svgGlobalScale =
            getThemeSvgScaleV19(
                modal?._themeSvgGlobalScaleV19 ??
                draft.svgGlobalScale
            );

        if (
            [
                'lanes',
                'columns'
            ].includes(
                draft.svgDistribution
            )
        ) {
            draft.svgDistribution =
                'random';
        }

        return draft;
    };

function syncThemeBuilderShapeTypePreviewV19(
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

    const radius =
        Math.max(
            0,
            Math.min(
                30,
                Number(
                    draft.radius
                ) ||
                0
            )
        );

    const shadow =
        Math.max(
            0,
            Math.min(
                12,
                Number(
                    draft.shadow
                ) ||
                0
            )
        );

    const font =
        CUSTOM_THEME_FONT_STACKS[
            draft.font
        ] ||
        CUSTOM_THEME_FONT_STACKS.hand;

    canvas.style.setProperty(
        '--border-radius',
        `${radius}px`,
        'important'
    );

    canvas.style.setProperty(
        '--custom-theme-shadow',
        `${shadow}px ${shadow}px 0 ${draft.border}`,
        'important'
    );

    canvas.style.setProperty(
        '--custom-theme-font',
        font,
        'important'
    );

    page.style.setProperty(
        'font-family',
        font,
        'important'
    );

    const radiusTargets =
        page.querySelectorAll(
            [
                '.icon-btn',
                '.small-icon-btn',
                '.day-box',
                '.filter-tab',
                '.phrase-card',
                '.polaroid-card',
                '.custom-user-card',
                '.custom-user-polaroid',
                '.weekly-review-section',
                '.daily-collection-card',
                '.kb-field-summary-card',
                '.kb-category-grid-item',
                '.resource-card',
                '.toolbox-item',
                '.chip',
                'input',
                'textarea',
                'select'
            ].join(',')
        );

    radiusTargets.forEach(
        element => {
            element.style.setProperty(
                'border-radius',
                `${radius}px`,
                'important'
            );
        }
    );

    const shadowTargets =
        page.querySelectorAll(
            [
                '.icon-btn',
                '.small-icon-btn',
                '.day-box',
                '.filter-tab',
                '.phrase-card',
                '.polaroid-card',
                '.custom-user-card',
                '.custom-user-polaroid',
                '.weekly-review-section',
                '.daily-collection-card',
                '.kb-field-summary-card',
                '.kb-category-grid-item',
                '.resource-card',
                '.toolbox-item'
            ].join(',')
        );

    shadowTargets.forEach(
        element => {
            element.style.setProperty(
                'box-shadow',
                `${shadow}px ${shadow}px 0 ${draft.border}`,
                'important'
            );
        }
    );

    page
        .querySelectorAll(
            [
                'button',
                'input',
                'textarea',
                'select',
                'h1',
                'h2',
                'h3',
                'h4',
                'p',
                'span',
                'label',
                'strong',
                'small'
            ].join(',')
        )
        .forEach(
            element => {
                element.style.setProperty(
                    'font-family',
                    font,
                    'important'
                );
            }
        );

    modal
        .querySelectorAll(
            '[data-theme-output]'
        )
        .forEach(
            output => {
                const key =
                    output.dataset
                        .themeOutput;

                if (
                    key ===
                    'radius'
                ) {
                    output.textContent =
                        String(radius);
                } else if (
                    key ===
                    'shadow'
                ) {
                    output.textContent =
                        String(shadow);
                }
            }
        );
}

function bindThemeBuilderShapeTypeControlsV19(
    modal
) {
    [
        'radius',
        'shadow',
        'font'
    ].forEach(
        key => {
            const input =
                modal.querySelector(
                    `[data-theme-key="${key}"]`
                );

            if (
                !input ||
                input.dataset
                    .themeShapeV19Bound ===
                    'true'
            ) {
                return;
            }

            input.dataset
                .themeShapeV19Bound =
                'true';

            const eventName =
                input.tagName ===
                'SELECT'
                    ? 'change'
                    : 'input';

            input.addEventListener(
                eventName,
                () => {
                    updateThemeBuilderPreview(
                        modal
                    );

                    syncThemeBuilderShapeTypePreviewV19(
                        modal
                    );
                }
            );
        }
    );
}

function syncThemeBuilderBackdropPaddingV19(
    target,
    draft
) {
    if (!target) {
        return;
    }

    target.style.setProperty(
        '--custom-theme-daily-backdrop-padding',
        draft.dailyLogBackgroundEnabled
            ? '18px'
            : '0px',
        'important'
    );

    target.style.setProperty(
        '--custom-theme-content-backdrop-padding',
        draft.contentBackdropEnabled
            ? '18px'
            : '0px',
        'important'
    );
}

function syncThemeBuilderSvgScaleV19(
    target,
    theme
) {
    if (!target) {
        return;
    }

    target.style.setProperty(
        '--theme-svg-global-scale',
        String(
            getThemeSvgScaleV19(
                theme.svgGlobalScale
            ) /
            100
        ),
        'important'
    );
}

function setThemeBuilderSvgScaleV19(
    modal,
    value
) {
    modal._themeSvgGlobalScaleV19 =
        getThemeSvgScaleV19(
            value
        );

    const output =
        modal.querySelector(
            '.theme-builder-svg-size-value-v19'
        );

    if (output) {
        output.textContent =
            `${modal._themeSvgGlobalScaleV19}%`;
    }

    updateThemeBuilderPreview(
        modal
    );
}

function polishThemeBuilderAnimationOptionsV19(
    modal
) {
    const labels = {
        float:
            'Gentle Float',
        drift:
            'Loose Wander',
        bob:
            'Soft Bounce',
        pulse:
            'Breathe',
        spin:
            'Slow Twirl',
        still:
            'Still'
    };

    modal
        .querySelectorAll(
            [
                '.theme-builder-svg-default-animation',
                '.theme-builder-svg-animation-select'
            ].join(',')
        )
        .forEach(
            select => {
                Array.from(
                    select.options
                ).forEach(
                    option => {
                        if (
                            [
                                'travel',
                                'fall'
                            ].includes(
                                option.value
                            )
                        ) {
                            option.remove();
                            return;
                        }

                        if (
                            labels[
                                option.value
                            ]
                        ) {
                            option.textContent =
                                labels[
                                    option.value
                                ];
                        }
                    }
                );

                if (
                    [
                        'travel',
                        'fall'
                    ].includes(
                        select.value
                    )
                ) {
                    select.value =
                        'float';
                }
            }
        );
}

function ensureThemeBuilderSvgUiV19(
    modal,
    theme
) {
    const globalControls =
        modal.querySelector(
            '.theme-builder-global-svg-controls-v11'
        );

    if (
        globalControls
    ) {
        globalControls
            .querySelector(
                '.theme-builder-svg-scene-preset'
            )
            ?.closest(
                '.theme-builder-field'
            )
            ?.remove();

        let sizeRow =
            globalControls.querySelector(
                '.theme-builder-svg-size-v19'
            );

        if (!sizeRow) {
            sizeRow =
                document.createElement(
                    'div'
                );

            sizeRow.className =
                'theme-builder-svg-size-v19';

            sizeRow.innerHTML = `
                <span>Size</span>

                <div class="theme-builder-svg-size-actions-v19">
                    <button
                        type="button"
                        class="small-icon-btn theme-builder-svg-size-minus-v19"
                        title="Make all SVGs smaller"
                        aria-label="Make all SVGs smaller"
                    >
                        <i class="ph ph-minus"></i>
                    </button>

                    <strong class="theme-builder-svg-size-value-v19">
                        100%
                    </strong>

                    <button
                        type="button"
                        class="small-icon-btn theme-builder-svg-size-plus-v19"
                        title="Make all SVGs bigger"
                        aria-label="Make all SVGs bigger"
                    >
                        <i class="ph ph-plus"></i>
                    </button>
                </div>
            `;

            globalControls.appendChild(
                sizeRow
            );
        }

        modal._themeSvgGlobalScaleV19 =
            getThemeSvgScaleV19(
                theme?.svgGlobalScale ??
                modal._themeSvgGlobalScaleV19 ??
                100
            );

        sizeRow
            .querySelector(
                '.theme-builder-svg-size-value-v19'
            ).textContent =
            `${modal._themeSvgGlobalScaleV19}%`;

        sizeRow
            .querySelector(
                '.theme-builder-svg-size-minus-v19'
            ).onclick =
            () =>
                setThemeBuilderSvgScaleV19(
                    modal,
                    modal._themeSvgGlobalScaleV19 -
                    10
                );

        sizeRow
            .querySelector(
                '.theme-builder-svg-size-plus-v19'
            ).onclick =
            () =>
                setThemeBuilderSvgScaleV19(
                    modal,
                    modal._themeSvgGlobalScaleV19 +
                    10
                );
    }

    const distribution =
        modal.querySelector(
            '.theme-builder-svg-distribution'
        );

    if (distribution) {
        const field =
            distribution.closest(
                '.theme-builder-field'
            );

        const label =
            field?.querySelector(
                ':scope > span'
            );

        if (label) {
            label.textContent =
                'Placement';
        }

        const current =
            [
                'random',
                'side-fixed',
                'side-random'
            ].includes(
                theme?.svgDistribution
            )
                ? theme.svgDistribution
                : (
                    [
                        'random',
                        'side-fixed',
                        'side-random'
                    ].includes(
                        distribution.value
                    )
                        ? distribution.value
                        : 'random'
                );

        distribution.innerHTML = `
            <option value="random">
                Organic scatter
            </option>
            <option value="side-fixed">
                Loose edge scatter
            </option>
            <option value="side-random">
                Loose edge reshuffle
            </option>
        `;

        distribution.value =
            current;
    }

    polishThemeBuilderAnimationOptionsV19(
        modal
    );
}

const renderThemeBuilderSvgListBeforeV19 =
    renderThemeBuilderSvgListV2;

renderThemeBuilderSvgListV2 =
    function(
        modal
    ) {
        renderThemeBuilderSvgListBeforeV19(
            modal
        );

        polishThemeBuilderAnimationOptionsV19(
            modal
        );
    };

function organicEdgeSlotsV19() {
    return [
        [5, 13],
        [7, 31],
        [4, 58],
        [8, 81],
        [95, 18],
        [92, 39],
        [96, 66],
        [91, 86],
        [19, 5],
        [43, 7],
        [68, 4],
        [84, 8],
        [15, 94],
        [37, 91],
        [63, 96],
        [82, 92]
    ];
}

const getPreviewSvgAssignmentsBeforeV19 =
    getPreviewSvgAssignmentsV10;

getPreviewSvgAssignmentsV10 =
    function(
        modal,
        draft
    ) {
        const base =
            getPreviewSvgAssignmentsBeforeV19(
                modal,
                draft
            );

        if (
            [
                'side-fixed',
                'side-random'
            ].includes(
                draft.svgDistribution
            )
        ) {
            const slots =
                organicEdgeSlotsV19();

            return base.map(
                (
                    entry,
                    index
                ) => ({
                    ...entry,
                    left:
                        slots[
                            index %
                            slots.length
                        ][0],
                    top:
                        slots[
                            index %
                            slots.length
                        ][1]
                })
            );
        }

        return base;
    };

const getRuntimeSvgAssignmentsBeforeV19 =
    getRuntimeSvgAssignmentsV10;

getRuntimeSvgAssignmentsV10 =
    function(
        theme
    ) {
        const base =
            getRuntimeSvgAssignmentsBeforeV19(
                theme
            );

        if (
            [
                'side-fixed',
                'side-random'
            ].includes(
                theme.svgDistribution
            )
        ) {
            const slots =
                organicEdgeSlotsV19();

            return base.map(
                (
                    entry,
                    index
                ) => ({
                    ...entry,
                    left:
                        slots[
                            index %
                            slots.length
                        ][0],
                    top:
                        slots[
                            index %
                            slots.length
                        ][1]
                })
            );
        }

        return base;
    };

const populateThemeBuilderBeforeV19 =
    populateThemeBuilder;

populateThemeBuilder =
    function(
        modal,
        theme
    ) {
        const merged = {
            ...CUSTOM_THEME_V19_DEFAULTS,
            ...(theme || {})
        };

        populateThemeBuilderBeforeV19(
            modal,
            merged
        );

        bindThemeBuilderShapeTypeControlsV19(
            modal
        );

        ensureThemeBuilderSvgUiV19(
            modal,
            merged
        );

        syncThemeBuilderShapeTypePreviewV19(
            modal
        );

        updateThemeBuilderPreview(
            modal
        );
    };

const applyThemeBuilderDraftToActualPreviewBeforeV19 =
    applyThemeBuilderDraftToActualPreviewV5;

applyThemeBuilderDraftToActualPreviewV5 =
    function(
        modal
    ) {
        applyThemeBuilderDraftToActualPreviewBeforeV19(
            modal
        );

        const draft =
            getThemeBuilderDraft(
                modal
            );

        const canvas =
            modal.querySelector(
                '.theme-builder-live-canvas'
            );

        syncThemeBuilderBackdropPaddingV19(
            canvas,
            draft
        );

        syncThemeBuilderSvgScaleV19(
            canvas,
            draft
        );

        syncThemeBuilderShapeTypePreviewV19(
            modal
        );
    };

const rebuildActualThemeBuilderPreviewBeforeV19 =
    rebuildActualThemeBuilderPreviewV5;

rebuildActualThemeBuilderPreviewV5 =
    function(
        modal
    ) {
        rebuildActualThemeBuilderPreviewBeforeV19(
            modal
        );

        syncThemeBuilderShapeTypePreviewV19(
            modal
        );

        requestAnimationFrame(
            () =>
                fitActualThemeBuilderPreviewV9(
                    modal
                )
        );
    };

const applyCustomBuiltThemeBeforeV19 =
    applyCustomBuiltTheme;

applyCustomBuiltTheme =
    function(
        theme =
            getCustomThemeSettings()
    ) {
        const merged = {
            ...CUSTOM_THEME_V19_DEFAULTS,
            ...(theme || {})
        };

        applyCustomBuiltThemeBeforeV19(
            merged
        );

        syncThemeBuilderBackdropPaddingV19(
            document.documentElement,
            merged
        );

        syncThemeBuilderSvgScaleV19(
            document.documentElement,
            merged
        );
    };

const clearCustomBuiltThemeBeforeV19 =
    clearCustomBuiltTheme;

clearCustomBuiltTheme =
    function() {
        clearCustomBuiltThemeBeforeV19();

        [
            '--custom-theme-daily-backdrop-padding',
            '--custom-theme-content-backdrop-padding',
            '--theme-svg-global-scale'
        ].forEach(
            name =>
                document.documentElement
                    .style
                    .removeProperty(
                        name
                    )
        );
    };

// Always reopen Settings at the ACTUALLY APPLIED theme.
// Old search text must never hide the newly applied custom theme.
const openGlobalThemeSettingsBeforeV19 =
    openGlobalThemeSettings;

openGlobalThemeSettings =
    function() {
        if (
            themeSearchInput
        ) {
            themeSearchInput.value =
                '';

            themeSearchInput.dataset
                .previousThemeSearchValue =
                '';
        }

        if (
            dailyThemeSelect
        ) {
            dailyThemeSelect.value =
                db.settings.theme ||
                'default';
        }

        themePickerSelected =
            db.settings.theme ||
            dailyThemeSelect?.value ||
            'default';

        openGlobalThemeSettingsBeforeV19();

        requestAnimationFrame(
            () => {
                filterThemePicker(
                    ''
                );

                scrollCurrentLogThemeIntoView();
            }
        );
    };

// ============================================================
// CUSTOM TAB POLAROID FULLSCREEN VIEWER
// ============================================================

function ensureCustomPolaroidViewerV19() {
    let modal =
        document.getElementById(
            'custom-polaroid-viewer-v19'
        );

    if (modal) {
        return modal;
    }

    modal =
        document.createElement(
            'div'
        );

    modal.id =
        'custom-polaroid-viewer-v19';

    modal.className =
        'modal-overlay hidden custom-polaroid-viewer-v19';

    modal.innerHTML = `
        <div class="custom-polaroid-viewer-box-v19">
            <button
                type="button"
                class="small-icon-btn custom-polaroid-viewer-close-v19"
                title="Close"
                aria-label="Close"
            >
                <i class="ph ph-x"></i>
            </button>

            <div class="custom-polaroid-viewer-media-v19"></div>
            <div class="custom-polaroid-viewer-caption-v19"></div>
        </div>
    `;

    document.body.appendChild(
        modal
    );

    const close =
        () => {
            modal.classList.add(
                'hidden'
            );

            const media =
                modal.querySelector(
                    '.custom-polaroid-viewer-media-v19'
                );

            if (media) {
                media.innerHTML =
                    '';
            }
        };

    modal
        .querySelector(
            '.custom-polaroid-viewer-close-v19'
        )
        ?.addEventListener(
            'click',
            close
        );

    modal.addEventListener(
        'pointerdown',
        event => {
            if (
                event.target ===
                modal
            ) {
                close();
            }
        }
    );

    document.addEventListener(
        'keydown',
        event => {
            if (
                event.key ===
                    'Escape' &&
                !modal.classList.contains(
                    'hidden'
                )
            ) {
                event.preventDefault();
                close();
            }
        }
    );

    modal._closeCustomPolaroidViewerV19 =
        close;

    return modal;
}

function openCustomPolaroidViewerV19(
    item
) {
    const modal =
        ensureCustomPolaroidViewerV19();

    const media =
        modal.querySelector(
            '.custom-polaroid-viewer-media-v19'
        );

    const caption =
        modal.querySelector(
            '.custom-polaroid-viewer-caption-v19'
        );

    if (
        !media ||
        !caption
    ) {
        return;
    }

    media.innerHTML =
        renderPolaroidMediaHtml(
            item
        );

    caption.textContent =
        item.caption ||
        'Untitled';

    modal.classList.remove(
        'hidden'
    );
}

const renderCustomPolaroidsBeforeV19 =
    renderCustomPolaroids;

renderCustomPolaroids =
    function(
        tab,
        component,
        content
    ) {
        renderCustomPolaroidsBeforeV19(
            tab,
            component,
            content
        );

        const itemsById =
            new Map(
                (
                    component.items ||
                    []
                ).map(
                    item => [
                        item.id,
                        item
                    ]
                )
            );

        content
            .querySelectorAll(
                '.custom-user-polaroid[data-custom-item-id]'
            )
            .forEach(
                polaroid => {
                    polaroid.title =
                        'Click to enlarge. Right-click to edit.';

                    polaroid.addEventListener(
                        'click',
                        event => {
                            if (
                                customTabEditMode ||
                                event.target.closest(
                                    'button, a, input, select, textarea'
                                )
                            ) {
                                return;
                            }

                            const item =
                                itemsById.get(
                                    polaroid.dataset
                                        .customItemId
                                );

                            if (!item) {
                                return;
                            }

                            openCustomPolaroidViewerV19(
                                item
                            );
                        }
                    );
                }
            );
    };



// ============================================================
// THEME BUILDER V20
// - ALL vs SOME intro bopping
// - richer, centered/organic SVG placement
// - refresh truly rerandomizes random placement
// - Daily Logs + Knowledge Base settings work inside preview
// - two independent Daily Logs search visibility toggles
// - back buttons NEVER receive a hover background
// ============================================================

const CUSTOM_THEME_V20_DEFAULTS = {
    introSvgBopMode: 'some'
};

// ------------------------------------------------------------
// TWO INDEPENDENT DAILY LOGS SEARCH TOGGLES — REAL APP
// ------------------------------------------------------------

const ensureDailyLogSearchUIBeforeV20 =
    ensureDailyLogSearchUI;

ensureDailyLogSearchUI =
    function() {
        if (!db.settings) {
            db.settings = {};
        }

        const hideDaily =
            !!db.settings.hideDailyLogSearch;

        const hideGlobal =
            !!db.settings.hideDailyGlobalSearch;

        // Older code treated "Hide Search" as hiding the ENTIRE two-search row.
        // Temporarily make it render normally, then independently hide each column.
        const savedHideDaily =
            db.settings.hideDailyLogSearch;

        db.settings.hideDailyLogSearch =
            false;

        ensureDailyLogSearchUIBeforeV20();

        db.settings.hideDailyLogSearch =
            savedHideDaily;

        const wrap =
            document.getElementById(
                'daily-log-search-wrap'
            );

        if (!wrap) {
            return;
        }

        const dailyColumn =
            wrap.querySelector(
                '.daily-search-column:not(.daily-global-search-column)'
            );

        const globalColumn =
            wrap.querySelector(
                '.daily-global-search-column'
            );

        dailyColumn?.classList.toggle(
            'hidden',
            hideDaily
        );

        globalColumn?.classList.toggle(
            'hidden',
            hideGlobal
        );

        wrap.classList.toggle(
            'hidden',
            hideDaily &&
                hideGlobal
        );

        wrap.classList.toggle(
            'daily-single-search-v20',
            hideDaily !==
                hideGlobal
        );

        if (hideDaily) {
            dailyLogSearchQuery =
                '';

            const input =
                wrap.querySelector(
                    '#daily-log-search-input'
                );

            if (input) {
                input.value =
                    '';
            }

            wrap
                .querySelector(
                    '#daily-log-search-clear'
                )
                ?.classList.add(
                    'hidden'
                );
        }

        if (hideGlobal) {
            inlineGlobalSearchQueryV2 =
                '';

            const input =
                wrap.querySelector(
                    '#daily-global-search-input'
                );

            if (input) {
                input.value =
                    '';
            }

            wrap
                .querySelector(
                    '#daily-global-search-clear'
                )
                ?.classList.add(
                    'hidden'
                );

            renderInlineGlobalSearchResultsV2(
                ''
            );
        }
    };

const ensureDailyLogsSettingsModalBeforeV20 =
    ensureDailyLogsSettingsModal;

ensureDailyLogsSettingsModal =
    function() {
        const modal =
            ensureDailyLogsSettingsModalBeforeV20();

        if (!modal) {
            return modal;
        }

        const firstToggle =
            modal.querySelector(
                '#daily-logs-show-search-toggle'
            );

        const firstLabel =
            firstToggle?.closest(
                '.daily-logs-setting-toggle-row'
            );

        if (firstLabel) {
            const title =
                firstLabel.querySelector(
                    'strong'
                );

            const detail =
                firstLabel.querySelector(
                    'small'
                );

            if (title) {
                title.textContent =
                    'Hide Daily Logs Search';
            }

            if (detail) detail.remove();

            firstToggle.checked =
                !!db.settings
                    .hideDailyLogSearch;
        }

        if (
            !modal.querySelector(
                '#daily-logs-hide-global-search-toggle'
            )
        ) {
            const section =
                document.createElement(
                    'div'
                );

            section.className =
                'modal-section';

            section.innerHTML = `
                <label class="daily-logs-setting-toggle-row">
                    <div>
                        <strong>Hide Global Search</strong>
                    </div>

                    <input
                        type="checkbox"
                        id="daily-logs-hide-global-search-toggle"
                    >
                </label>
            `;

            firstLabel
                ?.closest(
                    '.modal-section'
                )
                ?.insertAdjacentElement(
                    'afterend',
                    section
                );

            const globalToggle =
                section.querySelector(
                    '#daily-logs-hide-global-search-toggle'
                );

            globalToggle.checked =
                !!db.settings
                    .hideDailyGlobalSearch;

            globalToggle.addEventListener(
                'change',
                event => {
                    db.settings.hideDailyGlobalSearch =
                        !!event.target
                            .checked;

                    inlineGlobalSearchQueryV2 =
                        '';

                    saveDb();

                    initGrid();
                }
            );
        } else {
            modal.querySelector(
                '#daily-logs-hide-global-search-toggle'
            ).checked =
                !!db.settings
                    .hideDailyGlobalSearch;
        }

        return modal;
    };

// Re-apply the two-column visibility once the initial page has rendered too.
requestAnimationFrame(
    () => {
        if (
            typeof ensureDailyLogSearchUI ===
            'function'
        ) {
            ensureDailyLogSearchUI();
        }
    }
);

// ------------------------------------------------------------
// INTRO BOPPING — ALL OR SOME
// ------------------------------------------------------------

const getThemeBuilderDraftBeforeV20 =
    getThemeBuilderDraft;

getThemeBuilderDraft =
    function(
        modal
    ) {
        const draft = {
            ...CUSTOM_THEME_V20_DEFAULTS,
            ...getThemeBuilderDraftBeforeV20(
                modal
            )
        };

        const mode =
            modal
                ?.querySelector(
                    '.theme-builder-intro-bop-mode-v20'
                )
                ?.value;

        draft.introSvgBopMode =
            mode ===
                'all'
                ? 'all'
                : 'some';

        return draft;
    };

function syncThemeBuilderIntroBopModeV20(
    modal
) {
    const enabled =
        !!modal
            .querySelector(
                '.theme-builder-intro-svg-bop-enabled'
            )
            ?.checked;

    const mode =
        modal
            .querySelector(
                '.theme-builder-intro-bop-mode-v20'
            )
            ?.value ||
        'some';

    modal
        .querySelector(
            '.theme-builder-intro-bop-mode-wrap-v20'
        )
        ?.classList.toggle(
            'hidden',
            !enabled
        );

    modal
        .querySelectorAll(
            '.theme-builder-svg-intro-bop-row'
        )
        .forEach(
            row => {
                row.classList.toggle(
                    'hidden',
                    !enabled ||
                        mode ===
                            'all'
                );
            }
        );
}

function ensureThemeBuilderIntroBopModeV20(
    modal,
    theme
) {
    const wrap =
        modal.querySelector(
            '.theme-builder-intro-svg-bop-wrap'
        );

    if (!wrap) {
        return;
    }

    let modeWrap =
        wrap.querySelector(
            '.theme-builder-intro-bop-mode-wrap-v20'
        );

    if (!modeWrap) {
        modeWrap =
            document.createElement(
                'label'
            );

        modeWrap.className =
            'theme-builder-field theme-builder-intro-bop-mode-wrap-v20';

        modeWrap.innerHTML = `
            <span>Which SVGs Bop?</span>

            <select class="theme-builder-intro-bop-mode-v20">
                <option value="all">
                    All SVGs
                </option>

                <option value="some">
                    Only selected SVGs
                </option>
            </select>
        `;

        const toggle =
            wrap.querySelector(
                '.theme-builder-intro-svg-bop-toggle'
            );

        toggle?.insertAdjacentElement(
            'afterend',
            modeWrap
        );
    }

    const select =
        modeWrap.querySelector(
            '.theme-builder-intro-bop-mode-v20'
        );

    select.value =
        theme?.introSvgBopMode ===
            'all'
            ? 'all'
            : 'some';

    if (
        select.dataset
            .themeBuilderV20Bound !==
        'true'
    ) {
        select.dataset
            .themeBuilderV20Bound =
            'true';

        select.addEventListener(
            'change',
            () => {
                syncThemeBuilderIntroBopModeV20(
                    modal
                );

                renderThemeBuilderSvgListV2(
                    modal
                );

                updateThemeBuilderPreview(
                    modal
                );
            }
        );
    }

    const enabled =
        modal.querySelector(
            '.theme-builder-intro-svg-bop-enabled'
        );

    if (
        enabled &&
        enabled.dataset
            .themeBuilderBopModeV20 !==
            'true'
    ) {
        enabled.dataset
            .themeBuilderBopModeV20 =
            'true';

        enabled.addEventListener(
            'change',
            () => {
                syncThemeBuilderIntroBopModeV20(
                    modal
                );
            }
        );
    }

    syncThemeBuilderIntroBopModeV20(
        modal
    );
}

const syncThemeBuilderAdvancedVisibilityBeforeV20 =
    syncThemeBuilderAdvancedVisibilityV10;

syncThemeBuilderAdvancedVisibilityV10 =
    function(
        modal
    ) {
        syncThemeBuilderAdvancedVisibilityBeforeV20(
            modal
        );

        syncThemeBuilderIntroBopModeV20(
            modal
        );
    };

const previewThemeBuilderIntroBeforeV20 =
    previewThemeBuilderIntroV10;

previewThemeBuilderIntroV10 =
    function(
        modal
    ) {
        const stage =
            modal.querySelector(
                '.theme-builder-live-art-stage'
            );

        const draft =
            getThemeBuilderDraft(
                modal
            );

        stage?.classList.toggle(
            'theme-svg-intro-bop-all',
            draft.introSvgBopMode ===
                'all'
        );

        previewThemeBuilderIntroBeforeV20(
            modal
        );
    };

const playCustomThemeIntroAudioBeforeV20 =
    playCustomThemeIntroAudioV2;

playCustomThemeIntroAudioV2 =
    function(
        theme
    ) {
        playCustomThemeIntroAudioBeforeV20(
            theme
        );

        const stage =
            document.getElementById(
                'custom-theme-background-stage'
            );

        stage?.classList.toggle(
            'theme-svg-intro-bop-all',
            theme?.introSvgBopMode ===
                'all'
        );
    };

// ------------------------------------------------------------
// RICHER SVG PLACEMENT — SAFE CENTERED COORDINATES
// ------------------------------------------------------------

function themePreviewRandomV20(
    seed,
    index,
    salt = 0
) {
    const raw =
        Math.sin(
            (
                seed *
                    0.913 +
                index *
                    17.171 +
                salt *
                    31.337
            ) *
                12.9898
        ) *
        43758.5453123;

    return raw -
        Math.floor(
            raw
        );
}

function shuffledThemeEntriesV20(
    entries,
    seed = null
) {
    const result =
        entries.map(
            entry => ({
                ...entry
            })
        );

    for (
        let index =
            result.length -
                1;
        index >
            0;
        index--
    ) {
        const value =
            seed ===
                null
                ? Math.random()
                : themePreviewRandomV20(
                    seed,
                    index,
                    491
                );

        const swap =
            Math.floor(
                value *
                (
                    index +
                    1
                )
            );

        [
            result[index],
            result[swap]
        ] = [
            result[swap],
            result[index]
        ];
    }

    return result;
}

function themePlacementSlotsV20(
    mode
) {
    const leftRight = [
        [11, 16],
        [12, 34],
        [10, 55],
        [13, 76],
        [12, 88],
        [89, 15],
        [88, 32],
        [90, 52],
        [87, 72],
        [89, 87]
    ];

    const topBottom = [
        [16, 12],
        [34, 11],
        [54, 13],
        [73, 10],
        [88, 13],
        [15, 88],
        [33, 89],
        [52, 87],
        [71, 90],
        [87, 87]
    ];

    const corners = [
        [13, 14],
        [27, 12],
        [12, 28],
        [87, 14],
        [73, 12],
        [88, 29],
        [13, 86],
        [27, 88],
        [12, 72],
        [87, 86],
        [73, 88],
        [88, 71]
    ];

    if (
        mode ===
        'top-bottom'
    ) {
        return topBottom;
    }

    if (
        mode ===
        'corners'
    ) {
        return corners;
    }

    return leftRight;
}

function getThemeBuilderPreviewPlacementV20(
    modal,
    draft
) {
    if (
        !Number.isFinite(
            modal._themePreviewDistributionSeedV10
        )
    ) {
        modal._themePreviewDistributionSeedV10 =
            Math.random() *
            100000;
    }

    const seed =
        modal._themePreviewDistributionSeedV10;

    let entries =
        (
            draft.backgroundSvgs ||
            []
        ).map(
            (
                svg,
                originalIndex
            ) => ({
                svg:
                    ensureSvgAdvancedDefaultsV10(
                        svg
                    ),
                originalIndex
            })
        );

    const mode =
        draft.svgDistribution ||
        'random';

    if (
        [
            'side-random',
            'all-edges-random'
        ].includes(
            mode
        )
    ) {
        entries =
            shuffledThemeEntriesV20(
                entries,
                seed
            );
    }

    const slots =
        themePlacementSlotsV20(
            mode
        );

    return entries.map(
        (
            entry,
            index
        ) => {
            const rand =
                salt =>
                    themePreviewRandomV20(
                        seed,
                        index,
                        salt
                    );

            if (
                mode ===
                'wide-random'
            ) {
                return {
                    ...entry,
                    left:
                        9 +
                        rand(11) *
                            82,
                    top:
                        10 +
                        rand(17) *
                            80
                };
            }

            if (
                mode ===
                'center-cluster'
            ) {
                return {
                    ...entry,
                    left:
                        29 +
                        rand(21) *
                            42,
                    top:
                        25 +
                        rand(27) *
                            50
                };
            }

            if (
                mode ===
                'all-edges-random'
            ) {
                const edge =
                    Math.floor(
                        rand(31) *
                        4
                    );

                const along =
                    13 +
                    rand(37) *
                        74;

                if (
                    edge ===
                    0
                ) {
                    return {
                        ...entry,
                        left:
                            along,
                        top:
                            11 +
                            rand(39) *
                                3
                    };
                }

                if (
                    edge ===
                    1
                ) {
                    return {
                        ...entry,
                        left:
                            87 +
                            rand(41) *
                                3,
                        top:
                            along
                    };
                }

                if (
                    edge ===
                    2
                ) {
                    return {
                        ...entry,
                        left:
                            along,
                        top:
                            87 +
                            rand(43) *
                                3
                    };
                }

                return {
                    ...entry,
                    left:
                        10 +
                        rand(47) *
                            3,
                    top:
                        along
                };
            }

            if (
                [
                    'side-fixed',
                    'side-random',
                    'top-bottom',
                    'corners'
                ].includes(
                    mode
                )
            ) {
                const slot =
                    slots[
                        index %
                        slots.length
                    ];

                const jitter =
                    mode ===
                        'side-random'
                        ? 2.6
                        : 1.2;

                return {
                    ...entry,
                    left:
                        slot[0] +
                        (
                            rand(53) -
                            .5
                        ) *
                            jitter,
                    top:
                        slot[1] +
                        (
                            rand(59) -
                            .5
                        ) *
                            jitter
                };
            }

            // Organic scatter: centered safe zone, not upper-left biased.
            return {
                ...entry,
                left:
                    13 +
                    rand(61) *
                        74,
                top:
                    14 +
                    rand(67) *
                        72
            };
        }
    );
}

function getThemeRuntimePlacementV20(
    theme
) {
    let entries =
        (
            theme.backgroundSvgs ||
            []
        ).map(
            (
                svg,
                originalIndex
            ) => ({
                svg:
                    ensureSvgAdvancedDefaultsV10({
                        ...svg
                    }),
                originalIndex
            })
        );

    const mode =
        theme.svgDistribution ||
        'random';

    if (
        [
            'side-random',
            'all-edges-random'
        ].includes(
            mode
        )
    ) {
        entries =
            shuffledThemeEntriesV20(
                entries
            );
    }

    const slots =
        themePlacementSlotsV20(
            mode
        );

    return entries.map(
        (
            entry,
            index
        ) => {
            const rand =
                () =>
                    Math.random();

            if (
                mode ===
                'wide-random'
            ) {
                return {
                    ...entry,
                    left:
                        9 +
                        rand() *
                            82,
                    top:
                        10 +
                        rand() *
                            80
                };
            }

            if (
                mode ===
                'center-cluster'
            ) {
                return {
                    ...entry,
                    left:
                        29 +
                        rand() *
                            42,
                    top:
                        25 +
                        rand() *
                            50
                };
            }

            if (
                mode ===
                'all-edges-random'
            ) {
                const edge =
                    Math.floor(
                        rand() *
                        4
                    );

                const along =
                    13 +
                    rand() *
                        74;

                if (
                    edge ===
                    0
                ) {
                    return {
                        ...entry,
                        left:
                            along,
                        top:
                            11 +
                            rand() *
                                3
                    };
                }

                if (
                    edge ===
                    1
                ) {
                    return {
                        ...entry,
                        left:
                            87 +
                            rand() *
                                3,
                        top:
                            along
                    };
                }

                if (
                    edge ===
                    2
                ) {
                    return {
                        ...entry,
                        left:
                            along,
                        top:
                            87 +
                            rand() *
                                3
                    };
                }

                return {
                    ...entry,
                    left:
                        10 +
                        rand() *
                            3,
                    top:
                        along
                };
            }

            if (
                [
                    'side-fixed',
                    'side-random',
                    'top-bottom',
                    'corners'
                ].includes(
                    mode
                )
            ) {
                const slot =
                    slots[
                        index %
                        slots.length
                    ];

                const jitter =
                    mode ===
                        'side-random'
                        ? 2.6
                        : 1.2;

                return {
                    ...entry,
                    left:
                        slot[0] +
                        (
                            rand() -
                            .5
                        ) *
                            jitter,
                    top:
                        slot[1] +
                        (
                            rand() -
                            .5
                        ) *
                            jitter
                };
            }

            return {
                ...entry,
                left:
                    13 +
                    rand() *
                        74,
                top:
                    14 +
                    rand() *
                        72
            };
        }
    );
}

getPreviewSvgAssignmentsV10 =
    function(
        modal,
        draft
    ) {
        return getThemeBuilderPreviewPlacementV20(
            modal,
            draft
        );
    };

getRuntimeSvgAssignmentsV10 =
    function(
        theme
    ) {
        return getThemeRuntimePlacementV20(
            theme
        );
    };

function ensureThemeBuilderPlacementOptionsV20(
    modal,
    theme
) {
    const select =
        modal.querySelector(
            '.theme-builder-svg-distribution'
        );

    if (!select) {
        return;
    }

    const valid = [
        'random',
        'wide-random',
        'center-cluster',
        'corners',
        'side-fixed',
        'side-random',
        'top-bottom',
        'all-edges-random'
    ];

    const current =
        valid.includes(
            theme?.svgDistribution
        )
            ? theme.svgDistribution
            : (
                valid.includes(
                    select.value
                )
                    ? select.value
                    : 'random'
            );

    select.innerHTML = `
        <option value="random">
            Organic scatter
        </option>

        <option value="wide-random">
            Wide random scatter
        </option>

        <option value="center-cluster">
            Loose center cluster
        </option>

        <option value="corners">
            Corners & nearby edges
        </option>

        <option value="side-fixed">
            Left & right edges
        </option>

        <option value="side-random">
            Left & right edges · reshuffle
        </option>

        <option value="top-bottom">
            Top & bottom edges
        </option>

        <option value="all-edges-random">
            Random around all edges
        </option>
    `;

    select.value =
        current;

    if (
        select.dataset
            .themeBuilderPlacementV20 !==
        'true'
    ) {
        select.dataset
            .themeBuilderPlacementV20 =
            'true';

        select.addEventListener(
            'change',
            () => {
                modal._themePreviewDistributionSeedV10 =
                    Math.random() *
                    100000;

                updateThemeBuilderPreview(
                    modal
                );
            }
        );
    }
}

// Refresh button must reroll the seed BEFORE the existing rebuild listener runs.
const ensureActualThemeBuilderPreviewBeforeV20 =
    ensureActualThemeBuilderPreviewV5;

ensureActualThemeBuilderPreviewV5 =
    function(
        modal
    ) {
        ensureActualThemeBuilderPreviewBeforeV20(
            modal
        );

        const button =
            modal.querySelector(
                '.theme-builder-live-preview-refresh'
            );

        if (
            button &&
            button.dataset
                .themeBuilderRandomRefreshV20 !==
                'true'
        ) {
            button.dataset
                .themeBuilderRandomRefreshV20 =
                'true';

            button.addEventListener(
                'click',
                () => {
                    modal._themePreviewDistributionSeedV10 =
                        Math.random() *
                        100000;
                },
                true
            );
        }
    };

// ------------------------------------------------------------
// PREVIEW-ONLY DAILY LOGS SETTINGS MODAL
// ------------------------------------------------------------

function getThemeBuilderDailyPreviewStateV20(
    modal
) {
    if (
        !modal._themeBuilderDailyPreviewSettingsV20
    ) {
        modal._themeBuilderDailyPreviewSettingsV20 = {
            viewType:
                db.settings.dailyViewType ||
                'default',
            polaroidSource:
                db.settings.dailyPolaroidSource ||
                'starred',
            hideDailySearch:
                !!db.settings
                    .hideDailyLogSearch,
            hideGlobalSearch:
                !!db.settings
                    .hideDailyGlobalSearch
        };
    }

    return modal
        ._themeBuilderDailyPreviewSettingsV20;
}

function buildThemeBuilderPreviewPolaroidMediaV20(
    dayData,
    sourceMode
) {
    if (
        sourceMode ===
            'video' &&
        dayData?.video
    ) {
        const ytId =
            extractYoutubeId(
                dayData.video
            );

        if (ytId) {
            return `
                <iframe
                    src="https://www.youtube.com/embed/${escapeKnowledgeAttr(ytId)}?controls=0&mute=1"
                    tabindex="-1"
                ></iframe>
            `;
        }

        return `
            <video
                src="${escapeKnowledgeAttr(dayData.video)}"
                muted
                playsinline
                tabindex="-1"
            ></video>
        `;
    }

    const images =
        Array.isArray(
            dayData?.noteImages
        )
            ? dayData.noteImages
            : [];

    if (
        images.length
    ) {
        const starred =
            images.find(
                image =>
                    typeof image ===
                        'object' &&
                    image.starred
            );

        const source =
            starred?.src ||
            (
                typeof images[0] ===
                    'string'
                    ? images[0]
                    : images[0]?.src
            );

        if (source) {
            return `
                <img
                    src="${escapeKnowledgeAttr(source)}"
                    alt=""
                    style="width:100%;height:100%;object-fit:cover;"
                >
            `;
        }
    }

    return `
        <div class="polaroid-video-placeholder">
            <i class="ph ph-image"></i>
        </div>
    `;
}

function renderThemeBuilderDailyGridPreviewV20(
    modal
) {
    const canvas =
        modal.querySelector(
            '.theme-builder-live-canvas'
        );

    if (
        !canvas ||
        canvas.dataset
            .previewSourceId !==
            'grid-view'
    ) {
        return;
    }

    const page =
        canvas.querySelector(
            '.theme-builder-live-page'
        );

    if (!page) {
        return;
    }

    const state =
        getThemeBuilderDailyPreviewStateV20(
            modal
        );

    const wrap =
        page.querySelector(
            '[data-preview-original-id="daily-log-search-wrap"]'
        ) ||
        page.querySelector(
            '.daily-log-search-wrap'
        );

    if (wrap) {
        const dailyColumn =
            wrap.querySelector(
                '.daily-search-column:not(.daily-global-search-column)'
            );

        const globalColumn =
            wrap.querySelector(
                '.daily-global-search-column'
            );

        dailyColumn?.classList.toggle(
            'hidden',
            state.hideDailySearch
        );

        globalColumn?.classList.toggle(
            'hidden',
            state.hideGlobalSearch
        );

        wrap.classList.toggle(
            'hidden',
            state.hideDailySearch &&
                state.hideGlobalSearch
        );

        wrap.classList.toggle(
            'daily-single-search-v20',
            state.hideDailySearch !==
                state.hideGlobalSearch
        );
    }

    const grid =
        page.querySelector(
            '[data-preview-original-id="days-grid"]'
        );

    if (!grid) {
        return;
    }

    const dayNumbers =
        Object.keys(
            db.days ||
            {}
        )
            .map(
                Number
            )
            .filter(
                value =>
                    Number.isFinite(
                        value
                    ) &&
                    value >
                        0
            );

    const maxDay =
        Math.max(
            1,
            ...dayNumbers,
            1
        );

    const previewMax =
        Math.min(
            Math.max(
                maxDay,
                4
            ),
            12
        );

    grid.innerHTML =
        '';

    grid.className =
        state.viewType ===
            'polaroid'
            ? 'polaroid-grid-container'
            : 'grid-container';

    for (
        let day =
            1;
        day <=
            previewMax;
        day++
    ) {
        const dayData =
            db.days?.[day] ||
            {};

        if (
            state.viewType ===
            'polaroid'
        ) {
            const card =
                document.createElement(
                    'div'
                );

            card.className =
                'polaroid-card';

            card.dataset.day =
                String(day);

            card.innerHTML = `
                <div class="polaroid-video">
                    ${buildThemeBuilderPreviewPolaroidMediaV20(
                        dayData,
                        state.polaroidSource
                    )}
                </div>

                <div class="polaroid-label">
                    <span class="chip-text">
                        Day ${day}
                    </span>
                </div>
            `;

            grid.appendChild(
                card
            );
        } else {
            const wrapper =
                document.createElement(
                    'div'
                );

            wrapper.dataset.day =
                String(day);

            wrapper.style.position =
                'relative';

            wrapper.style.display =
                'inline-block';

            const button =
                document.createElement(
                    'button'
                );

            button.className =
                'day-box';

            button.textContent =
                String(day);

            const hasData =
                !!(
                    dayData.notes ||
                    dayData.video ||
                    dayData.phrases
                        ?.length
                );

            if (hasData) {
                button.classList.add(
                    'has-data'
                );
            }

            wrapper.appendChild(
                button
            );

            grid.appendChild(
                wrapper
            );
        }
    }

    const plus =
        document.createElement(
            'button'
        );

    plus.className =
        state.viewType ===
            'polaroid'
            ? 'polaroid-card'
            : 'day-box';

    plus.innerHTML =
        state.viewType ===
            'polaroid'
            ? `
                <div class="polaroid-video">
                    <div class="polaroid-video-placeholder">
                        <i class="ph ph-plus"></i>
                    </div>
                </div>
                <div class="polaroid-label">
                    New Day
                </div>
            `
            : '<i class="ph ph-plus"></i>';

    grid.appendChild(
        plus
    );

    bindThemeBuilderDayCardsV12(
        modal
    );
}

function closeThemeBuilderPreviewSettingsV20(
    modal
) {
    modal
        .querySelector(
            '.theme-builder-preview-settings-overlay-v20'
        )
        ?.remove();
}

function createThemeBuilderPreviewSettingsShellV20(
    modal,
    title
) {
    closeThemeBuilderPreviewSettingsV20(
        modal
    );

    const canvas =
        modal.querySelector(
            '.theme-builder-live-canvas'
        );

    if (!canvas) {
        return null;
    }

    const overlay =
        document.createElement(
            'div'
        );

    overlay.className =
        'theme-builder-preview-settings-overlay-v20';

    overlay.innerHTML = `
        <div class="theme-builder-preview-settings-box-v20">
            <div class="modal-header">
                <h2>${escapeCustomHtml(title)}</h2>

                <button
                    type="button"
                    class="small-icon-btn theme-builder-preview-settings-close-v20"
                    title="Close"
                >
                    <i class="ph ph-x"></i>
                </button>
            </div>

            <div class="theme-builder-preview-settings-content-v20"></div>
        </div>
    `;

    canvas.appendChild(
        overlay
    );

    overlay
        .querySelector(
            '.theme-builder-preview-settings-close-v20'
        )
        ?.addEventListener(
            'click',
            () =>
                overlay.remove()
        );

    overlay.addEventListener(
        'pointerdown',
        event => {
            if (
                event.target ===
                overlay
            ) {
                overlay.remove();
            }
        }
    );

    return overlay;
}

function openThemeBuilderDailySettingsPreviewV20(
    modal
) {
    const state =
        getThemeBuilderDailyPreviewStateV20(
            modal
        );

    const overlay =
        createThemeBuilderPreviewSettingsShellV20(
            modal,
            'Daily Logs Settings'
        );

    const content =
        overlay?.querySelector(
            '.theme-builder-preview-settings-content-v20'
        );

    if (!content) {
        return;
    }

    content.innerHTML = `
        <div class="modal-section">
            <span class="field-label">
                View Type
            </span>

            <select class="theme-builder-preview-daily-view-v20">
                <option value="default">
                    Default Grid
                </option>
                <option value="polaroid">
                    Polaroid
                </option>
            </select>
        </div>

        <div class="modal-section theme-builder-preview-polaroid-source-v20">
            <span class="field-label">
                Polaroid Source
            </span>

            <select class="theme-builder-preview-polaroid-source-select-v20">
                <option value="starred">
                    Starred Image
                </option>
                <option value="video">
                    Video
                </option>
            </select>
        </div>

        <div class="modal-section">
            <label class="daily-logs-setting-toggle-row">
                <div>
                    <strong>Hide Daily Logs Search</strong>
                    <small>
                        Preview the page without the Daily Logs search box.
                    </small>
                </div>

                <input
                    type="checkbox"
                    class="theme-builder-preview-hide-daily-search-v20"
                >
            </label>
        </div>

        <div class="modal-section">
            <label class="daily-logs-setting-toggle-row">
                <div>
                    <strong>Hide Global Search</strong>
                    <small>
                        Preview the page without the “Search everything…” box.
                    </small>
                </div>

                <input
                    type="checkbox"
                    class="theme-builder-preview-hide-global-search-v20"
                >
            </label>
        </div>
    `;

    const view =
        content.querySelector(
            '.theme-builder-preview-daily-view-v20'
        );

    const sourceWrap =
        content.querySelector(
            '.theme-builder-preview-polaroid-source-v20'
        );

    const source =
        content.querySelector(
            '.theme-builder-preview-polaroid-source-select-v20'
        );

    const hideDaily =
        content.querySelector(
            '.theme-builder-preview-hide-daily-search-v20'
        );

    const hideGlobal =
        content.querySelector(
            '.theme-builder-preview-hide-global-search-v20'
        );

    view.value =
        state.viewType;

    source.value =
        state.polaroidSource;

    hideDaily.checked =
        state.hideDailySearch;

    hideGlobal.checked =
        state.hideGlobalSearch;

    const syncSource =
        () => {
            sourceWrap.classList.toggle(
                'hidden',
                view.value !==
                    'polaroid'
            );
        };

    syncSource();

    view.addEventListener(
        'change',
        () => {
            state.viewType =
                view.value ===
                    'polaroid'
                    ? 'polaroid'
                    : 'default';

            syncSource();

            renderThemeBuilderDailyGridPreviewV20(
                modal
            );
        }
    );

    source.addEventListener(
        'change',
        () => {
            state.polaroidSource =
                source.value ===
                    'video'
                    ? 'video'
                    : 'starred';

            renderThemeBuilderDailyGridPreviewV20(
                modal
            );
        }
    );

    hideDaily.addEventListener(
        'change',
        () => {
            state.hideDailySearch =
                hideDaily.checked;

            renderThemeBuilderDailyGridPreviewV20(
                modal
            );
        }
    );

    hideGlobal.addEventListener(
        'change',
        () => {
            state.hideGlobalSearch =
                hideGlobal.checked;

            renderThemeBuilderDailyGridPreviewV20(
                modal
            );
        }
    );
}

function openThemeBuilderKnowledgeSettingsPreviewV20(
    modal
) {
    if (
        typeof renderSettings ===
        'function'
    ) {
        renderSettings();
    }

    const real =
        document.getElementById(
            'settings-modal'
        );

    const realBox =
        real?.querySelector(
            '.modal-box'
        );

    if (!realBox) {
        return;
    }

    const overlay =
        createThemeBuilderPreviewSettingsShellV20(
            modal,
            'Knowledge Base Settings'
        );

    const content =
        overlay?.querySelector(
            '.theme-builder-preview-settings-content-v20'
        );

    if (!content) {
        return;
    }

    const clone =
        realBox.cloneNode(
            true
        );

    clone
        .querySelector(
            '.modal-header'
        )
        ?.remove();

    clone.removeAttribute(
        'id'
    );

    clone
        .querySelectorAll(
            '[id]'
        )
        .forEach(
            element => {
                element.dataset
                    .previewOriginalId =
                    element.id;

                element.removeAttribute(
                    'id'
                );
            }
        );

    clone.classList.add(
        'theme-builder-preview-cloned-settings-v20'
    );

    content.appendChild(
        clone
    );

    clone
        .querySelectorAll(
            '.kb-view-btn'
        )
        .forEach(
            button => {
                button.addEventListener(
                    'click',
                    event => {
                        event.preventDefault();

                        clone
                            .querySelectorAll(
                                '.kb-view-btn'
                            )
                            .forEach(
                                item =>
                                    item.classList.remove(
                                        'active'
                                    )
                            );

                        button.classList.add(
                            'active'
                        );

                        const hideRow =
                            clone.querySelector(
                                '[data-preview-original-id="settings-hide-categories-row"]'
                            );

                        hideRow?.classList.toggle(
                            'hidden',
                            button.dataset
                                .view !==
                                'polaroid'
                        );
                    }
                );
            }
        );

    clone
        .querySelectorAll(
            '[data-preview-original-id="settings-category-tabs"] .filter-tab'
        )
        .forEach(
            tab => {
                tab.addEventListener(
                    'click',
                    event => {
                        event.preventDefault();

                        tab.parentElement
                            ?.querySelectorAll(
                                '.filter-tab'
                            )
                            .forEach(
                                item =>
                                    item.classList.remove(
                                        'active'
                                    )
                            );

                        tab.classList.add(
                            'active'
                        );
                    }
                );
            }
        );
}

function bindThemeBuilderPreviewSettingsButtonsV20(
    modal
) {
    const page =
        modal.querySelector(
            '.theme-builder-live-page'
        );

    if (!page) {
        return;
    }

    const daily =
        page.querySelector(
            '[data-preview-original-id="open-daily-settings-btn"]'
        );

    if (
        daily &&
        daily.dataset
            .themePreviewSettingsV20 !==
            'true'
    ) {
        daily.dataset
            .themePreviewSettingsV20 =
            'true';

        daily.classList.add(
            'theme-builder-preview-settings-button-v20'
        );

        daily.addEventListener(
            'click',
            event => {
                event.preventDefault();
                event.stopPropagation();

                openThemeBuilderDailySettingsPreviewV20(
                    modal
                );
            }
        );
    }

    const knowledge =
        page.querySelector(
            '[data-preview-original-id="open-settings-btn"]'
        );

    if (
        knowledge &&
        knowledge.dataset
            .themePreviewSettingsV20 !==
            'true'
    ) {
        knowledge.dataset
            .themePreviewSettingsV20 =
            'true';

        knowledge.classList.add(
            'theme-builder-preview-settings-button-v20'
        );

        knowledge.addEventListener(
            'click',
            event => {
                event.preventDefault();
                event.stopPropagation();

                openThemeBuilderKnowledgeSettingsPreviewV20(
                    modal
                );
            }
        );
    }
}

// ------------------------------------------------------------
// FINAL THEME BUILDER WIRING
// ------------------------------------------------------------

const populateThemeBuilderBeforeV20 =
    populateThemeBuilder;

populateThemeBuilder =
    function(
        modal,
        theme
    ) {
        const merged = {
            ...CUSTOM_THEME_V20_DEFAULTS,
            ...(theme || {})
        };

        populateThemeBuilderBeforeV20(
            modal,
            merged
        );

        ensureThemeBuilderIntroBopModeV20(
            modal,
            merged
        );

        ensureThemeBuilderPlacementOptionsV20(
            modal,
            merged
        );

        renderThemeBuilderSvgListV2(
            modal
        );

        syncThemeBuilderIntroBopModeV20(
            modal
        );

        updateThemeBuilderPreview(
            modal
        );
    };

const renderThemeBuilderSvgListBeforeV20 =
    renderThemeBuilderSvgListV2;

renderThemeBuilderSvgListV2 =
    function(
        modal
    ) {
        renderThemeBuilderSvgListBeforeV20(
            modal
        );

        syncThemeBuilderIntroBopModeV20(
            modal
        );
    };

const applyThemeBuilderDraftToActualPreviewBeforeV20 =
    applyThemeBuilderDraftToActualPreviewV5;

applyThemeBuilderDraftToActualPreviewV5 =
    function(
        modal
    ) {
        applyThemeBuilderDraftToActualPreviewBeforeV20(
            modal
        );

        renderThemeBuilderDailyGridPreviewV20(
            modal
        );

        bindThemeBuilderPreviewSettingsButtonsV20(
            modal
        );

        syncThemeBuilderIntroBopModeV20(
            modal
        );
    };

const rebuildActualThemeBuilderPreviewBeforeV20 =
    rebuildActualThemeBuilderPreviewV5;

rebuildActualThemeBuilderPreviewV5 =
    function(
        modal
    ) {
        closeThemeBuilderPreviewSettingsV20(
            modal
        );

        rebuildActualThemeBuilderPreviewBeforeV20(
            modal
        );

        renderThemeBuilderDailyGridPreviewV20(
            modal
        );

        bindThemeBuilderPreviewSettingsButtonsV20(
            modal
        );

        bindThemeBuilderDayCardsV12(
            modal
        );

        bindThemeBuilderPreviewTabsV10(
            modal
        );

        requestAnimationFrame(
            () =>
                fitActualThemeBuilderPreviewV9(
                    modal
                )
        );
    };



// ============================================================
// THEME BUILDER V23 — AUTOMATIC "SOME SVGs" INTRO BOPPING
// + REMOVE READY-TO-REVIEW PREVIEW BOX
// ============================================================

function getThemeSvgPositionV23(
    element
) {
    return {
        x:
            parseFloat(
                element.style.left
            ) ||
            50,
        y:
            parseFloat(
                element.style.top
            ) ||
            50
    };
}

function chooseSpreadSvgBoppersV23(
    elements
) {
    const items =
        Array.from(
            elements ||
            []
        );

    const count =
        items.length;

    if (!count) {
        return [];
    }

    if (count === 1) {
        return [
            items[0]
        ];
    }

    // "Some" should visibly mean less than all, while still feeling active.
    const target =
        Math.max(
            1,
            Math.min(
                count - 1,
                Math.round(
                    count *
                    0.45
                )
            )
        );

    const positions =
        items.map(
            element => ({
                element,
                ...getThemeSvgPositionV23(
                    element
                )
            })
        );

    // Start with the sticker farthest from the center.
    // Then repeatedly choose the sticker farthest from every already
    // selected sticker. This naturally spreads the boppers around the page.
    let first =
        positions[0];

    let firstDistance =
        -1;

    positions.forEach(
        item => {
            const dx =
                item.x -
                50;

            const dy =
                item.y -
                50;

            const distance =
                dx *
                    dx +
                dy *
                    dy;

            if (
                distance >
                firstDistance
            ) {
                first =
                    item;

                firstDistance =
                    distance;
            }
        }
    );

    const selected = [
        first
    ];

    while (
        selected.length <
        target
    ) {
        let best =
            null;

        let bestDistance =
            -1;

        positions.forEach(
            candidate => {
                if (
                    selected.includes(
                        candidate
                    )
                ) {
                    return;
                }

                const nearestSelectedDistance =
                    Math.min(
                        ...selected.map(
                            chosen => {
                                const dx =
                                    candidate.x -
                                    chosen.x;

                                const dy =
                                    candidate.y -
                                    chosen.y;

                                return (
                                    dx *
                                        dx +
                                    dy *
                                        dy
                                );
                            }
                        )
                    );

                if (
                    nearestSelectedDistance >
                    bestDistance
                ) {
                    best =
                        candidate;

                    bestDistance =
                        nearestSelectedDistance;
                }
            }
        );

        if (!best) {
            break;
        }

        selected.push(
            best
        );
    }

    return selected.map(
        item =>
            item.element
    );
}

function applyAutomaticIntroBoppersV23(
    stage,
    mode = 'some'
) {
    if (!stage) {
        return;
    }

    const items =
        Array.from(
            stage.querySelectorAll(
                [
                    '.theme-builder-live-art-item',
                    '.custom-theme-background-svg'
                ].join(',')
            )
        );

    stage.classList.toggle(
        'theme-svg-intro-bop-all',
        mode ===
            'all'
    );

    items.forEach(
        item => {
            item.classList.remove(
                'theme-svg-intro-bop-selected'
            );

            item.removeAttribute(
                'data-auto-intro-bop'
            );
        }
    );

    if (
        mode ===
        'all'
    ) {
        items.forEach(
            item => {
                item.classList.add(
                    'theme-svg-intro-bop-selected'
                );

                item.dataset
                    .autoIntroBop =
                    'true';
            }
        );

        return;
    }

    chooseSpreadSvgBoppersV23(
        items
    ).forEach(
        item => {
            item.classList.add(
                'theme-svg-intro-bop-selected'
            );

            item.dataset
                .autoIntroBop =
                'true';
        }
    );
}

function syncThemeBuilderAutoBopUiV23(
    modal
) {
    if (!modal) {
        return;
    }

    const mode =
        modal
            .querySelector(
                '.theme-builder-intro-bop-mode-v20'
            )
            ?.value ||
        'some';

    // Manual per-SVG bopping is intentionally gone.
    // "Some" is automatically chosen from spatially separated stickers.
    modal
        .querySelectorAll(
            '.theme-builder-svg-intro-bop-row'
        )
        .forEach(
            row => {
                row.classList.add(
                    'hidden'
                );
            }
        );

    const select =
        modal.querySelector(
            '.theme-builder-intro-bop-mode-v20'
        );

    if (select) {
        const allOption =
            select.querySelector(
                'option[value="all"]'
            );

        const someOption =
            select.querySelector(
                'option[value="some"]'
            );

        if (allOption) {
            allOption.textContent =
                'All SVGs';
        }

        if (someOption) {
            someOption.textContent =
                'Some SVGs · automatic spread';
        }
    }

    const stage =
        modal.querySelector(
            '.theme-builder-live-art-stage'
        );

    applyAutomaticIntroBoppersV23(
        stage,
        mode
    );
}

const renderAdvancedThemeBuilderSvgPreviewBeforeV23 =
    renderAdvancedThemeBuilderSvgPreviewV10;

renderAdvancedThemeBuilderSvgPreviewV10 =
    function(
        modal
    ) {
        renderAdvancedThemeBuilderSvgPreviewBeforeV23(
            modal
        );

        const draft =
            getThemeBuilderDraft(
                modal
            );

        applyAutomaticIntroBoppersV23(
            modal.querySelector(
                '.theme-builder-live-art-stage'
            ),
            draft.introSvgBopMode ||
            'some'
        );
    };

const mountCustomThemeBackgroundSvgsBeforeV23 =
    mountCustomThemeBackgroundSvgsV2;

mountCustomThemeBackgroundSvgsV2 =
    function(
        theme
    ) {
        mountCustomThemeBackgroundSvgsBeforeV23(
            theme
        );

        applyAutomaticIntroBoppersV23(
            document.getElementById(
                'custom-theme-background-stage'
            ),
            theme?.introSvgBopMode ||
            'some'
        );
    };

const syncThemeBuilderIntroBopModeBeforeV23 =
    syncThemeBuilderIntroBopModeV20;

syncThemeBuilderIntroBopModeV20 =
    function(
        modal
    ) {
        syncThemeBuilderIntroBopModeBeforeV23(
            modal
        );

        syncThemeBuilderAutoBopUiV23(
            modal
        );
    };

const previewThemeBuilderIntroBeforeV23 =
    previewThemeBuilderIntroV10;

previewThemeBuilderIntroV10 =
    function(
        modal
    ) {
        const draft =
            getThemeBuilderDraft(
                modal
            );

        applyAutomaticIntroBoppersV23(
            modal.querySelector(
                '.theme-builder-live-art-stage'
            ),
            draft.introSvgBopMode ||
            'some'
        );

        previewThemeBuilderIntroBeforeV23(
            modal
        );
    };

const playCustomThemeIntroAudioBeforeV23 =
    playCustomThemeIntroAudioV2;

playCustomThemeIntroAudioV2 =
    function(
        theme
    ) {
        applyAutomaticIntroBoppersV23(
            document.getElementById(
                'custom-theme-background-stage'
            ),
            theme?.introSvgBopMode ||
            'some'
        );

        playCustomThemeIntroAudioBeforeV23(
            theme
        );
    };

function stripReadyToReviewPreviewBoxV23(
    modal
) {
    const page =
        modal?.querySelector(
            '.theme-builder-live-page'
        );

    if (!page) {
        return;
    }

    const candidates =
        Array.from(
            page.querySelectorAll(
                [
                    'div',
                    'section',
                    'article',
                    'aside',
                    'span',
                    'p',
                    'strong',
                    'button'
                ].join(',')
            )
        )
        .filter(
            element => {
                const text =
                    String(
                        element.textContent ||
                        ''
                    )
                        .replace(
                            /\s+/g,
                            ' '
                        )
                        .trim()
                        .toLowerCase();

                return (
                    text ===
                        'ready to review' ||
                    text.startsWith(
                        'ready to review '
                    )
                );
            }
        )
        .sort(
            (
                a,
                b
            ) =>
                a.children.length -
                b.children.length
        );

    if (!candidates.length) {
        return;
    }

    const label =
        candidates[0];

    label.classList.add(
        'theme-builder-ready-review-clean-v23'
    );

    // Sometimes the current page renders the message inside a one-purpose
    // wrapper/card. Clean that wrapper only in the preview too.
    let parent =
        label.parentElement;

    for (
        let depth =
            0;
        parent &&
            depth <
                2;
        depth++,
        parent =
            parent.parentElement
    ) {
        const normalized =
            String(
                parent.textContent ||
                ''
            )
                .replace(
                    /\s+/g,
                    ' '
                )
                .trim()
                .toLowerCase();

        if (
            normalized ===
                String(
                    label.textContent ||
                    ''
                )
                    .replace(
                        /\s+/g,
                        ' '
                    )
                    .trim()
                    .toLowerCase()
        ) {
            parent.classList.add(
                'theme-builder-ready-review-clean-v23'
            );
        } else {
            break;
        }
    }
}

const applyThemeBuilderDraftToActualPreviewBeforeV23 =
    applyThemeBuilderDraftToActualPreviewV5;

applyThemeBuilderDraftToActualPreviewV5 =
    function(
        modal
    ) {
        applyThemeBuilderDraftToActualPreviewBeforeV23(
            modal
        );

        syncThemeBuilderAutoBopUiV23(
            modal
        );

        stripReadyToReviewPreviewBoxV23(
            modal
        );
    };

const rebuildActualThemeBuilderPreviewBeforeV23 =
    rebuildActualThemeBuilderPreviewV5;

rebuildActualThemeBuilderPreviewV5 =
    function(
        modal
    ) {
        rebuildActualThemeBuilderPreviewBeforeV23(
            modal
        );

        syncThemeBuilderAutoBopUiV23(
            modal
        );

        stripReadyToReviewPreviewBoxV23(
            modal
        );

        requestAnimationFrame(
            () => {
                stripReadyToReviewPreviewBoxV23(
                    modal
                );

                fitActualThemeBuilderPreviewV9(
                    modal
                );
            }
        );
    };



// ============================================================
// THEME PICKER V24 — CUSTOM THEMES ALWAYS LAST
// Built-in themes stay first. Custom-created themes are grouped after
// every built-in theme, preserving the order they already have in the
// picker/select (creation order), and the + card remains the final item.
// ============================================================

function moveCustomThemeCardsToEndV24() {
    if (!themePicker) {
        return;
    }

    const createCard =
        themePicker.querySelector(
            '.theme-picker-create-card'
        );

    const customCards =
        Array.from(
            themePicker.querySelectorAll(
                '.theme-picker-card'
            )
        ).filter(
            card => {
                const value =
                    String(
                        card.dataset.theme ||
                        ''
                    );

                return (
                    value ===
                        'theme-custom-builder' ||
                    value.startsWith(
                        'theme-custom-builder-'
                    ) ||
                    card.classList.contains(
                        'theme-picker-custom-theme'
                    )
                );
            }
        );

    // appendChild moves existing nodes without recreating them, so all
    // click/right-click handlers and the relative order of custom themes
    // are preserved.
    customCards.forEach(
        card => {
            if (createCard) {
                themePicker.insertBefore(
                    card,
                    createCard
                );
            } else {
                themePicker.appendChild(
                    card
                );
            }
        }
    );

    // The create-theme + is always the very last thing in the gallery.
    if (createCard) {
        themePicker.appendChild(
            createCard
        );
    }
}

const renderThemePickerBeforeV24 =
    renderThemePicker;

renderThemePicker =
    function() {
        renderThemePickerBeforeV24();

        moveCustomThemeCardsToEndV24();
    };

// Also repair the current already-rendered gallery once on load.
requestAnimationFrame(
    moveCustomThemeCardsToEndV24
);



// ============================================================
// THEME BUILDER V25 — EDIT EVERY THEME
// Built-in/default themes remain their original themes, but Theme Builder
// edits are saved as per-theme overrides. Nothing in the original theme
// CSS/JS folders is destroyed.
// ============================================================

let themeOverrideApplySuppressedV25 =
    false;

function ensureThemeOverridesV25() {
    if (!db.settings) {
        db.settings = {};
    }

    if (
        !db.settings.themeOverrides ||
        typeof db.settings.themeOverrides !==
            'object' ||
        Array.isArray(
            db.settings.themeOverrides
        )
    ) {
        db.settings.themeOverrides =
            {};
    }

    return db.settings.themeOverrides;
}

function getThemeOverrideV25(
    themeId
) {
    if (
        !themeId ||
        themeId ===
            'theme-custom-builder'
    ) {
        return null;
    }

    return (
        ensureThemeOverridesV25()[
            themeId
        ] ||
        null
    );
}

function parseThemeCssColorV25(
    value,
    fallback
) {
    const text =
        String(value || '')
            .trim();

    if (
        /^#[0-9a-f]{6}$/i.test(
            text
        )
    ) {
        return text;
    }

    if (
        /^#[0-9a-f]{3}$/i.test(
            text
        )
    ) {
        return (
            '#' +
            text
                .slice(1)
                .split('')
                .map(
                    char =>
                        char + char
                )
                .join('')
        );
    }

    const match =
        text.match(
            /rgba?\(\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)/i
        );

    if (match) {
        const hex =
            value =>
                Math.max(
                    0,
                    Math.min(
                        255,
                        Math.round(
                            Number(value) ||
                            0
                        )
                    )
                )
                    .toString(16)
                    .padStart(
                        2,
                        '0'
                    );

        return (
            '#' +
            hex(match[1]) +
            hex(match[2]) +
            hex(match[3])
        );
    }

    return fallback;
}

function captureCurrentThemeBuilderBaseV25(
    themeId,
    themeName
) {
    const rootStyle =
        getComputedStyle(
            document.documentElement
        );

    const bodyStyle =
        getComputedStyle(
            document.body
        );

    const sampleSurface =
        document.querySelector(
            [
                '.view.active .modal-section',
                '.view.active .day-box',
                '.view.active .filter-tab',
                '.view.active .phrase-card',
                '.view.active'
            ].join(',')
        );

    const surfaceStyle =
        sampleSurface
            ? getComputedStyle(
                sampleSurface
            )
            : bodyStyle;

    const preview =
        typeof THEME_PREVIEWS !==
            'undefined'
            ? THEME_PREVIEWS[
                themeId
            ]
            : null;

    const background =
        parseThemeCssColorV25(
            rootStyle.getPropertyValue(
                '--custom-theme-page-bg'
            ) ||
            bodyStyle.backgroundColor,
            preview?.[0] ||
            '#f4f1ff'
        );

    const surface =
        parseThemeCssColorV25(
            rootStyle.getPropertyValue(
                '--white'
            ) ||
            surfaceStyle.backgroundColor,
            preview?.[1] ||
            '#ffffff'
        );

    const text =
        parseThemeCssColorV25(
            rootStyle.getPropertyValue(
                '--black'
            ) ||
            bodyStyle.color,
            '#171717'
        );

    const muted =
        parseThemeCssColorV25(
            rootStyle.getPropertyValue(
                '--muted-text'
            ),
            '#6b7280'
        );

    const accent =
        parseThemeCssColorV25(
            rootStyle.getPropertyValue(
                '--custom-theme-accent'
            ),
            preview?.[2] ||
            text
        );

    const thinBorder =
        rootStyle.getPropertyValue(
            '--thin-border'
        );

    const borderColorMatch =
        String(
            thinBorder ||
            ''
        ).match(
            /(#[0-9a-f]{3,8}|rgba?\([^)]+\))/i
        );

    const border =
        parseThemeCssColorV25(
            borderColorMatch?.[1],
            text
        );

    const radius =
        Math.max(
            0,
            Math.min(
                30,
                parseFloat(
                    rootStyle.getPropertyValue(
                        '--border-radius'
                    )
                ) ||
                parseFloat(
                    surfaceStyle.borderRadius
                ) ||
                0
            )
        );

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

        name:
            themeName ||
            (
                themeId ===
                    'default'
                    ? 'Default'
                    : String(
                        themeId ||
                        'Theme'
                    )
                        .replace(
                            /^theme-/,
                            ''
                        )
                        .replace(
                            /[-_]+/g,
                            ' '
                        )
                        .replace(
                            /\b\w/g,
                            char =>
                                char.toUpperCase()
                        )
            ),

        background,
        surface,
        text,
        border,
        accent,
        muted,
        radius,

        tabIconColor:
            parseThemeCssColorV25(
                rootStyle.getPropertyValue(
                    '--custom-theme-tab-icon-color'
                ),
                text
            ),

        tabTitleColor:
            parseThemeCssColorV25(
                rootStyle.getPropertyValue(
                    '--custom-theme-tab-title-color'
                ),
                text
            ),

        backButtonColor:
            parseThemeCssColorV25(
                rootStyle.getPropertyValue(
                    '--custom-theme-back-button-color'
                ),
                text
            ),

        backgroundSvgs:
            []
    };
}

function waitForThemeCssV25(
    themeId
) {
    if (
        !themeId ||
        themeId ===
            'default' ||
        themeId ===
            'theme-custom-builder'
    ) {
        return Promise.resolve();
    }

    const link =
        document.getElementById(
            'dynamic-theme-css'
        );

    if (
        !link ||
        link.sheet
    ) {
        return new Promise(
            resolve =>
                requestAnimationFrame(
                    () =>
                        requestAnimationFrame(
                            resolve
                        )
                )
        );
    }

    return new Promise(
        resolve => {
            let finished =
                false;

            const done =
                () => {
                    if (finished) {
                        return;
                    }

                    finished =
                        true;

                    resolve();
                };

            link.addEventListener(
                'load',
                done,
                {
                    once: true
                }
            );

            setTimeout(
                done,
                700
            );
        }
    );
}

function validateThemeBuilderBeforeSaveV25(
    modal
) {
    if (
        getThemeAudioMode(
            modal
        ) !==
        'segment'
    ) {
        return true;
    }

    const startText =
        modal
            .querySelector(
                '.theme-builder-audio-start'
            )
            ?.value;

    const endText =
        modal
            .querySelector(
                '.theme-builder-audio-end'
            )
            ?.value;

    if (
        !isValidThemeTimecode(
            startText
        ) ||
        !isValidThemeTimecode(
            endText
        )
    ) {
        showFeatureToast(
            'Use the 00:00 format for the audio start and end.'
        );

        return false;
    }

    if (
        parseThemeTimecode(
            endText
        ) <=
        parseThemeTimecode(
            startText
        )
    ) {
        showFeatureToast(
            'The audio end time has to be after the start time.'
        );

        return false;
    }

    return true;
}

async function saveThemeOverrideV25(
    modal
) {
    if (
        !validateThemeBuilderBeforeSaveV25(
            modal
        )
    ) {
        return;
    }

    const themeId =
        modal.dataset
            .themeBuilderEditingThemeV25;

    if (
        !themeId ||
        themeId ===
            'theme-custom-builder'
    ) {
        return;
    }

    const draft =
        getThemeBuilderDraft(
            modal
        );

    ensureThemeOverridesV25()[
        themeId
    ] = {
        ...draft
    };

    db.settings.theme =
        themeId;

    await saveDb();

    modal._themeEditSavedV25 =
        true;

    themeOverrideApplySuppressedV25 =
        false;

    await applyTheme(
        themeId,
        {
            persist:
                false
        }
    );

    if (dailyThemeSelect) {
        dailyThemeSelect.value =
            themeId;
    }

    themePickerSelected =
        themeId;

    renderThemePicker();

    modal.classList.add(
        'hidden'
    );

    dailySettingsModal?.classList.add(
        'hidden'
    );

    showFeatureToast(
        `Saved edits to “${draft.name || 'theme'}”.`
    );
}

async function restoreThemeAfterCanceledEditV25(
    modal
) {
    if (
        !modal ||
        modal._themeEditSavedV25 ||
        !modal.dataset
            .themeBuilderEditingThemeV25
    ) {
        return;
    }

    const previous =
        modal._themeEditPreviousThemeV25 ||
        db.settings.theme ||
        'default';

    modal.dataset
        .themeBuilderEditingThemeV25 =
        '';

    themeOverrideApplySuppressedV25 =
        false;

    await applyTheme(
        previous,
        {
            persist:
                false
        }
    );

    db.settings.theme =
        previous;

    if (dailyThemeSelect) {
        dailyThemeSelect.value =
            previous;
    }

    themePickerSelected =
        previous;
}

function bindThemeBuilderEditCancelV25(
    modal
) {
    if (
        modal.dataset
            .themeBuilderEditCancelBoundV25 ===
        'true'
    ) {
        return;
    }

    modal.dataset
        .themeBuilderEditCancelBoundV25 =
        'true';

    const closeButton =
        modal.querySelector(
            '.theme-builder-close'
        );

    closeButton?.addEventListener(
        'click',
        () => {
            // V195: let the modal disappear and paint before restoring the
            // previously selected theme. applyTheme() can do substantial
            // synchronous setup before its first await, which used to make the
            // X button feel frozen even though the close class was already set.
            requestAnimationFrame(() => {
                setTimeout(() => {
                    restoreThemeAfterCanceledEditV25(
                        modal
                    );
                }, 0);
            });
        }
    );

    modal.addEventListener(
        'pointerdown',
        event => {
            if (
                event.target ===
                modal
            ) {
                setTimeout(
                    () => {
                        if (
                            modal.classList.contains(
                                'hidden'
                            )
                        ) {
                            restoreThemeAfterCanceledEditV25(
                                modal
                            );
                        }
                    },
                    0
                );
            }
        }
    );
}

async function openAnyThemeInBuilderV25(
    themeId,
    themeName
) {
    if (
        themeId ===
        'theme-custom-builder'
    ) {
        openExistingCustomThemeFromPickerV7();
        return;
    }

    const modal =
        ensureThemeBuilderModal();

    const previousTheme =
        db.settings.theme ||
        'default';

    modal._themeEditPreviousThemeV25 =
        previousTheme;

    modal._themeEditSavedV25 =
        false;

    modal.dataset
        .themeBuilderEditingThemeV25 =
        themeId;

    modal.dataset
        .themeBuilderMode =
        'edit-existing-theme';

    bindThemeBuilderEditCancelV25(
        modal
    );

    // Load the original theme WITHOUT its saved Builder override so the
    // initial Builder values are based on the real theme itself.
    themeOverrideApplySuppressedV25 =
        true;

    await applyTheme(
        themeId,
        {
            persist:
                false
        }
    );

    await waitForThemeCssV25(
        themeId
    );

    const base =
        captureCurrentThemeBuilderBaseV25(
            themeId,
            themeName
        );

    const existingOverride =
        getThemeOverrideV25(
            themeId
        );

    const editTheme = {
        ...base,
        ...(existingOverride ||
            {}),
        name:
            existingOverride?.name ||
            themeName ||
            base.name
    };

    themeOverrideApplySuppressedV25 =
        false;

    // Restore the DB's actual selection while keeping the edit theme
    // visually loaded behind the Builder for its real-page clone.
    db.settings.theme =
        previousTheme;

    populateThemeBuilder(
        modal,
        editTheme
    );

    // V29: the old Reset button was intentionally removed in V28.
    // Built-in editing must not depend on that removed control.
    const legacyResetButtonV29 =
        modal.querySelector(
            '.theme-builder-reset'
        );

    if (legacyResetButtonV29) {
        legacyResetButtonV29.onclick =
            () => {
                populateThemeBuilder(
                    modal,
                    {
                        ...base,
                        name:
                            themeName ||
                            base.name
                    }
                );
            };
    }

    modal
        .querySelector(
            '.theme-builder-save'
        ).onclick =
        () =>
            saveThemeOverrideV25(
                modal
            );

    modal.classList.remove(
        'hidden'
    );

    requestAnimationFrame(
        () => {
            modal
                .querySelector(
                    '[data-theme-key="name"]'
                )
                ?.focus();
        }
    );
}

const applyThemeBeforeOverridesV25 =
    applyTheme;

applyTheme =
    async function(
        themeValue,
        opts = {}
    ) {
        await applyThemeBeforeOverridesV25(
            themeValue,
            opts
        );

        if (
            themeOverrideApplySuppressedV25 ||
            themeValue ===
                'theme-custom-builder'
        ) {
            return;
        }

        const override =
            getThemeOverrideV25(
                themeValue ||
                'default'
            );

        if (!override) {
            return;
        }

        // Keep the original theme CSS/JS mounted, then layer the Builder
        // variables/components on top of it.
        document.body.classList.add(
            'theme-custom-builder'
        );

        applyCustomBuiltTheme(
            override
        );

        if (
            typeof applyCursorChoice ===
            'function'
        ) {
            applyCursorChoice();
        }
    };

const createThemePickerCardBeforeEditAllV25 =
    createThemePickerCard;

createThemePickerCard =
    function(
        option
    ) {
        const card =
            createThemePickerCardBeforeEditAllV25(
                option
            );

        if (!card) {
            return card;
        }

        const themeId =
            option.value;

        const getDisplayName =
            () =>
                getThemeOverrideV25(
                    themeId
                )?.name ||
                option.textContent.trim();

        const nameNode =
            card.querySelector(
                '.theme-picker-name'
            );

        if (
            nameNode &&
            themeId !==
                'theme-custom-builder'
        ) {
            nameNode.textContent =
                getDisplayName();

            card.dataset.themeName =
                getDisplayName();
        }

        const hint =
            card.querySelector(
                '.theme-picker-hint'
            );

        if (hint) {
            hint.textContent =
                themeId ===
                    'default'
                    ? 'Click to apply · Right-click to edit'
                    : 'Click to apply · Right-click for options';
        }

        // Capture phase intentionally replaces older delete-only context menus.
        card.addEventListener(
            'contextmenu',
            event => {
                event.preventDefault();
                event.stopImmediatePropagation();

                const actions = [
                    {
                        label:
                            'Edit Theme',
                        icon:
                            'ph-pencil-simple',
                        action:
                            () =>
                                openAnyThemeInBuilderV25(
                                    themeId,
                                    getDisplayName()
                                )
                    }
                ];

                if (
                    themeId !==
                    'default'
                ) {
                    actions.push({
                        label:
                            'Delete Theme',
                        icon:
                            'ph-trash',
                        danger:
                            true,
                        action:
                            () =>
                                deleteThemeFromPickerV2(
                                    themeId,
                                    getDisplayName()
                                )
                    });
                }

                showCustomItemContextMenu(
                    event.clientX,
                    event.clientY,
                    actions
                );
            },
            {
                capture:
                    true
            }
        );

        return card;
    };

const renderThemePickerBeforeEditAllV25 =
    renderThemePicker;

renderThemePicker =
    function() {
        ensureThemeOverridesV25();

        renderThemePickerBeforeEditAllV25();

        // Preserve V24's ordering rule after applying edited display names.
        moveCustomThemeCardsToEndV24();
    };



// ============================================================
// THEME BUILDER V26 — FINAL BACK-BUTTON TRANSPARENCY
// + REFERENCE-STYLE SVG COMPOSITIONS + OVERLAP CONTROL
// ============================================================

const CUSTOM_THEME_V26_DEFAULTS = {
    svgAllowOverlap: false
};

// ------------------------------------------------------------
// BACK ARROWS: NEVER A FILLED / OPAQUE BUTTON
// ------------------------------------------------------------

function getBackButtonTargetV26(
    element
) {
    if (
        !element ||
        typeof element.closest !==
            'function'
    ) {
        return null;
    }

    return element.closest(
        [
            '.header-back-btn',
            '.custom-tab-back-btn',
            'button[id*="back" i]',
            'button[class*="back-btn" i]',
            'button[aria-label*="back" i]',
            'button[title*="back" i]',
            '[data-preview-original-id*="back" i]',
            '[data-preview-original-id="close-tools-btn"]',
            '[data-preview-original-id="close-phrases-btn"]',
            '[data-preview-original-id="close-quizzes-btn"]',
            '[data-preview-original-id="fc-prev"]',
            '#close-tools-btn',
            '#close-phrases-btn',
            '#close-quizzes-btn',
            '#fc-prev'
        ].join(',')
    );
}

function forceBackButtonTransparentV26(
    button
) {
    if (!button) {
        return;
    }

    [
        'background',
        'background-color',
        'background-image',
        'box-shadow',
        'filter',
        'backdrop-filter',
        '-webkit-backdrop-filter',
        'outline'
    ].forEach(
        property => {
            button.style.setProperty(
                property,
                property ===
                    'outline'
                    ? 'none'
                    : property.includes(
                        'filter'
                    )
                        ? 'none'
                        : property ===
                            'box-shadow'
                            ? 'none'
                            : property ===
                                'background-image'
                                ? 'none'
                                : 'transparent',
                'important'
            );
        }
    );

    button.style.setProperty(
        'border-color',
        'transparent',
        'important'
    );
}

function forceAllBackButtonsTransparentV26(
    root =
        document
) {
    root
        .querySelectorAll?.(
            [
                '.header-back-btn',
                '.custom-tab-back-btn',
                'button[id*="back" i]',
                'button[class*="back-btn" i]',
                'button[aria-label*="back" i]',
                'button[title*="back" i]',
                '[data-preview-original-id*="back" i]',
                '[data-preview-original-id="close-tools-btn"]',
                '[data-preview-original-id="close-phrases-btn"]',
                '[data-preview-original-id="close-quizzes-btn"]',
                '[data-preview-original-id="fc-prev"]',
                '#close-tools-btn',
                '#close-phrases-btn',
                '#close-quizzes-btn',
                '#fc-prev'
            ].join(',')
        )
        .forEach(
            forceBackButtonTransparentV26
        );
}

[
    'pointerover',
    'pointerenter',
    'focusin',
    'mousedown',
    'touchstart'
].forEach(
    eventName => {
        document.addEventListener(
            eventName,
            event => {
                const button =
                    getBackButtonTargetV26(
                        event.target
                    );

                if (button) {
                    forceBackButtonTransparentV26(
                        button
                    );
                }
            },
            true
        );
    }
);

const backButtonObserverV26 =
    new MutationObserver(
        records => {
            records.forEach(
                record => {
                    record.addedNodes
                        .forEach(
                            node => {
                                if (
                                    node.nodeType !==
                                    1
                                ) {
                                    return;
                                }

                                const button =
                                    getBackButtonTargetV26(
                                        node
                                    );

                                if (button) {
                                    forceBackButtonTransparentV26(
                                        button
                                    );
                                }

                                forceAllBackButtonsTransparentV26(
                                    node
                                );
                            }
                        );
                }
            );
        }
    );

if (
    document.documentElement
) {
    backButtonObserverV26.observe(
        document.documentElement,
        {
            childList:
                true,
            subtree:
                true
        }
    );
}

requestAnimationFrame(
    () =>
        forceAllBackButtonsTransparentV26()
);

// ------------------------------------------------------------
// SVG PLACEMENT UI
// ------------------------------------------------------------

function normalizeSvgPlacementModeV26(
    value
) {
    const legacyMap = {
        random:
            'balanced-spread',
        'wide-random':
            'random-safe',
        'center-cluster':
            'mixed-scene',
        corners:
            'corner-garden',
        'side-fixed':
            'winter-sides',
        'side-random':
            'random-edges-safe',
        'top-bottom':
            'snoopy-frame',
        'all-edges-random':
            'random-edges-safe',
        lanes:
            'winx-stage',
        columns:
            'winx-stage'
    };

    const normalized =
        legacyMap[
            value
        ] ||
        value;

    return [
        'balanced-spread',
        'snoopy-frame',
        'winter-sides',
        'winx-stage',
        'corner-garden',
        'mixed-scene',
        'random-safe',
        'random-edges-safe'
    ].includes(
        normalized
    )
        ? normalized
        : 'balanced-spread';
}

function ensureThemeBuilderPlacementUiV26(
    modal,
    theme = {}
) {
    const select =
        modal.querySelector(
            '.theme-builder-svg-distribution'
        );

    if (!select) {
        return;
    }

    const field =
        select.closest(
            '.theme-builder-field'
        );

    const title =
        field?.querySelector(
            ':scope > span'
        );

    if (title) {
        title.textContent =
            'Decoration Placement';
    }

    const current =
        normalizeSvgPlacementModeV26(
            theme.svgDistribution ||
            select.value
        );

    select.innerHTML = `
        <option value="balanced-spread">
            Balanced scatter · spacious
        </option>

        <option value="snoopy-frame">
            Snoopy-style frame
        </option>

        <option value="winter-sides">
            Winter-style side framing
        </option>

        <option value="winx-stage">
            Winx-style spread
        </option>

        <option value="corner-garden">
            Corners + edge accents
        </option>

        <option value="mixed-scene">
            Mixed scene · edges + center
        </option>

        <option value="random-safe">
            Random scatter · rerolls
        </option>

        <option value="random-edges-safe">
            Random edges · rerolls
        </option>
    `;

    select.value =
        current;

    let overlapRow =
        modal.querySelector(
            '.theme-builder-svg-overlap-row-v26'
        );

    if (!overlapRow) {
        const holder =
            document.createElement(
                'div'
            );

        holder.innerHTML =
            themeBuilderToggleRowV4({
                className:
                    'theme-builder-svg-overlap-row-v26',
                title:
                    'Allow SVG Overlap',
                detail:
                    'Off keeps stickers separated. On allows stickers to cross over each other.',
                checked:
                    !!theme.svgAllowOverlap
            });

        overlapRow =
            holder.firstElementChild;

        field?.insertAdjacentElement(
            'afterend',
            overlapRow
        );
    }

    const overlapInput =
        overlapRow.querySelector(
            'input'
        );

    overlapInput.classList.add(
        'theme-builder-svg-overlap-enabled-v26'
    );

    overlapInput.checked =
        !!theme.svgAllowOverlap;

    if (
        overlapInput.dataset
            .themeBuilderV26Bound !==
        'true'
    ) {
        overlapInput.dataset
            .themeBuilderV26Bound =
            'true';

        overlapInput.addEventListener(
            'change',
            () => {
                modal._themePreviewDistributionSeedV10 =
                    Math.random() *
                    100000;

                updateThemeBuilderPreview(
                    modal
                );
            }
        );
    }

    if (
        select.dataset
            .themeBuilderPlacementV26 !==
        'true'
    ) {
        select.dataset
            .themeBuilderPlacementV26 =
            'true';

        select.addEventListener(
            'change',
            () => {
                modal._themePreviewDistributionSeedV10 =
                    Math.random() *
                    100000;

                updateThemeBuilderPreview(
                    modal
                );
            }
        );
    }
}

const getThemeBuilderDraftBeforeV26 =
    getThemeBuilderDraft;

getThemeBuilderDraft =
    function(
        modal
    ) {
        const draft = {
            ...CUSTOM_THEME_V26_DEFAULTS,
            ...getThemeBuilderDraftBeforeV26(
                modal
            )
        };

        const select =
            modal?.querySelector(
                '.theme-builder-svg-distribution'
            );

        if (select) {
            draft.svgDistribution =
                normalizeSvgPlacementModeV26(
                    select.value
                );
        }

        draft.svgAllowOverlap =
            !!modal
                ?.querySelector(
                    '.theme-builder-svg-overlap-enabled-v26'
                )
                ?.checked;

        return draft;
    };

// ------------------------------------------------------------
// REFERENCE-STYLE PLACEMENT ENGINE
// ------------------------------------------------------------

function placementRandomV26(
    seed,
    index,
    salt
) {
    if (
        Number.isFinite(
            seed
        )
    ) {
        return themePreviewRandomV20(
            seed,
            index,
            salt
        );
    }

    return Math.random();
}

function jitterPointV26(
    point,
    amount,
    rand,
    index
) {
    return {
        x:
            point[0] +
            (
                rand(
                    index,
                    71
                ) -
                .5
            ) *
                amount,
        y:
            point[1] +
            (
                rand(
                    index,
                    79
                ) -
                .5
            ) *
                amount
    };
}

function clampPlacementPointV26(
    point
) {
    return {
        x:
            Math.max(
                6,
                Math.min(
                    94,
                    point.x
                )
            ),
        y:
            Math.max(
                10,
                Math.min(
                    92,
                    point.y
                )
            )
    };
}

function shufflePlacementPointsV26(
    points,
    rand
) {
    const result =
        points.map(
            point => ({
                ...point
            })
        );

    for (
        let index =
            result.length -
                1;
        index >
            0;
        index--
    ) {
        const swap =
            Math.floor(
                rand(
                    index,
                    101
                ) *
                (
                    index +
                    1
                )
            );

        [
            result[index],
            result[swap]
        ] = [
            result[swap],
            result[index]
        ];
    }

    return result;
}

function makeReferenceCandidatesV26(
    mode,
    count,
    rand
) {
    // Snoopy reference: a loose frame around the page with many positions
    // down both sides and a few top/bottom accents.
    const snoopy = [
        [7,16],[8,28],[8,42],[9,57],[10,72],[12,87],
        [20,21],[19,38],[20,58],[23,86],
        [93,16],[92,30],[92,45],[91,61],[89,78],[87,88],
        [81,21],[82,41],[80,62],[78,87],
        [32,89],[51,91],[70,89],[50,18]
    ];

    // Winter reference: asymmetric left/right framing plus a lower-center
    // accent, deliberately avoiding the central title/control region.
    const winter = [
        [9,23],[21,40],[10,65],[22,83],
        [91,22],[79,40],[90,64],[78,83],
        [50,87],[34,88],[66,88]
    ];

    // Winx reference: generous horizontal/vertical separation with slight
    // imperfections instead of perfect lanes.
    const winx = [
        [9,31],[32,32],[68,32],[91,31],
        [9,57],[32,58],[68,58],[91,57],
        [11,82],[37,83],[63,83],[89,82]
    ];

    const corners = [
        [11,18],[25,16],[13,32],
        [89,18],[75,16],[87,32],
        [12,83],[27,87],[15,69],
        [88,83],[73,87],[85,69],
        [50,88],[50,17]
    ];

    const mixed = [
        [10,24],[25,19],[43,27],[67,20],[89,28],
        [17,51],[48,48],[81,51],
        [10,77],[31,82],[60,76],[88,80],
        [24,65],[72,62]
    ];

    let base;

    if (
        mode ===
        'snoopy-frame'
    ) {
        base =
            snoopy;
    } else if (
        mode ===
        'winter-sides'
    ) {
        base =
            winter;
    } else if (
        mode ===
        'winx-stage'
    ) {
        base =
            winx;
    } else if (
        mode ===
        'corner-garden'
    ) {
        base =
            corners;
    } else if (
        mode ===
        'mixed-scene'
    ) {
        base =
            mixed;
    } else {
        base =
            [];
    }

    const candidates = [];

    base.forEach(
        (
            point,
            index
        ) => {
            candidates.push(
                clampPlacementPointV26(
                    jitterPointV26(
                        point,
                        mode ===
                            'winx-stage'
                            ? 2.1
                            : 3.4,
                        rand,
                        index
                    )
                )
            );
        }
    );

    // If there are more SVGs than reference slots, add many compatible
    // candidates instead of recycling a slot and stacking stickers.
    const extraCount =
        Math.max(
            90,
            count *
                12
        );

    for (
        let index =
            0;
        index <
            extraCount;
        index++
    ) {
        const a =
            rand(
                index,
                131
            );

        const b =
            rand(
                index,
                137
            );

        let point;

        if (
            mode ===
                'snoopy-frame'
        ) {
            const edge =
                Math.floor(
                    a *
                    4
                );

            if (
                edge ===
                    0
            ) {
                point = {
                    x:
                        7 +
                        b *
                            16,
                    y:
                        16 +
                        rand(
                            index,
                            139
                        ) *
                            72
                };
            } else if (
                edge ===
                    1
            ) {
                point = {
                    x:
                        77 +
                        b *
                            16,
                    y:
                        16 +
                        rand(
                            index,
                            149
                        ) *
                            72
                };
            } else if (
                edge ===
                    2
            ) {
                point = {
                    x:
                        18 +
                        b *
                            64,
                    y:
                        15 +
                        rand(
                            index,
                            151
                        ) *
                            7
                };
            } else {
                point = {
                    x:
                        18 +
                        b *
                            64,
                    y:
                        83 +
                        rand(
                            index,
                            157
                        ) *
                            7
                };
            }
        } else if (
            mode ===
                'winter-sides'
        ) {
            const side =
                a <
                    .5;

            point = {
                x:
                    side
                        ? 8 +
                            b *
                                18
                        : 74 +
                            b *
                                18,
                y:
                    19 +
                    rand(
                        index,
                        163
                    ) *
                        68
            };
        } else if (
            mode ===
                'winx-stage'
        ) {
            const columns = [
                9,
                32,
                68,
                91
            ];

            const rows = [
                31,
                58,
                82
            ];

            point = {
                x:
                    columns[
                        index %
                        columns.length
                    ] +
                    (
                        b -
                        .5
                    ) *
                        3,
                y:
                    rows[
                        Math.floor(
                            index /
                            columns.length
                        ) %
                        rows.length
                    ] +
                    (
                        rand(
                            index,
                            167
                        ) -
                        .5
                    ) *
                        3
            };
        } else if (
            mode ===
                'corner-garden'
        ) {
            const quadrant =
                Math.floor(
                    a *
                    4
                );

            point = {
                x:
                    quadrant %
                        2 ===
                        0
                        ? 8 +
                            b *
                                25
                        : 67 +
                            b *
                                25,
                y:
                    quadrant <
                        2
                        ? 14 +
                            rand(
                                index,
                                173
                            ) *
                                25
                        : 64 +
                            rand(
                                index,
                                179
                            ) *
                                25
            };
        } else {
            point = {
                x:
                    9 +
                    b *
                        82,
                y:
                    16 +
                    rand(
                        index,
                        181
                    ) *
                        72
            };
        }

        candidates.push(
            clampPlacementPointV26(
                point
            )
        );
    }

    return candidates;
}

function makeRandomCandidatesV26(
    mode,
    count,
    rand
) {
    const candidates = [];

    const total =
        Math.max(
            240,
            count *
                28
        );

    for (
        let index =
            0;
        index <
            total;
        index++
    ) {
        if (
            mode ===
            'random-edges-safe'
        ) {
            const edge =
                Math.floor(
                    rand(
                        index,
                        191
                    ) *
                    4
                );

            const along =
                13 +
                rand(
                    index,
                    193
                ) *
                    74;

            if (
                edge ===
                    0
            ) {
                candidates.push({
                    x:
                        along,
                    y:
                        13 +
                        rand(
                            index,
                            197
                        ) *
                            8
                });
            } else if (
                edge ===
                    1
            ) {
                candidates.push({
                    x:
                        79 +
                        rand(
                            index,
                            199
                        ) *
                            12,
                    y:
                        along
                });
            } else if (
                edge ===
                    2
            ) {
                candidates.push({
                    x:
                        along,
                    y:
                        80 +
                        rand(
                            index,
                            211
                        ) *
                            10
                });
            } else {
                candidates.push({
                    x:
                        9 +
                        rand(
                            index,
                            223
                        ) *
                            12,
                    y:
                        along
                });
            }
        } else {
            candidates.push({
                x:
                    9 +
                    rand(
                        index,
                        227
                    ) *
                        82,
                y:
                    15 +
                    rand(
                        index,
                        229
                    ) *
                        74
            });
        }
    }

    return candidates.map(
        clampPlacementPointV26
    );
}

function makeBalancedCandidatesV26(
    count,
    rand
) {
    const candidates = [];

    const cols =
        Math.max(
            4,
            Math.ceil(
                Math.sqrt(
                    Math.max(
                        count,
                        8
                    ) *
                    1.55
                )
            )
        );

    const rows =
        Math.max(
            3,
            Math.ceil(
                Math.max(
                    count,
                    8
                ) /
                cols *
                1.45
            )
        );

    for (
        let row =
            0;
        row <
            rows;
        row++
    ) {
        for (
            let col =
                0;
            col <
                cols;
            col++
        ) {
            const index =
                row *
                    cols +
                col;

            const stagger =
                row %
                    2
                    ? .36
                    : 0;

            candidates.push({
                x:
                    10 +
                    (
                        col +
                        .5 +
                        stagger
                    ) /
                        (
                            cols +
                            .35
                        ) *
                        80 +
                    (
                        rand(
                            index,
                            233
                        ) -
                        .5
                    ) *
                        3.6,
                y:
                    15 +
                    (
                        row +
                        .5
                    ) /
                        rows *
                        73 +
                    (
                        rand(
                            index,
                            239
                        ) -
                        .5
                    ) *
                        4
            });
        }
    }

    // Add some irregular alternatives so the final result does not read as a grid.
    return candidates.concat(
        makeRandomCandidatesV26(
            'random-safe',
            count,
            rand
        ).slice(
            0,
            Math.max(
                80,
                count *
                    8
            )
        )
    );
}

function placementOverlapV26(
    a,
    b,
    scale
) {
    // The preview artwork is ~105px square on a 1280x760 logical canvas.
    // Use rectangular separation because equal percentage distance in X/Y
    // does not correspond to equal physical pixels.
    const neededX =
        8.9 *
        scale +
        1.8;

    const neededY =
        14.3 *
        scale +
        2.0;

    return (
        Math.abs(
            a.x -
            b.x
        ) <
            neededX &&
        Math.abs(
            a.y -
            b.y
        ) <
            neededY
    );
}

function placementDistanceV26(
    a,
    b
) {
    // Weight Y slightly less because the preview is wider than it is tall.
    const dx =
        a.x -
        b.x;

    const dy =
        (
            a.y -
            b.y
        ) *
        1.25;

    return (
        dx *
            dx +
        dy *
            dy
    );
}

function chooseSpreadPointsV26(
    candidates,
    count,
    {
        allowOverlap,
        scale,
        rand
    }
) {
    if (
        !count ||
        !candidates.length
    ) {
        return [];
    }

    const pool =
        shufflePlacementPointsV26(
            candidates,
            rand
        );

    if (allowOverlap) {
        return pool.slice(
            0,
            count
        );
    }

    const selected = [];

    // Begin away from the exact center so the composition does not clump
    // around the title/control region.
    let first =
        pool[0];

    let firstScore =
        -Infinity;

    pool.forEach(
        point => {
            const dx =
                point.x -
                50;

            const dy =
                point.y -
                50;

            const score =
                dx *
                    dx +
                dy *
                    dy *
                    .75;

            if (
                score >
                firstScore
            ) {
                first =
                    point;

                firstScore =
                    score;
            }
        }
    );

    selected.push(
        first
    );

    while (
        selected.length <
            count &&
        pool.length
    ) {
        let best =
            null;

        let bestScore =
            -Infinity;

        let foundCollisionFree =
            false;

        pool.forEach(
            point => {
                if (
                    selected.includes(
                        point
                    )
                ) {
                    return;
                }

                const collides =
                    selected.some(
                        chosen =>
                            placementOverlapV26(
                                point,
                                chosen,
                                scale
                            )
                    );

                const nearestDistance =
                    Math.min(
                        ...selected.map(
                            chosen =>
                                placementDistanceV26(
                                    point,
                                    chosen
                                )
                        )
                    );

                if (
                    !collides
                ) {
                    if (
                        !foundCollisionFree ||
                        nearestDistance >
                            bestScore
                    ) {
                        foundCollisionFree =
                            true;

                        best =
                            point;

                        bestScore =
                            nearestDistance;
                    }

                    return;
                }

                if (
                    !foundCollisionFree &&
                    nearestDistance >
                        bestScore
                ) {
                    best =
                        point;

                    bestScore =
                        nearestDistance;
                }
            }
        );

        if (!best) {
            break;
        }

        selected.push(
            best
        );
    }

    return selected;
}

function buildThemePlacementPointsV26(
    mode,
    count,
    {
        seed =
            null,
        allowOverlap =
            false,
        svgGlobalScale =
            100
    } = {}
) {
    const normalized =
        normalizeSvgPlacementModeV26(
            mode
        );

    const rand =
        (
            index,
            salt
        ) =>
            placementRandomV26(
                seed,
                index,
                salt
            );

    let candidates;

    if (
        normalized ===
            'balanced-spread'
    ) {
        candidates =
            makeBalancedCandidatesV26(
                count,
                rand
            );
    } else if (
        [
            'random-safe',
            'random-edges-safe'
        ].includes(
            normalized
        )
    ) {
        candidates =
            makeRandomCandidatesV26(
                normalized,
                count,
                rand
            );
    } else {
        candidates =
            makeReferenceCandidatesV26(
                normalized,
                count,
                rand
            );
    }

    return chooseSpreadPointsV26(
        candidates,
        count,
        {
            allowOverlap,
            scale:
                Math.max(
                    .5,
                    Math.min(
                        2.2,
                        (
                            Number(
                                svgGlobalScale
                            ) ||
                            100
                        ) /
                            100
                    )
                ),
            rand
        }
    );
}

function makePlacementEntriesV26(
    theme
) {
    return (
        theme.backgroundSvgs ||
        []
    ).map(
        (
            svg,
            originalIndex
        ) => ({
            // V373: every historical renderer receives the same effective
            // animation identity. Explicit per-decoration override wins; then
            // the saved theme Default Animation; `svg.animation` is legacy only.
            svg:
                ensureSvgAdvancedDefaultsV10({
                    ...svg,
                    animation: String(
                        svg?.animationOverride ||
                        theme?.svgDefaultAnimation ||
                        svg?.animation ||
                        'float'
                    ).trim() || 'float'
                }),
            originalIndex
        })
    );
}

getPreviewSvgAssignmentsV10 =
    function(
        modal,
        draft
    ) {
        if (
            !Number.isFinite(
                modal._themePreviewDistributionSeedV10
            )
        ) {
            modal._themePreviewDistributionSeedV10 =
                Math.random() *
                100000;
        }

        const entries =
            makePlacementEntriesV26(
                draft
            );

        const points =
            buildThemePlacementPointsV26(
                draft.svgDistribution,
                entries.length,
                {
                    seed:
                        modal
                            ._themePreviewDistributionSeedV10,
                    allowOverlap:
                        !!draft
                            .svgAllowOverlap,
                    svgGlobalScale:
                        draft
                            .svgGlobalScale
                }
            );

        return entries.map(
            (
                entry,
                index
            ) => ({
                ...entry,
                left:
                    points[
                        index
                    ]?.x ??
                    50,
                top:
                    points[
                        index
                    ]?.y ??
                    50
            })
        );
    };

getRuntimeSvgAssignmentsV10 =
    function(
        theme
    ) {
        const entries =
            makePlacementEntriesV26(
                theme
            );

        const points =
            buildThemePlacementPointsV26(
                theme.svgDistribution,
                entries.length,
                {
                    seed:
                        null,
                    allowOverlap:
                        !!theme
                            .svgAllowOverlap,
                    svgGlobalScale:
                        theme
                            .svgGlobalScale
                }
            );

        return entries.map(
            (
                entry,
                index
            ) => ({
                ...entry,
                left:
                    points[
                        index
                    ]?.x ??
                    50,
                top:
                    points[
                        index
                    ]?.y ??
                    50
            })
        );
    };

// ------------------------------------------------------------
// FINAL BUILDER / THEME WIRING
// ------------------------------------------------------------

const populateThemeBuilderBeforeV26 =
    populateThemeBuilder;

populateThemeBuilder =
    function(
        modal,
        theme
    ) {
        const merged = {
            ...CUSTOM_THEME_V26_DEFAULTS,
            ...(theme ||
                {})
        };

        merged.svgDistribution =
            normalizeSvgPlacementModeV26(
                merged.svgDistribution
            );

        populateThemeBuilderBeforeV26(
            modal,
            merged
        );

        ensureThemeBuilderPlacementUiV26(
            modal,
            merged
        );

        updateThemeBuilderPreview(
            modal
        );

        forceAllBackButtonsTransparentV26(
            modal
        );
    };

const applyThemeBuilderDraftToActualPreviewBeforeV26 =
    applyThemeBuilderDraftToActualPreviewV5;

applyThemeBuilderDraftToActualPreviewV5 =
    function(
        modal
    ) {
        applyThemeBuilderDraftToActualPreviewBeforeV26(
            modal
        );

        forceAllBackButtonsTransparentV26(
            modal
        );
    };

const rebuildActualThemeBuilderPreviewBeforeV26 =
    rebuildActualThemeBuilderPreviewV5;

rebuildActualThemeBuilderPreviewV5 =
    function(
        modal
    ) {
        rebuildActualThemeBuilderPreviewBeforeV26(
            modal
        );

        forceAllBackButtonsTransparentV26(
            modal
        );

        requestAnimationFrame(
            () => {
                forceAllBackButtonsTransparentV26(
                    modal
                );

                fitActualThemeBuilderPreviewV9(
                    modal
                );
            }
        );
    };

const applyThemeBeforeV26 =
    applyTheme;

applyTheme =
    async function(
        themeValue,
        opts = {}
    ) {
        await applyThemeBeforeV26(
            themeValue,
            opts
        );

        forceAllBackButtonsTransparentV26();

        requestAnimationFrame(
            () =>
                forceAllBackButtonsTransparentV26()
        );

        setTimeout(
            () =>
                forceAllBackButtonsTransparentV26(),
            120
        );
    };



// ============================================================
// THEME BUILDER V27 — TRUE "RESTORE ORIGINAL THEME"
// The existing Reset button only resets the fields inside the editor.
// This button removes the saved per-theme override completely so the
// built-in theme returns to its untouched original CSS/JS behavior.
// ============================================================

function removeRestoreOriginalButtonV27(
    modal
) {
    modal
        ?.querySelector(
            '.theme-builder-restore-original-v27'
        )
        ?.remove();
}

function ensureRestoreOriginalButtonV27(
    modal,
    themeId,
    themeName
) {
    if (
        !modal ||
        !themeId ||
        themeId ===
            'theme-custom-builder'
    ) {
        removeRestoreOriginalButtonV27(
            modal
        );

        return;
    }

    const actions =
        modal.querySelector(
            '.theme-builder-actions'
        );

    if (!actions) {
        return;
    }

    let button =
        actions.querySelector(
            '.theme-builder-restore-original-v27'
        );

    if (!button) {
        button =
            document.createElement(
                'button'
            );

        button.type =
            'button';

        button.className =
            'icon-btn theme-builder-restore-original-v27';

        button.innerHTML = `
            <i class="ph ph-arrow-u-up-left"></i>
            Restore Original Theme
        `;

        const saveButton =
            actions.querySelector(
                '.theme-builder-save'
            );

        if (saveButton) {
            actions.insertBefore(
                button,
                saveButton
            );
        } else {
            actions.appendChild(
                button
            );
        }
    }

    const overrides =
        ensureThemeOverridesV25();

    const hasOverride =
        !!overrides[
            themeId
        ];

    button.disabled =
        !hasOverride;

    button.title =
        hasOverride
            ? `Remove your edits and restore the original ${themeName || 'theme'}.`
            : 'This theme is already using its original version.';

    button.onclick =
        async () => {
            const currentOverrides =
                ensureThemeOverridesV25();

            if (
                !currentOverrides[
                    themeId
                ]
            ) {
                showFeatureToast(
                    'This theme is already using its original version.'
                );

                return;
            }

            const confirmed =
                await showAppConfirm({
                    title:
                        'Restore the original theme?',
                    message:
                        `This removes all Theme Builder edits you saved for “${themeName || themeId}” and restores its original built-in CSS, JavaScript, colors, artwork, and behavior.`,
                    confirmLabel:
                        'Restore Original'
                });

            if (!confirmed) {
                return;
            }

            delete currentOverrides[
                themeId
            ];

            db.settings.theme =
                themeId;

            await saveDb();

            modal._themeEditSavedV25 =
                true;

            modal.dataset
                .themeBuilderEditingThemeV25 =
                '';

            themeOverrideApplySuppressedV25 =
                false;

            await applyTheme(
                themeId,
                {
                    persist:
                        false
                }
            );

            if (dailyThemeSelect) {
                dailyThemeSelect.value =
                    themeId;
            }

            themePickerSelected =
                themeId;

            renderThemePicker();

            modal.classList.add(
                'hidden'
            );

            dailySettingsModal
                ?.classList.add(
                    'hidden'
                );

            showFeatureToast(
                `Restored the original “${themeName || themeId}” theme.`
            );
        };
}

const openAnyThemeInBuilderBeforeV27 =
    openAnyThemeInBuilderV25;

openAnyThemeInBuilderV25 =
    async function(
        themeId,
        themeName
    ) {
        await openAnyThemeInBuilderBeforeV27(
            themeId,
            themeName
        );

        const modal =
            document.getElementById(
                'theme-builder-modal'
            );

        ensureRestoreOriginalButtonV27(
            modal,
            themeId,
            themeName
        );
    };

// Make sure the restore button never leaks into Create Custom Theme mode.
const openNewCustomThemeFromPickerBeforeV27 =
    openNewCustomThemeFromPickerV7;

openNewCustomThemeFromPickerV7 =
    function() {
        openNewCustomThemeFromPickerBeforeV27();

        removeRestoreOriginalButtonV27(
            document.getElementById(
                'theme-builder-modal'
            )
        );
    };

const openExistingCustomThemeFromPickerBeforeV27 =
    openExistingCustomThemeFromPickerV7;

openExistingCustomThemeFromPickerV7 =
    function() {
        openExistingCustomThemeFromPickerBeforeV27();

        removeRestoreOriginalButtonV27(
            document.getElementById(
                'theme-builder-modal'
            )
        );
    };



// ============================================================
// THEME BUILDER V28 — REMOVE OLD RESET BUTTON
// Custom themes no longer show Reset.
// Built-in themes only show the V27 "Restore Original Theme" action.
// ============================================================

function removeLegacyThemeBuilderResetV28(
    modal
) {
    modal
        ?.querySelectorAll(
            '.theme-builder-reset'
        )
        .forEach(
            button =>
                button.remove()
        );
}

const ensureThemeBuilderModalBeforeV28 =
    ensureThemeBuilderModal;

ensureThemeBuilderModal =
    function() {
        const modal =
            ensureThemeBuilderModalBeforeV28();

        removeLegacyThemeBuilderResetV28(
            modal
        );

        return modal;
    };

const openNewCustomThemeFromPickerBeforeV28 =
    openNewCustomThemeFromPickerV7;

openNewCustomThemeFromPickerV7 =
    function() {
        openNewCustomThemeFromPickerBeforeV28();

        removeLegacyThemeBuilderResetV28(
            document.getElementById(
                'theme-builder-modal'
            )
        );
    };

const openExistingCustomThemeFromPickerBeforeV28 =
    openExistingCustomThemeFromPickerV7;

openExistingCustomThemeFromPickerV7 =
    function() {
        openExistingCustomThemeFromPickerBeforeV28();

        removeLegacyThemeBuilderResetV28(
            document.getElementById(
                'theme-builder-modal'
            )
        );
    };

const openAnyThemeInBuilderBeforeV28 =
    openAnyThemeInBuilderV25;

openAnyThemeInBuilderV25 =
    async function(
        themeId,
        themeName
    ) {
        await openAnyThemeInBuilderBeforeV28(
            themeId,
            themeName
        );

        const modal =
            document.getElementById(
                'theme-builder-modal'
            );

        removeLegacyThemeBuilderResetV28(
            modal
        );

        // Built-ins keep only the true restore action from V27.
        ensureRestoreOriginalButtonV27(
            modal,
            themeId,
            themeName
        );
    };

requestAnimationFrame(
    () =>
        removeLegacyThemeBuilderResetV28(
            document.getElementById(
                'theme-builder-modal'
            )
        )
);



// ============================================================
// THEME BUILDER V29 — BUILT-IN EDIT OPEN FIX
// V28 removed the legacy Reset control. V25's built-in edit path still
// assumed it existed and crashed after applying the selected theme.
// This final guard also guarantees the modal is opened after editing.
// ============================================================

const openAnyThemeInBuilderBeforeV29 =
    openAnyThemeInBuilderV25;

openAnyThemeInBuilderV25 =
    async function(
        themeId,
        themeName
    ) {
        try {
            await openAnyThemeInBuilderBeforeV29(
                themeId,
                themeName
            );
        } catch (error) {
            themeOverrideApplySuppressedV25 =
                false;

            console.error(
                'Could not open theme for editing:',
                error
            );

            showFeatureToast(
                'Could not open that theme in Theme Builder.'
            );

            return;
        }

        const modal =
            document.getElementById(
                'theme-builder-modal'
            );

        if (!modal) {
            return;
        }

        removeLegacyThemeBuilderResetV28(
            modal
        );

        ensureRestoreOriginalButtonV27(
            modal,
            themeId,
            themeName
        );

        modal.classList.remove(
            'hidden'
        );
    };



// ============================================================

// Intro-audio runtime ownership moved to template-extras-2.js.

// ============================================================================
// V443 — LEGACY APPLIED-LOG AUDIO CALLS ROUTE TO THE ONE V443 OWNER.
// Historical visual wrappers may still call playCustomThemeIntroAudioV2(), but
// ordinary calls never create or restart an Audio element mid-apply.
// ============================================================================
(() => {
    'use strict';
    const legacyAdapterV443 = function(_theme = {}, options = {}) {
        const owner = window.__loggyLogIntroAudioV443;
        if (!owner) return null;
        if (options?.forceRestart === true || options?.__loggyCoreRestartV428 === true) {
            return owner.playTheme?.(owner.currentThemeId?.() || '', {
                reason: 'legacy-explicit-replay-v443',
                force: true
            }) || null;
        }
        return owner.audio || null;
    };
    legacyAdapterV443.__loggyV443Adapter = true;
    try { playCustomThemeIntroAudioV2 = legacyAdapterV443; } catch (_) {}
    try { window.playCustomThemeIntroAudioV2 = legacyAdapterV443; } catch (_) {}
})();
