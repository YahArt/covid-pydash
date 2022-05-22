import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateDashboardComponent } from './components/create-dashboard/create-dashboard.component';
import { DashboardOverviewComponent } from './components/dashboard-overview/dashboard-overview.component';
import { AppRoutes } from './helpers/app-routes';

const routes: Routes = [
  { path: '', redirectTo: AppRoutes.CREATE_DASHBOARD, pathMatch: 'full' },
  { path: AppRoutes.CREATE_DASHBOARD, component: CreateDashboardComponent },
  { path: AppRoutes.DASHBOARD_OVERVIEW, component: DashboardOverviewComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
