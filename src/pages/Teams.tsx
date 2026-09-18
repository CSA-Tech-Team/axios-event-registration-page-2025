/* eslint-disable @typescript-eslint/no-explicit-any */
import TeamCard from "@/components/common/TeamCard";
import { ApiPaths, ERouterPaths } from "@/constants/enum";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import TeamDetails from "@/components/common/TeamDetailPopup";
import Discard from "@/components/common/Discard";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
  DialogHeader,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useAxios from "@/hooks/useAxios";
import { toast } from "@/hooks/use-toast";
import { useAuthStore } from "@/store/ApiStates";
import UnplacedEvents from "@/components/common/UnplacedEvents";

const Teams = () => {
  const [showDiscard, setShowDiscard] = useState(false);
  const navigate = useNavigate();
  const [name, setTeamName] = useState("");
  const { postWithAuth } = useAxios();
  const [showTeamDetails, setShowTeamDetails] = useState(false);
  const [team, setTeam] = useState<object>();
  const { getTeams } = useAuthStore();
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const reset = () => {
    if (showTeamDetails == false) {
      navigate(ERouterPaths.PROFILE);
    } else {
      setShowTeamDetails(false);
    }
  };

  const {user} = useAuthStore.getState();


  const teamCreateMutation = useMutation({
    mutationFn: async () => {
      const response = await postWithAuth(ApiPaths.TEAM, { name });
      console.log(response);
      return response;
    },
    onSuccess: async () => {
      queryClient.invalidateQueries("teams" as any);
      
      setOpen(false);
      queryClient.invalidateQueries("ownedTeams" as any);
      toast({
        title: "Success",
        description: (
          <pre className="mt-2 max-w-[340px] whitespace-pre-wrap border-2 border-ink bg-wcard p-3 font-mono text-xs">
            <code className="text-ink">Team {name} created successfully and register any event with this team.</code>
          </pre>
        ),
      });
    },
    onError: async (error: any) => {
      toast({
        title: "Uh oh! Something went wrong.",
        description: error.response.data.message,
      });
    },
  });
 
  return (
    <div className="brut-container pb-20 pt-10 md:pt-14">
      <header className="flex flex-col items-start justify-between gap-6 border-b-2 border-ink pb-6 sm:flex-row sm:items-end">
        <div className="flex items-end gap-4">
          <button
            type="button"
            aria-label="Back"
            onClick={() => reset()}
            className="mb-1 flex h-11 w-11 shrink-0 items-center justify-center border-2 border-ink bg-wcard text-ink shadow-brut-sm transition-transform duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <p className="eyebrow text-ink-2">Profile · Teams</p>
            <h1 className="display-title registration mt-2">
              {showTeamDetails ? "Teams Details" : "Team"}
            </h1>
          </div>
        </div>
        {!showTeamDetails && user != null && user?.role != "ALUMNI" ? (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>Create</Button>
            </DialogTrigger>

            <DialogContent>
              <DialogHeader>
                <DialogTitle>Enter Team Name</DialogTitle>
              </DialogHeader>
              <form
                className="flex flex-col gap-4 sm:flex-row sm:items-end"
                onSubmit={(e) => {
                  e.preventDefault();
                  teamCreateMutation.mutateAsync();
                }}
              >
                <div className="flex-1">
                  <Label htmlFor="team-name">Team name</Label>
                  <Input
                    id="team-name"
                    type="text"
                    className="mt-2"
                    required
                    onChange={(e) => setTeamName(e.target.value)}
                  />
                </div>
                <Button type="submit">Create</Button>
              </form>
            </DialogContent>
          </Dialog>
        ) : (
          ""
        )}
      </header>

      {showTeamDetails ? (
        <div className="mt-10">
          <TeamDetails
            data={team as object}
            reset={() => {
              setShowDiscard(true);
            }}
          />
        </div>
      ) : (
        <div className="mt-10">
          {user != null && user?.role != "ALUMNI" && <UnplacedEvents />}

          <div className="grid w-full grid-cols-[repeat(auto-fill,minmax(min(100%,300px),1fr))] items-stretch gap-8">
            {getTeams() && getTeams().length > 0 ? (
              getTeams().map((elt) => (
                <div
                  onClick={() => {
                    setShowTeamDetails(true);
                    console.log(elt);
                    setTeam(elt);
                  }}
                  className="h-full cursor-pointer"
                  key={elt?.id}
                >
                  <TeamCard data={elt} />
                </div>
              ))
            ) : (
              <div className="col-span-full mx-auto w-full max-w-xl -rotate-[0.5deg] border-2 border-dashed border-ink bg-card px-6 py-8 text-center">
                <p className="font-note text-2xl text-ink">No teams yet</p>
                <p className="mt-2 text-[15px] leading-relaxed text-ink-2">
                  {user && user?.role != "ALUMNI"
                    ? "No teams have been created."
                    : " Alumni cannot create or join teams."}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {showDiscard ? (
        <Discard
          cancel={() => {
            setShowDiscard(false);
          }}
          discard={() => {
            reset();
          }}
        />
      ) : (
        ""
      )}
    </div>
  );
};

export default Teams;
