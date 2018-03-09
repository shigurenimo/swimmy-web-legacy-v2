import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CardErrorNetworkComponent } from './card-error-network.component';

describe('CardErrorNetworkComponent', () => {
  let component: CardErrorNetworkComponent;
  let fixture: ComponentFixture<CardErrorNetworkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CardErrorNetworkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardErrorNetworkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
