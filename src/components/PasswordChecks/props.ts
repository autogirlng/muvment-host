import { ChangeEvent, FocusEvent, ReactNode} from "react";
import { FormikErrors } from "formik";

export interface PasswordChecksProps  {
  name?: string;
  label?: string;
  placeholder?: string;
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleBlur: (e: FocusEvent<HTMLInputElement>) => void;
  setFieldValue: (
    field: string,
    value: any,
    shouldValidate?: boolean
  ) => Promise<void | FormikErrors<any>>;
  values: any;
  error: string;
  children?: ReactNode;
  showChecks?: boolean;
};