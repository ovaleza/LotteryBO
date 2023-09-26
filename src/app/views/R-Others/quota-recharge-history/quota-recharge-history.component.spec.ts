import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuotaRechargeHistoryComponent } from './quota-recharge-history.component';

describe('QuotaRechargeHistoryComponent', () => {
  let component: QuotaRechargeHistoryComponent;
  let fixture: ComponentFixture<QuotaRechargeHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuotaRechargeHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuotaRechargeHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
