import { IDashboardFilter } from "./idashboard-filter";
import { IDashboardWidgetItem } from "./idashboard-widget-item";

export interface IDashboard {
    title: string;
    identifier: string;
    widgets: Array<IDashboardWidgetItem>;
    selectedRegions: string[];
    selectedTimeRange: {
        start: number; // UNIX EPOCH TICKS
        end: number; // UNIX EPOCH TICKS
    };
    savedTimeRanges: Array<{ start: number; end: number; }>;
}