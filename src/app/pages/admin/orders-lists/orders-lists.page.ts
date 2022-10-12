import { Component, OnInit } from '@angular/core';
import { ActionSheetController, AlertController } from '@ionic/angular';
import { notifications } from 'src/app/models/notifications';
import { order } from 'src/app/models/orders';
import { ApiService } from 'src/app/services/api.service';
import { HelperService } from 'src/app/services/HelperService/helper.service';
import { NavService } from 'src/app/services/Navigation/nav.service';
import { ToastService } from 'src/app/services/toast/toast.service';

@Component({
  selector: 'app-orders-lists',
  templateUrl: './orders-lists.page.html',
  styleUrls: ['./orders-lists.page.scss'],
})
export class OrdersListsPage implements OnInit {
  OrderList=[]
  constructor(
    public nav:NavService,
    public api:ApiService,
    public helper:HelperService,
    public actionCtrl:ActionSheetController,
    public toast:ToastService,
    public alertCtrl:AlertController
  ) { }

  ngOnInit() {
    let p = this.api.getOrderList();
    p.snapshotChanges().subscribe(res => {
      this.OrderList = [];
      res.forEach(item => {
        let a = item.payload.toJSON();
        a['key'] = item.key;
     
        this.OrderList.push(a as order);
        
        })
      })
  }

  async presentActionSheet(id,obj,isblocked) {
    let btnText=isblocked==1?"Active Order":"InActive Order"
    let actionSheet =await this.actionCtrl.create({
    mode:"md",
      buttons: [
        {
         
          text: 'View Order',
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
          text: 'Delete Order',
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
            this.DeleteOrder(id)
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
      message: 'Do you want to InActive?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Inactive',
          cssClass:"text-danger",
          handler: () => {
            this.Inactive(id)
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
      message: 'Do you want to Active?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Active',
          cssClass:"text-success",
          handler: () => {
            this.Active(id)
            console.log('user unblock click');
          }
        }
        
      ]
    });
    alert.present();
  }

  async ShowDetail(data) {
  let message=data.BizmanName +" give an order to "+data.InfluencerName+" which cost Rs"+data.Price +"<br><br>"+
  "Delevery Date :"+data.DeleveryDate;
    let alert =await this.alertCtrl.create({
      header:"Order detail",
      message: message,
      subHeader:"Order Created "+data.OrderCreatedDateTime.split(" ")[0],
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



Inactive(id){
  this.api.InActiveActiveOrder(id,0).then((data)=>{
    this.toast.ShowToast("Order InActive Successfully",'s');
    // this.SaveNotification(2,obj)

  })
}

Active(id){
  this.api.InActiveActiveOrder(id,1).then((data)=>{
    this.toast.ShowToast("Order Active Successfully",'s');

  })
}

DeleteOrder(id){
  this.api.deleteOrder(id);
  this.toast.ShowToast("Order  Deleted",'s');
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
