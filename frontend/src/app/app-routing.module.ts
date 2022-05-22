import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardOverviewComponent } from './components/dashboard-overview/dashboard-overview.component';
import { AppRoutes } from './helpers/app-routes';

const routes: Routes = [
  { path: '', redirectTo: AppRoutes.DASHBOARD_OVERVIEW, pathMatch: 'full' },
  { path: AppRoutes.DASHBOARD_OVERVIEW, component: DashboardOverviewComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
