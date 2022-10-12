import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  constructor(
    public loadingController: LoadingController
  ) { }

  // This will show then autohide the loader
  ShowLoading(message:string) {
   return new Promise((resolve,reject)=>{
    this.loadingController.create({
      message: message,
      duration: 2000
    }).then((res) => {
      res.present();
      res.onDidDismiss().then((dis) => {
        console.log('Loading dismissed! after 2 Seconds', dis);
       return resolve(true);
      });

    });
   })


  }

  ShowPostListLoading(message:string) {
    return new Promise((resolve,reject)=>{
     this.loadingController.create({
       message: message,
       duration: 300
     }).then((res) => {
       res.present();
       res.onDidDismiss().then((dis) => {
         console.log('Loading dismissed! after 300 Mili Seconds', dis);
        return resolve(true);
       });
 
     });
    })
 
 
   }

  // Show the loader for infinite time
  Show(message:string) {

    this.loadingController.create({
      message: message
    }).then((res) => {
      res.present();
    });

  }

  // Hide the loader if already created otherwise return error
  Hide() {

    this.loadingController.dismiss().then((res) => {
      console.log('Loading dismissed!', res);
    }).catch((error) => {
      console.log('error', error);
    });

  }


}