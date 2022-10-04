import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Applicant } from '../models/applicant.model';
import { linkUrl } from '../config/url.config'

@Injectable({
  providedIn: 'root',
})
export class ApplicantService {
  maxDate: any;
  minDate: any;
  applicationJson: any;

  public applicant: Applicant = new Applicant();

  constructor(
    private router: Router,
    private _http: HttpClient
  ) { this.futureDate(); }

  futureDate() {
    var date: any = new Date();
    var today: any = date.getDate();
    var month: any = date.getMonth() + 1;
    var year: any = date.getFullYear();
    if (today < 10) {
      today = '0' + today;
    }
    if (month < 10) {
      month = '0' + month;
    }
    this.maxDate = year + '-' + month + '-' + today;
    this.minDate = '1900-01-01';
  }

  //Get
  getApplicantData() {
    return this._http.get(linkUrl.get_data_url);
  }

  getAvailableList() {
    return this._http.get(linkUrl.get_list_url);
  }

  //post
  setValueToModel(data?: any) {
    if (this.router.url.includes('applicant/applicant-details')) {
      this.applicant.applicantDetails = data;
      console.log(this.applicant)
    }
    if (this.router.url.includes('applicant/medical-details')) {
      this.applicant.medicalDetails = data;
    }
    if (this.router.url.includes('applicant/review-details')) {
      this.applicant.applicantPlan = data;
    }
    this.applicationJson = JSON.stringify(this.applicant);
    let obj = { 'applicationJson': this.applicationJson }
    return this._http.post(linkUrl.post_data_url, obj);
  }
}
