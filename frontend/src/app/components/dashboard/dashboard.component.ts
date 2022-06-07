import { OnInit, Component, ViewChild } from '@angular/core';
import { FormControl, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSidenav } from '@angular/material/sidenav';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { GridsterConfig } from 'angular-gridster2';
import { Guid } from "guid-typescript";
import { filter, finalize } from 'rxjs';
import { GridConfig } from 'src/app/config/grid-config';
import { ICreateWidgetDialogEntry } from 'src/app/interfaces/icreate-widget-dialog-entry';
import { IDashboard } from 'src/app/interfaces/idashboard';
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
  private selectedTimeRange = new TimeRange(new Date(2020, 1, 1), new Date(2022, 5, 25))

  public options!: GridsterConfig;
  public dashboard!: IDashboard;

  public filters = new UntypedFormGroup(
    {
      startDate: new FormControl<Date>(new Date(), Validators.required),
      endDate: new FormControl<Date>(new Date(), Validators.required),
    }
  );

  public timeRanges: TimeRange[] = [
    this.selectedTimeRange
  ];

  @ViewChild('filterSidebar')
  public filterSidebar!: MatSidenav;

  constructor(private readonly dashboardService: DashboardService, private readonly dialog: MatDialog, private readonly snackbar: MatSnackBar, private route: ActivatedRoute) { }

  private initGridster() {
    this.options = {
      ...GridConfig.DEFAULT,
      itemResizeCallback: (item: any, itemComponent: any) => this.dashboardService.notifyWidgetSizeChanged(item.identifier, itemComponent.width, itemComponent.height)
    }
  }

  private addTimeRange(timeRange: TimeRange) {
    // Time range already exists...
    if (this.timeRanges.findIndex(t => t.identifier === timeRange.identifier) >= 0) {
      return;
    }
    this.timeRanges.push(timeRange);
    this.selectedTimeRange = timeRange;
    this.loadDashboardData(this.selectedTimeRange);
  }

  private loadDashboardData(timeRange: TimeRange): void {
    // TODO: Currently we always load all data for all available widgets, single widget refresh is not implemented yet
    this.dashboardService.notifyLoading(true);
    this.dashboardService.loadData$(timeRange, this.dashboard.widgets).pipe(finalize(() => this.dashboardService.notifyLoading(false))).subscribe(response => {
      this.dashboardService.notifyDashboardDataChanged(response)
    });
  }

  private loadDashboardByIdentifier(identifier: string) {
    this.dashboardService.getDashboard$(identifier).subscribe(response => {
      this.dashboard = response.dashboard;
      this.loadDashboardData(this.selectedTimeRange);
    })

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
    this.selectedTimeRange = timeRange;
    this.loadDashboardData(this.selectedTimeRange);
  }


  public ngOnInit(): void {
    this.initGridster();

    this.route.queryParams.pipe(filter(params => params.identifier))
      .subscribe(params => {
        const dashboardIdentifier = params.identifier;
        this.loadDashboardByIdentifier(dashboardIdentifier);
      });
  }

  public isSelectedTimeRange(timeRange: TimeRange): boolean {
    return this.selectedTimeRange.identifier === timeRange.identifier;
  }

  public canRemoveTimeRange(): boolean {
    return this.timeRanges.length > 1;
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
    const deleteIndex = this.dashboard.widgets.findIndex(d => d.identifier === identifier);
    if (deleteIndex < 0) {
      return;
    }

    // Hacky solution to get rid of the backdrop preview, see: https://github.com/tiberiuzuld/angular-gridster2/issues/516
    setTimeout(() => {
      this.dashboard.widgets.splice(deleteIndex, 1);
    }, 0);
  }

  public addWidget() {
    const dialogRef = this.dialog.open(CreateWidgetDialogComponent, {
      disableClose: true,
      width: '60vw'
    });

    dialogRef.afterClosed().subscribe((selectedWidget: ICreateWidgetDialogEntry | null) => {
      if (selectedWidget) {
        this.dashboard.widgets.push(
          {
            ...GridConfig.getDefaultForWidgetType(selectedWidget.type),
            identifier: Guid.create().toString(),
            informationAbout: selectedWidget.informationAbout,
            type: selectedWidget.type,
            title: selectedWidget.description,
            subtitle: selectedWidget.informationCategory
          },
        )
        this.loadDashboardData(this.selectedTimeRange);
      }
    });
  }

  public onApplyFilters() {
    const newTimeRange = new TimeRange(this.filters.value.startDate, this.filters.value.endDate);
    this.addTimeRange(newTimeRange);
    this.filterSidebar.toggle();
  }
}
