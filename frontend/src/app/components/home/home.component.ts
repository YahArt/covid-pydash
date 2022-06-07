import { Component, OnInit } from '@angular/core';
import { RouteHeadingService } from 'src/app/services/route-heading.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private readonly routeHeadingService: RouteHeadingService) { }

  ngOnInit(): void {
    this.routeHeadingService.updateRouteHeadingTitle("Home");
  }

}
