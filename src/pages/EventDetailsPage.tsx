/* eslint-disable @typescript-eslint/no-explicit-any */
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import useAxios from "@/hooks/useAxios";
import { ApiPaths, ERouterPaths } from "@/constants/enum";
import { EventDescription } from "@/components/common/EventDescription";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const EventDetailsPage = () => {
  const { id } = useParams();
  const { getWithoutAuth } = useAxios();
  const navigate = useNavigate();

  const { data, isLoading, isError } = useQuery({
    queryFn: async () => {
      const response = await getWithoutAuth(`${ApiPaths.EVENT}/${id}`);
      return response?.data;
    },
    queryKey: ["event", id],
  });

  if (isLoading) {
    return <div className="text-white p-6">Loading event...</div>;
  }

  if (isError || !data) {
    return <div className="text-red-500 p-6">Event not found</div>;
  }

  return (
    <main className="h-full w-full flex flex-col text-white">
      {/* Back button */}
      <div className="flex items-center gap-3 p-6 bg-[#171717]">
        <ArrowLeft
          className="cursor-pointer hover:text-Violet"
          onClick={() => navigate(ERouterPaths.EVENTS)}
        />
        <span className="text-xl">Back to Events</span>
      </div>

      {/* Fullscreen Event Description */}
      <div className="flex-1 overflow-auto w-full p-6 scrollbar">
        <EventDescription data={data} />
      </div>
    </main>
  );
};
