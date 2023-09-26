import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LNVoidComponent } from './ln-void.component';

describe('LNVoidComponent', () => {
  let component: LNVoidComponent;
  let fixture: ComponentFixture<LNVoidComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LNVoidComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LNVoidComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
