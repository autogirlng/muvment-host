import { Spinner } from "@/ui";
import { useHostPerformance } from "@/hooks/performance/useHostPerformance";
import WithDrawFunds from "@/components/Wallet/WithdrawFunds";

export default function WalletBalance() {
    const { useGetEarningHistory } = useHostPerformance();
    const { data: earningHistoryData, isError, isLoading } = useGetEarningHistory();
    
    const totalEarnings = earningHistoryData?.data?.totalEarnings ?? 0;

    return (
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-2 bg-grey-75 rounded-3xl py-11 px-14">
            {isLoading ? (
                <Spinner />
            ) : isError ? (
                //   retry button instead
                <p>something went wrong</p>
            ) : (
                <>
                    <div className="space-y-4 md:space-y-6 text-center md:text-left">
                        <p className="uppercase text-xs !font-semibold">BALANCE</p>
                        <h1 className="text-primary-900 text-h2 3xl:text-h1 !font-bold">
                            NGN {totalEarnings ? totalEarnings.toLocaleString() : "0"}
                        </h1>
                    </div>
                    <WithDrawFunds wallteBalance={totalEarnings} />
                </>
            )}
        </div>
    );
}
