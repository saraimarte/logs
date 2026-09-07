/* ============================================================
   KOREAN
   Scoped visual theme. No global layout/cursor/companion overrides.
   ============================================================ */

body.theme-korean {
    --theme-ink: #26354f;
    --theme-paper: #fffaf7;
    --theme-accent: #d95d73;
    --theme-accent-2: #5276ad;
    --theme-gold: #d7b56d;

    --black: var(--theme-ink);
    --white: var(--theme-paper);
    --bg-overlay: transparent;

    --thick-border: 2px solid color-mix(in srgb, var(--theme-accent) 44%, transparent);
    --thin-border: 1px solid color-mix(in srgb, var(--theme-accent) 30%, transparent);
    --dashed-border: 1px dashed color-mix(in srgb, var(--theme-accent) 30%, transparent);
    --dotted-border: 1px dotted color-mix(in srgb, var(--theme-accent) 30%, transparent);

    --track-bg: color-mix(in srgb, var(--theme-accent) 12%, transparent);
    --muted-text: color-mix(in srgb, var(--theme-ink) 58%, transparent);

    background:
        radial-gradient(circle at 50% 4%, color-mix(in srgb, var(--theme-accent-2) 16%, transparent), transparent 34%),
        radial-gradient(circle at 12% 80%, color-mix(in srgb, var(--theme-accent) 12%, transparent), transparent 30%),
        linear-gradient(145deg, #f6e7ed, #e9eff9) !important;

    background-attachment: fixed !important;
    color: var(--theme-ink);
}

#korean-background {
    position: fixed;
    inset: 0;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    pointer-events: none;
    user-select: none;
    z-index: 0;
}

#korean-background .theme-korean-haze {
    position: absolute;
    inset: 0;
    background:
        radial-gradient(circle at 50% 14%, color-mix(in srgb, var(--theme-paper) 42%, transparent), transparent 34%),
        radial-gradient(circle at 15% 55%, color-mix(in srgb, var(--theme-accent) 10%, transparent), transparent 30%),
        radial-gradient(circle at 85% 58%, color-mix(in srgb, var(--theme-accent-2) 10%, transparent), transparent 30%);
}

#korean-background .theme-korean-pattern {
    position: absolute;
    inset: 0;
    background: repeating-linear-gradient(0deg, rgba(82,118,173,.05) 0 1px, transparent 1px 34px), repeating-linear-gradient(90deg, rgba(217,93,115,.05) 0 1px, transparent 1px 34px);
    background-size: 80px 80px;
    opacity: .65;
}

#korean-background .theme-korean-horizon {
    position: absolute;
    left: -7vw;
    right: -7vw;
    bottom: -8vh;
    height: 29vh;
    background:
        linear-gradient(180deg, transparent, color-mix(in srgb, var(--theme-accent) 8%, transparent) 35%, color-mix(in srgb, var(--theme-ink) 12%, transparent));
    clip-path: polygon(0 35%, 100% 12%, 100% 100%, 0 100%);
    opacity: .65;
}

#korean-background .theme-korean-item {
    position: absolute;
    width: 125px;
    height: 125px;
    color: color-mix(in srgb, var(--theme-ink) 82%, var(--theme-accent));
    opacity: .30;
    transform:
        translate3d(-50%, -50%, 0)
        rotate(var(--item-rotate))
        scale(var(--item-scale));
    filter:
        drop-shadow(0 8px 13px rgba(0,0,0,.16))
        drop-shadow(0 0 9px color-mix(in srgb, var(--theme-accent) 16%, transparent));
    animation:
        themeKoreanFloat
        7.8s
        ease-in-out
        var(--item-delay)
        infinite;
    transform-origin: center center;
    will-change: transform;
    pointer-events: none;
}

#korean-background .theme-korean-item svg {
    width: 100%;
    height: 100%;
    display: block;
    overflow: visible;
    pointer-events: none;
}

#korean-background .theme-korean-item:nth-of-type(3n) {
    width: 105px;
    height: 105px;
    opacity: .24;
}

#korean-background .theme-korean-item:nth-of-type(4n) {
    animation-duration: 9.4s;
}

@keyframes themeKoreanFloat {
    0%,100% {
        transform:
            translate3d(-50%, -50%, 0)
            translate3d(0,0,0)
            rotate(var(--item-rotate))
            scale(var(--item-scale));
    }
    50% {
        transform:
            translate3d(-50%, -50%, 0)
            translate3d(var(--item-x), var(--item-y), 0)
            rotate(calc(var(--item-rotate) + 2deg))
            scale(var(--item-scale));
    }
}

#korean-background .theme-korean-react {
    opacity: .56;
    filter:
        drop-shadow(0 10px 16px rgba(0,0,0,.20))
        drop-shadow(0 0 14px color-mix(in srgb, var(--theme-accent) 34%, transparent));
    animation:
        themeKoreanReact
        .5s
        ease-out !important;
}

@keyframes themeKoreanReact {
    0% {
        transform:
            translate3d(-50%, -50%, 0)
            rotate(var(--item-rotate))
            scale(var(--item-scale));
    }
    45% {
        transform:
            translate3d(-50%, -50%, 0)
            translate3d(0,-10px,0)
            rotate(calc(var(--item-rotate) + 7deg))
            scale(calc(var(--item-scale) * 1.09));
    }
    100% {
        transform:
            translate3d(-50%, -50%, 0)
            rotate(var(--item-rotate))
            scale(var(--item-scale));
    }
}

/* UI adaptation only. Sizes and positions remain template-owned. */
body.theme-korean .day-box,
body.theme-korean .day-picker-box,
body.theme-korean .icon-btn,
body.theme-korean .small-icon-btn,
body.theme-korean input,
body.theme-korean textarea,
body.theme-korean select,
body.theme-korean .notes-editable,
body.theme-korean .phrase-card,
body.theme-korean .chip,
body.theme-korean .toolbox-item,
body.theme-korean .resource-card,
body.theme-korean .polaroid-card,
body.theme-korean .filter-tab,
body.theme-korean .day-target-box,
body.theme-korean .flashcard,
body.theme-korean .flashcard-mode-card,
body.theme-korean .day-badge,
body.theme-korean .video-placeholder,
body.theme-korean .theme-picker-card,
body.theme-korean .note-audio-row,
body.theme-korean .modal-box {
    background-color: color-mix(in srgb, var(--theme-paper) 91%, transparent);
    color: var(--theme-ink);
    border-color: color-mix(in srgb, var(--theme-accent) 28%, transparent);
}

body.theme-korean input::placeholder,
body.theme-korean textarea::placeholder,
body.theme-korean .notes-editable:empty::before {
    color: color-mix(in srgb, var(--theme-ink) 43%, transparent);
}

body.theme-korean .icon-btn:hover,
body.theme-korean .small-icon-btn:hover,
body.theme-korean .filter-tab:hover {
    background: color-mix(in srgb, var(--theme-accent) 14%, var(--theme-paper));
    color: var(--theme-ink);
}

body.theme-korean .chip:hover,
body.theme-korean .phrase-card:hover,
body.theme-korean .filter-tab.active,
body.theme-korean .day-picker-box.selected {
    background:
        linear-gradient(
            135deg,
            color-mix(in srgb, var(--theme-accent) 90%, var(--theme-paper)),
            color-mix(in srgb, var(--theme-accent-2) 76%, var(--theme-paper))
        );
    color: var(--theme-paper);
    border-color: color-mix(in srgb, var(--theme-accent) 58%, transparent);
}

body.theme-korean .progress-bar-track {
    background: color-mix(in srgb, var(--theme-accent) 12%, transparent);
}

body.theme-korean .progress-bar-fill {
    background:
        linear-gradient(
            90deg,
            var(--theme-accent),
            var(--theme-gold),
            var(--theme-accent-2)
        );
}

/* Safe stacking: no broad direct-child wildcard selectors. */
body.theme-korean #korean-background {
    z-index: 0;
}

body.theme-korean .view {
    position: relative;
    z-index: 2;
}

body.theme-korean .side-nav {
    position: relative;
    z-index: 3;
}

body.theme-korean header,
body.theme-korean .log-header-container {
    position: relative;
    z-index: 4;
}

body.theme-korean .modal,
body.theme-korean .modal-overlay,
body.theme-korean .overlay {
    z-index: 10;
}

@media (max-width: 700px) {
    #korean-background .theme-korean-item {
        width: 94px;
        height: 94px;
        opacity: .21;
    }

    #korean-background .theme-korean-item:nth-of-type(2n) {
        opacity: .14;
    }
}

@media (prefers-reduced-motion: reduce) {
    #korean-background * {
        animation: none !important;
    }
}
