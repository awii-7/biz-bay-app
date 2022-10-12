import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { Posts } from 'src/app/models/posts';
import { ApiService } from 'src/app/services/api.service';
import { NavService } from 'src/app/services/Navigation/nav.service';
import { HelperService } from 'src/app/services/HelperService/helper.service';
import { MenuController } from '@ionic/angular';
import { ToastService } from 'src/app/services/toast/toast.service';
import { PostLike } from 'src/app/models/postLike';
import * as $ from 'jquery';
import { first } from 'rxjs/operators';
// import { PhonegapLocalNotification } from '@ionic-native/phonegap-local-notification/ngx';
// import { LocalNotifications } from '@ionic-native/local-notifications/ngx';


@Component({
  selector: 'app-inflancer-dash',
  templateUrl: './inflancer-dash.page.html',
  styleUrls: ['./inflancer-dash.page.scss'],
})
export class InflancerDashPage implements OnInit {
 userData;
 userID="";
 FavoriteList=[]
  Posts=[];
  SearchPost=""
  post: Posts;
  Greeting:string
  constructor(
    public local:LocalStorageService,
    public api:ApiService,
    public nav:NavService,
    public helper:HelperService,
    private menu:MenuController,
    private toast:ToastService,
    // public localNotifications:PhonegapLocalNotification
    
    
  ) {
    this.Greeting=this.helper.generateGreetings()
    this.GetUserID();
    this.api.NotifBadge();
    // this.simpleNotif();
   }
   ngAfterViewInit(){

     }
Top5Posts=[];
  ngOnInit() {
    let PostRef = this.api.getPostList();
    let likedPost=this.api.getLikePostList();
    PostRef.snapshotChanges().pipe().subscribe(res => {
      this.Posts = [];
      res.forEach(item => {
        let a = item.payload.toJSON();
        a['$key'] = item.key;
        this.Posts.push(a as Posts);
        
        this.Posts.sort(function(a, b){
          // console.table(b.Rating - a.Rating);
          return new Date(b.CreatedDateTime).valueOf() - new Date(a.CreatedDateTime).valueOf(); 
        });
        this.Top5Posts=this.Posts.slice(0,5);
        this.Top5Posts=this.Top5Posts.filter(x=>x.Status=='C');
      })
    })
    likedPost.snapshotChanges().subscribe(res => {
      this.FavoriteList = [];
      res.forEach(item => {
        let a = item.payload.toJSON();
        a['$key'] = item.key;
        this.FavoriteList.push(a as PostLike);
      })
    })
  }


  ionViewWillEnter() {

  }
Counts=0;
iconName="favorite_border"
  LikePost(postid:string){
  
   let p= this.FavoriteList.filter(x=>x.postID==postid && x.isLike==true && x.userID==this.userID);
   this.post=this.Posts.filter(x=>x.$key==postid)[0];
    if(p.length==0){
      let obj={
        $key:"",
        isLike:true,
        postID:postid,
        userID:this.userID,
        CreatedOn:""
      }
      this.FavoriteList.push(obj);
      this.iconName="favorite";
      this.api.LikePost(obj).then((data)=>{
          this.api.UpdateLikeInPost(postid,this.post);
         this.toast.LikeToast("Post Liked",'like');
      })
     
    }
    else
    {
      this.api.LikeRemovedPost(postid,this.post);
      this.api. deleteLikedPost(p[0].$key);
      this.iconName="favorite_border"
      this.toast.LikeToast("Removed Liked",'dislike');
    }
  }

  GetUserID(){
    this.local.get("AuthKey").then((data)=>{
     this.userID=data;
    })
  }

  isPostLiked(key){
   let p= this.FavoriteList.filter(x=>x.postID==key && x.isLike==true && x.userID==this.userID);
   if(p.length>0){
   return this.iconName="favorite";
   }
   else
   {
   return this.iconName="favorite_border"
   }
  }

  GetTotalLikes(key){
   let p= this.FavoriteList.filter(x=>x.postID==key && x.isLike==true).length;
   if(p>0){
     return p;
   }
   else{
     return 0;
   }
  }

  SideMnu(){
    this.menu.toggle();
  }






 
  
  
}
