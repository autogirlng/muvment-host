/** Shared class strings for responsive card → desktop table layout */

export const tableWrapperClass =
    "overflow-x-auto rounded-2xl border border-grey-200/90 bg-white shadow-[0_1px_3px_rgba(16,25,40,0.06)] lg:shadow-[0_2px_8px_rgba(16,25,40,0.04)]";

export const tableInnerClass =
    "overflow-x-auto bg-grey-50/80 lg:bg-transparent rounded-xl lg:rounded-none p-4 lg:p-0";

export const tableClass =
    "block lg:table w-full min-w-full lg:divide-y lg:divide-grey-100";

export const tableBodyClass =
    "block lg:table-row-group lg:divide-y lg:divide-grey-100";

export const tableRowClass =
    "block lg:table-row bg-white border border-grey-200/90 lg:border-0 hover:border-grey-300 lg:hover:bg-grey-50/80 rounded-xl lg:rounded-none mb-3 lg:mb-0 p-4 lg:p-0 shadow-[0_1px_2px_rgba(16,25,40,0.04)] lg:shadow-none transition-colors duration-150";

export const tableCellBaseClass =
    "px-4 py-3.5 lg:px-5 lg:py-4 lg:whitespace-nowrap w-full lg:w-fit text-sm text-grey-700 flex justify-between items-center lg:table-cell border-b lg:border-none last:border-0 border-grey-100/80";

export const tableMobileTitleClass =
    "font-medium text-grey-500 lg:hidden w-[42%] shrink-0 break-words text-left text-xs uppercase tracking-wide";

export const tableCellValueClass =
    "w-[58%] lg:w-auto text-right lg:text-left flex justify-end lg:justify-start break-words overflow-hidden";
