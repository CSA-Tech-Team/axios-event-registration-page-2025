/**
 * Everything the user reads when signing in or out goes wrong. Kept free of
 * status codes and jargon on purpose - the technical detail is for the
 * console, not the screen.
 */

const TRY_AGAIN_EXPIRED =
  "Your sign-in took too long to finish. Please try again.";

/**
 * Keyed by the `?error=` value the sign-in page is sent back with: Better
 * Auth's own codes from the Google round-trip, plus `oauth` and `session`,
 * which this app sets itself.
 */
const SIGN_IN_ERROR_MESSAGES: Record<string, string> = {
  oauth: "We couldn't sign you in with Google. Please try again.",
  access_denied:
    "Sign-in was cancelled. To continue, choose your Google account and allow access.",
  session: "We couldn't finish signing you in. Please try again.",
  please_restart_the_process: TRY_AGAIN_EXPIRED,
  state_mismatch: TRY_AGAIN_EXPIRED,
  state_not_found: TRY_AGAIN_EXPIRED,
  invalid_code: TRY_AGAIN_EXPIRED,
  no_code: TRY_AGAIN_EXPIRED,
  email_not_found:
    "Your Google account didn't share an email address with us. Please try a different account.",
  unable_to_get_user_info:
    "We couldn't get your details from Google. Please try again.",
  unable_to_create_user:
    "We couldn't set up your account just now. Please try again in a few minutes.",
  unable_to_create_session:
    "We couldn't sign you in just now. Please try again in a few minutes.",
  signup_disabled: "New sign-ups are closed at the moment.",
};

const DEFAULT_SIGN_IN_ERROR =
  "Something went wrong while signing you in. Please try again.";

/** Shown when the trip to Google could not even be started. */
export const SIGN_IN_START_ERROR =
  "We couldn't connect you to Google right now. Please check your internet connection and try again.";

export const SIGN_OUT_ERROR_TITLE = "You're still signed in";
export const SIGN_OUT_ERROR =
  "We couldn't sign you out just now. Please check your internet connection and try again.";

export function signInErrorMessage(code: string): string {
  return SIGN_IN_ERROR_MESSAGES[code.toLowerCase()] ?? DEFAULT_SIGN_IN_ERROR;
}
