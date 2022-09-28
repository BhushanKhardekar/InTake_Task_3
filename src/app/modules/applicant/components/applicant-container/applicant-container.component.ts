import { Component, OnInit } from '@angular/core';
import { ApplicantService } from '../../services/applicant.service';

@Component({
  selector: 'app-applicant-container',
  templateUrl: './applicant-container.component.html',
  styleUrls: ['./applicant-container.component.css']
})
export class ApplicantContainerComponent implements OnInit {

  constructor(
    private _userService: ApplicantService,) { }

  ngOnInit(): void {
    this._userService.getDataFromApi();
  }

}
