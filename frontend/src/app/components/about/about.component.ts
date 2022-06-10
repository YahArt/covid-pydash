import { Component, OnInit } from '@angular/core';
import { RouteHeadingService } from 'src/app/services/route-heading.service';

@Component({
  selector: 'about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {

  constructor(private readonly routeHeadingService: RouteHeadingService) { }

  public ngOnInit(): void {
    this.routeHeadingService.updateRouteHeadingTitle("About");
  }

}
