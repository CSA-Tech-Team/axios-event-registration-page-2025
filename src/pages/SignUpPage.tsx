import { SigninBubble } from "@/components/common/SigninBubble";
//import pillar from "../assets/loginComp.svg";
//import emblem from "@/assets/axiosEmblemGold.png";
import emblem from "@/assets/axiosemblem.png";
import Signup1 from "@/components/common/Signup1";
import Signup2 from "@/components/common/Signup2";
import Signup3 from "@/components/common/Signup3";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ERouterPaths } from "@/constants/enum";
import { useSearchParams } from "react-router-dom";
const SignUp = () => {
  const [searchParams] = useSearchParams();
  const [active, setActive] = useState(1);
  useEffect(() => {
    console.log(searchParams.get('referralCode'))
  }, []);
  return (
    <div className="w-full min-h-screen bg-[#171717] flex flex-col">
      {/* Top Section - Emblem */}
       <div className="flex flex-col items-center justify-start pt-8">
        <img
          src={emblem}
          alt="Emblem"
          className="h-40 w-40 opacity-100"
        />
        <h1 className="mt-4 max-[500px]:mb-3  mb-3 text-2xl sm:text-3xl font-bold text-[#EFAD8B]">
          SIGN UP
        </h1>
      </div>

      {/* Bottom Section - Signup Content */}
      <div className="flex flex-col w-full items-center justify-center text-white px-6">
        
        <div className="">
          <SigninBubble active={active} />
        </div>

        <div className="w-full flex justify-center max-[500px]:w-full sm:w-3/4 md:w-1/2 lg:w-2/5 mt-3 max-[500px]:mt-3">
        {active === 1 ? (
          <Signup1 setActive={setActive} />
        ) : active === 2 ? (
          <Signup2 setActive={setActive} />
        ) : (
          <Signup3
            setActive={setActive}
            referralCode={searchParams.get("referralCode")}
          />
        )}
        </div>

        <span className="flex gap-1 mt-2 mb-2 text-sm">
          Already have an account?
          <Link to={ERouterPaths.SIGNIN}>
            <div className="text-[#80466E] underline">Signin</div>
          </Link>
        </span>
      </div>
    </div>

  );
};

export default SignUp;
