import { Component } from '@angular/core';
import { AppRoutes } from './config/app-routes';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  public readonly TOOLBAR_ELEMENTS = [
    {
      title: 'Create a Dashboard',
      route: AppRoutes.DASHBOARD
    },
    {
      title: 'Dashboard Overview',
      route: AppRoutes.DASHBOARD_OVERVIEW
    }
  ]

  public constructor() { }

}
