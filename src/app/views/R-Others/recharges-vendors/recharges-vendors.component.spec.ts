import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RechargesVendorsComponent } from './recharges-vendors.component';

describe('RechargesVendorsComponent', () => {
  let component: RechargesVendorsComponent;
  let fixture: ComponentFixture<RechargesVendorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RechargesVendorsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RechargesVendorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
