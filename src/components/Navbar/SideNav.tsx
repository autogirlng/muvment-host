import Image from "next/image";
import { dashboardNavItems } from "@/utils/data";
import { logo } from "@/ui/assets";
import { SideNavItem } from "@/components/Navbar";

export function SideNav() {
    return (
        <div className="bg-white pt-8 pb-6 hidden md:block fixed left-0 top-0 md:w-[252px] 2xl:w-[272px] h-screen border-r border-grey-300 shadow-[12px_4px_100px_0_#00000012]">
            <div className="space-y-3 px-2 w-full">
                <div className="ml-4 pb-5">
                    <Image className="" src={logo} alt="" width={114} height={40} />
                </div>
                <ul className="list-none space-y-3">
                    {dashboardNavItems.map((item, index) => (
                        <SideNavItem
                            key={index}
                            icon={item.icon}
                            name={item.name}
                            link={item.link}
                        />
                    ))}
                </ul>
            </div>
        </div>
    );
}
