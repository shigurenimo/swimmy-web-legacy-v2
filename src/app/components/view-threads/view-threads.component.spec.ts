import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewThreadsComponent } from './view-threads.component';

describe('ViewThreadsComponent', () => {
  let component: ViewThreadsComponent;
  let fixture: ComponentFixture<ViewThreadsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewThreadsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewThreadsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
