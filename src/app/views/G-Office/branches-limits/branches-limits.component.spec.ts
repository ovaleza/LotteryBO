import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BranchesLimitsComponent } from './branches-limits.component';

describe('BranchesLimitsComponent', () => {
  let component: BranchesLimitsComponent;
  let fixture: ComponentFixture<BranchesLimitsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BranchesLimitsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BranchesLimitsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
