import { TestBed } from '@angular/core/testing';

import { Artificial } from './artificial';

describe('Artificial', () => {
  let service: Artificial;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Artificial);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
