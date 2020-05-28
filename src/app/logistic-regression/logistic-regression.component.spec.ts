import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LogisticRegressionComponent } from './logistic-regression.component';

describe('LogisticRegressionComponent', () => {
  let component: LogisticRegressionComponent;
  let fixture: ComponentFixture<LogisticRegressionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LogisticRegressionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LogisticRegressionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
