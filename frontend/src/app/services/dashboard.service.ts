import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Guid } from 'guid-typescript';
import { Observable, map, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { GridConfig } from '../config/grid-config';
import { CovidInformationType } from '../enums/covid-information-type.enum';
import { DashboardWidgetType } from '../enums/dashboard-widget-type.enum';
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

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private readonly DEFAULT_DASHBOARD: IDashboard = {
    title: '',
    identifier: '',
    widgets: [
      {
        ...GridConfig.getDefaultForWidgetType(DashboardWidgetType.LineChart),
        identifier: Guid.create().toString(),
        informationAbout: CovidInformationType.CovidDeaths,
        type: DashboardWidgetType.LineChart,
      },
    ]
  }

  private widgetSizeChangedSubject = new Subject<string>();
  private editModeChangedSubject = new Subject<boolean>();
  private dashboardDataSubject = new Subject<Array<IDashboardData>>();

  constructor(private readonly httpClient: HttpClient) { }

  // TODO: Add other supported visualization types...
  private convertBackendResponseValue(responseValue: ICovidDeathsReponse, informationType: CovidInformationType, widgetType: DashboardWidgetType): ILineChartSeries | null {
    switch (informationType) {
      case CovidInformationType.CovidDeaths:
        {
          const covidDeathsResponse = responseValue as ICovidDeathsReponse;
          switch (widgetType) {
            case DashboardWidgetType.LineChart: {
              const lineChartSeries: ILineChartSeries = {
                series: covidDeathsResponse.covidDeath.data.map(d => {
                  return {
                    name: d.region,
                    series: d.deaths.map(deaths => {
                      const seriesData: ILineChartData = {
                        ticks: deaths.date,
                        value: deaths.current

                      }
                      return seriesData;
                    })
                  }
                })
              };
              return lineChartSeries;
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
    const informationAbout = dashboard.map(d => d.informationAbout);
    // TODO: Convert dashboard response to appropriate data types
    return this.httpClient.post<IDashboardDataResponse>(`${environment.restApi}/dashboard_data`, {
      startDateEpochTicks: dashboardFilter.timeRange.start.getTime() / 1000,
      endDateEpochTicks: dashboardFilter.timeRange.end.getTime() / 1000,
      regions: dashboardFilter.regions,
      informationAbout
    }).pipe(map(dashboardResponse => {
      let dasbhoardData: Array<IDashboardData> = [];
      // The response contains all the values PER INFORMATION TYPE in order to save network bandwith
      // Otherwise we would send the same data multiplied by each widget (e.g having two data trends widget for information type covid deaths etc.)
      dashboardResponse.dashboardData.forEach(v => {
        const dashboardWidgetsWithSameInformationType = dashboard.filter(d => d.informationAbout === v.informationAbout);
        dasbhoardData = dashboardWidgetsWithSameInformationType.map(widgetWithSameInformationType => {
          const value = this.convertBackendResponseValue(v.value, widgetWithSameInformationType.informationAbout, widgetWithSameInformationType.type);
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
