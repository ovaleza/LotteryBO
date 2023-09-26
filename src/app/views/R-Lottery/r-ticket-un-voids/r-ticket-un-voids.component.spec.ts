import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RTicketUnVoidsComponent } from './r-ticket-un-voids.component';

describe('RTicketUnVoidsComponent', () => {
  let component: RTicketUnVoidsComponent;
  let fixture: ComponentFixture<RTicketUnVoidsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RTicketUnVoidsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RTicketUnVoidsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
