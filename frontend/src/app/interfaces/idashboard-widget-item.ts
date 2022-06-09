import { GridsterItem } from "angular-gridster2";
import { CovidInformationSubType } from "../enums/covid-information-sub-type.enum";
import { CovidInformationType } from "../enums/covid-information-type.enum";
import { DashboardWidgetType } from "../enums/dashboard-widget-type.enum";

export interface IDashboardWidgetItem extends GridsterItem {
    identifier: string,
    type: DashboardWidgetType,
    informationType: CovidInformationType,
    informationSubType: CovidInformationSubType
}