import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';


@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(

    private toast: ToastController

  ) { }



  //   async presentToastWithOptions(message,position)
  //   {
  //       const toast = await this.toast.create({
  //         message:message,
  //         // showCloseButton:true,
  //         position:position, //'top' or 'bottom'
  //       });
  //       toast.present();
  //      }

  //  async presentFadeToast(message,className)
  // {
  //     const toast = await this.toast.create({
  //       message: message,
  //       duration: 4000,
  //       position:"top",
  //       cssClass:className,
  //     });
  //     toast.present();
  // }

  // ShowToast(message,type) {

  //   // Stop multiple toasts 
  //   try {
  //     this.toast.dismiss().then(() => {
  //     }).catch(() => {
  //     }).finally(() => {
  //       console.log('Closed')
  //     });
  //   } catch(e) {}

  //   this.toast.create({
  //     // header: 'Welcome!',
  //     message: message,
  //     position: 'top',
  //     cssClass: type,

  //   }).then((toast) => {
  //     toast.present();
  //   });
  // }
  ShowToast(msg, type): Promise<boolean> {
   let icon;
    return new Promise(async (resolve, reject) => {
      if(type=='s'){icon='checkmark-outline'}else if(type=='e'){icon='bug-outline'}else{icon='alert-circle-outline'}
      const toast = await this.toast.create({
        message: msg,
        duration: 2000,
        position: 'top',
        cssClass: type,
        buttons:
          [
            {
             icon:icon,
             side:"start",
             
            }
          ]
      });
      toast.present();
    });
  }

  LikeToast(msg,type): Promise<boolean> {
    let icon;
     return new Promise(async (resolve, reject) => {
      
       const toast = await this.toast.create({
         message: msg,
         duration: 2000,
         position: 'top',
         cssClass: type,
         buttons:
           [
             {
              icon:type=='like'?"heart":"heart-dislike",
              side:"start",
              
             }
           ]
       });
       toast.present();
     });
   }
}
