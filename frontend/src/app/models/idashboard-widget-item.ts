import { GridsterItem } from "angular-gridster2";
import { CovidInformationType } from "./covid-information-type.enum";
import { DashboardWidgetType } from "./dashboard-widget-type.enum";

export interface IDashboardWidgetItem extends GridsterItem {
    identifier: string,
    type: DashboardWidgetType,
    informationAbout: CovidInformationType,
    title: string,
    subtitle: string
}