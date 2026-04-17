import { toast } from "react-toastify";

export default function useNewsletter() {
  const addSubscriber = async ({ email }: { email: string }) => {
    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error("Failed to subscribe");
      }

      toast.success("Successful!");
    } catch (err) {
      toast.error("Failed to subscribe. Please try again.");
    }
  };

  return { addSubscriber };
}
