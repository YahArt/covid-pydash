import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatFormFieldModule, MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatChipsModule } from '@angular/material/chips';
import { MatTableModule } from '@angular/material/table';
import { MatRadioModule } from '@angular/material/radio';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { HighchartsChartModule } from 'highcharts-angular';

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
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CreateDashboardComponent } from './components/create-dashboard/create-dashboard.component';
import { BarChartWidgetComponent } from './components/widgets/bar-chart-widget/bar-chart-widget.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardOverviewComponent,
    DashboardComponent,
    LineChartWidgetComponent,
    DashboardWidgetComponent,
    HomeComponent,
    RouteHeadingComponent,
    CreateWidgetDialogComponent,
    CreateDashboardComponent,
    BarChartWidgetComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    GridsterModule,
    AppRoutingModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatListModule,
    MatSidenavModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatSelectModule,
    MatCardModule,
    MatProgressBarModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatSnackBarModule,
    ReactiveFormsModule,
    MatChipsModule,
    MatTableModule,
    MatRadioModule,
    BrowserAnimationsModule,
    HighchartsChartModule
  ],
  providers: [
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'fill' } }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
