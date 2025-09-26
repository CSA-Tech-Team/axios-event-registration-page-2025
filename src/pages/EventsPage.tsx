/* eslint-disable @typescript-eslint/no-explicit-any */
import { easeOut, motion } from "framer-motion";
import { EventCard } from "@/components/common/EventCard";
import { EventDescription } from "@/components/common/EventDescription";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import useAxios from "@/hooks/useAxios";
import { ApiPaths, ERouterPaths } from "@/constants/enum";
import { useAuthStore } from "@/store/ApiStates";
import useWindowDimensions from "@/hooks/useWindowDimension";
import { ArrowLeft, Calendar } from "lucide-react";

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
  const reset = () => {
    setShowEvent(false);
  };
  return (
    <main className="h-full w-full flex justify-between flex-col">
      <div className="h-full p-4 flex flex-col gap-4  overflow-auto">
        <div className="p-6 max-[500px]:px-2 h-1/6 text-white lg:pt-16  w-full bg-[#171717] z-10 text-3xl flex items-center justify-between">
          <div className="flex items-center gap-4">
            {windowSize.width < 1024 && showEvent ? (
              <div className="text-white " onClick={() => reset()}>
                <ArrowLeft />
                {/* <img src={back} alt="" className="w-4" /> */}
              </div>
            ) : (
              ""
            )}
            <span>Events</span>
          </div>
          
          <button
            onClick={() => navigate(ERouterPaths.EVENTSCHEDULE)}
            className="flex items-center gap-2 bg-[#80466E] text-center bg-[length:200%_100%] bg-right hover:bg-[linear-gradient(to_left,#80466E,#2D1F44)] hover:bg-left text-white px-8 py-2.5 rounded-md font-medium shadow-lg transition-all duration-700 ease-in-out text-xs sm:text-sm lg:text-base"
            title="View Event Schedule"
          >
            <Calendar className="w-4 h-4 lg:w-5 lg:h-5" />
            <span>Schedule</span>
          </button>
        </div>
        <div className="flex flex-wrap overflow-auto scrollbar">
          <div
            className={`flex w-full justify-center flex-wrap px-8 lg:p-12 gap-6 max-[500px]:px-2 `}
          >
            {getEvents()?.length != 0 &&
              getEvents()?.map((elt: any) => (
                <div
                  className={`${
                    showEvent == true ? " w-full" : "lg:w-[45%] w-full"
                  } flex`}
                  
                  onClick={() => navigate(`${ERouterPaths.EVENTS}/${elt.id}`)}

                >
                  <EventCard data={elt} />
                </div>
              ))}
          </div>
          {showEvent && (
            <motion.div
              className="lg:w-1/2 lg:p-0 w-full overflow-auto scrollbar h-full "
              animate={{ x: 0, y: 0 }}
              initial={{ x: -50, y: 50 }}
              transition={{ ease: easeOut, duration: 0.5 }}
            >
              <EventDescription data={eventDescription} />
            </motion.div>
          )}
        </div>
      </div>
      {/* <div className=" h-[8vh] lg:h-1/6 py-12 bg-[#171717] w-full  items-center    flex justify-center">
        <NavBar />
      </div> */}
    </main>
  );
};
