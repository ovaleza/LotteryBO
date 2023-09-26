import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RTicketWinnersComponent } from './r-ticket-winners.component';

describe('RTicketWinnersComponent', () => {
  let component: RTicketWinnersComponent;
  let fixture: ComponentFixture<RTicketWinnersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RTicketWinnersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RTicketWinnersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
