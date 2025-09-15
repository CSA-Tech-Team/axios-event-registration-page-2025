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
import pwd from "@/assets/pwd.svg";
import ref from "@/assets/ref.svg";
import { Button } from "../ui/button";
import { motion } from "framer-motion";
import { useMutation } from "@tanstack/react-query";
import useAxios from "@/hooks/useAxios";
import { ApiPaths, ERouterPaths } from "@/constants/enum";
import { Mails } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Dispatch, FC, SetStateAction } from "react";

interface Signup3Props {
  setActive: Dispatch<SetStateAction<number>>;
  referralCode: string | null;
}
const Signup3: FC<Signup3Props> = ({ setActive, referralCode }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const FormSchema = z.object({
    // phoneNumber: z.string().optional(),
    email: z.string(),
    password: z.string(),
    emailOTP: z.string(),
    referralCode: z.string().optional(),
  });
  const email = localStorage.getItem("email");
  const emailOTP = localStorage.getItem("emailOTP");
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: email || "",
      // phoneNumber: "",
      password: "",
      emailOTP: emailOTP || "",
      referralCode:referralCode||undefined
    },
  });
  const { postWithoutAuth } = useAxios();
  const registerMutation = useMutation({
    mutationFn: async (data: z.infer<typeof FormSchema>) => {
      const response = await postWithoutAuth(ApiPaths.REGISTER, data);
      return response;
    },
    onSuccess: async () => {
      navigate(ERouterPaths.SIGNIN);
    },
    onError: async (error: any) => {
      toast({
        title: "Uh oh! Something went wrong.",
        description: error?.response?.data?.message,
      });
      setActive(2);
    },
  });
  function onSubmit(data: z.infer<typeof FormSchema>) {
    registerMutation.mutateAsync(data);
  }
  return (
    <Form {...form}>
      <div className="md:w-1/2 w-full px-12 md:px-0">
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 mt-6 w-full "
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="">
                <FormControl>
                  <motion.div
                    animate={{ y: 0 }}
                    initial={{ y: 100 }}
                    transition={{ ease: "easeOut", duration: 0.5 }}
                  >
                    <div className="bg-[#232323]  rounded-md flex items-center font-lato  ">
                      <div className="p-4">
                        <Mails />
                      </div>
                      <Input
                        placeholder="Enter your email*"
                        type="email"
                        disabled
                        className="py-4  flex placeholder:text-[#B2B2B2] outline-none w-full border-0"
                        {...field}
                      />
                    </div>
                  </motion.div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="">
                <FormControl>
                  <motion.div
                    className="bg-[#232323] rounded-md flex items-center font-lato  "
                    animate={{ x: 0 }}
                    initial={{ x: -50 }}
                    transition={{ ease: "easeOut", duration: 0.5 }}
                  >
                    <img src={pwd} alt="" className="p-4 " />
                    <Input
                      placeholder="Enter your password"
                      type="password"
                      required
                      className="py-4  flex placeholder:text-[#B2B2B2] outline-none w-full border-0"
                      {...field}
                    />
                  </motion.div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="referralCode"
            render={({ field }) => (
              <FormItem className="">
                <FormControl>
                  <motion.div
                    animate={{ y: 0, x: 0 }}
                    initial={{ y: -50, x: -50 }}
                    transition={{ ease: "easeOut", duration: 0.5 }}
                    className="bg-[#232323] rounded-md flex items-center font-lato  "
                  >
                    <img src={ref} alt="" className="p-4 " />
                    <Input
                      placeholder="Enter referral code (if any)"
                      type="text"
                      // required
                      className="py-4  flex placeholder:text-[#B2B2B2] outline-none w-full border-0"
                      {...field}
                    />
                  </motion.div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="w-full bg-[#5D3288] hover:bg-[#5D3288] text-white p-6 "
          >
            Register
          </Button>
        </form>
      </div>
    </Form>
  );
};

export default Signup3;
