import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter, Subject, takeUntil } from 'rxjs';
import { AppRoutes } from 'src/app/config/app-routes';
import { RouteHeadingService } from 'src/app/services/route-heading.service';

@Component({
  selector: 'route-heading',
  templateUrl: './route-heading.component.html',
  styleUrls: ['./route-heading.component.scss']
})
export class RouteHeadingComponent implements OnInit, OnDestroy {

  private destroy = new Subject<void>();

  public heading = "";

  constructor(private readonly routeHeadingService: RouteHeadingService) { }

  public ngOnInit(): void {
    this.routeHeadingService.titleChanged$().pipe(takeUntil(this.destroy)).subscribe(newTitle => {
      this.heading = newTitle;
    });
  }

  public ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
  }

}
