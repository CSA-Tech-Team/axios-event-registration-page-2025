import React, { useEffect, useState, useRef } from "react";
import profileIcon from "@/assets/profile.svg";
import {
  House,
  CalendarFold,
  LogOut,
  SquareArrowOutUpRightIcon,
} from "lucide-react";
import { Mails } from "lucide-react";
import { motion, AnimatePresence, easeOut } from "framer-motion";
import LeaderBoardIcon from "@/assets/leaderboard.svg";
import { useLocation, useNavigate } from "react-router-dom";
import { ERouterPaths } from "@/constants/enum";
import team from "@/assets/teams.svg";
import accomodation from "@/assets/accomodation.svg";
import useWindowDimensions from "@/hooks/useWindowDimension";
import { useAuthStore } from "@/store/ApiStates";
import { isAuthenticated } from "@/utils/common";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "@/hooks/use-toast";

const NavBar: React.FC = () => {
  const location = useLocation();
  const windowSize = useWindowDimensions();
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState<number>();
  const [showNavbar2, setShowNavbar2] = useState(false);
  const [profileIndex, setProfileIndex] = useState<number>(0);
  const [animateX, setAnimateX] = useState(0);
  const { getIsProfileCompleted } = useAuthStore();
  const { user } = useAuthStore.getState();

  const navRef = useRef<HTMLDivElement | null>(null);

  //
  useEffect(() => {
    const loc = location.pathname;
    if (loc == ERouterPaths.INVITATION) {
      setShowNavbar2(false);
      setProfileIndex(1);
    } else if (loc == ERouterPaths.TEAMS) {
      setShowNavbar2(false);
      setProfileIndex(2);
      setActiveIndex(2);
    } else if (loc == ERouterPaths.ACCOMODATION) {
      setShowNavbar2(false);
      setProfileIndex(3);
      setActiveIndex(2);
    } else if (loc == ERouterPaths.EVENTS) {
      setProfileIndex(0);
      setShowNavbar2(false);
      setActiveIndex(1);
    } else if (loc == ERouterPaths.HOME) {
      setShowNavbar2(false);
      setProfileIndex(0);
      setActiveIndex(0);
    } else if (loc.startsWith(ERouterPaths.PROFILE)) {
      setShowNavbar2(true);
      setActiveIndex(2);
    } else if (loc == ERouterPaths.LEADERBOARD) {
      setProfileIndex(0);
      setShowNavbar2(false);
      setActiveIndex(3);
    }
  }, [location.pathname]);

  // close secondary navbar when clicking outside or scrolling
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setShowNavbar2(false);
      }
    };

    const handleScroll = () => {
      setShowNavbar2(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);


  // Navbar 2
  const handleProfile = (num: number) => {
    if (num == 1) {
      setShowNavbar2(false);
      // navigate(
      //   getIsProfileCompleted() ? ERouterPaths.INVITATION : ERouterPaths.PROFILE
      // );
      if (getIsProfileCompleted()) {
        navigate(ERouterPaths.INVITATION);
      } else {
        toast ({
          title: "Complete your profile",
          description: "Please complete your profile to access invitations.",
        });
        navigate(ERouterPaths.PROFILE);
      }
    } else if (num == 2) {
      setShowNavbar2(false);
      // navigate(
      //   getIsProfileCompleted() ? ERouterPaths.TEAMS : ERouterPaths.PROFILE
      // );
      if (getIsProfileCompleted()) {
        navigate(ERouterPaths.TEAMS);
      } else {
        toast ({
          title: "Complete your profile",
          description: "Please complete your profile to access teams.",
        });
        navigate(ERouterPaths.PROFILE);
      }
    } else if (num == 3) {
      setShowNavbar2(false);
      if (getIsProfileCompleted()) {
        navigate(ERouterPaths.ACCOMODATION);
      }
      else {
        toast ({
          title: "Complete your profile",
          description: "Please complete your profile to access accomodation.",
        });
        navigate(ERouterPaths.PROFILE);
      }
    } else {
      setShowNavbar2(false);
      navigate(ERouterPaths.PROFILE);
    }
  };

  useEffect(() => {
    if (windowSize.width < 1024) {
      setAnimateX(-70);
    } else {
      setAnimateX(-25);
    }
  }, []);

  //Navbar 1
  const handleClick = (index: number): void => {
    // const loc = window.location.pathname;
    if (index == 1) {
      navigate(ERouterPaths.EVENTS);
    } else if (index == 0) {
      navigate(ERouterPaths.HOME);
    } else if (index == 2) {
      navigate(ERouterPaths.PROFILE);
    } else if (index == 3) {
      navigate(ERouterPaths.LEADERBOARD);
    } else if (index == 4) {
      navigate(ERouterPaths.SIGNIN);
    }
    setActiveIndex(index);
  };

  const { clearTokens } = useAuthStore();
  const handleLogout = () => {
    clearTokens();
    localStorage.clear();
    navigate(ERouterPaths.SIGNIN);
  };

  return (
    <div ref={navRef} className="relative flex justify-center  h-fit w-screen p-0 ">
      <div className="relative flex justify-center h-fit w-screen p-0">
        <div
          className="bg-[linear-gradient(to_right,#80466E,#2D1F44)] bg-[length:200%_100%] bg-right hover:bg-[linear-gradient(to_left,#80466E,#2D1F44)] hover:bg-left
             mx-5 rounded-xl flex justify-between items-center px-6 py-2 
             lg:w-1/2 sm:w-9/12 shadow-lg text-white relative 
             transition-all duration-700 ease-in-out"
        >
          {/* Left side */}
          <div className="flex gap-4">
            {/* Home */}
            <div
              className={`flex items-center gap-2 px-4 py-2 cursor-pointer transition-all
                ${activeIndex === 0 
                  ? "bg-gradient-to-r from-[#FF6F61] to-[#FFD166] text-[#1A1A1A] font-semibold rounded-xl shadow-lg"
                  : "text-white hover:bg-[#80466E]/60 rounded-xl"}`}
              onClick={() => handleClick(0)}
            >
              <House style={{ width: "20px", height: "20px" }} />
              <span className="hidden sm:hidden md:block text-sm font-medium">Home</span>
            </div>

            {/* Events */}
            <div
              className={`flex items-center gap-2 px-4 py-2 cursor-pointer transition-all
                ${activeIndex === 1 
                  ? "bg-gradient-to-r from-[#FF6F61] to-[#FFD166] text-[#1A1A1A] font-semibold rounded-xl shadow-lg"
                  : "text-white hover:bg-[#80466E]/60 rounded-xl"}`}
              onClick={() => handleClick(1)}
            >
              <CalendarFold style={{ width: "20px", height: "20px" }} />
              <span className="hidden sm:hidden md:block text-sm font-medium">Events</span>
            </div>
          </div>

          {/* Spacer for center profile */}
          <div className="w-16"></div>

          {/* Right side */}
          <div className="flex gap-4">
            {/* Leaderboard */}
            <div
              className={`flex items-center gap-2 px-4 py-2 cursor-pointer transition-all
                ${activeIndex === 3 
                  ? "bg-gradient-to-r from-[#FF6F61] to-[#FFD166] text-[#1A1A1A] font-semibold rounded-xl shadow-lg"
                  : "text-white hover:bg-[#80466E]/60 rounded-xl"}`}
              onClick={() => {
                if (user?.role !== "ALUMNI") {
                  handleClick(3);
                } else {
                  if (user?.isProfileCompleted) {
                    navigate(ERouterPaths.ACCOMODATION);
                  } else {
                    toast({
                      title: "Profile Incomplete",
                      description: "Complete your profile before accessing accommodation.",
                    });
                  }
                }
              }}
            > 
              {/*<img
                src={LeaderBoardIcon}
                alt="Leaderboard"
                className={`min-[400px]:w-[20px] min-[400px]:h-[20px] flex-shrink-0
                  ${activeIndex === 3 ? "invert" : "invert-0"}`}/>
              <span className="hidden sm:hidden md:block text-sm font-medium">Leaderboard</span>*/}
                  {user?.role === "ALUMNI" ? (
                    <>
                      <img
                        src={accomodation}
                        alt="Accomodation"
                        className={`min-[400px]:w-[20px] min-[400px]:h-[20px] flex-shrink-0
                          ${activeIndex === 3 ? "invert" : "invert-0"}`}
                      />
                      <span className="hidden sm:hidden md:block text-sm font-medium">
                        Accomodation
                      </span>
                    </>
                  ) : (
                    <>
                      <img
                        src={LeaderBoardIcon}
                        alt="Leaderboard"
                        className={`min-[400px]:w-[20px] min-[400px]:h-[20px] flex-shrink-0
                          ${activeIndex === 3 ? "invert" : "invert-0"}`}
                      />
                      <span className="hidden sm:hidden md:block text-sm font-medium">
                        Leaderboard
                      </span>
                    </>
                  )}
            </div>

            {/* Login/Logout */}
            <div
              className={`flex items-center gap-2 px-4 py-2 cursor-pointer transition-all
                ${activeIndex === 4 
                  ? "bg-gradient-to-r from-[#FF6F61] to-[#FFD166] text-[#1A1A1A] font-semibold rounded-xl shadow-lg"
                  : "text-white hover:bg-[#80466E]/60 rounded-xl"}`}
                onClick={() => { handleClick(4); handleLogout(); }}
            >
              {isAuthenticated() ? (
                <LogOut style={{ width: "20px", height: "20px" }} onClick={handleLogout} />
              ) : (
                <SquareArrowOutUpRightIcon style={{ width: "20px", height: "20px" }} />
              )}
              <span className="hidden sm:hidden md:block text-sm font-medium" onClick={handleLogout}>
                {isAuthenticated() ? "Logout" : "Signin"}
              </span>
            </div>
          </div>

          <div className="absolute lg:left-[47%] md:left-[46%] sm:left-[49%] max-[640px]:left-[50%] 
            transform -translate-x-1/2 -top-5 
            bg-gradient-to-r from-orange-400 via-red-500 to-pink-600 
            rounded-full p-2 sm:p-2.5 text-white z-10 cursor-pointer shadow-xl">
            
            <div
              className="rounded-full bg-[#80466E] p-3 sm:p-4 hover:bg-[#6A375A] transition-all"
              onClick={() => {
                handleClick(2);
                setProfileIndex(0);
                setShowNavbar2(!showNavbar2);
              }}
            >
              {profileIndex == 0 ? (
                <img src={profileIcon} alt="" style={{ width: "24px", height: "24px" }} />
              ) : profileIndex == 1 ? (
                <Mails className="w-6 h-6" />
              ) : profileIndex == 2 ? (
                <img src={team} alt="" style={{ width: "24px", height: "24px" }} />
              ) : (
                <img src={accomodation} alt="" style={{ width: "24px", height: "24px" }} />
              )}
            </div>
          </div>
        </div>        
      </div>
      
      {user?.role !== "ALUMNI" && (
      <AnimatePresence>
        {showNavbar2 && (
          <div>
              <>
                <motion.div
                  onClick={() => handleProfile(profileIndex == 1 ? 0 : 1)}
                  key="invitations"
                  animate={{ x: animateX, y: 0 }}
                  initial={{ x: 45, y: 50 }}
                  exit={{ x: 45, y: 50 }}
                  transition={{ ease: easeOut, duration: 0.25 }}
                  className="absolute text-white flex items-center justify-center left-[calc(50%-35px)]  lg:left-[calc(45%-15px)] transform -translate-x-1/2 -top-14 w-12 p-4 bg-[#171717] outline outline-white outline-1 rounded-full hover:cursor-pointer"
                >
                  {profileIndex == 1 ? (
                    <img src={profileIcon} alt="" className="w-5 h-5" />
                  ) : (
                    <TooltipProvider>
                      <Tooltip open={true}>
                        <TooltipTrigger>
                          <Mails className="w-5 h-5" />
                        </TooltipTrigger>
                        <TooltipContent className="bg-[#2D1F44]">
                          <p className="text-[0.7rem]">Invites</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </motion.div>
                <motion.div
                  onClick={() => handleProfile(profileIndex == 2 ? 0 : 2)}
                  key="teams"
                  animate={{ x: animateX, y: 0 }}
                  initial={{ x: -25, y: 100 }}
                  exit={{ x: -25, y: 100 }}
                  transition={{ ease: easeOut, duration: 0.25 }}
                  className="absolute flex  left-[calc(50%+45px)]  lg:left-[calc(50%)]  -top-20 w-12 p-4 bg-[#171717] outline outline-white outline-1 rounded-full hover:cursor-pointer"
                >
                  {profileIndex == 2 ? (
                    <img src={profileIcon} alt="" className="w-5 h-5" />
                  ) : (
                    <TooltipProvider>
                      <Tooltip open={true}>
                        <TooltipTrigger>
                          <img src={team} alt="" className="w-5" />
                        </TooltipTrigger>
                        <TooltipContent className="bg-[#2D1F44]">
                          <p className="text-[0.6rem]">Teams</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </motion.div>
              </>
            <motion.div
              onClick={() => handleProfile(profileIndex == 3 ? 0 : 3)}
              key="accomodation"
              animate={{ x: animateX, y: 0 }}
              initial={{ x: -90, y: 50 }}
              exit={{ x: -90, y: 50 }}
              transition={{ ease: easeOut, duration: 0.25 }}
              className="absolute flex left-[calc(50%+120px)] lg:left-[calc(55%+15px)] transform -translate-x-1/2 -top-14 w-12 p-4  bg-[#171717] outline outline-white outline-1 rounded-full hover:cursor-pointer"
            >
              {profileIndex == 3 ? (
                <img src={profileIcon} alt="" className="w-5 h-5" />
              ) : (
                <TooltipProvider>
                  <Tooltip open={true}>
                    <TooltipTrigger>
                      <img src={accomodation} alt="" className="w-5" />
                    </TooltipTrigger>
                    <TooltipContent className="bg-[#2D1F44]">
                      <p className="text-[0.7rem]">Accomodation</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      )}
    </div>
  );
};

export default NavBar;



