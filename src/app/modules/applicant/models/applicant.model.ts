import { ApplicantDetails } from "./applicantDetails.model"
import { ApplicantMedicalDetails } from "./applicantMedicalDetails.model";
import { ApplicantPlan } from "./applicantPlan.model";

export class Applicant{
  public applicantDetails : ApplicantDetails = new ApplicantDetails();
  public medicalDetails : ApplicantMedicalDetails = new ApplicantMedicalDetails();
  public applicantPlan : ApplicantPlan = new ApplicantPlan();
}
