import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfitsOthersComponent } from './profits-others.component';

describe('ProfitsOthersComponent', () => {
  let component: ProfitsOthersComponent;
  let fixture: ComponentFixture<ProfitsOthersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfitsOthersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfitsOthersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
