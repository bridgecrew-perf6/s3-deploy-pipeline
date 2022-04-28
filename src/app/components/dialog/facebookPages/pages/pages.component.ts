import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss']
})
export class PagesComponent implements OnInit {

  messageData: {
    facebookPages: any;
  } | undefined;

  constructor(public modal: NgbActiveModal) { }

  ngOnInit(): void {
  }

}
