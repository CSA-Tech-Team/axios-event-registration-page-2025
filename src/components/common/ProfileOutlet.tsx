import { Outlet } from "react-router-dom";
import NavBar from "./Navbar";

const Layout = () => {
  return (
    <div className="flex min-h-dvh w-full flex-col">
      <NavBar />
      <main id="main" tabIndex={-1} className="w-full flex-1 focus:outline-none">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
