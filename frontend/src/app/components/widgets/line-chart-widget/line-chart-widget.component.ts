import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { IDashboardData } from 'src/app/interfaces/idashboard-data';
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

  // options
  public legend: boolean = true;
  public showLabels: boolean = true;
  public animations: boolean = true;
  public xAxis: boolean = true;
  public yAxis: boolean = true;
  public showYAxisLabel: boolean = true;
  public showXAxisLabel: boolean = true;
  public xAxisLabel: string = 'Year';
  public yAxisLabel: string = 'Deaths';
  public timeline: boolean = false;

  public colorScheme = 'cool';

  constructor(private readonly changeDetectorRef: ChangeDetectorRef) {
    super();
  }

  public onWidgetResize(widgetSize: IWidgetSize): void {
    this.view = [widgetSize.width, widgetSize.height];
    this.changeDetectorRef.markForCheck();
  }

  public onDataChanged(data: IDashboardData | undefined): void {
    this.multi = [data?.value]
    this.changeDetectorRef.markForCheck();
  }

}
