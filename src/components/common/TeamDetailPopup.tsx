import { FC, useState } from "react";
import profileIcon from "@/assets/violetProfile.svg";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useAxios from "@/hooks/useAxios";
import { ApiPaths } from "@/constants/enum";
import { useToast } from "@/hooks/use-toast";
import { Trash2 } from "lucide-react";
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
  <div className="bg-gradient-to-br from-[#1f1f1f] to-[#2a2a2a] sm:rounded-xl shadow-xl p-6 flex flex-col lg:flex-row gap-8">

    {/* Left Section - Team Info */}
    <div className="w-full lg:w-1/3 flex flex-col gap-6">
      <div className="bg-[#352b46] rounded-xl p-4 shadow-lg">
        <h2 className="text-xl font-bold text-[#80466E] mb-4">Team Info</h2>
        <div className="space-y-4">
          <div>
            <label className="text-gray-400 text-sm">Team ID</label>
            <Input
              type="text"
              className="bg-[#1a1a1a] rounded-lg text-white mt-1"
              defaultValue={data.id}
              disabled
            />
          </div>
          <div>
            <label className="text-gray-400 text-sm">Team Name</label>
            <Input
              type="text"
              className="bg-[#1a1a1a] rounded-lg text-white mt-1"
              defaultValue={data.name}
              disabled
            />
          </div>
        </div>
      </div>
    </div>

    {/* Right Section - Invite + Members */}
    <div className="w-full lg:w-2/3 flex flex-col gap-8">

      {/* Invite Box - Highlighted */}
      {!data?.lock && (
        <div className="bg-[#352b46]   rounded-xl p-4 shadow-lg">
          <h2 className="text-2xl font-bold text-[#80466E] mb-4">Invite Members</h2>
          <form className="flex max-[400px]:flex-col  gap-3">
            <Input
              type="email"
              required
              placeholder="Enter email"
              value={invite}
              className="bg-[#1a1a1a] text-white flex-1 text-lg max-[500px]:text-sm rounded-lg px-4 py-2"
              onChange={(e) => setInvite(e.target.value)}
            />
            <Button
              className="bg-[#80466E] hover:bg-Violet px-8 py-2 text-lg max-[500px]:text-sm rounded-lg"
              type="submit"
              onClick={(e) => {
                e.preventDefault();
                sendInvite();
              }}
            >
              Invite
            </Button>
          </form>
        </div>
      )}

      {/* Pending Invites */}
      {!data?.lock && (
        <div>
          <h2 className="text-lg font-semibold text-gray-300 mb-3">Pending Invites</h2>
          {data?.pendingInvites && data?.pendingInvites.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
              {data.pendingInvites.map((elt: any, idx: number) => (
                <div
                  key={idx}
                  className="bg-[#232323] rounded-xl p-4 flex items-center gap-4 shadow-md"
                >
                  <img
                    src={profileIcon}
                    alt="Profile Icon"
                    className="w-12 h-12 rounded-full"
                  />
                  <div className="flex flex-col">
                    <span className="text-white text-sm">{elt?.email}</span>
                    <span className="text-xs text-yellow-500 font-semibold">
                      Pending
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 italic">No pending invites.</p>
          )}
        </div>
      )}

      {/* Active Members */}
      <div>
        <h2 className="text-lg font-semibold text-gray-300 mb-3">Active Members</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
          {data?.members.map((elt: any) => (
            <div className="bg-[#232323] rounded-xl p-4 flex items-center gap-4 shadow-md hover:shadow-lg transition">
              <img src={profileIcon} alt="Profile Icon" className="w-12 h-12 rounded-full" />
              <div className="flex flex-col flex-1">
                <div className="text-white font-medium text-sm">{elt?.email}</div>
                {elt?.email === data?.members[0]?.email ? (
                  <span className="text-xs text-[#80466E]">Owner</span>
                ) : (
                  <span className="text-xs text-green-400">Active</span>
                )}
              </div>
              {elt?.email !== getUser()?.email && (
                <button
                  onClick={() => removeUser(elt)}
                  className="text-red-400 hover:text-red-600"
                >
                  <Trash2 />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

};

export default TeamDetails;
