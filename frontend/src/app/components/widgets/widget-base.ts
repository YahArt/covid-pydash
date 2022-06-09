import { IChartConfig } from "src/app/interfaces/ichart-config";
import { IDashboardData } from "src/app/interfaces/idashboard-data";

export abstract class WidgetBase {
    public abstract onWidgetResize(): void; // Called when the widget is resized...
    public abstract onDataChanged(data: IDashboardData | undefined): void; // Called when the widget is resized...
    // TODO: Define further configs for additional widget types.
    public abstract setConfig(config: IChartConfig | null): void;
}