import { TestBed } from '@angular/core/testing';

import { LoadPatient } from './load-patient';

describe('LoadPatient', () => {
  let service: LoadPatient;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoadPatient);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
