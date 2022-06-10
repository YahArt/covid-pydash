import { IDashboard } from "./idashboard";

export interface IGetDashboardTemplateResponse {
    dashboard: IDashboard;
    error: string | null;
}