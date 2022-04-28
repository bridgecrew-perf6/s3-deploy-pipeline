import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SocialProfile } from 'src/app/model/socialProfile';
import { User } from 'src/app/model/user';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  userData: User = new User();

  constructor(private http: HttpClient) { }

  retrieveUserProfile(){
    return this.http.get<any>(`${environment.userManagement}/retrieveUser`)
  }
}
