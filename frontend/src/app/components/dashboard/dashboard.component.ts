import { OnInit, Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DATEPICKER_VALIDATORS } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { MatSidenav } from '@angular/material/sidenav';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GridsterConfig } from 'angular-gridster2';
import { Guid } from "guid-typescript";
import { GridConfig } from 'src/app/config/grid-config';
import { DashboardWidgetType } from 'src/app/models/dashboard-widget-type.enum';
import { IDashboardWidgetItem } from 'src/app/models/idashboard-widget-item';
import { TimeRange } from 'src/app/models/time-range';
import { DashboardService } from 'src/app/services/dashboard.service';
import { CreateWidgetDialogComponent } from '../dialogs/create-widget-dialog/create-widget-dialog.component';
@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {

  private editModeEnabled = false;

  public options!: GridsterConfig;
  public dashboard!: Array<IDashboardWidgetItem>;

  public filters = new FormGroup(
    {
      startDate: new FormControl(null, Validators.required),
      endDate: new FormControl(null, Validators.required),
    }
  );

  public timeRanges: TimeRange[] = [
    new TimeRange(new Date(), new Date())
  ];

  @ViewChild('filterSidebar')
  public filterSidebar!: MatSidenav;

  constructor(private readonly dashboardService: DashboardService, private readonly dialog: MatDialog, private readonly snackbar: MatSnackBar) { }


  private initFilters() {
    this.filters.patchValue({
      startDate: new Date(),
      endDate: new Date()
    });
  }

  private addTimeRange(timeRange: TimeRange) {
    // Time range already exists...
    if (this.timeRanges.findIndex(t => t.identifier === timeRange.identifier) >= 0) {
      return;
    }
    this.timeRanges.push(timeRange);
  }

  public toggleFilterSidebar() {
    this.filterSidebar.toggle();
  }

  public removeTimeRange(timeRange: TimeRange) {
    const removeIndex = this.timeRanges.findIndex(t => t.identifier === timeRange.identifier);
    if (removeIndex < 0) {
      return;
    }
    this.timeRanges.splice(removeIndex, 1);
  }

  public onApplyTimeRange(timeRange: TimeRange) {
    // TODO Perhaps propagate down to widgets for showing specific overlays...
    console.log('Applying time range: ', timeRange);
  }


  public ngOnInit(): void {
    this.options = {
      ...GridConfig.DEFAULT,
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
    this.initFilters();
  }


  public toggleEditMode() {
    this.editModeEnabled = !this.editModeEnabled;

    // Notify all widgets that edit mode has changed...
    this.dashboardService.notifyEditModeChanged(this.editModeEnabled);

    // Update options for grid
    this.options = {
      ...this.options,
      draggable: {
        enabled: this.editModeEnabled
      },
      resizable: {
        enabled: this.editModeEnabled
      }
    };

    if (this.options.api?.optionsChanged) {
      this.options.api.optionsChanged();
    }

    // Show toast / snackbar message
    const message = this.editModeEnabled ? 'Edit mode activated' : 'Edit mode deactivated';
    this.snackbar.open(message, undefined, {
      duration: 1000
    });

  }

  public getEditModeColor(): string {
    if (this.editModeEnabled) {
      return 'primary';
    }
    return 'accent';
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
      disableClose: true
    });

    dialogRef.afterClosed().subscribe((selectedWidgetTypes: DashboardWidgetType[]) => {
      if (selectedWidgetTypes) {
        selectedWidgetTypes.forEach(widgetType => {
          this.dashboard.push(
            {
              cols: 2,
              rows: 2,
              y: 0,
              x: 0,
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

  public onApplyFilters() {
    const newTimeRange = new TimeRange(this.filters.value.startDate, this.filters.value.endDate);
    this.addTimeRange(newTimeRange);
    this.filterSidebar.toggle();
  }
}
