import axios from "axios";

const COUNTRIES_NOW_BASE_URL = "https://countriesnow.space/api/v0.1";

export interface RegistrationCountry {
  id: string;
  name: string;
}

interface CountriesNowState {
  name: string;
  state_code?: string;
}

interface CountriesNowStatesResponse {
  error: boolean;
  msg: string;
  data: {
    name: string;
    states: CountriesNowState[];
  };
}

export function normalizeStateName(name: string): string {
  return name.replace(/ State$/, "").trim();
}

export function toStateSelectOptions(states: CountriesNowState[]) {
  return states.map((state) => {
    const label = normalizeStateName(state.name);
    return { option: label, value: label };
  });
}

export async function fetchStatesByCountryName(countryName: string) {
  const { data } = await axios.post<CountriesNowStatesResponse>(
    `${COUNTRIES_NOW_BASE_URL}/countries/states`,
    { country: countryName },
    { timeout: 15000 }
  );

  if (data.error || !data.data?.states?.length) {
    return [];
  }

  return toStateSelectOptions(data.data.states);
}
