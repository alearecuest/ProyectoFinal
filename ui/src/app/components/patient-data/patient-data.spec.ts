import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientData } from './patient-data';

describe('PatientData', () => {
  let component: PatientData;
  let fixture: ComponentFixture<PatientData>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PatientData]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PatientData);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
