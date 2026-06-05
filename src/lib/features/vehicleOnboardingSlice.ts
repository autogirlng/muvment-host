import { VehicleInformation } from "@/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { VehicleState } from "./types";


const initialState: VehicleState = {
  vehicle: null,
  currentStep: 0,
};

const vehicleSlice = createSlice({
  name: "vehicle",
  initialState,
  reducers: {
    updateVehicleInformation: (
      state,
      action: PayloadAction<VehicleInformation>
    ) => {
      state.vehicle = action.payload;
    },
    setVehicleOnboardingCurrentStep: (state, action: PayloadAction<number>) => {
      state.currentStep = action.payload;
    },
    clearVehicleOnboarding: (state) => {
      state.vehicle = null;
      state.currentStep = 0;
    },
  },
});

export const {
  updateVehicleInformation,
  setVehicleOnboardingCurrentStep,
  clearVehicleOnboarding,
} = vehicleSlice.actions;
export default vehicleSlice.reducer;
