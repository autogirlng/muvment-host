import { Form, Formik } from "formik";
import { withdrawalAccountValues } from "@/utils/initialValues";
import { withdrawalAccountSchema } from "@/utils/validationSchema";
import { BankProp } from "@/types";
import useSetupWithdrawalAccount from "@/hooks/useSetupWithdrawalAccount";
import { Button, InputField, SelectSearchInput, Icons } from "@/ui";



export default function SetupWithdrawalAccount() {
    const {
        credentialsError,
        accountDetails,
        bankCodes,
        isLoading,
        validateBankAccount,
        sendBankAccountOtp,
        resetAccountDetails,
        setCredentialsError,
        loading,
        setLoading,
    } = useSetupWithdrawalAccount();

    return (
        <Formik
            initialValues={withdrawalAccountValues}
            onSubmit={async (values, { setSubmitting }) => {
                console.log(values);
                setLoading(true);
                setCredentialsError(false);

                if (!accountDetails.accountNumber || !accountDetails.bankCode) {
                    resetAccountDetails();
                    validateBankAccount.mutate(values);
                    console.log(loading);
                    setSubmitting(false);

                    return;
                } else {
                    sendBankAccountOtp.mutate();
                    setSubmitting(false);

                    return;
                }
            }}
            validationSchema={withdrawalAccountSchema}
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
                    handleChange,
                    setFieldValue,
                    setFieldTouched,
                    isSubmitting,
                } = props;

                return (
                    <Form className="space-y-6 max-w-[375px]">
                        {/* <SelectSearchInput
                            placeholder="Select Bank"
                            variant="outlined"
                            label="Bank"
                            id="bank"
                            banks={bankCodes}
                            isLoading={isLoading}
                            value={values.bank}
                            onChange={(bank: BankProp) => {
                                setFieldTouched("bank", true);
                                setFieldValue("bank", bank);
                                setFieldValue("bankCode", bank?.code);
                            }}
                            error={errors.bankCode && touched.bankCode ? errors.bankCode : ""}
                        /> */}

                        <div className="space-y-4">
                            <InputField
                                name="accountNumber"
                                id="accountNumber"
                                type="accountNumber"
                                label="Account Number"
                                placeholder="Enter Account Number"
                                value={values.accountNumber}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={
                                    errors.accountNumber && touched.accountNumber
                                        ? errors.accountNumber
                                        : ""
                                }
                            />

                            {credentialsError && (
                                <p className="text-base md:text-lg 2xl:text-h6 text-error-500">
                                    Invalid credentials
                                </p>
                            )}
                            {accountDetails.accountName && (
                                <p className="flex items-center gap-2 text-sm md:text-base 3xl:text-h6 text-success-600 capitalize">
                                    {Icons.ic_check_circle}{" "}
                                    <span className="capitalize">
                                        {accountDetails.accountName.toLowerCase()}
                                    </span>
                                </p>
                            )}
                        </div>

                        <Button
                            variant="filled"
                            color="primary"
                            type="submit"
                            loading={isSubmitting || loading}
                            disabled={isSubmitting || loading || !isValid}
                        >
                            {!accountDetails.accountNumber || !accountDetails.bankCode
                                ? "Validate Account"
                                : "Add Bank"}
                        </Button>
                    </Form>
                );
            }}
        </Formik>
    );
}
