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
import { ArrowLeft } from "lucide-react";

import { ApiPaths, ERouterPaths } from "@/constants/enum";
import { useAuthStore } from "@/store/ApiStates";
import useAxios from "@/hooks/useAxios";
import useWindowDimensions from "@/hooks/useWindowDimension";

function AlumniAccommodation() {
  const windowSize = useWindowDimensions();
  const navigate = useNavigate();
  const { getAccommodation } = useAuthStore();

  const reset = () => {
    navigate(ERouterPaths.PROFILE);
  };

  return (
    <div className="flex w-full flex-wrap justify-between h-full overflow-auto">
      <div className="w-full">
        <div className="w-full text-white pt-12 items-center align-middle">
        

          <div className="flex flex-col items-center w-full gap-4 lg:p-0 p-6 max-[500px]:px-2">
            <AlumniAccommodationCard reset={reset} />
          </div>
        </div>
      </div>
    </div>
  );
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
  if (isPending) return <div>Loading...</div>;
  if (isError)
    return (
      <div className="text-red-400">
        Could not load accommodation. Please try again later.
      </div>
    );

  // --- CASE 1: Already has a request ---
  if (data && data.id) {
    return (
      <div className="p-6 bg-[#1E1E1E] w-full lg:w-2/3 rounded-xl text-white space-y-6 shadow-md border border-violet-700/30">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <p>
            <span className="font-light">Accommodation Request ID:</span>{" "}
            <span className="font-semibold text-[#80466E]">
              {getAccommodation()?.id}
            </span>
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
        <CoordinatorInfo />
      </div>
    );
  }

  // --- CASE 2: New request (Ask directly) ---
  return (
    <div className="flex flex-col items-center justify-center p-6 text-white space-y-6 border shadow-xl border-violet-700/30 rounded-xl bg-[#1E1E1E] w-full lg:w-2/3">
      {needsAccommodation === null && (
        <>
          <p className="text-gray-300 text-center max-w-xl">
            Do you require accommodation during the event?
          </p>
          <div className="flex gap-6">
            <Button
              className="bg-[#80466E] hover:bg-[#5e3350]"
              onClick={() => setNeedsAccommodation(true)}
            >
              Yes
            </Button>
            <Button
              className="bg-gray-600 hover:bg-gray-700"
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
        <div className="flex flex-col gap-4 items-center w-full">
          <p className="text-gray-300 text-left">Add any notes for your accommodation request:</p>
            <textarea
            className="bg-[#1E1E1E] border border-gray-600 rounded-lg w-full max-w-md p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#80466E]"
            placeholder="Enter any special requirements or notes..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={3}
            />
          <Button
            className="bg-[#80466E] hover:bg-[#5e3350] mt-4"
            onClick={handleSubmit}
          >
            Confirm & Submit
          </Button>
        </div>
      )}
      <CoordinatorInfo />
    </div>
  );
};
