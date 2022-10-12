import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { NavService } from 'src/app/services/Navigation/nav.service';
import { ApiHelperService } from 'src/app/services/api-helper.service';
import { ApiService } from 'src/app/services/api.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { HelperService } from 'src/app/services/HelperService/helper.service';
import { PostComments } from 'src/app/models/postComments';
import { Posts } from 'src/app/models/posts';
import { SendPorposalComponent } from 'src/app/components/send-porposal/send-porposal.component';


@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.page.html',
  styleUrls: ['./post-detail.page.scss'],
})
export class PostDetailPage implements OnInit {
  InfluencerData;
BizmanData;
  PostID
  Postcomment:string="";
  PostDetail={
    key:"",
    Title:"",
    Description:"",
    CreatedDate:"".split(",")[0],
    CreatedTime:"".split(",")[1],
    Price:"",
    Views:"",
    Tags:[],
    TotalLike:"",
    UserID:"",
    UserName:"",
    ViewCount:""
  };
  Postedby;
  tags:string;

   post: Posts;

  CommentList = [];
  TempCommentList=[];
  constructor(
    public navParam:NavParams,
    public route:ActivatedRoute,
    public nav:NavService,
    public api:ApiService,
    public local:LocalStorageService,
    public helper:HelperService,
    public modal:ModalController
  ) {
     this.route.params.subscribe(params => {
      this.PostID = params['postid']; 
     
       // Get Single
       this.api.getPostById(this.PostID).valueChanges().subscribe(res => {
        this.PostDetail.CreatedDate=res.CreatedDateTime;
        this.PostDetail.CreatedTime=res.CreatedDateTime;
        this.PostDetail.Description=res.Description;
        this.PostDetail.Price=res.Price;
        this.PostDetail.Title=res.Title;
        this.PostDetail.Views=res.ViewCount;
        this.tags=res.Tags;
        this.PostDetail.Tags=res.Tags;
        let sliptedTaags= this.tags.split(",");
        this.PostDetail.Tags=sliptedTaags
        this.PostDetail.TotalLike=res.TotalLike;
        this.PostDetail.UserID=res.UserId
        this.PostDetail.key=this.PostID;
        this.PostDetail.ViewCount=res.ViewCount;
        this.PostDetail.UserName=res.UserName
      // this.api.UpdatePost(this.PostID,res);
        this.post=res
        this.api.getUserById(res.UserId).valueChanges().subscribe(result=>{
          
          this.Postedby=result.FirstName==undefined?"":result.FirstName +" "+ result.LastName==undefined?"":result.LastName
        })
      })
      
if(this.post==undefined){
  setTimeout(()=>{
    
    this.api.UpdatePost(this.PostID,this.post);
  },1000)
}        


 });

   }
   TotalProposal
  ngOnInit() {
    let PostRes=this.api.getCommentList();
    PostRes.snapshotChanges().subscribe(res => {
      this.CommentList = [];
      this.TempCommentList=[];
      res.forEach(item => {
        let a = item.payload.toJSON();
        a['$key'] = item.key;
        this.TempCommentList.push(a as PostComments);
        if(this.TempCommentList.length !=0){
        this.CommentList=this.TempCommentList.filter(x=>x.PostID==this.PostID);
      
        }
      })
    })
    this.api.GetTotalProposalCount(this.PostID).then((data)=>{
      if(data){
     this.TotalProposal=data;
      }
    })
  }

  PostComment(){
    if(this.Postcomment !=""){
    let CurrentDate=new Date().toLocaleString().split(",")[0];
    let CurrentTime=new Date().toLocaleString().split(",")[1].replace(" ","");
    this.local.get('AuthKey').then(key=>{ 
      if(key !=undefined){
        let obj={
          $key:"",
          Comment: this.Postcomment,
          CommentTime:CurrentTime,
          CommentDate:CurrentDate,
          CommentedByID:key,
          CommentedByName:this.helper.userData.FirstName +" "+this.helper.userData.LastName,
          PostID:this.PostID,
          CreatedDateTime:CurrentDate 
        }
             this.api.Comments(obj).then(res => {
               console.log(res)

             }).catch(error => console.log(error));
       }
      })
   
   
    }
    else
    {
      this.helper.ShowAlert("Please write comment first","top-end","warming");
    }
   }
   commentplaceholder="Write comment here";
   showreplyDiv=false;
   ReplyBtn(){
      this.showreplyDiv =true;
      // window.location.hash = '#WritecommentDiv';
      // document.getElementById('WritecommentDiv').scrollIntoView();
      this.commentplaceholder="Reply to Shahzaib"

   }
 
   ReplyCancelBtn(){
      this.showreplyDiv =false;
      this.commentplaceholder="Write comment here"
     
    
   }

   async OpenPorposalModal(bizmanID) {

    this.GetAllProposalData(bizmanID).then(async ()=>{
      let data={
        Porposal_on_Post : this.PostDetail,
        Porposal_Sent_By:this.InfluencerData,
        Post_Created_By:this.BizmanData,
      }
      this.helper.setPerposalData(data);

      const modal = await this.modal.create({
        component: SendPorposalComponent
      });
      modal.onDidDismiss().then((data) => {
      console.log(data);
      });
      return await modal.present();

    })
  }

  GetAllProposalData(bizmanID):Promise<any>{
    let d;
    return new Promise((resolve,reject)=>{
      this.api.getUserByIds(bizmanID).then((BData)=>{
        if(BData !=undefined){
          
          const {Password, ...d} = BData
          this.BizmanData=d;
          this.BizmanData.key=bizmanID
        }
        this.local.get("userData").then((IData)=>{
          if(IData !=undefined){
            const {Password, ...d} = IData
            // let new=Object.assign(d,)
            this.InfluencerData=d
            this.InfluencerData["key"] = this.InfluencerData['$key'];
            delete this.InfluencerData["$key"];
            return resolve(true);
          }
        })

      })
    })
  }




    
   


  }




