import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ProfileService } from 'src/app/services/usermanagement/profile.service';


@Component({
  selector: 'app-accountsettings',
  templateUrl: './accountsettings.component.html',
  styleUrls: ['./accountsettings.component.scss']
})
export class AccountsettingsComponent implements OnInit {


  tabName = 'personal';

  constructor(
    public profileService: ProfileService,
    private spinner: NgxSpinnerService,) { }

  ngOnInit(): void {
    this.spinner.show();
    if (!this.profileService.userData.firstName) {
      this.profileService.retrieveUserProfile().subscribe(res => {
        this.profileService.userData = res.data;
        this.spinner.hide();
      });
    }
  }

}
