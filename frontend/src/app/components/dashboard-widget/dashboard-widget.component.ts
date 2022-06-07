import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild, ViewContainerRef } from '@angular/core';
import { filter, Subject, takeUntil } from 'rxjs';
import { ChartConfig } from 'src/app/config/chart-config';
import { DashboardWidgetType } from 'src/app/enums/dashboard-widget-type.enum';
import { IDashboardWidgetItem } from 'src/app/interfaces/idashboard-widget-item';
import { ILineChartConfig } from 'src/app/interfaces/iline-chart-config';
import { IWidgetSize } from 'src/app/interfaces/iwidget-size';
import { DashboardService } from 'src/app/services/dashboard.service';
import { LineChartWidgetComponent } from '../widgets/line-chart-widget/line-chart-widget.component';
import { WidgetBase } from '../widgets/widget-base';

@Component({
  selector: 'dashboard-widget',
  templateUrl: './dashboard-widget.component.html',
  styleUrls: ['./dashboard-widget.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardWidgetComponent implements OnInit, AfterViewInit, OnDestroy {
  private widgetInstance!: WidgetBase;
  private destroy = new Subject<void>();

  @ViewChild("itemTemplate", { read: ViewContainerRef })
  public itemTemplate!: ViewContainerRef;

  @ViewChild("chartContainer")
  public chartContainer!: ElementRef;

  @Input()
  public item!: IDashboardWidgetItem;

  @Output()
  public onDelete = new EventEmitter<string>();

  public isLoading = false;
  public noData = false;
  public error: string | null = null;

  public title = '';
  public subtitle = '';

  public editModeEnabled = false;

  constructor(private readonly _changeDetectorRef: ChangeDetectorRef, private readonly dashboardService: DashboardService) { }

  private subscribeWidgetResize() {
    this.dashboardService.widgetSizeChanged$.pipe(filter(e => e.identifier === this.item.identifier), takeUntil(this.destroy)).subscribe(() => {
      const widgetSizeChangedEvent: IWidgetSize = {
        width: this.chartContainer.nativeElement.offsetWidth,
        height: this.chartContainer.nativeElement.offsetHeight,
        identifier: this.item.identifier
      }
      this.widgetInstance?.onWidgetResize(widgetSizeChangedEvent);
    });
  }

  private subscribeEditModeChanged() {
    this.dashboardService.editModeChanged$.pipe(takeUntil(this.destroy)).subscribe(editModeEnabled => {
      this.editModeEnabled = editModeEnabled;
      this._changeDetectorRef.markForCheck();
    });
  }

  private subscribeLoading() {
    this.dashboardService.loading$.pipe(takeUntil(this.destroy)).subscribe(loading => {
      this.isLoading = loading;
      this._changeDetectorRef.markForCheck();
    });
  }

  private subscribeDashboardDataChanged() {
    this.dashboardService.dashboardDataChanged$.pipe(filter(e => e.findIndex(b => b.identifier === this.item.identifier) >= 0), takeUntil(this.destroy)).subscribe(data => {
      // There should only ever be one widget data item per identifier so we can take the first one...
      const widgetValue = data[0];
      this.error = widgetValue.error;
      this.noData = widgetValue.noData;
      if (this.error || this.noData) {
        return;
      }
      this.widgetInstance?.onDataChanged(widgetValue);
    });
  }


  public ngOnInit(): void {
    this.subscribeWidgetResize();
    this.subscribeEditModeChanged();
    this.subscribeLoading();
    this.subscribeDashboardDataChanged();
  }

  public ngAfterViewInit(): void {
    switch (this.item.type) {
      case DashboardWidgetType.LineChart: {
        const lineChartWidget = this.itemTemplate.createComponent(LineChartWidgetComponent);
        const chartConfig = ChartConfig.getConfig(this.item.type, this.item.informationAbout) as ILineChartConfig;
        this.widgetInstance = lineChartWidget.instance;
        this.widgetInstance.setConfig(chartConfig);
        this.title = chartConfig.title;
        this.subtitle = chartConfig.subtitle;
        break;
      }
      default:
      // Do nothign
    }
    this._changeDetectorRef.detectChanges();
  }

  public delete() {
    this.onDelete.next(this.item.identifier);
  }

  public ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
  }

}
