import { useSession } from "@/lib/auth-client";
import { isAuthenticated } from "@/utils/common";

/**
 * Signed in means "the API says there is a session", not "a token happens to
 * be in localStorage".
 *
 * With Google the session normally lives in an httpOnly cookie and there is no
 * bearer token to find, so a localStorage-only check reports false for a
 * perfectly valid session. The stored token is still honoured, for the
 * cookie-less fallback and for sessions predating the migration.
 *
 * Returns `null` while the session is still resolving, so a caller can render
 * nothing rather than act on a not-yet-known answer.
 */
export function useIsSignedIn(): boolean | null {
  const { data: session, isPending } = useSession();

  if (session) return true;
  if (isAuthenticated()) return true;
  return isPending ? null : false;
}
