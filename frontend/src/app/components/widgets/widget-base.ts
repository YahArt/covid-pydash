import { IDashboardData } from "src/app/interfaces/idashboard-data";
import { IWidgetSize } from "src/app/interfaces/iwidget-size";

export abstract class WidgetBase {
    public abstract onWidgetResize(widgetSize: IWidgetSize): void; // Called when the widget is resized...
    public abstract onDataChanged(data: IDashboardData | undefined): void; // Called when the widget is resized...
}