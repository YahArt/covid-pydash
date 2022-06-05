import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CovidInformationType } from '../models/covid-information-type.enum';
import { DashboardWidgetType } from '../models/dashboard-widget-type.enum';
import { ICovidDeathsReponse } from '../models/icovid-deaths-response';
import { IDashboardData } from '../models/idashboard-data';
import { IDashboardResponse } from '../models/idashboard-response';
import { IDashboardWidgetItem } from '../models/idashboard-widget-item';
import { ILineChartSeries } from '../models/iline-chart-series';
import { IWidgetSize } from '../models/iwidget-size';
import { TimeRange } from '../models/time-range';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

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
                    name: new Date(d.datum).toLocaleDateString().toString(),
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

  public loadData$(timeRange: TimeRange, dashboard: Array<IDashboardWidgetItem>): Observable<IDashboardData[]> {
    const informationAbout = dashboard.map(d => d.informationAbout);
    // TODO: Convert dashboard response to appropriate data types
    return this.httpClient.post<IDashboardResponse>(`${environment.restApi}/dashboard_data`, {
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
            value
          }
        })
      });
      return dasbhoardData;
    }));
  }
}
