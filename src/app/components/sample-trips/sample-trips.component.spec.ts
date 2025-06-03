import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SampleTripsComponent } from './sample-trips.component';

describe('SampleTripsComponent', () => {
  let component: SampleTripsComponent;
  let fixture: ComponentFixture<SampleTripsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SampleTripsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SampleTripsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
