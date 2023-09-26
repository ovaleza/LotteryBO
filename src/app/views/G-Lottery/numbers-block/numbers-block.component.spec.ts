import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NumbersBlockComponent } from './numbers-block.component';

describe('NumbersBlockComponent', () => {
  let component: NumbersBlockComponent;
  let fixture: ComponentFixture<NumbersBlockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NumbersBlockComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NumbersBlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
