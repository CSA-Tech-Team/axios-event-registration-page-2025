import { Button } from "@/components/ui/button";
import { ERouterPaths } from "@/constants/enum";
import { useNavigate } from "react-router-dom";
function Notfound() {
  const navigate = useNavigate();
  return (
    <div className="flex justify-center items-center  sm:justify-start lg:w-1/2 my-24 md:mx-20 ">
      <div className="  flex flex-col p-10">
        <div
          className="bg-gradient-to-r from-white bg-purple-400 to-purple-600
            bg-clip-text text-transparent text-4xl font-extrabold sm:text-5xl  my-3 sm:my-5 lg:w-5/6"
        >
          The Page you are looking for was not found
        </div>
        <div className="text-white sm:my-5 md:text-lg lg:text-xl">
          The current page might have moved or being deleted.
        </div>
        <div className="my-5">
          <Button
            className="bg-[#232323] rounded-2xl p-3 text-white my-5 lg:px-10"
            onClick={() => navigate(ERouterPaths.SIGNIN)}
          >
            Back to Home
          </Button>
        </div>

        <div className="flex">
          <div className="text-white cursor-pointer">Need help?</div>
          <div className="text-[#9350D5] mx-5 cursor-pointer">Seek help</div>
        </div>
      </div>
    </div>
  );
}
export default Notfound;
