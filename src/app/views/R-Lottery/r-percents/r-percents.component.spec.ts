import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RPercentsComponent } from './r-percents.component';

describe('RPercentsComponent', () => {
  let component: RPercentsComponent;
  let fixture: ComponentFixture<RPercentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RPercentsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RPercentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
