import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TripReviewsComponent } from './trip-reviews.component';

describe('TripReviewsComponent', () => {
  let component: TripReviewsComponent;
  let fixture: ComponentFixture<TripReviewsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TripReviewsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TripReviewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
