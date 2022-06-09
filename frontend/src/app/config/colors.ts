import { CovidInformationType } from "../enums/covid-information-type.enum";
import { DashboardWidgetType } from "../enums/dashboard-widget-type.enum";

export class Colors {

    // Highcharts default colors
    private static readonly DEFAULT_COLORS = [
        "#7cb5ec", "#434348", "#90ed7d", "#f7a35c", "#8085e9", "#f15c80", "#e4d354", "#2b908f", "#f45b5b", "#91e8e1"
    ]

    public static getColors(widgetType: DashboardWidgetType, informationType: CovidInformationType): string[] {
        // Colors are handpicked with: https://color.adobe.com/create/color-wheel
        switch (widgetType) {
            case DashboardWidgetType.LineChart: {
                if (informationType === CovidInformationType.CovidDeaths) {
                    // We only support up to 4 data series due to the validator so there is no need to specify any more colors...
                    return [
                        "#000000", "#E3E164", "E34D4D", "36A0E3", "2C6D96"]
                }
                break;
            }
        }
        return this.DEFAULT_COLORS;
    }
}