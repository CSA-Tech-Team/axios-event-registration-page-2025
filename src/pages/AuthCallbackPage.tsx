import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { ERouterPaths } from "@/constants/enum";
import { useSession } from "@/lib/auth-client";

/** Give the session cookie a moment to resolve before declaring failure. */
const SESSION_TIMEOUT_MS = 8000;

/**
 * Landing spot after Google bounces the browser back through the API.
 * The session is already set by then, so all this does is wait for it to
 * resolve and forward the user on.
 */
const AuthCallbackPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { data: session, isPending } = useSession();
  const [timedOut, setTimedOut] = useState(false);

  const errorParam = searchParams.get("error");

  useEffect(() => {
    if (errorParam) {
      navigate(`${ERouterPaths.SIGNIN}?error=${errorParam}`, { replace: true });
    }
  }, [errorParam, navigate]);

  useEffect(() => {
    const timer = window.setTimeout(() => setTimedOut(true), SESSION_TIMEOUT_MS);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isPending) return;

    if (session) {
      const returnTo = sessionStorage.getItem("axios.auth.returnTo");
      sessionStorage.removeItem("axios.auth.returnTo");
      navigate(returnTo ?? ERouterPaths.PROFILE, { replace: true });
      return;
    }

    if (timedOut) {
      navigate(`${ERouterPaths.SIGNIN}?error=session`, { replace: true });
    }
  }, [isPending, session, timedOut, navigate]);

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/20 border-t-[#E0B84C]" />
        <p className="font-lato text-sm text-white/70">Finishing sign-in…</p>
      </div>
    </main>
  );
};

export default AuthCallbackPage;
