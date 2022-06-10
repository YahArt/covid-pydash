import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Guid } from 'guid-typescript';
import { Subject, takeUntil } from 'rxjs';
import { AppRoutes } from 'src/app/config/app-routes';
import { CovidTemplates } from 'src/app/enums/covid-templates-enum';
import { DashboardService } from 'src/app/services/dashboard.service';
import { RouteHeadingService } from 'src/app/services/route-heading.service';

@Component({
  selector: 'app-create-dashboard',
  templateUrl: './create-dashboard.component.html',
  styleUrls: ['./create-dashboard.component.scss']
})
export class CreateDashboardComponent implements OnInit, OnDestroy {

  private destroy = new Subject<void>();

  public createDashboard = new FormGroup(
    {
      name: new FormControl<string>("", [Validators.required, Validators.minLength(2)]),
      selectedTemplate: new FormControl<CovidTemplates>(CovidTemplates.None),
    }
  );

  public readonly templates = Object.values(CovidTemplates);


  constructor(private readonly dashboardService: DashboardService, private readonly snackbar: MatSnackBar, private readonly routeHeadingService: RouteHeadingService, private readonly router: Router) { }

  public ngOnInit(): void {
    this.routeHeadingService.updateRouteHeadingTitle("Create a new Dashboard");
  }

  public ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
  }

  public getTemplateFriendlyName(template: CovidTemplates) {
    switch (template) {
      case CovidTemplates.None:
        return "None"
      case CovidTemplates.SeverityOfPandemic:
        return "Severity of Pandemic"
      default:
        return "NOT DEFINED"
    }
  }

  public onCreateDashboard(editAfterCreation = false) {
    const template = this.createDashboard.controls.selectedTemplate.value as CovidTemplates;
    const title = this.createDashboard.controls.name.value as string;

    this.dashboardService.getDashboardFromTemplate$(template).pipe(takeUntil(this.destroy)).subscribe(response => {
      if (response.error) {
        const message = `Error getting a dashboard for template: "${this.getTemplateFriendlyName(template)}", Error: ${response.error}`
        this.snackbar.open(message, 'Close');
        return;
      }

      const dashboard = response.dashboard;
      dashboard.title = title
      dashboard.identifier = Guid.create().toString();

      this.dashboardService.createDashboard$(dashboard).pipe(takeUntil(this.destroy)).subscribe(result => {
        const dashboardTitle = result.dashboard.title
        const message = result.error ? `Error creating dashboard "${dashboardTitle}", Error: ${result.error}` : `Dashboard: "${dashboardTitle}" was successfully created`
        this.snackbar.open(message, undefined, {
          duration: 1000
        });

        if (editAfterCreation) {
          this.router.navigate([AppRoutes.DASHBOARD], {
            queryParams: { identifier: result.dashboard.identifier }
          });
        }
      })
    });
  }



}
