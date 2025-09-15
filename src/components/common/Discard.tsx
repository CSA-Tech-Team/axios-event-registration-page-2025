import { FC } from "react";
import { CircleAlert } from "lucide-react";

interface DiscardProps {
  cancel: any;
  discard: any;
}
const Discard: FC<DiscardProps> = ({ cancel, discard }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-[#171717] p-5 rounded-lg shadow-lg max-w-md lg:max-w-xl md:max-w-md">
        <div className="flex flex-col justify-center items-center text-white">
          <div>
            <CircleAlert className="w-[100px] h-[100px] stroke-[#E2A52A]"/>
          </div>
          <div>The changes are unsaved</div>
          <div>Are you really sure you want to quit the progress?</div>
        </div>
        <div className="flex justify-between w-full">
          <button
            type="button"
            className="rounded-2xl px-6 py-2 mx-3 mt-5 lg:px-16 text-white font-semibold border border-white"
            onClick={() => cancel()}
          >
            Cancel
          </button>

          <button
            className="rounded-2xl px-8 py-3 mx-2 mt-5 lg:px-16 bg-[#C02727] text-white font-semibold"
            type="submit"
            onClick={() => discard()}
          >
            Discard
          </button>
        </div>
      </div>
    </div>
  );
};

export default Discard;
