import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoicesVendorsComponent } from './invoices-vendors.component';

describe('InvoicesVendorsComponent', () => {
  let component: InvoicesVendorsComponent;
  let fixture: ComponentFixture<InvoicesVendorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvoicesVendorsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoicesVendorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
