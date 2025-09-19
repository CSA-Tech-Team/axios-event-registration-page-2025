/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { motion } from "framer-motion";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";
import useAxios from "@/hooks/useAxios";
import { useMutation } from "@tanstack/react-query";
import { Mails } from "lucide-react";
import { ApiPaths } from "@/constants/enum";
import { toast } from "@/hooks/use-toast";

interface Signup2Components {
  setActive: Dispatch<SetStateAction<number>>;
}
const Signup2: FC<Signup2Components> = ({ setActive }) => {
  const [time, setTime] = useState(30);
  const [showResend, setShowResend] = useState(false);

  const FormSchema = z.object({
    email: z.string(),
    otp: z.string(),
  });
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: localStorage.getItem("email") as any,
      otp: "",
    },
  });

  useEffect(() => {
    if (time > 0) {
      setTimeout(() => {
        setTime(time - 1);
      }, 1000);
    } else {
      setShowResend(true);
    }
  }, [time]);

  const { postWithoutAuth } = useAxios();
  const generateOTPMutation = useMutation({
    mutationKey: ["register"],
    mutationFn: async (data: any) => {
      console.log(data);
      const response = await postWithoutAuth(ApiPaths.GENERATE_OTP, data);
      return response;
    },
    onSuccess: async () => {
      setTime(30);
      setShowResend(false);
    },
  });

  /*function onSubmit(data:z.infer<typeof FormSchema>) {
    localStorage.setItem("emailOTP", data.otp);
    setActive(3);
    // toast({
    //   title: "You submitted the following values:",
    //   description: (
    //     <pre className="mt-2 w-[340px] rounded-md bg-white p-4">
    //       <code className="text-black">{JSON.stringify(data, null, 2)}</code>
    //     </pre>
    //   ),
    // });
  }*/

    // resend OTP mutation
  const resendOtpMutation = useMutation({
    mutationFn: async (payload: { email: string }) => {
      return await postWithoutAuth(ApiPaths.GENERATE_OTP, payload);
    },
    onSuccess: () => {
      setTime(30);
      setShowResend(false);
      toast({ title: 'OTP sent', description: 'Check your email.' });
    },
    onError: () => {
      toast({
        title: 'Unable to generate OTP',
        description: 'Please try again later or use previously sent OTP.',
        variant: 'destructive',
      });
    },
  });

  // verify OTP mutation
  const verifyOTPMutation = useMutation({
    mutationFn: async (payload: { email: string; otp: string }) => {
      return await postWithoutAuth(ApiPaths.VERIFY_OTP_MAIL, payload);
    },
    // no onSuccess here — we'll handle in onSubmit to use exact data
  });

    // on submit: verify OTP first
  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      // disable button while verifying happens automatically via mutation.isLoading check below
      console.log("Verifying OTP for", data);
      await verifyOTPMutation.mutateAsync({ email: data.email, otp: data.otp });
      // success:
      localStorage.setItem('emailOTP', data.otp); // used later in final register step
      setActive(3);
    } catch (err: any) {
      toast({
        title: 'Invalid OTP',
        description:
          err?.response?.data?.message || 'OTP incorrect or expired. Please retry.',
        variant: 'destructive',
      });
    }
  }
  
  const isVerifying = verifyOTPMutation.isLoading;
  const isResending = resendOtpMutation.isLoading;

  const sendOTP = () => {
    console.log(localStorage.getItem("email"));
    generateOTPMutation.mutateAsync({
      email: localStorage.getItem("email"),
    });
  };
  return (
    <Form {...form}>
      <div className="w-full px-6 md:px-0 sm:px-0 max-[500px]:px-0">
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 mt-6 w-full  lg:px-10 md:px-10 sm:px-10 max-[500px]:px-7"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="">
                <FormControl>
                  <motion.div
                    animate={{ y: 0 }}
                    initial={{ y: 50 }}
                    transition={{ ease: "easeOut", duration: 0.5 }}
                  >
                    <div className="bg-[#232323]  rounded-md flex items-center font-lato  ">
                      <div className="p-4">
                        <Mails />
                      </div>
                      <Input
                        placeholder="Enter your email*"
                        type="text"
                        disabled
                        className="py-4  flex placeholder:text-[#B2B2B2] outline-none w-full border-0"
                        {...field}
                      />
                    </div>
                    <div className="text-[#C4C4C4] mt-1 text-md ">
                      Wrong email?{" "}
                      <button
                        className="text-[#80466E] ml-1"
                        onClick={() => setActive(1)}
                      >
                        Go back
                      </button>
                    </div>
                  </motion.div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="otp"
            render={({ field }) => (
              <FormItem className="">
                <FormControl>
                  <motion.div
                    className="w-full flex-col gap-2 flex justify-center"
                    animate={{ x: 0 }}
                    initial={{ x: -50 }}
                    transition={{ ease: "easeOut", duration: 0.5 }}
                  >
                    <div>Enter your OTP</div>
                    <InputOTP
                      maxLength={6}
                      className="w-full flex  justify-between"
                      {...field}
                      autoFocus={true}
                      required
                    >
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                      </InputOTPGroup>
                      <InputOTPGroup>
                        <InputOTPSlot index={1} />
                      </InputOTPGroup>
                      <InputOTPGroup>
                        <InputOTPSlot index={2} />
                      </InputOTPGroup>
                      <InputOTPGroup>
                        <InputOTPSlot index={3} />
                      </InputOTPGroup>
                      <InputOTPGroup>
                        <InputOTPSlot index={4} />
                      </InputOTPGroup>
                      <InputOTPGroup>
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                    {!showResend && (
                      <span className="text-md text-[#B2B2B2]">
                        Request OTP again in {time} seconds
                      </span>
                    )}
                    {showResend && (
                      <button
                        type="submit"
                        className="text-md flex justify-start text-[#80466E] underline"
                        onClick={() => {
                          form.resetField("otp"); // clear OTP field
                          //resendOtpMutation.mutate({ email: localStorage.getItem("email") || "" });
                          sendOTP();
                        }}
                      >
                        {isResending ? 'Sending...' : 'Request OTP again'}
                      </button>
                    )}
                  </motion.div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <motion.div
            animate={{ y: 0 }}
            initial={{ y: -50 }}
            transition={{ ease: "easeOut", duration: 0.5 }}
          >
            <Button
              type="submit"
              className="w-full bg-[#512F5C] hover:bg-[#4b2570] text-white p-6 "
            >
              {isVerifying ? 'Verifying...' : 'Next'}
            </Button>
          </motion.div>
        </form>
      </div>
    </Form>
  );
};

export default Signup2;
