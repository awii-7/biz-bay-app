import { Component, OnInit } from '@angular/core';
import { ActionSheetController, AlertController, MenuController } from '@ionic/angular';
import { eWallet } from 'src/app/models/eWallet';
import { notifications } from 'src/app/models/notifications';
import { Transactions } from 'src/app/models/transactions';
import { ApiService } from 'src/app/services/api.service';
import { HelperService } from 'src/app/services/HelperService/helper.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { NavService } from 'src/app/services/Navigation/nav.service';
import { ToastService } from 'src/app/services/toast/toast.service';

@Component({
  selector: 'app-users-payments',
  templateUrl: './users-payments.page.html',
  styleUrls: ['./users-payments.page.scss'],
})
export class UsersPaymentsPage implements OnInit {
TransactionList=[]
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
  let t = this.api.getTransactionList();
  t.snapshotChanges().subscribe(res => {
    this.TransactionList = [];
    res.forEach(item => {
      let a = item.payload.toJSON();
      a['key'] = item.key;
      
      this.TransactionList.push(a as Transactions);
      
      })
      for (let index = 0; index < this.TransactionList.length; index++) {
        this.api.getOrderByID(this.TransactionList[index].OrderId).valueChanges().subscribe((result:any)=>{
          
          this.TransactionList[index].isReviewed=result.isReviewed;
          this.TransactionList[index].WaitingForReview=result.WaitingForReview;
          this.TransactionList[index].isSubmited=result.isSubmited;
          this.TransactionList[index].OrderNo=result.OrderNo;
       
      })
      console.log(this.TransactionList)
        
      }
    })
}

async presentActionSheet(id,index,ispaid?) {
  if(ispaid==false){
  let actionSheet =await this.actionCtrl.create({
    
    buttons: [
      {
        text: 'Pay Influencer',
        icon:"cash-outline",
        handler: () => {
          this.PayConfirm(id,index)
          // this.imageCaptured();
        }
      },
      {
        text: 'View Detail',
        icon:"eye-outline",
        handler: () => {
          // this.imageCapturedGallery();
          this.presentAlert(id)
        }
      }
    ]
  });
  actionSheet.present();
}
else
{
  this.toast.ShowToast("Already transfered",'w');
}
}




GetUserName(){
  // this.userList.find(x=>x.)
}

async PayConfirm(id,index) {
  let alert =await this.alertCtrl.create({
    header:"Confirm",
    message: 'Do you want to pay influencer?',
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
          this.PayInfluencer(id,index)
          console.log('Buy clicked');
        }
      }
      
    ]
  });
  alert.present();
}

PayInfluencer(id,index){
  let obj={
    DeleverToInfluencer:true,
    ModifiedOn:this.helper.formateDatePK()
  }
  this.api.UpdateTransaction(id,obj).then((data)=>{
    if(data){
      this.AddToWallet(index)
      this.toast.ShowToast("payment transfered to Influencer",'s');
    }
  })
}

user(id){

}

  async presentAlert(id) {
    let text=""

let data=this.TransactionList.find(x=>x.key==id);
let complete=data.isSubmited==true && data.isReviewed==true
let incompleted=data.isSubmited==false && data.isReviewed==false
let waiting=data.isSubmited==true && data.isReviewed==false

if(complete){text="<br><br><span class='text-success'>Order Completed</span>"}
if(incompleted){text="<br><br><span class='text-danger'>Order Incomplete</span>"}
if(waiting){text="<br><br><span class='text-warning'>Waiting for Review</span>"}


let message=data.BizmanName +" accept "+data.InfluencerName+" proposal and Rs"+data.OrderAmount +" paid for order.Your 5% amount of total is Rs"+
data.AdminTax +" and the amount that will be paid to influencer is Rs"+ data.FinalAmount +text






  let alert = await this.alertCtrl.create({
    header:"Detail",
    message:message,
    
    buttons: ['Dismiss']
  });
   alert.present();
}

AddToWallet(index){
  let key=index.InfluencerID;

  this.isWalletREgistered(key).then((walletKey:any)=>{
    if(walletKey){
      let b=(Number(walletKey.Balance) +Number(index.FinalAmount));
      let obj={
        Balance:b,
        ModifiedOn:this.helper.formateDatePK()
      }

      this.api.updateWallet(walletKey.key,obj).then((result)=>{
        if(result){
          this.SaveSubmitNotification(walletKey.key,index)
          console.log("Money transfered to influencer with existing record updated");
        }
      })

   
  }
  else if(walletKey==null)
  {
    let wallet:eWallet={
      Balance:index.FinalAmount,
      CreatedOn:this.helper.formateDatePK(),
      ModifiedOn:"",
      Status:"C",
      isActive:true,
      isBlock:false,
      userID:index.InfluencerID,
    }

    this.api.AddtoWallet(wallet).then((data)=>{
      if(data){
        this.SaveSubmitNotification(data,index)
        console.log("money transfered to influencer");
      }
    })
  }
  })


}


isWalletREgistered(userid){

  return new Promise((resolve,reject)=>{
    this.api.isWalletExist(userid).then((wallet)=>{
      if(wallet){
        return resolve(wallet)
      }
      else if(wallet==null){
        return resolve(null)
      }
    })
  })
  
}

SaveSubmitNotification(key,index){
  let n:notifications={
    $key:"",
    Title:"Payment Recived",
    Message:"Admin transfered Rs"+index.FinalAmount +" to your wallet ",
    InfluencerID:index.InfluencerID,
    InfluencerName:index.InfluencerName,
    PostID:"",
    ProposalID:"",
    OrderID:"",
    BizmanID:"",
    BizmanName:"",
    WalletID:key,
    Status:"P",
    Type:"addedtoWallet",
    isSeen:false,
    UserType:'2',
    isDismiss:false,
    isActive:true,
    CreatedDateTime:this.helper.formateDatePK(),
    ModifiedOn:"",
    SeenDateTime:"",
   
 
  }
  this.api.SaveNotification(n).then((data)=>{
    if(data){
      console.log("order notification ut2 saved")
    }
  })
 
 }

}
