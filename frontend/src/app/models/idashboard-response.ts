import { CovidInformationType } from "./covid-information-type.enum";
import { ICovidDeathsReponse } from "./icovid-deaths-response";

export interface IDashboardResponse {
    // TODO: Add further response types when adding new widgets...
    values: Array<{ informationAbout: CovidInformationType, value: ICovidDeathsReponse, error: string, noData: boolean }>;
}