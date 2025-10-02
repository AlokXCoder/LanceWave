## 🍇 LanceWave – Freelance Task Marketplace


LanceWave is a modern freelance micro‑marketplace where clients post short tasks and freelancers bid to win the work. It features a smooth onboarding flow, protected routes, a dashboard for both sides, rich UI interactions, and Firebase‑backed auth/data.

---

### 📸 Preview

<img src="" alt="LanceWave preview" style="max-width: 100%;" />

---

### 🌟 Features

- **Post tasks**: Title, category, budget, deadline, and description
- **Browse & bid**: Filter and explore tasks; submit bids
- **Featured tasks**: Curated list with details pages
- **Task and bid management**: View/update/delete posted tasks; see your bids
- **Protected routes**: Auth‑gated views (dashboard, posting, profile, etc.)
- **Authentication**: Email/password and Google sign‑in via Firebase
- **Realtime UX**: Toasts, modals, and loading fallbacks

---

### 🛠 Tech Stack

- **React 19** + **Vite 6** (ESM, fast HMR)
- **React Router v7** (data/router APIs)
- **Tailwind CSS** + **DaisyUI** (utility‑first styling and components)
- **Firebase v11** (Auth, Firestore, Storage)
- **Framer Motion**, **React Toastify**, **SweetAlert2**, **Lucide Icons**

---

### 📦 Libraries & Tools

| Tool | Purpose |
|------|---------|
| `react-router` | Client routing (v7) |
| `firebase` | Auth, Firestore, Storage |
| `react-hook-form` | Accessible forms and validation |
| `framer-motion` | Animations |
| `react-toastify` | Toast notifications |
| `sweetalert2` | Elegant alerts |
| `tailwindcss` + `daisyui` | Styling and UI components |
| `axios` | HTTP client |

---

### 🔐 Environment Variables

Create a `.env` in the project root. These keys are used by both the app and the data import script.

```env
VITE_API_URL=https://your-backend-url.com
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

Firebase initialization reads these from `import.meta.env` in `src/Firebase/Firebase.js`.

---

### 💻 Getting Started

1) Clone and install

```bash
git clone https://github.com/your-username/task-match.git
cd task-match
npm install
```

2) Configure environment

- Create `.env` as shown above
- Optional: prepare `public/featuredTasks.json` if planning to import featured tasks

3) Run the dev server

```bash
npm run dev
```

4) Lint (optional)

```bash
npm run lint
```

5) Production build and preview

```bash
npm run build
npm run preview
```

---

### 📜 NPM Scripts

- `dev`: Start Vite dev server
- `build`: Build for production to `dist/`
- `preview`: Preview the production build
- `lint`: Run ESLint
- `import:featured`: Import `public/featuredTasks.json` into Firestore
  - Requires `.env` with Firebase credentials
  - File location: `scripts/importFeaturedTasks.mjs`

Run the import script:

```bash
npm run import:featured
```

`firebase.json` rewrites all routes to `/index.html` for SPA behavior.

---

### 🧭 App Structure

```
LanceWave
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── Dashboard/
│   │   ├── Login/
│   │   ├── Register/
│   │   ├── ResetPassword/
│   │   └── Pages/
│   ├── Firebase/
│   ├── Layouts/
│   ├── Provider/
│   └── Route/
│       └── PrivateRoute.jsx
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── firebase.json
├── index.html
├── package.json
├── tailwind.config.js
└── vite.config.js
```

Key files:
- `src/main.jsx`: Router setup and providers
- `src/Route/PrivateRoute.jsx`: Auth‑guarded route wrapper
- `src/Firebase/Firebase.js`: Firebase initialization (Auth, Firestore, Storage)
- `src/Provider/ContextProvider.jsx`: Auth context (register/login/logout, Google sign‑in, reset, profile updates)

---

### 🔗 Routes (high‑level)

- `/` Home (featured + feed)
- `/add-task` (protected)
- `/browse-tasks`
- `/featured-tasks`
- `/featured-tasks-details/:id` (protected)
- `/task-details/:id`
- `/my-posted-tasks` (protected)
- `/my-bids` (protected)
- `/tasks/:id` (protected, bid details)
- `/tasks/:id/bid` (protected)
- `/update-task/:id`
- `/my-profile`
- `/login`, `/register`, `/reset-password`
- `/dashboard` (protected)

---

### 🚀 Deployment

- Frontend: **Firebase Hosting**
  - Build: `npm run build` → outputs to `dist/`
  - Hosting config: `firebase.json`
- SPA rewrites:
  - All requests → `/index.html`

Basic steps (once Firebase CLI is set up and project initialized):

```bash
npm run build
firebase deploy
```

---

### 🤝 Contributing

- Fork the repo
- Create a feature branch: `git checkout -b feature/your-feature`
- Commit: `git commit -m "feat: add X"`
- Push and open a Pull Request

---

### 📄 License

This project is open source under the **MIT License**.

---
