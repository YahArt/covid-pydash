import { CovidInformationSubType } from "../enums/covid-information-sub-type.enum";
import { CovidInformationType } from "../enums/covid-information-type.enum";
import { DashboardWidgetType } from "../enums/dashboard-widget-type.enum";
import { IBarChartSeries } from "../interfaces/ibar-chart-series";
import { ICovidDeathsReponse } from "../interfaces/icovid-deaths-response";
import { ICovidHospitalityCapacityResponse } from "../interfaces/icovid-hospitality-capacity-response";
import { ILineChartData } from "../interfaces/iline-chart-data";
import { ILineChartSeries } from "../interfaces/iline-chart-series";
import { IMapData } from "../interfaces/imap-data";
import { IMapSeries } from "../interfaces/imap-series";
import { ResponseValue } from "../models/response-value";
import { ResponseValueConverted } from "../models/response-value-converted";
import { EnumConverter } from "./enum-converter";

export class ValuesConverter {

    private static convertCovidDeathsToLineChartSeries(informationSubType: CovidInformationSubType, covidDeaths: ICovidDeathsReponse): ILineChartSeries {
        const lineChartSeries: ILineChartSeries = {
            series: covidDeaths.covidDeath.data.map(d => {
                return {
                    name: d.region,
                    series: d.deaths.map(deaths => {
                        let value = 0;
                        // Depending on the subtype we choose different values
                        if (informationSubType === CovidInformationSubType.DailyDeaths) {
                            value = deaths.current;
                        }
                        else if (informationSubType === CovidInformationSubType.SumTotalDeaths) {
                            value = deaths.sumTotal;
                        }
                        const seriesData: ILineChartData = {
                            ticks: deaths.date,
                            value
                        }
                        return seriesData;
                    })
                }
            })
        };
        return lineChartSeries;
    }

    private static convertCovidDeathsToBarChartSeries(informationSubType: CovidInformationSubType, covidDeaths: ICovidDeathsReponse): IBarChartSeries {
        const barChartSeries: IBarChartSeries = {
            categories: ['Region'],
            series: covidDeaths.covidDeath.data.map(d => {
                let value = 0;
                // Depending on the subtype we choose different values
                if (informationSubType === CovidInformationSubType.SumTotalDeaths) {
                    value = d.deaths[d.deaths.length - 1].sumTotal;
                }

                return {
                    name: d.region,
                    data: [value]
                }
            })
        }
        return barChartSeries;
    }

    private static convertCovidHospitalityCapacityToMapSeries(informationSubType: CovidInformationSubType, capacity: ICovidHospitalityCapacityResponse): IMapSeries {
        let name = 'NOT DEFINED';
        if (informationSubType == CovidInformationSubType.AmmountOfCapacityUsed) {
            name = 'Amount of capacity used'
        }
        const mapSeries: IMapSeries = {
            series: [
                {
                    name,
                    data: capacity.covidHospitalCapacity.data.map(d => {
                        const data: IMapData = {
                            region: EnumConverter.convertRegionToMapRegion(d.region),
                            value: d.capacities[d.capacities.length - 1].totalUsedCapacity
                        }
                        return data;
                    })
                }
            ]
        }
        return mapSeries;
    }

    private static convertCovidHospitalityCapacityToBarChartSeries(informationSubType: CovidInformationSubType, capacity: ICovidHospitalityCapacityResponse): IBarChartSeries {
        let name = 'NOT DEFINED';
        if (informationSubType == CovidInformationSubType.AmmountOfCapacityUsed) {
            name = 'Amount of capacity used'
        }
        const barChartSeries: IBarChartSeries = {
            categories: ['Region'],
            series: capacity.covidHospitalCapacity.data.map(d => {
                let value = 0;
                // Depending on the subtype we choose different values
                if (informationSubType === CovidInformationSubType.AmmountOfCapacityUsed) {
                    value = d.capacities[d.capacities.length - 1].totalUsedCapacity;
                }

                return {
                    name: d.region,
                    data: [value]
                }
            })
        }
        return barChartSeries;
    }

    public static convertBackendResponseValue(responseValue: ResponseValue, informationType: CovidInformationType, informationSubType: CovidInformationSubType, widgetType: DashboardWidgetType): ResponseValueConverted {
        switch (informationType) {
            case CovidInformationType.CovidDeaths: {
                const covidDeathsResponse = responseValue as ICovidDeathsReponse;
                switch (widgetType) {
                    case DashboardWidgetType.LineChart: {
                        const lineChartSeries = ValuesConverter.convertCovidDeathsToLineChartSeries(informationSubType, covidDeathsResponse);
                        return lineChartSeries;
                    }
                    case DashboardWidgetType.BarChart: {
                        const barChartSeries = ValuesConverter.convertCovidDeathsToBarChartSeries(informationSubType, covidDeathsResponse);
                        return barChartSeries;
                    }
                    default:
                        // Not supported yet...
                        break;
                }
                break;
            }
            case CovidInformationType.CovidHospitalCapacity: {
                const covidHospitalityResponse = responseValue as ICovidHospitalityCapacityResponse;
                switch (widgetType) {
                    case DashboardWidgetType.Map: {
                        const mapSeries = ValuesConverter.convertCovidHospitalityCapacityToMapSeries(informationSubType, covidHospitalityResponse);
                        return mapSeries;
                    }
                    case DashboardWidgetType.BarChart: {
                        const barChartSeries = ValuesConverter.convertCovidHospitalityCapacityToBarChartSeries(informationSubType, covidHospitalityResponse);
                        return barChartSeries;
                    }
                    default:
                        // Not supported yet...
                        break;
                }
                break;

            }
        }
        return null;
    }

}