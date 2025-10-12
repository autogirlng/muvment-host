import { HowItWorks } from "@/ui/howItWorks";
import { stepProps } from "../props";



const steps: stepProps[] = [
  {
    title: "Sign Up",
    description:
      "Our simple sign-up process gets you started in no time. Create your account and join other hosts to start a business for free.",
  },
  {
    title: "List Your Vehicle",
    description:
      "Adding your vehicle to the platform is straightforward. Follow our easy steps to provide all vehicle and driver details, set your availability schedule, and get your car ready for rental.",
  },
  {
    title: "Start earning",
    description:
      "Get paid promptly and securely. Track your earnings and withdraw your funds with ease, directly from your personal wallet.",
  },
];




function Steps() {
  return (
    <HowItWorks
      className="md:!pt-[120px]"
      title="Start earning in a few minutes"
      steps={steps}
    />
  );
}

export { Steps };
