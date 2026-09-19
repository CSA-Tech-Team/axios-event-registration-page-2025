import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import BrandMark from "@/components/common/BrandMark";
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
    <main className="flex min-h-dvh w-full items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="relative mb-12 text-center">
          <BrandMark variant="hero" />
          <span
            aria-hidden="true"
            className="absolute -bottom-7 right-2 rotate-[-6deg] font-note text-xl text-acc sm:right-6"
          >
            claim your seat
          </span>
        </div>

        <section
          aria-labelledby="signin-title"
          className="brut-card rotate-[0.6deg] p-6 sm:p-8"
        >
          <p className="eyebrow text-ink-2">Sign in · Registration desk</p>
          <h1
            id="signin-title"
            className="mt-2 font-section text-4xl font-extrabold uppercase leading-[0.9] tracking-[-0.03em]"
          >
            Welcome to Axios
          </h1>
          <p className="mt-3 text-[15px] leading-relaxed text-ink-2">
            Use your Google account to continue.
          </p>

          {error && (
            <div
              role="alert"
              className="mt-5 border-2 border-ink border-l-[8px] border-l-acc bg-wcard px-4 py-3 text-sm font-semibold text-ink"
            >
              {error}
            </div>
          )}

          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isRedirecting || isPending}
            className="mt-6 flex min-h-12 w-full items-center justify-center gap-3 border-[3px] border-ink bg-wcard px-4 py-3 font-bold text-ink shadow-brut transition-[transform,box-shadow] duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 focus-visible:-translate-x-0.5 focus-visible:-translate-y-0.5 active:translate-x-1 active:translate-y-1 active:shadow-brut-press disabled:cursor-not-allowed disabled:opacity-60"
          >
            <GoogleIcon className="h-5 w-5" />
            {isRedirecting ? "Redirecting to Google…" : "Continue with Google"}
          </button>

          <p className="mt-6 border-t-2 border-dashed border-line pt-4 text-sm leading-relaxed text-ink-2">
            New here? Signing in with Google creates your Axios account
            automatically. You will be asked to complete your profile
            afterwards.
          </p>
        </section>
      </div>
    </main>
  );
};

export default SignIn;
