import { Form, Formik } from "formik";
import { getCountryCallingCode, parsePhoneNumber } from "react-phone-number-input";
import { verifyPhoneNumberValues } from "@/utils/initialValues";
import { verifyPhoneNumberSchema } from "@/utils/validationSchema";
import { PhoneNumberAndCountryField, Button } from "@/ui";
import usePhoneNumberVerification from "@/hooks/usePhoneNumberVerification";
import { replaceCharactersWithString } from "@/utils/functions";
import { useAppSelector } from "@/lib/hooks";



export default function VerifyPhoneNumber() {
    const { user } = useAppSelector((state) => state.user);
    const { sendPhoneNumberToken } = usePhoneNumberVerification();

    const getPhoneDefaults = (phone: string) => {
        if (!phone) {
            return {
                phoneNumber: verifyPhoneNumberValues.phoneNumber,
                country: verifyPhoneNumberValues.country,
                countryCode: verifyPhoneNumberValues.countryCode,
            };
        }

        const parsedPhone = parsePhoneNumber(phone);
        if (parsedPhone?.country && parsedPhone?.countryCallingCode) {
            return {
                phoneNumber: parsedPhone.nationalNumber,
                country: parsedPhone.country,
                countryCode: `+${parsedPhone.countryCallingCode}`,
            };
        }

        const numericPhone = replaceCharactersWithString(phone);
        if (numericPhone.startsWith("234") && numericPhone.length > 10) {
            return {
                phoneNumber: numericPhone.slice(3),
                country: "NG",
                countryCode: "+234",
            };
        }

        return {
            phoneNumber: numericPhone,
            country: verifyPhoneNumberValues.country,
            countryCode: verifyPhoneNumberValues.countryCode,
        };
    };

    const phoneDefaults = getPhoneDefaults(user?.data.phoneNumber || "");

    return (
        <Formik
            initialValues={{
                ...verifyPhoneNumberValues,
                phoneNumber: phoneDefaults.phoneNumber,
                country: phoneDefaults.country,
                countryCode: phoneDefaults.countryCode,
            }}
            onSubmit={async (values, { setSubmitting }) => {
                sendPhoneNumberToken.mutate({ phoneNumber: values.phoneNumber, email: user?.data.email || "" });
                setSubmitting(false);
            }}
            validationSchema={verifyPhoneNumberSchema}
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
                    handleBlur,
                    setFieldValue,
                    setFieldTouched,
                    isSubmitting,
                } = props;

                return (
                    <Form className="space-y-6 max-w-[375px]">
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
                                const number = replaceCharactersWithString(event.target.value);
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
                            selectClassname="!w-[170px]"
                            inputError={
                                errors.phoneNumber && touched.phoneNumber
                                    ? errors.phoneNumber
                                    : ""
                            }
                            selectError={
                                errors.country && touched.country ? errors.country : ""
                            }
                        />

                        <Button
                            variant="filled"
                            color="primary"
                            type="submit"
                            loading={isSubmitting || sendPhoneNumberToken.isPending}
                            disabled={
                                isSubmitting || sendPhoneNumberToken.isPending || !isValid
                            }
                        >
                            Verify phone number
                        </Button>
                    </Form>
                );
            }}
        </Formik>
    );
}
