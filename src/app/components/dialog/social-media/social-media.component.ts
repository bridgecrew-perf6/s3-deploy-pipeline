import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FacebookService, LoginResponse, LoginStatus } from 'ngx-facebook-fb';
import { SocialProfile } from 'src/app/model/socialProfile';
import { ManageaccountService } from 'src/app/services/manageaccount.service';
import { FacebookAKService } from 'src/app/services/socialmedia/facebook.ak.service';
import { TwitterService } from 'src/app/services/socialmedia/twitter.service';
import { PagesComponent } from '../facebookPages/pages/pages.component';

@Component({
  selector: 'app-social-media',
  templateUrl: './social-media.component.html',
  styleUrls: ['./social-media.component.scss']
})
export class SocialMediaComponent implements OnInit {
  userSocialProfile: SocialProfile | undefined;
  isTwitterAvailable = false;
  isFacebookAvailable = false;

  constructor(private twitterService: TwitterService,
    private fb: FacebookService,
    private modalService: NgbModal,
    public modal: NgbActiveModal,
    private manageaccountService: ManageaccountService,
    private facebookAKService: FacebookAKService,) { }

  ngOnInit(): void {
  }

  connectTwitter() {
    this.manageaccountService.userSocialProfile = {};
    this.twitterService.requestToken().subscribe(res => {
      const urlParams = new URLSearchParams((res['data']));
      const oauth_token = urlParams.get('oauth_token');
      //   const oauth_token_secret = urlParams.get('oauth_token_secret');
      window.location.href = `https://api.twitter.com/oauth/authorize?oauth_token=${oauth_token}&force_login=1`;
    });
  }


  facebookLogin() {
    this.manageaccountService.userSocialProfile = {};
    this.fb.getLoginStatus().then((response: LoginStatus) => {
      console.log(response)

      if (response.status === 'connected') {
        this.facebookAKService.generateAcessToken({ shortToken: response.authResponse.accessToken, userId: response.authResponse.userID }).subscribe(res => {
          console.log('FB account registered')
          this.getFacebookAccountDetails(response.authResponse.userID, response.authResponse.accessToken);
        });

      }
      else {
        this.fb.login({ scope: 'public_profile,email, pages_show_list,pages_manage_ads,pages_manage_cta,pages_manage_engagement,pages_manage_posts,pages_read_engagement,pages_read_user_content' })
          .then((response: LoginResponse) => {
            this.facebookAKService.generateAcessToken({ shortToken: response.authResponse.accessToken, userId: response.authResponse.userID }).subscribe(res => {
              console.log('FB account registered');
              this.getFacebookAccountDetails(response.authResponse.userID, response.authResponse.accessToken);
            });
          })
          .catch((error: any) => console.error(error));
      }
    });
  }

  getFacebookAccountDetails(userId: String, accessToken: String) {
    this.manageaccountService.userSocialProfile = {};
    this.fb.api(`${userId}/accounts?
          fields=name,access_token&
          access_token=${accessToken}`)
      .then(res => {
        const modalRef = this.modalService.open(PagesComponent, { backdropClass: 'in', windowClass: 'in' });
        const newRes = res.data.map((item: any) => {
          return {
            category: item.category,
            name: item.name,
            id: item.id
          }
        });
        modalRef.componentInstance.messageData = {
          facebookPages: newRes
        };

        modalRef.result
          .then((selectedPages) => {
            return this.facebookAKService.saveUserPages(userId, selectedPages).toPromise();
          })
          .then((response) => {
            console.log(response);
          })
          .catch(() => {
            // NOP
          });
      })
      .catch(e => console.log(e));
  }

}
