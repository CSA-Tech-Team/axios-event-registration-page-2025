import { Outlet } from "react-router-dom";
import FloatingWhatsAppButton from "./FloatingWhatsAppButton";

const Layout = () => {
  return (
    <div>
      <Outlet />
      
    </div>
  );
};

export default Layout;
