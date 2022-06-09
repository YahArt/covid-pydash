import { CovidInformationType } from "../enums/covid-information-type.enum";
import { DashboardWidgetType } from "../enums/dashboard-widget-type.enum";
import { IChartConfig } from "../interfaces/ichart-config";
import { Colors } from "./colors";

export class ChartConfig {

    // TODO: Add further config types for other widgets...
    public static getConfig(widgetType: DashboardWidgetType, informationType: CovidInformationType): IChartConfig | null {
        const colors = Colors.getColors(widgetType, informationType);
        switch (widgetType) {
            case DashboardWidgetType.LineChart: {
                if (informationType === CovidInformationType.CovidDeaths) {
                    const config: IChartConfig = {
                        title: 'Covid Deaths over time',
                        subtitle: 'Severity of Pandemic',
                        yAxisTitle: 'Deaths Accumulated',
                        xAxisTitle: 'Date',
                        colors
                    };
                    return config;
                }
                break;
            }
        }
        return null;
    }
}