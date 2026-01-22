import {
    ChangeEvent,
} from "react";
import { Form, Formik } from "formik";
import { Button, BlurredDialog, TextArea } from "@/ui";
import { reportBookingSchema } from "@/utils/validationSchema";
import { ReportTripProps, PopupProps } from "../props";


const ReportTrip = ({
    trigger,
    handleAction,
    openModal,
    handleModal,
    isLoading,
    setReport,
}: ReportTripProps) => {
    return (
        <BlurredDialog
            open={openModal}
            onOpenChange={handleModal}
            trigger={trigger}
            content={
                <PopupContent
                    handleAction={handleAction}
                    handleModal={handleModal}
                    isLoading={isLoading}
                    setReport={setReport}
                />
            }
        />
    );
};



const PopupContent = ({
    handleAction,
    handleModal,
    isLoading,
    setReport,
}: PopupProps) => {
    return (
        <Formik
            initialValues={{ message: "" }}
            onSubmit={async (values, { setSubmitting }) => {
                console.log(values);

                handleAction(values);
                setSubmitting(false);
            }}
            validationSchema={reportBookingSchema}
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
                            Report Booking
                        </h6>
                        <TextArea
                            name="message"
                            id="message"
                            type="text"
                            placeholder="Type a message"
                            value={values.message}
                            onChange={(event: ChangeEvent<HTMLInputElement>) => {
                                handleChange(event);
                                setReport(event.target.value);
                            }}
                            onBlur={handleBlur}
                            error={errors.message && touched.message ? errors.message : ""}
                        />
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Button
                                fullWidth
                                variant="filled"
                                color="white"
                                type="submit"
                                className="!bg-grey-90 !text-grey-700"
                                onClick={() => handleModal(false)}
                            >
                                Cancel
                            </Button>

                            <Button
                                fullWidth
                                variant="filled"
                                color="primary"
                                loading={isLoading}
                                disabled={isLoading || !isValid}
                                type="submit"
                            >
                                Submit
                            </Button>
                        </div>
                    </Form>
                );
            }}
        </Formik>
    );
};

export default ReportTrip;
