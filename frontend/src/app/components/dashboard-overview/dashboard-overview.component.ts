import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { finalize, Subject, takeUntil } from 'rxjs';
import { AppRoutes } from 'src/app/config/app-routes';
import { DashboardService } from 'src/app/services/dashboard.service';
import { RouteHeadingService } from 'src/app/services/route-heading.service';

@Component({
  selector: 'app-dashboard-overview',
  templateUrl: './dashboard-overview.component.html',
  styleUrls: ['./dashboard-overview.component.scss']
})
export class DashboardOverviewComponent implements OnInit, OnDestroy {

  private destroy = new Subject<void>();
  private numberOfDashboards = 0;

  public loading = false;

  public hasDashboards = true;

  public dashboards: Array<{ identifier: string, title: string }> = [];

  public readonly displayedColumns: string[] = ['title', 'identifier', 'actions'];


  constructor(private readonly dashboardService: DashboardService, private readonly router: Router, private readonly routeHeadingService: RouteHeadingService, private readonly snackbar: MatSnackBar) { }

  public ngOnInit(): void {
    this.loading = true;
    this.dashboardService.getDashboards$().pipe(finalize(() => this.loading = false), takeUntil(this.destroy)).subscribe(response => {
      this.dashboards = response.dashboards;
      this.numberOfDashboards = response.dashboards?.length || 0;
      this.hasDashboards = this.numberOfDashboards > 0;
    });
    this.routeHeadingService.updateRouteHeadingTitle("Dashboard Overview");
  }

  public ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
  }

  public openDashboard(dashboard: { identifier: string, title: string }) {
    this.router.navigate([AppRoutes.DASHBOARD], {
      queryParams: { identifier: dashboard.identifier }
    });
  }

  public deleteDashboard(dashboard: { identifier: string, title: string }) {
    this.loading = true;
    this.dashboardService.deleteDashboard$(dashboard.identifier).pipe(finalize(() => this.loading = false), takeUntil(this.destroy)).subscribe(response => {
      if (!response.error) {
        this.numberOfDashboards -= 1;
        this.hasDashboards = this.numberOfDashboards > 0;
        const deleteIndex = this.dashboards.findIndex(d => d.identifier === dashboard.identifier);
        this.dashboards.splice(deleteIndex, 1);
      }
      const message = response.error ? `Failed to deleted dashboard "${response.dashboard.title}", Error: ${response.error}` : `Dashboard: "${response.dashboard.title}" was successfully deleted`
      this.snackbar.open(message, undefined, {
        duration: 1000
      });

    });
  }

  public navigateToCreateDashboard($event: any): void {
    $event.preventDefault();
    this.router.navigate([AppRoutes.CREATE_DASHBOARD]);
  }

}
