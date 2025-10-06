import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Dispatch, FC, SetStateAction } from "react";
import { useMutation } from "@tanstack/react-query";
import useAxios from "@/hooks/useAxios";
import { Mails } from "lucide-react";
import { ApiPaths } from "@/constants/enum";
import { toast } from "@/hooks/use-toast";
interface Signup1Components {
  setActive: Dispatch<SetStateAction<number>>;
}

const Signup1: FC<Signup1Components> = ({ setActive }) => {
  const FormSchema = z.object({
    email: z.string(),
  });
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: localStorage.getItem("email") || "",
    },
  });

  const { postWithoutAuth } = useAxios();

  // --- Mutation to check if email exists ---
  const checkEmailMutation = useMutation({
    //mutationKey: ["checkEmail"],
    mutationFn: async (data: { email: string }) => {
      const response = await postWithoutAuth(ApiPaths.CHECK_EMAIL, data);
      console.log("Response is : ",response);
      return response.data;
    },
  });

  const generateOTPMutation = useMutation({
    mutationKey: ["register"],
    mutationFn: async (data: any) => {
      console.log(data);
      const response = await postWithoutAuth(ApiPaths.GENERATE_OTP, data);
      return response;
    },
    onSuccess: () => {
      localStorage.setItem("email", form.getValues("email"));
      setActive(2);
      toast({
        title: "OTP Sent",
        description: "Please check your inbox. If not received, check your spam folder too.",
      });
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    /*generateOTPMutation.mutateAsync(data);*/
    // toast({
    //   title: "You submitted the following values:",
    //   description: (
    //     <pre className="mt-2 w-[340px] rounded-md bg-white p-4">
    //       <code className="text-black">{JSON.stringify(data, null, 2)}</code>
    //     </pre>
    //   ),
    // });
    try {
      // 1️⃣ Check if email exists
      const result = await checkEmailMutation.mutateAsync({ email: data.email });
      console.log("Email check result:", result);
      if (result.exists) {
        toast({
          title: "Email already registered",
          description: "Please login or use another email.",
          variant: "destructive",
        });
        return; // stop here
      }
      await generateOTPMutation.mutateAsync(data);
      // localStorage.setItem("email", form.getValues("email"));
      // localStorage.setItem("emailOTP", "123456");
      // setActive(3);
    } catch (err: any) {
      toast({
        title: "Error",
        description: err?.response?.data?.message || "Something went wrong",
        variant: "destructive",
      });
    }

  }

  return (
    <Form {...form}>
      <div className="w-full px-6 md:px-0 max-[500px]:px-0">
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 mt-6 w-full lg:px-10 md:px-10 sm:px-10 max-[500px]:px-7"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="">
                <FormControl>
                  <div className="bg-[#232323]  rounded-md flex items-center font-lato  ">
                    <div className="p-4">
                      <Mails />
                    </div>
                    <Input
                      placeholder="Enter your email*"
                      type="email"
                      required
                      autoFocus={true}
                      className="py-4  flex placeholder:text-[#B2B2B2] outline-none w-full border-0"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            disabled={checkEmailMutation.isPending || generateOTPMutation.isPending}

            className="w-full bg-[#512F5C] hover:bg-[#4b2570] text-white p-6 "
          >
            {checkEmailMutation.isPending || generateOTPMutation.isPending
              ? "Processing..."
              : "Next"}
          </Button>
        </form>
      </div>
    </Form>
  );
};

export default Signup1;
