function Leaderboard() {
  return (
    <div className="bg-[#232323] lg:mx-5  rounded-2xl w-full flex flex-col">
      <div className="flex justify-end">
        <div className="bg-[#5D3288] w-12 h-12 rounded-br-2xl"></div>
      </div>
      <div className="text-white m-1 px-5 text-2xl">Leaderboard</div>
      <div className="p-5">
        <div className="w-4/5 m-3 p-1 bg-[#E2A52A] rounded-md flex justify-between">
            <div className="font-medium">
                name
            </div>
            <div className="text-[#232323]">
                score
            </div>
        </div>
        <div className="w-3/5 m-3 p-1 bg-[#E2A52A] rounded-md flex justify-between">
            <div className="font-medium">
                name
            </div>
            <div className="text-[#232323]">
                score
            </div>
        </div>
        <div className="w-2/5 m-3 p-1 bg-[#E2A52A] rounded-md flex justify-between">
            <div className="font-medium">
                name
            </div>
            <div className="text-[#232323]">
                score
            </div>
        </div>
      </div>
    </div>
  );
}

export default Leaderboard;
