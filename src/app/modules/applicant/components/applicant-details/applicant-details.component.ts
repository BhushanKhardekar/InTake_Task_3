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
    this.futureDate();
    this.initFormData();
    this.initApplicantForm();
  }
  initApplicantForm() {
    this.applicantBasicForm = this._formbuilder.group({
      FullName: [this._userService.applicant.FullName, Validators.required],
      PhoneNumber: [
        this._userService.applicant.PhoneNumber,
        Validators.required,
      ],
      Email: [
        this._userService.applicant.Email,
        [
          Validators.pattern('^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$'),
          Validators.required,
        ],
      ],
      Gender: [this._userService.applicant.Gender, Validators.required],
      DateOfBirth: [
        this._userService.applicant.DateOfBirth,
        Validators.required,
      ],
      Age: [this._userService.applicant.Age, Validators.required],
      MaritalStatus: [
        this._userService.applicant.MaritalStatus,
        Validators.required,
      ],
      SpouseFullName: [this._userService.applicant.SpouseFullName],
      SpouseGender: [this._userService.applicant.SpouseGender],
      SpouseDateOfBirth: [this._userService.applicant.SpouseDateOfBirth],
      SpouseAge: [this._userService.applicant.SpouseAge],
      StreetAddress: [
        this._userService.applicant.StreetAddress,
        Validators.required,
      ],
      City: [this._userService.applicant.City, Validators.required],
      State: [this._userService.applicant.State, Validators.required],
      ZipCode: [this._userService.applicant.ZipCode, Validators.required],
      Country: [this._userService.applicant.Country, Validators.required],
    });
    this.countryCode = this._userService.applicant.Country;
    this.applicantGender = this._userService.applicant.Gender;
    this.applicantAge = this._userService.applicant.Age;
    this.spouseAge = this._userService.applicant.SpouseAge;
    this.maaraige = this._userService.applicant.MaritalStatus;
    this.onCountryLoad(this.countryCode);
    this.onDateChnage(this._userService.applicant.DateOfBirth);
    this.isAdult();
    this.onMarriage();
    this.onSpouse(this._userService.applicant.SpouseDateOfBirth);
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
      sessionStorage.setItem('applicantData',JSON.stringify(this.applicantData));
      this._toastr.success("Data Saved");
      this._router.navigate(['/applicant/medical-details']);
    }
  }

  futureDate() {
    var date: any = new Date();
    var today: any = date.getDate();
    var month: any = date.getMonth();
    var year: any = date.getFullYear();
    if (today < 10) {
      today = '0' + today;
    }
    if (month < 10) {
      month = '0' + month;
    }
    this.maxDate = year + '-' + month + '-' + today;
    this.minDate = '1990-01-01';
  }

  //Event Functions
  ageCalculatorApplicant(event: any) {
    let age = event.target.value;
    if (age > this.minDate && age < this.maxDate) {
      this.onDateChnage(age);
    }
  }

  ageCalculatorSpouse(event: any) {
    let age = event.target.value;
    if (age > this.minDate && age < this.maxDate) {
      this.onSpouse(age);
    }
  }

  onDateChnage(age: any) {
    if (age) {
      const convertAge = new Date(age);
      const timeDiff = Math.abs(Date.now() - convertAge.getTime());
      this.applicantAge = Math.floor(timeDiff / (1000 * 3600 * 24) / 365);
      this.applicantBasicForm.patchValue({ Age: this.applicantAge });
      this.currentApplicantAge = true;
      this.isAdult();
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
      this.maxLen = 5;
    } else if (this.countryCode == 'CN') {
      this.states = this.cnStates;
      this.maxLen = 7;
    }
  }

  onKyePress(event: any) {
    if (this.countryCode == 'CN') {
      let patt = /[a-zA-Z0-9\s]+/;
      let result = patt.test(event.key);
      return result;
    } else {
      let patt = /[0-9/d]+/;
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
    let age = this.applicantAge;
    if (age >= 18 && this.applicantGender == 'F') {
      this.applicantAdult = true;
    } else if (age >= 21 && this.applicantGender == 'M') {
      this.applicantAdult = true;
    } else {
      this.applicantAdult = false;
    }
  }
}
