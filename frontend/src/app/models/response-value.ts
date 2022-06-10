import { ICovidDeathsReponse } from "../interfaces/icovid-deaths-response";
import { ICovidHospitalityCapacityResponse } from "../interfaces/icovid-hospitality-capacity-response";

export type ResponseValue = ICovidDeathsReponse | ICovidHospitalityCapacityResponse | null;
