import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LotteriesResultsComponent } from './lotteries-results.component';

describe('LotteriesResultsComponent', () => {
  let component: LotteriesResultsComponent;
  let fixture: ComponentFixture<LotteriesResultsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LotteriesResultsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LotteriesResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
