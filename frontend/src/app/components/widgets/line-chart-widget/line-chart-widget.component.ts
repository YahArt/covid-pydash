import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { multi } from 'src/app/models/line-chart-data';
import { DashboardService } from 'src/app/services/dashboard.service';
import { DashboardWidgetComponent } from '../../dashboard-widget/dashboard-widget.component';

@Component({
  selector: 'line-chart-widget',
  templateUrl: './line-chart-widget.component.html',
  styleUrls: ['./line-chart-widget.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LineChartWidgetComponent implements OnInit {

  public multi: any[] = [];
  public view: [number, number] = [700, 400];

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

  constructor(private readonly dashboardService: DashboardService, private readonly changeDetectorRef: ChangeDetectorRef) {
    Object.assign(this, { multi });
  }

  public ngOnInit(): void {
    this.dashboardService.widgetSizeChanged$.pipe().subscribe(widgetSizeChangedEvent => {
      console.log('line-chart got widget size changed event', widgetSizeChangedEvent);
      this.view = [widgetSizeChangedEvent.width, widgetSizeChangedEvent.height];
      this.changeDetectorRef.markForCheck();
    });
  }

  public onSelect(data: any): void {
    console.log('Item clicked', JSON.parse(JSON.stringify(data)));
  }

  public onActivate(data: any): void {
    console.log('Activate', JSON.parse(JSON.stringify(data)));
  }

  public onDeactivate(data: any): void {
    console.log('Deactivate', JSON.parse(JSON.stringify(data)));
  }

}
