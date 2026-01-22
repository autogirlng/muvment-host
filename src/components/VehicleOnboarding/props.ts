
export interface VehiclePhotosTipsProps { photoTipIndex: number };



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