import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { IDashboardData } from 'src/app/interfaces/idashboard-data';
import { ILineChartConfig } from 'src/app/interfaces/iline-chart-config';
import { ILineChartSeries } from 'src/app/interfaces/iline-chart-series';
import { IWidgetSize } from 'src/app/interfaces/iwidget-size';
import { WidgetBase } from '../widget-base';

@Component({
  selector: 'line-chart-widget',
  templateUrl: './line-chart-widget.component.html',
  styleUrls: ['./line-chart-widget.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LineChartWidgetComponent extends WidgetBase {
  public multi: any[] = [];
  public view: [number, number] = [350, 350];
  public config!: ILineChartConfig;

  constructor(private readonly changeDetectorRef: ChangeDetectorRef) {
    super();
  }

  public onWidgetResize(widgetSize: IWidgetSize): void {
    this.view = [widgetSize.width, widgetSize.height];
    this.changeDetectorRef.markForCheck();
  }

  public setConfig(config: ILineChartConfig): void {
    this.config = config;
  }

  public onDataChanged(data: IDashboardData | undefined): void {
    const seriesData = data?.value as ILineChartSeries
    this.multi = seriesData.series;
    this.changeDetectorRef.markForCheck();
  }

}
