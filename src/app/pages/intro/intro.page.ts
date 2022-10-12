import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { NavService } from 'src/app/services/Navigation/nav.service';

@Component({
  selector: 'app-intro',
  templateUrl: './intro.page.html',
  styleUrls: ['./intro.page.scss'],
})
export class IntroPage implements OnInit {

  constructor(
    public router:Router,
    public local:LocalStorageService,
    public nav:NavService,
    private menu:MenuController,
    private api:ApiService

  ) { 
    
  }

  ngOnInit() {
  
  }

  ionViewWillLeave() {
  }




}
