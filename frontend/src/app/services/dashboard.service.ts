import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Guid } from 'guid-typescript';
import { Observable, map, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { GridConfig } from '../config/grid-config';
import { CovidInformationType } from '../models/covid-information-type.enum';
import { DashboardWidgetType } from '../models/dashboard-widget-type.enum';
import { ICovidDeathsReponse } from '../models/icovid-deaths-response';
import { ICreateDashboardResponse } from '../models/icreate-dashboard-response';
import { IDashboard } from '../models/idashboard';
import { IDashboardData } from '../models/idashboard-data';
import { IDashboardDataResponse } from '../models/idashboard-data-response';
import { IDashboardWidgetItem } from '../models/idashboard-widget-item';
import { IGetDashboardResponse } from '../models/iget-dashboard-response';
import { IGetDashboardsResponse } from '../models/iget-dashboards-response';
import { ILineChartSeries } from '../models/iline-chart-series';
import { IWidgetSize } from '../models/iwidget-size';
import { TimeRange } from '../models/time-range';

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
        title: 'Accumulated Covid Deaths over time',
        subtitle: 'Severity of Pandemic'
      },
    ]
  }

  private widgetSizeChangedSubject = new Subject<IWidgetSize>();
  private editModeChangedSubject = new Subject<boolean>();
  private dashboardDataSubject = new Subject<Array<IDashboardData>>();
  private loadingSubject = new Subject<boolean>();

  constructor(private readonly httpClient: HttpClient) { }

  // TODO: Add other supported visualization types...
  private convertBackendResponseValue(value: ICovidDeathsReponse, informationType: CovidInformationType, widgetType: DashboardWidgetType): ILineChartSeries | null {
    switch (informationType) {
      case CovidInformationType.CovidDeaths:
        {
          const covidDeathValue = value as ICovidDeathsReponse;
          switch (widgetType) {
            case DashboardWidgetType.LineChart: {
              const convertedValue: ILineChartSeries = {
                name: covidDeathValue.geoRegion,
                series: covidDeathValue.data.map(d => {
                  return {
                    name: new Date(d.datum),
                    value: d.sumTotal
                  }
                })
              };
              return convertedValue;
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

  public notifyLoading(loading: boolean) {
    this.loadingSubject.next(loading);

  }

  public notifyDashboardDataChanged(data: Array<IDashboardData>) {
    this.dashboardDataSubject.next(data);
  }

  public notifyWidgetSizeChanged(identifier: string, width: number, height: number) {
    this.widgetSizeChangedSubject.next({ identifier, width, height });
  }

  public get widgetSizeChanged$(): Observable<IWidgetSize> {
    return this.widgetSizeChangedSubject.asObservable();
  }

  public get editModeChanged$(): Observable<boolean> {
    return this.editModeChangedSubject.asObservable();
  }

  public get loading$(): Observable<boolean> {
    return this.loadingSubject.asObservable();
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

  public getDashboard$(identifier: string, title: string): Observable<IGetDashboardResponse> {
    return this.httpClient.get<IGetDashboardResponse>(`${environment.restApi}/dashboard/${identifier}/${title}`);
  }

  public loadData$(timeRange: TimeRange, dashboard: Array<IDashboardWidgetItem>): Observable<IDashboardData[]> {
    const informationAbout = dashboard.map(d => d.informationAbout);
    // TODO: Convert dashboard response to appropriate data types
    return this.httpClient.post<IDashboardDataResponse>(`${environment.restApi}/dashboard_data`, {
      startDate: timeRange.startDateString,
      endDate: timeRange.endDateString,
      informationAbout
    }).pipe(map(dashboardResponse => {
      let dasbhoardData: Array<IDashboardData> = [];
      // The response contains all the values PER INFORMATION TYPE in order to save network bandwith
      // Otherwise we would send the same data multiplied by each widget (e.g having two data trends widget for information type covid deaths etc.)
      dashboardResponse.values.forEach(v => {
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
