import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ApplicantContainerComponent } from './components/applicant-container/applicant-container.component';
import { ApplicantDetailsComponent } from './components/applicant-details/applicant-details.component';
import { MedicalDetailsComponent } from './components/medical-details/medical-details.component';
import { PaymentComponent } from './components/payment/payment.component';
import { ReviewDetailsComponent } from './components/review-details/review-details.component';
import { SummaryComponent } from './components/summary/summary.component';
import { ThankYouComponent } from './components/thank-you/thank-you.component';
import { WelcomeComponent } from './components/welcome/welcome.component';

const routes: Routes = [
  { path: '', component: WelcomeComponent },
  {
    path: 'applicant', component: ApplicantContainerComponent,
    children: [
      { path: 'applicant-details', component: ApplicantDetailsComponent },
      { path: 'medical-details', component: MedicalDetailsComponent },
      { path: 'review-details', component: ReviewDetailsComponent },
      { path: 'payment', component: PaymentComponent,},
      { path: 'thank-you', component: ThankYouComponent },
      {path: 'summary', component: SummaryComponent },
      { path: '', redirectTo: 'applicant-details', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserRoutingModule { }
