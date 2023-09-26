import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RechargesVoidsComponent } from './recharges-voids.component';

describe('RechargesVoidsComponent', () => {
  let component: RechargesVoidsComponent;
  let fixture: ComponentFixture<RechargesVoidsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RechargesVoidsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RechargesVoidsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
