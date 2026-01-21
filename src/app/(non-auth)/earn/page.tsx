"use client";
import { Footer } from "@/components/Footer";
import { DesktopNav, MobileNav } from "@/components/Navbar";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useHttp } from "@/hooks/useHttp";
import { toast } from "react-toastify";

interface DriverSignUpSchema {
  fullName: string;
  email: string;
  yearsOfExperience: number | string;
  primaryPhoneNumber: string;
  alternativePhoneNumber?: string;
}

function Earn() {
  const SignupSchema = Yup.object().shape({
    fullName: Yup.string().required("Full name is required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    yearsOfExperience: Yup.number()
      .typeError("Must be a number")
      .min(0, "Cannot be negative")
      .required("Experience is required"),
    primaryPhoneNumber: Yup.string()
      .min(11, "Must be at least 11 digits")
      .required("Primary phone is required"),
    alternativePhoneNumber: Yup.string()
      .min(11, "Must be at least 11 digits")
      .optional(),
  });

  const http = useHttp();

  const handleFormSubmit = async (
    values: DriverSignUpSchema,
    resetForm: any,
  ) => {
    try {
      const payload = {
        ...values,
        yearsOfExperience: Number(values.yearsOfExperience),
      };

      await http.post("/v1/driver-applications", payload);
      toast.success(
        "Application submitted successfully! We'll be in touch soon.",
      );
      resetForm();
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        "Something went wrong. Please try again.";
      toast.error(errorMessage);
      console.error("Submission error:", error);
    }
  };

  const sidebarImage =
    "https://res.cloudinary.com/dgnalaojk/image/upload/v1765278366/svb3spun7afrd24f0au3.jpg?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

  return (
    <main className="min-h-screen flex flex-col bg-white">
      <div className="relative z-50 md:mb-10">
        <DesktopNav user={null} userToken={""} />
        <MobileNav user={null} userToken={""} />
      </div>
      <div className="flex flex-col lg:flex-row flex-grow min-h-full relative">
        <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 py-12 sm:px-12 lg:px-16 xl:px-24 bg-white z-10">
          <div className="w-full max-w-md mx-auto">
            <header className="mb-10">
              <h1 className="text-4xl font-bold text-slate-900 tracking-tight">
                Join Muvment
              </h1>
              <p className="text-lg text-slate-500 mt-3 font-medium">
                Drive the future with Electric Vehicles.{" "}
                <br className="hidden sm:block" />
                Zero Emissions. High Income.
              </p>
            </header>

            <Formik
              initialValues={{
                fullName: "",
                email: "",
                yearsOfExperience: "",
                primaryPhoneNumber: "",
                alternativePhoneNumber: "",
              }}
              validationSchema={SignupSchema}
              onSubmit={(values, { resetForm }) => {
                handleFormSubmit(values, resetForm);
              }}
            >
              {({ errors, touched, isSubmitting }) => (
                <Form className="space-y-6">
                  <div className="space-y-2">
                    <label
                      htmlFor="fullName"
                      className="text-sm font-bold text-slate-700 tracking-wide"
                    >
                      Full Name
                    </label>
                    <Field
                      id="fullName"
                      name="fullName"
                      placeholder="e.g. Ibrahim Olu Emeka"
                      className={`w-full px-5 py-4 border-2 text-base transition-all outline-none focus:outline-none placeholder:text-slate-400`}
                    />
                    <ErrorMessage
                      name="fullName"
                      component="div"
                      className="text-sm font-medium text-red-500 mt-1"
                    />
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="email"
                      className="text-sm font-bold text-slate-700 tracking-wide"
                    >
                      Email Address
                    </label>
                    <Field
                      id="email"
                      name="email"
                      type="email"
                      placeholder="name@gmail.com"
                      className={`w-full px-5 py-4 border-2 text-base transition-all outline-none focus:outline-none placeholder:text-slate-400`}
                    />
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="text-sm font-medium text-red-500 mt-1"
                    />
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="yearsOfExperience"
                      className="text-sm font-bold text-slate-700 tracking-wide"
                    >
                      Driving Experience (Years)
                    </label>
                    <Field
                      id="yearsOfExperience"
                      name="yearsOfExperience"
                      type="number"
                      placeholder="e.g. 4"
                      className={`w-full px-5 py-4 border-2 text-base transition-all outline-none focus:outline-none placeholder:text-slate-400 appearance-none`}
                    />
                    <ErrorMessage
                      name="yearsOfExperience"
                      component="div"
                      className="text-sm font-medium text-red-500 mt-1"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label
                        htmlFor="primaryPhoneNumber"
                        className="text-sm font-bold text-slate-700 tracking-wide"
                      >
                        Phone Number
                      </label>
                      <Field
                        id="primaryPhoneNumber"
                        name="primaryPhoneNumber"
                        type="tel"
                        placeholder="08000000000"
                        className={`w-full px-5 py-4 border-2 text-base transition-all outline-none focus:outline-none placeholder:text-slate-400`}
                      />
                      <ErrorMessage
                        name="primaryPhoneNumber"
                        component="div"
                        className="text-sm font-medium text-red-500 mt-1"
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-baseline">
                        <label
                          htmlFor="alternativePhoneNumber"
                          className="text-sm font-bold text-slate-700 tracking-wide truncate"
                        >
                          Alt. Phone
                        </label>
                        <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                          Optional
                        </span>
                      </div>
                      <Field
                        id="alternativePhoneNumber"
                        name="alternativePhoneNumber"
                        type="tel"
                        placeholder="08000000000"
                        className={`w-full px-5 py-4 border-2 text-base transition-all outline-none focus:outline-none placeholder:text-slate-400`}
                      />
                      <ErrorMessage
                        name="alternativePhoneNumber"
                        component="div"
                        className="text-sm font-medium text-red-500 mt-1"
                      />
                    </div>
                  </div>

                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`w-full flex items-center justify-center py-5 text-white font-bold text-lg shadow-xl shadow-primary-600/20 transition-all active:scale-[0.99]
                                            ${isSubmitting ? "bg-primary-500 cursor-not-allowed" : "bg-gradient-to-r from-primary-700 to-primary-600 hover:from-primary-800 hover:to-primary-700"}`}
                    >
                      {isSubmitting ? (
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                      ) : null}
                      {isSubmitting ? "Processing..." : "Submit Application"}
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
        <div className="hidden lg:block lg:w-1/2 relative bg-slate-900 h-full min-h-screen">
          <img
            src={sidebarImage}
            alt="Modern Electric Vehicle Interior"
            className="absolute inset-0 w-full h-full object-cover object-center opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary-900/50 to-transparent mix-blend-multiply" />
        </div>
      </div>

      <div className=" my-10 relative z-10 bg-white">
        <Footer />
      </div>
    </main>
  );
}

export default Earn;
