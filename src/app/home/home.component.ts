import { Component, HostListener, OnInit } from "@angular/core";
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  
  public navIsFixed: boolean;
  viewmore1: boolean;
  viewmore2: boolean;
  slideright:boolean;

  constructor(
  ) {
   }

  ngOnInit() {
  }

  @HostListener("window:scroll", [])
  onWindowScroll() {
    let number = document.body.scrollTop;
    if (number > 30) {
      this.navIsFixed = true;
    } else {
      this.navIsFixed = false;
    }
  }

}
