import { GridsterItem } from "angular-gridster2";
import { DashboardWidgetType } from "./dashboard-widget-type.enum";

export interface IDashboardWidgetItem extends GridsterItem {
    identifier: string,
    type: DashboardWidgetType
}