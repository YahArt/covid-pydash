import { OnInit, Component } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Guid } from "guid-typescript";
import { GridsterConfig } from 'src/app/config/gridster-config';
import { DashboardWidgetType } from 'src/app/models/dashboard-widget-type.enum';
import { IDashboardWidgetItem } from 'src/app/models/idashboard-widget-item';
import { DashboardService } from 'src/app/services/dashboard.service';
import { CreateWidgetDialogComponent } from '../dialogs/create-widget-dialog/create-widget-dialog.component';
@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.sass'],
})
export class DashboardComponent implements OnInit {

  public options!: GridsterConfig;
  public dashboard!: Array<IDashboardWidgetItem>;

  constructor(private readonly dashboardService: DashboardService, private readonly dialog: MatDialog) { }

  public ngOnInit(): void {
    this.options = {
      ...GridsterConfig.DEFAULT,
      itemResizeCallback: (item: any, itemComponent: any) => this.dashboardService.notifyWidgetSizeChanged(item.identifier, itemComponent.width, itemComponent.height)
    }

    this.dashboard = [
      {
        cols: 2,
        rows: 2,
        y: 3,
        x: 5,
        minItemRows: 2,
        minItemCols: 2,
        type: DashboardWidgetType.LineChart,
        identifier: Guid.create().toString()
      },
      {
        cols: 2,
        rows: 2,
        y: 2,
        x: 0,
        minItemRows: 2,
        minItemCols: 2,
        type: DashboardWidgetType.LineChart,
        identifier: Guid.create().toString()
      },
    ];
  }

  public deleteWidget(identifier: string) {
    const deleteIndex = this.dashboard.findIndex(d => d.identifier === identifier);
    if (deleteIndex < 0) {
      return;
    }

    // Hacky solution to get rid of the backdrop preview, see: https://github.com/tiberiuzuld/angular-gridster2/issues/516
    setTimeout(() => {
      this.dashboard.splice(deleteIndex, 1);
    }, 0);
  }

  public addWidget() {
    const dialogRef = this.dialog.open(CreateWidgetDialogComponent, {
      width: '40vw',
      height: '40vh',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe((selectedWidgetTypes: DashboardWidgetType[]) => {
      if (selectedWidgetTypes) {
        selectedWidgetTypes.forEach(widgetType => {
          this.dashboard.push(
            {
              cols: 2,
              rows: 2,
              y: 3,
              x: 5,
              minItemRows: 2,
              minItemCols: 2,
              type: widgetType,
              identifier: Guid.create().toString()
            },
          )
        });
      }
    });

  }
}
