import { TestBed } from '@angular/core/testing';

import { SendFood } from './send-food';

describe('SendFood', () => {
  let service: SendFood;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SendFood);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
