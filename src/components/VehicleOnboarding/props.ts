import { Dispatch, SetStateAction } from "react";

export interface VehiclePhotosTipsProps { photoTipIndex: number };

export interface VehiclePhotosFormProps {
    steps: string[];
    setPhotoTipIndex: Dispatch<SetStateAction<number>>;
    currentStep: number;
    setCurrentStep: (step: number) => void;
};


export interface VehiclePhotosProps {
  steps: string[];
  currentStep: number;
  setCurrentStep: (step: number) => void;
};


export interface VehicleSummaryProps {
    steps: string[];
    currentStep: number;
    setCurrentStep: (step: number) => void;
};

export interface BasicVehicleInformationFormProps  {
  steps: string[];
  currentStep: number;
  setCurrentStep: (step: number) => void;
};


export interface PricingRowProps  {
  optional?: boolean;
  title: string;
  rateLabel: string;
  rateName: string;
  ratePlaceholder: string;
  rateUnit: string;
  serviceFeeName: string;
  guestWillSeeName: string;
  rateValue: string;
  errors: any;
  touched: any;
  tooltipDescription?: string;
  tooltipTitle?: string;
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleBlur: (event: React.FocusEvent<HTMLInputElement>) => void;
  info?: boolean;
};


export interface DiscountRowProps  {
  title: string;
  dailyRateValue?: string;
  percentageLabel: string;
  percentageName: string;
  percentagePlaceholder: string;
  rateUnit: string;
  serviceFeeName: string;
  rateValue: string;
  errors: any;
  touched: any;
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleBlur: (event: React.FocusEvent<HTMLInputElement>) => void;
};