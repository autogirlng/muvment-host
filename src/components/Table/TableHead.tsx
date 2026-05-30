const TableHead = ({ tableHeadItems }: { tableHeadItems: string[] }) => (
    <thead className="hidden lg:table-header-group">
        <tr>
            {tableHeadItems.map((item: string) => (
                <th
                    key={item}
                    scope="col"
                    className="whitespace-nowrap bg-grey-75 px-6 py-3 text-start text-sm font-medium text-grey-700"
                >
                    {item}
                </th>
            ))}
        </tr>
    </thead>
);

export default TableHead;
