import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
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

  public dashboards: Array<{ identifier: string, title: string }> = [];

  public readonly displayedColumns: string[] = ['title', 'identifier', 'actions'];


  constructor(private readonly dashboardService: DashboardService, private readonly router: Router, private readonly routeHeadingService: RouteHeadingService) { }

  public ngOnInit(): void {
    this.dashboardService.getDashboards$().pipe(takeUntil(this.destroy)).subscribe(response => {
      this.dashboards = response.dashboards;
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
    // TODO: Implement deleting a dashboard
  }

}
