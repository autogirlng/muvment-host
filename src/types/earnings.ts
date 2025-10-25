
export interface DayEarning  {
  day: string;
  amount: number;
};

export interface MonthEarning  {
  month: string;
  amount: number;
};

export interface EarningsResponse  {
  earnings: DayEarning[] | MonthEarning[];
  totalEarnings: number;
  periodStart: string;
  periodEnd: string;
};


export enum EarningPeriod {
  WEEK = "week",
  MONTH = "month",
  QUARTER = "quarter",
  ALL_TIME = "all_time",
}
