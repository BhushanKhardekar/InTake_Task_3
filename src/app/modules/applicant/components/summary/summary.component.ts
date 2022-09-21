import { Component, OnInit,Input } from '@angular/core';
import { ApplicantService } from '../../services/applicant.service';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.css']
})
export class SummaryComponent implements OnInit {

  //Variable

  @Input() applicantDetails:any;
  @Input() medicalDetails:any;
  @Input() applicantPlan:any;

  constructor( ) { }

  ngOnInit(): void {
  }
}
