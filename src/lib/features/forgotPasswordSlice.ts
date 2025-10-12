import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ForgotPasswordSliceOtpState } from "./types";

const initialState: ForgotPasswordSliceOtpState = {
  forgotPasswordOtp: "",
};

const forgotPasswordSlice = createSlice({
  name: "forgotPassword",
  initialState,
  reducers: {
    setForgotPasswordOtp: (state, action: PayloadAction<string>) => {
      state.forgotPasswordOtp = action.payload;
    },
  },
});

export const { setForgotPasswordOtp } = forgotPasswordSlice.actions;
export default forgotPasswordSlice.reducer;
