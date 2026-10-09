/* Loggy Screen Recorder V902
   Starts only from a numbered Daily Log. The destination is frozen at launch,
   so navigation elsewhere in Loggy cannot change where the YouTube link lands. */
(() => {
    'use strict';
    if (window.__loggyScreenRecorderV750) return;
    window.__loggyScreenRecorderV750 = true;
    window.__loggyScreenRecorderV734 = true;
    window.__loggyScreenRecorderV733 = true;
    window.__loggyScreenRecorderV732 = true;
    window.__loggyScreenRecorderV730 = true;
    window.__loggyScreenRecorderV721 = true;
    window.__loggyScreenRecorderV720 = true;
    window.__loggyScreenRecorderV717 = true;
    window.__loggyScreenRecorderV715 = true;
    // Keep the historical flag/API name for compatibility with existing Loggy code.
    window.__loggyScreenRecorderV710 = true;
    if (/\/theme-studio-host(?:$|[/?#])/i.test(location.pathname)) return;

    const q = (selector, root = document) => root?.querySelector?.(selector) || null;
    const qa = (selector, root = document) => Array.from(root?.querySelectorAll?.(selector) || []);
    const esc = value => String(value ?? '').replace(/[&<>"']/g, ch => ({
        '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'
    }[ch]));

    const IS_RECORDER_HOST = /\/loggy-recorder-host\.html$/i.test(location.pathname);
    const CLIENT_SETTINGS_KEY = 'loggy-screen-recorder-client-settings-v710';
    const HOST_STATUS_KEY = 'loggy-screen-recorder-host-status-v710';
    const HOST_WINDOW_NAME = 'loggy-recorder-host-v710';
    const recorderChannel = typeof BroadcastChannel === 'function'
        ? new BroadcastChannel('loggy-screen-recorder-v710')
        : null;
    let recordingLeaveBypassV917 = false;
    let dashboardSavePending = false;
    let suppressAutomaticPreview = false;
    let cameraLifecycleGeneration = 0;
    let lastHostStatusHeartbeatV917 = 0;
    const PAGE_CAMERA_SOURCE_ID_V908 = (() => {
        try {
            const key = 'loggy-recorder-page-camera-source-v908';
            let value = sessionStorage.getItem(key);
            if (!value) {
                value = `page-${Date.now()}-${Math.random().toString(36).slice(2)}`;
                sessionStorage.setItem(key, value);
            }
            return value;
        } catch (_) {
            return `page-${Date.now()}-${Math.random().toString(36).slice(2)}`;
        }
    })();
    let clientSettingsCache = null;

    const SHORTCUT_DEFAULTS = Object.freeze({
        start: 'Shift+.',
        bar: 'Shift+,',
        pause: 'Shift+/',
        mic: 'Ctrl+Alt+M',
        camera: 'Ctrl+Alt+C',
        cameraFullscreen: 'Ctrl+Alt+V',
        screenAudio: 'Ctrl+Alt+A',
        float: 'Ctrl+Alt+F',
        marker: 'Ctrl+Alt+K',
        shortcuts: 'Ctrl+Alt+/'
    });
    const SHORTCUT_LABELS = Object.freeze({
        start: 'Start / Stop Recording',
        bar: 'Show / Hide Recorder Bar',
        pause: 'Pause / Resume Recording',
        mic: 'Microphone On / Off',
        camera: 'Camera On / Off',
        cameraFullscreen: 'Camera Full Screen On / Off',
        screenAudio: 'Screen Audio On / Off',
        float: 'Open Screen Recorder Settings',
        marker: 'Add Marker',
        shortcuts: 'Show Recorder Shortcuts'
    });

    const state = {
        phase: 'idle', // idle | ready | countdown | recording | paused | stopping | preview
        destination: null,
        session: null,
        displayStream: null,
        cameraStream: null,
        micStream: null,
        recorder: null,
        canvas: null,
        ctx: null,
        screenVideo: null,
        cameraVideo: null,
        animationId: 0,
        audioContext: null,
        audioDestination: null,
        screenAudioSource: null,
        screenAudioGain: null,
        micAudioSource: null,
        micAudioGain: null,
        micAnalyser: null,
        micLevelData: null,
        micHighpass: null,
        micLowpass: null,
        micCompressor: null,
        micGateGain: null,
        micStrongGateOpen: false,
        micStrongNoiseFloor: 0.012,
        lastMicMeterAt: 0,
        mixedStream: null,
        chunkQueue: Promise.resolve(),
        chunkIndex: 0,
        startedAt: 0,
        pausedAt: 0,
        pausedTotal: 0,
        // V720 keeps elapsed time as accumulated active recording segments.
        // This makes pause/resume mathematically independent of wall-clock pause time.
        activeElapsedMs: 0,
        segmentStartedAt: 0,
        markers: [],
        controllerWindow: null,
        controllerRoot: null,
        controllerDocument: null,
        timerId: 0,
        youtubeStatus: null,
        deviceInfoReady: false,
        uploadResult: null,
        uiMessage: '',
        uiMessageType: '',
        stopRequested: false,
        settingsOpen: false,
        cameraFullscreenV750: false,
        dockVisibleV750: true,
        localChunks: new Map(),
        uploadedChunkIndexes: new Set(),
        chunkError: null,
        finalizePromise: null,
        stopFallbackTimer: 0,
        detachedControlsWindowV734: null,
        detachedControlsRootV734: null,
        detachedControlsDocumentV734: null,
        sourcePageCameraV908: { sourceId:'', visible:false, hasCamera:false, timestamp:0 }
    };

    function appDb() {
        try { return typeof db !== 'undefined' ? db : null; } catch (_) { return null; }
    }
    function appHobby() {
        try { return String(typeof HOBBY !== 'undefined' ? HOBBY : '').trim(); } catch (_) { return ''; }
    }
    function appCurrentDay() {
        try { return Number(typeof currentDay !== 'undefined' ? currentDay : 0); } catch (_) { return 0; }
    }
    function isNumberedDayVisible() {
        const day = appCurrentDay();
        if (!Number.isInteger(day) || day <= 0) return false;
        const view = q('#log-view');
        const visibleVideoControl = qa('#edit-video-btn,#add-second-video-btn').some(node => {
            try { return node.getClientRects().length > 0; } catch (_) { return false; }
        });
        if (visibleVideoControl) return true;
        return !!view && (
            view.classList.contains('active') ||
            (!view.classList.contains('hidden') && view.getClientRects().length > 0)
        );
    }
    function normalizeClientSettings(value = {}) {
        const incomingShortcuts = { ...(value.shortcuts || {}) };
        const shortcuts = { ...SHORTCUT_DEFAULTS, ...incomingShortcuts };
        // V750 migration: move untouched legacy defaults to the new one-key
        // start/stop flow while preserving shortcuts the user actually customized.
        if (!incomingShortcuts.start || incomingShortcuts.start === 'Ctrl+Alt+R') shortcuts.start = SHORTCUT_DEFAULTS.start;
        if (!incomingShortcuts.bar) shortcuts.bar = SHORTCUT_DEFAULTS.bar;
        if (!incomingShortcuts.pause || incomingShortcuts.pause === 'Ctrl+Alt+P') shortcuts.pause = SHORTCUT_DEFAULTS.pause;
        if (!incomingShortcuts.cameraFullscreen) shortcuts.cameraFullscreen = SHORTCUT_DEFAULTS.cameraFullscreen;
        delete shortcuts.stop;
        const a = { ...(value.appearance || {}) };
        if (!['circle','rounded','square','portrait','pill','blob'].includes(a.shape)) a.shape = 'blob';
        if (a.cameraDefaultSizeV753 !== true) {
            if (a.size == null || Number(a.size) === 22) a.size = 14;
            a.cameraDefaultSizeV753 = true;
        }
        a.size = Math.max(10, Math.min(40, Number(a.size || 14)));
        a.x = Math.max(5, Math.min(95, Number(a.x || 78)));
        a.y = Math.max(5, Math.min(95, Number(a.y || 72)));
        if (typeof a.mirror !== 'boolean') a.mirror = true;
        a.borderWidth = Math.max(0, Math.min(24, Number(a.borderWidth ?? 2)));
        if (!/^#[0-9a-f]{6}$/i.test(String(a.borderColor || ''))) a.borderColor = '#ffffff';
        if (typeof a.shadow !== 'boolean') a.shadow = true;
        if (![0,3,5].includes(Number(a.countdown))) a.countdown = 3;
        if (!['off','standard','strong'].includes(String(a.voiceCleanup || ''))) a.voiceCleanup = 'standard';
        if (typeof a.hideBarFromRecording !== 'boolean') a.hideBarFromRecording = false;
        if (!['horizontal','vertical'].includes(String(a.barOrientationV750 || ''))) a.barOrientationV750 = 'horizontal';
        if (typeof a.barMoved !== 'boolean') a.barMoved = false;
        a.barX = Math.max(4, Math.min(96, Number(a.barX || 82)));
        a.barY = Math.max(4, Math.min(96, Number(a.barY || 88)));
        const defaults = { record:true, pause:true, mic:true, camera:true, screenAudio:false, marker:false };
        const incoming = a.barButtons && typeof a.barButtons === 'object' ? a.barButtons : {};
        if (a.barDefaultsV750 !== true) {
            a.barButtons = { ...defaults };
            a.barDefaultsV750 = true;
        } else {
            a.barButtons = Object.fromEntries(Object.keys(defaults).map(key => [key, incoming[key] !== false]));
        }
        return { shortcuts, appearance:a };
    }

    function recorderSettings() {
        if (clientSettingsCache) return clientSettingsCache;
        let stored = null;
        try { stored = JSON.parse(localStorage.getItem(CLIENT_SETTINGS_KEY) || 'null'); } catch (_) {}
        const data = appDb();
        const fromDb = data?.settings ? {
            shortcuts: data.settings.screenRecorderShortcutsV710 || {},
            appearance: data.settings.screenRecorderAppearanceV710 || {}
        } : {};
        clientSettingsCache = normalizeClientSettings(stored || fromDb);
        try { localStorage.setItem(CLIENT_SETTINGS_KEY, JSON.stringify(clientSettingsCache)); } catch (_) {}
        if (data) {
            data.settings ||= {};
            data.settings.screenRecorderShortcutsV710 = { ...clientSettingsCache.shortcuts };
            data.settings.screenRecorderAppearanceV710 = { ...clientSettingsCache.appearance };
        }
        return clientSettingsCache;
    }

    function saveSettings() {
        const settings = recorderSettings();
        try { localStorage.setItem(CLIENT_SETTINGS_KEY, JSON.stringify(settings)); } catch (_) {}
        const data = appDb();
        if (data) {
            data.settings ||= {};
            data.settings.screenRecorderShortcutsV710 = { ...settings.shortcuts };
            data.settings.screenRecorderAppearanceV710 = { ...settings.appearance };
            try { saveDb(); } catch (_) {}
        }
        try { recorderChannel?.postMessage({type:'settings-changed'}); } catch (_) {}
    }


    // V720 — live, draggable camera preview on the actual Log page.
    function floatingCameraElementV720() {
        return q('#loggy-recorder-floating-camera-v720');
    }

    function cameraStreamIsLiveV720() {
        return !!state.cameraStream?.getVideoTracks?.().some(track => track.readyState === 'live');
    }

    function cameraEnabled() {
        return !!state.cameraStream?.getVideoTracks?.().some(track => track.readyState === 'live' && track.enabled !== false);
    }

    function removeFloatingCameraV720() {
        const bubble = floatingCameraElementV720();
        const video = bubble?.querySelector('video');
        if (video) {
            try { video.pause(); } catch (_) {}
            video.srcObject = null;
        }
        bubble?.remove();
        publishPageCameraVisibilityV908();
    }

    function syncFloatingCameraV720() {
        if (IS_RECORDER_HOST) return;
        const shouldExist = cameraStreamIsLiveV720() && ['ready','countdown','recording','paused'].includes(state.phase);
        if (!shouldExist) {
            removeFloatingCameraV720();
            return;
        }
        const settings = recorderSettings();
        const a = settings.appearance;
        let bubble = floatingCameraElementV720();
        if (!bubble) {
            bubble = document.createElement('div');
            bubble.id = 'loggy-recorder-floating-camera-v720';
            bubble.innerHTML = `<video autoplay muted playsinline></video><span class="loggy-recorder-floating-camera-off-v720"><i class="ph ph-video-camera-slash"></i></span>`;
            document.body.appendChild(bubble);
            let drag = null;
            bubble.addEventListener('pointerdown', event => {
                if (state.cameraFullscreenV750 || event.button !== 0) return;
                event.preventDefault();
                const rect = bubble.getBoundingClientRect();
                drag = { dx:event.clientX-(rect.left+rect.width/2), dy:event.clientY-(rect.top+rect.height/2) };
                bubble.setPointerCapture?.(event.pointerId);
                bubble.classList.add('is-dragging');
            });
            bubble.addEventListener('pointermove', event => {
                if (!drag) return;
                const rect = bubble.getBoundingClientRect();
                const halfXPct = Math.min(49, (rect.width / 2) / Math.max(1, innerWidth) * 100);
                const halfYPct = Math.min(49, (rect.height / 2) / Math.max(1, innerHeight) * 100);
                const rawX = ((event.clientX-drag.dx)/Math.max(1,innerWidth))*100;
                const rawY = ((event.clientY-drag.dy)/Math.max(1,innerHeight))*100;
                const x = Math.max(halfXPct, Math.min(100-halfXPct, rawX));
                const y = Math.max(halfYPct, Math.min(100-halfYPct, rawY));
                const current = recorderSettings();
                current.appearance.x = Math.round(x*10)/10;
                current.appearance.y = Math.round(y*10)/10;
                bubble.style.left = `${current.appearance.x}%`;
                bubble.style.top = `${current.appearance.y}%`;
            });
            const finish = event => {
                if (!drag) return;
                drag = null;
                bubble.classList.remove('is-dragging');
                try { bubble.releasePointerCapture?.(event.pointerId); } catch (_) {}
                saveSettings();
                renderController();
            };
            bubble.addEventListener('pointerup', finish);
            bubble.addEventListener('pointercancel', finish);
            bubble.addEventListener('dblclick', event => {
                event.preventDefault();
                event.stopPropagation();
                Promise.resolve(toggleCameraFullscreenV750()).catch(()=>{});
            });
        }
        bubble.className = `shape-${a.shape}${a.shadow?' has-shadow':''}${cameraEnabled()?'':' is-off'}${state.cameraFullscreenV750?' is-fullscreen-v750':''}`;
        bubble.style.left = `${a.x}%`;
        bubble.style.top = `${a.y}%`;
        bubble.style.setProperty('--rec-camera-page-size-v720', `${Math.max(10,Math.min(40,Number(a.size)||14))}`);
        bubble.style.width = `${Math.max(10,Math.min(40,Number(a.size)||14))}%`;
        bubble.style.borderWidth = `${a.borderWidth}px`;
        bubble.style.borderColor = String(a.borderColor || '#ffffff');
        bubble.style.background = '#111';
        bubble.style.overflow = 'hidden';
        bubble.style.setProperty('--rec-shape-border-color', String(a.borderColor || '#ffffff'));
        bubble.style.setProperty('--rec-shape-border-size', `${a.borderWidth}px`);
        const video = q('video',bubble);
        if (video) {
            if (video.srcObject !== state.cameraStream) video.srcObject = state.cameraStream;
            video.style.objectFit = 'cover';
            video.style.objectPosition = '50% 50%';
            video.style.clipPath = '';
            video.style.webkitClipPath = '';
            video.style.transform = a.mirror ? 'scaleX(-1)' : 'none';
            if (video.paused) video.play().catch(()=>{});
        }
        try { publishPageCameraVisibilityV908(); } catch (_) {}
    }

    // V909 — keep the on-page camera visible as the user's positioning preview,
    // while telling the separate recorder host whether that camera is currently
    // inside the captured Loggy tab. The host can then avoid drawing a duplicate
    // camera on Loggy, but immediately composite the same camera when this tab is
    // hidden and the user switches to another site/tab.
    function publishPageCameraVisibilityV908() {
        if (IS_RECORDER_HOST || !recorderChannel) return;
        const hasCamera = !!floatingCameraElementV720() && cameraStreamIsLiveV720();
        const visible = document.visibilityState === 'visible' && !document.hidden;
        try {
            recorderChannel.postMessage({
                type:'page-camera-visibility-v908',
                sourceId:PAGE_CAMERA_SOURCE_ID_V908,
                visible,
                hasCamera,
                timestamp:Date.now()
            });
        } catch (_) {}
    }

    function installPageCameraVisibilityRuntimeV908() {
        if (IS_RECORDER_HOST || window.__loggyPageCameraVisibilityRuntimeV908) return;
        window.__loggyPageCameraVisibilityRuntimeV908 = true;
        const publish = () => publishPageCameraVisibilityV908();
        document.addEventListener('visibilitychange', publish, true);
        window.addEventListener('focus', publish, true);
        window.addEventListener('blur', publish, true);
        window.addEventListener('pageshow', publish, true);
        window.addEventListener('pagehide', () => {
            try {
                recorderChannel?.postMessage({
                    type:'page-camera-visibility-v908',
                    sourceId:PAGE_CAMERA_SOURCE_ID_V908,
                    visible:false,
                    hasCamera:!!floatingCameraElementV720() && cameraStreamIsLiveV720(),
                    timestamp:Date.now()
                });
            } catch (_) {}
        }, true);
        // A short visible-page heartbeat lets the host distinguish a genuinely
        // visible Loggy preview from a page that was closed/crashed without a final event.
        setInterval(() => {
            if (document.visibilityState === 'visible' && !document.hidden) publish();
        }, 1000);
        publish();
    }

    async function ensureCameraStreamV720(showMessage = false) {
        const generation = cameraLifecycleGeneration;
        if (cameraStreamIsLiveV720()) {
            syncFloatingCameraV720();
            return state.cameraStream;
        }
        if (!navigator.mediaDevices?.getUserMedia) {
            if (showMessage) setMessage('This browser does not provide camera access.', 'error');
            return null;
        }
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video:{width:{ideal:1280},height:{ideal:720}},
                audio:false
            });
            if (generation !== cameraLifecycleGeneration) {
                stream.getTracks().forEach(track => track.stop());
                return null;
            }
            state.cameraStream?.getTracks?.().forEach(track=>track.stop());
            state.cameraStream = stream;
            state.deviceInfoReady = true;
            stream.getVideoTracks().forEach(track => track.addEventListener('ended', () => {
                syncFloatingCameraV720();
                renderController();
            }, {once:true}));
            syncFloatingCameraV720();
            syncControllerPreviewsV721(q('#loggy-recorder-bar-settings-modal-v750'));
            if (showMessage) setMessage('Camera on. Drag your camera bubble anywhere on the Log page.', 'success');
            return stream;
        } catch (error) {
            if (generation !== cameraLifecycleGeneration) return null;
            state.cameraStream = null;
            syncFloatingCameraV720();
            syncControllerPreviewsV721(q('#loggy-recorder-bar-settings-modal-v750'));
            if (showMessage) setMessage(error?.name === 'NotAllowedError' ? 'Camera permission was blocked. Allow camera access for Loggy and try again.' : (error?.message || 'Could not open the camera.'), 'error');
            return null;
        }
    }

    // Animate the actual camera rectangle rather than scaling its video surface.
    // Nonuniform transform scales distort faces when fullscreen and the saved
    // camera bubble have different aspect ratios.
    function restoreCameraWithoutStretchV856(camera, from, to) {
        if (!camera || !from || !to || !to.width || !to.height) return;
        camera.__cameraReturnCleanupV856?.();
        const props = ['left','top','right','bottom','width','height','transform','aspect-ratio','transition','border-radius'];
        const previous = props.map(name => [name, camera.style.getPropertyValue(name), camera.style.getPropertyPriority(name)]);
        let finished = false, frame = 0, timer = 0;
        const set = (name, value) => camera.style.setProperty(name, value, 'important');
        const cleanup = () => {
            if (finished) return;
            finished = true;
            cancelAnimationFrame(frame);
            clearTimeout(timer);
            for (const [name, value, priority] of previous) {
                if (value) camera.style.setProperty(name, value, priority);
                else camera.style.removeProperty(name);
            }
            camera.removeEventListener('transitionend', onEnd);
            camera.__cameraReturnCleanupV856 = null;
            syncFloatingCameraV720();
        };
        const onEnd = e => { if (e.target === camera && e.propertyName === 'width') cleanup(); };
        camera.__cameraReturnCleanupV856 = cleanup;
        const finalRadius = getComputedStyle(camera).borderRadius;
        set('transition','none');
        set('transform','none');
        set('aspect-ratio','auto');
        set('right','auto');
        set('bottom','auto');
        set('left',`${from.left}px`);
        set('top',`${from.top}px`);
        set('width',`${from.width}px`);
        set('height',`${from.height}px`);
        set('border-radius','0px');
        // Force the start geometry to paint before beginning the transition.
        void camera.offsetWidth;
        camera.addEventListener('transitionend', onEnd);
        frame = requestAnimationFrame(() => {
            if (finished) return;
            set('transition','left 300ms cubic-bezier(.22,1,.36,1), top 300ms cubic-bezier(.22,1,.36,1), width 300ms cubic-bezier(.22,1,.36,1), height 300ms cubic-bezier(.22,1,.36,1), border-radius 300ms ease');
            set('left',`${to.left}px`);
            set('top',`${to.top}px`);
            set('width',`${to.width}px`);
            set('height',`${to.height}px`);
            set('border-radius',finalRadius);
        });
        timer = setTimeout(cleanup, 380);
    }

    async function toggleCameraFullscreenV750(force = null) {
        if (!cameraStreamIsLiveV720()) {
            const stream = await ensureCameraStreamV720(true);
            if (!stream) return false;
        }
        const next = force == null ? !state.cameraFullscreenV750 : !!force;
        if (next === state.cameraFullscreenV750) return next;
        if (next) state.cameraStream?.getVideoTracks?.().forEach(track => { track.enabled = true; });
        const camera = floatingCameraElementV720();
        // Fullscreen is a mode switch, not a shape animation. Disable the normal
        // bubble transition while changing modes so the camera immediately becomes
        // a rectangular full-screen video and immediately returns to its saved bubble.
        if (camera) camera.style.setProperty('transition','none','important');
        state.cameraFullscreenV750 = next;
        syncFloatingCameraV720();
        const updated = floatingCameraElementV720();
        if (updated) {
            void updated.offsetWidth;
            requestAnimationFrame(() => requestAnimationFrame(() => {
                try { updated.style.removeProperty('transition'); } catch (_) {}
            }));
        }
        renderController();
        try { showFeatureToast?.(next ? 'Camera full screen on.' : 'Camera full screen off.'); } catch (_) {}
        return next;
    }

    function shortcutMainKey(event) {
        const code = String(event.code || '');
        if (/^Key[A-Z]$/.test(code)) return code.slice(3);
        if (/^Digit[0-9]$/.test(code)) return code.slice(5);
        const byCode = {
            Equal:'=', Minus:'-', Period:'.', Comma:',', Slash:'/', Backslash:'\\',
            Semicolon:';', Quote:"'", BracketLeft:'[', BracketRight:']', Backquote:'`', Space:'Space'
        };
        if (byCode[code]) return byCode[code];
        const key = String(event.key || '').trim();
        if (!key || ['Shift','Control','Alt','Meta'].includes(key)) return '';
        if (key === ' ') return 'Space';
        return key.length === 1 ? key.toUpperCase() : key;
    }
    function shortcutFromEvent(event) {
        const main = shortcutMainKey(event);
        if (!main) return '';
        const parts = [];
        if (event.ctrlKey) parts.push('Ctrl');
        if (event.altKey) parts.push('Alt');
        if (event.shiftKey) parts.push('Shift');
        if (event.metaKey) parts.push('Meta');
        parts.push(main);
        return parts.join('+');
    }
    function shortcutMatches(event, shortcut) {
        const wanted = String(shortcut || '').split('+').map(x => x.trim()).filter(Boolean);
        if (!wanted.length) return false;
        const has = name => wanted.some(x => x.toLowerCase() === name.toLowerCase());
        if (!!event.ctrlKey !== has('Ctrl') || !!event.altKey !== has('Alt') || !!event.shiftKey !== has('Shift') || !!event.metaKey !== has('Meta')) return false;
        const main = wanted.find(x => !['ctrl','alt','shift','meta'].includes(x.toLowerCase())) || '';
        return shortcutMainKey(event).toLowerCase() === main.toLowerCase();
    }
    function prettyShortcut(value) { return String(value || '').replace(/\+/g, ' + '); }

    async function fetchWithTimeout(url, options = {}, timeoutMs = 15000) {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), Math.max(1000, Number(timeoutMs || 15000)));
        try {
            return await fetch(url, { ...options, signal: controller.signal });
        } finally {
            clearTimeout(timer);
        }
    }


    function currentDestinationLabel() {
        if (!state.destination) return 'Choose a numbered Day Log first';
        const slot = state.destination.slot === 'video2' ? 'Video Log 2' : 'Video Log 1';
        return `${state.destination.hobbyLabel || state.destination.hobby} · Day ${state.destination.day} · ${slot}`;
    }
    function logDisplayName() {
        const title = document.title?.replace(/\s*[|·-]\s*Loggy.*$/i, '').trim();
        return title || appHobby() || 'Log';
    }

    function youtubeTitleForDestination(destination = state.destination, dayOverride = null) {
        const rawLabel = String(destination?.hobbyLabel || destination?.hobby || logDisplayName() || 'Loggy').trim();
        const base = rawLabel.replace(/\s+logs$/i, '').trim() || 'Loggy';
        const day = Number(dayOverride ?? destination?.day ?? 0);
        return `${base} Logs Day ${day}`;
    }

    function setMessage(message, type = '') {
        state.uiMessage = String(message || '');
        state.uiMessageType = type;
        renderController();
    }

    function closePopover() { q('#loggy-recorder-menu-v710')?.remove(); }
    function showVideoPlusMenu(button, slot) {
        closePopover();
        const rect = button.getBoundingClientRect();
        const menu = document.createElement('div');
        menu.id = 'loggy-recorder-menu-v710';
        menu.className = 'loggy-recorder-popover-v710';
        menu.dataset.recorderSlotV730 = slot === 'video2' ? 'video2' : 'video';
        menu.innerHTML = `
            <button type="button" data-action="link"><i class="ph ph-youtube-logo"></i><span>Paste YouTube Link</span></button>
            <button type="button" data-action="record"><i class="ph ph-record"></i><span>Record Screen</span></button>`;
        document.body.appendChild(menu);
        const width = Math.max(220, menu.offsetWidth);
        menu.style.left = `${Math.max(8, Math.min(innerWidth - width - 8, rect.right - width))}px`;
        menu.style.top = `${Math.min(innerHeight - menu.offsetHeight - 8, rect.bottom + 6)}px`;
        menu.addEventListener('click', event => {
            const action = event.target.closest('button')?.dataset.action;
            if (!action) return;
            closePopover();
            if (action === 'link') {
                const group = q(slot === 'video2' ? '#video-input-group-2' : '#video-input-group');
                const input = q(slot === 'video2' ? '#youtube-url-2' : '#youtube-url');
                group?.classList.remove('hidden');
                requestAnimationFrame(() => input?.focus());
                return;
            }
            launchRecorder(slot, false).catch(error => {
                const message = error?.message || 'Could not open recorder.';
                if (!q('#loggy-recorder-dock-v710')) {
                    try { showFeatureToast?.(message); } catch (_) {}
                    try {
                        const toast = document.createElement('div');
                        toast.className = 'loggy-recorder-launch-error-v730';
                        toast.textContent = message;
                        document.body.appendChild(toast);
                        setTimeout(() => toast.remove(), 4200);
                    } catch (_) {}
                }
                setMessage(message, 'error');
            });
        });
        setTimeout(() => {
            const dismiss = event => {
                if (!event.target.closest('#loggy-recorder-menu-v710')) {
                    closePopover();
                    document.removeEventListener('pointerdown', dismiss, true);
                }
            };
            document.addEventListener('pointerdown', dismiss, true);
        }, 0);
    }

    function slotIsEmpty(slot) {
        const data = appDb();
        const day = appCurrentDay();
        return !data?.days?.[day]?.[slot];
    }

    async function chooseShortcutSlot() {
        if (slotIsEmpty('video')) return 'video';
        if (slotIsEmpty('video2')) return 'video2';
        return new Promise(resolve => {
            let modal = q('#loggy-recorder-slot-modal-v710');
            if (modal) modal.remove();
            modal = document.createElement('div');
            modal.id = 'loggy-recorder-slot-modal-v710';
            modal.className = 'loggy-recorder-modal-v710';
            modal.innerHTML = `<div class="loggy-recorder-modal-box-v710" style="max-width:430px">
                <div class="loggy-recorder-modal-head-v710"><div><h2>Both Video Logs already have videos</h2><p>Choose which slot this recording should replace. The destination stays locked after you choose.</p></div></div>
                <div class="loggy-recorder-preview-actions-v710">
                    <button class="loggy-recorder-action-v710" data-slot="cancel">Cancel</button>
                    <button class="loggy-recorder-action-v710" data-slot="video">Replace Video Log 1</button>
                    <button class="loggy-recorder-action-v710 primary" data-slot="video2">Replace Video Log 2</button>
                </div></div>`;
            document.body.appendChild(modal);
            modal.addEventListener('click', event => {
                const value = event.target.closest('[data-slot]')?.dataset.slot;
                if (!value) return;
                modal.remove();
                resolve(value === 'cancel' ? '' : value);
            });
        });
    }

    async function launchInlineRecorder(slot = '') {
        if (!isNumberedDayVisible()) throw new Error('Start the recorder from a specific numbered Daily Log.');
        if (!slot) slot = await chooseShortcutSlot();
        if (!slot) return null;
        if (state.phase === 'preview' && state.session) throw new Error('Finish or discard the previous recording first.');

        state.destination = {
            hobby: appHobby(),
            hobbyLabel: logDisplayName(),
            day: appCurrentDay(),
            slot: slot === 'video2' ? 'video2' : 'video'
        };
        state.phase = 'ready';
        state.dockVisibleV750 = true;
        state.settingsOpen = false;
        state.uiMessage = `Ready. Click Record or press ${prettyShortcut(recorderSettings().shortcuts.start)} to choose what to share.`;
        state.uiMessageType = '';
        ensureFallbackDock();
        if (recorderSettings().appearance.hideBarFromRecording) openDetachedControlsV734({activate:false});
        renderController();
        // Request the camera while this launch still has a user gesture. The
        // live preview appears immediately on the Log page and can be dragged.
        const generation = cameraLifecycleGeneration;
        await ensureCameraStreamV720(false);
        if (generation !== cameraLifecycleGeneration) return null;
        renderController();
        refreshYouTubeStatus();
        return window;
    }

    async function launchRecorderHostWindow(slot = '') {
        if (!isNumberedDayVisible()) throw new Error('Start the recorder from a specific numbered Daily Log.');

        // IMPORTANT: open/recover the named recorder window while the original
        // click/key press still has user activation. Awaiting the slot chooser
        // first caused browsers to treat this as an unsolicited pop-up.
        const popup = window.open('', HOST_WINDOW_NAME, 'popup,width=430,height=760,resizable=yes,scrollbars=yes');
        if (!popup) throw new Error('Allow pop-ups for Loggy, then press the recorder shortcut again.');
        try {
            if (/\/loggy-recorder-host\.html$/i.test(popup.location.pathname)) {
                const phase = String(popup.LoggyScreenRecorderV710?.state?.phase || '');
                if (phase && phase !== 'idle') {
                    popup.focus();
                    try { popup.postMessage({type:'loggy-recorder-focus'}, location.origin); } catch (_) {}
                    try { showFeatureToast?.('A recorder is already open. Its original Day destination is still locked.'); } catch (_) {}
                    return popup;
                }
            }
        } catch (_) {}

        if (!slot) {
            if (slotIsEmpty('video')) slot = 'video';
            else if (slotIsEmpty('video2')) slot = 'video2';
            else {
                try {
                    popup.document.title = 'Loggy Recorder — choose a Video Log slot';
                    popup.document.body.innerHTML = '<main style="font-family:system-ui;padding:24px"><h2>Loggy Recorder</h2><p>Choose which Video Log slot to replace in the Loggy window.</p></main>';
                    popup.blur?.();
                    window.focus?.();
                } catch (_) {}
                slot = await chooseShortcutSlot();
            }
        }
        if (!slot) {
            try { popup.close(); } catch (_) {}
            return null;
        }

        const destination = {
            hobby: appHobby(),
            hobbyLabel: logDisplayName(),
            day: appCurrentDay(),
            slot: slot === 'video2' ? 'video2' : 'video'
        };
        const params = new URLSearchParams({
            hobby: destination.hobby,
            label: destination.hobbyLabel,
            day: String(destination.day),
            slot: destination.slot
        });
        popup.location.replace(`/loggy-recorder-host.html?${params.toString()}`);
        popup.focus();
        return popup;
    }

    async function launchRecorder(slot = '', autoStart = false) {
        if (!IS_RECORDER_HOST) return launchInlineRecorder(slot);
        if (state.phase !== 'idle' && state.phase !== 'preview') {
            renderController();
            return;
        }
        if (!isNumberedDayVisible()) throw new Error('Start the recorder from a specific numbered Daily Log.');
        if (!slot) slot = await chooseShortcutSlot();
        if (!slot) return;
        if (state.phase === 'preview' && state.session) throw new Error('Finish or discard the previous recording first.');
        state.destination = {
            hobby: appHobby(),
            hobbyLabel: logDisplayName(),
            day: appCurrentDay(),
            slot: slot === 'video2' ? 'video2' : 'video'
        };
        state.phase = 'ready';
        state.uiMessage = '';
        await openControllerWindow();
        renderController();
        refreshYouTubeStatus();
        if (autoStart) await beginCapture();
    }

    async function openControllerWindow() {
        if (!IS_RECORDER_HOST) {
            ensureFallbackDock();
            return window;
        }
        if (state.controllerWindow && !state.controllerWindow.closed) return state.controllerWindow;
        if ('documentPictureInPicture' in window && window.isSecureContext) {
            try {
                const pip = await documentPictureInPicture.requestWindow({ width: 380, height: 610 });
                state.controllerWindow = pip;
                state.controllerDocument = pip.document;
                pip.addEventListener('pagehide', () => {
                    state.controllerWindow = null;
                    state.controllerDocument = null;
                    state.controllerRoot = null;
                    if (state.dockVisibleV750 !== false) {
                        ensureFallbackDock();
                        renderController();
                    }
                }, { once:true });
                const stylesheetLinks = qa('link[rel="stylesheet"]', document)
                    .map(link => `<link rel="stylesheet" href="${esc(link.href)}">`)
                    .join('');
                const inlineStyles = qa('style', document)
                    .map(style => `<style>${String(style.textContent || '').replace(/<\/style/gi, '<\\/style')}</style>`)
                    .join('');
                pip.document.head.innerHTML = `<meta charset="utf-8"><title>Loggy Recorder</title>${stylesheetLinks}${inlineStyles}<style>${controllerWindowCss()}</style>`;
                pip.document.body.innerHTML = '<div id="loggy-recorder-pip-root-v710"></div>';
                state.controllerRoot = pip.document.getElementById('loggy-recorder-pip-root-v710');
                q('#loggy-recorder-dock-v710')?.classList.add('hidden');
                return pip;
            } catch (_) {}
        }
        ensureFallbackDock();
        return window;
    }

    function controllerWindowCss() {
        return `
            *{box-sizing:border-box}body{margin:0;background:#fff;color:#111;font-family:system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;overflow:auto}
            button,select,input{font:inherit}.controller{display:grid;gap:10px;padding:12px;min-height:100vh}.head{display:flex;gap:8px;align-items:flex-start}.head>div{min-width:0;flex:1}.head strong{display:block;font-size:14px}.dest{display:block;color:#666;font-size:11px;margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.status{font-size:11px;font-weight:700;display:flex;gap:6px;align-items:center}.dot{width:8px;height:8px;border-radius:50%;background:#888}.controller[data-state=recording] .dot{background:#e11d48;box-shadow:0 0 0 3px rgba(225,29,72,.12)}.controller[data-state=paused] .dot{background:#d97706}.timer{font-variant-numeric:tabular-nums}.mic-meter{width:42px;height:6px;border-radius:99px;background:#e5e7eb;overflow:hidden}.mic-meter>span{display:block;height:100%;width:0;background:#22c55e;transition:width .08s linear}.close{border:1px solid #bbb;border-radius:8px;background:#fff;width:32px;height:32px;cursor:pointer}.controls{display:grid;grid-template-columns:repeat(8,minmax(0,1fr));gap:5px}.controls button{height:38px;border:1px solid #bbb;border-radius:9px;background:#fff;cursor:pointer}.controls button:disabled{opacity:.35;cursor:not-allowed}.controls button.off{opacity:.42}.layout{position:relative;width:100%;aspect-ratio:16/9;overflow:hidden;border:1px solid #bbb;border-radius:10px;background:linear-gradient(135deg,#e9edf2,#cfd7e2);touch-action:none}.layout:before{content:'Recorded layout';position:absolute;left:8px;top:6px;font-size:10px;opacity:.45}.bubble{position:absolute;left:78%;top:72%;width:22%;aspect-ratio:1;transform:translate(-50%,-50%);overflow:hidden;border:2px solid #fff;box-shadow:0 4px 14px rgba(0,0,0,.25);background:#111;cursor:grab}.bubble video{width:100%;height:100%;object-fit:cover;display:block}.bubble.mirror video{transform:scaleX(-1)}.bubble.circle{border-radius:50%}.bubble.rounded{border-radius:22%}.bubble.square{border-radius:2px}.bubble.portrait{border-radius:18%;aspect-ratio:3/4}.bubble.pill{border-radius:999px;aspect-ratio:1.55}.bubble.blob{border-radius:58% 42% 52% 48% / 44% 56% 40% 60%}.placeholder{position:absolute;inset:0;display:grid;place-items:center;opacity:.55}.grid{display:grid;grid-template-columns:1fr 1fr;gap:6px}.field{display:grid;gap:3px}.field span{font-size:10px;font-weight:700;color:#666}.field select,.field input{width:100%;min-width:0;border:1px solid #bbb;border-radius:7px;padding:6px;background:#fff}.devices{display:grid;grid-template-columns:1fr 1fr;gap:6px}.devices.hidden{display:none}.message{min-height:16px;font-size:10px;color:#666}.message.error{color:#b91c1c}.message.success{color:#047857}.foot{display:flex;justify-content:space-between;gap:8px;align-items:center;font-size:10px;color:#666}.foot button{border:0;background:transparent;text-decoration:underline;color:inherit;padding:0;cursor:pointer}.shortcuts{display:none;border-top:1px solid #ddd;padding-top:9px;gap:6px}.shortcuts.open{display:grid}.shortcut{display:grid;grid-template-columns:1fr auto;gap:8px;align-items:center;font-size:11px}.shortcut button{border:1px solid #bbb;background:#fff;border-radius:7px;padding:5px 7px;min-width:112px}.youtube{display:flex;gap:6px;align-items:center;flex-wrap:wrap}.youtube button{border:1px solid #bbb;background:#fff;border-radius:7px;padding:5px 8px;cursor:pointer}.youtube small{color:#666}.marker-list{font-size:10px;color:#666;max-height:52px;overflow:auto}.marker-list span{display:block}.hidden{display:none!important}@media(max-width:340px){.controls{grid-template-columns:repeat(4,1fr)}.grid,.devices{grid-template-columns:1fr}}
        `;
    }

    function ensureFallbackDock() {
        let dock = q('#loggy-recorder-dock-v710');
        if (!dock) {
            dock = document.createElement('div');
            dock.id = 'loggy-recorder-dock-v710';
            document.body.appendChild(dock);
        }
        dock.classList.remove('hidden');
        state.controllerRoot = dock;
        state.controllerDocument = document;
    }

    function closeControllerOnly() {
        if (['recording','paused','countdown','stopping'].includes(state.phase)) {
            state.settingsOpen = false;
            renderController();
            setMessage('Recorder controls stay visible while a recording is active so Stop is always available.');
            return;
        }
        // Tear down the camera synchronously with the bar, before any window
        // callbacks or pending camera permissions can recreate its preview.
        stopAllMedia();
        state.cameraFullscreenV750 = false;
        state.settingsOpen = false;
        state.dockVisibleV750 = false;
        if (state.phase === 'ready') {
            state.phase = 'idle';
            state.destination = null;
        }
        closeDetachedControlsV734({restoreInline:false});
        const controllerWindow = state.controllerWindow;
        state.controllerWindow = null;
        state.controllerDocument = null;
        state.controllerRoot = null;
        if (controllerWindow && controllerWindow !== window && !controllerWindow.closed) {
            try { controllerWindow.close(); } catch (_) {}
        }
        q('#loggy-recorder-bar-settings-modal-v750')?.classList.add('hidden');
        q('#loggy-recorder-dock-v710')?.classList.add('hidden');
        publishHostStatus();
        if (IS_RECORDER_HOST) {
            try { window.close(); } catch (_) {}
        }
    }


    function toggleFloatControls() {
        if (!IS_RECORDER_HOST) {
            ensureFallbackDock();
            return openRecorderClientSettingsV750();
        }
        if (state.controllerWindow && state.controllerWindow !== window && !state.controllerWindow.closed) {
            try { state.controllerWindow.close(); } catch (_) {}
            return;
        }
        return openControllerWindow().then(() => renderController());
    }



    const BAR_CONTROLS_V734 = Object.freeze([
        ['record','Start / Stop','ph-play'],
        ['pause','Pause / Resume','ph-pause'],
        ['mic','Microphone','ph-microphone'],
        ['camera','Camera','ph-video-camera'],
        ['cameraFullscreen','Full-screen camera','ph-arrows-out'],
        ['screenAudio','Screen audio','ph-speaker-high'],
        ['marker','Marker','ph-bookmark-simple']
    ]);

    function barControlShownV734(action) {
        return recorderSettings().appearance.barButtons?.[action] !== false;
    }

    function barControlMarkupV734(action, hiddenPanel = false) {
        const common = `type="button" data-rec-action="${action}"${hiddenPanel ? ' data-rec-hidden-control-v734="1"' : ''}`;
        if (action === 'record') {
            const active=['recording','paused'].includes(state.phase);
            const enabled=state.phase==='ready'||active;
            return `<button ${common} title="${active?'Stop recording':'Start recording'}" ${enabled?'':'disabled'}><i class="ph ${active?'ph-stop':'ph-play'}"></i>${hiddenPanel?`<span>${active?'Stop':'Start / Stop'}</span>`:''}</button>`;
        }
        if (action === 'pause') return `<button ${common} title="${state.phase==='paused'?'Resume':'Pause'}" ${['recording','paused'].includes(state.phase)?'':'disabled'}><i class="ph ${state.phase==='paused'?'ph-play':'ph-pause'}"></i>${hiddenPanel?`<span>${state.phase==='paused'?'Resume':'Pause'}</span>`:''}</button>`;
        if (action === 'mic') return `<button ${common} title="Microphone" class="${state.micStream && state.micAudioGain?.gain?.value !== 0 ? '' : 'is-off'}"><i class="ph ph-microphone"></i>${hiddenPanel?'<span>Microphone</span>':''}</button>`;
        if (action === 'camera') return `<button ${common} title="Camera" class="${state.cameraStream && cameraEnabled() ? '' : 'is-off'}"><i class="ph ph-video-camera"></i>${hiddenPanel?'<span>Camera</span>':''}</button>`;
        if (action === 'cameraFullscreen') return `<button ${common} title="${state.cameraFullscreenV750?'Restore camera size':'Full-screen camera'}" class="${state.cameraFullscreenV750?'is-active':''}"><i class="ph ${state.cameraFullscreenV750?'ph-arrows-in':'ph-arrows-out'}"></i>${hiddenPanel?`<span>${state.cameraFullscreenV750?'Restore camera':'Full-screen camera'}</span>`:''}</button>`;
        if (action === 'screenAudio') return `<button ${common} title="Screen audio" class="${state.screenAudioGain && state.screenAudioGain.gain.value !== 0 ? '' : 'is-off'}"><i class="ph ph-speaker-high"></i>${hiddenPanel?'<span>Screen audio</span>':''}</button>`;
        if (action === 'marker') return `<button ${common} title="Add marker" ${['recording','paused'].includes(state.phase)?'':'disabled'}><i class="ph ph-bookmark-simple"></i>${hiddenPanel?'<span>Marker</span>':''}</button>`;
        return '';
    }

    function recordingBarSettingsMarkupV734() {
        const a = recorderSettings().appearance;
        const checkboxes = BAR_CONTROLS_V734.map(([key,label]) => `
            <label class="loggy-recorder-bar-choice-v734">
                <input type="checkbox" data-rec-bar-toggle-v734="${key}" ${a.barButtons?.[key] !== false ? 'checked' : ''}>
                <span>${esc(label)}</span>
            </label>`).join('');
        const hidden = BAR_CONTROLS_V734.filter(([key]) => a.barButtons?.[key] === false);
        return `
            <section class="loggy-recorder-bar-settings-v734">
                <div class="loggy-recorder-bar-settings-title-v734">Recorder bar</div>
                <div class="loggy-recorder-option-grid-v710">
                    <label class="loggy-recorder-field-v710"><span>Orientation</span><select data-rec-setting="barOrientationV750"><option value="horizontal" ${a.barOrientationV750==='horizontal'?'selected':''}>Horizontal</option><option value="vertical" ${a.barOrientationV750==='vertical'?'selected':''}>Vertical</option></select></label>
                    <label class="loggy-recorder-field-v710"><span>Hide bar from recording (keep controls visible)</span><select data-rec-setting="hideBarFromRecording"><option value="false" ${a.hideBarFromRecording?'':'selected'}>Off</option><option value="true" ${a.hideBarFromRecording?'selected':''}>On — controls remain visible in a separate window (not recorded)</option></select></label>
                </div>
                <div class="loggy-recorder-bar-settings-subtitle-v734">Icons shown in the thin bar</div>
                <div class="loggy-recorder-bar-choices-v734">${checkboxes}</div>
                ${hidden.length ? `<div class="loggy-recorder-hidden-controls-v734"><span>Hidden bar controls</span><div>${hidden.map(([key])=>barControlMarkupV734(key,true)).join('')}</div></div>` : ''}
            </section>`;
    }

    function captureContentRectV734(canvasW, canvasH) {
        const full = { x:0, y:0, w:Math.max(1,canvasW), h:Math.max(1,canvasH) };
        let trackSettings = {};
        try { trackSettings = state.displayStream?.getVideoTracks?.()[0]?.getSettings?.() || {}; } catch (_) {}
        const surface = String(trackSettings.displaySurface || '').toLowerCase();
        if (surface !== 'window') return full;
        const ow = Number(window.outerWidth || 0), oh = Number(window.outerHeight || 0);
        const iw = Number(window.innerWidth || 0), ih = Number(window.innerHeight || 0);
        if (!(ow > 0 && oh > 0 && iw > 0 && ih > 0 && iw <= ow && ih <= oh)) return full;
        const sx = canvasW / ow, sy = canvasH / oh;
        const chromeX = Math.max(0, ow - iw);
        const chromeY = Math.max(0, oh - ih);
        const sideCss = chromeX / 2;
        const bottomCss = Math.min(Math.max(0, sideCss), chromeY);
        const topCss = Math.max(0, chromeY - bottomCss);
        const rect = { x:sideCss*sx, y:topCss*sy, w:iw*sx, h:ih*sy };
        if (rect.w < canvasW * .45 || rect.h < canvasH * .45) return full;
        return rect;
    }

    function applyPreviewBubbleGeometryV734(layout, bubble) {
        if (!layout || !bubble) return;
        const a = recorderSettings().appearance;
        let sourceW = Number(state.canvas?.width || 0), sourceH = Number(state.canvas?.height || 0);
        try {
            const ts = state.displayStream?.getVideoTracks?.()[0]?.getSettings?.() || {};
            sourceW = Number(ts.width || sourceW);
            sourceH = Number(ts.height || sourceH);
        } catch (_) {}
        if (!(sourceW > 0 && sourceH > 0)) {
            bubble.style.left = `${a.x}%`;
            bubble.style.top = `${a.y}%`;
            bubble.style.width = `${a.size}%`;
            return;
        }
        // Keep the coordinates identical to the live draggable page bubble.
        // Converting them through browser chrome offsets makes the bubble snap
        // to a different place as soon as Recorder Settings is opened.
        bubble.style.left = `${a.x}%`;
        bubble.style.top = `${a.y}%`;
        bubble.style.width = `${a.size}%`;
    }

    function applyDockCompactWidthV734() {
        if (IS_RECORDER_HOST) return;
        const dock = q('#loggy-recorder-dock-v710');
        if (!dock) return;
        const a=recorderSettings().appearance;
        dock.dataset.recOrientationV750=a.barOrientationV750||'horizontal';
        dock.style.removeProperty('width');
        dock.style.removeProperty('height');
        applyDockPositionV734();
    }

    function applyDockPositionV734() {
        if (IS_RECORDER_HOST) return;
        const dock = q('#loggy-recorder-dock-v710');
        if (!dock) return;
        const a = recorderSettings().appearance;
        if (!a.barMoved) {
            dock.style.removeProperty('left');
            dock.style.removeProperty('top');
            dock.style.removeProperty('transform');
            dock.style.removeProperty('right');
            dock.style.removeProperty('bottom');
            return;
        }
        requestAnimationFrame(() => {
            const rect = dock.getBoundingClientRect();
            const halfW = rect.width / 2, halfH = rect.height / 2;
            const cx = Math.max(8 + halfW, Math.min(innerWidth - 8 - halfW, innerWidth * a.barX / 100));
            const cy = Math.max(8 + halfH, Math.min(innerHeight - 8 - halfH, innerHeight * a.barY / 100));
            dock.style.setProperty('left', `${cx}px`, 'important');
            dock.style.setProperty('top', `${cy}px`, 'important');
            dock.style.setProperty('right', 'auto', 'important');
            dock.style.setProperty('bottom', 'auto', 'important');
            dock.style.setProperty('transform', 'translate(-50%,-50%)', 'important');
        });
    }

    function bindDockDragV734(root) {
        if (IS_RECORDER_HOST || root?.ownerDocument !== document) return;
        const dock = q('#loggy-recorder-dock-v710');
        const handle = q('.loggy-recorder-compact-status-v717', root);
        if (!dock || !handle) return;
        let dragging = false;
        handle.onpointerdown = event => {
            if (event.button !== 0) return;
            dragging = true;
            handle.setPointerCapture?.(event.pointerId);
            dock.classList.add('loggy-recorder-dock-dragging-v734');
            event.preventDefault();
        };
        handle.onpointermove = event => {
            if (!dragging) return;
            const rect = dock.getBoundingClientRect();
            const halfW = rect.width / 2, halfH = rect.height / 2;
            const cx = Math.max(8 + halfW, Math.min(innerWidth - 8 - halfW, event.clientX));
            const cy = Math.max(8 + halfH, Math.min(innerHeight - 8 - halfH, event.clientY));
            const a = recorderSettings().appearance;
            a.barMoved = true;
            a.barX = cx / Math.max(1, innerWidth) * 100;
            a.barY = cy / Math.max(1, innerHeight) * 100;
            dock.style.setProperty('left', `${cx}px`, 'important');
            dock.style.setProperty('top', `${cy}px`, 'important');
            dock.style.setProperty('right', 'auto', 'important');
            dock.style.setProperty('bottom', 'auto', 'important');
            dock.style.setProperty('transform', 'translate(-50%,-50%)', 'important');
        };
        const finish = event => {
            if (!dragging) return;
            dragging = false;
            dock.classList.remove('loggy-recorder-dock-dragging-v734');
            try { handle.releasePointerCapture?.(event.pointerId); } catch (_) {}
            saveSettings();
        };
        handle.onpointerup = finish;
        handle.onpointercancel = finish;
    }

    function detachedControlsIsOpenV734() {
        try { return !!state.detachedControlsWindowV734 && !state.detachedControlsWindowV734.closed; } catch (_) { return false; }
    }

    function closeDetachedControlsV734({restoreInline=true} = {}) {
        const popup = state.detachedControlsWindowV734;
        state.detachedControlsWindowV734 = null;
        state.detachedControlsRootV734 = null;
        state.detachedControlsDocumentV734 = null;
        try { if (popup && !popup.closed) popup.close(); } catch (_) {}
        if (!IS_RECORDER_HOST && restoreInline) {
            ensureFallbackDock();
            q('#loggy-recorder-dock-v710')?.classList.remove('hidden');
        }
    }

    function resizeDetachedControlsV734(openSettings) {
        const popup = state.detachedControlsWindowV734;
        if (!popup || popup.closed) return;
        try { popup.resizeTo(700, openSettings ? 780 : 150); } catch (_) {}
    }

    function openDetachedControlsV734({activate=true} = {}) {
        if (IS_RECORDER_HOST) return false;
        if (detachedControlsIsOpenV734()) return true;
        let popup = null;
        try { popup = window.open('', 'loggy-recorder-visible-controls-v734', 'popup,width=700,height=150,resizable=yes,scrollbars=yes'); } catch (_) {}
        if (!popup) {
            setMessage('The separate recorder controls window was blocked. Allow pop-ups or turn off “Hide bar from recording”.', 'error');
            return false;
        }
        try {
            popup.document.open();
            popup.document.write(`<!doctype html><html><head><meta charset="utf-8"><title>Loggy Recorder Controls</title><script defer src="https://unpkg.com/@phosphor-icons/web"><\/script><link rel="stylesheet" href="/loggy-screen-recorder.css?v=766"><style>html,body{margin:0;min-height:100%;background:#fff}body{padding:6px;overflow:auto}#loggy-recorder-detached-root-v734{width:100%}#loggy-recorder-detached-root-v734 .loggy-recorder-controller-compact-v717{max-height:none!important}</style></head><body class="loggy-recorder-detached-host-v734"><div id="loggy-recorder-detached-root-v734"></div></body></html>`);
            popup.document.close();
        } catch (_) {}
        state.detachedControlsWindowV734 = popup;
        state.detachedControlsDocumentV734 = popup.document;
        state.detachedControlsRootV734 = popup.document.getElementById('loggy-recorder-detached-root-v734');
        if (!state.detachedControlsRootV734) {
            closeDetachedControlsV734({restoreInline:true});
            return false;
        }
        popup.addEventListener('pagehide', () => {
            if (state.detachedControlsWindowV734 !== popup) return;
            state.detachedControlsWindowV734 = null;
            state.detachedControlsDocumentV734 = null;
            state.detachedControlsRootV734 = null;
            ensureFallbackDock();
            renderController();
        }, {once:true});
        if (activate) {
            state.controllerRoot = state.detachedControlsRootV734;
            state.controllerDocument = popup.document;
            q('#loggy-recorder-dock-v710')?.classList.add('hidden');
            resizeDetachedControlsV734(state.settingsOpen);
        } else {
            state.detachedControlsRootV734.innerHTML = '<div class="loggy-recorder-detached-waiting-v734">Recorder controls will move here when recording starts.</div>';
        }
        return true;
    }

    function syncControlSurfaceV734({userGesture=false} = {}) {
        if (IS_RECORDER_HOST) return;
        const a = recorderSettings().appearance;
        const active = ['countdown','recording','paused','stopping'].includes(state.phase);
        if (a.hideBarFromRecording && active) {
            if (!detachedControlsIsOpenV734() && userGesture) openDetachedControlsV734({activate:true});
            if (detachedControlsIsOpenV734()) {
                state.controllerRoot = state.detachedControlsRootV734;
                state.controllerDocument = state.detachedControlsDocumentV734;
                q('#loggy-recorder-dock-v710')?.classList.add('hidden');
                return;
            }
        }
        if (!a.hideBarFromRecording && detachedControlsIsOpenV734()) {
            closeDetachedControlsV734({restoreInline:true});
            return;
        }
        if (!active) {
            if (detachedControlsIsOpenV734()) closeDetachedControlsV734({restoreInline:true});
            else ensureFallbackDock();
            return;
        }
        ensureFallbackDock();
    }

    function recorderClientSettingsMarkupV750() {
        const a=recorderSettings().appearance;
        const connected=!!state.youtubeStatus?.connected;
        const deviceHidden=state.deviceInfoReady?'':'hidden';
        return `
            <div class="loggy-recorder-settings-grid-v750">
              <div class="loggy-recorder-layout-preview-v710 loggy-recorder-layout-preview-v721" data-rec-layout>
                <video class="loggy-recorder-screen-preview-v721" data-rec-screen-preview autoplay muted playsinline></video>
                <div class="loggy-recorder-screen-preview-empty-v721" data-rec-screen-preview-empty><i class="ph ph-monitor-play"></i><span>Screen preview appears after you choose what to record.</span></div>
                <div class="loggy-recorder-camera-bubble-v710 shape-${a.shape}" data-rec-bubble style="left:${a.x}%;top:${a.y}%;width:${a.size}%;border-width:${a.borderWidth}px;--rec-shape-border-color:${esc(a.borderColor)};--rec-shape-border-size:${a.borderWidth}px;border-color:${esc(a.borderColor)};box-shadow:${a.shadow?'0 4px 16px rgba(0,0,0,.24)':'none'}">
                  <video data-rec-camera-preview autoplay muted playsinline style="transform:${a.mirror?'scaleX(-1)':'none'}"></video><span class="loggy-recorder-camera-placeholder-v710"><i class="ph ph-user"></i></span>
                </div>
              </div>
              <div class="loggy-recorder-option-grid-v710">
                <label class="loggy-recorder-field-v710"><span>Camera shape</span><select data-rec-setting="shape">${[['circle','Circle'],['rounded','Rounded square'],['square','Square'],['portrait','Portrait'],['pill','Pill / oval'],['blob','Bubble blob']].map(([v,l])=>`<option value="${v}" ${a.shape===v?'selected':''}>${l}</option>`).join('')}</select></label>
                <label class="loggy-recorder-field-v710"><span>Camera size</span><input type="range" min="10" max="40" step="1" value="${a.size}" data-rec-setting="size"></label>
                <label class="loggy-recorder-field-v710"><span>Countdown</span><select data-rec-setting="countdown"><option value="0" ${a.countdown===0?'selected':''}>None</option><option value="3" ${a.countdown===3?'selected':''}>3 seconds</option><option value="5" ${a.countdown===5?'selected':''}>5 seconds</option></select></label>
                <label class="loggy-recorder-field-v710"><span>Voice cleanup</span><select data-rec-setting="voiceCleanup"><option value="off" ${a.voiceCleanup==='off'?'selected':''}>Off</option><option value="standard" ${a.voiceCleanup==='standard'?'selected':''}>Standard</option><option value="strong" ${a.voiceCleanup==='strong'?'selected':''}>Strong</option></select></label>
                <label class="loggy-recorder-field-v710"><span>Mirror camera</span><select data-rec-setting="mirror"><option value="true" ${a.mirror?'selected':''}>On</option><option value="false" ${!a.mirror?'selected':''}>Off</option></select></label>
                <label class="loggy-recorder-field-v710"><span>Camera position</span><select data-rec-position-preset><option value="">Free drag</option><option value="tl">Top left</option><option value="tr">Top right</option><option value="bl">Bottom left</option><option value="br">Bottom right</option></select></label>
                <label class="loggy-recorder-field-v710"><span>Border thickness (px)</span><input type="range" min="0" max="24" step="1" value="${a.borderWidth}" data-rec-setting="borderWidth"></label>
                <label class="loggy-recorder-field-v710"><span>Border color</span><input type="color" value="${esc(a.borderColor)}" data-rec-setting="borderColor"></label>
                <label class="loggy-recorder-field-v710"><span>Shadow</span><select data-rec-setting="shadow"><option value="true" ${a.shadow?'selected':''}>On</option><option value="false" ${!a.shadow?'selected':''}>Off</option></select></label>
              </div>
              ${recordingBarSettingsMarkupV734()}
              <div class="loggy-recorder-device-grid-v710 ${deviceHidden}" data-rec-devices><label class="loggy-recorder-field-v710"><span>Camera</span><select data-rec-camera-device></select></label><label class="loggy-recorder-field-v710"><span>Microphone</span><select data-rec-mic-device></select></label></div>
              <div class="loggy-recorder-settings-quick-v729"><button type="button" class="loggy-recorder-action-v710 loggy-recorder-recover-prominent-v729" data-rec-action="recover"><i class="ph ph-clock-counter-clockwise"></i><span>Temporary Recordings</span></button><button type="button" class="loggy-recorder-action-v710" data-rec-action="youtube"><i class="ph ph-youtube-logo"></i><span>${connected?'YouTube Settings':'Authorize YouTube'}</span></button><button type="button" class="loggy-recorder-action-v710" data-rec-action="shortcuts"><i class="ph ph-keyboard"></i><span>Recorder Shortcuts</span></button></div>
            </div>`;
    }

    async function openRecorderClientSettingsV750() {
        const modal=ensureModal('loggy-recorder-bar-settings-modal-v750','Screen Recorder Settings','Camera, audio, thin-bar layout, devices, and recorder shortcuts.');
        const body=q('[data-modal-body]',modal);
        body.innerHTML=recorderClientSettingsMarkupV750();

        // V778: Settings must never remove or relocate the actual camera.
        // The preview uses the live page camera if it is part of the capture;
        // otherwise it paints one simulated bubble at the stored coordinates.
        state.settingsOpen = true;
        syncFloatingCameraV720();

        modal.classList.remove('hidden');
        document.body.appendChild(modal);
        const closeButton=q('[data-modal-close]',modal);
        if (closeButton) closeButton.onclick=()=>{
            modal.classList.add('hidden');
            state.settingsOpen = false;
            syncFloatingCameraV720();
            renderController();
        };
        bindController(modal,false);
        try { await populateDeviceSelectors(modal); } catch (_) {}
        syncControllerPreviewsV721(modal);
        requestAnimationFrame(()=>syncControllerPreviewsV721(modal));
        return modal;
    }

    function inlineControllerMarkup() {
        const a=recorderSettings().appearance;
        const active=['recording','paused','countdown','stopping'].includes(state.phase);
        const shownControls=BAR_CONTROLS_V734.filter(([key])=>barControlShownV734(key)).map(([key])=>barControlMarkupV734(key,false)).join('');
        return `<div class="loggy-recorder-controller-v710 loggy-recorder-controller-compact-v717 orientation-${esc(a.barOrientationV750||'horizontal')}" data-state="${esc(state.phase)}" data-orientation-v750="${esc(a.barOrientationV750||'horizontal')}">
          <div class="loggy-recorder-compact-bar-v717">
            <div class="loggy-recorder-compact-status-v717" title="Drag recorder bar"><i class="ph ph-dots-six-vertical loggy-recorder-drag-grip-v734" aria-hidden="true"></i><span class="loggy-recorder-status-dot-v710"></span><span class="loggy-recorder-timer-v710">${formatMs(elapsedMs())}</span></div>
            <div class="loggy-recorder-compact-controls-v717">${shownControls}<button type="button" data-rec-action="settings" title="Recorder settings"><i class="ph ph-gear-six"></i></button>${active?'':'<button type="button" data-rec-action="close" title="Close recorder"><i class="ph ph-x"></i></button>'}</div>
          </div>
        </div>`;
    }

    function controllerMarkup(pip = false) {
        if (!pip && !IS_RECORDER_HOST) return inlineControllerMarkup();
        const settings = recorderSettings();
        const a = settings.appearance;
        const shortcuts = settings.shortcuts;
        const connected = !!state.youtubeStatus?.connected;
        const statusText = state.phase === 'recording' ? 'Recording' : state.phase === 'paused' ? 'Paused' : state.phase === 'countdown' ? 'Starting' : state.phase === 'stopping' ? 'Stopping' : state.phase === 'ready' ? 'Ready' : 'Recorder';
        const deviceHidden = state.deviceInfoReady ? '' : 'hidden';
        const markerHtml = state.markers.slice(-4).map(marker => `<span>${formatMs(marker.ms)} · ${esc(marker.label || 'Marker')}</span>`).join('');
        const rowClass = pip ? '' : 'loggy-recorder-';
        return `
        <div class="${pip?'controller':'loggy-recorder-controller-v710'}" data-state="${esc(state.phase)}">
            <div class="${pip?'head':'loggy-recorder-controller-head-v710'}">
                <div><strong>Loggy Screen Recorder</strong><span class="${pip?'dest':'loggy-recorder-destination-v710'}">Saving to: ${esc(currentDestinationLabel())}</span></div>
                ${IS_RECORDER_HOST && !pip ? `<button type="button" class="loggy-recorder-icon-button-v710" data-rec-action="float" title="Float controls above other tabs"><i class="ph ph-picture-in-picture"></i></button>` : ''}
                <button type="button" class="${pip?'close':'loggy-recorder-icon-button-v710'}" data-rec-action="close" title="Close controls"><i class="ph ph-x"></i></button>
            </div>
            <div class="${pip?'status':'loggy-recorder-status-v710'}"><span class="${pip?'dot':'loggy-recorder-status-dot-v710'}"></span><span>${statusText}</span><span>·</span><span class="${pip?'timer':'loggy-recorder-timer-v710'}">${formatMs(elapsedMs())}</span><span class="${pip?'mic-meter':'loggy-recorder-mic-meter-v710'}" title="Microphone level"><span data-rec-mic-meter-bar></span></span></div>
            <div class="${pip?'controls':'loggy-recorder-controls-v710'}">
                <button type="button" data-rec-action="record" title="Record" ${state.phase==='ready'?'':'disabled'}><i class="ph ph-record"></i></button>
                <button type="button" data-rec-action="pause" title="Pause / Resume" ${['recording','paused'].includes(state.phase)?'':'disabled'}><i class="ph ${state.phase==='paused'?'ph-play':'ph-pause'}"></i></button>
                <button type="button" data-rec-action="stop" title="Stop" ${['recording','paused','countdown'].includes(state.phase)?'':'disabled'}><i class="ph ph-stop"></i></button>
                <button type="button" data-rec-action="mic" title="Microphone" class="${state.micStream && state.micAudioGain?.gain?.value !== 0 ? '' : (pip?'off':'is-off')}"><i class="ph ph-microphone"></i></button>
                <button type="button" data-rec-action="camera" title="Camera" class="${state.cameraStream && cameraEnabled() ? '' : (pip?'off':'is-off')}"><i class="ph ph-video-camera"></i></button>
                <button type="button" data-rec-action="screenAudio" title="Screen audio" class="${state.screenAudioGain && state.screenAudioGain.gain.value !== 0 ? '' : (pip?'off':'is-off')}"><i class="ph ph-speaker-high"></i></button>
                <button type="button" data-rec-action="marker" title="Add marker" ${['recording','paused'].includes(state.phase)?'':'disabled'}><i class="ph ph-bookmark-simple"></i></button>
                <button type="button" data-rec-action="shortcuts" title="Shortcuts"><i class="ph ph-keyboard"></i></button>
            </div>
            <div class="${pip?'layout':'loggy-recorder-layout-preview-v710'}" data-rec-layout>
                <div class="${pip?`bubble ${a.shape} ${a.mirror?'mirror':''}`:`loggy-recorder-camera-bubble-v710 shape-${a.shape}`}" data-rec-bubble style="left:${a.x}%;top:${a.y}%;width:${a.size}%;border-width:${a.borderWidth}px;--rec-shape-border-color:${esc(a.borderColor)};--rec-shape-border-size:${a.borderWidth}px;border-color:${esc(a.borderColor)};box-shadow:${a.shadow?'0 4px 16px rgba(0,0,0,.24)':'none'}">
                    <video data-rec-camera-preview autoplay muted playsinline ${a.mirror && !pip?'style="transform:scaleX(-1)"':''}></video>
                    <span class="${pip?'placeholder':'loggy-recorder-camera-placeholder-v710'}"><i class="ph ph-user"></i></span>
                </div>
            </div>
            <div class="${pip?'grid':'loggy-recorder-option-grid-v710'}">
                <label class="${pip?'field':'loggy-recorder-field-v710'}"><span>Camera shape</span><select data-rec-setting="shape">
                    ${[['circle','Circle'],['rounded','Rounded square'],['square','Square'],['portrait','Portrait'],['pill','Pill / oval'],['blob','Bubble blob']].map(([v,l])=>`<option value="${v}" ${a.shape===v?'selected':''}>${l}</option>`).join('')}
                </select></label>
                <label class="${pip?'field':'loggy-recorder-field-v710'}"><span>Camera size</span><input type="range" min="10" max="40" step="1" value="${a.size}" data-rec-setting="size"></label>
                <label class="${pip?'field':'loggy-recorder-field-v710'}"><span>Countdown</span><select data-rec-setting="countdown"><option value="0" ${a.countdown===0?'selected':''}>None</option><option value="3" ${a.countdown===3?'selected':''}>3 seconds</option><option value="5" ${a.countdown===5?'selected':''}>5 seconds</option></select></label>
                <label class="${pip?'field':'loggy-recorder-field-v710'}" title="Strong mode reduces background noise more aggressively, but no browser recorder can guarantee removal of loud overlapping speech."><span>Voice cleanup</span><select data-rec-setting="voiceCleanup"><option value="off" ${a.voiceCleanup==='off'?'selected':''}>Off</option><option value="standard" ${a.voiceCleanup==='standard'?'selected':''}>Standard</option><option value="strong" ${a.voiceCleanup==='strong'?'selected':''}>Strong</option></select></label>
                <label class="${pip?'field':'loggy-recorder-field-v710'}"><span>Mirror camera</span><select data-rec-setting="mirror"><option value="true" ${a.mirror?'selected':''}>On</option><option value="false" ${!a.mirror?'selected':''}>Off</option></select></label>
                <label class="${pip?'field':'loggy-recorder-field-v710'}"><span>Camera position</span><select data-rec-position-preset><option value="">Free drag</option><option value="tl">Top left</option><option value="tr">Top right</option><option value="bl">Bottom left</option><option value="br">Bottom right</option></select></label>
                <label class="${pip?'field':'loggy-recorder-field-v710'}"><span>Border thickness (px)</span><input type="range" min="0" max="24" step="1" value="${a.borderWidth}" data-rec-setting="borderWidth"></label>
                <label class="${pip?'field':'loggy-recorder-field-v710'}"><span>Border color</span><input type="color" value="${esc(a.borderColor)}" data-rec-setting="borderColor"></label>
                <label class="${pip?'field':'loggy-recorder-field-v710'}"><span>Shadow</span><select data-rec-setting="shadow"><option value="true" ${a.shadow?'selected':''}>On</option><option value="false" ${!a.shadow?'selected':''}>Off</option></select></label>
            </div>
            <div class="${pip?'devices':'loggy-recorder-device-grid-v710'} ${deviceHidden}" data-rec-devices>
                <label class="${pip?'field':'loggy-recorder-field-v710'}"><span>Camera</span><select data-rec-camera-device></select></label>
                <label class="${pip?'field':'loggy-recorder-field-v710'}"><span>Microphone</span><select data-rec-mic-device></select></label>
            </div>
            <div class="${pip?'youtube':'loggy-recorder-shortcut-strip-v710'}">
                ${pip?`<small>${connected?'YouTube connected':'YouTube not connected'}</small><button type="button" data-rec-action="youtube">${connected?'YouTube settings':'Connect YouTube'}</button>`:`<span>${connected?'YouTube connected':'YouTube not connected'}</span><button type="button" data-rec-action="youtube">${connected?'YouTube settings':'Connect YouTube'}</button>`}
            </div>
            <div class="${pip?'marker-list':'loggy-recorder-inline-message-v710'} ${pip?'':esc(state.uiMessageType)}" data-rec-message>${pip ? markerHtml : esc(state.uiMessage)}</div>
            <div class="${pip?'foot':'loggy-recorder-shortcut-strip-v710'}"><span>${prettyShortcut(shortcuts.pause)} pause · ${prettyShortcut(shortcuts.stop)} stop</span><button type="button" data-rec-action="shortcuts">All shortcuts</button></div>
            ${pip?`<div class="shortcuts" data-rec-shortcuts-panel>${shortcutRowsMarkup(true)}</div>`:''}
        </div>`;
    }

    function syncControllerPreviewsV721(root) {
        if (!root) return;
        const cameraPreviews = qa('[data-rec-camera-preview]', root);
        cameraPreviews.forEach(preview => {
            if (!state.cameraStream) { try { preview.srcObject = null; } catch (_) {} return; }
            try { if (preview.srcObject !== state.cameraStream) preview.srcObject = state.cameraStream; preview.play().catch(()=>{}); } catch (_) {}
        });

        const screenPreviews = qa('[data-rec-screen-preview]', root);
        const screenTrack = state.displayStream?.getVideoTracks?.().find(track => track.readyState === 'live');
        const screenStream = screenTrack ? state.displayStream : null;
        screenPreviews.forEach(preview => {
            try {
                if (screenStream && preview.srcObject !== screenStream) preview.srcObject = screenStream;
                if (!screenStream) preview.srcObject = null;
                if (screenStream) preview.play().catch(()=>{});
            } catch (_) {}
        });
        qa('[data-rec-screen-preview-empty]', root).forEach(empty => empty.classList.toggle('hidden', !!screenStream));
        qa('[data-rec-layout]', root).forEach(layout => {
            let width = Number(state.canvas?.width || 0), height = Number(state.canvas?.height || 0);
            try { const settings = screenTrack?.getSettings?.() || {}; width = Number(settings.width || width); height = Number(settings.height || height); } catch (_) {}
            if (width > 0 && height > 0) layout.style.aspectRatio = `${width} / ${height}`;
            const bubble = q('[data-rec-bubble]', layout);
            // V778: never display both a camera captured from this Loggy page
            // and the separate preview bubble. For an external share target,
            // retain exactly one overlay so the preview matches the recording.
            const isScreenSettingsPreview = !!q('[data-rec-screen-preview]', layout);
            if (bubble) {
                const alreadyVisible = !!screenStream && isScreenSettingsPreview && captureContainsPageCameraV778();
                bubble.classList.toggle('hidden', alreadyVisible);
                if (!alreadyVisible) applyPreviewBubbleGeometryV734(layout, bubble);
            }
        });
    }

    function renderController() {
        if (!state.controllerRoot) return;
        const detached = detachedControlsIsOpenV734() && state.controllerDocument === state.detachedControlsDocumentV734;
        const pip = !detached && state.controllerDocument && state.controllerDocument !== document;
        state.controllerRoot.innerHTML = detached ? inlineControllerMarkup() : controllerMarkup(pip);
        bindController(state.controllerRoot, detached ? false : pip);
        syncControllerPreviewsV721(state.controllerRoot);
        populateDeviceSelectors(state.controllerRoot).catch(()=>{});
        syncFloatingCameraV720();
        applyDockCompactWidthV734();
        applyDockPositionV734();
        bindDockDragV734(state.controllerRoot);
        if (detached) resizeDetachedControlsV734(state.settingsOpen);
        publishHostStatus();
    }

    function updateControllerStatusOnly() {
        const docs = [document, state.controllerDocument].filter(Boolean);
        const text = formatMs(elapsedMs());
        docs.forEach(doc => {
            qa('.loggy-recorder-timer-v710,[data-rec-live-timer-v717]', doc).forEach(node => { node.textContent = text; });
        });
        if (IS_RECORDER_HOST && ['countdown','recording','paused'].includes(state.phase)) {
            const now = Date.now();
            if (now - lastHostStatusHeartbeatV917 >= 1000) {
                lastHostStatusHeartbeatV917 = now;
                publishHostStatus();
            }
        }
    }

    function shortcutRowsMarkup(pip = false) {
        const settings = recorderSettings();
        return Object.keys(SHORTCUT_DEFAULTS).map(key => `
            <div class="${pip?'shortcut':'loggy-recorder-shortcut-row-v710'}">
                <span>${esc(SHORTCUT_LABELS[key])}</span>
                <button type="button" ${pip?'':'class="loggy-recorder-shortcut-capture-v710"'} data-rec-shortcut-key="${key}">${esc(prettyShortcut(settings.shortcuts[key]))}</button>
            </div>`).join('') + `<button type="button" ${pip?'':'class="loggy-recorder-action-v710"'} data-rec-shortcut-reset>Reset recorder shortcuts</button>`;
    }

    function bindShortcutEditors(root) {
        qa('[data-rec-shortcut-key]', root).forEach(button => {
            button.addEventListener('click', event => {
                event.preventDefault();
                const key = button.dataset.recShortcutKey;
                const original = button.textContent;
                button.textContent = 'Press shortcut…';
                button.classList.add('capturing');
                const doc = button.ownerDocument || document;
                const capture = keyEvent => {
                    keyEvent.preventDefault();
                    keyEvent.stopPropagation();
                    keyEvent.stopImmediatePropagation?.();
                    if (keyEvent.key === 'Escape') {
                        doc.removeEventListener('keydown', capture, true);
                        button.textContent = original;
                        button.classList.remove('capturing');
                        return;
                    }
                    const next = shortcutFromEvent(keyEvent);
                    if (!next) return;
                    const settings = recorderSettings();
                    settings.shortcuts[key] = next;
                    saveSettings();
                    doc.removeEventListener('keydown', capture, true);
                    button.textContent = prettyShortcut(next);
                    button.classList.remove('capturing');
                    syncShortcutEditorsEverywhere();
                };
                setTimeout(() => doc.addEventListener('keydown', capture, true), 0);
            });
        });
        q('[data-rec-shortcut-reset]', root)?.addEventListener('click', () => {
            const settings = recorderSettings();
            Object.assign(settings.shortcuts, SHORTCUT_DEFAULTS);
            saveSettings();
            syncShortcutEditorsEverywhere();
        });
    }

    function syncShortcutEditorsEverywhere() {
        const settings = recorderSettings();
        const docs = [document, state.controllerDocument].filter(Boolean);
        docs.forEach(doc => {
            qa('[data-rec-shortcut-key]', doc).forEach(button => {
                const key = button.dataset.recShortcutKey;
                if (settings.shortcuts[key]) button.textContent = prettyShortcut(settings.shortcuts[key]);
            });
        });
    }

    function publishHostStatus() {
        if (!IS_RECORDER_HOST) return;
        const payload = {
            phase: state.phase,
            destination: state.destination,
            timestamp: Date.now()
        };
        try { localStorage.setItem(HOST_STATUS_KEY, JSON.stringify(payload)); } catch (_) {}
        try { recorderChannel?.postMessage({type:'host-status', ...payload}); } catch (_) {}
    }

    function readHostStatus() {
        try {
            const value = JSON.parse(localStorage.getItem(HOST_STATUS_KEY) || 'null');
            if (!value || Date.now() - Number(value.timestamp || 0) > 15000) return null;
            return value;
        } catch (_) { return null; }
    }

    function sendHostCommand(action) {
        if (!recorderChannel) return false;
        try { recorderChannel.postMessage({type:'command', action}); return true; } catch (_) { return false; }
    }

    function activeRecorderHostStatus() {
        const status = readHostStatus();
        if (!status) return null;
        return ['ready','countdown','recording','paused','stopping','preview'].includes(String(status.phase || ''))
            ? status
            : null;
    }

    function recordingIsActiveForLeaveGuardV917() {
        const active = new Set(['countdown','recording','paused','stopping']);
        if (active.has(String(state.phase || ''))) return true;
        const host = activeRecorderHostStatus();
        return !!host && active.has(String(host.phase || ''));
    }

    function navigationControlForLeaveGuardV917(target) {
        if (!(target instanceof Element)) return null;
        const control = target.closest('a[href],button');
        if (!control || !control.closest('.side-nav')) return null;
        // Only the navbar home control leaves this log. Day arrows and all
        // other tabs remain part of the current recording.
        return control.matches('#back-to-dashboard-btn,a[title="Back to Dashboard"]')
            ? control
            : null;
    }

    async function saveRecordingForDashboard() {
        suppressAutomaticPreview = true;
        try {
            const wasCountdown = state.phase === 'countdown';
            stopRecording();
            if (wasCountdown) return; // No video has started yet.
            if (!state.finalizePromise && state.phase !== 'stopping') {
                throw new Error('The recording could not be stopped.');
            }
            // MediaRecorder emits its final data before onstop starts finalization.
            // Wait for that path so the last chunk is included in the saved video.
            while (!state.finalizePromise) {
                await new Promise(resolve => setTimeout(resolve, 25));
            }
            await state.finalizePromise;
        } finally {
            suppressAutomaticPreview = false;
        }
    }

    function saveHostRecordingForDashboard() {
        return new Promise((resolve, reject) => {
            if (!recorderChannel) return reject(new Error('The recorder window is unavailable.'));
            const requestId = `${Date.now()}-${Math.random()}`;
            const cleanup = () => {
                clearTimeout(timer);
                recorderChannel.removeEventListener('message', onMessage);
            };
            const onMessage = event => {
                const message = event.data || {};
                if (message.type !== 'dashboard-recording-saved' || message.requestId !== requestId) return;
                cleanup();
                if (message.ok) resolve();
                else reject(new Error(message.error || 'Could not save the recording.'));
            };
            const timer = setTimeout(() => {
                cleanup();
                reject(new Error('The recorder has not confirmed the save yet. Check temporary recordings before leaving.'));
            }, 120000);
            recorderChannel.addEventListener('message', onMessage);
            try { recorderChannel.postMessage({type:'save-recording-for-dashboard', requestId}); }
            catch (error) { cleanup(); reject(error); }
        });
    }

    function installRecordingLeaveGuardV917() {
        if (IS_RECORDER_HOST || window.__loggyRecordingLeaveGuardV917) return;
        window.__loggyRecordingLeaveGuardV917 = true;

        // Window capture runs before the older document-level navigation handlers,
        // including the fast Back-to-Dashboard handler. Finish saving before
        // allowing navigation to unload the recorder's current page.
        window.addEventListener('click', event => {
            if (recordingLeaveBypassV917 || event.defaultPrevented || event.button !== 0) return;
            if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
            if (!dashboardSavePending && !recordingIsActiveForLeaveGuardV917()) return;
            const control = navigationControlForLeaveGuardV917(event.target);
            if (!control) return;

            event.preventDefault();
            event.stopPropagation();
            event.stopImmediatePropagation();

            if (dashboardSavePending) return;
            dashboardSavePending = true;
            showRecorderConfirm({
                title:'Leave this log?',
                message:'Leaving will end your recording and save it to Temporary Recordings.',
                confirmLabel:'Leave',
                cancelLabel:'Stay',
                danger:false
            }).then(async leave => {
                if (!leave) return;
                showRecorderShortcutFeedback('Saving recording to temporary recordings…');
                const localActive = ['countdown','recording','paused','stopping'].includes(state.phase);
                if (localActive) await saveRecordingForDashboard();
                else if (activeRecorderHostStatus()) await saveHostRecordingForDashboard();
                else if (state.finalizePromise) await state.finalizePromise;
                if (!control.isConnected) return;
                recordingLeaveBypassV917 = true;
                try { control.click(); }
                finally { setTimeout(() => { recordingLeaveBypassV917 = false; }, 0); }
            }).catch(error => {
                showRecorderShortcutFeedback(error?.message || 'Could not save the recording. Please try again.', 'error');
            }).finally(() => { dashboardSavePending = false; });
        }, true);
    }

    function focusRecorderHostWindow() {
        let popup = null;
        try { popup = window.open('', HOST_WINDOW_NAME, 'popup,width=430,height=760,resizable=yes,scrollbars=yes'); } catch (_) {}
        try { popup?.focus?.(); } catch (_) {}
        return popup;
    }

    function recorderShortcutAction(event) {
        const settings = recorderSettings();
        const order = ['start','bar','pause','mic','camera','cameraFullscreen','screenAudio','float','marker','shortcuts'];
        return order.find(action => shortcutMatches(event, settings.shortcuts[action])) || '';
    }

    function showRecorderShortcutFeedback(message, type = '') {
        try {
            if (typeof showFeatureToast === 'function') {
                showFeatureToast(String(message || ''));
                return;
            }
        } catch (_) {}
        if (IS_RECORDER_HOST) setMessage(message, type);
    }

    async function runRecorderShortcut(action) {
        if (!action) return;
        if (action === 'shortcuts') { openShortcutsModal(); return; }
        if (action === 'bar') {
            if (state.phase === 'idle') {
                await launchInlineRecorder('');
                state.dockVisibleV750=true;
                ensureFallbackDock();
                q('#loggy-recorder-dock-v710')?.classList.remove('hidden');
                renderController();
                return;
            }
            const dock=q('#loggy-recorder-dock-v710');
            if (dock) {
                const willShow=dock.classList.contains('hidden');
                dock.classList.toggle('hidden',!willShow);
                state.dockVisibleV750=willShow;
            } else { ensureFallbackDock(); renderController(); }
            return;
        }
        if (action === 'start') {
            if (state.phase === 'idle') {
                await launchInlineRecorder('');
                if (state.phase === 'ready') await beginCapture();
                return;
            }
            if (state.phase === 'ready') return beginCapture();
            if (state.phase === 'recording' || state.phase === 'paused') return stopRecording();
            if (state.phase === 'countdown' || state.phase === 'stopping') { setMessage('Recording is still starting or saving.'); return; }
            if (state.phase === 'preview') { setMessage('Close, upload, discard, or retake this recording before starting another.', 'error'); return; }
        }
        if (action === 'pause') return togglePause();
        if (action === 'mic') return toggleMicrophone();
        if (action === 'camera') return toggleCamera();
        if (action === 'cameraFullscreen') return toggleCameraFullscreenV750();
        if (action === 'screenAudio') return toggleScreenAudio();
        if (action === 'float') return toggleFloatControls();
        if (action === 'marker') return addMarker();
    }

    function installRecorderShortcutRuntime() {
        if (window.__loggyRecorderShortcutsBoundV715) return;
        window.__loggyRecorderShortcutsBoundV715 = true;
        document.addEventListener('keydown', event => {
            if (event.repeat || event.isComposing) return;
            // Let the shortcut editor capture the next key combination instead
            // of accidentally running the shortcut it is trying to replace.
            if (document.querySelector?.('[data-rec-shortcut-key].capturing')) return;
            const action = recorderShortcutAction(event);
            if (!action) return;
            event.preventDefault();
            event.stopImmediatePropagation();
            Promise.resolve(runRecorderShortcut(action)).catch(error => {
                const message = error?.name === 'NotAllowedError'
                    ? 'Screen sharing was cancelled or blocked. Try the shortcut again and choose a screen or browser window.'
                    : (error?.message || 'Recorder shortcut failed.');
                if (IS_RECORDER_HOST) setMessage(message, 'error');
                else showRecorderShortcutFeedback(message, 'error');
            });
        }, true);
    }

    function installRecorderChannelRuntime() {
        if (!recorderChannel || window.__loggyRecorderChannelBoundV715) return;
        window.__loggyRecorderChannelBoundV715 = true;
        recorderChannel.addEventListener('message', event => {
            const message = event.data || {};
            if (message.type === 'hard-stop-preview-v919') {
                hardStopPreviewPlaybackV919(document);
                return;
            }
            if (message.type === 'request-page-camera-visibility-v908') {
                if (!IS_RECORDER_HOST) publishPageCameraVisibilityV908();
                return;
            }
            if (message.type === 'page-camera-visibility-v908') {
                if (IS_RECORDER_HOST) {
                    const incomingId = String(message.sourceId || '');
                    const current = state.sourcePageCameraV908 || {};
                    // Only a page that actually owns the floating camera may claim
                    // ownership; after that, its hidden/visible updates keep using
                    // the same source id.
                    if (message.hasCamera || (incomingId && incomingId === current.sourceId)) {
                        state.sourcePageCameraV908 = {
                            sourceId:incomingId,
                            visible:!!message.visible,
                            hasCamera:!!message.hasCamera,
                            timestamp:Number(message.timestamp || Date.now())
                        };
                    }
                }
                return;
            }
            if (message.type === 'settings-changed') {
                clientSettingsCache = null;
                if (IS_RECORDER_HOST) renderController();
                return;
            }
            if (IS_RECORDER_HOST && message.type === 'save-recording-for-dashboard') {
                saveRecordingForDashboard().then(() => {
                    recorderChannel.postMessage({type:'dashboard-recording-saved', requestId:message.requestId, ok:true});
                }).catch(error => {
                    recorderChannel.postMessage({type:'dashboard-recording-saved', requestId:message.requestId, ok:false, error:error?.message || 'Could not save the recording.'});
                });
                return;
            }
            if (!IS_RECORDER_HOST || message.type !== 'command') return;
            const action = String(message.action || '');
            // These commands do not require a fresh browser permission gesture.
            const allowed = ['pause','mic','camera','cameraFullscreen','screenAudio','marker','start'];
            if (!allowed.includes(action)) return;
            Promise.resolve(runRecorderShortcut(action)).catch(error => setMessage(error?.message || 'Recorder command failed.', 'error'));
        });
    }

    function bindController(root, pip) {
        // V720: controllerRoot survives every render; using addEventListener here
        // stacked duplicate click handlers on every render (gear toggled twice,
        // camera toggled on/off immediately, Stop could fire repeatedly). One
        // authoritative onclick handler fixes those apparent no-op/freeze bugs.
        root.onclick = event => {
            const action = event.target.closest('[data-rec-action]')?.dataset.recAction;
            if (!action) return;
            if (action === 'close') return closeControllerOnly();
            if (action === 'float') return Promise.resolve(toggleFloatControls()).catch(error=>setMessage(error.message || 'Floating controls are not available in this browser.', 'error'));
            if (action === 'record') return Promise.resolve(['recording','paused'].includes(state.phase) ? stopRecording() : beginCapture()).catch(error => setMessage(error.message || 'Recorder action failed.', 'error'));
            if (action === 'pause') return togglePause();
            if (action === 'mic') return toggleMicrophone();
            if (action === 'camera') return toggleCamera();
            if (action === 'cameraFullscreen') return toggleCameraFullscreenV750();
            if (action === 'screenAudio') return toggleScreenAudio();
            if (action === 'marker') return addMarker();
            if (action === 'settings') {
                return Promise.resolve(openRecorderClientSettingsV750()).catch(error=>setMessage(error?.message || 'Could not open recorder settings.', 'error'));
            }
            if (action === 'shortcuts') {
                if (pip) q('[data-rec-shortcuts-panel]', root)?.classList.toggle('open');
                else openShortcutsModal();
                return;
            }
            if (action === 'youtube') return openRecorderSettingsModal();
            if (action === 'recover') return openRecoveryModal();
        };
        // V754: ranges must repaint during pointer movement, not only on release.
        qa('[data-rec-setting="size"]', root).forEach(slider=>slider.addEventListener('input',()=>{
            const settings=recorderSettings();
            settings.appearance.size=Math.max(10,Math.min(40,Number(slider.value)||14));
            qa('[data-rec-layout]',root).forEach(layout=>applyPreviewBubbleGeometryV734(layout,q('[data-rec-bubble]',layout)));
            qa('[data-rec-setting="size"]',root).forEach(other=>{if(other!==slider)other.value=String(settings.appearance.size)});
            syncFloatingCameraV720();
            // drawCamera() reads the same appearance object on every animation
            // frame, so the actual recording changes size immediately too.
            saveSettings();
        }));
        qa('[data-rec-setting]', root).forEach(input => input.addEventListener('change', () => {
            const settings = recorderSettings();
            const key = input.dataset.recSetting;
            let value = input.value;
            if (key === 'size' || key === 'countdown' || key === 'borderWidth') value = Number(value);
            if (key === 'mirror' || key === 'shadow' || key === 'hideBarFromRecording') value = value === 'true';
            settings.appearance[key] = value;
            saveSettings();
            if (key === 'hideBarFromRecording') {
                if (value && !['countdown','recording','paused','stopping'].includes(state.phase)) {
                    openDetachedControlsV734({activate:false});
                } else {
                    syncControlSurfaceV734({userGesture:true});
                }
                renderController();
                return;
            }
            if (key === 'voiceCleanup') {
                applyVoiceCleanupToActiveMic(true).catch(error => setMessage(error.message || 'Could not change voice cleanup.', 'error'));
                return;
            }
            renderController();
        }));
        q('[data-rec-position-preset]', root)?.addEventListener('change', event => {
            const presets = { tl:[18,22], tr:[82,22], bl:[18,78], br:[82,78] };
            const point = presets[event.target.value];
            if (!point) return;
            const settings = recorderSettings();
            settings.appearance.x = point[0];
            settings.appearance.y = point[1];
            saveSettings();
            renderController();
        });
        qa('[data-rec-bar-toggle-v734]', root).forEach(input => input.addEventListener('change', () => {
            const key = String(input.dataset.recBarToggleV734 || '');
            if (!BAR_CONTROLS_V734.some(([action]) => action === key)) return;
            recorderSettings().appearance.barButtons[key] = !!input.checked;
            saveSettings();
            renderController();
        }));
        bindShortcutEditors(root);
        bindLayoutDrag(root);
        q('[data-rec-camera-device]', root)?.addEventListener('change', event => switchCamera(event.target.value));
        q('[data-rec-mic-device]', root)?.addEventListener('change', event => switchMicrophone(event.target.value));
    }

    function bindLayoutDrag(root) {
        const layout = q('[data-rec-layout]', root);
        const bubble = q('[data-rec-bubble]', root);
        if (!layout || !bubble) return;
        const update = event => {
            const rect = layout.getBoundingClientRect();
            let sourceW = Number(state.canvas?.width || 0), sourceH = Number(state.canvas?.height || 0);
            try {
                const ts = state.displayStream?.getVideoTracks?.()[0]?.getSettings?.() || {};
                sourceW = Number(ts.width || sourceW);
                sourceH = Number(ts.height || sourceH);
            } catch (_) {}
            let x, y;
            if (sourceW > 0 && sourceH > 0) {
                const content = captureContentRectV734(sourceW, sourceH);
                const px = ((event.clientX - rect.left) / Math.max(1, rect.width)) * sourceW;
                const py = ((event.clientY - rect.top) / Math.max(1, rect.height)) * sourceH;
                x = Math.max(5, Math.min(95, ((px - content.x) / Math.max(1, content.w)) * 100));
                y = Math.max(5, Math.min(95, ((py - content.y) / Math.max(1, content.h)) * 100));
            } else {
                x = Math.max(5, Math.min(95, ((event.clientX - rect.left) / Math.max(1, rect.width)) * 100));
                y = Math.max(5, Math.min(95, ((event.clientY - rect.top) / Math.max(1, rect.height)) * 100));
            }
            const settings = recorderSettings();
            settings.appearance.x = x;
            settings.appearance.y = y;
            applyPreviewBubbleGeometryV734(layout, bubble);
        };
        bubble.addEventListener('pointerdown', event => {
            event.preventDefault();
            bubble.setPointerCapture?.(event.pointerId);
            bubble.classList.add('dragging');
            update(event);
        });
        bubble.addEventListener('pointermove', event => {
            if (!bubble.hasPointerCapture?.(event.pointerId)) return;
            update(event);
        });
        bubble.addEventListener('pointerup', event => {
            if (bubble.hasPointerCapture?.(event.pointerId)) bubble.releasePointerCapture?.(event.pointerId);
            bubble.classList.remove('dragging');
            saveSettings();
        });
    }

    async function populateDeviceSelectors(root) {
        if (!navigator.mediaDevices?.enumerateDevices) return;
        let devices = [];
        try { devices = await navigator.mediaDevices.enumerateDevices(); } catch (_) { return; }
        const cameras = devices.filter(d => d.kind === 'videoinput');
        const mics = devices.filter(d => d.kind === 'audioinput');
        const camSelect = q('[data-rec-camera-device]', root);
        const micSelect = q('[data-rec-mic-device]', root);
        const currentCam = state.cameraStream?.getVideoTracks?.()[0]?.getSettings?.().deviceId || '';
        const currentMic = state.micStream?.getAudioTracks?.()[0]?.getSettings?.().deviceId || '';
        if (camSelect) camSelect.innerHTML = cameras.map((d,i)=>`<option value="${esc(d.deviceId)}" ${d.deviceId===currentCam?'selected':''}>${esc(d.label || `Camera ${i+1}`)}</option>`).join('');
        if (micSelect) micSelect.innerHTML = mics.map((d,i)=>`<option value="${esc(d.deviceId)}" ${d.deviceId===currentMic?'selected':''}>${esc(d.label || `Microphone ${i+1}`)}</option>`).join('');
    }

    function voiceCleanupMode() {
        const mode = String(recorderSettings().appearance.voiceCleanup || 'standard');
        return ['off','standard','strong'].includes(mode) ? mode : 'standard';
    }

    function microphoneConstraints(deviceId = '') {
        const mode = voiceCleanupMode();
        const cleanupOn = mode !== 'off';
        const audio = {
            echoCancellation: cleanupOn,
            noiseSuppression: cleanupOn,
            autoGainControl: cleanupOn,
            channelCount: { ideal: 1 },
            sampleRate: { ideal: 48000 }
        };
        if (deviceId) audio.deviceId = { exact: deviceId };
        return audio;
    }

    function voiceCleanupDescription(mode = voiceCleanupMode()) {
        if (mode === 'off') return 'Voice cleanup off: the recorder uses the microphone with browser cleanup disabled when the browser allows it.';
        if (mode === 'strong') return 'Strong voice cleanup: browser noise suppression plus Loggy voice filtering and an adaptive noise gate. Loud overlapping voices can still be captured.';
        return 'Standard voice cleanup: uses the browser’s echo cancellation, noise suppression, and automatic gain control when supported.';
    }

    async function applyVoiceCleanupToActiveMic(showMessage = true) {
        const track = state.micStream?.getAudioTracks?.()[0];
        if (!track) {
            if (showMessage) setMessage(voiceCleanupDescription());
            return;
        }
        const mode = voiceCleanupMode();
        const cleanupOn = mode !== 'off';
        try {
            await track.applyConstraints?.({
                echoCancellation: cleanupOn,
                noiseSuppression: cleanupOn,
                autoGainControl: cleanupOn
            });
        } catch (_) {
            // Browsers ignore unsupported getUserMedia constraints, but some
            // implementations reject applyConstraints for individual settings.
        }
        attachMicAudio();
        if (showMessage) setMessage(voiceCleanupDescription(mode), mode === 'strong' ? 'success' : '');
        renderController();
    }

    async function beginCapture() {
        if (state.phase !== 'ready' || !state.destination) return;
        if (!navigator.mediaDevices?.getDisplayMedia || !window.MediaRecorder) {
            throw new Error('This browser does not support the required screen-recording APIs.');
        }
        state.phase = 'countdown';
        setMessage(/Edg\//i.test(navigator.userAgent||'') ? 'Choose the Edge window or Entire Screen you want to record. Loggy will keep the selected surface live while you switch tabs.' : 'Choose the browser window or screen you want to record.');
        renderController();

        // Every new recording requests a fresh share target. Never reuse an old
        // display track/session, because the user must be able to choose the screen/window each time.
        try { state.displayStream?.getTracks?.().forEach(track => track.stop()); } catch (_) {}
        state.displayStream = null;
        let displayStream;
        try {
            displayStream = await navigator.mediaDevices.getDisplayMedia({
                video: { width:{ideal:1920}, height:{ideal:1080}, frameRate:{ideal:30, max:30}, resizeMode:'none' },
                audio: true,
                preferCurrentTab: false,
                selfBrowserSurface: 'exclude',
                surfaceSwitching: 'include',
                systemAudio: 'include',
                monitorTypeSurfaces: 'include'
            });
        } catch (error) {
            state.phase = 'ready';
            syncControlSurfaceV734();
            renderController();
            throw error;
        }
        state.displayStream = displayStream;

        // V908: Keep the draggable camera visible on the Loggy page during
        // recording. Ask the source page for its current visibility so the host
        // can skip its compositor camera only while that visible page-camera is
        // already present inside the shared screen/window.
        try { recorderChannel?.postMessage({type:'request-page-camera-visibility-v908'}); } catch (_) {}

        // V906: keep the browser-selected capture surface as-is. Edge/Chromium
        // window and monitor capture are supported; do not reject them based on browser.


        try {
            const ua=String(navigator.userAgent||'');
            const settings=displayStream.getVideoTracks?.()[0]?.getSettings?.()||{};
            if (/Edg\//i.test(ua)) {
                const surface=String(settings.displaySurface||'').toLowerCase();
                setMessage(surface ? `Recording ${surface}. Switch Edge tabs normally; the selected surface should update live.` : 'Recording the selected Edge surface. Switch tabs normally; it should update live.');
            }
        } catch (_) {}

        syncControlSurfaceV734();

        if (!cameraStreamIsLiveV720()) await ensureCameraStreamV720(false);
        if (!state.micStream?.getAudioTracks?.().some(track=>track.readyState==='live')) {
            try { state.micStream = await navigator.mediaDevices.getUserMedia({ audio:microphoneConstraints(), video:false }); }
            catch (_) { state.micStream = null; }
        }
        syncFloatingCameraV720();
        state.deviceInfoReady = true;

        const mimeType = chooseRecorderMime();
        const response = await fetch('/api/recorder/session', {
            method:'POST',
            headers:{'Content-Type':'application/json'},
            body:JSON.stringify({
                hobby:state.destination.hobby,
                day:state.destination.day,
                slot:state.destination.slot,
                title:youtubeTitleForDestination(state.destination),
                mimeType
            })
        });
        const sessionResult = await response.json().catch(()=>({}));
        if (!response.ok) {
            stopAllMedia();
            state.phase = 'ready';
            throw new Error(sessionResult.message || 'Could not create the recording session.');
        }
        state.session = sessionResult.session;
        state.chunkQueue = Promise.resolve();
        state.chunkIndex = 0;
        state.localChunks = new Map();
        state.uploadedChunkIndexes = new Set();
        state.chunkError = null;
        state.finalizePromise = null;
        state.markers = [];
        state.pausedTotal = 0;
        state.pausedAt = 0;
        state.activeElapsedMs = 0;
        state.segmentStartedAt = 0;
        state.stopRequested = false;

        await createCompositeStream();
        renderController();
        const countdown = Number(recorderSettings().appearance.countdown || 0);
        if (countdown > 0) await runCountdown(countdown);
        if (state.stopRequested) return;
        startMediaRecorder(mimeType);
    }

    function chooseRecorderMime() {
        const candidates = [
            'video/webm;codecs=vp9,opus',
            'video/webm;codecs=vp8,opus',
            'video/webm'
        ];
        return candidates.find(type => MediaRecorder.isTypeSupported?.(type)) || '';
    }

    async function createCompositeStream() {
        const screenTrack = state.displayStream?.getVideoTracks?.()[0];
        if (!screenTrack) throw new Error('No screen video track was selected.');
        // Always encode Full HD, even if capture begins with a smaller window.
        // Keep this surface stable while the shared window changes size; the
        // existing contained-frame renderer preserves the source aspect ratio.
        const canvas = document.createElement('canvas');
        canvas.width = 1920;
        canvas.height = 1080;
        state.canvas = canvas;
        state.ctx = canvas.getContext('2d', { alpha:false, desynchronized:true });
        state.ctx.imageSmoothingEnabled = true;
        state.ctx.imageSmoothingQuality = 'high';

        // V906: Keep the display-capture video attached to the document for the
        // entire session. Chromium/Edge can throttle or stop repainting an
        // off-DOM MediaStream video while the captured browser window changes
        // tabs. A tiny transparent rendered element keeps the decoder/compositor
        // live without showing a second preview to the user.
        state.screenVideo = document.createElement('video');
        state.screenVideo.muted = true;
        state.screenVideo.autoplay = true;
        state.screenVideo.playsInline = true;
        state.screenVideo.disablePictureInPicture = true;
        state.screenVideo.setAttribute('aria-hidden','true');
        state.screenVideo.dataset.loggyCaptureSourceV906 = '1';
        Object.assign(state.screenVideo.style, {
            position:'fixed',
            left:'-4px',
            top:'-4px',
            width:'2px',
            height:'2px',
            opacity:'0.001',
            pointerEvents:'none',
            zIndex:'-2147483647'
        });
        state.screenVideo.srcObject = state.displayStream;
        document.body.appendChild(state.screenVideo);
        try { screenTrack.contentHint = 'detail'; } catch (_) {}
        await state.screenVideo.play();

        // V907: Keep the compositor camera decoder attached to the document too.
        // Chromium/Edge and Firefox-family browsers may stop advancing an
        // unattached MediaStream video while the Loggy tab is backgrounded.
        // The recorder still draws this source into the canvas; the tiny DOM
        // element is effectively invisible and is never the user-facing preview.
        state.cameraVideo = document.createElement('video');
        state.cameraVideo.muted = true;
        state.cameraVideo.autoplay = true;
        state.cameraVideo.playsInline = true;
        state.cameraVideo.disablePictureInPicture = true;
        state.cameraVideo.setAttribute('aria-hidden','true');
        state.cameraVideo.dataset.loggyCameraSourceV907 = '1';
        Object.assign(state.cameraVideo.style, {
            position:'fixed',
            left:'-4px',
            top:'-4px',
            width:'2px',
            height:'2px',
            opacity:'0.001',
            pointerEvents:'none',
            zIndex:'-2147483647'
        });
        if (state.cameraStream?.getVideoTracks?.().length) {
            try { state.cameraStream.getVideoTracks()[0].contentHint = 'motion'; } catch (_) {}
            state.cameraVideo.srcObject = state.cameraStream;
        }
        document.body.appendChild(state.cameraVideo);
        if (state.cameraVideo.srcObject) await state.cameraVideo.play().catch(()=>{});

        const canvasStream = canvas.captureStream(30);
        // Hint the encoder on its actual input track, not only the source track.
        try { canvasStream.getVideoTracks()[0].contentHint = 'detail'; } catch (_) {}
        state.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        await state.audioContext.resume().catch(()=>{});
        state.audioDestination = state.audioContext.createMediaStreamDestination();
        attachScreenAudio();
        attachMicAudio();
        state.mixedStream = new MediaStream([
            ...canvasStream.getVideoTracks(),
            ...state.audioDestination.stream.getAudioTracks()
        ]);
        drawCompositeFrame();
        screenTrack.addEventListener('ended', () => {
            if (['recording','paused','countdown'].includes(state.phase)) stopRecording();
        }, { once:true });
    }

    function attachScreenAudio() {
        try { state.screenAudioSource?.disconnect(); } catch (_) {}
        try { state.screenAudioGain?.disconnect(); } catch (_) {}
        state.screenAudioSource = null;
        state.screenAudioGain = null;
        const tracks = state.displayStream?.getAudioTracks?.() || [];
        if (!tracks.length || !state.audioContext || !state.audioDestination) return;
        const stream = new MediaStream(tracks);
        state.screenAudioSource = state.audioContext.createMediaStreamSource(stream);
        state.screenAudioGain = state.audioContext.createGain();
        state.screenAudioGain.gain.value = 1;
        state.screenAudioSource.connect(state.screenAudioGain).connect(state.audioDestination);
    }

    function attachMicAudio() {
        const previousGain = state.micAudioGain?.gain?.value;
        try { state.micAudioSource?.disconnect(); } catch (_) {}
        try { state.micAudioGain?.disconnect(); } catch (_) {}
        try { state.micAnalyser?.disconnect?.(); } catch (_) {}
        try { state.micHighpass?.disconnect?.(); } catch (_) {}
        try { state.micLowpass?.disconnect?.(); } catch (_) {}
        try { state.micCompressor?.disconnect?.(); } catch (_) {}
        try { state.micGateGain?.disconnect?.(); } catch (_) {}
        state.micAudioSource = null;
        state.micAudioGain = null;
        state.micAnalyser = null;
        state.micLevelData = null;
        state.micHighpass = null;
        state.micLowpass = null;
        state.micCompressor = null;
        state.micGateGain = null;
        state.micStrongGateOpen = false;
        state.micStrongNoiseFloor = 0.012;

        const tracks = state.micStream?.getAudioTracks?.() || [];
        if (!tracks.length || !state.audioContext || !state.audioDestination) return;
        const stream = new MediaStream(tracks);
        state.micAudioSource = state.audioContext.createMediaStreamSource(stream);
        state.micAudioGain = state.audioContext.createGain();
        const trackEnabled = tracks.some(track => track.enabled !== false);
        state.micAudioGain.gain.value = previousGain === 0 || !trackEnabled ? 0 : 1;
        state.micAnalyser = state.audioContext.createAnalyser();
        state.micAnalyser.fftSize = 256;
        state.micAnalyser.smoothingTimeConstant = 0.65;
        state.micLevelData = new Uint8Array(state.micAnalyser.fftSize);
        state.micAudioSource.connect(state.micAnalyser);

        if (voiceCleanupMode() === 'strong') {
            // Local, dependency-free voice cleanup. Browser noise suppression is
            // still requested at capture time. This extra chain narrows the voice
            // band, smooths sudden level changes, and attenuates low-level room
            // sound between speech. It intentionally does not claim speaker ID.
            state.micHighpass = state.audioContext.createBiquadFilter();
            state.micHighpass.type = 'highpass';
            state.micHighpass.frequency.value = 85;
            state.micHighpass.Q.value = 0.65;

            state.micLowpass = state.audioContext.createBiquadFilter();
            state.micLowpass.type = 'lowpass';
            state.micLowpass.frequency.value = 9000;
            state.micLowpass.Q.value = 0.55;

            state.micCompressor = state.audioContext.createDynamicsCompressor();
            state.micCompressor.threshold.value = -38;
            state.micCompressor.knee.value = 18;
            state.micCompressor.ratio.value = 3.5;
            state.micCompressor.attack.value = 0.004;
            state.micCompressor.release.value = 0.18;

            state.micGateGain = state.audioContext.createGain();
            state.micGateGain.gain.value = 0.18;

            state.micAudioSource
                .connect(state.micHighpass)
                .connect(state.micLowpass)
                .connect(state.micCompressor)
                .connect(state.micGateGain)
                .connect(state.micAudioGain)
                .connect(state.audioDestination);
        } else {
            state.micAudioSource.connect(state.micAudioGain).connect(state.audioDestination);
        }
    }

    function updateStrongVoiceGate(rms) {
        if (voiceCleanupMode() !== 'strong' || !state.micGateGain || !state.audioContext) return;
        const now = state.audioContext.currentTime;
        const floor = Math.max(0.004, Math.min(0.05, Number(state.micStrongNoiseFloor || 0.012)));

        // Learn the quiet-room floor only while the signal is near the current
        // floor. This prevents a loud voice/scream from being learned as noise.
        if (rms < floor * 1.9) {
            state.micStrongNoiseFloor = floor * 0.985 + Math.max(0.003, rms) * 0.015;
        }
        const learnedFloor = Math.max(0.004, Math.min(0.05, Number(state.micStrongNoiseFloor || floor)));
        const openThreshold = Math.max(0.022, learnedFloor * 2.8);
        const closeThreshold = Math.max(0.012, learnedFloor * 1.75);

        if (!state.micStrongGateOpen && rms >= openThreshold) state.micStrongGateOpen = true;
        else if (state.micStrongGateOpen && rms <= closeThreshold) state.micStrongGateOpen = false;

        // Never hard-mute the closed gate. A low floor avoids chopping quiet
        // syllables while still reducing room/background sound between phrases.
        const target = state.micStrongGateOpen ? 1 : 0.16;
        try {
            state.micGateGain.gain.cancelScheduledValues(now);
            state.micGateGain.gain.setTargetAtTime(target, now, state.micStrongGateOpen ? 0.018 : 0.11);
        } catch (_) {
            state.micGateGain.gain.value = target;
        }
    }

    // V778: one authoritative test for BOTH the settings preview and recorded
    // canvas. Never infer whether capture includes the camera from whether the
    // floating DOM element happens to be present (Settings previously removed
    // the element, causing a second camera to be composited into recordings).
    function captureContainsPageCameraV778() {
        if (IS_RECORDER_HOST || !cameraEnabled()) return false;
        const track = state.displayStream?.getVideoTracks?.().find(t => t.readyState === 'live');
        if (!track) return false;
        const settings=track.getSettings?.() || {};
        const surface=String(settings.displaySurface || '').toLowerCase();
        const dpr=Math.max(1,Number(devicePixelRatio)||1);
        const close=(a,b)=>a>0&&b>0&&Math.abs(a-b)<=Math.max(80,b*.16);
        const tw=Number(settings.width||0), th=Number(settings.height||0);
        if (surface==='window') {
            const ow=Number(window.outerWidth||0)*dpr, oh=Number(window.outerHeight||0)*dpr;
            return close(tw,ow) && close(th,oh);
        }
        if (surface==='monitor') {
            const sw=Number(screen.width||0)*dpr, sh=Number(screen.height||0)*dpr;
            return close(tw,sw) && close(th,sh);
        }
        if (surface==='browser') {
            // A capture handle, when exposed by the browser, identifies the
            // captured tab. Tab titles provide a fallback for Firefox/Chrome.
            let handle=null;
            try { handle=track.getCaptureHandle?.(); } catch (_) {}
            const origin=String(handle?.origin||'');
            const selfOrigin=String(location.origin||'');
            if (origin && origin===selfOrigin) return true;
            const label=String(track.label||'').toLowerCase().trim();
            const title=String(document.title||'').toLowerCase().trim();
            if (label && title && title.length>=5 && label.includes(title)) return true;
            return false;
        }
        return false;
    }

    function shouldCompositeCameraV750() {
        if (IS_RECORDER_HOST) {
            const source = state.sourcePageCameraV908 || {};
            const freshVisiblePreview = !!source.visible && !!source.hasCamera &&
                (Date.now() - Number(source.timestamp || 0) < 3500);
            // If the Loggy source tab is visibly showing its draggable camera,
            // that camera is already in the shared pixels. Everywhere else, draw
            // the host-owned camera so it continues across Claude/Bookit/etc.
            return !freshVisiblePreview;
        }
        // V909: while this Loggy tab is actually visible, its floating camera
        // is already part of the captured browser/window/screen pixels. Do not
        // paint a second copy into the recording. Once the user switches to a
        // different browser tab, this document becomes hidden, so composite the
        // same live camera source into the recording instead.
        const pagePreviewVisible = document.visibilityState === 'visible' && !document.hidden &&
            !!floatingCameraElementV720() && cameraStreamIsLiveV720();
        return !pagePreviewVisible;
    }

    function drawFullscreenCameraV750(ctx,w,h) {
        const video=state.cameraVideo;
        if (!video || video.readyState < 2) { ctx.fillStyle='#111';ctx.fillRect(0,0,w,h);return; }
        const vw=Math.max(1,video.videoWidth||w), vh=Math.max(1,video.videoHeight||h);
        const scale=Math.max(w/vw,h/vh), sw=w/scale, sh=h/scale, sx=(vw-sw)/2, sy=(vh-sh)/2;
        ctx.save();
        if (recorderSettings().appearance.mirror) { ctx.translate(w,0);ctx.scale(-1,1); }
        try { ctx.drawImage(video,sx,sy,sw,sh,0,0,w,h); } catch (_) { ctx.fillStyle='#111';ctx.fillRect(0,0,w,h); }
        ctx.restore();
    }

    function currentScreenAspectV904() {
        const video = state.screenVideo;
        const track = state.displayStream?.getVideoTracks?.()[0];
        const settings = track?.getSettings?.() || {};
        const sw = Number(settings.width || 0);
        const sh = Number(settings.height || 0);
        if (sw > 0 && sh > 0) return sw / sh;
        const vw = Number(video?.videoWidth || 0);
        const vh = Number(video?.videoHeight || 0);
        if (vw > 0 && vh > 0) return vw / vh;
        return 16 / 9;
    }

    function drawScreenContainedV904(ctx, video, canvasW, canvasH) {
        if (!video || video.readyState < 2) {
            ctx.fillStyle = '#000';
            ctx.fillRect(0, 0, canvasW, canvasH);
            return;
        }

        // Always clear the previous frame first because a narrow shared window
        // legitimately leaves side bars inside the stable 16:9 recording.
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, canvasW, canvasH);

        const sourceAspect = Math.max(.1, currentScreenAspectV904());
        const canvasAspect = canvasW / canvasH;
        let dw, dh, dx, dy;
        if (sourceAspect > canvasAspect) {
            dw = canvasW;
            dh = dw / sourceAspect;
            dx = 0;
            dy = (canvasH - dh) / 2;
        } else {
            dh = canvasH;
            dw = dh * sourceAspect;
            dy = 0;
            dx = (canvasW - dw) / 2;
        }

        try {
            // Draw the full captured frame into a destination rectangle that
            // matches the shared surface's *current* aspect ratio.  This also
            // corrects browsers that keep videoWidth/videoHeight at the initial
            // capture size while getSettings() updates after a window resize.
            ctx.drawImage(video, 0, 0, Math.max(1, video.videoWidth || 1), Math.max(1, video.videoHeight || 1), dx, dy, dw, dh);
        } catch (_) {
            ctx.fillStyle = '#000';
            ctx.fillRect(0, 0, canvasW, canvasH);
        }
    }

    function scheduleCompositeFrameV909() {
        if (!state.screenVideo || !state.canvas || !state.ctx) return;
        // requestVideoFrameCallback follows frames arriving from getDisplayMedia
        // instead of the Loggy tab's visual animation clock. This is important
        // when the user switches away from the Loggy tab: requestAnimationFrame
        // is heavily throttled/paused in background tabs, which froze the screen
        // and camera in Edge. Keep a timer fallback for browsers without rVFC.
        if (typeof state.screenVideo.requestVideoFrameCallback === 'function') {
            state.animationId = state.screenVideo.requestVideoFrameCallback(() => drawCompositeFrame());
        } else {
            state.animationId = setTimeout(drawCompositeFrame, 33);
        }
    }

    function drawCompositeFrame() {
        if (!state.canvas || !state.ctx || !state.screenVideo) return;
        const ctx = state.ctx, w = state.canvas.width, h = state.canvas.height;
        if (state.cameraFullscreenV750 && cameraEnabled() && shouldCompositeCameraV750()) {
            drawFullscreenCameraV750(ctx,w,h);
        } else {
            drawScreenContainedV904(ctx, state.screenVideo, w, h);
            if (cameraEnabled() && state.cameraVideo?.readyState >= 2 && shouldCompositeCameraV750()) drawCamera(ctx, w, h);
        }
        updateMicMeter();
        scheduleCompositeFrameV909();
    }

    function updateMicMeter() {
        const now = performance.now();
        if (now - state.lastMicMeterAt < 80) return;
        state.lastMicMeterAt = now;
        let level = 0;
        if (state.micAnalyser && state.micLevelData && (state.micAudioGain?.gain?.value ?? 0) !== 0) {
            state.micAnalyser.getByteTimeDomainData(state.micLevelData);
            let sum = 0;
            for (const value of state.micLevelData) {
                const sample = (value - 128) / 128;
                sum += sample * sample;
            }
            const rms = Math.sqrt(sum / state.micLevelData.length);
            updateStrongVoiceGate(rms);
            level = Math.min(1, rms * 4.5);
        }
        const width = `${Math.round(level * 100)}%`;
        const docs = [document, state.controllerDocument].filter(Boolean);
        docs.forEach(doc => qa('[data-rec-mic-meter-bar]', doc).forEach(bar => { bar.style.width = width; }));
    }

    function cameraEnabled() {
        const track = state.cameraStream?.getVideoTracks?.()[0];
        return !!track && track.readyState === 'live' && track.enabled !== false;
    }

    function drawCamera(ctx, canvasW, canvasH) {
        const a = recorderSettings().appearance;
        const content = captureContentRectV734(canvasW, canvasH);
        const width = content.w * (a.size / 100);
        let aspect = 1;
        if (a.shape === 'portrait') aspect = 3/4;
        if (a.shape === 'pill') aspect = 1.55;
        const height = width / aspect;
        let x = content.x + content.w * (a.x / 100) - width / 2;
        let y = content.y + content.h * (a.y / 100) - height / 2;
        x = Math.max(content.x, Math.min(content.x + content.w - width, x));
        y = Math.max(content.y, Math.min(content.y + content.h - height, y));
        const radius = Math.min(width,height) * (a.shape === 'rounded' || a.shape === 'portrait' ? .2 : .5);
        ctx.save();
        drawShapePath(ctx, x, y, width, height, a.shape, radius);
        ctx.clip();
        const vx = x, vy = y;
        const vwOut = Math.max(1, width), vhOut = Math.max(1, height);
        const v = state.cameraVideo;
        const vw = Number(v.videoWidth || v.width || 16), vh = Number(v.videoHeight || v.height || 9);
        const srcAspect = vw / vh;
        const dstAspect = vwOut / vhOut;
        let sx=0, sy=0, sw=vw, sh=vh;
        if (srcAspect > dstAspect) { sw = vh * dstAspect; sx = (vw - sw) / 2; }
        else { sh = vw / dstAspect; sy = (vh - sh) / 2; }
        if (a.mirror) { ctx.translate(vx + vwOut, vy); ctx.scale(-1,1); ctx.drawImage(v,sx,sy,sw,sh,0,0,vwOut,vhOut); }
        else ctx.drawImage(v,sx,sy,sw,sh,vx,vy,vwOut,vhOut);
        ctx.restore();
        ctx.save();
        drawShapePath(ctx, x, y, width, height, a.shape, radius);
        if (a.borderWidth > 0) {
            ctx.lineWidth = Math.max(1, content.w / 1280 * a.borderWidth * 2);
            ctx.strokeStyle = a.borderColor || '#ffffff';
            if (a.shadow) {
                ctx.shadowColor = 'rgba(0,0,0,.28)';
                ctx.shadowBlur = Math.max(4, content.w / 180);
            }
            ctx.stroke();
        }
        ctx.restore();
    }

    function drawShapePath(ctx, x, y, w, h, shape, radius) {
        ctx.beginPath();
        if (shape === 'circle' || shape === 'pill') {
            const r = Math.min(w,h)/2;
            if (shape === 'circle') { ctx.ellipse(x+w/2,y+h/2,r,r,0,0,Math.PI*2); return; }
            roundRectPath(ctx,x,y,w,h,r); return;
        }
        if (shape === 'blob') {
            ctx.moveTo(x+w*.50,y);
            ctx.bezierCurveTo(x+w*.82,y,x+w,y+h*.18,x+w,y+h*.46);
            ctx.bezierCurveTo(x+w,y+h*.80,x+w*.75,y+h,x+w*.45,y+h);
            ctx.bezierCurveTo(x+w*.15,y+h,x,y+h*.82,x,y+h*.52);
            ctx.bezierCurveTo(x,y+h*.20,x+w*.18,y,x+w*.50,y);
            ctx.closePath();
            return;
        }
        const shapes = {
            diamond:[[.5,0],[1,.5],[.5,1],[0,.5]]
        };
        if (shapes[shape]) {
            const points = shapes[shape];
            ctx.moveTo(x + points[0][0]*w,y + points[0][1]*h);
            for(let i=1;i<points.length;i++)ctx.lineTo(x+points[i][0]*w,y+points[i][1]*h);
            ctx.closePath();
            return;
        }
        if (shape === 'square') { ctx.rect(x,y,w,h); return; }
        roundRectPath(ctx,x,y,w,h,radius);
    }
    function roundRectPath(ctx,x,y,w,h,r) {
        r=Math.min(r,w/2,h/2); ctx.moveTo(x+r,y);ctx.lineTo(x+w-r,y);ctx.quadraticCurveTo(x+w,y,x+w,y+r);ctx.lineTo(x+w,y+h-r);ctx.quadraticCurveTo(x+w,y+h,x+w-r,y+h);ctx.lineTo(x+r,y+h);ctx.quadraticCurveTo(x,y+h,x,y+h-r);ctx.lineTo(x,y+r);ctx.quadraticCurveTo(x,y,x+r,y);ctx.closePath();
    }

    async function runCountdown(seconds) {
        let overlay = q('#loggy-recorder-countdown-v710');
        if (!overlay) { overlay = document.createElement('div'); overlay.id='loggy-recorder-countdown-v710'; overlay.className='loggy-recorder-countdown-v710'; document.body.appendChild(overlay); }
        for (let n=seconds; n>0; n-=1) {
            if (state.stopRequested) break;
            overlay.textContent = String(n);
            overlay.classList.remove('hidden');
            setMessage(`Recording starts in ${n}…`);
            await new Promise(resolve => setTimeout(resolve,1000));
        }
        overlay.classList.add('hidden');
    }

    async function uploadRecordingChunk(index, chunk, maxAttempts = 3) {
        let lastError = null;
        for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
            try {
                const response = await fetchWithTimeout(`/api/recorder/session/${state.session.id}/chunk?index=${index}`, {
                    method:'POST',
                    headers:{'Content-Type':'application/octet-stream'},
                    body:chunk
                }, 6000);
                if (!response.ok) {
                    const result = await response.json().catch(()=>({}));
                    throw new Error(result.message || 'Could not save a recording chunk.');
                }
                state.uploadedChunkIndexes.add(index);
                return;
            } catch (error) {
                lastError = error;
                if (attempt < maxAttempts) await new Promise(resolve => setTimeout(resolve, 300 * attempt));
            }
        }
        throw lastError || new Error('Could not save a recording chunk.');
    }

    async function flushPendingRecordingChunks() {
        try { await state.chunkQueue; } catch (_) {}
        const pending = Array.from(state.localChunks.entries())
            .filter(([index]) => !state.uploadedChunkIndexes.has(index))
            .sort((a,b) => a[0] - b[0]);
        for (const [index, chunk] of pending) {
            await uploadRecordingChunk(index, chunk, 2);
        }
        state.chunkError = null;
    }

    function startMediaRecorder(mimeType) {
        const options = mimeType ? { mimeType, videoBitsPerSecond: 12_000_000, audioBitsPerSecond: 160_000 } : { videoBitsPerSecond:12_000_000, audioBitsPerSecond:160_000 };
        state.recorder = new MediaRecorder(state.mixedStream, options);
        state.localChunks = new Map();
        state.uploadedChunkIndexes = new Set();
        state.chunkError = null;
        state.finalizePromise = null;
        state.recorder.ondataavailable = event => {
            if (!event.data || event.data.size === 0 || !state.session) return;
            const chunk = event.data;
            const index = state.chunkIndex++;
            state.localChunks.set(index, chunk);
            state.chunkQueue = state.chunkQueue.then(() => uploadRecordingChunk(index, chunk, 2));
            state.chunkQueue.catch(error => {
                state.chunkError = error;
                setMessage(`Recording is still running, but Loggy will retry saving buffered video when you stop: ${error.message}`, 'error');
            });
        };
        state.recorder.onstop = () => finalizeRecording().catch(error => setMessage(error.message || 'Could not finalize recording.', 'error'));
        state.recorder.onerror = event => {
            const message = event.error?.message || 'Recorder error.';
            setMessage(message, 'error');
            if (['recording','paused'].includes(state.phase)) stopRecording();
        };
        state.startedAt = performance.now();
        state.activeElapsedMs = 0;
        state.segmentStartedAt = state.startedAt;
        state.phase = 'recording';
        // Shorter chunks make Stop responsive and reduce the amount of data
        // waiting for a final dataavailable event.
        state.recorder.start(1000);
        startTimer();
        setMessage('Recording. Stop is always available in this bar or with your Stop shortcut.', 'success');
        renderController();
    }


    function elapsedMs() {
        const base = Math.max(0, Number(state.activeElapsedMs || 0));
        if (state.phase === 'recording' && state.segmentStartedAt) {
            return base + Math.max(0, performance.now() - state.segmentStartedAt);
        }
        return base;
    }
    function formatMs(ms) {
        const total = Math.max(0, Math.floor(Number(ms || 0) / 1000));
        const h = Math.floor(total/3600), m = Math.floor((total%3600)/60), s = total%60;
        return h ? `${h}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}` : `${m}:${String(s).padStart(2,'0')}`;
    }
    function startTimer() {
        clearInterval(state.timerId);
        state.timerId = setInterval(updateControllerStatusOnly, 250);
    }

    function togglePause() {
        if (!state.recorder) return;
        if (state.phase === 'recording' && state.recorder.state === 'recording') {
            const now = performance.now();
            if (state.segmentStartedAt) state.activeElapsedMs += Math.max(0, now - state.segmentStartedAt);
            state.segmentStartedAt = 0;
            try { state.recorder.pause(); } catch (_) {}
            state.pausedAt = now;
            state.phase = 'paused';
            setMessage('Paused. Paused time is not added to the recording timer.');
        } else if (state.phase === 'paused' && state.recorder.state === 'paused') {
            state.pausedAt = 0;
            try { state.recorder.resume(); } catch (_) {}
            state.segmentStartedAt = performance.now();
            state.phase = 'recording';
            setMessage('Recording resumed.', 'success');
        }
        renderController();
    }

    function toggleMicrophone() {
        if (!state.micStream) { setMessage('No microphone is active.', 'error'); return; }
        const on = (state.micAudioGain?.gain?.value ?? 1) !== 0;
        if (state.micAudioGain) state.micAudioGain.gain.value = on ? 0 : 1;
        state.micStream.getAudioTracks().forEach(track => track.enabled = !on);
        setMessage(on ? 'Microphone off.' : 'Microphone on.');
        renderController();
    }

    async function toggleCamera() {
        if (!cameraStreamIsLiveV720()) {
            await ensureCameraStreamV720(true);
            renderController();
            return;
        }
        const tracks = state.cameraStream.getVideoTracks();
        const on = tracks.some(track => track.enabled !== false);
        tracks.forEach(track => track.enabled = !on);
        if (on) state.cameraFullscreenV750 = false;
        setMessage(on ? 'Camera hidden from the recording.' : 'Camera visible in the recording.');
        syncFloatingCameraV720();
        renderController();
        syncControllerPreviewsV721(q('#loggy-recorder-bar-settings-modal-v750'));
    }

    function toggleScreenAudio() {
        if (!state.screenAudioGain) {
            setMessage('The selected screen/window did not provide an audio track. Choose a share source with audio enabled to record screen audio.', 'error');
            return;
        }
        const on = state.screenAudioGain.gain.value !== 0;
        state.screenAudioGain.gain.value = on ? 0 : 1;
        setMessage(on ? 'Screen audio off.' : 'Screen audio on.');
        renderController();
    }

    function addMarker() {
        if (!['recording','paused'].includes(state.phase)) return;
        const ms = elapsedMs();
        state.markers.push({ ms, label:`Marker ${state.markers.length + 1}` });
        setMessage(`Marker added at ${formatMs(ms)}.`, 'success');
        renderController();
    }

    async function switchCamera(deviceId) {
        const generation = cameraLifecycleGeneration;
        if (!deviceId || !navigator.mediaDevices?.getUserMedia) return;
        try {
            const next = await navigator.mediaDevices.getUserMedia({ video:{ deviceId:{exact:deviceId}, width:{ideal:1280}, height:{ideal:720} }, audio:false });
            if (generation !== cameraLifecycleGeneration) {
                next.getTracks().forEach(track => track.stop());
                return;
            }
            state.cameraStream?.getTracks?.().forEach(track => track.stop());
            state.cameraStream = next;
            if (state.cameraVideo) { state.cameraVideo.srcObject = next; await state.cameraVideo.play().catch(()=>{}); }
            state.deviceInfoReady = true;
            syncFloatingCameraV720();
            renderController();
        } catch (error) { setMessage(error.message || 'Could not switch camera.', 'error'); }
    }
    async function switchMicrophone(deviceId) {
        if (!deviceId || !navigator.mediaDevices?.getUserMedia) return;
        try {
            const next = await navigator.mediaDevices.getUserMedia({ audio:microphoneConstraints(deviceId), video:false });
            state.micStream?.getTracks?.().forEach(track => track.stop());
            state.micStream = next;
            attachMicAudio();
            state.deviceInfoReady = true;
            renderController();
        } catch (error) { setMessage(error.message || 'Could not switch microphone.', 'error'); }
    }

    function stopCaptureSources() {
        [state.displayStream,state.cameraStream,state.micStream].forEach(stream => {
            try { stream?.getTracks?.().forEach(track => track.stop()); } catch (_) {}
        });
    }

    function stopRecording() {
        if (state.phase === 'countdown') {
            state.stopRequested = true;
            state.phase = 'stopping';
            stopCaptureSources();
            stopAllMedia();
            removeFloatingCameraV720();
            if (state.session) fetch(`/api/recorder/session/${state.session.id}`, {method:'DELETE'}).catch(()=>{});
            state.session = null;
            state.phase = 'ready';
            syncControlSurfaceV734();
            setMessage('Recording cancelled before it started.');
            renderController();
            return;
        }
        if (!state.recorder || !['recording','paused'].includes(state.phase)) {
            if (state.phase === 'stopping') setMessage('Stopping and saving…');
            return;
        }

        const recorder = state.recorder;
        const wasPaused = state.phase === 'paused' || recorder.state === 'paused';
        const now = performance.now();
        if (state.phase === 'recording' && state.segmentStartedAt) {
            state.activeElapsedMs += Math.max(0, now - state.segmentStartedAt);
        }
        state.segmentStartedAt = 0;
        state.pausedAt = 0;
        state.stoppedAt = now;
        state.phase = 'stopping';
        clearInterval(state.timerId);
        setMessage('Stopping capture and saving the recording…');
        renderController();

        let stopIssued = false;
        const issueStop = () => {
            if (stopIssued) return;
            stopIssued = true;
            try { recorder.requestData(); } catch (_) {}
            try {
                if (recorder.state !== 'inactive') recorder.stop();
                else finalizeRecording().catch(error => setMessage(error.message || 'Could not finalize recording.', 'error'));
            } catch (_) {
                finalizeRecording().catch(error => setMessage(error.message || 'Could not finalize recording.', 'error'));
            }
            // End browser capture immediately after MediaRecorder has been asked
            // to flush. The final blob remains buffered by MediaRecorder.
            setTimeout(() => {
                stopCaptureSources();
                removeFloatingCameraV720();
            }, 0);
        };

        // A paused MediaRecorder can stall requestData()/stop() in some browser
        // builds. Resume it only for the flush microtask; elapsed time stays frozen.
        if (wasPaused && recorder.state === 'paused') {
            try { recorder.resume(); } catch (_) {}
            setTimeout(issueStop, 0);
        } else {
            issueStop();
        }

        clearTimeout(state.stopFallbackTimer);
        state.stopFallbackTimer = setTimeout(() => {
            if (state.phase === 'stopping' && !state.finalizePromise) {
                finalizeRecording().catch(error => setMessage(error.message || 'Could not finalize recording.', 'error'));
            }
        }, 1500);
    }

    function finalizeRecording() {
        if (state.finalizePromise) return state.finalizePromise;
        state.finalizePromise = (async () => {
            clearTimeout(state.stopFallbackTimer);
            state.phase = 'stopping';
            renderController();
            if (!state.session?.id) throw new Error('The recording session is missing.');
            try {
                await flushPendingRecordingChunks();
                const durationMs = elapsedMs();
                stopAllMedia();
                const response = await fetchWithTimeout(`/api/recorder/session/${state.session.id}/finish`, {
                    method:'POST', headers:{'Content-Type':'application/json'},
                    body:JSON.stringify({ durationMs, markers:state.markers, title:youtubeTitleForDestination(state.destination) })
                }, 20000);
                const result = await response.json().catch(()=>({}));
                if (!response.ok) throw new Error(result.message || 'Could not finalize the recording.');
                state.phase = 'preview';
                syncControlSurfaceV734();
                state.session = result.session;
                state.localChunks.clear();
                state.uploadedChunkIndexes.clear();
                state.chunkError = null;
                setMessage('Recording saved temporarily. Preview it and upload to YouTube.', 'success');
                renderController();
                if (!suppressAutomaticPreview) openPreviewModal(state.session, result.mediaUrl);
                return result;
            } catch (error) {
                stopAllMedia();
                state.phase = 'preview';
                syncControlSurfaceV734();
                setMessage(`Recording stopped, but Loggy could not confirm the final save: ${error.message}. Use Recover Recordings to retry or inspect the temporary recording.`, 'error');
                renderController();
                setTimeout(() => openRecoveryModal().catch(()=>{}), 0);
                throw error;
            }
        })();
        return state.finalizePromise;
    }


    function stopAllMedia() {
        cameraLifecycleGeneration++;
        try { cancelAnimationFrame(state.animationId); } catch (_) {}
        try { state.screenVideo?.cancelVideoFrameCallback?.(state.animationId); } catch (_) {}
        try { clearTimeout(state.animationId); } catch (_) {};
        state.animationId = 0;
        [state.displayStream,state.cameraStream,state.micStream,state.mixedStream].forEach(stream => {
            try { stream?.getTracks?.().forEach(track => track.stop()); } catch (_) {}
        });
        try { state.audioContext?.close?.(); } catch (_) {}
        state.displayStream = null;
        state.cameraStream = null;
        state.micStream = null;
        state.mixedStream = null;
        state.audioContext = null;
        state.audioDestination = null;
        state.screenAudioSource = null;
        state.screenAudioGain = null;
        state.micAudioSource = null;
        state.micAudioGain = null;
        state.micAnalyser = null;
        state.micLevelData = null;
        state.micHighpass = null;
        state.micLowpass = null;
        state.micCompressor = null;
        state.micGateGain = null;
        state.micStrongGateOpen = false;
        state.micStrongNoiseFloor = 0.012;
        state.lastMicMeterAt = 0;
        try { state.screenVideo?.pause?.(); } catch (_) {}
        try { state.screenVideo?.remove?.(); } catch (_) {}
        if (state.screenVideo) { try { state.screenVideo.srcObject = null; } catch (_) {} }
        state.screenVideo = null;
        try { state.cameraVideo?.pause?.(); } catch (_) {}
        try { state.cameraVideo?.remove?.(); } catch (_) {}
        if (state.cameraVideo) { try { state.cameraVideo.srcObject = null; } catch (_) {} }
        state.cameraVideo = null;
        state.canvas = null;
        state.ctx = null;
        state.deviceInfoReady = false;
        clearInterval(state.timerId);
        removeFloatingCameraV720();
    }

    function resetRecorderState() {
        stopAllMedia();
        state.phase = 'idle';
        state.destination = null;
        state.session = null;
        state.recorder = null;
        state.startedAt = 0;
        state.stoppedAt = 0;
        state.pausedAt = 0;
        state.pausedTotal = 0;
        state.activeElapsedMs = 0;
        state.segmentStartedAt = 0;
        state.markers = [];
        state.chunkIndex = 0;
        state.stopRequested = false;
        state.settingsOpen = false;
        state.cameraFullscreenV750 = false;
        state.dockVisibleV750 = true;
        closeDetachedControlsV734({restoreInline:true});
        state.localChunks = new Map();
        state.uploadedChunkIndexes = new Set();
        state.chunkError = null;
        state.finalizePromise = null;
        clearTimeout(state.stopFallbackTimer);
        state.stopFallbackTimer = 0;
        q('#loggy-recorder-dock-v710')?.classList.add('hidden');
        try { state.controllerWindow?.close?.(); } catch (_) {}
        state.controllerWindow = null;
        state.controllerRoot = null;
        state.controllerDocument = null;
        publishHostStatus();
    }

    async function refreshYouTubeStatus() {
        try {
            const response = await fetch('/api/recorder/status', {cache:'no-store'});
            state.youtubeStatus = await response.json();
        } catch (_) { state.youtubeStatus = null; }
        renderController();
        return state.youtubeStatus;
    }

    async function connectYouTube() {
        const status = await refreshYouTubeStatus();
        if (!status?.configured) {
            alert(`YouTube is not configured yet. Add these private values to the project-root .env file:\n\n${(status?.missing || []).join('\n')}`);
            return false;
        }
        setMessage('Opening Google for one-time YouTube authorization…');
        const response = await fetch('/api/recorder/youtube/auth-url', {cache:'no-store'});
        const result = await response.json().catch(()=>({}));
        if (!response.ok || !result.url) throw new Error(result.message || 'Could not start YouTube authorization.');
        const popup = window.open(result.url, 'loggy-youtube-auth', 'width=560,height=760,noopener=false');
        if (!popup) throw new Error('Allow the YouTube authorization pop-up, then try again.');
        try { popup.focus(); } catch (_) {}
        return true;
    }

    window.addEventListener('message', event => {
        if (event.origin !== location.origin || event.data?.type !== 'loggy-youtube-oauth') return;
        refreshYouTubeStatus().then(() => {
            renderRecorderSettingsYouTube();
            if (event.data.success) setMessage('YouTube connected.', 'success');
            else setMessage(event.data.message || 'YouTube connection failed.', 'error');
        });
    });

    function ensureModal(id, title, copy) {
        let modal = q(`#${id}`);
        if (modal) { document.body.appendChild(modal); return modal; }
        modal = document.createElement('div');
        modal.id = id;
        modal.className = 'loggy-recorder-modal-v710 hidden';
        modal.innerHTML = `<div class="loggy-recorder-modal-box-v710"><div class="loggy-recorder-modal-head-v710"><div><h2>${esc(title)}</h2><p>${esc(copy || '')}</p></div><button type="button" class="loggy-recorder-icon-button-v710" data-modal-close><i class="ph ph-x"></i></button></div><div data-modal-body></div></div>`;
        document.body.appendChild(modal);
        q('[data-modal-close]',modal).onclick=()=>modal.classList.add('hidden');
        modal.addEventListener('pointerdown',event=>{if(event.target===modal)modal.classList.add('hidden')});
        return modal;
    }

    function showRecorderConfirm({title='Are you sure?', message='', confirmLabel='Delete', cancelLabel='Cancel', danger=true} = {}) {
        return new Promise(resolve => {
            const existing = q('#loggy-recorder-confirm-modal-v733');
            if (existing) existing.remove();

            const modal = document.createElement('div');
            modal.id = 'loggy-recorder-confirm-modal-v733';
            modal.className = 'loggy-recorder-modal-v710';
            modal.innerHTML = `<div class="loggy-recorder-modal-box-v710 loggy-recorder-confirm-box-v733" role="dialog" aria-modal="true" aria-labelledby="loggy-recorder-confirm-title-v733">
                <div class="loggy-recorder-modal-head-v710">
                    <div>
                        <h2 id="loggy-recorder-confirm-title-v733">${esc(title)}</h2>
                        ${message ? `<p>${esc(message)}</p>` : ''}
                    </div>
                    <button type="button" class="loggy-recorder-icon-button-v710" data-confirm-close aria-label="Close"><i class="ph ph-x"></i></button>
                </div>
                <div class="loggy-recorder-confirm-actions-v733">
                    <button type="button" class="loggy-recorder-action-v710" data-confirm-cancel>${esc(cancelLabel)}</button>
                    <button type="button" class="loggy-recorder-action-v710 ${danger ? 'danger' : 'primary'}" data-confirm-accept>${esc(confirmLabel)}</button>
                </div>
            </div>`;

            let settled = false;
            const finish = value => {
                if (settled) return;
                settled = true;
                document.removeEventListener('keydown', onKey, true);
                modal.remove();
                resolve(value);
            };
            const onKey = event => {
                if (event.key === 'Escape') { event.preventDefault(); finish(false); }
                if (event.key === 'Enter') { event.preventDefault(); finish(true); }
            };

            q('[data-confirm-close]', modal).onclick = () => finish(false);
            q('[data-confirm-cancel]', modal).onclick = () => finish(false);
            q('[data-confirm-accept]', modal).onclick = () => finish(true);
            modal.addEventListener('pointerdown', event => { if (event.target === modal) finish(false); });
            document.addEventListener('keydown', onKey, true);
            document.body.appendChild(modal);
            requestAnimationFrame(() => q('[data-confirm-accept]', modal)?.focus({preventScroll:true}));
        });
    }

    function openShortcutsModal() {
        const modal = ensureModal('loggy-recorder-shortcuts-modal-v710','Screen Recorder Shortcuts','These same shortcut values are also shown in the Log page Settings.');
        q('[data-modal-body]',modal).innerHTML = `<div class="loggy-recorder-shortcut-settings-v710">${shortcutRowsMarkup(false)}</div>`;
        bindShortcutEditors(modal);
        modal.classList.remove('hidden');
    }

    async function openRecorderSettingsModal() {
        const modal = ensureModal('loggy-recorder-settings-modal-v710','Screen Recorder & YouTube','Your .env credentials identify Loggy to Google. Your Google account still has to authorize YouTube access once before Loggy can upload for you.');
        const body = q('[data-modal-body]',modal);
        body.innerHTML = `<div class="loggy-recorder-settings-top-v729"><button class="loggy-recorder-action-v710 loggy-recorder-recover-prominent-v729" data-rec-recover><i class="ph ph-clock-counter-clockwise"></i><span>Temporary Recordings</span></button></div><div class="loggy-recorder-youtube-settings-v710" data-rec-youtube-settings><p class="progress-hint">Loading YouTube status…</p></div>`;
        q('[data-rec-recover]',body).onclick=()=>openRecoveryModal();
        modal.classList.remove('hidden');
        await renderRecorderSettingsYouTube();
    }

    async function renderRecorderSettingsYouTube() {
        const host = q('[data-rec-youtube-settings]');
        if (!host) return;
        const status = await refreshYouTubeStatus();
        if (!status?.configured) {
            host.innerHTML = `<strong>YouTube setup required</strong><p class="progress-hint">Create a project-root <code>.env</code> file and add: ${esc((status?.missing||[]).join(', '))}. The included RECORDER-SETUP.md has the exact steps.</p>`;
            return;
        }
        if (!status.connected) {
            host.innerHTML = `<strong>YouTube authorization needed once</strong><p class="progress-hint">The Client ID and Client Secret in <code>.env</code> only identify Loggy. Google still requires your Google account to grant YouTube access. If your Google Auth Platform audience is <strong>External</strong> and the app is still <strong>Testing</strong>, add the Google account you are signing in with under <strong>Google Auth Platform → Audience → Test users</strong>, then come back and authorize again.</p><div class="row"><button type="button" class="loggy-recorder-action-v710 primary" data-youtube-connect>Authorize YouTube</button></div>`;
            q('[data-youtube-connect]',host).onclick=()=>connectYouTube().catch(error=>alert(error.message));
            return;
        }
        host.innerHTML = `<strong>YouTube connected</strong><div class="row"><label><span class="field-label">Default playlist</span><select data-youtube-playlist><option value="">No playlist</option></select></label><div><span class="field-label">Upload privacy</span><p class="progress-hint" style="margin:6px 0 0"><strong>Private</strong> · Change it to Unlisted later in YouTube Studio if you want. The saved video link stays the same.</p></div></div><div class="row"><button type="button" class="loggy-recorder-action-v710" data-youtube-refresh>Refresh playlists</button><button type="button" class="loggy-recorder-action-v710 danger" data-youtube-disconnect>Disconnect YouTube</button></div><p class="progress-hint">This is the playlist preselected in Recording Preview. You can override it there for one video or choose multiple playlists without changing this default.</p><p class="progress-hint">Successful raw recordings are deleted immediately after YouTube upload. Failed/unfinished recordings are automatically deleted after 48 hours.</p>`;
        const select = q('[data-youtube-playlist]',host);
        async function loadPlaylists() {
            select.disabled = true;
            const response = await fetch('/api/recorder/youtube/playlists',{cache:'no-store'});
            const result = await response.json().catch(()=>({}));
            if (!response.ok) {
                select.innerHTML='<option value="">Could not load playlists</option>';
                select.disabled=false;
                host.querySelector('.loggy-youtube-api-warning-v732')?.remove();
                if (result.code === 'YOUTUBE_API_DISABLED') {
                    const warning=document.createElement('div');
                    warning.className='loggy-youtube-api-warning-v732';
                    warning.innerHTML=`<strong>YouTube Data API v3 is disabled</strong><p class="progress-hint">${esc(result.message||'Enable YouTube Data API v3 in the Google Cloud project used by Loggy, then retry.')}</p>${result.actionUrl?`<a class="loggy-recorder-action-v710 primary" target="_blank" rel="noopener noreferrer" href="${esc(result.actionUrl)}">Enable YouTube Data API v3</a>`:''}`;
                    host.appendChild(warning);
                }
                return;
            }
            select.innerHTML = '<option value="">No playlist</option>' + (result.playlists||[]).map(item=>`<option value="${esc(item.id)}">${esc(item.title)}</option>`).join('');
            select.value = status.settings?.playlistId || '';
            select.disabled = false;
        }
        await loadPlaylists();
        async function saveServerSettings() {
            const option = select.selectedOptions?.[0];
            await fetch('/api/recorder/settings',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({playlistId:select.value,playlistTitle:option?.textContent||''})});
            await refreshYouTubeStatus();
        }
        select.onchange=saveServerSettings;
        q('[data-youtube-refresh]',host).onclick=loadPlaylists;
        q('[data-youtube-disconnect]',host).onclick=async()=>{await fetch('/api/recorder/youtube/disconnect',{method:'POST'});await renderRecorderSettingsYouTube();};
    }

    function hardStopPreviewPlaybackV919(root = document) {
        const scope = root || document;
        qa('.loggy-recorder-preview-video-v710, #loggy-recorder-preview-v710 audio', scope).forEach(media => {
            try { media.pause(); } catch (_) {}
            try { media.muted = true; media.volume = 0; } catch (_) {}
            try { media.currentTime = 0; } catch (_) {}
            try { media.srcObject?.getTracks?.().forEach(track => track.stop()); } catch (_) {}
            try { media.srcObject = null; } catch (_) {}
            try { media.removeAttribute('src'); } catch (_) {}
            try { media.load?.(); } catch (_) {}
        });
        try {
            const preview = q('#loggy-recorder-preview-v710');
            if (preview && preview !== scope && scope === document) {
                qa('video,audio', preview).forEach(media => {
                    try { media.pause(); media.muted = true; media.volume = 0; media.removeAttribute('src'); media.srcObject = null; media.load?.(); } catch (_) {}
                });
            }
        } catch (_) {}
    }

    function stopPreviewPlaybackV918(modal) {
        hardStopPreviewPlaybackV919(modal || document);
    }

    async function openPreviewModal(session, mediaUrl) {
        const modal = ensureModal('loggy-recorder-preview-v710','Recording Preview',`Destination is locked to ${currentDestinationLabel()}.`);
        const body = q('[data-modal-body]',modal);
        body.innerHTML = `
            <video class="loggy-recorder-preview-video-v710" controls preload="metadata" src="${esc(mediaUrl || `/api/recorder/session/${session.id}/media`)}"></video>
            <div class="loggy-recorder-preview-form-v710">
                <label><span>YouTube title</span><input type="text" data-preview-title maxlength="100" value="${esc(youtubeTitleForDestination(state.destination || {hobbyLabel:session.hobby,hobby:session.hobby,day:session.day}, session.day))}"></label>
                <label><span>Description</span><textarea data-preview-description rows="3"></textarea></label>
                <div data-preview-youtube></div>
                <div class="loggy-recorder-upload-progress-v710" data-preview-status>Raw recording is stored only temporarily until upload succeeds or 48 hours pass.</div>
            </div>
            <div class="loggy-recorder-preview-actions-v710">
                <button type="button" class="loggy-recorder-action-v710 danger" data-preview-discard>Discard recording</button>
                <button type="button" class="loggy-recorder-action-v710" data-preview-retry>Retake</button>
                <button type="button" class="loggy-recorder-action-v710 primary" data-preview-upload>Upload to YouTube & Add to Day ${Number(session.day)}</button>
            </div>`;
        modal.classList.remove('hidden');
        document.body.appendChild(modal);

        // V765: Chrome/Firefox can report MediaRecorder WebM duration as Infinity
        // until the media element seeks once. Force that metadata scan so the
        // native controls use the real finite duration and a proportional seekbar.
        const previewVideoV765 = q('.loggy-recorder-preview-video-v710', modal);
        const expectedDurationV765 = Math.max(0, Number(session?.durationMs || 0)) / 1000;
        if (previewVideoV765) {
            const repairDurationV765 = () => {
                const d = Number(previewVideoV765.duration);
                if (Number.isFinite(d) && d > 0) return;
                let repaired = false;
                const finish = () => {
                    if (repaired) return;
                    repaired = true;
                    try { previewVideoV765.currentTime = 0; } catch (_) {}
                };
                previewVideoV765.addEventListener('timeupdate', finish, {once:true});
                try { previewVideoV765.currentTime = 1e101; } catch (_) { finish(); }
                setTimeout(finish, 1200);
            };
            previewVideoV765.addEventListener('loadedmetadata', repairDurationV765, {once:true});
            if (previewVideoV765.readyState >= 1) repairDurationV765();
            if (expectedDurationV765 > 0) previewVideoV765.dataset.expectedDurationV765 = String(expectedDurationV765);
        }

        const closePreviewKeepTemporaryV750 = () => {
            if (modal.classList.contains('hidden') && state.phase !== 'preview') return;
            stopPreviewPlaybackV918(modal);
            modal.classList.add('hidden');
            // Closing Preview is not Discard. The temporary recording remains
            // recoverable, but the recorder itself is released immediately so a
            // new recording can start without reloading the Log page.
            resetRecorderState();
            try { showFeatureToast?.('Recording kept in Temporary Recordings. Recorder is ready for a new recording.'); } catch (_) {}
        };
        const previewClose=q('[data-modal-close]',modal);
        if (previewClose) previewClose.onclick=closePreviewKeepTemporaryV750;
        modal.onpointerdown=event=>{if(event.target===modal)closePreviewKeepTemporaryV750();};
        await renderPreviewYouTubeControls(modal);
        q('[data-preview-discard]',modal).onclick=async()=>{
            if (!(await showRecorderConfirm({title:'Discard Recording',message:'Are you sure you want to discard this recording?',confirmLabel:'Discard'}))) return;
            const discardedSessionIdV919 = String(session.id || '');
            try { recorderChannel?.postMessage({type:'hard-stop-preview-v919'}); } catch (_) {}
            hardStopPreviewPlaybackV919(modal);
            const previewBodyV919 = q('[data-modal-body]', modal);
            if (previewBodyV919) previewBodyV919.replaceChildren();
            modal.classList.add('hidden');
            resetRecorderState();
            // Server deletion is intentionally after the local hard stop. Even if
            // the request is slow, playback/audio is already gone immediately.
            if (discardedSessionIdV919) {
                try { await fetch(`/api/recorder/session/${encodeURIComponent(discardedSessionIdV919)}`,{method:'DELETE'}); } catch (_) {}
            }
            if (IS_RECORDER_HOST) setTimeout(() => { try { window.close(); } catch (_) {} }, 0);
        };
        q('[data-preview-retry]',modal).onclick=async()=>{
            if (!(await showRecorderConfirm({title:'Retake Recording',message:'Discard this recording and record this same Day/slot again?',confirmLabel:'Discard & Retake'}))) return;
            const dest = {...state.destination};
            stopPreviewPlaybackV918(modal);
            modal.classList.add('hidden');
            resetRecorderState();
            state.destination = dest;
            state.phase='ready';
            ensureFallbackDock();
            if (recorderSettings().appearance.hideBarFromRecording) openDetachedControlsV734({activate:false});
            renderController();
            await fetch(`/api/recorder/session/${session.id}`,{method:'DELETE'});
        };
        q('[data-preview-upload]',modal).onclick=()=>uploadPreview(session,modal);
    }

    async function renderPreviewYouTubeControls(modal) {
        const host=q('[data-preview-youtube]',modal); if(!host)return;
        const status=await refreshYouTubeStatus();
        if(!status?.configured){host.innerHTML=`<p class="progress-hint">YouTube setup is incomplete. Missing: ${esc((status?.missing||[]).join(', '))}. Fill the private project-root <code>.env</code>, restart the server, then return here.</p>`;return;}
        if(!status.connected){host.innerHTML='<div class="loggy-recorder-youtube-auth-note-v729"><p class="progress-hint">Your .env credentials are loaded, but this Google account still needs one-time YouTube authorization. If the app is in Google Testing mode, the account must also be listed under Auth Platform → Audience → Test users.</p><button type="button" class="loggy-recorder-action-v710" data-preview-connect>Authorize YouTube</button></div>';q('[data-preview-connect]',host).onclick=async()=>{await connectYouTube();await renderPreviewYouTubeControls(modal);};return;}

        host.innerHTML=`
            <div class="loggy-recorder-preview-playlists-v751">
                <span class="field-label">Add this video to playlists</span>
                <div class="loggy-recorder-playlist-picker-v751" data-preview-playlist-picker>
                    <button type="button" class="loggy-recorder-playlist-toggle-v751" data-preview-playlist-toggle aria-expanded="false">
                        <span data-preview-playlist-summary>Loading playlists…</span><i class="ph ph-caret-down"></i>
                    </button>
                    <div class="loggy-recorder-playlist-menu-v751 hidden" data-preview-playlist-menu></div>
                </div>
            </div>`;

        const picker=q('[data-preview-playlist-picker]',host);
        const toggle=q('[data-preview-playlist-toggle]',picker);
        const summary=q('[data-preview-playlist-summary]',picker);
        const menu=q('[data-preview-playlist-menu]',picker);
        const response=await fetch('/api/recorder/youtube/playlists',{cache:'no-store'});
        const result=await response.json().catch(()=>({}));
        if(!response.ok){
            summary.textContent='Could not load playlists';
            toggle.disabled=true;
            menu.innerHTML=`<p class="progress-hint">${esc(result.message||'Could not load YouTube playlists.')}</p>`;
            return;
        }
        const playlists=Array.isArray(result.playlists)?result.playlists:[];
        const defaultId=String(status.settings?.playlistId||'');
        menu.innerHTML=`<div class="loggy-recorder-playlist-menu-head-v751"><button type="button" data-preview-playlist-clear>Clear all</button></div>${playlists.length?playlists.map(item=>`<label class="loggy-recorder-playlist-option-v751"><input type="checkbox" data-preview-playlist value="${esc(item.id)}" data-title="${esc(item.title)}" ${String(item.id)===defaultId?'checked':''}><span>${esc(item.title)}</span>${String(item.id)===defaultId?'<small>Default</small>':''}</label>`).join(''):'<p class="progress-hint">No playlists found.</p>'}`;

        const updateSummary=()=>{
            const selected=qa('[data-preview-playlist]:checked',menu);
            if(!selected.length) summary.textContent='No playlist';
            else if(selected.length===1) summary.textContent=selected[0].dataset.title||'1 playlist';
            else summary.textContent=`${selected.length} playlists selected`;
        };
        updateSummary();
        toggle.onclick=()=>{
            const opening=menu.classList.contains('hidden');
            menu.classList.toggle('hidden',!opening);
            toggle.setAttribute('aria-expanded',opening?'true':'false');
        };
        menu.addEventListener('change',event=>{if(event.target?.matches?.('[data-preview-playlist]'))updateSummary();});
        q('[data-preview-playlist-clear]',menu)?.addEventListener('click',()=>{qa('[data-preview-playlist]',menu).forEach(input=>input.checked=false);updateSummary();});
        modal.addEventListener('pointerdown',event=>{if(!event.target?.closest?.('[data-preview-playlist-picker]')){menu.classList.add('hidden');toggle.setAttribute('aria-expanded','false');}},true);
    }

    async function uploadPreview(session, modal) {
        const button=q('[data-preview-upload]',modal), statusEl=q('[data-preview-status]',modal);
        if(button)button.disabled=true;
        statusEl.textContent='Uploading to YouTube… 0%';
        let uploadDone=false;
        const pollProgress = async () => {
            if (uploadDone) return;
            try {
                const response=await fetch(`/api/recorder/session/${session.id}/status`,{cache:'no-store'});
                const value=await response.json().catch(()=>({}));
                if(response.ok && value.state==='uploading') {
                    const pct=Math.max(0,Math.min(100,Number(value.progressPercent||0)));
                    statusEl.textContent=`Uploading to YouTube… ${pct}%`;
                }
            } catch (_) {}
        };
        const progressTimer=setInterval(pollProgress,700);
        try{
            const response=await fetch(`/api/recorder/session/${session.id}/upload`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({title:q('[data-preview-title]',modal)?.value||'',description:q('[data-preview-description]',modal)?.value||'',playlistIds:qa('[data-preview-playlist]:checked',modal).map(input=>String(input.value||'')).filter(Boolean)})});
            const result=await response.json().catch(()=>({}));
            if(!response.ok){const uploadError=new Error(result.message||'Upload failed.');uploadError.code=result.code||'';uploadError.actionUrl=result.actionUrl||'';throw uploadError;}
            uploadDone=true;clearInterval(progressTimer);
            const privacyNote = result.actualPrivacyStatus ? ` Privacy: ${result.actualPrivacyStatus}.` : '';
            const playlistCount = Array.isArray(result.playlistsAdded) ? result.playlistsAdded.length : 0;
            const playlistNote = playlistCount ? ` Added to ${playlistCount} playlist${playlistCount === 1 ? '' : 's'}.` : '';
            statusEl.textContent=`Uploaded and linked to Day ${result.destination?.day}.${privacyNote}${playlistNote} ${result.playlistWarning||''}`.trim();
            const data=appDb();
            if(data?.days?.[result.destination?.day])data.days[result.destination.day][result.destination.slot]=result.youtubeUrl;
            if(appCurrentDay()===Number(result.destination?.day)){
                try{result.destination.slot==='video2'?renderVideo2(result.youtubeUrl):renderVideo(result.youtubeUrl);}catch(_){ }
            }
            state.uploadResult=result;
            state.session=null;
            setMessage(`Uploaded to YouTube and added to Day ${result.destination?.day}.`,'success');
            setTimeout(()=>{
                modal.classList.add('hidden');
                resetRecorderState();
                if (IS_RECORDER_HOST) { try { window.close(); } catch (_) {} }
            },1500);
        }catch(error){
            uploadDone=true;clearInterval(progressTimer);
            if(error.code==='YOUTUBE_API_DISABLED'){
                statusEl.innerHTML=`<strong>YouTube Data API v3 is disabled.</strong> ${esc(error.message)} The temporary recording is still saved for up to 48 hours.${error.actionUrl?` <a target="_blank" rel="noopener noreferrer" href="${esc(error.actionUrl)}">Enable the API in Google Cloud</a>`:''}`;
            }else{
                statusEl.textContent=`Upload failed: ${error.message}. The temporary recording is kept for up to 48 hours so you can retry.`;
            }
            if(button)button.disabled=false;
        }
    }

    async function openRecoveryModal() {
        const modal=ensureModal('loggy-recorder-recovery-modal-v710','Recover Temporary Recordings','Only unfinished or failed recordings appear here, and they are automatically deleted after 48 hours.');
        const body=q('[data-modal-body]',modal);body.innerHTML='<p class="progress-hint">Loading…</p>';modal.classList.remove('hidden');
        const response=await fetch('/api/recorder/recoverable',{cache:'no-store'});const result=await response.json().catch(()=>({}));
        if(!response.ok){body.innerHTML=`<p class="progress-hint">${esc(result.message||'Could not load recordings.')}</p>`;return;}
        if(!(result.sessions||[]).length){body.innerHTML='<p class="progress-hint">No temporary recordings are waiting for recovery.</p>';return;}
        body.innerHTML=`<div class="loggy-recorder-recovery-list-v710">${result.sessions.map(item=>`<div class="loggy-recorder-recovery-item-v710" data-recovery-id="${esc(item.id)}"><div><strong>${esc(item.title||`${item.hobby} · Day ${item.day}`)}</strong><small>${esc(item.hobby)} · Day ${Number(item.day)} · ${item.slot==='video2'?'Video Log 2':'Video Log 1'} · ${esc(item.state)}</small>${item.lastError?`<small>${esc(item.lastError)}</small>`:''}</div><div class="loggy-recorder-recovery-actions-v710"><button class="loggy-recorder-action-v710" data-recovery-preview>Preview</button><button class="loggy-recorder-action-v710 danger" data-recovery-delete>Delete</button></div></div>`).join('')}</div>`;
        qa('[data-recovery-id]',body).forEach(row=>{
            const item=(result.sessions||[]).find(x=>x.id===row.dataset.recoveryId);if(!item)return;
            q('[data-recovery-preview]',row).onclick=()=>{modal.classList.add('hidden');state.destination={hobby:item.hobby,hobbyLabel:item.hobby,day:Number(item.day),slot:item.slot};state.session=item;state.phase='preview';openPreviewModal(item,item.mediaUrl)};
            q('[data-recovery-delete]',row).onclick=async()=>{const ok=await showRecorderConfirm({title:'Delete Temporary Recording',message:'Are you sure you want to delete this temporary recording?',confirmLabel:'Delete'});if(!ok)return;await fetch(`/api/recorder/session/${item.id}`,{method:'DELETE'});row.remove();};
        });
    }

    function ensureGlobalSettingsSection() {
        const modal=q('#daily-settings-modal');
        const box=modal?.querySelector('.modal-box');
        if(!box)return;
        let section=q('#screen-recorder-shortcuts-v710',modal);
        if(!section){section=document.createElement('div');section.id='screen-recorder-shortcuts-v710';section.className='screen-recorder-shortcuts-v717';}
        section.innerHTML=`<span class="field-label">Screen Recorder</span><p class="progress-hint">These are part of the main Shortcuts section. Start / Stop uses one shortcut. You can also show the recorder bar without recording and toggle full-screen camera while the Loggy page has keyboard focus.</p><div class="loggy-recorder-shortcut-settings-v710">${shortcutRowsMarkup(false)}</div><div class="loggy-recorder-youtube-settings-v710"><div class="row"><button type="button" class="loggy-recorder-action-v710" data-rec-settings-youtube>YouTube & Recorder Settings</button><button type="button" class="loggy-recorder-action-v710" data-rec-settings-recover><i class="ph ph-clock-counter-clockwise"></i> Temporary Recordings</button></div></div>`;
        const shortcuts=q('#global-shortcuts-section',modal);
        if(shortcuts){
            shortcuts.appendChild(section);
        } else if(section.parentElement!==box){
            box.appendChild(section);
        }
        bindShortcutEditors(section);
        q('[data-rec-settings-youtube]',section).onclick=()=>openRecorderSettingsModal();
        q('[data-rec-settings-recover]',section).onclick=()=>openRecoveryModal();
    }


    function observeSettings() {
        const attach=()=>{
            const modal=q('#daily-settings-modal');
            if(!modal||modal.dataset.screenRecorderObservedV710)return false;
            modal.dataset.screenRecorderObservedV710='1';
            new MutationObserver(()=>{if(!modal.classList.contains('hidden'))ensureGlobalSettingsSection();}).observe(modal,{attributes:true,attributeFilter:['class']});
            return true;
        };
        if(!attach()){const timer=setInterval(()=>{if(attach())clearInterval(timer)},500);setTimeout(()=>clearInterval(timer),30000);}
        document.addEventListener('click',event=>{if(event.target.closest?.('#open-settings-btn,#open-daily-settings-btn'))setTimeout(ensureGlobalSettingsSection,0)},true);
    }

    function bootstrapRecorderHost() {
        document.body.classList.add('loggy-recorder-host-page-v710');
        const params = new URLSearchParams(location.search);
        const hobby = String(params.get('hobby') || '').replace(/[^a-z0-9_-]/gi,'').slice(0,80);
        const day = Number(params.get('day'));
        const slot = params.get('slot') === 'video2' ? 'video2' : 'video';
        if (!hobby || !Number.isInteger(day) || day < 1) {
            document.body.innerHTML = '<main style="font-family:system-ui;padding:24px"><h2>Loggy Recorder</h2><p>Open the recorder from a numbered Daily Log.</p></main>';
            return;
        }
        state.destination = {
            hobby,
            hobbyLabel: String(params.get('label') || hobby).slice(0,120),
            day,
            slot
        };
        state.phase = 'ready';
        state.uiMessage = `Ready. Press ${prettyShortcut(recorderSettings().shortcuts.start)} again or click Record to choose what to share.`;
        ensureFallbackDock();
        renderController();
        refreshYouTubeStatus();
        window.addEventListener('message', event => {
            if (event.origin !== location.origin || event.data?.type !== 'loggy-recorder-focus') return;
            try { window.focus(); } catch (_) {}
        });
        window.addEventListener('beforeunload', () => {
            try { localStorage.removeItem(HOST_STATUS_KEY); } catch (_) {}
            try { recorderChannel?.postMessage({type:'host-status', phase:'closed', destination:state.destination, timestamp:Date.now()}); } catch (_) {}
        });
        publishHostStatus();
    }

    recorderSettings();
    installRecorderChannelRuntime();
    installPageCameraVisibilityRuntimeV908();
    installRecorderShortcutRuntime();

    if (IS_RECORDER_HOST) {
        bootstrapRecorderHost();
    } else {
        document.addEventListener('click',event=>{
            const first=event.target.closest?.('#edit-video-btn');
            if(first){
                const hasVideo=!!appDb()?.days?.[appCurrentDay()]?.video;
                if(!hasVideo){event.preventDefault();event.stopPropagation();event.stopImmediatePropagation();showVideoPlusMenu(first,'video');return;}
            }
            const second=event.target.closest?.('#add-second-video-btn');
            if(second){
                const hasSecond=!!appDb()?.days?.[appCurrentDay()]?.video2;
                if(!hasSecond){event.preventDefault();event.stopPropagation();event.stopImmediatePropagation();showVideoPlusMenu(second,'video2');}
            }
        },true);

        observeSettings();
        setTimeout(ensureGlobalSettingsSection, 0);
        refreshYouTubeStatus();
        installRecordingLeaveGuardV917();
    }

    window.LoggyScreenRecorderV710 = {
        version: '750',
        launch: () => launchRecorder('',false),
        launchSlot: slot => launchRecorder(slot === 'video2' ? 'video2' : 'video', false),
        start: () => runRecorderShortcut('start'),
        pause: togglePause,
        stop: stopRecording,
        toggleMic: toggleMicrophone,
        toggleCamera,
        toggleCameraFullscreen: toggleCameraFullscreenV750,
        toggleScreenAudio,
        toggleFloat: toggleFloatControls,
        marker: addMarker,
        openShortcuts: openShortcutsModal,
        openSettings: openRecorderClientSettingsV750,
        recover: openRecoveryModal,
        state
    };
})();
