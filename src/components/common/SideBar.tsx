import { Mails } from "lucide-react";
import team from "@/assets/teams.svg";
import accomodation from "@/assets/accomodation.svg";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ERouterPaths } from "@/constants/enum";

const SideBar = () => {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState<number>(0);
  useEffect(() => {
    const loc = window.location.pathname;
    console.log(loc);
    if (loc == ERouterPaths.INVITATION) {
      setActiveIndex(1);
    } else if (loc == ERouterPaths.TEAMS) {
      setActiveIndex(2);
    } else if (loc == ERouterPaths.ACCOMODATION) {
      setActiveIndex(3);
    }
  }, [window.location.pathname]);
  const handleClick = (num: number) => {
    if (num == 1) {
      navigate(ERouterPaths.INVITATION);
    } else if (num == 2) {
      navigate(ERouterPaths.TEAMS);
    } else if (num == 3) {
      navigate(ERouterPaths.ACCOMODATION);
    }
  };
  return (
    <div className="text-white p-12 flex-wrap font-lato font-light flex lg:flex-col gap-6">
      <div
        className={`flex w-full items-center text-lg gap-4 ${
          activeIndex == 1 ? "bg-[#232323]" : ""
        } rounded-lg  lg:px-20  lg:p-4 p-2`}
        onClick={() => handleClick(1)}
      >
        <Mails className="w-6" />
        <span>Invitations</span>
      </div>
      <div
        className={`flex pr-20 lg:px-20 items-center text-lg gap-4 ${
          activeIndex == 2 ? "bg-[#232323]" : ""
        } rounded-lg lg:px-20 lg:p-4 p-2`}
        onClick={() => handleClick(2)}
      >
        <img src={team} alt="" className="w-6" />
        <span>Teams</span>
      </div>
      <div
        className={`flex  pr-20 lg:px-20 items-center text-lg gap-4 ${
          activeIndex == 3 ? "bg-[#232323]" : ""
        } rounded-lg lg:px-20 lg:p-4 p-2`}
        onClick={() => handleClick(3)}
      >
        <img src={accomodation} alt="" className="w-6" />
        <span>Accomodation</span>
      </div>
    </div>
  );
};

export default SideBar;
