import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewUserDetailComponent } from './view-user-detail.component';

describe('ViewUserDetailComponent', () => {
  let component: ViewUserDetailComponent;
  let fixture: ComponentFixture<ViewUserDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewUserDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewUserDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
