import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DashboardOverviewComponent } from './components/dashboard-overview/dashboard-overview.component';
import { CreateDashboardComponent } from './components/create-dashboard/create-dashboard.component';
import { GridsterModule } from 'angular-gridster2';

@NgModule({
  declarations: [
    AppComponent,
    DashboardOverviewComponent,
    CreateDashboardComponent
  ],
  imports: [
    BrowserModule,
    GridsterModule,
    AppRoutingModule,
    MatToolbarModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
