import Image from "next/image";
import { BlurredDialog, Button } from "@/ui";
import useWithdrawFunds from "@/hooks/wallet/useWithdrawFunds";
import Withdraw from "@/components/Wallet/Withdraw";
import VerifyOTP from "@/components/Wallet/VerifyOTP"

type WithdrawFundsProps = { wallteBalance: number };

export default function WithDrawFunds({ wallteBalance }: WithdrawFundsProps) {
    const {
        sendOtp,
        verifyOtp,
        amount,
        setAmount,
        otp,
        setOtp,

        openWithdrawModal,
        handleWithdrawModal,
        openVerifyOtpModal,
        handleVerifyOtpModal,
    } = useWithdrawFunds();
    return (
        <>
            <BlurredDialog
                open={openWithdrawModal}
                onOpenChange={handleWithdrawModal}
                trigger={
                    <Button
                        variant="filled"
                        color="primary"
                        className="!py-3 3xl:!py-4 !px-5 3xl:!px-6 !text-base 3xl:!text-xl"
                    >
                        Withdraw Funds
                    </Button>
                }
                content={
                    <Withdraw
                        amount={amount}
                        setAmount={setAmount}
                        handleWithdrawal={() => sendOtp.mutate()}
                        handleModal={handleWithdrawModal}
                        isLoading={false}
                        wallteBalance={wallteBalance}
                    />
                }
                width="max-w-[750px] 3xl:max-w-[950px]"
            />
            {openVerifyOtpModal && (
                <BlurredDialog
                    title={
                        <Image src="/icons/mailbox.png" alt="" width={140} height={93} />
                    }
                    open={openVerifyOtpModal}
                    onOpenChange={handleVerifyOtpModal}
                    trigger={<button />}
                    content={
                        <VerifyOTP
                            handleVerifyOtp={() => verifyOtp.mutate(otp)}
                            handleModal={handleWithdrawModal}
                            isLoading={sendOtp.isPending}
                            otp={otp}
                            setOtp={setOtp}
                            handleResendOtp={() => sendOtp.mutate()}
                        />
                    }
                    width="max-w-[750px] 3xl:max-w-[950px]"
                />
            )}
        </>
    );
}
