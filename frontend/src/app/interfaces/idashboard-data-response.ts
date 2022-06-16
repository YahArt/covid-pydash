import { CovidInformationType } from "../enums/covid-information-type.enum";
import { ICovidDeathsReponse } from "./icovid-deaths-response";

export interface IDashboardDataResponse {
    dashboardData: Array<{ informationType: CovidInformationType, value: ICovidDeathsReponse, error: string, noData: boolean }>;
}