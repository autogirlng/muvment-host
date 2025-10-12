import React, { useState } from "react";
import {
    citiesOptions,
    vehicleAvailabilityOptions,
    vehicleTypesOptions,
} from "@/utils/data";
import Image from "next/image";
import Button from "@/ui/button";
import { SelectInput } from "@/ui";



// Define daily rates for each vehicle type by city
const getDailyRate = (city: string, vehicleType: string): number => {
    const rates: Record<string, Record<string, number>> = {
        Lagos: {
            Sedan: 70000,
            SUV: 110000,
            "Mid-size SUV": 90000,
            Bus: 100000,
            "Sports Car": 120000,
            "Luxury Vehicle": 150000,
            Truck: 130000,
            Pickup: 95000,
        },
        Abuja: {
            Sedan: 75000,
            SUV: 115000,
            "Mid-size SUV": 95000,
            Bus: 105000,
            "Sports Car": 125000,
            "Luxury Vehicle": 155000,
            Truck: 135000,
            Pickup: 100000,
        },
        Default: {
            Sedan: 65000,
            SUV: 100000,
            "Mid-size SUV": 85000,
            Bus: 95000,
            "Sports Car": 110000,
            "Luxury Vehicle": 140000,
            Truck: 120000,
            Pickup: 90000,
        },
    };

    return rates[city]?.[vehicleType] || rates["Default"][vehicleType] || 0;
};

// Convert availability option to number of days
const getDaysFromAvailability = (availability: string): number => {
    if (availability.includes("week")) {
        const weeks = parseInt(availability.split(" ")[0]);
        return weeks * 7;
    }
    if (availability.includes("day")) {
        return parseInt(availability.split(" ")[0]);
    }
    return 0;
};

function Calculator() {
    const [location, setLocation] = useState<string>("");
    const [vehicleType, setVehicleType] = useState<string>("");
    const [availability, setAvailability] = useState<string>("");
    const [earnings, setEarnings] = useState<number>(0);

    const calculateEarnings = () => {
        if (!location || !vehicleType || !availability) return;

        const dailyRate = getDailyRate(location, vehicleType);
        const days = getDaysFromAvailability(availability);

        const baseEarnings = dailyRate * days;
        const netEarnings = baseEarnings * 0.8; // Apply 20% commission

        setEarnings(netEarnings);
    };

    return (
        <section
            id="calculator"
            className="bg-grey-900 lg:bg-calculator-overlay bg-contain bg-no-repeat bg-left py-10 lg:pt-16 xl:pt-20 3xl:pt-[133px] lg:pb-[100px] xl:pb-[130px] 3xl:pb-[186px] px-6 lg:px-16 3xl:px-[110px]"
        >
            <div className="max-w-[1700px] mx-auto flex flex-col lg:flex-row gap-7 lg:gap-5 xl:gap-8 3xl:gap-[34px] text-center lg:text-left">
                <div className="space-y-10 lg:space-y-5 text-white">
                    <h1 className="text-h5 md:text-h2 3xl:text-h1 max-w-[860px]">
                        Curious about your{" "}
                        <span className="text-h5 md:text-h2 3xl:text-[72px] md:leading-[72px] text-warning-400">
                            30
                        </span>{" "}
                        days earnings as a Muvment host?
                    </h1>
                    <p className="mx-auto lg:mx-0 max-w-[420px] 3xl:max-w-[640px] text-sm sm:text-base 3xl:text-h6">
                        Calculate your potential earnings on the muvment platform with your
                        operational specifics
                    </p>
                </div>
                <div className="relative mx-auto w-full max-w-[650px] xl:w-[804px] px-6 lg:px-10 3xl:px-16 py-[65px] lg:pt-[60px] 3xl:pt-[89px] lg:pb-24 3xl:pb-[121px] bg-grey-900 border-2 border-primary-500 rounded-3xl lg:rounded-[90px] 3xl:rounded-[118px]">
                    <div className="absolute top-[-85px] right-[-10px] hidden lg:block ">
                        <Image
                            src="/images/landing/money.png"
                            alt="money"
                            width={200}
                            height={200}
                            className="w-[150px] 3xl:w-[200px]"
                        />
                    </div>
                    <p className="uppercase text-white text-center !tracking-[9px] text-sm lg:text-base 3xl:text-h6">
                        Income Calculator
                    </p>
                    <div className="mt-8 lg:mt-20 3xl:mt-32 mb-8 lg:mb-10 3xl:mb-[50px] text-white text-center space-y-4">
                        <p className="text-sm sm:text-base 3xl:text-h6">
                            Potential Earnings
                        </p>
                        <h1 className="text-h3 sm:text-h2 3xl:text-h1">
                            NGN {earnings.toLocaleString()}
                        </h1>
                    </div>
                    <div className="space-y-8 text-left">
                        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-6">
                            <SelectInput
                                placeholder="Select city of operation"
                                variant="filled"
                                label="City of operation"
                                id="city"
                                options={citiesOptions}
                                value={location}
                                onChange={setLocation}
                            />
                            <SelectInput
                                placeholder="Select vehicle type"
                                variant="filled"
                                label="Vehicle type"
                                id="vehicleType"
                                options={vehicleTypesOptions}
                                value={vehicleType}
                                onChange={setVehicleType}
                            />
                        </div>
                        <SelectInput
                            placeholder="Select availability"
                            variant="filled"
                            label="Availability"
                            id="availability"
                            options={vehicleAvailabilityOptions}
                            value={availability}
                            onChange={setAvailability}
                        />
                        <Button
                            fullWidth
                            variant="filled"
                            color="primary"
                            onClick={calculateEarnings}
                            loading={false}
                            disabled={!location || !vehicleType || !availability}
                        >
                            Calculate
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Calculator;
