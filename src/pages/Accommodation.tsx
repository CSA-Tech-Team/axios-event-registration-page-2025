import AccommodationCard from "@/components/common/AccommodationCard.tsx";
import AlumniAccommodation from "@/components/common/AlumniAccomodation.tsx";
import useWindowDimensions from "@/hooks/useWindowDimension.ts";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ERouterPaths } from "@/constants/enum";
import { useAuthStore } from "@/store/ApiStates";

function Accommodation() {
  const windowSize = useWindowDimensions();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const reset = () => {
    navigate(ERouterPaths.PROFILE);
  };

  return (
    <div className="brut-container pb-20 pt-10 md:pt-14">
      <header className="flex items-end gap-4 border-b-2 border-ink pb-6">
        {windowSize.width < 1024 && (
          <button
            type="button"
            aria-label="Back to profile"
            onClick={() => reset()}
            className="mb-1 flex h-11 w-11 shrink-0 items-center justify-center border-2 border-ink bg-wcard shadow-brut-sm"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
        )}
        <div>
          <p className="eyebrow text-ink-2">Axios · Stay</p>
          <h1 className="display-title registration mt-2">Accommodation</h1>
        </div>
      </header>
      <div className="mt-10 flex w-full flex-col items-start gap-4">
        {user?.role === "ALUMNI" ? <AlumniAccommodation /> : <AccommodationCard reset={reset} />}
      </div>
    </div>
  );
}

export default Accommodation;
