/* eslint-disable @typescript-eslint/no-explicit-any */
import { ApiPaths } from "@/constants/enum";
import { Button } from "../ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { X, Check } from "lucide-react";
import { FC } from "react";
import useAxios from "@/hooks/useAxios";
import { useToast } from "@/hooks/use-toast";
interface InvitationCardProps {
  data: any;
}

const InvitationCard: FC<InvitationCardProps> = ({ data }) => {
  const { putWithAuth } = useAxios();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const inviteResponseMutation = useMutation({
    mutationFn: async (bool: boolean) => {
      const response = await putWithAuth(
        ApiPaths.TEAM + "/" + data?.team?.id + ApiPaths.TEAM_INVITE_PROCESS,
        { status: bool ? "ACCEPTED" : "REJECTED" }
      );
      console.log(response);
      return response?.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries("team-invite" as any);
      toast({
        title: "Success",
        description: "Invite successfully" + data ? "Accepted" : "Rejected",
      });
    },
  });

  const handleSubmit = (bool: boolean) => {
    inviteResponseMutation.mutateAsync(bool);
  };
  return (
<div className="flex flex-col md:flex-row items-center justify-between gap-6 w-full p-6 rounded-2xl bg-gradient-to-br from-[#1f1f1f] to-[#2a2a2a] shadow-xl border border-violet-700/30 hover:border-violet-500/50 transition duration-300">
  {/* Left side - Request Info */}
  <div className="flex flex-col md:w-2/3 w-full">
    <h3 className="text-lg md:text-xl font-semibold text-[#80466E] mb-1">
      Request from {data?.team?.name}
    </h3>
    <div className="flex items-center gap-2 text-sm md:text-base text-gray-300">
      <span className="opacity-70">By</span>
      <span className="font-medium text-white">{data?.invitedBy}</span>
    </div>
  </div>

  {/* Right side - Action Buttons */}
  <div className="flex md:w-1/3 w-full gap-4 justify-end">
    {/* Accept Button */}
    <Button
      className="flex-1 bg-gradient-to-r from-violet-500 via-violet-600 to-purple-700 text-white rounded-xl py-3 font-semibold shadow-md hover:shadow-lg hover:scale-105 transition duration-300"
      onClick={() => handleSubmit(true)}
    >
      <Check className="w-4 mr-2" />
      Accept
    </Button>

    {/* Decline Button */}
    <Button
      className="flex-1 bg-[#1a1a1a] border border-gray-500/40 text-gray-300 rounded-xl py-3 font-semibold hover:bg-[#2a2a2a] hover:text-red-400 transition duration-300"
      onClick={() => handleSubmit(false)}
    >
      <X className="w-4 mr-2" />
      Decline
    </Button>
  </div>
</div>

  );
};

export default InvitationCard;
