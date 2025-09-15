/* eslint-disable @typescript-eslint/no-explicit-any */
import profileIcon from "@/assets/violetProfile.svg";
import { FC, useEffect } from "react";
import { UserRoundPen, Copy } from "lucide-react";
import { useAuthStore } from "@/store/ApiStates";

interface ProfileCardProps {
  setShowEdit: any;
}

const ProfileCard: FC<ProfileCardProps> = ({ setShowEdit }) => {
  const { getUser } = useAuthStore();
  const user: any = getUser();
  useEffect(() => {
    console.log(user);
  }, []);
  return (
    <div className="w-full flex flex-col gap-4 items-center md:p-5 md:px-8">
      <div className="flex flex-col items-center md:gap-4">
        <div className="">
          <img src={profileIcon} alt="" className="w-24 " />
        </div>
        <div className="mx-5 flex items-center w-full gap-4 justify-center truncate text-center text-2xl text-white font-semibold">
          <span>{user?.id}</span>
          <div
            onClick={() => {
              setShowEdit();
            }}
          >
            <UserRoundPen />
          </div>
        </div>
      </div>
      <div className="flex text-sm md:text-md md:w-full w-2/3  flex-col items-center lg:items-start gap-2 text-white">
        <div className="flex lg:w-full gap-12 md:w-1/2 w-full justify-center">
          <div className="w-1/2 flex justify-end">Firstname</div>
          <div className="w-1/2 truncate">{user?.id}</div>
        </div>
        <div className="flex lg:w-full gap-12 md:w-1/2 w-full justify-center">
          <div className="w-1/2 flex justify-end">Gender</div>
          <div className="w-1/2 truncate">{user?.gender}</div>
        </div>
        <div className="flex lg:w-full gap-12 md:w-1/2 w-full justify-center">
          <div className="w-1/2 flex justify-end">Email</div>
          <div className="w-1/2 truncate">{user?.email}</div>
        </div>
        <div className="flex lg:w-full gap-12 md:w-1/2 w-full   justify-center">
          <div className="w-1/2 flex justify-end">Phone</div>
          <div className="w-1/2 truncate">{user?.phoneNumber}</div>
        </div>
        <div className="flex lg:w-full gap-12 md:w-1/2 w-full  justify-center">
          <div className="w-1/2 flex justify-end">College</div>
          <div className="w-1/2 truncate">XXX College</div>
        </div>
        <div className="flex lg:w-full gap-12 md:w-1/2 w-full  justify-center">
          <div className="w-1/2 flex justify-end">Referral Code</div>
          <div className="w-1/2 items-center truncate flex">
            <span>{user?.referralCode}</span>
            <div className="w-2">
              <Copy />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
