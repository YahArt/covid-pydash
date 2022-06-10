import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Guid } from 'guid-typescript';
import { Observable, map, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { GridConfig } from '../config/grid-config';
import { CovidInformationSubType } from '../enums/covid-information-sub-type.enum';
import { CovidInformationType } from '../enums/covid-information-type.enum';
import { DashboardWidgetType } from '../enums/dashboard-widget-type.enum';
import { Region } from '../enums/region.enum';
import { IBarChartSeries } from '../interfaces/ibar-chart-series';
import { ICovidDeathsReponse } from '../interfaces/icovid-deaths-response';
import { ICreateDashboardResponse } from '../interfaces/icreate-dashboard-response';
import { IDashboard } from '../interfaces/idashboard';
import { IDashboardData } from '../interfaces/idashboard-data';
import { IDashboardDataResponse } from '../interfaces/idashboard-data-response';
import { IDashboardFilter } from '../interfaces/idashboard-filter';
import { IDashboardWidgetItem } from '../interfaces/idashboard-widget-item';
import { IDeleteDashboardResponse } from '../interfaces/idelete-dashboard-response';
import { IGetDashboardResponse } from '../interfaces/iget-dashboard-response';
import { IGetDashboardsResponse } from '../interfaces/iget-dashboards-response';
import { ILineChartData } from '../interfaces/iline-chart-data';
import { ILineChartSeries } from '../interfaces/iline-chart-series';
import { ResponseValueConverted } from '../models/response-value-converted';
import { TimeRange } from '../models/time-range';


@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private readonly DEFAULT_REGION = Region.CH;
  private readonly DEFAULT_TIME_RANGE = new TimeRange(new Date(2020, 1, 1), new Date(2022, 5, 25));


  private readonly DEFAULT_DASHBOARD: IDashboard = {
    title: '',
    identifier: '',
    widgets: [],
    selectedTimeRange: {
      start: this.DEFAULT_TIME_RANGE.start.getTime() / 1000,
      end: this.DEFAULT_TIME_RANGE.end.getTime() / 1000
    },
    selectedRegions: [
      this.DEFAULT_REGION
    ],
    savedTimeRanges: [
      {
        start: this.DEFAULT_TIME_RANGE.start.getTime() / 1000,
        end: this.DEFAULT_TIME_RANGE.end.getTime() / 1000
      }
    ]
  }

  private widgetSizeChangedSubject = new Subject<string>();
  private editModeChangedSubject = new Subject<boolean>();
  private dashboardDataSubject = new Subject<Array<IDashboardData>>();

  constructor(private readonly httpClient: HttpClient) { }

  private convertCovidDeathsToLineChartSeries(informationSubType: CovidInformationSubType, covidDeaths: ICovidDeathsReponse): ILineChartSeries {
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

  private convertCovidDeathsToBarChartSeries(informationSubType: CovidInformationSubType, covidDeaths: ICovidDeathsReponse): IBarChartSeries {
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

  // TODO: Add other supported visualization types...
  private convertBackendResponseValue(responseValue: ICovidDeathsReponse, informationType: CovidInformationType, informationSubType: CovidInformationSubType, widgetType: DashboardWidgetType): ResponseValueConverted {
    switch (informationType) {
      case CovidInformationType.CovidDeaths:
        {
          const covidDeathsResponse = responseValue as ICovidDeathsReponse;
          switch (widgetType) {
            case DashboardWidgetType.LineChart: {
              const lineChartSeries = this.convertCovidDeathsToLineChartSeries(informationSubType, covidDeathsResponse);
              return lineChartSeries;
            }
            case DashboardWidgetType.BarChart: {
              const barChartSeries = this.convertCovidDeathsToBarChartSeries(informationSubType, covidDeathsResponse);
              return barChartSeries;
            }
            default:
              // Not supported yet...
              break;
          }
        }
    }
    return null;
  }

  public notifyEditModeChanged(enabled: boolean) {
    this.editModeChangedSubject.next(enabled);
  }

  public notifyDashboardDataChanged(data: Array<IDashboardData>) {
    this.dashboardDataSubject.next(data);
  }

  public notifyWidgetSizeChanged(identifier: string) {
    this.widgetSizeChangedSubject.next(identifier);
  }

  public get widgetSizeChanged$(): Observable<string> {
    return this.widgetSizeChangedSubject.asObservable();
  }

  public get editModeChanged$(): Observable<boolean> {
    return this.editModeChangedSubject.asObservable();
  }

  public get dashboardDataChanged$(): Observable<Array<IDashboardData>> {
    return this.dashboardDataSubject.asObservable();
  }

  public createDashboardFromTemplate(template: string | null): IDashboard {
    if (template) {
      // TODO: Add handling for creating dashboard via template
    }
    return this.DEFAULT_DASHBOARD;
  }

  public createDashboard$(dashboard: IDashboard): Observable<ICreateDashboardResponse> {
    return this.httpClient.post<ICreateDashboardResponse>(`${environment.restApi}/dashboard`, {
      dashboard
    });
  }

  public getDashboards$(): Observable<IGetDashboardsResponse> {
    return this.httpClient.get<IGetDashboardsResponse>(`${environment.restApi}/dashboards`);
  }

  public getDashboard$(identifier: string): Observable<IGetDashboardResponse> {
    return this.httpClient.get<IGetDashboardResponse>(`${environment.restApi}/dashboard/${identifier}`);
  }

  public deleteDashboard$(identifier: string): Observable<IDeleteDashboardResponse> {
    return this.httpClient.delete<IDeleteDashboardResponse>(`${environment.restApi}/dashboard/${identifier}`);
  }

  public loadData$(dashboardFilter: IDashboardFilter, dashboard: Array<IDashboardWidgetItem>): Observable<IDashboardData[]> {
    const informationType = dashboard.map(d => d.informationType);
    return this.httpClient.post<IDashboardDataResponse>(`${environment.restApi}/dashboard_data`, {
      startDateEpochTicks: dashboardFilter.timeRange.start.getTime() / 1000,
      endDateEpochTicks: dashboardFilter.timeRange.end.getTime() / 1000,
      regions: dashboardFilter.regions,
      informationType
    }).pipe(map(dashboardResponse => {
      let dasbhoardData: Array<IDashboardData> = [];
      // The response contains all the values PER INFORMATION TYPE in order to save network bandwith
      // Otherwise we would send the same data multiplied by each widget (e.g having two data trends widget for information type covid deaths etc.)
      dashboardResponse.dashboardData.forEach(v => {
        const dashboardWidgetsWithSameInformationType = dashboard.filter(d => d.informationType === v.informationType);
        dasbhoardData = dashboardWidgetsWithSameInformationType.map(widgetWithSameInformationType => {

          const value = v.noData === true ? null : this.convertBackendResponseValue(v.value, widgetWithSameInformationType.informationType, widgetWithSameInformationType.informationSubType, widgetWithSameInformationType.type);
          return {
            identifier: widgetWithSameInformationType.identifier,
            error: v.error,
            value,
            noData: v.noData
          }
        })
      });
      return dasbhoardData;
    }));
  }
}
