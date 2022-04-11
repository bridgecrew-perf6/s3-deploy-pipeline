import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

import { User } from 'src/app/model/user';
import { ManageaccountService } from 'src/app/services/manageaccount.service';

import { AuthService } from 'src/app/services/usermanagement/auth.service';
import { ProfileService } from 'src/app/services/usermanagement/profile.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  update: FormGroup;
  userData!: User;
  userId = '';


  constructor(private auth: AuthService,
    private profileService: ProfileService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private manageaccountService: ManageaccountService) {
    this.update = new FormGroup
      ({
        firstName: new FormControl('', Validators.required),
        lastName: new FormControl('', Validators.required),
        bio: new FormControl('', Validators.required),
        email: new FormControl('', Validators.required),
        phone: new FormControl('', Validators.required),
        compname: new FormControl('', Validators.required),
        jobTitle: new FormControl('', Validators.required),
        time: new FormControl('', Validators.required),
        address1: new FormControl('', Validators.required),
        address2: new FormControl('', Validators.required),
        city: new FormControl('', Validators.required),
        state: new FormControl('', Validators.required),
        country: new FormControl('', Validators.required),
        zip: new FormControl('', Validators.required),
        website: new FormControl('', Validators.required),
        facebook: new FormControl('', Validators.required),
        twitter: new FormControl('', Validators.required),
        initials: new FormControl('', Validators.required),
        instagram: new FormControl('', Validators.required),
        lang: new FormControl('', Validators.required),
        retail: new FormControl('', Validators.required),
        timezone: new FormControl('', Validators.required)

      });
    this.update.controls['email'].disable();
  }


  ngOnInit(): void {
    this.spinner.show();
    this.profileService.retrieveUserProfile().subscribe(res => {
      this.profileService.userData = res.data;
      this.userData = res.data;
      this.update.patchValue(res.data)
      this.spinner.hide();
    });
  }

  editUser() {
    this.spinner.show();
    this.auth.updateUser(this.update.getRawValue())
      .subscribe(
        res => {
          console.log(res);
          this.profileService.retrieveUserProfile().subscribe(res => {
            this.profileService.userData = res.data;
            this.spinner.hide();
            this.toastr.success('User Profile successfully updated');
          });

        },
        err => {
          console.log(err)
          this.spinner.hide();
          this.toastr.error('User Profile cannot be updated')
        }
      )
  }

}
