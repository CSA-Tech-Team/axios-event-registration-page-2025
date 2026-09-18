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
    <div className="brut-container pb-20 pt-10 md:pt-14">
      <header className="flex items-end gap-4 border-b-2 border-ink pb-6">
        {windowSize.width < 1024 ? (
          <button
            type="button"
            aria-label="Back to profile"
            onClick={() => reset()}
            className="mb-1 flex h-11 w-11 shrink-0 items-center justify-center border-2 border-ink bg-wcard text-ink shadow-brut-sm"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
        ) : (
          ""
        )}
        <div>
          <p className="eyebrow text-ink-2">Profile · Team requests</p>
          <h1 className="display-title registration mt-2">Invitations</h1>
        </div>
      </header>
      {invites.length != 0 ? (
        <ul className="mt-10 flex w-full flex-col gap-6">
          {invites.map((elt: any, idx: number) => (
            <li key={elt?.id ?? idx}>
              <InvitationCard data={elt} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="mx-auto mt-12 max-w-xl -rotate-[0.5deg] border-2 border-dashed border-ink bg-card px-6 py-8 text-center">
          <p className="font-note text-2xl text-ink">Inbox empty</p>
          <p className="mt-2 text-[15px] leading-relaxed text-ink-2">
            You have no invitations.
          </p>
        </div>
      )}
    </div>
  );
};
export default Invitation;
