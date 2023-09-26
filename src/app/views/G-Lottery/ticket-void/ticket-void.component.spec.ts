import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketVoidComponent } from './ticket-void.component';

describe('TicketVoidComponent', () => {
  let component: TicketVoidComponent;
  let fixture: ComponentFixture<TicketVoidComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TicketVoidComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketVoidComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
