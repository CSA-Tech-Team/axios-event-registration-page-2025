import { Button } from "../ui/button";

function Logout() {
  return (
    <main className="flex flex-col items-center w-full   gap-4">
      <Button className="w-full lg:-1/2  bg-[#C02727] p-6  rounded-2xl">Logout</Button>
      <div className=" flex w-full text-white gap-8 text-sm">
        <div className="w-1/2 justify-end flex">Any Incovenience?</div>
        <div className="w-1/2 font-bold  flex">Report</div>
      </div>
      <div className=" flex w-full text-white gap-8 text-sm">
        <div className="w-1/2 justify-end flex">Issue in finding things?</div>
        <div className="w-1/2 font-bold  flex">Get help</div>
      </div>
    </main>
  );
}

export default Logout;
