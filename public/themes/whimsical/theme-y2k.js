/* ============================================================
   SPANISH
   Scoped visual theme. No global layout/cursor/companion overrides.
   ============================================================ */

body.theme-spanish {
    --theme-ink: #4a2a22;
    --theme-paper: #fff6df;
    --theme-accent: #d94f34;
    --theme-accent-2: #f0b84f;
    --theme-gold: #b65f36;

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
        linear-gradient(145deg, #ffe0b5, #fff1cf) !important;

    background-attachment: fixed !important;
    color: var(--theme-ink);
}

#spanish-background {
    position: fixed;
    inset: 0;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    pointer-events: none;
    user-select: none;
    z-index: 0;
}

#spanish-background .theme-spanish-haze {
    position: absolute;
    inset: 0;
    background:
        radial-gradient(circle at 50% 14%, color-mix(in srgb, var(--theme-paper) 42%, transparent), transparent 34%),
        radial-gradient(circle at 15% 55%, color-mix(in srgb, var(--theme-accent) 10%, transparent), transparent 30%),
        radial-gradient(circle at 85% 58%, color-mix(in srgb, var(--theme-accent-2) 10%, transparent), transparent 30%);
}

#spanish-background .theme-spanish-pattern {
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at 20px 20px, rgba(240,184,79,.16) 0 4px, transparent 5px), radial-gradient(circle at 60px 60px, rgba(217,79,52,.12) 0 5px, transparent 6px);
    background-size: 80px 80px;
    opacity: .65;
}

#spanish-background .theme-spanish-horizon {
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

#spanish-background .theme-spanish-item {
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
        themeSpanishFloat
        7.8s
        ease-in-out
        var(--item-delay)
        infinite;
    transform-origin: center center;
    will-change: transform;
    pointer-events: none;
}

#spanish-background .theme-spanish-item svg {
    width: 100%;
    height: 100%;
    display: block;
    overflow: visible;
    pointer-events: none;
}

#spanish-background .theme-spanish-item:nth-of-type(3n) {
    width: 105px;
    height: 105px;
    opacity: .24;
}

#spanish-background .theme-spanish-item:nth-of-type(4n) {
    animation-duration: 9.4s;
}

@keyframes themeSpanishFloat {
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

#spanish-background .theme-spanish-react {
    opacity: .56;
    filter:
        drop-shadow(0 10px 16px rgba(0,0,0,.20))
        drop-shadow(0 0 14px color-mix(in srgb, var(--theme-accent) 34%, transparent));
    animation:
        themeSpanishReact
        .5s
        ease-out !important;
}

@keyframes themeSpanishReact {
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
body.theme-spanish .day-box,
body.theme-spanish .day-picker-box,
body.theme-spanish .icon-btn,
body.theme-spanish .small-icon-btn,
body.theme-spanish input,
body.theme-spanish textarea,
body.theme-spanish select,
body.theme-spanish .notes-editable,
body.theme-spanish .phrase-card,
body.theme-spanish .chip,
body.theme-spanish .toolbox-item,
body.theme-spanish .resource-card,
body.theme-spanish .polaroid-card,
body.theme-spanish .filter-tab,
body.theme-spanish .day-target-box,
body.theme-spanish .flashcard,
body.theme-spanish .flashcard-mode-card,
body.theme-spanish .day-badge,
body.theme-spanish .video-placeholder,
body.theme-spanish .theme-picker-card,
body.theme-spanish .note-audio-row,
body.theme-spanish .modal-box {
    background-color: color-mix(in srgb, var(--theme-paper) 91%, transparent);
    color: var(--theme-ink);
    border-color: color-mix(in srgb, var(--theme-accent) 28%, transparent);
}

body.theme-spanish input::placeholder,
body.theme-spanish textarea::placeholder,
body.theme-spanish .notes-editable:empty::before {
    color: color-mix(in srgb, var(--theme-ink) 43%, transparent);
}

body.theme-spanish .icon-btn:hover,
body.theme-spanish .small-icon-btn:hover,
body.theme-spanish .filter-tab:hover {
    background: color-mix(in srgb, var(--theme-accent) 14%, var(--theme-paper));
    color: var(--theme-ink);
}

body.theme-spanish .chip:hover,
body.theme-spanish .phrase-card:hover,
body.theme-spanish .filter-tab.active,
body.theme-spanish .day-picker-box.selected {
    background:
        linear-gradient(
            135deg,
            color-mix(in srgb, var(--theme-accent) 90%, var(--theme-paper)),
            color-mix(in srgb, var(--theme-accent-2) 76%, var(--theme-paper))
        );
    color: var(--theme-paper);
    border-color: color-mix(in srgb, var(--theme-accent) 58%, transparent);
}

body.theme-spanish .progress-bar-track {
    background: color-mix(in srgb, var(--theme-accent) 12%, transparent);
}

body.theme-spanish .progress-bar-fill {
    background:
        linear-gradient(
            90deg,
            var(--theme-accent),
            var(--theme-gold),
            var(--theme-accent-2)
        );
}

/* Safe stacking: no broad direct-child wildcard selectors. */
body.theme-spanish #spanish-background {
    z-index: 0;
}

body.theme-spanish .view {
    position: relative;
    z-index: 2;
}

body.theme-spanish .side-nav {
    position: relative;
    z-index: 3;
}

body.theme-spanish header,
body.theme-spanish .log-header-container {
    position: relative;
    z-index: 4;
}

body.theme-spanish .modal,
body.theme-spanish .modal-overlay,
body.theme-spanish .overlay {
    z-index: 10;
}

@media (max-width: 700px) {
    #spanish-background .theme-spanish-item {
        width: 94px;
        height: 94px;
        opacity: .21;
    }

    #spanish-background .theme-spanish-item:nth-of-type(2n) {
        opacity: .14;
    }
}

@media (prefers-reduced-motion: reduce) {
    #spanish-background * {
        animation: none !important;
    }
}
