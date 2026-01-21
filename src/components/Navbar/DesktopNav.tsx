import { useState, useEffect } from "react";
import cn from "classnames";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { customerAppUrl, popupNavItemsforNoUser } from "@/utils/data";
import { getInitialsFromName } from "@/utils/functions";
import { nav_logo } from "@/ui/assets";
import { AvatarInitials, Popup, Icons } from "@/ui";
import { NavPopup, MobileNavItem } from "@/components/Navbar";
import { DesktopNavProps } from "@/components/Navbar/props";


export function DesktopNav({ user, userToken }: DesktopNavProps) {
  const [sticky, setSticky] = useState<boolean>(false);
  const router = useRouter()

  useEffect(() => {
    window.addEventListener("scroll", () => {
      setSticky(window.scrollY > 600);
    });
  }, []);

  return (
    <header
      className={cn(
        "hidden md:flex justify-between items-center fixed top-0 left-0 z-[999] w-full px-20 py-5",
        sticky
          ? "bg-white border-b border-grey-200"
          : "bg-[#F9FAFB59] backdrop-blur-xl"
      )}
    >
      <Image className="cursor-pointer" onClick={() => router.push("/")} src={nav_logo} alt="" width={114} height={40} />
      <nav className="flex items-center gap-4">
        <Link
          className={cn(
            "text-base 3xl:text-xl",
            sticky ? "text-grey-700" : "text-white"
          )}
          href={customerAppUrl}
        >
          Book a ride
        </Link>
        <div className="h-6 w-px bg-white" />

        <Popup
          trigger={
            <button className="bg-white border border-grey-300 rounded-[33px] p-1 pr-2 flex items-center gap-2">
              <AvatarInitials
                initials={
                  user
                    ? getInitialsFromName(user?.data.firstName, user?.data.lastName)
                    : Icons.ic_user
                }
                size="!w-8 !h-8"
                color="!bg-primary-100 !text-primary-800 !text-[10px] !font-bold *:!w-5 *!h-5"
              />
              {Icons.ic_menu}
            </button>
          }
          content={
            <ul className="list-none">
              {userToken ? (
                <NavPopup user={user ?? null} />
              ) : (
                popupNavItemsforNoUser.map((item, index) => (
                  <MobileNavItem
                    key={index}
                    icon={item.icon}
                    name={item.name}
                    link={item.link}
                    className="!py-1.5"
                  />
                ))
              )}
            </ul>
          }
        />
      </nav>
    </header>
  );
}
