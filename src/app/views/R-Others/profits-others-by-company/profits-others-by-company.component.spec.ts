import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfitsOthersByCompanyComponent } from './profits-others-by-company.component';

describe('ProfitsOthersByCompanyComponent', () => {
  let component: ProfitsOthersByCompanyComponent;
  let fixture: ComponentFixture<ProfitsOthersByCompanyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfitsOthersByCompanyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfitsOthersByCompanyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
