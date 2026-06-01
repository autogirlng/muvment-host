import { ReactNode } from "react";
import cn from "classnames";
import * as Dialog from "@radix-ui/react-dialog";
import * as Popover from "@radix-ui/react-popover";
import { X } from "lucide-react";
import { PopupProps } from "./props";


export const TipsPopup = ({ trigger, content }: PopupProps) => (
    <Dialog.Root modal>
        <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>
        <Dialog.Portal>
            <Dialog.Overlay className="bg-black/25 backdrop-blur-sm data-[state=open]:animate-overlayShow fixed inset-0" />
            <Dialog.Content className="data-[state=open]:animate-contentShow fixed top-0 left-0 z-10 min-h-screen h-full w-full flex justify-center py-20 overflow-auto focus:outline-none">
                <Dialog.Title className="hidden"></Dialog.Title>
                <div className="relative h-fit max-w-[350px] py-7 px-[31px] rounded-[45px] bg-grey-75 ">
                    <Dialog.Close asChild>
                        <button
                            type="button"
                            className="text-grey-600 hover:text-primary-500 absolute top-5 right-5 appearance-none inline-flex h-8 w-8 items-center justify-center focus:outline-none"
                            aria-label="Close"
                        >
                            <X size={20} strokeWidth={2} />
                        </button>
                    </Dialog.Close>
                    {content}
                </div>
            </Dialog.Content>
        </Dialog.Portal>
    </Dialog.Root>
);

export const Popup = ({
    content,
    trigger,
    className,
    open,
    isOpen,
    handleIsOpen,
    align,
}: {
    content: ReactNode;
    trigger: ReactNode;
    className?: string;
    open?: boolean;
    isOpen?: boolean;
    handleIsOpen?: (open: boolean) => void;
    align?: "center" | "end" | "start";
}) => (
    <Popover.Root {...(open ? { open: isOpen, onOpenChange: handleIsOpen } : {})}>
        <Popover.Trigger asChild>{trigger}</Popover.Trigger>
        <Popover.Portal>
            <Popover.Content
                align={align ?? "end"}
                className={cn(
                    "rounded-xl p-4 w-[225px] sm:w-[255px] bg-white border border-grey-200 will-change-[transform,opacity] data-[state=open]:data-[side=top]:animate-slideDownAndFade data-[state=open]:data-[side=right]:animate-slideLeftAndFade data-[state=open]:data-[side=bottom]:animate-slideUpAndFade data-[state=open]:data-[side=left]:animate-slideRightAndFade",
                    className
                )}
                sideOffset={5}
            >
                {content}
            </Popover.Content>
        </Popover.Portal>
    </Popover.Root>
);
