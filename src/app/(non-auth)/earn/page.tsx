"use client";
import { Footer } from "@/components/Footer";
import { DesktopNav, MobileNav } from "@/components/Navbar";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useHttp } from "@/hooks/useHttp";
import { toast } from 'react-toastify';
interface DriverSignUpSchema {
    fullName: string
    email: string,
    yearsOfExperience: number,
    primaryPhoneNumber: string,
    alternativePhoneNumber?: string,
}




function Earn() {

    const SignupSchema = Yup.object().shape({
        fullName: Yup.string().required('Required'),
        email: Yup.string().email('Invalid email').required('Required'),
        yearsOfExperience: Yup.number().min(0, 'Cannot be negative').required('Required'),
        primaryPhoneNumber: Yup.string().min(11, 'Must be 11 digits').required('Required'),
        alternativePhoneNumber: Yup.string().min(11, '11 digits required').optional(),
    });

    const http = useHttp();
    const handleFormSubmit = async (values: DriverSignUpSchema, resetForm: any) => {
        try {
            await http.post("/v1/driver-applications", values);
            toast.success("Application submitted successfully! We'll be in touch soon.");
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || "Something went wrong. Please try again.";
            toast.error(errorMessage);
            console.error("Submission error:", error);
        } finally {
            resetForm();

        }
    };

    return (
        <main className="min-h-screen flex flex-col bg-gray-50">
            {/* Navbars with higher z-index */}
            <DesktopNav user={null} userToken={""} />
            <MobileNav user={null} userToken={""} />

            <div className="relative min-h-screen flex items-center justify-center p-6 bg-slate-900">

                {/* Centered Form Card */}
                <div className="relative z-10 w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
                    {/* Blue Header Accent */}
                    <div className="h-2 bg-blue-700 w-full" />

                    <div className="p-8 lg:p-10">
                        <header className="text-center mb-8">
                            <h1 className="text-2xl font-bold text-slate-900">Join Muvment</h1>
                            <p className="text-slate-500 mt-2 text-sm">
                                Start earning with Electric Vehicles today.
                            </p>
                        </header>

                        <Formik
                            initialValues={{ fullName: '', email: '', yearsOfExperience: 0, primaryPhoneNumber: '', alternativePhoneNumber: '', }}
                            validationSchema={SignupSchema}
                            onSubmit={(values, { resetForm }) => {
                                handleFormSubmit(values, resetForm)
                            }}
                        >
                            {({ errors, touched, isSubmitting }) => (
                                <Form className="space-y-5">
                                    {/* Full Name */}
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-slate-700 uppercase tracking-tight ml-1">Full Name</label>
                                        <Field
                                            name="fullName"
                                            placeholder="Enter your full name"
                                            className={`w-full text-xs px-4 py-3 rounded-xl border bg-slate-50 transition-all outline-none focus:ring-4 focus:ring-blue-500/10 ${errors.fullName && touched.fullName ? 'border-red-400' : 'border-slate-200 focus:border-blue-600'
                                                }`}
                                        />
                                        <ErrorMessage name="fullName" component="div" className="text-[11px] text-[red] mt-1 ml-1" />
                                    </div>

                                    {/* Email */}
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-slate-700 uppercase tracking-tight ml-1">Email Address</label>
                                        <Field
                                            name="email"
                                            type="email"
                                            placeholder="Enter your email address"
                                            className={`w-full px-4 text-xs  py-3 rounded-xl border bg-slate-50 transition-all outline-none focus:ring-4 focus:ring-blue-500/10 ${errors.email && touched.email ? 'border-red-400' : 'border-slate-200 focus:border-blue-600'
                                                }`}
                                        />
                                        <ErrorMessage name="email" component="div" className="text-[11px] text-[red] mt-1 ml-1" />
                                    </div>

                                    {/* Grid Row: Experience & Age */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-xs font-bold text-slate-700 uppercase tracking-tight ml-1">Driving Exp.</label>
                                            <Field
                                                name="yearsOfExperience"
                                                type="number"
                                                placeholder="Years"
                                                className={`w-full px-4 text-xs  py-3 rounded-xl border bg-slate-50 transition-all outline-none focus:ring-4 focus:ring-blue-500/10 ${errors.yearsOfExperience && touched.yearsOfExperience ? 'border-red-400' : 'border-slate-200 focus:border-blue-600'
                                                    }`}
                                            />
                                            <ErrorMessage name="yearsOfExperience" component="div" className="text-[11px] text-[red] mt-1 ml-1" />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-xs font-bold text-slate-700 uppercase tracking-tight ml-1">Phone Number</label>
                                            <Field
                                                name="primaryPhoneNumber"
                                                type="text"
                                                placeholder="Phone Number"
                                                className={`w-full px-4 text-xs py-3 rounded-xl border bg-slate-50 transition-all outline-none focus:ring-4 focus:ring-blue-500/10 ${errors.primaryPhoneNumber && touched.primaryPhoneNumber ? 'border-red-400' : 'border-slate-200 focus:border-blue-600'
                                                    }`}
                                            />
                                            <ErrorMessage name="primaryPhoneNumber" component="div" className="text-[11px] text-[red] mt-1 ml-1" />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs font-bold text-slate-700 uppercase tracking-tight ml-1">Phone Number (other)</label>
                                            <Field
                                                name="alternativePhoneNumber"
                                                type="text"
                                                placeholder="Other phone number"
                                                className={`w-full px-4 text-xs py-3 rounded-xl border bg-slate-50 transition-all outline-none focus:ring-4 focus:ring-blue-500/10 ${errors.alternativePhoneNumber && touched.alternativePhoneNumber ? 'border-red-400' : 'border-slate-200 focus:border-blue-600'
                                                    }`}
                                            />
                                            <ErrorMessage name="alternativePhoneNumber" component="div" className="text-[11px] text-[red] mt-1 ml-1" />
                                        </div>
                                    </div>

                                    {/* Submit Button */}
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full bg-[blue] text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-900/20 transition-all active:scale-[0.98] mt-4"
                                    >
                                        {isSubmitting ? 'Processing...' : ' Submit Application'}
                                    </button>

                                    <p className="text-[10px] text-slate-400 text-center uppercase tracking-widest mt-6">
                                        Zero Emission • High Income • Flexible
                                    </p>
                                </Form>
                            )}
                        </Formik>
                    </div>
                </div>
            </div>

            <Footer />
        </main>
    );
}

export default Earn;
