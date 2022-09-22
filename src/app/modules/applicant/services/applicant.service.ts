import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Applicant } from '../models/applicant.model';

@Injectable({
  providedIn: 'root',
})
export class ApplicantService {
  maxDate: any;
  minDate: any;
  public applicant: Applicant = new Applicant();

  constructor(private _toastr: ToastrService, private router: Router) {
    this.futureDate();
  }

  futureDate() {
    var date: any = new Date();
    var today: any = date.getDate();
    var month: any = date.getMonth() + 1;
    var year: any = date.getFullYear();
    if (today < 10) {
      today = '0' + today;
    }
    if (month < 10) {
      month = '0' + month;
    }
    this.maxDate = year + '-' + month + '-' + today;
    this.minDate = '1900-01-01';
  }

  getApplicantData() {
    let applicantData: any = sessionStorage.getItem('applicant');
    if (applicantData) {
      this.applicant = JSON.parse(applicantData);
    }
  }

  setValueToModel(data?: any) {
    if (this.router.url.includes('applicant/applicant-details')) {
      this.applicant.applicantDetails = data;
    }
    if (this.router.url.includes('applicant/medical-details')) {
      this.applicant.medicalDetails = data;
    }
    if (this.router.url.includes('applicant/review-details')) {
      this.applicant.applicantPlan = data;
    }
    sessionStorage.setItem('applicant', JSON.stringify(this.applicant));
  }
}
