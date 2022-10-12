import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { Posts } from 'src/app/models/posts';
import { ApiService } from 'src/app/services/api.service';
import { HelperService } from 'src/app/services/HelperService/helper.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { NavService } from 'src/app/services/Navigation/nav.service';

@Component({
  selector: 'app-myposts',
  templateUrl: './myposts.page.html',
  styleUrls: ['./myposts.page.scss'],
})
export class MypostsPage implements OnInit {
  segment;
  postForm: FormGroup;
  PostList=[];
  TempPostList=[];

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
    isVerified: 0,
    ProfilePic:""

  }
  constructor(
    public nav:NavService,
    private api: ApiService,
    private router: Router,
    public fb: FormBuilder,
    public helper:HelperService,
    public local:LocalStorageService
    
  ) { 
    // this.helper.PageName="Chat";
    this.segment="all"
   
  }

  ngOnInit() {
    // this.postForm = this.fb.group({
    //   title: [''],
    //   type: [''],
    // })
    this.api.NotifBadge()
    this.local.get("AuthKey").then(key=>{
      if(key !=undefined){
      let PostRes=this.api.getPostList();
        PostRes.snapshotChanges().subscribe(res => {
          this.PostList = [];
          this.TempPostList=[];
          res.forEach(item => {
            let a = item.payload.toJSON();
            a['$key'] = item.key;
            
            this.TempPostList.push(a);

            for (let index = 0; index < this.TempPostList.length; index++) {
   
            }
            if(this.TempPostList.length !=0){
            this.PostList=this.TempPostList.filter(x=>x.UserId==key && x.Status==="C");
            this.helper.TotalPosts=this.PostList.length;
            this.PostList.sort(function(a, b){
              // console.table(b.Rating - a.Rating);
              return new Date(b.CreatedDateTime).valueOf() - new Date(a.CreatedDateTime).valueOf(); 
            });
            }
          })
        })
      }
  })
}


 totalPost;
  // fetchPosts() {

  //   this.local.get("AuthKey").then(key=>{
  //     if(key !=undefined){
  //       this.api.GetAllPostByID(key).then((posts:any)=>{
  //         if(posts !=undefined){
  //           this.PostList=posts
  //           this.helper.TotalPosts=this.PostList.length;
  //         }
  //       })

  //     }
  //   })

  // }

  deletePost(id) {
    console.log(id)
    if (window.confirm('Do you really want to delete?')) {
      this.api.deletePost(id)
    }
  }



}
