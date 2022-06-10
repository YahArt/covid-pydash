import { Component, OnInit } from '@angular/core';
import { RouteHeadingService } from 'src/app/services/route-heading.service';

@Component({
  selector: 'faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss']
})
export class FaqComponent implements OnInit {

  constructor(private readonly routeHeadingService: RouteHeadingService) { }

  public ngOnInit(): void {
    this.routeHeadingService.updateRouteHeadingTitle("FAQ About Corona");
  }

}
