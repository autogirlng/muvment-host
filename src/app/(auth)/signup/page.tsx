"use client";

import Link from "next/link";
import { Form, Formik } from "formik";
import { getCountryCallingCode } from "react-phone-number-input";
import useAuth from "@/hooks/useAuth";
import { signUpFormInitialValues } from "@/utils/initialValues";
import { signupFormValidationSchema } from "@/utils/validationSchema";
import { Button, InputField, PhoneNumberAndCountryField } from "@/ui";
import { replaceCharactersWithString } from "@/utils/functions";
import AuthPageHeader from "@/components/Header/AuthPageHeader";
import PasswordChecks from "@/components/PasswordChecks";

export default function SignupPage() {
    const { signupMutation } = useAuth();

    return (
        <div className="space-y-10">
            <AuthPageHeader
                title="Become A Host"
                description=" Generate Extra Income with Your Vehicle"
            />

            <Formik
                initialValues={signUpFormInitialValues}
                onSubmit={async (values, { setSubmitting }) => {

                    const { password_checks, ...submissionValues } = values;
                    signupMutation.mutate(submissionValues);
                    setSubmitting(false);
                }}
                validationSchema={signupFormValidationSchema}
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
                        setFieldTouched,
                        isSubmitting,
                    } = props;

                    return (
                        <Form className="space-y-6" autoComplete="off">
                            <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row gap-6">
                                <InputField
                                    name="firstName"
                                    id="firstName"
                                    type="text"
                                    label="First name"
                                    placeholder="Enter first name"
                                    value={values.firstName}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={
                                        errors.firstName && touched.firstName
                                            ? errors.firstName
                                            : ""
                                    }
                                />
                                <InputField
                                    name="lastName"
                                    id="lastName"
                                    type="text"
                                    label="Last name"
                                    placeholder="Enter last name"
                                    value={values.lastName}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={
                                        errors.lastName && touched.lastName ? errors.lastName : ""
                                    }
                                />
                            </div>
                            <PhoneNumberAndCountryField
                                inputName="phoneNumber"
                                selectName="country"
                                inputId="phoneNumber"
                                selectId="country"
                                label="Phone Number"
                                inputPlaceholder="Enter phone number"
                                selectPlaceholder="+234"
                                inputValue={values.phoneNumber}
                                selectValue={values.country}
                                inputOnChange={(event) => {
                                    const number = replaceCharactersWithString(
                                        event.target.value
                                    );
                                    setFieldTouched("phoneNumber", true);
                                    setFieldValue("phoneNumber", number);
                                }}
                                selectOnChange={(value: string) => {
                                    const countryCode = `+${getCountryCallingCode(value as any)}`;
                                    setFieldValue("country", value);
                                    setFieldValue("countryCode", countryCode);
                                }}
                                inputOnBlur={handleBlur}
                                selectOnBlur={handleBlur}
                                // inputClassname
                                selectClassname="!w-[130px]"
                                inputError={
                                    errors.phoneNumber && touched.phoneNumber
                                        ? errors.phoneNumber
                                        : ""
                                }
                                selectError={
                                    errors.country && touched.country ? errors.country : ""
                                }
                            />

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
                            <PasswordChecks
                                handleChange={handleChange}
                                handleBlur={handleBlur}
                                setFieldValue={setFieldValue}
                                values={values}
                                error={
                                    errors.password && touched.password ? errors.password : ""
                                }
                            />

                            <p className="text-grey-500 text-sm 2xl:text-base">
                                Already a host?{" "}
                                <Link href="/login" className="text-primary-500">
                                    Sign In
                                </Link>
                            </p>

                            <Button
                                fullWidth
                                variant="filled"
                                color="primary"
                                type="submit"
                                loading={isSubmitting || signupMutation.isPending}
                                disabled={
                                    isSubmitting ||
                                    signupMutation.isPending ||
                                    !isValid ||
                                    !values.password_checks?.digit ||
                                    !values.password_checks?.length ||
                                    !values.password_checks?.lowercase_letters ||
                                    !values.password_checks?.no_space ||
                                    !values.password_checks?.special_character ||
                                    !values.password_checks?.uppercase_letters
                                }
                            >
                                Sign Up
                            </Button>
                        </Form>
                    );
                }}
            </Formik>
            <p className="!mt-[74px] text-center text-sm text-grey-500">
                By signing up you agree to Muvment&apos;s{" "}
                <Link href="/" className="text-black underline">
                    Privacy Policy
                </Link>{" "}
                and{" "}
                <Link href="/" className="text-black underline">
                    Terms of Service
                </Link>
            </p>
        </div>
    );
}
