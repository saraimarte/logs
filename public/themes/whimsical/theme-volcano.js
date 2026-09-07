/* ============================================================
   RAINFOREST
   Scoped visual theme. No global layout/cursor/companion overrides.
   ============================================================ */

body.theme-rainforest {
    --theme-ink: #eaf7e7;
    --theme-paper: #153022;
    --theme-accent: #63b36e;
    --theme-accent-2: #2f8465;
    --theme-gold: #d6b65d;

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
        linear-gradient(145deg, #102a1d, #1e4a31) !important;

    background-attachment: fixed !important;
    color: var(--theme-ink);
}

#rainforest-background {
    position: fixed;
    inset: 0;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    pointer-events: none;
    user-select: none;
    z-index: 0;
}

#rainforest-background .theme-rainforest-haze {
    position: absolute;
    inset: 0;
    background:
        radial-gradient(circle at 50% 14%, color-mix(in srgb, var(--theme-paper) 42%, transparent), transparent 34%),
        radial-gradient(circle at 15% 55%, color-mix(in srgb, var(--theme-accent) 10%, transparent), transparent 30%),
        radial-gradient(circle at 85% 58%, color-mix(in srgb, var(--theme-accent-2) 10%, transparent), transparent 30%);
}

#rainforest-background .theme-rainforest-pattern {
    position: absolute;
    inset: 0;
    background: repeating-linear-gradient(120deg, rgba(99,179,110,.06) 0 1px, transparent 1px 28px);
    background-size: 80px 80px;
    opacity: .65;
}

#rainforest-background .theme-rainforest-horizon {
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

#rainforest-background .theme-rainforest-item {
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
        themeRainforestFloat
        7.8s
        ease-in-out
        var(--item-delay)
        infinite;
    transform-origin: center center;
    will-change: transform;
    pointer-events: none;
}

#rainforest-background .theme-rainforest-item svg {
    width: 100%;
    height: 100%;
    display: block;
    overflow: visible;
    pointer-events: none;
}

#rainforest-background .theme-rainforest-item:nth-of-type(3n) {
    width: 105px;
    height: 105px;
    opacity: .24;
}

#rainforest-background .theme-rainforest-item:nth-of-type(4n) {
    animation-duration: 9.4s;
}

@keyframes themeRainforestFloat {
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

#rainforest-background .theme-rainforest-react {
    opacity: .56;
    filter:
        drop-shadow(0 10px 16px rgba(0,0,0,.20))
        drop-shadow(0 0 14px color-mix(in srgb, var(--theme-accent) 34%, transparent));
    animation:
        themeRainforestReact
        .5s
        ease-out !important;
}

@keyframes themeRainforestReact {
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
body.theme-rainforest .day-box,
body.theme-rainforest .day-picker-box,
body.theme-rainforest .icon-btn,
body.theme-rainforest .small-icon-btn,
body.theme-rainforest input,
body.theme-rainforest textarea,
body.theme-rainforest select,
body.theme-rainforest .notes-editable,
body.theme-rainforest .phrase-card,
body.theme-rainforest .chip,
body.theme-rainforest .toolbox-item,
body.theme-rainforest .resource-card,
body.theme-rainforest .polaroid-card,
body.theme-rainforest .filter-tab,
body.theme-rainforest .day-target-box,
body.theme-rainforest .flashcard,
body.theme-rainforest .flashcard-mode-card,
body.theme-rainforest .day-badge,
body.theme-rainforest .video-placeholder,
body.theme-rainforest .theme-picker-card,
body.theme-rainforest .note-audio-row,
body.theme-rainforest .modal-box {
    background-color: color-mix(in srgb, var(--theme-paper) 91%, transparent);
    color: var(--theme-ink);
    border-color: color-mix(in srgb, var(--theme-accent) 28%, transparent);
}

body.theme-rainforest input::placeholder,
body.theme-rainforest textarea::placeholder,
body.theme-rainforest .notes-editable:empty::before {
    color: color-mix(in srgb, var(--theme-ink) 43%, transparent);
}

body.theme-rainforest .icon-btn:hover,
body.theme-rainforest .small-icon-btn:hover,
body.theme-rainforest .filter-tab:hover {
    background: color-mix(in srgb, var(--theme-accent) 14%, var(--theme-paper));
    color: var(--theme-ink);
}

body.theme-rainforest .chip:hover,
body.theme-rainforest .phrase-card:hover,
body.theme-rainforest .filter-tab.active,
body.theme-rainforest .day-picker-box.selected {
    background:
        linear-gradient(
            135deg,
            color-mix(in srgb, var(--theme-accent) 90%, var(--theme-paper)),
            color-mix(in srgb, var(--theme-accent-2) 76%, var(--theme-paper))
        );
    color: var(--theme-paper);
    border-color: color-mix(in srgb, var(--theme-accent) 58%, transparent);
}

body.theme-rainforest .progress-bar-track {
    background: color-mix(in srgb, var(--theme-accent) 12%, transparent);
}

body.theme-rainforest .progress-bar-fill {
    background:
        linear-gradient(
            90deg,
            var(--theme-accent),
            var(--theme-gold),
            var(--theme-accent-2)
        );
}

/* Safe stacking: no broad direct-child wildcard selectors. */
body.theme-rainforest #rainforest-background {
    z-index: 0;
}

body.theme-rainforest .view {
    position: relative;
    z-index: 2;
}

body.theme-rainforest .side-nav {
    position: relative;
    z-index: 3;
}

body.theme-rainforest header,
body.theme-rainforest .log-header-container {
    position: relative;
    z-index: 4;
}

body.theme-rainforest .modal,
body.theme-rainforest .modal-overlay,
body.theme-rainforest .overlay {
    z-index: 10;
}

@media (max-width: 700px) {
    #rainforest-background .theme-rainforest-item {
        width: 94px;
        height: 94px;
        opacity: .21;
    }

    #rainforest-background .theme-rainforest-item:nth-of-type(2n) {
        opacity: .14;
    }
}

@media (prefers-reduced-motion: reduce) {
    #rainforest-background * {
        animation: none !important;
    }
}
