import React from "react";
import { Form, Formik } from "formik";
import { Button, InputField } from "@/ui";
import { verifyIdentityValues } from "@/utils/initialValues";
import { verifyIdentitySchema } from "@/utils/validationSchema";



export default function VerifyIdentity() {
    return (
        <Formik
            initialValues={verifyIdentityValues}
            onSubmit={async (values, { setSubmitting }) => {
                console.log(values);
            }}
            validationSchema={verifyIdentitySchema}
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
                    <Form className="space-y-6 max-w-[375px]">
                        <div className="flex items-end gap-2">
                            <InputField
                                name="day"
                                id="day"
                                type="day"
                                label="Date Of Birth"
                                placeholder="DD"
                                value={values.day}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={errors.day && touched.day ? errors.day : ""}
                                inputClass="px-[28px] w-[78px]"
                                className="w-[78px]"
                            />
                            <InputField
                                name="month"
                                id="month"
                                type="month"
                                placeholder="MM"
                                value={values.month}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={errors.month && touched.month ? errors.month : ""}
                                inputClass="px-[28px]"
                                className="!w-[82px]"
                            />
                            <InputField
                                name="year"
                                id="year"
                                type="year"
                                placeholder="YYYY"
                                value={values.year}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={errors.year && touched.year ? errors.year : ""}
                                inputClass="px-[31px]"
                                className="w-[105px]"
                            />
                        </div>

                        <InputField
                            name="bvn"
                            id="bvn"
                            type="bvn"
                            label="Bank Verification Number (BVN)"
                            placeholder="Enter BVN"
                            BVN
                            value={values.bvn}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={errors.bvn && touched.bvn ? errors.bvn : ""}
                            info
                            tooltipTitle="Bank Verification Number"
                            tooltipDescription="To ensure your account's security, we verify your identity using your Date of Birth (DOB) and Bank Verification Number (BVN). This helps us match your information accurately and keep your account safe"
                        />

                        <Button variant="filled" color="primary" type="submit">
                            Verify Identity
                        </Button>
                    </Form>
                );
            }}
        </Formik>
    );
}
