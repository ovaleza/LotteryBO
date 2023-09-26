import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RTicketVoidsComponent } from './r-ticket-voids.component';

describe('RTicketVoidsComponent', () => {
  let component: RTicketVoidsComponent;
  let fixture: ComponentFixture<RTicketVoidsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RTicketVoidsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RTicketVoidsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
