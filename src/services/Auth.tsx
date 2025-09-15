import useAxios from "@/hooks/useAxios";


export const generateOTP = async(data:any):Promise<any>=>{
  const {postWithoutAuth} = useAxios();

    const response = await postWithoutAuth(import.meta.env.VITE_API_URL+"/auth/generateOTP",data);
    return response

}