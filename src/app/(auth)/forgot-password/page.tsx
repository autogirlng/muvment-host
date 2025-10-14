"use client";

import { Form, Formik } from "formik";
import { Button, InputField } from "@/ui";
import { resetPasswordEmailValidationSchema } from "@/utils/validationSchema";
import { resetPasswordEmailInitialValues } from "@/utils/initialValues";
import BackLink from "@/components/BackLink";
import AuthPageHeader from "@/components/Header/AuthPageHeader";
import useAuth from "@/hooks/useAuth";

export default function ForgotPasswordPage() {
    const { forgotPassword } = useAuth();

    return (
        <div className="space-y-8">
            <BackLink backLink="/login" />
            <AuthPageHeader
                title="Reset password"
                description="Enter your email, and we'll send you instructions to regain
          access"
            />

            <Formik
                initialValues={resetPasswordEmailInitialValues}
                onSubmit={async (values, { setSubmitting }) => {
                    console.log(values);

                    forgotPassword.mutate(values);
                    setSubmitting(false);
                }}
                validationSchema={resetPasswordEmailValidationSchema}
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
                        isSubmitting,
                    } = props;

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
                                error={errors.email && touched.email ? errors.email : ""}
                            />

                            <Button
                                fullWidth
                                variant="filled"
                                color="primary"
                                type="submit"
                                loading={isSubmitting || forgotPassword.isPending}
                                disabled={isSubmitting || forgotPassword.isPending || !isValid}
                            >
                                Reset Password
                            </Button>
                        </Form>
                    );
                }}
            </Formik>
        </div>
    );
}
