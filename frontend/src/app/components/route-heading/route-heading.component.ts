import { Component, Input, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { AppRoutes } from 'src/app/config/app-routes';

@Component({
  selector: 'route-heading',
  templateUrl: './route-heading.component.html',
  styleUrls: ['./route-heading.component.scss']
})
export class RouteHeadingComponent implements OnInit {

  public heading = "";

  constructor(private readonly _router: Router) {
    _router.events.pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.heading = this.constructNameFromUrl(event.url);
      });
  }

  private constructNameFromUrl(url: string): string {
    // Remove '/' in order to match with the actual route name
    const sanitizedUrl = url.replace('/', '');
    switch (sanitizedUrl) {
      case AppRoutes.HOME:
        return "Home";
      case AppRoutes.CREATE_DASHBOARD:
        return "Create your own Dashboard"
      case AppRoutes.DASHBOARD:
        return "Welcome to your Dashboard";
      case AppRoutes.DASHBOARD_OVERVIEW:
        return "Dashboard Overview";
      default:
        return "";
    }
  }

  public ngOnInit(): void {
  }

}
