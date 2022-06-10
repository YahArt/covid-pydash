import { Component, ElementRef, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatRadioChange } from '@angular/material/radio';
import { CovidInformationSubType } from 'src/app/enums/covid-information-sub-type.enum';
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

  public selectedElement: ICreateWidgetDialogEntry | null = null;

  public readonly dataSource: Array<ICreateWidgetDialogEntry> = [
    { informationCategory: 'Severity of Pandemic', informationType: CovidInformationType.CovidDeaths, informationTypeDesc: 'Covid Deaths', informationSubType: CovidInformationSubType.DailyDeaths, informationSubTypeDesc: 'Daily deaths', type: DashboardWidgetType.LineChart, typeDesc: 'Line Chart' },
    { informationCategory: 'Severity of Pandemic', informationType: CovidInformationType.CovidDeaths, informationTypeDesc: 'Covid Deaths', informationSubType: CovidInformationSubType.SumTotalDeaths, informationSubTypeDesc: 'Sum of total deaths', type: DashboardWidgetType.LineChart, typeDesc: 'Line Chart' },
    { informationCategory: 'Severity of Pandemic', informationType: CovidInformationType.CovidDeaths, informationTypeDesc: 'Covid Deaths', informationSubType: CovidInformationSubType.SumTotalDeaths, informationSubTypeDesc: 'Sum of total deaths', type: DashboardWidgetType.BarChart, typeDesc: 'Bar Chart' },
    { informationCategory: 'Severity of Pandemic', informationType: CovidInformationType.CovidDeaths, informationTypeDesc: 'Covid Deaths', informationSubType: CovidInformationSubType.SumTotalDeaths, informationSubTypeDesc: 'Sum of total deaths', type: DashboardWidgetType.Map, typeDesc: 'Map' },
  ];

  public readonly displayedColumns: string[] = ['selection', 'informationCategory', 'informationType', 'informationSubType', 'visualizationType'];

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
