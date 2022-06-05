import { IDashboardData } from "src/app/models/idashboard-data";
import { IWidgetSize } from "src/app/models/iwidget-size";

export abstract class WidgetBase {
    public abstract onWidgetResize(widgetSize: IWidgetSize): void; // Called when the widget is resized...
    public abstract onDataChanged(data: IDashboardData | undefined): void; // Called when the widget is resized...
}