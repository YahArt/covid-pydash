import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DashboardOverviewComponent } from './components/dashboard-overview/dashboard-overview.component';
import { CreateDashboardComponent } from './components/create-dashboard/create-dashboard.component';
import { GridsterModule } from 'angular-gridster2';
import { NgxEchartsModule } from 'ngx-echarts';
import { LineChartComponent } from './components/line-chart/line-chart.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardOverviewComponent,
    CreateDashboardComponent,
    LineChartComponent
  ],
  imports: [
    BrowserModule,
    GridsterModule,
    AppRoutingModule,
    MatToolbarModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
    BrowserAnimationsModule,
    NgxEchartsModule.forRoot({
      /**
       * This will import all modules from echarts.
       * If you only need custom modules,
       * please refer to [Custom Build] section.
       */
      echarts: () => import('echarts'), // or import('./path-to-my-custom-echarts')
    }),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
