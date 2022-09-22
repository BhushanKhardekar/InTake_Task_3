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
  checkBoxApplicant: any;
  checkBoxSpouse: any;
  checkBoxOthers: any;
  checkBoxSmoke: any;
  checkBoxAlcohol: any;
  checkBoxOtherInfo: any;
  age: any;
  currentAge: any;
  minDate: any;
  maxDate: any;


  //Boolean
  formSubmitted = false;
  isFUllName = false;
  isGender = false;
  isDOB = false;
  isAge = false;
  isSmoke = false;
  isAlcohol = false;
  isOtherInfo = false;
  isMarried = false;
  checkBoxGroup = false;

  constructor(
    private _formbuilder: FormBuilder,
    private _applicantService: ApplicantService,
    private _router: Router,
    private _toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.minDate = this._applicantService.minDate;
    this.maxDate = this._applicantService.maxDate;
    this._applicantService.getApplicantData();
    this.initMedicalFrom();
    this.onLoadCheckData();

  }

  //Function
  initMedicalFrom() {
    this.applicantMedicalForm = this._formbuilder.group({
      checkApplicant: [],
      checkSpouse: [],
      checkOthers: [],
      FullName: [this._applicantService.applicant.medicalDetails.FullName, Validators.required],
      Gender: [this._applicantService.applicant.medicalDetails.Gender, Validators.required],
      DateOfBirth: [this._applicantService.applicant.medicalDetails.DateOfBirth, Validators.required],
      Age: [this._applicantService.applicant.medicalDetails.Age, Validators.required],
      SmokeText: [this._applicantService.applicant.medicalDetails.SmokeText],
      AsthamaText: [this._applicantService.applicant.medicalDetails.AsthamaText],
      Alcohol: [this._applicantService.applicant.medicalDetails.Alcohol],
      OtherInfo: [this._applicantService.applicant.medicalDetails.OtherInfo],
      checkSmoke: [this._applicantService.applicant.medicalDetails.checkSmoke],
      checkAlcohol: [this._applicantService.applicant.medicalDetails.checkAlcohol],
      checkOtherInfo: [this._applicantService.applicant.medicalDetails.checkOtherInfo]
    });
    this.checkBoxSmoke = this._applicantService.applicant.medicalDetails.checkSmoke;
    this.checkBoxAlcohol = this._applicantService.applicant.medicalDetails.checkAlcohol;
    this.checkBoxOtherInfo = this._applicantService.applicant.medicalDetails.checkOtherInfo;
  }

  onLoadCheckData() {
    this.onLoadSmokeCheck(this.checkBoxSmoke);
    this.onLoadAlcoholCheck(this.checkBoxAlcohol);
    this.onLoadOtherInfoCheck(this.checkBoxOtherInfo);
    if (this._applicantService.applicant.applicantDetails.MaritalStatus == 'Married') {
      this.isMarried = true;
    }
    else {
      this.isMarried = false;
    }
  }

  selectCheckBox(targetType: CheckBoxType) {
    if (this.currentlyChecked === targetType) {
      this.currentlyChecked = CheckBoxType.None;
      return;
    }
    this.currentlyChecked = targetType;
  }

  medicalFormInfo(data: any) {
    this.formSubmitted = true;
    this.checkBoxGroup = true;
    if (this.isSmoke || this.isAlcohol || this.isOtherInfo) {
      if (this.applicantMedicalForm.valid) {
        this._applicantService.setValueToModel(data)
        this._toastr.success("Data Saved");
        this._router.navigate(['/applicant/review-details']);
      }
      else {
        this._toastr.error('Fill all details');
      }
    }
    else {

      this._toastr.error('Fill all details');
    }
  }

  ageCalculatorApplicant(event: any) {
    let age = event.target.value;
    if (age > this.minDate && age < this.maxDate) {
      this.onApplicant(age);
    }
  }
  onApplicant(age: any) {
    if (age) {
      const convertAge = new Date(age);
      const timeDiff = Math.abs(Date.now() - convertAge.getTime());
      this.age = Math.floor(timeDiff / (1000 * 3600 * 24) / 365);
      this.applicantMedicalForm.patchValue({ Age: this.age });
      this.currentAge = true;
    } else {
      return;
    }
  }

  get f() {
    return this.applicantMedicalForm.controls;
  }

  //TextBoxInfo
  onApplicantCheck(event: any) {
    let val = event.target.checked;
    this.onLoadApplicant(val);
  }
  onSpouseCheck(event: any) {
    let val = event.target.checked;
    this.onloadSpouse(val);
  }
  onOtherCheck(event: any) {
    let val = event.target.checked
    this.onLoadOther(val);
  }

  //OnloadCheckBox
  onLoadApplicant(val: any) {
    if (val) {
      this.applicantMedicalForm.patchValue({
        FullName: this._applicantService.applicant.applicantDetails.FullName,
        Gender: this._applicantService.applicant.applicantDetails.Gender,
        DateOfBirth: this._applicantService.applicant.applicantDetails.DateOfBirth,
        Age: this._applicantService.applicant.applicantDetails.Age,
      });
      this.isApplicantSelected = true;
    }
    else {
      this.isApplicantSelected = null;
      this.defaultPatchForm();
    }
  }
  onloadSpouse(val: any) {
    if (val) {
      this.applicantMedicalForm.patchValue({
        FullName: this._applicantService.applicant.applicantDetails.SpouseFullName,
        Gender: this._applicantService.applicant.applicantDetails.SpouseGender,
        DateOfBirth: this._applicantService.applicant.applicantDetails.SpouseDateOfBirth,
        Age: this._applicantService.applicant.applicantDetails.SpouseAge,
      });
      this.isSpouseSelected = true;
    } else {
      this.isSpouseSelected = null;
      this.defaultPatchForm();
    }
  }
  onLoadOther(val: any) {
    if (val) {
      this.isSpouseSelected = null;
      this.isApplicantSelected = null;
      this.isOtherSelected = null;
      this.defaultPatchForm();
    }
  }
  defaultPatchForm() {
    this.applicantMedicalForm.patchValue({
      FullName: '',
      Gender: '',
      DateOfBirth: '',
      Age: ''
    });
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
  onLoadSmokeCheck(val: any) {
    if (val) {
      this.isSmoke = true;
      this.applicantMedicalForm.controls['SmokeText'].setValidators(Validators.required);
      this.applicantMedicalForm.controls['SmokeText'].updateValueAndValidity();
      this.applicantMedicalForm.controls['AsthamaText'].setValidators(Validators.required);
      this.applicantMedicalForm.controls['AsthamaText'].updateValueAndValidity();
    }
    else {
      this.isSmoke = false;
      this.applicantMedicalForm.controls["SmokeText"].setValue(null);
      this.applicantMedicalForm.controls["SmokeText"].setValidators([Validators.nullValidator]);
      this.applicantMedicalForm.controls['SmokeText'].updateValueAndValidity();
      this.applicantMedicalForm.controls["AsthamaText"].setValue(null);
      this.applicantMedicalForm.controls["AsthamaText"].setValidators([Validators.nullValidator]);
      this.applicantMedicalForm.controls['AsthamaText'].updateValueAndValidity();

    }
  }
  onLoadAlcoholCheck(val: any) {
    if (val) {
      this.isAlcohol = true;
      this.applicantMedicalForm.controls['Alcohol'].setValidators([Validators.required]);
      this.applicantMedicalForm.controls['Alcohol'].updateValueAndValidity();
    }
    else {
      this.isAlcohol = false;
      this.applicantMedicalForm.controls["Alcohol"].setValue(null);
      this.applicantMedicalForm.controls["Alcohol"].setValidators([Validators.nullValidator]);
      this.applicantMedicalForm.controls['Alcohol'].updateValueAndValidity();
    }
  }
  onLoadOtherInfoCheck(val: any) {
    if (val) {
      this.isOtherInfo = true;
      this.applicantMedicalForm.controls['OtherInfo'].setValidators([Validators.required]);
      this.applicantMedicalForm.controls['OtherInfo'].updateValueAndValidity();
    }
    else {
      this.isOtherInfo = false;
      this.applicantMedicalForm.controls["OtherInfo"].setValue(null);
      this.applicantMedicalForm.controls["OtherInfo"].setValidators([Validators.nullValidator]);
      this.applicantMedicalForm.controls['OtherInfo'].updateValueAndValidity();
    }
  }
}
