import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { DashboardWidgetType } from 'src/app/models/dashboard-widget-type.enum';
import { LineChartWidgetComponent } from '../widgets/line-chart-widget/line-chart-widget.component';

@Component({
  selector: 'dashboard-widget',
  templateUrl: './dashboard-widget.component.html',
  styleUrls: ['./dashboard-widget.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardWidgetComponent implements OnInit, AfterViewInit {
  @ViewChild("itemTemplate", { read: ViewContainerRef })
  public itemTemplate!: ViewContainerRef;

  @Input()
  public widgetType: DashboardWidgetType = DashboardWidgetType.Text;

  constructor(private readonly _changeDetectorRef: ChangeDetectorRef) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    switch (this.widgetType) {
      case DashboardWidgetType.LineChart: {
        this.itemTemplate.createComponent(LineChartWidgetComponent);
        break;
      }
      default:
      // Do nothign

    }
    this._changeDetectorRef.detectChanges();
  }

}
