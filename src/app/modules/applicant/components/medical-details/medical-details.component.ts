import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApplicantService } from '../../services/applicant.service';

enum CheckBoxType {
  Applicant,
  Spouse,
  Other,
  None,
}

@Component({
  selector: 'app-medical-details',
  templateUrl: './medical-details.component.html',
  styleUrls: ['./medical-details.component.css'],
})
export class MedicalDetailsComponent implements OnInit {
  //variables
  check_box_type = CheckBoxType;
  currentlyChecked = CheckBoxType.None;
  applicantMedicalForm: any;
  isApplicantSelected: any;
  isSpouseSelected: any;
  isOtherSelected: any;

  //Boolean
  formSubmitted = false;
  isFUllName = false;
  isGender = false;
  isDOB = false;
  isAge = false;
  isSmoke = false;
  isAlcohol = false;
  isOtherInfo = false;

  constructor(
    private _formbuilder: FormBuilder,
    private _applicantService: ApplicantService,
    private _router: Router,
    private _toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this._applicantService.getApplicantData();
    this.onLoadSmokeCheck(this._applicantService.medicalData.Smoke);
    this.onLoadAlcoholCheck(this._applicantService.medicalData.Alcohol);
    this.onLoadOtherInfoCheck(this._applicantService.medicalData.OtherInfo);
    this.initMedicalFrom();
  }

  //Function
  initMedicalFrom() {
    this.applicantMedicalForm = this._formbuilder.group({
      checkApplicant: [this._applicantService.medicalData.checkApplicant],
      checkSpouse: [this._applicantService.medicalData.checkSpouse],
      checkOthers: [this._applicantService.medicalData.checkOthers],
      FullName: [this._applicantService.medicalData.FullName, Validators.required],
      Gender: [this._applicantService.medicalData.Gender, Validators.required],
      DateOfBirth: [this._applicantService.medicalData.DateOfBirth, Validators.required],
      Age: [this._applicantService.medicalData.Age, Validators.required],
      Smoke: [this._applicantService.medicalData.Smoke],
      Asthama: [this._applicantService.medicalData.Asthama],
      Alcohol: [this._applicantService.medicalData.Alcohol],
      OtherInfo: [this._applicantService.medicalData.OtherInfo],
      checkSmoke: [this._applicantService.medicalData.checkSmoke],
      checkAlcohol: [this._applicantService.medicalData.checkAlcohol],
      checkOtherInfo: [this._applicantService.medicalData.checkOtherInfo],
    });
  }

  selectCheckBox(targetType: CheckBoxType) {
    // If the checkbox was already checked, clear the currentlyChecked variable
    if (this.currentlyChecked === targetType) {
      this.currentlyChecked = CheckBoxType.None;
      return;
    }
    this.currentlyChecked = targetType;
  }

  medicalFormInfo(data: any) {
    if (this.applicantMedicalForm.valid) {
      this.formSubmitted = true;
      sessionStorage.setItem(
        'medicalData',
        JSON.stringify(data)
      );
      this._toastr.success("Data Saved");
    }
    else {
      this.formSubmitted = false;
    }
  }

  get f() {
    return this.applicantMedicalForm.controls;
  }

  //TextBoxInfo
  onApplicantCheck(event: any) {
    if (event.target.checked) {
      this.applicantMedicalForm.patchValue({
        FullName: this._applicantService.applicant.FullName,
        Gender: this._applicantService.applicant.Gender,
        DateOfBirth: this._applicantService.applicant.DateOfBirth,
        Age: this._applicantService.applicant.Age,
      });
      this.isApplicantSelected = true;
    } else {
      this.isApplicantSelected = null;
      this.initMedicalFrom();
    }
  }
  onSpouseCheck(event: any) {
    if (event.target.checked) {
      this.applicantMedicalForm.patchValue({
        FullName: this._applicantService.applicant.SpouseFullName,
        Gender: this._applicantService.applicant.SpouseGender,
        DateOfBirth: this._applicantService.applicant.SpouseDateOfBirth,
        Age: this._applicantService.applicant.SpouseAge,
      });
      this.isSpouseSelected = true;
    } else {
      this.isSpouseSelected = null;
      this.initMedicalFrom();
    }
  }
  onOtherCheck(event: any) {
    this.isOtherSelected = null;
    this.isSpouseSelected = null;
    this.isApplicantSelected = null;
    if (event.target.checked) {
      this.initMedicalFrom();
    }
  }

  //HealthInfoCheckBox OnCheck
  onCheck_Smoking(event: any) {
    let val = event.target.checked
    this.onLoadSmokeCheck(val)
  }
  onCheck_Alcohol(event: any) {
    let val = event.target.checked
    this.onLoadAlcoholCheck(val);
  }
  onCheck_OtherInfo(event: any) {
    let val = event.target.checked
    this.onLoadOtherInfoCheck(val)
  }


  //HealthInfoCheckBox OnLoad
  onLoadSmokeCheck(val:any){
    if (val) {
      this.isSmoke = true;
    }
    else {
      this.applicantMedicalForm.patchValue({
        Smoke: [''],
        Asthama: ['']
      })
      this.isSmoke = false;
    }
  }

  onLoadAlcoholCheck(val:any){
    if (val) {
      this.isAlcohol = true;
    }
    else {
      this.applicantMedicalForm.patchValue({
        Alcohol: [''],
      })
      this.isAlcohol = false;
    }
  }

  onLoadOtherInfoCheck(val:any){
    if (val) {
      this.isOtherInfo = true;
    }
    else {
      this.applicantMedicalForm.patchValue({
        OtherInfo: [''],
      })
      this.isOtherInfo = false;
    }
  }
}
