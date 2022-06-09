import { CovidInformationSubType } from "../enums/covid-information-sub-type.enum";
import { CovidInformationType } from "../enums/covid-information-type.enum";
import { DashboardWidgetType } from "../enums/dashboard-widget-type.enum";

export interface ICreateWidgetDialogEntry {
    type: DashboardWidgetType;
    typeDesc: string; // Line Chart
    informationType: CovidInformationType;
    informationTypeDesc: string; // CovidDeaths
    informationSubType: CovidInformationSubType;
    informationSubTypeDesc: string; // Daily Deaths
    informationCategory: string; // Severity of Pandemic
}