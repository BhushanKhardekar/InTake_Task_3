import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ApplicantService } from '../../services/applicant.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { constVal } from '../../config/constVal.obj';

@Component({
  selector: 'app-applicant-details',
  templateUrl: './applicant-details.component.html',
  styleUrls: ['./applicant-details.component.css'],
})
export class ApplicantDetailsComponent implements OnInit {
  //Variables
  applicantBasicForm: any;
  applicantAge: any;
  applicantData: any;
  spouseAge: any;
  age: any;
  code: any;
  states: any;
  maxLen: any;
  minLen: any;
  minDate: any;
  maxDate: any;
  countryCode: any;
  applicantGender: any;
  marriage: any;

  fieldReadOnly = false;
  currentApplicantAge = false;
  currentSpouseAge = false;
  applicantAdult = false;
  isDisabled = true;
  marriedStatus = false;
  formSubmitted = false;
  invalidApplicantAge = false;
  invalidSpouseAge = false;
  checkBoxGroup = false;

  countries: any = constVal.countries;
  genders: any = constVal.genders;
  usStates: any = constVal.usStates;
  cnStates: any = constVal.cnStates;

  //Functions
  constructor(
    private _formbuilder: FormBuilder,
    private _router: Router,
    private _userService: ApplicantService,
    private _toastr: ToastrService,
  ) { }



  ngOnInit(): void {
    this.minDate = this._userService.minDate;
    this.maxDate = this._userService.maxDate;
    this.initFormData();
    this.initApplicantForm();
  }
  initApplicantForm() {
    this.applicantBasicForm = this._formbuilder.group({
      FullName: [this._userService.applicant.applicantDetails.FullName, Validators.required],
      PhoneNumber: [this._userService.applicant.applicantDetails.PhoneNumber, Validators.required],
      Email: [this._userService.applicant.applicantDetails.Email, [Validators.pattern('^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$'), Validators.required],],
      Gender: [this._userService.applicant.applicantDetails.Gender, Validators.required],
      DateOfBirth: [this._userService.applicant.applicantDetails.DateOfBirth, Validators.required],
      Age: [''],
      MaritalStatus: [this._userService.applicant.applicantDetails.MaritalStatus],
      SpouseFullName: [this._userService.applicant.applicantDetails.SpouseFullName],
      SpouseGender: [this._userService.applicant.applicantDetails.SpouseGender],
      SpouseDateOfBirth: [this._userService.applicant.applicantDetails.SpouseDateOfBirth],
      SpouseAge: [''],
      StreetAddress: [this._userService.applicant.applicantDetails.StreetAddress, Validators.required],
      City: [this._userService.applicant.applicantDetails.City, Validators.required],
      State: [this._userService.applicant.applicantDetails.State, Validators.required],
      ZipCode: [this._userService.applicant.applicantDetails.ZipCode, Validators.required],
      Country: [this._userService.applicant.applicantDetails.Country, Validators.required],
    });
    this.countryCode = this._userService.applicant.applicantDetails.Country;
    this.applicantGender = this._userService.applicant.applicantDetails.Gender;
    this.applicantAge = this._userService.applicant.applicantDetails.Age;
    this.spouseAge = this._userService.applicant.applicantDetails.SpouseAge;
    this.marriage = this._userService.applicant.applicantDetails.MaritalStatus;
    this.onCountryLoad(this.countryCode);
    this.onApplicant(this._userService.applicant.applicantDetails.DateOfBirth);
    this.onSpouse(this._userService.applicant.applicantDetails.SpouseDateOfBirth);
    this.onMarriage(this._userService.applicant.applicantDetails.MaritalStatus);
  }

  initFormData() {
    this._userService.getApplicantData();
  }

  get f() {
    return this.applicantBasicForm.controls;
  }

  applicantFormInfo(applicantData: any) {
    this.formSubmitted = true;
    if (this.applicantBasicForm.valid) {
      this.applicantData = applicantData;
      this._userService.setValueToModel(this.applicantData);
      this._toastr.success("Data Saved");
      this._router.navigate(['/applicant/medical-details']);
    }
    else {
      this._toastr.error('Fill all details');
    }
  }

  //Event Functions
  ageCalculatorApplicant(event: any) {
    let age = event.target.value;
    this.onApplicant(age);
  }

  ageCalculatorSpouse(event: any) {
    let age = event.target.value;
    this.onSpouse(age);
  }

  onApplicant(age: any) {
    if (age) {
      if (age > this.minDate && age < this.maxDate) {
        const convertAge = new Date(age);
        const timeDiff = Math.abs(Date.now() - convertAge.getTime());
        this.applicantAge = Math.floor(timeDiff / (1000 * 3600 * 24) / 365);
        this.applicantBasicForm.patchValue({ Age: this.applicantAge });
        this.currentApplicantAge = true;
      } else {
        return;
      }
    }
    this.isAdult();
  }

  onSpouse(age: any) {
    if (age) {
      if (age > this.minDate && age < this.maxDate) {
        const convertAge = new Date(age);
        const timeDiff = Math.abs(Date.now() - convertAge.getTime());
        this.spouseAge = Math.floor(timeDiff / (1000 * 3600 * 24) / 365);
        this.applicantBasicForm.patchValue({ SpouseAge: this.spouseAge });
        this.currentSpouseAge = true;
      }
    }
  }

  onChange(event: any) {
    this.marriage = event.target.value;
    this.onMarriage(this.marriage);
    this.spouseSetNull();
  }
  onMarriage(val: any) {
    if (val == 'Married') {
      this.marriedStatus = true;
      this.applicantBasicForm.controls['SpouseFullName'].setValidators([Validators.required]);
      this.applicantBasicForm.controls['SpouseFullName'].updateValueAndValidity();
      this.applicantBasicForm.controls['SpouseGender'].setValidators([Validators.required]);
      this.applicantBasicForm.controls['SpouseGender'].updateValueAndValidity();
      this.applicantBasicForm.controls['SpouseDateOfBirth'].setValidators([Validators.required]);
      this.applicantBasicForm.controls['SpouseDateOfBirth'].updateValueAndValidity();
      this.applicantBasicForm.controls['SpouseAge'].setValidators([Validators.required]);
      this.applicantBasicForm.controls['SpouseAge'].updateValueAndValidity();
    } else if (val == 'Unmarried') {
      this.marriedStatus = false;
    }
    else {
      this.marriedStatus = false;
    }
  }
  onCountry(event: any) {
    this.countryCode = event.target.value;
    this.onCountryLoad(this.countryCode);
  }
  onCountryLoad(val: any) {
    this.countryCode = val;
    if (this.countryCode == 'US') {
      this.states = this.usStates;
      this.maxLen = this.minLen = 5;
    } else if (this.countryCode == 'CN') {
      this.states = this.cnStates;
      this.maxLen = this.minLen = 7;
    }
  }

  onKeyPress(event: any) {
    if (this.countryCode == 'CN') {
      let patt = /[a-zA-Z0-9\s]+/;
      let result = patt.test(event.key);
      return result;
    } else if (this.countryCode == 'US') {
      let patt = /^([0-9])$/;
      let result = patt.test(event.key);
      return result;
    }
    else {
      return;
    }
  }

  numericOnly(event: any): boolean {
    let patt = /^([0-9])$/;
    let result = patt.test(event.key);
    return result;
  }

  onGengerChnage(event: any) {
    this.applicantGender = event.target.value;
    this.marriedStatus = false;
    this.applicantBasicForm.controls["DateOfBirth"].setValue(null);
    this.applicantBasicForm.controls["Age"].setValue(null);
    this.applicantBasicForm.controls["MaritalStatus"].setValue(null);
    this.spouseSetNull();
    this.isAdult();
  }

  //Boolean Functions
  isAdult() {
    if (this.applicantAge >= 21 && this.applicantGender == 'Male') {
      this.applicantAdult = true;
      this.applicantBasicForm.controls['MaritalStatus'].setValidators([Validators.required]);
      this.applicantBasicForm.controls['MaritalStatus'].updateValueAndValidity();
    } else if (this.applicantAge >= 18 && this.applicantGender == 'Female') {
      this.applicantAdult = true;
      this.applicantBasicForm.controls['MaritalStatus'].setValidators([Validators.required]);
      this.applicantBasicForm.controls['MaritalStatus'].updateValueAndValidity();
    } else {
      this.applicantAdult = false;
      this.applicantBasicForm.controls['MaritalStatus'].setValidators([Validators.nullValidator]);
      this.applicantBasicForm.controls['MaritalStatus'].updateValueAndValidity();
    }
  }

  spouseSetNull() {
    this.applicantBasicForm.controls['SpouseFullName'].setValue(null);
    this.applicantBasicForm.controls['SpouseFullName'].setValidators([Validators.nullValidator]);
    this.applicantBasicForm.controls['SpouseGender'].setValue(null);
    this.applicantBasicForm.controls['SpouseGender'].setValidators([Validators.nullValidator]);
    this.applicantBasicForm.controls['SpouseDateOfBirth'].setValue(null);
    this.applicantBasicForm.controls['SpouseDateOfBirth'].setValidators([Validators.nullValidator]);
    this.applicantBasicForm.controls['SpouseAge'].setValidators.setValue(null);
    this.applicantBasicForm.controls['SpouseAge'].setValidators([Validators.nullValidator]);
  }
}
