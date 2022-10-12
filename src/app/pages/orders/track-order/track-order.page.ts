import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertController, MenuController, ModalController, PopoverController } from '@ionic/angular';
import * as moment from 'moment';
import { UpdateOrderStatusComponent } from 'src/app/components/update-order-status/update-order-status.component';
import { notifications } from 'src/app/models/notifications';
import { Rooms } from 'src/app/models/rooms';
import { ApiService } from 'src/app/services/api.service';
import { HelperService } from 'src/app/services/HelperService/helper.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { NavService } from 'src/app/services/Navigation/nav.service';
import { ToastService } from 'src/app/services/toast/toast.service';

@Component({
  selector: 'app-track-order',
  templateUrl: './track-order.page.html',
  styleUrls: ['./track-order.page.scss'],
})
export class TrackOrderPage implements OnInit {
  OrderID;
  OrderDetail;
  constructor(
    public local:LocalStorageService,
    public api:ApiService,
    public nav:NavService,
    public helper:HelperService,
    private menu:MenuController,
    private toast:ToastService,
    private modal:ModalController,
    private popup:PopoverController,
    private route:ActivatedRoute,
    public alertCtrl:AlertController
 
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.OrderID = params['orderid']; 

    this.api.getOrderByID(this.OrderID).valueChanges().subscribe(res=>{
      if(res !=undefined){
        this.OrderDetail=res
        if(this.OrderDetail.isSubmited==true &&  this.OrderDetail.isReviewed==true)
        {
       this.GetOrderReview();
      }
    }

    })
  });
  }


  GetCommentTime(datetime){
  var date = moment(datetime, "DD-MM-YYYY hh:mm:ss A").fromNow();
  //  var time= moment(moment(datetime).format("DD-MM-YYYY hh:mm:ss A")).fromNow();
   return date;
  }

  async UpdateOrder() {
    this.OrderDetail['key']=this.OrderID;
    this.helper.setOrderData(this.OrderDetail)
      const modal = await this.modal.create({
        component: UpdateOrderStatusComponent
      });
      modal.onDidDismiss().then((data) => {
      
      });
      return await modal.present();

  

}
sendMessage(){
  if(this.OrderDetail.isSubmited==true &&  this.OrderDetail.isReviewed==true)
  {
    this.toast.ShowToast("You can't message whene order completed. Thanks",'e')
}
else
{
  this.isRoomExist().then((result)=>{
    if(result==true){
    this.local.get("AuthKey").then((key)=>{
      if(key){
        let obj:Rooms={
          BizmanID:this.OrderDetail.BizmanID,
          CreatedDateTime:this.helper.formateDatePK(),
          ModefiedDateTime:"",
          isActive:true,
          BizmanName:this.OrderDetail.BizmanName,
          InfluencerName:this.OrderDetail.InfluencerName,
          InfluencerID:this.OrderDetail.InfluencerID,
          chat:[]
        }
        this.api.CreateRoom(obj).then((data)=>{
          if(data !=undefined){
            this.nav.openChat(data);
          }
        })
      }
    })
  }
  else
  {
    this.nav.openChat(result);
  }
  });

}

}

isRoomExist():Promise<any>{
  return new Promise((resolve,reject)=>{
    this.local.get("userData").then((data1)=>{
      if(data1 !=undefined){
        let key=data1.UserType=="1"?this.OrderDetail.BizmanID:this.OrderDetail.InfluencerID;
      this.api.isRoomExist(key).then((data)=>{
        if(data==false){
          return resolve(true)
        }
        else
        {
          return resolve(data)
        }
    })
  }
    })


  });
}

UpdateOrderSubmit(){
  let key=this.OrderID;
  let obj={
     isSubmited:true,
     Status:"C",
     ModifiedOn:this.helper.formateDatePK(),
     WaitingForReview:true,
     isReviewed:false,
  }
  this.api.UpdateOrderSubmit(key,obj).then((data)=>{
    if(data){
      this.SaveSubmitNotification()
    this.toast.ShowToast("Order Submited to Businessman.wait for review",'s');
    }
    else
    {
    this.toast.ShowToast("Order status updated failed",'e');
    }
  })
}
SaveSubmitNotification(){
 let n:notifications={
   $key:"",
   Title:"Order Completed",
   Message:this.OrderDetail.InfluencerName+" submit order as completed go and review now.",
   InfluencerID:this.OrderDetail.InfluencerID,
   InfluencerName:this.OrderDetail.InfluencerName,
   PostID:"",
   ProposalID:"",
   OrderID:this.OrderID,
   BizmanID:this.OrderDetail.BizmanID,
   BizmanName:this.OrderDetail.BizmanName,
   Status:"P",
   Type:"orderCompleted",
   isSeen:false,
   UserType:'1',
   isDismiss:false,
   isActive:true,
   CreatedDateTime:this.helper.formateDatePK(),
   ModifiedOn:"",
   SeenDateTime:"",
   WalletID:''

 }
 this.api.SaveNotification(n).then((data)=>{
   if(data){
     console.log("order notification ut2 saved")
   }
 })

}

async OrderConfirmSubmit() {
  let alert =await this.alertCtrl.create({
    header:"Confirm Submit",
    message: 'Do you want to submit order?',
    buttons: [
      {
        text: 'No',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      },
      {
        text: 'Yes',
        handler: () => {
          this.UpdateOrderSubmit()
          console.log('order submit clicked');
        }
      }
    ]
  });
  alert.present();
}

GotoReviewOrder(){
  this.helper.setOrderData(this.OrderDetail);
  this.helper.setOrderID(this.OrderID);
  this.nav.goto_revieworder();
}


Review(){
  return new Promise((resolve,reject)=>{
    this.api.geInfluencerOrderReview(this.OrderID).then((data)=>{
      if(data==null){}
      else
      {
        return resolve(data);
      }
    })
  })
}
ReviewData:any;
GetOrderReview(){
  this.Review().then((data:any)=>{
    if(data){
      this.api.getReview(data).then((rev)=>{
        if(rev){
          this.ReviewData=rev;
        }
      })
    }
  })
}

}
