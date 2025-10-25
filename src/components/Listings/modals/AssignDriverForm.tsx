import { Form, Formik } from "formik";
import { getCountryCallingCode } from "react-phone-number-input";
import { InputField, PhoneNumberAndCountryField, Button } from "@/ui";
import { assignNewDriverFormValidationSchema } from "@/utils/validationSchema";
import { AssignDriverFormProps } from "../props";
import { replaceCharactersWithString } from "@/utils/functions";

const AssignDriverForm = ({
    handleModal,
    assignNewDriver,
    vehicleId,
    isPending,
}: AssignDriverFormProps) => {
    return (
        <div>
            <Formik
                initialValues={{
                    firstName: "",
                    lastName: "",
                    phoneNumber: "",
                    country: "NG",
                    countryCode: "+234",
                }}
                onSubmit={async (values, { setSubmitting }) => {
                    console.log(values);
                    assignNewDriver({
                        firstName: values.firstName,
                        lastName: values.lastName,
                        phoneNumber: values.phoneNumber,
                        vehicleId,
                    });
                    setSubmitting(false);
                }}
                validationSchema={assignNewDriverFormValidationSchema}
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
                        <Form className="space-y-6">
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

                            <div className="flex gap-6">
                                <Button
                                    fullWidth
                                    variant="filled"
                                    color="white"
                                    type="submit"
                                    loading={isSubmitting}
                                    disabled={isSubmitting}
                                    className="!bg-grey-90 !text-grey-700"
                                    onClick={() => handleModal(false)}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    fullWidth
                                    variant="filled"
                                    color="primary"
                                    type="submit"
                                    loading={isSubmitting || isPending}
                                    disabled={isSubmitting || isPending}
                                >
                                    Assign Driver
                                </Button>
                            </div>
                        </Form>
                    );
                }}
            </Formik>
        </div>
    );
};

export default AssignDriverForm;
