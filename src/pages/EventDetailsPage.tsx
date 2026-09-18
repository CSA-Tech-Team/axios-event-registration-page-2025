/* eslint-disable @typescript-eslint/no-explicit-any */
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import useAxios from "@/hooks/useAxios";
import { ApiPaths, ERouterPaths } from "@/constants/enum";
import { EventDescription } from "@/components/common/EventDescription";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

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
    return (
      <div className="brut-container py-16 font-mono text-sm uppercase tracking-[0.08em] text-ink">
        <span aria-hidden="true" className="mr-2 inline-block h-3 w-2 animate-brut-blink bg-ink align-middle" />
        Loading event...
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="brut-container py-16">
        <p role="alert" className="max-w-xl border-2 border-ink border-l-[8px] border-l-acc bg-wcard px-4 py-3 font-semibold text-ink">
          Event not found
        </p>
      </div>
    );
  }

  return (
    <div className="brut-container pb-20 pt-8 md:pt-10">
      <Button
        variant="secondary"
        size="sm"
        onClick={() => navigate(ERouterPaths.EVENTS)}
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Back to Events
      </Button>

      <div className="mt-8">
        <EventDescription data={data} />
      </div>
    </div>
  );
};
