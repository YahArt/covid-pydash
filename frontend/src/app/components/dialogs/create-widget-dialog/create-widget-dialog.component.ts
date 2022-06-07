import { Component, ElementRef, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatRadioChange } from '@angular/material/radio';
import { CovidInformationType } from 'src/app/enums/covid-information-type.enum';
import { DashboardWidgetType } from 'src/app/enums/dashboard-widget-type.enum';
import { ICreateWidgetDialogEntry } from 'src/app/interfaces/icreate-widget-dialog-entry';

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
      informationAbout: CovidInformationType.CovidDeaths,
    },
  ];

  public selectedElement: ICreateWidgetDialogEntry | null = null;

  public readonly dataSource: Array<ICreateWidgetDialogEntry> = [
    { informationCategory: 'Severity of Pandemic', informationAbout: CovidInformationType.CovidDeaths, informationAboutDesc: 'Covid Deaths', description: 'Covid Deaths accumulated over time', type: DashboardWidgetType.LineChart, typeDesc: 'Line Chart' },
    { informationCategory: 'Severity of Pandemic', informationAbout: CovidInformationType.CovidDeaths, informationAboutDesc: 'Covid Deaths', description: 'Covid Deaths accumulated over time', type: DashboardWidgetType.LineChart, typeDesc: 'Line Chart' },
  ];

  public readonly displayedColumns: string[] = ['selection', 'informationCategory', 'informationAbout', 'description', 'visualizationType'];

  public ngOnInit(): void {
  }

  public onSelect($event: MatRadioChange) {
    this.selectedElement = $event.value;
  }

  public closeWithResult() {
    this.dialogRef.close(this.selectedElement);
  }

  public closeWithoutResult() {
    this.dialogRef.close(null);
  }

}
