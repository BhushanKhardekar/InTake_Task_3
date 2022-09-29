import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApplicantService } from '../../services/applicant.service';
import { CheckBoxType } from '../../config/checkBoxType.enum';

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
  inComingData:any;
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
    private _toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.minDate = this._applicantService.minDate;
    this.maxDate = this._applicantService.maxDate;
    this.initMedicalFrom();
    this.onLoadCheckData();
  }
  getDataFromApi() {
    this._applicantService.getApplicantData().subscribe((res: any) => {
       let data = res.resultObject;
      if (res.isSucess) {
        this.inComingData = JSON.parse(data);
        this._applicantService.applicant= this.inComingData;
        this.initMedicalFrom();
      }
    });
  }
  //Function
  initMedicalFrom() {
    this.applicantMedicalForm = this._formbuilder.group({
      checkApplicant: [],
      checkSpouse: [],
      checkOthers: [],
      fullName: [this._applicantService.applicant.medicalDetails.fullName, Validators.required],
      gender: [this._applicantService.applicant.medicalDetails.gender, Validators.required],
      dateOfBirth: [this._applicantService.applicant.medicalDetails.dateOfBirth, Validators.required],
      age: [this._applicantService.applicant.medicalDetails.age, Validators.required],
      smokeText: [this._applicantService.applicant.medicalDetails.smokeText],
      asthamaText: [this._applicantService.applicant.medicalDetails.asthamaText],
      alcohol: [this._applicantService.applicant.medicalDetails.alcohol],
      otherInfo: [this._applicantService.applicant.medicalDetails.otherInfo],
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
    if (this._applicantService.applicant.applicantDetails.maritalStatus == 'Married') {
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
        this._applicantService.setValueToModel(data).subscribe((res)=>{

        });
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
      this.applicantMedicalForm.patchValue({ age: this.age });
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
      this.isApplicantSelected = true;
      this.applicantMedicalForm.patchValue({
        fullName: this._applicantService.applicant.applicantDetails.fullName,
        gender: this._applicantService.applicant.applicantDetails.gender,
        dateOfBirth: this._applicantService.applicant.applicantDetails.dateOfBirth,
        age: this._applicantService.applicant.applicantDetails.age,
      });
    }
    else {
      this.isApplicantSelected = null;
      this.defaultPatchForm();
    }
  }
  onloadSpouse(val: any) {
    if (val) {
      this.applicantMedicalForm.patchValue({
        fullName: this._applicantService.applicant.applicantDetails.spouseFullName,
        gender: this._applicantService.applicant.applicantDetails.spouseGender,
        dateOfBirth: this._applicantService.applicant.applicantDetails.spouseDateOfBirth,
        age: this._applicantService.applicant.applicantDetails.spouseAge,
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
      fullName: '',
      gender: '',
      dateOfBirth: '',
      age: ''
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
      this.applicantMedicalForm.controls['smokeText'].setValidators(Validators.required);
      this.applicantMedicalForm.controls['smokeText'].updateValueAndValidity();
      this.applicantMedicalForm.controls['asthamaText'].setValidators(Validators.required);
      this.applicantMedicalForm.controls['asthamaText'].updateValueAndValidity();
    }
    else {
      this.isSmoke = false;
      this.applicantMedicalForm.controls["smokeText"].setValue(null);
      this.applicantMedicalForm.controls["smokeText"].setValidators([Validators.nullValidator]);
      this.applicantMedicalForm.controls['smokeText'].updateValueAndValidity();
      this.applicantMedicalForm.controls["asthamaText"].setValue(null);
      this.applicantMedicalForm.controls["asthamaText"].setValidators([Validators.nullValidator]);
      this.applicantMedicalForm.controls['asthamaText'].updateValueAndValidity();

    }
  }
  onLoadAlcoholCheck(val: any) {
    if (val) {
      this.isAlcohol = true;
      this.applicantMedicalForm.controls['alcohol'].setValidators([Validators.required]);
      this.applicantMedicalForm.controls['alcohol'].updateValueAndValidity();
    }
    else {
      this.isAlcohol = false;
      this.applicantMedicalForm.controls["alcohol"].setValue(null);
      this.applicantMedicalForm.controls["alcohol"].setValidators([Validators.nullValidator]);
      this.applicantMedicalForm.controls['alcohol'].updateValueAndValidity();
    }
  }
  onLoadOtherInfoCheck(val: any) {
    if (val) {
      this.isOtherInfo = true;
      this.applicantMedicalForm.controls['otherInfo'].setValidators([Validators.required]);
      this.applicantMedicalForm.controls['otherInfo'].updateValueAndValidity();
    }
    else {
      this.isOtherInfo = false;
      this.applicantMedicalForm.controls["otherInfo"].setValue(null);
      this.applicantMedicalForm.controls["otherInfo"].setValidators([Validators.nullValidator]);
      this.applicantMedicalForm.controls['otherInfo'].updateValueAndValidity();
    }
  }
}
