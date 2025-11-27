import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { WithdrawalAccountValues, OtpStateAccountSetup } from "@/types";



const initialState: OtpStateAccountSetup = {
  phoneNumberToVerify: "",
  withdrawalAccountSetupOtp: "",
  accountDetails: { accountNumber: "", bankCode: "", accountName: "" },
};

const accountSetupSlice = createSlice({
  name: "accountSetup",
  initialState,
  reducers: {
    setPhoneNumberToVerify: (state, action: PayloadAction<string>) => {
      state.phoneNumberToVerify = action.payload;
    },
    setWithdrawalAccountSetupOtp: (state, action: PayloadAction<string>) => {
      state.withdrawalAccountSetupOtp = action.payload;
    },
    setAccountDetails: (
      state,
      action: PayloadAction<WithdrawalAccountValues>
    ) => {
      state.accountDetails = action.payload;
    },
  },
});

export const {
  setPhoneNumberToVerify,
  setAccountDetails,
  setWithdrawalAccountSetupOtp,
} = accountSetupSlice.actions;
export default accountSetupSlice.reducer;
