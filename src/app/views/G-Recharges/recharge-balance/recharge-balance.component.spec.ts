import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RechargeBalanceComponent } from './recharge-balance.component';

describe('RechargeBalanceComponent', () => {
  let component: RechargeBalanceComponent;
  let fixture: ComponentFixture<RechargeBalanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RechargeBalanceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RechargeBalanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
