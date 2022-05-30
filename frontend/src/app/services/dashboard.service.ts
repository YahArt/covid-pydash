import { Injectable } from '@angular/core';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { IWidgetSize } from '../models/iwidget-size';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private widgetSizeChangedSubject = new Subject<IWidgetSize>();
  private editModeChangedSubject = new Subject<boolean>();

  constructor() { }

  public notifyEditModeChanged(enabled: boolean) {
    this.editModeChangedSubject.next(enabled);
  }

  public notifyWidgetSizeChanged(identifier: string, width: number, height: number) {
    this.widgetSizeChangedSubject.next({ identifier, width, height });
  }

  public get widgetSizeChanged$(): Observable<IWidgetSize> {
    return this.widgetSizeChangedSubject.asObservable();
  }

  public get editModeChanged$(): Observable<boolean> {
    return this.editModeChangedSubject.asObservable();
  }
}
