import { Component, Pipe } from '@angular/core';
import { ChangeDetectionStrategy, ViewChild, TemplateRef, } from '@angular/core';
import { startOfDay, endOfDay, subDays, addDays, endOfMonth, isSameDay, isSameMonth, addHours, } from 'date-fns';
import { Subject } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CalendarEvent, CalendarEventAction, CalendarEventTimesChangedEvent, CalendarView, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { SocialDropDown, SocialProfile } from 'src/app/model/socialProfile';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { TwitterService } from 'src/app/services/socialmedia/twitter.service';
import { FacebookAKService } from 'src/app/services/socialmedia/facebook.ak.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ProfileService } from 'src/app/services/usermanagement/profile.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ManageaccountService } from 'src/app/services/manageaccount.service';
import { ToastrService } from 'ngx-toastr';


const colors: any =
{
  red:
  {
    primary: '#ad2121',
    secondary: '#FAE3E3',
  },
  blue:
  {
    primary: '#1e90ff',
    secondary: '#D1E8FF',
  },
  yellow:
  {
    primary: '#e3bc08',
    secondary: '#FDF1BA',
  }
};




@Component({
  selector: 'app-schedule',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss']
})



export class ScheduleComponent {
  public showFacebookPreview: boolean = false;
  public showTwitterPreview: boolean = false;
  public dropdownList: any[] = [];
  images = [] as any;
  userSocialProfile: SocialProfile | undefined;

  dropdownSettings: IDropdownSettings = {
    singleSelection: false,
    idField: 'socialId',
    textField: 'socialName',
    enableCheckAll: false,
    itemsShowLimit: 5,
    allowSearchFilter: false,
  };
  userId: string | undefined;

  selectedSocailProfile: SocialDropDown[] = [];
  selectedFilterSocailProfile: SocialDropDown[] = [];

  constructor(private modal: NgbModal,
    private toastr: ToastrService,
    private twitterService: TwitterService,
    public route: ActivatedRoute,
    private router: Router,
    private manageaccountService: ManageaccountService,
    public profileService: ProfileService,
    private spinner: NgxSpinnerService) { }


  eventsOriginal: CalendarEvent[] = [];
  events: CalendarEvent[] = [];

  ngOnInit(): void {
    this.spinner.show();
    this.retrieveSocialMediProfile();
    this.retrieveScheduledEvents();
  }


  retrieveScheduledEvents() {
    this.events = [];
    this.twitterService.retrieveAllSocialPost(false, false, true).subscribe(res => {
      //process scheduled
      if (res.data && res.data.scheduled && res.data.scheduled) {
        res.data.scheduled.forEach((scheduled: any) => {
          const startDate = new Date(scheduled.scheduleTime);
          const endDate = new Date(startDate.getTime() + (30 * 60000));
          this.events.push({
            id: scheduled._id,
            meta: {
              fbpost: scheduled.fbpost,
              tweetData: scheduled.tweetData,
            },
            start: startDate,
            end: endDate,
            title: scheduled.postData,
            color: colors.yellow,
            actions: this.actions,

          }
          )
        });
        console.log(this.events.length)
        this.eventsOriginal = JSON.parse(JSON.stringify(this.events));
        this.refresh.next();
      }
      this.spinner.hide();
    })

  }

  @ViewChild('modalContent', { static: true }) modalContent: TemplateRef<any> | undefined;

  view: CalendarView = CalendarView.Week;

  CalendarView = CalendarView;

  viewDate: Date = new Date();


  modalData?: {
    action: string;
    event: CalendarEvent;
  }

  actions: CalendarEventAction[] = [
    {
      label: '<i class="fas fa-fw fa-pencil-alt"></i>',
      a11yLabel: 'Edit',
      onClick: ({ event }: { event: CalendarEvent }): void => {

        this.router.navigate([`socialmedia/post/newpost/${event.id}/scheduled`]);
      },
    },
    {
      label: '<i class="fas fa-fw fa-trash-alt"></i>',
      a11yLabel: 'Delete',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.events = this.events.filter((iEvent) => iEvent !== event);
        this.deletePost(event);
      },

    },
  ];

  refresh: Subject<any> = new Subject();

  activeDayIsOpen: boolean = true;

  deletePost(event: any) {
    this.spinner.show();
    this.twitterService.deletePost(event.id, 'scheduled').subscribe(res => {
      this.toastr.info(res.status);
      this.retrieveScheduledEvents();
    });
  }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
      this.viewDate = date;
    }
  }

  eventTimesChanged({
    event,
    newStart,
    newEnd,
  }: CalendarEventTimesChangedEvent): void {
    this.events = this.events.map((iEvent) => {
      if (iEvent === event) {
        return {
          ...event,
          start: newStart,
          end: newEnd,
        };
      }
      return iEvent;
    });
    this.handleEvent('Dropped or resized', event);
  }

  handleEvent(action: string, event: CalendarEvent): void {
    this.modalData = { event, action };
    this.modal.open(this.modalContent, { size: 'lg' });
  }

  addEvent(): void {
    this.events = [
      ...this.events,
      {
        title: 'New event',
        start: startOfDay(new Date()),
        end: endOfDay(new Date()),
        color: colors.red,
        draggable: true,
        resizable: {
          beforeStart: true,
          afterEnd: true,
        },
      },
    ];
  }

  deleteEvent(eventToDelete: CalendarEvent) {
    this.events = this.events.filter((event) => event !== eventToDelete);
  }

  setView(view: CalendarView) {
    this.view = view;
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
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
          this.images.push({ profile: 'facebook' })
          this.dropdownList.push({ socialType: 'facebook', userId: scMedia.userId, pageId: fbpage.id, socialName: fbpage.name });
        });
      } else if (scMedia.name == 'twitter') {
        this.images.push({ profile: 'twitter' })
        this.dropdownList.push({ socialType: 'twitter', userId: scMedia.userId, socialName: scMedia.screenName });
      }
    })
  }

  filterCalendar() {
    const eventsFilter = JSON.parse(JSON.stringify(this.eventsOriginal));
    const filterSocial: string[] = [];
    this.dropdownList.forEach(socialProfile => {
      if (socialProfile.checked) {
        filterSocial.push(socialProfile.pageId || socialProfile.userId);
      }
    })
    if (filterSocial.length > 0) {
      this.events = eventsFilter.filter((event: any) => {
        let filter = false;
        event.meta.fbpost.forEach((post: any) => {
          if (filterSocial.indexOf(post.pageId) != -1) {
            filter = true;
          }
        });
        event.meta.tweetData.forEach((tweet: any) => {
          if (filterSocial.indexOf(tweet.userId) != -1) {
            filter = true;
          }
        });
        return filter;
      });
    } else {
      this.events = eventsFilter;
    }

    this.events.forEach(event => {
      event.start = startOfDay(new Date(event.start));
      if (event.end) {
        event.end = startOfDay(new Date(event.end));
      }
    })
    this.refresh.next();
  }
}

