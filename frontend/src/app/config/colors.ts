import { CovidInformationType } from "../enums/covid-information-type.enum";
import { DashboardWidgetType } from "../enums/dashboard-widget-type.enum";

export class Colors {

    // Highcharts default colors
    private static readonly DEFAULT_COLORS = [
        "#7cb5ec", "#434348", "#90ed7d", "#f7a35c", "#8085e9", "#f15c80", "#e4d354", "#2b908f", "#f45b5b", "#91e8e1"
    ]

    public static getColors(widgetType: DashboardWidgetType, informationType: CovidInformationType): string[] {
        switch (widgetType) {
            case DashboardWidgetType.LineChart: {
                if (informationType === CovidInformationType.CovidDeaths) {
                    // We only support up to 5 data series due to the validator so there is no need to specify any more colors...
                    return [
                        "#000000", "#484848", "#90a4ae", "#c1d5e0", "#62757f"]
                }
                break;
            }
        }
        return this.DEFAULT_COLORS;
    }
}