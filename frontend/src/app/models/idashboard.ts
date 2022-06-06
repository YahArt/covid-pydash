import { IDashboardWidgetItem } from "./idashboard-widget-item";

export interface IDashboard {
    title: string;
    identifier: string;
    widgets: Array<IDashboardWidgetItem>
}