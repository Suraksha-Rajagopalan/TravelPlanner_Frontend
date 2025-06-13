import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TripChecklistComponent } from './trip-checklist.component';

describe('TripChecklistComponent', () => {
  let component: TripChecklistComponent;
  let fixture: ComponentFixture<TripChecklistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TripChecklistComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TripChecklistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
