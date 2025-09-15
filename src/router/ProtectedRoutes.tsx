import { ApiPaths, ERouterPaths } from "@/constants/enum";
import useAxios from "@/hooks/useAxios";
import { useAuthStore } from "@/store/ApiStates";
import { isAuthenticated } from "@/utils/common";
import { useQuery } from "@tanstack/react-query";
import { ReactNode, useEffect } from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const {setOwnedTeams,setTeams} = useAuthStore();
  const { getWithAuth } = useAxios();

  useQuery({
    queryFn: async () => {
      const response: any = await getWithAuth(ApiPaths.TEAM);
      console.log(response?.data);
      setTeams(response?.data);
      return response?.data;
    },
    queryKey: ["teams"],
  });

  useQuery({
    queryFn: async () => {
      const response: any = await getWithAuth(ApiPaths.TEAM + "?owned=true");
      setOwnedTeams(response?.data);
      console.log(response?.data);
      return response?.data;
    },
    queryKey: ["ownedTeams"],
  });

  useEffect(() => {
    console.log(isAuthenticated());
  }, []);
 
  return isAuthenticated() ? <>{children}</> : <Navigate to={ERouterPaths.SIGNIN} />;
};

export const LoginProtectedRoute = ({ children }: { children: ReactNode }) => {
  return isAuthenticated() ? <Navigate to={ERouterPaths.PROFILE} /> : children;
};

export default ProtectedRoute;
