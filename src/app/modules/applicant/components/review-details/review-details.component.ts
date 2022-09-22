import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { constVal } from '../../config/constVal.obj';
import { ApplicantService } from '../../services/applicant.service';

@Component({
  selector: 'app-review-details',
  templateUrl: './review-details.component.html',
  styleUrls: ['./review-details.component.css']
})

export class ReviewDetailsComponent implements OnInit {
  insuranceForm: any;
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
  selectedPlanId: any;
  isSmoke: any;
  isAlcohol: any;
  isOther: any;
  reviewForm: any;

  constructor(
    private _router: Router,
    private _applicantService: ApplicantService,
    private fb: FormBuilder,
    private _toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this._applicantService.getApplicantData();
    this.initFormData();
    this.getInfo();
    this.checkInsuranceFor();
  }

  getJson() {
    this.isSuccess = constVal.staticincomingJson.isSuccess;
    this.responseValue = JSON.parse(constVal.staticincomingJson.responseValue);
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

  onRadioClick(val: any) {
    this.selectedPlanId = val;
  }

  onSubmit() {
    if (this.reviewForm.valid) {
      let obj = {
        CarrierName: this.availablePlans[this.selectedPlanId].CarrierName,
        MaximumCoverage: this.availablePlans[this.selectedPlanId].CarrierDetails.MaximumCoverage,
        MinimumCoverage: this.availablePlans[this.selectedPlanId].CarrierDetails.MinimumCoverage,
        Premium: this.availablePlans[this.selectedPlanId].CarrierDetails.Premium,
        Term: this.availablePlans[this.selectedPlanId].CarrierDetails.Term
      };
      this._applicantService.setValueToModel(obj);
      this._router.navigate(['/applicant/payment']);
    }
    else {
      this._toastr.error("Select plan")
    }
  }

  initFormData() {
    let data: any = sessionStorage.getItem('applicant');
    if (data) {
      this.applicant = JSON.parse(data);
      this.applicantData = this.applicant.applicantDetails
      this.applicantMedicalData = this.applicant.medicalDetails
    }
    this.reviewForm = this.fb.group({
      plan: ['', Validators.required]
    })
    this.getJson();
  }

  getInfo() {
    this.isSmoke = this._applicantService.applicant.medicalDetails.checkSmoke;
    this.isAlcohol = this._applicantService.applicant.medicalDetails.checkAlcohol;
    this.isOther = this._applicantService.applicant.medicalDetails.checkOtherInfo;
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
