import { useEffect, useState } from "react";
import { useAppSelector } from "@/lib/hooks";
import { AccountSetupTask } from "@/types";
import { completeAccountSetupTasks } from "@/utils/data";
import { TaskCard } from "@/components/AccountSetup/TaskCard";


export function AccountSetupTasks() {
    const [accountSetupTasks, setAccountSetupTasks] = useState<AccountSetupTask[]>(completeAccountSetupTasks);
    const { user } = useAppSelector((state) => state.user);

    useEffect(() => {

        if (user) {
            const updatedTasks = accountSetupTasks.map((task) => ({
                ...task,
                isCompleted: Boolean(user.data[task.taskId]),
            }));
            setAccountSetupTasks(updatedTasks);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 3xl:gap-10 4xl:gap-[70px]">
            {accountSetupTasks.map(
                (task, index) =>
                    !task.isCompleted && (
                        <TaskCard
                            key={index}
                            icon={task.icon}
                            title={task.title}
                            link={task.link}
                            linkText={task.linkText}
                        />
                    )
            )}
        </div>
    );
}
