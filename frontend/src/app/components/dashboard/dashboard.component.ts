import { OnInit, Component, ViewChild, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSidenav } from '@angular/material/sidenav';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { GridsterConfig } from 'angular-gridster2';
import { Guid } from "guid-typescript";
import { filter, finalize, Subject, takeUntil } from 'rxjs';
import { AppRoutes } from 'src/app/config/app-routes';
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
  private selectedTimeRange!: TimeRange;
  private selectedRegions: Region[] = [];

  private destroy = new Subject<void>();

  public options!: GridsterConfig;
  public dashboard!: IDashboard;
  public noDashboard = true; // Be pessimistic

  public filters = new FormGroup(
    {
      startDate: new FormControl<Date | null>(null, Validators.required),
      endDate: new FormControl<Date | null>(null, Validators.required),
      regions: new FormControl<Array<Region> | null>(null, [Validators.required, Validators.maxLength(4)])
    }
  );

  public regionList: Region[] = Object.values(Region);

  public savedTimeRanges: TimeRange[] = [
    this.selectedTimeRange
  ];

  public loading = false;

  @ViewChild('filterSidebar')
  public filterSidebar!: MatSidenav;

  constructor(private readonly dashboardService: DashboardService, private readonly dialog: MatDialog, private readonly snackbar: MatSnackBar, private route: ActivatedRoute, private readonly routeHeadingService: RouteHeadingService, private readonly router: Router) { }

  private initGridster() {
    this.options = {
      ...GridConfig.DEFAULT,
      itemResizeCallback: (item: any, itemComponent: any) => this.dashboardService.notifyWidgetSizeChanged(item.identifier)
    }
  }

  private loadDashboardData(dashboardFilter: IDashboardFilter): void {
    // No need to load any data if we do not have any widgets on the dashboard
    if (this.dashboard.widgets.length === 0) {
      return;
    }
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
      if (response.error === "DASHBOARD_NOT_FOUND") {
        this.snackbar.open(`The dashboard you are currently on was deleted and does not exist anymore`, 'Close');
        this.routeHeadingService.updateRouteHeadingTitle(`Not found :(`);
        return;
      }
      if (response.error) {
        this.snackbar.open(`An error occurred: ${response.error}`, 'Close');
        return;
      }
      this.routeHeadingService.updateRouteHeadingTitle(`Welcome to your Dashboard: "${response.dashboard.title}"`);
      this.dashboard = response.dashboard;

      const start = new Date(this.dashboard.selectedTimeRange.start * 1000)
      const end = new Date(this.dashboard.selectedTimeRange.end * 1000)
      this.noDashboard = false;

      // Restore selected filters
      this.selectedTimeRange = new TimeRange(start, end);
      this.selectedRegions = [...this.dashboard.selectedRegions] as Region[]
      this.savedTimeRanges = [...this.dashboard.savedTimeRanges.map(range => {
        const start = new Date(range.start * 1000);
        const end = new Date(range.end * 1000);
        return new TimeRange(start, end);
      })]

      // Update filter sidebar
      this.filters.patchValue({
        startDate: this.selectedTimeRange.start,
        endDate: this.selectedTimeRange.end,
        regions: this.selectedRegions
      });

      // Trigger data loading with current filters
      const filter = this.getCurrentFilter();

      this.loadDashboardData(filter);
    });
  }

  public addTimeRangeAndSetSelected($event: any) {
    $event.preventDefault();
    const timeRange = new TimeRange(this.filters.value.startDate as Date, this.filters.value.endDate as Date);
    // Time range already exists...
    if (this.savedTimeRanges.findIndex(t => t.identifier === timeRange.identifier) >= 0) {
      return;
    }
    this.savedTimeRanges.push(timeRange);
    this.selectedTimeRange = timeRange;
  }

  public toggleFilterSidebar() {
    this.filterSidebar.toggle();
  }

  public validTimeRange(): boolean {
    return this.filters.controls.startDate.valid && this.filters.controls.endDate.valid;
  }

  public removeTimeRange(timeRange: TimeRange) {
    const removeIndex = this.savedTimeRanges.findIndex(t => t.identifier === timeRange.identifier);
    if (removeIndex < 0) {
      return;
    }
    this.savedTimeRanges.splice(removeIndex, 1);
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
    return this.savedTimeRanges.length > 1;
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
            informationType: selectedWidget.informationType,
            informationSubType: selectedWidget.informationSubType,
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
    this.dashboard.selectedRegions = [...this.selectedRegions];
    this.dashboard.savedTimeRanges = this.savedTimeRanges.map(timeRange => {
      return {
        start: timeRange.start.getTime() / 1000,
        end: timeRange.end.getTime() / 1000
      }
    });
    this.dashboard.selectedTimeRange = {
      start: this.selectedTimeRange.start.getTime() / 1000,
      end: this.selectedTimeRange.end.getTime() / 1000
    };

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

  public navigateToCreateDashboard($event: any): void {
    $event.preventDefault();
    this.router.navigate([AppRoutes.CREATE_DASHBOARD]);
  }
}
