import { IBarChartSeries } from "../interfaces/ibar-chart-series";
import { ILineChartSeries } from "../interfaces/iline-chart-series";
import { IMapSeries } from "../interfaces/imap-series";

export type ResponseValueConverted = ILineChartSeries | IBarChartSeries | IMapSeries | null;
