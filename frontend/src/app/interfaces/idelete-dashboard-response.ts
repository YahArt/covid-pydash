import { IDashboard } from "./idashboard";

export interface IDeleteDashboardResponse {
    dashboard: IDashboard;
    error: string | null;
    numberOfDashboards: number;
}