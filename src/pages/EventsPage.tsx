/* eslint-disable @typescript-eslint/no-explicit-any */
import { easeOut, motion } from "framer-motion";
import { EventCard } from "@/components/common/EventCard";
import { EventDescription } from "@/components/common/EventDescription";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import useAxios from "@/hooks/useAxios";
import { ApiPaths, ERouterPaths } from "@/constants/enum";
import { useAuthStore } from "@/store/ApiStates";
import useWindowDimensions from "@/hooks/useWindowDimension";
import { ArrowLeft, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { teamRequirementMessage, useTeamRequirement } from "@/hooks/useTeamRequirement";

export const EventsPage = () => {
  const [showEvent, setShowEvent] = useState(false);
  const [eventDescription, setEventDescription] = useState({});
  const { getEvents, setEvents } = useAuthStore();
  const queryClient = useQueryClient();
  const { getWithoutAuth } = useAxios();
  const navigate = useNavigate();
  useQuery({
    queryFn: async () => {
      const response = await getWithoutAuth(ApiPaths.EVENT);
      setEvents(response?.data as any);
      console.log("Events", response?.data); 
      return response?.data;
    },
    queryKey: ["events"],
  });
  useEffect(() => {
    queryClient.invalidateQueries("events" as any);
    console.log(getEvents());
  }, []);
  const windowSize = useWindowDimensions();
  const teamRequirement = useTeamRequirement(getEvents() ?? []);
  const reset = () => {
    setShowEvent(false);
  };
  return (
    <div className="brut-container relative pb-20 pt-10 md:pt-14">

      <header className="flex flex-col items-start justify-between gap-8 border-b-2 border-ink pb-6 sm:flex-row sm:items-end">
        <div className="flex items-end gap-4">
          {windowSize.width < 1024 && showEvent && (
            <button
              type="button"
              aria-label="Back to events"
              onClick={() => reset()}
              className="mb-1 flex h-11 w-11 items-center justify-center border-2 border-ink bg-wcard shadow-brut-sm"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
          )}
          <div className="relative">
            <p className="eyebrow text-ink-2">Axios · The lineup</p>
            <h1 className="display-title registration mt-2">Events</h1>
            <span
              aria-hidden="true"
              className="absolute -bottom-4 left-[45%] whitespace-nowrap -rotate-6 font-note text-lg text-acc md:text-2xl"
            >
              pick your arena
            </span>
          </div>
        </div>

        <Button
          variant="secondary"
          onClick={() => navigate(ERouterPaths.EVENTSCHEDULE)}
        >
          <Calendar className="h-4 w-4" aria-hidden="true" />
          Schedule
        </Button>
      </header>

      <div
        className={`mt-12 grid gap-8 md:gap-10 ${
          showEvent ? "lg:grid-cols-2" : "grid-cols-[repeat(auto-fill,minmax(min(100%,300px),1fr))]"
        }`}
      >
        <ul className="contents">
          {getEvents()?.length != 0 &&
            getEvents()?.map((elt: any, index: number) => (
              <li key={elt.id} className="flex">
                <Link
                  to={`${ERouterPaths.EVENTS}/${elt.id}`}
                  className="group flex w-full focus-visible:outline-offset-8"
                >
                  <EventCard
                    data={elt}
                    index={index}
                    teamNotice={teamRequirementMessage(
                      teamRequirement[elt.id] ?? { status: "n/a" },
                    )}
                  />
                </Link>
              </li>
            ))}
        </ul>
        {showEvent && (
          <motion.div
            className="w-full"
            animate={{ x: 0, y: 0 }}
            initial={{ x: -50, y: 50 }}
            transition={{ ease: easeOut, duration: 0.5 }}
          >
            <EventDescription data={eventDescription} />
          </motion.div>
        )}
      </div>
    </div>
  );
};
