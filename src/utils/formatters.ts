/** Amount digits only (no ₦); e.g. 61984750 → "61,984,750.00" with en-NG grouping */
export function formatNgnAmount(amount: number): string {
  return amount.toLocaleString("en-NG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/** Whole numbers with grouping; e.g. 1234 → "1,234" */
export function formatLocaleCount(value: number): string {
  return Math.round(value).toLocaleString("en-NG", {
    maximumFractionDigits: 0,
  });
}

export function parseLooseNumber(raw: string): number | null {
  const n = Number(String(raw).replace(/,/g, "").trim());
  return Number.isFinite(n) ? n : null;
}

export const formatNumberWithCommas = (value: string) => {
  const number = value.replace(/,/g, "");
  if (!number || isNaN(Number(number))) return "";
  const [intPart, decimalPart] = number.split(".");
  return (
    Number(intPart).toLocaleString() + (decimalPart ? `.${decimalPart}` : "")
  );
};

export const stripNonNumeric = (value: string) => {
  return value.replace(/[^\d.]/g, "");
};

export const isPercentageField = (fieldName: string) => {
  const percentageFields = [
    "discount",
    "rateDiscount",
    "someOtherPercentField",
  ];
  return percentageFields.includes(fieldName);
};
