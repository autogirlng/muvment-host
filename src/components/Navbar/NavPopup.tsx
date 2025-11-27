import Link from "next/link";
import { usePathname } from "next/navigation";
import { popupNavItems, popupNavItemsHome } from "@/data";
import { getInitialsFromName } from "@/utils/functions";
import { HorizontalDivider } from "@/ui";
import { AvatarImage } from "@/ui";
import { NavPopupProps } from "./types";
import MobileNavItem from "./MobileNavItem";



export default function NavPopup({ handleClick, user }: NavPopupProps) {
    const pathname = usePathname();

    return (
        <div className="space-y-3">
            {user && (
                <>
                    <AvatarImage
                        image={
                            user?.isBusiness && user?.businessLogo
                                ? user?.businessLogo
                                : user?.profileImage
                                    ? user?.profileImage
                                    : ""
                        }
                        initials={getInitialsFromName(user.firstName, user.lastName)}
                        size="!w-11 !h-11"
                    />
                    <div className="space-y-1">
                        <p className="text-sm">
                            {user.businessName ?? `${user.firstName} ${user.lastName}`}
                        </p>
                        <Link href="/profile" className="text-xs text-primary-500">
                            View profile
                        </Link>
                    </div>
                    <HorizontalDivider variant="light" />
                </>
            )}

            <ul className="list-none space-y-3">
                {pathname === "/"
                    ? popupNavItemsHome.map((item, index) => (
                        <MobileNavItem
                            handleClick={handleClick}
                            key={index}
                            icon={item.icon}
                            name={item.name}
                            link={item.link}
                            className="!py-1.5"
                        />
                    ))
                    : popupNavItems.map((item, index) => (
                        <MobileNavItem
                            handleClick={handleClick}
                            key={index}
                            icon={item.icon}
                            name={item.name}
                            link={item.link}
                            className="!py-1.5"
                        />
                    ))}
            </ul>
        </div>
    );
}
