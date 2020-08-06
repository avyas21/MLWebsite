import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RNNComponent } from './rnn.component';

describe('RNNComponent', () => {
  let component: RNNComponent;
  let fixture: ComponentFixture<RNNComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RNNComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RNNComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
