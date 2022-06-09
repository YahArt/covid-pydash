import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild, ViewContainerRef } from '@angular/core';
import { filter, Subject, takeUntil } from 'rxjs';
import { ChartConfig } from 'src/app/config/chart-config';
import { DashboardWidgetType } from 'src/app/enums/dashboard-widget-type.enum';
import { IDashboardWidgetItem } from 'src/app/interfaces/idashboard-widget-item';
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

  @Input()
  public item!: IDashboardWidgetItem;

  @Output()
  public onDelete = new EventEmitter<string>();

  public noData = false;
  public error: string | null = null;

  public title = '';
  public subtitle = '';

  public editModeEnabled = false;

  constructor(private readonly _changeDetectorRef: ChangeDetectorRef, private readonly dashboardService: DashboardService) { }

  private subscribeWidgetResize() {
    this.dashboardService.widgetSizeChanged$.pipe(filter(identifier => identifier === this.item.identifier), takeUntil(this.destroy)).subscribe(() => {
      this.widgetInstance?.onWidgetResize();
    });
  }

  private subscribeEditModeChanged() {
    this.dashboardService.editModeChanged$.pipe(takeUntil(this.destroy)).subscribe(editModeEnabled => {
      this.editModeEnabled = editModeEnabled;
      this._changeDetectorRef.markForCheck();
    });
  }

  private subscribeDashboardDataChanged() {
    this.dashboardService.dashboardDataChanged$.pipe(takeUntil(this.destroy)).subscribe(dashboardData => {
      const widgetSpecificData = dashboardData.find(d => d.identifier === this.item.identifier);
      if (!widgetSpecificData) {
        return;
      }
      this.error = widgetSpecificData.error;
      this.noData = widgetSpecificData.noData;
      if (this.error || this.noData) {
        this._changeDetectorRef.markForCheck();
        return;
      }
      this.widgetInstance?.onDataChanged(widgetSpecificData);
    });
  }


  public ngOnInit(): void {
    this.subscribeWidgetResize();
    this.subscribeEditModeChanged();
    this.subscribeDashboardDataChanged();
  }

  public ngAfterViewInit(): void {
    const chartConfig = ChartConfig.getConfig(this.item);
    switch (this.item.type) {
      case DashboardWidgetType.LineChart: {
        const lineChartWidget = this.itemTemplate.createComponent(LineChartWidgetComponent);
        this.widgetInstance = lineChartWidget.instance;
        this.widgetInstance.setConfig(chartConfig);
        this.title = chartConfig?.title ?? '';
        this.subtitle = chartConfig?.subtitle ?? '';
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
