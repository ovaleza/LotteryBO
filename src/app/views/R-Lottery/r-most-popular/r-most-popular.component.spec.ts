import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RMostPopularComponent } from './r-most-popular.component';

describe('RMostPopularComponent', () => {
  let component: RMostPopularComponent;
  let fixture: ComponentFixture<RMostPopularComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RMostPopularComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RMostPopularComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
