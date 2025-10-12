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
  },
});

export const { updateVehicleInformation, setVehicleOnboardingCurrentStep } =
  vehicleSlice.actions;
export default vehicleSlice.reducer;
