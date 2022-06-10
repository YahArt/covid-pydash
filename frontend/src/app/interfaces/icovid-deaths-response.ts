import { Region } from "../enums/region.enum";
import { ICovidDeath } from "./icovid-death";

export interface ICovidDeathsReponse {
    covidDeath: {
        data: Array<{ region: Region; deaths: Array<ICovidDeath> }>;
    }
}