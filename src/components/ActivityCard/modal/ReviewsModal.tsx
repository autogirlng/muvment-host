import { FullPageSpinner, Button, TextArea, Icons } from "@/ui";
import SectionTitle from "@/components/DashBoard/SectionTitle";
import ReviewCard from "@/components/ReviewCard";
import useReviews from "@/hooks/useReviews";
import { useState } from "react";
import cn from "classnames";
import { Form, Formik } from "formik";
import { replyReviewSchema } from "@/utils/validationSchema";
import EmptyState from "@/components/EmptyState";

type Props = {};

export default function ReviewsModal({ }: Props) {
    const [currentPage, setCurrentPage] = useState<number>(1);
    const pageLimit = 10;

    const {
        reviews,
        totalCount,
        isError,
        isLoading,
        reviewDetailData,
        openReviewDetail,
        closeReviewDetail,
        replyAReview,
    } = useReviews({
        currentPage,
        pageLimit,
    });

    return (
        <div className="md:grid md:grid-cols-3 gap-4 min-h-[65vh]">
            <div
                className={cn(
                    "transition",
                    reviewDetailData ? "md:col-span-2" : "md:col-span-3"
                )}
            >
                {reviews.length > 0 && <SectionTitle title="Review Manager" />}

                {isLoading ? (
                    <FullPageSpinner />
                ) : reviews.length > 0 ? (
                    <div className={cn("py-6", reviewDetailData && "pr-4 3xl:pr-12")}>
                        {reviews.map((review, index) => (
                            <ReviewCard
                                key={index}
                                review={review}
                                onClick={() => openReviewDetail(review)}
                                isSelected={reviewDetailData?.id === review.id}
                            />
                        ))}
                    </div>
                ) : (
                    <EmptyState
                        title="No Reviews Yet"
                        message="Your Customers Reviews Will Appear Here"
                        image="/icons/empty_review_state.png"
                        imageSize="w-[182px] 3xl:w-[265px]"
                        noBg
                    />
                )}
            </div>

            {reviewDetailData && (
                <div
                    className={cn(
                        "col-span-1 py-11 md:py-6 px-6 md:px-0 3xl:px-8 min-w-[310px] flex flex-col gap-16 justify-between h-auto md:h-full absolute md:relative top-0 left-0 z-10 bg-white w-full "
                    )}
                >
                    <div
                        className="flex md:hidden items-center gap-0.5 text-primary-500 cursor-pointer"
                        onClick={closeReviewDetail}
                    >
                        {Icons.ic_chevron_left}
                        <p className="text-sm 2xl:text-base font-medium">Back</p>
                    </div>
                    <ReviewCard
                        review={reviewDetailData}
                        isReviewDetail
                        size="*:w-3 *:h-3"
                        gap="!gap-1"
                    />
                    {reviewDetailData?.Reply?.map((item, index) => (
                        <ReviewCard
                            key={index}
                            review={item}
                            isReviewDetail
                            size="*:w-3 *:h-3"
                            gap="!gap-1"
                        />
                    ))}

                    <Formik
                        initialValues={{
                            message: "",
                        }}
                        onSubmit={async (values, { setSubmitting, resetForm }) => {
                            console.log(values);

                            replyAReview.mutate(values, {
                                onSuccess: () => {
                                    resetForm();
                                },
                            });
                            setSubmitting(false);
                        }}
                        validationSchema={replyReviewSchema}
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
                                <Form className="space-y-4">
                                    <TextArea
                                        name="message"
                                        id="message"
                                        type="text"
                                        label="Reply Review"
                                        placeholder="Type a message"
                                        value={values.message}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={
                                            errors.message && touched.message ? errors.message : ""
                                        }
                                    />

                                    <Button
                                        color="primary"
                                        fullWidth
                                        radius="lg"
                                        type="submit"
                                        loading={isSubmitting || replyAReview.isPending}
                                        disaabled={
                                            !isValid ||
                                            !dirty ||
                                            isSubmitting ||
                                            replyAReview.isPending
                                        }
                                    >
                                        Post reply
                                    </Button>
                                </Form>
                            );
                        }}
                    </Formik>
                </div>
            )}
        </div>
    );
}
