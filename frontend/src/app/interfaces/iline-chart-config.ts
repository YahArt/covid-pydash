import { IChartConfig } from "./ichart-config";

export interface ILineChartConfig extends IChartConfig {
    legend: boolean;
    showLabels: boolean;
    animations: boolean;
    xAxis: boolean;
    yAxis: boolean;
    showYAxisLabel: boolean;
    showXAxisLabel: boolean;
    xAxisLabel: string;
    yAxisLabel: string;
    timeline: boolean;
    colorScheme: string;
}