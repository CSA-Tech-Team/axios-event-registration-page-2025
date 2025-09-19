// import Upcoming from "@/components/common/DashLeaderboard";
import Discord from "@/components/common/Discord";

function LandingPage() {
  return (
    <div className="w-full flex flex-col justify-between px-6">
      <div className=" h-[92vh] flex flex-wrap lg:p-12 p-2  justify-between items-center overflow-auto lg:overflow-hidden">
        <div className="w-full h-[70vh] lg:h-full flex overflow-auto rounded-2xl ">
          <Discord />
        </div>
        {/* <div className="lg:w-1/3 h-fit w-full space-y-6 my-16 flex flex-col  ">
          <div>
            <Upcoming />
          </div>
          <div>
            <Upcoming />
          </div>
        </div> */}
      </div>
      {/* <div className=" h-[8vh] lg:h-1/6 py-12 bg-[#171717] w-full  items-center   flex justify-center">
        <NavBar />
      </div> */}
    </div>
  );
}

export default LandingPage;
