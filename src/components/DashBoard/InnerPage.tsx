import BackLink from "@/components/BackLink";
import { InnerPageProps } from "./props";


export default function DashboardInnerPage({
    isInnerPage = false,
    title,
    description,
    backLink,
    children,
}: InnerPageProps) {
    return (
        <main
            className="space-y-10 2xl:space-y-[52px] py-8 2xl:py-11"
        >
            <div className="space-y-3 2xl:space-y-5">
                {isInnerPage && <BackLink backLink={backLink || ""} />}
                <h2 className="text-grey-700 text-h4 2xl:text-4xl font-bold">
                    {title}
                </h2>
                {description && <p className="text-grey-500 text-sm 2xl:text-base">{description}</p>}
            </div>
            {children}
        </main>
    );
}
