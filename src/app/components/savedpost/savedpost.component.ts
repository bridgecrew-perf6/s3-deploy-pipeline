import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { PostData } from 'src/app/model/postData';
import { SocialDropDown, SocialProfile } from 'src/app/model/socialProfile';
import { ManageaccountService } from 'src/app/services/manageaccount.service';
import { TwitterService } from 'src/app/services/socialmedia/twitter.service';
import { ProfileService } from 'src/app/services/usermanagement/profile.service';

@Component({
  selector: 'app-savedpost',
  templateUrl: './savedpost.component.html',
  styleUrls: ['./savedpost.component.scss']
})
export class SavedpostComponent implements OnInit {

  public dropdownList: SocialDropDown[] = [];
  userSocialProfile: SocialProfile | undefined;

  selectedFilterSocailProfile: SocialDropDown[] = [];
  publishedPost: PostData[] = [];

  dropdownSettings: IDropdownSettings = {
    singleSelection: false,
    idField: 'socialId',
    textField: 'socialName',
    enableCheckAll: false,
    itemsShowLimit: 5,
    allowSearchFilter: false,
  };
  userId: any;

  constructor(private twitterService: TwitterService,
    public profileService: ProfileService,
    private router: Router,
    private manageaccountService: ManageaccountService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.spinner.show();
    this.retrieveSocialMediProfile();
    this.retrieveDraftPost();
  }

  retrieveDraftPost() {
    this.publishedPost = [];
    this.twitterService.retrieveAllSocialPost(true, false, false).subscribe(res => {
      //process drafts
      if (res.data && res.data.drafts) {
        res.data.drafts.forEach((postedPost: any) => {
          postedPost.tweetData.forEach((tweet: PostData) => {
            this.publishedPost.push({
              id: postedPost._id,
              userName: tweet.userName,
              userId: tweet.userId,
              postStatus: tweet.postStatus,
              postId: tweet.postId,
              postDate: tweet.postDate,
              postData: postedPost.postData,
              socialName: 'twitter'
            })
          });
          postedPost.fbpost.forEach((post: PostData) => {
            this.publishedPost.push({
              id: postedPost._id,
              userName: post.userName,
              userId: post.userId,
              pageId: post.pageId,
              postStatus: post.postStatus,
              postId: post.postId,
              postDate: post.postDate,
              postData: postedPost.postData,
              socialName: 'facebook'
            })
          });

        });
      }
      this.spinner.hide();
    })
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

  deletePost(postId: string) {
    this.spinner.show();
    this.twitterService.deletePost(postId, 'draft').subscribe(res => {
      this.retrieveDraftPost();
      this.toastr.info(res.status);
    });
  }

  navigatePost(id: string) {
    this.router.navigate([`socialmedia/post/newpost/${id}/draft`]);
  }


}
