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
    this.getInfo();
    this.initFormData();
    this.checkInsuranceFor();
  }
  initFormData() {
    let data: any;
    this._applicantService.getApplicantData().subscribe((res:any) => {
      data = res.resultObject;
      if (data) {
        this.applicant = JSON.parse(data);
        this.applicantData = this.applicant.applicantDetails
        this.applicantMedicalData = this.applicant.medicalDetails
      }
    });

    this.reviewForm = this.fb.group({
      plan: ['', Validators.required]
    })
    this.getJson();
  }
  getJson() {
    this._applicantService.getAvailableList().subscribe((res:any)=>{
      let obj = res;
      this.responseValue = JSON.parse(res.responseValue);
        this.healthInsuranceDetails = this.responseValue.healthInsuranceDetails;
        this.countrySelected = this._applicantService.applicant.applicantDetails.country;

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
    });
  }

  onRadioClick(val: any) {
    this.selectedPlanId = val;
  }

  onSubmit() {
    if (this.reviewForm.valid) {
      let obj = {
        carrierName: this.availablePlans[this.selectedPlanId].CarrierName,
        maximumCoverage: this.availablePlans[this.selectedPlanId].CarrierDetails.MaximumCoverage,
        minimumCoverage: this.availablePlans[this.selectedPlanId].CarrierDetails.MinimumCoverage,
        premium: this.availablePlans[this.selectedPlanId].CarrierDetails.Premium,
        term: this.availablePlans[this.selectedPlanId].CarrierDetails.Term
      };
      this._applicantService.setValueToModel(obj).subscribe((res) => { });
      this._router.navigate(['/applicant/payment']);
    }
    else {
      this._toastr.error("Select plan")
    }
  }



  getInfo() {
    this.isSmoke = this._applicantService.applicant.medicalDetails.checkSmoke;
    this.isAlcohol = this._applicantService.applicant.medicalDetails.checkAlcohol;
    this.isOther = this._applicantService.applicant.medicalDetails.checkOtherInfo;
  }

  checkInsuranceFor() {
    if (this.applicantMedicalData?.checkApplicant) {
      this.checkApplicant = true;
    }
    else if (this.applicantMedicalData?.checkSpouse) {
      this.checkSpouse = true;
    }
    else if (this.applicantMedicalData?.checkOtherInfo) {
      this.checkOtherInfo = true;
    }
    else {
      return;
    }
  }
}
