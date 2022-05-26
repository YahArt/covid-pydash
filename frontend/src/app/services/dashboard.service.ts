import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { IWidgetSize } from '../models/iwidget-size';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private widgetSizeChangedSubject = new Subject<IWidgetSize>();

  constructor() { }


  public notifyWidgetSizeChanged(identifier: string, width: number, height: number) {
    this.widgetSizeChangedSubject.next({ identifier, width, height });
  }

  public get widgetSizeChanged$(): Observable<IWidgetSize> {
    return this.widgetSizeChangedSubject.asObservable();
  }
}
