import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';

import { LineChartModule } from '@swimlane/ngx-charts';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DashboardOverviewComponent } from './components/dashboard-overview/dashboard-overview.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { GridsterModule } from 'angular-gridster2';
import { LineChartWidgetComponent } from './components/widgets/line-chart-widget/line-chart-widget.component';
import { DashboardWidgetComponent } from './components/dashboard-widget/dashboard-widget.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardOverviewComponent,
    DashboardComponent,
    LineChartWidgetComponent,
    DashboardWidgetComponent
  ],
  imports: [
    BrowserModule,
    GridsterModule,
    AppRoutingModule,
    MatToolbarModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
    LineChartModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
