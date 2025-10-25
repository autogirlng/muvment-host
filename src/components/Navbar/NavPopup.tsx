import Link from "next/link";
import { usePathname } from "next/navigation";
import { popupNavItems, popupNavItemsHome } from "@/utils/data";
import { getInitialsFromName } from "@/utils/functions";
import { AvatarImage, HorizontalDivider } from "@/ui";
import { MobileNavItem } from "@/components/Navbar";
import { NavPopupProps } from "@/components/Navbar/props";



export function NavPopup({ handleClick, user }: NavPopupProps) {
  const pathname = usePathname();

  return (
    <div className="space-y-3">
      {user && (
        <>
          <AvatarImage
            image={
              user.data.profilePictureUrl
            }
            initials={getInitialsFromName(user.data.firstName, user.data.lastName)}
            size="!w-11 !h-11"
          />
          <div className="space-y-1">
            <p className="text-sm">
              {`${user.data.firstName} ${user.data.lastName}`}
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
