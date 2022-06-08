import { CovidInformationType } from "../enums/covid-information-type.enum";
import { ICovidDeathsReponse } from "./icovid-deaths-response";

export interface IDashboardDataResponse {
    // TODO: Add further response types when adding new widgets...
    dashboardData: Array<{ informationAbout: CovidInformationType, value: ICovidDeathsReponse, error: string, noData: boolean }>;
}