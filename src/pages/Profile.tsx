/* eslint-disable @typescript-eslint/no-explicit-any */
import EditProfile from "@/components/common/EditProfile";
import { useAuthStore } from "@/store/ApiStates";
import useAxios from "@/hooks/useAxios";
import { useQuery } from "@tanstack/react-query";
import { ApiPaths } from "@/constants/enum";
import { useToast } from "@/hooks/use-toast";

const Profile = () => {
  // const [showEdit, setShowEdit] = useState(false);
  // const windowSize = useWindowDimensions();
  // const [showProfile, setShowProfile] = useState(true);

  const { setUser, setIsProfileCompleted } = useAuthStore();
  const { getWithAuth } = useAxios();
  const { toast } = useToast();
  const { isPending } = useQuery({
    queryFn: async () => {
      const response: any = await getWithAuth(ApiPaths.USER);
      setUser(response?.data as any);
      setIsProfileCompleted(response?.data?.isProfileCompleted);
      if (!response?.data?.isProfileCompleted) {
        toast({
          title: "Complete your profile",
          description: "Complete your profile to continue",
        });
      }
      return response?.data;
    },
    queryKey: ["user"],
  });
  if (isPending) {
    return (
      <div className="brut-container py-16">
        <p
          role="status"
          className="font-mono text-sm uppercase tracking-[0.08em] text-ink"
        >
          <span
            aria-hidden="true"
            className="mr-2 inline-block h-3 w-2 animate-brut-blink bg-ink align-middle"
          />
          Loading....
        </p>
      </div>
    );
  }
  // return windowSize.width >= 1024 ? (
  return (
    <div className="w-full">
      <EditProfile />
    </div>
  );
  // ) :  (
  //   <div className="flex flex-col w-full justify-between h-screen items-center ">
  //     <div className="lg:flex w-full gap-4 h-[92vh] lg:h-5/6 overflow-auto">
  //     <EditProfile/>

  //       {/* <div className="w-full lg:w-1/4 p-4 flex flex-col gap-6 items-center">
  //         <ProfileCard
  //           setShowEdit={() => {
  //             setShowEdit(true);
  //             setShowProfile(false);
  //           }}
  //         />
  //         <SideBar />
  //       </div>
  //       <div className="w-full  lg:w-1/4 lg:flex p-4 flex-col justify-center">
  //         <Logout />
  //       </div> */}
  //     </div>
  //     <div className=" h-[8vh] lg:h-1/6 py-12 bg-[#171717] w-full  items-center   flex justify-center">
  //       <NavBar />
  //     </div>
  //   </div>
  // )
  // : (
  //   showEdit && (
  //     <div className="lg:w-1/2 w-full rounded-2xl lg:p-4 fixed lg:bg-black lg:top-1/4 lg:left-1/4">
  //       <EditProfile
  //         reset={() => {
  //           setShowEdit(false);
  //           setShowProfile(true);
  //         }}
  //       />
  //     </div>
  //   )
  // );
};

export default Profile;
