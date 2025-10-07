/* eslint-disable @typescript-eslint/no-explicit-any */
/*import { FC, useState, useEffect } from "react";
import { Timer, Layers, Calendar, Users } from "lucide-react";
import VioletProfile from "@/assets/violetProfile.svg";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
  DialogHeader,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuthStore } from "@/store/ApiStates";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useAxios from "@/hooks/useAxios";
import { ApiPaths, ERouterPaths } from "@/constants/enum";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface EventDescriptionProps {
  data: any;
}

export const EventDescription: FC<EventDescriptionProps> = ({ data }) => {
  const {
    getOwnedTeams,
    setOwnedTeams,
    getIsProfileCompleted,
    getRegisteredEvents,
    setRegisteredEvents,
  } = useAuthStore();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { getWithAuth, postWithAuth } = useAxios();
  const { toast } = useToast();

  const {user} = useAuthStore.getState();
  const [showRound, setShowRound] = useState<any>(null);
  const [open, setOpen] = useState(false);
  const [teamId, setTeamId] = useState<string>();

  // ✅ Auto-select first round on load
  useEffect(() => {
    if (data?.roundDetails?.rounds?.length > 0) {
      setShowRound(data.roundDetails.rounds[0]);
    }
  }, [data]);

  useQuery({
    queryKey: ["ownedTeams"],
    queryFn: async () => {
      const res = await getWithAuth(ApiPaths.TEAM); // /me/team
      setOwnedTeams(res?.data || []);
      return res?.data;
    },
    enabled: open, // only fetch when dialog opens
  });

  useQuery({
    queryFn: async () => {
      const response: any = await getWithAuth(ApiPaths.REGISTERED_EVENT);
      console.log("Registered Events:", response?.data);
      setRegisteredEvents(response?.data);
      return response?.data;
    },
    queryKey: ["registeredEvents"],
  });

  // ✅ Register team mutation
  const registerTeamMutation = useMutation({
    mutationFn: async () => {
      if (teamId) {
        const response = await postWithAuth(
          "/me" + ApiPaths.EVENT + `/${data?.id}` + ApiPaths.EVENT_REGISTER,
          { teamId }
        );
        return response?.data;
      } else {
        toast({
          title: "Uh oh! Something went wrong.",
          description: "Select a team to register",
        });
      }
    },
    mutationKey: ["EventRegistration"],
    onError: (error: any) => {
      toast({
        title: "Uh oh! Something went wrong.",
        description: error?.response?.data?.message,
      });
    },
    onSuccess: () => {
      setOpen(false);
      queryClient.invalidateQueries(["registeredEvents"]);
      toast({
        title: "Success",
        description: "Team registered successfully",
      });
    },
  });



  if (!data) {
    return <div className="text-white p-6 text-lg">Event not found</div>;
  }

  return (
    <main className="min-h-screen gap-4 w-full bg-[#0f0f0f] text-white grid grid-cols-1 lg:grid-cols-2 p-4">
      {/* Left Section /}
      <section className="p-8 max-[500px]:p-4 flex flex-col gap-6 bg-[#171717] rounded-2xl shadow-2xl">
        {/* Hero /}
        <div className="flex items-center gap-4">
          <img
            src={data?.logo || VioletProfile}
            alt="Event Logo"
            className="w-20 h-20 rounded-full border-4 border-[#1a1a1a] shadow-lg"
          />
          <h1 className="text-3xl font-bold text-[#80466E]">{data?.title}</h1>
        </div>

        {/* Event Info /}
        <div className="flex max-[600px]:flex-col gap-3 text-gray-300 text-base">
          <div className="flex items-center gap-2 border-r pr-4 max-[600px]:border-r-0 max-[600px]:pr-0">
            <Calendar size={18} className="text-[#80466E]" />
            <span>{data?.startTime?.slice(0, 10) || "Date TBD"}</span>
          </div>
          <div className="flex items-center gap-2 border-r pr-4 max-[600px]:border-r-0 max-[600px]:pr-0">
            <Layers size={18} className="text-[#80466E]" />
            <span>
              {/*data?.startTime && data?.endTime
                ? `${data.startTime.slice(11, 16)} - ${data.endTime.slice(11, 16)}`
                : "Time TBD"/}
              {data?.roundDetails?.rounds?.length
              ? `${data.roundDetails.rounds.length} Rounds`
              : "Rounds TBD"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Users size={18} className="text-[#80466E]" />
            <span>
              {data?.teamMaxSize
                ? data?.teamMaxSize === data?.teamMinSize
                  ? data?.teamMaxSize
                  : `${data?.teamMinSize} - ${data?.teamMaxSize}`
                : "N/A"}{" "}
              members
            </span>
          </div>
        </div>

        {/* Register Button + Dialog /}
        {/* Register Button + Dialog /}
        {user && user?.role!='ALUMNI' && 
        <Dialog
          open={open}
          onOpenChange={setOpen}
        >
          <DialogTrigger asChild>
            <Button
              className="w-1/2 bg-[#80466E] text-center bg-[length:200%_100%] bg-right hover:bg-[linear-gradient(to_left,#80466E,#2D1F44)] hover:bg-left text-white px-8 py-2.5  rounded-sm font-medium shadow-lg transition-all duration-700 ease-in-out"
              disabled={!!getRegisteredEvents()?.find(
                (elt: any) => elt?.event?.id === data?.id && elt?.team
              )}
              onClick={(e) => {
                const user = useAuthStore.getState().getUser?.(); // or your store’s login check
                if (!user) {
                  e.preventDefault(); // stop dialog opening
                  navigate(ERouterPaths.SIGNIN);
                  return;
                }
                if (!getIsProfileCompleted()) {
                  e.preventDefault();
                  toast({
                    title: "Complete your profile",
                    description: "Please complete your profile to register for events.",
                  });
                  navigate(ERouterPaths.PROFILE);
                  return;
                }
                const ownedTeams = useAuthStore.getState().getOwnedTeams?.() || [];
                  if (ownedTeams.length === 0) {
                    e.preventDefault();
                    navigate(ERouterPaths.TEAMS); // redirect to team creation page
                    return;
                  }
              }}
              >
              {(() => {
                const registeredEvent = getRegisteredEvents()?.find(
                  (elt: any) => elt?.event?.id === data?.id && elt?.team
                );
                console.log("Registered Event Check:", registeredEvent);
                if (registeredEvent) {
                  // registeredEvent.teamId → match with teams (owned or member)
                  const allTeams = getOwnedTeams() || [];
                  // TODO: also add `getMemberTeams()` if you have it in your store
                  console.log("All Teams:", allTeams);
                  console.log("Registered Event:", registeredEvent);
                  // Find the team name by matching teamId
                  const registeredTeam = allTeams.find(
                    (team: any) => team?.id === registeredEvent?.teamId
                  );
                  return registeredTeam
                    ? `Registered with Team: ${registeredTeam?.name}`
                    : "Registered";
                }
                return "Register";
              })()}
            </Button>
          </DialogTrigger>

          <DialogContent className="bg-[#121212] shadow-lg text-white">
            <DialogHeader>
              <DialogTitle>Select Team</DialogTitle>
              <DialogDescription>
                Your team will be locked after registering to the event. You can't add
                or remove members.
              </DialogDescription>
              <form className="flex lg:flex-row flex-col p-3 items-center">
                <Select onValueChange={(e) => setTeamId(e)} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Team" />
                  </SelectTrigger>
                  <SelectContent>
                    {getOwnedTeams()?.map((elt: any) => (
                      <SelectItem key={elt?.id} value={elt?.id}>
                        {elt?.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="p-3">
                  <Button
                    type="submit"
                    className="bg-[#80466E] text-center bg-[length:200%_100%] bg-right hover:bg-[linear-gradient(to_left,#80466E,#2D1F44)] hover:bg-left text-white px-4 py-2.5  rounded-sm font-medium shadow-lg transition-all duration-700 ease-in-out"
                    onClick={(e) => {
                      e.preventDefault();
                      registerTeamMutation.mutateAsync();
                    }}
                  >
                    Register
                  </Button>
                </div>
              </form>
            </DialogHeader>
          </DialogContent>
        </Dialog>
        }        

        {/* Conveners /}
        <div className="mt-6">
          <h2 className="text-lg font-semibold text-[#80466E] mb-3">Conveners</h2>
          {data?.conveners && data?.conveners.length > 0 ? (
            <div className="flex flex-col gap-4 max-h-40 overflow-y-auto pr-2 scrollbar">
              {data?.conveners?.map((convener: any, idx: number) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 bg-[#1f1f1f] p-3 rounded-xl hover:bg-[#262626] transition shadow"
                >
                  <img
                    src={convener?.profile?.profilePhoto || VioletProfile}
                    alt="Convener"
                    className="w-12 h-12 rounded-full border-gray-700"
                  />
                  <div>
                    <p className="font-medium max-[500px]:text-sm text-white">
                      {convener?.profile?.firstName} {convener?.profile?.lastName}
                    </p>
                    <p className="text-sm text-gray-400">
                      {convener?.phoneNumber}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 italic">No conveners available now.</p>
          )}
        </div>
      </section>

      {/* Right Section /}
      <section className="p-8 max-[500px]:p-6 flex flex-col gap-6 bg-[#1b1b1b] rounded-2xl shadow-2xl">
        {/* About Event /}
        <div className="flex flex-col overflow-y-auto pr-2">
          <h2 className="text-lg font-semibold text-[#80466E] mb-3">
            About the Event
          </h2>
          <p className="text-gray-300 leading-relaxed text-start">
            {data?.description || "No description available."}
          </p>
        </div>

        {/* Rounds /}
        <div className="flex-1 overflow-y-auto pr-2">
          <h2 className="text-lg font-semibold text-[#80466E] mb-3">Rounds</h2>
          <div className="flex flex-wrap gap-3">
            {data?.roundDetails?.rounds?.map((round: any, idx: number) => {
              const isActive = showRound?.name === round?.name;
              return (
                <div
                  key={idx}
                  className={`px-4 py-2 rounded-lg cursor-pointer transition ${
                    isActive
                      ? "bg-[#80466E] text-center bg-[length:200%_100%] bg-right hover:bg-[linear-gradient(to_left,#80466E,#2D1F44)] hover:bg-left text-white  py-1  rounded-sm shadow-md transition-all duration-700 ease-in-out"
                      : "bg-[#1f1f1f] hover:bg-[#2a2a2a]"
                  }`}
                  onClick={() => setShowRound(round)}
                >
                  {round?.name || `Round ${idx + 1}`}
                </div>
              );
            })}
          </div>
          {showRound && (
            <div className="mt-4 bg-[#1a1a1a] p-4 rounded-xl shadow border border-gray-700">
              <h3 className="font-semibold text-[#80466E]">
                {showRound?.name}
              </h3>
              <p className="text-gray-300 mt-2">{showRound?.description}</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
};
*/
/* eslint-disable @typescript-eslint/no-explicit-any */
import { FC, useState, useEffect } from "react";
import { Timer, Layers, Calendar, Users } from "lucide-react";
import VioletProfile from "@/assets/violetProfile.svg";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
  DialogHeader,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuthStore } from "@/store/ApiStates";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useAxios from "@/hooks/useAxios";
import { ApiPaths, ERouterPaths } from "@/constants/enum";
import { useToast } from "@/hooks/use-toast";
import { useNavigate, useLocation } from "react-router-dom";

interface EventDescriptionProps {
  data: any;
}

export const EventDescription: FC<EventDescriptionProps> = ({ data }) => {
  const {
    getOwnedTeams,
    setOwnedTeams,
    getIsProfileCompleted,
    getRegisteredEvents,
    setRegisteredEvents,
  } = useAuthStore();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { getWithAuth, postWithAuth } = useAxios();
  const { toast } = useToast();

  const { user } = useAuthStore.getState();
  const [showRound, setShowRound] = useState<any>(null);
  const [open, setOpen] = useState(false);
  const [teamId, setTeamId] = useState<string>();
  const [isRegistered, setIsRegistered] = useState(false);
  const [registeredTeamName, setRegisteredTeamName] = useState<string | null>(null);
  const location = useLocation();

  // Extract eventId from the URL path
  let eventId: string | undefined = undefined;
  try {
    // Assume URL like /events/:eventId or /event/:eventId or similar
    const pathParts = location.pathname.split("/");
    // Find the part that is a likely event id (after 'events' or 'event')
    const idx = pathParts.findIndex(
      (p) => p === "events" || p === "event"
    );
    if (idx !== -1 && pathParts.length > idx + 1) {
      eventId = pathParts[idx + 1];
    }
    // fallback to data?.id if not found
    if (!eventId && data?.id) eventId = data.id;
  } catch {
    eventId = data?.id;
  }

  // Auto-select first round on load
  useEffect(() => {
    if (data?.roundDetails?.rounds?.length > 0) {
      setShowRound(data.roundDetails.rounds[0]);
    }
  }, [data]);

  // Fetch owned teams on dialog open
  useQuery({
    queryKey: ["ownedTeams"],
    queryFn: async () => {
      const res = await getWithAuth(ApiPaths.TEAM);
      setOwnedTeams(res?.data || []);
      return res?.data;
    },
    enabled: open,
  });

  // Fetch registered events
  useQuery({
    queryFn: async () => {
      const response: any = await getWithAuth(ApiPaths.REGISTERED_EVENT);
      setRegisteredEvents(response?.data);
      return response?.data;
    },
    queryKey: ["registeredEvents"],
  });

  // --- Registration check logic using eventId from URL ---
  useEffect(() => {
    const registeredEvents = getRegisteredEvents() || [];
    const ownedTeams = getOwnedTeams() || [];
    console.log("Checking registration for eventId:", eventId);
    console.log("Registered Event", registeredEvents);
    console.log("Owned Teams", ownedTeams);
    let foundTeam: any = null;
    // Find if any owned team is registered for this eventId
    for (const regEvent of registeredEvents) {
      if (
        regEvent.id?.toString() === eventId?.toString() 
      ) {
        foundTeam = true;
        break;
      }
    }
    if (foundTeam) {
      setIsRegistered(true);
      //setRegisteredTeamName(foundTeam?.name || null);
    } else {
      setIsRegistered(false);
      //setRegisteredTeamName(null);
    }
  }, [getRegisteredEvents, getOwnedTeams, eventId]);

  // Register team mutation
  const registerTeamMutation = useMutation({
    mutationFn: async () => {
      if (teamId) {
        const response = await postWithAuth(
          "/me" + ApiPaths.EVENT + `/${data?.id}` + ApiPaths.EVENT_REGISTER,
          { teamId }
        );
        return response?.data;
      } else {
        toast({
          title: "Uh oh! Something went wrong.",
          description: "Select a team to register",
        });
      }
    },
    mutationKey: ["EventRegistration"],
    onError: (error: any) => {
      toast({
        title: "Uh oh! Something went wrong.",
        description: error?.response?.data?.message,
      });
    },
    onSuccess: () => {
      setOpen(false);
      queryClient.invalidateQueries(["registeredEvents"]);
      toast({
        title: "Success",
        description: "Team registered successfully",
      });
    },
  });

  if (!data) {
    return <div className="text-white p-6 text-lg">Event not found</div>;
  }

  return (
    <main className="min-h-screen gap-4 w-full bg-[#0f0f0f] text-white grid grid-cols-1 lg:grid-cols-2 p-4">
      {/* Left Section */}
      <section className="p-8 max-[500px]:p-4 flex flex-col gap-6 bg-[#171717] rounded-2xl shadow-2xl">
        {/* Hero */}
        <div className="flex items-center gap-4">
          <img
            src={data?.logo || VioletProfile}
            alt="Event Logo"
            className="w-20 h-20 rounded-full border-4 border-[#1a1a1a] shadow-lg"
          />
          <h1 className="text-3xl font-bold text-[#80466E]">{data?.title}</h1>
        </div>

        {/* Event Info */}
        <div className="flex max-[600px]:flex-col gap-3 text-gray-300 text-base">
          <div className="flex items-center gap-2 border-r pr-4 max-[600px]:border-r-0 max-[600px]:pr-0">
            <Calendar size={18} className="text-[#80466E]" />
            <span>{data?.startTime?.slice(0, 10) || "Date TBD"}</span>
          </div>
          <div className="flex items-center gap-2 border-r pr-4 max-[600px]:border-r-0 max-[600px]:pr-0">
            <Layers size={18} className="text-[#80466E]" />
            <span>
              {data?.roundDetails?.rounds?.length
                ? `${data.roundDetails.rounds.length} Rounds`
                : "Rounds TBD"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Users size={18} className="text-[#80466E]" />
            <span>
              {data?.teamMaxSize
                ? data?.teamMaxSize === data?.teamMinSize
                  ? data?.teamMaxSize
                  : `${data?.teamMinSize} - ${data?.teamMaxSize}`
                : "N/A"}{" "}
              members
            </span>
          </div>
        </div>

        {/* Register Button + Dialog */}
        {user && user?.role !== "ALUMNI" && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button
                className="w-1/2 bg-[#80466E] text-center bg-[length:200%_100%] bg-right hover:bg-[linear-gradient(to_left,#80466E,#2D1F44)] hover:bg-left text-white px-8 py-2.5 rounded-sm font-medium shadow-lg transition-all duration-700 ease-in-out"
                disabled={isRegistered}
                onClick={(e) => {
                  if (!user) {
                    e.preventDefault();
                    navigate(ERouterPaths.SIGNIN);
                    return;
                  }
                  if (!getIsProfileCompleted()) {
                    e.preventDefault();
                    toast({
                      title: "Complete your profile",
                      description:
                        "Please complete your profile to register for events.",
                    });
                    navigate(ERouterPaths.PROFILE);
                    return;
                  }
                  const ownedTeams = getOwnedTeams() || [];
                  if (ownedTeams.length === 0) {
                    e.preventDefault();
                    navigate(ERouterPaths.TEAMS);
                    return;
                  }
                }}
              >
                {isRegistered
                  ? "Registered"
                  : "Register"}
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-[#121212] shadow-lg text-white">
              <DialogHeader>
                <DialogTitle>Select Team</DialogTitle>
                <DialogDescription>
                  Your team will be locked after registering to the event. You
                  can't add or remove members.
                </DialogDescription>
                <form className="flex lg:flex-row flex-col p-3 items-center">
                  <Select onValueChange={(e) => setTeamId(e)} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Team" />
                    </SelectTrigger>
                    <SelectContent>
                      {getOwnedTeams()?.map((elt: any) => (
                        <SelectItem key={elt?.id} value={elt?.id}>
                          {elt?.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="p-3">
                    <Button
                      type="submit"
                      className="bg-[#80466E] text-white px-4 py-2.5 rounded-sm font-medium shadow-lg transition-all duration-700 ease-in-out"
                      onClick={(e) => {
                        e.preventDefault();
                        registerTeamMutation.mutateAsync();
                      }}
                    >
                      Register
                    </Button>
                  </div>
                </form>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        )}

        {/* Conveners */}
        <div className="mt-6">
          <h2 className="text-lg font-semibold text-[#80466E] mb-3">Conveners</h2>
          {data?.conveners && data?.conveners.length > 0 ? (
            <div className="flex flex-col gap-4 max-h-40 overflow-y-auto pr-2 scrollbar">
              {data?.conveners?.map((convener: any, idx: number) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 bg-[#1f1f1f] p-3 rounded-xl hover:bg-[#262626] transition shadow"
                >
                  <img
                    src={convener?.profile?.profilePhoto || VioletProfile}
                    alt="Convener"
                    className="w-12 h-12 rounded-full border-gray-700"
                  />
                  <div>
                    <p className="font-medium max-[500px]:text-sm text-white">
                      {convener?.profile?.firstName} {convener?.profile?.lastName}
                    </p>
                    <p className="text-sm text-gray-400">{convener?.phoneNumber}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 italic">No conveners available now.</p>
          )}
        </div>
      </section>

      {/* Right Section */}
      <section className="p-8 max-[500px]:p-6 flex flex-col gap-6 bg-[#1b1b1b] rounded-2xl shadow-2xl">
        {/* About Event */}
        <div className="flex flex-col overflow-y-auto pr-2">
          <h2 className="text-lg font-semibold text-[#80466E] mb-3">
            About the Event
          </h2>
          <p className="text-gray-300 leading-relaxed text-start">
            {data?.description || "No description available."}
          </p>
        </div>

        {/* Rounds */}
        <div className="flex-1 overflow-y-auto pr-2">
          <h2 className="text-lg font-semibold text-[#80466E] mb-3">Rounds</h2>
          <div className="flex flex-wrap gap-3">
            {data?.roundDetails?.rounds?.map((round: any, idx: number) => {
              const isActive = showRound?.name === round?.name;
              return (
                <div
                  key={idx}
                  className={`px-4 py-2 rounded-lg cursor-pointer transition ${
                    isActive
                      ? "bg-[#80466E] text-white shadow-md transition-all duration-700 ease-in-out"
                      : "bg-[#1f1f1f] hover:bg-[#2a2a2a]"
                  }`}
                  onClick={() => setShowRound(round)}
                >
                  {round?.name || `Round ${idx + 1}`}
                </div>
              );
            })}
          </div>
          {showRound && (
            <div className="mt-4 bg-[#1a1a1a] p-4 rounded-xl shadow border border-gray-700">
              <h3 className="font-semibold text-[#80466E]">{showRound?.name}</h3>
              <p className="text-gray-300 mt-2">{showRound?.description}</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
};