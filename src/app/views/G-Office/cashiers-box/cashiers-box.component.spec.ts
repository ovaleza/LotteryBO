import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CashiersBoxComponent } from './cashiers-box.component';

describe('CashiersBoxComponent', () => {
  let component: CashiersBoxComponent;
  let fixture: ComponentFixture<CashiersBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CashiersBoxComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CashiersBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
