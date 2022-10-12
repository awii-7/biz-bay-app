import { Component, OnInit } from '@angular/core';
import { NavService } from 'src/app/services/Navigation/nav.service';
import { HelperService } from 'src/app/services/HelperService/helper.service';
import { Posts } from 'src/app/models/posts';
import { ApiService } from 'src/app/services/api.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { PostLike } from 'src/app/models/postLike';
import { ToastService } from 'src/app/services/toast/toast.service';
import * as $ from 'jquery';

@Component({
  selector: 'app-posts-list',
  templateUrl: './posts-list.page.html',
  styleUrls: ['./posts-list.page.scss'],
})
export class PostsListPage implements OnInit {
  a={
    title:false,
    view:false,
    like:false,
    price:false
  }
  userData;
  userID="";
  FavoriteList=[]
   Posts=[];
   SearchPost=""
   post: Posts;
  constructor(
    public local:LocalStorageService,
    public api:ApiService,
    public nav:NavService,
    public helper:HelperService,
    public toast:ToastService
  ) {
    this.GetUserID();
    this.a.title=true;
   }

  ngOnInit() {
    let bookingRes = this.api.getPostList();
    let likedPost=this.api.getLikePostList();

    bookingRes.snapshotChanges().subscribe(res => {
      this.Posts = [];
      res.forEach(item => {
        let a = item.payload.toJSON();
        a['$key'] = item.key;
        this.Posts.push(a as Posts);
        this.Posts.sort(function(a, b){
          // console.table(b.Rating - a.Rating);
          return new Date(b.CreatedDateTime).valueOf() - new Date(a.CreatedDateTime).valueOf(); 
        });
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
      this.toast.LikeToast("Removed Liked","dislike");
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


  Filter_Post(type:string){
    if(type=="price"){
      this.Posts.sort(function(a, b){
        return b.Price - a.Price
      });
      // this.AddRemoveClass('title');
      this.a={
        like:false,
        price:true,
        title:false,
        view:false
      }

  }
  if(type=="view"){
    this.Posts.sort(function(a, b){
   
      return b.ViewCount - a.ViewCount
    });
    // this.AddRemoveClass('price');
    this.a={
      like:false,
      price:false,
      title:false,
      view:true
    }

  }
  if(type=="like"){
    this.Posts.sort(function(a, b){
    
      return b.TotalLike - a.TotalLike
    });
    this.a={
      like:true,
      price:false,
      title:false,
      view:false
    }
  }
  if(type=="title"){
    this.Posts.sort(function(a, b){
      return new Date(b.CreatedDateTime).valueOf() - new Date(a.CreatedDateTime).valueOf(); 
      // if(a.CreatedDateTime < b.CreatedDateTime) { return -1; }
      // if(a.CreatedDateTime > b.CreatedDateTime) { return 1; }
      // return 0;
    });
    this.a={
      like:false,
      price:false,
      title:true,
      view:false
    }
  }

  }

  AddRemoveClass(id:string){
    let item=document.getElementById(id);
    item.classList.remove('btn-outline-default');
    // item.classList.add('btn-default');
    item.classList.add('active');
  }
  

}
