# 🖥️ Fabrion Frontend Client (`projectV1`)

This is the Next.js frontend client for **Fabrion**, housing the UI, Google OAuth client connections, Sandpack code execution canvas, and AI streaming endpoint integrations.

For the comprehensive system architecture, diagrams, and feature logs, please consult the [Main README.md](../README.md).

---

## ⚡ Quick Start

### 1. Installation
Ensure you are in this subdirectory:
```bash
cd projectV1
npm install
```

### 2. Configure Environment Variables
Create a `.env.local` file in this directory and supply:
```env
NEXT_PUBLIC_GEMINI_API_KEY="your-gemini-key"
NEXT_PUBLIC_CONVEX_URL="your-convex-deployment-url"
NEXT_PUBLIC_GOOGLE_AUTH_CLIENT_KEY="your-google-oauth-client-id"
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the client-side builder.

---

## 🖥️ Key Views & Navigation

*   **🏠 Home Page (`/`):** Features the interactive AI developer prompt compiler, workspace suggestions, and the main navigation header.
*   **🛠️ Workspace Dashboard (`/workspace/[id]`):** Renders the active workspace containing the real-time AI Chat view, live-compiled Sandpack Code canvas, and sliding workspace history Sidebar.
*   **👤 Shared Navigation Header:** Renders user avatar metadata, toggles the OAuth sign-in flow, handles custom profile settings modal access, and performs safe storage/session sign-out with instant redirection.

---

## 🛠️ Main Tech Dependencies

*   **Next.js 15.5:** Powering App-Router layouts and API endpoint logic.
*   **Tailwind CSS v4:** Styles the core client environment with responsive neon aesthetics.
*   **CodeSandbox Sandpack React:** Compiles generated code in client-side secure sandboxes.
*   **Google Generative AI SDK:** Interfaces directly with Google's API to construct Vite-ready files.
*   **Convex Client:** Provides reactive client-side bindings to real-time database queries/mutations.
*   **Sentry SDK:** Error boundaries logging edge and server telemetry.
