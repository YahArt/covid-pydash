import { ICovidDeath } from "./icovid-death";

export interface ICovidDeathsReponse {
    covidDeath: {
        data: Array<{ region: string; deaths: Array<ICovidDeath> }>;
    }
}