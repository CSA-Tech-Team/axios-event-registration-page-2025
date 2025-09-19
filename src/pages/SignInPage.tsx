/* eslint-disable @typescript-eslint/no-explicit-any */
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
//import pillar from "../assets/loginComp.svg";
//import emblem from "../assets/axiosEmblemGold.png";
import emblem from "@/assets/axiosemblem.png";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import useAxios from "@/hooks/useAxios";
import { ApiPaths, ERouterPaths } from "@/constants/enum";
import { useAuthStore } from "@/store/ApiStates";
import { useToast } from "@/hooks/use-toast";
import { Mails, LockKeyhole, EyeOff, Eye } from "lucide-react";
import { useState } from "react";

// ✅ Fix Schema
const FormSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().optional(), // just optional, no min validation here
});

// ✅ Extra schema for password validation
const PasswordSchema = z.object({
  password: z.string().min(1, "Password required"),
});

const SignIn = () => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { setAuthToken } = useAuthStore();
  const navigate = useNavigate();
  const { postWithoutAuth } = useAxios();
  const { toast } = useToast();

  const [step, setStep] = useState<"email" | "password">("email");
  const [showPassword, setShowPassword] = useState(false);

  const checkEmailMutation = useMutation({
    mutationFn: async (data: { email: string }) => {
      const response = await postWithoutAuth(ApiPaths.CHECK_EMAIL, data);
      return response.data; // 👈 ensure we only return the JSON body
    },
    onSuccess: (result) => {
      if (result.exists) {
        // ✅ Email exists → move to password step
        setStep("password");
      } else {
        // ❌ Email not found → show toast
        toast({
          title: "Invalid Email",
          description: "This email is not registered. Please sign up.",
          variant: "destructive",
        });
      }
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error?.response?.data?.message || "Something went wrong",
        variant: "destructive",
      });
    },
  });

  const signinMutation = useMutation({
    mutationFn: async (data: z.infer<typeof FormSchema>) => {
      return await postWithoutAuth(ApiPaths.LOGIN, data);
    },
    onSuccess: (response: any) => {
      const token = response?.data.token;
      setAuthToken(token);
      navigate(ERouterPaths.PROFILE);
    },
    onError: (error: any) => {
      toast({
        title: "Uh oh! Something went wrong.",
        description: error?.response?.data?.message || "Login failed",
      });
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    if (step === "email") {
      checkEmailMutation.mutate({ email: data.email });
    } else {
      // ✅ Run password validation separately
      const parsed = PasswordSchema.safeParse({ password: data.password });
      if (!parsed.success) {
        form.setError("password", {
          type: "manual",
          message: parsed.error.errors[0].message,
        });
        return;
      }
      signinMutation.mutate({
        email: data.email,
        password: data.password!,
      });
    }
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen w-full bg-[#171717] text-white px-6">
      {/* Logo */}
      <div className="flex flex-col items-center mb-10">
        <img src={emblem} alt="Logo" className="h-40 w-40 mb-2" />
        <h1 className="text-3xl font-bold text-[#EFAD8B]">Welcome Back</h1>
        <p className="text-sm text-gray-400">Sign in to continue</p>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full max-w-sm space-y-6"
        >
          {step === "email" && (
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
                        required
                        autoFocus
                        className="py-4 placeholder:text-[#B2B2B2] outline-none w-full border-0 bg-transparent"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {step === "password" && (
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
                        required
                        autoFocus
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
          )}

          <Button
            type="submit"
            className="w-full bg-[#512F5C] hover:bg-[#4b2570] text-white p-6"
            disabled={checkEmailMutation.isLoading || signinMutation.isLoading}
          >
            {step === "email"
              ? checkEmailMutation.isLoading
                ? "Checking..."
                : "Next"
              : signinMutation.isLoading
              ? "Signing in..."
              : "Sign in"}
          </Button>
        </form>
      </Form>

      <span className="flex gap-1 mt-6 text-sm">
        Don&apos;t have an account?
        <Link to={ERouterPaths.SIGNUP}>
          <div className="text-[#80466E] underline">Signup</div>
        </Link>
      </span>
    </div>
  );
};

export default SignIn;
