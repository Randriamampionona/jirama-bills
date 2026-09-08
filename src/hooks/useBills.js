import { useEffect, useState, useCallback } from "react";
import {
  collection, doc, getDoc, updateDoc, onSnapshot, query, orderBy, serverTimestamp,
} from "firebase/firestore";
import { db } from "../config/firebase";
import { BILLS as BILL_DEFS } from "../config/data";
import { billId, periodParts } from "../lib/bills";

export function useBills() {
  const [all, setAll] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!db) { setLoading(false); return; }
    const q = query(collection(db, "BILLS"), orderBy("ym", "desc"));
    const unsub = onSnapshot(
      q,
      (snap) => { setAll(snap.docs.map((d) => ({ id: d.id, ...d.data() }))); setLoading(false); },
      (e) => { console.error("BILLS listen error:", e); setLoading(false); }
    );
    return unsub;
  }, []);

  // one-way: only not_done -> done
  const markDone = useCallback(async (type, email) => {
    if (!db) return;
    const { ym } = periodParts();
    const ref = doc(db, "BILLS", billId(type, ym));
    const snap = await getDoc(ref);
    if (snap.exists() && snap.data().status === "not_done") {
      await updateDoc(ref, { status: "done", done_by: email, done_at: serverTimestamp() });
    }
  }, []);

  // edit the monthly total (Billing page)
  const updateAmount = useCallback(async (type, ym, amount) => {
    if (!db) return;
    const ref = doc(db, "BILLS", billId(type, ym));
    await updateDoc(ref, {
      amount: amount == null || amount === "" ? null : Number(amount),
    });
  }, []);

  const { ym: currentYm, date: currentDate } = periodParts();
  const current = {};
  for (const def of Object.values(BILL_DEFS)) {
    current[def.key] = all.find((b) => b.id === billId(def.key, currentYm)) || null;
  }

  const months = [...new Set(all.map((b) => b.date))];
  const billsByMonth = (date) => all.filter((b) => b.date === date);

  return { all, loading, current, currentDate, months, billsByMonth, markDone, updateAmount };
}