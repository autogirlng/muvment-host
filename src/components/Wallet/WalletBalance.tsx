import { Spinner } from "@/ui";
import useWallet from "@/hooks/wallet/useWallet";
import WithDrawFunds from "@/components/Wallet/WithdrawFunds";



export default function WalletBalance() {
    const { wallteBalance, isError, isLoading } = useWallet();
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
                            NGN {`${wallteBalance?.walletBalance ?? "-"}`}
                        </h1>
                    </div>
                    <WithDrawFunds wallteBalance={wallteBalance?.walletBalance ?? 0} />
                </>
            )}
        </div>
    );
}
