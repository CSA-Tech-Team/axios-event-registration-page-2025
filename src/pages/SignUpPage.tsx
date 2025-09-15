import { SigninBubble } from "@/components/common/SigninBubble";
import pillar from "../assets/loginComp.svg";

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
    <div className="lg:w-full lg:h-screen  justify-between bg-[#171717] flex  lg:bg-none">
      <div>
        <img
          src={pillar}
          alt=""
          className="absolute top-[40%] lg:relative opacity-40 lg:opacity-100 lg:top-0 lg:py-12 lg:h-full h-3/5 z-10 lg:block"
        />
      </div>
      <div className="lg:w-1/2 w-full z-30">
        <div className="flex w-full flex-col items-center lg:justify-center h-screen  text-white">
          <div className="flex lg:justify-center justify-start w-full pt-12 px-12 font-normal font-montserrat text-primaryText text-4xl">
            <span>SIGN UP</span>
          </div>
          <div className="mt-6">
            <SigninBubble active={active} />
          </div>
            {active == 1 ? (
              <Signup1 setActive={setActive} />
            ) : active == 2 ? (
              <Signup2 setActive={setActive} />
            ) : (
              <Signup3 setActive={setActive} referralCode={searchParams.get('referralCode')}/>
            )}
            <span className="flex gap-1">
            Already have an account?
            <Link to={ERouterPaths.SIGNIN}>
              <div className="text-red-500 underline">Signin</div>
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
