// Shared bill helpers. Doc IDs are deterministic (type_YYYY-MM) so creating the
// monthly record is idempotent — running ensure twice never duplicates.
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../config/firebase";
import { BILLS as BILL_DEFS } from "../config/data";

export function periodParts(d = new Date()) {
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = String(d.getFullYear());
  return { mm, yyyy, date: `${mm}/${yyyy}`, ym: `${yyyy}-${mm}` };
}

export function billId(type, ym) {
  return `${type}_${ym}`;
}

/**
 * Ensures this month's bill records exist for every utility.
 * Call it from anywhere an authenticated user lands (we call it in the
 * protected layout). Each new month, the first visit creates the fresh
 * not_done records automatically.
 */
export async function ensureCurrentMonthBills() {
  if (!db) return;
  const { date, ym } = periodParts();
  for (const def of Object.values(BILL_DEFS)) {
    const ref = doc(db, "BILLS", billId(def.key, ym));
    const snap = await getDoc(ref);
    if (!snap.exists()) {
      await setDoc(ref, {
        type: def.key,
        ref: def.ref,
        date,          // "MM/YYYY"
        ym,            // "YYYY-MM" (for ordering)
        status: "not_done",
        done_by: null,
        done_at: null,
        created_at: serverTimestamp(),
      });
    }
  }
}
