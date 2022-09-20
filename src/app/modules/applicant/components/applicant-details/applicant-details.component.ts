import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ApplicantService } from '../../services/applicant.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

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
  maaraige: any;

  currentApplicantAge = false;
  currentSpouseAge = false;
  applicantAdult = false;
  isDisabled = true;
  marriedStatus = false;
  formSubmitted = false;
  invalidApplicantAge = false;
  invalidSpouseAge = false;

  //Arrays
  countries = {
    US: 'United States',
    CN: 'Canada',
  };

  genders = {
    Male: 'Male',
    Female: 'Female',
  };

  usStates = {
    NY: 'New York',
    OR: 'Oregon',
    CO: 'Colorado',
    SC: 'South Carolina',
    MS: 'Mississippi',
  };

  cnStates = {
    NB: 'New Brunswick',
    QC: 'Quebec',
    ON: 'Ontario',
    MB: 'South Manitoba',
  };

  //Functions
  constructor(
    private _formbuilder: FormBuilder,
    private _router: Router,
    private _userService: ApplicantService,
    private _toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.initFormData();
    this.initApplicantForm();
    this.minDate = this._userService.minDate;
    this.maxDate = this._userService.maxDate;
  }
  initApplicantForm() {
    this.applicantBasicForm = this._formbuilder.group({
      FullName: [this._userService.applicant.applicantDetails.FullName, Validators.required],
      PhoneNumber: [this._userService.applicant.applicantDetails.PhoneNumber,Validators.required],
      Email: [this._userService.applicant.applicantDetails.Email,[Validators.pattern('^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$'),Validators.required],],
      Gender: [this._userService.applicant.applicantDetails.Gender, Validators.required],
      DateOfBirth: [this._userService.applicant.applicantDetails.DateOfBirth,Validators.required],
      Age: [this._userService.applicant.applicantDetails.Age, Validators.required],
      MaritalStatus: [this._userService.applicant.applicantDetails.MaritalStatus, Validators.required],
      SpouseFullName: [this._userService.applicant.applicantDetails.SpouseFullName],
      SpouseGender: [this._userService.applicant.applicantDetails.SpouseGender],
      SpouseDateOfBirth: [this._userService.applicant.applicantDetails.SpouseDateOfBirth],
      SpouseAge: [this._userService.applicant.applicantDetails.SpouseAge],
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
    this.maaraige = this._userService.applicant.applicantDetails.MaritalStatus;
    this.onCountryLoad(this.countryCode);
    this.onApplicant(this._userService.applicant.applicantDetails.DateOfBirth);
    this.onSpouse(this._userService.applicant.applicantDetails.SpouseDateOfBirth);
    this.isAdult();
    this.onMarriage();
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
      this._userService.setSessionStorageApplicant(this.applicantData);
      this._toastr.success("Data Saved");
      //   this._router.navigate(['/applicant/medical-details']);
    }
    else {
      this._toastr.error('Fill all details');
    }
  }

  //Event Functions
  ageCalculatorApplicant(event: any) {
    let age = event.target.value;
    if (age > this.minDate && age < this.maxDate) {
      this.onApplicant(age);
    }
    this.isAdult();
  }

  ageCalculatorSpouse(event: any) {
    let age = event.target.value;
    if (age > this.minDate && age < this.maxDate) {
      this.onSpouse(age);
    }
  }

  onApplicant(age: any) {
    if (age) {
      const convertAge = new Date(age);
      const timeDiff = Math.abs(Date.now() - convertAge.getTime());
      this.applicantAge = Math.floor(timeDiff / (1000 * 3600 * 24) / 365);
      this.applicantBasicForm.patchValue({ Age: this.applicantAge });
      this.currentApplicantAge = true;
    } else {
      return;
    }
  }

  onSpouse(age: any) {
    if (age) {
      const convertAge = new Date(age);
      const timeDiff = Math.abs(Date.now() - convertAge.getTime());
      this.spouseAge = Math.floor(timeDiff / (1000 * 3600 * 24) / 365);
      this.applicantBasicForm.patchValue({ SpouseAge: this.spouseAge });
      this.currentSpouseAge = true;
    }
  }

  onChange(event: any) {
    this.maaraige = event.target.value;
    this.onMarriage();
    this.applicantBasicForm.patchValue({
      SpouseFullName: '',
      SpouseGender: '',
      SpouseDateOfBirth: '',
      SpouseAge: ''
    })
  }

  onMarriage() {
    if (this.maaraige == 'Married') {
      this.marriedStatus = true;
    } else if (this.maaraige == 'Unmarried') {
      this.marriedStatus = false;
    } else {
      this.marriedStatus = false;
    }
  }
  onCountry(event: any) {
    this.countryCode = event.target.value;
    this.onCountryLoad(this.countryCode);
  }
  onCountryLoad(event: any) {
    this.countryCode = event;
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
    } else {
      let patt = /^([0-9])$/;
      let result = patt.test(event.key);
      return result;
    }
  }

  numericOnly(event: any): boolean {
    let patt = /^([0-9])$/;
    let result = patt.test(event.key);
    return result;
  }

  onGengerChnage(event: any) {
    this.applicantGender = event.target.value;
    this.applicantBasicForm
      .patchValue({
        DateOfBirth: '',
        Age: '',
        MaritalStatus: '',
        SpouseFullName: '',
        SpouseGender: '',
        SpouseDateOfBirth: '',
        SpouseAge: '',
      });
    this.isAdult();
  }

  //Boolean Functions
  isAdult() {
    if (this.applicantAge >= 21 && this.applicantGender == 'Male') {
      this.applicantAdult = true;
    } else if (this.applicantAge >= 18 && this.applicantGender == 'Female') {
      this.applicantAdult = true;
    } else {
      this.applicantAdult = false;
    }
  }
}
