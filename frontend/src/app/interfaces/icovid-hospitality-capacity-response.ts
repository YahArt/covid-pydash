import { Region } from "../enums/region.enum";
import { ICovidCapacity } from "./icovid-capacity";

export interface ICovidHospitalityCapacityResponse {
    covidHospitalCapacity: {
        data: Array<{ region: Region; capacities: Array<ICovidCapacity> }>;
    }
}