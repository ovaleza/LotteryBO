import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RechargeVoidComponent } from './recharge-void.component';

describe('RechargeVoidComponent', () => {
  let component: RechargeVoidComponent;
  let fixture: ComponentFixture<RechargeVoidComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RechargeVoidComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RechargeVoidComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
