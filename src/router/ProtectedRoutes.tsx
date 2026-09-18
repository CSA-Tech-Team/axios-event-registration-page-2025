import { ApiPaths, ERouterPaths } from "@/constants/enum";
import useAxios from "@/hooks/useAxios";
import { useAuthStore } from "@/store/ApiStates";
import { useSession } from "@/lib/auth-client";
import { isAuthenticated } from "@/utils/common";
import { useQuery } from "@tanstack/react-query";
import { ReactNode } from "react";
import { Navigate } from "react-router-dom";

/**
 * Signed in means "the API says there is a session", not "a token happens to
 * be in localStorage".
 *
 * With Google the session normally lives in an httpOnly cookie and there is no
 * bearer token to find, so the old localStorage-only check reported false for
 * a perfectly valid session and bounced people straight back to /signin. The
 * stored token is still honoured, for the cookie-less fallback and for
 * sessions predating the migration.
 *
 * Returns `null` while the session is still resolving, so a guard renders
 * nothing rather than redirecting on a not-yet-known answer.
 */
function useIsSignedIn(): boolean | null {
  const { data: session, isPending } = useSession();
  if (session) return true;
  if (isAuthenticated()) return true;
  return isPending ? null : false;
}

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const {setOwnedTeams,setTeams} = useAuthStore();
  const { getWithAuth } = useAxios();

  useQuery({
    queryFn: async () => {
      const response: any = await getWithAuth(ApiPaths.TEAM);
      console.log(response?.data);
      setTeams(response?.data);
      return response?.data;
    },
    queryKey: ["teams"],
  });

  useQuery({
    queryFn: async () => {
      const response: any = await getWithAuth(ApiPaths.TEAM + "?owned=true");
      setOwnedTeams(response?.data);
      console.log(response?.data);
      return response?.data;
    },
    queryKey: ["ownedTeams"],
  });

  const signedIn = useIsSignedIn();

  if (signedIn === null) return null; // still resolving
  return signedIn ? <>{children}</> : <Navigate to={ERouterPaths.SIGNIN} />;
};

export const LoginProtectedRoute = ({ children }: { children: ReactNode }) => {
  const signedIn = useIsSignedIn();

  if (signedIn === null) return null; // still resolving
  return signedIn ? <Navigate to={ERouterPaths.PROFILE} /> : children;
};

export default ProtectedRoute;
