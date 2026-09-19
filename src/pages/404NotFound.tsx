import { Button } from "@/components/ui/button";
import { ERouterPaths } from "@/constants/enum";
import { useNavigate } from "react-router-dom";
function Notfound() {
  const navigate = useNavigate();
  return (
    <main className="brut-container flex min-h-dvh flex-col justify-center py-16">
      <p
        aria-hidden="true"
        className="-rotate-[1.5deg] font-display text-[clamp(96px,24vw,220px)] leading-[0.85] text-acc [text-shadow:6px_6px_0_var(--ink)]"
      >
        404
      </p>
      <h1 className="display-title registration mt-6 max-w-3xl">
        Page not found
      </h1>
      <p className="mt-5 max-w-xl text-base leading-relaxed text-ink-2 md:text-lg">
        The page you are looking for might have moved or been deleted.
      </p>
      <div className="mt-8">
        <Button onClick={() => navigate(ERouterPaths.HOME)}>
          ▶ Back to home
        </Button>
      </div>
    </main>
  );
}
export default Notfound;
