import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RCollectsComponent } from './r-collects.component';

describe('RCollectsComponent', () => {
  let component: RCollectsComponent;
  let fixture: ComponentFixture<RCollectsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RCollectsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RCollectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
