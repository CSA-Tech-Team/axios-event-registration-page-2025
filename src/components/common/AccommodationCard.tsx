/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
  DialogHeader,
} from "@/components/ui/dialog";
import { AlertCircle } from "lucide-react";


import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { FC, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useAxios from "@/hooks/useAxios";
import { ApiPaths } from "@/constants/enum";
import { toast } from "@/hooks/use-toast";
import { useAuthStore } from "@/store/ApiStates";
import WhatsAppLink from "./WhatsAppLink";
import CoordinatorInfo from "./CoordinatorInfo";

interface AccommodationCardProps {
  reset?: () => void;
}

const AccommodationCard: FC<AccommodationCardProps> = () => {
  const [showTAndC, setShowTAndC] = useState(false);
  const [acceptTAndC, setAcceptTAndC] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [preference, setPreference] = useState<string>();

  const { setAccommodation, getAccommodation } = useAuthStore();
  const { postWithAuth, getWithAuth } = useAxios();
  const user = useAuthStore((state) => state.user);
  const queryClient = useQueryClient();

  // --- Fetch accommodation request ---
  const { data, isPending, isError } = useQuery({
    queryFn: async () => {
      try {
        const response = await getWithAuth(ApiPaths.ACCOMODATION);
        if (!response?.data) return null;
        setAccommodation(response.data as object);
        return response.data;
      } catch (err: any) {
        if (err.response?.status === 404) {
          return null;
        }
        throw err;
      }
    },
    queryKey: ["accomodation"],
  });

  // --- Create accommodation request ---
  const createAccommodationMutation = useMutation({
    mutationFn: async (notes: string) => {
      const response = await postWithAuth(ApiPaths.ACCOMODATION, { notes });
      return response?.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accomodation"] });
      toast({
        title: "Success!",
        description: "Accommodation request created",
      });
      setDialogOpen(false);
      setShowTAndC(false);
    },
    onError: () => {
      toast({
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
      });
    },
  });

  const handleSubmit = () => {
    if (!preference) {
      toast({
        title: "Missing preference",
        description: "Please select your food preference",
      });
      return;
    }
    createAccommodationMutation.mutateAsync(`preference:${preference}`);
  };

  // --- UI states ---
  if (isPending)
    return (
      <p className="py-10 font-mono text-sm uppercase tracking-[0.08em] text-ink">
        <span aria-hidden="true" className="mr-2 inline-block h-3 w-2 animate-brut-blink bg-ink align-middle" />
        Loading...
      </p>
    );

  if (isError) {
    return (
      <p
        role="alert"
        className="border-2 border-ink border-l-[8px] border-l-acc bg-wcard px-4 py-3 font-semibold text-ink"
      >
        Could not load accommodation. Please try again later.
      </p>
    );
  }

  const coordinators = (
    <div className="space-y-2 text-sm text-ink-2">
      <p>
        To process your accommodation, a caution deposit{" "}
        <span className="font-bold text-ink">(Refundable)</span> needs to be paid upfront.
      </p>
      <p className="eyebrow pt-2 text-ink-2">For further details, contact</p>
      <p>
        <span className="font-bold text-ink">Santhosh Kumar</span> · Coordinator ·
        <WhatsAppLink phone="+919345890184" className="ml-1 font-mono font-bold text-ink underline decoration-acc decoration-2 underline-offset-4" message="Hello, I have a query regarding my accommodation.">
          +91 93458 90184
        </WhatsAppLink>
      </p>
      <p>
        <span className="font-bold text-ink">Ragul Prasath V</span> · Coordinator ·
        <WhatsAppLink phone="+919345690254" className="ml-1 font-mono font-bold text-ink underline decoration-acc decoration-2 underline-offset-4" message="Hello, I have a query regarding my accommodation.">
          +91 9345690254
        </WhatsAppLink>
      </p>
    </div>
  );

  const femaleNotice = (
    <p className="flex items-start gap-2 border-2 border-ink border-l-[8px] border-l-acc bg-wcard px-3 py-2 text-sm font-semibold text-ink">
      <AlertCircle size={16} className="mt-0.5 shrink-0 text-acc" aria-hidden="true" />
      <span>
        Kindly note: Accommodation will not be provided for female participants.
        We request them to make their own arrangements.
      </span>
    </p>
  );

  // --- CASE 1: No request yet (null OR no id) ---
  if (!data || !data.id) {
  return !showTAndC ? (
    <section className="brut-card w-full max-w-2xl space-y-6 p-6">
      <p className="text-[15px] leading-relaxed text-ink">
        Apply for accommodation to ensure a comfortable stay during the event.
        Please read the terms & conditions carefully before proceeding.
      </p>
      <Button onClick={() => setShowTAndC(true)}>
        Request accommodation ▸
      </Button>
      <div className="border-t-2 border-dashed border-line pt-5">{coordinators}</div>
    </section>
  ) : (
    <section className="brut-card w-full max-w-3xl space-y-5 p-6">
      <h2 className="font-section text-3xl font-extrabold uppercase leading-[0.9] tracking-[-0.02em]">
        Terms & Conditions
      </h2>
      {user?.gender === "MALE" ? (
      <>
      <p className="text-sm text-ink-2">
        Please ensure you apply only if required. Allocations once assigned cannot be changed.
        Report any issues to the accommodation coordinators.
      </p>

      <ul className="space-y-2 border-2 border-ink bg-wcard p-5 text-sm leading-relaxed text-ink">
        <li>◆ Accommodation for the second night will only be provided to participants advancing to the second round. Others must vacate accordingly.</li>
        <li>◆ Accommodation is subject to availability.</li>
        <li>◆ Plan your travel according to the event schedule.</li>
        <li>◆ Arrive well in advance of your event start times.</li>
        <li>◆ A security deposit of ₹300 must be paid in advance. The full amount will be refunded at checkout, provided no damages are incurred during the stay.</li>
        <li>◆ Any damages to property will be charged to the individual responsible.</li>
        <li>◆ Accommodation is provided on a shared basis. Room sharing will be done by the committee.</li>
        <li>◆ Participants coming as a team must raise individual requests for accommodation. Team requests will not be considered collectively.</li>
      </ul>
      {femaleNotice}

      <label className="flex min-h-11 cursor-pointer items-center gap-3 text-sm font-semibold text-ink">
        <input
          type="checkbox"
          className="h-5 w-5 accent-[var(--acc)]"
          onChange={(e) => setAcceptTAndC(e.target.checked)}
        />
        <span>I accept all the terms and conditions above</span>
      </label>

      <div className="flex flex-wrap justify-end gap-4 border-t-2 border-dashed border-line pt-5">
        <Button variant="secondary" onClick={() => setShowTAndC(false)}>
          Cancel
        </Button>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild disabled={!acceptTAndC}>
            <Button disabled={!acceptTAndC}>Accept</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Food preference</DialogTitle>
              <div className="mt-5 flex flex-col gap-4 sm:flex-row">
                <Select onValueChange={(val) => setPreference(val)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose Food Preference" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="veg">Vegetarian</SelectItem>
                    <SelectItem value="non-veg">Non Vegetarian</SelectItem>
                  </SelectContent>
                </Select>
                <Button onClick={handleSubmit}>Confirm</Button>
              </div>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
    </> ) : (
      <div className="space-y-3 text-sm text-ink">
        {femaleNotice}
        <ul className="space-y-2 border-2 border-ink bg-wcard p-5">
          <li>◆ Plan your travel according to the event schedule.</li>
          <li>◆ Arrive well in advance of your event start times.</li>
        </ul>
      </div>
  )}
    </section>
  );
}

// --- CASE 2: Existing request ---
const status = getAccommodation()?.status;
return (
  <section className="brut-card w-full max-w-3xl space-y-6 p-6">
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <p className="eyebrow text-ink-2">Request ID</p>
        <p className="mt-1 break-all font-mono text-sm font-bold text-ink">{getAccommodation()?.id}</p>
      </div>
      {/* Stamp: the label carries the state; colour only reinforces it. */}
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

    {status !== "PENDING" && (
      <div>
        <p className="eyebrow mb-2 text-ink-2">Allocated room</p>
        <div className="border-2 border-ink bg-wcard p-4 font-display text-3xl uppercase leading-none text-ink">
          {getAccommodation()?.user?.profile?.accommodatedRoom}
        </div>
      </div>
    )}
    <div className="border-t-2 border-dashed border-line pt-5">
      <CoordinatorInfo />
    </div>
  </section>
);

};

export default AccommodationCard;
