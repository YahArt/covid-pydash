import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Guid } from 'guid-typescript';
import { AppRoutes } from 'src/app/config/app-routes';
import { DashboardService } from 'src/app/services/dashboard.service';

@Component({
  selector: 'app-create-dashboard',
  templateUrl: './create-dashboard.component.html',
  styleUrls: ['./create-dashboard.component.scss']
})
export class CreateDashboardComponent implements OnInit {

  public createDashboard = new FormGroup(
    {
      name: new FormControl(null, [Validators.required, Validators.minLength(2)]),
      selectedTemplate: new FormControl("none"),
    }
  );


  constructor(private readonly dashboardService: DashboardService, private readonly router: Router) { }

  public ngOnInit(): void {
  }

  public onCreateDashboard() {
    // TODO: Pass in correct template...
    // TODO: Perhaps add possbility to only create dashboard and one other for creating and directly editing
    const dashboard = this.dashboardService.createDashboardFromTemplate(null);
    dashboard.title = this.createDashboard.controls.name.value;
    dashboard.identifier = Guid.create().toString();


    // this.router.navigate([AppRoutes.DASHBOARD], {
    //   queryParams: { identifier: dashboard.identifier }
    // });
  }



}
