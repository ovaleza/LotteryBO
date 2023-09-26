import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuotaRechargeDistributionComponent } from './quota-recharge-distribution.component';

describe('QuotaRechargeDistributionComponent', () => {
  let component: QuotaRechargeDistributionComponent;
  let fixture: ComponentFixture<QuotaRechargeDistributionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuotaRechargeDistributionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuotaRechargeDistributionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
