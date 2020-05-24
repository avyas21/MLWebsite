import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LinearRegressionComponent } from './linear-regression.component';

describe('LinearRegressionComponent', () => {
  let component: LinearRegressionComponent;
  let fixture: ComponentFixture<LinearRegressionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LinearRegressionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LinearRegressionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
