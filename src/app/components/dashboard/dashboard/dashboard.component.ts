import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SocialDropDown, SocialProfile } from 'src/app/model/socialProfile';
import { TwitterService } from 'src/app/services/socialmedia/twitter.service';
import { FacebookAKService } from 'src/app/services/socialmedia/facebook.ak.service';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { ToastrService } from 'ngx-toastr';
import { ProfileService } from 'src/app/services/usermanagement/profile.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { FileSystemFileEntry, FileSystemDirectoryEntry } from 'ngx-file-drop';
import { NgxFileDropEntryAikyne } from 'src/app/model/FileUpload';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ContentlibraryComponent } from '../../dialog/contentlibrary/contentlibrary.component';
import { ContentLibraryService } from 'src/app/services/content-library.service';
import { ManageaccountService } from 'src/app/services/manageaccount.service';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  public now: Date = new Date();
  scheduleTime = '';
  userId: any;

  count = 0;

  public min = new Date();

  reset() {
    this.scheduleTime = '';
  }
  public showFacebookPreview: boolean = false;
  public showTwitterPreview: boolean = false;

  userSocialProfile: SocialProfile | undefined;
  facebookProfile: any;
  facebookLength = 2000;
  postingData = '';
  selectedPostingPage = '';
  tweetLength = 280;
  isEmojiPickerVisible = false;
 

  postId = '';
  postStatus = '';
  

  selectedFile!: File;
  public showdrag: boolean = false;

  public dropdownList: any[] = [];



  selectedSocailProfile: any[] = [];

  public files: NgxFileDropEntryAikyne[] = [];
  public twitterMediaId = [];
  public mediaData: Array<any> = [];

  dropdownSettings: IDropdownSettings =
    {
      singleSelection: false,
      idField: 'socialId',
      textField: 'socialName',
      enableCheckAll: false,
      itemsShowLimit: 5,
      allowSearchFilter: false,
      noDataAvailablePlaceholderText: 'No Social Profiles connected'
    };

  constructor(private router: Router,
    private twitterService: TwitterService,
    private facebookAKService: FacebookAKService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private manageaccountService: ManageaccountService,

    public profileService: ProfileService,
    private spinner: NgxSpinnerService,
    private modalService: NgbModal,
    private contentlibraryService: ContentLibraryService) {
    setInterval(() => {
      this.now = new Date();
    }, 1);



  }


  ngOnInit(): void {

    this.spinner.show();

    this.retrieveSocialMediProfile();

    this.userId = this.route.snapshot.paramMap.get("userId") || '';
    this.postId = this.route.snapshot.paramMap.get("postId") || '';
    this.postStatus = this.route.snapshot.paramMap.get("postStatus") || '';

    if (this.router.url.indexOf('socialManage/twitterSignUp') != -1) {
      const urlParams = new URLSearchParams(this.router.url);
      const retToken = urlParams.get('retToken');
      const oauth_token = urlParams.get('oauth_token');
      const oauth_verifier = urlParams.get('oauth_verifier');
      this.twitterService.generateAcessToken({ 'retToken': retToken, 'oauth_token': oauth_token, 'oauth_verifier': oauth_verifier }).subscribe(res => {
        this.router.navigate(['/'])

      });
    }

    if (this.postId != '' && this.postStatus != '') {
      this.twitterService.retrieveSavedPost(this.postId, this.postStatus).subscribe(res => {

        if (res.data && res.data.length > 0) {
          const draftPost = res.data[0].draftPost ? res.data[0].draftPost : res.data[0].scheduledPost;
          this.postingData = draftPost.postData;
          const draftProfiles: SocialDropDown[] = [];
          draftPost.tweetData.forEach((twtProfile: any) => {
            if (this.dropdownList.some(e => e.socialId === `twitter-${twtProfile.userId}`)) {
              const currentProfile: any = this.dropdownList.find(obj => {
                return obj.socialId === `twitter-${twtProfile.userId}`
              });
              draftProfiles.push({ socialId: `twitter-${twtProfile.userId}`, socialName: currentProfile.socialName });
            }
          });

          draftPost.fbpost.forEach((fbProfile: any) => {
            if (this.dropdownList.some(e => e.socialId === `facebook-${fbProfile.userId}-${fbProfile.pageId}`)) {
              const currentProfile: any = this.dropdownList.find(obj => {
                return obj.socialId === `facebook-${fbProfile.userId}-${fbProfile.pageId}`
              });
              draftProfiles.push({ socialId: `facebook-${fbProfile.userId}-${fbProfile.pageId}`, socialName: currentProfile.socialName });
            }

          });
          this.selectedSocailProfile = draftProfiles;
          this.scheduleTime = draftPost.scheduleTime;
          this.mediaData = draftPost.mediaData;
          if (this.mediaData && this.mediaData.length > 0) {
            this.showdrag = true;
          }
          this.showPreview();
        }
        this.spinner.hide();
      })
    } else {
      this.spinner.hide();
    }
  }

  showPreview() {
    this.showFacebookPreview = (this.selectedSocailProfile.length > 0) ? this.selectedSocailProfile.some(function (el) { return el.socialId?.startsWith('facebook') }) : false;
    this.showTwitterPreview = (this.selectedSocailProfile.length > 0) ? this.selectedSocailProfile.some(function (el) { return el.socialId?.startsWith('twitter') }) : false;
  }

  addEmoji(event: any) {
    this.postingData = `${this.postingData}${event.emoji.native}`;
    this.isEmojiPickerVisible = false;
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

  onFileChanged(event: any) {
    this.selectedFile = event.target.files[0]
  }

  public dropped(files: any[]) {
    if (this.files.length > 4 || (this.files.concat(files).length > 4)) {
      this.toastr.error("Maximum of only 4 Media files can be uploaded");
      return;
    }
   
    this.files = this.files.concat(files);
    for (const droppedFile of files) {
      // Is it a file?
      
      
      if (droppedFile.fileEntry.isFile ) {
       
        
        
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => 
        {
          if(this.isFileSizeAllowed(file.size)){
          // Here you can access the real file
          console.log(droppedFile.relativePath, file);
          this.mediaData.push({'fileDisplayName': droppedFile.relativePath, 'progressStatus': '0' })
          this.contentlibraryService.uploadImages(file.name.split('.').pop()).subscribe((res: any) => {
            this.contentlibraryService.uploadActualImage(res.data, file).subscribe(uploadres => {
              (droppedFile as any)['progressPercentage'] = (uploadres && uploadres.message) ? uploadres.message : 0;
             
              if (uploadres && uploadres.message && uploadres.message == '100') {
                (droppedFile as any)['progressStatus'] = 'Done';
                (droppedFile as any)['fileKey'] = res.fileName;
                this.count ++;

                var foundIndex = this.mediaData.findIndex(fl => fl.fileDisplayName == droppedFile.relativePath);
                const updatedFile = this.mediaData[foundIndex];
                updatedFile['progressStatus'] = 'Done';
                updatedFile['fileKey'] = res.fileName;
                updatedFile['fileUrl'] = res.data.split('?')[0];
                this.mediaData[foundIndex] = updatedFile;
              }
            });
          });
          
        }
        else{
          this.toastr.error("Please select a file less than 5MB.");
        }
       
        
        });
      
      } else {
        // It was a directory (empty directories are added, otherwise only files)
        const fileEntry = droppedFile.fileEntry as FileSystemDirectoryEntry;
        console.log(droppedFile.relativePath, fileEntry);
      }
    }
  }

  isFileSizeAllowed(size: number) {
    let isFileSizeAllowed = false;
    if (size < 5000000) {
      isFileSizeAllowed = true;
    }
    return isFileSizeAllowed;

  }

  removeMedia(fileKey: string) {
    this.contentlibraryService.removeMedia(fileKey).subscribe(res => {
      console.log(res);
      this.files = this.files.filter((file: any) => file.fileKey != fileKey);
      this.mediaData = this.mediaData.filter((file: any) => file.fileKey != fileKey);
      this.count --;


    })
  }

  postToSocialProfile() {

    console.log('Posting Immediately:::::::');
    const twitterProfile: Array<any> = [];
    const fbProfile: Array<any> = [];


    this.selectedSocailProfile.forEach(socialProfile => {
      this.spinner.show();
      if (socialProfile.socialId?.startsWith('facebook')) {
        fbProfile.push({ name: 'facebook', userId: socialProfile.socialId.split('-')[1], pageId: socialProfile.socialId.split('-')[2] });
      } else if (socialProfile.socialId?.startsWith('twitter')) {
        twitterProfile.push({ name: 'twitter', userId: socialProfile.socialId.split('-')[1] });
      }
    })

    const postData = {
      postData: this.postingData,
      scheduleTime: '',
      postStatus: 'Posted',
      tweetData: twitterProfile,
      fbpost: fbProfile,
      mediaData: this.mediaData,
    };

    if (this.postingData == '') {
      this.toastr.error("Text field is empty")
      return;
    } else if (this.selectedSocailProfile.length === 0) {
      this.toastr.error("Select at least one social media profile")
      return;
    }

    if (this.mediaData && this.mediaData.length > 0 && twitterProfile.length > 0) {


      this.contentlibraryService.uploadTwitterMedia({ fileNames: this.mediaData, twitterProfile }).subscribe(uploadres => {
        console.log(uploadres);

        twitterProfile.forEach(profile => {
          profile['mediaUrl'] = uploadres.mediaId;
        })

        this.twitterService.postSocial(postData).subscribe(res => {
          this.spinner.hide();
          console.log(res)
          this.toastr.success(res.status);
          this.router.navigate([`socialmedia/post/publishedpost`]);
        });

      });
    } else {
      this.twitterService.postSocial(postData).subscribe(res => {
        this.spinner.hide();
        console.log(res)
        this.toastr.success(res.status);
        this.router.navigate([`socialmedia/post/publishedpost`]);
      });
    }
  }



  openContentLibraryDialog() {
    const modalRef = this.modalService.open(ContentlibraryComponent, { backdropClass: 'in', windowClass: 'in', size: 'xl', centered: true });
   
  }

  saveAsDraft() {
    console.log('Saving the Post as Draft:::::::');
    const twitterProfile: Array<any> = [];
    const fbProfile: Array<any> = [];

    this.selectedSocailProfile.forEach(socialProfile => {
      this.spinner.show();
      if (socialProfile.socialId?.startsWith('facebook')) {
        fbProfile.push({
          userId: socialProfile.socialId.split('-')[1],
          pageId: socialProfile.socialId.split('-')[2],
          userName: socialProfile.socialName
        });
      } else if (socialProfile.socialId?.startsWith('twitter')) {
        twitterProfile.push({
          userId: socialProfile.socialId.split('-')[1],
          userName: socialProfile.socialName
        });
      }

    })

    let draftScheduleTime = '';
    if (this.scheduleTime != '') {
      var d = new Date(this.scheduleTime).setSeconds(0);
      d = new Date(d).setMilliseconds(0);
      draftScheduleTime = new Date(d).toISOString();
    }


    const draftPostData = {
      draftPostId: this.postId,
      postData: this.postingData,
      scheduleTime: draftScheduleTime,
      postStatus: 'Draft',
      tweetData: twitterProfile,
      fbpost: fbProfile,
      mediaData: this.mediaData,
      previousStatus: this.postStatus
    };

    this.twitterService.saveDraftPost(draftPostData).subscribe(res => {
      this.spinner.hide();
      this.toastr.success(res.status)
      console.log(res)
      this.router.navigate([`socialmedia/post/savedpost`]);
    });

  }

  schedulePost() {
    if (this.selectedSocailProfile.length == 0) {
      this.toastr.error("Select atleast one social profile")
    }
    if (this.selectedSocailProfile.length > 0) {
      console.log('Scheduling the Post as Draft:::::::');
      const twitterProfile: Array<any> = [];
      const fbProfile: Array<any> = [];


      this.selectedSocailProfile.forEach(socialProfile => {
        this.spinner.show();
        if (socialProfile.socialId?.startsWith('facebook')) {
          fbProfile.push({
            userId: socialProfile.socialId.split('-')[1],
            pageId: socialProfile.socialId.split('-')[2],
          });
        } else if (socialProfile.socialId?.startsWith('twitter')) {
          twitterProfile.push({
            userId: socialProfile.socialId.split('-')[1],
          });
        }
      })

      var d = new Date(this.scheduleTime).setSeconds(0);
      d = new Date(d).setMilliseconds(0);

      const schedulePost = {
        scheduledPostId: this.postId,
        postData: this.postingData,
        scheduleTime: new Date(d).toISOString(),
        postStatus: 'Scheduled',
        tweetData: twitterProfile,
        fbpost: fbProfile,
        mediaData: this.mediaData,
        previousStatus: this.postStatus
      };

      this.twitterService.schedulePost(schedulePost).subscribe(res => {
        this.spinner.hide();
        this.toastr.success(res.status)
        console.log(res)
        this.router.navigate([`socialmedia/calendar/planner`]);
      });
    }
  }




}
