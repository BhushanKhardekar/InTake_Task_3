import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ApplicantDetails } from '../models/applicantDetails.model';
import { ApplicantMedicalDetails } from '../models/applicantMedicalDetails.model';

@Injectable({
  providedIn: 'root'
})
export class ApplicantService {
  constructor(private _toastr: ToastrService) { }

  public applicant: ApplicantDetails = new ApplicantDetails();
  public medicalData : ApplicantMedicalDetails = new ApplicantMedicalDetails();

  applicantData: any;
  userInfoFinal: any;

  getApplicantData() {
    let userData: any = sessionStorage.getItem('applicantData');
    if (userData) {
      this.applicant = JSON.parse(userData);
    }
    let userMedicalData: any = sessionStorage.getItem('medicalData');

    if (userMedicalData) {
      this.medicalData = JSON.parse(userMedicalData);
    }
    console.log(this.medicalData)
  }
}
