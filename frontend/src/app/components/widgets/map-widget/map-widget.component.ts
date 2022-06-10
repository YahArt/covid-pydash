import { Component } from '@angular/core';
import { Subject } from 'rxjs';
import { IChartConfig } from 'src/app/interfaces/ichart-config';
import { IDashboardData } from 'src/app/interfaces/idashboard-data';
import chMap from "@highcharts/map-collection/countries/ch/ch-all.geo.json";
import { WidgetBase } from '../widget-base';
import * as Highcharts from 'highcharts';
import HC_map from 'highcharts/modules/map';
import { IMapSeries } from 'src/app/interfaces/imap-series';
HC_map(Highcharts);

@Component({
  selector: 'map-widget',
  templateUrl: './map-widget.component.html',
  styleUrls: ['./map-widget.component.scss']
})
export class MapWidgetComponent extends WidgetBase {

  private optionsSubject = new Subject<Highcharts.Options>();
  private defaultOptions: Highcharts.Options = {
    chart: {
      map: chMap,
    },
    legend: {
      enabled: true,
    },
    title: {
      text: ''
    },
    colorAxis: {
      min: 0,
    },
    series: [],
  };

  public options$ = this.optionsSubject.asObservable();

  public oneToOne = true;

  public Highcharts: typeof Highcharts = Highcharts;

  constructor() {
    super();
  }

  public onWidgetResize(): void {
    window.dispatchEvent(new Event('resize'));
  }

  public setConfig(config: IChartConfig): void {
    this.defaultOptions = {
      ...this.defaultOptions,
      colorAxis: {
        ...this.defaultOptions.colorAxis,
        minColor: config.colors[0],
        maxColor: config.colors[1]
      }
    };
  }

  public onDataChanged(data: IDashboardData | undefined): void {
    const mapSeries = data?.value as IMapSeries;
    const highChartMapSeries: Array<Highcharts.SeriesMapOptions> = mapSeries.series.map(s => {
      const mapData = s.data.map(d => {
        return [
          d.region,
          d.value
        ]
      })

      const data: any = [...mapData];
      const mapOptions: Highcharts.SeriesMapOptions = {
        name: s.name,
        type: 'map',
        dataLabels: {
          enabled: true,
          format: '{point.name}'
        },
        allAreas: true,
        data
      };
      return mapOptions;
    });

    const newOptions: Highcharts.Options = {
      ...this.defaultOptions,
      series: [...highChartMapSeries]
    };
    this.optionsSubject.next(newOptions);
  }
}