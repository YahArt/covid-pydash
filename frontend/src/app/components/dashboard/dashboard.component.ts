import { OnInit, Component, ViewChild, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSidenav } from '@angular/material/sidenav';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { GridsterConfig } from 'angular-gridster2';
import { Guid } from "guid-typescript";
import { filter, finalize, Subject, takeUntil } from 'rxjs';
import { GridConfig } from 'src/app/config/grid-config';
import { Region } from 'src/app/enums/region.enum';
import { ICreateWidgetDialogEntry } from 'src/app/interfaces/icreate-widget-dialog-entry';
import { IDashboard } from 'src/app/interfaces/idashboard';
import { IDashboardFilter } from 'src/app/interfaces/idashboard-filter';
import { TimeRange } from 'src/app/models/time-range';
import { DashboardService } from 'src/app/services/dashboard.service';
import { RouteHeadingService } from 'src/app/services/route-heading.service';
import { CreateWidgetDialogComponent } from '../dialogs/create-widget-dialog/create-widget-dialog.component';
@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, OnDestroy {

  private editModeEnabled = false;
  private selectedTimeRange = new TimeRange(new Date(2020, 1, 1), new Date(2022, 5, 25));
  private selectedRegions: Region[] = [Region.CH];

  private destroy = new Subject<void>();

  public options!: GridsterConfig;
  public dashboard!: IDashboard;

  public filters = new FormGroup(
    {
      startDate: new FormControl<Date>(this.selectedTimeRange.start, Validators.required),
      endDate: new FormControl<Date>(this.selectedTimeRange.end, Validators.required),
      regions: new FormControl<Array<Region>>(this.selectedRegions, [Validators.required, Validators.maxLength(4)])
    }
  );

  regionList: Region[] = Object.values(Region);

  public timeRanges: TimeRange[] = [
    this.selectedTimeRange
  ];

  public loading = false;

  @ViewChild('filterSidebar')
  public filterSidebar!: MatSidenav;

  constructor(private readonly dashboardService: DashboardService, private readonly dialog: MatDialog, private readonly snackbar: MatSnackBar, private route: ActivatedRoute, private readonly routeHeadingService: RouteHeadingService) { }

  private initGridster() {
    this.options = {
      ...GridConfig.DEFAULT,
      itemResizeCallback: (item: any, itemComponent: any) => this.dashboardService.notifyWidgetSizeChanged(item.identifier)
    }
  }

  private loadDashboardData(dashboardFilter: IDashboardFilter): void {
    // TODO: Currently we always load all data for all available widgets, single widget refresh is not implemented yet
    this.loading = true;
    this.dashboardService.loadData$(dashboardFilter, this.dashboard.widgets).pipe(finalize(() => this.loading = false), takeUntil(this.destroy)).subscribe(response => {
      const errors = response.filter(r => r.error !== null).map(r => r.error);
      if (errors && errors.length > 0) {
        const errorMessage = errors.join('\nError: ');
        this.snackbar.open(`Something went wrong while loading data: ${errorMessage}`, 'Close');
        return;
      }
      this.dashboardService.notifyDashboardDataChanged(response)
    });
  }

  private getCurrentFilter(): IDashboardFilter {
    return {
      timeRange: this.selectedTimeRange,
      regions: this.selectedRegions
    };
  }

  private loadDashboardByIdentifier(identifier: string) {
    this.loading = true;
    this.dashboardService.getDashboard$(identifier).pipe(finalize(() => this.loading = false), takeUntil(this.destroy)).subscribe(response => {
      if (response.error) {
        this.snackbar.open(`An error occurred: ${response.error}`, 'Close');
        return;
      }
      this.routeHeadingService.updateRouteHeadingTitle(`Welcome to your Dashboard: "${response.dashboard.title}"`);
      this.dashboard = response.dashboard;
      const filter = this.getCurrentFilter();
      this.loadDashboardData(filter);
    });
  }

  public addTimeRangeAndSetSelected($event: any) {
    $event.preventDefault();
    const timeRange = new TimeRange(this.filters.value.startDate as Date, this.filters.value.endDate as Date);
    // Time range already exists...
    if (this.timeRanges.findIndex(t => t.identifier === timeRange.identifier) >= 0) {
      return;
    }
    this.timeRanges.push(timeRange);
    this.selectedTimeRange = timeRange;
  }

  public toggleFilterSidebar() {
    this.filterSidebar.toggle();
  }

  public validTimeRange(): boolean {
    return this.filters.controls.startDate.valid && this.filters.controls.endDate.valid;
  }

  public removeTimeRange(timeRange: TimeRange) {
    const removeIndex = this.timeRanges.findIndex(t => t.identifier === timeRange.identifier);
    if (removeIndex < 0) {
      return;
    }
    this.timeRanges.splice(removeIndex, 1);
  }

  public setSelectedTimeRange(timeRange: TimeRange) {
    this.selectedTimeRange = timeRange;
  }

  public ngOnInit(): void {
    this.initGridster();

    this.route.queryParams.pipe(takeUntil(this.destroy), filter(params => params.identifier))
      .subscribe(params => {
        const dashboardIdentifier = params.identifier;
        this.loadDashboardByIdentifier(dashboardIdentifier);
      });
  }

  public ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
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

    dialogRef.afterClosed().pipe(takeUntil(this.destroy)).subscribe((selectedWidget: ICreateWidgetDialogEntry | null) => {
      if (selectedWidget) {
        this.dashboard.widgets.push(
          {
            ...GridConfig.getDefaultForWidgetType(selectedWidget.type),
            identifier: Guid.create().toString(),
            informationAbout: selectedWidget.informationAbout,
            type: selectedWidget.type,
          },
        )
        const filter = this.getCurrentFilter();
        this.loadDashboardData(filter);
      }
    });
  }

  public saveDashboard() {
    this.loading = true;
    this.dashboardService.createDashboard$(this.dashboard).pipe(finalize(() => this.loading = false), takeUntil(this.destroy)).subscribe(response => {
      if (response.error) {
        this.snackbar.open(`Failed to save dashboard: "${this.dashboard.title}", Error: ${response.error}`, 'Close');
        return;
      }
      this.snackbar.open(`Successfully saved dashboard: "${this.dashboard.title}"`, undefined, {
        duration: 1000
      });

    })
  }



  public onApplyFilters() {
    this.selectedRegions = this.filters.value.regions as Region[];
    const filter = this.getCurrentFilter();
    this.filterSidebar.toggle();
    this.loadDashboardData(filter);
  }
}
