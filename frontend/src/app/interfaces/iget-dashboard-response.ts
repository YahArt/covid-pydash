import { IDashboard } from "./idashboard";

export interface IGetDashboardResponse {
    dashboard: IDashboard;
    error: string | null;
    numberOfDashboards: number;
}