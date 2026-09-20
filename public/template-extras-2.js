// THEME BUILDER V30
// - Built-in themes preview their REAL background/decoration layer
// - Built-in SVG/audio assets are discovered and surfaced in the Builder
// - Transparent computed backgrounds no longer become black
// - Theme gallery can duplicate ANY theme
// - Duplicates are real independent theme entries and stay at the bottom
// ============================================================

// ------------------------------------------------------------
// FIX: transparent computed backgrounds must never become #000000.
// ------------------------------------------------------------

const parseThemeCssColorBeforeV30 =
    parseThemeCssColorV25;

parseThemeCssColorV25 =
    function(
        value,
        fallback
    ) {
        const text =
            String(
                value ||
                ''
            )
                .trim();

        const rgba =
            text.match(
                /rgba\(\s*[\d.]+\s*,\s*[\d.]+\s*,\s*[\d.]+\s*,\s*([\d.]+)\s*\)/i
            );

        if (
            rgba &&
            Number(
                rgba[1]
            ) <=
                .03
        ) {
            return fallback;
        }

        if (
            text ===
            'transparent'
        ) {
            return fallback;
        }

        return parseThemeCssColorBeforeV30(
            value,
            fallback
        );
    };

// ------------------------------------------------------------
// BUILT-IN SOURCE / RUNTIME INSPECTION
// ------------------------------------------------------------

function getBuiltInThemeNameV30(
    themeId
) {
    return String(
        themeId ||
        ''
    )
        .replace(
            /^theme-/,
            ''
        )
        .trim();
}

function isBuiltInThemeIdV30(
    themeId
) {
    return (
        !!themeId &&
        themeId !==
            'theme-custom-builder' &&
        !String(
            themeId
        ).startsWith(
            'theme-custom-builder-'
        )
    );
}

function getBuiltInThemeRootsV30(
    themeId
) {
    const name =
        getBuiltInThemeNameV30(
            themeId
        );

    if (!name) {
        return [];
    }

    const exactIds =
        new Set([
            `${name}-background`,
            `${name}-theme-background`,
            `theme-${name}-background`,
            `${name}-scene`,
            `${name}-stage`,
            `${name}-decor`
        ]);

    const candidates =
        Array.from(
            document.body
                ?.children ||
                []
        )
            .filter(
                element => {
                    if (
                        element.id ===
                            'theme-builder-modal' ||
                        element.id ===
                            'custom-theme-background-stage'
                    ) {
                        return false;
                    }

                    const id =
                        String(
                            element.id ||
                            ''
                        )
                            .toLowerCase();

                    const classes =
                        String(
                            element.className ||
                            ''
                        )
                            .toLowerCase();

                    if (
                        exactIds.has(
                            id
                        )
                    ) {
                        return true;
                    }

                    if (
                        id.includes(
                            name.toLowerCase()
                        ) &&
                        /(background|scene|stage|decor|particles|art)/.test(
                            id
                        )
                    ) {
                        return true;
                    }

                    if (
                        classes.includes(
                            name.toLowerCase()
                        ) &&
                        /(background|scene|stage|decor|particles|art)/.test(
                            classes
                        )
                    ) {
                        return true;
                    }

                    return false;
                }
            );

    if (
        candidates.length
    ) {
        return candidates;
    }

    // Most hand-built themes use a single direct-child *-background root.
    // At this point the previous theme module has already been unmounted,
    // so a remaining background root is a safe fallback.
    return Array.from(
        document.body
            ?.children ||
            []
    )
        .filter(
            element => {
                const id =
                    String(
                        element.id ||
                        ''
                    )
                        .toLowerCase();

                return (
                    id.endsWith(
                        '-background'
                    ) &&
                    id !==
                        'custom-theme-background-stage'
                );
            }
        );
}

function serializeThemeRootV30(
    root
) {
    const clone =
        root.cloneNode(
            true
        );

    // cloneNode does not copy a canvas bitmap. Preserve canvas-based
    // decorations as images when possible.
    const originals =
        Array.from(
            root.querySelectorAll(
                'canvas'
            )
        );

    const clones =
        Array.from(
            clone.querySelectorAll(
                'canvas'
            )
        );

    originals.forEach(
        (
            canvas,
            index
        ) => {
            const target =
                clones[index];

            if (!target) {
                return;
            }

            try {
                const image =
                    document.createElement(
                        'img'
                    );

                image.src =
                    canvas.toDataURL(
                        'image/png'
                    );

                image.alt =
                    '';

                image.style.cssText =
                    target.getAttribute(
                        'style'
                    ) ||
                    '';

                image.className =
                    target.className ||
                    '';

                target.replaceWith(
                    image
                );
            } catch {}
        }
    );

    clone
        .querySelectorAll(
            'audio, video'
        )
        .forEach(
            element =>
                element.remove()
        );

    return clone.outerHTML;
}

function captureBuiltInRuntimeSnapshotV30(
    themeId
) {
    const bodyStyle =
        getComputedStyle(
            document.body
        );

    const roots =
        getBuiltInThemeRootsV30(
            themeId
        );

    return {
        themeId,

        background:
            bodyStyle.background,

        backgroundColor:
            bodyStyle.backgroundColor,

        backgroundImage:
            bodyStyle.backgroundImage,

        roots:
            roots.map(
                serializeThemeRootV30
            )
    };
}

function themeAssetFileNameV30(
    url,
    fallback =
        'Theme Asset'
) {
    try {
        const pathname =
            new URL(
                url,
                location.href
            ).pathname;

        return decodeURIComponent(
            pathname
                .split('/')
                .pop() ||
                fallback
        );
    } catch {
        return fallback;
    }
}

function uniqueThemeAssetsV30(
    assets
) {
    const seen =
        new Set();

    return (
        assets ||
        []
    ).filter(
        asset => {
            const key =
                String(
                    asset?.url ||
                    asset?.markup ||
                    asset?.name ||
                    ''
                );

            if (
                !key ||
                seen.has(
                    key
                )
            ) {
                return false;
            }

            seen.add(
                key
            );

            return true;
        }
    );
}

function collectRuntimeSvgAssetsV30(
    roots
) {
    const assets =
        [];

    (
        roots ||
        []
    ).forEach(
        root => {
            root
                .querySelectorAll(
                    'img[src], object[data]'
                )
                .forEach(
                    element => {
                        const source =
                            element.getAttribute(
                                'src'
                            ) ||
                            element.getAttribute(
                                'data'
                            ) ||
                            '';

                        if (
                            !/\.svg(?:$|[?#])/i.test(
                                source
                            )
                        ) {
                            return;
                        }

                        const absolute =
                            new URL(
                                source,
                                location.href
                            );

                        assets.push({
                            name:
                                themeAssetFileNameV30(
                                    absolute.href
                                ),
                            url:
                                absolute.pathname +
                                absolute.search,
                            animation:
                                'float',
                            introBop:
                                true,
                            hoverSoundUrl:
                                '',
                            inheritedBuiltInV30:
                                true
                        });
                    }
                );

            root
                .querySelectorAll(
                    'svg'
                )
                .forEach(
                    (
                        svg,
                        index
                    ) => {
                        const markup =
                            svg.outerHTML;

                        if (
                            !markup
                        ) {
                            return;
                        }

                        assets.push({
                            name:
                                `Built-in SVG ${index + 1}`,
                            markup,
                            animation:
                                'float',
                            introBop:
                                true,
                            hoverSoundUrl:
                                '',
                            inheritedBuiltInV30:
                                true
                        });
                    }
                );
        }
    );

    return uniqueThemeAssetsV30(
        assets
    );
}

async function fetchThemeSourceV30(
    themeId
) {
    const name =
        getBuiltInThemeNameV30(
            themeId
        );

    if (
        !name ||
        themeId ===
            'default'
    ) {
        return {
            js:
                '',
            css:
                ''
        };
    }

    const urls = {
        js:
            `/themes/${encodeURIComponent(name)}/theme-${encodeURIComponent(name)}.js`,
        css:
            `/themes/${encodeURIComponent(name)}/theme-${encodeURIComponent(name)}.css`
    };

    const result = {
        js:
            '',
        css:
            ''
    };

    await Promise.all(
        Object.entries(
            urls
        ).map(
            async ([
                key,
                url
            ]) => {
                try {
                    const response =
                        await fetch(
                            url,
                            {
                                cache:
                                    'no-store'
                            }
                        );

                    if (
                        response.ok
                    ) {
                        result[key] =
                            await response.text();
                    }
                } catch {}
            }
        )
    );

    return result;
}

function analyzeThemeSourceV30(
    themeId,
    source
) {
    const name =
        getBuiltInThemeNameV30(
            themeId
        );

    const jsText =
        String(
            source?.js ||
            ''
        );

    const cssText =
        String(
            source?.css ||
            ''
        );

    const allText =
        `${jsText}\n${cssText}`;

    const svgAssets =
        [];

    const absoluteSvgRegex =
        /["'`](\/svg\/[^"'`]+?\.svg(?:\?[^"'`]*)?)["'`]/gi;

    let match;

    while (
        (
            match =
                absoluteSvgRegex.exec(
                    allText
                )
        )
    ) {
        svgAssets.push({
            name:
                themeAssetFileNameV30(
                    match[1]
                ),
            url:
                match[1],
            animation:
                'float',
            introBop:
                true,
            hoverSoundUrl:
                '',
            inheritedBuiltInV30:
                true
        });
    }

    // Many theme modules keep just filenames in an ASSETS array and build
    // /svg/theme-name/<filename> later.
    const bareSvgRegex =
        /["'`]([^"'`\/]+\.svg(?:\?[^"'`]*)?)["'`]/gi;

    while (
        (
            match =
                bareSvgRegex.exec(
                    jsText
                )
        )
    ) {
        const file =
            match[1];

        svgAssets.push({
            name:
                themeAssetFileNameV30(
                    file
                ),
            url:
                `/svg/theme-${encodeURIComponent(name)}/${file}`,
            animation:
                'float',
            introBop:
                true,
            hoverSoundUrl:
                '',
            inheritedBuiltInV30:
                true
        });
    }

    const soundMatches =
        [];

    const soundRegex =
        /["'`](\/sounds\/[^"'`]+?\.(?:mp3|wav|ogg|m4a|aac)(?:\?[^"'`]*)?)["'`]/gi;

    while (
        (
            match =
                soundRegex.exec(
                    jsText
                )
        )
    ) {
        const start =
            Math.max(
                0,
                match.index -
                    260
            );

        const end =
            Math.min(
                jsText.length,
                soundRegex.lastIndex +
                    260
            );

        const context =
            jsText
                .slice(
                    start,
                    end
                )
                .toLowerCase();

        let introScore =
            0;

        if (
            /intro|opening|song|music/.test(
                context
            )
        ) {
            introScore +=
                5;
        }

        if (
            /hover/.test(
                context
            )
        ) {
            introScore -=
                4;
        }

        soundMatches.push({
            url:
                match[1],
            context,
            introScore
        });
    }

    const uniqueSounds =
        Array.from(
            new Map(
                soundMatches.map(
                    sound => [
                        sound.url,
                        sound
                    ]
                )
            ).values()
        );

    const intro =
        [...uniqueSounds]
            .sort(
                (
                    a,
                    b
                ) =>
                    b.introScore -
                    a.introScore
            )[0] ||
        null;

    const hoverSounds =
        uniqueSounds
            .filter(
                sound =>
                    sound.url !==
                        intro?.url &&
                    /hover|sound|sfx|effect/.test(
                        sound.context
                    )
            )
            .map(
                sound => ({
                    name:
                        themeAssetFileNameV30(
                            sound.url,
                            'Built-in Sound'
                        ),
                    url:
                        sound.url,
                    inheritedBuiltInV30:
                        true
                })
            );

    const endMatch =
        jsText.match(
            /(?:INTRO|SONG|AUDIO)[A-Z0-9_]*END[A-Z0-9_]*\s*=\s*(\d+(?:\.\d+)?)/i
        );

    const fadeMatch =
        jsText.match(
            /(?:INTRO|SONG|AUDIO)[A-Z0-9_]*FADE[A-Z0-9_]*(?:START)?[A-Z0-9_]*\s*=\s*(\d+(?:\.\d+)?)/i
        );

    return {
        svgAssets:
            uniqueThemeAssetsV30(
                svgAssets
            ),

        introAudio:
            intro?.url ||
            '',

        introAudioName:
            intro
                ? themeAssetFileNameV30(
                    intro.url,
                    'Built-in Intro Audio'
                )
                : '',

        hoverSounds,

        audioPlayMode:
            endMatch
                ? 'segment'
                : 'full',

        audioStart:
            0,

        audioEnd:
            endMatch
                ? Number(
                    endMatch[1]
                )
                : 20,

        audioFade:
            !!fadeMatch
    };
}

function installBuiltInAssetNoteV30(
    modal,
    details
) {
    modal
        .querySelectorAll(
            '.theme-builder-built-in-note-v30'
        )
        .forEach(
            element =>
                element.remove()
        );

    const svgSection =
        modal.querySelector(
            '.theme-builder-svg-list'
        )
            ?.closest(
                'section'
            );

    if (
        svgSection &&
        details.svgCount
    ) {
        const note =
            document.createElement(
                'div'
            );

        note.className =
            'theme-builder-built-in-note-v30';

        note.innerHTML = `
            <i class="ph ph-sparkle"></i>
            <span>
                ${details.svgCount} built-in decoration${details.svgCount === 1 ? '' : 's'} loaded from this theme.
            </span>
        `;

        svgSection
            .querySelector(
                '.theme-builder-control-heading, .theme-builder-media-heading'
            )
            ?.insertAdjacentElement(
                'afterend',
                note
            );
    }

    const audioSection =
        modal.querySelector(
            '.theme-builder-audio-status'
        )
            ?.closest(
                'section'
            );

    if (
        audioSection &&
        details.audio
    ) {
        const note =
            document.createElement(
                'div'
            );

        note.className =
            'theme-builder-built-in-note-v30';

        note.innerHTML = `
            <i class="ph ph-music-notes"></i>
            <span>
                Built-in intro audio detected: ${escapeCustomHtml(details.audio)}
            </span>
        `;

        audioSection
            .querySelector(
                '.theme-builder-control-heading, .theme-builder-media-heading'
            )
            ?.insertAdjacentElement(
                'afterend',
                note
            );
    }
}

function bindBuiltInAssetDirtyTrackingV30(
    modal
) {
    if (
        modal.dataset
            .builtInAssetDirtyTrackingV30 ===
        'true'
    ) {
        return;
    }

    modal.dataset
        .builtInAssetDirtyTrackingV30 =
        'true';

    const mark =
        event => {
            if (
                !modal.dataset
                    .themeBuilderBuiltInSourceV30
            ) {
                return;
            }

            const target =
                event.target;

            if (
                !target ||
                target.nodeType !==
                    1
            ) {
                return;
            }

            if (
                target.matches(
                    '[data-theme-key="background"], [data-theme-hex="background"], .theme-builder-background-file, .theme-builder-background-clear'
                )
            ) {
                modal._builtInBackgroundDirtyV30 =
                    true;
            }

            if (
                target.closest(
                    [
                        '.theme-builder-svg-row',
                        '.theme-builder-svg-controls-v10',
                        '.theme-builder-svg-global-controls-v19',
                        '.theme-builder-svg-overlap-row-v26'
                    ].join(',')
                ) ||
                target.matches(
                    '.theme-builder-svg-file, .theme-builder-svg-distribution'
                )
            ) {
                modal._builtInArtDirtyV30 =
                    true;
            }

            if (
                target.closest(
                    '.theme-builder-audio-controls, .theme-builder-audio-section'
                ) ||
                target.matches(
                    '.theme-builder-audio-file, .theme-builder-audio-clear'
                )
            ) {
                modal._builtInAudioDirtyV30 =
                    true;
            }
        };

    modal.addEventListener(
        'input',
        mark,
        true
    );

    modal.addEventListener(
        'change',
        mark,
        true
    );

    modal.addEventListener(
        'click',
        mark,
        true
    );
}

function mountBuiltInRuntimePreviewV30(
    modal
) {
    const canvas =
        modal.querySelector(
            '.theme-builder-live-canvas'
        );

    if (!canvas) {
        return;
    }

    canvas
        .querySelector(
            '.theme-builder-built-in-runtime-v30'
        )
        ?.remove();

    const snapshot =
        modal._builtInRuntimeSnapshotV30;

    if (
        !snapshot ||
        modal._builtInArtDirtyV30
    ) {
        return;
    }

    const layer =
        document.createElement(
            'div'
        );

    layer.className =
        'theme-builder-built-in-runtime-v30';

    (
        snapshot.roots ||
        []
    ).forEach(
        markup => {
            const template =
                document.createElement(
                    'template'
                );

            template.innerHTML =
                markup.trim();

            const root =
                template.content
                    .firstElementChild;

            if (!root) {
                return;
            }

            root.classList.add(
                'theme-builder-built-in-root-v30'
            );

            root.style.setProperty(
                'position',
                'absolute',
                'important'
            );

            root.style.setProperty(
                'inset',
                '0',
                'important'
            );

            root.style.setProperty(
                'width',
                '100%',
                'important'
            );

            root.style.setProperty(
                'height',
                '100%',
                'important'
            );

            root.style.setProperty(
                'display',
                'block',
                'important'
            );

            root.style.setProperty(
                'overflow',
                'hidden',
                'important'
            );

            root.style.setProperty(
                'pointer-events',
                'none',
                'important'
            );

            root.style.setProperty(
                'z-index',
                '0',
                'important'
            );

            layer.appendChild(
                root
            );
        }
    );

    canvas.prepend(
        layer
    );

    // When showing the exact built-in art, do not also draw the same
    // discovered SVGs through the custom-theme SVG stage.
    canvas
        .querySelector(
            '.theme-builder-live-art-stage'
        )
        ?.remove();
}

function syncBuiltInPreviewBackgroundV30(
    modal
) {
    const canvas =
        modal.querySelector(
            '.theme-builder-live-canvas'
        );

    const snapshot =
        modal._builtInRuntimeSnapshotV30;

    if (
        !canvas ||
        !snapshot ||
        modal._builtInBackgroundDirtyV30
    ) {
        return;
    }

    if (
        snapshot.background &&
        snapshot.background !==
            'rgba(0, 0, 0, 0) none repeat scroll 0% 0% / auto padding-box border-box'
    ) {
        canvas.style.setProperty(
            'background',
            snapshot.background,
            'important'
        );
    } else {
        if (
            snapshot.backgroundColor
        ) {
            canvas.style.setProperty(
                'background-color',
                snapshot.backgroundColor,
                'important'
            );
        }

        if (
            snapshot.backgroundImage &&
            snapshot.backgroundImage !==
                'none'
        ) {
            canvas.style.setProperty(
                'background-image',
                snapshot.backgroundImage,
                'important'
            );
        }
    }
}

async function hydrateBuiltInThemeEditorV30(
    modal,
    themeId,
    themeName
) {
    if (
        !modal ||
        !isBuiltInThemeIdV30(
            themeId
        )
    ) {
        return;
    }

    const runtimeRoots =
        getBuiltInThemeRootsV30(
            themeId
        );

    const runtimeSnapshot =
        captureBuiltInRuntimeSnapshotV30(
            themeId
        );

    const runtimeSvgAssets =
        collectRuntimeSvgAssetsV30(
            runtimeRoots
        );

    const source =
        await fetchThemeSourceV30(
            themeId
        );

    const sourceInfo =
        analyzeThemeSourceV30(
            themeId,
            source
        );

    const existingOverride =
        getThemeOverrideV25(
            themeId
        );

    const currentDraft =
        getThemeBuilderDraft(
            modal
        );

    const sourceSvgs =
        uniqueThemeAssetsV30([
            ...runtimeSvgAssets,
            ...sourceInfo.svgAssets
        ]);

    const overrideSvgs =
        Array.isArray(
            existingOverride?.backgroundSvgs
        )
            ? existingOverride.backgroundSvgs
            : [];

    const useSourceSvgs =
        !overrideSvgs.length;

    const inheritedSvgs =
        sourceSvgs.map(
            svg => ({
                ...svg,
                inheritedBuiltInV30:
                    true
            })
        );

    const introFromOverride =
        String(
            existingOverride?.introAudio ||
            ''
        );

    const useSourceAudio =
        !introFromOverride;

    const merged = {
        ...currentDraft,

        name:
            existingOverride?.name ||
            themeName ||
            currentDraft.name,

        backgroundSvgs:
            useSourceSvgs
                ? inheritedSvgs
                : overrideSvgs,

        introAudio:
            useSourceAudio
                ? sourceInfo.introAudio
                : introFromOverride,

        introAudioName:
            useSourceAudio
                ? sourceInfo.introAudioName
                : (
                    existingOverride
                        ?.introAudioName ||
                    currentDraft
                        .introAudioName
                ),

        audioPlayMode:
            useSourceAudio
                ? sourceInfo.audioPlayMode
                : (
                    existingOverride
                        ?.audioPlayMode ||
                    currentDraft
                        .audioPlayMode
                ),

        audioStart:
            useSourceAudio
                ? sourceInfo.audioStart
                : (
                    existingOverride
                        ?.audioStart ??
                    currentDraft
                        .audioStart
                ),

        audioEnd:
            useSourceAudio
                ? sourceInfo.audioEnd
                : (
                    existingOverride
                        ?.audioEnd ??
                    currentDraft
                        .audioEnd
                ),

        audioFade:
            useSourceAudio
                ? sourceInfo.audioFade
                : !!existingOverride
                    ?.audioFade,

        svgHoverSounds:
            (
                existingOverride
                    ?.svgHoverSounds
                    ?.length
            )
                ? existingOverride
                    .svgHoverSounds
                : sourceInfo
                    .hoverSounds
    };

    modal.dataset
        .themeBuilderBuiltInSourceV30 =
        themeId;

    modal._builtInRuntimeSnapshotV30 =
        runtimeSnapshot;

    modal._builtInBackgroundDirtyV30 =
        false;

    modal._builtInArtDirtyV30 =
        !!(
            existingOverride
                ?.replaceBuiltInDecorationsV30 ||
            overrideSvgs.length
        );

    modal._builtInAudioDirtyV30 =
        false;

    modal._builtInInheritedSvgKeysV30 =
        new Set(
            inheritedSvgs.map(
                svg =>
                    String(
                        svg.url ||
                        svg.markup ||
                        ''
                    )
            )
        );

    modal._builtInInheritedAudioV30 =
        sourceInfo.introAudio ||
        '';

    populateThemeBuilder(
        modal,
        merged
    );

    installBuiltInAssetNoteV30(
        modal,
        {
            svgCount:
                inheritedSvgs.length,
            audio:
                sourceInfo
                    .introAudioName
        }
    );

    bindBuiltInAssetDirtyTrackingV30(
        modal
    );

    rebuildActualThemeBuilderPreviewV5(
        modal
    );

    forceAllBackButtonsTransparentV26(
        modal
    );
}

// Built-in SVG files are inherited project assets. Removing one from an
// edited theme must NEVER delete the source theme's real SVG file.
const confirmDeleteThemeBuilderSvgBeforeV30 =
    confirmDeleteThemeBuilderSvg;

confirmDeleteThemeBuilderSvg =
    async function(
        modal,
        index
    ) {
        const svg =
            modal
                ._themeBackgroundSvgs?.[
                    index
                ];

        if (
            !svg
                ?.inheritedBuiltInV30
        ) {
            return confirmDeleteThemeBuilderSvgBeforeV30(
                modal,
                index
            );
        }

        const confirmed =
            await showAppConfirm({
                title:
                    'Remove this SVG from your edit?',
                message:
                    `“${svg.name || `SVG ${index + 1}`}” will be hidden by this edited theme. The original built-in asset will not be deleted.`,
                confirmLabel:
                    'Remove from Edit'
            });

        if (!confirmed) {
            return;
        }

        modal._builtInArtDirtyV30 =
            true;

        modal
            ._themeBackgroundSvgs
            .splice(
                index,
                1
            );

        renderThemeBuilderSvgListV2(
            modal
        );

        updateThemeBuilderPreview(
            modal
        );
    };

// Keep inherited source assets out of the saved override unless the user
// actually changed SVG behavior. This prevents the original art from being
// duplicated on top of itself after Save & Apply.
const saveThemeOverrideBeforeV30 =
    saveThemeOverrideV25;

saveThemeOverrideV25 =
    async function(
        modal
    ) {
        const themeId =
            modal?.dataset
                .themeBuilderEditingThemeV25;

        const builtInSource =
            modal?.dataset
                .themeBuilderBuiltInSourceV30;

        await saveThemeOverrideBeforeV30(
            modal
        );

        if (
            !themeId ||
            !builtInSource ||
            themeId !==
                builtInSource
        ) {
            return;
        }

        const override =
            ensureThemeOverridesV25()[
                themeId
            ];

        if (!override) {
            return;
        }

        if (
            !modal
                ._builtInArtDirtyV30
        ) {
            override.backgroundSvgs =
                [];

            override.replaceBuiltInDecorationsV30 =
                false;
        } else {
            override.backgroundSvgs =
                (
                    override.backgroundSvgs ||
                    []
                ).map(
                    svg => {
                        const copy = {
                            ...svg
                        };

                        delete copy
                            .inheritedBuiltInV30;

                        return copy;
                    }
                );

            override.replaceBuiltInDecorationsV30 =
                true;
        }

        if (
            !modal
                ._builtInAudioDirtyV30 &&
            override.introAudio ===
                modal
                    ._builtInInheritedAudioV30
        ) {
            override.introAudio =
                '';

            override.introAudioName =
                '';

            override.introAudioProjectPath =
                '';
        }

        await saveDb();

        await applyTheme(
            themeId,
            {
                persist:
                    false
            }
        );
    };

// ------------------------------------------------------------
// PREVIEW WRAPPERS: exact built-in art/background is the last visual layer.
// ------------------------------------------------------------

const applyThemeBuilderDraftToActualPreviewBeforeBuiltInV30 =
    applyThemeBuilderDraftToActualPreviewV5;

applyThemeBuilderDraftToActualPreviewV5 =
    function(
        modal
    ) {
        applyThemeBuilderDraftToActualPreviewBeforeBuiltInV30(
            modal
        );

        if (
            modal?.dataset
                .themeBuilderBuiltInSourceV30
        ) {
            syncBuiltInPreviewBackgroundV30(
                modal
            );

            mountBuiltInRuntimePreviewV30(
                modal
            );
        }
    };

const rebuildActualThemeBuilderPreviewBeforeBuiltInV30 =
    rebuildActualThemeBuilderPreviewV5;

rebuildActualThemeBuilderPreviewV5 =
    function(
        modal
    ) {
        rebuildActualThemeBuilderPreviewBeforeBuiltInV30(
            modal
        );

        if (
            modal?.dataset
                .themeBuilderBuiltInSourceV30
        ) {
            syncBuiltInPreviewBackgroundV30(
                modal
            );

            mountBuiltInRuntimePreviewV30(
                modal
            );
        }

        requestAnimationFrame(
            () =>
                fitActualThemeBuilderPreviewV9(
                    modal
                )
        );
    };

// Re-hydrate AFTER V29 successfully opens a built-in editor.
const openAnyThemeInBuilderBeforeBuiltInPreviewV30 =
    openAnyThemeInBuilderV25;

openAnyThemeInBuilderV25 =
    async function(
        themeId,
        themeName
    ) {
        await openAnyThemeInBuilderBeforeBuiltInPreviewV30(
            themeId,
            themeName
        );

        const modal =
            document.getElementById(
                'theme-builder-modal'
            );

        if (
            !modal ||
            modal.classList.contains(
                'hidden'
            ) ||
            !isBuiltInThemeIdV30(
                themeId
            )
        ) {
            return;
        }

        await hydrateBuiltInThemeEditorV30(
            modal,
            themeId,
            themeName
        );

        ensureRestoreOriginalButtonV27(
            modal,
            themeId,
            themeName
        );

        removeLegacyThemeBuilderResetV28(
            modal
        );
    };

// ------------------------------------------------------------
// APPLY: if an edited built-in deliberately replaces its discovered SVGs,
// hide the source decoration root so artwork never doubles.
// ------------------------------------------------------------

function syncReplacedBuiltInDecorationsV30(
    themeId
) {
    if (
        !isBuiltInThemeIdV30(
            themeId
        )
    ) {
        return;
    }

    const override =
        getThemeOverrideV25(
            themeId
        );

    const replace =
        !!override
            ?.replaceBuiltInDecorationsV30;

    getBuiltInThemeRootsV30(
        themeId
    ).forEach(
        root => {
            root.classList.toggle(
                'theme-source-decorations-replaced-v30',
                replace
            );
        }
    );
}

const applyThemeBeforeBuiltInAssetsV30 =
    applyTheme;

applyTheme =
    async function(
        themeValue,
        opts = {}
    ) {
        await applyThemeBeforeBuiltInAssetsV30(
            themeValue,
            opts
        );

        if (
            isBuiltInThemeIdV30(
                themeValue
            )
        ) {
            syncReplacedBuiltInDecorationsV30(
                themeValue
            );
        }
    };

// ============================================================
// MULTIPLE DUPLICATED THEMES
// ============================================================

function ensureThemeCopiesV30() {
    if (!db.settings) {
        db.settings = {};
    }

    if (
        !Array.isArray(
            db.settings
                .themeCopiesV30
        )
    ) {
        db.settings
            .themeCopiesV30 =
            [];
    }

    return db.settings
        .themeCopiesV30;
}

function cloneThemeDataV30(
    value
) {
    try {
        return JSON.parse(
            JSON.stringify(
                value ||
                {}
            )
        );
    } catch {
        return {
            ...(value ||
                {})
        };
    }
}

function makeThemeCopyIdV30() {
    return (
        'theme-custom-builder-' +
        Date.now()
            .toString(36) +
        '-' +
        Math.random()
            .toString(36)
            .slice(
                2,
                7
            )
    );
}

function getThemeCopyV30(
    themeId
) {
    return ensureThemeCopiesV30()
        .find(
            copy =>
                copy.id ===
                themeId
        ) ||
        null;
}

function getThemeDisplayNameV30(
    themeId
) {
    const copy =
        getThemeCopyV30(
            themeId
        );

    if (copy) {
        return (
            copy.name ||
            'Theme Copy'
        );
    }

    if (
        themeId ===
            'theme-custom-builder'
    ) {
        return (
            getCustomThemeSettings()
                .name ||
            'My Custom Theme'
        );
    }

    const option =
        Array.from(
            dailyThemeSelect
                ?.options ||
                []
        )
            .find(
                item =>
                    item.value ===
                    themeId
            );

    return (
        getThemeOverrideV25(
            themeId
        )?.name ||
        option?.textContent
            ?.trim() ||
        (
            themeId ===
                'default'
                ? 'Default'
                : String(
                    themeId
                )
                    .replace(
                        /^theme-/,
                        ''
                    )
                    .replace(
                        /[-_]+/g,
                        ' '
                    )
        )
    );
}

function syncThemeCopyOptionsV30() {
    if (!dailyThemeSelect) {
        return;
    }

    dailyThemeSelect
        .querySelectorAll(
            'option[data-theme-copy-v30="true"]'
        )
        .forEach(
            option =>
                option.remove()
        );

    ensureThemeCopiesV30()
        .forEach(
            copy => {
                const option =
                    document.createElement(
                        'option'
                    );

                option.value =
                    copy.id;

                option.textContent =
                    copy.name ||
                    'Theme Copy';

                option.dataset
                    .themeCopyV30 =
                    'true';

                dailyThemeSelect
                    .appendChild(
                        option
                    );

                const sourcePreview =
                    THEME_PREVIEWS[
                        copy.sourceThemeId
                    ];

                const theme =
                    copy.theme ||
                    {};

                THEME_PREVIEWS[
                    copy.id
                ] =
                    sourcePreview ||
                    [
                        theme.background ||
                            '#f4f1ff',
                        theme.surface ||
                            '#ffffff',
                        theme.accent ||
                            '#7c3aed',
                        String(
                            theme.background ||
                            ''
                        )
                            .toLowerCase() ===
                            '#000000'
                    ];
            }
        );
}

async function duplicateThemeV30(
    themeId,
    themeName
) {
    const copies =
        ensureThemeCopiesV30();

    let sourceThemeId =
        '';

    let theme =
        {};

    if (
        themeId ===
            'theme-custom-builder'
    ) {
        theme =
            cloneThemeDataV30(
                getCustomThemeSettings()
            );
    } else {
        const existingCopy =
            getThemeCopyV30(
                themeId
            );

        if (existingCopy) {
            sourceThemeId =
                existingCopy
                    .sourceThemeId ||
                '';

            theme =
                cloneThemeDataV30(
                    existingCopy
                        .theme
                );
        } else {
            sourceThemeId =
                themeId;

            theme =
                cloneThemeDataV30(
                    getThemeOverrideV25(
                        themeId
                    ) ||
                    {}
                );
        }
    }

    const baseName =
        themeName ||
        getThemeDisplayNameV30(
            themeId
        ) ||
        'Theme';

    const copy = {
        id:
            makeThemeCopyIdV30(),

        name:
            `${baseName} Copy`,

        sourceThemeId,

        theme: {
            ...theme,
            name:
                `${baseName} Copy`
        },

        createdAt:
            new Date()
                .toISOString()
    };

    copies.push(
        copy
    );

    await saveDb();

    syncThemeCopyOptionsV30();

    renderThemePicker();

    showFeatureToast(
        `Duplicated “${baseName}”.`
    );
}

async function deleteThemeCopyV30(
    copyId
) {
    const copy =
        getThemeCopyV30(
            copyId
        );

    if (!copy) {
        return;
    }

    const confirmed =
        await showAppConfirm({
            title:
                'Delete this duplicated theme?',
            message:
                `“${copy.name || 'Theme Copy'}” will be removed from this log.`,
            confirmLabel:
                'Delete Theme'
        });

    if (!confirmed) {
        return;
    }

    db.settings
        .themeCopiesV30 =
        ensureThemeCopiesV30()
            .filter(
                item =>
                    item.id !==
                    copyId
            );

    if (
        db.settings.theme ===
            copyId
    ) {
        await applyTheme(
            'default',
            {
                persist:
                    false
            }
        );

        db.settings.theme =
            'default';

        themePickerSelected =
            'default';
    }

    await saveDb();

    syncThemeCopyOptionsV30();

    renderThemePicker();
}

function removeBuiltInEditorStateForCustomV30(
    modal
) {
    if (!modal) {
        return;
    }

    modal.dataset
        .themeBuilderBuiltInSourceV30 =
        '';

    modal._builtInRuntimeSnapshotV30 =
        null;

    modal._builtInBackgroundDirtyV30 =
        false;

    modal._builtInArtDirtyV30 =
        false;

    modal._builtInAudioDirtyV30 =
        false;

    modal
        .querySelectorAll(
            '.theme-builder-built-in-note-v30'
        )
        .forEach(
            element =>
                element.remove()
        );

    modal
        .querySelector(
            '.theme-builder-built-in-runtime-v30'
        )
        ?.remove();
}

async function saveThemeCopyV30(
    modal,
    copyId
) {
    if (
        !validateThemeBuilderBeforeSaveV25(
            modal
        )
    ) {
        return;
    }

    const copy =
        getThemeCopyV30(
            copyId
        );

    if (!copy) {
        return;
    }

    const draft =
        getThemeBuilderDraft(
            modal
        );

    copy.name =
        draft.name ||
        copy.name ||
        'Theme Copy';

    copy.theme =
        cloneThemeDataV30(
            draft
        );

    if (
        modal.dataset
            .themeBuilderBuiltInSourceV30
    ) {
        if (
            !modal
                ._builtInArtDirtyV30
        ) {
            copy.theme
                .backgroundSvgs =
                [];

            copy.theme
                .replaceBuiltInDecorationsV30 =
                false;
        } else {
            copy.theme
                .replaceBuiltInDecorationsV30 =
                true;

            copy.theme
                .backgroundSvgs =
                (
                    copy.theme
                        .backgroundSvgs ||
                    []
                ).map(
                    svg => {
                        const clean = {
                            ...svg
                        };

                        delete clean
                            .inheritedBuiltInV30;

                        return clean;
                    }
                );
        }

        if (
            !modal
                ._builtInAudioDirtyV30 &&
            copy.theme
                .introAudio ===
                modal
                    ._builtInInheritedAudioV30
        ) {
            copy.theme
                .introAudio =
                '';

            copy.theme
                .introAudioName =
                '';
        }
    }

    db.settings.theme =
        copyId;

    await saveDb();

    syncThemeCopyOptionsV30();

    await applyTheme(
        copyId,
        {
            persist:
                false
        }
    );

    themePickerSelected =
        copyId;

    renderThemePicker();

    modal.classList.add(
        'hidden'
    );

    dailySettingsModal
        ?.classList.add(
            'hidden'
        );

    showFeatureToast(
        `Saved “${copy.name}”.`
    );
}

async function openThemeCopyInBuilderV30(
    copyId
) {
    const copy =
        getThemeCopyV30(
            copyId
        );

    if (!copy) {
        return;
    }

    if (
        copy.sourceThemeId
    ) {
        await openAnyThemeInBuilderV25(
            copy.sourceThemeId,
            copy.name
        );

        const modal =
            document.getElementById(
                'theme-builder-modal'
            );

        if (!modal) {
            return;
        }

        const inherited =
            getThemeBuilderDraft(
                modal
            );

        const merged = {
            ...inherited,
            ...(copy.theme ||
                {}),
            name:
                copy.name ||
                copy.theme?.name ||
                inherited.name
        };

        populateThemeBuilder(
            modal,
            merged
        );

        modal.dataset
            .themeBuilderEditingThemeV25 =
            '';

        modal.dataset
            .themeBuilderEditingCopyV30 =
            copyId;

        removeRestoreOriginalButtonV27(
            modal
        );

        modal
            .querySelector(
                '.theme-builder-save'
            )
            .onclick =
            () =>
                saveThemeCopyV30(
                    modal,
                    copyId
                );

        rebuildActualThemeBuilderPreviewV5(
            modal
        );

        modal.classList.remove(
            'hidden'
        );

        return;
    }

    const modal =
        ensureThemeBuilderModal();

    removeBuiltInEditorStateForCustomV30(
        modal
    );

    modal.dataset
        .themeBuilderEditingThemeV25 =
        '';

    modal.dataset
        .themeBuilderEditingCopyV30 =
        copyId;

    populateThemeBuilder(
        modal,
        {
            ...FEATURE_SUITE_DEFAULT_THEME,
            ...CUSTOM_THEME_MEDIA_DEFAULTS_V3,
            ...CUSTOM_THEME_VISUAL_DEFAULTS_V4,
            ...(copy.theme ||
                {}),
            name:
                copy.name ||
                copy.theme?.name ||
                'Theme Copy'
        }
    );

    removeRestoreOriginalButtonV27(
        modal
    );

    removeLegacyThemeBuilderResetV28(
        modal
    );

    modal
        .querySelector(
            '.theme-builder-save'
        )
        .onclick =
        () =>
            saveThemeCopyV30(
                modal,
                copyId
            );

    modal.classList.remove(
        'hidden'
    );
}

// ------------------------------------------------------------
// APPLY DUPLICATED THEME
// A built-in duplicate keeps the original CSS/JS/SVG/audio module as its
// source, then applies only the duplicate's independent overrides.
// ------------------------------------------------------------

const applyThemeBeforeCopiesV30 =
    applyTheme;

applyTheme =
    async function(
        themeValue,
        opts = {}
    ) {
        const copy =
            getThemeCopyV30(
                themeValue
            );

        if (!copy) {
            return applyThemeBeforeCopiesV30(
                themeValue,
                opts
            );
        }

        const {
            persist =
                true
        } = opts;

        if (
            activeThemeModule &&
            activeThemeModule.unmount
        ) {
            activeThemeModule
                .unmount();

            activeThemeModule =
                null;
        }

        if (
            copy.sourceThemeId
        ) {
            themeOverrideApplySuppressedV25 =
                true;

            // V422: this source module is only supplying its visual/interaction
            // layer. The copy/shared Builder record below is the audio authority.
            // Tell core template.js to suppress any legacy startup Audio created
            // by the source module while it mounts.
            const previousLegacyStartupAudioGuardV422 =
                window.__loggySuppressLegacyThemeStartupAudioV422;
            window.__loggySuppressLegacyThemeStartupAudioV422 =
                true;

            try {
                await applyThemeBeforeCopiesV30(
                    copy.sourceThemeId,
                    {
                        persist:
                            false
                    }
                );
            } finally {
                if (
                    previousLegacyStartupAudioGuardV422 ===
                    undefined
                ) {
                    delete window.__loggySuppressLegacyThemeStartupAudioV422;
                } else {
                    window.__loggySuppressLegacyThemeStartupAudioV422 =
                        previousLegacyStartupAudioGuardV422;
                }

                themeOverrideApplySuppressedV25 =
                    false;
            }

            const themeData =
                copy.theme ||
                {};

            if (
                Object.keys(
                    themeData
                ).length
            ) {
                document.body
                    .classList.add(
                        'theme-custom-builder'
                    );

                applyCustomBuiltTheme(
                    themeData
                );
            }

            if (
                themeData
                    .replaceBuiltInDecorationsV30
            ) {
                getBuiltInThemeRootsV30(
                    copy
                        .sourceThemeId
                )
                    .forEach(
                        root =>
                            root.classList.add(
                                'theme-source-decorations-replaced-v30'
                            )
                    );
            }
        } else {
            await applyThemeBeforeCopiesV30(
                'default',
                {
                    persist:
                        false
                }
            );

            document.body
                .classList.add(
                    'theme-custom-builder'
                );

            applyCustomBuiltTheme(
                copy.theme ||
                FEATURE_SUITE_DEFAULT_THEME
            );
        }

        db.settings.theme =
            themeValue;

        if (persist) {
            await saveDb();
        }

        if (
            dailyThemeSelect
        ) {
            syncThemeCopyOptionsV30();

            dailyThemeSelect.value =
                themeValue;
        }

        themePickerSelected =
            themeValue;

        updateThemePickerSelection();

        forceAllBackButtonsTransparentV26();
    };

// ------------------------------------------------------------
// THEME PICKER: sync copies + one authoritative context menu.
// ------------------------------------------------------------

const renderThemePickerBeforeCopiesV30 =
    renderThemePicker;

renderThemePicker =
    function() {
        syncThemeCopyOptionsV30();

        renderThemePickerBeforeCopiesV30();

        moveCustomThemeCardsToEndV24();
    };

function installThemePickerContextMenuV30() {
    if (
        !themePicker ||
        themePicker.dataset
            .themeContextV30 ===
            'true'
    ) {
        return;
    }

    themePicker.dataset
        .themeContextV30 =
        'true';

    themePicker.addEventListener(
        'contextmenu',
        event => {
            const card =
                event.target.closest(
                    '.theme-picker-card'
                );

            if (
                !card ||
                !themePicker.contains(
                    card
                )
            ) {
                return;
            }

            event.preventDefault();
            event.stopPropagation();
            event.stopImmediatePropagation();

            const themeId =
                card.dataset.theme;

            const themeName =
                getThemeDisplayNameV30(
                    themeId
                );

            const copy =
                getThemeCopyV30(
                    themeId
                );

            const actions = [
                {
                    label:
                        'Edit Theme',
                    icon:
                        'ph-pencil-simple',
                    action:
                        () => {
                            if (copy) {
                                openThemeCopyInBuilderV30(
                                    themeId
                                );

                                return;
                            }

                            if (
                                themeId ===
                                'theme-custom-builder'
                            ) {
                                openExistingCustomThemeFromPickerV7();

                                return;
                            }

                            openAnyThemeInBuilderV25(
                                themeId,
                                themeName
                            );
                        }
                },
                {
                    label:
                        'Duplicate Theme',
                    icon:
                        'ph-copy',
                    action:
                        () =>
                            duplicateThemeV30(
                                themeId,
                                themeName
                            )
                }
            ];

            if (
                copy
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
                            deleteThemeCopyV30(
                                themeId
                            )
                });
            } else if (
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
                                themeName
                            )
                });
            }

            showCustomItemContextMenu(
                event.clientX,
                event.clientY,
                actions
            );
        },
        true
    );
}

installThemePickerContextMenuV30();

requestAnimationFrame(
    () => {
        syncThemeCopyOptionsV30();

        installThemePickerContextMenuV30();
    }
);



// ============================================================
// V31 — THEME TRASH + CLEAN TRASH HEADER + DUPLICATES BEFORE +
// ============================================================

// ------------------------------------------------------------
// Trash data now includes Themes.
// ------------------------------------------------------------

const normalizeFeatureSuiteSettingsBeforeThemesV31 =
    normalizeFeatureSuiteSettings;

normalizeFeatureSuiteSettings =
    function() {
        normalizeFeatureSuiteSettingsBeforeThemesV31();

        if (
            !Array.isArray(
                db.settings
                    .trash
                    .themes
            )
        ) {
            db.settings
                .trash
                .themes =
                [];
        }

        if (
            !Array.isArray(
                db.settings
                    .permanentlyDeletedThemeIdsV31
            )
        ) {
            db.settings
                .permanentlyDeletedThemeIdsV31 =
                [];
        }

        if (
            db.settings
                .customThemePermanentlyDeletedV31 ===
            undefined
        ) {
            db.settings
                .customThemePermanentlyDeletedV31 =
                false;
        }

        const themes =
            db.settings
                .trash
                .themes;

        const permanentIds =
            new Set(
                db.settings
                    .permanentlyDeletedThemeIdsV31
            );

        // Bring older soft-deleted built-in themes into the real Trash tab.
        (
            db.settings
                .deletedThemes ||
            []
        ).forEach(
            themeId => {
                if (
                    permanentIds.has(
                        themeId
                    ) ||
                    themes.some(
                        entry =>
                            entry
                                .themeId ===
                            themeId
                    )
                ) {
                    return;
                }

                const option =
                    Array.from(
                        dailyThemeSelect
                            ?.options ||
                            []
                    )
                        .find(
                            item =>
                                item.value ===
                                themeId
                        );

                themes.push({
                    id:
                        `legacy-theme-${themeId}`,
                    kind:
                        'builtin',
                    themeId,
                    name:
                        option?.textContent
                            ?.trim() ||
                        String(
                            themeId
                        )
                            .replace(
                                /^theme-/,
                                ''
                            )
                            .replace(
                                /[-_]+/g,
                                ' '
                            ),
                    deletedAt:
                        new Date()
                            .toISOString(),
                    override:
                        cloneThemeDataV30(
                            ensureThemeOverridesV25()[
                                themeId
                            ] ||
                            null
                        )
                });

                delete ensureThemeOverridesV25()[
                    themeId
                ];
            }
        );

        // Older custom-theme deletion was only a hidden flag.
        if (
            db.settings
                .customThemeDeleted &&
            !db.settings
                .customThemePermanentlyDeletedV31 &&
            !themes.some(
                entry =>
                    entry
                        .themeId ===
                    'theme-custom-builder'
            )
        ) {
            const oldTheme =
                cloneThemeDataV30(
                    db.settings
                        .customTheme
                );

            themes.push({
                id:
                    'legacy-custom-theme',
                kind:
                    'custom',
                themeId:
                    'theme-custom-builder',
                name:
                    oldTheme?.name ||
                    'My Custom Theme',
                deletedAt:
                    new Date()
                        .toISOString(),
                theme:
                    oldTheme
            });

            db.settings.customTheme = {
                ...FEATURE_SUITE_DEFAULT_THEME,
                ...CUSTOM_THEME_MEDIA_DEFAULTS_V3,
                ...CUSTOM_THEME_VISUAL_DEFAULTS_V4
            };
        }
    };

function makeThemeTrashIdV31() {
    return (
        'theme-trash-' +
        Date.now()
            .toString(36) +
        '-' +
        Math.random()
            .toString(36)
            .slice(
                2,
                7
            )
    );
}

function getThemeTrashV31() {
    normalizeFeatureSuiteSettings();

    return db.settings
        .trash
        .themes;
}

function getThemeTrashLabelV31(
    entry
) {
    return (
        entry?.name ||
        entry?.copy?.name ||
        entry?.theme?.name ||
        entry?.themeId ||
        'Theme'
    );
}

function getThemeTrashDetailV31(
    entry
) {
    if (
        entry?.kind ===
        'copy'
    ) {
        return 'Duplicated Theme';
    }

    if (
        entry?.kind ===
        'custom'
    ) {
        return 'Custom Theme';
    }

    return 'Built-in Theme';
}

async function switchAwayFromDeletedThemeV31(
    themeId
) {
    if (
        db.settings.theme !==
        themeId
    ) {
        return;
    }

    await applyTheme(
        'default',
        {
            persist:
                false
        }
    );

    db.settings.theme =
        'default';

    themePickerSelected =
        'default';

    if (dailyThemeSelect) {
        dailyThemeSelect.value =
            'default';
    }
}

async function moveThemeToTrashV31(
    themeId,
    themeName
) {
    if (
        !themeId ||
        themeId ===
            'default'
    ) {
        showFeatureToast(
            'The Default theme cannot be deleted.'
        );

        return;
    }

    const copy =
        getThemeCopyV30(
            themeId
        );

    const displayName =
        themeName ||
        getThemeDisplayNameV30(
            themeId
        ) ||
        'Theme';

    const confirmed =
        await showAppConfirm({
            title:
                'Move this theme to Trash?',
            message:
                `“${displayName}” will be removed from the theme picker, but you can restore it from the Trash tab.`,
            confirmLabel:
                'Move to Trash'
        });

    if (!confirmed) {
        return;
    }

    const trash =
        getThemeTrashV31();

    // Never keep two trash entries for the same active theme.
    for (
        let index =
            trash.length -
                1;
        index >=
            0;
        index--
    ) {
        if (
            trash[index]
                ?.themeId ===
            themeId
        ) {
            trash.splice(
                index,
                1
            );
        }
    }

    let entry;

    if (copy) {
        entry = {
            id:
                makeThemeTrashIdV31(),
            kind:
                'copy',
            themeId,
            name:
                copy.name ||
                displayName,
            deletedAt:
                new Date()
                    .toISOString(),
            copy:
                cloneThemeDataV30(
                    copy
                )
        };

        db.settings
            .themeCopiesV30 =
            ensureThemeCopiesV30()
                .filter(
                    item =>
                        item.id !==
                        themeId
                );

        syncThemeCopyOptionsV30();
    } else if (
        themeId ===
        'theme-custom-builder'
    ) {
        entry = {
            id:
                makeThemeTrashIdV31(),
            kind:
                'custom',
            themeId,
            name:
                displayName,
            deletedAt:
                new Date()
                    .toISOString(),
            theme:
                cloneThemeDataV30(
                    getCustomThemeSettings()
                )
        };

        db.settings
            .customThemeDeleted =
            true;

        db.settings
            .customThemePermanentlyDeletedV31 =
            false;

        db.settings.customTheme = {
            ...FEATURE_SUITE_DEFAULT_THEME,
            ...CUSTOM_THEME_MEDIA_DEFAULTS_V3,
            ...CUSTOM_THEME_VISUAL_DEFAULTS_V4
        };

        Array.from(
            dailyThemeSelect
                ?.options ||
                []
        )
            .find(
                option =>
                    option.value ===
                    'theme-custom-builder'
            )
            ?.remove();
    } else {
        const overrides =
            ensureThemeOverridesV25();

        entry = {
            id:
                makeThemeTrashIdV31(),
            kind:
                'builtin',
            themeId,
            name:
                displayName,
            deletedAt:
                new Date()
                    .toISOString(),
            override:
                cloneThemeDataV30(
                    overrides[
                        themeId
                    ] ||
                    null
                )
        };

        delete overrides[
            themeId
        ];

        if (
            !db.settings
                .deletedThemes
                .includes(
                    themeId
                )
        ) {
            db.settings
                .deletedThemes
                .push(
                    themeId
                );
        }

        db.settings
            .permanentlyDeletedThemeIdsV31 =
            db.settings
                .permanentlyDeletedThemeIdsV31
                .filter(
                    id =>
                        id !==
                        themeId
                );
    }

    trash.unshift(
        entry
    );

    await switchAwayFromDeletedThemeV31(
        themeId
    );

    await saveDb();

    syncThemeCopyOptionsV30();
    renderThemePicker();

    showFeatureToast(
        `Moved “${displayName}” to Trash.`,
        'Undo',
        () =>
            restoreThemeFromTrashV31(
                entry.id
            )
    );
}

async function restoreThemeFromTrashV31(
    trashId
) {
    const trash =
        getThemeTrashV31();

    const index =
        trash.findIndex(
            entry =>
                entry.id ===
                trashId
        );

    if (
        index <
        0
    ) {
        return;
    }

    const [
        entry
    ] =
        trash.splice(
            index,
            1
        );

    if (
        entry.kind ===
        'copy'
    ) {
        const restored =
            cloneThemeDataV30(
                entry.copy
            );

        if (
            ensureThemeCopiesV30()
                .some(
                    copy =>
                        copy.id ===
                        restored.id
                )
        ) {
            restored.id =
                makeThemeCopyIdV30();

            restored.name =
                `${restored.name || 'Theme Copy'} Restored`;

            if (
                restored.theme
            ) {
                restored.theme.name =
                    restored.name;
            }
        }

        ensureThemeCopiesV30()
            .push(
                restored
            );

        syncThemeCopyOptionsV30();
    } else if (
        entry.kind ===
        'custom'
    ) {
        db.settings.customTheme =
            cloneThemeDataV30(
                entry.theme ||
                FEATURE_SUITE_DEFAULT_THEME
            );

        db.settings
            .customThemeDeleted =
            false;

        db.settings
            .customThemePermanentlyDeletedV31 =
            false;

        ensureCustomThemePickerOption();
    } else {
        db.settings
            .deletedThemes =
            (
                db.settings
                    .deletedThemes ||
                []
            ).filter(
                id =>
                    id !==
                    entry.themeId
            );

        db.settings
            .permanentlyDeletedThemeIdsV31 =
            (
                db.settings
                    .permanentlyDeletedThemeIdsV31 ||
                []
            ).filter(
                id =>
                    id !==
                    entry.themeId
            );

        if (
            entry.override &&
            typeof entry.override ===
                'object'
        ) {
            ensureThemeOverridesV25()[
                entry.themeId
            ] =
                cloneThemeDataV30(
                    entry.override
                );
        }
    }

    await saveDb();

    syncThemeCopyOptionsV30();
    renderThemePicker();
    renderTrashViewV2();

    showFeatureToast(
        `Restored “${getThemeTrashLabelV31(entry)}”.`
    );
}

async function permanentlyDeleteThemeTrashV31(
    trashId
) {
    const trash =
        getThemeTrashV31();

    const index =
        trash.findIndex(
            entry =>
                entry.id ===
                trashId
        );

    if (
        index <
        0
    ) {
        return;
    }

    const entry =
        trash[index];

    const label =
        getThemeTrashLabelV31(
            entry
        );

    const confirmed =
        await showAppConfirm({
            title:
                'Delete this theme permanently?',
            message:
                `“${label}” will be removed from Trash and cannot be restored.`,
            confirmLabel:
                'Delete Permanently'
        });

    if (!confirmed) {
        return;
    }

    trash.splice(
        index,
        1
    );

    if (
        entry.kind ===
        'builtin'
    ) {
        if (
            !db.settings
                .deletedThemes
                .includes(
                    entry.themeId
                )
        ) {
            db.settings
                .deletedThemes
                .push(
                    entry.themeId
                );
        }

        if (
            !db.settings
                .permanentlyDeletedThemeIdsV31
                .includes(
                    entry.themeId
                )
        ) {
            db.settings
                .permanentlyDeletedThemeIdsV31
                .push(
                    entry.themeId
                );
        }

        delete ensureThemeOverridesV25()[
            entry.themeId
        ];
    } else if (
        entry.kind ===
        'custom'
    ) {
        db.settings
            .customThemeDeleted =
            true;

        db.settings
            .customThemePermanentlyDeletedV31 =
            true;

        db.settings.customTheme = {
            ...FEATURE_SUITE_DEFAULT_THEME,
            ...CUSTOM_THEME_MEDIA_DEFAULTS_V3,
            ...CUSTOM_THEME_VISUAL_DEFAULTS_V4
        };
    }

    await saveDb();

    syncThemeCopyOptionsV30();
    renderThemePicker();
    renderTrashViewV2();
}

// Replace the old immediate-delete functions with Trash behavior.
deleteThemeFromPickerV2 =
    async function(
        themeValue,
        themeName
    ) {
        await moveThemeToTrashV31(
            themeValue,
            themeName
        );
    };

deleteThemeCopyV30 =
    async function(
        copyId
    ) {
        const copy =
            getThemeCopyV30(
                copyId
            );

        if (!copy) {
            return;
        }

        await moveThemeToTrashV31(
            copyId,
            copy.name
        );
    };

// ------------------------------------------------------------
// Clean Trash tab header: no pointless top-right trash icon.
// ------------------------------------------------------------

const ensureTrashViewBeforeThemesV31 =
    ensureTrashViewV2;

ensureTrashViewV2 =
    function() {
        const view =
            ensureTrashViewBeforeThemesV31();

        view
            ?.querySelector(
                '.feature-trash-view-empty'
            )
            ?.remove();

        const description =
            view
                ?.querySelector(
                    '.feature-page-header p'
                );

        if (description) {
            description.textContent =
                'Restore tabs, components, Knowledge Base items, Media Resources, and themes.';
        }

        return view;
    };

// Full renderer so the Trash tab supports themes without depending on the
// removed Empty Trash header button.
renderTrashViewV2 =
    function() {
        const view =
            ensureTrashViewV2();

        const list =
            view.querySelector(
                '.feature-trash-view-list'
            );

        const trash =
            getFeatureTrash();

        list.innerHTML =
            '';

        const groups = [
            {
                label:
                    'Tabs',
                entries:
                    trash.tabs,
                type:
                    'tab',
                getLabel:
                    entry =>
                        entry.tab?.name ||
                        'Untitled Tab'
            },
            {
                label:
                    'Components',
                entries:
                    trash.components,
                type:
                    'component',
                getLabel:
                    entry =>
                        `${entry.component?.title || entry.component?.text || entry.component?.type || 'Component'} · ${entry.tabName || 'Tab'}`
            },
            {
                label:
                    'Knowledge Base',
                entries:
                    trash.kbItems,
                type:
                    'kb',
                getLabel:
                    entry =>
                        entry.itemId ||
                        'Knowledge Item'
            },
            {
                label:
                    'Media Resources',
                entries:
                    trash.resources ||
                    [],
                type:
                    'resource',
                getLabel:
                    entry =>
                        getDailyResourceDisplayTitle(
                            entry.resource,
                            entry.originalIndex
                        )
            },
            {
                label:
                    'Themes',
                entries:
                    trash.themes ||
                    [],
                type:
                    'theme',
                getLabel:
                    entry =>
                        getThemeTrashLabelV31(
                            entry
                        )
            }
        ];

        let total =
            0;

        groups.forEach(
            group => {
                if (
                    !group.entries
                        ?.length
                ) {
                    return;
                }

                total +=
                    group.entries
                        .length;

                const section =
                    document.createElement(
                        'section'
                    );

                section.className =
                    'feature-trash-group weekly-review-section';

                section.innerHTML = `
                    <h3>${escapeCustomHtml(group.label)}</h3>
                    <div class="feature-trash-group-list"></div>
                `;

                const host =
                    section.querySelector(
                        '.feature-trash-group-list'
                    );

                group.entries
                    .forEach(
                        (
                            entry,
                            index
                        ) => {
                            const row =
                                document.createElement(
                                    'article'
                                );

                            row.className =
                                `feature-trash-row ${
                                    group.type ===
                                    'theme'
                                        ? 'feature-trash-theme-row-v31'
                                        : ''
                                }`;

                            const when =
                                entry.deletedAt
                                    ? new Date(
                                        entry.deletedAt
                                    ).toLocaleString()
                                    : '';

                            let detail =
                                when;

                            if (
                                group.type ===
                                'resource'
                            ) {
                                detail =
                                    `Day ${entry.day || '?'} · ${getDailyResourceDomain(entry.resource)}`;
                            } else if (
                                group.type ===
                                'theme'
                            ) {
                                detail =
                                    `${getThemeTrashDetailV31(entry)}${when ? ` · ${when}` : ''}`;
                            }

                            row.innerHTML = `
                                <div class="feature-trash-copy">
                                    <strong>${escapeCustomHtml(group.getLabel(entry))}</strong>
                                    <small>${escapeCustomHtml(detail)}</small>
                                    ${
                                        group.type ===
                                            'resource' &&
                                        when
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
                                    async () => {
                                        if (
                                            group.type ===
                                            'theme'
                                        ) {
                                            await restoreThemeFromTrashV31(
                                                entry.id
                                            );

                                            return;
                                        }

                                        if (
                                            group.type ===
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
                                            group.type ===
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
                                            group.type ===
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
                                        } else if (
                                            group.type ===
                                            'resource'
                                        ) {
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
                                                db.days[day] =
                                                    {};
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
                                                Number(
                                                    currentDay
                                                ) ===
                                                day
                                            ) {
                                                renderResources(
                                                    db.days[
                                                        day
                                                    ]
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
                                        if (
                                            group.type ===
                                            'theme'
                                        ) {
                                            await permanentlyDeleteThemeTrashV31(
                                                entry.id
                                            );

                                            return;
                                        }

                                        const confirmed =
                                            await showAppConfirm({
                                                title:
                                                    'Delete permanently?',
                                                message:
                                                    `“${group.getLabel(entry)}” cannot be restored after this.`,
                                                confirmLabel:
                                                    'Delete Permanently'
                                            });

                                        if (!confirmed) {
                                            return;
                                        }

                                        group.entries
                                            .splice(
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
                        Deleted tabs, components, Knowledge Base items, Media Resources, and themes will show up here.
                    </span>
                </div>
            `;
        }
    };

// ------------------------------------------------------------
// Duplicated themes are the final THEME cards, directly before +.
// ------------------------------------------------------------

function forceThemeDuplicateOrderV31() {
    if (!themePicker) {
        return;
    }

    const plus =
        themePicker.querySelector(
            '.theme-picker-create-card'
        );

    if (!plus) {
        return;
    }

    ensureThemeCopiesV30()
        .forEach(
            copy => {
                const card =
                    Array.from(
                        themePicker.querySelectorAll(
                            '.theme-picker-card'
                        )
                    )
                        .find(
                            item =>
                                item.dataset
                                    .theme ===
                                copy.id
                        );

                if (card) {
                    themePicker.insertBefore(
                        card,
                        plus
                    );
                }
            }
        );

    // Absolutely nothing goes after the + button.
    themePicker.appendChild(
        plus
    );
}

const renderThemePickerBeforeOrderV31 =
    renderThemePicker;

renderThemePicker =
    function() {
        renderThemePickerBeforeOrderV31();

        forceThemeDuplicateOrderV31();
    };

requestAnimationFrame(
    forceThemeDuplicateOrderV31
);



// ============================================================
// V32 — DAILY LOG CONNECTIONS
// ============================================================

const DAILY_CONNECTION_RELATIONS_V32 = [
    ['continued', 'Continued from / continues to'],
    ['related', 'Related to'],
    ['see-also', 'See also'],
    ['project', 'Same project'],
    ['prerequisite', 'Builds on'],
    ['follow-up', 'Follow-up to']
];

function ensureDailyConnectionsArrayV32(dayNumber) {
    const day = Number(dayNumber);
    if (!Number.isFinite(day) || day <= 0) return [];

    if (!db.days[day]) {
        db.days[day] = {
            notes: '',
            phrases: [],
            tools: [],
            video: '',
            checkedParts: {}
        };
    }

    if (!Array.isArray(db.days[day].connections)) {
        db.days[day].connections = [];
    }

    return db.days[day].connections;
}

function getDailyConnectionRelationLabelV32(relation) {
    return DAILY_CONNECTION_RELATIONS_V32.find(item => item[0] === relation)?.[1] || 'Related to';
}

function normalizeDailyConnectionV32(connection) {
    return {
        id: connection?.id || customId('connection'),
        targetDay: Math.max(1, Number(connection?.targetDay) || 1),
        relation: DAILY_CONNECTION_RELATIONS_V32.some(item => item[0] === connection?.relation)
            ? connection.relation
            : 'related',
        note: String(connection?.note || '').trim().slice(0, 120)
    };
}

function ensureDailyConnectionsUIV32() {
    if (!logView || document.getElementById('daily-connections-section-v32')) return;

    const section = document.createElement('section');
    section.id = 'daily-connections-section-v32';
    section.className = 'borderless-section daily-connections-section-v32';
    section.innerHTML = `
        <div class="section-header">
            <div>
                <h2>Daily Log Connections</h2>
                <p class="progress-hint daily-connections-hint-v32">Connect this day to another Daily Log.</p>
            </div>
            <button type="button" class="small-icon-btn daily-connections-add-toggle-v32" title="Add connection" aria-label="Add connection">
                <i class="ph ph-plus"></i>
            </button>
        </div>

        <div class="daily-connections-form-v32 hidden">
            <label>
                <span>Relationship</span>
                <select class="daily-connection-relation-v32">
                    ${DAILY_CONNECTION_RELATIONS_V32.map(
                        item => `<option value="${item[0]}">${escapeCustomHtml(item[1])}</option>`
                    ).join('')}
                </select>
            </label>

            <label>
                <span>Day</span>
                <input type="number" class="daily-connection-target-v32" min="1" step="1" placeholder="14">
            </label>

            <label class="daily-connection-note-field-v32">
                <span>Optional note</span>
                <input type="text" class="daily-connection-note-v32" maxlength="120" placeholder="Same project, next attempt, etc.">
            </label>

            <button type="button" class="icon-btn daily-connection-save-v32">
                <i class="ph ph-link-simple"></i>
                Link Day
            </button>
        </div>

        <div class="daily-connections-list-v32"></div>
    `;

    const linksSection = document.getElementById('daily-custom-tab-links-section');
    if (linksSection) linksSection.insertAdjacentElement('afterend', section);
    else logView.appendChild(section);

    const form = section.querySelector('.daily-connections-form-v32');

    section.querySelector('.daily-connections-add-toggle-v32').addEventListener('click', () => {
        form.classList.toggle('hidden');
        if (!form.classList.contains('hidden')) {
            form.querySelector('.daily-connection-target-v32')?.focus();
        }
    });

    section.querySelector('.daily-connection-save-v32').addEventListener('click', () => {
        if (!currentDay) return;

        const targetInput = form.querySelector('.daily-connection-target-v32');
        const targetDay = Math.floor(Number(targetInput.value));

        if (!Number.isFinite(targetDay) || targetDay < 1) {
            showFeatureToast('Enter a valid Daily Log number.');
            targetInput.focus();
            return;
        }

        if (targetDay === Number(currentDay)) {
            showFeatureToast('Choose a different Daily Log.');
            return;
        }

        const relation = form.querySelector('.daily-connection-relation-v32').value;
        const note = form.querySelector('.daily-connection-note-v32').value;
        const connections = ensureDailyConnectionsArrayV32(currentDay);

        if (connections.some(item =>
            Number(item.targetDay) === targetDay &&
            item.relation === relation
        )) {
            showFeatureToast(`Day ${targetDay} is already linked with that relationship.`);
            return;
        }

        connections.push(normalizeDailyConnectionV32({ targetDay, relation, note }));
        saveDb();

        targetInput.value = '';
        form.querySelector('.daily-connection-note-v32').value = '';
        form.classList.add('hidden');
        renderDailyConnectionsV32();
    });
}

function renderDailyConnectionsV32() {
    ensureDailyConnectionsUIV32();

    const host = document.querySelector('.daily-connections-list-v32');
    if (!host || !currentDay) return;

    const outgoing = ensureDailyConnectionsArrayV32(currentDay);
    const incoming = [];

    Object.entries(db.days || {}).forEach(([sourceDay, dayData]) => {
        (dayData?.connections || []).forEach(connection => {
            if (
                Number(connection.targetDay) === Number(currentDay) &&
                Number(sourceDay) !== Number(currentDay)
            ) {
                incoming.push({
                    ...normalizeDailyConnectionV32(connection),
                    sourceDay: Number(sourceDay)
                });
            }
        });
    });

    const items = [
        ...outgoing.map((connection, index) => ({
            direction: 'outgoing',
            index,
            day: Number(connection.targetDay),
            connection: normalizeDailyConnectionV32(connection)
        })),
        ...incoming.map(connection => ({
            direction: 'incoming',
            day: connection.sourceDay,
            connection
        }))
    ];

    host.innerHTML = '';

    if (!items.length) {
        host.innerHTML = `
            <div class="daily-connections-empty-v32">
                <i class="ph ph-share-network"></i>
                <span>No linked Daily Logs yet.</span>
            </div>
        `;
        return;
    }

    items.forEach(item => {
        const row = document.createElement('article');
        row.className = 'daily-connection-row-v32';

        const relation = getDailyConnectionRelationLabelV32(item.connection.relation);
        const directionText =
            item.direction === 'incoming'
                ? `Day ${item.day} → this day`
                : `This day → Day ${item.day}`;

        row.innerHTML = `
            <button type="button" class="daily-connection-open-v32" title="Open Day ${item.day}">
                <span class="daily-connection-day-v32">Day ${item.day}</span>
                <span class="daily-connection-copy-v32">
                    <strong>${escapeCustomHtml(relation)}</strong>
                    <small>${escapeCustomHtml(directionText)}</small>
                    ${item.connection.note ? `<span>${escapeCustomHtml(item.connection.note)}</span>` : ''}
                </span>
            </button>

            ${item.direction === 'outgoing' ? `
                <button type="button" class="small-icon-btn daily-connection-remove-v32" title="Remove connection" aria-label="Remove connection">
                    <i class="ph ph-x"></i>
                </button>
            ` : ''}
        `;

        row.querySelector('.daily-connection-open-v32').addEventListener('click', () => openDayLog(item.day));

        row.querySelector('.daily-connection-remove-v32')?.addEventListener('click', async () => {
            const confirmed = await showAppConfirm({
                title: 'Remove this Daily Log connection?',
                message: `Day ${currentDay} will no longer link to Day ${item.day}.`,
                confirmLabel: 'Remove Link'
            });
            if (!confirmed) return;

            ensureDailyConnectionsArrayV32(currentDay).splice(item.index, 1);
            saveDb();
            renderDailyConnectionsV32();
        });

        host.appendChild(row);
    });
}

const openDayLogBeforeConnectionsV32 = openDayLog;
openDayLog = function(dayNumber) {
    openDayLogBeforeConnectionsV32(dayNumber);
    ensureDailyConnectionsArrayV32(dayNumber);
    ensureDailyConnectionsUIV32();
    renderDailyConnectionsV32();
};

// Connections graph component available in the component palette too.
CUSTOM_COMPONENT_LIBRARY.push({
    type: 'dailyConnectionsGraph',
    label: 'Daily Log Connections',
    icon: 'ph-graph'
});

function getDailyConnectionGraphDataV32() {
    const nodes = new Set();
    const edges = [];

    Object.entries(db.days || {}).forEach(([source, dayData]) => {
        const sourceDay = Number(source);
        if (!Number.isFinite(sourceDay) || sourceDay <= 0) return;

        (dayData?.connections || []).forEach(raw => {
            const connection = normalizeDailyConnectionV32(raw);
            if (!Number.isFinite(connection.targetDay) || connection.targetDay <= 0) return;

            nodes.add(sourceDay);
            nodes.add(connection.targetDay);
            edges.push({
                source: sourceDay,
                target: connection.targetDay,
                relation: connection.relation,
                note: connection.note
            });
        });
    });

    return {
        nodes: Array.from(nodes).sort((a, b) => a - b),
        edges
    };
}

function renderDailyConnectionsGraphV32(content) {
    const { nodes, edges } = getDailyConnectionGraphDataV32();

    content.innerHTML = `
        <div class="custom-collection-header">
            <div>
                <h2>Daily Log Connections</h2>
                <small>${edges.length} connection${edges.length === 1 ? '' : 's'} across ${nodes.length} Daily Log${nodes.length === 1 ? '' : 's'}</small>
            </div>
        </div>
        <div class="daily-connections-graph-wrap-v32"></div>
    `;

    const host = content.querySelector('.daily-connections-graph-wrap-v32');

    if (!nodes.length) {
        host.innerHTML = `
            <div class="feature-empty-state daily-connections-graph-empty-v32">
                <i class="ph ph-share-network"></i>
                <strong>No Daily Log connections yet</strong>
                <span>Add connections from individual Daily Logs and they will appear here.</span>
            </div>
        `;
        return;
    }

    const width = 980;
    const columns = Math.min(8, Math.max(3, Math.ceil(Math.sqrt(nodes.length * 1.45))));
    const rows = Math.ceil(nodes.length / columns);
    const height = Math.max(520, rows * 150 + 160);
    const positions = new Map();

    nodes.forEach((day, index) => {
        const row = Math.floor(index / columns);
        const column = index % columns;
        const rowItems = Math.min(columns, nodes.length - row * columns);

        const x =
            rowItems === 1
                ? width / 2
                : 90 + (column / Math.max(1, rowItems - 1)) * (width - 180);

        const y = 90 + row * 150 + (column % 2 ? 24 : 0);
        positions.set(day, { x, y });
    });

    const svgNs = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(svgNs, 'svg');
    svg.classList.add('daily-connections-graph-v32');
    svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
    svg.setAttribute('role', 'img');
    svg.setAttribute('aria-label', 'Daily Log connections graph');

    const defs = document.createElementNS(svgNs, 'defs');
    defs.innerHTML = `
        <marker id="daily-connection-arrow-v32" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto" markerUnits="strokeWidth">
            <path d="M0,0 L0,6 L9,3 z" fill="currentColor"></path>
        </marker>
    `;
    svg.appendChild(defs);

    edges.forEach((edge, index) => {
        const source = positions.get(edge.source);
        const target = positions.get(edge.target);
        if (!source || !target) return;

        const dx = target.x - source.x;
        const dy = target.y - source.y;
        const curve = Math.max(22, Math.min(70, Math.abs(dx) * .12 + Math.abs(dy) * .08)) * (index % 2 ? -1 : 1);
        const midX = (source.x + target.x) / 2 - (dy === 0 ? 0 : curve);
        const midY = (source.y + target.y) / 2 + (dx === 0 ? curve : curve * .35);

        const path = document.createElementNS(svgNs, 'path');
        path.setAttribute('d', `M ${source.x} ${source.y} Q ${midX} ${midY} ${target.x} ${target.y}`);
        path.setAttribute('class', `daily-connection-edge-v32 relation-${edge.relation}`);
        path.setAttribute('marker-end', 'url(#daily-connection-arrow-v32)');
        svg.appendChild(path);

        const label = document.createElementNS(svgNs, 'text');
        label.setAttribute('x', String(midX));
        label.setAttribute('y', String(midY - 7));
        label.setAttribute('class', 'daily-connection-edge-label-v32');
        label.textContent = getDailyConnectionRelationLabelV32(edge.relation)
            .replace('Continued from / continues to', 'Continues');
        svg.appendChild(label);
    });

    nodes.forEach(day => {
        const point = positions.get(day);
        const group = document.createElementNS(svgNs, 'g');
        group.setAttribute('class', 'daily-connection-node-v32');
        group.setAttribute('tabindex', '0');
        group.setAttribute('role', 'button');
        group.setAttribute('aria-label', `Open Day ${day}`);
        group.setAttribute('transform', `translate(${point.x} ${point.y})`);
        group.innerHTML = `
            <circle r="35"></circle>
            <text text-anchor="middle" dy="-2">Day</text>
            <text class="daily-connection-node-number-v32" text-anchor="middle" dy="17">${day}</text>
        `;

        const open = () => openDayLog(day);
        group.addEventListener('click', open);
        group.addEventListener('keydown', event => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                open();
            }
        });
        svg.appendChild(group);
    });

    host.appendChild(svg);
}

const renderCustomComponentContentBeforeConnectionsV32 = renderCustomComponentContent;
renderCustomComponentContent = function(tab, component, content) {
    if (component?.type === 'dailyConnectionsGraph') {
        renderDailyConnectionsGraphV32(content);
        return;
    }

    renderCustomComponentContentBeforeConnectionsV32(tab, component, content);
};

const defaultCustomComponentBeforeConnectionsV32 = defaultCustomComponent;
defaultCustomComponent = function(type) {
    if (type === 'dailyConnectionsGraph') {
        return {
            id: customId('component'),
            type,
            title: 'Daily Log Connections',
            titleBackground: 'none'
        };
    }

    return defaultCustomComponentBeforeConnectionsV32(type);
};


// ============================================================
// V32 — THEME-SPECIFIC CURSOR + COMPANION
// ============================================================

const CUSTOM_THEME_ACCESSORY_DEFAULTS_V32 = {
    useThemeCursor: false,
    themeCursorStyle: 'default',
    useThemeCompanion: false,
    themeCompanion: 'none'
};

function ensureThemeAccessoryControlsV32(modal, theme = {}) {
    if (!modal) return;

    let section = modal.querySelector('.theme-builder-accessories-v32');

    if (!section) {
        section = document.createElement('section');
        section.className = 'theme-builder-control-section theme-builder-accessories-v32';
        section.innerHTML = `
            <div class="theme-builder-control-heading">
                <strong>Cursors &amp; Companions</strong>
                <small>Applied when someone switches to this theme. They can still change either one afterward.</small>
            </div>

            <label class="theme-builder-visual-toggle theme-builder-use-cursor-v32">
                <input type="checkbox">
                <span class="theme-builder-visual-toggle-copy">
                    <strong>Use theme cursor</strong>
                    <small>Choose the cursor this theme starts with.</small>
                </span>
                <span class="theme-builder-switch" aria-hidden="true"></span>
            </label>

            <label class="theme-builder-field theme-builder-cursor-choice-v32">
                <span>Initial Cursor</span>
                <select></select>
            </label>

            <label class="theme-builder-visual-toggle theme-builder-use-companion-v32">
                <input type="checkbox">
                <span class="theme-builder-visual-toggle-copy">
                    <strong>Use theme companion</strong>
                    <small>Choose the companion this theme starts with.</small>
                </span>
                <span class="theme-builder-switch" aria-hidden="true"></span>
            </label>

            <label class="theme-builder-field theme-builder-companion-choice-v32">
                <span>Initial Companion</span>
                <select></select>
            </label>
        `;

        modal.querySelector('.theme-builder-controls')?.appendChild(section);

        section.querySelector('.theme-builder-cursor-choice-v32 select').innerHTML =
            CURSOR_OPTIONS.map(
                cursor => `<option value="${escapeCustomHtml(cursor.id)}">${escapeCustomHtml(cursor.name)}</option>`
            ).join('');

        section.querySelector('.theme-builder-companion-choice-v32 select').innerHTML = `
            <option value="none">None</option>
            ${COMPANIONS.map(
                companion => `<option value="${escapeCustomHtml(companion.id)}">${escapeCustomHtml(companion.name)}</option>`
            ).join('')}
        `;

        const sync = () => {
            const useCursor = section.querySelector('.theme-builder-use-cursor-v32 input').checked;
            const useCompanion = section.querySelector('.theme-builder-use-companion-v32 input').checked;

            section.querySelector('.theme-builder-cursor-choice-v32')
                .classList.toggle('disabled', !useCursor);

            section.querySelector('.theme-builder-companion-choice-v32')
                .classList.toggle('disabled', !useCompanion);
        };

        section.querySelector('.theme-builder-use-cursor-v32 input').addEventListener('change', sync);
        section.querySelector('.theme-builder-use-companion-v32 input').addEventListener('change', sync);
        section._syncThemeAccessoryStateV32 = sync;
    }

    const merged = {
        ...CUSTOM_THEME_ACCESSORY_DEFAULTS_V32,
        ...(theme || {})
    };

    section.querySelector('.theme-builder-use-cursor-v32 input').checked = !!merged.useThemeCursor;
    section.querySelector('.theme-builder-cursor-choice-v32 select').value =
        CURSOR_OPTIONS.some(option => option.id === merged.themeCursorStyle)
            ? merged.themeCursorStyle
            : 'default';

    section.querySelector('.theme-builder-use-companion-v32 input').checked = !!merged.useThemeCompanion;
    section.querySelector('.theme-builder-companion-choice-v32 select').value =
        merged.themeCompanion === 'none' ||
        COMPANIONS.some(companion => companion.id === merged.themeCompanion)
            ? merged.themeCompanion
            : 'none';

    section._syncThemeAccessoryStateV32?.();
    installThemeBuilderSectionTabsV11?.(modal);
}

const populateThemeBuilderBeforeAccessoriesV32 = populateThemeBuilder;
populateThemeBuilder = function(modal, theme) {
    const merged = {
        ...CUSTOM_THEME_ACCESSORY_DEFAULTS_V32,
        ...(theme || {})
    };

    populateThemeBuilderBeforeAccessoriesV32(modal, merged);
    ensureThemeAccessoryControlsV32(modal, merged);
};

const getThemeBuilderDraftBeforeAccessoriesV32 = getThemeBuilderDraft;
getThemeBuilderDraft = function(modal) {
    const draft = {
        ...CUSTOM_THEME_ACCESSORY_DEFAULTS_V32,
        ...getThemeBuilderDraftBeforeAccessoriesV32(modal)
    };

    const section = modal?.querySelector('.theme-builder-accessories-v32');
    if (section) {
        draft.useThemeCursor =
            !!section.querySelector('.theme-builder-use-cursor-v32 input')?.checked;
        draft.themeCursorStyle =
            section.querySelector('.theme-builder-cursor-choice-v32 select')?.value || 'default';
        draft.useThemeCompanion =
            !!section.querySelector('.theme-builder-use-companion-v32 input')?.checked;
        draft.themeCompanion =
            section.querySelector('.theme-builder-companion-choice-v32 select')?.value || 'none';
    }

    return draft;
};

function getAppliedThemeAccessoryConfigV32(themeId) {
    const copy = typeof getThemeCopyV30 === 'function' ? getThemeCopyV30(themeId) : null;
    if (copy) return copy.theme || null;

    if (themeId === 'theme-custom-builder') {
        return getCustomThemeSettings();
    }

    return typeof getThemeOverrideV25 === 'function'
        ? getThemeOverrideV25(themeId)
        : null;
}

// A Save & Apply action should apply the chosen accessory immediately,
// even when editing the theme that is already active.
document.addEventListener('click', event => {
    if (event.target.closest('#theme-builder-modal .theme-builder-save')) {
        window._forceThemeAccessoriesOnceV32 = true;
    }
}, true);


// ============================================================
// V32 — SMOOTH THEME CROSSFADE
// ============================================================

let activeThemeTransitionOverlayV32 = null;

function makeThemeTransitionOverlayV32(currentThemeId) {
    activeThemeTransitionOverlayV32?.remove();

    const overlay = document.createElement('div');
    overlay.className = 'theme-transition-overlay-v32';

    const bodyStyle = getComputedStyle(document.body);
    overlay.style.background = bodyStyle.background;
    overlay.style.backgroundColor = bodyStyle.backgroundColor;
    overlay.style.backgroundImage = bodyStyle.backgroundImage;
    overlay.style.backgroundSize = bodyStyle.backgroundSize;
    overlay.style.backgroundPosition = bodyStyle.backgroundPosition;

    const roots = [
        ...(
            typeof getBuiltInThemeRootsV30 === 'function'
                ? getBuiltInThemeRootsV30(currentThemeId)
                : []
        ),
        document.getElementById('custom-theme-background-stage')
    ]
        .filter(Boolean)
        .filter((item, index, array) => array.indexOf(item) === index);

    roots.forEach(root => {
        const clone = root.cloneNode(true);
        clone.removeAttribute('id');
        clone.classList.add('theme-transition-art-v32');
        clone.style.setProperty('display', 'block', 'important');
        clone.style.setProperty('pointer-events', 'none', 'important');
        overlay.appendChild(clone);
    });

    document.body.appendChild(overlay);
    activeThemeTransitionOverlayV32 = overlay;
    return overlay;
}

function finishThemeTransitionV32(overlay) {
    if (!overlay) return;

    requestAnimationFrame(() => {
        document.querySelectorAll(
            'body > [id$="-background"], body > [id$="-theme-background"], body > #custom-theme-background-stage'
        ).forEach(element => {
            element.classList.add('theme-transition-new-art-v32');
            setTimeout(() => element.classList.remove('theme-transition-new-art-v32'), 520);
        });

        overlay.classList.add('theme-transition-overlay-out-v32');

        setTimeout(() => {
            overlay.remove();
            if (activeThemeTransitionOverlayV32 === overlay) {
                activeThemeTransitionOverlayV32 = null;
            }
        }, 520);
    });
}

const applyThemeBeforeTransitionsAndAccessoriesV32 = applyTheme;
applyTheme = async function(themeValue, opts = {}) {
    const previousTheme = db.settings?.theme || 'default';
    const forceAccessories = !!window._forceThemeAccessoriesOnceV32;
    window._forceThemeAccessoriesOnceV32 = false;

    const changingTheme = previousTheme !== themeValue;

    // V34: theme crossfades were removed. Apply the next theme immediately.
    const overlay = null;

    try {
        await applyThemeBeforeTransitionsAndAccessoriesV32(themeValue, opts);

        if (changingTheme || forceAccessories) {
            const config = getAppliedThemeAccessoryConfigV32(themeValue);

            if (
                config?.useThemeCursor &&
                CURSOR_OPTIONS.some(cursor => cursor.id === config.themeCursorStyle)
            ) {
                db.settings.cursorStyle = config.themeCursorStyle;
                applyCursorChoice();
                renderCursorPicker();
            }

            if (
                config?.useThemeCompanion &&
                (
                    config.themeCompanion === 'none' ||
                    COMPANIONS.some(companion => companion.id === config.themeCompanion)
                )
            ) {
                db.settings.companion = config.themeCompanion;
                renderCompanion();
                renderCompanionPicker();
            }

            if (config?.useThemeCursor || config?.useThemeCompanion) {
                await saveDb();
            }
        }
    } finally {
        // V34: no visual transition layer to finish.
        activeThemeTransitionOverlayV32?.remove();
        activeThemeTransitionOverlayV32 = null;
    }
};



// ============================================================
// V33 — THEME BUILDER SVG + PNG DECORATIONS
// Existing SVG behavior stays intact. PNGs use the same wrapper,
// placement, scale, animation, overlap, intro-bop and hover-sound systems.
// ============================================================

function getThemeArtworkTypeV33(asset) {
    const url =
        String(
            asset?.url ||
            ''
        )
            .split('?')[0]
            .split('#')[0]
            .toLowerCase();

    const name =
        String(
            asset?.name ||
            ''
        )
            .toLowerCase();

    if (
        url.endsWith('.png') ||
        name.endsWith('.png') ||
        asset?.assetType ===
            'png'
    ) {
        return 'png';
    }

    return 'svg';
}

const renderThemeBuilderSvgAssetBeforeV33 =
    renderThemeBuilderSvgAsset;

renderThemeBuilderSvgAsset =
    function(
        asset
    ) {
        const type =
            getThemeArtworkTypeV33(
                asset
            );

        if (
            type ===
                'png' &&
            asset?.url
        ) {
            return `
                <img
                    class="theme-builder-decoration-image-v33 theme-builder-decoration-png-v33"
                    src="${escapeCustomHtml(asset.url)}"
                    alt=""
                    draggable="false"
                    decoding="async"
                >
            `;
        }

        return renderThemeBuilderSvgAssetBeforeV33(
            asset
        );
    };

const renderThemeBuilderSvgListBeforeV33 =
    renderThemeBuilderSvgListV2;

renderThemeBuilderSvgListV2 =
    function(
        modal
    ) {
        renderThemeBuilderSvgListBeforeV33(
            modal
        );

        const count =
            modal._themeBackgroundSvgs
                ?.length ||
            0;

        const countNode =
            modal.querySelector(
                '.theme-builder-svg-count'
            );

        if (countNode) {
            countNode.textContent =
                `${count} artwork item${count === 1 ? '' : 's'}`;
        }

        const addCard =
            modal.querySelector(
                '.theme-builder-svg-add-card strong'
            );

        if (addCard) {
            addCard.textContent =
                'Add more artwork';
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

                    const asset =
                        modal
                            ._themeBackgroundSvgs?.[
                                index
                            ];

                    const type =
                        getThemeArtworkTypeV33(
                            asset
                        );

                    const fallback =
                        type ===
                            'png'
                            ? `PNG ${index + 1}`
                            : `SVG ${index + 1}`;

                    const name =
                        card.querySelector(
                            '.theme-builder-svg-card-copy strong'
                        );

                    if (
                        name &&
                        !asset?.name
                    ) {
                        name.textContent =
                            fallback;
                    }

                    const remove =
                        card.querySelector(
                            '.theme-builder-svg-remove'
                        );

                    if (remove) {
                        remove.title =
                            'Delete artwork';

                        remove.setAttribute(
                            'aria-label',
                            'Delete artwork'
                        );
                    }
                }
            );
    };

const populateThemeBuilderBeforeArtworkV33 =
    populateThemeBuilder;

populateThemeBuilder =
    function(
        modal,
        theme
    ) {
        populateThemeBuilderBeforeArtworkV33(
            modal,
            theme
        );

        const input =
            modal.querySelector(
                '.theme-builder-svg-file'
            );

        if (input) {
            input.accept =
                '.svg,.png,image/svg+xml,image/png';
        }

        const heading =
            modal.querySelector(
                '.theme-builder-svg-section .theme-builder-media-heading strong'
            );

        if (heading) {
            heading.textContent =
                'Animated Decorations';
        }

        const detail =
            modal.querySelector(
                '.theme-builder-svg-section .theme-builder-media-heading small'
            );

        if (detail) {
            detail.textContent =
                'Add SVG or transparent PNG artwork. Both use the same placement, animation, scale, overlap, bop, and hover-sound controls.';
        }

        const choose =
            modal.querySelector(
                '.theme-builder-svg-choose'
            );

        if (choose) {
            choose.innerHTML =
                '<i class="ph ph-plus"></i> Add Artwork';
        }

        renderThemeBuilderSvgListV2(
            modal
        );
    };

// Mark newly uploaded decoration assets with their actual type.
// This is metadata only; older saved themes remain compatible.
document.addEventListener(
    'change',
    event => {
        const input =
            event.target;

        if (
            !input?.matches?.(
                '#theme-builder-modal .theme-builder-svg-file'
            )
        ) {
            return;
        }

        const modal =
            input.closest(
                '#theme-builder-modal'
            );

        if (!modal) {
            return;
        }

        // The existing upload handler runs first on the input itself.
        // After it finishes, normalize type metadata by filename/URL.
        setTimeout(
            () => {
                (
                    modal._themeBackgroundSvgs ||
                    []
                ).forEach(
                    asset => {
                        asset.assetType =
                            getThemeArtworkTypeV33(
                                asset
                            );
                    }
                );

                renderThemeBuilderSvgListV2(
                    modal
                );

                updateThemeBuilderPreview(
                    modal
                );
            },
            250
        );
    }
);



// ============================================================
// V34 — THEME TRANSITIONS REMOVED + CREATE-THEME BUTTON REPAIRED
// ============================================================

function openNewThemeBuilderCleanV34() {
    let modal;

    try {
        modal =
            ensureThemeBuilderModal();

        removeBuiltInEditorStateForCustomV30?.(
            modal
        );

        removeRestoreOriginalButtonV27?.(
            modal
        );

        removeLegacyThemeBuilderResetV28?.(
            modal
        );

        modal.dataset.themeBuilderMode =
            'create';

        modal.dataset.themeBuilderEditingThemeV25 =
            '';

        modal.dataset.themeBuilderEditingCopyV30 =
            '';

        populateThemeBuilder(
            modal,
            {
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
                name:
                    'My Custom Theme',
                backgroundSvgs:
                    []
            }
        );

        removeLegacyThemeBuilderResetV28?.(
            modal
        );

        removeRestoreOriginalButtonV27?.(
            modal
        );

        // Use the normal custom-theme save path without relying on Reset.
        modal
            .querySelector(
                '.theme-builder-save'
            )
            .onclick =
            async () => {
                if (
                    !validateThemeBuilderBeforeSaveV25(
                        modal
                    )
                ) {
                    return;
                }

                const draft =
                    getThemeBuilderDraft(
                        modal
                    );

                db.settings.customTheme = {
                    ...FEATURE_SUITE_DEFAULT_THEME,
                    ...CUSTOM_THEME_MEDIA_DEFAULTS_V3,
                    ...CUSTOM_THEME_VISUAL_DEFAULTS_V4,
                    ...draft
                };

                db.settings.customThemeDeleted =
                    false;

                db.settings.deletedThemes =
                    (
                        db.settings.deletedThemes ||
                        []
                    ).filter(
                        value =>
                            value !==
                            'theme-custom-builder'
                    );

                db.settings.theme =
                    'theme-custom-builder';

                ensureCustomThemePickerOption();

                await saveDb();

                window._forceThemeAccessoriesOnceV32 =
                    true;

                await applyTheme(
                    'theme-custom-builder',
                    {
                        persist:
                            false
                    }
                );

                if (
                    dailyThemeSelect
                ) {
                    dailyThemeSelect.value =
                        'theme-custom-builder';
                }

                themePickerSelected =
                    'theme-custom-builder';

                renderThemePicker();

                modal.classList.add(
                    'hidden'
                );

                dailySettingsModal
                    ?.classList.add(
                        'hidden'
                    );

                showFeatureToast(
                    'Custom theme saved and applied.'
                );
            };

        modal.classList.remove(
            'hidden'
        );

        requestAnimationFrame(
            () =>
                modal
                    .querySelector(
                        '[data-theme-key="name"]'
                    )
                    ?.focus()
        );
    } catch (error) {
        console.error(
            'Could not open new Theme Builder:',
            error
        );

        showFeatureToast(
            'Could not open Theme Builder.'
        );
    }
}

// Replace the mutable wrapper chain with one clean final create function.
openNewCustomThemeFromPickerV7 =
    openNewThemeBuilderCleanV34;

// Delegated handler survives every theme-picker rerender.
if (
    themePicker &&
    themePicker.dataset
        .createThemeV34 !==
        'true'
) {
    themePicker.dataset
        .createThemeV34 =
        'true';

    themePicker.addEventListener(
        'click',
        event => {
            const createCard =
                event.target.closest(
                    '.theme-picker-create-card'
                );

            if (
                !createCard ||
                !themePicker.contains(
                    createCard
                )
            ) {
                return;
            }

            event.preventDefault();
            event.stopImmediatePropagation();

            openNewThemeBuilderCleanV34();
        },
        true
    );
}

// Cleanup any transition residue left from a previous theme apply.
activeThemeTransitionOverlayV32?.remove();
activeThemeTransitionOverlayV32 = null;



// ============================================================
// V35 — UNIQUE CURSOR TRAILS FOR SPECIFIC CURSORS
// Crystal Snowflake, Rainbow Streak, Paint Tube, Flower Bud,
// Mermaid Tail, and Dragon Wing now each have their own trail.
// ============================================================

const getCursorTrailProfileBeforeV35 =
    getCursorTrailProfile;

getCursorTrailProfile =
    function(
        choice
    ) {
        const id =
            String(
                choice?.id ||
                ''
            ).toLowerCase();

        if (
            id ===
            'snowflake-point-pointer'
        ) {
            return {
                type: 'snowCrystal',
                color: '#7dd3fc',
                accent: '#ffffff'
            };
        }

        if (
            id ===
            'rainbow-pointer'
        ) {
            return {
                type: 'rainbowArc',
                color: '#ef4444',
                accent: '#3b82f6'
            };
        }

        if (
            id ===
            'paint-tube-pointer'
        ) {
            return {
                type: 'paintSplat',
                color: '#a855f7',
                accent: '#facc15'
            };
        }

        if (
            id ===
            'flower-bud-pointer'
        ) {
            return {
                type: 'petalBloom',
                color: '#f472b6',
                accent: '#22c55e'
            };
        }

        if (
            id ===
            'mermaid-tail-pointer'
        ) {
            return {
                type: 'mermaidScale',
                color: '#2dd4bf',
                accent: '#a78bfa'
            };
        }

        if (
            id ===
            'dragon-wing-pointer'
        ) {
            return {
                type: 'dragonGlow',
                color: '#8b5cf6',
                accent: '#f0abfc'
            };
        }

        return getCursorTrailProfileBeforeV35(
            choice
        );
    };

const cursorTrailParticleHtmlBeforeV35 =
    cursorTrailParticleHtml;

cursorTrailParticleHtml =
    function(
        profile
    ) {
        switch (
            profile?.type
        ) {
            case 'snowCrystal':
                return `
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                        <g fill="none" stroke="var(--trail-color)" stroke-width="1.8" stroke-linecap="round">
                            <path d="M12 2 L12 22"/>
                            <path d="M2 12 L22 12"/>
                            <path d="M4.2 4.2 L19.8 19.8"/>
                            <path d="M19.8 4.2 L4.2 19.8"/>
                            <path d="M12 2 L9.7 4.9 M12 2 L14.3 4.9"/>
                            <path d="M12 22 L9.7 19.1 M12 22 L14.3 19.1"/>
                            <path d="M2 12 L4.9 9.7 M2 12 L4.9 14.3"/>
                            <path d="M22 12 L19.1 9.7 M22 12 L19.1 14.3"/>
                        </g>
                        <circle cx="12" cy="12" r="2.2" fill="var(--trail-accent)" opacity=".95"/>
                    </svg>
                `;
            case 'rainbowArc':
                return `
                    <svg viewBox="0 0 30 22" aria-hidden="true">
                        <path d="M4 18 A11 11 0 0 1 26 18" fill="none" stroke="#ef4444" stroke-width="3" stroke-linecap="round"/>
                        <path d="M7 18 A8 8 0 0 1 23 18" fill="none" stroke="#f97316" stroke-width="2.6" stroke-linecap="round"/>
                        <path d="M9 18 A6 6 0 0 1 21 18" fill="none" stroke="#fde047" stroke-width="2.2" stroke-linecap="round"/>
                        <path d="M11 18 A4.5 4.5 0 0 1 19 18" fill="none" stroke="#22c55e" stroke-width="1.9" stroke-linecap="round"/>
                        <path d="M13 18 A3 3 0 0 1 17 18" fill="none" stroke="#3b82f6" stroke-width="1.6" stroke-linecap="round"/>
                        <circle cx="5.5" cy="17.5" r="2" fill="#ffffff" opacity=".85"/>
                        <circle cx="24.5" cy="17.5" r="2" fill="#ffffff" opacity=".85"/>
                    </svg>
                `;
            case 'paintSplat':
                return `
                    <svg viewBox="0 0 26 26" aria-hidden="true">
                        <path d="M13 4
                                 C14.8 1.6 18.5 1.9 19.6 5
                                 C22.7 4.4 24.8 7.6 23.2 10.1
                                 C25.7 11.5 25.2 15.2 22.2 16
                                 C22.8 19 20.1 21.1 17.3 20.2
                                 C16.3 23.2 12.3 23.9 10.2 21.4
                                 C7.6 23.4 4.1 22 3.8 18.9
                                 C0.9 18.5 0 14.8 2.3 13
                                 C0.5 10.8 1.7 7.4 4.9 7.2
                                 C5.2 4.2 8.8 2.9 11.1 4.8
                                 C11.8 4.3 12.2 4.1 13 4Z"
                              fill="var(--trail-color)"/>
                        <circle cx="8.2" cy="10.1" r="1.7" fill="var(--trail-accent)"/>
                        <circle cx="17.8" cy="9.2" r="1.5" fill="#60a5fa"/>
                        <circle cx="15.6" cy="16.5" r="1.8" fill="#facc15"/>
                    </svg>
                `;
            case 'petalBloom':
                return `
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                        <g transform="translate(12 12)">
                            <path d="M0 -8 C2.4 -8 3.9 -5.4 0 -1.8 C-3.9 -5.4 -2.4 -8 0 -8Z" fill="#f472b6"/>
                            <path d="M8 0 C8 2.4 5.4 3.9 1.8 0 C5.4 -3.9 8 -2.4 8 0Z" fill="#fb7185"/>
                            <path d="M0 8 C-2.4 8 -3.9 5.4 0 1.8 C3.9 5.4 2.4 8 0 8Z" fill="#f9a8d4"/>
                            <path d="M-8 0 C-8 -2.4 -5.4 -3.9 -1.8 0 C-5.4 3.9 -8 2.4 -8 0Z" fill="#ec4899"/>
                        </g>
                        <circle cx="12" cy="12" r="2.3" fill="#fef08a"/>
                        <path d="M12 14.2 C11.4 16.5 10 18 8 19.3" fill="none" stroke="var(--trail-accent)" stroke-width="1.6" stroke-linecap="round"/>
                    </svg>
                `;
            case 'mermaidScale':
                return `
                    <svg viewBox="0 0 28 24" aria-hidden="true">
                        <path d="M3 15
                                 C6.5 7.5 12.3 4.7 19 4
                                 C17.2 8 17.2 11.4 19 15
                                 C15.4 14.2 11.8 15 8.7 17.2
                                 C7.2 18.2 5.2 17.4 3 15Z"
                              fill="var(--trail-color)"/>
                        <path d="M18 4
                                 C22.5 4.2 25 7.1 25 12
                                 C25 16.3 22.5 19.3 18 20
                                 C19.3 17.3 19.3 14.7 18 12
                                 C19.3 9.2 19.3 6.8 18 4Z"
                              fill="var(--trail-accent)"/>
                        <path d="M7 13.7 C9.4 11.6 12.1 10.5 15 10.5" fill="none" stroke="#ccfbf1" stroke-width="1.4" stroke-linecap="round"/>
                    </svg>
                `;
            case 'dragonGlow':
                return `
                    <svg viewBox="0 0 28 22" aria-hidden="true">
                        <path d="M3 18
                                 C6 9.5 12.5 4 23 4
                                 L17.5 9.1
                                 L24.2 13.2
                                 L14.3 12.9
                                 L17.2 18
                                 C12.4 16.1 8.1 16 3 18Z"
                              fill="var(--trail-color)"/>
                        <path d="M6.3 15.2 C10.4 11.4 14.3 9 18.7 6.9" fill="none" stroke="var(--trail-accent)" stroke-width="1.5" stroke-linecap="round"/>
                        <circle cx="19.5" cy="6.2" r="1.4" fill="#ffffff"/>
                    </svg>
                `;
            default:
                return cursorTrailParticleHtmlBeforeV35(
                    profile
                );
        }
    };



// ============================================================
// V36 — THEME BUILDER IMAGE UPLOAD + PNG RENDERING FIX
// The user-facing UI says "Images". SVG + PNG both render through the
// same generic artwork pipeline in the Builder preview and applied theme.
// ============================================================

function getThemeImageKindV36(asset) {
    const source =
        String(
            asset?.url ||
            asset?.name ||
            ''
        )
            .split('?')[0]
            .split('#')[0]
            .toLowerCase();

    if (
        source.endsWith('.png') ||
        asset?.assetType ===
            'png'
    ) {
        return 'png';
    }

    return 'svg';
}

function renderThemeImageAssetV36(asset) {
    if (
        asset?.url
    ) {
        return `
            <img
                class="theme-decoration-image-v36 theme-decoration-${getThemeImageKindV36(asset)}-v36"
                src="${escapeCustomHtml(asset.url)}"
                alt=""
                draggable="false"
                decoding="async"
            >
        `;
    }

    return String(
        asset?.markup ||
        ''
    );
}

// Make the generic renderer authoritative for both SVG and PNG.
renderThemeBuilderSvgAsset =
    renderThemeImageAssetV36;

function polishThemeImageUploadUiV36(modal) {
    if (!modal) {
        return;
    }

    const input =
        modal.querySelector(
            '.theme-builder-svg-file'
        );

    if (input) {
        input.accept =
            '.svg,.png,.jpg,.jpeg,image/svg+xml,image/png,image/jpeg';

        input.setAttribute(
            'aria-label',
            'Upload images'
        );
    }

    const heading =
        modal.querySelector(
            '.theme-builder-svg-section .theme-builder-media-heading strong'
        );

    if (heading) {
        heading.textContent =
            'Theme Decorations';
    }

    const detail =
        modal.querySelector(
            '.theme-builder-svg-section .theme-builder-media-heading small'
        );

    if (detail) {
        detail.textContent =
            'Upload SVG, PNG, or JPG images for the theme background.';
    }

    const choose =
        modal.querySelector(
            '.theme-builder-svg-choose'
        );

    if (choose) {
        choose.innerHTML =
            '<i class="ph ph-upload-simple"></i> Upload Images';
    }

    const count =
        modal.querySelector(
            '.theme-builder-svg-count'
        );

    if (count) {
        const amount =
            modal
                ._themeBackgroundSvgs
                ?.length ||
            0;

        count.textContent =
            `${amount} image${amount === 1 ? '' : 's'}`;
    }

    const addMore =
        modal.querySelector(
            '.theme-builder-svg-add-card strong'
        );

    if (addMore) {
        addMore.textContent =
            'Upload more images';
    }

    const empty =
        modal.querySelector(
            '.theme-builder-svg-empty'
        );

    if (empty) {
        const strong =
            empty.querySelector(
                'strong'
            );

        const small =
            empty.querySelector(
                'span, small'
            );

        if (strong) {
            strong.textContent =
                'Upload images';
        }

        if (small) {
            small.textContent =
                'SVG and PNG files are supported.';
        }
    }
}

async function uploadThemeImagesV36(
    modal,
    input
) {
    const files =
        Array.from(
            input.files ||
            []
        );

    if (!files.length) {
        return;
    }

    for (
        const file of files
    ) {
        const lowerName =
            String(
                file.name ||
                ''
            )
                .toLowerCase();

        const valid =
            file.type ===
                'image/png' ||
            file.type ===
                'image/svg+xml' ||
            lowerName.endsWith(
                '.png'
            ) ||
            lowerName.endsWith(
                '.svg'
            );

        if (!valid) {
            showFeatureToast(
                `“${file.name}” is not an SVG or PNG image.`
            );

            continue;
        }

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
                    '',
                assetType:
                    lowerName.endsWith(
                        '.png'
                    ) ||
                    file.type ===
                        'image/png'
                        ? 'png'
                        : 'svg'
            });
    }

    input.value =
        '';

    renderThemeBuilderSvgListV2(
        modal
    );

    polishThemeImageUploadUiV36(
        modal
    );

    updateThemeBuilderPreview(
        modal
    );
}

function bindThemeImageUploadV36(modal) {
    const input =
        modal?.querySelector(
            '.theme-builder-svg-file'
        );

    const choose =
        modal?.querySelector(
            '.theme-builder-svg-choose'
        );

    if (
        !input ||
        !choose
    ) {
        return;
    }

    // Replace the old SVG-only handler instead of stacking another handler.
    choose.onclick =
        () =>
            input.click();

    input.onchange =
        () =>
            uploadThemeImagesV36(
                modal,
                input
            );
}

const populateThemeBuilderBeforeImagesV36 =
    populateThemeBuilder;

populateThemeBuilder =
    function(
        modal,
        theme
    ) {
        populateThemeBuilderBeforeImagesV36(
            modal,
            theme
        );

        bindThemeImageUploadV36(
            modal
        );

        polishThemeImageUploadUiV36(
            modal
        );
    };

const renderThemeBuilderSvgListBeforeImagesV36 =
    renderThemeBuilderSvgListV2;

renderThemeBuilderSvgListV2 =
    function(
        modal
    ) {
        renderThemeBuilderSvgListBeforeImagesV36(
            modal
        );

        polishThemeImageUploadUiV36(
            modal
        );

        modal
            .querySelectorAll(
                '.theme-builder-svg-card[data-svg-index]'
            )
            .forEach(
                card => {
                    card.title =
                        'Right-click to delete image';

                    const helper =
                        card.querySelector(
                            '.theme-builder-svg-card-copy small'
                        );

                    if (helper) {
                        helper.textContent =
                            'Right-click to delete image';
                    }

                    const remove =
                        card.querySelector(
                            '.theme-builder-svg-remove'
                        );

                    if (remove) {
                        remove.title =
                            'Delete image';

                        remove.setAttribute(
                            'aria-label',
                            'Delete image'
                        );
                    }
                }
            );
    };

// ------------------------------------------------------------
// Preview renderer — generic images, not SVG-only markup.
// ------------------------------------------------------------

renderAdvancedThemeBuilderSvgPreviewV10 =
    function(
        modal
    ) {
        const canvas =
            modal.querySelector(
                '.theme-builder-live-canvas'
            );

        if (!canvas) {
            return;
        }

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
            !draft.backgroundSvgs
                ?.length
        ) {
            return;
        }

        const stage =
            document.createElement(
                'div'
            );

        stage.className =
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
                const asset =
                    ensureSvgAdvancedDefaultsV10(
                        assignment.svg
                    );

                const item =
                    document.createElement(
                        'div'
                    );

                item.className =
                    `theme-builder-live-art-item theme-svg-anim-${asset.animation}`;

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
                    <div class="theme-svg-motion-shell theme-image-motion-shell-v36">
                        ${renderThemeImageAssetV36(asset)}
                    </div>
                `;

                item.addEventListener(
                    'pointerenter',
                    () => {
                        const url =
                            chooseThemeHoverSoundUrlV10(
                                draft,
                                asset
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

        canvas.prepend(
            stage
        );

        applyAutomaticIntroBoppersV23(
            stage,
            draft.introSvgBopMode ||
            'some'
        );
    };

// ------------------------------------------------------------
// Runtime renderer — same generic image pipeline used by the preview.
// ------------------------------------------------------------

mountCustomThemeBackgroundSvgsV2 =
    function(
        theme
    ) {
        const merged = {
            ...CUSTOM_THEME_ADVANCED_DEFAULTS_V10,
            ...(theme ||
                {})
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

        document
            .getElementById(
                'custom-theme-background-stage'
            )
            ?.remove();

        const stage =
            document.createElement(
                'div'
            );

        stage.id =
            'custom-theme-background-stage';

        stage.className =
            'custom-theme-background-stage theme-svg-effects-stage-v10 theme-image-stage-v36';

        assignments.forEach(
            (
                assignment,
                displayIndex
            ) => {
                const asset =
                    ensureSvgAdvancedDefaultsV10(
                        assignment.svg
                    );

                const item =
                    document.createElement(
                        'div'
                    );

                item.className =
                    `custom-theme-background-svg theme-svg-anim-${asset.animation}`;

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
                    <div class="theme-svg-motion-shell theme-image-motion-shell-v36">
                        ${renderThemeImageAssetV36(asset)}
                    </div>
                `;

                item.addEventListener(
                    'pointerenter',
                    () => {
                        const url =
                            chooseThemeHoverSoundUrlV10(
                                merged,
                                asset
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

        applyAutomaticIntroBoppersV23(
            stage,
            merged.introSvgBopMode ||
            'some'
        );
    };



// ============================================================
// V37 — VISUAL THEME ACCESSORIES + JPG + FILE-LIKE IMAGE SELECTION
// ============================================================

// ------------------------------------------------------------
// Generic image type support now includes JPG/JPEG.
// ------------------------------------------------------------

const getThemeImageKindBeforeJpgV37 =
    getThemeImageKindV36;

getThemeImageKindV36 =
    function(asset) {
        const source =
            String(
                asset?.url ||
                asset?.name ||
                ''
            )
                .split('?')[0]
                .split('#')[0]
                .toLowerCase();

        if (
            source.endsWith('.jpg') ||
            source.endsWith('.jpeg') ||
            asset?.assetType === 'jpg'
        ) {
            return 'jpg';
        }

        return getThemeImageKindBeforeJpgV37(
            asset
        );
    };

function isThemeImageFileV37(file) {
    const name =
        String(file?.name || '')
            .toLowerCase();

    return (
        file?.type === 'image/svg+xml' ||
        file?.type === 'image/png' ||
        file?.type === 'image/jpeg' ||
        name.endsWith('.svg') ||
        name.endsWith('.png') ||
        name.endsWith('.jpg') ||
        name.endsWith('.jpeg')
    );
}

function getUploadedThemeImageTypeV37(file) {
    const name =
        String(file?.name || '')
            .toLowerCase();

    if (
        file?.type === 'image/jpeg' ||
        name.endsWith('.jpg') ||
        name.endsWith('.jpeg')
    ) {
        return 'jpg';
    }

    if (
        file?.type === 'image/png' ||
        name.endsWith('.png')
    ) {
        return 'png';
    }

    return 'svg';
}

uploadThemeImagesV36 =
    async function(modal, input) {
        const files =
            Array.from(
                input.files ||
                []
            );

        if (!files.length) {
            return;
        }

        for (const file of files) {
            if (!isThemeImageFileV37(file)) {
                showFeatureToast(
                    `“${file.name}” is not an SVG, PNG, or JPG image.`
                );
                continue;
            }

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
                    name: file.name,
                    url: saved.url,
                    projectPath:
                        saved.projectPath ||
                        '',
                    assetType:
                        getUploadedThemeImageTypeV37(
                            file
                        )
                });
        }

        input.value = '';

        renderThemeBuilderSvgListV2(
            modal
        );

        polishThemeImageUploadUiV36(
            modal
        );

        updateThemeBuilderPreview(
            modal
        );
    };

const polishThemeImageUploadUiBeforeJpgV37 =
    polishThemeImageUploadUiV36;

polishThemeImageUploadUiV36 =
    function(modal) {
        polishThemeImageUploadUiBeforeJpgV37(
            modal
        );

        const input =
            modal?.querySelector(
                '.theme-builder-svg-file'
            );

        if (input) {
            input.accept =
                '.svg,.png,.jpg,.jpeg,image/svg+xml,image/png,image/jpeg';
        }

        const detail =
            modal?.querySelector(
                '.theme-builder-svg-section .theme-builder-media-heading small'
            );

        if (detail) {
            detail.textContent =
                'Upload SVG, PNG, or JPG images for the theme background.';
        }

        const empty =
            modal?.querySelector(
                '.theme-builder-svg-empty'
            );

        const helper =
            empty?.querySelector(
                'span, small'
            );

        if (helper) {
            helper.textContent =
                'SVG, PNG, and JPG files are supported.';
        }
    };

// ------------------------------------------------------------
// Visual cursor gallery
// ------------------------------------------------------------

function themeCursorPreviewMarkupV37(cursor) {
    if (
        cursor?.kind === 'image' &&
        cursor?.svg
    ) {
        return `
            <span class="theme-accessory-art-v37">
                ${cursor.svg}
            </span>
        `;
    }

    if (cursor?.emoji) {
        return `
            <span class="theme-accessory-emoji-v37">
                ${escapeCustomHtml(cursor.emoji)}
            </span>
        `;
    }

    return `
        <span class="theme-accessory-default-v37">
            <i class="ph ph-cursor"></i>
        </span>
    `;
}

function themeCompanionPreviewMarkupV37(companion) {
    if (
        companion?.svg
    ) {
        return `
            <span class="theme-accessory-art-v37 theme-companion-art-v37">
                ${makeCompanionSvgIdsUnique(
                    companion.svg,
                    `theme-builder-companion-${companion.id}`
                )}
            </span>
        `;
    }

    if (
        companion?.emoji
    ) {
        return `
            <span class="theme-accessory-emoji-v37">
                ${escapeCustomHtml(companion.emoji)}
            </span>
        `;
    }

    return `
        <span class="theme-accessory-default-v37">
            <i class="ph ph-user"></i>
        </span>
    `;
}

function installThemeAccessoryGalleriesV37(modal) {
    const section =
        modal?.querySelector(
            '.theme-builder-accessories-v32'
        );

    if (!section) {
        return;
    }

    const cursorField =
        section.querySelector(
            '.theme-builder-cursor-choice-v32'
        );

    const cursorSelect =
        cursorField?.querySelector(
            'select'
        );

    if (
        cursorField &&
        cursorSelect
    ) {
        cursorSelect.classList.add(
            'theme-accessory-native-select-v37'
        );

        let gallery =
            cursorField.querySelector(
                '.theme-cursor-gallery-v37'
            );

        if (!gallery) {
            gallery =
                document.createElement(
                    'div'
                );

            gallery.className =
                'theme-accessory-gallery-v37 theme-cursor-gallery-v37';

            cursorField.appendChild(
                gallery
            );
        }

        gallery.innerHTML = '';

        CURSOR_OPTIONS.forEach(
            cursor => {
                const button =
                    document.createElement(
                        'button'
                    );

                button.type = 'button';

                button.className =
                    'theme-accessory-card-v37 theme-cursor-card-v37';

                button.dataset.cursorId =
                    cursor.id;

                button.innerHTML = `
                    <span class="theme-accessory-preview-v37">
                        ${themeCursorPreviewMarkupV37(cursor)}
                    </span>
                    <span class="theme-accessory-name-v37">
                        ${escapeCustomHtml(cursor.name)}
                    </span>
                `;

                button.addEventListener(
                    'click',
                    () => {
                        cursorSelect.value =
                            cursor.id;

                        cursorSelect.dispatchEvent(
                            new Event(
                                'change',
                                {
                                    bubbles: true
                                }
                            )
                        );

                        refreshThemeAccessoryGallerySelectionV37(
                            modal
                        );
                    }
                );

                gallery.appendChild(
                    button
                );
            }
        );
    }

    const companionField =
        section.querySelector(
            '.theme-builder-companion-choice-v32'
        );

    const companionSelect =
        companionField?.querySelector(
            'select'
        );

    if (
        companionField &&
        companionSelect
    ) {
        companionSelect.classList.add(
            'theme-accessory-native-select-v37'
        );

        let gallery =
            companionField.querySelector(
                '.theme-companion-gallery-v37'
            );

        if (!gallery) {
            gallery =
                document.createElement(
                    'div'
                );

            gallery.className =
                'theme-accessory-gallery-v37 theme-companion-gallery-v37';

            companionField.appendChild(
                gallery
            );
        }

        gallery.innerHTML = '';

        const choices = [
            {
                id: 'none',
                name: 'None',
                emoji: '∅'
            },
            ...COMPANIONS
        ];

        choices.forEach(
            companion => {
                const button =
                    document.createElement(
                        'button'
                    );

                button.type = 'button';

                button.className =
                    'theme-accessory-card-v37 theme-companion-card-v37';

                button.dataset.companionId =
                    companion.id;

                button.innerHTML = `
                    <span class="theme-accessory-preview-v37">
                        ${themeCompanionPreviewMarkupV37(companion)}
                    </span>
                    <span class="theme-accessory-name-v37">
                        ${escapeCustomHtml(companion.name)}
                    </span>
                `;

                button.addEventListener(
                    'click',
                    () => {
                        companionSelect.value =
                            companion.id;

                        companionSelect.dispatchEvent(
                            new Event(
                                'change',
                                {
                                    bubbles: true
                                }
                            )
                        );

                        refreshThemeAccessoryGallerySelectionV37(
                            modal
                        );
                    }
                );

                gallery.appendChild(
                    button
                );
            }
        );
    }

    refreshThemeAccessoryGallerySelectionV37(
        modal
    );
}

function refreshThemeAccessoryGallerySelectionV37(modal) {
    const section =
        modal?.querySelector(
            '.theme-builder-accessories-v32'
        );

    if (!section) {
        return;
    }

    const cursor =
        section.querySelector(
            '.theme-builder-cursor-choice-v32 select'
        )?.value;

    section
        .querySelectorAll(
            '.theme-cursor-card-v37'
        )
        .forEach(
            card => {
                card.classList.toggle(
                    'selected',
                    card.dataset.cursorId ===
                        cursor
                );
            }
        );

    const companion =
        section.querySelector(
            '.theme-builder-companion-choice-v32 select'
        )?.value;

    section
        .querySelectorAll(
            '.theme-companion-card-v37'
        )
        .forEach(
            card => {
                card.classList.toggle(
                    'selected',
                    card.dataset.companionId ===
                        companion
                );
            }
        );
}

const ensureThemeAccessoryControlsBeforeVisualV37 =
    ensureThemeAccessoryControlsV32;

ensureThemeAccessoryControlsV32 =
    function(modal, theme = {}) {
        ensureThemeAccessoryControlsBeforeVisualV37(
            modal,
            theme
        );

        installThemeAccessoryGalleriesV37(
            modal
        );
    };

// ------------------------------------------------------------
// File-like multi-selection for Theme Images
// ------------------------------------------------------------

function ensureThemeImageSelectionV37(modal) {
    if (!modal) {
        return new Set();
    }

    if (
        !(modal._themeImageSelectionV37 instanceof Set)
    ) {
        modal._themeImageSelectionV37 =
            new Set();
    }

    return modal._themeImageSelectionV37;
}

function selectedThemeImageIndexesV37(modal) {
    return Array.from(
        ensureThemeImageSelectionV37(
            modal
        )
    )
        .map(Number)
        .filter(Number.isFinite)
        .sort((a, b) => a - b);
}

function refreshThemeImageSelectionV37(modal) {
    const selected =
        ensureThemeImageSelectionV37(
            modal
        );

    modal
        .querySelectorAll(
            '.theme-builder-svg-card[data-svg-index]'
        )
        .forEach(
            card => {
                card.classList.toggle(
                    'theme-image-selected-v37',
                    selected.has(
                        Number(
                            card.dataset
                                .svgIndex
                        )
                    )
                );
            }
        );
}

function selectSingleThemeImageV37(
    modal,
    index
) {
    const selected =
        ensureThemeImageSelectionV37(
            modal
        );

    selected.clear();
    selected.add(index);

    modal._themeImageSelectionAnchorV37 =
        index;

    refreshThemeImageSelectionV37(
        modal
    );
}

function toggleThemeImageSelectionV37(
    modal,
    index
) {
    const selected =
        ensureThemeImageSelectionV37(
            modal
        );

    if (selected.has(index)) {
        selected.delete(index);
    } else {
        selected.add(index);
    }

    modal._themeImageSelectionAnchorV37 =
        index;

    refreshThemeImageSelectionV37(
        modal
    );
}

function selectThemeImageRangeV37(
    modal,
    index
) {
    const selected =
        ensureThemeImageSelectionV37(
            modal
        );

    const anchor =
        Number.isFinite(
            Number(
                modal._themeImageSelectionAnchorV37
            )
        )
            ? Number(
                modal._themeImageSelectionAnchorV37
            )
            : index;

    const start =
        Math.min(
            anchor,
            index
        );

    const end =
        Math.max(
            anchor,
            index
        );

    selected.clear();

    for (
        let i = start;
        i <= end;
        i++
    ) {
        selected.add(i);
    }

    refreshThemeImageSelectionV37(
        modal
    );
}

async function deleteSelectedThemeImagesV37(
    modal,
    explicitIndexes = null
) {
    const indexes =
        (
            explicitIndexes ||
            selectedThemeImageIndexesV37(
                modal
            )
        )
            .map(Number)
            .filter(Number.isFinite)
            .sort((a, b) => b - a);

    if (!indexes.length) {
        return;
    }

    const confirmed =
        await showAppConfirm({
            title:
                indexes.length === 1
                    ? 'Delete this image?'
                    : `Delete ${indexes.length} images?`,
            message:
                indexes.length === 1
                    ? 'This image will be removed from the theme.'
                    : 'The selected images will be removed from the theme.',
            confirmLabel:
                indexes.length === 1
                    ? 'Delete Image'
                    : 'Delete Images'
        });

    if (!confirmed) {
        return;
    }

    const assets =
        modal._themeBackgroundSvgs ||
        [];

    const toDelete =
        indexes
            .map(
                index =>
                    assets[index]
            )
            .filter(Boolean);

    // Delete project files where appropriate, matching the old single-delete behavior.
    for (const asset of toDelete) {
        const projectPath =
            asset?.projectPath ||
            '';

        if (
            projectPath &&
            !asset?.inheritedBuiltInV30
        ) {
            try {
                await deleteThemeBuilderAssetFromProject(
                    projectPath
                );
            } catch {}
        }
    }

    indexes.forEach(
        index => {
            assets.splice(
                index,
                1
            );
        }
    );

    modal._themeImageSelectionV37 =
        new Set();

    modal._themeImageSelectionAnchorV37 =
        null;

    if (
        modal.dataset
            .themeBuilderBuiltInSourceV30
    ) {
        modal._builtInArtDirtyV30 =
            true;
    }

    renderThemeBuilderSvgListV2(
        modal
    );

    updateThemeBuilderPreview(
        modal
    );
}

function showThemeImageContextMenuV37(
    modal,
    event,
    index
) {
    const selected =
        ensureThemeImageSelectionV37(
            modal
        );

    if (!selected.has(index)) {
        selectSingleThemeImageV37(
            modal,
            index
        );
    }

    const count =
        selectedThemeImageIndexesV37(
            modal
        ).length;

    showCustomItemContextMenu(
        event.clientX,
        event.clientY,
        [
            {
                label:
                    count > 1
                        ? `Delete ${count} Images`
                        : 'Delete Image',
                icon:
                    'ph-trash',
                danger:
                    true,
                action:
                    () =>
                        deleteSelectedThemeImagesV37(
                            modal
                        )
            }
        ]
    );
}

function bindThemeImageFileSelectionV37(
    modal
) {
    const host =
        modal?.querySelector(
            '.theme-builder-svg-list'
        );

    if (
        !host ||
        host.dataset
            .fileSelectionV37 ===
            'true'
    ) {
        refreshThemeImageSelectionV37(
            modal
        );
        return;
    }

    host.dataset
        .fileSelectionV37 =
        'true';

    let marquee =
        null;

    let dragging =
        false;

    let startX =
        0;

    let startY =
        0;

    host.addEventListener(
        'click',
        event => {
            const card =
                event.target.closest(
                    '.theme-builder-svg-card[data-svg-index]'
                );

            if (!card) {
                return;
            }

            const index =
                Number(
                    card.dataset.svgIndex
                );

            if (event.shiftKey) {
                selectThemeImageRangeV37(
                    modal,
                    index
                );
            } else if (
                event.ctrlKey ||
                event.metaKey
            ) {
                toggleThemeImageSelectionV37(
                    modal,
                    index
                );
            } else {
                selectSingleThemeImageV37(
                    modal,
                    index
                );
            }
        },
        true
    );

    host.addEventListener(
        'contextmenu',
        event => {
            const card =
                event.target.closest(
                    '.theme-builder-svg-card[data-svg-index]'
                );

            if (!card) {
                return;
            }

            event.preventDefault();
            event.stopImmediatePropagation();

            showThemeImageContextMenuV37(
                modal,
                event,
                Number(
                    card.dataset.svgIndex
                )
            );
        },
        true
    );

    host.addEventListener(
        'pointerdown',
        event => {
            if (
                event.button !== 0 ||
                event.target.closest(
                    '.theme-builder-svg-card[data-svg-index], .theme-builder-svg-add-card'
                )
            ) {
                return;
            }

            dragging = true;

            const bounds =
                host.getBoundingClientRect();

            startX =
                event.clientX -
                bounds.left +
                host.scrollLeft;

            startY =
                event.clientY -
                bounds.top +
                host.scrollTop;

            marquee =
                document.createElement(
                    'div'
                );

            marquee.className =
                'theme-image-selection-marquee-v37';

            host.appendChild(
                marquee
            );

            if (
                !event.shiftKey &&
                !event.ctrlKey &&
                !event.metaKey
            ) {
                ensureThemeImageSelectionV37(
                    modal
                ).clear();
            }

            host.setPointerCapture?.(
                event.pointerId
            );
        }
    );

    host.addEventListener(
        'pointermove',
        event => {
            if (
                !dragging ||
                !marquee
            ) {
                return;
            }

            const bounds =
                host.getBoundingClientRect();

            const currentX =
                event.clientX -
                bounds.left +
                host.scrollLeft;

            const currentY =
                event.clientY -
                bounds.top +
                host.scrollTop;

            const left =
                Math.min(
                    startX,
                    currentX
                );

            const top =
                Math.min(
                    startY,
                    currentY
                );

            const width =
                Math.abs(
                    currentX -
                    startX
                );

            const height =
                Math.abs(
                    currentY -
                    startY
                );

            Object.assign(
                marquee.style,
                {
                    left:
                        `${left}px`,
                    top:
                        `${top}px`,
                    width:
                        `${width}px`,
                    height:
                        `${height}px`
                }
            );

            const marqueeRect =
                marquee.getBoundingClientRect();

            const selected =
                ensureThemeImageSelectionV37(
                    modal
                );

            host
                .querySelectorAll(
                    '.theme-builder-svg-card[data-svg-index]'
                )
                .forEach(
                    card => {
                        const rect =
                            card.getBoundingClientRect();

                        const intersects =
                            !(
                                rect.right <
                                    marqueeRect.left ||
                                rect.left >
                                    marqueeRect.right ||
                                rect.bottom <
                                    marqueeRect.top ||
                                rect.top >
                                    marqueeRect.bottom
                            );

                        const index =
                            Number(
                                card.dataset
                                    .svgIndex
                            );

                        if (intersects) {
                            selected.add(
                                index
                            );
                        } else if (
                            !event.shiftKey &&
                            !event.ctrlKey &&
                            !event.metaKey
                        ) {
                            selected.delete(
                                index
                            );
                        }
                    }
                );

            refreshThemeImageSelectionV37(
                modal
            );
        }
    );

    const finishDrag =
        event => {
            if (!dragging) {
                return;
            }

            dragging = false;

            marquee?.remove();

            marquee = null;

            try {
                host.releasePointerCapture?.(
                    event.pointerId
                );
            } catch {}
        };

    host.addEventListener(
        'pointerup',
        finishDrag
    );

    host.addEventListener(
        'pointercancel',
        finishDrag
    );
}

const renderThemeBuilderSvgListBeforeFileModeV37 =
    renderThemeBuilderSvgListV2;

renderThemeBuilderSvgListV2 =
    function(modal) {
        renderThemeBuilderSvgListBeforeFileModeV37(
            modal
        );

        modal
            .querySelectorAll(
                '.theme-builder-svg-remove'
            )
            .forEach(
                button =>
                    button.remove()
            );

        modal
            .querySelectorAll(
                '.theme-builder-svg-card[data-svg-index]'
            )
            .forEach(
                card => {
                    card.title =
                        'Click to select · Shift-click for a range · Right-click to delete';

                    const helper =
                        card.querySelector(
                            '.theme-builder-svg-card-copy small'
                        );

                    if (helper) {
                        helper.textContent =
                            'Select like a file';
                    }
                }
            );

        bindThemeImageFileSelectionV37(
            modal
        );

        refreshThemeImageSelectionV37(
            modal
        );
    };

const populateThemeBuilderBeforeFileModeV37 =
    populateThemeBuilder;

populateThemeBuilder =
    function(modal, theme) {
        populateThemeBuilderBeforeFileModeV37(
            modal,
            theme
        );

        installThemeAccessoryGalleriesV37(
            modal
        );

        bindThemeImageFileSelectionV37(
            modal
        );

        polishThemeImageUploadUiV36(
            modal
        );
    };



// ============================================================
// V38 — CLICKABLE @DAY REFERENCES IN DAILY LOG NOTES
// Type @Day 14 or @ Day 14, then press Space. It becomes a clickable link.
// ============================================================

function insertDayReferenceAtRangeV38(
    range,
    dayNumber,
    displayText
) {
    if (
        !range ||
        !Number.isFinite(
            Number(
                dayNumber
            )
        ) ||
        Number(
            dayNumber
        ) <
            1
    ) {
        return null;
    }

    const day =
        Math.floor(
            Number(
                dayNumber
            )
        );

    const link =
        document.createElement(
            'a'
        );

    link.href =
        `#day-${day}`;

    link.className =
        'notes-day-link-v38';

    link.dataset.day =
        String(day);

    link.contentEditable =
        'false';

    link.title =
        `Open Day ${day}`;

    link.textContent =
        displayText ||
        `@Day ${day}`;

    range.deleteContents();
    range.insertNode(
        link
    );

    return link;
}

function tryConvertTypedDayMentionV38(
    event
) {
    if (
        event.key !==
            ' ' ||
        event.ctrlKey ||
        event.metaKey ||
        event.altKey
    ) {
        return;
    }

    const notes =
        document.getElementById(
            'log-notes'
        );

    if (!notes) {
        return;
    }

    const selection =
        window.getSelection();

    if (
        !selection ||
        !selection.rangeCount
    ) {
        return;
    }

    const activeRange =
        selection.getRangeAt(
            0
        );

    if (
        !activeRange.collapsed ||
        !notes.contains(
            activeRange.startContainer
        )
    ) {
        return;
    }

    const node =
        activeRange.startContainer;

    if (
        node.nodeType !==
        Node.TEXT_NODE
    ) {
        return;
    }

    const before =
        node.data.slice(
            0,
            activeRange.startOffset
        );

    const match =
        before.match(
            /(?:^|\s)(@(?:\s*)Day\s+(\d+))$/i
        );

    if (!match) {
        return;
    }

    const day =
        Number(
            match[2]
        );

    if (
        !Number.isFinite(day) ||
        day <
            1
    ) {
        return;
    }

    event.preventDefault();

    const mentionText =
        match[1]
            .replace(
                /^@\s*Day/i,
                '@Day'
            );

    const start =
        activeRange.startOffset -
        match[1].length;

    const mentionRange =
        document.createRange();

    mentionRange.setStart(
        node,
        start
    );

    mentionRange.setEnd(
        node,
        activeRange.startOffset
    );

    const link =
        insertDayReferenceAtRangeV38(
            mentionRange,
            day,
            mentionText
        );

    if (!link) {
        return;
    }

    const spacer =
        document.createTextNode(
            ' '
        );

    link.after(
        spacer
    );

    const nextRange =
        document.createRange();

    nextRange.setStartAfter(
        spacer
    );

    nextRange.collapse(
        true
    );

    selection.removeAllRanges();

    selection.addRange(
        nextRange
    );

    if (currentDay) {
        db.days[currentDay]
            .notes =
            notes.innerHTML;

        scheduleSaveDay();
    }
}

const logNotesV38 =
    document.getElementById(
        'log-notes'
    );

if (
    logNotesV38 &&
    logNotesV38.dataset
        .dayLinksV38 !==
        'true'
) {
    logNotesV38.dataset
        .dayLinksV38 =
        'true';

    logNotesV38.addEventListener(
        'keydown',
        tryConvertTypedDayMentionV38,
        true
    );

    logNotesV38.addEventListener(
        'click',
        event => {
            const link =
                event.target.closest(
                    '.notes-day-link-v38[data-day]'
                );

            if (!link) {
                return;
            }

            event.preventDefault();
            event.stopPropagation();

            const day =
                Number(
                    link.dataset.day
                );

            if (
                Number.isFinite(day) &&
                day >=
                    1
            ) {
                openDayLog(
                    day
                );
            }
        }
    );
}



// ============================================================
// V349 — TRASH NAV BUTTON PERMANENTLY REMOVED
// Trash remains available through Settings/Trash UI, but no runtime is allowed
// to create, insert, or restore #open-trash-view-btn in the Log page navbar.
// ============================================================

function placeTrashAboveSideNavDividerV39() {
    document.getElementById('open-trash-view-btn')?.remove();
    return null;
}

ensureTrashNavButtonV2 = function() {
    document.getElementById('open-trash-view-btn')?.remove();
    return null;
};

// Do not wrap ensureGlobalDailySettingsNavButton or renderCustomTabNavigation.
// The historical V39 wrappers were the code that recreated the trash icon.

// ============================================================
// V40 — THEME SEARCH RESET / IMAGE UPLOAD UX / CENTER SCALING
// MANUAL FIXED PLACEMENT / DASHBOARD PREVIEW + SHARED THEMES
// ============================================================

const SHARED_THEME_LIBRARY_KEY_V40 =
    'loggy-shared-themes-v40';

// ------------------------------------------------------------
// Theme search always starts empty.
// ------------------------------------------------------------

function clearThemeSearchV40() {
    if (!themeSearchInput) {
        return;
    }

    themeSearchInput.value =
        '';

    themeSearchInput.dataset
        .previousThemeSearchValue =
        '';

    filterThemePicker(
        ''
    );
}

const openGlobalThemeSettingsBeforeClearV40 =
    openGlobalThemeSettings;

openGlobalThemeSettings =
    function() {
        clearThemeSearchV40();

        openGlobalThemeSettingsBeforeClearV40();

        requestAnimationFrame(
            () => {
                clearThemeSearchV40();

                themeSearchInput
                    ?.focus({
                        preventScroll:
                            true
                    });
            }
        );
    };

// The user's Ctrl+Shift chord is treated as "fresh theme search".
document.addEventListener(
    'keydown',
    event => {
        if (
            event.ctrlKey &&
            event.shiftKey
        ) {
            clearThemeSearchV40();
        }
    },
    true
);


// ------------------------------------------------------------
// Upload Images: the dashed gallery control itself opens the picker.
// ------------------------------------------------------------

function polishThemeImageUploadV40(
    modal
) {
    if (!modal) {
        return;
    }

    polishThemeImageUploadUiV36(
        modal
    );

    const section =
        modal.querySelector(
            '.theme-builder-svg-section'
        );

    const input =
        section?.querySelector(
            '.theme-builder-svg-file'
        );

    const toolbarButton =
        section?.querySelector(
            '.theme-builder-svg-choose'
        );

    if (toolbarButton) {
        toolbarButton.classList.add(
            'theme-image-upload-toolbar-hidden-v40'
        );
    }

    const addCard =
        section?.querySelector(
            '.theme-builder-svg-add-card'
        );

    if (addCard) {
        addCard.classList.add(
            'theme-image-upload-dropzone-v40'
        );

        addCard.setAttribute(
            'role',
            'button'
        );

        addCard.setAttribute(
            'tabindex',
            '0'
        );

        addCard.setAttribute(
            'aria-label',
            'Upload Images'
        );

        const strong =
            addCard.querySelector(
                'strong'
            );

        if (strong) {
            strong.textContent =
                'Upload Images';
        }

        const helper =
            addCard.querySelector(
                'small, span:not(.theme-builder-svg-card-preview)'
            );

        if (helper) {
            helper.textContent =
                'SVG, PNG, JPG, or JPEG';
        }

        if (
            addCard.dataset
                .uploadImagesV40 !==
            'true'
        ) {
            addCard.dataset
                .uploadImagesV40 =
                'true';

            const open =
                event => {
                    if (
                        event.type ===
                            'keydown' &&
                        ![
                            'Enter',
                            ' '
                        ].includes(
                            event.key
                        )
                    ) {
                        return;
                    }

                    event.preventDefault();

                    input?.click();
                };

            addCard.addEventListener(
                'click',
                open
            );

            addCard.addEventListener(
                'keydown',
                open
            );
        }
    }

    // Old empty-state copy looked clickable without actually being the control.
    section
        ?.querySelector(
            '.theme-builder-svg-empty'
        )
        ?.remove();
}

const renderThemeBuilderSvgListBeforeUploadPolishV40 =
    renderThemeBuilderSvgListV2;

renderThemeBuilderSvgListV2 =
    function(
        modal
    ) {
        renderThemeBuilderSvgListBeforeUploadPolishV40(
            modal
        );

        polishThemeImageUploadV40(
            modal
        );
    };


// ------------------------------------------------------------
// Manual placement mode.
// Positions are saved; artwork is shuffled into those saved positions
// each time the theme is applied/reloaded.
// ------------------------------------------------------------

const normalizeSvgPlacementModeBeforeManualV40 =
    normalizeSvgPlacementModeV26;

normalizeSvgPlacementModeV26 =
    function(
        value
    ) {
        if (
            value ===
            'manual-fixed'
        ) {
            return 'manual-fixed';
        }

        return normalizeSvgPlacementModeBeforeManualV40(
            value
        );
    };

function normalizeManualSlotsV40(
    slots,
    count
) {
    const source =
        Array.isArray(
            slots
        )
            ? slots
            : [];

    const result = [];

    for (
        let index = 0;
        index < count;
        index++
    ) {
        const point =
            source[index];

        const fallbackAngle =
            (
                index /
                Math.max(
                    1,
                    count
                )
            ) *
            Math.PI *
            2;

        result.push({
            x:
                Number.isFinite(
                    Number(
                        point?.x
                    )
                )
                    ? Math.max(
                        3,
                        Math.min(
                            97,
                            Number(
                                point.x
                            )
                        )
                    )
                    : 50 +
                        Math.cos(
                            fallbackAngle
                        ) *
                        32,
            y:
                Number.isFinite(
                    Number(
                        point?.y
                    )
                )
                    ? Math.max(
                        4,
                        Math.min(
                            96,
                            Number(
                                point.y
                            )
                        )
                    )
                    : 50 +
                        Math.sin(
                            fallbackAngle
                        ) *
                        32
        });
    }

    return result;
}

function shuffledEntriesV40(
    entries
) {
    const copy =
        entries.map(
            entry => ({
                ...entry
            })
        );

    for (
        let index =
            copy.length -
            1;
        index >
            0;
        index--
    ) {
        const other =
            Math.floor(
                Math.random() *
                (
                    index +
                    1
                )
            );

        [
            copy[index],
            copy[other]
        ] = [
            copy[other],
            copy[index]
        ];
    }

    return copy;
}

const ensureThemeBuilderPlacementUiBeforeManualV40 =
    ensureThemeBuilderPlacementUiV26;

ensureThemeBuilderPlacementUiV26 =
    function(
        modal,
        theme = {}
    ) {
        ensureThemeBuilderPlacementUiBeforeManualV40(
            modal,
            theme
        );

        const select =
            modal?.querySelector(
                '.theme-builder-svg-distribution'
            );

        if (!select) {
            return;
        }

        if (
            !select.querySelector(
                'option[value="manual-fixed"]'
            )
        ) {
            const option =
                document.createElement(
                    'option'
                );

            option.value =
                'manual-fixed';

            option.textContent =
                'Manual fixed positions · shuffle images';

            select.appendChild(
                option
            );
        }

        if (
            theme.svgDistribution ===
            'manual-fixed'
        ) {
            select.value =
                'manual-fixed';
        }

        let hint =
            modal.querySelector(
                '.theme-builder-manual-placement-hint-v40'
            );

        if (!hint) {
            hint =
                document.createElement(
                    'div'
                );

            hint.className =
                'theme-builder-manual-placement-hint-v40';

            hint.innerHTML = `
                <i class="ph ph-hand-grabbing"></i>
                <span>
                    Manual placement: drag images directly in the preview.
                    Their positions stay fixed, but which image appears in each position is shuffled on reload.
                </span>
            `;

            select
                .closest(
                    '.theme-builder-field'
                )
                ?.insertAdjacentElement(
                    'afterend',
                    hint
                );
        }

        hint.classList.toggle(
            'hidden',
            select.value !==
                'manual-fixed'
        );

        if (
            select.dataset
                .manualPlacementV40 !==
            'true'
        ) {
            select.dataset
                .manualPlacementV40 =
                'true';

            select.addEventListener(
                'change',
                () => {
                    hint.classList.toggle(
                        'hidden',
                        select.value !==
                            'manual-fixed'
                    );

                    if (
                        select.value ===
                            'manual-fixed'
                    ) {
                        const draft =
                            getThemeBuilderDraft(
                                modal
                            );

                        const existing =
                            Array.isArray(
                                modal
                                    ._manualPlacementSlotsV40
                            )
                                ? modal
                                    ._manualPlacementSlotsV40
                                : [];

                        if (!existing.length) {
                            const prior =
                                buildThemePlacementPointsV26(
                                    'balanced-spread',
                                    draft
                                        .backgroundSvgs
                                        ?.length ||
                                        0,
                                    {
                                        seed:
                                            modal
                                                ._themePreviewDistributionSeedV10,
                                        allowOverlap:
                                            true,
                                        svgGlobalScale:
                                            draft
                                                .svgGlobalScale
                                    }
                                );

                            modal._manualPlacementSlotsV40 =
                                normalizeManualSlotsV40(
                                    prior,
                                    draft
                                        .backgroundSvgs
                                        ?.length ||
                                        0
                                );
                        }
                    }

                    updateThemeBuilderPreview(
                        modal
                    );
                }
            );
        }
    };

const getThemeBuilderDraftBeforeManualV40 =
    getThemeBuilderDraft;

getThemeBuilderDraft =
    function(
        modal
    ) {
        const draft =
            getThemeBuilderDraftBeforeManualV40(
                modal
            );

        draft.manualPlacementSlotsV40 =
            normalizeManualSlotsV40(
                modal?._manualPlacementSlotsV40 ||
                draft
                    .manualPlacementSlotsV40,
                draft
                    .backgroundSvgs
                    ?.length ||
                    0
            );

        return draft;
    };

const populateThemeBuilderBeforeManualV40 =
    populateThemeBuilder;

populateThemeBuilder =
    function(
        modal,
        theme
    ) {
        populateThemeBuilderBeforeManualV40(
            modal,
            theme
        );

        modal._manualPlacementSlotsV40 =
            normalizeManualSlotsV40(
                theme
                    ?.manualPlacementSlotsV40,
                modal
                    ._themeBackgroundSvgs
                    ?.length ||
                    0
            );

        ensureThemeBuilderPlacementUiV26(
            modal,
            theme ||
                {}
        );

        polishThemeImageUploadV40(
            modal
        );

        ensureDashboardThemeControlsV40(
            modal,
            theme ||
                {}
        );

        ensureThemeBuilderDashboardPreviewV40(
            modal
        );
    };

const getPreviewSvgAssignmentsBeforeManualV40 =
    getPreviewSvgAssignmentsV10;

getPreviewSvgAssignmentsV10 =
    function(
        modal,
        draft
    ) {
        if (
            draft
                ?.svgDistribution !==
            'manual-fixed'
        ) {
            return getPreviewSvgAssignmentsBeforeManualV40(
                modal,
                draft
            );
        }

        const entries =
            makePlacementEntriesV26(
                draft
            );

        const points =
            normalizeManualSlotsV40(
                modal
                    ?._manualPlacementSlotsV40 ||
                draft
                    .manualPlacementSlotsV40,
                entries.length
            );

        modal._manualPlacementSlotsV40 =
            points.map(
                point => ({
                    ...point
                })
            );

        return entries.map(
            (
                entry,
                index
            ) => ({
                ...entry,
                left:
                    points[index]
                        ?.x ??
                    50,
                top:
                    points[index]
                        ?.y ??
                    50
            })
        );
    };

const getRuntimeSvgAssignmentsBeforeManualV40 =
    getRuntimeSvgAssignmentsV10;

getRuntimeSvgAssignmentsV10 =
    function(
        theme
    ) {
        if (
            theme
                ?.svgDistribution !==
            'manual-fixed'
        ) {
            return getRuntimeSvgAssignmentsBeforeManualV40(
                theme
            );
        }

        const entries =
            shuffledEntriesV40(
                makePlacementEntriesV26(
                    theme
                )
            );

        const points =
            normalizeManualSlotsV40(
                theme
                    .manualPlacementSlotsV40,
                entries.length
            );

        return entries.map(
            (
                entry,
                index
            ) => ({
                ...entry,
                left:
                    points[index]
                        ?.x ??
                    50,
                top:
                    points[index]
                        ?.y ??
                    50
            })
        );
    };

function bindManualImageDraggingV40(
    modal
) {
    const canvas =
        modal?.querySelector(
            '.theme-builder-live-canvas'
        );

    if (!canvas) {
        return;
    }

    canvas
        .querySelectorAll(
            '.theme-builder-live-art-item[data-svg-index]'
        )
        .forEach(
            item => {
                if (
                    item.dataset
                        .manualDragV40 ===
                    'true'
                ) {
                    return;
                }

                item.dataset
                    .manualDragV40 =
                    'true';

                item.addEventListener(
                    'pointerdown',
                    event => {
                        const draft =
                            getThemeBuilderDraft(
                                modal
                            );

                        if (
                            draft
                                .svgDistribution !==
                            'manual-fixed'
                        ) {
                            return;
                        }

                        event.preventDefault();
                        event.stopPropagation();

                        const index =
                            Number(
                                item.dataset
                                    .svgIndex
                            );

                        if (
                            !Number.isFinite(
                                index
                            )
                        ) {
                            return;
                        }

                        item.classList.add(
                            'theme-image-manual-dragging-v40'
                        );

                        item.setPointerCapture?.(
                            event.pointerId
                        );

                        const move =
                            moveEvent => {
                                const rect =
                                    canvas
                                        .getBoundingClientRect();

                                const scale =
                                    Number(
                                        getComputedStyle(
                                            canvas
                                        )
                                            .getPropertyValue(
                                                '--theme-builder-preview-scale'
                                            )
                                    ) ||
                                    1;

                                const unscaledX =
                                    (
                                        moveEvent.clientX -
                                        rect.left
                                    ) /
                                    scale;

                                const unscaledY =
                                    (
                                        moveEvent.clientY -
                                        rect.top
                                    ) /
                                    scale;

                                const x =
                                    Math.max(
                                        2,
                                        Math.min(
                                            98,
                                            (
                                                unscaledX /
                                                canvas
                                                    .offsetWidth
                                            ) *
                                            100
                                        )
                                    );

                                const y =
                                    Math.max(
                                        3,
                                        Math.min(
                                            97,
                                            (
                                                unscaledY /
                                                canvas
                                                    .offsetHeight
                                            ) *
                                            100
                                        )
                                    );

                                const count =
                                    modal
                                        ._themeBackgroundSvgs
                                        ?.length ||
                                    0;

                                modal._manualPlacementSlotsV40 =
                                    normalizeManualSlotsV40(
                                        modal
                                            ._manualPlacementSlotsV40,
                                        count
                                    );

                                modal
                                    ._manualPlacementSlotsV40[
                                        index
                                    ] = {
                                        x,
                                        y
                                    };

                                item.style.left =
                                    `${x}%`;

                                item.style.top =
                                    `${y}%`;
                            };

                        const end =
                            endEvent => {
                                item.classList.remove(
                                    'theme-image-manual-dragging-v40'
                                );

                                item.removeEventListener(
                                    'pointermove',
                                    move
                                );

                                item.removeEventListener(
                                    'pointerup',
                                    end
                                );

                                item.removeEventListener(
                                    'pointercancel',
                                    end
                                );

                                try {
                                    item.releasePointerCapture?.(
                                        endEvent
                                            .pointerId
                                    );
                                } catch {}
                            };

                        item.addEventListener(
                            'pointermove',
                            move
                        );

                        item.addEventListener(
                            'pointerup',
                            end
                        );

                        item.addEventListener(
                            'pointercancel',
                            end
                        );
                    }
                );
            }
        );
}

const renderAdvancedThemeBuilderSvgPreviewBeforeManualV40 =
    renderAdvancedThemeBuilderSvgPreviewV10;

renderAdvancedThemeBuilderSvgPreviewV10 =
    function(
        modal
    ) {
        renderAdvancedThemeBuilderSvgPreviewBeforeManualV40(
            modal
        );

        bindManualImageDraggingV40(
            modal
        );

        renderDashboardThemePreviewV40(
            modal
        );
    };


// ------------------------------------------------------------
// Dashboard-specific colors in Theme Builder.
// ------------------------------------------------------------

function ensureDashboardThemeControlsV40(
    modal,
    theme = {}
) {
    const controls =
        modal?.querySelector(
            '.theme-builder-controls'
        );

    if (!controls) {
        return;
    }

    let section =
        controls.querySelector(
            '.theme-builder-dashboard-colors-v40'
        );

    if (!section) {
        section =
            document.createElement(
                'section'
            );

        section.className =
            'theme-builder-control-section theme-builder-dashboard-colors-v40';

        section.dataset
            .themeBuilderPanelGroup =
            'colors';

        section.innerHTML = `
            <div class="theme-builder-control-heading">
                <strong>Dashboard Colors</strong>
                <small>
                    Optional dashboard-specific colors. Leave them matching the main theme for one consistent look.
                </small>
            </div>

            <div class="theme-builder-dashboard-color-grid-v40">
                ${[
                    [
                        'dashboardBackgroundV40',
                        'Dashboard Background'
                    ],
                    [
                        'dashboardCardV40',
                        'Log Cards'
                    ],
                    [
                        'dashboardTextV40',
                        'Dashboard Text'
                    ],
                    [
                        'dashboardAccentV40',
                        'Buttons / Accent'
                    ]
                ].map(
                    (
                        [
                            key,
                            label
                        ]
                    ) => `
                        <label class="theme-builder-color-control">
                            <span>${label}</span>
                            <div class="theme-builder-color-input-row">
                                <input
                                    type="color"
                                    data-theme-key="${key}"
                                >
                                <input
                                    type="text"
                                    data-theme-hex="${key}"
                                    maxlength="7"
                                    spellcheck="false"
                                >
                            </div>
                        </label>
                    `
                ).join('')}
            </div>
        `;

        const firstNonColor =
            Array.from(
                controls.children
            )
                .find(
                    child =>
                        child.dataset
                            ?.themeBuilderPanelGroup &&
                        child.dataset
                            .themeBuilderPanelGroup !==
                            'colors'
                );

        if (firstNonColor) {
            controls.insertBefore(
                section,
                firstNonColor
            );
        } else {
            controls.appendChild(
                section
            );
        }

        section
            .querySelectorAll(
                'input[type="color"][data-theme-key]'
            )
            .forEach(
                picker => {
                    picker.addEventListener(
                        'input',
                        () => {
                            const hex =
                                section.querySelector(
                                    `[data-theme-hex="${CSS.escape(
                                        picker.dataset
                                            .themeKey
                                    )}"]`
                                );

                            if (hex) {
                                hex.value =
                                    picker.value;
                            }

                            updateThemeBuilderPreview(
                                modal
                            );
                        }
                    );
                }
            );

        section
            .querySelectorAll(
                '[data-theme-hex]'
            )
            .forEach(
                input => {
                    input.addEventListener(
                        'change',
                        () => {
                            if (
                                !/^#[0-9a-f]{6}$/i.test(
                                    input.value
                                )
                            ) {
                                return;
                            }

                            const picker =
                                section.querySelector(
                                    `input[type="color"][data-theme-key="${CSS.escape(
                                        input.dataset
                                            .themeHex
                                    )}"]`
                                );

                            if (picker) {
                                picker.value =
                                    input.value;
                            }

                            updateThemeBuilderPreview(
                                modal
                            );
                        }
                    );
                }
            );
    }

    const values = {
        dashboardBackgroundV40:
            theme
                .dashboardBackgroundV40 ||
            theme.background ||
            '#f5f5f5',
        dashboardCardV40:
            theme
                .dashboardCardV40 ||
            theme.surface ||
            '#ffffff',
        dashboardTextV40:
            theme
                .dashboardTextV40 ||
            theme.text ||
            '#000000',
        dashboardAccentV40:
            theme
                .dashboardAccentV40 ||
            theme.accent ||
            '#777777'
    };

    Object.entries(
        values
    ).forEach(
        (
            [
                key,
                value
            ]
        ) => {
            const color =
                /^#[0-9a-f]{6}$/i.test(
                    String(
                        value
                    )
                )
                    ? value
                    : '#777777';

            const picker =
                section.querySelector(
                    `input[type="color"][data-theme-key="${CSS.escape(
                        key
                    )}"]`
                );

            const hex =
                section.querySelector(
                    `[data-theme-hex="${CSS.escape(
                        key
                    )}"]`
                );

            if (picker) {
                picker.value =
                    color;
            }

            if (hex) {
                hex.value =
                    color;
            }
        }
    );

    // Rebuild tab grouping after adding a Colors section.
    if (
        typeof installThemeBuilderSectionTabsV11 ===
        'function'
    ) {
        installThemeBuilderSectionTabsV11(
            modal
        );
    }
}


// ------------------------------------------------------------
// Dashboard preview inside Theme Builder.
// ------------------------------------------------------------

function ensureThemeBuilderDashboardPreviewV40(
    modal
) {
    const wrap =
        modal?.querySelector(
            '.theme-builder-live-preview-wrap'
        );

    if (!wrap) {
        return;
    }

    const controls =
        wrap.querySelector(
            '.theme-builder-live-preview-controls'
        );

    if (
        controls &&
        !controls.querySelector(
            '.theme-builder-dashboard-preview-button-v40'
        )
    ) {
        const button =
            document.createElement(
                'button'
            );

        button.type =
            'button';

        button.className =
            'small-icon-btn theme-builder-dashboard-preview-button-v40';

        button.innerHTML =
            '<i class="ph ph-squares-four"></i> Dashboard';

        button.addEventListener(
            'click',
            () => {
                modal._dashboardPreviewActiveV40 =
                    !modal
                        ._dashboardPreviewActiveV40;

                syncThemeBuilderDashboardPreviewModeV40(
                    modal
                );
            }
        );

        controls.prepend(
            button
        );
    }

    const viewport =
        wrap.querySelector(
            '.theme-builder-live-preview-viewport'
        );

    if (
        viewport &&
        !viewport.querySelector(
            '.theme-builder-dashboard-preview-v40'
        )
    ) {
        const dashboard =
            document.createElement(
                'div'
            );

        dashboard.className =
            'theme-builder-dashboard-preview-v40 hidden';

        viewport.appendChild(
            dashboard
        );
    }

    if (
        modal.dataset
            .dashboardNavClearV40 !==
        'true'
    ) {
        modal.dataset
            .dashboardNavClearV40 =
            'true';

        modal.addEventListener(
            'click',
            event => {
                if (
                    event.target.closest(
                        '.theme-builder-live-side-nav button, .theme-builder-live-side-nav a.icon-btn'
                    )
                ) {
                    modal._dashboardPreviewActiveV40 =
                        false;

                    syncThemeBuilderDashboardPreviewModeV40(
                        modal
                    );
                }
            },
            true
        );
    }

    syncThemeBuilderDashboardPreviewModeV40(
        modal
    );
}

function syncThemeBuilderDashboardPreviewModeV40(
    modal
) {
    const viewport =
        modal?.querySelector(
            '.theme-builder-live-preview-viewport'
        );

    const stage =
        viewport?.querySelector(
            '.theme-builder-live-preview-stage'
        );

    const dashboard =
        viewport?.querySelector(
            '.theme-builder-dashboard-preview-v40'
        );

    const button =
        modal?.querySelector(
            '.theme-builder-dashboard-preview-button-v40'
        );

    const active =
        !!modal
            ?._dashboardPreviewActiveV40;

    stage?.classList.toggle(
        'hidden',
        active
    );

    dashboard?.classList.toggle(
        'hidden',
        !active
    );

    button?.classList.toggle(
        'active',
        active
    );

    if (active) {
        renderDashboardThemePreviewV40(
            modal
        );
    }
}

function renderDashboardThemePreviewV40(
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

    const artAssignments =
        getPreviewSvgAssignmentsV10(
            modal,
            draft
        );

    host.innerHTML = `
        <div class="theme-builder-dashboard-art-v40">
            ${artAssignments.map(
                assignment => `
                    <div
                        class="theme-builder-dashboard-art-item-v40"
                        style="
                            left:${assignment.left}%;
                            top:${assignment.top}%;
                        "
                    >
                        ${renderThemeImageAssetV36(
                            assignment.svg
                        )}
                    </div>
                `
            ).join('')}
        </div>

        <div class="theme-builder-dashboard-actions-v40">
            <span><i class="ph ph-hard-drives"></i></span>
            <span><i class="ph ph-trash"></i></span>
            <span><i class="ph ph-palette"></i></span>
        </div>

        <h2>MY LOGS</h2>

        <div class="theme-builder-dashboard-filter-v40">
            <span class="active">All</span>
            <span>School</span>
            <span>Non-School</span>
        </div>

        <div class="theme-builder-dashboard-cards-v40">
            ${[
                [
                    'ph-translate',
                    'French'
                ],
                [
                    'ph-guitar',
                    'Guitar'
                ],
                [
                    'ph-calculator',
                    'Calculus'
                ]
            ].map(
                (
                    [
                        icon,
                        label
                    ]
                ) => `
                    <div class="theme-builder-dashboard-card-v40">
                        <i class="ph ${icon}"></i>
                        <span>${label}</span>
                    </div>
                `
            ).join('')}
        </div>
    `;
}

const updateThemeBuilderPreviewBeforeDashboardV40 =
    updateThemeBuilderPreview;

updateThemeBuilderPreview =
    function(
        modal
    ) {
        updateThemeBuilderPreviewBeforeDashboardV40(
            modal
        );

        ensureThemeBuilderDashboardPreviewV40(
            modal
        );

        renderDashboardThemePreviewV40(
            modal
        );

        bindManualImageDraggingV40(
            modal
        );
    };


// ------------------------------------------------------------
// Shared theme library: log pages publish custom themes/copies.
// ------------------------------------------------------------

function readSharedThemeLibraryV40() {
    try {
        const parsed =
            JSON.parse(
                localStorage.getItem(
                    SHARED_THEME_LIBRARY_KEY_V40
                ) ||
                '[]'
            );

        return Array.isArray(
            parsed
        )
            ? parsed
            : [];
    } catch {
        return [];
    }
}

function writeSharedThemeLibraryV40(
    themes
) {
    localStorage.setItem(
        SHARED_THEME_LIBRARY_KEY_V40,
        JSON.stringify(
            Array.isArray(
                themes
            )
                ? themes
                : []
        )
    );
}

function publishSharedThemeV40({
    id,
    name,
    theme,
    sourceThemeId = ''
}) {
    if (
        !id ||
        !theme
    ) {
        return;
    }

    const library =
        readSharedThemeLibraryV40();

    const entry = {
        id,
        name:
            name ||
            theme.name ||
            'Custom Theme',
        sourceThemeId:
            sourceThemeId ||
            '',
        theme:
            cloneThemeDataV30(
                theme
            ),
        updatedAt:
            new Date()
                .toISOString()
    };

    const index =
        library.findIndex(
            item =>
                item.id ===
                id
        );

    if (
        index >=
        0
    ) {
        library[index] =
            entry;
    } else {
        library.push(
            entry
        );
    }

    writeSharedThemeLibraryV40(
        library
    );
}

function removeSharedThemeV40(
    id
) {
    writeSharedThemeLibraryV40(
        readSharedThemeLibraryV40()
            .filter(
                item =>
                    item.id !==
                    id
            )
    );
}

function syncSharedThemesIntoLogV40() {
    if (
        !db.settings
    ) {
        return;
    }

    const copies =
        ensureThemeCopiesV30();

    readSharedThemeLibraryV40()
        .forEach(
            shared => {
                if (
                    !shared?.id ||
                    !shared?.theme
                ) {
                    return;
                }

                const existing =
                    copies.find(
                        copy =>
                            copy.id ===
                            shared.id
                    );

                const next = {
                    id:
                        shared.id,
                    name:
                        shared.name ||
                        'Shared Theme',
                    sourceThemeId:
                        shared.sourceThemeId ||
                        '',
                    theme:
                        cloneThemeDataV30(
                            shared.theme
                        ),
                    sharedV40:
                        true,
                    createdAt:
                        shared.updatedAt ||
                        new Date()
                            .toISOString()
                };

                if (existing) {
                    if (
                        existing
                            .sharedV40
                    ) {
                        Object.assign(
                            existing,
                            next
                        );
                    }
                } else {
                    copies.push(
                        next
                    );
                }
            }
        );
}

function publishCurrentLogThemesV40() {
    const custom =
        getCustomThemeSettings();

    if (
        custom &&
        db.settings
            ?.customThemeDeleted !==
            true
    ) {
        if (
            !db.settings
                .customThemeSharedIdV40
        ) {
            db.settings
                .customThemeSharedIdV40 =
                'theme-custom-builder-shared-' +
                Math.random()
                    .toString(36)
                    .slice(
                        2,
                        10
                    );
        }

        publishSharedThemeV40({
            id:
                db.settings
                    .customThemeSharedIdV40,
            name:
                custom.name ||
                'My Custom Theme',
            theme:
                custom
        });
    }

    ensureThemeCopiesV30()
        .filter(
            copy =>
                !copy.sharedV40
        )
        .forEach(
            copy =>
                publishSharedThemeV40({
                    id:
                        copy.id,
                    name:
                        copy.name,
                    theme:
                        copy.theme,
                    sourceThemeId:
                        copy.sourceThemeId
                })
        );
}

const syncThemeCopyOptionsBeforeSharedV40 =
    syncThemeCopyOptionsV30;

syncThemeCopyOptionsV30 =
    function() {
        syncSharedThemesIntoLogV40();

        syncThemeCopyOptionsBeforeSharedV40();
    };

const applyThemeBeforeSharedPublishV40 =
    applyTheme;

applyTheme =
    async function(
        themeValue,
        opts = {}
    ) {
        await applyThemeBeforeSharedPublishV40(
            themeValue,
            opts
        );

        if (
            themeValue ===
            'theme-custom-builder'
        ) {
            publishCurrentLogThemesV40();
        } else {
            const copy =
                getThemeCopyV30(
                    themeValue
                );

            if (
                copy &&
                !copy.sharedV40
            ) {
                publishSharedThemeV40({
                    id:
                        copy.id,
                    name:
                        copy.name,
                    theme:
                        copy.theme,
                    sourceThemeId:
                        copy.sourceThemeId
                });
            }
        }

        if (
            window
                ._returnDashboardAfterThemeSaveV40
        ) {
            window
                ._returnDashboardAfterThemeSaveV40 =
                false;

            setTimeout(
                () => {
                    window.location.href =
                        '/';
                },
                100
            );
        }
    };

const moveThemeToTrashBeforeSharedV40 =
    moveThemeToTrashV31;

moveThemeToTrashV31 =
    async function(
        themeValue,
        themeName
    ) {
        const copy =
            getThemeCopyV30(
                themeValue
            );

        await moveThemeToTrashBeforeSharedV40(
            themeValue,
            themeName
        );

        if (
            copy?.sharedV40 ||
            readSharedThemeLibraryV40()
                .some(
                    item =>
                        item.id ===
                        themeValue
                )
        ) {
            removeSharedThemeV40(
                themeValue
            );
        }
    };


// ------------------------------------------------------------
// Dashboard + button entry point.
// Dashboard opens the same full Theme Builder through a log page.
// ------------------------------------------------------------

function maybeOpenThemeBuilderFromDashboardV40() {
    const params =
        new URLSearchParams(
            window.location.search
        );

    if (
        params.get(
            'openThemeBuilder'
        ) !==
        '1'
    ) {
        return;
    }

    requestAnimationFrame(
        () => {
            openNewThemeBuilderCleanV34();

            if (
                params.get(
                    'returnDashboard'
                ) ===
                '1'
            ) {
                window
                    ._returnDashboardAfterThemeSaveV40 =
                    true;
            }
        }
    );
}

// V42: dashboard Theme Builder actions wait until loadData/feature init finishes.



// ============================================================
// V41 — SETTINGS HEADER / @DAY / PREVIEW HOME / OVERLAP REPAIR
// AUDIO RELIABILITY / DASHBOARD RUNTIME
// ============================================================

// ------------------------------------------------------------
// @Day links: robust conversion on Space/punctuation/blur.
// ------------------------------------------------------------

function makeDayLinkV41(day, text) {
    const link =
        document.createElement(
            'a'
        );

    link.href =
        `#day-${day}`;

    link.className =
        'notes-day-link-v38 notes-day-link-v41';

    link.dataset.day =
        String(day);

    link.contentEditable =
        'false';

    link.title =
        `Open Day ${day}`;

    link.textContent =
        text.replace(
            /^@\s*Day/i,
            '@Day'
        );

    return link;
}

function convertDayMentionBeforeCaretV41(notes) {
    const selection =
        window.getSelection();

    if (
        !notes ||
        !selection ||
        !selection.rangeCount
    ) {
        return false;
    }

    const range =
        selection.getRangeAt(
            0
        );

    if (
        !range.collapsed ||
        !notes.contains(
            range.startContainer
        ) ||
        range.startContainer.nodeType !==
            Node.TEXT_NODE
    ) {
        return false;
    }

    const node =
        range.startContainer;

    const offset =
        range.startOffset;

    const before =
        node.data.slice(
            0,
            offset
        );

    const match =
        before.match(
            /(@\s*Day\s+(\d+))([ \u00a0.,!?;:]*)$/i
        );

    if (!match) {
        return false;
    }

    const day =
        Number(
            match[2]
        );

    if (
        !Number.isFinite(day) ||
        day <
            1
    ) {
        return false;
    }

    const suffix =
        match[3] ||
        '';

    const mentionEnd =
        offset -
        suffix.length;

    const mentionStart =
        mentionEnd -
        match[1].length;

    const mentionRange =
        document.createRange();

    mentionRange.setStart(
        node,
        mentionStart
    );

    mentionRange.setEnd(
        node,
        mentionEnd
    );

    const link =
        makeDayLinkV41(
            day,
            match[1]
        );

    mentionRange.deleteContents();

    mentionRange.insertNode(
        link
    );

    const next =
        link.nextSibling;

    const caret =
        document.createRange();

    if (
        next &&
        next.nodeType ===
            Node.TEXT_NODE
    ) {
        caret.setStart(
            next,
            Math.min(
                suffix.length,
                next.data.length
            )
        );
    } else {
        caret.setStartAfter(
            link
        );
    }

    caret.collapse(
        true
    );

    selection.removeAllRanges();

    selection.addRange(
        caret
    );

    if (currentDay) {
        db.days[currentDay]
            .notes =
            notes.innerHTML;

        scheduleSaveDay();
    }

    return true;
}

function convertAllPlainDayMentionsV41(notes) {
    if (!notes) {
        return;
    }

    const walker =
        document.createTreeWalker(
            notes,
            NodeFilter.SHOW_TEXT
        );

    const nodes = [];

    while (
        walker.nextNode()
    ) {
        const node =
            walker.currentNode;

        if (
            node.parentElement
                ?.closest(
                    '.notes-day-link-v38, .notes-day-link-v41'
                )
        ) {
            continue;
        }

        nodes.push(
            node
        );
    }

    nodes.forEach(
        node => {
            const matches =
                Array.from(
                    node.data.matchAll(
                        /@\s*Day\s+(\d+)/gi
                    )
                );

            for (
                let index =
                    matches.length -
                    1;
                index >=
                    0;
                index--
            ) {
                const match =
                    matches[index];

                const day =
                    Number(
                        match[1]
                    );

                if (
                    !Number.isFinite(day) ||
                    day <
                        1
                ) {
                    continue;
                }

                const range =
                    document.createRange();

                range.setStart(
                    node,
                    match.index
                );

                range.setEnd(
                    node,
                    match.index +
                    match[0].length
                );

                const link =
                    makeDayLinkV41(
                        day,
                        match[0]
                    );

                range.deleteContents();

                range.insertNode(
                    link
                );
            }
        }
    );

    if (currentDay) {
        db.days[currentDay]
            .notes =
            notes.innerHTML;

        scheduleSaveDay();
    }
}

const logNotesV41 =
    document.getElementById(
        'log-notes'
    );

if (
    logNotesV41 &&
    logNotesV41.dataset
        .dayLinksV41 !==
        'true'
) {
    logNotesV41.dataset
        .dayLinksV41 =
        'true';

    logNotesV41.addEventListener(
        'keyup',
        event => {
            if (
                [
                    ' ',
                    'Enter',
                    '.',
                    ',',
                    '!',
                    '?',
                    ';',
                    ':'
                ].includes(
                    event.key
                )
            ) {
                convertDayMentionBeforeCaretV41(
                    logNotesV41
                );
            }
        }
    );

    logNotesV41.addEventListener(
        'blur',
        () =>
            convertAllPlainDayMentionsV41(
                logNotesV41
            )
    );

    logNotesV41.addEventListener(
        'click',
        event => {
            const link =
                event.target.closest(
                    '.notes-day-link-v41[data-day], .notes-day-link-v38[data-day]'
                );

            if (!link) {
                return;
            }

            event.preventDefault();
            event.stopPropagation();

            const day =
                Number(
                    link.dataset.day
                );

            if (
                Number.isFinite(day) &&
                day >=
                    1
            ) {
                openDayLog(
                    day
                );
            }
        },
        true
    );
}


// ------------------------------------------------------------
// Preview Home always opens PREVIEW Dashboard, never real /.
// ------------------------------------------------------------

function bindThemeBuilderPreviewHomeV41(
    modal
) {
    if (
        !modal ||
        modal.dataset
            .previewHomeV41 ===
            'true'
    ) {
        return;
    }

    modal.dataset
        .previewHomeV41 =
        'true';

    modal.addEventListener(
        'click',
        event => {
            const anchor =
                event.target.closest(
                    '.theme-builder-live-canvas a[href]'
                );

            if (!anchor) {
                return;
            }

            let isHome =
                anchor.getAttribute(
                    'href'
                ) ===
                '/';

            if (!isHome) {
                try {
                    isHome =
                        new URL(
                            anchor.href,
                            window.location.href
                        ).pathname ===
                        '/';
                } catch {}
            }

            if (!isHome) {
                return;
            }

            event.preventDefault();
            event.stopImmediatePropagation();

            modal
                ._dashboardPreviewActiveV40 =
                true;

            syncThemeBuilderDashboardPreviewModeV40(
                modal
            );
        },
        true
    );
}


// ------------------------------------------------------------
// Re-space images after size changes when overlap is disabled.
// ------------------------------------------------------------

function resolveManualPlacementOverlapV41(
    modal,
    scalePercent
) {
    const count =
        modal
            ?._themeBackgroundSvgs
            ?.length ||
        0;

    if (!count) {
        return;
    }

    const points =
        normalizeManualSlotsV40(
            modal
                ._manualPlacementSlotsV40,
            count
        );

    const minDistance =
        Math.min(
            32,
            11 +
            (
                Number(
                    scalePercent
                ) ||
                100
            ) /
            12
        );

    for (
        let pass = 0;
        pass <
            28;
        pass++
    ) {
        let moved =
            false;

        for (
            let a = 0;
            a <
                points.length;
            a++
        ) {
            for (
                let b =
                    a +
                    1;
                b <
                    points.length;
                b++
            ) {
                let dx =
                    points[b].x -
                    points[a].x;

                let dy =
                    points[b].y -
                    points[a].y;

                let distance =
                    Math.hypot(
                        dx,
                        dy
                    );

                if (
                    distance >=
                    minDistance
                ) {
                    continue;
                }

                if (
                    distance <
                    .01
                ) {
                    dx =
                        Math.cos(
                            (
                                a +
                                b +
                                pass
                            ) *
                            1.7
                        );

                    dy =
                        Math.sin(
                            (
                                a +
                                b +
                                pass
                            ) *
                            1.7
                        );

                    distance =
                        1;
                }

                const push =
                    (
                        minDistance -
                        distance
                    ) /
                    2;

                const ux =
                    dx /
                    distance;

                const uy =
                    dy /
                    distance;

                points[a].x =
                    Math.max(
                        4,
                        Math.min(
                            96,
                            points[a].x -
                            ux *
                            push
                        )
                    );

                points[a].y =
                    Math.max(
                        5,
                        Math.min(
                            95,
                            points[a].y -
                            uy *
                            push
                        )
                    );

                points[b].x =
                    Math.max(
                        4,
                        Math.min(
                            96,
                            points[b].x +
                            ux *
                            push
                        )
                    );

                points[b].y =
                    Math.max(
                        5,
                        Math.min(
                            95,
                            points[b].y +
                            uy *
                            push
                        )
                    );

                moved =
                    true;
            }
        }

        if (!moved) {
            break;
        }
    }

    modal._manualPlacementSlotsV40 =
        points;
}

function respreadThemeImagesV41(
    modal
) {
    if (!modal) {
        return;
    }

    const draft =
        getThemeBuilderDraft(
            modal
        );

    if (
        draft.svgAllowOverlap
    ) {
        return;
    }

    if (
        draft.svgDistribution ===
        'manual-fixed'
    ) {
        resolveManualPlacementOverlapV41(
            modal,
            draft.svgGlobalScale
        );
    } else {
        modal._themePreviewDistributionSeedV10 =
            Math.random() *
            100000;
    }

    updateThemeBuilderPreview(
        modal
    );
}

const setThemeBuilderSvgScaleBeforeOverlapV41 =
    setThemeBuilderSvgScaleV19;

setThemeBuilderSvgScaleV19 =
    function(
        modal,
        value
    ) {
        setThemeBuilderSvgScaleBeforeOverlapV41(
            modal,
            value
        );

        if (
            !modal
                ?.querySelector(
                    '.theme-builder-svg-overlap-enabled-v26'
                )
                ?.checked
        ) {
            respreadThemeImagesV41(
                modal
            );
        }
    };

function ensureImageRespacingButtonV41(
    modal
) {
    const sizeRow =
        modal?.querySelector(
            '.theme-builder-svg-size-v19'
        );

    if (
        !sizeRow ||
        sizeRow.querySelector(
            '.theme-builder-respace-images-v41'
        )
    ) {
        return;
    }

    const button =
        document.createElement(
            'button'
        );

    button.type =
        'button';

    button.className =
        'small-icon-btn theme-builder-respace-images-v41';

    button.title =
        'Re-space images for the current size';

    button.setAttribute(
        'aria-label',
        'Re-space images'
    );

    button.innerHTML =
        '<i class="ph ph-arrows-out-line-horizontal"></i> Re-space';

    button.addEventListener(
        'click',
        () =>
            respreadThemeImagesV41(
                modal
            )
    );

    sizeRow.appendChild(
        button
    );
}


// ------------------------------------------------------------
// Theme audio: prime on pointerdown and reuse after async apply.
// ------------------------------------------------------------

let customThemeAudioRetryCleanupV41 = null;

function stopPrimedThemeAudioV41() {
    try { window.__loggyLogIntroAudioV443?.stopPrime?.(); } catch {}
}

function primeThemeAudioV41(theme, themeId = '') {
    try { return window.__loggyLogIntroAudioV443?.prime?.(theme || {}, themeId) || null; } catch { return null; }
}

// Compatibility names retained for old callers; V443 owns the prime directly.
window.__loggyStopPrimedThemeAudioV440 = stopPrimedThemeAudioV41;
window.__loggyTakePrimedThemeAudioV440 = function() { return null; };

function themeDataForThemeIdV41(
    themeId
) {
    if (
        themeId ===
        'theme-custom-builder'
    ) {
        return getCustomThemeSettings();
    }

    const copy =
        getThemeCopyV30(
            themeId
        );

    if (copy?.theme) {
        return copy.theme;
    }

    return (
        getThemeOverrideV25(
            themeId
        ) ||
        null
    );
}

if (
    themePicker &&
    themePicker.dataset
        .audioPrimeV41 !==
        'true'
) {
    themePicker.dataset
        .audioPrimeV41 =
        'true';

    themePicker.addEventListener(
        'pointerdown',
        event => {
            const card =
                event.target.closest(
                    '.theme-picker-card[data-theme]'
                );

            if (!card) {
                return;
            }

            primeThemeAudioV41(
                themeDataForThemeIdV41(
                    card.dataset
                        .theme
                ),
                card.dataset.theme
            );
        },
        true
    );
}

document.addEventListener(
    'pointerdown',
    event => {
        const save =
            event.target.closest(
                '#theme-builder-modal .theme-builder-save'
            );

        if (!save) {
            return;
        }

        const modal =
            document.getElementById(
                'theme-builder-modal'
            );

        if (modal) {
            primeThemeAudioV41(
                getThemeBuilderDraft(
                    modal
                )
            );
        }
    },
    true
);

function scheduleThemeAudioRetryV41() {
    // V443 owns the only autoplay retry path.
    return null;
}

// Superseded V41 intro player removed; V420 below is the single runtime owner.

// ------------------------------------------------------------
// Dashboard save-from-dashboard must select the new shared theme on return.
// ------------------------------------------------------------

const applyThemeBeforeDashboardReturnV41 =
    applyTheme;

applyTheme =
    async function(
        themeValue,
        opts = {}
    ) {
        if (
            window
                ._returnDashboardAfterThemeSaveV40
        ) {
            let dashboardThemeId =
                '';

            if (
                themeValue ===
                'theme-custom-builder'
            ) {
                if (
                    !db.settings
                        .customThemeSharedIdV40
                ) {
                    db.settings
                        .customThemeSharedIdV40 =
                        'theme-custom-builder-shared-' +
                        Math.random()
                            .toString(36)
                            .slice(
                                2,
                                10
                            );
                }

                dashboardThemeId =
                    db.settings
                        .customThemeSharedIdV40;
            } else {
                const copy =
                    getThemeCopyV30(
                        themeValue
                    );

                if (copy) {
                    dashboardThemeId =
                        copy.id;
                }
            }

            if (
                dashboardThemeId
            ) {
                localStorage.setItem(
                    'dashboard-theme',
                    dashboardThemeId
                );
            }
        }

        return applyThemeBeforeDashboardReturnV41(
            themeValue,
            opts
        );
    };


// ------------------------------------------------------------
// Final Theme Builder wiring.
// ------------------------------------------------------------

const populateThemeBuilderBeforeV41 =
    populateThemeBuilder;

populateThemeBuilder =
    function(
        modal,
        theme
    ) {
        populateThemeBuilderBeforeV41(
            modal,
            theme
        );

        bindThemeBuilderPreviewHomeV41(
            modal
        );

        ensureImageRespacingButtonV41(
            modal
        );

        ensureDashboardThemeControlsV40(
            modal,
            theme ||
                {}
        );

        ensureThemeBuilderDashboardPreviewV40(
            modal
        );
    };



// ============================================================
// V42 — DASHBOARD THEME ACTIONS / TRUE MANUAL PLACEMENT
// DASHBOARD PREVIEW / MATCHING COLOR LAYOUT / AUDIO VOLUME
// ============================================================

const THEME_AUDIO_VOLUME_DEFAULT_V42 =
    35;

const THEME_HOVER_VOLUME_DEFAULT_V42 =
    72;


// ------------------------------------------------------------
// Audio + hover-sound volume controls.
// ------------------------------------------------------------

function clampThemeVolumeV42(
    value,
    fallback
) {
    const number =
        Number(
            value
        );

    return Math.max(
        0,
        Math.min(
            100,
            Number.isFinite(
                number
            )
                ? number
                : fallback
        )
    );
}

function ensureThemeVolumeControlsV42(
    modal,
    theme = {}
) {
    if (!modal) {
        return;
    }

    const audioSection =
        modal
            .querySelector(
                '.theme-builder-audio-file'
            )
            ?.closest(
                '.theme-builder-media-section'
            );

    if (
        audioSection &&
        !audioSection.querySelector(
            '.theme-builder-song-volume-v42'
        )
    ) {
        const row =
            document.createElement(
                'label'
            );

        row.className =
            'theme-builder-volume-row-v42 theme-builder-song-volume-v42';

        row.innerHTML = `
            <span>Song Volume</span>
            <input
                type="range"
                min="0"
                max="100"
                step="1"
                class="theme-builder-song-volume-input-v42"
            >
            <output>35%</output>
        `;

        const fade =
            audioSection.querySelector(
                '.theme-builder-fade-row'
            );

        if (fade) {
            fade.insertAdjacentElement(
                'beforebegin',
                row
            );
        } else {
            audioSection.appendChild(
                row
            );
        }

        const input =
            row.querySelector(
                'input'
            );

        const output =
            row.querySelector(
                'output'
            );

        input.addEventListener(
            'input',
            () => {
                output.textContent =
                    `${input.value}%`;

                updateThemeBuilderPreview(
                    modal
                );

                const previewAudio =
                    modal
                        ._themeBuilderIntroPreviewAudioV10;

                if (previewAudio) {
                    previewAudio.volume =
                        clampThemeVolumeV42(
                            input.value,
                            THEME_AUDIO_VOLUME_DEFAULT_V42
                        ) /
                        100;
                }
            }
        );
    }

    const hoverDetails =
        modal.querySelector(
            '.theme-builder-svg-hover-sound-details'
        );

    if (
        hoverDetails &&
        !hoverDetails.querySelector(
            '.theme-builder-hover-volume-v42'
        )
    ) {
        const row =
            document.createElement(
                'label'
            );

        row.className =
            'theme-builder-volume-row-v42 theme-builder-hover-volume-v42';

        row.innerHTML = `
            <span>Hover Sound Volume</span>
            <input
                type="range"
                min="0"
                max="100"
                step="1"
                class="theme-builder-hover-volume-input-v42"
            >
            <output>72%</output>
        `;

        const assignment =
            hoverDetails.querySelector(
                '.theme-builder-field'
            );

        if (assignment) {
            assignment.insertAdjacentElement(
                'beforebegin',
                row
            );
        } else {
            hoverDetails.appendChild(
                row
            );
        }

        const input =
            row.querySelector(
                'input'
            );

        const output =
            row.querySelector(
                'output'
            );

        input.addEventListener(
            'input',
            () => {
                output.textContent =
                    `${input.value}%`;

                window
                    ._themeHoverVolumeV42 =
                    clampThemeVolumeV42(
                        input.value,
                        THEME_HOVER_VOLUME_DEFAULT_V42
                    ) /
                    100;

                updateThemeBuilderPreview(
                    modal
                );
            }
        );
    }

    const song =
        modal.querySelector(
            '.theme-builder-song-volume-input-v42'
        );

    const songOutput =
        song
            ?.closest(
                '.theme-builder-volume-row-v42'
            )
            ?.querySelector(
                'output'
            );

    if (song) {
        song.value =
            String(
                clampThemeVolumeV42(
                    theme.audioVolume,
                    THEME_AUDIO_VOLUME_DEFAULT_V42
                )
            );

        if (songOutput) {
            songOutput.textContent =
                `${song.value}%`;
        }
    }

    const hover =
        modal.querySelector(
            '.theme-builder-hover-volume-input-v42'
        );

    const hoverOutput =
        hover
            ?.closest(
                '.theme-builder-volume-row-v42'
            )
            ?.querySelector(
                'output'
            );

    if (hover) {
        hover.value =
            String(
                clampThemeVolumeV42(
                    theme.svgHoverVolume,
                    THEME_HOVER_VOLUME_DEFAULT_V42
                )
            );

        if (hoverOutput) {
            hoverOutput.textContent =
                `${hover.value}%`;
        }
    }
}

const getThemeBuilderDraftBeforeVolumeV42 =
    getThemeBuilderDraft;

getThemeBuilderDraft =
    function(
        modal
    ) {
        const draft =
            getThemeBuilderDraftBeforeVolumeV42(
                modal
            );

        draft.audioVolume =
            clampThemeVolumeV42(
                modal
                    ?.querySelector(
                        '.theme-builder-song-volume-input-v42'
                    )
                    ?.value ??
                    draft.audioVolume,
                THEME_AUDIO_VOLUME_DEFAULT_V42
            );

        draft.svgHoverVolume =
            clampThemeVolumeV42(
                modal
                    ?.querySelector(
                        '.theme-builder-hover-volume-input-v42'
                    )
                    ?.value ??
                    draft.svgHoverVolume,
                THEME_HOVER_VOLUME_DEFAULT_V42
            );

        return draft;
    };

const playSingleThemeHoverSoundBeforeVolumeV42 =
    playSingleThemeHoverSoundV10;

playSingleThemeHoverSoundV10 =
    function(
        url,
        volume
    ) {
        const actual =
            Number.isFinite(
                Number(
                    volume
                )
            )
                ? Number(
                    volume
                )
                : (
                    Number.isFinite(
                        Number(
                            window
                                ._themeHoverVolumeV42
                        )
                    )
                        ? Number(
                            window
                                ._themeHoverVolumeV42
                        )
                        : THEME_HOVER_VOLUME_DEFAULT_V42 /
                            100
                );

        return playSingleThemeHoverSoundBeforeVolumeV42(
            url,
            Math.max(
                0,
                Math.min(
                    1,
                    actual
                )
            )
        );
    };

const applyCustomBuiltThemeBeforeVolumeV42 =
    applyCustomBuiltTheme;

applyCustomBuiltTheme =
    function(
        theme =
            getCustomThemeSettings()
    ) {
        window._themeHoverVolumeV42 =
            clampThemeVolumeV42(
                theme
                    ?.svgHoverVolume,
                THEME_HOVER_VOLUME_DEFAULT_V42
            ) /
            100;

        applyCustomBuiltThemeBeforeVolumeV42(
            theme
        );
    };

const previewThemeBuilderIntroBeforeVolumeV42 =
    previewThemeBuilderIntroV10;

previewThemeBuilderIntroV10 =
    function(
        modal
    ) {
        previewThemeBuilderIntroBeforeVolumeV42(
            modal
        );

        const audio =
            modal
                ?._themeBuilderIntroPreviewAudioV10;

        if (audio) {
            audio.volume =
                clampThemeVolumeV42(
                    getThemeBuilderDraft(
                        modal
                    ).audioVolume,
                    THEME_AUDIO_VOLUME_DEFAULT_V42
                ) /
                100;
        }
    };

// Superseded V42 intro player removed; V420 below owns volume + segment playback.

// ------------------------------------------------------------
// Dashboard colors: exact same field markup/grid as other Colors.
// ------------------------------------------------------------

function ensureDashboardThemeControlsV42(
    modal,
    theme = {}
) {
    const controls =
        modal?.querySelector(
            '.theme-builder-controls'
        );

    if (!controls) {
        return;
    }

    controls
        .querySelector(
            '.theme-builder-dashboard-colors-v40'
        )
        ?.remove();

    const section =
        document.createElement(
            'section'
        );

    section.className =
        'theme-builder-control-section theme-builder-dashboard-colors-v40 theme-builder-dashboard-colors-v42';

    section.dataset
        .themeBuilderPanelGroup =
        'colors';

    const fields = [
        [
            'Dashboard Background',
            'dashboardBackgroundV40',
            theme.dashboardBackgroundV40 ||
                theme.background ||
                '#f5f5f5'
        ],
        [
            'Log Cards',
            'dashboardCardV40',
            theme.dashboardCardV40 ||
                theme.surface ||
                '#ffffff'
        ],
        [
            'Dashboard Text',
            'dashboardTextV40',
            theme.dashboardTextV40 ||
                theme.text ||
                '#000000'
        ],
        [
            'Buttons / Accent',
            'dashboardAccentV40',
            theme.dashboardAccentV40 ||
                theme.accent ||
                '#777777'
        ]
    ];

    section.innerHTML = `
        <div class="theme-builder-control-heading">
            <strong>Dashboard Colors</strong>
            <small>
                Dashboard-specific colors.
            </small>
        </div>

        <div class="theme-builder-color-grid theme-builder-dashboard-color-grid-v42">
            ${fields.map(
                (
                    [
                        label,
                        key,
                        value
                    ]
                ) =>
                    themeBuilderField(
                        label,
                        key,
                        value
                    )
            ).join('')}
        </div>
    `;

    const tabs =
        controls.querySelector(
            '.theme-builder-section-tabs-v11'
        );

    const children =
        Array.from(
            controls.children
        );

    const firstNonColor =
        children.find(
            child =>
                child !==
                    tabs &&
                child.dataset
                    ?.themeBuilderPanelGroup &&
                child.dataset
                    .themeBuilderPanelGroup !==
                    'colors'
        );

    if (firstNonColor) {
        controls.insertBefore(
            section,
            firstNonColor
        );
    } else {
        controls.appendChild(
            section
        );
    }

    section
        .querySelectorAll(
            '[data-theme-key]'
        )
        .forEach(
            input => {
                input.addEventListener(
                    'input',
                    () => {
                        const hex =
                            section.querySelector(
                                `[data-theme-hex="${CSS.escape(
                                    input.dataset
                                        .themeKey
                                )}"]`
                            );

                        if (
                            input.type ===
                                'color' &&
                            hex
                        ) {
                            hex.value =
                                input.value;
                        }

                        updateThemeBuilderPreview(
                            modal
                        );
                    }
                );
            }
        );

    section
        .querySelectorAll(
            '[data-theme-hex]'
        )
        .forEach(
            input => {
                input.addEventListener(
                    'input',
                    () => {
                        const value =
                            input.value
                                .trim();

                        if (
                            !/^#[0-9a-f]{6}$/i.test(
                                value
                            )
                        ) {
                            return;
                        }

                        const picker =
                            section.querySelector(
                                `input[type="color"][data-theme-key="${CSS.escape(
                                    input.dataset
                                        .themeHex
                                )}"]`
                            );

                        if (picker) {
                            picker.value =
                                value;
                        }

                        updateThemeBuilderPreview(
                            modal
                        );
                    }
                );
            }
        );

    installThemeBuilderSectionTabsV11(
        modal
    );
}

ensureDashboardThemeControlsV40 =
    ensureDashboardThemeControlsV42;


// ------------------------------------------------------------
// Manual placement: preserve current layout, then drag fixed slots.
// ------------------------------------------------------------

function shuffleIndexArrayV42(
    count
) {
    const values =
        Array.from(
            {
                length:
                    count
            },
            (
                _,
                index
            ) =>
                index
        );

    for (
        let index =
            values.length -
            1;
        index >
            0;
        index--
    ) {
        const other =
            Math.floor(
                Math.random() *
                (
                    index +
                    1
                )
            );

        [
            values[index],
            values[other]
        ] = [
            values[other],
            values[index]
        ];
    }

    return values;
}

function ensureManualPreviewOrderV42(
    modal,
    count,
    reroll =
        false
) {
    if (
        reroll ||
        !Array.isArray(
            modal
                ._manualPreviewOrderV42
        ) ||
        modal
            ._manualPreviewOrderV42
            .length !==
            count
    ) {
        modal._manualPreviewOrderV42 =
            shuffleIndexArrayV42(
                count
            );
    }

    return modal
        ._manualPreviewOrderV42;
}

const getPreviewSvgAssignmentsBeforeTrueManualV42 =
    getPreviewSvgAssignmentsV10;

getPreviewSvgAssignmentsV10 =
    function(
        modal,
        draft
    ) {
        if (
            draft
                ?.svgDistribution !==
            'manual-fixed'
        ) {
            const assignments =
                getPreviewSvgAssignmentsBeforeTrueManualV42(
                    modal,
                    draft
                );

            modal._lastPlacementPointsV42 =
                assignments.map(
                    item => ({
                        x:
                            item.left,
                        y:
                            item.top
                    })
                );

            modal._lastPlacementModeV42 =
                draft
                    ?.svgDistribution ||
                'balanced-spread';

            return assignments;
        }

        const entries =
            makePlacementEntriesV26(
                draft
            );

        if (
            !Array.isArray(
                modal
                    ._manualPlacementSlotsV40
            ) ||
            modal
                ._manualPlacementSlotsV40
                .length !==
                entries.length
        ) {
            const previous =
                Array.isArray(
                    modal
                        ._lastPlacementPointsV42
                ) &&
                modal
                    ._lastPlacementPointsV42
                    .length ===
                    entries.length
                    ? modal
                        ._lastPlacementPointsV42
                    : buildThemePlacementPointsV26(
                        modal
                            ._lastPlacementModeV42 ||
                            'balanced-spread',
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

            modal._manualPlacementSlotsV40 =
                normalizeManualSlotsV40(
                    previous,
                    entries.length
                );
        }

        const slots =
            normalizeManualSlotsV40(
                modal
                    ._manualPlacementSlotsV40,
                entries.length
            );

        modal._manualPlacementSlotsV40 =
            slots.map(
                point => ({
                    ...point
                })
            );

        const order =
            ensureManualPreviewOrderV42(
                modal,
                entries.length
            );

        return slots.map(
            (
                point,
                slotIndex
            ) => {
                const entry =
                    entries[
                        order[
                            slotIndex
                        ] ??
                        slotIndex
                    ] ||
                    entries[
                        slotIndex
                    ];

                return {
                    ...entry,
                    left:
                        point.x,
                    top:
                        point.y,
                    manualSlotIndexV42:
                        slotIndex
                };
            }
        );
    };

function installManualModeCaptureV42(
    modal,
    theme = {}
) {
    if (!modal) {
        return;
    }

    if (
        theme
            ?.svgDistribution !==
        'manual-fixed'
    ) {
        modal._manualPlacementSlotsV40 =
            [];
    }

    if (
        modal.dataset
            .manualCaptureV42 ===
        'true'
    ) {
        return;
    }

    modal.dataset
        .manualCaptureV42 =
        'true';

    modal.addEventListener(
        'change',
        event => {
            const select =
                event.target.closest(
                    '.theme-builder-svg-distribution'
                );

            if (
                !select ||
                select.value !==
                    'manual-fixed'
            ) {
                return;
            }

            const count =
                modal
                    ._themeBackgroundSvgs
                    ?.length ||
                0;

            if (
                Array.isArray(
                    modal
                        ._lastPlacementPointsV42
                ) &&
                modal
                    ._lastPlacementPointsV42
                    .length ===
                    count
            ) {
                modal._manualPlacementSlotsV40 =
                    modal
                        ._lastPlacementPointsV42
                        .map(
                            point => ({
                                ...point
                            })
                        );
            }

            ensureManualPreviewOrderV42(
                modal,
                count,
                true
            );
        },
        true
    );

    modal.addEventListener(
        'click',
        event => {
            if (
                !event.target.closest(
                    '.theme-builder-live-preview-refresh'
                )
            ) {
                return;
            }

            const draft =
                getThemeBuilderDraft(
                    modal
                );

            if (
                draft
                    .svgDistribution ===
                'manual-fixed'
            ) {
                ensureManualPreviewOrderV42(
                    modal,
                    draft
                        .backgroundSvgs
                        ?.length ||
                        0,
                    true
                );
            }
        },
        true
    );
}

function installTrueManualDragV42(
    modal
) {
    const stage =
        modal?.querySelector(
            '.theme-builder-live-art-stage'
        );

    const canvas =
        modal?.querySelector(
            '.theme-builder-live-canvas'
        );

    if (
        !stage ||
        !canvas
    ) {
        return;
    }

    stage
        .querySelectorAll(
            '.theme-builder-live-art-item'
        )
        .forEach(
            (
                item,
                index
            ) => {
                item.dataset
                    .manualSlotIndexV42 =
                    String(
                        index
                    );

                item.classList.toggle(
                    'theme-manual-draggable-v42',
                    getThemeBuilderDraft(
                        modal
                    ).svgDistribution ===
                        'manual-fixed'
                );
            }
        );

    if (
        stage.dataset
            .trueManualDragV42 ===
        'true'
    ) {
        return;
    }

    stage.dataset
        .trueManualDragV42 =
        'true';

    stage.addEventListener(
        'pointerdown',
        event => {
            const item =
                event.target.closest(
                    '.theme-builder-live-art-item'
                );

            if (!item) {
                return;
            }

            const draft =
                getThemeBuilderDraft(
                    modal
                );

            if (
                draft
                    .svgDistribution !==
                'manual-fixed'
            ) {
                return;
            }

            event.preventDefault();
            event.stopPropagation();

            const slot =
                Number(
                    item.dataset
                        .manualSlotIndexV42
                );

            if (
                !Number.isFinite(
                    slot
                )
            ) {
                return;
            }

            item.classList.add(
                'theme-image-manual-dragging-v40'
            );

            const move =
                moveEvent => {
                    const rect =
                        canvas
                            .getBoundingClientRect();

                    if (
                        !rect.width ||
                        !rect.height
                    ) {
                        return;
                    }

                    const x =
                        Math.max(
                            2,
                            Math.min(
                                98,
                                (
                                    (
                                        moveEvent.clientX -
                                        rect.left
                                    ) /
                                    rect.width
                                ) *
                                    100
                            )
                        );

                    const y =
                        Math.max(
                            3,
                            Math.min(
                                97,
                                (
                                    (
                                        moveEvent.clientY -
                                        rect.top
                                    ) /
                                    rect.height
                                ) *
                                    100
                            )
                        );

                    modal._manualPlacementSlotsV40 =
                        normalizeManualSlotsV40(
                            modal
                                ._manualPlacementSlotsV40,
                            modal
                                ._themeBackgroundSvgs
                                ?.length ||
                                0
                        );

                    modal
                        ._manualPlacementSlotsV40[
                            slot
                        ] = {
                            x,
                            y
                        };

                    item.style.left =
                        `${x}%`;

                    item.style.top =
                        `${y}%`;
                };

            const end =
                () => {
                    item.classList.remove(
                        'theme-image-manual-dragging-v40'
                    );

                    document.removeEventListener(
                        'pointermove',
                        move,
                        true
                    );

                    document.removeEventListener(
                        'pointerup',
                        end,
                        true
                    );

                    document.removeEventListener(
                        'pointercancel',
                        end,
                        true
                    );

                    renderDashboardThemePreviewV40(
                        modal
                    );
                };

            document.addEventListener(
                'pointermove',
                move,
                true
            );

            document.addEventListener(
                'pointerup',
                end,
                true
            );

            document.addEventListener(
                'pointercancel',
                end,
                true
            );
        },
        true
    );
}

const renderAdvancedThemeBuilderSvgPreviewBeforeTrueManualV42 =
    renderAdvancedThemeBuilderSvgPreviewV10;

renderAdvancedThemeBuilderSvgPreviewV10 =
    function(
        modal
    ) {
        renderAdvancedThemeBuilderSvgPreviewBeforeTrueManualV42(
            modal
        );

        installTrueManualDragV42(
            modal
        );
    };


// ------------------------------------------------------------
// Dashboard preview: home icon opens this preview, never a gray page.
// ------------------------------------------------------------

function showThemeBuilderDashboardPreviewV42(
    modal
) {
    if (!modal) {
        return;
    }

    ensureThemeBuilderDashboardPreviewV40(
        modal
    );

    const viewport =
        modal.querySelector(
            '.theme-builder-live-preview-viewport'
        );

    const stage =
        viewport?.querySelector(
            '.theme-builder-live-preview-stage'
        );

    const dashboard =
        viewport?.querySelector(
            '.theme-builder-dashboard-preview-v40'
        );

    if (!dashboard) {
        return;
    }

    modal._dashboardPreviewActiveV40 =
        true;

    stage?.classList.add(
        'hidden'
    );

    dashboard.classList.remove(
        'hidden'
    );

    dashboard.style.display =
        'flex';

    dashboard.style.zIndex =
        '100';

    renderDashboardThemePreviewV40(
        modal
    );

    modal
        .querySelector(
            '.theme-builder-dashboard-preview-button-v40'
        )
        ?.classList.add(
            'active'
        );
}

function bindThemeBuilderPreviewHomeV42(
    modal
) {
    const nav =
        modal?.querySelector(
            '.theme-builder-live-side-nav'
        );

    if (
        !nav ||
        nav.dataset
            .dashboardHomeV42 ===
            'true'
    ) {
        return;
    }

    nav.dataset
        .dashboardHomeV42 =
        'true';

    nav.addEventListener(
        'click',
        event => {
            const home =
                event.target.closest(
                    'a[href="/"]'
                );

            if (!home) {
                return;
            }

            event.preventDefault();
            event.stopPropagation();
            event.stopImmediatePropagation();

            showThemeBuilderDashboardPreviewV42(
                modal
            );
        },
        true
    );
}

const rebuildActualThemeBuilderPreviewBeforeDashboardHomeV42 =
    rebuildActualThemeBuilderPreviewV5;

rebuildActualThemeBuilderPreviewV5 =
    function(
        modal
    ) {
        rebuildActualThemeBuilderPreviewBeforeDashboardHomeV42(
            modal
        );

        ensureThemeBuilderDashboardPreviewV40(
            modal
        );

        bindThemeBuilderPreviewHomeV42(
            modal
        );

        installTrueManualDragV42(
            modal
        );
    };


// ------------------------------------------------------------
// Dashboard query actions: wait until loadData finished.
// ------------------------------------------------------------

async function runDashboardThemeActionV42() {
    const params =
        new URLSearchParams(
            window.location.search
        );

    const legacyCreate =
        params.get(
            'openThemeBuilder'
        ) ===
        '1';

    const action =
        params.get(
            'dashboardThemeAction'
        ) ||
        (
            legacyCreate
                ? 'create'
                : ''
        );

    if (!action) {
        return;
    }

    // V284: a fresh Dashboard Create session is intentionally owned by the
    // final Theme Builder coordinator in template-extras-6.js. This V42 function
    // is scheduled with setTimeout while extras are still loading; opening here
    // races the later blank-slate/static-preview wrappers and is what allowed the
    // internal host's previous theme to flash, then the Builder to disappear.
    if (
        params.get('dashboardThemeStudio') === '1' &&
        (
            (action === 'create' && params.get('freshCreateV283') === '1') ||
            (action === 'edit' && params.get('freshEditV289') === '1')
        )
    ) {
        if (action === 'create') {
            window.__loggyDeferredFreshDashboardCreateV284 = true;
        } else {
            window.__loggyDeferredFreshDashboardEditV289 = true;
        }
        return;
    }

    for (
        let attempt = 0;
        attempt <
            120;
        attempt++
    ) {
        const ready =
            document.getElementById(
                'theme-builder-modal'
            ) &&
            db
                ?.settings &&
            typeof openNewThemeBuilderCleanV34 ===
                'function';

        if (ready) {
            break;
        }

        await new Promise(
            resolve =>
                setTimeout(
                    resolve,
                    80
                )
        );
    }

    if (
        !document.getElementById(
            'theme-builder-modal'
        )
    ) {
        showFeatureToast(
            'Theme Builder could not open.'
        );

        return;
    }

    window
        ._returnDashboardAfterThemeSaveV40 =
        params.get(
            'returnDashboard'
        ) ===
        '1';

    syncSharedThemesIntoLogV40?.();

    const themeId =
        params.get(
            'themeId'
        ) ||
        '';

    if (
        action ===
        'create'
    ) {
        openNewThemeBuilderCleanV34();

        return;
    }

    if (
        action ===
        'edit'
    ) {
        const copy =
            getThemeCopyV30(
                themeId
            );

        if (copy) {
            await openThemeCopyInBuilderV30(
                themeId
            );

            return;
        }

        if (
            themeId ===
            'theme-custom-builder'
        ) {
            openExistingCustomThemeFromPickerV7();

            return;
        }

        await openAnyThemeInBuilderV25(
            themeId,
            getThemeDisplayNameV30(
                themeId
            )
        );

        return;
    }

    if (
        action ===
        'duplicate'
    ) {
        const before =
            ensureThemeCopiesV30()
                .map(
                    item =>
                        item.id
                );

        await duplicateThemeV30(
            themeId,
            getThemeDisplayNameV30(
                themeId
            )
        );

        const created =
            ensureThemeCopiesV30()
                .find(
                    item =>
                        !before.includes(
                            item.id
                        )
                );

        publishCurrentLogThemesV40();

        if (created?.id) {
            localStorage.setItem(
                'dashboard-theme',
                created.id
            );
        }

        if (
            params.get(
                'returnDashboard'
            ) ===
            '1'
        ) {
            window.location.href =
                '/';
        }
    }
}

setTimeout(
    runDashboardThemeActionV42,
    0
);


// ------------------------------------------------------------
// Final population/update wiring.
// ------------------------------------------------------------

const populateThemeBuilderBeforeV42 =
    populateThemeBuilder;

populateThemeBuilder =
    function(
        modal,
        theme
    ) {
        populateThemeBuilderBeforeV42(
            modal,
            theme
        );

        ensureDashboardThemeControlsV42(
            modal,
            theme ||
                {}
        );

        ensureThemeVolumeControlsV42(
            modal,
            theme ||
                {}
        );

        installManualModeCaptureV42(
            modal,
            theme ||
                {}
        );

        ensureThemeBuilderDashboardPreviewV40(
            modal
        );

        bindThemeBuilderPreviewHomeV42(
            modal
        );

        installTrueManualDragV42(
            modal
        );
    };

const updateThemeBuilderPreviewBeforeV42 =
    updateThemeBuilderPreview;

updateThemeBuilderPreview =
    function(
        modal
    ) {
        window._themeHoverVolumeV42 =
            clampThemeVolumeV42(
                modal
                    ?.querySelector(
                        '.theme-builder-hover-volume-input-v42'
                    )
                    ?.value,
                THEME_HOVER_VOLUME_DEFAULT_V42
            ) /
            100;

        updateThemeBuilderPreviewBeforeV42(
            modal
        );

        ensureThemeVolumeControlsV42(
            modal,
            getThemeBuilderDraft(
                modal
            )
        );

        ensureDashboardThemeControlsV42(
            modal,
            getThemeBuilderDraft(
                modal
            )
        );

        bindThemeBuilderPreviewHomeV42(
            modal
        );

        installTrueManualDragV42(
            modal
        );
    };



// ============================================================
// V43 — DASHBOARD THEME STUDIO
// Theme Builder can run inside the Dashboard modal without navigating
// away from the Dashboard. It gets Create + Create & Apply actions.
// ============================================================

function isDashboardThemeStudioV43() {
    const params =
        new URLSearchParams(
            window.location.search
        );

    return (
        params.get(
            'dashboardThemeStudio'
        ) ===
        '1'
    );
}

function getDashboardThemeStudioActionV43() {
    return new URLSearchParams(
        window.location.search
    ).get(
        'dashboardThemeAction'
    ) ||
    'create';
}

function getDashboardThemeStudioIdV43() {
    return new URLSearchParams(
        window.location.search
    ).get(
        'themeId'
    ) ||
    '';
}


// V283 — each Dashboard Theme Studio launch has an explicit session identity.
// This prevents a stale/prewarmed Studio from closing/applying a previous theme
// after the Dashboard + button requested a brand-new blank theme.
function getDashboardThemeStudioSessionV283() {
    return new URLSearchParams(window.location.search).get('studioSessionV283') || '';
}

function isFreshDashboardThemeCreateV283() {
    const params = new URLSearchParams(window.location.search);
    return params.get('freshCreateV283') === '1' && params.get('dashboardThemeAction') === 'create';
}

function readSharedThemeLibraryForStudioV43() {
    try {
        const parsed =
            JSON.parse(
                localStorage.getItem(
                    SHARED_THEME_LIBRARY_KEY_V40
                ) ||
                '[]'
            );

        return Array.isArray(
            parsed
        )
            ? parsed
            : [];
    } catch {
        return [];
    }
}

function saveSharedThemeFromStudioV43(
    entry
) {
    const library =
        readSharedThemeLibraryForStudioV43();

    const index =
        library.findIndex(
            item =>
                item.id ===
                entry.id
        );

    if (
        index >=
        0
    ) {
        library[index] =
            entry;
    } else {
        library.push(
            entry
        );
    }

    localStorage.setItem(
        SHARED_THEME_LIBRARY_KEY_V40,
        JSON.stringify(
            library
        )
    );
}

function makeDashboardStudioThemeIdV43() {
    return (
        'theme-custom-builder-dashboard-' +
        Date.now()
            .toString(
                36
            ) +
        '-' +
        Math.random()
            .toString(
                36
            )
            .slice(
                2,
                8
            )
    );
}

async function saveDashboardThemeStudioV43(
    modal,
    applyAfterSave
) {
    if (
        !modal ||
        !validateThemeBuilderBeforeSaveV25(
            modal
        )
    ) {
        return;
    }

    const draft =
        getThemeBuilderDraft(
            modal
        );

    const requestedId =
        getDashboardThemeStudioIdV43();

    const action =
        getDashboardThemeStudioActionV43();

    const existing =
        readSharedThemeLibraryForStudioV43()
            .find(
                item =>
                    item.id ===
                    requestedId
            );

    let id =
        existing?.id ||
        (
            action ===
            'edit'
                ? requestedId
                : ''
        );

    // Editing a built-in from Dashboard creates a dashboard-shareable
    // custom version instead of mutating the source files.
    if (
        !id ||
        !String(
            id
        ).startsWith(
            'theme-custom-builder'
        )
    ) {
        id =
            makeDashboardStudioThemeIdV43();
    }

    const entry = {
        id,
        name:
            draft.name ||
            existing?.name ||
            'Custom Theme',
        sourceThemeId:
            existing
                ?.sourceThemeId ||
            (
                action ===
                'edit' &&
                requestedId &&
                !requestedId.startsWith(
                    'theme-custom-builder'
                )
                    ? requestedId
                    : ''
            ),
        theme:
            cloneThemeDataV30(
                draft
            ),
        updatedAt:
            new Date()
                .toISOString()
    };

    saveSharedThemeFromStudioV43(
        entry
    );

    window.parent
        ?.postMessage(
            {
                type:
                    'dashboard-theme-studio-saved-v43',
                studioSessionV283: getDashboardThemeStudioSessionV283(),
                studioActionV283: getDashboardThemeStudioActionV43(),
                themeId:
                    id,
                apply:
                    !!applyAfterSave
            },
            window.location.origin
        );
}

function installDashboardThemeStudioActionsV43(
    modal
) {
    if (
        !isDashboardThemeStudioV43() ||
        !modal
    ) {
        return;
    }

    document.body.classList.add(
        'dashboard-theme-studio-host-v43'
    );

    const save =
        modal.querySelector(
            '.theme-builder-save'
        );

    if (!save) {
        return;
    }

    const action =
        getDashboardThemeStudioActionV43();

    const createMode =
        action ===
        'create';

    save.innerHTML =
        createMode
            ? '<i class="ph ph-check"></i> Create'
            : '<i class="ph ph-check"></i> Save';

    save.onclick =
        () =>
            saveDashboardThemeStudioV43(
                modal,
                false
            );

    let apply =
        modal.querySelector(
            '.theme-builder-create-apply-v43'
        );

    if (!apply) {
        apply =
            document.createElement(
                'button'
            );

        apply.type =
            'button';

        apply.className =
            'icon-btn theme-builder-create-apply-v43';

        save.insertAdjacentElement(
            'afterend',
            apply
        );
    }

    apply.innerHTML =
        createMode
            ? '<i class="ph ph-sparkle"></i> Create & Apply'
            : '<i class="ph ph-sparkle"></i> Save & Apply';

    apply.onclick =
        () =>
            saveDashboardThemeStudioV43(
                modal,
                true
            );

    const close =
        modal.querySelector(
            '.theme-builder-close'
        );

    if (
        close &&
        close.dataset
            .dashboardStudioV43 !==
            'true'
    ) {
        close.dataset
            .dashboardStudioV43 =
            'true';

        close.addEventListener(
            'click',
            event => {
                event.preventDefault();
                event.stopImmediatePropagation();

                window.parent
                    ?.postMessage(
                        {
                            type:
                                'dashboard-theme-studio-close-v43',
                            studioSessionV283: getDashboardThemeStudioSessionV283(),
                            studioActionV283: getDashboardThemeStudioActionV43()
                        },
                        window.location.origin
                    );
            },
            true
        );
    }
}

const populateThemeBuilderBeforeStudioV43 =
    populateThemeBuilder;

populateThemeBuilder =
    function(
        modal,
        theme
    ) {
        populateThemeBuilderBeforeStudioV43(
            modal,
            theme
        );

        installDashboardThemeStudioActionsV43(
            modal
        );
    };

const openNewThemeBuilderCleanBeforeStudioV43 =
    openNewThemeBuilderCleanV34;

openNewThemeBuilderCleanV34 =
    function() {
        openNewThemeBuilderCleanBeforeStudioV43();

        installDashboardThemeStudioActionsV43(
            document.getElementById(
                'theme-builder-modal'
            )
        );
    };

const openThemeCopyInBuilderBeforeStudioV43 =
    openThemeCopyInBuilderV30;

openThemeCopyInBuilderV30 =
    async function(
        themeId
    ) {
        await openThemeCopyInBuilderBeforeStudioV43(
            themeId
        );

        installDashboardThemeStudioActionsV43(
            document.getElementById(
                'theme-builder-modal'
            )
        );
    };

const openAnyThemeInBuilderBeforeStudioV43 =
    openAnyThemeInBuilderV25;

openAnyThemeInBuilderV25 =
    async function(
        themeId,
        themeName
    ) {
        await openAnyThemeInBuilderBeforeStudioV43(
            themeId,
            themeName
        );

        installDashboardThemeStudioActionsV43(
            document.getElementById(
                'theme-builder-modal'
            )
        );
    };

// When editing a Dashboard-shared theme, hydrate its actual shared draft
// instead of relying on a host log to already contain it.
async function openDashboardSharedThemeInStudioV43(
    themeId
) {
    const shared =
        readSharedThemeLibraryForStudioV43()
            .find(
                item =>
                    item.id ===
                    themeId
            );

    if (!shared?.theme) {
        return false;
    }

    const modal =
        ensureThemeBuilderModal();

    removeBuiltInEditorStateForCustomV30?.(
        modal
    );

    removeRestoreOriginalButtonV27?.(
        modal
    );

    removeLegacyThemeBuilderResetV28?.(
        modal
    );

    modal.dataset.themeBuilderMode =
        'edit';

    modal.dataset.themeBuilderEditingThemeV25 =
        '';

    modal.dataset.themeBuilderEditingCopyV30 =
        themeId;

    populateThemeBuilder(
        modal,
        shared.theme
    );

    modal.classList.remove(
        'hidden'
    );

    installDashboardThemeStudioActionsV43(
        modal
    );

    return true;
}

const runDashboardThemeActionBeforeStudioV43 =
    runDashboardThemeActionV42;

runDashboardThemeActionV42 =
    async function() {
        if (
            !isDashboardThemeStudioV43()
        ) {
            return runDashboardThemeActionBeforeStudioV43();
        }

        const params =
            new URLSearchParams(
                window.location.search
            );

        const action =
            params.get(
                'dashboardThemeAction'
            ) ||
            'create';

        const themeId =
            params.get(
                'themeId'
            ) ||
            '';

        // Wait for the host log's app runtime, but do not navigate to it.
        for (
            let attempt = 0;
            attempt <
                120;
            attempt++
        ) {
            if (
                db?.settings &&
                typeof openNewThemeBuilderCleanV34 ===
                    'function'
            ) {
                break;
            }

            await new Promise(
                resolve =>
                    setTimeout(
                        resolve,
                        80
                    )
            );
        }

        window._returnDashboardAfterThemeSaveV40 =
            false;

        if (
            action ===
            'create'
        ) {
            if (isFreshDashboardThemeCreateV283()) {
                try { window.__loggyBeginCreateIsolationV259?.(); } catch {}
                try {
                    if (db?.settings) db.settings.theme = 'default';
                    if (typeof applyTheme === 'function') {
                        await applyTheme('default', { persist: false, force: true, themeBuilderCreate: true });
                    }
                    if (db?.settings) db.settings.theme = 'default';
                } catch {}
            }
            openNewThemeBuilderCleanV34();

            return;
        }

        if (
            action ===
            'edit' &&
            await openDashboardSharedThemeInStudioV43(
                themeId
            )
        ) {
            return;
        }

        if (
            action ===
            'duplicate'
        ) {
            const shared =
                readSharedThemeLibraryForStudioV43()
                    .find(
                        item =>
                            item.id ===
                            themeId
                    );

            if (shared?.theme) {
                const copy = {
                    ...shared,
                    id:
                        makeDashboardStudioThemeIdV43(),
                    name:
                        `${
                            shared.name ||
                            'Theme'
                        } Copy`,
                    theme:
                        {
                            ...cloneThemeDataV30(
                                shared.theme
                            ),
                            name:
                                `${
                                    shared.name ||
                                    'Theme'
                                } Copy`
                        },
                    updatedAt:
                        new Date()
                            .toISOString()
                };

                saveSharedThemeFromStudioV43(
                    copy
                );

                window.parent
                    ?.postMessage(
                        {
                            type:
                                'dashboard-theme-studio-saved-v43',
                            studioSessionV283: getDashboardThemeStudioSessionV283(),
                            studioActionV283: getDashboardThemeStudioActionV43(),
                            themeId:
                                copy.id,
                            apply:
                                false
                        },
                        window.location.origin
                    );

                return;
            }
        }

        return runDashboardThemeActionBeforeStudioV43();
    };



// ============================================================
// V44 — TRUE MANUAL DRAGGING / ONE-STEP THEME DELETE
// @DAY AUTOCOMPLETE / RELIABLE DASHBOARD PREVIEW
// ============================================================


// ------------------------------------------------------------
// ONE RIGHT-CLICK DELETE: remove shared backing BEFORE V31 sync.
// ------------------------------------------------------------

const moveThemeToTrashBeforeOneStepV44 =
    moveThemeToTrashV31;

moveThemeToTrashV31 =
    async function(
        themeId,
        themeName
    ) {
        const libraryBefore =
            readSharedThemeLibraryV40();

        const sharedEntry =
            libraryBefore.find(
                item =>
                    item.id ===
                    themeId
            ) ||
            null;

        const trashBefore =
            getThemeTrashV31()
                .length;

        // Important: V31 deletion calls syncThemeCopyOptionsV30 internally.
        // If the shared entry still exists at that moment, V40 re-imports the
        // just-deleted theme. Remove it first so deletion is genuinely atomic.
        if (sharedEntry) {
            removeSharedThemeV40(
                themeId
            );
        }

        await moveThemeToTrashBeforeOneStepV44(
            themeId,
            themeName
        );

        const actuallyDeleted =
            getThemeTrashV31()
                .length >
                trashBefore ||
            db.settings
                ?.customThemeDeleted ===
                true ||
            (
                db.settings
                    ?.deletedThemes ||
                []
            ).includes(
                themeId
            ) ||
            !ensureThemeCopiesV30()
                .some(
                    copy =>
                        copy.id ===
                        themeId
                );

        if (
            sharedEntry &&
            !actuallyDeleted
        ) {
            // User cancelled the confirmation: restore shared entry exactly.
            const current =
                readSharedThemeLibraryV40();

            if (
                !current.some(
                    item =>
                        item.id ===
                        sharedEntry.id
                )
            ) {
                current.push(
                    sharedEntry
                );

                writeSharedThemeLibraryV40(
                    current
                );
            }

            return;
        }

        if (actuallyDeleted) {
            db.settings.themeCopiesV30 =
                ensureThemeCopiesV30()
                    .filter(
                        copy =>
                            copy.id !==
                            themeId
                    );

            removeSharedThemeV40(
                themeId
            );

            await saveDb();

            syncThemeCopyOptionsV30();
            renderThemePicker();
        }
    };

// Stale shared copies are also removed automatically when their shared
// backing entry no longer exists.
const syncSharedThemesIntoLogBeforePruneV44 =
    syncSharedThemesIntoLogV40;

syncSharedThemesIntoLogV40 =
    function() {
        const sharedIds =
            new Set(
                readSharedThemeLibraryV40()
                    .map(
                        item =>
                            item.id
                    )
            );

        if (
            Array.isArray(
                db.settings
                    ?.themeCopiesV30
            )
        ) {
            db.settings.themeCopiesV30 =
                db.settings
                    .themeCopiesV30
                    .filter(
                        copy =>
                            !copy
                                ?.sharedV40 ||
                            sharedIds.has(
                                copy.id
                            )
                    );
        }

        syncSharedThemesIntoLogBeforePruneV44();
    };


// ------------------------------------------------------------
// @DAY AUTOCOMPLETE — opens the moment @ is typed.
// ------------------------------------------------------------

let dayMentionMenuV44 =
    null;

let dayMentionRangeV44 =
    null;

let dayMentionStartOffsetV44 =
    null;

let dayMentionSelectedIndexV44 =
    0;

let dayMentionSuggestionsV44 =
    [];

function ensureDayMentionMenuV44() {
    if (dayMentionMenuV44) {
        return dayMentionMenuV44;
    }

    const menu =
        document.createElement(
            'div'
        );

    menu.id =
        'daily-day-mention-menu-v44';

    menu.className =
        'daily-day-mention-menu-v44 hidden';

    document.body.appendChild(
        menu
    );

    dayMentionMenuV44 =
        menu;

    menu.addEventListener(
        'pointerdown',
        event => {
            const option =
                event.target.closest(
                    '[data-day-mention-v44]'
                );

            if (!option) {
                return;
            }

            event.preventDefault();

            insertDayMentionSuggestionV44(
                Number(
                    option.dataset
                        .dayMentionV44
                )
            );
        }
    );

    return menu;
}

function closeDayMentionMenuV44() {
    dayMentionMenuV44
        ?.classList.add(
            'hidden'
        );

    dayMentionRangeV44 =
        null;

    dayMentionStartOffsetV44 =
        null;

    dayMentionSuggestionsV44 =
        [];

    dayMentionSelectedIndexV44 =
        0;
}

function getAllAvailableDaysV44() {
    const saved =
        Object.keys(
            db.days ||
            {}
        )
            .map(
                Number
            )
            .filter(
                day =>
                    Number.isFinite(
                        day
                    ) &&
                    day >=
                        1
            );

    const maximum =
        Math.max(
            Number(
                typeof TOTAL_CURRICULUM_DAYS !==
                    'undefined'
                    ? TOTAL_CURRICULUM_DAYS
                    : 0
            ) ||
                0,
            ...saved,
            currentDay ||
                0,
            1
        );

    return Array.from(
        {
            length:
                maximum
        },
        (
            _,
            index
        ) =>
            index +
            1
    );
}

function getDayMentionContextV44(
    notes
) {
    const selection =
        window.getSelection();

    if (
        !selection ||
        !selection.rangeCount
    ) {
        return null;
    }

    const range =
        selection.getRangeAt(
            0
        );

    if (
        !range.collapsed ||
        !notes.contains(
            range.startContainer
        ) ||
        range.startContainer.nodeType !==
            Node.TEXT_NODE
    ) {
        return null;
    }

    const node =
        range.startContainer;

    const offset =
        range.startOffset;

    const before =
        node.data.slice(
            0,
            offset
        );

    const match =
        before.match(
            /@([^@\n]*)$/
        );

    if (!match) {
        return null;
    }

    const raw =
        match[1];

    // Stop treating it as a mention after normal prose begins.
    if (
        raw.length >
        18
    ) {
        return null;
    }

    const compact =
        raw
            .trim()
            .toLowerCase();

    if (
        compact &&
        !(
            /^d(a(y)?)?(\s+\d*)?$/.test(
                compact
            ) ||
            /^\d*$/.test(
                compact
            )
        )
    ) {
        return null;
    }

    return {
        node,
        offset,
        start:
            offset -
            raw.length -
            1,
        raw,
        range:
            range.cloneRange()
    };
}

function getDayMentionMatchesV44(
    raw
) {
    const query =
        String(
            raw ||
            ''
        )
            .trim()
            .toLowerCase()
            .replace(
                /^day\s*/,
                ''
            )
            .replace(
                /^d\s*/,
                ''
            );

    let days =
        getAllAvailableDaysV44();

    if (
        /^\d+$/.test(
            query
        )
    ) {
        days =
            days.filter(
                day =>
                    String(
                        day
                    ).startsWith(
                        query
                    )
            );
    }

    return days.slice(
        0,
        18
    );
}

function positionDayMentionMenuV44(
    range,
    notes
) {
    const menu =
        ensureDayMentionMenuV44();

    let rect =
        range
            .getBoundingClientRect();

    if (
        !rect ||
        (
            !rect.width &&
            !rect.height
        )
    ) {
        rect =
            notes.getBoundingClientRect();
    }

    const menuWidth =
        220;

    const left =
        Math.max(
            8,
            Math.min(
                window.innerWidth -
                    menuWidth -
                    8,
                rect.left
            )
        );

    const top =
        Math.min(
            window.innerHeight -
                260,
            rect.bottom +
                8
        );

    menu.style.left =
        `${left}px`;

    menu.style.top =
        `${Math.max(
            8,
            top
        )}px`;
}

function renderDayMentionMenuV44(
    notes
) {
    const context =
        getDayMentionContextV44(
            notes
        );

    if (!context) {
        closeDayMentionMenuV44();

        return;
    }

    const suggestions =
        getDayMentionMatchesV44(
            context.raw
        );

    if (!suggestions.length) {
        closeDayMentionMenuV44();

        return;
    }

    dayMentionRangeV44 =
        context.range;

    dayMentionStartOffsetV44 =
        context.start;

    dayMentionSuggestionsV44 =
        suggestions;

    dayMentionSelectedIndexV44 =
        Math.min(
            dayMentionSelectedIndexV44,
            suggestions.length -
                1
        );

    const menu =
        ensureDayMentionMenuV44();

    menu.innerHTML = `
        <div class="daily-day-mention-title-v44">
            Link a Daily Log
        </div>

        <div class="daily-day-mention-results-v44">
            ${suggestions.map(
                (
                    day,
                    index
                ) => `
                    <button
                        type="button"
                        data-day-mention-v44="${day}"
                        class="${index === dayMentionSelectedIndexV44 ? 'selected' : ''}"
                    >
                        <i class="ph ph-calendar-blank"></i>
                        <span>Day ${day}</span>
                    </button>
                `
            ).join('')}
        </div>
    `;

    menu.classList.remove(
        'hidden'
    );

    positionDayMentionMenuV44(
        context.range,
        notes
    );
}

function insertDayMentionSuggestionV44(
    day
) {
    const notes =
        document.getElementById(
            'log-notes'
        );

    const selection =
        window.getSelection();

    if (
        !notes ||
        !dayMentionRangeV44 ||
        !selection ||
        !Number.isFinite(
            day
        )
    ) {
        closeDayMentionMenuV44();

        return;
    }

    const node =
        dayMentionRangeV44
            .startContainer;

    if (
        node.nodeType !==
        Node.TEXT_NODE
    ) {
        closeDayMentionMenuV44();

        return;
    }

    const end =
        dayMentionRangeV44
            .startOffset;

    const start =
        Number(
            dayMentionStartOffsetV44
        );

    if (
        !Number.isFinite(
            start
        ) ||
        start <
            0 ||
        start >
            end
    ) {
        closeDayMentionMenuV44();

        return;
    }

    const replace =
        document.createRange();

    replace.setStart(
        node,
        start
    );

    replace.setEnd(
        node,
        end
    );

    const link =
        makeDayLinkV41(
            day,
            `@Day ${day}`
        );

    replace.deleteContents();

    replace.insertNode(
        link
    );

    const space =
        document.createTextNode(
            '\u00A0'
        );

    link.after(
        space
    );

    const caret =
        document.createRange();

    caret.setStartAfter(
        space
    );

    caret.collapse(
        true
    );

    selection.removeAllRanges();

    selection.addRange(
        caret
    );

    closeDayMentionMenuV44();

    if (currentDay) {
        db.days[currentDay]
            .notes =
            notes.innerHTML;

        scheduleSaveDay();
    }

    notes.focus();
}

function bindDayMentionAutocompleteV44() {
    const notes =
        document.getElementById(
            'log-notes'
        );

    if (
        !notes ||
        notes.dataset
            .dayMentionAutocompleteV44 ===
            'true'
    ) {
        return;
    }

    notes.dataset
        .dayMentionAutocompleteV44 =
        'true';

    notes.addEventListener(
        'input',
        () => {
            dayMentionSelectedIndexV44 =
                0;

            renderDayMentionMenuV44(
                notes
            );
        }
    );

    notes.addEventListener(
        'keyup',
        event => {
            if (
                [
                    'ArrowDown',
                    'ArrowUp',
                    'Enter',
                    'Escape'
                ].includes(
                    event.key
                )
            ) {
                return;
            }

            renderDayMentionMenuV44(
                notes
            );
        }
    );

    notes.addEventListener(
        'keydown',
        event => {
            const menuOpen =
                dayMentionMenuV44 &&
                !dayMentionMenuV44
                    .classList
                    .contains(
                        'hidden'
                    );

            if (!menuOpen) {
                return;
            }

            if (
                event.key ===
                'ArrowDown'
            ) {
                event.preventDefault();

                dayMentionSelectedIndexV44 =
                    (
                        dayMentionSelectedIndexV44 +
                        1
                    ) %
                    dayMentionSuggestionsV44
                        .length;

                renderDayMentionMenuV44(
                    notes
                );

                return;
            }

            if (
                event.key ===
                'ArrowUp'
            ) {
                event.preventDefault();

                dayMentionSelectedIndexV44 =
                    (
                        dayMentionSelectedIndexV44 -
                        1 +
                        dayMentionSuggestionsV44
                            .length
                    ) %
                    dayMentionSuggestionsV44
                        .length;

                renderDayMentionMenuV44(
                    notes
                );

                return;
            }

            if (
                event.key ===
                'Enter' ||
                event.key ===
                'Tab'
            ) {
                event.preventDefault();
                event.stopImmediatePropagation();

                const day =
                    dayMentionSuggestionsV44[
                        dayMentionSelectedIndexV44
                    ];

                if (day) {
                    insertDayMentionSuggestionV44(
                        day
                    );
                }

                return;
            }

            if (
                event.key ===
                'Escape'
            ) {
                event.preventDefault();

                closeDayMentionMenuV44();
            }
        },
        true
    );

    notes.addEventListener(
        'blur',
        () =>
            setTimeout(
                closeDayMentionMenuV44,
                160
            )
    );
}

bindDayMentionAutocompleteV44();

const openDayLogBeforeDayMentionV44 =
    openDayLog;

openDayLog =
    function(
        dayNumber
    ) {
        closeDayMentionMenuV44();

        const result =
            openDayLogBeforeDayMentionV44(
                dayNumber
            );

        requestAnimationFrame(
            bindDayMentionAutocompleteV44
        );

        return result;
    };


// ------------------------------------------------------------
// TRUE MANUAL DRAG — modal-level capture, above preview content.
// ------------------------------------------------------------

function syncManualDragModeV44(
    modal
) {
    const canvas =
        modal?.querySelector(
            '.theme-builder-live-canvas'
        );

    if (!canvas) {
        return;
    }

    const manual =
        modal
            ?.querySelector(
                '.theme-builder-svg-distribution'
            )
            ?.value ===
            'manual-fixed';

    canvas.classList.toggle(
        'theme-manual-placement-active-v44',
        manual
    );

    canvas
        .querySelectorAll(
            '.theme-builder-live-art-item'
        )
        .forEach(
            (
                item,
                index
            ) => {
                item.dataset
                    .manualSlotV44 =
                    String(
                        index
                    );

                item.classList.toggle(
                    'theme-manual-draggable-v44',
                    manual
                );
            }
        );
}

function bindTrueManualDragV44(
    modal
) {
    if (
        !modal ||
        modal.dataset
            .manualDragV44 ===
            'true'
    ) {
        syncManualDragModeV44(
            modal
        );

        return;
    }

    modal.dataset
        .manualDragV44 =
        'true';

    modal.addEventListener(
        'pointerdown',
        event => {
            const item =
                event.target.closest(
                    '.theme-builder-live-art-item'
                );

            if (!item) {
                return;
            }

            const select =
                modal.querySelector(
                    '.theme-builder-svg-distribution'
                );

            if (
                select?.value !==
                'manual-fixed'
            ) {
                return;
            }

            const canvas =
                modal.querySelector(
                    '.theme-builder-live-canvas'
                );

            if (!canvas) {
                return;
            }

            const slot =
                Number(
                    item.dataset
                        .manualSlotV44
                );

            if (
                !Number.isFinite(
                    slot
                )
            ) {
                return;
            }

            event.preventDefault();
            event.stopImmediatePropagation();

            item.classList.add(
                'theme-image-manual-dragging-v40'
            );

            const move =
                moveEvent => {
                    const rect =
                        canvas.getBoundingClientRect();

                    if (
                        !rect.width ||
                        !rect.height
                    ) {
                        return;
                    }

                    const x =
                        Math.max(
                            2,
                            Math.min(
                                98,
                                (
                                    (
                                        moveEvent.clientX -
                                        rect.left
                                    ) /
                                    rect.width
                                ) *
                                    100
                            )
                        );

                    const y =
                        Math.max(
                            3,
                            Math.min(
                                97,
                                (
                                    (
                                        moveEvent.clientY -
                                        rect.top
                                    ) /
                                    rect.height
                                ) *
                                    100
                            )
                        );

                    const count =
                        modal
                            ._themeBackgroundSvgs
                            ?.length ||
                        0;

                    modal._manualPlacementSlotsV40 =
                        normalizeManualSlotsV40(
                            modal
                                ._manualPlacementSlotsV40,
                            count
                        );

                    modal
                        ._manualPlacementSlotsV40[
                            slot
                        ] = {
                            x,
                            y
                        };

                    item.style.left =
                        `${x}%`;

                    item.style.top =
                        `${y}%`;
                };

            const finish =
                () => {
                    item.classList.remove(
                        'theme-image-manual-dragging-v40'
                    );

                    document.removeEventListener(
                        'pointermove',
                        move,
                        true
                    );

                    document.removeEventListener(
                        'pointerup',
                        finish,
                        true
                    );

                    document.removeEventListener(
                        'pointercancel',
                        finish,
                        true
                    );

                    renderDashboardThemePreviewV40(
                        modal
                    );
                };

            document.addEventListener(
                'pointermove',
                move,
                true
            );

            document.addEventListener(
                'pointerup',
                finish,
                true
            );

            document.addEventListener(
                'pointercancel',
                finish,
                true
            );
        },
        true
    );

    modal.addEventListener(
        'change',
        event => {
            if (
                !event.target.matches(
                    '.theme-builder-svg-distribution'
                )
            ) {
                return;
            }

            // V42 already captured the old layout. Make it visible immediately.
            requestAnimationFrame(
                () => {
                    syncManualDragModeV44(
                        modal
                    );

                    installTrueManualDragV42?.(
                        modal
                    );
                }
            );
        },
        true
    );

    syncManualDragModeV44(
        modal
    );
}


// ------------------------------------------------------------
// DASHBOARD PREVIEW — a real preview mode inside the same viewport.
// ------------------------------------------------------------

function ensureReliableDashboardPreviewV44(
    modal
) {
    if (!modal) {
        return null;
    }

    ensureThemeBuilderDashboardPreviewV40(
        modal
    );

    const viewport =
        modal.querySelector(
            '.theme-builder-live-preview-viewport'
        );

    if (!viewport) {
        return null;
    }

    viewport.classList.add(
        'theme-builder-preview-viewport-v44'
    );

    const dashboard =
        viewport.querySelector(
            '.theme-builder-dashboard-preview-v40'
        );

    if (dashboard) {
        dashboard.classList.add(
            'theme-builder-dashboard-preview-v44'
        );
    }

    const button =
        modal.querySelector(
            '.theme-builder-dashboard-preview-button-v40'
        );

    if (button) {
        button.title =
            'Preview Dashboard';

        button.innerHTML =
            '<i class="ph ph-house"></i> Dashboard';

        if (
            button.dataset
                .dashboardPreviewV44 !==
            'true'
        ) {
            button.dataset
                .dashboardPreviewV44 =
                'true';

            button.addEventListener(
                'click',
                event => {
                    event.preventDefault();
                    event.stopImmediatePropagation();

                    showReliableDashboardPreviewV44(
                        modal
                    );
                },
                true
            );
        }
    }

    return dashboard;
}

function showReliableDashboardPreviewV44(
    modal
) {
    const dashboard =
        ensureReliableDashboardPreviewV44(
            modal
        );

    const viewport =
        modal?.querySelector(
            '.theme-builder-live-preview-viewport'
        );

    const stage =
        viewport?.querySelector(
            '.theme-builder-live-preview-stage'
        );

    if (
        !dashboard ||
        !viewport
    ) {
        return;
    }

    modal._dashboardPreviewActiveV40 =
        true;

    stage?.classList.add(
        'hidden'
    );

    dashboard.classList.remove(
        'hidden'
    );

    dashboard.style.removeProperty(
        'display'
    );

    renderDashboardThemePreviewV40(
        modal
    );

    modal
        .querySelector(
            '.theme-builder-dashboard-preview-button-v40'
        )
        ?.classList.add(
            'active'
        );
}

function hideReliableDashboardPreviewV44(
    modal
) {
    const viewport =
        modal?.querySelector(
            '.theme-builder-live-preview-viewport'
        );

    modal._dashboardPreviewActiveV40 =
        false;

    viewport
        ?.querySelector(
            '.theme-builder-live-preview-stage'
        )
        ?.classList.remove(
            'hidden'
        );

    viewport
        ?.querySelector(
            '.theme-builder-dashboard-preview-v40'
        )
        ?.classList.add(
            'hidden'
        );

    modal
        ?.querySelector(
            '.theme-builder-dashboard-preview-button-v40'
        )
        ?.classList.remove(
            'active'
        );
}

function bindPreviewNavigationV44(
    modal
) {
    if (
        !modal ||
        modal.dataset
            .previewNavigationV44 ===
            'true'
    ) {
        return;
    }

    modal.dataset
        .previewNavigationV44 =
        'true';

    modal.addEventListener(
        'click',
        event => {
            const home =
                event.target.closest(
                    '.theme-builder-live-canvas a[href="/"]'
                );

            if (home) {
                event.preventDefault();
                event.stopImmediatePropagation();

                showReliableDashboardPreviewV44(
                    modal
                );

                return;
            }

            const previewNav =
                event.target.closest(
                    '.theme-builder-live-side-nav button, .theme-builder-live-side-nav a.icon-btn'
                );

            if (
                previewNav &&
                !home
            ) {
                hideReliableDashboardPreviewV44(
                    modal
                );
            }
        },
        true
    );
}


// ------------------------------------------------------------
// Final Theme Builder render hooks.
// ------------------------------------------------------------

const populateThemeBuilderBeforeV44 =
    populateThemeBuilder;

populateThemeBuilder =
    function(
        modal,
        theme
    ) {
        populateThemeBuilderBeforeV44(
            modal,
            theme
        );

        const distribution =
            modal.querySelector(
                '.theme-builder-svg-distribution'
            );

        const manualOption =
            distribution?.querySelector(
                'option[value="manual-fixed"]'
            );

        if (manualOption) {
            manualOption.textContent =
                'Manual scatter · fixed positions';
        }

        bindTrueManualDragV44(
            modal
        );

        ensureReliableDashboardPreviewV44(
            modal
        );

        bindPreviewNavigationV44(
            modal
        );
    };

const updateThemeBuilderPreviewBeforeV44 =
    updateThemeBuilderPreview;

updateThemeBuilderPreview =
    function(
        modal
    ) {
        updateThemeBuilderPreviewBeforeV44(
            modal
        );

        bindTrueManualDragV44(
            modal
        );

        syncManualDragModeV44(
            modal
        );

        ensureReliableDashboardPreviewV44(
            modal
        );

        if (
            modal
                ?._dashboardPreviewActiveV40
        ) {
            showReliableDashboardPreviewV44(
                modal
            );
        }
    };



// ============================================================
// V45 — CURSOR / TRUE MANUAL DRAG / @ POPUP / DASHBOARD PREVIEW
// CREATE VS CREATE & APPLY TEXT ACTIONS
// ============================================================


// ------------------------------------------------------------
// CUSTOM CURSOR: keep tracking through Theme Builder event guards.
// V13 intentionally stops bubbling mousemove/pointermove events inside the
// editor, so cursor tracking must run in the capture phase.
// ------------------------------------------------------------

trackCustomCursor =
    function(
        el
    ) {
        stopTrackingCustomCursor();

        customCursorMoveHandler =
            event => {
                if (!el) {
                    return;
                }

                el.style.transform =
                    `translate3d(${event.clientX}px, ${event.clientY}px, 0)`;
            };

        window.addEventListener(
            'pointermove',
            customCursorMoveHandler,
            true
        );

        window.addEventListener(
            'mousemove',
            customCursorMoveHandler,
            true
        );
    };

stopTrackingCustomCursor =
    function() {
        if (
            customCursorMoveHandler
        ) {
            // Remove both the historical bubbling listener and V45 capture
            // listeners so switching cursors never stacks handlers.
            document.removeEventListener(
                'mousemove',
                customCursorMoveHandler
            );

            window.removeEventListener(
                'pointermove',
                customCursorMoveHandler,
                true
            );

            window.removeEventListener(
                'mousemove',
                customCursorMoveHandler,
                true
            );

            customCursorMoveHandler =
                null;
        }
    };

const syncThemeBuilderOpenStateBeforeCursorV45 =
    syncThemeBuilderOpenStateV13;

syncThemeBuilderOpenStateV13 =
    function(
        modal
    ) {
        syncThemeBuilderOpenStateBeforeCursorV45(
            modal
        );

        const open =
            !!modal &&
            !modal.classList.contains(
                'hidden'
            );

        if (open) {
            requestAnimationFrame(
                () => {
                    applyCursorChoice?.();

                    const visual =
                        document.getElementById(
                            'custom-cursor-visual'
                        );

                    if (visual) {
                        visual.style.setProperty(
                            'z-index',
                            '2147483647',
                            'important'
                        );

                        visual.style.setProperty(
                            'pointer-events',
                            'none',
                            'important'
                        );
                    }
                }
            );
        }
    };


// ------------------------------------------------------------
// @ DAY: use the same interaction model as the backslash link popup.
// Pressing @ immediately opens a searchable popup and moves focus there.
// ------------------------------------------------------------

let daySlashRangeV45 =
    null;

let dayPopupSelectedV45 =
    0;

function ensureNotesDayPopupV45() {
    let popup =
        document.getElementById(
            'notes-day-popup-v45'
        );

    if (popup) {
        return popup;
    }

    popup =
        document.createElement(
            'div'
        );

    popup.id =
        'notes-day-popup-v45';

    popup.className =
        'notes-day-popup-v45 hidden';

    popup.innerHTML = `
        <div class="notes-day-popup-search-v45">
            <i class="ph ph-magnifying-glass"></i>
            <input
                type="search"
                id="notes-day-search-input-v45"
                placeholder="Search Day 1, Day 2…"
                autocomplete="off"
            >
        </div>

        <div class="notes-day-popup-results-v45"></div>
    `;

    const linkPopup =
        document.getElementById(
            'notes-link-popup'
        );

    if (linkPopup) {
        linkPopup.insertAdjacentElement(
            'afterend',
            popup
        );
    } else {
        document
            .getElementById(
                'log-notes'
            )
            ?.insertAdjacentElement(
                'afterend',
                popup
            );
    }

    const input =
        popup.querySelector(
            '#notes-day-search-input-v45'
        );

    input.addEventListener(
        'input',
        () => {
            dayPopupSelectedV45 =
                0;

            renderNotesDayPopupV45();
        }
    );

    input.addEventListener(
        'keydown',
        event => {
            const choices =
                Array.from(
                    popup.querySelectorAll(
                        '[data-day-choice-v45]'
                    )
                );

            if (
                event.key ===
                'ArrowDown'
            ) {
                event.preventDefault();

                if (
                    choices.length
                ) {
                    dayPopupSelectedV45 =
                        (
                            dayPopupSelectedV45 +
                            1
                        ) %
                        choices.length;

                    renderNotesDayPopupV45();
                }

                return;
            }

            if (
                event.key ===
                'ArrowUp'
            ) {
                event.preventDefault();

                if (
                    choices.length
                ) {
                    dayPopupSelectedV45 =
                        (
                            dayPopupSelectedV45 -
                            1 +
                            choices.length
                        ) %
                        choices.length;

                    renderNotesDayPopupV45();
                }

                return;
            }

            if (
                event.key ===
                'Enter'
            ) {
                event.preventDefault();

                const choice =
                    popup.querySelectorAll(
                        '[data-day-choice-v45]'
                    )[
                        dayPopupSelectedV45
                    ];

                if (choice) {
                    insertNotesDayChoiceV45(
                        Number(
                            choice.dataset
                                .dayChoiceV45
                        )
                    );
                }

                return;
            }

            if (
                event.key ===
                'Escape'
            ) {
                event.preventDefault();

                closeNotesDayPopupV45();

                document
                    .getElementById(
                        'log-notes'
                    )
                    ?.focus();
            }
        }
    );

    popup.addEventListener(
        'pointerdown',
        event => {
            const choice =
                event.target.closest(
                    '[data-day-choice-v45]'
                );

            if (!choice) {
                return;
            }

            event.preventDefault();

            insertNotesDayChoiceV45(
                Number(
                    choice.dataset
                        .dayChoiceV45
                )
            );
        }
    );

    return popup;
}

function notesDayChoicesV45(
    query
) {
    const saved =
        Object.keys(
            db.days ||
            {}
        )
            .map(
                Number
            )
            .filter(
                day =>
                    Number.isFinite(
                        day
                    ) &&
                    day >=
                        1
            );

    const maxDay =
        Math.max(
            Number(
                typeof TOTAL_CURRICULUM_DAYS !==
                    'undefined'
                    ? TOTAL_CURRICULUM_DAYS
                    : 0
            ) ||
                0,
            ...saved,
            Number(
                currentDay
            ) ||
                0,
            1
        );

    const normalized =
        String(
            query ||
            ''
        )
            .trim()
            .toLowerCase()
            .replace(
                /^@/,
                ''
            )
            .replace(
                /^day\s*/,
                ''
            );

    let days =
        Array.from(
            {
                length:
                    maxDay
            },
            (
                _,
                index
            ) =>
                index +
                1
        );

    if (
        normalized
    ) {
        days =
            days.filter(
                day =>
                    `day ${day}`
                        .includes(
                            normalized
                        ) ||
                    String(
                        day
                    ).startsWith(
                        normalized
                    )
            );
    }

    return days.slice(
        0,
        24
    );
}

function renderNotesDayPopupV45() {
    const popup =
        ensureNotesDayPopupV45();

    const input =
        popup.querySelector(
            '#notes-day-search-input-v45'
        );

    const results =
        popup.querySelector(
            '.notes-day-popup-results-v45'
        );

    const days =
        notesDayChoicesV45(
            input.value
        );

    if (
        dayPopupSelectedV45 >=
        days.length
    ) {
        dayPopupSelectedV45 =
            Math.max(
                0,
                days.length -
                    1
            );
    }

    results.innerHTML =
        days.length
            ? days.map(
                (
                    day,
                    index
                ) => `
                    <button
                        type="button"
                        data-day-choice-v45="${day}"
                        class="${index === dayPopupSelectedV45 ? 'selected' : ''}"
                    >
                        <i class="ph ph-calendar-blank"></i>
                        <span>Day ${day}</span>
                    </button>
                `
            ).join('')
            : `
                <div class="notes-day-popup-empty-v45">
                    No matching day.
                </div>
            `;
}

function openNotesDayPopupV45(
    range
) {
    daySlashRangeV45 =
        range;

    dayPopupSelectedV45 =
        0;

    closeDayMentionMenuV44?.();

    const popup =
        ensureNotesDayPopupV45();

    const input =
        popup.querySelector(
            '#notes-day-search-input-v45'
        );

    input.value =
        '';

    renderNotesDayPopupV45();

    popup.classList.remove(
        'hidden'
    );

    requestAnimationFrame(
        () =>
            input.focus()
    );
}

function closeNotesDayPopupV45() {
    document
        .getElementById(
            'notes-day-popup-v45'
        )
        ?.classList.add(
            'hidden'
        );

    daySlashRangeV45 =
        null;
}

function insertNotesDayChoiceV45(
    day
) {
    if (
        !daySlashRangeV45 ||
        !Number.isFinite(
            Number(
                day
            )
        )
    ) {
        return;
    }

    const range =
        daySlashRangeV45
            .cloneRange();

    const link =
        makeDayLinkV41(
            Number(
                day
            ),
            `@Day ${Number(
                day
            )}`
        );

    range.insertNode(
        link
    );

    const space =
        document.createTextNode(
            '\u00A0'
        );

    link.after(
        space
    );

    const selection =
        window.getSelection();

    const caret =
        document.createRange();

    caret.setStartAfter(
        space
    );

    caret.collapse(
        true
    );

    selection.removeAllRanges();

    selection.addRange(
        caret
    );

    closeNotesDayPopupV45();

    const notes =
        document.getElementById(
            'log-notes'
        );

    if (
        currentDay &&
        notes
    ) {
        db.days[currentDay]
            .notes =
            notes.innerHTML;

        scheduleSaveDay();
    }

    notes?.focus();
}

function bindSlashStyleDayPopupV45() {
    const notes =
        document.getElementById(
            'log-notes'
        );

    if (
        !notes ||
        notes.dataset
            .dayPopupV45 ===
            'true'
    ) {
        return;
    }

    notes.dataset
        .dayPopupV45 =
        'true';

    notes.addEventListener(
        'keydown',
        event => {
            if (
                event.key !==
                '@'
            ) {
                return;
            }

            const selection =
                window.getSelection();

            if (
                !selection ||
                !selection.rangeCount
            ) {
                return;
            }

            const range =
                selection.getRangeAt(
                    0
                );

            if (
                !range.collapsed ||
                !notes.contains(
                    range.startContainer
                )
            ) {
                return;
            }

            event.preventDefault();
            event.stopImmediatePropagation();

            openNotesDayPopupV45(
                range.cloneRange()
            );
        },
        true
    );
}

bindSlashStyleDayPopupV45();

const openDayLogBeforePopupV45 =
    openDayLog;

openDayLog =
    function(
        dayNumber
    ) {
        closeNotesDayPopupV45();

        const result =
            openDayLogBeforePopupV45(
                dayNumber
            );

        requestAnimationFrame(
            bindSlashStyleDayPopupV45
        );

        return result;
    };


// ------------------------------------------------------------
// DASHBOARD PREVIEW: independent final overlay, not the old gray layer.
// ------------------------------------------------------------

function ensureDashboardPreviewV45(
    modal
) {
    const viewport =
        modal?.querySelector(
            '.theme-builder-live-preview-viewport'
        );

    if (!viewport) {
        return null;
    }

    viewport.classList.add(
        'theme-builder-preview-host-v45'
    );

    let preview =
        viewport.querySelector(
            '.theme-builder-dashboard-preview-v45'
        );

    if (!preview) {
        preview =
            document.createElement(
                'div'
            );

        preview.className =
            'theme-builder-dashboard-preview-v45 hidden';

        viewport.appendChild(
            preview
        );
    }

    return preview;
}

function renderDashboardPreviewV45(
    modal
) {
    const preview =
        ensureDashboardPreviewV45(
            modal
        );

    if (!preview) {
        return;
    }

    const draft =
        getThemeBuilderDraft(
            modal
        );

    preview.style.setProperty(
        '--tb-dashboard-bg-v45',
        draft.dashboardBackgroundV40 ||
            draft.background ||
            '#f5f5f5'
    );

    preview.style.setProperty(
        '--tb-dashboard-card-v45',
        draft.dashboardCardV40 ||
            draft.surface ||
            '#ffffff'
    );

    preview.style.setProperty(
        '--tb-dashboard-text-v45',
        draft.dashboardTextV40 ||
            draft.text ||
            '#171717'
    );

    preview.style.setProperty(
        '--tb-dashboard-accent-v45',
        draft.dashboardAccentV40 ||
            draft.accent ||
            '#777777'
    );

    const assignments =
        getPreviewSvgAssignmentsV10(
            modal,
            draft
        );

    preview.innerHTML = `
        <div class="theme-builder-dashboard-art-stage-v45">
            ${assignments.map(
                (
                    assignment,
                    index
                ) => `
                    <div
                        class="theme-builder-dashboard-art-item-v45"
                        data-manual-slot-v45="${index}"
                        style="
                            left:${assignment.left}%;
                            top:${assignment.top}%;
                        "
                    >
                        ${renderThemeImageAssetV36(
                            assignment.svg
                        )}
                    </div>
                `
            ).join('')}
        </div>

        <div class="theme-builder-dashboard-toolbar-v45">
            <button type="button"><i class="ph ph-hard-drives"></i></button>
            <button type="button"><i class="ph ph-trash"></i></button>
            <button type="button"><i class="ph ph-palette"></i></button>
        </div>

        <h2>MY LOGS</h2>

        <div class="theme-builder-dashboard-filters-v45">
            <span class="active">All</span>
            <span>School</span>
            <span>Non-School</span>
        </div>

        <div class="theme-builder-dashboard-cards-v45">
            <div>
                <i class="ph ph-translate"></i>
                <span>French</span>
            </div>

            <div>
                <i class="ph ph-guitar"></i>
                <span>Guitar</span>
            </div>

            <div>
                <i class="ph ph-calculator"></i>
                <span>Calculus</span>
            </div>

            <div class="add">
                <i class="ph ph-plus"></i>
                <span>New Log</span>
            </div>
        </div>
    `;
}

function showDashboardPreviewV45(
    modal
) {
    const preview =
        ensureDashboardPreviewV45(
            modal
        );

    if (!preview) {
        return;
    }

    renderDashboardPreviewV45(
        modal
    );

    modal._dashboardPreviewActiveV45 =
        true;

    modal._dashboardPreviewActiveV40 =
        false;

    modal
        .querySelector(
            '.theme-builder-dashboard-preview-v40'
        )
        ?.classList.add(
            'hidden'
        );

    modal
        .querySelector(
            '.theme-builder-live-preview-stage'
        )
        ?.classList.add(
            'hidden'
        );

    preview.classList.remove(
        'hidden'
    );

    modal
        .querySelector(
            '.theme-builder-dashboard-preview-button-v40'
        )
        ?.classList.add(
            'active'
        );
}

function hideDashboardPreviewV45(
    modal
) {
    modal._dashboardPreviewActiveV45 =
        false;

    modal
        ?.querySelector(
            '.theme-builder-dashboard-preview-v45'
        )
        ?.classList.add(
            'hidden'
        );

    modal
        ?.querySelector(
            '.theme-builder-live-preview-stage'
        )
        ?.classList.remove(
            'hidden'
        );

    modal
        ?.querySelector(
            '.theme-builder-dashboard-preview-button-v40'
        )
        ?.classList.remove(
            'active'
        );
}

function bindDashboardPreviewV45(
    modal
) {
    if (
        !modal ||
        modal.dataset
            .dashboardPreviewV45 ===
            'true'
    ) {
        if (
            modal
                ?._dashboardPreviewActiveV45
        ) {
            renderDashboardPreviewV45(
                modal
            );
        }

        return;
    }

    modal.dataset
        .dashboardPreviewV45 =
        'true';

    modal.addEventListener(
        'click',
        event => {
            const dashboardButton =
                event.target.closest(
                    '.theme-builder-dashboard-preview-button-v40'
                );

            const home =
                event.target.closest(
                    '.theme-builder-live-canvas a[href="/"]'
                );

            if (
                dashboardButton ||
                home
            ) {
                event.preventDefault();
                event.stopImmediatePropagation();

                showDashboardPreviewV45(
                    modal
                );

                return;
            }

            if (
                event.target.closest(
                    '.theme-builder-live-side-nav button, .theme-builder-live-side-nav a.icon-btn'
                )
            ) {
                hideDashboardPreviewV45(
                    modal
                );
            }
        },
        true
    );
}


// ------------------------------------------------------------
// MANUAL PLACEMENT: drag artwork in BOTH log preview and Dashboard.
// ------------------------------------------------------------

function bindUniversalManualDragV45(
    modal
) {
    if (
        !modal ||
        modal.dataset
            .universalManualDragV45 ===
            'true'
    ) {
        return;
    }

    modal.dataset
        .universalManualDragV45 =
        'true';

    modal.addEventListener(
        'pointerdown',
        event => {
            const liveItem =
                event.target.closest(
                    '.theme-builder-live-art-item'
                );

            const dashboardItem =
                event.target.closest(
                    '.theme-builder-dashboard-art-item-v45'
                );

            const item =
                liveItem ||
                dashboardItem;

            if (!item) {
                return;
            }

            const distribution =
                modal.querySelector(
                    '.theme-builder-svg-distribution'
                );

            if (
                distribution?.value !==
                'manual-fixed'
            ) {
                return;
            }

            const items =
                dashboardItem
                    ? Array.from(
                        modal.querySelectorAll(
                            '.theme-builder-dashboard-art-item-v45'
                        )
                    )
                    : Array.from(
                        modal.querySelectorAll(
                            '.theme-builder-live-art-item'
                        )
                    );

            const slot =
                dashboardItem
                    ? Number(
                        dashboardItem.dataset
                            .manualSlotV45
                    )
                    : items.indexOf(
                        liveItem
                    );

            if (
                !Number.isFinite(
                    slot
                ) ||
                slot <
                    0
            ) {
                return;
            }

            const boundsTarget =
                dashboardItem
                    ? modal.querySelector(
                        '.theme-builder-dashboard-preview-v45'
                    )
                    : modal.querySelector(
                        '.theme-builder-live-canvas'
                    );

            if (!boundsTarget) {
                return;
            }

            event.preventDefault();
            event.stopImmediatePropagation();

            item.classList.add(
                'theme-image-manual-dragging-v45'
            );

            const move =
                moveEvent => {
                    const rect =
                        boundsTarget
                            .getBoundingClientRect();

                    if (
                        !rect.width ||
                        !rect.height
                    ) {
                        return;
                    }

                    const x =
                        Math.max(
                            2,
                            Math.min(
                                98,
                                (
                                    (
                                        moveEvent.clientX -
                                        rect.left
                                    ) /
                                    rect.width
                                ) *
                                    100
                            )
                        );

                    const y =
                        Math.max(
                            3,
                            Math.min(
                                97,
                                (
                                    (
                                        moveEvent.clientY -
                                        rect.top
                                    ) /
                                    rect.height
                                ) *
                                    100
                            )
                        );

                    const count =
                        modal
                            ._themeBackgroundSvgs
                            ?.length ||
                        0;

                    modal._manualPlacementSlotsV40 =
                        normalizeManualSlotsV40(
                            modal
                                ._manualPlacementSlotsV40,
                            count
                        );

                    modal
                        ._manualPlacementSlotsV40[
                            slot
                        ] = {
                            x,
                            y
                        };

                    item.style.left =
                        `${x}%`;

                    item.style.top =
                        `${y}%`;
                };

            const finish =
                () => {
                    item.classList.remove(
                        'theme-image-manual-dragging-v45'
                    );

                    document.removeEventListener(
                        'pointermove',
                        move,
                        true
                    );

                    document.removeEventListener(
                        'pointerup',
                        finish,
                        true
                    );

                    document.removeEventListener(
                        'pointercancel',
                        finish,
                        true
                    );

                    if (
                        modal
                            ._dashboardPreviewActiveV45
                    ) {
                        renderDashboardPreviewV45(
                            modal
                        );
                    }
                };

            document.addEventListener(
                'pointermove',
                move,
                true
            );

            document.addEventListener(
                'pointerup',
                finish,
                true
            );

            document.addEventListener(
                'pointercancel',
                finish,
                true
            );
        },
        true
    );
}


// ------------------------------------------------------------
// CREATE / CREATE & APPLY — text-only in normal Theme Builder.
// ------------------------------------------------------------

async function createThemeWithoutApplyingV45(
    modal
) {
    if (
        !validateThemeBuilderBeforeSaveV25(
            modal
        )
    ) {
        return;
    }

    const currentTheme =
        db.settings.theme ||
        'default';

    const draft =
        getThemeBuilderDraft(
            modal
        );

    db.settings.customTheme = {
        ...FEATURE_SUITE_DEFAULT_THEME,
        ...CUSTOM_THEME_MEDIA_DEFAULTS_V3,
        ...CUSTOM_THEME_VISUAL_DEFAULTS_V4,
        ...draft
    };

    db.settings.customThemeDeleted =
        false;

    db.settings.deletedThemes =
        (
            db.settings.deletedThemes ||
            []
        ).filter(
            value =>
                value !==
                'theme-custom-builder'
        );

    ensureCustomThemePickerOption();

    publishCurrentLogThemesV40?.();

    db.settings.theme =
        currentTheme;

    await saveDb();

    if (dailyThemeSelect) {
        dailyThemeSelect.value =
            currentTheme;
    }

    themePickerSelected =
        currentTheme;

    renderThemePicker();

    modal.classList.add(
        'hidden'
    );

    showFeatureToast(
        'Theme created.'
    );
}

function installNormalCreateActionsV45(
    modal
) {
    if (
        !modal ||
        isDashboardThemeStudioV43?.() ||
        modal.dataset
            .themeBuilderMode !==
            'create'
    ) {
        return;
    }

    const save =
        modal.querySelector(
            '.theme-builder-save'
        );

    const actions =
        modal.querySelector(
            '.theme-builder-actions'
        );

    if (
        !save ||
        !actions
    ) {
        return;
    }

    // V34 has already wired the true Create & Apply path at this point.
    if (
        !modal._createApplyHandlerV45
    ) {
        modal._createApplyHandlerV45 =
            save.onclick;
    }

    save.textContent =
        'Create';

    save.onclick =
        () =>
            createThemeWithoutApplyingV45(
                modal
            );

    let apply =
        actions.querySelector(
            '.theme-builder-create-apply-v45'
        );

    if (!apply) {
        apply =
            document.createElement(
                'button'
            );

        apply.type =
            'button';

        apply.className =
            'icon-btn custom-tab-primary-btn theme-builder-create-apply-v45';

        save.insertAdjacentElement(
            'afterend',
            apply
        );
    }

    apply.textContent =
        'Create & Apply';

    apply.onclick =
        async () => {
            window._forceThemeAccessoriesOnceV32 =
                true;

            primeThemeAudioV41?.(
                getThemeBuilderDraft(
                    modal
                )
            );

            return modal
                ._createApplyHandlerV45
                ?.call(
                    save
                );
        };
}

const openNewThemeBuilderCleanBeforeActionsV45 =
    openNewThemeBuilderCleanV34;

openNewThemeBuilderCleanV34 =
    function() {
        openNewThemeBuilderCleanBeforeActionsV45();

        const modal =
            document.getElementById(
                'theme-builder-modal'
            );

        requestAnimationFrame(
            () => {
                installNormalCreateActionsV45(
                    modal
                );

                bindDashboardPreviewV45(
                    modal
                );

                bindUniversalManualDragV45(
                    modal
                );

                applyCursorChoice?.();
            }
        );
    };


// Dashboard studio already has separate handlers; V45 only removes icons.
const installDashboardThemeStudioActionsBeforeTextV45 =
    installDashboardThemeStudioActionsV43;

installDashboardThemeStudioActionsV43 =
    function(
        modal
    ) {
        installDashboardThemeStudioActionsBeforeTextV45(
            modal
        );

        if (
            !isDashboardThemeStudioV43?.() ||
            !modal
        ) {
            return;
        }

        const createMode =
            getDashboardThemeStudioActionV43() ===
            'create';

        const save =
            modal.querySelector(
                '.theme-builder-save'
            );

        const apply =
            modal.querySelector(
                '.theme-builder-create-apply-v43'
            );

        if (save) {
            save.textContent =
                createMode
                    ? 'Create'
                    : 'Save';
        }

        if (apply) {
            apply.textContent =
                createMode
                    ? 'Create & Apply'
                    : 'Save & Apply';
        }
    };


// ------------------------------------------------------------
// FINAL render hooks.
// ------------------------------------------------------------

const populateThemeBuilderBeforeV45 =
    populateThemeBuilder;

populateThemeBuilder =
    function(
        modal,
        theme
    ) {
        populateThemeBuilderBeforeV45(
            modal,
            theme
        );

        bindDashboardPreviewV45(
            modal
        );

        bindUniversalManualDragV45(
            modal
        );

        ensureDashboardPreviewV45(
            modal
        );

        installDashboardThemeStudioActionsV43?.(
            modal
        );

        requestAnimationFrame(
            () =>
                applyCursorChoice?.()
        );
    };

const updateThemeBuilderPreviewBeforeV45 =
    updateThemeBuilderPreview;

updateThemeBuilderPreview =
    function(
        modal
    ) {
        updateThemeBuilderPreviewBeforeV45(
            modal
        );

        bindDashboardPreviewV45(
            modal
        );

        bindUniversalManualDragV45(
            modal
        );

        if (
            modal
                ?._dashboardPreviewActiveV45
        ) {
            showDashboardPreviewV45(
                modal
            );
        }

        requestAnimationFrame(
            () =>
                applyCursorChoice?.()
        );
    };



// ============================================================
// V46 — CURSOR SAVE / LOG↔DASHBOARD PREVIEW SWITCHER
// IMAGE UPLOAD BUTTON POLISH
// ============================================================


// ------------------------------------------------------------
// Choosing a cursor/companion in the visual gallery means "use it".
// Also force accessories when saving an edited built-in theme.
// ------------------------------------------------------------

function ensureChosenThemeAccessoriesEnabledV46(
    modal
) {
    const section =
        modal?.querySelector(
            '.theme-builder-accessories-v32'
        );

    if (!section) {
        return;
    }

    const selectedCursor =
        section.querySelector(
            '.theme-cursor-card-v37.selected'
        );

    if (selectedCursor) {
        const checkbox =
            section.querySelector(
                '.theme-builder-use-cursor-v32 input'
            );

        if (checkbox) {
            checkbox.checked =
                true;
        }

        const select =
            section.querySelector(
                '.theme-builder-cursor-choice-v32 select'
            );

        if (select) {
            select.value =
                selectedCursor.dataset
                    .cursorId ||
                select.value;
        }
    }

    const selectedCompanion =
        section.querySelector(
            '.theme-companion-card-v37.selected'
        );

    if (selectedCompanion) {
        const checkbox =
            section.querySelector(
                '.theme-builder-use-companion-v32 input'
            );

        if (checkbox) {
            checkbox.checked =
                true;
        }

        const select =
            section.querySelector(
                '.theme-builder-companion-choice-v32 select'
            );

        if (select) {
            select.value =
                selectedCompanion.dataset
                    .companionId ||
                select.value;
        }
    }

    section
        ._syncThemeAccessoryStateV32
        ?.();
}

function bindThemeAccessoryAutoEnableV46(
    modal
) {
    if (
        !modal ||
        modal.dataset
            .accessoryAutoEnableV46 ===
            'true'
    ) {
        return;
    }

    modal.dataset
        .accessoryAutoEnableV46 =
        'true';

    modal.addEventListener(
        'click',
        event => {
            const cursor =
                event.target.closest(
                    '.theme-cursor-card-v37'
                );

            if (cursor) {
                requestAnimationFrame(
                    () => {
                        const section =
                            modal.querySelector(
                                '.theme-builder-accessories-v32'
                            );

                        const checkbox =
                            section?.querySelector(
                                '.theme-builder-use-cursor-v32 input'
                            );

                        if (checkbox) {
                            checkbox.checked =
                                true;

                            checkbox.dispatchEvent(
                                new Event(
                                    'change',
                                    {
                                        bubbles:
                                            true
                                    }
                                )
                            );
                        }

                        refreshThemeAccessoryGallerySelectionV37?.(
                            modal
                        );
                    }
                );

                return;
            }

            const companion =
                event.target.closest(
                    '.theme-companion-card-v37'
                );

            if (companion) {
                requestAnimationFrame(
                    () => {
                        const section =
                            modal.querySelector(
                                '.theme-builder-accessories-v32'
                            );

                        const checkbox =
                            section?.querySelector(
                                '.theme-builder-use-companion-v32 input'
                            );

                        if (checkbox) {
                            checkbox.checked =
                                true;

                            checkbox.dispatchEvent(
                                new Event(
                                    'change',
                                    {
                                        bubbles:
                                            true
                                    }
                                )
                            );
                        }

                        refreshThemeAccessoryGallerySelectionV37?.(
                            modal
                        );
                    }
                );
            }
        }
    );
}

const saveThemeOverrideBeforeCursorV46 =
    saveThemeOverrideV25;

saveThemeOverrideV25 =
    async function(
        modal
    ) {
        ensureChosenThemeAccessoriesEnabledV46(
            modal
        );

        window._forceThemeAccessoriesOnceV32 =
            true;

        return saveThemeOverrideBeforeCursorV46(
            modal
        );
    };


// ------------------------------------------------------------
// Image upload uses the exact same button treatment as Choose Audio.
// ------------------------------------------------------------

function styleThemeImageUploadButtonV46(
    modal
) {
    const addCard =
        modal?.querySelector(
            '.theme-builder-svg-add-card'
        );

    if (!addCard) {
        return;
    }

    addCard.classList.add(
        'theme-builder-file-button',
        'theme-builder-image-upload-button-v46'
    );

    addCard.innerHTML = `
        <i class="ph ph-images"></i>
        <span>Upload Images</span>
    `;

    addCard.title =
        'Upload Images';

    addCard.setAttribute(
        'aria-label',
        'Upload Images'
    );
}


// ------------------------------------------------------------
// Preview navigation: one Dashboard control from the log preview,
// one Log Page icon from Dashboard preview.
// ------------------------------------------------------------

function ensureLogPreviewButtonV46(
    modal
) {
    const controls =
        modal?.querySelector(
            '.theme-builder-live-preview-controls'
        );

    if (!controls) {
        return null;
    }

    let button =
        controls.querySelector(
            '.theme-builder-log-preview-button-v46'
        );

    if (!button) {
        button =
            document.createElement(
                'button'
            );

        button.type =
            'button';

        button.className =
            'small-icon-btn theme-builder-log-preview-button-v46 hidden';

        button.title =
            'Return to Log Page preview';

        button.setAttribute(
            'aria-label',
            'Log Page preview'
        );

        button.innerHTML =
            '<i class="ph ph-notebook"></i>';

        button.addEventListener(
            'click',
            event => {
                event.preventDefault();
                event.stopImmediatePropagation();

                hideDashboardPreviewV45(
                    modal
                );

                syncPreviewSwitcherV46(
                    modal
                );
            },
            true
        );

        controls.prepend(
            button
        );
    }

    return button;
}

function syncPreviewSwitcherV46(
    modal
) {
    if (!modal) {
        return;
    }

    const dashboardButton =
        modal.querySelector(
            '.theme-builder-dashboard-preview-button-v40'
        );

    const logButton =
        ensureLogPreviewButtonV46(
            modal
        );

    const onDashboard =
        !!modal
            ._dashboardPreviewActiveV45;

    dashboardButton?.classList.toggle(
        'hidden',
        onDashboard
    );

    logButton?.classList.toggle(
        'hidden',
        !onDashboard
    );
}

const showDashboardPreviewBeforeSwitcherV46 =
    showDashboardPreviewV45;

showDashboardPreviewV45 =
    function(
        modal
    ) {
        showDashboardPreviewBeforeSwitcherV46(
            modal
        );

        syncPreviewSwitcherV46(
            modal
        );
    };

const hideDashboardPreviewBeforeSwitcherV46 =
    hideDashboardPreviewV45;

hideDashboardPreviewV45 =
    function(
        modal
    ) {
        hideDashboardPreviewBeforeSwitcherV46(
            modal
        );

        syncPreviewSwitcherV46(
            modal
        );
    };


// ------------------------------------------------------------
// Final Theme Builder hooks.
// ------------------------------------------------------------

const populateThemeBuilderBeforeV46 =
    populateThemeBuilder;

populateThemeBuilder =
    function(
        modal,
        theme
    ) {
        populateThemeBuilderBeforeV46(
            modal,
            theme
        );

        bindThemeAccessoryAutoEnableV46(
            modal
        );

        styleThemeImageUploadButtonV46(
            modal
        );

        ensureLogPreviewButtonV46(
            modal
        );

        syncPreviewSwitcherV46(
            modal
        );
    };

const renderThemeBuilderSvgListBeforeUploadStyleV46 =
    renderThemeBuilderSvgListV2;

renderThemeBuilderSvgListV2 =
    function(
        modal
    ) {
        renderThemeBuilderSvgListBeforeUploadStyleV46(
            modal
        );

        styleThemeImageUploadButtonV46(
            modal
        );
    };

const updateThemeBuilderPreviewBeforeSwitcherV46 =
    updateThemeBuilderPreview;

updateThemeBuilderPreview =
    function(
        modal
    ) {
        updateThemeBuilderPreviewBeforeSwitcherV46(
            modal
        );

        syncPreviewSwitcherV46(
            modal
        );
    };



// ============================================================
// V47 — INDEPENDENT NEW THEMES / CURRENT CUSTOM THEME SELECTION
// V404: Dashboard placement snapshots retired. Dashboard and Log now compute
// the same distribution directly from svgDistribution/manualPlacementSlotsV40.
// ============================================================

// ------------------------------------------------------------
// V368: applied-theme selection on Settings open is owned by the final
// Settings runtime in template-extras-6.js. The older V47 wrapper that
// re-rendered/re-selected the picker on its own has been removed so there is
// one selection owner instead of competing open-time passes.
// ------------------------------------------------------------

// ------------------------------------------------------------
// A NEW theme is always a unique Theme Copy.
// It never overwrites db.settings.customTheme or the theme currently active.
// ------------------------------------------------------------

async function createIndependentThemeV47(
    modal,
    applyAfterCreate =
        false
) {
    if (
        !modal ||
        !validateThemeBuilderBeforeSaveV25(
            modal
        )
    ) {
        return;
    }

    ensureChosenThemeAccessoriesEnabledV46?.(
        modal
    );

    const oldThemeId =
        db.settings
            ?.theme ||
        'default';

    const draft =
        getThemeBuilderDraft(
            modal
        );

    const id =
        makeThemeCopyIdV30();

    const name =
        String(
            draft.name ||
            'Custom Theme'
        ).trim() ||
        'Custom Theme';

    const themeData =
        cloneThemeDataV30({
            ...FEATURE_SUITE_DEFAULT_THEME,
            ...CUSTOM_THEME_MEDIA_DEFAULTS_V3,
            ...CUSTOM_THEME_VISUAL_DEFAULTS_V4,
            ...CUSTOM_THEME_ACCESSORY_DEFAULTS_V32,
            ...draft,
            name
        });

    const copy = {
        id,
        name,
        sourceThemeId:
            '',
        theme:
            themeData,
        createdAt:
            new Date()
                .toISOString()
    };

    ensureThemeCopiesV30()
        .push(
            copy
        );

    // Publish this SAME ID to the cross-dashboard theme library. This avoids
    // the old custom-theme + imported-shared-copy duplication.
    publishSharedThemeV40?.({
        id,
        name,
        theme:
            themeData,
        sourceThemeId:
            ''
    });

    await saveDb();

    syncThemeCopyOptionsV30();

    if (
        applyAfterCreate
    ) {
        window._forceThemeAccessoriesOnceV32 =
            true;

        primeThemeAudioV41?.(
            themeData
        );

        await applyTheme(
            id,
            {
                persist:
                    true
            }
        );

        if (
            dailyThemeSelect
        ) {
            dailyThemeSelect.value =
                id;
        }

        themePickerSelected =
            id;
    } else {
        // Creating without applying must leave the active theme entirely alone.
        db.settings.theme =
            oldThemeId;

        if (
            dailyThemeSelect
        ) {
            dailyThemeSelect.value =
                oldThemeId;
        }

        themePickerSelected =
            oldThemeId;

        await saveDb();
    }

    renderThemePicker();

    modal.classList.add(
        'hidden'
    );

    dailySettingsModal
        ?.classList.add(
            'hidden'
        );

    showFeatureToast(
        applyAfterCreate
            ? `Created and applied “${name}”.`
            : `Created “${name}”.`
    );
}

function installIndependentCreateButtonsV47(
    modal
) {
    if (
        !modal ||
        isDashboardThemeStudioV43?.() ||
        modal.dataset
            .themeBuilderMode !==
            'create'
    ) {
        return;
    }

    const save =
        modal.querySelector(
            '.theme-builder-save'
        );

    if (!save) {
        return;
    }

    let apply =
        modal.querySelector(
            '.theme-builder-create-apply-v45'
        );

    save.textContent =
        'Create';

    save.onclick =
        () =>
            createIndependentThemeV47(
                modal,
                false
            );

    if (!apply) {
        apply =
            document.createElement(
                'button'
            );

        apply.type =
            'button';

        apply.className =
            'icon-btn custom-tab-primary-btn theme-builder-create-apply-v45';

        save.insertAdjacentElement(
            'afterend',
            apply
        );
    }

    apply.textContent =
        'Create & Apply';

    apply.onclick =
        () =>
            createIndependentThemeV47(
                modal,
                true
            );
}


// Dashboard Theme Studio creation uses one shared object as well.
// Do not also manufacture a second host-log custom theme/copy.
const saveDashboardThemeStudioBeforeNoDuplicateV47 =
    saveDashboardThemeStudioV43;

saveDashboardThemeStudioV43 =
    async function(
        modal,
        applyAfterSave
    ) {
        if (
            !modal ||
            !validateThemeBuilderBeforeSaveV25(
                modal
            )
        ) {
            return;
        }

        ensureChosenThemeAccessoriesEnabledV46?.(
            modal
        );

        const draft =
            getThemeBuilderDraft(
                modal
            );

        const requestedId =
            getDashboardThemeStudioIdV43();

        const action =
            getDashboardThemeStudioActionV43();

        const library =
            readSharedThemeLibraryForStudioV43();

        const existing =
            library.find(
                item =>
                    item.id ===
                    requestedId
            );

        let id =
            action ===
                'edit' &&
            existing?.id
                ? existing.id
                : makeDashboardStudioThemeIdV43();

        const name =
            String(
                draft.name ||
                existing?.name ||
                'Custom Theme'
            ).trim() ||
            'Custom Theme';

        const entry = {
            id,
            name,
            sourceThemeId:
                existing
                    ?.sourceThemeId ||
                '',
            theme:
                cloneThemeDataV30({
                    ...draft,
                    name
                }),
            updatedAt:
                new Date()
                    .toISOString()
        };

        saveSharedThemeFromStudioV43(
            entry
        );

        window.parent
            ?.postMessage(
                {
                    type:
                        'dashboard-theme-studio-saved-v43',
                    themeId:
                        id,
                    apply:
                        !!applyAfterSave
                },
                window.location.origin
            );
    };


// ------------------------------------------------------------
// Final create-mode wiring.
// ------------------------------------------------------------

const openNewThemeBuilderCleanBeforeIndependentV47 =
    openNewThemeBuilderCleanV34;

openNewThemeBuilderCleanV34 =
    function() {
        openNewThemeBuilderCleanBeforeIndependentV47();

        const modal =
            document.getElementById(
                'theme-builder-modal'
            );

        requestAnimationFrame(
            () =>
                installIndependentCreateButtonsV47(
                    modal
                )
        );
    };

const populateThemeBuilderBeforeIndependentV47 =
    populateThemeBuilder;

populateThemeBuilder =
    function(
        modal,
        theme
    ) {
        populateThemeBuilderBeforeIndependentV47(
            modal,
            theme
        );

        installIndependentCreateButtonsV47(
            modal
        );
    };



// ============================================================
// V48 — DASHBOARD PREVIEW FULL BACKGROUND IMAGE
// ============================================================

function cssThemeBackgroundUrlV48(
    value
) {
    const source =
        String(
            value ||
            ''
        ).trim();

    if (!source) {
        return 'none';
    }

    return `url("${source
        .replace(/\\/g, '\\\\')
        .replace(/"/g, '\\"')}")`;
}

const renderDashboardPreviewBeforeBackgroundV48 =
    renderDashboardPreviewV45;

renderDashboardPreviewV45 =
    function(
        modal
    ) {
        renderDashboardPreviewBeforeBackgroundV48(
            modal
        );

        const preview =
            modal?.querySelector(
                '.theme-builder-dashboard-preview-v45'
            );

        if (!preview) {
            return;
        }

        const draft =
            getThemeBuilderDraft(
                modal
            );

        preview.style.setProperty(
            '--tb-dashboard-background-image-v48',
            cssThemeBackgroundUrlV48(
                draft.backgroundImage
            )
        );
    };



// ============================================================
// V49 — LOG-PAGE THEME EDITING: SAVE VS SAVE & APPLY
// Editing a theme now has two explicit text-only actions.
// ============================================================

function isLogThemeBuilderEditV49(
    modal
) {
    if (
        !modal ||
        isDashboardThemeStudioV43?.()
    ) {
        return false;
    }

    return !!(
        modal.dataset
            .themeBuilderEditingThemeV25 ||
        modal.dataset
            .themeBuilderEditingCopyV30 ||
        modal.dataset
            .themeBuilderMode ===
            'edit-custom-theme-v49'
    );
}

function closeThemeBuilderAfterSaveOnlyV49(
    modal
) {
    modal?.classList.add(
        'hidden'
    );

    dailySettingsModal
        ?.classList.add(
            'hidden'
        );
}

async function saveBuiltInThemeOnlyV49(
    modal
) {
    if (
        !validateThemeBuilderBeforeSaveV25(
            modal
        )
    ) {
        return;
    }

    ensureChosenThemeAccessoriesEnabledV46?.(
        modal
    );

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

    const previousTheme =
        modal
            ._themeEditPreviousThemeV25 ||
        db.settings.theme ||
        'default';

    const draft =
        getThemeBuilderDraft(
            modal
        );

    ensureThemeOverridesV25()[
        themeId
    ] = {
        ...draft
    };

    // Save the edit without changing which theme is active.
    db.settings.theme =
        previousTheme;

    await saveDb();

    modal._themeEditSavedV25 =
        true;

    themeOverrideApplySuppressedV25 =
        false;

    // Restore the theme that was active before entering the editor.
    // If that same theme was being edited, this naturally refreshes it
    // with the newly saved override without switching themes.
    await applyTheme(
        previousTheme,
        {
            persist:
                false
        }
    );

    db.settings.theme =
        previousTheme;

    if (dailyThemeSelect) {
        dailyThemeSelect.value =
            previousTheme;
    }

    themePickerSelected =
        previousTheme;

    renderThemePicker();

    closeThemeBuilderAfterSaveOnlyV49(
        modal
    );

    showFeatureToast(
        `Saved “${draft.name || 'theme'}”.`
    );
}

function writeThemeCopyDraftV49(
    modal,
    copy
) {
    const draft =
        getThemeBuilderDraft(
            modal
        );

    copy.name =
        draft.name ||
        copy.name ||
        'Theme Copy';

    copy.theme =
        cloneThemeDataV30(
            draft
        );

    if (
        modal.dataset
            .themeBuilderBuiltInSourceV30
    ) {
        if (
            !modal
                ._builtInArtDirtyV30
        ) {
            copy.theme
                .backgroundSvgs =
                [];

            copy.theme
                .replaceBuiltInDecorationsV30 =
                false;
        } else {
            copy.theme
                .replaceBuiltInDecorationsV30 =
                true;

            copy.theme
                .backgroundSvgs =
                (
                    copy.theme
                        .backgroundSvgs ||
                    []
                ).map(
                    svg => {
                        const clean = {
                            ...svg
                        };

                        delete clean
                            .inheritedBuiltInV30;

                        return clean;
                    }
                );
        }

        if (
            !modal
                ._builtInAudioDirtyV30 &&
            copy.theme
                .introAudio ===
                modal
                    ._builtInInheritedAudioV30
        ) {
            copy.theme
                .introAudio =
                '';

            copy.theme
                .introAudioName =
                '';
        }
    }

    return draft;
}

async function saveThemeCopyOnlyV49(
    modal,
    copyId
) {
    if (
        !validateThemeBuilderBeforeSaveV25(
            modal
        )
    ) {
        return;
    }

    ensureChosenThemeAccessoriesEnabledV46?.(
        modal
    );

    const copy =
        getThemeCopyV30(
            copyId
        );

    if (!copy) {
        return;
    }

    const previousTheme =
        modal
            ._themeEditPreviousThemeV25 ||
        db.settings.theme ||
        'default';

    writeThemeCopyDraftV49(
        modal,
        copy
    );

    publishSharedThemeV40?.({
        id:
            copy.id,
        name:
            copy.name,
        theme:
            copy.theme,
        sourceThemeId:
            copy.sourceThemeId ||
            ''
    });

    db.settings.theme =
        previousTheme;

    await saveDb();

    syncThemeCopyOptionsV30();

    await applyTheme(
        previousTheme,
        {
            persist:
                false
        }
    );

    db.settings.theme =
        previousTheme;

    if (dailyThemeSelect) {
        dailyThemeSelect.value =
            previousTheme;
    }

    themePickerSelected =
        previousTheme;

    renderThemePicker();

    closeThemeBuilderAfterSaveOnlyV49(
        modal
    );

    showFeatureToast(
        `Saved “${copy.name}”.`
    );
}

async function saveLegacyCustomThemeOnlyV49(
    modal
) {
    if (
        !validateThemeBuilderBeforeSaveV25(
            modal
        )
    ) {
        return;
    }

    ensureChosenThemeAccessoriesEnabledV46?.(
        modal
    );

    const previousTheme =
        modal
            ._themeEditPreviousThemeV49 ||
        db.settings.theme ||
        'default';

    const draft =
        getThemeBuilderDraft(
            modal
        );

    const start =
        Math.max(
            0,
            Math.min(
                20,
                Number(
                    draft.audioStart
                ) ||
                0
            )
        );

    const end =
        Math.max(
            start +
                .5,
            Math.min(
                20,
                Number(
                    draft.audioEnd
                ) ||
                20
            )
        );

    draft.audioStart =
        start;

    draft.audioEnd =
        end;

    db.settings.customTheme = {
        ...FEATURE_SUITE_DEFAULT_THEME,
        ...CUSTOM_THEME_MEDIA_DEFAULTS_V3,
        ...CUSTOM_THEME_VISUAL_DEFAULTS_V4,
        ...CUSTOM_THEME_ACCESSORY_DEFAULTS_V32,
        ...draft
    };

    db.settings.customThemeDeleted =
        false;

    db.settings.deletedThemes =
        (
            db.settings.deletedThemes ||
            []
        ).filter(
            value =>
                value !==
                'theme-custom-builder'
        );

    ensureCustomThemePickerOption();

    db.settings.theme =
        previousTheme;

    await saveDb();

    publishCurrentLogThemesV40?.();

    if (dailyThemeSelect) {
        dailyThemeSelect.value =
            previousTheme;
    }

    themePickerSelected =
        previousTheme;

    renderThemePicker();

    closeThemeBuilderAfterSaveOnlyV49(
        modal
    );

    showFeatureToast(
        `Saved “${draft.name || 'Custom Theme'}”.`
    );
}

function installLogEditSaveButtonsV49(
    modal
) {
    if (
        !isLogThemeBuilderEditV49(
            modal
        )
    ) {
        return;
    }

    const actions =
        modal.querySelector(
            '.theme-builder-actions'
        );

    const primary =
        modal.querySelector(
            '.theme-builder-save'
        );

    if (
        !actions ||
        !primary
    ) {
        return;
    }

    // Create-mode controls must never leak into edit mode.
    actions
        .querySelectorAll(
            '.theme-builder-create-apply-v45'
        )
        .forEach(
            button =>
                button.remove()
        );

    const editingThemeId =
        modal.dataset
            .themeBuilderEditingThemeV25 ||
        '';

    const editingCopyId =
        modal.dataset
            .themeBuilderEditingCopyV30 ||
        '';

    const editingLegacyCustom =
        modal.dataset
            .themeBuilderMode ===
        'edit-custom-theme-v49';

    // Preserve the authoritative existing edit handler as Save & Apply.
    if (
        !modal
            ._saveAndApplyHandlerV49
    ) {
        modal._saveAndApplyHandlerV49 =
            primary.onclick;
    }

    primary.textContent =
        'Save';

    primary.onclick =
        () => {
            if (editingCopyId) {
                return saveThemeCopyOnlyV49(
                    modal,
                    editingCopyId
                );
            }

            if (editingThemeId) {
                return saveBuiltInThemeOnlyV49(
                    modal
                );
            }

            if (editingLegacyCustom) {
                return saveLegacyCustomThemeOnlyV49(
                    modal
                );
            }
        };

    let apply =
        actions.querySelector(
            '.theme-builder-save-apply-v49'
        );

    if (!apply) {
        apply =
            document.createElement(
                'button'
            );

        apply.type =
            'button';

        apply.className =
            'icon-btn custom-tab-primary-btn theme-builder-save-apply-v49';

        primary.insertAdjacentElement(
            'afterend',
            apply
        );
    }

    apply.textContent =
        'Save & Apply';

    apply.onclick =
        async () => {
            ensureChosenThemeAccessoriesEnabledV46?.(
                modal
            );

            window._forceThemeAccessoriesOnceV32 =
                true;

            const handler =
                modal
                    ._saveAndApplyHandlerV49;

            if (handler) {
                return handler.call(
                    primary
                );
            }

            // Safety fallback if an older wrapper replaced the handler.
            if (editingCopyId) {
                return saveThemeCopyV30(
                    modal,
                    editingCopyId
                );
            }

            if (editingThemeId) {
                return saveThemeOverrideV25(
                    modal
                );
            }
        };
}


// ------------------------------------------------------------
// Make every log-page edit opener finish with the V49 action pair.
// ------------------------------------------------------------

const openAnyThemeInBuilderBeforeSavePairV49 =
    openAnyThemeInBuilderV25;

openAnyThemeInBuilderV25 =
    async function(
        themeId,
        themeName
    ) {
        await openAnyThemeInBuilderBeforeSavePairV49(
            themeId,
            themeName
        );

        const modal =
            document.getElementById(
                'theme-builder-modal'
            );

        if (
            modal &&
            !isDashboardThemeStudioV43?.()
        ) {
            // Capture whatever the full wrapper chain assigned as the
            // built-in Save & Apply behavior.
            modal._saveAndApplyHandlerV49 =
                modal.querySelector(
                    '.theme-builder-save'
                )?.onclick ||
                null;

            installLogEditSaveButtonsV49(
                modal
            );
        }
    };

const openThemeCopyInBuilderBeforeSavePairV49 =
    openThemeCopyInBuilderV30;

openThemeCopyInBuilderV30 =
    async function(
        copyId
    ) {
        const previousTheme =
            db.settings.theme ||
            'default';

        await openThemeCopyInBuilderBeforeSavePairV49(
            copyId
        );

        const modal =
            document.getElementById(
                'theme-builder-modal'
            );

        if (
            modal &&
            !isDashboardThemeStudioV43?.()
        ) {
            modal._themeEditPreviousThemeV25 =
                previousTheme;

            modal.dataset
                .themeBuilderMode =
                'edit-copy-v49';

            modal._saveAndApplyHandlerV49 =
                modal.querySelector(
                    '.theme-builder-save'
                )?.onclick ||
                null;

            installLogEditSaveButtonsV49(
                modal
            );
        }
    };

const openExistingCustomThemeBeforeSavePairV49 =
    openExistingCustomThemeFromPickerV7;

openExistingCustomThemeFromPickerV7 =
    function() {
        const previousTheme =
            db.settings.theme ||
            'default';

        openExistingCustomThemeBeforeSavePairV49();

        const modal =
            document.getElementById(
                'theme-builder-modal'
            );

        if (
            !modal ||
            isDashboardThemeStudioV43?.()
        ) {
            return;
        }

        modal._themeEditPreviousThemeV49 =
            previousTheme;

        modal.dataset
            .themeBuilderMode =
            'edit-custom-theme-v49';

        modal._saveAndApplyHandlerV49 =
            modal.querySelector(
                '.theme-builder-save'
            )?.onclick ||
            null;

        installLogEditSaveButtonsV49(
            modal
        );
    };


// Final populate hook catches edit-mode re-population from later wrappers.
const populateThemeBuilderBeforeSavePairV49 =
    populateThemeBuilder;

populateThemeBuilder =
    function(
        modal,
        theme
    ) {
        populateThemeBuilderBeforeSavePairV49(
            modal,
            theme
        );

        if (
            isLogThemeBuilderEditV49(
                modal
            )
        ) {
            requestAnimationFrame(
                () =>
                    installLogEditSaveButtonsV49(
                        modal
                    )
            );
        }
    };



// ============================================================
// V51 — STABLE DASHBOARD COLOR PICKERS
// Do not destroy/recreate dashboard color inputs while the native color
// picker is open. Replacing the <input type="color"> on every input event
// was what made the picker close as soon as the mouse was pressed/dragged.
// ============================================================

function stableDashboardThemeControlsV51(
    modal,
    theme = {}
) {
    const controls =
        modal?.querySelector(
            '.theme-builder-controls'
        );

    if (!controls) {
        return;
    }

    let section =
        controls.querySelector(
            '.theme-builder-dashboard-colors-v42'
        );

    const fields = [
        [
            'Dashboard Background',
            'dashboardBackgroundV40',
            theme.dashboardBackgroundV40 ||
                theme.background ||
                '#f5f5f5'
        ],
        [
            'Log Cards',
            'dashboardCardV40',
            theme.dashboardCardV40 ||
                theme.surface ||
                '#ffffff'
        ],
        [
            'Dashboard Text',
            'dashboardTextV40',
            theme.dashboardTextV40 ||
                theme.text ||
                '#000000'
        ],
        [
            'Buttons / Accent',
            'dashboardAccentV40',
            theme.dashboardAccentV40 ||
                theme.accent ||
                '#777777'
        ]
    ];

    if (!section) {
        // Remove only obsolete pre-V42 dashboard color sections once.
        controls
            .querySelectorAll(
                '.theme-builder-dashboard-colors-v40:not(.theme-builder-dashboard-colors-v42)'
            )
            .forEach(
                old =>
                    old.remove()
            );

        section =
            document.createElement(
                'section'
            );

        section.className =
            'theme-builder-control-section theme-builder-dashboard-colors-v40 theme-builder-dashboard-colors-v42';

        section.dataset
            .themeBuilderPanelGroup =
            'colors';

        section.innerHTML = `
            <div class="theme-builder-control-heading">
                <strong>Dashboard Colors</strong>
                <small>Dashboard-specific colors.</small>
            </div>

            <div class="theme-builder-color-grid theme-builder-dashboard-color-grid-v42">
                ${fields.map(
                    (
                        [
                            label,
                            key,
                            value
                        ]
                    ) =>
                        themeBuilderField(
                            label,
                            key,
                            value
                        )
                ).join('')}
            </div>
        `;

        const tabs =
            controls.querySelector(
                '.theme-builder-section-tabs-v11'
            );

        const firstNonColor =
            Array.from(
                controls.children
            ).find(
                child =>
                    child !==
                        tabs &&
                    child.dataset
                        ?.themeBuilderPanelGroup &&
                    child.dataset
                        .themeBuilderPanelGroup !==
                        'colors'
            );

        if (firstNonColor) {
            controls.insertBefore(
                section,
                firstNonColor
            );
        } else {
            controls.appendChild(
                section
            );
        }

        section
            .querySelectorAll(
                'input[type="color"][data-theme-key]'
            )
            .forEach(
                picker => {
                    picker.addEventListener(
                        'pointerdown',
                        () => {
                            modal._dashboardColorPickerOpenV51 =
                                true;
                        },
                        true
                    );

                    picker.addEventListener(
                        'input',
                        () => {
                            const key =
                                picker.dataset
                                    .themeKey;

                            const hex =
                                section.querySelector(
                                    `[data-theme-hex="${CSS.escape(
                                        key
                                    )}"]`
                                );

                            if (hex) {
                                hex.value =
                                    picker.value;
                            }

                            // Update the live preview without replacing this
                            // color input node.
                            updateThemeBuilderPreview(
                                modal
                            );
                        }
                    );

                    const finish =
                        () => {
                            setTimeout(
                                () => {
                                    modal._dashboardColorPickerOpenV51 =
                                        false;
                                },
                                0
                            );
                        };

                    picker.addEventListener(
                        'change',
                        finish
                    );

                    picker.addEventListener(
                        'blur',
                        finish
                    );
                }
            );

        section
            .querySelectorAll(
                '[data-theme-hex]'
            )
            .forEach(
                input => {
                    input.addEventListener(
                        'input',
                        () => {
                            const value =
                                input.value
                                    .trim();

                            if (
                                !/^#[0-9a-f]{6}$/i.test(
                                    value
                                )
                            ) {
                                return;
                            }

                            const picker =
                                section.querySelector(
                                    `input[type="color"][data-theme-key="${CSS.escape(
                                        input.dataset
                                            .themeHex
                                    )}"]`
                                );

                            if (picker) {
                                picker.value =
                                    value;
                            }

                            updateThemeBuilderPreview(
                                modal
                            );
                        }
                    );
                }
            );

        installThemeBuilderSectionTabsV11(
            modal
        );
    }

    // Reuse the SAME controls. Only sync their values while a native color
    // picker is not actively being dragged/open.
    if (
        !modal._dashboardColorPickerOpenV51
    ) {
        fields.forEach(
            (
                [
                    ,
                    key,
                    value
                ]
            ) => {
                const color =
                    /^#[0-9a-f]{6}$/i.test(
                        String(
                            value
                        )
                    )
                        ? String(
                            value
                        )
                        : '#777777';

                const picker =
                    section.querySelector(
                        `input[type="color"][data-theme-key="${CSS.escape(
                            key
                        )}"]`
                    );

                const hex =
                    section.querySelector(
                        `[data-theme-hex="${CSS.escape(
                            key
                        )}"]`
                    );

                if (
                    picker &&
                    document.activeElement !==
                        picker
                ) {
                    picker.value =
                        color;
                }

                if (
                    hex &&
                    document.activeElement !==
                        hex
                ) {
                    hex.value =
                        color;
                }
            }
        );
    }

    return section;
}

// Older V40/V42 update paths call both names. Make both point to the stable,
// non-destructive implementation.
ensureDashboardThemeControlsV42 =
    stableDashboardThemeControlsV51;

ensureDashboardThemeControlsV40 =
    stableDashboardThemeControlsV51;



// ============================================================
// V52 — REORDERABLE LOG-SPECIFIC SIDE NAV + OPTIONAL BUILT-IN TABS
// Everything below the divider beneath Trash can be dragged above/below
// another log-specific tab. Toolbox and Weekly Review can be removed.
// ============================================================

const LOG_NAV_BUILTINS_V52 = {
    daily: {
        buttonId: 'open-daily-logs-nav-btn',
        label: 'Daily Logs'
    },
    tools: {
        buttonId: 'open-tools-btn',
        label: 'Toolbox'
    },
    knowledge: {
        buttonId: 'open-phrases-btn',
        label: 'Knowledge Base'
    },
    quizzes: {
        buttonId: 'open-quizzes-btn',
        label: 'Quizzes'
    },
    'weekly-review': {
        buttonId: 'open-weekly-review-btn',
        label: 'Weekly Review'
    }
};

const LOG_NAV_DEFAULT_ORDER_V52 = [
    'daily',
    'tools',
    'knowledge',
    'quizzes',
    'weekly-review'
];

function ensureLogNavSettingsV52() {
    if (!db.settings) {
        db.settings = {};
    }

    if (
        !Array.isArray(
            db.settings.logNavOrderV52
        )
    ) {
        db.settings.logNavOrderV52 =
            [];
    }

    if (
        !Array.isArray(
            db.settings.hiddenBuiltInTabsV52
        )
    ) {
        db.settings.hiddenBuiltInTabsV52 =
            [];
    }

    return db.settings;
}

function isBuiltInTabHiddenV52(
    key
) {
    ensureLogNavSettingsV52();

    return db.settings
        .hiddenBuiltInTabsV52
        .includes(
            key
        );
}

function navKeyForElementV52(
    element
) {
    if (!element) {
        return '';
    }

    const customId =
        element.dataset
            ?.customTabId;

    if (customId) {
        return `custom:${customId}`;
    }

    const entry =
        Object.entries(
            LOG_NAV_BUILTINS_V52
        ).find(
            (
                [
                    ,
                    config
                ]
            ) =>
                config.buttonId ===
                element.id
        );

    return entry
        ? entry[0]
        : '';
}

function elementForLogNavKeyV52(
    key
) {
    if (
        String(
            key
        ).startsWith(
            'custom:'
        )
    ) {
        const id =
            String(
                key
            ).slice(
                'custom:'.length
            );

        return document.querySelector(
            `.custom-tab-nav-btn[data-custom-tab-id="${CSS.escape(
                id
            )}"]`
        );
    }

    const config =
        LOG_NAV_BUILTINS_V52[
            key
        ];

    return config
        ? document.getElementById(
            config.buttonId
        )
        : null;
}

function currentAvailableLogNavKeysV52() {
    const customKeys =
        getCustomTabs()
            .map(
                tab =>
                    `custom:${tab.id}`
            );

    return [
        ...LOG_NAV_DEFAULT_ORDER_V52,
        ...customKeys
    ];
}

function normalizedLogNavOrderV52() {
    const settings =
        ensureLogNavSettingsV52();

    const available =
        currentAvailableLogNavKeysV52();

    const availableSet =
        new Set(
            available
        );

    const saved =
        settings
            .logNavOrderV52
            .filter(
                key =>
                    availableSet.has(
                        key
                    )
            );

    available.forEach(
        key => {
            if (
                !saved.includes(
                    key
                )
            ) {
                saved.push(
                    key
                );
            }
        }
    );

    settings.logNavOrderV52 =
        saved;

    return saved;
}

function ensureUnifiedLogNavHostV52() {
    const scrollRegion =
        document.getElementById(
            'side-nav-log-scroll'
        );

    if (!scrollRegion) {
        return null;
    }

    let host =
        document.getElementById(
            'log-tab-order-host-v52'
        );

    if (!host) {
        host =
            document.createElement(
                'div'
            );

        host.id =
            'log-tab-order-host-v52';

        host.className =
            'log-tab-order-host-v52';

        scrollRegion.prepend(
            host
        );
    }

    return host;
}

function updateUnifiedLogNavScrollV52() {
    const scrollRegion =
        document.getElementById(
            'side-nav-log-scroll'
        );

    const host =
        document.getElementById(
            'log-tab-order-host-v52'
        );

    if (
        !scrollRegion ||
        !host
    ) {
        return;
    }

    const visibleButtons =
        Array.from(
            host.querySelectorAll(
                ':scope > .icon-btn:not(.log-nav-hidden-v52)'
            )
        );

    // Preserve the old behavior: normal sets do not scroll; a larger list does.
    const shouldScroll =
        visibleButtons.length >
        8;

    scrollRegion.classList.toggle(
        'is-scrollable',
        shouldScroll
    );

    if (!shouldScroll) {
        scrollRegion.style.removeProperty(
            '--log-nav-scroll-height'
        );

        return;
    }

    const eighth =
        visibleButtons[
            7
        ];

    if (!eighth) {
        return;
    }

    const hostStyle =
        getComputedStyle(
            host
        );

    const gap =
        parseFloat(
            hostStyle.rowGap ||
            hostStyle.gap ||
            '25'
        ) ||
        25;

    const height =
        Math.max(
            100,
            eighth.offsetTop +
            eighth.offsetHeight -
            gap / 2
        );

    scrollRegion.style.setProperty(
        '--log-nav-scroll-height',
        `${Math.ceil(
            height
        )}px`
    );
}

function saveLogNavOrderFromDomV52() {
    const host =
        document.getElementById(
            'log-tab-order-host-v52'
        );

    if (!host) {
        return;
    }

    const keys =
        Array.from(
            host.children
        )
            .map(
                navKeyForElementV52
            )
            .filter(
                Boolean
            );

    ensureLogNavSettingsV52()
        .logNavOrderV52 =
        keys;

    saveDb();
}

function clearLogNavDragUiV52() {
    document
        .querySelectorAll(
            '.log-nav-dragging-v52, .log-nav-drop-before-v52, .log-nav-drop-after-v52'
        )
        .forEach(
            element => {
                element.classList.remove(
                    'log-nav-dragging-v52',
                    'log-nav-drop-before-v52',
                    'log-nav-drop-after-v52'
                );
            }
        );
}

function bindUnifiedLogNavDragV52(
    button,
    key
) {
    if (
        !button ||
        button.dataset
            .unifiedNavDragV52 ===
            'true'
    ) {
        return;
    }

    button.dataset
        .unifiedNavDragV52 =
        'true';

    button.dataset
        .logNavKeyV52 =
        key;

    button.draggable =
        true;

    button.addEventListener(
        'dragstart',
        event => {
            event.dataTransfer
                .setData(
                    'text/log-nav-key-v52',
                    key
                );

            event.dataTransfer
                .setData(
                    'text/plain',
                    key
                );

            event.dataTransfer.effectAllowed =
                'move';

            button.classList.add(
                'log-nav-dragging-v52'
            );
        }
    );

    button.addEventListener(
        'dragend',
        clearLogNavDragUiV52
    );

    button.addEventListener(
        'dragover',
        event => {
            const draggedKey =
                event.dataTransfer
                    .getData(
                        'text/log-nav-key-v52'
                    ) ||
                event.dataTransfer
                    .getData(
                        'text/plain'
                    );

            if (
                !draggedKey ||
                draggedKey ===
                    key
            ) {
                return;
            }

            event.preventDefault();

            const rect =
                button.getBoundingClientRect();

            const after =
                event.clientY >
                rect.top +
                    rect.height /
                        2;

            button.classList.toggle(
                'log-nav-drop-before-v52',
                !after
            );

            button.classList.toggle(
                'log-nav-drop-after-v52',
                after
            );
        }
    );

    button.addEventListener(
        'dragleave',
        () => {
            button.classList.remove(
                'log-nav-drop-before-v52',
                'log-nav-drop-after-v52'
            );
        }
    );

    button.addEventListener(
        'drop',
        event => {
            const draggedKey =
                event.dataTransfer
                    .getData(
                        'text/log-nav-key-v52'
                    ) ||
                event.dataTransfer
                    .getData(
                        'text/plain'
                    );

            if (
                !draggedKey ||
                draggedKey ===
                    key
            ) {
                return;
            }

            event.preventDefault();
            event.stopPropagation();

            const dragged =
                elementForLogNavKeyV52(
                    draggedKey
                );

            const host =
                document.getElementById(
                    'log-tab-order-host-v52'
                );

            if (
                !dragged ||
                !host ||
                button.parentElement !==
                    host
            ) {
                clearLogNavDragUiV52();

                return;
            }

            const rect =
                button.getBoundingClientRect();

            const after =
                event.clientY >
                rect.top +
                    rect.height /
                        2;

            if (after) {
                button.after(
                    dragged
                );
            } else {
                button.before(
                    dragged
                );
            }

            clearLogNavDragUiV52();

            saveLogNavOrderFromDomV52();

            updateUnifiedLogNavScrollV52();
        }
    );
}

async function deleteBuiltInLogTabV52(
    key
) {
    if (
        ![
            'tools',
            'weekly-review'
        ].includes(
            key
        )
    ) {
        return;
    }

    const config =
        LOG_NAV_BUILTINS_V52[
            key
        ];

    const confirmed =
        await showAppConfirm({
            title:
                `Delete ${config.label} tab?`,
            message:
                '',
            confirmLabel:
                'Delete Tab'
        });

    if (!confirmed) {
        return;
    }

    const settings =
        ensureLogNavSettingsV52();

    if (
        !settings
            .hiddenBuiltInTabsV52
            .includes(
                key
            )
    ) {
        settings
            .hiddenBuiltInTabsV52
            .push(
                key
            );
    }

    await saveDb();

    const button =
        document.getElementById(
            config.buttonId
        );

    button?.classList.add(
        'log-nav-hidden-v52'
    );

    // If the removed tab was open, return to Daily Logs.
    if (
        (
            key ===
                'tools' &&
            toolboxView
                ?.classList
                .contains(
                    'active'
                )
        ) ||
        (
            key ===
                'weekly-review' &&
            document
                .getElementById(
                    'weekly-review-view'
                )
                ?.classList
                .contains(
                    'active'
                )
        )
    ) {
        initGrid();

        switchView(
            gridView
        );
    }

    updateUnifiedLogNavScrollV52();

    showFeatureToast(
        `${config.label} tab deleted.`,
        'Undo',
        () =>
            restoreBuiltInLogTabV52(
                key
            )
    );
}

function restoreBuiltInLogTabV52(
    key
) {
    const settings =
        ensureLogNavSettingsV52();

    settings.hiddenBuiltInTabsV52 =
        settings
            .hiddenBuiltInTabsV52
            .filter(
                item =>
                    item !==
                    key
            );

    saveDb();

    if (
        key ===
        'weekly-review'
    ) {
        ensureWeeklyReviewNavButton?.(
            document.getElementById(
                'side-nav-log-scroll'
            )
        );
    }

    applyUnifiedLogNavOrderV52();
}

function bindBuiltInTabDeleteV52(
    button,
    key
) {
    if (
        !button ||
        ![
            'tools',
            'weekly-review'
        ].includes(
            key
        ) ||
        button.dataset
            .builtInDeleteV52 ===
            'true'
    ) {
        return;
    }

    button.dataset
        .builtInDeleteV52 =
        'true';

    button.addEventListener(
        'contextmenu',
        event => {
            event.preventDefault();
            event.stopPropagation();

            const config =
                LOG_NAV_BUILTINS_V52[
                    key
                ];

            showCustomItemContextMenu(
                event.clientX,
                event.clientY,
                [
                    {
                        label:
                            `Delete ${config.label} tab`,
                        icon:
                            'ph-trash',
                        danger:
                            true,
                        action:
                            () =>
                                deleteBuiltInLogTabV52(
                                    key
                                )
                    }
                ]
            );
        }
    );
}

function applyUnifiedLogNavOrderV52() {
    const host =
        ensureUnifiedLogNavHostV52();

    if (!host) {
        return;
    }

    const customFactoryHost =
        document.getElementById(
            'custom-tab-nav-host'
        );

    const pinnedFactoryHost =
        document.getElementById(
            'custom-tab-pinned-host'
        );

    // Custom-tab renderers still create buttons inside their historical hosts.
    // Pull each button into the new shared ordered list after every render.
    [
        customFactoryHost,
        pinnedFactoryHost
    ].forEach(
        factory => {
            Array.from(
                factory?.querySelectorAll(
                    ':scope > .custom-tab-nav-btn'
                ) ||
                []
            ).forEach(
                button =>
                    host.appendChild(
                        button
                    )
            );
        }
    );

    Object.entries(
        LOG_NAV_BUILTINS_V52
    ).forEach(
        (
            [
                key,
                config
            ]
        ) => {
            const button =
                document.getElementById(
                    config.buttonId
                );

            if (
                button &&
                button.parentElement !==
                    host
            ) {
                host.appendChild(
                    button
                );
            }

            if (button) {
                button.classList.toggle(
                    'log-nav-hidden-v52',
                    isBuiltInTabHiddenV52(
                        key
                    )
                );

                bindUnifiedLogNavDragV52(
                    button,
                    key
                );

                bindBuiltInTabDeleteV52(
                    button,
                    key
                );
            }
        }
    );

    getCustomTabs()
        .forEach(
            tab => {
                const key =
                    `custom:${tab.id}`;

                const button =
                    document.querySelector(
                        `.custom-tab-nav-btn[data-custom-tab-id="${CSS.escape(
                            String(
                                tab.id
                            )
                        )}"]`
                    );

                if (!button) {
                    return;
                }

                if (
                    button.parentElement !==
                    host
                ) {
                    host.appendChild(
                        button
                    );
                }

                bindUnifiedLogNavDragV52(
                    button,
                    key
                );
            }
        );

    const order =
        normalizedLogNavOrderV52();

    order.forEach(
        key => {
            const element =
                elementForLogNavKeyV52(
                    key
                );

            if (
                element &&
                element.parentElement ===
                    host
            ) {
                host.appendChild(
                    element
                );
            }
        }
    );

    // The old grouping hosts are now only factories used by existing renderers.
    customFactoryHost
        ?.classList.add(
            'log-nav-factory-host-v52'
        );

    pinnedFactoryHost
        ?.classList.add(
            'log-nav-factory-host-v52'
        );

    updateUnifiedLogNavScrollV52();
}

// Keep the user's order after all existing nav render wrappers complete.
const renderCustomTabNavigationBeforeUnifiedV52 =
    renderCustomTabNavigation;

renderCustomTabNavigation =
    function() {
        renderCustomTabNavigationBeforeUnifiedV52();

        requestAnimationFrame(
            applyUnifiedLogNavOrderV52
        );
    };

const ensureCustomSideNavControlsBeforeUnifiedV52 =
    ensureCustomSideNavControls;

ensureCustomSideNavControls =
    function() {
        ensureCustomSideNavControlsBeforeUnifiedV52();

        requestAnimationFrame(
            applyUnifiedLogNavOrderV52
        );
    };

const ensureWeeklyReviewNavButtonBeforeUnifiedV52 =
    ensureWeeklyReviewNavButton;

ensureWeeklyReviewNavButton =
    function(
        ...args
    ) {
        const button =
            ensureWeeklyReviewNavButtonBeforeUnifiedV52(
                ...args
            );

        if (button) {
            button.classList.toggle(
                'log-nav-hidden-v52',
                isBuiltInTabHiddenV52(
                    'weekly-review'
                )
            );
        }

        requestAnimationFrame(
            applyUnifiedLogNavOrderV52
        );

        return button;
    };

// The old custom-only scroll counter no longer sees buttons after we flatten
// the nav, so make the shared ordered host authoritative.
const updateLogSpecificSideNavScrollStateBeforeUnifiedV52 =
    updateLogSpecificSideNavScrollState;

updateLogSpecificSideNavScrollState =
    function() {
        if (
            document.getElementById(
                'log-tab-order-host-v52'
            )
        ) {
            updateUnifiedLogNavScrollV52();

            return;
        }

        updateLogSpecificSideNavScrollStateBeforeUnifiedV52();
    };

// Do not reopen a built-in page from session state after its nav tab was deleted.
const restoreLastTopLevelViewBeforeHiddenBuiltInsV52 =
    restoreLastTopLevelView;

restoreLastTopLevelView =
    function() {
        const saved =
            sessionStorage.getItem(
                LAST_APP_TAB_STORAGE_KEY
            );

        if (
            (
                saved ===
                    'tools' &&
                isBuiltInTabHiddenV52(
                    'tools'
                )
            ) ||
            (
                saved ===
                    'weekly-review' &&
                isBuiltInTabHiddenV52(
                    'weekly-review'
                )
            )
        ) {
            sessionStorage.setItem(
                LAST_APP_TAB_STORAGE_KEY,
                'daily'
            );

            initGrid();

            switchView(
                gridView
            );

            return;
        }

        restoreLastTopLevelViewBeforeHiddenBuiltInsV52();
    };

requestAnimationFrame(
    () => {
        applyUnifiedLogNavOrderV52();

        setTimeout(
            applyUnifiedLogNavOrderV52,
            80
        );
    }
);



// ============================================================
// V53 — PRE-BUILT CUSTOM TABS
// Weekly Review is no longer a default side-nav tab.
// Eight optional starter tabs now live inside Create Tab.
// ============================================================

const CUSTOM_TAB_TEMPLATES_V53 = [
    {
        id: 'weekly-review',
        name: 'Weekly Review',
        icon: 'ph-calendar-check',
        description: 'Your last 7 log days, stats, recent activity, and next-week focus.'
    },
    {
        id: 'goals',
        name: 'Goals',
        icon: 'ph-target',
        description: 'Track a target, action steps, and milestones in one place.'
    },
    {
        id: 'sentence-builder',
        name: 'Sentence Builder',
        icon: 'ph-text-aa',
        description: 'Build and save sentences from items already in your Knowledge Base.'
    },
    {
        id: 'study-hub',
        name: 'Study Hub',
        icon: 'ph-books',
        description: 'Bring together notes, Knowledge Base items, resources, and vocabulary.'
    },
    {
        id: 'practice-tracker',
        name: 'Practice Tracker',
        icon: 'ph-timer',
        description: 'Log practice sessions, measure progress, and rate your skills.'
    },
    {
        id: 'media-library',
        name: 'Media Library',
        icon: 'ph-images',
        description: 'Collect videos, images, PDFs, audio, and saved resources from Daily Logs.'
    },
    {
        id: 'project-planner',
        name: 'Project Planner',
        icon: 'ph-kanban',
        description: 'Organize projects with a gallery, milestones, and next actions.'
    },
    {
        id: 'reflection-journal',
        name: 'Reflection Journal',
        icon: 'ph-note-pencil',
        description: 'Collect Daily Log notes and keep reusable reflection prompts.'
    },
    {
        id: 'alphabet',
        name: 'Alphabet',
        icon: 'ph-translate',
        description: 'Build a character or alphabet reference with audio cards, category practice, and review.'
    },
    {
        id: 'whiteboard-v197',
        name: 'Whiteboard',
        icon: 'ph-selection-background',
        description: 'A full-screen multi-board canvas with sticky notes, movable images, text boxes, drawing, lasso, erasers, connections, and visual board previews.'
    },
    {
        id: 'notepad-v249',
        name: 'Notebook',
        icon: 'ph-notebook',
        description: 'A full-screen multi-page notebook with page categories, paper styles, movable images, drawing tools, and exact-page links from Daily Logs.'
    }
];

function customTemplateV53(
    id
) {
    return CUSTOM_TAB_TEMPLATES_V53.find(
        template =>
            template.id ===
            id
    ) ||
    null;
}

function makeChecklistTemplateV53(
    title,
    labels
) {
    const component =
        defaultCustomComponent(
            'checklist'
        );

    component.title =
        title;

    component.items =
        labels.map(
            text => ({
                id:
                    customId(
                        'check'
                    ),
                text,
                done:
                    false,
                completedAt:
                    null
            })
        );

    return component;
}

function makeCardsTemplateV53(
    title,
    items
) {
    const component =
        defaultCustomComponent(
            'cards'
        );

    component.title =
        title;

    component.items =
        items.map(
            item => ({
                id:
                    customId(
                        'card'
                    ),
                title:
                    item.title,
                body:
                    item.body
            })
        );

    return component;
}

function buildPrebuiltTabComponentsV53(
    templateId
) {
    switch (
        templateId
    ) {
        case 'weekly-review':
            return [
                {
                    id:
                        customId(
                            'component'
                        ),
                    type:
                        'weeklyReviewV53',
                    title:
                        'Weekly Review',
                    titleBackground:
                        'none',
                    focusByRange:
                        {}
                }
            ];

        case 'goals': {
            const progress =
                defaultCustomComponent(
                    'progressMeter'
                );

            progress.title =
                'Goal Progress';

            progress.target =
                5;

            progress.unit =
                'goals';

            const milestones =
                defaultCustomComponent(
                    'milestones'
                );

            milestones.title =
                'Milestones';

            return [
                progress,
                makeChecklistTemplateV53(
                    'Next Actions',
                    [
                        'Choose the goal I want to focus on',
                        'Write the next small action',
                        'Schedule time to work on it'
                    ]
                ),
                milestones
            ];
        }

        case 'sentence-builder':
            return [
                {
                    id:
                        customId(
                            'component'
                        ),
                    type:
                        'knowledgeSentenceBuilderV53',
                    title:
                        'Sentence Builder',
                    titleBackground:
                        'none',
                    tokens:
                        [],
                    savedSentences:
                        []
                }
            ];

        case 'study-hub': {
            const search =
                defaultCustomComponent(
                    'search'
                );

            search.placeholder =
                'Search this study hub...';

            const collection =
                defaultCustomComponent(
                    'dailyLogCollection'
                );

            collection.title =
                'From Your Daily Logs';

            collection.sources = [
                'knowledge',
                'notes',
                'resources'
            ];

            const vocabulary =
                defaultCustomComponent(
                    'vocabulary'
                );

            vocabulary.title =
                'Vocabulary & Key Terms';

            return [
                search,
                collection,
                vocabulary
            ];
        }

        case 'practice-tracker': {
            const practice =
                defaultCustomComponent(
                    'practiceLog'
                );

            practice.title =
                'Practice Sessions';

            const progress =
                defaultCustomComponent(
                    'progressMeter'
                );

            progress.title =
                'Practice Goal';

            progress.target =
                5;

            progress.unit =
                'sessions';

            const skills =
                defaultCustomComponent(
                    'skillRatings'
                );

            skills.title =
                'Skill Check-In';

            return [
                progress,
                practice,
                skills
            ];
        }

        case 'media-library': {
            const search =
                defaultCustomComponent(
                    'search'
                );

            search.placeholder =
                'Search your media...';

            const collection =
                defaultCustomComponent(
                    'dailyLogCollection'
                );

            collection.title =
                'Saved Media';

            collection.sources = [
                'resources',
                'videos',
                'images',
                'pdfs',
                'audio'
            ];

            return [
                search,
                collection
            ];
        }

        case 'project-planner': {
            const gallery =
                defaultCustomComponent(
                    'projectGallery'
                );

            gallery.title =
                'Projects';

            const milestones =
                defaultCustomComponent(
                    'milestones'
                );

            milestones.title =
                'Project Milestones';

            return [
                gallery,
                milestones,
                makeChecklistTemplateV53(
                    'Next Actions',
                    [
                        'Define the next deliverable',
                        'Choose the next action',
                        'Review progress'
                    ]
                )
            ];
        }

        case 'reflection-journal': {
            const collection =
                defaultCustomComponent(
                    'dailyLogCollection'
                );

            collection.title =
                'Recent Reflections';

            collection.sources = [
                'notes',
                'textFields',
                'images'
            ];

            return [
                makeCardsTemplateV53(
                    'Reflection Prompts',
                    [
                        {
                            title:
                                'What went well?',
                            body:
                                'Capture one thing you want to remember.'
                        },
                        {
                            title:
                                'What was difficult?',
                            body:
                                'Write down what challenged you and why.'
                        },
                        {
                            title:
                                'What comes next?',
                            body:
                                'Choose one thing to try or improve next time.'
                        }
                    ]
                ),
                collection
            ];
        }

        case 'alphabet':
            // V245: register this blueprint in the normal template source so it is
            // visible before the lazy widget/component runtime has loaded. Load
            // the advanced renderer immediately when this blueprint is chosen.
            try { window.__loggyLoadWidgetsRuntimeV241?.(); } catch {}
            return [
                {
                    id: customId('component'),
                    type: 'alphabetV244',
                    title: 'Alphabet',
                    titleBackground: 'none',
                    activeCategory: 'All',
                    cardStyle: 'thin-vertical',
                    items: []
                },
                {
                    id: customId('component'),
                    type: 'practiceCategoryV244',
                    title: 'Practice This Category',
                    titleBackground: 'none',
                    promptField: 'character',
                    answerField: 'romanization',
                    studyMode: 'sounds'
                },
                {
                    id: customId('component'),
                    type: 'ankiReviewV244',
                    title: 'Alphabet Anki Review',
                    titleBackground: 'none',
                    promptField: 'character',
                    answerField: 'romanization',
                    studyMode: 'sounds',
                    reviewState: {}
                }
            ];

        case 'whiteboard-v197':
            return [{
                id: customId('component'),
                type: 'miroWhiteboardV197',
                title: 'Whiteboard'
            }];

        case 'notepad-v249':
            return [{
                id: customId('component'),
                type: 'fullNotepadV249',
                title: 'Notebook'
            }];

        default:
            return [];
    }
}


// ------------------------------------------------------------
// WEEKLY REVIEW AS A CUSTOM-TAB COMPONENT
// ------------------------------------------------------------

function renderWeeklyReviewTemplateV53(
    tab,
    component,
    content
) {
    const {
        start,
        end
    } =
        getWeeklyReviewRange();

    const dayNumbers =
        Array.from(
            {
                length:
                    end -
                    start +
                    1
            },
            (
                _,
                index
            ) =>
                start +
                index
        );

    const loggedDays =
        dayNumbers.filter(
            day =>
                featureDayHasContent(
                    db.days?.[
                        day
                    ]
                )
        ).length;

    let noteWords =
        0;

    let mediaCount =
        0;

    const knowledge =
        new Set();

    dayNumbers.forEach(
        day => {
            const data =
                db.days?.[
                    day
                ] ||
                {};

            const noteText =
                featureStripHtml(
                    data.notes ||
                    ''
                );

            if (
                noteText
            ) {
                noteWords +=
                    noteText
                        .split(
                            /\s+/
                        )
                        .filter(
                            Boolean
                        ).length;
            }

            mediaCount +=
                (
                    data.resources ||
                    []
                ).length;

            mediaCount +=
                (
                    data.noteImages ||
                    []
                ).length;

            mediaCount +=
                (
                    data.noteAudios ||
                    []
                ).length;

            mediaCount +=
                data.video
                    ? 1
                    : 0;

            mediaCount +=
                data.video2
                    ? 1
                    : 0;

            collectPdfValuesFromDay(
                data
            ).forEach(
                () =>
                    mediaCount +=
                        1
            );

            (
                data.phrases ||
                []
            ).forEach(
                item =>
                    knowledge.add(
                        item
                    )
            );
        }
    );

    const customDone =
        getWeeklyCustomCompletionCount(
            start,
            end
        );

    const key =
        `${start}-${end}`;

    if (
        !component.focusByRange ||
        typeof component
            .focusByRange !==
            'object'
    ) {
        component.focusByRange =
            {};
    }

    content.innerHTML = `
        <div class="custom-collection-header weekly-review-template-heading-v53">
            <div>
                <h2>${escapeCustomHtml(
                    component.title ||
                    'Weekly Review'
                )}</h2>
                <span class="weekly-review-eyebrow">
                    ${escapeCustomHtml(
                        `${formatDate(
                            start
                        )} — ${formatDate(
                            end
                        )}`
                    )}
                </span>
            </div>
        </div>

        <div class="weekly-review-stats weekly-review-stats-template-v53">
            <article>
                <i class="ph ph-calendar-check"></i>
                <strong>${loggedDays}/${dayNumbers.length}</strong>
                <span>Days logged</span>
            </article>

            <article>
                <i class="ph ph-text-aa"></i>
                <strong>${noteWords}</strong>
                <span>Note words</span>
            </article>

            <article>
                <i class="ph ph-images"></i>
                <strong>${mediaCount}</strong>
                <span>Media</span>
            </article>

            <article>
                <i class="ph ph-books"></i>
                <strong>${knowledge.size}</strong>
                <span>Learned</span>
            </article>

            <article>
                <i class="ph ph-check-circle"></i>
                <strong>${customDone}</strong>
                <span>Completed</span>
            </article>
        </div>

        <section class="weekly-review-section weekly-review-template-section-v53">
            <div class="section-header">
                <h3>Your Week</h3>
            </div>

            <div class="weekly-review-days"></div>
        </section>

        <section class="weekly-review-section weekly-review-template-section-v53">
            <div class="section-header">
                <h3>Focus for next week</h3>
                <span class="weekly-review-saved"></span>
            </div>

            <textarea
                class="weekly-review-focus"
                rows="4"
                placeholder="What do you want to focus on next week?"
            ></textarea>
        </section>
    `;

    const daysHost =
        content.querySelector(
            '.weekly-review-days'
        );

    dayNumbers
        .slice()
        .reverse()
        .forEach(
            day => {
                const data =
                    db.days?.[
                        day
                    ] ||
                    {};

                const notes =
                    featureStripHtml(
                        data.notes ||
                        ''
                    );

                const resources =
                    (
                        data.resources ||
                        []
                    ).length +
                    (
                        data.noteImages ||
                        []
                    ).length +
                    (
                        data.noteAudios ||
                        []
                    ).length +
                    (
                        data.video
                            ? 1
                            : 0
                    ) +
                    (
                        data.video2
                            ? 1
                            : 0
                    );

                const learned =
                    (
                        data.phrases ||
                        []
                    ).length;

                const card =
                    document.createElement(
                        'button'
                    );

                card.type =
                    'button';

                card.className =
                    `weekly-review-day${
                        featureDayHasContent(
                            data
                        )
                            ? ''
                            : ' empty'
                    }`;

                card.innerHTML = `
                    <span class="weekly-review-day-number">
                        Day ${day}
                    </span>

                    <strong>
                        ${escapeCustomHtml(
                            formatDate(
                                day
                            )
                        )}
                    </strong>

                    <span>
                        ${
                            notes
                                ? `${notes
                                    .split(
                                        /\s+/
                                    )
                                    .filter(
                                        Boolean
                                    ).length} note words`
                                : 'No notes'
                        }
                        · ${resources} media/resource${resources === 1 ? '' : 's'}
                        · ${learned} learned
                    </span>

                    <i class="ph ph-arrow-right"></i>
                `;

                card.addEventListener(
                    'click',
                    () =>
                        openDayLog(
                            day
                        )
                );

                daysHost.appendChild(
                    card
                );
            }
        );

    const textarea =
        content.querySelector(
            '.weekly-review-focus'
        );

    const saved =
        content.querySelector(
            '.weekly-review-saved'
        );

    textarea.value =
        component
            .focusByRange[
                key
            ] ||
        '';

    textarea.addEventListener(
        'input',
        () => {
            component
                .focusByRange[
                    key
                ] =
                textarea.value;

            clearTimeout(
                textarea
                    ._weeklyTemplateSaveV53
            );

            textarea
                ._weeklyTemplateSaveV53 =
                setTimeout(
                    () => {
                        saveDb();

                        saved.textContent =
                            'Saved ✓';

                        setTimeout(
                            () => {
                                saved.textContent =
                                    '';
                            },
                            1100
                        );
                    },
                    400
                );
        }
    );
}


// ------------------------------------------------------------
// SENTENCE BUILDER FROM KNOWLEDGE BASE
// ------------------------------------------------------------

function sentenceBuilderItemsV53(
    query =
        ''
) {
    const normalized =
        String(
            query ||
            ''
        )
            .trim()
            .toLowerCase();

    return (
        db.phrases ||
        []
    )
        .filter(
            phrase => {
                if (
                    !normalized
                ) {
                    return true;
                }

                const meta =
                    db.phrase_meta?.[
                        phrase
                    ] ||
                    {};

                const customText =
                    Object.values(
                        meta.custom_fields ||
                        {}
                    )
                        .map(
                            value =>
                                String(
                                    value ||
                                    ''
                                )
                        )
                        .join(
                            ' '
                        );

                return `${phrase} ${meta.type || ''} ${customText}`
                    .toLowerCase()
                    .includes(
                        normalized
                    );
            }
        )
        .slice(
            0,
            120
        );
}

function sentenceBuilderTextV53(
    tokens
) {
    return (
        tokens ||
        []
    )
        .map(
            token =>
                String(
                    token ||
                    ''
                ).trim()
        )
        .filter(
            Boolean
        )
        .join(
            ' '
        )
        .replace(
            /\s+([,.!?;:])/g,
            '$1'
        );
}

function renderKnowledgeSentenceBuilderV53(
    tab,
    component,
    content
) {
    if (
        !Array.isArray(
            component.tokens
        )
    ) {
        component.tokens =
            [];
    }

    if (
        !Array.isArray(
            component.savedSentences
        )
    ) {
        component.savedSentences =
            [];
    }

    content.innerHTML = `
        <div class="custom-collection-header">
            <div>
                <h2>${escapeCustomHtml(
                    component.title ||
                    'Sentence Builder'
                )}</h2>

                <small class="sentence-builder-source-v53">
                    Uses items from this log's Knowledge Base
                </small>
            </div>
        </div>

        <div class="sentence-builder-current-v53">
            <div class="sentence-builder-current-line-v53"></div>

            <div class="sentence-builder-actions-v53">
                <button
                    type="button"
                    class="small-icon-btn sentence-builder-clear-v53"
                    title="Clear sentence"
                >
                    <i class="ph ph-eraser"></i>
                </button>

                <button
                    type="button"
                    class="icon-btn sentence-builder-save-v53"
                >
                    Save Sentence
                </button>
            </div>
        </div>

        <div class="sentence-builder-search-v53">
            <i class="ph ph-magnifying-glass"></i>
            <input
                type="text"
                placeholder="Search Knowledge Base…"
                aria-label="Search Knowledge Base"
            >
        </div>

        <div class="sentence-builder-bank-v53"></div>

        <div class="sentence-builder-saved-wrap-v53">
            <div class="custom-collection-header">
                <h3>Saved Sentences</h3>
            </div>

            <div class="sentence-builder-saved-v53"></div>
        </div>
    `;

    const current =
        content.querySelector(
            '.sentence-builder-current-line-v53'
        );

    const bank =
        content.querySelector(
            '.sentence-builder-bank-v53'
        );

    const savedHost =
        content.querySelector(
            '.sentence-builder-saved-v53'
        );

    const search =
        content.querySelector(
            '.sentence-builder-search-v53 input'
        );

    const renderCurrent =
        () => {
            current.innerHTML =
                component.tokens.length
                    ? component.tokens
                        .map(
                            (
                                token,
                                index
                            ) => `
                                <button
                                    type="button"
                                    class="sentence-builder-token-v53"
                                    data-token-index-v53="${index}"
                                    title="Remove this chunk"
                                >
                                    ${escapeCustomHtml(
                                        token
                                    )}
                                    <i class="ph ph-x"></i>
                                </button>
                            `
                        )
                        .join('')
                    : `
                        <span class="sentence-builder-empty-v53">
                            Click Knowledge Base items below to build a sentence.
                        </span>
                    `;

            current
                .querySelectorAll(
                    '[data-token-index-v53]'
                )
                .forEach(
                    button => {
                        button.addEventListener(
                            'click',
                            () => {
                                component.tokens.splice(
                                    Number(
                                        button.dataset
                                            .tokenIndexV53
                                    ),
                                    1
                                );

                                saveDb();

                                renderCurrent();
                            }
                        );
                    }
                );
        };

    const renderBank =
        () => {
            const items =
                sentenceBuilderItemsV53(
                    search.value
                );

            bank.innerHTML =
                items.length
                    ? items.map(
                        phrase => {
                            const meta =
                                db.phrase_meta?.[
                                    phrase
                                ] ||
                                {};

                            return `
                                <button
                                    type="button"
                                    class="sentence-builder-bank-item-v53"
                                    data-phrase-v53="${escapeCustomHtml(
                                        phrase
                                    )}"
                                >
                                    <span>${escapeCustomHtml(
                                        phrase
                                    )}</span>
                                    ${
                                        meta.type
                                            ? `<small>${escapeCustomHtml(
                                                meta.type
                                            )}</small>`
                                            : ''
                                    }
                                </button>
                            `;
                        }
                    ).join('')
                    : `
                        <div class="feature-empty-state sentence-builder-no-items-v53">
                            <i class="ph ph-books"></i>
                            <strong>No matching Knowledge Base items</strong>
                            <span>Add items to Knowledge Base, then they will appear here automatically.</span>
                        </div>
                    `;

            bank
                .querySelectorAll(
                    '[data-phrase-v53]'
                )
                .forEach(
                    button => {
                        button.addEventListener(
                            'click',
                            () => {
                                component.tokens.push(
                                    button.dataset
                                        .phraseV53
                                );

                                saveDb();

                                renderCurrent();
                            }
                        );
                    }
                );
        };

    const renderSaved =
        () => {
            savedHost.innerHTML =
                component
                    .savedSentences
                    .length
                    ? component
                        .savedSentences
                        .map(
                            item => `
                                <article
                                    class="sentence-builder-saved-item-v53"
                                    data-saved-sentence-v53="${escapeCustomHtml(
                                        item.id
                                    )}"
                                >
                                    <button
                                        type="button"
                                        class="sentence-builder-use-saved-v53"
                                        title="Load this sentence"
                                    >
                                        ${escapeCustomHtml(
                                            item.text
                                        )}
                                    </button>

                                    <button
                                        type="button"
                                        class="small-icon-btn sentence-builder-remove-saved-v53"
                                        title="Remove saved sentence"
                                    >
                                        <i class="ph ph-x"></i>
                                    </button>
                                </article>
                            `
                        )
                        .join('')
                    : `
                        <div class="sentence-builder-empty-saved-v53">
                            Saved sentences will appear here.
                        </div>
                    `;

            savedHost
                .querySelectorAll(
                    '[data-saved-sentence-v53]'
                )
                .forEach(
                    row => {
                        const id =
                            row.dataset
                                .savedSentenceV53;

                        const item =
                            component
                                .savedSentences
                                .find(
                                    entry =>
                                        entry.id ===
                                        id
                                );

                        row
                            .querySelector(
                                '.sentence-builder-use-saved-v53'
                            )
                            ?.addEventListener(
                                'click',
                                () => {
                                    component.tokens =
                                        [
                                            item?.text ||
                                            ''
                                        ].filter(
                                            Boolean
                                        );

                                    saveDb();

                                    renderCurrent();
                                }
                            );

                        row
                            .querySelector(
                                '.sentence-builder-remove-saved-v53'
                            )
                            ?.addEventListener(
                                'click',
                                () => {
                                    component.savedSentences =
                                        component
                                            .savedSentences
                                            .filter(
                                                entry =>
                                                    entry.id !==
                                                    id
                                            );

                                    saveDb();

                                    renderSaved();
                                }
                            );
                    }
                );
        };

    content
        .querySelector(
            '.sentence-builder-clear-v53'
        )
        .addEventListener(
            'click',
            () => {
                component.tokens =
                    [];

                saveDb();

                renderCurrent();
            }
        );

    content
        .querySelector(
            '.sentence-builder-save-v53'
        )
        .addEventListener(
            'click',
            () => {
                const text =
                    sentenceBuilderTextV53(
                        component.tokens
                    );

                if (!text) {
                    showFeatureToast(
                        'Build a sentence first.'
                    );

                    return;
                }

                component
                    .savedSentences
                    .unshift({
                        id:
                            customId(
                                'sentence'
                            ),
                        text,
                        createdAt:
                            new Date()
                                .toISOString()
                    });

                saveDb();

                renderSaved();
            }
        );

    search.addEventListener(
        'input',
        renderBank
    );

    renderCurrent();
    renderBank();
    renderSaved();
}


// ------------------------------------------------------------
// Make the two template-only sections behave like normal components.
// ------------------------------------------------------------

if (
    !CUSTOM_COMPONENT_LIBRARY.some(
        item =>
            item.type ===
            'weeklyReviewV53'
    )
) {
    CUSTOM_COMPONENT_LIBRARY.push(
        {
            type:
                'weeklyReviewV53',
            label:
                'Weekly Review',
            icon:
                'ph-calendar-check'
        },
        {
            type:
                'knowledgeSentenceBuilderV53',
            label:
                'Sentence Builder',
            icon:
                'ph-text-aa'
        }
    );
}

CUSTOM_TITLE_BACKGROUND_TYPES.add(
    'weeklyReviewV53'
);

CUSTOM_TITLE_BACKGROUND_TYPES.add(
    'knowledgeSentenceBuilderV53'
);

const defaultCustomComponentBeforeTemplatesV53 =
    defaultCustomComponent;

defaultCustomComponent =
    function(
        type
    ) {
        if (
            type ===
            'weeklyReviewV53'
        ) {
            return {
                id:
                    customId(
                        'component'
                    ),
                type,
                title:
                    'Weekly Review',
                titleBackground:
                    'none',
                focusByRange:
                    {}
            };
        }

        if (
            type ===
            'knowledgeSentenceBuilderV53'
        ) {
            return {
                id:
                    customId(
                        'component'
                    ),
                type,
                title:
                    'Sentence Builder',
                titleBackground:
                    'none',
                tokens:
                    [],
                savedSentences:
                    []
            };
        }

        return defaultCustomComponentBeforeTemplatesV53(
            type
        );
    };

const renderCustomComponentContentBeforeTemplatesV53 =
    renderCustomComponentContent;

renderCustomComponentContent =
    function(
        tab,
        component,
        content
    ) {
        if (
            component?.type ===
            'weeklyReviewV53'
        ) {
            renderWeeklyReviewTemplateV53(
                tab,
                component,
                content
            );

            return;
        }

        if (
            component?.type ===
            'knowledgeSentenceBuilderV53'
        ) {
            renderKnowledgeSentenceBuilderV53(
                tab,
                component,
                content
            );

            return;
        }

        renderCustomComponentContentBeforeTemplatesV53(
            tab,
            component,
            content
        );
    };

const editCustomComponentBeforeTemplatesV53 =
    editCustomComponent;

editCustomComponent =
    async function(
        tabId,
        componentId
    ) {
        const tab =
            getCustomTab(
                tabId
            );

        const component =
            tab
                ?.components
                ?.find(
                    item =>
                        item.id ===
                        componentId
                );

        if (
            component &&
            [
                'weeklyReviewV53',
                'knowledgeSentenceBuilderV53'
            ].includes(
                component.type
            )
        ) {
            const value =
                await showAppPrompt({
                    title:
                        'Edit Section Title',
                    label:
                        'Section Title',
                    value:
                        component.title ||
                        '',
                    submitLabel:
                        'Save'
                });

            if (
                value ===
                null
            ) {
                return;
            }

            component.title =
                value.trim() ||
                component.title ||
                'Section';

            saveDb();

            renderCustomTabView(
                tabId
            );

            return;
        }

        return editCustomComponentBeforeTemplatesV53(
            tabId,
            componentId
        );
    };


// ------------------------------------------------------------
// PRE-BUILT TAB PICKER INSIDE CREATE TAB
// ------------------------------------------------------------

function renderPrebuiltTabCardsV53(
    section
) {
    const grid =
        section.querySelector(
            '.custom-tab-template-grid-v53'
        );

    if (!grid) {
        return;
    }

    grid.innerHTML =
        CUSTOM_TAB_TEMPLATES_V53
            .map(
                template => `
                    <button
                        type="button"
                        class="custom-tab-template-card-v53"
                        data-custom-tab-template-v53="${template.id}"
                    >
                        <span class="custom-tab-template-icon-v53">
                            <i class="ph ${template.icon}"></i>
                        </span>

                        <span class="custom-tab-template-copy-v53">
                            <strong>${escapeCustomHtml(
                                template.name
                            )}</strong>
                            <small>${escapeCustomHtml(
                                template.description
                            )}</small>
                        </span>

                        <i class="ph ph-check-circle custom-tab-template-check-v53"></i>
                    </button>
                `
            )
            .join('');
}

function selectTemplateIconV53(
    modal,
    icon
) {
    const picker =
        modal.querySelector(
            '#custom-tab-icon-picker'
        );

    if (!picker) {
        return;
    }

    const choices =
        Array.from(
            picker.querySelectorAll(
                '.custom-tab-icon-choice'
            )
        );

    choices.forEach(
        choice =>
            choice.classList.remove(
                'selected'
            )
    );

    const match =
        choices.find(
            choice =>
                choice.dataset
                    .icon ===
                icon
        );

    (
        match ||
        choices[0]
    )
        ?.classList.add(
            'selected'
        );
}

function ensurePrebuiltTabSectionV53() {
    const modal =
        document.getElementById(
            'custom-tab-create-modal'
        );

    if (!modal) {
        return null;
    }

    let section =
        modal.querySelector(
            '.custom-tab-template-section-v53'
        );

    if (!section) {
        section =
            document.createElement(
                'div'
            );

        section.className =
            'modal-section custom-tab-template-section-v53';

        section.innerHTML = `
            <span class="field-label">
                Or start with a pre-built tab
            </span>

            <p class="custom-tab-create-hint">
                Pick one to create a ready-made page. You can still edit, reorder, add, or remove its sections afterward.
            </p>

            <div class="custom-tab-template-grid-v53"></div>
        `;

        const daily =
            modal.querySelector(
                '.custom-tab-daily-source-section'
            );

        if (daily) {
            daily.insertAdjacentElement(
                'afterend',
                section
            );
        } else {
            modal
                .querySelector(
                    '#custom-tab-create-confirm'
                )
                ?.insertAdjacentElement(
                    'beforebegin',
                    section
                );
        }

        renderPrebuiltTabCardsV53(
            section
        );

        section.addEventListener(
            'click',
            event => {
                const card =
                    event.target.closest(
                        '[data-custom-tab-template-v53]'
                    );

                if (!card) {
                    return;
                }

                const id =
                    card.dataset
                        .customTabTemplateV53;

                const wasSelected =
                    card.classList
                        .contains(
                            'selected'
                        );

                section
                    .querySelectorAll(
                        '.custom-tab-template-card-v53'
                    )
                    .forEach(
                        item =>
                            item.classList.remove(
                                'selected'
                            )
                    );

                modal.dataset
                    .selectedTemplateV53 =
                    wasSelected
                        ? ''
                        : id;

                if (
                    wasSelected
                ) {
                    return;
                }

                card.classList.add(
                    'selected'
                );

                const template =
                    customTemplateV53(
                        id
                    );

                if (!template) {
                    return;
                }

                const nameInput =
                    modal.querySelector(
                        '#custom-tab-name-input'
                    );

                const previousTemplateName =
                    modal.dataset
                        .lastTemplateNameV53 ||
                    '';

                if (
                    nameInput &&
                    (
                        !nameInput.value
                            .trim() ||
                        nameInput.value ===
                            previousTemplateName
                    )
                ) {
                    nameInput.value =
                        template.name;
                }

                modal.dataset
                    .lastTemplateNameV53 =
                    template.name;

                selectTemplateIconV53(
                    modal,
                    template.icon
                );
            }
        );
    }

    return section;
}

function patchCustomTabCreateButtonV53() {
    const modal =
        document.getElementById(
            'custom-tab-create-modal'
        );

    const old =
        modal?.querySelector(
            '#custom-tab-create-confirm'
        );

    if (
        !old ||
        old.dataset
            .prebuiltPatchedV53 ===
            'true'
    ) {
        return;
    }

    const button =
        old.cloneNode(
            true
        );

    button.dataset
        .prebuiltPatchedV53 =
        'true';

    old.replaceWith(
        button
    );

    button.addEventListener(
        'click',
        createCustomTabFromModalV53
    );

    // V495: Enter inside Create Tab uses the exact same final button click path
    // as the mouse. This survives later button-handler wrappers and avoids a
    // second, older create function being called directly.
    if (modal.dataset.createTabEnterBoundV495 !== '1') {
        modal.dataset.createTabEnterBoundV495 = '1';
        modal.addEventListener('keydown', event => {
            if (
                event.key !== 'Enter' || event.repeat || event.shiftKey ||
                event.ctrlKey || event.metaKey || event.altKey ||
                event.target?.tagName === 'TEXTAREA' || event.target?.isContentEditable
            ) return;
            const submit = modal.querySelector('#custom-tab-create-confirm:not(:disabled)');
            if (!submit || modal.classList.contains('hidden')) return;
            event.preventDefault();
            event.stopPropagation();
            submit.click();
        });
    }
}

function createCustomTabFromModalV53() {
    const modal =
        document.getElementById(
            'custom-tab-create-modal'
        );

    const input =
        modal?.querySelector(
            '#custom-tab-name-input'
        );

    // V496: Whiteboard/Notebook creation must never block on lazy feature boot.
    // V484 waited for a readiness flag and recursively re-entered this function;
    // if the flag lagged or never flipped, the tab was never inserted. The tab's
    // built-in component is enough to persist immediately. Trigger the lazy
    // runtime in parallel and let its normal renderer attach when available.
    const requestedTemplateV496 = String(modal?.dataset?.selectedTemplateV53 || '');
    const isSpecialWorkspaceV496 =
        requestedTemplateV496 === 'whiteboard-v197' ||
        requestedTemplateV496 === 'notepad-v249';
    if (isSpecialWorkspaceV496 && typeof window.ensureLoggyExtras === 'function') {
        try { window.ensureLoggyExtras({ urgent: true }).catch(() => {}); } catch {}
    }

    if (
        !modal ||
        !input
    ) {
        return;
    }

    const templateId =
        modal.dataset
            .selectedTemplateV53 ||
        '';

    const template =
        customTemplateV53(
            templateId
        );

    const name =
        input.value
            .trim() ||
        template?.name ||
        'My Tab';

    const icon =
        modal
            .querySelector(
                '.custom-tab-icon-choice.selected'
            )
            ?.dataset.icon ||
        template?.icon ||
        'ph-squares-four';

    const chosenDailySources =
        Array.from(
            modal.querySelectorAll(
                '.custom-tab-daily-source-grid input[type="checkbox"]:checked'
            )
        ).map(
            input =>
                input.value
        );

    const tab = {
        id:
            customId(
                'tab'
            ),
        name,
        icon,
        templateIdV53:
            templateId ||
            '',
        components:
            template
                ? buildPrebuiltTabComponentsV53(
                    template.id
                )
                : []
    };

    if (
        chosenDailySources.length
    ) {
        const existingCollection =
            tab.components.find(
                component =>
                    component.type ===
                    'dailyLogCollection'
            );

        if (
            existingCollection
        ) {
            existingCollection.sources =
                Array.from(
                    new Set([
                        ...(
                            existingCollection.sources ||
                            []
                        ),
                        ...chosenDailySources
                    ])
                );
        } else {
            tab.components.push({
                ...defaultCustomComponent(
                    'dailyLogCollection'
                ),
                sources:
                    chosenDailySources
            });
        }
    }

    if (
        modal
            .querySelector(
                '#custom-tab-add-connections-map'
            )
            ?.checked &&
        !tab.components.some(
            component =>
                component.type ===
                'dailyConnectionsGraph'
        )
    ) {
        tab.components.push({
            id:
                customId(
                    'component'
                ),
            type:
                'dailyConnectionsGraph',
            title:
                'Daily Log Connections',
            titleBackground:
                'none'
        });
    }

    getCustomTabs().push(
        tab
    );

    saveDb();

    closeCustomTabCreateModal();

    renderCustomTabNavigation();

    const view =
        buildCustomTabView(
            tab
        );

    document.body.insertBefore(
        view,
        document.getElementById(
            'companion-stage'
        ) ||
        null
    );

    activeCustomTabId =
        tab.id;

    customTabEditMode =
        false;

    renderCustomTabView(
        tab.id
    );

    switchView(
        view
    );
}

const ensureCustomTabCreateModalBeforeTemplatesV53 =
    ensureCustomTabCreateModal;

ensureCustomTabCreateModal =
    function() {
        ensureCustomTabCreateModalBeforeTemplatesV53();

        ensurePrebuiltTabSectionV53();

        patchCustomTabCreateButtonV53();
    };

const openCustomTabCreateModalBeforeTemplatesV53 =
    openCustomTabCreateModal;

openCustomTabCreateModal =
    function() {
        ensureCustomTabCreateModal();

        const modal =
            document.getElementById(
                'custom-tab-create-modal'
            );

        if (modal) {
            modal.dataset
                .selectedTemplateV53 =
                '';

            modal.dataset
                .lastTemplateNameV53 =
                '';

            modal
                .querySelectorAll(
                    '.custom-tab-template-card-v53'
                )
                .forEach(
                    card =>
                        card.classList.remove(
                            'selected'
                        )
                );
        }

        openCustomTabCreateModalBeforeTemplatesV53();
    };


// ------------------------------------------------------------
// WEEKLY REVIEW IS NO LONGER A DEFAULT SIDE-NAV TAB.
// The old data/view remains untouched for backward compatibility.
// ------------------------------------------------------------

const ensureLogNavSettingsBeforeNoWeeklyV53 =
    ensureLogNavSettingsV52;

ensureLogNavSettingsV52 =
    function() {
        const settings =
            ensureLogNavSettingsBeforeNoWeeklyV53();

        if (
            !settings
                .hiddenBuiltInTabsV52
                .includes(
                    'weekly-review'
                )
        ) {
            settings
                .hiddenBuiltInTabsV52
                .push(
                    'weekly-review'
                );
        }

        settings.logNavOrderV52 =
            (
                settings.logNavOrderV52 ||
                []
            ).filter(
                key =>
                    key !==
                    'weekly-review'
            );

        return settings;
    };

const ensureWeeklyReviewNavButtonBeforeNoDefaultV53 =
    ensureWeeklyReviewNavButton;

ensureWeeklyReviewNavButton =
    function() {
        document
            .getElementById(
                'open-weekly-review-btn'
            )
            ?.remove();

        return null;
    };

function removeDefaultWeeklyReviewNavV53() {
    ensureLogNavSettingsV52();

    document
        .getElementById(
            'open-weekly-review-btn'
        )
        ?.remove();

    if (
        sessionStorage.getItem(
            LAST_APP_TAB_STORAGE_KEY
        ) ===
        'weekly-review'
    ) {
        sessionStorage.setItem(
            LAST_APP_TAB_STORAGE_KEY,
            'daily'
        );
    }

    applyUnifiedLogNavOrderV52?.();
}

requestAnimationFrame(
    () => {
        ensureCustomTabCreateModal();

        removeDefaultWeeklyReviewNavV53();

        setTimeout(
            () => {
                ensureCustomTabCreateModal();

                removeDefaultWeeklyReviewNavV53();
            },
            100
        );
    }
);



// ============================================================
// V54 — DAILY LOG HIDDEN SCROLLBAR + PRESS/DRAG TAB REORDERING
// Click/release in place = open tab.
// Press, move above/below another tab, then release = reorder.
// ============================================================


// ------------------------------------------------------------
// DAILY LOG PAGE: keep wheel/trackpad scrolling, hide scrollbars.
// ------------------------------------------------------------

function syncDailyLogScrollbarV54(
    view
) {
    const onDailyLog =
        view ===
            logView ||
        document
            .getElementById(
                'log-view'
            )
            ?.classList
            .contains(
                'active'
            );

    document.documentElement
        .classList.toggle(
            'daily-log-scrollbar-hidden-v54',
            !!onDailyLog
        );

    document.body
        .classList.toggle(
            'daily-log-scrollbar-hidden-v54',
            !!onDailyLog
        );
}

const switchViewBeforeScrollbarV54 =
    switchView;

switchView =
    function(
        viewToShow
    ) {
        const result =
            switchViewBeforeScrollbarV54(
                viewToShow
            );

        syncDailyLogScrollbarV54(
            viewToShow
        );

        return result;
    };

requestAnimationFrame(
    () =>
        syncDailyLogScrollbarV54(
            document.querySelector(
                '.view.active'
            )
        )
);


// ------------------------------------------------------------
// NEW DEFAULT TAB ORDER:
// Daily Logs → Knowledge Base → Quizzes → Toolbox.
// Weekly Review remains optional through the V53 pre-built tab picker.
// ------------------------------------------------------------

const LOG_NAV_DEFAULT_ORDER_V54 = [
    'daily',
    'knowledge',
    'quizzes',
    'tools'
];

const currentAvailableLogNavKeysBeforeV54 =
    currentAvailableLogNavKeysV52;

currentAvailableLogNavKeysV52 =
    function() {
        const customKeys =
            getCustomTabs()
                .map(
                    tab =>
                        `custom:${tab.id}`
                );

        return [
            ...LOG_NAV_DEFAULT_ORDER_V54,
            ...customKeys
        ];
    };

const normalizedLogNavOrderBeforeV54 =
    normalizedLogNavOrderV52;

normalizedLogNavOrderV52 =
    function() {
        const settings =
            ensureLogNavSettingsV52();

        const rawBefore =
            Array.isArray(
                settings.logNavOrderV52
            )
                ? [
                    ...settings.logNavOrderV52
                ]
                : [];

        let order =
            normalizedLogNavOrderBeforeV54();

        if (
            !settings
                .logNavDefaultOrderV54Migrated
        ) {
            const customKeys =
                getCustomTabs()
                    .map(
                        tab =>
                            `custom:${tab.id}`
                    );

            const available =
                new Set([
                    ...LOG_NAV_DEFAULT_ORDER_V54,
                    ...customKeys
                ]);

            const oldDefault =
                [
                    'daily',
                    'tools',
                    'knowledge',
                    'quizzes',
                    ...customKeys
                ];

            const cleanedRaw =
                rawBefore
                    .filter(
                        key =>
                            key !==
                                'weekly-review' &&
                            available.has(
                                key
                            )
                    );

            const looksExactlyLikeOldDefault =
                cleanedRaw.length ===
                    oldDefault.length &&
                cleanedRaw.every(
                    (
                        key,
                        index
                    ) =>
                        key ===
                        oldDefault[
                            index
                        ]
                );

            // New logs, or logs still using the untouched old default,
            // receive the requested Toolbox-below-Quizzes order.
            if (
                !cleanedRaw.length ||
                looksExactlyLikeOldDefault
            ) {
                order = [
                    ...LOG_NAV_DEFAULT_ORDER_V54,
                    ...customKeys
                ];

                settings.logNavOrderV52 =
                    [
                        ...order
                    ];
            }

            settings
                .logNavDefaultOrderV54Migrated =
                true;

            setTimeout(
                saveDb,
                0
            );
        }

        return order;
    };


// ------------------------------------------------------------
// PRESS + DRAG REORDERING.
// Replaces browser-native HTML5 dragging with direct pointer movement.
// ------------------------------------------------------------

let logNavPointerDragV54 =
    null;

function visibleOrderedNavButtonsV54(
    host
) {
    return Array.from(
        host?.children ||
        []
    ).filter(
        element =>
            element.matches?.(
                '.icon-btn[data-log-nav-key-v52]'
            ) &&
            !element.classList
                .contains(
                    'log-nav-hidden-v52'
                )
    );
}

function clearPressDragStateV54() {
    const state =
        logNavPointerDragV54;

    if (
        state?.button
    ) {
        state.button.classList.remove(
            'log-nav-pointer-dragging-v54'
        );
    }

    document.body.classList.remove(
        'log-nav-pointer-drag-active-v54'
    );

    logNavPointerDragV54 =
        null;
}

function reorderDraggedTabAtPointerV54(
    state,
    clientY
) {
    const host =
        state.host;

    const button =
        state.button;

    if (
        !host ||
        !button
    ) {
        return;
    }

    const candidates =
        visibleOrderedNavButtonsV54(
            host
        ).filter(
            item =>
                item !==
                button
        );

    if (
        !candidates.length
    ) {
        return;
    }

    let closest =
        null;

    let closestDistance =
        Infinity;

    candidates.forEach(
        candidate => {
            const rect =
                candidate
                    .getBoundingClientRect();

            const center =
                rect.top +
                rect.height /
                    2;

            const distance =
                Math.abs(
                    clientY -
                    center
                );

            if (
                distance <
                closestDistance
            ) {
                closest =
                    candidate;

                closestDistance =
                    distance;
            }
        }
    );

    if (!closest) {
        return;
    }

    const rect =
        closest
            .getBoundingClientRect();

    const after =
        clientY >
        rect.top +
            rect.height /
                2;

    const beforeIndex =
        visibleOrderedNavButtonsV54(
            host
        ).indexOf(
            button
        );

    if (after) {
        closest.after(
            button
        );
    } else {
        closest.before(
            button
        );
    }

    const afterIndex =
        visibleOrderedNavButtonsV54(
            host
        ).indexOf(
            button
        );

    if (
        afterIndex !==
        beforeIndex
    ) {
        state.changed =
            true;
    }
}

function installPressDragTabReorderV54() {
    const host =
        document.getElementById(
            'log-tab-order-host-v52'
        );

    if (!host) {
        return;
    }

    // Disable the browser's old ghost-image drag behavior.
    visibleOrderedNavButtonsV54(
        host
    ).forEach(
        button => {
            button.draggable =
                false;

            button.setAttribute(
                'draggable',
                'false'
            );
        }
    );

    if (
        host.dataset
            .pressDragTabsV54 ===
            'true'
    ) {
        return;
    }

    host.dataset
        .pressDragTabsV54 =
        'true';

    host.addEventListener(
        'pointerdown',
        event => {
            if (
                event.button !==
                    0
            ) {
                return;
            }

            const button =
                event.target.closest(
                    '.icon-btn[data-log-nav-key-v52]'
                );

            if (
                !button ||
                button.parentElement !==
                    host ||
                button.classList
                    .contains(
                        'log-nav-hidden-v52'
                    )
            ) {
                return;
            }

            const ordered =
                visibleOrderedNavButtonsV54(
                    host
                );

            logNavPointerDragV54 = {
                host,
                button,
                pointerId:
                    event.pointerId,
                startX:
                    event.clientX,
                startY:
                    event.clientY,
                startIndex:
                    ordered.indexOf(
                        button
                    ),
                dragging:
                    false,
                changed:
                    false
            };
        },
        true
    );

    host.addEventListener(
        'click',
        event => {
            const button =
                event.target.closest(
                    '.icon-btn[data-log-nav-key-v52]'
                );

            if (
                !button ||
                button.parentElement !==
                    host
            ) {
                return;
            }

            const until =
                Number(
                    button
                        ._suppressTabClickUntilV54 ||
                    0
                );

            if (
                performance.now() <
                until
            ) {
                event.preventDefault();
                event.stopImmediatePropagation();
            }
        },
        true
    );
}

document.addEventListener(
    'pointermove',
    event => {
        const state =
            logNavPointerDragV54;

        if (
            !state ||
            event.pointerId !==
                state.pointerId
        ) {
            return;
        }

        const distance =
            Math.hypot(
                event.clientX -
                    state.startX,
                event.clientY -
                    state.startY
            );

        if (
            !state.dragging &&
            distance >=
                6
        ) {
            state.dragging =
                true;

            state.button.classList.add(
                'log-nav-pointer-dragging-v54'
            );

            document.body.classList.add(
                'log-nav-pointer-drag-active-v54'
            );
        }

        if (
            !state.dragging
        ) {
            return;
        }

        event.preventDefault();

        reorderDraggedTabAtPointerV54(
            state,
            event.clientY
        );
    },
    {
        capture:
            true,
        passive:
            false
    }
);

function finishPressDragTabsV54(
    event
) {
    const state =
        logNavPointerDragV54;

    if (
        !state ||
        event.pointerId !==
            state.pointerId
    ) {
        return;
    }

    if (
        !state.dragging
    ) {
        // No movement: do not interfere. The button's normal click handler
        // fires and opens the tab exactly like a regular click.
        clearPressDragStateV54();

        return;
    }

    event.preventDefault();
    event.stopPropagation();

    state.button
        ._suppressTabClickUntilV54 =
        performance.now() +
        450;

    const finalIndex =
        visibleOrderedNavButtonsV54(
            state.host
        ).indexOf(
            state.button
        );

    const moved =
        state.changed &&
        finalIndex !==
            state.startIndex;

    if (moved) {
        saveLogNavOrderFromDomV52();

        ensureLogNavSettingsV52()
            .logNavUserReorderedV54 =
            true;

        saveDb();
    }

    clearPressDragStateV54();

    updateUnifiedLogNavScrollV52();
}

document.addEventListener(
    'pointerup',
    finishPressDragTabsV54,
    true
);

document.addEventListener(
    'pointercancel',
    event => {
        const state =
            logNavPointerDragV54;

        if (
            !state ||
            event.pointerId !==
                state.pointerId
        ) {
            return;
        }

        clearPressDragStateV54();
    },
    true
);


// ------------------------------------------------------------
// Reinstall pointer behavior every time V52/V53 rebuilds the nav.
// ------------------------------------------------------------

const applyUnifiedLogNavOrderBeforePressDragV54 =
    applyUnifiedLogNavOrderV52;

applyUnifiedLogNavOrderV52 =
    function() {
        applyUnifiedLogNavOrderBeforePressDragV54();

        installPressDragTabReorderV54();
    };

const renderCustomTabNavigationBeforePressDragV54 =
    renderCustomTabNavigation;

renderCustomTabNavigation =
    function() {
        renderCustomTabNavigationBeforePressDragV54();

        requestAnimationFrame(
            () => {
                applyUnifiedLogNavOrderV52();

                installPressDragTabReorderV54();
            }
        );
    };

requestAnimationFrame(
    () => {
        applyUnifiedLogNavOrderV52();

        installPressDragTabReorderV54();

        setTimeout(
            () => {
                applyUnifiedLogNavOrderV52();

                installPressDragTabReorderV54();
            },
            100
        );
    }
);



// ============================================================
// V55 — TABS APPEND AT BOTTOM / CONNECTION MAP FROM @DAY
// KNOWLEDGE BASE TAGS + DROPDOWN FIELDS + PATTERN SENTENCE BUILDER
// ============================================================


// ------------------------------------------------------------
// NEW TABS ALWAYS APPEND AFTER THE LAST TAB (BEFORE +).
// ------------------------------------------------------------

function ensureNewCustomTabsAtBottomV55() {
    const settings =
        ensureLogNavSettingsV52();

    const customKeys =
        getCustomTabs()
            .map(
                tab =>
                    `custom:${tab.id}`
            );

    const validKeys =
        new Set([
            'daily',
            'knowledge',
            'quizzes',
            'tools',
            ...customKeys
        ]);

    const current =
        Array.isArray(
            settings.logNavOrderV52
        )
            ? settings.logNavOrderV52
                .filter(
                    key =>
                        validKeys.has(
                            key
                        )
                )
            : [];

    const existing =
        new Set(
            current
        );

    // A missing key is a newly-created/duplicated tab. Always put it last.
    customKeys.forEach(
        key => {
            if (
                !existing.has(
                    key
                )
            ) {
                current.push(
                    key
                );

                existing.add(
                    key
                );
            }
        }
    );

    settings.logNavOrderV52 =
        current;

    return current;
}

const normalizedLogNavOrderBeforeBottomAppendV55 =
    normalizedLogNavOrderV52;

normalizedLogNavOrderV52 =
    function() {
        normalizedLogNavOrderBeforeBottomAppendV55();

        const appended =
            ensureNewCustomTabsAtBottomV55();

        const available =
            currentAvailableLogNavKeysV52();

        available.forEach(
            key => {
                if (
                    !appended.includes(
                        key
                    )
                ) {
                    // Built-ins missing from an older saved order keep their
                    // built-in relative position; new custom tabs were already
                    // appended above.
                    const builtInOrder = [
                        'daily',
                        'knowledge',
                        'quizzes',
                        'tools'
                    ];

                    if (
                        builtInOrder.includes(
                            key
                        )
                    ) {
                        const desired =
                            builtInOrder.indexOf(
                                key
                            );

                        let insertAt =
                            appended.length;

                        for (
                            let index =
                                desired +
                                1;
                            index <
                                builtInOrder.length;
                            index++
                        ) {
                            const next =
                                appended.indexOf(
                                    builtInOrder[
                                        index
                                    ]
                                );

                            if (
                                next >=
                                0
                            ) {
                                insertAt =
                                    next;

                                break;
                            }
                        }

                        appended.splice(
                            insertAt,
                            0,
                            key
                        );
                    }
                }
            }
        );

        ensureLogNavSettingsV52()
            .logNavOrderV52 =
            appended;

        return appended;
    };


// ------------------------------------------------------------
// DAILY LOG CONNECTIONS: remove the per-day editing section.
// The optional custom-tab map now derives connections automatically from
// @Day references, while still understanding legacy saved links.
// ------------------------------------------------------------

function removeDailyConnectionsSectionV55() {
    document
        .getElementById(
            'daily-connections-section-v32'
        )
        ?.remove();
}

ensureDailyConnectionsUIV32 =
    function() {
        removeDailyConnectionsSectionV55();

        return null;
    };

renderDailyConnectionsV32 =
    function() {
        removeDailyConnectionsSectionV55();
    };

requestAnimationFrame(
    removeDailyConnectionsSectionV55
);

function extractDayMentionsV55(
    html
) {
    const source =
        String(
            html ||
            ''
        );

    const days =
        new Set();

    const patterns = [
        /data-day=["'](\d+)["']/gi,
        /@day\s*(\d+)/gi,
        /@(\d+)/g
    ];

    patterns.forEach(
        pattern => {
            let match;

            while (
                (
                    match =
                        pattern.exec(
                            source
                        )
                )
            ) {
                const day =
                    Number(
                        match[1]
                    );

                if (
                    Number.isFinite(
                        day
                    ) &&
                    day >
                        0
                ) {
                    days.add(
                        day
                    );
                }
            }
        }
    );

    return Array.from(
        days
    );
}

function getDailyConnectionMapDataV55() {
    const nodes =
        new Set();

    const edgeMap =
        new Map();

    const addEdge =
        (
            source,
            target,
            label,
            kind
        ) => {
            source =
                Number(
                    source
                );

            target =
                Number(
                    target
                );

            if (
                !Number.isFinite(
                    source
                ) ||
                !Number.isFinite(
                    target
                ) ||
                source <=
                    0 ||
                target <=
                    0 ||
                source ===
                    target
            ) {
                return;
            }

            nodes.add(
                source
            );

            nodes.add(
                target
            );

            const key =
                `${source}->${target}`;

            const existing =
                edgeMap.get(
                    key
                );

            if (existing) {
                if (
                    label &&
                    !existing.labels.includes(
                        label
                    )
                ) {
                    existing.labels.push(
                        label
                    );
                }

                if (
                    kind &&
                    !existing.kinds.includes(
                        kind
                    )
                ) {
                    existing.kinds.push(
                        kind
                    );
                }

                return;
            }

            edgeMap.set(
                key,
                {
                    source,
                    target,
                    labels:
                        label
                            ? [
                                label
                            ]
                            : [],
                    kinds:
                        kind
                            ? [
                                kind
                            ]
                            : []
                }
            );
        };

    Object.entries(
        db.days ||
        {}
    ).forEach(
        (
            [
                sourceValue,
                dayData
            ]
        ) => {
            const source =
                Number(
                    sourceValue
                );

            if (
                !Number.isFinite(
                    source
                ) ||
                source <=
                    0
            ) {
                return;
            }

            extractDayMentionsV55(
                dayData?.notes ||
                ''
            ).forEach(
                target =>
                    addEdge(
                        source,
                        target,
                        '@Day',
                        'mention'
                    )
            );

            (
                dayData
                    ?.connections ||
                []
            ).forEach(
                raw => {
                    const connection =
                        normalizeDailyConnectionV32(
                            raw
                        );

                    addEdge(
                        source,
                        connection.targetDay,
                        getDailyConnectionRelationLabelV32(
                            connection.relation
                        ),
                        'saved'
                    );
                }
            );
        }
    );

    const edges =
        Array.from(
            edgeMap.values()
        ).sort(
            (
                a,
                b
            ) =>
                a.source -
                    b.source ||
                a.target -
                    b.target
        );

    return {
        nodes:
            Array.from(
                nodes
            ).sort(
                (
                    a,
                    b
                ) =>
                    a -
                    b
            ),
        edges
    };
}

function dailyConnectionChildrenV55(
    edges
) {
    const map =
        new Map();

    edges.forEach(
        edge => {
            if (
                !map.has(
                    edge.source
                )
            ) {
                map.set(
                    edge.source,
                    []
                );
            }

            map.get(
                edge.source
            ).push(
                edge
            );
        }
    );

    map.forEach(
        list =>
            list.sort(
                (
                    a,
                    b
                ) =>
                    a.target -
                    b.target
            )
    );

    return map;
}

function renderConnectionTreeBranchV55(
    day,
    childMap,
    path =
        new Set()
) {
    const nextPath =
        new Set(
            path
        );

    nextPath.add(
        day
    );

    const children =
        childMap.get(
            day
        ) ||
        [];

    return `
        <li class="daily-connection-tree-node-v55">
            <button
                type="button"
                class="daily-connection-day-button-v55"
                data-open-day-v55="${day}"
            >
                Day ${day}
            </button>

            ${
                children.length
                    ? `
                        <ul>
                            ${children.map(
                                edge => {
                                    const cycle =
                                        nextPath.has(
                                            edge.target
                                        );

                                    return `
                                        <li class="daily-connection-tree-edge-v55">
                                            <span class="daily-connection-tree-label-v55">
                                                ${escapeCustomHtml(
                                                    edge.labels.join(
                                                        ' · '
                                                    ) ||
                                                    'Connected'
                                                )}
                                            </span>

                                            ${
                                                cycle
                                                    ? `
                                                        <button
                                                            type="button"
                                                            class="daily-connection-day-button-v55 cycle"
                                                            data-open-day-v55="${edge.target}"
                                                        >
                                                            Day ${edge.target}
                                                            <i class="ph ph-arrow-counter-clockwise"></i>
                                                        </button>
                                                    `
                                                    : renderConnectionTreeBranchV55(
                                                        edge.target,
                                                        childMap,
                                                        nextPath
                                                    )
                                            }
                                        </li>
                                    `;
                                }
                            ).join('')}
                        </ul>
                    `
                    : ''
            }
        </li>
    `;
}

function renderDailyConnectionsMapV55(
    tab,
    component,
    content
) {
    const {
        nodes,
        edges
    } =
        getDailyConnectionMapDataV55();

    if (
        !component.connectionViewV55
    ) {
        component.connectionViewV55 =
            'tree';
    }

    const view =
        component
            .connectionViewV55 ===
            'list'
            ? 'list'
            : 'tree';

    content.innerHTML = `
        <div class="custom-collection-header daily-connections-map-header-v55">
            <div>
                <h2>${escapeCustomHtml(
                    component.title ||
                    'Daily Log Connections Map'
                )}</h2>
                <small>
                    Automatically tracks @Day references in Daily Log notes.
                    ${edges.length} connection${edges.length === 1 ? '' : 's'}.
                </small>
            </div>

            <div class="daily-connections-view-toggle-v55">
                <button
                    type="button"
                    class="small-icon-btn ${view === 'tree' ? 'active' : ''}"
                    data-connection-view-v55="tree"
                    title="Tree view"
                >
                    <i class="ph ph-tree-structure"></i>
                </button>

                <button
                    type="button"
                    class="small-icon-btn ${view === 'list' ? 'active' : ''}"
                    data-connection-view-v55="list"
                    title="List view"
                >
                    <i class="ph ph-list-bullets"></i>
                </button>
            </div>
        </div>

        <div class="daily-connections-map-body-v55"></div>
    `;

    const body =
        content.querySelector(
            '.daily-connections-map-body-v55'
        );

    if (
        !edges.length
    ) {
        body.innerHTML = `
            <div class="feature-empty-state daily-connections-map-empty-v55">
                <i class="ph ph-share-network"></i>
                <strong>No @Day connections yet</strong>
                <span>
                    Type @ in Daily Log notes and link another Day. Those links will appear here automatically.
                </span>
            </div>
        `;
    } else if (
        view ===
        'list'
    ) {
        body.innerHTML = `
            <div class="daily-connections-list-view-v55">
                ${edges.map(
                    edge => `
                        <article class="daily-connection-list-row-v55">
                            <button
                                type="button"
                                class="daily-connection-day-button-v55"
                                data-open-day-v55="${edge.source}"
                            >
                                Day ${edge.source}
                            </button>

                            <span class="daily-connection-list-arrow-v55">
                                <i class="ph ph-arrow-right"></i>
                                <small>${escapeCustomHtml(
                                    edge.labels.join(
                                        ' · '
                                    ) ||
                                    'Connected'
                                )}</small>
                            </span>

                            <button
                                type="button"
                                class="daily-connection-day-button-v55"
                                data-open-day-v55="${edge.target}"
                            >
                                Day ${edge.target}
                            </button>
                        </article>
                    `
                ).join('')}
            </div>
        `;
    } else {
        const incoming =
            new Map();

        nodes.forEach(
            day =>
                incoming.set(
                    day,
                    0
                )
        );

        edges.forEach(
            edge =>
                incoming.set(
                    edge.target,
                    (
                        incoming.get(
                            edge.target
                        ) ||
                        0
                    ) +
                    1
                )
        );

        let roots =
            nodes.filter(
                day =>
                    (
                        incoming.get(
                            day
                        ) ||
                        0
                    ) ===
                    0
            );

        if (
            !roots.length &&
            nodes.length
        ) {
            roots = [
                nodes[0]
            ];
        }

        const childMap =
            dailyConnectionChildrenV55(
                edges
            );

        body.innerHTML = `
            <div class="daily-connections-tree-view-v55">
                <ul class="daily-connections-tree-root-v55">
                    ${roots.map(
                        day =>
                            renderConnectionTreeBranchV55(
                                day,
                                childMap
                            )
                    ).join('')}
                </ul>
            </div>
        `;
    }

    content
        .querySelectorAll(
            '[data-connection-view-v55]'
        )
        .forEach(
            button => {
                button.addEventListener(
                    'click',
                    () => {
                        component.connectionViewV55 =
                            button.dataset
                                .connectionViewV55;

                        saveDb();

                        renderCustomTabView(
                            tab.id
                        );
                    }
                );
            }
        );

    content
        .querySelectorAll(
            '[data-open-day-v55]'
        )
        .forEach(
            button => {
                button.addEventListener(
                    'click',
                    () =>
                        openDayLog(
                            Number(
                                button.dataset
                                    .openDayV55
                            )
                        )
                );
            }
        );
}

// Only the Create Tab checkbox adds this map now; remove the duplicate
// palette entry from the normal component palette.
for (
    let index =
        CUSTOM_COMPONENT_LIBRARY.length -
        1;
    index >=
        0;
    index--
) {
    if (
        CUSTOM_COMPONENT_LIBRARY[
            index
        ]?.type ===
        'dailyConnectionsGraph'
    ) {
        CUSTOM_COMPONENT_LIBRARY.splice(
            index,
            1
        );
    }
}

const renderCustomComponentContentBeforeConnectionMapV55 =
    renderCustomComponentContent;

renderCustomComponentContent =
    function(
        tab,
        component,
        content
    ) {
        if (
            component?.type ===
            'dailyConnectionsGraph'
        ) {
            renderDailyConnectionsMapV55(
                tab,
                component,
                content
            );

            return;
        }

        renderCustomComponentContentBeforeConnectionMapV55(
            tab,
            component,
            content
        );
    };


// ------------------------------------------------------------
// KNOWLEDGE BASE TAGS
// ------------------------------------------------------------

function normalizeKnowledgeTagV55(
    value
) {
    return String(
        value ||
        ''
    )
        .trim()
        .replace(
            /^#+/,
            ''
        )
        .toLowerCase()
        .replace(
            /\s+/g,
            '-'
        )
        .replace(
            /[^a-z0-9_\-\u00C0-\u024F\u1100-\u11FF\u3130-\u318F\uAC00-\uD7AF]/gi,
            ''
        );
}

function normalizeKnowledgeTagsV55(
    value
) {
    const values =
        Array.isArray(
            value
        )
            ? value
            : String(
                value ||
                ''
            ).split(
                /[\s,]+/
            );

    return Array.from(
        new Set(
            values
                .map(
                    normalizeKnowledgeTagV55
                )
                .filter(
                    Boolean
                )
        )
    );
}

function tagAliasesV55(
    value
) {
    const tag =
        normalizeKnowledgeTagV55(
            value
        );

    const aliases =
        new Set([
            tag
        ]);

    const map = {
        v:
            'verb',
        verbs:
            'verb',
        n:
            'noun',
        nouns:
            'noun',
        a:
            'adjective',
        adj:
            'adjective',
        adjectives:
            'adjective',
        adv:
            'adverb',
        adverbs:
            'adverb',
        pron:
            'pronoun',
        pronouns:
            'pronoun',
        prep:
            'preposition',
        prepositions:
            'preposition',
        patterns:
            'pattern'
    };

    if (
        map[
            tag
        ]
    ) {
        aliases.add(
            map[
                tag
            ]
        );
    }

    if (
        tag.endsWith(
            's'
        ) &&
        tag.length >
            3
    ) {
        aliases.add(
            tag.slice(
                0,
                -1
            )
        );
    }

    return Array.from(
        aliases
    ).filter(
        Boolean
    );
}

function getKnowledgeItemTagsV55(
    itemId
) {
    const meta =
        db.phrase_meta?.[
            itemId
        ] ||
        {};

    const tags =
        new Set();

    const add =
        value => {
            tagAliasesV55(
                value
            ).forEach(
                tag =>
                    tags.add(
                        tag
                    )
            );
        };

    (
        meta.tags ||
        []
    ).forEach(
        add
    );

    if (
        meta.type
    ) {
        add(
            meta.type
        );
    }

    const fields =
        getKnowledgeFieldDefs(
            meta.type
        );

    fields.forEach(
        field => {
            const value =
                meta
                    .custom_fields?.[
                        field.name
                    ];

            if (
                !value
            ) {
                return;
            }

            if (
                field.kind ===
                    'select' ||
                /(^|\s)(tag|tags|subcategory|sub-category|part of speech|word type)($|\s)/i.test(
                    field.name
                )
            ) {
                normalizeKnowledgeTagsV55(
                    value
                ).forEach(
                    add
                );
            }
        }
    );

    return Array.from(
        tags
    );
}

function formatKnowledgeTagsV55(
    tags
) {
    return (
        tags ||
        []
    )
        .map(
            tag =>
                `#${tag}`
        )
        .join(
            ' '
        );
}

function buildKnowledgeTagsEditorV55(
    value =
        []
) {
    return `
        <div class="modal-section mt-10 kb-tags-section-v55">
            <span class="field-label">
                Tags / Subcategories
            </span>

            <input
                type="text"
                id="kb-item-tags-v55"
                value="${escapeKnowledgeAttr(
                    formatKnowledgeTagsV55(
                        value
                    )
                )}"
                placeholder="#verb #noun #adjective…"
                autocomplete="off"
            >

            <p class="progress-hint">
                Separate tags with spaces or commas. You can search them later with #tag.
            </p>
        </div>
    `;
}

const renderAddKnowledgeFieldsBeforeTagsV55 =
    renderAddKnowledgeFields;

renderAddKnowledgeFields =
    function(
        categoryName
    ) {
        renderAddKnowledgeFieldsBeforeTagsV55(
            categoryName
        );

        const body =
            document.getElementById(
                'kb-add-item-fields-body'
            );

        if (
            !body ||
            body.querySelector(
                '.kb-tags-section-v55'
            )
        ) {
            return;
        }

        body.insertAdjacentHTML(
            'beforeend',
            buildKnowledgeTagsEditorV55(
                []
            ).replace(
                'id="kb-item-tags-v55"',
                'id="kb-add-item-tags-v55"'
            )
        );
    };

const renderKnowledgeEditFieldsBeforeTagsV55 =
    renderKnowledgeEditFields;

renderKnowledgeEditFields =
    function(
        itemId,
        categoryName
    ) {
        renderKnowledgeEditFieldsBeforeTagsV55(
            itemId,
            categoryName
        );

        const container =
            document.getElementById(
                'phrase-modal-dynamic-fields'
            );

        if (!container) {
            return;
        }

        const meta =
            db.phrase_meta?.[
                itemId
            ] ||
            {};

        const partsRow =
            container.querySelector(
                '.kb-edit-enable-parts-row'
            );

        const wrap =
            document.createElement(
                'div'
            );

        wrap.innerHTML =
            buildKnowledgeTagsEditorV55(
                meta.tags ||
                []
            );

        const section =
            wrap.firstElementChild;

        if (
            partsRow
        ) {
            container.insertBefore(
                section,
                partsRow
            );
        } else {
            container.appendChild(
                section
            );
        }

        const input =
            section.querySelector(
                '#kb-item-tags-v55'
            );

        let timer =
            null;

        input.addEventListener(
            'input',
            () => {
                clearTimeout(
                    timer
                );

                timer =
                    setTimeout(
                        () => {
                            if (
                                !db.phrase_meta[
                                    itemId
                                ]
                            ) {
                                return;
                            }

                            db.phrase_meta[
                                itemId
                            ].tags =
                                normalizeKnowledgeTagsV55(
                                    input.value
                                );

                            saveDb();

                            renderPhrasesLibrary(
                                document
                                    .getElementById(
                                        'phrases-search-bar'
                                    )
                                    ?.value ||
                                ''
                            );
                        },
                        250
                    );
            }
        );
    };

const renderKnowledgeViewFieldsBeforeTagsV55 =
    renderKnowledgeViewFields;

renderKnowledgeViewFields =
    function(
        itemId,
        categoryName,
        dayMode =
            false
    ) {
        renderKnowledgeViewFieldsBeforeTagsV55(
            itemId,
            categoryName,
            dayMode
        );

        const container =
            document.getElementById(
                'phrase-modal-dynamic-fields'
            );

        if (!container) {
            return;
        }

        const tags =
            getKnowledgeItemTagsV55(
                itemId
            ).filter(
                tag =>
                    tag !==
                    normalizeKnowledgeTagV55(
                        categoryName
                    )
            );

        if (
            !tags.length
        ) {
            return;
        }

        container.insertAdjacentHTML(
            'afterbegin',
            `
                <div class="modal-section mt-10 kb-tags-display-v55">
                    <span class="field-label">Tags</span>
                    <div class="kb-tags-chip-row-v55">
                        ${tags.map(
                            tag => `
                                <span class="kb-tag-chip-v55">
                                    #${escapeKnowledgeHtml(
                                        tag
                                    )}
                                </span>
                            `
                        ).join('')}
                    </div>
                </div>
            `
        );
    };


// ------------------------------------------------------------
// KNOWLEDGE BASE #TAG SEARCH
// ------------------------------------------------------------

function parseKnowledgeSearchV55(
    value
) {
    const raw =
        String(
            value ||
            ''
        );

    const tags =
        [];

    const text =
        raw.replace(
            /#([a-z0-9_\-\u00C0-\u024F\u1100-\u11FF\u3130-\u318F\uAC00-\uD7AF]+)/gi,
            (
                _,
                tag
            ) => {
                const normalized =
                    normalizeKnowledgeTagV55(
                        tag
                    );

                if (
                    normalized
                ) {
                    tags.push(
                        normalized
                    );
                }

                return ' ';
            }
        )
        .replace(
            /\s+/g,
            ' '
        )
        .trim();

    return {
        text,
        tags:
            Array.from(
                new Set(
                    tags
                )
            )
    };
}

const renderPhrasesLibraryBeforeTagSearchV55 =
    renderPhrasesLibrary;

renderPhrasesLibrary =
    function(
        filterText =
            ''
    ) {
        const parsed =
            parseKnowledgeSearchV55(
                filterText
            );

        renderPhrasesLibraryBeforeTagSearchV55(
            parsed.text
        );

        const grid =
            document.getElementById(
                'phrases-library-grid'
            );

        if (!grid) {
            return;
        }

        Array.from(
            grid.children
        ).forEach(
            card => {
                const title =
                    card.querySelector(
                        '.kb-library-item-title'
                    )
                        ?.textContent
                        ?.trim() ||
                    '';

                if (!title) {
                    return;
                }

                const tags =
                    getKnowledgeItemTagsV55(
                        title
                    );

                const matchesTags =
                    parsed.tags.every(
                        wanted =>
                            tags.includes(
                                wanted
                            )
                    );

                if (
                    !matchesTags
                ) {
                    card.remove();

                    return;
                }

                const visibleTags =
                    tags.filter(
                        tag =>
                            tag !==
                            normalizeKnowledgeTagV55(
                                db.phrase_meta?.[
                                    title
                                ]?.type
                            )
                    );

                if (
                    visibleTags.length &&
                    !card.querySelector(
                        '.kb-library-tag-row-v55'
                    )
                ) {
                    const row =
                        document.createElement(
                            'div'
                        );

                    row.className =
                        'kb-library-tag-row-v55';

                    row.innerHTML =
                        visibleTags
                            .slice(
                                0,
                                5
                            )
                            .map(
                                tag => `
                                    <span>
                                        #${escapeKnowledgeHtml(
                                            tag
                                        )}
                                    </span>
                                `
                            )
                            .join('');

                    card.appendChild(
                        row
                    );
                }
            }
        );
    };


// ------------------------------------------------------------
// CATEGORY FIELDS: ADD A DROPDOWN FIELD TYPE WITH CUSTOM OPTIONS.
// ------------------------------------------------------------

function parseKnowledgeDropdownOptionsV55(
    value
) {
    return Array.from(
        new Set(
            String(
                value ||
                ''
            )
                .split(
                    /[\n,]+/
                )
                .map(
                    option =>
                        option.trim()
                )
                .filter(
                    Boolean
                )
        )
    );
}

function injectKnowledgeDropdownFieldUiV55(
    modal
) {
    if (
        !modal ||
        modal.dataset
            .dropdownFieldV55 ===
            'true'
    ) {
        return;
    }

    modal.dataset
        .dropdownFieldV55 =
        'true';

    const kinds =
        modal.querySelector(
            '#kb-field-create-kind'
        );

    if (
        kinds &&
        !kinds.querySelector(
            '[data-kind="select"]'
        )
    ) {
        const button =
            document.createElement(
                'button'
            );

        button.type =
            'button';

        button.className =
            'kb-clean-icon-option';

        button.dataset.kind =
            'select';

        button.dataset.tip =
            'Dropdown / custom options';

        button.setAttribute(
            'aria-label',
            'Dropdown'
        );

        button.innerHTML =
            '<i class="ph ph-list-bullets"></i>';

        kinds.appendChild(
            button
        );

        button.addEventListener(
            'click',
            () => {
                pendingKnowledgeFieldKind =
                    'select';

                modal
                    .querySelectorAll(
                        '[data-kind]'
                    )
                    .forEach(
                        item =>
                            item.classList.toggle(
                                'selected',
                                item ===
                                    button
                            )
                    );

                syncKnowledgeDropdownOptionsUiV55(
                    modal
                );
            }
        );
    }

    if (
        !modal.querySelector(
            '#kb-field-create-options-section-v55'
        )
    ) {
        const section =
            document.createElement(
                'div'
            );

        section.id =
            'kb-field-create-options-section-v55';

        section.className =
            'modal-section hidden';

        section.innerHTML = `
            <span class="field-label">
                Dropdown Options
            </span>

            <textarea
                id="kb-field-create-options-v55"
                rows="4"
                placeholder="Verb&#10;Noun&#10;Adjective"
            ></textarea>

            <p class="progress-hint">
                Add one option per line or separate options with commas.
            </p>
        `;

        modal
            .querySelector(
                '#kb-field-create-language-section'
            )
            ?.insertAdjacentElement(
                'afterend',
                section
            );
    }

    modal.addEventListener(
        'click',
        event => {
            if (
                event.target.closest(
                    '[data-kind]'
                )
            ) {
                requestAnimationFrame(
                    () =>
                        syncKnowledgeDropdownOptionsUiV55(
                            modal
                        )
                );
            }
        }
    );

    const save =
        modal.querySelector(
            '#kb-field-create-save'
        );

    save.addEventListener(
        'click',
        event => {
            if (
                pendingKnowledgeFieldKind !==
                'select'
            ) {
                return;
            }

            const name =
                modal
                    .querySelector(
                        '#kb-field-create-name'
                    )
                    ?.value.trim() ||
                '';

            const options =
                parseKnowledgeDropdownOptionsV55(
                    modal
                        .querySelector(
                            '#kb-field-create-options-v55'
                        )
                        ?.value ||
                    ''
                );

            if (
                !options.length
            ) {
                event.preventDefault();
                event.stopImmediatePropagation();

                showFeatureToast(
                    'Add at least one dropdown option.'
                );

                modal
                    .querySelector(
                        '#kb-field-create-options-v55'
                    )
                    ?.focus();

                return;
            }

            const config =
                getCategoryConfig(
                    activeCategorySettingTab
                );

            const capturedId =
                editingKnowledgeFieldId;

            const duplicate =
                config.fields.some(
                    field =>
                        field.id !==
                            capturedId &&
                        field.name
                            .toLowerCase() ===
                            name.toLowerCase()
                );

            if (
                duplicate
            ) {
                event.preventDefault();
                event.stopImmediatePropagation();

                showFeatureToast(
                    'That field already exists in this category.'
                );

                return;
            }

            const snapshot = {
                category:
                    activeCategorySettingTab,
                id:
                    capturedId,
                name,
                options
            };

            setTimeout(
                () => {
                    const nextConfig =
                        getCategoryConfig(
                            snapshot.category
                        );

                    const field =
                        (
                            snapshot.id
                                ? nextConfig
                                    .fields
                                    .find(
                                        entry =>
                                            entry.id ===
                                            snapshot.id
                                    )
                                : null
                        ) ||
                        nextConfig
                            .fields
                            .find(
                                entry =>
                                    entry.name
                                        .toLowerCase() ===
                                    snapshot.name
                                        .toLowerCase()
                            );

                    if (!field) {
                        return;
                    }

                    field.kind =
                        'select';

                    field.options =
                        [
                            ...snapshot.options
                        ];

                    saveDb();

                    renderSettings();
                },
                0
            );
        },
        true
    );
}

function syncKnowledgeDropdownOptionsUiV55(
    modal
) {
    const section =
        modal?.querySelector(
            '#kb-field-create-options-section-v55'
        );

    section?.classList.toggle(
        'hidden',
        pendingKnowledgeFieldKind !==
            'select'
    );
}

const ensureKnowledgeFieldCreateModalBeforeDropdownV55 =
    ensureKnowledgeFieldCreateModal;

ensureKnowledgeFieldCreateModal =
    function() {
        ensureKnowledgeFieldCreateModalBeforeDropdownV55();

        injectKnowledgeDropdownFieldUiV55(
            document.getElementById(
                'kb-field-create-modal'
            )
        );
    };

const openKnowledgeFieldCreateModalBeforeDropdownV55 =
    openKnowledgeFieldCreateModal;

openKnowledgeFieldCreateModal =
    function(
        fieldId =
            null
    ) {
        ensureKnowledgeFieldCreateModal();

        const config =
            activeCategorySettingTab
                ? getCategoryConfig(
                    activeCategorySettingTab
                )
                : null;

        const field =
            fieldId &&
            config
                ? config.fields.find(
                    entry =>
                        entry.id ===
                        fieldId
                )
                : null;

        openKnowledgeFieldCreateModalBeforeDropdownV55(
            fieldId
        );

        const modal =
            document.getElementById(
                'kb-field-create-modal'
            );

        const textarea =
            modal?.querySelector(
                '#kb-field-create-options-v55'
            );

        if (
            textarea
        ) {
            textarea.value =
                (
                    field?.options ||
                    []
                ).join(
                    '\n'
                );
        }

        syncKnowledgeDropdownOptionsUiV55(
            modal
        );
    };

const buildKnowledgeFieldInputHtmlBeforeDropdownV55 =
    buildKnowledgeFieldInputHtml;

buildKnowledgeFieldInputHtml =
    function(
        field,
        value =
            '',
        mode =
            'add'
    ) {
        if (
            field?.kind !==
            'select'
        ) {
            return buildKnowledgeFieldInputHtmlBeforeDropdownV55(
                field,
                value,
                mode
            );
        }

        const inputClass =
            mode ===
                'edit'
                ? 'dynamic-edit-field'
                : 'dynamic-add-field';

        const options =
            Array.isArray(
                field.options
            )
                ? field.options
                : [];

        const selected =
            String(
                value ??
                ''
            );

        return `
            <div
                class="modal-section mt-10 kb-item-field"
                data-field-id="${escapeKnowledgeAttr(
                    field.id
                )}"
            >
                <div class="kb-item-field-label-row">
                    <span class="field-label">
                        ${escapeKnowledgeHtml(
                            field.name
                        )}
                    </span>
                </div>

                <div class="kb-item-field-input-row">
                    <div class="kb-item-field-control">
                        <select
                            class="${inputClass} kb-select-field-v55"
                            data-key="${escapeKnowledgeAttr(
                                field.name
                            )}"
                        >
                            <option value="">Choose…</option>

                            ${options.map(
                                option => `
                                    <option
                                        value="${escapeKnowledgeAttr(
                                            option
                                        )}"
                                        ${
                                            option ===
                                                selected
                                                ? 'selected'
                                                : ''
                                        }
                                    >
                                        ${escapeKnowledgeHtml(
                                            option
                                        )}
                                    </option>
                                `
                            ).join('')}
                        </select>
                    </div>
                </div>
            </div>
        `;
    };

const bindKnowledgeItemFieldBehaviorBeforeDropdownV55 =
    bindKnowledgeItemFieldBehavior;

bindKnowledgeItemFieldBehavior =
    function(
        container,
        categoryName,
        mode,
        itemId =
            null
    ) {
        bindKnowledgeItemFieldBehaviorBeforeDropdownV55(
            container,
            categoryName,
            mode,
            itemId
        );

        if (
            mode !==
                'edit' ||
            !itemId
        ) {
            return;
        }

        container
            ?.querySelectorAll(
                '.kb-select-field-v55.dynamic-edit-field'
            )
            .forEach(
                select => {
                    if (
                        select.dataset
                            .dropdownBoundV55 ===
                        'true'
                    ) {
                        return;
                    }

                    select.dataset
                        .dropdownBoundV55 =
                        'true';

                    select.addEventListener(
                        'change',
                        () => {
                            if (
                                !db.phrase_meta[
                                    itemId
                                ]
                                    .custom_fields
                            ) {
                                db.phrase_meta[
                                    itemId
                                ].custom_fields =
                                    {};
                            }

                            db.phrase_meta[
                                itemId
                            ].custom_fields[
                                select.dataset
                                    .key
                            ] =
                                select.value;

                            saveDb();
                        }
                    );
                }
            );
    };


// Replace the remaining native field-delete confirmation with the site's
// normal confirmation modal while this settings feature is being updated.
deleteKnowledgeField =
    async function(
        categoryName,
        fieldId
    ) {
        const config =
            getCategoryConfig(
                categoryName
            );

        const field =
            config.fields.find(
                entry =>
                    entry.id ===
                    fieldId
            );

        if (!field) {
            return;
        }

        const confirmed =
            await showAppConfirm({
                title:
                    `Delete “${field.name}” field?`,
                message:
                    'Existing saved values for this field will also be removed.',
                confirmLabel:
                    'Delete Field'
            });

        if (!confirmed) {
            return;
        }

        config.fields =
            config.fields.filter(
                entry =>
                    entry.id !==
                    fieldId
            );

        Object.values(
            db.phrase_meta ||
            {}
        ).forEach(
            meta => {
                if (
                    meta?.type ===
                        categoryName &&
                    meta.custom_fields &&
                    Object.prototype
                        .hasOwnProperty
                        .call(
                            meta.custom_fields,
                            field.name
                        )
                ) {
                    delete meta
                        .custom_fields[
                            field.name
                        ];
                }
            }
        );

        saveDb();

        renderSettings();
    };


// ------------------------------------------------------------
// PATTERN-BASED KNOWLEDGE BASE SENTENCE BUILDER
// ------------------------------------------------------------

const PATTERN_SLOT_REGEX_V55 =
    /(\{(?:VERB|NOUN|ADJECTIVE|ADJ|ADVERB|ADV|PRONOUN|PRON|PREPOSITION|PREP|V|N|A)\}|\[(?:VERB|NOUN|ADJECTIVE|ADJ|ADVERB|ADV|PRONOUN|PRON|PREPOSITION|PREP|V|N|A)\]|\b(?:VERB|NOUN|ADJECTIVE|ADJ|ADVERB|ADV|PRONOUN|PRON|PREPOSITION|PREP|V|N|A)\b)/g;

function patternSlotTagV55(
    token
) {
    const clean =
        String(
            token ||
            ''
        )
            .replace(
                /[\{\}\[\]]/g,
                ''
            )
            .toUpperCase();

    const map = {
        V:
            'verb',
        VERB:
            'verb',
        N:
            'noun',
        NOUN:
            'noun',
        A:
            'adjective',
        ADJ:
            'adjective',
        ADJECTIVE:
            'adjective',
        ADV:
            'adverb',
        ADVERB:
            'adverb',
        PRON:
            'pronoun',
        PRONOUN:
            'pronoun',
        PREP:
            'preposition',
        PREPOSITION:
            'preposition'
    };

    return map[
        clean
    ] ||
    normalizeKnowledgeTagV55(
        clean
    );
}

function patternTextForItemV55(
    itemId
) {
    const meta =
        db.phrase_meta?.[
            itemId
        ] ||
        {};

    const candidates = [
        itemId,
        ...Object.values(
            meta.custom_fields ||
            {}
        ).map(
            value =>
                String(
                    value ||
                    ''
                )
        )
    ];

    return candidates.find(
        value => {
            PATTERN_SLOT_REGEX_V55.lastIndex =
                0;

            return PATTERN_SLOT_REGEX_V55.test(
                value
            );
        }
    ) ||
    String(
        itemId ||
        ''
    );
}

function parsePatternSlotsV55(
    text
) {
    const slots =
        [];

    PATTERN_SLOT_REGEX_V55.lastIndex =
        0;

    String(
        text ||
        ''
    ).replace(
        PATTERN_SLOT_REGEX_V55,
        token => {
            slots.push({
                token,
                tag:
                    patternSlotTagV55(
                        token
                    )
            });

            return token;
        }
    );

    return slots;
}

function knowledgePatternItemsV55() {
    return (
        db.phrases ||
        []
    )
        .filter(
            itemId => {
                const meta =
                    db.phrase_meta?.[
                        itemId
                    ] ||
                    {};

                const category =
                    normalizeKnowledgeTagV55(
                        meta.type
                    );

                const tags =
                    getKnowledgeItemTagsV55(
                        itemId
                    );

                const text =
                    patternTextForItemV55(
                        itemId
                    );

                const slots =
                    parsePatternSlotsV55(
                        text
                    );

                return (
                    category.includes(
                        'pattern'
                    ) ||
                    tags.includes(
                        'pattern'
                    ) ||
                    slots.length >
                        0
                );
            }
        )
        .filter(
            itemId =>
                parsePatternSlotsV55(
                    patternTextForItemV55(
                        itemId
                    )
                ).length >
                0
        )
        .sort(
            (
                a,
                b
            ) =>
                a.localeCompare(
                    b
                )
        );
}

function itemsForPatternSlotV55(
    tag,
    query =
        '',
    patternId =
        ''
) {
    const parsed =
        parseKnowledgeSearchV55(
            query
        );

    const requiredTags =
        Array.from(
            new Set([
                normalizeKnowledgeTagV55(
                    tag
                ),
                ...parsed.tags
            ])
        ).filter(
            Boolean
        );

    const text =
        parsed.text
            .toLowerCase();

    return (
        db.phrases ||
        []
    )
        .filter(
            itemId =>
                itemId !==
                patternId
        )
        .filter(
            itemId => {
                const tags =
                    getKnowledgeItemTagsV55(
                        itemId
                    );

                if (
                    !requiredTags.every(
                        wanted =>
                            tags.includes(
                                wanted
                            )
                    )
                ) {
                    return false;
                }

                if (
                    !text
                ) {
                    return true;
                }

                const meta =
                    db.phrase_meta?.[
                        itemId
                    ] ||
                    {};

                const haystack =
                    `${itemId} ${Object.values(
                        meta.custom_fields ||
                        {}
                    ).join(' ')}`
                        .toLowerCase();

                return haystack.includes(
                    text
                );
            }
        )
        .slice(
            0,
            36
        );
}

function compilePatternSentenceV55(
    patternText,
    values
) {
    let index =
        0;

    PATTERN_SLOT_REGEX_V55.lastIndex =
        0;

    return String(
        patternText ||
        ''
    ).replace(
        PATTERN_SLOT_REGEX_V55,
        token => {
            const tag =
                patternSlotTagV55(
                    token
                );

            const value =
                values?.[
                    index
                ];

            index +=
                1;

            return value ||
                `[${tag}]`;
        }
    )
        .replace(
            /\s+([,.!?;:])/g,
            '$1'
        )
        .replace(
            /\s{2,}/g,
            ' '
        )
        .trim();
}

renderKnowledgeSentenceBuilderV53 =
    function(
        tab,
        component,
        content
    ) {
        if (
            !Array.isArray(
                component.savedSentences
            )
        ) {
            component.savedSentences =
                [];
        }

        if (
            !Array.isArray(
                component.slotValuesV55
            )
        ) {
            component.slotValuesV55 =
                [];
        }

        const patterns =
            knowledgePatternItemsV55();

        if (
            !patterns.length
        ) {
            content.innerHTML = `
                <div class="custom-collection-header">
                    <div>
                        <h2>${escapeCustomHtml(
                            component.title ||
                            'Sentence Builder'
                        )}</h2>
                        <small>
                            Pattern-based Knowledge Base sentence builder
                        </small>
                    </div>
                </div>

                <div class="feature-empty-state sentence-pattern-empty-v55">
                    <i class="ph ph-brackets-curly"></i>
                    <strong>No sentence patterns yet</strong>
                    <span>
                        Add a Knowledge Base category such as “Patterns”, then create items containing placeholders like V, N, or A. Tag your vocabulary #verb, #noun, #adjective, or use a dropdown field such as Part of Speech.
                    </span>
                </div>
            `;

            return;
        }

        if (
            !patterns.includes(
                component.patternIdV55
            )
        ) {
            component.patternIdV55 =
                patterns[0];

            component.slotValuesV55 =
                [];
        }

        const patternId =
            component
                .patternIdV55;

        const patternText =
            patternTextForItemV55(
                patternId
            );

        const slots =
            parsePatternSlotsV55(
                patternText
            );

        component.slotValuesV55 =
            Array.from(
                {
                    length:
                        slots.length
                },
                (
                    _,
                    index
                ) =>
                    component
                        .slotValuesV55[
                            index
                        ] ||
                    ''
            );

        const sentence =
            compilePatternSentenceV55(
                patternText,
                component
                    .slotValuesV55
            );

        content.innerHTML = `
            <div class="custom-collection-header">
                <div>
                    <h2>${escapeCustomHtml(
                        component.title ||
                        'Sentence Builder'
                    )}</h2>

                    <small>
                        Choose a pattern, then fill its tagged word slots.
                    </small>
                </div>
            </div>

            <div class="sentence-pattern-picker-v55">
                <label>
                    <span>Pattern</span>
                    <select class="sentence-pattern-select-v55">
                        ${patterns.map(
                            id => `
                                <option
                                    value="${escapeKnowledgeAttr(
                                        id
                                    )}"
                                    ${
                                        id ===
                                            patternId
                                            ? 'selected'
                                            : ''
                                    }
                                >
                                    ${escapeKnowledgeHtml(
                                        id
                                    )}
                                </option>
                            `
                        ).join('')}
                    </select>
                </label>

                <div class="sentence-pattern-template-v55">
                    ${escapeKnowledgeHtml(
                        patternText
                    )}
                </div>
            </div>

            <div class="sentence-pattern-slots-v55">
                ${slots.map(
                    (
                        slot,
                        index
                    ) => `
                        <section
                            class="sentence-pattern-slot-v55"
                            data-pattern-slot-index-v55="${index}"
                        >
                            <div class="sentence-pattern-slot-heading-v55">
                                <span class="sentence-pattern-slot-letter-v55">
                                    ${escapeKnowledgeHtml(
                                        slot.token
                                            .replace(
                                                /[\{\}\[\]]/g,
                                                ''
                                            )
                                    )}
                                </span>

                                <div>
                                    <strong>
                                        ${escapeKnowledgeHtml(
                                            slot.tag
                                                .charAt(
                                                    0
                                                )
                                                .toUpperCase() +
                                            slot.tag
                                                .slice(
                                                    1
                                                )
                                        )}
                                    </strong>

                                    <small>
                                        #${escapeKnowledgeHtml(
                                            slot.tag
                                        )}
                                    </small>
                                </div>

                                ${
                                    component
                                        .slotValuesV55[
                                            index
                                        ]
                                        ? `
                                            <button
                                                type="button"
                                                class="small-icon-btn sentence-pattern-clear-slot-v55"
                                                title="Clear slot"
                                            >
                                                <i class="ph ph-x"></i>
                                            </button>
                                        `
                                        : ''
                                }
                            </div>

                            <div class="sentence-pattern-slot-value-v55">
                                ${
                                    component
                                        .slotValuesV55[
                                            index
                                        ]
                                        ? escapeKnowledgeHtml(
                                            component
                                                .slotValuesV55[
                                                    index
                                                ]
                                        )
                                        : `Choose a ${escapeKnowledgeHtml(
                                            slot.tag
                                        )}`
                                }
                            </div>

                            <div class="sentence-pattern-search-v55">
                                <i class="ph ph-magnifying-glass"></i>
                                <input
                                    type="text"
                                    placeholder="Search #${escapeKnowledgeAttr(
                                        slot.tag
                                    )}…"
                                >
                            </div>

                            <div class="sentence-pattern-results-v55"></div>
                        </section>
                    `
                ).join('')}
            </div>

            <div class="sentence-pattern-output-v55">
                <span>Sentence</span>
                <strong class="sentence-pattern-output-text-v55">
                    ${escapeKnowledgeHtml(
                        sentence
                    )}
                </strong>

                <button
                    type="button"
                    class="icon-btn sentence-pattern-save-v55"
                >
                    Save Sentence
                </button>
            </div>

            <div class="sentence-builder-saved-wrap-v53">
                <div class="custom-collection-header">
                    <h3>Saved Sentences</h3>
                </div>

                <div class="sentence-builder-saved-v53">
                    ${
                        component
                            .savedSentences
                            .length
                            ? component
                                .savedSentences
                                .map(
                                    item => `
                                        <article
                                            class="sentence-builder-saved-item-v53"
                                            data-saved-pattern-sentence-v55="${escapeKnowledgeAttr(
                                                item.id
                                            )}"
                                        >
                                            <span>
                                                ${escapeKnowledgeHtml(
                                                    item.text
                                                )}
                                            </span>

                                            <button
                                                type="button"
                                                class="small-icon-btn sentence-pattern-remove-saved-v55"
                                                title="Remove"
                                            >
                                                <i class="ph ph-x"></i>
                                            </button>
                                        </article>
                                    `
                                )
                                .join('')
                            : `
                                <div class="sentence-builder-empty-saved-v53">
                                    Saved sentences will appear here.
                                </div>
                            `
                    }
                </div>
            </div>
        `;

        const rerender =
            () => {
                saveDb();

                renderCustomTabView(
                    tab.id
                );
            };

        content
            .querySelector(
                '.sentence-pattern-select-v55'
            )
            ?.addEventListener(
                'change',
                event => {
                    component.patternIdV55 =
                        event.target
                            .value;

                    component.slotValuesV55 =
                        [];

                    rerender();
                }
            );

        content
            .querySelectorAll(
                '[data-pattern-slot-index-v55]'
            )
            .forEach(
                section => {
                    const index =
                        Number(
                            section.dataset
                                .patternSlotIndexV55
                        );

                    const slot =
                        slots[
                            index
                        ];

                    const search =
                        section.querySelector(
                            '.sentence-pattern-search-v55 input'
                        );

                    const results =
                        section.querySelector(
                            '.sentence-pattern-results-v55'
                        );

                    const renderResults =
                        () => {
                            const items =
                                itemsForPatternSlotV55(
                                    slot.tag,
                                    search.value,
                                    patternId
                                );

                            results.innerHTML =
                                items.length
                                    ? items.map(
                                        itemId => `
                                            <button
                                                type="button"
                                                data-pattern-choice-v55="${escapeKnowledgeAttr(
                                                    itemId
                                                )}"
                                            >
                                                <span>
                                                    ${escapeKnowledgeHtml(
                                                        itemId
                                                    )}
                                                </span>

                                                <small>
                                                    ${getKnowledgeItemTagsV55(
                                                        itemId
                                                    )
                                                        .filter(
                                                            tag =>
                                                                tag !==
                                                                normalizeKnowledgeTagV55(
                                                                    db
                                                                        .phrase_meta?.[
                                                                            itemId
                                                                        ]?.type
                                                                )
                                                        )
                                                        .slice(
                                                            0,
                                                            3
                                                        )
                                                        .map(
                                                            tag =>
                                                                `#${escapeKnowledgeHtml(
                                                                    tag
                                                                )}`
                                                        )
                                                        .join(
                                                            ' '
                                                        )}
                                                </small>
                                            </button>
                                        `
                                    ).join('')
                                    : `
                                        <div class="sentence-pattern-no-results-v55">
                                            No #${escapeKnowledgeHtml(
                                                slot.tag
                                            )} items match.
                                        </div>
                                    `;

                            results
                                .querySelectorAll(
                                    '[data-pattern-choice-v55]'
                                )
                                .forEach(
                                    button => {
                                        button.addEventListener(
                                            'click',
                                            () => {
                                                component
                                                    .slotValuesV55[
                                                        index
                                                    ] =
                                                    button.dataset
                                                        .patternChoiceV55;

                                                rerender();
                                            }
                                        );
                                    }
                                );
                        };

                    search.addEventListener(
                        'input',
                        renderResults
                    );

                    section
                        .querySelector(
                            '.sentence-pattern-clear-slot-v55'
                        )
                        ?.addEventListener(
                            'click',
                            () => {
                                component
                                    .slotValuesV55[
                                        index
                                    ] =
                                    '';

                                rerender();
                            }
                        );

                    renderResults();
                }
            );

        content
            .querySelector(
                '.sentence-pattern-save-v55'
            )
            ?.addEventListener(
                'click',
                () => {
                    const complete =
                        slots.every(
                            (
                                _,
                                index
                            ) =>
                                !!component
                                    .slotValuesV55[
                                        index
                                    ]
                        );

                    if (!complete) {
                        showFeatureToast(
                            'Fill every pattern slot first.'
                        );

                        return;
                    }

                    component
                        .savedSentences
                        .unshift({
                            id:
                                customId(
                                    'sentence'
                                ),
                            text:
                                compilePatternSentenceV55(
                                    patternText,
                                    component
                                        .slotValuesV55
                                ),
                            patternId,
                            createdAt:
                                new Date()
                                    .toISOString()
                        });

                    rerender();
                }
            );

        content
            .querySelectorAll(
                '[data-saved-pattern-sentence-v55]'
            )
            .forEach(
                row => {
                    row
                        .querySelector(
                            '.sentence-pattern-remove-saved-v55'
                        )
                        ?.addEventListener(
                            'click',
                            () => {
                                const id =
                                    row.dataset
                                        .savedPatternSentenceV55;

                                component.savedSentences =
                                    component
                                        .savedSentences
                                        .filter(
                                            item =>
                                                item.id !==
                                                id
                                        );

                                rerender();
                            }
                        );
                }
            );
    };


// ------------------------------------------------------------
// Keep newly-created custom tabs at the very bottom after every render.
// ------------------------------------------------------------

const renderCustomTabNavigationBeforeBottomV55 =
    renderCustomTabNavigation;

renderCustomTabNavigation =
    function() {
        ensureNewCustomTabsAtBottomV55();

        renderCustomTabNavigationBeforeBottomV55();

        requestAnimationFrame(
            () => {
                ensureNewCustomTabsAtBottomV55();

                applyUnifiedLogNavOrderV52?.();
            }
        );
    };



// ============================================================


// ============================================================
// V382 — GLOBAL CURSOR / COMPANION DELETION AUTHORITY
// A deleted accessory is deleted app-wide, not only from one picker instance.
// ============================================================
(() => {
    'use strict';
    if (window.__loggyGlobalAccessoryDeleteV382) return;
    window.__loggyGlobalAccessoryDeleteV382 = true;

    const HIDE_CURSOR_V382 = 'loggy-hidden-cursors-v163';
    const HIDE_COMP_V382 = 'loggy-hidden-companions-v163';
    const readSetV382 = key => {
        try {
            const value = JSON.parse(localStorage.getItem(key) || '[]');
            return new Set(Array.isArray(value) ? value.map(String) : []);
        } catch { return new Set(); }
    };
    const isDeletedV382 = (kind, id) => {
        id = String(id || '');
        if (!id) return false;
        if (kind === 'cursor' && id === 'default') return false;
        if (kind === 'companion' && id === 'none') return false;
        return readSetV382(kind === 'cursor' ? HIDE_CURSOR_V382 : HIDE_COMP_V382).has(id);
    };

    function pruneOptionsV382() {
        const hiddenCursors = readSetV382(HIDE_CURSOR_V382);
        const hiddenCompanions = readSetV382(HIDE_COMP_V382);
        try {
            if (typeof CURSOR_OPTIONS !== 'undefined' && Array.isArray(CURSOR_OPTIONS)) {
                for (let i = CURSOR_OPTIONS.length - 1; i >= 0; i--) {
                    const id = String(CURSOR_OPTIONS[i]?.id || '');
                    if (id && id !== 'default' && hiddenCursors.has(id)) CURSOR_OPTIONS.splice(i, 1);
                }
            }
        } catch {}
        try {
            if (typeof COMPANIONS !== 'undefined' && Array.isArray(COMPANIONS)) {
                for (let i = COMPANIONS.length - 1; i >= 0; i--) {
                    const id = String(COMPANIONS[i]?.id || '');
                    if (id && hiddenCompanions.has(id)) COMPANIONS.splice(i, 1);
                }
            }
        } catch {}
        try {
            if (db?.settings) {
                if (isDeletedV382('cursor', db.settings.cursorStyle)) db.settings.cursorStyle = 'default';
                if (isDeletedV382('companion', db.settings.companion)) db.settings.companion = 'none';
            }
        } catch {}
    }

    pruneOptionsV382();

    // Make every normal picker render start from the global deletion state.
    try {
        const before = renderCursorPicker;
        renderCursorPicker = function() { pruneOptionsV382(); return before.apply(this, arguments); };
    } catch {}
    try {
        const before = renderCompanionPicker;
        renderCompanionPicker = function() { pruneOptionsV382(); return before.apply(this, arguments); };
    } catch {}
    try {
        const before = applyCursorChoice;
        applyCursorChoice = function() { pruneOptionsV382(); return before.apply(this, arguments); };
    } catch {}
    try {
        const before = renderCompanion;
        renderCompanion = function() { pruneOptionsV382(); return before.apply(this, arguments); };
    } catch {}

    // Theme application must never reactivate an accessory the user deleted.
    try {
        const before = applyTheme;
        applyTheme = async function(themeValue, opts = {}) {
            pruneOptionsV382();
            const result = await before.apply(this, arguments);
            pruneOptionsV382();
            try { applyCursorChoice?.(); } catch {}
            try { renderCursorPicker?.(); } catch {}
            try { renderCompanion?.(); } catch {}
            try { renderCompanionPicker?.(); } catch {}
            try { await saveDb?.(); } catch {}
            return result;
        };
    } catch {}

    window.addEventListener('storage', event => {
        if (![HIDE_CURSOR_V382, HIDE_COMP_V382].includes(event.key)) return;
        pruneOptionsV382();
        try { renderCursorPicker?.(); } catch {}
        try { renderCompanionPicker?.(); } catch {}
        try { applyCursorChoice?.(); } catch {}
        try { renderCompanion?.(); } catch {}
        try { saveDb?.(); } catch {}
    });
})();

// ============================================================================
// V418 — SHARED THEME AUDIO / LEGACY COPY AUTHORITY
// A shared saved theme is authoritative over any same-ID themeCopiesV30 mirror.
// This prevents an older copy from priming the previous intro song or being
// republished back over a freshly saved shared theme.
// ============================================================================
(() => {
    'use strict';
    if (window.__loggySharedThemeAudioAuthorityV418) return;
    window.__loggySharedThemeAudioAuthorityV418 = true;

    const SHARED_KEY_V418 = 'loggy-shared-themes-v40';
    const cloneV418 = value => {
        try { return structuredClone(value); } catch {}
        try { return JSON.parse(JSON.stringify(value)); } catch {}
        return value && typeof value === 'object' ? { ...value } : value;
    };
    const readSharedV418 = () => {
        try {
            const rows = JSON.parse(localStorage.getItem(SHARED_KEY_V418) || '[]');
            return Array.isArray(rows) ? rows : [];
        } catch { return []; }
    };
    const sharedRowV418 = id => readSharedV418().find(row => String(row?.id || '') === String(id || '')) || null;

    function repairSharedMirrorsV418() {
        let copies = [];
        try { copies = ensureThemeCopiesV30?.() || []; } catch {}
        if (!Array.isArray(copies)) return;
        const shared = readSharedV418();
        if (!shared.length) return;
        const byId = new Map(shared.filter(row => row?.id && row?.theme).map(row => [String(row.id), row]));
        copies.forEach(copy => {
            const row = byId.get(String(copy?.id || ''));
            if (!row) return;
            copy.name = row.name || row.theme?.name || copy.name || 'Shared Theme';
            copy.sourceThemeId = row.sourceThemeId || '';
            copy.theme = cloneV418(row.theme);
            copy.sharedV40 = true;
            copy.createdAt = row.updatedAt || copy.createdAt || new Date().toISOString();
        });
    }

    // Audio priming must read the same saved shared record that Edit Theme uses.
    try {
        const oldThemeDataV418 = themeDataForThemeIdV41;
        themeDataForThemeIdV41 = function(themeId) {
            const row = sharedRowV418(themeId);
            if (row?.theme) return row.theme;
            return oldThemeDataV418.apply(this, arguments);
        };
    } catch {}

    // The historical sync only replaced an existing mirror when sharedV40 was
    // already true. Repair every same-ID mirror regardless of that old flag.
    try {
        const oldSyncV418 = syncSharedThemesIntoLogV40;
        syncSharedThemesIntoLogV40 = function() {
            const result = oldSyncV418.apply(this, arguments);
            repairSharedMirrorsV418();
            return result;
        };
    } catch {}

    // Before the legacy publisher runs, canonicalize/mark every same-ID copy as
    // shared so publishCurrentLogThemesV40 cannot republish stale audio over it.
    try {
        const oldPublishCurrentV418 = publishCurrentLogThemesV40;
        publishCurrentLogThemesV40 = function() {
            repairSharedMirrorsV418();
            return oldPublishCurrentV418.apply(this, arguments);
        };
    } catch {}

    // Keep mirrors corrected when another frame saves/updates the shared library.
    window.addEventListener('storage', event => {
        if (event.key === SHARED_KEY_V418) repairSharedMirrorsV418();
    });
    try { repairSharedMirrorsV418(); } catch {}
})();

// ============================================================================
// V443 — LOG INTRO COMPATIBILITY ADAPTER
// All historical applied-theme audio entry points route to the single clean
// V443 owner in template.js. Ordinary visual-apply calls do not restart audio.
// ============================================================================
(() => {
  'use strict';
  const owner = () => window.__loggyLogIntroAudioV443 || null;
  const adapter = function(_theme = {}, options = {}) {
    const audio = owner();
    if (!audio) return null;
    if (options?.forceRestart === true || options?.__loggyCoreRestartV428 === true) {
      return audio.playTheme?.(audio.currentThemeId?.() || '', {
        reason:'legacy-explicit-replay-v443',
        force:true
      }) || null;
    }
    return audio.audio || null;
  };
  adapter.__loggyV443Adapter = true;

  try { playCustomThemeIntroAudioV2 = adapter; } catch {}
  try { window.playCustomThemeIntroAudioV2 = adapter; } catch {}

  window.__loggyStopAllIntroAudioV420 = () => owner()?.stopAll?.();
  window.__loggyRestartCurrentIntroV425 = options =>
    owner()?.playTheme?.(owner()?.currentThemeId?.() || '', { ...(options || {}), force:true }) || null;
  window.__loggyReplaySavedIntroV423 = () =>
    owner()?.playTheme?.(owner()?.currentThemeId?.() || '', { reason:'compat-replay-v443', force:true }) || null;
})();
