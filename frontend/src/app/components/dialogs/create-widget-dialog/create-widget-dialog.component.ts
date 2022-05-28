import { Component, ElementRef, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatListOption, MatListOptionCheckboxPosition, MatSelectionList } from '@angular/material/list';
import { DashboardWidgetType } from 'src/app/models/dashboard-widget-type.enum';

@Component({
  selector: 'create-widget-dialog',
  templateUrl: './create-widget-dialog.component.html',
  styleUrls: ['./create-widget-dialog.component.sass']
})
export class CreateWidgetDialogComponent implements OnInit {

  constructor(private readonly dialogRef: MatDialogRef<CreateWidgetDialogComponent>) { }

  public readonly supportedWidgetTypes: DashboardWidgetType[] = [DashboardWidgetType.LineChart, DashboardWidgetType.LineChart];

  public ngOnInit(): void {
  }

  public descriptionForType(widgetType: DashboardWidgetType): string {
    switch (widgetType) {
      case DashboardWidgetType.LineChart:
        return 'Informing about severity - Number of Covid Cases over time'
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
