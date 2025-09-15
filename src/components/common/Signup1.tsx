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
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    generateOTPMutation.mutateAsync(data);
    // toast({
    //   title: "You submitted the following values:",
    //   description: (
    //     <pre className="mt-2 w-[340px] rounded-md bg-white p-4">
    //       <code className="text-black">{JSON.stringify(data, null, 2)}</code>
    //     </pre>
    //   ),
    // });
  }

  return (
    <Form {...form}>
      <div className="md:w-1/2 w-full px-12 md:px-0">
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 mt-6 w-full"
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
            className="w-full bg-[#5D3288] hover:bg-[#5D3288] text-white p-6 "
          >
            Next
          </Button>
        </form>
      </div>
    </Form>
  );
};

export default Signup1;
