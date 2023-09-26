import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RStatisticsComponent } from './r-statistics.component';

describe('RStatisticsComponent', () => {
  let component: RStatisticsComponent;
  let fixture: ComponentFixture<RStatisticsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RStatisticsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
