export interface ILineChartSeries {
    name: string; // Name of the series e.g "CH"
    series: Array<{ name: Date; value: number }>; // The actual data of the series e.g 
}