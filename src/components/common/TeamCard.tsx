/* eslint-disable @typescript-eslint/no-explicit-any */
import { FC, useState } from "react";
import { Trash2, UserRound } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
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
          <pre className="mt-2 max-w-[340px] whitespace-pre-wrap border-2 border-ink bg-wcard p-3 font-mono text-xs">
            <code className="text-ink">
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
    <article className="relative flex h-full rotate-[0.5deg] flex-col border-2 border-ink bg-card p-5 text-ink shadow-brut-md transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:rotate-0">
      {/* Delete button - top right */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <button
            type="button"
            aria-label={`Delete team ${data?.name ?? ""}`}
            onClick={(e) => e.stopPropagation()} // 👈 Prevent triggering parent click
            className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center border-2 border-ink bg-wcard text-ink shadow-brut-sm transition-[transform,background-color,color] duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:bg-destructive hover:text-white"
          >
            <Trash2 size={18} aria-hidden="true" />
          </button>
        </DialogTrigger>
        <DialogContent onClick={(e) => e.stopPropagation()}>
          <DialogHeader>
            <DialogTitle>
              Are you sure you want to delete team "{data?.name}"?
            </DialogTitle>
          </DialogHeader>
          <DialogFooter className="mt-2">
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteTeamMutation.mutateAsync()}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Header */}
      <div className="mb-4 flex flex-col gap-3 pr-12">
        <h2 className="break-words font-display text-[clamp(28px,3.4vw,36px)] uppercase leading-[0.9]">
          {data?.name}
        </h2>
        {/* A team of one made for a migrated member who signed up for a team
            event without a team. They fill it by inviting people, or leave it
            and join another team. It becomes an ordinary team once it
            registers for the event. */}
        {data?.teamType === "ENROLLED" && (
          <div className="self-start -rotate-[1deg] border-2 border-ink bg-acc-2 px-2 py-1 text-[11px] font-extrabold uppercase tracking-[0.08em] text-ink shadow-brut-sm">
            Waiting for members · open this team to invite people
          </div>
        )}
      </div>

      {/* Profile + Details */}
      <div className="mb-4 flex items-center gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 border-ink bg-wcard">
          <UserRound className="h-7 w-7" aria-hidden="true" />
        </div>
        <dl className="flex min-w-0 flex-col gap-2 text-sm">
          <div className="grid grid-cols-[auto_1fr] items-baseline gap-2">
            <dt className="eyebrow text-ink-2">Team ID</dt>
            <dd className="truncate font-mono text-xs font-bold">{data?.id}</dd>
          </div>
          <div className="grid grid-cols-[auto_1fr] items-baseline gap-2">
            <dt className="eyebrow text-ink-2">Owner</dt>
            <dd className="truncate font-bold">
              {data?.members[0]?.profile?.firstName}
            </dd>
          </div>
        </dl>
      </div>

      {/* Members */}
      <div className="mt-auto border-t-2 border-dashed border-line pt-4">
        <span className="eyebrow mb-2 block text-ink-2">Members</span>
        <div className="flex flex-wrap gap-2">
          {data?.members?.slice(1).map((elt: any, idx: number) => (
            <div
              key={idx}
              className="border-2 border-ink bg-wcard px-2 py-1 text-sm font-semibold"
            >
              {elt?.profile?.firstName}
            </div>
          ))}
        </div>
      </div>
    </article>
  );
};

export default TeamCard;
