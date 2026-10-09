# Loggy Screen Recorder V710 — Setup

This build adds a persistent screen-recorder host for numbered Daily Logs. The recorder destination is locked when it is opened from a Day, then the separate recorder window owns the capture so the original Loggy page can navigate to another Log, the Dashboard, Knowledge Base, or another Loggy page without destroying the recording.

## 1. Files to add/replace

Project root, next to `server.js`:

- `server.js` — replace with the included version.
- `recorder-server.js` — NEW.
- `package.json` — included only to add `npm run check:recorder-secrets`; there are no new npm dependencies.
- `verify-recorder-secrets.js` — NEW.
- `.env.example` — NEW and safe to commit.
- `.gitignore` — contains the recorder privacy rules. If your project already has a `.gitignore`, MERGE the recorder lines into yours instead of deleting your existing rules.

Inside `public/`:

- `template.html` — replace with the included version so newly-created Logs load the recorder.
- `loggy-screen-recorder.js` — NEW.
- `loggy-screen-recorder.css` — NEW.
- `loggy-recorder-host.html` — NEW. This is the separate recording window that keeps recording alive when the original Loggy page navigates elsewhere.

You do **not** need to replace `template.js`, `template.css`, or any `template-extras-*.js` for this feature.

## 2. Private `.env` file

Create a file named exactly `.env` in the **project root beside `server.js`**. Do not put it inside `public/`.

Copy `.env.example` to `.env`, then fill in:

```env
GOOGLE_CLIENT_ID=your_web_oauth_client_id
GOOGLE_CLIENT_SECRET=your_web_oauth_client_secret
LOGGY_TOKEN_ENCRYPTION_KEY=your_64_hex_character_random_key
LOGGY_YOUTUBE_REDIRECT_URI=http://localhost:3000/api/recorder/youtube/oauth/callback
```

Generate the encryption key locally with:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy the printed 64-character value into `LOGGY_TOKEN_ENCRYPTION_KEY`.

### Google / YouTube setup

1. In Google Cloud, create or select a project.
2. Enable **YouTube Data API v3** for that project.
3. Configure the Google Auth Platform/consent screen. If your app is still in Testing, add your own Google account as a test user.
4. Create an OAuth client with application type **Web application**.
5. Add this exact Authorized Redirect URI:

```text
http://localhost:3000/api/recorder/youtube/oauth/callback
```

6. Copy the OAuth Client ID into `GOOGLE_CLIENT_ID` and the Client Secret into `GOOGLE_CLIENT_SECRET` in your local `.env`.
7. Do **not** put Google's downloaded `client_secret_....json` file anywhere inside the repository. This build does not need that JSON file.
8. Restart Loggy with `npm start`.
9. Open a Log page → Settings → **Screen Recorder Shortcuts** → **YouTube & Recorder Settings** → **Connect YouTube**.
10. After connecting, choose the default playlist. Recording Preview preselects it for each upload, where you can switch playlists, choose multiple playlists, or choose none. Upload privacy is **Private**.

Important YouTube limitation: YouTube currently restricts uploads made by unverified API projects created after July 28, 2020 to **Private**, even if the upload request asks for Unlisted. The recorder returns YouTube's actual privacy status so this is visible rather than silently pretending it became Unlisted. An audited/eligible project is required for that restriction to be lifted.

## 3. What is private and where it lives

### You type manually

`/.env`

- `GOOGLE_CLIENT_SECRET` — private.
- `LOGGY_TOKEN_ENCRYPTION_KEY` — private.
- `GOOGLE_CLIENT_ID` — not normally a password/secret, but this build keeps it in `.env` with the rest of the OAuth configuration anyway.
- `LOGGY_YOUTUBE_REDIRECT_URI` — not secret.

### Loggy creates automatically

`/.loggy-private/youtube-auth.enc.json`

- Contains the YouTube OAuth refresh token **encrypted with AES-256-GCM**.
- The raw refresh token is never written into public JavaScript/HTML and is never returned to the browser.
- Access tokens are refreshed on the server when needed and are not persisted to disk.

`/.loggy-private/recorder-settings.json`

- Stores the default YouTube playlist; each Recording Preview can override it for one video and can add the video to multiple playlists.
- Not a credential, but kept private/local with recorder configuration.

`/.loggy-recordings/`

- Temporary raw `.webm` recording data and recovery metadata.
- A successful YouTube upload deletes the raw recording immediately.
- Failed or unfinished recordings are automatically deleted after 48 hours.

None of those three locations is under `public/`, so Express static hosting cannot expose them as ordinary files.

## 4. GitHub protection

The included `.gitignore` contains:

```gitignore
.env
.env.*
!.env.example
.loggy-private/
.loggy-recordings/
```

`recorder-server.js` also checks the root `.gitignore` on startup and adds the three required private ignore rules if they are missing.

Before every public push, run:

```bash
npm run check:recorder-secrets
```

The included checker fails if `.env`, `.loggy-private/`, or `.loggy-recordings/` are Git-tracked. If `.env` exists locally, it also checks that the actual Client Secret and encryption-key values were not copied into another tracked text file.

You can also inspect exactly what you are about to commit:

```bash
git status
git diff --cached
```

If a private file was already tracked **before** you added `.gitignore`, ignoring it is not enough. Untrack it without deleting your local copy:

```bash
git rm --cached .env
git rm -r --cached .loggy-private .loggy-recordings
```

Only run the directory command for directories that Git is actually tracking. If a real Google Client Secret was ever pushed to a public repository, treat it as exposed: rotate the OAuth Client Secret in Google Cloud, update `.env`, reconnect YouTube if needed, and do not rely only on deleting the newest copy from the repository.

## 5. Recorder behavior

From a specific numbered Day Log, either click the Video Logs `+` and choose **Record Screen**, press the **Show / Hide Recorder Bar** shortcut to open the thin controls without recording, or use the **Start / Stop Recording** shortcut.

The default shortcuts are:

- `Shift + .` — Start / Stop Recording.
- `Shift + ,` — Show / Hide Recorder Bar without starting a recording.
- `Ctrl + Alt + P` — Pause / Resume.
- `Ctrl + Alt + M` — Microphone on/off.
- `Ctrl + Alt + C` — Camera on/off.
- `Ctrl + Alt + V` — Camera full screen on/off.
- `Ctrl + Alt + A` — Screen audio on/off.
- `Ctrl + Alt + F` — Open Screen Recorder Settings.
- `Ctrl + Alt + K` — Add timestamp marker.
- `Ctrl + Alt + /` — Show all recorder shortcuts.

The same shortcut editor appears in the recorder and in the Log page Settings. Values are shared across Loggy pages in that browser and mirrored into the current Log settings.

The Start / Stop shortcut starts a recording when the recorder is idle/ready and stops it when recording is active. Use the separate bar shortcut when you only want the recorder controls visible without opening the screen-sharing picker.

For your normal use case, choose the **main browser window** in the browser's share picker. Then you can switch among tabs/websites in that window while the separate Loggy Recorder window stays alive. The recorded video keeps its original destination even if you navigate the original Loggy tab to another Log or Dashboard.

Use the recorder's **Float controls** button when your browser supports Document Picture-in-Picture. That gives you an always-on-top camera/control panel while working in other tabs. If that browser feature is unavailable, the separate recorder window remains the fallback and the recording itself still works.

## 6. Included recording controls/options

The recorder includes:

- Record, pause/resume, stop.
- Microphone on/off and live microphone level meter.
- Camera on/off.
- Screen/system audio on/off when the selected share source actually provides an audio track.
- Camera and microphone device selectors.
- Camera shapes: circle, rounded square, square, portrait, pill/oval, bubble/blob.
- Camera backgrounds: none, dark, light, soft gradient.
- Camera size slider, free dragging, and four corner presets.
- Camera mirror on/off.
- Camera border width/color and shadow on/off.
- 0/3/5 second countdown.
- Timestamp markers, which are added to the YouTube description after upload.
- Editable shortcuts in both recorder UI and Log Settings.
- YouTube account connection, default playlist, and Unlisted/Private preference.
- Preview before upload, Retake, Discard, upload progress, and recovery after a failed upload.
- Temporary recording recovery for up to 48 hours.

The camera is composited into the actual recorded canvas, so its chosen shape/position is part of the finished video, not merely a cosmetic overlay inside Loggy.

## 7. Browser-only limitations

A normal website cannot receive Loggy keyboard shortcuts while an unrelated website tab has keyboard focus. While you are on another site, use the always-on-top recorder controls. If you switch back to any Loggy page, the configurable shortcuts can relay pause/stop/mic/camera/screen-audio/marker commands to the persistent recorder window.

This browser-only build does **not** inject click indicators, cursor spotlight logic, or freehand annotation overlays into arbitrary third-party websites. Browser isolation prevents Loggy from observing and drawing over unrelated sites that way. Those specific cross-site annotation features would require a browser extension or desktop-app layer. The captured browser cursor itself is controlled by the browser/display-capture implementation.

Background *color/frame* choices are included. True AI-style person/background segmentation blur is not included because it would require a separate vision/segmentation pipeline rather than ordinary webcam capture.


### V763 camera size
The Camera size slider now updates the settings preview, floating camera, and recorded composite continuously while dragging.
