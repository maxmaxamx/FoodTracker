import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TwoFA } from './two-fa';

describe('TwoFA', () => {
  let component: TwoFA;
  let fixture: ComponentFixture<TwoFA>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TwoFA]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TwoFA);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
