import { NgModule, CUSTOM_ELEMENTS_SCHEMA,NO_ERRORS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy, NavParams } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ComponentsModule } from './components/components.module';
import { IonicStorageModule } from '@ionic/storage';
import { HttpClientModule } from '@angular/common/http'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule, FaConfig, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { HelperService } from './services/HelperService/helper.service';
import { EmailComposer } from '@ionic-native/email-composer/ngx';
import { LoginPage } from './pages/login/login.page';
import { ToastService } from './services/toast/toast.service';
import { NavService } from './services/Navigation/nav.service';

//  firebase imports, remove what you don't require
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireDatabaseModule} from '@angular/fire/database';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { environment } from 'src/environments/environment';
// import { GoogleAnalytics } from "@ionic-native/google-analytics/ngx";
import { Device } from '@ionic-native/device/ngx';
import { AngularFirestore } from '@angular/fire/firestore';
import { TagInputModule } from 'ngx-chips';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Camera } from "@ionic-native/camera/ngx";
import { SignupPageModule } from './pages/signup/signup.module';
import { LoginPageModule } from './pages/login/login.module';
import { TabsPage } from './pages/tabs/tabs.page';
import { HTTP } from '@ionic-native/http/ngx';
import { ApiService } from './services/api.service';
import { AuthGuardService } from './services/Security/auth-guard.service';
import { LoadingService } from './services/Loading/loading.service';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { SendPorposalComponent } from './components/send-porposal/send-porposal.component';
import { PostDetailPageModule } from './pages/posts/post-detail/post-detail.module';
import { NotificationPageModule } from './pages/notification/notification.module';
import { ShowDetailModalComponent } from './components/show-detail-modal/show-detail-modal.component';
import { UpdateOrderStatusComponent } from './components/update-order-status/update-order-status.component';
import { TrackOrderPageModule } from './pages/orders/track-order/track-order.module';
import { PayOrderPageModule } from './pages/Payments/pay-order/pay-order.module';
import { AddCardComponent } from './components/add-card/add-card.component';
import { ThankYouComponent } from './pages/Payments/thank-you/thank-you.component';
import { FirebaseX } from '@ionic-native/firebase-x/ngx';
import { NotificationService } from './services/notification.service';
// import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
// import { PhonegapLocalNotification } from '@ionic-native/phonegap-local-notification/ngx';



// import { LongPressModule } from 'ionic-long-press';
// import { StarRatingModule } from 'ionic4-star-rating';
// import { Diagnostic } from '@ionic-native/diagnostic/ngx';

// FCM
// import { FCM } from '@ionic-native/fcm/ngx';
@NgModule({

  declarations: [AppComponent, 
       TabsPage
  ],
  entryComponents: [
    SendPorposalComponent,
    ShowDetailModalComponent,
    UpdateOrderStatusComponent,
    AddCardComponent,
    ThankYouComponent,
  
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA,NO_ERRORS_SCHEMA],
  
  imports: [
    BrowserModule, 
    IonicModule.forRoot(), 
    AppRoutingModule,
    TagInputModule,
    FontAwesomeModule,
    ComponentsModule,
    IonicStorageModule.forRoot(),
    HttpClientModule,
    FormsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    AngularFireStorageModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    SignupPageModule,
    LoginPageModule,
    Ng2SearchPipeModule,
    PostDetailPageModule,
    TrackOrderPageModule,
    NotificationPageModule,
    PayOrderPageModule,
    // LongPressModule
    
  ]
  ,
  providers: [
    StatusBar,
    LoginPage,
    HelperService,
    LoadingService,
    EmailComposer,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    FaConfig,
    FaIconLibrary,
    ToastService,
    NavService,
    NotificationService,
    // GoogleAnalytics,
  
    Device,
    AngularFirestore,
    Camera,
    NavParams,
    HTTP,
    ApiService,
    AuthGuardService,
// LocalNotifications,
// PhonegapLocalNotification,

  
    // Diagnostic,
 
    FirebaseX,

    
    
    // FCM,

  ],
  bootstrap: [AppComponent],
 
})
export class AppModule {
  constructor(library:FaIconLibrary){
    library.addIconPacks(fas,fab,far);
  }
}
