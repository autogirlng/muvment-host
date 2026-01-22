import { Icons, WhatWeOffer } from "@/ui";
import { benefitProps } from "@/components/LandingPage/props";


const benefits: benefitProps[] = [
    {
        title: "Earn Extra Income",
        description:
            "Discover the financial benefits of sharing your car. It's more than just extra money; it's financial freedom at your fingertips.",
        icon: Icons.ic_folder_library,
    },
    {
        title: "Flexible Scheduling",
        description:
            "Your time, your rules. You have the flexibility to decide when your car is available for rent. Set your availability and let our system handle the rest.",
        icon: Icons.ic_renewable_energy,
    },
    {
        title: "Simple Onboarding",
        description:
            "Getting started with Muvment is easy. With our intuitive platform, you’ll be up and running in no time. No complicated paperwork—just a straightforward path to extra income.",
        icon: Icons.ic_bend_tool,
    },
];

function Benefits() {
    return <WhatWeOffer title="Benefits" list={benefits} />;
}

export { Benefits };
