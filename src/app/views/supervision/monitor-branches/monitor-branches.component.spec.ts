import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonitorBranchesComponent } from './monitor-branches.component';

describe('MonitorBranchesComponent', () => {
  let component: MonitorBranchesComponent;
  let fixture: ComponentFixture<MonitorBranchesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MonitorBranchesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MonitorBranchesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
