import { TestBed } from '@angular/core/testing';

import { RouteHeadingService } from './route-heading.service';

describe('RouteHeadingService', () => {
  let service: RouteHeadingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RouteHeadingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
