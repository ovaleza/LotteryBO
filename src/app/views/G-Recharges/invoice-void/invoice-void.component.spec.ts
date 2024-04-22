import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceVoidComponent } from './invoice-void.component';

describe('InvoiceVoidComponent', () => {
  let component: InvoiceVoidComponent;
  let fixture: ComponentFixture<InvoiceVoidComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvoiceVoidComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoiceVoidComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
