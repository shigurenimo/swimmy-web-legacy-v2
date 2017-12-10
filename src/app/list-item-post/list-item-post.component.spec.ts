import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListItemPostComponent } from './list-item-post.component';

describe('ListItemPostComponent', () => {
  let component: ListItemPostComponent;
  let fixture: ComponentFixture<ListItemPostComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListItemPostComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListItemPostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
