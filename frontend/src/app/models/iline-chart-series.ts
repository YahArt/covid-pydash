export interface ILineChartSeries {
    name: string; // Name of the series e.g "CH"
    series: Array<{ name: string; value: number }>; // The actual data of the series e.g 
}