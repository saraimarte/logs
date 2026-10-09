# Connect Your Own YouTube Channel to Loggy

This guide is for someone cloning Loggy for the first time and wanting the built-in screen recorder to upload finished recordings to their own YouTube channel.

Loggy uses the YouTube Data API with Google OAuth 2.0. Each person should create their **own Google Cloud project and OAuth credentials**. Never reuse or publish somebody else's Client Secret.

## 1. Open Google Cloud and create a project

Go to:

https://console.cloud.google.com/

Create a new project or select an existing project that you want to use for Loggy.

## 2. Enable YouTube Data API v3

Open the API Library:

https://console.cloud.google.com/apis/library/youtube.googleapis.com

Make sure your Loggy Google Cloud project is selected, then click **Enable** for **YouTube Data API v3**.

Google's YouTube API documentation:

https://developers.google.com/youtube/v3/getting-started

## 3. Configure the Google OAuth consent screen

Open Google Auth Platform in Google Cloud:

https://console.cloud.google.com/auth/overview

Configure the app information Google asks for. For a personal/local Loggy setup, you can keep the app in **Testing** while setting it up.

If the app is in Testing, add the Google account that owns the YouTube channel as a **test user**.

Google's audience/testing documentation:

https://support.google.com/cloud/answer/15549945

Important: Google says authorizations for test users can expire after seven days while the app remains in Testing. If YouTube later appears disconnected, reconnect it from Loggy.

## 4. Create a Web application OAuth client

Open Google Cloud credentials/clients:

https://console.cloud.google.com/auth/clients

Create a new OAuth client and choose:

**Application type: Web application**

Give it a name such as:

`Loggy Local YouTube`

Add this exact **Authorized redirect URI** if you run Loggy on its normal local port:

```text
http://localhost:3000/api/recorder/youtube/oauth/callback
```

If you intentionally run Loggy on a different host or port, use the same host/port that Loggy actually uses, followed by:

```text
/api/recorder/youtube/oauth/callback
```

Google's web-server OAuth guide:

https://developers.google.com/identity/protocols/oauth2/web-server

## 5. Copy the Client ID and Client Secret

After creating the OAuth client, copy its:

- **Client ID**
- **Client Secret**

Do not paste the Client Secret into public JavaScript, HTML, a screenshot, GitHub issue, or committed config file.

Google specifically recommends keeping the client secret outside publicly accessible source code.

## 6. Create Loggy's private `.env` file

In the **project root beside `server.js`**, create a file named exactly:

```text
.env
```

Add:

```env
GOOGLE_CLIENT_ID=PASTE_YOUR_CLIENT_ID_HERE
GOOGLE_CLIENT_SECRET=PASTE_YOUR_CLIENT_SECRET_HERE
LOGGY_TOKEN_ENCRYPTION_KEY=PASTE_A_64_CHARACTER_HEX_KEY_HERE
LOGGY_YOUTUBE_REDIRECT_URI=http://localhost:3000/api/recorder/youtube/oauth/callback
```

Generate the encryption key locally with Node:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy the printed 64-character value into `LOGGY_TOKEN_ENCRYPTION_KEY`.

Do **not** put `.env` inside `public/`.

Do **not** commit `.env` to GitHub.

## 7. Make sure private recorder files are ignored by Git

Your root `.gitignore` should include:

```gitignore
.env
.env.*
!.env.example
.loggy-private/
.loggy-recordings/
```

Loggy stores the YouTube authorization token and recorder settings locally. Those files should never be committed to a public repository.

Before pushing to GitHub, it is a good habit to check:

```bash
git status
git diff --cached
```

## 8. Restart Loggy

After creating or changing `.env`, completely restart the Loggy server.

For the normal project setup this is typically:

```bash
npm start
```

Then open Loggy again at its local address.

## 9. Connect your YouTube channel inside Loggy

Open any Log page and open the screen recorder settings.

Go to the YouTube/recorder settings section and click **Connect YouTube**.

A Google authorization window should open.

1. Sign in with the Google account that owns the YouTube channel you want Loggy to use.
2. Approve the YouTube permissions requested by Loggy.
3. Return to Loggy.
4. The recorder settings should now show **YouTube connected**.
5. Choose a default playlist if you want one.

The recorder can then upload a finished recording to that authenticated YouTube channel.

## 10. Upload behavior in Loggy

After a recording finishes, Loggy's Recording Preview lets you review the upload information before sending it to YouTube.

The current recorder supports choosing a default playlist and can also add one recording to multiple playlists from the preview screen.

YouTube upload requests require OAuth authorization. The main upload permission used by YouTube is:

```text
https://www.googleapis.com/auth/youtube.upload
```

Official YouTube OAuth documentation:

https://developers.google.com/youtube/v3/guides/auth/server-side-web-apps

Official YouTube video-upload documentation:

https://developers.google.com/youtube/v3/guides/uploading_a_video

## Troubleshooting

### "YouTube is not configured"

Check that all four values exist in the root `.env` and restart Loggy:

- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `LOGGY_TOKEN_ENCRYPTION_KEY`
- `LOGGY_YOUTUBE_REDIRECT_URI`

### Google says `redirect_uri_mismatch`

The redirect URI in Google Cloud must match Loggy's redirect URI exactly, including:

- `http` versus `https`
- `localhost`
- port number
- `/api/recorder/youtube/oauth/callback`

For the default local setup, use:

```text
http://localhost:3000/api/recorder/youtube/oauth/callback
```

### Google says the app is not available to this user

If your OAuth app is still in Testing, make sure that Google account is listed as a test user in the Google Auth Platform audience settings.

### It connected before but asks me to connect again

While an OAuth app is in Testing, Google can expire test-user authorizations. Reconnect YouTube from Loggy. For a distributed/public app, review Google's current production and verification requirements before publishing the OAuth app.

### Wrong YouTube channel was connected

Disconnect YouTube from Loggy's recorder settings, then connect again and choose the Google/YouTube account you actually want to use.

### Important security rule

Never commit any of these to a public repository:

- `.env`
- Google Client Secret
- OAuth refresh tokens
- `.loggy-private/`
- `.loggy-recordings/`

If a real Client Secret is ever pushed publicly, create/rotate the OAuth client secret in Google Cloud and update your local `.env`.
