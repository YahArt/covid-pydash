import { GridsterItem } from "angular-gridster2";
import { CovidInformationType } from "../enums/covid-information-type.enum";
import { DashboardWidgetType } from "../enums/dashboard-widget-type.enum";

export interface IDashboardWidgetItem extends GridsterItem {
    identifier: string,
    type: DashboardWidgetType,
    informationAbout: CovidInformationType,
    title: string,
    subtitle: string
}