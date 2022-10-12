import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';
import * as moment from 'moment';
import { AddCardComponent } from 'src/app/components/add-card/add-card.component';
import { notifications } from 'src/app/models/notifications';
import { Transactions } from 'src/app/models/transactions';
import { ApiService } from 'src/app/services/api.service';
import { HelperService } from 'src/app/services/HelperService/helper.service';
import { NavService } from 'src/app/services/Navigation/nav.service';
import { ToastService } from 'src/app/services/toast/toast.service';
import { ThankYouComponent } from '../thank-you/thank-you.component';

@Component({
  selector: 'app-pay-order',
  templateUrl: './pay-order.page.html',
  styleUrls: ['./pay-order.page.scss'],
})
export class PayOrderPage implements OnInit {
OrderData:any;
CardList=[];
OrderID:""

isShow=false;
  constructor(
    public nav:NavService,
    private api: ApiService,
    private router: Router,
    public fb: FormBuilder,
    public helper:HelperService,
    public route:ActivatedRoute,
    public toast:ToastService,
    public modal:ModalController,
    public alertCtrl:AlertController
  ) {
    this.isShow=false;
    this.OrderData=this.helper.getOrderData();
    console.log(this.OrderData)
   }

   
   AccountBalance=0;
   CardAdded:string;
   ModifiedOn:string;
   ngOnInit() {
    
    let card = this.api.getCardList();
    card.snapshotChanges().subscribe(res => {
      if(res.length>0){
      this.CardList = [];
     let tempArr=[]
      res.forEach(item => {
        let a = item.payload.toJSON();
        a['key'] = item.key;
        tempArr.push(a);

        if(this.helper.userData.UserType=="1"){
          this.CardList=tempArr.filter(x=>x.BizmanID==this.helper.userData.$key)
          if(this.CardList.length>0){
            console.log(this.CardList)
            this.AccountBalance=this.CardList[0].AccountBalance
            this.CardAdded=moment(this.CardList[0].CreatedOn, "DD-MM-YYYY hh:mm:ss A").fromNow();
            this.ModifiedOn=this.CardList[0].ModifiedOn==""?"-":moment(this.CardList[0].ModifiedOn, "DD-MM-YYYY hh:mm:ss A").fromNow();

            this.isShow=true;
          }
          else if(this.CardList.length==0){
            this.isShow=false;
            this.AccountBalance=0
            this.CardAdded=""
            this.ModifiedOn="-"
          }
        }
      })
    }
    else
    {
        this.isShow=false;
        this.AccountBalance=0
        this.CardAdded=""
        this.ModifiedOn="-"
      
    }
    })
  }

  async OpenAddCardModal() {

      const modal = await this.modal.create({
        component: AddCardComponent
      });
      modal.onDidDismiss().then((data) => {
      
      });
      return await modal.present();
  }

  async presentConfirm(id) {
    let alert =await this.alertCtrl.create({
      header:"Confirm",
      message: 'Do you want to remove this card?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Ok',
          handler: () => {
            this.DeleteCard(id);
            console.log('Buy clicked');
          }
        }
      ]
    });
    alert.present();
  }

  DeleteCard(id){
    this.api.deleteCard(id);
  }



  MakeOrder(){
    return new Promise((resolve,reject)=>{
    this.OrderData['CreatedDateTime']=this.helper.formateDatePK()
    this.OrderData['RemainingDateTime']=this.helper.RelativeTime(this.OrderData.DeleveryDate)
    this.api.GenerateOrder(this.OrderData).then((d:any)=>{
    if(d){
      this.OrderID=d
      this.OrderData['OrderID']=this.OrderID;
      this.api.UpdateProposal(this.OrderData.ProposalID,"C");//Update Proposal status to confirmed
      this.SaveBizmanNotification(this.OrderData); //Send Notification to bizman about order placed
      this.SaveInfluencerNotification(this.OrderData);//Send Notification to influencer about order placed
      this.MakeTransaction(this.OrderData) //Save Order Transaction later for transaction history will be maintain from admin
      let Email=this.helper.userData.Email;
      let Name=this.helper.userData.FirstName+" "+this.helper.userData.LastName;
      let greeting=this.helper.generateGreetings(); //method to generate Greeting like | Good Morning | Good Evening
      let deleverin=this.OrderData.RemainingDateTime;
      this.helper.OrderPlaceEmail_Bizman(Email,Name,this.OrderData.OrderNo,this.OrderData.CreatedDateTime,
        this.OrderData.DeleveryDate,this.OrderData.Price,deleverin,greeting);//Method to send Order place email to Businessman on thier email
        this.UpdateCardAmount(); //Method to Update Card Amount like  Remainig = OrderAmount-TotalCardAmount
      return resolve(this.OrderID);//At the end return Order id for further operation
    }
  })
})
    
  }


  SaveBizmanNotification(Obj:any){
    if(Obj !=undefined){
      let n:notifications={
        $key:"",
        Title:"Proposal Accepted",
        Message:"Order assigned to ",
        InfluencerID:Obj.InfluencerID,
        InfluencerName:Obj.InfluencerName.split(" ")[0],
        PostID:Obj.PostID,
        ProposalID:Obj.ProposalID,
        OrderID:this.OrderID,
        BizmanID:Obj.BizmanID,
        BizmanName:Obj.BizmanName.split(" ")[0],
        Status:"P",
        Type:"orderCreated",
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
          console.log("order notification ut1 saved")
       
        }
      })
    }
  }
  SaveInfluencerNotification(Obj){
    if(Obj !=undefined){
      let n:notifications={
        $key:"",
        Title:"Proposal Accepted",
        Message:"You have an order",
        InfluencerID:Obj.InfluencerID,
        InfluencerName:Obj.InfluencerName,
        PostID:Obj.PostID,
        ProposalID:Obj.ProposalID,
        OrderID:this.OrderID,
        BizmanID:Obj.BizmanID,
        BizmanName:Obj.BizmanName,
        Status:"P",
        Type:"orderCreated",
        isSeen:false,
        UserType:'2',
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

  async OrderConfirm() {
    let alert =await this.alertCtrl.create({
      header:"Confirm",
      message: 'Do you want to place order?',
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
            if(this.AccountBalance<Number(this.OrderData.Price)){
              this.toast.ShowToast("Your Account balance is less than Order Amount please add new card",'e');
            }
            else{
            this.MakeOrder().then((OrderID)=>{
              if(OrderID){
                this.toast.ShowToast("Order Generated Successfully",'s');
                this.ThankYou(OrderID);
              }
            })
            console.log('Buy clicked');
          }
        }
        }
      ]
    });
    alert.present();
  }


  MakeTransaction(Obj){
    if(Obj !=undefined){
      this.api.getAdminID().then((adminid:any)=>{
        if(adminid){
          let t:Transactions={
            AdminTax:this.helper.CalculateAdminTax(Number(Obj.Price)),
            AdminID:adminid,
            BizmanID:Obj.BizmanID,
            BizmanName:this.helper.userData.FirstName,
            CreatedDateTime:this.helper.formateDatePK(),
            CreditCardID:this.CardList[0].key,
            DeleverToAdmin:true,
            DeleverToInfluencer:false,
            PaymentType:1,
            InfluencerID:Obj.InfluencerID,
            InfluencerName:this.OrderData.InfluencerName.split(" ")[0],
            ModifiedOn:"",
            ReturnToBizman:false,
            OrderAmount:Obj.Price,
            FinalAmount:(Number(Obj.Price)-this.helper.CalculateAdminTax(Number(Obj.Price))),
            TransactionType:"OrderPayment",
            isActive:true,
            OrderId:this.OrderID
          }
          this.api.SaveCreateOrderTrasaction(t).then((data)=>{
            if(data){
              this.SaveBizmanNotificationPaymentDeducted(t);
              console.log("Make order transaction success");
            }
          })
        }
        }
      )
      }
  }

  async ThankYou(orderid) {
    this.helper.setOrderID(orderid);
    const modal = await this.modal.create({
      component: ThankYouComponent
    });
    modal.onDidDismiss().then((data) => {
    console.log(data);
    });
    this.nav.goto_bizdash();
    return await modal.present();
    
}

UpdateCardAmount(){
  let key=this.CardList[0].key;
  let CardBalance=Number(this.CardList[0].AccountBalance);
  let AccountBalance= CardBalance - Number(this.OrderData.Price);
  let obj={
    ModifiedOn:this.helper.formateDatePK(),
    AccountBalance:AccountBalance
  }
  this.api.UpdateCardAmount(key,obj);
}


SaveBizmanNotificationPaymentDeducted(Obj:any){
  if(Obj !=undefined){
    let n:notifications={
      $key:"",
      Title:"Amount Deducted",
      Message:this.OrderData.Price,
      InfluencerID:"",
      InfluencerName:"",
      PostID:"",
      ProposalID:"",
      OrderID:this.OrderID,
      BizmanID:Obj.BizmanID,
      BizmanName:this.helper.userData.FirstName,
      Status:"P",
      Type:"amountDeducted",
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
        console.log("order notification ut1 saved")
     
      }
    })
  }
}












}
