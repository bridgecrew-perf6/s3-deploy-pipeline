import { Component, NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './utility/auth.guard';
import { ForgotComponent } from './components/usermanagement/forgot/forgot.component';
import { LoginComponent } from './components/usermanagement/login/login.component';
import { RegisterComponent } from './components/usermanagement/register/register.component';
import { DashboardComponent } from './components/dashboard/dashboard/dashboard.component';
import { ProfileComponent } from './components/usermanagement/profile/profile.component';
import { HomeComponent } from './components/home/home.component';
import { MessageComponent } from './components/message/message.component';
import { ScheduleComponent } from './components/usermanagement/schedule/schedule.component';
import { PasswordupdateComponent } from './components/usermanagement/passwordupdate/passwordupdate.component';
import { PrivacypolicyComponent } from './components/common/privacypolicy/privacypolicy.component';
import { PublishedpostComponent } from './components/publishedpost/publishedpost.component';
import { SavedpostComponent } from './components/savedpost/savedpost.component';
import { ManageaccountComponent } from './components/usermanagement/manageaccount/manageaccount.component';
import { FeedsComponent } from './components/feeds/feeds.component';
import { BillingComponent } from './components/usermanagement/billing/billing.component';
import { AddmemberComponent } from './components/usermanagement/addmember/addmember.component';
import { AccountsettingsComponent } from './components/usermanagement/accountsettings/accountsettings.component';
import { BillinginformationComponent } from './components/usermanagement/billinginformation/billinginformation.component';
import { NewtemplateComponent } from './components/template/newtemplate/newtemplate.component';


const routes: Routes = [
  { path: 'login',  component: LoginComponent},
  { path: 'register', component: RegisterComponent },
  { path: 'forgot', component: ForgotComponent },
  { path: 'message', component: MessageComponent },
  { path: 'home', canActivate: [AuthGuard], component: HomeComponent },
  { path: 'home/:userId/dashboard', canActivate: [AuthGuard], component: HomeComponent },
  { path: 'socialmedia/calendar/planner', canActivate: [AuthGuard], component: ScheduleComponent },
  { path: 'manageaccount', canActivate: [AuthGuard], component: ManageaccountComponent },
  { path: 'billing',canActivate: [AuthGuard], component: BillingComponent },
  { path: 'passwordupdate',canActivate: [AuthGuard], component: PasswordupdateComponent },
  { path: 'addmember',canActivate: [AuthGuard], component: AddmemberComponent },
  { path: 'socialmedia/feeds',canActivate: [AuthGuard], component: FeedsComponent},
  { path:'privacypolicy', component: PrivacypolicyComponent },
  { path: 'socialmedia/post/publishedpost', canActivate: [AuthGuard], component: PublishedpostComponent },
  { path: 'socialmedia/post/savedpost', canActivate: [AuthGuard], component: SavedpostComponent },
  { path: 'socialmedia/post/newpost', canActivate: [AuthGuard], component: DashboardComponent },
  { path: 'socialmedia/post/newpost/:postId/:postStatus', canActivate: [AuthGuard], component: DashboardComponent },
  { path: 'account', canActivate: [AuthGuard], component: AccountsettingsComponent },
  { path: 'account/profile',component: ProfileComponent },
  { path: 'account/billinginformation', component: BillinginformationComponent },
  { path: 'socialManage/twitterSignUp', canActivate: [AuthGuard], component: DashboardComponent },
  { path:'socialmedia/template/newtemplate', canActivate: [AuthGuard], component: NewtemplateComponent},
  // otherwise redirect to home
  { path: '**', redirectTo: 'home' }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
