import { useState } from "react";

/**
 * Source of truth for the done / not-done state of each bill.
 *
 * Right now it's local component state so the UI is fully interactive with no
 * backend. When you're ready for Firebase, swap the body for a Firestore
 * listener + setDoc (example in README.md → "Wiring Firebase"). The returned
 * shape ({ statusMap, toggle }) stays the same, so no component has to change.
 */
export function useBillStatus(initial = { water: true, electricity: false }) {
  const [statusMap, setStatusMap] = useState(initial);
  const toggle = (key) => setStatusMap((s) => ({ ...s, [key]: !s[key] }));
  return { statusMap, toggle };
}
