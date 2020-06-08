import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SVMComponent } from './svm.component';

describe('SVMComponent', () => {
  let component: SVMComponent;
  let fixture: ComponentFixture<SVMComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SVMComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SVMComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
