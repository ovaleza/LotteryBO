import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RPrizePaymentComponent } from './r-prize-payment.component';

describe('RPrizePaymentComponent', () => {
  let component: RPrizePaymentComponent;
  let fixture: ComponentFixture<RPrizePaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RPrizePaymentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RPrizePaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
