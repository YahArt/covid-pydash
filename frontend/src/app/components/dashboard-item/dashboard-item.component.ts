import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ComponentFactoryResolver, Input, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { DashboardItemType } from 'src/app/helpers/dashboard-item-type.enum';
import { LineChartComponent } from '../line-chart/line-chart.component';

@Component({
  selector: 'dashboard-item',
  templateUrl: './dashboard-item.component.html',
  styleUrls: ['./dashboard-item.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardItemComponent implements OnInit, AfterViewInit {
  @ViewChild("itemTemplate", { read: ViewContainerRef })
  public itemTemplate!: ViewContainerRef;

  @Input()
  public itemType: DashboardItemType = DashboardItemType.Text;

  constructor(private readonly _changeDetectorRef: ChangeDetectorRef) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    switch (this.itemType) {
      case DashboardItemType.LineChart: {
          this.itemTemplate.createComponent(LineChartComponent);
          break;
        }
      default:
        // Do nothign

    }
    this._changeDetectorRef.detectChanges();
    
  }

}
