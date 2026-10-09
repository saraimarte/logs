'use strict';

module.exports = function installLoggyRecorderServer({
    app,
    express,
    fs,
    path,
    publicDir,
    getDb,
    saveDb,
    projectRoot
}) {
    const crypto = require('crypto');
    const http = require('http');
    const https = require('https');
    const ROOT = projectRoot || process.cwd();
    const PRIVATE_DIR = path.join(ROOT, '.loggy-private');
    const RECORDING_DIR = path.join(ROOT, '.loggy-recordings');
    const AUTH_FILE = path.join(PRIVATE_DIR, 'youtube-auth.enc.json');
    const SETTINGS_FILE = path.join(PRIVATE_DIR, 'recorder-settings.json');
    const ENV_FILE = path.join(ROOT, '.env');
    const MAX_AGE_MS = 48 * 60 * 60 * 1000;
    const pendingOAuthStates = new Map();
    const uploadingSessions = new Set();

    fs.mkdirSync(PRIVATE_DIR, { recursive: true });
    fs.mkdirSync(RECORDING_DIR, { recursive: true });

    function ensureGitignoreProtection() {
        const gitignore = path.join(ROOT, '.gitignore');
        const required = ['.env', '.loggy-private/', '.loggy-recordings/'];
        let current = '';
        try { current = fs.readFileSync(gitignore, 'utf8'); } catch (_) {}
        const missing = required.filter(line => !current.split(/\r?\n/).some(existing => existing.trim() === line));
        if (!missing.length) return;
        const block = `\n# Loggy Screen Recorder private/local files\n${missing.join('\n')}\n`;
        try { fs.appendFileSync(gitignore, block, 'utf8'); }
        catch (error) { console.warn('[Loggy Recorder] Could not update .gitignore:', error?.message || error); }
    }

    function loadEnvFile() {
        let text = '';
        try { text = fs.readFileSync(ENV_FILE, 'utf8'); } catch (_) { return; }
        text.split(/\r?\n/).forEach(line => {
            const trimmed = line.trim();
            if (!trimmed || trimmed.startsWith('#')) return;
            const match = trimmed.match(/^([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
            if (!match) return;
            const key = match[1];
            if (process.env[key] !== undefined && process.env[key] !== '') return;
            let value = match[2].trim();
            if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
                value = value.slice(1, -1);
            }
            process.env[key] = value.replace(/\\n/g, '\n');
        });
    }

    ensureGitignoreProtection();
    loadEnvFile();

    // Recorder endpoints carry the ability to upload to the owner's YouTube
    // account, so they are intentionally local-machine only. A public GitHub
    // repository is fine; exposing these private API routes to the internet is not.
    app.use('/api/recorder', (req, res, next) => {
        const address = String(req.socket?.remoteAddress || '');
        const local = address === '127.0.0.1' || address === '::1' || address === '::ffff:127.0.0.1';
        if (!local) {
            return res.status(403).json({
                status: 'error',
                message: 'Loggy Recorder is local-only. Open Loggy through localhost on the computer running the server.'
            });
        }
        next();
    });

    const config = () => ({
        clientId: String(process.env.GOOGLE_CLIENT_ID || '').trim(),
        clientSecret: String(process.env.GOOGLE_CLIENT_SECRET || '').trim(),
        encryptionKey: String(process.env.LOGGY_TOKEN_ENCRYPTION_KEY || '').trim(),
        redirectUri: String(process.env.LOGGY_YOUTUBE_REDIRECT_URI || 'http://localhost:3000/api/recorder/youtube/oauth/callback').trim()
    });

    function missingConfig() {
        const cfg = config();
        const missing = [];
        if (!cfg.clientId) missing.push('GOOGLE_CLIENT_ID');
        if (!cfg.clientSecret) missing.push('GOOGLE_CLIENT_SECRET');
        if (!cfg.encryptionKey) missing.push('LOGGY_TOKEN_ENCRYPTION_KEY');
        return missing;
    }

    function getEncryptionKey() {
        const raw = config().encryptionKey;
        if (!raw) return null;
        if (/^[0-9a-f]{64}$/i.test(raw)) return Buffer.from(raw, 'hex');
        try {
            const decoded = Buffer.from(raw, 'base64');
            if (decoded.length === 32) return decoded;
        } catch (_) {}
        if (raw.length >= 24) return crypto.createHash('sha256').update(raw).digest();
        return null;
    }

    function encryptJson(value) {
        const key = getEncryptionKey();
        if (!key) throw new Error('LOGGY_TOKEN_ENCRYPTION_KEY is missing or too short.');
        const iv = crypto.randomBytes(12);
        const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
        const plaintext = Buffer.from(JSON.stringify(value), 'utf8');
        const encrypted = Buffer.concat([cipher.update(plaintext), cipher.final()]);
        const tag = cipher.getAuthTag();
        return {
            version: 1,
            algorithm: 'aes-256-gcm',
            iv: iv.toString('base64'),
            tag: tag.toString('base64'),
            data: encrypted.toString('base64')
        };
    }

    function decryptJson(payload) {
        const key = getEncryptionKey();
        if (!key || !payload?.iv || !payload?.tag || !payload?.data) return null;
        const decipher = crypto.createDecipheriv('aes-256-gcm', key, Buffer.from(payload.iv, 'base64'));
        decipher.setAuthTag(Buffer.from(payload.tag, 'base64'));
        const decoded = Buffer.concat([
            decipher.update(Buffer.from(payload.data, 'base64')),
            decipher.final()
        ]);
        return JSON.parse(decoded.toString('utf8'));
    }

    function readAuth() {
        try { return decryptJson(JSON.parse(fs.readFileSync(AUTH_FILE, 'utf8'))) || null; }
        catch (_) { return null; }
    }

    function writeAuth(auth) {
        fs.mkdirSync(PRIVATE_DIR, { recursive: true });
        fs.writeFileSync(AUTH_FILE, JSON.stringify(encryptJson(auth), null, 2), { mode: 0o600 });
    }

    function readRecorderSettings() {
        try {
            const data = JSON.parse(fs.readFileSync(SETTINGS_FILE, 'utf8'));
            return {
                playlistId: String(data?.playlistId || ''),
                playlistTitle: String(data?.playlistTitle || ''),
                privacyStatus: 'private'
            };
        } catch (_) {
            return { playlistId: '', playlistTitle: '', privacyStatus: 'private' };
        }
    }

    function writeRecorderSettings(settings) {
        const clean = {
            playlistId: String(settings?.playlistId || ''),
            playlistTitle: String(settings?.playlistTitle || ''),
            privacyStatus: 'private'
        };
        fs.writeFileSync(SETTINGS_FILE, JSON.stringify(clean, null, 2), { mode: 0o600 });
        return clean;
    }

    function sessionMetaPath(id) { return path.join(RECORDING_DIR, `${id}.json`); }
    function sessionMediaPath(id, ext = 'webm') { return path.join(RECORDING_DIR, `${id}.${ext}`); }
    function safeSessionId(value) { return /^[a-f0-9]{32}$/i.test(String(value || '')) ? String(value) : ''; }
    function safeHobby(value) { return String(value || '').replace(/[^a-z0-9_-]/gi, '').slice(0, 80); }
    function extensionForMime(mime) { return /mp4/i.test(String(mime || '')) ? 'mp4' : 'webm'; }

    function readSession(id) {
        id = safeSessionId(id);
        if (!id) return null;
        try { return JSON.parse(fs.readFileSync(sessionMetaPath(id), 'utf8')); }
        catch (_) { return null; }
    }

    function writeSession(meta) {
        meta.updatedAt = new Date().toISOString();
        fs.writeFileSync(sessionMetaPath(meta.id), JSON.stringify(meta, null, 2), { mode: 0o600 });
        return meta;
    }

    function removeSessionFiles(metaOrId) {
        const meta = typeof metaOrId === 'string' ? readSession(metaOrId) : metaOrId;
        const id = meta?.id || safeSessionId(metaOrId);
        if (!id) return;
        const ext = meta?.extension || 'webm';
        for (const file of [sessionMetaPath(id), sessionMediaPath(id, ext)]) {
            try { if (fs.existsSync(file)) fs.unlinkSync(file); } catch (_) {}
        }
    }

    function cleanupOldRecordings() {
        const now = Date.now();
        let entries = [];
        try { entries = fs.readdirSync(RECORDING_DIR, { withFileTypes: true }); } catch (_) { return; }
        const known = new Set();
        for (const entry of entries) {
            if (!entry.isFile() || !entry.name.endsWith('.json')) continue;
            const id = entry.name.slice(0, -5);
            const meta = readSession(id);
            if (!meta) continue;
            known.add(`${id}.${meta.extension || 'webm'}`);
            const stamp = Date.parse(meta.updatedAt || meta.createdAt || 0) || 0;
            if (stamp && now - stamp > MAX_AGE_MS) removeSessionFiles(meta);
        }
        // Remove orphan media files after the same 48-hour window.
        for (const entry of entries) {
            if (!entry.isFile() || !/\.(?:webm|mp4)$/i.test(entry.name) || known.has(entry.name)) continue;
            try {
                const stat = fs.statSync(path.join(RECORDING_DIR, entry.name));
                if (now - stat.mtimeMs > MAX_AGE_MS) fs.unlinkSync(path.join(RECORDING_DIR, entry.name));
            } catch (_) {}
        }
    }

    cleanupOldRecordings();
    const cleanupTimer = setInterval(cleanupOldRecordings, 60 * 60 * 1000);
    cleanupTimer.unref?.();

    async function jsonFetch(url, options = {}) {
        const response = await fetch(url, options);
        const text = await response.text();
        let data = {};
        try { data = text ? JSON.parse(text) : {}; } catch (_) { data = { raw: text }; }
        if (!response.ok) {
            const message = data?.error?.message || data?.error_description || data?.message || `Request failed (${response.status}).`;
            const error = new Error(message);
            error.status = response.status;
            error.payload = data;
            throw error;
        }
        return { response, data };
    }

    function youtubeApiErrorDetails(error) {
        const original = String(error?.message || 'YouTube request failed.');
        const disabled = /YouTube Data API v3 has not been used|youtube\.googleapis\.com.*disabled|accessNotConfigured|SERVICE_DISABLED|API has not been used in project/i.test(original);
        if (disabled) {
            const projectMatch = original.match(/project\s+([0-9]+)/i) || original.match(/[?&]project=([0-9A-Za-z:_-]+)/i);
            const project = projectMatch?.[1] || '';
            return {
                code: 'YOUTUBE_API_DISABLED',
                message: 'Your YouTube account is authorized, but YouTube Data API v3 is disabled for the Google Cloud project used by Loggy. Enable YouTube Data API v3 in that project, wait a minute for Google to apply the change, then retry this same temporary recording. You do not need to record again or re-authorize YouTube.',
                actionUrl: project
                    ? `https://console.developers.google.com/apis/api/youtube.googleapis.com/overview?project=${encodeURIComponent(project)}`
                    : 'https://console.developers.google.com/apis/api/youtube.googleapis.com/overview'
            };
        }
        return { code: 'YOUTUBE_ERROR', message: original, actionUrl: '' };
    }

    async function refreshAccessToken() {
        const cfg = config();
        const auth = readAuth();
        if (!auth?.refreshToken) throw new Error('YouTube is not connected yet.');
        const body = new URLSearchParams({
            client_id: cfg.clientId,
            client_secret: cfg.clientSecret,
            refresh_token: auth.refreshToken,
            grant_type: 'refresh_token'
        });
        const { data } = await jsonFetch('https://oauth2.googleapis.com/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body
        });
        if (!data.access_token) throw new Error('Google did not return an access token.');
        return data.access_token;
    }

    function oauthHtml(success, message) {
        const payload = JSON.stringify({ type: 'loggy-youtube-oauth', success: !!success, message: String(message || '') }).replace(/</g, '\\u003c');
        return `<!doctype html><html><head><meta charset="utf-8"><title>Loggy YouTube</title></head><body style="font-family:system-ui;padding:24px"><h2>${success ? 'YouTube connected' : 'YouTube connection failed'}</h2><p>${String(message || '').replace(/[&<>]/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;'}[ch]))}</p><script>try{window.opener&&window.opener.postMessage(${payload},location.origin);}catch(e){}setTimeout(()=>window.close(),700);</script></body></html>`;
    }

    async function listYouTubePlaylists(accessToken) {
        const items = [];
        let pageToken = '';
        for (let page = 0; page < 4; page += 1) {
            const url = new URL('https://www.googleapis.com/youtube/v3/playlists');
            url.searchParams.set('part', 'snippet');
            url.searchParams.set('mine', 'true');
            url.searchParams.set('maxResults', '50');
            if (pageToken) url.searchParams.set('pageToken', pageToken);
            const { data } = await jsonFetch(url.toString(), { headers: { Authorization: `Bearer ${accessToken}` } });
            for (const item of data.items || []) {
                items.push({ id: String(item.id || ''), title: String(item.snippet?.title || 'Untitled playlist') });
            }
            pageToken = String(data.nextPageToken || '');
            if (!pageToken) break;
        }
        return items;
    }

    function uploadFileToUrl(uploadUrl, filePath, mimeType, accessToken, onProgress = null) {
        return new Promise((resolve, reject) => {
            const url = new URL(uploadUrl);
            const client = url.protocol === 'http:' ? http : https;
            const stat = fs.statSync(filePath);
            const request = client.request({
                protocol: url.protocol,
                hostname: url.hostname,
                port: url.port || undefined,
                path: `${url.pathname}${url.search}`,
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': mimeType || 'video/webm',
                    'Content-Length': stat.size
                }
            }, response => {
                const chunks = [];
                response.on('data', chunk => chunks.push(chunk));
                response.on('end', () => {
                    const text = Buffer.concat(chunks).toString('utf8');
                    let data = {};
                    try { data = text ? JSON.parse(text) : {}; } catch (_) { data = { raw: text }; }
                    if (response.statusCode >= 200 && response.statusCode < 300) resolve(data);
                    else reject(new Error(data?.error?.message || `YouTube upload failed (${response.statusCode}).`));
                });
            });
            request.on('error', reject);
            const stream = fs.createReadStream(filePath);
            let sent = 0;
            stream.on('data', chunk => {
                sent += chunk.length;
                try { onProgress?.(sent, stat.size); } catch (_) {}
            });
            stream.on('error', reject).pipe(request);
        });
    }

    async function uploadToYouTube(meta, title, description, privacyStatus) {
        const accessToken = await refreshAccessToken();
        const filePath = sessionMediaPath(meta.id, meta.extension || 'webm');
        const stat = fs.statSync(filePath);
        const createUrl = new URL('https://www.googleapis.com/upload/youtube/v3/videos');
        createUrl.searchParams.set('uploadType', 'resumable');
        createUrl.searchParams.set('part', 'snippet,status');
        const { response } = await jsonFetch(createUrl.toString(), {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json; charset=UTF-8',
                'X-Upload-Content-Length': String(stat.size),
                'X-Upload-Content-Type': meta.mimeType || 'video/webm'
            },
            body: JSON.stringify({
                snippet: {
                    title: String(title || `Loggy ${meta.hobby} Day ${meta.day}`).slice(0, 100),
                    description: String(description || '').slice(0, 5000),
                    categoryId: '27'
                },
                status: { privacyStatus: privacyStatus === 'private' ? 'private' : 'unlisted' }
            })
        });
        const location = response.headers.get('location');
        if (!location) throw new Error('YouTube did not return an upload URL.');
        let lastProgressWrite = 0;
        const video = await uploadFileToUrl(location, filePath, meta.mimeType || 'video/webm', accessToken, (sent, total) => {
            meta.uploadedBytes = sent;
            meta.uploadBytesTotal = total;
            const now = Date.now();
            if (sent >= total || now - lastProgressWrite >= 750) {
                lastProgressWrite = now;
                writeSession(meta);
            }
        });
        if (!video?.id) throw new Error('YouTube did not return a video ID.');
        return { accessToken, video };
    }

    async function addVideoToPlaylist(accessToken, playlistId, videoId) {
        if (!playlistId) return null;
        const url = new URL('https://www.googleapis.com/youtube/v3/playlistItems');
        url.searchParams.set('part', 'snippet');
        const { data } = await jsonFetch(url.toString(), {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                snippet: {
                    playlistId,
                    resourceId: { kind: 'youtube#video', videoId }
                }
            })
        });
        return data;
    }

    function updateLogVideoDestination(meta, youtubeUrl) {
        const hobby = safeHobby(meta.hobby);
        const day = Number(meta.day);
        const slot = meta.slot === 'video2' ? 'video2' : 'video';
        const db = getDb(hobby);
        db.days ||= {};
        db.days[day] ||= {};
        db.days[day][slot] = youtubeUrl;
        saveDb(hobby, db);
    }

    app.get('/api/recorder/status', (req, res) => {
        const settings = readRecorderSettings();
        const missing = missingConfig();
        const auth = missing.length ? null : readAuth();
        res.json({
            status: 'success',
            configured: missing.length === 0,
            missing,
            connected: !!auth?.refreshToken,
            settings,
            tempRetentionHours: 48
        });
    });

    app.get('/api/recorder/youtube/auth-url', (req, res) => {
        const missing = missingConfig();
        if (missing.length) return res.status(400).json({ status: 'error', message: `Missing private configuration: ${missing.join(', ')}` });
        const cfg = config();
        const state = crypto.randomBytes(24).toString('hex');
        pendingOAuthStates.set(state, Date.now() + 10 * 60 * 1000);
        const url = new URL('https://accounts.google.com/o/oauth2/v2/auth');
        url.searchParams.set('client_id', cfg.clientId);
        url.searchParams.set('redirect_uri', cfg.redirectUri);
        url.searchParams.set('response_type', 'code');
        url.searchParams.set('scope', 'https://www.googleapis.com/auth/youtube.force-ssl');
        url.searchParams.set('access_type', 'offline');
        url.searchParams.set('prompt', 'consent');
        url.searchParams.set('include_granted_scopes', 'true');
        url.searchParams.set('state', state);
        res.json({ status: 'success', url: url.toString() });
    });

    app.get('/api/recorder/youtube/oauth/callback', async (req, res) => {
        const state = String(req.query.state || '');
        const expires = pendingOAuthStates.get(state) || 0;
        pendingOAuthStates.delete(state);
        if (!state || expires < Date.now()) return res.status(400).send(oauthHtml(false, 'The authorization request expired. Start Connect YouTube again from Loggy.'));
        if (req.query.error) {
            const code = String(req.query.error || '');
            const detail = String(req.query.error_description || code);
            const message = code === 'access_denied'
                ? 'Google denied authorization. If this OAuth app is External and still in Testing, add the Google account you are signing in with under Google Auth Platform → Audience → Test users, then try Authorize YouTube again.'
                : detail;
            return res.status(400).send(oauthHtml(false, message));
        }
        const code = String(req.query.code || '');
        if (!code) return res.status(400).send(oauthHtml(false, 'Google did not return an authorization code.'));
        try {
            const cfg = config();
            const body = new URLSearchParams({
                code,
                client_id: cfg.clientId,
                client_secret: cfg.clientSecret,
                redirect_uri: cfg.redirectUri,
                grant_type: 'authorization_code'
            });
            const { data } = await jsonFetch('https://oauth2.googleapis.com/token', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body
            });
            const previous = readAuth() || {};
            const refreshToken = String(data.refresh_token || previous.refreshToken || '');
            if (!refreshToken) throw new Error('Google did not return a refresh token. Try connecting again and approve access.');
            writeAuth({
                refreshToken,
                scope: String(data.scope || 'https://www.googleapis.com/auth/youtube.force-ssl'),
                connectedAt: new Date().toISOString()
            });
            res.send(oauthHtml(true, 'You can close this window and return to Loggy.'));
        } catch (error) {
            console.error('[Loggy Recorder] OAuth callback failed:', error);
            res.status(500).send(oauthHtml(false, error.message || 'Could not connect YouTube.'));
        }
    });

    app.post('/api/recorder/youtube/disconnect', (req, res) => {
        try { if (fs.existsSync(AUTH_FILE)) fs.unlinkSync(AUTH_FILE); } catch (_) {}
        res.json({ status: 'success' });
    });

    app.get('/api/recorder/youtube/playlists', async (req, res) => {
        try {
            const accessToken = await refreshAccessToken();
            const playlists = await listYouTubePlaylists(accessToken);
            res.json({ status: 'success', playlists });
        } catch (error) {
            const detail = youtubeApiErrorDetails(error);
            res.status(400).json({ status: 'error', ...detail });
        }
    });

    app.get('/api/recorder/settings', (req, res) => {
        res.json({ status: 'success', settings: readRecorderSettings() });
    });

    app.post('/api/recorder/settings', (req, res) => {
        res.json({ status: 'success', settings: writeRecorderSettings(req.body || {}) });
    });

    app.post('/api/recorder/session', (req, res) => {
        const hobby = safeHobby(req.body?.hobby);
        const day = Number(req.body?.day);
        const slot = req.body?.slot === 'video2' ? 'video2' : 'video';
        const mimeType = String(req.body?.mimeType || 'video/webm').slice(0, 120);
        if (!hobby || !Number.isInteger(day) || day < 1) return res.status(400).json({ status: 'error', message: 'A valid Log and numbered day are required.' });
        const id = crypto.randomBytes(16).toString('hex');
        const extension = extensionForMime(mimeType);
        const meta = {
            id,
            hobby,
            day,
            slot,
            mimeType,
            extension,
            title: String(req.body?.title || '').slice(0, 180),
            state: 'recording',
            bytes: 0,
            chunks: 0,
            receivedChunkIndexes: [],
            markers: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        fs.writeFileSync(sessionMediaPath(id, extension), Buffer.alloc(0), { mode: 0o600 });
        writeSession(meta);
        res.json({ status: 'success', session: meta });
    });

    const rawChunk = express.raw({ type: 'application/octet-stream', limit: '128mb' });
    app.post('/api/recorder/session/:id/chunk', rawChunk, (req, res) => {
        const meta = readSession(req.params.id);
        if (!meta) return res.status(404).json({ status: 'error', message: 'Recording session not found.' });
        if (!Buffer.isBuffer(req.body)) return res.status(400).json({ status: 'error', message: 'Recording chunk is missing.' });
        if (meta.state !== 'recording') return res.status(409).json({ status: 'error', message: 'That recording is no longer accepting chunks.' });
        const index = Number(req.query?.index);
        const hasIndex = Number.isInteger(index) && index >= 0;
        const received = Array.isArray(meta.receivedChunkIndexes) ? meta.receivedChunkIndexes : [];
        if (hasIndex && received.includes(index)) {
            return res.json({ status:'success', duplicate:true, bytes:Number(meta.bytes || 0), chunks:Number(meta.chunks || 0) });
        }
        try {
            fs.appendFileSync(sessionMediaPath(meta.id, meta.extension || 'webm'), req.body);
            meta.bytes = Number(meta.bytes || 0) + req.body.length;
            meta.chunks = Number(meta.chunks || 0) + 1;
            if (hasIndex) {
                received.push(index);
                meta.receivedChunkIndexes = received.slice(-10000);
            }
            writeSession(meta);
            res.json({ status: 'success', bytes: meta.bytes, chunks: meta.chunks, index: hasIndex ? index : null });
        } catch (error) {
            res.status(500).json({ status: 'error', message: error.message || 'Could not save recording chunk.' });
        }
    });

    app.post('/api/recorder/session/:id/finish', (req, res) => {
        const meta = readSession(req.params.id);
        if (!meta) return res.status(404).json({ status: 'error', message: 'Recording session not found.' });
        meta.state = 'ready';
        meta.durationMs = Math.max(0, Number(req.body?.durationMs || 0));
        meta.markers = Array.isArray(req.body?.markers) ? req.body.markers.slice(0, 1000).map(marker => ({
            ms: Math.max(0, Number(marker?.ms || 0)),
            label: String(marker?.label || 'Marker').slice(0, 100)
        })) : [];
        if (req.body?.title) meta.title = String(req.body.title).slice(0, 180);
        writeSession(meta);
        res.json({ status: 'success', session: meta, mediaUrl: `/api/recorder/session/${meta.id}/media` });
    });

    app.get('/api/recorder/session/:id/status', (req, res) => {
        const meta = readSession(req.params.id);
        if (!meta) return res.status(404).json({ status:'error', message:'Recording session not found.' });
        const total = Math.max(0, Number(meta.uploadBytesTotal || meta.bytes || 0));
        const sent = Math.max(0, Number(meta.uploadedBytes || 0));
        res.json({
            status:'success',
            state:meta.state,
            uploadedBytes:sent,
            uploadBytesTotal:total,
            progressPercent: total ? Math.floor((sent / total) * 100) : 0
        });
    });

    app.get('/api/recorder/session/:id/media', (req, res) => {
        const meta = readSession(req.params.id);
        if (!meta) return res.status(404).end();
        const filePath = sessionMediaPath(meta.id, meta.extension || 'webm');
        if (!fs.existsSync(filePath)) return res.status(404).end();
        const stat = fs.statSync(filePath);
        const range = req.headers.range;
        const type = meta.mimeType || 'video/webm';
        if (!range) {
            res.writeHead(200, { 'Content-Type': type, 'Content-Length': stat.size, 'Accept-Ranges': 'bytes', 'Cache-Control': 'no-store' });
            return fs.createReadStream(filePath).pipe(res);
        }
        const match = /bytes=(\d*)-(\d*)/.exec(String(range));
        const start = match?.[1] ? Number(match[1]) : 0;
        const end = match?.[2] ? Math.min(Number(match[2]), stat.size - 1) : stat.size - 1;
        if (!Number.isFinite(start) || !Number.isFinite(end) || start > end || start >= stat.size) {
            res.status(416).set('Content-Range', `bytes */${stat.size}`).end();
            return;
        }
        res.writeHead(206, {
            'Content-Range': `bytes ${start}-${end}/${stat.size}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': end - start + 1,
            'Content-Type': type,
            'Cache-Control': 'no-store'
        });
        fs.createReadStream(filePath, { start, end }).pipe(res);
    });

    app.get('/api/recorder/recoverable', (req, res) => {
        cleanupOldRecordings();
        const sessions = [];
        let entries = [];
        try { entries = fs.readdirSync(RECORDING_DIR); } catch (_) {}
        for (const name of entries) {
            if (!name.endsWith('.json')) continue;
            const meta = readSession(name.slice(0, -5));
            if (!meta || meta.state === 'uploaded') continue;
            sessions.push({
                id: meta.id,
                hobby: meta.hobby,
                day: meta.day,
                slot: meta.slot,
                title: meta.title,
                state: meta.state,
                bytes: meta.bytes,
                durationMs: meta.durationMs || 0,
                createdAt: meta.createdAt,
                updatedAt: meta.updatedAt,
                mediaUrl: `/api/recorder/session/${meta.id}/media`,
                lastError: meta.lastError || ''
            });
        }
        sessions.sort((a, b) => Date.parse(b.updatedAt || 0) - Date.parse(a.updatedAt || 0));
        res.json({ status: 'success', sessions });
    });

    app.delete('/api/recorder/session/:id', (req, res) => {
        const meta = readSession(req.params.id);
        if (meta) removeSessionFiles(meta);
        res.json({ status: 'success' });
    });

    app.post('/api/recorder/session/:id/upload', async (req, res) => {
        const meta = readSession(req.params.id);
        if (!meta) return res.status(404).json({ status: 'error', message: 'Recording session not found.' });
        if (uploadingSessions.has(meta.id)) return res.status(409).json({ status: 'error', message: 'This recording is already uploading.' });
        const filePath = sessionMediaPath(meta.id, meta.extension || 'webm');
        if (!fs.existsSync(filePath) || fs.statSync(filePath).size === 0) return res.status(400).json({ status: 'error', message: 'The recording file is empty.' });
        const missing = missingConfig();
        if (missing.length) return res.status(400).json({ status: 'error', message: `Missing private configuration: ${missing.join(', ')}` });
        if (!readAuth()?.refreshToken) return res.status(400).json({ status: 'error', message: 'Connect YouTube before uploading.' });

        uploadingSessions.add(meta.id);
        meta.state = 'uploading';
        meta.lastError = '';
        meta.uploadedBytes = 0;
        meta.uploadBytesTotal = fs.statSync(filePath).size;
        writeSession(meta);
        try {
            const settings = readRecorderSettings();
            const title = String(req.body?.title || meta.title || `Loggy ${meta.hobby} Day ${meta.day}`).trim();
            const description = String(req.body?.description ?? '').trim();
            const privacyStatus = 'private';
            const hasPlaylistOverride = Array.isArray(req.body?.playlistIds);
            const playlistIds = [...new Set((hasPlaylistOverride
                ? req.body.playlistIds
                : [req.body?.playlistId ?? settings.playlistId ?? ''])
                .map(value => String(value || '').trim())
                .filter(Boolean))];

            const { accessToken, video } = await uploadToYouTube(meta, title, description, privacyStatus);
            const videoId = String(video.id || '');
            const youtubeUrl = `https://www.youtube.com/watch?v=${videoId}`;
            const playlistWarnings = [];
            const playlistsAdded = [];
            for (const playlistId of playlistIds) {
                try {
                    await addVideoToPlaylist(accessToken, playlistId, videoId);
                    playlistsAdded.push(playlistId);
                } catch (error) {
                    const message = error.message || 'Video uploaded, but it could not be added to one selected playlist.';
                    playlistWarnings.push(message);
                    console.warn(`[Loggy Recorder] Playlist add failed for ${playlistId}:`, error);
                }
            }
            const playlistWarning = playlistWarnings.join(' ');

            updateLogVideoDestination(meta, youtubeUrl);
            meta.state = 'uploaded';
            meta.youtubeVideoId = videoId;
            meta.youtubeUrl = youtubeUrl;
            meta.uploadedAt = new Date().toISOString();
            writeSession(meta);

            // Successful recordings are not retained locally. YouTube keeps the
            // final video; Loggy keeps only the URL in the target Day Log.
            removeSessionFiles(meta);
            res.json({
                status: 'success',
                youtubeUrl,
                videoId,
                actualPrivacyStatus: video.status?.privacyStatus || privacyStatus,
                playlistWarning,
                playlistsRequested: playlistIds,
                playlistsAdded,
                destination: { hobby: meta.hobby, day: meta.day, slot: meta.slot }
            });
        } catch (error) {
            const detail = youtubeApiErrorDetails(error);
            meta.state = 'upload-failed';
            meta.lastError = String(detail.message || error.message || 'Upload failed.').slice(0, 1000);
            writeSession(meta);
            console.error('[Loggy Recorder] YouTube upload failed:', error);
            res.status(500).json({ status: 'error', message: meta.lastError, code: detail.code, actionUrl: detail.actionUrl, retainedHours: 48 });
        } finally {
            uploadingSessions.delete(meta.id);
        }
    });
};
