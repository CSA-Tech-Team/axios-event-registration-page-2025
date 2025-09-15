/* eslint-disable @typescript-eslint/no-explicit-any */
import profileIcon from "@/assets/violetProfile.svg";
import { FC, useState } from "react";
import { Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useAxios from "@/hooks/useAxios";
import { ApiPaths } from "@/constants/enum";
import { toast } from "@/hooks/use-toast";

interface TeamCardProps {
  data: any;
}

const TeamCard: FC<TeamCardProps> = ({ data }) => {
  const [open, setOpen] = useState(false);
  const { deleteWithAuth } = useAxios();
  const queryClient = useQueryClient();

  const deleteTeamMutation = useMutation({
    mutationFn: async () => {
      return await deleteWithAuth(`${ApiPaths.TEAM}/${data.id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries("teams" as any);
      queryClient.invalidateQueries("ownedTeams" as any);
      setOpen(false);
      toast({
        title: "Success",
        description: (
          <pre className="mt-2 w-[340px] rounded-lg bg-white p-4">
            <code className="text-black">
              Team {data?.name} deleted successfully
            </code>
          </pre>
        ),
      });
    },
    onError: (error: any) => {
      toast({
        title: "Uh oh! Something went wrong.",
        description: error?.response?.data?.message ?? "Failed to delete team",
      });
    },
  });

  return (
    <div className="bg-gradient-to-br from-[#1f1f1f] to-[#2a2a2a] rounded-2xl p-6 shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 flex flex-col justify-between relative">
      {/* Delete button - top right */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <button
            onClick={(e) => e.stopPropagation()} // 👈 Prevent triggering parent click
            className="absolute top-3 right-3 p-2 rounded-full hover:bg-red-500/20 text-red-500 transition"
          >
            <Trash2 size={18} />
          </button>
        </DialogTrigger>
        <DialogContent className="bg-[#121212] text-white" onClick={(e) => e.stopPropagation()}>
          <DialogHeader>
            <DialogTitle>
              Are you sure you want to delete team "{data?.name}"?
            </DialogTitle>
          </DialogHeader>
          <div className="flex gap-4 mt-4 justify-end">
            <Button variant="outline" className="text-black" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              className="bg-red-600 hover:bg-red-700"
              onClick={() => deleteTeamMutation.mutateAsync()}
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="text-2xl font-extrabold text-violet-400 tracking-wide">
          {data?.name}
        </div>
      </div>

      {/* Profile + Details */}
      <div className="flex items-center gap-4 mb-4">
        <div className="w-14 h-14 rounded-full overflow-hidden shadow">
          <img
            src={profileIcon}
            alt="Profile Icon"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex flex-col gap-2 text-sm text-gray-300">
          <div className="grid grid-cols-2 gap-2">
            <span className="font-medium text-gray-400">Team ID:</span>
            <span className="font-semibold text-white">{data?.id}</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <span className="font-medium text-gray-400">Owner:</span>
            <span className="font-semibold text-violet-300">
              {data?.members[0]?.profile?.firstName}
            </span>
          </div>
        </div>
      </div>

      {/* Members */}
      <div>
        <span className="font-medium text-gray-400 block mb-2">Members:</span>
        <div className="flex flex-wrap gap-2">
          {data?.members?.slice(1).map((elt: any, idx: number) => (
            <div
              key={idx}
              className="px-2 py-1 rounded-md bg-violet-700/30 text-violet-200 text-sm font-medium border border-violet-500/30"
            >
              {elt?.profile?.firstName}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TeamCard;
