import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
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


  constructor(private readonly dashboardService: DashboardService, private readonly router: Router, private readonly snackbar: MatSnackBar) { }

  public ngOnInit(): void { }

  public onCreateDashboard() {
    // TODO: Pass in correct template...
    const dashboard = this.dashboardService.createDashboardFromTemplate(null);
    dashboard.title = this.createDashboard.controls.name.value;
    dashboard.identifier = Guid.create().toString();

    this.dashboardService.createDashboard$(dashboard).subscribe(result => {
      const dashboardTitle = result.dashboard.title
      const message = result.error ? `Error creating dashboard "${dashboardTitle}", Error: ${result.error}` : `Dashboard: "${dashboardTitle}" was successfully created`
      this.snackbar.open(message, undefined, {
        duration: 1000
      });
    })
  }



}
