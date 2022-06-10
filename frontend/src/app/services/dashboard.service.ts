import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, Subject, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ValuesConverter } from '../converters/values.converter';
import { CovidTemplates } from '../enums/covid-templates-enum';
import { Region } from '../enums/region.enum';
import { ICreateDashboardResponse } from '../interfaces/icreate-dashboard-response';
import { IDashboard } from '../interfaces/idashboard';
import { IDashboardData } from '../interfaces/idashboard-data';
import { IDashboardDataResponse } from '../interfaces/idashboard-data-response';
import { IDashboardFilter } from '../interfaces/idashboard-filter';
import { IDashboardWidgetItem } from '../interfaces/idashboard-widget-item';
import { IDeleteDashboardResponse } from '../interfaces/idelete-dashboard-response';
import { IGetDashboardResponse } from '../interfaces/iget-dashboard-response';
import { IGetDashboardTemplateResponse } from '../interfaces/iget-dashboard-template-response';
import { IGetDashboardsResponse } from '../interfaces/iget-dashboards-response';
import { TimeRange } from '../models/time-range';


@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private readonly DEFAULT_REGIONS = [Region.ZH, Region.SG, Region.TG];
  private readonly DEFAULT_TIME_RANGE = new TimeRange(new Date(2020, 1, 1), new Date(2022, 5, 25));


  private readonly DEFAULT_DASHBOARD: IDashboard = {
    title: '',
    identifier: '',
    widgets: [],
    selectedTimeRange: {
      start: this.DEFAULT_TIME_RANGE.start.getTime() / 1000,
      end: this.DEFAULT_TIME_RANGE.end.getTime() / 1000
    },
    selectedRegions: this.DEFAULT_REGIONS,
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

  // TODO: Add other supported visualization types...


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

  public getDashboardFromTemplate$(template: CovidTemplates): Observable<IGetDashboardTemplateResponse> {
    if (template === CovidTemplates.None) {
      const noTemplateDashboard: IGetDashboardTemplateResponse = {
        dashboard: this.DEFAULT_DASHBOARD,
        error: null
      }
      return of(noTemplateDashboard);
    }
    return this.httpClient.get<IGetDashboardTemplateResponse>(`${environment.restApi}/dashboard/templates/${template}`)
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
        const dataForWidgetsWithSameInformationType = dashboardWidgetsWithSameInformationType.map(widgetWithSameInformationType => {

          const value = v.noData === true ? null : ValuesConverter.convertBackendResponseValue(v.value, widgetWithSameInformationType.informationType, widgetWithSameInformationType.informationSubType, widgetWithSameInformationType.type);
          return {
            identifier: widgetWithSameInformationType.identifier,
            error: v.error,
            value,
            noData: v.noData
          }
        })
        dasbhoardData.push(...dataForWidgetsWithSameInformationType);
      });
      return dasbhoardData;
    }));
  }
}
