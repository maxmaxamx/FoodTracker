import { TestBed } from '@angular/core/testing';

import { Fatsecret } from './fatsecret';

describe('Fatsecret', () => {
  let service: Fatsecret;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Fatsecret);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
