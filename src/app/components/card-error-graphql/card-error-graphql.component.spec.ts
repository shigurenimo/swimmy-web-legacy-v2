import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CardErrorGraphqlComponent } from './card-error-graphql.component';

describe('CardErrorGraphqlComponent', () => {
  let component: CardErrorGraphqlComponent;
  let fixture: ComponentFixture<CardErrorGraphqlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CardErrorGraphqlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardErrorGraphqlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
