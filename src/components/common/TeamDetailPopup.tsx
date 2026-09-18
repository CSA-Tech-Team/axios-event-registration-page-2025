import { FC, ReactNode, useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useAxios from "@/hooks/useAxios";
import { ApiPaths } from "@/constants/enum";
import { useToast } from "@/hooks/use-toast";
import { Trash2, UserRound } from "lucide-react";
import { useAuthStore } from "@/store/ApiStates";

interface TeamDetailPopupProps {
  reset: any;
  data: any;
}

const TeamDetails: FC<TeamDetailPopupProps> = ({ data }) => {
  const [invite, setInvite] = useState("");
  const { getUser } = useAuthStore();
  const queryClient = useQueryClient();
  const id = data?.id;
  const { postWithAuth, deleteWithAuth } = useAxios();
  const { toast } = useToast();

  const handleInviteMutation = useMutation({
    mutationFn: async (email: string) => {
      const response = await postWithAuth(ApiPaths.TEAM + "/" + id + "/invite", {
        email,
      });
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries("teams" as any);
      setInvite(""); // clear input after send
      toast({
        title: "Success",
        description: "Invite sent successfully",
      });
    },
    onError: (error) => {
      toast({ title: "Error", description: error?.response?.data?.message });
      console.log(error);
    },
  });

  const removeMemberMutation = useMutation({
    mutationFn: async (memberId) => {
      const response = await deleteWithAuth(ApiPaths.TEAM + "/" + id + "/member", {
        memberId,
      });
      toast({ title: "Member removed successfully" });
      return response;
    },
    onError: (error: any) => {
      toast({ title: error?.response?.data?.message });
    },
  });

  const removeUser = (user: any) => {
    removeMemberMutation.mutateAsync(user?.id);
  };

  const sendInvite = () => {
    if (!invite.trim()) return;
    handleInviteMutation.mutateAsync(invite);
  };

  return (
    <div className="flex flex-col gap-10 lg:flex-row">
      {/* Left Section - Team Info */}
      <div className="flex w-full flex-col gap-6 lg:w-1/3">
        <section className="brut-card">
          <h2 className="font-section text-2xl font-extrabold uppercase leading-none tracking-[-0.02em]">
            Team Info
          </h2>
          <div className="mt-5 space-y-4">
            <div>
              <Label htmlFor="team-id">Team ID</Label>
              <Input
                id="team-id"
                type="text"
                className="mt-2 font-mono text-sm"
                defaultValue={data.id}
                disabled
              />
            </div>
            <div>
              <Label htmlFor="team-name-detail">Team Name</Label>
              <Input
                id="team-name-detail"
                type="text"
                className="mt-2"
                defaultValue={data.name}
                disabled
              />
            </div>
          </div>
        </section>
      </div>

      {/* Right Section - Invite + Members */}
      <div className="flex w-full flex-col gap-10 lg:w-2/3">
        {/* Invite Box - Highlighted */}
        {!data?.lock && (
          <section className="brut-card">
            <h2 className="font-section text-2xl font-extrabold uppercase leading-none tracking-[-0.02em]">
              Invite Members
            </h2>
            <form className="mt-5 flex gap-3 max-[400px]:flex-col">
              <Input
                type="email"
                required
                aria-label="Email to invite"
                placeholder="Enter email"
                value={invite}
                className="flex-1"
                onChange={(e) => setInvite(e.target.value)}
              />
              <Button
                type="submit"
                onClick={(e) => {
                  e.preventDefault();
                  sendInvite();
                }}
              >
                Invite
              </Button>
            </form>
          </section>
        )}

        {/* Pending Invites */}
        {!data?.lock && (
          <section>
            <h2 className="eyebrow mb-3 border-b-2 border-ink pb-2 text-ink">
              Pending Invites
            </h2>
            {data?.pendingInvites && data?.pendingInvites.length > 0 ? (
              <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {data.pendingInvites.map((elt: any, idx: number) => (
                  <li
                    key={idx}
                    className="flex items-center gap-4 border-2 border-dashed border-ink bg-wcard p-4"
                  >
                    <MemberAvatar />
                    <div className="flex min-w-0 flex-col gap-1">
                      <span className="truncate text-sm font-semibold">
                        {elt?.email}
                      </span>
                      <StatusStamp className="bg-acc-2">Pending</StatusStamp>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-ink-2">No pending invites.</p>
            )}
          </section>
        )}

        {/* Active Members */}
        <section>
          <h2 className="eyebrow mb-3 border-b-2 border-ink pb-2 text-ink">
            Active Members
          </h2>
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {data?.members.map((elt: any) => (
              <li
                key={elt?.id ?? elt?.email}
                className="flex items-center gap-4 border-2 border-ink bg-card p-4 shadow-brut-sm"
              >
                <MemberAvatar />
                <div className="flex min-w-0 flex-1 flex-col gap-1">
                  <div className="truncate text-sm font-semibold">
                    {elt?.email}
                  </div>
                  {elt?.email === data?.members[0]?.email ? (
                    <StatusStamp className="bg-ink text-paper">Owner</StatusStamp>
                  ) : (
                    <StatusStamp className="bg-wcard">Active</StatusStamp>
                  )}
                </div>
                {elt?.email !== getUser()?.email && (
                  <button
                    type="button"
                    aria-label={`Remove ${elt?.email ?? "member"}`}
                    onClick={() => removeUser(elt)}
                    className="flex h-10 w-10 shrink-0 items-center justify-center border-2 border-ink bg-wcard text-ink shadow-brut-sm transition-[transform,background-color,color] duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:bg-destructive hover:text-white"
                  >
                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                  </button>
                )}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
};

const MemberAvatar = () => (
  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-ink bg-wcard">
    <UserRound className="h-6 w-6" aria-hidden="true" />
  </div>
);

const StatusStamp = ({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) => (
  <span
    className={`self-start border-2 border-ink px-1.5 py-0.5 font-mono text-[11px] font-bold uppercase tracking-[0.06em] ${className ?? ""}`}
  >
    {children}
  </span>
);

export default TeamDetails;
