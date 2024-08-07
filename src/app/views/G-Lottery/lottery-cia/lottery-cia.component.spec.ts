import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LotteryCiaComponent } from './lottery-cia.component';

describe('LotteryCiaComponent', () => {
  let component: LotteryCiaComponent;
  let fixture: ComponentFixture<LotteryCiaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LotteryCiaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LotteryCiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
