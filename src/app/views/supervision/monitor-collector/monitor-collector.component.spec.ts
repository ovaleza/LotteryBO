import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonitorCollectorComponent } from './monitor-collector.component';

describe('MonitorCollectorComponent', () => {
  let component: MonitorCollectorComponent;
  let fixture: ComponentFixture<MonitorCollectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MonitorCollectorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MonitorCollectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
