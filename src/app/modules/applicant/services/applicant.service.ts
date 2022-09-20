import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Applicant } from '../models/applicant.model';

@Injectable({
  providedIn: 'root'
})
export class ApplicantService {

  maxDate:any;
  minDate:any;

  constructor(private _toastr: ToastrService) {
    this.futureDate();
  }

  public applicant : Applicant = new Applicant();

  getApplicantData() {
    let applicantData: any = sessionStorage.getItem('applicant');
    if (applicantData) {
      this.applicant= JSON.parse(applicantData);
    }
  }
  futureDate() {
    var date: any = new Date();
    var today: any = date.getDate();
    var month: any = date.getMonth()+1;
    var year: any = date.getFullYear();
    if (today < 10) {
      today = '0' + today;
    }
    if (month < 10) {
      month = '0' + month;
    }
    this.maxDate = year + '-' + month + '-' + today;
    this.minDate = '1990-01-01';
  }

  setSessionStorageApplicant(data:any){
    this.applicant.applicantDetails= data;
    sessionStorage.setItem('applicant', JSON.stringify(this.applicant));
  }
  setSessionStorageMedical(data:any){
    this.applicant.medicalDetails= data;
    sessionStorage.setItem('applicant', JSON.stringify(this.applicant));
  }
  setSessionStoragePlan(data:any){
    this.applicant.applicantPlan= data;
    sessionStorage.setItem('applicant', JSON.stringify(this.applicant));
  }
}
