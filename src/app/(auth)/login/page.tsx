"use client";
import Link from "next/link";
import { Button, InputField } from "@/ui";
import { Form, Formik } from "formik";
import useAuth from "@/hooks/useAuth";
import { EyeSlash, Eye } from "@phosphor-icons/react";
import AuthPageHeader from "@/components/Header/AuthPageHeader";
import usePasswordValidation from "@/hooks/usePasswordValidation";
import { loginFormValidationSchema } from "@/utils/validationSchema";
import { loginFormInitialValues } from "@/utils/initialValues";


export default function LoginPage() {
    const { isPasswordHidden, toggleHiddenPassword } = usePasswordValidation();

    const { loginMutation } = useAuth();

    return (
        <div className="space-y-8">
            <AuthPageHeader
                title="Welcome back"
                description="Log in to pick up where you left off."
            />

            <Formik
                initialValues={loginFormInitialValues}
                onSubmit={(values, { setSubmitting }) => {
                    console.log(values);
                    loginMutation.mutate(values);
                    setSubmitting(false);
                }}
                validationSchema={loginFormValidationSchema}
                enableReinitialize={true}
                validateOnChange={true}
                validateOnBlur={true}
            >
                {(props) => {
                    const { values, handleBlur, handleChange, isSubmitting } = props;

                    return (
                        <Form className="space-y-6">
                            <InputField
                                name="email"
                                id="email"
                                type="email"
                                label="Email"
                                placeholder="Enter email address"
                                value={values.email}
                                onChange={handleChange}
                                onBlur={handleBlur}
                            />
                            <InputField
                                name="password"
                                id="password"
                                type={isPasswordHidden ? "password" : "text"}
                                label="Password"
                                placeholder="Enter password"
                                icon={
                                    isPasswordHidden ? (
                                        <Eye size={20} fill="inherit" />
                                    ) : (
                                        <EyeSlash size={20} fill="inherit" />
                                    )
                                }
                                value={values.password}
                                toggleShowPassword={toggleHiddenPassword}
                                onChange={handleChange}
                                onBlur={handleBlur}
                            />
                            <div className="flex items-center justify-between text-sm 2xl:text-base">
                                <p className="text-grey-500">
                                    Not a host?{" "}
                                    <Link href="/signup" className="text-primary-500">
                                        Sign Up
                                    </Link>
                                </p>
                                <Link href="/forgot-password" className="text-primary-500">
                                    Forgot password?
                                </Link>
                            </div>

                            <Button
                                fullWidth
                                variant="filled"
                                color="primary"
                                type="submit"
                                loading={isSubmitting || loginMutation.isPending}
                                disabled={isSubmitting || loginMutation.isPending}
                            >
                                Sign In
                            </Button>
                            <p className="text-grey-500 text-center text-sm">
                                By signing in you agree to muvment&apos;s{" "}
                                <Link href="/privacy-policy" className="text-primary-500 mr-1">
                                    Privacy Policy  </Link> and <Link href="/terms-of-service" className="ml-1 text-primary-500">
                                    Terms of Service
                                </Link>
                            </p>
                        </Form>
                    );
                }}
            </Formik>
        </div>
    );
}
