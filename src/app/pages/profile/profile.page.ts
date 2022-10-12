import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HelperService } from 'src/app/services/HelperService/helper.service';
import { NavService } from 'src/app/services/Navigation/nav.service';
import { ApiService } from 'src/app/services/api.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { UsersRegistration } from 'src/app/models/usersRegistration';
import { LoadingController, ActionSheetController } from '@ionic/angular';
import { AngularFireUploadTask } from '@angular/fire/storage/task';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/storage';
import {Camera,CameraOptions} from '@ionic-native/camera/ngx'
import { ToastService } from 'src/app/services/toast/toast.service';


export interface MyData {
  name: string;
  filepath: string;
  size: number;
}
@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  user:UsersRegistration;

   // Upload Task 
   task: AngularFireUploadTask;

   // Progress in percentage
   percentage: Observable<number>;
 
   // Snapshot of uploading file
   snapshot: Observable<any>;
 
   // Uploaded File URL
   UploadedFileURL: Observable<string>;
 
   //Uploaded Image List
   images: Observable<MyData[]>;
 
   //File details  
   fileName:string;
   fileSize:number;
 
   //Status check 
   isUploading:boolean;
   isUploaded:boolean;

   private imageCollection: AngularFirestoreCollection<MyData>;

  Bdata = {
    FirstName: "",
    LastName: "",
    UserType: 1,// 1-Buisnessman  2-Inflaucer 3- Admin
    UserName: "",
    Password: "",
    Email: "",
    SocialUserName: "",
    SocialType: 0, // 1 - Insta  2- Twitter -3 Facebook
    Address: "",
    City: "",
    Cellno: "",
    CompanyName: "",
    IsActive: 1,
    followercount: 0,
    isVerified: 0
  }
  constructor(
    public route:Router,
    public helper:HelperService,
    public nav:NavService,
    public api:ApiService,
    private local:LocalStorageService,
    public loading:LoadingController,
    public actionsheet:ActionSheetController,
    public database:AngularFirestore,
    public storage:AngularFireStorage,
    public camera:Camera,
    public actionCtrl:ActionSheetController,
    public toast:ToastService
  ) {
    this.helper.PageName="Profile";
   }

  ngOnInit() {
   this.api.NotifBadge();
  }

  goto_profile(){
    this.route.navigate(['profile']);
  }

  async presentActionSheet() {
    let actionSheet =await this.actionCtrl.create({
      
      buttons: [
        {
          text: 'Take a picture',
          handler: () => {
            this.imageCaptured();
          }
        },
        {
          text: 'Choose pictures',
          handler: () => {
            this.imageCapturedGallery();
          }
        }
      ]
    });
    actionSheet.present();
  }



  
  imageCapturedGallery() {
    const options: CameraOptions = {
      quality: 70,
      // targetHeight:400,
      // targetWidth:400,
      destinationType: this.camera.DestinationType.DATA_URL,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      saveToPhotoAlbum: false
    }
    this.camera.getPicture(options).then(ImageData => {
      this.helper.userData.ProfilePic = "data:image/jpeg;base64," + ImageData;
  })
  
  }

  imageCaptured() {
    const options: CameraOptions = {
      quality: 70,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }
    this.camera.getPicture(options).then((ImageData => {
      // this.base64img = "data:image/jpeg;base64," + ImageData;
      this.helper.userData.ProfilePic = "data:image/jpeg;base64," + ImageData;

    }), error => {
      console.log(error);
    })
  }
  
  async UploadProfilePic(){
  
    return new Promise((resolve,reject)=>{
      if(this.helper.userData.ProfilePic.startsWith('data')){
      this.api.UploadProfilePicToFirebase(this.helper.userData.ProfilePic).then((imagepath:any)=>{
        if(imagepath !=undefined){
        
          this.helper.userData.ProfilePic=imagepath;
          return resolve(imagepath);
        }
        else
        {        
          alert("Image Upload Failed");
        }
      },(error)=>{
        return reject(error);
      })
    }
    else{
      return resolve(this.helper.userData.ProfilePic);
    }
    })
  
  }
  


  async UpdateProfile(){
    let Key:any;
    this.local.get("AuthKey").then(async keys=>{
      Key=keys;
      let loading= await this.loading.create({
        message:"Updating profile ..."
      }
      )
      loading.present();
      this.UploadProfilePic().then((imagepath:string)=>{
        loading.dismiss();
        this.api.getUserById(Key).valueChanges().subscribe(u=>{
         let Modified= new Date().toLocaleString()
          let user={
            FirstName: this.helper.userData.FirstName,
            LastName: this.helper.userData.LastName,
            UserName: this.helper.userData.UserName,
            Password: this.helper.userData.Password,
            Email: this.helper.userData.Email,
            Address: this.helper.userData.Address,
            City: this.helper.userData.City,
            Cellno: this.helper.userData.Cellno,
            ProfilePic: imagepath,
            ModifiedOn:Modified,
            SocialType:u.SocialType,
            SocialUserName:u.SocialUserName,
            UserType:u.UserType,
            CompanyName: "",
            IsActive: "1",
            followercount:u.followercount,
            isVerified:u.isVerified,
            Token:u.Token,
            CreatedOn:u.CreatedOn,
            Rating:u.Rating,
            TotalStars:u.TotalStars,
            OrderCount:u.OrderCount,
            fcmToken:u.fcmToken

          }
          this.api.updateUserProfile(Key,user).then((result) => {
            if(result ==true){
              this.helper.userData={
                $key:Key,
                FirstName: user.FirstName,
                LastName: user.LastName,
                UserName: user.UserName,
                Password: user.Password,
                Email: user.Email,
                Address: user.Address,
                City: user.City,
                Cellno: user.Cellno,
                ProfilePic: imagepath,
                ModifiedOn:Modified,
                SocialType:user.SocialType,
                SocialUserName:user.SocialUserName,
                UserType:user.UserType,
                CompanyName: user.CompanyName,
                IsActive: user.IsActive,
                followercount:user.followercount,
                isVerified:user.isVerified,
                Token:user.Token,
                CreatedOn:user.CreatedOn,  
                Rating:user.Rating,
                TotalStars:user.TotalStars,
                OrderCount:user.OrderCount,
                fcmToken:user.fcmToken
              }
  
            
            this.local.set("userData",this.helper.userData);
            this.toast.ShowToast("Profile Updated","s");
            loading.dismiss();
            }
            else
            {
              // this.helper.ShowAlert("Profile not Update","top-end","e");
            this.toast.ShowToast("Profile not Update","e");
              loading.dismiss();
            }
             }).catch(error =>{ console.log(error); loading.dismiss()});
        
        },(error)=>{
          loading.dismiss();
        }
        
        );
    
  
        })  
      })
      //this.UploadedFileURL.subscribe(res=>{this.filepath=res});
     
  }
}
