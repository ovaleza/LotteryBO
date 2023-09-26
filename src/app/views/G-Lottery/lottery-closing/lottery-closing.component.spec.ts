import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LotteryClosingComponent } from './lottery-closing.component';

describe('LotteryClosingComponent', () => {
  let component: LotteryClosingComponent;
  let fixture: ComponentFixture<LotteryClosingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LotteryClosingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LotteryClosingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
