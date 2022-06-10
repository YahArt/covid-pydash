import { IDashboardData } from 'src/app/interfaces/idashboard-data';
import { ILineChartSeries } from 'src/app/interfaces/iline-chart-series';
import { WidgetBase } from '../widget-base';
import * as Highcharts from 'highcharts';
import { Subject } from 'rxjs';
import { IChartConfig } from 'src/app/interfaces/ichart-config';
import { Component } from '@angular/core';
import { IBarChartSeries } from 'src/app/interfaces/ibar-chart-series';

@Component({
  selector: 'bar-chart-widget',
  templateUrl: './bar-chart-widget.component.html',
  styleUrls: ['./bar-chart-widget.component.scss']
})
export class BarChartWidgetComponent extends WidgetBase {

  private optionsSubject = new Subject<Highcharts.Options>();
  private defaultOptions: Highcharts.Options = {
    chart: {
      type: 'column'
    },
    xAxis: {
      categories: [],
      title: {
        text: ''
      },
      crosshair: true
    },
    yAxis: {
      min: 0,
      title: {
        text: ''
      }
    },
    title: {
      text: ''
    },
    plotOptions: {
      column: {
        pointPadding: 0.2,
        borderWidth: 0
      }
    },
    series: [],
    colors: []
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
      colors: [...config.colors],
      yAxis: {
        ...this.defaultOptions.yAxis,
        title: {
          text: config.yAxisTitle
        }
      },
      xAxis: {
        ...this.defaultOptions.xAxis,
        categories: [config.xAxisTitle],
      },
    };
  }

  public onDataChanged(data: IDashboardData | undefined): void {
    const barChartSeries = data?.value as IBarChartSeries;
    const highChartSerie: Array<Highcharts.SeriesColumnOptions> = barChartSeries.series.map(s => {
      return {
        name: s.name,
        data: s.data,
        type: 'column'
      };
    })

    const newOptions: Highcharts.Options = {
      ...this.defaultOptions,
      xAxis: {
        ...this.defaultOptions.xAxis,
        categories: [...barChartSeries.categories]
      },
      series: [...highChartSerie],
    };
    this.optionsSubject.next(newOptions);
  }
}
