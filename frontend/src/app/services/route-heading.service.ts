import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RouteHeadingService {

  private routeHeadingTitleSubject = new Subject<string>();

  constructor() { }

  public updateRouteHeadingTitle(newTitle: string) {
    this.routeHeadingTitleSubject.next(newTitle);
  }

  public titleChanged$(): Observable<string> {
    return this.routeHeadingTitleSubject.asObservable();
  }
}
