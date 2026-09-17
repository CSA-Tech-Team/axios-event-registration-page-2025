import { getStoredToken } from "@/lib/auth-client";
import { ELocalStorageKeys } from "@/constants/enum";

export function isAuthenticated(): boolean {
  // Better Auth first: it is the credential Google sign-in produces. The old
  // store is still consulted so a session from before the migration survives.
  if (getStoredToken()) return true;

  try {
    const auth = localStorage.getItem(ELocalStorageKeys.AUTH_STORE);
    if (!auth) return false;
    const { state } = JSON.parse(auth);
    return !!state?.authToken;
  } catch {
    return false;
  }
}
