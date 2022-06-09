export interface IGetDashboardsResponse {
    dashboards: Array<{ identifier: string, title: string }>;
    error: string | null;
}