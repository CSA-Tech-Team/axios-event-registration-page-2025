import { Outlet } from "react-router-dom";
import NavBar from "./Navbar";

const Layout = () => {
  

  return (
    <div className="flex flex-col w-full h-screen  justify-between items-center ">
      <div className=" lg:flex w-full h-[92vh] lg:h-5/6 overflow-auto">
        <div className="lg:w  lg:flex h-full  overflow-auto w-full">
          <Outlet />
        </div>
      </div>
      <div className="fixed bottom-0 left-0 w-full h-[8vh] lg:h-1/6 bg-[#171717] flex items-center justify-center shadow-md">
        <NavBar />
      </div>
    </div>
  );
};

export default Layout;
