# 🖥️ Screen Share Test App — Next.js 14

> A production-ready **Next.js 14 (App Router) + TypeScript** application built for the **Frontend Shortlisting Task – Screen Sharing Test (MERN)**.

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-Strict-3178C6?style=flat-square&logo=typescript)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

---

## ✨ What This Project Demonstrates

- ✅ Browser screen-sharing permission handling
- ✅ Media stream lifecycle detection
- ✅ Accurate success / failure state handling
- ✅ Proper cleanup with **no media leaks**
- ✅ Clean React architecture using a **custom hook**
- ✅ **No third-party screen-sharing libraries** — Native Web APIs only

---

## 🚀 Setup

### Prerequisites

| Requirement | Version |
|---|---|
| Node.js | 18+ |
| npm | 9+ |
| Browser | Chrome or Edge (latest) |

### Install & Run

```bash
git clone https://github.com/YOUR_USERNAME/screen-share-next.git
cd screen-share-next
npm install
npm run dev
```

Open: [http://localhost:3000](http://localhost:3000)

### Production Build

```bash
npm run build
npm start
```

---

## 🏗️ Project Structure

```
src/
├── app/
│   ├── page.tsx                  →  Homepage (/)
│   └── screen-test/page.tsx      →  Screen Test (/screen-test)
│
├── components/
│   ├── HomeClient.tsx
│   ├── ScreenTestClient.tsx
│   └── Button.tsx
│
└── hooks/
    └── useScreenShare.ts
```

> **Architecture notes:**
> - Server Components wrap all pages
> - All interactive logic lives in Client Components
> - Screen logic is isolated inside the `useScreenShare` hook

---

## 🖥️ Application Flow

### 1️⃣ Homepage (`/`)

- Title: **Screen Share Test App**
- Button: **Start Screen Test**
- Before navigation, checks API availability:
  ```ts
  typeof navigator.mediaDevices?.getDisplayMedia === 'function'
  ```
- Shows an **unsupported message** if the API is not available

---

### 2️⃣ Screen Test Page (`/screen-test`)

On button click, requests screen access:

```ts
navigator.mediaDevices.getDisplayMedia({
  video: { frameRate: { ideal: 30 } },
  audio: false,
})
```

#### States Handled

| State | Description |
|---|---|
| `requesting` | Permission dialog is open |
| `active` | Permission granted, stream is live |
| `cancelled` | User dismissed the picker |
| `denied` | Browser or user blocked access |
| `stopped` | Stream was ended by user or browser |
| `error` | An unexpected error occurred |

> The UI reflects the **exact current state** at all times.

---

#### 📺 Live Preview & Metadata

After permission is granted, the app displays:

- **Live preview** of the shared screen
- **Display type** — `tab` / `window` / `screen`
- **Resolution** — `width × height`
- **Frame rate**

All metadata is read via `track.getSettings()`. No recording. No backend. **Local preview only.**

---

#### 🔄 Lifecycle Detection

```ts
track.onended = () => { setStatus('stopped') }
```

Detects:
- User clicking **"Stop sharing"** in the browser UI
- Browser programmatically ending the stream
- All tracks are **properly stopped and cleaned up on unmount**

---

#### 🔁 Retry Flow

After a stream stops:
1. Shows **"Screen sharing stopped"** message
2. **Retry button** starts a fresh `getDisplayMedia` request
3. Old streams are **never reused**
4. **No media leaks**

---

## ⚙️ Tech Stack

| Technology | Details |
|---|---|
| Next.js | 14 — App Router |
| React | 18 |
| TypeScript | Strict mode |
| Styling | CSS Modules |
| Screen API | Native `getDisplayMedia` |

> ❌ No Tailwind. &nbsp; ❌ No UI libraries. &nbsp; ❌ No third-party screen-sharing packages.

---

## ⚠️ Known Limitations

- `getDisplayMedia` requires **HTTPS** (or `localhost`)
- **Not supported** on mobile browsers
- `displaySurface` constraint is **not supported in Firefox**
- Chrome throws `NotAllowedError` for both **cancel** and **deny** — handled via error message parsing

---

## 🌐 Browser Support

| Browser | Supported |
|---|---|
| Google Chrome (latest) | ✅ |
| Microsoft Edge (latest) | ✅ |
| Firefox | ⚠️ Partial (`displaySurface` unavailable) |
| Safari | ❌ Not supported |
| Mobile browsers | ❌ Not supported |

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

<p align="center">Built with ❤️ using Next.js 14 & Native Web APIs</p>
