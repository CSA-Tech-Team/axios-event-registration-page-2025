/* eslint-disable @typescript-eslint/no-explicit-any */
import InvitationCard from "@/components/common/InvitationCard";
import useWindowDimensions from "@/hooks/useWindowDimension";
import { useNavigate } from "react-router-dom";
import { ApiPaths, ERouterPaths } from "@/constants/enum";
import { ArrowLeft } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import useAxios from "@/hooks/useAxios";
import { useState } from "react";
const Invitation = () => {
  const windowSize = useWindowDimensions();
  const navigate = useNavigate();
  const reset = () => {
    navigate(ERouterPaths.PROFILE);
  };
  const [invites, setInvite] = useState([]);
  const { getWithAuth } = useAxios();
  useQuery({
    queryFn: async () => {
      const response = await getWithAuth(ApiPaths.TEAM_INVITE);
      console.log(response);
      setInvite(response?.data as any);
      return response?.data;
    },
    queryKey: ["team-invite"],
  });

  return (
    <div className="w-full ">
      <div className="w-full lg:block">
        <div className="w-full text-white pt-12">
          <div className="lg:p-12 p-6 text-3xl flex items-center gap-4">
            {windowSize.width < 1024 ? (
              <div className="text-white " onClick={() => reset()}>
                <ArrowLeft />
                {/* <img src={back} alt="" className="w-4" /> */}
              </div>
            ) : (
              ""
            )}
            Invitations
          </div>
          {invites.length != 0 ? (
            <div className="flex flex-col items-center  w-full gap-4 lg:px-12 p-6">
              {invites.map((elt: any) => (
                <InvitationCard data={elt} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col p-3 align-middle items-center w-full justify-between rounded-3xl font-medium text-gray-400 md:px-12 px-6">
              You have no invitations.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default Invitation;
