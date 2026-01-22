import { Dispatch, SetStateAction } from "react";
import OtpVerification from "@/components/OtpVerification";

type Props = {
    handleModal: (open: boolean) => void;
    handleVerifyOtp: () => void;
    isLoading: boolean;
    otp: string;
    setOtp: Dispatch<SetStateAction<string>>;
    handleResendOtp: () => void;
};

const VerifyOTP = ({
    handleModal,
    handleVerifyOtp,
    isLoading,
    otp,
    setOtp,
    handleResendOtp,
}: Props) => {
    return (
        <div className="space-y-6">
            <h6 className="text-base sm:text-xl 3xl:text-h6 !font-semibold text-grey-800">
                We’ve sent a mail your way
            </h6>
            <p className="text-xs sm:text-sm 3xl:text-base text-grey-500">
                We sent you an OTP to verify your email. Please enter the code to
                confirm your withdrawal.
            </p>
            <OtpVerification
                verifyOtp={() => handleVerifyOtp()}
                isVerifyOtpLoading={isLoading}
                isResendOtpLoading={isLoading}
                resendOtp={() => handleResendOtp()}
                otp={otp}
                setOtp={setOtp}
                error={null}
            />
        </div>
    );
};

export default VerifyOTP;
