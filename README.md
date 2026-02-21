# Screen Share Test App — Next.js

A production-grade **Next.js 14** (App Router) + **TypeScript** application for testing browser screen-sharing via the native `getDisplayMedia` Web API.

---

## Setup Instructions

### Prerequisites
- Node.js 18+
- npm 9+
- Chrome 72+ or Edge 79+

### Install & Run

```bash
git clone https://github.com/YOUR_USERNAME/screen-share-next.git
cd screen-share-next
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Build for Production

```bash
npm run build
npm start
```

---

## Project Structure

```
src/
├── app/
│   ├── layout.tsx               # Root layout (fonts, metadata)
│   ├── globals.css              # CSS variables, keyframes, base styles
│   ├── page.tsx                 # Route: /  (Server Component wrapper)
│   └── screen-test/
│       └── page.tsx             # Route: /screen-test (Server Component wrapper)
├── components/
│   ├── HomeClient.tsx           # Homepage UI ('use client')
│   ├── HomeClient.module.css
│   ├── ScreenTestClient.tsx     # Screen test UI ('use client')
│   ├── ScreenTestClient.module.css
│   ├── Button.tsx               # Reusable button component
│   └── Button.module.css
└── hooks/
    └── useScreenShare.ts        # All screen-sharing logic ('use client')
```

### Why Server + Client split?
Next.js App Router defaults to Server Components. Since `getDisplayMedia`, `useRef`, `useState`, and `useEffect` are browser-only APIs, all interactive logic lives in Client Components (`'use client'`). The page files (`page.tsx`) are thin Server Components that simply render the Client Components — this is the correct Next.js pattern.

---

## Screen-Sharing Flow

### State Machine

```
idle → requesting → active → stopped
                 ↘ cancelled
                 ↘ denied
                 ↘ error
```

### Step 1 — Capability Check (/)
```ts
typeof navigator.mediaDevices?.getDisplayMedia === 'function'
```
If false, shows an unsupported card inline. No navigation.

### Step 2 — Permission Request
```ts
await navigator.mediaDevices.getDisplayMedia({
  video: { frameRate: { ideal: 30 } },
  audio: false,
})
```
`status = 'requesting'` shows animated spinner while picker is open.

### Step 3 — Error Discrimination
| DOMException.name | State | Meaning |
|---|---|---|
| `NotAllowedError` + "permission denied" in message | `denied` | Browser/OS blocked |
| `NotAllowedError` (no "denied") | `cancelled` | User closed picker |
| `NotFoundError` | `error` | No screen source |
| `NotReadableError` | `error` | Hardware/OS lock |
| Other | `error` | Unknown |

### Step 4 — Metadata Extraction
```ts
const settings = videoTrack.getSettings()
// settings.width, settings.height, settings.frameRate
// settings.displaySurface → 'browser' | 'window' | 'monitor'
```

### Step 5 — Lifecycle Detection
```ts
videoTrack.onended = () => {
  setStatus('stopped')
  // release all tracks + clear video.srcObject
}
```
Fires when the user clicks "Stop sharing" in Chrome's bottom toolbar.

### Step 6 — Cleanup
```ts
useEffect(() => {
  return () => cleanup() // runs on unmount
}, [cleanup])
```
Stops all tracks and nullifies `onended` handlers — no leaks.

---

## Known Limitations & Browser Quirks

**`displaySurface` support**  
Available in Chrome/Edge. Returns `undefined` in Firefox. Falls back to `"Screen"`.

**Cancellation vs Denial**  
Chrome uses `NotAllowedError` for both. The app parses `err.message` for "permission denied" to distinguish them — this is a heuristic and may vary by browser version.

**Mobile**  
`getDisplayMedia` is unsupported on all mobile browsers. The homepage detects this and shows a clear message instead of navigating.

**HTTPS required**  
`getDisplayMedia` only works in a secure context (HTTPS or localhost).

**`frameRate` rounding**  
The reported `frameRate` from `getSettings()` is the initial negotiated rate — actual delivery may differ. Displayed value is `Math.round()`ed.

---

## Tech Stack

| Tool | Purpose |
|---|---|
| Next.js 14 (App Router) | Framework, routing, SSR |
| TypeScript | Type safety throughout |
| CSS Modules | Scoped component styles |
| `next/font/google` | Syne + JetBrains Mono |
| `getDisplayMedia` | Native screen sharing |
| React 18 | UI rendering |

No Tailwind. No component libraries. No screen-sharing libraries. No backend.
