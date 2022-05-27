import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RouteHeadingComponent } from './route-heading.component';

describe('RouteHeadingComponent', () => {
  let component: RouteHeadingComponent;
  let fixture: ComponentFixture<RouteHeadingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RouteHeadingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RouteHeadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
