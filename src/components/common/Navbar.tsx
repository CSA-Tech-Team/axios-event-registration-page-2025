import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  BedDouble,
  CalendarFold,
  ChevronDown,
  House,
  LogIn,
  LogOut,
  Mails,
  Trophy,
  UserRound,
  Users,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import BrandMark from "./BrandMark";
import { ERouterPaths } from "@/constants/enum";
import { useAuthStore } from "@/store/ApiStates";
import { useIsSignedIn } from "@/hooks/useIsSignedIn";
import { signOut } from "@/lib/auth-client";
import { SIGN_OUT_ERROR, SIGN_OUT_ERROR_TITLE } from "@/lib/auth-errors";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

/**
 * Sticky 52px terminal header (brutalist standard §5.1 / §10.8).
 * Active items get amber text plus a heavy underline, so state is never
 * carried by colour alone. Labels collapse to icons below `lg` (they do not
 * fit beside the wordmark before that) but stay available to assistive tech.
 * Below `sm` the wordmark doubles as the Home link, so five 44px targets plus
 * the mark still fit a 320px screen.
 */
const itemClass = (active: boolean) =>
  cn(
    "relative flex h-11 min-w-11 items-center justify-center gap-2 px-2 text-sm font-bold uppercase tracking-[0.08em] transition-colors duration-150 lg:px-3",
    "after:absolute after:inset-x-2 after:bottom-0 after:h-[3px] after:bg-term-fg after:transition-transform after:duration-150",
    active
      ? "text-term-fg after:scale-x-100"
      : "text-paper after:scale-x-0 hover:text-term-fg focus-visible:text-term-fg",
  );

const NavLabel = ({ children }: { children: React.ReactNode }) => (
  <span className="sr-only lg:not-sr-only">{children}</span>
);

const NavBar: React.FC = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { getIsProfileCompleted, clearTokens } = useAuthStore();
  const { user } = useAuthStore.getState();
  const [open, setOpen] = useState(false); // logout dialog
  const [isSigningOut, setIsSigningOut] = useState(false);
  const signedIn = useIsSignedIn() === true;
  const isAlumni = user?.role === "ALUMNI";

  const isEvents =
    pathname.startsWith(ERouterPaths.EVENTS) ||
    pathname === ERouterPaths.EVENTSCHEDULE;
  const isAlumniAccommodation =
    isAlumni && pathname === ERouterPaths.ACCOMODATION;
  const isProfile =
    pathname.startsWith(ERouterPaths.PROFILE) && !isAlumniAccommodation;

  // Invitations, teams and accommodation all need a completed profile first.
  const goGated = (path: ERouterPaths, what: string) => {
    if (getIsProfileCompleted()) {
      navigate(path);
    } else {
      toast({
        title: "Complete your profile",
        description: `Please complete your profile to access ${what}.`,
      });
      navigate(ERouterPaths.PROFILE);
    }
  };

  const goAlumniAccommodation = () => {
    // The store flag, not user.isProfileCompleted: completing the profile
    // updates the flag straight away, the cached user only on the next fetch.
    if (getIsProfileCompleted()) {
      navigate(ERouterPaths.ACCOMODATION);
    } else {
      toast({
        title: "Profile Incomplete",
        description: "Complete your profile before accessing accommodation.",
      });
    }
  };

  /**
   * Ends the session on the API first. The Google session is an httpOnly
   * cookie; clearing local state while it is still alive would just bounce the
   * person from /signin back to /profile. So local state only goes once the
   * server confirms.
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
    localStorage.clear();
    setIsSigningOut(false);
    setOpen(false);
    navigate(ERouterPaths.SIGNIN);
  };

  return (
    <header className="brut-inverse sticky top-0 z-40 h-header border-b-2 border-ink">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-2 focus:z-50 focus:bg-acc-2 focus:px-3 focus:py-2 focus:font-bold focus:text-ink"
      >
        Skip to content
      </a>
      <nav
        aria-label="Primary"
        className="brut-container flex h-full items-center justify-between gap-2"
      >
        <Link
          to={ERouterPaths.HOME}
          aria-label="Axios home"
          aria-current={pathname === ERouterPaths.HOME ? "page" : undefined}
          className="flex h-11 shrink-0 items-center"
        >
          <BrandMark />
        </Link>

        <ul className="flex items-center gap-0.5 sm:gap-1 lg:gap-2">
          <li className="hidden sm:block">
            <Link
              to={ERouterPaths.HOME}
              className={itemClass(pathname === ERouterPaths.HOME)}
              aria-current={pathname === ERouterPaths.HOME ? "page" : undefined}
            >
              <House className="h-5 w-5" aria-hidden="true" />
              <NavLabel>Home</NavLabel>
            </Link>
          </li>
          <li>
            <Link
              to={ERouterPaths.EVENTS}
              className={itemClass(isEvents)}
              aria-current={isEvents ? "page" : undefined}
            >
              <CalendarFold className="h-5 w-5" aria-hidden="true" />
              <NavLabel>Events</NavLabel>
            </Link>
          </li>
          <li>
            {isAlumni ? (
              <button
                type="button"
                onClick={goAlumniAccommodation}
                className={itemClass(isAlumniAccommodation)}
                aria-current={isAlumniAccommodation ? "page" : undefined}
              >
                <BedDouble className="h-5 w-5" aria-hidden="true" />
                <NavLabel>Accommodation</NavLabel>
              </button>
            ) : (
              <Link
                to={ERouterPaths.LEADERBOARD}
                className={itemClass(pathname === ERouterPaths.LEADERBOARD)}
                aria-current={
                  pathname === ERouterPaths.LEADERBOARD ? "page" : undefined
                }
              >
                <Trophy className="h-5 w-5" aria-hidden="true" />
                <NavLabel>Leaderboard</NavLabel>
              </Link>
            )}
          </li>
          <li>
            {isAlumni ? (
              <Link
                to={ERouterPaths.PROFILE}
                className={itemClass(isProfile)}
                aria-current={isProfile ? "page" : undefined}
              >
                <UserRound className="h-5 w-5" aria-hidden="true" />
                <NavLabel>Profile</NavLabel>
              </Link>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger
                  className={itemClass(isProfile)}
                  aria-current={isProfile ? "page" : undefined}
                >
                  <UserRound className="h-5 w-5" aria-hidden="true" />
                  <NavLabel>Profile</NavLabel>
                  <ChevronDown
                    className="hidden h-4 w-4 lg:block"
                    aria-hidden="true"
                  />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" sideOffset={8} className="w-56">
                  <DropdownMenuItem onSelect={() => navigate(ERouterPaths.PROFILE)}>
                    <UserRound className="h-4 w-4" aria-hidden="true" />
                    My profile
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onSelect={() => goGated(ERouterPaths.INVITATION, "invitations")}
                  >
                    <Mails className="h-4 w-4" aria-hidden="true" />
                    Invitations
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onSelect={() => goGated(ERouterPaths.TEAMS, "teams")}
                  >
                    <Users className="h-4 w-4" aria-hidden="true" />
                    Teams
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onSelect={() =>
                      goGated(ERouterPaths.ACCOMODATION, "accomodation")
                    }
                  >
                    <BedDouble className="h-4 w-4" aria-hidden="true" />
                    Accommodation
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </li>
          <li>
            {signedIn ? (
              <button
                type="button"
                onClick={() => setOpen(true)}
                className={itemClass(false)}
              >
                <LogOut className="h-5 w-5" aria-hidden="true" />
                <NavLabel>Logout</NavLabel>
              </button>
            ) : (
              <Link to={ERouterPaths.SIGNIN} className={itemClass(false)}>
                <LogIn className="h-5 w-5" aria-hidden="true" />
                <NavLabel>Sign in</NavLabel>
              </Link>
            )}
          </li>
        </ul>
      </nav>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Log out?</DialogTitle>
            <DialogDescription>
              You’ll need to sign in again to access your account.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-2">
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Stay signed in
            </Button>
            <Button
              variant="destructive"
              onClick={handleLogout}
              disabled={isSigningOut}
            >
              {isSigningOut ? "Logging out…" : "Log out"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </header>
  );
};

export default NavBar;
