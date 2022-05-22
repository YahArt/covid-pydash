import { Component } from '@angular/core';
import { AppRoutes } from './helpers/app-routes';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent {
  title = 'frontend';
  sideBarElements = [
    {
      name: 'Dashboards',
      route: AppRoutes.DASHBOARD_OVERVIEW
    }
  ]

}
