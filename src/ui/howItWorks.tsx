import cn from "classnames";
import { Button } from "@/ui";
import { HowItWorksProps } from "./props";




function HowItWorks({ title, steps, className }: HowItWorksProps) {
    return (
        <section
            id="how-it-works"
            className={cn("py-[120px] md:pt-[100px] md:pb-[200px]", className)}
        >
            <div className="space-y-8 md:space-y-[141px] max-w-[914px] mx-auto px-5 md:px-0">
                <h1
                    className={
                        "text-h3 md:text-h2 3xl:text-h1 text-primary-900 text-center"
                    }
                >
                    {title}
                </h1>
                <div className="flex flex-col gap-3 md:gap-0 items-center">
                    {steps.map((step, index) => (
                        <div
                            key={index}
                            className="md:h-[400px] 3xl:h-[600px] last:md:h-0 relative"
                        >
                            <div className="h-full w-[5px] bg-grey-400 mx-auto" />

                            <div
                                className={cn(
                                    "md:absolute md:-top-[80px]",
                                    (index + 1) % 2 === 0 ? "right-10" : "left-10"
                                )}
                            >
                                <div
                                    className={cn(
                                        "py-[35px] px-8 md:px-[43px] bg-grey-50 rounded-3xl w-full md:w-[330px] lg:w-[419px] text-primary-900 relative space-y-[10px] after:md:absolute after:md:top-[70px] after:md:content-[''] after:md:h-[30px] after:md:w-[30px] after:md:bg-grey-400 after:md:rounded-full",
                                        (index + 1) % 2 === 0
                                            ? "after:-right-[52px]"
                                            : "after:-left-[52px]"
                                    )}
                                >
                                    <p className="text-sm 3xl:text-base text-grey-400 uppercase">
                                        Step {index + 1}
                                    </p>
                                    <h4 className="text-h5 3xl:text-h4">{step.title}</h4>
                                    <p className="text-xs md:text-sm">{step.description}</p>
                                    {step.button && (
                                        <Button variant="filled" color="primary">
                                            {step.button}
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export { HowItWorks };
