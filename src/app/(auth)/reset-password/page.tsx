"use client";

import { Form, Formik } from "formik";
import { useRouter, useSearchParams } from "next/navigation";
import { Button, InputField } from "@/ui"
import { setNewPasswordValidationSchema } from "@/utils/validationSchema";
import { setNewPasswordInitialValues } from "@/utils/initialValues";
import PasswordChecks from "@/components/PasswordChecks";
import AuthPageHeader from "@/components/Header/AuthPageHeader";
import useAuth from "@/hooks/useAuth";
import usePasswordValidation from "@/hooks/usePasswordValidation";
import { Eye, EyeSlash } from "@phosphor-icons/react";

export default function ResetPasswordPage() {
    const { isPasswordHidden, toggleHiddenPassword } = usePasswordValidation();

    const router = useRouter();
    const params = useSearchParams();
    const email = params.get("email") ?? "";
    const otp = params.get("token") ?? ""
    const { resetPassword } = useAuth();

    if (!email || !otp) {
        router.push("/forgot-password");
    }

    return (
        <div className="space-y-8">
            <AuthPageHeader
                title="Set New Password"
                description=" Enter your new password below."
            />

            <Formik
                initialValues={setNewPasswordInitialValues}
                onSubmit={async (values, { setSubmitting }) => {
                    console.log(values);

                    resetPassword.mutate({ ...values, email: email, otp });
                    setSubmitting(false);
                }}
                validationSchema={setNewPasswordValidationSchema}
                enableReinitialize={true}
                validateOnChange={true}
                validateOnBlur={true}
            >
                {(props) => {
                    const {
                        values,
                        touched,
                        errors,
                        isValid,
                        dirty,
                        handleBlur,
                        handleChange,
                        setFieldValue,
                        isSubmitting,
                    } = props;

                    return (
                        <Form className="space-y-6">
                            <PasswordChecks
                                label="New Password"
                                placeholder="Enter new password"
                                handleChange={handleChange}
                                handleBlur={handleBlur}
                                setFieldValue={setFieldValue}
                                values={values}
                                error={
                                    errors.password && touched.password ? errors.password : ""
                                }
                            >
                                <InputField
                                    name="confirmPassword"
                                    id="confirmPassword"
                                    type={isPasswordHidden ? "password" : "text"}
                                    label="Confirm Password"
                                    placeholder="Confirm Password"
                                    value={values.confirmPassword}
                                    icon={
                                        isPasswordHidden ? (
                                            <Eye size={20} fill="inherit" />
                                        ) : (
                                            <EyeSlash size={20} fill="inherit" />
                                        )
                                    }
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    toggleShowPassword={toggleHiddenPassword}
                                    error={
                                        errors.confirmPassword && touched.confirmPassword
                                            ? errors.confirmPassword
                                            : ""
                                    }
                                />
                            </PasswordChecks>

                            <Button
                                fullWidth
                                variant="filled"
                                color="primary"
                                type="submit"
                                loading={isSubmitting || resetPassword.isPending}
                                disabled={
                                    isSubmitting ||
                                    resetPassword.isPending ||
                                    !isValid ||
                                    !values.password_checks?.digit ||
                                    !values.password_checks?.length ||
                                    !values.password_checks?.lowercase_letters ||
                                    !values.password_checks?.no_space ||
                                    !values.password_checks?.special_character ||
                                    !values.password_checks?.uppercase_letters
                                }
                            >
                                Set Password
                            </Button>
                        </Form>
                    );
                }}
            </Formik>
        </div>
    );
}
