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

  function onSubmit(data:z.infer<typeof FormSchema>) {
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
  }

  const sendOTP = () => {
    console.log(localStorage.getItem("email"));
    generateOTPMutation.mutateAsync({
      email: localStorage.getItem("email"),
    });
  };
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
                    <span className="text-[#C4C4C4]">
                      Wrong email?{" "}
                      <button
                        className="text-white"
                        onClick={() => setActive(1)}
                      >
                        Go back
                      </button>
                    </span>
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
                        className="text-md flex justify-start"
                        onClick={sendOTP}
                      >
                        Request OTP again
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
              className="w-full bg-[#5D3288] hover:bg-[#5D3288] text-white p-6 "
            >
              Next
            </Button>
          </motion.div>
        </form>
      </div>
    </Form>
  );
};

export default Signup2;
