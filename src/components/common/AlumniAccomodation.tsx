import { FC, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import  CoordinatorInfo from "./CoordinatorInfo.tsx";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { ApiPaths, ERouterPaths } from "@/constants/enum";
import { useAuthStore } from "@/store/ApiStates";
import useAxios from "@/hooks/useAxios";

function AlumniAccommodation() {
  const navigate = useNavigate();

  const reset = () => {
    navigate(ERouterPaths.PROFILE);
  };

  return <AlumniAccommodationCard reset={reset} />;
}

export default AlumniAccommodation;

type AlumniAccommodationCardProps = {
  reset: () => void;
};

const AlumniAccommodationCard: FC<AlumniAccommodationCardProps> = ({ reset }) => {
  const [needsAccommodation, setNeedsAccommodation] = useState<null | boolean>(
    null
  );
  //const [preference, setPreference] = useState<string>();
  const [note, setNote] = useState<string>("");
  const { setAccommodation, getAccommodation } = useAuthStore();
  const { postWithAuth, getWithAuth } = useAxios();
  const queryClient = useQueryClient();

  // --- Fetch existing accommodation if any ---
  const { data, isPending, isError } = useQuery({
    queryFn: async () => {
      try {
        const response = await getWithAuth(ApiPaths.ACCOMODATION);
        if (!response?.data) return null;
        setAccommodation(response.data as object);
        return response.data;
      } catch (err: any) {
        if (err.response?.status === 404) return null;
        throw err;
      }
    },
    queryKey: ["accommodation-alumni"],
  });

  // --- Create accommodation request ---
  const createAccommodationMutation = useMutation({
    mutationFn: async (notes: string) => {
      const response = await postWithAuth(ApiPaths.ACCOMODATION, { notes });
      return response?.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accommodation-alumni"] });
      toast({
        title: "Success!",
        description: "Your accommodation request has been submitted.",
      });
      reset();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Could not create request. Try again later.",
      });
    },
  });

  const handleSubmit = () => {
    if (!note || note.trim() === "") {
      toast({
        title: "Missing Notes",
        description: "Please enter notes for your accommodation request.",
      });
      return;
    }
    createAccommodationMutation.mutateAsync(note.trim() as string);
  };

  // --- Loading/Error states ---
  if (isPending)
    return (
      <p className="py-10 font-mono text-sm uppercase tracking-[0.08em] text-ink">
        <span aria-hidden="true" className="mr-2 inline-block h-3 w-2 animate-brut-blink bg-ink align-middle" />
        Loading...
      </p>
    );
  if (isError)
    return (
      <p
        role="alert"
        className="border-2 border-ink border-l-[8px] border-l-acc bg-wcard px-4 py-3 font-semibold text-ink"
      >
        Could not load accommodation. Please try again later.
      </p>
    );

  // --- CASE 1: Already has a request ---
  if (data && data.id) {
    const status = getAccommodation()?.status;
    return (
      <section className="brut-card w-full max-w-3xl space-y-6 p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="eyebrow text-ink-2">Request ID</p>
            <p className="mt-1 break-all font-mono text-sm font-bold text-ink">
              {getAccommodation()?.id}
            </p>
          </div>
          <span
            className={`self-start rotate-[1deg] border-2 border-ink px-3 py-1 font-mono text-xs font-bold uppercase tracking-[0.1em] shadow-brut-sm md:self-auto ${
              status === "APPROVED"
                ? "bg-r4 text-ink"
                : status === "PENDING"
                ? "bg-acc-2 text-ink"
                : "bg-destructive text-white"
            }`}
          >
            {status}
          </span>
        </div>

        <div>
          <p className="eyebrow mb-2 text-ink-2">Your notes</p>
          <div className="border-2 border-ink bg-wcard p-4 font-mono text-sm text-ink">
            {getAccommodation()?.notes}
          </div>
        </div>
        <div className="border-t-2 border-dashed border-line pt-5">
          <CoordinatorInfo />
        </div>
      </section>
    );
  }

  // --- CASE 2: New request (Ask directly) ---
  return (
    <section className="brut-card w-full max-w-2xl space-y-6 p-6">
      {needsAccommodation === null && (
        <>
          <p className="font-section text-2xl font-extrabold uppercase leading-[0.95] text-ink">
            Do you require accommodation during the event?
          </p>
          <div className="flex gap-4">
            <Button onClick={() => setNeedsAccommodation(true)}>Yes</Button>
            <Button
              variant="secondary"
              onClick={() => {
                reset();
              }}
            >
              No
            </Button>
          </div>
        </>
      )}

      {needsAccommodation === true && (
        <div className="flex w-full flex-col gap-4">
          <label htmlFor="alumni-accommodation-note" className="eyebrow text-ink">
            Add any notes for your accommodation request
          </label>
          <textarea
            id="alumni-accommodation-note"
            className="w-full border-2 border-ink bg-wcard p-3 text-base text-ink placeholder:text-ink-2 focus-visible:shadow-brut-sm focus-visible:outline-none"
            placeholder="Enter any special requirements or notes..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={3}
          />
          <div>
            <Button onClick={handleSubmit}>Confirm & Submit</Button>
          </div>
        </div>
      )}
      <div className="border-t-2 border-dashed border-line pt-5">
        <CoordinatorInfo />
      </div>
    </section>
  );
};
