import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import emblem from "@/assets/axiosemblem.png";
import GoogleIcon from "@/components/common/GoogleIcon";
import { ERouterPaths } from "@/constants/enum";
import { signInWithGoogle, useSession } from "@/lib/auth-client";
import { SIGN_IN_START_ERROR, signInErrorMessage } from "@/lib/auth-errors";

/**
 * Google is the only way in. The email/password + OTP flow this page used to
 * run is retired on the API (LEGACY_AUTH_ENABLED=false), so its routes are not
 * even mounted.
 *
 * /signin and /signup both land here and do the same thing: with Google there
 * is no separate registration step, and a first-time account is created on the
 * way back. Both paths are kept because the landing page links to each.
 */
const SignIn = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { data: session, isPending } = useSession();

  const [isRedirecting, setIsRedirecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const errorParam = searchParams.get("error");

  useEffect(() => {
    if (errorParam) {
      setError(signInErrorMessage(errorParam));
    }
  }, [errorParam]);

  /**
   * The landing page links here with ?referralCode=... (including the alumni
   * link). The Google redirect would otherwise drop it, so it is parked for
   * the trip and read back after the callback.
   *
   * NOTE: nothing applies it yet. Referrals and the alumni role were handled
   * only by the legacy register route, which is retired - the API needs an
   * endpoint to claim a code for the signed-in user before this does anything.
   */
  useEffect(() => {
    const referralCode = searchParams.get("referralCode");
    if (referralCode) {
      try {
        sessionStorage.setItem("axios.auth.referralCode", referralCode);
      } catch {
        /* private mode - the code is simply lost, which is what happens today */
      }
    }
  }, [searchParams]);

  // Already signed in - don't make them do it twice.
  useEffect(() => {
    if (!isPending && session) navigate(ERouterPaths.PROFILE, { replace: true });
  }, [isPending, session, navigate]);

  const handleGoogleSignIn = async () => {
    setError(null);
    setIsRedirecting(true);
    try {
      await signInWithGoogle(
        `${window.location.origin}${ERouterPaths.AUTH_CALLBACK}`,
        `${window.location.origin}${ERouterPaths.SIGNIN}?error=oauth`,
      );
    } catch (err) {
      console.error("Google sign-in could not be started", err);
      setError(SIGN_IN_START_ERROR);
      setIsRedirecting(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen w-full bg-[#171717] text-white px-6">
      <div className="flex flex-col items-center mb-10">
        <img src={emblem} alt="Logo" className="h-40 w-40 mb-2" />
        <h1 className="text-3xl font-bold text-[#EFAD8B]">Welcome to Axios</h1>
        <p className="text-sm text-gray-400">
          Use your Google account to continue
        </p>
      </div>

      {error && (
        <div
          role="alert"
          className="w-full max-w-sm mb-6 rounded-md border border-[#C02727]/60 bg-[#C02727]/20 px-4 py-3 text-center text-sm"
        >
          {error}
        </div>
      )}

      <button
        type="button"
        onClick={handleGoogleSignIn}
        disabled={isRedirecting || isPending}
        className="w-full max-w-sm flex items-center justify-center gap-3 rounded-md bg-white px-4 py-4 font-semibold text-[#171717] transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <GoogleIcon className="h-5 w-5" />
        {isRedirecting ? "Redirecting to Google…" : "Continue with Google"}
      </button>

      <p className="mt-6 max-w-sm text-center text-xs text-gray-500">
        New here? Signing in with Google creates your Axios account
        automatically. You will be asked to complete your profile afterwards.
      </p>
    </div>
  );
};

export default SignIn;
