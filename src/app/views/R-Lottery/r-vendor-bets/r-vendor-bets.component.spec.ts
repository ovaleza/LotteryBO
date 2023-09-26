import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RVendorBetsComponent } from './r-vendor-bets.component';

describe('RVendorBetsComponent', () => {
  let component: RVendorBetsComponent;
  let fixture: ComponentFixture<RVendorBetsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RVendorBetsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RVendorBetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
