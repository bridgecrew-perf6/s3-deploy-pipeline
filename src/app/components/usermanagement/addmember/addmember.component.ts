import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { SocialDropDown, SocialProfile } from 'src/app/model/socialProfile';
import { ManageaccountService } from 'src/app/services/manageaccount.service';
import { ProfileService } from 'src/app/services/usermanagement/profile.service';

@Component({
  selector: 'app-addmember',
  templateUrl: './addmember.component.html',
  styleUrls: ['./addmember.component.scss']
})
export class AddmemberComponent implements OnInit {

  name = 'Angular';
  firstName = '';

  public msg: boolean = false;
  userSocialProfile: SocialProfile | undefined;
  productForm: FormGroup;
  public dropdownList: SocialDropDown[] = [];

  constructor(
    public profileService: ProfileService,
    private manageaccountService: ManageaccountService,
    private fb: FormBuilder) {
    this.productForm = this.fb.group({
      name: '',
      members: this.fb.array([]),
    });
  }

  ngOnInit(): void {
    this.retrieveSocialMediProfile()
  }



  retrieveSocialMediProfile() {
    if (this.manageaccountService.userSocialProfile.email) {
      this.userSocialProfile = this.manageaccountService.userSocialProfile;
      this.processSocialDropdown();
    } else {
      this.manageaccountService.retrieveSocialMediaProfile().subscribe(res => {
        this.userSocialProfile = res.data as SocialProfile;
        this.manageaccountService.userSocialProfile = res.data as SocialProfile;
        this.processSocialDropdown();
      });
    }
  }

  processSocialDropdown() {
    this.dropdownList = [];
    this.userSocialProfile?.socialMedia?.forEach(scMedia => {
      if (scMedia.name == 'facebook') {
        scMedia.fbpages?.forEach(fbpage => {
          this.dropdownList.push({ socialId: `facebook-${scMedia.userId}-${fbpage.id}`, socialName: fbpage.name });
        });
      } else if (scMedia.name == 'twitter') {
        this.dropdownList.push({ socialId: `twitter-${scMedia.userId}`, socialName: scMedia.screenName });
      }
    })
  }

  members(): FormArray {
    return this.productForm.get("members") as FormArray
  }

  newQuantity(): FormGroup {
    return this.fb.group({
      fname: '',
      lname: '',
      email: ''
    })
  }

  addQuantity() {
    var check = this.members().value;
    this.members().push(this.newQuantity());
  }

  removeQuantity(i: number) {
    this.members().removeAt(i);
  }

  onSubmit() {
    console.log(this.productForm.value);
  }
}
