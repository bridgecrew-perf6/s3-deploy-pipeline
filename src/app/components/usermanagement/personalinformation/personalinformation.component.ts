import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { SocialProfile } from 'src/app/model/socialProfile';
import { User } from 'src/app/model/user';
import { ManageaccountService } from 'src/app/services/manageaccount.service';
import { AuthService } from 'src/app/services/usermanagement/auth.service';
import { ProfileService } from 'src/app/services/usermanagement/profile.service';

@Component({
  selector: 'app-personalinformation',
  templateUrl: './personalinformation.component.html',
  styleUrls: ['./personalinformation.component.scss']
})
export class PersonalinformationComponent implements OnInit {

  update: FormGroup;
  userData!: User;
  userId='';

  constructor(private _router: Router,private auth: AuthService,
    private profileService: ProfileService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private manageaccountService: ManageaccountService) {
    this.update = new FormGroup
    ({
      firstName: new FormControl('', Validators.required),
      lastName: new FormControl('', Validators.required),
      bio: new FormControl('', Validators.required),
      initials: new FormControl(''),
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
      instagram: new FormControl('', Validators.required),
      lang: new FormControl('',Validators.required),
      retail: new FormControl('', Validators.required),
      timezone: new FormControl('', Validators.required),
      translang: new FormControl('', Validators.required),
      applang: new FormControl('', Validators.required),
      dateformat: new FormControl('', Validators.required),
      numformat: new FormControl('', Validators.required),
      timeformat: new FormControl('', Validators.required),
      distformat: new FormControl('', Validators.required),
      FDOW: new FormControl('', Validators.required)
    });
    this.update.controls['email'].disable();
    this.retrieveUserProfile();

   }

  ngOnInit(): void {}

  editUser() {
    this.spinner.show();
    this.auth.updateUser(this.update.getRawValue())
      .subscribe(
        res => {
          console.log(res);
          this.spinner.hide();
          this.toastr.success('User Profile successfully updated')
        },
        err => {
          console.log(err)
          this.spinner.hide();
          this.toastr.error('User Profile cannot be updated')
        }
      )
  }



  retrieveUserProfile(): void {
    this.spinner.show();
    this.profileService.retrieveUserProfile().subscribe(res => {
      this.userData = res.data;
      this.spinner.hide();
      this.update.patchValue(res.data)
    })
  }

}
