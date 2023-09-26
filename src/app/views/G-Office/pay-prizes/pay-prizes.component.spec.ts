import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayPrizesComponent } from './pay-prizes.component';

describe('PayPrizesComponent', () => {
  let component: PayPrizesComponent;
  let fixture: ComponentFixture<PayPrizesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PayPrizesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PayPrizesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
