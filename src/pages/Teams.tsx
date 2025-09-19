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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useAxios from "@/hooks/useAxios";
import { toast } from "@/hooks/use-toast";
import { useAuthStore } from "@/store/ApiStates";

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
          <pre className="mt-2 w-[340px] rounded-lg bg-white p-4">
            <code className="text-black">Team {name} created successfully</code>
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
    <div className="flex flex-wrap justify-between h-full w-full">
      <div className="w-full h-full lg:block">
        <div className="w-full h-full overflow-hidden text-white lg:pt-12 pt-4">
          <div className=" h-1/6 lg:pt-16 lg:px-12 px-6 w-full  z-10 text-3xl justify-between  flex items-center gap-4">
            <div className="flex w-full e items-center gap-4 ">
              <div className="text-white " onClick={() => reset()}>
                <ArrowLeft />
              </div>
              {showTeamDetails ? "Teams Details" : "Team"}
            </div>
            {!showTeamDetails && user!=null && user?.role!='ALUMNI' ? (
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <button
                    className="flex justify-center bg-[#80466E] text-center bg-[length:200%_100%] bg-right hover:bg-[linear-gradient(to_left,#80466E,#2D1F44)] hover:bg-left text-white px-8 py-2.5  rounded-full font-medium shadow-lg transition-all duration-700 ease-in-out"
                  >
                    <span className="relative z-10 p-0 text-xl">Create</span>

                    {/* Subtle animated glow */}
                    
                  </button>
                </DialogTrigger>

                <DialogContent className="bg-[#121212] shadow-lg text-white">
                  <DialogHeader>
                    <DialogTitle>Enter Team Name</DialogTitle>
                    <div className="flex lg:flex-row flex-col p-3 t items-center">
                      <Input
                        type="text"
                        className="bg-[#232323]"
                        required
                        onChange={(e) => setTeamName(e.target.value)}
                      />
                      <div className="p-3">
                        <Button
                          className="bg-[#80466E]"
                          onClick={() => {
                            teamCreateMutation.mutateAsync();
                          }}
                        >
                          Create
                        </Button>
                      </div>
                    </div>
                    {/* <DialogDescription>
                      This action cannot be undone. This will permanently delete
                      your account and remove your data from our servers.
                    </DialogDescription> */}
                  </DialogHeader>
                </DialogContent>
              </Dialog>
            ) : (
              ""
            )}
          </div>
          {showTeamDetails ? (
            <div className="z-0 h-5/6 lg:mt-0  overflow-auto scrollbar w-full gap-4 lg:p-0 px-6">
              <TeamDetails
                data={team as object}
                reset={() => {
                  setShowDiscard(true);
                }}
              />
            </div>
          ) : (
             <div className="grid z-0 h-5/6 lg:mt-0 lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 items-stretch overflow-auto scrollbar w-full gap-6 lg:p-12 p-6">
              {getTeams() && getTeams().length > 0 ? (
                getTeams().map((elt) => (
                  <div
                    onClick={() => {
                      setShowTeamDetails(true);
                      console.log(elt);
                      setTeam(elt);
                    }}
                    className="h-full"
                    key={elt?.id}
                  >
                    <TeamCard data={elt} />
                  </div>
                ))
              ) : (
                <div className="col-span-full flex justify-center items-center text-gray-400 text-lg font-medium">
                  { user && user?.role!="ALUMNI" ? "No teams have been created.":" Alumni cannot create or join teams."}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      {showDiscard ? (
        <div className="">
          <Discard
            cancel={() => {
              setShowDiscard(false);
            }}
            discard={() => {
              reset();
            }}
          />
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default Teams;
