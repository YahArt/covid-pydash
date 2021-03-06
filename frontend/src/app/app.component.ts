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
      title: 'Home',
      route: AppRoutes.HOME
    },
    {
      title: 'Create a Dashboard',
      route: AppRoutes.CREATE_DASHBOARD
    },
    {
      title: 'Dashboard Overview',
      route: AppRoutes.DASHBOARD_OVERVIEW
    },
    {
      title: 'FAQ',
      route: AppRoutes.FAQ
    },
    {
      title: 'About',
      route: AppRoutes.ABOUT
    }
  ]

  public constructor() { }

}
