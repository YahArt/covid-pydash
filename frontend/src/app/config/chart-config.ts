import { CovidInformationSubType } from "../enums/covid-information-sub-type.enum";
import { CovidInformationType } from "../enums/covid-information-type.enum";
import { DashboardWidgetType } from "../enums/dashboard-widget-type.enum";
import { IChartConfig } from "../interfaces/ichart-config";
import { IDashboardWidgetItem } from "../interfaces/idashboard-widget-item";
import { Colors } from "./colors";

export class ChartConfig {

    // TODO: Add further config types for other widgets...
    public static getConfig(widget: IDashboardWidgetItem): IChartConfig | null {
        const colors = Colors.getColors(widget);
        switch (widget.type) {
            case DashboardWidgetType.LineChart: {
                if (widget.informationType === CovidInformationType.CovidDeaths) {
                    let title = 'Covid Deaths over time';
                    let yAxisTitle = 'Deaths Accumulated';
                    let xAxisTitle = 'Date';
                    if (widget.informationSubType === CovidInformationSubType.DailyDeaths) {
                        title = 'Covid Daily Deaths over time';
                        yAxisTitle = "Daily Deaths";
                    }
                    else if (widget.informationSubType === CovidInformationSubType.SumTotalDeaths) {
                        title = 'Sum of Covid Deaths over time';
                        yAxisTitle = "Total Ammount of Deaths";
                    }
                    const config: IChartConfig = {
                        title: title,
                        subtitle: 'Severity of Pandemic',
                        yAxisTitle: yAxisTitle,
                        xAxisTitle: xAxisTitle,
                        colors
                    };
                    return config;
                }
                break;
            }
            case DashboardWidgetType.BarChart: {
                if (widget.informationType === CovidInformationType.CovidDeaths) {
                    let title = 'Covid Deaths over time';
                    let yAxisTitle = 'Deaths Accumulated';
                    let xAxisTitle = 'Region';
                    if (widget.informationSubType === CovidInformationSubType.SumTotalDeaths) {
                        title = 'Sum of Covid Deaths Total';
                        yAxisTitle = "Total Ammount of Deaths";
                    }
                    const config: IChartConfig = {
                        title: title,
                        subtitle: 'Severity of Pandemic',
                        yAxisTitle: yAxisTitle,
                        xAxisTitle: xAxisTitle,
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