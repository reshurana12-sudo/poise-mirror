## Problem

When running locally, Capture Studio shows:
> Camera error: Cannot read properties of undefined (reading 'getUserMedia')

### Root cause

`navigator.mediaDevices` is **only available in secure contexts**:
- `https://...`
- `http://localhost` / `http://127.0.0.1`

Vite is configured with `server.host: "::"`, which exposes the dev server on all network interfaces. If the app is opened via a LAN IP (e.g. `http://192.168.1.20:8080`) or any non-localhost hostname over plain HTTP, the browser sets `navigator.mediaDevices = undefined`. The current code in `src/pages/CaptureStudio.tsx` calls `navigator.mediaDevices.getUserMedia(...)` directly with no guard, so it throws before the existing `NotAllowedError` / `NotFoundError` handlers can run.

This is purely a local-dev issue — the deployed Lovable preview is HTTPS and works fine.

## Fix

### 1. Guard `navigator.mediaDevices` in `CaptureStudio.tsx`

In `startCamera`, before calling `getUserMedia`, check whether the API exists and the page is in a secure context. If not, show a friendly, actionable error explaining how to fix it locally.

```ts
if (!window.isSecureContext || !navigator.mediaDevices?.getUserMedia) {
  setCameraError(
    `Camera requires a secure context. Open the app at http://localhost:8080 ` +
    `(not your LAN IP) or use HTTPS. You can still use "Upload Photo" to continue.`
  );
  return;
}
```

This:
- Prevents the crash.
- Tells the user exactly what to do (use `localhost` instead of an IP).
- Reminds them the **Upload Photo** mode still works as a fallback.

### 2. No Vite config change required

We will keep `server.host: "::"` so the dev server stays reachable from other devices, but rely on the in-app message to steer the user toward `http://localhost:8080` when they want to use the camera.

### Files touched

- `src/pages/CaptureStudio.tsx` — add the secure-context / `mediaDevices` guard at the top of `startCamera`.

## How to verify locally

After the fix:
1. Open `http://localhost:8080/app/capture` → camera prompts and works as before.
2. Open `http://<your-lan-ip>:8080/app/capture` → instead of a cryptic crash, you see the friendly message and can switch to **Upload Photo**.
