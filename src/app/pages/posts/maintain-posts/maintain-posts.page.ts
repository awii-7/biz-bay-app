import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { TagModel } from 'ngx-chips/core/accessor';
import { Observable } from 'rxjs';
import { elementAt, filter } from 'rxjs/operators';
import { of } from 'rxjs';
import { ActionSheetController, LoadingController } from '@ionic/angular';
import { CameraOptions,Camera } from '@ionic-native/camera/ngx';
import { ApiService } from 'src/app/services/api.service';
import { NavService } from 'src/app/services/Navigation/nav.service';
import { HelperService } from 'src/app/services/HelperService/helper.service';
import { TitleValidation } from "../../../models/validator";
import { ToastService } from 'src/app/services/toast/toast.service';
import { Posts } from 'src/app/models/posts';

@Component({
  selector: 'app-maintain-posts',
  templateUrl: './maintain-posts.page.html',
  styleUrls: ['./maintain-posts.page.scss'],
})
export class MaintainPostsPage implements OnInit {
  postForm: FormGroup;
  isSubmitted = false;
  Tags;

  PostImagePath:string;

  constructor(
    public fb:FormBuilder,
    public actionCtrl:ActionSheetController,
    public camera:Camera,
    public api:ApiService,
    public loading:LoadingController,
    public nav:NavService,
    public helper:HelperService,
    public toast:ToastService
    ) { 
      // this.helper.PageName="Create Post";
    }

  ngOnInit() {
        this.postForm = this.fb.group({
          Title:['',[Validators.required, Validators.minLength(4),Validators.maxLength(30)]],
          Description:['',[Validators.required,Validators.minLength(8),Validators.maxLength(70),Validators.nullValidator]],
          Price:['',[Validators.required,Validators.minLength(2),Validators.maxLength(9),Validators.nullValidator]],
          Tags:['',[Validators.required]]
    })
  }

  

  async formSubmit(form){
    let loading =await this.loading.create({
      message:"Creating post...",
      spinner:"bubbles"
    });
    
   this.isSubmitted=true;
    if (!this.postForm.valid) {
      return false;
    } else {
      loading.present();
     form.Tags=this.tagArrayToString(form.Tags);
     let Value=this.postForm.value;
     let PostOBJ:Posts={
       $key:"",
      Title: Value.Title,
      Description: Value.Description,
      Price: Value.Price,
      Tags: Value.Tags,
      ViewCount: 0,
      TotalLike:"0",
      Images: "",
      UserId: this.helper.userData.$key,
      UserName:this.helper.userData.FirstName,
      Status: 'P',
      CreatedDateTime: "",
      ModefiedDateTime: "",
     }
        this.api.createPost(PostOBJ).then(res => {
          if(res){
          loading.dismiss();
          this.postForm.reset();
          this.toast.ShowToast("Post Created. wait for Admin Approved",'s');
          this.nav.goto_mypost();

          
          }
          else
          {
            this.toast.ShowToast("Post not created",'e');
          }
        }).catch(error => console.log(error));
  }
  
  }

  tagArrayToString(tagArray: string[]): string {
    if (Array.isArray(tagArray) && tagArray.length > 0) {
      
      const tags = tagArray.map((e: any) => e.value);
      const tagString = tags.join();
      return tagString;
    } else {
      return '';
    }
  }

async presentActionSheet() {
  let actionSheet = await this.actionCtrl.create({
    buttons: [
      {
        text: 'Choose picture',
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
  this.PostImagePath = "data:image/jpeg;base64," + ImageData;
})

}

async UploadPostImage(){
  return new Promise((resolve,reject)=>{

    this.api.UploadPostImageToFirebase(this.PostImagePath).then((imagepath:any)=>{
      if(imagepath !=undefined){
      
        this.PostImagePath=imagepath;
        return resolve(imagepath);
      }
      else
      {        
        alert("Image Upload Failed");
      }
    },(error)=>{
      return reject(error);
    })
  })

}
TagsLength:boolean=false;
TagsCount=0;
onTagsChange(tags:any[]){
  if(tags !=undefined){
    this.TagsCount=tags.length;
  if(tags.length>5){
    tags.pop();
    this.TagsCount=tags.length;
    return this.TagsLength= true
  }
  else return this.TagsLength= false
}
}

}
