import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignuphomeComponent } from './signuphome.component';

describe('SignuphomeComponent', () => {
  let component: SignuphomeComponent;
  let fixture: ComponentFixture<SignuphomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SignuphomeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SignuphomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
