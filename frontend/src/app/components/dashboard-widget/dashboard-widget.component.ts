import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild, ViewContainerRef } from '@angular/core';
import { filter, Subject, takeUntil } from 'rxjs';
import { DashboardWidgetType } from 'src/app/models/dashboard-widget-type.enum';
import { IDashboardWidgetItem } from 'src/app/models/idashboard-widget-item';
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

  public isLoading = false;

  public editModeEnabled = false;

  constructor(private readonly _changeDetectorRef: ChangeDetectorRef, private readonly dashboardService: DashboardService) { }

  private subscribeWidgetResize() {
    this.dashboardService.widgetSizeChanged$.pipe(filter(e => e.identifier === this.item.identifier), takeUntil(this.destroy)).subscribe(widgetSizeChangedEvent => {
      this.widgetInstance?.onWidgetResize(widgetSizeChangedEvent);
    });
  }

  private subscribeEditModeChanged() {
    this.dashboardService.editModeChanged$.pipe(takeUntil(this.destroy)).subscribe(editModeEnabled => {
      this.editModeEnabled = editModeEnabled;
      this._changeDetectorRef.markForCheck();
    });
  }

  public ngOnInit(): void {
    this.subscribeWidgetResize();
    this.subscribeEditModeChanged();
  }

  public ngAfterViewInit(): void {
    switch (this.item.type) {
      case DashboardWidgetType.LineChart: {
        const lineChartWidget = this.itemTemplate.createComponent(LineChartWidgetComponent);
        this.widgetInstance = lineChartWidget.instance;
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

  public reload() {
    // TODO make correct backend request
    this.isLoading = !this.isLoading;

  }

  public ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
  }

}
