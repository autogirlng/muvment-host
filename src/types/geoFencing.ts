import { BaseResponse } from "./general";

export interface GeoFenceAreaData {
      id: string,
      name: string,
      areaType: string,
      coordinates: {
          longitude: number,
          latitude: number
        }[]
      
    }

export interface GeoFenceAreaResponse extends BaseResponse {
  data: GeoFenceAreaData[],
}