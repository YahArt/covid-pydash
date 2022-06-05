import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { IDashboardData } from 'src/app/models/idashboard-data';
import { IWidgetSize } from 'src/app/models/iwidget-size';
import { multi } from 'src/app/models/line-chart-data';
import { WidgetBase } from '../widget-base';

@Component({
  selector: 'line-chart-widget',
  templateUrl: './line-chart-widget.component.html',
  styleUrls: ['./line-chart-widget.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LineChartWidgetComponent extends WidgetBase {
  public multi: any[] = [];
  public view: [number, number] = [350, 200];

  // options
  public legend: boolean = true;
  public showLabels: boolean = true;
  public animations: boolean = true;
  public xAxis: boolean = true;
  public yAxis: boolean = true;
  public showYAxisLabel: boolean = true;
  public showXAxisLabel: boolean = true;
  public xAxisLabel: string = 'Year';
  public yAxisLabel: string = 'Population';
  public timeline: boolean = true;

  public colorScheme = 'cool';

  constructor(private readonly changeDetectorRef: ChangeDetectorRef) {
    super();
    Object.assign(this, { multi });
  }

  public onWidgetResize(widgetSize: IWidgetSize): void {
    this.view = [widgetSize.width, widgetSize.height * 0.8];
    this.changeDetectorRef.markForCheck();
  }

  public onDataChanged(data: IDashboardData | undefined): void {
    this.multi = [data?.value]
    this.changeDetectorRef.markForCheck();
  }

}
