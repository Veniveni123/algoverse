import { doc, getDoc, setDoc } from "firebase/firestore";
import type { User } from "firebase/auth";

import { db } from "../config/firebase";

/**
 * Email/password signup creates a Firestore user doc directly. Other sign-in
 * methods (Google, etc.) don't go through that flow, so this ensures every
 * authenticated user ends up with a matching doc — called once right after
 * any successful sign-in.
 */
export async function ensureUserDocument(user: User): Promise<void> {
  const ref = doc(db, "users", user.uid);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    await setDoc(ref, {
      name: user.displayName || user.email?.split("@")[0] || "Learner",
      email: user.email || "",
      xp: 0,
      streak: 0,
      badges: [],
      completedAlgos: [],
      createdAt: new Date().toISOString(),
    });
  }
}
