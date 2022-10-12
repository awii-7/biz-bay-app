import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor(
    public alertCtrl:AlertController
  ) { }

 async Confirm(func,buttontext,message) {
    let alert = await this.alertCtrl.create({
      header:"Confirm?",
      message: message,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: buttontext,
          handler: () => {
            func
          }
        }
      ]
    });
    alert.present();
  }
}
