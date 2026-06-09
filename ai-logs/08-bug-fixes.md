# AI Development Log: 08-bug-fixes

**Date:** 2026-06-09
**Goal:** Track and resolve critical runtime bugs, hydration issues, and type definitions.

## Prompt Used
```text
Resolve React Native hydration errors when using Zustand persist with AsyncStorage. Provide a safe hook to prevent rendering before the store is fully loaded from disk. Fix any TypeScript compile errors on our components.
```

## AI Response Summary
- Identified that React Native layout can mount prior to AsyncStorage hydration, triggering mismatch errors in Server-Side Rendering (SSR) environments or Expo Web.
- Provided a custom wrapper or custom state hooks to block/defer rendering until `store.persist.hasHydrated()` returns true.
- Fixed type warnings for camera references and navigation parameters.

## Problems Faced
- Hydration warning during app startup: "Text content does not match server-rendered HTML".
- TypeScript compiler complaining about missing keys in AsyncStorage return types.

## Fixes
- Added a `useHasHydrated` hook that defaults to false and sets to true on the client mounting, bypassing hydration mismatches safely.
- Wrote strict interfaces for `HistoryItem` and `Flashcard` types.

## Final Implementation Decision
- Integrate the hydration state directly inside the store subscriber or a custom hook to guarantee stable start-ups.
