// import NavBar from "@/components/common/Navbar";
// import SideBar from "@/components/common/SideBar";
// import { useEffect, useState } from "react";
// import Invitation from "./Invitation";
// import useWindowDimensions from "@/hooks/useWindowDimension";
// import Profile from "@/components/common/Profile";
// import Logout from "@/components/common/Logout";
// import Accommodation from "@/pages/Accommodation.tsx";

// const HomePage = () => {
//   const [action, setAction] = useState(0);
//   const windowSize = useWindowDimensions();
//   useEffect(()=>{
//     if(windowSize.width>=768){
//       setAction(1);
//     }
//   },[])
//   return (
//     <div className="flex bg-backgroundColor flex-col h-screen justify-center">
//       <div className="flex flex-wrap justify-between h-5/6 overflow-auto">
//         <div
//           className={`p-5 lg:w-1/4 ${
//             windowSize.width < 768 && action != 0 ? "hidden" : ""
//           }  flex flex-col justify-center w-full gap-4`}
//         >
//           {windowSize.width < 768 && action == 0 ? <Profile /> : ""}
//           <SideBar />
//           {windowSize.width < 768 && action == 0 ? <Logout /> : ""}
//         </div>
//         <div className="w-1/2 hidden lg:block">
//           {action == 2 ? (
//             <Invitation />
//           ) : action == 1 ? (
//             <Accommodation />
//           ) :""}
          
//         </div>

//         {windowSize.width < 768 && (
//           <div className="w-full lg:block">
//             {action == 2 ? (
//             <Invitation />
//           ) : action == 1 ? (
//             <Accommodation   />
//           ) :""}
//           </div>
//         )}
//         <div
//           className={`lg:flex lg:flex-col w-1/4 hidden  gap-5 p-5 justify-center`}
//         >
//           <Profile />
//           <Logout />
//         </div>
//       </div>
//       <div className=" h-1/6 relative">
//         <NavBar />
//       </div>
//     </div>
//   );
// };

// export default HomePage;
