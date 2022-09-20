import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Applicant } from '../models/applicant.model';

@Injectable({
  providedIn: 'root'
})
export class ApplicantService {
  constructor(private _toastr: ToastrService) { }

  public applicant : Applicant = new Applicant();

  getApplicantData() {
    let applicantData: any = sessionStorage.getItem('applicant');
    if (applicantData) {
      this.applicant= JSON.parse(applicantData);
    }
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
