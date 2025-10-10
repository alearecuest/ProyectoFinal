import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientBackground } from './patient-background';

describe('PatientBackground', () => {
  let component: PatientBackground;
  let fixture: ComponentFixture<PatientBackground>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PatientBackground]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PatientBackground);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
