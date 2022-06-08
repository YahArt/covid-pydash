import { ChangeDetectionStrategy, Component } from '@angular/core';
import { IDashboardData } from 'src/app/interfaces/idashboard-data';
import { ILineChartConfig } from 'src/app/interfaces/iline-chart-config';
import { ILineChartSeries } from 'src/app/interfaces/iline-chart-series';
import { IWidgetSize } from 'src/app/interfaces/iwidget-size';
import { WidgetBase } from '../widget-base';
import * as Highcharts from 'highcharts';

@Component({
  selector: 'line-chart-widget',
  templateUrl: './line-chart-widget.component.html',
  styleUrls: ['./line-chart-widget.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LineChartWidgetComponent extends WidgetBase {
  public readonly options: Highcharts.Options = {
    chart: {
      zoomType: 'x'
    },
    xAxis: {
      type: 'datetime'
    },
    title: {
      text: ''
    },
    plotOptions: {
      area: {
        marker: {
          radius: 2
        },
        lineWidth: 1,
        states: {
          hover: {
            lineWidth: 1
          }
        },
        threshold: null
      }
    },
    series: [],
  };

  private chartInstance: Highcharts.Chart | undefined;

  public config!: ILineChartConfig;


  public Highcharts: typeof Highcharts = Highcharts;

  constructor() {
    super();
  }

  public onWidgetResize(widgetSize: IWidgetSize): void {
    window.dispatchEvent(new Event('resize'));
  }

  public setConfig(config: ILineChartConfig): void {
    this.config = config;
  }

  public chartInstanceCallback(chart: Highcharts.Chart) {
    this.chartInstance = chart;
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
      ...this.options,
      series: [...highChartSeries]
    };
    this.chartInstance?.update(newOptions, true, true, false);
  }

}
