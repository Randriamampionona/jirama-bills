import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db, firebaseReady } from "../config/firebase";

/** Live list of all registered users (households) — used for bill splitting. */
export function useUsers(ready = true) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!firebaseReady || !ready) { setLoading(false); return; }
    const unsub = onSnapshot(
      collection(db, "users"),
      (snap) => { setUsers(snap.docs.map((d) => ({ id: d.id, ...d.data() }))); setLoading(false); },
      (e) => { console.error("users listen:", e); setLoading(false); }
    );
    return unsub;
  }, [ready]);

  return { users, loading };
}