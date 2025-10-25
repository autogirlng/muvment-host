import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Icons, AvatarImage, Popup } from "@/ui";
import { useAppSelector } from "@/lib/hooks";
import { getInitialsFromName } from "@/utils/functions";
import Notifications from "@/components/Notifications";
import useNotifications from "@/hooks/useNotifications";
import { NavPopup } from "@/components/Navbar";


export const IconWrapper = ({ icon }: any) => {
    return (
        <div className="w-10 h-10 flex items-center justify-center border border-grey-300 bg-grey-100 rounded-full text-grey-700 fill-grey-700 hover:text-primary-500 hover:border-primary-100 hover:bg-primary-75">
            {icon}
        </div>
    );
};

export function TopHeader() {
    const pageLimit = 5;
    const { user } = useAppSelector((state) => state.user);
    const { notifications, isError, isLoading, totalCount } = useNotifications({
        pageLimit,
        currentPage: 1,
    });

    const pathname = usePathname();
    const [notificationPopupIsOpen, setNotificationPopupIsOpen] =
        useState<boolean>(false);
    const [popupIsOpen, setPopupIsOpen] = useState<boolean>(false);

    useEffect(() => {
        setNotificationPopupIsOpen(false);
        setPopupIsOpen(false);
    }, [pathname]);

    return (
        <div className="hidden md:flex w-full md:px-6 2xl:px-8 py-5 items-center justify-between bg-white border-b border-grey-300 shadow-[0_4px_100px_0_#00000012]">
            <h6 className="text-base 2xl:text-h6 text-black">
                Hello, {user?.data.firstName}
            </h6>
            <div className="flex items-center gap-3">
                <Popup
                    open={true}
                    isOpen={notificationPopupIsOpen}
                    handleIsOpen={(open: boolean) => setNotificationPopupIsOpen(open)}
                    className="!w-[400px] 3xl:!w-[480px]"
                    trigger={
                        <button className="flex items-center gap-1 text-grey-600">
                            <IconWrapper icon={Icons.ic_notification} />
                        </button>
                    }
                    content={
                        <div className="space-y-7">
                            <h6 className="text-xl 3xl:text-h6 text-grey-700 !font-semibold">
                                Notifications{" "}
                                <span className="text-primary-500">{`(${totalCount})`}</span>
                            </h6>
                            {notifications.length > 0 ? (
                                <>
                                    <Notifications
                                        notifications={notifications.slice(0, 3)}
                                        isError={isError}
                                        isLoading={isLoading}
                                    />
                                    <Link
                                        href="/notifications"
                                        className="block bg-primary-75 rounded-[48px] w-fit mx-auto text-primary-500 text-xs 3xl:text-sm !font-medium py-2 px-4 3xl:px-6 hover:bg-primary-500 hover:text-white"
                                    >
                                        View all
                                    </Link>
                                </>
                            ) : (
                                <div className="text-center space-y-2  pt-5 pb-14">
                                    <p className="text-base 3xl:text-xl text-grey-900 !font-medium">
                                        No New Notifications
                                    </p>
                                    <p className="text-xs 3xl:text-sm text-grey-600">
                                        Check back soon
                                    </p>
                                </div>
                            )}
                        </div>
                    }
                />

                <Link href="/settings">
                    <IconWrapper icon={Icons.ic_setting} />
                </Link>

                <Popup
                    open={true}
                    isOpen={popupIsOpen}
                    handleIsOpen={(open: boolean) => setPopupIsOpen(open)}
                    trigger={
                        <button className="flex items-center gap-1 text-grey-600">
                            <AvatarImage
                                image={
                                    user?.data.profilePictureUrl
                                }
                                initials={
                                    user && getInitialsFromName(user.data.firstName, user.data.lastName)
                                }
                            />
                            <span className="*:!w-[14px] *:!h-[14px]">
                                {Icons.ic_chevron_down}
                            </span>
                        </button>
                    }
                    content={<NavPopup user={user ?? null} />}
                />
            </div>
        </div>
    );
}
