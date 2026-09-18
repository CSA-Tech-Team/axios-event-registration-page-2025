/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { Input } from "../ui/input";
import {
  Badge,
  Book,
  Building,
  Copy,
  Drama,
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
import { set, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Label } from "../ui/label";
import { useToast } from "@/hooks/use-toast";
import FloatingWhatsAppButton from "./FloatingWhatsAppButton";

// One bordered field holding an icon and a borderless control, so the pair
// reads as a single input (brutalist standard §10 — square, ink, hard focus).
const FIELD =
  "flex min-h-11 items-center gap-3 border-2 border-ink bg-wcard px-3 transition-shadow focus-within:shadow-brut-sm has-[:disabled]:bg-paper";
const FIELD_ICON = "h-5 w-5 shrink-0 text-ink-2";
const FIELD_INPUT =
  "min-h-0 w-full border-0 bg-transparent px-0 py-2 focus-visible:shadow-none disabled:bg-transparent disabled:opacity-100";
const FIELD_TRIGGER =
  "min-h-0 border-0 bg-transparent px-0 py-2 focus-visible:shadow-none data-[state=open]:shadow-none";

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
      if (user?.role === "USER") {
      console.log("Validating before phone OTP");
      console.log({ formValues: form.getValues() });
      if (
        !form.getValues("firstName") ||
        !form.getValues("lastName") ||
        !form.getValues("collegeName") ||
        !form.getValues("yearOfStudy") ||
        !form.getValues("degreeOfStudy") ||
        !form.getValues("phoneNumber")
      ) {
        console.log("Validation failed");
        toast({
          title: "All fields are required",
          description: "Please fill all the fields before requesting OTP",
        });
        throw new Error("Please fill all the fields");
      }
    }
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

  // const updateUserMutation = useMutation({
  //   mutationFn: async (data: any) => {
  //     console.log("Data we have is : ",{ data, gender });
  //     const response = await putWithAuth(ApiPaths.USER, {
  //       profile: {
  //         firstName: data.firstName,
  //         lastName: data.lastName,
  //         collegeName: selectedCollege,
  //         yearOfStudy: selectedYear,
  //         degreeOfStudy: user?.role === "ALUMNI" ? "NOT APPLICABLE" : selectedCourse,
  //         branchOfStudy: "DUMMY",
  //         rollNumber:
  //         user?.role === "ALUMNI"
  //           ? rememberRollNo
  //             ? data.rollNumber
  //             : "NOT REMEMBERED"
  //           : undefined,
  //       },
  //       gender: gender,
  //       phoneNumber: "+91 " + data?.phoneNumber,
  //     });
  //     console.log(data);
  //     console.log(response);
  //     return response;
  //   },
  //   onSuccess: () => {
  //     generatePhoneOtp.mutateAsync();
  //     toast({
  //       title: "Verify phone number",
  //       description: "Verify phone number",
  //     });
  //   },
  //   onError: (error) => {
  //     console.log(error);
  //     toast({
  //       title: "Uh oh! Something went wrong.",
  //       description: `${error}`,
  //     });
  //   },
  // });
  /*
  const updateUserMutation = useMutation({
  mutationFn: async (data: any) => {
    // Validation only for USER role
    if (user?.role === "USER") {
      console.log("Validating before updating user");
      if (
        !data.firstName ||
        !data.lastName ||
        !selectedCollege ||
        !selectedYear ||
        selectedCourse === "" ||
        !data.phoneNumber
      ) {
        toast({
          title: "All fields are required",
          description: "Please fill all the fields",
        });
        throw new Error("Please fill all the fields");
      }
    }

    console.log("Data we have is : ", { data, gender });
    const response = await putWithAuth(ApiPaths.USER, {
      profile: {
        firstName: data.firstName,
        lastName: data.lastName,
        collegeName: selectedCollege,
        yearOfStudy: selectedYear,
        degreeOfStudy:
          user?.role === "ALUMNI" ? "NOT APPLICABLE" : selectedCourse,
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
});*/
const updateUserMutation = useMutation({
  mutationFn: async (data: any) => {
    // Validation only for USER role
    if (user?.role === "USER") {
      if (
        !data.firstName ||
        !data.lastName ||
        !data.collegeName ||
        !data.yearOfStudy ||
        !data.degreeOfStudy ||
        !data.phoneNumber
      ) {
        console.log(data.firstName, data.lastName, data.collegeName, data.yearOfStudy, data.degreeOfStudy, data.phoneNumber);
        toast({
          title: "All fields are required",
          description: "Please fill all the fields",
        });
        throw new Error("Please fill all the fields");
      }
    }
    console.log("Data",data);
    /*const response = await putWithAuth(ApiPaths.USER, {
      profile: {
        firstName: data.firstName,
        lastName: data.lastName,
        collegeName: user?.role === "ALUMNI" ? "PSG College of Technology" : data.collegeName,
        yearOfStudy: user?.role === "ALUMNI" ? "NOT APPLICABLE" : data.yearOfStudy,
        degreeOfStudy:
          user?.role === "ALUMNI" ? "NOT APPLICABLE" : data.degreeOfStudy,
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
  },*/
  const response = await putWithAuth(ApiPaths.USER, {
      profile: {
        firstName: data.firstName,
        lastName: data.lastName,
        collegeName:
          user?.role === "ALUMNI"
            ? "PSG College of Technology"
            : data.collegeName,
        yearOfStudy:
          user?.role === "ALUMNI" ? "NOT APPLICABLE" : data.yearOfStudy,
        degreeOfStudy:
          user?.role === "ALUMNI" ? "NOT APPLICABLE" : data.degreeOfStudy,
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

    return response;
  },
  onSuccess: () => {
    // 🚫 Removed OTP generation
    // ✅ Just show a success toast and mark profile completed
    setIsProfileCompleted(true);
    queryClient.invalidateQueries("user" as any);
    console.log('User successfully registered..');
    toast({
      title: "Profile Updated Successfully 🎉",
      description: "Your profile has been updated successfully.",
    });
  },
  onError: (error) => {
    console.log(error);
    toast({
      title: "Uh oh! Something went wrong.",
      description: `${error}`,
      variant: "destructive",
    });
}});

  /*function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log(data);
    updateUserMutation.mutateAsync(data as any);
  }*/
  async function onSubmit(data: z.infer<typeof FormSchema>) {
    // Assign collegeName and degreeOfStudy based on selection, handling "Others"
    let finalCollegeName = selectedCollege;
    let finalDegreeOfStudy = selectedCourse;

    if (selectedCollege === "Others") {
      finalCollegeName = otherCollege.trim();
    }
    // If course "Others" is selected (either via college or course dropdown)
    if (selectedCollege === "Others" || selectedCourse === "Others") {
      finalDegreeOfStudy = otherCourse.trim();
    }

    // Always trim for consistency
    finalCollegeName = (finalCollegeName || "").trim();
    finalDegreeOfStudy = (finalDegreeOfStudy || "").trim();

    // Update form values so UI is in sync
    form.setValue("collegeName", finalCollegeName);
    form.setValue("degreeOfStudy", finalDegreeOfStudy);
    form.setValue("yearOfStudy", selectedYear);

    // Assign to data object for validation and submission
    data.collegeName = finalCollegeName;
    data.degreeOfStudy = finalDegreeOfStudy;
    data.yearOfStudy = selectedYear;

    //whether all fields are filled
    if (
      !data.firstName ||
      !data.lastName ||
      !data.collegeName ||
      !data.yearOfStudy ||
      !data.degreeOfStudy ||
      !data.phoneNumber
    ) {
      toast({
        title: "All fields are required",
        description: "Please fill all the fields",
      });
      return;
    }

    // Validate phone number
    if (data.phoneNumber && (data.phoneNumber.length !== 10 || isNaN(data.phoneNumber))) {
      toast({
        title: "Invalid phone number",
        description: "Phone number must be 10 digits long and numeric",
      });
      return;
    }

    // Validation for year of study based on course
    const course = (data.degreeOfStudy || "").toLowerCase();
    const year = parseInt(data.yearOfStudy || "0");
    if (/^b\s*\.?\s*sc/i.test(course)) {
      if (year <= 1) {
        toast({
          title: "Invalid Year",
          description: "For B.Sc, year of study must be greater than 1.",
          variant: "destructive",
        });
        return;
      }
    } else if (/^b\s*\.?\s*tech/i.test(course) || /^b\s*\.?\s*e/i.test(course)) {
      if (year <= 1) {
        toast({
          title: "Invalid Year",
          description: "For B.Tech or B.E, year of study must be greater than 1.",
          variant: "destructive",
        });
        return;
      }
    } else if (/^m\s*\.?\s*sc/i.test(course) || /^mba/i.test(course)) {
      if (year < 1 || year > 5) {
        toast({
          title: "Invalid Year",
          description: "For M.Sc or MBA, year of study must be between 1 and 5.",
          variant: "destructive",
        });
        return;
      }
    }

    // Proceed with update mutation
    await updateUserMutation.mutateAsync(data as any);
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

      const referralLink = `https://app.axios.psgtech.ac.in/signup?referralCode=${referralCode}`;

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
  const [otherCollege, setOtherCollege] = useState<string>("");
  const [otherCourse, setOtherCourse] = useState<string>("");

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
    const newCourses =
      college?.find((elt: any) => elt.name === selectedCollege)?.courses ?? [];
    setCourses(newCourses);

    // Preserve previous selection if valid, else select first course
    if (selectedCourse && newCourses.includes(selectedCourse)) {
      setSelectedCourse(selectedCourse);
    } else if (newCourses.length > 0) {
      setSelectedCourse(newCourses[0]);
    } else {
      setSelectedCourse("");
    }
  }, [college, selectedCollege]);

  useEffect(() => {
  form.setValue("collegeName", selectedCollege === "Others" ? otherCollege : selectedCollege);
  form.setValue("degreeOfStudy", selectedCourse === "Others" ? otherCourse : selectedCourse);
  form.setValue("yearOfStudy", selectedYear);
  }, [selectedCollege, selectedCourse, selectedYear, otherCollege, otherCourse]);

  if (isSuccess) {
    return (
    <div className="brut-container pb-20 pt-10 md:pt-14">
      {/* <FloatingWhatsAppButton inviteLink="https://chat.whatsapp.com/K6ZurxzU7siAY1ZRxeiL4K" /> */}
      <header className="border-b-2 border-ink pb-6">
        <p className="eyebrow text-ink-2">Axios · Registration desk</p>
        <h1 className="display-title registration mt-2">Profile</h1>
      </header>

      <div className="brut-card mt-10 w-full max-w-4xl p-5 sm:p-8">
        {/* ID Header */}
        <h2 className="mb-8 flex flex-wrap items-center gap-3 border-b-2 border-dashed border-line pb-5 text-base font-bold">
          Your ID:{" "}
          <span className="border-2 border-ink bg-wcard px-2 py-1 font-mono text-sm shadow-brut-sm">
            {user?.id}
          </span>
        </h2>

        {/* Form */}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid grid-cols-1 gap-x-6 gap-y-5 md:grid-cols-2"
          >
            {/* Phone Number */}
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <Label>Phone Number</Label>
                  <FormControl>
                    <div className={FIELD}>
                      <PhoneIcon className={FIELD_ICON} aria-hidden="true" />
                      <Input
                        {...field}
                        type="text" 
                        placeholder="Enter your phone number"
                        required
                        disabled={isProfileCompleted}
                        className={FIELD_INPUT}
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
                  <Label>Email</Label>
                  <FormControl>
                    <div className={FIELD}>
                      <Mails className={FIELD_ICON} aria-hidden="true" />
                      <Input
                        {...field}
                        type="text"
                        disabled
                        placeholder="Enter your email"
                        className={FIELD_INPUT}
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
                  <Label>First Name</Label>
                  <FormControl>
                    <div className={FIELD}>
                      <Badge className={FIELD_ICON} aria-hidden="true" />
                      <Input
                        {...field}
                        type="text"
                        placeholder="Enter your first name"
                        required
                        disabled={isProfileCompleted}
                        className={FIELD_INPUT}
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
                  <Label>Last Name</Label>
                  <FormControl>
                    <div className={FIELD}>
                      <Badge className={FIELD_ICON} aria-hidden="true" />
                      <Input
                        {...field}
                        type="text"
                        placeholder="Enter your last name"
                        required
                        disabled={isProfileCompleted}
                        className={FIELD_INPUT}
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
                  <Label>Gender</Label>
                  <FormControl>
                    <div className={FIELD}>
                      <User className={FIELD_ICON} aria-hidden="true" />
                      {!isProfileCompleted ? (
                        <Select
                          onValueChange={(e) => setGender(e as any)}
                          value={gender}
                        >
                          <SelectTrigger className={FIELD_TRIGGER}>
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
                          className={FIELD_INPUT}
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
                    <Label>Referral Code</Label>
                    <FormControl>
                      <div className={FIELD}>
                        <UserPlus className={FIELD_ICON} aria-hidden="true" />
                        <Input
                          {...field}
                          type="text"
                          disabled
                          className={FIELD_INPUT}
                        />
                        <button
                          type="button"
                          aria-label="Copy referral code"
                          title="Copy referral code"
                          className="-mr-1 flex h-11 w-11 shrink-0 items-center justify-center border-2 border-ink bg-card shadow-brut-sm transition-transform duration-150 hover:-translate-x-px hover:-translate-y-px active:translate-x-px active:translate-y-px"
                          onClick={() => copyReferral()}
                        >
                          <Copy className="h-4 w-4" aria-hidden="true" />
                        </button>
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
                  <Label>College</Label>
                  <FormControl>
                    <div className="flex flex-col gap-2">
                      {/*<Building className={FIELD_ICON} aria-hidden="true" />*/}
                      {!isProfileCompleted ? (
                        <>
                          <Select
                            onValueChange={(e) => {setSelectedCollege(e as any); setSelectedCourse("");}}
                            value={selectedCollege}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select College" />
                            </SelectTrigger>
                            <SelectContent>
                              {college?.map((elt: any) => (
                                <SelectItem key={elt.name} value={elt.name}>
                                  {elt.name}
                                </SelectItem>
                              ))}
                              {/*<SelectItem value="Others">Others</SelectItem>*/}
                            </SelectContent>
                          </Select>
                          {selectedCollege === "Others"  && (
                            <Input
                              value={otherCollege}
                              autoFocus={true}
                              onChange={(e) => { setOtherCollege(e.target.value); setSelectedCourse(""); }} 
                              placeholder="Enter your college"
                              
                            />
                          )}
                        </>
                      ) : (
                        <Input
                          {...field}
                          type="text"
                          disabled
                          className="disabled:opacity-100"
                        />
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />}
            {/* Course /}
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
                      {/* Funny toggle /}
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

                      {/* Show input only if they said Yes /}
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
                      className={FIELD_INPUT}
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
                  <Label>Course</Label>
                  <FormControl>
                    <div className={FIELD}>
                      <Book className={FIELD_ICON} aria-hidden="true" />
                      {!isProfileCompleted ? (
                        <>
                        {selectedCollege === "Others" ? (
                          <Input
                            value={otherCourse}
                            onChange={(e) => setOtherCourse(e.target.value)}
                            placeholder="Enter your course name with degree"
                            className="mt-2 bg-[#1f1f1f] text-white"
                          />
                        ) : (
                          <Select
                            onValueChange={(e) => {setSelectedCourse(e as any); setSelectedYear("");}}
                            value={selectedCourse}
                          >
                            <SelectTrigger className={FIELD_TRIGGER}>
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
                      ) }
                      </> ): (
                        <Input
                          {...field}
                          type="text"
                          
                          disabled
                          className={FIELD_INPUT}
                        />
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )} */}

          {user && user.role !== "ALUMNI" && (
            <FormField
              control={form.control}
              name="degreeOfStudy"
              render={({ field }) => (
                <FormItem>
                  <Label>Course</Label>
                  <FormControl>
                    <div className="flex flex-col gap-2">
                      {!isProfileCompleted ? (
                        <>
                          {/* Case 1: If College is 'Others' → custom course input */}
                          {selectedCollege === "Others" ? (
                            <Input
                              value={otherCourse}
                              onChange={(e) => setOtherCourse(e.target.value)}
                              placeholder="Enter your course name"
                              
                            />
                          ) : (
                            <>
                              {/* Case 2: Show dropdown of available courses + “Others” */}
                              <Select
                                onValueChange={(value) => {
                                  setSelectedCourse(value);
                                  if (value !== "Others") setOtherCourse("");
                                }}
                                value={selectedCourse}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select Course" />
                                </SelectTrigger>
                                <SelectContent>
                                  {courses?.map((course) => (
                                    <SelectItem key={course} value={course}>
                                      {course}
                                    </SelectItem>
                                  ))}
                                  <SelectItem value="Others">Others</SelectItem>
                                </SelectContent>
                              </Select>

                              {/* If “Others” selected for course */}
                              {selectedCourse === "Others" && (
                                <Input
                                  value={otherCourse}
                                  onChange={(e) => setOtherCourse(e.target.value)}
                                  placeholder="Enter your course name"
                                  
                                />
                              )}
                            </>
                          )}
                        </>
                      ) : (
                        <Input
                          {...field}
                          type="text"
                          disabled
                          className="disabled:opacity-100"
                        />
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

            {/* Year of Study */}
            { user && user.role!='ALUMNI' && <FormField
              control={form.control}
              name="yearOfStudy"
              render={({ field }) => {
                // Determine allowed years based on selectedCourse
                let allowedYears: number[] = [1, 2, 3, 4, 5];
                if (
                  /^B\.?\s*E(\b|[^a-zA-Z])/i.test(selectedCourse) ||
                  /^B\.?\s*Tech/i.test(selectedCourse)
                ) {
                  allowedYears = [2, 3, 4, 5];
                } else if (
                  /^B\.?\s*Sc/i.test(selectedCourse)
                ) {
                  allowedYears = [2, 3];
                } else if (
                  /^M\.?\s*E/i.test(selectedCourse) ||
                  /^M\.?\s*Tech/i.test(selectedCourse) ||
                  /^MCA/i.test(selectedCourse)
                ) 
                {
                  allowedYears = [1, 2, 3, 4, 5]; 
                } else if (
                  /^MBA/i.test(selectedCourse)
                ) { 
                  allowedYears = [1, 2];
                }
                else
                {
                  allowedYears = [1, 2, 3, 4, 5];
                }

                return (
                  <FormItem>
                    <Label>Year of Study</Label>
                    <FormControl>
                      <div className={FIELD}>
                        <Timer className={FIELD_ICON} aria-hidden="true" />
                        {!isProfileCompleted ? (
                          <Select
                            onValueChange={(e) => { setSelectedYear(e as any) }}
                            value={selectedYear}
                          >
                            <SelectTrigger className={FIELD_TRIGGER}>
                              <SelectValue placeholder="Select Year" />
                            </SelectTrigger>
                            <SelectContent>
                              {allowedYears.map((year) => (
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
                            className={FIELD_INPUT}
                          />
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />}

            


            {/* Submit Button */}
            {!isProfileCompleted && (
              <div className="mt-3 flex justify-end border-t-2 border-dashed border-line pt-6 md:col-span-2">
                <Button type="submit">
                  <Dialog open={open} onOpenChange={setOpen}>
                            Complete Profile
                            <DialogContent
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
                                    <span className="font-mono text-xs uppercase tracking-[0.06em] text-ink-2">
                                      Request OTP again in {time} seconds
                                    </span>
                                  )}
                                  {showResend && (
                                    <button
                                      type="submit"
                                      className="font-bold text-ink underline decoration-acc decoration-2 underline-offset-4"
                                      onClick={sendOTP}
                                    >
                                      Request OTP again
                                    </button>
                                  )}
                                </DialogDescription>
                                <div className="flex flex-col items-start gap-4 pt-3 sm:flex-row sm:items-center">
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
                                  <div>
                                    <Button
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