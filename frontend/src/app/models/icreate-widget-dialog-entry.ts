import { CovidInformationType } from "./covid-information-type.enum";
import { DashboardWidgetType } from "./dashboard-widget-type.enum";

export interface ICreateWidgetDialogEntry {
    type: DashboardWidgetType;
    typeDesc: string;
    informationAbout: CovidInformationType;
    informationAboutDesc: string;
    informationCategory: string;
    description: string;
}