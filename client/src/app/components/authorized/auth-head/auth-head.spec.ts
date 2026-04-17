import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthHead } from './auth-head';

describe('AuthHead', () => {
  let component: AuthHead;
  let fixture: ComponentFixture<AuthHead>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthHead]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthHead);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
