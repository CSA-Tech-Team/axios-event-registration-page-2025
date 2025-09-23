/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { Input } from "../ui/input";
import {
  Badge,
  Book,
  Building,
  Copy,
  Mails,
  PhoneIcon,
  Timer,
  User,
  UserPlus,
} from "lucide-react";
import "react-international-phone/style.css";
import { useAuthStore } from "@/store/ApiStates";
import { Button } from "../ui/button";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useAxios from "@/hooks/useAxios";
import { ApiPaths } from "@/constants/enum";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogDescription,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Label } from "../ui/label";
import { useToast } from "@/hooks/use-toast";
import FloatingWhatsAppButton from "./FloatingWhatsAppButton";

const EditProfile = () => {
  const { getUser } = useAuthStore();
  const user: any = getUser();
  const [open, setOpen] = useState(false);
  const [time, setTime] = useState<number>(0);
  const [showResend, setShowResend] = useState(false);
  //
  const [rememberRollNo, setRememberRollNo] = useState<boolean | null>(null);

  const queryClient = useQueryClient();
  useEffect(() => {
    if (!showResend) {
      if (time > 1) {
        setTimeout(() => {
          setTime(time - 1);
        }, 1000);
      } else if (time == 1) {
        setShowResend(true);
      }
    }
  }, [showResend, time]);
  useEffect(() => {
    form.setValue("email", user?.email);
    form.setValue("phoneNumber", user?.phoneNumber?.slice(4));
    form.setValue("collegeName", user?.profile?.collegeName);
    form.setValue("firstName", user?.profile?.firstName);
    form.setValue("lastName", user?.profile?.lastName);
    form.setValue("yearOfStudy", user?.profile?.yearOfStudy);
    form.setValue("branchOfStudy", user?.profile?.branchOfStudy);
    form.setValue("degreeOfStudy", user?.profile?.degreeOfStudy);
    form.setValue("gender", user?.gender);
    form.setValue("rollNumber", user?.profile?.rollNumber);
    form.setValue("referralCode", user?.referralCode);
    console.log(user);
  }, [user]);

  const FormSchema = z.object({
    firstName: z.string(),
    lastName: z.string(),
    phoneNumber: z.string().max(10),
    gender: z.string(),
    email: z.string().optional(),
    referralCode: z.string().optional(),
    collegeName: z.string().optional(),
    yearOfStudy: z.string().optional(),
    degreeOfStudy: z.string().optional(),
    branchOfStudy: z.string().optional(),
    rollNumber: z.string().optional(),   
  });
  const { getIsProfileCompleted, setIsProfileCompleted } = useAuthStore();
  const isProfileCompleted = getIsProfileCompleted();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      firstName: (user?.profile?.firstName as any) || "",
      lastName: (user?.profile?.lastName as any) || "",
      phoneNumber: (user?.phoneNumber?.slice(4) as any) || "",
      email: (user?.email as any) || "",
      collegeName: (user?.profile?.collegeName as any) || "",
      gender: (user?.gender as any) || "",
      yearOfStudy: (user?.profile?.yearOfStudy as any) || "",
      degreeOfStudy: (user?.profile?.degreeOfStudy as any) || "",
      rollNumber: (user?.profile?.rollNumber as any) || "",
      branchOfStudy: (user?.profile?.branchOfStudy as any) || "",
    },
  });

  const [gender, setGender] = useState(user?.gender ?? "MALE");
  const [otp, setOTP] = useState("123456");
  const { toast } = useToast();
  const { putWithAuth, postWithAuth, getWithoutAuth } = useAxios();
  const generatePhoneOtp = useMutation({
    mutationFn: async () => {
      const response = await postWithAuth(ApiPaths.GENERATE_OTP_PHONE);
      console.log(response?.data);
      setShowResend(false);
      setTime(60);
      return response?.data;
    },
    onSuccess: async () => {
      // setOpen(true);
      
      //verifyOTP.mutateAsync();

      setOpen(true);  // open OTP dialog
      toast({
        title: "OTP sent",
        description: "Please enter the OTP sent to your phone.",
      });
  
    },
    onError: () => {
      //verifyOTP.mutateAsync();

      // setOpen(true);
      toast({
        title: "Unable to generate OTP",
        description: `Kindly use the previously sent OTP`,
      });
    },
  });

  const updateUserMutation = useMutation({
    mutationFn: async (data: any) => {
      console.log("Data we have is : ",{ data, gender });
      const response = await putWithAuth(ApiPaths.USER, {
        profile: {
          firstName: data.firstName,
          lastName: data.lastName,
          collegeName: selectedCollege,
          yearOfStudy: selectedYear,
          degreeOfStudy: user?.role === "ALUMNI" ? "NOT APPLICABLE" : selectedCourse,
          branchOfStudy: "DUMMY",
          rollNumber:
          user?.role === "ALUMNI"
            ? rememberRollNo
              ? data.rollNumber
              : "NOT REMEMBERED"
            : undefined,
        },
        gender: gender,
        phoneNumber: "+91 " + data?.phoneNumber,
      });
      console.log(data);
      console.log(response);
      return response;
    },
    onSuccess: () => {
      generatePhoneOtp.mutateAsync();
      toast({
        title: "Verify phone number",
        description: "Verify phone number",
      });
    },
    onError: (error) => {
      console.log(error);
      toast({
        title: "Uh oh! Something went wrong.",
        description: `${error}`,
      });
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    updateUserMutation.mutateAsync(data as any);
  }

  const verifyOTP = useMutation({
    mutationFn: async () => {
      const response = await postWithAuth(ApiPaths.VERIFY_OTP, {
        otp,
      });
      console.log(response?.data);
      return response?.data;
    },
    onSuccess: async () => {
      setIsProfileCompleted(true);
      setOpen(false);
      queryClient.invalidateQueries("user" as any);
      toast({
        title: "Success",
        description: "Phone number verified",
      });
    },
    onError: async () => {
      toast({
        title: "Uh oh! Something went wrong.",
        description: "Invalid OTP",
      });
    },
  });
  const copyReferral = () => {
    try {
      const referralCode = user?.referralCode;
      if (!referralCode) {
        toast({
          title: "No referral code found",
          description: "Please try again later.",
          variant: "destructive",
        });
        return;
      }

      const referralLink = `http://10.1.234.4:3000/signup?referralCode=${referralCode}`;

      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(referralLink);
      } else {
        // fallback for HTTP
        const textArea = document.createElement("textarea");
        textArea.value = referralLink;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      }

      toast({
        title: "Referral link copied 🎉",
        description: "Share this link with your friends.",
      });
    } catch (err) {
      console.error("Clipboard copy failed", err);
      toast({
        title: "Copy failed",
        description: "Your browser may not support clipboard access.",
        variant: "destructive",
      });
    }
  };

  const sendOTP = () => {
    generatePhoneOtp.mutateAsync();
  };

  const [college, setCollege] = useState<any[]>();
  const [selectedCollege, setSelectedCollege] = useState<string>(
    user?.profile?.collegeName ?? ""
  );
  const [selectedCourse, setSelectedCourse] = useState<string>(
    user?.profile?.degreeOfStudy ?? ""
  );
  const [selectedYear, setSelectedYear] = useState<string>(
    user?.profile?.yearOfStudy ?? ""
  );
  const [courses, setCourses] = useState<string[]>();


  const { isSuccess } = useQuery({
    queryKey: ["college"],
    queryFn: async () => {
      if (!isProfileCompleted) {
        const response = await getWithoutAuth(ApiPaths.COLLEGE);
        setCollege(response?.data as any);
        return response?.data;
      }
      return true;
    },
  });

  useEffect(() => {
    setCourses(
      college?.find((elt: any) => elt.name == selectedCollege)?.courses ?? []
    );
  }, [college, selectedCollege]);

  if (isSuccess) {
    return (
    <div className="flex w-full h-full justify-center items-start overflow-auto bg-gradient-to-br from-[#0f0f0f] to-[#1a1a1a] p-6 scrollbar-hide">
      {/* <FloatingWhatsAppButton inviteLink="https://chat.whatsapp.com/K6ZurxzU7siAY1ZRxeiL4K" /> */}
      <div className="w-full lg:w-4/5 xl:w-3/5 bg-white/5 backdrop-blur-md rounded-2xl shadow-2xl p-8">
        {/* ID Header */}
        <h2 className="text-2xl md:text-3xl font-semibold text-center text-white mb-10">
          Your ID: <span className="text-[#80466E]">{user?.id}</span>
        </h2>

        {/* Form */}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {/* Phone Number */}
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <Label className="text-gray-300">Phone Number</Label>
                  <FormControl>
                    <div className="flex items-center bg-[#1f1f1f] rounded-xl px-4 py-3 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500">
                      <PhoneIcon className="text-gray-400 mr-3" />
                      <Input
                        {...field}
                        type="text"
                        placeholder="Enter your phone number"
                        required
                        disabled={isProfileCompleted}
                        className="bg-transparent border-none focus:ring-0 text-white placeholder-gray-400 w-full"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <Label className="text-gray-300">Email</Label>
                  <FormControl>
                    <div className="flex items-center bg-[#1f1f1f] rounded-xl px-4 py-3 shadow-sm">
                      <Mails className="text-gray-400 mr-3" />
                      <Input
                        {...field}
                        type="text"
                        disabled
                        placeholder="Enter your email"
                        className="bg-transparent border-none text-white placeholder-gray-400 w-full"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* First Name */}
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <Label className="text-gray-300">First Name</Label>
                  <FormControl>
                    <div className="flex items-center bg-[#1f1f1f] rounded-xl px-4 py-3 shadow-sm">
                      <Badge className="text-gray-400 mr-3" />
                      <Input
                        {...field}
                        type="text"
                        placeholder="Enter your first name"
                        required
                        disabled={isProfileCompleted}
                        className="bg-transparent border-none text-white placeholder-gray-400 w-full"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Last Name */}
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <Label className="text-gray-300">Last Name</Label>
                  <FormControl>
                    <div className="flex items-center bg-[#1f1f1f] rounded-xl px-4 py-3 shadow-sm">
                      <Badge className="text-gray-400 mr-3" />
                      <Input
                        {...field}
                        type="text"
                        placeholder="Enter your last name"
                        required
                        disabled={isProfileCompleted}
                        className="bg-transparent border-none text-white placeholder-gray-400 w-full"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Gender */}
            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <Label className="text-gray-300">Gender</Label>
                  <FormControl>
                    <div className="flex items-center bg-[#1f1f1f] rounded-xl px-4 py-3">
                      <User className="text-gray-400 mr-3" />
                      {!isProfileCompleted ? (
                        <Select
                          onValueChange={(e) => setGender(e as any)}
                          value={gender}
                        >
                          <SelectTrigger className="bg-transparent border-none text-white w-full">
                            <SelectValue placeholder="Select Gender" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="MALE">Male</SelectItem>
                            <SelectItem value="FEMALE">Female</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <Input
                          {...field}
                          type="text"
                          disabled
                          className="bg-transparent border-none text-white placeholder-gray-400 w-full"
                        />
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Referral Code */}
            {isProfileCompleted && (
              <>
              { user && user.role!='ALUMNI' && <FormField
                control={form.control}
                name="referralCode"
                render={({ field }) => (
                  <FormItem>
                    <Label className="text-gray-300">Referral Code</Label>
                    <FormControl>
                      <div className="flex items-center bg-[#1f1f1f] rounded-xl px-4 py-3 shadow-sm">
                        <UserPlus className="text-gray-400 mr-3" />
                        <Input
                          {...field}
                          type="text"
                          disabled
                          className="bg-transparent border-none text-white placeholder-gray-400 w-full"
                        />
                        <div
                          className="px-4 cursor-pointer"
                          onClick={() => copyReferral()}
                        >
                          <Copy className="text-gray-400" />
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />}
              </>
            )}

            {/* College */}
            {user && user.role!='ALUMNI' && <FormField
              control={form.control}
              name="collegeName"
              render={({ field }) => (
                <FormItem>
                  <Label className="text-gray-300">College</Label>
                  <FormControl>
                    <div className="flex items-center bg-[#1f1f1f] rounded-xl px-4 py-3">
                      <Building className="text-gray-400 mr-3" />
                      {!isProfileCompleted ? (
                        <Select
                          onValueChange={(e) => setSelectedCollege(e as any)}
                          value={selectedCollege}
                        >
                          <SelectTrigger className="bg-transparent border-none text-white w-full">
                            <SelectValue placeholder="Select College" />
                          </SelectTrigger>
                          <SelectContent>
                            {college?.map((elt: any) => (
                              <SelectItem key={elt.name} value={elt.name}>
                                {elt.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <Input
                          {...field}
                          type="text"
                          disabled
                          className="bg-transparent border-none text-white placeholder-gray-400 w-full"
                        />
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />}

            {/* Year of Study */}
            { user && user.role!='ALUMNI' && <FormField
              control={form.control}
              name="yearOfStudy"
              render={({ field }) => (
                <FormItem>
                  <Label className="text-gray-300">Year of Study</Label>
                  <FormControl>
                    <div className="flex items-center bg-[#1f1f1f] rounded-xl px-4 py-3">
                      <Timer className="text-gray-400 mr-3" />
                      {!isProfileCompleted ? (
                        <Select
                          onValueChange={(e) => setSelectedYear(e as any)}
                          value={selectedYear}
                        >
                          <SelectTrigger className="bg-transparent border-none text-white w-full">
                            <SelectValue placeholder="Select Year" />
                          </SelectTrigger>
                          <SelectContent>
                            {[1, 2, 3, 4, 5, 6].map((year) => (
                              <SelectItem key={year} value={year.toString()}>
                                {year}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <Input
                          {...field}
                          type="text"
                          disabled
                          className="bg-transparent border-none text-white placeholder-gray-400 w-full"
                        />
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />}

            {/* Course */}
            {user && user.role === "ALUMNI" ? (
  <FormField
    control={form.control}
    name="rollNumber"
    render={({ field }) => (
      <FormItem>
        <Label className="text-gray-300 flex items-center">
          { !isProfileCompleted  ? "Do you remember your Roll No? 😅":"Roll Number"}
        </Label>
        <FormControl>
          <div className="flex flex-col gap-3 bg-[#1f1f1f] rounded-xl px-4 py-3">
            {!isProfileCompleted ? (
              <>
                {/* Funny toggle */}
                <div className="flex gap-4 items-center">
                  <button
                    type="button"
                    onClick={() => setRememberRollNo(true)}
                    className={`px-3 py-2 rounded-lg ${
                      rememberRollNo
                        ? "bg-green-600 text-white"
                        : "bg-gray-700 text-gray-300"
                    }`}
                  >
                    Yes 😎
                  </button>
                  <button
                    type="button"
                    onClick={() => setRememberRollNo(false)}
                    className={`px-3 py-2 rounded-lg ${
                      rememberRollNo === false
                        ? "bg-red-600 text-white"
                        : "bg-gray-700 text-gray-300"
                    }`}
                  >
                    No 😅
                  </button>
                </div>

                {/* Show input only if they said Yes */}
                {rememberRollNo && (
                  <Input
                    {...field}
                    type="text"
                    placeholder="Enter your Roll No"
                    className="bg-transparent border-none text-white placeholder-gray-400 w-full mt-2"
                  />
                )}
              </>
            ) : (
              <Input
                {...field}
                type="text"
                disabled
                className="bg-transparent border-none text-white placeholder-gray-400 w-full"
              />
            )}
          </div>
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
) : (
  <FormField
    control={form.control}
    name="degreeOfStudy"
    render={({ field }) => (
      <FormItem>
        <Label className="text-gray-300">Course</Label>
        <FormControl>
          <div className="flex items-center bg-[#1f1f1f] rounded-xl px-4 py-3">
            <Book className="text-gray-400 mr-3" />
            {!isProfileCompleted ? (
              <Select
                onValueChange={(e) => setSelectedCourse(e as any)}
                value={selectedCourse}
              >
                <SelectTrigger className="bg-transparent border-none text-white w-full">
                  <SelectValue placeholder="Select Course" />
                </SelectTrigger>
                <SelectContent>
                  {courses?.map((elt: any) => (
                    <SelectItem key={elt} value={elt}>
                      {elt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <Input
                {...field}
                type="text"
                disabled
                className="bg-transparent border-none text-white placeholder-gray-400 w-full"
              />
            )}
          </div>
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
)}


            {/* Submit Button */}
            {!isProfileCompleted && (
              <div className="col-span-1 md:col-span-2 flex justify-center mt-8">
                <Button
                  type="submit"
                  className="bg-[#80466E] text-center bg-[length:200%_100%] bg-right hover:bg-[linear-gradient(to_left,#80466E,#2D1F44)] hover:bg-left text-white px-8 py-2.5  rounded-md font-medium shadow-lg transition-all duration-700 ease-in-out"
                >
                  <Dialog open={open} onOpenChange={setOpen}>
                            Complete Profile
                            <DialogContent className="bg-[#121212] shadow-lg text-white"
                              onInteractOutside={(e) => e.preventDefault()} // ⛔ prevent outside click
                              onEscapeKeyDown={(e) => e.preventDefault()}
                            >
                              <DialogHeader>
                                <DialogTitle>Verify Phone Number</DialogTitle>
                                <DialogDescription>
                                  Enter otp sent to{" "}
                                  {form.getValues()?.phoneNumber}
                                </DialogDescription>
                                <DialogDescription>
                                  {!showResend && (
                                    <span className="text-md text-[#B2B2B2]">
                                      Request OTP again in {time} seconds
                                    </span>
                                  )}
                                  {showResend && (
                                    <button
                                      type="submit"
                                      className="text-md text-white justify-center w-full  flex"
                                      onClick={sendOTP}
                                    >
                                      Request OTP again
                                    </button>
                                  )}
                                </DialogDescription>
                                <div className="flex lg:flex-row flex-col p-3 t items-center">
                                  <InputOTP
                                    maxLength={6}
                                    className="w-3/4 flex  justify-between"
                                    onChange={(e) => setOTP(e)}
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
                                  <div className="p-3">
                                    <Button
                                      className="bg-Violet"
                                      onClick={() => {
                                        verifyOTP.mutateAsync();
                                      }}
                                    >
                                      Verify OTP
                                    </Button>
                                  </div>
                                </div>
                              </DialogHeader>
                            </DialogContent>
                          </Dialog>
                </Button>
              </div>
            )}
            
          </form>
        </Form>
      </div>
    </div>
  );
  }
};

export default EditProfile;

{/**
return (
      <div className="flex w-full scrollbar flex-wrap justify-between h-full overflow-auto">
        <div className="w-full lg:block mb-16 ">
          <div className="w-full  text-white pt-7 pb-5 items-center align-middle shadow-md rounded-lg ">
            <div className="lg:pt-12 p-6 lg:p-0 text-3xl flex items-center gap-4">
              &nbsp;&nbsp;Your ID : {user?.id}
            </div>
            <div className="flex flex-col items-center  w-full gap-4 lg:p-0 p-0">
              <Form {...form}>
                <div className="w-full px-4">
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6 mt-6 w-full flex flex-col justify-start"
                  >
                    <div className="flex w-full flex-wrap justify-start gap-x-12 ">
                      <div className="lg:w-1/3 w-full">
                        <FormField
                          control={form.control}
                          name="phoneNumber"
                          render={({ field }) => (
                            <FormItem className="w-full">
                              <Label>Phone Number</Label>
                              <FormControl>
                                <div>
                                  <div className="bg-[#232323] w-full  rounded-md flex items-center font-lato  ">
                                    <div className="p-4">
                                      <PhoneIcon />
                                    </div>
                                    <span
                                      className={`${
                                        isProfileCompleted
                                          ? "text-[#B2B2B2] text-sm"
                                          : ""
                                      }`}
                                    >
                                      +91{" "}
                                    </span>
                                    <Input
                                      required
                                      type="text"
                                      disabled={isProfileCompleted}
                                      className="py-4 items-center flex placeholder:text-[#B2B2B2] outline-none w-full border-0"
                                      {...field}
                                      placeholder="Enter your phone number*"
                                    />
                                  </div>
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="lg:w-1/3 w-full">
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem className="">
                              <Label>Email</Label>
                              <FormControl>
                                <div>
                                  <div className="bg-[#232323]  rounded-md flex items-center font-lato  ">
                                    <div className="p-4">
                                      <Mails />
                                    </div>
                                    <Input
                                      placeholder="Enter your email*"
                                      type="text"
                                      disabled
                                      className="py-4 items-center flex placeholder:text-[#B2B2B2] outline-none w-full border-0"
                                      {...field}
                                    />
                                  </div>
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                    <div className="flex w-full flex-wrap justify-start gap-x-12">
                      <div className="lg:w-1/3 w-full">
                        <FormField
                          control={form.control}
                          name="firstName"
                          render={({ field }) => (
                            <FormItem className="">
                              <Label>First name</Label>
                              <FormControl>
                                <div>
                                  <div className="bg-[#232323]  rounded-md flex items-center font-lato  ">
                                    <div className="p-4">
                                      <Badge />
                                    </div>
                                    <Input
                                      placeholder="Enter your name*"
                                      type="text"
                                      required
                                      disabled={isProfileCompleted}
                                      className="py-4 items-center flex placeholder:text-[#B2B2B2] outline-none w-full border-0"
                                      {...field}
                                    />
                                  </div>
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="lg:w-1/3 w-full">
                        <FormField
                          control={form.control}
                          name="lastName"
                          render={({ field }) => (
                            <FormItem className="">
                              <Label>Last name</Label>
                              <FormControl>
                                <div>
                                  <div className="bg-[#232323]  rounded-md flex items-center font-lato  ">
                                    <div className="p-4">
                                      <Badge />
                                    </div>
                                    <Input
                                      placeholder="Enter your name*"
                                      type="text"
                                      required
                                      disabled={isProfileCompleted}
                                      className="py-4 items-center flex placeholder:text-[#B2B2B2] outline-none w-full border-0"
                                      {...field}
                                    />
                                  </div>
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-x-12 gap-y-8">
                      <div className="lg:w-1/3 w-full">
                        <FormField
                          control={form.control}
                          name="gender"
                          render={({ field }) => (
                            <FormItem className="text-white">
                              <Label>Gender</Label>
                              <FormControl>
                                <div>
                                  <div className="bg-[#232323]  rounded-md flex items-center font-lato  ">
                                    <div className="p-4 text-white">
                                      <User />
                                    </div>
                                    {!isProfileCompleted ? (
                                      <Select
                                        onValueChange={(e) =>
                                          setGender(e as any)
                                        }
                                        required
                                        value={gender}
                                        // {...field}
                                      >
                                        <SelectTrigger className="text-white border-0 border-none">
                                          <SelectValue
                                            placeholder="Gender"
                                            // {...field}
                                          />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="FEMALE">
                                            Female
                                          </SelectItem>
                                          <SelectItem value="MALE">
                                            Male
                                          </SelectItem>
                                        </SelectContent>
                                      </Select>
                                    ) : (
                                      <Input
                                        type="text"
                                        disabled
                                        className="py-4 items-center flex placeholder:text-[#B2B2B2] outline-none w-full border-0"
                                        {...field}
                                      />
                                    )}
                                  </div>
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      {isProfileCompleted && (
                        <div className="lg:w-1/3 w-full ">
                          <FormField
                            control={form.control}
                            name="referralCode"
                            render={({ field }) => (
                              <FormItem className="">
                                <Label>Referral Code</Label>
                                <FormControl>
                                  <div>
                                    <div className="bg-[#232323]  rounded-md flex items-center font-lato  ">
                                      <div className="p-4">
                                        <UserPlus />
                                      </div>
                                      <Input
                                        type="text"
                                        disabled
                                        className="py-4 items-center flex placeholder:text-[#B2B2B2] outline-none w-full border-0"
                                        {...field}
                                      />
                                      <div
                                        className="px-4"
                                        onClick={() => copyReferral()}
                                      >
                                        <Copy />
                                      </div>
                                    </div>
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      )}
                      <div className="lg:w-1/3 w-full ">
                        <FormField
                          control={form.control}
                          name="collegeName"
                          render={({ field }) => (
                            <FormItem className="">
                              <Label>College name</Label>
                              <FormControl>
                                <div>
                                  <div className="bg-[#232323]  rounded-md flex items-center font-lato  ">
                                    <div className="p-4">
                                      <Building />
                                    </div>
                                    {!isProfileCompleted ? (
                                      <Select
                                        onValueChange={(e) =>
                                          setSelectedCollege(e as any)
                                        }
                                        required
                                        value={selectedCollege}
                                        // {...field}
                                      >
                                        <SelectTrigger className="text-white border-0 border-none">
                                          <SelectValue
                                            placeholder="College"
                                            // {...field}
                                          />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {college?.map((elt: any) => (
                                            <SelectItem value={elt.name}>
                                              {elt.name}
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                    ) : (
                                      <Input
                                        type="text"
                                        disabled
                                        className="py-4 items-center flex placeholder:text-[#B2B2B2] outline-none w-full border-0"
                                        {...field}
                                      />
                                    )}
                                    {/* <Input
                                      placeholder="Enter your college name"
                                      type="text"
                                      disabled={isProfileCompleted}
                                      required
                                      className="py-4 items-center flex placeholder:text-[#B2B2B2] outline-none w-full border-0"
                                      {...field}
                                    /> *}
                                  </div>
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="lg:w-1/3 w-full ">
                        <FormField
                          control={form.control}
                          name="yearOfStudy"
                          render={({ field }) => (
                            <FormItem className="">
                              <Label>Year of study</Label>
                              <FormControl>
                                <div>
                                  <div className="bg-[#232323]  rounded-md flex items-center font-lato  ">
                                    <div className="p-4">
                                      <Timer />
                                    </div>
                                    {!isProfileCompleted ? (
                                      <Select
                                        onValueChange={(e) => {
                                          setSelectedYear(e as any);
                                        }}
                                        required
                                        value={selectedYear}
                                      >
                                        <SelectTrigger className="text-white border-0 border-none">
                                          <SelectValue
                                            placeholder="Year of Study"
                                            // {...field}
                                          />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="1">1</SelectItem>
                                          <SelectItem value="2">2</SelectItem>
                                          <SelectItem value="3">3</SelectItem>
                                          <SelectItem value="4">4</SelectItem>
                                          <SelectItem value="5">5</SelectItem>
                                          <SelectItem value="6">6</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    ) : (
                                      <Input
                                        type="text"
                                        disabled
                                        className="py-4 items-center flex placeholder:text-[#B2B2B2] outline-none w-full border-0"
                                        {...field}
                                      />
                                    )}
                                    {/* <Input
                                      required
                                      placeholder="Enter your year of study"
                                      type="number"
                                      disabled={isProfileCompleted}
                                      className="py-4 items-center flex placeholder:text-[#B2B2B2] outline-none w-full border-0"
                                      {...field}
                                    /> /}
                                  </div>
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="lg:w-1/3 w-full">
                        <FormField
                          control={form.control}
                          name="degreeOfStudy"
                          render={({ field }) => (
                            <FormItem className="">
                              <Label>Course</Label>
                              <FormControl>
                                <div>
                                  <div className="bg-[#232323]  rounded-md flex items-center font-lato  ">
                                    <div className="p-4">
                                      <Book />
                                    </div>
                                    {!isProfileCompleted ? (
                                      <Select
                                        onValueChange={(e) =>
                                          setSelectedCourse(e as any)
                                        }
                                        required
                                        value={selectedCourse}
                                        // {...field}
                                      >
                                        <SelectTrigger className="text-white border-0 border-none">
                                          <SelectValue placeholder="Course" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {courses?.map((elt: any) => (
                                            <SelectItem value={elt}>
                                              {elt}
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                    ) : (
                                      <Input
                                        type="text"
                                        disabled
                                        className="py-4 items-center flex placeholder:text-[#B2B2B2] outline-none w-full border-0"
                                        {...field}
                                      />
                                    )}
                                    {/* <Input
                                      placeholder="Enter your degree"
                                      type="text"
                                      disabled={isProfileCompleted}
                                      required
                                      className="py-4 items-center flex placeholder:text-[#B2B2B2] outline-none w-full border-0"
                                      {...field}
                                    /> /}
                                  </div>
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      {/* <div className="lg:w-1/3 w-full">
                        <FormField
                          control={form.control}
                          name="branchOfStudy"
                          render={({ field }) => (
                            <FormItem className="">
                              <Label>Branch of Study</Label>
                              <FormControl>
                                <div>
                                  <div className="bg-[#232323]  rounded-md flex items-center font-lato  ">
                                    <div className="p-4">
                                      <BookMarked />
                                    </div>
                                    <Input
                                      placeholder="Enter your branch of study"
                                      type="text"
                                      disabled={isProfileCompleted}
                                      required
                                      className="py-4 items-center flex placeholder:text-[#B2B2B2] outline-none w-full border-0"
                                      {...field}
                                    />
                                  </div>
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div> /}
                    </div>

                    {!isProfileCompleted && (
                      <div className="w-full">
                        <Button
                          type="submit"
                          className="bg-[#5D3288] lg:w-1/5 md:w-1/3 w-full hover:bg-[#5D3288] text-white p-6 "
                          // onClick={()=>onSubmit()}
                        >
                          <Dialog open={open} onOpenChange={setOpen}>
                            Complete Profile
                            <DialogContent className="bg-[#121212] shadow-lg text-white">
                              <DialogHeader>
                                <DialogTitle>Verify Phone Number</DialogTitle>
                                <DialogDescription>
                                  Enter otp sent to{" "}
                                  {form.getValues()?.phoneNumber}
                                </DialogDescription>
                                <DialogDescription>
                                  {!showResend && (
                                    <span className="text-md text-[#B2B2B2]">
                                      Request OTP again in {time} seconds
                                    </span>
                                  )}
                                  {showResend && (
                                    <button
                                      type="submit"
                                      className="text-md text-white justify-center w-full  flex"
                                      onClick={sendOTP}
                                    >
                                      Request OTP again
                                    </button>
                                  )}
                                </DialogDescription>
                                <div className="flex lg:flex-row flex-col p-3 t items-center">
                                  <InputOTP
                                    maxLength={6}
                                    className="w-3/4 flex  justify-between"
                                    onChange={(e) => setOTP(e)}
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
                                  <div className="p-3">
                                    <Button
                                      className="bg-Violet"
                                      onClick={() => {
                                        verifyOTP.mutateAsync();
                                      }}
                                    >
                                      Verify OTP
                                    </Button>
                                  </div>
                                </div>
                              </DialogHeader>
                            </DialogContent>
                          </Dialog>
                        </Button>
                      </div>
                    )}
                  </form>
                </div>
              </Form>
            </div>
          </div>
        </div>
      </div>
    );  
*/}