const express = require('express');
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const app = express();
app.use(express.json({ limit: '120mb' })); 
app.use(express.static(path.join(__dirname, 'public'), {
    setHeaders(res, filePath) {
        const normalized = String(filePath || '').replace(/\\/g, '/');
        // Theme Builder asset filenames are unique/timestamped. Cache them so
        // custom backgrounds/decorations are memory/disk hits on later mounts.
        if (/\/(?:themes|svg|sounds)\/custom-builder-/i.test(normalized) || /\/media\/[^/]+\/(?:daily-logs|notepad|whiteboard|kb)\//i.test(normalized)) {
            res.setHeader('Cache-Control', 'public, max-age=86400, immutable');
            return;
        }
        // V222: existing log HTML keeps the enhancement bundle query string it
        // had when the log was created. Always revalidate shared enhancement
        // bundles so an old cached template-extras-5.js cannot keep a fixed log
        // on the legacy Add Field code path.
        if (/\/(?:template-extras-(?:[1-6])|template-hotfix-v221|template-notepad(?:-v250)?|widgets-v239|widgets-loader-v241)\.js$/i.test(normalized)) {
            res.setHeader('Cache-Control', 'no-cache, must-revalidate');
        }
    }
}));

const DATA_DIR = path.join(__dirname, 'data');
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR);

// Dashboard Trash is deliberately OUTSIDE the active data/ and public/ folders.
// A trashed log therefore cannot block a new log with the same slug and its
// old database can never be loaded by /api/data/:hobby by accident.
const LOG_TRASH_DIR = path.join(__dirname, '.loggy-trash');
if (!fs.existsSync(LOG_TRASH_DIR)) fs.mkdirSync(LOG_TRASH_DIR, { recursive: true });

const APPS_DB_PATH = path.join(DATA_DIR, 'apps.json');
const publicDir = path.join(__dirname, 'public');

// Initialize apps.json if missing
if (!fs.existsSync(APPS_DB_PATH)) {
    fs.writeFileSync(APPS_DB_PATH, JSON.stringify([
        { id: 'guitar', name: 'Guitar', icon: 'ph-guitar', category: 'Non-School' },
        { id: 'korean', name: 'Korean', icon: 'ph-translate', category: 'Non-School' },
        { id: 'french', name: 'French', icon: 'ph-translate', category: 'School' }
    ], null, 2));
}

// Ids that can never be scaffolded over or deleted
const RESERVED_IDS = ['template', 'dashboard', 'theme-studio-host'];

// Clean up any apps in apps.json that do not have physical HTML files.
// Also backfills a category on any older entries that don't have one yet,
// so nothing silently disappears from a category filter.
function getCleanAppsList() {
    const original = JSON.parse(fs.readFileSync(APPS_DB_PATH, 'utf8'));
    let changed = false;

    const apps = original.filter(app => {
        const htmlFile = path.join(publicDir, `${app.id}.html`);
        const keep = fs.existsSync(htmlFile);
        if (!keep) changed = true;
        return keep;
    });

    apps.forEach(app => {
        // Custom dashboard categories are valid too. Older builds only allowed
        // School / Non-School here, which silently moved logs out of user-made
        // or renamed categories every time /api/apps was read.
        const category = String(app.category || '').trim();
        const normalized = category || 'Non-School';
        if (app.category !== normalized) changed = true;
        app.category = normalized;
    });

    // V188: GET /api/apps is read-mostly. Do not synchronously rewrite apps.json
    // on every dashboard refresh when nothing changed.
    if (changed) {
        fs.writeFileSync(APPS_DB_PATH, JSON.stringify(apps, null, 2));
    }
    return apps;
}

app.get('/api/apps', (req, res) => res.json(getCleanAppsList()));


// V188 — lightweight Dashboard completion status. This avoids sending every
// full log database to the browser merely to underline today's completed logs.
function dashboardTodayDateKeyV188() {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
}

function dashboardDayNumberV188(startDate, todayKey) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(String(startDate || ''))) return null;
    const [sy, sm, sd] = String(startDate).split('-').map(Number);
    const [ty, tm, td] = String(todayKey).split('-').map(Number);
    return Math.round((Date.UTC(ty, tm - 1, td) - Date.UTC(sy, sm - 1, sd)) / 86400000) + 1;
}

function dashboardDayHasContentV188(day) {
    if (!day || typeof day !== 'object') return false;
    return Object.values(day).some(value =>
        (typeof value === 'string' && value.trim().length > 0) ||
        (Array.isArray(value) && value.length > 0)
    );
}

app.get('/api/apps/today-status', async (req, res) => {
    const apps = getCleanAppsList();
    const todayKey = dashboardTodayDateKeyV188();
    const result = Object.create(null);
    let cursor = 0;

    // Limit async disk concurrency so Node stays responsive with many/large logs.
    const worker = async () => {
        while (cursor < apps.length) {
            const appInfo = apps[cursor++];
            result[appInfo.id] = false;
            try {
                const raw = await fs.promises.readFile(path.join(DATA_DIR, `${appInfo.id}_db.json`), 'utf8');
                const data = JSON.parse(raw);
                const dayNumber = dashboardDayNumberV188(data.startDate, todayKey);
                result[appInfo.id] = dayNumber
                    ? dashboardDayHasContentV188(data.days && data.days[dayNumber])
                    : false;
            } catch (_) {
                result[appInfo.id] = false;
            }
        }
    };

    await Promise.all(Array.from({ length: Math.min(4, Math.max(1, apps.length)) }, worker));
    res.setHeader('Cache-Control', 'no-store');
    res.json(result);
});

// --- Create New Log Page: Scaffolds physical HTML, CSS, JS files from Template ---
app.post('/api/apps', (req, res) => {
    const { id, name, icon } = req.body;
    let { category } = req.body;
    if (!id || !name || !icon) {
        return res.status(400).json({ status: 'error', message: 'id, name, and icon are required.' });
    }
    if (RESERVED_IDS.includes(id)) {
        return res.status(400).json({ status: 'error', message: `"${id}" is a reserved name. Please choose a different name.` });
    }
    category = String(category || '').trim() || 'Non-School';

    const htmlPath = path.join(publicDir, `${id}.html`);
    const cssPath = path.join(publicDir, `${id}.css`);
    const jsPath = path.join(publicDir, `${id}.js`);
    const staleDataPath = path.join(DATA_DIR, `${id}_db.json`);

    if (fs.existsSync(htmlPath) || fs.existsSync(cssPath) || fs.existsSync(jsPath)) {
        return res.status(409).json({ status: 'error', message: `Files for "${id}" already exist.` });
    }

    // If an older version of the dashboard left an orphaned DB file behind,
    // a brand-new log with the same slug must still start completely fresh.
    if (fs.existsSync(staleDataPath)) {
        fs.unlinkSync(staleDataPath);
    }

    // Read base template files
    const templateHtmlPath = path.join(publicDir, 'template.html');
    const templateCssPath = path.join(publicDir, 'template.css');
    const templateJsPath = path.join(publicDir, 'template.js');

    let htmlContent = fs.existsSync(templateHtmlPath) ? fs.readFileSync(templateHtmlPath, 'utf8') : '';
    let cssContent = fs.existsSync(templateCssPath) ? fs.readFileSync(templateCssPath, 'utf8') : '';
    let jsContent = fs.existsSync(templateJsPath) ? fs.readFileSync(templateJsPath, 'utf8') : '';

    // Replace placeholders - FIXED REGEX to prevent double-slashes
    htmlContent = htmlContent
        .replace(/TEMPLATE_APP_TITLE/g, `${name.toUpperCase()} LOGS`)
        .replace(/\/?template\.css/g, `/${id}.css`)
        .replace(/\/?template\.js/g, `/${id}.js`);

    fs.writeFileSync(htmlPath, htmlContent);
    fs.writeFileSync(cssPath, cssContent);
    fs.writeFileSync(jsPath, jsContent);

    const apps = getCleanAppsList();
    apps.push({ id, name, icon, category });
    fs.writeFileSync(APPS_DB_PATH, JSON.stringify(apps, null, 2));

    res.json({ status: 'success' });
});

// --- Update Log Page metadata (id/files stay the same) ---
app.patch('/api/apps/:id', (req, res) => {
    const { id } = req.params;
    const hasName = Object.prototype.hasOwnProperty.call(req.body || {}, 'name');
    const hasCategory = Object.prototype.hasOwnProperty.call(req.body || {}, 'category');
    const name = hasName ? String(req.body.name || '').trim() : '';
    const category = hasCategory ? String(req.body.category || '').trim() : '';

    if (!hasName && !hasCategory) {
        return res.status(400).json({ status: 'error', message: 'No log metadata was supplied.' });
    }
    if (hasName && !name) {
        return res.status(400).json({ status: 'error', message: 'A new name is required.' });
    }
    if (hasCategory && !category) {
        return res.status(400).json({ status: 'error', message: 'A category name is required.' });
    }
    if (RESERVED_IDS.includes(id)) {
        return res.status(400).json({ status: 'error', message: 'This log cannot be changed.' });
    }

    const apps = getCleanAppsList();
    const app_ = apps.find(a => a.id === id);
    if (!app_) {
        return res.status(404).json({ status: 'error', message: 'Log not found.' });
    }

    if (hasName) app_.name = name;
    if (hasCategory) app_.category = category;
    fs.writeFileSync(APPS_DB_PATH, JSON.stringify(apps, null, 2));

    res.json({ status: 'success', app: app_ });
});


// --- Dashboard Trash -------------------------------------------------------
// Moving a log to Trash physically moves its HTML/CSS/JS, database JSON, and
// Theme Builder assets out of the active project locations. This means:
//   * data/<id>_db.json no longer exists while trashed
//   * public/<id>.* no longer exists while trashed
//   * a brand-new log may reuse the same id immediately
// The trashed copy remains restorable from .loggy-trash/<trashId>/.
// --------------------------------------------------------------------------

function safeTrashEntryId(value) {
    return String(value || '')
        .trim()
        .replace(/[^a-zA-Z0-9_-]+/g, '');
}

function ensureParentDir(targetPath) {
    fs.mkdirSync(path.dirname(targetPath), { recursive: true });
}

function movePathToTrash(sourcePath, destinationPath) {
    if (!fs.existsSync(sourcePath)) return false;

    ensureParentDir(destinationPath);

    if (fs.existsSync(destinationPath)) {
        fs.rmSync(destinationPath, { recursive: true, force: true });
    }

    // renameSync is fastest, but on Windows/OneDrive it can fail even when
    // source and destination are inside the same project. Fall back to a
    // copy-then-remove move so Trash still works reliably.
    try {
        fs.renameSync(sourcePath, destinationPath);
    } catch (renameError) {
        const stat = fs.statSync(sourcePath);

        if (stat.isDirectory()) {
            fs.cpSync(sourcePath, destinationPath, {
                recursive: true,
                force: true
            });

            fs.rmSync(sourcePath, {
                recursive: true,
                force: true
            });
        } else {
            fs.copyFileSync(sourcePath, destinationPath);
            fs.unlinkSync(sourcePath);
        }
    }

    return true;
}

function readTrashManifest(trashId) {
    const safeTrashId = safeTrashEntryId(trashId);
    if (!safeTrashId) return null;

    const bundleDir = path.join(LOG_TRASH_DIR, safeTrashId);
    const manifestPath = path.join(bundleDir, 'manifest.json');

    if (!fs.existsSync(manifestPath)) return null;

    try {
        const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
        return {
            ...manifest,
            trashId: safeTrashId
        };
    } catch (error) {
        return null;
    }
}

function listTrashManifests() {
    if (!fs.existsSync(LOG_TRASH_DIR)) return [];

    return fs.readdirSync(LOG_TRASH_DIR, { withFileTypes: true })
        .filter(entry => entry.isDirectory())
        .map(entry => readTrashManifest(entry.name))
        .filter(Boolean)
        .sort((a, b) => String(b.deletedAt || '').localeCompare(String(a.deletedAt || '')));
}

function getActiveLogPaths(id) {
    const safeId = safeAssetSegment(id);

    return {
        html: path.join(publicDir, `${id}.html`),
        css: path.join(publicDir, `${id}.css`),
        js: path.join(publicDir, `${id}.js`),
        db: path.join(DATA_DIR, `${id}_db.json`),

        themeAssets: path.join(publicDir, 'themes', `custom-builder-${safeId}`),
        soundAssets: path.join(publicDir, 'sounds', `custom-builder-${safeId}`),
        svgAssets: path.join(publicDir, 'svg', `custom-builder-${safeId}`),
        dailyMediaAssets: path.join(publicDir, 'media', safeId)
    };
}

function getTrashBundlePaths(bundleDir, id) {
    const safeId = safeAssetSegment(id);

    return {
        html: path.join(bundleDir, 'public', `${id}.html`),
        css: path.join(bundleDir, 'public', `${id}.css`),
        js: path.join(bundleDir, 'public', `${id}.js`),
        db: path.join(bundleDir, 'database', `${id}_db.json`),

        themeAssets: path.join(bundleDir, 'assets', 'themes', `custom-builder-${safeId}`),
        soundAssets: path.join(bundleDir, 'assets', 'sounds', `custom-builder-${safeId}`),
        svgAssets: path.join(bundleDir, 'assets', 'svg', `custom-builder-${safeId}`),
        dailyMediaAssets: path.join(bundleDir, 'assets', 'media', safeId)
    };
}

app.get('/api/apps-trash', (req, res) => {
    res.json(listTrashManifests());
});

app.post('/api/apps/:id/trash', (req, res) => {
    const { id } = req.params;

    if (!id || RESERVED_IDS.includes(id)) {
        return res.status(400).json({
            status: 'error',
            message: 'This log cannot be moved to Trash.'
        });
    }

    let rawApps = [];

    try {
        rawApps = JSON.parse(
            fs.readFileSync(
                APPS_DB_PATH,
                'utf8'
            )
        );
    } catch (error) {
        rawApps = [];
    }

    const active = getActiveLogPaths(id);

    const hasAnyActiveFiles =
        Object.values(active)
            .some(target =>
                fs.existsSync(target)
            );

    const savedEntry =
        rawApps.find(app_ =>
            app_.id === id
        );

    const suppliedEntry =
        req.body?.app &&
        req.body.app.id === id
            ? req.body.app
            : null;

    // Older dashboard builds could leave an orphan DB/page behind after the
    // apps.json entry was changed. Allow those physical files to be trashed too.
    const appEntry =
        savedEntry ||
        suppliedEntry ||
        (
            hasAnyActiveFiles
                ? {
                    id,
                    name: id,
                    icon: 'ph-books',
                    category: 'Non-School'
                }
                : null
        );

    if (!appEntry) {
        return res.status(404).json({
            status: 'error',
            message: 'Log files could not be found.'
        });
    }

    const trashId =
        safeTrashEntryId(
            `${Date.now()}-${id}`
        );

    const bundleDir =
        path.join(
            LOG_TRASH_DIR,
            trashId
        );

    fs.mkdirSync(
        bundleDir,
        {
            recursive: true
        }
    );

    const trash =
        getTrashBundlePaths(
            bundleDir,
            id
        );

    const movedKeys = [];

    try {
        Object.keys(active)
            .forEach(key => {
                const moved =
                    movePathToTrash(
                        active[key],
                        trash[key]
                    );

                if (moved) {
                    movedKeys.push(key);
                }
            });

        const manifest = {
            trashId,
            deletedAt:
                new Date()
                    .toISOString(),
            app: {
                id,
                name:
                    appEntry.name ||
                    id,
                icon:
                    appEntry.icon ||
                    'ph-books',
                category:
                    String(appEntry.category || '').trim() ||
                    'Non-School'
            },
            moved:
                movedKeys
        };

        fs.writeFileSync(
            path.join(
                bundleDir,
                'manifest.json'
            ),
            JSON.stringify(
                manifest,
                null,
                2
            )
        );

        const remainingApps =
            rawApps.filter(
                app_ =>
                    app_.id !== id
            );

        fs.writeFileSync(
            APPS_DB_PATH,
            JSON.stringify(
                remainingApps,
                null,
                2
            )
        );

        return res.json({
            status: 'success',
            entry: manifest
        });
    } catch (error) {
        console.error(
            'Failed to move log to Trash:',
            error
        );

        // Best-effort rollback only for paths that actually moved.
        try {
            movedKeys.forEach(key => {
                if (
                    fs.existsSync(
                        trash[key]
                    ) &&
                    !fs.existsSync(
                        active[key]
                    )
                ) {
                    ensureParentDir(
                        active[key]
                    );

                    movePathToTrash(
                        trash[key],
                        active[key]
                    );
                }
            });
        } catch (rollbackError) {
            console.error(
                'Trash rollback failed:',
                rollbackError
            );
        }

        fs.rmSync(
            bundleDir,
            {
                recursive: true,
                force: true
            }
        );

        return res.status(500).json({
            status: 'error',
            message:
                error?.message ||
                'Could not move this log to Trash.'
        });
    }
});

app.post('/api/apps-trash/:trashId/restore', (req, res) => {
    const trashId = safeTrashEntryId(req.params.trashId);
    const manifest = readTrashManifest(trashId);

    if (!manifest?.app?.id) {
        return res.status(404).json({
            status: 'error',
            message: 'That trashed log could not be found.'
        });
    }

    const { id } = manifest.app;
    const apps = getCleanAppsList();
    const active = getActiveLogPaths(id);

    const conflicts =
        apps.some(app_ => app_.id === id) ||
        Object.values(active).some(target => fs.existsSync(target));

    if (conflicts) {
        return res.status(409).json({
            status: 'error',
            message:
                `A current log already uses "${id}". ` +
                'Rename or move that current log to Trash before restoring this older copy.'
        });
    }

    const bundleDir = path.join(LOG_TRASH_DIR, trashId);
    const trash = getTrashBundlePaths(bundleDir, id);

    try {
        Object.keys(active).forEach(key => {
            if (!fs.existsSync(trash[key])) return;

            ensureParentDir(active[key]);
            fs.renameSync(trash[key], active[key]);
        });

        const nextApps = getCleanAppsList();

        if (!nextApps.some(app_ => app_.id === id)) {
            nextApps.push({
                id: manifest.app.id,
                name: manifest.app.name,
                icon: manifest.app.icon,
                category: manifest.app.category
            });

            fs.writeFileSync(APPS_DB_PATH, JSON.stringify(nextApps, null, 2));
        }

        fs.rmSync(bundleDir, { recursive: true, force: true });

        return res.json({
            status: 'success',
            app: manifest.app
        });
    } catch (error) {
        console.error('Failed to restore trashed log:', error);

        return res.status(500).json({
            status: 'error',
            message: 'Could not restore this trashed log.'
        });
    }
});

app.delete('/api/apps-trash/:trashId', (req, res) => {
    const trashId = safeTrashEntryId(req.params.trashId);
    const manifest = readTrashManifest(trashId);

    if (!manifest) {
        return res.status(404).json({
            status: 'error',
            message: 'That trashed log could not be found.'
        });
    }

    const bundleDir = path.join(LOG_TRASH_DIR, trashId);
    fs.rmSync(bundleDir, { recursive: true, force: true });

    res.json({ status: 'success' });
});


// --- Delete a Log Page: permanently removes files, saved data, custom-theme assets, and dashboard entry ---
app.delete('/api/apps/:id', (req, res) => {
    const { id } = req.params;
    if (!id || RESERVED_IDS.includes(id)) {
        return res.status(400).json({ status: 'error', message: 'This log cannot be deleted.' });
    }

    const safeId = safeAssetSegment(id);

    const fileTargets = [
        path.join(publicDir, `${id}.html`),
        path.join(publicDir, `${id}.css`),
        path.join(publicDir, `${id}.js`),
        path.join(DATA_DIR, `${id}_db.json`)
    ];

    fileTargets.forEach(target => {
        if (fs.existsSync(target)) {
            fs.unlinkSync(target);
        }
    });

    // Theme Builder stores assets in log-specific project folders.
    // Delete those too so recreating the same log name can never inherit
    // old backgrounds/audio/SVGs from a deleted log.
    const directoryTargets = [
        path.join(publicDir, 'themes', `custom-builder-${safeId}`),
        path.join(publicDir, 'sounds', `custom-builder-${safeId}`),
        path.join(publicDir, 'svg', `custom-builder-${safeId}`),
        path.join(publicDir, 'media', safeId)
    ];

    directoryTargets.forEach(target => {
        if (fs.existsSync(target)) {
            fs.rmSync(target, { recursive: true, force: true });
        }
    });

    const apps = JSON.parse(fs.readFileSync(APPS_DB_PATH, 'utf8'))
        .filter(app => app.id !== id);

    fs.writeFileSync(APPS_DB_PATH, JSON.stringify(apps, null, 2));

    res.json({ status: 'success' });
});

// --- V246: Daily Log media file storage ------------------------------------
// Daily Log note images are stored as real files instead of base64 strings in
// the database.  Old databases remain compatible: any data:image/... entry is
// migrated to public/media/<log>/daily-logs/day-<n>/ on the next load/save.
function safeDailyMediaSegmentV246(value, fallback = 'log') {
    const cleaned = String(value || '').trim().toLowerCase()
        .replace(/[^a-z0-9_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
    return cleaned || fallback;
}

function dailyMediaRootV246(hobby) {
    return path.join(publicDir, 'media', safeDailyMediaSegmentV246(hobby));
}

function dailyImageExtV246(mime, originalName = '') {
    const map = {
        'image/png': '.png',
        'image/jpeg': '.jpg',
        'image/jpg': '.jpg',
        'image/webp': '.webp',
        'image/gif': '.gif',
        'image/avif': '.avif',
        'image/svg+xml': '.svg'
    };
    const normalized = String(mime || '').toLowerCase();
    if (map[normalized]) return map[normalized];
    const ext = path.extname(String(originalName || '')).toLowerCase();
    if (['.png','.jpg','.jpeg','.webp','.gif','.avif','.svg'].includes(ext)) {
        return ext === '.jpeg' ? '.jpg' : ext;
    }
    return '';
}

function decodeDailyImageDataUrlV246(value) {
    const match = String(value || '').match(/^data:(image\/[a-z0-9.+-]+);base64,(.+)$/is);
    if (!match) return null;
    try {
        return { mime: match[1].toLowerCase(), buffer: Buffer.from(match[2], 'base64') };
    } catch (_) {
        return null;
    }
}

function uniqueDailyMediaFileV246(dir, base, ext) {
    fs.mkdirSync(dir, { recursive: true });
    const clean = String(base || 'image').replace(/[^a-zA-Z0-9_-]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 70) || 'image';
    let name = `${clean}${ext}`;
    let n = 2;
    while (fs.existsSync(path.join(dir, name))) name = `${clean}-${n++}${ext}`;
    return name;
}

function writeDailyImageV246(hobby, day, buffer, mime, originalName = 'image') {
    if (!Buffer.isBuffer(buffer) || !buffer.length) return null;
    const ext = dailyImageExtV246(mime, originalName);
    if (!ext) return null;
    const dayNumber = Math.max(1, Number.parseInt(day, 10) || 1);
    const dir = path.join(dailyMediaRootV246(hobby), 'daily-logs', `day-${dayNumber}`);
    const baseRaw = path.basename(String(originalName || 'image'), path.extname(String(originalName || 'image')));
    const base = `${baseRaw || 'image'}-${Date.now()}-${Math.random().toString(36).slice(2,7)}`;
    const filename = uniqueDailyMediaFileV246(dir, base, ext);
    const absolute = path.join(dir, filename);
    fs.writeFileSync(absolute, buffer);
    const projectPath = path.relative(__dirname, absolute).replace(/\\/g, '/');
    const url = '/' + path.relative(publicDir, absolute).split(path.sep).map(encodeURIComponent).join('/');
    return { src: url, projectPath, name: filename, mime: String(mime || '') };
}

function resolveDailyMediaProjectPathV246(hobby, image) {
    if (!image || typeof image !== 'object') return null;
    const projectPath = String(image.projectPath || image.path || '').trim();
    if (projectPath) {
        const abs = path.resolve(__dirname, projectPath);
        const root = path.resolve(dailyMediaRootV246(hobby)) + path.sep;
        if (abs.startsWith(root)) return abs;
    }
    const src = String(image.src || '').trim();
    if (src.startsWith('/media/')) {
        const abs = path.resolve(publicDir, '.' + decodeURIComponent(src));
        const root = path.resolve(dailyMediaRootV246(hobby)) + path.sep;
        if (abs.startsWith(root)) return abs;
    }
    return null;
}

function migrateDailyNoteImagesV246(hobby, data) {
    let changed = false;
    const days = data && typeof data === 'object' ? data.days : null;
    if (!days || typeof days !== 'object') return { data, changed };
    Object.entries(days).forEach(([dayKey, dayData]) => {
        if (!dayData || !Array.isArray(dayData.noteImages)) return;
        dayData.noteImages = dayData.noteImages.map((entry, index) => {
            const src = typeof entry === 'string' ? entry : String(entry?.src || entry?.data || '');
            const decoded = decodeDailyImageDataUrlV246(src);
            if (!decoded) {
                // Repair an existing project-backed image URL from projectPath.
                if (entry && typeof entry === 'object' && entry.projectPath) {
                    const abs = resolveDailyMediaProjectPathV246(hobby, entry);
                    if (abs && fs.existsSync(abs)) {
                        const repaired = '/' + path.relative(publicDir, abs).split(path.sep).map(encodeURIComponent).join('/');
                        if (entry.src !== repaired) { entry.src = repaired; changed = true; }
                    }
                }
                return entry;
            }
            const saved = writeDailyImageV246(hobby, dayKey, decoded.buffer, decoded.mime, `image-${index + 1}`);
            if (!saved) return entry;
            changed = true;
            return {
                ...saved,
                starred: !!(entry && typeof entry === 'object' && entry.starred)
            };
        });
    });
    return { data, changed };
}


// --- V249: Notepad project-backed image storage ---------------------------
// Full-screen Notepad pages keep images as files under
// public/media/<log>/notepad/<tab>/<page>/ and store only path metadata in JSON.
function notepadMediaRootV249(hobby) {
    return path.join(dailyMediaRootV246(hobby), 'notepad');
}

function writeNotepadImageV249(hobby, tabId, pageId, buffer, mime, originalName = 'image') {
    if (!Buffer.isBuffer(buffer) || !buffer.length) return null;
    const ext = dailyImageExtV246(mime, originalName);
    if (!ext) return null;
    const safeTab = safeDailyMediaSegmentV246(tabId, 'notepad');
    const safePage = safeDailyMediaSegmentV246(pageId, 'page');
    const dir = path.join(notepadMediaRootV249(hobby), safeTab, safePage);
    const baseRaw = path.basename(String(originalName || 'image'), path.extname(String(originalName || 'image')));
    const base = `${baseRaw || 'image'}-${Date.now()}-${Math.random().toString(36).slice(2,7)}`;
    const filename = uniqueDailyMediaFileV246(dir, base, ext);
    const absolute = path.join(dir, filename);
    fs.writeFileSync(absolute, buffer);
    const projectPath = path.relative(__dirname, absolute).replace(/\\/g, '/');
    const url = '/' + path.relative(publicDir, absolute).split(path.sep).map(encodeURIComponent).join('/');
    return { src:url, projectPath, name:filename, mime:String(mime || '') };
}

function resolveNotepadMediaProjectPathV249(hobby, image) {
    if (!image || typeof image !== 'object') return null;
    const root = path.resolve(notepadMediaRootV249(hobby)) + path.sep;
    const projectPath = String(image.projectPath || image.path || '').trim();
    if (projectPath) {
        const absolute = path.resolve(__dirname, projectPath);
        if (absolute.startsWith(root)) return absolute;
    }
    const src = String(image.src || '').trim();
    if (src.startsWith('/media/')) {
        const absolute = path.resolve(publicDir, '.' + decodeURIComponent(src));
        if (absolute.startsWith(root)) return absolute;
    }
    return null;
}

function forEachNotepadPageV249(data, callback) {
    const tabs = data?.settings?.customTabs;
    if (!Array.isArray(tabs)) return;
    tabs.forEach(tab => {
        const state = tab?.notepadV249;
        if (!state || !Array.isArray(state.pages)) return;
        state.pages.forEach(page => callback(tab, page));
    });
}

function migrateNotepadImagesV249(hobby, data) {
    let changed = false;
    forEachNotepadPageV249(data, (tab, page) => {
        if (!Array.isArray(page.images)) return;
        page.images = page.images.map((entry, index) => {
            const src = typeof entry === 'string' ? entry : String(entry?.src || entry?.data || '');
            const decoded = decodeDailyImageDataUrlV246(src);
            if (!decoded) {
                if (entry && typeof entry === 'object' && entry.projectPath) {
                    const absolute = resolveNotepadMediaProjectPathV249(hobby, entry);
                    if (absolute && fs.existsSync(absolute)) {
                        const repaired = '/' + path.relative(publicDir, absolute).split(path.sep).map(encodeURIComponent).join('/');
                        if (entry.src !== repaired) { entry.src = repaired; changed = true; }
                    }
                }
                return entry;
            }
            const saved = writeNotepadImageV249(hobby, tab?.id || 'notepad', page?.id || 'page', decoded.buffer, decoded.mime, entry?.name || `image-${index + 1}`);
            if (!saved) return entry;
            changed = true;
            return {
                ...(entry && typeof entry === 'object' ? entry : {}),
                ...saved,
                id: String(entry?.id || `notepad-image-${Date.now()}-${index}`),
                caption: String(entry?.caption || '')
            };
        });
    });
    return { data, changed };
}

function embedNotepadMediaForBackupV249(hobby, clone) {
    forEachNotepadPageV249(clone, (_tab, page) => {
        if (!Array.isArray(page.images)) return;
        page.images = page.images.map(entry => {
            if (!entry || typeof entry !== 'object') return entry;
            const absolute = resolveNotepadMediaProjectPathV249(hobby, entry);
            if (!absolute || !fs.existsSync(absolute)) return entry;
            try {
                const ext = path.extname(absolute).toLowerCase();
                const mimeMap = { '.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp','.gif':'image/gif','.avif':'image/avif','.svg':'image/svg+xml' };
                const mime = entry.mime || mimeMap[ext] || 'application/octet-stream';
                return { ...entry, src:`data:${mime};base64,${fs.readFileSync(absolute).toString('base64')}`, projectPath:'', mime, name:entry.name || path.basename(absolute) };
            } catch (_) { return entry; }
        });
    });
    return clone;
}


// --- V251: Whiteboard project-backed image storage ------------------------
// Whiteboard images live under public/media/<log>/whiteboard/<tab>/<board>/.
// Board JSON stores only URL/projectPath metadata so large images do not bloat
// the main log database or slow every save.
function whiteboardMediaRootV251(hobby) {
    return path.join(dailyMediaRootV246(hobby), 'whiteboard');
}

function writeWhiteboardImageV251(hobby, tabId, boardId, buffer, mime, originalName = 'image') {
    if (!Buffer.isBuffer(buffer) || !buffer.length) return null;
    const ext = dailyImageExtV246(mime, originalName);
    if (!ext) return null;
    const safeTab = safeDailyMediaSegmentV246(tabId, 'whiteboard');
    const safeBoard = safeDailyMediaSegmentV246(boardId, 'board');
    const dir = path.join(whiteboardMediaRootV251(hobby), safeTab, safeBoard);
    const baseRaw = path.basename(String(originalName || 'image'), path.extname(String(originalName || 'image')));
    const base = `${baseRaw || 'image'}-${Date.now()}-${Math.random().toString(36).slice(2,7)}`;
    const filename = uniqueDailyMediaFileV246(dir, base, ext);
    const absolute = path.join(dir, filename);
    fs.writeFileSync(absolute, buffer);
    return {
        src:'/' + path.relative(publicDir, absolute).split(path.sep).map(encodeURIComponent).join('/'),
        projectPath:path.relative(__dirname, absolute).replace(/\\/g, '/'),
        name:filename,
        mime:String(mime || '')
    };
}

function resolveWhiteboardMediaProjectPathV251(hobby, image) {
    if (!image || typeof image !== 'object') return null;
    const root = path.resolve(whiteboardMediaRootV251(hobby)) + path.sep;
    const projectPath = String(image.projectPath || image.path || '').trim();
    if (projectPath) {
        const absolute = path.resolve(__dirname, projectPath);
        if (absolute.startsWith(root)) return absolute;
    }
    const src = String(image.src || '').trim();
    if (src.startsWith('/media/')) {
        const absolute = path.resolve(publicDir, '.' + decodeURIComponent(src));
        if (absolute.startsWith(root)) return absolute;
    }
    return null;
}

function forEachWhiteboardBoardV251(data, callback) {
    const tabs = data?.settings?.customTabs;
    if (!Array.isArray(tabs)) return;
    tabs.forEach(tab => {
        const state = tab?.whiteboardV198;
        if (!state || !Array.isArray(state.boards)) return;
        state.boards.forEach(board => callback(tab, board));
    });
}

function migrateWhiteboardImagesV251(hobby, data) {
    let changed = false;
    forEachWhiteboardBoardV251(data, (tab, board) => {
        if (!Array.isArray(board.images)) {
            board.images = [];
            changed = true;
            return;
        }
        board.images = board.images.map((entry, index) => {
            if (!entry || typeof entry !== 'object') return entry;
            const decoded = decodeDailyImageDataUrlV246(entry.src || entry.data || '');
            if (decoded) {
                const saved = writeWhiteboardImageV251(
                    hobby,
                    tab?.id || 'whiteboard',
                    board?.id || 'board',
                    decoded.buffer,
                    decoded.mime,
                    entry.name || `image-${index + 1}`
                );
                if (saved) {
                    changed = true;
                    return { ...entry, ...saved };
                }
                return entry;
            }
            if (entry.projectPath) {
                const absolute = resolveWhiteboardMediaProjectPathV251(hobby, entry);
                if (absolute && fs.existsSync(absolute)) {
                    const repaired = '/' + path.relative(publicDir, absolute).split(path.sep).map(encodeURIComponent).join('/');
                    if (entry.src !== repaired) {
                        entry.src = repaired;
                        changed = true;
                    }
                }
            }
            return entry;
        });
        if (!Array.isArray(board.texts)) {
            board.texts = [];
            changed = true;
        }
    });
    return { data, changed };
}

function embedWhiteboardMediaForBackupV251(hobby, clone) {
    forEachWhiteboardBoardV251(clone, (_tab, board) => {
        if (!Array.isArray(board.images)) return;
        board.images = board.images.map(entry => {
            if (!entry || typeof entry !== 'object') return entry;
            const absolute = resolveWhiteboardMediaProjectPathV251(hobby, entry);
            if (!absolute || !fs.existsSync(absolute)) return entry;
            try {
                const ext = path.extname(absolute).toLowerCase();
                const mimeMap = { '.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp','.gif':'image/gif','.avif':'image/avif','.svg':'image/svg+xml' };
                const mime = entry.mime || mimeMap[ext] || 'application/octet-stream';
                return {
                    ...entry,
                    src:`data:${mime};base64,${fs.readFileSync(absolute).toString('base64')}`,
                    projectPath:'',
                    mime,
                    name:entry.name || path.basename(absolute)
                };
            } catch (_) {
                return entry;
            }
        });
    });
    return clone;
}

function exportDbWithEmbeddedDailyMediaV246(hobby, sourceDb) {
    const clone = JSON.parse(JSON.stringify(sourceDb || {}));
    Object.entries(clone.days || {}).forEach(([dayKey, dayData]) => {
        if (!Array.isArray(dayData?.noteImages)) return;
        dayData.noteImages = dayData.noteImages.map(entry => {
            if (!entry || typeof entry !== 'object') return entry;
            const abs = resolveDailyMediaProjectPathV246(hobby, entry);
            if (!abs || !fs.existsSync(abs)) return entry;
            try {
                const ext = path.extname(abs).toLowerCase();
                const mimeMap = { '.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp','.gif':'image/gif','.avif':'image/avif','.svg':'image/svg+xml' };
                const mime = entry.mime || mimeMap[ext] || 'application/octet-stream';
                const dataUrl = `data:${mime};base64,${fs.readFileSync(abs).toString('base64')}`;
                return { src: dataUrl, starred: !!entry.starred, name: entry.name || path.basename(abs), mime };
            } catch (_) {
                return entry;
            }
        });
    });
    embedNotepadMediaForBackupV249(hobby, clone);
    embedWhiteboardMediaForBackupV251(hobby, clone);
    embedKbAttachmentsForBackupV250(hobby, clone);
    return clone;
}


// --- V250: Knowledge Base file attachments -------------------------------
function kbAttachmentRootV250(hobby) {
    return path.join(dailyMediaRootV246(hobby), 'kb', 'attachments');
}
function writeKbAttachmentV250(hobby, buffer, mime, originalName='attachment') {
    if (!Buffer.isBuffer(buffer) || !buffer.length) return null;
    const dir = kbAttachmentRootV250(hobby); fs.mkdirSync(dir,{recursive:true});
    const extRaw = path.extname(String(originalName||''));
    const ext = extRaw && /^\.[a-z0-9]{1,10}$/i.test(extRaw) ? extRaw.toLowerCase() : '';
    const baseRaw = path.basename(String(originalName||'attachment'), extRaw).replace(/[^a-z0-9._-]+/gi,'-').replace(/^-+|-+$/g,'') || 'attachment';
    const filename = uniqueDailyMediaFileV246(dir, `${baseRaw}-${Date.now()}-${Math.random().toString(36).slice(2,7)}`, ext || '.bin');
    const absolute = path.join(dir,filename); fs.writeFileSync(absolute,buffer);
    return {__loggyKbAttachmentV250:true,name:path.basename(String(originalName||filename)),mime:String(mime||'application/octet-stream'),size:buffer.length,projectPath:path.relative(__dirname,absolute).replace(/\\/g,'/'),url:'/'+path.relative(publicDir,absolute).split(path.sep).map(encodeURIComponent).join('/')};
}
function resolveKbAttachmentV250(hobby, entry) {
    if(!entry||typeof entry!=='object') return null; const root=path.resolve(kbAttachmentRootV250(hobby))+path.sep;
    const pp=String(entry.projectPath||'').trim(); if(pp){const a=path.resolve(__dirname,pp);if(a.startsWith(root))return a}
    const u=String(entry.url||entry.src||''); if(u.startsWith('/media/')){const a=path.resolve(publicDir,'.'+decodeURIComponent(u));if(a.startsWith(root))return a} return null;
}
function walkKbAttachmentsV250(data, callback) {
    Object.values(data?.phrase_meta||{}).forEach(meta=>{const cf=meta?.custom_fields;if(!cf||typeof cf!=='object')return;Object.entries(cf).forEach(([key,value])=>{let entry=null;try{entry=typeof value==='string'?JSON.parse(value):value}catch{}if(entry?.__loggyKbAttachmentV250)callback(cf,key,entry)})});
}
function migrateKbAttachmentsV250(hobby,data){let changed=false;walkKbAttachmentsV250(data,(cf,key,entry)=>{if(entry.dataUrl){const decoded=decodeThemeAssetDataUrl(entry.dataUrl);if(decoded){const saved=writeKbAttachmentV250(hobby,decoded.buffer,decoded.mime,entry.name||'attachment');if(saved){cf[key]=JSON.stringify(saved);changed=true}}return}const abs=resolveKbAttachmentV250(hobby,entry);if(abs&&fs.existsSync(abs)){const url='/'+path.relative(publicDir,abs).split(path.sep).map(encodeURIComponent).join('/');if(entry.url!==url){entry.url=url;cf[key]=JSON.stringify(entry);changed=true}}});return{data,changed}}
function embedKbAttachmentsForBackupV250(hobby,clone){walkKbAttachmentsV250(clone,(cf,key,entry)=>{const abs=resolveKbAttachmentV250(hobby,entry);if(!abs||!fs.existsSync(abs))return;try{cf[key]=JSON.stringify({...entry,projectPath:'',url:'',dataUrl:`data:${entry.mime||'application/octet-stream'};base64,${fs.readFileSync(abs).toString('base64')}`})}catch{}});return clone}

// --- Database Helpers ---
const getDb = (hobby) => {
    // V284: /theme-studio-host is an internal, disposable Theme Builder shell.
    // It must never inherit or retain a user's log theme. In particular, an old
    // accidental theme-studio-host_db.json must not make Create Theme boot into
    // that saved theme (the Bee-theme flash/host-page leak reported from Dashboard).
    if (String(hobby || '') === 'theme-studio-host') {
        return {
            days: {}, tools: [], phrases: [], phrase_meta: {}, srs: {}, reading_gallery: [], startDate: null,
            settings: {
                theme: 'default',
                categories: ['Category'],
                categorySettings: { Category: { fields: [] } },
                libraryView: 'list',
                hideCategoriesInPolaroid: false,
                dailyViewType: 'default',
                dailyPolaroidSource: 'starred',
                companion: 'none',
                cursorStyle: 'default',
                customTabs: []
            }
        };
    }

    const dbPath = path.join(DATA_DIR, `${hobby}_db.json`);
    if (!fs.existsSync(dbPath)) return { days: {}, tools: [], phrases: [], phrase_meta: {}, srs: {}, reading_gallery: [], startDate: null };
    const parsed = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    const dailyMigrated = migrateDailyNoteImagesV246(hobby, parsed);
    const notepadMigrated = migrateNotepadImagesV249(hobby, dailyMigrated.data);
    const whiteboardMigrated = migrateWhiteboardImagesV251(hobby, notepadMigrated.data);
    const kbMigrated = migrateKbAttachmentsV250(hobby, whiteboardMigrated.data);
    if (dailyMigrated.changed || notepadMigrated.changed || whiteboardMigrated.changed || kbMigrated.changed) fs.writeFileSync(dbPath, JSON.stringify(kbMigrated.data, null, 2));
    return kbMigrated.data;
};

const saveDb = (hobby, data) => {
    // V284: never persist application state for the internal Theme Studio host.
    // Theme assets/library entries use their own Theme Builder persistence paths;
    // the host's ordinary log database is intentionally read-only and disposable.
    if (String(hobby || '') === 'theme-studio-host') return getDb('theme-studio-host');

    const dailyMigrated = migrateDailyNoteImagesV246(hobby, data || {});
    const notepadMigrated = migrateNotepadImagesV249(hobby, dailyMigrated.data);
    const whiteboardMigrated = migrateWhiteboardImagesV251(hobby, notepadMigrated.data);
    const kbMigrated = migrateKbAttachmentsV250(hobby, whiteboardMigrated.data);
    fs.writeFileSync(path.join(DATA_DIR, `${hobby}_db.json`), JSON.stringify(kbMigrated.data, null, 2));
    return kbMigrated.data;
};

// --- TTS Audio Proxy Endpoint for Korean Pronunciation ---
app.get('/api/tts', async (req, res) => {
    const text = req.query.text;
    const lang = (req.query.lang || 'ko').trim().slice(0, 10) || 'ko';
    if (!text) return res.status(400).send('No text provided');
    try {
        const url = `https://translate.google.com/translate_tts?ie=UTF-8&tl=${encodeURIComponent(lang)}&client=tw-ob&q=${encodeURIComponent(text)}`;
        const response = await fetch(url, {
            headers: { 'User-Agent': 'Mozilla/5.0' }
        });
        if (!response.ok) throw new Error('TTS fetch failed');
        const buffer = await response.arrayBuffer();
        res.set('Content-Type', 'audio/mpeg');
        res.send(Buffer.from(buffer));
    } catch (err) {
        res.status(500).send('TTS Audio unavailable');
    }
});


// --- Theme Builder Asset Storage -------------------------------------------
// The browser cannot literally move/delete a file from the user's Downloads
// folder. Instead, Theme Builder uploads a copy here so the project contains
// real files that can be committed to GitHub.
//
// Background images:
//   public/themes/custom-builder-<log>/assets/
//
// Theme audio:
//   public/sounds/custom-builder-<log>/
//
// Theme SVG / PNG decorations:
//   public/svg/custom-builder-<log>/
// --------------------------------------------------------------------------

function safeAssetSegment(value, fallback = 'log') {
    const cleaned = String(value || '')
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9_-]+/g, '-')
        .replace(/^-+|-+$/g, '');

    return cleaned || fallback;
}

function safeAssetFilename(value, fallback = 'asset') {
    const raw = path.basename(String(value || fallback));
    const ext = path.extname(raw).toLowerCase();
    const base = path.basename(raw, ext)
        .replace(/[^a-zA-Z0-9_-]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 90) || fallback;

    return { base, ext };
}

function decodeThemeAssetDataUrl(dataUrl) {
    const match = String(dataUrl || '').match(
        /^data:([^;,]+)?(?:;charset=[^;,]+)?;base64,(.+)$/s
    );

    if (!match) return null;

    try {
        return {
            mime: String(match[1] || 'application/octet-stream').toLowerCase(),
            buffer: Buffer.from(match[2], 'base64')
        };
    } catch (error) {
        return null;
    }
}

function themeAssetExtForMime(kind, mime, originalExt) {
    const ext = String(originalExt || '').toLowerCase();

    if (kind === 'svg') {
        if (
            mime === 'image/svg+xml' ||
            ext === '.svg'
        ) {
            return '.svg';
        }

        if (
            mime === 'image/png' ||
            ext === '.png'
        ) {
            return '.png';
        }

        if (
            mime === 'image/jpeg' ||
            ext === '.jpg' ||
            ext === '.jpeg'
        ) {
            return '.jpg';
        }

        return '';
    }

    const imageMap = {
        'image/png': '.png',
        'image/jpeg': '.jpg',
        'image/webp': '.webp',
        'image/gif': '.gif',
        'image/avif': '.avif'
    };

    const audioMap = {
        'audio/mpeg': '.mp3',
        'audio/mp3': '.mp3',
        'audio/wav': '.wav',
        'audio/x-wav': '.wav',
        'audio/ogg': '.ogg',
        'audio/aac': '.aac',
        'audio/mp4': '.m4a',
        'audio/x-m4a': '.m4a',
        'audio/webm': '.webm'
    };

    if (kind === 'background') {
        return imageMap[mime] || (
            ['.png', '.jpg', '.jpeg', '.webp', '.gif', '.avif'].includes(ext)
                ? (ext === '.jpeg' ? '.jpg' : ext)
                : ''
        );
    }

    if (kind === 'audio') {
        return audioMap[mime] || (
            ['.mp3', '.wav', '.ogg', '.aac', '.m4a', '.webm'].includes(ext)
                ? ext
                : ''
        );
    }

    return '';
}

function uniqueThemeAssetPath(dir, base, ext) {
    let filename = `${base}${ext}`;
    let candidate = path.join(dir, filename);
    let counter = 2;

    while (fs.existsSync(candidate)) {
        filename = `${base}-${counter}${ext}`;
        candidate = path.join(dir, filename);
        counter += 1;
    }

    return { filename, absolutePath: candidate };
}

function customThemeAssetLocations(hobby) {
    const safeHobby = safeAssetSegment(hobby);

    return {
        safeHobby,
        background: {
            dir: path.join(
                publicDir,
                'themes',
                `custom-builder-${safeHobby}`,
                'assets'
            ),
            publicPrefix:
                `/themes/custom-builder-${safeHobby}/assets`
        },
        audio: {
            dir: path.join(
                publicDir,
                'sounds',
                `custom-builder-${safeHobby}`
            ),
            publicPrefix:
                `/sounds/custom-builder-${safeHobby}`
        },
        svg: {
            dir: path.join(
                publicDir,
                'svg',
                `custom-builder-${safeHobby}`
            ),
            publicPrefix:
                `/svg/custom-builder-${safeHobby}`
        }
    };
}

app.get('/api/theme-assets-status', (req, res) => {
    res.json({
        status: 'success',
        feature: 'theme-assets',
        version: 3,
        publicDir
    });
});


// V109 — Built-in Theme Builder asset discovery.
// Return only public image assets from the current project's built-in theme
// folders. This avoids fragile source-code regexes when Theme Builder needs to
// reconstruct a built-in theme's Decorations list.

app.get('/api/built-in-theme-assets/:themeName', (req, res) => {
    const themeName = safeAssetSegment(req.params.themeName, '');
    if (!themeName) {
        return res.status(400).json({ status: 'error', message: 'Invalid built-in theme name.' });
    }

    const imageExts = new Set(['.svg', '.png', '.jpg', '.jpeg', '.webp', '.gif', '.avif']);
    const audioExts = new Set(['.mp3', '.wav', '.ogg', '.m4a', '.aac', '.flac']);
    const themeDir = path.join(publicDir, 'themes', themeName);
    const svgRoot = path.join(publicDir, 'svg');
    const soundsRoot = path.join(publicDir, 'sounds');

    const assets = [];
    const audio = [];
    const seen = new Set();

    function publicUrlForDisk(diskPath) {
        let rel = '';
        try { rel = path.relative(publicDir, diskPath); } catch { return ''; }
        if (!rel || rel.startsWith('..') || path.isAbsolute(rel)) return '';
        return '/' + rel.split(path.sep).map(part => encodeURIComponent(part)).join('/');
    }

    function addFile(diskPath, kindHint = '') {
        let stat;
        try { stat = fs.statSync(diskPath); } catch { return false; }
        if (!stat.isFile()) return false;

        const ext = path.extname(diskPath).toLowerCase();
        const isImage = imageExts.has(ext);
        const isAudio = audioExts.has(ext);
        if (!isImage && !isAudio) return false;

        const url = publicUrlForDisk(diskPath);
        if (!url) return false;
        const key = url.toLowerCase();
        if (seen.has(key)) return true;
        seen.add(key);

        const item = {
            name: path.basename(diskPath),
            url,
            type: ext.slice(1),
            inheritedBuiltInV109: true,
            inheritedBuiltInV121: true,
            inheritedBuiltInV123: true,
            inheritedBuiltInV127: true,
            assetKind: kindHint || (isImage ? 'image' : 'audio')
        };
        (isImage ? assets : audio).push(item);
        return true;
    }

    function walkFolder(rootDir, depth = 4) {
        if (depth < 0 || !fs.existsSync(rootDir)) return;
        let entries = [];
        try { entries = fs.readdirSync(rootDir, { withFileTypes: true }); } catch { return; }

        for (const entry of entries) {
            if (!entry?.name || entry.name.startsWith('.')) continue;
            const diskPath = path.join(rootDir, entry.name);
            if (entry.isDirectory()) walkFolder(diskPath, depth - 1);
            else if (entry.isFile()) addFile(diskPath);
        }
    }

    function safeFolderUnder(rootDir, folderName) {
        const safe = safeAssetSegment(folderName, '');
        if (!safe) return '';
        const candidate = path.resolve(rootDir, safe);
        const resolvedRoot = path.resolve(rootDir) + path.sep;
        if (!candidate.startsWith(resolvedRoot)) return '';
        return candidate;
    }

    // Exact project convention first: public/svg/theme-<built-in-theme>.
    let foundExactSvgFolder = false;
    for (const folderName of [`theme-${themeName}`, themeName]) {
        const folder = safeFolderUnder(svgRoot, folderName);
        if (!folder || !fs.existsSync(folder)) continue;
        let stat;
        try { stat = fs.statSync(folder); } catch { continue; }
        if (!stat.isDirectory()) continue;
        foundExactSvgFolder = true;
        walkFolder(folder, 4);
    }

    // Theme-owned media folders inside public/themes/<theme>/.
    [path.join(themeDir, 'assets'), path.join(themeDir, 'images')].forEach(folder => {
        if (fs.existsSync(folder)) walkFolder(folder, 4);
    });
    [
        path.join(soundsRoot, `theme-${themeName}`),
        path.join(soundsRoot, themeName),
        path.join(themeDir, 'audio'),
        path.join(themeDir, 'sounds')
    ].forEach(folder => {
        if (fs.existsSync(folder)) walkFolder(folder, 4);
    });

    // Read only THIS theme's own source files. This supports exact aliases such
    // as themes/seahorses -> svg/theme-seahorse without searching other themes.
    const sourceFiles = [];
    function collectSourceFiles(dir, depth = 4) {
        if (depth < 0 || !fs.existsSync(dir)) return;
        let entries = [];
        try { entries = fs.readdirSync(dir, { withFileTypes: true }); } catch { return; }
        for (const entry of entries) {
            if (!entry?.name || entry.name.startsWith('.')) continue;
            const disk = path.join(dir, entry.name);
            if (entry.isDirectory()) collectSourceFiles(disk, depth - 1);
            else if (entry.isFile() && ['.js', '.css', '.html', '.json'].includes(path.extname(entry.name).toLowerCase())) sourceFiles.push(disk);
        }
    }
    collectSourceFiles(themeDir, 4);

    const referencedSvgFolders = new Set();
    const referencedSoundFolders = new Set();
    const directRefs = [];

    function normalizePublicRef(raw) {
        let ref = String(raw || '').trim().replace(/\\/g, '/');
        if (!ref || ref.startsWith('data:') || ref.startsWith('blob:') || /^[a-z]+:\/\//i.test(ref)) return '';
        ref = ref.split(/[?#]/)[0];
        while (ref.startsWith('./')) ref = ref.slice(2);
        return ref;
    }

    for (const sourceFile of sourceFiles) {
        let source = '';
        try { source = fs.readFileSync(sourceFile, 'utf8'); } catch { continue; }

        const svgFolderRe = /(?:^|[^a-z0-9_-])\/?svg\/(theme-[a-z0-9._-]+)(?=\/|["'`\s),;]|$)/gi;
        let match;
        while ((match = svgFolderRe.exec(source))) referencedSvgFolders.add(match[1]);

        const soundFolderRe = /(?:^|[^a-z0-9_-])\/?sounds\/([a-z0-9._-]+)(?=\/|["'`\s),;]|$)/gi;
        while ((match = soundFolderRe.exec(source))) referencedSoundFolders.add(match[1]);

        const mediaRefRe = /["'`]([^"'`\n\r]+?\.(?:svg|png|jpe?g|webp|gif|avif|mp3|wav|ogg|m4a|aac|flac)(?:[?#][^"'`\n\r]*)?)["'`]/gi;
        while ((match = mediaRefRe.exec(source))) directRefs.push({ ref: match[1], sourceFile });
    }

    // Only folders explicitly referenced by this theme's own source are allowed.
    for (const folderName of referencedSvgFolders) {
        const folder = safeFolderUnder(svgRoot, folderName);
        if (folder && fs.existsSync(folder)) walkFolder(folder, 4);
    }
    for (const folderName of referencedSoundFolders) {
        const folder = safeFolderUnder(soundsRoot, folderName);
        if (folder && fs.existsSync(folder)) walkFolder(folder, 4);
    }

    for (const entry of directRefs) {
        const ref = normalizePublicRef(entry.ref);
        if (!ref) continue;
        const candidates = [];

        if (ref.startsWith('/')) candidates.push(path.join(publicDir, ref.replace(/^\/+/, '')));
        else {
            candidates.push(path.resolve(path.dirname(entry.sourceFile), ref));
            candidates.push(path.join(publicDir, ref));
        }

        const base = path.basename(ref);
        for (const folderName of referencedSvgFolders) {
            const folder = safeFolderUnder(svgRoot, folderName);
            if (folder) candidates.push(path.join(folder, base));
        }
        for (const folderName of referencedSoundFolders) {
            const folder = safeFolderUnder(soundsRoot, folderName);
            if (folder) candidates.push(path.join(folder, base));
        }

        for (const candidate of candidates) {
            if (addFile(candidate)) break;
        }
    }

    assets.sort((a, b) => String(a.name).localeCompare(String(b.name), undefined, { numeric: true, sensitivity: 'base' }));
    audio.sort((a, b) => String(a.name).localeCompare(String(b.name), undefined, { numeric: true, sensitivity: 'base' }));

    res.json({
        status: 'success',
        themeName,
        assets,
        audio,
        discovery: {
            exactSvgFolder: foundExactSvgFolder,
            referencedSvgFolders: [...referencedSvgFolders],
            referencedSoundFolders: [...referencedSoundFolders]
        }
    });
});

app.post('/api/theme-assets/:hobby', (req, res) => {
    const kind = String(req.body?.kind || '').toLowerCase();
    const fileName = String(req.body?.fileName || 'asset');
    const decoded = decodeThemeAssetDataUrl(req.body?.dataUrl);

    if (!['background', 'audio', 'svg'].includes(kind)) {
        return res.status(400).json({
            status: 'error',
            message: 'Unknown Theme Builder asset type.'
        });
    }

    if (!decoded) {
        return res.status(400).json({
            status: 'error',
            message: 'The uploaded file could not be read.'
        });
    }

    const maxBytes =
        kind === 'audio'
            ? 75 * 1024 * 1024
            : kind === 'background'
                ? 40 * 1024 * 1024
                : 10 * 1024 * 1024;

    if (decoded.buffer.length > maxBytes) {
        return res.status(413).json({
            status: 'error',
            message:
                kind === 'audio'
                    ? 'Audio files must be 75 MB or smaller.'
                    : kind === 'background'
                        ? 'Background images must be 40 MB or smaller.'
                        : 'Each SVG, PNG, or JPG decoration must be 10 MB or smaller.'
        });
    }

    const locations = customThemeAssetLocations(req.params.hobby);
    const location = locations[kind];
    const parsedName = safeAssetFilename(fileName);
    let ext = themeAssetExtForMime(
        kind,
        decoded.mime,
        parsedName.ext
    );

    if (!ext) {
        return res.status(400).json({
            status: 'error',
            message: `That ${kind} file type is not supported.`
        });
    }

    fs.mkdirSync(location.dir, { recursive: true });

    let base =
        kind === 'background'
            ? `background-${Date.now()}`
            : kind === 'audio'
                ? `theme-audio-${Date.now()}`
                : parsedName.base;

    const output = uniqueThemeAssetPath(
        location.dir,
        base,
        ext
    );

    let buffer = decoded.buffer;

    if (kind === 'svg' && ext === '.svg') {
        let markup = buffer.toString('utf8');

        if (!/<svg[\s>]/i.test(markup)) {
            return res.status(400).json({
                status: 'error',
                message: 'That file is not a valid SVG.'
            });
        }

        // Basic sanitizing for locally uploaded SVG decorations.
        markup = markup
            .replace(/<script[\s\S]*?<\/script>/gi, '')
            .replace(/\son\w+\s*=\s*(['"]).*?\1/gi, '');

        buffer = Buffer.from(markup, 'utf8');
    }

    if (kind === 'svg' && ext === '.png') {
        // PNG signature: 89 50 4E 47 0D 0A 1A 0A
        const pngSignature =
            Buffer.from([
                0x89, 0x50, 0x4E, 0x47,
                0x0D, 0x0A, 0x1A, 0x0A
            ]);

        if (
            buffer.length < pngSignature.length ||
            !buffer
                .subarray(
                    0,
                    pngSignature.length
                )
                .equals(
                    pngSignature
                )
        ) {
            return res.status(400).json({
                status: 'error',
                message: 'That file is not a valid PNG.'
            });
        }
    }

    if (kind === 'svg' && ext === '.jpg') {
        const isJpeg =
            buffer.length >= 4 &&
            buffer[0] === 0xFF &&
            buffer[1] === 0xD8 &&
            buffer[2] === 0xFF;

        if (!isJpeg) {
            return res.status(400).json({
                status: 'error',
                message: 'That file is not a valid JPG.'
            });
        }
    }

    fs.writeFileSync(output.absolutePath, buffer);

    const publicUrl =
        `${location.publicPrefix}/${encodeURIComponent(output.filename)}`;

    const projectPath =
        path.relative(
            __dirname,
            output.absolutePath
        ).replace(/\\/g, '/');

    res.json({
        status: 'success',
        kind,
        name: output.filename,
        url: publicUrl,
        projectPath
    });
});


// --- V95: responsive raw-binary Theme Builder uploads ---------------------
// Avoids FileReader -> base64 -> JSON.stringify on the browser main thread.
// The browser can stream the File/Blob body directly while Theme Builder stays
// interactive. The older JSON/data-URL endpoint remains for compatibility.
app.post(
    '/api/theme-assets-raw/:hobby',
    express.raw({ type: 'application/octet-stream', limit: '80mb' }),
    (req, res) => {
        const kind = String(req.query?.kind || '').toLowerCase();
        const fileName = String(req.query?.fileName || 'asset');
        const mime = String(req.query?.mime || 'application/octet-stream').toLowerCase();
        let buffer = Buffer.isBuffer(req.body) ? req.body : Buffer.alloc(0);

        if (!['background', 'audio', 'svg'].includes(kind)) {
            return res.status(400).json({
                status: 'error',
                message: 'Unknown Theme Builder asset type.'
            });
        }

        if (!buffer.length) {
            return res.status(400).json({
                status: 'error',
                message: 'The uploaded file was empty or could not be read.'
            });
        }

        const maxBytes =
            kind === 'audio'
                ? 75 * 1024 * 1024
                : kind === 'background'
                    ? 40 * 1024 * 1024
                    : 10 * 1024 * 1024;

        if (buffer.length > maxBytes) {
            return res.status(413).json({
                status: 'error',
                message:
                    kind === 'audio'
                        ? 'Audio files must be 75 MB or smaller.'
                        : kind === 'background'
                            ? 'Background images must be 40 MB or smaller.'
                            : 'Each SVG, PNG, or JPG decoration must be 10 MB or smaller.'
            });
        }

        const locations = customThemeAssetLocations(req.params.hobby);
        const location = locations[kind];
        const parsedName = safeAssetFilename(fileName);
        const ext = themeAssetExtForMime(kind, mime, parsedName.ext);

        if (!ext) {
            return res.status(400).json({
                status: 'error',
                message: `That ${kind} file type is not supported.`
            });
        }

        fs.mkdirSync(location.dir, { recursive: true });

        const base =
            kind === 'background'
                ? `background-${Date.now()}`
                : kind === 'audio'
                    ? `theme-audio-${Date.now()}`
                    : parsedName.base;

        const output = uniqueThemeAssetPath(location.dir, base, ext);

        if (kind === 'svg' && ext === '.svg') {
            let markup = buffer.toString('utf8');

            if (!/<svg[\s>]/i.test(markup)) {
                return res.status(400).json({
                    status: 'error',
                    message: 'That file is not a valid SVG.'
                });
            }

            markup = markup
                .replace(/<script[\s\S]*?<\/script>/gi, '')
                .replace(/\son\w+\s*=\s*(['"]).*?\1/gi, '');

            buffer = Buffer.from(markup, 'utf8');
        }

        if (kind === 'svg' && ext === '.png') {
            const pngSignature = Buffer.from([
                0x89, 0x50, 0x4E, 0x47,
                0x0D, 0x0A, 0x1A, 0x0A
            ]);

            if (
                buffer.length < pngSignature.length ||
                !buffer.subarray(0, pngSignature.length).equals(pngSignature)
            ) {
                return res.status(400).json({
                    status: 'error',
                    message: 'That file is not a valid PNG.'
                });
            }
        }

        if (kind === 'svg' && ext === '.jpg') {
            const isJpeg =
                buffer.length >= 4 &&
                buffer[0] === 0xFF &&
                buffer[1] === 0xD8 &&
                buffer[2] === 0xFF;

            if (!isJpeg) {
                return res.status(400).json({
                    status: 'error',
                    message: 'That file is not a valid JPG.'
                });
            }
        }

        fs.writeFileSync(output.absolutePath, buffer);

        const publicUrl =
            `${location.publicPrefix}/${encodeURIComponent(output.filename)}`;

        const projectPath =
            path.relative(__dirname, output.absolutePath).replace(/\\/g, '/');

        return res.json({
            status: 'success',
            kind,
            name: output.filename,
            url: publicUrl,
            projectPath
        });
    }
);

app.delete('/api/theme-assets/:hobby', (req, res) => {
    const url = String(req.body?.url || '');
    const locations = customThemeAssetLocations(req.params.hobby);

    const allowedPrefixes = [
        locations.background.publicPrefix,
        locations.audio.publicPrefix,
        locations.svg.publicPrefix
    ];

    const matchedPrefix =
        allowedPrefixes.find(prefix =>
            url.startsWith(`${prefix}/`)
        );

    if (!matchedPrefix) {
        return res.status(400).json({
            status: 'error',
            message: 'That file is not inside this log’s Theme Builder folders.'
        });
    }

    let decodedUrl;

    try {
        decodedUrl = decodeURIComponent(
            url.split('?')[0].split('#')[0]
        );
    } catch (error) {
        return res.status(400).json({
            status: 'error',
            message: 'Invalid asset path.'
        });
    }

    const absolutePath =
        path.resolve(
            publicDir,
            `.${decodedUrl}`
        );

    const allowedRoots = [
        path.resolve(locations.background.dir),
        path.resolve(locations.audio.dir),
        path.resolve(locations.svg.dir)
    ];

    const insideAllowedRoot =
        allowedRoots.some(root =>
            absolutePath === root ||
            absolutePath.startsWith(
                root + path.sep
            )
        );

    if (!insideAllowedRoot) {
        return res.status(400).json({
            status: 'error',
            message: 'Refusing to delete a file outside the Theme Builder folders.'
        });
    }

    if (fs.existsSync(absolutePath)) {
        fs.unlinkSync(absolutePath);
    }

    res.json({ status: 'success' });
});


// --- V95: cross-browser shared Theme Builder library -----------------------
// localStorage belongs to one browser/profile only. Persist the shared custom
// theme library in the project data folder too, then browsers can hydrate the
// same library from localhost:3000.
const SHARED_THEMES_DB_PATH_V95 = path.join(DATA_DIR, 'shared-themes-v95.json');

function readSharedThemesV95() {
    if (!fs.existsSync(SHARED_THEMES_DB_PATH_V95)) {
        return { themes: [], updatedAt: '' };
    }

    try {
        const parsed = JSON.parse(fs.readFileSync(SHARED_THEMES_DB_PATH_V95, 'utf8'));
        return {
            themes: Array.isArray(parsed?.themes) ? parsed.themes : [],
            updatedAt: String(parsed?.updatedAt || '')
        };
    } catch (error) {
        return { themes: [], updatedAt: '' };
    }
}

function writeSharedThemesV95(themes) {
    const clean = (Array.isArray(themes) ? themes : [])
        .filter(item => item && typeof item === 'object' && String(item.id || '').trim())
        .map(item => ({ ...item, id: String(item.id) }));

    const payload = {
        version: 1,
        updatedAt: new Date().toISOString(),
        themes: clean
    };

    fs.writeFileSync(
        SHARED_THEMES_DB_PATH_V95,
        JSON.stringify(payload, null, 2)
    );

    return payload;
}

app.get('/api/shared-themes', (req, res) => {
    const payload = readSharedThemesV95();
    res.json({
        status: 'success',
        version: 1,
        initialized: fs.existsSync(SHARED_THEMES_DB_PATH_V95),
        updatedAt: payload.updatedAt,
        themes: payload.themes
    });
});

app.put('/api/shared-themes', (req, res) => {
    if (!Array.isArray(req.body?.themes)) {
        return res.status(400).json({
            status: 'error',
            message: 'themes must be an array.'
        });
    }

    const payload = writeSharedThemesV95(req.body.themes);
    res.json({
        status: 'success',
        version: 1,
        updatedAt: payload.updatedAt,
        themes: payload.themes
    });
});


// --- V102: built-in theme overrides/renames -------------------------------
// Built-in themes keep their original IDs. Editing one in Theme Builder now
// stores an override keyed by that ID instead of manufacturing a custom copy.
const BUILT_IN_THEME_OVERRIDES_PATH_V102 = path.join(
    DATA_DIR,
    'built-in-theme-overrides-v102.json'
);

function readBuiltInThemeOverridesV102() {
    if (!fs.existsSync(BUILT_IN_THEME_OVERRIDES_PATH_V102)) {
        return { overrides: {}, updatedAt: '' };
    }

    try {
        const parsed = JSON.parse(
            fs.readFileSync(BUILT_IN_THEME_OVERRIDES_PATH_V102, 'utf8')
        );
        return {
            overrides:
                parsed?.overrides && typeof parsed.overrides === 'object' && !Array.isArray(parsed.overrides)
                    ? parsed.overrides
                    : {},
            updatedAt: String(parsed?.updatedAt || '')
        };
    } catch {
        return { overrides: {}, updatedAt: '' };
    }
}

function writeBuiltInThemeOverridesV102(overrides) {
    const clean = {};

    if (overrides && typeof overrides === 'object' && !Array.isArray(overrides)) {
        Object.entries(overrides).forEach(([id, value]) => {
            const key = String(id || '').trim();
            if (!key || !value || typeof value !== 'object') return;
            clean[key] = value;
        });
    }

    const payload = {
        version: 1,
        updatedAt: new Date().toISOString(),
        overrides: clean
    };

    fs.writeFileSync(
        BUILT_IN_THEME_OVERRIDES_PATH_V102,
        JSON.stringify(payload, null, 2)
    );

    return payload;
}

app.get('/api/built-in-theme-overrides', (req, res) => {
    const payload = readBuiltInThemeOverridesV102();
    res.json({
        status: 'success',
        version: 1,
        initialized: fs.existsSync(BUILT_IN_THEME_OVERRIDES_PATH_V102),
        updatedAt: payload.updatedAt,
        overrides: payload.overrides
    });
});

app.put('/api/built-in-theme-overrides', (req, res) => {
    if (
        !req.body?.overrides ||
        typeof req.body.overrides !== 'object' ||
        Array.isArray(req.body.overrides)
    ) {
        return res.status(400).json({
            status: 'error',
            message: 'overrides must be an object.'
        });
    }

    const payload = writeBuiltInThemeOverridesV102(req.body.overrides);
    res.json({
        status: 'success',
        version: 1,
        updatedAt: payload.updatedAt,
        overrides: payload.overrides
    });
});

// --- Routing ---
app.get('/', (req, res) => {
    // V240: revalidate the Dashboard shell so removed log-only widget code cannot linger.
    res.setHeader('Cache-Control', 'no-cache, must-revalidate');
    res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

// Internal Theme Builder runtime host.
// This is not an app/log, is never listed in apps.json, and does not require
// any user-created log to exist.
app.get('/theme-studio-host', (req, res) => {
    // V310: Theme Builder previews use the live template bootstrap. Never let a
    // cached preview shell retain older interactive Daily View Settings guards.
    res.setHeader('Cache-Control', 'no-cache, must-revalidate');
    const templatePath = path.join(__dirname, 'public', 'template.html');

    if (!fs.existsSync(templatePath)) {
        return res.status(500).send('Theme Builder template is missing.');
    }

    let html = fs.readFileSync(templatePath, 'utf8');

    html = html
        .replace(/TEMPLATE_APP_TITLE/g, 'THEME BUILDER')
        .replace(/\/?template\.css/g, '/template.css')
        .replace(/\/?template\.js/g, '/template.js');

    res.type('html').send(html);
});

app.get('/app/:hobby', (req, res) => {
    const filePath = path.join(__dirname, 'public', `${req.params.hobby}.html`);
    if (fs.existsSync(filePath)) {
        // V227: log shells are copied at creation time. Serve the saved shell,
        // but inject the small shared hotfix so even very old logs get the
        // current Add/Edit Field implementation without replacing their own JS/CSS.
        res.setHeader('Cache-Control', 'no-cache, must-revalidate');
        let html = fs.readFileSync(filePath, 'utf8');
        // V245: preserve the actual tab/day BEFORE an older copied core can run its
        // historical "always Daily Logs" startup code. The shared hotfix restores
        // these values after the copied app has initialized.
        const restoreStateV245 = `<script>(function(){try{var p=location.pathname.split('/').filter(Boolean),h=p[0]==='app'?(p[1]||'log'):(p[p.length-1]||'log'),k='last-app-tab:'+h;sessionStorage.setItem(k,'daily');sessionStorage.removeItem('loggy-notepad-route-v249');sessionStorage.removeItem('loggy-whiteboard-route-v207');window.__loggyRestoreStateV245={key:k,tab:'daily',hash:''};if(location.hash)history.replaceState(null,'',location.pathname+location.search);}catch(e){}})();<\/script>`;
        html = /<head[^>]*>/i.test(html)
            ? html.replace(/<head([^>]*)>/i, `<head$1>\n${restoreStateV245}`)
            : `${restoreStateV245}\n${html}`;
        // V242: page/tab settings use the sliders icon; only the global Settings button is a gear.
        // Rewrite old copied log shells so the correct icon is present before any JS paints.
        html = html
            .replace(/(<button\b[^>]*id=["']open-daily-settings-btn["'][^>]*>\s*<i\b[^>]*class=["'][^"']*ph-)gear(?:-six)?([^"']*["'][^>]*><\/i>\s*<\/button>)/i, '$1sliders-horizontal$2')
            .replace(/(<button\b[^>]*id=["']open-settings-btn["'][^>]*>\s*<i\b[^>]*class=["'][^"']*ph-)gear(?:-six)?([^"']*["'][^>]*><\/i>\s*<\/button>)/i, '$1sliders-horizontal$2');
        // V300 FIX (bug 3): these cache-bust query strings must always match the
        // versions template.html itself references. They had drifted (?v=250 here
        // vs ?v=258/?v=300 in template.html), so a saved log page could keep a
        // browser-cached older copy of template-extras-6.js indefinitely even
        // after the shared source file was rewritten -- letting the old,
        // un-isolated Theme Builder create/edit code run only on saved log pages
        // (never on /theme-studio-host, which always references template.html's
        // own tag directly). Keep these three literals in lock-step with the
        // matching <script> tags in template.html.
        const hotfixTag = '<script src="/template-hotfix-v221.js?v=303"></script>';
        const extrasV250Tag = '<script defer src="/template-extras-6.js?v=328"></script>';
        const widgetsTag = '<script defer src="/widgets-loader-v241.js?v=246"></script>';
        if (html.includes('/template-hotfix-v221.js')) {
            html = html.replace(
                /<script\b[^>]*src=["'][^"']*\/template-hotfix-v221\.js(?:\?[^"']*)?["'][^>]*><\/script>/i,
                hotfixTag
            );
        } else {
            html = /<\/body>/i.test(html)
                ? html.replace(/<\/body>/i, `${hotfixTag}\n</body>`)
                : `${html}\n${hotfixTag}`;
        }
        if (html.includes('/template-extras-6.js')) {
            html = html.replace(/<script\b[^>]*src=["'][^"']*\/template-extras-6\.js(?:\?[^"']*)?["'][^>]*><\/script>/i, extrasV250Tag);
        } else {
            html = /<\/body>/i.test(html) ? html.replace(/<\/body>/i, `${extrasV250Tag}\n</body>`) : `${html}\n${extrasV250Tag}`;
        }
        // V307: saved log pages are point-in-time copies of template.html, so
        // keep their feature-loader block synchronized with the live template on
        // every request. Older saved pages may also contain the retired V71 Theme
        // Builder repair script; remove that legacy block while replacing the
        // loader so V307 remains the only Theme Builder runtime.
        try {
            const templatePath = path.join(__dirname, 'public', 'template.html');
            const templateHtml = fs.readFileSync(templatePath, 'utf8');

            // V308: template.css no longer paints a translucent white pseudo-layer
            // over non-Daily-Logs views. Saved log shells are historical copies, so
            // synchronize the stylesheet URL with the live template as well. This
            // also cache-busts the removed overlay for existing logs and previews.
            const liveCssHref = templateHtml.match(/<link\b[^>]*rel=["']stylesheet["'][^>]*href=["']([^"']*\/template\.css(?:\?[^"']*)?)["'][^>]*>/i)?.[1]
                || templateHtml.match(/<link\b[^>]*href=["']([^"']*\/template\.css(?:\?[^"']*)?)["'][^>]*rel=["']stylesheet["'][^>]*>/i)?.[1];
            if (liveCssHref) {
                html = html.replace(
                    /(<link\b[^>]*href=["'])[^"']*\/template\.css(?:\?[^"']*)?(["'][^>]*>)/i,
                    `$1${liveCssHref}$2`
                );
            }

            const extractScriptBlock = (source, openComment) => {
                const openIdx = source.indexOf(openComment);
                if (openIdx === -1) return null;
                const tagStart = source.lastIndexOf('<script', openIdx);
                if (tagStart === -1) return null;
                const closeIdx = source.indexOf('</script>', openIdx);
                if (closeIdx === -1) return null;
                return source.slice(tagStart, closeIdx + '</script>'.length);
            };
            const currentLoaderBlock = extractScriptBlock(templateHtml, '/* V194 — full feature pack');
            if (currentLoaderBlock) {
                const savedLoaderStart = html.indexOf('/* V194 — full feature pack');
                const legacyRepairStart = html.indexOf('/* V71 — Theme Builder runtime repair.');
                if (savedLoaderStart !== -1) {
                    const loaderTagStart = html.lastIndexOf('<script', savedLoaderStart);
                    const loaderClose = html.indexOf('</script>', savedLoaderStart);
                    let replaceEnd = loaderClose !== -1
                        ? loaderClose + '</script>'.length
                        : -1;

                    // The retired repair block historically followed the loader.
                    // Delete it as part of the same replacement when present so a
                    // saved log cannot resurrect an old accordion/tab controller.
                    if (legacyRepairStart !== -1 && legacyRepairStart > savedLoaderStart) {
                        const repairClose = html.indexOf('</script>', legacyRepairStart);
                        if (repairClose !== -1) replaceEnd = repairClose + '</script>'.length;
                    }

                    if (loaderTagStart !== -1 && replaceEnd > loaderTagStart) {
                        html = html.slice(0, loaderTagStart) + currentLoaderBlock + html.slice(replaceEnd);
                    }
                } else {
                    // Very old logs may predate the feature loader completely.
                    // Insert the current loader only; there is no repair layer in
                    // the V307 architecture.
                    html = /<\/body>/i.test(html)
                        ? html.replace(/<\/body>/i, `${currentLoaderBlock}\n</body>`)
                        : `${html}\n${currentLoaderBlock}`;
                }
            }
        } catch (_) {
            // Best-effort sync: serving the log is more important than failing a
            // request because the template could not be read or normalized.
        }
        // V241: never put the full widget runtime on the critical log boot path.
        // Replace old direct runtime tags (including ones baked into existing log
        // shells) with a tiny loader that waits until DOMContentLoaded.
        if (html.includes('/widgets-v239.js')) {
            html = html.replace(
                /<script\b[^>]*src=["'][^"']*\/widgets-v239\.js(?:\?[^"']*)?["'][^>]*><\/script>/i,
                widgetsTag
            );
        } else if (html.includes('/widgets-loader-v241.js')) {
            html = html.replace(
                /<script\b[^>]*src=["'][^"']*\/widgets-loader-v241\.js(?:\?[^"']*)?["'][^>]*><\/script>/i,
                widgetsTag
            );
        } else {
            html = /<\/body>/i.test(html)
                ? html.replace(/<\/body>/i, `${widgetsTag}\n</body>`)
                : `${html}\n${widgetsTag}`;
        }
        res.type('html').send(html);
    } else {
        res.status(404).send('Log page not found.');
    }
});



// --- Daily Log PDF Resource Storage (V59) -------------------------------
app.post('/api/daily-resource-pdf/:hobby', (req, res) => {
    const fileName = String(req.body?.fileName || 'resource.pdf');
    const decoded = decodeThemeAssetDataUrl(req.body?.dataUrl);

    if (!decoded || decoded.mime !== 'application/pdf') {
        return res.status(400).json({ status:'error', message:'That file is not a valid PDF.' });
    }

    if (decoded.buffer.length > 35 * 1024 * 1024) {
        return res.status(413).json({ status:'error', message:'PDF files must be 35 MB or smaller.' });
    }

    const safeHobby = safeAssetSegment(req.params.hobby);
    const dir = path.join(publicDir, 'resources', safeHobby);
    fs.mkdirSync(dir, { recursive:true });

    const parsed = safeAssetFilename(fileName, 'resource');
    const output = uniqueThemeAssetPath(dir, parsed.base || 'resource', '.pdf');
    fs.writeFileSync(output.absolutePath, decoded.buffer);

    return res.json({
        status:'success',
        fileName: output.filename,
        url: `/resources/${safeHobby}/${encodeURIComponent(output.filename)}`,
        projectPath: `public/resources/${safeHobby}/${output.filename}`
    });
});


// V134 — reversible built-in decoration removal.
// Built-in theme artwork is moved out of /public so the theme's own runtime
// cannot rediscover/render a decoration that the user removed in Theme Builder.
// Restore Original Theme moves the files back to their exact original paths.
const builtInThemeAssetBackupRootV134 = path.join(
    __dirname,
    '.theme-builder-backups',
    'built-in-theme-assets'
);

function builtInThemeSourceFilesV134(themeName) {
    const safe = safeAssetSegment(themeName, '');
    if (!safe) return [];
    const root = path.join(publicDir, 'themes', safe);
    const files = [];

    function walk(dir, depth = 4) {
        if (depth < 0 || !fs.existsSync(dir)) return;
        let entries = [];
        try { entries = fs.readdirSync(dir, { withFileTypes: true }); } catch { return; }
        for (const entry of entries) {
            if (!entry?.name || entry.name.startsWith('.')) continue;
            const disk = path.join(dir, entry.name);
            if (entry.isDirectory()) walk(disk, depth - 1);
            else if (entry.isFile() && ['.js', '.css', '.html', '.json'].includes(path.extname(entry.name).toLowerCase())) files.push(disk);
        }
    }

    walk(root, 4);
    return files;
}

function builtInThemeOwnedImageRootsV134(themeName) {
    const safe = safeAssetSegment(themeName, '');
    if (!safe) return [];

    const svgRoot = path.join(publicDir, 'svg');
    const themeRoot = path.join(publicDir, 'themes', safe);
    const roots = new Set([
        path.resolve(svgRoot, `theme-${safe}`),
        path.resolve(svgRoot, safe),
        path.resolve(themeRoot, 'assets'),
        path.resolve(themeRoot, 'images')
    ]);

    // Permit aliases only when this exact theme's own source explicitly points
    // to them (for example themes/seahorses -> svg/theme-seahorse).
    const folderRe = /(?:^|[^a-z0-9_-])\/?svg\/(theme-[a-z0-9._-]+)(?=\/|["'`\s),;]|$)/gi;
    for (const sourceFile of builtInThemeSourceFilesV134(safe)) {
        let source = '';
        try { source = fs.readFileSync(sourceFile, 'utf8'); } catch { continue; }
        let match;
        while ((match = folderRe.exec(source))) {
            const folder = safeAssetSegment(match[1], '');
            if (folder) roots.add(path.resolve(svgRoot, folder));
        }
    }

    return [...roots];
}

function builtInThemeAssetFromPublicUrlV134(themeName, rawUrl) {
    const safe = safeAssetSegment(themeName, '');
    if (!safe) return null;

    let value = String(rawUrl || '').trim();
    if (!value || value.startsWith('data:') || value.startsWith('blob:')) return null;
    value = value.split('?')[0].split('#')[0];

    try { value = decodeURIComponent(value); } catch { return null; }
    if (!value.startsWith('/')) return null;

    const absolutePath = path.resolve(publicDir, `.${value}`);
    const publicRoot = path.resolve(publicDir) + path.sep;
    if (!absolutePath.startsWith(publicRoot)) return null;

    const ext = path.extname(absolutePath).toLowerCase();
    if (!['.svg', '.png', '.jpg', '.jpeg', '.webp', '.gif', '.avif'].includes(ext)) return null;

    let allowed = builtInThemeOwnedImageRootsV134(safe).some(root =>
        absolutePath === root || absolutePath.startsWith(root + path.sep)
    );

    // V135: a few older built-in themes reference exact image files directly
    // from /public/svg instead of a theme-* subfolder. Never use fuzzy/global
    // filename matching here. A flat file is accepted only when THIS theme's
    // own source explicitly references its exact basename/path.
    if (!allowed && path.dirname(absolutePath) === path.resolve(publicDir, 'svg')) {
        const basename = path.basename(absolutePath);
        const exactPublicRef = `/svg/${basename}`;
        for (const sourceFile of builtInThemeSourceFilesV134(safe)) {
            let source = '';
            try { source = fs.readFileSync(sourceFile, 'utf8'); } catch { continue; }
            if (source.includes(exactPublicRef) || source.includes(basename)) {
                allowed = true;
                break;
            }
        }
    }

    if (!allowed) return null;

    const relativePublicPath = path.relative(publicDir, absolutePath);
    if (!relativePublicPath || relativePublicPath.startsWith('..') || path.isAbsolute(relativePublicPath)) return null;

    const backupPath = path.resolve(
        builtInThemeAssetBackupRootV134,
        safe,
        relativePublicPath
    );
    const backupRoot = path.resolve(builtInThemeAssetBackupRootV134, safe) + path.sep;
    if (!backupPath.startsWith(backupRoot)) return null;

    return { safe, absolutePath, backupPath, relativePublicPath };
}

app.post('/api/built-in-theme-assets/:themeName/remove', (req, res) => {
    const themeName = safeAssetSegment(req.params.themeName, '');
    if (!themeName) {
        return res.status(400).json({ status: 'error', message: 'Invalid built-in theme name.' });
    }

    const urls = Array.isArray(req.body?.urls)
        ? req.body.urls
        : [req.body?.url].filter(Boolean);

    const moved = [];
    const alreadyMoved = [];
    const rejected = [];
    const missing = [];

    for (const url of urls) {
        const entry = builtInThemeAssetFromPublicUrlV134(themeName, url);
        if (!entry) {
            rejected.push(String(url || ''));
            continue;
        }

        if (!fs.existsSync(entry.absolutePath)) {
            if (fs.existsSync(entry.backupPath)) alreadyMoved.push(entry.relativePublicPath.replace(/\\/g, '/'));
            else missing.push(entry.relativePublicPath.replace(/\\/g, '/'));
            continue;
        }

        try {
            fs.mkdirSync(path.dirname(entry.backupPath), { recursive: true });
            if (fs.existsSync(entry.backupPath)) {
                // The backup is already the authoritative original. Do not
                // overwrite it with a newer/mutated file by accident.
                fs.unlinkSync(entry.absolutePath);
                alreadyMoved.push(entry.relativePublicPath.replace(/\\/g, '/'));
            } else {
                fs.renameSync(entry.absolutePath, entry.backupPath);
                moved.push(entry.relativePublicPath.replace(/\\/g, '/'));
            }
        } catch (error) {
            return res.status(500).json({
                status: 'error',
                message: `Could not archive built-in decoration “${path.basename(entry.absolutePath)}”.`,
                detail: error.message
            });
        }
    }

    return res.json({ status: 'success', themeName, moved, alreadyMoved, rejected, missing });
});

app.post('/api/built-in-theme-assets/:themeName/restore', (req, res) => {
    const themeName = safeAssetSegment(req.params.themeName, '');
    if (!themeName) {
        return res.status(400).json({ status: 'error', message: 'Invalid built-in theme name.' });
    }

    const backupThemeRoot = path.resolve(builtInThemeAssetBackupRootV134, themeName);
    const restored = [];
    const skipped = [];

    function walk(dir) {
        if (!fs.existsSync(dir)) return;
        let entries = [];
        try { entries = fs.readdirSync(dir, { withFileTypes: true }); } catch { return; }
        for (const entry of entries) {
            const disk = path.join(dir, entry.name);
            if (entry.isDirectory()) walk(disk);
            else if (entry.isFile()) {
                const rel = path.relative(backupThemeRoot, disk);
                const target = path.resolve(publicDir, rel);
                const publicRoot = path.resolve(publicDir) + path.sep;
                if (!target.startsWith(publicRoot)) continue;

                try {
                    fs.mkdirSync(path.dirname(target), { recursive: true });
                    // Restore Original means the archived original is
                    // authoritative. If a newer file somehow occupies the same
                    // path, replace it instead of silently leaving the backup
                    // stranded and reporting success without restoring it.
                    if (fs.existsSync(target)) {
                        fs.unlinkSync(target);
                        skipped.push(rel.replace(/\\/g, '/'));
                    }
                    fs.renameSync(disk, target);
                    restored.push(rel.replace(/\\/g, '/'));
                } catch (error) {
                    return res.status(500).json({
                        status: 'error',
                        message: `Could not restore built-in decoration “${path.basename(disk)}”.`,
                        detail: error.message
                    });
                }
            }
        }
    }

    walk(backupThemeRoot);

    // Best-effort cleanup of empty backup folders.
    function removeEmpty(dir) {
        if (!fs.existsSync(dir)) return;
        let entries = [];
        try { entries = fs.readdirSync(dir, { withFileTypes: true }); } catch { return; }
        for (const entry of entries) if (entry.isDirectory()) removeEmpty(path.join(dir, entry.name));
        try { if (!fs.readdirSync(dir).length) fs.rmdirSync(dir); } catch {}
    }
    removeEmpty(backupThemeRoot);

    return res.json({ status: 'success', themeName, restored, skipped });
});


// ============================================================================
// V153 — EXACT CONFIGURED AUDIO FOR “REUSE FROM THEME”
// This endpoint intentionally does NOT enumerate a theme's sound folders.
// It inspects only the selected theme's own source files and returns audio
// references that are actually configured as INTRO or HOVER audio.
// ============================================================================
app.get('/api/built-in-theme-audio-config/:themeName', (req, res) => {
    const themeName = safeAssetSegment(req.params.themeName, '');
    if (!themeName) {
        return res.status(400).json({ status: 'error', message: 'Invalid built-in theme name.' });
    }

    const themeDir = path.join(publicDir, 'themes', themeName);
    const sourceFiles = [];
    const AUDIO_EXT_RE = /\.(?:mp3|wav|ogg|m4a|aac|flac)(?:[?#].*)?$/i;

    function collect(dir, depth = 4) {
        if (depth < 0 || !fs.existsSync(dir)) return;
        let entries = [];
        try { entries = fs.readdirSync(dir, { withFileTypes: true }); } catch { return; }
        for (const entry of entries) {
            if (!entry?.name || entry.name.startsWith('.')) continue;
            const disk = path.join(dir, entry.name);
            if (entry.isDirectory()) collect(disk, depth - 1);
            else if (
                entry.isFile() &&
                ['.js', '.json', '.html'].includes(path.extname(entry.name).toLowerCase())
            ) {
                sourceFiles.push(disk);
            }
        }
    }
    collect(themeDir, 4);

    function publicUrlForDisk(diskPath) {
        let rel = '';
        try { rel = path.relative(publicDir, diskPath); } catch { return ''; }
        if (!rel || rel.startsWith('..') || path.isAbsolute(rel)) return '';
        return '/' + rel.split(path.sep).map(part => encodeURIComponent(part)).join('/');
    }

    function referencedSoundFolders(text) {
        const folders = new Set();
        const re = /(?:^|[^a-z0-9_-])\/?sounds\/([a-z0-9._-]+)(?=\/|["'`\s),;]|$)/gi;
        let match;
        while ((match = re.exec(text))) folders.add(match[1]);
        return [...folders];
    }

    function resolveAudioRef(raw, sourceFile, soundFolders = []) {
        let ref = String(raw || '').trim().replace(/\\/g, '/');
        if (!ref || ref.startsWith('data:') || ref.startsWith('blob:') || /^[a-z]+:\/\//i.test(ref)) return '';
        ref = ref.split('#')[0].split('?')[0];
        if (!AUDIO_EXT_RE.test(ref)) return '';

        const candidates = [];
        if (ref.startsWith('/')) {
            candidates.push(path.join(publicDir, ref.replace(/^\/+/, '')));
        } else {
            candidates.push(path.resolve(path.dirname(sourceFile), ref));
            candidates.push(path.join(publicDir, ref));
            const base = path.basename(ref);
            candidates.push(path.join(publicDir, 'sounds', themeName, base));
            candidates.push(path.join(publicDir, 'sounds', `theme-${themeName}`, base));
            candidates.push(path.join(publicDir, 'sounds', 'intros', base));
            soundFolders.forEach(folder => candidates.push(path.join(publicDir, 'sounds', folder, base)));
        }

        for (const candidate of candidates) {
            try {
                const resolved = path.resolve(candidate);
                const root = path.resolve(publicDir) + path.sep;
                if (!resolved.startsWith(root)) continue;
                if (fs.existsSync(resolved) && fs.statSync(resolved).isFile()) {
                    return publicUrlForDisk(resolved);
                }
            } catch {}
        }

        // Absolute /sounds/... references are already valid public URLs even if
        // the file happens to be temporarily unavailable while editing.
        if (ref.startsWith('/sounds/')) return ref;
        return '';
    }

    function audioRefsFromText(text) {
        const refs = [];
        const re = /["'`]([^"'`\n\r]+?\.(?:mp3|wav|ogg|m4a|aac|flac)(?:[?#][^"'`\n\r]*)?)["'`]/gi;
        let match;
        while ((match = re.exec(text))) refs.push({ raw: match[1], index: match.index });
        return refs;
    }

    function cleanName(url, fallback = 'Audio') {
        try {
            return decodeURIComponent(String(url).split('/').pop().split(/[?#]/)[0]) || fallback;
        } catch {
            return String(url || '').split('/').pop() || fallback;
        }
    }

    const introCandidates = [];
    const hoverCandidates = [];
    let order = 0;

    function addIntro(raw, sourceFile, folders, score = 1) {
        const url = resolveAudioRef(raw, sourceFile, folders);
        if (!url) return;
        introCandidates.push({ url, name: cleanName(url, 'Intro Audio'), score, order: order++ });
    }

    function addHover(raw, sourceFile, folders, score = 1) {
        const url = resolveAudioRef(raw, sourceFile, folders);
        if (!url) return;
        hoverCandidates.push({ url, name: cleanName(url, 'Hover Sound'), score, order: order++ });
    }

    for (const sourceFile of sourceFiles) {
        let text = '';
        try { text = fs.readFileSync(sourceFile, 'utf8'); } catch { continue; }
        const folders = referencedSoundFolders(text);

        // Exact scalar configuration: const THEME_INTRO_SRC = "/sounds/...mp3";
        const scalarRe = /\b(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=\s*(["'`])([^"'`\n\r]+?\.(?:mp3|wav|ogg|m4a|aac|flac)(?:[?#][^"'`\n\r]*)?)\2/gim;
        let match;
        while ((match = scalarRe.exec(text))) {
            const key = String(match[1] || '').toLowerCase();
            const raw = match[3];
            if (/hover/.test(key) && /(sound|sfx|audio|src|source|track)/.test(key)) {
                addHover(raw, sourceFile, folders, 100);
            } else if (/intro|opening/.test(key) && /(src|source|audio|song|music|track)/.test(key)) {
                addIntro(raw, sourceFile, folders, 120);
            } else if (!/hover|sfx|effect/.test(key) && /(theme.?song|song.?src|music.?src|music.?track|intro)/.test(key)) {
                addIntro(raw, sourceFile, folders, 90);
            }
        }

        // Exact array configuration: const THEME_HOVER_SOUNDS = [ ... ];
        const arrayRe = /\b(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=\s*\[([\s\S]*?)\]\s*;?/gim;
        while ((match = arrayRe.exec(text))) {
            const key = String(match[1] || '').toLowerCase();
            if (!/hover/.test(key) || !/(sound|sfx|audio|effect)/.test(key)) continue;
            audioRefsFromText(match[2]).forEach(ref => addHover(ref.raw, sourceFile, folders, 120));
        }

        // Theme Builder-shaped object fields, if a built-in source uses them.
        const introFieldRe = /\b(?:introAudio|introAudioUrl|introSong|introMusic)\s*:\s*(["'`])([^"'`\n\r]+?\.(?:mp3|wav|ogg|m4a|aac|flac)(?:[?#][^"'`\n\r]*)?)\1/gi;
        while ((match = introFieldRe.exec(text))) addIntro(match[2], sourceFile, folders, 140);

        const hoverFieldRe = /\b(?:svgHoverSounds|hoverSounds|hoverAudio|hoverSfx)\s*:\s*\[([\s\S]*?)\]/gi;
        while ((match = hoverFieldRe.exec(text))) {
            audioRefsFromText(match[1]).forEach(ref => addHover(ref.raw, sourceFile, folders, 140));
        }

        // Strict fallback: classify a literal only when the nearby source text
        // explicitly says HOVER or INTRO. This still never enumerates folders.
        for (const ref of audioRefsFromText(text)) {
            const before = text.slice(Math.max(0, ref.index - 220), ref.index).toLowerCase();
            const lineStart = text.lastIndexOf('\n', ref.index) + 1;
            const lineEndRaw = text.indexOf('\n', ref.index);
            const lineEnd = lineEndRaw < 0 ? text.length : lineEndRaw;
            const line = text.slice(lineStart, lineEnd).toLowerCase();
            const near = `${before.slice(-140)} ${line}`;

            if (/hover/.test(near) && /(sound|sfx|audio|effect)/.test(near)) {
                addHover(ref.raw, sourceFile, folders, 40);
            } else if (/intro|opening/.test(near) && /(song|music|audio|src|source|track)/.test(near)) {
                addIntro(ref.raw, sourceFile, folders, 40);
            }
        }
    }

    function dedupe(items) {
        const map = new Map();
        for (const item of items) {
            const key = String(item.url || '').toLowerCase();
            const old = map.get(key);
            if (!old || item.score > old.score || (item.score === old.score && item.order < old.order)) {
                map.set(key, item);
            }
        }
        return [...map.values()];
    }

    const intros = dedupe(introCandidates).sort((a, b) => b.score - a.score || a.order - b.order);
    const hovers = dedupe(hoverCandidates).sort((a, b) => b.score - a.score || a.order - b.order);
    const intro = intros[0] || null;

    // If the same URL was explicitly identified as both, the stronger role wins;
    // an intro track is never bulk-added as a hover sound.
    const hoverSounds = hovers
        .filter(item => !intro || String(item.url).toLowerCase() !== String(intro.url).toLowerCase())
        .map(item => ({ name: item.name, url: item.url, inheritedBuiltInV153: true }));

    return res.json({
        status: 'success',
        themeName,
        introAudio: intro ? { name: intro.name, url: intro.url, inheritedBuiltInV153: true } : null,
        hoverSounds,
        inspectedSourceFiles: sourceFiles.length,
        discovery: 'configured-source-only-v153'
    });
});


// ============================================================================
// V154 — THEME PACK ZIP BACKUP / RESTORE + THEME VERSION HISTORY
// Heavy work is strictly on-demand: ZIP work only runs when Export/Import is
// clicked, and history snapshots are written only when the user saves a theme.
// ============================================================================
const THEME_HISTORY_ROOT_V154 = path.join(DATA_DIR, 'theme-history-v154');
fs.mkdirSync(THEME_HISTORY_ROOT_V154, { recursive: true });

function safeHistoryIdV154(value, fallback = 'theme') {
    return String(value || '')
        .trim()
        .replace(/[^a-zA-Z0-9_-]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 120) || fallback;
}

function themeHistoryPathV154(hobby, themeId) {
    const h = safeAssetSegment(hobby, 'log');
    const t = safeHistoryIdV154(themeId, 'theme');
    const dir = path.join(THEME_HISTORY_ROOT_V154, h);
    fs.mkdirSync(dir, { recursive: true });
    return path.join(dir, `${t}.json`);
}

app.get('/api/theme-history/:hobby/:themeId', (req, res) => {
    const file = themeHistoryPathV154(req.params.hobby, req.params.themeId);
    let entries = [];
    try {
        const parsed = JSON.parse(fs.readFileSync(file, 'utf8'));
        if (Array.isArray(parsed)) entries = parsed.slice(0, 10);
    } catch {}
    res.json({ status: 'success', entries });
});

app.post('/api/theme-history/:hobby/:themeId', (req, res) => {
    const theme = req.body?.theme;
    if (!theme || typeof theme !== 'object' || Array.isArray(theme)) {
        return res.status(400).json({ status: 'error', message: 'A theme snapshot is required.' });
    }
    const file = themeHistoryPathV154(req.params.hobby, req.params.themeId);
    let entries = [];
    try {
        const parsed = JSON.parse(fs.readFileSync(file, 'utf8'));
        if (Array.isArray(parsed)) entries = parsed;
    } catch {}

    const entry = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        savedAt: new Date().toISOString(),
        name: String(req.body?.name || theme.name || 'Theme').slice(0, 80),
        theme
    };
    entries.unshift(entry);
    entries = entries.slice(0, 10);
    fs.writeFileSync(file, JSON.stringify(entries));
    res.json({ status: 'success', entry: { id: entry.id, savedAt: entry.savedAt, name: entry.name }, count: entries.length });
});

// Small dependency-free ZIP implementation. Uses STORE or DEFLATE and UTF-8.
const ZIP_CRC_TABLE_V154 = (() => {
    const table = new Uint32Array(256);
    for (let n = 0; n < 256; n++) {
        let c = n;
        for (let k = 0; k < 8; k++) c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
        table[n] = c >>> 0;
    }
    return table;
})();

function crc32V154(buffer) {
    let c = 0xFFFFFFFF;
    for (const b of buffer) c = ZIP_CRC_TABLE_V154[(c ^ b) & 0xFF] ^ (c >>> 8);
    return (c ^ 0xFFFFFFFF) >>> 0;
}

function dosDateTimeV154(date = new Date()) {
    const year = Math.max(1980, date.getFullYear());
    const dosTime = ((date.getHours() & 31) << 11) | ((date.getMinutes() & 63) << 5) | ((Math.floor(date.getSeconds() / 2)) & 31);
    const dosDate = (((year - 1980) & 127) << 9) | (((date.getMonth() + 1) & 15) << 5) | (date.getDate() & 31);
    return { dosTime, dosDate };
}

function createZipV154(entries) {
    const localParts = [];
    const centralParts = [];
    let offset = 0;
    const now = dosDateTimeV154();

    for (const entry of entries) {
        const name = String(entry.name || '').replace(/\\/g, '/').replace(/^\/+/, '');
        if (!name || name.includes('../')) continue;
        const nameBuf = Buffer.from(name, 'utf8');
        const data = Buffer.isBuffer(entry.data) ? entry.data : Buffer.from(entry.data || '');
        const deflated = zlib.deflateRawSync(data, { level: 6 });
        const useDeflate = deflated.length + 16 < data.length;
        const payload = useDeflate ? deflated : data;
        const method = useDeflate ? 8 : 0;
        const crc = crc32V154(data);
        const flags = 0x0800;

        const local = Buffer.alloc(30);
        local.writeUInt32LE(0x04034b50, 0);
        local.writeUInt16LE(20, 4);
        local.writeUInt16LE(flags, 6);
        local.writeUInt16LE(method, 8);
        local.writeUInt16LE(now.dosTime, 10);
        local.writeUInt16LE(now.dosDate, 12);
        local.writeUInt32LE(crc, 14);
        local.writeUInt32LE(payload.length, 18);
        local.writeUInt32LE(data.length, 22);
        local.writeUInt16LE(nameBuf.length, 26);
        local.writeUInt16LE(0, 28);
        localParts.push(local, nameBuf, payload);

        const central = Buffer.alloc(46);
        central.writeUInt32LE(0x02014b50, 0);
        central.writeUInt16LE(20, 4);
        central.writeUInt16LE(20, 6);
        central.writeUInt16LE(flags, 8);
        central.writeUInt16LE(method, 10);
        central.writeUInt16LE(now.dosTime, 12);
        central.writeUInt16LE(now.dosDate, 14);
        central.writeUInt32LE(crc, 16);
        central.writeUInt32LE(payload.length, 20);
        central.writeUInt32LE(data.length, 24);
        central.writeUInt16LE(nameBuf.length, 28);
        central.writeUInt16LE(0, 30);
        central.writeUInt16LE(0, 32);
        central.writeUInt16LE(0, 34);
        central.writeUInt16LE(0, 36);
        central.writeUInt32LE(0, 38);
        central.writeUInt32LE(offset, 42);
        centralParts.push(central, nameBuf);

        offset += local.length + nameBuf.length + payload.length;
    }

    const centralBuffer = Buffer.concat(centralParts);
    const localBuffer = Buffer.concat(localParts);
    const end = Buffer.alloc(22);
    const count = centralParts.length / 2;
    end.writeUInt32LE(0x06054b50, 0);
    end.writeUInt16LE(0, 4);
    end.writeUInt16LE(0, 6);
    end.writeUInt16LE(count, 8);
    end.writeUInt16LE(count, 10);
    end.writeUInt32LE(centralBuffer.length, 12);
    end.writeUInt32LE(localBuffer.length, 16);
    end.writeUInt16LE(0, 20);
    return Buffer.concat([localBuffer, centralBuffer, end]);
}

function parseZipV154(buffer) {
    const entries = new Map();
    let offset = 0;
    let total = 0;
    let count = 0;
    while (offset + 30 <= buffer.length) {
        const sig = buffer.readUInt32LE(offset);
        if (sig === 0x02014b50 || sig === 0x06054b50) break;
        if (sig !== 0x04034b50) throw new Error('Invalid Theme Pack ZIP structure.');
        const flags = buffer.readUInt16LE(offset + 6);
        const method = buffer.readUInt16LE(offset + 8);
        const crc = buffer.readUInt32LE(offset + 14);
        const compressedSize = buffer.readUInt32LE(offset + 18);
        const uncompressedSize = buffer.readUInt32LE(offset + 22);
        const nameLen = buffer.readUInt16LE(offset + 26);
        const extraLen = buffer.readUInt16LE(offset + 28);
        if (flags & 0x0008) throw new Error('Unsupported ZIP data descriptor.');
        if (![0, 8].includes(method)) throw new Error('Unsupported ZIP compression method.');
        const nameStart = offset + 30;
        const dataStart = nameStart + nameLen + extraLen;
        const dataEnd = dataStart + compressedSize;
        if (dataEnd > buffer.length) throw new Error('Truncated Theme Pack ZIP.');
        const name = buffer.subarray(nameStart, nameStart + nameLen).toString('utf8').replace(/\\/g, '/');
        if (!name || name.startsWith('/') || name.includes('../')) throw new Error('Unsafe Theme Pack path.');
        const packed = buffer.subarray(dataStart, dataEnd);
        const data = method === 8 ? zlib.inflateRawSync(packed) : Buffer.from(packed);
        if (data.length !== uncompressedSize) throw new Error('Theme Pack file size mismatch.');
        if (crc32V154(data) !== crc) throw new Error('Theme Pack checksum mismatch.');
        entries.set(name, data);
        total += data.length;
        count += 1;
        if (count > 700 || total > 300 * 1024 * 1024) throw new Error('Theme Pack is too large.');
        offset = dataEnd;
    }
    return entries;
}

function collectThemePackFilesV154(theme) {
    const found = new Map();
    function inspect(value) {
        if (Array.isArray(value)) return value.forEach(inspect);
        if (value && typeof value === 'object') return Object.values(value).forEach(inspect);
        if (typeof value !== 'string') return;
        let raw = value.trim();
        if (!raw || raw.startsWith('data:') || raw.startsWith('blob:')) return;
        const absMatch = raw.match(/^https?:\/\/[^/]+(\/[^?#]*)/i);
        if (absMatch) raw = absMatch[1];
        raw = raw.split(/[?#]/)[0].replace(/\\/g, '/');
        if (raw.startsWith('public/')) raw = '/' + raw.slice(7);
        if (!/^\/(?:themes|sounds|svg)\//i.test(raw)) return;
        let decoded = raw;
        try { decoded = decodeURIComponent(raw); } catch {}
        const disk = path.resolve(publicDir, '.' + decoded);
        const root = path.resolve(publicDir) + path.sep;
        if (!disk.startsWith(root)) return;
        try {
            if (!fs.existsSync(disk) || !fs.statSync(disk).isFile()) return;
        } catch { return; }
        const rel = path.relative(publicDir, disk).replace(/\\/g, '/');
        if (!rel || rel.startsWith('..')) return;
        found.set(rel.toLowerCase(), { rel, disk });
    }
    inspect(theme);
    return [...found.values()];
}

app.post('/api/theme-pack/export/:hobby', (req, res) => {
    const theme = req.body?.theme;
    if (!theme || typeof theme !== 'object' || Array.isArray(theme)) {
        return res.status(400).json({ status: 'error', message: 'Choose a custom theme to export.' });
    }
    try {
        const name = String(req.body?.name || theme.name || 'Custom Theme').slice(0, 80);
        const themeId = String(req.body?.themeId || 'theme-custom-builder');
        const files = collectThemePackFilesV154(theme);
        const manifest = {
            packVersion: 1,
            type: 'loggy-theme-pack',
            exportedAt: new Date().toISOString(),
            themeId,
            name,
            theme
        };
        const entries = [
            { name: 'theme.json', data: Buffer.from(JSON.stringify(manifest, null, 2), 'utf8') },
            ...files.map(file => ({ name: `assets/${file.rel}`, data: fs.readFileSync(file.disk) }))
        ];
        const zip = createZipV154(entries);
        const safeName = safeAssetFilename(name, 'theme').base || 'theme';
        res.setHeader('Content-Type', 'application/zip');
        res.setHeader('Content-Disposition', `attachment; filename="${safeName}-theme-pack.zip"`);
        res.setHeader('Content-Length', String(zip.length));
        return res.send(zip);
    } catch (error) {
        console.error('Theme Pack export error:', error);
        return res.status(500).json({ status: 'error', message: error.message || 'Could not create Theme Pack.' });
    }
});

function rewriteThemePackStringsV154(value, replacements) {
    if (Array.isArray(value)) return value.map(item => rewriteThemePackStringsV154(item, replacements));
    if (value && typeof value === 'object') {
        const next = {};
        for (const [key, item] of Object.entries(value)) next[key] = rewriteThemePackStringsV154(item, replacements);
        return next;
    }
    if (typeof value !== 'string') return value;
    let out = value;
    for (const [from, to] of replacements) {
        if (!from || from === to) continue;
        out = out.split(from).join(to);
    }
    return out;
}

app.post(
    '/api/theme-pack/import/:hobby',
    express.raw({ type: '*/*', limit: '250mb' }),
    (req, res) => {
        try {
            const buffer = Buffer.isBuffer(req.body) ? req.body : Buffer.alloc(0);
            if (!buffer.length) return res.status(400).json({ status: 'error', message: 'Choose a Theme Pack ZIP first.' });
            const zip = parseZipV154(buffer);
            const themeFile = zip.get('theme.json');
            if (!themeFile) return res.status(400).json({ status: 'error', message: 'That ZIP is not a Theme Pack.' });
            const manifest = JSON.parse(themeFile.toString('utf8'));
            if (manifest?.type !== 'loggy-theme-pack' || !manifest?.theme || typeof manifest.theme !== 'object') {
                return res.status(400).json({ status: 'error', message: 'That ZIP does not contain a valid Theme Pack.' });
            }

            const locations = customThemeAssetLocations(req.params.hobby);
            const replacements = [];
            let imported = 0;

            for (const [zipName, data] of zip.entries()) {
                if (!zipName.startsWith('assets/')) continue;
                const rel = zipName.slice('assets/'.length).replace(/\\/g, '/');
                const parts = rel.split('/').filter(Boolean);
                if (parts.length < 2) continue;
                const root = parts[0].toLowerCase();
                const kind = root === 'sounds' ? 'audio' : root === 'svg' ? 'svg' : root === 'themes' ? 'background' : '';
                if (!kind) continue;
                const location = locations[kind];
                const parsed = safeAssetFilename(path.basename(rel), kind === 'audio' ? 'theme-audio' : kind === 'svg' ? 'decoration' : 'background');
                const ext = parsed.ext || path.extname(rel).toLowerCase();
                const output = uniqueThemeAssetPath(location.dir, parsed.base, ext);
                fs.mkdirSync(location.dir, { recursive: true });
                fs.writeFileSync(output.absolutePath, data);
                const oldPlainUrl = '/' + rel;
                const oldEncodedUrl = '/' + rel.split('/').map(part => encodeURIComponent(part)).join('/');
                const oldProjectPath = 'public/' + rel;
                const newUrl = `${location.publicPrefix}/${encodeURIComponent(output.filename)}`;
                const newProjectPath = path.relative(__dirname, output.absolutePath).replace(/\\/g, '/');
                replacements.push([oldPlainUrl, newUrl], [oldEncodedUrl, newUrl], [oldProjectPath, newProjectPath]);
                imported += 1;
            }

            const theme = rewriteThemePackStringsV154(manifest.theme, replacements);
            theme.name = String(theme.name || manifest.name || 'Imported Theme').slice(0, 80);
            return res.json({
                status: 'success',
                name: theme.name,
                originalThemeId: String(manifest.themeId || ''),
                theme,
                assetsImported: imported
            });
        } catch (error) {
            console.error('Theme Pack import error:', error);
            return res.status(400).json({ status: 'error', message: error.message || 'Could not import Theme Pack.' });
        }
    }
);

// Resolve an existing Theme Builder asset back to a stable public URL.
// This endpoint is only used after a decoration fails to load in the editor.
app.post('/api/theme-asset-resolve/:hobby', (req, res) => {
    try {
        const raw = String(req.body?.projectPath || '').trim();
        if (!raw) {
            return res.status(400).json({ status: 'error', message: 'projectPath is required.' });
        }

        const normalized = raw.replace(/\\/g, '/').replace(/^\.?\//, '');
        const relative = normalized.toLowerCase().startsWith('public/')
            ? normalized.slice(7)
            : normalized;

        const absolute = path.resolve(publicDir, relative);
        const publicRoot = path.resolve(publicDir) + path.sep;

        if (absolute !== path.resolve(publicDir) && !absolute.startsWith(publicRoot)) {
            return res.status(400).json({ status: 'error', message: 'Invalid asset path.' });
        }

        if (!fs.existsSync(absolute) || !fs.statSync(absolute).isFile()) {
            return res.status(404).json({ status: 'error', message: 'Theme asset file was not found.' });
        }

        const urlPath = '/' + path.relative(publicDir, absolute)
            .split(path.sep)
            .map(part => encodeURIComponent(part))
            .join('/');

        return res.json({ status: 'success', url: urlPath });
    } catch (error) {
        console.error('Theme asset resolve error:', error);
        return res.status(500).json({ status: 'error', message: 'Could not resolve theme asset.' });
    }
});

// V246: stream Daily Log images directly to project-managed files.
app.post(
    '/api/daily-media-raw/:hobby',
    express.raw({ type: 'application/octet-stream', limit: '40mb' }),
    (req, res) => {
        try {
            const mime = String(req.query?.mime || 'application/octet-stream').toLowerCase();
            const fileName = String(req.query?.fileName || 'image');
            const day = Number.parseInt(req.query?.day, 10) || 1;
            const body = Buffer.isBuffer(req.body) ? req.body : Buffer.alloc(0);
            if (!body.length) return res.status(400).json({ status:'error', message:'The image upload was empty.' });
            if (body.length > 40 * 1024 * 1024) return res.status(413).json({ status:'error', message:'Daily Log images must be 40 MB or smaller.' });
            if (!String(mime).startsWith('image/')) return res.status(400).json({ status:'error', message:'Only image files can be added to Daily Logs.' });
            const saved = writeDailyImageV246(req.params.hobby, day, body, mime, fileName);
            if (!saved) return res.status(400).json({ status:'error', message:'That image format is not supported.' });
            return res.json({ status:'success', image:saved });
        } catch (error) {
            console.error('Daily media upload failed:', error);
            return res.status(500).json({ status:'error', message:'Could not save that Daily Log image.' });
        }
    }
);

app.delete('/api/daily-media/:hobby', (req, res) => {
    try {
        const entry = { projectPath:req.body?.projectPath, src:req.body?.src };
        const absolute = resolveDailyMediaProjectPathV246(req.params.hobby, entry);
        if (absolute && fs.existsSync(absolute)) fs.unlinkSync(absolute);
        return res.json({ status:'success' });
    } catch (error) {
        console.error('Daily media delete failed:', error);
        return res.status(500).json({ status:'error', message:'Could not remove that Daily Log image file.' });
    }
});



// V250: raw KB attachments are copied into the project; original computer files are not required afterward.
app.post('/api/kb-attachment-raw/:hobby', express.raw({type:'application/octet-stream',limit:'60mb'}), (req,res)=>{
    try { const body=Buffer.isBuffer(req.body)?req.body:Buffer.alloc(0); if(!body.length)return res.status(400).json({status:'error',message:'The attachment was empty.'}); const saved=writeKbAttachmentV250(req.params.hobby,body,String(req.query?.mime||'application/octet-stream'),String(req.query?.fileName||'attachment')); if(!saved)return res.status(400).json({status:'error',message:'Could not save that attachment.'}); return res.json({status:'success',attachment:saved}); }
    catch(error){console.error('KB attachment upload failed:',error);return res.status(500).json({status:'error',message:'Could not save that Knowledge Base attachment.'})}
});
app.delete('/api/kb-attachment/:hobby',(req,res)=>{try{const abs=resolveKbAttachmentV250(req.params.hobby,req.body||{});if(abs&&fs.existsSync(abs))fs.unlinkSync(abs);res.json({status:'success'})}catch(error){res.status(500).json({status:'error',message:'Could not remove that attachment.'})}});

// V251: stream Whiteboard images directly into the project's media folder.
app.post(
    '/api/whiteboard-media-raw/:hobby',
    express.raw({ type:'application/octet-stream', limit:'40mb' }),
    (req, res) => {
        try {
            const mime = String(req.query?.mime || 'application/octet-stream').toLowerCase();
            const fileName = String(req.query?.fileName || 'image');
            const tabId = String(req.query?.tabId || 'whiteboard');
            const boardId = String(req.query?.boardId || 'board');
            const body = Buffer.isBuffer(req.body) ? req.body : Buffer.alloc(0);
            if (!body.length) return res.status(400).json({status:'error',message:'The image upload was empty.'});
            if (body.length > 40 * 1024 * 1024) return res.status(413).json({status:'error',message:'Whiteboard images must be 40 MB or smaller.'});
            if (!mime.startsWith('image/')) return res.status(400).json({status:'error',message:'Only image files can be added to whiteboards.'});
            const saved = writeWhiteboardImageV251(req.params.hobby, tabId, boardId, body, mime, fileName);
            if (!saved) return res.status(400).json({status:'error',message:'That image format is not supported.'});
            return res.json({status:'success',image:saved});
        } catch (error) {
            console.error('Whiteboard media upload failed:', error);
            return res.status(500).json({status:'error',message:'Could not save that Whiteboard image.'});
        }
    }
);

app.delete('/api/whiteboard-media/:hobby', (req, res) => {
    try {
        const absolute = resolveWhiteboardMediaProjectPathV251(req.params.hobby, {
            projectPath:req.body?.projectPath,
            src:req.body?.src
        });
        if (absolute && fs.existsSync(absolute)) fs.unlinkSync(absolute);
        return res.json({status:'success'});
    } catch (error) {
        console.error('Whiteboard media delete failed:', error);
        return res.status(500).json({status:'error',message:'Could not remove that Whiteboard image file.'});
    }
});

// V249: stream Notepad images directly into the project's media folder.
app.post(
    '/api/notepad-media-raw/:hobby',
    express.raw({ type:'application/octet-stream', limit:'40mb' }),
    (req, res) => {
        try {
            const mime = String(req.query?.mime || 'application/octet-stream').toLowerCase();
            const fileName = String(req.query?.fileName || 'image');
            const tabId = String(req.query?.tabId || 'notepad');
            const pageId = String(req.query?.pageId || 'page');
            const body = Buffer.isBuffer(req.body) ? req.body : Buffer.alloc(0);
            if (!body.length) return res.status(400).json({status:'error',message:'The image upload was empty.'});
            if (body.length > 40 * 1024 * 1024) return res.status(413).json({status:'error',message:'Notepad images must be 40 MB or smaller.'});
            if (!mime.startsWith('image/')) return res.status(400).json({status:'error',message:'Only image files can be added to Notepad pages.'});
            const saved = writeNotepadImageV249(req.params.hobby, tabId, pageId, body, mime, fileName);
            if (!saved) return res.status(400).json({status:'error',message:'That image format is not supported.'});
            return res.json({status:'success',image:saved});
        } catch (error) {
            console.error('Notepad media upload failed:', error);
            return res.status(500).json({status:'error',message:'Could not save that Notepad image.'});
        }
    }
);

app.delete('/api/notepad-media/:hobby', (req, res) => {
    try {
        const absolute = resolveNotepadMediaProjectPathV249(req.params.hobby, {projectPath:req.body?.projectPath,src:req.body?.src});
        if (absolute && fs.existsSync(absolute)) fs.unlinkSync(absolute);
        return res.json({status:'success'});
    } catch (error) {
        console.error('Notepad media delete failed:', error);
        return res.status(500).json({status:'error',message:'Could not remove that Notepad image file.'});
    }
});

// Portable backup data: file-backed Daily Log + Notepad images are temporarily
// embedded only in the downloaded backup. Restoring writes them back to files.
app.get('/api/export-data/:hobby', (req, res) => {
    try {
        const db = getDb(req.params.hobby);
        res.json(exportDbWithEmbeddedDailyMediaV246(req.params.hobby, db));
    } catch (error) {
        console.error('Portable log export failed:', error);
        res.status(500).json({ status:'error', message:'Could not prepare this log backup.' });
    }
});

// Dynamic Data Endpoints
app.get('/api/data/:hobby', (req, res) => res.json(getDb(req.params.hobby)));
app.post('/api/save/:hobby', (req, res) => { saveDb(req.params.hobby, req.body); res.json({ status: 'success' }); });
app.post('/api/save_day/:hobby', (req, res) => {
    let db = getDb(req.params.hobby);
    db.days[req.body.day] = req.body.data;
    if (req.body.global_phrases) db.phrases = req.body.global_phrases;
    saveDb(req.params.hobby, db);
    res.json({ status: 'success' });
});

// Korean API compatibility endpoints
app.get('/api/data', (req, res) => res.json(getDb('korean')));
app.post('/api/save_day', (req, res) => {
    let db = getDb('korean');
    db.days[req.body.day] = req.body.data;
    if (req.body.global_phrases) db.phrases = req.body.global_phrases;
    saveDb('korean', db); res.json({ status: 'success' });
});
app.post('/api/save_phrases', (req, res) => { let db = getDb('korean'); db.phrases = req.body.phrases; saveDb('korean', db); res.json({ status: 'success' }); });
app.post('/api/save_phrase_meta', (req, res) => { let db = getDb('korean'); db.phrase_meta[req.body.phrase] = req.body.meta; saveDb('korean', db); res.json({ status: 'success' }); });
app.post('/api/save_phrase_meta_batch', (req, res) => { let db = getDb('korean'); Object.assign(db.phrase_meta, req.body.metas); saveDb('korean', db); res.json({ status: 'success' }); });
app.post('/api/save_pattern_skips', (req, res) => { let db = getDb('korean'); db.pattern_skip_days = req.body.skip_days; saveDb('korean', db); res.json({ status: 'success' }); });
app.post('/api/save_ai_video_gallery', (req, res) => { let db = getDb('korean'); db.ai_video_gallery = req.body.gallery; saveDb('korean', db); res.json({ status: 'success' }); });
app.post('/api/save_reading_gallery', (req, res) => { let db = getDb('korean'); db.reading_gallery = req.body.gallery; saveDb('korean', db); res.json({ status: 'success' }); });
app.post('/api/save_curriculum', (req, res) => { let db = getDb('korean'); db.curriculum_progress = req.body.progress; saveDb('korean', db); res.json({ status: 'success' }); });
app.post('/api/save_alphabet_custom', (req, res) => { let db = getDb('korean'); db.alphabet_notes = req.body.notes; db.alphabet_overrides = req.body.overrides; saveDb('korean', db); res.json({ status: 'success' }); });
app.post('/api/save_alphabet_progress', (req, res) => { let db = getDb('korean'); db.alphabet_progress = req.body.progress; saveDb('korean', db); res.json({ status: 'success' }); });
app.post('/api/save_tools', (req, res) => { let db = getDb('korean'); db.tools = req.body.tools; saveDb('korean', db); res.json({ status: 'success' }); });
app.post('/api/save_srs', (req, res) => { let db = getDb('korean'); db.srs = req.body.srs; saveDb('korean', db); res.json({ status: 'success' }); });
app.post('/api/delete_phrase', (req, res) => {
    let db = getDb('korean');
    db.phrases = db.phrases.filter(p => p !== req.body.phrase);
    delete db.phrase_meta[req.body.phrase];
    for (let day in db.days) { if (db.days[day].phrases) db.days[day].phrases = db.days[day].phrases.filter(p => p !== req.body.phrase); }
    saveDb('korean', db); res.json({ status: 'success' });
});

// Return JSON for oversized/invalid JSON requests so the Theme Builder can
// show the actual reason instead of a generic upload failure.
app.use((err, req, res, next) => {
    if (!err) return next();

    if (err.type === 'entity.too.large') {
        return res.status(413).json({
            status: 'error',
            message: 'That upload is too large for the server request limit.'
        });
    }

    if (err instanceof SyntaxError && 'body' in err) {
        return res.status(400).json({
            status: 'error',
            message: 'The upload request could not be parsed.'
        });
    }

    console.error('Server request error:', err);
    res.status(500).json({
        status: 'error',
        message: err.message || 'Server error while saving the file.'
    });
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));