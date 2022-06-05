import { ILineChartSeries } from "./iline-chart-series";

export interface IDashboardData {
    // TODO: Add further data types...
    identifier: string;
    value: ILineChartSeries | null;
    error: string
}