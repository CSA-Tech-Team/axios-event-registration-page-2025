/* eslint-disable @typescript-eslint/no-explicit-any */
import { Clock9 } from "lucide-react";
import { CalendarDays } from "lucide-react";
import { FC } from "react";
interface EventCardProps {
  data: any;
}

export const EventCard: FC<EventCardProps> = ({ data }) => {
  return (
    // <main className="rounded-2xl  p-10 flex flex-col gap-4 text-white bg-[#232323]">
    //   <div className="text-3xl">{data?.title}</div>
    //   <div className="flex justify-between flex-wrap-reverse  gap-4 items-center">
    //     <div>
    //      {data?.description}
    //     </div>
    //     <div>
    //       <div className="p-10 lg:flex  text-black bg-white rounded-full">
    //         Event Logo
    //       </div>
    //     </div>
    //   </div>
    //   <div className="flex gap-8">
    //     <div className="flex items-center gap-1">
    //       <Clock9 />
    //       <span>{data?.startTime.slice(11,16)} - {data?.endTime.slice(11,16)}</span>
    //     </div>
    //     <div className="flex items-center gap-1">
    //       {/* <img src={caleder} alt="" className="w-5" /> */}
    //       <CalendarDays />
    //       <span>{data?.startTime.slice(0,10)}</span>
    //     </div>
    //   </div>
    // </main>
    <main className="max-w-md mx-auto bg-gradient-to-br from-[#2b2b2b] to-[#1a1a1a] rounded-2xl shadow-2xl overflow-hidden text-white">
      {/* Event Logo */}
      <div className="flex justify-center p-6">
        <img
          src={data?.logo}
          alt="Event Logo"
          className="w-32 h-32 xl:w-40 xl:h-40 object-cover rounded-full border-4 border-white shadow-lg"
        />
      </div>

      {/* Event Info */}
      <div className="px-8 pb-6 text-center space-y-3">
        <h2 className="text-2xl font-bold text-[#80466E] tracking-wide">{data?.title}</h2>
        <p className="text-gray-300 text-sm leading-relaxed">
          {data?.description}
        </p>

        {/* Timings */}
        <div className="flex max-[450px]:flex-col max-[425px]:items-center max-[425px]:gap-3 justify-center gap-6 text-gray-200 mt-4">
          {/*<div className="flex items-center gap-2">
            <Clock9 className="w-5 h-5 " color="#80466E"/>
            <span className="font-medium">
              {data?.startTime.slice(11, 16)} - {data?.endTime.slice(11, 16)}
            </span>
          </div>*/}
          <div className="flex items-center gap-2">
            <CalendarDays className="w-5 h-5" color="#80466E"/>
            <span className="font-medium">{data?.startTime.slice(0, 10)}</span>
          </div>
        </div>

        {/* Show Details Button */}
        <div className="pt-6">
          <button className="bg-[#80466E] bg-[length:200%_100%] bg-right hover:bg-[linear-gradient(to_left,#80466E,#2D1F44)] hover:bg-left text-white px-8 py-2.5 rounded-full font-semibold shadow-lg transition-all duration-700 ease-in-out">
            Show Details
          </button>
        </div>
      </div>
    </main>

  );
};
