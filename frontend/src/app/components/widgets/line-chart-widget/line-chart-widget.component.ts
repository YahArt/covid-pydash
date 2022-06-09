import { ChangeDetectionStrategy, Component } from '@angular/core';
import { IDashboardData } from 'src/app/interfaces/idashboard-data';
import { ILineChartSeries } from 'src/app/interfaces/iline-chart-series';
import { WidgetBase } from '../widget-base';
import * as Highcharts from 'highcharts';
import { Subject } from 'rxjs';
import { IChartConfig } from 'src/app/interfaces/ichart-config';

@Component({
  selector: 'line-chart-widget',
  templateUrl: './line-chart-widget.component.html',
  styleUrls: ['./line-chart-widget.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LineChartWidgetComponent extends WidgetBase {
  private optionsSubject = new Subject<Highcharts.Options>();
  private defaultOptions: Highcharts.Options = {
    chart: {
      zoomType: 'x'
    },
    xAxis: {
      type: 'datetime',
      title: {
        text: ''
      }
    },
    yAxis: {
      title: {
        text: ''
      }
    },
    title: {
      text: ''
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
        title: {
          text: config.yAxisTitle
        }
      },
      xAxis: {
        type: 'datetime',
        title: {
          text: config.xAxisTitle
        }
      },
    };
  }

  public onDataChanged(data: IDashboardData | undefined): void {
    const seriesData = data?.value as ILineChartSeries
    const highChartSeries: Array<Highcharts.SeriesOptionsType> = seriesData.series.map(s => {
      return {
        type: 'line',
        name: s.name,
        data: s.series.map(s => {
          return [
            s.ticks,
            s.value
          ]
        })
      }
    });

    const newOptions: Highcharts.Options = {
      ...this.defaultOptions,
      series: [...highChartSeries]
    };
    this.optionsSubject.next(newOptions);
  }

}
