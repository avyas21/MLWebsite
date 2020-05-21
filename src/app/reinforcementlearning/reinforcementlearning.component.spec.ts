import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReinforcementlearningComponent } from './reinforcementlearning.component';

describe('ReinforcementlearningComponent', () => {
  let component: ReinforcementlearningComponent;
  let fixture: ComponentFixture<ReinforcementlearningComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReinforcementlearningComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReinforcementlearningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
