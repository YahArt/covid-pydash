import { Component, ElementRef, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatListOption, MatListOptionCheckboxPosition, MatSelectionList } from '@angular/material/list';
import { CovidInformationType } from 'src/app/models/covid-information-type.enum';
import { DashboardWidgetType } from 'src/app/models/dashboard-widget-type.enum';

@Component({
  selector: 'create-widget-dialog',
  templateUrl: './create-widget-dialog.component.html',
  styleUrls: ['./create-widget-dialog.component.scss']
})
export class CreateWidgetDialogComponent implements OnInit {

  constructor(private readonly dialogRef: MatDialogRef<CreateWidgetDialogComponent>) { }

  public readonly supportedWidgets: { type: DashboardWidgetType, informationAbout: CovidInformationType }[] = [
    {
      type: DashboardWidgetType.LineChart,
      informationAbout: CovidInformationType.CovidDeaths
    },
    {
      type: DashboardWidgetType.LineChart,
      informationAbout: CovidInformationType.CovidDeaths
    }
  ];

  public ngOnInit(): void {
  }

  public description(widget: { type: DashboardWidgetType, informationAbout: CovidInformationType }): string {
    switch (widget.informationAbout) {
      case CovidInformationType.CovidDeaths:
        return 'Information about deaths related to COVID'
      default:
        return '';
    }
  }

  public closeWithResults(selectedElements: MatListOption[]) {
    this.dialogRef.close(selectedElements.map(s => s.value));
  }

  public closeWithoutResult() {
    this.dialogRef.close(null);
  }

}
