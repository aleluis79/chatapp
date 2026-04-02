# Copilot Instructions for ChatApp

This file gives guidance for Copilot CLI sessions working on this repository.

Build, test, and lint

- Install deps: npm install
- Dev server: npm run dev
- Build: npm run build
- Preview build: npm run preview
- Lint: npm run lint
- Run all tests: npm test
- Vitest UI: npm run test:ui
- Coverage: npm run test:coverage

Running a single test file or spec:
- Use vitest directly: npx vitest src/components/ChatContainer.test.tsx
- Or via npm: npm test -- src/components/ChatContainer.test.tsx
- Run a single test name: npx vitest -t "should render button"

High-level architecture (summary)

- Single-page React + TypeScript app built with Vite. UI providers in App wrap:
  - ThemeProvider (ThemeContext) — theme persisted in localStorage, supports light/dark/system
  - ChatProvider (ChatContext) — manages messages, loading state, persistence
- LLMService (src/services/LLMService.ts) encapsulates all web-llm model logic: init, model switching, streaming tokens, cleanup
- Components are functional React hooks, small and focused (components/).
- Data flow: user input → ChatContext → LLMService → streaming tokens → ChatContext updates → UI
- Alias: @ maps to ./src (vite/vitest resolve.alias)

Key conventions

- TypeScript strict mode is used. Prefer explicit types for public APIs.
- Functional components + hooks only. Avoid class components.
- Contexts live in src/context and include paired tests (e.g., ThemeContext.test.tsx)
- Tests colocated next to implementation files and use Vitest with environment "happy-dom" (see vitest.config.ts)
- ESLint targets **/*.{ts,tsx}. Run `npm run lint` before PRs.
- Add new models by editing ModelId and MODEL_PRESETS in src/services/LLMService.ts.

Docs and important files

- README.md, ARCHITECTURE.md, GUIA_USUARIO.md contain project overview, architecture, and user guide — consult them for design details and troubleshooting.

AI assistant / other configs

- No CLAUDE.md, AGENTS.md, or other AI assistant rule files were found; add them if you use other assistants.

Notes for Copilot sessions

- Tests: prefer using npx vitest for quick single-file runs.
- When changing themes or context, update both implementation and tests (context tests exist).
- Be aware of model sizes (web-llm downloads to IndexedDB; initial download can be large).

