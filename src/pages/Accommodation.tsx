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
  const {getAccommodation} = useAuthStore();
  const user = useAuthStore((state) => state.user);
  const reset = () => {
    navigate(ERouterPaths.PROFILE);
  };

  return (
    <div className="flex w-full flex-wrap justify-between h-full overflow-auto">
      <div className="w-full  lg:block">
        <div className="w-full  text-white pt-12 items-center align-middle">
          <div className="lg:p-12 p-6 text-3xl flex items-center gap-4">
            {windowSize.width < 1024 ? (
              <div className="text-white " onClick={() => reset()}>
                <ArrowLeft />
              </div>
            ) : (
              ""
            )}
            Accomodation
          </div>
          <div className="flex  flex-col items-center  w-full gap-4 lg:p-0 p-6 max-[500px]:px-2">
            {user?.role === "ALUMNI" ? <AlumniAccommodation /> : <AccommodationCard reset={reset} />}
          </div>
          {/*getAccommodation()&&<div className="flex mt-2 flex-col items-center  w-full gap-4 lg:p-0 p-6">
            <p className="w-1/2">
              To process your accommodation there is a caution
              deposit[Refundable]
              needs to paid upfront.
              For further details contact <br />
                Jonathan Cecil - Secretary{" "}
              <a href="tel:+917305540931" className="underline">
              +91 7305540931
              </a>
              <br />
                Govind Raghavendran- Accomodation Co-ordinator
              {" "}
              <a href="tel:+918925617246" className="underline">
              +91 8925617246
              </a>
            </p>
          </div>*/}
        </div>
      </div>

      {/* {windowSize.width < 1024 && (
        <div className="w-full h lg:block">
          <div className="w-full text-white pt-12 items-center align-middle">
            <div className="lg:p-12 p-6 text-3xl flex items-center gap-4">
              {windowSize.width < 1024 ? (
                <div className="text-white " onClick={() => reset()}>
                <ArrowLeft />
                </div>
              ) : (
                ""
              )}
              Accomodation
            </div>
            <div className="flex flex-col items-center w-full gap-4 lg:p-0 p-6">
              <AccommodationCard reset={() => reset()} />
            </div>
          </div>
        </div>
      )} */}
    </div>
  );
}

export default Accommodation;
