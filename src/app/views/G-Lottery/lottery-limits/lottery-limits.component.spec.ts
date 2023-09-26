import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LotteryLimitsComponent } from './lottery-limits.component';

describe('LotteryLimitsComponent', () => {
  let component: LotteryLimitsComponent;
  let fixture: ComponentFixture<LotteryLimitsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LotteryLimitsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LotteryLimitsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
