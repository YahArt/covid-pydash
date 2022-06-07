import { CovidInformationType } from "../enums/covid-information-type.enum";
import { DashboardWidgetType } from "../enums/dashboard-widget-type.enum";
import { ILineChartConfig } from "../interfaces/iline-chart-config";

export class ChartConfig {

    private static readonly BASE_LINE_CHART_CONFIG: ILineChartConfig = {
        title: '',
        subtitle: '',
        legend: true,
        showLabels: true,
        animations: true,
        xAxis: true,
        yAxis: true,
        showXAxisLabel: true,
        showYAxisLabel: true,
        xAxisLabel: '',
        yAxisLabel: '',
        timeline: false,
        colorScheme: 'cool'
    }

    // TODO: Add further config types for other widgets...
    public static getConfig(widgetType: DashboardWidgetType, informationType: CovidInformationType): ILineChartConfig | null {
        switch (widgetType) {
            case DashboardWidgetType.LineChart: {
                if (informationType === CovidInformationType.CovidDeaths) {
                    const config: ILineChartConfig = {
                        ...ChartConfig.BASE_LINE_CHART_CONFIG,
                        title: 'Covid Deaths over time',
                        subtitle: 'Severity of Pandemic',
                        yAxisLabel: 'Deaths Accumulated',
                        xAxisLabel: 'Date'

                    };
                    return config;
                }
                break;
            }
        }
        return null;
    }
}