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

export function dateToYm(date) {
  const [mm, yyyy] = date.split("/");
  return `${yyyy}-${mm}`;
}

/**
 * Ensures this month's bill records exist for every utility (idempotent).
 * amount starts null and is filled later on the Billing page.
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
        date,
        ym,
        status: "not_done",
        done_by: null,
        done_at: null,
        amount: null,
        created_at: serverTimestamp(),
      });
    }
  }
}