import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

import { LocalStorageService } from 'src/app/services/local-storage.service';

@Component({
  selector: 'app-sidemenu',
  templateUrl: './sidemenu.component.html',
  styleUrls: ['./sidemenu.component.scss'],
})
export class SidemenuComponent implements OnInit {

 
  constructor(public router: Router, public alertController: AlertController,  public ls: LocalStorageService ) { }

  ngOnInit() {
  }






}
