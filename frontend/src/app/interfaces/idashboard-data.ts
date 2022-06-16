import { ResponseValueConverted } from "../models/response-value-converted";

export interface IDashboardData {
    identifier: string;
    value: ResponseValueConverted;
    error: string;
    noData: boolean;
}