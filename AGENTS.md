# AGENTS.md

## Intent

Produce readable, predictable, maintainable code.
Do not introduce clever abstractions.
Match existing patterns.

Senior-owned codebase. Assume high standards.

---

## Before Changing Code

- Read relevant files fully.
- Follow existing patterns.
- Do not refactor unless explicitly asked.
- Do not introduce new dependencies.

---

## TypeScript

- Strict types only.
- No `any`.
- Prefer `type` over `interface`.
- Keep generics simple.

---

## React Native

- Functional components only.
- Keep components small and focused.
- Extract complexity instead of nesting it.
- No inline component definitions.

Avoid unnecessary `useMemo` / `useCallback`.

---

## Expo Router

- Follow file-based routing.
- Keep route files thin.
- Move logic to components/hooks.

---

## State & Async

- Prefer local state.
- Handle loading and error states.
- No hidden side effects.

---

## Style

Readability > compression.
Explicit > clever.
Simple > abstract.
