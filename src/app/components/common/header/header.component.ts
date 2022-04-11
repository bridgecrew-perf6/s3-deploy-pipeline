import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LogoutComponent } from '../../dialog/logout/logout.component';
import { SocialMediaComponent } from '../../dialog/social-media/social-media.component';
import { ProfileService } from 'src/app/services/usermanagement/profile.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  
  constructor(private modalService: NgbModal,
    public profileService: ProfileService) {}
    

  ngOnInit(): void {
  }

  
  openLogoutModal()
  {
    const modalRef = this.modalService.open(LogoutComponent, { backdropClass: 'in', centered: true  });
  }

  openSocialModal()
  {
    const modalRef = this.modalService.open(SocialMediaComponent, { backdropClass: 'in', windowClass: 'in', size:'xl', centered: true  });
  }
}
