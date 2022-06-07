import { IDashboardData } from "src/app/interfaces/idashboard-data";
import { ILineChartConfig } from "src/app/interfaces/iline-chart-config";
import { IWidgetSize } from "src/app/interfaces/iwidget-size";

export abstract class WidgetBase {
    public abstract onWidgetResize(widgetSize: IWidgetSize): void; // Called when the widget is resized...
    public abstract onDataChanged(data: IDashboardData | undefined): void; // Called when the widget is resized...
    // TODO: Define further configs for additional widget types.
    public abstract setConfig(config: ILineChartConfig): void;
}