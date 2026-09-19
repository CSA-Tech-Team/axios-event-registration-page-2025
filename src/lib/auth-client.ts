import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields } from "better-auth/client/plugins";

/** Must match BETTER_AUTH_BASE_PATH on the backend. */
const DEFAULT_AUTH_BASE_PATH = "/api/auth/v2";

/** Where a bearer token is kept when the API hands one back. */
export const TOKEN_STORAGE_KEY = "axios.auth.token";

/**
 * `VITE_DARPANET_HOST` points at ".../api"; Better Auth wants the bare origin
 * and appends its own base path.
 */
function resolveAuthOrigin(): string {
  const explicit = import.meta.env.VITE_AUTH_BASE_URL;
  if (explicit) return explicit.replace(/\/+$/, "");

  const apiBaseUrl = import.meta.env.VITE_DARPANET_HOST;
  if (apiBaseUrl) {
    try {
      return new URL(apiBaseUrl, window.location.origin).origin;
    } catch {
      /* fall through */
    }
  }

  return window.location.origin;
}

/** localStorage throws in private mode / blocked-cookie contexts. */
export function getStoredToken(): string | null {
  try {
    return window.localStorage.getItem(TOKEN_STORAGE_KEY);
  } catch {
    return null;
  }
}

function storeToken(token: string) {
  try {
    window.localStorage.setItem(TOKEN_STORAGE_KEY, token);
  } catch {
    /* non-fatal: the session cookie is the primary mechanism */
  }
}

export function clearStoredToken() {
  try {
    window.localStorage.removeItem(TOKEN_STORAGE_KEY);
  } catch {
    /* ignore */
  }
}

export const authClient = createAuthClient({
  baseURL: resolveAuthOrigin(),
  basePath: import.meta.env.VITE_AUTH_BASE_PATH || DEFAULT_AUTH_BASE_PATH,
  // The extra `User` columns the API exposes through Better Auth. Keep in sync
  // with `user.additionalFields` in the backend's better-auth.factory.ts.
  plugins: [
    inferAdditionalFields({
      user: {
        referralCode: { type: "string", required: false },
        role: { type: "string", required: false },
        isProfileCompleted: { type: "boolean", required: false },
        phoneNumber: { type: "string", required: false },
      },
    }),
  ],
  fetchOptions: {
    // The API is on a different origin, so the session cookie only travels
    // when credentials are explicitly included.
    credentials: "include",
    auth: {
      type: "Bearer",
      // Returning undefined omits the header entirely - sending an empty
      // `Bearer ` would force a CORS preflight on every request.
      token: () => getStoredToken() ?? undefined,
    },
    onSuccess: (ctx) => {
      // The bearer plugin echoes a token whenever the API sets a session
      // cookie. Captured as a fallback for browsers that drop third-party
      // cookies; ignored when absent.
      const token = ctx.response.headers.get("set-auth-token");
      if (token) storeToken(token);
    },
  },
});

export const { useSession, getSession, signIn } = authClient;

/**
 * Starts the Google redirect flow. Throws when the API refuses to start it -
 * Better Auth reports that as `{ error }` instead of rejecting, which would
 * otherwise leave callers waiting on a redirect that never happens.
 */
export async function signInWithGoogle(
  callbackURL: string,
  errorCallbackURL?: string,
) {
  const result = await authClient.signIn.social({
    provider: "google",
    callbackURL,
    errorCallbackURL,
  });
  if (result.error) {
    throw new Error(
      result.error.message || "Google sign-in could not be started",
    );
  }
  return result;
}

/**
 * Ends the server session, then drops the cached bearer token.
 *
 * Throws when the server still holds a session afterwards. Better Auth reports
 * a failed sign-out as `{ error }` instead of rejecting, and treating that as
 * success would show a signed-out screen over a live session - the next
 * session check then bounces the user straight back in. A failure because
 * there was no session to end counts as signed out.
 */
export async function signOut() {
  const result = await authClient.signOut();
  if (result.error) {
    const current = await authClient.getSession();
    if (current.error || current.data) {
      throw new Error(result.error.message || "Sign-out failed");
    }
  }
  clearStoredToken();
}
