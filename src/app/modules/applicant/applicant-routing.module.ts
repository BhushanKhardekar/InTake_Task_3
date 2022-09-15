import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ApplicantDetailsComponent } from './components/applicant-details/applicant-details.component';
import { InsuranceDetailsComponent } from './components/insurance-details/insurance-details.component';
import { MedicalDetailsComponent } from './components/medical-details/medical-details.component';
import { PaymentComponent } from './components/payment/payment.component';
import { ReviewDetailsComponent } from './components/review-details/review-details.component';
import { ThankYouComponent } from './components/thank-you/thank-you.component';
import { UserContainerComponent } from './components/user-container/user-container.component';
import { WelcomeComponent } from './components/welcome/welcome.component';

const routes: Routes = [
  { path: '', component: WelcomeComponent },
  {
    path: 'applicant', component: UserContainerComponent,
    children: [
      { path: 'applicant-details', component: ApplicantDetailsComponent },
      { path: 'medical-details', component: MedicalDetailsComponent },
      { path: 'insurance-details', component: InsuranceDetailsComponent },
      { path: 'review', component: ReviewDetailsComponent },
      { path: '', redirectTo: 'applicant-details', pathMatch: 'full' },
    ],
  },
  { path: 'payment', component: PaymentComponent },
  { path: 'thank-you', component: ThankYouComponent },
  { path: '', redirectTo: 'welcome', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserRoutingModule { }
