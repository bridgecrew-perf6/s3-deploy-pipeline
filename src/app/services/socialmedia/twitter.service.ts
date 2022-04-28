import { HttpClient, HttpEventType, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { ApiResponse } from 'src/app/model/ApiResponse';
import { environment } from 'src/environments/environment';
import { HttpBackend } from '@angular/common/http'
@Injectable({
  providedIn: 'root'
})
export class TwitterService {

  constructor(private http: HttpClient,
    private handler: HttpBackend) { }

  requestToken() {
    return this.http.get<any>(`${environment.socialMedia}/twr/twitterToken`);
  }

  generateAcessToken(accessDetails: any) {
    return this.http.post<any>(`${environment.socialMedia}/twr/twitterAccessToken`, accessDetails);
  }

  postSocial(postData: any) {
    return this.http.post<any>(`${environment.socialMedia}/postSocial`, { postData });
  }

  postTweet(userAccount: Array<any>, tweet: any) {
    return this.http.post<any>(`${environment.socialMedia}/twr/postTweet`, { userAccount, tweet });
  }

  saveDraftPost(draftPostData: any) {
    return this.http.post<any>(`${environment.socialMedia}/saveDraftPost`, { draftPostData });
  }

  schedulePost(schedulePostData: any) {
    return this.http.post<any>(`${environment.socialMedia}/scheduleSocialPost`, { schedulePostData });
  }


  retrieveAllSocialPost(showdraft = false, showPublished = false, showScheduled = false) {
    return this.http.get<ApiResponse>(`${environment.socialMedia}/retrieveAllPost?draft=${showdraft}&publised=${showPublished}&scheduled=${showScheduled}`);
  }

  retrieveSavedPost(postId: string, postStatus: string) {
    return this.http.get<ApiResponse>(`${environment.socialMedia}/retrieveSavedPost?postId=${postId}&postStatus=${postStatus}`);
  }

  deletePost(postId: string, postStatus: string) {
    return this.http.get<ApiResponse>(`${environment.socialMedia}/deletePost?postId=${postId}&postType=${postStatus}`);
  }

}
