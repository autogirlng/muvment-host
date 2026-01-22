import { Form, Formik } from "formik";
import { Button, InputField } from "@/ui";
import { withdrawalValues } from "@/utils/initialValues";
import { withdrawalSchema } from "@/utils/validationSchema";
import { ChangeEvent, Dispatch, SetStateAction } from "react";

type WithdrawProps = {
    handleModal: (open: boolean) => void;
    handleWithdrawal: (amount: string) => void;
    isLoading: boolean;
    amount: string;
    setAmount: Dispatch<SetStateAction<string>>;
    wallteBalance: number;
};

const Withdraw = ({
    handleModal,
    handleWithdrawal,
    isLoading,
    amount,
    wallteBalance,
    setAmount,
}: WithdrawProps) => {
    return (
        <Formik
            initialValues={withdrawalValues}
            onSubmit={async (values, { setSubmitting, setErrors }) => {
                setSubmitting(true);
                const amount = values.amount.replace(/,/g, "");
                if (Number(amount) < 20000) {
                    setErrors({ amount: "Amount must be greater than 20,000" });
                    return;
                }
                if (Number(amount) > wallteBalance) {
                    setErrors({ amount: "Insufficient Balance" });
                } else {
                    // handleWithdrawal(amount);
                }
                setSubmitting(false);
            }}
            validationSchema={withdrawalSchema}
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
                        <h6 className="text-base sm:text-xl 3xl:text-h6 !font-semibold text-grey-800">
                            Withdraw Funds
                        </h6>
                        <p className="text-xs sm:text-sm 3xl:text-base text-grey-500">
                            Please note, a minimum balance of 20,000 NGN is required to
                            initiate a withdrawal.
                        </p>
                        <InputField
                            name="amount"
                            id="amount"
                            type="amount"
                            label="Withdrawal Amount"
                            placeholder="Enter amount to withdraw"
                            value={
                                values?.amount
                                    ? Number(values.amount.replace(/[^\d]/g, "")).toLocaleString()
                                    : ""
                            }
                            onChange={(event: ChangeEvent<HTMLInputElement>) => {
                                const numericValue = event.target.value.replace(/[^\d]/g, "");
                                handleChange(event);
                                setAmount(numericValue);
                            }}
                            onBlur={handleBlur}
                            error={errors.amount && touched.amount ? errors.amount : ""}
                        />

                        <div className="flex flex-col sm:flex-row gap-4">
                            <Button
                                fullWidth
                                variant="filled"
                                color="white"
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
                                loading={isLoading}
                                disabled={isLoading}
                            //    onClick={() => handleDelete()}
                            >
                                Continue
                            </Button>
                        </div>
                    </Form>
                );
            }}
        </Formik>
    );
};

export default Withdraw;
