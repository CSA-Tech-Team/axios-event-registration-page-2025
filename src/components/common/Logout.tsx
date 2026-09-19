import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { ERouterPaths } from "@/constants/enum";
import { toast } from "@/hooks/use-toast";
import { signOut } from "@/lib/auth-client";
import { SIGN_OUT_ERROR, SIGN_OUT_ERROR_TITLE } from "@/lib/auth-errors";
import { useAuthStore } from "@/store/ApiStates";
import { Button } from "../ui/button";

function Logout() {
  const navigate = useNavigate();
  const { clearTokens } = useAuthStore();
  const [isSigningOut, setIsSigningOut] = useState(false);

  /**
   * Clears the server session and the cached bearer token, then the local
   * store. Local state is only dropped once the server confirms - otherwise
   * the still-live session would bounce the user straight back from /signin.
   */
  const handleLogout = async () => {
    if (isSigningOut) return;
    setIsSigningOut(true);
    try {
      await signOut();
    } catch (err) {
      console.error("Sign-out failed", err);
      toast({
        title: SIGN_OUT_ERROR_TITLE,
        description: SIGN_OUT_ERROR,
        variant: "destructive",
      });
      setIsSigningOut(false);
      return;
    }
    clearTokens();
    navigate(ERouterPaths.SIGNIN, { replace: true });
  };

  return (
    <main className="flex flex-col items-center w-full   gap-4">
      <Button
        onClick={handleLogout}
        disabled={isSigningOut}
        className="w-full lg:-1/2  bg-[#C02727] p-6  rounded-2xl"
      >
        {isSigningOut ? "Logging out…" : "Logout"}
      </Button>
      <div className=" flex w-full text-white gap-8 text-sm">
        <div className="w-1/2 justify-end flex">Any Incovenience?</div>
        <div className="w-1/2 font-bold  flex">Report</div>
      </div>
      <div className=" flex w-full text-white gap-8 text-sm">
        <div className="w-1/2 justify-end flex">Issue in finding things?</div>
        <div className="w-1/2 font-bold  flex">Get help</div>
      </div>
    </main>
  );
}

export default Logout;
