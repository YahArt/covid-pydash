import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { DashboardOverviewComponent } from './components/dashboard-overview/dashboard-overview.component';
import { AppRoutes } from './config/app-routes';
import { HomeComponent } from './components/home/home.component';

const routes: Routes = [
  { path: '', redirectTo: AppRoutes.HOME, pathMatch: 'full' },
  { path: AppRoutes.HOME, component: HomeComponent },
  { path: AppRoutes.DASHBOARD, component: DashboardComponent },
  { path: AppRoutes.DASHBOARD_OVERVIEW, component: DashboardOverviewComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
