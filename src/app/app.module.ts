import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerModule } from "ngx-spinner";
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { FacebookModule } from 'ngx-facebook-fb';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatInputModule } from '@angular/material/input';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RegisterComponent } from './components/usermanagement/register/register.component';
import { LoginComponent } from './components/usermanagement/login/login.component';
import { TokenInterceptorService } from './utility/token-interceptor.service';
import { ForgotComponent } from './components/usermanagement/forgot/forgot.component';
import { DashboardComponent } from './components/dashboard/dashboard/dashboard.component';
import { ProfileComponent } from './components/usermanagement/profile/profile.component';
import { HomeComponent } from './components/home/home.component';
import { MessageComponent } from './components/message/message.component';
import { ScheduleComponent } from './components/usermanagement/schedule/schedule.component';
import { PasswordupdateComponent } from './components/usermanagement/passwordupdate/passwordupdate.component';
import { PagesComponent } from './components/dialog/facebookPages/pages/pages.component';
import { PrivacypolicyComponent } from './components/common/privacypolicy/privacypolicy.component';
import { HeaderComponent } from './components/common/header/header.component';
import { SidebarComponent } from './components/common/sidebar/sidebar.component';
import { SocialMediaComponent } from './components/dialog/social-media/social-media.component';
import { SocialAdsComponent } from './components/dialog/social-ads/social-ads.component';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { FacebookLoginProvider, GoogleLoginProvider, SocialAuthServiceConfig, SocialLoginModule } from 'angularx-social-login';
import { LogoutComponent } from './components/dialog/logout/logout.component';
import { PublishedpostComponent } from './components/publishedpost/publishedpost.component';
import { SavedpostComponent } from './components/savedpost/savedpost.component';
import { PostfilterPipe } from './filter/posts.filter';
import { ManageaccountComponent } from './components/usermanagement/manageaccount/manageaccount.component';
import { FeedsComponent } from './components/feeds/feeds.component';
import { BillingComponent } from './components/usermanagement/billing/billing.component';
import { AddmemberComponent } from './components/usermanagement/addmember/addmember.component';
import { NgxFileDropModule } from 'ngx-file-drop';
import { ContentlibraryComponent } from './components/dialog/contentlibrary/contentlibrary.component';
import { AccountsettingsComponent } from './components/usermanagement/accountsettings/accountsettings.component';
import { BillinginformationComponent } from './components/usermanagement/billinginformation/billinginformation.component';
import { PersonalinformationComponent } from './components/usermanagement/personalinformation/personalinformation.component';
import { UsersocialprofileComponent } from './components/usermanagement/usersocialprofile/usersocialprofile.component';
import { NewtemplateComponent } from './components/template/newtemplate/newtemplate.component';
import { MatIconModule } from '@angular/material/icon';


const fbLoginOptions = {
  scope: 'pages_messaging,pages_messaging_subscriptions,email,pages_show_list,manage_pages',
  return_scopes: true,
  enable_profile_selector: true,
  version: "v2.11" // this line added.
};

const googleLoginOptions = {
  scope: 'profile email'
};

@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    LoginComponent,
    ForgotComponent,
    DashboardComponent,
    ProfileComponent,
    HomeComponent,
    MessageComponent,
    ScheduleComponent,
    PasswordupdateComponent,
    PagesComponent,
    PrivacypolicyComponent,
    HeaderComponent,
    SidebarComponent,
    SocialMediaComponent,
    SocialAdsComponent,
    LogoutComponent,
    PublishedpostComponent,
    SavedpostComponent,
    PostfilterPipe,
    ManageaccountComponent,
    FeedsComponent,
    BillingComponent,
    AddmemberComponent,
    ContentlibraryComponent,
    AccountsettingsComponent,
    BillinginformationComponent,
    PersonalinformationComponent,
    UsersocialprofileComponent,
    NewtemplateComponent,
  ],
  imports: [
    PickerModule, MatIconModule,
    BrowserModule,
    MatInputModule,
    NgxSpinnerModule,
    ReactiveFormsModule,
    DragDropModule,
    HttpClientModule,
    FormsModule,
    AppRoutingModule,
    BrowserAnimationsModule, // required animations module
    ToastrModule.forRoot(),
    CommonModule,
    NgbModalModule,
    SocialLoginModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
    FacebookModule.forRoot(),
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    NgMultiSelectDropDownModule.forRoot(),
    NgxFileDropModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptorService, multi: true },
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              '898160175131-um7siprjblll2o61mdli96o71pikbae5.apps.googleusercontent.com', googleLoginOptions
            )
          }
          // uncomment for prod deployment
          ,
          {
            id: FacebookLoginProvider.PROVIDER_ID,
            provider: new FacebookLoginProvider('125112632754235', fbLoginOptions)
          }
        ]
      } as SocialAuthServiceConfig,
    },
    //CookieService

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
