import cn from "classnames";
import { Fragment } from "react";
import { Notification } from "@/types";
import { FullPageSpinner, HorizontalDivider } from "@/ui";
import { formatRelative } from "date-fns";
import {
    getNotificationBgColor,
    getNotificationIcon,
    getNotificationIconColor,
} from "@/utils/functions";
import { parseISO, format, isToday, isYesterday, isAfter, isBefore } from "date-fns";
import { NotificationProps } from "./props";

function groupNotificationsByDay(notifications: Notification[]) {
    return notifications.reduce<Record<string, Notification[]>>(
        (grouped, notification) => {
            const dayKey = formatNotificationDate(notification.createdAt);

            if (!grouped[dayKey]) {
                grouped[dayKey] = [];
            }

            grouped[dayKey].push(notification);
            return grouped;
        },
        {}
    );
}

function formatNotificationDate(dateStr: string) {
    const date = parseISO(dateStr);

    if (isToday(date)) {
        return "Today";
    }

    if (isYesterday(date)) {
        return "Yesterday";
    }

    return format(date, "do MMM");
}

// In the Notifications component, before rendering, map notifications to override SECURITY_ALERT titles
const overrideNotificationTitle = (notification: Notification) => {
    if (notification.notificationType === 'SECURITY_ALERT') {
        return { ...notification, title: 'Host Login' };
    }
    return notification;
};

// Add props for date range filtering
export default function Notifications({
    notifications,
    isLoading,
    isError,
    isDivider = false,
    startDate,
    endDate,
}: NotificationProps & { startDate?: Date | null; endDate?: Date | null }) {
    if (isLoading) {
        return <FullPageSpinner className="min-h-[480px]" />;
    }
    if (isError) {
        return <p>Something went wrong</p>;
    }

    // Map notifications to override SECURITY_ALERT titles before grouping
    const notificationsToRender = notifications.map(overrideNotificationTitle);

    // Client-side filter by date range if provided
    const filteredNotifications = notificationsToRender.filter((n) => {
        if (!startDate && !endDate) return true;
        const created = parseISO(n.createdAt);
        let inclusiveEndDate = endDate
            ? new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate(), 23, 59, 59, 999)
            : undefined;
        if (startDate && inclusiveEndDate) {
            return (
                (isAfter(created, startDate) || created.getTime() === startDate.getTime()) &&
                (isBefore(created, inclusiveEndDate) || created.getTime() === inclusiveEndDate.getTime())
            );
        }
        if (startDate) {
            return isAfter(created, startDate) || created.getTime() === startDate.getTime();
        }
        if (inclusiveEndDate) {
            return isBefore(created, inclusiveEndDate) || created.getTime() === inclusiveEndDate.getTime();
        }
        return true;
    });

    const groupedNotifications = groupNotificationsByDay(filteredNotifications);

    if (Object.keys(groupedNotifications).length === 0) {
        return (
            <div className="py-12 text-center text-grey-500 text-lg">
                No notifications found for this date range.
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {Object.keys(groupedNotifications).map((day) => (
                <div key={day} className="space-y-9">
                    <h3 className="text-xl">{day}</h3>
                    <div className="space-y-4">
                        {groupedNotifications[day].map((item, index) => (
                            <Fragment key={index}>
                                <div key={index} className="flex items-center gap-3">
                                    <div
                                        className={cn(
                                            "w-[52px] h-[52px] rounded-full flex items-center justify-center *:!w-6 *:!h-6 ",
                                            getNotificationBgColor(item.notificationType),
                                            getNotificationIconColor(item.notificationType)
                                        )}
                                    >
                                        {getNotificationIcon(item.notificationType)}
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-base 3xl:text-xl text-grey-900 !font-medium">
                                            {item.title}
                                        </p>
                                        <p className="text-xs 3xl:text-sm text-grey-600">
                                            {item.message}
                                        </p>
                                        <p className="text-xs 3xl:text-sm text-grey-400">
                                            {item.createdAt
                                                ? `${formatRelative(item?.createdAt, new Date())} `
                                                : "-"}
                                        </p>
                                    </div>
                                </div>
                                {isDivider && <HorizontalDivider variant="dark" />}
                            </Fragment>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}
