import { Component, OnInit } from '@angular/core';
import { MenuController, ActionSheetController, AlertController } from '@ionic/angular';
import { notifications } from 'src/app/models/notifications';
import { Posts } from 'src/app/models/posts';
import { Transactions } from 'src/app/models/transactions';
import { ApiService } from 'src/app/services/api.service';
import { HelperService } from 'src/app/services/HelperService/helper.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { NavService } from 'src/app/services/Navigation/nav.service';
import { ToastService } from 'src/app/services/toast/toast.service';

@Component({
  selector: 'app-posts-list',
  templateUrl: './posts-list.page.html',
  styleUrls: ['./posts-list.page.scss'],
})
export class PostsListPage implements OnInit {
PostList=[]
  constructor(
    public local:LocalStorageService,
    public api:ApiService,
    public nav:NavService,
    public helper:HelperService,
    private menu:MenuController,
    private toast:ToastService,
    public actionCtrl:ActionSheetController,
    public alertCtrl:AlertController
  ) { }

  ngOnInit() {
  let p = this.api.getPostList();
  p.snapshotChanges().subscribe(res => {
    this.PostList = [];
    res.forEach(item => {
      let a = item.payload.toJSON();
      a['key'] = item.key;
      
      this.PostList.push(a as Posts);
  
      })
    })
}

async presentActionSheet(id,obj) {

  let actionSheet =await this.actionCtrl.create({
    
    buttons: [
      {
       
        text: 'Approve Post',
        icon:"checkmark-done-outline",
        handler: () => {
          // this.PayConfirm(id)
          // this.imageCaptured();
          this.Approve(id,obj)
        }
      },
      {
        text: 'Reject Post',
        icon:"close-outline",
        handler: () => {
          // this.imageCapturedGallery();
          // this.presentAlert(id)
          this.Reject(id,obj)
        }
      },
      {
        text: 'Delete Post',
        icon:"trash-outline",
        handler: () => {
          // this.imageCapturedGallery();
          // this.presentAlert(id)
          this.DeletePost(id,obj)
        },
       

      },
      {
        text: 'View Post',
        icon:"eye-outline",
        handler: () => {
          // this.imageCapturedGallery();
          // this.presentAlert(id)
          this.DeletePost(id,obj)
        },
       

      }
    ]
  });
  actionSheet.present();

}


Approve(id,obj){
  this.api.ApprovePost(id).then((data)=>{
    if(data){
      this.toast.ShowToast("Post Approved",'s');
      this.SaveNotification(1,obj)

    }
  })
}

Reject(id,obj){
  this.api.RejectPost(id).then((data)=>{
    this.toast.ShowToast("Post Rejected",'s');
    this.SaveNotification(2,obj)

  })
}

DeletePost(id,obj){
  this.api.deletePost(id);
  this.toast.ShowToast("Post Deleted",'s');
  this.SaveNotification(3,obj)

}

SaveNotification(type,obj){
  let text=""
  let message=""
  let types=""
  if(type==1){text="Post Accepted";message="Admin Accepted your post";types="postAccepted"}
  if(type==2){text="Post Rejected";message="Admin Rejected your post";types="postRejected"}
  if(type==3){text="Post Deleted";message="Admin Deleted your post";types="postDeleted"}
  
  if(obj !=undefined){
    let n:notifications={
      $key:"",
      Title:text,
      Message:message,
      InfluencerID:"",
      InfluencerName:"",
      PostID:obj.key,
      ProposalID:"",
      OrderID:"",
      BizmanID:obj.UserId,
      BizmanName:obj.UserName,
      Status:"P",
      Type:types,
      isSeen:false,
      UserType:'1',
      isDismiss:false,
      isActive:true,
      CreatedDateTime:this.helper.formateDatePK(),
      ModifiedOn:"",
      SeenDateTime:"",
      WalletID:""

    }
    this.api.SaveNotification(n).then((data)=>{
      if(data){
        console.log("order notification ut2 saved")
      }
    })
  }
}


}
