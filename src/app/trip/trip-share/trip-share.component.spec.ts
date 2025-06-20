import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TripShareComponent } from './trip-share.component';

describe('TripShareComponent', () => {
  let component: TripShareComponent;
  let fixture: ComponentFixture<TripShareComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TripShareComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TripShareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
