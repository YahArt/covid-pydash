import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDatepickerModule } from '@angular/material/datepicker';

import { LineChartModule } from '@swimlane/ngx-charts';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DashboardOverviewComponent } from './components/dashboard-overview/dashboard-overview.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { GridsterModule } from 'angular-gridster2';
import { LineChartWidgetComponent } from './components/widgets/line-chart-widget/line-chart-widget.component';
import { DashboardWidgetComponent } from './components/dashboard-widget/dashboard-widget.component';
import { HomeComponent } from './components/home/home.component';
import { RouteHeadingComponent } from './components/route-heading/route-heading.component';
import { CreateWidgetDialogComponent } from './components/dialogs/create-widget-dialog/create-widget-dialog.component';
import { MatNativeDateModule } from '@angular/material/core';

@NgModule({
  declarations: [
    AppComponent,
    DashboardOverviewComponent,
    DashboardComponent,
    LineChartWidgetComponent,
    DashboardWidgetComponent,
    HomeComponent,
    RouteHeadingComponent,
    CreateWidgetDialogComponent
  ],
  imports: [
    BrowserModule,
    GridsterModule,
    AppRoutingModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatListModule,
    MatSidenavModule,
    MatDialogModule,
    LineChartModule,
    MatCardModule,
    MatProgressBarModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatSnackBarModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
