import { useEffect, useState } from "react";
import { useAppSelector } from "@/lib/hooks";
import { AccountSetupTask, BankDetails } from "@/types";
import { completeAccountSetupTasks } from "@/utils/data";
import { TaskCard } from "@/components/AccountSetup/TaskCard";
import { useHttp } from "@/hooks/useHttp"
import { Icons } from "@/ui";
import { AxiosError } from "axios";


export function AccountSetupTasks() {
    const [accountSetupTasks, setAccountSetupTasks] = useState<AccountSetupTask[]>(completeAccountSetupTasks);
    const { user } = useAppSelector((state) => state.user);
    const [bankAccountSetupCompleted, setBankAccountSetupCompleted] = useState<boolean>(false)
    const http = useHttp()

    const fetchHostAccountDetails = async () => {
        let response
        try {
            response = await http.get<BankDetails>("/v1/hosts/me/bank-details");
            setBankAccountSetupCompleted(response?.status !== "SUCCESSFUL")

        } catch (err) {
            console.log(err)
            // @ts-ignore
            setBankAccountSetupCompleted(response?.data.status !== "SUCCESSFUL");
        }


    }

    useEffect(() => {
        fetchHostAccountDetails();
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
                (task, index) => {
                    return !task.isCompleted && (
                        <TaskCard
                            key={index}
                            icon={task.icon}
                            title={task.title}
                            link={task.link}
                            linkText={task.linkText}
                        />
                    )
                }
            )}


            {
                bankAccountSetupCompleted && (
                    <TaskCard
                        icon={Icons.ic_lock}
                        title="Setup Withdrawal Account"
                        link="/account-setup/withdrawal-account"
                        linkText="Get Started"
                    />
                )
            }

        </div>
    );
}
