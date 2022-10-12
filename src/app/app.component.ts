import { Component } from '@angular/core';

import { Platform, NavController, MenuController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { LocalStorageService } from './services/local-storage.service';
import { NavigationEnd, Router } from '@angular/router';
import { HelperService } from './services/HelperService/helper.service';
import { NavService } from './services/Navigation/nav.service';
// import { GoogleAnalytics } from '@ionic-native/google-analytics/ngx';
import { Device } from '@ionic-native/device/ngx';
import { ApiService } from './services/api.service';
import { FirebaseX } from '@ionic-native/firebase-x/ngx';
import { ApiHelperService } from './services/api-helper.service';
// import { LocalNotifications } from '@ionic-native/local-notifications/ngx';




// import { FCM } from '@ionic-native/fcm/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  Active;
  AuthKey;
  MyWallet=0
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private local: LocalStorageService,
    private route: Router,
    private helper: HelperService,
    private nav: NavService,
    private navCtrl: NavController,
    // private ga: GoogleAnalytics,
    private device: Device,
    private menu: MenuController,
    private router: Router,
    private api: ApiService,
    public firebaseX:FirebaseX,
    public apuhelper:ApiHelperService,
    // public localNotification:LocalNotifications


    // private network:Netw
    // private fcm:FCM

  ) {
    this.initializeApp();
    this.helper.PageName = "Business Dash";

    // console.log('Device UUID is: ' + this.device.cordova);
    // this.GetRanking();

  }
  // Toogle = true
  initializeApp() {
    this.platform.ready().then(() => {
      // this.apuhelper.Postfcm()
// Schedule a single notification
this.fcmNotificationInit().then((isFCM)=>{
  if(isFCM){
    this.local.get("AuthKey").then((key)=>{
      if(key){
      this.api.isFCM(isFCM).then((data:any)=>{
        
        if(data.fcmToken=="null" && data.key===key){

          console.log(data);
          this.api.updateToken(key,isFCM);
        }
        else
        {
          console.log(data);
          for (let index = 0; index < data.length; index++) {
            if(data[index].key===key){
            }
            else{
            this.api.updateToken(data[index].key,"null");
            }
            
          }
        }
      })
    }
    })

  }
})
this.GetWallet()



      // this.InitializeOneSignal();
      // let disconnectSubscription = this.network.onDisconnect().subscribe(() => {
      //   alert('network was disconnected :-(');
      //    const toast = await this.toastController.create({
      //     message: 'You are appear to be offline. Please try again!.',
      //     showCloseButton: true
      //   });
      //   toast.present();
      // });
   
      // let connectSubscription = this.network.onConnect().subscribe(() => {
      //   alert('network connected!');
      // });


    //  this.Check()
      // this.local.get("userData").then((data)=>{
      //   if(data !=undefined){
      //     this.helper.userData=data
      //     this.navCtrl.navigateRoot(['bizdash']); 
      //   }
      //   else{
      //     this.navCtrl.navigateRoot(['intro']); 
      //   }
      // })
      console.log('this.router.url',this.router.getCurrentNavigation());
      this.statusBar.backgroundColorByHexString("#3629b7");
      this.splashScreen.hide();

      // this.local.get("userData").then((data)=>{
      //   this.helper.userData=data;
      // })
    //   this.ga.startTrackerWithId('UA-187183936-1')
    //     .then(() => 
    //     { 
    //       console.log("Connected") 
    //       this.ga.trackView('Outbox');

    //   }).catch(e => console.log('Error starting GoogleAnalytics == ' + e));
    // let currenturl=this.router.getCurrentNavigation().extractedUrl.toString();
    // this.firebaseAnalytics.setCurrentScreen(currenturl).then((res)=>{
    //   console.log(res)
    // }).catch((error)=>console.error(error))
  //   this.firebaseAnalytics.logEvent('page_view', {
  //     page: 'dashborad',
  //   })
  // .then((res: any) => console.log(res))
  // .catch((error: any) => console.error(error));

     });

    
    // subscribe to a topic
    // this.fcm.subscribeToTopic('Deals');

    // // get FCM token
    // this.fcm.getToken().then(token => {
    //   console.log(token);
    // });

    // // ionic push notification example
    // this.fcm.onNotification().subscribe(data => {
    //   console.log(data);
    //   if (data.wasTapped) {
    //     console.log('Received in background');
    //   } else {
    //     console.log('Received in foreground');
    //   }
    // });      

    // // refresh the FCM token
    // this.fcm.onTokenRefresh().subscribe(token => {
    //   console.log(token);
    // });
    // this.helper.GetDaysofRegistration(this.helper.userData.CreatedOn);
    // unsubscribe from a topic
    // this.fcm.unsubscribeFromTopic('offers');

    this.api.authState.subscribe(state => {
      if (state) {
        if (this.helper.userData.UserType == "1" && this.helper.userData.isVerified=="1") {
          this.local.get("AuthKey").then(key=>{
            
              this.nav.goto_bizdash();

            });
        }
        if (this.helper.userData.UserType == "2" && this.helper.userData.isVerified=="1") {
          this.local.get("AuthKey").then(key=>{
              this.nav.goto_inflancerdash();
          })
        
        }
        if (this.helper.userData.UserType == "3" && this.helper.userData.isVerified=="1") {
          this.local.get("AuthKey").then(key=>{
              this.nav.goto_admin()
          })
        
        }

      }

      else {

        this.router.navigate(['intro']);

      }

    });

  }

// InitializeOneSignal(){
//   this.oneSignal.startInit('03586961-fb7a-42cc-ae90-66cecfbd4a95', '784694674805');

// this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.InAppAlert);


// this.oneSignal.handleNotificationReceived().subscribe(() => {
//  // do something when notification is received
// });

// this.oneSignal.handleNotificationOpened().subscribe(() => {
//   // do something when a notification is opened
// });

// this.oneSignal.endInit();
// }



// Check(){
//   setTimeout(()=>{

//     if(this.helper.userData.$key==""){
//       this.menu.enable(false);
//       }
//       else{
//       this.menu.enable(true);
  
//       }
//   },300)
// }

CloseMenu(){
  this.menu.close();
}

goto_mypost(){
  this.menu.toggle();
  this.nav.goto_mypost();
  
}


fcmNotificationInit(){
 
  return new Promise((resolve,error)=>{
  this.firebaseX.getToken()
  .then((token)=>{ 
    this.local.set("fcmToken",token)
    return resolve(token)
  }) // save the token server-side and use it to push notifications to this device
  .catch(error => console.error('Error getting token', error));

this.firebaseX.onMessageReceived()
  .subscribe((data) =>

  this.route.navigate([data.page,data.id])
    //  console.log(`User opened a notification ${data}`) 
     );
this.firebaseX.onTokenRefresh()
  .subscribe((token:string)=>{ 
    this.local.set("fcmToken",token)
    return resolve(token)
  });

  this.firebaseX.hasPermission().then((hasPermission)=>{
    if(!hasPermission){
        this.firebaseX.grantPermission().then((permissionGranted)=>{
            if(permissionGranted){
                console.log("Permission granted");
            }else{
                console.warn("Permission denied");
            }
        });
    }else{
        console.log("Permission already granted");
    }
    });
  })
}

GetWallet(){
  this.local.get("AuthKey").then((key)=>{
    this.api.isWalletExist(key).then((data)=>{
      if(data){
        this.MyWallet=data.Balance
      }
      else
      {
        this.MyWallet=0
      }
         }) 
  })
 
}







}




