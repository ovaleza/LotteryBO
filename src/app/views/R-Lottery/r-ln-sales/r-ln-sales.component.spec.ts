import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RLNSalesComponent } from './r-ln-sales.component';

describe('RLNSalesComponent', () => {
  let component: RLNSalesComponent;
  let fixture: ComponentFixture<RLNSalesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RLNSalesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RLNSalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
