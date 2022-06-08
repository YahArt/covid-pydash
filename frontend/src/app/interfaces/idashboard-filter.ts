import { TimeRange } from "../models/time-range";

export interface IDashboardFilter {
    timeRange: TimeRange;
    regions: string[];
}
