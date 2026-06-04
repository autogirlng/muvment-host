import cn from "classnames";

const TableHead = ({
    tableHeadItems,
    sticky = false,
}: {
    tableHeadItems: string[];
    sticky?: boolean;
}) => (
    <thead className="hidden lg:table-header-group">
        <tr className="border-b border-grey-200/90">
            {tableHeadItems.map((item: string, index: number) => (
                <th
                    key={item}
                    scope="col"
                    className={cn(
                        "whitespace-nowrap bg-grey-75 px-5 py-3.5 text-start text-xs font-semibold uppercase tracking-wider text-grey-500",
                        sticky && "sticky top-0 z-20 bg-grey-75 shadow-[0_1px_0_#e4e7ec]",
                        index === 0 && "pl-6",
                        index === tableHeadItems.length - 1 && "pr-6"
                    )}
                >
                    {item}
                </th>
            ))}
        </tr>
    </thead>
);

export default TableHead;
