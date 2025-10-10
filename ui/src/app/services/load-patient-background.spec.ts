import { TestBed } from '@angular/core/testing';

import { LoadPatientBackground } from './load-patient-background';

describe('LoadPatientBackground', () => {
  let service: LoadPatientBackground;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoadPatientBackground);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
