import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { OtpStateForgotPassword } from "@/types";

const initialState: OtpStateForgotPassword = {
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
