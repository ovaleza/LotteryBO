/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { RafflesComponent } from './Raffles.component';

describe('RafflesComponent', () => {
  let component: RafflesComponent;
  let fixture: ComponentFixture<RafflesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RafflesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RafflesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
