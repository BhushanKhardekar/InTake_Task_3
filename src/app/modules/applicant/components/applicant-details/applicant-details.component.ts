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
  inComingData: any;
  applicantBasicForm: any;
  applicantChildForm: any;
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
  childArraySize: any;
  childArray: any = [];

  fieldReadOnly = false;
  applicantChildAge = false;
  currentApplicantAge = false;
  currentSpouseAge = false;
  applicantAdult = false;
  isDisabled = true;
  marriedStatus = false;
  formSubmitted = false;
  invalidApplicantAge = false;
  invalidSpouseAge = false;
  checkBoxGroup = false;
  isChild = false;
  isAddChild = false;

  countries: any = constVal.countries;
  genders: any = constVal.genders;
  usStates: any = constVal.usStates;
  cnStates: any = constVal.cnStates;

  //Functions
  constructor(
    private _formbuilder: FormBuilder,
    private _router: Router,
    private _userService: ApplicantService,
    private _toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.initApplicantForm();
    this.getDataFromApi();
    this.minDate = this._userService.minDate;
    this.maxDate = this._userService.maxDate;
  }

  getDataFromApi() {
    this._userService.getApplicantData().subscribe((res: any) => {
      let data = res.resultObject;
      if (res.isSucess) {
        this.inComingData = JSON.parse(data);
        this._userService.applicant = this.inComingData;
        this.initApplicantForm();
      }
    });
  }

  initApplicantForm() {
    this.applicantBasicForm = this._formbuilder.group({
      fullName: [
        this._userService.applicant.applicantDetails.fullName,
        Validators.required,
      ],
      phoneNumber: [
        this._userService.applicant.applicantDetails.phoneNumber,
        Validators.required,
      ],
      email: [
        this._userService.applicant.applicantDetails.email,
        [
          Validators.pattern('^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$'),
          Validators.required,
        ],
      ],
      gender: [
        this._userService.applicant.applicantDetails.gender,
        Validators.required,
      ],
      dateOfBirth: [
        this._userService.applicant.applicantDetails.dateOfBirth,
        Validators.required,
      ],
      age: [''],
      maritalStatus: [
        this._userService.applicant.applicantDetails.maritalStatus,
      ],
      spouseFullName: [
        this._userService.applicant.applicantDetails.spouseFullName,
      ],
      spouseGender: [this._userService.applicant.applicantDetails.spouseGender],
      spouseDateOfBirth: [
        this._userService.applicant.applicantDetails.spouseDateOfBirth,
      ],
      spouseAge: [''],
      numberOfChild: [
        this._userService.applicant.applicantDetails.numberOfChild,
      ],
      children: [''],
      streetAddress: [
        this._userService.applicant.applicantDetails.streetAddress,
        Validators.required,
      ],
      city: [
        this._userService.applicant.applicantDetails.city,
        Validators.required,
      ],
      state: [
        this._userService.applicant.applicantDetails.state,
        Validators.required,
      ],
      zipCode: [
        this._userService.applicant.applicantDetails.zipCode,
        Validators.required,
      ],
      country: [
        this._userService.applicant.applicantDetails.country,
        Validators.required,
      ],
    });
    this.childArray = this._userService.applicant.applicantDetails.children;

    this.applicantChildForm = this._formbuilder.group({
      childFullName: [''],
      childGender: [''],
      childDateOfBirth: [''],
      childAge: [''],
    });
    this.dataLoad();
  }

  dataLoad() {
    this.countryCode = this._userService.applicant.applicantDetails.country;
    this.applicantGender = this._userService.applicant.applicantDetails.gender;
    this.applicantAge = this._userService.applicant.applicantDetails.age;
    this.spouseAge = this._userService.applicant.applicantDetails.spouseAge;
    this.marriage = this._userService.applicant.applicantDetails.maritalStatus;
    this.onCountryLoad(this.countryCode);
    this.onApplicant(this._userService.applicant.applicantDetails.dateOfBirth);
    this.onSpouse(
      this._userService.applicant.applicantDetails.spouseDateOfBirth
    );
    this.onMarriage(this._userService.applicant.applicantDetails.maritalStatus);
    this.childArraySize =
      this._userService.applicant.applicantDetails.numberOfChild;
  }

  get f() {
    return this.applicantBasicForm.controls;
  }

  //ChildInfo
  onChangeChild(event: any) {
    this.childArraySize = event.target.value;
    this.childArray = [];
    if (this.childArraySize > 0) {
      this.isAddChild = true;
      this.applicantChildForm.controls['childFullName'].setValidators(
        Validators.required
      );
      this.applicantChildForm.controls[
        'childFullName'
      ].updateValueAndValidity();
      this.applicantChildForm.controls['childDateOfBirth'].setValidators(
        Validators.required
      );
      this.applicantChildForm.controls[
        'childDateOfBirth'
      ].updateValueAndValidity();
      this.applicantChildForm.controls['childGender'].setValidators(
        Validators.required
      );
      this.applicantChildForm.controls['childGender'].updateValueAndValidity();
      this.applicantChildForm.controls['childAge'].setValidators(
        Validators.required
      );
      this.applicantChildForm.controls['childAge'].updateValueAndValidity();
    } else {
      this.isAddChild = false;
      this.isChild = false;
      this.childNull();
    }
  }
  onAddChild() {
    this.isChild = true;
  }
  editChild(val: any) {
    console.log(this.childArray[val]);
    this.isChild = true;
    this.applicantChildAge = true;
    this.applicantChildForm.patchValue({
      childFullName: this.childArray[val].childFullName,
      childGender: this.childArray[val].childGender,
      childAge: this.childArray[val].childAge,
      childDateOfBirth: this.childArray[val].childDateOfBirth
    });
    this.childArray.splice(val, 1);
  }
  deleteChild(val: any) {
    this.childArray.splice(val, 1);
  }
  onAddChildCancel() {
    this.isChild = false;
  }
  onSaveChild(data: any) {
    if (
      this.applicantChildForm.valid ||
      this.childArray.size == this.childArraySize
    ) {
      this.childArray.push(data);
      this.childArraySize = this.childArraySize - 1;
      this.applicantBasicForm.controls['children'].setValue(this.childArray);
      this.childNull();
      this.isChild = false;
    } else {
      this._toastr.error('Please fill Correct Details');
    }
  }


  //ApplicantInfo
  applicantFormInfo(applicantData: any) {
    this.formSubmitted = true;
    if (this.applicantBasicForm.valid && (this.childArray.size == this.childArraySize)) {
      this.applicantData = applicantData;
      this._userService.setValueToModel(this.applicantData).subscribe((res) => {
        this._toastr.success('Data Saved');
        this._router.navigate(['/applicant/medical-details']);
      });
    } else {
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

  ageCalculatorChild(event: any) {
    let age = event.target.value;
    this.ageCalculator(age);
  }

  ageCalculator(age: any) {
    if (age) {
      if (age > this.minDate && age < this.maxDate) {
        const convertAge = new Date(age);
        const timeDiff = Math.abs(Date.now() - convertAge.getTime());
        let applicantChildAge = Math.floor(timeDiff / (1000 * 3600 * 24) / 365);
        this.applicantChildForm.patchValue({ childAge: applicantChildAge });
        this.applicantChildAge = true;
      } else {
        return;
      }
    }
  }

  onApplicant(age: any) {
    if (age) {
      if (age > this.minDate && age < this.maxDate) {
        const convertAge = new Date(age);
        const timeDiff = Math.abs(Date.now() - convertAge.getTime());
        this.applicantAge = Math.floor(timeDiff / (1000 * 3600 * 24) / 365);
        this.applicantBasicForm.patchValue({ age: this.applicantAge });
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
        this.applicantBasicForm.patchValue({ spouseAge: this.spouseAge });
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
      this.applicantBasicForm.controls['spouseFullName'].setValidators([
        Validators.required,
      ]);
      this.applicantBasicForm.controls[
        'spouseFullName'
      ].updateValueAndValidity();
      this.applicantBasicForm.controls['spouseGender'].setValidators([
        Validators.required,
      ]);
      this.applicantBasicForm.controls['spouseGender'].updateValueAndValidity();
      this.applicantBasicForm.controls['spouseDateOfBirth'].setValidators([
        Validators.required,
      ]);
      this.applicantBasicForm.controls[
        'spouseDateOfBirth'
      ].updateValueAndValidity();
      this.applicantBasicForm.controls['spouseAge'].setValidators([
        Validators.required,
      ]);
      this.applicantBasicForm.controls['spouseAge'].updateValueAndValidity();
      this.applicantBasicForm.controls['numberOfChild'].setValidators([
        Validators.required,
      ]);
      this.applicantBasicForm.controls[
        'numberOfChild'
      ].updateValueAndValidity();
    } else if (val == 'Unmarried') {
      this.marriedStatus = false;
      this.spouseSetNull();
    } else {
      this.marriedStatus = false;
      this.spouseSetNull();
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
    } else {
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
    this.applicantBasicForm.controls['dateOfBirth'].setValue(null);
    this.applicantBasicForm.controls['age'].setValue(null);
    this.applicantBasicForm.controls['maritalStatus'].setValue(null);
    this.spouseSetNull();
    this.isAdult();
  }

  //Boolean Functions
  isAdult() {
    if (this.applicantAge >= 21 && this.applicantGender == 'Male') {
      this.applicantAdult = true;
      this.applicantBasicForm.controls['maritalStatus'].setValidators([
        Validators.required,
      ]);
      this.applicantBasicForm.controls[
        'maritalStatus'
      ].updateValueAndValidity();
    } else if (this.applicantAge >= 18 && this.applicantGender == 'Female') {
      this.applicantAdult = true;
      this.applicantBasicForm.controls['maritalStatus'].setValidators([
        Validators.required,
      ]);
      this.applicantBasicForm.controls[
        'maritalStatus'
      ].updateValueAndValidity();
    } else {
      this.applicantAdult = false;
      this.applicantBasicForm.controls['maritalStatus'].setValidators([
        Validators.nullValidator,
      ]);
      this.applicantBasicForm.controls[
        'maritalStatus'
      ].updateValueAndValidity();
    }
  }

  spouseSetNull() {
    this.applicantBasicForm.controls['spouseFullName'].setValue(null);
    this.applicantBasicForm.controls['spouseFullName'].setValidators([
      Validators.nullValidator,
    ]);
    this.applicantBasicForm.controls['spouseGender'].setValue(null);
    this.applicantBasicForm.controls['spouseGender'].setValidators([
      Validators.nullValidator,
    ]);
    this.applicantBasicForm.controls['spouseDateOfBirth'].setValue(null);
    this.applicantBasicForm.controls['spouseDateOfBirth'].setValidators([
      Validators.nullValidator,
    ]);
    this.applicantBasicForm.controls['spouseAge'].setValue(null);
    this.applicantBasicForm.controls['spouseAge'].setValidators([
      Validators.nullValidator,
    ]);
  }

  childNull() {
    this.applicantChildForm.controls['childFullName'].setValue(null);
    this.applicantChildForm.controls['childFullName'].setValidators([
      Validators.nullValidator,
    ]);
    this.applicantChildForm.controls['childGender'].setValue(null);
    this.applicantChildForm.controls['childGender'].setValidators([
      Validators.nullValidator,
    ]);
    this.applicantChildForm.controls['childAge'].setValue(null);
    this.applicantChildForm.controls['childAge'].setValidators([
      Validators.nullValidator,
    ]);
    this.applicantChildForm.controls['childDateOfBirth'].setValue(null);
    this.applicantChildForm.controls['childDateOfBirth'].setValidators([
      Validators.nullValidator,
    ]);
  }
}
