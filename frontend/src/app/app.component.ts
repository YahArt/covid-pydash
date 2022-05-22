import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter, switchScan } from 'rxjs';
import { AppRoutes } from './helpers/app-routes';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent {
  public title = 'frontend';
  public readonly sideBarElements = [
    {
      name: 'Create a Dashboard',
      route: AppRoutes.CREATE_DASHBOARD
    },
    {
      name: 'Your Dashboards',
      route: AppRoutes.DASHBOARD_OVERVIEW
    },    
  ]

  public currentRoute = AppRoutes.DASHBOARD_OVERVIEW;

  public constructor(private readonly _router: Router) {
    _router.events.pipe(filter(event => event instanceof NavigationEnd))
    .subscribe((event: any) => 
     {
       this.currentRoute = this.constructNameFromUrl(event.url);
     });
  }

  private constructNameFromUrl(url: string): string {
    // Remove '/' in order to match with the actual route name
    const sanitizedUrl = url.replace('/', '');
    switch(sanitizedUrl) {
      case AppRoutes.DASHBOARD_OVERVIEW:
        return "Dashboard Overview";
      case AppRoutes.CREATE_DASHBOARD:
        return "Create your Dashboard";
      default:
        return "";
    }
  }

}
