import { FC } from "react";
import { CircleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DiscardProps {
  cancel: any;
  discard: any;
}
const Discard: FC<DiscardProps> = ({ cancel, discard }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-term/70 px-4">
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="discard-title"
        aria-describedby="discard-body"
        className="w-full max-w-md border-2 border-ink bg-card p-6 text-ink shadow-brut-lg"
      >
        <div className="flex flex-col items-center text-center">
          <CircleAlert className="h-16 w-16 text-acc-2" aria-hidden="true" />
          <div
            id="discard-title"
            className="mt-4 font-section text-2xl font-extrabold uppercase leading-none tracking-[-0.02em]"
          >
            The changes are unsaved
          </div>
          <div id="discard-body" className="mt-3 text-[15px] leading-relaxed text-ink-2">
            Are you really sure you want to quit the progress?
          </div>
        </div>
        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button type="button" variant="secondary" onClick={() => cancel()}>
            Cancel
          </Button>
          <Button type="submit" variant="destructive" onClick={() => discard()}>
            Discard
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Discard;
