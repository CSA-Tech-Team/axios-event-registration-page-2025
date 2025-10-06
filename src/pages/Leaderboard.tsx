/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import lead1 from "@/assets/lead1.svg";
import lead2 from "@/assets/lead2.svg";
import lead3 from "@/assets/lead3.svg";
import crown from "@/assets/crown.svg";
// import useAxios from "@/hooks/useAxios";
//import { socket } from "@/context/Socket";

export const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [isConnected, setIsConnected] = useState(socket.connected);

  function onConnect() {
    setIsConnected(true);
  }

  function onDisconnect() {
    setIsConnected(false);
  }

  /*useEffect(() => {
    function onGetLeaderboard(value: any[]) {
      if (value && value.length > 2) {
        [value[0], value[1]] = [value[1], value[0]];
      }
      setLeaderboard(value);
    }

    console.log(isConnected);

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("leaderboard", onGetLeaderboard);
    socket.emit("requestLeaderboard");

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("leaderboard", onGetLeaderboard);
    };
  }, []);*/

  return (
    // <></>
    
    <main className="fixed flex items-center justify-center w-full h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-indigo-800">
      <div className="text-center p-6">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white drop-shadow-lg tracking-wide">
          Coming Soon
        </h1>
        <p className="mt-4 text-base sm:text-lg md:text-xl text-indigo-200 font-medium">
          Stay tuned!
        </p>
        <div className="mt-8 flex justify-center">
          <div className="h-2 w-2 bg-indigo-400 rounded-full animate-bounce mx-1"></div>
          <div className="h-2 w-2 bg-indigo-400 rounded-full animate-bounce mx-1 [animation-delay:200ms]"></div>
          <div className="h-2 w-2 bg-indigo-400 rounded-full animate-bounce mx-1 [animation-delay:400ms]"></div>
        </div>
      </div>
    </main>
  );
};

{/*}
    <main className=" h-[92vh] lg:flex  w-full gap-4 lg:h-full overflow-hidden">
      {/* <div className="w-full h-full lg:block"> /}
      {/* <div className="text-white px-10 py-5 flex justify-start ">
        <div className="mx-2 text-2xl font-semibold p-12 ">Leaderboard</div>
      </div> /}
      <div className="flex  h-[92vh] mb-[8vh]  w-full flex-col md:flex-row overflow-auto lg:overflow-hidden overflow-x-hidden">
        <div className="h-[70vh] w-full md:w-2/3 ">
          <div className="flex justify-center">
            <img
              src={crown}
              alt="Crown"
              style={{ width: "100px", height: "100px" }}
            />
          </div>
          {/* Adjust margin top on small screens /}
          <div className="flex h-1/2 md:h-full items-end mx-10 mt-8 md:mt-0 ">
            {leaderboard?.map(
              (item: any, index) =>
                index < 3 && (
                  <div
                    key={item?.id}
                    className={`  ${
                      index == 0 ? "h-2/3" : index == 1 ? "h-full" : "h-1/3"
                    } ${
                      index == 0
                        ? "bg-[#1F102D]"
                        : index == 1
                        ? "bg-[#311A49]"
                        : "bg-[#1F102D]"
                    }  w-1/3 rounded-2xl flex flex-col justify-start items-center text-white`}
                  >
                    <img
                      src={index == 0 ? lead2 : index == 1 ? lead1 : lead3}
                      // alt={`${item.content} icon`}
                      className="-mt-16"
                      style={{ width: "110px", height: "110px" }}
                    />
                    <div className=" md:mt-4 w-full flex flex-col items-center ">
                      <div className="w-full text-ellipsis text-center px-6">
                        {item?.collegeName || "N/A"}
                      </div>
                      <div
                        className={`text-${
                          index === 1
                            ? "white"
                            : index === 0
                            ? "text-red-500"
                            : "text-blue-500"
                        } md:text-3xl`}
                      >
                        {item?.totalScore}
                      </div>
                    </div>
                  </div>
                )
            )}
          </div>
        </div>

        {/* Second component for remaining players *}
        <div className="text-white w-full bg-[#1F102D] md:w-1/3 p-3 md:p-1 m-1 flex flex-col  h-1/2 md:h-full scrollbar overflow-x-hidden">
          <div className=" mx-3 rounded-2xl p-5 overflow-auto ">
            {leaderboard?.map(
              (player: any, index) =>
                index > 2 && (
                  <div
                    key={index}
                    className="bg-[#1F102D] flex justify-between items-center mx-3 border-b border-[#5F59598A]"
                  >
                    {/* Position /}
                    <div className="rounded-full bg-[#311A49] px-4 py-2 m-2">
                      {index + 1} {/* Displaying index as position /}
                    </div>
                    {/* Name /}

                    <div className="p-2 m-2 w-3/4 truncate">
                      {player.collegeName}
                    </div>
                    {player?.totalScore}
                    <div className="p-2 m-2">{player.score}</div>
                  </div>
                )
            )}
          </div>
        </div>
      </div>
    </main>
*/}