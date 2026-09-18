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
    <article className="flex w-full flex-col items-start justify-between gap-6 border-2 border-ink bg-card p-5 text-ink shadow-brut-md md:flex-row md:items-center">
      {/* Left side - Request Info */}
      <div className="flex w-full flex-col md:w-2/3">
        <p className="eyebrow text-ink-2">Team invite</p>
        <h3 className="mt-1 text-xl font-bold">
          Request from {data?.team?.name}
        </h3>
        <div className="mt-1 flex items-center gap-2 text-sm">
          <span className="text-ink-2">By</span>
          <span className="font-semibold">{data?.invitedBy}</span>
        </div>
      </div>

      {/* Right side - Action Buttons */}
      <div className="flex w-full gap-4 md:w-auto md:justify-end">
        <Button className="flex-1 md:flex-none" onClick={() => handleSubmit(true)}>
          <Check className="h-4 w-4" aria-hidden="true" />
          Accept
        </Button>
        <Button
          variant="secondary"
          className="flex-1 md:flex-none"
          onClick={() => handleSubmit(false)}
        >
          <X className="h-4 w-4" aria-hidden="true" />
          Decline
        </Button>
      </div>
    </article>
  );
};

export default InvitationCard;
