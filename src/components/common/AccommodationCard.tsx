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
        className="px-6 py-3 text-sm  mt-4 bg-[#80466E] text-center bg-[length:200%_100%] bg-right hover:bg-[linear-gradient(to_left,#80466E,#2D1F44)] hover:bg-left text-white rounded-full font-medium shadow-lg transition-all duration-700 ease-in-out"
        onClick={() => setShowTAndC(true)}
      >
        Request for Accommodation
      </button>
      <div className="mt-6 text-gray-400 text-sm text-center space-y-1">
        <p>
          To process your accommodation, a caution deposit 
          <span className="text-[#80466E]"> (Refundable)</span> needs to be paid upfront.
        </p>
        <p>
          For further details, contact: <br />      
          <span className="font-semibold">Santhosh Kumar </span> - Coordinator 
          <WhatsAppLink phone="+919345890184" className="text-[#80466E] ml-1" message="Hello, I have a query regarding my accommodation.">
            +91 93458 90184
          </WhatsAppLink>
          <br/>
          <span className="font-semibold">Ragul Prasath V </span> - Coordinator 
          <WhatsAppLink phone="+919345690254" className="text-[#80466E] ml-1" message="Hello, I have a query regarding my accommodation.">
            +91 9345690254
          </WhatsAppLink>
          {/*<a href="tel:+918925617246" className="text-[#80466E] ml-1">+91 9345690254</a>*/}
        </p>
      </div>
    </div>
  ) : (
    <div className="flex flex-col gap-5 w-full text-white md:px-12 px-6">
      <h3 className="text-2xl font-semibold text-[#80466E]">Terms & Conditions</h3>
      {user?.gender === "MALE" ? (
      <>
      <p className="text-gray-300 text-sm">
        Please ensure you apply only if required. Allocations once assigned cannot be changed. 
        Report any issues to the accommodation coordinators.
      </p>

      <div className="bg-[#1E1E1E] rounded-xl p-5 text-sm space-y-2 shadow-inner border border-violet-700/30">
        <p>• Accommodation for the second night will only be provided to participants advancing to the second round. Others must vacate accordingly.</p>
        <p>• Accommodation is subject to availability.</p>
        <p>• Plan your travel according to the event schedule.</p>
        <p>• Arrive well in advance of your event start times.</p>
        <p>• A security deposit of ₹300 must be paid in advance. The full amount will be refunded at checkout, provided no damages are incurred during the stay.</p>
        <p>• Any damages to property will be charged to the individual responsible.</p>
        <p>• Accommodation is provided on a shared basis. Room sharing will be done by the committee.</p>
        <div className="flex items-center gap-2 text-red-400 font-medium">
          <AlertCircle size={16} />
          <span>
            Kindly note: Accommodation will not be provided for female participants. 
            We request them to make their own arrangements.
          </span>
        </div>
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
                ? "bg-[#80466E] text-center bg-[length:200%_100%] bg-right hover:bg-[linear-gradient(to_left,#80466E,#2D1F44)] hover:bg-left text-white px-8 py-2.5  rounded-full font-medium shadow-lg transition-all duration-700 ease-in-out"
                : "bg-gray-600 cursor-not-allowed"
            }`}
            disabled={!acceptTAndC}
          >
            Accept
          </DialogTrigger>
          <DialogContent className="bg-[#121212] shadow-xl rounded-xl text-white border border-violet-700/30">
            <DialogHeader>
              <DialogTitle className="text-lg font-semibold text-[#80466E]">
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
                  className="bg-[#80466E] text-center bg-[length:200%_100%] bg-right hover:bg-[linear-gradient(to_left,#80466E,#2D1F44)] hover:bg-left text-white px-8 py-2.5  rounded-sm font-medium shadow-lg transition-all duration-700 ease-in-out"
                  onClick={handleSubmit}
                >
                  Confirm
                </Button>
              </div>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
    </> ) : (
      <div className="bg-[#1E1E1E] rounded-xl p-5 text-sm space-y-3 shadow-inner border border-violet-700/30">
      <div className="flex items-center gap-2 text-red-400 font-medium">
        <AlertCircle size={16} />
        <span>
          Kindly note: Accommodation will not be provided for female participants. 
          We request them to make their own arrangements.
        </span>
      </div>

      <p>• Plan your travel according to the event schedule.</p>
      <p>• Arrive well in advance of your event start times.</p>
    </div>
  )}
    </div>
  );
}

// --- CASE 2: Existing request ---
return (
  <div className="p-6 bg-[#1E1E1E] w-full lg:w-2/3 rounded-xl text-white space-y-6 shadow-md border border-violet-700/30">
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <p>
        <span className="font-light">Accommodation Request ID:</span>{" "}
        <span className="font-semibold text-[#80466E]">{getAccommodation()?.id}</span>
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
    <CoordinatorInfo />
  </div>
);

};

export default AccommodationCard;
