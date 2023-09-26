import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RLNVoidsComponent } from './r-ln-voids.component';

describe('RLNVoidsComponent', () => {
  let component: RLNVoidsComponent;
  let fixture: ComponentFixture<RLNVoidsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RLNVoidsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RLNVoidsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
