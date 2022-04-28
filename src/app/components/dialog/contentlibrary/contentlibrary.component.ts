import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ContentLibraryService } from 'src/app/services/content-library.service';

@Component({
  selector: 'app-contentlibrary',
  templateUrl: './contentlibrary.component.html',
  styleUrls: ['./contentlibrary.component.scss']
})
export class ContentlibraryComponent implements OnInit {

  public mediaList: any[] | undefined;
  constructor(
    private contentlibraryService: ContentLibraryService,
    public modal: NgbActiveModal,
    private spinner: NgxSpinnerService,
  ) { }

  ngOnInit(): void {
    this.getMediaList();
  }

  getMediaList() {
    this.spinner.show();
    this.contentlibraryService.retrieveImages().subscribe(res => {
      console.log(res);
      this.spinner.hide();
      this.mediaList = res.data;
    }, (err) => {
      this.spinner.hide();
      this.modal.close();
    });

  }
}
