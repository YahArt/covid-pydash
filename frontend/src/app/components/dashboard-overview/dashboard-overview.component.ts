import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppRoutes } from 'src/app/config/app-routes';
import { DashboardService } from 'src/app/services/dashboard.service';

@Component({
  selector: 'app-dashboard-overview',
  templateUrl: './dashboard-overview.component.html',
  styleUrls: ['./dashboard-overview.component.scss']
})
export class DashboardOverviewComponent implements OnInit {

  public dashboards: Array<{ identifier: string, title: string }> = [];

  public readonly displayedColumns: string[] = ['title', 'identifier', 'actions'];


  constructor(private readonly dashboardService: DashboardService, private readonly router: Router) { }

  ngOnInit(): void {
    this.dashboardService.getDashboards$().subscribe(response => {
      this.dashboards = response.dashboards;
    });
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
