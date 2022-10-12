import { Component, OnInit } from '@angular/core';
import { ActionSheetController, AlertController } from '@ionic/angular';
import { notifications } from 'src/app/models/notifications';
import { UsersRegistration } from 'src/app/models/usersRegistration';
import { ApiService } from 'src/app/services/api.service';
import { HelperService } from 'src/app/services/HelperService/helper.service';
import { NavService } from 'src/app/services/Navigation/nav.service';
import { ToastService } from 'src/app/services/toast/toast.service';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.page.html',
  styleUrls: ['./users-list.page.scss'],
})
export class UsersListPage implements OnInit {
  UsersList=[]
  constructor(
    public nav:NavService,
    public api:ApiService,
    public helper:HelperService,
    public actionCtrl:ActionSheetController,
    public toast:ToastService,
    public alertCtrl:AlertController
  ) { }

  ngOnInit() {
    let p = this.api.getInflauncerList();
    p.snapshotChanges().subscribe(res => {
      this.UsersList = [];
      res.forEach(item => {
        let a = item.payload.toJSON();
        a['key'] = item.key;
        a['Name']=a['FirstName']+" "+a['LastName']
        if(a['UserType'] !=3){
        this.UsersList.push(a as UsersRegistration);
        }
        })
      })
  }

  async presentActionSheet(id,obj,isblocked) {
    let btnText=isblocked==1?"Unblock User":"Block User"
    let actionSheet =await this.actionCtrl.create({
    mode:"md",
      buttons: [
        {
         
          text: 'View User',
          icon:"eye-outline",
          handler: () => {
            // this.PayConfirm(id)
            // this.imageCaptured();
            this.ShowDetail(obj)
          }
        },
        {
          text: btnText,
          icon:"remove-circle-outline",
       
          handler: () => {
            // this.imageCapturedGallery();
            // this.presentAlert(id)
            isblocked==1?this.UnBlockConfirm(id):this.BlockConfirm(id);
          }
        },
        {
          text: 'Delete User',
          icon:"trash-outline",
 
          handler: () => {
            // this.imageCapturedGallery();
            // this.presentAlert(id)
             this.DeleteConfirm(id)
          },
         
         
        },
      ]
    });
    actionSheet.present();
  
  }

  async DeleteConfirm(id) {
    let alert =await this.alertCtrl.create({
      header:"Confirm",
      message: 'Do you want to delete?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Delete',
          cssClass:"text-danger",
          handler: () => {
            this.DeleteUser(id)
            console.log('user delete click');
          }
        }
        
      ]
    });
    alert.present();
  }

  async BlockConfirm(id) {
    let alert =await this.alertCtrl.create({
      header:"Confirm",
      message: 'Do you want to block?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Block',
          cssClass:"text-danger",
          handler: () => {
            this.blockUser(id)
            console.log('user block click');
          }
        }
        
      ]
    });
    alert.present();
  }

  async UnBlockConfirm(id) {
    let alert =await this.alertCtrl.create({
      header:"Confirm",
      message: 'Do you want to Unblock?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Unblock',
          cssClass:"text-success",
          handler: () => {
            this.UnblockUser(id)
            console.log('user unblock click');
          }
        }
        
      ]
    });
    alert.present();
  }

  async ShowDetail(obj) {
    let br="<br>";
    let user=obj.UserType==="1"?"Businessman":"Influencer";
    let ordercount=obj.UserType==="2"?"OrderCount : "+obj.OrderCount+br+br:"";
    let Rating=obj.UserType==="2"?"Rating : "+obj.Rating+br+br:"";
    let detail=
    "Name : "+obj.Name+br+br+
    "UserType : "+user+br+br+
    ordercount+
    Rating+
    "Register :"+"("+this.helper.RelativeTime(obj.CreatedOn)+")"

                
   
    let alert =await this.alertCtrl.create({
      header:"User Derail",
      message: detail,
      subHeader:"Member since "+obj.CreatedOn.split(" ")[0],
      buttons: [
        {
          text: 'Okey',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },        
      ]
    });
    alert.present();
  }



blockUser(id){
  this.api.BlockUser(id).then((data)=>{
    this.toast.ShowToast("User Blocked",'s');
    // this.SaveNotification(2,obj)

  })
}

UnblockUser(id){
  this.api.UnBlockUser(id).then((data)=>{
    this.toast.ShowToast("User UnBlocked",'s');

  })
}

DeleteUser(id){
  this.api.deleteUser(id);
  this.toast.ShowToast("User  Deleted",'s');
  // this.SaveNotification(3,obj)

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
