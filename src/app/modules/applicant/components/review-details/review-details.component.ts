import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApplicantService } from '../../services/applicant.service';

@Component({
  selector: 'app-review-details',
  templateUrl: './review-details.component.html',
  styleUrls: ['./review-details.component.css']
})
export class ReviewDetailsComponent implements OnInit {

  //Variables
  incomingJson = {
    "isSuccess": true,
    "responseValue": "{\"healthInsuranceDetails\":[{\"CarrierName\":\"Safeco\",\"IsAvailableInUS\":\"Yes\",\"IsAvailableInCA\":\"No\",\"CarrierDetails\":{\"Premium\":\"250.76\",\"Term\":\"6\",\"MinimumCoverage\":\"25000\",\"MaximumCoverage\":\"100000\"}},{\"CarrierName\":\"Travellers\",\"IsAvailableInUS\":\"No\",\"IsAvailableInCA\":\"No\",\"CarrierDetails\":{\"Premium\":\"456.76\",\"Term\":\"12\",\"MinimumCoverage\":\"25000\",\"MaximumCoverage\":\"300000\"}},{\"CarrierName\":\"Progressive\",\"IsAvailableInUS\":\"No\",\"IsAvailableInCA\":\"Yes\",\"CarrierDetails\":{\"Premium\":\"806.76\",\"Term\":\"12\",\"MinimumCoverage\":\"100000\",\"MaximumCoverage\":\"3000000\"}},{\"CarrierName\":\"Mercury\",\"IsAvailableInUS\":\"Yes\",\"IsAvailableInCA\":\"Yes\",\"CarrierDetails\":{\"Premium\":\"776.76\",\"Term\":\"12\",\"MinimumCoverage\":\"70000\",\"MaximumCoverage\":\"2000000\"}}]}"
  }

  countries = {
    US: 'United States',
    CN: 'Canada',
  };

  applicantReviewForm: any;
  isSuccess: any;
  responseValue: any;
  healthInsuranceDetails: any = {};
  applicantMedicalData: any;
  applicant: any;
  applicantData: any;
  checkApplicant: any;
  checkSpouse: any;
  checkOtherInfo: any;
  usPlans: any = [];
  caPlans: any = [];
  availablePlans: any = [];
  countrySelected: any;
  selectedPlanId:any;
  constructor(
    private _router: Router,
    private _applicantService: ApplicantService,
    private _toastr: ToastrService) { }

  ngOnInit(): void {
    this._applicantService.getApplicantData();
    this.initFormData();
    this.checkInsuranceFor();
  }

  getJson() {
    this.isSuccess = this.incomingJson.isSuccess;
    this.responseValue = JSON.parse(this.incomingJson.responseValue);
    this.healthInsuranceDetails = this.responseValue.healthInsuranceDetails;
    this.countrySelected = this._applicantService.applicant.applicantDetails.Country;

    for (let i = 0; i < this.healthInsuranceDetails.length; i++) {
      if (this.countrySelected == "US") {
        if (this.healthInsuranceDetails[i].IsAvailableInUS == 'Yes') {
          this.availablePlans.push(this.healthInsuranceDetails[i]);
        }
      }
      if (this.countrySelected == "CN") {
        if (this.healthInsuranceDetails[i].IsAvailableInCA == 'Yes') {
          this.availablePlans.push(this.healthInsuranceDetails[i]);
        }
      }
    }
  }

  onRadioClick(val:any){
    this.selectedPlanId=val;
  }

  onSubmit(){
    let obj={
      CarrierName :this.availablePlans[this.selectedPlanId].CarrierName,
      MaximumCoverage:this.availablePlans[this.selectedPlanId].CarrierDetails.MaximumCoverage,
      MinimumCoverage:this.availablePlans[this.selectedPlanId].CarrierDetails.MinimumCoverage,
      Premium:this.availablePlans[this.selectedPlanId].CarrierDetails.Premium,
      Term:this.availablePlans[this.selectedPlanId].CarrierDetails.Term
    };
    this._applicantService.setSessionStoragePlan(obj);
    this._toastr.success("Data Saved");
    this._router.navigate(['/payment']);

  }

  initFormData() {
    let data: any = sessionStorage.getItem('applicant');
    if (data) {
      this.applicant = JSON.parse(data);
      this.applicantData = this.applicant.applicantDetails
      this.applicantMedicalData = this.applicant.medicalDetails
    }
    this.getJson();
  }

  checkInsuranceFor() {
    if (this.applicantMedicalData.checkApplicant) {
      this.checkApplicant = true;
    }
    else if (this.applicantMedicalData.checkSpouse) {
      this.checkSpouse = true;
    }
    else if (this.applicantMedicalData.checkOtherInfo) {
      this.checkOtherInfo = true;
    }
    else {
      return;
    }
  }
}
