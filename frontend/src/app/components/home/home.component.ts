import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppRoutes } from 'src/app/config/app-routes';
import { RouteHeadingService } from 'src/app/services/route-heading.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private readonly routeHeadingService: RouteHeadingService, private readonly router: Router) { }

  public ngOnInit(): void {
    this.routeHeadingService.updateRouteHeadingTitle("Home");
  }

  public navigateToCreateDashboard($event: any) {
    $event.preventDefault();
    this.router.navigate([AppRoutes.CREATE_DASHBOARD]);
  }

  public navigateToDashboardOverview($event: any) {
    $event.preventDefault();
    this.router.navigate([AppRoutes.DASHBOARD_OVERVIEW]);
  }

  public navigateToFAQ($event: any) {
    $event.preventDefault();
    this.router.navigate([AppRoutes.FAQ]);
  }

  public navigateToAbout($event: any) {
    $event.preventDefault();
    this.router.navigate([AppRoutes.ABOUT]);
  }

}
