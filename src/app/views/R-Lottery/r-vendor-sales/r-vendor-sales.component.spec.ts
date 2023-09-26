import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RVendorSalesComponent } from './r-vendor-sales.component';

describe('RVendorSalesComponent', () => {
  let component: RVendorSalesComponent;
  let fixture: ComponentFixture<RVendorSalesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RVendorSalesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RVendorSalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
