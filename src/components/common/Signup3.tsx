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
import { Eye, EyeOff, Mails, LockKeyhole } from "lucide-react";
//import pillar from "@/assets/pillar.svg";
import { useState } from "react";

import { motion } from "framer-motion";
import { useMutation } from "@tanstack/react-query";
import useAxios from "@/hooks/useAxios";
import { ApiPaths, ERouterPaths } from "@/constants/enum";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Dispatch, FC, SetStateAction } from "react";

interface Signup3Props {
  setActive: Dispatch<SetStateAction<number>>;
  referralCode: string | null;
}
const Signup3: FC<Signup3Props> = ({ setActive, referralCode }) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  // password toggle states
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Zod schema
  const FormSchema = z
    .object({
      email: z.string().email("Invalid email"),
      password: z.string().min(6, "Password must be at least 6 chars"),
      emailOTP : z.string().min(6, "OTP must be 6 chars"),  
      confirmPassword: z.string(),
      referralCode: z.string().optional(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    });

  const email = localStorage.getItem("email") || "";
  const emailOTP = localStorage.getItem("emailOTP");

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email : email || "",
      password: "",
      confirmPassword: "",
      emailOTP : emailOTP || "",
      referralCode: referralCode || undefined,
    },
  });

  const { postWithoutAuth } = useAxios();

  const registerMutation = useMutation({
    mutationFn: async (data: z.infer<typeof FormSchema>) => {
      console.log("The Data is : ",data);
      const response = await postWithoutAuth(ApiPaths.REGISTER, data);
      return response;
    },
    onSuccess: async () => {
      toast({
        title: "Registration Successful",
        description: "You can now sign in with your credentials",
      });
      localStorage.removeItem("email");
      localStorage.removeItem("emailOTP");
      navigate(ERouterPaths.SIGNIN);
    },
    onError: async (error: any) => {
      toast({
        title: "Uh oh! Something went wrong.",
        description: error?.response?.data?.message,
      });
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    registerMutation.mutateAsync(data);
  }

  return (
    <div className="flex flex-col items-center w-full bg-[#171717] text-white px-6 md:px-0 sm:px-0 max-[500px]:px-0 mt-3">
      {/* Logo + Heading */}
      <div className="flex flex-col items-center mb-5">
        {/*<img src={} alt="Logo" className="h-28 w-28 mb-4" />*/}
        <h1 className="text-3xl font-bold">Create Account</h1>
        <p className="text-sm text-gray-400">Sign up to get started</p>
      </div>

      {/* Signup Form */}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full max-w-sm space-y-6"
        >
          {/* Email */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="bg-[#232323] rounded-md flex items-center font-lato">
                    <div className="p-4">
                      <Mails />
                    </div>
                    <Input
                      placeholder="Enter your email"
                      type="email"
                      disabled
                      className="py-4 placeholder:text-[#B2B2B2] outline-none w-full border-0 bg-transparent"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Password */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="bg-[#232323] rounded-md flex items-center font-lato">
                    <div className="p-4">
                      <LockKeyhole />
                    </div>
                    <Input
                      placeholder="Enter your password"
                      type={showPassword ? "text" : "password"}
                      className="py-4 placeholder:text-[#B2B2B2] outline-none w-full border-0 bg-transparent"
                      {...field}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="p-4 text-gray-400"
                    >
                      {showPassword ? <EyeOff /> : <Eye />}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Confirm Password */}
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="bg-[#232323] rounded-md flex items-center font-lato">
                    <div className="p-4">
                      <LockKeyhole />
                    </div>
                    <Input
                      placeholder="Re-enter your password"
                      type={showConfirm ? "text" : "password"}
                      className="py-4 placeholder:text-[#B2B2B2] outline-none w-full border-0 bg-transparent"
                      {...field}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm((prev) => !prev)}
                      className="p-4 text-gray-400"
                    >
                      {showConfirm ? <EyeOff /> : <Eye />}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Referral Code */}
          <FormField
            control={form.control}
            name="referralCode"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="bg-[#232323] rounded-md flex items-center font-lato">
                    <img src={ref} alt="" className="p-4" />
                    <Input
                      placeholder="Enter referral code (if any)"
                      type="text"
                      disabled={referralCode ? true : false}
                      className="py-4 placeholder:text-[#B2B2B2] outline-none w-full border-0 bg-transparent"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full bg-[#512F5C] hover:bg-[#4b2570] text-white p-6"
            disabled={registerMutation.isLoading}
          >
            {registerMutation.isLoading ? "Registering..." : "Register"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default Signup3;
