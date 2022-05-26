import { Component, OnInit } from '@angular/core';
import { GridsterItem } from 'angular-gridster2';
import { GridsterConfig } from 'src/app/config/gridster-config';
import { DashboardWidgetType } from 'src/app/models/dashboard-widget-type.enum';
import { DashboardService } from 'src/app/services/dashboard.service';
@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.sass']
})
export class DashboardComponent implements OnInit {

  public options!: GridsterConfig;
  public dashboard!: Array<GridsterItem>;

  constructor(private readonly dashboardService: DashboardService) { }

  ngOnInit(): void {
    this.options = {
      ...GridsterConfig.DEFAULT,
      itemResizeCallback: (item: any, itemComponent: any) => this.dashboardService.notifyWidgetSizeChanged(itemComponent.identifier, itemComponent.width, itemComponent.height)
    }

    this.dashboard = [
      {
        cols: 2,
        rows: 2,
        y: 3,
        x: 5,
        minItemRows: 2,
        minItemCols: 2,
        dashboardWidgetType: DashboardWidgetType.LineChart,
        identifier: 'line-chart'
      },
      {
        cols: 2,
        rows: 2,
        y: 2,
        x: 0,
        minItemRows: 2,
        minItemCols: 2,
        dashboardWidgetType: DashboardWidgetType.Text,
        identifier: 'text'
      },
    ];
  }

  private itemChange(item: any, itemComponent: any) {
    console.info('itemChanged', item, itemComponent);
  }

  private itemResize(item: any, itemComponent: any) {
    console.info('itemResized', item, itemComponent);
  }

}
