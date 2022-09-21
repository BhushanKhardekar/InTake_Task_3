import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ApplicantService } from '../../services/applicant.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {

  //Variables
  cardFrom: any;
  applicantDetails:any
  medicalDetails:any
  applicantPlan:any
  constructor(private fb: FormBuilder, private _applicantService: ApplicantService) { }

  ngOnInit(): void {
    this.getInfo();
    this.initCardForm();
  }

  initCardForm() {
    this.cardFrom= this.fb.group({
      cardHolderName: ['', Validators.required],
      cardNumber: ['', Validators.required],
      cardExpiry: ['', Validators.required],
      cardCVC: ['', Validators.required]
    });
  }
  getInfo() {
    this.applicantDetails= this._applicantService.applicant.applicantDetails
    this.medicalDetails=this._applicantService.applicant.medicalDetails
    this.applicantPlan= this._applicantService.applicant.applicantPlan
  }
  onSubmit(data: any) {
    console.log(data);
  }
}
