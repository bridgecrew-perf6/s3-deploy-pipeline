import { Component, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { SocialDropDown, SocialProfile } from 'src/app/model/socialProfile';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { ProfileService } from 'src/app/services/usermanagement/profile.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ManageaccountService } from 'src/app/services/manageaccount.service';


@Component({
  selector: 'app-feeds',
  templateUrl: './feeds.component.html',
  styleUrls: ['./feeds.component.scss']
})
export class FeedsComponent implements OnInit {
  timePeriods = [
    'Twitter',
    'Facebook',
    'Instagram',
    'LinkedIn',
    'Youtube'
  ];

  userSocialProfile: SocialProfile | undefined;
  public dropdownList: SocialDropDown[] = [];

  dropdownSettings: IDropdownSettings = {
    singleSelection: false,
    idField: 'socialId',
    textField: 'socialName',
    enableCheckAll: false,
    itemsShowLimit: 5,
    allowSearchFilter: false,
  };

  constructor(
    private manageaccountService: ManageaccountService,
    public profileService: ProfileService,
    private spinner: NgxSpinnerService) { }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.timePeriods, event.previousIndex, event.currentIndex);
  }

  ngOnInit(): void {
    this.spinner.show();
    this.retrieveSocialMediProfile();
    this.spinner.hide();
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
}
