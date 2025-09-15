/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
  DialogHeader,
} from "@/components/ui/dialog";

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
  if (isPending) return <div>Loading...</div>;

  if (isError) {
    return (
      <div className="text-red-400">
        Could not load accommodation. Please try again later.
      </div>
    );
  }

  // --- CASE 1: No request yet (null OR no id) ---
  if (!data || !data.id) {
  return !showTAndC ? (
    <div className="flex flex-col items-center justify-center p-6 text-white space-y-6">
      {/*<h2 className="text-3xl font-bold">Accommodation</h2>*/}
      <p className="text-gray-300 text-center max-w-xl">
        Apply for accommodation to ensure a comfortable stay during the event. 
        Please read the terms & conditions carefully before proceeding.
      </p>
      <button
        className="px-6 py-3 text-sm rounded-full mt-4 bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 transition-all shadow-lg"
        onClick={() => setShowTAndC(true)}
      >
        Request for Accommodation
      </button>
      <div className="mt-6 text-gray-400 text-sm text-center space-y-1">
        <p>
          To process your accommodation, a caution deposit 
          <span className="text-violet-400"> (Refundable)</span> needs to be paid upfront.
        </p>
        <p>
          For further details, contact: <br />
          <span className="font-semibold">Jonathan Cecil</span> - Secretary 
          <a href="tel:+917305540931" className="text-violet-400 ml-1">+91 7305540931</a> <br />
          <span className="font-semibold">Govind Raghavendran</span> - Coordinator 
          <a href="tel:+918925617246" className="text-violet-400 ml-1">+91 8925617246</a>
        </p>
      </div>
    </div>
  ) : (
    <div className="flex flex-col gap-5 w-full text-white md:px-12 px-6">
      <h3 className="text-2xl font-semibold text-violet-400">Terms & Conditions</h3>
      <p className="text-gray-300 text-sm">
        Please ensure you apply only if required. Allocations once assigned cannot be changed. 
        Report any issues to the accommodation coordinators.
      </p>

      <div className="bg-[#1E1E1E] rounded-xl p-5 text-sm space-y-2 shadow-inner border border-violet-700/30">
        <p>• Accommodation for the second night will only be provided to participants advancing to the second round. Others must vacate accordingly.</p>
        <p>• Accommodation is subject to availability.</p>
        <p>• Plan your travel according to the event schedule.</p>
        <p>• Arrive well in advance of your event start times.</p>
      </div>

      <label className="flex items-center gap-3 text-sm cursor-pointer">
        <input
          type="checkbox"
          className="accent-violet-500 w-4 h-4"
          onChange={(e) => setAcceptTAndC(e.target.checked)}
        />
        <span>I accept all the terms and conditions above</span>
      </label>

      <div className="flex justify-end gap-4 mt-6">
        <button
          className="px-6 py-2 rounded-full border border-gray-500 hover:bg-gray-800 transition-all"
          onClick={() => setShowTAndC(false)}
        >
          Cancel
        </button>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger
            className={`px-8 py-3 rounded-full font-semibold transition-all ${
              acceptTAndC
                ? "bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 shadow-lg"
                : "bg-gray-600 cursor-not-allowed"
            }`}
            disabled={!acceptTAndC}
          >
            Accept
          </DialogTrigger>
          <DialogContent className="bg-[#121212] shadow-xl rounded-xl text-white border border-violet-700/30">
            <DialogHeader>
              <DialogTitle className="text-lg font-semibold text-violet-400">
                Select Food Preference
              </DialogTitle>
              <div className="flex flex-col sm:flex-row gap-4 mt-5">
                <Select onValueChange={(val) => setPreference(val)}>
                  <SelectTrigger className="bg-[#1E1E1E] border border-gray-600 rounded-lg">
                    <SelectValue placeholder="Choose Food Preference" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="veg">Vegetarian</SelectItem>
                    <SelectItem value="non-veg">Non Vegetarian</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  className="bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 transition-all"
                  onClick={handleSubmit}
                >
                  Confirm
                </Button>
              </div>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

// --- CASE 2: Existing request ---
return (
  <div className="p-6 bg-[#1E1E1E] w-full lg:w-2/3 rounded-xl text-white space-y-6 shadow-md border border-violet-700/30">
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <p>
        <span className="font-light">Accommodation Request ID:</span>{" "}
        <span className="font-semibold text-violet-400">{getAccommodation()?.id}</span>
      </p>
      <div
        className={`px-4 py-2 rounded-full text-sm font-medium ${
          getAccommodation()?.status === "APPROVED"
            ? "bg-green-500/20 text-green-400"
            : getAccommodation()?.status === "PENDING"
            ? "bg-yellow-500/20 text-yellow-400"
            : "bg-red-500/20 text-red-400"
        }`}
      >
        {getAccommodation()?.status}
      </div>
    </div>

    <div>
      <p className="font-medium mb-2">Your Notes</p>
      <div className="bg-black/50 p-4 rounded-lg border border-gray-700">
        {getAccommodation()?.notes}
      </div>
    </div>

    {getAccommodation()?.status !== "PENDING" && (
      <div>
        <p className="font-medium mb-2">Allocated Room</p>
        <div className="bg-black/50 p-4 rounded-lg border border-gray-700">
          {getAccommodation()?.user?.profile?.accommodatedRoom}
        </div>
      </div>
    )}
  </div>
);

};

export default AccommodationCard;
