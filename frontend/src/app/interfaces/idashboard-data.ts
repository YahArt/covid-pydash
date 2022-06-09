import { ResponseValueConverted } from "../models/response-value-converted";

export interface IDashboardData {
    // TODO: Add further data types...
    identifier: string;
    value: ResponseValueConverted;
    error: string;
    noData: boolean;
}