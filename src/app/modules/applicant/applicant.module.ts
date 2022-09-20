import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserRoutingModule } from './applicant-routing.module';
import { ApplicantDetailsComponent } from './components/applicant-details/applicant-details.component';
import { MedicalDetailsComponent } from './components/medical-details/medical-details.component';
import { InsuranceDetailsComponent } from './components/insurance-details/insurance-details.component';
import { ReviewDetailsComponent } from './components/review-details/review-details.component';
import { PaymentComponent } from './components/payment/payment.component';
import { ThankYouComponent } from './components/thank-you/thank-you.component';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ApplicantContainerComponent } from './components/applicant-container/applicant-container.component'


@NgModule({
  declarations: [
    ApplicantContainerComponent,
    ApplicantDetailsComponent,
    MedicalDetailsComponent,
    InsuranceDetailsComponent,
    ReviewDetailsComponent,
    PaymentComponent,
    ThankYouComponent,
    WelcomeComponent,
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ]
})
export class ApplicantModule { }
