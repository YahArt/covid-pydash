import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { DashboardOverviewComponent } from './components/dashboard-overview/dashboard-overview.component';
import { AppRoutes } from './config/app-routes';
import { HomeComponent } from './components/home/home.component';
import { CreateDashboardComponent } from './components/create-dashboard/create-dashboard.component';
import { AboutComponent } from './components/about/about.component';
import { FaqComponent } from './components/faq/faq.component';

const routes: Routes = [
  { path: '', redirectTo: AppRoutes.HOME, pathMatch: 'full' },
  { path: AppRoutes.HOME, component: HomeComponent },
  { path: AppRoutes.CREATE_DASHBOARD, component: CreateDashboardComponent },
  { path: AppRoutes.DASHBOARD, component: DashboardComponent },
  { path: AppRoutes.DASHBOARD_OVERVIEW, component: DashboardOverviewComponent },
  { path: AppRoutes.FAQ, component: FaqComponent },
  { path: AppRoutes.ABOUT, component: AboutComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
