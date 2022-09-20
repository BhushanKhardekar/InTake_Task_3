import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicantContainerComponent } from './applicant-container.component';

describe('ApplicantContainerComponent', () => {
  let component: ApplicantContainerComponent;
  let fixture: ComponentFixture<ApplicantContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApplicantContainerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApplicantContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
