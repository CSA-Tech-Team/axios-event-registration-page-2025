import { Outlet } from "react-router-dom";
import NavBar from "./Navbar";

const Layout = () => {
  

  return (
    <div className="flex flex-col w-full h-screen  justify-between items-center lg:overflow-hidden">
      <div className=" lg:flex w-full gap-4 h-[92vh] lg:h-5/6 overflow-auto">
        <div className="lg:w  lg:flex h-full b overflow-auto w-full">
          <Outlet />
        </div>
      </div>
      <div className=" h-[8vh] lg:h-1/6 py-12 bg-[#171717] w-full  items-center    flex justify-center">
        <NavBar />
      </div>
    </div>
  );
};

export default Layout;
